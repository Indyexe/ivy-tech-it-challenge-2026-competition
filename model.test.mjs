import assert from 'node:assert/strict';
import test from 'node:test';
import { coursePolicies, impactStatement, quizScenarios, sampleWeeks, summarizeWeeks } from './model.mjs';

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

test('coursePolicies has at least 5 entries each with required fields', () => {
  assert.ok(Array.isArray(coursePolicies));
  assert.ok(coursePolicies.length >= 5);
  const required = ['id', 'code', 'title', 'instructor', 'policy', 'allowed', 'prohibited', 'tips', 'rubric'];
  for (const entry of coursePolicies) {
    for (const field of required) {
      assert.ok(Object.hasOwn(entry, field), `entry ${entry.id} missing field: ${field}`);
    }
    assert.ok(Array.isArray(entry.rubric) && entry.rubric.length > 0, `entry ${entry.id} rubric must be a non-empty array`);
    assert.ok(Array.isArray(entry.allowed) && entry.allowed.length > 0, `entry ${entry.id} allowed must be non-empty`);
    assert.ok(Array.isArray(entry.prohibited) && entry.prohibited.length > 0, `entry ${entry.id} prohibited must be non-empty`);
    assert.ok(Array.isArray(entry.tips) && entry.tips.length > 0, `entry ${entry.id} tips must be non-empty`);
  }
});

test('quizScenarios has 10 entries each with required fields and a valid correct index', () => {
  assert.ok(Array.isArray(quizScenarios));
  assert.strictEqual(quizScenarios.length, 10);
  for (const q of quizScenarios) {
    assert.ok(Object.hasOwn(q, 'id'), `missing id`);
    assert.ok(Object.hasOwn(q, 'category'), `${q.id} missing category`);
    assert.ok(typeof q.question === 'string' && q.question.length > 0, `${q.id} missing question`);
    assert.ok(Array.isArray(q.options) && q.options.length === 4, `${q.id} must have exactly 4 options`);
    assert.ok(typeof q.correct === 'number' && q.correct >= 0 && q.correct < 4, `${q.id} correct index out of range`);
    assert.ok(typeof q.explanation === 'string' && q.explanation.length > 0, `${q.id} missing explanation`);
  }
});
