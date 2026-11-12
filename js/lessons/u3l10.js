/* Math 10-3 · Unit 3 · Lesson 10 — Nets and Surface Area of Prisms (M4; the area-unit changes are M1 for SI, M2 for imperial)
 * Assignment 10 (u3_l10.tex, Questions 1–18) and the Lesson 10 Extra Practice (u3_ep10.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the same object, units and difficulty as the booklet item, new numbers around the booklet's
 * (the lesson's worked-example numbers are left out: the 40 × 30 × 25 cm shipping box, the 2½ in block, the 1 ft 3 in
 * ottoman, the 5-12-13 cm door wedge 4 cm wide, Jordan's 2.4 m × 1.6 m tent 3 m long, Amira's 4 ft × 1½ ft × 2 ft planter,
 * Lucas's 4 m × 3.5 m × 2.5 m bedroom, and the four cube-net patterns of the example). Calculator allowed.
 * Answers: typed numbers; a unit typed after the number is ignored; exact quarter/eighth answers may also be typed as a
 * mixed number (73 1/2); money to the cent. Face tables: the "Size" boxes take "8 × 5" (either order; ×, x or * all
 * work), the area boxes numbers. Recognised wrong values each get their own hint: l × w × h (the volume), each face
 * counted once, a pair of faces left out, one face only, 4 faces of a cube, 6 × s instead of 6 × s², the slanted side
 * used as the triangle's height, the ½ of the triangles forgotten, one triangle only, the top left on an open box (or the
 * bottom taken off too), the floor/bottom kept when it is not covered, ft-and-in read as a decimal (1 ft 6 in → 1.6 ft),
 * inches not changed to feet, area conversions with 12 / 100 / 3 (the length factor) instead of 144 / 10 000 / 9, a
 * second coat or GST forgotten, rounding a count of cans or sheets down, and so on.
 * Conversions: prisms, nets and cube-net patterns are drawn in SVG; "complete the table" (prism names, faces, edges,
 * vertices; face tables) → the table input with the given cells shown (names as a tap-grid); "write yes or no" for the
 * cube-net patterns → a yes/no tap-grid; "draw a net on the grid" → choose the correct net (multiple choice of drawn
 * nets), then count its squares; "does the paper have enough area / why does wrapping use more / explain Jae's mistake /
 * which box uses less" → multiple choice of reasons; "how many cans and the cost" → two labelled boxes.
 * Uses HW.u3area (u3l9.js) and HW.u4conv (u4l1.js) at question time, so both files must be on the page (any order). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  function A() { var a = HW.u3area; if (!a || !a.fig) throw new Error('u3l10 needs HW.u3area (js/lessons/u3l9.js)'); return a; }
  function C() { var c = HW.u4conv; if (!c) throw new Error('u3l10 needs HW.u4conv (js/lessons/u4l1.js)'); return c; }

  /* ======================= helpers ======================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true).replace(/ /g, ' ') : s; }
  function uT(s) { return C().uT(s); }
  function eqR(x, dp) { return C().eqR(x, dp); }
  function raw(x, k) { return C().raw(x, k); }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u3l10: no numbers found'); return fb; }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function ceil(x) { return Math.ceil(q(x) - 1e-9); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function M(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Mp(x) { return '$' + rd(x, 2).toFixed(2); }
  function ftin(f, i) { return (f ? f + ' ft' : '') + (i ? (f ? ' ' : '') + i + ' in' : ''); }
  function mixT(x) { return A().mixT(x); }
  function fh(x) { return A().fh(x); }
  var SQ = { m: 'm²', cm: 'cm²', ft: 'ft²', in: 'in²', yd: 'yd²' };
  function num(prompt, ans, o) { return A().num(prompt, ans, o); }
  function area(prompt, ans, u, o) { o = o || {}; o.after = SQ[u] || u; if (o.dp == null && !o.money) o.exactOk = true; return A().num(prompt, ans, o); }
  function fields(prompt, rows, sol, hints, text) { return A().fields(prompt, rows, sol, hints, text); }

  /* ======================= surface area formulas ======================= */
  function SAbox(l, w, h) { return 2 * (l * w + l * h + w * h); }
  function boxLine(l, w, h, u) { var a = 2 * l * w, b = 2 * l * h, c = 2 * w * h; return [t('SA=2(' + N(l) + ')(' + N(w) + ')+2(' + N(l) + ')(' + N(h) + ')+2(' + N(w) + ')(' + N(h) + ')'), t('=' + N(a) + '+' + N(b) + '+' + N(c) + '=' + N(a + b + c) + uT(u + '²'))]; }
  function boxBad(l, w, h) {
    return [[l * w * h, 'u3l10-volume', t('l\\times w\\times h') + ' is the <b>volume</b> (what fits inside). Surface area adds the areas of the 6 faces.'],
      [l * w + l * h + w * h, 'u3l10-once', 'That counts each face once. A box has <b>two</b> of each face (top & bottom, front & back, two ends): ' + t('SA=2lw+2lh+2wh') + '.'],
      [2 * l * w + 2 * l * h, 'u3l10-pair', 'You left out the two ends (' + N(w) + ' by ' + N(h) + ').'], [2 * l * w + 2 * w * h, 'u3l10-pair', 'You left out the front and back (' + N(l) + ' by ' + N(h) + ').'], [2 * l * h + 2 * w * h, 'u3l10-pair', 'You left out the top and bottom (' + N(l) + ' by ' + N(w) + ').'],
      [2 * (l + w + h), 'u3l10-lengths', 'Add the <b>areas</b> of the faces, not the lengths.'], [6 * l * w, 'u3l10-six-same', 'Only a cube has 6 equal faces. This box has 3 different pairs.']];
  }
  function cubeBad(s) {
    return [[s * s, 'u3l10-one-face', 'That’s the area of <b>one</b> face. A cube has 6 faces: ' + t('SA=6s^2') + '.'], [s * s * s, 'u3l10-volume', t('s\\times s\\times s') + ' is the volume. Surface area = ' + t('6s^2') + '.'],
      [4 * s * s, 'u3l10-four', 'A cube has <b>6</b> faces (top and bottom too), not 4.'], [6 * s, 'u3l10-no-square', 'Square the edge first: each face is ' + t(N(s) + '\\times ' + N(s)) + '.'], [12 * s, 'u3l10-no-square', 'Each face is ' + t(N(s) + '\\times ' + N(s)) + ' (use the ' + t('x^2') + ' key), not ' + t(N(s) + '\\times 2') + '.'], [Math.pow(6 * s, 2), 'u3l10-6s-sq', t('6s^2') + ' means ' + t('6\\times(s\\times s)') + ': square the edge, then multiply by 6.']];
  }
  function cubeSol(s, u) { return [t('SA=6s^2=6\\times ' + N(s) + '^2=6\\times ' + N(s * s) + '=' + N(6 * s * s) + uT(u + '²'))]; }
  /* triangular prism: triangle base b, height ht, sides s1 s2 s3 (perimeter), length L */
  function triSA(b, ht, sides, L) { return b * ht + (sides[0] + sides[1] + sides[2]) * L; }
  function triBad(b, ht, sides, L, slant) {
    var per = sides[0] + sides[1] + sides[2], R = per * L, Tt = b * ht, out = [[2 * Tt + R, 'u3l10-tri-half', 'Each triangle is ' + t('\\tfrac{1}{2}\\times b\\times h') + '. The two triangles together are ' + t(N(b) + '\\times ' + N(ht)) + '.'], [Tt / 2 + R, 'u3l10-one-tri', 'A prism has <b>two</b> triangle ends.'], [Tt, 'u3l10-tri-only', 'Add the three rectangles too.'], [R, 'u3l10-rect-only', 'Add the two triangles too.'], [Tt + 3 * b * L, 'u3l10-rect-same', 'The three rectangles are not all the same: each is one side of the triangle × the length.'], [b * ht * L / 2, 'u3l10-volume', 'That’s the volume (area of the triangle × length). Surface area adds the 5 faces.']];
    if (slant) out.push([b * slant + R, 'u3l10-slant-height', 'Use the <b>height</b> of the triangle (straight up, ' + N(ht) + '), not the slanted side, for the triangles.']);
    return out;
  }
  function triSol(b, ht, sides, L, u) {
    var per = sides[0] + sides[1] + sides[2];
    return ['Triangles: ' + t('2\\times\\tfrac{1}{2}\\times ' + N(b) + '\\times ' + N(ht) + '=' + N(b * ht) + uT(u + '²')), 'Rectangles: ' + t('(' + sides.map(N).join('+') + ')\\times ' + N(L) + '=' + N(per) + '\\times ' + N(L) + '=' + N(per * L) + uT(u + '²')), t('SA=' + N(b * ht) + '+' + N(per * L) + '=' + N(b * ht + per * L) + uT(u + '²'))];
  }
  /* isosceles end triangles whose slanted sides are whole numbers: [base, height, slant] */
  var ISO = [[6, 4, 5], [12, 8, 10], [16, 6, 10], [10, 12, 13], [24, 5, 13], [8, 3, 5], [30, 8, 17], [18, 12, 15], [14, 24, 25], [30, 20, 25], [40, 15, 25]];
  /* right triangles [leg a (up), leg b (along the ground), hypotenuse] */
  var RT = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [4, 3, 5], [6, 4.5, 7.5], [9, 40, 41]];

  /* ======================= pictures ======================= */
  var INK = '#2b3340', F1 = '#eef2f4', F2 = '#dde5ea', F3 = '#cbd7de';
  /* a box at a slant. labs: { l, w, h } text; o: { open (no top), w, h, k } */
  function boxFig(l, w, h, labs, o) {
    o = o || {}; labs = labs || {};
    var big = Math.max(l, h), dl = Math.min(w, big * 0.9) * (o.k || 0.62), dx = dl * 0.8, dy = dl * 0.55;
    var any = labs.l || labs.w || labs.h, F = A().fig(0, 0, l + dx, h + dy, { w: o.w || 230, h: o.h || 170, pad: any ? 26 : 5, padL: labs.h ? 48 : any ? 26 : 5, padR: labs.w ? 52 : any ? 26 : 5 });
    F.poly([[0, 0], [l, 0], [l, h], [0, h]], { fill: F1 });
    F.poly([[0, h], [l, h], [l + dx, h + dy], [dx, h + dy]], { fill: o.open ? '#ffffff' : F2 });
    F.poly([[l, 0], [l + dx, dy], [l + dx, h + dy], [l, h]], { fill: F3 });
    F.pline([[0, 0], [dx, dy], [l + dx, dy]], { dash: '4 3', w: 1.1 }); F.line([dx, dy], [dx, h + dy], { dash: '4 3', w: 1.1 });
    if (o.open) F.text(l / 2 + dx / 2, h + dy / 2, 'open top', 'c', { size: 11 });
    if (labs.l) F.text(l / 2, 0, labs.l, 'below'); if (labs.h) F.text(0, h / 2, labs.h, 'left'); if (labs.w) F.text(l + dx / 2, dy / 2, labs.w, 'right', { dy: 6 });
    return F.svg(o.label || 'box');
  }
  /* a triangular prism: end triangle (0,0), (b,0), (ax, ht); labs: { b, ht, s (left side), L, hyp } */
  function triFig(b, ht, ax, L, labs, o) {
    o = o || {}; labs = labs || {};
    var big = Math.max(b, ht), dl = Math.min(L, big * 1.6) * 0.62, dx = dl * 0.8, dy = dl * 0.5;
    var F = A().fig(0, 0, Math.max(b, ax) + dx, ht + dy, { w: o.w || 240, h: o.h || 170, pad: 30, padR: 50 });
    F.poly([[0, 0], [b, 0], [ax, ht]], { fill: F1 });
    F.poly([[b, 0], [b + dx, dy], [ax + dx, ht + dy], [ax, ht]], { fill: F3 });
    F.pline([[0, 0], [dx, dy], [b + dx, dy]], { dash: '4 3', w: 1.1 }); F.line([dx, dy], [ax + dx, ht + dy], { dash: '4 3', w: 1.1 });
    if (ax > 1e-9 && ax < b && labs.ht) { F.line([ax, 0], [ax, ht], { dash: '3 3', w: 1.1 }); F.ra([ax, 0], [1, 0], [0, 1], 6); F.text(ax, ht * 0.45, labs.ht, 'right', { size: 12 }); }
    if (ax < 1e-9) { F.ra([0, 0], [1, 0], [0, 1], 7); if (labs.ht) F.text(0, ht / 2, labs.ht, 'left'); }
    if (labs.b) F.text(b / 2, 0, labs.b, 'below'); if (labs.s) F.text(ax / 2, ht / 2, labs.s, 'left', { dx: -4 });
    if (labs.hyp) F.text(b * 0.32, ht * 0.32, labs.hyp, 'c', { size: 12 });
    if (labs.L) F.text(b + dx / 2, dy / 2, labs.L, 'right', { dy: 8 });
    return F.svg(o.label || 'triangular prism');
  }
  /* a prism with an n-sided base, standing up */
  function ngonFig(n, o) {
    o = o || {}; var rx = 1.1, ry = 0.36, H = 1.8, ph = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n), pts = [];
    for (var i = 0; i < n; i++) { var a = ph + 2 * Math.PI * i / n; pts.push([rx * Math.cos(a), ry * Math.sin(a), Math.sin(a)]); }
    var F = A().fig(-1.2, -0.45, 1.2, H + 0.45, { w: o.w || 130, h: o.h || 130, pad: 8 });
    F.poly(pts.map(function (p) { return [p[0], p[1] + H]; }), { fill: F2 });
    for (i = 0; i < n; i++) {
      var a2 = pts[i], b2 = pts[(i + 1) % n], vis = (a2[2] + b2[2]) / 2 < 0;
      if (vis) F.poly([[a2[0], a2[1]], [b2[0], b2[1]], [b2[0], b2[1] + H], [a2[0], a2[1] + H]], { fill: F1, w: 0, stroke: 'none' });
    }
    for (i = 0; i < n; i++) { a2 = pts[i]; b2 = pts[(i + 1) % n]; vis = (a2[2] + b2[2]) / 2 < 0; F.line([a2[0], a2[1]], [b2[0], b2[1]], vis ? { w: 2 } : { dash: '4 3', w: 1.1 }); }
    for (i = 0; i < n; i++) { a2 = pts[i]; var prev = pts[(i - 1 + n) % n], next = pts[(i + 1) % n], v2 = (a2[2] + prev[2]) / 2 < 0 || (a2[2] + next[2]) / 2 < 0; F.line([a2[0], a2[1]], [a2[0], a2[1] + H], v2 ? { w: 2 } : { dash: '4 3', w: 1.1 }); }
    F.poly(pts.map(function (p) { return [p[0], p[1] + H]; }), { fill: 'none' });
    return F.svg(o.label || n + '-sided prism');
  }
  /* net of a box: front, top, back, bottom in a column; the two ends beside the front. o: { faces (labels), edges: {l, w, h}, grid, px, scale } */
  function boxNet(l, w, h, o) {
    o = o || {}; var g = o.grid ? 1 : 0;
    var F = A().fig(-w - g, -g, l + w + g, 2 * h + 2 * w + g, o.px ? { s: o.px, pad: o.edges ? 26 : 4, padR: o.edges ? 44 : 4 } : { w: o.w || 200, h: o.h || 230, pad: o.edges ? 26 : 4, padL: o.edges ? 44 : 4, padR: o.edges ? 44 : 4 });
    if (o.grid) F.grid(-w - g, -g, l + w + g, 2 * h + 2 * w + g);
    var st = { fill: o.grid ? 'rgba(201,211,218,0.55)' : F1, w: 1.8 }, fc = o.faces || {};
    var R = [['front', 0, 0, l, h], ['top', 0, h, l, h + w], ['back', 0, h + w, l, 2 * h + w], ['bottom', 0, 2 * h + w, l, 2 * h + 2 * w], ['end1', -w, 0, 0, h], ['end2', l, 0, l + w, h]];
    (o.drop ? R.filter(function (x) { return x[0] !== o.drop; }) : R).forEach(function (x) { F.rect(x[1], x[2], x[3], x[4], st); if (fc[x[0]]) F.text((x[1] + x[3]) / 2, (x[2] + x[4]) / 2, fc[x[0]], 'c', { size: o.fsize || 11 }); });
    var e = o.edges; if (e) { if (e.l) F.text(l / 2, 0, e.l, 'below', { size: 12 }); if (e.h) F.text(l + w, h / 2, e.h, 'right', { size: 12 }); if (e.w) F.text(l + w / 2, 0, e.w, 'below', { size: 12 }); if (e.w2) F.text(0, h + w / 2, e.w2, 'left', { size: 12 }); }
    return F.svg(o.label || 'net of a box');
  }
  /* a "net" from a list of rectangles [x0, y0, x1, y1] on a grid (for the wrong nets of the multiple choice) */
  function rectsOnGrid(rects, px, label) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; rects.forEach(function (r2) { x0 = Math.min(x0, r2[0]); y0 = Math.min(y0, r2[1]); x1 = Math.max(x1, r2[2]); y1 = Math.max(y1, r2[3]); });
    var F = A().fig(x0 - 1, y0 - 1, x1 + 1, y1 + 1, { s: px || 12, pad: 3 }); F.grid(x0 - 1, y0 - 1, x1 + 1, y1 + 1);
    rects.forEach(function (r2) { F.rect(r2[0], r2[1], r2[2], r2[3], { fill: 'rgba(201,211,218,0.6)', w: 1.8 }); });
    return F.svg(label || 'pattern on a grid');
  }
  function boxNetRects(l, w, h, kind) {
    var ew = w, eh = h, tw = w, out;
    if (kind === 'ends') { ew = h; eh = h; } // ends the wrong size
    if (kind === 'strip') tw = h;             // top and bottom the wrong size
    out = [[0, 0, l, h], [0, h, l, h + tw], [0, h + tw, l, 2 * h + tw], [0, 2 * h + tw, l, 2 * h + 2 * tw], [-ew, 0, 0, eh], [l, 0, l + ew, eh]];
    if (kind === 'five') out.splice(3, 1);
    return out;
  }
  /* net of a triangular prism: rectangles widths a, b, c (height L); triangles on the middle one (apex p across, height tt) */
  function triNet(a, b, c, L, p, tt, o) {
    o = o || {}; var F = A().fig(0, -tt, a + b + c, L + tt, { w: o.w || 220, h: o.h || 170, pad: 6 });
    var st = { fill: F1, w: 1.8 };
    F.rect(0, 0, a, L, st); F.rect(a, 0, a + b, L, st); F.rect(a + b, 0, a + b + c, L, st);
    F.poly([[a, L], [a + b, L], [a + p, L + tt]], st); F.poly([[a, 0], [a + b, 0], [a + p, -tt]], st);
    return F.svg(o.label || 'net of a triangular prism');
  }
  /* six unit squares */
  function squaresFig(cells, px, label) {
    var x1 = 0, y1 = 0; cells.forEach(function (c) { x1 = Math.max(x1, c[0] + 1); y1 = Math.max(y1, c[1] + 1); });
    var F = A().fig(0, 0, x1, y1, { s: px || 20, pad: 3 });
    cells.forEach(function (c) { F.rect(c[0], c[1], c[0] + 1, c[1] + 1, { fill: F1, w: 1.8 }); });
    return F.svg(label || 'pattern of six squares');
  }
  function figRow(items) { return '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;margin:6px 0">' + items.map(function (x) { return '<div style="text-align:center;min-width:70px">' + x[1] + '<div>' + x[0] + '</div></div>'; }).join('') + '</div>'; }

  /* ======================= cube nets ======================= */
  function norm(cells) { var mx = Math.min.apply(null, cells.map(function (c) { return c[0]; })), my = Math.min.apply(null, cells.map(function (c) { return c[1]; })); return cells.map(function (c) { return [c[0] - mx, c[1] - my]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }); }
  function ckey(cells) { return norm(cells).map(function (c) { return c.join('/'); }).join(','); }
  /* the same key for a pattern and its turned or flipped copies */
  function canon(cells) { var ks = []; [[1, 0, 0, 1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, 1, -1, 0], [-1, 0, 0, 1], [1, 0, 0, -1], [0, 1, 1, 0], [0, -1, -1, 0]].forEach(function (m) { ks.push(ckey(cells.map(function (c) { return [m[0] * c[0] + m[1] * c[1], m[2] * c[0] + m[3] * c[1]]; }))); }); ks.sort(); return ks[0]; }
  function neg(v) { return [-v[0], -v[1], -v[2]]; }
  /* roll a cube over the pattern; it is a net when the six squares land on six different faces */
  function isCubeNet(cells) {
    var has = {}; cells.forEach(function (c) { has[c[0] + ',' + c[1]] = 1; });
    var seen = {}, faces = {}, st = [[cells[0][0], cells[0][1], [0, 0, -1], [0, 1, 0], [1, 0, 0]]];
    seen[cells[0][0] + ',' + cells[0][1]] = 1;
    while (st.length) {
      var s = st.pop(), d = s[2], n = s[3], e = s[4]; faces[d.join(',')] = 1;
      [[1, 0, e, neg(d), n, 'e'], [-1, 0, neg(e), d, n, 'w'], [0, 1, n, e, neg(d), 'n'], [0, -1, neg(n), e, d, 's']].forEach(function (m) {
        var k = (s[0] + m[0]) + ',' + (s[1] + m[1]); if (!has[k] || seen[k]) return; seen[k] = 1;
        var nd = m[2], ne = m[5] === 'e' || m[5] === 'w' ? m[3] : e, nn = m[5] === 'n' || m[5] === 's' ? m[4] : n;
        st.push([s[0] + m[0], s[1] + m[1], nd, nn, ne]);
      });
    }
    return Object.keys(faces).length === 6 && Object.keys(seen).length === 6;
  }
  function has2x2(cells) { var h = {}; cells.forEach(function (c) { h[c[0] + ',' + c[1]] = 1; }); return cells.some(function (c) { return h[(c[0] + 1) + ',' + c[1]] && h[c[0] + ',' + (c[1] + 1)] && h[(c[0] + 1) + ',' + (c[1] + 1)]; }); }
  function hexomino(r) { var cells = [[0, 0]], h = { '0,0': 1 }; while (cells.length < 6) { var c = r.pick(cells), dd = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), k = (c[0] + dd[0]) + ',' + (c[1] + dd[1]); if (!h[k]) { h[k] = 1; cells.push([c[0] + dd[0], c[1] + dd[1]]); } } return norm(cells); }
  var EX_NETS = ['1/0,1/1,1/2,1/3,0/2,2/2', '0/0,1/0,2/0,3/0,4/0,2/1', '0/0,1/0,1/1,2/1,2/2,3/2', '0/0,1/0,2/0,3/0,0/1,1/1'].map(function (s) { return ckey(s.split(',').map(function (p) { return p.split('/').map(Number); })); });
  function pickPattern(r, wantNet, avoid) {
    return find(function () { return hexomino(r); }, function (c) {
      var w = Math.max.apply(null, c.map(function (x) { return x[0]; })) + 1, hh = Math.max.apply(null, c.map(function (x) { return x[1]; })) + 1, k = canon(c);
      if (w > 5 || hh > 4 || EX_NETS.indexOf(ckey(c)) >= 0 || avoid.indexOf(k) >= 0) return false;
      if (isCubeNet(c) !== wantNet) return false;
      if (!wantNet && has2x2(c) && r.chance(0.55)) return false;   // not too many easy 2 × 2 blocks
      return true;
    });
  }

  /* ======================= face tables (the table input) ======================= */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u3l10size) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u3l10size = [[dk(7), dk(8), dk(9), { label: '×', tex: '\\times ', plain: ' × ', title: 'times' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'clear', fn: 'clear' }], [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
  }
  function plainOf(s) { return String(s == null ? '' : s).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\\times|\\cdot|×|\*|·/g, 'x').replace(/\\[,;: !]|~/g, ' ').replace(/[{}]/g, '').replace(/\s*by\s*/i, 'x').replace(/\s+/g, '').replace(/(cm|mm|m|ft|in)(\^?2|²)?/g, ''); }
  /* a size box "8 × 5": the two numbers in either order */
  function sizeChk(a, b, rowName, others) {
    return function (resp) {
      var s = plainOf(resp); if (!s) return form('empty', 'Type the size, like 8 × 5.');
      var m = /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/.exec(s);
      if (!m) return /^\d+(\.\d+)?$/.test(s) ? form('u3l10-size-form', 'Write the size as length × width, like 8 × 5 (use the × key).') : form('unreadable', 'Write the size as two numbers with × between them, like 8 × 5.');
      var x = +m[1], y = +m[2];
      if ((Math.abs(x - a) < 1e-9 && Math.abs(y - b) < 1e-9) || (Math.abs(x - b) < 1e-9 && Math.abs(y - a) < 1e-9)) return ok();
      for (var i = 0; i < others.length; i++) { var o = others[i]; if ((x === o[0] && y === o[1]) || (x === o[1] && y === o[0])) return wrong('u3l10-size-row', 'That’s the size of the ' + o[2] + '. The ' + rowName + ' are ' + N(a) + ' by ' + N(b) + '.'); }
      return wrong('u3l10-size', 'Find the ' + rowName + ' on the net and read its two side lengths.');
    };
  }
  function tableChk(blanks) {
    return function (resp) {
      resp = resp || {}; var Mx = resp.cells || [];
      var get = function (b) { var v = (Mx[b.i] || [])[b.j]; return String(v == null ? '' : v).trim(); };
      var empty = blanks.filter(function (b) { return !get(b).replace(/\\placeholder\{\}|\s/g, ''); }).length;
      if (empty) return form('empty', empty === blanks.length ? 'Fill in the table first.' : 'Fill in every empty box (' + empty + ' still empty).');
      var firstForm = null, nWrong = 0, firstWrong = null;
      blanks.forEach(function (b) {
        var r2 = b.chk(A().unmix(get(b).replace(/\\,|\\ /g, '')).s); if (r2.v === 'correct') return;
        var out = { v: r2.v, code: r2.code, hint: '<b>' + b.name + ':</b> ' + (r2.hint || 'Check this box again.') };
        if (r2.v === 'form') { if (!firstForm) firstForm = out; } else { nWrong++; if (!firstWrong) firstWrong = out; }
      });
      if (firstWrong) { if (nWrong > 1) firstWrong.hint += ' <span class="muted">(' + nWrong + ' boxes need another look.)</span>'; return firstWrong; }
      return firstForm || ok();
    };
  }
  function tablePart(prompt, I, check, key, sol, hints, text) {
    var inp = { type: 'areabox', rows: I.rows, cols: I.cols, cells: I.cells, corner: I.corner || '', keys: I.keys || 'u3l10size', help: I.help || 'Tap a box, then type. Sizes like 8 × 5 (use the × key); areas as numbers.' };
    return { prompt: prompt, input: inp, check: check, key: key, answer: HW.draw.areaboxHtml(inp, key), solution: sol, hints: hints || [], text: text };
  }
  /* the face table of a box l × w × h (unit u): rows top & bottom, front & back, two ends, surface area */
  function faceTable(prompt, l, w, h, u, o) {
    o = o || {};
    var rowsD = [['top \\& bottom', l, w, 'top and bottom'], ['front \\& back', l, h, 'front and back'], ['two ends', w, h, 'two ends']];
    var SA = SAbox(l, w, h), blanks = [], key = { rows: [], cols: [], cells: [] }, cells = [];
    var rowsT = rowsD.map(function (x) { return '\\text{' + x[0] + '}'; }).concat(['\\textbf{Surface area}']);
    rowsD.forEach(function (x, i) {
      var others = rowsD.filter(function (y, j) { return j !== i; }).map(function (y) { return [y[1], y[2], y[3]]; }), one = x[1] * x[2];
      blanks.push({ i: i, j: 0, name: x[3] + ', size', chk: sizeChk(x[1], x[2], x[3], others) });
      blanks.push({ i: i, j: 1, name: x[3] + ', area of one', chk: C().chk(one, { exactOk: true, bad: [[2 * one, 'u3l10-one-two', 'That’s two faces. This box is the area of <b>one</b> face.'], [x[1] + x[2], 'u3l10-lengths', 'Multiply the two side lengths.']].concat(others.map(function (y) { return [y[0] * y[1], 'u3l10-size-row', 'That’s the area of one of the ' + y[2] + '.']; })), miss: 'Area of one face = its length × width.' }) });
      blanks.push({ i: i, j: 2, name: x[3] + ', area of two', chk: C().chk(2 * one, { exactOk: true, bad: [[one, 'u3l10-one-two', 'There are <b>two</b> of these faces: double the area of one.']], miss: 'Area of two = 2 × area of one.' }) });
      cells.push([null, null, null]); key.cells.push([N(x[1]) + '\\times ' + N(x[2]), nS(one), nS(2 * one)]);
    });
    cells.push(['', '', null]); key.cells.push(['', '', nS(SA)]);
    blanks.push({ i: 3, j: 2, name: 'surface area', chk: C().chk(SA, { exactOk: true, bad: [[SA / 2, 'u3l10-once', 'Add the “area of two” column (all six faces).'], [l * w * h, 'u3l10-volume', 'That’s the volume. Surface area = the sum of the “area of two” column.']], miss: 'Add the three “area of two” boxes.' }) });
    key.rows = rowsT; key.cols = ['\\text{Size}', '\\text{Area of one}', '\\text{Area of two}'];
    var sol = rowsD.map(function (x) { return x[3].charAt(0).toUpperCase() + x[3].slice(1) + ': ' + t(N(x[1]) + '\\times ' + N(x[2]) + '=' + N(x[1] * x[2])) + ', two: ' + t(N(2 * x[1] * x[2]) + uT(u + '²')); });
    sol.push(t('SA=' + rowsD.map(function (x) { return N(2 * x[1] * x[2]); }).join('+') + '=' + N(SA) + uT(u + '²')));
    return tablePart(prompt, { rows: rowsT, cols: key.cols, cells: cells, corner: '\\text{Faces}', help: 'Tap a box, then type. Size: like 8 × 5 (use ×). Areas in ' + SQ[u] + ' (just the number).' }, tableChk(blanks), key, br(sol), ['Each face is a rectangle: find its two side lengths on the net.', 'A box has two of each face. Add the “area of two” column for the surface area.'], o.text || 'face table');
  }

  /* prisms with an n-sided base */
  var PNAME = { 3: 'triangular prism', 4: 'rectangular prism', 5: 'pentagonal prism', 6: 'hexagonal prism', 8: 'octagonal prism' };

  /* rounding up a count (cans, sheets) */
  function countUp(prompt, need, each, o) {
    o = o || {}; var n = ceil(need / each);
    return num(prompt, n, { dp: 0, after: o.unit, bad: [[Math.floor(q(need / each) + 1e-9), 'u3l10-round-down', 'You can’t buy part of ' + (o.one || 'one') + ', and fewer would not be enough. Round <b>up</b>.'], [need / each, 'u3l10-not-whole', 'Right division — now round <b>up</b> to a whole number (you can’t buy part of ' + (o.one || 'one') + ').', 'form']].concat(o.bad || []),
      sol: (o.pre || []).concat([t(N(need) + '\\div ' + N(each) + '=' + raw(need / each, 3)) + '. Round <b>up</b>: ' + n + ' ' + (o.unit || '') + '.']), hints: o.hints || ['Divide by the area one ' + (o.oneName || 'item') + ' covers, then round up.'], text: o.text || 'round up' });
  }
  /* an area conversion: ft² ← in² (144), m² ← cm² (10 000), yd² ← ft² (9) */
  var AC = { 'in-ft': [144, 'in²', 'ft²', [[12, 'u3l10-conv-12', '1 ft = 12 in, but 1 ft² = 12 × 12 = 144 in². Divide by 144.']], 'M2'], 'cm-m': [10000, 'cm²', 'm²', [[100, 'u3l10-conv-100', '1 m = 100 cm, but 1 m² = 100 × 100 = 10 000 cm². Divide by 10 000.'], [1000, 'u3l10-conv-1000', '1 m² = 10 000 cm². Divide by 10 000.']], 'M1'], 'ft-yd': [9, 'ft²', 'yd²', [[3, 'u3l10-conv-3', '1 yd = 3 ft, but 1 yd² = 3 × 3 = 9 ft². Divide by 9.']], 'M2'] };
  function convPart(prompt, x, kind, dp, o) {
    o = o || {}; var c = AC[kind], ans = x / c[0], bad = [[x * c[0], 'u3l10-conv-way', 'The bigger unit needs a <b>smaller</b> number: divide by ' + Np(c[0]) + '.']];
    c[3].forEach(function (w) { bad.push([x / w[0], w[1], w[2]]); bad.push([x * w[0], w[1], w[2]]); });
    return num(prompt, ans, { dp: dp, exact: ans, exactOk: dp == null, after: c[2], bad: bad, sol: [t(N(x) + '\\div ' + N(c[0]) + eqR(ans, dp) + uT(c[2]))], hints: [c[1] + ' → ' + c[2] + ': divide by ' + Np(c[0]) + '.'], text: o.text || kind });
  }

  /* ======================= the lesson ======================= */
  HW.defineLesson({
    id: 'u3l10', unit: 3, num: '10', title: 'Nets and Surface Area of Prisms', outcome: 'M4',
    blurb: 'Faces, edges and vertices; nets of cubes and prisms; face tables; the surface area of boxes, cubes and triangular prisms; open boxes, rooms and real jobs.',
    questions: [
      { num: '1', stem: function (sh) { return 'Complete the table for each prism.' + figRow(sh.ns.map(function (n, i) { return ['(' + 'abc'.charAt(i) + ')' + (n === 4 ? '' : (n === 8 ? ' an ' : ' a ') + n + '-sided base'), n === 4 ? boxFig(3.6, 2, 1.6, {}, { w: 120, h: 100 }) : ngonFig(n, { w: 110, h: 110 })]; })); },
        shared: function (r) { var ns = r.shuffle([4, 5, 6, 8]).slice(0, 3); if (ns.join() === '4,5,6') ns = [5, 4, 8]; return { ns: ns }; },
        parts: [
          { id: '1a', level: 'BEG', make: function (r, sh) {
            var cols = [3, 4, 5, 6, 8].map(function (n) { return { id: 'n' + n, html: PNAME[n].replace(' prism', '') }; }), rows = sh.ns.map(function (n, i) { return { id: 'abc'.charAt(i), html: '(' + 'abc'.charAt(i) + ')' }; }), want = {};
            sh.ns.forEach(function (n, i) { want['abc'.charAt(i)] = 'n' + n; });
            var p = P.grid('Name each prism (tap one name in each row).', rows, cols, want, { colHead: 'prism', why: function (row, got) { var n = sh.ns['abc'.indexOf(row)]; return { code: 'u3l10-name', hint: 'Count the sides of the base of prism (' + row + '): it has ' + n + ' sides. A prism is named for the shape of its base.' }; } },
              sh.ns.map(function (n, i) { return '(' + 'abc'.charAt(i) + ') ' + PNAME[n] + (n === 4 ? '' : ' (' + n + '-sided base)'); }).join('<br>'), ['A prism is named for the shape of its bases: 5 sides = pentagon, 6 = hexagon, 8 = octagon.'], 'prism names');
            return p;
          } },
          { id: '1b', level: 'EMG', make: function (r, sh) {
            var blanks = [], cells = [], key = { rows: ['\\text{Faces}', '\\text{Edges}', '\\text{Vertices}'], cols: ['(a)', '(b)', '(c)'].map(function (s) { return '\\text{' + s + '}'; }), cells: [[], [], []] };
            sh.ns.forEach(function (n, j) {
              var L = '(' + 'abc'.charAt(j) + ')';
              blanks.push({ i: 0, j: j, name: L + ' faces', chk: C().chk(n + 2, { bad: [[n, 'u3l10-no-bases', 'Count the two bases (top and bottom) too.'], [n + 1, 'u3l10-one-base', 'There are <b>two</b> bases, top and bottom.']], miss: 'Faces = the ' + n + ' rectangles around the side + 2 bases.' }) });
              blanks.push({ i: 1, j: j, name: L + ' edges', chk: C().chk(3 * n, { bad: [[2 * n, 'u3l10-no-side-edges', 'Count the edges going up too (one at each corner of the base).'], [n, 'u3l10-one-base', 'Count the edges of the top, the bottom and the edges going up.']], miss: 'Edges = ' + n + ' on top + ' + n + ' on the bottom + ' + n + ' going up. Count the dashed (hidden) ones too.' }) });
              blanks.push({ i: 2, j: j, name: L + ' vertices', chk: C().chk(2 * n, { bad: [[n, 'u3l10-one-base', 'There are corners on the top <b>and</b> on the bottom.']], miss: 'Vertices = the corners of the top + the corners of the bottom.' }) });
              key.cells[0].push(String(n + 2)); key.cells[1].push(String(3 * n)); key.cells[2].push(String(2 * n));
            });
            cells = [[null, null, null], [null, null, null], [null, null, null]];
            return tablePart('Complete the table: number of faces, edges and vertices.', { rows: key.rows, cols: key.cols, cells: cells, corner: '\\text{Number of}', help: 'Tap a box, then type the number.' }, tableChk(blanks), key,
              sh.ns.map(function (n, j) { return '(' + 'abc'.charAt(j) + ') ' + PNAME[n] + ': ' + n + ' rectangles + 2 bases = ' + (n + 2) + ' faces; ' + n + ' + ' + n + ' + ' + n + ' = ' + 3 * n + ' edges; ' + n + ' + ' + n + ' = ' + 2 * n + ' vertices'; }).join('<br>'), ['Count the hidden (dashed) edges too.', 'An n-sided prism: n + 2 faces, 3n edges, 2n vertices.'], 'faces edges vertices');
          } }] },
      { num: '2', stem: function (sh) { return 'Which patterns are nets of a cube?' + figRow(sh.pats.map(function (c, i) { return ['(' + 'abcd'.charAt(i) + ')', squaresFig(c, 21)]; })); },
        shared: function (r) { var yes = r.int(1, 3), kinds = r.shuffle([true, true, true, false, false, false].slice(3 - yes, 3 - yes + 4)), pats = [], keys = []; kinds.forEach(function (k) { var c = pickPattern(r, k, keys); keys.push(canon(c)); pats.push(c); }); return { pats: pats, kinds: kinds }; },
        parts: [{ id: '2', level: 'EMG', make: function (r, sh) {
          var rows = sh.pats.map(function (c, i) { return { id: 'abcd'.charAt(i), html: '(' + 'abcd'.charAt(i) + ')' }; }), want = {};
          sh.kinds.forEach(function (k, i) { want['abcd'.charAt(i)] = k ? 'yes' : 'no'; });
          return P.grid('For each pattern, is it a net of a cube?', rows, [{ id: 'yes', html: 'yes' }, { id: 'no', html: 'no' }], want, { why: function (row, got, w) { var c = sh.pats['abcd'.indexOf(row)]; return { code: w === 'no' ? 'u3l10-net-yes' : 'u3l10-net-no', hint: w === 'no' ? 'Imagine folding (' + row + ')' + (has2x2(c) ? ': a 2 by 2 block folds onto itself, so two faces overlap.' : ': two squares end up on the same face, and one side stays open.') : 'Imagine folding (' + row + ') again: pick one square as the bottom and fold the others up around it. Every face gets exactly one square.' }; } },
            sh.pats.map(function (c, i) { return '(' + 'abcd'.charAt(i) + ') ' + (sh.kinds[i] ? 'yes' : 'no' + (has2x2(c) ? ' (a 2 by 2 block folds onto itself)' : ' (two squares fold onto the same face)')); }).join('<br>'), ['Pick a square to be the bottom. Fold the others up. A net covers all 6 faces with no overlap.'], 'cube nets');
        } }] },
      { num: '3', stem: function (sh) { return 'A small box is ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm high. Each square on the grid is 1 cm long.' + boxFig(sh.l, sh.w, sh.h, { l: sh.l + ' cm', w: sh.w + ' cm', h: sh.h + ' cm' }, { w: 180, h: 130 }); },
        shared: function (r) { return find(function () { return { l: r.int(3, 5), w: r.int(2, 4), h: r.int(1, 3) }; }, function (v) { return v.l > v.w && v.w > v.h || (v.l > v.w && v.w !== v.h && v.l !== v.h); }); },
        parts: [
          { id: '3a', level: 'EMG', make: function (r, sh) {
            var good = rectsOnGrid(boxNetRects(sh.l, sh.w, sh.h, 'good'), 11, 'net'), o = [{ html: good, right: true },
              { html: rectsOnGrid(boxNetRects(sh.l, sh.w, sh.h, 'five'), 11, 'pattern'), why: 'Count the faces: a box needs <b>6</b>. This pattern has only 5.', code: 'u3l10-five' }];
            if (sh.w !== sh.h) o.push({ html: rectsOnGrid(boxNetRects(sh.l, sh.w, sh.h, 'ends'), 11, 'pattern'), why: 'Check the two ends: each end is ' + sh.w + ' cm by ' + sh.h + ' cm.', code: 'u3l10-ends' });
            o.push({ html: rectsOnGrid(boxNetRects(sh.l, sh.w, sh.h, 'strip'), 11, 'pattern'), why: 'The top and bottom are ' + sh.l + ' cm by ' + sh.w + ' cm, not ' + sh.l + ' by ' + sh.h + '.', code: 'u3l10-strip' });
            var p = P.mc(r, 'Which pattern on the grid is a net of the box?', o, good + 'Front and back: ' + sh.l + ' by ' + sh.h + '; top and bottom: ' + sh.l + ' by ' + sh.w + '; two ends: ' + sh.w + ' by ' + sh.h + '.', ['A net has 6 faces in 3 matching pairs. Check each face’s size.'], 'choose net');
            p.input.columns = 2; return p;
          } },
          { id: '3b', level: 'BEG', make: function (r, sh) {
            var a = sh.l * sh.w, b = sh.l * sh.h, c = sh.w * sh.h, S = 2 * (a + b + c);
            return area('Here is a net of the box. Find the surface area by counting squares.' + boxNet(sh.l, sh.w, sh.h, { grid: true, px: 14, label: 'net on a grid' }), S, 'cm', { bad: boxBad(sh.l, sh.w, sh.h),
              miss: 'Count every square of the net (or count each face: top and bottom ' + a + ' each, …).', sol: ['Top, bottom: ' + a + ' squares each', 'Front, back: ' + b + ' each', 'Ends: ' + c + ' each', t([a, a, b, b, c, c].join('+') + '=' + S), 'SA = ' + t(S + uT('cm²'))], hints: ['Count the squares face by face.'], text: 'net count' });
          } }] },
      { num: '4', stem: function (sh) { return 'Use the net to complete the face table and find the surface area of the box.' + boxNet(sh.l, sh.w, sh.h, { edges: { l: sh.l + ' cm', h: sh.h + ' cm', w: sh.w + ' cm', w2: sh.w + ' cm' }, w: 280, h: 300, label: 'net of a box' }); },
        shared: function (r) { return find(function () { return { l: r.int(6, 12), w: r.int(4, 7), h: r.int(2, 5) }; }, function (v) { return v.l > v.w && v.w > v.h && !(v.l === 8 && v.w === 5 && v.h === 3) && !(v.l === 40); }); },
        parts: [{ id: '4', level: 'EMG', make: function (r, sh) { return faceTable('Complete the face table.', sh.l, sh.w, sh.h, 'cm'); } }] },
      { num: '5', stem: 'Find the surface area of each cube or rectangular prism.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var s = r.int(3, 15); return area('(a) a cube with edges ' + s + ' cm', 6 * s * s, 'cm', { bad: cubeBad(s), sol: cubeSol(s, 'cm'), hints: ['A cube has 6 equal square faces: ' + t('SA=6s^2') + '.'], text: 'cube int' }); } },
        { id: '5b', level: 'EMG', make: function (r) { var s = r.pick([1.5, 3.5, 4.5, 5.5, 6.5, 7.5, 1.25, 2.75, 3.75, 4.25]); return area('(b) a cube with edges ' + t(mixT(s)) + ' in', 6 * s * s, 'in', { bad: cubeBad(s).concat([[6 * Math.floor(s) * Math.floor(s), 'u3l10-frac-drop', 'Keep the fraction: ' + t(mixT(s) + '=' + N(s)) + '.']]), sol: [t(mixT(s) + '\\text{ in}=' + N(s) + '\\text{ in}')].concat(cubeSol(s, 'in')), hints: ['Change the mixed number to a decimal, then ' + t('SA=6s^2') + '.'], text: 'cube frac' }); } },
        { id: '5c', level: 'EMG', make: function (r) {
          var v = find(function () { return { l: pickR(r, 1.5, 3.5, 0.5), w: pickR(r, 0.8, 1.6, 0.2), h: pickR(r, 0.4, 1.2, 0.2) }; }, function (v) { return v.l > v.w && v.w > v.h && !(v.l === 2.5 && v.w === 1.2 && v.h === 0.8); });
          return area('(c) a prism ' + N(v.l) + ' m long, ' + N(v.w) + ' m wide, ' + N(v.h) + ' m high', SAbox(v.l, v.w, v.h), 'm', { bad: boxBad(v.l, v.w, v.h), sol: boxLine(v.l, v.w, v.h, 'm'), hints: [t('SA=2lw+2lh+2wh') + '.'], text: 'box dec' });
        } },
        { id: '5d', level: 'PRG', outcome: 'M4', make: function (r) {
          var v = find(function () { return { l: r.int(2, 3), wf: 1, wi: r.pick([3, 6, 9]), hi: r.pick([3, 6, 9]) }; }, function (v) { return !(v.l === 2 && v.wi === 6 && v.hi === 9); });
          var w = v.wf + v.wi / 12, h = v.hi / 12, S = SAbox(v.l, w, h);
          return area('(d) a prism ' + v.l + ' ft long, ' + ftin(v.wf, v.wi) + ' wide, ' + v.hi + ' in high (answer in ft²)', S, 'ft', {
            bad: boxBad(v.l, w, h).concat([[SAbox(v.l, v.wf + v.wi / 10, v.hi / 10), 'u3l10-ftin-dec', 'Inches are twelfths of a foot: ' + t(v.wi + '\\text{ in}=' + v.wi + '\\div 12=' + N(v.wi / 12) + '\\text{ ft}') + ', ' + t(v.hi + '\\text{ in}=' + N(h) + '\\text{ ft}') + '.'], [SAbox(v.l, w, v.hi), 'u3l10-in-not-ft', 'Change ' + v.hi + ' in to feet first (÷ 12).'], [SAbox(v.l * 12, w * 12, v.hi), 'u3l10-in2', 'That’s in square <b>inches</b>. The answer is in ft²: work in feet.']]),
            sol: [ftin(v.wf, v.wi) + ' = ' + N(w) + ' ft; ' + v.hi + ' in = ' + t(v.hi + '\\div 12=' + N(h)) + ' ft'].concat(boxLine(v.l, w, h, 'ft')), hints: ['Change everything to feet first: inches ÷ 12.'], text: 'box ft in' });
        } }] },
      { num: '6', parts: [{ id: '6', level: 'PRG', make: function (r) {
        var v = find(function () { var tr = r.pick(ISO); return { b: tr[0], ht: tr[1], s: tr[2], L: r.pick([8, 10, 12, 15, 20]) }; }, function (v) { return !(v.b === 6 && v.L === 10); });
        return area('Find the surface area of the triangular prism. Its ends are triangles with a base of ' + v.b + ' cm and a height of ' + v.ht + ' cm; both sloping sides are ' + v.s + ' cm.' + triFig(v.b, v.ht, v.b / 2, v.L, { b: v.b + ' cm', ht: v.ht + ' cm', s: v.s + ' cm', L: v.L + ' cm' }), triSA(v.b, v.ht, [v.b, v.s, v.s], v.L), 'cm', { bad: triBad(v.b, v.ht, [v.b, v.s, v.s], v.L, v.s), sol: triSol(v.b, v.ht, [v.b, v.s, v.s], v.L, 'cm').concat(['(The ' + v.s + ' cm sides are used for the rectangles, not the triangles.)']), hints: ['2 triangles (' + t('\\tfrac{1}{2}bh') + ' each) + 3 rectangles (each side × the length).'], text: 'tri prism iso' });
      } }] },
      { num: '7', stem: function (sh) { return 'A rubber curb ramp helps bikes and cars roll up onto a driveway. It is a triangular prism. Its ends are right triangles with sides ' + sh.a + ' in, ' + sh.b + ' in and ' + sh.c + ' in, and the ramp is ' + sh.L + ' in wide.' + triFig(sh.b, sh.a, 0, sh.L, { b: sh.b + ' in', ht: sh.a + ' in', hyp: sh.c + ' in', L: sh.L + ' in' }, { label: 'curb ramp' }); },
        shared: function (r) { return find(function () { var tr = r.pick(RT.filter(function (x) { return x[0] < x[1] && isInt(x[1]); })); return { a: tr[0], b: tr[1], c: tr[2], L: r.pick([18, 20, 24, 30, 36]) }; }, function (v) { return !(v.a === 5 && v.L === 24) || r.chance(0.3); }); },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return area('Find the total surface area of the ramp.', triSA(sh.b, sh.a, [sh.a, sh.b, sh.c], sh.L), 'in', { bad: triBad(sh.b, sh.a, [sh.a, sh.b, sh.c], sh.L, sh.c), sol: triSol(sh.b, sh.a, [sh.a, sh.b, sh.c], sh.L, 'in'), hints: ['2 triangles + 3 rectangles. The two legs (' + sh.a + ' in and ' + sh.b + ' in) are the base and height of the triangle.'], text: 'ramp SA' }); } },
          { id: '7b', level: 'PRG', make: function (r, sh) { var S = triSA(sh.b, sh.a, [sh.a, sh.b, sh.c], sh.L), bot = sh.b * sh.L; return area('The bottom (' + sh.b + ' in by ' + sh.L + ' in) lies on the ground. The rest is painted yellow. Find the area that is painted.', S - bot, 'in', { bad: [[S, 'u3l10-keep-bottom', 'Subtract the bottom: it is not painted.'], [S - sh.a * sh.b, 'u3l10-wrong-face', 'The bottom is the ' + sh.b + ' in by ' + sh.L + ' in rectangle.'], [S - sh.a * sh.L, 'u3l10-wrong-face', 'The bottom is the ' + sh.b + ' in by ' + sh.L + ' in rectangle (the ' + sh.a + ' in side stands up).']], sol: [t(N(S) + '-' + sh.b + '\\times ' + sh.L + '=' + N(S) + '-' + bot + '=' + N(S - bot) + uT('in²'))], hints: ['Total surface area minus the bottom face.'], text: 'ramp painted' }); } }] },
      { num: '8', stem: function (sh) { return sh.who + ' is wrapping a gift box that is ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm high.'; },
        shared: function (r) { return find(function () { var v = { who: r.pick(A().NAMES), l: 5 * r.int(4, 8), w: 5 * r.int(2, 5), h: 5 * r.int(1, 3), P1: 10 * r.int(4, 8), P2: 10 * r.int(3, 6) }; v.S = SAbox(v.l, v.w, v.h); v.PA = v.P1 * v.P2; return v; }, function (v) { return v.l > v.w && v.w > v.h && v.P1 >= v.P2 && Math.abs(v.PA - v.S) > 0.08 * v.S && !(v.l === 30 && v.w === 20 && v.h === 10 && v.P1 === 70); }); },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) { return area('Find the surface area of the box.', sh.S, 'cm', { bad: boxBad(sh.l, sh.w, sh.h), sol: boxLine(sh.l, sh.w, sh.h, 'cm'), hints: [t('SA=2lw+2lh+2wh') + '.'], text: 'gift SA' }); } },
          { id: '8b', level: 'EMG', make: function (r, sh) {
            var enough = sh.PA > sh.S;
            return P.mc(r, 'Her sheet of wrapping paper is ' + sh.P1 + ' cm by ' + sh.P2 + ' cm. Does it have enough area?', [
              { html: enough ? 'Yes: the paper is ' + Np(sh.PA) + ' cm², more than the ' + Np(sh.S) + ' cm² of the box.' : 'No: the paper is ' + Np(sh.PA) + ' cm², less than the ' + Np(sh.S) + ' cm² of the box.', right: true },
              { html: enough ? 'No: the paper is ' + Np(sh.PA) + ' cm², less than the ' + Np(sh.S) + ' cm² of the box.' : 'Yes: the paper is ' + Np(sh.PA) + ' cm², more than the ' + Np(sh.S) + ' cm² of the box.', why: 'Compare the two numbers again: which is bigger?', code: 'u3l10-compare' },
              { html: 'Yes: the paper is ' + (sh.P1 + sh.P2) + ' cm, and the box needs only ' + (sh.l + sh.w + sh.h) + ' cm.', why: 'Compare <b>areas</b> (cm²), not lengths.', code: 'u3l10-lengths' },
              { html: (sh.PA > sh.l * sh.w * sh.h ? 'Yes' : 'No') + ': compare the paper with the box’s ' + Np(sh.l * sh.w * sh.h) + ' cm³.', why: Np(sh.l * sh.w * sh.h) + ' cm³ is the volume. Wrapping covers the outside: compare with the surface area.', code: 'u3l10-volume' }],
              'Paper: ' + t(sh.P1 + '\\times ' + sh.P2 + '=' + N(sh.PA) + uT('cm²')) + '; box: ' + t(N(sh.S) + uT('cm²')) + '. ' + (enough ? 'Yes, there is enough area.' : 'No, there is not enough area.'), ['Find the area of the paper and compare it with the surface area.'], 'enough paper');
          } },
          { id: '8c', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Why does wrapping a box always use more paper than its surface area?', [
              { html: 'The paper overlaps where the edges meet and is folded at the ends, so some parts are covered twice.', right: true },
              { html: 'Surface area only counts the top of the box.', why: 'Surface area counts <b>all 6</b> faces.', code: 'u3l10-sa-top' },
              { html: 'Wrapping paper has to cover the inside of the box too.', why: 'Wrapping covers only the outside.', code: 'u3l10-inside' },
              { html: 'The paper must cover the volume of the box.', why: 'Volume is the space inside; paper covers the faces.', code: 'u3l10-volume' }],
              'The paper overlaps at the seams and is folded at the ends, so some faces are covered twice.', ['Think about how you fold the paper at the ends.'], 'why more paper');
          } }] },
      { num: '9', stem: function (sh) { return 'A glass fish tank has no top. It is ' + sh.l + ' in long, ' + sh.w + ' in wide and ' + sh.h + ' in high.' + boxFig(sh.l, sh.w, sh.h, { l: sh.l + ' in', w: sh.w + ' in', h: sh.h + ' in' }, { open: true, label: 'open fish tank' }); },
        shared: function (r) { return find(function () { var v = { l: r.pick([20, 24, 30, 36, 48]), w: r.pick([10, 12, 13, 18]), h: r.pick([12, 16, 18, 20]) }; v.G = v.l * v.w + 2 * v.l * v.h + 2 * v.w * v.h; return v; }, function (v) { return v.l > v.w && !(v.l === 24 && v.w === 12 && v.h === 16) && isInt(v.G / 144 * 100); }, { l: 30, w: 12, h: 18, G: 30 * 12 + 2 * 30 * 18 + 2 * 12 * 18 }); },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) { var S = SAbox(sh.l, sh.w, sh.h); return area('Which faces are made of glass? Find the area of glass in in².', sh.G, 'in', { bad: [[S, 'u3l10-keep-top', 'The tank has <b>no top</b>: leave the top out (5 faces).'], [S - 2 * sh.l * sh.w, 'u3l10-no-bottom', 'Only the top is missing. The tank still has a bottom.'], [sh.l * sh.w * sh.h, 'u3l10-volume', 'That’s the volume. Add the areas of the 5 glass faces.'], [sh.l * sh.w + sh.l * sh.h + sh.w * sh.h, 'u3l10-once', 'The front and back are two faces, and so are the two ends.']], sol: ['5 faces: the bottom, front, back and two ends.', 'Bottom: ' + t(sh.l + '\\times ' + sh.w + '=' + sh.l * sh.w) + '; front and back: ' + t('2\\times ' + sh.l + '\\times ' + sh.h + '=' + 2 * sh.l * sh.h) + '; ends: ' + t('2\\times ' + sh.w + '\\times ' + sh.h + '=' + 2 * sh.w * sh.h), 'Glass: ' + t(sh.l * sh.w + '+' + 2 * sh.l * sh.h + '+' + 2 * sh.w * sh.h + '=' + N(sh.G) + uT('in²'))], hints: ['No top: bottom + front + back + two ends.'], text: 'tank glass' }); } },
          { id: '9b', level: 'PRG', outcome: 'M2', make: function (r, sh) { return convPart('Change your answer to ft²' + (isInt(sh.G / 144) ? '.' : ', to the nearest hundredth.'), sh.G, 'in-ft', isInt(sh.G / 144) ? null : 2, { text: 'in2 to ft2' }); } }] },
      { num: '10', stem: function (sh) { return 'A bakery shows its menu on a cardboard stand shaped like a triangular prism. The cardboard covers the two ends and the two sloping sides; the bottom is open. The ends are triangles with a base of ' + sh.b + ' cm and a height of ' + sh.ht + ' cm, the sloping sides are ' + sh.s + ' cm, and the stand is ' + sh.L + ' cm long.'; },
        shared: function (r) { return find(function () { var tr = r.pick(ISO.filter(function (x) { return x[0] >= 10; })); var v = { b: tr[0], ht: tr[1], s: tr[2], L: 10 * r.int(5, 10) }; v.A = v.b * v.ht + 2 * v.s * v.L; return v; }, function (v) { return !(v.b === 30 && v.L === 80); }); },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) { var Rr = 2 * sh.s * sh.L, Tt = sh.b * sh.ht; return area('Find the area of cardboard in cm².', sh.A, 'cm', { bad: [[sh.A + sh.b * sh.L, 'u3l10-keep-bottom', 'The bottom is open: leave out the ' + sh.b + ' cm by ' + sh.L + ' cm rectangle.'], [2 * Tt + Rr, 'u3l10-tri-half', 'Each end is ' + t('\\tfrac{1}{2}\\times ' + sh.b + '\\times ' + sh.ht) + '.'], [sh.b * sh.s + Rr, 'u3l10-slant-height', 'For the triangles use the height (' + sh.ht + ' cm), not the slanted side.'], [Tt + 2 * sh.ht * sh.L, 'u3l10-height-rect', 'Each sloping side is ' + sh.s + ' cm by ' + sh.L + ' cm.'], [Tt / 2 + Rr, 'u3l10-one-tri', 'There are two ends.']], sol: ['Two ends: ' + t('2\\times\\tfrac{1}{2}\\times ' + sh.b + '\\times ' + sh.ht + '=' + N(Tt) + uT('cm²')), 'Two sloping sides: ' + t('2\\times(' + sh.s + '\\times ' + sh.L + ')=' + N(Rr) + uT('cm²')), 'Total: ' + t(N(Tt) + '+' + N(Rr) + '=' + N(sh.A) + uT('cm²'))], hints: ['Two triangle ends + two sloping rectangles (no bottom).'], text: 'stand cardboard' }); } },
          { id: '10b', level: 'PRG', outcome: 'M1', make: function (r, sh) { return convPart('Change your answer to m².', sh.A, 'cm-m', null, { text: 'cm2 to m2' }); } }] },
      { num: '11', stem: function (sh) { return 'Marco is putting drywall on the walls and ceiling of his garage workshop. The garage is ' + sh.L + ' ft long, ' + sh.W + ' ft wide and ' + sh.H + ' ft high. He does not cover the big garage door (' + sh.g1 + ' ft by ' + sh.g2 + ' ft) or the side door (3 ft by 7 ft).'; },
        shared: function (r) { return find(function () { var v = { L: r.int(18, 24), W: r.int(11, 16), H: r.pick([8, 9, 10]), g1: r.pick([8, 9, 10]), g2: 7, p: r.pick([14.98, 15.48, 16.48, 17.98]) }; v.S = 2 * v.L * v.H + 2 * v.W * v.H + v.L * v.W; v.A = v.S - v.g1 * v.g2 - 21; v.n = ceil(v.A / 32); return v; }, function (v) { return v.W < v.L && v.g1 < v.W && !isInt(v.A / 32) && !(v.L === 20 && v.W === 12 && v.H === 9); }); },
        parts: [
          { id: '11a', level: 'PRG', make: function (r, sh) { return area('Find the area of the four walls and the ceiling.', sh.S, 'ft', { bad: [[SAbox(sh.L, sh.W, sh.H), 'u3l10-keep-bottom', 'He doesn’t cover the floor. Walls + ceiling only.'], [SAbox(sh.L, sh.W, sh.H) - 2 * sh.L * sh.W, 'u3l10-no-ceiling', 'Add the ceiling (' + sh.L + ' by ' + sh.W + ').'], [sh.L * sh.H + sh.W * sh.H + sh.L * sh.W, 'u3l10-once', 'There are <b>two</b> long walls and <b>two</b> short walls.'], [sh.L * sh.W * sh.H, 'u3l10-volume', 'That’s the volume. Add the areas of the walls and the ceiling.']], sol: ['Long walls: ' + t('2\\times ' + sh.L + '\\times ' + sh.H + '=' + 2 * sh.L * sh.H) + '; short walls: ' + t('2\\times ' + sh.W + '\\times ' + sh.H + '=' + 2 * sh.W * sh.H) + '; ceiling: ' + t(sh.L + '\\times ' + sh.W + '=' + sh.L * sh.W), t(2 * sh.L * sh.H + '+' + 2 * sh.W * sh.H + '+' + sh.L * sh.W + '=' + sh.S + uT('ft²'))], hints: ['4 walls (2 long, 2 short) + ceiling.'], text: 'garage walls' }); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { var gd = sh.g1 * sh.g2; return area('Subtract the two doors.', sh.A, 'ft', { bad: [[sh.S - gd, 'u3l10-one-door', 'Subtract the side door (3 × 7) too.'], [sh.S - 21, 'u3l10-one-door', 'Subtract the garage door too.'], [sh.S - (sh.g1 + sh.g2) - 10, 'u3l10-door-sides', 'Subtract the doors’ <b>areas</b> (width × height).'], [sh.S + gd + 21, 'u3l10-added', 'Subtract the doors.']], sol: [t(sh.g1 + '\\times ' + sh.g2 + '=' + gd) + '; ' + t('3\\times 7=21') + '; ' + t(sh.S + '-' + gd + '-21=' + sh.A + uT('ft²'))], hints: ['Area of each door = width × height.'], text: 'minus doors' }); } },
          { id: '11c', level: 'PRG', make: function (r, sh) { return countUp('A sheet of drywall is 4 ft by 8 ft. How many sheets must he buy?', sh.A, 32, { unit: 'sheets', one: 'a sheet', oneName: 'sheet', pre: ['One sheet: ' + t('4\\times 8=32' + uT('ft²'))], bad: [[sh.A / 12, 'u3l10-sheet', 'One sheet covers ' + t('4\\times 8=32') + ' ft².'], [ceil(sh.A / 12), 'u3l10-sheet', 'One sheet covers ' + t('4\\times 8=32') + ' ft² (not 4 + 8).']], text: 'drywall sheets' }); } },
          { id: '11d', level: 'ADV', make: function (r, sh) { var c0 = sh.n * sh.p, c = c0 * 1.05; return num('Each sheet costs ' + Mp(sh.p) + '. Find the total cost with 5% GST.', c, { money: true, exact: c, bad: [[c0, 'u3l10-no-gst', 'Add the 5% GST: multiply by 1.05.'], [c0 * 0.05, 'u3l10-gst-only', 'That’s only the GST. The total is ' + t('\\text{cost}\\times 1.05') + '.'], [c0 * 1.5, 'u3l10-gst-15', '5% = 0.05, so multiply by 1.05 (not 1.5).'], [sh.A / 32 * sh.p * 1.05, 'u3l10-not-whole', 'Use the whole number of sheets (' + sh.n + ').'], [c0 + 5, 'u3l10-gst-add5', '5% is not $5: multiply by 1.05.']], sol: [t(sh.n + '\\times ' + M(sh.p) + '=' + M(c0)), t(M(c0) + '\\times 1.05=' + '\\$' + raw(c, 3) + '\\approx ' + M(c))], hints: ['Cost of the sheets × 1.05.'], text: 'drywall cost' }); } }] },
      { num: '12', stem: function (sh) { return sh.who + ' was asked for the surface area of a box ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm high. ' + sh.who + ' wrote: ' + t('SA=' + sh.l + '\\times ' + sh.w + '\\times ' + sh.h + '=' + sh.l * sh.w * sh.h + uT('cm²')) + '.'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Jae', 'Noor', 'Kai', 'Rosa']), l: r.int(5, 9), w: r.int(3, 6), h: r.int(2, 5) }; }, function (v) { return v.l > v.w && v.w > v.h && SAbox(v.l, v.w, v.h) !== v.l * v.w * v.h; }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Explain the mistake.', [
              { html: sh.who + ' multiplied the three lengths. That gives the <b>volume</b>, not the surface area (the total area of the 6 faces).', right: true },
              { html: sh.who + ' forgot to multiply by 2.', why: t('2\\times ' + sh.l * sh.w * sh.h) + ' is still not the surface area. What does ' + t('l\\times w\\times h') + ' measure?', code: 'u3l10-times2' },
              { html: sh.who + ' should have added the three lengths.', why: 'Adding lengths gives a length, not an area.', code: 'u3l10-lengths' },
              { html: 'Nothing is wrong: the units should be cm³.', why: 'With cm³ it would be the volume, but the question asks for the surface area.', code: 'u3l10-units' }],
              t(sh.l + '\\times ' + sh.w + '\\times ' + sh.h) + ' is the volume. Surface area adds the areas of the faces: ' + t('SA=2lw+2lh+2wh') + '.', ['What does length × width × height measure?'], 'Jae mistake');
          } },
          { id: '12b', level: 'EMG', make: function (r, sh) { return area('Find the correct surface area.', SAbox(sh.l, sh.w, sh.h), 'cm', { bad: boxBad(sh.l, sh.w, sh.h), sol: boxLine(sh.l, sh.w, sh.h, 'cm'), hints: [t('SA=2lw+2lh+2wh') + '.'], text: 'Jae fixed' }); } }] },
      { num: '13', parts: [{ id: '13', level: 'MAS', make: function (r) {
        var s = r.pick([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1.5, 2.5, 3.5, 4.5]), S = 6 * s * s;
        return num('A cube has a surface area of ' + N(S) + ' cm². How long is each edge?', s, { exactOk: true, after: 'cm', bad: [[S / 6, 'u3l10-face-not-edge', 'That’s the area of <b>one face</b>. The face is a square: the edge is the number that times itself makes ' + N(S / 6) + ' (use √).'], [Math.sqrt(S), 'u3l10-sqrt-first', 'Divide by 6 first (6 faces), then take the square root.'], [S / 4, 'u3l10-four', 'A cube has 6 faces: divide by 6.'], [Math.sqrt(S / 4), 'u3l10-four', 'A cube has 6 faces: divide by 6, then take the square root.'], [S / 12, 'u3l10-edges12', 'Divide by 6 (faces), then find the number that times itself makes the face area.'], [S / 6 / 2, 'u3l10-half', 'The face is ' + t('s\\times s') + ', not ' + t('s\\times 2') + '. Use √ (2nd, ' + t('x^2') + ').']],
          sol: ['One face: ' + t(N(S) + '\\div 6=' + N(S / 6) + uT('cm²')), 'Each face is a square, so the edge is the number that times itself makes ' + N(S / 6) + ': ' + t(N(s) + '\\times ' + N(s) + '=' + N(S / 6)) + ' (or √' + N(S / 6) + ').', 'The edge is ' + N(s) + ' cm. Check: ' + t('6\\times ' + N(s) + '^2=' + N(S)) + ' ✓'], hints: ['Divide by 6 to get one face.', 'Each face is a square: which number times itself gives that area? (√ is 2nd ' + t('x^2') + '.)'], text: 'cube edge from SA' });
      } }] },
      { num: '14', parts: [{ id: '14', level: 'BEG', make: function (r) {
        var s = r.int(2, 9), o = function (x) { return x + ' m²'; };
        return P.mc(r, 'What is the surface area of a cube with edges ' + s + ' m long?', [{ html: o(6 * s * s), right: true }, { html: o(s * s), why: 'That’s one face. A cube has 6.', code: 'u3l10-one-face' }, { html: o(s * s * s), why: 'That’s ' + t(s + '\\times ' + s + '\\times ' + s) + ', the volume.', code: 'u3l10-volume' }, { html: o(4 * s * s), why: 'That counts only 4 faces. Don’t forget the top and bottom.', code: 'u3l10-four' }],
          t('6\\times ' + s + '^2=6\\times ' + s * s + '=' + 6 * s * s + uT('m²')), [t('SA=6s^2')], 'cube MC');
      } }] },
      { num: '15', parts: [{ id: '15', level: 'EMG', make: function (r) {
        var v = find(function () { return { l: r.int(5, 10), w: r.int(3, 6), h: r.int(2, 4) }; }, function (v) { var S = SAbox(v.l, v.w, v.h), o = [S - v.l * v.w, S - 2 * v.l * v.w, v.l * v.w * v.h, S]; return v.l > v.w && v.w > v.h && o.every(function (x, i) { return o.indexOf(x) === i; }) && !(v.l === 6 && v.w === 4 && v.h === 2); });
        var S = SAbox(v.l, v.w, v.h), o = function (x) { return x + ' in²'; };
        return P.mc(r, 'An open box (no top) is ' + v.l + ' in long, ' + v.w + ' in wide and ' + v.h + ' in high. How much cardboard does it use?', [{ html: o(S - v.l * v.w), right: true }, { html: o(S - 2 * v.l * v.w), why: 'Only the top is missing: keep the bottom.', code: 'u3l10-no-bottom' }, { html: o(v.l * v.w * v.h), why: 'That’s ' + t(v.l + '\\times ' + v.w + '\\times ' + v.h) + ', the volume.', code: 'u3l10-volume' }, { html: o(S), why: 'That includes the top. The box is open.', code: 'u3l10-keep-top' }],
          'Closed box: ' + t('2(' + v.l * v.w + ')+2(' + v.l * v.h + ')+2(' + v.w * v.h + ')=' + S) + '; take away the top: ' + t(S + '-' + v.l * v.w + '=' + (S - v.l * v.w) + uT('in²')), ['Find the closed box, then take away the top.'], 'open box MC');
      } }] },
      { num: '16', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { return { A: r.int(60, 140), c: r.pick([30, 35, 40, 45, 50]) }; }, function (v) { var n2 = ceil(2 * v.A / v.c), n1 = ceil(v.A / v.c), f1 = Math.floor(v.A / v.c), f2 = Math.floor(2 * v.A / v.c), o = [n2, n1, f1, f2]; return !isInt(2 * v.A / v.c) && !isInt(v.A / v.c) && f1 > 0 && o.every(function (x, i) { return o.indexOf(x) === i; }) && !(v.A === 95 && v.c === 40); });
        var n2 = ceil(2 * v.A / v.c), o = function (x) { return x + ' cans'; };
        return P.mc(r, 'The walls of a hall have an area of ' + v.A + ' m². They need 2 coats of paint. One can of paint covers ' + v.c + ' m². How many cans must be bought?', [{ html: o(n2), right: true }, { html: o(ceil(v.A / v.c)), why: 'Two coats: paint the area twice.', code: 'u3l10-one-coat' }, { html: o(Math.floor(v.A / v.c)), why: 'Two coats, and round up.', code: 'u3l10-one-coat' }, { html: o(Math.floor(2 * v.A / v.c)), why: 'Round <b>up</b>: fewer cans would not be enough.', code: 'u3l10-round-down' }],
          t(v.A + '\\times 2=' + 2 * v.A + uT('m²')) + '; ' + t(2 * v.A + '\\div ' + v.c + '=' + raw(2 * v.A / v.c, 2)) + ', round up to ' + n2 + ' cans.', ['Double the area, divide by the coverage, round up.'], 'cans MC');
      } }] },
      { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) {
        var v = find(function () { return { l: pickR(r, 1.5, 3, 0.5), w: pickR(r, 1, 2, 0.2), h: pickR(r, 0.8, 1.6, 0.2) }; }, function (v) { var S = SAbox(v.l, v.w, v.h); return v.l > v.w && v.w > v.h && rd(S, 1) < 100 && !(v.l === 2.5 && v.w === 2 && v.h === 1.2); });
        var S = SAbox(v.l, v.w, v.h);
        return area('<b>Numerical response.</b> A wooden crate is ' + N(v.l) + ' m long, ' + N(v.w) + ' m wide and ' + N(v.h) + ' m high. Its surface area, to the nearest tenth of a square metre, is ____ m².', S, 'm', { dp: 1, exact: S, nr: true, bad: boxBad(v.l, v.w, v.h), sol: boxLine(v.l, v.w, v.h, 'm').concat(isInt(S * 10) ? [] : [t('\\approx ' + N(rd(S, 1), 1) + uT('m²'))]), hints: [t('SA=2lw+2lh+2wh') + '.'], text: 'NR crate' });
      } }] },
      { num: '18', parts: [{ id: '18', level: 'ADV', outcome: 'M2', make: function (r) {
        var v = find(function () { return { l: 6 * r.int(4, 8), w: 6 * r.int(2, 5), h: 6 * r.int(1, 4) }; }, function (v) { var S = SAbox(v.l, v.w, v.h) / 144; return v.l > v.w && v.w > v.h && isInt(S) && S < 10000 && !(v.l === 36 && v.w === 24 && v.h === 18); });
        var Si = SAbox(v.l, v.w, v.h), S = Si / 144;
        return area('<b>Numerical response.</b> A moving box is ' + v.l + ' in long, ' + v.w + ' in wide and ' + v.h + ' in high. Its surface area, in square feet, is ____ ft².', S, 'ft', { nr: true, bad: [[Si, 'u3l10-in2', 'That’s in square inches. Divide by 144 (1 ft² = 144 in²).'], [Si / 12, 'u3l10-conv-12', '1 ft² = 12 × 12 = 144 in². Divide by 144.']].concat(boxBad(v.l / 12, v.w / 12, v.h / 12)),
          sol: boxLine(v.l, v.w, v.h, 'in').concat([t(N(Si) + '\\div 144=' + N(S) + uT('ft²')), '(Or change to feet first: ' + N(v.l / 12) + ' ft × ' + N(v.w / 12) + ' ft × ' + N(v.h / 12) + ' ft.)']), hints: ['Change to feet first (÷ 12), or find the in² and divide by 144.'], text: 'NR moving box' });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Name the 3-D object that each net folds into, and give its number of faces.' + figRow(sh.order.map(function (k, i) { return ['(' + 'abc'.charAt(i) + ')', sh.pics[k]]; })); },
        shared: function (r) { var tri = r.pick([3, 4]), cube = pickPattern(r, true, []), l = r.int(3, 5), w = r.int(1, 2), h = pickR(r, 1, 2, 0.5); return { order: r.shuffle(['tri', 'cube', 'box']), pics: { tri: triNet(tri, tri, tri, r.int(4, 5), tri / 2, tri * 0.866, { w: 130, h: 130 }), cube: squaresFig(cube, 18), box: boxNet(l, w, h, { w: 120, h: 140 }) } }; },
        parts: [
          { id: 'e1a', level: 'BEG', make: function (r, sh) {
            var NM = { tri: 'triangular prism', cube: 'cube', box: 'rectangular prism' }, cols = [{ id: 'cube', html: 'cube' }, { id: 'box', html: 'rectangular prism' }, { id: 'tri', html: 'triangular prism' }, { id: 'pyr', html: 'pyramid' }], rows = sh.order.map(function (k, i) { return { id: 'abc'.charAt(i), html: '(' + 'abc'.charAt(i) + ')' }; }), want = {};
            sh.order.forEach(function (k, i) { want['abc'.charAt(i)] = k; });
            return P.grid('Name the 3-D object for each net.', rows, cols, want, { why: function (row, got, w) { return { code: 'u3l10-name', hint: '(' + row + '): ' + (w === 'tri' ? 'two triangles and three rectangles' : w === 'cube' ? 'six equal squares' : 'six rectangles in three matching pairs') + '.' }; } },
              sh.order.map(function (k, i) { return '(' + 'abc'.charAt(i) + ') ' + NM[k]; }).join('<br>'), ['Look at the shapes of the faces.'], 'net names');
          } },
          { id: 'e1b', level: 'BEG', make: function (r, sh) {
            var F = { tri: 5, cube: 6, box: 6 };
            return fields('Give the number of faces of each object.', sh.order.map(function (k, i) { return { label: '(' + 'abc'.charAt(i) + ') faces:', name: '(' + 'abc'.charAt(i) + ')', ans: F[k], miss: 'Count the shapes in the net: each one is a face.' }; }),
              sh.order.map(function (k, i) { return '(' + 'abc'.charAt(i) + ') ' + (k === 'tri' ? '2 triangles + 3 rectangles = 5 faces' : k === 'cube' ? '6 equal squares = 6 faces' : '6 rectangles = 6 faces'); }), ['Each shape in a net is one face.'], 'net faces');
          } }] },
      { num: '2', stem: 'Find the surface area of each cube.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var s = r.int(4, 16); return area('(a) edges ' + s + ' cm', 6 * s * s, 'cm', { bad: cubeBad(s), sol: cubeSol(s, 'cm'), hints: [t('SA=6s^2')], text: 'cube cm' }); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var s = r.pick([0.6, 0.8, 1.2, 1.4, 1.5, 1.6, 1.8, 2.5, 3.5]); return area('(b) edges ' + N(s) + ' m', 6 * s * s, 'm', { bad: cubeBad(s), sol: cubeSol(s, 'm'), hints: [t('SA=6s^2') + '. Use the ' + t('x^2') + ' key.'], text: 'cube m' }); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var s = r.pick([2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5.75, 6.25, 6.75]); return area('(c) edges ' + t(mixT(s)) + ' in', 6 * s * s, 'in', { bad: cubeBad(s).concat([[6 * Math.floor(s) * Math.floor(s), 'u3l10-frac-drop', 'Keep the fraction: ' + t(mixT(s) + '=' + N(s)) + '.']]), sol: [t(mixT(s) + '=' + N(s))].concat(cubeSol(s, 'in')), hints: ['Change ' + t(mixT(s)) + ' to a decimal first.'], text: 'cube quarter' }); } }] },
      { num: '3', stem: 'Find the surface area of each rectangular prism.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var v = find(function () { return { l: r.int(8, 15), w: r.int(5, 10), h: r.int(2, 6) }; }, function (v) { return v.l > v.w && v.w > v.h && !(v.l === 12 && v.w === 9 && v.h === 5); }); return area('(a) ' + v.l + ' cm by ' + v.w + ' cm by ' + v.h + ' cm', SAbox(v.l, v.w, v.h), 'cm', { bad: boxBad(v.l, v.w, v.h), sol: boxLine(v.l, v.w, v.h, 'cm'), hints: [t('SA=2lw+2lh+2wh')], text: 'box cm' }); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var v = find(function () { return { l: r.int(2, 5), w: pickR(r, 1, 3, 0.5), h: pickR(r, 0.5, 1.5, 0.25) }; }, function (v) { return v.l > v.w && v.w > v.h && !(v.l === 3 && v.w === 2 && v.h === 0.5); }); return area('(b) ' + v.l + ' m by ' + N(v.w) + ' m by ' + N(v.h) + ' m', SAbox(v.l, v.w, v.h), 'm', { bad: boxBad(v.l, v.w, v.h), sol: boxLine(v.l, v.w, v.h, 'm'), hints: [t('SA=2lw+2lh+2wh')], text: 'box m' }); } },
        { id: 'e3c', level: 'PRG', make: function (r) {
          var v = find(function () { return { lf: 1, li: r.pick([3, 6, 9]), w: r.pick([10, 12]), hi: r.pick([6, 8, 9]) }; }, function (v) { return !(v.li === 6 && v.w === 12 && v.hi === 8); });
          var l = 12 + v.li, w = v.w, h = v.hi;
          return area('(c) ' + ftin(v.lf, v.li) + ' by ' + (w === 12 ? '1 ft' : w + ' in') + ' by ' + h + ' in (answer in in²)', SAbox(l, w, h), 'in', { bad: boxBad(l, w, h).concat([[SAbox(10 + v.li, w, h), 'u3l10-ft10', '1 ft = 12 in (not 10): ' + ftin(v.lf, v.li) + ' = 12 + ' + v.li + ' = ' + l + ' in.'], [SAbox(1 + v.li / 12, w / 12, h / 12), 'u3l10-ft-not-in', 'The answer is in <b>square inches</b>: change everything to inches.'], [SAbox(1 + v.li, w, h), 'u3l10-ft-not-in', ftin(v.lf, v.li) + ' = 12 + ' + v.li + ' = ' + l + ' in.']]),
            sol: [l + ' in by ' + w + ' in by ' + h + ' in'].concat(boxLine(l, w, h, 'in')), hints: ['Change to inches first: 1 ft = 12 in.'], text: 'box ft-in to in2' });
        } }] },
      { num: '4', stem: function (sh) { return 'A storage tote is ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm high, with a lid.'; },
        shared: function (r) { return find(function () { return { l: 10 * r.int(4, 7), w: 10 * r.int(3, 5), h: 5 * r.int(4, 8) }; }, function (v) { return v.l > v.w && v.w > v.h && !(v.l === 50 && v.w === 40 && v.h === 30) && !(v.l === 40 && v.w === 30 && v.h === 25); }); },
        parts: [
          { id: 'e4a', level: 'EMG', make: function (r, sh) { return faceTable('Complete the face table.', sh.l, sh.w, sh.h, 'cm', { text: 'tote table' }); } },
          { id: 'e4b', level: 'PRG', outcome: 'M1', make: function (r, sh) { return convPart('Write the surface area in m².', SAbox(sh.l, sh.w, sh.h), 'cm-m', null, { text: 'tote m2' }); } }] },
      { num: '5', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
        var v = find(function () { var tr = r.pick(RT.filter(function (x) { return isInt(x[1]) && x[2] >= 10; })); return { a: tr[0], b: tr[1], c: tr[2], L: r.pick([10, 15, 20, 25]) }; }, function (v) { return !(v.a === 9 && v.b === 12 && v.L === 20) && !(v.a === 5 && v.L === 4); });
        return area('Find the surface area of the triangular prism.' + triFig(v.b, v.a, 0, v.L, { b: v.b + ' cm', ht: v.a + ' cm', hyp: v.c + ' cm', L: v.L + ' cm' }), triSA(v.b, v.a, [v.a, v.b, v.c], v.L), 'cm', { bad: triBad(v.b, v.a, [v.a, v.b, v.c], v.L, v.c), sol: triSol(v.b, v.a, [v.a, v.b, v.c], v.L, 'cm'), hints: ['The two legs of the right triangle are its base and height.'], text: 'right tri prism' });
      } }] },
      { num: '6', section: 'B. Applying', parts: [{ id: 'e6', level: 'PRG', make: function (r) {
        var v = find(function () { return { l: r.int(9, 15), w: r.int(7, 11), h: r.pick([1.5, 2, 2.5, 3]) }; }, function (v) { return v.l > v.w && !(v.l === 14 && v.w === 10 && v.h === 2); });
        var S = SAbox(v.l, v.w, v.h), G = S - v.l * v.w;
        return area('A metal baking pan has no top. It is ' + v.l + ' in long, ' + v.w + ' in wide and ' + N(v.h) + ' in deep. How much metal is in the pan?', G, 'in', { bad: [[S, 'u3l10-keep-top', 'The pan has no top: leave out one ' + v.l + ' by ' + v.w + ' face.'], [S - 2 * v.l * v.w, 'u3l10-no-bottom', 'Keep the bottom: only the top is missing.'], [v.l * v.w * v.h, 'u3l10-volume', 'That’s the volume.']],
          sol: ['Bottom: ' + t(v.l + '\\times ' + v.w + '=' + v.l * v.w) + '; long sides: ' + t('2\\times ' + v.l + '\\times ' + N(v.h) + '=' + N(2 * v.l * v.h)) + '; ends: ' + t('2\\times ' + v.w + '\\times ' + N(v.h) + '=' + N(2 * v.w * v.h)), 'Metal: ' + t(v.l * v.w + '+' + N(2 * v.l * v.h) + '+' + N(2 * v.w * v.h) + '=' + N(G) + uT('in²'))], hints: ['No top: bottom + 2 long sides + 2 ends.'], text: 'pan' });
      } }] },
      { num: '7', stem: function (sh) { return sh.who + ' is painting the walls and ceiling of a storage room with one coat. The room is ' + N(sh.L) + ' m long, ' + N(sh.W) + ' m wide and ' + N(sh.H) + ' m high. The door is 0.8 m by 2 m and is not painted. A 1 L can of paint covers ' + sh.c + ' m² and costs ' + Mp(sh.p) + '.'; },
        shared: function (r) { return find(function () { var v = { who: r.pick(['Nia', 'Hana', 'Theo', 'Malik']), L: pickR(r, 2.6, 4, 0.2), W: pickR(r, 2, 3, 0.2), H: r.pick([2.4, 2.5, 2.6]), c: r.pick([8, 10, 12]), p: r.pick([16.99, 18.99, 21.49]) }; v.S = 2 * v.L * v.H + 2 * v.W * v.H + v.L * v.W; v.A = q(v.S - 1.6); return v; }, function (v) { return v.W < v.L && !isInt(v.A / v.c) && !(v.L === 3 && v.W === 2.4 && v.H === 2.4) && !(v.L === 4 && v.W === 3.5); }); },
        parts: [
          { id: 'e7a', level: 'PRG', make: function (r, sh) { return area('Find the area to be painted.', sh.A, 'm', { bad: [[sh.S, 'u3l10-door', 'Subtract the door (0.8 × 2).'], [SAbox(sh.L, sh.W, sh.H) - 1.6, 'u3l10-keep-bottom', 'Don’t paint the floor: walls + ceiling only.'], [sh.S - sh.L * sh.W - 1.6, 'u3l10-no-ceiling', 'Paint the ceiling too.'], [sh.S - 2.8, 'u3l10-door-sides', 'Subtract the door’s <b>area</b>: 0.8 × 2 = 1.6.']], sol: ['Long walls: ' + t('2\\times ' + N(sh.L) + '\\times ' + N(sh.H) + '=' + N(2 * sh.L * sh.H)) + '; short walls: ' + t('2\\times ' + N(sh.W) + '\\times ' + N(sh.H) + '=' + N(2 * sh.W * sh.H)) + '; ceiling: ' + t(N(sh.L) + '\\times ' + N(sh.W) + '=' + N(sh.L * sh.W)), t(N(2 * sh.L * sh.H) + '+' + N(2 * sh.W * sh.H) + '+' + N(sh.L * sh.W) + '=' + N(sh.S)) + '; door: ' + t('0.8\\times 2=1.6') + '; ' + t(N(sh.S) + '-1.6=' + N(sh.A) + uT('m²'))], hints: ['4 walls + ceiling − door.'], text: 'storage room paint' }); } },
          { id: 'e7b', level: 'PRG', make: function (r, sh) { var n = ceil(sh.A / sh.c); return fields('How many cans must ' + (['Theo', 'Malik'].indexOf(sh.who) >= 0 ? 'he' : 'she') + ' buy, and what do they cost before tax?', [{ label: 'Cans:', name: 'cans', ans: n, dp: 0, bad: [[Math.floor(sh.A / sh.c), 'u3l10-round-down', 'Round <b>up</b>: fewer cans won’t cover the room.']] }, { label: 'Cost:', name: 'cost', ans: n * sh.p, money: true, bad: [[sh.A / sh.c * sh.p, 'u3l10-not-whole', 'Use the whole number of cans (' + n + ').'], [Math.floor(sh.A / sh.c) * sh.p, 'u3l10-round-down', 'Use ' + n + ' cans (rounded up).']] }], [t(N(sh.A) + '\\div ' + sh.c + '=' + raw(sh.A / sh.c, 3)) + ', round up to ' + n + ' cans; ' + t(n + '\\times ' + M(sh.p) + '=' + M(n * sh.p))], ['Divide, round up, multiply by the price.'], 'cans cost'); } }] },
      { num: '8', stem: function (sh) { return 'A pup tent is a triangular prism. The front triangle is ' + sh.b + ' ft wide at the bottom and ' + sh.ht + ' ft high. Each sloping side is ' + sh.s + ' ft, and the tent is ' + sh.L + ' ft long.' + triFig(sh.b, sh.ht, sh.b / 2, sh.L, { b: sh.b + ' ft', ht: sh.ht + ' ft', s: sh.s + ' ft', L: sh.L + ' ft' }, { label: 'pup tent' }); },
        shared: function (r) { return find(function () { var tr = r.pick([[6, 4, 5], [8, 3, 5], [5, 6, 6.5], [9, 6, 7.5], [4.8, 3.2, 4]]); var v = { b: tr[0], ht: tr[1], s: tr[2], L: r.int(6, 9) }; v.S = v.b * v.ht + 2 * v.s * v.L + v.b * v.L; return v; }, function (v) { return !isInt(v.S / 9) && !(v.b === 6 && v.L === 7); }); },
        parts: [
          { id: 'e8a', level: 'PRG', make: function (r, sh) { return area('Find the area of fabric for the whole tent, including the floor.', sh.S, 'ft', { bad: triBad(sh.b, sh.ht, [sh.b, sh.s, sh.s], sh.L, sh.s).concat([[sh.S - sh.b * sh.L, 'u3l10-no-floor', 'Include the floor (' + sh.b + ' by ' + sh.L + ').']]), sol: triSol(sh.b, sh.ht, [sh.s, sh.s, sh.b], sh.L, 'ft'), hints: ['2 ends + 2 sloping sides + floor.'], text: 'pup tent' }); } },
          { id: 'e8b', level: 'PRG', outcome: 'M2', make: function (r, sh) { return convPart('Change your answer to square yards, to the nearest tenth.', sh.S, 'ft-yd', 1, { text: 'ft2 to yd2' }); } }] },
      { num: '9', stem: function (sh) { return 'A shipping crate with a lid is built from plywood. It is ' + sh.l + ' ft long, ' + sh.w + ' ft wide and ' + t(mixT(sh.h)) + ' ft high. Plywood comes in 4 ft by 8 ft sheets that cost ' + Mp(sh.p) + ' each.'; },
        shared: function (r) { return find(function () { var v = { l: r.int(3, 6), w: r.int(2, 4), h: pickR(r, 1.5, 3.5, 0.5), p: r.pick([38.97, 42.97, 46.98, 52.47]) }; v.S = SAbox(v.l, v.w, v.h); return v; }, function (v) { return v.l > v.w && !isInt(v.h) && !isInt(v.S / 32) && !(v.l === 4 && v.w === 3 && v.h === 2.5); }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return area('Find the surface area of the crate.', sh.S, 'ft', { bad: boxBad(sh.l, sh.w, sh.h), sol: [t(mixT(sh.h) + '=' + N(sh.h))].concat(boxLine(sh.l, sh.w, sh.h, 'ft')), hints: [t('SA=2lw+2lh+2wh') + '. ' + t(mixT(sh.h) + '=' + N(sh.h)) + '.'], text: 'crate SA' }); } },
          { id: 'e9b', level: 'PRG', make: function (r, sh) { var n = ceil(sh.S / 32); return fields('How many sheets are needed (by area), and what do they cost before tax?', [{ label: 'Sheets:', name: 'sheets', ans: n, dp: 0, bad: [[Math.floor(sh.S / 32), 'u3l10-round-down', 'Round <b>up</b>.'], [ceil(sh.S / 12), 'u3l10-sheet', 'One sheet covers ' + t('4\\times 8=32') + ' ft².']] }, { label: 'Cost:', name: 'cost', ans: n * sh.p, money: true, bad: [[sh.S / 32 * sh.p, 'u3l10-not-whole', 'Use the whole number of sheets (' + n + ').']] }], ['One sheet: 32 ft²; ' + t(N(sh.S) + '\\div 32=' + raw(sh.S / 32, 3)) + ', round up to ' + n + ' sheets; ' + t(n + '\\times ' + M(sh.p) + '=' + M(n * sh.p))], ['One sheet covers 4 × 8 = 32 ft².'], 'crate sheets'); } }] },
      { num: '10', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var v = find(function () { var s = r.pick([6, 8, 10, 12]); return { l: s, w: s, h: r.int(2, 5) }; }, function (v) { var S = SAbox(v.l, v.w, v.h), o = [S, v.l * v.w * v.h, S / 2, S - 2 * v.l * v.h]; return o.every(function (x, i) { return o.indexOf(x) === i; }) && !(v.l === 10 && v.h === 4); });
        var S = SAbox(v.l, v.w, v.h), o = function (x) { return x + ' cm²'; };
        return P.mc(r, 'A box is ' + v.l + ' cm long, ' + v.w + ' cm wide and ' + v.h + ' cm high. What is its surface area?', [{ html: o(S), right: true }, { html: o(v.l * v.w * v.h), why: 'That’s the volume.', code: 'u3l10-volume' }, { html: o(S / 2), why: 'That counts each face once. There are two of each.', code: 'u3l10-once' }, { html: o(S - 2 * v.l * v.h), why: 'That leaves out one pair of faces.', code: 'u3l10-pair' }],
          t('2(' + v.l * v.w + ')+2(' + v.l * v.h + ')+2(' + v.w * v.h + ')=' + 2 * v.l * v.w + '+' + 2 * v.l * v.h + '+' + 2 * v.w * v.h + '=' + S + uT('cm²')), [t('SA=2lw+2lh+2wh')], 'box MC');
      } }] },
      { num: '11', parts: [{ id: 'e11', level: 'PRG', make: function (r) {
        var s = r.pick([1.4, 1.6, 1.8, 2.2, 2.6, 2.8, 3.2, 3.4, 3.6]), S = 6 * s * s;
        return area('<b>Numerical response.</b> A small garden shed is shaped like a cube with edges ' + N(s) + ' m long. The surface area of the whole shed (all 6 faces), to the nearest tenth of a square metre, is ____ m².', S, 'm', { dp: 1, exact: S, nr: true, bad: cubeBad(s), sol: [t('6\\times ' + N(s) + '^2=6\\times ' + N(s * s) + eqR(S, 1) + uT('m²'))], hints: [t('SA=6s^2')], text: 'NR shed' });
      } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'Two boxes hold the same amount. Box A is ' + sh.l + ' cm by ' + sh.w + ' cm by ' + sh.h + ' cm. Box B is a cube with edges ' + sh.s + ' cm.'; },
        shared: function (r) { return r.pick([{ l: 16, w: 8, h: 4, s: 8 }, { l: 25, w: 10, h: 4, s: 10 }, { l: 18, w: 12, h: 8, s: 12 }, { l: 24, w: 9, h: 8, s: 12 }, { l: 32, w: 8, h: 2, s: 8 }, { l: 27, w: 8, h: 8, s: 12 }, { l: 40, w: 5, h: 5, s: 10 }]); },
        parts: [
          { id: 'e12a', level: 'ADV', make: function (r, sh) { var SA_ = SAbox(sh.l, sh.w, sh.h), SB = 6 * sh.s * sh.s; return fields('Find the surface area of each box.', [{ label: 'Box A:', name: 'Box A', ans: SA_, after: 'cm²', bad: boxBad(sh.l, sh.w, sh.h) }, { label: 'Box B:', name: 'Box B', ans: SB, after: 'cm²', bad: cubeBad(sh.s) }], ['A: ' + boxLine(sh.l, sh.w, sh.h, 'cm').join(' '), 'B: ' + t('6\\times ' + sh.s + '^2=' + SB + uT('cm²'))], [t('SA=2lw+2lh+2wh') + ' and ' + t('SA=6s^2') + '.'], 'two boxes SA'); } },
          { id: 'e12b', level: 'MAS', make: function (r, sh) { var SA_ = SAbox(sh.l, sh.w, sh.h), SB = 6 * sh.s * sh.s, pc = (SA_ - SB) / SA_ * 100; return num('Box B uses less cardboard. What percent less cardboard than Box A, to the nearest tenth of a percent?', pc, { dp: 1, exact: pc, after: '%', ansTex: N(rd(pc, 1), 1) + '\\%', bad: [[(SA_ - SB) / SB * 100, 'u3l10-pct-base', 'Compare with <b>Box A</b> (the one you start from): divide the difference by ' + SA_ + '.'], [SA_ - SB, 'u3l10-pct-diff', 'That’s the difference in cm². Divide it by Box A’s area and multiply by 100.'], [SB / SA_ * 100, 'u3l10-pct-ratio', 'That’s B as a percent of A. “Percent less” = difference ÷ A × 100.'], [(SA_ - SB) / SA_, 'u3l10-pct-100', 'Multiply by 100 to get a percent.']], sol: ['Box B uses ' + t(SA_ + '-' + SB + '=' + (SA_ - SB) + uT('cm²')) + ' less.', t((SA_ - SB) + '\\div ' + SA_ + '\\times 100=' + raw(pc, 2) + '\\approx ' + N(rd(pc, 1), 1) + '\\%')], hints: ['Percent less = difference ÷ Box A × 100.'], text: 'percent less' }); } }] },
      { num: '13', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
        var v = find(function () { return { l: r.int(5, 10), w: r.int(3, 6), h: r.int(2, 8) }; }, function (v) { return v.l > v.w && !(v.l === 6 && v.w === 4 && v.h === 5); });
        var S = SAbox(v.l, v.w, v.h), tb = 2 * v.l * v.w, side = S - tb, per = 2 * (v.l + v.w);
        return num('A closed box has a base ' + v.l + ' cm long and ' + v.w + ' cm wide. Its surface area is ' + S + ' cm². How high is the box?', v.h, { exactOk: true, after: 'cm', bad: [[side, 'u3l10-h-area', 'That’s the area of the four sides. They wrap around the base (' + per + ' cm around): divide by ' + per + '.'], [(S - v.l * v.w) / per, 'u3l10-h-onebase', 'There are two bases (top and bottom): subtract ' + t('2\\times ' + v.l + '\\times ' + v.w) + '.'], [S / per, 'u3l10-h-nobase', 'Subtract the top and bottom first.'], [side / (v.l + v.w), 'u3l10-h-half', 'The sides go all the way around the base: ' + t(v.l + '+' + v.w + '+' + v.l + '+' + v.w + '=' + per) + ' cm.'], [side / 4, 'u3l10-h-four', 'The four sides are not equal: divide by the distance around the base (' + per + ' cm).']],
          sol: ['Top and bottom: ' + t('2\\times ' + v.l + '\\times ' + v.w + '=' + tb + uT('cm²')), 'The four sides make ' + t(S + '-' + tb + '=' + side + uT('cm²')) + '.', 'The sides go all the way around the base: ' + t(v.l + '+' + v.w + '+' + v.l + '+' + v.w + '=' + per) + ' cm, so ' + t(per + '\\times h=' + side) + ' and ' + t('h=' + side + '\\div ' + per + '=' + v.h) + ' cm.', 'Check: ' + t('2(' + v.l + ')(' + v.w + ')+2(' + v.l + ')(' + v.h + ')+2(' + v.w + ')(' + v.h + ')=' + S) + ' ✓'], hints: ['Take away the top and bottom first.', 'The four sides wrap around the base like a label: (distance around the base) × h.'], text: 'height from SA' });
      } }] },
      { num: '14', parts: [{ id: 'e14', level: 'ADV', outcome: 'M1', make: function (r) {
        var v = find(function () { return { l: 10 * r.int(5, 8), w: 10 * r.int(3, 5), h: 10 * r.int(2, 4) }; }, function (v) { return v.l > v.w && v.w > v.h && !(v.l === 60 && v.w === 40 && v.h === 30); });
        var S = SAbox(v.l, v.w, v.h), m2 = S / 10000, f2 = m2 * 10.76;
        return fields('A plastic bin is ' + v.l + ' cm long, ' + v.w + ' cm wide and ' + v.h + ' cm high, with a lid. Find its surface area in cm², in m², and in ft² (use 1 m² ≈ 10.76 ft²; round to the nearest tenth).', [
          { label: 'In cm²:', name: 'cm²', ans: S, after: 'cm²', bad: boxBad(v.l, v.w, v.h) },
          { label: 'In m²:', name: 'm²', ans: m2, after: 'm²', exactOk: true, bad: [[S / 100, 'u3l10-conv-100', '1 m² = 10 000 cm². Divide by 10 000.'], [S / 1000, 'u3l10-conv-1000', '1 m² = 10 000 cm².']] },
          { label: 'In ft²:', name: 'ft²', ans: f2, dp: 1, exact: f2, after: 'ft²', bad: [[m2 / 10.76, 'u3l10-conv-way', 'A square foot is smaller than a square metre, so there are <b>more</b> ft²: multiply by 10.76.'], [S / 929, 'u3l10-conv-929', 'Use 1 m² ≈ 10.76 ft²: multiply the m² by 10.76.']] }],
          boxLine(v.l, v.w, v.h, 'cm').concat([t(N(S) + '\\div 10\\,000=' + N(m2) + uT('m²')), t(N(m2) + '\\times 10.76' + eqR(f2, 1) + uT('ft²'))]), ['cm² → m²: ÷ 10 000. m² → ft²: × 10.76.'], 'bin three units');
      } }] }
    ]
  });
})(window);
