import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('production Glorp voice routes have local offline fallbacks',()=>{
  const registry=read('js/voice-registry.js'),audio=read('js/audio.js');
  assert.match(registry,/GLORP_LOCAL_FALLBACKS/);
  for(const file of ['game-cheating.mp3','question-rigged.mp3','stop-knowing-math.mp3','what-no.mp3'])assert.ok(registry.includes(file));
  assert.match(audio,/navigator\.onLine===false/);
  assert.match(audio,/source\.fallbackFile/);
  assert.match(audio,/localFallback/);
});

test('final free polish includes strong focus, touch, reduced-motion and forced-colors support',()=>{
  const css=read('styles.css');
  assert.match(css,/button:focus-visible/);
  assert.match(css,/@media \(pointer:coarse\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/@media\(forced-colors:active\)/);
});

test('Logic Lab launch suite exposes exactly five playable game cards',()=>{
  const html=read('index.html');
  const games=[...html.matchAll(/data-logic-game="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(games,['lost-found','pattern','shape','robot','slime']);
  assert.doesNotMatch(html,/Slime Sweeper<\/b>[\s\S]{0,200}PLANNED/);
  assert.match(html,/id="logicSuiteProgress"/);
});
