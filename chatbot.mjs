/**
 * chatbot.mjs — Responsible AI Guide Chatbot
 * Keyword-driven response engine with typing indicator and smooth animations.
 */

// ── Knowledge base ────────────────────────────────────────────────────────────
const KB = [
  {
    keys: ['can i use', 'chatgpt', 'allowed', 'homework', 'assignment', 'permitted'],
    answer:
      'Whether you can use AI depends on your specific course. **Open the AI Guide**, select your course from the dropdown, and check the Allowed and Not Permitted lists for that class.\n\nAs a general rule: always disclose AI use, make sure the work reflects your own thinking, and when in doubt — ask your instructor before submitting.',
  },
  {
    keys: ['violation', 'integrity', 'academic', 'cheating', 'rules', 'policy'],
    answer:
      'An **academic integrity violation** related to AI typically means:\n\n• Submitting AI-generated work as entirely your own\n• Using AI on an assignment where it is explicitly prohibited\n• Failing to disclose AI use when your course requires it\n• Copying AI output without understanding or verifying it\n\nThe best protection is to check your course policy in the AI Guide before you start.',
  },
  {
    keys: ['cite', 'citation', 'reference', 'credit', 'acknowledge', 'disclose'],
    answer:
      'To cite an AI tool, include:\n\n1. **Tool name** (e.g. ChatGPT, Copilot)\n2. **Date** you used it\n3. **The prompt** you entered\n\nExample: "ChatGPT (OpenAI, November 2026). Prompt: Explain the water cycle in simple terms."\n\nCheck your course policy in the AI Guide — some instructors have a specific format they prefer.',
  },
  {
    keys: ['responsible', 'rubric', 'checklist', 'best practice', 'tip', 'advice', 'safe'],
    answer:
      'The **AI-use rubric** in the AI Guide gives you a self-check list for each course. Before submitting any AI-assisted work, ask yourself:\n\n• Does my instructor allow AI for this task?\n• Is the final work in my own words?\n• Have I disclosed the tool I used?\n• Can I explain and defend every part of this work?\n\nIf you answered "no" to any of these, revise before submitting.',
  },
  {
    keys: ['small business', 'business', 'entrepreneur', 'startup', 'company', 'workplace'],
    answer:
      'The same responsible-AI principles you learn here apply directly in a **small business** context:\n\n• **Disclose** when AI helped create customer-facing content\n• **Verify** any AI-generated data or facts before acting on them\n• **Keep humans in the loop** for decisions that affect people\n• **Protect privacy** — do not feed sensitive customer data into public AI tools\n\nAI literacy built in the classroom is a real workforce skill.',
  },
  {
    keys: ['guide', 'course', 'select', 'lookup', 'find', 'how to use', 'navigate'],
    answer:
      'To use the **AI Guide**:\n\n1. Click **AI Guide** in the top navigation\n2. Use the dropdown to select your course\n3. Read the policy, allowed and prohibited uses, and the self-check rubric\n4. Check the tips panel for responsible-use coaching specific to that course',
  },
  {
    keys: ['help', 'stuck', 'confused', 'lost', 'question', 'support', 'what can'],
    answer:
      'Happy to help! Try asking about:\n\n• Whether AI is allowed on your homework\n• What counts as an academic integrity violation\n• How to cite AI tools\n• The self-check rubric for responsible use\n• Using AI responsibly in a small business\n• How to navigate the AI Guide',
  },
];

// Fallback answer
const FALLBACK =
  "I don't have a specific answer for that yet. Try opening the **AI Guide** and selecting your course — it shows exactly what is and isn't allowed, plus a self-check rubric and tips.";

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
        "Hi there! 👋 I'm the **AI Guide Assistant**. I can help you understand your course's AI policy, check if a specific use is allowed, learn how to cite AI tools, and more. What would you like to know?",
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
