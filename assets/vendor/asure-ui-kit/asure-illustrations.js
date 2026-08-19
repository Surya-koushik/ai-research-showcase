/* ============================================================================
   ASURE UI KIT — asure-illustrations.js
   Line-art top-band illustrations, in the ratified house taste:
   single continuous ink line, subtle pastel accents, compact, text-aligned,
   quietly animated (draw → hold → travel away), reduced-motion safe.

   Usage:
     <div class="a-band-art" data-a-illus="skyline"></div>
     <script src="kit/asure-illustrations.js" defer></script>
   or  AsureIllus.mount(el, 'skyline')  /  AsureIllus.svg('skyline') → string

   Motifs: skyline · tower · energy · ledger · knowledge · systems
   All viewBox 0 0 280 130. Ink follows currentColor (defaults --ink);
   pastels use the kit tokens so they re-theme with the CSS.
   ========================================================================== */
(function (global) {
  'use strict';

  var STYLE_ID = 'asure-illus-style';
  var CSS =
    '.a-illus{color:var(--ink,#0f172a)}' +
    '.a-illus .ink{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;' +
      'stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;' +
      'animation:a-illus-draw 9s var(--ease-out,ease-out) infinite}' +
    '.a-illus .ink.d2{animation-delay:.35s}' +
    '.a-illus .pastel{opacity:0;animation:a-illus-fade 9s linear infinite}' +
    '@keyframes a-illus-draw{0%{stroke-dashoffset:1}30%{stroke-dashoffset:0}' +
      '78%{stroke-dashoffset:0}96%{stroke-dashoffset:-1}100%{stroke-dashoffset:-1}}' +
    '@keyframes a-illus-fade{0%,18%{opacity:0}34%,80%{opacity:1}94%,100%{opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){' +
      '.a-illus .ink{animation:none;stroke-dashoffset:0}' +
      '.a-illus .pastel{animation:none;opacity:1}}';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* pastel token shorthands */
  var AMBER = 'var(--pastel-amber,#f5d9a8)';
  var SAGE  = 'var(--pastel-sage,#cfe0cf)';
  var SKY   = 'var(--pastel-sky,#cfe0f0)';
  var ROSE  = 'var(--pastel-rose,#efd3d3)';

  var MOTIFS = {

    /* city skyline with a tower crane — architecture / masterplanning */
    skyline: [
      '<circle class="pastel" cx="236" cy="34" r="16" fill="' + AMBER + '"/>',
      '<rect class="pastel" x="96" y="58" width="30" height="52" fill="' + SKY + '"/>',
      '<rect class="pastel" x="170" y="44" width="24" height="66" fill="' + SAGE + '"/>',
      '<path class="ink" pathLength="1" d="M8 110 H40 V78 H58 V110 H74 V52 H96' +
        ' V110 H126 V58 H96 M126 110 H146 V88 H160 V110 H170 V44 H194 V110 H216' +
        ' V72 H236 V110 H272 M52 78 V38 H50 M52 38 H118 M84 38 V52 M118 38 L112 30' +
        ' M118 38 V46"/>'
    ].join(''),

    /* wireframe high-rise with floors — structural / massing tools */
    tower: [
      '<rect class="pastel" x="118" y="26" width="44" height="84" fill="' + SKY + '"/>',
      '<circle class="pastel" cx="52" cy="44" r="14" fill="' + AMBER + '"/>',
      '<path class="ink" pathLength="1" d="M12 110 H268 M118 110 V26 H162 V110' +
        ' M118 40 H162 M118 54 H162 M118 68 H162 M118 82 H162 M118 96 H162' +
        ' M140 26 V16 H150 M180 110 V64 H210 V110 M180 78 H210 M180 92 H210' +
        ' M70 110 V84 H96 V110 M225 110 V88 H248 V110"/>'
    ].join(''),

    /* sun + PV row + small turbine — energy / sustainability */
    energy: [
      '<circle class="pastel" cx="60" cy="38" r="18" fill="' + AMBER + '"/>',
      '<rect class="pastel" x="150" y="78" width="100" height="14" fill="' + SAGE + '" transform="skewX(-18)"/>',
      '<path class="ink" pathLength="1" d="M10 110 H270 M60 20 V12 M84 30 L90 24' +
        ' M92 52 H100 M36 30 L30 24 M60 38 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0' +
        ' M120 110 L138 84 H168 L150 110 M150 110 L168 84 H198 L180 110 M180 110 L198 84 H228 L210 110' +
        ' M238 110 V70 M238 70 L226 60 M238 70 L252 62 M238 70 L240 54"/>'
    ].join(''),

    /* document → arrow → coin stack — admin / accounts / BOQ */
    ledger: [
      '<rect class="pastel" x="46" y="30" width="58" height="76" fill="' + SKY + '"/>',
      '<ellipse class="pastel" cx="216" cy="96" rx="30" ry="10" fill="' + AMBER + '"/>',
      '<path class="ink" pathLength="1" d="M40 106 V24 H86 L98 36 V106 H40' +
        ' M86 24 V36 H98 M50 48 H88 M50 60 H88 M50 72 H74 M50 84 H82' +
        ' M112 66 H150 M150 66 L142 58 M150 66 L142 74' +
        ' M188 100 a28 8 0 1 0 56 0 a28 8 0 1 0 -56 0 M188 100 V88 a28 8 0 0 1 56 0 V100' +
        ' M188 88 V76 a28 8 0 0 1 56 0 V88 M208 80 h16"/>'
    ].join(''),

    /* open book → rising line — knowledge / study / guidelines */
    knowledge: [
      '<rect class="pastel" x="52" y="52" width="80" height="52" fill="' + SAGE + '"/>',
      '<circle class="pastel" cx="234" cy="40" r="12" fill="' + AMBER + '"/>',
      '<path class="ink" pathLength="1" d="M44 104 V50 C66 40 88 40 92 50 C96 40 118 40 140 50 V104' +
        ' C118 96 96 96 92 104 C88 96 66 96 44 104 M92 50 V104' +
        ' M56 60 H84 M56 70 H84 M100 60 H128 M100 70 H128' +
        ' M156 96 L184 76 L202 84 L234 52 M234 52 H222 M234 52 V64"/>'
    ].join(''),

    /* ducts, fan, droplet — MEP / systems verticals */
    systems: [
      '<circle class="pastel" cx="86" cy="66" r="24" fill="' + SKY + '"/>',
      '<rect class="pastel" x="168" y="42" width="70" height="16" fill="' + ROSE + '"/>',
      '<path class="ink" pathLength="1" d="M14 110 H266 M86 66 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0' +
        ' M86 66 L86 50 M86 66 L100 74 M86 66 L72 74 M86 66 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0' +
        ' M118 50 H160 V34 H244 M160 50 H244 M244 34 V50' +
        ' M204 66 C204 76 196 80 196 88 a8 8 0 0 0 16 0 C212 80 204 76 204 66' +
        ' M132 110 V88 H156 V110 M226 110 V92 H250 V110"/>'
    ].join('')
  };

  function svg(name) {
    var body = MOTIFS[name] || MOTIFS.skyline;
    return '<svg class="a-illus" viewBox="0 0 280 130" xmlns="http://www.w3.org/2000/svg"' +
           ' role="img" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  function mount(el, name) {
    ensureStyle();
    el.innerHTML = svg(name || el.getAttribute('data-a-illus'));
  }

  function init(root) {
    ensureStyle();
    var els = (root || document).querySelectorAll('[data-a-illus]');
    Array.prototype.forEach.call(els, function (el) { mount(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }

  global.AsureIllus = { svg: svg, mount: mount, init: init, motifs: Object.keys(MOTIFS) };
})(window);
