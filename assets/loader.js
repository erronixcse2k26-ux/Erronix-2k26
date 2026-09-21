/**
 * Erronix 2K26 Symposium - Cinematic Opening & Loading Animation
 * Isolated component controller with real asset sync, smooth dual-tone ring,
 * and lightweight canvas circuit particles.
 */

(function () {
  'use strict';

  // Prevent double initialization
  if (window.__ERRONIX_LOADER_INIT__) return;
  window.__ERRONIX_LOADER_INIT__ = true;

  const CONFIG = {
    minDisplayTimeMs: 1800, // 1.8 seconds baseline for smooth cinematic pacing
    maxTimeoutMs: 5000,     // Fallback guarantee: never keep user waiting more than 5s
    canvasParticleCount: window.innerWidth < 768 ? 24 : 42,
  };

  let startTime = performance.now();
  let isWindowLoaded = false;
  let isFontsLoaded = false;
  let currentProgress = 5;
  let targetProgress = 15;
  let animFrameId = null;
  let canvasAnimId = null;

  // DOM Elements
  let loaderEl = null;
  let ringBar = null;
  let progressFill = null;
  let percentText = null;
  let statusText = null;
  let canvasEl = null;
  let canvasCtx = null;
  let milestoneNodes = [];

  function initLoader() {
    loaderEl = document.getElementById('erronix-loader');
    if (!loaderEl) return;

    ringBar = document.getElementById('loader-ring-bar');
    progressFill = document.getElementById('loader-progress-fill');
    percentText = document.getElementById('loader-percent-text');
    statusText = document.getElementById('loader-status-text');
    canvasEl = document.getElementById('loader-canvas');
    milestoneNodes = Array.from(document.querySelectorAll('.milestone-node'));

    // Lock body scrolling during loading screen
    document.body.style.overflow = 'hidden';

    // SVG Ring stroke preparation
    if (ringBar) {
      const radius = parseFloat(ringBar.getAttribute('r') || '120');
      const circumference = 2 * Math.PI * radius;
      ringBar.style.strokeDasharray = `${circumference} ${circumference}`;
      ringBar.style.strokeDashoffset = `${circumference}`;
      ringBar.__circumference = circumference;
    }

    // Init Lightweight Background Canvas
    initCanvas();

    // Setup real asset loading listeners
    setupLoadingListeners();

    // Start Animation & Progress Loop
    animFrameId = requestAnimationFrame(updateProgressLoop);
  }

  function setupLoadingListeners() {
    // Check initial document state
    if (document.readyState === 'complete') {
      isWindowLoaded = true;
    } else {
      window.addEventListener('load', function () {
        isWindowLoaded = true;
      }, { once: true });
    }

    // Check fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        isFontsLoaded = true;
      }).catch(function () {
        isFontsLoaded = true;
      });
    } else {
      isFontsLoaded = true;
    }

    // Interactive state advancement
    document.addEventListener('readystatechange', function () {
      if (document.readyState === 'interactive') {
        targetProgress = Math.max(targetProgress, 55);
      } else if (document.readyState === 'complete') {
        targetProgress = Math.max(targetProgress, 85);
      }
    });
  }

  function getRealProgress() {
    let score = 20; // Initial execution
    if (document.readyState === 'interactive') score += 35;
    if (document.readyState === 'complete') score += 25;
    if (isWindowLoaded) score += 10;
    if (isFontsLoaded) score += 10;
    return Math.min(score, 100);
  }

  function updateProgressLoop(now) {
    const elapsed = now - startTime;
    const realProgress = getRealProgress();

    // Natural progress calculation based on both real resources and minimum smooth display time
    const timeProgress = (elapsed / CONFIG.minDisplayTimeMs) * 100;
    const isReady = (isWindowLoaded && isFontsLoaded) || (elapsed >= CONFIG.maxTimeoutMs);

    if (isReady && elapsed >= CONFIG.minDisplayTimeMs) {
      targetProgress = 100;
    } else if (isReady) {
      // Accelerate smoothly towards 100% as elapsed approaches minDisplayTimeMs
      targetProgress = Math.max(realProgress, Math.min(timeProgress, 99));
    } else {
      // Naturally pace between realProgress and timeProgress, capping at 92% until ready
      targetProgress = Math.min(92, Math.max(realProgress * 0.9, timeProgress * 0.9));
    }

    // Smooth lerp (interpolation)
    const lerpSpeed = targetProgress >= 100 ? 0.15 : 0.08;
    currentProgress += (targetProgress - currentProgress) * lerpSpeed;

    if (targetProgress === 100 && currentProgress >= 99.4) {
      currentProgress = 100;
    }

    renderProgress(currentProgress);

    // Sequence stages
    updateSequencePhases(currentProgress);

    if (currentProgress < 100) {
      animFrameId = requestAnimationFrame(updateProgressLoop);
    } else {
      // Completed! Hold at 100% for a brief 180ms pulse then smoothly transition into site
      renderProgress(100);
      updateSequencePhases(100);
      setTimeout(finishLoader, 220);
    }
  }

  function renderProgress(pct) {
    const rounded = Math.min(100, Math.floor(pct));

    // Circular ring progress
    if (ringBar && ringBar.__circumference) {
      const offset = ringBar.__circumference - (pct / 100) * ringBar.__circumference;
      ringBar.style.strokeDashoffset = `${offset}`;
    }

    // Horizontal pill progress fill
    if (progressFill) {
      progressFill.style.width = `${pct}%`;
    }

    // Percentage number text
    if (percentText) {
      percentText.textContent = `${rounded}%`;
    }

    // Milestone indicators
    if (milestoneNodes.length > 0) {
      if (pct >= 15) milestoneNodes[0]?.classList.add('active');
      if (pct >= 40) milestoneNodes[1]?.classList.add('active');
      if (pct >= 68) milestoneNodes[2]?.classList.add('active');
      if (pct >= 92) milestoneNodes[3]?.classList.add('active');
    }

    // Dynamic Slogan Update
    if (statusText) {
      if (pct >= 90) {
        statusText.textContent = 'LOADING A BRIGHTER TOMORROW...';
        statusText.classList.add('pulse');
      } else if (pct >= 60) {
        statusText.textContent = 'INITIALIZING SYSTEM ARCHITECTURE...';
      } else if (pct >= 25) {
        statusText.textContent = 'SYNCHRONIZING PHOENIX PROTOCOL...';
      } else {
        statusText.textContent = 'CONNECTING TO ERRonIX 2K26...';
      }
    }
  }

  function updateSequencePhases(pct) {
    if (!loaderEl) return;

    loaderEl.classList.remove('phase-0-20', 'phase-20-60', 'phase-60-90', 'phase-90-100');

    if (pct < 20) {
      loaderEl.classList.add('phase-0-20');
    } else if (pct < 60) {
      loaderEl.classList.add('phase-20-60');
    } else if (pct < 90) {
      loaderEl.classList.add('phase-60-90');
    } else {
      loaderEl.classList.add('phase-90-100');
    }
  }

  function finishLoader() {
    if (!loaderEl) return;

    // Trigger smooth fade & subtle zoom exit
    loaderEl.classList.add('loader-finished');

    // Cleanly restore scroll & remove from interaction flow
    setTimeout(function () {
      document.body.style.overflow = '';
      loaderEl.style.display = 'none';

      // Terminate canvas loop
      if (canvasAnimId) {
        cancelAnimationFrame(canvasAnimId);
        canvasAnimId = null;
      }

      // Notify any external listeners
      try {
        window.dispatchEvent(new CustomEvent('erronixLoaderFinished'));
      } catch (e) {}
    }, 700);
  }

  /* ==========================================================================
     Lightweight Canvas Particles & Circuit Lines
     ========================================================================== */
  function initCanvas() {
    if (!canvasEl) return;
    canvasCtx = canvasEl.getContext('2d');
    if (!canvasCtx) return;

    let width = (canvasEl.width = window.innerWidth);
    let height = (canvasEl.height = window.innerHeight);

    window.addEventListener('resize', function () {
      if (!loaderEl || loaderEl.style.display === 'none') return;
      width = canvasEl.width = window.innerWidth;
      height = canvasEl.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const centerX = width / 2;
    const centerY = height * 0.38;

    for (let i = 0; i < CONFIG.canvasParticleCount; i++) {
      const isGold = Math.random() > 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: isGold ? 'rgba(244, 196, 48, ' : 'rgba(56, 189, 248, ',
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        orbitDist: Math.random() * 280 + 80,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.008
      });
    }

    function renderCanvas() {
      if (!canvasCtx) return;
      canvasCtx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.36;

      // Draw subtle inward particle drift
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbit around center gently
        p.orbitAngle += p.orbitSpeed;
        p.orbitDist -= 0.12; // Slow convergence toward center
        if (p.orbitDist < 60) {
          p.orbitDist = Math.random() * 150 + 220;
          p.orbitAngle = Math.random() * Math.PI * 2;
        }

        const targetX = cx + Math.cos(p.orbitAngle) * p.orbitDist;
        const targetY = cy + Math.sin(p.orbitAngle) * (p.orbitDist * 0.85);

        p.x += (targetX - p.x) * 0.05;
        p.y += (targetY - p.y) * 0.05;

        // Alpha pulsing
        p.alpha += Math.sin(Date.now() * p.pulseSpeed * 0.1) * 0.01;
        const currentAlpha = Math.max(0.1, Math.min(0.75, p.alpha));

        canvasCtx.fillStyle = `${p.color}${currentAlpha})`;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        canvasCtx.fill();

        // Connect nearby nodes with faint digital circuit traces
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 75) {
            canvasCtx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 75)})`;
            canvasCtx.lineWidth = 0.6;
            canvasCtx.beginPath();
            // Orthogonal circuit lines look
            if (dist < 40) {
              canvasCtx.moveTo(p.x, p.y);
              canvasCtx.lineTo(p2.x, p2.y);
            } else {
              canvasCtx.moveTo(p.x, p.y);
              canvasCtx.lineTo(p.x, p2.y);
              canvasCtx.lineTo(p2.x, p2.y);
            }
            canvasCtx.stroke();
          }
        }
      }

      canvasAnimId = requestAnimationFrame(renderCanvas);
    }

    canvasAnimId = requestAnimationFrame(renderCanvas);
  }

  // Auto-boot when script evaluates or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
