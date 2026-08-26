/* Featured tools for the exhibition build.
 *
 * Six tools carry the story on the landing page; the other 46 are bucketed by
 * kind below them. Selection rule, so it can be defended and repeated:
 * status === 'production' AND a real description exists AND the six together
 * span plugin / dashboard / pipeline / connector / platform — i.e. the whole
 * chain from "inside Revit" to "a client can read it".
 *
 * MARKS (2026-08-26). Each tool now carries one strong glyph, a short name and
 * a single category word, after the EvolveLab product-family strip Surya sent
 * as reference. Marks live in assets/visuals/marks/ as self-contained SVG:
 * brand tile -> white disc -> one geometric idea. No tool gets two ideas.
 * `short` + `cat` drive both the strip under the hero and the card tile, so
 * the two can never drift apart.
 *
 * COPY (2026-08-26). `why` lines rewritten against the competitor research in
 * 2_RESEARCH/competitor_copy_research/_FINDINGS-aec.md, lesson 5: attach the
 * pain to a person who is accountable, not to a system. Test applied to every
 * line — "whose weekend does this ruin, and whose signature is on it?"
 *
 * Every `what` / `helps` line is still derived from the tool's own record in
 * content/<id>.json. Nothing here asserts a capability the record does not.
 * Hours are the recorded manualHrsPerWeek -> aiHrsPerWeek pair, and every one
 * of those is flagged draft:true in the data, so the UI must keep them hedged.
 */
window.FEATURED = [
  {
    id: 'phoenix-l1',
    mark: 'assets/visuals/marks/phoenix.svg',
    short: 'Phoenix', cat: 'Model certification',
    why:   'Someone has to walk the model every week and sign that it is clean. Miss something and it leaves the office anyway — with your name on the certificate.',
    what:  'A Revit add-in that runs 22 model-health checks across 5 quality gates in one click.',
    helps: 'Certification becomes a record you can produce, instead of a recollection you have to trust.',
    hours: { before: 4, after: 0.5, draft: true }
  },
  {
    id: 'h10-dashboard',
    mark: 'assets/visuals/marks/h10.svg',
    short: 'H10', cat: 'Client visibility',
    why:   'The client rings to ask where the project stands. Someone stops the work they were doing and writes the answer out by hand.',
    what:  'A live dashboard showing the stage timeline, discipline status, and a plain explanation of how the delivery works.',
    helps: 'The client reads it directly, in the studio’s own language, so nobody loses an afternoon to a status email.',
    hours: { before: 3, after: 0.5, draft: true }
  },
  {
    id: 'architecture-boq-template',
    mark: 'assets/visuals/marks/boq.svg',
    short: 'BOQ engine', cat: 'Quantity take-off',
    why:   'Quantities get read off the model, typed into a sheet, then typed again into the BOQ. Every retype is somewhere a billable number can quietly go wrong.',
    what:  'Extracts quantities from native Revit parameters, classifies them against Uniclass, and formats structured BOQ lines.',
    helps: 'The model becomes the source of the quantity document, rather than something you transcribe from.'
  },
  {
    id: 'ads-bridge',
    mark: 'assets/visuals/marks/bridge.svg',
    short: 'ADS Bridge', cat: 'Interoperability',
    why:   'Every new automation had to invent its own way into Revit first. So every new idea started from nothing, and most of them stopped there.',
    what:  'A local MCP server over the pyRevit ADS_Bridge API — query the model, run code, set parameters, take screenshots.',
    helps: 'One connection the other tools stand on. This is plumbing, and it is why the rest of the catalogue could be built quickly.'
  },
  {
    id: 'ai-team-hub',
    mark: 'assets/visuals/marks/hub.svg',
    short: 'Team Hub', cat: 'Coordination',
    why:   'The AI work lived in chat threads, scattered folders and a few people’s heads. Ask who is building what and you got three different answers.',
    what:  'A single interface for overview, work priorities, requirements, team and procedures.',
    helps: 'One place to see what is being built and who is on it.'
  },
  {
    id: 'feasibility-massing-tool',
    mark: 'assets/visuals/marks/massing.svg',
    short: 'Massing', cat: 'Feasibility',
    why:   'Every feasibility option meant redrawing the same site tests by hand, against a deadline, before anyone had settled the brief.',
    what:  'Draw a site in the browser, apply NBC and Telangana GO rules, generate massing, export geometry to Rhino, download a deck.',
    helps: 'Compresses the front end of a project — site outline to something you can put in front of a client.'
  }
];
