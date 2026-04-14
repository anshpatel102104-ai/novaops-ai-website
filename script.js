document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = mobileDrawer ? mobileDrawer.querySelectorAll('a') : [];
  const revealItems = document.querySelectorAll('.reveal');

  const setNavScrolled = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };

  const openDrawer = () => {
    if (!hamburger || !mobileDrawer) return;
    hamburger.classList.add('open');
    mobileDrawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!hamburger || !mobileDrawer) return;
    hamburger.classList.remove('open');
    mobileDrawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  };

  const toggleDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  };

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDrawer();
    });

    document.addEventListener('click', event => {
      const insideDrawer = mobileDrawer.contains(event.target);
      const onButton = hamburger.contains(event.target);
      if (!insideDrawer && !onButton && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) closeDrawer();
    });
  }

  if (revealItems.length) {
    revealItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(24px)';
      item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const bodyEl = item.querySelector('.faq-body');

      if (!trigger || !bodyEl) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        faqItems.forEach(other => {
          const otherBody = other.querySelector('.faq-body');
          other.classList.remove('open');
          if (otherBody) otherBody.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('open');
          bodyEl.style.maxHeight = bodyEl.scrollHeight + 'px';
        }
      });
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('.nav-links a, .mobile-drawer a');

  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('#')[0];
    if (cleanHref === currentPath || (currentPath === '' && cleanHref === 'index.html')) {
      link.classList.add('active');
    }
  });

  setNavScrolled();
  window.addEventListener('scroll', setNavScrolled);
});
