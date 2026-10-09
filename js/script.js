const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

function setNavOpen(isOpen) {
  if (!hamburger || !navLinks) return;

  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('toggle', isOpen);
  body.classList.toggle('nav-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// Loading
document.addEventListener("DOMContentLoaded", function() {
  const loaderWrapper = document.getElementById("loader-wrapper");
  const loaderText = document.getElementById("loader-text");
  const content = document.getElementById("content");

  if (!loaderWrapper || !content) {
    if (content) content.style.display = "block";
    return;
  }

  content.style.display = "block";
  content.style.visibility = "hidden";

  const subtitle = document.getElementById("loader-subtitle") || document.createElement("p");
  subtitle.id = "loader-subtitle";
  if (!subtitle.isConnected) loaderWrapper.appendChild(subtitle);
  const loaderPercent = document.getElementById("loader-percent");
  const loaderTask = document.getElementById("loader-task");
  const progressBar = loaderWrapper.querySelector('[role="progressbar"]');
  const progressFill = document.getElementById("loader-progress-fill");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minDuration = reducedMotion ? 1 : 1200;
  const stages = [
    { subtitle: "Inizializzazione", task: "CONTROLLO AMBIENTE" },
    { subtitle: "Caricamento asset", task: "PREPARAZIONE INTERFACCIA" },
    { subtitle: "Ottimizzazione UI", task: "VERIFICA SICUREZZA" },
    { subtitle: "Pronto", task: "ACCESSO AUTORIZZATO" }
  ];

  const baseLoaderText = loaderText ? loaderText.textContent.trim() : "GioSpezia";
  if (loaderText) {
    loaderText.textContent = baseLoaderText;
    loaderText.setAttribute("data-text", baseLoaderText);
  }

  const startTime = performance.now();

  const finishLoading = () => {
    loaderWrapper.classList.add("is-finale");

    const revealDelay = reducedMotion ? 0 : 140;
    setTimeout(() => {
      loaderWrapper.classList.add("is-loaded");
    }, revealDelay);

    content.style.visibility = "visible";
    content.style.opacity = "0";
    content.style.transform = "translateY(12px)";
    content.style.transition = "opacity 0.55s ease, transform 0.55s ease";

    requestAnimationFrame(() => {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      loaderWrapper.style.display = "none";
    }, reducedMotion ? 80 : 900);
  };

  const updateLoader = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / minDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    loaderWrapper.style.setProperty("--loader-scale", easedProgress);
    const percent = Math.round(progress * 100);
    if (loaderPercent) loaderPercent.textContent = `${String(percent).padStart(2, "0")}%`;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressBar) progressBar.setAttribute("aria-valuenow", String(percent));

    const stage = stages[Math.min(stages.length - 1, Math.floor(progress * stages.length))];
    subtitle.textContent = stage.subtitle;
    if (loaderTask) loaderTask.textContent = stage.task;

    if (progress < 1) {
      requestAnimationFrame(updateLoader);
      return;
    }

    finishLoading();
  };

  requestAnimationFrame(updateLoader);
});

if (hamburger && navLinks) {
  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', () => {
    setNavOpen(!navLinks.classList.contains('open'));
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.classList.contains('open')) return;

    const clickedInsideNav = navLinks.contains(event.target);
    const clickedHamburger = hamburger.contains(event.target);

    if (!clickedInsideNav && !clickedHamburger) {
      setNavOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavOpen(false);
    }
  });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
    setNavOpen(false);
    });
});

// to top button
const backToTopButton = document.getElementById('back-to-top');
let scrollUpdatePending = false;
let backToTopVisible = false;

if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (scrollUpdatePending) return;
    scrollUpdatePending = true;
    requestAnimationFrame(() => {
      const shouldShow = window.scrollY > 300;
      if (shouldShow !== backToTopVisible) {
        backToTopButton.style.display = shouldShow ? 'block' : 'none';
        backToTopVisible = shouldShow;
      }
      scrollUpdatePending = false;
    });
  }, { passive: true });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  });
}

