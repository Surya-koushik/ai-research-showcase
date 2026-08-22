# Tool Showcase — Image Generation Procedure

This document defines the two required visual assets for every tool page. It is model-independent: ChatGPT, Claude, or another image system may create the assets, but the research, structure, styling and validation rules remain the same.

## 1. Required image set

Every tool page uses two coordinated images.

### Image A — Hero workflow

- Purpose: explain what the tool does within five seconds.
- Export size: **1800 × 1000 px** preferred. Existing approved assets between **1692 × 930 px** and 1800 × 1000 px are acceptable.
- Aspect ratio: **1.80:1** target. Never crop to fill the page.
- Information depth: three or four stages only.
- Structure: `recognizable input → tool action → main validation/processing → useful output`.
- Text: one short action title and one supporting line per stage.
- Safe area: keep all meaningful content at least **120 px** from the left/right edges and **80 px** from the top/bottom edges.
- Composition: reserve quiet white space around the stages. Do not place important content behind page headings.

### Image B — Technical workflow

- Purpose: explain how the tool is configured and how it operates.
- Export size: **1800 × 1000 px**.
- Aspect ratio: **1.80:1**.
- Information depth: eight to twelve nodes, grouped into two or three logical phases.
- Structure: `source information → implementation/configuration → runtime procedure → verified output`.
- Safe area: minimum **35 px** outer margin and **24 px** between nodes.
- Minimum text size at export: **20 px** for node titles, **14–16 px** for supporting labels.
- Delivery: export both PNG and editable SVG whenever the diagram is built deterministically.

## 2. Shared visual language

Both images must clearly belong to the same family.

### Palette

| Role | Colour |
|---|---|
| Canvas | `#F5F8FA` |
| Panel | `#FFFFFF` |
| Primary navy | `#102F4C` |
| Secondary text | `#587087` |
| Connector | `#52708C` |
| Technical blue | `#2875C7` |
| Blue panel | `#EDF6FF` |
| Verified green | `#3BA66E` |
| Green panel | `#EFFAF5` |
| Controlled update amber | `#D6A742` |
| Amber panel | `#FFF8E8` |
| Border | `#B7C7D5` |
| Dot grid | `#C8D4DF` at approximately 45% opacity |

### Graphic style

- Flat **2D technical diagram**, never a 3D render for the technical image.
- White or very pale blue-grey canvas with a restrained dot grid.
- Rectangular nodes with 12–18 px corner radii and fine 1–2 px borders.
- Soft, shallow shadows only; no floating glass cards or dramatic glow.
- Orthogonal or gently curved connectors with clear arrowheads.
- Blue communicates processing/configuration.
- Amber communicates a controlled decision or model-writing action.
- Green communicates verification or final output.
- Original software logos may identify a platform, but logos must not dominate the workflow.
- No decorative illustrations, people, gradients, photorealism, perspective scenes or isometric objects in Image B.

### Typography

- Primary: Manrope or Arial/Inter-compatible sans serif.
- Utility labels: IBM Plex Mono or another legible monospaced face.
- Sentence case for descriptive copy.
- Uppercase may be used only for compact category labels.
- Node titles: direct actions such as “Collect model data,” not marketing statements.

## 3. Research before image creation

Do not generate a technical workflow from a short project description alone.

1. Read the project documentation, source tree, README, configuration, screenshots and available demonstration media.
2. Identify the tool category: plugin, procedure, agent, chatbot, AI model, MCP or another defined type.
3. Identify the actual platform and runtime boundary.
4. Separate facts into:
   - source inputs;
   - implementation/configuration;
   - runtime reads;
   - validation or processing;
   - model/data-writing actions;
   - outputs and records.
5. Verify architecture claims with primary documentation for the underlying platform.
6. Mark assumptions. Never present an inferred technology, integration or measured benefit as confirmed.
7. Confirm uncertain project-specific acronyms with the project owner before publication.

For a Revit add-in, verify at minimum:

- the C#/.NET entry point and Revit API usage;
- add-in registration and packaging;
- which elements and parameters are read;
- which rules are read-only checks;
- which rules may update the model;
- that model changes occur within supported Revit API transactions;
- external classification sources and their update/versioning method;
- report, audit and persistence behavior.

## 4. Content mapping procedure

Create a fact table before drawing:

| Field | Required content |
|---|---|
| Tool type | Plugin, agent, procedure, MCP, etc. |
| User input | What the user opens, provides or starts |
| Source information | Checklists, standards, datasets or instructions |
| Processing | What the tool actually evaluates or transforms |
| Write actions | What may be changed and how approval is controlled |
| Verification | How success is re-checked |
| Output | Report, model, record, response or artifact |
| Platform constraints | Transactions, permissions, APIs, threading or file limits |
| Evidence | Project file or primary source supporting each claim |

