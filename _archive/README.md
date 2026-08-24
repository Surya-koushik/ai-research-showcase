# _archive

Superseded files, kept rather than deleted so history is recoverable. Nothing
here is referenced by the site, the build, or the docs — moving it out of the
root is purely to declutter.

## tool_template_history/

Eleven snapshots taken while the tool page was being designed, on 22 Aug 2026.
The canonical page is `tool_template.html` in the project root; these are the
before-states from each iteration (badges, gallery, heading order, the
"premium" pass, the UI-kit pass, responsive fixes). Safe to delete once nobody
wants to diff against them.

## assets.zip

A stale bundle from July. Not referenced anywhere.

---

## Candidates for the next tidy — NOT moved, they need a human call

These live in the root and overlap; someone who wrote them should decide which
is canonical before archiving the other:

- `TOOL_SHOWCASE_IMAGE_GUIDE.md` overlaps `TOOL_TEMPLATE_IMAGE_GENERATION_PROCEDURE.md`
  (the second is the binding one — referenced by CLAUDE.md and the contributor
  kit).
- `ADD_A_TOOL.md` overlaps the `_contributor_kit/` README.
- `registry/` is the pre-`content/` tools registry (its own pipeline and
  `tools.json`). The live catalogue is `content/<id>.json`; confirm nothing
  still reads `registry/` before archiving it.
