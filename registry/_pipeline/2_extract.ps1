$ErrorActionPreference = 'Continue'
$reg   = 'Y:\CLAUDE DIRECT ACCESS FOLDER\AI_Research_Showcase\registry\units'
$man   = Join-Path $reg 'manifest.tsv'
$model = 'qwen2.5vl:7b'
$api   = 'http://127.0.0.1:11434/api/generate'
$done  = Join-Path $reg 'done.log'
if (-not (Test-Path $done)) { New-Item -ItemType File $done | Out-Null }

function ToWin($p){ if($p -match '^/([a-zA-Z])/(.*)$'){ return ($matches[1].ToUpper()+':\'+($matches[2] -replace '/','\')) } return $p }
function JEsc($s){
  $sb=New-Object System.Text.StringBuilder
  foreach($ch in $s.ToCharArray()){
    $code=[int][char]$ch
    if($ch -eq '"'){[void]$sb.Append('\"')}
    elseif($ch -eq '\'){[void]$sb.Append('\\')}
    elseif($code -eq 10){[void]$sb.Append('\n')}
    elseif($code -eq 13){[void]$sb.Append('\r')}
    elseif($code -eq 9){[void]$sb.Append('\t')}
    elseif($code -lt 32 -or $code -gt 126){[void]$sb.Append(('\u{0:x4}' -f $code))}
    else{[void]$sb.Append($ch)}
  }
  $sb.ToString()
}

$preamble = 'You are cataloguing ONE software tool/project for an internal registry. Read its FILES below, then fill the JSON template using ONLY facts stated in the files. Extract real values; do not leave a field empty if the files state it.'
$tmpl = '{"name":"short tool name","one_liner":"one sentence: what it does","description":"2-3 factual sentences","category":"one of: plugin|mcp-server|dashboard|automation|ai-agent|research|knowledge|library|tool","status":"one of: production|in-progress|experimental|research|archived|unknown","tech":["technologies actually used"],"workflow_stage":"where it sits in the studio workflow","server":{"runs_as_server":false,"endpoint":"host:port or url, else null","start_command":"command to start, else null"},"key_files":["notable files"],"related_tools":["related tool names if mentioned"],"efficiency_hint":"any hours/time-saved/speed claim verbatim, else null","confidential":false}'

$lines = Get-Content -LiteralPath $man
$total = $lines.Count; $n = 0
foreach ($line in $lines) {
  $n++
  $parts = $line -split "`t"
  if ($parts.Count -lt 4) { continue }
  $id=$parts[0]; $name=$parts[1]; $root=$parts[2]; $sigs=$parts[3]
  $outfile = Join-Path $reg "$id.json"
  if (Select-String -Path $done -SimpleMatch $id -Quiet) { continue }

  $sb = New-Object System.Text.StringBuilder
  foreach ($f0 in ($sigs -split '\|')) {
    $f = ToWin $f0
    if (-not (Test-Path -LiteralPath $f)) { continue }
    [void]$sb.AppendLine("===== FILE: " + (Split-Path $f -Leaf) + " =====")
    try { $c = Get-Content -LiteralPath $f -Raw -ErrorAction Stop } catch { $c = '' }
    if ($null -eq $c) { $c = '' }
    if ($c.Length -gt 4500) { $c = $c.Substring(0,4500) }
    [void]$sb.AppendLine($c)
    if ($sb.Length -gt 11000) { break }
  }
  $files = $sb.ToString() -replace '[\x00-\x08\x0B\x0C\x0E-\x1F]',''
  if ($files.Trim().Length -lt 20) { Write-Host "[$n/$total] $id $name  (no content, skip)"; Add-Content $done $id; continue }

  $ports = [regex]::Matches($files,'(?i)(?:localhost|127\.0\.0\.1)[:\s]*([0-9]{2,5})|port\s*[=:]\s*([0-9]{2,5})') |
           ForEach-Object { if($_.Groups[1].Value){$_.Groups[1].Value}else{$_.Groups[2].Value} } | Where-Object { $_ } | Select-Object -Unique

  $prompt = $preamble + "`n`nFILES (folder: " + $name + "):`n" + $files + "`n`nNow output ONLY this JSON object, every field filled from the FILES above (use null, [] or unknown ONLY when the files truly do not say):`n" + $tmpl
  $body = '{"model":"' + $model + '","prompt":"' + (JEsc $prompt) + '","stream":false,"format":"json","keep_alive":"12m","options":{"num_ctx":8192,"temperature":0}}'
  Write-Host "[$n/$total] $id  $name"
  try {
    $resp = Invoke-RestMethod -Uri $api -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 180
    $obj  = $resp.response | ConvertFrom-Json -ErrorAction Stop
  } catch {
    Write-Host "   ! failed: $($_.Exception.Message)"; continue
  }
  $obj | Add-Member id $id -Force
  $obj | Add-Member source_name $name -Force
  $obj | Add-Member source_path $root -Force
  $obj | Add-Member detected_ports ($ports -join ',') -Force
  $obj | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $outfile -Encoding utf8
  Add-Content -Path $done -Value $id
}
Write-Host ("DONE. extracted files: " + (Get-ChildItem $reg -Filter 'u*.json').Count + " / " + $total)