/* Asure interactive hero — parametric "unstructured data → structured knowledge".
 * Adapted from the supplied Apple-quality parametric background to run INSIDE the
 * hero bounds (not full viewport), blended transparently over the page, theme-aware,
 * pointer-interactive without blocking buttons, paused when offscreen / tab hidden,
 * and reduced-motion aware. No iframe, no external deps. */
(() => {
  "use strict";
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const host = canvas.closest(".hero2") || canvas.parentElement;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LOOP_MS = 26000, MOTION_SPEED = 1.0, FRAGMENT_DENSITY = 1.0, STRUCTURE_DENSITY = 1.0, DEPTH_STRENGTH = 1.0;
  const TAU = Math.PI * 2, VIOLET = [124, 92, 255], CYAN = [0, 212, 255];

  /* Spine axis — the structure climbs left→right instead of running flat.
   * Everything anchored to the flow (centreline, conversion point, its glow and
   * gateway rings) reads its Y from axisYAtX so they stay on one line. */
  const AXIS_X0 = .48, AXIS_X1 = 1.02, AXIS_Y0 = .63, AXIS_Y1 = .29;
  const AXIS_SLOPE = (AXIS_Y1 - AXIS_Y0) / (AXIS_X1 - AXIS_X0);
  const axisYAtX = xf => H * (AXIS_Y0 + (xf - AXIS_X0) * AXIS_SLOPE);
  const axisTilt = () => Math.atan2((AXIS_Y1 - AXIS_Y0) * H, (AXIS_X1 - AXIS_X0) * W);

  let W = 0, H = 0, DPR = 1, fragments = [], pulses = [], ripples = [], bokeh = [];
  let frameTime = 0, lastFrameTime = 0, clickEnergy = 0, rafId = 0, running = false, visible = true;
  let rand = seededRandom(981273);

  const camera = { x: 0, y: 0, targetX: 0, targetY: 0, roll: 0, targetRoll: 0 };
  const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false, energy: 0, velocityX: 0, velocityY: 0, speed: 0 };

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const fract = v => v - Math.floor(v);
  const smooth = t => t * t * (3 - 2 * t);
  const smoother = t => t * t * t * (t * (t * 6 - 15) + 10);

  function seededRandom(seed) { let s = seed >>> 0; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function rgba(rgb, a) { return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }
  function colourAt(t, a = 1) { t = clamp(t); return rgba([Math.round(lerp(VIOLET[0], CYAN[0], t)), Math.round(lerp(VIOLET[1], CYAN[1], t)), Math.round(lerp(VIOLET[2], CYAN[2], t))], a); }
  function isDarkTheme() { return document.documentElement.getAttribute("data-theme") !== "light"; }

  function updatePointer() {
    const dt = Math.max(8, Math.min(34, frameTime - lastFrameTime || 16));
    const ease = pointer.active ? .13 : .055;
    const oldX = pointer.x, oldY = pointer.y;
    pointer.x = lerp(pointer.x, pointer.targetX, ease);
    pointer.y = lerp(pointer.y, pointer.targetY, ease);
    pointer.energy = lerp(pointer.energy, pointer.active ? 1 : 0, pointer.active ? .10 : .045);
    pointer.velocityX = lerp(pointer.velocityX, (pointer.x - oldX) / dt, .16);
    pointer.velocityY = lerp(pointer.velocityY, (pointer.y - oldY) / dt, .16);
    pointer.speed = lerp(pointer.speed, Math.hypot(pointer.velocityX, pointer.velocityY), .12);
    const nx = pointer.active ? pointer.x / Math.max(W, 1) - .5 : 0;
    const ny = pointer.active ? pointer.y / Math.max(H, 1) - .5 : 0;
    camera.targetX = nx * 16 * pointer.energy;
    camera.targetY = ny * 10 * pointer.energy;
    camera.targetRoll = nx * -.007 * pointer.energy;
    camera.x = lerp(camera.x, camera.targetX, .045);
    camera.y = lerp(camera.y, camera.targetY, .045);
    camera.roll = lerp(camera.roll, camera.targetRoll, .035);
    clickEnergy = lerp(clickEnergy, 0, .035);
    ripples = ripples.filter(r => frameTime - r.born < r.duration);
  }

  function interactionAt(x, y, z = 0, strength = 1) {
    let dx = 0, dy = 0, dz = 0, glow = 0;
    if (pointer.energy > .001) {
      const vx = pointer.x - x, vy = pointer.y - y, distance = Math.hypot(vx, vy);
      const radius = Math.min(W, H) * .30;
      const proximity = smooth(clamp(1 - distance / radius)) * pointer.energy * strength;
      if (proximity > 0) {
        const sd = Math.max(distance, 1), nx = vx / sd, ny = vy / sd;
        const orbit = Math.sin(frameTime * .0015 + distance * .018 + z * 2.2);
        const wake = clamp(pointer.speed * 1.55, 0, 1.20);
        dx += nx * proximity * 16 + (-ny) * proximity * orbit * 12 + pointer.velocityX * proximity * 10;
        dy += ny * proximity * 16 + nx * proximity * orbit * 12 + pointer.velocityY * proximity * 10;
        dz -= proximity * (.48 + .18 * Math.sin(frameTime * .0018 + distance * .012) + wake * .14);
        glow += proximity * (1 + wake * .20);
      }
    }
    for (const ripple of ripples) {
      const age = clamp((frameTime - ripple.born) / ripple.duration);
      const vx = x - ripple.x, vy = y - ripple.y, distance = Math.hypot(vx, vy);
      const radius = age * Math.min(W, H) * .70, bandWidth = lerp(16, 48, age);
      const band = Math.exp(-Math.pow((distance - radius) / bandWidth, 2));
      const fade = (1 - age) * ripple.power * strength;
      if (band > .001) {
        const sd = Math.max(distance, 1), nx = vx / sd, ny = vy / sd, disp = band * fade * 40;
        dx += nx * disp; dy += ny * disp; dz -= band * fade * .82; glow += band * fade * 1.7;
      }
    }
    return { dx, dy, dz, glow: clamp(glow, 0, 2.2) };
  }
  function applyInteraction(point, strength = 1) {
    const inf = interactionAt(point.x, point.y, point.z || 0, strength);
    return { x: point.x + inf.dx, y: point.y + inf.dy, z: (point.z || 0) + inf.dz, glow: inf.glow };
  }
  function triggerRipple(x, y, power = 1) {
    clickEnergy = Math.min(1.35, clickEnergy + .92 * power);
    ripples.push({ x, y, born: performance.now(), duration: 2100, power });
    if (ripples.length > 5) ripples.shift();
  }

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildScene();
  }

  function buildScene() {
    rand = seededRandom(Math.round(W * 19 + H * 43));
    fragments = []; pulses = []; bokeh = [];
    const minDim = Math.min(W, H), conversionX = W * .48, conversionY = axisYAtX(.48);
    const fragmentCount = Math.max(70, Math.round((W * H / 8200) * FRAGMENT_DENSITY));
    for (let i = 0; i < fragmentCount; i++) {
      const mode = rand(); let sx, sy;
      if (mode < .62) { sx = lerp(-W * .12, W * .17, Math.pow(rand(), 1.4)); sy = lerp(-H * .10, H * 1.10, rand()); }
      else if (mode < .82) { sx = lerp(W * .02, W * .40, rand()); sy = lerp(-H * .14, H * .08, rand()); }
      else { sx = lerp(W * .02, W * .40, rand()); sy = lerp(H * .92, H * 1.14, rand()); }
      const angle = rand() * TAU, spread = minDim * lerp(.012, .070, Math.pow(rand(), 1.7));
      fragments.push({
        sx, sy, sz: lerp(-1, 1, rand()),
        tx: conversionX + Math.cos(angle) * spread * .34, ty: conversionY + Math.sin(angle) * spread, tz: lerp(-.12, .12, rand()),
        c1x: lerp(sx, conversionX, .30) + lerp(-90, 90, rand()), c1y: sy + lerp(-H * .18, H * .18, rand()), c1z: lerp(-1.0, 1.0, rand()),
        c2x: lerp(sx, conversionX, .74) + lerp(-55, 55, rand()), c2y: lerp(sy, conversionY, .80) + lerp(-H * .10, H * .10, rand()), c2z: lerp(-.40, .40, rand()),
        phase: rand(), size: lerp(2.0, 8.4, Math.pow(rand(), 1.7)), spin: lerp(-1.5, 1.5, rand()),
        type: Math.floor(rand() * 5), alpha: lerp(.24, .80, rand()), depth: rand()
      });
    }
    const pulseCount = Math.max(14, Math.round(26 * STRUCTURE_DENSITY));
    for (let i = 0; i < pulseCount; i++) pulses.push({ phase: rand(), rail: Math.floor(rand() * 8), size: lerp(.8, 2.2, rand()), speed: [1, 1, 1, 2][Math.floor(rand() * 4)] });
    const bokehCount = Math.max(18, Math.round(W * H / 40000));
    for (let i = 0; i < bokehCount; i++) bokeh.push({ x: rand() * W, y: rand() * H, z: lerp(-1.2, 1.4, rand()), radius: lerp(1.2, 7.5, Math.pow(rand(), 1.8)), alpha: lerp(.018, .075, rand()), phase: rand() * TAU, speed: lerp(.25, .75, rand()), front: rand() > .70 });
  }

  function project3D(x, y, z) {
    const perspective = 1 / (1 + z * .18 * DEPTH_STRENGTH);
    const localX = (x - W * .50) * perspective, localY = (y - H * .50) * perspective;
    const cosR = Math.cos(camera.roll), sinR = Math.sin(camera.roll);
    return { x: W * .50 + localX * cosR - localY * sinR - camera.x * (1 - z * .08), y: H * .50 + localX * sinR + localY * cosR - camera.y * (1 - z * .08), scale: perspective, alpha: clamp(1 - Math.abs(z) * .30) };
  }
  function cubic3D(item, t) {
    const u = 1 - t, tt = t * t, uu = u * u, uuu = uu * u, ttt = tt * t;
    return { x: uuu * item.sx + 3 * uu * t * item.c1x + 3 * u * tt * item.c2x + ttt * item.tx, y: uuu * item.sy + 3 * uu * t * item.c1y + 3 * u * tt * item.c2y + ttt * item.ty, z: uuu * item.sz + 3 * uu * t * item.c1z + 3 * u * tt * item.c2z + ttt * item.tz };
  }

  function drawBackground() {
    const dark = isDarkTheme();
    ctx.clearRect(0, 0, W, H); // transparent — blend over the page hero
    const g1 = ctx.createRadialGradient(W * .48, axisYAtX(.48), 0, W * .48, axisYAtX(.48), Math.min(W, H) * .30);
    g1.addColorStop(0, dark ? "rgba(124,92,255,.10)" : "rgba(124,92,255,.055)");
    g1.addColorStop(.46, dark ? "rgba(0,212,255,.038)" : "rgba(0,212,255,.020)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W * .80, H * .48, 0, W * .80, H * .48, Math.max(W, H) * .54);
    g2.addColorStop(0, dark ? "rgba(0,212,255,.050)" : "rgba(0,212,255,.024)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }
  function drawBokeh(loop, foreground = false) {
    const dark = isDarkTheme(); ctx.save();
    for (const p of bokeh) {
      if (p.front !== foreground) continue;
      const dx = Math.sin(loop * TAU * p.speed + p.phase) * (foreground ? 18 : 10);
      const dy = Math.cos(loop * TAU * p.speed * .73 + p.phase) * (foreground ? 13 : 7);
      const pr = project3D(p.x + dx, p.y + dy, p.z);
      const alpha = p.alpha * pr.alpha * (foreground ? .72 : 1) * (dark ? 1.15 : .85);
      ctx.filter = `blur(${foreground ? 2.4 : 1.3}px)`;
      ctx.fillStyle = colourAt(clamp(.35 + p.x / Math.max(W, 1) * .55), alpha);
      ctx.beginPath(); ctx.arc(pr.x, pr.y, p.radius * pr.scale * (foreground ? 1.4 : 1), 0, TAU); ctx.fill();
    }
    ctx.filter = "none"; ctx.restore();
  }
  function drawConversionField(loop) {
    const dark = isDarkTheme(), x = W * .48, y = axisYAtX(.48), minDim = Math.min(W, H);
    ctx.save(); ctx.translate(x, y); ctx.rotate(axisTilt() + Math.sin(loop * TAU) * .035);
    for (let i = 0; i < 5; i++) {
      const pulse = .5 + .5 * Math.sin(loop * TAU * 2 + i * 1.3);
      const rx = minDim * (.018 + i * .010 + pulse * .0025), ry = minDim * (.062 + i * .017 + pulse * .006);
      ctx.strokeStyle = colourAt(.42 + i * .04, (dark ? .050 : .034) * (1 - i * .11));
      ctx.lineWidth = .55; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, Math.sin(loop * TAU + i) * .08, -.95, .98); ctx.stroke();
    }
    ctx.restore();
  }
  function drawFragments(loop) {
    const dark = isDarkTheme(); ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const ordered = fragments.map(f => { const raw = fract(f.phase + loop * MOTION_SPEED); const p = smoother(raw); return { f, raw, p, basePos: cubic3D(f, p) }; }).sort((a, b) => b.basePos.z - a.basePos.z);
    for (const item of ordered) {
      const { f, raw, p, basePos } = item;
      const basePrev = cubic3D(f, clamp(p - .024)), baseOlder = cubic3D(f, clamp(p - .060));
      const strength = lerp(1.12, .54, smooth(clamp((p - .42) / .58)));
      const pos = applyInteraction(basePos, strength), prev = applyInteraction(basePrev, strength * .92), older = applyInteraction(baseOlder, strength * .82);
      const pp = project3D(pos.x, pos.y, pos.z), pPrev = project3D(prev.x, prev.y, prev.z), pOlder = project3D(older.x, older.y, older.z);
      const fadeIn = smooth(clamp(raw / .10)), fadeOut = 1 - smooth(clamp((raw - .81) / .19)), convergence = smooth(clamp((p - .56) / .44));
      const alpha = f.alpha * fadeIn * fadeOut * pp.alpha * (1 + (pos.glow || 0) * .20), cP = lerp(.02, .48, p);
      const trail = ctx.createLinearGradient(pOlder.x, pOlder.y, pp.x, pp.y);
      trail.addColorStop(0, colourAt(cP, 0)); trail.addColorStop(1, colourAt(cP, alpha * lerp(.20, .72, convergence)));
      ctx.strokeStyle = trail; ctx.lineWidth = lerp(.4, 1.15, f.depth) * pp.scale;
      ctx.beginPath(); ctx.moveTo(pOlder.x, pOlder.y); ctx.quadraticCurveTo(pPrev.x, pPrev.y, pp.x, pp.y); ctx.stroke();
      const angle = Math.atan2(pp.y - pPrev.y, pp.x - pPrev.x);
      ctx.save(); ctx.translate(pp.x, pp.y); ctx.rotate(lerp(angle + f.spin * Math.sin(raw * TAU), angle, convergence));
      const scale = pp.scale * lerp(1, .68, convergence); ctx.scale(scale, scale);
      ctx.strokeStyle = colourAt(cP, alpha); ctx.fillStyle = colourAt(cP, alpha * (dark ? .17 : .09)); ctx.lineWidth = lerp(.65, 1.15, f.depth);
      if (dark && alpha > .24) { ctx.shadowBlur = lerp(4, 11, f.depth); ctx.shadowColor = colourAt(cP, alpha); }
      else if (!dark && pos.z < -.25) { ctx.shadowBlur = 5; ctx.shadowColor = "rgba(80,80,120,.10)"; }
      const s = f.size;
      switch (f.type) {
        case 0: ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * .68, s * .30); ctx.lineTo(-s * .18, -s * .44); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
        case 1: ctx.beginPath(); ctx.moveTo(s * .72, 0); ctx.lineTo(-s * .54, s * .44); ctx.lineTo(-s * .34, -s * .50); ctx.closePath(); ctx.stroke(); break;
        case 2: ctx.strokeRect(-s * .42, -s * .42, s * .84, s * .84); ctx.beginPath(); ctx.moveTo(-s * .42, -s * .42); ctx.lineTo(0, -s * .70); ctx.lineTo(s * .42, -s * .42); ctx.moveTo(0, -s * .70); ctx.lineTo(0, -s * .04); ctx.stroke(); break;
        case 3: ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.moveTo(-s * .55, -s * .33); ctx.lineTo(s * .62, -s * .33); ctx.moveTo(-s * .28, s * .33); ctx.lineTo(s * .76, s * .33); ctx.stroke(); break;
        default: ctx.fillStyle = colourAt(cP, alpha); ctx.beginPath(); ctx.arc(0, 0, Math.max(1, s * .22), 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  function parametricCenterline(u, loop) {
    const x = lerp(W * .50, W * 1.02, u);
    const primary = Math.sin(u * TAU * 1.05 + loop * TAU * 2) * H * .045, secondary = Math.sin(u * TAU * 2.15 - loop * TAU) * H * .014;
    return { x, y: axisYAtX(x / W) + primary + secondary, z: Math.sin(u * TAU * 1.30 + loop * TAU) * .45 };
  }
  function structurePoint(u, rail, loop) {
    const center = parametricCenterline(u, loop), railCount = 8, theta = rail / railCount * TAU;
    const maturity = smooth(clamp(u / .55)), breathing = 1 + .10 * Math.sin(loop * TAU * 2 + u * TAU * 1.6);
    const radiusY = lerp(H * .028, H * .092, maturity) * breathing, radiusZ = lerp(.10, .72, maturity);
    const twist = u * TAU * 1.65 + loop * TAU * 2 + Math.sin(u * TAU * 2 - loop * TAU) * .25, a = theta + twist;
    const y = center.y + Math.cos(a) * radiusY, z = center.z + Math.sin(a) * radiusZ;
    const inf = applyInteraction({ x: center.x, y, z }, lerp(.58, .86, maturity));
    return { x: inf.x, y: inf.y, z: inf.z, interactionGlow: inf.glow, maturity, colour: lerp(.48, 1, u) };
  }
  function drawParametricStructure(loop) {
    const dark = isDarkTheme(), railCount = 8, segmentCount = Math.max(40, Math.round(58 * STRUCTURE_DENSITY)), rings = [];
    for (let i = 0; i <= segmentCount; i++) { const u = i / segmentCount, points = []; for (let rail = 0; rail < railCount; rail++) { const p3 = structurePoint(u, rail, loop), p2 = project3D(p3.x, p3.y, p3.z); points.push({ ...p3, ...p2 }); } rings.push(points); }
    const longitudinal = [];
    for (let rail = 0; rail < railCount; rail++) for (let i = 0; i < segmentCount; i++) { const a = rings[i][rail], b = rings[i + 1][rail]; longitudinal.push({ a, b, depth: (a.z + b.z) * .5, type: "rail" }); }
    const crossLinks = [];
    for (let i = 1; i < segmentCount; i += 2) { const u = i / segmentCount, maturity = smooth(clamp(u / .60)); for (let rail = 0; rail < railCount; rail++) { const a = rings[i][rail], b = rings[i][(rail + 1) % railCount]; crossLinks.push({ a, b, depth: (a.z + b.z) * .5, type: "ring", maturity }); if (maturity > .38 && (i + rail) % 3 === 0) { const c = rings[Math.min(i + 2, segmentCount)][(rail + 2) % railCount]; crossLinks.push({ a, b: c, depth: (a.z + c.z) * .5, type: "diagonal", maturity }); } } }
    const allLinks = longitudinal.concat(crossLinks).sort((m, n) => n.depth - m.depth);
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const link of allLinks) {
      const a = link.a, b = link.b, depthAlpha = clamp(1 - Math.abs(link.depth) * .22), maturity = Math.min(a.maturity, b.maturity);
      let alpha, width;
      if (link.type === "rail") { alpha = lerp(dark ? .16 : .20, dark ? .44 : .48, maturity); width = lerp(.62, 1.28, maturity); }
      else if (link.type === "ring") { alpha = lerp(dark ? .10 : .14, dark ? .31 : .36, maturity); width = lerp(.50, .92, maturity); }
      else { alpha = lerp(dark ? .07 : .10, dark ? .22 : .26, maturity); width = lerp(.45, .72, maturity); }
      const iGlow = Math.max(a.interactionGlow || 0, b.interactionGlow || 0);
      const segmentU = clamp(((a.colour + b.colour) * .5 - .48) / .52), sweep = fract(loop * 1.35);
      const sweepDistance = Math.min(Math.abs(segmentU - sweep), 1 - Math.abs(segmentU - sweep));
      const specular = Math.exp(-Math.pow(sweepDistance / .055, 2));
      alpha *= depthAlpha * Math.min(a.alpha, b.alpha) * (1 + iGlow * .25 + specular * .82 + clickEnergy * .12); width *= 1 + specular * .55;
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y); grad.addColorStop(0, colourAt(a.colour, alpha)); grad.addColorStop(1, colourAt(b.colour, alpha));
      ctx.strokeStyle = grad; ctx.lineWidth = width * ((a.scale + b.scale) * .5); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let i = 7; i < segmentCount - 2; i += 7) { const maturity = smooth(clamp((i / segmentCount) / .55)); if (maturity < .18) continue; for (let rail = 0; rail < railCount; rail += 2) { const a = rings[i][rail], b = rings[i][(rail + 1) % railCount], c = rings[Math.min(i + 3, segmentCount)][(rail + 2) % railCount]; const zAvg = (a.z + b.z + c.z) / 3, alpha = (dark ? .022 : .018) * maturity * clamp(1 - Math.abs(zAvg) * .25); ctx.fillStyle = colourAt((a.colour + b.colour + c.colour) / 3, alpha); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath(); ctx.fill(); } }
    const nodeList = [];
    for (let i = 0; i <= segmentCount; i += 2) for (let rail = 0; rail < railCount; rail++) nodeList.push(rings[i][rail]);
    nodeList.sort((a, b) => b.z - a.z);
    for (const node of nodeList) {
      const depthAlpha = clamp(1 - Math.abs(node.z) * .22), nodeU = clamp((node.colour - .48) / .52);
      const gd = Math.min(Math.abs(nodeU - fract(loop * 1.35)), 1 - Math.abs(nodeU - fract(loop * 1.35))), glint = Math.exp(-Math.pow(gd / .050, 2));
      const alpha = lerp(dark ? .46 : .58, dark ? .82 : .88, node.maturity) * depthAlpha * node.alpha * (1 + (node.interactionGlow || 0) * .30 + glint * .50);
      if (dark && node.z < .15) { ctx.shadowBlur = lerp(4, 12, node.maturity); ctx.shadowColor = colourAt(node.colour, alpha); }
      ctx.fillStyle = colourAt(node.colour, alpha); ctx.beginPath(); ctx.arc(node.x, node.y, lerp(1.25, 3.15, node.maturity) * node.scale, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
  function drawPulses(loop) {
    const dark = isDarkTheme(); ctx.save();
    for (const pulse of pulses) {
      const u = fract(pulse.phase + loop * pulse.speed), p3 = structurePoint(u, pulse.rail % 8, loop), p2 = project3D(p3.x, p3.y, p3.z);
      const fadeIn = smooth(clamp(u / .06)), fadeOut = 1 - smooth(clamp((u - .90) / .10)), alpha = fadeIn * fadeOut * p2.alpha * (dark ? .96 : .82);
      ctx.shadowBlur = dark ? 15 : 8; ctx.shadowColor = colourAt(p3.colour, alpha); ctx.fillStyle = colourAt(p3.colour, alpha);
      ctx.beginPath(); ctx.arc(p2.x, p2.y, pulse.size * p2.scale, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawInteractionOverlay() {
    if (pointer.energy <= .002 && ripples.length === 0) return;
    const dark = isDarkTheme(); ctx.save();
    if (pointer.energy > .002) {
      const radius = Math.min(W, H) * .14, glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
      glow.addColorStop(0, colourAt(.68, (dark ? .075 : .040) * pointer.energy)); glow.addColorStop(.34, colourAt(.52, (dark ? .040 : .020) * pointer.energy)); glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow; ctx.fillRect(pointer.x - radius, pointer.y - radius, radius * 2, radius * 2);
    }
    for (const ripple of ripples) {
      const age = clamp((frameTime - ripple.born) / ripple.duration), radius = age * Math.min(W, H) * .70, alpha = Math.sin(age * Math.PI) * (dark ? .16 : .11) * ripple.power;
      ctx.strokeStyle = colourAt(lerp(.48, .94, age), alpha); ctx.lineWidth = lerp(1.2, .45, age); ctx.beginPath(); ctx.arc(ripple.x, ripple.y, radius, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }

  function frame(time) {
    frameTime = time; updatePointer();
    const loop = reducedMotion ? .42 : fract((time * MOTION_SPEED) / LOOP_MS);
    drawBackground(); drawBokeh(loop, false); drawConversionField(loop); drawFragments(loop);
    drawParametricStructure(loop); drawPulses(loop); drawBokeh(loop, true); drawInteractionOverlay();
    lastFrameTime = time;
    if (running && !reducedMotion) rafId = requestAnimationFrame(frame);
  }
  function start() { if (running || reducedMotion) { if (reducedMotion) { frameTime = performance.now(); frame(frameTime); } return; } running = true; rafId = requestAnimationFrame(frame); }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
  function setActive(on) { if (on && visible && !document.hidden) start(); else if (!on) stop(); }

  // pointer — listen on the hero host so the canvas stays pointer-events:none (buttons work)
  function setFromEvent(e) {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    pointer.targetX = x; pointer.targetY = y;
    if (!pointer.active) { pointer.x = x; pointer.y = y; }
    pointer.active = x >= 0 && x <= W && y >= 0 && y <= H;
  }
  host.addEventListener("pointermove", setFromEvent, { passive: true });
  host.addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });
  host.addEventListener("pointerdown", e => { setFromEvent(e); const r = canvas.getBoundingClientRect(); triggerRipple(e.clientX - r.left, e.clientY - r.top, e.pointerType === "touch" ? 1.15 : 1); }, { passive: true });

  // lifecycle — pause when offscreen or tab hidden; resize with the hero
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); }, { passive: true });
  document.addEventListener("visibilitychange", () => setActive(!document.hidden && visible));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; setActive(visible); }, { threshold: 0 }).observe(host);
  }
  if (typeof ResizeObserver !== "undefined") { new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(resize, 120); }).observe(host); }

  resize();
  start();
})();
