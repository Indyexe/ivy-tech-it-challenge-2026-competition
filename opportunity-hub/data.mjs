/**
 * data.mjs — A-Ivy sample data
 *
 * ALL entries are made-up sample data for demonstration purposes only.
 * No real students, instructors, employers, or personal information.
 * Label shown in UI: "Sample policy" — replace with provided dataset when available.
 */

// ─── Courses with AI use policies ────────────────────────────────────────────
// rule values: 'allowed' | 'disclosure' | 'not-allowed'

export const courses = [
  {
    id: 'engl-111',
    name: 'ENGL 111 — English Composition',
    instructorEmail: 'engl111.instructor@example.edu',
    lastUpdated: '2026-10-15',
    policyLabel: 'Sample policy',
    policyText:
      'AI tools may be used to brainstorm and to check grammar, but all writing must be your own. ' +
      'You must disclose any AI assistance in a note at the end of your submission. ' +
      'Using AI to draft, outline, or write any portion of a graded essay is not permitted.',
    usages: [
      {
        useType: 'brainstorming',
        rule: 'allowed',
        quote: 'AI tools may be used to brainstorm.',
        keywords: ['brainstorm', 'idea', 'ideas', 'topic', 'topics', 'start', 'begin', 'plan my essay'],
        tip: 'Ask AI to list possible angles on your topic, then choose and develop the one that fits your argument.',
      },
      {
        useType: 'grammar-check',
        rule: 'disclosure',
        quote: 'AI tools may be used to check grammar; you must disclose any AI assistance in a note at the end of your submission.',
        keywords: ['grammar', 'spell', 'proofread', 'edit', 'editing', 'punctuation', 'sentence'],
        tip: 'After using an AI grammar tool, re-read every suggestion — accept only changes you understand and agree with.',
      },
      {
        useType: 'outlining',
        rule: 'not-allowed',
        quote: 'Using AI to outline any portion of a graded essay is not permitted.',
        keywords: ['outline', 'structure', 'organize', 'organise', 'structure my essay'],
        tip: null,
      },
      {
        useType: 'drafting',
        rule: 'not-allowed',
        quote: 'Using AI to draft or write any portion of a graded essay is not permitted.',
        keywords: ['draft', 'first draft', 'write', 'write my', 'rewrite', 'paragraph'],
        tip: null,
      },
      {
        useType: 'summarizing',
        rule: 'not-allowed',
        quote: 'Using AI to draft, outline, or write any portion of a graded essay is not permitted.',
        keywords: ['summarize', 'summarise', 'summary', 'readings', 'article', 'reading'],
        tip: null,
      },
    ],
  },
  {
    id: 'csci-101',
    name: 'CSCI 101 — Introduction to Computer Science',
    instructorEmail: 'csci101.instructor@example.edu',
    lastUpdated: '2026-09-30',
    policyLabel: 'Sample policy',
    policyText:
      'You may use AI coding assistants to help debug errors and to look up syntax. ' +
      'You may also use AI to brainstorm algorithm approaches. ' +
      'You must disclose the tool and describe how you used it in a comment at the top of your code. ' +
      'Submitting AI-generated code as your own without disclosure or without understanding it is an integrity violation.',
    usages: [
      {
        useType: 'brainstorming',
        rule: 'allowed',
        quote: 'You may use AI to brainstorm algorithm approaches.',
        keywords: ['brainstorm', 'approach', 'algorithm', 'idea', 'ideas', 'design', 'plan'],
        tip: 'Describe the problem in plain English to an AI tool and ask it to list 3 different approaches. Pick the one you understand best.',
      },
      {
        useType: 'coding-help',
        rule: 'disclosure',
        quote: 'You may use AI coding assistants to help debug errors and to look up syntax; you must disclose the tool and describe how you used it in a comment at the top of your code.',
        keywords: ['code', 'coding', 'debug', 'error', 'syntax', 'function', 'program', 'script', 'help with', 'fix'],
        tip: 'Add a comment like: "// AI used: GitHub Copilot for debugging the loop on line 14." Only submit code you can explain line by line.',
      },
      {
        useType: 'grammar-check',
        rule: 'allowed',
        quote: 'You may use AI coding assistants to help debug errors and to look up syntax.',
        keywords: ['grammar', 'comment', 'readme', 'documentation', 'write-up'],
        tip: 'AI grammar tools are fine for README files and code comments.',
      },
      {
        useType: 'drafting',
        rule: 'not-allowed',
        quote: 'Submitting AI-generated code as your own without disclosure or without understanding it is an integrity violation.',
        keywords: ['draft', 'write my', 'generate', 'complete my', 'finish my', 'do my homework'],
        tip: null,
      },
    ],
  },
  {
    id: 'math-136',
    name: 'MATH 136 — College Algebra',
    instructorEmail: 'math136.instructor@example.edu',
    lastUpdated: '2026-10-01',
    policyLabel: 'Sample policy',
    policyText:
      'AI tools are not permitted on any graded work, including homework, quizzes, and exams. ' +
      'You may use AI to help you understand a concept after you have attempted the problem yourself, ' +
      'but submitting AI-generated answers is a violation of academic integrity.',
    usages: [
      {
        useType: 'brainstorming',
        rule: 'disclosure',
        quote: 'You may use AI to help you understand a concept after you have attempted the problem yourself.',
        keywords: ['understand', 'concept', 'explain', 'help me understand', 'how does', 'what is'],
        tip: 'Try the problem first. Then ask AI to explain the concept — not to solve your specific problem. Write the solution in your own words.',
      },
      {
        useType: 'drafting',
        rule: 'not-allowed',
        quote: 'Submitting AI-generated answers is a violation of academic integrity.',
        keywords: ['solve', 'answer', 'homework', 'problem', 'calculate', 'quiz', 'exam', 'test'],
        tip: null,
      },
      {
        useType: 'grammar-check',
        rule: 'not-allowed',
        quote: 'AI tools are not permitted on any graded work.',
        keywords: ['grammar', 'write', 'write-up', 'proofread', 'spell'],
        tip: null,
      },
    ],
  },
  {
    id: 'busn-101',
    name: 'BUSN 101 — Introduction to Business',
    instructorEmail: 'busn101.instructor@example.edu',
    lastUpdated: '2026-10-20',
    policyLabel: 'Sample policy',
    policyText:
      'AI tools are permitted and encouraged for brainstorming, outlining, and grammar review. ' +
      'If you use AI to draft any part of a written assignment, you must include a disclosure statement ' +
      'that names the tool, describes how it was used, and explains what you changed. ' +
      'You are responsible for the accuracy of everything you submit.',
    usages: [
      {
        useType: 'brainstorming',
        rule: 'allowed',
        quote: 'AI tools are permitted and encouraged for brainstorming.',
        keywords: ['brainstorm', 'idea', 'ideas', 'topic', 'business idea', 'plan'],
        tip: 'Ask AI for 5 possible business problems in your chosen industry, then pick the one you find most interesting.',
      },
      {
        useType: 'outlining',
        rule: 'allowed',
        quote: 'AI tools are permitted and encouraged for outlining.',
        keywords: ['outline', 'structure', 'organize', 'organise', 'sections', 'structure my paper'],
        tip: 'Review the outline AI suggests and adjust it to reflect your own argument before you start writing.',
      },
      {
        useType: 'grammar-check',
        rule: 'allowed',
        quote: 'AI tools are permitted and encouraged for grammar review.',
        keywords: ['grammar', 'spell', 'proofread', 'edit', 'punctuation'],
        tip: 'Read every AI grammar suggestion aloud before accepting it — your voice should still come through.',
      },
      {
        useType: 'drafting',
        rule: 'disclosure',
        quote: 'If you use AI to draft any part of a written assignment, you must include a disclosure statement that names the tool, describes how it was used, and explains what you changed.',
        keywords: ['draft', 'first draft', 'write', 'write my', 'rewrite', 'paragraph'],
        tip: 'Save a copy of the AI output before you edit it — your disclosure should honestly describe what you kept, removed, or rewrote.',
      },
      {
        useType: 'summarizing',
        rule: 'disclosure',
        quote: 'If you use AI to draft any part of a written assignment, you must include a disclosure statement that names the tool, describes how it was used, and explains what you changed.',
        keywords: ['summarize', 'summarise', 'summary', 'readings', 'article', 'reading', 'notes'],
        tip: 'Cross-check every AI summary against the original source — AI can get facts wrong.',
      },
    ],
  },
  {
    id: 'nurs-101',
    name: 'NURS 101 — Introduction to Nursing Practice',
    instructorEmail: 'nurs101.instructor@example.edu',
    lastUpdated: '2026-10-10',
    policyLabel: 'Sample policy',
    policyText:
      'The use of AI tools is not permitted on any clinical documentation, care plans, or patient-scenario assignments. ' +
      'AI may be used only for personal study — for example, to quiz yourself on terminology or to get a plain-English ' +
      'explanation of a concept from your textbook. Any AI-assisted work submitted for a grade is a violation.',
    usages: [
      {
        useType: 'brainstorming',
        rule: 'disclosure',
        quote: 'AI may be used only for personal study — for example, to quiz yourself on terminology or to get a plain-English explanation of a concept from your textbook.',
        keywords: ['study', 'quiz', 'terminology', 'term', 'concept', 'explain', 'understand', 'review'],
        tip: 'Use AI as a study partner, not a shortcut. Ask it to quiz you on vocabulary, then verify its answers with your textbook.',
      },
      {
        useType: 'drafting',
        rule: 'not-allowed',
        quote: 'The use of AI tools is not permitted on any clinical documentation, care plans, or patient-scenario assignments.',
        keywords: ['care plan', 'documentation', 'patient', 'clinical', 'scenario', 'submit'],
        tip: null,
      },
      {
        useType: 'summarizing',
        rule: 'not-allowed',
        quote: 'Any AI-assisted work submitted for a grade is a violation.',
        keywords: ['summarize', 'summarise', 'summary', 'readings', 'notes', 'article'],
        tip: null,
      },
    ],
  },
];

