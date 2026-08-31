/* ============================================================================
   videos.js — the running clips, now the lead cards inside #ecosystem.
   ----------------------------------------------------------------------------
   Used to be a second section (#videos) repeating the same 70-tool catalogue
   #ecosystem had just shown as text cards. Folded together 2026-08-31 on
   Surya's instruction: these ten are the tools we can show running, so they
   ARE the tools-section cards now — the pager below them (home.js) carries
   the rest of the 70 as a compact searchable list, never a second gallery of
   the same idea.

   Card shape cut down to match: video, title, one line (`why`, tightened to
   read in a glance) — see shortCard() below. The long `seeing` paragraph,
   the full `why` sentence and the `software` line are NOT gone; they moved to
   the field's own tool page, rendered by tool.js's "Seeing it run" section,
   for whichever clip has a confident `toolId` match (see the note on that
   field below the list). A card whose clip cannot be confidently traced to
   one catalogue entry carries no `toolId` and stays un-linked here too —
   inventing the link would be the thing this site refuses to do.

   Ten screen recordings, cut down to the 30–60 seconds where the thing
   actually happens. Everything in `seeing` was written after watching the
   source: frames were pulled every 10–20s with ffmpeg and read, and the clip
   window was chosen from those frames. Where a detail could not be read off
   the screen it is left out or marked, never guessed — see `rec-2026-04-23`,
   whose add-in never names itself on screen.

   Was twelve. Two vendor-webinar clips (Autodesk's ACC demo, GAMMA AR's
   product film) were removed 2026-08-30 — other people's footage, not the
   studio's work. The kind:'reference' handling below is left in place; it is
   just unused until something else needs it.

   Privacy pass (2026-08-26). These are raw desktop captures, so every clip was
   re-read frame by frame before it was allowed on the page:
     - claude-revit-timed-2  moved off 80s: an account/billing page was on screen
     - rec-2026-03-31-1257   moved off 1300s: WhatsApp Web was on screen
     - screen-2026-07-15     moved off 6s: an AUTHORS file of names + emails
     - screen-2026-08-12     email row and error row are BLURRED in the mp4 —
                             they carried a real address and a live backend host
   The full-length compressed mp4s in assets/videos/ have had NO such pass.
   They are not linked from here and should not be, until they get one.

   Poster-first is not decoration: twelve autoloading videos is ~30MB on load.
   Each <video> ships preload="none" with a poster, so nothing but the JPEG is
   fetched until a visitor presses play.

   `toolId` (added 2026-08-31): which catalogue entry (assets/js/projects_data.js
   `id`) this clip is evidence for, only set where the clip itself names or
   visibly proves the tool — a branded dialog, a matching port number, an
   on-screen title. Traced case by case, not guessed:
     - claude-revit-timed-1/2, rec-2026-03-31-1257 -> ads-bridge
       (frame reads "http://127.0.0.1:48884" — the ADS Bridge port — and
       ads-bridge's own record names the same pyRevit ADS_Bridge HTTP API)
     - rec-2026-04-20-1244, screen-2026-08-20-1854, screen-2026-08-12-1225 -> phoenix-l1
       (Level-1 self-cert / "ADS Phoenix L1" is on screen in all three)
     - screen-2026-08-20-1734 -> ai-team-hub
       ("a dashboard... within Asure Design Studio", the hub's own description)
   ads-plugin-test-2 (a CAD Layer Mapper no catalogue entry currently
   describes), rec-2026-04-23-1500 (the add-in "never names itself on
   screen") and screen-2026-07-15-1027 (an Obsidian vault, not itself a
   catalogued tool) carry no `toolId` — an honest gap, not an oversight.

   Sizes: 10 · 11 · 12 · 14 · 16 · 19 · 22 · 27 · 38 · 60 · 92. Nothing else.
   ============================================================================ */

