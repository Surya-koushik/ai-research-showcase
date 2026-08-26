# Featured-card imagery — provenance

Five of the six featured cards use **AI-generated abstract illustrations**. They are
diagrams of an idea, not photographs and not screenshots of software. This file exists so
nobody later mistakes them for evidence of a product.

Generated 2026-08-26 in ChatGPT (account: ai asure, Pro), driven through Claude in Chrome
at Surya's explicit request. One shared style spec was reused across all five so the set
reads as one system:

> flat vector, minimal, technical-diagram feel, generous white space · white background ·
> thin precise line work · violet #6A3FE0 primary, cyan #00D4FF secondary, one small amber
> #FFB829 accent · no text, numbers, logos, faces or people · not 3D, no glow, no neon · 16:9

| File | Card | Depicts | Origin |
|---|---|---|---|
| `asure-timeline.*` | H10 BIM Progress Dashboard | Four stepped volumes on a spine, status marks progressing to complete | AI-generated |
| `asure-quantities.*` | Architecture BOQ Template | Wireframe volume resolving into ordered schedule rows | AI-generated |
| `asure-bridge.*` | ads-bridge | Chat bubble and model volume routing through one shared node | AI-generated |
| `asure-board.*` | AI Team Hub | Scattered rectangles resolving into one aligned grid | AI-generated |
| `asure-massing.*` | Feasibility & Massing Tool | Flat site outline extruding into massing blocks | AI-generated |

**ADS Phoenix is deliberately NOT in this list.** It uses its own real captured asset
(`assets/visuals/tool-hero-workflow-ads-l1.png`), because a real artefact beats a generated
one whenever a real artefact exists.

## Why nothing here looks like a screenshot

Only Phoenix has genuine product images (9 files). The other five featured tools have none.
Generating plausible-looking UI shots to fill that gap would fabricate evidence of
capability on a site that may be shown to investors, so every generated image here is
deliberately abstract.

## Encoding
Source PNGs were 1672x941, ~800KB-1.1MB each. Shipped at 1200px wide:
PNG ~440-560KB as fallback, WebP at quality 88 — **132KB for all five combined**.
