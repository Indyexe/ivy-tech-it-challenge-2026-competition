/**
 * app.mjs — A-Ivy application
 * Routing · mobile menu · Student/Instructor views · localStorage · Export CSV
 * AI Check · AI Coach · AI Literacy · Events · Course Policies · Results
 */

import {
  courses, demoStudents, demoInstructors, programTags, events, eventsLastUpdated,
  coachTaskTypes, coachPrompts, certification, quiz, samplePilotWeeks,
} from './data.mjs';
import {
  matchQuestion, disclosureNote, emailDraft, filterCourses, ruleSummary,
  allowedAlternatives, toCsv, coachPlan, scoreQuiz, badgeMetrics,
  upcomingEvents, isoDate,
} from './logic.mjs';

const byId = (id) => document.getElementById(id);

// ─── Small DOM helper (text only, never innerHTML with data) ─────────────────

function el(tag, { className, text, attrs } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  for (const [key, value] of Object.entries(attrs ?? {})) node.setAttribute(key, value);
  for (const child of children) if (child) node.append(child);
  return node;
}

// ─── Storage (safe if the browser blocks storage) ────────────────────────────

const storageKey = 'a-ivy-v1';

function emptyDraft() {
  return {
    role: 'student',
    studentId: 'student-alex',
    instructorId: 'instructor-morgan',
    badgeLog: [],   // { ts, studentId, examInterest }
  };
}

function loadDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      const merged = { ...emptyDraft(), ...saved };
      if (!['student', 'instructor'].includes(merged.role)) merged.role = 'student';
      if (!Array.isArray(merged.badgeLog)) merged.badgeLog = [];
      return merged;
    }
  } catch { /* storage unavailable or corrupt */ }
  return emptyDraft();
}

let draft = loadDraft();

function saveDraft(update) {
  draft = { ...draft, ...update };
  try {
    localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    announce('Browser storage is blocked. Changes last until you close this tab.');
  }
}

// ─── Announce (accessible status) ────────────────────────────────────────────

const statusEl = byId('status');
let statusTimer = null;