window.VIDEOS = [
  {
    slug: 'claude-revit-timed-1',
    kind: 'studio',
    toolId: 'ads-bridge',
    dur: 45,
    title: 'Claude builds a 53-storey structural skeleton in Revit',
    line: '2,173 columns and 52 floor slabs copied up a tower, unattended.',
    seeing: 'Claude Code runs beside Revit, connected through the ADS Bridge MCP server. ' +
            'The 3D view holds one flat floor plate; when the run finishes the view redraws ' +
            'as a full tower. The table on the right is the model state Claude reports back — ' +
            'Levels 53 (L1 at 0 ft to L53 at 624 ft, 12 ft floor to floor), Structural Columns ' +
            '41 original plus 2,132 copies for 2,173 total, Floor Slabs 1 plus 52 copies.',
    why: 'Replaces copying columns and slabs level by level up a tower — a day of modelling with nothing in it to decide.',
    software: 'Revit 2025 · Claude Code · MCP bridge'
  },
  {
    slug: 'ads-plugin-test-2',
    kind: 'studio',
    dur: 46,
    title: 'CAD layers mapped to native Revit elements',
    line: 'A linked DWG’s layers become native, schedulable Revit columns.',
    seeing: 'A CAD Layer Mapper dialog on the ADS ribbon lists layer names from a linked ' +
            'drawing against a Revit category and a family type — S-COL1 to Structural ' +
            'Columns, family ADS_COL-STL-CON-450x450. Create Elements is pressed and the ' +
            'columns appear in the 3D view, standing on the CAD linework they came from. ' +
            'The clip ends with all 41 selected and their base and top level constraints ' +
            'being set in one go.',
    why: 'Replaces re-drawing a consultant’s DWG by hand to get native, schedulable Revit geometry.',
    software: 'Revit 2025 · ADS pyRevit extension'
  },
  {
    slug: 'rec-2026-04-23-1500',
    kind: 'studio',
    dur: 46,
    title: 'Doors and windows read off a scanned floor plan',
    line: 'A raster plan turns into placed doors and windows automatically.',
    seeing: 'A raster plan of a one-bedroom unit, 575 sq ft, is loaded into Revit as a ' +
            'background image; the walls have already been generated from it. An opening ' +
            'detection dialog sets the defaults — M_Window-Casement-Double at 900 mm high ' +
            'on a 1200 mm sill, M_Door-Exterior-Single-Two_Lite at 2040 mm head — and Launch ' +
            'starts the run. A progress panel ticks through image preparation, data sending ' +
            'and the detection algorithm, then the 3D view shows a window cut into the wall.',
    why: 'Replaces tracing an old scanned plan wall by wall and opening by opening.',
    software: 'Revit 2025 · a raster-to-BIM add-in (it never names itself on screen)'
  },
  {
    slug: 'claude-revit-timed-2',
    kind: 'studio',
    toolId: 'ads-bridge',
    dur: 45,
    title: 'Correcting 2,173 column constraints in the same session',
    line: 'Thousands of copied columns re-hosted to the right floor, on one instruction.',
    seeing: 'Later in the same session. The tower exists, and the view orbits down through ' +
            'the slab stack while the reported state stays on screen. The next instruction ' +
            'is being typed into Claude — "remove any overlapping columns, just connect them ' +
            'floor to floor" — because the copied columns are all 41 ft tall and unconnected, ' +
            'so they run straight through the floors above them.',
    why: 'Replaces the clean-up pass where thousands of copied elements have to be re-hosted to the right level.',
    software: 'Revit 2025 · Claude Code · MCP bridge'
  },
  {
    slug: 'rec-2026-04-20-1244',
    kind: 'studio',
    toolId: 'phoenix-l1',
    dur: 32,
    title: 'Model health checked across a folder of Revit files',
    line: 'A folder of Revit files opens, scores itself, and closes on its own.',
    seeing: 'Run from the ADS tab, the check starts with a folder picker rather than the open ' +
            'document. A pyRevit dialog reports what it found — "Process 2 Revit file(s)?" — ' +
            'and lists the models it will open, score and close on its own. A save dialog then ' +
            'names the output: Model Health Report, as PDF.',
    why: 'Replaces opening every model in turn to count warnings, CAD imports, in-place families and views not on sheets.',
    software: 'Revit 2025 · ADS pyRevit extension'
  },
  {
    slug: 'rec-2026-03-31-1257',
    kind: 'studio',
    toolId: 'ads-bridge',
    dur: 44,
    title: 'Claude interrogates the live model before it draws anything',
    line: 'Claude lists what it won’t assume before it touches the model.',
    seeing: 'The brief was to divide the open part of the 4th floor into four equal parts and ' +
            'put partition walls in. Claude, reading the open Revit project through the pyRevit ' +
            'bridge, does not draw. It returns a numbered list of things it will not assume — ' +
            'which level "4th Floor FFL" really is, where the divisible boundary stops against ' +
            'the core, whether "equal" means by area or visually, how many conference rooms per ' +
            'zone, washroom access, wall thickness, door sizes, and what the partitions have to ' +
            'align to. The plan sits beside it with all 122 rooms selected.',
    why: 'Replaces the round of emails where the wrong assumption only surfaces after the wrong thing has been drawn.',
    software: 'Revit · Claude Desktop · pyRevit MCP bridge'
  },
  {
    slug: 'screen-2026-08-20-1854',
    kind: 'studio',
    toolId: 'phoenix-l1',
    dur: 8,
    title: 'Decision trace behind a Level-1 self-certification',
    line: 'Every pass or fail traced back to the exact clause it was tested against.',
    seeing: 'Eight seconds — the whole recording, not an excerpt. A dashboard headed ' +
            'ASURE · DECISION TRACE · LEVEL-1 SELF-CERT. Hovering an element in the small ' +
            'unit plan swaps the panel underneath it: a door in the master bath, the kitchen ' +
            'and dining room, wall type A-WALL-EXT-200, a bedroom window. Each one lists the ' +
            'clauses it was tested against — container ID and naming, the Phoenix self-cert ' +
            'SOP, Uniclass 2015, ISO 19650 status, NBC 2016 egress and daylight — with a pass, ' +
            'warning or fail on every line.',
    why: 'Turns a single compliance score into an answer for why one specific element passed or failed.',
    software: 'Browser · prototype dashboard'
  },
  {
    slug: 'screen-2026-08-12-1225',
    kind: 'studio',
    toolId: 'phoenix-l1',
    dur: 32,
    title: 'The licence gate on the Phoenix plugin',
    line: 'The plugin won’t open until a firm is signed in and approved.',
    seeing: 'Inside Revit, on the Snowdon Towers sample project, the ADS Phoenix L1 plugin ' +
            'will not open until someone signs in. This is its create-account form: full name, ' +
            'firm name, and a role of In-house, Consultant or Client, under the line "By ' +
            'creating an account, you confirm your firm is approved to use ADS Phoenix". ' +
            'The email row and an error message are blurred on purpose — they held a real ' +
            'address and a live server hostname.',
    why: 'Makes the plugin something a firm is granted a seat on, rather than a folder that gets copied around.',
    software: 'Revit 2025 · ADS Phoenix L1'
  },
  {
    slug: 'screen-2026-08-20-1734',
    kind: 'studio',
    toolId: 'ai-team-hub',
    dur: 10,
    title: 'The internal tool catalogue',
    line: 'Every internal tool, counted by how often it’s actually opened.',
    seeing: 'Ten seconds — again the whole recording. Cards on the studio’s internal hub, each ' +
            'with a discipline tag and a flat description: Design Feasibility Lab, "draw the ' +
            'site, check statutory rules live, and study massing in 3D"; Master Planning; ' +
            'Parking Design Lab; Traffic Design Studio. Under each one, how often it was opened ' +
            'in the last 30 days and when it shipped — "43 opens · 30 d · shipped 7 d ago".',
    why: 'Keeps the catalogue honest: a tool is counted by how often it is opened, not by the fact that it exists.',
    software: 'Browser · internal hub'
  },
  {
    slug: 'screen-2026-07-15-1027',
    kind: 'studio',
    dur: 34,
    title: 'The studio’s own source tree as a linked vault',
    line: 'A few thousand working notes, drifting and cross-linked in one graph.',
    seeing: 'An Obsidian graph of a vault built out of the studio’s working folders — a few ' +
            'thousand notes drifting and re-clustering as the canvas is panned. The tree on ' +
            'the left is the pyRevit extension itself: ADS_ISO19650.extension, with Architecture, ' +
            'Batch Tools, CAD Tools, Fixtures, Openings and Structure panels, and pushbuttons ' +
            'for CAD Layer Mapper, Batch Update, Door, Window and Beam. Two notes open along ' +
            'the way — a UI/UX design guide and a Node addon README.',
    why: 'Makes a folder tree searchable and cross-linked instead of only browsable.',
    software: 'Obsidian'
  }
];

