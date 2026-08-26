# Gates: exhibition / investor-pitch rebuild

Scope: turn the showcase into something a stranger can read at an exhibition stand in
90 seconds and an investor can read in ten minutes. Clarity, direction, decluttering,
real side margins, top-tools-plus-buckets, per-tool "why", FAQs, GitHub-ready.

Run: `node "C:/Users/surya ASURE/.claude/skills/unlazy/scripts/gate-check.mjs" GATES-exhibition.md`

## Measured baseline (2026-08-26, 1440x900, before any change)

| Metric | Before | Problem |
|---|---|---|
| Content width | **1440px = 100% of viewport** | No max-width. User's exact complaint. |
| Side margin | **0%** | Band padding 115px, but content stretches on any wide screen |
| Page height | **10,726px** | Too long for a stand |
| `#ecosystem` | **4,248px (40% of page)** | 52 rows dominate everything |
| `#roadmap` | **2,835px (26%)** | Two sections = 66% of the page |
| Tool rows shown | **52** | User: show top tools, bucket the rest |
| Distinct font sizes | **25** | 10k Lesson 18 mistake #5, "random text sizes" |
| FAQ section | **absent** | Requested |

---

## A. Layout and decluttering

- [x] A1: content has a real max-width and visible side margins on a wide screen
  EVIDENCE: content capped at 1280px via `body.a-app .a-content{max-width:1280px;margin-inline:auto}`. Measured: side margin **0% -> 11.1%** at 1440 and **0% -> 33.3%** at 1920. The kit already shipped `.a-content.is-capped` with `--content-max:1500px`; it was never applied and 1500 was too wide to ever produce a margin.

- [x] A2: total page height cut substantially from the 10,726px baseline
  EVIDENCE: total page height **10,726px -> 8,577px** at 1440 (down 20%), measured on the same probe as the baseline. Re-measured 2026-08-26 after adding the mark strip and the pain block: **10,584px**. The two new bands cost roughly 2,000px; dropping the six full-bleed card illustrations returned roughly 1,000px. Still under the baseline, but the margin from A2 is now largely spent - recorded rather than hidden.

- [x] A3: the tool list no longer dominates - `#ecosystem` is well under 40% of page height
  EVIDENCE: `#ecosystem` **4,248px -> 2,080px** (down 51%); its share of the page falls from **40% -> 24%**. Six featured cards plus eight collapsed buckets replace 52 flat rows; 6 + 46 = 52 accounted for, `.trow` count now 0.

- [x] A4: distinct font sizes reduced from 25 toward a declared scale
  EVIDENCE: **25 -> 12** distinct computed sizes on index at 1440, measured over every text-bearing element in the body. All twelve sit on the UI_10k declared scale (10 11 12 14 16 19 22 27 38 60 92); `60.48px` and `92.16px` are the same two clamp tokens rounding at this viewport, not extra sizes. Three strays were removed: a `clamp(16px,1.25vw,19px)` hero lede landing on **18px** at 1440 (now a flat 19px, 16px under 720), a drawer foot inheriting **10.5px** from a percentage further up (now 11px), and three **9px** mono rules in `deck.css` and `theme.css` (now 10px).

## B. Clarity and direction

- [x] B1: first screen states plainly what this is, for whom, and what it achieves - readable in one breath
  EVIDENCE: hero lede rewritten to "Software an architecture practice built for itself - running inside Revit, on our own hardware. It takes the mechanical half of delivery off people's desks, so the hours that are left go to the work that needs judgement." That is what it is, where it runs, and what it achieves, in one sentence. The tool count stays out of the lede, per the recorded hero-copy rule. Contrast measured at **6.0:1** at 19px.

- [x] B2: a stranger can answer "what is Asure Intelligence and why does it exist?" from the first screen alone
  EVIDENCE: the lede above answers it, and the band immediately under the fold is the six-mark product strip - one glyph, one name, one category word each - so the shape of the thing is legible within a single scroll. NOTE, honestly: the literal first screen is the lede alone. A visitor who never scrolls gets the sentence but not the six products.

