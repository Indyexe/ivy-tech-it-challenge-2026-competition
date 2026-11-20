# Ivy Tech IT Challenge 2026 — Responsible AI Guide

**Track:** Data Analytics, Applied AI & Informatics

---

## The Problem

Every Ivy Tech course has a different AI policy, but students have no single place to look them up. A first-year student trying to do the right thing must hunt through multiple syllabi, interpret vague language, and guess whether a specific AI use is allowed — or risk an unintentional academic integrity violation. This friction pushes students toward two equally bad outcomes: avoiding AI entirely and missing a critical workforce skill, or using it carelessly and facing consequences they did not intend.

The same gap exists beyond campus. Students who go on to start or work in small businesses carry these habits with them. Without a foundation in responsible AI use — how to disclose, verify, and apply AI ethically — they risk reputational and legal exposure in professional contexts too.

---

## The Solution

The **Responsible AI Guide** is a student-facing web tool built into the Ivy Tech IT Challenge Hub. It gives students one place to:

- **Look up their course's AI policy** — select a course and instantly see what is allowed, what is prohibited, and the full policy statement in plain language.
- **Self-check with an AI-use rubric** — a per-course checklist ("Before you use AI, ask yourself…") that helps students evaluate any planned AI use before submitting an assignment.
- **Get responsible-use coaching** — course-specific tips that reinforce good habits.
- **Ask the AI Guide chatbot** — a keyword-driven assistant that answers common questions: whether AI is allowed on a specific task, what counts as a violation, how to cite AI tools, and more.
- **Earn a micro-certification** — students complete a 10-question scenario-based knowledge check and earn a shareable "Ivy Tech AI Responsible Use" digital badge. Badge earners are shown a path to an Ivy Tech–sponsored external AI literacy exam (e.g., Google AI Essentials or IBM AI Fundamentals), framing the institution as an investor in students' AI futures.

A **"Beyond the Classroom" callout** connects the same framework to small business contexts — the responsible-AI principles that protect a student in class are the same ones that protect a business owner's customers and reputation.

---

## Technical Approach

The prototype is a **vanilla JavaScript single-page application** — no frameworks, no build step, no external dependencies. It runs on a lightweight Node.js static file server.

| File | Role |
|---|---|
| `index.html` | SPA shell with hash-based routing across 9 views |
| `app.mjs` | Main controller — routing, localStorage, phase tracking, impact statement export |
| `ai-guide.mjs` | AI Guide controller — populates course selector, renders policy cards, rubric checklists, and tips panels |
| `model.mjs` | Data layer — `coursePolicies` (5 sample courses with policies, allowed/prohibited lists, rubrics, and tips) and `quizScenarios` (10 scenario-based certification questions across 5 disciplines) |
| `chatbot.mjs` | Keyword-driven chatbot — 7 KB entries covering AI use, integrity violations, citing AI, the rubric, small business responsible AI, guide navigation, and help |
| `styles.css` | Dark-theme design system — CSS custom properties, responsive grid, glassmorphism panels |
| `server.mjs` | Static HTTP server for local development |
| `model.test.mjs` | Node.js unit tests — 4 tests covering data integrity for `sampleWeeks`, `impactStatement`, `coursePolicies`, and `quizScenarios` |

**Key data structures in `model.mjs`:**

```js
// Each course policy entry
{ id, code, title, instructor, policy, allowed[], prohibited[], tips[], rubric[] }

// Each quiz scenario
{ id, category, question, options[4], correct, explanation }
```

**Quiz design:** 10 questions — 5 universal responsible-AI scenarios (apply to any course or workplace context) + 5 discipline-specific scenarios (writing, tech/coding, healthcare/privacy, business/analytics × 2). Pass threshold: 8/10 (80%). Scoring is tracked in JS state; no server or database required for the prototype.

All sample data is entirely fictional. No real student records, instructor names, or enrollment data are used at any point.

---

## Strategic Pillar and Statewide Strategy

**Pillar served:** Student Success and AI Literacy.

**Why this pillar:** AI literacy is not optional — it is a foundational skill for academic success today and workforce readiness tomorrow. Ivy Tech is positioned to lead by ensuring every student understands how to use AI responsibly before they graduate, and by offering a clear credential that travels with them into employment or entrepreneurship.

**Pilot scope:** One campus, three courses — CIT 101 (Intro to Computers), ENG 111 (English Composition I), and BUS 201 (Introduction to Business). Instructors confirm their policy entry at the start of each semester via an automated email workflow.

**Statewide expansion path:**
1. Integrate the guide with Canvas (LMS) so policy entries are linked directly to course shells and stay current automatically.
2. Stand up badge issuance infrastructure (Credly or Canvas Badges) tied to quiz completion events.
3. Establish an Ivy Tech partnership with an external AI literacy exam provider (Google, IBM, or similar) to subsidize exam vouchers for badge earners — making the credential pipeline fully funded for students.
4. Expand to additional campuses when the pilot reaches 150 badges issued and instructor policy-confirmation compliance reaches ≥ 80%.

**Measurable outcome:** Number of students who earn the Ivy Tech AI Responsible Use micro-certification badge. Baseline: 0. Target: 150 badges in the first pilot semester. Secondary metric: 20% of badge earners register for the sponsored external exam, establishing a pipeline from free micro-cert to credentialed workforce skill.

---

## How IBM Bob Was Used

IBM Bob was the AI assistant used throughout challenge day to plan, build, and refine this prototype. The team's full Bob interaction log is in [`BOB-LOG.md`](BOB-LOG.md).

**Planning and scoping:** Bob was used to pressure-test the problem statement — specifically to stress-test whether a survey-based measurable outcome was strong enough, and to explore alternatives. Bob surfaced the micro-certification and sponsored exam framing as a more credible, auto-trackable metric with a stronger workforce narrative. That conversation directly shaped the final impact statement.

**Data design:** Bob helped design the shape of the `coursePolicies` and `quizScenarios` data structures in `model.mjs` — particularly the `rubric[]` field (a per-course self-check list) and the decision to split quiz questions into universal and discipline-specific categories so the certification feels contextually relevant without requiring one question set per course.

**Content generation:** Bob drafted the 5 fictional course policy entries, the 10 scenario-based quiz questions, the chatbot knowledge base entries, and the "Beyond the Classroom" small business callout — all reviewed and edited by the team before committing.

**Impact statement:** Bob co-authored the measurable outcome framing ("badges issued" replacing a survey percentage), the statewide rollout section, and the top risk/mitigation, which were then reviewed and refined by the team.

**Team verification:** Every Bob output was reviewed by at least one team member before being committed. The team made final decisions on scope, design tradeoffs (e.g. voluntary vs mandatory certification), and content accuracy.

---

## Running the Prototype Locally

```bash
node server.mjs
# Open http://127.0.0.1:3000
```

**Run tests:**

```bash
node --test model.test.mjs
```
