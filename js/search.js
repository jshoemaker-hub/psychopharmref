(function() {
    var input = document.getElementById('us-input');
    var results = document.getElementById('us-results');
    if (!input || !results) return;

    // Build blog index from sidebar links
    var blogIndex = [];
    document.querySelectorAll('#sidebar .nav-sub-link').forEach(function(a) {
      var href = a.getAttribute('href') || '';
      if (href.indexOf('blog/') >= 0 || href.indexOf('/blog/') >= 0) {
        var cat = '';
        var prev = a.closest('li');
        while (prev && prev.previousElementSibling) {
          prev = prev.previousElementSibling;
          if (prev.classList && prev.classList.contains('nav-sub-divider')) {
            cat = prev.textContent.trim();
            break;
          }
        }
        blogIndex.push({ title: a.textContent.trim(), url: href, category: cat });
      }
    });

    // Tool sections
    var toolIndex = [
      { title: 'Drug Database', section: 'drug-table', cat: 'Psychopharmacology' },
      { title: 'P450 Interactions', section: 'p450', cat: 'Psychopharmacology' },
      { title: 'Receptor Binding Profiles', section: 'receptor-binding', cat: 'Psychopharmacology' },
      { title: 'Receptor Glossary', section: 'glossary', cat: 'Psychopharmacology' },
      { title: 'PK Curve Comparison', section: 'pk-curves', cat: 'Psychopharmacology' },
      { title: 'QT Risk / Tisdale Score', section: 'qt-risk', cat: 'Clinical Tool' },
      { title: 'Refill Calendar & Usage', section: 'refill-calendar', cat: 'Clinical Tool' },
      { title: 'Medication Comparison', section: 'med-compare', cat: 'Clinical Tool' },
      { title: 'Taper / Cross-Taper Planner', section: 'med-taper', cat: 'Clinical Tool' },
      { title: 'PANSS (Psychosis)', section: 'panss-tool', cat: 'Rating Scale' },
      { title: 'SLUMS Exam (Cognition)', section: 'slums-tool', cat: 'Rating Scale' },
      { title: 'CDR Staging (Dementia)', section: 'cdr-tool', cat: 'Rating Scale' },
      { title: 'PCL-5 (PTSD)', section: 'pcl5-tool', cat: 'Rating Scale' },
      { title: 'Y-BOCS (OCD)', section: 'ybocs-tool', cat: 'Rating Scale' },
      { title: 'YMRS (Mania)', section: 'ymrs-tool', cat: 'Rating Scale' },
      { title: 'BFCRS (Catatonia)', section: 'bfcrs-tool', cat: 'Rating Scale' },
      { title: 'AIMS (Dyskinesia)', section: 'aims-tool', cat: 'Rating Scale' },
      { title: 'Suicide Risk Assessment', section: 'suicide-risk-tools', cat: 'Rating Scale' },
      { title: 'CIDI Bipolar Screen', section: 'cidi-tool', cat: 'Rating Scale' },
      { title: 'MSI-BPD (Borderline)', section: 'msibpd-tool', cat: 'Rating Scale' },
      { title: 'ASRS (ADHD)', section: 'asrs-tool', cat: 'Rating Scale' },
      { title: 'ADL / IADL', section: 'adl-tool', cat: 'Rating Scale' },
      { title: 'Epworth Sleepiness', section: 'ess-tool', cat: 'Rating Scale' },
      { title: 'Burnout (BAT)', section: 'bat-tool', cat: 'Rating Scale' },
      { title: 'Autism Screening (AQ)', section: 'aq-tool', cat: 'Rating Scale' },
      { title: 'Printable Clinical Forms', section: 'print-forms', cat: 'Clinical Tools' },
    ];

    var timer;
    input.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(doSearch, 120);
    });

    input.addEventListener('keydown', function(e) {
      var items = results.querySelectorAll('.us-item');
      var focused = results.querySelector('.us-item:focus');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!focused && items.length) items[0].focus();
        else if (focused && focused.nextElementSibling && focused.nextElementSibling.classList.contains('us-item')) focused.nextElementSibling.focus();
        else if (focused && focused.nextElementSibling && focused.nextElementSibling.nextElementSibling) focused.nextElementSibling.nextElementSibling.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (focused && focused.previousElementSibling && focused.previousElementSibling.classList.contains('us-item')) focused.previousElementSibling.focus();
        else input.focus();
      } else if (e.key === 'Escape') {
        results.classList.remove('open');
        input.blur();
      }
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.us-wrap')) results.classList.remove('open');
    });

    function doSearch() {
      var q = input.value.trim().toLowerCase();
      if (!q || q.length < 2) { results.classList.remove('open'); results.innerHTML = ''; return; }
      var terms = q.split(/\s+/);
      var html = '';
      var totalMatches = 0;

      // 1. Search medications
      if (typeof MEDICATIONS !== 'undefined') {
        var drugMatches = MEDICATIONS.filter(function(m) {
          var hay = (m.name + ' ' + m.brandName + ' ' + m.class + ' ' + m.category).toLowerCase();
          return terms.every(function(t) { return hay.indexOf(t) >= 0; });
        }).slice(0, 5);

        if (drugMatches.length) {
          html += '<div class="us-group-label">Medications</div>';
          drugMatches.forEach(function(m) {
            html += '<div class="us-item" tabindex="0" onclick="switchSection(\'drug-table\');openDrugModal(\'' + m.id + '\');document.getElementById(\'us-results\').classList.remove(\'open\');">' +
              '<span class="us-item-type us-item-type--drug">Drug</span>' +
              '<span class="us-item-title">' + hl(m.name, terms) + '</span>' +
              '<span class="us-item-sub">' + m.brandName + ' &bull; ' + m.class + '</span>' +
              '</div>';
          });
          totalMatches += drugMatches.length;
        }
      }

      // 2. Search blog posts
      var blogMatches = blogIndex.filter(function(b) {
        var hay = (b.title + ' ' + b.category).toLowerCase();
        return terms.every(function(t) { return hay.indexOf(t) >= 0; });
      }).slice(0, 5);

      if (blogMatches.length) {
        html += '<div class="us-group-label">Blog Articles</div>';
        blogMatches.forEach(function(b) {
          html += '<a href="' + b.url + '" class="us-item">' +
            '<span class="us-item-type us-item-type--blog">Article</span>' +
            '<span class="us-item-title">' + hl(b.title, terms) + '</span>' +
            (b.category ? '<span class="us-item-sub">' + b.category + '</span>' : '') +
            '</a>';
        });
        totalMatches += blogMatches.length;
      }

      // 3. Search tools
      var toolMatches = toolIndex.filter(function(t) {
        var hay = (t.title + ' ' + t.cat).toLowerCase();
        return terms.every(function(tm) { return hay.indexOf(tm) >= 0; });
      }).slice(0, 4);

      if (toolMatches.length) {
        html += '<div class="us-group-label">Tools & Scales</div>';
        toolMatches.forEach(function(t) {
          html += '<div class="us-item" tabindex="0" onclick="switchSection(\'' + t.section + '\');document.getElementById(\'us-results\').classList.remove(\'open\');">' +
            '<span class="us-item-type us-item-type--tool">Tool</span>' +
            '<span class="us-item-title">' + hl(t.title, terms) + '</span>' +
            '<span class="us-item-sub">' + t.cat + '</span>' +
            '</div>';
        });
        totalMatches += toolMatches.length;
      }

      if (totalMatches === 0) {
        html = '<div class="us-empty">No results for "' + q + '"</div>';
      }

      results.innerHTML = html;
      results.classList.add('open');
    }

    function hl(text, terms) {
      terms.forEach(function(t) {
        if (t.length < 2) return;
        var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        text = text.replace(re, '<mark>$1</mark>');
      });
      return text;
    }
  })();
