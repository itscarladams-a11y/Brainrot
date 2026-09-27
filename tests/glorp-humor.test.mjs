import test from 'node:test';
import assert from 'node:assert/strict';
import { glorpLines, subjectNonsense } from '../js/content.js';

test('Glorp math joke answers are obviously absurd and include requested lines',()=>{
  assert.ok(glorpLines.wrongBySubject.math.includes('7 × 7 = cheeseburger.'));
  assert.ok(glorpLines.wrongBySubject.math.includes('6 × 5 = ice cream.'));
  assert.ok(subjectNonsense.math.includes('7 × 7 = CHEESEBURGER!'));
  assert.ok(subjectNonsense.math.includes('6 × 5 = ICE CREAM!'));
});

test('Professor clarifies that absurd Glorp answers are jokes',()=>{
  assert.ok(Array.isArray(glorpLines.professorJokeChecks));
  assert.ok(glorpLines.professorJokeChecks.some(x=>/joke answer|cheeseburger|real one|mathematics/i.test(x)));
});
