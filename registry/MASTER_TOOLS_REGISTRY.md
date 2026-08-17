# ASURE - Master Tools and Systems Registry

> Auto-generated from source files by a LOCAL model (Ollama `qwen2.5vl:7b`) - no cloud / Claude credits used for the reading. Internal registry (Y drive). Every field is derived from each tool's own files; server locations are extracted from real configs. Verify before relying on any endpoint.

**Units documented:** 40  .  **Generated:** see file date

## Server / Endpoint Quick Index

| Tool | Endpoint / Port | Category |
|---|---|---|
| Asure Document Platform | `port(s) 8000 (detected)` | dashboard |
| ads-bridge | `127.0.0.1:48884 (detected)` | mcp-server |
| get_revit_status | `port(s) 48884 (detected)` | mcp-server |
| NavisBridge | `http://127.0.0.1:47885/navis-bridge` | mcp-server |
| ads-lifecycle | `port(s) 8080 (detected)` | plugin |
| ads-marketplace | `port(s) 8080 (detected)` | plugin |
| AsureBimQc | `port(s) 8080 (detected)` | plugin |
| CADBridge | `http://127.0.0.1:48810/cad-bridge/` | plugin |
| ADS CAD3D Studio | `port(s) 8712 (detected)` | tool |
| Feasibility & Massing Tool | `port(s) 3000 (detected)` | tool |
| Headroom | `port(s) 8787 (detected)` | tool |
| Plannerly | `port(s) 48884 (detected)` | tool |

## MCP Servers  (3)

### ads-bridge
*Local MCP server for driving Revit from chat using pyRevit ADS_Bridge.*

Drive Revit directly from chat with a local MCP server exposing the pyRevit ADS_Bridge HTTP API. Supports various tools like querying, executing IronPython scripts, setting parameters, running pipelines, and taking screenshots.

- **Status:** production
- **Tech:** python, FastMCP
- **Workflow stage:** tool
- **Server:** `127.0.0.1:48884 (detected)`
- **Start:** `C:\Users\accou\.ads-cad\mcp\.venv\Scripts\python.exe ${__dirname}/server.py`
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS/ads-bridge`

### get_revit_status
*Check if the Revit-MCP API is active and responding.*

This tool verifies whether the Model Context Protocol (MCP) server for Autodesk Revit is operational by sending a request to the MCP server endpoint. It returns a status indicating whether the connection is successful or not, which helps in diagnosing connectivity issues with the MCP server.

- **Status:** experimental
- **Tech:** FastMCP, HTTP requests
- **Workflow stage:** diagnostic
- **Server:** `port(s) 48884 (detected)`
- **Source:** `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/mcp-server-for-revit-python.extension`

### NavisBridge
*Drive Autodesk Navisworks Manage live from Claude: run/update clash tests, export branded clash reports, pull element properties, append models, and publish NWD/NWF.*

The NavisBridge plugin allows users to interact with Autodesk Navisworks Manage directly through the AI platform Claude. It enables running and updating clash tests, exporting branded clash reports, pulling element properties, appending model files into an open document, and saving or publishing federated models (NWD/NWF).

- **Status:** production
- **Tech:** C#, .NET Framework, Python, FastMCP
- **Workflow stage:** integration
- **Server:** `http://127.0.0.1:47885/navis-bridge`
- **Source:** `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/navis-bridge`

## Plugins and Add-ins  (11)

### ADS Phoenix L1
*Weekly Level-1 self-certification checklist runner for Revit models.*

A native C# add-in for Revit 2025 that runs a fixed 22-item Level-1 self-certification checklist across five hard-stop gates, auto-fixes whitelisted issues, and produces a PDF report and a populated checklist workbook to upload alongside the model in ACC.

- **Status:** production
- **Tech:** C#, .NET 8, RevitAPI.dll, ClosedXML, HTMLâ†’PDF (headless Edge)
- **Workflow stage:** post-production
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/AdsPhoenixL1`

### ADS Revit Toolbox
*A standalone Revit 2025 add-in suite of productivity/QA tools.*

This is a standalone Revit 2025 add-in suite driven by market research into the most common Revit pain points. It includes reusable foundations from AdsPhoenixL1 and is project-agnostic, meaning it works on any model with zero project configuration.

- **Status:** research
- **Tech:** Revit, market research
- **Workflow stage:** research phase (2026-07-01)
- **Related:** PHX_ADS (AdsPhoenixL1)
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/AdsRevitToolbox`

