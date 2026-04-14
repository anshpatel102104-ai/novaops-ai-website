/* ─── NOVAOPS AI — script.js v5.0 ─── */

(function () {
  'use strict';

  /* ── NAV SCROLL STATE ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER / MOBILE DRAWER ── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on backdrop tap
    document.addEventListener('click', e => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    // Close on nav link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── INLINE REVEAL FOR FEATURE ROWS (not using .reveal class) ── */
  const inlineReveal = document.querySelectorAll('.feature-row, .about-story-row');
  if (inlineReveal.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    inlineReveal.forEach(el => io2.observe(el));
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all siblings in same container
      const parent = item.parentElement;
      parent.querySelectorAll('.faq-item.open').forEach(open => {
        if (open !== item) {
          open.classList.remove('open');
          open.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start    = performance.now();
    const isNum    = typeof target === 'number';
    const update   = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      if (isNum) {
        el.textContent = Math.round(target * ease) + (suffix || '');
      }
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const val    = parseInt(el.dataset.counter, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, val, suffix);
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => cio.observe(el));
  }

  /* ── FAQ SIDE NAV HIGHLIGHT (faq.html) ── */
  const faqNavItems = document.querySelectorAll('.faq-nav-item');
  const faqGroups   = document.querySelectorAll('.faq-group');
  if (faqNavItems.length && faqGroups.length) {
    const faqSIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          faqNavItems.forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    faqGroups.forEach(g => faqSIO.observe(g));
  }

  /* ── STAT PANEL CARD STAGGER (homepage) ── */
  const panels = document.querySelectorAll('.stat-panel-card');
  panels.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.06) + 's';
  });

  /* ── DROPDOWN NAV ── */

  // Desktop dropdowns — click to open/close
  document.querySelectorAll('.nav-drop-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const item   = btn.closest('.has-dropdown');
      const isOpen = item.classList.contains('open');

      // Close all first
      document.querySelectorAll('.has-dropdown').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.nav-drop-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close desktop dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.nav-drop-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Escape key closes all dropdowns
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.nav-drop-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mobile accordion dropdowns
  document.querySelectorAll('.mobile-drop-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const group  = btn.closest('.mobile-drop-group');
      const isOpen = group.classList.contains('open');
      document.querySelectorAll('.mobile-drop-group').forEach(g => g.classList.remove('open'));
      if (!isOpen) group.classList.add('open');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

})();
