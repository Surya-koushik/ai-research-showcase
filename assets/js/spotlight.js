/* ============================================================================
   spotlight.js — cursor-follow glow on .fcard (react-bits pass, 2026-08-31)
   ----------------------------------------------------------------------------
   Evaluated react-bits' Spotlight Card (components/spotlight-card): a radial
   gradient positioned at the pointer via two CSS custom properties, faded in
   on hover. No React in the reference implementation either — it is a plain
   ref + onMouseMove + style.setProperty, which is exactly reproducible here
   with delegated event listeners instead of a per-card ref.

   This is MOTION-IDENTITY.md's SECONDARY layer for the card family ("hairline
   brightening, shadow lift, icon shift") — .fcard already had the lift
   (:hover{transform:translateY(-2px)}) and the border-colour brightening;
   this adds the third thing premium card sites in the reference class
   (Linear, Vercel, Stripe) all share and this site didn't have: the glow
   tracks the pointer, so the card reads as reactive rather than static.

   One delegated listener, not one per card — .fcard renders 14-31 at a time
   across the pager and the video grid, and per-card listeners would be
   dead weight on cards nobody is pointing at. Position is written directly
   (no CSS transition on --mx/--my, matching fixing-motion-performance's
   rule against animating custom properties) and batched through a single
   rAF per pointermove burst so a fast mouse sweep across the grid doesn't
   fire more style writes than the display can show.

   Gated to hover-capable, fine-pointer devices only (mirrors the
   `@media(hover:hover) and (pointer:fine)` gate on the CSS side) — touch
   has no persistent pointer position, so the effect would just leave a
   ghost glow at the last tap point with nothing to move it. */
(function () {
  'use strict';

  var mq = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)');
  if (!mq || !mq.matches) return;

  var raf = null;
  var pending = null;

  function apply() {
    raf = null;
    if (!pending) return;
    var card = pending.card, x = pending.x, y = pending.y;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (x - r.left) + 'px');
    card.style.setProperty('--my', (y - r.top) + 'px');
    pending = null;
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    var card = e.target.closest && e.target.closest('.fcard');
    if (!card) return;
    pending = { card: card, x: e.clientX, y: e.clientY };
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });
}());
