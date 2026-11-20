# AI Policy Guide — Implementation Plan

## Top-Level Overview

**Goal:** Extend the existing Ivy Tech IT Challenge Hub into a working prototype for a
student-facing Responsible AI Guide. The guide helps students understand what AI use is
allowed in each of their courses, coaches responsible practice, and surfaces how the same
responsible-AI framework can apply to small business contexts.

**Scope:** All changes live inside the existing single-page app. A new "AI Guide" view
is added to the main nav. The existing chatbot, model, styles, and server are reused
and extended — no new frameworks or infrastructure.

**Persona served:** A student who is new to AI and worried about breaking academic
integrity rules because every syllabus has a different AI policy.

**Secondary audience:** Small business owners or community members who want to understand
how to adopt AI tools safely and responsibly — the same literacy skills built in the
student guide translate directly to this context.

**Seed ideas implemented:**
1. Sample course AI policy data (made-up, never real student data)
2. Policy lookup — select a course and see its AI policy with an AI-use rubric
3. Chatbot repurposed to answer student questions about AI on assignments
4. Responsible use tip cards shown per-policy
5. Small business responsible-AI sidebar — reuses the same framework taught to students
6. Micro-certification quiz data — 10 scenario-based questions (5 universal + 5 by
   discipline) with 4 options each, correct answer index, and explanation text;
   exported from model.mjs as `quizScenarios` and ready for the UI once the
   teammate's redesign is merged
7. Completed impact statement in IMPACT-STATEMENT.md

---

## Architecture Overview

```
index.html
 ├── Nav: Hub | AI Guide (NEW) | Analytics | Roadmap | About
 └── data-view="ai-guide" section (NEW)
      ├── Course selector → policy card + AI-use rubric
      ├── Responsible use tips panel
      └── "Beyond the classroom" callout — responsible AI for small business

model.mjs
 └── coursePolicies[] (NEW) — 5 sample courses with made-up policy data
      each entry includes a rubric[] — criteria for evaluating if a specific
      AI use is permitted (e.g. "Does it disclose AI use?", "Is the work original?")

chatbot.mjs
 └── KB entries (NEW) — AI policy questions: allowed tools, violations, citing AI,
      and responsible AI for small businesses

styles.css
 └── .policy-card, .tip-list, .rubric-list (NEW) — minimal additions

IMPACT-STATEMENT.md
 └── Filled in for the student AI policy guide persona
```

---

## Sub-Tasks

---

### Sub-Task 1 — Sample Course Policy Data

**Status:** `[ ] pending`

**Intent:**
Add a `coursePolicies` array to `model.mjs` with made-up policy statements for 5 sample
courses. Each entry includes a rubric — a short checklist of questions a student can ask
themselves to decide whether a specific AI use is permitted under that course's policy.
No real student, instructor, or institutional data is used.

**Expected Outcomes:**
- `model.mjs` exports a `coursePolicies` array
- Each entry has: `id`, `code`, `title`, `instructor` (fictional), `policy` (plain text),
  `allowed` (array of allowed tools/uses), `prohibited` (array of prohibited uses),
  `tips` (array of 2–3 responsible use tips specific to the course),
  `rubric` (array of 3–4 yes/no questions a student checks before using AI)
- Existing exports (`sampleWeeks`, `summarizeWeeks`, `impactStatement`) are unchanged
- `model.test.mjs` gets one new test asserting the array has at least 5 entries and each
  entry has the required fields including `rubric`

**Todo List:**
- [ ] Add `coursePolicies` array to `model.mjs` with 5 entries (CIT 101, ENG 111,
      BUS 201, HIT 115, DAT 220 — all made-up content)
- [ ] Each entry must include a `rubric` array with 3–4 self-check questions
      (e.g. "Have I disclosed that I used an AI tool?",
      "Is the final work substantially my own thinking?",
      "Does my instructor allow AI for this type of task?")
- [ ] Export `coursePolicies` from `model.mjs`
- [ ] Add a test in `model.test.mjs` that verifies structure of `coursePolicies`
      including that each entry has a non-empty `rubric` array
- [ ] Run `node --test model.test.mjs` and confirm all tests pass

**Relevant Context:**
- [`model.mjs`](model.mjs) — add after `sampleWeeks`, before `summarizeWeeks`
- [`model.test.mjs`](model.test.mjs) — uses Node.js `test` + `assert/strict`; follow
  the existing pattern of `test('description', () => { ... })`

---

### Sub-Task 2 — AI Guide View in index.html

**Status:** `[ ] pending`

