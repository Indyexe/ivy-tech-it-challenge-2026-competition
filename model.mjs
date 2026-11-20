export const sampleWeeks = [
  { week: 'W01', records: 37, completed: 21 },
  { week: 'W02', records: 44, completed: 26 },
  { week: 'W03', records: 39, completed: 24 },
  { week: 'W04', records: 51, completed: 35 },
  { week: 'W05', records: 48, completed: 32 },
  { week: 'W06', records: 55, completed: 39 },
  { week: 'W07', records: 49, completed: 35 },
  { week: 'W08', records: 58, completed: 42 },
  { week: 'W09', records: 60, completed: 46 },
  { week: 'W10', records: 57, completed: 43 },
  { week: 'W11', records: 65, completed: 50 },
  { week: 'W12', records: 68, completed: 55 },
];

export const coursePolicies = [
  {
    id: 'cit101',
    code: 'CIT 101',
    title: 'Introduction to Computers',
    instructor: 'Prof. Sandra Merrill',
    policy:
      'AI writing and coding assistants may be used to explore concepts and check your work, but all submitted work must be written in your own words. You must disclose any AI tool you used in a brief note at the end of your submission. Using AI to generate answers you submit as your own without disclosure is an academic integrity violation.',
    allowed: [
      'Using AI tools to look up syntax or definitions',
      'Asking an AI to explain a concept in different words',
      'Using AI to check spelling and grammar on a draft you wrote',
    ],
    prohibited: [
      'Submitting AI-generated text or code without disclosure',
      'Using AI to complete entire assignments on your behalf',
      'Sharing AI outputs as your own original thinking',
    ],
    tips: [
      'Always write your first draft yourself, then use AI to review — not create.',
      'Add a one-sentence note at the end: "I used [tool] to check grammar on this submission."',
      'If you are unsure whether a use is allowed, ask your instructor before submitting.',
    ],
    rubric: [
      'Does my instructor allow AI use for this specific task type?',
      'Is the final work written in my own words and reflecting my own thinking?',
      'Have I disclosed which AI tool I used at the end of my submission?',
      'Would I be comfortable explaining every part of this work to my instructor?',
    ],
  },
  {
    id: 'eng111',
    code: 'ENG 111',
    title: 'English Composition I',
    instructor: 'Prof. Marcus Delacroix',
    policy:
      'AI tools are not permitted at any stage of the writing process in this course. All brainstorming, outlining, drafting, and revising must be your own original work. The goal of this course is to develop your critical thinking and writing voice. Use of AI to generate any portion of a submitted essay is a violation of academic integrity.',
    allowed: [
      'Using a standard spell-checker built into your word processor',
      'Consulting a dictionary or thesaurus',
    ],
    prohibited: [
      'Using AI tools (ChatGPT, Copilot, Gemini, or similar) for any part of the writing process',
      'Using AI to brainstorm, outline, draft, or revise',
      'Paraphrasing AI-generated content and submitting it as your own',
    ],
    tips: [
      'Write a rough outline by hand before you open any document — this keeps your ideas yours.',
      'If you feel stuck, visit the Writing Center for human tutoring support.',
      'Read your draft aloud to yourself; it is the fastest way to catch problems without AI.',
    ],
    rubric: [
      'Did I complete all brainstorming, outlining, and drafting entirely on my own?',
      'Have I avoided using any AI tool at any stage of this assignment?',
      'Can I explain and defend every sentence in this paper without outside help?',
      'Have I used only permitted tools (spell-check, dictionary, thesaurus)?',
    ],
  },
  {
    id: 'bus201',
    code: 'BUS 201',
    title: 'Introduction to Business',
    instructor: 'Prof. Yolanda Krentz',
    policy:
      'AI tools may be used for research and to help structure your thinking, but the analysis, conclusions, and written narrative must be your own. You are required to cite any AI tool used as you would cite any other source, using the course citation format. AI-generated financial figures or data must never be presented as factual without independent verification.',
    allowed: [
      'Using AI to summarize background information on a business topic',
      'Using AI to help brainstorm a list of pros and cons',
      'Using AI to suggest an outline structure',
    ],
    prohibited: [
      'Presenting AI-generated analysis or conclusions as your own work',
      'Using AI-generated data or statistics without citing and verifying them',
      'Submitting AI-written narrative sections without citation',
    ],
    tips: [
      'Treat AI outputs the way you treat Wikipedia — a starting point, never a final source.',
      'Always verify any numbers or statistics an AI gives you against a credible source.',
      'Cite AI use in your reference list: include the tool name, date, and the prompt you used.',
    ],
    rubric: [
      'Have I cited every AI tool I used, including the prompt I entered?',
      'Have I independently verified all data and statistics the AI provided?',
      'Is the analysis and final narrative written in my own words?',
      'Would this work stand on its own if I removed the AI-assisted sections?',
    ],
  },
  {
    id: 'hit115',
    code: 'HIT 115',
    title: 'Health Information Technology Fundamentals',
    instructor: 'Prof. Diane Okafor',
    policy:
      'Due to patient privacy and regulatory requirements modeled in this course, AI tools may only be used to help study terminology and concepts. AI must never be used on any assignment that involves sample health records, case studies, or scenario-based patient data, as this simulates real-world HIPAA compliance expectations. All clinical documentation exercises must be completed without AI assistance.',
    allowed: [
      'Using AI flashcard tools to study medical terminology',
      'Asking AI to explain a healthcare regulation concept in plain language for studying',
    ],
    prohibited: [
      'Using AI on any assignment involving patient or health record data',
      'Using AI to complete clinical documentation exercises',
      'Using AI to analyze case study scenarios',
    ],
    tips: [
      'Think of this policy as practice for the real world — healthcare professionals cannot outsource patient documentation to AI.',
      'Use AI only during your personal study sessions, never when working with course case materials.',
      'When in doubt about a scenario, ask: "Would a real patient\'s privacy be at risk if I handled this carelessly?" Apply the same standard here.',
    ],
    rubric: [
      'Does this assignment involve any patient data, health records, or clinical scenarios?',
      'If yes to the above, have I completed it entirely without AI assistance?',
      'Am I using AI only for personal study of terminology and concepts — not for graded work?',
      'Does my use of AI reflect how a real healthcare professional would handle this situation?',
    ],
  },
  {
    id: 'dat220',
    code: 'DAT 220',
    title: 'Data Analytics Foundations',
    instructor: 'Prof. Jerome Whitfield',
    policy:
      'AI coding assistants (such as GitHub Copilot or ChatGPT) may be used to help write and debug code, but you must understand every line you submit. If asked, you must be able to explain what any part of your code does and why. AI may also be used to help interpret results, but your written interpretation must be in your own words. Document all AI assistance in a comment block at the top of your code file.',
    allowed: [
      'Using AI to suggest code snippets or debug errors',
      'Using AI to explain what a function or method does',
      'Using AI to suggest ways to visualize a dataset',
      'Using AI to help interpret statistical output',
    ],
    prohibited: [
      'Submitting AI-generated code you cannot explain line by line',
      'Using AI to write your data interpretation narrative without substantial revision',
      'Failing to document AI assistance in the required comment block',
    ],
    tips: [
      'After AI suggests a code fix, type it out yourself and make sure you can explain it — do not just copy and paste.',
      'Start your code file with a comment block listing every AI tool and prompt you used.',
      'If you cannot explain what a line does, that is a signal to study it before submitting.',
    ],
    rubric: [
      'Can I explain every line of code in this submission without referring to AI?',
      'Have I documented all AI assistance in a comment block at the top of my file?',
      'Is my written data interpretation in my own words?',
      'Have I tested all AI-suggested code myself and confirmed it works as expected?',
    ],
  },
];