### ads-lifecycle
*Runs NBC compliance checks and Revit probes on an open model.*

The `ads-lifecycle` plugin automates the process of running NBC compliance checks, Revit probes, and Forma pulls for Asure Design projects. It requires a one-time setup involving cloning or copying files to your machine, installing the plugin in Claude Code, creating an APS config file, performing OAuth login, and then executing commands within the tool.

- **Status:** production
- **Tech:** Windows, Claude Code, Python 3.10+, pyRevit, Revit 2023, Autodesk ID
- **Workflow stage:** integration
- **Server:** `port(s) 8080 (detected)`
- **Start:** `/plugin marketplace add C:/Users/<you>/Downloads/Claude/ads-marketplace && /plugin install ads-lifecycle@asure-design`
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS/ads-marketplace`

### ads-marketplace
*A suite of plugins for managing and automating tasks related to ads lifecycle in Revit and Forma.*

The `ads-marketplace` is a collection of plugins designed to streamline the process of managing and automating various tasks within an architectural design workflow, specifically focusing on Revit and Forma. It includes tools for model health checks, compliance checks, and data extraction from Forma, all managed through a CLI interface.

- **Status:** production
- **Tech:** Python, pyRevit, Claude Code
- **Workflow stage:** tool
- **Server:** `port(s) 8080 (detected)`
- **Related:** ads-lifecycle
- **Source:** `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/ads-marketplace`

### AsureBimQc
*Login and Autodesk ACC access control for BIM QC plugin*

This tool provides the login plumbing for an Asure BIM Quality Control (QC) plugin, enabling users to authenticate with Autodesk's Account Center (ACC). It includes features such as 3-legged OAuth with PKCE, silent refresh of tokens encrypted at rest using DPAPI, and discovery of hubs and projects. The tool is decoupled from Revit for end-to-end testing.

- **Status:** in-progress
- **Tech:** C#, .NET Core, OAuth, PKCE, DPAPI
- **Workflow stage:** foundation
- **Server:** `port(s) 8080 (detected)`
- **Start:** `dotnet run --project src/AsureBimQc.AuthTester`
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/AsureBimQc`

### CADBridge
*Connects Claude live to AutoCAD for exporting site layouts as lossless JSON.*

Automatically loads a .NET add-in in AutoCAD that listens on port 48810 and exports the current selection of objects into a lossless, scale-preserving JSON file. The same export can be done offline using ZWCAD's `SITEJSON` command without an active listener.

- **Status:** production
- **Tech:** AutoCAD, .NET API (v8), HTTP server
- **Workflow stage:** integration
- **Server:** `http://127.0.0.1:48810/cad-bridge/`
- **Start:** `powershell -ExecutionPolicy Bypass -File .\build.ps1 -Deploy`
- **Related:** cad_status, cad_export, cad_read_export, cad_validate_export, cad_summarize_layout, cad_stage_import
- **Source:** `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/cad-bridge`

### Computational Design Skills
*A plugin for computational design covering geometry, parametric modeling, and more.*

A comprehensive plugin with over 35,000 lines of code across 75 files, offering 18 interconnected skills in areas like parametric modeling, generative design, structural computation, environmental simulation, facade engineering, digital fabrication, BIM scripting, and machine learning for AEC. It includes 7 Python calculators for various computations.

- **Status:** production
- **Tech:** Python, Claude
- **Workflow stage:** early design phase
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS/skill-repos`

### Layout Plotter
*A plugin for creating detailed layout plots in architectural design.*

The Layout Plotter is a specialized plugin designed to generate high-quality layout plots from architectural designs. It supports various features such as precise line editing, polygonal area calculations, and the ability to export data into JSON format for further analysis or integration with other tools. The plugin has been updated multiple times (v3.6+) and integrates well with existing design workflows.

- **Status:** production
- **Tech:** C#, .NET, JSON
- **Workflow stage:** tool
- **Related:** SiteJsonExport plugin, Gmail Reply Tracker
- **Source:** `/z/00 SM TEAM/AI Research/Team Assessments`

### Obsidian
*A personal digital vault for organizing notes and projects.*

Obsidian is a powerful tool that allows users to create and manage their own digital vaults. It supports markdown formatting, tags, and links between notes, making it an excellent platform for knowledge management and project organization.

- **Status:** production
- **Tech:** Markdown, JavaScript
- **Workflow stage:** tool
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/AI SERVER`

