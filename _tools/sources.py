"""Connect catalogue records to the real project folders on this machine.

The catalogue describes work that actually exists somewhere on disk. This
module finds those folders, and once one is linked, reports what is inside it
so the admin can pull media and facts across without re-typing anything.

Two things it deliberately does NOT do:

  * It does not write links by itself. Matching folder names is guesswork -
    'cadbridge' and 'navisbridge' both look like a folder called 'bridge' -
    and a wrong link silently attaches the wrong screenshots to a project.
    It proposes, ranked; a person confirms once.

  * It does not write prose. A README can seed the objective/problem/solution
    fields, but summarising one into marketing copy is where invented facts
    come from. Scan hands back the actual text to write from.

Links live in _local/sources.json, which is machine-specific (C:\\Users\\...)
and stays out of git and out of the published site.
"""
import io, json, os, re, subprocess, time
from difflib import SequenceMatcher

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL = os.path.join(ROOT, '_local')
LINKS = os.path.join(LOCAL, 'sources.json')
CONFIG = os.path.join(LOCAL, 'roots.json')

DEFAULT_ROOTS = [
    r'C:\Users\surya ASURE\Downloads\Claude',
    r'C:\Users\surya ASURE\Downloads',
    r'Y:\CLAUDE DIRECT ACCESS FOLDER',
]

SKIP = {'node_modules', '.git', 'venv', '.venv', '__pycache__', 'site-packages',
        'dist', 'build', '.next', 'env', 'Lib', 'lib', 'cache', '.cache',
        'AI_Research_Showcase', 'plane', 'pgsql', 'DynamoCoreRuntime4.1.1',
        'bin', 'obj', 'temp', 'tmp'}
MIN_NAME = 4
MAX_DEPTH = 3
STOP = {'the', 'a', 'an', 'and', 'for', 'of', 'ai', 'asure', 'ads', 'tool',
        'deck', 'dashboard', 'local', 'test', 'v2', 'new'}

IMG = ('.png', '.jpg', '.jpeg', '.webp', '.gif')
VID = ('.mp4', '.webm', '.mov')
DOC = ('.pdf', '.xlsx', '.xls', '.docx', '.doc', '.pptx', '.csv', '.zip')
WEB = ('.html', '.htm')
TEXT = ('.md', '.txt')
NOISE = re.compile(r'(node_modules|__pycache__|\.git|site-packages|venv)', re.I)

_cache = {'at': 0, 'dirs': []}


# ------------------------------------------------------------------ storage
def _read(path, default):
    try:
        with io.open(path, encoding='utf-8') as f:
            return json.load(f)
    except (IOError, ValueError):
        return default


def roots():
    return _read(CONFIG, None) or DEFAULT_ROOTS


def links():
    return _read(LINKS, {})


def set_link(pid, path):
    """Point a project at a folder, or clear it by passing a falsy path."""
    data = links()
    if path:
        if not os.path.isdir(path):
            raise ValueError('not a folder: %s' % path)
        data[pid] = os.path.abspath(path)
    else:
        data.pop(pid, None)
    os.makedirs(LOCAL, exist_ok=True)
    with io.open(LINKS, 'w', encoding='utf-8', newline='\n') as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    return data.get(pid)


# ------------------------------------------------------------------ matching
def _words(s):
    return {w for w in re.split(r'[^a-z0-9]+', s.lower()) if len(w) > 2 and w not in STOP}


def candidates(force=False):
    """Directories within MAX_DEPTH of a root. Cached for a minute."""
    if not force and _cache['dirs'] and time.time() - _cache['at'] < 60:
        return _cache['dirs']
    seen, out = set(), []
    for root in roots():
        if not os.path.isdir(root):
            continue
        base = root.rstrip('\\').count(os.sep)
        for dp, dns, _ in os.walk(root):
            if dp.count(os.sep) - base >= MAX_DEPTH:
                dns[:] = []
                continue
            dns[:] = [d for d in dns if d not in SKIP and not d.startswith('.')]
            for d in dns:
                p = os.path.join(dp, d)
                if p.lower() not in seen:
                    seen.add(p.lower())
                    out.append(p)
    _cache.update(at=time.time(), dirs=out)
    return out


