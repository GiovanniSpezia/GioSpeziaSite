const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

document.querySelectorAll('[data-site-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

// Scrub the homepage introduction with the page's natural scroll position.
(function initIdentityIntro() {
  const section = document.getElementById("identity-intro");
  if (!section) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.matches) {
    document.body.classList.add("identity-reduced-motion");
    return;
  }

  document.body.classList.add("has-identity-scroll");
  const beats = [...section.querySelectorAll(".identity-beat")];
  const stepLabel = section.querySelector("[data-identity-step]");
  const windows = [
    [.22, .30, .43, .50],
    [.45, .53, .66, .73],
    [.69, .77, .90, 1.08]
  ];
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const ease = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const between = (value, start, end) => ease((value - start) / (end - start));
  let framePending = false;
  let lastProgress = -1;

  const updateIntro = () => {
    const rect = section.getBoundingClientRect();
    const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-rect.top / scrollDistance);
    if (Math.abs(progress - lastProgress) < .0001) {
      framePending = false;
      return;
    }
    lastProgress = progress;
    const nameExit = between(progress, .10, .29);
    const frameExit = between(progress, .68, .96);

    section.style.setProperty("--identity-progress", progress.toFixed(3));
    section.style.setProperty("--intro-progress", progress.toFixed(3));
    section.style.setProperty("--intro-background-x", `${(progress * 100).toFixed(1)}%`);
    section.style.setProperty("--scroll-cue-opacity", String(1 - between(progress, .015, .11)));
    section.style.setProperty("--intro-name-opacity", (1 - nameExit).toFixed(3));
    section.style.setProperty("--intro-name-scale", (1 - nameExit * .24).toFixed(3));
    section.style.setProperty("--intro-name-y", `${(-68 * nameExit).toFixed(1)}px`);
    section.style.setProperty("--intro-name-blur", `${(nameExit * 7).toFixed(1)}px`);
    section.style.setProperty("--intro-frame-angle", `${(-6 + between(progress, .05, .48) * 6).toFixed(2)}deg`);
    section.style.setProperty("--intro-frame-scale", (1 + between(progress, .1, .7) * .16).toFixed(3));
    section.style.setProperty("--intro-frame-opacity", ((1 - frameExit) * .38).toFixed(3));
    section.style.setProperty("--intro-sweep-x", `${(-80 + progress * 200).toFixed(1)}vw`);
    section.style.setProperty("--intro-sweep-opacity", (Math.sin(progress * Math.PI) * .5).toFixed(3));

    beats.forEach((beat, index) => {
      const [start, entered, leaving, end] = windows[index];
      const arriving = between(progress, start, entered);
      const departing = between(progress, leaving, end);
      beat.style.setProperty("--beat-opacity", (arriving * (1 - departing)).toFixed(3));
      beat.style.setProperty("--beat-y", `${(28 * (1 - arriving) - 24 * departing).toFixed(1)}px`);
      beat.style.setProperty("--beat-scale", (.92 + .08 * arriving + .045 * departing).toFixed(3));
    });
    if (stepLabel) {
      const step = progress < .27 ? 0 : progress < .50 ? 1 : progress < .74 ? 2 : 3;
      stepLabel.textContent = `${String(step).padStart(2, "0")} / 03`;
    }
    framePending = false;
  };

  const requestUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateIntro);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("pageshow", requestUpdate);
  requestUpdate();
})();

function setNavOpen(isOpen) {
  if (!hamburger || !navLinks) return;

  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('toggle', isOpen);
  body.classList.toggle('nav-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  hamburger.setAttribute('aria-label', window.siteLanguage?.() === 'en'
    ? (isOpen ? 'Close menu' : 'Open menu')
    : (isOpen ? 'Chiudi il menu' : 'Apri il menu'));
}

