# AI Research & Innovation — Showcase Platform

A living portfolio of every AI tool, automation, plugin, dashboard, experiment and research project built in the studio.

> **Increasing Efficiency. One Tool at a Time.**

Design language adopted from the P25 and H10 dashboards (violet→cyan, Inter + JetBrains Mono, dual light/dark, glass + glow) and refined into one cohesive system.

## Run it

Fully static — no build step. Open `index.html` in a browser, or serve the folder:

```powershell
# from this folder
python -m http.server 8080      # or: npx serve .
# then open http://localhost:8080
```

Deploy the whole folder as-is to any static host (Netlify drag-drop, GitHub Pages, cPanel).

## Structure

```
index.html            landing — hero, metrics, tool grid, search/filter, AI-capability map
tool.html             ONE reusable template — renders any tool via ?id=<tool-id>
assets/css/theme.css  the shared design system
assets/js/projects.js ← the data. ADD A TOOL = one entry here (see ADD_A_TOOL.md)
assets/js/app.js      landing logic
assets/js/tool.js     tool-page logic (adaptive media)
assets/js/icons.js    inline UI icons + official-logo helper
assets/logos/         official software SVGs + ADS brand
data/                 ai_capability_map.js
projects/<id>/        per-tool media: screenshots / videos / html / docs
```

## Adding a tool

See **[ADD_A_TOOL.md](ADD_A_TOOL.md)** — paste one object into `projects.js`, drop media in a folder, done. The card, metrics, filters, search and a full tool page generate automatically.

## Principles

- **Honest numbers.** Each tool gives only `manualHrsPerWeek` + `aiHrsPerWeek`; hours-saved / speed× / % efficiency are derived by one formula so figures can never contradict. Estimates wear a **DRAFT** badge until confirmed.
- **Confidential-safe.** Project codes only (P01…), high-level descriptions, no client names.
- **Fast media.** Videos load only on click (poster first); big clips go to YouTube-unlisted, short clips stay local.
- **Future-proof.** Data-driven and modular — grows for years by adding entries, never by redesigning.

## Status

**v1 — template.** Fully built: landing page + the P01 (ADS Phoenix L1) reference tool page, plus 9 seed tools. Next: confirm P01 numbers, attach its real media, then clone the pattern for the rest.
