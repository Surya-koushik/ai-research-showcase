# Vendored — ASURE UI KIT

Snapshot of Shravan's kit, taken as a build-time copy. **Do not edit these files.**
The kit's own rule is explicit:

> Never fork kit files into a consuming app — reference, or build-time inline.

Every customisation for this site lives in `assets/css/uikit-bridge.css`, which
only overrides tokens. The vendored files stay byte-identical to source so a
version bump is a straight re-copy.

| | |
|---|---|
| Source | `asure-ui-kit-main.zip`, as supplied by Shravan |
| Also at | https://github.com/shravankumarn-asure/asure-ui-kit |
| Commit | `e0b8c9cae03cb529a3b85e17a72d4ecb10664490` |
| Version | v1.3 "DETAILED REPORT." (2026-08-12) |
| Taken | 2026-08-19 |

The zip and the git clone were diffed file by file and are byte-identical once
line endings are normalised — the zip ships LF, the checkout CRLF. Either is a
valid source for a refresh.

## Files

| File | What it is |
|---|---|
| `asure-ui.css` | Component vocabulary — 60+ `a-*` classes |
| `asure-ui.js` | Tabs, segs, toggles, drawers, toasts, hash deep-links |
| `asure-report.css` | Report grammar — compact and paged |
| `asure-report.js` | `AsureReport` builders and `open()` |
| `asure-illustrations.js` | Line-art band motifs, `currentColor`-driven |

## To update

    cp <kit>/UIKIT/01_APPLICATION/kit/*.{css,js} assets/vendor/asure-ui-kit/

Then re-check the bridge for tokens the kit added or renamed.
