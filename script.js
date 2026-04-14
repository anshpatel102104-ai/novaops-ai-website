/* ============================================================
   NOVAOPS AI — script.js
   Navigation · Mobile drawer · Scroll reveals · FAQ accordion
   Active link highlighting · Counter animations
   ============================================================ */

(function () {
  'use strict';

  // ─── Active nav link ───
  function setActiveLink() {
    const path = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const aPath = href.split('#')[0].replace(/\/$/, '');
      if (aPath && (path.endsWith(aPath) || (aPath === 'index.html' && (path === '' || path === '/')))) {
        a.classList.add('active');
      }
    });
  }
  setActiveLink();

  // ─── Sticky nav shadow on scroll ───
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ─── Hamburger / mobile drawer ───
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Scroll reveal (enhanced) ───
  const revealSelectors = '.reveal, .reveal-left, .reveal-right';
  const revealEls = document.querySelectorAll(revealSelectors);
  if (revealEls.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  // ─── Staggered grid children reveal ───
  document.querySelectorAll('.svc-card-grid, .service-module-grid, .grid-3, .grid-4, .results-grid').forEach(grid => {
    const children = Array.from(grid.children).filter(c => !c.classList.contains('reveal'));
    if (!children.length) return;
    const go = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          Array.from(e.target.children).forEach((child, i) => {
            if (!child.classList.contains('reveal')) {
              child.style.transitionDelay = (i * 80) + 'ms';
              child.classList.add('reveal');
              setTimeout(() => child.classList.add('visible'), 60 + i * 80);
            }
          });
          go.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    go.observe(grid);
  });

  // ─── FAQ accordion ───
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item   = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── Counter animation ───
  function animateCounter(el) {
    const raw   = el.dataset.counter || el.textContent;
    const match = raw.match(/[\d.]+/);
    if (!match) return;
    const end    = parseFloat(match[0]);
    const suffix = raw.replace(/[\d.]+/, '');
    const dur    = 1400;
    const start  = performance.now();
    function step(now) {
      const p  = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = end <= 10 ? (ease * end).toFixed(1) : Math.round(ease * end);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => co.observe(el));
  }

  // ─── Smooth anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
