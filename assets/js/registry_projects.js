window.REGISTRY_PROJECTS = [
    {
        "id":  "construction-takeoff-ai",
        "code":  "P24",
        "name":  "Construction Takeoff AI",
        "status":  "in-progress",
        "categories":  ["automation","bim","data","vision"],
        "logo":  "asure",
        "tagline":  "Local-AI construction takeoff — reads a drawing set and produces BOQ quantities.",
        "workflowStage":  "Documentation & Takeoff",
        "description":  "An MCP-driven construction takeoff and drawings-analyser: it classifies sheets, extracts schedules, counts symbols and runs OCR across a drawing set to produce BOQ quantities. Runs entirely on local models (Ollama tier-2 preprocessors + PaddleOCR), with a benchmark harness behind it that was tuned across dozens of local models.",
        "tech":  ["python","mcp","ollama"],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/construction-takeoff-ai/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Turn a construction drawing set into reliable BOQ quantities with local AI, no manual measuring.",
                     "problem":  "Manual takeoff from drawings is slow, repetitive and error-prone.",
                     "solution":  "Sheet classification, schedule extraction, symbol counting and OCR are chained via an MCP server so quantities fall out of the drawings automatically — all on local models."
                 },
        "related":  []
    },
    {
        "id":  "ai-team-hub",
        "code":  "P11",
        "name":  "AI Team Hub",
        "status":  "production",
        "categories":  [
                           "dashboards",
                           "data"
                       ],
        "logo":  "html",
        "tagline":  "A dashboard for managing AI team projects and resources.",
        "workflowStage":  "core",
        "description":  "AI Team Hub is a web-based application designed to streamline the management of AI-related projects within Asure Design Studio. It provides an overview, work priorities, requirements, team information, procedures, tools, settings, and more, all accessible from a single interface.",
        "tech":  [
                     "html",
                     "css",
                     "javascript"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/ai-team-hub/screenshots/hero.png",
                      "html":  ["projects/ai-team-hub/html/index.html"]
                  },
        "page":  {
                     "objective":  "A dashboard for managing AI team projects and resources.",
                     "problem":  "",
                     "solution":  "AI Team Hub is a web-based application designed to streamline the management of AI-related projects within Asure Design Studio. It provides an overview, work priorities, requirements, team information, procedures, tools, settings, and more, all accessible from a single interface."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "asure-document-platform",
        "code":  "P12",
        "name":  "Asure Document Platform",
        "status":  "in-progress",
        "categories":  [
                           "dashboards",
                           "data",
                           "automation",
                           "bim"
                       ],
        "logo":  "python",
        "tagline":  "Self-hosted document generation platform for branded MOU/contract PDFs.",
        "workflowStage":  "foundation -\u003e auth -\u003e mou editor -\u003e pdf export -\u003e audit/dashboard -\u003e deploy",
        "description":  "A self-hosted web application designed to generate branded MOUs and contracts as PDFs from a guided form. It runs on Surya\u0027s Windows 11 PC using FastAPI, PostgreSQL, WeasyPrint, Caddy, and Redis.",
        "tech":  [
                     "python",
                     "postgres"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/asure-document-platform/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Self-hosted document generation platform for branded MOU/contract PDFs.",
                     "problem":  "",
                     "solution":  "A self-hosted web application designed to generate branded MOUs and contracts as PDFs from a guided form. It runs on Surya\u0027s Windows 11 PC using FastAPI, PostgreSQL, WeasyPrint, Caddy, and Redis."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "tep-dashboard",
        "code":  "P13",
        "name":  "TEP Dashboard",
        "status":  "production",
        "categories":  [
                           "dashboards",
                           "data"
                       ],
        "logo":  "html",
        "tagline":  "A dashboard for visualizing Earth-related projects.",
        "workflowStage":  "completed",
        "description":  "The TEP Dashboard is a web-based tool designed to provide an overview of various Earth projects, using interactive charts and graphs. It leverages Chart.js for data visualization and includes custom CSS styles for a unique user experience.",
        "tech":  [
                     "html",
                     "css",
                     "javascript"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/tep-dashboard/screenshots/hero.png",
                      "html":  ["projects/tep-dashboard/html/dashboard.html"]
                  },
        "page":  {
                     "objective":  "A dashboard for visualizing Earth-related projects.",
                     "problem":  "",
                     "solution":  "The TEP Dashboard is a web-based tool designed to provide an overview of various Earth projects, using interactive charts and graphs. It leverages Chart.js for data visualization and includes custom CSS styles for a unique user experience."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "ads-bridge",
        "code":  "P14",
        "name":  "ads-bridge",
        "status":  "production",
        "categories":  [
                           "mcp",
                           "automation",
                           "ai-agents"
                       ],
        "logo":  "python",
        "tagline":  "Local MCP server for driving Revit from chat using pyRevit ADS_Bridge.",
        "workflowStage":  "tool",
        "description":  "Drive Revit directly from chat with a local MCP server exposing the pyRevit ADS_Bridge HTTP API. Supports various tools like querying, executing IronPython scripts, setting parameters, running pipelines, and taking screenshots.",
        "tech":  [
                     "python",
                     "mcp"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/ads-bridge/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Local MCP server for driving Revit from chat using pyRevit ADS_Bridge.",
                     "problem":  "",
                     "solution":  "Drive Revit directly from chat with a local MCP server exposing the pyRevit ADS_Bridge HTTP API. Supports various tools like querying, executing IronPython scripts, setting parameters, running pipelines, and taking screenshots."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "navisbridge",
        "code":  "P15",
        "name":  "NavisBridge",
        "status":  "production",
        "categories":  [
                           "mcp",
                           "automation",
                           "ai-agents",
                           "bim"
                       ],
        "logo":  "csharp",
        "tagline":  "Drive Autodesk Navisworks Manage live from Claude: run/update clash tests, export branded clash reports, pull element properties, append models, and publish NWD/NWF.",
        "workflowStage":  "integration",
        "description":  "The NavisBridge plugin allows users to interact with Autodesk Navisworks Manage directly through the AI platform Claude. It enables running and updating clash tests, exporting branded clash reports, pulling element properties, appending model files into an open document, and saving or publishing federated models (NWD/NWF).",
        "tech":  [
                     "csharp",
                     "dotnet",
                     "python",
                     "mcp"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/navisbridge/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Drive Autodesk Navisworks Manage live from Claude: run/update clash tests, export branded clash reports, pull element properties, append models, and publish NWD/NWF.",
                     "problem":  "",
                     "solution":  "The NavisBridge plugin allows users to interact with Autodesk Navisworks Manage directly through the AI platform Claude. It enables running and updating clash tests, exporting branded clash reports, pulling element properties, appending model files into an open document, and saving or publishing federated models (NWD/NWF)."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "ads-lifecycle",
        "code":  "P16",
        "name":  "ads-lifecycle",
        "status":  "production",
        "categories":  [
                           "plugins",
                           "revit",
                           "bim",
                           "llm"
                       ],
        "logo":  "anthropic",
        "tagline":  "Runs NBC compliance checks and Revit probes on an open model.",
        "workflowStage":  "integration",
        "description":  "The `ads-lifecycle` plugin automates the process of running NBC compliance checks, Revit probes, and Forma pulls for Asure Design projects. It requires a one-time setup involving cloning or copying files to your machine, installing the plugin in Claude Code, creating an APS config file, performing OAuth login, and then executing commands within the tool.",
        "tech":  [
                     "anthropic",
                     "python",
                     "pyrevit",
                     "revit",
                     "autodesk"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/ads-lifecycle/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Runs NBC compliance checks and Revit probes on an open model.",
                     "problem":  "",
                     "solution":  "The `ads-lifecycle` plugin automates the process of running NBC compliance checks, Revit probes, and Forma pulls for Asure Design projects. It requires a one-time setup involving cloning or copying files to your machine, installing the plugin in Claude Code, creating an APS config file, performing OAuth login, and then executing commands within the tool."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "asurebimqc",
        "code":  "P17",
        "name":  "AsureBimQc",
        "status":  "in-progress",
        "categories":  [
                           "plugins",
                           "bim"
                       ],
        "logo":  "csharp",
        "tagline":  "Login and Autodesk ACC access control for BIM QC plugin",
        "workflowStage":  "foundation",
        "description":  "This tool provides the login plumbing for an Asure BIM Quality Control (QC) plugin, enabling users to authenticate with Autodesk\u0027s Account Center (ACC). It includes features such as 3-legged OAuth with PKCE, silent refresh of tokens encrypted at rest using DPAPI, and discovery of hubs and projects. The tool is decoupled from Revit for end-to-end testing.",
        "tech":  [
                     "csharp",
                     "dotnet"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/asurebimqc/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Login and Autodesk ACC access control for BIM QC plugin",
                     "problem":  "",
                     "solution":  "This tool provides the login plumbing for an Asure BIM Quality Control (QC) plugin, enabling users to authenticate with Autodesk\u0027s Account Center (ACC). It includes features such as 3-legged OAuth with PKCE, silent refresh of tokens encrypted at rest using DPAPI, and discovery of hubs and projects. The tool is decoupled from Revit for end-to-end testing."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "cadbridge",
        "code":  "P18",
        "name":  "CADBridge",
        "status":  "production",
        "categories":  [
                           "plugins",
                           "automation",
                           "bim"
                       ],
        "logo":  "autocad",
        "tagline":  "Connects Claude live to AutoCAD for exporting site layouts as lossless JSON.",
        "workflowStage":  "integration",
        "description":  "Automatically loads a .NET add-in in AutoCAD that listens on port 48810 and exports the current selection of objects into a lossless, scale-preserving JSON file. The same export can be done offline using ZWCAD\u0027s `SITEJSON` command without an active listener.",
        "tech":  [
                     "autocad",
                     "dotnet"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/cadbridge/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Connects Claude live to AutoCAD for exporting site layouts as lossless JSON.",
                     "problem":  "",
                     "solution":  "Automatically loads a .NET add-in in AutoCAD that listens on port 48810 and exports the current selection of objects into a lossless, scale-preserving JSON file. The same export can be done offline using ZWCAD\u0027s `SITEJSON` command without an active listener."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "ads-ai-bim-build-tracker",
        "code":  "P19",
        "name":  "ADS AI BIM Build Tracker",
        "status":  "production",
        "categories":  [
                           "automation",
                           "bim"
                       ],
        "logo":  "html",
        "tagline":  "Tracks AI and BIM build progress across projects.",
        "workflowStage":  "integration",
        "description":  "The ADS_AI_BIM_Build_Tracker is a tool designed to monitor the status of AI-driven building information modeling (BIM) projects, ensuring that all tasks related to design, construction, and maintenance are on track. It provides real-time updates and analytics for project managers to make informed decisions.",
        "tech":  [
                     "html",
                     "css",
                     "javascript"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/ads-ai-bim-build-tracker/screenshots/hero.png",
                      "html":  ["projects/ads-ai-bim-build-tracker/html/dashboard.html"]
                  },
        "page":  {
                     "objective":  "Tracks AI and BIM build progress across projects.",
                     "problem":  "",
                     "solution":  "The ADS_AI_BIM_Build_Tracker is a tool designed to monitor the status of AI-driven building information modeling (BIM) projects, ensuring that all tasks related to design, construction, and maintenance are on track. It provides real-time updates and analytics for project managers to make informed decisions."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "architecture-ai",
        "code":  "P20",
        "name":  "Architecture AI",
        "status":  "production",
        "categories":  [
                           "automation",
                           "revit",
                           "bim"
                       ],
        "logo":  "revit",
        "tagline":  "AI-driven architecture visualization and analysis tools for designers.",
        "workflowStage":  "integration into design workflow for real-time feedback and visualization",
        "description":  "A suite of AI-powered tools designed to enhance architectural design processes by automating the creation of photorealistic renders, validating Revit models in real-time, and generating fly-through videos. These tools are tailored specifically for architects, visualizers, and BIM staff, integrating seamlessly with existing workflows to improve efficiency.",
        "tech":  [
                     "revit"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/architecture-ai/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "AI-driven architecture visualization and analysis tools for designers.",
                     "problem":  "",
                     "solution":  "A suite of AI-powered tools designed to enhance architectural design processes by automating the creation of photorealistic renders, validating Revit models in real-time, and generating fly-through videos. These tools are tailored specifically for architects, visualizers, and BIM staff, integrating seamlessly with existing workflows to improve efficiency."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "architecture-boq-template",
        "code":  "P21",
        "name":  "Architecture BOQ Template",
        "status":  "production",
        "categories":  [
                           "automation",
                           "revit",
                           "bim"
                       ],
        "logo":  "revit",
        "tagline":  "A BIM-driven template for generating quantity-based Building Operations and Maintenance (BOM) documents.",
        "workflowStage":  "post-BIM modeling",
        "description":  "This tool automates the creation of detailed building operation and maintenance (BOM) documents from a BIM model. It leverages native Revit parameters to extract quantities, classifies them using Uniclass codes, and formats them into structured BOQ lines for fabric, finishes, openings, and joinery.",
        "tech":  [
                     "revit"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/architecture-boq-template/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "A BIM-driven template for generating quantity-based Building Operations and Maintenance (BOM) documents.",
                     "problem":  "",
                     "solution":  "This tool automates the creation of detailed building operation and maintenance (BOM) documents from a BIM model. It leverages native Revit parameters to extract quantities, classifies them using Uniclass codes, and formats them into structured BOQ lines for fabric, finishes, openings, and joinery."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "cad2revit",
        "code":  "P22",
        "name":  "cad2revit",
        "status":  "production",
        "categories":  [
                           "automation",
                           "revit",
                           "bim"
                       ],
        "logo":  "python",
        "tagline":  "Converts AutoCAD DWG plans into Revit elements with detailed uncertainty reporting.",
        "workflowStage":  "modeling",
        "description":  "A tool that bridges the gap between AutoCAD and Revit by converting 2D AutoCAD drawings into editable native Revit elements. It uses a plugin registry to detect walls, columns, doors, windows, rooms, slabs, and grids, providing per-element confidence + evidence and topology cleanup (endpoint snap, L/T junction extend/trim). The tool supports the ADS office layer standard as default config and offers an optional IFC4 export.",
        "tech":  [
                     "python"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/cad2revit/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "Converts AutoCAD DWG plans into Revit elements with detailed uncertainty reporting.",
                     "problem":  "",
                     "solution":  "A tool that bridges the gap between AutoCAD and Revit by converting 2D AutoCAD drawings into editable native Revit elements. It uses a plugin registry to detect walls, columns, doors, windows, rooms, slabs, and grids, providing per-element confidence + evidence and topology cleanup (endpoint snap, L/T junction extend/trim). The tool supports the ADS office layer standard as default config and offers an optional IFC4 export."
                 },
        "related":  [

                    ]
    },
    {
        "id":  "feasibility-massing-tool",
        "code":  "P23",
        "name":  "Feasibility \u0026 Massing Tool",
        "status":  "production",
        "categories":  [
                           "automation"
                       ],
        "logo":  "python",
        "tagline":  "End-to-end browser-based feasibility and massing tool for site development projects.",
        "workflowStage":  "tool",
        "description":  "A web application that allows users to draw a site, apply NBC + Telangana GO rules, generate massing, export geometry to Rhino/Grasshopper, and download a PPTX deck. It supports project types like highrise, mid-rise, villa township, mixed-use, and more.",
        "tech":  [
                     "python"
                 ],
        "efficiency":  null,
        "media":  {
                      "hero":  "projects/feasibility-massing-tool/screenshots/hero.png"
                  },
        "page":  {
                     "objective":  "End-to-end browser-based feasibility and massing tool for site development projects.",
                     "problem":  "",
                     "solution":  "A web application that allows users to draw a site, apply NBC + Telangana GO rules, generate massing, export geometry to Rhino/Grasshopper, and download a PPTX deck. It supports project types like highrise, mid-rise, villa township, mixed-use, and more."
                 },
        "related":  [

                    ]
    }
];
