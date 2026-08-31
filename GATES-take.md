# Gates: apply DESIGN-aiveloft.md's TAKE list

Scope: apply §7's TAKE list only (numbered-card system, nested-panel, graded hairline
discipline, stat-block shape, seam treatment, two-tier motion budget) to real existing
site content — not new marketing sections. Honour LEAVE absolutely. Two judgement calls:
the `--accent-soft-dark` token, and the type-scale gap. MOTION-IDENTITY.md wins over the
extraction on anything motion-related.

- [x] G1: numbered-card chip + nested-panel pattern applied to a real sequence already on
  the site (the gates-ahead timeline), not invented content
  CHECK: grep -c "ss-criteria" "assets/css/site-chrome.css"
  EXPECT: /[1-9]/
  EVIDENCE: 4

- [x] G2: stat-block tightened to the measured shape (tight numeral, no slack) where it
  was not already
  CHECK: grep -n "tstate-n{" "assets/css/site-chrome.css"
  EXPECT: /line-height/
  EVIDENCE: 322:.tstate-n{ font-size:var(--t-xl,19px); font-weight:800; letter-spacing:-.01em; line-height:1; color:var(--text,var(--ink)) }

- [x] G3: seam treatment reconsidered per §5's "hard cut, zero seam decoration" finding —
  a reasoned keep/drop of the inset-shadow bevel, not a blind copy (manual gate: our bands
  alternate far more subtly than aiveloft's, so a blind zero-decoration copy may not hold)
  EVIDENCE: Dropped the 30px inset-shadow bevel on #ecosystem/#roadmap/#close/#faq/#contact
  (`box-shadow:inset 0 30px 40px -38px rgba(14,17,22,.10)` -> removed). Live-confirmed:
  `getComputedStyle(eco,'::before').boxShadow === "none"` at all 6 widths. Kept the 1px
  hairline (deck.css `.band+.band`) rather than going to true zero decoration, reasoned
  explicitly in the CSS comment: aiveloft measures a stark ~#111318<->#F7F8FA jump at
  every one of its 24 seams (needs nothing else); Asure alternates --bg/--bg-2, a few RGB
  units apart, which is why these sections needed a bleed FIX in the first place -- a jump
  that quiet still wants a marker. Not a blind copy either direction.

- [x] G4: two-tier motion budget applied using MOTION-IDENTITY's own tokens, not
  aiveloft's raw numbers (manual gate — read the diff)
  EVIDENCE: Added `--dur-standard:380ms`, `--dur-slow:600ms`, `--ease-entrance:
  cubic-bezier(.05,.7,.1,1)` as real :root tokens, quoting MOTION-IDENTITY.md's own
  values in the comment, not DESIGN-aiveloft.md's 220ms/820ms. `.rv` (everything-else
  tier) -> --dur-standard/--ease-entrance. `rmapRise` (the one bespoke-slower moment,
  the roadmap convergence labels) -> capped at --dur-slow, not left at the reference's
  820ms or its own prior 900ms.

- [x] G5: `.rv`'s base duration no longer exceeds MOTION-IDENTITY's non-hero ceiling
  (--dur-standard, 380ms) for the general case
  CHECK: grep -n ".rv{" "assets/css/site-chrome.css"
  EXPECT: /380ms|--dur-standard/
  EVIDENCE: Live-confirmed in real Chrome (not just source): `getComputedStyle(rv).
  transitionDuration === "0.38s, 0.38s"`, timing function
  `cubic-bezier(0.05, 0.7, 0.1, 1)` -- matches --dur-standard/--ease-entrance exactly.
  Was .8s (800ms) on deck.css's `:root.js-reveal .rv` before this pass.

- [x] G6: no UI animation left running at 900ms+ (MOTION-IDENTITY: 900ms is film-only,
  never in the UI)
  CHECK: grep -n "rmapRise" "assets/css/site-chrome.css"
  EXPECT: /600ms|--dur-slow/
  EVIDENCE: Live-confirmed: `getComputedStyle(el).animationDuration === "0.6s"` on
  `.rmap-src`/`.rmap-out`. Was .9s (900ms) before this pass.

