# aiveloft-v2.framer.website — Reference Design Extraction

> Method note: the brief pointed at the `firecrawl-website-design-clone` skill's collection
> step, which assumes a Firecrawl API key. We have none, and there is no Firecrawl CLI in
> this environment. Substituted **local Playwright against the live DOM** — real Chrome
> (`channel="chrome"`), 1600×1000 viewport, full scroll-walk to trigger Framer's lazy reveals,
> then `getComputedStyle` + `getBoundingClientRect` + raw `<style>`-tag extraction. This reads
> the browser's own resolved values and the site's literal authored CSS (inline `style=`
> attributes and `<style>` blocks), which is strictly more accurate than scraping rendered
> HTML for classnames and guessing — every number below traces to a live measurement or a
> quoted line of the site's own CSS, not to visual estimation, except where explicitly marked
> **unverified**.
>
> Captures live in `_design/ref/`: `full.png` (1600×30720 full-page), `strip_a.png` /
> `band0-3.png` (composited section crops), `raw_style_tags.css` (413KB, all 25 `<style>` tags
> concatenated verbatim), `capture_raw.json` (colour/font/radius/shadow/border histograms +
> 40 glyph-bbox scale samples), `component_styles3.json` (per-component computed styles),
> `anchor_chains.json` (DOM ancestor chains used to disambiguate nav-menu duplicates from
> real page content), `seam_light_to_dark.png` / `seam_dark_to_light.png` (band-boundary
> crops), `badge_zoom.png` (the ORCHESTRATED badge at 4× crop).

**Theme:** dark-primary with light interleaved bands (see Band Rhythm — this is not a
single-theme page; roughly two-thirds of its sections are light, one-third dark, alternating).

Aiveloft is a workflow-automation agency site built as a **hand-authored component library on
top of Framer**, not a page assembled purely in Framer's visual canvas — the giveaway is 25
`<style>` tags totalling 413KB of clean, commented, BEM-ish authored CSS (`.avh-*` for hero,
`.avr-*` for the reliability/model section, `.avroi-*` for the ROI calculator, `.avp-*` for
principle cards, `.avn-*` for nav, `.aiv-*` for the industries/solutions grids, `.avtest-*`
`.avfaq-*` `.avfinal-*` `.avcmp-*` `.avcs-*` `.avint-*` for testimonials/FAQ/final-CTA/
comparison/case-study/integrations). Two exceptions ride on Framer's own visual-canvas markup
with no semantic classnames: the "Workflow Automation" family of numbered solution cards and
the "Example automation" nested flow panel — for those, computed styles (not source CSS) are
the evidence.

Typography mixes two variable fonts — **Instrument Sans** for display/headline/large-numeral
roles, **Inter** for nav/UI-chrome/small-label roles — at **non-standard weight values**
(560, 590, 620, 650, 680, 690, 700, 710, 720, 730, 740, 745, 750, 760, 770, 780, all measured)
rather than snapping to 400/500/600/700/800. That is a variable-font axis being dialled
per-instance, not a mistake, but it is a technique Asure's static Google-Fonts `@import` of
Inter cannot reproduce — see the Mapping section.

Colour is dark-base indigo (`#111318`/`#121318`) with a five-stop indigo family for accents,
carried mostly at reduced alpha over dark, and re-cut in full saturation for text-on-light
sections. Cards are the load-bearing unit throughout: a numbered chip, an uppercase eyebrow,
a headline, body copy, then either checklist rows or a pill-tag row — the same skeleton
repeats at three explicit size classes (featured / grid / industry) documented under
Components.

---

## 1. Colour system

All values below are `getComputedStyle` output aggregated across the full scrolled page
(colour histogram, `capture_raw.json → colors`, top 40 by occurrence count), converted to hex,
cross-checked against literal `rgba(...)` strings in `raw_style_tags.css` and inline `style=`
attributes.

