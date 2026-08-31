# Asure Intelligence — showcase

## Register

**Brand.** Design IS the product here.

Confirmed by Surya, 2026-08-31. This site is shown to investors and stands on an exhibition
floor. Nobody arrives to complete a task; they arrive to be convinced that a mid-size
architecture practice built a real body of software. The design carries that argument, so it
gets bolder typography, committed colour and actual art direction — not the quiet utility of
the studio's dashboard UI.

The tool browser inside it behaves like product UI. That is a component within a brand
surface, not a change of register.

## Who it is for

- **Investors and funders** — need to believe the work is real, built in-house, and running
  on live projects. They will check.
- **Visitors at an exhibition stand** — passing traffic, minutes not hours, often standing.
  The first screen has to do most of the work.
- **Prospective hires and collaborators** — want to see what they would be joining.
- **The studio itself** — it is also the catalogue of record for 70 internal tools.

## What it is

A record of every AI tool, plugin, pipeline, dashboard and agent Asure Design Studio has built
for its own use. 70 entries, growing. Some run on live projects daily; most are still being
built. The site says which is which, per tool, and refuses to blur the line.

## Brand personality

Plain-spoken, technical, unshowy, and unusually honest about its own limits.

The distinctive thing about this studio is not that it built AI tools — everyone claims that.
It is that it will tell you only five of them have been measured, and leaves the rest without
a number rather than estimating one. That restraint IS the brand. The design should feel like
it comes from people who would rather show you the thing running than describe it.

## Anti-references

Surya named these directly. The design fails if it lands anywhere near them.

1. **A generic SaaS landing page.** Gradient hero, three feature cards, testimonial row,
   pricing table. The default output, and the first reflex to refuse.
2. **A developer-tool dark site.** Terminal green, monospace everywhere, black background.
   The category reflex for anything technical — and the second-order trap, since avoiding
   SaaS usually lands here.
3. **A corporate consultancy deck.** Navy, stock photography, safe, forgettable.

Not named but worth holding: **an architecture practice website** — full-bleed project
photography, thin serif, acres of white. This is an architecture studio, so that is the
category reflex sitting closest to hand. The site is about software, not buildings.

## Strategic design principles

1. **Show it running.** A tool with footage beats a tool with a description. 21 of 70 have
   video; the rest are honestly text. Never fabricate a visual to fill a card.
2. **Never state what the evidence does not support.** No invented numbers, no capability
   claims that cannot be traced to a real file. Two tools were caught claiming things they
   could not do and were rewritten.
3. **No fixed totals.** The catalogue grows; a printed number is stale on arrival. Counts are
   derived live or not shown.
4. **No client names.** Four tools carried them and were renamed. This is not a preference,
   it is a rule.
5. **Depth, not decoration.** Background work means layered surfaces and real structure behind
   content, tied to scroll. Nothing bolted on for effect.

## Accessibility

Body text ≥4.5:1, large text ≥3:1, checked not assumed. Full keyboard operation with a visible
focus ring. Every animation has a `prefers-reduced-motion` alternative. Read on an exhibition
floor under bright light, often at arm's length — contrast matters more here than usual.

## Constraints

- Static site, no build step, no framework. `content/*.json` is the source of truth; a Python
  script derives the bundle.
- Self-contained: no CDN, no external fonts, no analytics.
- Built on the studio's own UI kit (`assets/vendor/asure-ui-kit/asure-ui.css`) with the
  site's violet accent `#6A3FE0` layered on top.
