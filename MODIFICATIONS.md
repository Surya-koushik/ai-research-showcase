# Modification list — from Surya, 2026-08-25

Read back for confirmation. **Nothing here is started.** Items are grouped by
where they land, not by the order they were dictated. Reference images are
numbered as sent: 1 Clarivate, 2 Knowledge-Hub diagram, 3 BCG CEO Agenda,
4 Services cards, 5 Explore-by-category, 6 Chaos vertical tabs, 7 Autodesk
mega-menu, 8 SketchUp integration icon row.

---

## A. Chrome — sidebar, topbar, nav

| # | Item | Notes |
|---|---|---|
| A1 | Sidebar contents go behind a **hamburger**, not visible on load | Currently a permanent 232px rail |
| A2 | Top-left brand becomes **EVOLVE** only | `assets/loader/evolve.png` exists |
| A3 | **Asure** moves to the bottom of the sidebar | Currently top |
| A4 | Remove **"AI Research & Innovation"** from the topbar | Repeated too many times across the page |
| A5 | Topbar right: **add proper navigation points** | Currently THE SYSTEM / WHAT WE BUILD / ALL WORK |
| A6 | Keep the **52 chip last** in that nav | Numbers stay here, leave the CTAs |
| A7 | **Remove the dark/light toggle** — one version only | See decision D1 |

## B. Hero

| # | Item | Notes |
|---|---|---|
| B1 | **Full-bleed background video**, reference 1 (Clarivate) | `12686081_3840_2160_30fps.mp4` |
| B2 | Video sits **behind** the existing HTML canvas animation | Must complement, never overpower |
| B3 | Video is **hero-only** — vanishes past that section | |
| B4 | **Adjust hero text size** | |
| B5 | **Cut the lede down** — "too much extra" | Rewritten earlier today; still too long |
| B6 | **No numbers in the CTA buttons** | "See all 52" → no count |
| B7 | **Adjust button size** | |

## C. "What we have built so far"

| # | Item | Notes |
|---|---|---|
| C1 | Rebuild as **cards with icons**, references 4 + 5 | Neat, clean, not crowded |
| C2 | **Scroll-in load animation** on the cards | |

## D. Roadmap — new layer

| # | Item | Notes |
|---|---|---|
| D1 | Add a proper **roadmap section** showing the end-to-end procedure | Source: `1_PRESENTATIONS/AI road map data/ADS_AI_Roadmap_Output` |
| D2 | Show **integrations converging into a central intelligence**, reference 2 | Reserve generous space; rough HTML acceptable |
| D3 | **Heads' note / direction block at the top**, reference 3 (BCG) | See question Q2 — I will not invent this |

## E. Kinds of tool

| # | Item | Notes |
|---|---|---|
| E1 | Simple per-kind indication, references 4 + 5 | |
| E2 | **"How the tools connect" — remove** | "if that is not needed, we can skip" |

## F. All tools

| # | Item | Notes |
|---|---|---|
| F1 | Rebuild against references 6 + 7 (+ 8, see Q5) | Vertical tabs / structured mega-menu |
| F2 | **Reduce visual clutter** — clear direction, no overcrowding | The governing principle for this section |
| F3 | Use **specific logos, never generic** | 26 in `assets/logos/software/` |
| F4 | Where items are many, use a **numbered / indexed reference** | |
| F5 | Clicking a tool opens a **dedicated page** | |

## G. Tool pages

| # | Item | Notes |
|---|---|---|
| G1 | **Rebuild `tool_template.html` to match the main site UI** | See finding 2 — this is a rebuild |
| G2 | Integrate the template into the site so tools resolve to real pages | |
| G3 | Per-tool dropdown explaining what each one actually does | Even where the name seems self-evident |

## H. Contact

| # | Item | Notes |
|---|---|---|
| H1 | **Contact section at the end**, content sourced from asure.in | Needs a fetch — see Q4 |

---

## Two findings that change the scope

**Finding 1 — the video needs transcoding first.**
It is 3840×2160, H.264, **12.0s, 20MB**. As a hero background that is heavy —
4K decode on every page load, for a element that will render at ~1400px wide.
I would produce a 1920×1080 loop at roughly 2–4MB plus a poster frame, and keep
the original untouched. It is also only 12 seconds, so the loop point will be
visible unless it cuts on motion.

**Finding 2 — `tool_template.html` shares no CSS with the site.**
This is why it looks unchanged. It is a 69-line self-contained file with its own
inline design system — navy `#163651`, teal `#2f9e96`, lime `#d9ff58`, its own
type scale, its own sidebar and right rail. The main site runs on `theme.css`
tokens with violet `#7c5cff`. There is an unused `assets/css/tool-page.css`
sitting in the repo, which suggests this migration was already intended and
never done.

So G1 is not a restyle — it is rebuilding the page on the site's design system.
It is the largest single item on this list and I would treat it as its own pass.

---

## Questions that block work

**Q1 — Theme.** Removing the toggle (A7) settles the open bug in `HANDOFF.md` §1:
`light.css` and `dala.css` force `html, body` with `!important`, which is why the
toggle never worked. Confirm **light is the version we keep** and I will remove
the toggle and strip the dead dark-theme tokens.

**Q2 — The heads' note (D3).** I will not write words and attribute them to the
heads. Either send me their actual text, or say explicitly that you want a draft
clearly marked as placeholder for them to approve.

**Q3 — How many tool pages (F5/G2)?** 52 tools. Options: (a) build the template
plus 3–5 real pages and route the rest to a stub, (b) generate all 52 from
`projects.js` with real content where it exists, (c) build the template only and
wire pages later. Content, not code, is the constraint here.

**Q4 — asure.in (H1).** Confirm I may fetch the live site to pull contact
details, or paste what you want used.

**Q5 — Reference 8** (SketchUp integration icon row) was not assigned. Is it for
the all-tools page alongside 6 and 7, or for the roadmap integrations diagram?

**Q6 — Order.** My proposed sequence, each stopping for your review:
1. Chrome + hero (A + B) — most visible, self-contained
2. Cards + kinds (C + E)
3. Roadmap (D) — largest content dependency
4. All tools + tool pages (F + G) — largest build
5. Contact (H)

---

## Not in scope unless you say so

- `dist/asure-showcase-dala.html` is a generated bundle, already stale.
- Nine branches still exist; `final/tool-template` was the last coherent state.
- Nothing is committed. `index.html`, `hero.js`, `HANDOFF.md` are modified.
