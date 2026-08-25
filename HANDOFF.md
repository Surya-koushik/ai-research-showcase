# Handoff — AI Research Showcase

**Written 24 Aug 2026** · branch `design/light` · last commit `433382e`
Working tree clean. Nothing pushed to GitHub (`AsureEvolve/ai-research-showcase`).

Read §1 and §2 first. §1 is a live bug with a known cause; §2 is the copy the
user asked for and did not get before the session ended.

---

## 1. THE LIVE BUG — light/dark toggle does nothing

**Symptom:** clicking the theme button flips `data-theme` on `<html>` from
`dark` to `light` correctly, but the page looks identical. Body background
stays `rgb(255,255,255)` in both.

**Cause — found and confirmed, not a guess:**

```
assets/css/light.css:85   html, body{ background:var(--paper) !important; color:var(--ink); }
assets/css/dala.css:72    html, body{ background:var(--color-void) !important; ... }
```

`light.css` is linked *after* `theme.css` in `index.html` and forces the body
background with `!important`. `theme.css` themes the site through `--bg` tokens
under `:root[data-theme="dark"]` / `:root[data-theme="light"]`. The `!important`
wins, so the token system is inert and the toggle is decorative.

These files arrived in commits `9bb6ed8`, `68b4771` and `433382e` — a "Dala"
skin added on `design/dala` and carried into `design/light`. **They were not
written in this session and it is not obvious which system is meant to win.**

**This is a decision, not a fix. Ask Surya which he wants:**

- **(a) Dala skin is the design** → then the theme toggle is meaningless and
  should be *removed* from the topbar, not left as a dead control.
- **(b) Light/dark is a real feature** → then `light.css` and `dala.css` must
  stop forcing `html, body` background. Drop the `!important`, or better,
  express the Dala palette as values for `theme.css`'s existing `--bg` /
  `--surface` / `--text` tokens under the two `data-theme` blocks, so one
  system owns colour.

Do not just delete `!important` and ship it — check the whole Dala skin still
holds together in both themes first.

Secondary: `localStorage.getItem('asure.theme')` returns `null` after a toggle,
so the preference does not persist either. Same root cause area; fix with (b).

---

## 2. COPY THE USER ASKED FOR — not yet done

The hero currently reads:

> **AI doesn't mean artificial here. It means Asure Intelligence.**
> Intelligence built inside the studio, for the studio — not bolted on from
> outside. Fifty-two tools so far: plugins that live inside Revit, dashboards a
> client can read, pipelines that turn drawings into quantities, and agents that
> decide their own next step. And a roadmap for where architecture and
> intelligence go next.

**His instruction, verbatim:** the headline should be

```
AI
Asure Intelligence
```

and the paragraph below should **not mention the number of tools or list
them** — "just the main intent and direction."

So: two-line headline (the letters `AI`, then `Asure Intelligence` expanded
beneath — the abbreviation resolving into its real meaning), and a short lede
about intent and direction only. No "fifty-two", no plugin/dashboard/pipeline
list. That list already lives in the stats row and the kinds section directly
below; repeating it in the hero is the redundancy he is reacting to.

Hero markup: `index.html`, `<section class="band tall" id="top">`.
The emphasis span is `.g-primary` (solid violet, 7.4:1 — do not reintroduce
gradient text, it is a banned pattern).

---

## 3. Also open — he asked, I measured, did not finish

He confirmed three areas need work: **hero**, **roadmap**, **spacing & rhythm**.
Measurements taken, no changes made:

**Spacing is uniform and that is the problem.** Every band on the landing uses
identical `79.2px` top and bottom padding, while section heights run from 364px
(close) to 11,403px (the 52-card grid). Uniform padding across wildly different
densities is why it reads flat. Vary it: tighter around short sections, more air
before the grid.

**Hero:** h1 is 81.92px at weight 400 over 4 lines, in an 1100px column while
the lede caps at ~557px. The weight is light for display at that size, and the
two columns disagree. Worth setting deliberately once the copy in §2 lands,
since shorter copy changes the line count.

