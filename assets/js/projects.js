/* ============================================================================
   projects.js  —  THE DATA MODEL for the whole showcase.
   ----------------------------------------------------------------------------
   ADD A NEW TOOL = append one object to PROJECTS[] below and (optionally)
   drop media into  projects/<id>/{screenshots,videos,html,docs}/.
   Nothing else changes. index.html + tool.html render everything from here.

   NUMBERS RULE: never exaggerate. Set efficiency.manualHrsPerWeek and
   efficiency.aiHrsPerWeek from real, consistent observation. Everything else
   (hours saved, speed multiple, % efficiency) is DERIVED by one formula in
   derive() so figures can never contradict each other. While a number is an
   estimate, keep  draft:true  — the UI shows a visible "DRAFT" badge until you
   confirm it. If a tool's time-saving isn't measured yet, set efficiency:null.
   ============================================================================ */

/* ---- Category taxonomy (label + monochrome inline icon key) ---- */
const TAXONOMY = [
  { id:'all',          label:'All Projects',   icon:'grid' },
  { id:'ai-agents',    label:'AI Agents',      icon:'bot' },
  { id:'automation',   label:'Automation',     icon:'zap' },
  { id:'dashboards',   label:'Dashboards',     icon:'gauge' },
  { id:'plugins',      label:'Plugins',        icon:'plug' },
  { id:'bim',          label:'BIM',            icon:'cube' },
  { id:'revit',        label:'Revit',          icon:'building' },
  { id:'research',     label:'Research',       icon:'flask' },
  { id:'data',         label:'Data Analytics', icon:'chart' },
  { id:'vision',       label:'Vision AI',      icon:'eye' },
  { id:'llm',          label:'LLMs',           icon:'brain' },
  { id:'mcp',          label:'MCP',            icon:'link' },
  { id:'experiments',  label:'Experiments',    icon:'beaker' },
  { id:'future',       label:'Future Work',    icon:'sparkle' },
];

/* status meta */
const STATUS = {
  'production':   { label:'Production',   cls:'s-production' },
  'in-progress':  { label:'In Progress',  cls:'s-in-progress' },
  'experimental': { label:'Experimental', cls:'s-experimental' },
  'research':     { label:'Research',     cls:'s-research' },
  'concept':      { label:'Future Concept', cls:'s-concept' },
  'archived':     { label:'Archived',     cls:'s-archived' },
};

/* Derive consistent numbers from the two honest inputs. */
function derive(eff){
  if(!eff || eff.manualHrsPerWeek==null || eff.aiHrsPerWeek==null) return null;
  const manual = +eff.manualHrsPerWeek, ai = +eff.aiHrsPerWeek;
  const saved = Math.max(0, +(manual - ai).toFixed(2));
  const speed = ai>0 ? +(manual/ai).toFixed(1) : null;         // e.g. 8.0x
  const pct   = manual>0 ? Math.round((saved/manual)*100) : 0; // e.g. 88%
  return { manual, ai, saved, speed, pct, draft: !!eff.draft };
}

/* ============================================================================
   PROJECTS
   ----------------------------------------------------------------------------
   The catalogue used to live in three hand-written files with three different
   syntaxes. It now lives in content/<id>.json, one record per project, and
   _tools/build_content.py generates projects_data.js from them. Nothing here
   is authored by hand any more.

   MEDIA is not in those records. The folder tree owns it -- see
   _tools/build_media_manifest.py and the note further down.
   ============================================================================ */
const PROJECTS = (window.CONTENT_PROJECTS || []).map(p => JSON.parse(JSON.stringify(p)));

/* In-house / generic tools carry the Asure brand mark, not a bare language logo.
   (tech chips keep their accurate per-language logos.) */
const GENERIC_LOGO = new Set(['python','csharp','dotnet','html','css','javascript','typescript','node','ollama','unknown','']);
PROJECTS.forEach(p=>{ if(!p.logo || GENERIC_LOGO.has(p.logo)) p.logo='asure'; });