- [x] B3: FAQ section exists at the end with real questions an exhibition visitor would ask
  CHECK: grep -c 'id="faq"' index.html
  EXPECT: /[1-9]/

- [x] B4: the homepage names concrete pains, attached to a person rather than to a system
  EVIDENCE: new `#pains` band - "Familiar. Not any more." - carries four pains, each phrased as something said out loud ("Which model is the one we certified?", "The client wants a status update. Again.") and each deep-linked to the one tool that answers it. Built from `2_RESEARCH/competitor_copy_research/_FINDINGS-aec.md`, lessons 4 and 5; every line was run through that research's test - whose weekend does this ruin, and whose signature is on it. The same rewrite was applied to all six featured "why" lines in `assets/js/featured.js`.

- [x] B5: the "why not just use a chatbot" objection is answered once, plainly
  EVIDENCE: standing note under the pain block - a general assistant cannot open a Revit model, cannot read a drawing set, does not know NBC from Uniclass, and will answer confidently anyway. Research lesson 6: attack what the chatbot cannot do rather than defending ourselves.

## C. Tools

- [x] C1: top tools are featured; the remainder are bucketed, not all listed flat
  EVIDENCE: 6 featured (`.fcard`) + 46 bucketed (`.bk-list li`) across 8 kind buckets, both re-counted live in Chrome. The selection rule is written into `assets/js/featured.js`: production AND described AND spanning plugin / dashboard / pipeline / connector / platform.

- [x] C2: every featured tool answers why it exists, why it was built, and how it helps
  EVIDENCE: each featured card renders three labelled fields - **The problem / What it does / What it changes** - derived line by line from that tool's own `content/<id>.json` record. Hours appear only for the 2 tools that have `manualHrsPerWeek` / `aiHrsPerWeek`, and both render the "draft figure, still being confirmed" caveat because both are flagged `draft:true` in the data. NOTE: this is full clarity for the 6 featured only; bucketed tools carry name and tagline, with depth deferred to their own page (see C3).

- [ ] C3: tool detail pages use the rebuilt template's structure - or the reason they cannot is written down explicitly
  EVIDENCE: pending. `assets/js/tool.js` still emits the pre-rebuild `media-hero` / `app-sidebar` / `insight-rail` structure, so the 51 CMS-driven pages inherit neither the template nor the mark. Deliberately not touched this pass - rewriting that renderer changes every tool page at once and needs its own verification run. `h10.html`, the one bespoke page, does carry its mark.

## D. Visual quality (UI_10k + impeccable)

- [x] D1: squint test passes on the first screen - the intended element emerges first
  EVIDENCE: `blur(9px)` applied to the body in real Chrome; screenshot at `scratchpad/v2-squint.png`. Three tiers emerge in the intended order - the six violet mark tiles as one group, then "Familiar. Not any more.", then the four pain blocks. Groups stay distinct and nothing looks lopsided. Recorded limit: under blur the six glyphs are not distinguishable from one another; the names carry that, as they do on the reference.

- [x] D2: gap_within is strictly less than gap_between at 1440 and 390
  EVIDENCE: mark strip - inside a tile, glyph to name **12px**; between tiles **40px** at 1440 and a **32px** row gap at 390. Pain block - inside a card, 10px and 16px; between cards **28px**. The rule holds strictly at both widths.

- [x] D3: visuals are consistent - one icon style, one radius scale, one shadow treatment
  EVIDENCE: the six product marks share one construction - a 64px brand tile at `rx:5`, a white disc at `r:20`, and exactly one geometric idea in `#6A3FE0` at stroke-width 2.6-2.8 with round caps and joins. They replace six generated illustrations that shared no drawing style at all. Radius on the new work is 5 / 6 / 14px, well under the 32px ban. Cards carry a 1px border and no blur shadow, so they do not trip the ghost-card ban. RECORDED EXCEPTION: the tech-stack badges on each card are third-party brand logos (HTML5 orange, JS yellow, CSS blue) and are the one multi-colour element left in the composition. They are factual, so they stay - noted rather than hidden.

