/* ============================================================================
   placeholder.js — branded stand-in art for any project with no real capture.
   ----------------------------------------------------------------------------
   Generated, not stored. Deterministic from the project id, so a tool always
   gets the same tile and the grid stays stable between reloads.

   Drawn in the deck language: a dark ground, a masked drafting grid, one soft
   glow in the colour of the project's KIND, and a quiet code numeral. The first
   version used saturated candy gradients, which shouted over a page built to be
   restrained — and the random constellation read as arbitrary. This version
   carries information instead: the colour tells you what kind of thing it is.

   TO REPLACE WITH A REAL SCREENSHOT: drop the file at
       projects/<id>/screenshots/hero.png
   and set  media.hero  on the project. The image wins automatically.

   PLACEHOLDER(project, opts) -> HTML string
     opts.code   show the project code               (default true)
     opts.label  show a caption line (workflow stage) (default false)
     opts.mark   show the "awaiting capture" tag      (default true)
     opts.hidden render it display:none, to sit behind an <img> that may fail
   ============================================================================ */
(function () {
  'use strict';

  /* One colour per kind, matching the diagrams and the grid labels. */
  var KIND_HUE = {
    plugin:    '#8A77FF',
    dashboard: '#00D4FF',
    pipeline:  '#22E6A8',
    connector: '#7C5CFF',
    platform:  '#FFB020',
    agent:     '#FF6FB1',
    evaluation:'#7C849F',
    deck:      '#FF6B85'
  };

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

  /* A short chain of nodes rather than a scattered web — it reads as a
     connected system, which is what these tools are, instead of noise. */
  function art(seed) {
    var r = lcg(seed), i, N = 5, nodes = [];
    for (i = 0; i < N; i++) {
      nodes.push({
        x: 46 + (i * 68) + (r() - 0.5) * 26,
        y: 62 + r() * 100,
        s: 2.0 + r() * 2.2
      });
    }
    var path = 'M' + nodes.map(function (n) { return n.x.toFixed(1) + ' ' + n.y.toFixed(1); }).join('L');
    var dots = nodes.map(function (n) {
      return '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + n.s.toFixed(1) + '"/>';
    }).join('');
    return '<path class="lk" d="' + path + '"/><g class="nd">' + dots + '</g>';
  }

  window.PLACEHOLDER = function (p, opts) {
    opts = opts || {};
    var id   = (p && p.id) || 'unknown';
    var seed = fnv(id);
    var hue  = KIND_HUE[(p && p.kind)] || '#7C5CFF';
    /* Glow position varies per project so the grid does not look stamped. */
    var gx   = 18 + (seed % 60);
    var gy   = 10 + ((seed >> 6) % 40);

    var code  = opts.code  === false ? '' : esc((p && p.code) || '');
    var label = opts.label === true  ? esc((p && p.workflowStage) || '') : '';
    var mark  = opts.mark  === false ? '' : 'awaiting capture';
    var hide  = opts.hidden ? 'display:none;' : '';

    return '<div class="ph phold" style="' + hide + '--ph:' + hue + ';--gx:' + gx + '%;--gy:' + gy + '%">' +
             '<span class="phgrid" aria-hidden="true"></span>' +
             '<span class="phglow" aria-hidden="true"></span>' +
             '<svg class="phart" viewBox="0 0 340 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
               art(seed) +
             '</svg>' +
             (code  ? '<span class="phcode">'  + code  + '</span>' : '') +
             (label ? '<span class="phlabel">' + label + '</span>' : '') +
             (mark  ? '<span class="phmark">'  + mark  + '</span>' : '') +
           '</div>';
  };
})();
