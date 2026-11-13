/* PsychoPharmRef mobile app shell (ma-).
   Works with css/mobile-app.css and the .ma-topbar / .ma-tabbar markup in
   index.html and hugo-site/layouts/partials/mobile-chrome.html.

   - Highlights the bottom tab for the current section or page
   - Tools tab opens the sidebar at the Clinical Tools group
   - Back button in the installed app (no browser chrome there)
   - Search button opens the sidebar search
   - Recently viewed (page titles only, kept in localStorage on this device)
   - Install card (Android install prompt / iOS Add to Home Screen tip)
   - Registers the offline service worker (/sw.js)
   No inline script: everything is bound here (see CSP in netlify.toml). */
(function () {
  'use strict';

  var PHONE = window.matchMedia('(max-width: 768px)');
  var STANDALONE = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  var RECENT_KEY = 'ppr-recent-v1';
  var INSTALL_KEY = 'ppr-install-dismissed';
  var RECENT_MAX = 6;

  if (STANDALONE) document.documentElement.classList.add('ma-standalone');

  var topbar = document.querySelector('.ma-topbar');
  var tabbar = document.querySelector('.ma-tabbar');
  var onSpa = !!document.getElementById('overview') && typeof window.switchSection === 'function';

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      if (val === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
    return null;
  }

  /* ── Which tab does a section / page belong to? ─────────────────────── */
  var INTERACT = ['p450', 'med-compare', 'similar-meds', 'complementary-meds', 'tolerability-compare'];
  var LEARN_GROUPS = ['blog', 'insights', 'glossary', 'qbank'];

  function sectionGroup(id) {
    try { return (typeof SECTION_GROUP !== 'undefined' && SECTION_GROUP[id]) || null; } // eslint-disable-line no-undef
    catch (e) { return null; }
  }

  function tabForSection(id) {
    if (!id || id === 'overview') return 'home';
    if (INTERACT.indexOf(id) !== -1) return 'interact';
    if (id === 'blog-index' || id === 'psychiatry-glossary' || id === 'glossary' || id === 'question-bank') return 'learn';
    var g = sectionGroup(id);
    if (g === 'psychopharm') return 'drugs';
    if (LEARN_GROUPS.indexOf(g) !== -1) return 'learn';
    if (id === 'drug-table' || id === 'diagnoses-db') return 'drugs';
    return 'tools';
  }

  function tabForPath(path) {
    if (/^\/blog\//.test(path)) return 'learn';
    if (/^\/tools\//.test(path)) return 'tools';
    if (/^\/news\//.test(path)) return 'home';
    return null;
  }

  function setActiveTab(name) {
    if (!tabbar) return;
    tabbar.querySelectorAll('.ma-tab').forEach(function (t) {
      var on = t.getAttribute('data-ma-tab') === name;
      t.classList.toggle('is-active', on);
      if (t.tagName === 'A') {
        if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
      }
    });
  }

  function activeSectionId() {
    var s = document.querySelector('#content .section.active');
    return s ? s.id : 'overview';
  }

  /* ── Sidebar helpers (sidebar + hamburger already exist) ─────────────── */
  function sidebarOpen() {
    var sb = document.getElementById('sidebar');
    return !!(sb && sb.classList.contains('sidebar-open'));
  }
  function openSidebar() {
    var btn = document.getElementById('mobile-menu-btn');
    if (btn && !sidebarOpen()) btn.click();
  }
  function openToolsGroup() {
    openSidebar();
    var groups = document.querySelectorAll('#sidebar .nav-group');
    groups.forEach(function (g) { g.classList.toggle('open', g.getAttribute('data-group') === 'tools'); });
    var tools = document.querySelector('#sidebar .nav-group[data-group="tools"]');
    var sb = document.getElementById('sidebar');
    if (tools && sb) {
      setTimeout(function () {
        // Leave room for the menu button that floats over the sidebar's top-left.
        sb.scrollTop += tools.getBoundingClientRect().top - sb.getBoundingClientRect().top - 64;
      }, 50);
    }
  }
  function openSearch() {
    var home = onSpa && activeSectionId() === 'overview' && document.querySelector('#overview .home-search .us-input');
    if (home) {
      home.scrollIntoView({ block: 'center' });
      home.focus();
      return;
    }
    openSidebar();
    var input = document.getElementById('us-input');
    if (input) setTimeout(function () { input.focus(); }, 320);
  }

  /* ── Tab bar ─────────────────────────────────────────────────────────── */
  if (tabbar) {
    tabbar.addEventListener('click', function (e) {
      var tab = e.target.closest('.ma-tab');
      if (!tab) return;
      var name = tab.getAttribute('data-ma-tab');

      // Re-tapping the current tab returns to the top, like a native app.
      if (tab.classList.contains('is-active') && name !== 'tools') {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (name === 'tools') {
        e.preventDefault();
        openToolsGroup();
        return;
      }
      if (name === 'home' && onSpa) {
        e.preventDefault();
        window.switchSection('overview', true);
        window.scrollTo(0, 0);
      }
      // Other tabs carry data-go; js/actions.js switches section (or loads /#id).
    });
  }

  // Home tile "Clinical Tools": the sidebar's tool list on phones, /tools/ otherwise.
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-ma-open="tools"]');
    if (!el || !PHONE.matches || !document.getElementById('sidebar')) return;
    e.preventDefault();
    openToolsGroup();
  });

  /* ── Top bar ─────────────────────────────────────────────────────────── */
  var backBtn = topbar && topbar.querySelector('.ma-back');
  var searchBtn = topbar && topbar.querySelector('.ma-search');

  function updateBack() {
    if (!topbar) return;
    // Browsers have their own Back button; the installed app has none.
    var show = STANDALONE && (onSpa ? activeSectionId() !== 'overview' : true);
    topbar.classList.toggle('ma-has-back', show);
  }
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      var sameSite = document.referrer && document.referrer.indexOf(location.origin) === 0;
      if (window.history.length > 1 && (onSpa || sameSite)) window.history.back();
      else window.location.href = '/';
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', openSearch);

  /* ── Recently viewed ─────────────────────────────────────────────────── */
  function cleanTitle(s) {
    return (s || '').replace(/\s+/g, ' ').replace(/^[^\w(]+/, '').trim().slice(0, 90);
  }
  function remember(item) {
    if (!item.t) return;
    var list = (store(RECENT_KEY) || []).filter(function (r) { return r && r.u !== item.u; });
    list.unshift(item);
    store(RECENT_KEY, list.slice(0, RECENT_MAX));
  }
  var KIND = { drugs: 'Reference', tools: 'Tool', learn: 'Learn', interact: 'Interactions' };

  function rememberSection(id) {
    if (!id || id === 'overview' || id === 'blog-index') return;
    var sec = document.getElementById(id);
    var h = sec && sec.querySelector('.section-header h2');
    if (!h) return;
    remember({ t: cleanTitle(h.textContent), u: '/#' + id, k: KIND[tabForSection(id)] || 'Reference' });
  }
  function rememberPage() {
    var p = location.pathname;
    var kind = /^\/blog\/[^/]+\/?$/.test(p) ? 'Chapter' : (/^\/news\/[^/]+\/?$/.test(p) ? 'News' : null);
    if (!kind) return;
    var h = document.querySelector('.ba-title') || document.querySelector('main h1');
    if (h) remember({ t: cleanTitle(h.textContent), u: p, k: kind });
  }

  function renderRecent() {
    var wrap = document.getElementById('ma-recent');
    var list = wrap && wrap.querySelector('.ma-list');
    if (!list) return;
    var items = store(RECENT_KEY) || [];
    list.textContent = '';
    items.forEach(function (r) {
      if (!r || typeof r.u !== 'string' || r.u.charAt(0) !== '/') return;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = r.u;
      var m = /^\/#([\w-]+)$/.exec(r.u);
      if (m) a.setAttribute('data-go', m[1]);
      var t = document.createElement('span');
      t.className = 'ma-list-title';
      t.textContent = r.t;
      var k = document.createElement('span');
      k.className = 'ma-list-kind';
      k.textContent = r.k || '';
      a.appendChild(t);
      a.appendChild(k);
      li.appendChild(a);
      list.appendChild(li);
    });
    wrap.hidden = list.children.length === 0;
  }
  var clearBtn = document.getElementById('ma-recent-clear');
  if (clearBtn) clearBtn.addEventListener('click', function () { store(RECENT_KEY, null); renderRecent(); });

  /* ── Install card ────────────────────────────────────────────────────── */
  var installCard = document.getElementById('ma-install');
  var installBtn = document.getElementById('ma-install-btn');
  var installText = document.getElementById('ma-install-text');
  var deferredPrompt = null;
  var ua = navigator.userAgent || '';
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua);

  function showInstall(mode) {
    if (!installCard || STANDALONE || store(INSTALL_KEY)) return;
    if (mode === 'ios') {
      installText.textContent = 'Tap the Share button, then “Add to Home Screen”. It opens full screen and keeps pages you have visited available offline.';
      installBtn.hidden = true;
    } else {
      installText.textContent = 'Install PsychoPharmRef on this phone. It opens full screen and keeps pages you have visited available offline.';
      installBtn.hidden = false;
    }
    installCard.hidden = false;
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    showInstall('prompt');
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    if (installCard) installCard.hidden = true;
  });
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        installCard.hidden = true;
      });
    });
  }
  var dismissBtn = document.getElementById('ma-install-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      store(INSTALL_KEY, Date.now());
      installCard.hidden = true;
    });
  }
  if (isIOS && isSafari) showInstall('ios');

  /* ── Hide the tab bar while typing (on-screen keyboard is up) ────────── */
  var TEXTY = /^(text|search|email|number|tel|url|password|date|time|datetime-local)$/;
  document.addEventListener('focusin', function (e) {
    var el = e.target;
    if (!PHONE.matches || !el) return;
    var typing = el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' ||
      (el.tagName === 'INPUT' && TEXTY.test(el.type || 'text')) || el.isContentEditable;
    if (typing) document.body.classList.add('ma-typing');
  });
  document.addEventListener('focusout', function () {
    setTimeout(function () {
      var el = document.activeElement;
      var still = el && (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' ||
        (el.tagName === 'INPUT' && TEXTY.test(el.type || 'text')));
      if (!still) document.body.classList.remove('ma-typing');
    }, 60);
  });

  /* ── Wire up per page type ───────────────────────────────────────────── */
  if (onSpa) {
    document.addEventListener('pp:sectionchange', function (e) {
      var id = e.detail && e.detail.id;
      setActiveTab(tabForSection(id));
      updateBack();
      rememberSection(id);
      if (id === 'overview') renderRecent();
    });
    setActiveTab(tabForSection(activeSectionId()));
    rememberSection(activeSectionId());
    renderRecent();
  } else {
    setActiveTab(tabForPath(location.pathname));
    rememberPage();
  }
  updateBack();

  /* ── Offline support ─────────────────────────────────────────────────── */
  // Service workers need https (localhost is allowed for testing).
  var secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if ('serviceWorker' in navigator && secure) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
