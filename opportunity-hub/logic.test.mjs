/**
 * logic.test.mjs — A-Ivy unit tests
 * Run with: node --test opportunity-hub/logic.test.mjs
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  matchQuestion, hasKeyword, filterCourses, ruleSummary, allowedAlternatives,
  disclosureNote, emailDraft, toCsv, detectTask, extractTopic, coachPlan,
  scoreQuiz, badgeMetrics, upcomingEvents, isoDate, formatBytes, validateUpload,
} from './logic.mjs';
import {
  courses, coachTaskTypes, coachPrompts, quiz, certification, samplePilotWeeks, events,
} from './data.mjs';

const engl = courses.find((c) => c.id === 'engl-111');
const csci = courses.find((c) => c.id === 'csci-101');
const math = courses.find((c) => c.id === 'math-136');
const nurs = courses.find((c) => c.id === 'nurs-101');

// ─── hasKeyword (whole words only) ───────────────────────────────────────────

test('hasKeyword — matches whole words and simple plurals', () => {
  assert.ok(hasKeyword('Can I brainstorm ideas?', 'idea'));
  assert.ok(hasKeyword('Can AI help me outline?', 'outline'));
  assert.ok(hasKeyword('Can I use AI to plan my essay?', 'plan my essay'));
});

test('hasKeyword — does not match inside other words', () => {
  assert.equal(hasKeyword('Can I get an explanation of loops?', 'plan'), false);
  assert.equal(hasKeyword('How many credits is this class?', 'edit'), false);
  assert.equal(hasKeyword('What is the latest version?', 'test'), false);
});

// ─── matchQuestion ───────────────────────────────────────────────────────────

test('matchQuestion — brainstorm question maps to brainstorming (allowed)', () => {
  const result = matchQuestion('Can I brainstorm ideas with AI?', engl.usages);
  assert.equal(result.primary.useType, 'brainstorming');
  assert.equal(result.primary.rule, 'allowed');
  assert.equal(result.conflict, false);
});

test('matchQuestion — grammar question maps to grammar-check (disclosure)', () => {
  const result = matchQuestion('Can I use AI to check my grammar?', engl.usages);
  assert.equal(result.primary.useType, 'grammar-check');
  assert.equal(result.primary.rule, 'disclosure');
});

test('matchQuestion — grammar in an essay is NOT treated as drafting', () => {
  const result = matchQuestion('Can I use AI to proofread my essay?', engl.usages);
  assert.equal(result.primary.useType, 'grammar-check');
  assert.equal(result.conflict, false);
});

test('matchQuestion — coding question maps to coding-help (disclosure)', () => {
  const result = matchQuestion('Can I use AI to help debug my code?', csci.usages);
  assert.equal(result.primary.useType, 'coding-help');
  assert.equal(result.primary.rule, 'disclosure');
});

test('matchQuestion — mixed question returns the STRICTEST rule and lists every match', () => {
  const result = matchQuestion('Can I use AI to plan my essay structure?', engl.usages);
  assert.equal(result.primary.rule, 'not-allowed');
  assert.equal(result.primary.useType, 'outlining');
  assert.equal(result.conflict, true);
  const types = result.matches.map((m) => m.useType);
  assert.ok(types.includes('brainstorming'));
  assert.ok(types.includes('outlining'));
});

test('matchQuestion — "explanation" does not match "plan"', () => {
  assert.equal(matchQuestion('Can I get an explanation of loops?', csci.usages), null);
});

test('matchQuestion — unknown question returns null (not covered)', () => {
  assert.equal(matchQuestion('Can I bring a calculator to the exam?', engl.usages), null);
});

test('matchQuestion — empty input and missing usages return null', () => {
  assert.equal(matchQuestion('', engl.usages), null);
  assert.equal(matchQuestion('brainstorm', null), null);
});

test('matchQuestion — NURS 101 study question maps to disclosure with the exact quote', () => {
  const result = matchQuestion('Can I use AI to review terminology?', nurs.usages);
  assert.equal(result.primary.rule, 'disclosure');
  assert.match(result.primary.quote, /personal study/i);
});

test('matchQuestion — quote is the exact policy text stored in data', () => {
  const result = matchQuestion('brainstorm ideas for my paper', engl.usages);
  assert.equal(result.primary.quote, 'AI tools may be used to brainstorm.');
});

// ─── Course search ───────────────────────────────────────────────────────────

test('filterCourses — finds by code with or without a space, and by name', () => {
  assert.deepEqual(filterCourses(courses, 'engl').map((c) => c.id), ['engl-111']);
  assert.deepEqual(filterCourses(courses, 'ENGL111').map((c) => c.id), ['engl-111']);
  assert.deepEqual(filterCourses(courses, 'engl 111').map((c) => c.id), ['engl-111']);
  assert.deepEqual(filterCourses(courses, 'composition').map((c) => c.id), ['engl-111']);
});

test('filterCourses — empty query returns all; no match returns none', () => {
  assert.equal(filterCourses(courses, '').length, courses.length);
  assert.equal(filterCourses(courses, '   ').length, courses.length);
  assert.deepEqual(filterCourses(courses, 'zzz'), []);
});

// ─── Summary & alternatives ──────────────────────────────────────────────────

test('ruleSummary — counts rules for a course card', () => {
  assert.deepEqual(ruleSummary(engl), { allowed: 1, disclosure: 1, notAllowed: 3 });
});

test('allowedAlternatives — lists only uses that are not "not allowed"', () => {
  assert.deepEqual(allowedAlternatives(engl).map((u) => u.useType), ['brainstorming', 'grammar-check']);
  assert.ok(allowedAlternatives(math).every((u) => u.rule !== 'not-allowed'));
});

// ─── Safety: no real instructor addresses ────────────────────────────────────

test('data — every instructor email uses the example.edu test domain', () => {
  for (const course of courses) assert.match(course.instructorEmail, /@example\.edu$/);
});

// ─── disclosureNote / emailDraft / toCsv ─────────────────────────────────────

test('disclosureNote — contains course name and readable use type', () => {
  const note = disclosureNote('CSCI 101', 'coding-help');
  assert.match(note, /AI Use Disclosure/);
  assert.match(note, /CSCI 101/);
  assert.match(note, /coding help/);
  assert.doesNotMatch(note, /coding-help/);
});

test('emailDraft — returns a mailto: URL with the encoded question', () => {
  const href = emailDraft(csci, 'Can I use AI to debug my code?');
  assert.ok(href.startsWith('mailto:csci101.instructor@example.edu?'));
  assert.match(href, /debug/i);
});

test('toCsv — quotes values and escapes commas and quotes', () => {
  assert.equal(toCsv([['a', 'b,c'], ['say "hi"', null]]), '"a","b,c"\n"say ""hi""",""');
});

// ─── AI Coach ────────────────────────────────────────────────────────────────

test('detectTask — recognizes writing, coding, and study assignments', () => {
  assert.equal(detectTask('Research paper on climate change', coachTaskTypes).id, 'writing');
  assert.equal(detectTask('Python program for a grade calculator', coachTaskTypes).id, 'coding');
  assert.equal(detectTask('Study for my terminology quiz', coachTaskTypes).id, 'study');
  assert.equal(detectTask('hello there', coachTaskTypes), null);
});

test('extractTopic — pulls the words after "on" / "about"', () => {
  assert.equal(extractTopic('Research paper on climate change.'), 'climate change');
  assert.equal(extractTopic(''), 'your topic');
});

test('coachPlan — only suggests uses the course allows, and lists what to avoid', () => {
  const plan = coachPlan(engl, 'Research paper on climate change', coachTaskTypes, coachPrompts);
  assert.ok(plan.suggestions.length > 0 && plan.suggestions.length <= 3);
  assert.ok(plan.suggestions.every((s) => s.rule !== 'not-allowed'));
  assert.ok(plan.suggestions.some((s) => s.prompt.includes('climate change')));
  assert.ok(plan.notAllowed.includes('outlining'));
  assert.ok(plan.notAllowed.includes('drafting'));
});

test('coachPlan — flags disclosure when a suggested use needs it', () => {
  const plan = coachPlan(csci, 'Python program for a grade calculator', coachTaskTypes, coachPrompts);
  assert.equal(plan.suggestions[0].useType, 'coding-help');
  assert.equal(plan.needsDisclosure, true);
});

// ─── AI Literacy ─────────────────────────────────────────────────────────────

test('scoreQuiz — all correct passes; 7 of 10 fails at a pass mark of 8', () => {
  const perfect = quiz.map((q) => q.answer);
  assert.deepEqual(scoreQuiz(quiz, perfect, certification.passMark), { correct: 10, total: 10, passed: true, missed: [] });
  const sevenRight = perfect.map((a, i) => (i < 3 ? (a + 1) % 3 : a));
  const result = scoreQuiz(quiz, sevenRight, certification.passMark);
  assert.equal(result.correct, 7);
  assert.equal(result.passed, false);
  assert.deepEqual(result.missed, ['q1', 'q2', 'q3']);
});

test('scoreQuiz — exactly the pass mark passes; unanswered counts as wrong', () => {
  const eightRight = quiz.map((q, i) => (i === 0 || i === 1 ? undefined : q.answer));
  assert.equal(scoreQuiz(quiz, eightRight, 8).passed, true);
});

test('badgeMetrics — totals sample weeks, adds live badges, and computes conversion', () => {
  const sampleOnly = badgeMetrics(samplePilotWeeks, [], 150, 0.2);
  assert.equal(sampleOnly.total, 84);
  assert.equal(sampleOnly.interested, 17);
  assert.equal(sampleOnly.remaining, 66);
  assert.ok(Math.abs(sampleOnly.conversion - 17 / 84) < 1e-9);
  assert.equal(sampleOnly.conversionMet, true);

  const withLive = badgeMetrics(samplePilotWeeks, [{ examInterest: true }, { examInterest: null }], 150, 0.2);
  assert.equal(withLive.total, 86);
  assert.equal(withLive.weeks.at(-1).week, 'This device');
  assert.equal(withLive.weeks.at(-1).sample, false);
});

test('badgeMetrics — progress caps at 100% and handles zero badges', () => {
  assert.equal(badgeMetrics([{ week: 'W', badges: 200, examInterest: 0 }], [], 150, 0.2).progress, 1);
  const empty = badgeMetrics([], [], 150, 0.2);
  assert.equal(empty.total, 0);
  assert.equal(empty.conversion, 0);
});

// ─── Events ──────────────────────────────────────────────────────────────────

test('upcomingEvents — hides past events and sorts soonest first', () => {
  const list = upcomingEvents(events, '2026-11-24');
  assert.equal(list[0].id, 'i-explore');
  assert.ok(list.every((e) => e.date >= '2026-11-24'));
  assert.equal(list.length, 6);
});

test('upcomingEvents — program filter keeps "all" events and matching ones', () => {
  const health = upcomingEvents(events, '2026-11-20', 'health');
  assert.ok(health.some((e) => e.id === 'dental-info'));
  assert.ok(!health.some((e) => e.id === 'bit-cj-visit'));
  assert.ok(health.some((e) => e.id === 'priority-enrollment'));
});

test('isoDate — formats a local date as YYYY-MM-DD', () => {
  assert.equal(isoDate(new Date(2026, 10, 20)), '2026-11-20');
});

// ─── Project uploads ─────────────────────────────────────────────────────────

test('formatBytes — readable sizes', () => {
  assert.equal(formatBytes(500), '500 B');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(2 * 1024 * 1024), '2 MB');
});

test('validateUpload — needs a title and a file; AI use needs a description', () => {
  const file = { name: 'calc.py', size: 1200 };
  assert.deepEqual(validateUpload({ title: 'Calc', usedAI: false, aiUse: '', file }, 2048).errors, []);
  assert.ok(validateUpload({ title: ' ', usedAI: false, file }, 2048).errors.includes('Add a project title.'));
  assert.ok(validateUpload({ title: 'Calc', usedAI: false, file: null }, 2048).errors.includes('Choose a file to upload.'));
  assert.ok(validateUpload({ title: 'Calc', usedAI: true, aiUse: '', file }, 2048).errors.includes('Describe how you used AI.'));
});

test('validateUpload — only keeps a copy of files under the size limit', () => {
  assert.equal(validateUpload({ title: 'A', file: { name: 'a', size: 100 } }, 2048).storeCopy, true);
  assert.equal(validateUpload({ title: 'A', file: { name: 'a', size: 5000 } }, 2048).storeCopy, false);
});