- [x] G7: token decision recorded and reasoned either way (adopt or skip
  `--accent-soft-dark`), not silently added or silently skipped
  EVIDENCE: Skipped. Looked for a real dark surface that would need an accent-tinted
  chip: the numbered-card system went onto the gates timeline (light ground, matches
  the site's actual register); the nested panel (.ss-criteria) is light-on-light too.
  The one genuinely dark surface on the page, .rmap-out's chip, is a deliberate solid
  near-black backing (`rgba(12,10,22,.62)`) chosen for contrast against a moving canvas,
  not an accent tint, and out of scope to re-theme here. No component this pass built
  needed alpha-over-dark. Team-lead's own instruction was "adopt it if you need it" --
  not needing it is a valid, and more disciplined, answer than adding it speculatively.

- [x] G8: type-scale gap reported honestly — where aiveloft's continuum has no clean
  match in Asure's 11-step scale — without importing new literal sizes
  EVIDENCE: No new literal size introduced this pass (checked: every size used above is
  one of 10/11/12/14/16/19/22/27/38/60/92, or an existing unscaled value like .ss-body h4's
  pre-existing 19px). Real gap found and reported, not fixed silently: aiveloft's stat
  numeral tier runs 20-25px (620-650wt); Asure's scale jumps 19px(--t-xl) -> 22px, with no
  step at 20/21. .tstate-n stays on 19px (an existing choice, not this pass's call to
  revisit) rather than picking 22px and inflating a small in-card badge. Also: aiveloft's
  H4/featured-card tier (28-34px) and H3 tier (38-46px) both fall in the *gap* between
  Asure's 27 and 38 -- a real two-step-wide hole in the scale for anything wanting a
  mid-size heading. Not fixed here (no component this pass needed that size), named for
  whoever next needs a heading between "card title" and "section title."

- [x] G9: LEAVE list honoured — no pricing table, testimonial row, repeated audit-CTA
  framing, FAQ-as-lead-gen, or contact form introduced; no unsourced numbers added
  anywhere (manual gate — read the diff against PRODUCT.md's numbers rule)
  EVIDENCE: Diff touches the gates-ahead timeline (existing roadmap content, reworded
  nothing, restructured only), the stat-block CSS (line-height only, no new copy), the
  seam CSS, and motion tokens/durations. No new section, no CTA, no form, no pricing/
  testimonial/FAQ content anywhere in the diff. Zero new numbers: every figure in the
  gate-criteria panels (70%, 72, ten agents, 60%, five agents) was already on the page
  before this pass -- moved into the new panel markup verbatim, not written new.

- [x] G10: verification table at 390/768/896/1440/1920/2560px — errors, overflow, the new
  components rendering, reduced-motion path holding
  EVIDENCE: Real Chrome, one same-origin iframe per width. All 6: no console errors, no
  horizontal overflow (`scrollWidth <= innerWidth`), `#ecosystem::before` bleed still
  exact and its box-shadow now literally `"none"` (seam bevel dropped, G3), `.ss-criteria`
  count = 5 at every width, `.rv` transition-duration 0.38s at every width. Full table in
  the final report.

- [x] G11: honest read on whether the site now reads as itself or as a copy of the
  reference (manual gate, the one this whole task is graded on)
  EVIDENCE: Reads as itself. No aiveloft hex, no Instrument Sans, no dark base, no pill-
  radius-999 numbered chip at their 38x38 scale, no card-with-shadow treatment for the
  gate cards -- every value used traces to an Asure token (--accent-soft, --line,
  --surface-2, the existing 11-step type scale) or an existing site component
  (.spine/.ss-mark's own dot-and-rail device, kept, not replaced). The craft taken
  (chip+eyebrow-less-heading+nested-panel, graded-by-context hairlines, tight numerals,
  hard seam) is now doing work on content the reference never had (a 4-gate programme
  with a live "where we are" marker) rather than reproducing its shape.

<!--
Rules (full spec in references/gates.md):
- One box per outcome. Boxes are flipped by gate-check.mjs when CHECK output
  matches EXPECT, or by hand for manual gates.
- A checked box with EVIDENCE still reading "pending" counts as UNMET.
- Evidence is the deciding lines only, never a full log.
- If a gate becomes impossible, do not delete it. Add a line:
    ABANDON: G<n> <reason>
  and report it. Visible surrender is honest; silent scope-narrowing is not.
-->
