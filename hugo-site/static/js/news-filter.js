/* Newsroom archive: filter cards by desk. */
(function () {
  var btns = document.querySelectorAll('.nw-filter-btn');
  function apply(desk) {
    btns.forEach(function (b) { var on = b.getAttribute('data-desk') === desk; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    document.querySelectorAll('.nw-grid--archive .nw-card').forEach(function (c) {
      c.hidden = desk !== 'all' && c.getAttribute('data-desk') !== desk;
    });
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-desk')); }); });
  var m = location.hash.match(/^#desk-(\w+)/);
  if (m) apply(m[1]);
})();
