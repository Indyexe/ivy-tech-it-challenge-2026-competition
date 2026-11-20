/**
 * chatbot.mjs — Futuristic Help Chatbot for the Ivy Tech IT Challenge Hub
 * Keyword-driven response engine with typing indicator and smooth animations.
 */

// ── Knowledge base ────────────────────────────────────────────────────────────
const KB = [
  {
    keys: ['what is', 'it challenge', 'about', 'hub', 'overview'],
    answer:
      'The **Ivy Tech IT Challenge** is a team competition in the Data Analytics, Applied AI & Informatics track. Your team frames a real problem, builds a prototype with IBM Bob, runs a pilot, and presents measurable impact to judges.',
  },
  {
    keys: ['get started', 'start', 'begin', 'first step', 'how do'],
    answer:
      'Start with **Phase 01 — Define**. Agree on one strategic pillar, one person you serve, and one measurable outcome. Then fill in the scope form and move through Build → Iterate → Present.',
  },
  {
    keys: ['phase', 'phases', 'steps', 'workflow'],
    answer:
      'There are **4 phases**:\n\n01 · **Define** — Scope the problem and set a metric\n02 · **Build** — Prototype with IBM Bob\n03 · **Iterate** — Run a pilot and capture feedback\n04 · **Present** — Deliver your impact statement',
  },
  {
    keys: ['define', 'scope', 'pillar', 'persona', 'baseline', 'target', 'metric'],
    answer:
      'In **Define**, you pick a strategic pillar, name the person you serve, describe the problem, and set a measurable outcome (metric, baseline, and target). Fill in the form under Phase 01 and hit **Save scope**.',
  },
  {
    keys: ['build', 'prototype', 'chart', 'demo', 'sample'],
    answer:
      'In **Build**, explore the sample chart with synthetic data, run the practice demo, and plan the smallest end-to-end workflow your team will prototype on challenge day. Use IBM Bob to plan each step.',
  },
  {
    keys: ['iterate', 'pilot', 'feedback', 'observation', 'change', 'retest'],
    answer:
      'In **Iterate**, watch a real pilot user attempt a task, record what they struggled with, propose one change, and retest. Each entry is saved to the Feedback log.',
  },
  {
    keys: ['impact', 'present', 'statement', 'rollout', 'risk', 'export', 'download', 'markdown'],
    answer:
      'In **Present**, write a concise impact statement covering your prototype, measurement plan, statewide rollout, and top risk. Hit **Save impact draft** then **Download Markdown** to export it.',
  },
  {
    keys: ['analytics', 'progress', 'track', 'metric', 'rate', 'completion'],
    answer:
      'Open **Analytics** to see phases started, pilot observations, roadmap tasks, and your outcome measurement. The sample chart uses synthetic data — on challenge day you can swap in real figures.',
  },
  {
    keys: ['roadmap', 'timeline', 'milestone', 'checklist', 'task', 'delivery'],
    answer:
      'The **Roadmap** shows 4 milestones with 3 checklist tasks each (12 total). Check off tasks as you go — progress is saved in your browser and reflected in Analytics.',
  },
  {
    keys: ['ibm bob', 'bob', 'ai', 'assistant', 'log'],
    answer:
      'IBM Bob is the AI assistant your team uses to plan and build the prototype. Keep a running **Bob Log** (BOB-LOG.md) documenting what you asked Bob and what it produced — judges review this during presentation.',
  },
  {
    keys: ['team', 'member', 'role', 'who', 'lois', 'kaleb', 'collin', 'ryan', 'anaya'],
    answer:
      'Your team roles:\n\n• **Lois** — Documentation Lead\n• **Kaleb & Collin** — Developers\n• **Ryan** — Business Analytics Lead\n• **Anaya** — Strategy Lead',
  },
  {
    keys: ['github', 'repo', 'repository', 'source', 'code'],
    answer:
      'The original starter code is at **github.com/Indyexe/ivy-tech-it-challenge-2026**. Use your team’s competition repository for challenge-day commits and keep the Bob Log up to date before presenting.',
  },
  {
    keys: ['save', 'storage', 'data', 'browser', 'local'],
    answer:
      'All your work — scope, feedback, roadmap checkboxes, and impact drafts — is saved to **localStorage** in this browser. It is not synced to the server, so use the same browser and device during the challenge.',
  },
  {
    keys: ['help', 'stuck', 'confused', 'lost', 'question', 'support'],
    answer:
      'Happy to help! Try asking about:\n\n• The phases (Define, Build, Iterate, Present)\n• The Analytics or Roadmap views\n• IBM Bob and the Bob Log\n• Your team roles\n\nOr just type your question and I will do my best.',
  },
];