// Loading
document.addEventListener("DOMContentLoaded", function() {
  const loaderWrapper = document.getElementById("loader-wrapper");
  const loaderText = document.getElementById("loader-text");
  const content = document.getElementById("content");

  if (!loaderWrapper || !content) {
    document.documentElement.classList.remove("js-loading");
    return;
  }

  const subtitle = document.getElementById("loader-subtitle") || document.createElement("p");
  subtitle.id = "loader-subtitle";
  if (!subtitle.isConnected) loaderWrapper.appendChild(subtitle);
  const loaderPercent = document.getElementById("loader-percent");
  const loaderTask = document.getElementById("loader-task");
  const progressBar = loaderWrapper.querySelector('[role="progressbar"]');
  const progressFill = document.getElementById("loader-progress-fill");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minDuration = reducedMotion ? 1 : 950;
  const loadingTask = window.siteTranslate?.("CARICAMENTO") || "CARICAMENTO";
  const readyTask = window.siteTranslate?.("PRONTO") || "PRONTO";
  if (loaderTask) loaderTask.textContent = loadingTask;

  const baseLoaderText = loaderText ? loaderText.textContent.trim() : "GioSpezia";
  if (loaderText) {
    loaderText.textContent = baseLoaderText;
    loaderText.setAttribute("data-text", baseLoaderText);
  }

  const startTime = performance.now();
  let finished = false;

  const finishLoading = () => {
    if (finished) return;
    finished = true;
    if (loaderPercent) loaderPercent.textContent = "100%";
    if (progressFill) progressFill.style.width = "100%";
    if (progressBar) progressBar.setAttribute("aria-valuenow", "100");
    if (loaderTask) loaderTask.textContent = readyTask;
    loaderWrapper.classList.add("is-finale");
    document.documentElement.classList.add("js-loaded");
    document.documentElement.classList.remove("js-loading");
    setTimeout(() => loaderWrapper.classList.add("is-loaded"), reducedMotion ? 0 : 80);
    setTimeout(() => {
      loaderWrapper.style.display = "none";
      document.documentElement.classList.remove("js-loaded");
    }, reducedMotion ? 80 : 620);
  };

  const updateLoader = (now) => {
    if (finished) return;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / minDuration, 1);
    const percent = Math.round(progress * 100);
    if (loaderPercent) loaderPercent.textContent = `${String(percent).padStart(2, "0")}%`;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressBar) progressBar.setAttribute("aria-valuenow", String(percent));

    if (progress < 1) {
      setTimeout(() => updateLoader(performance.now()), 32);
      return;
    }

    finishLoading();
  };

  // A watchdog reveals the site if a background tab throttles the progress timer.
  setTimeout(finishLoading, reducedMotion ? 80 : 2600);
  updateLoader(performance.now());
});

