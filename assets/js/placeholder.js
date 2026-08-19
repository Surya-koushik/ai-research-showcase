/* ============================================================================
   placeholder.js — branded stand-in art for any project with no real capture.
   ----------------------------------------------------------------------------
   Generated, not stored. The artwork is deterministic from the project id, so a
   tool always gets the same tile and the grid stays stable between reloads.

   TO REPLACE WITH A REAL SCREENSHOT: drop the file at
       projects/<id>/screenshots/hero.png
   and set  media.hero  on the project. The image wins automatically — nothing
   in this file ever has to change. cms.html lists every slot and its path.

   PLACEHOLDER(project, opts) -> HTML string
     opts.code   show the big project code            (default true)
     opts.label  show a caption line (workflow stage) (default false)
     opts.mark   show the "awaiting capture" tag      (default true)
     opts.hidden render it display:none, to sit behind an <img> that may fail
   ============================================================================ */
(function () {
  'use strict';

  /* Brand gradients, drawn from the same tokens as theme.css. */
  var GRADS = [
    ['#7C5CFF', '#00D4FF'],
    ['#22E6A8', '#00D4FF'],
    ['#8A77FF', '#FF6FB1'],
    ['#FF6FB1', '#FFB020'],
    ['#00D4FF', '#22E6A8'],
    ['#A89BFF', '#3DE0FF'],
    ['#6748E8', '#3DE0FF'],
    ['#FFB020', '#FF4D6D']
  ];

  /* FNV-1a — stable across browsers, unlike anything using Math.random(). */
  function fnv(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function lcg(seed) {
    var s = seed >>> 0;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* A small constellation — the same visual idea as the landing hero canvas. */
  function art(seed) {
    var r = lcg(seed), i, N = 7, nodes = [];
    for (i = 0; i < N; i++) nodes.push({ x: 22 + r() * 356, y: 22 + r() * 181, s: 1.6 + r() * 3.6 });

    var links = [];
    for (i = 0; i < N - 1; i++) links.push([i, i + 1]);
    links.push([0, 3 + (seed >> 3) % 3]);
    links.push([2, (5 + seed % 2) % N]);

    var lines = links.map(function (p) {
      var a = nodes[p[0]], b = nodes[p[1]];
      return '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) +
             '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '"/>';
    }).join('');
    var dots = nodes.map(function (a) {
      return '<circle cx="' + a.x.toFixed(1) + '" cy="' + a.y.toFixed(1) + '" r="' + a.s.toFixed(1) + '"/>';
    }).join('');

    return '<g class="lk">' + lines + '</g><g class="nd">' + dots + '</g>';
  }

  window.PLACEHOLDER = function (p, opts) {
    opts = opts || {};
    var id   = (p && p.id) || 'unknown';
    var seed = fnv(id);
    var g    = GRADS[seed % GRADS.length];
    var ang  = 110 + (seed >> 5) % 70;

    var code  = opts.code  === false ? '' : esc((p && p.code) || '');
    var label = opts.label === true  ? esc((p && p.workflowStage) || '') : '';
    var mark  = opts.mark  === false ? '' : 'awaiting capture';
    var hide  = opts.hidden ? 'display:none;' : '';

    return '<div class="ph phold" style="' + hide + '--pa:' + ang + 'deg;--p1:' + g[0] + ';--p2:' + g[1] + '">' +
             '<svg class="phart" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
               art(seed) +
             '</svg>' +
             '<span class="phgrid" aria-hidden="true"></span>' +
             (code  ? '<span class="phcode">'  + code  + '</span>' : '') +
             (label ? '<span class="phlabel">' + label + '</span>' : '') +
             (mark  ? '<span class="phmark">'  + mark  + '</span>' : '') +
           '</div>';
  };
})();
