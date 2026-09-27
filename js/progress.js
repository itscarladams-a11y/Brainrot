import { updateMasteryRecord, masteryBand, masteryPriority } from './mastery.js';
const clampPercent=(correct,attempts)=>attempts?Math.round(correct/attempts*100):null;
const bump=(obj,correct)=>{obj.attempts=(obj.attempts||0)+1;if(correct)obj.correct=(obj.correct||0)+1;};
const dayKey=(value=new Date())=>{
  const d=new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export function ensureProgressState(prefs){
  prefs.progressSchemaVersion=Math.max(5,Number(prefs.progressSchemaVersion)||0);
  if(!prefs.subjectStats||typeof prefs.subjectStats!=='object')prefs.subjectStats={};
  if(!prefs.gradeStats||typeof prefs.gradeStats!=='object')prefs.gradeStats={};
  if(!prefs.skillStats||typeof prefs.skillStats!=='object')prefs.skillStats={};
  if(!prefs.masteryStats||typeof prefs.masteryStats!=='object')prefs.masteryStats={};
  if(!prefs.dailyStats||typeof prefs.dailyStats!=='object')prefs.dailyStats={};
  if(!prefs.interactionStats||typeof prefs.interactionStats!=='object')prefs.interactionStats={};
  if(!prefs.resurfacedStats||typeof prefs.resurfacedStats!=='object')prefs.resurfacedStats={correct:0,attempts:0};
  if(!Array.isArray(prefs.sessionHistory))prefs.sessionHistory=[];
  return prefs;
}

export function recordProgressAnswer(prefs,question,correct,meta={}){
  ensureProgressState(prefs);
  const grade=String(question?.grade||prefs.grade||3);
  const subject=question?.subject||'general';
  const skill=question?.skill||'general-practice';
  const interactionType=meta.interactionType||question?.interactionType||'choice';
  const responseTimeMs=Math.max(0,Number(meta.responseTimeMs)||0);
  const resurfaced=!!meta.resurfaced;
  prefs.subjectStats[subject]??={correct:0,attempts:0};
  bump(prefs.subjectStats[subject],correct);
  prefs.gradeStats[grade]??={correct:0,attempts:0,subjects:{}};
  const gradeNode=prefs.gradeStats[grade];
  gradeNode.subjects??={};
  bump(gradeNode,correct);
  gradeNode.subjects[subject]??={correct:0,attempts:0};
  bump(gradeNode.subjects[subject],correct);
  prefs.skillStats[grade]??={};
  prefs.skillStats[grade][subject]??={};
  prefs.skillStats[grade][subject][skill]??={correct:0,attempts:0};
  bump(prefs.skillStats[grade][subject][skill],correct);
  prefs.interactionStats[interactionType]??={correct:0,attempts:0,responseTimeTotalMs:0,responseTimeSamples:0};
  const interaction=prefs.interactionStats[interactionType];
  bump(interaction,correct);
  if(responseTimeMs>0){interaction.responseTimeTotalMs=(interaction.responseTimeTotalMs||0)+responseTimeMs;interaction.responseTimeSamples=(interaction.responseTimeSamples||0)+1;}
  if(resurfaced)bump(prefs.resurfacedStats,correct);

  if(question?.skillId){
    prefs.masteryStats[question.skillId]??={skillId:question.skillId,attempts:0,correct:0,recentResults:[]};
    updateMasteryRecord(prefs.masteryStats[question.skillId],correct,question);
  }

  const key=dayKey();
  prefs.dailyStats[key]??={questions:0,correct:0,subjects:{}};
  const daily=prefs.dailyStats[key];
  if(resurfaced){daily.resurfaced??={questions:0,correct:0};daily.resurfaced.questions++;if(correct)daily.resurfaced.correct++;}
  daily.questions++;
  if(correct)daily.correct++;
  daily.subjects[subject]??={questions:0,correct:0};
  daily.subjects[subject].questions++;
  if(correct)daily.subjects[subject].correct++;
  daily.interactions??={};
  daily.interactions[interactionType]??={questions:0,correct:0,responseTimeTotalMs:0,responseTimeSamples:0};
  const dailyInteraction=daily.interactions[interactionType];dailyInteraction.questions++;if(correct)dailyInteraction.correct++;if(responseTimeMs>0){dailyInteraction.responseTimeTotalMs+=responseTimeMs;dailyInteraction.responseTimeSamples++;}
  daily.grades??={};
  daily.grades[grade]??={questions:0,correct:0,subjects:{}};
  const dailyGrade=daily.grades[grade];
  dailyGrade.questions++;
  if(correct)dailyGrade.correct++;
  dailyGrade.subjects[subject]??={questions:0,correct:0};
  dailyGrade.subjects[subject].questions++;
  if(correct)dailyGrade.subjects[subject].correct++;
  const keys=Object.keys(prefs.dailyStats).sort();
  for(const stale of keys.slice(0,Math.max(0,keys.length-90)))delete prefs.dailyStats[stale];
}

export function recordSession(prefs,session){
  ensureProgressState(prefs);
  prefs.sessionHistory.unshift({
    date:session.date||new Date().toISOString(),
    grade:Number(session.grade||prefs.grade||3),
    mode:session.mode==='quiz'?'quiz':'battle',
    subject:session.subject||'mixed',
    label:session.label||null,
    score:Number(session.score)||0,
    total:Math.max(1,Number(session.total)||1),
    bestStreak:Number(session.bestStreak)||0,
    adaptivePicks:Number(session.adaptivePicks)||0,
    difficultyProfile:['normal','hard','extreme'].includes(session.difficultyProfile)?session.difficultyProfile:'normal'
  });
  prefs.sessionHistory=prefs.sessionHistory.slice(0,60);
}

export function masteryRecords(prefs,grade='all',subject='all'){
  ensureProgressState(prefs);
  return Object.values(prefs.masteryStats||{}).filter(r=>(String(grade)==='all'||String(r.grade)===String(grade))&&(subject==='all'||r.subject===subject));
}

export function progressSnapshot(prefs,grade='all'){
  ensureProgressState(prefs);
  let correct=0,attempts=0,subjectStats={};
  if(String(grade)==='all'){
    subjectStats=prefs.subjectStats||{};
    for(const stats of Object.values(subjectStats)){correct+=stats.correct||0;attempts+=stats.attempts||0;}
  }else{
    const node=prefs.gradeStats?.[String(grade)]||{};
    correct=node.correct||0;attempts=node.attempts||0;subjectStats=node.subjects||{};
  }
  const sessions=(prefs.sessionHistory||[]).filter(s=>String(grade)==='all'||String(s.grade)===String(grade));
  const quizzes=sessions.filter(s=>s.mode==='quiz');
  const quizAverage=quizzes.length?Math.round(quizzes.reduce((sum,s)=>sum+s.score/s.total*100,0)/quizzes.length):null;
  const records=masteryRecords(prefs,grade);
  const mastered=records.filter(r=>(r.attempts||0)>=8&&(r.masteryScore||0)>=80).length;
  const masteryAverage=records.length?Math.round(records.reduce((n,r)=>n+(r.masteryScore||0),0)/records.length):null;
  return {correct,attempts,accuracy:clampPercent(correct,attempts),subjectStats,sessions,quizAverage,skillsTracked:records.length,skillsMastered:mastered,masteryAverage,masteryRecords:records};
}

export function skillWeaknesses(prefs,grade,limit=3){
  ensureProgressState(prefs);
  const records=masteryRecords(prefs,grade).filter(r=>(r.attempts||0)>=3);
  if(records.length){
    return records.sort((a,b)=>(a.masteryScore||0)-(b.masteryScore||0)||(b.attempts||0)-(a.attempts||0)).slice(0,limit).map(r=>({subject:r.subject,skill:r.skill,skillId:r.skillId,skillName:r.skillName,correct:r.correct||0,attempts:r.attempts||0,accuracy:clampPercent(r.correct||0,r.attempts||0),masteryScore:r.masteryScore||0,masteryState:masteryBand(r).label}));
  }
  if(String(grade)==='all')return [];
  const out=[];
  const gradeSkills=prefs.skillStats?.[String(grade)]||{};
  for(const [subject,skills] of Object.entries(gradeSkills))for(const [skill,stats] of Object.entries(skills||{})){
    if((stats.attempts||0)<3)continue;
    out.push({subject,skill,correct:stats.correct||0,attempts:stats.attempts||0,accuracy:clampPercent(stats.correct||0,stats.attempts||0)});
  }
  return out.sort((a,b)=>a.accuracy-b.accuracy||b.attempts-a.attempts).slice(0,limit);
}

export function recommendedSkills(prefs,grade='all',limit=4){
  return masteryRecords(prefs,grade).filter(r=>(r.attempts||0)>=2&&(r.masteryScore||0)<85).map(r=>({...r,priority:masteryPriority(r),band:masteryBand(r)})).sort((a,b)=>b.priority-a.priority).slice(0,limit);
}

export function progressBand(accuracy,attempts){
  if(!attempts)return {key:'new',label:'Not started'};
  if(attempts<5)return {key:'starting',label:'Getting started'};
  if(accuracy>=85)return {key:'strong',label:'Strong'};
  if(accuracy>=70)return {key:'ontrack',label:'On track'};
  return {key:'practice',label:'Needs practice'};
}
