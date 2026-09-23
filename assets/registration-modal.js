/**
 * ============================================================================
 * ERRONIX '26 - SYMPOSIUM REGISTRATION SYSTEM
 * ============================================================================
 * Centralized Google Forms Configuration and Reusable Registration Modal
 * Department of Computer Science & Engineering, UCE Arni
 */

(function () {
  'use strict';

  /**
   * ==========================================================================
   * 1. GOOGLE FORM URL MAPPING CONFIGURATION
   * ==========================================================================
   * All 8 event registration Google Form links are centralized here.
   * To update or replace any form link, simply modify the URL string below.
   */
  const eventRegistrationLinks = {
    technical: {
      "Paper Presentation": "https://forms.gle/X83FPfV5QVq28Jk76",
      "CyberQuest": "https://forms.gle/Un178iXk3dxmkWv2A",
      "Prompt War": "https://forms.gle/u4Xg56BCpvg52vfq5",
      "Code Relay": "https://forms.gle/UnZjGKtgFVQtXmhs7"
    },
    nonTechnical: {
      "Treasure Hunt": "https://forms.gle/u8Pa6pHeZsrceCV38",
      "Mystery Box": "https://forms.gle/xccPRxSQYrMr9pXw5",
      "Act & Guess": "https://forms.gle/KAswRZVvA8Dg6G8y7",
      "IPL Auction": "https://forms.gle/DpgbULrUvpsjUJDK6"
    }
  };

  /**
   * Event metadata with display names and aliases for automatic preselection
   */
  const EVENT_REGISTRATION_DATA = {
    technical: [
      {
        key: "Paper Presentation",
        displayName: "Paper Presentation (TechTalkX)",
        aliases: ["paper-presentation", "paperpresentation", "techtalkx", "tech_talkz", "paper presentation", "techtalkx – paper presentation"]
      },
      {
        key: "Code Relay",
        displayName: "Code Relay",
        aliases: ["code-relay", "coderelay", "code_relay", "code relay"]
      },
      {
        key: "Prompt War",
        displayName: "AI Prompt War",
        aliases: ["prompt-war", "promptwar", "ai prompt war", "prompt_war", "prompt war"]
      },
      {
        key: "CyberQuest",
        displayName: "CyberQuest",
        aliases: ["cyber-quest", "cyberquest", "cyber_quest", "cyber quest"]
      }
    ],
    nonTechnical: [
      {
        key: "Act & Guess",
        displayName: "Act & Guess",
        aliases: ["act-and-guess", "act&guess", "act_guess", "act and guess", "act & guess"]
      },
      {
        key: "Treasure Hunt",
        displayName: "Treasure Hunt",
        aliases: ["treasure-hunt", "treasurehunt", "tresure_hunt", "tresure hunt", "treasure hunt"]
      },
      {
        key: "Mystery Box",
        displayName: "Mystery Box Challenge",
        aliases: ["mystery-box", "mysterybox", "mystrey_box", "mystrey box", "mystery box", "mystery box challenge"]
      },
      {
        key: "IPL Auction",
        displayName: "IPL Auction Game",
        aliases: ["ipl-auction", "iplauction", "ipl_auction", "ipl auction", "ipl auction game"]
      }
    ]
  };

  // State
  let currentCategory = null; // 'technical' | 'nonTechnical' | null
  let currentEventKey = null;

  // DOM Elements cache
  let backdropEl = null;
  let modalEl = null;
  let btnTech = null;
  let btnNonTech = null;
  let selectEl = null;
  let alertEl = null;
  let alertMsgEl = null;
  let submitBtn = null;
  let eventPreviewEl = null;

  /**
   * Create and inject the modal DOM structure into document.body
   */
  function injectModalHTML() {
    if (backdropEl && document.getElementById('erronix-reg-modal-backdrop')) {
      return;
    }
    if (!document.body) {
      return;
    }

    if (!document.getElementById('erronix-reg-modal-backdrop')) {
      const modalHTML = `
        <div id="erronix-reg-modal-backdrop" class="erronix-reg-backdrop" role="dialog" aria-modal="true" aria-labelledby="erronixRegTitle" aria-describedby="erronixRegSubtitle">
          <div class="erronix-reg-modal">
            <button type="button" class="erronix-reg-close" id="erronixRegCloseBtn" aria-label="Close registration modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div class="erronix-reg-header">
              <div class="erronix-reg-badge">
                <span class="erronix-reg-badge-dot"></span>
                ERRONIX 2K26 REGISTRATION
              </div>
              <h2 id="erronixRegTitle" class="erronix-reg-title">Event Registration</h2>
              <p id="erronixRegSubtitle" class="erronix-reg-subtitle">Select your category and event to continue to the official registration form.</p>
            </div>

            <!-- Category Selector Tabs -->
            <div class="erronix-reg-label">Select Category</div>
            <div class="erronix-cat-tabs" role="tablist" aria-label="Event Categories">
              <button type="button" class="erronix-cat-tab-btn" id="erronixCatTechBtn" data-category="technical" role="tab" aria-selected="false">
                <span class="cat-tab-icon">⚡</span>
                <span class="cat-tab-text">Technical <small>(4)</small></span>
              </button>

              <button type="button" class="erronix-cat-tab-btn" id="erronixCatNonTechBtn" data-category="nonTechnical" role="tab" aria-selected="false">
                <span class="cat-tab-icon">🎯</span>
                <span class="cat-tab-text">Non-Technical <small>(4)</small></span>
              </button>
            </div>

            <!-- Event Dropdown -->
            <div class="erronix-select-group">
              <label for="erronixEventSelect" class="erronix-reg-label">Select Competition</label>
              <div class="erronix-select-wrapper">
                <select id="erronixEventSelect" class="erronix-reg-select" disabled aria-label="Select an event">
                  <option value="" disabled selected>— Choose category first —</option>
                </select>
                <div class="erronix-select-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <div id="erronixEventPreview" class="erronix-event-preview"></div>
            </div>

            <!-- Subtle Validation Notice Box -->
            <div id="erronixRegAlert" class="erronix-reg-alert" role="alert">
              <span class="erronix-reg-alert-icon">⚠️</span>
              <span id="erronixRegAlertMsg">Please select an event to continue.</span>
            </div>

            <!-- Submit Register Button -->
            <button type="button" id="erronixRegSubmitBtn" class="erronix-reg-submit" disabled>
              <span>Continue to Registration</span>
              <span class="erronix-reg-submit-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </button>

            <div class="erronix-reg-footnote">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px; margin-right:4px;">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Opens official Google Form in a new secure tab &bull; Free entry
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Cache elements
    backdropEl = document.getElementById('erronix-reg-modal-backdrop');
    modalEl = backdropEl ? backdropEl.querySelector('.erronix-reg-modal') : null;
    btnTech = document.getElementById('erronixCatTechBtn');
    btnNonTech = document.getElementById('erronixCatNonTechBtn');
    selectEl = document.getElementById('erronixEventSelect');
    alertEl = document.getElementById('erronixRegAlert');
    alertMsgEl = document.getElementById('erronixRegAlertMsg');
    submitBtn = document.getElementById('erronixRegSubmitBtn');
    eventPreviewEl = document.getElementById('erronixEventPreview');

    // Attach listeners
    if (btnTech) btnTech.addEventListener('click', () => setCategory('technical'));
    if (btnNonTech) btnNonTech.addEventListener('click', () => setCategory('nonTechnical'));
    if (selectEl) selectEl.addEventListener('change', handleSelectChange);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    const closeBtn = document.getElementById('erronixRegCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeRegistrationModal);

    if (backdropEl) {
      backdropEl.addEventListener('click', (e) => {
        if (e.target === backdropEl) {
          closeRegistrationModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdropEl && backdropEl.classList.contains('active')) {
        closeRegistrationModal();
      }
    });
  }

  /**
   * Set and switch active category ('technical' or 'nonTechnical')
   */
  function setCategory(category, preselectedKey = null) {
    currentCategory = category;
    currentEventKey = null;
    hideAlert();

    if (category === 'technical') {
      if (btnTech) {
        btnTech.classList.add('selected');
        btnTech.setAttribute('aria-pressed', 'true');
      }
      if (btnNonTech) {
        btnNonTech.classList.remove('selected');
        btnNonTech.setAttribute('aria-pressed', 'false');
      }
    } else if (category === 'nonTechnical') {
      if (btnNonTech) {
        btnNonTech.classList.add('selected');
        btnNonTech.setAttribute('aria-pressed', 'true');
      }
      if (btnTech) {
        btnTech.classList.remove('selected');
        btnTech.setAttribute('aria-pressed', 'false');
      }
    }

    populateDropdown(category, preselectedKey);
  }

  /**
   * Populate the event dropdown based on chosen category
   */
  function populateDropdown(category, preselectedKey = null) {
    if (!selectEl) return;

    selectEl.innerHTML = '';
    while (selectEl.firstChild) {
      selectEl.removeChild(selectEl.firstChild);
    }
    selectEl.disabled = false;

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Select an event...';
    defaultOpt.disabled = true;
    defaultOpt.selected = !preselectedKey;
    selectEl.appendChild(defaultOpt);

    const eventsList = EVENT_REGISTRATION_DATA[category] || [];
    let matchedOption = false;

    eventsList.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = item.displayName;

      if (preselectedKey && (item.key === preselectedKey || item.aliases.includes(preselectedKey.toLowerCase()))) {
        opt.selected = true;
        currentEventKey = item.key;
        matchedOption = true;
      }

      selectEl.appendChild(opt);
    });

    if (matchedOption && currentEventKey) {
      updateEventPreview(currentEventKey);
      submitBtn.disabled = false;
    } else {
      updateEventPreview(null);
      submitBtn.disabled = true;
    }
  }

  /**
   * Handle dropdown value changes
   */
  function handleSelectChange() {
    hideAlert();
    const val = selectEl.value;
    if (val) {
      currentEventKey = val;
      submitBtn.disabled = false;
      updateEventPreview(val);
    } else {
      currentEventKey = null;
      submitBtn.disabled = true;
      updateEventPreview(null);
    }
  }

  /**
   * Update subtle event preview pill
   */
  function updateEventPreview(eventKey) {
    if (!eventPreviewEl) return;
    if (!eventKey) {
      eventPreviewEl.classList.remove('show');
      eventPreviewEl.textContent = '';
      return;
    }
    eventPreviewEl.innerHTML = `✓ Ready: <strong>${eventKey}</strong> • Official Google Form`;
    eventPreviewEl.classList.add('show');
  }

  /**
   * Show inline validation or error notice
   */
  function showAlert(msg, isError = false) {
    if (!alertEl || !alertMsgEl) return;
    alertMsgEl.textContent = msg;
    alertEl.className = 'erronix-reg-alert ' + (isError ? 'error' : 'warn');
  }

  /**
   * Hide validation notice
   */
  function hideAlert() {
    if (!alertEl) return;
    alertEl.className = 'erronix-reg-alert';
  }

  /**
   * Handle form submit / Register Now button click
   */
  function handleSubmit(e) {
    if (e) e.preventDefault();

    if (!currentCategory || !currentEventKey) {
      showAlert('Please select an event to continue.', false);
      if (selectEl && !selectEl.disabled && typeof selectEl.focus === 'function') {
        selectEl.focus();
      }
      return;
    }

    const categoryUrls = eventRegistrationLinks[currentCategory];
    const formUrl = categoryUrls ? categoryUrls[currentEventKey] : null;

    if (!formUrl || formUrl.trim() === '' || formUrl.includes('PASTE_')) {
      showAlert('Registration link is currently unavailable. Please try again later.', true);
      return;
    }

    // Open Google Form securely in a single new tab without redirecting the current page
    const link = document.createElement('a');
    link.href = formUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close the modal
    closeRegistrationModal();
  }

  /**
   * Helper: Resolve event identifier (key, filename, or alias) to its category & key
   */
  function resolveEvent(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();

    for (const [cat, events] of Object.entries(EVENT_REGISTRATION_DATA)) {
      for (const ev of events) {
        if (ev.key.toLowerCase() === cleanId || ev.aliases.includes(cleanId)) {
          return { category: cat, key: ev.key };
        }
      }
    }
    return null;
  }

  /**
   * Open the registration modal
   * @param {Event} [e] - Click event
   * @param {string} [preselectedEvent] - Optional event name or alias to preselect
   */
  function openRegistrationModal(e, preselectedEvent = null) {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    injectModalHTML();

    // Check if event was passed or can be detected
    let eventContext = null;
    if (preselectedEvent) {
      eventContext = resolveEvent(preselectedEvent);
    } else if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.registerEvent) {
      eventContext = resolveEvent(e.currentTarget.dataset.registerEvent);
    }

    if (eventContext) {
      // Preselect category and event
      setCategory(eventContext.category, eventContext.key);
    } else {
      // Reset to fresh selection mode
      currentCategory = null;
      currentEventKey = null;
      if (btnTech) {
        btnTech.classList.remove('selected');
        btnTech.setAttribute('aria-pressed', 'false');
      }
      if (btnNonTech) {
        btnNonTech.classList.remove('selected');
        btnNonTech.setAttribute('aria-pressed', 'false');
      }
      if (selectEl) {
        selectEl.innerHTML = '<option value="" disabled selected>— Select event type first —</option>';
        selectEl.disabled = true;
      }
      if (submitBtn) submitBtn.disabled = true;
      updateEventPreview(null);
      hideAlert();
    }

    backdropEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the registration modal
   */
  function closeRegistrationModal() {
    if (backdropEl) {
      backdropEl.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  // Ensure DOM is ready and attach global handlers
  function init() {
    injectModalHTML();

    // Delegate click on any button with data-register-event or register classes
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('#eventThemeToggle, .event-theme-toggle-btn');
      if (toggle) {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nextTheme);
        try {
          localStorage.setItem("erronix-theme", nextTheme);
        } catch (err) {}
        return;
      }

      const regTrigger = e.target.closest('[data-open-reg-modal], .nav-register-btn, .hero-btn-register, .btn-event-register, .btn-primary-register, .cta-btn-large, .btn-reg-trigger');
      if (regTrigger && !regTrigger.hasAttribute('onclick')) {
        const preselect = regTrigger.dataset.registerEvent || null;
        openRegistrationModal(e, preselect);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.openRegistrationModal = openRegistrationModal;
  window.closeRegistrationModal = closeRegistrationModal;
  window.eventRegistrationLinks = eventRegistrationLinks;

  // Backward compatibility alias for any existing frozen calls
  window.openRegFrozenModal = openRegistrationModal;
  window.closeRegFrozenModal = closeRegistrationModal;

})();
