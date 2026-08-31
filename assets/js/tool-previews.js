/* ============================================================================
   tool-previews.js — the video-preview behaviour shared by every tool card.
   ----------------------------------------------------------------------------
   Assets: assets/previews/<slug>.jpg (poster) + <slug>.mp4 (silent, looping).
   Discovered by slug at runtime — there is no manifest. The <img> just points
   at the file; if it 404s the card falls back to a kind-tinted icon tile
   instead of a broken image or an empty box.

   PREVIEW_MEDIA(slug, kind, extraClass) returns the markup a card embeds.
   PREVIEW_INIT() (re)scans the document for '.pv-media' nodes and wires them
   up — call it again after any innerHTML swap that added new cards.

   Rules this follows (design brief, 2026-08-31):
   - preload="none" always; the <video> element itself is only created once a
     card is near the viewport or actually hovered, never 52 at once.
   - desktop (hover:hover) plays on mouseenter, pauses+resets on mouseleave.
   - touch (hover:none) plays while the card is in view, pauses when it isn't.
   - at most PLAY_MAX preview videos play at once, globally, across the page.
   - prefers-reduced-motion: poster only, video is never attached.
   - muted + loop + playsinline always; no audio track is ever expected.
   ============================================================================ */
(function () {
  'use strict';

  var PLAY_MAX = 2;
  var PREVIEW_DIR = 'assets/previews/';
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && matchMedia('(hover: none), (pointer: coarse)').matches;

  /* Per-element state, keyed by the '.pv-media' node so re-scanning never
     double-wires the same card. */
  var state = typeof WeakMap === 'function' ? new WeakMap() : null;
  var seen = [];                       /* fallback for engines with no WeakMap */
  function getState(el) {
    if (state) return state.get(el);
    for (var i = 0; i < seen.length; i++) if (seen[i][0] === el) return seen[i][1];
    return undefined;
  }
  function setState(el, s) {
    if (state) { state.set(el, s); return; }
    seen.push([el, s]);
  }

  var playing = [];                    /* videos currently playing, oldest first */
  function stopVideo(v) {
    if (!v) return;
    try { v.pause(); v.currentTime = 0; } catch (e) { /* not ready yet, fine */ }
    var media = v.closest && v.closest('.pv-media');
    if (media) media.classList.remove('is-playing');
    var idx = playing.indexOf(v);
    if (idx !== -1) playing.splice(idx, 1);
  }
  function reserveSlot(v) {
    while (playing.length >= PLAY_MAX) {
      var oldest = playing[0];
      if (oldest === v) break;
      stopVideo(oldest);
    }
    if (playing.indexOf(v) === -1) playing.push(v);
  }

  /* Creates the <video> the first time a card needs it. Returns null (and
     marks the card empty) if the clip 404s — the poster, or the icon
     fallback if the poster also failed, stays on screen either way. */
  function attachVideo(media, s) {
    if (s.video || s.errored || reduced) return s.video;
    var slug = media.getAttribute('data-preview-slug');
    var v = document.createElement('video');
    v.className = 'pv-video';
    v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
    v.preload = 'none';
    v.setAttribute('aria-hidden', 'true');
    v.setAttribute('tabindex', '-1');
    v.addEventListener('error', function () {
      v.remove();
      s.video = null;
      /* A missing clip does not necessarily mean a missing poster — only
         flip to the icon fallback if the poster failed too. */
      if (!s.hasPoster) media.classList.add('is-empty');
    });
    media.appendChild(v);
    /* Direct .src (not a <source> child) so the resource-selection algorithm
       runs deterministically on assignment, then .play() below both starts
       the fetch (preload="none" defers it until now) and playback. */
    v.src = PREVIEW_DIR + slug + '.mp4';
    s.video = v;
    return v;
  }

  function play(media, s) {
    if (reduced || s.errored) return;
    var v = attachVideo(media, s);
    if (!v) return;
    reserveSlot(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay refused, poster stays visible */ });
    media.classList.add('is-playing');
  }
  function pause(media, s) {
    if (!s.video) return;
    stopVideo(s.video);
  }

  function wirePoster(media, s) {
    var img = media.querySelector('.pv-poster');
    if (!img) return;
    function ok() { s.hasPoster = true; media.classList.add('has-poster'); }
    function fail() { s.errored = true; media.classList.add('is-empty'); }
    if (img.complete && img.naturalWidth === 0 && img.src) { fail(); return; }
    if (img.complete && img.naturalWidth > 0) { ok(); return; }
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', fail, { once: true });
  }

  /* One IO for the whole page. Touch devices use it to drive play/pause;
     desktop only uses it to know a card is close, which matters nothing here
     since hover already implies visibility — it is left running on desktop
     too so the code path is one path, not two. */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var media = entry.target;
      var s = getState(media);
      if (!s) return;
      if (isTouch) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) play(media, s);
        else pause(media, s);
      }
    });
  }, { threshold: [0, 0.5], rootMargin: '80px 0px' }) : null;

  function wireCard(media) {
    if (getState(media)) return;                 /* already wired */
    var s = { video: null, errored: false, hasPoster: false };
    setState(media, s);
    wirePoster(media, s);
    if (io) io.observe(media);
    if (!isTouch) {
      /* Hover the whole card, not just the thumbnail strip -- the card is
         one clickable target (an <a>), so the preview should react to the
         same area a visitor would naturally point at. */
      var host = media.closest('a') || media;
      host.addEventListener('mouseenter', function () { play(media, s); });
      host.addEventListener('mouseleave', function () { pause(media, s); });
    }
  }

  function PREVIEW_INIT() {
    var nodes = document.querySelectorAll('.pv-media');
    for (var i = 0; i < nodes.length; i++) wireCard(nodes[i]);
  }

  /* Markup a card embeds. `kind` picks the icon shown while there is no
     preview (or before the poster has resolved either way) — never a blank
     box. `extra` adds a size/position modifier class, e.g. 'pv-media--row'. */
  function PREVIEW_MEDIA(slug, kind, extra) {
    if (!slug) return '';
    var icon = (typeof KIND_ICON === 'function') ? KIND_ICON(kind, 'pv-empty-ic') : '';
    return '<div class="pv-media' + (extra ? ' ' + extra : '') + '" data-preview-slug="' + slug + '">' +
      '<img class="pv-poster" alt="" loading="lazy" decoding="async" src="' + PREVIEW_DIR + slug + '.jpg">' +
      '<div class="pv-empty" aria-hidden="true">' + icon + '</div>' +
    '</div>';
  }

  window.PREVIEW_MEDIA = PREVIEW_MEDIA;
  window.PREVIEW_INIT = PREVIEW_INIT;

  document.addEventListener('DOMContentLoaded', PREVIEW_INIT);
})();
