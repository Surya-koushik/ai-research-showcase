# Gates: rebuild tool_template.html on the site's design system

Scope: `tool_template.html` stops being a self-contained page with its own private
design system and becomes a real template on the site's tokens, chrome and voice.
Plus the impeccable violations that audit surfaces across the files already shipped.

Run: `node "C:/Users/surya ASURE/.claude/skills/unlazy/scripts/gate-check.mjs" GATES.md`

- [x] G1: tool_template.html carries no private design system — it links the site's stylesheets instead of an inline `:root` palette
  CHECK: grep -c "^    :root{--ink:#15171a" "tool_template.html" || true
  EXPECT: 0

- [x] G2: none of the Dala-era hardcoded palette survives anywhere in tool_template.html (navy #163651, teal #2f9e96, lime #d9ff58, slate #102d46)
  CHECK: grep -oiE "#163651|#2f9e96|#d9ff58|#102d46|#0c2940|#1c466f" "tool_template.html" | wc -l
  EXPECT: /^\s*0\s*$/

- [x] G3: it wears the same chrome as the landing page — hamburger, EVOLVE wordmark, drawer, no theme toggle
  CHECK: grep -c "navToggle\|topbar-brand\|nav-scrim" "tool_template.html"
  EXPECT: /[1-9]/

- [x] G4: no themeBtn anywhere in tool_template.html (the toggle was removed site-wide)
  CHECK: grep -c "themeBtn" "tool_template.html" || true
  EXPECT: 0

- [x] G5: numbered section eyebrows (01 / 02 / 03) are gone — impeccable bans them as default scaffolding, and these sections are not a sequence
  CHECK: grep -oE "0[1-9] / " "tool_template.html" | wc -l
  EXPECT: /^\s*0\s*$/

- [x] G6: no side-stripe borders anywhere in the CSS I own (impeccable absolute ban: border-left/right > 1px as a coloured accent)
  CHECK: grep -nE "border-(left|right):\s*[2-9]px" "assets/css/site-chrome.css" | wc -l
  EXPECT: /^\s*0\s*$/

- [x] G7: no gradient text anywhere (impeccable absolute ban)
  CHECK: grep -rn "background-clip:\s*text\|-webkit-background-clip:\s*text" assets/css/site-chrome.css tool_template.html | wc -l
  EXPECT: /^\s*0\s*$/

- [x] G8: no ghost-card pattern in site-chrome.css — 1px border paired with a >=16px-blur drop shadow on the same rule
  EVIDENCE: only remaining >=16px blur in site-chrome.css is `0 0 64px -14px` on the OPEN drawer
  (`body.a-app.nav-open > .a-sidebar`) and its .toolpage twin -- functional elevation on an
  overlay panel, not card decoration, and neither rule pairs it with a 1px border. Every card
  rule now reads `box-shadow:0 1px 2px rgba(16,45,70,.05)` with the hairline carrying the edge.

- [x] G9: no border-radius >= 32px on cards or sections (impeccable: cards top out at 12-16px)
  CHECK: grep -nE "border-radius:\s*(3[2-9]|[4-9][0-9])px" "assets/css/site-chrome.css" | wc -l
  EXPECT: /^\s*0\s*$/

- [x] G10: reveal animations no longer gate content visibility — if the observer never fires, content is still readable (impeccable: reveals enhance an already-visible default)
  EVIDENCE: JavaScript disabled: template `{total:16, hidden:0}`, index `{total:27, hidden:0}`.
  `.rv` was `opacity:0` unconditionally; it is now `:root.js-reveal .rv`, set only once a script
  proves it can run, plus a 2.5s failsafe in the template.
  ADVERSARIAL PASS found this evidence was incomplete: index.html still showed nothing with JS off
  because the `.evo-loader` overlay is removed BY loader.js, so it never left. Fixed with a
  `<noscript>` rule in index.html and tool.html; re-tested `loaderCovers:False, h1Visible:True`.
  SECOND REGRESSION, caught by re-measuring computed opacity instead of the class: raising the
  hidden rule to `:root.js-reveal .rv` (0,3,0) made it out-specify `.rv.in` (0,2,0), so NOTHING
  revealed anywhere. The earlier "unrevealed=0" reading was worthless because it counted the class,
  not the paint. Fixed by matching weight on both the visible and reduced-motion rules.
  Final measured state, computed opacity after scrolling the element that actually scrolls:
  desktop+mobile x index/template/h10/tool = `invisible=0` on all eight.
  HONEST LIMIT: `tool.html` renders its entire body from `tool.js`, so with scripting off it is
  blank and cannot be otherwise without server-side rendering. Recorded, not hidden.

- [x] G11: the rebuilt template renders with zero page errors and zero 404s
  EVIDENCE: final sweep, 4 pages x 2 breakpoints: `err=none`, `overflow=False` on all eight;
  the only 404s are grasshopper.svg / rhino.svg on index, pre-existing (Finding 4).
  THREE BUGS FOUND BY ACTUALLY LOOKING AT THE RENDER, none of which the automated checks caught:
  (1) `tool-page.css` is the old layout wholesale -- `body{padding-left:232px;padding-right:292px}`
      and `.hero-copy{position:absolute}` -- so the hero was blank and gutter-boxed. Dropped that
      stylesheet from tool_template.html and h10.html; tool.html still needs it and keeps it.
  (2) `.tp-hero` is already a real component in theme.css; my div inherited its border and radius.
      Renamed to `.tpl-hero`.
  (3) `.tp-stage video{display:block}` out-specified the UA `[hidden]` rule, so the inactive
      <video> held a full stage height and pushed the screenshot out of view. Guard restored.

- [x] G12: body text clears 4.5:1 against its background on the rebuilt template
  EVIDENCE: measured against `rgb(255,255,255)`: lede 6.0:1, .ss-body p 6.0:1, .tp-meta dd 6.0:1,
  .tp-caption 6.0:1. Floor is 4.5:1. Matches light.css's documented `--ink-2 #5A6472 /* 6.00 */`.

- [x] G13: no horizontal overflow at 390px or 1440px on the rebuilt template
  EVIDENCE: `[template 1440] overflow=False` and `[template 390] errors=none 404s=none unrevealed=0 overflow=False`

- [x] G14: the template's copy is in the site's voice — plain statements, no invented numbers, placeholders visibly tagged
  EVIDENCE: figures on the page (3.5h/wk, 4h -> 0.5h, 22 checks, 5 gates) are carried over from the
  previous template's fact rail, not invented. Sentences are plain statements in the landing
  page's register. The one uncertain claim is hedged in `data-cms="measurement"`: "Where a tool
  has not been measured, this block says so rather than estimating." Template slots are marked
  with `data-cms` attributes rather than lorem text.

- [x] G15: tool.html (the live CMS page) still renders correctly after the shared-CSS changes — no regression
  EVIDENCE: `[tool.html] errors=none 404s=none unrevealed=0 overflow=False`

- [x] G16: index.html still renders correctly after the shared-CSS changes — no regression
  EVIDENCE: `[index.html] unrevealed=0 overflow=False`; the only 404s are grasshopper.svg and rhino.svg,
  pre-existing and tracked as Finding 4 in MODIFICATIONS.md. A repeat run showed `no failed
  requests`, so the one-off ERR_CONNECTION_REFUSED in the sweep was transient, not a regression.

<!--
A checked box whose EVIDENCE still reads "pending" counts as UNMET.
If a gate becomes impossible: add `ABANDON: G<n> <reason>` and report it.
-->
