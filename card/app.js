(function () {
  'use strict';

  var ICONS = {
    portfolio: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.6" y="3.6" width="14.8" height="12.8" rx="2.2"/><circle cx="7.4" cy="8.2" r="1.6"/><path d="M4.4 13.6c.6-1.5 1.7-2.3 3-2.3s2.4.8 3 2.3"/><path d="M12.4 7.6h3M12.4 10.4h3M12.4 13.2h3"/></svg>',
    linkedin: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.8" y="2.8" width="14.4" height="14.4" rx="2.4"/><path d="M6.4 8.4v5.1M6.4 5.9v.1M9.7 13.5V8.4M9.7 10.9c0-1.6.9-2.7 2.2-2.7 1.4 0 2.2 1 2.2 2.7v2.6"/></svg>',
    github: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 2.9a5.7 5.7 0 0 0-1.8 11.1c.3.1.4-.1.4-.3v-1.1c-1.6.3-2-.7-2-.7-.3-.7-.7-.9-.7-.9-.5-.4 0-.4 0-.4.6 0 .9.6.9.6.5.9 1.4.7 1.8.5.1-.4.2-.7.4-.9-1.4-.2-2.8-.7-2.8-3.1 0-.7.2-1.2.6-1.7-.1-.2-.3-.8.1-1.6 0 0 .5-.2 1.6.6a5.5 5.5 0 0 1 2.9 0c1.1-.8 1.6-.6 1.6-.6.4.8.2 1.4.1 1.6.4.5.6 1 .6 1.7 0 2.4-1.4 2.9-2.8 3.1.2.2.4.6.4 1.2v1.7c0 .2.1.4.4.3a5.7 5.7 0 0 0-1.8-11.1Z"/></svg>',
    cv: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.2 2.9h6.1l3.5 3.5v10.7H5.2z"/><path d="M11.3 2.9v3.5h3.5M7.4 9.6h5.2M7.4 12.2h5.2M7.4 14.8h3.3"/></svg>',
    link: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.2 11.8 11.8 8.2"/><path d="M7.1 13.4 5.9 14.6a2.7 2.7 0 0 1-3.8-3.8l2.6-2.6a2.7 2.7 0 0 1 3.8 0M12.9 6.6l1.2-1.2a2.7 2.7 0 1 1 3.8 3.8l-2.6 2.6a2.7 2.7 0 0 1-3.8 0"/></svg>'
  };

  var UI = {
    ar: { eyebrow: 'بطاقة تواصل', linksTitle: 'روابط سريعة', foot: 'امسح الكود وخلينا على تواصل', alt: 'صورة محمد صلاح', nav: 'روابط سريعة', dead: 'رابط غير صالح' },
    en: { eyebrow: 'Contact card', linksTitle: 'Quick links', foot: 'Scan. Connect. Stay in touch.', alt: 'Portrait of Mohamed Salah', nav: 'Quick links', dead: 'Invalid link' }
  };

  function getLang() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl;
    try {
      var saved = localStorage.getItem('card-lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {}
    return 'ar';
  }

  function value(obj, key, fallback) {
    var v = obj && obj[key];
    return typeof v === 'string' && v.trim() ? v.trim() : (fallback || '');
  }

  function safeUrl(raw) {
    try {
      var u = new URL(String(raw || '').trim(), location.href);
      if (['http:', 'https:', 'mailto:', 'tel:'].indexOf(u.protocol) === -1) return null;
      return u.href;
    } catch (e) { return null; }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function render(data, lang) {
    var ui = UI[lang];
    var p = (data && data.profile) || {};
    var links = (data && Array.isArray(data.links)) ? data.links : [];

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = value(p, 'name_' + lang, lang === 'ar' ? 'محمد صلاح' : 'Mohamed Salah') + ' — ' + (lang === 'ar' ? 'بطاقة تواصل' : 'Contact card');

    setText('eyebrow', value(p, 'welcome_' + lang, ui.eyebrow));
    setText('greeting', value(p, 'name_' + lang, lang === 'ar' ? 'محمد صلاح' : 'Mohamed Salah'));
    setText('role', value(p, 'role_' + lang, ''));
    setText('bio', value(p, 'bio_' + lang, ''));
    setText('links-title', ui.linksTitle);
    setText('foot-text', ui.foot);
    setText('portrait-alt', ui.alt);
    var img = document.getElementById('portrait');
    if (img) img.alt = ui.alt;

    var nav = document.getElementById('links');
    nav.setAttribute('aria-label', ui.nav);
    nav.textContent = '';

    links.filter(function (l) { return l && l.visible !== false; }).forEach(function (l) {
      var label = value(l, 'label_' + lang, value(l, 'label_en', value(l, 'label_ar', 'Link')));
      var href = safeUrl(l.url);
      var iconKey = Object.prototype.hasOwnProperty.call(ICONS, l.icon) ? l.icon : 'portfolio';

      if (href) {
        var a = document.createElement('a');
        a.className = 'link';
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = '<span class="ico">' + ICONS[iconKey] + '</span><span class="label"></span>';
        a.querySelector('.label').textContent = label;
        nav.appendChild(a);
      } else {
        var s = document.createElement('span');
        s.className = 'link is-dead';
        s.title = ui.dead;
        s.innerHTML = '<span class="ico">' + ICONS[iconKey] + '</span><span class="label"></span>';
        s.querySelector('.label').textContent = label;
        nav.appendChild(s);
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
  }

  function bindLang(getData, getLangNow, setLang) {
    Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) {
      b.addEventListener('click', function () {
        var next = b.getAttribute('data-lang');
        try { localStorage.setItem('card-lang', next); } catch (e) {}
        var params = new URLSearchParams(location.search);
        params.set('lang', next);
        history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
        setLang(next);
        render(getData(), next);
      });
    });
  }

  function load() {
    return fetch('links.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  var lang = getLang();
  var state = { data: window.DEFAULT_DATA };

  bindLang(
    function () { return state.data; },
    function () { return lang; },
    function (next) { lang = next; }
  );

  load().then(function (data) {
    state.data = data && data.profile ? data : window.DEFAULT_DATA;
    render(state.data, lang);
  });
})();
