/**
 * logic.mjs — A-Ivy pure functions
 *
 * No DOM access, no side effects. All functions are importable by logic.test.mjs
 * without a browser environment.
 */

// ─── Rules ───────────────────────────────────────────────────────────────────

/** Higher number = stricter rule. Used to pick the safest answer on conflicts. */
export const RULE_RANK = { 'allowed': 1, 'disclosure': 2, 'not-allowed': 3 };

// ─── Keyword matching ────────────────────────────────────────────────────────

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * True when `keyword` appears in `text` as a whole word or phrase.
 * Simple endings (s, es, d, ed, ing) are allowed, so "idea" matches "ideas",
 * but "plan" does NOT match "explanation" and "edit" does NOT match "credit".
 *
 * @param {string} text
 * @param {string} keyword
 * @returns {boolean}
 */
export function hasKeyword(text, keyword) {
  if (!text || !keyword) return false;
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(keyword.toLowerCase())}(s|es|d|ed|ing)?(?=$|[^a-z0-9])`,
    'i',
  );
  return pattern.test(text.toLowerCase());
}

// ─── AI Check ────────────────────────────────────────────────────────────────

/**
 * Match a free-text question against EVERY usage rule in a course.
 *
 * Returns null when nothing matches (→ "Not covered, ask your instructor").
 * Otherwise returns:
 *   primary  – the STRICTEST matching usage (Not allowed > Disclosure > Allowed);
 *              ties go to the usage with more keyword hits, then data order
 *   matches  – every matching usage, strictest first, each with matchedKeywords
 *   conflict – true when the matches have different rules
 *
 * @param {string} question - raw user input
 * @param {Array}  usages   - course.usages array from data.mjs
 * @returns {{ primary: object, matches: object[], conflict: boolean } | null}
 */
export function matchQuestion(question, usages) {
  if (!question || !Array.isArray(usages)) return null;

  const matches = usages
    .map((usage, order) => ({
      ...usage,
      order,
      matchedKeywords: usage.keywords.filter((k) => hasKeyword(question, k)),
    }))
    .filter((usage) => usage.matchedKeywords.length > 0)
    .sort((a, b) =>
      (RULE_RANK[b.rule] ?? 0) - (RULE_RANK[a.rule] ?? 0)
      || b.matchedKeywords.length - a.matchedKeywords.length
      || a.order - b.order);

  if (matches.length === 0) return null;
  return {
    primary: matches[0],
    matches,
    conflict: new Set(matches.map((m) => m.rule)).size > 1,
  };
}

/**
 * Uses a student CAN still use AI for in this course (anything not "not-allowed").
 *
 * @param {{ usages: object[] }} course
 * @returns {object[]}
 */
export function allowedAlternatives(course) {
  return (course?.usages ?? []).filter((u) => u.rule !== 'not-allowed');
}

/**
 * Count rules for a course card summary.
 *
 * @param {{ usages: object[] }} course
 * @returns {{ allowed: number, disclosure: number, notAllowed: number }}
 */
export function ruleSummary(course) {
  const usages = course?.usages ?? [];
  return {
    allowed: usages.filter((u) => u.rule === 'allowed').length,
    disclosure: usages.filter((u) => u.rule === 'disclosure').length,
    notAllowed: usages.filter((u) => u.rule === 'not-allowed').length,
  };
}

// ─── Course search ───────────────────────────────────────────────────────────

const compact = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Filter courses by a search query. Matches course code and name,
 * case-insensitive, ignoring spaces and punctuation ("engl111" finds "ENGL 111").
 * Every word in the query must match. An empty query returns all courses.
 *
 * @param {Array}  courses
 * @param {string} query
 * @returns {Array}
 */
export function filterCourses(courses, query) {
  if (!Array.isArray(courses)) return [];
  const tokens = (query ?? '').toLowerCase().split(/\s+/).map(compact).filter(Boolean);
  if (tokens.length === 0) return [...courses];
  return courses.filter((course) => {
    const haystack = compact(`${course.id} ${course.name}`);
    return tokens.every((token) => haystack.includes(token));
  });
}

// ─── Notes, email, CSV ───────────────────────────────────────────────────────

/**
 * Build a pre-filled AI-use disclosure note the student can copy.
 *
 * @param {string} courseName - display name of the course
 * @param {string} useType    - e.g. 'grammar-check'
 * @returns {string}
 */
export function disclosureNote(courseName, useType) {
  const label = useType.replace(/-/g, ' ');
  return (
    `AI Use Disclosure\n` +
    `Course: ${courseName}\n` +
    `Use type: ${label}\n` +
    `I used an AI tool for ${label} assistance on this assignment. ` +
    `All submitted work reflects my own understanding and judgment.`
  );
}

/**
 * Build a mailto: href for an "Ask my instructor" email draft.
 *
 * @param {{ name: string, instructorEmail: string }} course
 * @param {string} question - the student's question
 * @returns {string} a mailto: URL
 */
export function emailDraft(course, question) {
  const subject = encodeURIComponent(`AI policy question — ${course.name}`);
  const body = encodeURIComponent(
    `Hello,\n\n` +
    `I have a question about the AI use policy for ${course.name}.\n\n` +
    `My question: ${question}\n\n` +
    `Could you please clarify what is allowed?\n\n` +
    `Thank you.`
  );
  return `mailto:${course.instructorEmail}?subject=${subject}&body=${body}`;
}

/**
 * Turn rows into CSV text. Every value is quoted and inner quotes are doubled,
 * so commas, quotes, and line breaks in values can't break the file.
 *
 * @param {Array<Array<unknown>>} rows
 * @returns {string}
 */
export function toCsv(rows) {
  return rows
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

// ─── AI Coach (rule-based, grounded in the course policy) ────────────────────

/**
 * Detect the kind of assignment from a plain-words description.
 * Returns the task type with the most keyword hits, or null.
 *
 * @param {string} description
 * @param {Array}  taskTypes - coachTaskTypes from data.mjs
 */
export function detectTask(description, taskTypes) {
  if (!description || !Array.isArray(taskTypes)) return null;
  let best = null;
  let bestHits = 0;
  for (const task of taskTypes) {
    const hits = task.keywords.filter((k) => hasKeyword(description, k)).length;
    if (hits > bestHits) { best = task; bestHits = hits; }
  }
  return best;
}

/**
 * Pull a short topic out of a description: the words after "on" / "about",
 * otherwise the description itself (trimmed).
 *
 * @param {string} description
 * @returns {string}
 */
export function extractTopic(description) {
  const text = (description ?? '').trim().replace(/[.?!]+$/, '');
  const match = text.match(/\b(?:on|about|for)\s+(.+)$/i);
  const topic = (match ? match[1] : text).trim();
  return topic.length > 80 ? `${topic.slice(0, 77)}...` : topic || 'your topic';
}

/**
 * Build a coaching plan for one course + assignment.
 * Only suggests prompts for uses the course allows; lists what is not allowed.
 *
 * @returns {{ task, topic, suggestions: Array<{useType, rule, prompt}>,
 *             notAllowed: string[], needsDisclosure: boolean }}
 */
export function coachPlan(course, description, taskTypes, prompts, maxSuggestions = 3) {
  const task = detectTask(description, taskTypes);
  const topic = extractTopic(description);
  const usages = course?.usages ?? [];
  const order = task?.useTypes ?? usages.map((u) => u.useType);
  const ranked = [...usages].sort((a, b) => {
    const ia = order.indexOf(a.useType);
    const ib = order.indexOf(b.useType);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const suggestions = [];
  for (const usage of ranked) {
    if (usage.rule === 'not-allowed') continue;
    for (const template of prompts[usage.useType] ?? []) {
      if (suggestions.length >= maxSuggestions) break;
      suggestions.push({ useType: usage.useType, rule: usage.rule, prompt: template.replaceAll('{topic}', topic) });
    }
  }

  const relevant = (u) => !task || task.useTypes.includes(u.useType);
  return {
    task,
    topic,
    suggestions,
    notAllowed: usages.filter((u) => u.rule === 'not-allowed' && relevant(u)).map((u) => u.useType),
    needsDisclosure: suggestions.some((s) => s.rule === 'disclosure'),
  };
}

// ─── AI Literacy micro-certification ─────────────────────────────────────────

/**
 * Score the scenario check. answers[i] is the chosen option index (or undefined).
 *
 * @returns {{ correct: number, total: number, passed: boolean, missed: string[] }}
 */
export function scoreQuiz(questions, answers, passMark) {
  const missed = questions.filter((q, i) => answers?.[i] !== q.answer).map((q) => q.id);
  const correct = questions.length - missed.length;
  return { correct, total: questions.length, passed: correct >= passMark, missed };
}

/**
 * Instructor dashboard numbers: sample pilot weeks plus real completions logged
 * on this device (badgeLog entries: { ts, examInterest }).
 */
export function badgeMetrics(sampleWeeks, badgeLog, target, conversionTarget) {
  const weeks = sampleWeeks.map((w) => ({ ...w, sample: true }));
  const local = badgeLog ?? [];
  if (local.length) {
    weeks.push({
      week: 'This device',
      badges: local.length,
      examInterest: local.filter((b) => b.examInterest).length,
      sample: false,
    });
  }
  const total = weeks.reduce((sum, w) => sum + w.badges, 0);
  const interested = weeks.reduce((sum, w) => sum + w.examInterest, 0);
  const conversion = total ? interested / total : 0;
  return {
    weeks,
    total,
    interested,
    conversion,
    progress: target ? Math.min(1, total / target) : 0,
    remaining: Math.max(0, target - total),
    conversionMet: conversion >= conversionTarget,
  };
}

// ─── Events ──────────────────────────────────────────────────────────────────

/**
 * Upcoming events (date >= today), soonest first, optionally only those that
 * match a program tag ('all' events always match).
 *
 * @param {Array}  events
 * @param {string} todayIso  - 'YYYY-MM-DD'
 * @param {string|null} programTag
 */
export function upcomingEvents(events, todayIso, programTag = null) {
  return (events ?? [])
    .filter((e) => e.date >= todayIso)
    .filter((e) => !programTag || e.programs.includes('all') || e.programs.includes(programTag))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Project uploads ─────────────────────────────────────────────────────────

/** Human-readable file size, e.g. 1536 → "1.5 KB". */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace(/\.0$/, '')} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`;
}

/**
 * Check a project upload before saving.
 * Returns a list of problems (empty = OK) and whether the file is small
 * enough to keep a downloadable copy on this device.
 *
 * @param {{ title: string, usedAI: boolean, aiUse: string, file: {name: string, size: number} | null }} upload
 * @param {number} maxStoreBytes
 */
export function validateUpload(upload, maxStoreBytes) {
  const errors = [];
  if (!upload?.title?.trim()) errors.push('Add a project title.');
  if (!upload?.file) errors.push('Choose a file to upload.');
  if (upload?.usedAI && !upload.aiUse?.trim()) errors.push('Describe how you used AI.');
  const storeCopy = Boolean(upload?.file) && upload.file.size <= maxStoreBytes;
  return { ok: errors.length === 0, errors, storeCopy };
}

/** 'YYYY-MM-DD' for a Date in local time. */
export function isoDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
