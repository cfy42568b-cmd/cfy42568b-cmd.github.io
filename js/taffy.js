(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let manualTheme = null;
  try { manualTheme = localStorage.getItem('taffy-theme'); } catch (_) { /* Storage is optional. */ }
  if (!['light', 'dark'].includes(manualTheme)) manualTheme = null;
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    themeMeta.content = theme === 'dark' ? '#191b22' : '#f7f8fa';
  }
  setTheme(manualTheme || (systemTheme.matches ? 'dark' : 'light'));
  themeButton.addEventListener('click', () => {
    manualTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(manualTheme);
    try { localStorage.setItem('taffy-theme', manualTheme); } catch (_) { /* Private browsing still supports the toggle. */ }
  });
  systemTheme.addEventListener('change', event => {
    if (!manualTheme) setTheme(event.matches ? 'dark' : 'light');
  });

  const menu = document.querySelector('.site-nav');
  const menuButton = document.querySelector('.menu-toggle');
  function closeMenu() {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '展开导航菜单');
  }
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '收起导航菜单' : '展开导航菜单');
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const dialog = document.querySelector('.search-dialog');
  const input = document.querySelector('#article-search');
  const results = [...dialog.querySelectorAll('[data-search-text]')];
  const resultStatus = dialog.querySelector('.search-status');
  function updateSearch() {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    results.forEach(result => {
      const match = terms.every(term => result.dataset.searchText.includes(term));
      result.hidden = !match;
      if (match) count += 1;
    });
    dialog.querySelector('.search-empty').hidden = count > 0;
    resultStatus.textContent = terms.length ? `找到 ${count} 篇相关文章` : `共 ${results.length} 篇文章`;
  }
  function openSearch() {
    if (dialog.open) return;
    closeMenu();
    input.value = '';
    updateSearch();
    dialog.showModal();
    input.focus();
  }
  document.querySelector('[data-search-open]').addEventListener('click', openSearch);
  dialog.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  input.addEventListener('input', updateSearch);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = results.find(result => !result.hidden);
      if (first) window.location.assign(first.href);
    }
  });
  document.addEventListener('keydown', event => {
    const editing = /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable;
    if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  const copyButton = document.querySelector('.copy-link');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const status = document.querySelector('.copy-status');
      const url = document.querySelector('link[rel="canonical"]').href;
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = '链接已复制，感谢分享。';
      } catch (_) {
        status.textContent = `暂时无法自动复制，请手动复制：${url}`;
      }
    });
  }

  const article = document.querySelector('.article-paper');
  if (article) {
    const progress = document.querySelector('.reading-progress > span');
    const headings = [...article.querySelectorAll('h2[id], h3[id]')];
    const tocLinks = [...document.querySelectorAll('.toc nav a')];
    let scheduled = false;
    function updateReading() {
      const start = article.offsetTop;
      const distance = Math.max(1, article.offsetHeight - window.innerHeight);
      const amount = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      progress.style.transform = `scaleX(${amount})`;
      let current = null;
      headings.forEach(heading => {
        if (heading.getBoundingClientRect().top <= 160) current = heading.id;
      });
      tocLinks.forEach(link => {
        if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      scheduled = false;
    }
    function scheduleReading() {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(updateReading);
      }
    }
    window.addEventListener('scroll', scheduleReading, { passive: true });
    window.addEventListener('resize', scheduleReading);
    updateReading();
  }
})();