// Mostra / Nascondi Projects

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-projects');
    const projectsGrid = document.querySelector('.projects-grid'); // La grid dei progetti

    // Gestisci il click sul pulsante
    if (!toggleButton || !projectsGrid) return;

    toggleButton.addEventListener('click', function() {
        // Verifica se i progetti sono visibili
        if (projectsGrid.style.display === 'none' || projectsGrid.style.display === '') {
            projectsGrid.style.display = 'grid'; // Mostra i progetti
            toggleButton.innerHTML = 'Nascondi &#x25B2;'; // Cambia il testo del bottone
        } else {
            projectsGrid.style.display = 'none'; // Nascondi i progetti
            toggleButton.innerHTML = 'Mostra Progetti &#x25BC;'; // Cambia il testo del bottone
        }
    });
});

// Cookie preferences
(function initCookiePreferences() {
  const cookieBox = document.getElementById('cookieBox');
  const choices = document.getElementById('cookieChoices');
  const manage = document.getElementById('cookieManage');
  const accept = document.getElementById('acceptCookies');
  const reject = document.getElementById('rejectCookies');
  const customize = document.getElementById('customizeCookies');
  const save = document.getElementById('savePreferences');
  const back = document.getElementById('backCookieChoices');
  const reopen = document.getElementById('reopenButton');
  const close = document.getElementById('closeBanner');
  const analytics = document.getElementById('analytics');
  const marketing = document.getElementById('marketing');

  if (!cookieBox || !choices || !manage || !reopen || !marketing) return;
  let userInteracted = false;

  const readConsent = () => {
    try {
      const saved = localStorage.getItem('cookieConsent');
      if (!saved) return null;
      if (saved === 'accepted') return { necessary: true, analytics: true, marketing: true };
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') return null;
      return {
        necessary: true,
        analytics: parsed.analytics === true,
        marketing: parsed.marketing === true
      };
    } catch {
      return null;
    }
  };

  const syncControls = (consent = readConsent()) => {
    if (analytics) analytics.checked = consent?.analytics === true;
    marketing.checked = consent?.marketing === true;
  };

  const showChoices = () => {
    choices.hidden = false;
    manage.hidden = true;
    customize?.setAttribute('aria-expanded', 'false');
  };

  const dismiss = () => {
    userInteracted = true;
    cookieBox.hidden = true;
    reopen.hidden = false;
    showChoices();
  };

  const saveConsent = (consent) => {
    const normalized = {
      necessary: true,
      analytics: consent.analytics === true,
      marketing: consent.marketing === true
    };
    try {
      localStorage.setItem('cookieConsent', JSON.stringify(normalized));
    } catch {
      // The preference still applies for this page if browser storage is unavailable.
    }
    dismiss();
    window.dispatchEvent(new CustomEvent('cookieconsentchange', { detail: normalized }));
  };

  const open = () => {
    userInteracted = true;
    syncControls();
    showChoices();
    cookieBox.hidden = false;
    reopen.hidden = true;
    customize?.focus({ preventScroll: true });
  };

  const openThirdPartySettings = () => {
    open();
    choices.hidden = true;
    manage.hidden = false;
    customize?.setAttribute('aria-expanded', 'true');
    marketing.focus({ preventScroll: true });
  };

  const existingConsent = readConsent();
  syncControls(existingConsent);
  cookieBox.hidden = true;
  // Keep the preferences shortcut available after a saved choice and show it
  // again on later visits so consent can always be reviewed or changed.
  reopen.hidden = !existingConsent;

  if (!existingConsent) {
    window.setTimeout(() => {
      if (userInteracted || readConsent()) return;
      cookieBox.hidden = false;
      window.dispatchEvent(new CustomEvent('cookieconsentchange', {
        detail: { necessary: true, analytics: false, marketing: false }
      }));
    }, 1900);
  } else {
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cookieconsentchange', { detail: existingConsent }));
    }, 0);
  }

  accept?.addEventListener('click', () => saveConsent({ analytics: false, marketing: true }));
  reject?.addEventListener('click', () => saveConsent({ analytics: false, marketing: false }));
  save?.addEventListener('click', () => saveConsent({
    analytics: analytics?.checked === true,
    marketing: marketing.checked
  }));

  customize?.addEventListener('click', () => {
    syncControls();
    choices.hidden = true;
    manage.hidden = false;
    customize.setAttribute('aria-expanded', 'true');
    marketing.focus({ preventScroll: true });
  });

  back?.addEventListener('click', () => {
    showChoices();
    customize?.focus({ preventScroll: true });
  });
  close?.addEventListener('click', dismiss);
  reopen.addEventListener('click', open);
  window.addEventListener('openCookiePreferences', openThirdPartySettings);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !cookieBox.hidden) dismiss();
  });
})();

