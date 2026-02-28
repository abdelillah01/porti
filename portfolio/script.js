/* ====================================================
   PORTFOLIO — script.js
   Author: Mohamed Abdelillah OURAOU
   Features:
     1.  Typing animation (hero role cycling)
     2.  Scroll reveal  (IntersectionObserver fade-in-up)
     3.  Navbar scroll  (opacity/blur on scroll)
     4.  Mobile menu    (hamburger drawer toggle)
     5.  Active nav     (highlight current section link)
     --- Motion & Visual Overhaul ---
     6.  Page loader    (MAO overlay exit animation)
     7.  Custom cursor  (dot + delayed ring)
     8.  Magnetic btns  (attract to cursor on hover)
     9.  Particle field (canvas hero background)
     10. 3D card tilt   (rotateX/Y via CSS vars)
     11. Card spotlight (radial gradient via CSS vars)
     12. Hero entrance  (staggered fade-in sequence)
     13. Scramble text  (section headings decode effect)
     14. Stats counters (count-up animation)
     15. Parallax orbs  (scroll-driven orb depth shift)
   ==================================================== */

'use strict';

/* ====================================================
   1. TYPING ANIMATION
   Cycles through role strings character by character,
   pauses, deletes, then moves to the next string.
   ==================================================== */
(function initTyping() {
  const target  = document.getElementById('typing-target');
  if (!target) return;

  const roles = [
    'Backend Engineer',
    'Distributed Systems',
    'Applied ML',
    'Correctness First',
  ];

  const TYPE_SPEED_MIN   = 55;
  const TYPE_SPEED_MAX   = 110;
  const DELETE_SPEED     = 40;
  const PAUSE_AFTER_TYPE = 1800;
  const PAUSE_AFTER_DEL  = 350;

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function tick() {
    if (isPaused) return;

    const current = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; tick(); }, PAUSE_AFTER_TYPE);
        return;
      }
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        isPaused   = true;
        setTimeout(() => { isPaused = false; tick(); }, PAUSE_AFTER_DEL);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETE_SPEED : randBetween(TYPE_SPEED_MIN, TYPE_SPEED_MAX));
  }

  setTimeout(tick, 600);
})();


/* ====================================================
   2. SCROLL REVEAL
   Adds `.visible` to `.reveal` elements on viewport entry.
   ==================================================== */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();


/* ====================================================
   3. NAVBAR SCROLL OPACITY
   Adds `.nav--scrolled` when scrollY > 50px.
   ==================================================== */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ====================================================
   4. MOBILE MENU (Hamburger → Drawer toggle)
   ==================================================== */
(function initMobileMenu() {
  const burger      = document.querySelector('.nav__burger');
  const drawer      = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  if (!burger || !drawer) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    drawer.classList.add('nav__mobile--open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    drawer.classList.remove('nav__mobile--open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!isOpen) return;
    const nav = document.querySelector('.nav');
    if (nav && !nav.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') { closeMenu(); burger.focus(); }
  });
})();


/* ====================================================
   5. ACTIVE NAV LINK HIGHLIGHTING
   IntersectionObserver marks current section's nav link.
   ==================================================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const linkMap = {};
  navLinks.forEach((link) => { linkMap[link.dataset.section] = link; });

  let activeSection = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id   = entry.target.id;
        const link = linkMap[id];
        if (!link) return;
        if (entry.isIntersecting) {
          if (activeSection && linkMap[activeSection]) {
            linkMap[activeSection].classList.remove('active');
          }
          link.classList.add('active');
          activeSection = id;
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();


/* ====================================================
   6. PAGE LOADER
   Plays exit animation after window.load, then removes.
   Dispatches 'loaderExit' so hero entrance can sync.
   ==================================================== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  let exited = false;

  function exit() {
    if (exited) return;
    exited = true;
    loader.classList.add('loader--exit');
    setTimeout(() => {
      loader.style.display = 'none';
      document.dispatchEvent(new CustomEvent('loaderExit'));
    }, 700); // match CSS transition duration
  }

  window.addEventListener('load', exit);
  // Failsafe: exit after 3s regardless
  setTimeout(exit, 3000);
})();


/* ====================================================
   7. CUSTOM CURSOR
   Dot snaps to mouse; ring follows with lerp smoothing.
   Expands on interactive element hover.
   Desktop only (pointer: fine media query).
   ==================================================== */
(function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot snaps immediately
    dot.style.transform  = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    dot.style.opacity    = '1';
    ring.style.opacity   = '1';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  // Ring follows with smooth lerp
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateRing);
  })();

  // Expand ring + shrink dot on interactive elements
  const interactives = document.querySelectorAll('a, button, [data-magnetic], input, label');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-ring--hover');
      dot.classList.add('cursor-dot--hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-ring--hover');
      dot.classList.remove('cursor-dot--hover');
    });
  });
})();


/* ====================================================
   8. MAGNETIC BUTTONS
   Elements with [data-magnetic] gently attract to cursor.
   Desktop only.
   ==================================================== */
(function initMagnetic() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magnetics = document.querySelectorAll('[data-magnetic]');
  if (!magnetics.length) return;

  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect    = el.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.28;
      const dy = (e.clientY - centerY) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform  = 'translate(0,0)';
      // Reset transition after spring completes
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
})();


/* ====================================================
   9. PARTICLE FIELD (Canvas hero background)
   ~60 floating dots + proximity lines react to mouse.
   Desktop only; uses low DPR on small screens.
   ==================================================== */