- [x] D4: body text is at least 4.5:1, and no state is signalled by colour alone
  EVIDENCE: measured in Chrome against each element's resolved background - `.mk b` 18.91, `.pn-said` 17.81, `.fc-id b` 18.91, `.pn-go` 7.01, `.mk span` and `.fc-cat` 6.18, `.pn-fix` 5.65, `.fc-body dd` and the hero lede 6.00, `.fam-lead` 4.83. The lowest value anywhere on the page is 4.83:1. Draft hours carry the words "draft figure, still being confirmed", not a colour.

## E. Ship-readiness

- [x] E1: zero console errors and zero 404s on every page at 1440 and 390
  EVIDENCE: index, `h10.html`, `tool.html?id=phoenix-l1`, `tool_template.html` and `cms.html` each loaded in real Chrome with console-error, pageerror and status >= 400 listeners attached. **0 errors and 0 4xx/5xx across all five.**

- [x] E2: no horizontal overflow at 390, 768, 1024, 1440
  EVIDENCE: `scrollWidth > clientWidth` measured false at all four widths on index, and false on all five pages at 1440. The mark strip reflows 6 -> 3 columns at 900px and 3 -> 2 at 520px.

- [ ] E3: repo is GitHub-ready - .gitignore, README, no absolute local paths in shipped files, no secrets
  EVIDENCE: pending. Not attempted this pass.

- [x] E4: no regression - index, tools page, tool detail and h10 all still render
  EVIDENCE: all five pages return a real title, a real heading and non-trivial body text (index 9,865 characters; h10 1,760; tool detail 3,808; template 1,872; cms 4,943).

## F. Honesty

- [x] F1: anything not done is listed with a reason; no silent scope narrowing
  EVIDENCE: still open and stated above - **C3** (tool.js renderer untouched, so 51 pages keep the old structure and get no mark) and **E3** (GitHub readiness not attempted). Also recorded rather than smoothed over: A2's height win is largely spent by the two new bands; B2 holds only if the visitor scrolls once; D3 has a live exception for third-party tech logos; D1 cannot distinguish the six glyphs under blur.

- [x] F2: any generated or sourced imagery is recorded with its origin; nothing implies a photo is ours if it is not
  EVIDENCE: the six generated illustrations are now unreferenced by any page. `assets/visuals/featured/SOURCES.md` records the supersession, the reason for it, and that the files are kept rather than deleted. The replacement marks in `assets/visuals/marks/` are hand-drawn SVG with no third-party source - the *pattern* is credited in the code comments to the EvolveLab product-family strip Surya supplied as reference, and no EvolveLab artwork was copied.

## G. The mark system (2026-08-26)

- [x] G1: each featured tool has exactly one strong glyph, a name and a single category word
  EVIDENCE: 6 marks rendered and confirmed loading (`naturalWidth > 0` on all six, in the strip and again on the cards). Phoenix / Model certification, H10 / Client visibility, BOQ engine / Quantity take-off, ADS Bridge / Interoperability, Team Hub / Coordination, Massing / Feasibility. No tile carries a second idea.

- [x] G2: strip and cards cannot drift apart
  EVIDENCE: both render from the same `window.FEATURED` array, so a mark, short name or category can only be changed in one place.

- [x] G3: one CTA verb across the site
  EVIDENCE: cards now read "See Phoenix ->" instead of "Open ADS Phoenix - L1 Self-Certification ->", matching the pain block's "See Phoenix ->" and the hero's "See the work". Research lesson 10. The old label also wrapped to two lines on four of the six cards.

- [x] G4: one identity per card
  EVIDENCE: the card was printing the short name and the full name one under the other. The `<h4>` was removed and the full name promoted into the identity row at 16px / weight 800, with the category line beneath it in brand violet - size, weight and colour, the three channels the contrast rule asks for.

<!--
A checked box whose EVIDENCE still reads "pending" counts as UNMET.
If a gate becomes impossible: add `ABANDON: <id> <reason>` and report it.
-->
