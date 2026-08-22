"""Local admin for the showcase. Creates and edits projects, takes uploads.

    python _tools/admin.py
    -> http://127.0.0.1:8787

Binds to 127.0.0.1 only and has no login, because it writes straight into the
site tree and must never be reachable from anywhere else. Do not put it behind
a tunnel or bind it to 0.0.0.0.

What it does:
    GET  /                    the admin UI
    GET  /media/<id>/<slot>/<file>   read-only, for thumbnails
    GET  /api/projects        every record, plus what media each one has
    GET  /api/meta            allowed kinds, domains, statuses, logos
    POST /api/save            create or update one record
    POST /api/delete          remove a record (media folder is left alone)
    POST /api/upload          multipart file -> projects/<id>/<slot>/
    POST /api/delete-media    remove one uploaded file
    POST /api/publish         regenerate both manifests
    GET  /api/sources/suggest?id=   ranked folder matches for a project
    GET  /api/sources/scan?id=      what is inside the linked folder
    POST /api/sources/link          confirm which folder a project lives in
    POST /api/sources/import        copy one file from there into a slot

Every write goes through build_content.py's validator before it lands, so the
site cannot be left in a state that fails to generate.

Images are downscaled on upload (1600px, JPEG q86). Originals stay wherever you
copied them from - this never moves or deletes your source files.

Standard library only (no cgi - removed in 3.13), plus Pillow for resizing. Without Pillow
uploads still work, they just are not resized.
"""
import io, json, os, re, shutil, subprocess, sys

import sources
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'content')
PROJECTS = os.path.join(ROOT, 'projects')
TOOLS = os.path.join(ROOT, '_tools')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8787

KINDS = ['plugin', 'dashboard', 'pipeline', 'connector', 'platform', 'agent', 'study', 'deck']
DOMAINS = ['design', 'docs', 'qa', 'controls', 'knowledge', 'studio', 'ai']
STATUSES = ['production', 'in-progress', 'experimental', 'research']
SLOTS = {'screenshots': ('.jpg', '.jpeg', '.png', '.webp', '.gif'),
         'videos': ('.mp4', '.webm', '.mov'),
         'html': ('.html', '.htm'),
         'docs': ('.pdf', '.xlsx', '.xls', '.docx', '.doc', '.pptx', '.csv', '.md', '.zip')}

ID_RE = re.compile(r'^[a-z0-9][a-z0-9-]{1,48}$')
MAX_UPLOAD = 200 * 1024 * 1024

try:
    from PIL import Image
except ImportError:
    Image = None



# --------------------------------------------------------------- multipart
# Hand-rolled rather than cgi.FieldStorage: cgi is deprecated since 3.11 and
# removed in 3.13, and this only needs the one shape the admin UI sends --
# a few text fields plus a single file. Body size is bounded by MAX_UPLOAD.
CRLF = bytes((13, 10))


def parse_multipart(body, content_type):
    m = re.search(r'boundary=(?:"([^"]+)"|([^;]+))', content_type or '')
    if not m:
        raise ValueError('missing multipart boundary')
    boundary = (m.group(1) or m.group(2)).strip().encode()
    sep = CRLF + CRLF
    fields, files = {}, {}
    for chunk in body.split(bytes((45, 45)) + boundary):
        if sep not in chunk:
            continue
        head, data = chunk.split(sep, 1)
        if data.endswith(CRLF):
            data = data[:-2]
        head = head.decode('utf-8', 'replace')
        nm = re.search(r'name="([^"]*)"', head)
        if not nm:
            continue
        fn = re.search(r'filename="([^"]*)"', head)
        if fn:
            if fn.group(1):
                files[nm.group(1)] = (fn.group(1), data)
        else:
            fields[nm.group(1)] = data.decode('utf-8', 'replace').strip()
    return fields, files


# ----------------------------------------------------------------- helpers
def safe_id(pid):
    """Reject anything that is not a plain slug. This value becomes a path."""
    if not pid or not ID_RE.match(pid):
        raise ValueError('id must be lowercase letters, digits and hyphens: %r' % pid)
    return pid


def record_path(pid):
    return os.path.join(CONTENT, safe_id(pid) + '.json')


def load_all():
    out = []
    if not os.path.isdir(CONTENT):
        return out
    for fn in sorted(os.listdir(CONTENT)):
        if fn.endswith('.json') and not fn.startswith('.'):
            with io.open(os.path.join(CONTENT, fn), encoding='utf-8') as f:
                out.append(json.load(f))
    return out


