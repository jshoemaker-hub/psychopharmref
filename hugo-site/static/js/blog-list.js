/* Chapter list page: filter chapter cards as you type. */
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('blog-list-search');
  var grid = document.getElementById('blog-post-grid');
  if (!input || !grid) return;
  var cards = Array.from(grid.querySelectorAll('.blog-post-card'));
  var timer;
  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        cards.forEach(function(c) { c.classList.remove('hidden-by-search'); });
        return;
      }
      var terms = q.split(/\s+/);
      cards.forEach(function(card) {
        var text = card.textContent.toLowerCase();
        var match = terms.every(function(t) { return text.indexOf(t) >= 0; });
        card.classList.toggle('hidden-by-search', !match);
      });
    }, 150);
  });
});
