# Tools by Architectural Design Stage

Every AI tool the studio has built, grouped by **where it fits in the design workflow** — so each team can see what's available to them. A tool can serve more than one stage; it's listed under its primary use with cross-notes.

Legend — **Type**: Plugin · Dashboard · MCP Server · Web App · Automation · Research  ·  **Preview**: 🟢 has live HTML preview · 🎥 needs a screen-recording · 📸 needs screenshots

---

## 1 · Conceptual / Feasibility
*Site testing, massing, early visualisation — Design leads & Concept team.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P23 | Feasibility & Massing Tool | Web App | Draw a site → apply NBC + Telangana GO rules → auto-massing → export to Rhino/GH + PPTX deck | 🎥 |
| P20 | Architecture AI | Research | Photoreal renders, real-time model validation, fly-through video for early design | 🎥 |
| P06 | ArchViz AI Suite | Tool | Local Magnific-style upscaler + idea→elevations→3D pipeline on ComfyUI | 🎥 |

## 2 · Schematic Design
*Turning 2D input into the first coordinated model — Architecture & BIM.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P22 | cad2revit | Tool | Converts AutoCAD DWG plans into native Revit elements with per-element confidence | 🎥 |
| P04 | CAD3D Studio | Web App | CAD (DWG/DXF) → standardized layers → semantic 3D model (IFC/glTF/Rhino) + QA viewer | 🎥 |
| P18 | CADBridge | Plugin | Live AutoCAD → lossless site-layout JSON export for downstream modelling | 🎥 |

## 3 · Design Development
*Detailing, quantities, day-to-day Revit productivity — BIM & Documentation.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P21 | Architecture BOQ Template | Tool | BIM-driven BOQ from native Revit params, classified with Uniclass | 🎥 |
| P24 | Construction Takeoff AI | Automation | Local-AI takeoff: reads a drawing set (classify → schedules → symbol count → OCR) → BOQ quantities | 🎥 |
| P10 | ADS Revit Toolbox | Plugin | General-purpose productivity/QA toolbox for everyday Revit work | 🎥 |
| P20 | Architecture AI *(also)* | Research | Real-time model validation feedback during modelling | — |

## 4 · Coordination & Documentation (QA / BIM)
*Model health, clash, compliance, one-click checks — Coordination team.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P01 | ADS Phoenix L1 | Plugin | One-click weekly Level-1 self-cert: 22 checks / 5 gates → PDF audit report | 🎥 |
| P17 | AsureBimQc | Plugin | Autodesk ACC login + access control for the BIM QC plugin | 🎥 |
| P15 | NavisBridge | MCP Server | Drive Navisworks from chat: clash tests, branded reports, publish NWD/NWF | 🎥 |
| P16 | ads-lifecycle | Plugin | NBC compliance checks + Revit probes + Forma pulls on the open model | 🎥 |
| P05 | Revit ↔ Claude MCP Bridge | MCP Server | Query & drive the live Revit model from chat (pyRevit routes) | 🎥 |
| P14 | ads-bridge | MCP Server | Local MCP exposing the pyRevit ADS_Bridge HTTP API to chat | 🎥 |

## 5 · Reporting & Leadership
*Client-facing progress, delivery analytics, team ops — Leadership & PMs.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P02 | H10 BIM Progress Dashboard | Dashboard | Client-facing project + BIM progress, pre-design → final GFC | 🟢 |
| P03 | P25 Predictability Dashboard | Dashboard | Delivery-predictability analytics — the studio quality benchmark | 🟢 |
| P19 | ADS AI BIM Build Tracker | Dashboard | Tracks AI + BIM build progress across projects | 🟢 |
| P11 | AI Team Hub | Dashboard | Single hub for AI-team projects, priorities, procedures & tools | 🟢 |

## 6 · Finance & Commercial
*Contracts, quantities-to-cost, commercial reporting — Finance team.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P13 | TEP Dashboard | Dashboard | Project/portfolio visualisation with interactive charts | 🟢 |
| P12 | Asure Document Platform | Web App | Branded MOU / contract PDF generation from a guided form | 🎥 |
| P21 | Architecture BOQ Template *(also)* | Tool | Quantities feed commercial BOQ / cost | — |

## 7 · Cross-cutting Infrastructure / R&D
*The plumbing that makes everything else faster — used studio-wide.*

| Code | Tool | Type | What it does for this team | Preview |
|---|---|---|---|---|
| P07 | Headroom | Tool | Context-compression proxy that cuts token usage for Claude Code | 🎥 |
| P08 | Docs → Markdown Corpus | Automation | Batch-convert documents/drawings to AI-queryable Markdown | 🎥 |
| P09 | Team AI-Usage Assessment | Automation | Assesses how teammates use Claude Code from session transcripts | 🎥 |

## 8 · 🔒 Confidential (internal only — NOT on the public showcase)
*Tracked in the registry for completeness; kept off the public site because they hold financial / client data.*

| Code | Tool | Type | What it is | Where |
|---|---|---|---|---|
| P25 | ADS Finance App | Web App | Master ADS finance app (finance.db + dashboards) | `Z:\…\Finance` |
| P26 | H10 Tower-3 Payment Dashboard | Dashboard | Project payment tracking + RISUONA reconciliation | `Z:\…\Finace` |
| P27 | APNRT Accounts Dashboards | Dashboard | Accounting dashboards + Power BI | `Z:\…\Accounts` |
| P28 | ADS AI Heads Deck + Dashboard | Dashboard | Internal leadership strategy deck/dashboard | `Z:\…\Report and road map` |

*(Note: `Veda\Gmail_Tracker` is a tracking spreadsheet — `Mail Tracker-ADS.xlsx` — not a software tool, so it is recorded here but not given a tool card.)*

---

### At a glance
- **24 public tools** across **7 stages** + **4 confidential (internal-only)**
- **Live HTML previews ready (🟢):** H10, P25, TEP, ADS AI BIM Build Tracker, AI Team Hub — *no video needed*
- **Need a screen-recording (🎥):** the remaining 18 (plugins, MCP servers, web apps, automations)
- Full per-tool detail, tech, endpoints and source paths → `Tools_Inventory.xlsx`