def score(record, path):
    """How much a folder looks like a project. Strict on purpose - see module doc."""
    folder = os.path.basename(path)
    if len(folder) < MIN_NAME:
        return 0.0
    fw = _words(folder)
    pw = _words(record.get('id', '')) | _words(record.get('name', ''))
    overlap = fw & pw

    flat_f = re.sub(r'[^a-z0-9]', '', folder.lower())
    flat_i = re.sub(r'[^a-z0-9]', '', record.get('id', '').lower())
    exact = flat_f == flat_i
    contains = len(flat_i) >= 6 and (flat_i in flat_f or flat_f in flat_i)
    if not (overlap or exact or contains):
        return 0.0

    s = 100.0 if exact else (55.0 if contains else 0.0)
    s += 20 * len(overlap)
    ratio = SequenceMatcher(None, flat_i, flat_f).ratio()
    if ratio > 0.6:
        s += 20 * ratio
    s -= max(0, path.count(os.sep) - 6) * 4
    return s


def suggest(record, limit=6):
    ranked = sorted(((score(record, p), p) for p in candidates()), reverse=True)
    return [{'path': p, 'score': round(sc),
             'confidence': 'high' if sc >= 90 else ('medium' if sc >= 55 else 'low')}
            for sc, p in ranked[:limit] if sc > 0]


# ------------------------------------------------------------------ scanning
def _walk(base, cap=4000):
    n = 0
    for dp, dns, fns in os.walk(base):
        if NOISE.search(dp):
            dns[:] = []
            continue
        dns[:] = [d for d in dns if d not in SKIP and not d.startswith('.')]
        for f in fns:
            if f.startswith('.'):
                continue
            n += 1
            if n > cap:
                return
            yield os.path.join(dp, f)


def _git(base):
    """Commit dates and subjects, if this is a repo. Seeds the timeline."""
    if not os.path.isdir(os.path.join(base, '.git')):
        return None
    try:
        p = subprocess.run(['git', 'log', '--date=format:%b %Y', '--pretty=%ad|%s', '-40'],
                           cwd=base, capture_output=True, text=True, timeout=12)
        if p.returncode:
            return None
        rows = [l.split('|', 1) for l in p.stdout.strip().split('\n') if '|' in l]
        first = rows[-1][0] if rows else None
        last = rows[0][0] if rows else None
        return {'commits': len(rows), 'first': first, 'last': last,
                'recent': [{'date': d, 'subject': s} for d, s in rows[:12]]}
    except (OSError, subprocess.SubprocessError):
        return None


def scan(pid, base=None):
    """Everything in a linked folder that the catalogue could use."""
    base = base or links().get(pid)
    if not base:
        return {'linked': False}
    if not os.path.isdir(base):
        return {'linked': True, 'path': base, 'missing': True}

    buckets = {'images': [], 'videos': [], 'docs': [], 'web': [], 'text': []}
    newest, total, count = 0, 0, 0
    for path in _walk(base):
        ext = os.path.splitext(path)[1].lower()
        try:
            st = os.stat(path)
        except OSError:
            continue
        count += 1
        total += st.st_size
        newest = max(newest, st.st_mtime)
        bucket = ('images' if ext in IMG else 'videos' if ext in VID
                  else 'docs' if ext in DOC else 'web' if ext in WEB
                  else 'text' if ext in TEXT else None)
        if not bucket:
            continue
        if bucket == 'images' and st.st_size < 20000:
            continue          # icons and spacers, not screenshots
        buckets[bucket].append({'path': path, 'rel': os.path.relpath(path, base),
                                'size': st.st_size, 'mtime': st.st_mtime})

    for k in buckets:
        buckets[k].sort(key=lambda x: -x['size'])
        buckets[k] = buckets[k][:60]

    # readme-ish text, handed over verbatim to write from
    readme = None
    for cand in ('README.md', 'readme.md', 'README.txt', 'HANDOFF.md', 'NOTES.md'):
        p = os.path.join(base, cand)
        if os.path.isfile(p):
            try:
                with io.open(p, encoding='utf-8', errors='replace') as f:
                    readme = {'name': cand, 'text': f.read(6000)}
                break
            except IOError:
                pass

    return {'linked': True, 'path': base, 'missing': False,
            'files': count, 'bytes': total,
            'lastModified': time.strftime('%Y-%m-%d', time.localtime(newest)) if newest else None,
            'buckets': buckets, 'readme': readme, 'git': _git(base)}
