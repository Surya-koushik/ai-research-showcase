# GATES — ui-common-mistakes skill build + full-site UI audit

Task: (1) read three sources, (2) build a reusable `ui-common-mistakes` skill,
(3) audit all four pages of AI_Research_Showcase with measurement, (4) write UI-REVIEW.md.
Mode: solo (tree depth 3). Written before real work started, 2026-08-26. Closed 2026-08-26.

LEDGER: **33 of 33 checked. 0 abandoned.**
(3 + 8 + 1 + 11 + 7 + 1 + 2 across G1-G7. Counted by `grep -c '^- \[x\]'`, not from memory —
a first pass of this line said "31" from recollection and was wrong.)

---

## G1 — Sources read
- [x] G1.1 Source A (Lesson 18, 11 mistakes) enumerated and mapped into the skill checklist.
  CHECK: `grep -o 'L18-[0-9]*' SKILL.md | sort -u | wc -l`
  EXPECT: 11
  EVIDENCE: **11** unique tags present — L18-1…L18-11, all accounted for (40 total mentions).
  (Gate originally specified `grep -c "Lesson 18"`; implementation uses the tag `L18-n`, so the
  CHECK was rewritten to match. Coverage requirement unchanged and met.)
- [x] G1.2 Source B (CareerFoundry, 10 mistakes) enumerated and mapped into the skill checklist.
  CHECK: `grep -o 'CF-[0-9]*' SKILL.md | sort -u | wc -l`
  EXPECT: 10
  EVIDENCE: **10** unique tags — CF-1…CF-10 (35 total mentions).
- [x] G1.3 Source C (video QZj-kv_so2k) actually watched, no invented content.
  EVIDENCE: **Watchable.** `watch` skill → yt-dlp + native English captions (no Whisper needed).
  "How to NOT Suck at UI Design", channel **Mizko**, **12:29 / 749s**. Six points extracted with
  timestamps; skill carries 6 unique MZ- tags. Real numbers pulled: 9-12 words per line [10:45],
  reduce 4 font styles to 2-3 [10:56].

## G2 — Skill file exists and is genuinely runnable
- [x] G2.1 File exists. CHECK: `test -f .../ui-common-mistakes/SKILL.md` → EVIDENCE: **OK**, 559 lines.
- [x] G2.2 Valid frontmatter. EVIDENCE: opens `---`, `name: ui-common-mistakes`, description fires on
  review/audit/critique/QA/score/build/restyle + "is this UI good". **Confirmed live: the harness
  auto-listed the skill as available mid-session**, i.e. the frontmatter parsed and registered.
- [x] G2.3 Ordered AUDIT PROCEDURE. EVIDENCE: 10 numbered steps (Step 1 scroller → Step 10 pending
  separation), each with an action, not prose.
- [x] G2.4 Every checklist row states HOW TO TEST. EVIDENCE: every row carries a **THRESHOLD:** line
  with a number (>12 sizes, >4 radii, 4.5:1, 44px, Δ<40, 80ch, α≥0.25). No "looks fine" anywhere.
- [x] G2.5 >= 6 runnable browser snippets. CHECK: `grep -c '```js'` → EVIDENCE: **27**.
  Includes contrast-with-alpha-compositing + screenshot-pixel ground-truthing, font-size/weight
  census, radius census, shadow census, sub-44px targets, colour-alone detection, CVD simulation,
  CSS state-rule audit, focus-into-hidden-content, icon optical stroke.
- [x] G2.6 Severity scale + scoring rubric, deterministic. EVIDENCE: S1-S4 + PENDING table;
  10 categories × 10 pts = 100; explicit weights S1=-4 S2=-2 S3=-1 S4=-0.5, floored at 0;
  overall = mean of pages minus 2 per systemic S1; 5 named bands.
- [x] G2.7 Every rule cites its source. EVIDENCE: 27 unique tags used (L18-1..11, CF-1..10, MZ-1..6)
  plus sub-tags; source table at the top; "A rule with no tag is not in this skill."
- [x] G2.8 States it runs on every UI build or review. EVIDENCE: in the `description` frontmatter AND
  as a bolded STANDING RULE in the body's second paragraph.

## G3 — Registry
- [x] G3.1 Row appended to MASTER_SKILLS.md.
  CHECK: `grep -c "ui-common-mistakes" MASTER_SKILLS.md` → EXPECT >= 1 → EVIDENCE: **1**.
  Row at line 123, "Studio Ops Skills (Asure-built)" table, columns Skill|Purpose|Install|Added,
  date 2026-08-26. Registry backed up first to scratchpad before edit. Table structure verified
  intact (lines 118-125).

## G4 — Audit executed with real measurement
- [x] G4.1 All FOUR pages at 1440x900 AND 390x844.
  EVIDENCE: **8 records** — index/tool_template/h10/tool_phoenix × desktop/mobile. All four URLs
  returned HTTP 200 before the run. Plus 3 verification passes (audit2.py, audit3.py).