// ─── Demo student profiles (fictional, labeled "Demo profile") ────────────────
export const demoStudents = [
  {
    id: 'student-alex',
    name: 'Alex Rivera',
    program: 'Computer Information Technology',
    skills: ['JavaScript', 'HTML', 'CSS', 'Python', 'Technical Writing'],
    enrolledCourseIds: ['csci-101', 'engl-111', 'math-136'],
    label: 'Demo profile',
  },
  {
    id: 'student-maya',
    name: 'Maya Johnson',
    program: 'Business Administration',
    skills: ['Excel', 'Business Writing', 'Marketing', 'Customer Service', 'Data Analysis'],
    enrolledCourseIds: ['busn-101', 'engl-111'],
    label: 'Demo profile',
  },
  {
    id: 'student-jordan',
    name: 'Jordan Patel',
    program: 'Nursing',
    skills: ['Patient Care', 'Medical Terminology', 'CPR', 'Documentation', 'Team Communication'],
    enrolledCourseIds: ['nurs-101', 'engl-111', 'math-136'],
    label: 'Demo profile',
  },
];

// Program → event tag (used to match events to a student's program)
export const programTags = {
  'Computer Information Technology': 'it',
  'Business Administration': 'business',
  'Nursing': 'health',
};

// ─── Demo instructor profile (fictional, labeled "Demo profile") ─────────────
export const demoInstructors = [
  {
    id: 'instructor-morgan',
    name: 'Prof. Morgan Lee',
    department: 'English & Communications',
    email: 'morgan.lee@example.edu',
    courseIds: ['engl-111', 'csci-101', 'busn-101'],
    label: 'Demo profile',
  },
];

