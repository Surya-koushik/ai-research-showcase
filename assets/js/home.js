/* ============================================================================
   home.js — the landing page, rebuilt as scroll-composed bands.
   ----------------------------------------------------------------------------
   Replaces the rail-and-grid dashboard. Content is unchanged; the pacing is
   not — one idea per band, and every kind of thing we build gets a drawn
   explanation rather than a label.
   ============================================================================ */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* The card's one-line summary: the record's own headline where a tool has
     written one, otherwise the first sentence of its tagline — never the
     whole tagline, never the longer THE PROBLEM/WHAT IT DOES copy. */
  function firstSentence(s) {
    if (!s) return '';
    var m = /^[^.!?]*[.!?]/.exec(s.trim());
    return (m ? m[0] : s).trim();
  }
  function cardLine(p) {
    return (p.highlights && p.highlights.headline) || firstSentence(p.tagline);
  }

  /* Each kind owns one accent, shared by its card stripe, its grid label and
     the diagram that explains it. */
  var ACCENT = {
    plugin:    'var(--violet-400)',
    dashboard: 'var(--cyan-500)',
    pipeline:  'var(--emerald-400)',
    connector: 'var(--violet-500)',
    platform:  'var(--amber-400)',
    agent:     'var(--pink-500)',
    evaluation:'var(--text-3)',
    deck:      'var(--rose-400)'
  };

  /* ---------------------------------------------------------------- chrome -- */
  /* One theme, no toggle. Removed 2026-08-25 on Surya's instruction: light.css
     and dala.css each force html/body with !important, so the dark path never
     actually painted and the control was decorative. */
  document.documentElement.setAttribute("data-theme", "light");

  /* --- navigation drawer ------------------------------------------------ */
  var navToggle = $("#navToggle"), navScrim = $("#navScrim"),
      navClose = $("#navClose"), sidebar = $("#sidebar");
  navScrim.hidden = false;               // markup ships it hidden so it cannot flash
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    sidebar.setAttribute("aria-hidden", open ? "false" : "true");
  }
  navToggle.onclick = function () { setNav(!document.body.classList.contains("nav-open")); };
  navScrim.onclick  = function () { setNav(false); };
  if (navClose) navClose.onclick = function () { setNav(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  $("#nav").addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });

  $('#searchIc').innerHTML = ICON('search');

  /* --------------------------------------------------------------- states --- */
  /* No fixed tool total is derived or printed here -- the catalogue keeps
     growing, so PROJECTS.length would be stale on arrival. Kind counts and
     build-state counts are fine: each is a live count of a subset, not a
     claim about a grand total. */
  var measured = PROJECTS.map(function (p) { return derive(p.efficiency); }).filter(Boolean);
  var savedTotal = Math.round(measured.reduce(function (a, d) { return a + d.saved; }, 0));

  /* Three build states, collapsed from the four status values on the data.
     "Ready" is exactly status:production, unchanged from what the rest of the
     site already calls Production. Anything not explicitly production or
     in-progress -- research, experimental, or a status this build has never
     seen -- lands in "In progress": the lowest state, never the highest, so
     an unrecognised value can't accidentally read as more finished than it is. */
  var toolReady    = PROJECTS.filter(function (p) { return p.status === 'production'; }).length;
  var toolBuilding = PROJECTS.filter(function (p) { return p.status === 'in-progress'; }).length;
  var toolEarly    = PROJECTS.length - toolReady - toolBuilding;

  /* Labels run most-finished to least. "In production" was wrong in the middle slot:
     it reads as shipped, so the half-built bucket claimed more than the finished one. */
  var TOOL_STATES = [
    { n: toolReady,    l: 'Live',       c: '#0d8a52' },
    { n: toolBuilding, l: 'In build',   c: 'var(--accent)' },
    { n: toolEarly,    l: 'Exploring',  c: 'var(--muted)' }
  ];
  var statesEl = $('#toolStates');
  if (statesEl) statesEl.innerHTML = TOOL_STATES.map(function (s) {
    return '<div class="tstate">' +
      '<span class="tstate-dot" style="--sc:' + s.c + '"></span>' +
      '<span class="tstate-n">' + s.n + '</span>' +
      '<span class="tstate-l">' + s.l + '</span></div>';
  }).join('');

  /* Hours-saved counter, rebuilt as a split-flap / departure-board roll-up
     (item 3): starts at 0, climbs to the measured total one digit at a time,
     the way an airport board turns over. The number itself is set once here
     -- animateHours() below only plays it, never invents a bigger one, and
     under prefers-reduced-motion it paints the final digits straight away,
     no flapping.
     Kept short on purpose -- the "measured on N tools" methodology is stated
     once, in the "About these counts" note right under this card, not here
     too. Two cards saying the same sentence was exactly the repetition this
     whole section was rebuilt to remove. */
  var hoursEl = $('#hoursCounter');
  function flapDigits(n) {
    var s = String(Math.max(0, Math.round(n)));
    return (s.length < 2 ? '0' + s : s).split('');
  }
  var flapTarget = flapDigits(savedTotal);
  if (hoursEl) hoursEl.innerHTML =
    '<div class="flapboard" id="flapBoard" role="img" aria-label="' +
      Math.round(savedTotal) + ' hours saved a week, across the studio.">' +
      flapTarget.map(function () { return '<span class="flap-d"><i class="flap-face">0</i></span>'; }).join('') +
      '<span class="flap-unit">hrs<i>/</i>wk</span>' +
    '</div>' +
    '<div class="hc-l">Hours saved each week, across the studio.</div>';

  function setFlapDigit(cell, d) {
    var face = cell.querySelector('.flap-face');
    if (!face) return;
    face.textContent = d;
    cell.classList.remove('is-flip');
    void cell.offsetWidth;                       /* restart the CSS keyframe */
    cell.classList.add('is-flip');
  }

  function animateHours() {
    var host = document.getElementById('flapBoard');
    if (!host) return;
    var cells = Array.prototype.slice.call(host.querySelectorAll('.flap-d'));
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function land() {
      cells.forEach(function (cell, i) {
        var face = cell.querySelector('.flap-face');
        if (face) face.textContent = flapTarget[i];
      });
    }
    if (reduced || !('IntersectionObserver' in window)) { land(); return; }
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        /* Each column starts a little after the one before it and counts up
           from 0 to its own final digit, never past it -- the roll reads as
           the board still catching up to a real number, not a random spin. */
        cells.forEach(function (cell, i) {
          var final = +flapTarget[i];
          setTimeout(function () {
            var step = 0;
            var timer = setInterval(function () {
              setFlapDigit(cell, step);
              if (step >= final) { clearInterval(timer); return; }
              step++;
            }, 85);
          }, i * 90);
        });
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    io2.observe(host);
  }

  /* ---------------------------------------------------------------- kinds --- */
  function count(kind) {
    return PROJECTS.filter(function (p) { return p.kind === kind; }).length;
  }
  /* Icon grid, the treatment carried over from the removed "six tools" strip
     (item 2): a solid icon mark, the name on top, one word underneath --
     same EvolveLab card pattern the featured cards use, applied here to all
     eight KINDS instead of six chosen tools. No blurb paragraph -- that lived
     in the old #kinds section; the full descriptions still live on
     KINDS[].blurb (title attribute) for anywhere else that wants them.
     One accent, not eight (2026-08-31, Surya): this row is a logo grid, not
     a legend -- ACCENT's per-kind hues stay reserved for the table rows and
     explorer tabs further down, where colour actually helps someone scan a
     list. Here every tile carries the same --kc so the row reads as one
     system instead of a random palette. */
  $('#kindGrid').innerHTML = KINDS.filter(function (k) { return k.id !== 'all'; }).map(function (k, i) {
    var n = count(k.id);
    return '<a class="kindcard rv" href="#ecosystem" data-jump="' + k.id + '"' +
      ' style="--kc:var(--accent);--d:' + (i * 60) + 'ms" title="' + k.blurb + '">' +
      '<span class="ki">' + KIND_ICON(k.id) + '</span>' +
      '<b class="kc-name">' + k.label + '</b>' +
      '<span class="kc-count">' + n + ' tool' + (n === 1 ? '' : 's') + '</span></a>';
  }).join('');

  /* The explorer rail filters in place. #exRail is stable -- only its
     innerHTML is replaced -- so one delegated listener is enough. */
  /* #exRail was removed in the exhibition pass; guard so this cannot throw. */
  var railEl = document.getElementById('exRail');
  if (railEl) railEl.addEventListener('click', function (e) {
    var tab = e.target.closest('[data-kind]');
    if (!tab) return;
    state.kind = tab.dataset.kind; state.domain = 'all'; state.page = 0;
    renderNav(); renderAndReveal();
  });

  /* Clicking a kind card scrolls to the grid with that filter applied. */
  $('#kindGrid').addEventListener('click', function (e) {
    var card = e.target.closest('[data-jump]');
    if (!card) return;
    state.kind = card.dataset.jump; state.domain = 'all'; state.page = 0;
    renderNav(); renderAndReveal();
  });

  /* ---------------------------------------------------------------- nav ----- */
  /* The kit's hierarchy puts scope in the sidebar registry, not in a wrapping
     row of chips above the grid (spec section 4). Two sections, one active.
     `tech` is the software-logo quick filter (item 5b); `page` is which set
     of six the pager (item 5c) is showing -- reset to 0 by every filter
     change further down, so a new scope always opens on its first page. */
  var state = { kind: 'all', domain: 'all', q: '', tech: 'all', page: 0 };

  function domCount(id) {
    return PROJECTS.filter(function (p) { return p.domain === id; }).length;
  }

  function navItem(axis, id, label, n, icon, active) {
    return '<a class="a-nav-item' + (active ? ' is-active' : '') + '"' +
      ' data-axis="' + axis + '" data-id="' + id + '" href="#ecosystem">' +
      '<span class="ic">' + ICON(icon) + '</span>' +
      '<span>' + label + '</span>' + (n === '' ? '' : '<span class="n">' + n + '</span>') + '</a>';
  }

  function renderNav() {
    /* "All tools" carries no count -- same reason as the pill and titleblock:
       PROJECTS.length is not the whole body of work, so it does not get to
       stand in for it. Each individual kind's count is a real subset, kept. */
    var kindsHTML = KINDS.map(function (k) {
      var n = k.id === 'all' ? '' : count(k.id);
      return navItem('kind', k.id, k.label, n, k.icon,
                     state.kind === k.id && state.domain === 'all');
    }).join('');
    /* Jump links first. Without them the only way to reach the tool types was
       to scroll past them to the grid and then filter, which is backwards. */
    /* #numbers, #kinds and #ecosystem used to be three sections and had a jump each.
       They are one section now, so three of the five links landed within a screen of
       each other. Kept #kinds and #ecosystem as anchors for inbound links from the
       tool pages, but the drawer only offers the places that are actually apart. */
    var JUMPS = [
      ['#top',       'home',   'Home'],
      ['#ecosystem', 'grid',   'The tools we build'],
      ['#videos',    'layers', 'See them running'],
      ['#roadmap',   'route',  'Roadmap']
    ];
    var jumpHTML = JUMPS.map(function (j) {
      return '<a class="a-nav-item nav-jump" href="' + j[0] + '">' +
             '<span class="ic">' + ICON(j[1] === 'home' ? 'building' : j[1]) + '</span>' +
             '<span>' + j[2] + '</span></a>';
    }).join('');

    $('#nav').innerHTML =
      '<div class="a-nav-sect"><span class="a-label">Go to</span></div>' + jumpHTML +
      '<div class="a-nav-sect"><span class="a-label">Browse by kind</span></div>' + kindsHTML;
  }

  $('#nav').addEventListener('click', function (e) {
    var item = e.target.closest('.a-nav-item');
    if (!item) return;
    if (item.classList.contains('nav-jump')) return;   /* a real anchor, let it scroll */
    e.preventDefault();
    if (item.dataset.axis === 'kind') { state.kind = item.dataset.id; state.domain = 'all'; }
    else { state.domain = state.domain === item.dataset.id ? 'all' : item.dataset.id; state.kind = 'all'; }
    state.page = 0;
    renderNav(); renderAndReveal();
  });

  /* The active scope, stated once above the grid with a way out of it.
     Never states the catalogue's total -- only the shown count, which is a
     live subset, not a claim about how big the whole thing is. */
  function renderScope(shown) {
    var bits = [];
    if (state.kind !== 'all')   bits.push(kindMeta(state.kind).label);
    if (state.domain !== 'all') bits.push(domainMeta(state.domain).label);
    if (state.tech !== 'all')   bits.push(logoLabel(state.tech));
    if (state.q)                bits.push('“' + state.q + '”');
    $('#scope').innerHTML = bits.length
      ? '<span class="a-label">Showing</span>' +
        bits.map(function (b) { return '<span class="a-chip">' + b + '</span>'; }).join('') +
        '<span class="a-pill">' + shown + ' shown</span>' +
        '<button class="a-btn is-sm is-secondary" id="clearScope">Clear</button>'
      : '<span class="a-label">Showing</span><span class="a-pill">All tools</span>';
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#clearScope')) return;
    state.kind = 'all'; state.domain = 'all'; state.tech = 'all'; state.q = ''; state.page = 0;
    search.value = '';
    renderNav(); renderTechFilter(); render();
  });

  var search = $('#search');
  search.addEventListener('input', function () {
    state.q = search.value.trim().toLowerCase(); state.page = 0; render();
  });
  /* "/" focuses the search field from anywhere on the page, same convention
     as most catalogue/search-first sites -- one more way the field reads as
     the thing you search with, not a stray input. Ignored while typing
     somewhere else that also wants the key (another input, a textarea). */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (document.activeElement || {}).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    search.focus();
  });

  /* ---------------------------------------------------------------- grid ---- */
  function match(p) {
    if (state.kind !== 'all' && p.kind !== state.kind) return false;
    if (state.domain !== 'all' && p.domain !== state.domain) return false;
    if (state.tech !== 'all' && (p.tech || []).indexOf(state.tech) === -1) return false;
    if (state.q) {
      var hay = [p.name, p.code, p.tagline, p.description, kindMeta(p.kind).label,
                 domainMeta(p.domain).label, (p.tech || []).map(logoLabel).join(' '), p.status]
                .join(' ').toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  /* Surya's rule: dashboards do not get their own pages -- except H10, which a
     client reads directly. Everything else resolves through the CMS. */
  var BESPOKE = { 'h10-dashboard': 'h10.html' };
  function href(p) { return BESPOKE[p.id] || ('tool.html?id=' + p.id); }

  function row(p, i) {
    var km = kindMeta(p.kind);
    var logos = (p.tech || []).slice(0, 4).map(function (t) { return logoImg(t, 16); }).join('');
    var n = String(i + 1).length < 2 ? '0' + (i + 1) : String(i + 1);
    return '<details class="trow rv" style="--kc:' + ACCENT[p.kind] + ';--d:' + Math.min(i * 26, 400) + 'ms">' +
      '<summary>' +
        '<span class="tr-i">' + n + '</span>' +
        '<span class="tr-logos">' + logos + '</span>' +
        '<span class="tr-name">' + p.name + '<em>' + p.tagline + '</em></span>' +
        '<span class="tr-kind">' + km.label + '</span>' +
        '<span class="tr-st st-' + p.status + '"><i></i>' + STATUS[p.status].label + '</span>' +
        '<span class="tr-chev" aria-hidden="true"></span>' +
      '</summary>' +
      '<div class="tr-body">' +
        '<p>' + (p.description || p.tagline) + '</p>' +
        '<a class="tr-go" href="' + href(p) + '">Open ' + p.name + ' &rarr;</a>' +
      '</div></details>';
  }

  /* Vertical category rail, reference 6. Counts come from the data, so a
     kind that gains a tool needs no edit here. */
  function renderRail() {
    var el = document.getElementById('exRail');
    if (!el) return;
    el.innerHTML = KINDS.map(function (k) {
      var n = k.id === 'all' ? PROJECTS.length : count(k.id);
      return '<button type="button" class="ex-tab' + (state.kind === k.id ? ' is-on' : '') + '"' +
        ' data-kind="' + k.id + '" style="--kc:' + (ACCENT[k.id] || 'var(--accent)') + '">' +
        '<span class="ex-ic">' + ICON(k.icon || 'grid') + '</span>' +
        '<span class="ex-l">' + k.label + '</span>' +
        '<span class="ex-n">' + n + '</span></button>';
    }).join('');
  }

  /* ------------------------------------------------------- tech filter (5b) --
     Small logo buttons for fast filtering by host software -- "click a Revit
     mark, see the Revit plugins". Built from the data, not a hand-typed list:
     counted across every tool's `tech` array, generic web-stack chips that
     every record carries (and so distinguish nothing) left out, sorted most
     common first, capped so the row stays scannable at a glance. */
  var TECH_EXCLUDE = { html: 1, css: 1, javascript: 1, typescript: 1 };
  var TECH_MAX = 9;
  function techCounts() {
    var counts = {};
    PROJECTS.forEach(function (p) {
      (p.tech || []).forEach(function (t) {
        if (TECH_EXCLUDE[t]) return;
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }
  function renderTechFilter() {
    var host = document.getElementById('techFilter');
    if (!host) return;
    var counts = techCounts();
    var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, TECH_MAX);
    host.innerHTML = keys.map(function (t) {
      var active = state.tech === t;
      return '<button type="button" class="techchip' + (active ? ' is-on' : '') + '"' +
        ' data-tech="' + t + '" aria-pressed="' + active + '"' +
        ' title="' + logoLabel(t) + ' — ' + counts[t] + ' tool' + (counts[t] === 1 ? '' : 's') + '">' +
        logoImg(t, 18) + '<span>' + logoLabel(t) + '</span></button>';
    }).join('');
  }
  document.getElementById('techFilter').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-tech]');
    if (!btn) return;
    var t = btn.dataset.tech;
    state.tech = state.tech === t ? 'all' : t;
    state.page = 0;
    renderTechFilter();
    renderAndReveal();
  });

  /* ------------------------------------------------------ the browser (5) ----
     One card shape, used for every tool: the preview, the name and category
     (the EvolveLab pattern the rest of the site already keeps to), one short
     line. No separate "featured six" any more and no long accordion of the
     rest of the catalogue underneath it -- everything in the current scope
     is paged six at a time (5c), so the same cards carry the whole browser
     instead of two different treatments competing for attention.

     Three-tier media (Surya's Fix 1, 2026-08-31): PREVIEW_MEDIA returns a
     video block, a still-image block, or '' -- never the old tinted icon
     panel. On '' the card gets the 'fcard--text' modifier and simply has no
     top-media element: no bleed margin to fight, no empty box to explain.
     .pgrid uses align-items:start (site-chrome.css) so a short text card
     sitting next to a tall media card in the same row does not get
     stretched to match it -- ragged row heights are the honest result of
     mixed content, not a bug. */
  var PAGE_SIZE = 6;
  function browseCard(p) {
    var f = (window.FEATURED || []).filter(function (x) { return x.id === p.id; })[0];
    var cat = (p.highlights && p.highlights.category) || (f && f.cat) || kindMeta(p.kind).label;
    /* A handful of tools carry a bespoke product mark (assets/visuals/marks/);
       everything else falls back to its kind glyph on the kind's own solid
       square, the same treatment the kind grid above uses. */
    var mark = (f && f.mark)
      ? '<img class="fc-mark" src="' + f.mark + '" alt="" width="44" height="44" loading="lazy" decoding="async">'
      : '<span class="fc-mark fc-mark--kind" style="--kc:' + ACCENT[p.kind] + '">' + KIND_ICON(p.kind) + '</span>';
    var media = window.PREVIEW_MEDIA ? PREVIEW_MEDIA(p.id, p.kind, 'pv-media--card') : '';
    var cardCls = 'fcard rv' + (media ? '' : ' fcard--text');
    return '<a class="' + cardCls + '" href="' + href(p) + '" style="--kc:' + ACCENT[p.kind] + '">' +
      media +
      '<div class="fc-top">' + mark +
        '<span class="fc-id"><b>' + p.name + '</b>' +
        '<span class="fc-cat">' + cat + '</span></span></div>' +
      '<p class="fc-line">' + cardLine(p) + '</p>' +
    '</a>';
  }

  /* Six at a time, arrows to page -- never the full list at once (item 5c).
     Returns the number of tools in the current scope so render() can drive
     the empty state and the pill off the same figure. */
  function renderPager() {
    var list = PROJECTS.filter(match);
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (state.page > pages - 1) state.page = pages - 1;
    if (state.page < 0) state.page = 0;
    var start = state.page * PAGE_SIZE;
    var items = list.slice(start, start + PAGE_SIZE);

    var gridEl = document.getElementById('pageGrid');
    if (gridEl) {
      gridEl.innerHTML = items.map(browseCard).join('');
      /* The pager itself is only ever on screen after a deliberate click on
         it, so its cards reveal immediately rather than waiting on the
         scroll-in observer below -- that observer needs a fresh intersection
         event to fire, which never happens for a page swap the visitor is
         already looking at (and won't happen at all in a background/inactive
         tab). Paging in a fade would just be a delay here, not a reveal. */
      gridEl.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
    }

    var prevBtn = document.getElementById('pagerPrev');
    var nextBtn = document.getElementById('pagerNext');
    if (prevBtn) prevBtn.disabled = state.page <= 0;
    if (nextBtn) nextBtn.disabled = state.page >= pages - 1;

    var pagerEl = document.getElementById('pager');
    if (pagerEl) pagerEl.style.display = total ? '' : 'none';

    var statusEl = document.getElementById('pagerStatus');
    if (statusEl) statusEl.textContent = total
      ? 'Set ' + (state.page + 1) + ' of ' + pages + ' — ' + total + ' tool' + (total === 1 ? '' : 's') + ' in this scope'
      : '';

    if (window.PREVIEW_INIT) PREVIEW_INIT();
    /* Paging replaces .pageGrid's contents with fresh .rv nodes that start
       at opacity 0 (js-reveal) -- the prev/next handlers call renderPager()
       directly, not render(), so without this they would never be observed
       and the new page would render permanently invisible. Already on
       screen when a visitor pages, so the observer fires straight away. */
    observe();
    return total;
  }
  document.getElementById('pagerPrev').addEventListener('click', function () {
    state.page--; renderPager();
  });
  document.getElementById('pagerNext').addEventListener('click', function () {
    state.page++; renderPager();
  });
  /* Keyboard accessible beyond plain tab+enter on the two buttons -- left and
     right arrow page the set while focus is anywhere inside the pager. */
  document.getElementById('pager').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); document.getElementById('pagerPrev').click(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); document.getElementById('pagerNext').click(); }
  });

  function render() {
    var shown = renderPager();
    var emptyEl = document.getElementById('empty');
    if (emptyEl) emptyEl.style.display = shown ? 'none' : 'block';
    renderScope(shown);
    /* Unfiltered, this said "52 in catalogue". The catalogue is still being filled --
       whole folders of tools are not in it yet -- so a total presented as the whole
       body of work understates it. While filtering, the count is a useful "how many
       matched", so it stays. */
    $('#pillCount').textContent = shown === PROJECTS.length
      ? 'Browse the catalogue'
      : shown + ' matching';
    observe();
  }
  /* Only a deliberate filter action moves the page. Typing in the search box
     must never yank it, which is what calling this from render() did. */
  function renderAndReveal() {
    render();
    document.getElementById('ecosystem').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------------------------------------------------------- reveal -- */
  /* Hidden state is opt-in: adding js-reveal proves a script is running, so
     a no-JS or stalled render still shows every section. */
  document.documentElement.classList.add('js-reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  function observe() { $$('.rv:not(.in)').forEach(function (el) { io.observe(el); }); }

  /* ---------------------------------------------------------------- boot ---- */
  renderNav();
  renderTechFilter();
  render();
  animateHours();

  /* Titleblock: the sheet's own record of what it is showing. "Growing" over
     a count for the same reason as the pill above -- the catalogue file is
     not the full body of work. "N measured" is the fact worth freezing here:
     the denominator that must not be presented as fixed. */
  $('#tbCount').textContent = 'Growing';
  $('#tbMeasured').textContent = measured.length + ' measured';
  $('#tbRev').textContent = new Date().toISOString().slice(0, 10);

  /* content is on screen; take the loader away */
  if(window.LOADER_DONE) window.LOADER_DONE();

})();
