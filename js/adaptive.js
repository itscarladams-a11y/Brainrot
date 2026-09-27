import { masteryPriority } from './mastery.js';

export function chooseAdaptiveDescriptor(prefs,{grade,subject='mixed',enabledSubjects=[],rng=Math.random}={}){
  const records=Object.values(prefs?.masteryStats||{}).filter(r=>
    Number(r.grade)===Number(grade) &&
    (subject==='mixed'?(!enabledSubjects.length||enabledSubjects.includes(r.subject)):r.subject===subject) &&
    (r.attempts||0)>=2 && (r.masteryScore||0)<85
  );
  if(!records.length)return null;
  const ranked=records.map(r=>({r,priority:masteryPriority(r)*(0.88+rng()*.24)})).sort((a,b)=>b.priority-a.priority);
  if(rng()>.72)return null;
  const best=ranked[0].r;
  return {subject:best.subject,skill:best.skill,skillId:best.skillId,skillName:best.skillName,reason:'mastery'};
}

export function adaptiveDifficultyFor(prefs,skillId,fallback=1){
  const record=skillId?prefs?.masteryStats?.[skillId]:null;
  if(!record||(record.attempts||0)<3)return fallback;
  const score=Number(record.masteryScore)||0;
  if(score<38)return 0;
  if(score>=78)return 2;
  return 1;
}
