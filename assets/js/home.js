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
    study:     'var(--text-3)',
    deck:      'var(--rose-400)'
  };

  /* ---------------------------------------------------------------- chrome -- */
  var themeBtn = $('#themeBtn');
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(STORE_KEY, t);
    themeBtn.innerHTML = ICON(t === 'dark' ? 'sun' : 'moon');
    if (window.__heroReload) window.__heroReload();
  }
  /* This design was drawn dark-first. A preference stored before the redesign
     should not silently open it in the weaker of the two themes. */
  var STORE_KEY = 'ads_theme_v2';
  setTheme(localStorage.getItem(STORE_KEY) || 'dark');
  themeBtn.onclick = function () {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  };
  $('#searchIc').innerHTML = ICON('search');
  $('#yr').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------- stats --- */
  var measured = PROJECTS.map(function (p) { return derive(p.efficiency); }).filter(Boolean);
  var savedTotal = Math.round(measured.reduce(function (a, d) { return a + d.saved; }, 0));
  var shipped = PROJECTS.filter(function (p) { return p.status === 'production'; }).length;
  var kindsUsed = Object.keys(PROJECTS.reduce(function (a, p) { a[p.kind] = 1; return a; }, {})).length;

  var STATS = [
    { n: PROJECTS.length, l: 'tools, dashboards, connectors and decks built inside the studio',
      src: 'counted from the catalogue' },
    { n: shipped, l: 'in production — running against real project work, not demos',
      src: 'status field, per tool' },
    { n: savedTotal, u: 'hrs/wk', l: 'given back where the saving has actually been measured',
      src: measured.length + ' of ' + PROJECTS.length + ' measured · rest unmeasured' },
    { n: kindsUsed, l: 'distinct kinds of thing, each defined so the label means something',
      src: 'one axis, answered once per tool' }
  ];
  $('#stats').innerHTML = STATS.map(function (s) {
    return '<div class="stat rv"><div class="n">' + s.n +
      (s.u ? '<span class="u">' + s.u + '</span>' : '') + '</div>' +
      '<div class="l">' + s.l + '</div>' +
      '<div class="src">' + s.src + '</div></div>';
  }).join('');

  /* ---------------------------------------------------------------- system -- */
  $('#systemArt').innerHTML = '<div class="dgm-wide">' + DIAGRAM('system') + '</div>';

  /* ---------------------------------------------------------------- kinds --- */
  function count(kind) {
    return PROJECTS.filter(function (p) { return p.kind === kind; }).length;
  }
  $('#kindGrid').innerHTML = KINDS.filter(function (k) { return k.id !== 'all'; }).map(function (k) {
    var n = count(k.id);
    return '<a class="kindcard rv" href="#ecosystem" data-jump="' + k.id + '" style="--kc:' + ACCENT[k.id] + '">' +
      '<div class="kh"><h3>' + k.label + '</h3>' +
      '<span class="ct">' + n + '</span></div>' +
      '<p>' + k.blurb + '</p>' +
      '<div class="art">' + DIAGRAM(k.id) + '</div></a>';
  }).join('');

  /* Clicking a kind card scrolls to the grid with that filter applied. */
  $('#kindGrid').addEventListener('click', function (e) {
    var card = e.target.closest('[data-jump]');
    if (!card) return;
    state.kind = card.dataset.jump; state.domain = 'all';
    renderFilters(); renderAndReveal();
  });

  /* ---------------------------------------------------------------- filters - */
  var state = { kind: 'all', domain: 'all', q: '' };

  function renderFilters() {
    $('#kindFilter').innerHTML = KINDS.map(function (k) {
      var n = k.id === 'all' ? PROJECTS.length : count(k.id);
      return '<button class="fchip' + (state.kind === k.id && state.domain === 'all' ? ' on' : '') +
        '" data-axis="kind" data-id="' + k.id + '" title="' + (k.blurb || '') + '">' +
        k.label + '<span class="n">' + n + '</span></button>';
    }).join('');
    $('#domainFilter').innerHTML =
      '<span style="font-family:var(--f-mono);font-size:10px;letter-spacing:.16em;' +
      'text-transform:uppercase;color:var(--muted);margin-right:4px">By work</span>' +
      DOMAINS.map(function (d) {
        var n = PROJECTS.filter(function (p) { return p.domain === d.id; }).length;
        return '<button class="fchip' + (state.domain === d.id ? ' on' : '') +
          '" data-axis="domain" data-id="' + d.id + '">' +
          d.label + '<span class="n">' + n + '</span></button>';
      }).join('');
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.fchip');
    if (!chip) return;
    if (chip.dataset.axis === 'kind') { state.kind = chip.dataset.id; state.domain = 'all'; }
    else { state.domain = state.domain === chip.dataset.id ? 'all' : chip.dataset.id; state.kind = 'all'; }
    renderFilters(); render();   /* chips sit beside the grid; no scroll needed */
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

  function card(p) {
    var ph = PLACEHOLDER(p, { code: true, mark: true });
    var shot = (p.media && p.media.hero)
      ? '<img src="' + p.media.hero + '" alt="" loading="lazy" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'">' +
        PLACEHOLDER(p, { code: true, mark: true, hidden: true })
      : ph;
    return '<a class="tcard rv" href="tool.html?id=' + p.id + '" style="--kc:' + ACCENT[p.kind] + '">' +
      '<div class="shot">' + shot + '</div>' +
      '<div class="meta">' +
        '<div class="row1"><span class="code">' + p.code + '</span>' +
        '<span class="kind">' + kindMeta(p.kind).label + '</span></div>' +
        '<h3>' + p.name + '</h3><p>' + p.tagline + '</p>' +
        '<div class="foot"><span>' + STATUS[p.status].label + '</span>' +
        '<span class="dom">' + domainMeta(p.domain).label + '</span></div>' +
      '</div></a>';
  }

  function render() {
    var list = PROJECTS.filter(match);
    $('#grid').innerHTML = list.map(card).join('');
    $('#empty').style.display = list.length ? 'none' : 'block';
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
  renderFilters();
  $('#grid').innerHTML = PROJECTS.map(card).join('');
  observe();
})();