(function initParticles() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W, H, particles;
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(W / 18), 70);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:       Math.random() * W,
        y:       Math.random() * H,
        vx:      (Math.random() - 0.5) * 0.35,
        vy:      (Math.random() - 0.5) * 0.35,
        r:       Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.35 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Gently repel from mouse
      const dx   = mouseX - p.x;
      const dy   = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        p.x -= dx * 0.018;
        p.y -= dy * 0.018;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,191,184,${p.opacity * 0.7})`;
      ctx.fill();

      // Draw connection lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx2  = p.x - q.x;
        const dy2  = p.y - q.y;
        const d2   = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(196,191,184,${0.07 * (1 - d2 / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    heroEl.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });
  }
})();




/* ====================================================
   12. HERO ENTRANCE CHOREOGRAPHY
   Staggered fade-in of avatar → name → role →
   subtitle → CTAs. Synced to loaderExit event.
   Skipped if prefers-reduced-motion is set.
   ==================================================== */
(function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [
    document.querySelector('.hero__avatar'),
    document.querySelector('.hero__name'),
    document.querySelector('.hero__role'),
    document.querySelector('.hero__subtitle'),
    document.querySelector('.hero__cta'),
  ].filter(Boolean);

  if (!targets.length) return;

  // Hide all immediately (before first paint)
  targets.forEach((el) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(32px)';
  });

  const delays = [0, 180, 380, 530, 700]; // ms after loader exits

  function startEntrance() {
    targets.forEach((el, i) => {
      setTimeout(() => {
        // Force browser to acknowledge the initial state
        el.getBoundingClientRect();
        el.style.opacity   = '';
        el.style.transform = '';
      }, delays[i]);
    });
  }

  // Wait for loader to dispatch its exit event
  document.addEventListener('loaderExit', startEntrance, { once: true });

  // Fallback: if loader somehow never fires, reveal after 2s
  setTimeout(() => {
    if (targets[0] && targets[0].style.opacity === '0') startEntrance();
  }, 2000);
})();


/* ====================================================
   13. SCRAMBLE TEXT
   [data-scramble] section headings split into .char
   spans. On scroll entry, chars scramble from random
   glyphs then resolve sequentially to real text.
   Skipped if prefers-reduced-motion is set.
   ==================================================== */
(function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('[data-scramble]');
  if (!targets.length) return;

  const CHARS     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const BR_MARKER = '\x00BR\x00';

  // Split a heading's text into individual .char <span>s
  // while preserving <br> elements.
  function splitHeading(el) {
    // Get inner HTML, normalise <br> variants to a marker
    let html = el.innerHTML;
    html = html.replace(/<br\s*\/?>/gi, BR_MARKER);
    // Strip remaining tags, collapse whitespace
    html = html.replace(/<[^>]+>/g, '');
    html = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, '\u00A0');

    const parts = html.split(BR_MARKER);
    el.innerHTML = '';

    const spans = [];
    parts.forEach((part, pi) => {
      for (const char of part.trim()) {
        if (char === '\n') return;
        const span = document.createElement('span');
        if (char === ' ' || char === '\u00A0') {
          span.className   = 'char char--space';
          span.textContent = '\u00A0';
        } else {
          span.className   = 'char';
          span.textContent = char;
        }
        el.appendChild(span);
        spans.push(span);
      }
      if (pi < parts.length - 1) {
        el.appendChild(document.createElement('br'));
      }
    });

    return spans;
  }

  // Store original chars per element
  const charMap = new Map();
  targets.forEach((el) => {
    const spans = splitHeading(el);
    charMap.set(el, { spans, originals: spans.map((s) => s.textContent) });
  });

  function runScramble(el) {
    const data = charMap.get(el);
    if (!data) return;
    const { spans, originals } = data;

    let frame = 0;
    const TOTAL = 28;

    function tick() {
      spans.forEach((span, i) => {
        const resolveAt = Math.floor(TOTAL * (i / spans.length)) + 4;
        if (frame >= resolveAt) {
          span.textContent = originals[i];
          span.classList.add('char--resolved');
        } else {
          const isSpace = originals[i] === '\u00A0';
          if (!isSpace) {
            span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
            span.classList.remove('char--resolved');
          }
        }
      });
      frame++;
      if (frame <= TOTAL + 4) requestAnimationFrame(tick);
    }

    tick();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runScramble(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ====================================================
   14. STATS COUNTERS
   .stat__number elements count up from 0 to their
   [data-target] value with cubic ease-out.
   Special [data-infinite] elements display ∞ with a
   pulse animation.
   ==================================================== */
(function initStats() {
  const statEls = document.querySelectorAll('.stat__number');
  if (!statEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        // Infinity stat — just pulse in
        if (el.dataset.infinite) {
          el.textContent = '\u221E';
          el.style.animation = 'stat-pop 0.6s var(--ease-out) both';
          return;
        }

        const targetVal = parseInt(el.dataset.target, 10);
        const suffix    = el.dataset.suffix || '';
        if (isNaN(targetVal)) return;

        const duration  = 1400;
        const startTime = performance.now();

        function update(now) {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * targetVal) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    },
    { threshold: 0.5 }
  );

  statEls.forEach((el) => observer.observe(el));
})();


/* ====================================================
   15. SCROLL-DRIVEN PARALLAX
   Hero orbs shift in depth as user scrolls, using the
   CSS `translate` property (separate from `transform`)
   so it composes with the existing CSS animation.
   Skipped if prefers-reduced-motion is set.
   ==================================================== */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  const rates = [0.06, 0.1, 0.04]; // scroll rate per orb

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const rate = rates[i] || 0.05;
      // `translate` CSS property — doesn't conflict with `transform` animation
      orb.style.translate = `0 ${scrollY * rate}px`;
    });
  }, { passive: true });
})();
