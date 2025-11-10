
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

  // ====== 1) Hero (scoped)
  const hero = $(".hero");
  if (hero) {
    gsap.context(() => {
      gsap.from(".hero-content h1",{y:80,opacity:0,duration:1,ease:"power3.out"});
      gsap.from(".hero-content p",{y:50,opacity:0,delay:.1,duration:.8,ease:"power3.out"});
      gsap.from(".usp",{opacity:0,y:20,stagger:.1,delay:.25,duration:.5});
      gsap.from(".cta-buttons",{opacity:0,y:24,delay:.35,duration:.5});
      gsap.to(".hero",{
        scrollTrigger:{trigger:".hero",start:"bottom bottom",scrub:true},
        opacity:0.6,ease:"power1.inOut"
      });
    }, hero);
  }

  // ====== 2) Services (cards)
  const services = $$(".service");
  if (services.length) {
    services.forEach((el,i)=>{
      gsap.to(el,{
        scrollTrigger:{trigger:el,start:"top 85%"},
        opacity:1,y:0,duration:.7,delay:i*0.08,ease:"power2.out"
      });
    });
  }

  // ====== 3) About (scoped)
  const about = $(".about");
  if (about) {
    gsap.context(()=>{
      gsap.from(".about-text h2",{scrollTrigger:{trigger:about,start:"top 85%"}, y:50,opacity:0,duration:1,ease:"power3.out"});
      gsap.from($$(".about-text p"),{scrollTrigger:{trigger:about,start:"top 80%"}, y:40,opacity:0,stagger:.15,duration:.8,ease:"power3.out"});
      gsap.from(".stat",{scrollTrigger:{trigger:about,start:"top 78%"}, y:30,opacity:0,stagger:.12,duration:.7});
      gsap.from(".about-visual",{scrollTrigger:{trigger:about,start:"top 85%"}, x:80,opacity:0,duration:1});
    }, about);
  }

  // ====== 4) Company intro (scoped)
  const companyIntro = $(".company-intro");
  if (companyIntro) {
    gsap.context(()=>{
      const tl = gsap.timeline({ scrollTrigger:{ trigger:companyIntro, start:"top 80%", end:"bottom 40%", scrub:true }});
      tl.to(".intro-text",{ x:0,opacity:1,duration:1.2,ease:"power4.out" },0)
        .to(".intro-visual",{ x:0,opacity:1,duration:1.2,ease:"power4.out" },0)
        .to(".intro-visual img",{ rotateY:0, scale:1, duration:1.4, ease:"power4.out" },0.1);
      gsap.to(".intro-visual img",{ scrollTrigger:{ trigger:companyIntro, start:"top bottom", end:"bottom top", scrub:true }, yPercent:-15 });
    }, companyIntro);
  }

  // ====== 5) Reels (IntersectionObserver, no GSAP)
  const reelCards = $$(".reel");
  if (reelCards.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const el = entry.target; const vid = el.querySelector('video');
        if(entry.isIntersecting){
          el.classList.add('in');
          if(vid && vid.paused){ vid.play().catch(()=>{}); }
        }else{ if(vid && !vid.paused){ vid.pause(); } }
      });
    }, {threshold:0.22});
    reelCards.forEach(c=>io.observe(c));
  }

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

// Fade in + direction effect
gsap.utils.toArray(".proj-card").forEach((card, i) => {
  const direction = card.classList.contains("from-left") ? -80 :
                    card.classList.contains("from-right") ? 80 :
                    card.classList.contains("from-bottom") ? 0 : 0;
  const yOffset = card.classList.contains("from-bottom") ? 80 : 0;

  gsap.fromTo(card, 
    { opacity: 0, x: direction, y: yOffset },
    { 
      opacity: 1, x: 0, y: 0,
      duration: 1.2, ease: "power3.out",
      delay: i * 0.15,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
      }
    }
  );
});








gsap.registerPlugin(ScrollTrigger);

// USP Cards Fade-in
gsap.utils.toArray(".usp__card").forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: i * 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
    }
  });
});

// Teller animatie
const counters = document.querySelectorAll(".stat__number");
let counterTriggered = false;

ScrollTrigger.create({
  trigger: ".usp__stats",
  start: "top 80%",
  once: true,
  onEnter: () => {
    if (!counterTriggered) {
      counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let current = 0;
        const increment = target / 80; // snelheid van tellen
        const updateCount = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        updateCount();
      });
      counterTriggered = true;
    }
  }
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

gsap.from(".contact-left", {
  scrollTrigger: { trigger: ".contact-section", start: "top 85%" },
  x: -80,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from(".contact-right", {
  scrollTrigger: { trigger: ".contact-section", start: "top 85%" },
  x: 80,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
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

