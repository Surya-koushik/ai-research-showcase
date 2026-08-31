/* ============================================================================
   tool.js — render one tool page in the site's own components.
   ----------------------------------------------------------------------------
   THE CHANGE (2026-08-26)
   tool_template.html was rebuilt on the design system that index.html uses.
   This file still emitted the layout that rebuild replaced: .app-sidebar,
   .insight-rail, .media-hero, .gallery-stage, .intro-grid, .timeline — a
   three-column frame with its own vocabulary, none of which appears anywhere
   else on the site. It now emits the template's shapes instead, so a tool page
   and the landing page are made of the same parts:

     hero          .band.tall > .tpl-hero    (was .media-hero)
     the facts     .statrow > .stat          (was .insight-rail)
     gallery       .tp-gallery / .tp-stage   (was .gallery-stage / .thumbs)
     how it works  .tp-how + .tp-meta        (was .intro-grid)
     development   ol.spine > li.spine-step  (was .timeline > .milestone)

   The page shell (.a-sidebar, .a-topbar, .a-main > .a-view > .a-content) is
   real markup in tool.html now rather than an innerHTML string, so it paints
   before this file runs. This file fills #nav and #tp.

   THE THING THIS HAS TO SURVIVE
   Only P01 carries the full set of fields. Most projects have a name, a
   tagline, an objective and a solution — roughly forty words and no image. So
   every section is conditional, the nav lists only the sections that exist,
   and the hours block has a written fallback for the 47 tools with no measured
   before-and-after. The page has to look finished at the forty-word minimum,
   because that is the common case rather than the edge one.
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
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* ---- drawer ------------------------------------------------------------
     Same behaviour as index.html, and it is wired before the early return so
     a bad ?id still gets a working menu. */
  (function () {
    var toggle = document.getElementById('navToggle'),
        scrim  = document.getElementById('navScrim'),
        close  = document.getElementById('navClose'),
        side   = document.getElementById('sidebar');
    if (!toggle || !side) return;
    if (scrim) scrim.hidden = false;   /* ships hidden so it cannot flash */
    function setNav(open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      side.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    toggle.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });
    if (scrim) scrim.addEventListener('click', function () { setNav(false); });
    if (close) close.addEventListener('click', function () { setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    side.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  })();

  if (!p) {
    host.innerHTML =
      '<section class="band tall" id="top"><div class="bg-grid"></div>' +
        '<div class="tpl-hero" style="max-width:1100px">' +
          '<div class="eyebrow-rule">Not found</div>' +
          '<h1 class="d1">No tool<br><span class="g-primary">with that id</span></h1>' +
          '<p class="lede">The catalogue has no entry for <code>' + esc(id) + '</code>.</p>' +
          '<div class="hero-actions">' +
            '<a class="btn primary hero-cta" href="index.html#ecosystem">All work</a>' +
          '</div>' +
        '</div></section>';
    document.documentElement.classList.add('js-reveal');
    if (window.LOADER_DONE) window.LOADER_DONE();
    return;
  }

  var m  = p.media || {};
  var pg = p.page || {};
  var hl = p.highlights || null;
  var km = kindMeta(p.kind);
  var dm = domainMeta(p.domain);

  /* Captions are not in the catalogue, so they come from the filename. A file
     called 03-batch-report.jpg reads better than "screenshot 3"; a bare 03.jpg
     falls back to the position. */
  function shotLabel(path, i, total) {
    var stem = path.split('/').pop().replace(/\.[a-z0-9]+$/i, '');
    var words = stem.replace(/^[0-9]+[-_]?/, '').replace(/[-_]+/g, ' ').trim();
    if (!words) return 'Step ' + (i + 1) + ' of ' + total;
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  /* ---- what this project actually has ---------------------------------- */
  var gallery  = m.gallery || [];
  var demos    = m.html || [];
  var docs     = m.docs || [];
  var videos   = m.videos || [];

  /* A live demo IS the thing to look at, so it becomes the gallery stage
     rather than a link underneath one — a deck most obviously, but a
     dashboard runs in a frame just as well. Only the wording differs. */
  var hasEmbed = demos.length > 0;
  var isDeck   = p.kind === 'deck' && hasEmbed;

  /* The template hero carries no picture, so hero.jpg — a real, separate file
     from the numbered walkthrough — would otherwise stop appearing on the site
     at all. It opens the gallery as the cover frame instead. Its filename gives
     no caption, so it is captioned with the record's own name rather than the
     stem ("Hero") or a step number it is not. */
  var shots = gallery.slice();
  var media = videos.map(function (v) {
    return { type: 'video', src: v, label: 'Watch the workflow.' };
  });
  if (m.hero && shots.indexOf(m.hero) === -1) {
    media.push({ type: 'image', src: m.hero, label: p.name });
  }
  shots.forEach(function (s, i) {
    media.push({ type: 'image', src: s, label: shotLabel(s, i, shots.length) });
  });
  if (hasEmbed) {
    media.unshift({ type: 'embed', src: demos[0],
      label: isDeck ? 'The deck, running here.' : 'The live version, running here.' });
  }

  /* The section exists if there is anything to put in it; the carousel itself
     only if there is something to put ON the stage. A record carrying nothing
     but attached documents still gets a section rather than losing them. */
  var hasStage = media.length > 0;
  var hasGal   = hasStage || docs.length > 0;
  var hasWork  = !!(pg.objective || pg.problem || pg.solution || p.description);
  var steps    = pg.howItWorks || [];
  var timeline = pg.timeline || [];
  var devLists = [
    ['Challenges', pg.challenges || []],
    ['Lessons learned', pg.lessons || []],
    ['What next', pg.roadmap || []]
  ].filter(function (x) { return x[1].length; });
  var hasDev = timeline.length || devLists.length;

  var eff = p.efficiency;
  var measured = !!(eff && eff.manualHrsPerWeek != null && eff.aiHrsPerWeek != null);

  /* Where the "not measured" sentence lands when there is no #effect section
     to carry it: the first band below that exists, and its own band if none do. */
  var noteHome = measured ? null : (hasWork ? 'how' : hasDev ? 'development' : 'own');

  /* A deck on the stage is boxed into a 16:9 frame, so the link to open it
     properly has to survive — it is the old .deckopen affordance, moved under
     the gallery with the rest of the links. */
  var demoLinks = demos.map(function (d, i) {
    return [d, i === 0 ? 'Open full screen &rarr;' : 'Open live demo &rarr;'];
  });

  /* ---- navigation ------------------------------------------------------- */
  var SECTIONS = [['#top', 'Overview']];
  if (measured || noteHome === 'own') SECTIONS.push(['#effect', 'What it changes']);
  if (hasGal)  SECTIONS.push(['#inside', 'Inside the tool']);
  if (hasWork) SECTIONS.push(['#how', 'How it works']);
  if (hasDev)  SECTIONS.push(['#development', 'Development']);

  var nav = document.getElementById('nav');
  if (nav) {
    nav.innerHTML = SECTIONS.map(function (s, i) {
      return '<a class="a-nav-item' + (i ? '' : ' is-active') + '" href="' + s[0] + '">' +
             esc(s[1]) + '</a>';
    }).join('') +
      '<a class="a-nav-item" href="index.html#ecosystem">&larr; All work</a>' +
      '<a class="a-nav-item" href="cms.html">Media desk</a>';
  }

  /* Topbar carries the same sections, inserted before the back link so the bar
     never offers a section this tool does not have. */
  var back = document.getElementById('backLink');
  if (back && back.parentNode) {
    SECTIONS.slice(1).forEach(function (s) {
      var a = document.createElement('a');
      a.className = 'nl opt';
      a.href = s[0];
      a.innerHTML = esc(s[1]).replace(/ /g, '&nbsp;');
      back.parentNode.insertBefore(a, back);
    });
  }

  /* ---- SVG marks for the stat cards -------------------------------------
     The same four marks the template uses, kept as small inline symbols so a
     stat is scannable without reading it. */
  var SVG = {
    clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check:  '<path d="M20 6L9 17l-5-5"/>',
    list:   '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10h8M8 14h5"/>',
    shield: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/>',
    image:  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/>',
    play:   '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
    flag:   '<path d="M5 21V4h13l-3 4 3 4H5"/>'
  };
  function statCard(icon, n, unit, label, i) {
    return '<div class="stat rv" style="--d:' + (i * 90) + 'ms">' +
      '<div class="si" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2">' + SVG[icon] + '</svg></div>' +
      '<div class="n">' + n + (unit ? '<span class="u">' + unit + '</span>' : '') + '</div>' +
      '<div class="l">' + label + '</div></div>';
  }

  /* ---- what it changes ---------------------------------------------------
     These are the facts the old right-hand rail carried. On the landing page
     the same facts are stat cards, so they are stat cards here too.

     The section exists only where a before-and-after was actually timed —
     5 tools of 52. For the other 47 a lone "Not measured" card would give a
     non-fact the visual weight of a headline number, and screenshot counts
     are inventory, not change. Those pages carry the same sentence as a note
     further down instead, so nothing is quietly dropped. */
  var measureNote = measured
    ? (eff.draft
        ? 'Recorded on this tool, timed before and after. Still being confirmed, so treat it as a draft figure.'
        : 'Recorded on this tool, timed before and after.')
    : 'This tool is in use, but the time it saves has not been measured, so it is left out ' +
      'of the studio total rather than estimated into it.';

  var noteBlock =
    '<div class="a-note rv" style="margin-top:36px;max-width:66ch">' +
      '<span class="lb">' + (measured ? 'About these figures' : 'About the hours') + '</span>' +
      measureNote + '</div>';

  var effectHTML = '';
  if (measured) {
    var saved = Math.round((eff.manualHrsPerWeek - eff.aiHrsPerWeek) * 10) / 10;
    /* "Saved" is a subtraction of two hand-timed figures, not a measurement
       in its own right -- while the underlying figure is draft:true, the
       card has to say "estimated" itself rather than leaving that to the
       note further down. Surya's call: soften in the sentence, don't cut. */
    var savedLabel = eff.draft ? 'Saved per week, estimated' : 'Saved per week';
    var savedN = eff.draft ? '~' + saved : saved;
    var cards = [], ci = 0;
    cards.push(statCard('clock', savedN, 'h/wk', savedLabel, ci++));
    cards.push(statCard('check', eff.manualHrsPerWeek + 'h &rarr; ' + eff.aiHrsPerWeek + 'h',
                        '', 'Before, then after', ci++));
    if (steps.length)    cards.push(statCard('list', steps.length, '', 'Steps in the flow', ci++));
    if (timeline.length) cards.push(statCard('flag', timeline.length, '', 'Milestones', ci++));

    effectHTML =
      '<section class="band uikit" id="effect">' +
        '<h2 class="d2 rv" style="max-width:18ch">What it changes.</h2>' +
        '<div class="statrow">' + cards.join('') + '</div>' +
        noteBlock +
      '</section>';
  }

  /* ---- hero -------------------------------------------------------------- */
  var parts = p.name.split(/\s+[—-]\s+/);
  var h1 = parts.length > 1
    ? esc(parts[0]) + '<br><span class="g-primary">' + esc(parts.slice(1).join(' — ')) + '</span>'
    : esc(p.name);

  var techTags = (p.tech || []).slice(0, 3).map(function (t) {
    return '<span class="tp-tag">' + logoImg(t, 14) + esc(logoLabel(t)) + '</span>';
  }).join('');

  var cta = isDeck ? ['#inside', 'Open the deck']
          : hasGal ? ['#inside', 'See it running']
          : hasWork ? ['#how', 'How it works']
          : ['#effect', 'What it changes'];

  var heroHTML =
    '<section class="band tall" id="top">' +
      '<div class="bg-grid"></div>' +
      '<div class="tpl-hero" style="max-width:1100px">' +
        '<div class="eyebrow-rule">' + esc(p.code) + ' &middot; ' + esc(km.label) +
          ' &middot; ' + esc(dm.label) + '</div>' +
        '<h1 class="d1">' + h1 + '</h1>' +
        '<p class="lede" style="max-width:54ch">' + esc(p.tagline) + '</p>' +
        '<div class="tp-tags">' +
          '<span class="tp-status"><i></i>' + esc(STATUS[p.status].label) + '</span>' +
          (p.workflowStage ? '<span class="tp-tag">' + esc(p.workflowStage) + '</span>' : '') +
          techTags +
        '</div>' +
        '<div class="hero-actions">' +
          '<a class="btn primary hero-cta" href="' + cta[0] + '">' + cta[1] + '</a>' +
          '<a class="btn hero-cta" href="index.html#ecosystem">All work</a>' +
        '</div>' +
      '</div>' +
    '</section>';

  /* ---- inside the tool ---------------------------------------------------
     One large frame, arrows, a caption and a thumbnail strip — not a grid of
     equal tiles. A grid gives every screenshot the same weight when the point
     is to walk someone through the tool in order. */
  var insideHTML = '';
  if (hasGal) {
    var multi = media.length > 1;
    var links = demoLinks.map(function (d) {
        return '<a class="btn' + (hasEmbed ? ' primary' : '') + ' hero-cta" href="' + esc(d[0]) +
               '" target="_blank" rel="noopener">' + d[1] + '</a>';
      }).concat(docs.map(function (d) {
        return '<a class="btn hero-cta" href="' + esc(d.src) + '" target="_blank" rel="noopener">' +
               esc(d.title) + '</a>';
      })).join('');

    /* A deck is not software running, so it does not get that sentence. */
    var galleryLede = isDeck
      ? 'The deck itself, running here.'
      : hasEmbed
        ? 'The live version, running here.'
        : 'What it looks like in use, in the software it actually runs in.';

    insideHTML =
      '<section class="band uikit" id="inside">' +
        '<div class="rmap-head rv" style="margin-top:0">' +
          '<h3 class="rmap-title">Inside the tool.</h3>' +
          '<p class="lede" style="max-width:56ch">' + galleryLede + '</p>' +
        '</div>' +
        (hasStage ?
        '<figure class="tp-gallery rv">' +
          '<div class="tp-stage">' +
            (multi ? '<button class="tp-arrow prev" type="button" aria-label="Previous image">&lsaquo;</button>' : '') +
            '<iframe id="galleryEmbed" title="' + esc(p.name) + '" loading="lazy" hidden></iframe>' +
            '<video id="galleryVideo" muted loop playsinline hidden></video>' +
            '<img id="galleryMain" src="" alt="">' +
            (multi ? '<button class="tp-arrow next" type="button" aria-label="Next image">&rsaquo;</button>' : '') +
          '</div>' +
          '<figcaption class="tp-caption">' +
            '<span id="galleryLabel">&nbsp;</span>' +
            '<span class="tp-count"><b id="galleryIndex">01</b> / <span id="galleryTotal">01</span></span>' +
          '</figcaption>' +
          '<div class="tp-thumbs" id="galleryThumbs" aria-label="Choose an image"></div>' +
        '</figure>' : '') +
        (links ? '<div class="hero-actions">' + links + '</div>' : '') +
      '</section>';
  }

  /* ---- how it works ------------------------------------------------------ */
  var howHTML = '';
  if (hasWork) {
    var copy = pg.solution || p.description || pg.objective || p.tagline;

    var facts = [];
    if (p.tech && p.tech.length)
      facts.push(['Built with', p.tech.map(function (t) { return esc(logoLabel(t)); }).join(' · ')]);
    facts.push(['Serves', esc(dm.label)]);
    if (p.workflowStage) facts.push(['Stage', esc(p.workflowStage)]);
    facts.push(['Status', esc(STATUS[p.status].label)]);
    if (m.docs && m.docs.length) facts.push(['Documents', m.docs.length + ' attached']);

    var notes = [];
    if (pg.problem) notes.push(['The problem', pg.problem]);
    if (p.description && p.description !== copy) notes.push(['In more detail', p.description]);

    howHTML =
      '<section class="band uikit" id="how">' +
        '<div class="rmap-head rv" style="margin-top:0">' +
          '<h3 class="rmap-title">What it does.</h3>' +
          (pg.objective
            ? '<p class="lede" style="max-width:56ch">' + esc(pg.objective) + '</p>' : '') +
        '</div>' +
        '<div class="tp-how rv">' +
          '<p class="tp-how-lede">' + esc(copy) + '</p>' +
          '<dl class="tp-meta">' + facts.map(function (f) {
            return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>';
          }).join('') + '</dl>' +
        '</div>' +
        /* Steps are a sequence, so they take the same spine the roadmap uses
           rather than a bespoke ordered list. */
        (steps.length
          ? '<ol class="spine" style="margin-top:clamp(30px,4vw,52px)">' + steps.map(function (st, i) {
              return '<li class="spine-step rv" style="--d:' + (i * 90) + 'ms">' +
                '<div class="ss-mark"><span class="ss-q">' + pad(i + 1) + '</span></div>' +
                '<div class="ss-body"><h4>' + esc(st.title) + '</h4>' +
                (st.detail ? '<p>' + esc(st.detail) + '</p>' : '') + '</div></li>';
            }).join('') + '</ol>'
          : '') +
        notes.map(function (nte) {
          return '<div class="a-note rv" style="margin-top:30px;max-width:68ch">' +
                 '<span class="lb">' + nte[0] + '</span>' + esc(nte[1]) + '</div>';
        }).join('') +
        /* highlights (content/<id>.json) — same labelled-note shape as the
           problem/detail notes above, so a tool without the block renders
           exactly as it did before this existed. */
        (hl
          ? '<div class="a-note rv" style="margin-top:30px;max-width:68ch">' +
              '<span class="lb">Highlights</span>' + esc(hl.headline) +
              (hl.points && hl.points.length
                ? '<ul>' + hl.points.map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join('') + '</ul>'
                : '') +
            '</div>'
          : '') +
        (noteHome === 'how' ? noteBlock : '') +
      '</section>';
  }

  /* ---- development ------------------------------------------------------- */
  var devHTML = '';
  if (hasDev) {
    devHTML =
      '<section class="band uikit" id="development">' +
        '<div class="rmap-head rv" style="margin-top:0">' +
          '<h3 class="rmap-title">How it was built.</h3>' +
        '</div>' +
        (timeline.length
          ? '<ol class="spine">' + timeline.map(function (t, i) {
              return '<li class="spine-step rv" style="--d:' + (i * 90) + 'ms">' +
                '<div class="ss-mark"><span class="ss-q">' + pad(i + 1) + '</span>' +
                  '<span class="ss-win">' + esc(t.date) + '</span></div>' +
                '<div class="ss-body"><h4>' + esc(t.label) + '</h4></div></li>';
            }).join('') + '</ol>'
          : '') +
        devLists.map(function (l) {
          return '<div class="a-note rv" style="margin-top:30px;max-width:68ch">' +
            '<span class="lb">' + l[0] + '</span><ul>' +
            l[1].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
            '</ul></div>';
        }).join('') +
        (noteHome === 'development' ? noteBlock : '') +
      '</section>';
  }

  /* A record with no prose and no milestones still has to say the hours were
     never measured, so in that one case the note gets a band of its own. */
  if (noteHome === 'own') {
    devHTML += '<section class="band uikit" id="effect">' +
      '<div class="rmap-head rv" style="margin-top:0">' +
        '<h3 class="rmap-title">What it changes.</h3></div>' + noteBlock + '</section>';
  }

  /* ---- related ----------------------------------------------------------- */
  var rel = (p.related || []).map(function (rid) {
    return (window.PROJECTS || []).find(function (x) { return x.id === rid; });
  }).filter(Boolean);

  var relHTML = rel.length
    ? '<section class="band uikit" id="related">' +
        '<div class="rmap-head rv" style="margin-top:0">' +
          '<h3 class="rmap-title">Built alongside this.</h3></div>' +
        '<div class="feat">' + rel.map(function (r, i) {
          var rk = kindMeta(r.kind);
          return '<a class="fcard rv" style="--d:' + (i * 90) + 'ms" href="tool.html?id=' +
            encodeURIComponent(r.id) + '">' +
            '<div class="fc-top"><span class="fc-kind">' + esc(rk.label) + '</span>' +
              '<span class="fc-logos">' + logoImg(r.logo, 15) + '</span></div>' +
            '<h4>' + esc(r.name) + '</h4>' +
            '<dl class="fc-body"><dt>What it does</dt><dd>' + esc(r.tagline) + '</dd></dl>' +
            '<span class="fc-go">See ' + esc(r.name) + ' &rarr;</span></a>';
        }).join('') + '</div>' +
      '</section>'
    : '';

  host.innerHTML = heroHTML + effectHTML + insideHTML + howHTML + devHTML + relHTML;
  document.title = p.name + ' — AI Research & Innovation';

  /* ---- gallery ------------------------------------------------------------
     Ported from the template: one array of mixed media, one show(), and the
     inactive <video>/<iframe> carry [hidden] so the stage never keeps two
     full-height children. */
  if (hasStage) (function () {
    var main   = document.getElementById('galleryMain'),
        vid    = document.getElementById('galleryVideo'),
        frame  = document.getElementById('galleryEmbed'),
        label  = document.getElementById('galleryLabel'),
        idxEl  = document.getElementById('galleryIndex'),
        totEl  = document.getElementById('galleryTotal'),
        thumbs = document.getElementById('galleryThumbs'),
        at = 0;

    function renderThumbs() {
      thumbs.replaceChildren();
      if (media.length < 2) { totEl.textContent = pad(media.length); return; }
      media.forEach(function (mm, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', mm.label);
        if (mm.type === 'image') {
          var im = document.createElement('img');
          im.src = mm.src; im.alt = ''; im.loading = 'lazy';
          b.append(im);
        } else {
          b.textContent = mm.type === 'video' ? '▶' : '⌗';
        }
        b.addEventListener('click', function () { show(i); });
        thumbs.append(b);
      });
      totEl.textContent = pad(media.length);
    }

    function show(i) {
      if (!media.length) return;
      at = (i + media.length) % media.length;
      var mm = media[at];
      var isVid = mm.type === 'video', isEmbed = mm.type === 'embed';
      vid.hidden = !isVid;
      frame.hidden = !isEmbed;
      main.hidden = isVid || isEmbed;
      if (isVid) { if (!vid.src) vid.src = mm.src; vid.play().catch(function () {}); }
      else { vid.pause(); }
      if (isEmbed) { if (!frame.src) frame.src = mm.src; }
      if (!isVid && !isEmbed) { main.src = mm.src; main.alt = mm.label; }
      label.textContent = mm.label;
      idxEl.textContent = pad(at + 1);
      Array.prototype.forEach.call(thumbs.children, function (t, n) {
        t.setAttribute('aria-current', n === at ? 'true' : 'false');
      });
    }

    /* A screenshot that 404s drops out rather than shipping a broken frame. */
    main.addEventListener('error', function () {
      if (!media.length || media[at].type !== 'image') return;
      media.splice(at, 1);
      if (!media.length) { document.getElementById('inside').hidden = true; return; }
      renderThumbs(); show(0);
    });

    var prev = document.querySelector('.tp-arrow.prev'),
        next = document.querySelector('.tp-arrow.next');
    if (prev) prev.addEventListener('click', function () { show(at - 1); });
    if (next) next.addEventListener('click', function () { show(at + 1); });

    /* Arrow keys only once the gallery is on screen, so they do not fight the
       page scroll while someone is reading the hero. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var g = document.getElementById('inside');
      if (!g) return;
      var r = g.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      show(e.key === 'ArrowLeft' ? at - 1 : at + 1);
    });

    renderThumbs(); show(0);
  })();

  /* ---- scroll spy ---------------------------------------------------------
     .a-view is the scroller in the app frame, so the spy listens there rather
     than on window. */
  (function () {
    var scroller = document.querySelector('.a-view');
    var targets = [].slice.call(document.querySelectorAll('.a-nav-item[href^="#"]'))
      .map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; })
      .filter(function (t) { return t.el; });
    if (!targets.length) return;

    function spy() {
      var line = window.innerHeight * 0.3, cur = targets[0];
      targets.forEach(function (t) { if (t.el.getBoundingClientRect().top <= line) cur = t; });
      var sc = scroller && scroller.scrollHeight > scroller.clientHeight + 4 ? scroller : null;
      if (sc ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4
             : window.scrollY + window.innerHeight >= document.body.scrollHeight - 4)
        cur = targets[targets.length - 1];
      targets.forEach(function (t) { t.a.classList.toggle('is-active', t === cur); });
    }
    (scroller || window).addEventListener('scroll', spy, { passive: true });
    if (scroller) window.addEventListener('scroll', spy, { passive: true });
    spy();
  })();

  /* ---- lightbox ----------------------------------------------------------
     theme.css opens on `.open`; this used to toggle `.on`, which nothing
     matched, so a screenshot could never be enlarged. */
  var lb = document.getElementById('lightbox');
  if (lb) {
    document.addEventListener('click', function (e) {
      var big = e.target.closest('#galleryMain');
      if (big && big.src) {
        document.getElementById('lbImg').src = big.src;
        lb.classList.add('open');
        return;
      }
      if (e.target.closest('#lbClose') || e.target === lb) lb.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lb.classList.remove('open');
    });
  }

  /* ---- reveals ------------------------------------------------------------
     The observer ENHANCES an already-readable page: .rv is only hidden once
     js-reveal proves this script ran, and a failsafe reveals everything after
     2.5s so a stalled observer can never ship a blank section. The scroller is
     .a-view, not the document, so it has to be the observer root. */
  (function () {
    var rv = [].slice.call(document.querySelectorAll('.rv'));
    if (!rv.length) return;
    if (!('IntersectionObserver' in window)) {
      rv.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    document.documentElement.classList.add('js-reveal');
    var root = document.querySelector('.a-view');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px', root: root });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  })();

  if (window.LOADER_DONE) window.LOADER_DONE();
})();
