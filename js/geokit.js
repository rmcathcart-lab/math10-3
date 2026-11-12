/* Geometry kit for the practice site: Unit 5 (angles, protractors, parallel lines and transversals, bearings, polygons) and
 * Units 6–7 (similar figures, scale diagrams, right triangles, Pythagoras, trig ratios, elevation, shadows, mirrors).
 * Needs js/kit.js and js/kitx.js. Load after js/geom.js, before the lesson files. Everything is on HW.geo.
 *
 * FIGURES — static SVG strings in the booklet's look (class "fig-svg", like HW.fig). Positions are worked out for you;
 * DIRECTIONS ARE MATH DEGREES (0 = right, counterclockwise, 90 = up) except bearings (clockwise from north).
 *   HW.geo.protractorSVG({ angle, rot 0, scale 'inner'|'outer'|'none', offset 20, arms: [d1, d2], names: ['A','B','C'],
 *       highlight: 'inner'|'outer' (colour that scale + a band from 0 to the reading: for solutions), width 460 })
 *     A 180° school protractor (outer scale 0 on the LEFT, inner grey scale 0 on the RIGHT, as \protractor), its centre on
 *     the vertex, turned rot degrees. scale 'inner': one arm on the inner 0 (the base line's right end), the other at
 *     rot + angle; 'outer': one arm on the outer 0 (left end); 'none': neither arm on 0 (arms at offset and offset + angle,
 *     relative to the base line — "subtract the two readings"). arms overrides all of that (absolute directions).
 *   HW.geo.angleSVG({ a1, a2 | angle + rot, reflex, label (text | true = the measure), names, rays: [{ dir, name, len }],
 *       arcs: [{ a, b, label, reflex, right, r, color }], dot true, width 260 })
 *     One angle (a1, a2) or several rays from one vertex with marked angles (adjacent, complementary, supplementary,
 *     vertically opposite: give the rays as lines, e.g. dirs 20 and 200).
 *   HW.geo.transversalSVG({ parallel true, tilt (angle 2; default 60 or from a numeric angle), skew 14, angles: {1: 70, 6: 'x'},
 *       numbers true, highlight: [a, b], marks, names: { top, bottom, t } | false, width 360 })
 *     Two lines cut by a transversal; angles 1–4 at the top crossing and 5–8 at the bottom, each clockwise from the
 *     upper-left (the booklet's numbering); ">" marks on parallel lines.
 *   HW.geo.compassSVG({ origin: 'A', bearings: [{ deg, label, color, dash, arc }], points: [{ name, bearing, dist }],
 *       arcs: [{ from, to, label }] (bearings, clockwise from → to), northAt: ['B'], grid true, width 320 })
 *     A map: north arrow at the origin (and at each northAt point), rays/points at true bearings.
 *   HW.geo.polygonSVG({ n, pts, angles: [labels by vertex], names, sides, diagonals false (from vertex 0: the n − 2
 *       triangles of the angle-sum rule), arcs true, width 260 })
 *
 * CHECKERS — return checker functions like K.number: { v: 'correct' | 'wrong' | 'form', code, hint }
 *   HW.geo.angleChk(deg, { tol 0, reflex, supplementTrap true | 'hint text' | false, alts: [{v, code, hint}] })
 *     A missing or extra ° (or "degrees") is fine. 180 − x (the other protractor scale) gets a targeted hint; a reflex
 *     answer when the small angle was asked (and the other way round) too.
 *   HW.geo.bearingChk(deg, { tol 0, strict3 true, back: original bearing (when the answer is a back bearing), alts })
 *     045 and 045° are right; 45 is a "write 3 digits" nudge (no try used); N45°E / NE get a "true bearing" nudge;
 *     360 − x (counterclockwise), 90 − x (from east), the angle from the N–S line, and for back bearings adding instead
 *     of subtracting 180° (or the reverse), or forgetting to turn round, each get a hint.
 *   HW.geo.pairChk(target, { accept: [ids] }) — a typed pair name. target: 'corresponding' | 'alt-int' | 'alt-ext' |
 *     'int-same' | 'ext-same' | 'vert-opp' (| 'linear'). Accepts reasonable spellings and synonyms ("alt int",
 *     "co-interior", "same-side interior", "consecutive interior", "vertical angles", small typos).
 *   HW.geo.pairOf(text) → { id } | { ambiguous: 'alt'|'int'|'ext'|'letter' } | { unknown: true } | { empty: true }
 *
 * UNITS 6–7 (similarity, scale, right triangles; lengths are numbers, labels plain text):
 *   HW.geo.similarSVG({ shape | pts, k, drawK, names: ['ABCD', 'PQRS'], labels true | [[…], […]], units, angles, matchColors, rot, flip })
 *   HW.geo.rightTriSVG({ a, b, c (any two), right 'br', rot (any degrees), flip, names, sides: { a: '12 cm', c: '?' } | true, angles: { A: '35°' },
 *       theta 'A'|'B', thetaLabel, roles true | ['opp','hyp'], long, highlight, unknown 'a'|'b'|'c'|'A'|'B', squares })   right angle at C
 *   HW.geo.elevationSVG({ kind 'elevation'|'depression', angle, dist, height, eye, labels: { angle, dist, height, eye }, observer, target, alt })
 *   HW.geo.shadowSVG({ small: { h, shadow, kind, label }, big: { h, shadow, kind, label: { h: '?' } }, sunLabel })
 *   HW.geo.mirrorSVG({ eye, d1, d2, h, kind, labels: { eye, d1, d2, h }, angleLabel })
 *   HW.geo.gridSVG({ cols, rows, cell, shape | pts, at, k, imageAt, image true, names })   ·   HW.geo.scaleMapSVG({ scale, w, h, places, routes, bar })
 *   HW.geo.parseScale('1 cm : 2 m' | '1:200' | {…}) → { draw, drawUnit, real, realUnit, ratio, perCm, text }; rightSides({a, b, c}); rolesFor('A')
 *   HW.geo.lenChk(v, { dp 1, unit, trig: { fn, deg, side, op 'mul'|'div' }, pyth: { legs: [a, b] } | { hyp, leg }, scale: { len, k, op },
 *       prop: { given, num, den }, alts, radTrap true }) — nearest tenth; RAD mode, × vs ÷, wrong ratio, no √, a² − b², hyp as a leg, …
 *   HW.geo.angleRatioChk(deg, { dp 0, ratio: { fn, num, den }, alts, radTrap, complementTrap }) — RAD mode, no inverse, wrong ratio, 90° − θ
 *   HW.geo.kChk(k, { flipTrap true, from: { new, orig }, dp 2 }) — fraction or decimal; 1/k, new − orig, 3 : 2, 150% traps
 *   Parts: P.len(prompt, v, o), P.trigAngle(prompt, deg, o), P.k(prompt, k | [p, q], o), P.ratioMC(r, prompt, 'sin'|'cos'|'tan'|'pyth', o)
 *
 * PART BUILDERS (same part objects as K.P): HW.geo.P.angle(prompt, deg, o), .bearing(prompt, deg, o),
 *   .pair(prompt, target, o) (a text box), .pairMC(r, prompt, target, o) (the six names), .classify(r, prompt, deg, o)
 *   (acute / right / obtuse / straight / reflex). o: sol, hints, text, plus the checker options. Also HW.geo.pairName(a, b),
 *   PAIRS, PAIR_NAMES, bearingText(b) ("045"), readDeg(resp).
 */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var G = HW.geo = HW.geo || {};
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', PURPLE = '#7b4fc4';
  var RAD = Math.PI / 180, FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function n360(a) { return ((a % 360) + 360) % 360; }
  function n180(a) { a = n360(a); return a > 180 ? a - 360 : a; }
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  function f(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function fmtDeg(v) { var r = Math.round(v * 10) / 10; return String(Math.abs(r - Math.round(r)) < 1e-9 ? Math.round(r) : r); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function bearingText(b) { b = n360(Math.round(b * 10) / 10); var w = Math.floor(b + 1e-9), fr = Math.round((b - w) * 10); return ('00' + w).slice(-3) + (fr ? '.' + fr : ''); }
  G.bearingText = bearingText; G.n360 = n360;

  /* ---------------- a tiny SVG canvas that tracks its own bounding box ---------------- */
  function Canvas() { this.s = ''; this.bb = [Infinity, Infinity, -Infinity, -Infinity]; }
  Canvas.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); };
  Canvas.prototype.raw = function (s, pts) { this.s += s; var me = this; (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); };
  Canvas.prototype.line = function (p, q, o) {
    o = o || {};
    this.raw('<line x1="' + f(p[0]) + '" y1="' + f(p[1]) + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.opacity ? ' opacity="' + o.opacity + '"' : '') + '/>', o.nobb ? [] : [p, q]);
  };
  Canvas.prototype.path = function (d, o, pts) {
    o = o || {};
    this.raw('<path d="' + d + '" fill="' + (o.fill || 'none') + '"' + (o.fillOpacity != null ? ' fill-opacity="' + o.fillOpacity + '"' : '') + ' stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linecap="' + (o.cap || 'round') + '" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.opacity != null ? ' opacity="' + o.opacity + '"' : '') + '/>', pts);
  };
  Canvas.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-zθαβ]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '';
    var w = str.length * size * 0.3 + 2;
    this.raw('<text x="' + f(x) + '" y="' + f(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 600) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it +
      (o.rot != null ? ' transform="rotate(' + f(o.rot) + ' ' + f(x) + ' ' + f(y) + ')"' : '') + (o.halo === false ? '' : ' paint-order="stroke" stroke="#fff" stroke-width="' + (o.halo || 3.5) + '" stroke-linejoin="round"') + '>' + esc(str).replace(/-/g, '−') + '</text>');
    this.grow(o.anchor === 'start' ? x + w : o.anchor === 'end' ? x - w : x, y, o.anchor ? 0 : w, size * 0.62); if (o.anchor) this.grow(x, y, 0, size * 0.62);
  };
  Canvas.prototype.dot = function (p, o) { o = o || {}; this.raw('<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + (o.r || 3.2) + '" fill="' + (o.color || INK) + '"/>', [p]); };
  Canvas.prototype.svg = function (o) {
    o = o || {}; var pad = o.pad == null ? 8 : o.pad, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    if (W < 60) { x -= (60 - W) / 2; W = 60; } if (H < 60) { y -= (60 - H) / 2; H = 60; }
    var maxW = o.width || W, aria = esc(o.aria || 'figure');
    return '<svg class="fig-svg" viewBox="' + f(x) + ' ' + f(y) + ' ' + f(W) + ' ' + f(H) + '" width="100%" style="max-width:' + Math.round(Math.min(maxW, W * (o.maxScale || 1.6))) + 'px" role="img" aria-label="' + aria + '">' + this.s + '</svg>';
  };
  function arcD(V, r, start, span) {
    if (Math.abs(span) >= 359.99) span = (span < 0 ? -1 : 1) * 359.99;
    var a = at(V, start, r), b = at(V, start + span, r);
    return 'M' + f(a[0]) + ' ' + f(a[1]) + 'A' + f(r) + ' ' + f(r) + ' 0 ' + (Math.abs(span) > 180 ? 1 : 0) + ' ' + (span > 0 ? 0 : 1) + ' ' + f(b[0]) + ' ' + f(b[1]);
  }
  function arcPts(V, r, start, span) { var out = []; for (var i = 0; i <= 12; i++) out.push(at(V, start + span * i / 12, r)); return out; }
  function wedgeD(V, r, start, span) { return 'M' + f(V[0]) + ' ' + f(V[1]) + 'L' + arcD(V, r, start, span).slice(1) + 'Z'; }
  function arrow(cv, E, d, o) { o = o || {}; var u = at([0, 0], d, 1), L = o.L || 11, w = o.w || 4.5; cv.raw('<polygon points="' + [E, [E[0] - L * u[0] + w * u[1], E[1] - L * u[1] - w * u[0]], [E[0] - L * u[0] - w * u[1], E[1] - L * u[1] + w * u[0]]].map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' ') + '" fill="' + (o.color || INK) + '"/>', [E]); }
  /* the small angle (or reflex) from direction d1 to d2: { start, span } with the sweep counterclockwise */
  function sweep(d1, d2, reflex) { var s = n360(d1), sp = n360(d2 - d1); if ((sp > 180) !== !!reflex) { s = n360(d2); sp = 360 - sp; } if (reflex && sp === 0) sp = 360; return { start: s, span: sp }; }
  /* an angle mark at V: arc (or right-angle square) and a label clear of the arms */
  function mark(cv, V, d1, d2, o) {
    o = o || {}; var sw = sweep(d1, d2, o.reflex), size = o.size || 15, colr = o.color || (o.reflex ? RED : INK);
    var r = o.r || (o.reflex ? 20 : sw.span < 25 ? 44 : sw.span < 45 ? 34 : 26);
    var right = o.right != null ? o.right : (!o.reflex && Math.abs(sw.span - 90) < 0.05);
    if (right) { var s = o.rs || 13, u = at([0, 0], sw.start, 1), v = at([0, 0], sw.start + 90, 1); cv.path('M' + f(V[0] + u[0] * s) + ' ' + f(V[1] + u[1] * s) + 'L' + f(V[0] + (u[0] + v[0]) * s) + ' ' + f(V[1] + (u[1] + v[1]) * s) + 'L' + f(V[0] + v[0] * s) + ' ' + f(V[1] + v[1] * s), { stroke: colr, width: 1.6, cap: 'butt' }); }
    else cv.path(arcD(V, r, sw.start, sw.span), { stroke: colr, width: 1.7 }, arcPts(V, r, sw.start, sw.span));
    if (o.label != null && o.label !== false && o.label !== '') {
      var str = o.label === true ? fmtDeg(sw.span) + '°' : String(o.label), hw = str.length * size * 0.3 + 3;
      var lr = Math.min(110, Math.max((right ? 13 : r) + size * 0.85, (hw + size * 0.35) / Math.max(0.12, Math.sin(Math.min(sw.span, 180) / 2 * RAD)) + 4));
      if (right) lr = Math.max(lr, (o.rs || 13) * 1.41 + hw + 4);
      var p = at(V, sw.start + sw.span / 2, o.labelR || lr);
      cv.text(p[0], p[1], str, { size: size, color: o.labelColor || colr, weight: 700 });
    }
    return sw;
  }

  /* ---------------- protractor ---------------- */
  /* drawn around its centre C; outer scale reads 180 − a (0 on the LEFT), inner grey scale reads a (0 on the RIGHT) */
  function drawProtractor(cv, C, R, rot, o) {
    o = o || {};
    var P0 = function (a, r) { return at(C, rot + a, r); }, base = R * 0.08, hl = o.highlight;
    var A = P0(0, R), B = P0(180, R), bA = at(A, rot - 90, base), bB = at(B, rot - 90, base);
    cv.path('M' + f(B[0]) + ' ' + f(B[1]) + 'A' + R + ' ' + R + ' 0 0 1 ' + f(A[0]) + ' ' + f(A[1]) + 'L' + f(bA[0]) + ' ' + f(bA[1]) + 'L' + f(bB[0]) + ' ' + f(bB[1]) + 'Z',
      { fill: '#eaf0fd', fillOpacity: 0.85, stroke: '#3c4a66', width: 1.3 }, arcPts(C, R, rot, 180).concat([bA, bB]));
    if (hl && o.other != null) {
      var hr = hl === 'outer' ? R * 0.845 : R * 0.745, from = hl === 'outer' ? 180 : 0, sp = hl === 'outer' ? o.other - 180 : o.other;
      if (Math.abs(sp) > 0.5) cv.path(arcD(C, hr, rot + from, sp), { stroke: hl === 'outer' ? BLUE : GREEN, width: R * 0.08, opacity: 0.18 });
    }
    var d = '';
    for (var a = 0; a <= 180; a++) { var L = a % 10 === 0 ? 0.1 : a % 5 === 0 ? 0.065 : 0.038, p = P0(a, R), q = P0(a, R * (1 - L)); d += 'M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(q[0]) + ' ' + f(q[1]); }
    cv.path(d, { stroke: '#2b3340', width: 0.8, cap: 'butt' });
    cv.path(arcD(C, R * 0.665, rot, 180), { stroke: '#56637d', width: 0.9 });
    var gd = ''; for (var g = 10; g < 180; g += 10) { var p1 = P0(g, R * 0.15), p2 = P0(g, R * 0.665); gd += 'M' + f(p1[0]) + ' ' + f(p1[1]) + 'L' + f(p2[0]) + ' ' + f(p2[1]); }
    cv.path(gd, { stroke: '#8592ab', width: 0.6, opacity: 0.55 });
    cv.line(A, B, { color: INK, width: 1.4 });
    var top = P0(90, R * 0.1); cv.line(C, top, { color: INK, width: 1.4 });
    var fo = o.fo || 14, fi = o.fi || 12.5;
    for (var n = 0; n <= 180; n += 10) {
      var po = P0(n, R * 0.845), pi = P0(n, R * 0.745), tr = 90 - (rot + n);
      cv.text(po[0], po[1], String(180 - n), { size: fo, weight: 700, color: hl === 'outer' ? BLUE : hl === 'inner' ? '#9aa0ab' : INK, rot: tr, halo: false });
      cv.text(pi[0], pi[1], String(n), { size: fi, weight: 600, color: hl === 'inner' ? GREEN : hl === 'outer' ? '#b4b9c3' : '#5a6070', rot: tr, halo: false });
    }
    cv.raw('<circle cx="' + f(C[0]) + '" cy="' + f(C[1]) + '" r="2.6" fill="none" stroke="' + RED + '" stroke-width="1.3"/>');
  }
  G.protractorSVG = function (o) {
    o = o || {}; var R = o.R || 190, rot = o.rot || 0, ang = o.angle == null ? 50 : o.angle, sc = o.scale || 'inner', C = [0, 0], d1, d2;
    if (o.arms) { d1 = o.arms[0]; d2 = o.arms[1]; }
    else if (sc === 'outer') { d1 = rot + 180; d2 = rot + 180 - ang; }
    else if (sc === 'none') { var off = o.offset == null ? 20 : o.offset; d1 = rot + off; d2 = rot + off + ang; }
    else { d1 = rot; d2 = rot + ang; }
    var cv = new Canvas(), len = o.len || R * 1.18;
    var phi2 = n360(d2 - rot), phi1 = n360(d1 - rot), other = Math.abs(n180(phi1)) < 0.5 ? phi2 : Math.abs(n180(phi1 - 180)) < 0.5 ? phi2 : null;
    drawProtractor(cv, C, R, rot, { highlight: o.highlight, other: other, fo: o.fo, fi: o.fi });
    var E1 = at(C, d1, len), E2 = at(C, d2, len);
    cv.path('M' + f(E1[0]) + ' ' + f(E1[1]) + 'L' + f(C[0]) + ' ' + f(C[1]) + 'L' + f(E2[0]) + ' ' + f(E2[1]), { stroke: INK, width: 2.6 }, [E1, C, E2]);
    cv.dot(C, { r: 3 });
    if (o.names) {
      var nm = o.names, s = 17;
      if (nm[0]) { var q0 = at(C, d1, len + 14); cv.text(q0[0], q0[1], nm[0], { size: s, weight: 700 }); }
      if (nm[2]) { var q2 = at(C, d2, len + 14); cv.text(q2[0], q2[1], nm[2], { size: s, weight: 700 }); }
      if (nm[1]) { var sw = sweep(d1, d2), q1 = at(C, sw.start + sw.span / 2 + 180, R * 0.08 + 16); cv.text(q1[0], q1[1], nm[1], { size: s, weight: 700 }); }
    }
    return cv.svg({ width: o.width || 460, aria: 'protractor on an angle', maxScale: 1.2 });
  };

  /* ---------------- angles from one vertex ---------------- */
  G.angleSVG = function (o) {
    o = o || {}; var V = [0, 0], cv = new Canvas(), len = o.len || 110, rays = [];
    if (o.rays) rays = o.rays.map(function (r) { return typeof r === 'number' ? { dir: r } : r; });
    else { var a1 = o.a1 != null ? o.a1 : (o.rot || 0), a2 = o.a2 != null ? o.a2 : a1 + (o.angle == null ? 50 : o.angle); rays = [{ dir: a1, name: o.names && o.names[0] }, { dir: a2, name: o.names && o.names[2] }]; }
    var arcs = o.arcs || (o.rays ? [] : [{ a: rays[0].dir, b: rays[1].dir, label: o.label, reflex: o.reflex, right: o.right, color: o.color, r: o.r }]);
    if (o.fill && !o.rays) { var sw0 = sweep(rays[0].dir, rays[1].dir, o.reflex); cv.path(wedgeD(V, (o.r || 30) + 4, sw0.start, sw0.span), { fill: o.fill === true ? '#c9dafb' : o.fill, fillOpacity: 0.6 }); }
    rays.forEach(function (r) { var E = at(V, r.dir, r.len || len); cv.line(V, E, { color: r.color || INK, width: r.width || 2.6, dash: r.dash }); if (r.arrow) arrow(cv, E, r.dir); });
    var labDirs = [];
    arcs.forEach(function (a) { var sw = mark(cv, V, a.a, a.b, { label: a.label, reflex: a.reflex, right: a.right, r: a.r, color: a.color, size: o.size || 15, labelR: a.labelR }); if (a.label != null && a.label !== false && a.label !== '') labDirs.push(sw.start + sw.span / 2); });
    if (o.dot !== false) cv.dot(V, { r: 3 });
    var ns = o.nameSize || 16;
    rays.forEach(function (r) { if (r.name) { var p = at(V, r.dir, (r.len || len) + ns * 0.8); cv.text(p[0], p[1], r.name, { size: ns, weight: 700 }); } });
    var vn = o.vertexName || (o.names && o.names[1]);
    if (vn) {   // the vertex letter goes in the widest gap between the rays that has no angle label in it
      var ds = rays.map(function (r) { return n360(r.dir); }).sort(function (a, b) { return a - b; }), best = -1, bd = 270;
      for (var i = 0; i < ds.length; i++) {
        var nx = i + 1 < ds.length ? ds[i + 1] : ds[0] + 360, gap = nx - ds[i], lo = ds[i];
        var busy = labDirs.some(function (d) { return n360(d - lo) > 0.5 && n360(d - lo) < gap - 0.5; });
        var score = gap - (busy ? 1000 : 0); if (score > best) { best = score; bd = ds[i] + gap / 2; }
      }
      if (ds.length === 1) bd = ds[0] + 180;
      var q = at(V, bd, ns * 1.05); cv.text(q[0], q[1], vn, { size: ns, weight: 700 });
    }
    return cv.svg({ width: o.width || 260, aria: o.aria || 'angle diagram' });
  };

  /* ---------------- parallel lines and a transversal ---------------- */
  var PAIRS = G.PAIRS = { corresponding: [[1, 5], [2, 6], [3, 7], [4, 8]], 'alt-int': [[3, 5], [4, 6]], 'alt-ext': [[1, 7], [2, 8]], 'int-same': [[4, 5], [3, 6]], 'ext-same': [[1, 8], [2, 7]],
    'vert-opp': [[1, 3], [2, 4], [5, 7], [6, 8]], linear: [[1, 2], [2, 3], [3, 4], [1, 4], [5, 6], [6, 7], [7, 8], [5, 8]] };
  var PAIR_NAMES = G.PAIR_NAMES = { corresponding: 'corresponding angles', 'alt-int': 'alternate interior angles', 'alt-ext': 'alternate exterior angles',
    'int-same': 'interior angles on the same side of the transversal', 'ext-same': 'exterior angles on the same side of the transversal', 'vert-opp': 'vertically opposite angles', linear: 'adjacent angles on a line (supplementary)' };
  var PAIR_SHORT = G.PAIR_SHORT = { corresponding: 'corresponding', 'alt-int': 'alternate interior', 'alt-ext': 'alternate exterior', 'int-same': 'interior on the same side', 'ext-same': 'exterior on the same side', 'vert-opp': 'vertically opposite', linear: 'supplementary (on a line)' };
  var PAIR_COLORS = { corresponding: BLUE, 'alt-int': GREEN, 'alt-ext': PURPLE, 'int-same': AMBER, 'ext-same': RED, 'vert-opp': '#3a4254', linear: '#9a6a24' };
  G.pairName = function (a, b) { for (var k in PAIRS) if (PAIRS[k].some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); })) return k; return null; };
  /* geometry shared with lessons/js/geo.js: returns crossing points, line ends and the corner of each numbered angle */
  G.transversalGeom = function (o) {
    o = o || {}; var W = o.w || 340, H = o.h || 220, parallel = o.parallel !== false, A = o.angles || {};
    var num = function (k) { return typeof A[k] === 'number' ? A[k] : null; }, tilt = o.tilt;
    if (tilt == null) {
      var t2 = num(2) != null ? num(2) : num(4), t1 = num(1) != null ? num(1) : num(3);
      tilt = t2 != null ? t2 : t1 != null ? 180 - t1 : null;
      if (tilt == null && parallel) { var b2 = num(6) != null ? num(6) : num(8), b1 = num(5) != null ? num(5) : num(7); tilt = b2 != null ? b2 : b1 != null ? 180 - b1 : null; }
      if (tilt == null) tilt = 60;
    }
    tilt = Math.max(15, Math.min(165, tilt));
    var skew = parallel ? 0 : (o.skew == null ? 14 : o.skew), gap = o.gap || H * 0.42, C = [W / 2, H / 2], run = gap / Math.tan(tilt * RAD);
    var T = [C[0] + run / 2, C[1] - gap / 2], B = [C[0] - run / 2, C[1] + gap / 2], hl = o.lineLen || W * 0.46, tdir = tilt;
    var topA = [C[0] - hl, T[1]], topB = [C[0] + hl, T[1]], bs = function (x) { return (x - B[0]) / Math.cos(skew * RAD); };
    var botA = at(B, skew, bs(C[0] - hl)), botB = at(B, skew, bs(C[0] + hl)), ext = o.ext || Math.max(24, (H / 2 - gap / 2 - 10) / Math.sin(tilt * RAD));
    var corner = function (k) {
      var X = k <= 4 ? T : B, L = k <= 4 ? 0 : skew, j = (k - 1) % 4 + 1;
      var s = j === 1 ? tdir : j === 2 ? L : j === 3 ? tdir + 180 : L + 180, e = j === 1 ? L + 180 : j === 2 ? tdir : j === 3 ? L + 360 : tdir + 180;
      return { X: X, start: n360(s), span: n360(e - s) };
    };
    return { T: T, B: B, topA: topA, topB: topB, botA: botA, botB: botB, tA: at(T, tdir, ext), tB: at(B, tdir + 180, ext), tilt: tilt, skew: skew, hl: hl, ext: ext, corner: corner,
      measure: function (k) { return Math.round(corner(k).span * 10) / 10; } };
  };
  G.transversalSVG = function (o) {
    o = o || {}; var g = G.transversalGeom(o), cv = new Canvas(), A = o.angles || {}, size = o.size || 15, parallel = o.parallel !== false;
    if (o.highlight) {
      var hcol = o.highlightColor || PAIR_COLORS[G.pairName(o.highlight[0], o.highlight[1])] || BLUE;
      o.highlight.forEach(function (k) { var c = g.corner(k); cv.path(wedgeD(c.X, 26, c.start, c.span), { fill: hcol, fillOpacity: 0.28 }); });
    }
    cv.line(g.topA, g.topB, { width: 2.4 }); cv.line(g.botA, g.botB, { width: 2.4 }); cv.line(g.tA, g.tB, { width: 2.4 });
    var marks = o.marks != null ? o.marks : parallel ? 1 : 0;
    if (marks) [[g.topA, 0], [g.botA, g.skew]].forEach(function (e) {
      for (var i = 0; i < marks; i++) { var p = at(e[0], e[1], 0.12 * 2 * g.hl + i * 8), a = at(p, e[1] + 180, 8), u = at([0, 0], e[1] + 90, 6); cv.path('M' + f(a[0] + u[0]) + ' ' + f(a[1] + u[1]) + 'L' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(a[0] - u[0]) + ' ' + f(a[1] - u[1]), { stroke: INK, width: 2 }); }
    });
    if (o.names !== false) {
      var nm = Object.assign({ top: 'ℓ₁', bottom: 'ℓ₂', t: 't' }, o.names || {}), ns = 15;
      if (nm.top) { var p1 = at(g.topB, 0, 13); cv.text(p1[0], p1[1], nm.top, { size: ns, italic: true }); }
      if (nm.bottom) { var p2 = at(g.botB, g.skew, 13); cv.text(p2[0], p2[1], nm.bottom, { size: ns, italic: true }); }
      if (nm.t) { var p3 = at(g.tA, g.tilt, 11); cv.text(p3[0], p3[1], nm.t, { size: ns, italic: true }); }
    }
    for (var k = 1; k <= 8; k++) {
      var s = A[k] != null ? (typeof A[k] === 'number' ? fmtDeg(A[k]) + '°' : String(A[k])) : (o.numbers !== false ? String(k) : null);
      if (s == null || s === '') continue;
      var isNum = A[k] == null, c = g.corner(k), hw = s.length * size * 0.29 + 2, d = Math.max(isNum ? 15 : 17, Math.min(70, (hw + size * 0.25) / Math.max(0.15, Math.sin(c.span / 2 * RAD)) + 2)), p = at(c.X, c.start + c.span / 2, d);
      cv.text(p[0], p[1], s, { size: isNum ? size - 1 : size, weight: isNum ? 600 : 700, color: isNum ? '#3a4254' : ((o.labelColors || {})[k] || INK), italic: isNum ? false : undefined });
    }
    return cv.svg({ width: o.width || 360, aria: o.aria || (parallel ? 'two parallel lines cut by a transversal' : 'two lines cut by a transversal') });
  };

  /* ---------------- bearings on a map ---------------- */
  G.compassSVG = function (o) {
    o = o || {}; var cv = new Canvas(), O = [0, 0], sc = o.scale || 1, B2D = function (b) { return 90 - b; }, pts = {}, R = o.r || 70;
    pts[o.origin || 'O'] = O;
    (o.points || []).forEach(function (p) { pts[p.name] = p.at ? p.at : at(pts[p.from || o.origin || 'O'] || O, B2D(p.bearing), (p.dist || 100) * sc); });
    // light map grid behind everything (drawn first, sized at the end)
    var gridAt = cv.s.length;
    var north = function (P, big) { var L = big ? R * 0.9 : 46, E = [P[0], P[1] - L]; cv.line(P, E, { color: INK, width: big ? 2.2 : 1.8 }); arrow(cv, E, 90, { L: 10, w: 4.5 }); cv.text(E[0], E[1] - 11, 'N', { size: big ? 16 : 14, weight: 800, italic: false }); };
    north(O, true); (o.northAt || []).forEach(function (n) { if (pts[n]) north(pts[n], false); });
    (o.arcs || []).forEach(function (a) {
      var P = pts[a.at || o.origin || 'O'] || O, from = a.from || 0, span = n360(a.to - from) || 360, rr = a.r || (R * 0.42);
      cv.path(arcD(P, rr, B2D(from), -span), { stroke: a.color || RED, width: 1.7 }, arcPts(P, rr, B2D(from), -span));
      var e = at(P, B2D(a.to), rr); arrow(cv, e, B2D(a.to) - 90, { color: a.color || RED, L: 8, w: 3.5 });
      if (a.label != null) { var lp = at(P, B2D(from + span / 2), rr + 16 + String(a.label).length * 2.5); cv.text(lp[0], lp[1], a.label === true ? bearingText(a.to) + '°' : a.label, { size: 15, color: a.color || RED, weight: 700 }); }
    });
    (o.bearings || []).forEach(function (b) {
      var P = pts[b.from || o.origin || 'O'] || O, L = (b.len || 110) * sc, E = at(P, B2D(b.deg), L);
      cv.line(P, E, { color: b.color || INK, width: 2.3, dash: b.dash }); if (b.arrow !== false) arrow(cv, E, B2D(b.deg), { color: b.color || INK });
      if (b.arc) { var rr = b.r || R * 0.38; cv.path(arcD(P, rr, 90, -n360(b.deg)), { stroke: b.color || RED, width: 1.7 }, arcPts(P, rr, 90, -n360(b.deg))); }
      if (b.label != null) { var lp = at(P, B2D(b.deg), L + 16); cv.text(lp[0], lp[1], b.label === true ? bearingText(b.deg) + '°' : b.label, { size: 15, weight: 700, color: b.color || INK }); }
    });
    (o.points || []).forEach(function (p) {
      var P = pts[p.name], F = pts[p.from || o.origin || 'O'] || O;
      if (p.line !== false && !p.at) cv.line(F, P, { color: p.color || INK, width: 2.1, dash: p.dash });
      cv.dot(P, { r: 3.6 });
      var lp = at(P, p.labelDir != null ? p.labelDir : B2D(p.bearing || 0), 15); cv.text(lp[0], lp[1], p.label || p.name, { size: 16, weight: 700 });
    });
    cv.dot(O, { r: 3.6 }); var ol = at(O, o.originLabelDir != null ? o.originLabelDir : 225, 15); cv.text(ol[0], ol[1], o.origin || 'O', { size: 16, weight: 700 });
    if (o.grid !== false) {
      var bb = cv.bb, gs = o.gridSize || 25, gx0 = Math.floor((bb[0] - 10) / gs) * gs, gy0 = Math.floor((bb[1] - 10) / gs) * gs, gd = '';
      for (var x = gx0; x <= bb[2] + 10; x += gs) gd += 'M' + f(x) + ' ' + f(gy0) + 'V' + f(bb[3] + 10);
      for (var y = gy0; y <= bb[3] + 10; y += gs) gd += 'M' + f(gx0) + ' ' + f(y) + 'H' + f(bb[2] + 10);
      cv.s = cv.s.slice(0, gridAt) + '<path d="' + gd + '" stroke="#e4e7ec" stroke-width="1" fill="none"/>' + cv.s.slice(gridAt);
    }
    return cv.svg({ width: o.width || 320, aria: o.aria || 'map with bearings', pad: 6 });
  };

  /* ---------------- polygons ---------------- */
  G.polygonSVG = function (o) {
    o = o || {}; var n = o.pts ? o.pts.length : (o.n || 5), cv = new Canvas(), R = 90, P = o.pts;
    if (!P) { P = []; var s0 = o.start != null ? o.start : 270 - 180 / n; for (var i = 0; i < n; i++) P.push(at([0, 0], s0 + 360 * i / n, R)); }   // regular, flat bottom edge
    else P = P.map(function (p) { return [p[0], -p[1]]; });   // given in math coordinates (y up)
    // orientation: make the vertex order counterclockwise on screen for interior arcs
    var area = 0; for (var a = 0; a < n; a++) { var p = P[a], q = P[(a + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; }
    if (o.diagonals) { for (var d = 2; d < n - 1; d++) cv.line(P[0], P[d], { color: '#6a7182', width: 1.6, dash: '5 4' }); }
    if (o.shade) for (var s = 1; s < n - 1; s++) cv.path('M' + [P[0], P[s], P[s + 1]].map(function (pp) { return f(pp[0]) + ' ' + f(pp[1]); }).join('L') + 'Z', { fill: s % 2 ? '#dde8fb' : '#fbe9cf', fillOpacity: 0.9 });
    cv.path('M' + P.map(function (pp) { return f(pp[0]) + ' ' + f(pp[1]); }).join('L') + 'Z', { stroke: INK, width: 2.4 }, P);
    for (var v = 0; v < n; v++) {
      var V = P[v], prev = P[(v + n - 1) % n], next = P[(v + 1) % n];
      var dp = n360(Math.atan2(-(prev[1] - V[1]), prev[0] - V[0]) / RAD), dn = n360(Math.atan2(-(next[1] - V[1]), next[0] - V[0]) / RAD);
      // interior: on screen, counterclockwise order (area < 0 in y-down) means the interior is to the left of each edge
      var start = area < 0 ? dn : dp, end = area < 0 ? dp : dn, span = n360(end - start);
      var lab = o.angles ? o.angles[v] : null;
      if ((o.arcs !== false && lab != null && lab !== '') || o.arcs === true) {
        var refl = span > 180, rr = o.r || 18;
        if (Math.abs(span - 90) < 0.05) { var u = at([0, 0], start, 1), w = at([0, 0], start + 90, 1), k = 11; cv.path('M' + f(V[0] + u[0] * k) + ' ' + f(V[1] + u[1] * k) + 'L' + f(V[0] + (u[0] + w[0]) * k) + ' ' + f(V[1] + (u[1] + w[1]) * k) + 'L' + f(V[0] + w[0] * k) + ' ' + f(V[1] + w[1] * k), { stroke: INK, width: 1.4, cap: 'butt' }); }
        else cv.path(arcD(V, rr, start, span), { stroke: refl ? RED : INK, width: 1.5 });
      }
      if (lab != null && lab !== '') { var str = typeof lab === 'number' ? fmtDeg(lab) + '°' : String(lab), hw = str.length * 15 * 0.3 + 3, dd = Math.max(30, Math.min(60, hw / Math.max(0.2, Math.sin(Math.min(span, 180) / 2 * RAD)) + 6)); var lp = at(V, start + span / 2, dd); cv.text(lp[0], lp[1], str, { size: 15, weight: 700 }); }
      if (o.names) { var nmp = at(V, start + span / 2 + 180, 14); cv.text(nmp[0], nmp[1], o.names[v], { size: 15, weight: 700 }); }
      if (o.sides && o.sides[v]) { var M = [(V[0] + next[0]) / 2, (V[1] + next[1]) / 2], dd2 = n360(Math.atan2(-(next[1] - V[1]), next[0] - V[0]) / RAD) + (area < 0 ? -90 : 90), sp2 = at(M, dd2, 14); cv.text(sp2[0], sp2[1], o.sides[v], { size: 14 }); }
    }
    return cv.svg({ width: o.width || 260, aria: o.aria || n + '-sided polygon' });
  };

  /* ======================================== checkers ======================================== */
  /* a typed angle → number (a missing/extra degree sign, "degrees", "x =" or "∠ABC =" in front are all fine) */
  G.readDeg = function (resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, ' ').replace(/\\[,;: !]|~| | /g, ' ');
    s = s.replace(/[−–]/g, '-').replace(/deg(ree)?s?\.?/gi, ' ').replace(/\s+/g, ' ').trim();
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1).trim();
    if (!s) return { code: 'empty' };
    if (/^-?\d+,\d+$/.test(s)) return { code: 'comma' };
    if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(s)) return { code: 'notnumber', s: s };
    return { v: Number(s), s: s, intLen: s.replace(/^-/, '').split('.')[0].length };
  };
  function slip(a, what) {
    if (a.code === 'empty') return form('empty', 'Type your answer first.');
    if (a.code === 'comma') return form('geo-comma', 'Use a decimal <b>point</b>, not a comma.');
    return form('notnumber', what || 'Type the size of the angle as a number (the ° sign is optional).');
  }
  var near = function (v, w, tol) { return Math.abs(v - w) <= (tol || 0) + 1e-9; };
  G.angleChk = function (deg, o) {
    o = o || {}; var tol = o.tol || 0, trap = o.supplementTrap == null ? true : o.supplementTrap;
    return function (resp) {
      var a = G.readDeg(resp); if (a.code) return slip(a);
      var v = a.v;
      if (near(v, deg, tol)) return ok();
      for (var i = 0; o.alts && i < o.alts.length; i++) if (near(v, o.alts[i].v, o.alts[i].tol != null ? o.alts[i].tol : tol)) return o.alts[i].form ? form(o.alts[i].code || 'geo-alt', o.alts[i].hint) : wrong(o.alts[i].code || 'geo-alt', o.alts[i].hint);
      if (v < 0) return wrong('sign', 'An angle’s size is never negative.');
      if (trap && deg > 0 && deg < 180 && Math.abs(180 - 2 * deg) > 2 * tol + 1 && near(v, 180 - deg, tol))
        return wrong(typeof trap === 'string' ? 'geo-supplement' : 'geo-other-scale', typeof trap === 'string' ? trap : 'You read the <b>other scale</b>. Use the scale that starts at <b>0 on one arm</b>, and check: is the angle acute or obtuse?');
      if (o.reflex && near(v, 360 - deg, tol)) return wrong('geo-reflex-small', 'That’s the smaller angle. The <b>reflex</b> angle goes the long way round: ' + t('360^\\circ-' + fmtDeg(v) + '^\\circ') + '.');
      if (!o.reflex && deg < 180 && near(v, 360 - deg, tol)) return wrong('geo-reflex-big', 'That’s the reflex angle (the long way round). Give the smaller angle, less than 180°.');
      if (deg < 180 && v > 180 && !o.reflex && !near(v, 360 - deg, tol)) return wrong('geo-too-big', null);
      return wrong('value', null);
    };
  };
  var WORDS = { n: 0, north: 0, ne: 45, northeast: 45, e: 90, east: 90, se: 135, southeast: 135, s: 180, south: 180, sw: 225, southwest: 225, w: 270, west: 270, nw: 315, northwest: 315 };
  G.bearingChk = function (deg, o) {
    o = o || {}; var b = n360(deg), tol = o.tol || 0, strict = o.strict3 !== false;
    var eqB = function (v, w) { return Math.abs(n180(v - w)) <= tol + 1e-9; };
    var TB = 'Write a <b>true bearing</b>: 3 digits, measured <b>clockwise from north</b> (like 045° or 230°)';
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, '').replace(/\\[,;: !]|~/g, ' ').trim();
      var low = raw.toLowerCase().replace(/\s+/g, '').replace(/^bearing/, '').replace(/(\d)t(rue)?$/, '$1');
      if (/^[ns]\d+(\.\d+)?[ew]$/.test(low)) return form('geo-bearing-quadrant', TB + ', not a compass direction like N45°E.');
      if (WORDS[low.replace(/[^a-z]/g, '')] != null && /^[a-z\-]+$/.test(low)) return form('geo-bearing-word', TB + ', not a compass point.');
      var a = G.readDeg(low); if (a.code) return slip(a, 'Type the bearing as a number with 3 digits, like 045.');
      var v = a.v;
      for (var i = 0; o.alts && i < o.alts.length; i++) if (Math.abs(v - o.alts[i].v) <= tol + 1e-9) return wrong(o.alts[i].code || 'geo-alt', o.alts[i].hint);
      if (o.back != null) {
        var B0 = o.back;
        if (Math.abs(v - (B0 + 180)) <= tol + 1e-9 && B0 + 180 >= 360) return wrong('geo-back-add', 'That’s more than 360°. When the bearing is 180° or more, <b>subtract</b> 180° to turn round.');
        if (Math.abs(v - (B0 - 180)) <= tol + 1e-9 && B0 - 180 < 0) return wrong('geo-back-sub', 'A bearing can’t be negative. When the bearing is less than 180°, <b>add</b> 180° to turn round.');
        if (eqB(v, B0) && !eqB(B0, b)) return wrong('geo-back-same', 'That’s the bearing going there. To come back you face the <b>opposite</b> way: add or subtract 180°.');
      }
      if (Math.abs(v - 360) <= tol + 1e-9 && eqB(0, b)) return form('geo-bearing-360', 'Right direction — but north is written 000°, not 360°.');
      if (v >= 360 || v < 0) return wrong('geo-bearing-range', 'Bearings go from 000° up to (but not including) 360°.');
      if (eqB(v, b)) {
        if (strict && a.intLen < 3) return form('geo-bearing-3digit', 'Right direction! A true bearing always has <b>3 digits</b>: write ' + bearingText(v) + '°.');
        return ok();
      }
      if (!eqB(360 - b, b) && eqB(v, 360 - b)) return wrong('geo-bearing-ccw', 'Bearings turn <b>clockwise</b> from north (the way clock hands move), not counterclockwise.');
      if (!eqB(90 - b, b) && eqB(v, 90 - b)) return wrong('geo-bearing-east', 'Start at <b>north</b> (000°), not east, and turn clockwise.');
      var acute = b <= 90 ? b : b <= 180 ? 180 - b : b <= 270 ? b - 180 : 360 - b;
      if (!eqB(acute, b) && Math.abs(v - acute) <= tol + 1e-9) return wrong('geo-bearing-acute', 'That’s the angle from the north–south line. A true bearing is measured all the way round, <b>clockwise from north</b>.');
      if (o.back == null && Math.abs(n180(v - b - 180)) <= tol + 1e-9) return wrong('geo-bearing-reverse', 'That points the opposite way. Check which point you are measuring <b>from</b>.');
      return wrong('value', null);
    };
  };

  /* ---------------- angle-pair names ---------------- */
  var VOCAB = { corresponding: 'corr', correspond: 'corr', corr: 'corr', alternate: 'alt', alternating: 'alt', alt: 'alt', alternative: 'alt', interior: 'int', inside: 'int', inner: 'int', int: 'int', internal: 'int', between: 'int',
    exterior: 'ext', outside: 'ext', outer: 'ext', ext: 'ext', external: 'ext', same: 'same', side: 'side', sides: 'side', co: 'same', consecutive: 'same', allied: 'same', sameside: 'same', cointerior: 'same int', coexterior: 'same ext',
    vertically: 'vert', vertical: 'vert', vert: 'vert', opposite: 'opp', opp: 'opp', supplementary: 'supp', supp: 'supp', complementary: 'comp', comp: 'comp', adjacent: 'adj', linear: 'lin', straight: 'lin',
    f: 'L:F', z: 'L:Z', c: 'L:C', u: 'L:C', x: 'L:X' };
  var STOP = { angles: 1, angle: 1, pair: 1, pairs: 1, the: 1, of: 1, a: 1, an: 1, are: 1, they: 1, on: 1, to: 1, and: 1, lines: 1, line: 1, transversal: 1, transversals: 1, is: 1, it: 1, its: 1, them: 1, these: 1, those: 1, shape: 1, shaped: 1, s: 1, parallel: 1 };
  function lev(a, b) { var m = a.length, n = b.length, d = [], i, j; for (i = 0; i <= m; i++) { d[i] = [i]; } for (j = 1; j <= n; j++) d[0][j] = j; for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
  function word(w) {
    if (VOCAB[w] != null) return VOCAB[w];
    if (w.length >= 4) { var hit = null; Object.keys(VOCAB).forEach(function (k) { if (!hit && k.length >= 6 && k.indexOf(w) === 0) hit = VOCAB[k]; }); if (hit) return hit; }   // a short form: "altern", "oppo"
    var best = null, bd = 99; Object.keys(VOCAB).forEach(function (k) { if (k.length < 5) return; var d = lev(w, k), lim = k.length >= 8 ? 2 : 1; if (d <= lim && d < bd) { bd = d; best = VOCAB[k]; } });
    return best;
  }
  G.pairOf = function (text) {
    var s = String(text == null ? '' : text).toLowerCase().replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/co-/g, 'co ').replace(/same-side/g, 'same side').replace(/[-_\/]/g, ' ').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!s) return { empty: true };
    var f2 = {}, letters = [], unknown = [];
    s.split(' ').forEach(function (w) { if (STOP[w] && w !== 's') return; if (w === 's') return; var m = word(w); if (!m) { unknown.push(w); return; } m.split(' ').forEach(function (x) { if (x.indexOf('L:') === 0) letters.push(x.slice(2)); else f2[x] = 1; }); });
    if (f2.side && !f2.same) f2.same = 1;
    var fam = (f2.int ? 1 : 0) + (f2.ext ? 1 : 0);
    if (f2.corr && !f2.alt && !f2.vert && !f2.same) return { id: 'corresponding' };
    if (f2.vert || (f2.opp && !f2.alt && !fam && !f2.corr)) return { id: 'vert-opp' };
    if (f2.alt && fam === 1 && !f2.same) return { id: f2.int ? 'alt-int' : 'alt-ext' };
    if (f2.same && fam === 1 && !f2.alt) return { id: f2.int ? 'int-same' : 'ext-same' };
    if (f2.alt && !fam) return { ambiguous: 'alt' };
    if (fam === 1 && !f2.alt && !f2.same && !f2.corr) return { ambiguous: f2.int ? 'int' : 'ext' };
    if (f2.supp || f2.lin || f2.adj) return { id: 'linear' };
    if (f2.comp) return { id: 'complementary' };
    if (letters.length && !Object.keys(f2).length) return { ambiguous: 'letter', letter: letters[0] };
    return { unknown: true, words: unknown };
  };
  var NAME_LIST = 'corresponding, alternate interior, alternate exterior, interior on the same side, exterior on the same side, or vertically opposite';
  function pairWhy(target, got) {
    var side = { corresponding: 'same', 'alt-int': 'opp', 'alt-ext': 'opp', 'int-same': 'same', 'ext-same': 'same' }, where = { corresponding: 'mix', 'alt-int': 'in', 'alt-ext': 'out', 'int-same': 'in', 'ext-same': 'out' };
    if (target === 'vert-opp') return 'These two angles are at the <b>same crossing</b>, across from each other.';
    if (got === 'vert-opp') return 'Vertically opposite angles are at the <b>same</b> crossing. These are at <b>different</b> crossings.';
    if (got === 'linear' || got === 'complementary') return 'Name the pair by <b>where</b> the angles are: at different crossings of the transversal, inside or outside the two lines.';
    if (target === 'corresponding') return 'These are in the <b>same position</b> at each crossing (they make an F shape): ' + (got === 'alt-int' || got === 'alt-ext' ? 'alternate angles are on <b>opposite</b> sides of the transversal.' : 'one is inside the lines and one is outside.');
    if (got === 'corresponding') return 'Corresponding angles are in the same position at each crossing. These are not: look at which side of the transversal each one is on, and whether it is between the lines.';
    if (side[target] !== side[got]) return 'Same side of the transversal, or <b>opposite</b> sides? Look again (alternate = opposite sides, a Z shape).';
    if (where[target] !== where[got]) return '<b>Interior</b> means between the two lines; <b>exterior</b> means outside them. Where are these angles?';
    return null;
  }
  G.pairChk = function (target, o) {
    o = o || {}; var accept = [target].concat(o.accept || []);
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var p = G.pairOf(resp);
      if (p.empty) return form('empty', 'Type the name of the angle pair.');
      if (p.ambiguous === 'alt') return form('geo-pair-alt', '<b>Alternate interior</b> or <b>alternate exterior</b>? Say which.');
      if (p.ambiguous === 'int') return form('geo-pair-int', 'Interior <b>on the same side</b>, or <b>alternate</b> interior? Say which.');
      if (p.ambiguous === 'ext') return form('geo-pair-ext', 'Exterior <b>on the same side</b>, or <b>alternate</b> exterior? Say which.');
      if (p.ambiguous === 'letter') return form('geo-pair-letter', 'Good eye for the shape! Now write the <b>name</b> of the pair (' + NAME_LIST + ').');
      if (p.unknown) return form('geo-pair-unknown', 'Use one of the names: ' + NAME_LIST + '.');
      if (accept.indexOf(p.id) >= 0) return ok();
      return wrong('geo-pair-' + p.id, pairWhy(target, p.id));
    };
  };

  /* ======================================== part builders ======================================== */
  var P = G.P = {};
  P.angle = function (prompt, deg, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', after: '°', nr: !!o.nr }, check: G.angleChk(deg, o), key: fmtDeg(deg), answer: t(fmtDeg(deg) + '^\\circ'), solution: o.sol, hints: o.hints || [], text: o.text };
  };
  P.bearing = function (prompt, deg, o) {
    o = o || {}; var k = bearingText(deg);
    return { prompt: prompt, input: { type: 'number', after: '°' }, check: G.bearingChk(deg, o), key: k, answer: t(k + '^\\circ'), solution: o.sol, hints: o.hints || [], text: o.text };
  };
  P.pair = function (prompt, target, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label || 'Pair:', name: 'Pair name', mode: 'text', wide: true, placeholder: o.placeholder || 'e.g. alternate exterior' }] },
      check: G.pairChk(target, o), key: [PAIR_SHORT[target] || target], answer: '<b>' + (PAIR_NAMES[target] || target) + '</b>', solution: o.sol, hints: o.hints || [], text: o.text };
  };
  P.pairMC = function (r, prompt, target, o) {
    o = o || {}; var ids = o.ids || ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'];
    if (ids.length > 5) { // K.mc has five letter keys (A–E): keep the answer and four others, in the usual order
      var others = ids.filter(function (id) { return id !== target; }), drop = {};
      while (others.length > 4) { var k = r && r.int ? r.int(0, others.length - 1) : others.length - 1; drop[others[k]] = 1; others.splice(k, 1); }
      ids = ids.filter(function (id) { return !drop[id]; });
    }
    var opts = ids.map(function (id) { return { html: PAIR_SHORT[id], right: id === target, why: id === target ? null : pairWhy(target, id), code: 'pair-' + id }; });
    var part = K.P.mc(r, prompt, opts, o.sol, o.hints, o.text, o.keepOrder !== false);
    part.input.columns = o.columns || 2;
    return part;
  };
  G.kindOf = function (deg) { return deg < 90 ? 'acute' : Math.abs(deg - 90) < 1e-9 ? 'right' : deg < 180 ? 'obtuse' : Math.abs(deg - 180) < 1e-9 ? 'straight' : 'reflex'; };
  P.classify = function (r, prompt, deg, o) {
    o = o || {}; var kind = G.kindOf(deg), WHY = { acute: 'Acute angles are less than 90°.', right: 'A right angle is exactly 90° (a square corner).', obtuse: 'Obtuse angles are between 90° and 180°.', straight: 'A straight angle is exactly 180° (a straight line).', reflex: 'Reflex angles are more than 180°.' };
    var opts = ['acute', 'right', 'obtuse', 'straight', 'reflex'].map(function (k) { return { html: k, right: k === kind, why: k === kind ? null : 'Compare with 90° and 180°. ' + WHY[k], code: 'kind-' + k }; });
    var part = K.P.mc(r, prompt, opts, o.sol, o.hints, o.text, true);
    part.input.columns = 5;
    return part;
  };

  /* ======================================== Units 6–7: similarity, scale, right triangles ======================================== */
  var OPP = RED, ADJ = BLUE, HYP = '#9a6a24', ROLE_COL = { opp: OPP, adj: ADJ, hyp: HYP }, MATCH = [BLUE, RED, GREEN, AMBER, PURPLE, '#0f8ea8', '#b8457a', '#5b6b2e'];
  G.ROLE_COLORS = ROLE_COL;
  function fmtN(v, dp) { dp = dp == null ? 1 : dp; var p = Math.pow(10, dp), r = Math.round(v * p + (v >= 0 ? 1e-9 : -1e-9)) / p; return String(r === 0 ? 0 : r); }
  G.fmtLen = fmtN;
  function bbox(P) { var b = [Infinity, Infinity, -Infinity, -Infinity]; P.forEach(function (p) { b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); }); return b; }
  function dirTo(V, Q) { return n360(Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) / RAD); }
  function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
  function cen(P) { var x = 0, y = 0; P.forEach(function (p) { x += p[0] / P.length; y += p[1] / P.length; }); return [x, y]; }
  function polyD(P) { return 'M' + P.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + 'Z'; }
  function isRed(s) { return s === '?' || /^[a-zA-Zθ]$/.test(String(s)); }
  /* a label beside segment PQ away from C; size, color, stack (extra px further out). Returns the distance used (for stacking) */
  function sideLab(cv, P, Q, C, s, o) {
    o = o || {}; var M = mid(P, Q), n = at([0, 0], dirTo(P, Q) + 90, 1);
    if ((C[0] - M[0]) * n[0] + (C[1] - M[1]) * n[1] > 0) n = [-n[0], -n[1]];
    if (o.inside) n = [-n[0], -n[1]];
    var size = o.size || 15, ext = Math.abs(n[0]) * (String(s).length * size * 0.3 + 3) + Math.abs(n[1]) * size * 0.58, d = (o.gap == null ? 7 : o.gap) + (o.stack || 0) + ext;
    cv.text(M[0] + n[0] * d, M[1] + n[1] * d, s, { size: size, color: o.color || (isRed(s) && o.redUnknown !== false && s === '?' ? RED : INK), weight: o.weight || 700 });
    return d + ext;
  }
  /* interior wedge of polygon P (screen) at vertex i */
  function ccwScr(P) { var s = 0; for (var i = 0; i < P.length; i++) { var p = P[i], q = P[(i + 1) % P.length]; s += p[0] * -q[1] - q[0] * -p[1]; } return s > 0; }
  function cornerAt(P, i) { var n = P.length, V = P[i], dn = dirTo(V, P[(i + 1) % n]), dp = dirTo(V, P[(i + n - 1) % n]); return ccwScr(P) ? { start: dn, span: n360(dp - dn) } : { start: dp, span: n360(dn - dp) }; }
  function rightSq(cv, V, start, s, colr) { var u = at([0, 0], start, 1), v = at([0, 0], start + 90, 1); cv.path('M' + f(V[0] + u[0] * s) + ' ' + f(V[1] + u[1] * s) + 'L' + f(V[0] + (u[0] + v[0]) * s) + ' ' + f(V[1] + (u[1] + v[1]) * s) + 'L' + f(V[0] + v[0] * s) + ' ' + f(V[1] + v[1] * s), { stroke: colr || INK, width: 1.5, cap: 'butt' }); }
  /* world (metres, y up) → px, fitted to w × h px */
  function world(P, w, h) { var b = bbox(P), s = Math.min(w / Math.max(b[2] - b[0], 1e-6), h / Math.max(b[3] - b[1], 1e-6)); var W = { s: s, X: function (x) { return (x - b[0]) * s; }, Y: function (y) { return (b[3] - y) * s; } }; W.P = function (p) { return [W.X(p[0]), W.Y(p[1])]; }; return W; }
  function ground(cv, W, x0, x1) { var y = W.Y(0); cv.line([W.X(x0), y], [W.X(x1), y], { color: '#8a6f4d', width: 2.4 }); var d = ''; for (var x = W.X(x0) + 4; x < W.X(x1); x += 11) d += 'M' + f(x) + ' ' + f(y + 1) + 'l-6 7'; cv.path(d, { stroke: '#8a6f4d', width: 1, opacity: 0.6 }, [[W.X(x0), y + 8]]); }
  /* a dimension line (arrows both ends) off world segment PQ by off px (+ = left of P→Q) with a label */
  function dim(cv, W, P, Q, s, off, colr) {
    var p = W.P(P), q = W.P(Q), th = dirTo(p, q), n = at([0, 0], th + 90, 1), A = [p[0] + n[0] * off, p[1] + n[1] * off], B = [q[0] + n[0] * off, q[1] + n[1] * off];
    colr = colr || '#3a4254'; cv.line(A, B, { color: colr, width: 1.2 }); arrow(cv, A, th + 180, { color: colr, L: 7, w: 3.2 }); arrow(cv, B, th, { color: colr, L: 7, w: 3.2 });
    if (s == null || s === '' || s === false) return;
    var sg = off < 0 ? -1 : 1, M = mid(A, B), ext = Math.abs(n[0]) * (String(s).length * 15 * 0.3 + 3) + Math.abs(n[1]) * 15 * 0.6 + 2;
    cv.text(M[0] + n[0] * ext * sg, M[1] + n[1] * ext * sg, s, { size: 15, weight: 700, color: isRed(s) ? RED : colr });
  }
  /* small pictures (world coords): person (eye height h), tree, building, tower, pole, flag, stick, lighthouse, cliff, boat */
  function thing(cv, W, kind, x, h, o) {
    o = o || {}; var s = W.s, P = W.P;
    if (kind === 'person') {
      var tot = h / 0.93, hr = tot * 0.075, lw = Math.max(1.6, tot * 0.03 * s);
      cv.path('M' + f(W.X(x)) + ' ' + f(W.Y(tot - 2 * hr)) + 'L' + f(W.X(x)) + ' ' + f(W.Y(tot * 0.47)) + 'M' + f(W.X(x - tot * 0.12)) + ' ' + f(W.Y(0)) + 'L' + f(W.X(x)) + ' ' + f(W.Y(tot * 0.47)) + 'L' + f(W.X(x + tot * 0.12)) + ' ' + f(W.Y(0)) + 'M' + f(W.X(x - tot * 0.16)) + ' ' + f(W.Y(tot * 0.58)) + 'L' + f(W.X(x)) + ' ' + f(W.Y(tot * 0.76)) + 'L' + f(W.X(x + tot * 0.16)) + ' ' + f(W.Y(tot * 0.58)), { stroke: '#3a4254', width: lw }, [P([x - tot * 0.16, 0]), P([x + tot * 0.16, tot])]);
      cv.raw('<circle cx="' + f(W.X(x)) + '" cy="' + f(W.Y(tot - hr)) + '" r="' + f(Math.max(2.5, hr * s)) + '" fill="#fff" stroke="#3a4254" stroke-width="' + f(Math.max(1.2, lw * 0.8)) + '"/>', [P([x, tot])]);
      return { xr: tot * 0.16 };
    }
    if (kind === 'tree') { var tw = Math.max(h * 0.07, 0.15); cv.raw('<rect x="' + f(W.X(x - tw / 2)) + '" y="' + f(W.Y(h * 0.45)) + '" width="' + f(tw * s) + '" height="' + f(h * 0.45 * s) + '" fill="#8a5a2b"/><ellipse cx="' + f(W.X(x)) + '" cy="' + f(W.Y(h * 0.67)) + '" rx="' + f(h * 0.24 * s) + '" ry="' + f(h * 0.33 * s) + '" fill="#7fb36f" stroke="#3f7535" stroke-width="1.2"/>', [P([x - h * 0.24, 0]), P([x + h * 0.24, h])]); return { xr: h * 0.24 }; }
    if (kind === 'building' || kind === 'elevator') { var bw = o.w || h * 0.4, x0 = (o.side || 1) > 0 ? x : x - bw; cv.raw('<rect x="' + f(W.X(x0)) + '" y="' + f(W.Y(h)) + '" width="' + f(bw * s) + '" height="' + f(h * s) + '" fill="#dde1e8" stroke="#6a7182" stroke-width="1.2"/>', [P([x0, 0]), P([x0 + bw, h])]); return { xr: (o.side || 1) > 0 ? bw : 0 }; }
    if (kind === 'tower') { var b2 = h * 0.1, d = 'M' + f(W.X(x - b2 / 2)) + ' ' + f(W.Y(0)) + 'L' + f(W.X(x)) + ' ' + f(W.Y(h)) + 'L' + f(W.X(x + b2 / 2)) + ' ' + f(W.Y(0)); for (var i = 1; i < 5; i++) { var y1 = h * i / 5, w1 = b2 / 2 * (1 - i / 5), y0 = h * (i - 1) / 5, w0 = b2 / 2 * (1 - (i - 1) / 5); d += 'M' + f(W.X(x - w0)) + ' ' + f(W.Y(y0)) + 'L' + f(W.X(x + w1)) + ' ' + f(W.Y(y1)) + 'M' + f(W.X(x + w0)) + ' ' + f(W.Y(y0)) + 'L' + f(W.X(x - w1)) + ' ' + f(W.Y(y1)); } cv.path(d, { stroke: PURPLE, width: 1.5 }, [P([x - b2 / 2, 0]), P([x + b2 / 2, h])]); return { xr: b2 / 2 }; }
    if (kind === 'lighthouse') { var lw2 = h * 0.16; cv.path(polyD([P([x - lw2 / 2, 0]), P([x - lw2 * 0.3, h]), P([x + lw2 * 0.3, h]), P([x + lw2 / 2, 0])]), { stroke: '#6a7182', width: 1.2, fill: '#fff' }, [P([x - lw2 / 2, 0]), P([x + lw2 / 2, h])]); cv.path(polyD([P([x - lw2 * 0.4, h * 0.4]), P([x - lw2 * 0.36, h * 0.6]), P([x + lw2 * 0.36, h * 0.6]), P([x + lw2 * 0.4, h * 0.4])]), { fill: RED }); return { xr: lw2 / 2 }; }
    if (kind === 'cliff') { var cw = o.w || h * 0.6; cv.path(polyD([P([x - cw, 0]), P([x - cw, h]), P([x, h]), P([x + h * 0.05, h * 0.5]), P([x, 0])]), { stroke: '#7a6248', width: 1.2, fill: '#d7c29e' }, [P([x - cw, 0]), P([x, h])]); return { xr: 0 }; }
    if (kind === 'boat') { var L = o.size || 4; cv.path(polyD([P([x - L / 2, L * 0.22]), P([x + L / 2, L * 0.22]), P([x + L * 0.35, 0]), P([x - L * 0.35, 0])]), { stroke: '#6a4a2a', width: 1.2, fill: '#b98552' }, [P([x - L / 2, 0]), P([x + L / 2, L * 0.8])]); cv.line(P([x, L * 0.22]), P([x, L * 0.8]), { color: '#3a4254', width: 1.4 }); return { xr: L / 2 }; }
    if (kind === 'plane') { var L2 = o.size || 6; cv.path(polyD([P([x - L2 / 2, h]), P([x + L2 / 2, h + L2 * 0.06]), P([x + L2 / 2, h - L2 * 0.06])]), { stroke: '#3a4254', width: 1.2, fill: '#dfe3ea' }, [P([x - L2 / 2, h - L2 * 0.3]), P([x + L2 / 2, h + L2 * 0.3])]); cv.path('M' + f(W.X(x)) + ' ' + f(W.Y(h)) + 'L' + f(W.X(x - L2 * 0.18)) + ' ' + f(W.Y(h + L2 * 0.3)) + 'M' + f(W.X(x)) + ' ' + f(W.Y(h)) + 'L' + f(W.X(x - L2 * 0.18)) + ' ' + f(W.Y(h - L2 * 0.3)), { stroke: '#3a4254', width: 1.6 }); return { xr: 0 }; }
    // pole, flag, stick, post, ladder top…
    cv.line(P([x, 0]), P([x, h]), { color: kind === 'stick' ? '#8a5a2b' : '#3a4254', width: kind === 'stick' ? 3 : 2.4 });
    if (kind === 'flag') { var fl = (o.side || 1) * Math.min(h * 0.22, 2.2); cv.path(polyD([P([x, h]), P([x + fl, h * 0.95]), P([x, h * 0.9])]), { fill: RED }, [P([x + fl, h])]); return { xr: Math.max(0, fl) }; }
    return { xr: 0 };
  }

  /* ---------------- similar figures ---------------- */
  var SHAPES = G.SHAPES = {
    tri: [[0, 0], [4, 0], [1, 3]], right: [[0, 0], [4, 0], [0, 3]], iso: [[0, 0], [4, 0], [2, 3]], rect: [[0, 0], [4, 0], [4, 2], [0, 2]], square: [[0, 0], [3, 0], [3, 3], [0, 3]],
    L: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]], trap: [[0, 0], [5, 0], [4, 2], [1, 2]], para: [[0, 0], [4, 0], [5, 2], [1, 2]], kite: [[2, 0], [3.5, 2.5], [2, 4], [0.5, 2.5]],
    house: [[0, 0], [4, 0], [4, 2], [2, 4], [0, 2]], pent: [[0, 0], [3, 0], [4, 2], [1.5, 3.5], [-1, 2]], arrow: [[0, 1], [3, 1], [3, 0], [5, 2], [3, 4], [3, 3], [0, 3]]
  };
  function shapeOf(o) { return (o.pts || SHAPES[o.shape] || SHAPES.tri).map(function (p) { return [p[0], p[1]]; }); }
  function names(x, n) { if (!x) return null; var a = Array.isArray(x) ? x.slice() : (String(x).match(/[A-Za-z][′'’″]*/g) || []); return a.slice(0, n); }
  function sideLens(P) { return P.map(function (p, i) { return dist(p, P[(i + 1) % P.length]); }); }
  /* one polygon (math coords) drawn at scale u with its top-left at (x0, y0) after rotation / flip; returns screen points */
  function placePoly(P, u, x0, yBase, rot, flip) {
    var c = Math.cos((rot || 0) * RAD), s = Math.sin((rot || 0) * RAD);
    var Q = P.map(function (p) { var x = flip ? -p[0] : p[0], y = p[1]; return [x * c - y * s, x * s + y * c]; }), b = bbox(Q);
    return Q.map(function (p) { return [x0 + (p[0] - b[0]) * u, yBase - (p[1] - b[1]) * u]; });
  }
  function drawPolyFig(cv, Sp, o, which, lens) {
    var n = Sp.length, ccw = ccwScr(Sp), nm = o.nm, size = o.size || 15;
    cv.path(polyD(Sp), { fill: which ? '#fbf1de' : '#e9edf4' }, Sp);
    Sp.forEach(function (p, i) { cv.line(p, Sp[(i + 1) % n], { color: o.match ? MATCH[i % MATCH.length] : INK, width: 2.4 }); });
    Sp.forEach(function (p, i) {
      var lab = o.labels === false || o.labels == null ? null : Array.isArray(o.labels) ? (o.labels[which] || [])[i] : fmtN(lens[i], o.dp) + (o.units ? ' ' + o.units : '');
      var inPt = at(mid(p, Sp[(i + 1) % n]), dirTo(p, Sp[(i + 1) % n]) + (ccw ? 90 : -90), 10);   // a point just inside this side (works for concave shapes too)
      if (lab != null && lab !== '') sideLab(cv, p, Sp[(i + 1) % n], inPt, String(lab), { size: size, color: lab === '?' ? RED : o.match ? MATCH[i % MATCH.length] : INK });
    });
    var angs = o.angles === true ? null : Array.isArray(o.angles) ? o.angles[which] : null;
    var shortest = Math.min.apply(null, Sp.map(function (p, i) { return dist(p, Sp[(i + 1) % n]); }));
    if (o.angles) Sp.forEach(function (p, i) { var cn = cornerAt(Sp, i), lab = angs ? angs[i] : (shortest >= 44 ? fmtDeg(cn.span) + '°' : null); if (o.angles === true || (lab != null && lab !== '')) mark(cv, p, cn.start, cn.start + cn.span, { label: lab, size: 13, color: o.match ? MATCH[(i + 3) % MATCH.length] : INK, r: Math.max(8, Math.min(16, shortest * 0.3)), rs: Math.max(6, Math.min(11, shortest * 0.2)) }); });
    if (nm) Sp.forEach(function (p, i) { if (!nm[i]) return; var cn = cornerAt(Sp, i), q = at(p, cn.start + cn.span / 2 + 180, 13); cv.text(q[0], q[1], nm[i], { size: size + 1, weight: 700, italic: false }); });
  }
  /* HW.geo.similarSVG({ shape | pts, k 2, drawK (drawn size; default k), names: ['ABCD', 'PQRS'], labels true | [[orig…], [image…]],
   *   units, dp 1, angles false | true | [[…], […]], matchColors false, rot 0 / flip false (the image turned or mirrored, to practise
   *   naming in matching order), unit (px per unit), gap, width 420 }) */
  G.similarSVG = function (o) {
    o = o || {}; var P = shapeOf(o), n = P.length, k = o.k == null ? 2 : o.k, dk = o.drawK || k, cv = new Canvas();
    var b = bbox(P), w0 = b[2] - b[0], h0 = b[3] - b[1], u = o.unit || Math.min(34, 150 / Math.max(w0, h0), 300 / (w0 * (1 + dk)));
    var lmax = 0; if (o.labels === true) L0max(); else if (Array.isArray(o.labels)) o.labels.forEach(function (arr) { (arr || []).forEach(function (x) { lmax = Math.max(lmax, String(x == null ? '' : x).length); }); });
    function L0max() { sideLens(P).forEach(function (l) { lmax = Math.max(lmax, (fmtN(l * Math.max(1, k), o.dp) + (o.units ? ' ' + o.units : '')).length); }); }
    var lw = lmax * (o.size || 15) * 0.62, gap = o.gap == null ? 28 + 2 * lw : o.gap, base = Math.max(h0, h0 * dk) * u;
    var A = placePoly(P, u, 0, base, 0, false), B = placePoly(P, u * dk, w0 * u + gap, base, o.rot, o.flip);
    var opt = { match: !!o.matchColors, labels: o.labels, units: o.units, dp: o.dp, angles: o.angles, size: o.size };
    var L0 = sideLens(P);
    drawPolyFig(cv, A, Object.assign({}, opt, { nm: names(o.names && o.names[0], n) }), 0, L0);
    drawPolyFig(cv, B, Object.assign({}, opt, { nm: names(o.names && o.names[1], n) }), 1, L0.map(function (l) { return l * k; }));
    return cv.svg({ width: o.width || 420, aria: o.aria || 'two similar figures' });
  };

  /* ---------------- right triangles ---------------- */
  G.rightSides = function (o) {
    var a = o.a, b = o.b, c = o.c;
    if (a != null && b != null) c = Math.sqrt(a * a + b * b); else if (a != null && c != null) b = Math.sqrt(Math.max(0, c * c - a * a)); else if (b != null && c != null) a = Math.sqrt(Math.max(0, c * c - b * b));
    else if (o.A != null && (a != null || b != null || c != null)) { var tt = o.A * RAD; if (a != null) { b = a / Math.tan(tt); c = a / Math.sin(tt); } else if (b != null) { a = b * Math.tan(tt); c = b / Math.cos(tt); } else { a = c * Math.sin(tt); b = c * Math.cos(tt); } }
    else { a = a == null ? 3 : a; b = b == null ? 4 : b; c = Math.sqrt(a * a + b * b); }
    return { a: a, b: b, c: c, A: Math.atan2(a, b) / RAD, B: Math.atan2(b, a) / RAD };
  };
  G.rolesFor = function (theta) { return theta === 'B' ? { opp: 'b', adj: 'a', hyp: 'c' } : { opp: 'a', adj: 'b', hyp: 'c' }; };
  /* HW.geo.rightTriSVG({ a, b, c (any two, or one side and A), right 'br'|'bl'|'tr'|'tl', rot 0 (any degrees), flip, names ['A','B','C'] |
   *   false, sides: { a: '12 cm', b: 'x', c: '?' } | true (lengths), units, dp 1, angles: { A: '35°', B: '?' }, theta 'A'|'B',
   *   thetaLabel 'θ', roles false | true | ['opp','hyp'] (opp/adj/hyp tags beyond the length labels), long false (words),
   *   highlight (colour the sides by role; default on with roles), unknown 'a'|'b'|'c'|'A'|'B' ('?' in red), squares false,
   *   size 15, px 200 (longest extent), width 300 }) — any orientation, the right-angle square at C. */
  G.rightTriSVG = function (o) {
    o = o || {}; var sd = G.rightSides(o), cv = new Canvas(), R = o.right || 'br', sx = R[1] === 'l' ? 1 : -1, sy = R[0] === 'b' ? 1 : -1;
    var V = { C: [0, 0], A: [sx * sd.b, 0], B: [0, sy * sd.a] }, rot = (o.rot || 0) * RAD, cr = Math.cos(rot), sr = Math.sin(rot);
    Object.keys(V).forEach(function (key) { var x = V[key][0], y = V[key][1]; if (o.flip) x = -x; V[key] = [x * cr - y * sr, x * sr + y * cr]; });
    var b0 = bbox([V.A, V.B, V.C]), u = (o.px || (o.squares ? 110 : 200)) / Math.max(b0[2] - b0[0], b0[3] - b0[1]);
    Object.keys(V).forEach(function (key) { V[key] = [V[key][0] * u, -V[key][1] * u]; });
    var C0 = cen([V.A, V.B, V.C]), ends = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] }, size = o.size || 15, theta = o.theta || null;
    var roles = o.roles === true ? ['opp', 'adj', 'hyp'] : Array.isArray(o.roles) ? o.roles : [], RL = theta ? G.rolesFor(theta) : null, hl = o.highlight == null ? roles.length > 0 : o.highlight;
    var roleOf = {}; if (RL) Object.keys(RL).forEach(function (r) { roleOf[RL[r]] = r; });
    if (o.squares) [['a', 'B', 'C', 'A'], ['b', 'A', 'C', 'B'], ['c', 'A', 'B', 'C']].forEach(function (z, i) {
      var P = V[z[1]], Q = V[z[2]], Rr = V[z[3]], d = [Q[0] - P[0], Q[1] - P[1]], nn = [-d[1], d[0]], M = mid(P, Q); if ((Rr[0] - M[0]) * nn[0] + (Rr[1] - M[1]) * nn[1] > 0) nn = [d[1], -d[0]];
      var Sq = [P, Q, [Q[0] + nn[0], Q[1] + nn[1]], [P[0] + nn[0], P[1] + nn[1]]], colr = [OPP, ADJ, HYP][i]; cv.path(polyD(Sq), { stroke: colr, width: 1.6, fill: colr, fillOpacity: 0.1 }, Sq);
      var cc = cen(Sq); cv.text(cc[0], cc[1], z[0] + '²', { size: size, color: colr, italic: false });
    });
    cv.path(polyD([V.A, V.B, V.C]), { fill: '#f6f2ea' }, [V.A, V.B, V.C]);
    ['a', 'b', 'c'].forEach(function (s) { cv.line(V[ends[s][0]], V[ends[s][1]], { color: hl && RL && roleOf[s] && (roles.indexOf(roleOf[s]) >= 0 || o.highlight === true) ? ROLE_COL[roleOf[s]] : INK, width: 2.6 }); });
    var dA = dirTo(V.C, V.A), dB = dirTo(V.C, V.B); rightSq(cv, V.C, n360(dB - dA) < 180 ? dA : dB, 12);
    var nm = o.names === false ? null : (o.names || ['A', 'B', 'C']);
    if (nm) ['A', 'B', 'C'].forEach(function (v, i) { if (!nm[i]) return; var P = V[v], q = at(P, dirTo(C0, P), 15); cv.text(q[0], q[1], nm[i], { size: size + 1, weight: 700, italic: false }); });
    var angLab = Object.assign({}, o.angles || {}); if (o.unknown === 'A' || o.unknown === 'B') angLab[o.unknown] = angLab[o.unknown] || '?';
    if (theta) angLab[theta] = angLab[theta] || o.thetaLabel || 'θ';
    Object.keys(angLab).forEach(function (v) { if (v === 'C') return; var others = ['A', 'B', 'C'].filter(function (x) { return x !== v; }); mark(cv, V[v], dirTo(V[v], V[others[0]]), dirTo(V[v], V[others[1]]), { label: angLab[v], size: size, color: angLab[v] === '?' ? RED : (v === theta ? AMBER : INK), r: 24 }); });
    var sideTxt = {};
    ['a', 'b', 'c'].forEach(function (s) { var want = o.sides === true ? true : (o.sides || {})[s]; if (o.unknown === s && want == null) want = '?'; if (want == null || want === false) return; sideTxt[s] = want === true ? fmtN(sd[s], o.dp) + (o.units ? ' ' + o.units : '') : String(want); });
    var tagTxt = o.long ? { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' } : { opp: 'opp', adj: 'adj', hyp: 'hyp' };
    ['a', 'b', 'c'].forEach(function (s) {
      var P = V[ends[s][0]], Q = V[ends[s][1]], used = 0;
      if (sideTxt[s]) used = sideLab(cv, P, Q, C0, sideTxt[s], { size: size + 1, color: sideTxt[s] === '?' || (o.unknown === s) ? RED : INK, gap: o.squares ? 4 : 7 }) - 7;
      var r = RL && roleOf[s]; if (r && roles.indexOf(r) >= 0) sideLab(cv, P, Q, C0, tagTxt[r], { size: 13, color: ROLE_COL[r], weight: 800, stack: o.squares ? 0 : used + 4, inside: !!o.squares });
    });
    return cv.svg({ width: o.width || 300, aria: o.aria || 'right triangle' });
  };

  /* ---------------- angles of elevation / depression ---------------- */
  /* HW.geo.elevationSVG({ kind 'elevation'|'depression', angle, dist, height, eye 1.6 (0 = from the ground), labels: { angle, dist,
   *   height, eye }, observer 'person'|'none'|'cliff'|'lighthouse'|'building', target 'tree'|'building'|'tower'|'flag'|'pole'|'plane'|'boat',
   *   units 'm', alt false, horizontal true, width 360 }) */
  G.elevationSVG = function (o) {
    o = o || {}; var dep = o.kind === 'depression', D = o.dist == null ? 20 : o.dist, eye = o.eye == null ? (dep ? 0 : 1.6) : o.eye, lb = o.labels || {}, units = o.units == null ? 'm' : o.units;
    var ang = o.angle != null ? o.angle : Math.atan2(dep ? (o.height == null ? 30 : o.height) : (o.height == null ? 15 : o.height) - eye, D) / RAD;
    var rise = D * Math.tan(ang * RAD), eyeY = dep ? rise : eye, topY = dep ? 0 : eye + rise, obs = o.observer || (dep ? 'cliff' : 'person'), tgt = o.target || (dep ? 'boat' : 'tree');
    var W = world([[-D * 0.1, 0], [D * 1.1, 0], [0, Math.max(eyeY, topY) * 1.06]], 300, 190), cv = new Canvas(), us = function (v) { return fmtN(v) + (units ? ' ' + units : ''); };
    if (dep && obs === 'cliff') thing(cv, W, 'cliff', 0, eyeY - eye, { w: D * 0.1 });
    if (dep && obs === 'lighthouse') thing(cv, W, 'lighthouse', 0, eyeY - eye);
    if (dep && obs === 'building') thing(cv, W, 'building', 0, eyeY - eye, { side: -1, w: D * 0.1 });
    ground(cv, W, -D * 0.1, D * 1.1);
    if (!dep && obs === 'person') thing(cv, W, 'person', 0, eye);
    var xr = 0; if (!dep) xr = thing(cv, W, tgt, D, topY, { side: 1, size: D * 0.1 }).xr; else thing(cv, W, tgt === 'boat' ? 'boat' : tgt, D, tgt === 'boat' ? 0 : 1.6, { size: Math.max(1.5, D * 0.05) });
    var E = W.P([0, eyeY]), T = W.P([D, topY]), Hz = W.P([D, eyeY]);
    if (o.horizontal !== false) { cv.line(E, Hz, { color: '#3a4254', width: 1.6, dash: '6 4' }); }
    cv.line(E, T, { color: AMBER, width: 2.4 }); arrow(cv, T, dirTo(E, T), { color: AMBER, L: 9, w: 4 });
    cv.dot(E, { r: 2.6 });
    if (!dep) { cv.line(T, W.P([D, 0]), { color: INK, width: 1.4, dash: '3 3', opacity: 0.6 }); rightSq(cv, Hz, 90, 9); } else { cv.line(W.P([0, 0]), E, { color: INK, width: 1.4, dash: '3 3', opacity: 0.6 }); rightSq(cv, W.P([0, 0]), 0, 9); }
    var dd = dirTo(E, T), aL = lb.angle == null ? fmtDeg(ang) + '°' : lb.angle;
    mark(cv, E, dep ? dd : 0, dep ? 0 : dd, { label: aL, size: 15, color: AMBER, r: 30 });
    if (dep && o.alt) { var tv = W.P([D, 0]); mark(cv, tv, dirTo(tv, E), 180, { label: lb.alt == null ? aL : lb.alt, size: 15, color: GREEN, r: 30 }); }
    if (lb.dist !== false) dim(cv, W, [0, 0], [D, 0], lb.dist == null ? us(D) : lb.dist, -18);
    if (!dep) { if (lb.height !== false) dim(cv, W, [D, eyeY], [D, topY], lb.height == null ? us(rise) : lb.height, -(10 + xr * W.s), RED); if (eye > 0 && lb.eye !== false) dim(cv, W, [0, 0], [0, eyeY], lb.eye == null ? us(eye) : lb.eye, 16); }
    else if (lb.height !== false) dim(cv, W, [0, 0], [0, eyeY], lb.height == null ? us(eyeY) : lb.height, 18, RED);
    return cv.svg({ width: o.width || 360, aria: o.aria || ('angle of ' + (dep ? 'depression' : 'elevation')) });
  };
  /* HW.geo.shadowSVG({ small: { h, shadow, kind 'person'|'stick'|'pole', label: { h, s } }, big: { h, shadow, kind 'tree'|'pole'|'flag'|'tower'|
   *   'building', label: { h: '?', s } }, units 'm', sunLabel, width 420 }) — two panels, parallel sun rays, the similar triangles shaded */
  G.shadowSVG = function (o) {
    o = o || {}; var sm = Object.assign({ h: 1.8, shadow: 2.4, kind: 'person' }, o.small || {}), bg = Object.assign({ shadow: 15, kind: 'tree' }, o.big || {});
    if (bg.h == null) bg.h = bg.shadow * sm.h / sm.shadow; var units = o.units == null ? 'm' : o.units, cv = new Canvas(), sun = Math.atan2(sm.h, sm.shadow) / RAD;
    var x = 0;
    [[sm, 120], [bg, 220]].forEach(function (pr, i) {
      var ob = pr[0], W0 = world([[0, 0], [ob.shadow, 0], [0, ob.h]], pr[1], 150), W = { s: W0.s, X: function (v) { return W0.X(v) + x; }, Y: function (v) { return W0.Y(v) + (150 - ob.h * W0.s); } }; W.P = function (p) { return [W.X(p[0]), W.Y(p[1])]; };
      var top = [0, ob.h], tip = [ob.shadow, 0], base = [0, 0];
      cv.path(polyD([W.P(base), W.P(top), W.P(tip)]), { fill: AMBER, fillOpacity: 0.16 });
      ground(cv, W, -ob.shadow * 0.08, ob.shadow * 1.08);
      if (ob.kind === 'person') thing(cv, W, 'person', 0, ob.h * 0.93); else thing(cv, W, ob.kind, 0, ob.h, { side: 1 });
      cv.line(W.P(base), W.P(tip), { color: '#4b4f5a', width: 4, opacity: 0.5 });
      var back = [-ob.shadow * 0.25, ob.h * 1.25]; cv.line(W.P(back), W.P(tip), { color: '#e0a100', width: 1.8 }); arrow(cv, mid(W.P(back), W.P(top)), dirTo(W.P(back), W.P(tip)), { color: '#e0a100', L: 8, w: 3.5 });
      rightSq(cv, W.P(base), 0, 8);
      if (o.sunLabel) mark(cv, W.P(tip), 180 - sun, 180, { label: o.sunLabel, size: 14, color: AMBER, r: 22 });
      var lb = ob.label || {};
      dim(cv, W, base, tip, lb.s == null ? fmtN(ob.shadow) + (units ? ' ' + units : '') : lb.s, -16);
      dim(cv, W, base, top, lb.h == null ? fmtN(ob.h) + (units ? ' ' + units : '') : lb.h, 14 + (ob.kind === 'person' ? ob.h * 0.17 * W.s : 0));
      x += pr[1] + 60; void i;
    });
    return cv.svg({ width: o.width || 420, aria: o.aria || 'two objects and their shadows' });
  };
  /* HW.geo.mirrorSVG({ eye 1.6, d1 2, d2 10, h, kind 'flag'|'pole'|'tree'|'building', labels: { eye, d1, d2, h }, units 'm', angleLabel, width 400 }) */
  G.mirrorSVG = function (o) {
    o = o || {}; var eye = o.eye == null ? 1.6 : o.eye, d1 = o.d1 == null ? 2 : o.d1, d2 = o.d2 == null ? 10 : o.d2, h = o.h == null ? eye * d2 / d1 : o.h, lb = o.labels || {}, units = o.units == null ? 'm' : o.units;
    var W = world([[-0.3, 0], [d1 + d2 * 1.05, 0], [0, Math.max(eye, h)]], 330, 170), cv = new Canvas(), us = function (v) { return fmtN(v) + (units ? ' ' + units : ''); };
    cv.path(polyD([W.P([0, 0]), W.P([0, eye]), W.P([d1, 0])]), { fill: BLUE, fillOpacity: 0.12 }); cv.path(polyD([W.P([d1, 0]), W.P([d1 + d2, h]), W.P([d1 + d2, 0])]), { fill: BLUE, fillOpacity: 0.12 });
    ground(cv, W, -0.3, d1 + d2 * 1.05); thing(cv, W, 'person', 0, eye); thing(cv, W, o.kind || 'flag', d1 + d2, h, { side: -1 });
    var M = W.P([d1, 0]), E = W.P([0, eye]), T = W.P([d1 + d2, h]);
    cv.raw('<rect x="' + f(M[0] - 9) + '" y="' + f(M[1] - 3) + '" width="18" height="5" rx="1.5" fill="#7fb3f0" stroke="' + BLUE + '" stroke-width="1.2"/>', [[M[0] - 9, M[1]], [M[0] + 9, M[1]]]);
    cv.line(T, M, { color: '#e0a100', width: 2 }); cv.line(M, E, { color: '#e0a100', width: 2 }); arrow(cv, mid(T, M), dirTo(T, M), { color: '#e0a100', L: 8, w: 3.5 }); arrow(cv, mid(M, E), dirTo(M, E), { color: '#e0a100', L: 8, w: 3.5 });
    mark(cv, M, 0, dirTo(M, T), { label: o.angleLabel || '', color: GREEN, r: 20, size: 14 }); mark(cv, M, dirTo(M, E), 180, { label: o.angleLabel || '', color: GREEN, r: 20, size: 14 });
    rightSq(cv, W.P([0, 0]), 0, 8); rightSq(cv, W.P([d1 + d2, 0]), 90, 8);
    dim(cv, W, [0, 0], [d1, 0], lb.d1 == null ? us(d1) : lb.d1, -26); dim(cv, W, [d1, 0], [d1 + d2, 0], lb.d2 == null ? us(d2) : lb.d2, -26);
    dim(cv, W, [0, 0], [0, eye], lb.eye == null ? us(eye) : lb.eye, 18); dim(cv, W, [d1 + d2, h], [d1 + d2, 0], lb.h == null ? us(h) : lb.h, 14);
    cv.text(M[0], M[1] + 12, 'mirror', { size: 12, color: BLUE, weight: 600 });
    return cv.svg({ width: o.width || 400, aria: o.aria || 'mirror method' });
  };

  /* ---------------- grid with a shape and its image; scale maps ---------------- */
  /* HW.geo.gridSVG({ cols 16, rows 9, cell 18, shape | pts (grid units, y up), at [1, 1], k 2, imageAt (default right of it), image true,
   *   names: ['ABC', 'A′B′C′'], width 380 }) */
  G.gridSVG = function (o) {
    o = o || {}; var cols = o.cols || 16, rows = o.rows || 9, cs = o.cell || 18, P = shapeOf(o), b = bbox(P), at0 = o.at || [1, 1], k = o.k == null ? 2 : o.k, cv = new Canvas();
    var T = function (q) { return [q[0] * cs, (rows - q[1]) * cs]; }, d = '';
    for (var i = 0; i <= cols; i++) d += 'M' + i * cs + ' 0V' + rows * cs; for (var j = 0; j <= rows; j++) d += 'M0 ' + j * cs + 'H' + cols * cs;
    cv.path(d, { stroke: '#d5dae3', width: 0.8 }, [[0, 0], [cols * cs, rows * cs]]);
    var orig = P.map(function (p) { return T([p[0] - b[0] + at0[0], p[1] - b[1] + at0[1]]); });
    var nm0 = names(o.names && o.names[0], P.length), nm1 = names(o.names && o.names[1], P.length);
    cv.path(polyD(orig), { stroke: INK, width: 2.2, fill: '#e9edf4' }, orig);
    var lab = function (S, nm) { if (nm) S.forEach(function (p, i) { var cn = cornerAt(S, i), q = at(p, cn.start + cn.span / 2 + 180, 10); cv.text(q[0], q[1], nm[i], { size: 13, weight: 700, italic: false }); }); };
    lab(orig, nm0);
    if (o.image !== false) {
      var ia = o.imageAt || [Math.min(cols - (b[2] - b[0]) * k, at0[0] + (b[2] - b[0]) + 2), at0[1]];
      var img = P.map(function (p) { return T([(p[0] - b[0]) * k + ia[0], (p[1] - b[1]) * k + ia[1]]); });
      cv.path(polyD(img), { stroke: BLUE, width: 2.2, fill: '#dbe7fb', fillOpacity: 0.7 }, img); lab(img, nm1);
    }
    return cv.svg({ width: o.width || 380, aria: o.aria || 'shapes on a grid', pad: 10 });
  };
  var UNIT_CM = { mm: 0.1, cm: 1, m: 100, km: 100000 };
  G.parseScale = function (sc) {
    var r;
    if (sc && typeof sc === 'object') r = { draw: sc.draw == null ? 1 : sc.draw, drawUnit: sc.drawUnit || 'cm', real: sc.real, realUnit: sc.realUnit || sc.units || 'm' };
    else {
      var s = String(sc || '1 cm : 1 m').replace(/(\d)[\s,](?=\d{3}\b)/g, '$1').trim(), m = /^([\d.]+)\s*(mm|cm|m|km)\s*(?::|=|represents|to|→)\s*([\d.]+)\s*(mm|cm|m|km)$/i.exec(s);
      if (m) r = { draw: +m[1], drawUnit: m[2].toLowerCase(), real: +m[3], realUnit: m[4].toLowerCase() };
      else if ((m = /^([\d.]+)\s*:\s*([\d.]+)$/.exec(s))) { var ratio = +m[2] / +m[1], ru = ratio >= 100000 ? 'km' : ratio >= 100 ? 'm' : 'cm'; r = { draw: 1, drawUnit: 'cm', real: ratio / UNIT_CM[ru], realUnit: ru, pure: true }; }
      else throw new Error('HW.geo.parseScale: cannot read ' + s);
    }
    r.ratio = (r.real * UNIT_CM[r.realUnit]) / (r.draw * UNIT_CM[r.drawUnit]); r.perCm = r.real / (r.draw * UNIT_CM[r.drawUnit]);
    r.text = r.pure ? '1 : ' + fmtN(r.ratio, 3).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : fmtN(r.draw, 3) + ' ' + r.drawUnit + ' represents ' + fmtN(r.real, 3) + ' ' + r.realUnit;
    return r;
  };
  /* HW.geo.scaleMapSVG({ scale '1 cm : 5 km', cmPx 30, w 10, h 6 (map size, cm), places: [{ name, at: [x, y] (cm from the lower left) }],
   *   routes: [{ from, to, label, dash, color }], bar true, title true, grid true, north true, width 380 }) */
  G.scaleMapSVG = function (o) {
    o = o || {}; var sc = G.parseScale(o.scale), u = o.cmPx || 30, Wc = o.w || 10, Hc = o.h || 6, cv = new Canvas(), byName = {};
    var T = function (q) { return [q[0] * u, (Hc - q[1]) * u]; };
    cv.raw('<rect x="0" y="0" width="' + Wc * u + '" height="' + Hc * u + '" rx="6" fill="#f6f3ea" stroke="#cfc6b0" stroke-width="1.2"/>', [[0, 0], [Wc * u, Hc * u]]);
    if (o.grid !== false) { var d = ''; for (var i = 1; i < Wc; i++) d += 'M' + i * u + ' 0V' + Hc * u; for (var j = 1; j < Hc; j++) d += 'M0 ' + j * u + 'H' + Wc * u; cv.path(d, { stroke: '#e3dccb', width: 0.8 }); }
    (o.places || []).forEach(function (p) { byName[p.name] = T(p.at); });
    (o.routes || []).forEach(function (rt) { var A = byName[rt.from], B = byName[rt.to]; if (!A || !B) return; cv.line(A, B, { color: rt.color || '#a07d3b', width: 2.4, dash: rt.dash }); if (rt.label) { var M = mid(A, B), n = at([0, 0], dirTo(A, B) + 90, 12); cv.text(M[0] + n[0], M[1] + n[1], rt.label, { size: 13, weight: 700, color: isRed(rt.label) ? RED : INK }); } });
    (o.places || []).forEach(function (p) { var q = byName[p.name]; cv.dot(q, { r: 4, color: RED }); cv.text(q[0] + (p.dx || 0), q[1] + (p.dy == null ? -13 : p.dy), p.name, { size: 13, weight: 700, italic: false }); });
    if (o.north !== false) { var N0 = [u * 0.6, u * 1.3], N1 = [u * 0.6, u * 0.45]; cv.line(N0, N1, { width: 1.8 }); arrow(cv, N1, 90, { L: 8, w: 3.5 }); cv.text(N1[0], N1[1] - 9, 'N', { size: 12, weight: 800, italic: false }); }
    if (o.bar !== false) {
      var seg = sc.draw * UNIT_CM[sc.drawUnit] * u, ns = Math.max(1, Math.min(4, Math.floor((Wc * u * 0.45) / seg))), x0 = Wc * u - ns * seg - 34, y0 = Hc * u - 22;
      for (var s2 = 0; s2 < ns; s2++) cv.raw('<rect x="' + f(x0 + s2 * seg) + '" y="' + f(y0) + '" width="' + f(seg) + '" height="6" fill="' + (s2 % 2 ? '#fff' : INK) + '" stroke="' + INK + '" stroke-width="1"/>', [[x0, y0], [x0 + ns * seg, y0 + 6]]);
      for (var s3 = 0; s3 <= ns; s3++) cv.text(x0 + s3 * seg, y0 + 14, fmtN(s3 * sc.real, 2) + (s3 === ns ? ' ' + sc.realUnit : ''), { size: 10.5, weight: 600, halo: 2.5 });
    }
    if (o.title !== false) cv.text(8, Hc * u + 12, 'Scale: ' + sc.text, { size: 13, weight: 600, anchor: 'start', color: '#3a4254' });
    return cv.svg({ width: o.width || 380, aria: o.aria || 'scale map', pad: 6 });
  };

  /* ======================================== checkers (Units 6–7) ======================================== */
  var TR = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var TRR = { sin: Math.sin, cos: Math.cos, tan: Math.tan };   // what a calculator in RAD mode gives for "sin 35"
  var INV = { sin: function (v) { return Math.asin(v) / RAD; }, cos: function (v) { return Math.acos(v) / RAD; }, tan: function (v) { return Math.atan(v) / RAD; } };
  var INVR = { sin: Math.asin, cos: Math.acos, tan: Math.atan };
  var PAIRS3 = { sin: 'opp and hyp', cos: 'adj and hyp', tan: 'opp and adj' }, MNEM = { sin: 'SOH', cos: 'CAH', tan: 'TOA' };
  var RAD_HINT = 'Your calculator is in <b>RAD</b> mode. Press <b>DRG</b> until <b>DEG</b> shows on the screen, then try again.';
  G.RAD_HINT = RAD_HINT;
  /* strip "x =", "θ =", a degree sign, so K.near sees a plain number */
  function bare(resp, deg) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/\\theta|θ/g, 't');
    s = s.replace(/^\s*(?:\\angle\s*)?[A-Za-z]{1,3}\s*(?:=|≈|\\approx|\\doteq)\s*/, '');
    if (deg) s = s.replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, '').replace(/\s*deg(?:rees?)?\.?\s*$/i, '');
    return s.trim();
  }
  function ok3(v) { return typeof v === 'number' && isFinite(v); }
  /* the value of a length set up as side × fn(deg) (mul) or side ÷ fn(deg) (div) */
  function trigLen(t, fns) { var F = (fns || TR)[t.fn](t.deg); return t.op === 'div' ? t.side / F : t.side * F; }
  G.trigLen = function (t) { return trigLen(t); };
  /* HW.geo.lenChk(v, { dp 1, unit, trig: { fn: 'sin'|'cos'|'tan', deg, side, op: 'mul'|'div' }, pyth: { legs: [a, b] } | { hyp, leg },
   *   scale: { len, k, op: 'mul'|'div' }, prop: { given, num, den } (answer = given × num ÷ den), alts: [{ v, code, hint }], radTrap true |
   *   false | { fn, deg, side, op }, early true (rounding the trig ratio too soon → a nudge) })
   *   A length to the nearest tenth (dp). Traps from the set-up: RAD mode, × instead of ÷ (and back), the wrong ratio, the ratio ÷ the side,
   *   Pythagoras with no √, a² − b² for the hypotenuse, the hypotenuse used as a leg, adding the sides, 2a for a², adding k, a flipped
   *   proportion. A correct value with more decimals gets "now round it"; "x = 12.3" and a unit after the number are fine. */
  G.lenChk = function (v, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, alts = [], early = [];
    var add = function (val, code, hint) { if (ok3(val)) alts.push({ v: val, code: code, hint: hint }); };
    var tr = o.trig, rt = o.radTrap == null ? true : o.radTrap;
    if (rt && typeof rt === 'object') add(trigLen(rt, TRR), 'trig-rad', RAD_HINT);
    if (tr) {
      if (rt === true) add(trigLen(tr, TRR), 'trig-rad', RAD_HINT);
      add(trigLen({ fn: tr.fn, deg: tr.deg, side: tr.side, op: tr.op === 'div' ? 'mul' : 'div' }), 'trig-mul-div', tr.op === 'div' ? 'The unknown is on the <b>bottom</b> of the ratio, so <b>divide</b>: side ÷ ' + tr.fn + ' θ. (You multiplied.)' : 'The unknown is on <b>top</b> of the ratio, so <b>multiply</b>: side × ' + tr.fn + ' θ. (You divided.)');
      if (tr.op === 'div') add(TR[tr.fn](tr.deg) / tr.side, 'trig-upside', 'Divide the <b>side</b> by ' + tr.fn + ' θ, not ' + tr.fn + ' θ by the side.');
      ['sin', 'cos', 'tan'].forEach(function (g) { if (g !== tr.fn) add(trigLen({ fn: g, deg: tr.deg, side: tr.side, op: tr.op }), 'trig-wrong-ratio', 'Check the ratio: label opp, adj and hyp from θ. With ' + PAIRS3[tr.fn] + ' it is <b>' + tr.fn + '</b> (' + MNEM[tr.fn] + '), not ' + g + '.'); });
      if (o.early !== false) [1, 2].forEach(function (d) { var F = Math.round(TR[tr.fn](tr.deg) * Math.pow(10, d)) / Math.pow(10, d); if (F) early.push(tr.op === 'div' ? tr.side / F : tr.side * F); });
    }
    var py = o.pyth;
    if (py && py.legs) {
      var a = py.legs[0], b = py.legs[1];
      add(a * a + b * b, 'pyth-no-root', 'That is c². Take the <b>square root</b> (2nd x²) to find c.');
      add(Math.sqrt(Math.abs(a * a - b * b)), 'pyth-subtract', 'To find the <b>hypotenuse</b>, <b>add</b> the squares: c² = a² + b².');
      add(a + b, 'pyth-add-sides', 'Square the sides first: c² = a² + b², then take the square root.');
      add(Math.sqrt(2 * a + 2 * b), 'pyth-double', 'a² means a × a, not 2 × a.');
    } else if (py && py.hyp != null) {
      var c = py.hyp, l = py.leg;
      add(c * c - l * l, 'pyth-no-root', 'That is the leg <b>squared</b>. Take the <b>square root</b> (2nd x²).');
      add(Math.sqrt(c * c + l * l), 'pyth-hyp-leg', fmtN(c, 3) + ' is the <b>hypotenuse</b> (the longest side, across from the right angle), so <b>subtract</b>: leg² = c² − a².');
      add(c - l, 'pyth-sub-sides', 'Square the sides first: leg² = c² − a², then take the square root.');
      add(Math.sqrt(Math.abs(2 * c - 2 * l)), 'pyth-double', 'c² means c × c, not 2 × c.');
    }
    var sc = o.scale;
    if (sc) {
      add(sc.op === 'div' ? sc.len * sc.k : sc.len / sc.k, 'k-mul-div', sc.op === 'div' ? 'Going back to the original: <b>divide</b> by k (original = new ÷ k).' : 'New length = original × k: <b>multiply</b> by k.');
      add(sc.len + sc.k, 'k-added', 'A scale factor <b>multiplies</b> every length; don’t add it.');
    }
    var pr = o.prop;
    if (pr) { add(pr.given * pr.den / pr.num, 'prop-flip', 'Keep matching sides in the same order: new ÷ original = new ÷ original. Your ratio is upside down.'); add(pr.given + pr.num - pr.den, 'prop-add', 'Similar figures <b>multiply</b> by the same factor; they don’t add the same amount.'); }
    (o.alts || []).forEach(function (x) { alts.push(x); });
    var near = K.near(v, dp, { alts: alts, unit: o.unit, nr: o.nr, diag: o.diag || (py && py.hyp != null ? function (w) { return w >= py.hyp ? { code: 'pyth-too-long', hint: 'A leg is always <b>shorter</b> than the hypotenuse.' } : null; } : null) });
    var want = K.roundTo(v, dp);
    return function (resp) {
      var s = bare(resp, false), p = HW.parse.number(s);
      var chop = Math.trunc(v * Math.pow(10, dp)) / Math.pow(10, dp);
      if (p.ok && early.length && Math.abs(K.roundTo(p.value, dp) - want) > 1e-9 && Math.abs(p.value - chop) > 1e-9) for (var i = 0; i < early.length; i++) if (Math.abs(K.roundTo(p.value, dp) - K.roundTo(early[i], dp)) < 1e-9) return form('round-early', 'Nearly! Keep the <b>full</b> calculator value of ' + tr.fn + ' ' + fmtDeg(tr.deg) + '° — round only the final answer.');
      return near(s);
    };
  };
  /* HW.geo.angleRatioChk(deg, { dp 0, ratio: { fn, num, den } (θ = fn⁻¹(num ÷ den)), alts, radTrap true, complementTrap true })
   *   An angle from an inverse trig ratio, to the nearest degree. Traps: RAD mode (an answer in radians), no inverse (sin of the ratio), the
   *   wrong inverse, the ratio upside down, the other acute angle (90° − θ). The ° sign and "θ =" are fine. */
  G.angleRatioChk = function (deg, o) {
    o = o || {}; var dp = o.dp == null ? 0 : o.dp, alts = [], r = o.ratio;
    var add = function (val, code, hint) { if (ok3(val) && !alts.some(function (x) { return Math.abs(K.roundTo(x.v, dp + 2) - K.roundTo(val, dp + 2)) < 1e-9; })) alts.push({ v: val, code: code, hint: hint }); };
    // first: the other acute angle (the same number as the flipped tan ratio, or sin⁻¹ ↔ cos⁻¹ of the same ratio)
    if (o.complementTrap !== false && deg > 0 && deg < 90) add(90 - deg, 'trig-complement', 'That is the <b>other</b> acute angle (90° − θ). Label opp, adj and hyp from the angle you are asked for' + (r ? ', then check the ratio: ' + r.fn + ' θ = ' + { sin: 'opp ÷ hyp', cos: 'adj ÷ hyp', tan: 'opp ÷ adj' }[r.fn] + '.' : '.'));
    if (r) {
      var q = r.num / r.den;
      if (o.radTrap !== false) add(INVR[r.fn](q), 'trig-rad', RAD_HINT);
      add(TR[r.fn](q), 'trig-no-inverse', 'To get an <b>angle</b> from a ratio, use the <b>inverse</b>: 2nd then ' + r.fn + ' (' + r.fn + '⁻¹).');
      ['sin', 'cos', 'tan'].forEach(function (g) { if (g !== r.fn) add(INV[g](q), 'trig-wrong-ratio', 'Check the ratio: you know the ' + PAIRS3[r.fn] + ', so use <b>' + r.fn + '⁻¹</b> (' + MNEM[r.fn] + '), not ' + g + '⁻¹.'); });
    }
    (o.alts || []).forEach(function (x) { alts.unshift(x); });
    var near = K.near(deg, dp, { alts: alts });
    return function (resp) { return near(bare(resp, true)); };
  };
  /* HW.geo.kChk(k, { flipTrap true, from: { new, orig } (for the difference trap), dp 2 (decimal places needed when k does not end) })
   *   A scale factor as a fraction (3/2, \frac{3}{2}) or a decimal (1.5); "k =", "×1.5", "1.5x" are fine. 1/k gets "new ÷ original";
   *   new − original gets "a scale factor divides"; 3 : 2 and 150% get a nudge. */
  G.kChk = function (k, o) {
    o = o || {}; var dpNeed = o.dp == null ? 2 : o.dp;
    var exact = function (v) { return Math.abs(v - k) < 1e-9 * Math.max(1, Math.abs(k)); };
    var ends = (function () { var x = k; for (var i = 0; i < 6; i++) { if (Math.abs(x - Math.round(x)) < 1e-9) return true; x *= 10; } return false; })();
    function close(v, places, target) { return Math.abs(v - target) <= (places >= 3 ? 1.01 : 0.5) * Math.pow(10, -places) + 1e-9; }
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\\left|\\right/g, '').replace(/\\times|×|\\cdot/g, ' ').replace(/^\s*k\s*=\s*/i, '').replace(/\s*(?:x|times)\s*$/i, '').replace(/^\s*x\s*(?=[\d.])/i, '').trim();
      if (!raw) return form('empty', 'Type the scale factor.');
      var rm = /^([\d.]+)\s*:\s*([\d.]+)$/.exec(raw); if (rm) return form('k-ratio', 'Write k as one number: ' + rm[1] + ' : ' + rm[2] + ' → ' + t('\\frac{' + rm[1] + '}{' + rm[2] + '}') + '.');
      if (/%\s*$|\\%\s*$/.test(raw)) return form('k-percent', 'Write k as a number, not a percent (150% → 1.5).');
      var a = K.read(raw); if (a.res) return a.res;
      var v = a.val; if (!ok3(v)) return form('notnumber', 'Type the scale factor as a fraction or a decimal.');
      var places = (String(raw).split('.')[1] || '').replace(/\D.*$/, '').length, dec = /\./.test(raw) && !/\\frac|\//.test(raw);
      if (exact(v) || (dec && !ends && places >= dpNeed && close(v, places, k))) return ok();
      if (dec && !ends && places < dpNeed && close(v, places, k)) return form('k-round', 'Close — give at least ' + dpNeed + ' decimal places, or write it as a fraction.');
      if (o.flipTrap !== false && Math.abs(k - 1) > 1e-9 && (Math.abs(v * k - 1) < 1e-9 || (dec && close(v, Math.max(places, 1), 1 / k)))) return wrong('k-flip', 'Upside down: <b>k = new ÷ original</b> (the image’s length on top).');
      if (o.from && Math.abs(v - (o.from.new - o.from.orig)) < 1e-9) return wrong('k-subtract', 'A scale factor is a <b>division</b>, not a difference: k = new ÷ original.');
      if (v <= 0) return wrong('sign', 'A scale factor is always positive.');
      if ((k > 1 && v < 1) || (k < 1 && v > 1)) return wrong('k-direction', k > 1 ? 'The new figure is <b>bigger</b> (an enlargement), so k > 1.' : 'The new figure is <b>smaller</b> (a reduction), so k < 1.');
      return wrong('value', null);
    };
  };

  /* ---------------- part builders (Units 6–7) ---------------- */
  /* P.len(prompt, v, o): o = lenChk options + { unit, sol, hints, text, nr } */
  P.len = function (prompt, v, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, part = K.P.near(prompt, v, dp, { unit: o.unit, nr: o.nr }, o.sol, o.hints, o.text);
    part.check = G.lenChk(v, o); return part;
  };
  /* P.trigAngle(prompt, deg, o): o = angleRatioChk options + { sol, hints, text, nr } */
  P.trigAngle = function (prompt, deg, o) {
    o = o || {}; var dp = o.dp == null ? 0 : o.dp, want = K.roundTo(deg, dp).toFixed(dp);
    return { prompt: prompt, input: { type: 'number', after: '°', nr: !!o.nr }, check: G.angleRatioChk(deg, o), key: want, answer: t(want + '^\\circ'), solution: o.sol, hints: o.hints || [], text: o.text };
  };
  /* P.k(prompt, k, o): k a number or [p, q]; o = kChk options + { sol, hints, text } */
  P.k = function (prompt, k, o) {
    o = o || {}; var pq = Array.isArray(k) ? k : null, kv = pq ? pq[0] / pq[1] : k, g = pq ? HW.ex.gcd(pq[0], pq[1]) : 1, fr = pq && pq[1] / g !== 1;
    var short = Math.abs(kv * 100 - Math.round(kv * 100)) < 1e-9, frTex = fr ? '\\frac{' + pq[0] / g + '}{' + pq[1] / g + '}' : '';
    var keyTex = fr ? frTex : fmtN(kv, 4), ans = t('k=' + (fr ? frTex + (short ? '=' + fmtN(kv, 2) : '\\approx ' + fmtN(kv, 2)) : fmtN(kv, 4)));
    return { prompt: prompt, input: { type: 'math', keys: 'fraction', before: o.before || t('k=') }, check: G.kChk(kv, o), key: keyTex, answer: ans, solution: o.sol, hints: o.hints || [], text: o.text };
  };
  /* P.ratioMC(r, prompt, want, o): want 'sin'|'cos'|'tan'|'pyth'. o.sides: the two sides involved, e.g. ['opp', 'hyp'] (default from want);
   *   o.keepOrder true; sol, hints, text. Options: the three ratios and the Pythagorean theorem. */
  P.ratioMC = function (r, prompt, want, o) {
    o = o || {}; var have = o.sides || ({ sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] })[want] || null;
    var HT = { sin: '\\(\\sin\\theta=\\dfrac{\\text{opp}}{\\text{hyp}}\\)', cos: '\\(\\cos\\theta=\\dfrac{\\text{adj}}{\\text{hyp}}\\)', tan: '\\(\\tan\\theta=\\dfrac{\\text{opp}}{\\text{adj}}\\)', pyth: 'the Pythagorean theorem, \\(a^2+b^2=c^2\\)' };
    var why = function (id) {
      if (want === 'pyth') return 'There is no angle to use here: two sides and the third side → the <b>Pythagorean theorem</b>.';
      if (id === 'pyth') return 'An angle is involved, so use a <b>trig ratio</b>. (Pythagoras links three sides, no angles.)';
      return '<b>' + id + '</b> uses ' + PAIRS3[id] + '. Here the sides are the ' + (have ? have.join(' and ') : PAIRS3[want]) + ': ' + MNEM[want] + '.';
    };
    var opts = ['sin', 'cos', 'tan', 'pyth'].map(function (id) { return { html: HT[id], right: id === want, why: id === want ? null : why(id), code: 'ratio-' + id }; });
    var part = K.P.mc(r, prompt, opts, o.sol, o.hints, o.text, o.keepOrder !== false);
    part.input.columns = o.columns || 2; return part;
  };

  if (HW.addCodes) HW.addCodes({
    'geo-other-scale': 'Read the other protractor scale (180° − the angle)', 'geo-supplement': 'Gave the supplement (180° − the angle)', 'geo-reflex-small': 'Gave the small angle, not the reflex angle',
    'geo-reflex-big': 'Gave the reflex angle, not the small angle', 'geo-too-big': 'Angle far too big', 'geo-comma': 'Decimal comma', 'geo-alt': 'A known wrong angle',
    'geo-bearing-quadrant': 'Wrote a compass direction (N45°E) instead of a true bearing', 'geo-bearing-word': 'Wrote a compass point instead of a true bearing', 'geo-bearing-3digit': 'Bearing not written with 3 digits',
    'geo-bearing-360': 'Wrote 360° for north', 'geo-bearing-range': 'Bearing outside 000°–359°', 'geo-bearing-ccw': 'Measured the bearing counterclockwise', 'geo-bearing-east': 'Measured the bearing from east',
    'geo-bearing-acute': 'Gave the angle from the N–S line, not the bearing', 'geo-bearing-reverse': 'Gave the bearing the opposite way', 'geo-back-add': 'Back bearing: added 180° instead of subtracting',
    'geo-back-sub': 'Back bearing: subtracted 180° instead of adding', 'geo-back-same': 'Back bearing: gave the original bearing',
    'geo-pair-alt': 'Said "alternate" without interior/exterior', 'geo-pair-int': 'Said "interior" without same side/alternate', 'geo-pair-ext': 'Said "exterior" without same side/alternate',
    'geo-pair-letter': 'Gave the letter shape, not the name', 'geo-pair-unknown': 'Unrecognised pair name', 'geo-pair-corresponding': 'Called them corresponding', 'geo-pair-alt-int': 'Called them alternate interior',
    'geo-pair-alt-ext': 'Called them alternate exterior', 'geo-pair-int-same': 'Called them interior on the same side', 'geo-pair-ext-same': 'Called them exterior on the same side', 'geo-pair-vert-opp': 'Called them vertically opposite',
    'geo-pair-linear': 'Called them supplementary/adjacent', 'geo-pair-complementary': 'Called them complementary',
    'trig-rad': 'Calculator in RAD mode', 'trig-mul-div': 'Multiplied instead of dividing by the trig ratio (or the reverse)', 'trig-upside': 'Ratio upside down',
    'trig-wrong-ratio': 'Used the wrong trig ratio', 'trig-no-inverse': 'Forgot the inverse key (sin⁻¹ …)', 'trig-complement': 'Gave the other acute angle (90° − θ)',
    'round-early': 'Rounded the trig ratio too early', 'pyth-no-root': 'Pythagoras: forgot the square root', 'pyth-subtract': 'Pythagoras: subtracted to find the hypotenuse',
    'pyth-add-sides': 'Pythagoras: added the sides without squaring', 'pyth-double': 'Doubled instead of squaring', 'pyth-hyp-leg': 'Used the hypotenuse as a leg (added the squares)',
    'pyth-sub-sides': 'Pythagoras: subtracted the sides without squaring', 'pyth-too-long': 'A leg longer than the hypotenuse', 'k-mul-div': 'Multiplied by k instead of dividing (or the reverse)',
    'k-added': 'Added the scale factor', 'prop-flip': 'Proportion set up upside down', 'prop-add': 'Added a difference instead of using a scale factor', 'k-flip': 'Scale factor upside down (original ÷ new)',
    'k-subtract': 'Scale factor as a difference', 'k-direction': 'Scale factor on the wrong side of 1', 'k-ratio': 'Wrote the scale factor as a ratio', 'k-percent': 'Wrote the scale factor as a percent',
    'k-round': 'Scale factor rounded to too few places', 'ratio-sin': 'Chose sine', 'ratio-cos': 'Chose cosine', 'ratio-tan': 'Chose tangent', 'ratio-pyth': 'Chose the Pythagorean theorem'
  });
})(window);
