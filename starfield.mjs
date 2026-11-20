const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sky = document.getElementById('starfield');
const context = sky.getContext('2d');

if (context) {
  let width;
  let height;
  let stars = [];
  let frame = 0;
  let pointer = null;
  let cursor = null;
  const hues = ['232, 244, 255', '139, 228, 249', '152, 168, 255'];

  function resize() {
    width = sky.clientWidth;
    height = sky.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    sky.width = Math.round(width * scale);
    sky.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(220, Math.max(60, Math.round(width * height / 6400)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: .45 + Math.random() ** 2 * 1.5,
      brightness: .24 + Math.random() * .61,
      phase: Math.random() * Math.PI * 2,
      tint: hues[Math.floor(Math.random() * hues.length)],
    }));
    draw(performance.now());
    queueFrame();
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const animated = !motion.matches;
    if (pointer && animated) {
      cursor ??= { ...pointer };
      cursor.x += (pointer.x - cursor.x) * .18;
      cursor.y += (pointer.y - cursor.y) * .18;
    } else {
      cursor = null;
    }

    for (const star of stars) {
      const dx = cursor ? star.x - cursor.x : 0;
      const dy = cursor ? star.y - cursor.y : 0;
      const distance = Math.hypot(dx, dy);
      const proximity = cursor ? Math.max(0, 1 - distance / 155) : 0;
      const shift = 32 * proximity ** 2 / Math.max(distance, 1);
      const x = star.x + dx * shift;
      const y = star.y + dy * shift;
      const twinkle = animated ? Math.sin(time * .0013 + star.phase) * .12 : 0;
      const alpha = Math.min(1, star.brightness + twinkle + proximity * .42);

      if (proximity > .5) {
        context.beginPath();
        context.moveTo(cursor.x, cursor.y);
        context.lineTo(x, y);
        context.strokeStyle = `rgba(${star.tint}, ${(proximity - .5) * .28})`;
        context.stroke();
      }

      context.beginPath();
      context.arc(x, y, star.size + proximity * 1.15, 0, Math.PI * 2);
      context.fillStyle = `rgba(${star.tint}, ${alpha})`;
      context.fill();
    }
  }

  function queueFrame() {
    if (!frame && !motion.matches && !document.hidden) {
      frame = requestAnimationFrame((time) => {
        frame = 0;
        draw(time);
        queueFrame();
      });
    }
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    draw(performance.now());
    queueFrame();
  }

  const clearPointer = () => { pointer = null; };
  window.addEventListener('pointermove', (event) => {
    if (!motion.matches) pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  window.addEventListener('pointerdown', (event) => {
    if (!motion.matches) pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') clearPointer();
  });
  window.addEventListener('pointercancel', clearPointer);
  document.documentElement.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncAnimation);
  motion.addEventListener('change', syncAnimation);
  resize();
}

for (const card of document.querySelectorAll('.phase-card, .panel, .callout')) {
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || motion.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
  }, { passive: true });
}

if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!motion.matches) {
        entry.target.animate(
          [{ opacity: .6, translate: '0 12px' }, { opacity: 1, translate: '0 0' }],
          { duration: 520, easing: 'cubic-bezier(.2,.65,.3,1)' },
        );
      }
      reveal.unobserve(entry.target);
    }
  }, { threshold: .15 });
  document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element));
}