function announce(message) {
  statusEl.textContent = message;
  statusEl.classList.add('visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => statusEl.classList.remove('visible'), 4000);
}

function copyText(text, label) {
  if (!navigator.clipboard) { announce('Copy is not available. Select the text and copy it manually.'); return; }
  navigator.clipboard.writeText(text)
    .then(() => announce(`${label} copied.`))
    .catch(() => announce('Copy failed. Select the text and copy it manually.'));
}

// ─── Routing ─────────────────────────────────────────────────────────────────

const pageNames = {
  'ai-check': 'AI Check',
  'ai-coach': 'AI Coach',
  'literacy': 'AI Literacy',
  'projects': 'Projects',
  'events': 'Events',
  'policies': 'Course Policies',
  'literacy-results': 'AI Literacy Results',
};
const roleRoutes = {
  student: new Set(['ai-check', 'ai-coach', 'literacy', 'projects', 'events']),
  instructor: new Set(['policies', 'literacy-results', 'projects']),
};
const homeRoute = { student: 'ai-check', instructor: 'policies' };
const sections = document.querySelectorAll('[data-view]');
const navLinks = document.querySelectorAll('[data-nav]');

function currentRoute() {
  const hash = window.location.hash.slice(1);
  const route = Object.hasOwn(pageNames, hash) ? hash : homeRoute[draft.role];
  return roleRoutes[draft.role].has(route) ? route : homeRoute[draft.role];
}

function showRoute(focus = false) {
  const route = currentRoute();
  sections.forEach((s) => { s.hidden = s.dataset.view !== route; });
  navLinks.forEach((a) => {
    if (a.dataset.nav === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = `${pageNames[route]} — A-Ivy`;
  renderRoute(route);
  if (focus) {
    const heading = document.querySelector(`[data-view="${route}"] [tabindex="-1"]`);
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

// Pages that show live data re-render when opened.
function renderRoute(route) {
  if (route === 'events') renderEvents();
  if (route === 'literacy') renderLiteracy();
  if (route === 'literacy-results') renderResults();
  if (route === 'policies') renderPolicies();
}

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#main') return;   // skip link target
  closeMenu();
  showRoute(true);
});

// ─── Mobile menu ─────────────────────────────────────────────────────────────

const menuToggle = byId('menu-toggle');
const siteNav = byId('site-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  if (open) [...siteNav.querySelectorAll('a')].find((a) => a.offsetParent)?.focus();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

// ─── Role switcher: Student / Instructor ─────────────────────────────────────

const roleSelect = byId('role-select');
const demoProfileName = byId('demo-profile-name');

function currentStudent() {
  return demoStudents.find((d) => d.id === draft.studentId) || demoStudents[0];
}

function currentInstructor() {
  return demoInstructors.find((d) => d.id === draft.instructorId) || demoInstructors[0];
}

function applyRole(role) {
  document.body.classList.toggle('role-instructor', role === 'instructor');
  roleSelect.value = role;
  if (role === 'student') {
    const s = currentStudent();
    demoProfileName.textContent = `${s.name} (${s.program}) · ${s.label}`;
  } else {
    const i = currentInstructor();
    demoProfileName.textContent = `${i.name} (${i.department}) · ${i.label}`;
  }
  showRoute();
}

roleSelect.addEventListener('change', () => {
  saveDraft({ role: roleSelect.value });
  closeMenu();
  window.location.hash = `#${homeRoute[roleSelect.value]}`;
  applyRole(roleSelect.value);
  announce(`Switched to ${roleSelect.value} view.`);
});

// ─── Export CSV ──────────────────────────────────────────────────────────────

byId('export-csv-btn').addEventListener('click', () => {
  const rows = [
    ['type', 'studentId', 'examInterest', 'ts'],
    ...draft.badgeLog.map((b) => ['badge', b.studentId, b.examInterest ? 'yes' : 'no', b.ts]),
  ];
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }));
  const link = el('a', { attrs: { href: url, download: 'a-ivy-badges.csv' } });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('CSV downloaded.');
});

// ─── Shared rule helpers ─────────────────────────────────────────────────────

const RULES = {
  'allowed': { label: 'Allowed', symbol: '✓', className: 'rule-allowed' },
  'disclosure': { label: 'Allowed with disclosure', symbol: '!', className: 'rule-disclosure' },
  'not-allowed': { label: 'Not allowed', symbol: '✕', className: 'rule-not-allowed' },
};
const ruleInfo = (rule) => RULES[rule] ?? { label: 'Unknown', symbol: '?', className: '' };
const useLabel = (useType) => useType.replace(/-/g, ' ');

function rulePill(rule) {
  const info = ruleInfo(rule);
  return el('span', { className: `rule-pill ${info.className}` }, [
    el('span', { text: info.symbol, attrs: { 'aria-hidden': 'true' } }),
    el('span', { text: info.label }),
  ]);
}

function splitName(course) {
  const [code, ...rest] = course.name.split(' — ');
  return { code, title: rest.join(' — ') || course.name };
}

function trafficList(course) {
  return el('ul', { className: 'traffic-light', attrs: { role: 'list' } }, course.usages.map((u) =>
    el('li', { className: 'tl-item' }, [el('span', { className: 'tl-type', text: useLabel(u.useType) }), rulePill(u.rule)])));
}

// ═══ AI CHECK ════════════════════════════════════════════════════════════════

const searchInput = byId('course-search');
const courseList = byId('course-list');
const courseEmpty = byId('course-empty');
const courseCount = byId('course-count');
const detail = byId('course-detail');
const trafficLightEl = byId('traffic-light');
const courseLastUpdated = byId('course-last-updated');
const coursePolicyLabel = byId('course-policy-label');
const questionForm = byId('question-form');
const questionInput = byId('question-input');
const answerCard = byId('answer-card');

let openCourseId = null;

function sortedCourses(list) {
  const mine = new Set(currentStudent().enrolledCourseIds ?? []);
  return [...list].sort((a, b) => Number(mine.has(b.id)) - Number(mine.has(a.id)));
}

function courseCard(course) {
  const { code, title } = splitName(course);
  const summary = ruleSummary(course);
  const mine = (currentStudent().enrolledCourseIds ?? []).includes(course.id);
  const bodyId = `course-body-${course.id}`;
  const isOpen = course.id === openCourseId;

  const button = el('button', {
    className: 'course-toggle',
    attrs: { type: 'button', 'aria-expanded': String(isOpen), 'aria-controls': bodyId },
  }, [
    el('span', { className: 'course-title' }, [
      el('span', { className: 'course-code', text: code }),
      el('span', { className: 'course-name', text: title }),
      mine ? el('span', { className: 'tag', text: 'In your schedule' }) : null,
    ]),
    el('span', {
      className: 'course-summary',
      text: `${summary.allowed} allowed · ${summary.disclosure} with disclosure · ${summary.notAllowed} not allowed`,
    }),
    el('span', { className: 'chevron', attrs: { 'aria-hidden': 'true' } }),
  ]);
  button.addEventListener('click', () => toggleCourse(course.id));

  const body = el('div', { className: 'course-body', attrs: { id: bodyId } });
  body.hidden = !isOpen;
  if (isOpen) body.append(detail);

  return el('li', { className: `course-card glow-card${isOpen ? ' is-open' : ''}` }, [button, body]);
}

function renderCourseList() {
  const results = sortedCourses(filterCourses(courses, searchInput.value));
  detail.hidden = true;
  document.body.append(detail);   // park it so rebuilding cards doesn't destroy it
  courseList.replaceChildren(...results.map(courseCard));
  if (openCourseId && results.some((c) => c.id === openCourseId)) detail.hidden = false;
  courseEmpty.hidden = results.length > 0;
  courseCount.textContent = searchInput.value.trim()
    ? `${results.length} of ${courses.length} courses match`
    : `${courses.length} courses · tap a course to see its AI rules`;
}

function toggleCourse(courseId) {
  const opening = openCourseId !== courseId;
  openCourseId = opening ? courseId : null;
  if (opening) fillCourseDetail(courses.find((c) => c.id === courseId));
  renderCourseList();
  const toggle = courseList.querySelector(`[aria-controls="course-body-${courseId}"]`);
  toggle?.focus({ preventScroll: true });
  if (opening) toggle?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function fillCourseDetail(course) {
  trafficLightEl.replaceChildren(...course.usages.map((u) => el('li', { className: 'tl-item' }, [
    el('span', { className: 'tl-type', text: useLabel(u.useType) }),
    rulePill(u.rule),
  ])));
  courseLastUpdated.textContent = `Last updated: ${course.lastUpdated}`;
  coursePolicyLabel.textContent = course.policyLabel
    ? `ⓘ ${course.policyLabel}. Replace with your syllabus data when available.`
    : '';
  questionInput.value = '';
  answerCard.hidden = true;
  answerCard.replaceChildren();
}

searchInput.addEventListener('input', renderCourseList);
searchInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;   // Enter opens the first match
  event.preventDefault();
  const first = sortedCourses(filterCourses(courses, searchInput.value))[0];
  if (first && first.id !== openCourseId) toggleCourse(first.id);
});

byId('hero-check-btn').addEventListener('click', () => {
  byId('course-finder').scrollIntoView({ behavior: 'smooth', block: 'start' });
  searchInput.focus({ preventScroll: true });
});

function instructorLink(course, question, primary = false) {
  return el('a', {
    className: `btn ${primary ? 'btn-primary' : 'btn-secondary'}`,
    text: 'Ask my instructor →',
    attrs: { href: emailDraft(course, question) },
  });
}

function alternativesBlock(course) {
  const alternatives = allowedAlternatives(course);
  if (alternatives.length === 0) {
    return el('p', {
      className: 'next-step',
      text: "This course doesn't allow AI for this. Ask your instructor about other support, like tutoring.",
    });
  }
  return el('div', { className: 'next-step' }, [
    el('p', { className: 'next-step-title', text: 'In this course, you CAN use AI for:' }),
    el('ul', { className: 'alt-list' }, alternatives.map((u) => el('li', {}, [
      el('span', { text: useLabel(u.useType) }), rulePill(u.rule),
    ]))),
  ]);
}

function disclosureBlock(course, useType) {
  const note = disclosureNote(course.name, useType);
  const copy = el('button', { className: 'btn btn-secondary', text: 'Copy disclosure note', attrs: { type: 'button' } });
  copy.addEventListener('click', () => copyText(note, 'Disclosure note'));
  return el('div', { className: 'next-step' }, [
    el('p', { className: 'next-step-title', text: 'Next step: add this note to your work' }),
    el('pre', { className: 'disclosure-box', text: note }),
    el('div', { className: 'btn-row' }, [copy]),
  ]);
}

function quoteBlock(course, usage) {
  return el('blockquote', { className: 'answer-quote' }, [
    el('p', { text: `“${usage.quote}”` }),
    el('cite', { text: `${course.name} syllabus AI policy${course.policyLabel ? ` (${course.policyLabel})` : ''}` }),
  ]);
}

function renderAnswer(course, result, question) {
  const children = [];
  if (!result) {
    answerCard.className = 'answer-card not-covered';
    children.push(
      el('p', { className: 'answer-rule', text: 'Not covered. Ask your instructor.' }),
      el('p', { text: "This course's policy doesn't address your question. The safest step is to ask before using AI." }),
      alternativesBlock(course),
      el('div', { className: 'btn-row' }, [instructorLink(course, question, true)]),
    );
  } else {
    const { primary, matches, conflict } = result;
    const info = ruleInfo(primary.rule);
    answerCard.className = `answer-card ${info.className}`;
    children.push(el('p', { className: 'answer-rule' }, [
      el('span', { text: info.symbol, attrs: { 'aria-hidden': 'true' } }),
      el('span', { text: ` ${info.label}: ${useLabel(primary.useType)}` }),
    ]));
    if (conflict) {
      children.push(
        el('p', { className: 'conflict-note', text: "Your question touches more than one rule. We're showing the strictest one to keep you safe." }),
        el('ul', { className: 'match-list' }, matches.map((m) => el('li', {}, [
          el('div', { className: 'match-head' }, [el('strong', { text: useLabel(m.useType) }), rulePill(m.rule)]),
          quoteBlock(course, m),
        ]))),
      );
    } else {
      children.push(quoteBlock(course, primary));
    }
    if (primary.tip) children.push(el('p', { className: 'tip', text: primary.tip }));
    if (primary.rule === 'disclosure') children.push(disclosureBlock(course, primary.useType));
    if (primary.rule === 'not-allowed') children.push(alternativesBlock(course));
    children.push(el('div', { className: 'btn-row' }, [instructorLink(course, question, conflict)]));
  }
  answerCard.replaceChildren(...children);
  answerCard.hidden = false;
  answerCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!question) { announce('Type a question first.'); questionInput.focus(); return; }
  const course = courses.find((c) => c.id === openCourseId);
  if (!course) return;
  renderAnswer(course, matchQuestion(question, course.usages), question);
});