| Hex | rgba source | Occurrences | Role (measured usage) |
|---|---|---:|---|
| `#111318` | `rgb(17, 19, 24)` | 637 | Base page background (dark sections) — `html body { background: rgb(17,19,24) }` literal in source |
| `#121318` | `rgb(18, 19, 24)` | 206 | Secondary dark base — used interchangeably with `#111318` on adjacent dark sections (measured inconsistency, not a deliberate two-tone base) |
| `#111216` | `rgb(17, 18, 22)` | — | ROI-calculator output panel, case-study section base — a third near-identical dark, again not unified |
| `#181B22` | `rgb(24, 27, 34)` | — | Raised dark card surface (the numbered solution cards) — one step up from base |
| `#20242D` | `rgb(32, 36, 45)` | — | Nested-panel surface inside a dark card (the "Example automation" panel; also the tag-pill fill) — one step up again |
| `#2A2E38` | `rgb(42, 46, 56)` | 53 | Dark-card border / hairline-on-dark, solid (not alpha) |
| `rgba(255,255,255,.035)` | — | 50 | Softest dark hairline — the step-grid container border inside nested panels |
| `rgba(255,255,255,.07)` | — | 43 | Standard dark hairline — card-to-card borders, nested-panel border |
| `#FFFFFF` | `rgb(255,255,255)` | 719 | Light-section card/base fill |
| `#F7F8FA` | `rgb(247,248,250)` | — | Light "paper-2" — hero section bg, industries-grid alt bg |
| `#F7F7F9` | `rgb(247,247,249)` | — | A **second, near-identical** light paper tone — before/after-automation, ROI-calculator, integrations, testimonial, FAQ section backgrounds. Measured as genuinely distinct from `#F7F8FA` (different hex), most likely template drift across separately-authored sections rather than intent — flagged, not smoothed over |
| `#E8EAF0` | `rgb(232,234,240)` | 130 (top border overall) | Light hairline — nav bar bottom border, mega-menu border, numbered-card-on-light border, principle-card border |
| `#9B97FF` | `rgb(155,151,255)` | 212 | Accent, light-on-dark — numbered-chip text/icon colour, dark-section link/keyword colour |
| `#5E63E8` | `rgb(94,99,232)` | 104 | Accent, mid — nav CTA fill, logo dot, live-status ring, ORCHESTRATED-badge dot |
| `#665CFF` | `rgb(102,92,255)` | 91 | Accent, saturated — hero two-tone headline word, focus rings |
| `#5654D8` | `rgb(86,84,216)` | 90 | Accent, deep — trust-row checkmark colour, principle-card index-chip text (on light) |
| `#4F46E5` | `rgb(79,70,229)` | 67 | Accent, deepest — occasional hover/active state |
| `#CFCBFF` | `rgb(207,203,255)` | 48 | Accent tint — used sparingly for secondary emphasis text on dark |
| `#C7C9FF` | inline `style=` | — | ORCHESTRATED-badge text colour (measured via inline style, not the histogram) |
| `rgba(94,99,232,.10)` | — | — | Accent-soft fill — ORCHESTRATED badge background |
| `rgba(94,99,232,.13)` | — | 32 | Accent-soft fill — numbered-chip background (both featured and grid card variants) |
| `#5F6472` | `rgb(95,100,114)` | 156 | Muted — trust-row text, tag-pill secondary text |
| `#656B78` | `rgb(101,107,120)` | 86 | Muted — nav link default colour (before hover) |
| `#9DA3B0` | `rgb(157,163,176)` | 58 | Muted, lighter — eyebrow labels and body copy on dark cards |
| `#D5D8E0` | `rgb(213,216,224)` | 45 | Muted, lightest — tag-pill text on dark |
| `rgba(255,255,255,.68 / .70 / .72 / .78 / .82 / .90)` | — | 191/48/29/50/— /30 | Text-on-dark alpha ladder — six distinct alpha steps measured (not the three the brief pre-flagged); `.82` for panel sub-headers, `.68`–`.72` for body copy, `.90` for near-primary text, `.55` for the faintest step labels |
| `#34A567` | inline `style=` | — | Success green — the single non-indigo accent, used only for the pulsing "live" status dot |

**Correction to the pre-supplied harvest:** the base is not a single dark hex — three near-black
tones (`#111318`, `#121318`, `#111216`) and two near-white tones (`#F7F8FA`, `#F7F7F9`) are all
in live use, genuinely different by a few RGB units each. This reads as template/component
drift (each authored section picked its own "black" and "white"), not a deliberate multi-stop
system — worth naming as a thing NOT to copy (see LEAVE).

---

## 2. Real type scale

**Measurement method:** the brief's pre-flagged risk — Framer canvas-transform scaling making
computed `font-size` read artificially small (10–14px) — was tested directly, not assumed.
Forty text-leaf samples were taken across the page, and for each: (a) the full CSS transform
chain from the element up to `<html>` was walked and multiplied (`DOMMatrix` scaleX/scaleY),
and (b) the actual glyph bounding box was measured with `Range.selectNodeContents().
getBoundingClientRect()`, which reports true rendered pixels regardless of any transform.

**Result: no transform-scale artifact exists at this viewport (1600px).** All 40 samples
returned `transformChainScale = 1.000`, and Range-bbox heights matched computed
`font-size × line-height` within normal line-height variance (e.g. computed `34px`, measured
glyph-row height `46px` = ratio 1.35, consistent with a `line-height` of that ratio, not a
hidden 2–3× scale factor). **Computed `font-size` is the real rendered size at desktop width.**
The "10–14px everywhere" impression in the pre-supplied harvest is a sampling effect, not a
transform bug: small UI labels (badges, chips, nav items) vastly outnumber headline elements
in DOM leaf-node count, so a frequency-sorted list is dominated by them even though large
sizes (up to 76px) are also present and correctly rendered. Cross-verified on three concrete
pairs: `22px→24px` glyph row (720wt), `34px→46px` glyph row (730wt), `68px→223px` glyph row
(760wt, multi-line wrap, consistent with wrapped `line-height`).

**Not a token scale.** Unlike Asure's disciplined 11-step list, aiveloft's authored sizes are
near-continuous per-component literals: distinct sizes measured include 9, 10, 10.5, 11,
11.5, 12, 12.5, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 34,
35, 38, 40, 42, 43, 44, 46, 48, 56, 64, 66, 68, 72, 74, 76px. There is no shared step system —
each component was hand-tuned. The table below distils that continuum into the functional
roles it's actually used for, citing the concrete measured instances per role.

