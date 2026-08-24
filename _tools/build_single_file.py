"""Build the whole site into ONE self-contained HTML file, in dist/.

The live site is many files (two pages, seven scripts, a stylesheet, 34 logos).
An Artifact must be a single document with no external hosts, so this:

  * inlines the stylesheet and every script,
  * turns each logo into a data: URI,
  * folds index.html and tool.html into one document with a hash router,
  * drops the Supabase auth gate and its CDN script (blocked by CSP anyway),
  * rewrites tool.html?id=X links to #/tool/X.

Nothing in the source tree is modified. Run BUILD.bat, or:

    python _tools/build_single_file.py
"""
import io, os, re, base64

SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(SRC, 'dist')
OUT = os.path.join(DIST, 'asure-showcase.html')


def read(rel, enc='utf-8'):
    with io.open(os.path.join(SRC, rel), encoding=enc) as f:
        return f.read()


# ---------------------------------------------------------------- assets
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp'}
assets = {}
for sub in ('assets/logos/software', 'assets/logos/brand', 'assets/loader'):
    d = os.path.join(SRC, *sub.split('/'))
    for fn in os.listdir(d):
        ext = os.path.splitext(fn)[1].lower()
        if ext not in MIME:
            continue   # the loader mp4 is not inlined; nothing references it
        with open(os.path.join(d, fn), 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('ascii')
        assets[sub + '/' + fn] = 'data:%s;base64,%s' % (MIME[ext], b64)

asset_js = '{\n' + ',\n'.join('  %r: %r' % (k, v) for k, v in sorted(assets.items())) + '\n}'


# ---------------------------------------------------------------- page markup
def body_class(html):
    m = re.search(r'<body[^>]*class="([^"]*)"', html)
    return m.group(1) if m else ''


def body_of(html):
    # Each page carries its own body classes — the landing is
    # <body class="a-app deck uikit">, the tool page is bare. The artifact host
    # supplies the <body>, so the router re-applies the right set per route.
    m = re.search(r'<body[^>]*>', html)
    b = html[m.end(): html.rindex('</body>')]
    b = re.sub(r'<script\b[^>]*>.*?</script>', '', b, flags=re.S)   # scripts are inlined once, globally
    # The loader belongs to the initial boot. Left in each routed page it would
    # re-insert an overlay on every hash change that nothing ever removes,
    # because loader.js finishes once. One instance lives outside #root.
    b = re.sub(r'<div class="evo-loader".*?<!-- /evo -->', '', b, flags=re.S)
    return b.strip()


def inline_img_paths(txt):
    def sub(m):
        p = m.group(1)
        return 'src="%s"' % assets.get(p, p)
    return re.sub(r'src="(assets/(?:logos|loader)/[^"]+)"', sub, txt)


INDEX_HTML = read('index.html')
TOOL_HTML = read('tool.html')
CMS_HTML = read('cms.html')
# cms.html keeps its page-local rules in a <style> in the head; the bundle
# has one stylesheet, so lift them out rather than lose them.
CMS_STYLE = re.search(r'<style>(.*?)</style>', CMS_HTML, re.S).group(1)
page_index = inline_img_paths(body_of(INDEX_HTML))
page_tool = inline_img_paths(body_of(TOOL_HTML))
page_cms = inline_img_paths(body_of(CMS_HTML))

css = (read('assets/vendor/asure-ui-kit/asure-ui.css') + chr(10) +
       read('assets/css/theme.css') + chr(10) +
       read('assets/css/deck.css') + chr(10) +
       read('assets/css/uikit-bridge.css') + chr(10) +
       read('assets/css/loader.css') + chr(10) +
       read('assets/css/visuals-scroll.css') + chr(10) +
       # light.css only @imports a webfont, which is legal to drop here since
       # the bundle already loads Inter; the tokens are declared inline.
       read('assets/css/light.css') + chr(10) + CMS_STYLE)



# The loader masks its wordmark with a PNG referenced from CSS, which no
# amount of markup rewriting would catch - do it on the stylesheet text.
with open(os.path.join(SRC, 'assets', 'loader', 'evolve.png'), 'rb') as _f:
    _evolve = 'data:image/png;base64,' + base64.b64encode(_f.read()).decode('ascii')
css = css.replace("url('../loader/evolve.png')", "url('%s')" % _evolve)

# ---------------------------------------------------------------- scripts
def unwrap(js, name, head_marker=None):
    """Turn a top-level IIFE into a named window function we can re-run per route.

    Matched by pattern rather than by an exact string: this used to hold the
    literal '(function(){' and a source file reformatted to '(function () {'
    broke the build with nothing but "substring not found".
    """
    m = re.search(r'\(\s*(?:function\s*\([^)]*\)|\([^)]*\)\s*=>)\s*\{', js)
    if not m:
        raise SystemExit('no top-level IIFE found while unwrapping %s' % name)
    js = js[:m.start()] + ('window.%s=function(){' % name) + js[m.end():]
    tail = '})();'
    j = js.rindex(tail)
    return js[:j] + '};' + js[j + len(tail):]


loader = read('assets/js/loader.js')
icons = read('assets/js/icons.js')
icons = icons.replace(
    '`<img class="asure-mark" src="assets/logos/brand/asure_mark.png"',
    '`<img class="asure-mark" src="${__ASSET(\'assets/logos/brand/asure_mark.png\')}"')
icons = icons.replace(
    'src="assets/logos/software/${l.file}"',
    'src="${__ASSET(\'assets/logos/software/\'+l.file)}"')

placeholder = read('assets/js/placeholder.js')
diagrams = read('assets/js/diagrams.js')
illus = read('assets/vendor/asure-ui-kit/asure-illustrations.js')
kitjs = read('assets/vendor/asure-ui-kit/asure-ui.js')
manifest = read('assets/js/media_manifest.js')
# the catalogue now comes from content/<id>.json via build_content.py
projects_data = read('assets/js/projects_data.js')
projects = read('assets/js/projects.js')
capability = read('data/ai_capability_map.js')

# ---------------------------------------------------------------- project media
# The site serves 1600px JPEGs. Inlining those as base64 would push the single
# file past 10 MB, so the bundle gets its own 1100px re-encode. The source tree
# keeps the full-quality copies.
import re as _re
from PIL import Image as _Image
_PREVIEW_W, _PREVIEW_Q = 1100, 78

def _shrink(rel):
    src = os.path.join(SRC, *rel.split('/'))
    im = _Image.open(src).convert('RGB')
    if im.width > _PREVIEW_W:
        im = im.resize((_PREVIEW_W, round(im.height * _PREVIEW_W / im.width)), _Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=_PREVIEW_Q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode('ascii')

_media_paths = sorted(set(_re.findall(r'"(projects/[^"]+\.(?:jpg|jpeg|png|webp))"', manifest)))
_media_bytes = 0
for _rel in _media_paths:
    _uri = _shrink(_rel)
    _media_bytes += len(_uri)
    manifest = manifest.replace('"%s"' % _rel, '"%s"' % _uri)
print('inlined %d project images (%.1f KB base64)' % (len(_media_paths), _media_bytes / 1024.0))

app = unwrap(read('assets/js/home.js'), 'initIndex', '(function () {')
tool = unwrap(read('assets/js/tool.js'), 'initTool', '(function(){')
cms = unwrap(read('assets/js/cms.js'), 'initCms', '(function () {')
hero = unwrap(read('assets/js/hero.js'), 'initHero', '(() => {')

# route links
for name in ('app', 'tool'):
    pass
app = app.replace('tool.html?id=${', '#/tool/${').replace('href="index.html"', 'href="#/"')
tool = tool.replace('tool.html?id=${', '#/tool/${').replace('href="index.html"', 'href="#/"')
cms = cms.replace("tool.html?id=' + encodeURIComponent(p.id) + '", "#/tool/' + encodeURIComponent(p.id) + '")

# The tool page reads its id from the router, not the query string. Matched by
# pattern: the previous literal match silently stopped applying when the
# declaration changed from const to var, and the route rendered "Not found"
# with no error anywhere.
_id_re = re.compile(r"(?:const|let|var)\s+id\s*=\s*new URLSearchParams\(location\.search\)\.get\('id'\);")
if not _id_re.search(tool):
    raise SystemExit('tool.js: could not find the id lookup to rewrite for the router')
tool = _id_re.sub("var id = window.__toolId;", tool)

# embedded local demos cannot travel with a single file — say so rather than 404
tool = tool.replace(
    '<a class="open-preview" href="${src}">Open live preview ${ICON(\'arrow\')}</a>',
    '<a class="open-preview" href="#/" onclick="return __demoNotice(this)">Open live preview ${ICON(\'arrow\')}</a>')
tool = tool.replace(
    '<div><b>Live interactive preview</b><p class="small">Opens in this tab — use Back to return.</p></div>',
    '<div><b>Live interactive preview</b><p class="small">Runs in the full site; not bundled into this single-file preview.</p></div>')

BUNDLE = u'''<meta charset="utf-8">
<title>Asure AI Research Showcase</title>
<style>
%(css)s
/* The artifact host paints its own ground behind the page. */
html,body{background:var(--bg)}
/* The router mounts pages into #root, which would otherwise sit between
   body.a-app and its flex children and break the frame lock. */
#root{display:contents}
</style>

<div class="evo-loader" id="evoLoader" role="status" aria-live="polite" aria-label="Loading">
  <div class="evo-inner">
    <div class="evo-stage">
      <img class="evo-wm evo-asure" src="__ASURE__" alt="" aria-hidden="true">
      <span class="evo-flare" aria-hidden="true"></span>
      <img class="evo-wm evo-evolve" src="__EVOLVE__" alt="Evolve">
      <span class="evo-colour" aria-hidden="true"></span>
      <span class="evo-shine" aria-hidden="true"></span>
    </div>
    <div class="evo-status">
      <div class="evo-copy"><span>Loading</span>
        <span class="evo-dots"><i></i><i></i><i></i></span></div>
      <div class="evo-track"></div>
    </div>
  </div>
</div>
<!-- /evo -->

<div id="root"></div>

<script>
/* ---- inlined assets: every logo as a data: URI ---- */
var __ASSETS = %(assets)s;
function __ASSET(p){
  p = p.replace(/[^/]+\\/\\.\\.\\//g, '');   /* normalise the ../brand/ hop */
  return __ASSETS[p] || '';
}
function __demoNotice(el){
  var n = el.parentElement.querySelector('.demo-note');
  if(!n){ n = document.createElement('span'); n.className='demo-note';
    n.style.cssText='margin-left:12px;font-size:12px;color:var(--text-3)';
    n.textContent='Local site only.'; el.parentElement.appendChild(n); }
  return false;
}
</script>

<script>%(loader)s</script>
<script>%(icons)s</script>
<script>%(placeholder)s</script>
<script>%(diagrams)s</script>
<script>%(illus)s</script>
<script>%(kitjs)s</script>
<script>%(manifest)s</script>
<script>%(projects_data)s</script>
<script>%(projects)s</script>
<script>%(capability)s</script>
<script>%(app)s</script>
<script>%(tool)s</script>
<script>%(cms)s</script>
<script>%(hero)s</script>

<script>
/* ---- pages, as markup strings ---- */
var PAGE_INDEX = %(page_index)s;
var PAGE_TOOL  = %(page_tool)s;
var PAGE_CMS   = %(page_cms)s;

/* ---- hash router: one document standing in for two pages ---- */
var BODY_INDEX = %(body_index)s;
var BODY_TOOL  = %(body_tool)s;
var BODY_CMS   = %(body_cms)s;
function route(){
  var h = location.hash || '#/';
  var m = h.match(/^#\\/tool\\/(.+)$/);
  var root = document.getElementById('root');
  /* Each route re-inserts its page markup, loader included, so the overlay
     has to be re-armed rather than left as a one-shot. */
  if(h.indexOf('#/cms') === 0){
    document.body.className = BODY_CMS;
    root.innerHTML = PAGE_CMS;
    window.initCms();
  }else if(m){
    document.body.className = BODY_TOOL;
    window.__toolId = decodeURIComponent(m[1]);
    root.innerHTML = PAGE_TOOL;
    window.initTool();
  }else{
    document.body.className = BODY_INDEX;
    root.innerHTML = PAGE_INDEX;
    window.initIndex();
    window.initHero();
  }
  /* The kit mounts illustrations on DOMContentLoaded. Here the markup arrives
     afterwards, from the router, so re-init on every route. */
  if (window.AsureIllus) window.AsureIllus.init(root);
  if (window.AsureUI && window.AsureUI.init) window.AsureUI.init(root);
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);
route();
</script>
'''


def jsstr(s):
    s = (s.replace('\\', '\\\\').replace('"', '\\"')
          .replace('\n', '\\n').replace('\r', '')
          .replace('</script', '<\\/script'))
    # Keep the payload pure ASCII so no charset guess can mangle an em dash.
    return '"' + ''.join(c if ord(c) < 128 else '\\u%04x' % ord(c) for c in s) + '"'


def js_ascii(src):
    """Escape every non-ASCII character to \\uXXXX.

    Safe wherever these characters actually occur in our scripts: inside string
    and template literals it is the standard escape, and inside comments it is
    merely cosmetic. Nothing here uses non-ASCII identifiers.

    Also neutralises '</script'. The HTML parser ends an inline block at that
    sequence wherever it appears — including inside a comment, which is exactly
    where the kit puts its usage example, silently truncating the module.
    """
    src = src.replace('</script', '<\\/script')
    return ''.join(c if ord(c) < 128 else '\\u%04x' % ord(c) for c in src)


CSS_ASCII = {u'—': '-', u'–': '-', u'’': "'", u'‘': "'",
             u'“': '"', u'”': '"', u'→': '->', u' ': ' '}


def css_ascii(src):
    """The stylesheet's only non-ASCII is typography inside comments."""
    for k, v in CSS_ASCII.items():
        src = src.replace(k, v)
    return ''.join(c if ord(c) < 128 else '?' for c in src)


BUNDLE = (BUNDLE.replace('__ASURE__', assets['assets/loader/asure.png'])
                .replace('__EVOLVE__', assets['assets/loader/evolve.png']))

out = BUNDLE % {
    'css': css_ascii(css),
    'assets': asset_js,
    'loader': js_ascii(loader),
    'icons': js_ascii(icons),
    'placeholder': js_ascii(placeholder),
    'diagrams': js_ascii(diagrams),
    'illus': js_ascii(illus),
    'kitjs': js_ascii(kitjs),
    'manifest': js_ascii(manifest),
    'projects_data': js_ascii(projects_data),
    'projects': js_ascii(projects),
    'capability': js_ascii(capability),
    'app': js_ascii(app),
    'tool': js_ascii(tool),
    'hero': js_ascii(hero),
    'body_index': jsstr(body_class(INDEX_HTML)),
    'body_tool': jsstr(body_class(TOOL_HTML)),
    'page_index': jsstr(page_index),
    'page_tool': jsstr(page_tool),
    'page_cms': jsstr(page_cms),
    'body_cms': jsstr(body_class(CMS_HTML)),
    'cms': js_ascii(cms),
}
assert all(ord(c) < 128 for c in out), 'bundle is not pure ASCII'

os.makedirs(DIST, exist_ok=True)
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(out)
print('bundled %d assets -> %s' % (len(assets), OUT))
print('size: %.1f KB' % (len(out.encode('utf-8')) / 1024.0))
