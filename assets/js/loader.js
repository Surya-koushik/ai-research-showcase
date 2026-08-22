/* ============================================================================
   loader.js — decide how long the Asure → Evolve opening stays.
   ----------------------------------------------------------------------------
   The overlay is in the markup, so it paints on the first frame. This only
   chooses the exit, and whether the full transformation plays at all.

   The transformation is an opening. It runs once per browsing session; every
   page after that gets the Evolve state directly (.is-short), because a 2.6s
   brand moment on every navigation stops being a brand moment and becomes a
   toll booth. sessionStorage rather than localStorage, so a visitor coming
   back tomorrow sees it again.

   "Ready" means the catalogue has rendered, not window.load -- load waits on
   every screenshot, which on a tool page is several hundred KB nobody needs
   before they can start reading.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'asure.introSeen';
  var FULL_MS = 2600;   /* the sequence needs this long to finish */
  var SHORT_MS = 850;   /* below this the overlay flickers rather than reads */
  var FADE_MS = 560;    /* keep in step with the transition in loader.css */

  var node = document.querySelector('.evo-loader');
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* private mode */ }

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var full = !seen && !reduced;

  if (node && !full) node.classList.add('is-short');
  try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* nothing to do */ }

  var minimum = full ? FULL_MS : SHORT_MS;
  var start = Date.now();
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    if (!node) return;
    setTimeout(function () {
      node.classList.add('is-done');
      /* Removed rather than hidden: it is a full-screen fixed layer, and a
         stale one keeps a compositor layer alive for nothing. */
      setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
        document.documentElement.classList.add('evo-ready');
      }, FADE_MS);
    }, Math.max(0, minimum - (Date.now() - start)));
  }

  /* Pages call this when their own content is on screen. */
  window.LOADER_DONE = finish;

  /* Fallbacks, in order of how long they leave someone waiting. */
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
  setTimeout(finish, 7000);
})();