def media_of(pid):
    """What is actually on disk for this project, per slot."""
    out = {}
    for slot in SLOTS:
        d = os.path.join(PROJECTS, pid, slot)
        out[slot] = sorted(f for f in os.listdir(d)
                           if not f.startswith('.')) if os.path.isdir(d) else []
    return out


def next_code():
    highest = 0
    for r in load_all():
        m = re.match(r'^P(\d+)$', str(r.get('code', '')))
        if m:
            highest = max(highest, int(m.group(1)))
    return 'P%02d' % (highest + 1)


def run(script):
    """Run a generator and hand back its output either way."""
    p = subprocess.run([sys.executable, os.path.join(TOOLS, script)],
                       capture_output=True, text=True, cwd=ROOT)
    return {'script': script, 'ok': p.returncode == 0,
            'out': (p.stdout or '') + (p.stderr or '')}


def regenerate():
    return [run('build_content.py'), run('build_media_manifest.py')]


def strip_empty(v):
    if isinstance(v, list):
        return v or None
    if isinstance(v, dict):
        o = {k: strip_empty(x) for k, x in v.items()}
        o = {k: x for k, x in o.items() if x is not None}
        return o or None
    if isinstance(v, str):
        return v.strip() or None
    return v


# ----------------------------------------------------------------- handler
class Admin(BaseHTTPRequestHandler):
    server_version = 'AsureAdmin'

    def _send(self, code, body, ctype='application/json'):
        if isinstance(body, (dict, list)):
            body = json.dumps(body)
        if isinstance(body, str):
            body = body.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', ctype + '; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def _json_body(self):
        n = int(self.headers.get('Content-Length', 0))
        return json.loads(self.rfile.read(n).decode('utf-8')) if n else {}

    # -------------------------------------------------------------- GET
    def do_GET(self):
        try:
            if self.path in ('/', '/index.html'):
                p = os.path.join(TOOLS, 'admin_ui.html')
                with io.open(p, encoding='utf-8') as f:
                    return self._send(200, f.read(), 'text/html')

            if self.path.startswith('/media/'):
                return self.serve_media()

            if self.path == '/api/meta':
                return self._send(200, {'kinds': KINDS, 'domains': DOMAINS,
                                        'statuses': STATUSES, 'slots': list(SLOTS),
                                        'nextCode': next_code(),
                                        'pillow': Image is not None})

            if self.path.startswith('/api/sources/suggest'):
                pid = self.path.split('id=')[-1]
                rec = next((r for r in load_all() if r['id'] == pid), None)
                if not rec:
                    return self._send(404, {'error': 'no such project'})
                return self._send(200, {'linked': sources.links().get(pid),
                                        'suggestions': sources.suggest(rec)})

            if self.path.startswith('/api/sources/scan'):
                pid = self.path.split('id=')[-1]
                return self._send(200, sources.scan(pid))

            if self.path == '/api/sources':
                return self._send(200, {'links': sources.links(), 'roots': sources.roots()})

            if self.path == '/api/projects':
                rows = []
                for r in load_all():
                    r = dict(r)
                    r['_media'] = media_of(r['id'])
                    rows.append(r)
                return self._send(200, rows)

            self._send(404, {'error': 'not found'})
        except Exception as e:
            self._send(500, {'error': str(e)})


    def serve_media(self):
        """Serve one file out of projects/ so the admin can show thumbnails.

        Read-only, and every request is confined to projects/ by resolving the
        path and checking it is still inside. The admin is localhost-only, but
        a traversal here would read anything on the drive, so it is checked
        rather than trusted."""
        from urllib.parse import unquote
        rel = unquote(self.path[len('/media/'):].split('?')[0])
        target = os.path.realpath(os.path.join(PROJECTS, *rel.split('/')))
        base = os.path.realpath(PROJECTS)
        if os.path.commonpath([target, base]) != base or not os.path.isfile(target):
            return self._send(404, {'error': 'not found'})
        ext = os.path.splitext(target)[1].lower()
        ctype = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
                 '.webp': 'image/webp', '.gif': 'image/gif'}.get(ext, 'application/octet-stream')
        with open(target, 'rb') as f:
            data = f.read()
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(data)

    # -------------------------------------------------------------- POST
    def do_POST(self):
        try:
            if self.path == '/api/save':
                return self.save()
            if self.path == '/api/delete':
                return self.delete()
            if self.path == '/api/upload':
                return self.upload()
            if self.path == '/api/delete-media':
                return self.delete_media()
            if self.path == '/api/sources/link':
                b = self._json_body()
                pid = safe_id(b.get('id', ''))
                return self._send(200, {'linked': sources.set_link(pid, b.get('path'))})
            if self.path == '/api/sources/import':
                return self.import_from_source()
            if self.path == '/api/publish':
                return self._send(200, {'steps': regenerate()})
            self._send(404, {'error': 'not found'})
        except ValueError as e:
            self._send(400, {'error': str(e)})
        except Exception as e:
            self._send(500, {'error': str(e)})

    # -------------------------------------------------------------- writes
    def save(self):
        rec = self._json_body()
        pid = safe_id(rec.get('id', ''))
        rec.pop('_media', None)
        rec.pop('media', None)          # folder-owned, never stored in a record
        rec = strip_empty(rec) or {}
        rec['id'] = pid

        for k in ('code', 'name', 'status', 'kind', 'domain', 'tagline'):
            if not rec.get(k):
                raise ValueError('missing required field: %s' % k)
        if rec['kind'] not in KINDS:
            raise ValueError('unknown kind: %s' % rec['kind'])
        if rec['domain'] not in DOMAINS:
            raise ValueError('unknown domain: %s' % rec['domain'])
        if rec['status'] not in STATUSES:
            raise ValueError('unknown status: %s' % rec['status'])

        path = record_path(pid)
        backup = None
        if os.path.isfile(path):
            with io.open(path, encoding='utf-8') as f:
                backup = f.read()

        os.makedirs(CONTENT, exist_ok=True)
        with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(json.dumps(rec, indent=2, ensure_ascii=False) + '\n')

        # The validator is the gate. If this record breaks the build, put the
        # old one back rather than leaving the site ungeneratable.
        steps = regenerate()
        if not steps[0]['ok']:
            if backup is None:
                os.remove(path)
            else:
                with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(backup)
            regenerate()
            raise ValueError('rejected, previous version restored:\n' + steps[0]['out'])

        for slot in SLOTS:
            os.makedirs(os.path.join(PROJECTS, pid, slot), exist_ok=True)
        return self._send(200, {'saved': pid, 'steps': steps})

    def delete(self):
        pid = safe_id(self._json_body().get('id', ''))
        path = record_path(pid)
        if os.path.isfile(path):
            os.remove(path)
        # The media folder is deliberately left in place: deleting a record is
        # reversible, deleting someone's uploads is not.
        return self._send(200, {'deleted': pid, 'mediaKept': True,
                                'steps': regenerate()})

    def upload(self):
        if int(self.headers.get('Content-Length', 0)) > MAX_UPLOAD:
            raise ValueError('upload exceeds %d MB' % (MAX_UPLOAD // 1048576))
        raw = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        fields, files = parse_multipart(raw, self.headers.get('Content-Type'))
        pid = safe_id(fields.get('id', ''))
        slot = fields.get('slot', '')
        if slot not in SLOTS:
            raise ValueError('unknown slot: %s' % slot)
        if 'file' not in files:
            raise ValueError('no file received')
        upload_name, payload = files['file']

        name = os.path.basename(upload_name.replace(chr(92), '/')).split('/')[-1]
        name = re.sub(r'[^A-Za-z0-9._-]', '_', name).lower()
        ext = os.path.splitext(name)[1]
        if ext not in SLOTS[slot]:
            raise ValueError('%s does not accept %s (allowed: %s)'
                             % (slot, ext or 'no extension', ' '.join(SLOTS[slot])))
        if fields.get('hero') == '1' and slot == 'screenshots':
            name = 'hero' + ext

        dest_dir = os.path.join(PROJECTS, pid, slot)
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, name)
        with open(dest, 'wb') as f:
            f.write(payload)

        resized = False
        if slot == 'screenshots' and Image is not None:
            try:
                im = Image.open(dest)
                if im.mode in ('RGBA', 'LA', 'P'):
                    bg = Image.new('RGB', im.size, (10, 13, 24))
                    im = im.convert('RGBA')
                    bg.paste(im, mask=im.split()[-1])
                    im = bg
                else:
                    im = im.convert('RGB')
                if im.width > 1600:
                    im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
                jpg = os.path.splitext(dest)[0] + '.jpg'
                im.save(jpg, 'JPEG', quality=86, optimize=True, progressive=True)
                if jpg != dest:
                    os.remove(dest)
                name = os.path.basename(jpg)
                resized = True
            except Exception as e:
                return self._send(200, {'uploaded': name, 'resized': False,
                                        'warning': 'saved but could not process: %s' % e,
                                        'steps': [run('build_media_manifest.py')]})

        return self._send(200, {'uploaded': name, 'slot': slot, 'resized': resized,
                                'steps': [run('build_media_manifest.py')]})


    def import_from_source(self):
        """Copy one file out of the linked source folder into a media slot.

        The source path has to be inside that project's linked folder. The
        admin sends paths it got from a scan, but this re-checks rather than
        trusting them -- otherwise the endpoint reads anything on the drive.
        """
        b = self._json_body()
        pid = safe_id(b.get('id', ''))
        slot = b.get('slot', '')
        src = b.get('path', '')
        as_hero = bool(b.get('hero'))
        if slot not in SLOTS:
            raise ValueError('unknown slot: %s' % slot)

        base = sources.links().get(pid)
        if not base:
            raise ValueError('no source folder linked for %s' % pid)
        real_src, real_base = os.path.realpath(src), os.path.realpath(base)
        if os.path.commonpath([real_src, real_base]) != real_base:
            raise ValueError('that file is outside the linked source folder')
        if not os.path.isfile(real_src):
            raise ValueError('file not found: %s' % src)

        name = re.sub(r'[^A-Za-z0-9._-]', '_', os.path.basename(real_src)).lower()
        ext = os.path.splitext(name)[1]
        if ext not in SLOTS[slot]:
            raise ValueError('%s does not accept %s' % (slot, ext or 'that file'))
        if as_hero and slot == 'screenshots':
            name = 'hero' + ext

        dest_dir = os.path.join(PROJECTS, pid, slot)
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, name)

        resized = False
        if slot == 'screenshots' and Image is not None:
            try:
                im = Image.open(real_src)
                if im.mode in ('RGBA', 'LA', 'P'):
                    bg = Image.new('RGB', im.size, (10, 13, 24))
                    im = im.convert('RGBA')
                    bg.paste(im, mask=im.split()[-1])
                    im = bg
                else:
                    im = im.convert('RGB')
                if im.width > 1600:
                    im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
                dest = os.path.splitext(dest)[0] + '.jpg'
                im.save(dest, 'JPEG', quality=86, optimize=True, progressive=True)
                name = os.path.basename(dest)
                resized = True
            except Exception:
                shutil.copyfile(real_src, dest)
        else:
            shutil.copyfile(real_src, dest)

        return self._send(200, {'imported': name, 'slot': slot, 'resized': resized,
                                'steps': [run('build_media_manifest.py')]})

    def delete_media(self):
        b = self._json_body()
        pid, slot = safe_id(b.get('id', '')), b.get('slot', '')
        name = os.path.basename(b.get('name', ''))
        if slot not in SLOTS or not name:
            raise ValueError('need a valid slot and filename')
        path = os.path.join(PROJECTS, pid, slot, name)
        # Confirm the resolved path really sits inside this project's slot.
        if os.path.commonpath([os.path.realpath(path),
                               os.path.realpath(os.path.join(PROJECTS, pid, slot))]) \
                != os.path.realpath(os.path.join(PROJECTS, pid, slot)):
            raise ValueError('refusing to touch a path outside the project folder')
        if os.path.isfile(path):
            os.remove(path)
        return self._send(200, {'removed': name, 'steps': [run('build_media_manifest.py')]})

    def log_message(self, fmt, *a):
        if '/api/' in (a[0] if a else ''):
            sys.stderr.write('  %s\n' % (a[0]))


if __name__ == '__main__':
    if not os.path.isdir(CONTENT):
        sys.exit('no content/ directory - run the migration first')
    print('Asure showcase admin')
    print('  site  : %s' % ROOT)
    print('  records: %d' % len(load_all()))
    print('  images : %s' % ('Pillow found, uploads resized to 1600px'
                             if Image else 'no Pillow, uploads stored as-is'))
    print('  http://127.0.0.1:%d   (localhost only, no login - keep it that way)' % PORT)
    # Windows lets a second process bind a port that is already listening
    # (Python sets SO_REUSEADDR by default), so a stale server keeps answering
    # while the new one looks like it started fine. Refuse instead.
    class Server(ThreadingHTTPServer):
        allow_reuse_address = False

    try:
        srv = Server(('127.0.0.1', PORT), Admin)
    except OSError as e:
        sys.exit('port %d is already in use - another admin is running (%s)' % (PORT, e))
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print(chr(10) + 'stopped')
