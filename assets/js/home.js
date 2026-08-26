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

  /* ---------------------------------------------------------------- stats --- */
  var measured = PROJECTS.map(function (p) { return derive(p.efficiency); }).filter(Boolean);
  var savedTotal = Math.round(measured.reduce(function (a, d) { return a + d.saved; }, 0));
  var shipped = PROJECTS.filter(function (p) { return p.status === 'production'; }).length;
  var kindsUsed = Object.keys(PROJECTS.reduce(function (a, p) { a[p.kind] = 1; return a; }, {})).length;

  /* Plain statements. Each one says what was counted and nothing more --
     an investor should not have to decode a claim to reach a number. */
  var STATS = [
    { n: PROJECTS.length, icon: 'grid',  l: 'Tools built so far' },
    { n: shipped,         icon: 'check', l: 'In production' },
    { n: PROJECTS.length - shipped, icon: 'clock', l: 'In progress or research' },
    { n: savedTotal, u: 'hrs/wk', icon: 'gauge', l: 'Hours saved each week' }
  ];
  $('#stats').innerHTML = STATS.map(function (s, i) {
    return '<div class="stat rv" style="--d:' + (i * 90) + 'ms">' +
      '<div class="si">' + ICON(s.icon) + '</div>' +
      '<div class="n">' + s.n + (s.u ? '<span class="u">' + s.u + '</span>' : '') + '</div>' +
      '<div class="l">' + s.l + '</div>' +
      (s.src ? '<div class="src">' + s.src + '</div>' : '') + '</div>';
  }).join('');

  /* ---------------------------------------------------------------- kinds --- */
  function count(kind) {
    return PROJECTS.filter(function (p) { return p.kind === kind; }).length;
  }
  /* Simplified 2026-08-25: the per-kind diagram was visual noise beside eight
     cards. An icon chip carries the same signal at a fraction of the weight. */
  $('#kindGrid').innerHTML = KINDS.filter(function (k) { return k.id !== 'all'; }).map(function (k, i) {
    var n = count(k.id);
    return '<a class="kindcard rv" href="#ecosystem" data-jump="' + k.id + '"' +
      ' style="--kc:' + ACCENT[k.id] + ';--d:' + (i * 70) + 'ms">' +
      '<div class="ki">' + ICON(k.icon) + '</div>' +
      '<div class="kh"><h3>' + k.label + '</h3><span class="ct">' + n + '</span></div>' +
      '<p>' + k.blurb + '</p></a>';
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
      '<span>' + label + '</span><span class="n">' + n + '</span></a>';
  }

  function renderNav() {
    var kindsHTML = KINDS.map(function (k) {
      var n = k.id === 'all' ? PROJECTS.length : count(k.id);
      return navItem('kind', k.id, k.label, n, k.icon,
                     state.kind === k.id && state.domain === 'all');
    }).join('');
    /* Jump links first. Without them the only way to reach the tool types was
       to scroll past them to the grid and then filter, which is backwards. */
    var JUMPS = [
      ['#top',       'home',    'Home'],
      ['#numbers',   'chart',   'The count'],
      ['#kinds',     'layers',  'Kinds of tool'],
      ['#ecosystem', 'grid',    'All tools'],
      ['#roadmap',   'route',   'Roadmap']
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

  /* The active scope, stated once above the grid with a way out of it. */
  function renderScope(shown) {
    var bits = [];
    if (state.kind !== 'all')   bits.push(kindMeta(state.kind).label);
    if (state.domain !== 'all') bits.push(domainMeta(state.domain).label);
    if (state.q)                bits.push('“' + state.q + '”');
    $('#scope').innerHTML = bits.length
      ? '<span class="a-label">Showing</span>' +
        bits.map(function (b) { return '<span class="a-chip">' + b + '</span>'; }).join('') +
        '<span class="a-pill">' + shown + ' of ' + PROJECTS.length + '</span>' +
        '<button class="a-btn is-sm is-secondary" id="clearScope">Clear</button>'
      : '<span class="a-label">Showing</span><span class="a-pill">all ' + PROJECTS.length + '</span>';
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
    return '<a class="fcard rv" href="' + href(p) + '" style="--kc:' + ACCENT[p.kind] + '">' +
      '<div class="fc-top">' + mark +
        '<span class="fc-id"><b>' + p.name + '</b>' +
        '<span class="fc-cat">' + (f.cat || km.label) + '</span></span>' +
        '<span class="fc-logos">' + logos + '</span></div>' +
      '<dl class="fc-body">' +
        '<dt>The problem</dt><dd>' + f.why + '</dd>' +
        '<dt>What it does</dt><dd>' + f.what + '</dd>' +
        '<dt>What it changes</dt><dd>' + f.helps + '</dd>' +
      '</dl>' + hrs +
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
          return '<li><a href="' + href(p) + '"><b>' + p.name + '</b>' +
                 '<span>' + p.tagline + '</span></a></li>';
        }).join('') + '</ul></details>';
    }).join('');
  }

  function render() {
    var list = PROJECTS.filter(match);
    renderMarkStrip();
    renderFeatured();
    renderBuckets(list);
    var emptyEl = document.getElementById('empty');
    if (emptyEl) emptyEl.style.display = list.length ? 'none' : 'block';
    renderScope(list.length);
    $('#pillCount').textContent = list.length === PROJECTS.length
      ? PROJECTS.length + ' in catalogue'
      : list.length + ' of ' + PROJECTS.length;
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

  /* Titleblock: the sheet's own record of what it is showing. */
  $('#tbCount').textContent = PROJECTS.length + ' entries';
  $('#tbMeasured').textContent = measured.length + ' of ' + PROJECTS.length + ' measured';
  $('#tbRev').textContent = new Date().toISOString().slice(0, 10);

  /* content is on screen; take the loader away */
  if(window.LOADER_DONE) window.LOADER_DONE();

})();
