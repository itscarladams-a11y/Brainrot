import { masteryStateFromScore } from './skills.js';
const pct=(correct,total)=>total?correct/total*100:0;

export function calculateMastery(stats={}){
  const results=Array.isArray(stats.recentResults)?stats.recentResults:[];
  const recent=results.slice(-5),middle=results.slice(-15,-5);
  const lifetime=pct(stats.correct||0,stats.attempts||0);
  const recentPct=recent.length?pct(recent.filter(Boolean).length,recent.length):lifetime;
  const middlePct=middle.length?pct(middle.filter(Boolean).length,middle.length):lifetime;
  const weighted=recentPct*.50+middlePct*.30+lifetime*.20;
  const evidence=Math.min(1,(stats.attempts||0)/8);
  const score=Math.round(weighted*(.55+.45*evidence));
  return Math.max(0,Math.min(100,score));
}

export function updateMasteryRecord(record={},correct,question={}){
  record.attempts=(record.attempts||0)+1;
  if(correct)record.correct=(record.correct||0)+1;
  record.recentResults=Array.isArray(record.recentResults)?record.recentResults:[];
  record.recentResults.push(!!correct);
  record.recentResults=record.recentResults.slice(-20);
  record.lastPracticed=new Date().toISOString();
  record.grade=Number(question.grade)||3;
  record.subject=question.subject||'general';
  record.domain=question.domain||record.domain||'practice';
  record.skillId=question.skillId||record.skillId||'unknown';
  record.skill=question.skill||record.skill||'practice';
  record.skillName=question.skillName||record.skillName||record.skill;
  record.highestDifficulty=Math.max(record.highestDifficulty||0,Number(question.difficulty)||0);
  record.masteryScore=calculateMastery(record);
  record.masteryState=masteryStateFromScore(record.masteryScore,record.attempts).key;
  return record;
}

export function masteryBand(record={}){
  return masteryStateFromScore(Number(record.masteryScore)||0,Number(record.attempts)||0);
}

export function masteryPriority(record={},now=Date.now()){
  const attempts=Number(record.attempts)||0;
  if(!attempts)return 0;
  const score=Number(record.masteryScore)||0;
  const last=Date.parse(record.lastPracticed||'')||now;
  const days=Math.max(0,(now-last)/86400000);
  const weakness=(100-score)*.65;
  const evidence=Math.min(18,attempts*1.5);
  const review=Math.min(20,days*2);
  return weakness+evidence+review;
}
