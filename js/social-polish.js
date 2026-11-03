(() => {
    const dialog = document.querySelector('[data-social-lightbox]');
    const cards = [...document.querySelectorAll('[data-journal-open]')];
    const dialogImage = dialog?.querySelector('[data-lightbox-image]');
    const dialogTitle = dialog?.querySelector('[data-lightbox-title]');
    const dialogDescription = dialog?.querySelector('[data-lightbox-description]');
    const dialogCount = dialog?.querySelector('[data-lightbox-count]');
    const thumbnailRail = dialog?.querySelector('[data-lightbox-thumbnails]');
    const swipeSurface = dialog?.querySelector('[data-lightbox-swipe]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentIndex = 0;
    let trigger = null;
    let swipeStart = null;
    let thumbnailButtons = [];

    const showImage = (index, animate = true) => {
        if (!dialogImage || !dialogTitle || !dialogCount || !cards.length) return;
        currentIndex = (index + cards.length) % cards.length;
        const source = cards[currentIndex];
        const image = source.querySelector('img');
        const title = source.querySelector('strong');
        dialogImage.classList.remove('is-entering');
        dialogImage.src = image.currentSrc || image.src;
        dialogImage.alt = image.alt;
        dialogTitle.textContent = title.textContent;
        if (dialogDescription) dialogDescription.textContent = image.alt;
        dialogCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
        dialog.style.setProperty('--lightbox-progress', `${((currentIndex + 1) / cards.length) * 100}%`);
        thumbnailButtons.forEach((button, buttonIndex) => {
            const selected = buttonIndex === currentIndex;
            button.classList.toggle('is-active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        if (animate && dialog.open && !reducedMotion.matches) {
            void dialogImage.offsetWidth;
            dialogImage.classList.add('is-entering');
        }
    };

    if (dialog && typeof dialog.showModal === 'function') {
        if (thumbnailRail) {
            thumbnailButtons = cards.map((card, index) => {
                const button = document.createElement('button');
                const thumbnail = document.createElement('img');
                button.type = 'button';
                thumbnail.src = card.querySelector('img').currentSrc || card.querySelector('img').src;
                thumbnail.alt = '';
                thumbnail.loading = 'lazy';
                button.append(thumbnail);
                button.addEventListener('click', () => showImage(index));
                thumbnailRail.append(button);
                return button;
            });
        }
        const updateThumbnailLabels = () => {
            thumbnailButtons.forEach((button, index) => {
                const title = cards[index].querySelector('strong').textContent;
                button.setAttribute('aria-label', `${window.siteLanguage?.() === 'en' ? 'Show' : 'Mostra'}: ${title}`);
            });
        };
        updateThumbnailLabels();
        window.addEventListener('site-language-change', () => queueMicrotask(updateThumbnailLabels));
        cards.forEach((card, index) => {
            card.addEventListener('click', (event) => {
                event.preventDefault();
                trigger = card;
                showImage(index);
                if (!dialog.open) dialog.showModal();
                document.documentElement.classList.add('social-lightbox-open');
                dialog.querySelector('[data-lightbox-close]')?.focus();
            });
        });
        dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
        dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showImage(currentIndex - 1));
        dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showImage(currentIndex + 1));
        dialog.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentIndex - 1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentIndex + 1); }
            if (event.key === 'Home') { event.preventDefault(); showImage(0); }
            if (event.key === 'End') { event.preventDefault(); showImage(cards.length - 1); }
        });
        swipeSurface?.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'touch') swipeStart = { x: event.clientX, y: event.clientY };
        });
        swipeSurface?.addEventListener('pointerup', (event) => {
            if (!swipeStart) return;
            const deltaX = event.clientX - swipeStart.x;
            const deltaY = event.clientY - swipeStart.y;
            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) showImage(currentIndex + (deltaX < 0 ? 1 : -1));
            swipeStart = null;
        });
        swipeSurface?.addEventListener('pointercancel', () => { swipeStart = null; });
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) dialog.close();
        });
        dialog.addEventListener('close', () => {
            dialogImage.removeAttribute('src');
            dialogImage.classList.remove('is-entering');
            document.documentElement.classList.remove('social-lightbox-open');
            trigger?.focus();
            trigger = null;
        });
    }

    // Page-local copy keeps the shared language switcher complete without
    // changing the site's global translation file from this scoped page edit.
    const translations = {
        'Social hub / 01': 'Social hub / 01',
        'Fuori dal feed.': 'Beyond the feed.',
        'Dentro le idee.': 'Inside the ideas.',
        'Progetti, video e allenamento. Qui condivido idee, esperimenti e momenti del mio percorso.': 'Projects, videos and training. Here I share ideas, experiments and moments from my journey.',
        'Esplora tutti i canali': 'Explore all channels',
        '01 / I CANALI': '01 / CHANNELS',
        'Una voce, più linguaggi.': 'One voice, many formats.',
        'Scorri, trascina o scegli un canale per scoprire dove ci troviamo.': 'Browse, drag or choose a channel to find me there.',
        'CANALE SELEZIONATO': 'SELECTED CHANNEL',
        'Trascina per esplorare': 'Drag to explore',
        '08 CANALI': '08 CHANNELS',
        '02 / PERSONALE': '02 / PERSONAL',
        '02 / VISUAL DIARY': '02 / VISUAL DIARY',
        'Frame dal mio percorso.': 'Frames from my journey.',
        'Identità, allenamento e progressi: tre frammenti del percorso che condivido online.': 'Identity, training and progress: three glimpses of the journey I share online.',
        'IDENTITÀ': 'IDENTITY',
        'Dietro il profilo': 'Behind the profile',
        'MOVIMENTO': 'MOVEMENT',
        'In allenamento': 'In training',
        'SKILL / CALISTHENICS': 'SKILL / CALISTHENICS',
        'Verso il front lever': 'Working toward the front lever',
        'Una selezione dall’archivio del sito': 'Selected from this site’s archive',
        '03 / VIDEO': '03 / VIDEO',
        '01 / NOVITÀ': '01 / NEW',
        'Nuovo video su YouTube': 'New video on YouTube',
        'Guarda il mio ultimo video sul canale.': 'Watch my latest video on the channel.',
        'Nuovo video di GioSpezia su YouTube': 'New GioSpezia video on YouTube',
        'Video da guardare con calma.': 'Videos to take your time with.',
        'Approfondimenti, prove e un po’ di me. Scegli da dove iniziare.': 'Deep dives, experiments and a little about me. Choose where to start.',
        '10 software gratuiti per lavorare meglio al PC': '10 free tools to work better on your PC',
        'Una selezione pratica di strumenti per organizzarsi, creare e proteggere il proprio lavoro digitale.': 'A practical selection of tools to organize, create and protect your digital work.',
        'Apri su YouTube': 'Open on YouTube',
        'Piacere, sono Giovanni.': 'Hi, I’m Giovanni.',
        'Da dove nascono le mie passioni, tra tecnologia, crescita personale e calisthenics.': 'Where my interests in technology, personal growth and calisthenics began.',
        'Altri video sul canale': 'More videos on the channel',
        'Visita il mio canale': 'Visit my channel',
        '04 / CONTATTO': '04 / CONTACT',
        'Le idee migliori iniziano parlando.': 'The best ideas start with a conversation.',
        'Hai in mente un progetto, una collaborazione o vuoi semplicemente fare due chiacchiere? Scrivimi.': 'Have a project or collaboration in mind, or simply want to talk? Write to me.',
        'Scrivimi un’email': 'Send me an email',
        'Vai alla pagina contatti': 'Go to contact page',
        'Galleria visiva': 'Visual gallery',
        'GIO / ARCHIVIO': 'GIO / ARCHIVE',
        'Scegli un’immagine': 'Choose an image',
        'Indietro': 'Previous',
        'Avanti': 'Next',
        'Scegli un canale social': 'Choose a social channel',
        'Esplora i miei canali social': 'Explore my social channels',
        'Seleziona una piattaforma': 'Select a platform',
        'Canale precedente': 'Previous channel',
        'Canale successivo': 'Next channel',
        'Chiudi la galleria': 'Close gallery',
        'Immagine precedente': 'Previous image',
        'Immagine successiva': 'Next image',
        'Tutti i canali social': 'All social channels',
        'Ritratto di Giovanni Spezia': 'Portrait of Giovanni Spezia',
        'Un frame di un video di allenamento': 'A frame from a training video',
        'Giovanni allena una progressione del front lever alle parallele con un elastico: forza, controllo e costanza in ogni allenamento.': 'Giovanni trains a front lever progression on parallettes with a resistance band: strength, control and consistency in every session.'
    };

    const translatePageCopy = () => {
        const description = document.querySelector('meta[name="description"]');
        const english = window.siteLanguage?.() === 'en';
        if (description) description.content = english
            ? 'GioSpezia’s channels: videos, projects, training and a visual diary of creativity and technology.'
            : 'I canali di GioSpezia: video, progetti, allenamento e un diario visivo tra creatività e tecnologia.';
        const root = document.getElementById('content');
        if (!root) return;
        if (english) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                const source = node.nodeValue;
                const key = source.trim();
                if (translations[key]) node.nodeValue = source.replace(key, translations[key]);
            }
            root.querySelectorAll('[aria-label], [alt]').forEach((element) => {
                for (const attribute of ['aria-label', 'alt']) {
                    const value = element.getAttribute(attribute);
                    if (translations[value]) element.setAttribute(attribute, translations[value]);
                }
            });
        }
        if (dialog?.open) showImage(currentIndex, false);
    };

    window.addEventListener('site-language-change', translatePageCopy);
    translatePageCopy();
})();
