/* ============================================================================
   roadmap-hero.js — the "Where Asure Intelligence goes next" convergence art.
   ----------------------------------------------------------------------------
   Adapted from Surya's reference build (asure-intelligence-hero.html): five
   studio sources swoop into a core, then resolve outward into four outputs.
   Same mechanism, retextured to the site's own accent (violet, not green) and
   with its own masthead removed — the section above it already carries the
   heading, so a second one here would just repeat it.

   Copy on the five sources and four outputs is the same content the removed
   static "hub" SVG used to carry (see MODIFICATIONS.md / the old #roadmap D2
   block) — nothing here is a new claim, just a livelier rendering of one that
   was already reviewed.

   Respects prefers-reduced-motion: the animation freezes on its resting frame
   instead of running, same contract as the rest of the site (.hub-flow,
   .hero-video, .rv all do the same).
   ============================================================================ */
(function () {
  'use strict';

  var root = document.getElementById('rmapHero');
  if (!root) return;
  var canvas = document.getElementById('rmapCanvas');
  var btn = document.getElementById('rmapTransport');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, dpr = 1;
  var orbX = 0, orbY = 0, orbR = 0, termX = 0;
  var lanes = [], specks = [], rays = [], packets = [], motes = [];
  var running = true, t0 = performance.now(), now = 0, ignition = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---------------------------------------------------------------- geometry */
  function layout() {
    var r = root.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var narrow = W < 760;
    orbX = narrow ? W * 0.50 : W * 0.525;
    orbY = narrow ? H * 0.50 : H * 0.52;
    orbR = narrow ? Math.min(W * 0.20, H * 0.15) : Math.min(W * 0.088, H * 0.235);
    termX = orbX + orbR * 0.26;

    buildLanes(narrow);
    buildSpecks();
    placeLabels(narrow);
  }

  /* five sources swooping into the core */
  function buildLanes(narrow) {
    var n = 5;
    var top = narrow ? H * 0.20 : H * 0.36;
    var bot = narrow ? H * 0.80 : H * 0.90;
    var x0 = narrow ? W * 0.10 : W * 0.10;
    lanes = [];
    for (var i = 0; i < n; i++) {
      var y0 = top + (bot - top) * (i / (n - 1));
      lanes.push({
        p0: { x: x0, y: y0 },
        p1: { x: x0 + W * 0.16, y: y0 },
        p2: { x: orbX - W * 0.15, y: orbY + (y0 - orbY) * 0.10 },
        p3: { x: orbX - orbR * 0.5, y: orbY },
        y0: y0
      });
    }
  }

  function bez(l, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return { x: a * l.p0.x + b * l.p1.x + c * l.p2.x + d * l.p3.x,
             y: a * l.p0.y + b * l.p1.y + c * l.p2.y + d * l.p3.y };
  }

  function buildSpecks() {
    specks = [];
    var count = Math.round(orbR * 1.7);
    for (var i = 0; i < count; i++) {
      var a = rand(0, Math.PI * 2), rr = Math.sqrt(Math.random()) * orbR * 0.94;
      specks.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr, r: rand(0.6, 2.6),
        a: rand(0.10, 0.62), drift: rand(0.04, 0.20), ph: rand(0, Math.PI * 2) });
    }
  }

  function spawnRay(seed) {
    var spread = 1.48, ang = rand(-spread, spread);
    return { ang: ang, r: seed ? rand(orbR, W * 0.62) : orbR * rand(0.86, 1.02),
      v: rand(0.55, 3.5), len: rand(18, 190), w: rand(0.4, 1.5), head: rand(0.7, 2.3),
      lum: Math.random() < 0.13 ? 1 : rand(0.22, 0.8), max: W * rand(0.42, 0.72) };
  }
  function spawnMote(seed) {
    var ang = rand(-1.5, 1.5);
    return { ang: ang, r: seed ? rand(orbR, W * 0.55) : orbR * rand(0.9, 1.1),
      v: rand(0.3, 1.9), s: rand(0.5, 1.8), a: rand(0.15, 0.75), max: W * rand(0.35, 0.62) };
  }
  function seedField() {
    rays = []; motes = []; packets = [];
    for (var i = 0; i < 620; i++) rays.push(spawnRay(true));
    for (var j = 0; j < 260; j++) motes.push(spawnMote(true));
    for (var k = 0; k < 5; k++)
      for (var m = 0; m < 5; m++)
        packets.push({ lane: k, t: m / 5 + Math.random() * 0.06, v: rand(0.0016, 0.0034) });
  }

  function placeLabels(narrow) {
    var srcEls = root.querySelectorAll('.rmap-src');
    Array.prototype.forEach.call(srcEls, function (el) {
      var lane = lanes[+el.dataset.lane];
      el.style.top = lane.y0 + 'px';
      el.style.animationDelay = (0.75 + (+el.dataset.lane) * 0.13) + 's';
    });
    var outEls = root.querySelectorAll('.rmap-out');
    var ys = narrow ? [0.14, 0.29, 0.71, 0.86] : [0.20, 0.385, 0.655, 0.845];
    var xs = narrow ? [0.06, 0.06, 0.06, 0.06] : [0.755, 0.815, 0.795, 0.735];
    Array.prototype.forEach.call(outEls, function (el, i) {
      el.style.top = (H * ys[i]) + 'px';
      el.style.left = (W * xs[i]) + 'px';
      el.style.animationDelay = (2.55 + i * 0.19) + 's';
    });
  }

  /* ---------------------------------------------------------------- painting */
  function drawAmbient() {
    var g = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR * 7.5);
    g.addColorStop(0, 'rgba(106,63,224,0.30)');
    g.addColorStop(0.32, 'rgba(58,38,110,0.14)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawLanes() {
    ctx.lineWidth = 1;
    lanes.forEach(function (l) {
      ctx.beginPath();
      ctx.moveTo(l.p0.x, l.p0.y);
      ctx.bezierCurveTo(l.p1.x, l.p1.y, l.p2.x, l.p2.y, l.p3.x, l.p3.y);
      var g = ctx.createLinearGradient(l.p0.x, 0, l.p3.x, 0);
      g.addColorStop(0, 'rgba(106,63,224,0.05)');
      g.addColorStop(0.6, 'rgba(106,63,224,0.15)');
      g.addColorStop(1, 'rgba(213,199,255,0.30)');
      ctx.strokeStyle = g;
      ctx.stroke();
    });
    packets.forEach(function (p) {
      var l = lanes[p.lane];
      var a = bez(l, p.t);
      var b = bez(l, Math.max(0, p.t - 0.055));
      var grow = 0.35 + p.t * 0.85;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y); ctx.lineTo(a.x, a.y);
      ctx.strokeStyle = 'rgba(160,130,255,' + (0.32 * grow) + ')';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.5 * grow, 0, 6.2832);
      ctx.fillStyle = 'rgba(240,235,255,' + (0.55 + 0.4 * p.t) + ')';
      ctx.fill();
    });
  }

  function drawOrb() {
    var pulse = 1 + ignition * 0.05;
    var bg = ctx.createRadialGradient(orbX, orbY, orbR * 0.55, orbX, orbY, orbR * 2.35);
    bg.addColorStop(0, 'rgba(150,110,255,' + (0.30 + ignition * 0.22) + ')');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(orbX, orbY, orbR * 2.35, 0, 6.2832); ctx.fill();

    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, termX, H); ctx.clip();
    var g = ctx.createRadialGradient(
      orbX - orbR * 0.34, orbY - orbR * 0.20, orbR * 0.05, orbX, orbY, orbR * pulse);
    g.addColorStop(0, 'rgba(243,238,255,0.98)');
    g.addColorStop(0.34, 'rgba(210,192,255,0.95)');
    g.addColorStop(0.72, 'rgba(150,110,235,0.88)');
    g.addColorStop(0.94, 'rgba(94,58,190,0.72)');
    g.addColorStop(1, 'rgba(52,32,110,0.30)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(orbX, orbY, orbR * pulse, 0, 6.2832); ctx.fill();

    specks.forEach(function (s) {
      var y = s.y + Math.sin(now * 0.00042 * (1 + s.drift) + s.ph) * orbR * 0.035;
      ctx.beginPath();
      ctx.arc(orbX + s.x, orbY + y, s.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(250,247,255,' + s.a * 0.75 + ')';
      ctx.fill();
    });
    ctx.restore();
  }

  function drawBurst() {
    ctx.save();
    ctx.beginPath(); ctx.rect(termX, 0, W - termX, H); ctx.clip();
    rays.forEach(function (p) {
      var fade = 1 - clamp((p.r - p.max * 0.55) / (p.max * 0.45), 0, 1);
      if (fade <= 0) return;
      var near = clamp((p.r - orbR * 0.9) / (orbR * 0.6), 0, 1);
      var a = fade * near * p.lum * ignition;
      if (a <= 0.004) return;
      var c = Math.cos(p.ang), s = Math.sin(p.ang);
      var tail = Math.max(orbR * 0.88, p.r - p.len);
      ctx.beginPath();
      ctx.moveTo(orbX + c * tail, orbY + s * tail);
      ctx.lineTo(orbX + c * p.r, orbY + s * p.r);
      ctx.strokeStyle = p.lum > 0.92
        ? 'rgba(240,235,255,' + a * 0.85 + ')'
        : 'rgba(124,92,255,' + a * 0.72 + ')';
      ctx.lineWidth = p.w;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(orbX + c * p.r, orbY + s * p.r, p.head, 0, 6.2832);
      ctx.fillStyle = 'rgba(214,199,255,' + a + ')';
      ctx.fill();
    });
    motes.forEach(function (m) {
      var fade = 1 - clamp((m.r - m.max * 0.5) / (m.max * 0.5), 0, 1);
      var a = fade * m.a * ignition;
      if (a <= 0.004) return;
      ctx.beginPath();
      ctx.arc(orbX + Math.cos(m.ang) * m.r, orbY + Math.sin(m.ang) * m.r, m.s, 0, 6.2832);
      ctx.fillStyle = 'rgba(180,155,255,' + a + ')';
      ctx.fill();
    });
    ctx.restore();
  }

  /* --------------------------------------------------------------- simulate */
  function step(dt) {
    packets.forEach(function (p) {
      p.t += p.v * dt;
      if (p.t > 1) { p.t -= 1; p.v = rand(0.0016, 0.0034); }
    });
    if (ignition < 1) ignition = clamp((now - 1750) / 1500, 0, 1);
    rays.forEach(function (p, i) { p.r += p.v * dt * ignition; if (p.r > p.max) rays[i] = spawnRay(false); });
    motes.forEach(function (m, i) { m.r += m.v * dt * ignition; if (m.r > m.max) motes[i] = spawnMote(false); });
  }

  var last = performance.now();
  function frame(ts) {
    var raw = ts - last; last = ts;
    if (running) { now = ts - t0; step(clamp(raw / 16.667, 0, 3)); }
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0E1116';
    ctx.fillRect(0, 0, W, H);
    drawAmbient(); drawLanes(); drawBurst(); drawOrb();
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------- control */
  var ICON_PAUSE = '<rect x="0" y="0" width="3.4" height="12"/><rect x="7.6" y="0" width="3.4" height="12"/>';
  var ICON_PLAY = '<path d="M0 0 L11 6 L0 12 Z"/>';
  if (btn) {
    btn.addEventListener('click', function () {
      running = !running;
      root.classList.toggle('is-paused', !running);
      btn.querySelector('svg').innerHTML = running ? ICON_PAUSE : ICON_PLAY;
      btn.setAttribute('aria-label', running ? 'Pause animation' : 'Play animation');
      btn.setAttribute('aria-pressed', String(!running));
    });
  }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { layout(); seedField(); }, 120);
  });

  layout();
  seedField();

  if (reduced) {
    ignition = 1; running = false;
    root.classList.add('is-paused');
    if (btn) {
      btn.querySelector('svg').innerHTML = ICON_PLAY;
      btn.setAttribute('aria-label', 'Play animation');
    }
    step(0);
  }

  requestAnimationFrame(frame);
})();