- [x] G4.2 Reveal handling correct; opacity measured, not class.
  EVIDENCE: `.a-view` stepped-scrolled on desktop (`_scroller: ".a-view"` for index/tool_template/h10),
  `document` on mobile and on tool.html (which has no `.a-view`). Computed opacity read on all
  `.rv` elements: **0 of 119 stuck below 0.5** (91+16+12+0). **Zero false blank-section findings.**
- [x] G4.3 Font-size + font-weight census per page.
  EVIDENCE: distinct sizes 23/17/15/21 desktop, 21/19/16/18 mobile; weights 5/5/5/4;
  size-weight combos 37/23/19/34. Filed as F11.
- [x] G4.4 Radius + shadow census per page.
  EVIDENCE: radii 10/9/9/6 raw; 8/6/8/5 excluding 50% and pills; union 10 values. Shadows 2/1/1/4,
  with the shared token `rgba(16,45,70,0.05) 0 1px 2px` on 3 pages and 3 opaque shadows on tool.html.
  Filed as F12, F13, F14 — and credited in "what's already right".
- [x] G4.5 Contrast ratios computed with the WCAG formula.
  EVIDENCE: 554/72/60/119 text nodes measured on desktop; 485 pass on index, 69 fail reducing to
  8 unique patterns. Body 18.91:1, lede 6.00:1, primary btn 6.18:1, placeholder 4.83:1.
  Failures: kind chips 1.51-4.16, tool h3 2.41, nav-close 1.00, st-production 4.40, .lb 4.32,
  tool spec text 4.18. **Six worst ground-truthed against screenshot pixels** (Pipeline 1.51
  measured vs 1.51 computed; Plugin 3.91 vs 3.92) after finding my first parser silently fell
  back to white on `color(srgb …)` syntax.
- [x] G4.6 Touch targets < 44px enumerated at 390x844 with px sizes.
  EVIDENCE: index 74 under-44 instances; `.toollist a` ×52 at 16.0px, `#search` 22.0px,
  `.ex-tab` ×9 at 38.3px, `.nav-toggle` 40×40, `.nav-close` 32×32, `.nl` 63.4×16.5.
  Passing: `summary` ×52 at 71.3px, `.btn` 48.5px. Filed F9, F21; passes credited.
- [x] G4.7 Interaction states audited from CSS rules; focus-visible determined.
  EVIDENCE: **First walk was wrong and was caught** — Chrome's CSS-nesting gives every CSSStyleRule
  a truthy empty `cssRules`, so `if(rule.cssRules){recurse;continue;}` skipped all 1,225 rules and
  returned hover=0/focusVisible=0. Would have produced a false "no interaction states" finding.
  Rewritten to handle `selectorText` first. Correct result over 1,225 (index) / 1,442 (tool) rules,
  0 parse errors: hover **52/61**, focus-visible **4/7**, focus-only **3/3**, disabled **1/1**,
  **:active 0/0**. Cross-validated by 45 real Tab keypresses: 44 of 45 stops showed a visible
  outline. Filed F8; the working focus system credited.
- [x] G4.8 Keyboard tab order walked: drawer, rail filters, row dropdowns.
  EVIDENCE: 45-stop desktop walk + 12-stop mobile walk. **Drawer: reachable — and that is the bug**
  (16 focusables tabbable while `transform:-306px` and `aria-hidden="true"`, `inert` absent;
  11 of first 12 mobile Tab stops land off-screen). **Rail filters: reachable** (`.ex-tab` stops
  35-43). **Row dropdowns: reachable** (`<summary>` stops 44-45). Escape closes the drawer;
  `aria-expanded` flips; focus does not enter the drawer on open (F20).
- [x] G4.9 Empty / loading / error states.
  EVIDENCE: empty state **triggered live** (typed `zzzzqqqxnotathing`) — renders, 94px,
  counter "0 of 52", copy reads well. Missing `aria-live`/`role` and has no clear-control despite
  its own copy (F7). Loading + error: could not test, reasons recorded in report §5.
- [x] G4.10 Colour-alone signalling; CVD simulated.
  EVIDENCE: CVD run for protanopia/deuteranopia/tritanopia/monochromacy. Collisions found
  (deuteranopia 5, monochromacy 9, normal-vision 1). **Correctly NOT filed as findings** — every
  chip and pill carries a text label; the one bare `.status-dot` (7×7) sits beside the word
  "Production". Only the real defect filed: Dashboard and Connector share `rgb(106,63,224)`, Δ0
  in normal vision (F10).
- [x] G4.11 Icon consistency: outlined vs filled, stroke widths.
  EVIDENCE: index 41 SVGs — outlinedOnly 36, filledOnly **0**, mixed 5 (illustrations).
  Stroke widths 1.7/1.6/2/1px, viewBox `0 0 24 24` throughout, round linecaps. Optical stroke
  computed: 1.7px@15px = **1.06px** vs 2px@18px = **1.50px** (F16). tool.html has 0 SVGs.

