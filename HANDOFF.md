# Handoff — AI Research Showcase

**Written 24 Aug 2026** · branch `final/tool-template` · last commit `b1c483e`
Nothing has been pushed to GitHub. `origin` is `AsureEvolve/ai-research-showcase`.

For whoever picks this up next. Read §1 and §6 before touching anything.

---

## 1. What this is, in one paragraph

A static site cataloguing 52 internal tools built at Asure Design Studio —
Revit plugins, dashboards, pipelines, connectors, platforms, agents,
evaluations and delivered decks. Audience is investors, clients and staff.
No framework, no build step for the site itself; two Python generators turn
`content/*.json` and the `projects/` folder tree into the JavaScript the pages
read. There is a local admin for editing. It is confidential-safe: project
codes only, no client names.

---

## 2. Run it

```
START.bat        regenerate, serve site + admin, open both
BUILD.bat        produce dist\asure-showcase.html (one self-contained file)
```

| | |
|---|---|
| Site | http://127.0.0.1:8099/index.html |
| Media desk | http://127.0.0.1:8099/cms.html |
| Admin | http://127.0.0.1:8787/ |

If `START.bat` does nothing: this folder is on a mapped network drive and
cmd.exe refuses UNC paths as a working directory. The scripts use `pushd` for
that reason. Fallback: `py -3 _tools\serve.py 8099`.

**Python is 3.13 here** (`py -3`). Do not reintroduce `cgi` — it was removed in
3.13 and `_tools/admin.py` has its own multipart parser.

---

## 3. Architecture

**The folder tree is the CMS.** Nothing is hand-edited in JavaScript.

```
content/<id>.json                     one record per project (52)
projects/<id>/screenshots/hero.jpg    card + page image
projects/<id>/screenshots/01.jpg …    gallery, filename order
projects/<id>/{videos,html,docs}/     players, live demos, downloads
_local/sources.json                   links to real project folders — GITIGNORED
```

| Script | Does |
|---|---|
| `_tools/build_content.py` | validates records → `assets/js/projects_data.js` |
| `_tools/build_media_manifest.py` | scans folders → `assets/js/media_manifest.js` |
| `_tools/admin.py` + `admin_ui.html` | localhost editor: create, edit, upload, publish |
| `_tools/sources.py` + `link_sources.py` | link a record to its real folder on disk |
| `_tools/serve.py` | no-cache dev server |
| `_tools/build_single_file.py` | the one-file build |

**Validation is fatal and should stay that way.** Missing required field,
unknown kind/domain/status, duplicate id or code, filename not matching id, or
`related` pointing at a non-existent id — all stop the build. Do not weaken it
to force a record through.

### Page structure

- `index.html` + `home.js` — landing. Order: count → kinds → how they connect → all tools.
- `tool.html` + `tool.js` + `assets/css/tool-page.css` — every tool page, in the
  signed-off template from `tool_template.html`.
- `cms.html` + `cms.js` — read-only media coverage board.

---

## 4. THE MAIN REMAINING TASK

**Fill in tool detail for the other 51 projects, using P01 as the pattern.**

P01 `phoenix-l1` is the only complete record. Everything else is thin. Measured
today:

| Field | Filled |
|---|---|
| `objective`, `solution` | 52/52 |
| `problem` | 39/52 |
| `related` | 38/52 |
| `efficiency` | 5/52 |
| hero image | 5/52 |
| gallery | 5/52 |
| `howItWorks` | **1/52** |
| `timeline` | **1/52** |
| `challenges` / `lessons` / `roadmap` | **1/52** |

**Complete on every field: 1 (P01).** Average across the catalogue is 3.9 of 12
fields. Least complete: P19, P14, P16, P11, P20, P21, P12, P17 — all at 2/12.

### What "done" looks like for one tool

Open `content/phoenix-l1.json`. That is the target. Concretely:

- `page.objective` / `problem` / `solution` — one sentence each
- `page.howItWorks` — the real steps, `{title, detail}`, usually 4–6
- `page.timeline` — real dates, `{date: "Apr 2026", label: "…"}`
- `page.challenges` / `lessons` / `roadmap` — 2–3 short entries each
- `efficiency` — **only if a real before-and-after was observed**
- `projects/<id>/screenshots/hero.jpg` plus a numbered gallery

### How to work it

The tool folders on disk are already linked for 20 projects — run
`py -3 _tools/link_sources.py` to see the state, `--apply` to add
high-confidence links. Then in the admin, each linked project shows its real
folder: file counts, last modified, git history, README text, and one-click
import for any image or document sitting there. **Across the 19 linked folders
there are 109 images, 80 demos and 37 documents already on disk** waiting to be
pulled in.

**Suggested order:** the four `plugin` records first (they are the most
externally interesting and already average 5.0/12), then `dashboard`, then the
rest. Decks need least — they lead with the deck itself.

### Two rules that matter more than speed

1. **Never invent an efficiency number.** 47 tools have no measured
   before-and-after. The page says "Not measured" and explains why, and the
   landing-page total is built only from measured tools. A fabricated number
   would quietly corrupt the headline figure.
