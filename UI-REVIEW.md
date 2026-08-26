# UI Review — AI Research Showcase

**Date:** 2026-08-26
**Method:** [`ui-common-mistakes`](file:///C:/Users/surya%20ASURE/.claude/skills/ui-common-mistakes/SKILL.md) skill, measured audit
**Harness:** Playwright + Chrome 151.0.7922.174, served from the running `http://localhost:8099`
**Pages audited:** all four, at **1440×900** and **390×844** — 8 measurement records, plus 3 targeted verification passes
**Scope:** audit and recommend only. **No site file was modified.**

| Page | URL | Desktop scroller | Scroll height (desktop / mobile) |
|---|---|---|---|
| index | `/` | `.a-view` | 10,726 / 12,754 px |
| tool_template | `/tool_template.html` | `.a-view` | 3,991 / 4,073 px |
| h10 | `/h10.html` | `.a-view` | 2,690 / 3,146 px |
| tool | `/tool.html?id=phoenix-l1` | `document` | 5,778 / 5,791 px |

Reveal handling was verified, not assumed: `.a-view` was stepped to the bottom on desktop and the
document on mobile, then **computed opacity** was read on every `.rv` element.
**0 of 119 `.rv` elements** (91 index + 16 tool_template + 12 h10 + 0 tool) were left below 0.5 opacity.
No "blank section" finding appears in this report because none exists.

---

## 1. Score

### Rubric

Ten categories, **10 points each, 100 total**. Deduct from each category:
**S1 = −4 · S2 = −2 · S3 = −1 · S4 = −0.5**, floored at 0. `PENDING` items deduct nothing.
**Overall** = mean of the four per-page scores, minus 2 for each S1 present on *all four* pages.

| Severity | Meaning |
|---|---|
| **S1 Critical** | Blocks a user or fails accessibility law — contrast < 3:1, no focus indicator, focus into hidden content |
| **S2 High** | Materially degrades usability — contrast 3–4.5:1, target < 24px, missing state, inverted hierarchy |
| **S3 Medium** | Visible inconsistency — scale/radius/shadow sprawl, target 24–44px, missing `:active`, line > 80ch |
| **S4 Low** | Polish — a designer notices, a user rarely does |
| **PENDING** | Owner-confirmed deliberate placeholder. Not a defect, not scored. |

### Result

| Category | index | tool_template | h10 | tool |
|---|---:|---:|---:|---:|
| 1 · Type scale & hierarchy | 9 | 8.5 | 9 | **5** |
| 2 · Colour & palette | 8 | 10 | 10 | 10 |
| 3 · Contrast & legibility | **0** | 6 | 6 | 9 |
| 4 · Shape & shadow | 8 | 8 | 8 | 8 |
| 5 · Interaction states | 8 | 8 | 8 | 8 |
| 6 · View states | 8 | 10 | 10 | 10 |
| 7 · Accessibility | **1** | 5 | 5 | 8 |
| 8 · Responsive & touch | 7 | 9 | 9 | 10 |
| 9 · Layout & alignment | 10 | 10 | 10 | 10 |
| 10 · Density, icons & imagery | 7.5 | 10 | 10 | 8.5 |
| **TOTAL /100** | **66.5** | **84.5** | **85.0** | **86.5** |
| **Band** | Fair | Good | Good | Good |

**Overall = (66.5 + 84.5 + 85.0 + 86.5) / 4 = 80.6 − 0 systemic-S1 penalty = 80.6 / 100 — "Good".**

**Read the spread, not the average.** Three pages sit in the high 80s; `index` drops 18 points below
them. `index` is the only page carrying the tool list, the kind chips and the search field, and that
is where every S1 except one lives. Fixing five things on one page moves the whole site to ~89.

**Severity tally:** 24 unique findings — **5 × S1, 5 × S2, 11 × S3, 3 × S4** — appearing as
**44 page-instances**. Plus 4 PENDING items, not scored.

---

## 2. Findings — ranked, most severe first

Mistake tags: **L18** = Lesson 18 "Common Mistakes" · **CF** = CareerFoundry "10 Common UI Design
Mistakes" · **MZ** = Mizko, *How to NOT Suck at UI Design*.

### S1 — Critical

| # | Page | Element / selector | Mistake | Measured evidence | Fix |
|---|---|---|---|---|---|
| **F1** | index | `input#search` | **L18-8** states · **L18-10** a11y | Focused: `outline-style: none`, `box-shadow: none`, `border-color: rgb(221,226,235)`. Blurred: `outline-style: none`, `box-shadow: none`, `border-color: rgb(221,226,235)`. **Byte-identical — zero visual change on focus.** Confirmed by real `Tab` keypress (stop 34 of 45): `outline = none 3px rgb(14,17,22)`. Fails WCAG 2.4.7. | The global `:where(a,button,input,…):focus-visible` rule is being beaten by `.a-input:focus, .a-select:focus`. Remove the `outline:none` in that rule, or give the field `outline: 2px solid var(--focus); outline-offset: 2px` on `:focus-visible`. |
| **F2** | index, tool_template, h10 | `.a-sidebar` (closed drawer) | **L18-10** keyboard nav | Drawer is at `transform: matrix(1,0,0,1,-306,0)`, `aria-hidden="true"`, **`inert` absent**, and holds **16 focusable controls, all 16 tabbable while closed**. Measured on mobile: **11 of the first 12 Tab stops land off-screen** (`left` = −952 … −62, `onScreen: false`). On desktop 1440: Tab stops **2–17** are all inside the off-screen drawer. `aria-hidden="true"` + focusable descendants is an explicit ARIA violation. | Add the `inert` attribute to `.a-sidebar` while closed and remove it on open. One attribute fixes focus and AT exposure together; drop the now-redundant `aria-hidden` toggle. |
| **F3** | index, tool_template, h10 | `button#navClose.nav-close` | **CF-7** low contrast | Glyph `×` is `rgb(255,255,255)` on an **open** drawer whose background is `rgb(255,255,255)` → **1.00:1** computed. Screenshot pixel at the glyph centre (390×844, drawer open) = `rgb(220,221,225)` on `rgb(255,255,255)` → **1.36:1** including antialiasing. Needs 4.5:1. This is the drawer's only visible close affordance. | Set `.nav-close { color: var(--ink) }` (≈`rgb(14,17,22)`, 18.91:1). The white was inherited from a dark-drawer era; the drawer is now white. |
| **F4** | index | `span.tr-kind` (52 chips) | **CF-7** contrast · **L18-6** palette | Chip text on its own 12 %-alpha fill, all at **10.5px/400** (needs 4.5:1) — **6 of 8 kind colours fail**: Pipeline `rgb(34,230,168)` on `rgb(228,252,245)` = **1.51:1** · Platform `rgb(255,195,77)` = **1.51:1** · Agent `rgb(255,111,177)` = **2.31:1** · Deck `rgb(255,107,133)` = **2.42:1** · Plugin `rgb(128,82,255)` = **3.92:1** · Evaluation `rgb(107,114,128)` = **4.16:1**. Only Dashboard/Connector pass at 5.16:1. Ground-truthed against screenshot pixels: Pipeline **1.51** measured vs **1.51** computed; Plugin **3.91** vs **3.92**. | These are dark-theme neons on a light chip. Re-tone each kind hue to a light-theme step (target ≥ 4.5:1 against its own 12 % fill) — roughly the M3 tonal step 30–40 of each hue. Raise the chip to 12px while you are in there. |
| **F5** | tool | `h3` ×3 ("Efficiency", "What is here", "Status") | **CF-4** hierarchy · **MZ-5** · **CF-7** | `11px / 700 / uppercase / rgb(148,163,184)` on `rgb(247,248,251)` = **2.41:1** (needs 4.5:1). The very next sibling it labels is `16px / 400 / rgb(14,17,22)` = **17.81:1**. **The heading is 5px smaller, 7.4× lower contrast, and visually recessive relative to its own content** — hierarchy inverted. | Keep the eyebrow-label treatment if intended, but take the colour to at least `rgb(100,116,139)` (4.5:1+) and raise to 12px. Mizko's rule: section headings exist so the page can be scanned peripherally — at 2.41:1 they cannot be. |

### S2 — High

| # | Page | Element / selector | Mistake | Measured evidence | Fix |
|---|---|---|---|---|---|
| **F6** | tool | `button.thumb` ×7 (gallery) | **L18-10** a11y · **L18-3** affordance | All 7 are 92×52px with `textContent: ""`, `aria-label: null`, `title: null`, and an inner `<img>` whose **`alt` is the empty string**. Accessible name = none. A screen-reader user hears "button" seven times. Fails WCAG 4.1.2. | `aria-label="Screenshot 1 of 7 — <caption>"` on each button, or give the inner `<img>` real alt text. |
| **F7** | index | `#empty.a-empty` | **CF-8** actionable feedback · **L18-8** states | Triggered live (typed `zzzzqqqxnotathing`): renders correctly, 94px tall, counter updates to "0 of 52". But `aria-live: null`, `role: null` → **screen-reader users get silence when 52 results become 0**. And `hasAction: false` while the copy reads *"Clear the filter or widen the search"* — **it instructs an action and supplies no control to perform it**. | Add `role="status" aria-live="polite"` to `#empty`, and a real `<button>Clear filters</button>` inside it. |
| **F8** | **all 4** | every interactive element | **L18-8** pressed state | CSS rule audit over **1,225 rules (index)** and **1,442 rules (tool)**, 9–10 stylesheets, **0 parse errors**: `:hover` = 52 / 61 · `:focus-visible` = 4 / 7 · `:disabled` = 1 / 1 · **`:active` = 0 / 0**. No element on the site has a pressed state. | Add one rule: `:where(a,button,.btn,.ex-tab,summary):active { transform: translateY(1px); filter: brightness(.96) }`. |
| **F9** | index | `.toollist a` ×52, `input#search` | **CF-9** touch targets | At **390×844**: the 52 "Open …" links are **105.8–271.2 × 16.0 px** — 16px tall, **all 52 under the 24px critical line**. `#search` is **296.6 × 22.0 px**. CareerFoundry's figure is 45–57px (adult index finger 1.6–2 cm); WCAG 2.5.5 minimum is 44×44. | `padding: 14px 0` on `.toollist a` (→ 44px) and `min-height: 44px` on `#search`. The font-size is already 16px, so no iOS zoom regression. |
| **F10** | index | `.tr-kind` Dashboard + Connector | **L18-6** palette · **CF-1** consistency | Both render `rgb(106,63,224)` — **Δ = 0 in normal vision**, before any colour-vision simulation. Two different taxonomy values are colour-coded identically, so the colour coding carries no information for that pair. | Give Connector its own hue at ≥ 4.5:1 (fold into the F4 re-tone). |

### S3 — Medium

| # | Page | Element / selector | Mistake | Measured evidence | Fix |
|---|---|---|---|---|---|
| **F11** | all 4 | page-wide type | **L18-5** random sizes · **MZ-6** | Distinct computed font-sizes: **index 23 · tool 21 · tool_template 17 · h10 15** (desktop). Distinct weights **5** (400/500/600/700/800). Distinct **size+weight pairs: index 37, tool 34, tool_template 23, h10 19**. Material 3's entire scale is 15 roles; index uses 23 sizes. Mizko names "5, 6, 7+ font sizes on a single page" as the amateur tell and asks for 2–3 type styles. | Collapse to a named scale of ~8 sizes × 3 weights as tokens. Some values (`14.44px`, `60.48px`, `92.16px`) are legitimate `clamp()` output — count tokens, not computed values, when you consolidate. |
| **F12** | all 4 | page-wide radii | **CF-1** consistency | Discrete non-zero corner radii, excluding `50%` circles and ≥999px pills: **index 8** (2, 5, 6, 8, 9, 10, 11, 14px) · **h10 8** (2, 4, 5, 6, 8, 10, 11, 14px) · **tool_template 6** (2, 6, 8, 10, 11, 14px) · **tool 5** (2, 6, 8, 10, 12px). Site-wide union = **10 distinct values**. | Three tokens: `--r-sm: 6px`, `--r-md: 10px`, `--r-lg: 14px`, plus the pill. Map every existing value onto them. |
| **F13** | index, tool_template, h10 | `.btn.primary` vs `.btn` (hero pair) | **CF-1** rounded *or* squared | Two CTAs sitting side by side, same row: primary `border-radius: 9999px` (pill), secondary `border-radius: 10px` (rect). Everything else matches — both `15px/600`, `12px 22px` padding, 139×49 and 141×49px. CareerFoundry is explicit: rounded **or** squared, not both. | Pick one. Given `.btn` elsewhere on the site is 10px, make the primary 10px too. *(The primary/secondary weight distinction itself is correct — see §3.)* |
| **F14** | tool | `.overview-media`, `.timeline`, thumbs | **L18-7** unrealistic shadows · **CF-2** | The other three pages use exactly **one** shadow token — `rgba(16,45,70,0.05) 0 1px 2px` — hue-tinted, α 0.05, soft and close. `tool.html` instead ships **4 distinct shadows, 3 of them fully opaque**: `rgb(16,45,70) 0 12px 28px -18px`, `rgb(22,54,81) 0 8px 20px -14px`, `rgb(22,54,81) 0 20px 45px -34px`, plus a `rgba(45,166,106,0.12) 0 0 0 5px` ring. Different light source, different depth language, same site. | Re-express the three as rgba with the site's α scale, or import the shared elevation token. |
| **F15** | index, tool | `p` ×12, `li` | **L18-11** dense text · **MZ-6** | index: 12 paragraphs at `618px / 14px` ≈ **88 characters per line**. tool: `li` at `1002px / 16px` ≈ **125 characters per line**. Target is 45–75ch; Mizko's rule is **9–12 words per line** (≈50–70ch). 125ch is roughly 22 words. | `max-width: 68ch` on `p` and `li` in the prose columns. |
| **F16** | index | 41 `<svg>` icons | **CF-5** iconography | Nominal stroke widths are `1.7px`, `1.6px`, `2px`, `1px`. All share a `0 0 24 24` viewBox and round linecaps, but render at different sizes, so **optical** weights diverge: 1.7px @ 15px = **1.06px** on screen; 2px @ 18px = **1.50px**. A 42% weight difference between icon sets on one page. | Normalise to one optical stroke: set stroke-width per icon so `strokeWidth / 24 × renderedSize` lands on the same value (≈1.25px) everywhere. |
| **F17** | index | `.tr-st.st-production` ×36 | **CF-7** contrast | `rgb(13,138,82)` on `rgb(255,255,255)` at `11.5px/400` = **4.40:1**. Needs 4.5:1. Misses by 0.10 — but on **36 instances**. | Darken to `rgb(9,124,73)` or similar (≈4.8:1). One token change. |
| **F18** | index | `span.lb` "Held back" | **CF-7** contrast | `rgb(107,114,128)` on `rgb(239,242,251)` at **9.5px**/400 = **4.32:1**. Needs 4.5:1. 9.5px is also the smallest text on the site. | Darken to `rgb(90,98,112)` and raise to 11px. |
| **F19** | tool | `.gallery-count`, `#current-count`, spec spans | **CF-7** contrast | `rgb(107,114,128)` on `rgb(236,239,237)` = **4.18:1** at 12px/400 and 14px/500. 3 instances, both viewports. | Darken to ≥ 4.5:1 against that panel fill. |
| **F20** | index, tool_template, h10 | `.nav-toggle` → `.a-sidebar` | **L18-8** states · **L18-10** | On open, `aria-expanded` correctly flips to `"true"` and the scrim appears — but `document.activeElement` is still `nav-toggle`. Focus never enters the drawer, so a keyboard user opens a menu and is still standing outside it. | `.a-sidebar` gets `tabindex="-1"` and `.focus()` on open; return focus to `.nav-toggle` on close. |
| **F21** | index, tool_template, h10 | `.ex-tab` ×9, `.nav-toggle`, `.nav-close` | **CF-9** touch targets | At 390×844: 9 rail filter chips at **105.2–137 × 38.3 px** · `.nav-toggle` **40 × 40** · `.nav-close` **32 × 32** · `.nl` "All work" **63.4 × 16.5**. All below 44×44. | `min-height: 44px` on `.ex-tab`; 44×44 on both nav buttons. |

### S4 — Low

| # | Page | Element / selector | Mistake | Measured evidence | Fix |
|---|---|---|---|---|---|
| **F22** | tool | `.lightbox img` | **CF-10** imagery | One `<img>` with `src = null`, `naturalWidth × naturalHeight = 0×0`, rendered `0×0`, `complete && naturalWidth===0` → counted as broken. It is the lightbox scaffold, so nothing is visibly wrong today. | Omit the `<img>` until a src is set, or ship a 1×1 transparent placeholder. |
| **F23** | tool_template | 2 text nodes | **CF-1** consistency | Font-family census: `Inter` ×43, `JetBrains Mono` ×27, **`monospace` ×2** — two nodes fall through to the browser default instead of the brand mono face. | Add `JetBrains Mono` to those two rules' stacks. |
| **F24** | index | 22 elements | **L18-2** overwhelming animation | 3 distinct `infinite` animations running continuously: `a-illus-fade 9s` ×9, `a-illus-draw 9s` ×4, `hubdrift 2.6s` ×9. None is a loading indicator. **Mitigated**: the page ships **12 `prefers-reduced-motion: reduce` blocks**, so motion-sensitive users are handled — hence S4 not S3. | Consider pausing the illustration loops once they have played through, or on `IntersectionObserver` exit. |

---

## 3. PENDING — deliberate, not defects

Confirmed as intentional placeholders; **excluded from scoring**.

| Page | Item | Measured state |
|---|---|---|
| index | Heads' note on the roadmap (`.heads-note`) | Renders; `.draft-tag` reads "Draft · not approved · placeholder copy" at 4.79:1 — correctly and legibly self-labelled. |
| h10 | H10 embed slot | `div.embed-slot.rv`, **199px tall**, no `src`. Page contains **10 "placeholder" text markers**. |
| index | Contact section placeholders | Present as tagged copy. |
| index | `assets/logos/software/rhino.svg`, `grasshopper.svg` | **HTTP 404 ×2** on both viewports (the only two 4xx responses across all 8 page loads, and the only two console errors on the entire site). Monogram fallback renders — 126 of 126 images on index report `loaded: true`. Already tracked; noted once, not re-litigated. |

The site is intentionally light-theme only and the dark toggle was removed on purpose — **no
dark-theme finding is filed**.

---

## 4. What's already right

This is a well-built site. The 80.6 is dragged down by a handful of concentrated defects on one
page, not by a weak foundation.

**Design system is real, not decorative**
- **125–131 CSS custom properties** on `:root`. Tokens exist and are used.
- **One shadow token across three of the four pages**: `rgba(16,45,70,0.05) 0 1px 2px 0`. This is a
  textbook pass on **CF-2** and **L18-7** — it is *not* the browser default, *not* pure black, it is
  a darker shade of the background's own blue hue, α **0.05**, 1px offset with 2px blur. Soft,
  close, subtle, and one consistent light source. Most sites fail this check; this one nails it.
- **Icons are 100% outlined** — 41 SVGs on index, `outlinedOnly: 36`, `filledOnly: 0`. Consistent
  `0 0 24 24` viewBox and `round` linecaps throughout. **CF-5**'s "all outlined OR all filled" is
  satisfied; only the optical stroke weight (F16) needs a pass.

**Responsiveness is solid**
- **Zero horizontal overflow on all 8 records** — `documentElement.scrollWidth === innerWidth`
  (1440/1440 and 390/390) on every page at both viewports. This is the single most common
  responsive failure (**L18-9**) and the site does not have it.
- **16 media-query breakpoints** in use, and **12–13 `prefers-reduced-motion: reduce` blocks** per
  page — motion accessibility was thought about deliberately.
- The **primary** mobile target is generous: all **52 tool rows** are `<summary>` elements at
  **327.6 × 71.3 px**, and both hero CTAs are **48.5px** tall. The touch-target findings are all on
  secondary controls; the main interaction passes comfortably.

**Accessibility fundamentals are in place**
- `lang="en"`, exactly **one `<h1>`**, a `<main>` landmark, and a **skip-link** on all four pages.
- **A global focus ring exists and works**: `:where(a, button, input, select, textarea, .a-nav-item,
  .tcard, .side-link):focus-visible` → `2px solid rgb(103,72,232)`. Verified by 45 real `Tab`
  keypresses — **44 of 45 stops showed a visible outline**. F1 is one control escaping an otherwise
  correct system, not an absent system.
- **0 positive `tabindex`** values on any page. DOM order is tab order.
- **0 images missing `alt`** across all four pages (126 images on index alone).
- **`Escape` closes the drawer** (transform returns to `-306px`), `aria-expanded` flips correctly,
  and a scrim is present.
- `.gallery-arrow` prev/next carry proper `aria-label="Previous"` / `"Next"`.
- **52 tool rows use native `<details>`/`<summary>`** — keyboard operability for free, no JS
  reimplementation of disclosure. Good instinct.

**Colour is not carrying meaning alone** — the check that matters most in **L18-10**
- CVD simulation found collisions (deuteranopia: Plugin~Pipeline Δ27, Dashboard~Pipeline Δ21,
  Agent~Deck Δ32; monochromacy: Plugin~Evaluation Δ2, Pipeline~Agent Δ3). **None of them costs the
  user anything, because every kind chip and every status pill carries a text label.** The
  `.status-dot` on tool.html has no label of its own, but sits inside `"Production Plugin P01"` — the
  word is right there. That is the correct pattern and it is worth stating plainly, because filing
  those Δ values as findings would have been wrong.
- Status is conveyed by **text**, with colour as redundant reinforcement: "In Progress",
  "Experimental" and "Research" all render the *same* `rgb(107,114,128)` and remain fully
  distinguishable.

**Core legibility is strong**
- Body text `rgb(14,17,22)` on white = **18.91:1**. Lede `rgb(90,100,114)` = **6.00:1**. Primary
  button white on `rgb(106,63,224)` = **6.18:1**. Search placeholder = **4.83:1** — passing, which
  is unusual; placeholder text is the most commonly under-contrasted text on the web.
- Of **554 text nodes measured on index**, **485 pass** at their required ratio, and the 69 failures
  reduce to just **8 unique patterns** — a small number of tokens to fix, not scattered rot.
- Hero text sits on a **verified white ground** (screenshot pixel `rgb(255,255,255)` behind all five
  hero text nodes), not directly on the `hero-bg.mp4` video. This is exactly **MZ-1**'s headline
  mistake — text on an unpredictable photo — and the build already avoids it with a veil.

**Primary vs secondary buttons are correctly differentiated** (**CF-3**)
Primary: filled `rgb(106,63,224)`, white text. Secondary: white fill, `rgb(14,17,22)` text, 1px
`rgb(221,226,235)` border. Same size and weight, different visual weight — the primary gets the
colour, the secondary stays visible but quiet. Precisely the prescribed relationship. Only the
mismatched corner radius (F13) lets it down.

**Empty state exists and the copy is good** — "Nothing matches that scope / Clear the filter or
widen the search." Specific, plain, non-blaming, and the counter honestly reports "0 of 52". It
needs `aria-live` and a button (F7), but the hard part — someone remembered to write it — is done.

---

## 5. Could not test

| Item | Why |
|---|---|
| Real screen-reader announcement (NVDA / JAWS / VoiceOver) | Not available in this environment. All AT findings (F2, F6, F7) are derived from the accessibility tree, ARIA attributes and computed names — high confidence, but not the same as hearing it. |
| Physical touch accuracy | Emulated touch only (`has_touch`, `is_mobile`). Target sizes are measured px; thumb-reach and mis-tap rates are not. |
| Loading state | `.evo-loader` is present in the index markup, but was already removed/hidden by the time `networkidle` fired. Capturing its rendered content needs deliberate network throttling, which I did not apply. Not filed as a finding in either direction. |
| Error state | Would require an invalid `?id=` on `tool.html` or a forced fetch failure. Both fall outside the four URLs I was asked to audit, so I did not navigate there. **`tool.html` with a bad id is untested and worth a follow-up.** |
| Image relevance & quality (**CF-10**) | Automatable parts were checked (broken, upscaled > 1.15×, missing alt). "Relevant, high quality, realistic, not staged stock" is a human judgement and I did not make it. |
| Tablet / 768px layout | Only the two required viewports were run, though 16 breakpoints exist — several between 520px and 1240px are unexercised by this audit. |
| Print stylesheet | `no-print` classes exist on the topbar, sidebar, titleblock and footer. Print rendering was not audited. |
| Visual quality of the rhino/grasshopper monogram fallback | I confirmed the two 404s and that no image reports broken; I did not judge how the fallback looks. |
| `cms.html`, `login.html`, `dist/*`, `projects/*` | Out of the stated scope (four pages). Note that `dist/` holds four alternative full-site builds that will drift from these findings. |

---

## 6. Recommended order of work

1. **F1** — one CSS rule. Restores the focus ring on the search field. *(index +4)*
2. **F2** — one `inert` attribute. Removes 16 phantom tab stops from three pages. *(+4 ×3)*
3. **F3** — one colour value. Makes the drawer close button visible. *(+4 ×3)*
4. **F4 + F10** — re-tone the 8 kind colours for the light theme, giving Connector its own hue. *(index +6)*
5. **F5** — two values on `tool.html` h3. *(tool +4)*
6. **F6, F7, F9** — accessible names, `aria-live` + a Clear button, and padding on the row links.

Steps 1–5 are roughly an hour of work and take the site from **80.6 to ≈ 89** — top of the "Good"
band, with `index` moving from Fair (66.5) to Good (~85).

---

*Audited with the `ui-common-mistakes` skill. Every number above was re-measured from the captured
measurement JSON at write-up time; the six worst contrast values were additionally ground-truthed
against screenshot pixels (Pipeline 1.51 measured vs 1.51 computed; Plugin 3.91 vs 3.92). No site
file was modified.*
