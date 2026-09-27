import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CHARACTER_VOICES, GLORP_PRODUCTION_LINES, getCharacterVoiceSource} from '../js/voice-registry.js';
import {glorpLines} from '../js/content.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('canonical character voices encode brother lore and distinct roles',()=>{
  assert.equal(CHARACTER_VOICES.professor.familyRole,'older-brother');
  assert.equal(CHARACTER_VOICES.professor.sibling,'glorp');
  assert.equal(CHARACTER_VOICES.professor.role,'teacher');
  assert.equal(CHARACTER_VOICES.glorp.familyRole,'younger-brother');
  assert.equal(CHARACTER_VOICES.glorp.sibling,'professor');
  assert.equal(CHARACTER_VOICES.glorp.providerVoice,'Grungle');
  assert.notEqual(CHARACTER_VOICES.professor.role,CHARACTER_VOICES.glorp.role);
});

test('first Grungle migration batch contains twelve production reactions',()=>{
  assert.equal(Object.keys(GLORP_PRODUCTION_LINES).length,12);
  for(const [line,url] of Object.entries(GLORP_PRODUCTION_LINES)){
    assert.ok(line.length>3);
    assert.match(url,/^https:\/\//);
    const source=getCharacterVoiceSource('glorp',line);
    assert.equal(source?.type,'remote-production');
  }
});

test('active rage banks use migrated Grungle lines',()=>{
  for(const bank of ['correct','wrong','angry','furious','meltdown']){
    assert.ok(glorpLines[bank].length>=3,`${bank} too small`);
    for(const line of glorpLines[bank]){
      assert.ok(GLORP_PRODUCTION_LINES[line],`${bank} still references unmigrated spoken line: ${line}`);
    }
  }
});

test('Professor routing cannot silently use a Glorp or legacy narrator clip',()=>{
  assert.equal(getCharacterVoiceSource('professor','Stop knowing things!'),null);
  assert.equal(getCharacterVoiceSource('professor','Observe carefully, scholar.'),null);
  const audio=read('js/audio.js');
  const app=read('js/app.js');
  assert.match(audio,/speakCharacter\(speaker,text/);
  assert.doesNotMatch(app,/speakCharacter\('professor'/);
  assert.doesNotMatch(app,/function professorSay[^\n]+audio\.voice\(/);
});

test('voice manifest records Professor speech-bubble mode and retired spelling audio',()=>{
  const manifest=JSON.parse(read('assets/audio/voice/audio-migration-manifest.json'));
  assert.equal(manifest.build,'0.14.0');
  assert.equal(manifest.professorMode,'speech-bubbles-no-voice');
  assert.equal(manifest.spellingMode,'visual-four-choice-no-pronunciation');
  assert.equal(manifest.retiredLegacySpellingCount,153);
  assert.equal(manifest.spellingAudioRequired,false);
  assert.equal(manifest.productionGlorpBatchCount,12);
});

test('Professor is text-only while Glorp retains character voice routing',()=>{
  assert.equal(CHARACTER_VOICES.professor.status,'speech-bubble-only');
  assert.equal(CHARACTER_VOICES.professor.finalVoiceRequired,false);
  assert.equal(getCharacterVoiceSource('professor','Observe carefully, scholar.'),null);
  assert.equal(getCharacterVoiceSource('glorp','Stop knowing things!')?.type,'remote-production');
});
