/**
 * ERRONIX 2K26 — Premium Futuristic Loading Animation Controller
 * Sequence: CODE -> CONVERGE -> LOGO REVEAL -> INITIALIZING -> WEBSITE REVEAL
 * Features:
 * - Full cinematic entrance animation for initial load and page opens
 * - Snappy link navigation loading transition across internal pages
 * - High-tech rapid theme calibration animation when switching Light / Dark mode
 * - Auto-DOM injection: works automatically on index, event details, and past season pages
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
  let statusText = null;
  let progressFill = null;
  let initDots = null;
  let taglineText = null;
  let skipBtn = null;

  let isExiting = false;
  let isThemeSwitching = false;
  let isNavigating = false;
  let startTime = 0;
  let minDisplayDuration = 1800; // default initial duration
  let maxSafetyTimeout = 2800;   // Safety cap
  let pageLoaded = false;
  let animationFrameId = null;

  // Particle & Streak System for Phase 2
  let particles = [];
  let isConverging = false;

  function getAssetBasePath() {
    try {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src || '';
        if (src.indexOf('loader.js') !== -1) {
          return src.substring(0, src.lastIndexOf('/') + 1);
        }
      }
    } catch (e) {}

    // Fallback based on URL pathname
    if (window.location.pathname.indexOf('/Technical-events/') !== -1 ||
        window.location.pathname.indexOf('/Non-technical-events/') !== -1) {
      return '../assets/';
    }
    return 'assets/';
  }

  function ensureLoaderDOM() {
    loaderEl = document.getElementById('erronix-loader');
    if (!loaderEl) {
      const basePath = getAssetBasePath();
      loaderEl = document.createElement('div');
      loaderEl.id = 'erronix-loader';
      loaderEl.setAttribute('role', 'status');
      loaderEl.setAttribute('aria-live', 'polite');
      loaderEl.setAttribute('aria-label', 'Loading ERRONIX 2K26');

      loaderEl.innerHTML = `
        <div class="loader-cyber-grid" aria-hidden="true"></div>
        <canvas id="loader-converge-canvas" aria-hidden="true"></canvas>
        <div id="loader-code-layer" class="loader-code-layer" aria-hidden="true"></div>

        <div class="loader-central-stage">
          <div id="loader-logo-pod" class="loader-logo-pod">
            <div class="loader-logo-aura" aria-hidden="true"></div>
            <div class="loader-logo-wrapper">
              <img src="${basePath}erronix-symbol-title.png" alt="ErrONiX 2K26 Logo" class="loader-logo-img">
              <div class="loader-scanline" aria-hidden="true"></div>
              <div class="loader-shimmer" aria-hidden="true"></div>
            </div>
          </div>

          <div id="loader-status-container" class="loader-status-container">
            <div class="loader-init-label">
              <span id="loader-status-text">INITIALIZING</span><span id="loader-init-dots" class="loader-init-dots">...</span>
            </div>
            <div class="loader-progress-track">
              <div id="loader-progress-fill" class="loader-progress-fill"></div>
            </div>
            <div class="loader-sub-tagline">
              <span class="loader-tagline-line"></span>
              <span id="loader-tagline-text">ERROR TO EXCELLENCE</span>
              <span class="loader-tagline-line"></span>
            </div>
          </div>
        </div>

        <button id="loader-skip-hint" class="loader-skip-hint" type="button" aria-label="Skip loading animation">
          SKIP [ESC]
        </button>
      `;

      if (document.body) {
        document.body.insertBefore(loaderEl, document.body.firstChild);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          if (!document.getElementById('erronix-loader')) {
            document.body.insertBefore(loaderEl, document.body.firstChild);
          }
        });
      }
    }

    // Ensure CSS stylesheet is present
    if (!document.querySelector('link[href*="loader.css"]')) {
      const basePath = getAssetBasePath();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = basePath + 'loader.css';
      document.head.appendChild(link);
    }

    cacheDOMElements();
  }

  function cacheDOMElements() {
    if (!loaderEl) loaderEl = document.getElementById('erronix-loader');
    if (!loaderEl) return;

    canvas = document.getElementById('loader-converge-canvas');
    codeLayer = document.getElementById('loader-code-layer');
    logoPod = document.getElementById('loader-logo-pod');
    statusContainer = document.getElementById('loader-status-container');
    statusText = document.getElementById('loader-status-text');
    progressFill = document.getElementById('loader-progress-fill');
    initDots = document.getElementById('loader-init-dots');
    taglineText = document.getElementById('loader-tagline-text');
    skipBtn = document.getElementById('loader-skip-hint');
  }

  function getNavType() {
    try {
      const navEntries = (window.performance && typeof performance.getEntriesByType === 'function')
        ? performance.getEntriesByType('navigation')
        : [];
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type;
      }
      if (window.performance && window.performance.navigation) {
        const legacy = window.performance.navigation.type;
        if (legacy === 1) return 'reload';
        if (legacy === 2) return 'back_forward';
        if (legacy === 0) return 'navigate';
      }
    } catch (e) {}
    return '';
  }

  function isHomePage() {
    try {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('technical-events') || p.includes('non-technical-events') || p.includes('past season') || p.includes('past%20season')) {
        return false;
      }
      return p.endsWith('/index.html') || p.endsWith('/') || p === '' || p.indexOf('index.html') !== -1;
    } catch (e) {
      return true;
    }
  }

  function shouldShowLoader() {
    try {
      const navType = getNavType();
      const isReload = navType === 'reload';
      const isBack = navType === 'back_forward';
      const hasLoadedBefore = !!(window.history && history.state && history.state.erronix_home_loaded);
      const isNavToHome = sessionStorage.getItem('erronix_nav_to_home') === 'true' ||
                          sessionStorage.getItem('erronix_back_from_event') === 'true';
      const hasSeenHome = sessionStorage.getItem('erronix_home_seen') === 'true';

      const referrer = (document.referrer || '').toLowerCase();
      const isInternalRef = referrer.indexOf('technical-events') !== -1 ||
                            referrer.indexOf('non-technical-events') !== -1 ||
                            referrer.indexOf('past season') !== -1 ||
                            referrer.indexOf('past%20season') !== -1;

      // Clear temporary nav-to-home flags so they don't persist into later reloads
      if (isNavToHome) {
        try {
          sessionStorage.removeItem('erronix_nav_to_home');
          sessionStorage.removeItem('erronix_back_from_event');
        } catch (e) {}
      }

      // If document was already marked as no-loader by head gatekeeper
      if (document.documentElement.classList.contains('no-loader')) {
        return false;
      }

      // Check if on home page
      if (isHomePage()) {
        // Skip animation on homepage if:
        // - returning back / forward
        // - navigated from an event page or other internal page
        // - already loaded in this history entry
        // - already visited in this session (and NOT an explicit reload)
        if (!isReload && (isBack || hasLoadedBefore || isNavToHome || isInternalRef || hasSeenHome)) {
          return false;
        }

        // Refresh on home page: ALWAYS show loader
        if (isReload) {
          minDisplayDuration = 1800;
          maxSafetyTimeout = 2800;
          return true;
        }

        // First time opening the link in this session: SHOW loader
        if (!hasSeenHome) {
          minDisplayDuration = 1800;
          maxSafetyTimeout = 2800;
          return true;
        }

        // Already visited home in this session without reload: DO NOT show loader
        return false;
      }

      // On other pages (event detail pages, past seasons, etc.):
      // NEVER show entrance loading animation when entering or viewing events
      return false;
    } catch (e) {
      return false;
    }
  }

  function dismissLoaderInstantly() {
    isExiting = true;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    cacheDOMElements();
    if (loaderEl) {
      loaderEl.classList.remove('loader-active', 'loader-theme-switch', 'loader-navigating');
      loaderEl.classList.add('loader-exit');
      loaderEl.style.display = 'none';
    }
    document.documentElement.style.overflow = '';
    if (document.body) document.body.style.overflow = '';

    if (isHomePage()) {
      try {
        sessionStorage.setItem('erronix_home_seen', 'true');
        if (window.history && history.replaceState) {
          const state = history.state || {};
          state.erronix_home_loaded = true;
          history.replaceState(state, '');
        }
      } catch (e) {}
    }

    try {
      window.dispatchEvent(new CustomEvent('erronixLoaderFinished'));
    } catch (e) {}
  }

  function init() {
    ensureLoaderDOM();

    if (!shouldShowLoader()) {
      dismissLoaderInstantly();
      return;
    }

    if (!loaderEl) return;

    isExiting = false;
    loaderEl.classList.remove('loader-exit', 'loader-exit-fast', 'loader-theme-switch', 'loader-navigating');
    loaderEl.classList.add('loader-active');
    loaderEl.style.display = 'flex';

    // Lock page scrolling during intro
    document.documentElement.style.overflow = 'hidden';
    if (document.body) document.body.style.overflow = 'hidden';

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
      if (e.key === 'Escape' && !isExiting && !isThemeSwitching) {
        finishLoader();
      }
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
  // PHASE 1: Code Fragments Layer (0 - 0.4s)
  // ==========================================================================
  let fragmentEls = [];

  function startPhase1CodeFragments() {
    if (!codeLayer) return;
    codeLayer.innerHTML = '';
    fragmentEls = [];

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 6 : 9;
    const shuffled = CODE_FRAGMENTS.slice(0).sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const positions = generatePerimeterPositions(count);

    selected.forEach((text, i) => {
      const el = document.createElement('div');
      el.className = 'loader-code-fragment';

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

      setTimeout(() => {
        if (!isExiting) {
          el.classList.add('active');
        }
      }, 40 + i * 35);
    });

    // Schedule Phase 2: Convergence at ~0.45s
    setTimeout(startPhase2Convergence, 450);
  }

  function generatePerimeterPositions(count) {
    const coords = [];
    const zones = [
      { x: [8, 25], y: [10, 22] },    // top-left
      { x: [70, 88], y: [10, 22] },   // top-right
      { x: [5, 20], y: [42, 58] },    // mid-left
      { x: [75, 90], y: [42, 58] },   // mid-right
      { x: [8, 25], y: [78, 88] },    // bottom-left
      { x: [70, 88], y: [78, 88] },   // bottom-right
      { x: [38, 58], y: [8, 16] },    // top-mid
      { x: [38, 58], y: [84, 92] }    // bottom-mid
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
  // PHASE 2: Code Convergence & Light Streaks (0.45s - 0.85s)
  // ==========================================================================
  function startPhase2Convergence() {
    if (isExiting) return;
    isConverging = true;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    fragmentEls.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      const deltaX = centerX - elX;
      const deltaY = centerY - elY;

      item.element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.12)`;
      item.element.classList.add('converging');
    });

    createConvergenceParticles(centerX, centerY);
    animateParticles();

    // Schedule Phase 3: Logo Reveal at ~0.85s
    setTimeout(startPhase3LogoReveal, 400);
  }

  function createConvergenceParticles(cx, cy) {
    const particleCount = window.innerWidth < 768 ? 18 : 30;
    particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const dist = Math.min(window.innerWidth, window.innerHeight) * (0.32 + Math.random() * 0.32);

      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        targetX: cx,
        targetY: cy,
        speed: 0.06 + Math.random() * 0.05,
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
      p.alpha -= 0.02;

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
  // PHASE 3: Logo Reveal
  // ==========================================================================
  function startPhase3LogoReveal() {
    if (isExiting || !logoPod) return;

    logoPod.classList.add('revealed');
    logoPod.classList.add('glitch-flash');

    setTimeout(() => {
      if (logoPod) logoPod.classList.remove('glitch-flash');
    }, 140);

    // Schedule Phase 4: Initializing & Progress
    setTimeout(startPhase4Initializing, 400);
  }

  // ==========================================================================
  // PHASE 4: INITIALIZING... & Progress Animation
  // ==========================================================================
  function startPhase4Initializing() {
    if (isExiting || !statusContainer) return;

    statusContainer.classList.add('active');

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
    }, 160);

    const progressDuration = Math.min(600, minDisplayDuration * 0.45);
    const progressStart = performance.now();

    function updateProgress(now) {
      if (isExiting) return;
      const elapsed = now - progressStart;
      const progress = Math.min(1, elapsed / progressDuration);
      
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

    // Safety fallback
    setTimeout(finishLoader, maxSafetyTimeout);
  }

  // ==========================================================================
  // PHASE 5: Website Reveal
  // ==========================================================================
  function finishLoader() {
    if (isExiting) return;
    isExiting = true;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    cacheDOMElements();
    if (loaderEl) {
      loaderEl.classList.remove('loader-active');
      loaderEl.classList.add('loader-exit');
    }

    // Restore page scrolling smoothly
    document.documentElement.style.overflow = '';
    if (document.body) document.body.style.overflow = '';

    if (isHomePage()) {
      try {
        sessionStorage.setItem('erronix_home_seen', 'true');
        if (window.history && history.replaceState) {
          const state = history.state || {};
          state.erronix_home_loaded = true;
          history.replaceState(state, '');
        }
      } catch (e) {}
    }

    try {
      window.dispatchEvent(new CustomEvent('erronixLoaderFinished'));
    } catch (e) {}

    setTimeout(() => {
      if (loaderEl && isExiting) {
        loaderEl.style.display = 'none';
        loaderEl.classList.remove('loader-exit');
      }
    }, 550);
  }

  // ==========================================================================
  // LIGHT / DARK MODE SWITCH LOADING ANIMATION (~650ms high-tech calibration)
  // ==========================================================================
  function switchTheme(targetTheme) {
    if (isThemeSwitching) return;
    isThemeSwitching = true;

    ensureLoaderDOM();
    cacheDOMElements();

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = targetTheme || (currentTheme === 'dark' ? 'light' : 'dark');

    // Prepare Theme Switch Mode
    loaderEl.classList.remove('loader-exit', 'loader-exit-fast', 'loader-navigating');
    loaderEl.classList.add('loader-active', 'loader-theme-switch');
    loaderEl.style.display = 'flex';

    if (statusText) {
      statusText.textContent = nextTheme === 'dark' ? 'SWITCHING TO DARK MODE' : 'SWITCHING TO LIGHT MODE';
    }
    if (taglineText) {
      taglineText.textContent = 'CALIBRATING INTERFACE';
    }
    if (progressFill) {
      progressFill.style.width = '0%';
    }
    if (logoPod) {
      logoPod.classList.add('revealed');
    }

    // Fast charge animation: 0% -> 100% in ~420ms
    const switchStart = performance.now();
    const switchDuration = 420;
    let themeApplied = false;

    function animateThemeSwitch(now) {
      const elapsed = now - switchStart;
      const progress = Math.min(1, elapsed / switchDuration);
      const eased = 1 - Math.pow(1 - progress, 2);
      const percent = Math.round(eased * 100);

      if (progressFill) {
        progressFill.style.width = percent + '%';
      }

      // Switch theme attribute midway while covered by cyber overlay
      if (progress >= 0.5 && !themeApplied) {
        themeApplied = true;
        document.documentElement.setAttribute('data-theme', nextTheme);
        try {
          localStorage.setItem('erronix-theme', nextTheme);
        } catch (e) {}

        // Notify any listeners
        window.dispatchEvent(new CustomEvent('erronix-theme-changed', {
          detail: { theme: nextTheme }
        }));
      }

      if (progress < 1) {
        requestAnimationFrame(animateThemeSwitch);
      } else {
        // Switch complete -> fast exit blur
        setTimeout(() => {
          loaderEl.classList.add('loader-exit-fast');
          setTimeout(() => {
            loaderEl.classList.remove('loader-active', 'loader-theme-switch', 'loader-exit-fast');
            loaderEl.style.display = 'none';
            if (statusText) statusText.textContent = 'INITIALIZING';
            if (taglineText) taglineText.textContent = 'ERROR TO EXCELLENCE';
            isThemeSwitching = false;
          }, 280);
        }, 80);
      }
    }

    requestAnimationFrame(animateThemeSwitch);
  }

  // ==========================================================================
  // LINK NAVIGATION TRANSITION ANIMATION
  // ==========================================================================
  function playLinkTransition(targetUrl, optionalLabel) {
    if (isNavigating) return;
    isNavigating = true;

    ensureLoaderDOM();
    cacheDOMElements();

    loaderEl.classList.remove('loader-exit', 'loader-exit-fast', 'loader-theme-switch');
    loaderEl.classList.add('loader-active', 'loader-navigating');
    loaderEl.style.display = 'flex';

    if (statusText) {
      statusText.textContent = optionalLabel || 'OPENING LINK';
    }
    if (taglineText) {
      taglineText.textContent = 'ERROR TO EXCELLENCE';
    }
    if (progressFill) {
      progressFill.style.width = '0%';
    }
    if (logoPod) {
      logoPod.classList.add('revealed');
    }

    // Quick surge on progress fill
    const navStart = performance.now();
    const navDuration = 240;

    function animateNavProgress(now) {
      const elapsed = now - navStart;
      const progress = Math.min(1, elapsed / navDuration);
      if (progressFill) {
        progressFill.style.width = Math.round(progress * 70) + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(animateNavProgress);
      } else {
        // Navigate
        sessionStorage.setItem('erronix_nav_from_link', 'true');
        window.location.href = targetUrl;
      }
    }

    requestAnimationFrame(animateNavProgress);

    // Fallback in case navigation is cancelled or delayed
    setTimeout(() => {
      isNavigating = false;
    }, 3000);
  }

  function isLinkToHomePage(link) {
    if (!link) return false;
    if (link.classList.contains('back-to-events-btn') || 
        link.id === 'backToEventsTop' || 
        link.hasAttribute('data-back-to-home')) {
      return true;
    }
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      return false;
    }

    // Direct relative path checks to homepage
    if (href === 'index.html' || href === './index.html' || href === '../index.html' ||
        href.startsWith('../index.html') || href.startsWith('./index.html') || href.startsWith('index.html#') ||
        href === '/' || href.startsWith('/#') || href === '../' || href.startsWith('../#')) {
      return true;
    }

    try {
      const targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.origin !== window.location.origin) return false;
      const p = targetUrl.pathname.toLowerCase();
      if (p.includes('technical-events') || p.includes('non-technical-events') || p.includes('past season') || p.includes('past%20season')) {
        return false;
      }
      return p.endsWith('/index.html') || p.endsWith('/') || p === '';
    } catch (e) {
      return href.indexOf('index.html') !== -1 || href.startsWith('../');
    }
  }

  function isInternalPageLink(a) {
    if (!a || !a.href) return false;
    const href = a.getAttribute('href') || '';
    if (!href) return false;
    
    // Any link leading to home should NOT use playLinkTransition
    if (isLinkToHomePage(a)) {
      return false;
    }

    // Skip hash anchors, javascript pseudo-protocols, tel, mailto
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      return false;
    }
    // Skip new tabs or download links
    if (a.target === '_blank' || a.hasAttribute('download')) {
      return false;
    }
    // Skip modal openers
    if (a.closest('#brochure-modal') || a.classList.contains('nav-register-btn') || a.hasAttribute('data-open-reg-modal')) {
      return false;
    }

    try {
      const targetUrl = new URL(a.href, window.location.href);
      // Cross-origin external links
      if (targetUrl.origin !== window.location.origin) return false;

      // Same page anchor (e.g. index.html#about when already on index.html)
      if (targetUrl.pathname.toLowerCase() === window.location.pathname.toLowerCase() && 
          targetUrl.search === window.location.search && targetUrl.hash) {
        return false;
      }

      // Check if target is an html page or directory
      const path = targetUrl.pathname.toLowerCase();
      if (path.endsWith('.pdf') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.webp')) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  // Global Click Delegate for Links & Theme Buttons
  document.addEventListener('click', function (e) {
    // 1. Theme Toggle Button Click
    const themeBtn = e.target.closest('#themeToggleBtn, #eventThemeToggle, #pastThemeToggle, .event-theme-toggle-btn');
    if (themeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      switchTheme(next);
      return;
    }

    // 2. Navigation to Home (Home button, Back to Events button, or any link to home)
    const link = e.target.closest('a');
    if (link) {
      if (isLinkToHomePage(link)) {
        try {
          sessionStorage.setItem('erronix_nav_to_home', 'true');
          sessionStorage.setItem('erronix_back_from_event', 'true');
          sessionStorage.removeItem('erronix_nav_from_link');
        } catch (err) {}
        // Allow immediate, natural browser navigation with NO loader overlay!
        return;
      }

      // Normal internal links (View Details, Pamphlet, etc.):
      // Do NOT trigger loading animation when entering view events or other pages!
      // Allow clean, immediate native browser navigation without delay or loader animation.
      return;
    }
  }, true);

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Handle Back-Forward Cache (bfcache) restore
  window.addEventListener('pageshow', function (event) {
    if (event.persisted || !shouldShowLoader()) {
      dismissLoaderInstantly();
    }
  });

  // Public Global API
  window.ErronixLoader = {
    show: function (options) {
      ensureLoaderDOM();
      cacheDOMElements();
      isExiting = false;
      loaderEl.classList.remove('loader-exit', 'loader-exit-fast');
      loaderEl.classList.add('loader-active');
      loaderEl.style.display = 'flex';
      if (options && options.title && statusText) {
        statusText.textContent = options.title;
      }
    },
    hide: finishLoader,
    switchTheme: switchTheme,
    playLinkTransition: playLinkTransition
  };

  // Run on DOM Ready or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
