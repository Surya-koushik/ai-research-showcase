/* Featured tools for the exhibition build.
 *
 * Six tools carry the story on the landing page; the other 46 are bucketed by
 * kind below them. Selection rule, so it can be defended and repeated:
 * status === 'production' AND a real description exists AND the six together
 * span plugin / dashboard / pipeline / connector / platform — i.e. the whole
 * chain from "inside Revit" to "a client can read it".
 *
 * Every `why` / `what` / `helps` line is derived from the tool's own record in
 * content/<id>.json. Nothing here asserts a capability the record does not.
 * Hours are the recorded manualHrsPerWeek -> aiHrsPerWeek pair, and every one
 * of those is flagged draft:true in the data, so the UI must keep them hedged.
 */
window.FEATURED = [
  {
    id: 'phoenix-l1',
    why:   'The weekly Level-1 self-certification was a manual walkthrough of the model — slow, and only as consistent as whoever ran it that week.',
    what:  'A native Revit add-in that runs 22 model-health checks across 5 quality gates in a single click.',
    helps: 'Produces the pass/fail audit report automatically, so certification is a record rather than a recollection.',
    hours: { before: 4, after: 0.5, draft: true }
  },
  {
    id: 'h10-dashboard',
    why:   'Clients could not see where their project or their model actually stood without asking someone.',
    what:  'A live dashboard showing the stage timeline, discipline status, and a plain explanation of how the delivery works.',
    helps: 'The client reads it directly, in the studio’s own language, instead of waiting for a status email.',
    hours: { before: 3, after: 0.5, draft: true }
  },
  {
    id: 'architecture-boq-template',
    why:   'Quantities were pulled out of the model by hand and then retyped into BOQ lines.',
    what:  'Extracts quantities from native Revit parameters, classifies them against Uniclass, and formats structured BOQ lines for fabric, finishes, openings and joinery.',
    helps: 'The model becomes the source of the quantity document rather than something you transcribe from.'
  },
  {
    id: 'ads-bridge',
    why:   'Every new automation needed its own bespoke way into Revit.',
    what:  'A local MCP server exposing the pyRevit ADS_Bridge HTTP API — query the model, run IronPython, set parameters, run pipelines, take screenshots.',
    helps: 'One connection the other tools stand on. This is plumbing, and it is why the rest of the catalogue could be built quickly.'
  },
  {
    id: 'ai-team-hub',
    why:   'AI work was spread across chats, folders, and people’s heads.',
    what:  'A single interface for overview, work priorities, requirements, team, procedures, tools and settings.',
    helps: 'One place to see what is being built and who is on it.'
  },
  {
    id: 'feasibility-massing-tool',
    why:   'Early feasibility meant redrawing the same site tests by hand for every option.',
    what:  'Draw a site in the browser, apply NBC and Telangana GO rules, generate massing, export geometry to Rhino/Grasshopper, and download a PPTX deck.',
    helps: 'Compresses the front end of a project — from site outline to something you can put in front of a client.'
  }
];
