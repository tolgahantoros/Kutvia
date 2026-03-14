/* ── JS ── */
'use strict';

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── Mobile menu ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
let menuScrollY = 0;

function lockBodyScroll() {
  menuScrollY = window.scrollY || window.pageYOffset || 0;
  if (menuScrollY > 0) window.scrollTo(0, 0);
  document.body.classList.add('menu-open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
}

function unlockBodyScroll() {
  document.body.classList.remove('menu-open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
  if (menuScrollY > 0) {
    window.scrollTo(0, menuScrollY);
  }
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  unlockBodyScroll();
}

hamburger.addEventListener('click', () => {
  const willOpen = !navLinks.classList.contains('open');
  hamburger.classList.toggle('active', willOpen);
  navLinks.classList.toggle('open', willOpen);
  hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  if (willOpen) {
    navLinks.scrollTop = 0;
    lockBodyScroll();
  }
  else unlockBodyScroll();
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    closeMobileMenu();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

/* ─── Scroll reveal ─── */
const aosEls = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.12 });
aosEls.forEach(el => observer.observe(el));

/* ─── Counter animation ─── */
function animateCount(el, target, duration = 1800) {
  const unit = el.dataset.unit || '';
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(ease * target) + unit;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + unit;
  };
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        animateCount(el, parseInt(el.dataset.target, 10));
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

/* ─── Contact form ─── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    span.textContent = 'Gönderiliyor...';
    btn.disabled = true;

    // Simulate send
    setTimeout(() => {
      span.textContent = '✓ Mesajınız Alındı!';
      btn.style.background = 'linear-gradient(135deg, #43E97B, #38F9D7)';
      form.reset();
      setTimeout(() => {
        span.textContent = 'Mesaj Gönder';
        btn.disabled = false;
        btn.style.background = '';
      }, 3500);
    }, 1200);
  });
}

/* ─── Smooth active nav link ─── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--text-primary)'
      : '';
  });
}, { passive: true });