export const quizScenarios = [
  // ── Universal (apply to any course or context) ───────────────────────────
  {
    id: 'u1',
    category: 'universal',
    question:
      'You used ChatGPT to help you rephrase two paragraphs in your essay. Your course allows AI for editing. What must you do before submitting?',
    options: [
      'Nothing — the course allows it, so no action is needed.',
      'Delete the AI-rephrased paragraphs and rewrite them yourself.',
      'Add a brief disclosure noting you used AI for editing.',
      'Ask your instructor for permission each time.',
    ],
    correct: 2,
    explanation:
      'Even when AI use is permitted, most policies require disclosure. A one-line note ("I used ChatGPT to help rephrase two paragraphs") protects you and builds trust with your instructor.',
  },
  {
    id: 'u2',
    category: 'universal',
    question:
      'An AI tool gives you a statistic: "75% of small businesses that use AI see a 30% revenue increase." You want to include this in your report. What should you do first?',
    options: [
      'Include it — the AI generated it so it must be accurate.',
      'Verify the statistic against a credible source before using it.',
      'Paraphrase it slightly so it does not look AI-generated.',
      'Only use it if you cite the AI tool as the source.',
    ],
    correct: 1,
    explanation:
      'AI tools frequently hallucinate statistics. Always verify any figure an AI provides against a credible, primary source before including it in your work.',
  },
  {
    id: 'u3',
    category: 'universal',
    question:
      'Your course policy is silent on AI — it does not mention AI tools at all. What is the safest course of action?',
    options: [
      'AI is implicitly allowed since it is not prohibited.',
      'AI is implicitly banned since it is not mentioned.',
      'Ask your instructor for clarification before using any AI tool.',
      'Use AI freely but do not disclose it.',
    ],
    correct: 2,
    explanation:
      'Silence in a policy is not permission. Asking your instructor takes two minutes and eliminates all risk of an unintentional violation.',
  },
  {
    id: 'u4',
    category: 'universal',
    question:
      'Which of the following is always considered responsible AI use, regardless of the course policy?',
    options: [
      'Using AI to write your entire first draft.',
      'Understanding and being able to explain every part of your submitted work.',
      'Keeping your AI use secret to avoid judgment.',
      'Only using AI tools that your instructor has personally recommended.',
    ],
    correct: 1,
    explanation:
      'Regardless of what a policy allows, the core principle is that you must own your work. If you cannot explain or defend any part of it, that is a problem — in academics and in professional life.',
  },
  {
    id: 'u5',
    category: 'universal',
    question:
      'You are a small business owner drafting a customer privacy policy. You ask an AI to generate it for you and publish it without review. What is the main risk?',
    options: [
      'The policy may use informal language.',
      'The AI may have included legally inaccurate or outdated requirements.',
      'Customers will know you used AI.',
      'The policy will be too long.',
    ],
    correct: 1,
    explanation:
      'AI-generated legal or compliance documents can contain errors, outdated regulations, or missing requirements. Always have a qualified human review any AI-generated content with legal or regulatory implications.',
  },

  // ── Writing / Humanities ─────────────────────────────────────────────────
  {
    id: 'w1',
    category: 'writing',
    question:
      'Your English Composition instructor prohibits AI at all stages of writing. You feel stuck on your thesis. Which action is acceptable?',
    options: [
      'Ask an AI to suggest three possible thesis statements and pick one.',
      'Visit the campus Writing Center for help from a human tutor.',
      'Use AI just for brainstorming since that is not "writing."',
      'Paraphrase an AI-generated thesis so it sounds like your own.',
    ],
    correct: 1,
    explanation:
      'When AI is fully prohibited, human resources like writing centers, tutors, and office hours are the right path. Brainstorming with AI is still AI use and violates an all-prohibited policy.',
  },

  // ── Technology / Coding ──────────────────────────────────────────────────
  {
    id: 't1',
    category: 'tech',
    question:
      'Your DAT 220 instructor allows AI coding assistants but requires you to explain any code you submit. An AI writes a 20-line function you do not fully understand. What should you do?',
    options: [
      'Submit it — the instructor only checks if it runs correctly.',
      'Delete it and write the function yourself from scratch.',
      'Study the function until you can explain every line, then submit with a disclosure.',
      'Ask a classmate to explain it for you so you can include their explanation.',
    ],
    correct: 2,
    explanation:
      'The policy requires you to understand your own submission. Taking time to study AI-generated code before submitting — and disclosing the assistance — satisfies both the policy and the learning goal.',
  },

  // ── Healthcare / Privacy ─────────────────────────────────────────────────
  {
    id: 'h1',
    category: 'healthcare',
    question:
      'Your HIT 115 course includes a case study with sample patient data. Your instructor prohibits AI on assignments involving patient records. You are stuck on the analysis. What is allowed?',
    options: [
      'Use AI to analyze the data since it is only sample data, not real.',
      'Paste the case study into an AI tool for general guidance.',
      'Review your class notes and textbook, or ask your instructor during office hours.',
      'Use AI for the parts of the assignment that do not mention the patient directly.',
    ],
    correct: 2,
    explanation:
      'The prohibition applies to the entire assignment that involves patient data — not just specific lines. The professional standard being taught is that patient documentation requires human judgment without AI shortcuts.',
  },

  // ── Business / Analytics ─────────────────────────────────────────────────
  {
    id: 'b1',
    category: 'business',
    question:
      'Your BUS 201 instructor requires you to cite AI tools as sources. You used AI to summarize three articles. How should you cite this in your reference list?',
    options: [
      'List the three original articles only — the AI was just a tool, not a source.',
      'Write "AI-assisted" in a footnote at the bottom of the page.',
      'Include a citation for the AI tool with the tool name, date, and prompt used.',
      'No citation is needed since you read the AI summary, not the articles.',
    ],
    correct: 2,
    explanation:
      'When a course requires citing AI, treat it like any other source: name the tool, the date you used it, and what you asked it. This gives your instructor full transparency and protects your academic integrity.',
  },
  {
    id: 'b2',
    category: 'business',
    question:
      'You are preparing a business pitch and use AI to generate projected revenue figures. A judge asks where your numbers came from. What is the responsible answer?',
    options: [
      '"I researched industry benchmarks" — the AI pulled from real data anyway.',
      '"An AI tool generated them, and I verified the assumptions against industry reports."',
      'Change the subject — the figures are close enough.',
      '"I will send you the sources later" and hope they forget.',
    ],
    correct: 1,
    explanation:
      'Transparency about AI use is not a weakness — it demonstrates professionalism. Pairing AI-generated figures with independent verification is the responsible approach in any business context.',
  },
];