**Intent:**
Add a new `data-view="ai-guide"` section to `index.html` and an "AI Guide" link in the
main nav. The view contains:
1. A `<select>` for picking a course (options populated by JS)
2. A policy card area showing allowed/prohibited uses and the AI-use rubric checklist
3. A tips panel for the selected course
4. A "Beyond the Classroom" callout explaining how the same responsible-AI principles
   apply when adopting AI tools in a small business

This gives judges something to click on and interact with during the demo.

**Expected Outcomes:**
- "AI Guide" appears in the main workspace nav between "Hub" and "Analytics"
- Navigating to `#ai-guide` shows the new section and hides all others
- The course `<select>` is populated with the 5 sample courses
- Selecting a course renders its policy card, rubric, and tips
- The "Beyond the Classroom" callout is always visible at the bottom of the view,
  connecting the student AI literacy framework to small business responsible AI adoption
- The breadcrumb and page title update to "AI Guide" when the view is active

**Todo List:**
- [ ] Add `<a href="#ai-guide">AI Guide</a>` to the main `<nav aria-label="Workspace">`
      in `index.html` — insert after the Hub link
- [ ] Add `<section data-view="ai-guide" aria-labelledby="ai-guide-title" hidden>`
      containing: eyebrow, h1, intro paragraph, course `<select id="course-select">`,
      empty `<div id="policy-card">`, empty `<div id="tips-panel">`,
      and a static "Beyond the Classroom" callout div
- [ ] Add `<script type="module" src="ai-guide.mjs"></script>` to `<head>`
- [ ] Update `app.mjs` `pageNames` map: add `'ai-guide': 'AI Guide'`

**Relevant Context:**
- [`index.html`](index.html:19) — existing nav at line 19; existing views start at line 36
- [`app.mjs`](app.mjs:5) — `pageNames` object at line 5; `showRoute()` at line 87 uses
  `data-view` and `pageNames` — adding the key there is all that is needed for routing
- The `hidden` attribute pattern is already used by all other views
- The "Beyond the Classroom" callout should reuse the existing `.callout` CSS class
- Do NOT touch the phase nav (`aria-label="Challenge phases"`) — that stays as-is

---

### Sub-Task 3 — AI Guide Controller (ai-guide.mjs)

**Status:** `[ ] pending`

**Intent:**
Create a new `ai-guide.mjs` ES module that:
1. Imports `coursePolicies` from `model.mjs`
2. Populates the `<select>` with course options on `DOMContentLoaded`
3. Renders the policy card, rubric checklist, and tips panel when the user picks a course
4. Clears / shows a "Select a course above" placeholder when nothing is selected

This module follows the same vanilla JS, no-framework pattern as `app.mjs` and
`chatbot.mjs`.

**Expected Outcomes:**
- Selecting a course instantly renders the policy card with: course code + title,
  instructor, full policy text, allowed-use list, prohibited-use list
- The rubric renders below the policy as a visual checklist — each criterion is a
  read-only `<li>` with a checkbox icon (not interactive, just illustrative) so a student
  can see the self-check questions they should answer before using AI
- The tips panel renders 2–3 tips for the selected course as styled list items
- Resetting the select to the default option clears both panels and shows the placeholder
- No page reload required

**Todo List:**
- [ ] Create `ai-guide.mjs` with a `DOMContentLoaded` listener
- [ ] Import `coursePolicies` from `'./model.mjs'`
- [ ] Populate `<select id="course-select">` with one `<option>` per course plus a
      default "— Select a course —" option
- [ ] Add a `change` event listener on the select that finds the matching policy entry
      and calls `renderPolicy(entry)` and `renderTips(entry)`
- [ ] Implement `renderPolicy(entry)` — builds and injects HTML into `#policy-card`
      showing: badge with course code, h2 with title, instructor line, full policy
      paragraph, two `<ul>` lists for allowed and prohibited uses, then the rubric
      checklist under a "Before you use AI, ask yourself:" heading
- [ ] Implement `renderTips(entry)` — builds and injects the tips into `#tips-panel`
      as styled `<li>` items
- [ ] Handle the empty / placeholder state when no course is selected
- [ ] Add `ai-guide.mjs` to `server.mjs` route map so it is served with MIME type
      `application/javascript`

**Relevant Context:**
- [`chatbot.mjs`](chatbot.mjs:150) — `DOMContentLoaded` pattern to follow
- [`app.mjs`](app.mjs:105) — `element(tag, content, className)` helper; consider
  duplicating this small helper locally rather than creating a shared util
- [`server.mjs`](server.mjs) — static route map; add `'/ai-guide.mjs'` entry

---

### Sub-Task 4 — Chatbot Policy Knowledge Base

**Status:** `[ ] pending`

