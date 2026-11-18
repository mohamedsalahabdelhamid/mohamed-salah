(function () {
  'use strict';

  var DRAFT_KEY = 'card-links-draft';
  var data = null;

  var rowsEl = document.getElementById('rows');
  var statusEl = document.getElementById('status');

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function defaults() { return clone(window.DEFAULT_DATA); }

  function say(msg) {
    statusEl.textContent = msg || '';
  }

  function readDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && parsed.profile && Array.isArray(parsed.links) ? parsed : null;
    } catch (e) { return null; }
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function fetchPublished() {
    return fetch('links.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function label(text, input) {
    var wrap = document.createElement('div');
    wrap.className = 'field';
    var l = document.createElement('label');
    l.textContent = text;
    wrap.appendChild(l);
    wrap.appendChild(input);
    return wrap;
  }

  function input(value, key, type) {
    var el = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    if (type !== 'textarea') el.type = type || 'text';
    el.setAttribute('data-k', key);
    el.value = value == null ? '' : String(value);
    return el;
  }

  function iconSelect(value) {
    var sel = document.createElement('select');
    sel.setAttribute('data-k', 'icon');
    [['portfolio', 'شخصية / Portfolio'], ['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['cv', 'CV'], ['link', 'رابط عام / Link']].forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o[0];
      opt.textContent = o[1];
      sel.appendChild(opt);
    });
    sel.value = value || 'link';
    return sel;
  }

  function renderRows() {
    rowsEl.textContent = '';
    data.links.forEach(function (link, i) {
      var row = document.createElement('div');
      row.className = 'link-row';
      row.setAttribute('data-index', String(i));

      var head = document.createElement('div');
      head.className = 'link-row-head';
      var title = document.createElement('strong');
      title.textContent = 'رابط ' + (i + 1);
      var tools = document.createElement('div');
      tools.className = 'row-tools';
      [['up', '↑'], ['down', '↓'], ['del', 'حذف']].forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn small' + (a[0] === 'del' ? ' danger' : '');
        b.setAttribute('data-act', a[0]);
        b.title = a[0] === 'up' ? 'لأعلى' : a[0] === 'down' ? 'لأسفل' : 'حذف الرابط';
        b.textContent = a[1];
        tools.appendChild(b);
      });
      head.appendChild(title);
      head.appendChild(tools);
      row.appendChild(head);

      var two1 = document.createElement('div');
      two1.className = 'two';
      two1.appendChild(label('الاسم (عربي)', input(link.label_ar, 'label_ar')));
      two1.appendChild(label('الاسم (إنجليزي)', input(link.label_en, 'label_en')));
      row.appendChild(two1);

      var urlField = label('الرابط', input(link.url, 'url', 'url'));
      urlField.querySelector('input').dir = 'ltr';
      row.appendChild(urlField);

      var two2 = document.createElement('div');
      two2.className = 'two';
      two2.appendChild(label('الأيقونة', iconSelect(link.icon)));
      two2.appendChild(label('المعرّف (اختياري)', input(link.id, 'id')));
      row.appendChild(two2);

      var check = document.createElement('label');
      check.className = 'check';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.setAttribute('data-k', 'visible');
      cb.checked = link.visible !== false;
      check.appendChild(cb);
      check.appendChild(document.createTextNode('ظاهر في البطاقة'));
      row.appendChild(check);

      rowsEl.appendChild(row);
    });
  }

  function renderProfile() {
    document.querySelectorAll('[data-field]').forEach(function (el) {
      el.value = data.profile[el.getAttribute('data-field')] || '';
    });
  }

  function collect() {
    document.querySelectorAll('[data-field]').forEach(function (el) {
      data.profile[el.getAttribute('data-field')] = el.value;
    });
    data.links = Array.prototype.map.call(rowsEl.querySelectorAll('.link-row'), function (row) {
      var out = {};
      row.querySelectorAll('[data-k]').forEach(function (el) {
        var k = el.getAttribute('data-k');
        out[k] = k === 'visible' ? el.checked : el.value;
      });
      if (!out.id) out.id = 'link-' + Math.random().toString(36).slice(2, 8);
      return out;
    });
    saveDraft();
    updatePreview();
  }

  function updatePreview() {
    document.getElementById('pv-name').textContent = data.profile.name_ar || '';
    document.getElementById('pv-role').textContent = data.profile.role_ar || '';
    var box = document.getElementById('pv-links');
    box.textContent = '';
    data.links.forEach(function (l) {
      var d = document.createElement('div');
      d.textContent = (l.visible === false ? '○ ' : '') + (l.label_ar || l.label_en || 'رابط');
      box.appendChild(d);
    });
  }

  function renderAll() {
    renderProfile();
    renderRows();
    updatePreview();
  }

  function jsonText() { return JSON.stringify(data, null, 2); }

  function copyJson() {
    var text = jsonText();
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); say('اتنسخ. الصقه مكان links.json في GitHub واعمل Publish commit.'); }
      catch (e) { say('COPY_FAILED'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        say('اتنسخ. الصقه مكان links.json في GitHub واعمل Publish commit.');
      }, fallback);
    } else fallback();
  }

  function downloadJson() {
    var blob = new Blob([jsonText()], { type: 'application/json;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'links.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    say('تم التنزيل. ارفع الملف مكان links.json في الريبو.');
  }

  document.addEventListener('input', function (e) {
    if (e.target.closest('[data-field], .link-row')) collect();
  });
  document.addEventListener('change', function (e) {
    if (e.target.closest('[data-field], .link-row')) collect();
  });

  rowsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn) return;
    collect();
    var i = Number(btn.closest('.link-row').getAttribute('data-index'));
    var act = btn.getAttribute('data-act');
    if (act === 'del') data.links.splice(i, 1);
    if (act === 'up' && i > 0) { var a = data.links[i - 1]; data.links[i - 1] = data.links[i]; data.links[i] = a; }
    if (act === 'down' && i < data.links.length - 1) { var b = data.links[i + 1]; data.links[i + 1] = data.links[i]; data.links[i] = b; }
    saveDraft();
    renderRows();
    updatePreview();
  });

  document.getElementById('btn-add').addEventListener('click', function () {
    collect();
    data.links.push({
      id: 'link-' + Math.random().toString(36).slice(2, 8),
      icon: 'link', label_ar: 'رابط جديد', label_en: 'New link',
      url: 'https://', visible: true
    });
    saveDraft();
    renderRows();
    updatePreview();
  });

  document.getElementById('btn-copy').addEventListener('click', copyJson);
  document.getElementById('btn-download').addEventListener('click', downloadJson);

  document.getElementById('btn-load').addEventListener('click', function () {
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        if (!parsed || !parsed.profile || !Array.isArray(parsed.links)) throw new Error('bad');
        data = parsed;
        saveDraft();
        renderAll();
        say('تم تحميل الملف.');
      } catch (err) { say('الملف مش صالح — لازم يكون links.json'); }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    fetchPublished().then(function (published) {
      data = published && published.profile && Array.isArray(published.links) ? published : defaults();
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      renderAll();
      say('رجعنا للنسخة المنشورة.');
    });
  });

  data = readDraft() || defaults();
  renderAll();
  fetchPublished().then(function (published) {
    if (!readDraft() && published && published.profile && Array.isArray(published.links)) {
      data = published;
      renderAll();
    }
  });
})();
