/* ============================================================================
   icons.js — inline UI icons + software-logo helper (shared by both pages)
   ============================================================================ */
const ICONS = {
  grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M8 3h8M9 14h.01M15 14h.01"/>',
  zap:'<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
  gauge:'<path d="M12 13a4 4 0 1 0-4-4"/><path d="M12 13l4-4"/><path d="M20 20a8 8 0 1 0-16 0"/>',
  plug:'<path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0zM12 16v6"/>',
  cube:'<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  building:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/>',
  flask:'<path d="M9 2h6M10 2v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V2"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  brain:'<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4a3 3 0 0 0-3-1zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  beaker:'<path d="M6 3h12M8 3v6l-4 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-4-8V3M6 14h12"/>',
  sparkle:'<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" stroke-width="1.2"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  play:'<path d="M6 4l14 8-14 8z"/>',
  film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18M3 16h18M8 4v16M16 4v16"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
  doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
  code:'<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  spark2:'<path d="M12 2l2.2 6.5L21 11l-6.8 2.5L12 20l-2.2-6.5L3 11l6.8-2.5z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers:'<path d="M12 2 2 7l10 5 10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>',
  route:'<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6a3 3 0 0 0 3-3V8"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
  down:'<path d="M12 3v14M6 11l6 6 6-6M5 21h14"/>',
};
function ICON(name, cls){
  const p = ICONS[name] || ICONS.spark2;
  return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

/* ---- Software logos ----------------------------------------------------
   Points at assets/logos/software/<file>. If the file is missing, the <img>
   onerror handler swaps in a monogram chip so nothing ever looks broken.
   OFFICIAL brand SVGs (Simple Icons / Devicon) are bundled where licensing
   allows; a few (Revit/Autodesk, Grasshopper, ComfyUI, MCP) are marked
   pending — drop the official SVG at the given path to light them up.
   ------------------------------------------------------------------------ */
const LOGOS = {
  revit:     { label:'Revit',      file:'revit.svg' },
  autocad:   { label:'AutoCAD',    file:'autocad.svg' },
  autodesk:  { label:'Autodesk',   file:'autodesk.svg' },
  rhino:     { label:'Rhino',      file:'rhino.svg' },
  grasshopper:{label:'Grasshopper',file:'grasshopper.svg' },
  python:    { label:'Python',     file:'python.svg' },
  csharp:    { label:'C#',         file:'dotnet.svg' },
  dotnet:    { label:'.NET',       file:'dotnet.svg' },
  pyrevit:   { label:'pyRevit',    file:'pyrevit.svg' },
  anthropic: { label:'Claude',     file:'anthropic.svg' },
  openai:    { label:'OpenAI',     file:'openai.svg' },
  supabase:  { label:'Supabase',   file:'supabase.svg' },
  react:     { label:'React',      file:'react.svg' },
  typescript:{ label:'TypeScript', file:'typescript.svg' },
  javascript:{ label:'JavaScript', file:'javascript.svg' },
  html:      { label:'HTML',       file:'html5.svg' },
  css:       { label:'CSS',        file:'css3.svg' },
  tailwind:  { label:'Tailwind',   file:'tailwind.svg' },
  node:      { label:'Node.js',    file:'nodedotjs.svg' },
  docker:    { label:'Docker',     file:'docker.svg' },
  github:    { label:'GitHub',     file:'github.svg' },
  postgres:  { label:'PostgreSQL', file:'postgresql.svg' },
  ollama:    { label:'Ollama',     file:'ollama.svg' },
  langchain: { label:'LangChain',  file:'langchain.svg' },
  comfyui:   { label:'ComfyUI',    file:'comfyui.svg' },
  mcp:       { label:'MCP',        file:'mcp.svg' },
  powerbi:   { label:'Power BI',   file:'powerbi.svg' },
  figma:     { label:'Figma',      file:'figma.svg' },
  vscode:    { label:'VS Code',    file:'vscode.svg' },
  azure:     { label:'Azure',      file:'azure.svg' },
  // brand-ish placeholders that render as monogram until real asset dropped
  chartbrand:{ label:'ADS',        file:'ads.png' },
  brain:     { label:'LLM',        file:'brain.svg' },
  asure:     { label:'Asure',      file:'../brand/asure_mark.png' },
};
/* Marks drawn in near-black. On the dark theme they are invisible, so CSS
   inverts anything carrying .logo-dark (see theme.css). */
const DARK_LOGOS = new Set(['ollama','anthropic','github','openai','comfyui','vscode']);

function logoImg(key, size){
  if(key==='asure'){ const s0=size||16; return `<img class="asure-mark" src="assets/logos/brand/asure_mark.png" alt="Asure" title="Asure" width="${s0}" height="${s0}" style="object-fit:contain">`; }
  const l = LOGOS[key];
  const label = l ? l.label : (key||'?');
  const mono = (label[0]||'?').toUpperCase();
  if(!l) return `<span style="font-size:9px;font-family:var(--f-mono);color:var(--text-3);font-weight:700">${mono}</span>`;
  const s = size||16;
  const dk = DARK_LOGOS.has(key) ? ' class="logo-dark"' : '';
  return `<img${dk} src="assets/logos/software/${l.file}" alt="${label}" title="${label}" width="${s}" height="${s}"
    onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${mono}',style:'font-size:9px;font-family:var(--f-mono);color:var(--text-3);font-weight:700'}))">`;
}
function logoLabel(key){ return (LOGOS[key]&&LOGOS[key].label) || key; }
window.ICON=ICON; window.LOGOS=LOGOS; window.logoImg=logoImg; window.logoLabel=logoLabel;