**Intent:**
Replace the chatbot `KB` array in `chatbot.mjs` with entries that answer common student
questions about AI policy, plus one entry covering responsible AI for small businesses.
Replace the quick-suggestion buttons in `index.html` with AI-policy-relevant suggestions.
Update the greeting to mention AI policy guidance.

The existing keyword engine (`getAnswer`) requires no changes — only the data changes.
No team member names are included.

**Expected Outcomes:**
- Asking "Can I use ChatGPT?" returns a policy-aware answer guiding the student to
  check their course's AI policy in the AI Guide
- Asking "What counts as a violation?" returns a plain-language explanation
- Asking "How do I cite AI?" returns a brief responsible-use coaching tip
- Asking "small business" or "business" returns an answer connecting the student
  responsible-AI framework to small business AI adoption
- Original competition-related KB entries are removed so the bot is clearly scoped
  to the student AI policy use case
- Quick suggestions updated to: "Can I use AI on my homework?",
  "What is an integrity violation?", "How do I cite AI tools?",
  "How do I use the AI Guide?"

**Todo List:**
- [ ] Remove all 14 existing KB entries from `chatbot.mjs`
- [ ] Add new KB entries covering:
  - AI use on assignments (keywords: `can i use`, `chatgpt`, `allowed`, `homework`)
  - Academic integrity / violations (keywords: `violation`, `integrity`, `policy`, `rules`)
  - Citing AI tools (keywords: `cite`, `citation`, `reference`, `credit`)
  - Responsible use tips and the AI-use rubric (keywords: `responsible`, `rubric`,
    `checklist`, `best practice`, `tip`, `advice`)
  - Small business responsible AI (keywords: `small business`, `business`, `entrepreneur`,
    `startup`, `company`)
  - How to use the AI Guide (keywords: `guide`, `course`, `select`, `lookup`, `find`)
  - Fallback / help (keywords: `help`, `stuck`, `confused`)
- [ ] Update `FALLBACK` string in `chatbot.mjs` to reference the AI Guide view
- [ ] Update the greeting in `openChat()` to reference the AI policy guide purpose
- [ ] Update the 4 quick-suggestion `data-q` values and button text in `index.html`

**Relevant Context:**
- [`chatbot.mjs`](chatbot.mjs:7) — `KB` array starts at line 7; `FALLBACK` at line 81;
  greeting text at line 180
- [`index.html`](index.html:262) — quick suggestion buttons at lines 262–265

---

### Sub-Task 5 — Styles for AI Guide Components

**Status:** `[ ] pending`

**Intent:**
Add minimal CSS to `styles.css` for the new visual components introduced in the
AI Guide view: the policy card, the rubric checklist, and the tips list. Reuse existing
design tokens (`--accent`, `--panel`, `--text`, `--muted`, etc.) and follow the existing
card/panel patterns. Do not change any existing rules.

**Expected Outcomes:**
- Policy card has a clear visual hierarchy: badge → title → instructor → policy text →
  two columns (allowed / prohibited) → rubric checklist
- Allowed items use a green-tinted bullet; prohibited items use a red-tinted bullet
- Rubric checklist items have a checkbox-style `::before` icon and muted text
- Tips panel items have a left accent border matching `--accent`
- All new components are responsive at the existing 720px and 360px breakpoints

**Todo List:**
- [ ] Add `.policy-card` styles: inherits `.panel` padding/border, adds internal
      grid for allowed/prohibited columns above 480px, stacks at 480px
- [ ] Add `.policy-badge` styles: small pill in `--accent` color like existing `.pill`
- [ ] Add `.allowed-list` and `.prohibited-list` styles: unstyled lists with colored
      `::before` pseudo-element bullets (✓ green / ✗ red-tinted)
- [ ] Add `.rubric-list` styles: list items with a `☐` prefix icon, muted color,
      slight indent — visually distinct from allowed/prohibited lists
- [ ] Add `.tip-list` styles: list items with `border-left: 2px solid var(--accent)`,
      padding-left, and `--muted` label above each tip
- [ ] Confirm no existing selectors are changed

**Relevant Context:**
- [`styles.css`](styles.css) — existing `.callout`, `.panel`, `.pill`, `.feedback-list`
  patterns are the design reference; append new rules at the end of the file

---

### Sub-Task 6 — Fill Out IMPACT-STATEMENT.md

**Status:** `[ ] pending`

**Intent:**
Replace the placeholder text in `IMPACT-STATEMENT.md` with a completed, one-page impact
statement for the student AI policy guide. This is the written deliverable judges read.
It must be concise, specific, and grounded in the prototype built in sub-tasks 1–5.
The statement should acknowledge that the responsible-AI literacy skills built here also
benefit small business owners as a secondary impact pathway.