export function summarizeWeeks(weeks) {
  const records = weeks.reduce((total, week) => total + week.records, 0);
  const completed = weeks.reduce((total, week) => total + week.completed, 0);
  return { records, completed, rate: records ? completed / records : 0 };
}

export function impactStatement(scope = {}, impact = {}) {
  const show = (value) => value || '[To be completed]';
  const hasNumbers = scope.baseline !== undefined && scope.baseline !== ''
    && scope.target !== undefined && scope.target !== '';
  const baseline = Number(scope.baseline);
  const target = Number(scope.target);
  const change = target - baseline;
  const number = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12 });
  const outcome = hasNumbers && Number.isFinite(change)
    ? `${number.format(baseline)} → ${number.format(target)} ${scope.unit}\n\nTarget change: ${change > 0 ? '+' : ''}${number.format(change)} ${scope.unit}`
    : '[Save finite baseline and target values in the scope]';

  return [
    '# Impact Statement',
    `## Who benefits\n${show(scope.persona)}\n\nStrategic pillar: ${show(scope.pillar)}\n\nProblem: ${show(scope.problem)}`,
    `## Prototype\n${show(impact.solution)}`,
    `## Measurable outcome\nMetric: ${show(scope.metric)}\n\n${outcome}\n\nMeasurement plan: ${show(impact.measurement)}`,
    `## Statewide rollout\n${show(impact.rollout)}`,
    `## Top risk and mitigation\n${show(impact.risk)}`,
  ].join('\n\n') + '\n';
}
