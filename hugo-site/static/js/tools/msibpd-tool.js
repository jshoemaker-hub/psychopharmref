
    (function() {
      var LABELS = ['Troubled relationships','Self-harm / suicide attempt','Impulsivity problems','Extreme moodiness','Frequent anger','Distrustfulness','Unreality / derealization','Chronic emptiness','Identity confusion','Fear of abandonment'];

      function update() {
        var score = 0, answered = 0;
        for (var i = 1; i <= 10; i++) {
          var el = document.querySelector('input[name="mb-q' + i + '"]:checked');
          if (el) { score += parseInt(el.value); answered++; }
        }
        document.getElementById('mb-score').textContent = score;
        var interp = document.getElementById('mb-interp');
        if (answered === 10) {
          if (score >= 7) { interp.textContent = 'Positive screen \u2014 symptoms highly consistent with BPD; further evaluation warranted'; interp.className = 'mb-interpretation mb-positive'; }
          else { interp.textContent = 'Below screening threshold'; interp.className = 'mb-interpretation mb-negative'; }
        } else { interp.textContent = answered + ' / 10 answered'; interp.className = 'mb-interpretation mb-negative'; }
      }

      function report() {
        var d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
        var r = 'McLean Screening Instrument for BPD (MSI-BPD)\nDate: ' + d + '\n\n';
        var score = 0;
        for (var i = 1; i <= 10; i++) {
          var el = document.querySelector('input[name="mb-q' + i + '"]:checked');
          if (el) { var v = parseInt(el.value); score += v; r += i + '. ' + LABELS[i-1] + ': ' + (v ? 'Yes' : 'No') + '\n'; }
        }
        r += '\nTotal Score: ' + score + ' / 10\n';
        r += 'Interpretation: ' + (score >= 7 ? 'Positive screen \u2014 symptoms highly consistent with BPD; further evaluation warranted' : 'Below screening threshold');
        navigator.clipboard.writeText(r).then(function(){ var b = document.getElementById('mb-report-btn'); var o = b.textContent; b.textContent = 'Copied!'; setTimeout(function(){ b.textContent = o; }, 2000); });
      }

      document.querySelectorAll('.mb-item').forEach(function(el){ el.addEventListener('change', update); });
      document.getElementById('mb-report-btn').addEventListener('click', report);
      document.getElementById('mb-reset-btn').addEventListener('click', function() {
        if (confirm('Reset all MSI-BPD responses?')) { document.querySelectorAll('.mb-item').forEach(function(r){ r.checked = false; }); update(); }
      });

      // Add print button
      (function addPrintBtn() {
        var sec = document.getElementById('msibpd-tool');
        if (!sec) return;
        var header = sec.querySelector('.section-header');
        if (!header) return;
        var btn = document.createElement('button');
        btn.className = 'pf-inline-btn';
        btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('msibpd'); };
        btn.innerHTML = '🖨️ Print Blank Form';
        btn.title = 'Print a blank version of this form';
        header.appendChild(btn);
      })();

      update();
    })();
  