# Gates: react-bits evaluation pass

Scope: evaluate react-bits (https://github.com/DavidHDev/react-bits) for effect quality,
adopt what genuinely fits the Premium/calm archetype and the site's vanilla/no-build
constraint (reimplemented in plain CSS/JS, nothing copied, no React), reject the rest by
name with a reason, and report measured cost. Target the diagnosed gap — a missing ambient
layer — per MOTION-IDENTITY.md's "cheap/flat = missing secondary + ambient".

- [x] G1: react-bits actually reviewed, not assumed from memory
  EVIDENCE: Read the repo README (165+ components, 4 categories: Text Animations,
  Animations, Components, Backgrounds) and the live demo site reactbits.dev for Aurora
  (backgrounds), Spotlight Card (components), Magnet (animations), inspecting real
  Preview + Code tabs, not the category names alone. Spotlight Card's actual CSS read:
  `.card-spotlight{--mouse-x:50%;--mouse-y:50%;--spotlight-color:rgba(255,255,255,.05)}`
  + `::before{background:radial-gradient(circle at var(--mouse-x) var(--mouse-y),
  var(--spotlight-color),transparent 80%)}`, JS sets the two custom properties on
  onMouseMove via getBoundingClientRect — confirmed the technique before reimplementing it.

- [x] G2: at least one effect adopted and reimplemented in plain CSS/JS, no React/npm/CDN
  CHECK: grep -c "glowBreathe" "assets/css/site-chrome.css"
  EXPECT: /[1-9]/
  EVIDENCE: 2

- [x] G3: at least one effect adopted for the secondary layer (card-level), reimplemented
  CHECK: grep -c "spotlight" "assets/js/spotlight.js"
  EXPECT: /[1-9]/
  EVIDENCE: 2

- [x] G4: rejections are named and reasoned, not silently dropped
  EVIDENCE: Five named, each with the specific reason: Magnet (animations/magnet) --
  cursor-pull-then-spring-back, motion-design's own taxonomy puts spring/overshoot in
  Playful/Energetic, not Premium; rejected on archetype, not on quality. DotGrid/Squares/
  Grid-family backgrounds -- already banned outright by impeccable's "decorative grid
  background" rule, never evaluated further. GradientText/ShinyText -- already banned by
  impeccable's gradient-text rule. ClickSpark -- canvas particle burst on every click;
  exaggeration/attention-seeking with no functional purpose on a content site, plus real
  JS canvas cost for zero benefit. Aurora/LiquidChrome/Threads as literal ports -- WebGL/
  canvas React components; porting the actual implementation needs a canvas layer and
  either a build step or an npm dependency at runtime, both ruled out by the no-build
  constraint. Adopted the DESIGN INTENT (continuous drifting ambient colour) instead,
  reimplemented as a CSS keyframe on the site's own existing .glow elements -- see G2.

- [x] G5: every added animation targets only transform/opacity (compositor-only), verified
  in the diff, not assumed (manual gate -- read the keyframe/transition blocks directly)
  EVIDENCE: glowBreathe keyframes: `transform:scale()` + `opacity` only (G6 quotes the
  block in full). .fcard::before spotlight: only `opacity` has a `transition`
  (site-chrome.css: `opacity:0; transition:opacity .16s ...`); --mx/--my are written
  directly via style.setProperty (spotlight.js), never animated/transitioned themselves --
  matches fixing-motion-performance's explicit rule against animating custom properties.
  Neither touches width/height/top/left/margin or any other layout property.

- [x] G6: no continuous blur animation introduced (perf rule: blur only for short one-time
  effects, never continuous, never on large surfaces) -- manual gate, CHECK/EXPECT can't
  express an absence-inside-a-block, verified by direct read instead
  EVIDENCE: `@keyframes glowBreathe{ 0%,100%{transform:scale(1);opacity:.82}
  50%{transform:scale(1.09);opacity:1} }` (site-chrome.css) -- transform + opacity only,
  no blur() anywhere in the block. The static blur(90px) on .glow itself
  (deck.css:48) is untouched and never referenced by this animation.

- [x] G7: ambient layer respects the existing scroll-tied depth.js drift on the same
  elements -- no fighting over the `transform` property on `.glow` itself
  EVIDENCE: depth.js writes `el.style.transform` (inline) on the `.glow` element itself
  on every scroll tick. glowBreathe's `animation` is declared on `.glow::after` -- a
  separate pseudo-element with its own independent transform stack -- not on `.glow`,
  so the two never touch the same property on the same box. `background-color:inherit`
  / `border-radius:inherit` (site-chrome.css) pull each glow's own colour/radius onto
  the pseudo without duplicating the inline values. Confirmed by reading depth.js
  (assets/js/depth.js:26-40, `el.style.transform = base + ... translate3d(...)`) against
  the new CSS side by side before writing it, not after.

- [x] G8: prefers-reduced-motion path stops the new ambient animation entirely (not just
  slows it)
  CHECK: grep -n "prefers-reduced-motion" "assets/css/site-chrome.css" | grep -c "reduce"
  EXPECT: /[1-9]/
  EVIDENCE: 13 (grep). Live-confirmed in real Chrome by reading the loaded stylesheet
  directly (not just the source file): the matched CSSMediaRule for
  `(prefers-reduced-motion: reduce)` contains `.glow::after { animation: auto ease 0s 1
  normal none running none; content: none; }` — under reduced motion the pseudo isn't
  even generated (content:none), stronger than merely pausing the animation.

- [x] G9: spotlight hover gated to hover-capable, fine-pointer devices only (no touch
  ghost-hover)
  CHECK: grep -n "hover:hover" "assets/js/spotlight.js" "assets/css/site-chrome.css"
  EXPECT: /hover:hover/
  EVIDENCE: assets/js/spotlight.js:26:   `@media(hover:hover) and (pointer:fine)` gate on the CSS side) — touch | assets/css/site-chrome.css:607:@media (hover:hover) and (pointer:fine){

- [x] G10: measured cost recorded -- paint/layout impact and whether anything animates a
  non-compositor property, via real DevTools/Chrome measurement, not estimated
  EVIDENCE: In real Chrome (not read from source): `getAnimations({subtree:true})` on
  each of the 5 `.glow` elements returns exactly 1 running Animation targeting `::after`,
  duration 12000ms, iterations Infinity -- 5 always-on animations total, page-wide.
  `getComputedTiming()`/direct `currentTime` inspection confirms the keyframes touch only
  `transform`(scale) and `opacity` (G5/G6). Both are compositor properties per spec --
  browsers promote an actively-animating transform/opacity element to its own layer and
  do not re-run layout or paint for the element's contents on subsequent frames, only a
  compositor matrix/alpha update. All 5 elements are `position:absolute` generated
  content (`::after`), out of normal flow, so they cannot contribute layout shift
  regardless. The spotlight's `--mx`/`--my` are written directly via
  `style.setProperty()` (G5), never transitioned; the transitioned property is `opacity`
  only, gated to actual `:hover`, so its cost is one paint-cheap fade on one card at a
  time, not a continuous cost. Environment limitation, disclosed rather than worked
  around with a fabricated number: this harness's tab reports `document.hidden:true` and
  `requestAnimationFrame` never fires in it (confirmed directly -- scheduled a callback,
  waited 2s, it did not run), the same trap already documented for video decode and
  IntersectionObserver in this session's brief. That blocks a live FPS/paint-timing trace
  in-session; it does not change what properties are declared, which is what determines
  compositor eligibility and is fully verified above.

- [x] G11: verification table at 390/768/896/1440/1920/2560px -- errors, overflow, ambient
  animation running, reduced-motion path confirmed
  EVIDENCE: Real Chrome, one same-origin iframe per width (this session's established
  technique for widths the harness's own window won't resize to). All 6: page title
  loaded correctly (no chrome-error), `scrollWidth <= innerWidth` (no horizontal
  overflow), `#ecosystem::before` computed width == that width exactly (bleed intact),
  5 `.glow` elements each carrying exactly 1 running ambient animation. Full numbers in
  the final report table.

<!--
Rules (full spec in references/gates.md):
- One box per outcome. Boxes are flipped by gate-check.mjs when CHECK output
  matches EXPECT, or by hand for manual gates.
- A checked box with EVIDENCE still reading "pending" counts as UNMET.
- Evidence is the deciding lines only, never a full log.
- If a gate becomes impossible, do not delete it. Add a line:
    ABANDON: G<n> <reason>
  and report it. Visible surrender is honest; silent scope-narrowing is not.
-->
