/* ============================================================================
   intro.js — the brand-film opening. Two switchable placements chosen by
   ?intro= (curtain default, hero, or off) -- see MODIFICATIONS.md, item W1.

   The show/hide decision for the curtain already ran inline, next to its
   markup in index.html, so there is no flash of it on repeat visits or
   ?intro=off/hero. This file wires up the curtain's controls once that
   decision is made, plus the hero-card play button (the card itself is
   always visible now, in every mode -- see site-chrome.css) and the
   dev-only ?dev=1 switcher.
   ========================================================================== */
(function () {
  'use strict';

  var qs = null;
  try { qs = new URLSearchParams(location.search); } catch (e) { /* unsupported */ }
  var mode = qs ? qs.get('intro') : null;
  var isDev = !!(qs && qs.get('dev') === '1');

  /* ---- curtain: only wire up if the inline script already activated it -- */
  var curtain = document.getElementById('introCurtain');
  if (curtain && curtain.classList.contains('is-active')) {
    var video = document.getElementById('introCurtainVideo');
    var unmuteBtn = document.getElementById('introUnmute');
    var skipBtn = document.getElementById('introSkip');
    var closed = false;

    var close = function () {
      if (closed) return;
      closed = true;
      try { sessionStorage.setItem('asure.filmSeen', '1'); } catch (e) {}
      curtain.classList.add('is-leaving');
      document.documentElement.classList.remove('intro-curtain-active');
      setTimeout(function () {
        curtain.classList.remove('is-active', 'is-leaving');
        if (video) video.pause();
      }, 520);
    };

    if (video) {
      /* Muted autoplay only -- never sound without a click. */
      var playAttempt = video.play();
      if (playAttempt && playAttempt.catch) {
        playAttempt.catch(function () { /* blocked -- Skip/Unmute stay usable */ });
      }
      video.addEventListener('ended', close);
    }
    if (unmuteBtn && video) {
      unmuteBtn.addEventListener('click', function () {
        video.muted = !video.muted;
        unmuteBtn.setAttribute('aria-pressed', String(!video.muted));
        unmuteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
      });
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', close);
      skipBtn.focus();
    }
  }

  /* ---- hero film card: always present now, so always wired up -----------
     Used to be gated behind ?intro=hero because the card itself was hidden
     in every other mode. It is visible in all modes now (site-chrome.css),
     so the play button has to work in all of them too. */
  var card = document.getElementById('heroFilmCard');
  var heroVideo = document.getElementById('heroFilmVideo');
  var playBtn = document.getElementById('heroFilmPlay');
  if (card && heroVideo && playBtn) {
    playBtn.addEventListener('click', function () {
      heroVideo.muted = false;
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
      card.classList.add('is-playing');
    });
  }

  /* ---- dev-only switcher: never rendered unless ?dev=1 ------------------- */
  if (isDev) {
    var wrap = document.createElement('div');
    wrap.className = 'intro-dev-switch';
    var links = [
      { label: 'curtain', href: '?intro=force&dev=1', current: mode === 'curtain' || mode === 'force' || !mode },
      { label: 'hero', href: '?intro=hero&dev=1', current: mode === 'hero' },
      { label: 'off', href: '?intro=off&dev=1', current: mode === 'off' }
    ];
    links.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.current) a.className = 'is-current';
      wrap.appendChild(a);
    });
    document.body.appendChild(wrap);
  }
})();
