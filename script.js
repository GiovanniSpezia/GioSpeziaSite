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

  const subtitle = document.createElement("p");
  subtitle.id = "loader-subtitle";
  loaderWrapper.appendChild(subtitle);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minDuration = reducedMotion ? 900 : 2400;
  const stageTexts = [
    "Inizializzazione",
    "Caricamento asset",
    "Ottimizzazione UI",
    "Pronto"
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
    const percentage = Math.round(easedProgress * 100);

    loaderWrapper.style.setProperty("--loader-progress", `${percentage}%`);

    const stageIndex = Math.min(
      stageTexts.length - 1,
      Math.floor(progress * stageTexts.length)
    );
    subtitle.textContent = stageTexts[stageIndex];

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

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const sections = document.querySelectorAll('section');

const options = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, options);

sections.forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Mostra / Nascondi Projects

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-projects');
    const projectsGrid = document.querySelector('.projects-grid'); // La grid dei progetti

    // Gestisci il click sul pulsante
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

// Cookie
const cookieBox = document.getElementById('cookieBox');
const acceptBtn = document.getElementById('acceptCookies');
const customizeBtn = document.getElementById('customizeCookies');
const cookieManage = document.getElementById('cookieManage');
const savePreferences = document.getElementById('savePreferences');
const reopenButton = document.getElementById('reopenButton');
const closeBanner = document.getElementById('closeBanner');

// Mostra solo il bottone dopo 3 secondi
function showReopenButton() {
  setTimeout(() => {
    reopenButton.style.display = 'block';
  }, 3000);
}

// Mostra il banner al click del bottone
reopenButton.addEventListener('click', () => {
  cookieBox.style.display = 'block';
  cookieManage.style.display = 'none';
  reopenButton.style.display = 'none';
});

// Accetta tutti i cookie
acceptBtn.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBox.style.display = 'none';
  reopenButton.style.display = 'block';
});

// Personalizza i cookie
customizeBtn.addEventListener('click', () => {
  cookieManage.style.display = 'block';
});

// Salva preferenze
savePreferences.addEventListener('click', () => {
  const analytics = document.getElementById('analytics').checked;
  const marketing = document.getElementById('marketing').checked;
  localStorage.setItem('cookieConsent', JSON.stringify({ analytics, marketing }));
  cookieBox.style.display = 'none';
  reopenButton.style.display = 'block';
});

// Chiudi il banner
closeBanner.addEventListener('click', () => {
  cookieBox.style.display = 'none';
  reopenButton.style.display = 'block';
});

// Avvio
window.addEventListener('load', showReopenButton);

// contact.html
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Prendi i valori
    const nome      = this.nome.value.trim();
    const email     = this.email.value.trim();
    const oggetto   = this.oggetto.value.trim();
    const messaggio = this.messaggio.value.trim();

    // Se qualche campo è vuoto, interrompi
    if (!nome || !email || !oggetto || !messaggio) {
      alert('Per favore, compila tutti i campi.');
      return;
    }

    // Costruisci il mailto
    const params = new URLSearchParams({
      subject: oggetto,
      body: `Nome: ${nome}\r\nEmail: ${email}\r\n\r\n${messaggio}`
    });

    const mailtoLink = `mailto:gio@giospezia.it?${params.toString()}`;

    // Apri il client di posta
    window.open(mailtoLink, '_self');
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
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // Listen for system theme changes (if no manual preference set)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) { // Only auto if no manual preference
      setTheme(e.matches);
    }
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
        copyBtn.style.borderColor = "rgba(0,123,255,0.35)";

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
    miniCard.addEventListener("mousemove", (e) => {
      const r = miniCard.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;

      miniCard.style.setProperty("--mx", `${x}%`);
      miniCard.style.setProperty("--my", `${y}%`);
    });

    miniCard.addEventListener("mouseleave", () => {
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
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });
})();
