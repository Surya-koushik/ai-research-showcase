# ASURE - Server and Endpoint Locations

> How to reach the running services. Ports/endpoints extracted from each tool's config by a local model plus regex. Verify each before connecting. Known-good on this machine: Ollama `11434`, Headroom proxy `8787`, pyRevit Routes `48884/48885`.

| Tool | Category | Endpoint / Port | Start command | Source |
|---|---|---|---|---|
| Asure Document Platform | dashboard | `port(s) 8000 (detected)` | `py -3.12 -m venv .venv; .\venv\Scripts\python.exe -m pip install -r requirements.txt; .\venv\Scripts\python.exe -m pytest; docker compose up -d` | `/c/Users/surya ASURE/Downloads/Claude/asure-doc-platform` |
| ads-bridge | mcp-server | `127.0.0.1:48884 (detected)` | `C:\Users\accou\.ads-cad\mcp\.venv\Scripts\python.exe ${__dirname}/server.py` | `/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS/ads-bridge` |
| get_revit_status | mcp-server | `port(s) 48884 (detected)` | `-` | `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/mcp-server-for-revit-python.extension` |
| NavisBridge | mcp-server | `http://127.0.0.1:47885/navis-bridge` | `-` | `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/navis-bridge` |
| ads-lifecycle | plugin | `port(s) 8080 (detected)` | `/plugin marketplace add C:/Users/<you>/Downloads/Claude/ads-marketplace && /plugin install ads-lifecycle@asure-design` | `/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS/ads-marketplace` |
| ads-marketplace | plugin | `port(s) 8080 (detected)` | `-` | `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/ads-marketplace` |
| AsureBimQc | plugin | `port(s) 8080 (detected)` | `dotnet run --project src/AsureBimQc.AuthTester` | `/c/Users/surya ASURE/Downloads/Claude/AsureBimQc` |
| CADBridge | plugin | `http://127.0.0.1:48810/cad-bridge/` | `powershell -ExecutionPolicy Bypass -File .\build.ps1 -Deploy` | `/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS/cad-bridge` |
| ADS CAD3D Studio | tool | `port(s) 8712 (detected)` | `.\Start-ADS-CAD3D-Studio.ps1` | `/c/Users/surya ASURE/Downloads/Claude/ads-cad3d-studio` |
| Feasibility & Massing Tool | tool | `port(s) 3000 (detected)` | `python -m uvicorn backend.main:app --host 127.0.0.1 --port 3000` | `/c/Users/surya ASURE/Downloads/Claude/10 - AI Feasibility Tool` |
| Headroom | tool | `port(s) 8787 (detected)` | `/usr/local/bin/headroom-proxy-start.sh` | `/y/CLAUDE DIRECT ACCESS FOLDER/headroom` |
| Plannerly | tool | `port(s) 48884 (detected)` | `-` | `/y/CLAUDE DIRECT ACCESS FOLDER/Plannerly` |

