
    (function() {
      var ADL_ITEMS = ['bathing','dressing','grooming','mouth-care','toileting','transferring','walking','stairs','eating'];
      var ADL_LABELS = ['Bathing','Dressing','Grooming','Mouth Care','Toileting','Transferring (Bed/Chair)','Walking','Climbing Stairs','Eating'];
      var IADL_ITEMS = ['shopping','cooking','medications','phone','housework','laundry','driving','finances'];
      var IADL_LABELS = ['Shopping','Cooking','Managing Medications','Using Phone / Looking Up Numbers','Doing Housework','Doing Laundry','Driving / Using Public Transportation','Managing Finances'];

      function countLevels(items) {
        var c = { Independent:0, 'Needs Help':0, Dependent:0, 'Cannot Do':0 };
        items.forEach(function(k) {
          var el = document.querySelector('input[name="ad-' + k + '"]:checked');
          if (el) c[el.value]++;
        });
        return c;
      }

      function updateSummary() {
        var a = countLevels(ADL_ITEMS);
        document.getElementById('ad-adl-independent').textContent = a.Independent;
        document.getElementById('ad-adl-help').textContent = a['Needs Help'];
        document.getElementById('ad-adl-dependent').textContent = a.Dependent;
        document.getElementById('ad-adl-cannot').textContent = a['Cannot Do'];
        var b = countLevels(IADL_ITEMS);
        document.getElementById('ad-iadl-independent').textContent = b.Independent;
        document.getElementById('ad-iadl-help').textContent = b['Needs Help'];
        document.getElementById('ad-iadl-dependent').textContent = b.Dependent;
        document.getElementById('ad-iadl-cannot').textContent = b['Cannot Do'];
      }

      function generateReport() {
        var d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
        var r = 'ADL / IADL Functional Assessment\nDate: ' + d + '\n\n';
        r += 'ACTIVITIES OF DAILY LIVING (ADL)\n';
        var ac = { Independent:0,'Needs Help':0,Dependent:0,'Cannot Do':0 }, an = 0;
        ADL_ITEMS.forEach(function(k,i) {
          var el = document.querySelector('input[name="ad-' + k + '"]:checked');
          if (el) { r += ADL_LABELS[i] + ': ' + el.value + '\n'; ac[el.value]++; an++; }
        });
        r += 'ADL Summary: ' + ac.Independent + ' Independent, ' + ac['Needs Help'] + ' Needs Help, ' + ac.Dependent + ' Dependent, ' + ac['Cannot Do'] + ' Cannot Do\n\n';
        r += 'INSTRUMENTAL ACTIVITIES OF DAILY LIVING (IADL)\n';
        var ic = { Independent:0,'Needs Help':0,Dependent:0,'Cannot Do':0 }, inum = 0;
        IADL_ITEMS.forEach(function(k,i) {
          var el = document.querySelector('input[name="ad-' + k + '"]:checked');
          if (el) { r += IADL_LABELS[i] + ': ' + el.value + '\n'; ic[el.value]++; inum++; }
        });
        r += 'IADL Summary: ' + ic.Independent + ' Independent, ' + ic['Needs Help'] + ' Needs Help, ' + ic.Dependent + ' Dependent, ' + ic['Cannot Do'] + ' Cannot Do\n\n';
        var tot = an + inum;
        r += 'Overall: ' + tot + '/17 items rated | ' + (ac.Independent+ic.Independent) + ' Independent, ' + (ac['Needs Help']+ic['Needs Help']) + ' Needs Help, ' + (ac.Dependent+ic.Dependent) + ' Dependent, ' + (ac['Cannot Do']+ic['Cannot Do']) + ' Cannot Do';
        navigator.clipboard.writeText(r).then(function() {
          var btn = document.getElementById('ad-generate-btn');
          var orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function(){ btn.textContent = orig; }, 2000);
        });
      }

      document.querySelectorAll('.ad-adl-item, .ad-iadl-item').forEach(function(el) {
        el.addEventListener('change', updateSummary);
      });
      document.getElementById('ad-generate-btn').addEventListener('click', generateReport);
      document.getElementById('ad-reset-btn').addEventListener('click', function() {
        if (confirm('Reset all ADL/IADL responses?')) {
          document.querySelectorAll('.ad-adl-item, .ad-iadl-item').forEach(function(r){ r.checked = false; });
          updateSummary();
        }
      });
      updateSummary();
    })();
  