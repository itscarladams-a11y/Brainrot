import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('active gameplay has safe Back Home Pause Restart and contextual return controls',()=>{
  const html=read('index.html');
  for(const id of ['activityBackBtn','activityHomeBtn','pauseBtn','resumeBtn','restartRoundBtn','quitToActivitiesBtn','quitBtn']){
    assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  }
  const app=read('js/app.js');
  assert.match(app,/activityBackBtn[^\n]+openPauseOverlay/);
  assert.match(app,/restartCoreRound/);
  assert.match(app,/coreReturnLabel/);
});

test('active Logic Lab puzzles hide the global dock so it cannot bypass leave confirmation',()=>{
  const css=read('styles.css');
  assert.match(css,/body\[data-screen="logicLabScreen"\] \.app-dock/);
  assert.match(css,/body\[data-screen="patternLabScreen"\] \.app-dock/);
  const app=read('js/app.js');
  assert.match(app,/logicBackBtn[^\n]+openLogicPause/);
  assert.match(app,/patternBackBtn[^\n]+openLogicPause/);
});

test('backgrounding auto-pauses both core games and Logic Lab',()=>{
  const app=read('js/app.js');
  const visibility=app.slice(app.indexOf("document.addEventListener('visibilitychange'"));
  assert.match(visibility,/activeLogicScreen\(\).*openLogicPause/);
  assert.match(visibility,/battleScreen.*openPauseOverlay/);
});

test('state-changing gameplay transitions wait for pause and cancel when their owner changes',()=>{
  const app=read('js/app.js');
  assert.match(app,/function delayFor\(ownerRef,ownerGetter,fn,ms\)/);
  assert.match(app,/if\(paused\)\{pausedDelays\.add\(fire\);return;\}/);
  assert.match(app,/function flushPausedDelays\(\)/);
  assert.match(app,/delayFor\(answerOwner,\(\)=>game,\(\)=>\{game\.index\+\+;renderNext\(\);\},1650\)/);
  assert.match(app,/delayFor\(answerOwner,\(\)=>patternState,\(\)=>\{patternState\.round\+\+;nextPatternPuzzle\(\);\},1050\)/);
});

test('Logic Lab has its own Normal Hard Extreme challenge profile',()=>{
  const html=read('index.html'),app=read('js/app.js');
  for(const level of ['normal','hard','extreme']) assert.ok(html.includes(`data-logic-difficulty="${level}"`));
  assert.match(app,/logicDifficultyProfile:'normal'/);
  assert.match(app,/prefs\.logicDifficultyProfile=b\.dataset\.logicDifficulty/);
  assert.match(app,/logicSafety\(profile=logicDifficulty\(\)\)/);
});

test('Lost and Found difficulty scales safety and visually teaches ruled-out cells',()=>{
  const app=read('js/app.js'),css=read('styles.css');
  assert.match(app,/extreme'\?\{brainPower:2,hints:0\}/);
  assert.match(app,/hard'\?\{brainPower:3,hints:1\}:\{brainPower:4,hints:2\}/);
  assert.match(app,/function pulseLogicExclusions\(row,col\)/);
  assert.match(app,/sameRow\|\|sameCol\|\|sameRegion\|\|neighbor/);
  assert.match(css,/\.logic-cell\.rule-pulse/);
});

test('Pattern Lab uses Logic difficulty, per-puzzle hint limits and visible round progress',()=>{
  const html=read('index.html'),app=read('js/app.js');
  assert.ok(html.includes('id="patternRoundFill"'));
  assert.match(app,/difficultyProfile:patternState\.profile/);
  assert.match(app,/hintedRounds:new Set\(\)/);
  assert.match(app,/hintedRounds\.has\(patternState\.round\)/);
  assert.match(app,/patternRoundFill/);
});
