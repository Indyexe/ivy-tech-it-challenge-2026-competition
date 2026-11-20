import { impactStatement, sampleWeeks, summarizeWeeks } from './model.mjs';

// Keep the original key so previously saved drafts still load.
const storageKey = 'ivy-tech-2030-starter-v1';
const pageNames = {
  overview: 'Hub', analytics: 'Analytics', roadmap: 'Roadmap', about: 'About',
  define: 'Define', build: 'Build', iterate: 'Iterate', impact: 'Present',
};
const byId = (id) => document.getElementById(id);
const sections = document.querySelectorAll('[data-view]');
const links = document.querySelectorAll('nav a');
const scopeForm = byId('scope-form');
const impactForm = byId('impact-form');
const rangeButtons = document.querySelectorAll('[data-weeks]');
const phaseStatus = document.querySelectorAll('[data-phase-status]');
const milestones = [...document.querySelectorAll('.timeline-tab')].map((tab) => {
  const panel = byId(tab.getAttribute('aria-controls'));
  return {
    tab, panel,
    name: panel.querySelector('h3').textContent,
    status: tab.querySelector('.timeline-state'),
    count: panel.querySelector('.milestone-count'),
    tasks: [...panel.querySelectorAll('[data-roadmap-task]')],
  };
});
const roadmapTasks = milestones.flatMap((milestone) => milestone.tasks);
const verticalTimeline = window.matchMedia('(max-width: 620px)');
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });
const number = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12 });
const signed = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, signDisplay: 'exceptZero' });
const hubSteps = {
  define: { action: 'Define the scope', detail: 'Start by identifying one person and one problem.' },
  build: { action: 'Open the prototype', detail: 'Your scope is saved. Run the sample dashboard next.' },
  iterate: { action: 'Record pilot feedback', detail: 'Try a task with a pilot user and capture what you learn.' },
  impact: { action: 'Draft the impact statement', detail: 'Summarize the expected impact and how you’ll measure it.' },
};

let statusTimer;
let selectedMilestone;
function announce(message) {
  byId('status').textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { byId('status').textContent = ''; }, 5000);
}

function loadDraft() {
  const empty = { scope: null, demoRun: false, feedback: [], impact: null, roadmap: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return { ...empty, ...saved };
  } catch {
    announce('Saved drafts could not be loaded. A new draft is available.');
    return empty;
  }
}

let draft = loadDraft();

function saveDraft(update, message) {
  draft = { ...draft, ...update };
  try {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    announce(message);
  } catch {
    announce('Browser storage is unavailable. Your changes are available until you close or reload this tab.');
  }
  renderDraft();
}

function readForm(form) {
  const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
  const blank = Object.keys(values).find((key) => !values[key]);
  if (blank) {
    form.elements.namedItem(blank).focus();
    announce('Enter a value in each field before saving.');
    return null;
  }
  return values;
}

function restoreForm(form, values) {
  for (const [name, value] of Object.entries(values ?? {})) {
    form.elements.namedItem(name).value = value;
  }
}

