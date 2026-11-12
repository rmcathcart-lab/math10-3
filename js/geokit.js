/* Unit 5 geometry kit for the practice site (angles, protractors, parallel lines and transversals, bearings, polygons).
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
    'geo-pair-linear': 'Called them supplementary/adjacent', 'geo-pair-complementary': 'Called them complementary'
  });
})(window);
