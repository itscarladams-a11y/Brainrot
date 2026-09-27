import test from 'node:test';
import assert from 'node:assert/strict';
import {VOCAB,READING,SPELLING,GRAMMAR,SCIENCE,GEO,GENERAL} from '../js/curriculum.js';
import {VOCAB_EXTRA,READING_EXTRA,SPELLING_EXTRA,GRAMMAR_EXTRA,SCIENCE_EXTRA,GEO_EXTRA,GENERAL_EXTRA,EXTRA_BANKS} from '../js/content-depth.js';
import {generateQuestion} from '../js/engine.js';

test('v0.16 supplemental curriculum adds 336 authored items across grades 1-6',()=>{
  const total=Object.values(EXTRA_BANKS).reduce((sum,bank)=>sum+Object.values(bank).reduce((n,rows)=>n+rows.length,0),0);
  assert.equal(total,336);
  for(const bank of Object.values(EXTRA_BANKS))for(let grade=1;grade<=6;grade++)assert.equal(bank[grade].length,8);
});

test('combined authored curriculum now exceeds 1400 items',()=>{
  const base=[VOCAB,READING,SPELLING,GRAMMAR,SCIENCE,GEO,GENERAL].reduce((sum,bank)=>sum+Object.values(bank).reduce((n,rows)=>n+rows.length,0),0);
  const extra=[VOCAB_EXTRA,READING_EXTRA,SPELLING_EXTRA,GRAMMAR_EXTRA,SCIENCE_EXTRA,GEO_EXTRA,GENERAL_EXTRA].reduce((sum,bank)=>sum+Object.values(bank).reduce((n,rows)=>n+rows.length,0),0);
  assert.ok(base+extra>=1400,`combined authored items: ${base+extra}`);
});

test('supplemental multiple-choice content stores four unique choices and one correct answer',()=>{
  for(const bank of [READING_EXTRA,GRAMMAR_EXTRA,SCIENCE_EXTRA,GEO_EXTRA,GENERAL_EXTRA])for(let grade=1;grade<=6;grade++)for(const row of bank[grade]){
    const answer=bank===READING_EXTRA?row[2]:row[1];
    const choices=bank===READING_EXTRA?row[3]:row[2];
    assert.equal(choices.length,4);
    assert.equal(new Set(choices.map(String)).size,4);
    assert.equal(choices.filter(x=>String(x)===String(answer)).length,1);
  }
});

test('engine can draw valid questions from expanded subjects at every grade',()=>{
  for(let grade=1;grade<=6;grade++)for(const subject of ['vocabulary','reading','spelling','grammar','science','geography','general']){
    for(let i=0;i<12;i++){
      const q=generateQuestion({grade,subject,difficulty:i%3});
      assert.equal(q.subject,subject);
      assert.equal(q.choices.length,4);
      assert.ok(q.choices.some(x=>String(x)===String(q.answer)));
    }
  }
});