// ─── Events (provided by the team; public event listings) ────────────────────
// programs: 'all' or program tags from programTags
export const eventsLastUpdated = '2026-11-20';
export const events = [
  { id: 'it-challenge', date: '2026-11-20', title: '2026 Ivy Tech IT Challenge', time: '8 a.m.–5 p.m. ET', location: 'Indianapolis Marriott East', source: 'Event details', programs: ['it', 'business'] },
  { id: 'sga-meeting', date: '2026-11-23', title: 'Student Government Association General Meeting', time: '4–5 p.m. ET', location: 'Fort Wayne Coliseum Campus', source: 'Campus calendar', programs: ['all'] },
  { id: 'i-explore', date: '2026-11-24', title: 'I-Explore Day', time: '9 a.m.–1 p.m. ET', location: 'Fort Wayne North Campus', source: 'Campus calendar', programs: ['all'] },
  { id: 'titan-thanks', date: '2026-11-25', title: 'Titan Day of Thanks', time: 'Noon–2 p.m. ET', location: 'Fort Wayne Coliseum Campus', source: 'Campus calendar', programs: ['all'] },
  { id: 'bit-cj-visit', date: '2026-12-04', title: 'Business, IT & Criminal Justice Visit Day', time: '9 a.m.–1:45 p.m. ET', location: 'Terre Haute Main Campus', source: 'Visit day details', programs: ['it', 'business'] },
  { id: 'dental-info', date: '2026-12-08', title: 'Dental Hygiene Information Session', time: '4 p.m. ET', location: 'Online via Ivy Tech Columbus', source: 'Session details', programs: ['health'] },
  { id: 'clear-choice-tour', date: '2026-12-10', title: 'Employer Tour — Clear Choice Glass', time: '10–11 a.m. ET', location: 'Clear Choice Glass, Fort Wayne', source: 'Campus calendar', programs: ['business', 'it'] },
  { id: 'priority-enrollment', date: '2026-12-22', title: 'Priority Enrollment Day', time: '9 a.m.–6 p.m. CT', location: 'Evansville Enrollment Center', source: 'Enrollment day details', programs: ['all'] },
];

