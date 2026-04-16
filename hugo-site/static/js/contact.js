(function(){
          var form = document.getElementById('ct-form');
          var statusEl = document.getElementById('ct-status');
          var submitBtn = document.getElementById('ct-submit');

          form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Check honeypot
            var honey = form.querySelector('input[name="_gotcha"]');
            if (honey && honey.value) {
              statusEl.className = 'ct-status ct-status-success';
              statusEl.textContent = 'Message sent successfully!';
              statusEl.style.display = 'block';
              form.reset();
              return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            var data = new FormData(form);

            fetch(form.action, {
              method: 'POST',
              body: data,
              headers: { 'Accept': 'application/json' }
            }).then(function(response) {
              if (response.ok) {
                statusEl.className = 'ct-status ct-status-success';
                statusEl.textContent = 'Message sent successfully! Thank you for reaching out.';
                statusEl.style.display = 'block';
                form.reset();
              } else {
                throw new Error('Form submission failed');
              }
            }).catch(function() {
              statusEl.className = 'ct-status ct-status-error';
              statusEl.textContent = 'Something went wrong. Please try again or email directly.';
              statusEl.style.display = 'block';
            }).finally(function() {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Send Message';
              setTimeout(function(){ statusEl.style.display = 'none'; }, 5000);
            });
          });
        })();
