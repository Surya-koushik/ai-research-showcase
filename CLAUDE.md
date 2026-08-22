# AI Research Showcase — working rules

Loads automatically for anything done in this folder.

## Run it

```
START.bat     regenerate, serve the site + admin, open both
BUILD.bat     produce dist\asure-showcase.html (one self-contained file)
```

`pushd`, not `cd /d`: this lives on a mapped network drive and cmd.exe refuses
a UNC path as a working directory.

## The content model

**The folder tree is the CMS. Nothing is hand-edited in JavaScript.**

```
content\<id>.json                      one record per project (52)
projects\<id>\screenshots\hero.jpg     card + page image
projects\<id>\screenshots\01.jpg …     gallery, filename order
projects\<id>\videos|html|docs\        players, live demos, downloads
```

`_tools\build_content.py` validates and generates `projects_data.js`;
`_tools\build_media_manifest.py` generates `media_manifest.js`. Both run from
`START.bat` and from every admin save. **Validation failure stops the build** —
that is deliberate, do not weaken it to get a record through.

`_local\` holds machine-specific source-folder links and is gitignored. Paths
like `C:\Users\...` must never reach `content\` or the published site.

## Images for a tool showcase — REQUIRED PROCEDURE

**Read `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md` before generating any
image for any plugin's page, and follow it.** It is the house standard, not a
suggestion. In short:

- Two images per tool: **Image A** hero workflow, **Image B** technical workflow.
- Image B is a flat 2D technical diagram. Never a 3D render, no people, no
  photorealism, no isometric scenes, no dramatic glow.
- Palette is fixed: canvas `#F5F8FA`, panel `#FFFFFF`, navy `#102F4C`,
  secondary text `#587087`, technical blue `#2875C7`, verified green `#3BA66E`,
  controlled-update amber `#D6A742`, border `#B7C7D5`.
- Blue = processing/configuration · amber = a controlled decision or a write to
  the model · green = verification or final output.
- Node titles are direct actions ("Collect model data"), never marketing lines.
- Research the actual tool before drawing it; the diagram must describe what the
  plugin really does.

Reference implementation (ADS L1) lives in `assets\visuals\`:
`tool-hero-workflow-ads-l1.png`, `tool-technical-workflow-ads-l1.png`, and the
editable `.svg`. `tool_template.html` is the page these sit in.

## Both themes are real

The image system is light-canvas, so the site must not be dark-only. Anything
added has to hold up in `data-theme="light"` and `"dark"`. The opening loader
follows this: one PNG wordmark with alpha, inverted to white on dark and used as
drawn on light, with the colour layers switching `screen` to `multiply`.

## Confidentiality

Project codes only (P01…). No client names, no staff data, no contract values —
in copy, in filenames, or visible inside a screenshot. Client decks are
catalogued under a described type, and captures must come from the anonymised
build. Check the slides, not just the title.

## Conventions worth keeping

- Kind × domain are stored per record; there is no lookup table any more.
- The single-file build inlines everything except Google Fonts, which degrade
  to the fallback stack offline.
- Deleting a record leaves its uploaded media on disk. One is reversible.