function showRoute(focus = false) {
  const hash = window.location.hash.slice(1);
  if (hash === 'main') return;
  const route = Object.hasOwn(pageNames, hash) ? hash : 'overview';

  for (const section of sections) section.hidden = section.dataset.view !== route;
  for (const link of links) {
    if (link.hash === `#${route}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  byId('breadcrumb').textContent = pageNames[route];
  document.title = `${pageNames[route]} · Ivy Tech IT Challenge`;
  if (focus) {
    document.querySelector('[data-view]:not([hidden]) h1').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content !== undefined) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function renderSample(weeksToShow, view) {
  const field = (id) => byId(view === 'analytics' ? `analytics-${id}` : id);
  const weeks = sampleWeeks.slice(-weeksToShow);
  const summary = summarizeWeeks(weeks);
  const scale = Math.max(1, ...sampleWeeks.map((week) => week.completed));
  const rows = [];
  const bars = [];

  for (const week of weeks) {
    const column = element('div', undefined, 'chart-column');
    column.title = `${week.week} · ${week.completed} completed`;
    const bar = element('div', undefined, 'chart-bar');
    bar.style.height = `${(week.completed / scale) * 90}%`;
    column.append(bar, element('span', week.week));
    bars.push(column);

    const row = element('tr');
    const heading = element('th', week.week);
    heading.scope = 'row';
    row.append(heading, element('td', week.records), element('td', week.completed));
    rows.push(row);
  }

  field('sample-chart').replaceChildren(...bars);
  field('sample-data').replaceChildren(...rows);
  field('records-total').textContent = number.format(summary.records);
  field('records-completed').textContent = number.format(summary.completed);
  field('completion-rate').textContent = percent.format(summary.rate);
  field('period-total').textContent = `Last ${weeksToShow} sample weeks`;
  for (const button of rangeButtons) {
    if (button.closest('[data-view]').dataset.view === view) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.weeks) === weeksToShow));
    }
  }
}

function renderHub() {
  const states = {
    define: Boolean(draft.scope),
    build: draft.demoRun,
    iterate: draft.feedback.length > 0,
    impact: Boolean(draft.impact),
  };
  const started = Object.values(states).filter(Boolean).length;
  const next = Object.keys(states).find((phase) => !states[phase]);
  const nextStep = hubSteps[next];

  byId('draft-progress').textContent = `${started} of 4 phases started`;
  byId('phase-progress').value = started;
  byId('hub-next').textContent = nextStep?.detail ?? 'All four phases have activity. Review your statement before the demo.';
  byId('hero-action').textContent = nextStep?.action ?? 'Review your impact statement';
  byId('hero-action').href = `#${next ?? 'impact'}`;
  byId('hero-demo').hidden = next === 'build';

  for (const badge of phaseStatus) {
    const phase = badge.dataset.phaseStatus;
    const label = states[phase] ? 'Started' : phase === next ? 'Up next' : 'Ready';
    badge.textContent = label;
    badge.dataset.state = label === 'Up next' ? 'next' : label.toLowerCase();
  }
  return started;
}

function selectMilestone(index) {
  selectedMilestone = index;
  for (const [position, milestone] of milestones.entries()) {
    const selected = position === index;
    milestone.tab.setAttribute('aria-selected', String(selected));
    milestone.tab.tabIndex = selected ? 0 : -1;
    milestone.panel.hidden = !selected;
  }
}

function renderRoadmap() {
  let next;
  let completed = 0;
  for (const [index, milestone] of milestones.entries()) {
    for (const task of milestone.tasks) task.checked = draft.roadmap[task.dataset.roadmapTask] === true;
    const done = milestone.tasks.filter((task) => task.checked).length;
    const total = milestone.tasks.length;
    const complete = done === total;
    completed += done;
    if (!complete) next ??= index;
    milestone.count.textContent = `${done} / ${total}`;
    milestone.status.textContent = complete ? 'Complete' : index === next ? 'Up next' : done ? 'In progress' : 'Planned';
    milestone.tab.dataset.state = complete ? 'complete' : index === next ? 'next' : 'planned';
  }
  if (selectedMilestone === undefined) selectMilestone(next ?? 0);
  const progress = byId('roadmap-progress');
  progress.max = roadmapTasks.length;
  progress.value = completed;
  byId('roadmap-count').textContent = `${completed} of ${roadmapTasks.length} tasks complete`;
  byId('roadmap-next').textContent = next === undefined ? 'All milestones complete' : `Next milestone: ${milestones[next].name}`;
  return completed;
}

function renderAnalytics(started, completed) {
  byId('analytics-phases').textContent = `${started} / ${Object.keys(hubSteps).length}`;
  byId('analytics-feedback').textContent = draft.feedback.length;
  byId('analytics-tasks').textContent = `${completed} / ${roadmapTasks.length}`;
  byId('analytics-impact').textContent = draft.impact ? 'Saved' : 'Open';
  const scope = draft.scope;
  byId('analytics-empty').hidden = Boolean(scope);
  byId('analytics-scope').hidden = !scope;
  if (scope) {
    const baseline = Number(scope.baseline);
    const target = Number(scope.target);
    byId('analytics-metric').textContent = scope.metric;
    byId('analytics-baseline').textContent = `${number.format(baseline)} ${scope.unit}`;
    byId('analytics-target').textContent = `${number.format(target)} ${scope.unit}`;
    byId('analytics-change').textContent = `${signed.format(target - baseline)} ${scope.unit}`;
  }
}

function renderDraft() {
  const started = renderHub();
  const completed = renderRoadmap();
  renderAnalytics(started, completed);
  byId('record-demo').disabled = draft.demoRun;
  byId('record-demo').textContent = draft.demoRun ? 'Practice demo recorded' : 'Mark practice demo as run';
  byId('feedback-count').textContent = draft.feedback.length;
  byId('feedback-empty').hidden = draft.feedback.length > 0;
  const feedbackItems = draft.feedback.map((entry) => {
    const item = element('li');
    item.append(element('h3', entry.task), element('p', `Observed: ${entry.observation}`), element('p', `Change: ${entry.change}`));
    return item;
  });
  byId('feedback-list').replaceChildren(...feedbackItems);
  byId('impact-preview').textContent = impactStatement(draft.scope ?? {}, draft.impact ?? {});
}

scopeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const scope = readForm(scopeForm);
  if (!scope) return;
  if (!Number.isFinite(Number(scope.target) - Number(scope.baseline))) {
    announce('Enter a baseline and target with a finite difference.');
    return;
  }
  saveDraft({ scope }, 'Scope saved.');
});

