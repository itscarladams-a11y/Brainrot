import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gameplaySetting, earnedActivityLayers, activityProgressName} from '../js/gameplay-settings.js';
import {interactionType} from '../js/interactions.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('gameplay settings separate activity from curriculum subject',()=>{
  assert.equal(gameplaySetting('battle').subject,null);
  assert.equal(gameplaySetting('pizza').subject,'math');
  assert.equal(gameplaySetting('milkshake').subject,'spelling');
  assert.equal(gameplaySetting('logic').subject,null);
  assert.equal(gameplaySetting('pizza').name,"Glorp's Pizza Party");
  assert.equal(gameplaySetting('milkshake').name,"Glorp's Milkshake Machine");
  assert.equal(gameplaySetting('logic').name,'Logic Lab');
});

test('food activities advance only from correct-answer score',()=>{
  assert.equal(earnedActivityLayers('pizza',0,10),0);
  assert.equal(earnedActivityLayers('pizza',1,10),1);
  assert.equal(earnedActivityLayers('pizza',5,10),3);
  assert.equal(earnedActivityLayers('pizza',10,10),6);
  assert.equal(activityProgressName('pizza',6),'READY!');
  assert.equal(activityProgressName('milkshake',6),'BLEND!');
});

test('questions default safely to the existing choice interaction',()=>{
  assert.equal(interactionType({choices:['a','b']}),'choice');
  assert.equal(interactionType({interactionType:'evidence-select'}),'evidence-select');
});

test('activity UI and shared progress hooks are wired',()=>{
  const html=read('index.html'), app=read('js/app.js'), sw=read('sw.js');
  for(const id of ['activityScreen','activityGrid','activityProp','activityPropLabel']) assert.ok(html.includes(`id="${id}"`),`missing ${id}`);
  assert.ok(html.includes('data-gameplay="pizza"'));
  assert.ok(html.includes('data-gameplay="milkshake"'));
  assert.ok(html.includes('data-gameplay="logic"'));
  assert.match(app,/openDifficultyPicker\('battle',setting\.subject,\{setting:setting\.id,label:setting\.shortLabel\},'activityScreen'\)/);
  assert.match(app,/trackSubject\(game\.current,correct\)/);
  assert.match(app,/renderInteraction\(q,grid/);
  assert.ok(sw.includes("'./js/gameplay-settings.js'"));
  assert.ok(sw.includes("'./js/interactions.js'"));
});
