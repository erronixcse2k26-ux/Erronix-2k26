/**
 * Erronix 2K26 - Module 06: Scroll Reveal Animations Engine
 * High-performance IntersectionObserver system.
 * Elements animate only once when entering viewport with staggered delays.
 */

(function () {
  'use strict';

  if (window.__ERRONIX_SCROLL_REVEAL_INIT__) return;
  window.__ERRONIX_SCROLL_REVEAL_INIT__ = true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initScrollReveal() {
    // If reduced motion is preferred, ensure all elements are immediately visible
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-slide-left, .reveal-slide-right, .reveal-scale-in, .reveal-stagger-group')
        .forEach(function (el) {
          el.classList.add('is-revealed');
        });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -45px 0px',
      threshold: 0.08
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Important: Animate only once, do not repeatedly animate on slight scrolls
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 1. SECTION HEADINGS (Fade-Up)
    const headings = document.querySelectorAll(`
      section h2,
      .about-title,
      .about-subtitle,
      .about-tag,
      .events-title-2k26,
      .events-subtitle-2k26,
      .coordinators-title,
      .gallery-header,
      .contact-section-title,
      .contact-subtitle
    `);
    headings.forEach(function (h) {
      if (!h.classList.contains('is-revealed')) {
        h.classList.add('reveal-fade-up');
        revealObserver.observe(h);
      }
    });

    // 2. ABOUT SECTION (Slide Left & Right)
    const aboutLeft = document.querySelector('.about-content-left');
    if (aboutLeft && !aboutLeft.classList.contains('is-revealed')) {
      aboutLeft.classList.add('reveal-slide-left');
      revealObserver.observe(aboutLeft);
    }

    const aboutRight = document.querySelector('.about-content-right');
    if (aboutRight && !aboutRight.classList.contains('is-revealed')) {
      aboutRight.classList.add('reveal-slide-right');
      revealObserver.observe(aboutRight);
    }

    const aboutHighlights = document.querySelectorAll('.highlight-item');
    aboutHighlights.forEach(function (item, idx) {
      if (!item.classList.contains('is-revealed')) {
        item.classList.add('reveal-fade-up');
        item.style.setProperty('--reveal-delay', `${idx * 0.08}s`);
        revealObserver.observe(item);
      }
    });

    // 3. EVENT CARDS (Fade-Up with Staggering)
    const eventCards = document.querySelectorAll(`
      .events-container-2k26,
      .events-tab-nav,
      .event-card-media,
      .calendar-card-2k26,
      .time-card
    `);
    eventCards.forEach(function (card, idx) {
      if (!card.classList.contains('is-revealed')) {
        card.classList.add('reveal-fade-up');
        card.style.setProperty('--reveal-delay', `${(idx % 4) * 0.09}s`);
        revealObserver.observe(card);
      }
    });

    // 4. RULES (Staggered Fade-Up)
    const rulesList = document.querySelector('.reg-rules-list');
    if (rulesList && !rulesList.classList.contains('is-revealed')) {
      rulesList.classList.add('reveal-stagger-group');
      revealObserver.observe(rulesList);
    }

    const ruleItems = document.querySelectorAll('.reg-rule-item');
    ruleItems.forEach(function (item, idx) {
      if (!item.classList.contains('is-revealed')) {
        item.classList.add('reveal-fade-up');
        item.style.setProperty('--reveal-delay', `${(idx % 6) * 0.08}s`);
        revealObserver.observe(item);
      }
    });

    // 5. REGISTRATION SECTION (Scale-in for QR & Fade-Up for Cards)
    const qrCard = document.querySelector('.qr-code-card');
    if (qrCard && !qrCard.classList.contains('is-revealed')) {
      qrCard.classList.add('reveal-scale-in');
      revealObserver.observe(qrCard);
    }

    const regCards = document.querySelectorAll('.registration-card-2k26, .registration-content-grid');
    regCards.forEach(function (rc) {
      if (!rc.classList.contains('is-revealed')) {
        rc.classList.add('reveal-fade-up');
        revealObserver.observe(rc);
      }
    });

    // 6. COORDINATORS (Scale-In for Lead & Staggered Fade-Up for Staff)
    const leadCoords = document.querySelectorAll('.coord-card-lead');
    leadCoords.forEach(function (lead) {
      if (!lead.classList.contains('is-revealed')) {
        lead.classList.add('reveal-scale-in');
        revealObserver.observe(lead);
      }
    });

    const staffCards = document.querySelectorAll('.single-staff-grid, .faculty-grid .coord-card-2k26');
    staffCards.forEach(function (staff, idx) {
      if (!staff.classList.contains('is-revealed')) {
        staff.classList.add('reveal-fade-up');
        staff.style.setProperty('--reveal-delay', `${(idx % 4) * 0.09}s`);
        revealObserver.observe(staff);
      }
    });

    const studentMarquee = document.querySelector('.coord-marquee-container');
    if (studentMarquee && !studentMarquee.classList.contains('is-revealed')) {
      studentMarquee.classList.add('reveal-fade-up');
      revealObserver.observe(studentMarquee);
    }

    // 7. CONTACT SECTION (Staggered Fade-Up)
    const contactCards = document.querySelectorAll(`
      .contact-info-card,
      .contact-card-link,
      .social-card-link
    `);
    contactCards.forEach(function (cc, idx) {
      if (!cc.classList.contains('is-revealed')) {
        cc.classList.add('reveal-fade-up');
        cc.style.setProperty('--reveal-delay', `${(idx % 5) * 0.08}s`);
        revealObserver.observe(cc);
      }
    });

    // 8. FOOTER (Fade-In & Fade-Up)
    const footer = document.querySelector('footer');
    if (footer && !footer.classList.contains('is-revealed')) {
      footer.classList.add('reveal-fade-in');
      revealObserver.observe(footer);
    }

    const footerBlocks = document.querySelectorAll('.footer-brand, .footer-links, .footer-bottom');
    footerBlocks.forEach(function (fb, idx) {
      if (!fb.classList.contains('is-revealed')) {
        fb.classList.add('reveal-fade-up');
        fb.style.setProperty('--reveal-delay', `${idx * 0.1}s`);
        revealObserver.observe(fb);
      }
    });
  }

  // Auto-boot on DOMContentLoaded or immediate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  // Also refresh after loader completion so elements in view are revealed
  window.addEventListener('erronixLoaderFinished', function () {
    setTimeout(initScrollReveal, 100);
  });

  // Expose global manager
  window.ErronixScrollReveal = {
    refresh: initScrollReveal
  };
})();
