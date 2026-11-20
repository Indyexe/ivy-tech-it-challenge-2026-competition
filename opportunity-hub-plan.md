# A-Ivy — Build Plan

> Tagline: "Use AI with confidence and integrity."

## Top-Level Overview

Create a new self-contained app in `opportunity-hub/` — **A-Ivy** — a plain HTML/CSS/vanilla-JS ES-module app served on port 3001. It is entirely separate from the root project; no existing files are touched.

**Case:** Case 3, Responsible-AI Guide  
**Persona:** Student new to AI, worried about breaking academic integrity rules  
**Problem:** Every syllabus has a different AI policy → students either avoid AI entirely or risk a violation  
**Pillar:** Academic & Instructional Quality — Ensure Consistent Quality Across Learning Modalities  
**Pilot scope:** One campus (all data is made-up sample data; no real people)

The app has two demo roles (Student / Employer) toggled by a role switcher — no real login. All user data lives in `localStorage`; an Export CSV button lets users take their data out.

**Files to create:**
```
opportunity-hub/
  server.mjs        — Node 22 static server, port 3001, GET-only, explicit file allowlist
  index.html        — single-page app, hash routing, all pages as <section data-view="...">
  styles.css        — A-Ivy brand color system (light theme, green brand)
  app.mjs           — routing, role switcher, localStorage, Export CSV, announce()
  logic.mjs         — pure functions only, no DOM
  logic.test.mjs    — node:test unit tests for logic.mjs
  data.mjs          — sample data: courses+AI policies, employer projects, events, wayfinding,
                      future investments, demo student/employer profiles
```

**Build order (plan all 8, build only Step 1 on first approval):**
1. AI Check — traffic light + question answering from policy text
2. AI Coach — contextual AI-use help within course rules
3. Employer: Post a Project — plain-language need → structured posting + AI-use rule
4. Student: Local Projects — skill-matched list + interest tracking; Employer sees interested students
5. Career Events — program-matched events with room + wayfinding link
6. Wayfinding — building/floor/room, accessible route only where verified
7. Future Investments — proposed/approved/underway improvements
8. Pilot Tasks + Pilot Results — timed task runner + metrics dashboard

---

## Sub-Task 1 — Scaffold: server, shell HTML, CSS, and core app.mjs

**Status:** [ ] pending

### Intent
Stand up the bare-minimum working shell: static server on port 3001, the HTML skeleton with nav and a placeholder for every future page, the CSS design system, the role switcher, the hash router, and localStorage wiring. No page content yet — just a confirmed running app.

### Expected Outcomes
- `node opportunity-hub/server.mjs` starts cleanly on port 3001
- Opening `http://127.0.0.1:3001` loads the app without 404 or console errors
- Role switcher toggles between Student and Employer views, persisted to localStorage
- Hash routing shows the right `<section data-view="...">` and hides the rest
- Nav links are keyboard-accessible and have `aria-current="page"` on the active item
- Status bar `announce()` works (accessible live region)
- Export CSV button appears and downloads a stub CSV

### Todo List
- [ ] Create `opportunity-hub/server.mjs` — explicit `files` Map covering all 7 files + `a-ivy-logo.webp`, port 3001, GET/HEAD only, `no-store` cache, 404 for anything else
- [ ] Create `opportunity-hub/styles.css` — A-Ivy brand variables (`--brand-dark`, `--brand`, `--brand-deep`, `--on-brand`, `--bg`, `--surface`, `--border`, `--text`, `--muted`), traffic-light variables (`--allowed`, `--disclosure`, `--not-allowed`), light theme, sticky header, nav, `.view-heading`, form elements, `.pill` badge, `.traffic-light` grid, `.card`, `.chip`, responsive breakpoints (720px, 360px), `prefers-reduced-motion` block
- [ ] Create `opportunity-hub/index.html` — `<meta viewport>`, link `styles.css`, load `app.mjs` as `type="module"`, header with `a-ivy-logo.webp` (height 40px) + nav (AI Check, AI Coach, Projects, Events, Wayfinding, Future), role switcher (Student / Employer) in header, `<main>` with 8 `<section data-view="...">` stubs (ai-check, ai-coach, employer-post, projects, events, wayfinding, future, pilot), `<p id="status">` live region, Export CSV button in footer
- [ ] Create `opportunity-hub/app.mjs` — `storageKey = 'a-ivy-v1'`, `loadDraft()` / `saveDraft()` / `renderDraft()` pattern, `showRoute()` hash router, `announce()` status bar helper, role switcher logic (hide/show employer vs student nav items), Export CSV that serialises localStorage data to a downloadable `.csv`
- [ ] Create `opportunity-hub/data.mjs` — empty exports stub (populated in later steps)
- [ ] Create `opportunity-hub/logic.mjs` — empty exports stub
- [ ] Create `opportunity-hub/logic.test.mjs` — one smoke test so `node --test logic.test.mjs` passes

