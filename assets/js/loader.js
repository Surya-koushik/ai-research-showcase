/* ============================================================================
   loader.js — take the Evolve loader away once the page is actually usable.
   ----------------------------------------------------------------------------
   The overlay is in the HTML, so it paints before any script runs. This only
   decides when to remove it.

   "Usable" here means the catalogue has rendered, not that the window fired
   load — window.load waits on every screenshot, which on the tool pages is
   several hundred KB the reader does not need before they can start reading.
   Pages call READY() when their own render finishes; anything that forgets is
   caught by the window.load fallback.

   There is a floor of MIN_MS. Locally the site renders in well under a frame,
   and an overlay that appears and vanishes inside 80ms reads as a flicker
   rather than an intro. There is no ceiling here beyond the CSS bail-out.
   ========================================================================== */
(function () {
  'use strict';

  var MIN_MS = 900;          /* below this it flashes rather than plays */
  var FADE_MS = 520;         /* must match the transition in loader.css */
  var start = Date.now();
  var done = false;

  function el() { return document.querySelector('.evo-loader'); }

  function finish() {
    if (done) return;
    done = true;
    var node = el();
    if (!node) return;
    var wait = Math.max(0, MIN_MS - (Date.now() - start));
    setTimeout(function () {
      node.classList.add('is-done');
      /* Removed rather than left hidden: it is a fixed full-screen layer, and
         a stale one intercepts nothing but still costs a compositor layer. */
      setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
        document.documentElement.classList.add('evo-ready');
      }, FADE_MS);
    }, wait);
  }

  /* Pages signal here when their own content is on screen. */
  window.LOADER_DONE = finish;

  /* Fallbacks, in order of how much they make the reader wait:
       - a page that never calls READY still clears on window.load
       - a page with no scripts at all still clears on a timer          */
  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish);
  }
  setTimeout(finish, 6000);
})();
