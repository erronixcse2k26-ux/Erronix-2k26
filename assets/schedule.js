/**
 * ERRONIX 2K26 - EVENT SCHEDULE INTERACTIVITY
 * Supports accessible tab switching, keyboard navigation, and smooth panel transitions
 */
(function () {
  'use strict';

  function initScheduleTabs() {
    const tabButtons = document.querySelectorAll('.schedule-tab-btn');
    const tabPanels = document.querySelectorAll('.schedule-panel');

    if (!tabButtons.length || !tabPanels.length) return;

    function switchTab(targetBtn) {
      const targetPanelId = targetBtn.getAttribute('data-target');
      if (!targetPanelId) return;

      tabButtons.forEach(btn => {
        const isCurrent = btn === targetBtn;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        btn.setAttribute('tabindex', isCurrent ? '0' : '-1');
      });

      tabPanels.forEach(panel => {
        const isCurrent = panel.id === targetPanelId;
        panel.classList.toggle('active', isCurrent);
        if (isCurrent) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    }

    tabButtons.forEach((btn, index) => {
      // Click event
      btn.addEventListener('click', () => {
        switchTab(btn);
      });

      // Keyboard navigation (ARIA tabs pattern)
      btn.addEventListener('keydown', (e) => {
        let newIndex = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = tabButtons.length - 1;
        }

        if (newIndex !== null) {
          const nextBtn = tabButtons[newIndex];
          nextBtn.focus();
          switchTab(nextBtn);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScheduleTabs);
  } else {
    initScheduleTabs();
  }
})();
