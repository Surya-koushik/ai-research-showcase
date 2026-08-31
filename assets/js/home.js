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

  /* Hours-saved counter: the number itself is set once here; home.js counts
     it up from 0 the first time it scrolls into view (see animateHours()
     below), or paints the final value immediately under reduced motion. */
  /* Kept short on purpose -- the "measured on N tools" methodology is stated
     once, in the "About these counts" note right under this card, not here
     too. Two cards saying the same sentence was exactly the repetition this
     whole section was rebuilt to remove. */
  var hoursEl = $('#hoursCounter');
  if (hoursEl) hoursEl.innerHTML =
    '<div class="hc-n" id="hcNum">0<span class="u">hrs/wk</span></div>' +
    '<div class="hc-l">Hours saved each week, across the studio.</div>';

  function animateHours() {
    var numEl = document.getElementById('hcNum');
    var hostEl = document.getElementById('hoursCounter');
    if (!numEl || !hostEl) return;
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function paint(v) { numEl.innerHTML = Math.round(v) + '<span class="u">hrs/wk</span>'; }
    if (reduced || !('IntersectionObserver' in window)) { paint(savedTotal); return; }
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        var start = null, dur = 900;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          paint(savedTotal * (1 - Math.pow(1 - p, 3)));     /* ease-out cubic */
          if (p < 1) requestAnimationFrame(step); else paint(savedTotal);
        }
        requestAnimationFrame(step);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    io2.observe(hostEl);
  }

  /* ---------------------------------------------------------------- kinds --- */
  function count(kind) {
    return PROJECTS.filter(function (p) { return p.kind === kind; }).length;
  }
  /* Logo grid: one glyph, the kind name, its count. No blurb paragraph here --
     that lived in the old #kinds section; a logo grid reads by icon, not by
     sentence. The full descriptions still live on KINDS[].blurb for anywhere
     else that wants them (e.g. the catalogue buckets further down). */
  $('#kindGrid').innerHTML = KINDS.filter(function (k) { return k.id !== 'all'; }).map(function (k, i) {
    var n = count(k.id);
    return '<a class="kindcard rv" href="#ecosystem" data-jump="' + k.id + '"' +
      ' style="--kc:' + ACCENT[k.id] + ';--d:' + (i * 60) + 'ms" title="' + k.blurb + '">' +
      '<div class="ki">' + KIND_ICON(k.id) + '</div>' +
      '<div class="kh"><h3>' + k.label + '</h3><span class="ct">' + n + '</span></div></a>';
  }).join('');

  /* The explorer rail filters in place. #exRail is stable -- only its
     innerHTML is replaced -- so one delegated listener is enough. */
  /* #exRail was removed in the exhibition pass; guard so this cannot throw. */
  var railEl = document.getElementById('exRail');
  if (railEl) railEl.addEventListener('click', function (e) {
    var tab = e.target.closest('[data-kind]');
    if (!tab) return;
    state.kind = tab.dataset.kind; state.domain = 'all';
    renderNav(); renderAndReveal();
  });

  /* Clicking a kind card scrolls to the grid with that filter applied. */
  $('#kindGrid').addEventListener('click', function (e) {
    var card = e.target.closest('[data-jump]');
    if (!card) return;
    state.kind = card.dataset.jump; state.domain = 'all';
    renderNav(); renderAndReveal();
  });

  /* ---------------------------------------------------------------- nav ----- */
  /* The kit's hierarchy puts scope in the sidebar registry, not in a wrapping
     row of chips above the grid (spec section 4). Two sections, one active. */
  var state = { kind: 'all', domain: 'all', q: '' };

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
    renderNav(); renderAndReveal();
  });

  /* The active scope, stated once above the grid with a way out of it.
     Never states the catalogue's total -- only the shown count, which is a
     live subset, not a claim about how big the whole thing is. */
  function renderScope(shown) {
    var bits = [];
    if (state.kind !== 'all')   bits.push(kindMeta(state.kind).label);
    if (state.domain !== 'all') bits.push(domainMeta(state.domain).label);
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
    state.kind = 'all'; state.domain = 'all'; state.q = ''; search.value = '';
    renderNav(); render();
  });

  var search = $('#search');
  search.addEventListener('input', function () {
    state.q = search.value.trim().toLowerCase(); render();
  });

  /* ---------------------------------------------------------------- grid ---- */
  function match(p) {
    if (state.kind !== 'all' && p.kind !== state.kind) return false;
    if (state.domain !== 'all' && p.domain !== state.domain) return false;
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

  /* Featured tools carry the story; everything else is bucketed by kind.
     Copy comes from window.FEATURED, which derives every line from the
     tool's own content record — see assets/js/featured.js. */
  function featuredCard(f) {
    var p = PROJECTS.filter(function (x) { return x.id === f.id; })[0];
    if (!p) return '';
    var km = kindMeta(p.kind);
    /* highlights.category (content/<id>.json) is the new source of truth for
       the category label; f.cat and km.label stay as fallbacks so a tool
       missing the block still renders exactly as before. */
    var cat = (p.highlights && p.highlights.category) || f.cat || km.label;
    var logos = (p.tech || []).slice(0, 4).map(function (t) { return logoImg(t, 15); }).join('');
    var hrs = f.hours
      ? '<p class="fc-hours"><b>' + f.hours.before + 'h</b> &rarr; <b>' + f.hours.after + 'h</b>' +
        ' a week' + (f.hours.draft ? ' <em>&middot; draft figure, still being confirmed</em>' : '') + '</p>'
      : '';
    /* One strong mark per tool, after the product-family strip Surya sent as
       reference (evolvelab.io). It replaces the six generated illustrations,
       which each carried three or four competing ideas at once; those files
       stay on disk, unreferenced, recorded in visuals/featured/SOURCES.md. */
    var mark = f.mark
      ? '<img class="fc-mark" src="' + f.mark + '" alt="" width="56" height="56" loading="lazy" decoding="async">'
      : '';
    /* Video preview, discovered by slug at runtime (assets/previews/<id>.*) --
       most tools have none yet, so PREVIEW_MEDIA always renders a deliberate
       kind-tinted fallback tile rather than an empty box. The long THE
       PROBLEM / WHAT IT DOES / WHAT IT CHANGES block moved to the tool page;
       the card keeps one line (cardLine) as Surya asked. */
    var media = window.PREVIEW_MEDIA ? PREVIEW_MEDIA(p.id, p.kind, 'pv-media--card') : '';
    return '<a class="fcard rv" href="' + href(p) + '" style="--kc:' + ACCENT[p.kind] + '">' +
      media +
      '<div class="fc-top">' + mark +
        '<span class="fc-id"><b>' + p.name + '</b>' +
        '<span class="fc-cat">' + cat + '</span></span>' +
        '<span class="fc-logos">' + logos + '</span></div>' +
      '<p class="fc-line">' + cardLine(p) + '</p>' + hrs +
      '<span class="fc-go">See ' + (f.short || p.name) + ' &rarr;</span></a>';
  }

  /* The product-family strip. Same six tools as the cards, same source array,
     so the strip and the cards cannot drift. One mark, one name, one category
     word each - the reference pattern, and nothing more per tile. */
  function renderMarkStrip() {
    var host = document.getElementById('markstrip');
    if (!host || !window.FEATURED) return;
    host.innerHTML = FEATURED.map(function (f) {
      var p = PROJECTS.filter(function (x) { return x.id === f.id; })[0];
      if (!p || !f.mark) return '';
      return '<a class="mk" href="' + href(p) + '">' +
        '<img src="' + f.mark + '" alt="" width="64" height="64" decoding="async">' +
        '<b>' + (f.short || p.name) + '</b>' +
        '<span>' + (f.cat || '') + '</span></a>';
    }).filter(Boolean).join('');
  }

  function renderFeatured() {
    var host = document.getElementById('featured');
    if (!host || !window.FEATURED) return;
    host.innerHTML = FEATURED.map(featuredCard).filter(Boolean).join('');
    if (window.PREVIEW_INIT) PREVIEW_INIT();
  }

  function renderBuckets(list) {
    var host = document.getElementById('buckets');
    if (!host) return;
    var featuredIds = (window.FEATURED || []).map(function (f) { return f.id; });
    var rest = list.filter(function (p) { return featuredIds.indexOf(p.id) === -1; });
    var open = !!state.q || state.kind !== 'all';
    host.innerHTML = KINDS.filter(function (k) { return k.id !== 'all'; }).map(function (k) {
      var items = rest.filter(function (p) { return p.kind === k.id; });
      if (!items.length) return '';
      return '<details class="bucket rv"' + (open ? ' open' : '') +
        ' style="--kc:' + ACCENT[k.id] + '">' +
        '<summary><span class="bk-ic">' + ICON(k.icon || 'grid') + '</span>' +
          '<span class="bk-l">' + k.label + '</span>' +
          '<span class="bk-b">' + k.blurb + '</span>' +
          '<span class="bk-n">' + items.length + '</span>' +
          '<span class="tr-chev" aria-hidden="true"></span></summary>' +
        '<ul class="bk-list">' + items.map(function (p) {
          var media = window.PREVIEW_MEDIA ? PREVIEW_MEDIA(p.id, p.kind, 'pv-media--row') : '';
          return '<li><a href="' + href(p) + '" style="--kc:' + ACCENT[p.kind] + '">' + media +
                 '<span class="bk-txt"><b>' + p.name + '</b>' +
                 '<span>' + p.tagline + '</span></span></a></li>';
        }).join('') + '</ul></details>';
    }).join('');
    if (window.PREVIEW_INIT) PREVIEW_INIT();
  }

  function render() {
    var list = PROJECTS.filter(match);
    renderMarkStrip();
    renderFeatured();
    renderBuckets(list);
    var emptyEl = document.getElementById('empty');
    if (emptyEl) emptyEl.style.display = list.length ? 'none' : 'block';
    renderScope(list.length);
    /* Unfiltered, this said "52 in catalogue". The catalogue is still being filled --
       whole folders of tools are not in it yet -- so a total presented as the whole
       body of work understates it. While filtering, the count is a useful "how many
       matched", so it stays. */
    $('#pillCount').textContent = list.length === PROJECTS.length
      ? 'Browse the catalogue'
      : list.length + ' matching';
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