for (const chip of document.querySelectorAll('.chip[data-q]')) {
  chip.addEventListener('click', () => {
    questionInput.value = chip.dataset.q;
    questionForm.requestSubmit();
  });
}

// ═══ AI COACH ════════════════════════════════════════════════════════════════

const coachForm = byId('coach-form');
const coachCourse = byId('coach-course');
const coachInput = byId('coach-input');
const coachResult = byId('coach-result');

coachCourse.replaceChildren(...sortedCourses(courses).map((c) => el('option', { text: c.name, attrs: { value: c.id } })));

function renderCoach(course, description) {
  const plan = coachPlan(course, description, coachTaskTypes, coachPrompts);
  const children = [
    el('div', { className: 'card-header' }, [
      el('h2', { text: plan.task ? `${plan.task.label} · ${splitName(course).code}` : `Your assignment · ${splitName(course).code}` }),
      el('span', { className: 'last-updated', text: `Policy updated ${course.lastUpdated}` }),
    ]),
  ];

  if (plan.suggestions.length) {
    children.push(el('p', { className: 'next-step-title', text: 'Good ways to use AI that this course allows:' }));
    children.push(el('ol', { className: 'prompt-list' }, plan.suggestions.map((s) => {
      const copy = el('button', { className: 'btn btn-secondary btn-sm', text: 'Copy prompt', attrs: { type: 'button' } });
      copy.addEventListener('click', () => copyText(s.prompt, 'Prompt'));
      return el('li', { className: 'prompt-item' }, [
        el('div', { className: 'match-head' }, [el('strong', { text: useLabel(s.useType) }), rulePill(s.rule)]),
        el('p', { className: 'prompt-text', text: s.prompt }),
        copy,
      ]);
    })));
  } else {
    children.push(el('p', {
      className: 'conflict-note',
      text: "This course doesn't allow AI for this kind of work. Ask your instructor about other support, like tutoring.",
    }));
  }

  if (plan.notAllowed.length) {
    children.push(el('div', { className: 'next-step' }, [
      el('p', { className: 'next-step-title', text: 'Avoid in this course:' }),
      el('ul', { className: 'alt-list' }, plan.notAllowed.map((u) => el('li', {}, [el('span', { text: useLabel(u) }), rulePill('not-allowed')]))),
    ]));
  }

  if (plan.needsDisclosure) {
    const first = plan.suggestions.find((s) => s.rule === 'disclosure');
    children.push(disclosureBlock(course, first.useType));
  }

  children.push(el('p', { className: 'tip', text: 'Always check AI output against your notes or a trusted source, and only submit work you can explain.' }));
  children.push(el('div', { className: 'btn-row' }, [instructorLink(course, description)]));

  coachResult.replaceChildren(...children);
  coachResult.hidden = false;
  coachResult.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

coachForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const description = coachInput.value.trim();
  if (!description) { announce('Describe your assignment first.'); coachInput.focus(); return; }
  renderCoach(courses.find((c) => c.id === coachCourse.value), description);
});

