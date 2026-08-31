# Gates: Website-wide visual audit and production polish

Scope: Audit and improve every accessible site page, repeated component, interactive state, and responsive breakpoint while preserving existing functionality.

- [ ] G1: Every first-party HTML route is inventoried and inspected in a real browser at desktop and mobile widths.
  EVIDENCE: pending

- [ ] G2: A coherent shared design system governs typography, color, spacing, containers, radii, borders, shadows, controls, focus, and feedback states.
  EVIDENCE: pending

- [ ] G3: Repeated navigation, button, card, form, table, badge, modal, and feedback patterns are visually consistent unless a functional difference justifies variation.
  EVIDENCE: pending

- [ ] G4: All accessible interactive flows and states (navigation, search/filtering, forms, tabs, modals, dropdowns, hover, focus, loading, empty, and error where present) are exercised and remain functional.
  EVIDENCE: pending

- [ ] G5: Responsive QA passes at 390, 768, 1280, 1440, and 1920 CSS pixels with no unintended horizontal overflow, overlap, clipping, or viewport-obscured controls.
  EVIDENCE: pending

- [ ] G6: Visual accessibility passes include visible keyboard focus, readable contrast, non-color-only state communication, and practical pointer targets.
  EVIDENCE: pending

- [ ] G7: Motion remains restrained, uses the locked motion identity, does not rely on layout-triggering animation, and resolves to no nonessential animation under reduced motion.
  EVIDENCE: pending

- [ ] G8: Automated project checks and browser console checks pass after implementation.
  EVIDENCE: pending

- [ ] G9: A final cross-page browser pass finds no screen that looks outside the chosen visual system, and before/after evidence is captured for materially changed pages.
  EVIDENCE: pending

- [ ] G10: Git diff contains only audit artifacts and intentional site changes on `codex/website-wide-visual-audit`; no pre-existing deliverable is removed.
  CHECK: git branch --show-current
  EXPECT: codex/website-wide-visual-audit
  EVIDENCE: pending