// Fallback answer
const FALLBACK =
  "I don't have a specific answer for that yet. Try asking about the phases, roadmap, analytics, IBM Bob, your team roles, or how to save your work.";

// ── Response engine ────────────────────────────────────────────────────────────
function getAnswer(text) {
  const q = text.toLowerCase();
  for (const entry of KB) {
    if (entry.keys.some(k => q.includes(k))) {
      return entry.answer;
    }
  }
  return FALLBACK;
}

// ── Markdown-lite renderer (bold + newlines only) ─────────────────────────────
function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ── Time label ────────────────────────────────────────────────────────────────
function timeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── DOM helpers ───────────────────────────────────────────────────────────────
function buildMessage(role, html, time) {
  const wrap = document.createElement('div');
  wrap.className = `chat-msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'bot' ? '✦' : '✎';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = `${html}<span class="chat-timestamp">${time}</span>`;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  return wrap;
}

function buildTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg bot';
  wrap.id = 'chat-typing-row';

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = '✦';

  const dots = document.createElement('div');
  dots.className = 'chat-typing';
  dots.setAttribute('aria-label', 'Assistant is typing');
  dots.innerHTML = '<span></span><span></span><span></span>';

  wrap.appendChild(avatar);
  wrap.appendChild(dots);
  return wrap;
}

// ── Main init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const launcher  = document.getElementById('chat-launcher');
  const panel     = document.getElementById('chat-panel');
  const closeBtn  = document.getElementById('chat-close');
  const form      = document.getElementById('chat-form');
  const input     = document.getElementById('chat-input');
  const messages  = document.getElementById('chat-messages');
  const notify    = document.getElementById('chat-notify');
  const suggsBox  = document.getElementById('chat-suggestions');

  if (!launcher || !panel) return;

  let isOpen = false;
  let busy   = false;
  let greeted = false;

  // ── Open / close ────────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    panel.hidden = false;
    // allow display:flex to settle before adding transition class
    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add('chat-open'));
    });
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    notify.hidden = true;

    if (!greeted) {
      greeted = true;
      appendBot(
        "Hi there! 👋 I'm the **Hub Assistant**. I can help you navigate the IT Challenge, understand the phases, track your progress, and more. What would you like to know?",
      );
    }

    setTimeout(() => input.focus(), 240);
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('chat-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    // hide after transition
    panel.addEventListener('transitionend', () => { panel.hidden = true; }, { once: true });
    launcher.focus();
  }

  launcher.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // ── Append helpers ───────────────────────────────────────────────────────────
  function appendBot(text) {
    const el = buildMessage('bot', renderMarkdown(text), timeLabel());
    messages.appendChild(el);
    scrollToBottom();
  }

  function appendUser(text) {
    const el = buildMessage('user', renderMarkdown(text), timeLabel());
    messages.appendChild(el);
    scrollToBottom();
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Typing simulation ────────────────────────────────────────────────────────
  function simulateTyping(answer, delay = 820) {
    busy = true;
    setSendState(false);

    const typingEl = buildTyping();
    messages.appendChild(typingEl);
    scrollToBottom();

    setTimeout(() => {
      typingEl.remove();
      appendBot(answer);
      busy = false;
      setSendState(true);
    }, delay + Math.min(answer.length * 1.4, 600));
  }

  function setSendState(enabled) {
    const sendBtn = form.querySelector('.chat-send');
    if (sendBtn) sendBtn.disabled = !enabled;
    input.disabled = !enabled;
  }

  // ── Send a message ───────────────────────────────────────────────────────────
  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    // Hide suggestions after first real send
    suggsBox.style.display = 'none';

    appendUser(trimmed);
    input.value = '';

    const answer = getAnswer(trimmed);
    simulateTyping(answer);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    sendMessage(input.value);
  });

  // ── Quick suggestions ────────────────────────────────────────────────────────
  suggsBox.addEventListener('click', e => {
    const btn = e.target.closest('.chat-suggestion');
    if (!btn) return;
    sendMessage(btn.dataset.q || btn.textContent);
  });

  // ── Show notification badge after 3 s if chat hasn't been opened ─────────────
  setTimeout(() => {
    if (!greeted) notify.hidden = false;
  }, 3000);
});
