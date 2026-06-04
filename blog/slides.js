/* ── PsychoPharmRef Blog — Slide Overview component ──────────────────────
 * Vanilla, no dependencies. Looks for .ba-slides[data-slides-slug] on the
 * page, fetches blog/slides/<slug>/manifest.json, and wires up a carousel.
 * If the manifest is missing or empty, the entire block is hidden so a
 * chapter can ship the snippet before the PDF is generated.
 * ─────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  function init(root) {
    // Block starts hidden in markup; we only reveal after a successful manifest load.
    var slug = root.getAttribute('data-slides-slug');
    if (!slug) return;

    // Compute /blog/ base from current URL so paths work for both the static
    // preview (/blog/<slug>.html) and the Hugo pretty URL (/blog/<slug>/),
    // and gracefully on subfolder deployments.
    var p = location.pathname;
    var i = p.indexOf('/blog/');
    var blogBase = i !== -1 ? p.substring(0, i + 6) : '/blog/';
    var manifestUrl = root.getAttribute('data-slides-manifest')
                      || (blogBase + 'slides/' + slug + '/manifest.json');
    fetch(manifestUrl, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('manifest ' + r.status);
        return r.json();
      })
      .then(function (manifest) {
        var pages = (manifest && manifest.pages) || [];
        if (!pages.length) return;
        build(root, slug, manifest);
        root.removeAttribute('hidden');
      })
      .catch(function () { /* leave hidden */ });
  }

  function build(root, slug, manifest) {
    var pages = manifest.pages;
    var track = root.querySelector('[data-slides-track]');
    var dots  = root.querySelector('[data-slides-dots]');
    var pos   = root.querySelector('[data-slides-pos]');
    var prev  = root.querySelector('.ba-slides-prev');
    var next  = root.querySelector('.ba-slides-next');
    var fs    = root.querySelector('[data-slides-fs]');
    var dl    = root.querySelector('.ba-slides-dl');
    var count = root.querySelector('[data-slide-count]');
    var toggle = root.querySelector('.ba-slides-toggle');
    var panel  = root.querySelector('.ba-slides-panel');
    if (!track || !panel || !toggle) return;

    // Image elements (lazy-loaded). First two eager so opening feels instant.
    pages.forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = (manifest.title || slug) + ' — slide ' + (i + 1) + ' of ' + pages.length;
      img.loading = i < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      track.appendChild(img);
    });

    // Pagination dots
    pages.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', function () { go(i); });
      dots.appendChild(d);
    });

    // Count chip
    if (count) count.textContent = pages.length + ' slides';

    // Download link: prefer data-slides-pdf on the root if present (since it's
    // already path-correct for the render context); fall back to manifest.pdf
    // resolved relative to the manifest URL.
    if (dl) {
      var pdfHref = root.getAttribute('data-slides-pdf') || manifest.pdf;
      if (pdfHref) {
        dl.setAttribute('href', pdfHref);
        dl.setAttribute('download', '');
      } else {
        dl.style.display = 'none';
      }
    }

    // ── State + controls ─────────────────────────────────────────────────
    var idx = 0;
    function go(n) {
      idx = (n + pages.length) % pages.length;
      var imgs = track.querySelectorAll('img');
      imgs.forEach(function (img, i) { img.classList.toggle('is-active', i === idx); });
      var ds = dots.querySelectorAll('button');
      ds.forEach(function (b, i) { b.classList.toggle('is-active', i === idx); });
      if (pos) pos.textContent = (idx + 1) + ' / ' + pages.length;
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === pages.length - 1;
    }
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });

    // Collapsible toggle (collapsed by default)
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (open) panel.setAttribute('hidden', '');
      else panel.removeAttribute('hidden');
    });

    // Keyboard nav (only when panel is open and focused element isn't a text input)
    document.addEventListener('keydown', function (e) {
      if (panel.hasAttribute('hidden')) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') { go(idx + 1); }
      else if (e.key === 'ArrowLeft') { go(idx - 1); }
      else if (e.key === 'Escape' && root.classList.contains('is-fullscreen')) { exitFs(); }
    });

    // Touch swipe
    var touchX = null;
    track.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) touchX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = (e.changedTouches[0].clientX - touchX);
      if (Math.abs(dx) > 40) { dx < 0 ? go(idx + 1) : go(idx - 1); }
      touchX = null;
    });

    // Fullscreen
    function enterFs() {
      root.classList.add('is-fullscreen');
      document.body.style.overflow = 'hidden';
      if (fs) fs.setAttribute('aria-label', 'Exit fullscreen');
    }
    function exitFs() {
      root.classList.remove('is-fullscreen');
      document.body.style.overflow = '';
      if (fs) fs.setAttribute('aria-label', 'Fullscreen');
    }
    if (fs) {
      fs.addEventListener('click', function () {
        root.classList.contains('is-fullscreen') ? exitFs() : enterFs();
      });
    }

    go(0);
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  function boot() {
    var roots = document.querySelectorAll('.ba-slides[data-slides-slug]');
    Array.prototype.forEach.call(roots, init);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
