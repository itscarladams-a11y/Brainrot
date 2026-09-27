import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const exists=(p)=>fs.existsSync(path.join(root,p));

const critical=[
  'assets/favicon-32.png','assets/icon-180.png','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable-512.png',
  'assets/brand/professor-brainrot-hero.webp','assets/brand/bantam-entertainment-logo.png',
  'assets/scenes/glorp-room-v05.webp','assets/scenes/professor-study-v05.webp','assets/scenes/activity-hall-premium.svg','assets/scenes/pizza-kitchen-premium.svg','assets/scenes/milkshake-lab-premium.svg','assets/ui/modes/brain-battle.svg','assets/ui/modes/pizza-party.svg','assets/ui/modes/milkshake.svg',
  'assets/rig/base.webp','assets/rig/eye-left.webp','assets/rig/eye-right.webp','assets/rig/mouth.webp','assets/rig/phone.webp',
  'assets/rig/gesture-point.svg','assets/rig/gesture-fist.svg','assets/rig/prof-hand-pointer.svg',
  'assets/ui/nav/home.svg','assets/ui/nav/play.svg','assets/ui/nav/quiz.svg','assets/ui/nav/closet.svg','assets/ui/nav/parent.svg',
  'assets/ui/nav/back.svg','assets/ui/nav/pause.svg','assets/ui/nav/rage.svg','assets/ui/nav/brain.svg','assets/ui/nav/lock.svg','assets/ui/nav/check.svg',
  'assets/music/menu.mp3','assets/music/battle.mp3','assets/music/professor.mp3','assets/music/win.mp3','assets/music/review.mp3',
  'assets/ui/modes/robot-rescue.svg','assets/audio/sfx/robot-step.wav','assets/audio/sfx/robot-turn.wav','assets/audio/sfx/robot-charge.wav','assets/audio/sfx/robot-crash.wav'
];

test('Brainrot Academy release assets are packaged',()=>{
  for(const p of critical) assert.ok(exists(p),`missing ${p}`);
});

test('package and offline cache are Brainrot Academy v0.16.9',()=>{
  const pkg=JSON.parse(read('package.json'));
  const sw=read('sw.js');
  assert.equal(pkg.version,'0.16.9');
  assert.match(sw,/brainrot-academy-v0\.16\.9/);
  for(const p of critical.filter(p=>p.includes('/nav/')||p.includes('/rig/gesture')||p.includes('prof-hand-pointer'))){
    assert.ok(sw.includes(`./${p}`),`service worker does not cache ${p}`);
  }
});

test('primary navigation uses bespoke icons instead of prototype glyphs',()=>{
  const html=read('index.html');
  for(const p of ['home.svg','play.svg','quiz.svg','closet.svg','parent.svg']) assert.ok(html.includes(`assets/ui/nav/${p}`));
  assert.doesNotMatch(html,/class="dock-glyph"[^>]*>[⌂▶?✦⚙]/);
});

test('release character performance layers are wired into the DOM',()=>{
  const html=read('index.html');
  const js=read('js/app.js');
  for(const p of ['gesture-point.svg','gesture-fist.svg','prof-hand-pointer.svg']) assert.ok(html.includes(p));
  for(const token of ['rig-pose-point','rig-pose-fist','rig-pose-shock','prof-lecture','look-choice-0']) assert.ok(js.includes(token)||read('styles.css').includes(token),`missing performance token ${token}`);
});

test('static HTML and CSS asset references resolve locally',()=>{
  const html=read('index.html');
  const css=read('styles.css');
  const refs=new Set();
  for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) refs.add(m[1]);
  for(const m of css.matchAll(/url\((?:['"]?)([^)'"?#]+)(?:['"]?)\)/g)) refs.add(m[1]);
  for(const ref of refs){
    if(ref.startsWith('http')||ref.startsWith('data:')||ref.startsWith('mailto:')) continue;
    const clean=ref.replace(/^\.\//,'');
    assert.ok(exists(clean),`broken local asset reference: ${ref}`);
  }
});


test('publisher candidate accessibility and build identity are wired',()=>{
  const html=read('index.html');
  const js=read('js/app.js');
  assert.doesNotMatch(html,/user-scalable\s*=\s*no/i);
  assert.ok(html.includes('id="largeTextToggle"'));
  assert.ok(html.includes('id="hapticsToggle"'));
  assert.ok(html.includes('PRIVACY BY DEFAULT'));
  assert.match(js,/dataset\.build='0\.16\.9'/);
});