for (const chip of document.querySelectorAll('.chip[data-coach]')) {
  chip.addEventListener('click', () => {
    const [courseId, text] = chip.dataset.coach.split('|');
    coachCourse.value = courseId;
    coachInput.value = text;
    coachForm.requestSubmit();
  });
}

// ═══ AI LITERACY (student) ═══════════════════════════════════════════════════

const quizForm = byId('quiz-form');
const quizList = byId('quiz-list');
const quizResult = byId('quiz-result');
const badgePanel = byId('badge-earned');
byId('pass-mark-label').textContent = `${certification.passMark} of ${quiz.length}`;

function myBadge() {
  return draft.badgeLog.find((b) => b.studentId === currentStudent().id);
}

function buildQuiz() {
  quizList.replaceChildren(...quiz.map((q, i) => el('li', { className: 'quiz-item panel' }, [
    el('fieldset', {}, [
      el('legend', { text: q.scenario }),
      ...q.options.map((option, j) => el('label', { className: 'quiz-option' }, [
        el('input', { attrs: { type: 'radio', name: q.id, value: String(j) } }),
        el('span', { text: option }),
      ])),
    ]),
  ])));
}

function setExamInterest(value) {
  const id = currentStudent().id;
  saveDraft({ badgeLog: draft.badgeLog.map((b) => (b.studentId === id ? { ...b, examInterest: value } : b)) });
  renderLiteracy();
  announce(value ? 'Thanks! Your interest in the external exam is recorded.' : 'No problem. You can change this anytime.');
}

