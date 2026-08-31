/* still_manifest.js — hand-curated, NOT auto-scanned like preview_manifest.js.
   ----------------------------------------------------------------------------
   Screenshot fallback for cards that have no assets/previews/<slug> video --
   the second of the three tiers (video -> real screenshot -> clean text-only
   card) from Surya's Fix 1, 2026-08-31.

   Why hand-curated: projects/<id>/screenshots/ holds 6 folders total.
   phoenix-l1 and revit-mcp already have a video preview, so their screenshots
   are unused here. asurebimqc's only file is an SVG workflow diagram, not a
   captured screenshot. That leaves three candidates, and each was opened and
   read frame-by-frame against the privacy floor before being listed:
     - archviz-suite      hero.jpg -- a generic AI-rendered masterplan, clean.
     - deck-enterprise-ai hero.jpg -- a templated title slide ("Your
       Organization x Asure"), no real client name, clean.
     - deck-roadmap-v2    EXCLUDED. Both hero.jpg and 01.jpg name a real
       project as "Phoenix Avance - H10" -- Phoenix/H10T4A are on the banned
       list. That tool falls through to the text-only card instead; a blind
       directory scan would have shipped it.
   Re-check any addition the same way before adding a line here. */
window.STILL_MANIFEST = {
  "archviz-suite": "projects/archviz-suite/screenshots/hero.jpg",
  "deck-enterprise-ai": "projects/deck-enterprise-ai/screenshots/hero.jpg"
};
