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
  document.getElementById('exRail').addEventListener('click', function (e) {
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
        '<a class="tr-go" href="tool.html?id=' + p.id + '">Open ' + p.name + ' &rarr;</a>' +
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

  function render() {
    var list = PROJECTS.filter(match);
    $('#grid').innerHTML = list.map(row).join('');
    renderRail();
    $('#empty').style.display = list.length ? 'none' : 'block';
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