### Relevant Context
- Root `server.mjs`: explicit `files` Map pattern — every new file must be listed or returns 404
- Root `app.mjs`: `loadDraft` / `saveDraft` / `renderDraft` / `showRoute` / `announce` patterns — mirror exactly
- Root `index.html`: `data-view` section pattern, `aria-current="page"` nav pattern
- Port: 3001 (not 3000, to avoid conflict with the root app)
- Logo: `opportunity-hub/a-ivy-logo.webp` already exists; must be in server `files` Map

---

## Sub-Task 2 — Page 1: AI Check

**Status:** [ ] pending

### Intent
The core user story: a student picks a course, sees a traffic-light breakdown of AI use types, asks a free-text question, and gets an answer quoting the exact policy line. When the policy is silent, the app says "Not covered — ask your instructor" and offers an email draft. One responsible-use tip is shown per answer. A copyable AI disclosure note is provided.

### Expected Outcomes
- Course picker `<select>` populates from `data.mjs` courses
- Traffic-light grid shows per-use-type status (Allowed / Allowed with disclosure / Not allowed) with text label (not color alone)
- Question box matches user input to a use type by keywords; answer quotes the exact policy text
- If no match: "Not covered — ask your instructor" message appears
- "Ask my instructor" button opens a pre-filled `mailto:` link
- Responsible-use tip rotates or is selected per use type
- "Copy disclosure note" button copies pre-filled text to clipboard and announces success
- "Last updated" date shown on every course card
- No real student data; demo profiles only

### Todo List
- [ ] Populate `data.mjs` with 4-5 sample courses (each with: id, name, instructor email, lastUpdated, policyText, usages array of `{ useType, rule: 'allowed'|'disclosure'|'not-allowed', quote, keywords[], tip }`)
  - Use types to cover: brainstorming, grammar check, outlining, drafting, coding help, summarizing
  - Exact policy quote stored verbatim per use type
- [ ] Add `matchQuestion(question, usages)` to `logic.mjs` — lowercases input, matches first usage whose `keywords` array has any substring match; returns usage or `null`
- [ ] Add `disclosureNote(courseName, useType)` to `logic.mjs` — returns pre-filled disclosure string
- [ ] Add `emailDraft(course, question)` to `logic.mjs` — returns `mailto:` href string
- [ ] Write tests in `logic.test.mjs` for `matchQuestion`, `disclosureNote`, `emailDraft`
- [ ] Build AI Check section HTML in `index.html` — course `<select>` with `<label>`, traffic-light grid (`<ul role="list">` with colored + labeled `<li>` per use type), question `<textarea>` with `<label>`, answer card (hidden until query), "Copy disclosure" button, "Ask my instructor" link, tip text, last-updated line
- [ ] Wire AI Check in `app.mjs` — course select change → render traffic light from `data.mjs`; question form submit → call `matchQuestion` → render answer card or "not covered" message; copy button → `navigator.clipboard.writeText` + `announce`; instructor link → set `href` from `emailDraft`

### Relevant Context
- Root `chatbot.mjs` `getAnswer()`: keyword-loop pattern to reuse in `matchQuestion`
- Root `app.mjs` `announce()`: copy button feedback
- CSS traffic-light variables: `--allowed: #15803D`, `--disclosure: #B45309`, `--not-allowed: #B91C1C`, all with white text
- Badges show symbol + word: ✓ Allowed / ! Allowed with disclosure / ✕ Not allowed
- Rule: answers come ONLY from stored data — no AI inference, no hallucination
- Rule: always show "last updated" on every listing
- Sample courses are labeled "Sample policy" in the UI so the provided dataset can be swapped in later

---

## Sub-Task 3 — Page 2: AI Coach

**Status:** [ ] pending

### Intent
Given a course (already selected or re-selected) and a free-text description of an assignment or project, show concretely HOW the student can use AI within that course's rules — with 3-5 example prompts and a clear "do NOT do this" warning list. Output stays within the course's declared rules; if AI is fully prohibited, the coach says so and stops.

### Expected Outcomes
- Assignment description textarea + course selector
- If course has "not allowed" for all uses: shows a plain-language "AI is not allowed for this course" message with the instructor email
- Otherwise: 3-5 example prompts the student could type, labeled by use type (brainstorm, grammar, etc.)
- "What NOT to do" list (e.g. do not submit AI-generated text as your own)
- Copyable disclosure note for the assignment
- "Ask my instructor" link

