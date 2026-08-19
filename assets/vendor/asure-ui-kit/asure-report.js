/* ============================================================================
   ASURE UI KIT — asure-report.js
   The one export lane for every EVOLVE / ASURE application.
   Load after asure-ui.css + asure-report.css. Zero hard dependencies;
   html2pdf.js is OPTIONAL (raster PDF lane) — without it the print lane
   (browser Print → Save as PDF) does the job, and the preview says so.

   API
   ───
   AsureReport.config({ studio, footerNote, logo, logoWhite })
   AsureReport.open(bodyHtml, opts)   → overlay preview with Print / PDF
   AsureReport.close()
   AsureReport.print()                → preview-is-print
   AsureReport.pdf(el, opts)          → html2pdf raster + stamped pages
   builders (all return strings):
     AsureReport.masthead({docType, subtitle, project, date, verdict})
     AsureReport.metaGrid([{k,v},…])
     AsureReport.section(n, title)
     AsureReport.kpis([{k,v,u},…], cols)
     AsureReport.rows([[label, value, basis],…])
     AsureReport.signs([{who,role},…])
     AsureReport.foot(leftNote)

   Every stamped page carries: asure logo (or studio name) top-left,
   doc title top-right, hairlines, the discretion line bottom-left,
   "Page N of M" bottom-right.
   ========================================================================== */
