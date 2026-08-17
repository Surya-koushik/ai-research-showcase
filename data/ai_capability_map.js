/* ============================================================================
   ai_capability_map.js — the Can / Can't / R&D panels.
   Short chip-style labels. Honest by design. Edit freely.
   ============================================================================ */
const AI_CAPABILITY = {
  can: {
    title:'What I Can Do',
    footer:'Turning complex problems into <b>intelligent solutions</b>.',
    items:[
      'AI Agents & Workflows','Automation & Scripting','Dashboards & Analytics',
      'BIM Automation','Revit / Dynamo / pyRevit','Rhino / Grasshopper',
      'Plugins Development','Data Processing','AI Integrations (LLMs)',
      '3D Integrations','Report Generation','API & System Integrations',
    ]
  },
  cant: {
    title:"What I Can't Do (Yet)",
    footer:'Focused on <b>augmentation</b>, not replacement.',
    items:[
      'Full Autonomous Design Decisions','Guaranteed Accuracy — always human-verified',
      'Legal / Code Sign-off & Certification','Financial / Investment Advice',
      'On-site Physical Execution','Sensitive Personal Data Handling',
      'Real-time Robot / IoT Control','Replacing Human Creativity & Judgment',
    ]
  },
  rnd: {
    title:'R&D & Future',
    footer:'Many more in the pipeline…',
    items:[
      'Multi-Agent Design System','Generative Design Copilot','Realtime AI Design Review',
      'Construction AI Assistant','Voice-to-BIM Workflow',
    ]
  }
};
window.AI_CAPABILITY = AI_CAPABILITY;
