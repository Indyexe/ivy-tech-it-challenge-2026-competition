import assert from 'node:assert/strict';
import test from 'node:test';
import { impactStatement, sampleWeeks, summarizeWeeks } from './model.mjs';

test('completion rate uses record totals and handles an empty selection', () => {
  const allWeeks = summarizeWeeks(sampleWeeks);
  const recent = summarizeWeeks(sampleWeeks.slice(-6));
  assert.deepEqual(allWeeks, { records: 631, completed: 448, rate: 448 / 631 });
  assert.deepEqual(recent, { records: 357, completed: 271, rate: 271 / 357 });
  assert.deepEqual(summarizeWeeks([]), { records: 0, completed: 0, rate: 0 });
});

test('impact statement shows the baseline, target, and signed change in the saved unit', () => {
  const scope = { persona: 'A pilot user', baseline: '12', target: '7', unit: 'minutes' };
  const impact = { rollout: 'Pilot at one campus' };
  const statement = impactStatement(scope, impact);
  assert.match(statement, /A pilot user/);
  assert.match(statement, /12 → 7 minutes/);
  assert.match(statement, /Target change: -5 minutes/);
  assert.match(statement, /Pilot at one campus/);
  assert.match(impactStatement({ baseline: '0', target: '5', unit: 'records' }), /Target change: \+5 records/);
  assert.match(impactStatement(), /Save finite baseline and target values/);
});