## G5 — Deliverable UI-REVIEW.md
- [x] G5.1 File written. CHECK: `test -f UI-REVIEW.md` → EVIDENCE: **OK**, 239 lines.
- [x] G5.2 Rubric shown + overall + per-page for all 4.
  EVIDENCE: rubric table + 10×4 category matrix. index **66.5** (Fair), tool_template **84.5**,
  h10 **85.0**, tool **86.5** (all Good). Overall **80.6/100**, arithmetic shown, 0 systemic-S1 penalty.
- [x] G5.3 Findings table with page, selector, numbered mistake + source, MEASURED evidence,
  severity, specific fix. EVIDENCE: 24 finding rows; `grep` for rows containing no digit returns **0**.
- [x] G5.4 Sorted most-severe first. CHECK: section order → EVIDENCE: S1 (line 72) → S2 (82) →
  S3 (92) → S4 (108). Monotonic.
- [x] G5.5 "What's already right" present and honest. EVIDENCE: §4, lines 134-205 — 72 lines,
  6 themed groups with measured backing (125-131 tokens, 0 horizontal overflow on 8/8 records,
  44/45 focus stops, 0 missing alt on 126 images, 0 positive tabindex, one hue-tinted α0.05 shadow
  token, native `<details>`, correct primary/secondary weighting, text labels defeating CVD).
- [x] G5.6 "Could not test" present with reasons. EVIDENCE: §5, 9 rows each with a reason
  (no screen reader, emulated touch only, loader gone by networkidle, error state out of scope,
  CF-10 relevance is human judgement, 768px untested, print untested, fallback look unjudged,
  cms/login/dist/projects out of scope).
- [x] G5.7 Known-context items filed as PENDING, not defects.
  EVIDENCE: §3 PENDING table — heads' note, H10 embed slot (199px `.embed-slot`, 10 markers),
  contact placeholders, rhino.svg+grasshopper.svg 404 — all excluded from scoring.
  rhino/grasshopper **mentioned exactly once** (§3), not re-litigated.
  Dark theme: `grep -ci` returns 2, both verified legitimate — one explains the *cause* of the chip
  colours ("dark-theme neons on a light chip"), one is the explicit statement that **no dark-theme
  finding is filed**. **0 dark-theme findings rows.**

## G6 — No site files modified
- [x] G6.1 CHECK: `git status --porcelain` → EVIDENCE:
  `?? COPY-REVIEW.md` · `?? UI-REVIEW.md` · `?? gates/`
  All three are untracked additions; **zero tracked files modified, zero deleted**.
  `UI-REVIEW.md` and `gates/ui-audit.md` are mine. `COPY-REVIEW.md` (32,725 bytes, 11:36) was
  written by the **`copy-auditor` agent running in parallel in this session** — not by this task.

## G7 — Report audit
- [x] G7.1 Every number re-measured at write-up time.
  EVIDENCE: all figures re-derived from `audit_raw.json` (435,152 bytes) / `audit2.json` /
  `audit3.json` via sandboxed queries; the score table and the 80.6 overall were **computed in
  code, not by hand**; the eight kind-chip ratios were computed by alpha-compositing rather than
  the by-hand arithmetic I started with, then cross-checked against screenshot pixels.
- [x] G7.2 Ledger pasted with N of N count.
  EVIDENCE: **33 of 33 checked, 0 abandoned** — verified by `grep -c '^- \[x\]' gates/ui-audit.md`
  = 33, `grep -c '^- \[ \]'` = 0, and a scan for unreplaced placeholder evidence lines = 0.

---

## Self-corrections made during the run (recorded, not hidden)
1. **CSS state walk was broken** (truthy empty `cssRules` under CSS nesting) → would have reported
   "no hover, no focus, no states" on a site that has 52 hover rules and a working focus ring.
   Caught by the `ruleCount: 0` sanity signal, rewritten, re-run. Now a documented trap in the skill.
2. **Contrast parser fell back to white** on `color(srgb … / 0.12)` syntax → kind-chip ratios were
   wrong in pass 1. Re-derived by compositing and ground-truthed against real pixels. Now a
   documented trap in the skill.
3. **Two "1.00:1 white-on-white" hits were false positives** — `#navClose` and a "Design Studio"
   span, both inside the off-screen drawer. Pixel-checked before filing. The drawer-open case *is*
   real (F3) and was filed on the verified measurement; the closed-state artefacts were not.
   The skill's contrast snippet now carries an `r.right<0` guard for exactly this.
4. **Hero-over-video was not filed** — screenshot pixels behind all five hero text nodes read
   `rgb(255,255,255)`, so the veil works. Credited instead of filed.
5. **CVD collisions were not filed as findings** — every swatch carries a text label, so the
   collisions cost the user nothing. Credited instead of filed.