### Revit Plugin
*A suite of plugins for Autodesk Revit.*

This is a collection of plugins designed to enhance the functionality and efficiency of Autodesk Revit. It includes tools such as ADS Phoenix L1 Checklist, ADS Revit Toolbox, Asure BIM QC, and others that provide additional features like reference data management, test harnesses, and maintenance scripts for pyRevit.

- **Status:** production
- **Tech:** C#, .NET, Python
- **Workflow stage:** active use
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/3 - Revit Plugin`

### RevitAddinHarness
*A minimal setup for writing and testing native C# Revit plugins.*

A complete solution for developing and deploying native C# Revit add-ins, including a real `.addin` manifest, one-command build/deploy process, and F5 debugging into running Revit. Supports both Revit 2024 and 2025 with .NET Framework 4.8 and .NET 8 respectively.

- **Status:** production
- **Tech:** C#, .NET Framework, .NET 8
- **Workflow stage:** development
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/RevitAddinHarness`

## Dashboards  (5)

### AI Team Hub
*A dashboard for managing AI team projects and resources.*

AI Team Hub is a web-based application designed to streamline the management of AI-related projects within Asure Design Studio. It provides an overview, work priorities, requirements, team information, procedures, tools, settings, and more, all accessible from a single interface.

- **Status:** production
- **Tech:** HTML, CSS, JavaScript
- **Workflow stage:** core
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/ai-team-hub`

### Asure Document Platform
*Self-hosted document generation platform for branded MOU/contract PDFs.*

A self-hosted web application designed to generate branded MOUs and contracts as PDFs from a guided form. It runs on Surya's Windows 11 PC using FastAPI, PostgreSQL, WeasyPrint, Caddy, and Redis.

- **Status:** in-progress
- **Tech:** FastAPI, PostgreSQL, WeasyPrint, Caddy, Redis
- **Workflow stage:** foundation -> auth -> mou editor -> pdf export -> audit/dashboard -> deploy
- **Server:** `port(s) 8000 (detected)`
- **Start:** `py -3.12 -m venv .venv; .\venv\Scripts\python.exe -m pip install -r requirements.txt; .\venv\Scripts\python.exe -m pytest; docker compose up -d`
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/asure-doc-platform`

### H10_BIM_Dashboard
*A dashboard for tracking BIM progress and project status.*

This dashboard provides real-time updates on the progress of a Building Information Modeling (BIM) project, including key metrics such as completion percentages and resource utilization. It is designed to help stakeholders monitor and manage their projects more effectively.

- **Status:** production
- **Tech:** HTML, CSS, JavaScript
- **Workflow stage:** monitoring
- **Source:** `/c/Users/surya ASURE/Downloads/H10_BIM_Dashboard (2).html`

### P25 Predictability Dashboard
*A dashboard for tracking and analyzing project predictability metrics.*

The P25 Predictability Dashboard provides a comprehensive view of various project metrics to help teams identify trends, optimize processes, and improve overall project predictability. It integrates data from multiple sources to offer real-time insights into the likelihood of meeting deadlines and budget constraints.

- **Status:** production
- **Tech:** HTML, CSS, JavaScript
- **Workflow stage:** post-production
- **Source:** `/c/Users/surya ASURE/Downloads/P25_Predictability_Dashboard (2).html`

### TEP_Dashboard_v2
*A dashboard for visualizing Earth-related projects.*

The TEP Dashboard is a web-based tool designed to provide an overview of various Earth projects, using interactive charts and graphs. It leverages Chart.js for data visualization and includes custom CSS styles for a unique user experience.

- **Status:** production
- **Tech:** HTML, CSS, JavaScript, Chart.js
- **Workflow stage:** completed
- **Source:** `/z/00 SM TEAM/AI Research/TEP_Dashboard_v2.html`

## AI Agents  (2)

### ChatGPT
*A broad everyday AI assistant for writing and reasoning.*

