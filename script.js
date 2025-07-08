const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Loading
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const loaderWrapper = document.getElementById("loader-wrapper");
        loaderWrapper.style.opacity = "0";
        setTimeout(() => {
            loaderWrapper.style.display = "none";
        }, 1000);

        const content = document.getElementById("content");
        content.style.display = "block";
    }, 3000);
});

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('toggle');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('toggle');
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