// ─── AI Coach ────────────────────────────────────────────────────────────────
// Task types detected from the student's assignment description.
export const coachTaskTypes = [
  { id: 'writing', label: 'Writing assignment', keywords: ['essay', 'paper', 'report', 'write', 'writing', 'paragraph', 'reflection', 'discussion post'], useTypes: ['brainstorming', 'outlining', 'grammar-check', 'drafting', 'summarizing'] },
  { id: 'coding', label: 'Coding assignment', keywords: ['code', 'coding', 'program', 'debug', 'function', 'script', 'app', 'website', 'python', 'java', 'javascript'], useTypes: ['coding-help', 'brainstorming', 'grammar-check', 'drafting'] },
  { id: 'math', label: 'Math or problem set', keywords: ['math', 'algebra', 'equation', 'solve', 'problem set', 'homework problem', 'calculate', 'formula'], useTypes: ['brainstorming', 'drafting'] },
  { id: 'study', label: 'Studying or test prep', keywords: ['study', 'exam', 'test', 'quiz', 'review', 'terms', 'terminology', 'flashcards', 'notes'], useTypes: ['brainstorming', 'summarizing'] },
  { id: 'research', label: 'Research or reading', keywords: ['research', 'source', 'article', 'reading', 'readings', 'chapter', 'case study'], useTypes: ['summarizing', 'brainstorming', 'outlining'] },
];

