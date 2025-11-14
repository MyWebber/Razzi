// ================================
// GSAP + ScrollTrigger registratie
// ================================
gsap.registerPlugin(ScrollTrigger);


// ================================
// 1. INTRO OVERLAY ANIMATIE
// ================================
const introTl = gsap.timeline();

// Text + logo animatie
introTl
  .to(".intro-text", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1.1,
    ease: "power3.out",
  })
  .to(".intro-logo", {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "drop-shadow(0 0 30px rgba(255,234,50,0.3))",
    duration: 1,
    ease: "power3.out",
  }, "-=0.6")
  .to(".intro-overlay", {
    opacity: 0,
    pointerEvents: "none",
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      document.querySelector(".intro-overlay").remove();
      document.body.classList.remove("intro-lock");
    }
  });











// ================================
// 1. HERO ANIMATIE
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // ===== Register once
  if (!gsap.core.globals().ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // ===== Utility: safe query & mm for reduced motion
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const mm = gsap.matchMedia();

  // ====== 0) Particle BG (safe)
  const canvas = document.getElementById('interactive-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const COUNT = 80, LINK_DIST = 120, COLOR = '255,234,50';
    let mouse = {x:null,y:null};

    const sizeCanvas = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    addEventListener('resize', sizeCanvas, {passive:true}); sizeCanvas();
    addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; }, {passive:true});

    class Particle{
      constructor(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.s=Math.random()*2+1; this.vx=(Math.random()-0.5)*1.3; this.vy=(Math.random()-0.5)*1.3; }
      step(){
        this.x+=this.vx; this.y+=this.vy;
        if(this.x<0||this.x>canvas.width) this.vx*=-1;
        if(this.y<0||this.y>canvas.height) this.vy*=-1;
        if(mouse.x!=null){
          const dx=this.x-mouse.x, dy=this.y-mouse.y, d=Math.hypot(dx,dy);
          if(d<120){ this.x+=(dx/d)*0.9; this.y+=(dy/d)*0.9; }
        }
      }
      draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=`rgba(${COLOR},.55)`; ctx.fill(); }
    }
    for(let i=0;i<COUNT;i++) particles.push(new Particle());

    function connect(){
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
          if(d<LINK_DIST){ ctx.strokeStyle=`rgba(${COLOR},.12)`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
        }
      }
    }
    (function loop(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.step(); p.draw();}); connect(); requestAnimationFrame(loop); })();
  }

















document.addEventListener("DOMContentLoaded", () => {
  const introSection = document.querySelector(".company-intro");
  if (!introSection) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          introSection.classList.add("in-view");
          io.unobserve(introSection); // maar één keer afspelen
        }
      });
    },
    { threshold: 0.25 }
  );

  io.observe(introSection);
});







  // ====== 6) Power-section (scoped & unique classes)
  const power = $("#power-section");
  if (power) {
    gsap.context(()=>{
      gsap.to(".power-orb",{ xPercent:15, yPercent:-20, scale:1.15, repeat:-1, yoyo:true, duration:10, ease:"power1.inOut" });
      const tl = gsap.timeline({ scrollTrigger:{ trigger:power, start:"top 80%", end:"bottom 50%", once:true }});
      tl.to("#power-section .headline span",{ opacity:1, y:0, stagger:.3, duration:1.1, ease:"power3.out" })
        .to("#power-section .power-text p",{ opacity:1, y:0, stagger:.2, duration:.9, ease:"power2.out" },"-=0.3")
        .to("#power-section .power-cta",{ opacity:1, y:0, duration:.9, ease:"back.out(1.6)" },"-=0.2");
    }, power);
  }







  // ====== 7) Glow follow (guarded)
  const glow = $(".glow-overlay");
  if (glow && glow.parentElement){
    document.addEventListener("mousemove",(e)=>{
      const rect = glow.parentElement.getBoundingClientRect();
      if(rect.width===0||rect.height===0) return;
      const x=e.clientX-rect.left, y=e.clientY-rect.top;
      glow.style.background=`radial-gradient(circle at ${x}px ${y}px, rgba(255,234,50,0.35), transparent 70%)`;
    }, {passive:true});
  }

  // ===== Respect reduced motion
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.globalTimeline.timeScale(0); // pauze animaties
    ScrollTrigger.getAll().forEach(st => st.disable());
  });

  // ===== Ensure triggers recalc after media load
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
});


















  document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#power-section");
  if (!section) return;

  gsap.registerPlugin(ScrollTrigger);

  // Achtergrond orb animatie
  gsap.to(".power-orb", {
    xPercent: 15,
    yPercent: -20,
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    duration: 10,
    ease: "power1.inOut",
  });

  // Gebruik gsap.context voor scope
  gsap.context(() => {

    // Basis animatie voor alle tekst
    const rightTexts = gsap.utils.toArray("#power-section .right-text p");

    rightTexts.forEach((p, i) => {
      gsap.fromTo(p,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: p,
            start: "top 90%",
            toggleActions: "play none none none",
          }
        }
      );
    });

    // Linker intro
    gsap.from("#power-section .left-intro", {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#power-section .left-intro",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // Divider
    gsap.from("#power-section .center-divider", {
      height: 0,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#power-section .center-divider",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // CTA
    gsap.from("#power-section .cta-box", {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: "#power-section .cta-box",
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });

  }, "#power-section");
});






