**Expected Outcomes:**
- All 5 sections are filled in with real, specific content (no `[To be completed]` left)
- "Who benefits" names the student persona, the problem, and the strategic pillar;
  mentions small business as a secondary beneficiary
- "Prototype" describes the working demo: course selector, AI-use rubric, policy display,
  chatbot coaching, and the small business callout
- "Measurable outcome" names a concrete metric with baseline, target, and measurement plan
- "Statewide rollout" describes a first pilot (one campus, a few courses) and expansion
  criteria
- "Top risk and mitigation" names one real risk and a concrete action
- Document stays to one page when printed

**Todo List:**
- [ ] Write the "Who benefits" section: student new to AI, integrity-violation risk,
      pillar = Student Success / AI Literacy; note that the same framework equips
      students-turned-entrepreneurs to adopt AI responsibly in small businesses
- [ ] Write the "Prototype" section: describe the AI Guide view, the course-policy
      lookup, the AI-use rubric checklist, the chatbot coaching, and the small business
      callout; note what changed after pilot feedback
- [ ] Write the "Measurable outcome" section: metric = badges earned in the pilot
      semester; baseline = 0; target = 150; auto-logged on scenario quiz completion;
      secondary metric = 20% of badge earners register for the sponsored external exam
- [ ] Write the "Statewide rollout" section: pilot at one campus with 3 courses (CIT,
      ENG, BUS); needs badge infrastructure (Credly/Canvas Badges), LMS policy editor,
      and an Ivy Tech partnership with an external AI exam provider (Google/IBM);
      expand when 150 badges issued and ≥ 80% instructor policy-confirmation compliance
- [ ] Write the "Top risk and mitigation" section: risk = instructors do not keep
      policies up to date; mitigation = semester-start policy confirmation email + LMS
      sync

**Relevant Context:**
- [`IMPACT-STATEMENT.md`](IMPACT-STATEMENT.md) — current template to overwrite
- [`model.mjs`](model.mjs:22) — `impactStatement()` shows the same 5-section structure
- The app's Phase 04 impact form fields (`solution`, `measurement`, `rollout`, `risk`)
  map 1-to-1 to the 5 sections

---

## Execution Order

```
Sub-Task 1 → Sub-Task 2 → Sub-Task 3 → Sub-Task 4 → Sub-Task 5 → Sub-Task 6
(data)         (HTML)       (JS logic)   (chatbot)    (styles)      (impact)
```

Each sub-task can be reviewed and committed independently before moving to the next.

---

### Sub-Task 7 — AI Certification Quiz UI (BLOCKED — waiting on teammate redesign)

**Status:** `[ ] pending`

**Intent:**
Build the scenario quiz and certificate download UI on top of the teammate's redesigned
site structure. The quiz data (`quizScenarios`) is already in `model.mjs` and tested.
This sub-task is intentionally deferred until `git pull` brings in the new design so
the quiz UI is built once into the final structure, not rebuilt twice.

**Design decisions locked:**
- 10 questions (5 universal + 5 discipline-based)
- Pass threshold: 8/10 (80%)
- Quiz is a standalone "AI Certification" nav section — separate from AI Guide policy lookup
- Badge panel appears on pass; "Try again" on fail
- "Download Certificate" button generates a date-stamped text certificate
- Sponsored exam callout appears below the badge

**Expected Outcomes:**
- Student can navigate to `#ai-cert` and start the knowledge check
- Each question shows 4 answer options; selecting one reveals feedback and explanation
- After question 10, score is shown with pass/fail result
- On pass (≥ 8/10): badge card + "Download Certificate" button + sponsored exam callout
- On fail: score shown + "Try again" button that resets to question 1
- Certificate download produces a `.txt` file with name, date, and "Ivy Tech AI Responsible Use — Certified"

**Todo List (implement after pull):**
- [ ] Pull teammate's redesigned site (`git pull origin main`)
- [ ] Create `ai-cert.mjs` importing `quizScenarios` from `model.mjs`
- [ ] Add `data-view="ai-cert"` section to the new HTML structure
- [ ] Register `'ai-cert': 'AI Certification'` in `app.mjs` pageNames
- [ ] Implement quiz state machine: `idle → question[n] → feedback → result → badge/retry`
- [ ] Implement certificate download (Blob + anchor click, `.txt` format)
- [ ] Add CSS for quiz card, option buttons, feedback states, badge panel
- [ ] Add `ai-cert.mjs` to `server.mjs` route map
- [ ] Add chatbot KB entry for the certification (keywords: `certif`, `quiz`, `badge`, `exam`)
- [ ] Run all tests and confirm pass

---

## Sample Data Policy

All course names, instructor names, and policy text in `coursePolicies` are entirely
made-up. No real student records, enrollment data, or employment information is used at
any point.
