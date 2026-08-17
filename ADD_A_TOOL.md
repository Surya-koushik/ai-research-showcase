# Add a tool — 60-second guide

The whole site renders from **one file**: `assets/js/projects.js`.
Adding a tool = paste one object into `PROJECTS[]` and (optionally) drop media in a folder.
No HTML, no redesign.

---

## 1. Copy the media folder (optional but recommended)

```
projects/
  your-tool-id/
    screenshots/   ← hero.png + gallery images
    videos/        ← .mp4 clips (or use YouTube, see below)
    html/          ← interactive HTML demos (embedded in an iframe)
    docs/          ← PDFs / downloads
```

`your-tool-id` must match the `id` you give the tool below (lowercase, hyphens).

## 2. Add one entry to `assets/js/projects.js`

Paste this into `PROJECTS[]` and edit the values:

```js
{
  id:'your-tool-id',                 // matches the projects/<id>/ folder
  code:'P11',                        // next project code — NO client names
  name:'Human-readable tool name',
  status:'in-progress',              // production | in-progress | experimental | research | concept | archived
  categories:['automation','revit'], // any from TAXONOMY (see top of projects.js)
  logo:'python',                     // a key from LOGOS in assets/js/icons.js
  tagline:'One sentence — what it does.',
  workflowStage:'Where it sits in the whole workflow',
  description:'Two sentences, high-level. No confidential client detail.',
  tech:['python','revit','anthropic'],        // logo keys → official logos in the row

  // NUMBERS: give the two honest inputs only. saved / speed / % are auto-derived.
  efficiency:{ manualHrsPerWeek:4, aiHrsPerWeek:0.5, draft:true },
  // ...or  efficiency:null   if the time-saving isn't measured yet.

  media:{
    hero:'projects/your-tool-id/screenshots/hero.png',
    videos:[
      { type:'youtube', id:'YT_VIDEO_ID', title:'Demo' },            // fastest for big videos
      // { type:'mp4', src:'projects/your-tool-id/videos/demo.mp4', poster:'projects/your-tool-id/screenshots/hero.png', title:'Demo' }
    ],
    gallery:['projects/your-tool-id/screenshots/1.png','projects/your-tool-id/screenshots/2.png'],
    html:['projects/your-tool-id/html/demo.html'],
    beforeAfter:{ before:'projects/your-tool-id/screenshots/before.png', after:'projects/your-tool-id/screenshots/after.png' },
    docs:[{ title:'Documentation', src:'projects/your-tool-id/docs/guide.pdf' }],
  },

  page:{
    objective:'Research objective — why this exists.',
    problem:'The manual pain it removes.',
    solution:'How it solves it, in one line.',
    howItWorks:[
      { title:'Step one', detail:'What happens.' },
      { title:'Step two', detail:'What happens.' },
    ],
    timeline:[{ date:'Jul 2026', label:'Milestone' }],
    challenges:['…'],
    lessons:['…'],
    roadmap:['…'],
  },
  related:['phoenix-l1'],             // ids of related tools
},
```

That's it. Refresh `index.html` — the card, metrics, filters, search and a full tool page all appear automatically.

---

## Rules that keep it clean

- **Only project codes** (P01, P02…). Never client names or confidential detail.
- **Honest numbers.** Give only `manualHrsPerWeek` and `aiHrsPerWeek`. Keep `draft:true` until confirmed — the UI shows a DRAFT badge. Never inflate. If unmeasured, use `efficiency:null`.
- **Media is optional.** Leave anything out and that section shows an elegant "ready to attach" placeholder instead of breaking.
- **Videos load fast** because nothing loads until clicked (poster only). Big clips → YouTube-unlisted; short clips → local mp4.

## Fields you never touch

Hours-saved, speed×, and % efficiency are computed by `derive()` — never hand-write them, so numbers can never disagree.

---

## Official logos still needed (drop the SVG, don't redraw)

Bundled already (Simple Icons, official): python, anthropic, react, typescript, javascript, html5, css3, tailwind, node, docker, github, postgresql, ollama, langchain, figma, dotnet, autocad, autodesk, supabase.

**Missing — drop the official SVG into `assets/logos/software/` with these exact names** (until then they render as a labelled monogram, never a redraw):

| key | file to drop | where to get it |
|-----|--------------|-----------------|
| revit | `revit.svg` | Autodesk brand assets |
| pyrevit | `pyrevit.svg` | pyRevit GitHub |
| csharp | `csharp.svg` | Microsoft / official C# mark |
| mcp | `mcp.svg` | modelcontextprotocol.io |
| comfyui | `comfyui.svg` | ComfyUI repo |
| openai | `openai.svg` | OpenAI brand assets |
| powerbi | `powerbi.svg` | Microsoft brand assets |
| rhino | `rhino.svg` | McNeel brand assets |
| grasshopper | `grasshopper.svg` | McNeel brand assets |
