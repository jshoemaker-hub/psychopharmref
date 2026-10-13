/* Recommended Videos — inject a youtube-nocookie iframe only after click. */
(function () {
  'use strict';

  var ID_RE = /^[A-Za-z0-9_-]{11}$/;

  function play(btn) {
    var id = btn.getAttribute('data-yt-id');
    if (!id || !ID_RE.test(id) || btn.getAttribute('data-rv-loaded') === '1') return;
    btn.setAttribute('data-rv-loaded', '1');

    var title = btn.getAttribute('data-yt-title') || 'YouTube video';
    var frame = document.createElement('div');
    frame.className = 'rv-frame';

    var iframe = document.createElement('iframe');
    iframe.className = 'rv-iframe';
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1';
    iframe.title = title;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.appendChild(iframe);
    btn.replaceWith(frame);
  }

  document.addEventListener('click', function (event) {
    var btn = event.target && event.target.closest
      ? event.target.closest('button.rv-facade[data-yt-id]')
      : null;
    if (!btn) return;
    play(btn);
  });
})();
