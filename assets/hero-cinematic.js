/**
 * Erronix 2K26 - Module 02: Hero Cinematic Effect Controller
 * Coordinates the 1.5–1.9s entrance sequence and transitions into a calm state.
 */

(function () {
  'use strict';

  if (window.__ERRONIX_HERO_CINEMATIC_INIT__) return;
  window.__ERRONIX_HERO_CINEMATIC_INIT__ = true;

  function triggerHeroEntrance() {
    const heroSection = document.getElementById('home') || document.querySelector('.hero');
    if (!heroSection) return;

    // Small raf to ensure DOM is ready
    requestAnimationFrame(function () {
      heroSection.classList.add('hero-entered');
    });
  }

  function initHeroCinematic() {
    const loader = document.getElementById('erronix-loader');

    // If loader is present and visible, wait for completion
    if (loader && window.getComputedStyle(loader).display !== 'none' && !loader.classList.contains('loader-finished')) {
      window.addEventListener('erronixLoaderFinished', triggerHeroEntrance, { once: true });

      // Fallback timer: if loader event somehow doesn't fire within 3.5s, trigger entrance anyway
      setTimeout(triggerHeroEntrance, 3500);
    } else {
      // Direct load or loader already completed
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', triggerHeroEntrance);
      } else {
        triggerHeroEntrance();
      }
    }
  }

  initHeroCinematic();
})();
