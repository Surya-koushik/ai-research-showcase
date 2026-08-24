# Asure AI Research Showcase — contributor kit

Everything needed to document one tool so it can be dropped straight into the
showcase website. Give this whole folder to Claude or ChatGPT along with the
details of your tool, and work through it in order.

**What you hand back:** one folder per tool. Nothing else. It plugs in without
anyone editing the website.

```
<tool-id>/
├── <tool-id>.json            the record — required
├── screenshots/
│   ├── hero.jpg              the card and page image (Image A)
│   ├── workflow.svg         the technical diagram beside "how it works" (Image B)
│   ├── 01.jpg  02.jpg  …     gallery, shown in filename order
├── videos/     *.mp4         optional
├── html/       *.html        a live demo, if the tool has one
└── docs/       *.pdf *.xlsx  anything downloadable
```

Only the `.json` is required. Every media folder is optional and can be empty
or absent — the page adapts.

---

## 1. Before you write anything

**Look at the tool.** Open it, run it, read its README, look at what it
produces. Everything in the record has to be true of the tool as it exists
today, not as it was pitched or as it is meant to become.

If you cannot verify something, leave the field out. A missing field renders
as nothing. A wrong field is on the website until someone catches it.

**Confidentiality is absolute.** No client names, no staff names, no contract
values, no project addresses — not in the text, not in filenames, and **not
visible inside a screenshot**. Check the actual pixels, not just the title.
Client work is described by type: "an enterprise client outside architecture",
never the client.

---

## 2. Write the record

Copy `TEMPLATE.json`, fill it in, rename it `<tool-id>.json`.

`EXAMPLE-phoenix-l1.json` is a complete, real record — the most filled-in one
in the catalogue. Read it before you start.

### Required — the page will not build without these

| Field | What it is |
|---|---|
| `id` | lowercase, hyphens, no spaces. Becomes the folder name and the URL. |
| `code` | `P` plus two digits. **Ask which number to use** — they must be unique. |
| `name` | The tool's real name. Around 46 characters or less. |
| `status` | `production` · `in-progress` · `experimental` · `research` |
| `kind` | one of the eight below |
| `domain` | one of the seven below |
| `tagline` | One line, about 12 words. This is what shows on the card. |

### The eight kinds — pick the one that is true

| Kind | It means |
|---|---|
| `plugin` | Runs inside software you already use — Revit, Rhino, AutoCAD. |
| `dashboard` | A screen that reports on something. People read it. |
| `pipeline` | Fixed input, fixed output, runs start to finish. |
| `connector` | Moves data between two systems. |
| `platform` | A multi-user system with accounts and permissions. |
| `agent` | **Chooses its own steps** and calls tools to reach a goal. Not simply "uses AI". |
| `evaluation` | We tested the options and wrote down what works. Findings, not software. |
| `deck` | A finished presentation or report that was actually delivered. |

Almost nothing is an `agent`. If it follows steps you defined, it is a
`pipeline`. Getting this wrong is the most common mistake.

### The seven domains — who the work is for

`design` · `docs` · `qa` · `controls` · `knowledge` · `studio` · `ai`

### Strongly wanted

- `objective` — one sentence: what it is for.
- `solution` — one sentence: how it does it.
- `problem` — one sentence: what was wrong before.
- `tech` — the real stack, e.g. `["revit","csharp","dotnet"]`.
- `related` — 2–3 ids of sibling tools. **They must already exist**, or the
  build fails.

### Only if you can prove it

- `efficiency` — `{"manualHrsPerWeek": 4, "aiHrsPerWeek": 0.5}`.
  **Only from an observed before-and-after.** Not a guess, not a hope. If it
  was not measured, leave it out entirely; the page then says "Not measured"
  and explains why, which is better than a number nobody can defend.
- `howItWorks` — the real steps, in order.
- `timeline` — real dates, e.g. `{"date":"Apr 2026","label":"first working version"}`.
- `challenges`, `lessons`, `roadmap` — short, specific, honest.

---

## 3. Make the two images

**Read `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md` and follow it.** It is the
house standard, not a suggestion. Short version:

- **Image A — hero workflow.** Goes in `screenshots/hero.jpg`. This is what
  people see on the card and at the top of the page.
- **Image B — technical workflow.** Goes in `screenshots/workflow.svg` (or
  `.png`). Shown beside the "how it works" copy, not in the gallery — if you
  number it into the gallery it will read as one screenshot among many. A flat
  2D diagram. Never a 3D render, no people, no photorealism, no isometric
  scenes, no dramatic glow. **SVG is preferred** — it stays crisp at any size
  and a coding model (Claude, ChatGPT/codex) can write it directly to the
  palette. Image A, the richer hero, needs an image model instead.

Fixed palette: canvas `#F5F8FA`, panel `#FFFFFF`, navy `#102F4C`, secondary
text `#587087`, technical blue `#2875C7`, verified green `#3BA66E`,
controlled-update amber `#D6A742`, border `#B7C7D5`.

Colour carries meaning: **blue** = processing or configuration · **amber** = a
controlled decision or a write back to the model · **green** = verification or
final output.

Type is **Inter**, with **JetBrains Mono** for utility labels — the faces the
website uses.

Node titles are direct actions — "Collect model data" — never marketing lines.

`REFERENCE-tool-technical-workflow.svg` is a real Image B you can open and edit
rather than starting from nothing.

### Screenshots of the real tool

Better than any diagram when the tool has a usable interface. Number them
`01.jpg`, `02.jpg` … in the order someone would actually use the tool. The
filename sets the order, so `01`, `02` … not `screenshot (1)`.

Save as JPEG, no wider than 1600px. Use lowercase filenames with no spaces —
the site is served from Linux, where `Hero.JPG` and `hero.jpg` are different
files.

---

## 4. Check before you hand it over

- [ ] `<tool-id>.json` is valid JSON — paste it into a validator.
- [ ] The filename matches the `id` inside it, exactly.
- [ ] `kind` and `domain` are from the lists above, spelled exactly.
- [ ] Every id in `related` is a tool that already exists.
- [ ] `efficiency` is present **only** if a real before-and-after was recorded.
- [ ] `hero.jpg` exists and is under 1600px wide.
- [ ] `workflow.svg` (or `.png`) is present as Image B, in `screenshots/`.
- [ ] Gallery images are numbered in use order (hero and workflow are NOT part
      of the numbered gallery).
- [ ] No client name, staff name or contract value anywhere — including inside
      the images.
- [ ] Every sentence describes the tool as it is now.

---

## 5. What happens next

The folder is dropped into the site and two commands run:

```
python _tools/build_content.py          validates and publishes the record
python _tools/build_media_manifest.py   picks up the media
```

`build_content.py` **fails loudly** on a missing required field, an unknown
kind or domain, a duplicate code, a filename that does not match its id, or a
`related` pointing at something that does not exist. That is deliberate — a
bad record stops the build rather than reaching the website. If your folder is
sent back, the error message names the file and the problem.

---

## In this kit

| File | What it is for |
|---|---|
| `README.md` | this document |
| `TEMPLATE.json` | blank record to copy |
| `EXAMPLE-phoenix-l1.json` | a real, fully filled record |
| `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md` | the image standard — required reading |
| `REFERENCE-tool-page.html` | the finished page design, so you can see where everything lands |
| `REFERENCE-tool-technical-workflow.svg` | a real Image B, editable |
| `PROMPTS.md` | prompts to paste into Claude or ChatGPT |
