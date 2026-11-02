/* Delegated click actions.
 *
 * The Content-Security-Policy forbids inline script, so markup never carries
 * onclick="…". Instead an element says what it does with data- attributes and
 * this one listener carries it out:
 *
 *   data-dismiss-warning      close the disclaimer modal (runs first)
 *   data-go="section-id"      switchSection(section-id); off the SPA, go to /#section-id
 *   data-call="fnName"        call a global function from CALLABLE below, with
 *     data-arg / data-arg2      string arguments, and
 *     data-with-el="first|last" the clicked element passed first or last
 *   data-close-search         close the unified search dropdown (runs last)
 *   data-print                window.print()
 *   data-toggle-self="cls"    toggle a class on the element
 *   data-toggle-next="cls"    toggle a class on the next sibling
 *   data-copy-link            copy the page's canonical URL, show "Copied!"
 *   data-share                native share sheet, or copy the link
 *
 * Links handled here never follow their href.
 */
(function () {
  'use strict';

  var CALLABLE = [
    'printBlankForm', 'ppOpenBrain', 'ppGoSection', 'handoutsFilter',
    'switchCompareView', 'switchRBView', 'calcQTc', 'calcDaysBetween',
    'calcUsage', 'calcForwardRefills', 'calcReverseRefills', 'calcMedSync',
    'openDrugModal', 'jumpToReceptorChart', 'openBhiCard', 'toggleReceptor',
    'toggleGlossaryCard', 'glossaryScrollToTerm', 'rcCopy'
  ];

  var SELECTOR = '[data-go],[data-call],[data-print],[data-toggle-self],' +
    '[data-toggle-next],[data-copy-link],[data-share],[data-dismiss-warning]';

  function go(section) {
    if (typeof window.switchSection === 'function' && document.getElementById(section)) {
      window.switchSection(section);
    } else {
      window.location.href = '/#' + section;
    }
  }

  function pageUrl() {
    var canon = document.querySelector('link[rel="canonical"]');
    return canon ? canon.href : window.location.href;
  }

  function copyLink(btn) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(pageUrl()).then(function () {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = orig; }, 2000);
    });
  }

  function call(el) {
    var name = el.getAttribute('data-call');
    if (CALLABLE.indexOf(name) === -1 || typeof window[name] !== 'function') return;
    var args = [];
    if (el.hasAttribute('data-arg')) args.push(el.getAttribute('data-arg'));
    if (el.hasAttribute('data-arg2')) args.push(el.getAttribute('data-arg2'));
    var withEl = el.getAttribute('data-with-el');
    if (withEl === 'first') args.unshift(el);
    if (withEl === 'last') args.push(el);
    window[name].apply(window, args);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest(SELECTOR);
    if (!el) return;
    if (el.tagName === 'A') e.preventDefault();

    if (el.hasAttribute('data-dismiss-warning') && typeof window.dismissWarning === 'function') window.dismissWarning();
    if (el.hasAttribute('data-go')) go(el.getAttribute('data-go'));
    if (el.hasAttribute('data-call')) call(el);
    if (el.hasAttribute('data-close-search') && typeof window.__usCloseAll === 'function') window.__usCloseAll();
    if (el.hasAttribute('data-print')) window.print();
    if (el.hasAttribute('data-toggle-self')) el.classList.toggle(el.getAttribute('data-toggle-self'));
    if (el.hasAttribute('data-toggle-next') && el.nextElementSibling) {
      el.nextElementSibling.classList.toggle(el.getAttribute('data-toggle-next'));
    }
    if (el.hasAttribute('data-copy-link')) copyLink(el);
    if (el.hasAttribute('data-share')) {
      if (navigator.share) navigator.share({ title: document.title, url: pageUrl() }).catch(function () {});
      else copyLink(el);
    }
  });
})();