(function (global) {
  'use strict';

  var CFG = {
    studio: 'ASURE DESIGN STUDIO',
    suite: 'EVOLVE — Empower with Knowledge',
    footerNote: 'ASURE — Proprietary intelligent tool · not for external use · validation required before any commercial purpose',
    logo: null,        /* data URL or path for light bg (print header) */
    logoWhite: null    /* data URL or path for the navy masthead */
  };

  var R = {};
  R.config = function (o) { Object.keys(o || {}).forEach(function (k) { CFG[k] = o[k]; }); return CFG; };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------------------------------------------------------------- builders */
  R.masthead = function (o) {
    o = o || {};
    var stamp = '';
    if (o.verdict) {
      var cls = o.verdict === 'compliant' || o.verdict === 'pass' ? 'is-ok'
              : o.verdict === 'unverified' || o.verdict === 'screen' ? 'is-warn' : 'is-bad';
      var txt = o.verdictLabel || (cls === 'is-ok' ? 'Compliant' : cls === 'is-warn' ? 'Unverified' : 'Non-compliant');
      stamp = '<span class="a-rep-stamp ' + cls + '">' + esc(txt) + '</span>';
    }
    var brand = CFG.logoWhite
      ? '<img src="' + CFG.logoWhite + '" alt="asure"/>'
      : '<div style="font-weight:800;letter-spacing:.1em">' + esc(CFG.studio) + '</div>';
    return '<div class="a-rep-mast avoid-break">' + brand +
      '<div class="div"></div>' +
      '<div><div class="doc-t">' + esc(o.docType || 'REPORT') + '</div>' +
      '<div class="doc-s">' + esc(o.subtitle || CFG.suite) +
      (o.project ? ' · ' + esc(o.project) : '') + '</div></div>' +
      '<div class="right">' + stamp +
      '<div class="date">' + esc(o.date || new Date().toLocaleDateString('en-IN',
        { day: '2-digit', month: 'short', year: 'numeric' })) + '</div></div></div>';
  };

  R.metaGrid = function (cells) {
    return '<div class="a-rep-meta avoid-break">' + (cells || []).map(function (c) {
      return '<div class="cell"><div class="k">' + esc(c.k) + '</div><div class="v">' + esc(c.v) + '</div></div>';
    }).join('') + '</div>';
  };

  R.section = function (n, title) {
    return '<div class="a-rep-sect avoid-break">' +
      (n != null ? '<span class="n">' + esc(String(n).padStart(2, '0')) + '</span>' : '') +
      esc(title) + '</div>';
  };

  R.kpis = function (items, cols) {
    return '<div class="a-rep-kpis' + (cols === 4 ? ' k4' : '') + ' avoid-break">' +
      (items || []).map(function (i) {
        return '<div class="a-rep-kpi"><div class="k">' + esc(i.k) + '</div>' +
          '<div class="v">' + esc(i.v) + '</div>' +
          (i.u ? '<div class="u">' + esc(i.u) + '</div>' : '') + '</div>';
      }).join('') + '</div>';
  };

  R.rows = function (triples) {
    return '<table class="a-rep-rows">' + (triples || []).map(function (t) {
      return '<tr class="avoid-break"><td class="l">' + esc(t[0]) + '</td>' +
        '<td class="v">' + esc(t[1]) + '</td><td class="b">' + esc(t[2] || '') + '</td></tr>';
    }).join('') + '</table>';
  };

  R.signs = function (people) {
    return '<div class="a-rep-signs avoid-break">' + (people || []).map(function (p) {
      return '<div class="a-rep-sign"><div class="line"></div>' +
        '<div class="who">' + esc(p.who) + '</div><div class="role">' + esc(p.role || '') + '</div></div>';
    }).join('') + '</div>';
  };

  R.foot = function (leftNote) {
    return '<div class="a-rep-foot avoid-break">' +
      '<div><span class="brand">' + esc(CFG.studio) + '</span> · ' + esc(CFG.suite) +
      (leftNote ? '<br/>' + esc(leftNote) : '') + '</div>' +
      '<div style="text-align:right;max-width:46%">' + esc(CFG.footerNote) + '</div></div>';
  };

  /* ══════════════════════════════════════════════════════════════════════
     DETAILED-REPORT BUILDERS — the multi-page consultant grammar
     (cover → contents → numbered sections on explicit A4 sheets, every
     sheet carrying its own running header/footer + Page N of M).

     Compose:  R.open( R.cover({...}) + R.page({...}) + R.page({...}) )
     Body-content builders (statq, callout, minis, plate, checklist …)
     return strings you concatenate into each page's `body`.
     ══════════════════════════════════════════════════════════════════════ */

  R.cover = function (o) {
    o = o || {};
    var kpis = (o.kpis || []).map(function (k) {
      return '<div class="kpi"><div class="k">' + esc(k.k) + '</div>' +
        '<div class="v">' + esc(k.v) + '</div>' +
        (k.s ? '<div class="s">' + esc(k.s) + '</div>' : '') + '</div>';
    }).join('');
    var art = o.artSvg || '';
    return '<div class="a-rep-page a-rep-cover">' +
      (art ? '<div class="a-rep-cover-art">' + art + '</div>' : '') +
      '<div class="brand">' +
        (CFG.logoWhite ? '<img src="' + CFG.logoWhite + '" alt="asure"/>' : '') +
        '<div class="cap">' + esc(o.studio || CFG.studio) + '</div></div>' +
      '<div class="body"><div class="rule"></div>' +
        '<div class="kicker">' + esc(o.kicker || '') + '</div>' +
        '<h1>' + (o.titleHtml || esc(o.title || 'REPORT')) + '</h1>' +
        (o.lede ? '<p class="lede">' + esc(o.lede) + '</p>' : '') +
        (kpis ? '<div class="kpis">' + kpis + '</div>' : '') +
      '</div>' +
      '<div class="foot"><span>' + esc(o.footLeft || 'Detailed report · Rev 01') + '</span>' +
        '<span>' + esc(o.footMid || '') + '</span>' +
        '<span>' + esc(o.footRight || 'For client review') + '</span></div></div>';
  };

  /* one interior sheet with running chrome */
  R.page = function (o) {
    o = o || {};
    return '<div class="a-rep-page">' +
      '<div class="a-rep-runhead">' +
        (CFG.logo ? '<img src="' + CFG.logo + '" alt="asure"/>' : '') +
        '<span class="t">' + esc(o.reportTitle || CFG.reportTitle || '') + '</span>' +
        '<span class="s">' + esc(o.section || '') + '</span></div>' +
      '<div class="a-rep-pagebody">' + (o.body || '') + '</div>' +
      '<div class="a-rep-runfoot"><span>' + esc(o.code || CFG.docCode || '') + '</span>' +
        '<span>Page <b>' + esc(o.pageNo || '') + '</b>' + (o.pages ? ' of ' + esc(o.pages) : '') + '</span></div></div>';
  };

  R.toc = function (o) {
    o = o || {};
    var h = '<div class="a-rep-toc"><div class="kicker">' + esc(o.kicker || 'Detailed report') + '</div>' +
      '<h2>' + esc(o.title || 'Contents') + '</h2>';
    (o.parts || []).forEach(function (p) {
      h += '<div class="part">' + esc(p.part) + '</div>';
      (p.rows || []).forEach(function (r) {
        h += '<div class="row"><span class="n">' + esc(r.n || '') + '</span>' +
          '<span class="t"><b>' + esc(r.t) + '</b>' + (r.d ? '<div class="d">' + esc(r.d) + '</div>' : '') + '</span>' +
          '<span class="p">' + esc(r.p || '') + '</span></div>';
      });
    });
    h += '</div>';
    if (o.infos && o.infos.length) {
      h += '<div class="a-rep-infos">' + o.infos.map(function (i) {
        return '<div class="a-rep-info' + (i.tint ? ' is-tint' : '') + '"><span class="lb">' + esc(i.lb) + '</span>' + (i.html || esc(i.text || '')) + '</div>';
      }).join('') + '</div>';
    }
    return h;
  };

  R.sechead = function (kicker, no, title, lead) {
    return '<div class="a-rep-sechead"><div class="kicker">' + esc(kicker || '') + '</div>' +
      '<h2>' + (no != null ? '<span class="no">' + esc(no) + '</span>' : '') + esc(title) + '</h2>' +
      (lead ? '<p class="lead">' + esc(lead) + '</p>' : '') + '</div>';
  };
  R.h3 = function (t) { return '<div class="a-rep-h3">' + esc(t) + '</div>'; };

  R.statq = function (items, cols) {
    return '<div class="a-rep-statq' + (cols === 3 ? ' q3' : '') + '">' + (items || []).map(function (i) {
      return '<div class="a-rep-stat' + (i.tone ? ' is-' + i.tone : '') + '">' +
        '<div class="k">' + esc(i.k) + '</div>' +
        '<div class="v">' + esc(i.v) + (i.u ? '<span class="u">' + esc(i.u) + '</span>' : '') + '</div>' +
        (i.s ? '<div class="s">' + esc(i.s) + '</div>' : '') + '</div>';
    }).join('') + '</div>';
  };

  R.callout = function (html, tone) {
    return '<div class="a-rep-callout' + (tone === 'stop' ? ' is-stop' : '') + '">' + html + '</div>';
  };
  R.src = function (html) { return '<div class="a-rep-src">SOURCE · ' + html + '</div>'; };

  R.minis = function (cards) {
    return '<div class="a-rep-minis">' + (cards || []).map(function (c) {
      var head = '<tr>' + (c.head || []).map(function (hd, i) {
        return '<th' + ((c.numCols || []).indexOf(i) >= 0 ? ' class="num"' : '') + '>' + esc(hd) + '</th>';
      }).join('') + '</tr>';
      var rows = (c.rows || []).map(function (r, ri) {
        var total = c.totalLast && ri === c.rows.length - 1;
        return '<tr' + (total ? ' class="total"' : '') + '>' + r.map(function (cell, ci) {
          return '<td' + ((c.numCols || []).indexOf(ci) >= 0 ? ' class="num"' : '') + '>' + esc(cell) + '</td>';
        }).join('') + '</tr>';
      }).join('');
      return '<div class="a-rep-mini"><div class="cap">' + esc(c.cap) + '</div>' +
        '<table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
    }).join('') + '</div>';
  };

  R.notes3 = function (cards) {
    return '<div class="a-rep-notes3">' + (cards || []).map(function (c) {
      return '<div class="a-rep-notecard' + (c.tint ? ' is-tint' : '') + '">' +
        '<span class="lb">' + esc(c.lb || '') + '</span>' +
        '<span class="t">' + esc(c.t || '') + '</span>' + (c.html || esc(c.text || '')) + '</div>';
    }).join('') + '</div>';
  };

  R.plate = function (o) {
    o = o || {};
    var inner = o.imgSrc ? '<img src="' + o.imgSrc + '" alt=""/>' : (o.svg || '');
    return '<div class="a-rep-plate">' + inner + '</div>' +
      (o.cap ? '<div class="a-rep-platecap">' + esc(o.cap) + '</div>' : '');
  };
  R.legendrow = function (items, readingLb, readingHtml) {
    return '<div class="a-rep-legendrow"><div class="a-rep-legend"><span class="lb">Legend</span>' +
      (items || []).map(function (i) {
        return '<div class="li"><span class="sw" style="background:' + esc(i.color) + '"></span>' +
          '<span><b>' + esc(i.t) + '</b>' + esc(i.d || '') + '</span></div>';
      }).join('') + '</div>' +
      '<div class="a-rep-legend"><span class="lb">' + esc(readingLb || 'Reading the plate') + '</span>' +
      '<div style="font-size:10.5px;line-height:1.6;color:var(--slate-600)">' + (readingHtml || '') + '</div></div></div>';
  };

  R.checklist = function (rows) {
    var body = (rows || []).map(function (r) {
      var cls = r.status === 'pass' ? 'is-pass' : r.status === 'fail' ? 'is-fail' : 'is-screen';
      var lbl = r.status === 'pass' ? 'PASS' : r.status === 'fail' ? 'FAIL' : 'SCREEN';
      return '<tr class="avoid-break"><td>' + esc(r.check) + '</td>' +
        '<td class="num">' + esc(r.actual) + '</td><td class="num">' + esc(r.required) + '</td>' +
        '<td class="clause">' + esc(r.clause || '') + '</td>' +
        '<td><span class="a-rep-chip ' + cls + '">' + lbl + '</span></td></tr>';
    }).join('');
    return '<table class="a-rep-check"><thead><tr><th>Check</th><th>Actual</th><th>Required</th><th>Clause</th><th>Status</th></tr></thead><tbody>' + body + '</tbody></table>';
  };

  R.draws = function (items) {
    return '<div class="a-rep-draws">' + (items || []).map(function (d) {
      return '<div class="a-rep-draw"><div class="cap">' + esc(d.cap) + '</div>' +
        '<div class="frame">' + (d.inner || '') + '</div></div>';
    }).join('') + '</div>';
  };

  /* ---------------------------------------------------------------- overlay */
  var overlay = null, docEl = null, lastOpts = {};

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'a-repoverlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="a-repbar no-print">' +
        '<div class="t">Report — preview (what you see is what prints)</div>' +
        '<button class="a-btn is-sm" data-rep="print">Print / Save PDF</button>' +
        '<button class="a-btn is-sm is-secondary" data-rep="pdf">Enhanced PDF</button>' +
        '<button class="a-btn is-sm is-secondary" data-rep="close">✕ Close</button>' +
      '</div>' +
      '<div class="a-report" id="a-report"></div>';
    document.body.appendChild(overlay);
    docEl = overlay.querySelector('#a-report');
    overlay.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rep]');
      if (!b) return;
      var a = b.getAttribute('data-rep');
      if (a === 'close') R.close();
      if (a === 'print') R.print();
      if (a === 'pdf') R.pdf(docEl, lastOpts);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) R.close();
    });
  }

  R.open = function (bodyHtml, opts) {
    ensureOverlay();
    lastOpts = opts || {};
    docEl.innerHTML = bodyHtml;
    overlay.hidden = false;
    document.body.classList.add('a-rep-open');
    overlay.scrollTop = 0;
  };
  R.close = function () {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove('a-rep-open');
  };
  R.print = function () { window.print(); };

  /* -------------------------------------------------------------- PDF lane
     Raster export via html2pdf (optional), with the hard-won AUIP recipe:
     · isolate via INLINE display:none on body siblings (class toggles give
       html2canvas silent 0×0 captures)
     · force 700px capture width (186mm printable @96dpi; 900px crops)
     · flatten gradients (html2canvas addColorStop throws on some)
     · 90s timeout race so a stall never hangs the app
     · finally-restore EVERYTHING so a failed export never wrecks the page  */
  R.pdf = function (el, opts) {
    opts = opts || {};
    if (!global.html2pdf) {
      if (global.AsureUI) AsureUI.toast('PDF engine not loaded — using Print instead');
      setTimeout(function () { window.print(); }, 250);
      return Promise.resolve(null);
    }
    var siblings = [], saved = {
      parent: el.parentNode, next: el.nextSibling,
      style: el.getAttribute('style') || '', grads: []
    };
    Array.prototype.forEach.call(document.body.children, function (c) {
      if (c !== el) { siblings.push([c, c.style.getPropertyValue('display'), c.style.getPropertyPriority('display')]); }
    });
    /* flatten gradient mastheads for the capture */
    Array.prototype.forEach.call(el.querySelectorAll('.a-rep-mast'), function (m) {
      saved.grads.push([m, m.style.background]);
      m.style.background = '#1c466f';
    });
    document.body.appendChild(el);
    siblings.forEach(function (s) { s[0].style.setProperty('display', 'none', 'important'); });
    el.style.setProperty('width', '700px', 'important');
    el.style.setProperty('max-width', '700px', 'important');
    el.style.setProperty('box-shadow', 'none', 'important');

    var worker = html2pdf().set({
      margin: [20, 12, 18, 12],
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, width: 700, windowWidth: 700 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css'], avoid: ['tr', '.avoid-break'] }
    }).from(el);

    var timed = Promise.race([
      worker.toPdf().get('pdf'),
      new Promise(function (_, rej) { setTimeout(function () { rej(new Error('PDF generation timed out after 90s')); }, 90000); })
    ]);

    return timed.then(function (pdf) {
      var n = pdf.internal.getNumberOfPages();
      var w = pdf.internal.pageSize.getWidth(), h = pdf.internal.pageSize.getHeight();
      for (var i = 1; i <= n; i++) {
        pdf.setPage(i);
        if (CFG.logo && CFG.logo.indexOf('data:') === 0) {
          pdf.addImage(CFG.logo, 'PNG', 12, 6.4, 19.4, 4.6);
          pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(100, 116, 139);
          pdf.text('DESIGN STUDIO', 33, 10.1);
        } else {
          pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(15, 23, 42);
          pdf.text(CFG.studio, 12, 10);
        }
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(100, 116, 139);
        pdf.text(String(opts.title || ''), w - 12, 10, { align: 'right' });
        pdf.setDrawColor(203, 213, 225); pdf.setLineWidth(0.3); pdf.line(12, 13, w - 12, 13);
        pdf.setDrawColor(226, 232, 240); pdf.line(12, h - 12, w - 12, h - 12);
        pdf.text(CFG.footerNote, 12, h - 7);
        pdf.text('Page ' + i + ' of ' + n, w - 12, h - 7, { align: 'right' });
      }
      pdf.save(opts.filename || 'ASURE_Report.pdf');
      return pdf;
    }).catch(function (err) {
      if (global.AsureUI) AsureUI.toast('PDF failed: ' + err.message + ' — use Print instead');
      throw err;
    }).finally(function () {
      siblings.forEach(function (s) {
        if (s[1]) s[0].style.setProperty('display', s[1], s[2]); else s[0].style.removeProperty('display');
      });
      saved.grads.forEach(function (g) { g[0].style.background = g[1]; });
      if (saved.style) el.setAttribute('style', saved.style); else el.removeAttribute('style');
      if (saved.parent) saved.parent.insertBefore(el, saved.next);
    });
  };

  global.AsureReport = R;
})(window);
