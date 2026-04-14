document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = mobileDrawer ? mobileDrawer.querySelectorAll('a') : [];
  const revealItems = document.querySelectorAll('.reveal');

  const setNavScrolled = () => {
    if (!nav) return;
    if (window.scrollY > 12) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
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
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    });

    document.addEventListener('click', (event) => {
      const clickedInsideDrawer = mobileDrawer.contains(event.target);
      const clickedHamburger = hamburger.contains(event.target);

      if (!clickedInsideDrawer && !clickedHamburger && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeDrawer();
      }
    });
  }

  if (revealItems.length) {
    revealItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(18px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach(item => revealObserver.observe(item));
  }

  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const body = item.querySelector('.faq-body');

      if (!trigger || !body) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        faqItems.forEach(otherItem => {
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            if (otherBody) {
              otherBody.style.maxHeight = null;
            }
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          body.style.maxHeight = null;
        } else {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  setNavScrolled();
  window.addEventListener('scroll', setNavScrolled);

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
});
