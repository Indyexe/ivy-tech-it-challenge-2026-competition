/**
 * ai-guide.mjs — Responsible AI Guide controller
 * Populates the course selector and renders policy cards, rubric checklists,
 * and responsible-use tips when a student picks a course.
 */

import { coursePolicies } from './model.mjs';

// ── Helpers ───────────────────────────────────────────────────────────────────
function el(tag, content, className) {
  const node = document.createElement(tag);
  if (content !== undefined) node.textContent = content;
  if (className) node.className = className;
  return node;
}

// ── Render policy card ────────────────────────────────────────────────────────
function renderPolicy(entry) {
  const card = document.getElementById('policy-card');

  const badge = el('span', entry.code, 'policy-badge');

  const header = el('div', undefined, 'policy-card-header');
  const title = el('h2', entry.title);
  const instructor = el('p', `Instructor: ${entry.instructor}`, 'muted');
  header.append(badge, title, instructor);

  const policyText = el('p', entry.policy, 'policy-text');

  // Allowed / prohibited columns
  const columns = el('div', undefined, 'policy-columns');

  const allowedSection = el('div', undefined, 'policy-column');
  allowedSection.append(el('h3', 'Allowed'));
  const allowedList = el('ul', undefined, 'allowed-list');
  for (const item of entry.allowed) allowedList.append(el('li', item));
  allowedSection.append(allowedList);

  const prohibitedSection = el('div', undefined, 'policy-column');
  prohibitedSection.append(el('h3', 'Not permitted'));
  const prohibitedList = el('ul', undefined, 'prohibited-list');
  for (const item of entry.prohibited) prohibitedList.append(el('li', item));
  prohibitedSection.append(prohibitedList);

  columns.append(allowedSection, prohibitedSection);

  // Rubric checklist
  const rubricHeading = el('h3', 'Before you use AI, ask yourself:');
  const rubricList = el('ul', undefined, 'rubric-list');
  for (const question of entry.rubric) rubricList.append(el('li', question));

  const wrapper = el('div', undefined, 'policy-card panel');
  wrapper.append(header, policyText, columns, rubricHeading, rubricList);
  card.replaceChildren(wrapper);
}

// ── Render tips panel ─────────────────────────────────────────────────────────
function renderTips(entry) {
  const panel = document.getElementById('tips-panel');

  const heading = el('h2', 'Responsible use tips');
  const list = el('ul', undefined, 'tip-list');
  for (const tip of entry.tips) list.append(el('li', tip));

  const wrapper = el('div', undefined, 'panel');
  wrapper.append(heading, list);
  panel.replaceChildren(wrapper);
}

// ── Clear panels ──────────────────────────────────────────────────────────────
function clearPanels() {
  const placeholder = el('p', 'Select a course above to see its AI policy and responsible use tips.', 'muted');
  document.getElementById('policy-card').replaceChildren(placeholder);
  document.getElementById('tips-panel').replaceChildren();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('course-select');
  if (!select) return;

  // Populate options
  for (const course of coursePolicies) {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = `${course.code} — ${course.title}`;
    select.append(option);
  }

  // Show placeholder on load
  clearPanels();

  // Respond to course selection
  select.addEventListener('change', () => {
    const entry = coursePolicies.find(c => c.id === select.value);
    if (!entry) {
      clearPanels();
      return;
    }
    renderPolicy(entry);
    renderTips(entry);
  });
});