// YouTube players stay local until the visitor allows third-party content.
document.querySelectorAll('.cookie-embed').forEach((embed) => {
  const frame = embed.querySelector('iframe[data-cookie-src]');
  const placeholder = embed.querySelector('.cookie-embed-placeholder');
  if (!frame || !placeholder) return;

  embed.querySelector('.cookie-embed-enable')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('openCookiePreferences'));
  });

  window.addEventListener('cookieconsentchange', (event) => {
    if (event.detail?.marketing === true) {
      if (frame.getAttribute('src') !== frame.dataset.cookieSrc) {
        frame.src = frame.dataset.cookieSrc;
      }
      embed.classList.add('is-enabled');
      placeholder.hidden = true;
    } else {
      if (frame.hasAttribute('src')) frame.src = 'about:blank';
      embed.classList.remove('is-enabled');
      placeholder.hidden = false;
    }
  });
});

// contact.html
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Esegui anche i controlli HTML (incluso il formato dell'indirizzo email).
    if (!this.reportValidity()) return;

    // Prendi i valori e rimuovi gli spazi superflui.
    const nome      = this.nome.value.trim();
    const email     = this.email.value.trim();
    const tipoRichiesta = this.tipoRichiesta.value.trim();
    const oggetto   = this.oggetto.value.trim();
    const messaggio = this.messaggio.value.trim();

    // I campi obbligatori vengono controllati anche se il browser non mostra
    // la validazione nativa per qualche motivo.
    if (!nome || !email || !oggetto || !messaggio) {
      alert('Per favore, compila tutti i campi.');
      return;
    }

    // Costruisci un testo email leggibile in tutti i client
    const bodyLines = [
      `Nome: ${nome}`,
      `Email: ${email}`,
      tipoRichiesta ? `Tipologia: ${tipoRichiesta}` : null,
      `Oggetto: ${oggetto}`,
      '',
      'Messaggio:',
      '--------------------',
      messaggio
    ].filter(line => line !== null);

    const subject = encodeURIComponent(oggetto);
    const body = encodeURIComponent(bodyLines.join('\r\n'));
    const mailtoLink = `mailto:gio@giospezia.it?subject=${subject}&body=${body}`;

    // Il browser passa il link mailto al programma email configurato.
    window.location.href = mailtoLink;
  });
});

/* Collaborazioni e Clienti */
const track = document.getElementById("clientsTrack");

if (track) {
  // Drag con il cursore
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    track.classList.add("active");
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener("mouseleave", () => {
    isDown = false;
  });

  track.addEventListener("mouseup", () => {
    isDown = false;
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5; // velocità
    track.scrollLeft = scrollLeft - walk;
  });
}

// JavaScript for Theme Toggle
// JavaScript for Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const body = document.body; // or document.documentElement if you prefer html

  // Function to set theme
  function setTheme(isDark) {
    if (isDark) {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Update aria-pressed on all toggles
    themeToggles.forEach(toggle => {
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
  }

  // Function to get initial theme
  function getInitialTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // The portfolio now opens in its dark cybersecurity theme by default.
    return true;
  }

  // Set initial theme
  setTheme(getInitialTheme());

  // Toggle function
  function toggleTheme() {
    const currentIsDark = body.classList.contains('dark');
    const newIsDark = !currentIsDark;
    setTheme(newIsDark);

    // Add toggling class for animation on all toggles
    themeToggles.forEach(toggle => {
      toggle.classList.add('toggling');
      setTimeout(() => {
        toggle.classList.remove('toggling');
      }, 600); // Match animation duration
    });
  }

  // Event listener for all toggles
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
  });

});

/* Mini Discount */

