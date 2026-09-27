import test from 'node:test';
import assert from 'node:assert/strict';
import {createCombatState,comboTier,applyCorrectAttack,applyWrongCounter,hpPercent} from '../js/combat.js';

test('Brain Battle combo tiers escalate at 3, 5 and 10 correct answers',()=>{
  assert.equal(comboTier(1).id,'normal');
  assert.equal(comboTier(3).id,'combo');
  assert.equal(comboTier(5).id,'power');
  assert.equal(comboTier(10).id,'special');
  assert.ok(comboTier(10).damage>comboTier(5).damage);
});

test('correct answers damage Glorp without allowing negative HP',()=>{
  const state=createCombatState({glorpMaxHp:20});
  const hit=applyCorrectAttack(state,5);
  assert.equal(hit.dealt,20);
  assert.equal(state.glorpHp,0);
  assert.equal(hit.knockout,true);
  applyCorrectAttack(state,10);
  assert.equal(state.glorpHp,0);
});

test('wrong answers trigger a counter but the learner keeps a brain shield floor',()=>{
  const state=createCombatState();
  for(let i=0;i<20;i++)applyWrongCounter(state);
  assert.equal(state.playerHp,15);
  assert.equal(hpPercent(state.playerHp,state.playerMaxHp),15);
});
