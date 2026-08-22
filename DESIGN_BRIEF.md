# Tool page — design brief

For designing the tool/plugin detail page elsewhere and handing it back.
Everything below is measured from the live catalogue on 22 Aug 2026, not estimated.

**52 projects. Exactly one — P01 Phoenix L1 — has enough content to fill the
current template.** Design against Phoenix and fifty-one pages come out hollow.

---

## 1. What actually exists, across all 52

| Field | Filled | Notes |
|---|---|---|
| `name` `code` `status` `kind` `domain` `logo` `tech[]` | **52/52** | every project |
| `tagline` | **52/52** | one line, ~12 words |
| `objective` | **52/52** | one sentence |
| `solution` | **52/52** | one sentence |
| `problem` | 39/52 · 75% | one sentence |
| `related[]` | 38/52 · 73% | 2–3 sibling projects |
| `workflowStage` | 24/52 · 46% | e.g. "QA & Compliance" |
| `description` | 24/52 · 46% | short paragraph |
| `media.html[]` | 8/52 · 15% | live demo files |
| `media.hero` | **5/52 · 10%** | real screenshot |
| `media.gallery[]` | **5/52 · 10%** | 4–7 shots |
| `efficiency` | 5/52 · 10% | hours saved/week |
| `howItWorks[]` | **1/52 · 2%** | Phoenix only |
| `timeline[]` | **1/52 · 2%** | Phoenix only |
| `challenges[]` `lessons[]` `roadmap[]` | **1/52 · 2%** | Phoenix only |
| `media.videos[]` `media.docs[]` | **0/52** | nothing yet |

### Which sections render today

| Section | Renders on | Gate |
|---|---|---|
| Overview | 52/52 | always |
| What it does | 52/52 | objective / problem / solution / description |
| Demos & media | 13/52 | any gallery, video, html or doc |
| How it works | **1/52** | `howItWorks[]` |
| Development notes | **1/52** | timeline / challenges / lessons / roadmap |
| Related tools | 38/52 | `related[]` |

---

## 2. The constraint this puts on the design

**A page has to look finished with only the 100% fields.** That is:

> code · name · status · kind · domain · tech logos · tagline · objective · solution

Roughly **40 words and no image**. Everything else — screenshots, gallery,
step-by-step, timeline, hours-saved — is an *enhancement that usually is not
there*. If the layout needs a hero image to hold together, 47 pages break.

The research backs this: GitHub Next's Autoloop page runs ~810 words with
essentially no media and still reads as complete, because a fixed metadata
block under the title carries the weight. Their Repo Mind page spends its
entire visual budget on an architecture diagram and a results chart — no UI
screenshots at all.

**Design the 40-word page first. Then show what it looks like when the extras
arrive.** Two states, same layout.

---

## 3. Slot inventory

Real values from P01 so you can typeset against true lengths.

### Identity — always present
| Slot | Type | Example |
|---|---|---|
| `code` | `P` + 2 digits | `P01` |
| `name` | ≤ 46 chars | ADS Phoenix — L1 Self-Certification |
| `status` | 1 of 3 | `production` · `in-progress` · `research` |
| `kind` | 1 of 8 | plugin · dashboard · pipeline · connector · platform · agent · evaluation · deck |
| `domain` | 1 of 7 | design · docs · qa · controls · knowledge · studio · ai |
| `tech[]` | 1–5 logos | Revit · C# · .NET · Supabase · pyRevit |
| `workflowStage` | short phrase, 46% | QA & Compliance |

### Copy
| Slot | Length | Example |
|---|---|---|
| `tagline` | ~12 words | Weekly Level-1 model self-certification, run inside Revit in one click |
| `objective` | 1 sentence | Make the weekly Level-1 self-cert effortless and consistent… |
| `problem` | 1 sentence, 75% | 22 discrete model-health checks across 5 gates. By hand it is slow… |
| `solution` | 1 sentence | One Revit button runs all 22 checks, evaluates the 5 gates, writes a report. |

### Rare — treat as bonus
| Slot | On | Shape |
|---|---|---|
| `efficiency` | 5 | `{ manualHrsPerWeek, aiHrsPerWeek }` |
| `howItWorks[]` | 1 | 5 × `{ title, detail }` |
| `timeline[]` | 1 | 4 × `{ date, label }` |
| `challenges[]` `lessons[]` `roadmap[]` | 1 | 2–3 strings each |

### Media — the folder is the source of truth
```
projects/<id>/screenshots/hero.jpg   tile + page image      5/52
projects/<id>/screenshots/01.jpg …   gallery, name order    5/52
projects/<id>/videos/*.mp4           inline player          0/52
projects/<id>/html/*.html            live preview button    8/52
projects/<id>/docs/*.pdf|xlsx        download button        0/52
```
Drop a file in, run `python _tools/build_media_manifest.py`, reload.

---

## 4. Decisions worth making in the design

1. **Index tiles** — mixed grids (5 with photos, 47 blank) have no precedent.
   Either every tile is media-free and uniform, or all 52 get artwork.
   See obsidian.md/plugins (icon-only, ~2,000 items) vs media.mit.edu/projects
   (thumbnail enforced on all 66).
2. **Diagram over screenshot.** A data-flow diagram of a Revit plugin reads
   better to an investor than a screenshot of a dialog, and we can draw 52 of
   those — we cannot capture 52 screenshots.
3. **One axis or two.** We currently filter KIND × DOMAIN: 8 × 7 = 56 cells for
   52 items, so most combinations return nothing. Consider KIND as the only
   visible axis, DOMAIN as a searchable tag, plus Live/Prototype/Archived.
4. **Empty states are the common case,** not an edge case. Worth designing
   explicitly rather than leaving to fallback.

---

## 5. Handing it back

Any of these work — screenshots, a Figma link, or plain HTML/CSS.
HTML is fastest for me to wire up; a static image is fine too.

Useful to mark: which slots are required vs optional, what a card looks like
with no image, and what the page looks like at the 40-word minimum.

Current build for reference: `index.html`, `tool.html`, `cms.html`
(media desk, shows every empty slot).
