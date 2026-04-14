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
   3. HERO CANVAS — dot field
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const GOLD = "245,197,66";
  const COUNT = 100;
  const LINK  = 130;
  let mouse = { x: null, y: null };

  const resize = () => {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.r  = Math.random() * 1.8 + .8;
      this.vx = (Math.random() - .5) * .9;
      this.vy = (Math.random() - .5) * .9;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 100) { this.x += (dx / d) * .7; this.y += (dy / d) * .7; }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD},.55)`;
      ctx.fill();
    }
  }

  const dots = Array.from({ length: COUNT }, () => new Dot());

  const connect = () => {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${GOLD},${.14 * (1 - d / LINK)})`;
          ctx.lineWidth   = .8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  };

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => { d.update(); d.draw(); });
    connect();
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
