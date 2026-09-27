import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectInteractionType,prepareInteraction,interactionType} from '../js/interactions.js';

const math={subject:'math',answer:42,choices:[42,40,44,36]};
const spell={subject:'spelling',answer:'planet',choices:['planet','planit','plannet','planett']};

test('Pizza Party mixes choice and numeric keypad interactions',()=>{
  assert.equal(selectInteractionType(math,{setting:'pizza',index:0}),'choice');
  assert.equal(selectInteractionType(math,{setting:'pizza',index:1}),'number-input');
  assert.equal(selectInteractionType(math,{setting:'pizza',index:2}),'number-input');
});

test('Milkshake cycles spelling recognition, missing letter, and word building',()=>{
  assert.equal(selectInteractionType(spell,{setting:'milkshake',index:0}),'choice');
  assert.equal(selectInteractionType(spell,{setting:'milkshake',index:1}),'missing-letter');
  assert.equal(selectInteractionType(spell,{setting:'milkshake',index:2}),'letter-build');
});

test('quizzes remain conservative four-choice assessment',()=>{
  assert.equal(selectInteractionType(math,{setting:'pizza',mode:'quiz',index:1}),'choice');
  assert.equal(selectInteractionType(spell,{setting:'milkshake',mode:'quiz',index:2}),'choice');
});

test('prepared spelling interactions keep the canonical correct answer',()=>{
  const missing=prepareInteraction(spell,{setting:'milkshake',index:1});
  assert.equal(interactionType(missing),'missing-letter');
  assert.equal(missing.answer,'planet');
  assert.match(missing.interactionPrompt,/_/);
  const build=prepareInteraction(spell,{setting:'milkshake',index:2});
  assert.equal(build.interactionData.letters.slice().sort().join(''),[...'planet'].sort().join(''));
});

test('interaction renderer packages tactile control implementations',()=>{
  const source=fs.readFileSync(new URL('../js/interactions.js',import.meta.url),'utf8');
  for(const token of ['number-keypad','missing-word','letter-tray','CHECK ANSWER','CHECK WORD'])assert.ok(source.includes(token),`missing ${token}`);
});
