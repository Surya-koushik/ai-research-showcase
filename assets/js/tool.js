/* ============================================================================
   tool.js — render one tool page in the signed-off template.
   ----------------------------------------------------------------------------
   The markup mirrors tool_template.html: a section rail on the left, the page
   in the middle, a facts rail on the right. All 52 tools now render in that
   frame rather than the older single-column layout.

   THE THING THIS HAS TO SURVIVE
   Only P01 carries the full set of fields. Most projects have a name, a
   tagline, an objective and a solution -- roughly forty words and no image.
   So every section is conditional, the rail lists only the sections that
   exist, and the efficiency panel has a written fallback for the 47 tools
   with no measured hours. The page has to look finished at the forty-word
   minimum, because that is the common case rather than the edge one.
   ========================================================================== */
(function () {
  'use strict';

  var id = new URLSearchParams(location.search).get('id');
  var p = (window.PROJECTS || []).find(function (x) { return x.id === id; });
  var host = document.getElementById('tp');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  if (!p) {
    host.innerHTML = '<main><div class="shell" style="padding:90px 0">' +
      '<h1>Not found</h1><p class="lede">No project with that id.</p>' +
      '<p style="margin-top:22px"><a class="side-link" href="index.html">&larr; All projects</a></p>' +
      '</div></main>';
    if (window.LOADER_DONE) window.LOADER_DONE();
    return;
  }

  var m = p.media || {};
  var pg = p.page || {};
  var km = kindMeta(p.kind);
  var dm = domainMeta(p.domain);

  /* ---- what this project actually has ---------------------------------- */
  var gallery  = m.gallery || [];
  var demos    = m.html || [];
  var docs     = m.docs || [];
  var videos   = m.videos || [];
  var isDeck   = p.kind === 'deck' && demos.length > 0;
  var hasGal   = !isDeck && (gallery.length || videos.length || docs.length || demos.length);
  var hasWork  = !!(pg.objective || pg.problem || pg.solution || p.description);
  var steps    = pg.howItWorks || [];
  var timeline = pg.timeline || [];
  var devLists = [
    ['Challenges', pg.challenges || []],
    ['Lessons learned', pg.lessons || []],
    ['What next', pg.roadmap || []]
  ].filter(function (x) { return x[1].length; });
  var hasDev = timeline.length || devLists.length;

  /* ---- left rail -------------------------------------------------------- */
  var SECTIONS = [['#top', 'Overview']];
  if (hasGal)  SECTIONS.push(['#gallery', 'Inside the tool']);
  if (hasWork) SECTIONS.push(['#overview', 'How it works']);
  if (hasDev)  SECTIONS.push(['#development', 'Development']);

  var sidebar =
    '<aside class="app-sidebar" aria-label="Project navigation">' +
      '<div class="side-brand"><img src="assets/logos/brand/asure_wordmark_white.png" alt="Asure">' +
        '<span>AI Research</span></div>' +
      '<div class="side-label">Tool page</div><nav>' +
        SECTIONS.map(function (s, i) {
          return '<a class="side-link' + (i ? '' : ' active') + '" href="' + s[0] + '">' + s[1] + '</a>';
        }).join('') +
      '</nav>' +
      '<div class="side-label">Catalogue</div><nav>' +
        '<a class="side-link" href="index.html">&larr; All projects</a>' +
        '<a class="side-link" href="cms.html">Media desk</a>' +
      '</nav>' +
      '<div class="side-bottom">Content type<strong>' +
        esc(km.label).toUpperCase() + ' &middot; ' + esc(dm.label).toUpperCase() + '</strong></div>' +
    '</aside>';

  /* ---- right rail ------------------------------------------------------- */
  var eff = p.efficiency, effPanel;
  if (eff && eff.manualHrsPerWeek != null && eff.aiHrsPerWeek != null) {
    var saved = Math.round((eff.manualHrsPerWeek - eff.aiHrsPerWeek) * 10) / 10;
    effPanel =
      '<div class="rail-kpi"><b>' + saved + ' h</b><span>saved per week</span></div>' +
      '<div class="time-shift">' +
        '<div class="time-box"><b>' + eff.manualHrsPerWeek + ' h</b><span>Before</span></div>' +
        '<div class="time-arrow">&rarr;</div>' +
        '<div class="time-box"><b>' + eff.aiHrsPerWeek + ' h</b><span>After</span></div>' +
      '</div>' +
      '<p class="rail-note">' + (eff.draft ? 'Recorded comparison, still being confirmed.'
                                           : 'Recorded before-and-after comparison.') + '</p>';
  } else {
    /* "Not measured" is the truth for 47 of 52. Inventing a number would not
       be, and the studio total is built on only the measured ones. */
    effPanel =
      '<div class="rail-kpi"><b>Not measured</b><span>no before-and-after recorded</span></div>' +
      '<p class="rail-note">This tool is in use, but the time it saves has not been measured, ' +
      'so it is left out of the studio total rather than estimated into it.</p>';
  }

  var counts = [];
  if (steps.length)    counts.push(['#overview', 'Steps in the flow', steps.length]);
  if (gallery.length)  counts.push(['#gallery', 'Screenshots', gallery.length]);
  if (demos.length)    counts.push(['#gallery', 'Live demos', demos.length]);
  if (docs.length)     counts.push(['#gallery', 'Documents', docs.length]);
  if (timeline.length) counts.push(['#development', 'Milestones', timeline.length]);

  var techLine = (p.tech || []).map(function (t) { return esc(logoLabel(t)); }).join(' &middot; ');

  var rail =
    '<aside class="insight-rail" aria-label="Project facts">' +
      '<div class="rail-logo">' + logoImg(p.logo, 26) +
        '<div><strong>' + esc(km.label) + '</strong><span>' +
        esc(p.workflowStage || dm.label) + '</span></div></div>' +
      '<div class="rail-section"><h3>Efficiency</h3>' + effPanel + '</div>' +
      (counts.length
        ? '<div class="rail-section"><h3>What is here</h3><div class="rail-nav">' +
            counts.map(function (c) {
              return '<a href="' + c[0] + '"><span>' + c[1] + '</span><b>' + c[2] + '</b></a>';
            }).join('') + '</div></div>'
        : '') +
      '<div class="rail-section"><h3>Status</h3>' +
        '<div class="rail-status"><i></i> ' + esc(STATUS[p.status].label) + '</div>' +
        '<p class="rail-note" style="margin-top:10px">' + esc(dm.label) +
          (techLine ? '<br>' + techLine : '') + '</p>' +
      '</div>' +
    '</aside>';

  /* ---- topbar ----------------------------------------------------------- */
  var topbar =
    '<header class="topbar"><div class="shell topbar-inner">' +
      '<a class="topbar-title" href="#top">' + esc(p.code) + ' &middot; ' + esc(p.name) + '</a>' +
      '<nav class="topnav" aria-label="Primary">' +
        SECTIONS.slice(1).map(function (s) {
          return '<a href="' + s[0] + '">' + s[1] + '</a>';
        }).join('') +
        '<a class="back" href="index.html"><span>&larr;</span> All tools</a>' +
      '</nav></div></header>';

  /* ---- hero ------------------------------------------------------------- */
  /* A deck leads with the deck. Prose about a presentation, placed in front of
     the presentation, helps nobody. */
  var panel;
  if (isDeck) {
    panel = '<div class="media-panel active deckpanel">' +
      '<iframe src="' + esc(demos[0]) + '" title="' + esc(p.name) + '" loading="lazy"></iframe>' +
      '<a class="deckopen" href="' + esc(demos[0]) + '" target="_blank" rel="noopener">Open full screen &rarr;</a>' +
      '</div>';
  } else if (m.hero) {
    panel = '<div class="media-panel active"><img src="' + esc(m.hero) + '" alt="' + esc(p.name) + '"' +
      ' onerror="this.style.display=\'none\';this.parentNode.classList.add(\'no-img\')"></div>';
  } else {
    panel = '<div class="media-panel active">' + PLACEHOLDER(p, { label: true }) + '</div>';
  }

  var parts = p.name.split(/\s+[—-]\s+/);
  var h1 = parts.length > 1
    ? esc(parts[0]) + ' <span>' + esc(parts.slice(1).join(' — ')) + '</span>'
    : esc(p.name);

  var hero =
    '<section class="media-hero" id="top" aria-label="Project introduction">' + panel +
      '<div class="shell hero-content"><div class="hero-copy">' +
        '<h1>' + h1 + '</h1>' +
        '<div class="hero-kicker">' +
          '<span class="status-dot"></span>' +
          '<span class="pill">' + esc(STATUS[p.status].label) + '</span>' +
          '<span class="pill">' + esc(km.label) + '</span>' +
          '<span class="pill">' + esc(p.code) + '</span>' +
          ((p.tech || []).length ? '<span class="revit-id">' + logoImg(p.tech[0], 18) + '</span>' : '') +
        '</div>' +
        '<p class="lede">' + esc(p.tagline) + '</p>' +
      '</div></div>' +
    '</section>';

  /* ---- gallery ---------------------------------------------------------- */
  var n = 0;
  function eyebrow() { n += 1; return (n < 10 ? '0' : '') + n; }

  var galleryHTML = '';
  if (hasGal) {
    var shots = gallery.map(function (g) {
      return '<figure class="shot" data-full="' + esc(g) + '"><img src="' + esc(g) + '" alt="" loading="lazy"></figure>';
    }).join('');
    var links = []
      .concat(demos.map(function (d) {
        return '<a class="pill linkpill" href="' + esc(d) + '" target="_blank" rel="noopener">Open live demo &rarr;</a>'; }))
      .concat(docs.map(function (d) {
        return '<a class="pill linkpill" href="' + esc(d.src) + '" target="_blank" rel="noopener">' + esc(d.title) + '</a>'; }))
      .join('');
    galleryHTML =
      '<section class="gallery" id="gallery"><div class="shell">' +
        '<div class="gallery-top reveal"><div>' +
          '<p class="eyebrow">' + eyebrow() + ' / Inside the tool</p>' +
          '<h2 class="section-title">What it looks like in use.</h2></div>' +
          (gallery.length ? '<div class="gallery-count">' + gallery.length + ' image' +
                            (gallery.length === 1 ? '' : 's') + '</div>' : '') +
        '</div>' +
        (shots ? '<div class="gallery-stage reveal" id="gallery-stage">' + shots + '</div>' : '') +
        (links ? '<div class="meta-row" style="margin-top:20px">' + links + '</div>' : '') +
      '</div></section>';
  }

  /* ---- how it works ----------------------------------------------------- */
  var workHTML = '';
  if (hasWork) {
    var blocks = [];
    if (pg.problem)    blocks.push(['The problem', pg.problem]);
    if (pg.solution)   blocks.push(['How it solves it', pg.solution]);
    if (p.description) blocks.push(['In more detail', p.description]);
    workHTML =
      '<section class="intro" id="overview"><div class="shell">' +
        '<div class="section-head reveal">' +
          '<p class="eyebrow">' + eyebrow() + ' / How it works</p>' +
          '<h2 class="section-title">' + esc(pg.objective || p.tagline) + '</h2>' +
        '</div>' +
        (blocks.length
          ? '<div class="prose-grid reveal">' + blocks.map(function (b) {
              return '<div class="prose-block"><h4>' + b[0] + '</h4><p>' + esc(b[1]) + '</p></div>';
            }).join('') + '</div>'
          : '') +
        (steps.length
          ? '<ol class="steps reveal">' + steps.map(function (s, i) {
              return '<li><span class="sn">' + (i + 1) + '</span><div><b>' + esc(s.title) + '</b>' +
                     (s.detail ? '<p>' + esc(s.detail) + '</p>' : '') + '</div></li>';
            }).join('') + '</ol>'
          : '') +
      '</div></section>';
  }

  /* ---- development ------------------------------------------------------ */
  var devHTML = '';
  if (hasDev) {
    devHTML =
      '<section class="development" id="development"><div class="shell">' +
        '<div class="section-head reveal">' +
          '<p class="eyebrow">' + eyebrow() + ' / Development</p>' +
          '<h2 class="section-title">How it was built.</h2></div>' +
        (timeline.length
          ? '<div class="timeline reveal">' + timeline.map(function (t) {
              return '<div class="milestone"><b>' + esc(t.date) + '</b><span>' + esc(t.label) + '</span></div>';
            }).join('') + '</div>'
          : '') +
        (devLists.length
          ? '<div class="prose-grid reveal" style="margin-top:30px">' + devLists.map(function (l) {
              return '<div class="prose-block"><h4>' + l[0] + '</h4><ul>' +
                     l[1].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
            }).join('') + '</div>'
          : '') +
      '</div></section>';
  }

  /* ---- related ---------------------------------------------------------- */
  var rel = (p.related || []).map(function (rid) {
    return (window.PROJECTS || []).find(function (x) { return x.id === rid; });
  }).filter(Boolean);
  var relHTML = rel.length
    ? '<section class="related" id="related"><div class="shell">' +
        '<div class="section-head reveal"><p class="eyebrow">' + eyebrow() + ' / Related</p>' +
        '<h2 class="section-title">Built alongside this.</h2></div>' +
        '<div class="rel-grid reveal">' + rel.map(function (r) {
          return '<a class="rel-card" href="tool.html?id=' + encodeURIComponent(r.id) + '">' +
            '<span class="pill">' + esc(kindMeta(r.kind).label) + '</span>' +
            '<b>' + esc(r.name) + '</b><p>' + esc(r.tagline) + '</p></a>';
        }).join('') + '</div></div></section>'
    : '';

  host.innerHTML = sidebar + rail + topbar +
    '<main>' + hero + galleryHTML + workHTML + devHTML + relHTML + '</main>';

  document.title = p.name + ' — AI Research & Innovation';

  /* ---- scroll spy -------------------------------------------------------- */
  var targets = [].slice.call(document.querySelectorAll('.side-link[href^="#"]'))
    .map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; })
    .filter(function (t) { return t.el; });

  function spy() {
    if (!targets.length) return;
    var line = window.innerHeight * 0.3, cur = targets[0];
    targets.forEach(function (t) { if (t.el.getBoundingClientRect().top <= line) cur = t; });
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4)
      cur = targets[targets.length - 1];
    targets.forEach(function (t) { t.a.classList.toggle('active', t === cur); });
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---- reveal ------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    [].forEach.call(document.querySelectorAll('.reveal'), function (el) { io.observe(el); });
  } else {
    [].forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('is-in'); });
  }

  /* ---- lightbox ---------------------------------------------------------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    document.addEventListener('click', function (e) {
      var shot = e.target.closest('.shot');
      if (shot) { document.getElementById('lbImg').src = shot.dataset.full; lb.classList.add('on'); return; }
      if (e.target.closest('#lbClose') || e.target === lb) lb.classList.remove('on');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lb.classList.remove('on');
    });
  }

  if (window.LOADER_DONE) window.LOADER_DONE();
})();
