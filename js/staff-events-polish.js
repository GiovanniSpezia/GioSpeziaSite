(() => {
  const tabs = [...document.querySelectorAll('[data-event-tab]')];
  if (!tabs.length) return;

  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  if (panels.some((panel) => !panel)) return;

  const tablist = tabs[0].parentElement;
  tablist.setAttribute('role', 'tablist');
  panels.forEach((panel) => panel.setAttribute('role', 'tabpanel'));

  const select = (index, focus = false) => {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      select(index);
    });
    tab.addEventListener('keydown', (event) => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
        : event.key === 'Home' ? 0
        : event.key === 'End' ? tabs.length - 1
        : null;
      if (next === null) return;
      event.preventDefault();
      select(next, true);
    });
  });

  const selectFromHash = () => {
    const deepLink = tabs.findIndex((tab) => tab.getAttribute('href') === window.location.hash);
    if (deepLink >= 0) select(deepLink);
  };
  select(0);
  selectFromHash();
  window.addEventListener('hashchange', selectFromHash);
})();