### Todo List
- [ ] Add `coachSuggestions(course, assignmentText)` to `logic.mjs` — returns `{ allowed: UseType[], suggestions: string[], warnings: string[] }` derived purely from the course's usages array and simple keyword matching on the assignment text
- [ ] Add tests for `coachSuggestions` in `logic.test.mjs`
- [ ] Build AI Coach section HTML in `index.html`
- [ ] Wire AI Coach in `app.mjs`

### Relevant Context
- Reuses course data from Sub-Task 2's `data.mjs` — no new data needed
- Must not suggest anything beyond what the course's usages array marks as `allowed` or `disclosure`

---

## Sub-Task 4 — Page 3: Employer Post a Project

**Status:** [ ] pending

### Intent
An employer fills in a plain-language description of a tech need. The app formats it into a student-ready project listing (title, skills, scope, estimated hours) using template logic. It flags any mention of personal/sensitive data with a warning. The employer sets the AI-use rule for the project. Saved to localStorage; shows "last updated."

### Expected Outcomes
- Form: need description (textarea), contact name, contact email, estimated hours (number input)
- AI-use rule radio: Allowed / Allowed with disclosure / Not allowed
- "Format project" button runs `formatProject()` and shows a preview card
- Preview includes: derived title, skill tags, scope sentence, hours, AI rule badge, last-updated timestamp
- Personal-data flag: if description contains flagged words (SSN, address, medical, etc.) a warning banner appears
- "Save project" commits to localStorage and announces success
- Employer view in projects page (Sub-Task 5) reads from this same localStorage key

### Todo List
- [ ] Add `formatProject(description, hours, aiRule)` to `logic.mjs` — extracts keywords for skills, generates a title and scope sentence, flags personal-data words
- [ ] Add `personalDataFlag(text)` to `logic.mjs` — returns array of flagged terms found
- [ ] Add tests for both in `logic.test.mjs`
- [ ] Add sample employer data to `data.mjs` (3 pre-seeded projects for the student view)
- [ ] Build Employer Post section HTML in `index.html`
- [ ] Wire in `app.mjs` — only visible when role = Employer

### Relevant Context
- Role switcher from Sub-Task 1 controls visibility
- localStorage key `ivy-opportunity-hub-v1` stores `{ ..., employerProjects: [] }`

---

## Sub-Task 5 — Page 4: Local Projects (Student view + Employer interest tracking)

**Status:** [ ] pending

### Intent
Students see projects matched to their demo profile's skills. Each card shows the project title, skills needed, scope, hours, AI-use rule, and last-updated. An "I'm interested" button records the click. The Employer view shows which demo students expressed interest, with a "Conversation started" checkbox.

### Expected Outcomes
- Student view: list of projects filtered/sorted by skill match to demo profile
- Each card: title, skills, scope, hours, AI-rule badge, last-updated, "I'm interested" button
- "I'm interested" saves the student's demo ID + project ID to localStorage; button changes to "Interest noted ✓"
- Employer view: same project cards but with an "Interested students" section listing demo student names, each with a "Conversation started" checkbox
- "Conversation started" saves to localStorage

### Todo List
- [ ] Add `matchProjects(studentSkills, projects)` to `logic.mjs`
- [ ] Add tests in `logic.test.mjs`
- [ ] Add demo student profiles to `data.mjs` (3 profiles: name, program, skills array)
- [ ] Build Projects section HTML in `index.html` (shared section, role-conditional sub-sections)
- [ ] Wire in `app.mjs`
- [ ] Export CSV includes interest log rows

### Relevant Context
- Projects come from `data.mjs` sample data + any saved employer posts from Sub-Task 4
- Per the team brief: interest log → CSV export

---

## Sub-Task 6 — Page 5: Career Events

**Status:** [ ] pending

### Intent
Students see career events matched to their demo program. Each event card shows title, date, description, room, and a "View in Wayfinding" link. All cards show "last updated."

### Expected Outcomes
- Event list filtered by demo student's program
- Each card: title, date, type badge, description, room identifier, "last updated", Wayfinding link
- Wayfinding link sets the hash to `#wayfinding` and pre-fills the room query

### Todo List
- [ ] Add 5-8 sample events to `data.mjs` (title, date, program tags, room id, lastUpdated, description)
- [ ] Add `matchEvents(program, events)` to `logic.mjs` + tests
- [ ] Build Events section HTML in `index.html`
- [ ] Wire in `app.mjs` — Wayfinding link pre-fills room state

### Relevant Context
- Room IDs must match wayfinding data added in Sub-Task 7

---

## Sub-Task 7 — Pages 6 and 7: Wayfinding + Future Investments