2. **Everything must be true of the tool as it is today**, not as pitched. If
   it cannot be verified from the source folder or from Surya, leave the field
   out. A missing field renders as nothing; a wrong one ships.

### Other people are contributing

`dist/asure-showcase-contributor-kit.zip` (source in `_contributor_kit/`) is
handed to people documenting their own tools. They attach it to Claude or
ChatGPT and return one folder per tool that drops straight in. **If you change
the record schema, the validator, or the kind/domain lists, update that kit in
the same commit** — its rules were verified against `build_content.py` and must
stay in step.

---

## 5. Open decisions — need Surya, do not guess

1. **P06 `archviz-suite`** is filed as `evaluation` but its own tagline
   describes a pipeline: "Local idea → elevations → 3D → render pipeline on
   ComfyUI". Probably should move to `pipeline`.
2. **P16 `ads-lifecycle`** (Plugin/Design) and **P20 `architecture-ai`**
   (Pipeline/Design) were flagged `CHECK` during classification and never
   confirmed.
3. **Index tiles.** 5 of 52 have real images, 47 show generated placeholder
   art. Research found that respected catalogues either require imagery on
   everything or abolish it entirely — nobody ships a mixed grid. Either
   commission artwork for all 52 or make the tiles uniformly media-free.
4. **Two filter axes.** kind × domain is 8 × 7 = 56 cells for 52 items, so most
   combinations return nothing. Consider kind as the only visible axis with
   domain as a searchable tag.
5. **Three divergences from Shravan's UI kit spec** are on record and unresolved:
   the tall hero (spec says none), full-height bands (spec caps at 150px), and
   display headlines not on the kit's 21px-capped type scale.

---

## 6. Traps that already cost time here

- **String-anchor patching of `_tools/build_single_file.py` has broken it three
  times.** Twice it matched source code by exact spelling — reformatting an
  IIFE from `(function(){` to `(function () {` failed with "substring not
  found", and a `const`→`var` change made the router's id rewrite silently stop
  applying so every tool route rendered "Not found" with no error. Both are
  patterns now and raise named errors. Once a backwards slice duplicated 6 KB
  of the file. **Prefer rewriting that file to patching it.**
- **Backslashes collapse through bash heredocs in this environment.** `'\\a'`
  became a BEL character in a `.bat` file. Use `chr(92)` or write via the file
  tools.
- **Windows lets a second process bind an already-listening port.** A stale
  admin answered for a new one for a whole debugging round. `serve.py` and
  `admin.py` now set `allow_reuse_address = False` and refuse.
- **A network drive's clock differs from the local one**, so conditional
  requests won a stale `projects.js` for an entire session — the browser served
  17,843 bytes against 22,853 on disk. `serve.py` strips validators and sends
  `no-store`. Do not "optimise" that away.
- **The kit's PNG wordmarks are black on transparency.** They are inverted to
  white on dark and used as-drawn on light. A plain `<img>` on a dark ground is
  invisible — this is exactly how the loader shipped with no wordmark once.
- **Verify visually, not only structurally.** Several bugs this session passed
  every DOM assertion and were still wrong on screen. The browser pane could
  not composite frames for most of the session, which is how the missing
  wordmark got through.

---

## 7. Conventions

- **Theme: light is the default.** The image system is drawn on a light canvas
  (`#F5F8FA`), so a first-time visitor lands on the ground the artwork was made
  for. A saved choice still wins. Both themes must work for anything added.
- **Images:** `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md` is binding, not
  advisory. Two images per tool, flat 2D for the technical one, fixed palette,
  blue = processing, amber = controlled write, green = verification.
- **Type:** Inter and JetBrains Mono, site and diagrams alike.
- **Colour:** navy `#2f6db5` is chrome the UI kit owns; violet is research
  content. Do not blend them.
- **Confidentiality:** project codes only. Check the pixels of a screenshot,
  not just its filename — client names hide inside images.
- Deleting a record leaves its uploaded media on disk. One is reversible.

---

## 8. Branches

```
main
└── redesign/deck-style
    └── redesign/uikit          navy chrome, real captures, CMS, source linking
        └── feat/evolve-loader  the Asure → Evolve opening
            └── final/tool-template   ← HERE
```

Recent commits on this branch:

```
b1c483e  Stop the bundler matching source code by exact string
d06860a  Add a contributor kit so other people can document their own tools
802d9e0  Every tool page now renders in the signed-off template
4d60337  Rename the Study kind to Evaluation
3b758af  Plain language on the landing page, and a deck that opens as a deck
```

---

## 9. First thing to do

```
py -3 _tools/build_content.py      should say: validated 52 records, no errors
py -3 _tools/link_sources.py       shows which tools are linked to real folders
START.bat
```

Then open http://127.0.0.1:8787/, pick a `plugin`, and look at its Source panel.
Everything needed to fill that record in is usually already sitting in the
folder it points at.
