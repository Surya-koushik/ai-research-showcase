"""Serve the site locally, with caching turned off.

    python _tools/serve.py [port]

The site needs a server rather than file:// because the browser refuses to
apply a CSS mask loaded from a file: URL, and the loader's colour layer is one.

Caching is disabled deliberately. Python's stock handler sends Last-Modified
and answers conditional requests, and on a network drive whose clock differs
from this machine's, Chrome kept serving a stale projects.js for an entire
debugging session -- 17,843 bytes in the browser against 22,853 on disk, with
every edit silently invisible. Nothing here is worth caching locally.
"""
import os, re, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8099

RANGE = re.compile(r'bytes=(\d*)-(\d*)')


class NoCache(SimpleHTTPRequestHandler):
    def do_GET(self):
        # The stock handler ignores Range and answers 200 with the whole file.
        # Chrome asks for a range on every <video>, and when it never gets a 206
        # back it stalls the element rather than falling back -- the brand film
        # sits on its poster forever and seeking does nothing.
        header = self.headers.get('Range')
        path = self.translate_path(self.path)
        m = RANGE.match(header.strip()) if header else None
        if not m or not os.path.isfile(path):
            return SimpleHTTPRequestHandler.do_GET(self)

        size = os.path.getsize(path)
        first, last = m.group(1), m.group(2)
        if first == '':
            # bytes=-N means the final N bytes, not "from 0 to N".
            start, end = max(0, size - int(last or 0)), size - 1
        else:
            start = int(first)
            end = int(last) if last else size - 1

        if start >= size:
            self.send_response(416)
            self.send_header('Content-Range', 'bytes */%d' % size)
            self.end_headers()
            return

        end = min(end, size - 1)
        length = end - start + 1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', 'bytes %d-%d/%d' % (start, end, size))
        self.send_header('Content-Length', str(length))
        self.end_headers()

        with open(path, 'rb') as f:
            f.seek(start)
            while length > 0:
                chunk = f.read(min(64 * 1024, length))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except ConnectionError:
                    # Chrome opens a range request, buffers what it wants and aborts the
                    # rest. On Windows that surfaces as ConnectionAbortedError (WinError
                    # 10053), not BrokenPipeError -- catching only the POSIX two let the
                    # handler raise, and Chrome scored the whole video request as failed.
                    # ConnectionError is the shared base of all three.
                    return
                length -= len(chunk)

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        SimpleHTTPRequestHandler.end_headers(self)

    def send_header(self, key, value):
        # strip the validators that let a conditional request win
        if key.lower() in ('last-modified', 'etag'):
            return
        SimpleHTTPRequestHandler.send_header(self, key, value)

    def log_message(self, fmt, *a):
        code = a[1] if len(a) > 1 else ''
        if code and code[0] in '45':
            sys.stderr.write('  %s %s\n' % (code, a[0]))


class Server(ThreadingHTTPServer):
    # Windows lets a second process bind a port that is already listening,
    # so a stale server keeps answering while the new one looks fine.
    allow_reuse_address = False


if __name__ == '__main__':
    handler = partial(NoCache, directory=ROOT)
    try:
        srv = Server(('127.0.0.1', PORT), handler)
    except OSError as e:
        sys.exit('port %d is already in use (%s)' % (PORT, e))
    print('site   http://127.0.0.1:%d' % PORT)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print(chr(10) + 'stopped')
