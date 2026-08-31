# Asure motion identity

One motion language for **both** the showcase site and the brand film. Surya, 2026-08-31:
*"use this skill in website and video as well."* If the site and the film ease differently,
they read as two products. This file is the single source of truth for both.

Built on the LottieFiles `motion-design` skill
(`Downloads\Claude\.agents\skills\motion-design`). Invoke it with the Skill tool before
any motion work. **Driver owns this file** — leaves read it, no leaf rewrites it.

---

## Archetype: PREMIUM

The skill offers four (Playful / Premium / Corporate / Energetic). Ours is **Premium**, and
it is not a close call:

| | Premium says | Surya said |
|---|---|---|
| Duration | 350–600ms | *"everything glides"* |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` | *"heavy ease-out, almost no ease-in"* |
| **Overshoot** | **0%** | *"no overshoot, no bounce"* |
| Keywords | elegant, minimal, luxury, sophisticated | *"calm confidence, not hype"* |

This confirms the film spec independently: `back.out` stays banned. Anything that bounces
is off-archetype, on the site as much as in the film.

Emotional target is **Elegance** (long arcs, 400–700ms) shading into **Calm** (sine
ease-in-out, 500–1000ms) for ambient layers. Never Urgency, never Joy.

---

## The three brand constants

The skill asks for exactly three. These are ours. Use them everywhere; deviate only with
a stated reason.

### 1. Signature easing — 80% of all motion
```
--ease-signature: cubic-bezier(0.4, 0, 0.2, 1);   /* on-screen, the default */
--ease-entrance:  cubic-bezier(0.05, 0.7, 0.1, 1); /* MD3 emphasized — arrivals */
--ease-exit:      cubic-bezier(0.3, 0, 1, 1);      /* accelerate — departures */
--ease-ambient:   cubic-bezier(0.4, 0, 0.2, 1);    /* sine-ish, seamless loops */
```
GSAP equivalents: `power2.out` (signature/entrance), `power2.in` (exit), `sine.inOut`
(ambient). **`back.out` and `elastic` are not in the system.**

### 2. Duration palette — three, plus one film-only
```
--dur-quick:    180ms   /* hover, press, toggle, icon swap */
--dur-standard: 380ms   /* cards, panels, nav, tool tiles — the workhorse */
--dur-slow:     600ms   /* section reveals, modals, band transitions */
--dur-dramatic: 900ms   /* FILM ONLY — a theatrical beat, never in the UI */
```
**Distance scales duration**: 100px = base, 200px = 1.3x, 400px = 1.6x.
**Entrances run 30–50% longer than exits.** People care about what appears.

### 3. Entrance pattern — one, used everywhere
**Rise + blur-in.** Every element that arrives, on both surfaces, does this and nothing else:
```
from: translateY(14px)  filter: blur(8px)   opacity: 0
to:   translateY(0)     filter: blur(0)     opacity: 1
duration: var(--dur-standard)   easing: var(--ease-entrance)
```
Film text reveals word-by-word on the same values, **stagger 90ms**.

Consistency here is what makes a site feel authored rather than assembled. One entrance,
everywhere, no exceptions for "this section is special."

---

## Three layers — the rule that fixes "feels cheap"

The skill is blunt: *flat animation = missing layers*. Every scene, every section, carries
all three. This is the specific diagnosis for our film reading as a template.

| Layer | Site | Film |
|---|---|---|
| **Primary** | the card / tile the eye follows | the panel the camera is passing |
| **Secondary** | hairline brightening, shadow lift, icon shift | label chip settling, glow bloom on the panel edge |
| **Ambient** | the band's gradient drifting, orb pulse | bloom centre drifting, bokeh between light lanes, packets on the bridge |

**The ambient layer never stops.** If a frame has nothing moving in the background, a layer
is missing.

---

## Stagger budget
| Pattern | Delay | Span cap | Where |
|---|---|---|---|
| Micro cascade | 30ms | 200ms | tool grid cells, tag pills |
| **Standard** | **90ms** | **360ms** | cards, panels, nav items, film word reveals |
| Dramatic | 150ms | 600ms | hero, film act openings |

Hard cap: **no stagger span exceeds 500ms.** Past that it reads as lag, not choreography.

---

## The 1/3 rules, and how the film satisfies them

The skill states two:
1. No motion travels more than 1/3 of the screen without an intermediate keyframe.
2. With 3+ elements, no more than 1/3 are in active motion simultaneously.

**These govern elements, not the camera.** Do not "fix" the film's continuous camera move
to comply — that would undo the entire rebuild.

In fact the film's core decision satisfies rule 2 perfectly: tool panels are **static in
world space** with zero rotation, and all apparent movement comes from the camera dollying
past them. Elements in active motion: **zero**. The skill and Surya's *"show them front
face, not distorted"* arrive at the same place from different directions.

Rule 1 applies to elements sliding within a scene — card carousels, light lanes, text
fragments. Give those an intermediate keyframe.

**Counter-motion** (skill: *hero moves right → ambient moves left at 20–30% speed*) is
already in the film spec: the card carousel slides left while the camera travels right.
Adopt the same device on the site for any horizontal rail.

---

## Quality rules — never break these

1. **Never linear for spatial movement.** Linear is only for spinners and progress bars.
2. **Never opacity-only** for a meaningful state change — pair it with position or scale.
3. **Never exceed 1/3 screen** without an intermediate keyframe.
4. **Always all three layers.**

Troubleshooting map, worth memorising:

| Symptom | Cause | Fix |
|---|---|---|
| robotic | linear easing, no arcs | easing curves + arc paths |
| too slow | duration wrong for element type | check the palette above |
| **cheap / flat** | **missing secondary + ambient** | **add shadow motion + background life** |
| distracting | too many elements moving | apply the 1/3 element rule |
| no personality | generic easing everywhere | apply Premium consistently |

"Cheap / flat" is our recurring one. The fix is layers, not more animation.

---

## Which motion skills to use, and for what

Nine candidates were evaluated head-to-head on 2026-08-31 against our real constraints
(vanilla no-build site, headless GSAP film, Premium register, scroll/parallax/choreography
over button micro-interactions). Full comparison with fit scores:
`Downloads\Claude\_coordination\board\MOTION-SKILL-EVAL.md`.

**Foundation — `motion-design` (LottieFiles).** Use in full. Framework-agnostic, and the
only one scoring 5/5 on both "one language across site and film" and Premium/calm fit.

**Three narrow complements. Use only the named parts** — adopting whole overlapping skills
adds noise, not quality:

| Skill | Use | Ignore |
|---|---|---|
| `ibelick/ui-skills@fixing-motion-performance` | **all of it** — blur ≤8px cap, scroll-timeline over JS scroll listeners, transform/opacity only. Pure engineering hygiene, zero overlap. Protects the vanilla site's scroll perf and the headless render. | — |
| `dembrandt@motion-and-storytelling` | **Cinematic Techniques** (parallax, cut vs dissolve, scene-setting) and **Comic Book Conventions** (panel sequence, "the gutter" = transitions). Real vocabulary for continuous-camera work that nothing else names. | its Disney restatement — LottieFiles already covers it |
| `mblode/agent-skills@ui-animation` | **reverse-engineering motion from a screen recording**, and its choreography/review formats. Nothing else can extract real timing and easing curves from footage — it can verify the site's curves against the finished film's. | its default duration/easing table — snappier SaaS, off-archetype |

**Rejected, on reading the actual files rather than the names:** `lukasstrickler@ui-animation`
(Framer Motion / Radix / `layoutId`), `199-biotechnologies@motion-dev-animations` (Motion.dev
React/Next/Svelte), `motiondivision/ai-kit@motion` (needs the `motion` npm package even in its
"vanilla" mode — violates no-npm-at-runtime), `secondsky@motion` (`.tsx` templates).
`travisjneuman@ui-animation` skipped: its one useful asset is a GSAP ScrollTrigger parallax
snippet, small enough to hand-write.

**Two listed "candidates" were catalogue stubs, not skills.** `podo@motion-design-skill`
declares `upstream: lottiefiles/motion-design-skill` — it is the incumbent, re-listed.
`podo@fixing-motion-performance` points at `ibelick/ui-skills`. Install counts on aggregator
listings are not evidence of a distinct skill.

### Contradiction ruling — settled, do not re-litigate

`dembrandt@motion-and-storytelling` conflicts with this document twice. **This document wins
both times.** It is written for interactive SaaS UI; we are making a cinematic brand film and
a brand-register site.

| It says | We say | Ruling |
|---|---|---|
| 10–15% overshoot on success/confirmation states | **0% overshoot**, `back.out`/`elastic` banned | **Ours.** Overshoot is the single clearest tell of the wrong archetype, and Surya named it directly: *"no overshoot, no bounce."* |
| cap ~400ms; ">600ms is almost always too long" | 600ms slow, 900ms film-only dramatic | **Ours.** That cap is a UI-responsiveness rule. A theatrical reveal in a brand film is not a button. |

No other candidate contradicted this document.

## Accessibility — non-negotiable

`PRODUCT.md` requires a `prefers-reduced-motion` alternative for every animation, and the
site is read on an exhibition floor. Under reduced motion: **no transforms, no blur, no
parallax.** Opacity cross-fade only, capped at `--dur-quick`. The ambient layer stops.

Content must never depend on motion to be understood.
