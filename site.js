/* site.js — shared nav/footer injection + utilities */
(function () {
  'use strict';

  /* ---- NAV HTML ---- */
  const NAV_HTML = `
<nav class="site-nav" id="siteNav" aria-label="Main navigation">
  <div class="nav-inner">
    <a class="nav-brand" href="/">
      <span class="lp-mark">Launchpad</span><span style="color:var(--txt-3);font-weight:400">×</span><span class="nv-mark">Nova</span>
    </a>
    <div class="nav-links">
      <a href="/launchpad.html">Launchpad</a>
      <a href="/nova.html">Nova OS</a>
      <a href="/how-it-works.html">How It Works</a>
      <a href="/pricing.html">Pricing</a>
      <a href="/about.html">About</a>
    </div>
    <div class="nav-ctas">
      <a href="/pricing.html" class="btn btn-outline btn-sm">Get Access</a>
      <a href="https://tally.so/r/xXQa95" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Book a Demo</a>
    </div>
    <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-mobile" id="navMobile" aria-hidden="true">
  <a href="/launchpad.html">Launchpad</a>
  <a href="/nova.html">Nova OS</a>
  <a href="/how-it-works.html">How It Works</a>
  <a href="/pricing.html">Pricing</a>
  <a href="/about.html">About</a>
  <a href="/contact.html">Contact</a>
  <a href="https://tally.so/r/xXQa95" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="margin-top:.5rem">Book a Demo</a>
</div>`;

  /* ---- FOOTER HTML ---- */
  const FOOTER_HTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <a class="nav-brand" href="/" style="font-size:1rem">
        <span class="lp-mark">Launchpad</span><span style="color:var(--txt-3);font-weight:400">×</span><span class="nv-mark">Nova</span>
      </a>
      <p>The AI Business OS for founders who want to build fast and scale smart.</p>
    </div>
    <div class="footer-col">
      <h5>Launchpad</h5>
      <a href="/tools/idea-validator.html">Idea Validator</a>
      <a href="/tools/pitch-generator.html">Pitch Generator</a>
      <a href="/tools/gtm-strategy-builder.html">GTM Strategy</a>
      <a href="/tools/kill-my-idea.html">Kill My Idea</a>
      <a href="/tools/funding-readiness-score.html">Funding Score</a>
      <a href="/launchpad.html">All Tools →</a>
    </div>
    <div class="footer-col">
      <h5>Nova OS</h5>
      <a href="/operations/crm-pipeline.html">CRM Pipeline</a>
      <a href="/operations/lead-capture.html">Lead Capture</a>
      <a href="/operations/automation-workflows.html">Automations</a>
      <a href="/operations/follow-up-booking.html">Follow-Up & Booking</a>
      <a href="/operations/client-onboarding.html">Client Onboarding</a>
      <a href="/nova.html">All Operations →</a>
    </div>
    <div class="footer-col">
      <h5>Company</h5>
      <a href="/how-it-works.html">How It Works</a>
      <a href="/pricing.html">Pricing</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
      <a href="/results.html">Results</a>
    </div>
    <div class="footer-col">
      <h5>Connect</h5>
      <a href="https://tally.so/r/xXQa95" target="_blank" rel="noopener">Book a Demo</a>
      <a href="https://calendar.app.google/syCyZmgeggCeuvPM8" target="_blank" rel="noopener">Schedule a Call</a>
      <a href="/contact.html">Get in Touch</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© <span id="footerYear"></span> NovaOps AI. All rights reserved.</p>
    <p>Built for founders. Powered by AI.</p>
  </div>
</footer>`;

  /* ---- INJECT NAV ---- */
  function injectNav() {
    const placeholder = document.getElementById('site-nav-placeholder');
    if (placeholder) {
      placeholder.outerHTML = NAV_HTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    }
  }

  /* ---- INJECT FOOTER ---- */
  function injectFooter() {
    const placeholder = document.getElementById('site-footer-placeholder');
    if (placeholder) {
      placeholder.outerHTML = FOOTER_HTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
    }
    const yr = document.getElementById('footerYear');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ---- NAV SCROLL STATE ---- */
  function initNavScroll() {
    const nav = document.getElementById('siteNav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- HAMBURGER ---- */
  function initHamburger() {
    const btn = document.getElementById('navHamburger');
    const menu = document.getElementById('navMobile');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    });
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ---- ACTIVE NAV LINK ---- */
  function markActiveLink() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
      const href = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (href === path || (href !== '/' && path.startsWith(href))) {
        a.classList.add('active');
      }
    });
  }

  /* ---- REVEAL ON SCROLL ---- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  /* ---- AI API CALL ---- */
  window.callAI = async function (systemPrompt, userMessage, outputEl, transformFn) {
    const API = 'https://launchpad-api.dpatel0729.workers.dev';
    outputEl.innerHTML = '<div class="spinner" style="margin:2rem auto"></div>';
    outputEl.style.display = 'block';
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: userMessage }],
          system: systemPrompt
        })
      });
      if (!res.ok) throw new Error('API error ' + res.status);
      const data = await res.json();
      const text = data?.content?.[0]?.text || data?.choices?.[0]?.message?.content || '';
      if (!text) throw new Error('Empty response');
      outputEl.innerHTML = transformFn ? transformFn(text) : `<div class="out-card"><p>${escHtml(text)}</p></div>`;
    } catch (err) {
      outputEl.innerHTML = `<div class="out-card"><div class="alert alert-red">Something went wrong. Please try again.</div></div>`;
      console.error(err);
    }
  };

  /* ---- MARKDOWN → HTML (lightweight) ---- */
  window.mdToHtml = function (md) {
    return md
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/^### (.+)$/gm,'<h4>$1</h4>')
      .replace(/^## (.+)$/gm,'<h3>$1</h3>')
      .replace(/^# (.+)$/gm,'<h2>$1</h2>')
      .replace(/^[-*] (.+)$/gm,'<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>')
      .replace(/\n\n+/g,'</p><p>')
      .replace(/^(?!<[h|u|l])/gm,'')
      .replace(/(<p><\/p>)+/g,'');
  };

  /* ---- ESCAPE HTML ---- */
  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  window.escHtml = escHtml;

  /* ---- INIT ---- */
  function init() {
    injectNav();
    injectFooter();
    initNavScroll();
    initHamburger();
    markActiveLink();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