// Prompt templates per use type. {topic} is replaced with the student's topic.
export const coachPrompts = {
  'brainstorming': [
    'Give me 5 different angles I could take on {topic}. Do not write any of the assignment.',
    'Explain the main idea behind {topic} using a new example, not my assignment.',
  ],
  'outlining': [
    'Suggest 3 possible ways to organize a paper on {topic}. I will write my own outline.',
  ],
  'grammar-check': [
    'Point out grammar and spelling mistakes in my paragraph and explain each one. Do not rewrite it.',
  ],
  'drafting': [
    'Give me feedback on how clear my draft about {topic} is. Do not rewrite it for me.',
  ],
  'coding-help': [
    'Explain what this error message means and where I should look. Do not give me the fixed code.',
    'Explain this syntax with a small example that is different from my assignment.',
  ],
  'summarizing': [
    'Summarize this reading about {topic} in 5 bullet points so I can check my own understanding.',
  ],
};

// ─── AI Literacy micro-certification (prototype) ─────────────────────────────
export const certification = {
  name: 'Ivy Tech AI Responsible Use micro-certification',
  status: 'Prototype badge. Not an official Ivy Tech credential.',
  passMark: 5,              // out of 6 scenarios (about 80%)
  badgeTarget: 150,         // badges in the first pilot semester
  examConversionTarget: 0.2,
  baseline: 0,
  baselineNote: 'No structured AI literacy certification pathway exists at Ivy Tech today.',
};

export const quiz = [
  {
    id: 'q1',
    scenario: 'Your syllabus says AI is "allowed with disclosure." You used AI to check the grammar in your essay. What should you do?',
    options: ['Nothing, grammar fixes don\'t count', 'Add a note saying which AI tool you used and what it did', 'Delete the AI changes before submitting'],
    answer: 1,
    explain: '"Allowed with disclosure" means you can use it, but you must say how you used it.',
  },
  {
    id: 'q2',
    scenario: 'Two of your classes have different AI rules for outlining. Which rule do you follow for your ENGL 111 paper?',
    options: ['The more relaxed rule from the other class', 'The ENGL 111 syllabus rule', 'Whatever a friend in ENGL 111 does'],
    answer: 1,
    explain: 'Each course sets its own policy. Always follow the syllabus for the class the work is for.',
  },
  {
    id: 'q3',
    scenario: 'The syllabus doesn\'t mention AI for summarizing readings. What is the safest next step?',
    options: ['Assume it\'s allowed', 'Ask your instructor before using AI for it', 'Use AI but don\'t tell anyone'],
    answer: 1,
    explain: 'When the policy is silent, ask. A-Ivy drafts the email for you.',
  },
  {
    id: 'q4',
    scenario: 'An AI tool gives you a statistic for your paper. What should you do before using it?',
    options: ['Check it against a trusted source', 'Use it, since AI is always accurate', 'Change the number slightly'],
    answer: 0,
    explain: 'AI can be confidently wrong. Verify facts with a reliable source.',
  },
  {
    id: 'q5',
    scenario: 'You want AI help with a project. Which of these should you NEVER paste into an AI tool?',
    options: ['Your own draft paragraph', 'A classmate\'s or patient\'s personal information', 'A general question about a concept'],
    answer: 1,
    explain: 'Protect personal data. Never share other people\'s private information with AI tools.',
  },
  {
    id: 'q6',
    scenario: 'Your CSCI 101 code works after AI helped you debug it, but you can\'t explain one function. What should you do?',
    options: ['Submit it anyway', 'Study the function until you can explain it, and disclose the AI help', 'Remove the comments so it looks like yours'],
    answer: 1,
    explain: 'Only submit work you understand, and disclose AI help when the policy requires it.',
  },
];

// Clearly labeled SAMPLE pilot numbers so the instructor dashboard can be demoed.
// Real completions on this device are added on top of these.
export const samplePilotWeeks = [
  { week: 'Week 1', badges: 14, examInterest: 2 },
  { week: 'Week 2', badges: 21, examInterest: 4 },
  { week: 'Week 3', badges: 26, examInterest: 5 },
  { week: 'Week 4', badges: 23, examInterest: 6 },
];
