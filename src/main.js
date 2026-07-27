const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const languageTrigger = document.querySelector('.language-trigger');
const languageMenu = document.querySelector('.language-menu');
const languageCurrent = document.querySelector('.language-current');
const languageOptions = [...document.querySelectorAll('.language-option')];
const themeColor = document.querySelector('meta[name="theme-color"]');
const supportedLanguages = ['en', 'zh-TW', 'zh-CN'];
const supportedThemes = ['system', 'light', 'dark'];
const languageLabels = { en: 'English', 'zh-TW': '繁體中文', 'zh-CN': '简体中文' };
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const translations = {
  en: {
    pageTitle: "Moran Jianghe · Personal Homepage",
    description: "Moran Jianghe's personal homepage",
    nav: { label: 'Main navigation', about: 'About', links: 'Links', skip: 'Skip to content' },
    language: { label: 'Language', system: 'System', en: 'English', 'zh-TW': 'Traditional Chinese', 'zh-CN': 'Simplified Chinese' },
    avatarLabel: "Moran Jianghe's portrait",
    avatarAlt: "Moran Jianghe's portrait",
    theme: { label: 'Theme', system: 'System', lightOption: 'Light', darkOption: 'Dark' },
    hero: {
      eyebrow: 'PERSONAL HOMEPAGE',
      cta: 'Learn more',
    },
    sections: {
      aboutLabel: 'ABOUT',
      aboutTitle: 'About me',
      aboutIntro: 'This is where my introduction should be.',
      aboutPending: 'It is not written yet.',
      linksLabel: 'LINKS',
      linksTitle: 'Find me online',
    },
  },
  'zh-TW': {
    pageTitle: '墨染江河 · 個人主頁',
    description: '墨染江河的個人主頁',
    nav: { label: '主導航', about: '關於', links: '連結', skip: '跳至內容' },
    language: { label: '語言', system: '系統預設', en: 'English', 'zh-TW': '繁體中文', 'zh-CN': '簡體中文' },
    avatarLabel: '墨染江河的頭像',
    avatarAlt: '墨染江河的頭像',
    theme: { label: '主題', system: '系統預設', lightOption: '淺色', darkOption: '深色' },
    hero: {
      eyebrow: 'PERSONAL HOMEPAGE',
      cta: '了解更多',
    },
    sections: {
      aboutLabel: 'ABOUT',
      aboutTitle: '自我介紹',
      aboutIntro: '這裡是我的自我介紹。',
      aboutPending: '還沒寫呢',
      linksLabel: 'LINKS',
      linksTitle: '找到我',
    },
  },
  'zh-CN': {
    pageTitle: '墨染江河 · 个人主页',
    description: '墨染江河的个人主页',
    nav: { label: '主导航', about: '关于', links: '链接', skip: '跳转到内容' },
    language: { label: '语言', system: '系统默认', en: 'English', 'zh-TW': '繁体中文', 'zh-CN': '简体中文' },
    avatarLabel: '墨染江河的头像',
    avatarAlt: '墨染江河的头像',
    theme: { label: '主题', system: '系统默认', lightOption: '浅色', darkOption: '深色' },
    hero: {
      eyebrow: 'PERSONAL HOMEPAGE',
      cta: '了解更多',
    },
    sections: {
      aboutLabel: 'ABOUT',
      aboutTitle: '自我介绍',
      aboutIntro: '这里是我的自我介绍。',
      aboutPending: '还没写呢',
      linksLabel: 'LINKS',
      linksTitle: '找到我',
    },
  },
};

function getValue(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function resolveLanguage(locale) {
  if (!locale) return null;
  const normalized = locale.toLowerCase().replace('_', '-');
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('zh-tw') || normalized.startsWith('zh-hk') || normalized.startsWith('zh-mo') || normalized.includes('hant')) {
    return 'zh-TW';
  }
  if (normalized.startsWith('zh-cn') || normalized.startsWith('zh-sg') || normalized.includes('hans') || normalized === 'zh') {
    return 'zh-CN';
  }
  return null;
}

function detectBrowserLanguage() {
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return browserLanguages.map(resolveLanguage).find(Boolean) || 'en';
}

function detectLanguage() {
  const savedLanguage = localStorage.getItem('language');
  return supportedLanguages.includes(savedLanguage) ? savedLanguage : detectBrowserLanguage();
}

function detectTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeToggle(mode, copy = translations[root.lang] || translations.en) {
  const labels = {
    system: copy.theme.system,
    light: copy.theme.lightOption,
    dark: copy.theme.darkOption,
  };
  const label = labels[mode] || labels.system;
  themeToggle.dataset.themeMode = mode;
  themeToggle.setAttribute('aria-label', `${copy.theme.label}: ${label}`);
  themeToggle.title = `${copy.theme.label}: ${label}`;
  themeToggle.querySelectorAll('[data-theme-icon]').forEach((icon) => {
    icon.dataset.active = String(icon.dataset.themeIcon === mode);
  });
}

