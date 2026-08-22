"""Link every catalogue record to its folder on disk, in one pass.

    python _tools/link_sources.py            show what it would do
    python _tools/link_sources.py --apply    write the high-confidence links
    python _tools/link_sources.py --apply --all   also write the medium ones

Only high-confidence matches are written by default. The rest are printed for
you to confirm in the admin, because folder names genuinely mislead: cadbridge
and navisbridge both look like a directory called 'bridge', and phoenix-l1
scores highest against a folder of screenshots rather than the add-in source.
A wrong link quietly attaches the wrong work to a project, so the default is
to under-claim.

Links go to _local/sources.json, which is gitignored - the paths are specific
to this machine and never reach the published site.
"""
import io, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sources

ROOT = sources.ROOT
CONTENT = os.path.join(ROOT, 'content')

apply_ = '--apply' in sys.argv
include_medium = '--all' in sys.argv
THRESHOLD = 55 if include_medium else 90

records = []
for fn in sorted(os.listdir(CONTENT)):
    if fn.endswith('.json'):
        with io.open(os.path.join(CONTENT, fn), encoding='utf-8') as f:
            records.append(json.load(f))

existing = sources.links()
print('scanning %s' % ', '.join(sources.roots()))
print('%d candidate folders\n' % len(sources.candidates()))

short = lambda p: (p.replace(r'C:\Users\surya ASURE\Downloads', '~DL')
                    .replace(r'Y:\CLAUDE DIRECT ACCESS FOLDER', '~Y'))

will, review, already, nothing = [], [], [], []
for r in records:
    pid = r['id']
    if pid in existing:
        already.append(r)
        continue
    sug = sources.suggest(r, limit=2)
    if not sug:
        nothing.append(r)
    elif sug[0]['score'] >= THRESHOLD:
        will.append((r, sug[0]))
    else:
        review.append((r, sug[0]))

print('ALREADY LINKED  %d' % len(already))
for r in already:
    print('  %-5s %-26s %s' % (r['code'], r['id'], short(existing[r['id']])[:70]))

print('\n%s  %d' % ('LINKING' if apply_ else 'WOULD LINK', len(will)))
for r, s in will:
    print('  %-5s %-26s %3d  %s' % (r['code'], r['id'], s['score'], short(s['path'])[:66]))
    if apply_:
        sources.set_link(r['id'], s['path'])

print('\nCONFIRM IN THE ADMIN  %d   (best guess shown, not written)' % len(review))
for r, s in review:
    print('  %-5s %-26s %3d  %s' % (r['code'], r['id'], s['score'], short(s['path'])[:66]))

print('\nNO CANDIDATE  %d' % len(nothing))
if nothing:
    print('  ' + ', '.join(r['code'] + ' ' + r['id'] for r in nothing))

if not apply_:
    print('\nnothing written. re-run with --apply to write the %d high-confidence links'
          % len(will))
else:
    print('\nwrote %d links to _local/sources.json' % len(will))
