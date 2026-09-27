import test from 'node:test';
import assert from 'node:assert/strict';
import {ensureProgressState,recordProgressAnswer,recordSession,progressSnapshot,skillWeaknesses,progressBand} from '../js/progress.js';

const fresh=()=>({grade:4,subjectStats:{},gradeStats:{},skillStats:{},sessionHistory:[]});

test('progress tracking keeps all-time, grade, subject and skill totals',()=>{
  const prefs=fresh();
  recordProgressAnswer(prefs,{grade:4,subject:'science',skill:'food-chains'},true);
  recordProgressAnswer(prefs,{grade:4,subject:'science',skill:'food-chains'},false);
  recordProgressAnswer(prefs,{grade:5,subject:'science',skill:'matter'},true);
  assert.deepEqual(prefs.subjectStats.science,{correct:2,attempts:3});
  assert.equal(prefs.gradeStats['4'].attempts,2);
  assert.equal(prefs.gradeStats['4'].subjects.science.correct,1);
  assert.deepEqual(prefs.skillStats['4'].science['food-chains'],{correct:1,attempts:2});
});

test('session history is grade-filterable and capped',()=>{
  const prefs=fresh();
  for(let i=0;i<65;i++) recordSession(prefs,{grade:i%2?4:5,mode:i%3?'battle':'quiz',subject:'math',score:8,total:10,date:new Date(2026,0,i+1).toISOString()});
  assert.equal(prefs.sessionHistory.length,60);
  assert.ok(progressSnapshot(prefs,4).sessions.every(x=>x.grade===4));
});

test('progress snapshot calculates accuracy and quiz average',()=>{
  const prefs=fresh();
  for(const correct of [true,true,false,true])recordProgressAnswer(prefs,{grade:4,subject:'math',skill:'fractions'},correct);
  recordSession(prefs,{grade:4,mode:'quiz',subject:'math',score:8,total:10});
  recordSession(prefs,{grade:4,mode:'quiz',subject:'math',score:10,total:10});
  const snap=progressSnapshot(prefs,4);
  assert.equal(snap.accuracy,75);
  assert.equal(snap.quizAverage,90);
});

test('weak skill recommendations require practice evidence',()=>{
  const prefs=fresh();
  for(const correct of [false,false,true,false])recordProgressAnswer(prefs,{grade:4,subject:'science',skill:'food-chains'},correct);
  for(const correct of [true,true,true,true])recordProgressAnswer(prefs,{grade:4,subject:'science',skill:'water-cycle'},correct);
  const weak=skillWeaknesses(prefs,4,3);
  assert.equal(weak[0].skill,'food-chains');
  assert.equal(weak[0].accuracy,25);
});

test('progress bands communicate useful parent-facing states',()=>{
  assert.equal(progressBand(null,0).label,'Not started');
  assert.equal(progressBand(90,10).label,'Strong');
  assert.equal(progressBand(75,10).label,'On track');
  assert.equal(progressBand(55,10).label,'Needs practice');
});


test('session history preserves named mastery-practice sessions',()=>{
  const prefs={grade:3};ensureProgressState(prefs);
  recordSession(prefs,{grade:3,mode:'battle',subject:'mixed',label:'MASTERY PRACTICE',score:4,total:5});
  assert.equal(prefs.sessionHistory[0].label,'MASTERY PRACTICE');
  assert.equal(prefs.sessionHistory[0].score,4);
});

test('interaction telemetry records response time without changing academic totals',()=>{
  const prefs={grade:4};
  recordProgressAnswer(prefs,{grade:4,subject:'math',skill:'multiplication',interactionType:'number-input'},true,{interactionType:'number-input',responseTimeMs:2400,firstAttempt:true});
  assert.equal(prefs.gradeStats['4'].correct,1);
  assert.equal(prefs.interactionStats['number-input'].attempts,1);
  assert.equal(prefs.interactionStats['number-input'].correct,1);
  assert.equal(prefs.interactionStats['number-input'].responseTimeTotalMs,2400);
  assert.equal(prefs.dailyStats[Object.keys(prefs.dailyStats)[0]].interactions['number-input'].questions,1);
});

test('resurfaced practice is tracked separately without changing normal totals',()=>{
  const prefs={};
  const q={grade:4,subject:'math',skill:'multiplication',skillId:'g4-math-arithmetic-multiplication',skillName:'Multiplication',difficulty:1};
  recordProgressAnswer(prefs,q,true,{interactionType:'number-input',responseTimeMs:1200,resurfaced:true});
  assert.equal(prefs.subjectStats.math.attempts,1);
  assert.equal(prefs.resurfacedStats.attempts,1);
  assert.equal(prefs.resurfacedStats.correct,1);
});