ChatGPT is a versatile AI tool designed to assist with various tasks including writing, reasoning, and providing general information. It's particularly useful for everyday interactions and can handle a wide range of queries and topics.

- **Status:** production
- **Tech:** AI, Natural Language Processing
- **Workflow stage:** initial stages (e.g., ideation, research)
- **Source:** `/z/Knowledge Centre/AI Tools/03_Tools`

### Dorothy
*Desktop app to orchestrate multiple AI CLI agents (Claude, Codex, Gemini)*

A desktop application designed for managing and orchestrating multiple AI Command Line Interface (CLI) agents such as Claude, Codex, and Gemini. It provides a user-friendly interface for setting up and executing tasks with these agents.

- **Status:** production
- **Tech:** Electron, npm
- **Workflow stage:** tool
- **Related:** 777genius/agent-teams-ai, untra/operator
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/9 - Agent Teams`

## Tools and Apps  (16)

### ADS CAD3D Studio
*CAD drawings to semantic 3D building models with Layer Standardizer and Three.js QA viewer.*

A local tool for Asure Design Studio that ingests consultant CAD drawings (DWG/DXF), standardizes every layer to the ten ADS standard layers, extracts a semantic building model per level, and exports to various formats including ADS Bridge JSON, IFC4, glTF+DAE, and Rhino 3dm.

- **Status:** production
- **Tech:** Python, FastAPI, ezdxf, numpy, shapely, pyyaml
- **Workflow stage:** M7 IFC/glTF/Rhino
- **Server:** `port(s) 8712 (detected)`
- **Start:** `.\Start-ADS-CAD3D-Studio.ps1`
- **Efficiency:** 80/123 wall face segments paired into 40 extruded walls with zero manual work.
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/ads-cad3d-studio`

### ADS_AI_BIM_Build_Tracker
*Tracks AI and BIM build progress across projects.*

The ADS_AI_BIM_Build_Tracker is a tool designed to monitor the status of AI-driven building information modeling (BIM) projects, ensuring that all tasks related to design, construction, and maintenance are on track. It provides real-time updates and analytics for project managers to make informed decisions.

- **Status:** production
- **Tech:** HTML, CSS, JavaScript
- **Workflow stage:** integration
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/ADS_AI_BIM_Build_Tracker.html`

### agent-browser
*Rust-native browser-automation CLI for AI agents.*

A Rust-based command-line interface designed to automate web interactions and tasks using AI-driven commands. It allows direct control of a Chrome browser instance from the command line, enabling efficient automation without requiring an intermediate Python agent framework.

- **Status:** production
- **Tech:** Rust, Node.js, Chrome
- **Workflow stage:** automation
- **Start:** `npm install -g agent-browser && agent-browser install`
- **Efficiency:** Replaces one-off Selenium scripts and simplifies BIM/AI research tasks.
- **Related:** Browser-Use
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/4 - Local AI Models`

### Architecture AI
*AI-driven architecture visualization and analysis tools for designers.*

A suite of AI-powered tools designed to enhance architectural design processes by automating the creation of photorealistic renders, validating Revit models in real-time, and generating fly-through videos. These tools are tailored specifically for architects, visualizers, and BIM staff, integrating seamlessly with existing workflows to improve efficiency.

- **Status:** production
- **Tech:** AI, MLSD, LoRA training, Revit integration
- **Workflow stage:** integration into design workflow for real-time feedback and visualization
- **Related:** Sketch-to-render, ControlNet, LoRA training, Revit + AI, AI video, Failure modes
- **Source:** `/z/Knowledge Centre/AI Tools/04_Architecture_AI`

### Architecture BOQ Template
*A BIM-driven template for generating quantity-based Building Operations and Maintenance (BOM) documents.*

This tool automates the creation of detailed building operation and maintenance (BOM) documents from a BIM model. It leverages native Revit parameters to extract quantities, classifies them using Uniclass codes, and formats them into structured BOQ lines for fabric, finishes, openings, and joinery.