function downloadCertificate(badge) {
  const date = new Date(badge.ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const student = currentStudent();
  const text = [
    '================================================',
    '   IVY TECH COMMUNITY COLLEGE',
    '   AI Responsible Use Micro-Certification',
    '================================================',
    '',
    `This certifies that ${student.name}`,
    `successfully completed the`,
    `${certification.name}`,
    '',
    `Date earned: ${date}`,
    '',
    'Demonstrated competency in:',
    '  - Responsible AI use across academic contexts',
    '  - Academic integrity and AI disclosure',
    '  - Verifying AI-generated information',
    '  - Protecting personal and sensitive data',
    '',
    '------------------------------------------------',
    'Prototype certificate · Sample data only',
    'Not an official Ivy Tech credential',
    '================================================',
  ].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AI-Responsible-Use-Certificate.txt';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Certificate downloaded.');
}

function renderBadge() {
  const badge = myBadge();
  badgePanel.hidden = !badge;
  quizForm.hidden = Boolean(badge);
  if (!badge) return;
  const yes = el('button', { className: `btn ${badge.examInterest ? 'btn-primary' : 'btn-secondary'}`, text: "Yes, I'm interested", attrs: { type: 'button', 'aria-pressed': String(Boolean(badge.examInterest)) } });
  const no = el('button', { className: `btn ${badge.examInterest === false ? 'btn-primary' : 'btn-secondary'}`, text: 'Not now', attrs: { type: 'button', 'aria-pressed': String(badge.examInterest === false) } });
  yes.addEventListener('click', () => setExamInterest(true));
  no.addEventListener('click', () => setExamInterest(false));
  const download = el('button', { className: 'btn btn-secondary', text: 'Download certificate ↓', attrs: { type: 'button' } });
  download.addEventListener('click', () => downloadCertificate(badge));
  badgePanel.replaceChildren(
    el('div', { className: 'badge-row' }, [
      el('div', { className: 'badge-medal', attrs: { 'aria-hidden': 'true' } }, [el('span', { text: '✓' })]),
      el('div', {}, [
        el('p', { className: 'eyebrow', text: 'Badge earned' }),
        el('h2', { text: certification.name }),
        el('p', { className: 'hint', text: `${certification.status} Earned ${new Date(badge.ts).toLocaleDateString()}.` }),
        download,
      ]),
    ]),
    el('div', { className: 'next-step' }, [
      el('p', { className: 'next-step-title', text: 'Next step: interested in the Ivy Tech–sponsored external AI literacy exam?' }),
      el('div', { className: 'btn-row' }, [yes, no]),
    ]),
  );
}

