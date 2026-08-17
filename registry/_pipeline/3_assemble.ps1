$ErrorActionPreference='Continue'
$reg='Y:\CLAUDE DIRECT ACCESS FOLDER\AI_Research_Showcase\registry'
$U="$reg\units"

$all=@()
Get-ChildItem "$U\u*.json" | ForEach-Object {
  try{ $o=Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json } catch { return }
  if($o){ $all += $o }
}
function Score($o){ $s=0; foreach($k in 'one_liner','description','workflow_stage'){ $v="$($o.$k)"; if($v -and $v -notmatch '^(null|unknown|)$' -and $v -notmatch 'not (explicitly )?stated|do not say|truly do not'){$s++} }; if($o.tech){$s+=([array]$o.tech).Count}; return $s }
$byName=@{}
foreach($o in $all){
  $key=("$($o.name)").ToLower().Trim(); if(-not $key){$key=("$($o.source_name)").ToLower()}
  if(-not $byName.ContainsKey($key)){ $byName[$key]=$o }
  else {
    $ex=$byName[$key]
    $ports=@(); foreach($p in @($ex.detected_ports,$o.detected_ports)){ if($p){$ports+=($p -split ',')} }
    $mergedPorts=($ports | Where-Object{$_} | Select-Object -Unique) -join ','
    if((Score $o) -gt (Score $ex)){ $byName[$key]=$o; $byName[$key].detected_ports=$mergedPorts }
    else { $ex.detected_ports=$mergedPorts }
  }
}
$tools=$byName.Values | Sort-Object { "$($_.category)" }, { "$($_.name)" }

$catOrder=@('mcp-server','plugin','dashboard','automation','ai-agent','tool','research','knowledge','library')
$catTitle=@{ 'mcp-server'='MCP Servers';'plugin'='Plugins and Add-ins';'dashboard'='Dashboards';'automation'='Automation';'ai-agent'='AI Agents';'tool'='Tools and Apps';'research'='Research';'knowledge'='Knowledge Base';'library'='Libraries' }
function Clean($v){ $s="$v"; if($s -match '^(null|unknown|)$' -or $s -match 'not (explicitly )?stated|do not say|truly do not|provided files'){return $null}; return $s }
function TechStr($o){ if($o.tech){ return (@($o.tech) -join ', ') } return $null }
function ServerStr($o){
  $ep=Clean $o.server.endpoint; $ports=$o.detected_ports
  if($ep){ return $ep }
  if($o.server.runs_as_server -eq $true -and $ports){ return ('127.0.0.1:'+(($ports -split ',')[0])+' (detected)') }
  if($ports){ return ('port(s) '+$ports+' (detected)') }
  return $null
}

$tools | ConvertTo-Json -Depth 8 | Set-Content "$reg\tools.json" -Encoding utf8

$md=New-Object System.Text.StringBuilder
[void]$md.AppendLine('# ASURE - Master Tools and Systems Registry')
[void]$md.AppendLine('')
[void]$md.AppendLine('> Auto-generated from source files by a LOCAL model (Ollama `qwen2.5vl:7b`) - no cloud / Claude credits used for the reading. Internal registry (Y drive). Every field is derived from each tool''s own files; server locations are extracted from real configs. Verify before relying on any endpoint.')
[void]$md.AppendLine('')
[void]$md.AppendLine(('**Units documented:** '+$tools.Count+'  .  **Generated:** see file date'))
[void]$md.AppendLine('')
[void]$md.AppendLine('## Server / Endpoint Quick Index')
[void]$md.AppendLine('')
[void]$md.AppendLine('| Tool | Endpoint / Port | Category |')
[void]$md.AppendLine('|---|---|---|')
foreach($o in $tools){ $srv=ServerStr $o; if($srv){ [void]$md.AppendLine(('| '+$o.name+' | `'+$srv+'` | '+$o.category+' |')) } }
[void]$md.AppendLine('')
foreach($cat in $catOrder){
  $g=$tools | Where-Object { "$($_.category)" -eq $cat }
  if(-not $g){continue}
  [void]$md.AppendLine(('## '+$catTitle[$cat]+'  ('+(@($g).Count)+')'))
  [void]$md.AppendLine('')
  foreach($o in $g){
    [void]$md.AppendLine(('### '+$o.name))
    $ol=Clean $o.one_liner; if($ol){[void]$md.AppendLine('*'+$ol+'*')}
    [void]$md.AppendLine('')
    $desc=Clean $o.description; if($desc){[void]$md.AppendLine($desc);[void]$md.AppendLine('')}
    $rows=@('- **Status:** '+$o.status)
    $t=TechStr $o; if($t){$rows+='- **Tech:** '+$t}
    $ws=Clean $o.workflow_stage; if($ws){$rows+='- **Workflow stage:** '+$ws}
    $srv=ServerStr $o; if($srv){$rows+='- **Server:** `'+$srv+'`'}
    $sc=Clean $o.server.start_command; if($sc){$rows+='- **Start:** `'+$sc+'`'}
    $eff=Clean $o.efficiency_hint; if($eff){$rows+='- **Efficiency:** '+$eff}
    if($o.related_tools -and @($o.related_tools).Count){$rows+='- **Related:** '+((@($o.related_tools)) -join ', ')}
    if($o.confidential -eq $true){$rows+='- **[CONFIDENTIAL]** contains client/personal detail - keep internal, sanitize before publishing'}
    $rows+='- **Source:** `'+$o.source_path+'`'
    foreach($r in $rows){[void]$md.AppendLine($r)}
    [void]$md.AppendLine('')
  }
}
$md.ToString() | Set-Content "$reg\MASTER_TOOLS_REGISTRY.md" -Encoding utf8

$sl=New-Object System.Text.StringBuilder
[void]$sl.AppendLine('# ASURE - Server and Endpoint Locations')
[void]$sl.AppendLine('')
[void]$sl.AppendLine('> How to reach the running services. Ports/endpoints extracted from each tool''s config by a local model plus regex. Verify each before connecting. Known-good on this machine: Ollama `11434`, Headroom proxy `8787`, pyRevit Routes `48884/48885`.')
[void]$sl.AppendLine('')
[void]$sl.AppendLine('| Tool | Category | Endpoint / Port | Start command | Source |')
[void]$sl.AppendLine('|---|---|---|---|---|')
foreach($o in $tools){
  $srv=ServerStr $o; if(-not $srv){continue}
  $sc=Clean $o.server.start_command; if(-not $sc){$sc='-'}
  [void]$sl.AppendLine(('| '+$o.name+' | '+$o.category+' | `'+$srv+'` | `'+$sc+'` | `'+$o.source_path+'` |'))
}
$sl.ToString() | Set-Content "$reg\SERVER_LOCATIONS.md" -Encoding utf8

Write-Host ('ASSEMBLED: '+$tools.Count+' unique tools')
$tools | Group-Object category | Sort-Object Count -Descending | ForEach-Object { Write-Host ('  '+$_.Name+' = '+$_.Count) }
Write-Host ('servers indexed: '+(( $tools | Where-Object { ServerStr $_ } ).Count))