/* ============================================================================
   diagrams.js — explanatory artwork, drawn rather than photographed.
   ----------------------------------------------------------------------------
   The showcase has no product screenshots yet, and a screenshot would not
   answer the question these need to answer anyway: what KIND of thing is this,
   and what does it actually do? Each diagram shows the mechanism.

   Shared language, borrowed from the Singapore deck:
     · hairline strokes on a dark ground
     · one accent colour per diagram, everything else neutral
     · mono labels, small and quiet
     · nothing decorative — every mark carries meaning

   DIAGRAM(key) -> inline SVG string. Scales to its container.
   ============================================================================ */
(function () {
  'use strict';

  var VB = '0 0 340 190';

  /* Neutral ink and the accent, so a diagram can be recoloured by its kind. */
  function open(accent) {
    return '<svg class="dgm" viewBox="' + VB + '" fill="none" xmlns="http://www.w3.org/2000/svg" ' +
           'style="--a:' + accent + '" aria-hidden="true">';
  }
  var CLOSE = '</svg>';

  /* helpers ---------------------------------------------------------------- */
  function box(x, y, w, h, cls) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
           '" rx="6" class="' + (cls || 'ln') + '"/>';
  }
  function label(x, y, t, cls) {
    return '<text x="' + x + '" y="' + y + '" class="lb ' + (cls || '') + '">' + t + '</text>';
  }
  function arrow(x1, y1, x2, y2) {
    /* Head gets its own class: a stroked shaft and a filled head cannot share
       one rule without the fill overriding the shaft. */
    return '<path d="M' + x1 + ' ' + y1 + 'H' + (x2 - 7) + '" class="ar"/>' +
           '<path d="M' + (x2 - 8) + ' ' + (y1 - 4) + 'l6 4-6 4z" class="arh"/>';
  }
  function stack(x, y, n, w, h, gap) {
    var out = '';
    for (var i = n - 1; i >= 0; i--) {
      out += '<rect x="' + (x + i * gap) + '" y="' + (y - i * gap) + '" width="' + w + '" height="' + h +
             '" rx="5" class="' + (i === 0 ? 'ac' : 'ln') + '"/>';
    }
    return out;
  }

  var D = {};

  /* PLUGIN — a button inside software you already own ---------------------- */
  D.plugin = function () {
    return open('var(--violet-400)') +
      box(20, 26, 300, 140) +
      '<path d="M20 52H320" class="ln"/>' +
      /* ribbon tabs */
      label(32, 44, 'HOST APPLICATION') +
      '<rect x="32" y="62" width="46" height="26" rx="5" class="ln"/>' +
      '<rect x="86" y="62" width="46" height="26" rx="5" class="ln"/>' +
      '<rect x="140" y="62" width="60" height="26" rx="5" class="ac fill"/>' +
      label(150, 79, 'ASURE', 'on') +
      '<rect x="208" y="62" width="46" height="26" rx="5" class="ln"/>' +
      /* the model below */
      '<path d="M32 108h276" class="ln dash"/>' +
      label(32, 126, 'YOUR MODEL, ALREADY OPEN') +
      '<path d="M240 100v54" class="ac"/>' +
      '<circle cx="240" cy="100" r="3.5" class="ac fill"/>' +
      label(150, 152, 'one click, no export', 'sm') +
      CLOSE;
  };

  /* DASHBOARD — a screen you read, that does not act ----------------------- */
  D.dashboard = function () {
    var bars = [30, 54, 40, 72, 48, 88, 64], out = '';
    for (var i = 0; i < bars.length; i++) {
      out += '<rect x="' + (44 + i * 26) + '" y="' + (140 - bars[i]) + '" width="14" height="' + bars[i] +
             '" rx="3" class="' + (i === 5 ? 'ac fill' : 'ln fill-dim') + '"/>';
    }
    return open('var(--cyan-500)') +
      box(20, 26, 300, 140) +
      label(32, 46, 'PROJECT STATE') +
      '<path d="M20 56H320" class="ln"/>' +
      out +
      '<path d="M44 140h232" class="ln"/>' +
      label(32, 160, 'read, not run', 'sm') +
      '<circle cx="288" cy="42" r="5" class="ac fill"/>' +
      CLOSE;
  };

  /* PIPELINE — fixed input, fixed output, no judgement --------------------- */
  D.pipeline = function () {
    return open('var(--emerald-400)') +
      stack(24, 66, 3, 54, 62, 5) +
      label(28, 148, 'FILES IN') +
      arrow(92, 96, 128, 96) +
      box(132, 62, 76, 68, 'ac') +
      label(150, 92, 'RULES', 'on') +
      label(146, 108, 'no calls', 'sm on') +
      arrow(214, 96, 250, 96) +
      stack(254, 66, 3, 54, 62, 5) +
      label(258, 148, 'RESULTS OUT') +
      CLOSE;
  };

  /* CONNECTOR — two systems that could not talk before --------------------- */
  D.connector = function () {
    return open('var(--violet-500)') +
      box(20, 54, 104, 84) +
      label(34, 80, 'SYSTEM A') +
      box(216, 54, 104, 84) +
      label(230, 80, 'SYSTEM B') +
      '<path d="M124 96h92" class="ac"/>' +
      '<circle cx="170" cy="96" r="13" class="ac fill"/>' +
      '<path d="M164 96h12M170 90v12" class="on"/>' +
      label(122, 138, 'translates both ways', 'sm') +
      '<path d="M136 84c14-10 34-10 48 0" class="ac dash"/>' +
      '<path d="M204 108c-14 10-34 10-48 0" class="ac dash"/>' +
      CLOSE;
  };

  /* PLATFORM — many people, one shared store ------------------------------- */
  D.platform = function () {
    var people = '', i;
    for (i = 0; i < 3; i++) {
      var x = 40 + i * 52;
      people += '<circle cx="' + x + '" cy="46" r="11" class="ln"/>' +
                '<path d="M' + (x - 15) + ' 74a15 15 0 0 1 30 0" class="ln"/>' +
                '<path d="M' + x + ' 82v18" class="ar"/>';
    }
    return open('var(--amber-400)') +
      people +
      box(24, 104, 152, 56, 'ac') +
      label(38, 130, 'ACCOUNTS + STORED DATA', 'on') +
      label(38, 148, 'state survives the session', 'sm on') +
      '<path d="M176 132h44" class="ar"/>' +
      box(224, 104, 96, 56) +
      label(238, 136, 'SHARED VIEW') +
      CLOSE;
  };

  /* AGENT — chooses its own next step -------------------------------------- */
  D.agent = function () {
    var tools = '', i, names = ['read', 'run', 'write'];
    for (i = 0; i < 3; i++) {
      tools += '<rect x="' + (208 + 0) + '" y="' + (36 + i * 44) + '" width="86" height="32" rx="6" class="ln"/>' +
               '<text x="' + 251 + '" y="' + (56 + i * 44) + '" class="lb mid">' + names[i] + '</text>' +
               '<path d="M150 96C176 96 182 ' + (52 + i * 44) + ' 204 ' + (52 + i * 44) + '" class="ac dash"/>';
    }
    return open('var(--pink-500)') +
      label(24, 30, 'GOAL') +
      box(20, 38, 74, 34, 'ac') +
      label(34, 60, 'OUTCOME', 'on') +
      '<path d="M57 72v14" class="ar"/>' +
      '<circle cx="122" cy="96" r="28" class="ac"/>' +
      label(122, 100, 'decide', 'mid on') +
      tools +
      '<path d="M122 124c-56 0-56-28-56-28" class="ac"/>' +
      '<path d="M70 92l-4 4 4 4" class="ac"/>' +
      label(24, 170, 'picks the next step itself', 'sm') +
      CLOSE;
  };

  /* STUDY — candidates in, a verdict out ----------------------------------- */
  D.evaluation = function () {
    var rows = '', verdict = ['pass', 'fail', 'fail', 'pass'], i;
    for (i = 0; i < 4; i++) {
      var y = 44 + i * 30, ok = verdict[i] === 'pass';
      rows += '<rect x="24" y="' + (y - 13) + '" width="150" height="24" rx="5" class="ln"/>' +
              '<path d="M180 ' + (y - 1) + 'h26" class="ar"/>' +
              (ok
                ? '<path d="M216 ' + (y - 3) + 'l5 6 10-12" class="ac"/>'
                : '<path d="M216 ' + (y - 8) + 'l12 12M228 ' + (y - 8) + 'l-12 12" class="dim"/>');
    }
    return open('var(--text-3)') +
      rows +
      label(246, 96, 'WHAT', 'on') +
      label(246, 112, 'SURVIVED', 'on') +
      label(24, 178, 'tested, not read about', 'sm') +
      CLOSE;
  };

  /* DECK — a finished argument, delivered ---------------------------------- */
  D.deck = function () {
    return open('var(--rose-400)') +
      '<rect x="24" y="34" width="180" height="106" rx="8" class="ln"/>' +
      '<rect x="36" y="24" width="180" height="106" rx="8" class="ln"/>' +
      '<rect x="48" y="14" width="180" height="106" rx="8" class="ac fill-dim"/>' +
      '<path d="M64 44h108M64 60h72" class="on"/>' +
      '<rect x="64" y="76" width="148" height="30" rx="5" class="ac"/>' +
      '<path d="M252 60h56M252 60l-8-6M252 60l-8 6" class="ar"/>' +
      label(250, 92, 'DELIVERED') +
      label(24, 172, 'an argument, not a document', 'sm') +
      CLOSE;
  };

  /* THE SYSTEM — the chain every tool is one link in ----------------------- */
  D.system = function () {
    var steps = ['SCATTERED', 'STRUCTURED', 'TOOLS', 'HOURS BACK'];
    var out = '', i;
    for (i = 0; i < 4; i++) {
      var x = 16 + i * 82;
      var last = i === 3;
      out += '<rect x="' + x + '" y="70" width="66" height="50" rx="8" class="' + (last ? 'ac fill-dim' : 'ln') + '"/>' +
             '<text x="' + (x + 33) + '" y="99" class="lb mid ' + (last ? 'on' : '') + '">' + steps[i] + '</text>';
      if (i < 3) out += arrow(x + 66, 95, x + 82, 95);
    }
    return open('var(--cyan-500)') + out +
      '<path d="M16 140h312" class="ln dash"/>' +
      label(16, 162, 'every tool is one link in this chain', 'sm') +
      CLOSE;
  };

  window.DIAGRAM = function (key) {
    return (D[key] || D.pipeline)();
  };
  window.DIAGRAM_KEYS = Object.keys(D);
})();
