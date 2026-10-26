(() => {
  const scenes = document.querySelectorAll('[data-world-art]');
  const allowPointerMotion = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  const labels = {
    tech: ['RETI', 'SICUREZZA', 'PROGETTI'],
    content: ['IDEA', 'FORMATO', 'STORIA'],
    move: ['INIZIO', 'PRATICA', 'PROGRESSO']
  };

  scenes.forEach((scene) => {
    const status = scene.querySelector('[data-world-status]');
    const updateStatus = () => {
      const label = labels[scene.dataset.worldArt]?.[Number(scene.dataset.step)];
      if (status && label) status.textContent = window.siteTranslate?.(label) || label;
    };
    scene.querySelector('[data-world-next]')?.addEventListener('click', () => {
      scene.dataset.step = String((Number(scene.dataset.step) + 1) % 3);
      updateStatus();
    });
    window.addEventListener('site-language-change', updateStatus);

    if (!allowPointerMotion || !scene.classList.contains('world-art-tech')) return;
    scene.addEventListener('pointermove', (event) => {
      const rect = scene.getBoundingClientRect();
      scene.style.setProperty('--world-x', `${(((event.clientX - rect.left) / rect.width) - .5) * 18}px`);
      scene.style.setProperty('--world-y', `${(((event.clientY - rect.top) / rect.height) - .5) * 18}px`);
    }, { passive: true });
    scene.addEventListener('pointerleave', () => {
      scene.style.removeProperty('--world-x');
      scene.style.removeProperty('--world-y');
    });
  });
})();
