/**
 * ERRONIX 2K26 — Premium Futuristic Loading Animation Controller
 * Sequence: CODE -> CONVERGE -> LOGO REVEAL -> INITIALIZING -> WEBSITE REVEAL
 * Intelligent, responsive, zero-flash, respects Dark & Light modes.
 */

(function () {
  'use strict';

  if (window.__ERRONIX_LOADER_INITIALIZED__) return;
  window.__ERRONIX_LOADER_INITIALIZED__ = true;

  // Code fragments from specifications
  const CODE_FRAGMENTS = [
    '> initializing()',
    '> import { CSE }',
    '> system.boot();',
    '> const erronix = "2K26";',
    '> <code />',
    '> AI_CORE.initialize();',
    '> cyber.security.load();',
    '> ERROR → EXCELLENCE',
    '> neural.net.sync()',
    '> algo.optimize()',
    '> quantum.ready()',
    '> sys.mount("/erronix")'
  ];

  let loaderEl = null;
  let canvas = null;
  let ctx = null;
  let codeLayer = null;
  let logoPod = null;
  let statusContainer = null;
  let progressFill = null;
  let initDots = null;
  let skipBtn = null;

  let isExiting = false;
  let startTime = 0;
  let minDisplayDuration = 2000; // ~2.0s minimum to ensure all phases execute smoothly
  let maxSafetyTimeout = 3200;   // Safety cap
  let pageLoaded = false;
  let animationFrameId = null;

  // Particle & Streak System for Phase 2
  let particles = [];
  let isConverging = false;

  function init() {
    loaderEl = document.getElementById('erronix-loader');
    if (!loaderEl) return;

    canvas = document.getElementById('loader-converge-canvas');
    codeLayer = document.getElementById('loader-code-layer');
    logoPod = document.getElementById('loader-logo-pod');
    statusContainer = document.getElementById('loader-status-container');
    progressFill = document.getElementById('loader-progress-fill');
    initDots = document.getElementById('loader-init-dots');
    skipBtn = document.getElementById('loader-skip-hint');

    // Lock page scrolling during intro
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Setup canvas
    if (canvas) {
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    // Skip trigger
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        finishLoader();
      });
    }

    // Escape key to skip
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !isExiting) {
        finishLoader();
      }
    });

    // Allow user to click anywhere on loader to skip if in a rush
    loaderEl.addEventListener('click', function () {
      finishLoader();
    });

    // Track page load state
    startTime = performance.now();
    if (document.readyState === 'complete') {
      pageLoaded = true;
    } else {
      window.addEventListener('load', function () {
        pageLoaded = true;
      });
    }

    // Start Phase Sequence
    startPhase1CodeFragments();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ==========================================================================
  // PHASE 1: Code Fragments Layer (0 - 0.5s)
  // ==========================================================================
  let fragmentEls = [];

  function startPhase1CodeFragments() {
    if (!codeLayer) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 6 : 10;
    const shuffled = CODE_FRAGMENTS.slice(0).sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const positions = generatePerimeterPositions(count);

    selected.forEach((text, i) => {
      const el = document.createElement('div');
      el.className = 'loader-code-fragment';

      // Parse text for syntax highlighting
      let formatted = text;
      if (text.startsWith('> ')) {
        formatted = '<span class="token-sym">&gt;</span> ' + escapeHtml(text.slice(2));
      }
      if (formatted.includes('const ') || formatted.includes('import ')) {
        formatted = formatted.replace('const ', '<span class="token-keyword">const </span>')
                             .replace('import ', '<span class="token-keyword">import </span>');
      }
      if (formatted.includes('2K26') || formatted.includes('EXCELLENCE')) {
        formatted = formatted.replace('2K26', '<span class="token-highlight">2K26</span>')
                             .replace('EXCELLENCE', '<span class="token-highlight">EXCELLENCE</span>');
      }

      el.innerHTML = formatted + '<span class="token-cursor"></span>';

      const pos = positions[i];
      el.style.left = pos.x + '%';
      el.style.top = pos.y + '%';

      codeLayer.appendChild(el);
      fragmentEls.push({
        element: el,
        origX: pos.x,
        origY: pos.y
      });

      // Rapid staggered appearance
      setTimeout(() => {
        if (!isExiting) {
          el.classList.add('active');
        }
      }, 50 + i * 40);
    });

    // Schedule Phase 2: Convergence at ~0.55s
    setTimeout(startPhase2Convergence, 550);
  }

  function generatePerimeterPositions(count) {
    const coords = [];
    const isMobile = window.innerWidth < 768;
    
    // Spread evenly across top, left, right, bottom outer zones
    const zones = [
      { x: [8, 25], y: [10, 22] },    // top-left
      { x: [70, 88], y: [10, 22] },   // top-right
      { x: [5, 20], y: [42, 58] },    // mid-left
      { x: [75, 90], y: [42, 58] },   // mid-right
      { x: [8, 25], y: [78, 88] },    // bottom-left
      { x: [70, 88], y: [78, 88] },   // bottom-right
      { x: [38, 58], y: [8, 16] },    // top-mid
      { x: [38, 58], y: [84, 92] },   // bottom-mid
      { x: [12, 30], y: [26, 38] },   // upper-left
      { x: [68, 85], y: [26, 38] }    // upper-right
    ];

    for (let i = 0; i < count; i++) {
      const zone = zones[i % zones.length];
      const rx = zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]);
      const ry = zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]);
      coords.push({ x: rx, y: ry });
    }
    return coords;
  }

  // ==========================================================================
  // PHASE 2: Code Convergence & Light Streaks (0.55s - 1.1s)
  // ==========================================================================
  function startPhase2Convergence() {
    if (isExiting) return;
    isConverging = true;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Animate code fragments inward
    fragmentEls.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      const deltaX = centerX - elX;
      const deltaY = centerY - elY;

      item.element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.12)`;
      item.element.classList.add('converging');
    });

    // Create subtle convergence particles
    createConvergenceParticles(centerX, centerY);
    animateParticles();

    // Schedule Phase 3: Logo Reveal at ~1.1s
    setTimeout(startPhase3LogoReveal, 550);
  }

  function createConvergenceParticles(cx, cy) {
    const particleCount = window.innerWidth < 768 ? 20 : 36;
    particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const dist = Math.min(window.innerWidth, window.innerHeight) * (0.35 + Math.random() * 0.35);

      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        targetX: cx,
        targetY: cy,
        speed: 0.05 + Math.random() * 0.04,
        size: 1.5 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#e11d48' : '#ff7a00',
        alpha: 0.85
      });
    }
  }

  function animateParticles() {
    if (!ctx || !isConverging) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;
    particles.forEach((p) => {
      p.x += (p.targetX - p.x) * p.speed;
      p.y += (p.targetY - p.y) * p.speed;
      p.alpha -= 0.015;

      if (p.alpha > 0.05) {
        activeCount++;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;

    if (activeCount > 0 && !isExiting) {
      animationFrameId = requestAnimationFrame(animateParticles);
    } else {
      isConverging = false;
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ==========================================================================
  // PHASE 3: Logo Reveal (1.1s - 1.6s)
  // ==========================================================================
  function startPhase3LogoReveal() {
    if (isExiting || !logoPod) return;

    logoPod.classList.add('revealed');
    logoPod.classList.add('glitch-flash');

    // Remove glitch after 140ms so logo is 100% crisp and readable
    setTimeout(() => {
      if (logoPod) logoPod.classList.remove('glitch-flash');
    }, 150);

    // Schedule Phase 4: Initializing & Progress at ~1.6s
    setTimeout(startPhase4Initializing, 500);
  }

  // ==========================================================================
  // PHASE 4: INITIALIZING... & Progress Animation (1.6s - 2.2s)
  // ==========================================================================
  function startPhase4Initializing() {
    if (isExiting || !statusContainer) return;

    statusContainer.classList.add('active');

    // Dot cycling effect
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      if (isExiting) {
        clearInterval(dotInterval);
        return;
      }
      dotCount = (dotCount + 1) % 4;
      if (initDots) {
        initDots.textContent = '.'.repeat(dotCount);
      }
    }, 180);

    // Smooth Progress Bar fill (0% -> 100% over ~550ms)
    const progressDuration = 550;
    const progressStart = performance.now();

    function updateProgress(now) {
      if (isExiting) return;
      const elapsed = now - progressStart;
      const progress = Math.min(1, elapsed / progressDuration);
      
      // Smooth ease-out curve
      const eased = 1 - Math.pow(1 - progress, 2.5);
      const percent = Math.round(eased * 100);

      if (progressFill) {
        progressFill.style.width = percent + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        clearInterval(dotInterval);
        if (initDots) initDots.textContent = '...';
        
        // Check if page is ready or wait for min duration
        checkCompletion();
      }
    }

    requestAnimationFrame(updateProgress);
  }

  function checkCompletion() {
    const elapsed = performance.now() - startTime;
    const remainingTime = Math.max(0, minDisplayDuration - elapsed);

    setTimeout(() => {
      finishLoader();
    }, remainingTime);

    // Safety timeout fallback
    setTimeout(finishLoader, maxSafetyTimeout);
  }

  // ==========================================================================
  // PHASE 5: Website Reveal (2.2s+)
  // ==========================================================================
  function finishLoader() {
    if (isExiting) return;
    isExiting = true;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    if (loaderEl) {
      loaderEl.classList.add('loader-exit');
    }

    // Restore page scrolling smoothly
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Remove or hide overlay after fade-out transition finishes
    setTimeout(() => {
      if (loaderEl) {
        loaderEl.style.display = 'none';
      }
    }, 600);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
