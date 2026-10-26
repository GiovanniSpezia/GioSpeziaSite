(() => {
  const isEnglish = () => (window.siteLanguage?.() || document.documentElement.lang) === 'en';
  const say = (it, en) => isEnglish() ? en : it;

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const required = ['nome', 'email', 'oggetto', 'messaggio'].map(id => contactForm.querySelector(`#${id}`));
    const progress = contactForm.querySelector('.form-progress-track');
    const progressFill = document.getElementById('form-progress-fill');
    const progressText = document.getElementById('form-progress-text');
    const messageCount = document.getElementById('message-count');
    const previewToggle = contactForm.querySelector('.email-preview-toggle');
    const preview = document.getElementById('email-preview');
    const previewBody = document.getElementById('email-preview-body');
    const previewSubject = document.getElementById('email-preview-subject');
    const previewToLabel = document.getElementById('email-preview-to-label');
    const previewSubjectLabel = document.getElementById('email-preview-subject-label');
    const fields = [...contactForm.querySelectorAll('input, textarea, select')];

    const fieldError = field => {
      let helper = field.parentElement.querySelector('.field-error');
      if (!helper) {
        helper = document.createElement('small');
        helper.className = 'field-error';
        helper.id = `${field.id}-error`;
        helper.hidden = true;
        field.parentElement.append(helper);
        field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), helper.id].filter(Boolean).join(' '));
      }
      return helper;
    };

    const setFieldState = (field, showError = false) => {
      const value = field.value.trim();
      const valid = value !== '' && field.checkValidity();
      const helper = fieldError(field);
      const invalid = showError && !valid;
      field.setAttribute('aria-invalid', String(invalid));
      helper.hidden = !invalid;
      if (invalid) {
        helper.textContent = field.type === 'email' && value
          ? say('Inserisci un indirizzo email valido.', 'Enter a valid email address.')
          : say('Completa questo campo.', 'Please complete this field.');
      }
      return valid;
    };

    const updateProgress = () => {
      const completed = required.filter(field => field.value.trim() && field.checkValidity()).length;
      progress.setAttribute('aria-valuenow', String(completed));
      progress.setAttribute('aria-valuetext', say(`${completed} di 4 campi essenziali`, `${completed} of 4 essential fields`));
      progressFill.style.width = `${completed * 25}%`;
      progressText.textContent = say(`${completed} di 4 campi essenziali`, `${completed} of 4 essential fields`);
      const count = contactForm.elements.messaggio.value.length;
      messageCount.textContent = say(`${count} ${count === 1 ? 'carattere' : 'caratteri'}`, `${count} ${count === 1 ? 'character' : 'characters'}`);
    };

    const updatePreview = () => {
      const value = id => contactForm.elements[id].value.trim() || '—';
      const category = contactForm.elements.tipoRichiesta.value.trim();
      previewToLabel.textContent = say('A', 'To');
      previewSubjectLabel.textContent = say('Oggetto', 'Subject');
      previewSubject.textContent = value('oggetto');
      previewBody.textContent = [
        `${say('Nome', 'Name')}: ${value('nome')}`,
        `${say('Email', 'Email')}: ${value('email')}`,
        ...(category ? [`${say('Tipologia', 'Request type')}: ${category}`] : []),
        `${say('Oggetto', 'Subject')}: ${value('oggetto')}`,
        '',
        `${say('Messaggio', 'Message')}:`,
        '--------------------',
        value('messaggio')
      ].join('\n');
    };

    required.forEach(field => {
      fieldError(field);
      field.addEventListener('blur', () => setFieldState(field, true));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') setFieldState(field, true);
      });
    });
    fields.forEach(field => field.addEventListener('input', () => {
      updateProgress();
      if (!preview.hidden) updatePreview();
    }));
    contactForm.elements.tipoRichiesta.addEventListener('change', () => {
      if (!preview.hidden) updatePreview();
    });
    contactForm.addEventListener('submit', event => {
      const invalid = required.filter(field => !setFieldState(field, true));
      updateProgress();
      if (invalid.length) {
        event.preventDefault();
        event.stopImmediatePropagation();
        invalid[0].focus();
      }
    }, true);
    previewToggle.addEventListener('click', () => {
      const open = preview.hidden;
      preview.hidden = !open;
      previewToggle.setAttribute('aria-expanded', String(open));
      previewToggle.querySelector('span').textContent = open ? '−' : '＋';
      if (open) updatePreview();
    });

    const copyButton = document.querySelector('.contact-copy-email');
    const copyFeedback = document.querySelector('.contact-copy-feedback');
    copyButton?.addEventListener('click', async () => {
      let copied = false;
      try {
        await navigator.clipboard.writeText(copyButton.dataset.email);
        copied = true;
      } catch {
        const temporary = document.createElement('textarea');
        temporary.value = copyButton.dataset.email;
        temporary.style.position = 'fixed';
        temporary.style.opacity = '0';
        document.body.append(temporary);
        temporary.select();
        try { copied = document.execCommand('copy'); } catch { /* Clipboard unavailable. */ }
        temporary.remove();
      }
      copyFeedback.textContent = copied
        ? say('Indirizzo copiato negli appunti.', 'Email address copied to clipboard.')
        : say('Copia non disponibile. Usa il collegamento email.', 'Copy unavailable. Use the email link.');
      copyFeedback.dataset.copyState = copied ? 'copied' : 'unavailable';
    });
    window.addEventListener('site-language-change', () => {
      updateProgress();
      if (!preview.hidden) updatePreview();
      if (copyFeedback.dataset.copyState) {
        copyFeedback.textContent = copyFeedback.dataset.copyState === 'copied'
          ? say('Indirizzo copiato negli appunti.', 'Email address copied to clipboard.')
          : say('Copia non disponibile. Usa il collegamento email.', 'Copy unavailable. Use the email link.');
      }
      required.forEach(field => {
        if (field.getAttribute('aria-invalid') === 'true') setFieldState(field, true);
      });
    });
    updateProgress();
  }

  const privacySection = document.getElementById('privacy');
  if (privacySection) {
    const links = [...privacySection.querySelectorAll('.privacy-toc a')];
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const fill = document.getElementById('privacy-read-progress-fill');
    const content = document.getElementById('content');
    let ticking = false;
    const updateReading = () => {
      ticking = false;
      if (!privacySection.getClientRects().length) {
        fill.style.width = '0%';
        links.forEach((link, index) => {
          link.classList.toggle('is-active', index === 0);
          if (index === 0) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        return;
      }
      const rect = privacySection.getBoundingClientRect();
      const total = Math.max(1, rect.height - innerHeight * .5);
      const passed = Math.min(1, Math.max(0, (innerHeight * .25 - rect.top) / total));
      fill.style.width = `${Math.round(passed * 100)}%`;
      let activeIndex = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top < Math.min(230, innerHeight * .38)) activeIndex = index;
      });
      links.forEach((link, index) => {
        const current = index === activeIndex;
        link.classList.toggle('is-active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      sections.forEach((section, index) => section.classList.toggle('is-current', index === activeIndex));
    };
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateReading);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('hashchange', schedule);
    const manageCookies = document.getElementById('privacy-manage-cookies');
    const cookieDialog = document.getElementById('cookieBox');
    let restoreCookieFocus = false;
    manageCookies?.addEventListener('click', () => {
      restoreCookieFocus = true;
      window.dispatchEvent(new Event('openCookiePreferences'));
    });
    if (cookieDialog && manageCookies) {
      const dialogObserver = new MutationObserver(() => {
        if (!restoreCookieFocus || !cookieDialog.hidden) return;
        restoreCookieFocus = false;
        manageCookies.focus({ preventScroll: true });
      });
      dialogObserver.observe(cookieDialog, { attributes: true, attributeFilter: ['hidden'] });
    }
    if (content && !content.getClientRects().length) {
      const visibilityObserver = new MutationObserver(() => {
        if (!content.getClientRects().length) return;
        visibilityObserver.disconnect();
        schedule();
      });
      visibilityObserver.observe(content, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
    }
    updateReading();
  }

  const errorPage = document.querySelector('.street-404');
  if (errorPage) {
    const path = document.getElementById('error-path');
    if (path) {
      try { path.textContent = decodeURI(location.pathname || '/'); }
      catch { path.textContent = location.pathname || '/'; }
    }
    const languageButtons = [...errorPage.querySelectorAll('[data-error-language]')];
    const syncLanguage = () => {
      languageButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.errorLanguage === (window.siteLanguage?.() || 'it')));
      });
    };
    languageButtons.forEach(button => button.addEventListener('click', () => {
      if (button.dataset.errorLanguage === window.siteLanguage?.()) return;
      try { localStorage.setItem('giospezia-language', button.dataset.errorLanguage); } catch { return; }
      location.reload();
    }));
    window.addEventListener('site-language-change', syncLanguage);
    syncLanguage();
  }
})();