- **Status:** production
- **Tech:** BIM, Revit, Uniclass
- **Workflow stage:** post-BIM modeling
- **Efficiency:** Hours/time saved not specified.
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/5 - H10`

### asure-claude-prompting-guide
*A comprehensive guide for using Claude in prompting.*

This HTML file serves as the studio's full prompting guide for using Claude. It provides detailed instructions and examples to help users effectively utilize Claude for various tasks, ensuring a smooth workflow experience.

- **Status:** production
- **Tech:** HTML
- **Workflow stage:** initial setup
- **Source:** `/z/Knowledge Centre/AI Tools/08_Tools`

### big-ai-playbook
*BIG (Bjarke Ingels Group) AI-in-architecture playbook adapted for Asure Design Studio.*

Comprehensive deep analysis of Herman's ATN Summit 2026 talk on BIG's AI adoption, cross-verified with 10 web research streams and adapted to Asure Design Studio's scale and hardware. It covers firm/conference context, evolution timeline, image generation stack, knowledge management & BIGSTER, Revit integration, video generation, philosophy, peer adoption, enterprise LLM cases, and Asure-specific application.

- **Status:** production
- **Tech:** AI, LoRA training, ComfyUI + ControlNet, MLSD, Revit MCP-server
- **Workflow stage:** knowledge
- **Efficiency:** 20-35%
- **Related:** ComfyUI, ControlNet, MLSD, Revit MCP-server
- **Source:** `/z/00 SM TEAM/AI Research/Skills_Library_Master`

### cad2revit
*Converts AutoCAD DWG plans into Revit elements with detailed uncertainty reporting.*

A tool that bridges the gap between AutoCAD and Revit by converting 2D AutoCAD drawings into editable native Revit elements. It uses a plugin registry to detect walls, columns, doors, windows, rooms, slabs, and grids, providing per-element confidence + evidence and topology cleanup (endpoint snap, L/T junction extend/trim). The tool supports the ADS office layer standard as default config and offers an optional IFC4 export.

- **Status:** production
- **Tech:** Python, ezdxf, pyyaml, shapely, networkx, ifcopenshell
- **Workflow stage:** modeling
- **Start:** `pip install -r requirements.txt`
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/cad2revit`

### Evolve Asure
*Design intelligence for the built environment using BIM tools and AI explorations.*

Evolve Asure is a software tool that combines Building Information Modeling (BIM) tools with artificial intelligence to enhance project command centers, providing real-time insights and automation capabilities in architectural design and construction management.

- **Status:** production
- **Tech:** HTML, CSS, JavaScript, Web Fonts, SVG Filters
- **Workflow stage:** design-intelligence
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/1 - Website UI`

### Feasibility & Massing Tool
*End-to-end browser-based feasibility and massing tool for site development projects.*

A web application that allows users to draw a site, apply NBC + Telangana GO rules, generate massing, export geometry to Rhino/Grasshopper, and download a PPTX deck. It supports project types like highrise, mid-rise, villa township, mixed-use, and more.

- **Status:** production
- **Tech:** FastAPI, uvicorn, Pydantic, Pandas, OpenPyXL, ezdxf, Shapely, pyproj, Requests, python-pptx, Python-multipart, Pillow
- **Workflow stage:** tool
- **Server:** `port(s) 3000 (detected)`
- **Start:** `python -m uvicorn backend.main:app --host 127.0.0.1 --port 3000`
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/10 - AI Feasibility Tool`

### Headroom
*A context-compression proxy for Claude Code that reduces token usage on large payloads.*

Headroom is a context-compression proxy designed to sit between Claude Code and the Anthropic API. It compresses big/repetitive context (tool outputs, logs, history) before it reaches the model, typically cutting token usage significantly on bulky payloads.

- **Status:** production
- **Tech:** Python, Rust, ONNX
- **Workflow stage:** pre-processing
- **Server:** `port(s) 8787 (detected)`
- **Start:** `/usr/local/bin/headroom-proxy-start.sh`
- **Related:** Claude Code, Anthropic API
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/headroom`

### Malaxmi AI Integration Strategy
*A comprehensive AI backbone and vertical-specific playbooks for Malaxmi Group's diverse business units.*

This strategy outlines a group-wide AI backbone designed to unify knowledge, automate document intelligence, provide a shared digital assistant, and establish governance. It also includes per-vertical playbooks tailored for property development, infrastructure/EPC, hospitality, logistics/food park, and energy sectors, leveraging AI for various operational tasks.

- **Status:** in-progress
- **Tech:** AI, RAG, Supabase, Phoenix/Toolbox
- **Workflow stage:** analysis
- **Efficiency:** Noy-Zhang -40% time; support +14/34%
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/malaxmi_group_research`

