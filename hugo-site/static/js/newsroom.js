/* Home-page front page ("Today in Psychopharmacology").
   Reads /news/index.json (built by Hugo from content/news/ and data/*.yaml) and
   lays out the last seven days of pieces. Articles are scheduled by date, so a
   new one appears each day and the whole front page turns over every week
   without a redeploy. Older pieces stay in the /news/ archive.
   Preview another day with ?nwdate=YYYY-MM-DD. */
(function () {
  var root = document.getElementById('nw-front');
  if (!root) return;

  var WINDOW_DAYS = 7;   // front-page life of a piece
  var MIN_FRONT = 5;     // backfill from the archive below this many
  var WEB_PER_WEEK = 6;

  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dayNum(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtShort(s) { return parse(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

  var override = (location.search.match(/[?&]nwdate=(\d{4}-\d{2}-\d{2})/) || [])[1];
  var today = override ? parse(override) : new Date();
  var todayStr = iso(today);
  var cutoff = new Date(today); cutoff.setDate(cutoff.getDate() - (WINDOW_DAYS - 1));
  var cutoffStr = iso(cutoff);

  fetch('/news/index.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () { root.hidden = true; });

  function render(feed) {
    var desks = {};
    (feed.desks || []).forEach(function (d) { desks[d.key] = d; });
    var deskOrder = (feed.desks || []).map(function (d) { return d.key; });

    var published = (feed.items || []).filter(function (it) { return it.date <= todayStr && desks[it.desk]; });
    // Newest first; same-day ties follow desk order so the lead is predictable.
    published.sort(function (a, b) {
      return a.date !== b.date ? (a.date < b.date ? 1 : -1) : deskOrder.indexOf(a.desk) - deskOrder.indexOf(b.desk);
    });
    var front = published.filter(function (it) { return it.date >= cutoffStr; });
    var archive = published.filter(function (it) { return it.date < cutoffStr; });
    while (front.length < MIN_FRONT && archive.length) front.push(archive.shift());

    if (!front.length) { root.hidden = true; return; }

    var lead = front[0], rail = front.slice(1, 5), more = front.slice(5);

    function deskOf(it) { return desks[it.desk]; }
    function style(it) { return ' style="--nw-desk:' + esc(deskOf(it).accent) + '"'; }
    function meta(it) {
      return esc(deskOf(it).author) + ' · <time datetime="' + esc(it.date) + '">' + esc(fmtShort(it.date)) + '</time>' +
        (it.readTime ? ' · ' + esc(it.readTime) : '');
    }
    function img(it, cls, eager) {
      if (!it.img) return '';
      return '<img class="' + cls + '" src="' + esc(it.img) + '" alt="' + (eager ? esc(it.imgAlt) : '') + '" width="1200" height="675"' +
        (eager ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
    }

    var h = [];
    h.push('<div class="nw-mast">' +
      '<h2 class="nw-mast-title" id="nw-front-h">Today in Psychopharmacology</h2>' +
      '<span class="nw-mast-date">' + esc(today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })) + '</span>' +
      '<span class="nw-mast-note">New stories daily · the front page turns over weekly</span>' +
      '<a href="/news/">All stories &rarr;</a></div>');

    h.push('<div class="nw-top">');
    h.push('<a class="nw-lead" href="' + esc(lead.url) + '"' + style(lead) + '>' + img(lead, 'nw-img', true) +
      '<span class="nw-lead-body"><span class="nw-kicker">' + esc(deskOf(lead).name) + '</span>' +
      '<span class="nw-lead-title">' + esc(lead.title) + '</span>' +
      '<span class="nw-lead-dek">' + esc(lead.dek) + '</span>' +
      '<span class="nw-meta">' + meta(lead) + '</span></span></a>');
    if (rail.length) {
      h.push('<div class="nw-rail"><h3 class="nw-rail-h">Top stories</h3><ol class="nw-headlines">');
      rail.forEach(function (it) {
        h.push('<li><a class="nw-hl" href="' + esc(it.url) + '"' + style(it) + '><span>' +
          '<span class="nw-kicker">' + esc(deskOf(it).name) + '</span>' +
          '<span class="nw-hl-title">' + esc(it.title) + '</span>' +
          '<span class="nw-meta">' + meta(it) + '</span></span>' + img(it, 'nw-img') + '</a></li>');
      });
      h.push('</ol></div>');
    }
    h.push('</div>');

    if (more.length) {
      h.push('<h3 class="nw-section-h">More this week <a href="/news/">Archive &rarr;</a></h3><div class="nw-grid">');
      more.forEach(function (it) { h.push(card(it)); });
      h.push('</div>');
    }

    // Around the Web: a fresh set of six each week, plus a daily pick from the rest.
    var web = feed.web || [];
    if (web.length) {
      var dn = dayNum(today);
      var week = Math.floor((dn + 3) / 7);   // weeks start Monday (day 0 = Thu 1 Jan 1970)
      var picks = [], used = {};
      for (var i = 0; i < Math.min(WEB_PER_WEEK, web.length); i++) {
        var k = (week * WEB_PER_WEEK + i) % web.length;
        if (used[k]) break;
        used[k] = 1; picks.push(web[k]);
      }
      var rest = web.filter(function (_, idx) { return !used[idx]; });
      var pick = rest.length ? rest[dn % rest.length] : null;
      h.push('<h3 class="nw-section-h">Around the Web <span class="nw-web-by">curated by Nora Quill</span> <a href="/news/#nw-web-h">Full list &rarr;</a></h3>' +
        '<p class="nw-section-sub">Other people\'s newsletters, podcasts and channels worth your time.</p><div class="nw-web">');
      if (pick) {
        h.push('<a class="nw-pick" href="' + esc(pick.url) + '" target="_blank" rel="noopener"><span class="nw-pick-label">Pick of the day</span>' +
          webInner(pick) + '</a>');
      }
      h.push('<div class="nw-web-grid">');
      picks.forEach(function (w) {
        h.push('<a class="nw-web-item" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + webInner(w) + '</a>');
      });
      h.push('</div></div>');
    }

    // From the archive: three older pieces, rotating daily.
    if (archive.length) {
      var off = dayNum(today) % archive.length, fa = [];
      for (var j = 0; j < Math.min(3, archive.length); j++) fa.push(archive[(off + j) % archive.length]);
      h.push('<h3 class="nw-section-h">From the archive</h3><ul class="nw-from-archive">');
      fa.forEach(function (it) {
        h.push('<li><a href="' + esc(it.url) + '"' + style(it) + '><span class="nw-kicker">' + esc(deskOf(it).name) + '</span><br>' +
          '<span class="nw-fa-title">' + esc(it.title) + '</span> <span class="nw-meta">· ' + esc(fmtShort(it.date)) + '</span></a></li>');
      });
      h.push('</ul>');
    }

    // Desk directory
    h.push('<h3 class="nw-section-h">Our desks</h3><div class="nw-desks">');
    (feed.desks || []).forEach(function (d) {
      var href = d.key === 'web' ? '/news/#nw-web-h' : '/news/#desk-' + d.key;
      h.push('<a class="nw-desk" href="' + esc(href) + '" style="--nw-desk:' + esc(d.accent) + '">' +
        '<span class="nw-avatar" aria-hidden="true">' + esc(d.author.charAt(0)) + '</span><span>' +
        '<span class="nw-desk-name">' + esc(d.name) + '</span>' +
        '<span class="nw-desk-author">' + esc(d.author) + '</span>' +
        '<span class="nw-desk-beat">' + esc(d.beat) + '</span></span></a>');
    });
    h.push('</div>');
    h.push('<p class="nw-front-foot">Bylines are house pen names. Pieces are drafted with AI assistance from cited sources and edited by Jerad Shoemaker, MD. For clinician education, not medical advice.</p>');

    root.innerHTML = h.join('');
    root.classList.remove('nw-front-loading');
    root.removeAttribute('aria-busy');
    // A missing cover leaves the beige image box rather than a broken-image icon.
    root.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () { im.style.visibility = 'hidden'; });
    });

    function card(it) {
      return '<a class="nw-card" href="' + esc(it.url) + '"' + style(it) + '>' +
        (it.img ? '<span class="nw-card-img">' + img(it, '') + '</span>' : '') +
        '<span class="nw-card-body"><span class="nw-kicker">' + esc(deskOf(it).name) + '</span>' +
        '<span class="nw-card-title">' + esc(it.title) + '</span>' +
        '<span class="nw-card-dek">' + esc(it.dek) + '</span>' +
        '<span class="nw-card-meta">' + meta(it) + '</span></span></a>';
    }
    function webInner(w) {
      return '<span class="nw-web-type nw-web-type--' + esc(w.type) + '">' + esc(w.type) + '</span>' +
        '<span class="nw-web-title">' + esc(w.title) + '</span>' +
        '<span class="nw-web-creator">' + esc(w.creator) + (w.cost && w.cost !== 'free' ? ' · ' + esc(w.cost) : '') + '</span>' +
        '<span class="nw-web-blurb">' + esc(w.blurb) + '</span>';
    }
  }
})();
