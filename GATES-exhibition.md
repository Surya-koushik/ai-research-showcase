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
  EVIDENCE: total page height **10,726px -> 8,577px** at 1440 (down 20%), measured on the same probe as the baseline.

- [x] A3: the tool list no longer dominates — `#ecosystem` is well under 40% of page height
  EVIDENCE: `#ecosystem` **4,248px -> 2,080px** (down 51%); its share of the page falls from **40% -> 24%**. Six featured cards plus eight collapsed buckets replace 52 flat rows; 6 + 46 = 52 accounted for, `.trow` count now 0.

- [ ] A4: distinct font sizes reduced from 25 toward a declared scale
  EVIDENCE: pending

## B. Clarity and direction

- [ ] B1: first screen states plainly what this is, for whom, and what it achieves — readable in one breath
  EVIDENCE: pending

- [ ] B2: a stranger can answer "what is Asure Intelligence and why does it exist?" from the first screen alone
  EVIDENCE: pending

- [ ] B3: FAQ section exists at the end with real questions an exhibition visitor would ask
  CHECK: grep -c 'id="faq"' index.html
  EXPECT: /[1-9]/

## C. Tools

- [x] C1: top tools are featured; the remainder are bucketed, not all listed flat
  EVIDENCE: 6 featured (`.fcard`) + 46 bucketed (`.bk-list li`) across 8 kind buckets. Selection rule is written into `assets/js/featured.js`: production AND described AND spanning plugin/dashboard/pipeline/connector/platform.

- [x] C2: every featured tool answers why it exists, why it was built, and how it helps
  EVIDENCE: Each featured card renders three labelled fields - **The problem / What it does / What it changes** - derived line-by-line from that tool's own `content/<id>.json` record. Hours appear only for the 2 tools that have `manualHrsPerWeek`/`aiHrsPerWeek`, and both render the `draft figure, still being confirmed` caveat because both are flagged `draft:true` in the data. NOTE: this is full clarity for the 6 featured only; bucketed tools carry name + tagline, with depth deferred to their own page (see C3).

- [ ] C3: tool detail pages use the rebuilt template's structure — or the reason they cannot is written down explicitly
  EVIDENCE: pending

## D. Visual quality (UI_10k + impeccable)

- [ ] D1: squint test passes on the first screen — the intended element emerges first
  EVIDENCE: pending

- [ ] D2: `gap_within < gap_between` holds at 1440 and 390
  EVIDENCE: pending

- [ ] D3: visuals are consistent — one icon style, one radius scale, one shadow treatment
  EVIDENCE: pending

- [ ] D4: body text >= 4.5:1; no state signalled by colour alone
  EVIDENCE: pending

## E. Ship-readiness

- [ ] E1: zero console errors and zero 404s on every page at 1440 and 390
  EVIDENCE: pending

- [ ] E2: no horizontal overflow at 390, 768, 1024, 1440
  EVIDENCE: pending

- [ ] E3: repo is GitHub-ready — .gitignore, README, no absolute local paths in shipped files, no secrets
  EVIDENCE: pending

- [ ] E4: no regression — index, tools page, tool detail and h10 all still render
  EVIDENCE: pending

## F. Honesty

- [ ] F1: anything not done is listed with a reason; no silent scope narrowing
  EVIDENCE: pending

- [ ] F2: any generated or sourced imagery is recorded with its origin; nothing implies a photo is ours if it is not
  EVIDENCE: pending

<!--
A checked box whose EVIDENCE still reads "pending" counts as UNMET.
If a gate becomes impossible: add `ABANDON: <id> <reason>` and report it.
-->
