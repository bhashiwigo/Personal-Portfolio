/* BINARY RAIN (MATRIX EFFECT) */
(function () {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  let cols, drops;
  const CHAR = '01';
  const FONT_SIZE = 14;
  let animFrameId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / FONT_SIZE);
    drops = new Array(cols).fill(1);
  }

  function drawRain() {
    const isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? 'rgba(2,6,17,0.065)' : 'rgba(240,244,255,0.065)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = isDark ? 'rgba(0,245,255,0.6)' : 'rgba(0,150,180,0.4)';
    ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = CHAR[Math.floor(Math.random() * CHAR.length)];
      ctx.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE);

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    animFrameId = requestAnimationFrame(drawRain);
  }

  resize();
  drawRain();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); }, 200);
  });

  window._restartRain = function () {
    cancelAnimationFrame(animFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.fill(1);
    drawRain();
  };
})();

/* Restore preference */
const saved = localStorage.getItem('theme');
if (saved === 'light') applyTheme(false);


/* ACTIVE NAV ON SCROLL */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });


/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* SKILL BARS ANIMATE ON SCROLL */
function animateBars(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        bar.style.width = w + '%';
      });
      observer.unobserve(entry.target);
    }
  });
}

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  new IntersectionObserver(animateBars, { threshold: 0.25 }).observe(skillsSection);
}


/* FADE-UP ANIMATIONS ON SCROLL */
function addFadeTargets() {
  const targets = document.querySelectorAll(
    '.glass-card, .page-heading, .page-sub, .hero-text > *, .hero-image-wrap, .gallery-cat-card, .gallery-carousel, .featured-banner'
  );
  targets.forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  });
}

addFadeTargets();

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* GALLERY — SIMPLE AUTO SCROLL */
(function () {
  const track = document.getElementById('gallery-track');
  if (!track) return;
  let pos = 0;
  const slideW = track.children[0]?.offsetWidth + 4 || 354;
  const total = track.children.length;
  let paused = false;

  track.addEventListener('mouseenter', () => paused = true);
  track.addEventListener('mouseleave', () => paused = false);

  setInterval(() => {
    if (paused) return;
    pos = (pos + 1) % total;
    const maxOffset = slideW * (total - 3);
    const offset = Math.min(pos * slideW, maxOffset);
    track.style.transform = `translateX(-${offset}px)`;
    if (pos >= total - 3) pos = 0;
  }, 2500);
})();


/* TYPEWRITER EFFECT ON HERO GREETING */
(function () {
  const words = ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Tech Innovator'];
  const heroSub = document.querySelector('.hero-sub');
  if (!heroSub) return;
  const staticText = 'specializing in creating exceptional digital experiences.\nPassionate about building innovative solutions with modern technologies.';
  let wIndex = 0;
  let cIndex = 0;
  let deleting = false;

  // Only apply typewriter to the first line role title (add a span)
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  const roleSpan = document.createElement('div');
  roleSpan.style.cssText = `
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    color: var(--cyan);
    letter-spacing: 3px;
    min-height: 1.5rem;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  `;
  heroName.insertAdjacentElement('afterend', roleSpan);

  function type() {
    const word = words[wIndex];
    if (deleting) {
      cIndex--;
    } else {
      cIndex++;
    }

    roleSpan.textContent = word.substring(0, cIndex);

    let delay = deleting ? 60 : 110;

    if (!deleting && cIndex === word.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && cIndex === 0) {
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1000);
})();


/* CONTACT FORM — BASIC FEEDBACK */
const sendBtn = document.querySelector('.send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.glass-input');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#ff4d6d';
        setTimeout(() => input.style.borderColor = '', 1500);
      }
    });
    if (valid) {
      sendBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      sendBtn.style.background = 'linear-gradient(135deg, #00c897, #00f5c4)';
      setTimeout(() => {
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        sendBtn.style.background = '';
        inputs.forEach(input => (input.value = ''));
      }, 3000);
    }
  });
}


/* HEADER SCROLL EFFECT */
window.addEventListener('scroll', () => {
  const header = document.getElementById('main-header');
  if (window.scrollY > 20) {
    header.style.background = 'rgba(2,6,17,0.7)';
  } else {
    header.style.background = 'rgba(2,6,17,0.3)';
  }
}, { passive: true });


/* PROFILE IMAGE — LOAD FALLBACK */
['hero-img', 'about-img'].forEach(id => {
  const img = document.getElementById(id);
  if (img) {
    img.addEventListener('error', () => {
      img.src = `https://ui-avatars.com/api/?name=BW&background=020611&color=00f5ff&size=400&font-size=0.4&bold=true`;
    });
  }
});                                                                                                    