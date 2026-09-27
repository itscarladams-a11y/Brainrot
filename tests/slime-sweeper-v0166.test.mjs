import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createSlimeLevel,validateSlimeLevel,solveSlimeByLogic,slimeSizeForGrade,slimeCountFor,slimeStars} from '../js/slime-sweeper.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('Slime Sweeper scales by grade and difficulty',()=>{
  assert.equal(slimeSizeForGrade(1),5);assert.equal(slimeSizeForGrade(4),6);assert.equal(slimeSizeForGrade(6),7);
  assert.ok(slimeCountFor({grade:4,difficultyProfile:'extreme'})>slimeCountFor({grade:4,difficultyProfile:'normal'}));
});

test('Slime Sweeper generator only emits deterministic no-guess boards',()=>{
  for(let grade=1;grade<=6;grade++)for(const difficultyProfile of ['normal','hard','extreme'])for(let stage=1;stage<=40;stage++){
    const a=createSlimeLevel({grade,stage,difficultyProfile}),b=createSlimeLevel({grade,stage,difficultyProfile});
    assert.equal(validateSlimeLevel(a),true,`invalid ${grade}/${difficultyProfile}/${stage}`);
    assert.equal(solveSlimeByLogic(a).solved,true,`not logically solvable ${grade}/${difficultyProfile}/${stage}`);
    assert.deepEqual([...a.mines],[...b.mines]);
  }
});

test('Slime Sweeper star scoring rewards clean deduction',()=>{
  assert.equal(slimeStars({mistakes:0,hintsUsed:0}),3);assert.equal(slimeStars({mistakes:1,hintsUsed:0}),2);assert.equal(slimeStars({mistakes:0,hintsUsed:1}),2);assert.equal(slimeStars({mistakes:2,hintsUsed:1}),1);
});

test('Slime Sweeper is integrated into the finished Logic Lab shell',()=>{
  const html=read('index.html'),app=read('js/app.js'),css=read('styles.css'),sw=read('sw.js');
  for(const id of ['slimeLabScreen','slimeBoard','slimeRevealModeBtn','slimeMarkModeBtn','slimeHintBtn','slimePauseBtn'])assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  for(const token of ['createSlimeLevel','openSlimeSweeper','slimeNextStageByGrade','slimeSolved'])assert.ok(app.includes(token),`missing ${token}`);
  assert.ok(css.includes('v0.16.6 FINAL FREE POLISH'));
  for(const asset of ['js/slime-sweeper.js','assets/ui/modes/slime-sweeper.svg'])assert.ok(sw.includes(`./${asset}`),`offline cache missing ${asset}`);
});
