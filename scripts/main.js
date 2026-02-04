document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.header__toggle');
  const nav = document.querySelector('.header__nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const visible = getComputedStyle(nav).display !== 'none';
      nav.style.display = visible ? 'none' : 'block';
    });
  }

  const root = document.documentElement;
  const buttons = Array.from(document.querySelectorAll('.font-selector__btn'));
  const applyFont = (value) => {
    if (!value) return;
    root.setAttribute('data-font', value);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.font === value)));
  };
  const savedFont = localStorage.getItem('fontPref') || 'cn';
  applyFont(savedFont);
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.font;
      if (!value) return;
      document.body.classList.add('font-switching');
      applyFont(value);
      localStorage.setItem('fontPref', value);
      setTimeout(() => document.body.classList.remove('font-switching'), 150);
      const langMap = { cn: 'zh', en: 'en', jp: 'ja' };
      const nextLng = langMap[value] || 'zh';
      localStorage.setItem('langPref', nextLng);
      if (window.i18next) {
        i18next.changeLanguage(nextLng);
      }
    });
  });

  const updateContent = () => {
    if (!window.i18next) return;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const text = i18next.t(key);
      const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
      const attr = el.getAttribute('data-i18n-attr');
      if (isInput && attr) {
        el.setAttribute(attr, text);
      } else {
        el.textContent = text;
      }
    });
  };

  const savedLang = localStorage.getItem('langPref') || 'zh';
  if (window.i18next && window.i18nextHttpBackend) {
    i18next
      .use(i18nextHttpBackend)
      .init({
        lng: savedLang,
        fallbackLng: 'zh',
        debug: false,
        backend: { loadPath: window.location.origin + '/assets/locales/messages_{{lng}}.json' }
      }, () => {
        updateContent();
        populateDropdown();
      });
    i18next.on('languageChanged', updateContent);
    i18next.on('missingKey', (lng, ns, key) => {
      console.warn('[i18n] missing key:', key, 'for lng:', lng);
    });
  } else {
    // 框架不可用时的降级：不影响页面展示
  }
  
  // Header Dropdown Population
  // We define a function to populate the dropdown, which can be called initially and on language change.
  function populateDropdown() {
      // Only run if NOT on products page (products page handles its own sidebar/dropdown logic usually, 
      // but the header dropdown is global. Ideally, we should update it everywhere.
      // However, product_logic.js might be handling it on product pages.
      // Let's stick to the current logic: if NOT on products page.
      if (window.location.pathname.includes('/products/')) return;

      fetch(window.location.origin + '/assets/products.json')
          .then(res => res.json())
          .then(data => {
              const dropdown = document.getElementById('nav-product-dropdown');
              if (dropdown) {
                  dropdown.innerHTML = '';
                  
                  // Dynamic
                  const cats = new Set(data.map(p => p.category));
                  cats.forEach(c => {
                      const li = document.createElement('li');
                      // Ensure we use the correct key format. 'c' is the raw category name from JSON (e.g. "厨房").
                      // The keys in JSON are like "category.厨房".
                      const catText = i18next.t(`category.${c}`) || c;
                      li.innerHTML = `<a href="/products/?category=${encodeURIComponent(c)}">${catText}</a>`;
                      dropdown.appendChild(li);
                  });
              }
          })
          .catch(err => console.log('Menu load error', err));
  };

  // Initial population handled in init callback
  // populateDropdown();

  // Re-populate on language change to ensure dropdown items are translated
  if (window.i18next) {
      i18next.on('languageChanged', () => {
          populateDropdown();
      });
  }
});

