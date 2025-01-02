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

document.getElementById('toggle-projects').addEventListener('click', function() {
    const hiddenProjects = document.querySelector('.hidden-projects');
    const button = this;

    if (hiddenProjects.style.display === 'none' || hiddenProjects.style.display === '') {
        hiddenProjects.style.display = 'grid';
        button.innerHTML = 'Nascondi &#x25B2;';
    } else {
        hiddenProjects.style.display = 'none';
        button.innerHTML = 'Mostra Altri &#x25BC;';
    }
});

// 2025

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firework {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        this.colors = colors;
        this.particles = [];
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.colors));
        }
    }

    draw() {
        this.particles.forEach((particle) => particle.update());
    }
}

class Particle {
    constructor(x, y, colors) {
        this.x = x;
        this.y = y;
        this.colors = colors;
        this.radius = Math.random() * 2 + 1;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 5 + 2;
        this.gravity = 0.1;
        this.friction = 0.98;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.opacity -= this.decay;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${this.colors[0]}, ${this.colors[1]}, ${this.colors[2]}, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }
}

const fireworks = [];

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    const colors = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
    ];
    fireworks.push(new Firework(x, y, colors));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((firework, index) => {
        firework.draw();
        if (firework.particles.every((particle) => particle.opacity <= 0)) {
            fireworks.splice(index, 1);
        }
    });
    requestAnimationFrame(animate);
}

setInterval(createFirework, 500);
animate();