**Status:** [ ] pending

### Intent
**Wayfinding:** Student enters a room ID (or follows a link from an event). The app shows building, entrance, floor, and room details. The accessible route is shown ONLY when the data marks it as verified. **Future Investments:** A three-stage board (Proposed / Approved / Underway) listing campus improvements and what each means for students.

### Expected Outcomes
- Wayfinding: room-ID input (or pre-filled), result card showing building/entrance/floor/room, accessible-route note only if `accessibleRouteVerified: true`
- Future Investments: three columns (Proposed / Approved / Underway) each with cards; each card has a "what this means for you" student-friendly blurb and last-updated

### Todo List
- [ ] Add wayfinding data to `data.mjs` (8-10 rooms: id, building, entrance, floor, room, accessibleRouteVerified, accessibleRouteDescription)
- [ ] Add future investments data to `data.mjs` (6-8 items: title, stage, studentBlurb, lastUpdated)
- [ ] Add `findRoom(roomId, rooms)` to `logic.mjs` + tests
- [ ] Build Wayfinding and Future sections HTML in `index.html`
- [ ] Wire both in `app.mjs`

---

## Sub-Task 8 — Page 8: Pilot Tasks + Pilot Results

**Status:** [ ] pending

### Intent
An instrumented task runner times three defined tasks (find an event, locate its room, pick a project). It records completion (yes/no) and elapsed seconds to localStorage. The Pilot Results page shows completion rate, average time per task, and interest-to-conversation rate, with an input for the existing-resources baseline for comparison.

### Expected Outcomes
- Pilot Tasks: a "Start task" button per task starts a timer; "Done" or "Skip" stops it and logs `{ taskId, completed, seconds }` to localStorage
- Pilot Results: summary table with completion rate (%), average time on task (seconds), interest-to-conversation rate; a baseline input per metric; Export CSV downloads the pilot log
- Pilot data is anonymous — no names stored

### Todo List
- [ ] Add `pilotSummary(log)` to `logic.mjs` — computes completion rates and average times + tests
- [ ] Build Pilot Tasks and Pilot Results sections HTML in `index.html`
- [ ] Wire in `app.mjs` — timer logic, localStorage log, baseline inputs
- [ ] Export CSV includes pilot log rows

### Relevant Context
- Per the team brief: pilot log spec (taskId, completed, seconds; interest-to-conversation rate)
- Must be anonymous; no student name stored

---

## Data Design (data.mjs)

All entries are made-up sample data. Fields shared across all listings:

| Field | Type | Notes |
|---|---|---|
| `lastUpdated` | ISO date string | Shown on every card |

### Courses (for AI Check + AI Coach)
```
{ id, name, instructorEmail, lastUpdated, policyText,
  usages: [{ useType, rule, quote, keywords[], tip }] }
```
`rule` values: `'allowed'` | `'disclosure'` | `'not-allowed'`  
Use types: brainstorming, grammar-check, outlining, drafting, coding-help, summarizing

### Employer Projects
```
{ id, employerName, title, description, skills[], scope, hours, aiRule, lastUpdated }
```

### Demo Student Profiles
```
{ id, name, program, skills[], enrolledCourseIds[] }
```

### Events
```
{ id, title, date, type, program, description, roomId, lastUpdated }
```

### Wayfinding
```
{ id, building, entrance, floor, room, accessibleRouteVerified, accessibleRouteDescription }
```

### Future Investments
```
{ id, title, stage: 'proposed'|'approved'|'underway', studentBlurb, lastUpdated }
```

---

## Architecture Diagram

```
index.html
  └── app.mjs (routing, role, storage, UI wiring)
        ├── data.mjs   (sample data — pure exports, no DOM)
        └── logic.mjs  (pure functions — matchQuestion, formatProject, etc.)

logic.test.mjs
  └── imports logic.mjs only (no DOM, runs with node --test)

server.mjs
  └── serves all 7 files from explicit allowlist, port 3001
```

---

## Key Constraints (from the team brief)

- **No real data.** All courses, employers, students, and events are invented.
- **No frameworks, no npm, no build step.** Plain HTML + CSS + ES modules.
- **Answers from stored data only.** Quote the exact policy line; never infer.
- **Always give a path to a human.** Every answer includes an "Ask my instructor" option.
- **Last updated on every listing.**
- **Accessible.** Every form input has a `<label>`. Colors have text labels. Keyboard navigable. Phone-friendly.
- **Server file allowlist.** Every new `.mjs`, `.css`, `.html` file must be in `server.mjs`'s `files` Map.
- **localStorage only.** Server is GET-only; nothing writes to disk on the server.
