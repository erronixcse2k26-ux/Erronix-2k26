/**
 * ErrONiX 2K26 Symposium - Cinematic Intro Video Loader Controller
 * Manages video playback synchronization, HUD progress updates,
 * audio/skip interaction, and smooth transition to the main website.
 */

(function () {
  'use strict';

  // Prevent duplicate execution within same frame
  if (window.__ERRONIX_VIDEO_LOADER_INIT__) return;
  window.__ERRONIX_VIDEO_LOADER_INIT__ = true;

  let loaderEl = null;
  let videoEl = null;
  let soundBtn = null;
  let skipBtn = null;
  let progressFill = null;
  let percentText = null;
  let timeText = null;
  let isFinished = false;
  let fallbackTimer = null;

  function initLoader() {
    loaderEl = document.getElementById('erronix-loader');
    if (!loaderEl) return;

    videoEl = document.getElementById('loader-intro-video');
    soundBtn = document.getElementById('loader-sound-btn');
    skipBtn = document.getElementById('loader-skip-btn');
    progressFill = document.getElementById('loader-progress-fill');
    percentText = document.getElementById('loader-progress-percent');
    timeText = document.getElementById('loader-time-display');

    // Lock page scrolling during intro video playback
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Setup video listeners
    if (videoEl) {
      // Ensure video is muted for reliable browser autoplay policy compliance
      videoEl.muted = true;
      videoEl.playsInline = true;

      // Autoplay attempt
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {
          // If browser policy blocked playback, retry on first user interaction
          const unlockPlay = function () {
            if (videoEl && !isFinished) {
              videoEl.play().catch(function () {});
            }
            window.removeEventListener('click', unlockPlay);
            window.removeEventListener('keydown', unlockPlay);
            window.removeEventListener('touchstart', unlockPlay);
          };
          window.addEventListener('click', unlockPlay, { once: true });
          window.addEventListener('keydown', unlockPlay, { once: true });
          window.addEventListener('touchstart', unlockPlay, { once: true });
        });
      }

      // Track playback progress
      videoEl.addEventListener('timeupdate', updateVideoProgress);

      // On video complete, smoothly transition to site
      videoEl.addEventListener('ended', function () {
        finishLoader();
      });

      // Video load error fallback
      videoEl.addEventListener('error', function () {
        finishLoader();
      });
    }

    // Sound toggle control
    if (soundBtn && videoEl) {
      soundBtn.addEventListener('click', toggleAudio);
    }

    // Skip Intro button
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        finishLoader();
      });
    }

    // Keyboard support: Escape or Space to skip
    window.addEventListener('keydown', handleKeydown);

    // Guaranteed fallback timer (9 seconds max: video is 8s)
    fallbackTimer = setTimeout(function () {
      if (!isFinished) {
        finishLoader();
      }
    }, 9500);
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function updateVideoProgress() {
    if (!videoEl || isFinished) return;

    const duration = videoEl.duration || 8;
    const currentTime = videoEl.currentTime || 0;
    const progress = Math.min(100, Math.max(0, (currentTime / duration) * 100));

    if (progressFill) {
      progressFill.style.width = progress.toFixed(1) + '%';
    }

    if (percentText) {
      percentText.textContent = Math.round(progress) + '%';
    }

    if (timeText) {
      timeText.textContent = formatTime(currentTime) + ' / ' + formatTime(duration);
    }
  }

  function toggleAudio(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!videoEl) return;

    videoEl.muted = !videoEl.muted;

    const iconOff = soundBtn.querySelector('.icon-sound-off');
    const iconOn = soundBtn.querySelector('.icon-sound-on');
    const btnText = soundBtn.querySelector('.btn-text');

    if (videoEl.muted) {
      if (iconOff) iconOff.style.display = 'block';
      if (iconOn) iconOn.style.display = 'none';
      if (btnText) btnText.textContent = 'Sound';
      soundBtn.style.borderColor = 'rgba(0, 242, 254, 0.4)';
    } else {
      if (iconOff) iconOff.style.display = 'none';
      if (iconOn) iconOn.style.display = 'block';
      if (btnText) btnText.textContent = 'Mute';
      soundBtn.style.borderColor = 'var(--vloader-gold)';
    }
  }

  function handleKeydown(e) {
    if (isFinished) return;
    if (e.key === 'Escape') {
      finishLoader();
    }
  }

  function finishLoader() {
    if (isFinished) return;
    isFinished = true;

    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    window.removeEventListener('keydown', handleKeydown);

    if (progressFill) {
      progressFill.style.width = '100%';
    }
    if (percentText) {
      percentText.textContent = '100%';
    }

    if (loaderEl) {
      loaderEl.classList.add('loader-finished');
      loaderEl.setAttribute('aria-busy', 'false');
    }

    // Smoothly restore document scrolling
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Dispatch entrance event for main page animation triggers
    try {
      window.dispatchEvent(new CustomEvent('erronixLoaderFinished'));
      window.dispatchEvent(new CustomEvent('erronix:loaderFinished'));
    } catch (err) {}

    // Complete cleanup after exit animation completes (750ms)
    setTimeout(function () {
      if (videoEl) {
        try {
          videoEl.pause();
        } catch (e) {}
      }
      if (loaderEl) {
        loaderEl.style.display = 'none';
      }
    }, 800);
  }

  // Self-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
