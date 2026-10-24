/* Google Analytics 4 setup. The measurement ID comes from this script tag's
   data-ga-id attribute, so the CSP can forbid inline script. */
(function () {
  var s = document.currentScript;
  var id = s && s.getAttribute('data-ga-id');
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  if (id) window.gtag('config', id);
})();