| Role | Measured px (weight) | Family | Letter-spacing (measured) | Evidence |
|---|---|---|---|---|
| Micro / step-label | 9–10px (600–800) | Inter / Instrument Sans mixed | 0.7–1.2px, uppercase | "OBSERVABLE" 9px/600; ORCHESTRATED badge 10px/750, tracking `.06em` (inline style) |
| Eyebrow / chip-number | 10–11px (700–800) | Instrument Sans | 0.44–1.2px, uppercase for eyebrows, normal for numeral chips | "CORE SYSTEM" eyebrow 10px/800/1.2px/uppercase; "01" numbered chip 11px/800/0.44px |
| Nav label | 12.5–13px (590–780) | Inter | normal | `.avn-toplink` 12.5px/590; logo "AIVELOFT" 13px/780 |
| Body-sm | 13–14px (400) | Instrument Sans | normal, line-height ≈1.62× | Card description 14px/400, line-height 22.68px |
| Body / lede | 15–21px (400–450) | Instrument Sans | normal to −0.18px | Hero supporting copy measured at both 18px and 21px (two different hero-copy instances on the page — not unified) |
| Stat / small numeral | 20–25px (620–650) | Instrument Sans | −0.18 to −0.92px | "38h" 23px/650/−0.92px; "$5,674" 25px/620 |
| H5 / grid-card title | 22px (720) | Instrument Sans | −0.66px (−3.0%) | AI Agents grid-card heading, measured exact |
| H4 / featured-card title | 28–34px (720–730) | Instrument Sans | −0.98 to −1.19px (−3.0 to −3.5%) | "Workflow Automation" featured heading 34px/730/−1.19px, measured exact |
| H3 | 38–46px (640–740) | Instrument Sans (mostly) / Inter (one measured instance) | not fully measured at this tier | 38px/720 "The workflow should move before…"; one 44px/640 instance rendered in Inter, not Instrument Sans — mixed, not unified |
| H2 | 48–56px (600–745) | Instrument Sans | not fully measured | 48px/600, 56px/745 |
| H1 / display | 64–76px (600–760) | Instrument Sans (hero, hero-adjacent) / Inter (one measured 68px/650 instance elsewhere on page) | −3.74px measured at 68px (−5.5%); trend is more negative at larger sizes but only one exact value confirmed — **the full curve is unverified, three points only** | Hero headline "slows your business down." 72px/600, Instrument Sans, exact; a separate 68px/650 headline elsewhere renders in Inter — confirms the family mix is real, not a fallback artifact |

**Letter-spacing trend (partially verified):** three exact points were measured — 22px→
−0.66px (−3.0%), 34px→−1.19px (−3.5%), 68px→−3.74px (−5.5%). Tracking gets more negative as
size grows, consistent with standard fluid-type practice, but the shape of that curve between
those three points is **unverified** — do not treat it as linear without more samples.

**Font stack (measured, from `getComputedStyle().fontFamily`):**
`"Instrument Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", sans-serif` for display/headline elements;
`Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for nav/UI
elements. Instrument Sans is not currently in Asure's stack and per the studio rule must not
be fetched — see Mapping.

---

## 3. Spacing, radii, borders

**Radius census** (`capture_raw.json → radii`, all elements with non-zero `border-radius`,
by occurrence count):

| Radius | Count | Where measured |
|---|---:|---|
| `999px` (pill) | 273 | Dominant — tag pills, CTA-adjacent chips, dots, the nav CTA family, badges |
| `11px` | 82 | Principle-card index chip |
| `12px` | 76 | Numbered chip (both card variants), nav CTA button, step-grid container |
| `50%` (circle) | 72 | Dots, avatar/icon circles, the integration-hub orbit ring |
| `14px` | 42 | — |
| `16px` | 41 | — |
| `10px` | 35 | — |
| `15px` | 25 | Hero stat-metric container, ROI-calculator result cards |
| `18px` | 24 | Mega-menu panel, "Example automation" nested-panel container, principle-card outer |
| `9px` | 22 | — |
| `20px` | 21 | Grid-card variant of the numbered card |
| `24px` | 10 | Featured numbered card, ROI-calculator outer card |

No shared radius token: featured cards use 24px, their grid-size sibling uses 20px, nested
panels inside them use 18px, chips inside those use 12px — a nesting rule (each level nests
at roughly −4 to −6px from its parent) rather than a fixed set, though it is not perfectly
regular across the whole site.

**Border census** (top by occurrence, `capture_raw.json → borders`):

| Border | Count | Where |
|---|---:|---|
| `1px solid #E8EAF0` | 130 | Light-section hairline (nav, mega-menu, principle-card, light numbered-card) |
| `1px solid #2A2E38` | 53 | Dark-card hairline (numbered card, grid card) |
| `1px solid rgba(255,255,255,.07)` | 43 | Nested-panel-on-dark hairline |
| `1px solid rgba(18,19,24,.08)` | 25 | ROI-calculator outer-card hairline (light) |
| `1px solid rgba(130,120,255,.12–.16)` | 30 (combined) | Accent-tinted border — integration-hub node rings, focus-adjacent panels |

**Padding, by measured component** (all exact, `component_styles3.json`):

| Element | Padding |
|---|---|
| Nav bar (`.avn-bar`) | `0 48px` |
| Mega-menu panel | `12px` |
| Featured numbered card | `38px` |
| Grid-size numbered card | `26px` |
| Nested "example automation" panel | `28px` |
| Tag pill | `0 10px` |
| Nav CTA pill | `0 15px` |
| Principle card | `24px` |
| ROI-calculator input panel | `32px 32px 34px` |
| ROI-calculator output panel | `32px` |
| Hero stat-metric block | `15px 16px` |

**Gaps:** featured-card two-column body grid `24px`; nested-panel step-chip column `14px`;
industry-card flow-grid (4-up chips) `7px`; grid-card internal vertical stack `30px`; trust-row
item gap `12px 20px` (row/column); trust-row icon-to-text gap `7px`.

