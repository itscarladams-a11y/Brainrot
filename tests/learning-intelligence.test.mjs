import test from 'node:test';
import assert from 'node:assert/strict';
import {generateQuestion,SUBJECT_KEYS} from '../js/engine.js';
import {ensureProgressState,recordProgressAnswer,progressSnapshot,recommendedSkills} from '../js/progress.js';
import {calculateMastery,masteryBand} from '../js/mastery.js';
import {chooseAdaptiveDescriptor,adaptiveDifficultyFor} from '../js/adaptive.js';

function seeded(seed=1){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

test('every generated question receives stable learning metadata',()=>{
  const rng=seeded(10010);
  for(let grade=1;grade<=6;grade++)for(const subject of SUBJECT_KEYS)for(let i=0;i<25;i++){
    const q=generateQuestion({grade,subject,rng});
    assert.match(q.skillId,new RegExp(`^g${grade}-`));
    assert.ok(q.domain);
    assert.ok(q.skillName);
  }
});

test('skill ids are stable for the same question concept',()=>{
  const a=generateQuestion({grade:4,subject:'math',skill:'fraction-equivalent',difficulty:1,rng:seeded(4)});
  const b=generateQuestion({grade:4,subject:'math',skill:'fraction-equivalent',difficulty:1,rng:seeded(9)});
  assert.equal(a.skillId,'g4-math-fractions-equivalent-fractions');
  assert.equal(b.skillId,a.skillId);
});

test('progress schema migrates forward without deleting old totals',()=>{
  const prefs={grade:4,lifetimeCorrect:77,subjectStats:{math:{correct:4,attempts:5}}};
  ensureProgressState(prefs);
  assert.equal(prefs.progressSchemaVersion,5);
  assert.equal(prefs.lifetimeCorrect,77);
  assert.deepEqual(prefs.subjectStats.math,{correct:4,attempts:5});
  assert.deepEqual(prefs.masteryStats,{});
  assert.deepEqual(prefs.dailyStats,{});
});

test('mastery weights recent performance and requires evidence',()=>{
  const weakEarly={attempts:10,correct:6,recentResults:[false,false,false,false,false,true,true,true,true,true]};
  const weakLate={attempts:10,correct:6,recentResults:[true,true,true,true,true,false,false,false,false,false]};
  assert.ok(calculateMastery(weakEarly)>calculateMastery(weakLate));
  const oneLucky={attempts:1,correct:1,recentResults:[true]};
  assert.ok(calculateMastery(oneLucky)<80);
});

test('answer tracking builds skill mastery and parent snapshot counts mastered skills',()=>{
  const prefs={grade:4};ensureProgressState(prefs);
  const q=generateQuestion({grade:4,subject:'math',skill:'multiplication',rng:seeded(7)});
  for(let i=0;i<10;i++)recordProgressAnswer(prefs,q,true);
  const record=prefs.masteryStats[q.skillId];
  assert.equal(record.attempts,10);
  assert.ok(record.masteryScore>=80);
  assert.equal(masteryBand(record).label,'Mastered');
  const snap=progressSnapshot(prefs,4);
  assert.equal(snap.skillsTracked,1);
  assert.equal(snap.skillsMastered,1);
});

test('recommendations prioritize weak practiced skills',()=>{
  const prefs={grade:4};ensureProgressState(prefs);
  const weak=generateQuestion({grade:4,subject:'math',skill:'division',rng:seeded(1)});
  const strong=generateQuestion({grade:4,subject:'math',skill:'multiplication',rng:seeded(2)});
  for(const ok of [false,false,false,true])recordProgressAnswer(prefs,weak,ok);
  for(const ok of [true,true,true,true,true,true])recordProgressAnswer(prefs,strong,ok);
  const recs=recommendedSkills(prefs,4,3);
  assert.equal(recs[0].skillId,weak.skillId);
});

test('adaptive selector can target a weak practiced skill and lower difficulty',()=>{
  const prefs={grade:4};ensureProgressState(prefs);
  const q=generateQuestion({grade:4,subject:'math',skill:'division',rng:seeded(3)});
  for(const ok of [false,false,false,false])recordProgressAnswer(prefs,q,ok);
  const desc=chooseAdaptiveDescriptor(prefs,{grade:4,subject:'math',enabledSubjects:['math'],rng:()=>0});
  assert.ok(desc);
  assert.equal(desc.skillId,q.skillId);
  assert.equal(adaptiveDifficultyFor(prefs,q.skillId,2),0);
});
