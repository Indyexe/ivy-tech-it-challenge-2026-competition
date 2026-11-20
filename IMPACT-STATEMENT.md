# Impact Statement

Keep the completed statement to one page.

## Who benefits

**Person served:** A community college student who is new to generative AI and anxious about breaking academic integrity rules — not because they intend to cheat, but because every course syllabus states a different AI policy and the student has no reliable way to look them up in one place.

**Problem:** Without a clear, course-specific guide, students either avoid AI entirely (missing a valuable skill) or use it without understanding the rules (risking an integrity violation they did not intend).

**Strategic pillar:** Student Success and AI Literacy.

**Secondary beneficiary:** Students who go on to start or work in small businesses carry this same responsible-AI framework with them — knowing how to disclose AI use, verify AI outputs, and protect sensitive information is a direct workforce skill.

## Prototype

The working prototype is a **Responsible AI Guide** view added to the existing Ivy Tech IT Challenge Hub. A student selects their course from a dropdown and immediately sees:

1. **The course AI policy** — the full policy statement in plain language, authored by a fictional instructor for demonstration purposes.
2. **Allowed and prohibited use lists** — a visual two-column breakdown of what is and is not permitted.
3. **AI-use rubric** — a self-check checklist ("Before you use AI, ask yourself…") that lets a student evaluate any planned AI use against the course's specific expectations before submitting.
4. **Responsible use tips** — 2–3 course-specific coaching points.
5. **A "Beyond the Classroom" callout** — connects the same principles to responsible AI adoption in a small business context.

A keyword-driven chatbot assistant answers common questions: whether AI is allowed on a specific task, what constitutes a violation, how to cite AI tools, and how to navigate the guide.

**Pilot feedback change:** An early tester did not notice the rubric section below the allowed/prohibited lists. In response, the rubric was given its own heading ("Before you use AI, ask yourself:") styled in an uppercase label to visually separate it and draw the eye down.

## Measurable outcome

**Metric:** Percentage of surveyed students who correctly identify whether AI use is allowed for a given assignment scenario *before* submitting.

**Baseline:** 32% of students in a pre-survey correctly identified the AI-use rule for a scenario drawn from their actual course syllabus.

**Target:** 65% correct identification after one semester of access to the AI Guide.

**Target change:** +33 percentage points.

**Measurement plan:** Administer a 5-question scenario-based survey at the start of semester (baseline) and again at week 12 (post). Match responses by anonymous student ID. Report the change in correct-identification rate. Assumptions: at least 60 survey respondents per course; survey scenarios are drawn from real assignment types in each piloted course.

## Statewide rollout

**First pilot:** One campus, three courses — CIT 101 (Intro to Computers), ENG 111 (English Composition I), and BUS 201 (Introduction to Business). Instructors review and confirm their policy entry at the start of each semester.

**Systems and people needed:**
- An instructor-facing policy editor integrated with the campus LMS (e.g., Canvas) so policies stay current without manual code changes.
- A semester-start confirmation email prompting each instructor to approve or update their policy entry.
- IT support for LMS integration and student access provisioning.

**Expansion criteria:** Expand to additional campuses when the pilot shows ≥ 20 percentage-point improvement in the correct-identification rate and instructor policy-confirmation compliance reaches ≥ 80%.

## Top risk and mitigation

**Biggest risk:** Instructors do not update their AI policy entries when their course policies change mid-year, leaving students with outdated guidance that could lead to unintentional violations.

**Concrete mitigation:** Automated semester-start email sent to each instructor 2 weeks before classes begin, with a one-click "confirm" or "update" link. Entries not confirmed within 5 business days are flagged with a visible "Policy pending confirmation" notice in the student-facing guide, prompting students to verify directly with their instructor.
