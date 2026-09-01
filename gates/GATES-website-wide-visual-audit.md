# Gates: Website-wide visual audit and production polish

Scope: Audit and improve every accessible site page, repeated component, interactive state, and responsive breakpoint while preserving existing functionality.

- [x] G1: Every first-party HTML route is inventoried and inspected in a real browser at desktop and mobile widths.
  EVIDENCE: `_design/audit-2026-08-31/final-exhaustive.json` records 17 routes at five viewport widths (85 captures), including every standalone project HTML artifact.

- [x] G2: A coherent shared design system governs typography, color, spacing, containers, radii, borders, shadows, controls, focus, and feedback states.
  EVIDENCE: `assets/css/site-chrome.css` consolidates shared focus, press, touch-target, chip, empty-state, navigation, and responsive treatments on top of the existing theme tokens.

- [x] G3: Repeated navigation, button, card, form, table, badge, modal, and feedback patterns are visually consistent unless a functional difference justifies variation.
  EVIDENCE: shared controls were normalized in `site-chrome.css`; page-specific controls were aligned in `cms.html`, `login.html`, and the four embedded dashboard styles listed in the audit report.

- [x] G4: All accessible interactive flows and states (navigation, search/filtering, forms, tabs, modals, dropdowns, hover, focus, loading, empty, and error where present) are exercised and remain functional.
  EVIDENCE: `node _tools/interaction_audit.mjs http://127.0.0.1:8099` passed 13/13 checks with zero console errors, covering drawer focus/inert state, search reset/focus, contrast, nav, invalid state, filters, tabs, and login fallback.

- [x] G5: Responsive QA passes at 390, 768, 1280, 1440, and 1920 CSS pixels with no unintended horizontal overflow, overlap, clipping, or viewport-obscured controls.
  EVIDENCE: automated overflow records moved from 4 in `baseline.json` to 0 across all 85 entries in `final-exhaustive.json`; screenshots are retained beside the reports.

- [x] G6: Visual accessibility passes include visible keyboard focus, readable contrast, non-color-only state communication, and practical pointer targets.
  EVIDENCE: the interaction audit verifies keyboard focus and WCAG AA kind-chip contrast; shared and representative primary controls now have 44px minimum targets, while text and icons accompany color states.

- [x] G7: Motion remains restrained, uses the locked motion identity, does not rely on layout-triggering animation, and resolves to no nonessential animation under reduced motion.
  EVIDENCE: `final-exhaustive.json` reports no layout-property animations, and the reduced-motion home audit reports zero active animations; the new press state is a restrained 1px transform without bounce.

- [x] G8: Automated project checks and browser console checks pass after implementation.
  EVIDENCE: content build validated 70 records, media manifest and single-file build succeeded, JS syntax and diff checks passed, interaction audit logged zero errors, and the one exhaustive-sweep resource warning passed a clean isolated rerun recorded in `isolated-rerun.json`.

- [x] G9: A final cross-page browser pass finds no screen that looks outside the chosen visual system, and before/after evidence is captured for materially changed pages.
  EVIDENCE: visual inspection covered home, tool, media desk, login, H10, and both materially repaired mobile dashboards; before/after/final screenshots and findings are in `_design/audit-2026-08-31/`.

- [x] G10: Git diff contains only audit artifacts and intentional site changes on `codex/website-wide-visual-audit`; no pre-existing deliverable is removed.
  CHECK: git branch --show-current
  EXPECT: codex/website-wide-visual-audit
  EVIDENCE: branch is `codex/website-wide-visual-audit`; status/diff review shows only intentional style, interaction, responsive, audit-tool, gate, report, and screenshot additions, with no deletions.