**Hairline discipline:** on dark, the softest divider is `rgba(255,255,255,.035)` (barely
visible, used only inside already-bordered nested panels — a hairline within a hairline);
the standard dark card border sits at `rgba(255,255,255,.07)` or the solid `#2A2E38`. On
light, there is effectively one hairline value, `#E8EAF0`, reused everywhere. This matches
Asure's own light.css comment ("hairlines, never boxes") almost exactly in spirit, though
aiveloft does use filled card backgrounds (not hairline-only like Asure's Dala reference) —
the hairline sits on TOP of a filled surface here, not instead of one.

---

## 4. Component inventory

### 4.1 Numbered section card (featured + grid variants)

**Role:** The load-bearing content unit of the whole "Solutions"/"Industries" sections — a
numbered chip, small-caps eyebrow, heading, body, then either a tag-pill row or (featured
variant only) a nested flow panel.

Two explicit size classes were measured, both on the dark base (`#111318`):

| Property | Featured (e.g. "01 · Workflow Automation") | Grid (e.g. "02 · AI Agents") |
|---|---|---|
| Card background | `#181B22` | `#181B22` |
| Card border | `1px solid #2A2E38` | `1px solid #2A2E38` |
| Card radius | `24px` | `20px` |
| Card shadow | `0 24px 70px rgba(0,0,0,.16)` | none |
| Card padding | `38px` | `26px` |
| Card layout | 2-col grid, `24px` gap (copy left, nested flow-panel right) | flex column, `30px` gap |
| Numbered chip | `38×38px`, radius `12px`, bg `rgba(94,99,232,.13)`, text `#9B97FF` 11px/800, tracking `.44px` | identical — same chip reused verbatim across both sizes |
| Eyebrow | `#9DA3B0`, 10px/800, tracking `1.2px`, uppercase, `18px` margin-top from chip | identical |
| Heading | `34px/730`, Instrument Sans, `#FFFFFF`, tracking `−1.19px`, line-height `36.04px` | `22px/720`, tracking `−0.66px`, line-height `23.76px` |
| Description | `14px/400`, `#9DA3B0`, line-height `22.68px` | (not separately measured — same class family) |
| Tag pill | bg `#20242D`, border `1px solid #2A2E38`, radius `999px`, padding `0 10px`, height `30px`, text `10px/620` `#D5D8E0` | same pill component, reused |

The chip/eyebrow/heading skeleton is identical between sizes — only the outer card's radius,
padding, shadow and heading size scale down. This is the single most reusable pattern on the
site and the best TAKE candidate (see §7).

A third, lighter-weight variant of this same skeleton exists on **light** backgrounds for the
Industries section (`.aiv-industry-card`, e.g. "01 · Agencies") — card width measured `545px`,
height `583px` at this viewport; visually identical numbered-chip-plus-eyebrow-plus-heading
opening, then a "TARGET OUTCOME" label/value pair, then a nested flow-grid panel identical in
concept to §4.2 below (4-column, `108px` cells, `7px` gap, measured `453×76px`), then a tag
pill row. Colours for this light variant were not individually re-measured (time-boxed); it
inherits the same tag-pill and chip treatment recoloured for a light ground per the general
light/dark alternation, and should be treated as **unverified in exact hex** even though its
existence and layout are confirmed both by screenshot and by the `.aiv-industry-flow-grid`
computed style capture.

### 4.2 Nested "example flow" panel (the ⊙ ORCHESTRATED badge + 01→04 steps)

**Role:** A self-contained mini-diagram nested inside the featured numbered card, showing a
4-step automation flow. This is the panel visible at top-right of the first dark "Workflow
Automation" card in `strip_a.png`.

Panel container: bg `#20242D`, border `1px solid rgba(255,255,255,.07)`, radius `18px`,
padding `28px`, measured `501×309px` at this width (i.e. exactly half the featured card's
inner width — a true two-column split, not an eyeballed one).

Header row: `display:flex; justify-content:space-between; gap:14px; margin-bottom:18px`.
Left side, "Example automation" label: `11px/700`, `rgba(255,255,255,.82)`. Right side, the
status badge — **measured via inline `style=` attribute, exact, not computed-style-derived**:

```
display:inline-flex; align-items:center; gap:6px; min-height:25px; padding:0 9px;
border-radius:999px; background:rgba(94,99,232,.10); color:#C7C9FF;
font-size:10px; font-weight:750; letter-spacing:.06em; text-transform:uppercase;
```
plus a `5×5px` filled dot (`border-radius:999px; background:#5E63E8`) before the text. The
DOM text is lowercase `"orchestrated"` — the visible "ORCHESTRATED" is pure CSS
`text-transform:uppercase`, which is why a case-insensitive text search initially missed it:
the source string never contains the capitalised form. (The brief's "⊹" glyph description
reads, on 4× crop, as a small solid circle, not a diamond/asterisk — see `badge_zoom.png`.)

Step grid: bg `rgba(255,255,255,.035)`, border `1px solid rgba(255,255,255,.07)`, radius
`12px`, padding `12px`, flex-column, `14px` gap, cell width `~116px`, cell height `~32px`
(2×2 in the featured card, matching the screenshot's "01→02 / 03→04" layout). Each step:
number label (`10px/800`, `#9B97FF`, no letter-spacing measured) above a status word
(`10px/760`, `rgba(255,255,255,.55)`, tracking `.7px`) — e.g. "01" / "CAPTURE".

The industry-card variant of this same panel (§4.1, light-section) reduces the step grid to a
flatter 4-across `108px`-column layout rather than 2×2 — confirmed by computed style
(`gridTemplateColumns: 108px 108px 108px 108px`, gap `7px`) but not individually re-specced
for colour (see note above, unverified exact hex on that variant).

### 4.3 Stat block

**Role:** A labelled figure — used in the hero (two blocks: "38h SAVED / WEEK", "24/7
WORKFLOW ACTIVE") and, at larger scale, in the ROI-calculator result panel (four blocks:
weekly/monthly/annual/days figures).

Hero variant, measured exact: container bg `rgba(248,249,252,.92)`, border
`1px solid rgba(17,19,24,.07)`, radius `15px`, padding `15px 16px`. Value: `23px/650`,
`#111318`, tracking `−0.92px`, line-height `23px` (i.e. line-height equals font-size — tight,
numeral-only). Label not individually captured by selector but confirmed by screenshot as a
small uppercase caption beneath the value, consistent with the 9–10px micro-label tier in §2.

No corner icon was found on the hero variant specifically (the brief's spec mentions one) —
the ROI-calculator's four result blocks DO carry a small corner icon per the screenshot
composite (clock/calendar/currency glyphs), but their computed styles were not individually
captured; **treat "corner icon" placement/size as visually confirmed, not measured**.

### 4.4 Navigation

**Role:** Fixed-position white glass bar floating over the (usually dark) page, full-width,
`76px` min-height, with a mega-menu system and a pill CTA.

Measured exact from source CSS (`raw_style_tags.css`, `.avn-*` block, not computed styles —
this section is hand-authored):

- Bar: `min-height:76px; padding:0 48px; gap:20px; background:rgba(255,255,255,.96);
  border-bottom:1px solid #E8EAF0; backdrop-filter:blur(18px)`.
- Logo: inline-flex, `10px` gap, `#111318`, `13px/780`, tracking `.12em`, plus a `9×9px`
  dot (`#5E63E8`) with a `0 0 0 5px rgba(94,99,232,.10)` halo ring.
- Top-level link: `min-height:76px` (full-bar hit target), `padding:0 8px`, `#656B78` default
  → `#111318` on hover/focus, `12.5px/590`, transition `color 160ms ease`. A `10px` chevron at
  `opacity:.55` rotates 180° on hover, `160ms ease`.
- Mega-menu panel: `560px` wide (`calc(100vw - 48px)` max), `12px` padding, border
  `1px solid #E8EAF0`, radius `18px`, bg `rgba(255,255,255,.99)`, shadow
  `0 22px 60px rgba(18,23,38,.12)`; opens with `opacity 150ms ease, transform 170ms ease`
  from `translate(-50%,-6px)` (or `translate(0,-6px)` for the first two menus, which
  left-align instead of centering, to avoid viewport overflow — a measured, deliberate detail).
- CTA pill ("Book an Automation Audit"): `min-height:42px`, `padding:0 15px`, radius `12px`,
  bg `#5E63E8`, `1px solid transparent`, `#FFFFFF` text `12.5px/670`, shadow
  `0 8px 22px rgba(58,64,180,.18)`; hover = `translateY(-1px)` + `brightness(.97)` + a larger
  shadow, transition `transform 160ms ease, box-shadow 160ms ease, filter 160ms ease`.

### 4.5 Trust row

**Role:** The `✓ item ✓ item ✓ item` line directly under the hero CTAs.

Measured exact: `display:flex; gap:12px 20px; margin:42px 0 0` (row/column gap and top offset
from the CTA row above it), text `13px/400`, `#5F6472`, line-height `18.2px`. Each item:
`display:flex; gap:7px`, checkmark glyph `13px/700`, `#5654D8`, same line-height as the text
it sits beside. DOM text confirmed verbatim: `"✓Workflow-first systems✓Human oversight built
in✓Measured outcomes"` — the checkmark is a literal `✓` character, not an icon font or SVG.

### 4.6 Three-up numbered principle cards

**Role:** The "01 Baseline / 02 Estimate / 03 Validate" row near the foot of the page —
`.avp-card`, on a light section.

Measured exact: card bg `#F7F7F9`, border `1px solid #E8EAF0`, radius `18px`, padding `24px`,
flex-column, measured `267×271px` at this viewport (three-up in a `~900px` row). Index chip:
`38×38px`, radius `11px` (note: `11px`, not the `12px` used by the dark numbered-card chip —
a measured, real difference between the light and dark chip treatments, not restated from
memory), bg a very light indigo tint (computed as `color(srgb .939 .946 .992)` ≈ `#EFF1FD`),
text `#5654D8`, `11px/600`, line-height `11px`. Card content confirmed by `innerText`:
`"01 / Workflow-first / Map the process, handoffs, exceptions, and bottlenecks before
choosing the automation."` — i.e. number, then a short bold label, then one sentence of body
copy. No icon beyond the numeral was found on this component.

### 4.7 Two-panel calculator

**Role:** The ROI/opportunity calculator — light control side, dark result side, exactly as
the brief described; confirmed both visually (`strip_a.png`) and via computed style on the
actual grid children.

Outer card (`.avroi-calculator`): bg `#FFFFFF`, border `1px solid rgba(18,19,24,.08)`, radius
`24px`, shadow `0 24px 70px rgba(18,19,24,.08)`, CSS grid with two columns measured
`518px` / `660px` at this viewport (not a round fraction — roughly 44/56), total `1180×798px`.

Left column (`.avroi-inputPanel`): bg `#FFFFFF` (same as outer — no visible seam on this
side), padding `32px 32px 34px`. Contains three labelled range sliders ("Manual hours /
person", "Blended hourly cost", "Potentially automable"); slider label measured `13px/620`,
`#121318`. Slider track height computed at `24px` (hit-target sizing, not visual track
thickness); `accentColor` reads `auto` in computed style meaning the colour comes from a
custom-styled thumb/track rather than the browser default, but the exact custom colour value
was not individually captured — **unverified exact hex on the slider thumb/track fill**,
confirmed only that it is not left as browser default by visual inspection of `strip_a.png`
(indigo thumb, indigo fill-to-value).

Right column (`.avroi-outputPanel`): bg `#111216` (measured — distinct from both `#111318`
and `#121318` used elsewhere; the calculator has its own near-black), padding `32px`. Contains
the big result numeral ("155 hours"), a 2×2 stat-block grid (weekly/monthly/annual/days,
matching §4.3's pattern at a slightly different scale), and an "AUTOMATION OPPORTUNITY" bar
with a short description. Individual stat-cell styling inside this panel was not separately
re-measured beyond confirming the same `rgba(255,255,255,.04)` bg / `rgba(255,255,255,.06)`
border / `15px` radius family used by the hero stat block's dark-mode sibling.

---

## 5. Band rhythm

**Measured directly** — every `<section>` element's own `background-color` plus its `top`
offset (`getBoundingClientRect().top + scrollY`), in DOM order, full page:

| # | Section (first heading) | Background | Top (px) | Height (px) |
|---|---|---|---:|---:|
| 1 | Hero — "Automate the work that slows your business down." | `#F7F8FA` | 77 | 823 |
| 2 | "Reliable automation should be observable…" | `#FFFFFF` | 900 | 1059 |
| 3 | "Manual work quietly taxes every customer journey." | `#F7F8FA` | 1959 | 1061 |
| 4 | "AI systems built around the work that actually needs to move." | `#111318` | 3020 | 1577 |
| 5 | Solutions — "Automation that moves the metrics that matter." | `#F7F8FA` | 4596 | 1772 |
| 6 | Industries — "Different operations. Same need for reliable flow." | `#111318` | 6368 | 1903 |
| 7 | "Replace operational drag with a workflow that keeps moving." | `#F7F7F9` | 8271 | 1304 |
| 8 | ROI calculator — "See what operational drag is really costing you." | `#F7F7F9` | 9575 | 1575 |
| 9 | Case study — "See the system behind the operational result." | `#111216` | 11150 | 1828 |
| 10 | Integrations — "Connect the tools you already use…" | `#F7F7F9` | 12979 | 1621 |
| 11 | "From operational friction to a system your team can trust." | `#111318` | 14600 | 1976 |
| 12–15 | Reliability/model/measurable/CTA cluster | `#F7F8FA`→`#111318`→transparent→`#FFFFFF` | 16577–18357 | — |
| 16 | Testimonials | `#F7F7F9` | 18618 | 1383 |
| 17 | Comparison | `#111216` | 20002 | 1924 |
| 18 | Pricing | `#F7F8FA` | 21925 | 2136 |
| 19–20 | Pricing footer / commercial panel | transparent → `#111318` | 23182–23545 | — |
| 21 | "Find the workflow worth fixing before choosing the tool." | `#111216` | 24061 | 1500 |
| 22 | Insights/blog teaser | `#F7F7F9` | 25562 | 1604 |
| 23 | FAQ | `#F7F8FA` | 27165 | 1889 |
| 24 | Final CTA (lead-gen form) | `#111318` | 29054 | 1025 |

**The bleed technique, confirmed by direct pixel inspection** (`seam_light_to_dark.png`,
cropped 100px straddling the section-3→4 boundary at y≈3020): the transition is a **hard flat
colour cut with zero gap, zero border, zero gradient fade**. Each `<section>` is full
viewport-width with its own solid `background-color` and no top/bottom margin; the next
section's top offset is exactly the previous section's `top + height` in every measured case
above (e.g. section 2 ends at `900+1059=1959`, section 3 starts at exactly `1959`). There is
no shadow, divider line, or blur at any boundary. The only decoration that touches a
background is an internal, *contained* radial-gradient "glow" blob
(`radial-gradient(circle, color-mix(in srgb, var(--accent) 17%, transparent) 0%, transparent
68%)`, `min(400px,88%)` wide, `border-radius:50%`, `position:absolute` inside the section) —
this sits inside a section's own stacking context and never crosses into the next section.

This directly answers the standing complaint that Asure's own bands "do not bleed": aiveloft's
bleed is not a special effect, it is the **absence** of section-level padding/margin/border —
each section is a plain full-bleed block; the "band" feeling comes entirely from the sheer
count of alternations (24 sections, light/dark flipping roughly every 1–2 sections) plus
generous internal vertical padding (each section's own top/bottom content padding, typically
`88–120px`, was visible in the screenshot crops but not individually re-measured per section —
**the per-section internal padding value is unverified as a single number**; it visibly varies
section to section).

---

## 6. Motion

All values below are quoted directly from `raw_style_tags.css` (`@keyframes` blocks and
`animation:`/`transition:` declarations) — measured, not estimated.

**Scroll-triggered entrance.** Each major hand-authored section ships its own named keyframe
(`avhEnter`, `avhPanelEnter`, `avbaFade`, `avcmpFade`, `avinsFade`, `avosFade`, `avtestFade` —
seven distinct entrance animations were found, one family per component). The two hero ones,
quoted exactly:

```css
@keyframes avhEnter { from { opacity:0; transform:translateY(16px) }
                       to   { opacity:1; transform:translateY(0) } }
@keyframes avhPanelEnter { from { opacity:0; transform:translateY(18px) scale(.985) }
                            to   { opacity:1; transform:translateY(0) scale(1) } }
```
applied as `animation: avhPanelEnter .82s .08s cubic-bezier(.2,.8,.2,1) both` on the hero's
right-side automation-flow panel — **820ms duration, 80ms delay, `cubic-bezier(.2,.8,.2,1)`**
(an ease-out-expo-family curve — starts fast, decelerates hard). Other sections use plainer
timing: `animation: avbaFade 240ms ease both`, `avosFade 220ms ease both`,
`avinsFade 230ms ease both` — all in the 220–240ms range with plain `ease`, no delay, no
custom bezier. **The hero gets bespoke motion treatment; everything else gets a fast, cheap
fade.** This two-tier approach (one hero moment, everything else utilitarian) is worth naming
explicitly as a TAKE-able discipline, not just a number to copy.

**Hover / focus micro-interactions.** 34 distinct `transition:` declarations were found,
overwhelmingly in the `150–260ms`, plain-`ease` range (`ease` appears 112 times vs. 1 custom
`cubic-bezier` outside the hero). Representative, quoted: nav CTA
`transform 160ms ease, box-shadow 160ms ease, filter 160ms ease` (hover =
`translateY(-1px)` + `brightness(.97)` + larger shadow); nav link `color 160ms ease`; nav
chevron `transform 160ms ease` (rotates 180°); mega-menu open `opacity 150ms ease,
transform 170ms ease`.

**Ambient/looping motion**, all quoted exactly:
- Live-status dot: `background:#34A567; animation: avhPulse 1.8s ease-in-out infinite`, where
  `avhPulse` goes `opacity:.35 scale(.85)` → `opacity:1 scale(1)` → back, at the 50% keyframe
  (a breathing pulse, not a blink).
- Integration-hub connector lines: `animation: avintDash 7s linear infinite` (a dashed-line
  "flow" animation, `stroke-dasharray`-style).
- Integration-hub orbit ring: `animation: avintOrbit 24s linear infinite` on a
  `border:1px dashed rgba(130,120,255,.20)` circle around the hub icon.

**What was not measured:** the exact `avintDash`/`avintOrbit` keyframe bodies (rotation degrees
/ dash-offset values) were located by name and duration but not individually transcribed —
**label as unverified** beyond "linear, 7s and 24s respectively, looping." Scroll-linked
(as opposed to time-based) reveal triggering — i.e. whether these fire via
`IntersectionObserver` at a specific viewport threshold — was not instrumented; only the
CSS-side animation definitions were captured, not the JS trigger logic, since that logic is
non-trivial to extract from the site's bundled Framer runtime without materially more time.
Confirmed only that content **does** progressively fade/rise in as you scroll (observed
directly while scroll-walking the page for the screenshot capture) — the *mechanism* is
unverified.

---

## 7. TAKE vs. LEAVE

Surya's `PRODUCT.md` names "a generic SaaS landing page" as anti-reference #1, and aiveloft
**is** one by genre — it has a pricing table (`.ap-*`, section 18 in the band table), a
testimonial row (`.avtest-*`, section 16), an "Automation Audit" CTA-as-primary-ask threaded
through nav/hero/footer, a FAQ accordion, and a lead-gen final-CTA form. None of that is craft;
it's the template. Splitting explicitly, as instructed:

### TAKE

- **The numbered-card system** (§4.1): chip → eyebrow → heading → body → pill/checklist, at
  two consistent size classes sharing one skeleton. This is the single strongest transferable
  pattern — it already matches the EvolveLab rule Asure works to (one strong thing per card,
  modifier below it) more precisely than most of what's on our own site today.
- **The nested-panel pattern** (§4.2): a visually distinct, slightly-lighter surface floating
  inside a card, with its own header row and its own hairline — gives cards a sense of depth
  without ever using a drop shadow inside dark content.
- **Hairline discipline on both grounds** (§3): one light hairline value reused everywhere,
  a graded dark-hairline system (`.035` inside `.07` inside solid `#2A2E38`) rather than one
  flat dark-border value everywhere.
- **The stat-block shape** (§4.3): tight numeral (line-height = font-size, no slack), small
  caption below, contained in a barely-there tinted panel.
- **Full-bleed band rhythm with zero seam decoration** (§5): the actual technique — no
  padding/margin between sections, no gradient fade at the join — is simple and directly
  fixes the complaint about Asure's own bands not bleeding. This is the highest-value single
  takeaway in this document.
- **Two-tier motion budget** (§6): one bespoke, slower, custom-eased entrance for the hero;
  everything else a fast (~220ms) plain-ease fade. Cheap to build, reads as intentional
  because the ONE expensive moment is spent where it's seen first.
- **The two-panel light/dark calculator split** (§4.7) as a *pattern* — light input side,
  dark result side, single rounded outer card — independent of what it calculates.

### LEAVE

- **The genre furniture**: the pricing table section, the testimonial row, the "Book an
  Automation Audit" framing repeated in nav + hero + footer, the FAQ accordion, the
  lead-gen final-CTA form. These are exactly what puts a site on Surya's anti-reference list.
- **Invented/unsourced metrics as a pattern**, not just the specific numbers. `38h saved/week`,
  `$68,088`, `24/7`, `65%` automable — these are calculator OUTPUT (user-entered sliders
  produce them) in the ROI tool, which is legitimate there, but the same confident-figure
  *habit* also shows up as static hero/stat-block copy elsewhere on the page with no visible
  sourcing. Asure's rule — no number without a file behind it — rules out copying either the
  specific figures or the pattern of presenting a figure with no citation affordance.
  Copy the STAT BLOCK SHAPE (§4.3), never a stat block's content.
  Asure's `TOOL_SHOWCASE_IMAGE_GUIDE.md` / DESIGN_BRIEF.md rule against fabricated evidence
  applies here directly.
- **The near-duplicate base-colour drift** (three near-black hexes, two near-white hexes,
  §1) — this reads as an authoring accident, not a system; don't reproduce the drift, pick one
  value per role and hold it.
- **Instrument Sans + variable-weight axis** as a literal typeface choice (see Mapping below
  for the substitution) — Asure's stack is vanilla/no-build/no-external-fonts; fetching a
  second Google font contradicts that rule outright.

---

## 8. Mapping to Asure's existing tokens

Asure's actual governing tokens (not the separate `Dala`-reference `DESIGN.md` at the site
root, which documents a different site's own extraction and should not be confused with
"our" tokens): `assets/css/theme.css` sets the base palette and is overridden, band-for-band,
by `assets/css/light.css` (loads later, applies unconditionally to all three `:root`
selectors including `[data-theme="dark"]`, and is what the site currently renders under) and
finally by `assets/css/site-chrome.css` (loads last, owns the type-scale re-point at
`:root{ --t-cap…--t-xl }`, values `10·11·12·14·16·19·22·27·38·60·92`).

| Reference (aiveloft) | Nearest Asure token | Match quality |
|---|---|---|
| `#111318` / `#121318` / `#111216` (dark bases) | `--bg:#0A0D18` (theme.css dark) | Close family (near-black indigo-tinted), not identical — Asure's is a touch bluer/darker |
| `#9B97FF` (accent, light-on-dark) | `--violet-300:#A89BFF` (theme.css) | Very close, both light-indigo-on-dark accents |
| `#5E63E8` / `#665CFF` (accent, mid/saturated) | `--accent:#6A3FE0` (light.css) *or* `--violet-500:#7C5CFF` (theme.css) | Two candidates exist in Asure's own system already (see note below) — `#6A3FE0` is closer in saturation/hue to `#665CFF`; `#7C5CFF` is closer in lightness to `#5E63E8` |
| `#5654D8` / `#4F46E5` (accent, deep) | `--accent-deep:#5B2FD6` (light.css) | Close — same deepening role |
| `rgba(94,99,232,.10–.13)` (accent-soft tints) | `--accent-soft:#F1ECFE` (light.css) — but that's a flat hex, not an alpha-over-dark | **Gap** — Asure has no alpha-over-dark accent-soft token; see proposal below |
| `#E8EAF0` (light hairline) | `--line:#E8EBF1` (light.css) | Match, effectively identical (1-unit rounding) |
| `#2A2E38` / `rgba(255,255,255,.07)` (dark hairline) | `--line:rgba(255,255,255,.07)` (theme.css dark) | Exact match on the alpha value; theme.css's dark `--line` is literally the same number |
| `#181B22` (raised dark card) | `--surface:#141A2E` (theme.css dark) | Close family, Asure's runs slightly more blue/purple |
| `#20242D` (nested-panel-on-dark) | `--surface-2:#1A2138` (theme.css dark) | Close family, same relationship (one step up from card) |
| `#F7F8FA` / `#F7F7F9` (light paper-2, two drifting values) | `--paper-2:#F7F8FB` (light.css) | Match — and Asure's own single, disciplined value is the fix for aiveloft's drift (see LEAVE) |
| `#0E1116`-equivalent ink (aiveloft has no single one; nearest is `#111318` used for text-on-light) | `--ink:#0E1116` (light.css) | Close |
| `#34A567` (success green) | none present | **Gap** — Asure's palette has `--emerald-500:#10C28B` (theme.css) as the nearest existing green; not identical but same role available already, no new token needed |
| Instrument Sans (display) | none — not in stack | **Do not add.** Use `--f-sans:'Inter',...` at heavier measured weights (730/760-equivalent snaps to Inter 700 or 800, the nearest static cuts Asure already loads) for the same "big, confident numeral" effect aiveloft gets from a second family. The *effect* (numerals reading distinct from body copy) is achievable with Inter 800 + the tight line-height/negative-tracking pattern from §2, without a second font file |
| Variable-weight axis (560…780) | Asure's Google-Fonts `@import` in theme.css loads Inter static cuts 400/500/600/700/800 only | **Cannot replicate exactly.** Snap every measured weight to the nearest available static cut: 560→500 (borderline, consider 600), 590–650→600, 680–750→700, 760–800→800. This loses the fine-grained dial aiveloft has but stays inside Asure's "no build step, no external fonts beyond what's declared" rule |
| `999px` pill radius | `--r-full:999px` (theme.css) | Exact match, token already named identically |
| `24px` / `20px` / `18px` / `12px` card-nesting radii | `--r-xl:28px` / `--r-lg:20px` / — / `--r-md:14px` (theme.css) | `--r-lg:20px` matches the grid-card radius exactly; the featured-card `24px` and nested-panel `18px` fall **between** Asure's existing steps (`--r-lg:20px` and `--r-xl:28px`) — no new token strictly required, round to the nearest existing step (`24px→--r-xl` rounds down awkwardly; recommend using `20px`/`--r-lg` for both featured and grid cards rather than adding a step) |
| `160–260ms ease` hover transitions | `--t-fast:160ms` / `--t-med:220ms` (theme.css) | Exact match — Asure's own fast/medium tokens already sit exactly where aiveloft's measured hover timing sits |
| `cubic-bezier(.2,.8,.2,1)` hero entrance | `--ease-out:cubic-bezier(.16,1,.3,1)` (theme.css) | Different curve (aiveloft's decelerates less aggressively at the tail) but same *family* of ease-out-expo; Asure's existing `--ease-out` token covers the same job, no new easing needed |

**Smallest proposed addition** (only where a real gap exists, not a hex adoption): an
alpha-over-surface accent-soft variant for dark mode, since `--accent-soft:#F1ECFE` (light.css)
is a flat colour with no dark-mode equivalent and aiveloft's badge/chip fills depend on the
tint reading correctly over an already-dark card. Proposed, using Asure's own accent value
(not aiveloft's hex):

```css
:root[data-theme="dark"]{ --accent-soft-dark: rgba(124,92,255,.13); } /* --violet-500 at .13α, matching aiveloft's measured .10–.13 alpha range on its own accent */
```

No other new tokens are proposed — every other measured value in this document rounds
cleanly onto something Asure already has.

---

## Appendix — files in `_design/ref/`

`full.png`, `strip_a.png`, `band0.png`…`band3.png` (screenshots); `raw_style_tags.css` (413KB
authored CSS, all 25 `<style>` tags); `capture_raw.json` (histograms + scale samples);
`component_styles3.json` (final per-component computed-style capture used for §4);
`anchor_chains.json` (nav-vs-content disambiguation); `text_leaves.json` / `textSample`
(raw text-node dump, includes the discovery that `.avn-*` etc. are literal authored CSS
classnames, not Framer-generated hashes); `seam_light_to_dark.png`, `seam_dark_to_light.png`,
`badge_zoom.png` (targeted crops used as direct visual evidence in §5 and §4.2);
`comp2_out.txt` (intermediate script output, kept for traceability).