test('parent dashboard and offline progress module are packaged',()=>{
  const html=read('index.html');
  const sw=read('sw.js');
  assert.ok(exists('js/progress.js'));
  assert.ok(sw.includes("'./js/progress.js'"));
  for(const id of ['parentProgressGrade','parentAccuracy','parentQuestions','parentSessions','parentQuizAverage','parentSkillsTracked','parentSkillsMastered','parentSkillMastery','parentRecommendations','parentRecentActivity']) assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.match(html,/PARENT DASHBOARD/);
});

test('offline package includes curriculum module',()=>{
  const sw=read('sw.js');
  assert.ok(exists('js/curriculum.js'));
  assert.ok(sw.includes("'./js/curriculum.js'"));
});


test('spelling mode has no pronunciation audio assets or replay controls',()=>{
  const sw=read('sw.js');
  const html=read('index.html');
  const app=read('js/app.js');
  const audio=read('js/audio.js');
  assert.equal(exists('assets/audio/voice/spelling'),false);
  assert.ok(!sw.includes('assets/audio/voice/spelling/'));
  assert.ok(!html.includes('id=\"spellingReplayBtn\"'));
  assert.ok(!app.includes('pronounceWord'));
  assert.ok(!audio.includes('pronounceWord'));
});

test('spelling UI asks for the correctly spelled option and never requires audio',()=>{
  const engine=read('js/engine.js');
  assert.ok(engine.includes("prompt:'Which word is spelled correctly?'"));
  assert.ok(!engine.includes('audioWord:answer'));
});


