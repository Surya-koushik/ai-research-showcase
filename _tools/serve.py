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
import os, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8099


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
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
