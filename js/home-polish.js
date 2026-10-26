(() => {
  const rail = document.getElementById('clientsTrack');
  if (rail) {
    const previous = document.querySelector('[data-client-prev]');
    const next = document.querySelector('[data-client-next]');
    const meter = document.querySelector('.clients-meter');
    const step = () => {
      const card = rail.querySelector('.client-card');
      if (!card) return rail.clientWidth * .8;
      return card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap || 0);
    };
    const update = () => {
      const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const progress = maximum > 0 ? rail.scrollLeft / maximum : 1;
      if (meter) meter.style.setProperty('--client-progress', `${Math.max(12, progress * 100)}%`);
      if (previous) previous.disabled = rail.scrollLeft < 3;
      if (next) next.disabled = rail.scrollLeft >= maximum - 3;
    };
    previous?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(rail);
    update();
  }

  const education = document.querySelector('#percorso .education-layout');
  const milestones = [...document.querySelectorAll('#percorso .education-item')];
  if (education && milestones.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(() => {
      let nearest = 0;
      let distance = Infinity;
      const targetY = window.innerHeight * .46;
      milestones.forEach((item, index) => {
        const box = item.getBoundingClientRect();
        const currentDistance = Math.abs((box.top + box.bottom) / 2 - targetY);
        if (currentDistance < distance) {
          distance = currentDistance;
          nearest = index;
        }
      });
      milestones.forEach((item, index) => item.classList.toggle('is-spotlight', index === nearest));
      education.style.setProperty('--education-progress', `${((nearest + 1) / milestones.length) * 100}%`);
    }, { rootMargin: '-10% 0px -10% 0px', threshold: [0, .25, .75, 1] });
    milestones.forEach(item => observer.observe(item));
  }
})();
