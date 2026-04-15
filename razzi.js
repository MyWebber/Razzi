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
   3. HERO CANVAS — vibe orbs
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const resize = () => {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Orb definitions — each floats in a slow sine-wave orbit
  const orbDefs = [
    { cx: .20, cy: .35, r: .38, color: "245,197,66",   a: .13, sx: .00018, sy: .00024, px: 0,    py: 1.2  },
    { cx: .72, cy: .55, r: .44, color: "245,197,66",   a: .10, sx: .00014, sy: .00019, px: 2.1,  py: 0.4  },
    { cx: .50, cy: .80, r: .30, color: "255,220,80",   a: .09, sx: .00021, sy: .00016, px: 4.3,  py: 2.8  },
    { cx: .85, cy: .20, r: .26, color: "255,255,200",  a: .07, sx: .00017, sy: .00022, px: 1.0,  py: 3.5  },
    { cx: .10, cy: .75, r: .20, color: "255,200,50",   a: .08, sx: .00023, sy: .00013, px: 3.7,  py: 0.9  },
    { cx: .60, cy: .15, r: .22, color: "245,197,66",   a: .07, sx: .00015, sy: .00020, px: 5.1,  py: 4.2  },
  ];

  // Tiny shimmer sparks
  const SPARK_COUNT = 55;
  const sparks = Array.from({ length: SPARK_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + .3,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * .0008 + .0003,
  }));

  let t = 0;
  let mouse = { x: .5, y: .5 };

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX / canvas.clientWidth;
    mouse.y = e.clientY / canvas.clientHeight;
  }, { passive: true });

  (function loop() {
    t++;
    const W = canvas.width, H = canvas.height;

    // Fade trail for silky motion blur
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.clearRect(0, 0, W, H);

    // Draw orbs
    orbDefs.forEach(o => {
      const mx = (mouse.x - .5) * .06;
      const my = (mouse.y - .5) * .06;
      const x  = (o.cx + Math.sin(t * o.sx * 1000 + o.px) * .18 + mx) * W;
      const y  = (o.cy + Math.cos(t * o.sy * 1000 + o.py) * .14 + my) * H;
      const r  = o.r * Math.min(W, H);

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,   `rgba(${o.color},${o.a})`);
      g.addColorStop(.45, `rgba(${o.color},${o.a * .5})`);
      g.addColorStop(1,   `rgba(${o.color},0)`);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Draw shimmer sparks
    sparks.forEach(s => {
      const pulse = (Math.sin(t * s.speed * 1000 + s.phase) + 1) * .5;
      const x = s.x * W;
      const y = s.y * H;
      const alpha = pulse * .45 + .05;
      ctx.beginPath();
      ctx.arc(x, y, s.r * pulse + .2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,197,66,${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
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
