# IBM Bob development log

Start a new task in IBM Bob when you receive the event brief. Record what the team asks Bob to do and how the team verifies the results.

## Starting point

The web hub, help chatbot, and synthetic analytics demo were prepared before the event as starter material. Record event-day decisions and changes below as they happen.

## First planning prompt

> Read the event brief below and inspect the starter app. Our mission is [one sentence in the team's own words]. The people we want to help are [who], and the outcome we want to improve is [outcome]. Here are the organizers' requirements and constraints [paste brief]. In Plan mode, identify what we can reuse, what we need to build today, and the smallest workflow we can demo and test. Ask about any missing decision that would affect the plan. Wait for the team to approve the plan before editing files.

## Running record

| Time / phase | Team member | Prompt or task | Bob’s contribution | Team review and verification | Commit |
| --- | --- | --- | --- | --- | --- |
| Part 1 · Discover & Define | Kaleb | Gave Bob the Case 3 brief (Responsible-AI Guide) and our mission, and asked for a plan in Plan mode for a new site in `opportunity-hub/` that reuses the starter's tech (plain HTML/CSS/JS + Node static server). | Wrote `opportunity-hub-plan.md`: architecture, file plan, and 8 sub-tasks (scaffold, AI Check, AI Coach, projects, events, and more). Asked 3 questions before building: where the syllabus policy data comes from, how detailed demo profiles should be, and how to label the traffic light. | Team answered: use clearly labeled sample policies until the provided data is added; fictional "Demo profile" students; color + word + symbol on every rule. Approved building only the scaffold and AI Check first. | a51550c |
| Part 2 · Build | Kaleb | Approved the plan. Named the app **A-Ivy**, supplied the A-Ivy logo, and gave brand colors from the logo. Asked Bob to build the scaffold and AI Check. | Built `server.mjs` (port 3001, GET-only, file allowlist), `index.html`, `styles.css`, `app.mjs` (routing, role switcher, localStorage, CSV export), `logic.mjs` (question matching, disclosure note, instructor email draft), `data.mjs` (5 sample course policies, demo profiles), and 13 unit tests. | Ran `node --test opportunity-hub/logic.test.mjs`: 13/13 pass. Opened the app locally: no console errors; picked a course and asked questions. | a51550c |
| Part 2 · Build | Kaleb | The dark-green logo was nearly invisible on the dark header. Asked Bob to fix the contrast without changing anything else. | Put the logo on a white rounded badge, linked it to home, and kept it phone-sized under 620px. | Checked the header in the browser. | a51550c |

> Bob's work was committed together with later changes in `a51550c` (pushed in one commit).

## Other AI assistance

For transparency: besides IBM Bob, Kaleb used **Claude (Anthropic)** as a reviewer, and later to make changes directly. The work below was done with Claude, **not Bob**. The team directed and reviewed every change.

| Phase | Team member | What was asked | What Claude did | Team review and verification | Commit |
| --- | --- | --- | --- | --- | --- |
| Part 2–3 | Kaleb | Review Bob's AI Check code. | Found 3 issues: (1) the first keyword match won, so "plan my essay structure" in ENGL 111 answered **Allowed** when outlining is **Not allowed**; (2) keywords matched inside other words ("plan" in "explanation"); (3) sample instructor emails used the real `ivytech.edu` domain. | Team confirmed each issue by testing the questions in the app. | a51550c |
| Part 3 | Kaleb | Fix the issues, replace the course dropdown with a search bar, and polish the site. | Whole-word matching that shows the **strictest** rule and every matching rule; `example.edu` emails; "what you CAN use AI for instead"; course search with expandable cards; example question chips; dark navy + emerald theme with the white logo; restored starfield and card glow (still on touch devices and with reduced motion); mobile menu. | Tests pass. Checked at 360, 390, 768 px and desktop: no sideways scrolling or clipped text; full AI Check flow on desktop and phone. | a51550c |
| Part 3 | Kaleb | Remove Wayfinding, Future, and Pilot; switch "View as" to Student / Instructor; make AI Coach work; add Events and an AI Literacy micro-certification with our badge metric. | Rule-based AI Coach grounded in each course policy (no external AI service); 6-scenario AI Responsible Use quiz (pass 5/6) that logs badges automatically and asks about the external exam; instructor dashboard (badges vs. 150 target, exam conversion vs. 20%, baseline 0, weekly table with **sample pilot data clearly labeled**); the team's 8 events with a program filter; instructor Course Policies view. | 31/31 A-Ivy tests and 34/34 repo tests pass. Completed the quiz, coach, events, and both views in the browser at 360, 768 px and desktop. | a51550c |

## Pilot revision

| Task tested | What the pilot user encountered | Change made | Retest result | Commit |
| --- | --- | --- | --- | --- |
| | | | | |
