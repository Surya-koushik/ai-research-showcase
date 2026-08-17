# ASURE — Tools & Systems Registry

The single connectable index of **every AI tool, plugin, MCP server, dashboard, automation and research artifact** built across the studio — with what each one does, its tech, where it sits in the workflow, and **how to reach its server** if it runs one.

Lives in **Y only** (internal). The public showcase stays sanitized (project codes, no client names); this registry holds full internal detail.

## What's here

| File | What it is |
|---|---|
| `MASTER_TOOLS_REGISTRY.md` | Human-readable registry — 40 tools grouped by category, each with description, status, tech, workflow stage, server, start command, source path. Starts with a Server Quick Index. |
| `SERVER_LOCATIONS.md` | Just the running services — endpoint/port + start command + source, for anyone who needs to connect. |
| `tools.json` | Machine-readable version of the same data (drives future automation / the showcase). |
| `units/` | One raw JSON per source unit (`u001.json`…) + `manifest.tsv` (the curated unit list). |
| `_pipeline/` | The three scripts that generate all of the above — re-runnable. |

## How it was built (100% local — zero Claude credits for the reading)

The bulk reading/summarising was done by a **local model** on the studio GPU — **Ollama `qwen2.5vl:7b`** — not the cloud. Claude only orchestrated and assembled. Sources scanned:

- `Y:\CLAUDE DIRECT ACCESS FOLDER\` (incl. `2_MCPS`, root tools)
- `Z:\00 SM TEAM\AI Research\` (+ its `Claude direct access folder\2_MCPS`)
- `Z:\00 SM TEAM\Surya Koushik\` — **ComfyUI workflows & ChatGPT memory excluded** per instruction
- `Z:\Knowledge Centre\AI Tools\`
- `C:\Users\surya ASURE\Downloads\Claude\` (active project work)

Each tool's own README / HANDOFF / manifest / main code / config was fed to the model with a strict JSON schema; server ports/endpoints were also regex-scraped from configs. **Every field is derived from the tool's own files — nothing invented.** Endpoints marked *(detected)* are best-effort; verify before connecting.

## Regenerate (when tools change)

Run the three pipeline steps (Ollama must be running on `11434`):

```
# 1. curate the unit list (Git Bash)
bash "registry/_pipeline/1_build_manifest.sh"

# 2. extract each unit with the local model (PowerShell) — resumable, ~3 min
& "registry/_pipeline/2_extract.ps1"

# 3. assemble the registry + server index + tools.json (PowerShell)
& "registry/_pipeline/3_assemble.ps1"
```

To add a new source location, edit the `PARENTS` / `UNITS` arrays in `1_build_manifest.sh`. To use a bigger/smaller local model, change `$model` in `2_extract.ps1` (e.g. `qwen2.5:32b` for higher accuracy, slower).

## Coverage (this run)

40 unique tools — 16 tools/apps · 11 plugins · 5 dashboards · 3 MCP servers · 2 AI agents · 2 research · 1 knowledge base. **12 expose a server** (see `SERVER_LOCATIONS.md`).

## Connecting to a service

Open `SERVER_LOCATIONS.md`, find the tool, use its endpoint + start command. Known-good on this machine: Ollama `11434` · Headroom proxy `8787` · pyRevit Routes `48884/48885`. Anything marked *(detected)* — confirm the port in the tool's own config first.

## Confidentiality

This registry is **internal (Y)**. Entries flagged `[CONFIDENTIAL]` contain client/personal detail — sanitize (codes only, no client names, no internal IPs) before anything goes into the public showcase or leaves the team.
