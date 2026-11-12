/* Math 10-3 · Unit 3 · Lesson 12 — Unit 3 Review (mixed outcomes per part: M1, M2, M3, M4, A1; REV for mixed-number arithmetic)
 * Assignment 12 (u3_l12.tex: Part A Written Response 1–15, Part B Multiple Choice 16–23, Part C Numerical Response 24–27)
 * and the Lesson 12 Extra Practice = Practice Test 2 (u3_ep12.tex: A Skills 1–5, B Applying 6–13, C Stretch 14–15).
 * Every part is a generator: the same kind of item and the same steps as the booklet question, new numbers around the
 * booklet's (the booklet's own numbers are among the possible values; the lesson's worked-example numbers — the one-page
 * examples (2¾ + 1⅝, 3.45 m, 850 m, 100 in, 5′9″ + 2′8″, 3¾ in, 5′10″, d = 30 cm, P = 36 / l = 11, r = 5 m, 54 ft², 12 full /
 * 20 part squares, the 3 cm cube, the r = 2 / h = 5 cylinder), the ruler at 1 3/16 and 4 5/8, Sofia's 2¾ ft baseboard,
 * 3.2 km / 65 mm / 0.48 m, 9′5″, 2 mi, 7 yd, Liam's 5′11″, Ruby's 5 km, the 3′9″ and 2′10″ shelves, the 6 m by 3 m bed with
 * a half circle, the 32 m dog run, the 4.4 m table, the 22.5 m² patio, the 2.4 by 3.5 sail, the 3½ / 5½ / 2 trapezoid, the
 * 1.8 m rug, the 18 by 15 L-shaped room, the 5-5-8 chocolate box, the 3.8 by 11 soup can, the 2.2 / 1.8 tent and the 6 / 15
 * funnel — are left out). Constants exactly as the booklet gives them: 1 in = 2.54 cm, 1 ft = 30.48 cm, 1 m ≈ 3.28 ft,
 * 1 mi ≈ 1.609 km, 1 km ≈ 0.621 mi, 1 ft² = 144 in², 1 yd² = 9 ft², 1 m² = 10 000 cm². Calculator allowed (π key).
 * Answers: typed numbers (a unit after the number is ignored), rounded as the booklet asks, with the usual nudges (too many /
 * too few decimals, the wrong rounding direction is wrong with a hint). Ruler readings and mixed-number answers are typed
 * with the mixed-number keypad and must be in simplest form (an unsimplified fraction, an improper fraction or a fraction
 * part of 1 or more gets a nudge, no try used). Feet-and-inches answers are two boxes; 5 ft 16 in for 6 ft 4 in gets a
 * nudge. Recognised mistakes each get their own hint: a conversion multiplied instead of divided (or the reverse), the
 * wrong factor (10 / 100 / 1000, 3 / 12 / 36, 9 for square yards), 5′4″ read as 5.4 ft, inches regrouped by 10, no
 * borrowing, counting from the next inch, reading sixteenths as tenths, the diameter used as the radius, the circumference
 * for the area, the 4 labelled sides of an L-shape for its perimeter, the driveway gap not taken off, (P − w) ÷ 2, C × π,
 * a full circle for a half, a box with a top, one triangle of a prism, 6′8″ as 6.8 ft, not rounding pieces / cans up, …
 * Conversions: the ruler is drawn (SVG) with its arrows; "which answer is in square units? why?" and "can he cut a third
 * piece? explain" and "is he under the limit?" → multiple choice whose options are reasons (one right); the face table of
 * the toy bin → the table input (sizes shown, areas as boxes); "sketch a net of the box" → choose the correct net (MC of
 * drawn nets); the pond on a grid is drawn (a new pond each time), and any estimate within 15% of the full + half-of-part
 * count is accepted; numerical response → the 4-character NR box. Booklet parts that ask two things are split into
 * lettered sub-parts (5(e i), 5(e ii)).
 * Uses HW.u3sa (js/lessons/u3l11.js) and HW.pctKit (js/lessons/u1l7.js, the table input).
 * Levels: LIM BEG EMG PRG ADV MAS (MAS: Extra 14(c), Extra 15(c)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var S = HW.u3sa, PI = Math.PI;
  var q = S.q, rd = S.rd, near = S.near, nS = S.nS, decs = S.decs, N = S.N, raw = S.raw, rw = S.rw, eqR = S.eqR, uT = S.uT, br = S.br, find = S.find, pickR = S.pickR, cap = S.cap, M = S.M, Mp = S.Mp, NAMES = S.NAMES, gcd = S.gcd;
  var num = S.num, fields = S.fields, svgT = S.svgT, svgL = S.svgL, svgWrap = S.svgWrap;
  var INK = '#2b3340', FILL = '#f4faf9', FILL2 = '#e4efe9', BLUE = '#cfe3f3';

  /* ---------- a fraction keypad with a second key for mixed numbers (as in Math 15 u1l2) ---------- */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.mixed = [
      [dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '−', tex: '-', plain: '-' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.mixed = ['Fraction: type the top number, press <b><sup>a</sup>⁄<sub>b</sub></b>, then type the bottom number. Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then type the top and bottom numbers. Press <b>▶</b> to move to the next box.',
      'Type a fraction as <code>3/4</code> and a mixed number as <code>2 3/4</code> (a space between the whole number and the fraction).'];
  }

  /* ================= exact fractions ================= */
  function R(p, d) { if (d < 0) { p = -p; d = -d; } var g = gcd(p, d) || 1; return [p / g, d / g]; }
  function radd(a, b) { return R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function rsub(a, b) { return R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function rmul(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rv(a) { return a[0] / a[1]; }
  function fT(a) { return a[1] === 1 ? String(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(a[0]) + '}{' + a[1] + '}'; }
  function mT(a) { var p = Math.abs(a[0]), d = a[1]; if (d === 1 || p < d) return fT(a); return (a[0] < 0 ? '-' : '') + Math.floor(p / d) + (p % d ? '\\frac{' + (p % d) + '}{' + d + '}' : ''); }
  function mPlain(a) { var p = a[0], d = a[1]; if (d === 1) return String(p); if (p < d) return p + '/' + d; return Math.floor(p / d) + (p % d ? ' ' + (p % d) + '/' + d : ''); }
  function mix(w, n, d) { return R(w * d + n, d); }                                  // w n/d as a fraction
  function mixD(w, n, d) { return (w ? w : '') + '\\frac{' + n + '}{' + d + '}'; }    // w n/d as TeX, as written (not reduced)
  function readF(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\text\{([^{}]*)\}/g, '$1').replace(/\s*(in|ft|cm|m)\.?\s*$/, '');
    var m = /^\s*([-−])?\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
    if (m) s = (m[1] ? '-' : '') + m[2] + '\\frac{' + m[3] + '}{' + m[4] + '}';
    return K.read(s);
  }
  function mixedParts(ast) {
    var s = 1, a = ast;
    while (a.t === 'neg' || a.t === 'paren') { if (a.t === 'neg') s = -s; a = a.a; }
    if (a.t === 'mul' && a.imp && a.a.t === 'neg' && a.a.a.t === 'num') { s = -s; a = { t: 'mul', imp: true, a: a.a.a, b: a.b }; }
    if (a.t !== 'mul' || !a.imp || a.a.t !== 'num' || a.a.dec || a.b.t !== 'div' || !a.b.frac) return null;
    var n = a.b.a, d = a.b.b; if (n.t !== 'num' || d.t !== 'num' || n.dec || d.dec || !d.v) return null;
    return { s: s, w: a.a.v, n: n.v, d: d.v };
  }
  /* a mixed-number answer in simplest form. o.bad: [[fraction, code, hint]] */
  function fracChk(T, o) {
    o = o || {}; var Tv = rv(T);
    function diagV(v) {
      for (var i = 0; o.bad && i < o.bad.length; i++) if (ex.eq(v, rv(o.bad[i][0]))) return wrong(o.bad[i][1], o.bad[i][2]);
      return wrong('value', o.miss || null);
    }
    return function (resp) {
      var a = readF(resp); if (a.res) return a.res;
      var mp = mixedParts(a.ast);
      if (mp) {
        var mv = mp.s * (mp.w + mp.n / mp.d);
        if (mp.n >= mp.d) return ex.eq(mv, Tv) ? form('u3l12-mixed-improper', 'In a mixed number the fraction part must be less than 1 — take another whole out of it (' + t('\\frac{' + mp.d + '}{' + mp.d + '}=1') + ').') : diagV(mv);
        if (ex.eq(mv, Tv)) { if (gcd(mp.n, mp.d) > 1) return form('lowest', 'Right value — now simplify the fraction part (divide its top and bottom by ' + t(gcd(mp.n, mp.d)) + ').'); return ok(); }
        return diagV(mv);
      }
      var pf = ex.plainFraction(a.ast), sh = ex.shape(a.ast), v = a.val;
      if (ex.eq(v, Tv)) {
        if (sh.decimals && !pf) return form('u3l12-decimal', 'Right value — now write it as a fraction or mixed number (like ' + t('2\\frac{3}{8}') + '), not a decimal.');
        if (!pf) return form('simplify', 'That has the right value, but work it out to a single mixed number.');
        if (gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now write it in simplest form (divide the top and bottom by ' + t(gcd(pf[0], pf[1])) + ').');
        if (Math.abs(pf[0]) > pf[1] && pf[1] !== 1) return form('u3l12-want-mixed', 'Right value — now write it as a <b>mixed number</b>: ' + t(fT(R(pf[0], pf[1])) + '=' + mT(R(pf[0], pf[1]))) + '.');
        return ok();
      }
      return diagV(v);
    };
  }
  function fracPart(prompt, T, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'math', keys: 'mixed', before: o.before, after: o.after, placeholder: 'e.g. 2 3/4' }, check: fracChk(T, o), key: mT(T), answer: t(mT(T) + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.good = [mPlain(T)]; p.bad = (o.bad || []).filter(function (b) { return !ex.eq(rv(b[0]), rv(T)); }).map(function (b) { return mT(b[0]); }).slice(0, 3);
    return p;
  }

  /* ================= feet and inches (two boxes) ================= */
  function ftin(i) { return Math.floor(i / 12) + ' ft ' + (i % 12) + ' in'; }
  function ftinT(i) { return Math.floor(i / 12) + "'\\," + (i % 12) + "''"; }
  /* total = inches; o.bad: [[ft, in, code, hint]] */
  function ftinPart(prompt, total, o) {
    o = o || {}; var F = Math.floor(total / 12), I = total % 12;
    var check = function (resp) {
      resp = resp || []; var a = S.readNum(resp[0]), b = S.readNum(resp[1]);
      if (a.res && a.res.code === 'empty' && b.res && b.res.code === 'empty') return form('empty', 'Fill in both boxes (feet and inches).');
      if (a.res) return a.res.code === 'empty' ? form('empty', 'Fill in the feet box (type 0 if there are no whole feet).') : a.res;
      if (b.res) return b.res.code === 'empty' ? form('empty', 'Fill in the inches box (type 0 if there are no inches left over).') : b.res;
      var f = a.v, i = b.v;
      if (near(f, F) && near(i, I)) return ok();
      for (var k = 0; o.bad && k < o.bad.length; k++) if (near(f, o.bad[k][0]) && near(i, o.bad[k][1])) return wrong(o.bad[k][2], o.bad[k][3]);
      if (near(f * 12 + i, total) && i >= 12) return form('u3l12-regroup', 'Right length, but the inches part must be less than 12. Change 12 in into 1 ft.');
      if (near(f * 12 + i, total)) return form('u3l12-ftin-form', 'Right length — now write it with as many whole feet as possible (and less than 12 in).');
      if (near(f, total / 12) || near(f, rd(total / 12, 2)) || near(f, rd(total / 12, 1))) return form('u3l12-ftin-dec', 'Give whole feet and the inches left over (two whole numbers), not a decimal number of feet.');
      if (near(f, F) && !near(i, I)) return wrong('u3l12-inches', 'The feet are right. Check the inches.');
      return wrong('value', o.miss || null);
    };
    var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: '', name: 'Feet', after: 'ft' }, { label: '', name: 'Inches', after: 'in' }] }, check: check, key: [String(F), String(I)], answer: F + ' ft ' + I + ' in', solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = (o.bad || []).slice(0, 2).map(function (b) { return [String(b[0]), String(b[1])]; });
    return p;
  }

  /* ================= a ruler (0 to 6 in, sixteenths) with arrows ================= */
  function ruler(marks) {
    var u = 84, x0 = 22, top = 36, body = 52, g = '';
    g += '<rect x="' + (x0 - 10) + '" y="' + top + '" width="' + (6 * u + 20) + '" height="' + body + '" fill="#fbf6e9" stroke="' + INK + '" stroke-width="1.8"/>';
    for (var k = 0; k <= 96; k++) {
      var L = k % 16 === 0 ? 30 : k % 8 === 0 ? 23 : k % 4 === 0 ? 17 : k % 2 === 0 ? 12 : 8, w = k % 16 === 0 ? 1.6 : k % 4 === 0 ? 1.2 : 0.9, x = x0 + k * u / 16;
      g += '<line x1="' + x.toFixed(2) + '" y1="' + top + '" x2="' + x.toFixed(2) + '" y2="' + (top + L) + '" stroke="' + INK + '" stroke-width="' + w + '"/>';
      if (k % 16 === 0) g += svgT(x + (k === 0 ? 5 : 0), top + 46, String(k / 16), { size: 14 });
    }
    marks.forEach(function (m) {
      var x = x0 + m.n * u / 16;
      g += '<line x1="' + x.toFixed(2) + '" y1="16" x2="' + x.toFixed(2) + '" y2="' + (top - 6) + '" stroke="#b03a2e" stroke-width="1.8"/>';
      g += '<polygon points="' + (x - 4.5).toFixed(2) + ',' + (top - 8) + ' ' + (x + 4.5).toFixed(2) + ',' + (top - 8) + ' ' + x.toFixed(2) + ',' + (top - 0.5) + '" fill="#b03a2e"/>';
      g += svgT(x, 13, '<tspan font-weight="bold">' + m.lab + '</tspan>', { size: 14, color: '#b03a2e' });
    });
    return svgWrap(x0 + 6 * u + 22, top + body + 6, g, 'ruler in inches with arrows ' + marks.map(function (m) { return m.lab; }).join(', '), 640) + '<div class="muted" style="font-size:0.85em">Each inch is split into 16 small spaces.</div>';
  }
  /* reading a ruler position n (sixteenths) */
  function readPart(prompt, n, o) {
    o = o || {}; var w = Math.floor(n / 16), k = n % 16, T = R(n, 16), bad = [];
    if (n + 16 <= 96) bad.push([R(n + 16, 16), 'u3l12-next-inch', 'The whole inches are the <b>last</b> number you passed (' + w + '), not the next one.']);
    if (w >= 1) bad.push([R(n - 16, 16), 'u3l12-prev-inch', 'The whole inches are the last number you passed: ' + w + '.']);
    if (k < 10) bad.push([radd([w, 1], R(k, 10)), 'u3l12-tenths', 'Each inch has <b>16</b> small spaces, not 10. Count the spaces and write the fraction over 16.']);
    if (k < 8) bad.push([radd([w, 1], R(k, 8)), 'u3l12-eighths', 'Count the <b>smallest</b> spaces: there are 16 in each inch, so each one is ' + t('\\frac{1}{16}') + ' in.']);
    if (k > 0) bad.push([radd([w, 1], R(16 - k, 16)), 'u3l12-from-right', 'Count the spaces <b>past</b> ' + w + ' (to the right of it), not back from ' + (w + 1) + '.']);
    var g = gcd(k, 16), sol = k === 0 ? 'The arrow is on the ' + w + ' in mark.' : k + ' small spaces past ' + w + ': ' + t(mixD(w, k, 16) + (g > 1 ? '=' + mT(T) : '')) + ' in';
    return fracPart(prompt, T, { after: 'in', bad: bad, sol: [sol], hints: o.hints || ['Whole inches: the last number you passed. Then count the ' + t('\\frac{1}{16}') + ' spaces past it and simplify.'], text: o.text || 'ruler reading' });
  }
  /* the distance between two ruler positions (sixteenths) */
  function distPart(prompt, a, b, o) {
    o = o || {}; var T = R(b - a, 16), A = R(a, 16), B = R(b, 16);
    var wa = Math.floor(a / 16), wb = Math.floor(b / 16), ka = a % 16, kb = b % 16, bad = [[radd(A, B), 'u3l12-added', 'The distance between them is the bigger reading <b>minus</b> the smaller one.']];
    if (kb < ka) bad.push([radd([wb - wa, 1], R(ka - kb, 16)), 'u3l12-no-borrow', 'You took the smaller fraction from the bigger one. Borrow 1 inch as ' + t('\\frac{16}{16}') + ' first: ' + t(mixD(wb, kb, 16) + '=' + mixD(wb - 1, kb + 16, 16)) + '.']);
    var lines = [t(mT(B) + '-' + mT(A) + '=' + mixD(wb, kb, 16) + '-' + mixD(wa, ka, 16))];
    if (kb < ka) lines.push(t('=' + mixD(wb - 1, kb + 16, 16) + '-' + mixD(wa, ka, 16)) + ' (borrow 1 in)');
    lines.push(t('=' + mT(T)) + ' in');
    return fracPart(prompt, T, { after: 'in', bad: bad, sol: lines, hints: ['Subtract the smaller reading from the bigger one. Use 16ths for both.'], text: o.text || 'ruler distance' });
  }
  function rulerPos(r, ex1) {
    return find(function () {
      return { A: r.pick([2, 4, 6, 10, 12, 14]), B: 16 * r.int(1, 3) + r.pick([1, 3, 5, 7, 9, 11, 13, 15]), C: 16 * r.int(4, 5) + r.pick([2, 4, 6, 8, 10, 12, 14]) };
    }, function (s) { return [s.A, s.B, s.C].every(function (n) { return (ex1 || []).indexOf(n) < 0; }) && s.C - s.B > 16 && (s.C % 16) !== (s.B % 16); });
  }

  /* ================= unit conversions ================= */
  /* x (from) → to by multiplying (mul) or dividing by f. o: { from, to, dp, alts, other: [factors], bad, sol, hints } */
  function convPart(prompt, x, f, mul, o) {
    o = o || {}; var ans = q(mul ? x * f : x / f), bad = [[mul ? x / f : x * f, 'u3l12-wrong-way', mul ? o.from + ' is the bigger unit, so there are <b>more</b> ' + o.to + ': multiply by ' + N(f) + '.' : o.from + ' is the smaller unit, so there are <b>fewer</b> ' + o.to + ': divide by ' + N(f) + '.']];
    (o.other || []).forEach(function (g) { if (g === f) return; bad.push([mul ? x * g : x / g, 'u3l12-factor', 'Check the conversion factor: ' + o.fact + '.']); bad.push([mul ? x / g : x * g, 'u3l12-factor', 'Check the conversion factor: ' + o.fact + '.']); });
    return num(prompt, ans, { dp: o.dp, exact: ans, alts: o.alts, after: o.to, bad: bad.concat(o.bad || []), sol: o.sol || [t(N(x) + (mul ? '\\times ' : '\\div ') + N(f) + eqR(ans, o.dp) + uT(o.to))],
      hints: o.hints || [(mul ? 'Big unit → small unit: multiply' : 'Small unit → big unit: divide') + ' by ' + t(N(f)) + ' (' + o.fact + ').'], text: o.text || o.from + ' to ' + o.to });
  }
  var SIF = { kmm: [1000, '1 km = 1000 m'], mcm: [100, '1 m = 100 cm'], cmmm: [10, '1 cm = 10 mm'], mmm: [1000, '1 m = 1000 mm'] };
  function siConv(letter, x, from, to) {
    var key = { 'km-m': 'kmm', 'm-km': 'kmm', 'm-cm': 'mcm', 'cm-m': 'mcm', 'cm-mm': 'cmmm', 'mm-cm': 'cmmm', 'm-mm': 'mmm', 'mm-m': 'mmm' }[from + '-' + to], f = SIF[key], order = ['km', 'm', 'cm', 'mm'];
    var mul = order.indexOf(from) < order.indexOf(to);
    return convPart('(' + letter + ') ' + t(N(x) + uT(from)) + ' = ____ ' + to, x, f[0], mul, { from: from, to: to, fact: f[1], other: [10, 100, 1000], text: from + '→' + to,
      sol: [(mul ? 'Bigger unit to smaller unit: multiply by ' : 'Smaller unit to bigger unit: divide by ') + N(f[0]) + ' (' + f[1] + ')', t(N(x) + (mul ? '\\times ' : '\\div ') + N(f[0]) + '=' + N(q(mul ? x * f[0] : x / f[0])) + uT(to))] });
  }
  var IMF = { ftin: [12, '1 ft = 12 in'], ydft: [3, '1 yd = 3 ft'], ydin: [36, '1 yd = 36 in'], mift: [5280, '1 mi = 5280 ft'], miyd: [1760, '1 mi = 1760 yd'] };
  function imConv(letter, x, k, mul) {
    var f = IMF[k], u = { ftin: ['ft', 'in'], ydft: ['yd', 'ft'], ydin: ['yd', 'in'], mift: ['mi', 'ft'], miyd: ['mi', 'yd'] }[k], from = mul ? u[0] : u[1], to = mul ? u[1] : u[0];
    return convPart('(' + letter + ') ' + t(N(x) + uT(from)) + ' = ____ ' + to, x, f[0], mul, { from: from, to: to, fact: f[1], other: [3, 12, 36, 1760, 5280], text: from + '→' + to,
      sol: [(mul ? 'To a smaller unit: multiply by ' : 'To a bigger unit: divide by ') + N(f[0]) + ' (' + f[1] + ')', t(N(x) + (mul ? '\\times ' : '\\div ') + N(f[0]) + '=' + N(q(mul ? x * f[0] : x / f[0])) + uT(to))] });
  }
  /* a′b″ → inches */
  function toInPart(letter, a, b) {
    var ans = 12 * a + b;
    return num('(' + letter + ') ' + t(a + "'\\," + b + "''") + ' = ____ in', ans, { after: 'in', bad: [[10 * a + b, 'u3l12-ft10', 'A foot is <b>12</b> inches, not 10: ' + t(a + '\\times 12+' + b) + '.'], [12 * a, 'u3l12-no-in', 'Add the ' + b + ' extra inches too.'], [a + b / 10, 'u3l12-ftin-dec', 'Change the feet to inches (' + t('\\times 12') + ') and add the inches.'], [12 * a * b, 'u3l12-mult', 'Change the feet to inches (' + t(a + '\\times 12') + '), then <b>add</b> the ' + b + ' in.']],
      sol: [t(a + '\\times 12+' + b + '=' + 12 * a + '+' + b + '=' + ans + uT('in'))], hints: ['Feet × 12, then add the inches.'], text: 'ft-in to in' });
  }
  /* inches → ft and in */
  function toFtInPart(letter, n) {
    var F = Math.floor(n / 12), I = n % 12, dec = q(n / 12);
    var bad = [[F, Math.round((dec - F) * 100) % 100, 'u3l12-dec-in', 'The decimal part of ' + t(N(rd(dec, 2))) + ' ft is not the inches. Find the remainder: ' + t(F + '\\times 12=' + 12 * F) + ', and ' + t(n + '-' + 12 * F + '=' + I) + ' in.'], [Math.floor(n / 10), n % 10, 'u3l12-ft10', 'A foot is 12 in, not 10. Divide by 12.']];
    bad = bad.filter(function (b) { return !(b[0] === F && b[1] === I); });
    return ftinPart('(' + letter + ') ' + t(n + uT('in')) + ' = ____ ft ____ in', n, { bad: bad, sol: [t(n + '\\div 12=' + F) + ' R ' + I + ' (' + t(F + '\\times 12=' + 12 * F) + ', ' + t(n + '-' + 12 * F + '=' + I) + ')', F + ' ft ' + I + ' in'], hints: ['Divide by 12. The whole number is the feet; the remainder is the inches.'], text: 'in to ft-in' });
  }

  /* ================= mixed-number arithmetic (REV) ================= */
  function addPart(letter, a, b) {   // a, b: [w, n, d]
    var A = mix(a[0], a[1], a[2]), B = mix(b[0], b[1], b[2]), T = radd(A, B), L = a[2] * b[2] / gcd(a[2], b[2]);
    var n1 = a[1] * L / a[2], n2 = b[1] * L / b[2], sw = a[0] + b[0], sn = n1 + n2;
    var bad = [[radd([a[0] + b[0], 1], R(a[1] + b[1], a[2] + b[2])), 'u3l12-across', 'Don’t add the bottoms. Change both fractions to the same denominator (' + L + 'ths), then add the tops.']];
    return fracPart('(' + letter + ') ' + t(mixD(a[0], a[1], a[2]) + '+' + mixD(b[0], b[1], b[2])), T, { before: t('='), bad: bad,
      sol: [t(mixD(a[0], n1, L) + '+' + mixD(b[0], n2, L) + '=' + mixD(sw, sn, L)), sn >= L ? t('=' + mT(T)) + ' (' + t('\\frac{' + sn + '}{' + L + '}=1\\frac{' + (sn - L) + '}{' + L + '}') + ')' : ''], hints: ['Use a common denominator. Add the whole numbers and the fractions; change an improper fraction part into a whole.'], text: 'add mixed' });
  }
  function subPart(letter, a, b) {
    var A = mix(a[0], a[1], a[2]), B = mix(b[0], b[1], b[2]), T = rsub(A, B), L = a[2] * b[2] / gcd(a[2], b[2]);
    var n1 = a[1] * L / a[2], n2 = b[1] * L / b[2];
    var bad = [[radd([a[0] - b[0], 1], R(Math.abs(n1 - n2), L)), 'u3l12-no-borrow', 'You can’t take ' + t('\\frac{' + n2 + '}{' + L + '}') + ' from ' + t('\\frac{' + n1 + '}{' + L + '}') + '. Borrow 1 whole as ' + t('\\frac{' + L + '}{' + L + '}') + ' first.'], [radd([a[0] - b[0], 1], R(a[1] - b[1], a[2] - b[2] || 1)), 'u3l12-across', 'Use a common denominator first.']].filter(function (x) { return isFinite(rv(x[0])) && rv(x[0]) > 0; });
    return fracPart('(' + letter + ') ' + t(mixD(a[0], a[1], a[2]) + '-' + mixD(b[0], b[1], b[2])), T, { before: t('='), bad: bad,
      sol: [t(mixD(a[0], n1, L) + '-' + mixD(b[0], n2, L)), t('=' + mixD(a[0] - 1, n1 + L, L) + '-' + mixD(b[0], n2, L) + '=' + mT(R(n1 + L - n2 + (a[0] - 1 - b[0]) * L, L))) + (gcd(n1 + L - n2, L) > 1 ? ' (simplified)' : '')], hints: ['Use a common denominator. If the first fraction is smaller, borrow 1 whole first.'], text: 'subtract mixed' });
  }
  function mulPart(letter, n, b) {
    var B = mix(b[0], b[1], b[2]), T = rmul([n, 1], B), imp = b[0] * b[2] + b[1];
    var bad = [[radd([n * b[0], 1], R(b[1], b[2])), 'u3l12-mixed-whole', 'Change the mixed number to an improper fraction first: ' + t(mixD(b[0], b[1], b[2]) + '=\\frac{' + imp + '}{' + b[2] + '}') + '.'], [radd([n * b[0], 1], R(n * b[1], n * b[2])), 'u3l12-both', 'Multiply only the top by ' + n + ' (' + t(n + '=\\frac{' + n + '}{1}') + ').']];
    return fracPart('(' + letter + ') ' + t(n + '\\times ' + mixD(b[0], b[1], b[2])), T, { before: t('='), bad: bad,
      sol: [t(n + '\\times\\frac{' + imp + '}{' + b[2] + '}=\\frac{' + n * imp + '}{' + b[2] + '}=' + mT(T))], hints: ['Change the mixed number to an improper fraction, multiply the top by ' + n + ', then change back to a mixed number.'], text: 'multiply mixed' });
  }
  function fr(r, dens) { var d = r.pick(dens), n = r.int(1, d - 1); while (gcd(n, d) > 1) n = r.int(1, d - 1); return [n, d]; }

  /* ================= pictures ================= */
  /* an L-shaped yard: W across the bottom, H up the left, a notch at the top right (top edge T, right edge Rr) */
  function lShape(W0, H0, T0, R0, lab) {
    var s = Math.min(220 / W0, 150 / H0), x0 = 50, y0 = 18, X = function (x) { return x0 + x * s; }, Y = function (y) { return y0 + (H0 - y) * s; };
    var pts = [[0, 0], [W0, 0], [W0, R0], [T0, R0], [T0, H0], [0, H0]];
    var g = '<polygon points="' + pts.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ') + '" fill="#e6f2e2" stroke="' + INK + '" stroke-width="2"/>';
    g += svgT(X(W0 / 2), Y(0) + 16, lab.W) + svgT(X(0) - 6, Y(H0 / 2) + 5, lab.H, { anchor: 'end' }) + svgT(X(T0 / 2), Y(H0) - 6, lab.T) + svgT(X(W0) + 6, Y(R0 / 2) + 5, lab.R, { anchor: 'start' });
    g += svgT(X((T0 + W0) / 2), Y(R0) - 6, lab.a, { italic: true }) + svgT(X(T0) + 6, Y((R0 + H0) / 2) + 5, lab.b, { anchor: 'start', italic: true });
    return svgWrap(x0 + W0 * s + 60, y0 + H0 * s + 26, g, 'L-shaped yard', 330);
  }
  /* a stage: rectangle W by D with a half circle on the front */
  function stage(W0, D0) {
    var s = 150 / W0, x0 = 50, y0 = 22, w = W0 * s, d = D0 * s, rr = w / 2;
    var g = '<path d="M' + x0 + ' ' + y0 + ' h' + w + ' v' + d + ' A' + rr + ' ' + rr + ' 0 0 1 ' + x0 + ' ' + (y0 + d) + ' Z" fill="' + FILL + '" stroke="' + INK + '" stroke-width="2"/>';
    g += svgL([x0, y0 + d], [x0 + w, y0 + d], { dash: 1, w: 1.3 }) + svgT(x0 + w / 2, y0 - 6, W0 + ' m') + svgT(x0 - 6, y0 + d / 2 + 5, D0 + ' m', { anchor: 'end' });
    return svgWrap(x0 + w + 30, y0 + d + rr + 10, g, 'stage with a half circle', 260);
  }
  /* a net of a triangular prism: rectangles of widths ws (stacked), length L; tri: indexes of the rectangles that get a triangle on each end */
  function prismNet(ws, labs, triAt, triCount, Lbl, th0) {
    var L = 150, sc = 5, x0 = 50, y = 8, g = '', rows = [];
    ws.forEach(function (w, i) { var hh = w * sc; rows.push([y, hh]); g += '<rect x="' + x0 + '" y="' + y.toFixed(1) + '" width="' + L + '" height="' + hh.toFixed(1) + '" fill="' + FILL + '" stroke="' + INK + '" stroke-width="1.6"/>' + svgT(x0 + L / 2, y + hh / 2 + 4, labs[i], { size: 11 }); y += hh; });
    if (triAt != null) {
      var rr = rows[triAt], mid = rr[0] + rr[1] / 2, th = th0 ? th0 * sc : rr[1] * 0.55;
      g += '<polygon points="' + x0 + ',' + rr[0].toFixed(1) + ' ' + x0 + ',' + (rr[0] + rr[1]).toFixed(1) + ' ' + (x0 - th).toFixed(1) + ',' + mid.toFixed(1) + '" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="1.6"/>';
      if (triCount > 1) g += '<polygon points="' + (x0 + L) + ',' + rr[0].toFixed(1) + ' ' + (x0 + L) + ',' + (rr[0] + rr[1]).toFixed(1) + ' ' + (x0 + L + th).toFixed(1) + ',' + mid.toFixed(1) + '" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="1.6"/>';
    }
    g += svgT(x0 + L / 2, y + 13, Lbl, { size: 11 });
    return '<svg class="fig-svg" viewBox="0 0 ' + (x0 + L + 50) + ' ' + (y + 18).toFixed(0) + '" width="100%" style="max-width:180px;display:block;margin:4px 0" role="img" aria-label="net">' + g + '</svg>';
  }
  /* a pond on a grid: a smooth closed curve; counts full and part squares by sampling */
  function pond(r) {
    var cols = 10, rowsN = 7, cx = 5 + (r.next() - 0.5) * 0.6, cy = 3.3 + (r.next() - 0.5) * 0.4, a = 2.9 + r.next() * 0.7, bb = 1.75 + r.next() * 0.45;
    var k = [r.next() * 0.16, r.next() * 0.12, r.next() * 0.1], ph = [r.next() * 6.28, r.next() * 6.28, r.next() * 6.28];
    function rad(th) { return 1 + k[0] * Math.cos(2 * th + ph[0]) + k[1] * Math.cos(3 * th + ph[1]) + k[2] * Math.sin(th + ph[2]); }
    function inside(x, y) { var dx = (x - cx) / a, dy = (y - cy) / bb, d = Math.sqrt(dx * dx + dy * dy), th = Math.atan2(dy, dx); return d <= rad(th); }
    var full = 0, part = 0;
    for (var i = 0; i < cols; i++) for (var j = 0; j < rowsN; j++) {
      var inn = 0, n = 0;
      for (var u = 0; u <= 6; u++) for (var v = 0; v <= 6; v++) { n++; if (inside(i + u / 6, j + v / 6)) inn++; }
      if (inn === n) full++; else if (inn > 0) part++;
    }
    var pts = []; for (var s = 0; s < 120; s++) { var th = s / 120 * 2 * PI, rr = rad(th); pts.push([cx + a * rr * Math.cos(th), cy + bb * rr * Math.sin(th)]); }
    return { full: full, part: part, pts: pts, cols: cols, rows: rowsN };
  }
  function pondSvg(p) {
    var s = 30, x0 = 6, y0 = 6, X = function (x) { return x0 + x * s; }, Y = function (y) { return y0 + (p.rows - y) * s; }, g = '';
    var poly = p.pts.map(function (pt) { return X(pt[0]).toFixed(1) + ',' + Y(pt[1]).toFixed(1); }).join(' ');
    g += '<polygon points="' + poly + '" fill="' + BLUE + '" stroke="none"/>';
    for (var i = 0; i <= p.cols; i++) g += '<line x1="' + X(i) + '" y1="' + Y(0) + '" x2="' + X(i) + '" y2="' + Y(p.rows) + '" stroke="#9aa3ad" stroke-width="0.8"/>';
    for (var j = 0; j <= p.rows; j++) g += '<line x1="' + X(0) + '" y1="' + Y(j) + '" x2="' + X(p.cols) + '" y2="' + Y(j) + '" stroke="#9aa3ad" stroke-width="0.8"/>';
    g += '<polygon points="' + poly + '" fill="none" stroke="#2c5b84" stroke-width="2"/>';
    return svgWrap(x0 * 2 + p.cols * s, y0 * 2 + p.rows * s, g, 'pond on a grid', 330);
  }

  HW.addCodes({
    'u3l12-mixed-improper': 'Fraction part of a mixed number 1 or more', 'u3l12-decimal': 'Decimal instead of a fraction', 'u3l12-want-mixed': 'Improper fraction instead of a mixed number', 'u3l12-regroup': 'Inches not regrouped (12 in or more)',
    'u3l12-ftin-form': 'Feet and inches not simplified', 'u3l12-ftin-dec': 'Decimal feet instead of feet and inches', 'u3l12-inches': 'Feet right, inches wrong', 'u3l12-next-inch': 'Counted from the next inch', 'u3l12-prev-inch': 'Whole inches one too few',
    'u3l12-tenths': 'Read sixteenths as tenths', 'u3l12-eighths': 'Read the spaces as eighths', 'u3l12-from-right': 'Counted back from the next inch', 'u3l12-added': 'Added instead of subtracting', 'u3l12-no-borrow': 'Didn’t borrow (subtracted the fractions backwards)',
    'u3l12-wrong-way': 'Multiplied instead of dividing (or the reverse)', 'u3l12-factor': 'Used the wrong conversion factor', 'u3l12-ft10': 'Used 10 inches in a foot', 'u3l12-no-in': 'Left out the extra inches', 'u3l12-mult': 'Multiplied instead of adding',
    'u3l12-dec-in': 'Took the decimal part of feet as inches', 'u3l12-across': 'Added/subtracted tops and bottoms straight across', 'u3l12-mixed-whole': 'Multiplied the whole number only', 'u3l12-both': 'Multiplied the top and the bottom',
    'u3l12-regroup10': 'Regrouped 10 in as a foot', 'u3l12-no-carry': 'Didn’t carry the regrouped foot', 'u3l12-borrow10': 'Borrowed a foot as 10 in', 'u3l12-borrow-none': 'Subtracted the inches backwards',
    'u3l12-ftdec': 'Read feet-and-inches as a decimal of feet', 'u3l12-feet-only': 'Converted only the feet', 'u3l12-in-only': 'Left the answer in inches', 'u3l12-four-sides': 'Added only the labelled sides', 'u3l12-area': 'Found the area instead of the perimeter',
    'u3l12-no-gap': 'Didn’t take off the gap', 'u3l12-gap-added': 'Added the gap', 'u3l12-swap': 'Answers in the wrong boxes', 'u3l12-radius-c': 'Used the radius in C = πd', 'u3l12-circ': 'Gave the circumference for the area', 'u3l12-diam-area': 'Used the diameter as the radius',
    'u3l12-rearr': 'Undid the operations in the wrong order', 'u3l12-no-half': 'Didn’t divide by 2', 'u3l12-times-pi': 'Multiplied by π instead of dividing', 'u3l12-radius': 'Gave the radius, not the diameter', 'u3l12-full-circle': 'Used a full circle', 'u3l12-half-r': 'Used the diameter as the radius of the half circle', 'u3l12-no-semi': 'Left out the half circle',
    'u3l12-no-round-up': 'Didn’t round up', 'u3l12-round-down': 'Rounded down', 'u3l12-yd3': 'Used 3 for square yards', 'u3l12-yd-way': 'Multiplied by 9 instead of dividing', 'u3l12-with-top': 'Included a top', 'u3l12-one-face': 'Counted one face of a pair',
    'u3l12-sa-tri': 'Triangle faces: forgot ½ or one triangle', 'u3l12-one-rect': 'Left out a rectangle', 'u3l12-bottom': 'Painted the bottom too', 'u3l12-full-sq': 'Counted part squares as full', 'u3l12-no-part': 'Left out the part squares', 'u3l12-sq1': 'Forgot to multiply by the area of a square',
    'u3l12-door68': 'Read 6′8″ as 6.8 ft', 'u3l12-one-coat': 'Used one coat', 'u3l12-no-openings': 'Didn’t take off the door and window', 'u3l12-cost-exact': 'Cost of the unrounded amount', 'u3l12-floor': 'Included the floor', 'u3l12-cm-in': 'Left the difference in inches'
  });
  HW.addPartial({
    'u3l12-wrong-way': 'n', 'u3l12-factor': 'b', 'u3l12-ft10': 'b', 'u3l12-no-in': 's', 'u3l12-dec-in': 'b', 'u3l12-next-inch': 'b', 'u3l12-tenths': 'b', 'u3l12-eighths': 'b', 'u3l12-from-right': 'b', 'u3l12-no-borrow': 'b', 'u3l12-across': 'n',
    'u3l12-mixed-whole': 'b', 'u3l12-regroup10': 'b', 'u3l12-no-carry': 's', 'u3l12-borrow10': 'b', 'u3l12-ftdec': 'b', 'u3l12-feet-only': 'b', 'u3l12-four-sides': 'b', 'u3l12-no-gap': 's', 'u3l12-gap-added': 'b', 'u3l12-radius-c': 'b', 'u3l12-diam-area': 'b',
    'u3l12-rearr': 'b', 'u3l12-no-half': 'b', 'u3l12-times-pi': 'n', 'u3l12-radius': 'b', 'u3l12-full-circle': 'b', 'u3l12-half-r': 'b', 'u3l12-no-semi': 'b', 'u3l12-no-round-up': 'b', 'u3l12-round-down': 'b', 'u3l12-yd3': 'b', 'u3l12-yd-way': 'n',
    'u3l12-with-top': 'b', 'u3l12-one-face': 'b', 'u3l12-sa-tri': 'b', 'u3l12-one-rect': 'b', 'u3l12-door68': 's', 'u3l12-one-coat': 'b', 'u3l12-no-openings': 'b', 'u3l12-cost-exact': 's', 'u3l12-full-sq': 'b', 'u3l12-no-part': 'b', 'u3l12-sq1': 'b'
  });

  /* ---- a buy-whole-items part ---- */
  function ceilPart(prompt, need, per, unit, o) {
    o = o || {}; var x = need / per, n = Math.ceil(q(x) - 1e-9);
    return num(prompt, n, { after: unit, bad: [[rd(x, 2), 'u3l12-no-round-up', 'You can only buy whole ' + unit + '. Round <b>up</b>, so there is enough.'], [rd(x, 1), 'u3l12-no-round-up', 'Round <b>up</b> to a whole number of ' + unit + '.'], [n - 1, 'u3l12-round-down', (n - 1) + ' ' + unit + ' is not quite enough. Round <b>up</b>.'], [need * per, 'u3l12-mult', 'Divide the amount needed by what one covers.']].concat(o.bad || []),
      sol: (o.pre || []).concat([t(N(rd(need, 3)) + '\\div ' + N(per) + '=' + raw(x, 2)) + ', so round <b>up</b>: ' + n + ' ' + unit]), hints: o.hints || ['Divide, then round <b>up</b> (a part of a ' + (o.one || 'can') + ' can’t be bought).'], text: o.text });
  }
  /* ---- referents (Q16) ---- */
  var REFS = [
    { what: 'the width of a classroom door', opts: [['90 cm', 'a bit less than 1 m'], ['90 mm', 'about the width of a hand'], ['9 m', 'about as wide as a classroom'], ['0.9 km', 'a long walk']] },
    { what: 'the height of a classroom door', opts: [['2 m', 'a bit taller than an adult'], ['2 cm', 'about the width of a finger'], ['20 m', 'about as tall as a 6-storey building'], ['2 km', 'a long walk']] },
    { what: 'the length of a new pencil', opts: [['19 cm', 'about the length of your hand and a bit'], ['19 mm', 'about the width of a loonie'], ['19 m', 'about as long as a classroom and a half'], ['1.9 km', 'a long walk']] },
    { what: 'the thickness of a loonie', opts: [['2 mm', 'about the thickness of 2 dimes'], ['2 cm', 'about the width of a finger: much too thick'], ['2 m', 'taller than an adult'], ['0.2 km', 'two football fields']] },
    { what: 'the length of a hockey rink', opts: [['61 m', 'about 60 big steps'], ['61 cm', 'about the length of a hockey stick blade and a bit: far too short'], ['61 mm', 'about the length of your thumb'], ['61 km', 'about the drive from Calgary to Okotoks and back']] }
  ];

  HW.defineLesson({
    id: 'u3l12', unit: 3, num: '12', title: 'Unit 3 Review', outcome: 'M4',
    blurb: 'Practice unit test: unit conversions, mixed numbers, reading a ruler, feet and inches, perimeter, area, rearranging, and surface area.',
    questions: [
      { num: '1', section: 'Part A: Written Response', stem: 'Fill in the blanks.', parts: [
        { id: '1a', level: 'BEG', outcome: 'M1', make: function (r) { var x = find(function () { return pickR(r, 1.2, 9.8, 0.1); }, function (v) { return !near(v, 3.45) && !near(v, 0.48); }); return siConv('a', x, 'm', 'cm'); } },
        { id: '1b', level: 'BEG', outcome: 'M1', make: function (r) { var x = find(function () { return r.int(15, 240); }, function (v) { return v % 10 !== 0 && v !== 65; }); return siConv('b', x, 'mm', 'cm'); } },
        { id: '1c', level: 'EMG', outcome: 'M1', make: function (r) { var x = find(function () { return r.int(24, 190) * 50; }, function (v) { return v % 1000 !== 0 && v !== 850; }); return siConv('c', x, 'm', 'km'); } },
        { id: '1d', level: 'BEG', outcome: 'M1', make: function (r) { var x = r.pick([0.25, 0.4, 0.6, 0.75, 1.5, 2.4, 0.85, 1.25]); return siConv('d', x, 'km', 'm'); } },
        { id: '1e', level: 'BEG', outcome: 'M1', make: function (r) { var x = find(function () { return pickR(r, 1.2, 9.8, 0.1); }, function (v) { return !Number.isInteger(q(v)); }); return siConv('e', x, 'cm', 'mm'); } },
        { id: '1f', level: 'EMG', outcome: 'M1', make: function (r) { var x = find(function () { return r.int(21, 96) * 50; }, function (v) { return v % 1000 !== 0; }); return siConv('f', x, 'mm', 'm'); } }] },
      { num: '2', stem: 'Fill in the blanks.', parts: [
        { id: '2a', level: 'BEG', outcome: 'M2', make: function (r) { return imConv('a', r.int(2, 12), 'ftin', true); } },
        { id: '2b', level: 'BEG', outcome: 'M2', make: function (r) { var x = find(function () { return 3 * r.int(3, 12); }, function (v) { return v !== 21; }); return imConv('b', x, 'ydft', false); } },
        { id: '2c', level: 'EMG', outcome: 'M2', make: function (r) { return imConv('c', r.pick([2, 3, 4, 5, 0.5, 1.5, 2.5, 0.25]), 'mift', true); } },
        { id: '2d', level: 'EMG', outcome: 'M2', make: function (r) { var v = find(function () { return [r.int(4, 7), r.int(1, 11)]; }, function (v) { return !(v[0] === 9 && v[1] === 5) && !(v[0] === 5 && v[1] >= 10); }); return toInPart('d', v[0], v[1]); } },
        { id: '2e', level: 'EMG', outcome: 'M2', make: function (r) { var n = find(function () { return r.int(30, 95); }, function (v) { return v % 12 !== 0 && v !== 100; }); return toFtInPart('e', n); } },
        { id: '2f', level: 'BEG', outcome: 'M2', make: function (r) { return imConv('f', r.int(2, 9), 'ydin', true); } }] },
      { num: '3', stem: 'Find each answer in simplest form.', parts: [
        { id: '3a', level: 'EMG', outcome: 'REV', make: function (r) { var v = find(function () { var a = fr(r, [2, 4, 8]), b = fr(r, [4, 8, 16]); return [[r.int(1, 5), a[0], a[1]], [r.int(1, 4), b[0], b[1]]]; }, function (v) { return v[0][2] !== v[1][2] && v[0][1] / v[0][2] + v[1][1] / v[1][2] > 1 && !(v[0][0] === 2 && v[0][1] === 3 && v[0][2] === 4 && v[1][0] === 1 && v[1][1] === 5 && v[1][2] === 8); }); return addPart('a', v[0], v[1]); } },
        { id: '3b', level: 'PRG', outcome: 'REV', make: function (r) { var v = find(function () { var a = fr(r, [2, 4, 8, 16]), b = fr(r, [4, 8, 16]); var w = r.int(4, 8); return [[w, a[0], a[1]], [r.int(1, w - 1), b[0], b[1]]]; }, function (v) { return v[0][1] / v[0][2] < v[1][1] / v[1][2] && v[0][0] - v[1][0] >= 1; }); return subPart('b', v[0], v[1]); } },
        { id: '3c', level: 'EMG', outcome: 'REV', make: function (r) { var v = find(function () { var b = fr(r, [2, 4, 8]); return [r.int(2, 5), [r.int(1, 3), b[0], b[1]]]; }, function (v) { var T = rmul([v[0], 1], mix(v[1][0], v[1][1], v[1][2])); return T[1] !== 1 && !(v[0] === 3 && v[1][0] === 2 && v[1][1] === 3 && v[1][2] === 4); }); return mulPart('c', v[0], v[1]); } }] },
      { num: '4', stem: function (sh) { return 'Read the length at each arrow. The ruler is real size.' + ruler([{ n: sh.A, lab: 'A' }, { n: sh.B, lab: 'B' }, { n: sh.C, lab: 'C' }]); },
        shared: function (r) { return rulerPos(r, [19, 74]); },
        parts: [
          { id: '4a', sub: 'A', level: 'BEG', outcome: 'M3', make: function (r, sh) { return readPart('Arrow A:', sh.A); } },
          { id: '4b', sub: 'B', level: 'EMG', outcome: 'M3', make: function (r, sh) { return readPart('Arrow B:', sh.B); } },
          { id: '4c', sub: 'C', level: 'EMG', outcome: 'M3', make: function (r, sh) { return readPart('Arrow C:', sh.C); } },
          { id: '4d', sub: 'd', level: 'PRG', outcome: 'M3', make: function (r, sh) { return distPart('(d) How far is it from B to C?', sh.B, sh.C); } }] },
      { num: '5', stem: 'Convert. Round to the nearest tenth unless told otherwise. (1 in = 2.54 cm; 1 km ≈ 0.621 mi; 1 mi ≈ 1.609 km)', parts: [
        { id: '5a', level: 'EMG', outcome: 'M2', make: function (r) { var x = r.int(12, 36); return convPart('(a) A board ' + x + ' in wide, in centimetres.', x, 2.54, true, { from: 'in', to: 'cm', dp: 1, fact: '1 in = 2.54 cm', other: [12, 30.48], text: 'in→cm' }); } },
        { id: '5b', level: 'EMG', outcome: 'M1', make: function (r) { var x = find(function () { return r.int(12, 40) * 10; }, function (v) { return !near(rd(v / 2.54, 1), v / 2.54); }); return convPart('(b) A ' + x + ' cm roll of ribbon, in inches.', x, 2.54, false, { from: 'cm', to: 'in', dp: 1, fact: '1 in = 2.54 cm', other: [12, 100], text: 'cm→in' }); } },
        { id: '5c', level: 'EMG', outcome: 'M1', make: function (r) { var x = r.pick([10, 15, 21, 25, 30, 42, 50]); return convPart('(c) A ' + x + ' km race, in miles.', x, 0.621, true, { from: 'km', to: 'mi', dp: 1, alts: [x / 1.609], fact: '1 km ≈ 0.621 mi', bad: [[x * 1.609, 'u3l12-wrong-way', 'A mile is longer than a kilometre, so there are <b>fewer</b> miles: multiply by 0.621 (or divide by 1.609).']], hints: ['Multiply by 0.621 (1 km ≈ 0.621 mi).'], text: 'km→mi' }); } },
        { id: '5d', level: 'PRG', outcome: 'M2', make: function (r) { var v = find(function () { return [r.int(4, 6), r.int(1, 11), r.pick(NAMES)]; }, function (v) { return !(v[0] === 5 && v[1] >= 10) && !(v[0] === 5 && v[1] === 9); }), inch = 12 * v[0] + v[1], cm = inch * 2.54;
          return num('(d) ' + v[2] + '’s height of ' + t(v[0] + "'\\," + v[1] + "''") + ', in centimetres (to the nearest centimetre).', cm, { dp: 0, exact: cm, after: 'cm', bad: [[(v[0] + v[1] / 10) * 30.48, 'u3l12-ftdec', t(v[0] + "'\\," + v[1] + "''") + ' is ' + v[0] + ' ft ' + v[1] + ' in, not ' + v[0] + '.' + v[1] + ' ft. Change it all to inches first: ' + t(v[0] + '\\times 12+' + v[1]) + '.'], [(v[0] + v[1] / 10) * 12 * 2.54, 'u3l12-ftdec', 'Change to inches as ' + t(v[0] + '\\times 12+' + v[1]) + ', not ' + v[0] + '.' + v[1] + ' × 12.'], [inch, 'u3l12-in-only', 'That’s the height in inches. Now multiply by 2.54.'], [v[0] * 30.48, 'u3l12-feet-only', 'Include the ' + v[1] + ' in too.'], [(10 * v[0] + v[1]) * 2.54, 'u3l12-ft10', 'A foot is 12 in: ' + t(v[0] + '\\times 12+' + v[1]) + '.'], [inch / 2.54, 'u3l12-wrong-way', 'Centimetres are smaller, so the number gets bigger: multiply by 2.54.']],
            sol: ['Inches: ' + t(v[0] + '\\times 12+' + v[1] + '=' + inch + uT('in')), t(inch + '\\times 2.54' + eqR(cm, 0) + uT('cm'))], hints: ['Change the height to inches first, then multiply by 2.54.'], text: 'height cm' }); } },
        { id: '5ei', sub: 'e i', level: 'PRG', outcome: 'M2', make: function (r) { var L = r.pick([50, 55, 60, 65, 70, 75, 80, 45]), k = L * 1.609;
          return num('(e) A highway sign in Montana says the speed limit is ' + L + ' mph. Change the limit to km/h, to the nearest tenth.', k, { dp: 1, exact: k, after: 'km/h', bad: [[L * 0.621, 'u3l12-wrong-way', 'A kilometre is shorter than a mile, so there are <b>more</b> km: multiply by 1.609.'], [L / 1.609, 'u3l12-wrong-way', 'Multiply by 1.609 (1 mi ≈ 1.609 km).'], [L * 2.54, 'u3l12-factor', '2.54 is for inches and centimetres. Use 1 mi ≈ 1.609 km.']],
            sol: [t(L + '\\times 1.609' + eqR(k, 1) + uT('km/h'))], hints: ['1 mi ≈ 1.609 km: multiply by 1.609.'], text: 'mph→km/h' }); } },
        { id: '5eii', sub: 'e ii', level: 'PRG', outcome: 'M2', make: function (r) { var L = r.pick([55, 60, 65, 70, 75, 80]), k = rd(L * 1.609, 1), c = find(function () { return r.pick([80, 90, 95, 100, 105, 110, 115, 120, 125]); }, function (c) { return Math.abs(c - k) >= 2; }), under = c < k, nm = r.pick(['Jas', 'Ravi', 'Sam', 'Lucas']);
          return P.mc(r, 'The limit is ' + L + ' mph (about ' + N(k) + ' km/h). ' + nm + ' sets his cruise control to ' + c + ' km/h. Is he under the limit?', [
            { html: under ? 'Yes: ' + c + ' km/h is less than ' + N(k) + ' km/h.' : 'No: ' + c + ' km/h is more than ' + N(k) + ' km/h.', right: true },
            { html: under ? 'No: ' + c + ' is more than ' + L + '.' : 'Yes: he is going ' + c + ' and the limit is only ' + L + ', so it must be fine.', why: 'Compare in the <b>same unit</b>: change ' + L + ' mph to km/h first.', code: 'u3l12-units' },
            { html: under ? 'No: ' + c + ' km/h is more than ' + N(k) + ' km/h.' : 'Yes: ' + c + ' km/h is less than ' + N(k) + ' km/h.', why: 'Compare the two numbers again: ' + c + (under ? ' < ' : ' > ') + N(k) + '.', code: 'u3l12-compare' },
            { html: 'You can’t compare miles and kilometres.', why: 'You can, after changing one into the other: ' + L + ' mph ≈ ' + N(k) + ' km/h.', code: 'u3l12-cant' }],
            t(L + '\\times 1.609\\approx ' + N(k)) + ' km/h. ' + c + (under ? ' < ' : ' > ') + N(k) + ', so ' + (under ? '<b>yes</b>, he is under the limit.' : '<b>no</b>, he is over the limit.'), ['Put both speeds in km/h.'], 'speed limit'); } }] },
      { num: '6', stem: function (sh) { return 'Theo has an ' + sh.L + ' ft board. He cuts off two pieces, ' + t(ftinT(sh.p1)) + ' and ' + t(ftinT(sh.p2)) + ' long. (Ignore the saw cuts.)'; },
        shared: function (r) { return find(function () { var L = r.pick([8, 10, 12]), p1 = 12 * r.int(2, 4) + r.int(4, 11), p2 = 12 * r.int(1, 3) + r.int(5, 11), left = 12 * L - p1 - p2, d = r.pick([-2, -1, 1, 2, 3]); return { L: L, p1: p1, p2: p2, left: left, third: left + d }; },
          function (s) { return (s.p1 % 12) + (s.p2 % 12) >= 13 && s.left >= 8 && s.left <= 40 && (s.left % 12) !== 0 && s.third > 0 && !(s.p1 === 45 && s.p2 === 34) && (s.third % 12) !== 0; }); },
        parts: [
          { id: '6a', level: 'EMG', outcome: 'M3', make: function (r, sh) { var a = sh.p1, b = sh.p2, tot = a + b, Fs = Math.floor(a / 12) + Math.floor(b / 12), Is = a % 12 + b % 12;
            return ftinPart('(a) What is the total length of the two pieces?', tot, { bad: [[Fs + 1, Is - 10, 'u3l12-regroup10', 'A foot is 12 in, not 10: ' + t(Is + "''=1'\\," + (Is - 12) + "''") + '.'], [Fs, Is - 12, 'u3l12-no-carry', 'You took 12 in away — add the 1 ft you made to the feet.']],
              sol: [t(ftinT(a).replace(/'\\,/, "'\\,") + '+' + ftinT(b) + '=' + Fs + "'\\," + Is + "''"), t(Is + "''=12''+" + (Is - 12) + "''") + ', so ' + t(Fs + "'\\," + Is + "''=" + ftinT(tot))], hints: ['Add the feet and the inches. Then change 12 in into 1 ft.'], text: 'add ft-in' }); } },
          { id: '6b', level: 'PRG', outcome: 'M3', make: function (r, sh) { var tot = sh.p1 + sh.p2, F = Math.floor(tot / 12), I = tot % 12;
            return ftinPart('(b) How much of the board is left?', sh.left, { bad: [[sh.L - F, I, 'u3l12-borrow-none', 'You can’t take ' + I + ' in from 0 in. Borrow 1 ft as 12 in: ' + t(sh.L + "'\\,0''=" + (sh.L - 1) + "'\\,12''") + '.'], [sh.L - 1 - F, 10 - I, 'u3l12-borrow10', 'Borrow 1 ft as <b>12</b> in, not 10.']],
              sol: [t(sh.L + "'\\,0''=" + (sh.L - 1) + "'\\,12''"), t((sh.L - 1) + "'\\,12''-" + ftinT(tot) + '=' + ftinT(sh.left))], hints: ['Write ' + sh.L + ' ft as ' + (sh.L - 1) + ' ft 12 in, then subtract.'], text: 'subtract ft-in' }); } },
          { id: '6c', level: 'PRG', outcome: 'M3', make: function (r, sh) { var fits = sh.third <= sh.left, d = Math.abs(sh.third - sh.left);
            return P.mc(r, '(c) Can he cut a third piece ' + t(ftinT(sh.third)) + ' long from what is left?', [
              { html: fits ? 'Yes. ' + ftin(sh.left) + ' is left, which is ' + d + ' in more than he needs.' : 'No. Only ' + ftin(sh.left) + ' is left, which is ' + d + ' in too short.', right: true },
              { html: fits ? 'No. Only ' + ftin(sh.left) + ' is left, which is too short.' : 'Yes. ' + ftin(sh.left) + ' is left, which is enough.', why: 'Compare ' + ftin(sh.left) + ' with ' + ftin(sh.third) + ' carefully (change both to inches: ' + sh.left + ' in and ' + sh.third + ' in).', code: 'u3l12-compare' },
              { html: 'Yes. The board was ' + sh.L + ' ft, which is longer than all three pieces.', why: 'The first two pieces are already cut off. Compare the third piece with what is <b>left</b>.', code: 'u3l12-whole-board' },
              { html: 'You can’t tell, because the lengths are in feet and inches.', why: 'Change both lengths to inches (' + sh.left + ' in and ' + sh.third + ' in) and compare.', code: 'u3l12-cant' }],
              'Left: ' + ftin(sh.left) + ' = ' + sh.left + ' in. Third piece: ' + ftin(sh.third) + ' = ' + sh.third + ' in.<br>' + (fits ? '<b>Yes</b>, there is ' + d + ' in to spare.' : '<b>No</b>, it is ' + d + ' in too short.'), ['Compare the third piece with the length left from (b).'], 'third piece'); } }] },
      { num: '7', stem: function (sh) { return 'The diagram shows a back yard. All the corners are square.' + lShape(sh.W, sh.H, sh.T, sh.R, { W: sh.W + ' m', H: sh.H + ' m', T: sh.T + ' m', R: sh.R + ' m', a: 'a', b: 'b' }); },
        shared: function (r) { return find(function () { var W0 = r.int(16, 26), H0 = r.int(12, 18); return { W: W0, H: H0, T: r.int(8, W0 - 5), R: r.int(5, H0 - 4), price: r.pick([16.5, 18.75, 21.25, 24.99, 19.5]), gap: r.pick([3, 4, 5]) }; }, function (s) { return !(s.W === 18 && s.H === 15) && s.W - s.T !== s.H - s.R; }); },
        parts: [
          { id: '7a', level: 'BEG', outcome: 'M3', make: function (r, sh) { var a = sh.W - sh.T, b = sh.H - sh.R;
            return fields('(a) Find the missing lengths ' + t('a') + ' and ' + t('b') + '.', [{ label: t('a') + ' =', name: 'a', ans: a, after: 'm', bad: [[sh.W + sh.T, 'u3l12-added', 'The top edge and ' + t('a') + ' together make the bottom edge: ' + t('a=' + sh.W + '-' + sh.T) + '.']] }, { label: t('b') + ' =', name: 'b', ans: b, after: 'm', bad: [[sh.H + sh.R, 'u3l12-added', 'The right edge and ' + t('b') + ' together make the left edge: ' + t('b=' + sh.H + '-' + sh.R) + '.']] }],
              [t('a=' + sh.W + '-' + sh.T + '=' + a) + ' m', t('b=' + sh.H + '-' + sh.R + '=' + b) + ' m'], ['The two top edges together are as long as the bottom edge.'], 'missing sides'); } },
          { id: '7b', level: 'EMG', outcome: 'M3', make: function (r, sh) { var a = sh.W - sh.T, b = sh.H - sh.R, Pm = 2 * (sh.W + sh.H);
            return num('(b) Find the perimeter of the yard.', Pm, { after: 'm', bad: [[sh.W + sh.H + sh.T + sh.R, 'u3l12-four-sides', 'Add <b>all six</b> sides, including ' + t('a') + ' and ' + t('b') + '.'], [sh.W * sh.H - a * b, 'u3l12-area', 'That’s the area. Perimeter is the distance around: add the six sides.'], [Pm - a, 'u3l12-four-sides', 'Add all six sides.'], [Pm - b, 'u3l12-four-sides', 'Add all six sides.']],
              sol: [t(sh.W + '+' + sh.R + '+' + a + '+' + b + '+' + sh.T + '+' + sh.H + '=' + Pm) + ' m'], hints: ['Go all the way around and add the six sides.'], text: 'L perimeter' }); } },
          { id: '7c', level: 'PRG', outcome: 'M3', make: function (r, sh) { var Pm = 2 * (sh.W + sh.H), L = Pm - sh.gap, c = L * sh.price;
            return num('(c) Fencing costs ' + Mp(sh.price) + ' per metre. Find the cost to fence the yard, leaving a ' + sh.gap + ' m gap for the driveway.', rd(c, 2), { money: true, exact: c, bad: [[Pm * sh.price, 'u3l12-no-gap', 'Take the ' + sh.gap + ' m driveway gap off the perimeter first.'], [(Pm + sh.gap) * sh.price, 'u3l12-gap-added', 'The gap has <b>no</b> fence: subtract it.'], [(sh.W + sh.H + sh.T + sh.R - sh.gap) * sh.price, 'u3l12-four-sides', 'Use the whole perimeter from (b).']],
              sol: [t(Pm + '-' + sh.gap + '=' + L) + ' m of fence', t(L + '\\times ' + M(sh.price) + '=' + M(c))], hints: ['Fence length = perimeter − gap. Then × price per metre.'], text: 'fence cost' }); } }] },
      { num: '8', stem: function (sh) { return 'A round above-ground pool is ' + N(sh.d) + ' m across.'; },
        shared: function (r) { return { d: r.pick([4.5, 5, 5.5, 6, 6.5, 7, 4.8, 5.2, 3.6, 4.2, 7.5, 8]) }; },
        parts: [
          { id: '8a', level: 'EMG', outcome: 'M3', make: function (r, sh) { var C = PI * sh.d; return num('(a) Find the circumference of the pool, to the nearest tenth of a metre.', C, { dp: 1, exact: C, after: 'm', bad: [[PI * sh.d / 2, 'u3l12-radius-c', 'Use the whole diameter: ' + t('C=\\pi d') + ' (or ' + t('2\\pi r') + ').'], [PI * sh.d * sh.d / 4, 'u3l12-circ', 'That’s the area. Circumference = ' + t('\\pi d') + '.'], [2 * PI * sh.d, 'u3l12-radius-c', 'Use ' + t('\\pi d') + ' or ' + t('2\\pi r') + ', not ' + t('2\\pi d') + '.']], sol: [t('C=\\pi d=\\pi\\times ' + N(sh.d) + eqR(C, 1) + uT('m'))], hints: [t('C=\\pi d') + '.'], text: 'pool C' }); } },
          { id: '8b', level: 'EMG', outcome: 'M4', make: function (r, sh) { var rr = sh.d / 2, A = PI * rr * rr; return num('(b) A solar cover lies flat on the water. Find its area, to the nearest tenth.', A, { dp: 1, exact: A, after: 'm²', area: true, bad: [[PI * sh.d * sh.d, 'u3l12-diam-area', 'Use the radius: ' + t('r=' + N(sh.d) + '\\div 2=' + N(rr)) + '.'], [PI * sh.d, 'u3l12-circ', 'That’s the circumference. Area = ' + t('\\pi r^2') + '.'], [2 * PI * rr, 'u3l12-circ', 'Area = ' + t('\\pi r^2') + '.'], [PI * rr * 2, 'u3sa-r-times-2', t('r^2=r\\times r') + '.']], sol: [t('r=' + N(sh.d) + '\\div 2=' + N(rr)) + ' m', t('A=\\pi\\times ' + N(rr) + '^2' + eqR(A, 1) + uT('m²'))], hints: ['Halve the diameter, then ' + t('A=\\pi r^2') + '.'], text: 'pool A' }); } },
          { id: '8c', level: 'BEG', outcome: 'M4', make: function (r) { return P.mc(r, '(c) Which answer is in square units? Why?', [
            { html: 'The area in (b): it measures the surface the cover spreads over.', right: true },
            { html: 'The circumference in (a): it uses ' + t('\\pi') + '.', why: 'Both use ' + t('\\pi') + '. The circumference is a length (the distance around), so it is in m.', code: 'u3l12-sq-pi' },
            { html: 'The area in (b): its number is bigger.', why: 'The size of the number doesn’t decide the unit. Area measures a surface, so it is in square units.', code: 'u3l12-sq-big' },
            { html: 'Both: they are both about a circle.', why: 'The circumference is a length (distance around), in m. Only the area is in m².', code: 'u3l12-sq-both' }],
            'The <b>area</b> in (b) is in m²: it measures the surface the cover spreads over. The circumference in (a) is a length (the distance around), in m.', ['Which one measures a surface, and which one a distance?'], 'square units'); } }] },
      { num: '9', stem: 'Rearrange the formula to find the missing value. Check each answer.', parts: [
        { id: '9a', level: 'PRG', outcome: 'A1', make: function (r) { var v = find(function () { var w = pickR(r, 6.5, 12.5, 0.5), l = pickR(r, 13, 24, 0.5); return [2 * (l + w), w, l]; }, function (v) { return v[2] > v[1] + 2 && !(v[0] === 36 && v[2] === 11) && !(v[0] === 32); }), Pm = v[0], w = v[1], l = v[2];
          return num('(a) A rectangle has a perimeter of ' + N(Pm) + ' ft and a width of ' + N(w) + ' ft. Find its length. ' + t('(P=2l+2w)'), l, { after: 'ft', bad: [[(Pm - w) / 2, 'u3l12-rearr', 'Take away <b>both</b> widths first: ' + t('l=(P-2w)\\div 2') + '.'], [Pm - 2 * w, 'u3l12-no-half', 'That’s both lengths together. Divide by 2.'], [Pm / 2 - 2 * w, 'u3l12-rearr', t('l=(P-2w)\\div 2') + '.'], [(Pm + 2 * w) / 2, 'u3l12-rearr', 'Undo the ' + t('+2w') + ' by <b>subtracting</b>.']],
            sol: [t('l=(P-2w)\\div 2=(' + N(Pm) + '-' + N(2 * w) + ')\\div 2=' + N(Pm - 2 * w) + '\\div 2=' + N(l)) + ' ft', 'Check: ' + t('2(' + N(l) + ')+2(' + N(w) + ')=' + N(2 * l) + '+' + N(2 * w) + '=' + N(Pm)) + ' ✓'], hints: ['Subtract the two widths from the perimeter, then divide by 2.'], text: 'find length' }); } },
        { id: '9b', level: 'PRG', outcome: 'A1', make: function (r) { var C = r.pick([8.5, 10.4, 12.5, 15.2, 18.8, 9.6, 11.3]), d = C / PI;
          return num('(b) A round flower bed has a circumference of ' + N(C) + ' m. Find its diameter, to the nearest hundredth. ' + t('(C=\\pi d)'), d, { dp: 2, exact: d, after: 'm', bad: [[C * PI, 'u3l12-times-pi', 'Undo ' + t('\\times\\pi') + ' by <b>dividing</b> by ' + t('\\pi') + ': ' + t('d=C\\div\\pi') + '.'], [C / (2 * PI), 'u3l12-radius', 'That’s the radius. The diameter is ' + t('C\\div\\pi') + '.'], [C / 3.14, 'u3sa-pi314', 'Use the ' + t('\\pi') + ' key: 3.14 changes the answer to the hundredth.', 'form']],
            sol: [t('d=C\\div\\pi=' + N(C) + '\\div\\pi' + eqR(d, 2)) + ' m', 'Check: ' + t('\\pi\\times ' + nS(rd(d, 2), 2) + '\\approx ' + N(rd(PI * rd(d, 2), 2))) + ' ✓'], hints: [t('d=C\\div\\pi') + '.'], text: 'find diameter' }); } },
        { id: '9c', level: 'EMG', outcome: 'A1', make: function (r) { var v = find(function () { return [r.pick([2.4, 2.5, 3.2, 4, 3.6, 4.5]), r.pick([1.5, 2, 2.5, 3])]; }, function (v) { return !(v[0] * v[1] === 22.5) && v[0] > v[1]; }), l = v[0], w = v[1], A = q(l * w);
          return num('(c) A rug has an area of ' + N(A) + ' m² and a length of ' + N(l) + ' m. Find its width. ' + t('(A=lw)'), w, { after: 'm', bad: [[A * l, 'u3l12-times-pi', 'Undo ' + t('\\times l') + ' by <b>dividing</b>: ' + t('w=A\\div l') + '.'], [A - l, 'u3l12-rearr', 'Divide: ' + t('w=A\\div l') + '.'], [l / A, 'u3l12-wrong-way', 'Divide the <b>area</b> by the length.']],
            sol: [t('w=A\\div l=' + N(A) + '\\div ' + N(l) + '=' + N(w)) + ' m', 'Check: ' + t(N(l) + '\\times ' + N(w) + '=' + N(A)) + ' ✓'], hints: [t('w=A\\div l') + '.'], text: 'find width' }); } }] },
      { num: '10', stem: function (sh) { return 'A school stage is a rectangle ' + sh.W + ' m wide and ' + sh.D + ' m deep, with a half circle on the front. The half circle is ' + sh.W + ' m across.' + stage(sh.W, sh.D); },
        shared: function (r) { return { W: r.pick([6, 7, 8, 9, 10, 12]), D: r.pick([4, 5, 6]), can: r.pick([12, 15, 20]) }; },
        parts: [
          { id: '10a', level: 'PRG', outcome: 'M4', make: function (r, sh) { var rr = sh.W / 2, rect = sh.W * sh.D, half = PI * rr * rr / 2, A = rect + half;
            return num('(a) Find the area of the stage, to the nearest hundredth.', A, { dp: 2, exact: A, after: 'm²', area: true, bad: [[rect + 2 * half, 'u3l12-full-circle', 'It is a <b>half</b> circle: divide the circle’s area by 2.'], [rect + PI * sh.W * sh.W / 2, 'u3l12-half-r', 'The radius is half of ' + sh.W + ' m: ' + t('r=' + N(rr)) + '.'], [rect, 'u3l12-no-semi', 'Add the half circle too.'], [rect + PI * sh.W / 2, 'u3l12-circ', 'For the half circle use its <b>area</b>, ' + t('\\tfrac{1}{2}\\pi r^2') + ', not its edge.']],
              sol: ['Rectangle: ' + t(sh.W + '\\times ' + sh.D + '=' + rect + uT('m²')), 'Half circle (' + t('r=' + N(rr)) + '): ' + t('\\tfrac{1}{2}\\times\\pi\\times ' + N(rr) + '^2=' + rw(half)), 'Total: ' + t(rect + '+' + rw(half) + eqR(A, 2) + uT('m²'))], hints: ['Rectangle + half of a circle. The circle’s radius is half of ' + sh.W + ' m.'], text: 'stage area' }); } },
          { id: '10b', level: 'PRG', outcome: 'M4', make: function (r, sh) { var A = sh.W * sh.D + PI * sh.W * sh.W / 8; return ceilPart('(b) One can of floor paint covers ' + sh.can + ' m². How many cans are needed for one coat?', A, sh.can, 'cans', { text: 'paint cans' }); } }] },
      { num: '11', stem: function (sh) { return 'Maya’s bedroom floor is a rectangle ' + t(sh.a + "'\\," + sh.i + "''") + ' by ' + t(sh.b + "'\\,0''") + '.'; },
        shared: function (r) { return find(function () { return { a: r.int(11, 15), i: r.pick([6, 6, 3, 9]), b: r.int(9, 12), price: r.pick([32.5, 34.8, 36.8, 39.95, 42]) }; }, function (s) { var A = (s.a + s.i / 12) * s.b; return decs(A / 9) <= 2 && !(s.a === 13 && s.b === 11); }); },
        parts: [
          { id: '11a', level: 'PRG', outcome: 'M4', make: function (r, sh) { var L = sh.a + sh.i / 12, A = L * sh.b;
            return num('(a) Find the area of the floor in square feet.', A, { after: 'ft²', area: true, bad: [[(sh.a + sh.i / 10) * sh.b, 'u3l12-ftdec', t(sh.a + "'\\," + sh.i + "''") + ' is not ' + sh.a + '.' + sh.i + ' ft: ' + sh.i + ' in = ' + t('\\frac{' + sh.i + '}{12}') + ' ft = ' + N(sh.i / 12) + ' ft.'], [2 * (L + sh.b), 'u3l12-area', 'That’s the perimeter. Area = length × width.'], [sh.a * sh.b, 'u3l12-no-in', 'Include the ' + sh.i + ' in: ' + t(sh.a + "'\\," + sh.i + "''=" + N(L)) + ' ft.']],
              sol: [t(sh.a + "'\\," + sh.i + "''=" + N(L)) + ' ft (' + t(sh.i + '\\div 12=' + N(sh.i / 12)) + ')', t(N(L) + '\\times ' + sh.b + '=' + N(A) + uT('ft²'))], hints: ['Change the inches to a part of a foot: ' + sh.i + ' in = ' + t(sh.i + '\\div 12') + ' ft.'], text: 'room ft2' }); } },
          { id: '11b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var A = (sh.a + sh.i / 12) * sh.b, y = A / 9;
            return num('(b) Change the area to square yards. ' + t('(1\\text{ yd}^2=9\\text{ ft}^2)'), y, { after: 'yd²', area: true, bad: [[A / 3, 'u3l12-yd3', '1 yd = 3 ft, but 1 yd² = 3 × 3 = <b>9</b> ft². Divide by 9.'], [A * 9, 'u3l12-yd-way', 'Square yards are bigger, so the number gets smaller: divide by 9.']], sol: [t(N(A) + '\\div 9=' + N(y) + uT('yd²'))], hints: ['Divide by 9.'], text: 'yd2' }); } },
          { id: '11c', level: 'EMG', outcome: 'M4', make: function (r, sh) { var y = (sh.a + sh.i / 12) * sh.b / 9, c = y * sh.price;
            return num('(c) Carpet costs ' + Mp(sh.price) + ' per square yard. What does carpet for the room cost before tax?', rd(c, 2), { money: true, exact: c, bad: [[y * 9 * sh.price, 'u3l12-yd-way', 'The price is per square <b>yard</b>: use the area in yd² from (b).'], [y * 3 * sh.price, 'u3l12-yd3', 'Use the area in yd² from (b).']], sol: [t(N(q(y)) + '\\times ' + M(sh.price) + '=' + M(c))], hints: ['Area in yd² × price per yd².'], text: 'carpet' }); } }] },
      { num: '12', stem: function (sh) { return 'A wooden toy bin is a rectangular prism ' + N(sh.l) + ' m long, ' + N(sh.w) + ' m wide and ' + N(sh.h) + ' m tall. It has <b>no top</b>.'; },
        shared: function (r) { return find(function () { return { l: r.pick([1, 1.2, 1.4, 1.5, 1.6]), w: r.pick([0.4, 0.5, 0.6]), h: r.pick([0.3, 0.4, 0.5]), price: r.pick([6.5, 7.75, 8.5, 9.25]) }; }, function (s) { return s.w !== s.h && !(s.l === 1.2 && s.w === 0.5 && s.h === 0.4); }); },
        parts: [
          { id: '12a', level: 'PRG', outcome: 'M4', make: function (r, sh) {
            var PK = HW.pctKit, b = q(sh.l * sh.w), fb = q(2 * sh.l * sh.h), en = q(2 * sh.w * sh.h), SA = q(b + fb + en);
            var blanks = [
              { where: 'cell', i: 0, j: 1, name: 'Bottom', chk: S.chk(b, { bad: [[sh.l + sh.w, 'u3l12-added', 'Area = length × width.']] }) },
              { where: 'cell', i: 1, j: 1, name: 'Front and back', chk: S.chk(fb, { bad: [[sh.l * sh.h, 'u3l12-one-face', 'There are <b>two</b> faces (front and back): ' + t('2\\times ' + N(sh.l) + '\\times ' + N(sh.h)) + '.']] }) },
              { where: 'cell', i: 2, j: 1, name: '2 ends', chk: S.chk(en, { bad: [[sh.w * sh.h, 'u3l12-one-face', 'There are <b>two</b> ends: ' + t('2\\times ' + N(sh.w) + '\\times ' + N(sh.h)) + '.']] }) },
              { where: 'cell', i: 3, j: 1, name: 'Surface area', chk: S.chk(SA, { bad: [[SA + b, 'u3l12-with-top', 'The bin has <b>no top</b>: only 5 faces.'], [q(sh.l * sh.w + sh.l * sh.h + sh.w * sh.h), 'u3l12-one-face', 'Use the areas of the pairs (front and back, 2 ends).']] }) }];
            var key = { rows: ['\\text{bottom}', '\\text{front and back}', '\\text{2 ends}', '\\textbf{Surface area}'], cols: ['\\text{Size}', '\\text{Area (m}^2)'], cells: [[N(sh.l) + '\\text{ m by }' + N(sh.w) + '\\text{ m}', nS(b)], [N(sh.l) + '\\text{ m by }' + N(sh.h) + '\\text{ m}', nS(fb)], [N(sh.w) + '\\text{ m by }' + N(sh.h) + '\\text{ m}', nS(en)], ['', nS(SA)]] };
            var cells = key.cells.map(function (row) { return [row[0], null]; });
            return PK.tablePart('(a) Complete the face table and find the outside surface area (in m²).', { rows: key.rows, cols: key.cols, cells: cells, corner: '\\text{Faces}', keys: 'pctkit-money', help: 'Tap a box, then type the area in m².' }, PK.tableChk(blanks), key,
              br(['Bottom: ' + t(N(sh.l) + '\\times ' + N(sh.w) + '=' + nS(b)), 'Front and back: ' + t('2\\times ' + N(sh.l) + '\\times ' + N(sh.h) + '=' + nS(fb)), '2 ends: ' + t('2\\times ' + N(sh.w) + '\\times ' + N(sh.h) + '=' + nS(en)), 'No top, so only 5 faces: ' + t(nS(b) + '+' + nS(fb) + '+' + nS(en) + '=' + nS(SA) + uT('m²'))]), ['Area of each face = length × width. The front and back are a pair, and so are the ends.'], 'bin table'); } },
          { id: '12b', level: 'EMG', outcome: 'M4', make: function (r, sh) { var SA = q(sh.l * sh.w + 2 * sh.l * sh.h + 2 * sh.w * sh.h), c = SA * sh.price;
            return num('(b) A waterproof stain costs ' + Mp(sh.price) + ' for each square metre covered. Find the cost to stain the outside.', rd(c, 2), { money: true, exact: c, bad: [[(SA + sh.l * sh.w) * sh.price, 'u3l12-with-top', 'The bin has no top: use the surface area from (a).']], sol: [t(nS(SA) + '\\times ' + M(sh.price) + '=' + M(c))], hints: ['Surface area × price per m².'], text: 'stain' }); } }] },
      { num: '13', stem: function (sh) { return 'A gift box is a triangular prism. Each triangle end has sides of ' + sh.s + ' cm, ' + sh.s + ' cm and ' + sh.b + ' cm and a height of ' + sh.h + ' cm. The box is ' + sh.L + ' cm long.' + S.solid('triprism', { b: sh.b + ' cm', ht: sh.h + ' cm', l: sh.L + ' cm', slant: sh.s + ' cm', width: 220 }); },
        shared: function (r) { var tr = r.pick([[6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15], [12, 5, 13]]); return find(function () { return { b: 2 * tr[0], h: tr[1], s: tr[2], L: r.pick([20, 24, 25, 30, 35, 40]) }; }, function (s) { return !(s.b === 8 && s.s === 5 && s.L === 25); }); },
        parts: [
          { id: '13a', level: 'EMG', outcome: 'M4', make: function (r, sh) { var lab = function (w) { return w + ' cm by ' + sh.L + ' cm'; }, Lb = sh.L + ' cm long';
            return P.mc(r, '(a) Which is a net of the box?', [
              { html: prismNet([sh.s, sh.b, sh.s], [lab(sh.s), lab(sh.b), lab(sh.s)], 1, 2, Lb, sh.h), right: true },
              { html: prismNet([sh.s, sh.b, sh.s], [lab(sh.s), lab(sh.b), lab(sh.s)], 1, 1, Lb, sh.h), why: 'The box has <b>two</b> triangle ends, so the net needs two triangles.', code: 'u3l12-net-one' },
              { html: prismNet([sh.b, sh.b, sh.b], [lab(sh.b), lab(sh.b), lab(sh.b)], 1, 2, Lb, sh.h), why: 'Two of the rectangles are as wide as the slanted sides (' + sh.s + ' cm), not the base.', code: 'u3l12-net-same' },
              { html: prismNet([sh.s, sh.b, sh.s, sh.b], [lab(sh.s), lab(sh.b), lab(sh.s), lab(sh.b)], 1, 2, Lb, sh.h), why: 'A triangular prism has only <b>3</b> rectangles (one for each side of the triangle).', code: 'u3l12-net-four' }],
              'Three rectangles in a row (' + lab(sh.s) + ', ' + lab(sh.b) + ', ' + lab(sh.s) + '), with a triangle (base ' + sh.b + ' cm, height ' + sh.h + ' cm) on each end of the ' + sh.b + ' cm rectangle.', ['A triangular prism has 2 triangles and 3 rectangles, one rectangle for each side of the triangle.'], 'prism net'); } },
          { id: '13b', level: 'PRG', outcome: 'M4', make: function (r, sh) { var tri = sh.b * sh.h, rect = sh.L * (sh.b + 2 * sh.s), SA = tri + rect;
            return num('(b) Find the surface area of the box.', SA, { after: 'cm²', area: true, bad: [[2 * sh.b * sh.h + rect, 'u3l12-sa-tri', 'Each triangle is ' + t('\\tfrac{1}{2}\\times b\\times h') + '.'], [tri / 2 + rect, 'u3l12-sa-tri', 'There are <b>two</b> triangles.'], [rect, 'u3l12-sa-tri', 'Add the two triangle ends.'], [tri + sh.L * (sh.b + sh.s), 'u3l12-one-rect', 'There are three rectangles: two ' + sh.s + ' cm wide and one ' + sh.b + ' cm wide.'], [tri + 3 * sh.b * sh.L, 'u3l12-net-same', 'Two of the rectangles are ' + sh.s + ' cm wide.'], [sh.b * sh.h / 2 * sh.L, 'u3sa-volume', 'That’s the volume. Surface area adds the faces.']],
              sol: ['2 triangles: ' + t('2\\times\\tfrac{1}{2}\\times ' + sh.b + '\\times ' + sh.h + '=' + tri + uT('cm²')), 'Rectangles: ' + t(sh.b + '\\times ' + sh.L + '+2\\times ' + sh.s + '\\times ' + sh.L + '=' + sh.b * sh.L + '+' + 2 * sh.s * sh.L + '=' + rect + uT('cm²')), t('\\text{SA}=' + tri + '+' + rect + '=' + SA + uT('cm²'))], hints: ['2 triangles + 3 rectangles.'], text: 'prism SA' }); } }] },
      { num: '14', stem: function (sh) { return 'A farm water tank is a cylinder ' + N(sh.d) + ' m across and ' + N(sh.h) + ' m tall. The side and the top will be painted (not the bottom).'; },
        shared: function (r) { return find(function () { return { d: r.pick([2, 2.4, 2.8, 3.2, 3.6]), h: r.pick([2.5, 3, 3.5, 4]), can: r.pick([8, 10, 12]) }; }, function (s) { var A = PI * s.d * s.d / 4 + PI * s.d * s.h; return A / s.can % 1 > 0.05 && A / s.can % 1 < 0.95; }); },
        parts: [
          { id: '14a', level: 'PRG', outcome: 'M4', make: function (r, sh) { var res = S.cyl(sh.d / 2, sh.h, 1, { d: true, dp: 2, u: 'm', endWord: 'the top' }); res.bad.push([res.ans + PI * sh.d * sh.d / 4, 'u3l12-bottom', 'The bottom is not painted: use the top and the side only.']);
            return S.saPart('(a) Find the area to be painted, to the nearest hundredth.', res, { dp: 2, u: 'm', hints: ['Top: ' + t('\\pi r^2') + '; side: ' + t('2\\pi rh') + '. Halve the diameter first.'], text: 'tank paint' }); } },
          { id: '14b', level: 'PRG', outcome: 'M4', make: function (r, sh) { var A = PI * sh.d * sh.d / 4 + PI * sh.d * sh.h; return ceilPart('(b) One can of paint covers ' + sh.can + ' m². How many cans are needed for one coat?', A, sh.can, 'cans', { text: 'tank cans' }); } }] },
      { num: '15', stem: function (sh) { return '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">' + HW.solid('sqpyramid', { s: N(sh.b) + ' m', sl: N(sh.s) + ' m', width: 170 }) + HW.solid('cone', { r: sh.r + ' cm', s: sh.cs + ' cm', width: 150 }) + '</div>'; },
        shared: function (r) { return find(function () { return { b: r.pick([3, 3.2, 3.6, 4, 4.4]), s: r.pick([2.2, 2.5, 2.8, 3]), cover: r.pick([2.9, 3.1, 3.3]), r: r.pick([3, 3.5, 4, 4.5]), cs: r.pick([8, 9, 10, 11]) }; }, function (s) { var x = 2 * s.b * s.s / s.cover; return x % 1 > 0.05 && x % 1 < 0.95 && s.s > s.b / 2 && !(s.b === 2.2 && s.s === 1.8); }); },
        parts: [
          { id: '15a', level: 'EMG', outcome: 'M4', make: function (r, sh) { return S.saPart('(a) The roof of a bell tower is a square pyramid with a base ' + N(sh.b) + ' m on each side. Each triangle has a slant height of ' + N(sh.s) + ' m. Only the 4 triangles get shingles. Find the area to shingle.', S.pyr(sh.b, sh.s, false, { u: 'm' }), { u: 'm', hints: ['4 triangles, each ' + t('\\tfrac{1}{2}bs') + '.'], text: 'bell roof' }); } },
          { id: '15b', level: 'PRG', outcome: 'M4', make: function (r, sh) { return ceilPart('(b) One bundle of shingles covers ' + N(sh.cover) + ' m². How many bundles are needed?', 2 * sh.b * sh.s, sh.cover, 'bundles', { one: 'bundle', text: 'bell bundles' }); } },
          { id: '15c', level: 'PRG', outcome: 'M4', make: function (r, sh) { return S.saPart('(c) A paper water cup is a cone with a radius of ' + N(sh.r) + ' cm and a slant height of ' + sh.cs + ' cm. It has no lid. How much paper is in the cup, to the nearest square centimetre?', S.cone(sh.r, sh.cs, false, { dp: 0 }), { dp: 0, u: 'cm', hints: ['No lid: curved side only, ' + t('\\pi rs') + '.'], text: 'paper cup' }); } }] },
      /* ---------- Part B: multiple choice ---------- */
      { num: '16', section: 'Part B: Multiple Choice', parts: [
        { id: '16', level: 'BEG', outcome: 'M1', make: function (r) { var it = r.pick(REFS);
          return P.mc(r, 'Which is the most reasonable measurement for ' + it.what + '?', it.opts.map(function (o, i) { return i === 0 ? { html: o[0], right: true } : { html: o[0], why: o[0] + ' is ' + o[1] + '. Picture ' + it.what + '.', code: 'u3l12-referent' }; }),
            '<b>' + it.opts[0][0] + '</b> is ' + it.opts[0][1] + '.', ['Use a referent: 1 mm is the thickness of a dime, 1 cm the width of a finger, 1 m a big step, 1 km about 10 minutes of walking.'], 'referent'); } }] },
      { num: '17', parts: [
        { id: '17', level: 'EMG', outcome: 'M3', make: function (r) { var v = find(function () { return [r.int(2, 5), r.int(5, 11), r.int(1, 4), r.int(4, 11)]; }, function (v) { return v[1] + v[3] >= 13 && v[1] + v[3] - 12 !== v[1] + v[3] - 10 && !(v[0] === 5 && v[1] === 9 && v[2] === 2 && v[3] === 8) && v[1] + v[3] - 10 < 12; }), F = v[0] + v[2], I = v[1] + v[3];
          var fi = function (f, i) { return t(f + "'\\," + i + "''"); };
          return P.mc(r, fi(v[0], v[1]) + ' + ' + fi(v[2], v[3]) + ' is equal to', [
            { html: fi(F + 1, I - 12), right: true }, { html: fi(F + 1, I - 10), why: 'A foot is 12 in, not 10.', code: 'u3l12-regroup10' }, { html: fi(F, I - 12), why: 'When you change 12 in into 1 ft, add that foot to the feet.', code: 'u3l12-no-carry' }, { html: fi(F + 1, I), why: 'You added a foot but kept all ' + I + ' inches. Take 12 in away.', code: 'u3l12-keep' }],
            t(fi(v[0], v[1]).slice(2, -2) + '+' + fi(v[2], v[3]).slice(2, -2) + '=' + F + "'\\," + I + "''") + ', and ' + I + ' in = 1 ft ' + (I - 12) + ' in, so ' + fi(F + 1, I - 12) + '.', ['Add, then change 12 in into 1 ft.'], 'MC ft-in'); } }] },
      { num: '18', parts: [
        { id: '18', level: 'EMG', outcome: 'M2', make: function (r) { var n = r.pick([3, 4, 5, 7, 8, 12, 15]);
          return P.mc(r, 'A rug covers ' + n + ' yd². How many square feet is that?', [{ html: 9 * n + ' ft²', right: true }, { html: 3 * n + ' ft²', why: '3 is for length (1 yd = 3 ft). 1 yd² = 3 × 3 = 9 ft².', code: 'u3l12-yd3' }, { html: 12 * n + ' ft²', why: '12 is inches in a foot. 1 yd² = 9 ft².', code: 'u3l12-factor' }, { html: N(q(n / 3)) + ' ft²', why: 'Square feet are smaller, so the number gets bigger: multiply by 9.', code: 'u3l12-wrong-way' }],
            t('1\\text{ yd}^2=9\\text{ ft}^2') + ', so ' + t(n + '\\times 9=' + 9 * n) + ' ft².', ['1 yd² = 3 ft × 3 ft.'], 'MC yd2'); } }] },
      { num: '19', parts: [
        { id: '19', level: 'EMG', outcome: 'M4', make: function (r) { var d = r.pick([6, 8, 10, 12, 14, 16, 18, 20, 7, 9]), rr = d / 2, f = function (x) { return N(rd(x, 1), 1) + ' m²'; };
          return P.mc(r, 'A round patio is ' + d + ' m across. Its area is about', [{ html: f(PI * rr * rr), right: true }, { html: f(PI * d), why: 'That’s the circumference. Area = ' + t('\\pi r^2') + '.', code: 'u3l12-circ' }, { html: f(PI * d * d), why: 'Use the radius (' + rr + ' m), not the diameter.', code: 'u3l12-diam-area' }, { html: f(PI * rr), why: 'Square the radius: ' + t('\\pi r^2') + '.', code: 'u3l12-no-sq' }],
            t('r=' + rr) + ': ' + t('\\pi\\times ' + rr + '^2\\approx ' + N(rd(PI * rr * rr, 1), 1)) + ' m².', ['Halve the diameter, then ' + t('\\pi r^2') + '.'], 'MC circle'); } }] },
      { num: '20', parts: [
        { id: '20', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { return [r.int(3, 9), r.int(8, 15), r.int(3, 8)]; }, function (v) { var o = [(v[0] + v[1]) * v[2] / 2, (v[0] + v[1]) * v[2], v[0] * v[1] * v[2], v[1] * v[2]]; return v[1] > v[0] + 1 && o.every(function (x, i) { return o.indexOf(x) === i; }) && Number.isInteger(o[0]); }), a = v[0], b = v[1], h = v[2];
          return P.mc(r, 'A trapezoid has parallel sides of ' + a + ' cm and ' + b + ' cm and a height of ' + h + ' cm. Its area is', [{ html: (a + b) * h / 2 + ' cm²', right: true }, { html: (a + b) * h + ' cm²', why: 'Don’t forget the ' + t('\\tfrac{1}{2}') + ': ' + t('A=\\tfrac{1}{2}(a+b)h') + '.', code: 'u3l12-no-half' }, { html: a * b * h + ' cm²', why: 'Add the parallel sides, then multiply by the height and by ' + t('\\tfrac{1}{2}') + '.', code: 'u3l12-mult' }, { html: b * h + ' cm²', why: 'Use both parallel sides: ' + t('\\tfrac{1}{2}(a+b)h') + '.', code: 'u3l12-one-side' }],
            t('\\tfrac{1}{2}\\times(' + a + '+' + b + ')\\times ' + h + '=' + (a + b) * h / 2) + ' cm²', [t('A=\\tfrac{1}{2}(a+b)h') + '.'], 'MC trapezoid'); } }] },
      { num: '21', parts: [
        { id: '21', level: 'BEG', outcome: 'M4', make: function (r) { var v = find(function () { return [r.int(10, 24), r.int(6, 22) * 2 / 2]; }, function (v) { return v[1] % 2 === 0 && v[0] !== v[1] && v[1] * 2 !== v[0] && !(v[0] === 12 && v[1] === 20) && v[0] % 2 === 0; }), F = v[0], Pp = v[1];
          return P.mc(r, 'A spill on a grid covers ' + F + ' full squares and ' + Pp + ' part squares. Each square is 1 m². The best estimate of its area is', [{ html: F + Pp / 2 + ' m²', right: true }, { html: F + Pp + ' m²', why: 'Part squares are about half full: count each as ' + t('\\tfrac{1}{2}') + '.', code: 'u3l12-full-sq' }, { html: F + ' m²', why: 'Don’t leave out the part squares: count each as half.', code: 'u3l12-no-part' }, { html: F / 2 + Pp + ' m²', why: 'Halve the <b>part</b> squares, not the full ones.', code: 'u3l12-half-full' }],
            t(F + '+' + Pp + '\\div 2=' + (F + Pp / 2)) + ' m²', ['Full squares + half the part squares.'], 'MC grid'); } }] },
      { num: '22', parts: [
        { id: '22', level: 'EMG', outcome: 'M4', make: function (r) { var e = r.pick([2, 4, 5, 7, 8, 9, 10, 11, 12, 1.5, 2.5]);
          return P.mc(r, 'A cube has edges of ' + e + ' cm. Its surface area is', [{ html: 6 * e * e + ' cm²', right: true }, { html: e * e * e + ' cm²', why: t(e + '\\times ' + e + '\\times ' + e) + ' is the volume. Surface area = 6 faces.', code: 'u3sa-volume' }, { html: e * e + ' cm²', why: 'That’s one face. A cube has 6.', code: 'u3l12-one-face' }, { html: 5 * e * e + ' cm²', why: 'A closed cube has <b>6</b> faces.', code: 'u3l12-five' }],
            '6 faces, each ' + t(e + '\\times ' + e + '=' + e * e) + ': ' + t('6\\times ' + e * e + '=' + 6 * e * e) + ' cm²', ['A cube has 6 equal square faces.'], 'MC cube'); } }] },
      { num: '23', parts: [
        { id: '23', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { var a = r.int(2, 6); return [a, a + r.int(1, 5)]; }, function (v) { return !(v[0] === 6 && v[1] === 15); }), rr = v[0], s = v[1], f = function (x) { return N(rd(x, 1), 1) + ' cm²'; };
          return P.mc(r, 'A cone has a radius of ' + rr + ' cm and a slant height of ' + s + ' cm. Its total surface area (with the base) is about', [{ html: f(PI * rr * (rr + s)), right: true }, { html: f(PI * rr * s), why: 'That’s only the curved side. Add the base, ' + t('\\pi r^2') + '.', code: 'u3sa-cone-no-base' }, { html: f(PI * rr * rr), why: 'That’s only the base. Add the curved side, ' + t('\\pi rs') + '.', code: 'u3l12-base-only' }, { html: f(PI * 2 * rr * (2 * rr + s)), why: 'Use the radius ' + rr + ' cm, not the diameter.', code: 'u3sa-diam' }],
            t('\\pi r^2+\\pi rs=\\pi(' + rr * rr + ')+\\pi(' + rr * s + ')=' + (rr * rr + rr * s) + '\\pi\\approx ' + N(rd(PI * rr * (rr + s), 1), 1)) + ' cm²', [t('\\text{SA}=\\pi r^2+\\pi rs') + '.'], 'MC cone'); } }] },
      /* ---------- Part C: numerical response ---------- */
      { num: '24', section: 'Part C: Numerical Response', parts: [
        { id: '24', level: 'EMG', outcome: 'M2', make: function (r) { var x = r.int(20, 39), c = x * 2.54;
          return num('Numerical Response. A doorway is ' + x + ' in wide. Its width in centimetres, to the nearest tenth, is ____ cm.', c, { dp: 1, exact: c, nr: true, after: 'cm', bad: [[x / 2.54, 'u3l12-wrong-way', 'Centimetres are smaller, so the number gets bigger: multiply by 2.54.']], sol: [t(x + '\\times 2.54' + eqR(c, 1) + uT('cm'))], hints: ['1 in = 2.54 cm.'], text: 'NR in→cm' }); } }] },
      { num: '25', parts: [
        { id: '25', level: 'EMG', outcome: 'M3', make: function (r) { var d = r.int(50, 72), C = PI * d;
          return num('Numerical Response. A bike wheel is ' + d + ' cm across. Its circumference, to the nearest centimetre, is ____ cm.', C, { dp: 0, exact: C, nr: true, after: 'cm', bad: [[PI * d / 2, 'u3l12-radius-c', 'Use ' + t('\\pi d') + ' with the whole diameter.'], [PI * d * d / 4, 'u3l12-circ', 'That’s the area. ' + t('C=\\pi d') + '.']], sol: [t('C=\\pi\\times ' + d + eqR(C, 0) + uT('cm'))], hints: [t('C=\\pi d') + '.'], text: 'NR wheel' }); } }] },
      { num: '26', parts: [
        { id: '26', level: 'EMG', outcome: 'A1', make: function (r) { var v = find(function () { var w = pickR(r, 4.5, 9.5, 0.5), l = pickR(r, 10, 15, 0.5); return [2 * (l + w), l, w]; }, function (v) { return !(v[0] === 32) && !(v[0] === 36); }), Pm = v[0], l = v[1], w = v[2];
          return num('Numerical Response. A rectangle has a perimeter of ' + N(Pm) + ' m and a length of ' + N(l) + ' m. Its width is ____ m.', w, { nr: true, after: 'm', bad: [[(Pm - l) / 2, 'u3l12-rearr', 'Subtract <b>both</b> lengths: ' + t('w=(P-2l)\\div 2') + '.'], [Pm - 2 * l, 'u3l12-no-half', 'Divide by 2 at the end.']], sol: [t('w=(' + N(Pm) + '-2\\times ' + N(l) + ')\\div 2=' + N(Pm - 2 * l) + '\\div 2=' + N(w)) + ' m'], hints: [t('w=(P-2l)\\div 2') + '.'], text: 'NR width' }); } }] },
      { num: '27', parts: [
        { id: '27', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { return [r.int(3, 7), r.int(8, 15)]; }, function (v) { return !(v[0] === 2 && v[1] === 5); });
          return S.saPart('Numerical Response. A closed cylinder has a radius of ' + v[0] + ' cm and a height of ' + v[1] + ' cm. Its surface area, to the nearest square centimetre, is ____ cm².', S.cyl(v[0], v[1], 2, { dp: 0 }), { dp: 0, u: 'cm', nr: true, hints: [t('2\\pi r^2+2\\pi rh') + '.'], text: 'NR cylinder' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Fill in the blanks.', parts: [
        { id: 'e1a', level: 'BEG', outcome: 'M1', make: function (r) { var x = find(function () { return pickR(r, 1.05, 9.95, 0.01); }, function (v) { return decs(v) === 2 && !near(v, 3.45); }); return siConv('a', x, 'm', 'cm'); } },
        { id: 'e1b', level: 'EMG', outcome: 'M1', make: function (r) { var x = find(function () { return r.int(12, 95) * 100; }, function (v) { return v % 1000 !== 0; }); return siConv('b', x, 'm', 'km'); } },
        { id: 'e1c', level: 'BEG', outcome: 'M1', make: function (r) { var x = find(function () { return r.int(12, 98); }, function (v) { return v % 10 !== 0 && v !== 65; }); return siConv('c', x, 'mm', 'cm'); } },
        { id: 'e1d', level: 'BEG', outcome: 'M2', make: function (r) { return imConv('d', r.int(3, 11), 'ftin', true); } },
        { id: 'e1e', level: 'BEG', outcome: 'M2', make: function (r) { var x = find(function () { return r.int(2, 12); }, function (v) { return v !== 7; }); return imConv('e', x, 'ydft', true); } },
        { id: 'e1f', level: 'EMG', outcome: 'M2', make: function (r) { var n = find(function () { return r.int(40, 99); }, function (v) { return v % 12 !== 0 && v !== 100; }); return toFtInPart('f', n); } }] },
      { num: '2', stem: 'Find each answer in simplest form.', parts: [
        { id: 'e2a', level: 'EMG', outcome: 'REV', make: function (r) { var v = find(function () { var a = fr(r, [4, 8, 16]), b = fr(r, [2, 4, 8]); return [[r.int(1, 6), a[0], a[1]], [r.int(1, 4), b[0], b[1]]]; }, function (v) { return v[0][2] !== v[1][2] && v[0][1] / v[0][2] + v[1][1] / v[1][2] > 1; }); return addPart('a', v[0], v[1]); } },
        { id: 'e2b', level: 'PRG', outcome: 'REV', make: function (r) { var v = find(function () { var a = fr(r, [8, 16]), b = fr(r, [4, 8, 16]), w = r.int(3, 7); return [[w, a[0], a[1]], [r.int(1, w - 1), b[0], b[1]]]; }, function (v) { return v[0][1] / v[0][2] < v[1][1] / v[1][2] && v[0][2] !== v[1][2]; }); return subPart('b', v[0], v[1]); } },
        { id: 'e2c', level: 'EMG', outcome: 'REV', make: function (r) { var v = find(function () { var d = r.pick([2, 3, 4]); return [d * r.int(1, 3), [r.int(1, 3), r.int(1, d - 1), d]]; }, function (v) { return gcd(v[1][1], v[1][2]) === 1 && !(v[0] === 3 && v[1][0] === 2 && v[1][1] === 3); }); return mulPart('c', v[0], v[1]); } }] },
      { num: '3', stem: function (sh) { return 'The ruler is real size.' + ruler([{ n: sh.A, lab: 'A' }, { n: sh.B, lab: 'B' }]); },
        shared: function (r) { return find(function () { return { A: 16 * r.int(0, 2) + r.pick([6, 10, 12, 14]), B: 16 * r.int(4, 5) + r.pick([1, 2, 3, 5]) }; }, function (s) { return s.A !== 19 && s.B !== 74 && s.A >= 4 && (s.B % 16) < (s.A % 16); }); },
        parts: [
          { id: 'e3aA', sub: 'a A', level: 'EMG', outcome: 'M3', make: function (r, sh) { return readPart('(a) Arrow A:', sh.A); } },
          { id: 'e3aB', sub: 'a B', level: 'EMG', outcome: 'M3', make: function (r, sh) { return readPart('(a) Arrow B:', sh.B); } },
          { id: 'e3b', sub: 'b', level: 'PRG', outcome: 'M3', make: function (r, sh) { return distPart('(b) How far apart are the arrows?', sh.A, sh.B); } }] },
      { num: '4', stem: 'Convert. Round to the nearest tenth unless told otherwise.', parts: [
        { id: 'e4a', level: 'EMG', outcome: 'M2', make: function (r) { var x = r.pick([5, 6, 7, 8, 9, 11, 13, 15]); return convPart('(a) ' + x + ' in to centimetres', x, 2.54, true, { from: 'in', to: 'cm', dp: 1, fact: '1 in = 2.54 cm', other: [12, 30.48], text: 'E in→cm' }); } },
        { id: 'e4b', level: 'EMG', outcome: 'M2', make: function (r) { var x = r.pick([1.5, 2.5, 3, 4, 6, 12, 0.75]); return convPart('(b) ' + N(x) + ' mi to kilometres (1 mi ≈ 1.609 km)', x, 1.609, true, { from: 'mi', to: 'km', dp: 1, fact: '1 mi ≈ 1.609 km', other: [0.621], alts: [x / 0.621], text: 'E mi→km' }); } },
        { id: 'e4c', level: 'EMG', outcome: 'M1', make: function (r) { var x = r.pick([2, 2.5, 3, 4, 4.5, 6, 1.8, 7]); return convPart('(c) ' + N(x) + ' m to feet (1 m ≈ 3.28 ft)', x, 3.28, true, { from: 'm', to: 'ft', dp: 1, fact: '1 m ≈ 3.28 ft', other: [3, 100], text: 'E m→ft' }); } },
        { id: 'e4d', level: 'PRG', outcome: 'M2', make: function (r) { var v = find(function () { return [r.int(5, 6), r.int(1, 11)]; }, function (v) { return !(v[0] === 5 && v[1] >= 9); }), inch = 12 * v[0] + v[1], cm = inch * 2.54;
          return num('(d) ' + t(v[0] + "'\\," + v[1] + "''") + ' to centimetres (nearest centimetre)', cm, { dp: 0, exact: cm, after: 'cm', bad: [[(v[0] + v[1] / 10) * 30.48, 'u3l12-ftdec', 'Change ' + t(v[0] + "'\\," + v[1] + "''") + ' to inches first: ' + t(v[0] + '\\times 12+' + v[1]) + '.'], [inch, 'u3l12-in-only', 'That’s inches. Multiply by 2.54.'], [(10 * v[0] + v[1]) * 2.54, 'u3l12-ft10', 'A foot is 12 in.']], sol: [t(v[0] + '\\times 12+' + v[1] + '=' + inch) + ' in', t(inch + '\\times 2.54' + eqR(cm, 0) + uT('cm'))], hints: ['Change to inches, then × 2.54.'], text: 'E ft-in→cm' }); } }] },
      { num: '5', stem: 'Find each area.', parts: [
        { id: 'e5a', level: 'BEG', outcome: 'M4', make: function (r) { var b = pickR(r, 4.5, 9.5, 0.5), h = r.int(3, 8); return num('(a) A parallelogram with a base of ' + N(b) + ' cm and a height of ' + h + ' cm.', b * h, { after: 'cm²', area: true, bad: [[b * h / 2, 'u3l12-half-par', 'A parallelogram is ' + t('A=bh') + ' (no ' + t('\\tfrac{1}{2}') + ').'], [2 * (b + h), 'u3l12-area', 'That’s a perimeter. ' + t('A=bh') + '.']], sol: [t('A=bh=' + N(b) + '\\times ' + h + '=' + N(q(b * h)) + uT('cm²'))], hints: [t('A=bh') + '.'], text: 'parallelogram' }); } },
        { id: 'e5b', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { return [r.int(3, 8) + r.pick([0.5, 0.25, 0.75]), r.int(2, 6)]; }, function (v) { return !(v[0] === 2.4 && v[1] === 3.5); }), b = v[0], h = v[1], A = b * h / 2;
          return num('(b) A triangle with a base of ' + t(S.mixT(b)) + ' ft and a height of ' + h + ' ft.', A, { after: 'ft²', area: true, bad: [[b * h, 'u3sa-no-half', 'A triangle is ' + t('\\tfrac{1}{2}bh') + '.'], [Math.floor(b) * h / 2, 'u3l12-frac-drop', 'Keep the fraction: ' + t(S.mixT(b) + '=' + N(b)) + '.']], sol: [t(S.mixT(b) + '=' + N(b)), t('A=\\tfrac{1}{2}\\times ' + N(b) + '\\times ' + h + '=' + N(q(A)) + uT('ft²'))], hints: ['Change the mixed number to a decimal, then ' + t('A=\\tfrac{1}{2}bh') + '.'], text: 'triangle' }); } },
        { id: 'e5c', level: 'EMG', outcome: 'M4', make: function (r) { var rr = r.int(3, 11), A = PI * rr * rr; return num('(c) A circle with a radius of ' + rr + ' in (to the nearest tenth).', A, { dp: 1, exact: A, after: 'in²', area: true, bad: [[2 * PI * rr, 'u3l12-circ', 'That’s the circumference. ' + t('A=\\pi r^2') + '.'], [PI * 4 * rr * rr, 'u3l12-diam-area', 'Use the radius as given.'], [PI * rr * 2, 'u3sa-r-times-2', t('r^2=r\\times r') + '.'], [3.14 * rr * rr, 'u3sa-pi314', 'Use the ' + t('\\pi') + ' key.', 'form']], sol: [t('A=\\pi\\times ' + rr + '^2' + eqR(A, 1) + uT('in²'))], hints: [t('A=\\pi r^2') + '.'], text: 'circle' }); } },
        { id: 'e5d', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { return [pickR(r, 1.5, 4, 0.5), pickR(r, 3, 6.5, 0.5), r.pick([2, 3, 4])]; }, function (v) { return v[1] > v[0]; }), A = (v[0] + v[1]) * v[2] / 2;
          return num('(d) A trapezoid with parallel sides of ' + N(v[0]) + ' m and ' + N(v[1]) + ' m and a height of ' + v[2] + ' m.', A, { after: 'm²', area: true, bad: [[(v[0] + v[1]) * v[2], 'u3l12-no-half', 'Don’t forget the ' + t('\\tfrac{1}{2}') + '.'], [v[0] * v[1] * v[2], 'u3l12-mult', 'Add the parallel sides first.']], sol: [t('A=\\tfrac{1}{2}\\times(' + N(v[0]) + '+' + N(v[1]) + ')\\times ' + v[2] + '=' + N(q(A)) + uT('m²'))], hints: [t('A=\\tfrac{1}{2}(a+b)h') + '.'], text: 'trapezoid' }); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return sh.who + ' is ' + t(ftinT(sh.a)) + ' tall and her brother is ' + t(ftinT(sh.b)) + ' tall.'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Mia', 'Ava', 'Noor', 'Kayla', 'Hana']), a: 12 * r.int(4, 5) + r.int(1, 11), b: 12 * r.int(5, 6) + r.int(0, 10) }; }, function (s) { return s.b > s.a + 3 && s.b - s.a < 16 && (s.b % 12) < (s.a % 12); }); },
        parts: [
          { id: 'e6a', level: 'EMG', outcome: 'M3', make: function (r, sh) { var d = sh.b - sh.a, fa = Math.floor(sh.a / 12), fb = Math.floor(sh.b / 12), ia = sh.a % 12, ib = sh.b % 12;
            return num('(a) How much taller is her brother, in inches?', d, { after: 'in', bad: [[(fb - fa) * 12 + (ia - ib), 'u3l12-borrow-none', 'Borrow 1 ft as 12 in: ' + t(ftinT(sh.b) + '=' + (fb - 1) + "'\\," + (ib + 12) + "''") + '.'], [(fb - fa) * 10 + ib - ia, 'u3l12-ft10', 'A foot is 12 in.'], [(fb - fa - 1) * 12 + (ib + 10 - ia), 'u3l12-borrow10', 'Borrow 1 ft as <b>12</b> in, not 10.']],
              sol: [t(ftinT(sh.b) + '=' + (fb - 1) + "'\\," + (ib + 12) + "''"), t((fb - 1) + "'\\," + (ib + 12) + "''-" + ftinT(sh.a) + '=' + (fb - 1 - fa ? (fb - 1 - fa) + "'\\," : '') + (ib + 12 - ia) + "''") + (d >= 12 ? ' = ' + d + ' in' : '')], hints: ['Subtract (borrow 1 ft as 12 in), or change both heights to inches and subtract.'], text: 'height diff' }); } },
          { id: 'e6b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var d = sh.b - sh.a, c = d * 2.54;
            return num('(b) What is that difference in centimetres, to the nearest tenth?', c, { dp: 1, exact: c, after: 'cm', bad: [[d / 2.54, 'u3l12-wrong-way', 'Centimetres are smaller: multiply by 2.54.'], [d, 'u3l12-cm-in', 'That’s inches. Multiply by 2.54.']], sol: [t(d + '\\times 2.54' + eqR(c, 1) + uT('cm'))], hints: ['1 in = 2.54 cm.'], text: 'diff cm' }); } }] },
      { num: '7', parts: [
        { id: 'e7', level: 'PRG', outcome: 'M3', make: function (r) { var v = find(function () { return { d: r.pick([2.4, 2.8, 3.2, 3.6, 4, 4.4]), L: r.pick([1.2, 1.5, 2]), p: r.pick([3.99, 4.49, 5.29, 6.49]) }; }, function (v) { var x = PI * v.d / v.L; return x % 1 > 0.05 && x % 1 < 0.95; }), C = PI * v.d, n = Math.ceil(C / v.L), c = n * v.p;
          return fields('A round flower bed is ' + N(v.d) + ' m across. Plastic edging is sold in ' + N(v.L) + ' m pieces for ' + Mp(v.p) + ' each. How many pieces are needed to go around the bed, and what do they cost before tax?', [
            { label: 'Pieces:', name: 'Pieces', ans: n, after: 'pieces', bad: [[rd(C / v.L, 2), 'u3l12-no-round-up', 'You can only buy whole pieces: round <b>up</b>.'], [n - 1, 'u3l12-round-down', 'That is not enough to go all the way around. Round up.'], [Math.ceil(PI * v.d / 2 / v.L), 'u3l12-radius-c', 'Use ' + t('C=\\pi d') + ' with the whole diameter.'], [Math.ceil(PI * v.d * v.d / 4 / v.L), 'u3l12-circ', 'Edging goes <b>around</b> the bed: use the circumference.']] },
            { label: 'Cost:', name: 'Cost', ans: c, money: true, bad: [[C / v.L * v.p, 'u3l12-cost-exact', 'Use the whole number of pieces you buy.'], [(n - 1) * v.p, 'u3l12-round-down', 'Use the pieces rounded up.']] }],
            [t('C=\\pi\\times ' + N(v.d) + '=' + rw(C)) + ' m', t(rw(C) + '\\div ' + N(v.L) + '=' + raw(C / v.L, 2)) + ', so round up: ' + n + ' pieces', t(n + '\\times ' + M(v.p) + '=' + M(c))], ['Find the circumference, divide by the length of a piece and round up.', 'Then multiply by the price.'], 'edging'); } }] },
      { num: '8', parts: [
        { id: 'e8', level: 'PRG', outcome: 'A1', make: function (r) { var v = find(function () { var w = r.pick([30, 35, 40, 45, 50]), l = r.pick([50, 55, 60, 70, 80, 85]); return [2 * (l + w), w, l]; }, function (v) { return v[2] > v[1]; }), Pm = v[0], w = v[1], l = v[2];
          return num('A rectangular outdoor rink uses ' + Pm + ' ft of boards around the outside. The rink is ' + w + ' ft wide. How long is it?', l, { after: 'ft', bad: [[(Pm - w) / 2, 'u3l12-rearr', 'Subtract <b>both</b> widths: ' + t('l=(P-2w)\\div 2') + '.'], [Pm - 2 * w, 'u3l12-no-half', 'Divide by 2 at the end.'], [Pm / 4, 'u3l12-rearr', 'It is a rectangle, not a square: ' + t('l=(P-2w)\\div 2') + '.']],
            sol: [t('l=(P-2w)\\div 2=(' + Pm + '-' + 2 * w + ')\\div 2=' + (Pm - 2 * w) + '\\div 2=' + l) + ' ft', 'Check: ' + t('2(' + l + ')+2(' + w + ')=' + Pm) + ' ✓'], hints: [t('l=(P-2w)\\div 2') + '.'], text: 'rink length' }); } }] },
      { num: '9', stem: function (sh) { return 'A rectangular lawn is ' + sh.L + ' m by ' + sh.W + ' m. A round pond ' + N(sh.d) + ' m across sits in the lawn.'; },
        shared: function (r) { return find(function () { return { L: r.int(12, 20), W: r.int(7, 12), d: r.pick([2, 2.5, 3, 3.5, 4]), roll: r.pick([0.75, 0.8, 1]) }; }, function (s) { var g = s.L * s.W - PI * s.d * s.d / 4, x = g / s.roll; return x % 1 > 0.05 && x % 1 < 0.95; }); },
        parts: [
          { id: 'e9a', level: 'PRG', outcome: 'M4', make: function (r, sh) { var whole = sh.L * sh.W, pd = PI * sh.d * sh.d / 4, g = whole - pd;
            return num('(a) Find the area of grass, to the nearest hundredth.', g, { dp: 2, exact: g, after: 'm²', area: true, bad: [[whole - PI * sh.d * sh.d, 'u3l12-diam-area', 'Use the pond’s radius: ' + t(N(sh.d) + '\\div 2=' + N(sh.d / 2)) + '.'], [whole, 'u3l12-no-semi', 'Take away the pond.'], [whole + pd, 'u3l12-added', 'The pond is not grass: <b>subtract</b> it.'], [whole - PI * sh.d, 'u3l12-circ', 'Subtract the pond’s <b>area</b>, ' + t('\\pi r^2') + '.']],
              sol: ['Whole: ' + t(sh.L + '\\times ' + sh.W + '=' + whole + uT('m²')), 'Pond: ' + t('r=' + N(sh.d / 2) + ',\\ \\pi\\times ' + N(sh.d / 2) + '^2=' + rw(pd)), 'Grass: ' + t(whole + '-' + rw(pd) + eqR(g, 2) + uT('m²'))], hints: ['Whole rectangle minus the pond.'], text: 'lawn grass' }); } },
          { id: 'e9b', level: 'PRG', outcome: 'M4', make: function (r, sh) { var g = sh.L * sh.W - PI * sh.d * sh.d / 4; return ceilPart('(b) One roll of sod covers ' + N(sh.roll) + ' m². How many rolls are needed?', g, sh.roll, 'rolls', { one: 'roll', text: 'sod rolls' }); } }] },
      { num: '10', stem: function (sh) { return 'A plan for a park shows a new skating pond on a grid. Each square is ' + sh.s + ' m by ' + sh.s + ' m.' + pondSvg(sh.p); },
        shared: function (r) { return find(function () { return { p: pond(r), s: r.pick([2, 2, 3, 5]) }; }, function (s) { return s.p.full >= 6 && s.p.part >= 12; }); },
        parts: [
          { id: 'e10a', level: 'BEG', outcome: 'M4', make: function (r, sh) { return num('(a) What area does one square stand for?', sh.s * sh.s, { after: 'm²', area: true, bad: [[2 * sh.s, 'u3l12-added', 'Area of a square = side × side: ' + t(sh.s + '\\times ' + sh.s) + '.'], [4 * sh.s, 'u3l12-area', 'That’s the perimeter of a square. Area = ' + t(sh.s + '\\times ' + sh.s) + '.']], sol: [t(sh.s + '\\times ' + sh.s + '=' + sh.s * sh.s + uT('m²'))], hints: ['Side × side.'], text: 'one square' }); } },
          { id: 'e10b', level: 'PRG', outcome: 'M4', make: function (r, sh) { var p = sh.p, sq = p.full + p.part / 2, A = sq * sh.s * sh.s, one = sh.s * sh.s;
            return fields('(b) Estimate the area of the pond.', [{ label: 'Area:', name: 'Area', ans: A, after: 'm²', est: { tol: 0.15, dp: 0, bad: [[(p.full + p.part) * one, 'u3l12-full-sq', 'Count each part square as about <b>half</b> a square.', 0.08], [p.full * one, 'u3l12-no-part', 'Don’t leave out the part squares: count each as half.', 0.1], [sq, 'u3l12-sq1', 'That’s the number of squares. Multiply by the area of one square (' + one + ' m²).', 0.15]], miss: 'Count the full squares, then the part squares. Full + half the part squares = squares; then × ' + one + ' m².' } }],
              ['Full: about ' + p.full + ' &nbsp; Part: about ' + p.part + ' &nbsp; ' + t(p.part + '\\div 2=' + N(p.part / 2)), t(p.full + '+' + N(p.part / 2) + '=' + N(sq)) + ' squares', t(N(sq) + '\\times ' + one + '=' + N(A) + uT('m²')), '(Counts a little different are fine: anything from ' + Math.ceil(A * 0.85) + ' to ' + Math.floor(A * 1.15) + ' m² is accepted.)'], ['Count the full squares and the part squares.', 'Squares = full + part ÷ 2. Then multiply by ' + one + ' m².'], 'pond estimate'); } }] },
      { num: '11', stem: function (sh) { return 'A closed shipping box is ' + sh.l + ' in long, ' + sh.w + ' in wide and ' + sh.h + ' in tall.'; },
        shared: function (r) { return find(function () { return { l: r.pick([18, 20, 24, 30, 36]), w: r.pick([12, 14, 16, 18]), h: r.pick([6, 8, 10, 12]) }; }, function (s) { var A = 2 * (s.l * s.w + s.l * s.h + s.w * s.h); return s.l > s.w && s.w >= s.h && decs(A / 144) <= 1; }); },
        parts: [
          { id: 'e11a', level: 'EMG', outcome: 'M4', make: function (r, sh) { var a = sh.l * sh.w, b = sh.l * sh.h, c = sh.w * sh.h, A = 2 * (a + b + c);
            return num('(a) Find its surface area in square inches.', A, { after: 'in²', area: true, bad: [[a + b + c, 'u3l12-one-face', 'Each face has a matching face on the other side: multiply each by 2.'], [sh.l * sh.w * sh.h, 'u3sa-volume', 'That’s the volume. Add the areas of the 6 faces.'], [A - a, 'u3l12-with-top', 'It is a <b>closed</b> box: count the top too.']],
              sol: ['Top and bottom: ' + t('2\\times ' + sh.l + '\\times ' + sh.w + '=' + 2 * a), 'Front and back: ' + t('2\\times ' + sh.l + '\\times ' + sh.h + '=' + 2 * b), 'Ends: ' + t('2\\times ' + sh.w + '\\times ' + sh.h + '=' + 2 * c), t('\\text{SA}=' + 2 * a + '+' + 2 * b + '+' + 2 * c + '=' + A + uT('in²'))], hints: ['3 pairs of equal faces.'], text: 'box SA' }); } },
          { id: 'e11b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var A = 2 * (sh.l * sh.w + sh.l * sh.h + sh.w * sh.h), F = A / 144;
            return num('(b) Change your answer to square feet. ' + t('(1\\text{ ft}^2=144\\text{ in}^2)'), F, { after: 'ft²', area: true, bad: [[A / 12, 'u3l11-in2-ft2', '1 ft² = 12 × 12 = <b>144</b> in². Divide by 144.'], [A * 144, 'u3l11-in2-way', 'Square feet are bigger: divide by 144.']], sol: [t(A + '\\div 144=' + N(q(F)) + uT('ft²'))], hints: ['Divide by 144.'], text: 'box ft2' }); } }] },
      { num: '12', parts: [
        { id: 'e12', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { return [r.int(3, 6), r.int(8, 14)]; }, function (v) { return !(v[0] === 3.8 && v[1] === 11); }), rr = v[0], h = v[1], f = function (x) { return N(rd(x, 1), 1) + ' cm²'; };
          return P.mc(r, 'A can has a radius of ' + rr + ' cm and a height of ' + h + ' cm. The area of the label around its side is about', [{ html: f(2 * PI * rr * h), right: true }, { html: f(PI * rr * h), why: 'The side is ' + t('2\\pi rh') + ': don’t forget the 2.', code: 'u3sa-side-2' }, { html: f(PI * rr * rr * h), why: t('\\pi r^2h') + ' is the volume.', code: 'u3sa-volume' }, { html: f(2 * PI * rr * (rr + h)), why: 'A label covers only the side, not the top and bottom.', code: 'u3sa-whole' }],
            t('2\\pi rh=2\\times\\pi\\times ' + rr + '\\times ' + h + '\\approx ' + N(rd(2 * PI * rr * h, 1), 1)) + ' cm²', ['Label = curved side = ' + t('2\\pi rh') + '.'], 'MC label'); } }] },
      { num: '13', parts: [
        { id: 'e13', level: 'EMG', outcome: 'M4', make: function (r) { var v = find(function () { var b = r.int(4, 10); return [b, b + r.int(2, 6)]; }, function (v) { return v[0] * v[0] + 2 * v[0] * v[1] <= 9999; });
          return S.saPart('Numerical Response. A square pyramid has a base ' + v[0] + ' cm on each side and a slant height of ' + v[1] + ' cm. Its total surface area is ____ cm².', S.pyr(v[0], v[1], true), { u: 'cm', nr: true, hints: ['Base + 4 triangles.'], text: 'NR pyramid' }); } }] },
      { num: '14', section: 'C. Stretch', stem: function (sh) { return 'Kiran is painting the walls of a bedroom. The floor is ' + sh.L + ' ft by ' + sh.W + ' ft and the walls are ' + sh.H + ' ft high. The room has a door ' + t("3'\\,0''") + ' by ' + t("6'\\,8''") + ' and a window ' + t(sh.wa + "'\\,0''") + ' by ' + t(sh.wb + "'\\,0''") + ' that will not be painted.'; },
        shared: function (r) { return find(function () { return { L: r.int(10, 14), W: r.int(9, 12), H: r.pick([8, 8, 9]), wa: r.pick([3, 4, 5]), wb: r.pick([3, 4]), gal: 350, price: r.pick([49.99, 54.99, 59.99, 62.49]) }; }, function (s) { var walls = 2 * (s.L + s.W) * s.H, pa = walls - 20 - s.wa * s.wb, x = 2 * pa / 350; return s.L > s.W && x % 1 > 0.05 && x % 1 < 0.95; }); },
        parts: [
          { id: 'e14a', level: 'PRG', outcome: 'M4', make: function (r, sh) { var Pm = 2 * (sh.L + sh.W), A = Pm * sh.H;
            return num('(a) Find the area of the four walls before the door and window are taken out. (Hint: the walls unroll into one long rectangle as long as the perimeter of the floor.)', A, { after: 'ft²', area: true, bad: [[sh.L * sh.W, 'u3l12-floor', 'That’s the floor. The walls are perimeter × height.'], [(sh.L + sh.W) * sh.H, 'u3l12-one-face', 'There are <b>4</b> walls: two ' + sh.L + ' ft long and two ' + sh.W + ' ft long.'], [Pm * sh.H + sh.L * sh.W, 'u3l12-floor', 'Only the walls.']],
              sol: ['Perimeter: ' + t('2(' + sh.L + ')+2(' + sh.W + ')=' + Pm) + ' ft', 'Walls: ' + t(Pm + '\\times ' + sh.H + '=' + A + uT('ft²'))], hints: ['Perimeter of the floor × wall height.'], text: 'walls' }); } },
          { id: 'e14b', level: 'ADV', outcome: 'M4', make: function (r, sh) { var A = 2 * (sh.L + sh.W) * sh.H, win = sh.wa * sh.wb, pa = A - 20 - win;
            return num('(b) Find the area to be painted.', pa, { after: 'ft²', area: true, bad: [[A - 3 * 6.8 - win, 'u3l12-door68', t("6'\\,8''") + ' is not 6.8 ft: 8 in = ' + t('\\frac{8}{12}=\\frac{2}{3}') + ' ft, so the door is ' + t('3\\times 6\\tfrac{2}{3}=20') + ' ft².'], [A - 18 - win, 'u3l12-door68', 'Include the 8 in: ' + t("6'\\,8''=6\\tfrac{2}{3}") + ' ft.'], [A, 'u3l12-no-openings', 'Take away the door and the window.'], [A - win, 'u3l12-no-openings', 'Take away the door too.'], [A - 20, 'u3l12-no-openings', 'Take away the window too.']],
              sol: ['Door: ' + t("6'\\,8''=6\\tfrac{2}{3}") + ' ft, so ' + t('3\\times 6\\tfrac{2}{3}=20') + ' ft²; window: ' + t(sh.wa + '\\times ' + sh.wb + '=' + win) + ' ft²', t(A + '-20-' + win + '=' + pa + uT('ft²'))], hints: [t("6'\\,8''") + ' = ' + t('6\\tfrac{8}{12}=6\\tfrac{2}{3}') + ' ft.', 'Walls − door − window.'], text: 'paint area' }); } },
          { id: 'e14c', level: 'MAS', outcome: 'M4', make: function (r, sh) { var A = 2 * (sh.L + sh.W) * sh.H, pa = A - 20 - sh.wa * sh.wb, tw = 2 * pa, g = Math.ceil(tw / 350), c = g * sh.price;
            return fields('(c) One gallon of paint covers 350 ft². Kiran wants 2 coats. How many gallons must he buy? At ' + Mp(sh.price) + ' a gallon, what is the cost before tax?', [
              { label: 'Gallons:', name: 'Gallons', ans: g, after: 'gal', bad: [[Math.ceil(pa / 350), 'u3l12-one-coat', 'Kiran wants <b>2</b> coats: double the area first.'], [rd(tw / 350, 2), 'u3l12-no-round-up', 'Round <b>up</b> to whole gallons.'], [g - 1, 'u3l12-round-down', 'That is not enough for 2 coats. Round up.']] },
              { label: 'Cost:', name: 'Cost', ans: c, money: true, bad: [[tw / 350 * sh.price, 'u3l12-cost-exact', 'Use the whole number of gallons you buy.'], [Math.ceil(pa / 350) * sh.price, 'u3l12-one-coat', 'Use the gallons for 2 coats.']] }],
              ['2 coats: ' + t('2\\times ' + pa + '=' + tw + uT('ft²')), t(tw + '\\div 350=' + raw(tw / 350, 2)) + ', so round up: ' + g + ' gallons', t(g + '\\times ' + M(sh.price) + '=' + M(c))], ['Double the area for 2 coats, divide by 350 and round up.', 'Then multiply by the price.'], 'gallons'); } }] },
      { num: '15', stem: function (sh) { return 'A round steel storage tank at a water plant is a cylinder ' + sh.d + ' m across and ' + sh.H + ' m tall, with a cone roof. The roof has a slant height of ' + N(sh.s) + ' m and the same radius as the tank.' + S.silo({ r: N(sh.d / 2) + ' m', h: sh.H + ' m', s: N(sh.s) + ' m' }); },
        shared: function (r) { return find(function () { return { d: r.pick([5, 6, 7, 8]), H: r.int(9, 14), s: r.pick([3.5, 4, 4.5, 5, 5.5]), price: r.pick([26.5, 28.5, 31.75, 33.25]) }; }, function (s) { return s.s >= s.d / 2 + 0.5; }); },
        parts: [
          { id: 'e15a', level: 'PRG', outcome: 'M4', make: function (r, sh) { return S.saPart('(a) Find the area of the side of the tank, to the nearest hundredth.', S.cyl(sh.d / 2, sh.H, 0, { d: true, dp: 2, u: 'm' }), { dp: 2, u: 'm', hints: ['Side only: ' + t('2\\pi rh') + '. Halve the diameter first.'], text: 'tank side' }); } },
          { id: 'e15b', level: 'PRG', outcome: 'M4', make: function (r, sh) { return S.saPart('(b) Find the area of the roof, to the nearest hundredth.', S.cone(sh.d / 2, sh.s, false, { d: true, dp: 2, u: 'm' }), { dp: 2, u: 'm', hints: ['Curved part of the cone only: ' + t('\\pi rs') + '.'], text: 'tank roof' }); } },
          { id: 'e15c', level: 'MAS', outcome: 'M4', make: function (r, sh) { var rr = sh.d / 2, side = 2 * PI * rr * sh.H, roof = PI * rr * sh.s, A = side + roof, c = A * sh.price, c2 = (rd(side, 2) + rd(roof, 2)) * sh.price;
            return num('(c) Steel sheeting costs ' + Mp(sh.price) + ' per square metre. Find the cost of the steel for the side and roof (the floor is concrete).', rd(c, 2), { money: true, exact: c, alts: [rd(c2, 2)], bad: [[(A + PI * rr * rr) * sh.price, 'u3l12-floor', 'The floor is concrete: no steel there.'], [side * sh.price, 'u3l12-one-rect', 'Add the roof too.'], [(side + 2 * PI * rr * sh.s) * sh.price, 'u3sa-cone-2', 'The roof is ' + t('\\pi rs') + ' (no 2).']],
              sol: [t(rw(side) + '+' + rw(roof) + '=' + raw(A, 3) + uT('m²')), t(raw(A, 3) + '\\times ' + M(sh.price) + '\\approx ' + M(c))], hints: ['Add (a) and (b), then multiply by the price per m².'], text: 'steel cost' }); } }] }
    ]
  });
})(window);