Then create:

- Image A from only the four most important user-visible stages.
- Image B from the complete verified procedural chain.

## 5. Reusable prompt — Image A

```text
Use case: infographic-diagram
Asset type: tool-showcase hero workflow
Primary request: Create a premium, immediately understandable four-stage workflow for [TOOL TYPE] called [TOOL NAME]. Show [INPUT] → [PRIMARY ACTION] → [VALIDATION/PROCESSING] → [OUTPUT].
Style/medium: refined light technical illustration; clean architectural-product visual language; consistent objects and restrained depth
Composition: landscape 1800 × 1000; four evenly spaced stages; left-to-right arrows; meaningful content inside a 120 px horizontal and 80 px vertical safe area; generous white space
Colour palette: white and pale blue-grey, navy labels, technical blue actions, green verified states
Text (verbatim): [LIST THE FOUR SHORT STAGE TITLES AND SUPPORTING LINES]
Constraints: visually understandable before reading; one main object per stage; original platform logo only when identification is necessary; preserve all text exactly
Avoid: dense UI, paragraphs, cropped objects, heavy shadows, dark background, decorative effects, watermarks
```

## 6. Reusable prompt — Image B

For dependable labels, prefer an editable SVG/canvas diagram. If an image model is used, validate every word and recreate incorrect labels deterministically.

```text
Use case: infographic-diagram
Asset type: technical workflow for a software-tool case study
Primary request: Create a flat 2D node-based technical workflow explaining the verified architecture and runtime procedure of [TOOL NAME].
Verified source nodes: [SOURCE INPUTS]
Implementation/configuration nodes: [IMPLEMENTATION FACTS]
Runtime nodes: [RUNTIME READS, PROCESSING, WRITE ACTIONS, VERIFICATION]
Final output: [OUTPUT]
Style/medium: precise 2D engineering workflow; professional node-canvas reference; no perspective and no 3D objects
Composition: landscape 1800 × 1000; two or three clearly grouped phases; left-to-right and top-to-bottom reading order; orthogonal connectors; 35 px outer margin; 24 px minimum node spacing
Colour palette: #F5F8FA canvas, #102F4C text, #2875C7 processing, #D6A742 controlled updates, #3BA66E verified output, fine #B7C7D5 borders
Text (verbatim): [COMPLETE APPROVED NODE LABEL LIST]
Constraints: separate read-only checks from write actions; show approval before consequential updates; show re-verification after updates; every connection must have a clear direction
Avoid: 3D, isometric rendering, photographs, people, marketing claims, invented integrations, unverified metrics, long paragraphs, cropped nodes, decorative icons
```

## 7. Website placement

### Hero slot

- Place the project name, descriptive title, type and platform identity before the image in reading order.
- Render the image with `object-fit: contain`.
- Do not use `object-fit: cover` for diagrams.
- Never place critical text or controls over the meaningful diagram area.

### Technical slot

- Display the diagram at the full content-column width.
- Do not compress the technical diagram into a half-width column.
- On narrow screens, preserve label legibility with an internal horizontal scroll area rather than shrinking the diagram below readable size.
- Keep the explanatory paragraph and facts after the image.

## 8. Final verification checklist

Before publishing, verify all of the following:

- [ ] Project name and tool category are correct and used consistently.
- [ ] Image A is understandable in five seconds.
- [ ] Image A contains no more than four stages.
- [ ] Image B matches the project implementation rather than the initial verbal summary.
- [ ] Every technical claim has project evidence or a primary platform source.
- [ ] Read operations and write operations are visually distinct.
- [ ] Consequential updates show approval/control and the correct platform mechanism.
- [ ] No node, label or main object is cropped.
- [ ] Text remains legible at the actual desktop placement.
- [ ] Mobile layout preserves a readable diagram through responsive scaling or controlled scrolling.
- [ ] Colours and semantic states match the palette.
- [ ] Original software logos are correctly proportioned and not recreated by an image model.
- [ ] PNG export and editable source are archived with stable project-specific names.
- [ ] Desktop and mobile screenshots have been visually inspected before delivery.

## 9. Current ADS L1 implementation

- Hero asset: `assets/visuals/tool-hero-workflow-ads-l1.png`
- Technical PNG: `assets/visuals/tool-technical-workflow-ads-l1.png`
- Editable technical source: `assets/visuals/tool-technical-workflow-ads-l1.svg`

The current technical workflow distinguishes the project inputs, add-in implementation, model reads, 22-rule evaluation, Uniclass/BSGD classification, controlled update actions, Revit API transaction, five-gate re-check and certification record.
