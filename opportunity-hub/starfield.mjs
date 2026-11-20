/**
 * starfield.mjs — A-Ivy background stars + card glow
 * Adapted from the team starter's starfield.mjs.
 *
 * Desktop (mouse): nearby stars brighten and drift away from the pointer, then
 * ease back when it leaves; an emerald glow follows the pointer inside cards.
 * Touch devices and reduced-motion: stars are drawn once and stay still.
 * The canvas has pointer-events: none, so it never blocks clicks.
 */

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const touchOnly = window.matchMedia('(hover: none), (pointer: coarse)');
const sky = document.getElementById('starfield');
const context = sky?.getContext('2d');

const interactive = () => !motion.matches && !touchOnly.matches;

if (context) {
  let width = 0;
  let height = 0;
  let stars = [];
  let frame = 0;
  let pointer = null;   // where the mouse is
  let cursor = null;    // smoothed position that eases toward the pointer
  let influence = 0;    // 0..1, fades in on enter and out on leave
  const tints = ['238, 243, 251', '167, 243, 208', '147, 197, 253'];

  function resize() {
    width = sky.clientWidth;
    height = sky.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    sky.width = Math.round(width * scale);
    sky.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(200, Math.max(50, Math.round((width * height) / 7000)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.45 + Math.random() ** 2 * 1.4,
      brightness: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      tint: tints[Math.floor(Math.random() * tints.length)],
    }));
    syncAnimation();
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const animated = interactive();

    if (animated && pointer) {
      cursor ??= { ...pointer };
      cursor.x += (pointer.x - cursor.x) * 0.16;
      cursor.y += (pointer.y - cursor.y) * 0.16;
      influence += (1 - influence) * 0.12;
    } else {
      influence += (0 - influence) * 0.1;   // ease back after the mouse leaves
      if (influence < 0.01) { influence = 0; cursor = null; }
    }

    for (const star of stars) {
      const dx = cursor ? star.x - cursor.x : 0;
      const dy = cursor ? star.y - cursor.y : 0;
      const distance = Math.hypot(dx, dy);
      const proximity = cursor ? Math.max(0, 1 - distance / 160) * influence : 0;
      const shift = (28 * proximity ** 2) / Math.max(distance, 1);
      const x = star.x + dx * shift;
      const y = star.y + dy * shift;
      const twinkle = animated ? Math.sin(time * 0.0012 + star.phase) * 0.1 : 0;
      const alpha = Math.min(1, star.brightness + twinkle + proximity * 0.55);

      context.beginPath();
      context.arc(x, y, star.size + proximity * 1.2, 0, Math.PI * 2);
      context.fillStyle = `rgba(${star.tint}, ${alpha})`;
      context.fill();
    }
  }

  function queueFrame() {
    if (frame || document.hidden || !interactive()) return;
    frame = requestAnimationFrame((time) => {
      frame = 0;
      draw(time);
      queueFrame();
    });
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!interactive()) { pointer = null; cursor = null; influence = 0; }
    draw(performance.now());
    queueFrame();
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse' && interactive()) pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  const clearPointer = () => { pointer = null; };
  document.documentElement.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncAnimation);
  motion.addEventListener('change', syncAnimation);
  touchOnly.addEventListener('change', syncAnimation);
  resize();
}

// ─── Emerald glow that follows the mouse inside cards ────────────────────────
// Uses event delegation so cards added later (course cards) also glow.
document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || motion.matches) return;
  const card = event.target.closest?.('.glow-card');
  if (!card) return;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
}, { passive: true });
