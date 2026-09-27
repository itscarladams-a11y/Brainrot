import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {difficultyProfile,questionDifficultyFor,nextProfileDifficulty} from '../js/difficulty.js';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('difficulty profiles keep challenge inside the 0-2 grade generator range',()=>{
  assert.equal(difficultyProfile('normal').start,0);
  assert.equal(difficultyProfile('hard').min,1);
  assert.equal(difficultyProfile('extreme').start,2);
  assert.equal(questionDifficultyFor({profileId:'normal',index:0,current:2,adaptive:2}),0);
  assert.equal(questionDifficultyFor({profileId:'hard',index:5,current:0,adaptive:0}),1);
  assert.equal(questionDifficultyFor({profileId:'extreme',index:5,current:0,adaptive:0}),2);
  assert.equal(nextProfileDifficulty(0,[true,true,true,true],'normal'),1);
});

test('mobile activity navigation exposes difficulty and a permanent home escape',()=>{
  const html=read('index.html');
  assert.match(html,/id="difficultyScreen"/);
  assert.match(html,/data-difficulty-profile="normal"/);
  assert.match(html,/data-difficulty-profile="hard"/);
  assert.match(html,/data-difficulty-profile="extreme"/);
  assert.match(html,/id="activityHomeBtn"/);
});

test('Glorp voice lookup no longer stops current audio for an unvoiced line',()=>{
  const audio=read('js/audio.js');
  const speak=audio.slice(audio.indexOf('speakCharacter('),audio.indexOf('voice(text'));
  assert.ok(speak.indexOf('getCharacterVoiceSource') < speak.indexOf('if(!source)'));
  assert.doesNotMatch(speak,/this\.stopVoice\(\)/);
  assert.match(audio,/queuedVoice/);
});

test('Android configuration hides status bar and forwards back into app navigation',()=>{
  const cfg=read('scripts/configure-android.mjs');
  assert.match(cfg,/WindowInsets\.Type\.statusBars/);
  assert.match(cfg,/brainrotAndroidBack/);
  assert.match(cfg,/versionCode 1609/);
  assert.match(cfg,/versionName \"0\.16\.9\"/);
});


test('parent dashboard exports local PDF reports and Android bridge saves to Downloads',()=>{
  const html=read('index.html'),app=read('js/app.js'),cfg=read('scripts/configure-android.mjs');
  assert.match(html,/id="exportProgressPdfBtn"/);assert.match(html,/id="parentReportRange"/);assert.match(html,/id="parentStudentName"/);
  assert.match(app,/buildProgressReport/);assert.match(app,/saveProgressPdf/);
  assert.match(cfg,/addJavascriptInterface\(new PdfBridge\(\), "BrainrotNative"\)/);
  assert.match(cfg,/MediaStore\.Downloads/);assert.match(cfg,/Brainrot Academy/);
});
