import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PARTS_OF_SPEECH,PARTS_GRADE_PATH,generatePartsLessonQuestions,generatePartsMixedQuestions,partsCourseSummary} from '../js/parts-of-speech.js';
import {GRAMMAR} from '../js/curriculum.js';
import {GRAMMAR_EXTRA} from '../js/content-depth.js';
import {resolveQuestionSkill} from '../js/skills.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

const ids=['nouns','verbs','adjectives','pronouns','adverbs','prepositions','conjunctions','interjections'];

test('Parts of Speech Lab defines all eight parts in a grade-aware sequence',()=>{
  assert.deepEqual(PARTS_OF_SPEECH.map(x=>x.id),ids);
  assert.deepEqual(PARTS_OF_SPEECH.map(x=>x.introduced),[1,1,2,2,3,3,3,4]);
  assert.deepEqual(PARTS_GRADE_PATH[1],['nouns','verbs']);
  assert.deepEqual(PARTS_GRADE_PATH[2],['adjectives','pronouns']);
  assert.deepEqual(PARTS_GRADE_PATH[3],['adverbs','prepositions','conjunctions']);
  assert.ok(PARTS_GRADE_PATH[4].includes('interjections'));
});

test('each dedicated lesson produces valid on-topic mastery questions for every learner grade',()=>{
  for(const part of PARTS_OF_SPEECH)for(let grade=1;grade<=6;grade++){
    const qs=generatePartsLessonQuestions({partId:part.id,grade,difficulty:grade>=5?2:0,count:4,seed:`test-${grade}`});
    assert.equal(qs.length,4);
    for(const q of qs){
      assert.equal(q.subject,'grammar');assert.equal(q.skill,part.id);assert.equal(q.grade,grade);
      assert.equal(q.choices.length,4);assert.equal(new Set(q.choices.map(String)).size,4);assert.ok(q.choices.includes(q.answer));
      assert.equal(q.domain,'parts-of-speech');assert.ok(q.skillId.includes(part.id));assert.ok(q.explanation.length>10);
    }
  }
});

test('mixed mastery includes all eight parts of speech',()=>{
  const qs=generatePartsMixedQuestions({grade:4,difficulty:1,count:8,seed:'all-eight'});
  assert.equal(qs.length,8);assert.deepEqual(new Set(qs.map(q=>q.skill)),new Set(ids));
});

test('normal grade grammar path introduces parts of speech progressively',()=>{
  const prompts=grade=>[...(GRAMMAR[grade]||[]),...(GRAMMAR_EXTRA[grade]||[])].map(x=>String(x[0]).toLowerCase()).join('\n');
  const g1=prompts(1),g2=prompts(2),g3=prompts(3),g4=prompts(4);
  assert.match(g1,/noun/);assert.match(g1,/verb/);assert.doesNotMatch(g1,/adjective|pronoun|adverb|preposition|conjunction|interjection/);
  assert.match(g2,/adjective/);assert.match(g2,/pronoun/);assert.doesNotMatch(g2,/adverb|preposition|conjunction|interjection/);
  assert.match(g3,/adverb/);assert.match(g3,/preposition/);assert.match(g3,/conjunction/);assert.doesNotMatch(g3,/interjection/);
  assert.match(g4,/interjection/);
});

test('interjections resolve to their own tracked parts-of-speech skill',()=>{
  const meta=resolveQuestionSkill({grade:4,subject:'grammar',skill:'interjections',prompt:'Which word is an interjection?'});
  assert.equal(meta.domain,'parts-of-speech');assert.equal(meta.key,'interjections');assert.equal(meta.name,'Interjections');
});

test('course progress can resume and finish without duplicating academic mastery state',()=>{
  assert.deepEqual(partsCourseSummary({completed:{}}),{completed:0,total:8,percent:0,finished:false});
  const completed=Object.fromEntries(ids.map(id=>[id,true]));assert.deepEqual(partsCourseSummary({completed}),{completed:8,total:8,percent:100,finished:true});
});

test('Parts of Speech Lab is a direct polished silo with safe game navigation',()=>{
  const html=read('index.html'),app=read('js/app.js'),css=read('styles.css'),sw=read('sw.js');
  for(const id of ['partsSpeechScreen','partsCourseStartBtn','partsPracticeBtn','partsLessonGrid','partsMixedBtn','partsFinalChallengeBtn','partsSpeechBackBtn','partsSpeechHomeBtn','resultContinueBtn'])assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(html,/data-gameplay="parts-speech"/);assert.match(app,/questionQueue/);assert.match(app,/courseMeta/);assert.match(app,/returnScreen:'partsSpeechScreen'/);assert.match(app,/completePartsRound/);assert.match(app,/continuePartsCourseFromResult/);
  assert.match(css,/v0\.16\.7 PARTS OF SPEECH LAB/);
  for(const asset of ['js/parts-of-speech.js','assets/ui/modes/parts-speech.svg'])assert.ok(sw.includes(`./${asset}`),`offline cache missing ${asset}`);
});
