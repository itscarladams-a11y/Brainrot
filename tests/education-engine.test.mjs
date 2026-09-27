import test from 'node:test';
import assert from 'node:assert/strict';
import {generateQuestion,generateUniqueQuestion,questionFingerprint,generateReviewQuestion,isCorrect,nextDifficulty,rageLevel,quizGrade,SUBJECT_KEYS} from '../js/engine.js';
import {VOCAB,READING,SPELLING,GRAMMAR,SCIENCE,GEO,GENERAL} from '../js/curriculum.js';

function seeded(seed=1){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}

const BANKS={VOCAB,READING,SPELLING,GRAMMAR,SCIENCE,GEO,GENERAL};
const AUTHORED_SUBJECTS=['vocabulary','reading','spelling','grammar','science','geography','general'];

test('all subjects generate valid grade 1-6 questions',()=>{
  let count=0;
  for(let grade=1;grade<=6;grade++){
    for(const subject of SUBJECT_KEYS){
      for(let difficulty=0;difficulty<=2;difficulty++){
        const rng=seeded(grade*1000+difficulty*100+SUBJECT_KEYS.indexOf(subject));
        for(let i=0;i<40;i++){
          const q=generateQuestion({grade,subject,difficulty,rng});
          assert.equal(q.grade,grade);
          assert.equal(q.subject,subject);
          assert.equal(q.choices.length,4);
          assert.equal(new Set(q.choices.map(String)).size,4);
          assert.ok(q.choices.map(String).includes(String(q.answer)));
          assert.ok(q.prompt.length>0);
          assert.ok(q.explanation.length>0);
          if(q.visualType==='clock'){
            assert.ok(q.visualData.hour>=1&&q.visualData.hour<=12);
            assert.ok(q.visualData.minute>=0&&q.visualData.minute<60);
          }
          count++;
        }
      }
    }
  }
  assert.equal(count,7200);
});

test('upper-grade math introduces advanced skills',()=>{
  const skills=new Set(),rng=seeded(65009);
  for(let i=0;i<1200;i++) skills.add(generateQuestion({grade:6,subject:'math',skill:'mixed',difficulty:2,rng}).skill);
  for(const skill of ['decimal-addition','decimal-subtraction','fraction-equivalent','fraction-of-number','percent-of-number']) assert.ok(skills.has(skill),`grade 6 never generated ${skill}`);
});

test('mixed mode stays inside enabled subject set',()=>{
  const rng=seeded(42),allowed=['time','vocabulary','science'];
  for(let i=0;i<500;i++){
    const q=generateQuestion({grade:5,subject:'mixed',subjects:allowed,rng});
    assert.ok(allowed.includes(q.subject));
  }
});

test('review questions match the missed subject and grade through grade 6',()=>{
  const rng=seeded(99);
  for(const grade of [4,5,6]) for(const subject of SUBJECT_KEYS){
    const q=generateQuestion({grade,subject,difficulty:2,rng});
    const r=generateReviewQuestion(q,{rng});
    assert.equal(r.subject,q.subject);
    assert.equal(r.grade,q.grade);
    assert.ok(r.difficulty<=q.difficulty);
  }
});

test('answer normalization accepts numeric and textual matches',()=>{
  const q={answer:21};
  assert.equal(isCorrect('21',q),true);
  assert.equal(isCorrect(21,q),true);
  assert.equal(isCorrect('22',q),false);
});

test('difficulty, rage and quiz grade thresholds',()=>{
  assert.equal(nextDifficulty(1,[true,true,true,true]),2);
  assert.equal(nextDifficulty(1,[false,false,false,false]),0);
  assert.equal(rageLevel(0),0);assert.equal(rageLevel(2),1);assert.equal(rageLevel(4),2);assert.equal(rageLevel(7),3);assert.equal(rageLevel(1,true,8,10),4);
  assert.equal(quizGrade(10,10).letter,'A+');assert.equal(quizGrade(9,10).letter,'A');assert.equal(quizGrade(8,10).letter,'B');assert.equal(quizGrade(7,10).letter,'C');assert.equal(quizGrade(6,10).needsReview,true);
});