if (hamburger && navLinks) {
  setNavOpen(false);
  window.addEventListener('site-language-change', () => setNavOpen(navLinks.classList.contains('open')));

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

// Portfolio and staff filters leave every card visible if scripting is unavailable.
document.addEventListener('DOMContentLoaded', () => {
  const translate = (text) => window.siteTranslate?.(text) || text;

  const portfolio = document.querySelector('.portfolio-grid');
  if (portfolio) {
    const categories = [
      { key: 'sites', label: 'Siti web' },
      { key: 'plugins', label: 'Plugin' },
      { key: 'apps', label: 'Applicazioni' },
      { key: 'video', label: 'Video' }
    ];
    const cards = [...portfolio.querySelectorAll('.project-card[data-category]')];
    const filters = [...document.querySelectorAll('.portfolio-filter[data-filter]')];
    const count = document.querySelector('.portfolio-count');
    const headings = new Map();
    categories.forEach(({ key, label }, index) => {
      const heading = document.createElement('div');
      heading.className = 'portfolio-group-heading';
      heading.dataset.portfolioGroup = key;
      heading.innerHTML = `<span class="portfolio-group-index">${String(index + 1).padStart(2, '0')} / 04</span><h3></h3><span class="portfolio-group-total"></span>`;
      headings.set(key, { element: heading, label });
      portfolio.append(heading);
      cards.filter((card) => card.dataset.category === key)
        .sort((a, b) => Number(a.dataset.featuredOrder || 99) - Number(b.dataset.featuredOrder || 99))
        .forEach((card) => portfolio.append(card));
    });
    let active = 'all';
    const render = () => {
      const matching = cards.filter((card) => active === 'all' || card.dataset.category === active);
      cards.forEach((card) => { card.hidden = active !== 'all' && card.dataset.category !== active; });
      headings.forEach(({ element, label }, key) => {
        const total = cards.filter((card) => card.dataset.category === key).length;
        element.hidden = active !== 'all' && active !== key;
        element.querySelector('h3').textContent = translate(label);
        element.querySelector('.portfolio-group-total').textContent = `${String(total).padStart(2, '0')} ${translate(total === 1 ? 'progetto' : 'progetti')}`;
      });
      filters.forEach((button) => {
        const selected = button.dataset.filter === active;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      if (count) count.textContent = `${matching.length} ${translate(matching.length === 1 ? 'risultato' : 'risultati')}`;
    };
    filters.forEach((button) => button.addEventListener('click', () => {
      active = button.dataset.filter;
      render();
    }));
    window.addEventListener('site-language-change', render);
    render();
  }

  const staff = document.querySelector('.staff-experience-section #proofs');
  if (staff) {
    const cards = [...staff.querySelectorAll('[data-staff-category]')];
    const filters = [...document.querySelectorAll('[data-staff-filter]')];
    const count = document.querySelector('.staff-count');
    let active = 'all';
    const render = () => {
      const matching = cards.filter((card) => active === 'all' || card.dataset.staffCategory.split(' ').includes(active));
      cards.forEach((card) => { card.hidden = !matching.includes(card); });
      filters.forEach((button) => {
        const selected = button.dataset.staffFilter === active;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      if (count) count.textContent = `${matching.length} ${translate(matching.length === 1 ? 'esperienza' : 'esperienze')}`;
    };
    filters.forEach((button) => button.addEventListener('click', () => { active = button.dataset.staffFilter; render(); }));
    window.addEventListener('site-language-change', render);
    render();
  }
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
      alert(window.siteLanguage?.() === 'en' ? 'Please complete all required fields.' : 'Per favore, compila tutti i campi.');
      return;
    }

    // Costruisci un testo email leggibile in tutti i client
    const english = window.siteLanguage?.() === 'en';
    const labels = english
      ? { name: 'Name', email: 'Email', type: 'Request type', subject: 'Subject', message: 'Message' }
      : { name: 'Nome', email: 'Email', type: 'Tipologia', subject: 'Oggetto', message: 'Messaggio' };
    const bodyLines = [
      `${labels.name}: ${nome}`,
      `${labels.email}: ${email}`,
      tipoRichiesta ? `${labels.type}: ${tipoRichiesta}` : null,
      `${labels.subject}: ${oggetto}`,
      '',
      `${labels.message}:`,
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

  function updateThemeLabels() {
    const isDark = body.classList.contains('dark');
    const english = window.siteLanguage?.() === 'en';
    themeToggles.forEach(toggle => {
      toggle.setAttribute('aria-label', english
        ? (isDark ? 'Switch to light mode' : 'Switch to dark mode')
        : (isDark ? 'Attiva tema chiaro' : 'Attiva tema scuro'));
    });
  }

  // Function to set theme
  function setTheme(isDark) {
    if (isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (_) {}
    // Update aria-pressed on all toggles
    themeToggles.forEach(toggle => {
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    });
    updateThemeLabels();
  }

  // Function to get initial theme
  function getInitialTheme() {
    // Check localStorage first
    let savedTheme;
    try { savedTheme = localStorage.getItem('theme'); } catch (_) {}
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // The street edition opens in dark mode by default.
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
  window.addEventListener('site-language-change', updateThemeLabels);

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
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${window.siteTranslate?.('Copiato!') || 'Copiato!'}`;
        copyBtn.style.borderColor = "rgba(163,255,18,0.35)";

        if (resetTimer) {
          clearTimeout(resetTimer);
        }

        resetTimer = setTimeout(() => {
          copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> ${window.siteTranslate?.('Copia') || 'Copia'}`;
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

})();

/* Servizi */

// Light scroll reveals on portfolio cards; content remains visible without JS.
(function () {
  const revealItems = document.querySelectorAll(
    ".security-focus-card, .service-card, .project-card, .staff-card, .event-card, .social-card, .client-card, .yt-card, .contact-highlight-card"
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
(() => {
  const section = document.getElementById('competenze');
  if (!section) return;

  const tiles = [...section.querySelectorAll('[data-skill]')];
  const feature = section.querySelector('.skills-feature');
  const icon = section.querySelector('[data-skill-icon]');
  const name = section.querySelector('[data-skill-name]');
  const description = section.querySelector('[data-skill-description]');
  const count = section.querySelector('[data-skill-count]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!tiles.length || !feature || !icon || !name || !description || !count) return;

  let selected = 0;
  const showSkill = (index, animate = true) => {
    selected = (index + tiles.length) % tiles.length;
    const tile = tiles[selected];
    tiles.forEach((button, buttonIndex) => {
      const active = buttonIndex === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    icon.replaceChildren(tile.querySelector('.skill-glyph').cloneNode(true));
    name.textContent = tile.querySelector('strong').textContent;
    description.textContent = tile.querySelector('.skill-description').textContent;
    count.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(tiles.length).padStart(2, '0')}`;
    feature.classList.remove('is-changing');
    if (animate && !reducedMotion.matches) {
      void feature.offsetWidth;
      feature.classList.add('is-changing');
    }
  };

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => showSkill(index));
    tile.addEventListener('keydown', (event) => {
      const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? index - 1
        : event.key === 'Home' ? 0 : event.key === 'End' ? tiles.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      const target = (next + tiles.length) % tiles.length;
      showSkill(target);
      tiles[target].focus();
    });
  });
  window.addEventListener('site-language-change', () => showSkill(selected, false));
  showSkill(0, false);
})();