function renderLiteracy() {
  if (!quizList.children.length) buildQuiz();
  renderBadge();
}

quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const answers = quiz.map((q) => {
    const picked = quizForm.querySelector(`input[name="${q.id}"]:checked`);
    return picked ? Number(picked.value) : undefined;
  });
  const unanswered = answers.findIndex((a) => a === undefined);
  if (unanswered !== -1) {
    announce(`Answer scenario ${unanswered + 1} first.`);
    quizForm.querySelector(`input[name="${quiz[unanswered].id}"]`).focus();
    return;
  }

  const score = scoreQuiz(quiz, answers, certification.passMark);
  if (score.passed) {
    saveDraft({ badgeLog: [...draft.badgeLog, { ts: new Date().toISOString(), studentId: currentStudent().id, examInterest: null }] });
    quizResult.hidden = true;
    renderLiteracy();
    badgePanel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    announce(`You passed with ${score.correct} of ${score.total}. Badge earned!`);
    return;
  }

  const retry = el('button', { className: 'btn btn-primary', text: 'Try again', attrs: { type: 'button' } });
  retry.addEventListener('click', () => {
    quizForm.reset();
    quizResult.hidden = true;
    quizForm.querySelector('input')?.focus();
  });
  quizResult.className = 'answer-card rule-disclosure';
  quizResult.replaceChildren(
    el('p', { className: 'answer-rule', text: `${score.correct} of ${score.total} correct. You need ${certification.passMark} to earn the badge.` }),
    el('ul', { className: 'match-list' }, quiz.filter((q) => score.missed.includes(q.id)).map((q) => el('li', {}, [
      el('strong', { text: q.scenario }),
      el('p', { className: 'tip', text: q.explain }),
    ]))),
    el('div', { className: 'btn-row' }, [retry]),
  );
  quizResult.hidden = false;
  quizResult.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

// ═══ EVENTS ══════════════════════════════════════════════════════════════════

const eventList = byId('event-list');
const eventsMine = byId('events-mine');
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' });

function renderEvents() {
  const today = isoDate(new Date());
  const tag = programTags[currentStudent().program];
  const list = upcomingEvents(events, today, eventsMine.checked ? tag : null);
  byId('events-updated').textContent = `Last updated: ${eventsLastUpdated}`;
  eventList.replaceChildren(...list.map((e) => {
    const date = new Date(`${e.date}T00:00:00Z`);
    const forMe = e.programs.includes(tag);
    return el('li', { className: 'event-card glow-card' }, [
      el('div', { className: 'event-date', attrs: { 'aria-hidden': 'true' } }, [
        el('span', { className: 'event-month', text: monthFmt.format(date) }),
        el('span', { className: 'event-day', text: String(date.getUTCDate()) }),
        el('span', { className: 'event-weekday', text: weekdayFmt.format(date) }),
      ]),
      el('div', { className: 'event-body' }, [
        el('h2', { text: e.title }),
        el('p', { className: 'event-meta', text: `${weekdayFmt.format(date)}, ${monthFmt.format(date)} ${date.getUTCDate()} · ${e.time}` }),
        el('p', { className: 'event-meta', text: e.location }),
        el('div', { className: 'event-tags' }, [
          e.date === today ? el('span', { className: 'tag tag-today', text: 'Today' }) : null,
          forMe ? el('span', { className: 'tag', text: 'For your program' }) : null,
          el('span', { className: 'event-source', text: `Source: ${e.source}` }),
        ]),
      ]),
    ]);
  }));
  byId('events-empty').hidden = list.length > 0;
}

