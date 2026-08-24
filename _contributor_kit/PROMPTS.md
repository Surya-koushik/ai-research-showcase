# Prompts

One rule runs through all of these: **the model must not invent facts about a
tool.** Anything it cannot get from you or from the source, it leaves out and
lists as an open question.

## First, which tool are you using?

- **Claude Code, or Claude desktop with a project folder** — it can read files
  and *create the folders and files itself*. Use the all-in-one prompt below and
  you get finished, drop-in folders. This is the recommended path.
- **Plain ChatGPT or Claude in a browser** — it *cannot create folders*. It can
  only hand back content for you to save by hand: paste the JSON into a file,
  save the images it describes. Use the one-tool prompts further down.

Either way, attach the whole kit folder first so the model has the README, the
classification guide, the image procedure and the example record.

---

## 0. All-in-one — a whole list of tools, into finished folders

Use this with Claude Code or any agent that can write files. Give it your list;
it classifies each tool, writes the record, generates both images, and lays out
one drop-in folder per tool.

> You have the Asure contributor kit in this folder. Read `README.md` in full,
> especially "How to classify", and `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md`.
>
> Here is my list of tools. For each one: **[paste the list — one block per
> tool: name, what it does, who uses it, what it replaced, what it is built
> with, whether time saved was ever measured, and its stage. Point at a repo or
> README where there is one.]**
>
> For every tool, produce a folder `output/<tool-id>/` containing:
> - `<tool-id>.json` — the record, following `TEMPLATE.json` and validated
>   against the required fields and the exact kind/domain/status spellings.
> - `screenshots/workflow.svg` — Image B, the technical workflow, drawn to the
>   procedure (flat 2D, the house palette, direct-action node titles).
> - `screenshots/hero.jpg` **only if** you have been given a real image or can
>   fetch one; otherwise skip it and note it — do not fabricate a hero.
>
> Rules, without exception:
> - Classify `kind` and `domain` using the decision procedure in README's "How
>   to classify". When two kinds both fit, pick the earlier one in that list and
>   record the alternative in the report.
> - Use only what I gave you. Invent no features, dates, numbers or names.
> - Include `efficiency` only where I gave you a measured before-and-after.
> - No client names, staff names or contract values — not in text, not in
>   filenames, not inside an image.
> - Codes: leave `code` as `P00` and tell me in the report — I assign the real
>   numbers so they stay unique across the catalogue.
>
> When you finish, write `output/REPORT.md`: a table of every tool with the
> kind and domain you chose and why, every field you left blank and what you'd
> need to fill it, and any classification you were unsure about.

Then send me the whole `output/` folder. I drop each `<tool-id>/` into the site
and it publishes; the build re-checks everything and rejects anything malformed.

---

## 1. Write the record

> I am documenting an internal tool for the Asure AI Research Showcase.
> Attached is the contributor kit — read `README.md` and
> `EXAMPLE-phoenix-l1.json` before you answer.
>
> Here is the tool: **[paste the README, the repo, or describe what it does,
> who uses it, and what it replaced]**
>
> Produce `<tool-id>.json` following `TEMPLATE.json`.
>
> Rules:
> - Use only what I have given you. Do not infer features, dates or numbers.
> - Include `efficiency` **only** if I have given you an observed
>   before-and-after in hours. Otherwise leave the field out entirely.
> - Pick `kind` from the eight in the README. `agent` only if the tool decides
>   its own next step; if it follows steps someone defined, it is a `pipeline`.
> - `tagline` is one line of about 12 words, describing what it does — not a
>   sales line.
> - No client names, staff names or contract values.
>
> After the JSON, list every field you left out and what you would need from me
> to fill it.

---

## 2. Draw Image B — the technical workflow

> Read `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md` in the attached kit and
> follow it exactly. `REFERENCE-tool-technical-workflow.svg` is a finished
> example — match its visual language.
>
> Draw the technical workflow for **[tool name]**, whose real sequence is:
> **[list the actual steps, in order]**
>
> Requirements:
> - Flat 2D technical diagram. No 3D, no perspective, no isometric, no people,
>   no photorealism, no glow.
> - Canvas `#F5F8FA`, panels `#FFFFFF`, navy `#102F4C`, secondary text
>   `#587087`, blue `#2875C7`, green `#3BA66E`, amber `#D6A742`, borders
>   `#B7C7D5`, dot grid `#C8D4DF` at ~45%.
> - Blue = processing or configuration. Amber = a controlled decision or a
>   write back to the model. Green = verification or final output.
> - Rectangular nodes, 12–18px corner radii, 1–2px borders, shallow shadows,
>   orthogonal connectors with clear arrowheads.
> - Type: Inter. Utility labels: JetBrains Mono.
> - Node titles are direct actions — "Collect model data" — never marketing.
>
> Output SVG so it stays editable, and name it `workflow.svg` — that is the
> slot the website reads Image B from. This was verified end to end: a coding
> model produces this diagram well; do not use an image model for it.

---

## 3. Draw Image A — the hero

> Same kit, same palette and type as Image B, and it must read as the same
> family.
>
> Draw the hero image for **[tool name]**: **[the one-sentence story of what
> goes in and what comes out]**
>
> Wider and simpler than the technical diagram — this is the first thing anyone
> sees. It should carry the idea at a glance, at card size, with no more than a
> handful of labels. Export at 1600px wide, save as `hero.jpg`.

---

## 4. Check it before handing it over

> Check this tool folder against `README.md` section 4 in the attached kit.
>
> For each item: pass, fail, or cannot tell from here. For every fail, say
> exactly what to change. Check especially:
> - the JSON parses, and the filename matches the `id` inside it
> - `kind` and `domain` are spelled exactly as listed
> - `efficiency` appears only with a real measured before-and-after
> - image filenames are lowercase, no spaces, numbered in use order
> - nothing anywhere names a client, a member of staff, or a contract value
>
> Then re-read the copy and flag any sentence that claims something the source
> material does not actually support.

---

## If the model does not have the tool's details

Do not let it guess. Ask it for a list of what it needs:

> Before writing anything, list the questions you need answered about this tool
> to complete the record: what it does, who uses it, what it replaced, what it
> is built with, whether the time saved was ever measured, and what stage it is
> at. I will answer them, then you write.