### malaxmi_ai_story
*A collection of AI-related videos and resources for learning about AI tools and their applications.*

This project compiles a series of video tutorials and articles covering various aspects of artificial intelligence, including AI assistants, agents, and open-source models. It provides concrete use cases and examples to demonstrate how businesses can adopt AI technologies in areas such as email automation, workflow management, content creation, and more.

- **Status:** production
- **Tech:** puppeteer-core, YouTube
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/malaxmi_ai_story`

### MCP Revit
*A framework for autonomous error handling and chat-driven operations in Revit workflows.*

MCP Revit is a tool designed to handle errors autonomously, with structured responses from every bridge call. It categorizes errors into known classes (e.g., timeout, wedge) and applies recovery patterns automatically. The system verifies the fix's success before continuing or escalating issues if necessary.

- **Status:** production
- **Tech:** Revit, HTTP, error handling
- **Workflow stage:** integration with Revit workflows for autonomous operations
- **Efficiency:** silent recovery should be the default, only escalating when model risk or design ambiguity is present.
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS/MCP Revit`

### Plannerly
*Automates BIM execution planning and tracking across multiple projects.*

A comprehensive tool for managing the entire lifecycle of a building information model (BIM) project, including scope definition, document management, and verification. It automates tasks such as LOD progression, stage gate audits, and milestone tracking to streamline project management processes.

- **Status:** production
- **Tech:** Revit, Python, APIs
- **Workflow stage:** BIM execution planning and tracking
- **Server:** `port(s) 48884 (detected)`
- **Efficiency:** 70 hrs / project saved in BEP planning, ~3 months setup time per future project reduced.
- **Related:** Revit, pyRevit Bridge
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/Plannerly`

### Revit Dynamo
*A powerful automation and visualization tool for Revit models using Python scripts.*

Revit Dynamo is a graphical programming environment that allows users to create custom workflows, automate repetitive tasks, and visualize complex data within Autodesk Revit. It leverages the power of Python scripting to extend the capabilities of Revit by enabling users to define their own algorithms for model manipulation and analysis.

- **Status:** production
- **Tech:** Python, .NET SDK
- **Workflow stage:** automation
- **Related:** pyRevit
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/7 - Revit Dynamo`

## Research  (2)

### Claude
*Smart-stub auto-generated project for AI research and development.*

This is a smart-stub auto-generated project folder for Claude, an AI research tool. It inherits master rules from `0_RULES/claudemaster.md` and contains files relevant to ongoing AI projects in the NIGHT test - docs area of Z:older structure. The project includes guidelines on how to work within this directory, including default save locations and workflow procedures.

- **Status:** in-progress
- **Tech:** AI, smart-stub
- **Workflow stage:** read this + `0_RULES/CLAUDE.md` -> state a 2-3 sentence plan -> back up before risky edits -> log the session to `5_OPS\history\`.
- **Source:** `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/NIGHT test - docs`

### Malaxmi
*AI-transformation corpus for electricity to AI HTML deck*

The Malaxmi project is an active work in progress that involves transforming a group's AI research into an HTML deck focused on electricity and its AI applications.

- **Status:** in-progress
- **Tech:** AI, HTML
- **Workflow stage:** active use, not moved
- **Source:** `/c/Users/surya ASURE/Downloads/Claude/6 - Malaxmi`

## Knowledge Base  (1)

### LIVE_CODES_REGULATIONS_DATABASE
*A long-term knowledge base of codes and regulations for building design.*

Tracks and manages the regulatory landscape for various jurisdictions, including national, state, local, and specialist layers. It provides a structured database with active/inactive status tracking, jurisdiction matrices, topic mappings, and rule cards verified by human review.

- **Status:** production
- **Tech:** MarkItDown, Python script
- **Workflow stage:** ingestion and extraction
- **Start:** `python 06_AUTOMATION/markitdown_conversion_script/codes_db_update.py`
- **Source:** `/y/CLAUDE DIRECT ACCESS FOLDER/LIVE_CODES_REGULATIONS_DATABASE`


