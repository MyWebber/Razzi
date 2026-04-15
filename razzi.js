/**
 * RAZZI — razzi.js
 * Next-level: custom cursor · navbar · hero canvas · reveal · counters · magnetic
 */

/* ═══════════════════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════════════════ */
(function () {
  const cursor = document.getElementById("rCursor");
  const dot    = document.getElementById("rDot");
  if (!cursor || !dot) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  }, { passive: true });

  // Smooth lag for ring cursor
  (function lerp() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + "px";
    cursor.style.top  = cy + "px";
    requestAnimationFrame(lerp);
  })();

  // Hover grow on interactive elements
  const hoverEls = "a,button,[data-magnetic]";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverEls)) cursor.classList.add("r-cursor--hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverEls)) cursor.classList.remove("r-cursor--hover");
  });
})();


/* ═══════════════════════════════════════
   2. DOT NAV — actieve sectie bij scrollen
═══════════════════════════════════════ */
(function () {
  const items      = document.querySelectorAll(".rz-dot-nav__item");
  const sectionIds = ["home", "diensten", "portfolio", "contact"];
  const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!items.length || !sections.length) return;

  let current = "";

  const setActive = (id) => {
    if (id === current) return;
    current = id;
    items.forEach(item => {
      item.classList.toggle("rz-dot-nav__item--active", item.dataset.section === id);
    });
  };

  const update = () => {
    // Triggerlijn: 35% van boven in het scherm
    const trigger = window.innerHeight * 0.35;
    let activeId  = sections[0].id;

    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= trigger) {
        activeId = sec.id;
      }
    }
    setActive(activeId);
  };

  window.addEventListener("scroll", update, { passive: true });
  // Ook bij pagina-load meteen de juiste dot actief zetten
  document.addEventListener("DOMContentLoaded", update);
  update();
})();



/* ═══════════════════════════════════════
   3. HERO CANVAS — 3D gold wave flood
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let W, H;
  const resize = () => {
    W = canvas.width  = canvas.clientWidth;
    H = canvas.height = canvas.clientHeight;
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const COLS    = 52;   // horizontal grid resolution
  const ROWS    = 30;   // depth layers
  const FOV     = 500;  // perspective focal length
  const HORIZON = 0.48; // horizon as fraction of canvas height
  const SPEED   = 0.006; // wave travel speed — low = slow & majestic

  let phase = 0;

  // Perspective projection: 3D → 2D
  function project(x3d, y3d, z3d) {
    const s = FOV / (FOV + z3d);
    return { x: W / 2 + x3d * s, y: H * HORIZON + y3d * s };
  }

  // Wave height at given position (positive = peaks upward on screen)
  function waveH(xFrac, rowFrac) {
    const p   = phase;
    const amp = 100 * (0.2 + 0.8 * Math.pow(1 - rowFrac, 0.55));
    return (
      Math.sin(xFrac * Math.PI * 2.6 + rowFrac * 10   - p * 3.2) * 0.50 +
      Math.sin(xFrac * Math.PI * 5.1 + rowFrac * 16   - p * 4.8 + 1.5) * 0.28 +
      Math.sin(xFrac * Math.PI * 1.1 + rowFrac *  4.5 - p * 1.9 + 3.2) * 0.22
    ) * amp;
  }

  (function draw() {
    phase += SPEED;
    ctx.clearRect(0, 0, W, H);

    // Render back → front (painter's algorithm for correct depth layering)
    for (let row = ROWS - 1; row >= 0; row--) {
      const rf    = row / (ROWS - 1);       // 0 = front, 1 = back
      const z     = 60 + rf * 1200;         // 3D depth value
      const spanX = 1900 + rf * 800;        // perspective spread — wider toward horizon

      const pts = [];
      for (let col = 0; col <= COLS; col++) {
        const xf  = col / COLS;
        const x3d = (xf - 0.5) * spanX;
        const wh  = waveH(xf, rf);
        const p   = project(x3d, -wh, z);   // -wh: positive height = up on screen
        pts.push({ x: p.x, y: p.y, wh });
      }

      const depth  = 1 - rf;                // 0 = back, 1 = front
      const avgWH  = pts.reduce((s, p) => s + p.wh, 0) / pts.length;
      const normH  = Math.max(0, Math.min(1, (avgWH / 100 + 1) * 0.5)); // 0 = trough, 1 = crest

      // Fill wave body from crest surface down to canvas bottom
      ctx.beginPath();
      ctx.moveTo(pts[0].x, H);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[COLS].x, H);
      ctx.closePath();

      const r = Math.min(255, Math.round(170 + depth * 70 + normH * 15));
      const g = Math.min(255, Math.round(70  + depth * 130 + normH * 50));
      ctx.fillStyle = `rgba(${r},${g},0,${0.025 + depth * depth * 0.28})`;
      ctx.fill();

      // Wave crest highlight line
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = `rgba(255,215,0,${0.06 + depth * 0.38})`;
      ctx.lineWidth   = 0.3 + depth * 2.2;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  })();
})();


/* ═══════════════════════════════════════
   4. HERO REVEAL ANIMATIONS
═══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  // Badge + sub + actions + stats
  const simpleReveals = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  simpleReveals.forEach(el => revealObserver.observe(el));

  // Headline lines — wrap text in inner span for clip reveal
  document.querySelectorAll("[data-reveal-line]").forEach((line, i) => {
    const text = line.innerHTML;
    line.innerHTML = `<span class="rz-hero__line-inner" style="transition-delay:${.18 + i * .14}s">${text}</span>`;
    // Trigger after a tick
    setTimeout(() => {
      line.classList.add("is-visible");
    }, 120 + i * 80);
  });

  // Counters
  document.querySelectorAll(".rz-count").forEach(el => {
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }, { threshold: .5 });
    io.observe(el);
  });

});


/* ═══════════════════════════════════════
   5. MAGNETIC BUTTONS
═══════════════════════════════════════ */
(function () {
  document.querySelectorAll("[data-magnetic]").forEach(el => {
    const STRENGTH = 0.38;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * STRENGTH;
      const dy   = (e.clientY - cy) * STRENGTH;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();


/* ═══════════════════════════════════════
   6. DIENSTEN CARD REVEAL
═══════════════════════════════════════ */
(function () {
  const cards = document.querySelectorAll("[data-dienst-reveal]");
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();


/* ═══════════════════════════════════════
   7. CONTACT FORM
═══════════════════════════════════════ */
(function () {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation highlight
    let valid = true;
    form.querySelectorAll("[required]").forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = "rgba(255,80,80,.55)";
        valid = false;
        field.addEventListener("input", () => {
          field.style.borderColor = "";
        }, { once: true });
      }
    });
    if (!valid) return;

    // Simulate send
    const btn = form.querySelector(".rz-form__submit");
    btn.disabled = true;
    btn.querySelector(".rz-btn__label").textContent = "Versturen…";

    setTimeout(() => {
      btn.querySelector(".rz-btn__label").textContent = "Verstuurd ✓";
      success.textContent = "Bedankt! We nemen zo snel mogelijk contact met je op.";
      success.classList.add("show");
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.querySelector(".rz-btn__label").textContent = "Verstuur bericht";
        success.classList.remove("show");
      }, 5000);
    }, 1200);
  });
})();
