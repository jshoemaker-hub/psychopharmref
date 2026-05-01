/* PsychoPharmRef — Psychiatry Glossary Page Logic
 *
 * Renders the glossary list, A-Z jump nav, category filter chips,
 * and in-page search. Reads window.GLOSSARY_TERMS from glossary-data.js.
 *
 * Public API:
 *   window.glossarySetCategory(name) — sets active filter chip and re-renders
 *   window.glossaryScrollToTerm(term) — switches section and scrolls/highlights anchor
 */
(function() {
  'use strict';

  // Safe slug for anchor IDs and DOM attribute values
  function slugify(s) {
    return String(s).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Build a term lookup once data is available
  var termIndex = null;
  function buildIndex() {
    if (termIndex) return termIndex;
    termIndex = {};
    if (!window.GLOSSARY_TERMS) return termIndex;
    window.GLOSSARY_TERMS.forEach(function(e) {
      termIndex[e.term.toLowerCase()] = e;
    });
    return termIndex;
  }

  // Active filter state
  var activeCategory = 'all';
  var activeLetter = 'all';
  var activeQuery = '';

  function getFiltered() {
    var data = window.GLOSSARY_TERMS || [];
    var q = activeQuery.toLowerCase();
    return data.filter(function(e) {
      if (activeCategory !== 'all' && e.category !== activeCategory) return false;
      if (activeLetter !== 'all') {
        if (e.term.charAt(0).toUpperCase() !== activeLetter) return false;
      }
      if (q) {
        var hay = (e.term + ' ' + (e.aliases || []).join(' ') + ' ' + e.def + ' ' + e.category).toLowerCase();
        var terms = q.split(/\s+/).filter(Boolean);
        if (!terms.every(function(t) { return hay.indexOf(t) >= 0; })) return false;
      }
      return true;
    });
  }

  function getCategories() {
    var counts = {};
    (window.GLOSSARY_TERMS || []).forEach(function(e) {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    var cats = Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; });
    return cats.map(function(c) { return { name: c, count: counts[c] }; });
  }

  function renderFilters() {
    var row = document.getElementById('gl-filter-row');
    if (!row) return;
    var total = (window.GLOSSARY_TERMS || []).length;
    var html = '<button type="button" class="gl-chip' + (activeCategory === 'all' ? ' active' : '') + '" data-cat="all">All <span class="gl-chip-count">' + total + '</span></button>';
    getCategories().forEach(function(c) {
      html += '<button type="button" class="gl-chip' + (activeCategory === c.name ? ' active' : '') + '" data-cat="' + escHtml(c.name) + '">' + escHtml(c.name) + ' <span class="gl-chip-count">' + c.count + '</span></button>';
    });
    row.innerHTML = html;
  }

  function renderAZ() {
    var az = document.getElementById('gl-az');
    if (!az) return;
    var letters = {};
    (window.GLOSSARY_TERMS || []).forEach(function(e) {
      var L = e.term.charAt(0).toUpperCase();
      letters[L] = true;
    });
    var html = '<button type="button" class="gl-az-btn' + (activeLetter === 'all' ? ' active' : '') + '" data-letter="all">All</button>';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(L) {
      var has = !!letters[L];
      html += '<button type="button" class="gl-az-btn' + (activeLetter === L ? ' active' : '') + (has ? '' : ' disabled') + '" data-letter="' + L + '"' + (has ? '' : ' disabled') + '>' + L + '</button>';
    });
    az.innerHTML = html;
  }

  function renderGrid() {
    var grid = document.getElementById('gl-grid');
    var empty = document.getElementById('gl-empty');
    var countEl = document.getElementById('gl-count');
    if (!grid) return;

    var filtered = getFiltered();

    // Sort alphabetically by term
    filtered.sort(function(a, b) { return a.term.localeCompare(b.term); });

    if (countEl) countEl.textContent = filtered.length + ' term' + (filtered.length === 1 ? '' : 's');

    if (!filtered.length) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    // Group by first letter for headings
    var groups = {};
    filtered.forEach(function(e) {
      var L = e.term.charAt(0).toUpperCase();
      if (!groups[L]) groups[L] = [];
      groups[L].push(e);
    });

    var html = '';
    Object.keys(groups).sort().forEach(function(L) {
      html += '<div class="gl-letter-group" id="gl-letter-' + L + '">';
      html += '<h3 class="gl-letter-heading">' + L + '</h3>';
      html += '<div class="gl-cards">';
      groups[L].forEach(function(e) {
        html += renderCard(e);
      });
      html += '</div></div>';
    });
    grid.innerHTML = html;
  }

  function renderCard(entry) {
    var anchor = 'term-' + slugify(entry.term);
    var html = '<article class="gl-card" id="' + anchor + '" data-term="' + escHtml(entry.term) + '">';
    html += '<header class="gl-card-head">';
    html += '<h4 class="gl-term">' + escHtml(entry.term) + '</h4>';
    html += '<span class="gl-cat-pill" data-cat-pill="' + escHtml(entry.category) + '">' + escHtml(entry.category) + '</span>';
    html += '</header>';

    if (entry.aliases && entry.aliases.length) {
      html += '<div class="gl-aliases"><em>Also:</em> ' + entry.aliases.map(escHtml).join(', ') + '</div>';
    }

    html += '<p class="gl-def">' + escHtml(entry.def) + '</p>';

    var crossLinks = '';
    if (entry.seeAlso && entry.seeAlso.length) {
      var idx = buildIndex();
      crossLinks += '<div class="gl-see-also"><span class="gl-see-label">See also:</span> ';
      crossLinks += entry.seeAlso.map(function(t) {
        if (idx[t.toLowerCase()]) {
          return '<a href="#" class="gl-xref" data-xref="' + escHtml(t) + '">' + escHtml(t) + '</a>';
        }
        return '<span class="gl-xref-plain">' + escHtml(t) + '</span>';
      }).join(', ');
      crossLinks += '</div>';
    }

    if (entry.link) {
      var linkHtml = '';
      if (entry.link.section) {
        linkHtml = '<a href="#" class="gl-link" data-link-section="' + escHtml(entry.link.section) + '">' + escHtml(entry.link.label || 'Open tool') + ' &rarr;</a>';
      } else if (entry.link.blogSlug) {
        linkHtml = '<a href="/blog/' + escHtml(entry.link.blogSlug) + '/" class="gl-link">' + escHtml(entry.link.label || 'Read full chapter') + ' &rarr;</a>';
      }
      if (linkHtml) {
        crossLinks += '<div class="gl-link-row">' + linkHtml + '</div>';
      }
    }

    if (crossLinks) html += crossLinks;
    html += '</article>';
    return html;
  }

  // Public API: scroll to a term, applying any necessary section switch
  window.glossaryScrollToTerm = function(term) {
    if (typeof window.switchSection === 'function') {
      window.switchSection('psychiatry-glossary');
    }
    // Reset filters so the term is visible
    activeCategory = 'all';
    activeLetter = 'all';
    activeQuery = '';
    var input = document.getElementById('gl-search');
    if (input) input.value = '';
    renderFilters();
    renderAZ();
    renderGrid();

    // Defer scroll to allow render
    setTimeout(function() {
      var anchor = 'term-' + slugify(term);
      var el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('gl-flash');
        setTimeout(function() { el.classList.remove('gl-flash'); }, 2400);
      }
    }, 60);
  };

  window.glossarySetCategory = function(catName) {
    activeCategory = catName || 'all';
    activeLetter = 'all';
    activeQuery = '';
    var input = document.getElementById('gl-search');
    if (input) input.value = '';
    renderFilters();
    renderAZ();
    renderGrid();
  };

  // Init when DOM is ready
  function init() {
    if (!document.getElementById('gl-grid')) return;
    if (!window.GLOSSARY_TERMS || !window.GLOSSARY_TERMS.length) {
      // Data not ready yet — try again shortly
      setTimeout(init, 100);
      return;
    }
    buildIndex();
    renderFilters();
    renderAZ();
    renderGrid();

    // Search input
    var search = document.getElementById('gl-search');
    if (search) {
      var t;
      search.addEventListener('input', function() {
        clearTimeout(t);
        t = setTimeout(function() {
          activeQuery = search.value.trim();
          renderGrid();
        }, 120);
      });
    }

    // Category chip clicks
    var filterRow = document.getElementById('gl-filter-row');
    if (filterRow) {
      filterRow.addEventListener('click', function(e) {
        var btn = e.target.closest('.gl-chip');
        if (!btn) return;
        var cat = btn.getAttribute('data-cat') || 'all';
        activeCategory = cat;
        renderFilters();
        renderGrid();
      });
    }

    // A-Z clicks
    var az = document.getElementById('gl-az');
    if (az) {
      az.addEventListener('click', function(e) {
        var btn = e.target.closest('.gl-az-btn');
        if (!btn || btn.classList.contains('disabled')) return;
        var L = btn.getAttribute('data-letter') || 'all';
        activeLetter = L;
        renderAZ();
        renderGrid();
        if (L !== 'all') {
          var group = document.getElementById('gl-letter-' + L);
          if (group) group.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Clear button
    var clear = document.getElementById('gl-clear');
    if (clear) {
      clear.addEventListener('click', function() {
        activeCategory = 'all';
        activeLetter = 'all';
        activeQuery = '';
        if (search) search.value = '';
        renderFilters();
        renderAZ();
        renderGrid();
      });
    }

    // Cross-reference links inside cards: jump to other term
    var grid = document.getElementById('gl-grid');
    if (grid) {
      grid.addEventListener('click', function(e) {
        var xref = e.target.closest('.gl-xref');
        if (xref) {
          e.preventDefault();
          var t = xref.getAttribute('data-xref');
          if (t) window.glossaryScrollToTerm(t);
          return;
        }
        var link = e.target.closest('[data-link-section]');
        if (link) {
          e.preventDefault();
          var sec = link.getAttribute('data-link-section');
          if (sec && typeof window.switchSection === 'function') {
            window.switchSection(sec);
          }
        }
      });
    }

    // Sidebar nav: when a sub-item with data-glossary-cat is clicked, apply filter
    document.querySelectorAll('[data-glossary-cat]').forEach(function(a) {
      a.addEventListener('click', function() {
        // switchSection runs from data-section; we just queue the filter
        var cat = a.getAttribute('data-glossary-cat');
        // Defer until after switchSection fires
        setTimeout(function() {
          window.glossarySetCategory(cat);
        }, 30);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
