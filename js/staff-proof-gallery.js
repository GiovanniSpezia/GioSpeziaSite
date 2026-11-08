(() => {
    const dialog = document.querySelector('[data-staff-proof-lightbox]');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('[data-proof-image]');
    const title = dialog.querySelector('[data-proof-title]');
    const community = dialog.querySelector('[data-proof-community]');
    const count = dialog.querySelector('[data-proof-count]');
    const thumbnails = dialog.querySelector('[data-proof-thumbnails]');
    const progress = dialog.querySelector('.staff-proof-progress');
    const zoomButton = dialog.querySelector('[data-proof-zoom]');
    const triggers = [...document.querySelectorAll('[data-proof-gallery]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let entries = [];
    let current = 0;
    let trigger = null;
    let swipeStart = null;

    const setZoom = (enabled) => {
        dialog.classList.toggle('is-image-expanded', enabled);
        zoomButton.setAttribute('aria-pressed', String(enabled));
        zoomButton.setAttribute('aria-label', enabled ? 'Riduci l’immagine' : 'Ingrandisci foto');
        zoomButton.querySelector('i').className = `fa-solid ${enabled ? 'fa-compress' : 'fa-expand'}`;
        zoomButton.querySelector('span').textContent = enabled ? 'Riduci' : 'Ingrandisci';
    };

    const show = (index) => {
        if (!entries.length) return;
        current = (index + entries.length) % entries.length;
        const entry = entries[current];
        image.classList.remove('is-entering');
        image.src = entry.src;
        image.alt = `${entry.community}: prova ${current + 1}`;
        title.textContent = entry.community;
        community.textContent = entry.community;
        count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
        progress?.style.setProperty('--proof-progress', `${((current + 1) / entries.length) * 100}%`);
        thumbnails.querySelectorAll('button').forEach((button, i) => {
            button.classList.toggle('is-active', i === current);
            button.setAttribute('aria-pressed', String(i === current));
        });
        if (dialog.open && !reducedMotion.matches) {
            void image.offsetWidth;
            image.classList.add('is-entering');
        }
    };

    triggers.forEach((link) => link.addEventListener('click', (event) => {
        event.preventDefault();
        const card = link.closest('.staff-card');
        const name = card?.querySelector('h3')?.textContent.trim() || 'Esperienza';
        entries = (link.dataset.proofImages || '').split(',').filter(Boolean).map((file) => ({
            src: `../img/proofs/${encodeURIComponent(link.dataset.proofGallery)}/${encodeURIComponent(file)}`,
            community: name
        }));
        if (!entries.length) return;
        trigger = link;
        thumbnails.replaceChildren();
        entries.forEach((entry, index) => {
            const button = document.createElement('button');
            const thumb = document.createElement('img');
            button.type = 'button';
            thumb.src = entry.src;
            thumb.alt = '';
            thumb.loading = 'lazy';
            button.setAttribute('aria-label', `Mostra foto ${index + 1} di ${entries.length}`);
            button.append(thumb);
            button.addEventListener('click', () => show(index));
            thumbnails.append(button);
        });
        const singleImage = entries.length < 2;
        dialog.querySelector('[data-proof-prev]').hidden = singleImage;
        dialog.querySelector('[data-proof-next]').hidden = singleImage;
        thumbnails.hidden = singleImage;
        progress.hidden = singleImage;
        show(0);
        dialog.showModal();
        dialog.querySelector('[data-proof-close]').focus();
    }));

    dialog.querySelector('[data-proof-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-proof-prev]').addEventListener('click', () => show(current - 1));
    dialog.querySelector('[data-proof-next]').addEventListener('click', () => show(current + 1));
    zoomButton.addEventListener('click', () => {
        const zoomed = !dialog.classList.contains('is-image-expanded');
        setZoom(zoomed);
    });
    image.addEventListener('click', () => zoomButton.click());
    dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dialog.classList.contains('is-image-expanded')) {
            event.preventDefault();
            setZoom(false);
            return;
        }
        if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    });
    const surface = dialog.querySelector('[data-proof-swipe]');
    surface.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') swipeStart = { x: event.clientX, y: event.clientY };
    });
    surface.addEventListener('pointerup', (event) => {
        if (!swipeStart) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) show(current + (dx < 0 ? 1 : -1));
        swipeStart = null;
    });
    surface.addEventListener('pointercancel', () => { swipeStart = null; });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
        setZoom(false);
        image.removeAttribute('src');
        image.classList.remove('is-entering');
        dialog.querySelector('[data-proof-prev]').hidden = false;
        dialog.querySelector('[data-proof-next]').hidden = false;
        thumbnails.hidden = false;
        progress.hidden = false;
        thumbnails.replaceChildren();
        entries = [];
        trigger?.focus();
        trigger = null;
    });
})();
