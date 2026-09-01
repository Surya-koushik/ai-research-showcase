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
  var pauseBtn = document.getElementById('heroFilmPause');
  var maximizeBtn = document.getElementById('heroFilmMaximize');
  var closeBtn = document.getElementById('heroFilmClose');
  if (card && heroVideo && playBtn) {
    function syncPlaybackControl() {
      if (!pauseBtn) return;
      pauseBtn.setAttribute('aria-label', heroVideo.paused ? 'Play film' : 'Pause film');
    }
    function openFilm() {
      card.classList.add('is-playing', 'is-expanded');
      document.body.classList.add('hero-film-open');
      if (closeBtn) closeBtn.focus();
    }
    function closeFilm() {
      heroVideo.pause();
      card.classList.remove('is-playing', 'is-expanded');
      document.body.classList.remove('hero-film-open');
      syncPlaybackControl();
      playBtn.focus();
    }
    playBtn.addEventListener('click', function () {
      heroVideo.muted = false;
      openFilm();
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    });
    if (pauseBtn) pauseBtn.addEventListener('click', function () {
      if (heroVideo.paused) {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      } else heroVideo.pause();
    });
    if (maximizeBtn) maximizeBtn.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (card.requestFullscreen) card.requestFullscreen();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeFilm);
    heroVideo.addEventListener('play', syncPlaybackControl);
    heroVideo.addEventListener('pause', syncPlaybackControl);
    heroVideo.addEventListener('ended', closeFilm);
    document.addEventListener('fullscreenchange', function () {
      if (maximizeBtn) maximizeBtn.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && card.classList.contains('is-expanded') && !document.fullscreenElement) closeFilm();
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