test('featured learning games are hosted by Professor while Glorp reacts after answers',()=>{
  const html=read('index.html');
  const app=read('js/app.js');
  const content=read('js/content.js');
  assert.ok(html.includes('id="professorBattleHost"'));
  assert.ok(html.includes('id="professorBattleBubble"'));
  for(const name of ['Number Battle',"Glorp's Grammar Crimes",'Reading Detective','Spelling Showdown']) assert.ok(content.includes(name),`missing featured game ${name}`);
  assert.match(app,/professorHostedSubjects=new Set\(\['spelling','grammar','math','reading'\]\)/);
  assert.match(app,/professorBattleSay\(q\.interactionPrompt\|\|q\.prompt,'prompt'\)/);
  assert.match(app,/professorBattleSay\('CORRECT!','good'\)/);
  assert.match(app,/professorBattleSay\('WRONG!','bad'\)/);
  assert.match(app,/professor-hosted-question/);
  assert.match(app,/if\(!professorHostsQuestion\(q\)\)/);
  assert.match(app,/glorpBubble'\)\?\.classList\.add\('hidden'\)/);
});

test('mastery practice is exposed from home review and the parent dashboard',()=>{
  const html=read('index.html');
  const app=read('js/app.js');
  assert.ok(html.includes('id="practiceWeakSkillsBtn"'));
  assert.ok(html.includes('id="statMasteryPractice"'));
  assert.match(app,/function startMasteryPractice\(\)/);
  assert.match(app,/recommendedSkills\(prefs,grade,4\)/);
  assert.match(app,/focusDescriptors:descriptors,label:'MASTERY PRACTICE'/);
  assert.match(app,/reviewShortcutBtn[^\n]+startMasteryPractice/);
  assert.match(app,/game\.sessionLabel==='MASTERY PRACTICE'/);
  assert.match(app,/Correct answer: \${game\.current\.answer}\. \${game\.current\.explanation\|\|/);
  assert.match(app,/game\.awaitingContinue=true/);
  assert.match(app,/answerContinueBtn'\)\.addEventListener\('click'/);
});

test('grade selector and parent settings expose grades 5 and 6',()=>{
  const html=read('index.html');
  for(const grade of ['5','6']){
    assert.ok(html.includes(`data-grade="${grade}"`),`missing grade ${grade} card`);
    assert.ok(html.includes(`<option value="${grade}">`),`missing grade ${grade} parent option`);
  }
});

test('manifest describes the expanded Grade 1–6 product',()=>{
  const manifest=JSON.parse(read('manifest.webmanifest'));
  assert.match(manifest.description,/Grade 1–6/);
});

test('every service-worker precache path resolves to a packaged file',()=>{
  const sw=read('sw.js');
  const refs=[...sw.matchAll(/['"](\.\/[^'"]+)['"]/g)].map(m=>m[1]);
  assert.ok(refs.length>=90,`unexpectedly small precache list: ${refs.length}`);
  for(const ref of new Set(refs)){
    const clean=ref.replace(/^\.\//,'');
    assert.ok(exists(clean),`service-worker precache path missing: ${ref}`);
  }
});


test('learning-intelligence modules are packaged for offline use',()=>{
  const sw=read('sw.js');
  for(const module of ['js/skills.js','js/mastery.js','js/adaptive.js']){
    assert.ok(exists(module),`missing ${module}`);
    assert.ok(sw.includes(`./${module}`),`offline cache missing ${module}`);
  }
});


test('v0.11.3 kid-facing presentation polish remains packaged',()=>{
  const html=read('index.html');
  const css=read('styles.css');
  assert.ok(html.includes('PICK YOUR ACTIVITY'));
  assert.ok(html.includes('GLORP REACTS TO EVERYTHING'));
  assert.ok(html.includes('LEVEL UP YOUR BRAIN'));
  assert.ok(html.includes('class="battle-vs-badge"'));
  assert.ok(html.includes('class="home-rival-peek"'));
  assert.ok(html.includes('assets/icon-180.png'));
  assert.ok(css.includes('v0.11.3 KID APP POLISH'));
  assert.ok(css.includes('@media(max-width:380px)'));
  assert.ok(css.includes('@media(orientation:landscape) and (max-height:500px)'));
});


test('v0.14 premium visual foundation is packaged and themed',()=>{
  const html=read('index.html');
  const css=read('styles.css');
  const app=read('js/app.js');
  for(const asset of ['assets/scenes/activity-hall-premium.svg','assets/scenes/pizza-kitchen-premium.svg','assets/scenes/milkshake-lab-premium.svg','assets/ui/modes/brain-battle.svg','assets/ui/modes/pizza-party.svg','assets/ui/modes/milkshake.svg']) assert.ok(exists(asset),`missing premium asset ${asset}`);
  assert.ok(html.includes('modeSceneSign'));
  assert.ok(html.includes('Different games. Same real learning.'));
  assert.ok(css.includes('v0.14.0 PREMIUM VISUAL FOUNDATION'));
  assert.ok(css.includes('pizza-kitchen-premium.svg'));
  assert.ok(css.includes('milkshake-lab-premium.svg'));
  assert.match(app,/modeSceneSign/);
  assert.match(app,/pizza-party\.svg/);
  assert.match(app,/milkshake\.svg/);
});

test('parent PDF report module is packaged for offline use',()=>{
  const sw=read('sw.js');
  assert.ok(exists('js/pdf-report.js'));
  assert.ok(sw.includes("'./js/pdf-report.js'"));
});

test('v0.15 tactile interaction engine is wired into gameplay and offline release',()=>{
  const app=read('js/app.js'),interactions=read('js/interactions.js'),sw=read('sw.js'),css=read('styles.css');
  assert.match(app,/prepareInteraction/);
  assert.match(app,/lockInteraction/);
  assert.ok(sw.includes("'./js/interactions.js'"));
  for(const token of ['number-input','missing-letter','letter-build','number-keypad','letter-tray'])assert.ok(interactions.includes(token)||css.includes(token),`missing v0.15 interaction token ${token}`);
});

test('v0.16 content depth and Brain Battle 2.0 ship offline',()=>{
  const sw=read('sw.js'),html=read('index.html'),app=read('js/app.js'),css=read('styles.css');
  for(const module of ['js/content-depth.js','js/combat.js']){
    assert.ok(exists(module),`missing ${module}`);
    assert.ok(sw.includes(`./${module}`),`offline cache missing ${module}`);
  }
  for(const id of ['combatHud','playerHpFill','glorpHpFill','comboBadge','combatCallout'])assert.ok(html.includes(`id="${id}"`),`missing combat UI ${id}`);
  for(const token of ['brainBattleHit','brainBattleCounter','reviewQueue','recentQuestionMemory'])assert.ok(app.includes(token),`missing v0.16 app token ${token}`);
  assert.ok(css.includes('v0.16.0 BRAIN BATTLE 2.0'));
});


test('v0.16.5 Robot Rescue ships as a fully offline Logic Lab game',()=>{
  const sw=read('sw.js'),html=read('index.html'),app=read('js/app.js'),css=read('styles.css');
  for(const asset of ['js/robot-rescue.js','assets/ui/modes/robot-rescue.svg','assets/audio/sfx/robot-step.wav','assets/audio/sfx/robot-turn.wav','assets/audio/sfx/robot-charge.wav','assets/audio/sfx/robot-crash.wav']){
    assert.ok(exists(asset),`missing Robot Rescue asset ${asset}`);
    assert.ok(sw.includes(`./${asset}`),`offline cache missing ${asset}`);
  }
  for(const id of ['robotLabScreen','robotBoard','robotProgramQueue','robotCommandPad','robotRunBtn','robotPauseBtn'])assert.ok(html.includes(`id="${id}"`),`missing Robot Rescue UI ${id}`);
  for(const token of ['runRobotProgram','executeRobotProgramStep','useRobotHint','robotNextStageByGrade'])assert.ok(app.includes(token),`missing Robot Rescue app token ${token}`);
  assert.ok(css.includes("v0.16.5 GLORP'S ROBOT RESCUE"));
});