gsap.registerPlugin(ScrollTrigger);

// Fade-in van USP-kaarten
gsap.utils.toArray(".usp__card").forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 60 },
    {
      opacity: 1, y: 0,
      duration: 1.2, ease: "power3.out",
      delay: i * 0.15,
      scrollTrigger: {
        trigger: card,
        start: "top 85%"
      }
    }
  );
});

// Teller-animatie voor cijfers
const counters = document.querySelectorAll(".stat__number");
counters.forEach(counter => {
  let target = +counter.getAttribute("data-target");
  let triggered = false;

  ScrollTrigger.create({
    trigger: counter,
    start: "top 90%",
    onEnter: () => {
      if (!triggered) {
        triggered = true;
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power1.out"
        });
      }
    }
  });
});












gsap.registerPlugin(ScrollTrigger);

// Tekst fade-in van beide kanten
gsap.from(".approach-left", {
  scrollTrigger: { trigger: ".approach-section", start: "top 80%" },
  x: -80,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from(".approach-right", {
  scrollTrigger: { trigger: ".approach-section", start: "top 80%" },
  x: 80,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

// Individuele stappen
gsap.utils.toArray(".step").forEach((step, i) => {
  gsap.to(step, {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: i * 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: step,
      start: "top 85%"
    }
  });
});

// CTA fade
gsap.to(".cta-box", {
  scrollTrigger: { trigger: ".approach-section", start: "top 70%" },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power2.out"
});












gsap.registerPlugin(ScrollTrigger);

// Footer animatie – fade + slide up
gsap.from(".footer-container > div", {
  scrollTrigger: {
    trigger: ".footer",
    start: "top 85%",
  },
  y: 60,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
  stagger: 0.25
});

// Social icons - fade up staggered
gsap.from(".footer-socials a", {
  scrollTrigger: {
    trigger: ".footer-socials",
    start: "top 90%",
  },
  y: 20,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  stagger: 0.15
});

// Bottom copyright - delayed fade in
gsap.from(".footer-bottom", {
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 95%",
  },
  opacity: 0,
  y: 30,
  duration: 1.2,
  ease: "power3.out",
  delay: 0.3
});








gsap.registerPlugin(ScrollTrigger);

// Reset CSS blokkades
gsap.set(".mosaic-item", {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1
});

// ULTRA SNELLE SLIDE-IN
gsap.utils.toArray(".mosaic-item").forEach((item, i) => {

  const directions = [
    { x: -30, y: 0 }, // van links
    { x: 30, y: 0 },  // van rechts
    { x: 0, y: -30 }, // van boven
    { x: 0, y: 30 },  // van onder
  ];

  const dir = directions[i % directions.length];

  gsap.from(item, {
    opacity: 0,
    x: dir.x,
    y: dir.y,
    duration: 0.35, // SNEL
    ease: "power1.out", // SNEL
    scrollTrigger: {
      trigger: item,
      start: "top 92%",
      toggleActions: "play none none reverse"
    }
  });

});











document.addEventListener("DOMContentLoaded", () => {
  const vids = document.querySelectorAll("video");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    })
  }, { threshold: 0.4 });

  vids.forEach(v => observer.observe(v));
});


