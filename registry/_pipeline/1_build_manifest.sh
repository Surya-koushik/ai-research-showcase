#!/usr/bin/env bash
# Curate tool/project units + signal files. Paths only — no contents printed.
set -o pipefail
OUT="/y/CLAUDE DIRECT ACCESS FOLDER/AI_Research_Showcase/registry/units"
mkdir -p "$OUT"
MAN="$OUT/manifest.tsv"
: > "$MAN"

# candidate parent scan roots (each child dir = a unit); plus explicit single units
PARENTS=(
"/y/CLAUDE DIRECT ACCESS FOLDER/2_MCPS"
"/z/00 SM TEAM/AI Research/Claude direct access folder/2_MCPS"
"/c/Users/surya ASURE/Downloads/Claude"
)
# explicit unit roots (folders that ARE a unit)
UNITS=(
"/y/CLAUDE DIRECT ACCESS FOLDER/ads-cad3d-studio"
"/y/CLAUDE DIRECT ACCESS FOLDER/cad2revit"
"/y/CLAUDE DIRECT ACCESS FOLDER/ai-team-hub"
"/y/CLAUDE DIRECT ACCESS FOLDER/headroom"
"/y/CLAUDE DIRECT ACCESS FOLDER/AI SERVER"
"/y/CLAUDE DIRECT ACCESS FOLDER/Gmail tracking DATA"
"/y/CLAUDE DIRECT ACCESS FOLDER/LIVE_CODES_REGULATIONS_DATABASE"
"/y/CLAUDE DIRECT ACCESS FOLDER/Plannerly"
"/c/Users/surya ASURE/Downloads/Claude/AdsPhoenixL1"
"/c/Users/surya ASURE/Downloads/Claude/AdsRevitToolbox"
"/c/Users/surya ASURE/Downloads/Claude/AsureBimQc"
"/c/Users/surya ASURE/Downloads/Claude/asure-doc-platform"
"/c/Users/surya ASURE/Downloads/Claude/10 - AI Feasibility Tool"
"/c/Users/surya ASURE/Downloads/Claude/4 - Local AI Models"
"/c/Users/surya ASURE/Downloads/Claude/9 - Agent Teams"
"/z/00 SM TEAM/AI Research/Team Assessments"
"/z/00 SM TEAM/AI Research/Skills_Library_Master"
"/z/Knowledge Centre/AI Tools/03_Tools"
"/z/Knowledge Centre/AI Tools/08_Tools"
"/z/Knowledge Centre/AI Tools/04_Architecture_AI"
)
# explicit single-file dashboards / docs (unit = one file)
FILES=(
"/y/CLAUDE DIRECT ACCESS FOLDER/ADS_AI_BIM_Build_Tracker.html"
"/c/Users/surya ASURE/Downloads/H10_BIM_Dashboard (2).html"
"/c/Users/surya ASURE/Downloads/P25_Predictability_Dashboard (2).html"
"/z/00 SM TEAM/AI Research/TEP_Dashboard_v2.html"
)

EXC='(^_|node_modules|\.git$|_backup|_archive|comfy|chatgpt|_secret|_confidential|__pycache__|\.venv|venv$)'

pick_signals(){ # $1 = dir ; echo up to 5 signal file paths
  local d="$1" found=()
  # priority-ordered patterns
  for pat in "README.md" "HANDOFF.md" "readme.md" "manifest.json" "manifest.yaml" "manifest.yml" ".mcp.json" "package.json" "pyproject.toml"; do
    for f in "$d"/$pat; do [ -f "$f" ] && found+=("$f"); done
  done
  # first markdown doc, first csproj, main entry
  while IFS= read -r f; do found+=("$f"); done < <(find "$d" -maxdepth 2 -type f \( -iname '*.md' -o -iname '*.csproj' -o -iname 'main.py' -o -iname 'server.py' -o -iname 'index.html' -o -iname 'app.py' -o -iname '*.txt' \) 2>/dev/null | grep -vEi "$EXC" | head -8)
  # de-dupe, cap 5, size-limit each <120KB
  printf '%s\n' "${found[@]}" | awk '!seen[$0]++' | while read -r f; do
    [ -f "$f" ] || continue; sz=$(stat -c%s "$f" 2>/dev/null); [ "${sz:-999999}" -le 122880 ] && echo "$f"; done | head -5
}

emit(){ # id \t name \t root \t sig1|sig2|...
  local id="$1" root="$2"; local name; name=$(basename "$root")
  local sigs; sigs=$(pick_signals "$root" | paste -sd'|' -)
  [ -z "$sigs" ] && return 0
  printf '%s\t%s\t%s\t%s\n' "$id" "$name" "$root" "$sigs" >> "$MAN"
}

i=0
for p in "${PARENTS[@]}"; do
  [ -d "$p" ] || continue
  for d in "$p"/*/; do
    d="${d%/}"; b=$(basename "$d")
    echo "$b" | grep -qiE "$EXC" && continue
    i=$((i+1)); emit "u$(printf '%03d' $i)" "$d"
  done
done
for d in "${UNITS[@]}"; do [ -d "$d" ] && { i=$((i+1)); emit "u$(printf '%03d' $i)" "$d"; }; done
for f in "${FILES[@]}"; do [ -f "$f" ] && { i=$((i+1)); printf 'u%03d\t%s\t%s\t%s\n' "$i" "$(basename "$f")" "$f" "$f" >> "$MAN"; }; done

echo "UNITS: $(wc -l < "$MAN")"
echo "--- unit names (paths withheld) ---"
cut -f2 "$MAN" | sort -u