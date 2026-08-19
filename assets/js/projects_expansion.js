/* ============================================================================
   projects_expansion.js — work found on the drives that the 21 July registry
   scan never saw, plus the finished presentations.
   ----------------------------------------------------------------------------
   Scanned C:\Downloads, Y: and Z: on 19 Aug 2026. 124 candidate folders, 46 left
   after removing cloned third-party repos, archives, imports and data dumps.
   These are the ones Asure actually built.

   CONFIDENTIALITY: the site's rule is project codes only, no client names. Six
   items here are client, investor or staff material and are described by type
   rather than by name. The source folders are noted in `page.objective` only
   where that name is already public.

   Each entry carries its own `kind` and `domain`, so it does not need a line in
   CLASSIFY over in projects.js.
   ============================================================================ */
window.EXPANSION_PROJECTS = [

  /* ===================== TOOLS ===================== */
  {
    id:'jarvis-ai-os', code:'P25', name:'JARVIS AI-OS', status:'in-progress',
    kind:'agent', domain:'ai', logo:'python',
    tagline:'One agent you talk to; it delegates the rest to specialists in the background.',
    tech:['python','anthropic','mcp'], efficiency:null,
    page:{
      objective:'Talk to one agent by voice, text or messaging, and have it route the work to specialist agents without you managing any of them.',
      problem:'Every tool needs its own prompt, its own window and its own context. Nothing shares what it learned.',
      solution:'A gateway routes one conversation to background specialists over a shared SQLite event bus, so state and memory persist across them.'
    }, related:['asure-ai-agent','mark-l-voice']
  },
  {
    id:'mark-l-voice', code:'P26', name:'Mark-L Voice Agent', status:'experimental',
    kind:'agent', domain:'studio', logo:'python',
    tagline:'Live voice control of the desktop — hears, sees the screen, and acts.',
    tech:['python'], efficiency:null,
    page:{
      objective:'Operate the machine by speaking to it, with no perceptible delay between asking and acting.',
      problem:'Typing is the bottleneck for anything that spans several applications.',
      solution:'A streaming voice loop drives the desktop directly, running seamlessly rather than in request-response turns.'
    }, related:['jarvis-ai-os','flowlocal']
  },
  {
    id:'asure-ai-agent', code:'P27', name:'Asure AI Agent', status:'production',
    kind:'agent', domain:'ai', logo:'python',
    tagline:'Open-source, local-first agent — a CLI and a desktop app, branded as ours.',
    tech:['python','typescript','node'], efficiency:null,
    page:{
      objective:'Give the studio a self-improving, tool-calling agent that runs on our own machines, so data and conversations never leave them.',
      problem:'Every capable agent is a hosted service, which rules it out for confidential project work.',
      solution:'A branded fork kept to a thin branding layer, so upstream changes still merge cleanly.'
    }, related:['jarvis-ai-os','headroom']
  },
  {
    id:'figma-cli', code:'P28', name:'figma-cli', status:'production',
    kind:'connector', domain:'studio', logo:'figma',
    tagline:'Describe what you want; it gets built live in Figma Desktop.',
    tech:['node','javascript','figma'], efficiency:null,
    page:{
      objective:'Let an assistant build directly in Figma Desktop while you talk to it in ordinary language.',
      problem:'Figma automation normally needs an API key, a paid plan and a plugin to babysit.',
      solution:'A local daemon talks to a companion plugin, so no subscription or API key is involved.'
    }, related:['ai-team-pm']
  },
  {
    id:'ai-team-pm', code:'P29', name:'AI Team PM', status:'production',
    kind:'platform', domain:'studio', logo:'javascript',
    tagline:'A project manager for the AI team, running on a shared board.',
    tech:['node','javascript','figma'], efficiency:null,
    page:{
      objective:'Keep the AI team\u2019s work visible on one board, with standups and task assignment handled automatically.',
      problem:'Task state lived in chat threads, so nobody could see the whole picture.',
      solution:'A task ledger drives a live board section and scheduled standups, with one active task per person enforced.'
    }, related:['figma-cli','asure-team-org']
  },
  {
    id:'asure-team-org', code:'P30', name:'Team Organisation Navigator', status:'production',
    kind:'dashboard', domain:'studio', logo:'html',
    tagline:'Interactive five-step view of how the studio is organised.',
    tech:['html','css','javascript'], efficiency:null,
    page:{
      objective:'Make the studio\u2019s structure navigable rather than a static chart nobody opens.',
      problem:'Org charts go stale the day they are exported and tell you nothing about who does what.',
      solution:'A five-step navigator with portraits and linked profiles, deployed as a single page.'
    }, related:['ai-team-pm']
  },
  {
    id:'asure-ui-kit', code:'P31', name:'Asure UI Kit', status:'in-progress',
    kind:'platform', domain:'studio', logo:'css',
    tagline:'The shared chrome and report grammar every other tool builds on.',
    tech:['html','css','javascript'], efficiency:null,
    page:{
      objective:'Define one design system so every dashboard, report and deck the studio ships looks like it came from the same place.',
      problem:'Each tool reinvented its own layout, palette and report format.',
      solution:'A template and component library the other projects consume rather than copy.'
    }, related:['h10-dashboard','p25-predictability']
  },
  {
    id:'youtube-library', code:'P32', name:'YouTube Library', status:'production',
    kind:'platform', domain:'knowledge', logo:'html',
    tagline:'Watch a video once; keep its value without re-watching.',
    tech:['html','javascript','python'], efficiency:null,
    page:{
      objective:'Turn useful videos into filed, searchable notes so nobody has to watch anything twice.',
      problem:'Good material was found, watched, and then lost in a chat thread.',
      solution:'Each video gets a notes file filed by project stage, with takeaways and timestamps, all surfaced through one dashboard.'
    }, related:['docs-to-md','local-video-pipeline']
  },
  {
    id:'flowlocal', code:'P33', name:'FlowLocal Dictation', status:'production',
    kind:'pipeline', domain:'studio', logo:'python',
    tagline:'Hold a key, speak, release — the words land in whatever you were typing in.',
    tech:['python'], efficiency:null,
    page:{
      objective:'Dictate into any application on Windows without sending audio anywhere.',
      problem:'The commercial equivalent is a subscription and uploads every word you say.',
      solution:'Whisper runs on the local GPU behind a tray app and a global hotkey. Nothing is uploaded.'
    }, related:['mark-l-voice','local-video-pipeline']
  },
  {
    id:'parametric-studio-bridge', code:'P34', name:'Parametric Studio Bridge', status:'production',
    kind:'connector', domain:'design', logo:'rhino',
    tagline:'Drag a slider in the browser; the Rhino model updates in about 200 ms.',
    tech:['javascript','python','rhino','grasshopper','mcp'], efficiency:null,
    page:{
      objective:'Give a browser-based parametric studio live two-way control of Grasshopper inside Rhino.',
      problem:'Parametric exploration was locked inside Grasshopper, where only one person could drive it.',
      solution:'A bridge syncs browser sliders to Grasshopper and regenerates the brep in the viewport in real time, with an MCP connector so an assistant can drive Rhino too.'
    }, related:['revit-mcp','cad3d-studio']
  },
  {
    id:'simulation-library', code:'P35', name:'Interior Simulation Library', status:'in-progress',
    kind:'platform', domain:'design', logo:'html',
    tagline:'Room-by-room simulations built from the drawing set, answerable without opening them.',
    tech:['html','javascript','python','mcp'], efficiency:null,
    page:{
      objective:'Digitise an interiors drawing set room by room so any question can be answered from an index rather than from the heavy source files.',
      problem:'Answering a question meant opening large drawing applications and reading them again.',
      solution:'Drawings become structured scene data, get simulated, and are archived in a retrievable format behind one hub.'
    }, related:['cad3d-studio','construction-takeoff-ai']
  },
  {
    id:'revit-ext-bench', code:'P36', name:'Revit Extensions Test Bench', status:'research',
    kind:'study', domain:'design', logo:'csharp',
    tagline:'Which open-source Revit add-ins actually build and run for us.',
    tech:['csharp','dotnet','revit'], efficiency:null,
    page:{
      objective:'Find out which publicly available Revit and Dynamo extensions are worth adopting, by building and deploying them rather than reading about them.',
      problem:'Extension quality is impossible to judge from a repository page.',
      solution:'Candidates are cloned, built against Revit 2025 and deployed; what survives is documented with its result.'
    }, related:['revit-toolbox','phoenix-l1']
  },
  {
    id:'local-model-bench', code:'P37', name:'Local AI Model Bench', status:'research',
    kind:'study', domain:'ai', logo:'ollama',
    tagline:'What local models can and cannot do on studio hardware.',
    tech:['python','ollama','brain'], efficiency:null,
    page:{
      objective:'Establish which locally-hosted models are good enough for real studio work, and on what hardware.',
      problem:'Cloud models are capable but rule out confidential project data.',
      solution:'Models are run against real tasks on the actual machines, with the memory and context limits that break them written down.'
    }, related:['git-links-test','headroom']
  },
  {
    id:'agent-teams-research', code:'P38', name:'Agent Teams Evaluation', status:'research',
    kind:'study', domain:'ai', logo:'anthropic',
    tagline:'Whether multi-agent teams beat one good agent.',
    tech:['anthropic','mcp'], efficiency:null,
    page:{
      objective:'Decide whether coordinated agent teams are worth the coordination cost for studio work.',
      problem:'Multi-agent setups are easy to spin up and hard to judge.',
      solution:'Team prompts, file-ownership rules and spawn patterns were evaluated against single-agent baselines.'
    }, related:['jarvis-ai-os','local-model-bench']
  },
  {
    id:'git-links-test', code:'P39', name:'Open-Source Model Test', status:'research',
    kind:'study', domain:'ai', logo:'github',
    tagline:'Thirty-two open-source AI repos, tested against local models.',
    tech:['python','ollama'], efficiency:null,
    page:{
      objective:'Work out which open-source AI projects run usefully on our own hardware.',
      problem:'A long list of promising repositories, and no evidence any of them work here.',
      solution:'Every repository was cloned and run against local models; five passed and the rest were ruled out with a reason.'
    }, related:['local-model-bench']
  },
  {
    id:'ads-ai-roadmap', code:'P40', name:'ADS AI Roadmap', status:'production',
    kind:'study', domain:'studio', logo:'html',
    tagline:'The studio-wide plan for adopting AI, with the hardware to run it.',
    tech:['html','python'], efficiency:null,
    page:{
      objective:'Give the studio one plan for what to adopt, in what order, and on what hardware.',
      problem:'AI adoption was happening tool by tool, with no shared view of cost, sequence or risk.',
      solution:'A clarity deck, a written report and a tracking workbook, with hardware tiers costed and validated.'
    }, related:['deck-leadership','deck-roadmap-v2']
  },
  {
    id:'local-video-pipeline', code:'P41', name:'Local Video Research Pipeline', status:'production',
    kind:'pipeline', domain:'knowledge', logo:'python',
    tagline:'Video in, structured research notes out — entirely on our own GPU.',
    tech:['python','ollama'], efficiency:null,
    page:{
      objective:'Turn long videos into usable written research without paying per token or uploading anything.',
      problem:'Reviewing hours of video by hand is slow, and cloud transcription costs add up fast.',
      solution:'Download, GPU transcription and local summarisation run as one chain, selecting GPU or CPU automatically.'
    }, related:['youtube-library','docs-to-md']
  },

  /* ===================== DECKS ===================== */
  {
    id:'deck-bim-ai-ladders', code:'P42', name:'BIM \u00d7 AI Integration Deck', status:'production',
    kind:'deck', domain:'knowledge', logo:'html',
    tagline:'Two ladders: how BIM maturity and AI capability climb together.',
    tech:['html'], efficiency:null,
    media:{ html:['projects/deck-bim-ai-ladders/html/deck.html'] },
    page:{
      objective:'Show where the studio sits on both the BIM and the AI ladder, and what the next rung costs.',
      problem:'BIM maturity and AI capability were being discussed as separate conversations.',
      solution:'One deck that puts the two ladders side by side, so each AI step is tied to the BIM step it depends on.'
    }, related:['ads-ai-roadmap']
  },
  {
    id:'deck-summit-pitch', code:'P43', name:'International Summit Pitch', status:'production',
    kind:'deck', domain:'studio', logo:'html',
    tagline:'Twenty slides pitching the studio as infrastructure, not a service.',
    tech:['html','javascript'], efficiency:null,
    media:{ html:['projects/deck-summit-pitch/html/deck.html'] },
    page:{
      objective:'Present the studio\u2019s AI position to an international summit audience in a single portable file.',
      problem:'A funder audience needs the whole picture in twenty minutes, from an unfamiliar laptop.',
      solution:'A self-contained deck that opens big and goes deep, built around a live map of the tool ecosystem.'
    }, related:['ads-ai-roadmap','deck-ai-story']
  },
  {
    id:'deck-india-readiness', code:'P44', name:'India BIM-AI Readiness Report', status:'production',
    kind:'deck', domain:'knowledge', logo:'html',
    tagline:'How ready Indian construction actually is for AI.',
    tech:['html'], efficiency:null,
    page:{
      objective:'Establish the real state of AI and BIM readiness in Indian construction, as a basis for what the studio offers.',
      problem:'Strategy was being set against global figures that do not describe this market.',
      solution:'A researched report on the Indian market specifically, published alongside a catalogue of available solutions.'
    }, related:['ads-ai-roadmap']
  },
  {
    id:'deck-ai-story', code:'P45', name:'Asure AI Story Deck', status:'production',
    kind:'deck', domain:'studio', logo:'html',
    tagline:'The studio\u2019s AI story, split into procedure and closing.',
    tech:['html'], efficiency:null,
    page:{
      objective:'Tell the studio\u2019s AI story as a procedure someone can follow, not a list of capabilities.',
      problem:'One long deck mixed the how-it-works narrative with the ask, and neither landed.',
      solution:'Two standalone decks: a seventeen-slide procedure story and a three-slide action and closing.'
    }, related:['deck-summit-pitch']
  },
  {
    id:'deck-leadership', code:'P46', name:'AI Adaptation Leadership Deck', status:'production',
    kind:'deck', domain:'studio', logo:'html',
    tagline:'The heads\u2019 view: what to adopt, what to host, what to defer.',
    tech:['html'], efficiency:null,
    page:{
      objective:'Give studio leadership a decision-ready view of AI adoption rather than a technology tour.',
      problem:'Leadership needed to make hosting and spend decisions without a technical briefing.',
      solution:'A deck framed around decisions, with the open-source-on-our-own-hardware position argued explicitly.'
    }, related:['ads-ai-roadmap','deck-roadmap-v2']
  },
  {
    id:'deck-team-review', code:'P47', name:'Studio Team Review', status:'production',
    kind:'deck', domain:'studio', logo:'html',
    tagline:'The structured data behind the team organisation review.',
    tech:['html','javascript'], efficiency:null,
    page:{
      objective:'Build the team organisation review on structured, updatable data instead of a hand-made slide.',
      problem:'Team information was re-collected from scratch every time it was needed.',
      solution:'A source-of-truth data pack, with a project library and member inputs, driving a live site.'
    }, related:['asure-team-org']
  },
  {
    id:'deck-phoenix-client', code:'P48', name:'Phoenix Client Presentation', status:'production',
    kind:'deck', domain:'qa', logo:'html',
    tagline:'The self-certification plugin, presented to the client that asked for it.',
    tech:['html'], efficiency:null,
    media:{ html:['projects/deck-phoenix-client/html/deck.html'] },
    page:{
      objective:'Show a client how weekly Level-1 self-certification works, end to end, in one meeting.',
      problem:'The value of an automated compliance check is hard to convey without seeing it run.',
      solution:'A single-file deck backed by a standalone bundle \u2014 plugin, screenshots, standards and strategy in one folder with no external paths.'
    }, related:['phoenix-l1']
  },
  {
    id:'deck-roadmap-v2', code:'P49', name:'AI Roadmap v2 Deliverables', status:'production',
    kind:'deck', domain:'studio', logo:'html',
    tagline:'The roadmap as a deck, a report and a tracking workbook.',
    tech:['html','python'], efficiency:null,
    page:{
      objective:'Turn the roadmap into something the studio can actually run against, not just read once.',
      problem:'A roadmap that exists only as a presentation stops being true within a month.',
      solution:'Three linked deliverables generated from one source: a deck, a landscape report and a workbook that tracks progress.'
    }, related:['ads-ai-roadmap','deck-leadership']
  },
  {
    id:'deck-enterprise-ai', code:'P50', name:'Enterprise AI Possibilities', status:'production',
    kind:'deck', domain:'studio', logo:'html',
    tagline:'A story-first pitch for an enterprise client outside architecture.',
    tech:['html','python'], efficiency:null,
    page:{
      objective:'Sell what AI makes possible to an enterprise client, by telling a story rather than listing features.',
      problem:'A capability list means nothing to a board that has not seen the tools work.',
      solution:'A single narrative spine with a gallery of real use cases and working demo clips hung off it.'
    }, related:['deck-summit-pitch']
  },
  {
    id:'deck-plannerly', code:'P51', name:'Plannerly Evaluation', status:'production',
    kind:'deck', domain:'qa', logo:'html',
    tagline:'Whether a commercial BIM-management platform earns its place.',
    tech:['html'], efficiency:null,
    page:{
      objective:'Decide whether to adopt a commercial BIM management platform or keep building in-house.',
      problem:'Buy-versus-build was being argued from marketing material.',
      solution:'An evaluation presented against what the studio already has working.'
    }, related:['asurebimqc','phoenix-l1']
  },
  {
    id:'deck-72-ways', code:'P52', name:'72 Ways Architects Use Claude', status:'production',
    kind:'deck', domain:'knowledge', logo:'anthropic',
    tagline:'Seventy-two concrete uses, mapped to the design stage each belongs to.',
    tech:['html','anthropic'], efficiency:null,
    page:{
      objective:'Give architects a concrete catalogue of what to actually use AI for, filed by the stage they are working in.',
      problem:'General AI advice never survives contact with an architect\u2019s actual week.',
      solution:'Seventy-two specific uses, each tied to a design phase and a delegation map.'
    }, related:['ads-ai-roadmap','youtube-library']
  },
];
