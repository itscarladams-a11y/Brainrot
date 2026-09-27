import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPatternPuzzle,patternRoundCountForGrade,patternStars,validatePatternPuzzle} from '../js/pattern-lab.js';
import {getCharacterVoiceSource} from '../js/voice-registry.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

test('Pattern Lab generates valid grade-aware puzzles for every grade and difficulty',()=>{
  for(let grade=1;grade<=6;grade++)for(const profile of ['normal','hard','extreme'])for(let round=0;round<20;round++){
    const p=createPatternPuzzle({grade,stage:7,round,difficultyProfile:profile});
    assert.equal(validatePatternPuzzle(p),true,`invalid g${grade} ${profile} r${round}`);
    assert.ok(p.choices.includes(p.answer));
    assert.equal(p.choices.filter(x=>String(x)===String(p.answer)).length,1);
  }
});

test('Pattern Lab difficulty changes missing-position challenge without changing grade',()=>{
  const normal=createPatternPuzzle({grade:4,stage:3,round:2,difficultyProfile:'normal'});
  const hard=createPatternPuzzle({grade:4,stage:3,round:2,difficultyProfile:'hard'});
  const extreme=createPatternPuzzle({grade:4,stage:3,round:2,difficultyProfile:'extreme'});
  assert.equal(normal.grade,4);assert.equal(hard.grade,4);assert.equal(extreme.grade,4);
  assert.equal(normal.missingIndex,normal.sequence.length-1);
  assert.ok(hard.missingIndex< hard.sequence.length);
  assert.ok(extreme.missingIndex>0&&extreme.missingIndex<extreme.sequence.length-1);
});

test('Pattern Lab session length and star scoring are kid-friendly',()=>{
  assert.equal(patternRoundCountForGrade(1),6);
  assert.equal(patternRoundCountForGrade(6),8);
  assert.equal(patternStars({wrongAttempts:0,hintsUsed:0}),3);
  assert.equal(patternStars({wrongAttempts:2,hintsUsed:0}),2);
  assert.equal(patternStars({wrongAttempts:0,hintsUsed:1}),2);
  assert.equal(patternStars({wrongAttempts:5,hintsUsed:1}),1);
});

test('Logic Lab hub and Pattern Lab share pause, back and home controls',()=>{
  const html=read('index.html'),app=read('js/app.js'),sw=read('sw.js');
  for(const id of ['logicHubScreen','logicHubBackBtn','logicHubHomeBtn','patternLabScreen','patternBackBtn','patternPauseBtn','patternHomeBtn','logicPauseOverlay','logicResumeBtn','logicRestartBtn','logicExitToLabBtn']) assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(app,/openLogicPause/);
  assert.match(app,/visibilitychange/);
  assert.match(app,/brainrotAndroidBack/);
  assert.match(app,/activeLogicScreen/);
  assert.ok(exists('assets/ui/modes/pattern-lab.svg'));
  assert.ok(sw.includes("'./js/pattern-lab.js'"));
  assert.ok(sw.includes("'./assets/ui/modes/pattern-lab.svg'"));
});

test('Pattern Lab uses existing Glorp voice mappings and tactile SFX',()=>{
  const app=read('js/app.js');
  for(const line of ['Stop knowing things!','This game is cheating!','Fine. Maybe you are a little smart.','Professor, your questions are suspicious.']){assert.ok(app.includes(line),`missing voiced reaction ${line}`);assert.ok(getCharacterVoiceSource('glorp',line),`voice line has no registered audio: ${line}`);}
  for(const effect of ["audio.sfx('correct'","audio.sfx('wrong'","audio.sfx('sparkle'","audio.sfx('chalk'","audio.sfx('unlock'"]) assert.ok(app.includes(effect),`missing ${effect}`);
});