test('publisher curriculum covers grades 1-6 with Grade 4 depth emphasis',()=>{
  for(const [name,bank] of Object.entries(BANKS)){
    for(let grade=1;grade<=3;grade++) assert.ok(bank[grade].length>=20,`${name} grade ${grade} is too small`);
    assert.ok(bank[4].length>=40,`${name} grade 4 is not deep enough`);
    assert.ok(bank[5].length>=24,`${name} grade 5 is too small`);
    assert.ok(bank[6].length>=24,`${name} grade 6 is too small`);
    assert.ok(bank[4].length>bank[5].length&&bank[4].length>bank[6].length,`${name} grade 4 is not the deepest bank`);
  }
});

test('authored curriculum exceeds one thousand grade-level items',()=>{
  const total=Object.values(BANKS).reduce((sum,bank)=>sum+Object.values(bank).reduce((s,items)=>s+items.length,0),0);
  assert.ok(total>=1000,`authored library only has ${total} items`);
});

test('authored curriculum keys are unique within grade banks',()=>{
  for(let grade=1;grade<=6;grade++){
    assert.equal(new Set(VOCAB[grade].map(x=>x[0].toLowerCase())).size,VOCAB[grade].length,`duplicate vocab word grade ${grade}`);
    assert.equal(new Set(SPELLING[grade].map(x=>x.toLowerCase())).size,SPELLING[grade].length,`duplicate spelling word grade ${grade}`);
    for(const [name,bank] of Object.entries({READING,GRAMMAR,SCIENCE,GEO,GENERAL})){
      const prompts=bank[grade].map(x=>`${x[0]}|${x[1]}`);
      assert.equal(new Set(prompts).size,prompts.length,`duplicate ${name} prompt grade ${grade}`);
    }
  }
});


test('authored multiple-choice rows include their stored correct answer exactly once',()=>{
  for(const [name,bank] of Object.entries({READING,GRAMMAR,SCIENCE,GEO,GENERAL})) for(let grade=1;grade<=6;grade++) for(const row of bank[grade]){
    const answer=name==='READING'?row[2]:row[1];
    const choices=name==='READING'?row[3]:row[2];
    assert.equal(choices.length,4,`${name} grade ${grade} has ${choices.length} source choices`);
    assert.equal(new Set(choices.map(String)).size,4,`${name} grade ${grade} has duplicate source choices`);
    assert.equal(choices.filter(choice=>String(choice)===String(answer)).length,1,`${name} grade ${grade} source choices do not contain the answer exactly once`);
  }
});

test('unique question generator suppresses repeats in 20-question authored rounds',()=>{
  for(const grade of [4,5,6]) for(const subject of AUTHORED_SUBJECTS){
    const used=new Set(),rng=seeded(202608+grade*17+SUBJECT_KEYS.indexOf(subject));
    for(let i=0;i<20;i++){
      const q=generateUniqueQuestion({grade,subject,difficulty:1,rng},used);
      const fp=questionFingerprint(q);
      assert.equal(used.has(fp),false,`${subject} grade ${grade} repeated before 20 questions`);
      used.add(fp);
    }
  }
});

test('spelling questions are visual four-choice recognition tasks through grade 6',()=>{
  for(let grade=1;grade<=6;grade++){
    for(let i=0;i<40;i++){
      const q=generateQuestion({grade,subject:'spelling'});
      assert.equal(q.subject,'spelling');
      assert.equal(q.audioWord,null);
      assert.equal(q.choices.length,4);
      assert.equal(q.choices.filter(x=>x===q.answer).length,1);
      assert.ok(!q.prompt.toLowerCase().includes(q.answer.toLowerCase()),`prompt leaked spelling answer ${q.answer}`);
    }
  }
});