function setTheme(mode, { persist = false } = {}) {
  const themeMode = supportedThemes.includes(mode) ? mode : 'system';
  const resolvedTheme = themeMode === 'system' ? detectTheme() : themeMode;
  root.dataset.theme = resolvedTheme;
  root.dataset.themeMode = themeMode;
  updateThemeToggle(themeMode);
  themeColor.setAttribute('content', resolvedTheme === 'dark' ? '#151716' : '#f5f3ee');
  if (persist) localStorage.setItem('theme', themeMode);
}

function setLanguage(mode, { persist = false } = {}) {
  const languageMode = mode === 'system' || supportedLanguages.includes(mode) ? mode : 'system';
  const language = languageMode === 'system' ? detectBrowserLanguage() : languageMode;
  const copy = translations[language] || translations.en;
  languageCurrent.textContent = languageMode === 'system' ? copy.language.system : languageLabels[languageMode];
  languageOptions.forEach((option) => {
    const optionMode = option.dataset.languageMode;
    option.setAttribute('aria-selected', String(optionMode === languageMode));
    option.querySelector('[data-language-label]').textContent = optionMode === 'system' ? copy.language.system : languageLabels[optionMode];
  });
  root.lang = language;
  document.title = copy.pageTitle;
  document.querySelector('meta[name="description"]').setAttribute('content', copy.description);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = getValue(copy, element.dataset.i18n);
    if (value) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', copy[element.dataset.i18nAriaLabel]);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
    element.setAttribute('alt', copy[element.dataset.i18nAlt]);
  });
  document.querySelector('.top-nav').setAttribute('aria-label', copy.nav.label);
  languageTrigger.setAttribute('aria-label', copy.language.label);
  languageTrigger.title = copy.language.label;
  updateThemeToggle(root.dataset.themeMode || 'system', copy);
  if (persist) localStorage.setItem('language', languageMode);
}

function setLanguageMenu(open) {
  languageMenu.hidden = !open;
  languageTrigger.setAttribute('aria-expanded', String(open));
}

languageTrigger.addEventListener('click', () => setLanguageMenu(languageMenu.hidden));
languageTrigger.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    setLanguageMenu(true);
    const selected = languageOptions.find((option) => option.getAttribute('aria-selected') === 'true');
    selected?.focus();
  }
});

languageOptions.forEach((option, index) => {
  option.addEventListener('click', () => {
    setLanguage(option.dataset.languageMode, { persist: true });
    setLanguageMenu(false);
    languageTrigger.focus();
  });
  option.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setLanguageMenu(false);
      languageTrigger.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      languageOptions[(index + offset + languageOptions.length) % languageOptions.length].focus();
    }
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.language-control')) setLanguageMenu(false);
});

themeToggle.addEventListener('click', () => {
  const currentMode = supportedThemes.includes(root.dataset.themeMode) ? root.dataset.themeMode : 'system';
  const nextMode = supportedThemes[(supportedThemes.indexOf(currentMode) + 1) % supportedThemes.length];
  setTheme(nextMode, { persist: true });
});
systemThemeQuery.addEventListener('change', () => {
  if (root.dataset.themeMode === 'system') setTheme('system');
});

function setupScrollReveal() {
  const revealElements = [...document.querySelectorAll('[data-reveal]')];

  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealElements.forEach((element, index) => {
    const delay = element.dataset.revealDelay ?? Math.min(index * 55, 220);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    revealObserver.observe(element);
  });
}

function setupPortraitMotion() {
  const portraitFrame = document.querySelector('.portrait-frame');
  const pointerQuery = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
  if (!portraitFrame || reducedMotionQuery.matches || !pointerQuery.matches) return;

  let frameRequest = 0;
  let pointerPosition;

  const renderTilt = () => {
    frameRequest = 0;
    if (!pointerPosition) return;
    portraitFrame.style.setProperty('--tilt-x', `${pointerPosition.y}deg`);
    portraitFrame.style.setProperty('--tilt-y', `${pointerPosition.x}deg`);
  };

  portraitFrame.addEventListener('pointermove', (event) => {
    const bounds = portraitFrame.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3.2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3.2;
    pointerPosition = { x: x.toFixed(2), y: y.toFixed(2) };
    portraitFrame.classList.add('is-pointer-active');
    if (!frameRequest) frameRequest = requestAnimationFrame(renderTilt);
  });

  portraitFrame.addEventListener('pointerleave', () => {
    pointerPosition = { x: 0, y: 0 };
    portraitFrame.classList.remove('is-pointer-active');
    if (!frameRequest) frameRequest = requestAnimationFrame(renderTilt);
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
const savedTheme = localStorage.getItem('theme');
const savedLanguage = localStorage.getItem('language');
setTheme(supportedThemes.includes(savedTheme) ? savedTheme : 'system');
setLanguage(savedLanguage === 'system' || supportedLanguages.includes(savedLanguage) ? savedLanguage : 'system');
root.dataset.motionReady = 'true';
setupScrollReveal();
setupPortraitMotion();