byId('feedback-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const feedback = readForm(event.currentTarget);
  if (!feedback) return;
  saveDraft({ feedback: [feedback, ...draft.feedback] }, 'Feedback added.');
  event.currentTarget.reset();
  event.currentTarget.elements.namedItem('task').focus();
});

impactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const impact = readForm(impactForm);
  if (impact) saveDraft({ impact }, 'Impact draft saved.');
});

byId('record-demo').addEventListener('click', () => saveDraft({ demoRun: true }, 'Practice demo recorded.'));
for (const button of rangeButtons) {
  button.addEventListener('click', () => renderSample(Number(button.dataset.weeks), button.closest('[data-view]').dataset.view));
}
for (const task of roadmapTasks) {
  task.addEventListener('change', () => {
    saveDraft({ roadmap: { ...draft.roadmap, [task.dataset.roadmapTask]: task.checked } }, 'Roadmap progress saved.');
  });
}
function updateTimelineOrientation() {
  document.querySelector('.timeline-track').setAttribute('aria-orientation', verticalTimeline.matches ? 'vertical' : 'horizontal');
}
verticalTimeline.addEventListener('change', updateTimelineOrientation);
updateTimelineOrientation();

for (const [index, { tab }] of milestones.entries()) {
  tab.addEventListener('click', () => selectMilestone(index));
  tab.addEventListener('keydown', (event) => {
    const previous = verticalTimeline.matches ? 'ArrowUp' : 'ArrowLeft';
    const next = verticalTimeline.matches ? 'ArrowDown' : 'ArrowRight';
    const destinations = {
      Home: 0,
      End: milestones.length - 1,
      [previous]: (index + milestones.length - 1) % milestones.length,
      [next]: (index + 1) % milestones.length,
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const destination = destinations[event.key];
    selectMilestone(destination);
    milestones[destination].tab.focus();
  });
}

byId('export-impact').addEventListener('click', () => {
  const markdown = impactStatement(draft.scope ?? {}, draft.impact ?? {});
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const link = element('a');
  link.href = url;
  link.download = 'Impact-Statement.md';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

window.addEventListener('hashchange', () => showRoute(true));
restoreForm(scopeForm, draft.scope);
restoreForm(impactForm, draft.impact);
byId('about-team').append(document.querySelector('.team-grid').cloneNode(true));
renderSample(12, 'build');
renderSample(12, 'analytics');
renderDraft();
showRoute();
