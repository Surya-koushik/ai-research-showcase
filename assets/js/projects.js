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
   Media schema (all optional — layout adapts to whatever exists):
     media.hero      : 'projects/<id>/screenshots/hero.png'   (card + page hero)
     media.videos    : [{type:'youtube', id:'abc', title, poster} |
                        {type:'mp4', src:'projects/<id>/videos/x.mp4', poster, title}]
     media.gallery   : ['projects/<id>/screenshots/1.png', ...]
     media.html      : ['projects/<id>/html/demo.html']   (embedded iframe demos)
     media.beforeAfter:{before:'...png', after:'...png'}
     media.docs      : [{title, src:'projects/<id>/docs/x.pdf'}]
   ============================================================================ */
const PROJECTS = [

  /* ========================= P01 — FULL REFERENCE PAGE ===================== */
  {
    id:'phoenix-l1',
    code:'P01',
    name:'ADS Phoenix — L1 Self-Certification',
    status:'production',
    categories:['plugins','revit','bim','automation','ai-agents'],
    logo:'revit',
    tagline:'Weekly Level-1 model self-certification, run inside Revit in one click.',
    workflowStage:'QA & Compliance',
    description:'A native Revit add-in that runs the weekly Level-1 self-certification — 22 model-health checks across 5 quality gates — and produces a pass/fail audit report automatically, replacing a slow manual walkthrough.',
    tech:['revit','csharp','dotnet','supabase','pyrevit'],
    efficiency:{ manualHrsPerWeek:4, aiHrsPerWeek:0.5, draft:true },
    media:{
      hero:'projects/phoenix-l1/screenshots/hero.png',
      videos:[
        // Example — replace id with your unlisted YouTube id, or switch to mp4:
        // { type:'youtube', id:'REPLACE_ME', title:'Phoenix L1 — one-click run' }
        // { type:'mp4', src:'projects/phoenix-l1/videos/run.mp4', poster:'projects/phoenix-l1/screenshots/hero.png', title:'Phoenix L1 — one-click run' }
      ],
      gallery:[
        // 'projects/phoenix-l1/screenshots/dialog.png',
        // 'projects/phoenix-l1/screenshots/report.png'
      ],
      html:[
        // 'projects/phoenix-l1/html/sample-report.html'
      ],
      docs:[
        // { title:'L1 Reference Checklist', src:'projects/phoenix-l1/docs/L1_checklist.pdf' }
      ],
    },
    page:{
      objective:'Make the weekly Level-1 self-certification effortless and consistent, so every model is checked the same way every week without a person manually stepping through a checklist.',
      problem:'The Level-1 self-cert is 22 discrete model-health checks across 5 gates. Done by hand it is slow, easy to skip under deadline pressure, and inconsistent between people — which means quality drifts and issues surface late.',
      solution:'A single Revit button runs all 22 checks against the open model, evaluates the 5 gates, and writes a structured pass/fail report with the exact failing elements. An online lock records that the self-cert was run for the week.',
      howItWorks:[
        { title:'Open the model & click Run', detail:'The add-in lives on the Revit ribbon. One click starts the certification against the currently open model — no setup, no external tool.' },
        { title:'22 checks across 5 gates', detail:'Naming, levels & grids, worksets, warnings, links, view templates and more are evaluated in sequence. Each check returns pass / fail plus the specific elements responsible.' },
        { title:'Gates decide the verdict', detail:'Checks roll up into 5 quality gates. All gates must pass for the model to be certified Level-1 for the week.' },
        { title:'Audit report generated', detail:'A clean report is produced showing every check, its result, and the offending elements — ready to share or attach to the weekly record.' },
        { title:'Weekly lock recorded online', detail:'A Supabase-backed record marks the self-cert as completed for the week, so compliance is visible without chasing people.' },
      ],
      timeline:[
        { date:'Apr 2026', label:'pyRevit prototype — checklist logic proven' },
        { date:'May 2026', label:'Rewritten as native C# Revit 2025 add-in (22 checks, 5 gates)' },
        { date:'Jun 2026', label:'Online licensing lock + weekly dashboard' },
        { date:'Jul 2026', label:'Production rollout & reference pack' },
      ],
      challenges:[
        'Mapping a human checklist into deterministic, false-positive-free API checks.',
        'Keeping the run fast on large models while inspecting thousands of elements.',
        'Designing gates that are strict enough to matter but not so strict they block on noise.',
      ],
      lessons:[
        'A one-click ribbon button beats any richer UI for weekly adoption — friction is the enemy of compliance.',
        'Reporting the exact failing elements is what makes teams trust and act on the result.',
      ],
      roadmap:[
        'Auto-fix suggestions for the most common failures.',
        'Level-2 and Level-3 certification tiers.',
        'Trend view: model health per project, week over week.',
      ],
    },
    related:['h10-dashboard','revit-toolbox','p25-predictability'],
  },

  /* ========================= Real tools — seed stubs ====================== */
  {
    id:'h10-dashboard', code:'P02', name:'H10 BIM Progress Dashboard', status:'production',
    categories:['dashboards','bim','data'], logo:'html',
    tagline:'Client-facing project + BIM progress, from pre-design to final GFC.',
    workflowStage:'Reporting & Client Comms',
    description:'A live dashboard that communicates project and BIM progress to clients — stage timeline, discipline status, and a clear explanation of how the delivery works, in the studio design language.',
    tech:['html','javascript','css'],
    efficiency:{ manualHrsPerWeek:3, aiHrsPerWeek:0.5, draft:true },
    media:{ hero:'projects/h10-dashboard/screenshots/hero.png',
      html:['projects/h10-dashboard/html/dashboard.html'] },
    page:{ objective:'Give clients a single, always-current view of project and BIM progress.',
      problem:'Progress updates were manual, inconsistent, and time-consuming to assemble each week.',
      solution:'A structured dashboard that presents stage timeline, discipline status and process clarity in one place.' },
    related:['phoenix-l1','p25-predictability'],
  },
  {
    id:'p25-predictability', code:'P03', name:'P25 Predictability Dashboard', status:'production',
    categories:['dashboards','data','research'], logo:'javascript',
    tagline:'Delivery predictability analytics — the studio quality benchmark.',
    workflowStage:'Analytics & Insight',
    description:'A premium analytics dashboard tracking delivery predictability with the studio design system — the visual and data-clarity benchmark the rest of the platform is measured against.',
    tech:['html','javascript','css'],
    efficiency:{ manualHrsPerWeek:2.5, aiHrsPerWeek:0.5, draft:true },
    media:{ hero:'projects/p25-predictability/screenshots/hero.png',
      html:['projects/p25-predictability/html/dashboard.html'] },
    page:{ objective:'Make delivery predictability measurable and legible at a glance.',
      problem:'Predictability signals were scattered and hard to read across projects.',
      solution:'A single analytics surface with premium data visualization and clear hierarchy.' },
    related:['h10-dashboard','phoenix-l1'],
  },
  {
    id:'cad3d-studio', code:'P04', name:'CAD3D Studio — CAD Standardize', status:'in-progress',
    categories:['automation','bim','vision','ai-agents'], logo:'autocad',
    tagline:'Any DWG → the ADS 10-layer standard → a clean 3D-ready model.',
    workflowStage:'Model Setup / Intake',
    description:'Inspects every layer of an incoming CAD file visually, maps it to the ADS ten-layer standard, and prepares a 3D-ready model — turning messy drawings into usable geometry automatically.',
    tech:['python','javascript','ollama'],
    efficiency:{ manualHrsPerWeek:5, aiHrsPerWeek:1, draft:true },
    media:{ hero:'projects/cad3d-studio/screenshots/hero.png' },
    page:{ objective:'Remove the manual grind of cleaning and standardizing incoming CAD before modeling.',
      problem:'Every incoming DWG has different, non-standard layers that must be sorted by hand before any 3D work.',
      solution:'Visual per-layer inspection + automatic mapping to the ADS standard, then a 3D-ready export.' },
    related:['phoenix-l1','revit-toolbox'],
  },
  {
    id:'revit-mcp', code:'P05', name:'Revit ↔ Claude MCP Bridge', status:'experimental',
    categories:['mcp','ai-agents','revit','automation'], logo:'anthropic',
    tagline:'Drive Revit with natural language through the Model Context Protocol.',
    workflowStage:'Authoring / Automation',
    description:'A bridge that lets an AI assistant query and modify a live Revit model over MCP — reading model data and executing authoring code from natural-language instructions.',
    tech:['python','revit','mcp','anthropic'],
    efficiency:null,
    media:{ hero:'projects/revit-mcp/screenshots/hero.png' },
    page:{ objective:'Explore natural-language, agent-driven Revit authoring.',
      problem:'Repetitive Revit tasks still require manual clicks or bespoke scripts.',
      solution:'An MCP server exposing safe Revit operations an assistant can call directly.' },
    related:['phoenix-l1','revit-toolbox'],
  },
  {
    id:'archviz-suite', code:'P06', name:'ArchViz AI Suite', status:'research',
    categories:['research','vision','experiments','ai-agents'], logo:'comfyui',
    tagline:'Local idea → elevations → 3D → render pipeline on ComfyUI.',
    workflowStage:'Concept & Visualization',
    description:'An open-source, fully-local visualization pipeline: an upscaler in the spirit of premium tools, plus an idea-to-elevations-to-3D flow — all running on the studio GPU with no cloud dependency.',
    tech:['python','comfyui','ollama'],
    efficiency:null,
    media:{ hero:'projects/archviz-suite/screenshots/hero.png' },
    page:{ objective:'Bring premium-grade AI visualization in-house, running locally.',
      problem:'Best-in-class AI upscaling and concept tools are cloud, paid, and off-limits for sensitive work.',
      solution:'A local ComfyUI pipeline covering upscale, concept elevations and 3D, at zero per-image cost.' },
    related:['cad3d-studio'],
  },
  {
    id:'headroom', code:'P07', name:'Headroom — Context Compression', status:'experimental',
    categories:['llm','research','automation'], logo:'brain',
    tagline:'A proxy that compresses LLM context to cut token cost and speed sessions.',
    workflowStage:'AI Infrastructure',
    description:'A local proxy sitting in front of the model API that compresses and caches conversation context, reducing tokens per turn while preserving the working state of long sessions.',
    tech:['python','anthropic'],
    efficiency:null,
    media:{ hero:'projects/headroom/screenshots/hero.png' },
    page:{ objective:'Make long AI working sessions cheaper and faster without losing context.',
      problem:'Long sessions re-send large context every turn, wasting tokens and time.',
      solution:'A transparent proxy that compresses and caches context between turns.' },
    related:['team-assess'],
  },
  {
    id:'docs-to-md', code:'P08', name:'Docs → Markdown Corpus', status:'production',
    categories:['automation','data','llm'], logo:'python',
    tagline:'Batch any document set into an AI-queryable Markdown knowledge base.',
    workflowStage:'Knowledge & Research',
    description:'Converts folders of Excel, Word, PowerPoint, PDF and drawing sets into structured Markdown, building a searchable corpus an assistant can reason over — including a drawings-catalog technique that made an 80-hour job take just over an hour.',
    tech:['python'],
    efficiency:{ manualHrsPerWeek:2, aiHrsPerWeek:0.2, draft:true },
    media:{ hero:'projects/docs-to-md/screenshots/hero.png' },
    page:{ objective:'Turn scattered project documents into a single AI-queryable knowledge base.',
      problem:'Knowledge is trapped across dozens of incompatible document formats.',
      solution:'A batch converter to structured Markdown, plus a fast path for large drawing sets.' },
    related:['team-assess','headroom'],
  },
  {
    id:'team-assess', code:'P09', name:'Team AI-Usage Assessment', status:'production',
    categories:['automation','ai-agents','data'], logo:'anthropic',
    tagline:'Reads session logs to assess how each teammate uses AI, and where to improve.',
    workflowStage:'Enablement & Ops',
    description:'Analyzes local AI session transcripts to assess prompting quality, skill usage and repeated mistakes for each teammate, producing a structured improvement report.',
    tech:['python','anthropic'],
    efficiency:null,
    media:{ hero:'projects/team-assess/screenshots/hero.png' },
    page:{ objective:'Raise the whole team\'s AI effectiveness with concrete, evidence-based feedback.',
      problem:'It is hard to know who is using AI well and what to coach without reading everything.',
      solution:'Automated analysis of session logs into a per-person assessment.' },
    related:['docs-to-md','headroom'],
  },
  {
    id:'revit-toolbox', code:'P10', name:'ADS Revit Toolbox', status:'in-progress',
    categories:['plugins','revit','bim','automation'], logo:'revit',
    tagline:'A general-purpose productivity toolbox for day-to-day Revit work.',
    workflowStage:'Authoring / Productivity',
    description:'A collection of everyday Revit productivity tools — the most-requested repetitive actions distilled into one-click commands, sitting alongside the Phoenix compliance suite.',
    tech:['revit','csharp','dotnet','pyrevit'],
    efficiency:null,
    media:{ hero:'projects/revit-toolbox/screenshots/hero.png' },
    page:{ objective:'Cut the repetitive clicks out of everyday Revit modeling.',
      problem:'Common Revit actions take many steps and are repeated hundreds of times a week.',
      solution:'A curated set of one-click tools for the highest-frequency tasks.' },
    related:['phoenix-l1','cad3d-studio'],
  },

];

/* merge in the registry-generated tools (real ADS-built ecosystem), keeping
   hand-crafted entries authoritative by id */
if(window.REGISTRY_PROJECTS){
  const seen=new Set(PROJECTS.map(p=>p.id));
  window.REGISTRY_PROJECTS.forEach(r=>{ if(!seen.has(r.id)){ PROJECTS.push(r); seen.add(r.id); } });
}

/* In-house / generic tools carry the Asure brand mark, not a bare language logo.
   (tech chips keep their accurate per-language logos.) */
const GENERIC_LOGO = new Set(['python','csharp','dotnet','html','css','javascript','typescript','node','ollama','unknown','']);
PROJECTS.forEach(p=>{ if(!p.logo || GENERIC_LOGO.has(p.logo)) p.logo='asure'; });

/* expose */
window.TAXONOMY = TAXONOMY;
window.STATUS = STATUS;
window.PROJECTS = PROJECTS;
window.derive = derive;
