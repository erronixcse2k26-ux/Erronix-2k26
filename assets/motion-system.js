/**
 * Erronix 2K26 - Module 01: Global Visual Motion System
 * Professional, unified motion controller:
 * - Ambient background floating micro-particles
 * - Scroll-based reveal with IntersectionObserver
 * - Interactive cursor-following card glow
 * - Gentle micro-parallax depth
 * - Respects prefers-reduced-motion & page visibility
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__ERRONIX_MOTION_SYSTEM_INIT__) return;
  window.__ERRONIX_MOTION_SYSTEM_INIT__ = true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Ambient Motion Layer & Floating Particles
     ========================================================================== */
  let particleCanvas = null;
  let particleCtx = null;
  let particleAnimId = null;
  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 16 : 28;

  function initAmbientBackground() {
    if (prefersReducedMotion) return;

    // Check or create ambient layer container
    let ambientLayer = document.getElementById('ambient-motion-layer');
    if (!ambientLayer) {
      ambientLayer = document.createElement('div');
      ambientLayer.id = 'ambient-motion-layer';
      ambientLayer.setAttribute('aria-hidden', 'true');

      // Ambient radial orbs
      ambientLayer.innerHTML = `
        <div class="ambient-orb ambient-orb-1"></div>
        <div class="ambient-orb ambient-orb-2"></div>
        <div class="ambient-orb ambient-orb-3"></div>
        <canvas id="ambient-particles-canvas"></canvas>
      `;

      // Insert at the very beginning of body
      document.body.insertBefore(ambientLayer, document.body.firstChild);
    }

    particleCanvas = document.getElementById('ambient-particles-canvas');
    if (!particleCanvas) return;
    particleCtx = particleCanvas.getContext('2d');
    if (!particleCtx) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize micro-particles
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }

    startParticleLoop();

    // Auto-pause when tab is hidden to conserve system resources
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopParticleLoop();
      } else {
        startParticleLoop();
      }
    });
  }

  function resizeCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticle(randomY) {
    const isGold = Math.random() > 0.65;
    return {
      x: Math.random() * (particleCanvas ? particleCanvas.width : window.innerWidth),
      y: randomY ? Math.random() * (particleCanvas ? particleCanvas.height : window.innerHeight) : (particleCanvas ? particleCanvas.height + 10 : window.innerHeight),
      size: Math.random() * 1.8 + 0.8,
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseOffset: Math.random() * Math.PI * 2,
      color: isGold ? '244, 196, 48' : '56, 189, 248'
    };
  }

  function startParticleLoop() {
    if (particleAnimId || prefersReducedMotion) return;

    function render() {
      if (!particleCtx || !particleCanvas) return;
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      const now = Date.now();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset if floated above screen
        if (p.y < -20) {
          particles[i] = createParticle(false);
          continue;
        }

        // Horizontal bounce wrap
        if (p.x < 0) p.x = particleCanvas.width;
        if (p.x > particleCanvas.width) p.x = 0;

        // Gentle sinusoidal twinkle
        const currentAlpha = Math.max(0.08, Math.min(0.65, p.alpha + Math.sin(now * p.pulseSpeed + p.pulseOffset) * 0.15));

        particleCtx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        particleCtx.fill();
      }

      particleAnimId = requestAnimationFrame(render);
    }

    particleAnimId = requestAnimationFrame(render);
  }

  function stopParticleLoop() {
    if (particleAnimId) {
      cancelAnimationFrame(particleAnimId);
      particleAnimId = null;
    }
  }

  /* ==========================================================================
     2. Scroll-Based Reveal System (IntersectionObserver)
     ========================================================================== */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // Immediate display for reduced-motion users
      document.querySelectorAll('.reveal-on-scroll, .reveal-stagger').forEach(function (el) {
        el.classList.add('reveal-visible');
      });
      return;
    }

    // Automatically select section headings, cards, and structured blocks
    const revealTargets = [
      '.hero-frame',
      '.about-content-left',
      '.about-content-right',
      '.about-feature-card',
      '.calendar-card-2k26',
      '.time-card',
      '.events-container-2k26',
      '.events-header-2k26',
      '.reg-rule-item',
      '.single-staff-grid',
      '.gallery-card',
      '.contact-info-card',
      '.contact-card-link',
      '.social-card-link',
      '.contact-social-header',
      '.gallery-header',
      '.registration-container',
      '.coordinators-container'
    ];

    const elementsToReveal = document.querySelectorAll(revealTargets.join(', '));

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elementsToReveal.forEach(function (el) {
      // Check if parent has stagger grid
      if (el.parentElement && (el.parentElement.classList.contains('gallery-grid') || 
                               el.parentElement.classList.contains('countdown-grid') ||
                               el.parentElement.classList.contains('staff-grid') ||
                               el.parentElement.classList.contains('rules-grid'))) {
        el.parentElement.classList.add('reveal-stagger');
        revealObserver.observe(el.parentElement);
      } else {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
      }
    });
  }

  /* ==========================================================================
     3. Interactive Card Cursor-Following Glow
     ========================================================================== */
  function initInteractiveCards() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const cardSelectors = [
      '.hero-frame',
      '.calendar-card-2k26',
      '.time-card',
      '.contact-info-card',
      '.single-staff-grid',
      '.gallery-card',
      '.about-feature-card',
      '.modal-content'
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));

    cards.forEach(function (card) {
      card.classList.add('interactive-card');

      card.addEventListener('pointermove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }

  /* ==========================================================================
     4. Gentle Micro-Parallax Depth
     ========================================================================== */
  function initParallaxDepth() {
    if (prefersReducedMotion || window.innerWidth < 768) return;

    let ticking = false;
    const heroTitle = document.querySelector('.hero-main-title');
    const heroBadge = document.querySelector('.hero-symposium-badge');
    const ambientOrb1 = document.querySelector('.ambient-orb-1');
    const ambientOrb2 = document.querySelector('.ambient-orb-2');

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollY = window.pageYOffset;

          // Only compute for top portion of page to preserve performance
          if (scrollY < 900) {
            if (heroTitle) {
              heroTitle.style.transform = `translateY(${scrollY * 0.08}px)`;
            }
            if (heroBadge) {
              heroBadge.style.transform = `translateY(${scrollY * 0.04}px)`;
            }
            if (ambientOrb1) {
              ambientOrb1.style.transform = `translateY(${scrollY * 0.12}px)`;
            }
            if (ambientOrb2) {
              ambientOrb2.style.transform = `translateY(${scrollY * -0.08}px)`;
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     Bootstrap Motion System
     ========================================================================== */
  function bootMotionSystem() {
    initAmbientBackground();
    initScrollReveal();
    initInteractiveCards();
    initParallaxDepth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootMotionSystem);
  } else {
    bootMotionSystem();
  }

  // Also re-check when loading animation completes
  window.addEventListener('erronixLoaderFinished', function () {
    initScrollReveal();
  });
})();