/* ============================================================================
   THE TWO AXES  —  KIND and DOMAIN
   ----------------------------------------------------------------------------
   The old category list mixed five different questions into one flat set: form
   (plugin, dashboard), host app (revit), subject (bim), behaviour (automation,
   ai-agents), technology (llm, mcp, vision) and maturity (research,
   experiments). Because they all shared one field, 'automation' ended up on 17
   of 24 tools and 'bim' on 14 — neither filtered anything — and every tool
   carried 3.2 tags on average, so nothing was distinguishable from anything.

   Two axes replace it. Each answers exactly one question, and each tool answers
   it once:

     KIND    what sort of thing is it   — how you actually use it
     DOMAIN  what work does it serve    — where it sits in the studio

   Maturity stays on `status`. Technology stays on `tech`. Nothing is tagged
   twice on the same axis.

   'Agent' is deliberately strict: choosing its own steps to reach a goal, not
   merely calling a model. On that definition none of the tools listed here is
   one — the agentic work (JARVIS, Asure AI Agent, AgentWatch) is not on the
   site yet. An empty category is more useful than seven wrong labels.
   ============================================================================ */

const KINDS = [
  { id:'all',       label:'All tools',  icon:'grid',
    blurb:'Everything in the ecosystem.' },
  { id:'plugin',    label:'Plugin',     icon:'plug',
    blurb:'A button inside Revit, Rhino or Navisworks.' },
  { id:'dashboard', label:'Dashboard',  icon:'gauge',
    blurb:'A screen that reports project state. You read it.' },
  { id:'pipeline',  label:'Pipeline',   icon:'zap',
    blurb:'Files in, results out. No judgement calls.' },
  { id:'connector', label:'Connector',  icon:'link',
    blurb:'Connects two systems that could not talk before.' },
  { id:'platform',  label:'Platform',   icon:'layers',
    blurb:'A multi-user system with accounts and stored data.' },
  { id:'agent',     label:'Agent',      icon:'bot',
    blurb:'Chooses its own steps to reach a goal. Rare.' },
  { id:'evaluation', label:'Evaluation', icon:'flask',
    blurb:'We tested the options and wrote down what works.' },
  { id:'deck',      label:'Deck',       icon:'film',
    blurb:'A presentation or report we actually delivered.' },
];

const DOMAINS = [
  { id:'design',    label:'Design & Modelling',      icon:'cube' },
  { id:'docs',      label:'Documentation & Takeoff', icon:'doc' },
  { id:'qa',        label:'QA & Compliance',         icon:'check' },
  { id:'controls',  label:'Project Controls',        icon:'chart' },
  { id:'knowledge', label:'Knowledge & Research',    icon:'book' },
  { id:'studio',    label:'Studio Operations',       icon:'building' },
  { id:'ai',        label:'AI Infrastructure',       icon:'brain' },
];

/* One line per tool: [kind, domain]. To reclassify something, edit its line —
   nothing else in the site needs to change. Lines marked CHECK are my reading
   of a thin registry description and are worth confirming. */
/* kind and domain are stored per record in content/<id>.json, so the old
   CLASSIFY lookup table is gone. Anything missing them still gets a default
   rather than vanishing from the grid. */
PROJECTS.forEach(p=>{ p.kind = p.kind || 'pipeline'; p.domain = p.domain || 'design'; });

/* ---------------------------------------------------------------------------
   MEDIA - generated from the folder tree, never hand-written.
   _tools/build_media_manifest.py scans projects/<id>/ and writes
   media_manifest.js. It REPLACES whatever media a project declares, because
   the declarations had drifted: ten projects pointed at a hero.png that was
   never captured, so each fell back to placeholder art while claiming an
   image. What is actually on disk is the only truth.
   --------------------------------------------------------------------------- */
const MEDIA = window.MEDIA_MANIFEST || {};
PROJECTS.forEach(p=>{ p.media = MEDIA[p.id] || {}; });

const kindMeta   = id => KINDS.find(k=>k.id===id)   || KINDS[0];
const domainMeta = id => DOMAINS.find(x=>x.id===id) || DOMAINS[0];

/* expose */
window.TAXONOMY = TAXONOMY;      /* legacy — superseded by KINDS */
window.KINDS = KINDS; window.DOMAINS = DOMAINS;
window.kindMeta = kindMeta; window.domainMeta = domainMeta;
window.STATUS = STATUS;
window.PROJECTS = PROJECTS;
window.derive = derive;
