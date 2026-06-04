
    (function() {
      var SITS = ['Sitting and reading','Watching TV','Sitting, inactive, in a public place (e.g., meeting, theater, dinner event)','As a passenger in a car for an hour or more without a break','Lying down to rest when circumstances permit','Sitting and talking to someone','Sitting quietly after a meal without alcohol','In a car, while stopped for a few minutes in traffic or at a light'];
      var RESP = ['Would never nod off','Slight chance','Moderate chance','High chance'];

      function interp(s) {
        if (s <= 7) return {text:'Unlikely that you are abnormally sleepy', cls:'es-normal'};
        if (s <= 9) return {text:'Average amount of daytime sleepiness', cls:'es-average'};
        if (s <= 15) return {text:'Excessive daytime sleepiness \u2014 further evaluation recommended', cls:'es-excessive'};
        return {text:'Excessive daytime sleepiness \u2014 strongly consider seeking medical attention', cls:'es-excessive'};
      }

      function update() {
        var total = 0, answered = 0;
        for (var i = 1; i <= 8; i++) { var el = document.querySelector('input[name="ess-'+i+'"]:checked'); if (el) { total += parseInt(el.value); answered++; } }
        document.getElementById('es-score').textContent = total;
        var ip = document.getElementById('es-interp');
        if (answered === 8) { var r = interp(total); ip.textContent = r.text; ip.className = 'es-interp ' + r.cls; }
        else { ip.textContent = answered + ' / 8 answered'; ip.className = 'es-interp es-normal'; }
      }

      function report() {
        var d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
        var r = 'Epworth Sleepiness Scale (ESS)\nDate: ' + d + '\n\n';
        var total = 0;
        for (var i = 1; i <= 8; i++) { var el = document.querySelector('input[name="ess-'+i+'"]:checked'); if (el) { var v = parseInt(el.value); total += v; r += (i) + '. ' + SITS[i-1] + ': ' + v + ' (' + RESP[v] + ')\n'; } }
        r += '\nTotal Score: ' + total + ' / 24\n';
        r += 'Interpretation: ' + interp(total).text;
        navigator.clipboard.writeText(r).then(function(){ var b = document.getElementById('es-report-btn'); var o = b.textContent; b.textContent = 'Copied!'; setTimeout(function(){ b.textContent = o; }, 2000); });
      }

      document.querySelectorAll('.es-item').forEach(function(el){ el.addEventListener('change', update); });
      document.getElementById('es-report-btn').addEventListener('click', report);
      document.getElementById('es-reset-btn').addEventListener('click', function() {
        if (confirm('Reset all ESS responses?')) { document.querySelectorAll('.es-item').forEach(function(r){ r.checked = false; }); update(); }
      });

      // Add print button
      (function addPrintBtn() {
        var sec = document.getElementById('ess-tool');
        if (!sec) return;
        var header = sec.querySelector('.section-header');
        if (!header) return;
        var btn = document.createElement('button');
        btn.className = 'pf-inline-btn';
        btn.onclick = function() { if (typeof printBlankForm === 'function') printBlankForm('epworth'); };
        btn.innerHTML = '🖨️ Print Blank Form';
        btn.title = 'Print a blank version of this form';
        header.appendChild(btn);
      })();

      update();
    })();
  