/* ================= MINI DISCOUNT (Instant Gaming) ================= */
(function () {

  const miniCards = document.querySelectorAll(".mini-discount-card");

  // ---- COPY CODE ----
  miniCards.forEach((miniCard) => {
    const copyBtn = miniCard.querySelector(".mini-discount-copy");
    const codeEl = miniCard.querySelector(".mini-discount-code");

    if (!copyBtn || !codeEl) return;

    let resetTimer = null;

    copyBtn.addEventListener("click", async () => {
      const code = codeEl.textContent.trim();

      const showCopiedState = () => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiato!';
        copyBtn.style.borderColor = "rgba(163,255,18,0.35)";

        if (resetTimer) {
          clearTimeout(resetTimer);
        }

        resetTimer = setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copia';
          copyBtn.style.borderColor = "";
          resetTimer = null;
        }, 1300);
      };

      try {
        await navigator.clipboard.writeText(code);
        showCopiedState();
      } catch {
        const temp = document.createElement("textarea");
        temp.value = code;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showCopiedState();
      }
    });
  });

  // ---- GLOW FOLLOW CURSOR ----
  miniCards.forEach((miniCard) => {
    let cardRect = null;
    let pointerX = 0;
    let pointerY = 0;
    let glowFrame = 0;

    miniCard.addEventListener("mouseenter", () => {
      cardRect = miniCard.getBoundingClientRect();
    });
    miniCard.addEventListener("mousemove", (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (glowFrame || !cardRect) return;
      const rect = cardRect;
      glowFrame = requestAnimationFrame(() => {
        miniCard.style.setProperty("--mx", `${((pointerX - rect.left) / rect.width) * 100}%`);
        miniCard.style.setProperty("--my", `${((pointerY - rect.top) / rect.height) * 100}%`);
        glowFrame = 0;
      });
    });

    miniCard.addEventListener("mouseleave", () => {
      cardRect = null;
      if (glowFrame) cancelAnimationFrame(glowFrame);
      glowFrame = 0;
      miniCard.style.setProperty("--mx", "50%");
      miniCard.style.setProperty("--my", "50%");
    });
  });

})();

/* Servizi */

/* ====== SERVIZI: glow che segue il cursore (NO conflitti) ====== */
(function () {
  const cards = document.querySelectorAll(".service-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    let cardRect = null;
    let pointerX = 0;
    let pointerY = 0;
    let glowFrame = 0;

    card.addEventListener("mouseenter", () => {
      cardRect = card.getBoundingClientRect();
    });
    card.addEventListener("mousemove", (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (glowFrame || !cardRect) return;
      const rect = cardRect;
      glowFrame = requestAnimationFrame(() => {
        card.style.setProperty("--mx", `${((pointerX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--my", `${((pointerY - rect.top) / rect.height) * 100}%`);
        glowFrame = 0;
      });
    });

    card.addEventListener("mouseleave", () => {
      cardRect = null;
      if (glowFrame) cancelAnimationFrame(glowFrame);
      glowFrame = 0;
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });
})();

// Interactive, study-focused cybersecurity workflow.
(function () {
  const steps = document.querySelectorAll(".workflow-step");
  const panel = document.querySelector(".workflow-window");
  const phase = document.getElementById("workflow-phase");
  const description = document.getElementById("workflow-description");
  const result = document.getElementById("workflow-result");

  if (!steps.length || !panel || !phase || !description || !result) return;

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      steps.forEach((item) => {
        const isActive = item === step;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      panel.classList.add("is-updating");
      requestAnimationFrame(() => {
        phase.textContent = step.dataset.phase;
        description.textContent = step.dataset.description;
        result.textContent = step.dataset.output;
        window.setTimeout(() => panel.classList.remove("is-updating"), 170);
      });
    });
  });
})();

// Light scroll reveals on portfolio cards; content remains visible without JS.
(function () {
  const revealItems = document.querySelectorAll(
    ".security-focus-card, .workflow-step, .service-card, .project-card, .staff-card, .event-card, .social-card, .client-card, .yt-card, .contact-highlight-card"
  );
  if (!revealItems.length || !("IntersectionObserver" in window)) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.body.classList.add("has-scroll-reveal");
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  revealItems.forEach((item, index) => {
    item.classList.add("scroll-reveal");
    item.style.transitionDelay = `${(index % 4) * 65}ms`;
    observer.observe(item);
  });
})();
