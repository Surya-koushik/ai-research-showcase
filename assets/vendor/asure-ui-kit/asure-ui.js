/* ============================================================================
   ASURE UI KIT — asure-ui.js
   Behavior layer for the a-* component vocabulary. Vanilla JS, zero deps.

   Everything is declarative via data attributes; call AsureUI.init() once
   after DOM is ready (or load with `defer` — it self-initializes).

   ── Tabs (primary) ─────────────────────────────────────────────
     <div class="a-tabs" data-a-tabs="main">
       <button class="a-tab" data-tab="overview">Overview</button>…
     </div>
     <section data-a-panel="main:overview">…</section>
     · active tab gets .is-active; panels shown/hidden by [data-a-panel]
     · deep link: #tab=main:overview/sub:codes  (multiple groups compose)

   ── Sub-tabs ───────────────────────────────────────────────────
     Same contract with class .a-subtabs/.a-subtab, data-a-tabs group id.
     Groups nested inside a hidden panel keep state; shown on reveal.

   ── Segmented ──────────────────────────────────────────────────
     <div class="a-seg" data-a-seg="scope" data-value="all">
       <button class="a-seg-btn" data-value="all">All</button>…
     </div>
     · fires CustomEvent 'a-change' {group,value} on the element.

   ── Toggle ─────────────────────────────────────────────────────
     <label class="a-toggle"><input type="checkbox" data-a-toggle="sim">
       <span class="a-track"></span> Simulation mode</label>
     · fires 'a-change' {group,value:boolean} on the input.

   ── Accordion ──────────────────────────────────────────────────
     <div class="a-acc"><button class="a-acc-head">…<svg class="a-caret">…
       <div class="a-acc-body">…</div></div>
     · toggles [data-open]; add data-a-exclusive="group" on a wrapper for
       one-open-at-a-time behaviour.

   ── Toasts ─────────────────────────────────────────────────────
     AsureUI.toast('Saved'); — shared stacking container, fallback timer.

   ── Formatters ─────────────────────────────────────────────────
     AsureUI.inr(2818000)        → "₹28,18,000"
     AsureUI.inr(2818000,{cr:1}) → "₹28.18 L" / auto Cr
     AsureUI.num(12345.6, 1)     → "12,345.6"
   ========================================================================== */