(function () {
  'use strict';

  var host = document.getElementById('videoGrid');
  if (!host || !window.VIDEOS) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function clock(sec) {
    return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
  }

  /* Short form (Surya, 2026-08-31: "this should be short like the tool card").
     video, title, one line — nothing else on the card. Not wrapped in <a>:
     the <video> already carries its own controls, and nesting a native
     control surface inside a link is the thing that breaks click-to-play.
     Where the clip traces to a catalogue entry (`toolId`), a small go-link
     under the line opens it — the same "Open X" wording tool.js's own
     related-tools card uses, so the affordance reads as one convention. A
     clip with no confident match gets no link: an honest gap, not a filler
     pointer. */
  host.innerHTML = window.VIDEOS.map(function (v, i) {
    var base = 'assets/videos/' + v.slug + '-clip';
    var tool = v.toolId && window.PROJECTS
      ? window.PROJECTS.filter(function (p) { return p.id === v.toolId; })[0] : null;
    return '<article class="fcard vclip-card rv" style="--d:' + Math.min(i * 60, 360) + 'ms">' +
      '<div class="vclip-media">' +
        '<video controls preload="none" playsinline ' +
               'poster="' + base + '.jpg" ' +
               'aria-label="' + esc(v.title) + '">' +
          '<source src="' + base + '.mp4" type="video/mp4">' +
          'This browser cannot play the clip.' +
        '</video>' +
        '<span class="vclip-dur">' + clock(v.dur) + '</span>' +
        (v.kind === 'reference'
          ? '<span class="vclip-tag">Not our work &middot; reference</span>' : '') +
      '</div>' +
      '<h3 class="fc-id" style="margin-bottom:6px"><b>' + esc(v.title) + '</b></h3>' +
      '<p class="fc-line">' + esc(v.line || v.why) + '</p>' +
      (tool
        ? '<a class="fc-go" href="tool.html?id=' + encodeURIComponent(tool.id) + '">' +
            'Open ' + esc(tool.name) + ' &rarr;</a>'
        : '') +
    '</article>';
  }).join('');

  /* home.js observes .rv once, before these cards exist, so this band brings
     its own observer rather than relying on that pass. Without it the cards
     stay at opacity 0 under :root.js-reveal. */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(host.querySelectorAll('.rv'), function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(host.querySelectorAll('.rv'), function (el) { el.classList.add('in'); });
  }

  /* One at a time. Twelve clips that can all play at once is twelve audio
     tracks over each other. */
  Array.prototype.forEach.call(host.querySelectorAll('video'), function (v) {
    v.addEventListener('play', function () {
      Array.prototype.forEach.call(host.querySelectorAll('video'), function (o) {
        if (o !== v && !o.paused) { o.pause(); }
      });
    });
  });
}());