**Roadmap** (`#roadmap`, styles in `deck.css` under `.rmap`): 945px tall, three
equal columns at 247px, heading 53.76px. Content is three horizons — Running
now / Building next / On the horizon — written from real catalogue work but
**never reviewed by Surya**. Confirm the content is right before polishing the
layout.

---

## 4. Where things stand

Nine branches, which is now itself a problem:

```
main
└── redesign/deck-style → redesign/uikit → feat/evolve-loader
    └── final/tool-template
        └── design/impeccable      design-principle pass (AI-grammar tells removed)
            └── design/dala        Dala dark-void skin
                └── design/light   ← YOU ARE HERE
```

`final/tool-template` is the last branch that was a coherent "known good" site.
Everything after it is design exploration. **Worth agreeing with Surya which
branch is the real one and collapsing the rest** before more work lands.

### What was done this session (all on the design/* chain)

- **Design-principle pass** (impeccable skill + its detector, now zero
  violations): removed gradient text, cut section eyebrows from six to two
  bookends, removed `01/02/03` numbered markers, loosened display tracking from
  −0.05em to −0.022em, fixed a 4.34 contrast caption.
- **Declutter:** sidebar 20 items → 13 (dropped the domain axis; it still shows
  on cards and in search), removed four restated stat captions, kind blurbs
  214 → 174 words.
- **Finished-site additions:** landing footer, skip link + focus-visible rings
  on all three pages, mobile fix (sidebar hidden below 900px so content leads),
  a generated 1200×630 OG cover, OG/Twitter tags, `robots.txt`.
- **Root organised:** 28 loose files → 17. Eleven `tool_template_*` snapshots and
  a stale `assets.zip` → `_archive/` (see `_archive/README.md`).
- **Asure Intelligence reframe + roadmap section** (the copy now needs revising
  per §2).

---

## 5. Traps — these cost real time, none are visible from the code

- **`!important` in `light.css` / `dala.css` beats everything**, including
  inline styles set from JS. This defeated a mobile nav drawer entirely before
  the cause was found (see §1). If an override "impossible fails", check those
  two files first.
- **Apostrophes break `projects.js`.** Blurbs are single-quoted JS strings;
  writing `project's` closes the string and blanks the whole page. It happened
  once this session. Rephrase, or use the `content/*.json` records instead.
- **Backslashes collapse through bash heredocs** in this shell — `'\\a'` became
  a BEL character in a `.bat`. Use `chr(92)`.
- **cmd.exe refuses UNC paths**, and this folder is on a mapped drive. The
  `.bat` files use `pushd` for that reason; `cd /d` fails.
- **Git background repack fails on `Y:`** ("could not write multi-pack-index:
  Permission denied"). Commits succeed; only maintenance fails. Harmless.
- **The preview browser cannot screenshot here** (pane not compositing), so
  visual verification was done by measuring computed styles. That is how the
  missing loader wordmark slipped through earlier in the project — measure, but
  get a human to *look*.

---

## 6. Run it

```
START.bat                       regenerate, serve + admin, open both
py -3 _tools/serve.py 5173      just the site  → http://localhost:5173
BUILD.bat                       dist\asure-showcase.html (one self-contained file)
```

Python here is **3.13** (`py -3`). Do not reintroduce `cgi`; `_tools/admin.py`
has its own multipart parser because 3.13 removed it.

Content model is unchanged and documented in `CLAUDE.md`: `content/<id>.json`
plus `projects/<id>/{screenshots,videos,html,docs}/`, generated by
`_tools/build_content.py` and `_tools/build_media_manifest.py`. Validation is
fatal by design — do not weaken it to force a record through.

---

## 7. Still true from the previous handoff

The content gap has not moved: **P01 is the only project complete on all twelve
fields**; the catalogue averages 3.9. `howItWorks`, `timeline`, `challenges`,
`lessons` and `roadmap` each exist on exactly one project. 109 images, 80 demos
and 37 documents are already sitting in linked source folders waiting to be
imported through the admin's Source panel.

Open classification questions, still unanswered: **P06 `archviz-suite`** is
filed as `evaluation` but its own tagline describes a pipeline; **P16
`ads-lifecycle`** and **P20 `architecture-ai`** were flagged `CHECK` and never
confirmed.
