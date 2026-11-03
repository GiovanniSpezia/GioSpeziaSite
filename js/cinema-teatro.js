(() => {
  const data = window.cinemaTeatroData || { corsi: [], certificati: [], esperienze: [] };
  const scene = document.querySelector('.cinema-visual');
  const sceneButtons = [...document.querySelectorAll('[data-scene-button]')];
  const workButtons = [...document.querySelectorAll('[data-work-button]')];
  const introButtons = [...document.querySelectorAll('[data-intro-chapter]')];
  const introPreview = document.getElementById('cinema-storyboard-preview');
  const workStage = document.querySelector('.cinema-work-stage');
  let activeScene = 'cinema';
  let activeWork = 'cinema';
  let activeIntro = 0;
  const introChapters = [
    { kicker: 'CAPITOLO 01 / IMPARARE', title: 'Formazione', description: 'Corsi e laboratori: qui raccolgo scuole, date e ciò che ho imparato.', action: 'Apri la formazione', href: '#formazione' },
    { kicker: 'CAPITOLO 02 / DOCUMENTARE', title: 'Attestati', description: 'Certificati e attestazioni, con ente e data di rilascio quando disponibili.', action: 'Vedi gli attestati', href: '#certificati-title' },
    { kicker: 'CAPITOLO 03 / METTERSI IN SCENA', title: 'Esperienze', description: 'Progetti e ruoli, dal set al palco, raccontati nel dettaglio.', action: 'Esplora le esperienze', href: '#esperienze' }
  ];

  const isEnglish = () => window.siteLanguage?.() === 'en';
  const translate = (value) => window.siteTranslate?.(value) || value;
  const localized = (entry, key) => isEnglish() && entry[`${key}En`] ? entry[`${key}En`] : entry[key];
  const textNode = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value || '';
    return element;
  };
  const safeLink = (value) => {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };

  const updateIntro = (index, focus = false) => {
    if (!introPreview || !introButtons.length) return;
    activeIntro = index;
    const chapter = introChapters[index];
    introPreview.dataset.chapter = String(index + 1);
    document.getElementById('intro-preview-count').textContent = `${String(index + 1).padStart(2, '0')} — 03`;
    document.getElementById('intro-preview-kicker').textContent = translate(chapter.kicker);
    document.getElementById('intro-preview-title').textContent = translate(chapter.title);
    document.getElementById('intro-preview-description').textContent = translate(chapter.description);
    document.getElementById('intro-preview-link-label').textContent = translate(chapter.action);
    document.getElementById('intro-preview-link').href = chapter.href;
    introButtons.forEach((button, position) => {
      const selected = position === index;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (focus) introButtons[index].focus();
  };

  const empty = (container, description) => {
    const box = textNode('div', 'cinema-empty');
    box.append(textNode('strong', '', translate('Archivio in preparazione')));
    box.append(textNode('p', '', translate(description)));
    container.append(box);
  };

  const renderEntry = (entry, kind) => {
    const article = textNode('article', 'cinema-entry');
    const meta = textNode('div', 'cinema-entry-meta');
    meta.append(textNode('span', '', localized(entry, kind === 'work' ? 'role' : 'provider') || translate('Dettagli in arrivo')));
    if (entry.year) meta.append(textNode('span', '', entry.year));
    article.append(meta, textNode('h4', '', localized(entry, 'title')));
    const description = localized(entry, 'description');
    if (description) article.append(textNode('p', '', description));
    const proof = safeLink(entry.proof);
    if (proof) {
      const link = textNode('a', '', translate('Vedi il materiale ↗'));
      link.href = proof;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      article.append(link);
    }
    return article;
  };

  const renderLearning = (key, id, message) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.replaceChildren();
    const entries = Array.isArray(data[key]) ? data[key].filter(item => item && item.title) : [];
    if (!entries.length) empty(container, message);
    else entries.forEach(entry => container.append(renderEntry(entry, 'learning')));
  };

  const renderWork = () => {
    const container = document.getElementById('esperienze-list');
    if (!container) return;
    const entries = Array.isArray(data.esperienze) ? data.esperienze.filter(item => item && item.title && item.type === activeWork) : [];
    container.replaceChildren();
    if (!entries.length) empty(container, 'I progetti e i ruoli di questa area saranno pubblicati qui.');
    else entries.forEach(entry => container.append(renderEntry(entry, 'work')));
    document.getElementById('work-title').textContent = activeWork === 'cinema' ? 'Cinema' : translate('Teatro');
    document.getElementById('work-index').textContent = activeWork === 'cinema' ? '01 / CINEMA' : translate('02 / TEATRO');
    document.getElementById('work-count').textContent = `${String(entries.length).padStart(2, '0')} ${translate('VOCI')}`;
    workStage.dataset.work = activeWork;
  };

  const updateScene = (value) => {
    activeScene = value;
    scene.dataset.scene = value;
    document.getElementById('scene-caption').textContent = value === 'cinema' ? translate('STORIE DA GUARDARE') : translate('STORIE DA VIVERE');
    document.getElementById('scene-index').textContent = translate(value === 'cinema' ? 'SCENA / 01' : 'SCENA / 02');
    scene.querySelectorAll('.cinema-scene-photo').forEach(photo => {
      photo.setAttribute('aria-hidden', String(!photo.classList.contains(`cinema-scene-photo-${value}`)));
    });
    sceneButtons.forEach(button => {
      const selected = button.dataset.sceneButton === value;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };

  sceneButtons.forEach(button => button.addEventListener('click', () => updateScene(button.dataset.sceneButton)));
  introButtons.forEach((button, index) => {
    button.addEventListener('click', () => updateIntro(index));
    button.addEventListener('keydown', (event) => {
      const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % introButtons.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index - 1 + introButtons.length) % introButtons.length
        : event.key === 'Home' ? 0
        : event.key === 'End' ? introButtons.length - 1
        : null;
      if (next === null) return;
      event.preventDefault();
      updateIntro(next, true);
    });
  });
  workButtons.forEach(button => button.addEventListener('click', () => {
    activeWork = button.dataset.workButton;
    workButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderWork();
  }));

  const render = () => {
    renderLearning('corsi', 'corsi-list', 'Qui troverai corsi e laboratori, con scuola, anno e contenuti del percorso.');
    renderLearning('certificati', 'certificati-list', 'Qui troverai gli attestati e i certificati, con ente e data di rilascio.');
    renderWork();
    updateScene(activeScene);
    updateIntro(activeIntro);
  };
  window.addEventListener('site-language-change', render);
  render();
})();
