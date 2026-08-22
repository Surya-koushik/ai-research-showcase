# Prompts

Paste these into Claude or ChatGPT. Attach the whole kit folder first, so the
model has the README, the image procedure and the example record.

Everything here assumes one rule: **the model must not invent facts about the
tool.** Anything it cannot get from you or from the source it should leave out
and list as an open question.

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
> Output SVG so it stays editable.

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
