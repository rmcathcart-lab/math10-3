/* Math 10-3 · Unit 6 · Lesson 2 — Are They Similar? Checking Angles and Side Ratios (G3)
 * Assignment 2 (u6_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u6_ep02.tex, A 1–4, B 5–11, C 12–15).
 * Every part is a generator: the booklet situation with new numbers around the booklet's (the worked-example numbers —
 * ABCD 6, 4, 3, 5 → 9, 6, 4.5, 7.5; the 2 cm square and 3 cm rhombus; EFGH/JKLM with 75°, 105°, 80°; Kiara's 5 in by 7 in
 * photo; the flags; the 20 × 30 × 40 boxes and 4 × 10 / 6 × 12 cans; the 10/4 and 15/6.5 parallelograms; the 20 × 30
 * picture with a 5 cm mat; Owen's 24 × 40 and 50 × 30; the 25/32 cm stop signs — are left out). Calculator allowed.
 * Ratios are to 2 decimal places (exact ones as they are; 3 or more correct decimals are fine).
 * Hints aimed at real mistakes: a ratio flipped (original ÷ new, or short ÷ long), long matched with short, units not
 * changed (cm and m) before dividing, "three ratios match so it's similar", "the angles match so it's similar", adding the
 * same amount to every side (a frame or border), the wrong angle sum, next-door angles in a parallelogram taken as equal,
 * the exterior angle 360° ÷ n or the angle sum given for one angle of a regular polygon.
 * Conversions for answering on screen:
 *   "fill in the blanks" (corresponding parts) → letter boxes; the definition and "how many must fail" → multiple choice;
 *   ratio tables → one ratio box per row; "Similar? Scale factor? Enlargement or reduction?" → multiple choice (or
 *   yes/no + k + type boxes); "are they similar? explain" → ratio boxes + a yes/no box, or multiple choice whose options
 *   pair the decision with the reason; "use a ruler and a protractor" (shapes drawn full size) → the sides are printed on
 *   the drawing and the angle is read from a protractor laid on it (±1°); rectangle tables → long ÷ short boxes + a yes/no
 *   tap table; "always, sometimes or never" → a tap table; "which boxes are similar" → yes/no boxes + k; "describe or
 *   sketch a shape" → choose the shape (multiple choice).
 * Uses HW.u6kit from js/lessons/u6l1.js (load that file first). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, KT = HW.u6kit;
  if (!KT || !KT.fieldsPart || !KT.corrFields) throw new Error('js/lessons/u6l2.js needs HW.u6kit from js/lessons/u6l1.js: load it first');
  var rd = KT.rd, q = KT.q, near = KT.near, nS = KT.nS, N = KT.N, dgT = KT.dgT, places = KT.places, find = KT.find, br = KT.br, cap = KT.cap, U = KT.U, uT = KT.uT, toN = KT.toN,
    person = KT.person, QUADS = KT.QUADS, PENTS = KT.PENTS, twoNames = KT.twoNames, sideOf = KT.sideOf, readNum = KT.readNum, num = KT.num, fld = KT.fld, angFld = KT.angFld,
    kFld = KT.kFld, kPart = KT.kPart, nameFld = KT.nameFld, yesNoFld = KT.yesNoFld, typeFld = KT.typeFld, typeOf = KT.typeOf, fieldsPart = KT.fieldsPart, table = KT.table, mc = KT.mc,
    pairSVG = KT.pairSVG, corrNames = KT.corrNames;

  /* ================= ratios to 2 decimal places ================= */
  /* right: the exact value, or any value with 2+ decimals within 0.005 of it (1.33, 1.333, 1.3333); fewer decimals that are
   * close get a nudge. o.diag [{v, code, hint}] (wrong, matched within 0.006) */
  function ratioChk(x, o) {
    o = o || {}; var dgs = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && Math.abs(rd(m.v, 2) - rd(x, 2)) > 1e-9 && Math.abs(m.v - x) > 0.0101; });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (near(v, x, 1e-9) || (d >= 2 && Math.abs(v - x) <= 0.00501)) return ok();
      for (var i = 0; i < dgs.length; i++) if (near(v, dgs[i].v, 1e-9) || (d >= 2 && Math.abs(v - dgs[i].v) <= 0.006) || (d < 2 && near(v, rd(dgs[i].v, d), 1e-9))) return wrong(dgs[i].code, dgs[i].hint);
      if (d < 2 && Math.abs(v - x) < Math.pow(10, -d)) return form('u6k-places', 'Give the ratio to 2 decimal places (like 1.33).');
      return wrong('value', o.miss || null);
    };
  }
  function rKey(x) { return near(x, rd(x, 2), 1e-9) ? nS(rd(x, 2)) : rd(x, 2).toFixed(2); }
  function rTex(a, b) { var x = a / b; return t(N(a) + '\\div ' + N(b) + (near(x, rd(x, 2), 1e-9) ? '=' + N(rd(x, 2)) : '\\approx ' + rd(x, 2).toFixed(2))); }
  /* a ratio box num ÷ den. o: { name, flipHint, diag } */
  function ratioFld(label, a, b, o) {
    o = o || {}; var x = a / b, dg = (o.diag || []).slice();
    if (Math.abs(rd(b / a, 2) - rd(x, 2)) > 1e-9) dg.push({ v: b / a, code: 'u6l2-flip', hint: o.flipHint || 'Upside down: divide the same way every time (' + N(a) + ' ÷ ' + N(b) + ').' });
    dg.push({ v: a - b, code: 'k-subtract', hint: 'A ratio is a <b>division</b>, not a difference.' });
    return { label: label, name: o.name, chk: ratioChk(x, { diag: dg }), key: rKey(x), show: rTex(a, b), bad: dg.filter(function (m) { return Math.abs(rd(m.v, 2) - rd(x, 2)) > 0.011; }).map(function (m) { return rKey(m.v); }) };
  }
  function ratioPart(prompt, a, b, o) {
    o = o || {}; var f = ratioFld('', a, b, o);
    return { prompt: prompt, input: { type: 'number', after: o.after }, check: f.chk, key: f.key, answer: f.show, solution: o.sol, hints: o.hints || [], text: o.text, bad: f.bad, good: [] };
  }
  function rowBox(items) {
    return '<div style="display:flex;flex-wrap:wrap;gap:10px 30px;align-items:flex-end;justify-content:center;margin:6px 0">' + items.map(function (x) { return '<div style="text-align:center">' + x[0] + (x[1] ? '<div style="font-size:0.9em;opacity:0.75">' + x[1] + '</div>' : '') + '</div>'; }).join('') + '</div>';
  }
  /* yes/no grid (a tap table) */
  function yesNoGrid(prompt, rows, sol, hints, text, why) {
    var want = {}; rows.forEach(function (rw) { want[rw.id] = rw.yes ? 'yes' : 'no'; });
    return P.grid(prompt, rows.map(function (rw) { return { id: rw.id, html: rw.html }; }), [{ id: 'yes', html: 'similar' }, { id: 'no', html: 'not similar' }], want,
      { why: why || function (row) { var rw = rows.filter(function (x) { return x.id === row; })[0]; return { code: 'u6k-yes-no', hint: 'Check ' + rw.html + ' again: ' + (rw.why || 'compare its ratio with the original’s.') }; } }, sol, hints, text);
  }

  /* ================= a polygon drawing (math units, y up) with side labels, vertex names and angle marks ================= */
  var INK = '#1d2633', FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* o: { px (pixels per unit) | size (the longest side of the box, px; default 150), names, sides, angles (labels by vertex; ' ' = a mark only), fill } */
  function polyFig(pts, o) {
    o = o || {};
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), y1 = Math.max.apply(null, ys);
    var w = Math.max.apply(null, xs) - x0, h = y1 - Math.min.apply(null, ys), s = o.px || (o.size || 150) / Math.max(w, h, 1e-6);
    var S = pts.map(function (p) { return [(p[0] - x0) * s, (y1 - p[1]) * s]; }), n = S.length, C = [0, 0], bb = [1e9, 1e9, -1e9, -1e9], out = '';
    S.forEach(function (p) { C[0] += p[0] / n; C[1] += p[1] / n; });
    function grow(x, y, rx, ry) { bb[0] = Math.min(bb[0], x - rx); bb[1] = Math.min(bb[1], y - ry); bb[2] = Math.max(bb[2], x + rx); bb[3] = Math.max(bb[3], y + ry); }
    function text(x, y, str, size, color, it) { var ww = String(str).length * size * 0.3 + 2; out += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="' + (color || INK) + '"' + (it ? ' font-style="italic"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3.5">' + esc(str).replace(/-/g, '−') + '</text>'; grow(x, y, ww, size * 0.62); }
    S.forEach(function (p) { grow(p[0], p[1], 0, 0); });
    out += '<polygon points="' + S.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" fill="' + (o.fill || '#e9edf4') + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>';
    S.forEach(function (V, i) {
      var A = S[(i + n - 1) % n], B = S[(i + 1) % n], da = Math.atan2(A[1] - V[1], A[0] - V[0]), db = Math.atan2(B[1] - V[1], B[0] - V[0]);
      var span = db - da; while (span <= -Math.PI) span += 2 * Math.PI; while (span > Math.PI) span -= 2 * Math.PI;
      var mid = da + span / 2, deg = Math.abs(span) * 180 / Math.PI, lab = o.angles ? o.angles[i] : null;
      if (lab != null && lab !== '') {
        if (Math.abs(deg - 90) < 0.5) { var k = 10, u = [Math.cos(da), Math.sin(da)], v = [Math.cos(db), Math.sin(db)]; out += '<path d="M' + f1(V[0] + u[0] * k) + ' ' + f1(V[1] + u[1] * k) + 'L' + f1(V[0] + (u[0] + v[0]) * k) + ' ' + f1(V[1] + (u[1] + v[1]) * k) + 'L' + f1(V[0] + v[0] * k) + ' ' + f1(V[1] + v[1] * k) + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/>'; }
        else { var r = deg < 50 ? 26 : 18, p1 = [V[0] + r * Math.cos(da), V[1] + r * Math.sin(da)], p2 = [V[0] + r * Math.cos(db), V[1] + r * Math.sin(db)]; out += '<path d="M' + f1(p1[0]) + ' ' + f1(p1[1]) + 'A' + r + ' ' + r + ' 0 0 ' + (span > 0 ? 1 : 0) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]) + '" fill="none" stroke="' + INK + '" stroke-width="1.5"/>'; }
        if (String(lab).trim()) { var lr = (deg < 50 ? 26 : 18) + 8 + String(lab).length * 4.2 / Math.max(0.35, Math.sin(Math.abs(span) / 2)); text(V[0] + lr * Math.cos(mid), V[1] + lr * Math.sin(mid), lab, 13); }
      }
      if (o.names && o.names[i]) { var ox = V[0] - C[0], oy = V[1] - C[1], L = Math.hypot(ox, oy) || 1; text(V[0] + ox / L * 13, V[1] + oy / L * 13, o.names[i], 15, INK, false); }
      if (o.sides && o.sides[i] != null && o.sides[i] !== '') {
        var M = [(V[0] + B[0]) / 2, (V[1] + B[1]) / 2], nx = -(B[1] - V[1]), ny = B[0] - V[0], NL = Math.hypot(nx, ny); nx /= NL; ny /= NL;
        if ((C[0] - M[0]) * nx + (C[1] - M[1]) * ny > 0) { nx = -nx; ny = -ny; }
        var str = String(o.sides[i]), ext = Math.abs(nx) * (str.length * 14 * 0.3 + 3) + Math.abs(ny) * 14 * 0.6, dd = 6 + ext;
        text(M[0] + nx * dd, M[1] + ny * dd, str, 14, str === '?' ? '#c93a33' : INK);
      }
    });
    var pad = 6, X = bb[0] - pad, Y = bb[1] - pad, W = bb[2] - bb[0] + 2 * pad, H = bb[3] - bb[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(X) + ' ' + f1(Y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(W * 1.15) + 'px" role="img" aria-label="' + (o.aria || 'polygon') + '">' + out + '</svg>';
  }
  function paraPts(a, b, th) { var c = Math.cos(th * Math.PI / 180) * b, s = Math.sin(th * Math.PI / 180) * b; return [[0, 0], [a, 0], [a + c, s], [c, s]]; }
  KT.polyFig = polyFig; KT.paraPts = paraPts; KT.ratioChk = ratioChk; KT.ratioFld = ratioFld; KT.ratioPart = ratioPart; KT.rowBox = rowBox; KT.rTex = rTex; KT.yesNoGrid = yesNoGrid;

  /* ================= banks ================= */
  var ALWAYS = ['two squares', 'two equilateral triangles', 'two regular pentagons', 'two regular hexagons', 'two regular octagons'];
  var SOMETIMES = ['two rectangles', 'two rhombuses', 'two parallelograms', 'two isosceles triangles', 'two right triangles', 'two trapezoids'];
  var NEVER = ['a square and a regular hexagon', 'an equilateral triangle and a square', 'a regular pentagon and a regular hexagon', 'a triangle and a rectangle', 'a square and a regular octagon'];
  var ASN_WHY = { always: 'Regular polygons with the same number of sides always pass both tests (equal angles, every side ratio the same).', sometimes: 'These can have different side ratios (or different angles): you must check.', never: 'A different number of sides: the corners can’t be matched.' };
  function asnGrid(r, prompt, n, text) {
    var pick = [{ s: r.pick(ALWAYS), w: 'always' }, { s: r.pick(SOMETIMES), w: 'sometimes' }, { s: r.pick(NEVER), w: 'never' }];
    while (pick.length < n) { var w0 = r.pick(['always', 'sometimes', 'sometimes', 'never']), bank = w0 === 'always' ? ALWAYS : w0 === 'sometimes' ? SOMETIMES : NEVER, s0 = find(function () { return r.pick(bank); }, function (x) { return pick.every(function (p) { return p.s !== x; }); }); pick.push({ s: s0, w: w0 }); }
    pick = r.shuffle(pick); var want = {}; pick.forEach(function (p, i) { want['s' + i] = p.w; });
    return P.grid(prompt, pick.map(function (p, i) { return { id: 's' + i, html: cap(p.s) + ' are similar.' }; }), [{ id: 'always', html: 'always' }, { id: 'sometimes', html: 'sometimes' }, { id: 'never', html: 'never' }], want,
      { why: function (row, got, wt) { var p = pick[+row.slice(1)]; return { code: 'u6l2-asn', hint: '“' + cap(p.s) + '”: ' + (wt === 'always' ? 'are they regular, with the same number of sides?' : wt === 'never' ? 'do they have the same number of sides?' : 'could one be long and thin and the other not (or have different angles)?') }; } },
      br(pick.map(function (p) { return cap(p.s) + ': <b>' + p.w + '</b>. ' + ASN_WHY[p.w]; })), ['Regular polygons with the same number of sides: always. Different numbers of sides: never. Others: sometimes.'], text);
  }
  var PENT = [[0, 0], [4, 0], [5, 2.4], [2.4, 4.2], [-0.6, 2.6]];
  function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  HW.addCodes({ 'u6l2-flip': 'Ratio upside down (divided the other way)', 'u6l2-long-short': 'Matched a long side with a short side', 'u6l2-most': 'Said similar because most ratios match', 'u6l2-angles-only': 'Said similar because the angles match',
    'u6l2-sides-only': 'Said similar because the side ratios match', 'u6l2-add-same': 'Added the same amount to each side', 'u6l2-one-border': 'Added the border to one side only', 'u6l2-next-angle': 'Took next-door angles of a parallelogram as equal',
    'u6l2-opp-angle': 'Took opposite angles of a parallelogram as supplementary', 'u6l2-angle-sum': 'Used the wrong angle sum', 'u6l2-exterior': 'Gave 360° ÷ n (the turn), not the inside angle', 'u6l2-sum-all': 'Gave the angle sum, not one angle',
    'u6l2-asn': 'Always / sometimes / never mixed up', 'u6l2-no-convert': 'Didn’t change to the same units', 'u6l2-read-other': 'Read the other protractor scale' });
  HW.addPartial({ 'u6l2-flip': 'b', 'u6l2-long-short': 'b', 'u6l2-most': 'n', 'u6l2-angles-only': 'n', 'u6l2-sides-only': 'n', 'u6l2-add-same': 'n', 'u6l2-one-border': 'b', 'u6l2-next-angle': 'b', 'u6l2-opp-angle': 'b',
    'u6l2-angle-sum': 'b', 'u6l2-exterior': 'b', 'u6l2-sum-all': 'b', 'u6l2-no-convert': 'b' });

  /* ================= shared generators ================= */
  /* rectangles compared with an original a × b (a < b): rows { w, h (as listed), lo, hi, yes } */
  var EX_RECT = [[5, 7], [10, 14], [8, 10]];
  function rectRows(r, n) {
    var base = find(function () { return r.pick([[6, 8], [4, 10], [6, 9], [5, 8], [8, 10], [3, 5], [4, 7], [9, 12]]); }, function (b) { return !EX_RECT.some(function (e) { return e[0] === b[0] && e[1] === b[1]; }); });
    var a = base[0], b = base[1], R = b / a, rows = [], nYes = n === 5 ? r.pick([2, 3]) : 2;
    var ks = r.shuffle([0.5, 1.5, 2, 2.5, 3, 1.25, 4]).filter(function (k) { return places(a * k) <= 1 && places(b * k) <= 1 && !(k === 1); }).slice(0, nYes);
    ks.forEach(function (k) { rows.push({ lo: q(a * k), hi: q(b * k), yes: true }); });
    var tries = 0;
    while (rows.length < n && tries++ < 200) {
      var kind = r.pick(['add', 'add', 'mix']), lo, hi;
      if (kind === 'add') { var d = r.pick([2, 3, 4, 5, 6]); lo = a + d; hi = b + d; } else { var m = r.pick([2, 3, 1.5]), e = r.pick([1, 2, 3, -1]); lo = q(a * m); hi = q(b * m + e); }
      if (hi <= lo || Math.abs(rd(hi / lo, 2) - rd(R, 2)) < 0.02 || rows.some(function (x) { return near(x.lo, lo) && near(x.hi, hi); })) continue;
      rows.push({ lo: lo, hi: hi, yes: false, add: kind === 'add' });
    }
    rows = r.shuffle(rows);
    var turn = r.int(0, rows.length - 1); rows.forEach(function (x, i) { x.w = i === turn ? x.hi : x.lo; x.h = i === turn ? x.lo : x.hi; });
    return { a: a, b: b, R: R, rows: rows };
  }
  function rectSol(sh) { return br(['Original: ' + rTex(sh.b, sh.a)].concat(sh.rows.map(function (x, i) { return '(' + 'abcde'.charAt(i) + ') ' + rTex(x.hi, x.lo) + ': ' + (x.yes ? '<b>similar</b>' : 'not similar'); }))); }
  function rectTable(sh, unit) { return table(['Rectangle', 'Long ÷ short'], sh.rows.map(function (x, i) { return ['(' + 'abcde'.charAt(i) + ') ' + N(x.w) + ' ' + unit + ' by ' + N(x.h) + ' ' + unit, '?']; })); }
  function rectRatioPart(sh, unit, text) {
    return fieldsPart('Find long ÷ short for each rectangle (to 2 decimal places).' + rectTable(sh, unit), sh.rows.map(function (x, i) { return ratioFld('(' + 'abcde'.charAt(i) + ') long ÷ short =', x.hi, x.lo, { name: '(' + 'abcde'.charAt(i) + ')', flipHint: 'Divide <b>long ÷ short</b> (the bigger number on top), even when the rectangle is turned.' }); }),
      rectSol(sh), ['Long ÷ short: divide the bigger side by the smaller side.', 'Round to 2 decimal places.'], text);
  }
  function rectYesPart(sh, unit, text) {
    return yesNoGrid('Which rectangles are similar to the ' + N(sh.a) + ' ' + unit + ' by ' + N(sh.b) + ' ' + unit + ' rectangle? (' + rTex(sh.b, sh.a) + ')', sh.rows.map(function (x, i) { return { id: 'r' + i, html: '(' + 'abcde'.charAt(i) + ') ' + N(x.w) + ' by ' + N(x.h), yes: x.yes, why: 'long ÷ short = ' + rTex(x.hi, x.lo) + '. Is it the same as ' + rd(sh.R, 2) + '?' }; }),
      rectSol(sh), ['Similar when long ÷ short is the same as the original’s.'], text);
  }
  /* two quadrilaterals' sides: s (original), T (new); similar or one side off */
  function quadSides(r, similar, ks) {
    return find(function () { var k = r.pick(ks), s = [0, 1, 2, 3].map(function () { return r.int(3, 14); }), T = s.map(function (x) { return q(x * k); }), j = r.int(0, 3);
      if (!similar) { var dlt = r.pick([0.5, 1, -0.5, -1, 1.5]); T[j] = q(T[j] + dlt); }
      return { k: k, s: s, T: T, j: similar ? -1 : j }; },
    function (v) { return new Set(v.s).size >= 3 && v.T.every(function (x) { return x > 0 && places(x) <= 1; }) && (v.j < 0 || Math.abs(rd(v.T[v.j] / v.s[v.j], 2) - rd(v.k, 2)) >= 0.03) && !(v.s[0] === 6 && v.s[1] === 4 && v.s[2] === 3); });
  }
  /* "similar? k? type?" multiple choice */
  function decideMC(r, prompt, o) {
    // o: { similar, k, odd: { pair, val } (when not similar), newName, oldName, sol }
    var kk = N(o.k), ty = typeOf(o.k), other = ty === 'enlargement' ? 'reduction' : 'enlargement', opts;
    if (o.similar) opts = [
      { html: '<b>Yes.</b> Every ratio is ' + kk + ', so ' + t('k=' + kk) + ': ' + (ty === 'enlargement' ? 'an ' : 'a ') + ty + '.', right: true },
      { html: '<b>Yes.</b> Every ratio is ' + kk + ', so ' + t('k=' + kk) + ': ' + (other === 'enlargement' ? 'an ' : 'a ') + other + '.', why: 'Compare k with 1: ' + kk + (o.k > 1 ? ' > 1 means bigger (an enlargement).' : ' < 1 means smaller (a reduction).'), code: 'u6k-type' },
      { html: '<b>Yes.</b> ' + t('k=' + N(rd(1 / o.k, 2))) + ' (original ÷ new).', why: 'k = new ÷ original: ' + o.newName + ' over ' + o.oldName + '.', code: 'k-flip' },
      { html: '<b>No.</b> The two figures are different sizes.', why: 'Similar figures can be different sizes. Every ratio is the same, so they are similar.', code: 'u6l2-size' }];
    else opts = [
      { html: '<b>No.</b> ' + o.odd.pair + ' gives ' + o.odd.val + ', but the other ratios are ' + kk + '. One pair that doesn’t match is enough.', right: true },
      { html: '<b>Yes.</b> Most of the ratios are ' + kk + ', so ' + t('k=' + kk) + '.', why: 'Every ratio must match. ' + o.odd.pair + ' doesn’t.', code: 'u6l2-most' },
      { html: '<b>Yes.</b> The angles are equal, so they are similar.', why: 'Both tests must pass: equal angles <b>and</b> every side ratio the same.', code: 'u6l2-angles-only' },
      { html: '<b>No.</b> ' + o.newName + ' is ' + (o.k > 1 ? 'bigger' : 'smaller') + ' than ' + o.oldName + '.', why: 'A bigger or smaller copy can still be similar. Look at the ratios.', code: 'u6l2-size' }];
    return mc(r, prompt, opts, o.sol, ['Similar only if every ratio is the same (and the angles are equal).'], o.text);
  }

  HW.defineLesson({
    id: 'u6l2', unit: 6, num: '2', title: 'Are They Similar? Checking Angles and Side Ratios', outcome: 'G3',
    blurb: 'The two tests for similar polygons: equal angles and equal side ratios. Rectangles and photos, frames and borders, boxes, and why regular polygons are always similar.',
    questions: [
      { num: '1', stem: function (sh) { return t(sh.a + '\\sim ' + sh.b) + '. Fill in the blanks.'; }, shared: function (r) { var nm = corrNames(r, QUADS, true); return { a: nm[0], b: nm[1], ang: r.sample([0, 1, 2, 3], 2).sort(), sid: r.sample([0, 1, 2, 3], 2).sort() }; }, parts: [
        { id: '1a', level: 'BEG', make: function (r, sh) { var a = sh.a, b = sh.b, o = { pool: b, poolName: b, otherPool: a, otherName: a };
          var specs = sh.ang.map(function (i) { return nameFld(t('\\angle ' + a.charAt(i)) + ' matches', b.charAt(i), Object.assign({ angle: true, name: '∠' + a.charAt(i), before: t('\\angle'), hint: a.charAt(i) + ' is letter ' + (i + 1) + ' of ' + a + ', so it matches letter ' + (i + 1) + ' of ' + b + '.' }, o)); })
            .concat(sh.sid.map(function (i) { return nameFld('Side ' + t(sideOf(a, i)) + ' matches', sideOf(b, i), Object.assign({ name: sideOf(a, i), hint: 'Use letters ' + (i + 1) + ' and ' + ((i + 1) % 4 + 1) + ' of ' + b + '.' }, o)); }));
          return fieldsPart('(a)', specs, KT.corrSol(a, b, 'both'), ['Write ' + a + ' above ' + b + ' and read down the columns.'], 'blanks corr'); } },
        { id: '1b', level: 'BEG', make: function (r) { return mc(r, '(b) Two polygons are similar when their corresponding ____ are all equal <b>and</b> their corresponding sides all have the same ____.', [
          { html: '<b>angles</b> … <b>ratio</b>', right: true }, { html: '<b>sides</b> … <b>length</b>', why: 'Equal sides would make them congruent (the same size). Similar figures can be different sizes.', code: 'cong' },
          { html: '<b>angles</b> … <b>length</b>', why: 'The sides can be longer or shorter; what stays the same is the <b>ratio</b> new ÷ original.', code: 'length' }, { html: '<b>sides</b> … <b>angle</b>', why: 'The sides don’t stay equal. Test 1 is about angles, Test 2 about side ratios.', code: 'swap' }],
          'Similar: corresponding <b>angles</b> are equal and corresponding sides have the same <b>ratio</b> (the scale factor).', ['Think of the two tests.'], 'two tests'); } },
        { id: '1c', level: 'BEG', make: function (r) { return mc(r, '(c) To show two polygons are <b>not</b> similar, how many pairs of sides or angles must fail?', [
          { html: 'Only one', right: true }, { html: 'All of them', why: 'Both tests must pass for every pair, so one pair that fails is already enough.', code: 'all' },
          { html: 'More than half', why: 'One pair that fails is enough: every pair must pass.', code: 'half' }, { html: 'At least two: one angle and one side', why: 'Either test failing is enough, and one pair fails a test.', code: 'two' }],
          'Only one. Every pair must pass, so one pair of angles that aren’t equal, or one side ratio that doesn’t match, shows they are not similar.', ['Both tests must pass for <b>every</b> pair.'], 'only one'); } }] },
      { num: '2', stem: function (sh) { return 'The corresponding angles of these pentagons are equal. Check the sides. (Not drawn to scale; all lengths in cm.)' + pairSVG(PENT, { k: sh.k, names: [sh.a, sh.b], labels: [sh.s.map(N), sh.T.map(N)], width: 420 }); },
        shared: function (r) { var nm = twoNames(r, PENTS), sim = r.chance(0.7); return Object.assign(find(function () { var k = r.pick([2.5, 1.5, 2, 3, 0.5, 1.25, 0.4]), s = [0, 1, 2, 3, 4].map(function () { return r.int(2, 9); }), T = s.map(function (x) { return q(x * k); }), j = r.int(0, 4); if (!sim) T[j] = q(T[j] + r.pick([0.5, 1, -0.5, -1])); return { k: k, s: s, T: T, j: sim ? -1 : j }; },
          function (v) { return new Set(v.s).size >= 4 && v.T.every(function (x) { return x > 0 && places(x) <= 1; }) && (v.j < 0 || Math.abs(v.T[v.j] / v.s[v.j] - v.k) >= 0.04); }), { a: nm[0], b: nm[1], sim: sim }); }, parts: [
        { id: '2a', level: 'EMG', make: function (r, sh) {
          return fieldsPart('(a) Find each ratio: side of ' + t(sh.b) + ' ÷ side of ' + t(sh.a) + ' (to 2 decimal places if it doesn’t come out even).', [0, 1, 2, 3, 4].map(function (i) { return ratioFld(t(sideOf(sh.b, i) + '\\div ' + sideOf(sh.a, i)) + ' =', sh.T[i], sh.s[i], { name: sideOf(sh.b, i) + ' ÷ ' + sideOf(sh.a, i), flipHint: 'Divide the same way every time: the side of ' + sh.b + ' on top.' }); }),
            br([0, 1, 2, 3, 4].map(function (i) { return t(sideOf(sh.b, i) + '\\div ' + sideOf(sh.a, i)) + ': ' + rTex(sh.T[i], sh.s[i]); })), ['Match the sides by the naming order.', 'Always put the side of ' + sh.b + ' on top.'], 'pent ratios'); } },
        { id: '2b', level: 'EMG', make: function (r, sh) { var j = sh.j;
          return decideMC(r, '(b) Are the pentagons similar? If so, what is the scale factor, and is it an enlargement or a reduction?', { similar: sh.sim, k: sh.k, newName: sh.b, oldName: sh.a, odd: j >= 0 ? { pair: t(sideOf(sh.b, j) + '\\div ' + sideOf(sh.a, j)), val: rTex(sh.T[j], sh.s[j]) } : null,
            sol: sh.sim ? 'The angles are equal and every side ratio is ' + N(sh.k) + ', so ' + t(sh.a + '\\sim ' + sh.b) + ' with ' + t('k=' + N(sh.k)) + ' (' + typeOf(sh.k) + ').' : 'No. ' + t(sideOf(sh.b, j) + '\\div ' + sideOf(sh.a, j)) + ' gives ' + rTex(sh.T[j], sh.s[j]) + ', but the other ratios are ' + N(sh.k) + '. One pair that doesn’t match is enough: not similar.', text: 'pent decide' }); } }] },
      { num: '3', stem: function (sh) { return 'Quadrilaterals ' + t(sh.a) + ' and ' + t(sh.b) + ' have equal corresponding angles. The sides are: ' + [0, 1, 2, 3].map(function (i) { return t(sideOf(sh.a, i) + '=' + N(sh.s[i])) + ' cm'; }).join(', ') + ' and ' + [0, 1, 2, 3].map(function (i) { return t(sideOf(sh.b, i) + '=' + N(sh.T[i])) + ' cm'; }).join(', ') + '.'; },
        shared: function (r) { var nm = twoNames(r, QUADS); return Object.assign(quadSides(r, r.chance(0.3), [0.75, 0.5, 1.5, 1.25, 0.4, 2.5, 0.6]), { a: nm[0], b: nm[1] }); }, parts: [
        { id: '3a', level: 'EMG', make: function (r, sh) {
          return fieldsPart('(a) Find the ratio for each pair of corresponding sides (new ÷ original, with ' + t(sh.a) + ' as the original), to 2 decimal places.', [0, 1, 2, 3].map(function (i) { return ratioFld(t(sideOf(sh.b, i) + '\\div ' + sideOf(sh.a, i)) + ' =', sh.T[i], sh.s[i], { name: sideOf(sh.b, i) + ' ÷ ' + sideOf(sh.a, i), flipHint: 'New ÷ original: the side of ' + sh.b + ' on top.' }); }),
            br([0, 1, 2, 3].map(function (i) { return t(sideOf(sh.b, i) + '\\div ' + sideOf(sh.a, i)) + ': ' + rTex(sh.T[i], sh.s[i]); })), ['New ÷ original for each pair.'], 'quad ratios'); } },
        { id: '3b', level: 'PRG', make: function (r, sh) { var j = sh.j;
          var odd = j >= 0 ? { pair: t(sideOf(sh.b, j) + '\\div ' + sideOf(sh.a, j)), val: rTex(sh.T[j], sh.s[j]) } : null;
          var opts = sh.j < 0 ? [
            { html: '<b>Yes.</b> The angles are equal and all four ratios are ' + N(sh.k) + '.', right: true },
            { html: '<b>No.</b> The sides of ' + sh.b + ' are ' + (sh.k > 1 ? 'longer' : 'shorter') + '.', why: 'A ' + (sh.k > 1 ? 'bigger' : 'smaller') + ' copy can still be similar: every ratio is the same.', code: 'u6l2-size' },
            { html: '<b>No.</b> The ratios would have to be 1.', why: 'A ratio of 1 means congruent. Similar only needs every ratio to be the <b>same</b> number.', code: 'one' },
            { html: '<b>We can’t tell</b> without measuring the angles.', why: 'The angles are given as equal. Both tests pass.', code: 'tell' }] : [
            { html: '<b>No.</b> ' + odd.pair + ' gives ' + odd.val + ', but the other three ratios are ' + N(sh.k) + '. One pair that doesn’t match is enough.', right: true },
            { html: '<b>Yes.</b> Three of the four ratios are ' + N(sh.k) + '.', why: 'Every ratio must match. One that doesn’t is enough to make them not similar.', code: 'u6l2-most' },
            { html: '<b>Yes.</b> The corresponding angles are equal.', why: 'Both tests must pass: the side test fails here.', code: 'u6l2-angles-only' },
            { html: '<b>No.</b> The sides of ' + sh.b + ' are ' + (sh.k > 1 ? 'longer' : 'shorter') + '.', why: 'A ' + (sh.k > 1 ? 'bigger' : 'smaller') + ' copy can still be similar. Look at the ratios from (a).', code: 'u6l2-size' }];
          return mc(r, '(b) Are the quadrilaterals similar? Explain.', opts, j < 0 ? 'Yes. The angles are equal and every ratio is ' + N(sh.k) + ': ' + t(sh.a + '\\sim ' + sh.b) + ' with ' + t('k=' + N(sh.k)) + '.' : 'No. Three ratios are ' + N(sh.k) + ', but ' + odd.pair + ' gives ' + odd.val + '. One pair of sides that doesn’t match is enough to make them not similar.', ['Use your ratios from (a).'], 'quad decide'); } }] },
      { num: '4', stem: function (sh) { return 'Quadrilateral ' + t(sh.a) + ' has ' + [0, 1, 2].map(function (i) { return t('\\angle ' + sh.a.charAt(i) + '=' + dgT(sh.A[i])); }).join(', ') + '. Quadrilateral ' + t(sh.b) + ' has ' + [0, 1, 3].map(function (i) { return t('\\angle ' + sh.b.charAt(i) + '=' + dgT(sh.B[i])); }).join(', ') + '. The vertices match in order (' + t(sh.a.charAt(0) + '\\leftrightarrow ' + sh.b.charAt(0)) + ', …).'; },
        shared: function (r) { var nm = twoNames(r, QUADS), same = r.chance(0.3); return Object.assign(find(function () { var A = [r.int(60, 120), r.int(70, 125), r.int(70, 120)]; A.push(360 - A[0] - A[1] - A[2]); var d = r.pick([5, 10, 15, -5, -10]), B = [A[0], A[1], same ? A[2] : A[2] + d, same ? A[3] : A[3] - d]; return { A: A, B: B, same: same }; },
          function (v) { return v.A[3] >= 55 && v.A[3] <= 135 && v.B[3] >= 50 && v.B[2] <= 140 && new Set(v.A).size === 4 && !(v.A[0] === 75 && v.A[1] === 105); }), { a: nm[0], b: nm[1] }); }, parts: [
        { id: '4a', level: 'EMG', make: function (r, sh) { var a = sh.a, b = sh.b, s3 = sh.A[0] + sh.A[1] + sh.A[2], s3b = sh.B[0] + sh.B[1] + sh.B[3], dg = function (sum) { return [{ v: 180 - sum, code: 'u6l2-angle-sum', hint: 'A <b>quadrilateral</b>’s angles add up to 360°.' }, { v: 540 - sum, code: 'u6l2-angle-sum', hint: 'A quadrilateral’s angles add up to 360°.' }]; };
          return fieldsPart('(a) Find ' + t('\\angle ' + a.charAt(3)) + ' and ' + t('\\angle ' + b.charAt(2)) + '.', [angFld(t('\\angle ' + a.charAt(3) + '='), sh.A[3], dg(s3).concat(sh.same ? [] : [{ v: sh.B[3], code: 'u6k-order', hint: 'Use the angles of ' + a + ': 360° minus its three angles.' }]), '∠' + a.charAt(3)), angFld(t('\\angle ' + b.charAt(2) + '='), sh.B[2], dg(s3b).concat(sh.same ? [] : [{ v: sh.A[2], code: 'u6l2-angles-only', hint: 'Don’t assume the angles match: work it out from the angles of ' + b + '.' }]), '∠' + b.charAt(2))],
            br([t('\\angle ' + a.charAt(3) + '=360^\\circ-' + sh.A.slice(0, 3).map(dgT).join('-') + '=' + dgT(sh.A[3])), t('\\angle ' + b.charAt(2) + '=360^\\circ-' + [0, 1, 3].map(function (i) { return dgT(sh.B[i]); }).join('-') + '=' + dgT(sh.B[2]))]), ['The angles of a quadrilateral add up to 360°.'], 'missing angles'); } },
        { id: '4b', level: 'PRG', make: function (r, sh) { var a = sh.a, b = sh.b, opts;
          if (!sh.same) opts = [
            { html: '<b>No.</b> ' + t('\\angle ' + a.charAt(2) + '=' + dgT(sh.A[2])) + ' but ' + t('\\angle ' + b.charAt(2) + '=' + dgT(sh.B[2])) + '. The angle test fails, so they can’t be similar, whatever the sides are.', right: true },
            { html: '<b>Yes.</b> ' + t('\\angle ' + a.charAt(0) + '=\\angle ' + b.charAt(0)) + ' and ' + t('\\angle ' + a.charAt(1) + '=\\angle ' + b.charAt(1)) + '.', why: 'Every pair of angles must be equal. Check the other two pairs.', code: 'u6l2-most' },
            { html: '<b>We can’t tell</b> without the sides.', why: 'One pair of angles that isn’t equal is already enough to say no.', code: 'tell' },
            { html: '<b>Yes.</b> Both shapes’ angles add up to 360°.', why: 'Every quadrilateral’s angles add to 360°. Compare the angles pair by pair.', code: 'sum' }];
          else opts = [
            { html: '<b>Maybe.</b> Every pair of angles matches, but we need the sides to do the side test.', right: true },
            { html: '<b>Yes, for sure.</b> All the angles match.', why: 'Equal angles are not enough: a square and a long rectangle have the same angles. The side test is still needed.', code: 'u6l2-angles-only' },
            { html: '<b>No.</b> ' + t('\\angle ' + a.charAt(3)) + ' and ' + t('\\angle ' + b.charAt(2)) + ' are different.', why: 'Compare <b>matching</b> angles: ' + a.charAt(3) + ' matches ' + b.charAt(3) + '.', code: 'u6k-order' },
            { html: '<b>No.</b> Quadrilaterals with different side lengths are never similar.', why: 'Similar figures can have different side lengths (one is bigger). The side <b>ratios</b> must match.', code: 'size' }];
          return mc(r, '(b) Can ' + t(a) + ' and ' + t(b) + ' be similar? Explain without knowing the sides.', opts, sh.same ? 'Every pair matches (' + sh.A.map(dgT).map(t).join(', ') + '), so the angle test passes. We can’t say they are similar until we check the side ratios.' : 'No. ' + t('\\angle ' + a.charAt(2) + '=' + dgT(sh.A[2])) + ' but ' + t('\\angle ' + b.charAt(2) + '=' + dgT(sh.B[2])) + ' (and ' + t('\\angle ' + a.charAt(3) + '=' + dgT(sh.A[3])) + ' but ' + t('\\angle ' + b.charAt(3) + '=' + dgT(sh.B[3])) + '). The angle test fails.', ['Compare the four pairs of angles from (a).'], 'angle decide'); } }] },
      { num: '5', stem: function (sh) { return 'Rectangle ' + t(sh.a) + ' and parallelogram ' + t(sh.b) + ' were measured with a ruler. A protractor is laid on ' + t('\\angle ' + sh.b.charAt(0)) + '.' + rowBox([[polyFig([[0, 0], [sh.w, 0], [sh.w, sh.h], [0, sh.h]], { px: 38, names: sh.a.split(''), sides: [N(sh.w) + ' cm', N(sh.h) + ' cm', '', ''], angles: [' ', ' ', ' ', ' '] }), ''], [polyFig(paraPts(sh.w * sh.k, sh.h * sh.k, sh.th), { px: 38, names: sh.b.split(''), sides: [N(sh.w * sh.k) + ' cm', N(sh.h * sh.k) + ' cm', '', ''] }), '']]) + rowBox([[G.protractorSVG({ angle: sh.th, rot: 0, scale: 'inner', names: [sh.b.charAt(1), sh.b.charAt(0), sh.b.charAt(3)], width: 380 }), t('\\angle ' + sh.b.charAt(0))]]); },
        shared: function (r) { var nm = twoNames(r, QUADS); return find(function () { return { a: nm[0], b: nm[1], w: r.pick([2.5, 3, 3.5, 4]), h: r.pick([1.5, 2, 2.5]), k: r.pick([1.5, 1.2, 1.4, 2]), th: r.int(55, 80) }; }, function (v) { return v.h < v.w && places(v.w * v.k) <= 1 && places(v.h * v.k) <= 1; }); }, parts: [
        { id: '5a', level: 'EMG', make: function (r, sh) { var E = sh.b.charAt(0), chk = G.angleChk(sh.th, { tol: 1 });
          return { prompt: '(a) Read the protractor: ' + t('\\angle ' + E) + ' = ?', input: { type: 'fields', fields: [{ label: t('\\angle ' + E + '='), name: '∠' + E, after: '°' }] }, check: K.fields([chk], { labels: ['∠' + E] }), key: [String(sh.th)], answer: D2(sh.th), tol: 1,
            solution: 'The arm ' + sh.b.charAt(0) + sh.b.charAt(1) + ' is on the inner 0 (on the right), so read the inner scale: ' + t('\\angle ' + E + '=' + dgT(sh.th)) + ' (acute, as it looks).', hints: ['Find the 0 that sits on one arm. Follow <b>that</b> scale round to the other arm.', 'The angle is acute, so the reading is less than 90°.'], text: 'para angle' }; } },
        { id: '5b', level: 'EMG', make: function (r, sh) { var A = sh.a.charAt(0), F = sh.b.charAt(1), f = 180 - sh.th;
          return fieldsPart('(b) Find ' + t('\\angle ' + A) + ' and ' + t('\\angle ' + F) + '.', [angFld(t('\\angle ' + A + '='), 90, [{ v: sh.th, code: 'u6l2-angles-only', hint: A + ' is a corner of the <b>rectangle</b>: every angle of a rectangle is 90°.' }], '∠' + A), angFld(t('\\angle ' + F + '='), f, [{ v: sh.th, code: 'u6l2-next-angle', hint: F + ' is <b>next to</b> ' + sh.b.charAt(0) + ', not opposite: next-door angles in a parallelogram add up to 180°.' }, { v: 360 - sh.th, code: 'u6l2-angle-sum', hint: 'Next-door angles in a parallelogram add up to <b>180°</b>.' }, { v: 90 - sh.th, code: 'u6l2-angle-sum', hint: 'Next-door angles in a parallelogram add up to 180°, not 90°.' }], '∠' + F)],
            br([t('\\angle ' + A + '=90^\\circ') + ' (a rectangle)', t('\\angle ' + F + '=180^\\circ-' + dgT(sh.th) + '=' + dgT(f)) + ' (next-door angles in a parallelogram add to 180°)']), ['Every angle of a rectangle is 90°.', 'In a parallelogram, two angles next to each other add up to 180°.'], 'para angles'); } },
        { id: '5c', level: 'EMG', make: function (r, sh) { var a = sh.a, b = sh.b;
          return fieldsPart('(c) Find the side ratios.', [ratioFld(t(sideOf(b, 0) + '\\div ' + sideOf(a, 0)) + ' =', sh.w * sh.k, sh.w, { name: sideOf(b, 0) + ' ÷ ' + sideOf(a, 0) }), ratioFld(t(sideOf(b, 1) + '\\div ' + sideOf(a, 1)) + ' =', sh.h * sh.k, sh.h, { name: sideOf(b, 1) + ' ÷ ' + sideOf(a, 1), diag: [{ v: sh.h * sh.k / sh.w, code: 'u6l2-long-short', hint: 'Match the short side with the short side.' }] })],
            br([t(sideOf(b, 0) + '\\div ' + sideOf(a, 0)) + ': ' + rTex(sh.w * sh.k, sh.w), t(sideOf(b, 1) + '\\div ' + sideOf(a, 1)) + ': ' + rTex(sh.h * sh.k, sh.h)]), ['Parallelogram side ÷ matching rectangle side.'], 'para ratios'); } },
        { id: '5d', level: 'PRG', make: function (r, sh) { var A = sh.a.charAt(0), E = sh.b.charAt(0);
          return mc(r, '(d) Which test passes and which test fails? Are the shapes similar?', [
            { html: 'The side test passes (both ratios are ' + N(sh.k) + '), but the angle test fails (' + t('\\angle ' + A + '=90^\\circ') + ', ' + t('\\angle ' + E + '=' + dgT(sh.th)) + '). <b>Not similar.</b>', right: true },
            { html: 'Both tests pass. <b>Similar</b>, with ' + t('k=' + N(sh.k)) + '.', why: 'Compare the angles: ' + t('\\angle ' + A + '=90^\\circ') + ' but ' + t('\\angle ' + E + '=' + dgT(sh.th)) + '.', code: 'u6l2-sides-only' },
            { html: 'The angle test passes, but the side test fails. <b>Not similar.</b>', why: 'Look again: the side ratios are both ' + N(sh.k) + ', but the angles are different.', code: 'swap' },
            { html: 'The side test passes, so they are <b>similar</b>. Angles don’t matter.', why: 'Both tests must pass. The angles don’t match here.', code: 'u6l2-sides-only' }],
            br(['Sides: both ratios are ' + N(sh.k) + ', so the side test passes.', 'Angles: the rectangle’s are all 90°, but ' + t('\\angle ' + E + '=' + dgT(sh.th)) + ', so the angle test fails.', 'They are not similar.']), ['Use (a), (b) and (c).'], 'rect para decide'); } }] },
      { num: '6', stem: function (sh) { return 'Which rectangles are similar to ' + KT.aN(sh.a) + ' ' + N(sh.a) + ' cm by ' + N(sh.b) + ' cm rectangle? (' + rTex(sh.b, sh.a) + ')'; }, shared: function (r) { return rectRows(r, 5); }, parts: [
        { id: '6a', level: 'EMG', make: function (r, sh) { return rectRatioPart(sh, 'cm', 'rect ratios'); } },
        { id: '6b', level: 'EMG', make: function (r, sh) { return rectYesPart(sh, 'cm', 'rect yes no'); } }] },
      { num: '7', stem: 'Most TV screens are made in a 16 : 9 shape: the width ÷ the height is ' + t('16\\div 9\\approx 1.78') + '.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var sim = r.chance(0.6), v = sim ? find(function () { var m = r.pick([2, 2.5, 3, 4, 5, 1.5, 3.5]); return { w: 16 * m, h: 9 * m, u: r.pick(['in', 'cm']) }; }, function (v) { return !(v.w === 48); }) : r.pick([{ w: 42, h: 18, u: 'in' }, { w: 50, h: 30, u: 'cm' }, { w: 48, h: 30, u: 'cm' }, { w: 56, h: 24, u: 'in' }, { w: 40, h: 25, u: 'in' }]), x = v.w / v.h;
          return fieldsPart('(a) A TV screen is ' + U(v.w, v.u) + ' wide and ' + U(v.h, v.u) + ' high. Is it similar to the 16 : 9 shape?', [ratioFld('Width ÷ height =', v.w, v.h, { name: 'Width ÷ height' }), yesNoFld('Similar?', sim, 'Compare ' + rTex(v.w, v.h) + ' with 1.78.')],
            br([rTex(v.w, v.h), sim ? 'Yes, it is similar to 16 : 9 (' + t('k=' + N(v.w) + '\\div 16=' + N(v.w / 16)) + ').' : 'No: ' + rd(x, 2).toFixed(2) + ' is not 1.78.']), ['Width ÷ height, then compare with 1.78.'], 'TV a'); } },
        { id: '7b', level: 'PRG', make: function (r) { var v = r.pick([[40, 30], [60, 45], [32, 24], [48, 36], [36, 27]]), x = v[0] / v[1];
          return mc(r, '(b) An old TV screen is ' + U(v[0], 'cm') + ' wide and ' + U(v[1], 'cm') + ' high. Will a 16 : 9 movie fill the whole screen without being cut or stretched?', [
            { html: '<b>No.</b> ' + rTex(v[0], v[1]) + ', not 1.78. The screen is not similar to the 16 : 9 shape, so there will be black bars, cut-off edges, or stretching.', right: true },
            { html: '<b>Yes.</b> Both screens are rectangles, so the shapes match.', why: 'All rectangles have 90° angles, but long ÷ short must match too.', code: 'u6l2-angles-only' },
            { html: '<b>Yes.</b> The movie just shrinks to fit the smaller screen.', why: 'Shrinking keeps the 16 : 9 shape. It only fills the screen if the screen is the same shape.', code: 'shrink' },
            { html: '<b>No.</b> The old screen is smaller than a TV.', why: 'Size doesn’t matter; the shape does. Compare width ÷ height.', code: 'u6l2-size' }],
            rTex(v[0], v[1]) + '. That is not 1.78, so the old screen is not similar to the 16 : 9 shape. The movie won’t fit exactly (black bars, cut-off edges, or stretching).', ['Find width ÷ height for the old screen.'], 'TV b'); } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) { var p = person(r), v = find(function () { var w = r.pick([10, 12, 15, 16, 20, 25]), h = r.pick([15, 20, 25, 30, 18]), k = r.pick([3, 4, 5, 6, 2.5]), sim = r.chance(0.6); return { w: w, h: h, k: k, sim: sim, W: q(w * k / 100), H: q(h * k / 100 + (sim ? 0 : r.pick([0.1, -0.1, 0.2, 0.05]))) }; }, function (v) { return v.w !== v.h && places(v.W) <= 2 && places(v.H) <= 2 && v.H > 0 && !(v.w === 20 && v.h === 25 && v.k === 4); });
          var hr = v.H * 100 / v.h;
          return fieldsPart(p.n + ' drew a logo ' + U(v.w, 'cm') + ' wide and ' + U(v.h, 'cm') + ' high. The print shop made a sign ' + U(v.W, 'm') + ' wide and ' + U(v.H, 'm') + ' high. Is the sign similar to ' + p.his + ' drawing? (Change to the same units first.)',
            [ratioFld('Width: sign ÷ drawing =', v.W * 100, v.w, { name: 'Width ratio', diag: [{ v: v.W / v.w, code: 'u6l2-no-convert', hint: 'Change ' + U(v.W, 'm') + ' to centimetres first.' }] }), ratioFld('Height: sign ÷ drawing =', v.H * 100, v.h, { name: 'Height ratio', diag: [{ v: v.H / v.h, code: 'u6l2-no-convert', hint: 'Change ' + U(v.H, 'm') + ' to centimetres first.' }] }), yesNoFld('Similar?', v.sim, 'Are the two ratios equal?')],
            br(['Convert: ' + U(v.W, 'm') + ' = ' + U(v.W * 100, 'cm') + ' and ' + U(v.H, 'm') + ' = ' + U(v.H * 100, 'cm') + '.', 'Width: ' + rTex(v.W * 100, v.w) + '. Height: ' + rTex(v.H * 100, v.h) + '.', v.sim ? 'Yes, the sign is similar, with scale factor ' + N(v.k) + '.' : 'The ratios are not equal, so the sign is <b>not</b> similar.']), ['1 m = 100 cm.', 'Divide sign ÷ drawing for the width and for the height.'], 'logo sign'); } }] },
      { num: '9', stem: function (sh) { return 'A ' + N(sh.a) + ' in by ' + N(sh.b) + ' in print is put in a frame that is ' + U(sh.f, 'in') + ' wide on every side.'; },
        shared: function (r) { return find(function () { var a = r.pick([8, 10, 12, 16, 5, 11]), b = a + r.pick([2, 3, 4, 6]), f = r.pick([1, 1.5, 2, 2.5, 3]), m = r.pick([1.25, 1.5, 2, 2.5]); return { a: a, b: b, f: f, S: q(a * m), m: m }; }, function (v) { return places(v.b * v.m) <= 1 && v.S !== v.a + 2 * v.f && !(v.a === 16 && v.b === 20 && v.f === 2); }); }, parts: [
        { id: '9a', level: 'EMG', make: function (r, sh) { var A = sh.a + 2 * sh.f, B = sh.b + 2 * sh.f;
          return fieldsPart('(a) Find the outside size of the frame.', [fld('Short side:', A, { after: 'in', dp: 2, noPlaces: true, name: 'Short', diag: [{ v: sh.a + sh.f, code: 'u6l2-one-border', hint: 'The frame is on <b>both</b> ends: add ' + N(sh.f) + ' in twice.' }] }), fld('Long side:', B, { after: 'in', dp: 2, noPlaces: true, name: 'Long', diag: [{ v: sh.b + sh.f, code: 'u6l2-one-border', hint: 'The frame is on <b>both</b> ends: add ' + N(sh.f) + ' in twice.' }] })],
            t(N(sh.a) + '+' + N(sh.f) + '+' + N(sh.f) + '=' + N(A)) + ' in by ' + t(N(sh.b) + '+' + N(sh.f) + '+' + N(sh.f) + '=' + N(B)) + ' in', ['The frame adds its width on each side.'], 'frame size'); } },
        { id: '9b', level: 'PRG', make: function (r, sh) { var A = sh.a + 2 * sh.f, B = sh.b + 2 * sh.f;
          return fieldsPart('(b) Is the framed print similar to the print alone? Find both ratios (outside ÷ print).', [ratioFld('Short: ' + N(A) + ' ÷ ' + N(sh.a) + ' =', A, sh.a, { name: 'Short ratio' }), ratioFld('Long: ' + N(B) + ' ÷ ' + N(sh.b) + ' =', B, sh.b, { name: 'Long ratio' }), yesNoFld('Similar?', false, 'Are the two ratios equal?')],
            br(['Short: ' + rTex(A, sh.a) + '. Long: ' + rTex(B, sh.b) + '.', 'Not equal, so the framed print is <b>not</b> similar. (Adding the same amount is not multiplying by the same number.)']), ['Outside short ÷ print short, and outside long ÷ print long.'], 'frame similar'); } },
        { id: '9c', level: 'ADV', make: function (r, sh) { var L = q(sh.b * sh.m), A = sh.a + 2 * sh.f, B = sh.b + 2 * sh.f;
          return num('(c) The outside of a similar frame (the same shape as the print) has a short side of ' + U(sh.S, 'in') + '. How long should its long side be?', L, { after: 'in', dp: 1, noPlaces: true,
            diag: [{ v: sh.S + sh.b - sh.a, code: 'u6l2-add-same', hint: 'Similar means <b>multiply</b> by k = ' + N(sh.S) + ' ÷ ' + N(sh.a) + '.' }, { v: B * sh.S / A, code: 'u6k-order', hint: 'Use the <b>print’s</b> shape (' + N(sh.a) + ' by ' + N(sh.b) + '), not the framed print from (a).' }, { v: sh.a * sh.S / sh.b, code: 'u6l2-flip', hint: 'k = new short ÷ print short = ' + N(sh.S) + ' ÷ ' + N(sh.a) + '. Then long = ' + N(sh.b) + ' × k.' }],
            sol: br([t('k=' + N(sh.S) + '\\div ' + N(sh.a) + '=' + N(sh.m)), 'Long side = ' + t(N(sh.b) + '\\times ' + N(sh.m) + '=' + N(L)) + ' in']), hints: ['k = new short side ÷ the print’s short side.', 'Long side = the print’s long side × k.'], text: 'frame long' }); } }] },
      { num: '10', stem: function (sh) { var a = sh.a, b = sh.b; return 'Parallelogram ' + t(a) + ' has ' + t(sideOf(a, 0) + '=' + N(sh.p)) + ' cm, ' + t(sideOf(a, 1) + '=' + N(sh.qq)) + ' cm and ' + t('\\angle ' + a.charAt(0) + '=' + dgT(sh.th)) + '. Parallelogram ' + t(b) + ' has ' + t(sideOf(b, 0) + '=' + N(sh.P)) + ' cm, ' + t(sideOf(b, 1) + '=' + N(sh.Q)) + ' cm and ' + t('\\angle ' + b.charAt(0) + '=' + dgT(sh.th)) + '.'; },
        shared: function (r) { var nm = twoNames(r, QUADS), sim = r.chance(0.65); return find(function () { var p = r.int(5, 12), qq = r.int(3, 9), k = r.pick([1.25, 1.5, 2, 0.5, 0.75, 2.5]), Q = q(qq * k + (sim ? 0 : r.pick([0.5, -0.5, 1, 0.25]))); return { a: nm[0], b: nm[1], p: p, qq: qq, k: k, P: q(p * k), Q: Q, th: r.pick([50, 55, 60, 65, 70, 75, 110, 120, 115]), sim: sim }; },
          function (v) { return v.qq < v.p && places(v.P) <= 2 && places(v.Q) <= 2 && v.Q > 0 && (v.sim || Math.abs(v.Q / v.qq - v.k) > 0.03) && !(v.p === 10 && v.qq === 4); }); }, parts: [
        { id: '10a', level: 'EMG', make: function (r, sh) { var a = sh.a, b = sh.b, s = 180 - sh.th;
          var adj = function (L) { return [{ v: sh.th, code: 'u6l2-next-angle', hint: t('\\angle ' + L) + ' is <b>next to</b> the given angle: they add up to 180°.' }, { v: 360 - sh.th, code: 'u6l2-angle-sum', hint: 'Next-door angles add up to <b>180°</b>.' }]; };
          var opp = function (L) { return [{ v: s, code: 'u6l2-opp-angle', hint: t('\\angle ' + L) + ' is <b>opposite</b> the given angle, so it is equal to it.' }]; };
          return fieldsPart('(a) Find the other angles of both parallelograms.', [angFld(t('\\angle ' + a.charAt(1) + '='), s, adj(a.charAt(1)), '∠' + a.charAt(1)), angFld(t('\\angle ' + a.charAt(2) + '='), sh.th, opp(a.charAt(2)), '∠' + a.charAt(2)), angFld(t('\\angle ' + a.charAt(3) + '='), s, adj(a.charAt(3)), '∠' + a.charAt(3)),
            angFld(t('\\angle ' + b.charAt(1) + '='), s, adj(b.charAt(1)), '∠' + b.charAt(1)), angFld(t('\\angle ' + b.charAt(2) + '='), sh.th, opp(b.charAt(2)), '∠' + b.charAt(2)), angFld(t('\\angle ' + b.charAt(3) + '='), s, adj(b.charAt(3)), '∠' + b.charAt(3))],
            br([t('\\angle ' + a.charAt(0) + '=\\angle ' + a.charAt(2) + '=' + dgT(sh.th)) + ' (opposite angles), ' + t('\\angle ' + a.charAt(1) + '=\\angle ' + a.charAt(3) + '=180^\\circ-' + dgT(sh.th) + '=' + dgT(s)), 'In the same way: ' + t('\\angle ' + b.charAt(0) + '=\\angle ' + b.charAt(2) + '=' + dgT(sh.th)) + ', ' + t('\\angle ' + b.charAt(1) + '=\\angle ' + b.charAt(3) + '=' + dgT(s)) + '. All the corresponding angles match.']), ['Opposite angles of a parallelogram are equal.', 'Two angles next to each other add up to 180°.'], 'para all angles'); } },
        { id: '10b', level: 'PRG', make: function (r, sh) { var a = sh.a, b = sh.b;
          return fieldsPart('(b) Check the side ratios. Are the parallelograms similar?', [ratioFld(t(sideOf(b, 0) + '\\div ' + sideOf(a, 0)) + ' =', sh.P, sh.p, { name: sideOf(b, 0) + ' ÷ ' + sideOf(a, 0) }), ratioFld(t(sideOf(b, 1) + '\\div ' + sideOf(a, 1)) + ' =', sh.Q, sh.qq, { name: sideOf(b, 1) + ' ÷ ' + sideOf(a, 1), diag: [{ v: sh.Q / sh.p, code: 'u6l2-long-short', hint: 'Match the short side with the short side.' }] }), yesNoFld('Similar?', sh.sim, sh.sim ? 'The angles match and both ratios are the same: both tests pass.' : 'The angles match, but are the two ratios equal?', sh.sim ? 'u6k-yes-no' : 'u6l2-angles-only')],
            br([rTex(sh.P, sh.p) + ' and ' + rTex(sh.Q, sh.qq) + ' (the other two sides are equal to these).', sh.sim ? 'Both tests pass: ' + t(a + '\\sim ' + b) + ' with ' + t('k=' + N(sh.k)) + '.' : 'The ratios are different, so they are <b>not</b> similar (even though the angles match).']), ['New ÷ original for both pairs of sides.'], 'para sides'); } }] },
      { num: '11', stem: function (sh) { return sh.p.n + ' wants a rectangle similar to ' + KT.aN(sh.L) + ' ' + N(sh.L) + ' cm by ' + N(sh.W) + ' cm rectangle. ' + cap(sh.p.he) + ' adds ' + U(sh.d, 'cm') + ' to each side and draws ' + KT.aN(sh.L + sh.d) + ' ' + N(sh.L + sh.d) + ' cm by ' + N(sh.W + sh.d) + ' cm rectangle.'; },
        shared: function (r) { return find(function () { return { p: person(r), L: r.pick([8, 10, 12, 15, 16, 20]), W: r.pick([3, 4, 5, 6]), d: r.pick([1, 2, 3, 4]) }; }, function (v) { return places(v.W * (v.L + v.d) / v.L) <= 2 && !(v.L === 10 && v.W === 4 && v.d === 2); }); }, parts: [
        { id: '11a', level: 'EMG', make: function (r, sh) { var r1 = (sh.L + sh.d) / sh.L, r2 = (sh.W + sh.d) / sh.W;
          return mc(r, '(a) Why is ' + sh.p.n + '’s rectangle not similar?', [
            { html: 'Long: ' + rTex(sh.L + sh.d, sh.L) + '. Short: ' + rTex(sh.W + sh.d, sh.W) + '. The ratios are different: adding the same amount doesn’t keep the shape.', right: true },
            { html: 'It is bigger than the first rectangle.', why: 'A bigger rectangle can still be similar (an enlargement). Divide new ÷ old for each side.', code: 'u6l2-size' },
            { html: 'Its angles are different.', why: 'Both are rectangles, so all the angles are 90°. The problem is the sides.', code: 'angles' },
            { html: 'It actually is similar: every side grew by ' + U(sh.d, 'cm') + '.', why: 'Similar means every side is <b>multiplied</b> by the same number, not increased by the same amount.', code: 'u6l2-add-same' }],
            'Long: ' + rTex(sh.L + sh.d, sh.L) + '. Short: ' + rTex(sh.W + sh.d, sh.W) + '. The ratios are different. Adding the same amount to each side does not keep the shape; you must multiply each side by the same number.', ['Divide new ÷ old for the long sides and for the short sides.'], 'Maya why'); } },
        { id: '11b', level: 'PRG', make: function (r, sh) { var k = (sh.L + sh.d) / sh.L, w = q(sh.W * k);
          return num('(b) The new rectangle must be ' + U(sh.L + sh.d, 'cm') + ' long. How wide should it be to be similar?', w, { after: 'cm', dp: 2, noPlaces: true,
            diag: [{ v: sh.W + sh.d, code: 'u6l2-add-same', hint: 'That’s ' + sh.p.n + '’s width. Multiply the width by k = ' + N(sh.L + sh.d) + ' ÷ ' + N(sh.L) + '.' }, { v: sh.W / k, code: 'k-mul-div', hint: 'The new rectangle is bigger: multiply by k.' }, { v: sh.W * (sh.W + sh.d) / sh.W, code: 'u6l2-long-short', hint: 'Find k from the <b>long</b> sides: ' + N(sh.L + sh.d) + ' ÷ ' + N(sh.L) + '.' }],
            sol: br([t('k=' + N(sh.L + sh.d) + '\\div ' + N(sh.L) + '=' + N(k)), 'Width = ' + t(N(sh.W) + '\\times ' + N(k) + '=' + N(w)) + ' cm']), hints: ['k = new length ÷ old length.', 'Width = old width × k.'], text: 'Maya width' }); } }] },
      { num: '12', stem: 'Regular polygons.', parts: [
        { id: '12a', level: 'BEG', make: function (r) { return asnGrid(r, '(a) Choose <i>always</i>, <i>sometimes</i> or <i>never</i>.', 4, 'asn'); } },
        { id: '12b', level: 'EMG', make: function (r) { var v = find(function () { var g = r.pick([[6, 'regular hexagons', 'A patio uses paving stones'], [8, 'regular octagons', 'A floor uses tiles'], [5, 'regular pentagons', 'A garden path uses stepping stones'], [3, 'equilateral triangles', 'A quilt uses patches'], [4, 'squares', 'A wall uses tiles']]); return { n: g[0], nm: g[1], ctx: g[2], s: r.pick([10, 12, 15, 16, 20, 25]), S: r.pick([18, 20, 24, 30, 32, 36, 40]) }; }, function (v) { return v.S > v.s && places(v.S / v.s) <= 3 && !(v.n === 8 && v.s === 25 && v.S === 32) && !(v.n === 6 && v.s === 10); }), ang = (v.n - 2) * 180 / v.n, k = v.S / v.s;
          return fieldsPart(v.ctx + ' shaped like ' + v.nm + '. The small ones have ' + U(v.s, 'cm') + ' sides and the large ones have ' + U(v.S, 'cm') + ' sides. They are similar (regular, with the same number of sides). Find the size of each angle and the scale factor from small to large.',
            [fld('Each angle:', ang, { after: '°', name: 'Each angle', diag: [{ v: (v.n - 2) * 180, code: 'u6l2-sum-all', hint: 'That’s the sum of all ' + v.n + ' angles. Divide by ' + v.n + '.' }, { v: 360 / v.n, code: 'u6l2-exterior', hint: 'That’s 360° ÷ ' + v.n + ' (the turn at each corner). Each inside angle is (n − 2) × 180° ÷ n.' }, { v: v.n * 180 / v.n, code: 'u6l2-angle-sum', hint: 'Use (n − 2) × 180° for the sum, then divide by n.' }] }), kFld(t('k='), k, { from: { new: v.S, orig: v.s } })],
            br(['Each angle: ' + t('(' + v.n + '-2)\\times 180^\\circ\\div ' + v.n + '=' + (v.n - 2) * 180 + '^\\circ\\div ' + v.n + '=' + dgT(ang)), t('k=' + N(v.S) + '\\div ' + N(v.s) + toN(k, 2))]), ['Each angle = (n − 2) × 180° ÷ n.', 'k = large side ÷ small side.'], 'regular tiles'); } }] },
      { num: '13', stem: function (sh) { return 'Three cereal boxes are shaped like rectangular prisms.' + table(['Box', 'Length', 'Width', 'Height'], ['A', 'B', 'C'].map(function (L, i) { var d = sh.boxes[i]; return [L, U(d[0], 'cm'), U(d[1], 'cm'), U(d[2], 'cm')]; })); },
        shared: function (r) { return find(function () { var A = [r.pick([16, 18, 20, 24]), r.pick([5, 6, 7, 8]), r.pick([25, 28, 30, 32])], k = r.pick([1.25, 1.5, 0.75, 1.2]), k2 = r.pick([1.25, 1.5, 1.2]), j = r.int(0, 2), sim = A.map(function (x) { return q(x * k); }), non = A.map(function (x) { return q(x * k2); }); non[j] = q(non[j] + r.pick([1, -1, 2, 0.5])); var bFirst = r.chance(0.5); return { A: A, k: k, boxes: [A, bFirst ? sim : non, bFirst ? non : sim], simB: bFirst, j: j, k2: k2 }; },
          function (v) { return v.boxes.every(function (b) { return b.every(function (x) { return x > 0 && places(x) <= 2; }); }) && Math.abs(v.boxes[v.simB ? 2 : 1][v.j] / v.A[v.j] - v.k2) > 0.03 && !(v.A[0] === 20 && v.A[1] === 7 && v.A[2] === 30 && v.k === 1.25); }); }, parts: [
        { id: '13', level: 'MAS', make: function (r, sh) { var sb = sh.simB ? 'B' : 'C', nb = sh.simB ? 'C' : 'B', S = sh.boxes[sh.simB ? 1 : 2], Nn = sh.boxes[sh.simB ? 2 : 1];
          var ratios = function (b) { return [0, 1, 2].map(function (i) { return rTex(b[i], sh.A[i]); }).join(', '); };
          return fieldsPart('Which boxes are similar to Box A? If one is, give its scale factor from Box A.', [yesNoFld('Box B similar to A?', sh.simB, 'Divide each of Box B’s measurements by Box A’s. Are all three ratios the same?'), yesNoFld('Box C similar to A?', !sh.simB, 'Divide each of Box C’s measurements by Box A’s. Are all three ratios the same?'), kFld('Scale factor from A to the similar box: ' + t('k='), sh.k, { from: { new: S[0], orig: sh.A[0] }, name: 'k' })],
            br(['Box ' + sb + ': ' + ratios(S) + '. All equal: ' + sb + ' is similar to A (' + t('k=' + N(sh.k)) + ').', 'Box ' + nb + ': ' + ratios(Nn) + '. Not all equal: ' + nb + ' is <b>not</b> similar to A.']), ['Divide length ÷ length, width ÷ width, height ÷ height.', 'Similar only if all three ratios are the same.'], 'cereal boxes'); } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) { var right = r.pick(ALWAYS), wr = r.sample(SOMETIMES, 3);
          return mc(r, 'Which pair of shapes is <b>always</b> similar?', [{ html: right, right: true }].concat(wr.map(function (w) { return { html: w, why: cap(w) + ' can have different side ratios or different angles, so they are only <b>sometimes</b> similar.', code: 'sometimes' }; })),
            cap(right) + ': regular polygons with the same number of sides are always similar. (' + cap(list(wr)) + ' are only sometimes similar.)', ['Look for regular polygons with the same number of sides.'], 'always MC'); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) { var v = find(function () { var a = r.pick([20, 30, 40, 24, 12]), b = a + r.pick([10, 4, 6, 8, 15]), k = r.pick([1.5, 2.5, 1.25, 0.5]), d1 = r.pick([5, 10, 4]), d2 = r.pick([15, 20, 8]); return { a: a, b: b, k: k, d1: d1, d2: d2 }; }, function (v) { return places(v.a * v.k) <= 1 && places(v.b * v.k) <= 1 && v.d1 !== v.d2 && !(v.a === 30 && v.b === 40); }), a = v.a, b = v.b;
          var opts = [{ html: N(a * v.k) + ' cm by ' + N(b * v.k) + ' cm', right: true }, { html: N(a + v.d1) + ' cm by ' + N(b + v.d1) + ' cm', why: 'That adds ' + v.d1 + ' cm to each side. Similar means multiply.', code: 'u6l2-add-same' },
            { html: N(a + v.d2) + ' cm by ' + N(b + v.d2) + ' cm', why: 'That adds ' + v.d2 + ' cm to each side. Similar means multiply.', code: 'u6l2-add-same' }, { html: N(2 * a) + ' cm by ' + N(b + a) + ' cm', why: 'One side is doubled, but the other only gets ' + a + ' cm longer: ' + N(b + a) + ' ÷ ' + N(b) + ' isn’t 2.', code: 'mix' }];
          return mc(r, 'Which rectangle is similar to ' + KT.aN(a) + ' ' + N(a) + ' cm by ' + N(b) + ' cm rectangle?', opts, t(N(a * v.k) + '\\div ' + N(a) + '=' + N(v.k)) + ' and ' + t(N(b * v.k) + '\\div ' + N(b) + '=' + N(v.k)) + ': the same ratio, so it is similar.', ['Divide short ÷ short and long ÷ long for each choice.'], 'similar rect MC'); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) { var v = find(function () { return { s: r.pick([3, 4, 5, 6]), S: r.pick([6, 7.5, 8, 9, 10]), th: r.pick([60, 70, 75, 80, 50]) }; }, function (v) { return v.S > v.s; });
          return mc(r, 'A square has ' + U(v.s, 'cm') + ' sides. A rhombus has ' + U(v.S, 'cm') + ' sides and angles of ' + t(dgT(v.th)) + ' and ' + t(dgT(180 - v.th)) + '. Why are they <b>not</b> similar?', [
            { html: 'The corresponding angles are not equal.', right: true }, { html: 'The side ratios are not all the same.', why: 'Every ratio is ' + N(v.S) + ' ÷ ' + N(v.s) + ': all the same. The angles are the problem.', code: 'u6l2-sides-only' },
            { html: 'They have a different number of sides.', why: 'Both have 4 sides.', code: 'nsides' }, { html: 'The rhombus is bigger than the square.', why: 'A bigger shape can still be similar.', code: 'u6l2-size' }],
            'Every side ratio is ' + rTex(v.S, v.s) + ', but the square’s angles are 90° and the rhombus’s are ' + t(dgT(v.th)) + ' and ' + t(dgT(180 - v.th)) + '. The angle test fails.', ['Check both tests.'], 'square rhombus MC'); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) { var nm = twoNames(r, QUADS), v = find(function () { var k = r.pick([0.75, 1.25, 0.6, 0.8, 1.5, 0.4, 2.5]), s = [0, 1, 2, 3].map(function () { return r.pick([8, 10, 12, 16, 20, 24, 15]); }); return { k: k, s: s }; }, function (v) { return new Set(v.s).size === 4 && v.s.every(function (x) { return places(x * v.k) <= 1; }) && !(v.k === 0.75 && v.s[0] === 16 && v.s[1] === 20); }), T = v.s.map(function (x) { return q(x * v.k); });
          return num('Quadrilateral ' + t(nm[0]) + ' has sides ' + list(v.s.map(function (x) { return N(x) + ' cm'; })) + '. Quadrilateral ' + t(nm[1]) + ' is similar to it, with corresponding sides ' + list(T.map(function (x) { return N(x) + ' cm'; })) + '. The scale factor from ' + t(nm[0]) + ' to ' + t(nm[1]) + ', to the nearest hundredth, is ____.', v.k, { nr: true, dp: 2, noPlaces: true,
            diag: [{ v: 1 / v.k, code: 'k-flip', hint: 'k = new ÷ original: the sides of ' + nm[1] + ' on top.' }, { v: T[0] - v.s[0], code: 'k-subtract', hint: 'A scale factor is a division: new ÷ original.' }],
            sol: v.s.map(function (x, i) { return t(N(T[i]) + '\\div ' + N(x) + '=' + N(v.k)); }).join(', ') + '. ' + t('k=' + N(v.k)) + ' (' + typeOf(v.k) + ').', hints: ['k = a side of ' + nm[1] + ' ÷ the matching side of ' + nm[0] + '.'], text: 'NR k' }); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'PRG', make: function (r) { var v = find(function () { var a = r.pick([8, 10, 12, 15, 9, 6]), b = q(a * r.pick([1.5, 1.25, 4 / 3, 1.4, 2])), S = r.pick([14, 16, 18, 20, 24, 25, 30]); return { a: a, b: b, S: S, L: b * S / a }; }, function (v) { return Number.isInteger(q(v.b)) && v.S > v.a && Number.isInteger(q(v.L)) && v.L < 1000 && !(v.a === 12 && v.b === 18 && v.S === 20); });
          return num('A photo is ' + N(v.a) + ' cm by ' + N(v.b) + ' cm. A similar enlargement has a short side of ' + U(v.S, 'cm') + '. The length of its long side, in centimetres, is ____.', v.L, { nr: true, dp: 1, noPlaces: true,
            diag: [{ v: v.S + v.b - v.a, code: 'u6l2-add-same', hint: 'Similar means <b>multiply</b> by k = ' + N(v.S) + ' ÷ ' + N(v.a) + ', not add.' }, { v: v.a * v.S / v.b, code: 'u6l2-flip', hint: 'k = new short ÷ old short = ' + N(v.S) + ' ÷ ' + N(v.a) + '. Then multiply the long side by k.' }, { v: v.b * rd(v.S / v.a, 2), code: 'round', hint: 'Keep the full scale factor (or work it out as ' + N(v.b) + ' × ' + N(v.S) + ' ÷ ' + N(v.a) + '): rounding k first changes the answer.' }],
            sol: br([t('k=' + N(v.S) + '\\div ' + N(v.a) + toN(v.S / v.a, 3)), 'Long side: ' + t(N(v.b) + '\\times ' + N(v.S) + '\\div ' + N(v.a) + '=' + N(q(v.L))) + ' cm. (Or: ' + t(N(v.b) + '\\div ' + N(v.a) + '=' + N(q(v.b / v.a)) + '') + ', so the long side is ' + t(N(q(v.b / v.a)) + '\\times ' + N(v.S) + '=' + N(q(v.L))) + ' cm.)']), hints: ['k = new short side ÷ old short side.', 'Multiply the long side by k. Don’t round k first.'], text: 'NR long side' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Quadrilaterals ' + t(sh.a) + ' and ' + t(sh.b) + ' have equal corresponding angles. Their sides are ' + [0, 1, 2, 3].map(function (i) { return t(sideOf(sh.a, i) + '=' + N(sh.s[i])); }).join(', ') + ' and ' + [0, 1, 2, 3].map(function (i) { return t(sideOf(sh.b, i) + '=' + N(sh.T[i])); }).join(', ') + ' (all in cm).'; },
        shared: function (r) { var nm = twoNames(r, QUADS); return Object.assign(quadSides(r, true, [0.4, 0.5, 0.75, 1.5, 2.5, 0.6, 1.2]), { a: nm[0], b: nm[1] }); }, parts: [
        { id: 'e1a', level: 'BEG', make: function (r, sh) {
          return fieldsPart('Find each ratio (' + t(sh.b) + ' ÷ ' + t(sh.a) + ').', [0, 1, 2, 3].map(function (i) { return ratioFld(t(sideOf(sh.b, i) + '\\div ' + sideOf(sh.a, i)) + ' =', sh.T[i], sh.s[i], { name: sideOf(sh.b, i) + ' ÷ ' + sideOf(sh.a, i) }); }),
            br([0, 1, 2, 3].map(function (i) { return rTex(sh.T[i], sh.s[i]); })), ['Divide the side of ' + sh.b + ' by the matching side of ' + sh.a + '.'], 'ep ratios'); } },
        { id: 'e1b', level: 'EMG', make: function (r, sh) {
          return fieldsPart('Similar? Scale factor? Enlargement or reduction?', [yesNoFld('Similar?', true, 'The angles are equal and every ratio is the same: both tests pass.'), kFld('Scale factor ' + t('k='), sh.k, { from: { new: sh.T[0], orig: sh.s[0] } }), typeFld('Enlargement or reduction?', sh.k)],
            'Equal angles and every side ratio is ' + N(sh.k) + ', so ' + t(sh.a + '\\sim ' + sh.b) + ' with ' + t('k=' + N(sh.k)) + ' (' + typeOf(sh.k) + ').', ['k is the ratio you found every time.'], 'ep decide'); } }] },
      { num: '2', stem: function (sh) { return 'Quadrilateral ' + t(sh.a) + ' has ' + [0, 1, 2].map(function (i) { return t('\\angle ' + sh.a.charAt(i) + '=' + dgT(sh.A[i])); }).join(', ') + '. Quadrilateral ' + t(sh.b) + ' has ' + [0, 2, 3].map(function (i) { return t('\\angle ' + sh.b.charAt(i) + '=' + dgT(sh.B[i])); }).join(', ') + '.'; },
        shared: function (r) { var nm = twoNames(r, QUADS), same = r.chance(0.7); return Object.assign(find(function () { var A = [r.int(70, 110), r.int(75, 120), r.int(80, 125)]; A.push(360 - A[0] - A[1] - A[2]); var d = r.pick([5, 10, -5, -10]), B = same ? A.slice() : [A[0], A[1] + d, A[2], A[3] - d]; return { A: A, B: B, same: same }; },
          function (v) { return v.A[3] >= 55 && v.A[3] <= 130 && new Set(v.A).size === 4 && v.B[3] > 40; }), { a: nm[0], b: nm[1] }); }, parts: [
        { id: 'e2a', level: 'EMG', make: function (r, sh) { var a = sh.a, b = sh.b, s3 = sh.A[0] + sh.A[1] + sh.A[2], s3b = sh.B[0] + sh.B[2] + sh.B[3];
          return fieldsPart('(a) Find ' + t('\\angle ' + a.charAt(3)) + ' and ' + t('\\angle ' + b.charAt(1)) + '.', [angFld(t('\\angle ' + a.charAt(3) + '='), sh.A[3], [{ v: 180 - s3, code: 'u6l2-angle-sum', hint: 'A quadrilateral’s angles add up to 360°.' }], '∠' + a.charAt(3)), angFld(t('\\angle ' + b.charAt(1) + '='), sh.B[1], [{ v: 180 - s3b, code: 'u6l2-angle-sum', hint: 'A quadrilateral’s angles add up to 360°.' }].concat(sh.same ? [] : [{ v: sh.A[1], code: 'u6l2-angles-only', hint: 'Work it out from the angles of ' + b + ' (360° minus the other three).' }]), '∠' + b.charAt(1))],
            br([t('\\angle ' + a.charAt(3) + '=360^\\circ-' + sh.A.slice(0, 3).map(dgT).join('-') + '=' + dgT(sh.A[3])), t('\\angle ' + b.charAt(1) + '=360^\\circ-' + [0, 2, 3].map(function (i) { return dgT(sh.B[i]); }).join('-') + '=' + dgT(sh.B[1]))]), ['The angles of a quadrilateral add up to 360°.'], 'ep angles'); } },
        { id: 'e2b', level: 'PRG', make: function (r, sh) { var a = sh.a, b = sh.b;
          var opts = sh.same ? [
            { html: 'The angle test passes (every pair matches), but we <b>can’t say</b> they are similar yet: we don’t know the sides.', right: true },
            { html: 'The angle test passes, so they <b>are</b> similar.', why: 'Both tests must pass. Without the sides we can’t do the side test.', code: 'u6l2-angles-only' },
            { html: 'The angle test fails, so they are <b>not</b> similar.', why: 'Check every pair again with your answers from (a): they all match.', code: 'fail' },
            { html: 'They can never be similar: their angles are all different sizes.', why: 'Each shape has different angles inside it, but what matters is that <b>matching</b> angles are equal.', code: 'diff' }] : [
            { html: 'The angle test fails: ' + t('\\angle ' + a.charAt(1) + '=' + dgT(sh.A[1])) + ' but ' + t('\\angle ' + b.charAt(1) + '=' + dgT(sh.B[1])) + '. They are <b>not</b> similar.', right: true },
            { html: 'The angle test passes, so they <b>are</b> similar.', why: 'Compare every pair, including the ones you found in (a).', code: 'u6l2-angles-only' },
            { html: 'The angle test passes, but we need the sides to decide.', why: 'Compare every pair, including the ones you found in (a).', code: 'pass' },
            { html: 'We can’t use the angles at all without the sides.', why: 'One pair of angles that isn’t equal is enough to say “not similar”.', code: 'tell' }];
          return mc(r, '(b) Does the angle test pass? Can you say the quadrilaterals are similar?', opts, sh.same ? 'Every pair matches (' + sh.A.map(function (x) { return t(dgT(x)); }).join(', ') + '). But we don’t know the sides, so we can’t do the side test: we can’t say they are similar yet.' : t('\\angle ' + a.charAt(1) + '=' + dgT(sh.A[1])) + ' but ' + t('\\angle ' + b.charAt(1) + '=' + dgT(sh.B[1])) + ': the angle test fails, so they are not similar.', ['Compare the four pairs of angles.'], 'ep angle test'); } }] },
      { num: '3', stem: function (sh) { return 'Which rectangles are similar to ' + KT.aN(sh.a) + ' ' + N(sh.a) + ' cm by ' + N(sh.b) + ' cm rectangle? (' + rTex(sh.b, sh.a) + ')'; }, shared: function (r) { return rectRows(r, 4); }, parts: [
        { id: 'e3a', level: 'EMG', make: function (r, sh) { return rectRatioPart(sh, 'cm', 'ep rect ratios'); } },
        { id: 'e3b', level: 'EMG', make: function (r, sh) { return rectYesPart(sh, 'cm', 'ep rect yes no'); } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4', level: 'BEG', make: function (r) { return asnGrid(r, 'Choose <i>always</i>, <i>sometimes</i> or <i>never</i>.', 4, 'ep asn'); } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [
        { id: 'e5', level: 'PRG', make: function (r) { var v = find(function () { var a = r.pick([6, 6.5, 7, 7.5, 6.8]), b = r.pick([13, 14, 14.5, 15, 15.5]), c = q(a + r.pick([0.5, 0.4, 0.3])), d = q(b + r.pick([1, 0.5, 1.5])); return { a: a, b: b, c: c, d: d }; }, function (v) { var r1 = v.b / v.a, r2 = v.d / v.c; return Math.abs(rd(r1, 2) - rd(r2, 2)) >= 0.01 && Math.abs(r1 - r2) < 0.05 && !(v.a === 6.5 && v.b === 14); });
          return fieldsPart('One phone screen is ' + N(v.a) + ' cm by ' + N(v.b) + ' cm. Another is ' + N(v.c) + ' cm by ' + N(v.d) + ' cm. Are the screens similar? Find long ÷ short for each, to 2 decimal places.', [ratioFld('First screen:', v.b, v.a, { name: 'First' }), ratioFld('Second screen:', v.d, v.c, { name: 'Second' }), yesNoFld('Similar?', false, 'The ratios are close, but are they <b>equal</b>?')],
            br(['Long ÷ short: ' + rTex(v.b, v.a) + ' and ' + rTex(v.d, v.c) + '.', 'Close but <b>not</b> equal, so the screens are not similar (nearly the same shape, but not exactly).']), ['Long ÷ short for each screen.'], 'phones'); } }] },
      { num: '6', stem: function (sh) { return 'A ' + N(sh.a) + ' in by ' + N(sh.b) + ' in photo is framed with a ' + N(sh.f) + ' in border on every side.'; }, shared: function (r) { return find(function () { return { a: r.pick([5, 8, 10, 4, 11]), b: r.pick([7, 10, 12, 14, 6]), f: r.pick([1, 1.5, 2, 0.5, 2.5]) }; }, function (v) { return v.b > v.a && !(v.a === 8 && v.b === 10 && v.f === 1.5); }); }, parts: [
        { id: 'e6a', level: 'EMG', make: function (r, sh) { var A = sh.a + 2 * sh.f, B = sh.b + 2 * sh.f;
          return fieldsPart('(a) Find the outside size.', [fld('Short side:', A, { after: 'in', dp: 2, noPlaces: true, name: 'Short', diag: [{ v: sh.a + sh.f, code: 'u6l2-one-border', hint: 'The border is on both ends: add ' + N(sh.f) + ' in twice.' }] }), fld('Long side:', B, { after: 'in', dp: 2, noPlaces: true, name: 'Long', diag: [{ v: sh.b + sh.f, code: 'u6l2-one-border', hint: 'The border is on both ends: add ' + N(sh.f) + ' in twice.' }] })],
            t(N(sh.a) + '+' + N(2 * sh.f) + '=' + N(A)) + ' in by ' + t(N(sh.b) + '+' + N(2 * sh.f) + '=' + N(B)) + ' in', ['Add the border twice to each side.'], 'border size'); } },
        { id: 'e6b', level: 'PRG', make: function (r, sh) { var A = sh.a + 2 * sh.f, B = sh.b + 2 * sh.f;
          return fieldsPart('(b) Is the framed photo similar to the photo? Find both ratios (outside ÷ photo).', [ratioFld('Short:', A, sh.a, { name: 'Short ratio' }), ratioFld('Long:', B, sh.b, { name: 'Long ratio' }), yesNoFld('Similar?', false, 'Are the two ratios equal?')],
            br(['Short: ' + rTex(A, sh.a) + '. Long: ' + rTex(B, sh.b) + '.', 'Not equal, so it is not similar.']), ['Outside ÷ photo for the short sides and the long sides.'], 'border similar'); } }] },
      { num: '7', stem: function (sh) { var a = sh.a, b = sh.b; return 'Are these parallelograms similar? (Not drawn to scale.)' + rowBox([[polyFig(KT.paraPts(sh.p * 1, sh.qq * 1, sh.th), { size: 150, names: a.split(''), sides: [N(sh.p) + ' cm', '', '', N(sh.qq) + ' cm'], angles: [dgT(sh.th).replace('^\\circ', '°'), '', '', ''] }), ''], [polyFig(KT.paraPts(sh.P, sh.Q, sh.th), { size: 190, names: b.split(''), sides: [N(sh.P) + ' cm', '', '', N(sh.Q) + ' cm'], angles: [dgT(sh.th).replace('^\\circ', '°'), '', '', ''] }), '']]); },
        shared: function (r) { var nm = twoNames(r, QUADS), sim = r.chance(0.6); return find(function () { var p = r.int(4, 10), qq = r.int(3, 8), k = r.pick([2.5, 1.5, 2, 3]); return { a: nm[0], b: nm[1], p: p, qq: qq, k: k, P: q(p * k), Q: q(qq * k + (sim ? 0 : r.pick([1, -1, 0.5, 2]))), th: r.pick([55, 60, 65, 68, 75, 78]), sim: sim }; },
          function (v) { return v.qq < v.p && v.Q > 0 && places(v.Q) <= 1 && (v.sim || Math.abs(v.Q / v.qq - v.k) > 0.04) && !(v.p === 6 && v.qq === 4 && v.th === 72); }); }, parts: [
        { id: 'e7a', level: 'EMG', make: function (r, sh) { var a = sh.a, b = sh.b, s = 180 - sh.th, dg = function (L) { return [{ v: sh.th, code: 'u6l2-next-angle', hint: t('\\angle ' + L) + ' is next to the marked angle: they add up to 180°.' }]; };
          return fieldsPart('(a) Find ' + t('\\angle ' + a.charAt(1)) + ' and ' + t('\\angle ' + b.charAt(1)) + '.', [angFld(t('\\angle ' + a.charAt(1) + '='), s, dg(a.charAt(1)), '∠' + a.charAt(1)), angFld(t('\\angle ' + b.charAt(1) + '='), s, dg(b.charAt(1)), '∠' + b.charAt(1))],
            t('\\angle ' + a.charAt(1) + '=\\angle ' + b.charAt(1) + '=180^\\circ-' + dgT(sh.th) + '=' + dgT(s)) + '. All the corresponding angles match (' + t(dgT(sh.th)) + ' and ' + t(dgT(s)) + ').', ['Next-door angles in a parallelogram add up to 180°.'], 'ep para angles'); } },
        { id: 'e7b', level: 'PRG', make: function (r, sh) { var a = sh.a, b = sh.b;
          return fieldsPart('(b) Find the side ratios. Are the parallelograms similar?', [ratioFld(t(sideOf(b, 0) + '\\div ' + sideOf(a, 0)) + ' =', sh.P, sh.p, { name: sideOf(b, 0) + ' ÷ ' + sideOf(a, 0) }), ratioFld(t(sideOf(b, 3) + '\\div ' + sideOf(a, 3)) + ' =', sh.Q, sh.qq, { name: sideOf(b, 3) + ' ÷ ' + sideOf(a, 3), diag: [{ v: sh.Q / sh.p, code: 'u6l2-long-short', hint: 'Match the short side with the short side.' }] }), yesNoFld('Similar?', sh.sim, sh.sim ? 'The angles match and both ratios are equal: both tests pass.' : 'The angles match, but are the two ratios equal?', sh.sim ? 'u6k-yes-no' : 'u6l2-angles-only')],
            br([rTex(sh.P, sh.p) + ' and ' + rTex(sh.Q, sh.qq) + '.', sh.sim ? 'Both tests pass: ' + t(a + '\\sim ' + b) + ' with ' + t('k=' + N(sh.k)) + '.' : 'The ratios are different, so they are <b>not</b> similar.']), ['New ÷ original for both pairs.'], 'ep para sides'); } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'EMG', make: function (r) { var sim = r.chance(0.6), v = find(function () { var rr = r.pick([2, 2.5, 3, 4, 1.5]), h = r.pick([6, 8, 10, 12, 5]), k = r.pick([1.5, 2, 1.25, 2.5]); return { r: rr, h: h, k: k, R: q(rr * k), H: q(h * k + (sim ? 0 : r.pick([1, -1, 2, 0.5]))) }; }, function (v) { return places(v.R) <= 2 && places(v.H) <= 2 && v.H > v.h && (sim || Math.abs(v.H / v.h - v.k) > 0.04) && !(v.r === 3 && v.h === 8 && v.k === 1.5); });
          var it = r.pick([['small candle', 'large candle', 'candles'], ['small can of paint', 'large can of paint', 'cans'], ['small water tank', 'large water tank', 'tanks']]);
          return fieldsPart('A ' + it[0] + ' is a cylinder with a radius of ' + U(v.r, 'cm') + ' and a height of ' + U(v.h, 'cm') + '. A ' + it[1] + ' has a radius of ' + U(v.R, 'cm') + ' and a height of ' + U(v.H, 'cm') + '. Are the ' + it[2] + ' similar?',
            [ratioFld('Radius: large ÷ small =', v.R, v.r, { name: 'Radius ratio' }), ratioFld('Height: large ÷ small =', v.H, v.h, { name: 'Height ratio', diag: [{ v: v.H / v.r, code: 'u6l2-long-short', hint: 'Divide height ÷ height.' }] }), yesNoFld('Similar?', sim, 'Are the two ratios equal?')],
            br(['Radius: ' + rTex(v.R, v.r) + '. Height: ' + rTex(v.H, v.h) + '.', sim ? 'Equal, so the ' + it[2] + ' are similar (' + t('k=' + N(v.k)) + ').' : 'Not equal, so the ' + it[2] + ' are not similar.']), ['Divide large ÷ small for the radius and for the height.'], 'cylinders'); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'EMG', make: function (r) { var p = person(r), s = r.pick([4, 5, 6, 8]), L = s + r.pick([1, 2, 3, 4]);
          return mc(r, p.n + ' says a square with ' + U(s, 'cm') + ' sides and a rectangle that is ' + N(s) + ' cm by ' + N(L) + ' cm are similar, “because all their angles are 90°.” Is ' + p.n + ' right?', [
            { html: '<b>No.</b> The angle test passes, but the side test fails: ' + rTex(s, s) + ' but ' + rTex(L, s) + '. Both tests must pass.', right: true },
            { html: '<b>Yes.</b> Equal angles are all you need.', why: 'Both tests must pass: the side ratios must also match.', code: 'u6l2-angles-only' },
            { html: '<b>Yes.</b> A square is a kind of rectangle.', why: 'That’s true, but it doesn’t make them the same shape. Check the side ratios.', code: 'kind' },
            { html: '<b>No.</b> A square’s angles are not 90°.', why: 'A square’s angles <i>are</i> 90°. The problem is the sides.', code: 'angles' }],
            'No. The angle test passes (all 90°), but the side test fails: ' + rTex(s, s) + ' but ' + rTex(L, s) + '. Both tests must pass, so they are not similar.', ['Check the side ratios too.'], 'Jess'); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'EMG', make: function (r) { var v = find(function () { var a = r.pick([12, 8, 10, 16, 20]), b = a + r.pick([4, 6, 8, 2]); return { a: a, b: b, ks: r.sample([0.25, 0.5, 1.5, 2.5, 3, 2], 3), d: r.pick([3, 2, 4, 5]) }; }, function (v) { return v.ks.every(function (k) { return places(v.a * k) <= 1 && places(v.b * k) <= 1; }) && !(v.a === 12 && v.b === 16); });
          var opts = v.ks.map(function (k) { return { html: N(v.a * k) + ' cm by ' + N(v.b * k) + ' cm', why: N(v.a * k) + ' ÷ ' + N(v.a) + ' = ' + N(k) + ' and ' + N(v.b * k) + ' ÷ ' + N(v.b) + ' = ' + N(k) + ': the same, so this one <b>is</b> similar.', code: 'sim' }; }).concat([{ html: N(v.a + v.d) + ' cm by ' + N(v.b + v.d) + ' cm', right: true }]);
          return mc(r, 'A rectangle is ' + N(v.a) + ' cm by ' + N(v.b) + ' cm. Which rectangle is <b>not</b> similar to it?', opts, rTex(v.a + v.d, v.a) + ' but ' + rTex(v.b + v.d, v.b) + ' (' + v.d + ' cm was added to each side). The others all multiply both sides by the same number.', ['For each choice, divide short ÷ short and long ÷ long.'], 'not similar MC'); } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'PRG', make: function (r) { var v = find(function () { var a = r.pick([15, 12, 10, 20, 9, 18]), b = q(a * r.pick([1.6, 1.5, 1.25, 1.2, 2])), s = r.pick([6, 8, 10, 12, 15, 5]); return { a: a, b: b, s: s, L: b * s / a }; }, function (v) { return v.s < v.a && Number.isInteger(q(v.b)) && Number.isInteger(q(v.L)) && !(v.a === 15 && v.b === 24 && v.s === 10); });
          return num('A rectangle is ' + N(v.a) + ' cm by ' + N(v.b) + ' cm. A similar rectangle has a short side of ' + U(v.s, 'cm') + '. The length of its long side, in centimetres, is ____.', v.L, { nr: true, dp: 1, noPlaces: true,
            diag: [{ v: v.b - (v.a - v.s), code: 'u6l2-add-same', hint: 'Similar means multiply by k = ' + N(v.s) + ' ÷ ' + N(v.a) + ', not subtract the same amount.' }, { v: v.a * v.s / v.b, code: 'u6l2-flip', hint: 'k = new short ÷ old short. Multiply the <b>long</b> side by it.' }, { v: v.b * rd(v.s / v.a, 2), code: 'round', hint: 'Don’t round k first: work it out as ' + N(v.b) + ' × ' + N(v.s) + ' ÷ ' + N(v.a) + '.' }],
            sol: br([t('k=' + N(v.s) + '\\div ' + N(v.a)), 'Long side: ' + t(N(v.b) + '\\times ' + N(v.s) + '\\div ' + N(v.a) + '=' + N(q(v.L))) + ' cm. (Check: ' + rTex(v.b, v.a) + ' and ' + rTex(q(v.L), v.s) + '.)']), hints: ['k = new short ÷ old short.', 'Long side = old long side × k.'], text: 'ep NR long' }); } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'Two hexagons have side ratios that are all ' + N(sh.k) + '. Four pairs of corresponding angles are equal: ' + list(sh.A.map(function (x) { return t(dgT(x)); })) + '. The other two angles are not given. ' + sh.p.n + ' says the hexagons must be similar.'; },
        shared: function (r) { return Object.assign(find(function () { return { A: [0, 1, 2, 3].map(function () { return r.int(105, 135); }) }; }, function (v) { var s = 720 - v.A.reduce(function (a, b) { return a + b; }, 0); return s >= 200 && s <= 260 && new Set(v.A).size === 4; }), { k: r.pick([1.2, 1.5, 2, 0.8]), p: person(r) }); }, parts: [
        { id: 'e12a', level: 'PRG', make: function (r, sh) { var s4 = sh.A.reduce(function (a, b) { return a + b; }, 0), rest = 720 - s4;
          return num('(a) In each hexagon, the last two angles add up to how many degrees? (The angles of a hexagon add up to ' + t('(6-2)\\times 180^\\circ=720^\\circ') + '.)', rest, { after: '°', diag: [{ v: 540 - s4, code: 'u6l2-angle-sum', hint: 'A <b>hexagon</b>’s angles add up to 720°.' }, { v: 360 - s4, code: 'u6l2-angle-sum', hint: 'A hexagon’s angles add up to 720°.' }, { v: rest / 2, code: 'value', hint: 'That’s one of them if they were equal. The question asks what the two add up to.' }],
            sol: t('720^\\circ-' + sh.A.map(dgT).join('-') + '=' + dgT(rest)), hints: ['Subtract the four known angles from 720°.'], text: 'hex rest' }); } },
        { id: 'e12b', level: 'PRG', make: function (r, sh) { var rest = 720 - sh.A.reduce(function (a, b) { return a + b; }, 0), x1 = Math.round(rest / 2) - 5, x2 = x1 - 10;
          return mc(r, '(b) Is ' + sh.p.n + ' right?', [
            { html: '<b>No.</b> The last two angles add up to ' + t(dgT(rest)) + ' in each hexagon, but they could be split differently, like ' + t(dgT(x1)) + ' + ' + t(dgT(rest - x1)) + ' and ' + t(dgT(x2)) + ' + ' + t(dgT(rest - x2)) + '. Then the angle test fails.', right: true },
            { html: '<b>Yes.</b> The side ratios all match, and that is enough.', why: 'Both tests must pass, and we don’t know all the angles.', code: 'u6l2-sides-only' },
            { html: '<b>Yes.</b> The last two angles add up to the same number, so they must be equal too.', why: 'Two numbers with the same sum aren’t always the same two numbers: ' + x1 + ' + ' + (rest - x1) + ' = ' + x2 + ' + ' + (rest - x2) + '.', code: 'same-sum' },
            { html: '<b>No.</b> Hexagons are never similar.', why: 'Two regular hexagons are always similar. The question is whether these two pass both tests.', code: 'never' }],
            'No. Each pair of last angles adds to ' + t(dgT(rest)) + ', but the split could be different (for example ' + t(dgT(x1)) + ' and ' + t(dgT(rest - x1)) + ' in one, ' + t(dgT(x2)) + ' and ' + t(dgT(rest - x2)) + ' in the other). We need all six pairs of angles.', ['Can two different pairs of numbers have the same sum?'], 'Zoe'); } }] },
      { num: '13', stem: function (sh) { return 'Rectangle A is ' + N(sh.a) + ' cm by ' + N(sh.b) + ' cm. Rectangle B is ' + N(sh.a * sh.k) + ' cm by ' + N(sh.b * sh.k) + ' cm.'; }, shared: function (r) { return find(function () { return { a: r.pick([2, 3, 4, 5]), b: r.pick([5, 6, 7, 8]), k: r.pick([2, 3, 2.5]), m: r.pick([3, 4, 1.5]) }; }, function (v) { return v.b > v.a && v.k !== v.m && !(v.a === 3 && v.b === 5); }); }, parts: [
        { id: 'e13a', level: 'EMG', make: function (r, sh) { return kPart('(a) The rectangles are similar. Find the scale factor from A to B.', sh.k, { from: { new: sh.a * sh.k, orig: sh.a }, sol: t(N(sh.a * sh.k) + '\\div ' + N(sh.a) + '=' + N(sh.k)) + ' and ' + t(N(sh.b * sh.k) + '\\div ' + N(sh.b) + '=' + N(sh.k)) + ': similar with ' + t('k=' + N(sh.k)) + '.', hints: ['Divide B’s side by A’s matching side.'], text: 'rect k' }); } },
        { id: 'e13b', level: 'PRG', make: function (r, sh) { var A1 = sh.a * sh.b, A2 = q(A1 * sh.k * sh.k);
          return fieldsPart('(b) Find the area of each rectangle. How many times as big is the area of B?', [fld('Area of A:', A1, { after: 'cm²', dp: 2, noPlaces: true, name: 'Area A' }), fld('Area of B:', A2, { after: 'cm²', dp: 2, noPlaces: true, name: 'Area B' }), fld('B ÷ A:', sh.k * sh.k, { after: 'times', dp: 2, noPlaces: true, name: 'Times', diag: [{ v: sh.k, code: 'u6l1-k-sq', hint: 'Divide the two areas: it isn’t ' + N(sh.k) + '.' }] })],
            t(N(sh.a) + '\\times ' + N(sh.b) + '=' + N(A1)) + ' cm², ' + t(N(sh.a * sh.k) + '\\times ' + N(sh.b * sh.k) + '=' + N(A2)) + ' cm², ' + t(N(A2) + '\\div ' + N(A1) + '=' + N(sh.k * sh.k)) + ' times (not ' + N(sh.k) + ' times).', ['Area = length × width.'], 'rect areas 2'); } },
        { id: 'e13c', level: 'MAS', make: function (r, sh) { var c1 = q(sh.a * sh.m), c2 = q(sh.b * sh.m), A1 = sh.a * sh.b, A3 = q(c1 * c2), t3 = q(sh.m * sh.m);
          return fieldsPart('(c) Rectangle C is ' + N(c1) + ' cm by ' + N(c2) + ' cm. Find its scale factor from A, and how many times as big its area is.', [kFld('Scale factor from A: ' + t('k='), sh.m, { from: { new: c1, orig: sh.a } }), fld('Area of C ÷ area of A:', t3, { after: 'times', dp: 2, noPlaces: true, name: 'Times', diag: [{ v: sh.m, code: 'u6l1-k-sq', hint: 'Find C’s area (' + N(c1) + ' × ' + N(c2) + ') and divide by A’s area.' }, { v: 2 * sh.m, code: 'u6l1-k-sq', hint: 'The area grows by k × k, not 2 × k.' }] })],
            br([t('k=' + N(c1) + '\\div ' + N(sh.a) + '=' + N(sh.m)), 'Area: ' + t(N(c1) + '\\times ' + N(c2) + '=' + N(A3)) + ' cm², and ' + t(N(A3) + '\\div ' + N(A1) + '=' + N(t3)), 'Pattern: the area grows by ' + t('k\\times k') + ' (' + t(N(sh.k) + '\\times ' + N(sh.k) + '=' + N(sh.k * sh.k)) + ', ' + t(N(sh.m) + '\\times ' + N(sh.m) + '=' + N(t3)) + ').']), ['k = C’s side ÷ A’s side.', 'Look at (b): how was the area number related to k?'], 'rect C'); } }] },
      { num: '14', stem: function (sh) { return 'A painting is ' + N(sh.a) + ' cm by ' + N(sh.b) + ' cm. It gets a border of the same width on every side.'; }, shared: function (r) { return find(function () { return { a: r.pick([20, 30, 40, 24]), b: r.pick([45, 50, 60, 36]), f1: r.pick([4, 5]), f2: r.pick([8, 10]) }; }, function (v) { return v.b > v.a && !(v.a === 30 && v.b === 45); }); }, parts: [
        { id: 'e14a', level: 'PRG', make: function (r, sh) { var g = function (f) { return { A: sh.a + 2 * f, B: sh.b + 2 * f }; }, g1 = g(sh.f1), g2 = g(sh.f2);
          return fieldsPart('(a) Find long ÷ short for the painting with a ' + U(sh.f1, 'cm') + ' border and with a ' + U(sh.f2, 'cm') + ' border.', [ratioFld(N(sh.f1) + ' cm border: long ÷ short =', g1.B, g1.A, { name: N(sh.f1) + ' cm border', diag: [{ v: (sh.b + sh.f1) / (sh.a + sh.f1), code: 'u6l2-one-border', hint: 'The border is on both ends: add ' + N(2 * sh.f1) + ' cm to each side.' }] }), ratioFld(N(sh.f2) + ' cm border: long ÷ short =', g2.B, g2.A, { name: N(sh.f2) + ' cm border', diag: [{ v: (sh.b + sh.f2) / (sh.a + sh.f2), code: 'u6l2-one-border', hint: 'The border is on both ends: add ' + N(2 * sh.f2) + ' cm to each side.' }] })],
            br([N(sh.f1) + ' cm border: ' + N(g1.A) + ' cm by ' + N(g1.B) + ' cm, ' + rTex(g1.B, g1.A), N(sh.f2) + ' cm border: ' + N(g2.A) + ' cm by ' + N(g2.B) + ' cm, ' + rTex(g2.B, g2.A)]), ['Add the border twice to each side, then divide long ÷ short.'], 'borders'); } },
        { id: 'e14b', level: 'PRG', make: function (r, sh) { var R = sh.b / sh.a;
          return mc(r, '(b) The painting’s ratio is ' + rTex(sh.b, sh.a) + '. Can any border of the same width all around make the framed painting similar to the painting?', [
            { html: '<b>No.</b> Adding the same amount makes the short side grow by a bigger fraction than the long side, so long ÷ short keeps getting smaller. It only equals ' + rd(R, 2) + ' with no border.', right: true },
            { html: '<b>Yes.</b> A wide enough border will bring the ratio back to ' + rd(R, 2) + '.', why: 'Look at (a): the ratio gets <b>smaller</b> as the border gets wider, moving away from ' + rd(R, 2) + '.', code: 'wide' },
            { html: '<b>Yes.</b> Any border works, because the corners are still 90°.', why: 'Equal angles aren’t enough: long ÷ short must match too.', code: 'u6l2-angles-only' },
            { html: '<b>No.</b> A border always makes the painting bigger.', why: 'Bigger can still be similar. The real reason is that long ÷ short changes.', code: 'u6l2-size' }],
            'No. Adding the same amount to both sides makes the short side grow by a bigger fraction, so long ÷ short keeps getting smaller (' + rd(R, 2) + ', then the values in (a), …). It only matches with no border at all.', ['Look at how the ratio changed in (a).'], 'border never'); } }] },
      { num: '15', stem: 'Choose the shape.', parts: [
        { id: 'e15a', level: 'PRG', make: function (r) { var v = find(function () { return { a: r.pick([4, 3, 5, 6]), b: r.pick([6, 8, 9, 10]), m: r.pick([2, 1.5, 3]) }; }, function (v) { return v.b > v.a && v.b !== 2 * v.a && v.b * v.m !== 2 * v.a * v.m && v.a * 2 !== v.b; }), a = v.a, b = v.b;
          return mc(r, '(a) Which quadrilateral has the same angles as ' + KT.aN(a) + ' ' + N(a) + ' cm by ' + N(b) + ' cm rectangle, but is <b>not</b> similar to it?', [
            { html: 'A rectangle ' + N(a) + ' cm by ' + N(2 * a) + ' cm', right: true }, { html: 'A rectangle ' + N(a * v.m) + ' cm by ' + N(b * v.m) + ' cm', why: 'Both sides are × ' + N(v.m) + ': that one <b>is</b> similar.', code: 'sim' },
            { html: 'A rhombus with ' + U(b, 'cm') + ' sides and 60° angles', why: 'A rhombus with 60° angles doesn’t have the same angles as a rectangle.', code: 'rhombus' }, { html: 'A rectangle ' + N(b) + ' cm by ' + N(a) + ' cm (turned)', why: 'Turning doesn’t change the shape: that one is congruent, so it <b>is</b> similar.', code: 'turn' }],
            'Any rectangle with a different long ÷ short, for example ' + N(a) + ' cm by ' + N(2 * a) + ' cm (' + rTex(2 * a, a) + ', but ' + rTex(b, a) + '). Its angles are all 90°, but it is not similar.', ['Same angles: another rectangle. Not similar: a different long ÷ short.'], 'describe a'); } },
        { id: 'e15b', level: 'PRG', make: function (r) { var s = r.pick([3, 2, 4, 5]), m = r.pick([2, 3, 1.5]), th = r.pick([50, 60, 70, 40]);
          return mc(r, '(b) Which quadrilateral has all its sides in the same ratio to the sides of a square with ' + U(s, 'cm') + ' sides, but is <b>not</b> similar to it?', [
            { html: 'A rhombus with ' + U(s * m, 'cm') + ' sides and angles of ' + t(dgT(th)) + ' and ' + t(dgT(180 - th)), right: true }, { html: 'A square with ' + U(s * m, 'cm') + ' sides', why: 'Two squares are always similar.', code: 'square' },
            { html: 'A rectangle ' + N(s) + ' cm by ' + N(s * 2) + ' cm', why: 'Its side ratios are ' + N(s) + ' ÷ ' + N(s) + ' = 1 and ' + N(2 * s) + ' ÷ ' + N(s) + ' = 2: not all the same.', code: 'rect' },
            { html: 'A rhombus with ' + U(s * m, 'cm') + ' sides and 90° angles', why: 'A rhombus with 90° angles is a square, so it is similar.', code: 'sq-rhombus' }],
            'A rhombus that is not a square: every side ratio is ' + N(s * m) + ' ÷ ' + N(s) + ' = ' + N(m) + ', but its angles are ' + t(dgT(th)) + ' and ' + t(dgT(180 - th)) + ', not 90°.', ['Same side ratios but different angles.'], 'describe b'); } }] }
    ]
  });
  function D2(x) { return t(dgT(x)); }
})(window);
