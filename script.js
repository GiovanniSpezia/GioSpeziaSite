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

// Mostra / Nascondi projects

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-projects');
    const projectsGrid = document.querySelector('.projects-grid'); // La grid dei progetti

    // Gestisci il click sul pulsante
    toggleButton.addEventListener('click', function() {
        // Verifica se i progetti sono visibili
        if (projectsGrid.style.display === 'none' || projectsGrid.style.display === '') {
            projectsGrid.style.display = 'grid'; // Mostra i progetti
            toggleButton.innerHTML = 'Hide &#x25B2;'; // Cambia il testo del bottone
        } else {
            projectsGrid.style.display = 'none'; // Nascondi i progetti
            toggleButton.innerHTML = 'View Projects &#x25BC;'; // Cambia il testo del bottone
        }
    });
});