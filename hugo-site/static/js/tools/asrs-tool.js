
    (function() {
      var LABELS = {1:'Trouble wrapping up details',2:'Difficulty organizing',3:'Problems remembering appointments',4:'Avoid/delay starting tasks requiring thought',5:'Fidget or squirm when sitting',6:'Feel overly active, driven by a motor',7:'Careless mistakes on boring projects',8:'Difficulty keeping attention on boring work',9:'Difficulty concentrating when others speak',10:'Misplace or difficulty finding things',11:'Distracted by activity or noise',12:'Leave seat in meetings',13:'Feel restless or fidgety',14:'Difficulty unwinding and relaxing',15:'Talk too much in social situations',16:'Finish sentences of others',17:'Difficulty waiting your turn',18:'Interrupt others'};
      var RESP = {0:'Never',1:'Rarely',2:'Sometimes',3:'Often',4:'Very Often'};

      function updateA() {
        var clinical = 0, answered = 0;
        for (var i = 1; i <= 3; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el) { answered++; if (parseInt(el.value) >= 2) clinical++; } }
        for (var i = 4; i <= 6; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el) { answered++; if (parseInt(el.value) >= 3) clinical++; } }
        var cEl = document.getElementById('as-parta-count');
        var rEl = document.getElementById('as-parta-result');
        if (answered === 6) {
          cEl.textContent = clinical + '/6 items in clinical range';
          rEl.innerHTML = clinical >= 4 ? '<span class="as-positive">Positive screen \u2014 \u22654 items in clinical range</span>' : '<span class="as-negative">Below threshold \u2014 &lt;4 items in clinical range</span>';
        } else { cEl.textContent = '\u2014'; rEl.textContent = '\u2014'; }
      }

      function updateB() {
        var fc = {0:0,1:0,2:0,3:0,4:0};
        for (var i = 7; i <= 18; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el) fc[el.value]++; }
        for (var k = 0; k <= 4; k++) document.getElementById('as-freq-'+k).textContent = fc[k] || '\u2014';
      }

      function update() { updateA(); updateB(); }

      function report() {
        var d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
        var r = 'Adult ADHD Self-Report Scale (ASRS v1.1)\nDate: ' + d + '\n\nPART A (Screener)\n';
        for (var i = 1; i <= 6; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el) r += i + '. ' + LABELS[i] + ': ' + RESP[el.value] + '\n'; }
        var clinical = 0;
        for (var i = 1; i <= 3; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el && parseInt(el.value) >= 2) clinical++; }
        for (var i = 4; i <= 6; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el && parseInt(el.value) >= 3) clinical++; }
        r += '\nPart A Result: ' + clinical + '/6 items in clinical range \u2014 ' + (clinical >= 4 ? 'Positive screen' : 'Below threshold') + '\n\nPART B (Supplemental)\n';
        var fc = {0:0,1:0,2:0,3:0,4:0};
        for (var i = 7; i <= 18; i++) { var el = document.querySelector('input[name="asrs-'+i+'"]:checked'); if (el) { r += i + '. ' + LABELS[i] + ': ' + RESP[el.value] + '\n'; fc[el.value]++; } }
        r += '\nPart B Frequency: ' + (fc[0]||0) + ' Never, ' + (fc[1]||0) + ' Rarely, ' + (fc[2]||0) + ' Sometimes, ' + (fc[3]||0) + ' Often, ' + (fc[4]||0) + ' Very Often';
        navigator.clipboard.writeText(r).then(function(){ var b = document.getElementById('as-report-btn'); var o = b.textContent; b.textContent = 'Copied!'; setTimeout(function(){ b.textContent = o; }, 2000); });
      }

      document.querySelectorAll('.as-a-item, .as-b-item').forEach(function(el){ el.addEventListener('change', update); });
      document.getElementById('as-report-btn').addEventListener('click', report);
      document.getElementById('as-reset-btn').addEventListener('click', function() {
        if (confirm('Reset all ASRS responses?')) { document.querySelectorAll('.as-a-item, .as-b-item').forEach(function(r){ r.checked = false; }); update(); }
      });
      update();
    })();
  