/* ============================================================================
   cms.js — the media desk.
   ----------------------------------------------------------------------------
   Reads the same two globals the public site reads (PROJECTS, MEDIA_MANIFEST)
   and reports what is actually on disk. It deliberately holds no content of its
   own: if this page and the site ever disagreed, one of them would be lying.

   Filling a slot is a file operation, not a form submission, so this page does
   not pretend to upload anything. It tells you the exact path and hands you the
   one command that republishes.
   ========================================================================== */
(function () {
  'use strict';

  var P = window.PROJECTS || [];
  var rowsEl = document.getElementById('rows');
  var noneEl = document.getElementById('none');
  var findEl = document.getElementById('find');
  var filter = 'all';
  var query = '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* Slot counts for one project, straight off its resolved media object. */
  function slots(p) {
    var m = p.media || {};
    return {
      hero: m.hero ? 1 : 0,
      gallery: (m.gallery || []).length,
      videos: (m.videos || []).length,
      html: (m.html || []).length,
      docs: (m.docs || []).length
    };
  }
  function total(s) { return s.hero + s.gallery + s.videos + s.html + s.docs; }

  /* ---------------------------------------------------------------- coverage */
  function coverage() {
    var c = { hero: 0, gallery: 0, videos: 0, html: 0, docs: 0, any: 0 };
    P.forEach(function (p) {
      var s = slots(p);
      if (s.hero) c.hero++;
      if (s.gallery) c.gallery++;
      if (s.videos) c.videos++;
      if (s.html) c.html++;
      if (s.docs) c.docs++;
      if (total(s)) c.any++;
    });
    var cells = [
      ['' + c.hero + '<span style="opacity:.4;font-size:16px">/' + P.length + '</span>', 'have a hero'],
      [c.gallery, 'have a gallery'],
      [c.videos, 'have video'],
      [c.html, 'have a live demo'],
      [c.docs, 'have documents'],
      [P.length - c.any, 'still empty']
    ];
    document.getElementById('cov').innerHTML = cells.map(function (x) {
      return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>';
    }).join('');

    var pct = Math.round(c.hero / P.length * 100);
    document.getElementById('pillCov').textContent = pct + '% have a hero';
    document.getElementById('tbCount').textContent = P.length + ' entries';
    document.getElementById('tbCov').textContent = c.any + ' with media';
  }

  /* ---------------------------------------------------------------- the rows */
  function cell(n, cls) {
    return n ? '<span class="sl on ' + (cls || '') + '">' + n + '</span>'
             : '<span class="sl off">–</span>';
  }

  function row(p) {
    var s = slots(p);
    var path = 'projects/' + p.id + '/';
    return '<div class="row" data-id="' + esc(p.id) + '">' +
      '<div class="cd">' + esc(p.code || '') + '</div>' +
      '<div class="nm"><a href="tool.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name || p.id) + '</a>' +
        '<div class="kd">' + esc(p.kind || '') + '</div></div>' +
      '<div>' + cell(s.hero, 'hero-on') + '</div>' +
      '<div>' + cell(s.gallery) + '</div>' +
      '<div>' + cell(s.videos) + '</div>' +
      '<div>' + cell(s.html) + '</div>' +
      '<div>' + cell(s.docs) + '</div>' +
      '<div class="drop"><code>' + esc(path) + '</code>' +
        '<button class="cp" data-path="' + esc(path) + '">Copy</button></div>' +
    '</div>';
  }

  function matches(p) {
    var s = slots(p);
    if (filter === 'empty' && total(s)) return false;
    if (filter === 'has' && !total(s)) return false;
    if (filter === 'nohero' && s.hero) return false;
    if (query) {
      var hay = ((p.name || '') + ' ' + p.id + ' ' + (p.code || '') + ' ' + (p.kind || '')).toLowerCase();
      if (hay.indexOf(query) < 0) return false;
    }
    return true;
  }

  function render() {
    /* Empty first — this page exists to show what still needs doing. */
    var list = P.slice().sort(function (a, b) {
      var d = total(slots(a)) - total(slots(b));
      return d || String(a.code || '').localeCompare(String(b.code || ''));
    }).filter(matches);

    rowsEl.innerHTML = list.map(row).join('');
    noneEl.style.display = list.length ? 'none' : '';
  }

  /* ---------------------------------------------------------------- wiring */
  rowsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.cp');
    if (!b) return;
    var full = 'Y:\\CLAUDE DIRECT ACCESS FOLDER\\AI_Research_Showcase\\' +
               b.dataset.path.replace(/\//g, '\\');
    navigator.clipboard.writeText(full).then(function () {
      b.textContent = 'Copied';
      b.classList.add('done');
      setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('done'); }, 1400);
    });
  });

  document.getElementById('seg').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    setFilter(b.dataset.f);
  });

  findEl.addEventListener('input', function () {
    query = this.value.trim().toLowerCase();
    render();
  });

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn && window.ICON) {
    themeBtn.innerHTML = ICON('sun');
    themeBtn.addEventListener('click', function () {
      var r = document.documentElement;
      r.setAttribute('data-theme', r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* The sidebar registry. home.js builds the public one from KINDS/DOMAINS;
     this page is a working sheet, so its rail lists the slots instead and
     doubles as the filter. */
  function renderNav(){
    var nav = document.getElementById('nav');
    if(!nav) return;
    var counts = { hero:0, gallery:0, videos:0, html:0, docs:0 };
    P.forEach(function(p){ var s=slots(p);
      Object.keys(counts).forEach(function(k){ if(s[k]) counts[k]++; }); });
    var items = [
      ['all',    'Everything',    P.length],
      ['empty',  'Nothing yet',   P.filter(function(p){return !total(slots(p));}).length],
      ['nohero', 'No hero image', P.length - counts.hero],
      ['has',    'Has media',     P.filter(function(p){return total(slots(p));}).length]
    ];
    nav.innerHTML =
      '<div class="a-nav-sect"><span class="a-label">What needs filling</span></div>' +
      items.map(function(it){
        return '<button class="a-nav-item' + (it[0]===filter?' is-active':'') + '" data-f="' + it[0] + '">' +
               '<span>' + it[1] + '</span><span class="a-nav-count">' + it[2] + '</span></button>';
      }).join('') +
      '<div class="a-nav-sect" style="margin-top:18px"><span class="a-label">Slots</span></div>' +
      [['hero','Hero image'],['gallery','Gallery'],['videos','Video'],['html','Live demo'],['docs','Documents']]
        .map(function(s){
          return '<div class="a-nav-item" style="cursor:default;opacity:.75">' +
                 '<span>' + s[1] + '</span><span class="a-nav-count">' + counts[s[0]] + '</span></div>';
        }).join('');

    nav.addEventListener('click', function(e){
      var b = e.target.closest('.a-nav-item[data-f]');
      if(!b) return;
      setFilter(b.dataset.f);
    });
  }

  function setFilter(f){
    filter = f;
    [].forEach.call(document.querySelectorAll('#nav .a-nav-item[data-f]'), function(x){
      x.classList.toggle('is-active', x.dataset.f === f); });
    [].forEach.call(document.querySelectorAll('#seg button'), function(x){
      x.classList.toggle('on', x.dataset.f === f); });
    render();
  }

  renderNav();
  coverage();
  render();
})();
