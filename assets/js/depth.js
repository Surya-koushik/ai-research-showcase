/* depth.js — the small scroll-tied drift for the ambient .glow elements added
   in the structural-depth pass (site-chrome.css, "STRUCTURAL DEPTH"). Gives
   each glow a sense of sitting at a different depth than the text in front of
   it: it moves at a few percent of scroll delta, never the full amount.

   Deliberately independent of which element actually scrolls. The kit's
   frame lock makes .a-view the scroll container on desktop, but the document
   scrolls instead on narrow viewports where the app frame collapses — rather
   than branch on that, this reads getBoundingClientRect() on every tick,
   which is always viewport-relative regardless of which ancestor moved.

   Off entirely under prefers-reduced-motion: the CSS position each glow
   already has is a complete, correct resting state, so there is nothing to
   fall back to — the drift is skipped, not swapped for a cruder version. */
(function () {
  'use strict';
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
  if (!els.length || !('requestAnimationFrame' in window)) return;

  /* Read each element's own inline transform once (the #close glow, and any
     other centred glow, arrives with its own translateX(-50%)) so the drift
     is appended to it rather than replacing it. */
  els.forEach(function (el) {
    el._depthBase = el.style.transform || '';
    el._depthFactor = parseFloat(el.getAttribute('data-depth')) || 0.05;
  });

  var ticking = false;

  function update() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var offset = (center - vh / 2) * el._depthFactor;
      var base = el._depthBase;
      el.style.transform = base + (base ? ' ' : '') + 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  document.addEventListener('scroll', onScroll, { passive: true });
  var view = document.querySelector('.a-view');
  if (view) view.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  update();

  /* Pause the ambient breathing animation (site-chrome.css, ".glow::after",
     react-bits pass) while its glow is off-screen — fixing-motion-performance:
     "pause looping animations off-screen; they burn GPU even when invisible."
     Five elements, so this is a small win, but the rule is explicit and the
     IO is nearly free once depth.js already has the element list. `.is-off`
     just sets animation-play-state:paused on the pseudo (site-chrome.css). */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('is-off', !e.isIntersecting);
      });
    }, { rootMargin: '200px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
})();