(function (global) {
  'use strict';

  var UI = {};

  /* ---------------------------------------------------------------- utils */
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fire(el, group, value) {
    el.dispatchEvent(new CustomEvent('a-change', { bubbles: true, detail: { group: group, value: value } }));
  }

  /* ------------------------------------------------------------ hash state
     #tab=main:overview/sub:codes — the tab state of every group lives in
     the hash so views deep-link and survive reload. Non-tab hashes are
     left untouched.                                                       */
  function readHashState() {
    var m = location.hash.match(/tab=([^&]+)/);
    var state = {};
    if (m) m[1].split('/').forEach(function (pair) {
      var kv = pair.split(':');
      if (kv.length === 2) state[kv[0]] = kv[1];
    });
    return state;
  }
  function writeHashState(state) {
    var pairs = Object.keys(state).map(function (k) { return k + ':' + state[k]; });
    var rest = location.hash.replace(/^#/, '').replace(/tab=[^&]*&?/, '').replace(/&$/, '');
    var h = 'tab=' + pairs.join('/');
    if (rest) h += '&' + rest;
    history.replaceState(null, '', '#' + h);
  }
  var hashState = {};

  /* ------------------------------------------------------------------ tabs */
  function activateTab(group, value, opts) {
    var bar = document.querySelector('[data-a-tabs="' + group + '"]');
    if (!bar) return;
    var found = false;
    $all('[data-tab]', bar).forEach(function (btn) {
      var on = btn.getAttribute('data-tab') === value;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) found = true;
    });
    if (!found) return;
    $all('[data-a-panel]').forEach(function (panel) {
      var spec = panel.getAttribute('data-a-panel'); // "group:value"
      var i = spec.indexOf(':');
      if (spec.slice(0, i) !== group) return;
      panel.classList.toggle('a-hide', spec.slice(i + 1) !== value);
    });
    hashState[group] = value;
    if (!opts || !opts.silent) writeHashState(hashState);
    fire(bar, group, value);
  }

  function initTabs(root) {
    var fromHash = readHashState();
    $all('[data-a-tabs]', root).forEach(function (bar) {
      var group = bar.getAttribute('data-a-tabs');
      bar.setAttribute('role', 'tablist');
      $all('[data-tab]', bar).forEach(function (btn) { btn.setAttribute('role', 'tab'); });
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-tab]');
        if (btn && bar.contains(btn)) activateTab(group, btn.getAttribute('data-tab'));
      });
      /* initial: hash > .is-active in markup > first tab */
      var initial = fromHash[group];
      if (!initial) {
        var marked = bar.querySelector('.is-active[data-tab]') || bar.querySelector('[data-tab]');
        if (marked) initial = marked.getAttribute('data-tab');
      }
      if (initial) activateTab(group, initial, { silent: true });
    });
    if (Object.keys(hashState).length) writeHashState(hashState);
  }

  /* ------------------------------------------------------------- segmented */
  function initSegs(root) {
    $all('[data-a-seg]', root).forEach(function (seg) {
      var group = seg.getAttribute('data-a-seg');
      function set(value, silent) {
        seg.setAttribute('data-value', value);
        $all('.a-seg-btn', seg).forEach(function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-value') === value);
        });
        if (!silent) fire(seg, group, value);
      }
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('.a-seg-btn');
        if (b && seg.contains(b)) set(b.getAttribute('data-value'));
      });
      set(seg.getAttribute('data-value') ||
          (seg.querySelector('.a-seg-btn') && seg.querySelector('.a-seg-btn').getAttribute('data-value')), true);
    });
  }

  /* --------------------------------------------------------------- toggles */
  function initToggles(root) {
    $all('input[data-a-toggle]', root).forEach(function (input) {
      input.addEventListener('change', function () {
        fire(input, input.getAttribute('data-a-toggle'), input.checked);
      });
    });
  }

  /* ------------------------------------------------------------- accordion */
  function initAccordions(root) {
    $all('.a-acc', root).forEach(function (acc) {
      var head = acc.querySelector('.a-acc-head');
      if (!head) return;
      head.setAttribute('aria-expanded', acc.hasAttribute('data-open') ? 'true' : 'false');
      head.addEventListener('click', function () {
        var opening = !acc.hasAttribute('data-open');
        var exclusiveRoot = acc.closest('[data-a-exclusive]');
        if (opening && exclusiveRoot) {
          $all('.a-acc[data-open]', exclusiveRoot).forEach(function (other) {
            other.removeAttribute('data-open');
            var oh = other.querySelector('.a-acc-head');
            if (oh) oh.setAttribute('aria-expanded', 'false');
          });
        }
        if (opening) acc.setAttribute('data-open', ''); else acc.removeAttribute('data-open');
        head.setAttribute('aria-expanded', opening ? 'true' : 'false');
      });
    });
  }

  /* ---------------------------------------------------------------- toasts */
  var toastBox = null;
  UI.toast = function (msg, ms) {
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'a-toasts';
      document.body.appendChild(toastBox);
    }
    var t = document.createElement('div');
    t.className = 'a-toast';
    t.textContent = msg;
    toastBox.appendChild(t);
    /* unconditional removal timer — never rely on transition events alone */
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, ms || 3200);
  };

  /* ------------------------------------------------------------ formatters */
  UI.num = function (v, dp) {
    if (v == null || isNaN(v)) return '—';
    return Number(v).toLocaleString('en-IN', {
      minimumFractionDigits: dp || 0, maximumFractionDigits: dp == null ? 2 : dp
    });
  };
  UI.inr = function (v, opts) {
    if (v == null || isNaN(v)) return '—';
    opts = opts || {};
    var abs = Math.abs(v);
    if (opts.auto !== false && abs >= 1e7) return '₹' + UI.num(v / 1e7, 2) + ' Cr';
    if (opts.auto !== false && abs >= 1e5) return '₹' + UI.num(v / 1e5, 2) + ' L';
    return '₹' + UI.num(v, opts.dp != null ? opts.dp : 0);
  };
  UI.pct = function (v, dp) { return v == null || isNaN(v) ? '—' : UI.num(v, dp == null ? 1 : dp) + '%'; };

  /* --------------------------------------------------------------- density */
  UI.setDensity = function (mode) {
    document.documentElement.setAttribute('data-density', mode);
    try { localStorage.setItem('asure-ui-density', mode); } catch (e) { /* private mode */ }
  };
  function restoreDensity() {
    try {
      var d = localStorage.getItem('asure-ui-density');
      if (d) document.documentElement.setAttribute('data-density', d);
    } catch (e) { /* private mode */ }
  }

  /* ------------------------------------------------------------------ init */
  UI.activateTab = activateTab;
  UI.init = function (root) {
    restoreDensity();
    initTabs(root);
    initSegs(root);
    initToggles(root);
    initAccordions(root);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { UI.init(); });
  } else {
    UI.init();
  }

  global.AsureUI = UI;
})(window);