eventsMine.addEventListener('change', renderEvents);

// ═══ COURSE POLICIES (instructor) ════════════════════════════════════════════

function renderPolicies() {
  const mine = new Set(currentInstructor().courseIds);
  const list = [...courses].sort((a, b) => Number(mine.has(b.id)) - Number(mine.has(a.id)));
  byId('policy-list').replaceChildren(...list.map((course) => {
    const { code, title } = splitName(course);
    return el('article', { className: 'panel policy-card' }, [
      el('div', { className: 'card-header' }, [
        el('h2', {}, [el('span', { className: 'course-code', text: `${code} ` }), el('span', { className: 'course-name', text: title })]),
        el('span', { className: 'last-updated', text: `Last updated: ${course.lastUpdated}` }),
      ]),
      mine.has(course.id) ? el('span', { className: 'tag', text: 'Your course' }) : null,
      el('blockquote', { className: 'answer-quote' }, [el('p', { text: course.policyText })]),
      trafficList(course),
      el('p', { className: 'hint', text: `${course.policyLabel ?? 'Policy'} · Student questions go to ${course.instructorEmail}` }),
    ]);
  }));
}

// ═══ AI LITERACY RESULTS (instructor) ════════════════════════════════════════

const pct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

function statCard(label, value, detail, extra) {
  return el('div', { className: 'stat-card panel' }, [
    el('p', { className: 'stat-label', text: label }),
    el('p', { className: 'stat-value', text: value }),
    extra,
    el('p', { className: 'hint', text: detail }),
  ]);
}

function renderResults() {
  const m = badgeMetrics(samplePilotWeeks, draft.badgeLog, certification.badgeTarget, certification.examConversionTarget);
  const bar = el('progress', { className: 'progress', attrs: { max: String(certification.badgeTarget), value: String(Math.min(m.total, certification.badgeTarget)), 'aria-label': 'Badges toward target' } });

  byId('results').replaceChildren(
    el('div', { className: 'stat-grid' }, [
      statCard('Badges earned', `${m.total} / ${certification.badgeTarget}`, `${pct.format(m.progress)} of the first-semester target · ${m.remaining} to go`, bar),
      statCard('External exam interest', pct.format(m.conversion), `${m.interested} of ${m.total} badge earners · target ${pct.format(certification.examConversionTarget)}${m.conversionMet ? ' · target met' : ''}`),
      statCard('Baseline', String(certification.baseline), certification.baselineNote),
    ]),
    el('div', { className: 'panel' }, [
      el('h2', { text: 'Badges issued per week' }),
      el('div', { className: 'table-wrap' }, [
        el('table', { className: 'data-table' }, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: 'Week', attrs: { scope: 'col' } }),
            el('th', { text: 'Badges', attrs: { scope: 'col' } }),
            el('th', { text: 'Exam interest', attrs: { scope: 'col' } }),
            el('th', { text: 'Data', attrs: { scope: 'col' } }),
          ])]),
          el('tbody', {}, m.weeks.map((w) => el('tr', {}, [
            el('th', { text: w.week, attrs: { scope: 'row' } }),
            el('td', { text: String(w.badges) }),
            el('td', { text: String(w.examInterest) }),
            el('td', {}, [el('span', { className: `tag${w.sample ? ' tag-sample' : ''}`, text: w.sample ? 'Sample pilot data' : 'Live (this device)' })]),
          ]))),
        ]),
      ]),
      el('p', { className: 'hint', text: 'Weeks 1–4 are labeled sample pilot data across three courses. "This device" shows real badges earned in this browser.' }),
    ]),
  );
}

// ─── Init ────────────────────────────────────────────────────────────────────

applyRole(draft.role);
renderCourseList();
