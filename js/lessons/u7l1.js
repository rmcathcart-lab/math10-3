/* Math 10-3 · Unit 7 · Lesson 1 — Squares, Square Roots and Triangle Basics (REV: refresher)
 * Assignment 1 (u7_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u7_ep01.tex: A Skills 1–6, B Applying 7–12,
 * C Stretch 13–15). Every part is a generator: the same kind of number (a one-digit square, a multiple of 10, a decimal
 * less than 1, a perfect square under 225, a non-square to the nearest tenth…) or triangle (scalene, right, isosceles with
 * the apex or a base angle given…) as the booklet item, new numbers around the booklet's (the booklet's own numbers are
 * among the possible values; the lesson's worked-example numbers are left out). Calculator allowed.
 * Answers: squares and exact roots are exact numbers (a unit typed after the number gets a nudge); calculator roots and
 * lengths to the nearest tenth (an unrounded or over-rounded answer gets a nudge, chopping instead of rounding is wrong
 * with a hint); angles in degrees (the ° sign is optional). Recognised mistakes each get their own hint: n² as n × 2, the
 * decimal point in the wrong place, a square root as half the number, squaring instead of taking the root, the
 * perimeter instead of the area, rounding the side before multiplying by 4, rounding the number of rolls down, adding the
 * two angles (or taking them from 360°), forgetting the right angle, not halving for the two equal angles, forgetting
 * the second equal angle, a side named with the letter of a vertex it touches, a leg called the hypotenuse.
 * Conversions: "circle the perfect squares" → tap the chips; "explain how you know" / "find the mistake and explain" /
 * "is it reasonable?" / "always, sometimes or never — give a reason" → multiple choice whose options are reasons (one
 * right); the estimating table → the fill-in table (two rows at a time, each blank a box); "name each triangle" (table)
 * → two tap grids (by sides, by angles); "mark the right angle and label each side" → type the small letter of each side;
 * "the legs are ___ and ___" → multiple choice; "draw a sketch… label the hypotenuse" → choose the correct sketch (MC of
 * pictures); "put in order" → the ordering input; "find every whole number" → a list.
 * Outcome REV (refresher: never counts toward a level). Levels: LIM BEG EMG PRG ADV MAS.
 *
 * Shared kit for later Unit 7 lessons: HW.u7l1 — triSVG (any triangle from two base angles, with angle arcs, labels, tick
 * marks and a right-angle box), sceneSVG (a leaning ladder / guy wire right triangle with object labels), sqBad / rootBad
 * (typical wrong values for n² and √n), exChk (an exact number with [value, code, hint] traps), fieldsPart. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, G = HW.geo, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= numbers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dg(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dg(x)); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function raw3(x) { var s = +x.toFixed(3); return HW.fmt(String(s)) + (same(x, s) ? '' : '\\ldots'); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function find(gen, test, fb) { for (var i = 0; i < 600; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function pickNot(r, arr, not) { var a = arr.filter(function (x) { return (not || []).indexOf(x) < 0; }); return r.pick(a.length ? a : arr); }
  function range(a, b, step) { var o = []; for (var x = a; x <= b + 1e-9; x += (step || 1)) o.push(q(x)); return o; }
  function nonSq(r, a, b, not) { return find(function () { return r.int(a, b); }, function (n) { return !isSq(n) && (not || []).indexOf(n) < 0 && safe(Math.sqrt(n)); }, a + 1); }
  var NAMES = [['Jesse', 'm'], ['Maya', 'f'], ['Ty', 'm'], ['Kara', 'f'], ['Ravi', 'm'], ['Ana', 'f'], ['Noah', 'm'], ['Leah', 'f'], ['Owen', 'm'], ['Priya', 'f'], ['Liam', 'm'], ['Sofia', 'f']];

  /* ================= checkers ================= */
  function cleanBad(bad, ans) { var seen = []; return (bad || []).filter(function (b) { if (!b || !isFinite(b[0]) || same(b[0], ans) || seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true; }); }
  /* an exact number; bad = [[value, code, hint, 'form'?]] */
  function exChk(ans, bad) {
    var base = K.number(ans), bb = cleanBad(bad, ans);
    return function (resp) {
      var r = base(resp); if (r.v !== 'wrong') return r;
      var p = HW.parse.number(resp); if (!p.ok) return r;
      for (var i = 0; i < bb.length; i++) if (same(p.value, bb[i][0])) return bb[i][3] === 'form' ? form(bb[i][1], bb[i][2]) : wrong(bb[i][1], bb[i][2]);
      return r;
    };
  }
  function alts(bad) { return (bad || []).filter(function (b) { return b && isFinite(b[0]); }).map(function (b) { return { v: b[0], code: b[1], hint: b[2] }; }); }
  /* typical wrong values for n² */
  function sqBad(n) {
    var d = decs(n), b = [[2 * n, 'u7l1-double', t(N(n) + '^2') + ' means ' + t(N(n) + '\\times ' + N(n)) + ', not ' + t(N(n) + '\\times 2') + '.']];
    if (d) {
      var hint = 'Check the decimal point: ' + N(n) + ' has ' + d + ' decimal place' + (d > 1 ? 's' : '') + ', so ' + t(N(n) + '\\times ' + N(n)) + ' has ' + 2 * d + '.' + (n < 1 ? ' (Squaring a number less than 1 makes it <b>smaller</b>.)' : '');
      b.push([n * n * 10, 'u7l1-dec-place', hint], [n * n / 10, 'u7l1-dec-place', hint], [n * n * 100, 'u7l1-dec-place', hint]);
      for (var k = 0; k < 2 * d; k++) if (!same(rd(n * n, k), n * n) && rd(n * n, k) > 0) b.push([rd(n * n, k), 'u7l1-exact', 'Close — give the <b>exact</b> square (every digit the calculator shows).', 'form']);
    }
    b.push([n + 2, 'u7l1-double', t(N(n) + '^2') + ' means ' + t(N(n) + '\\times ' + N(n)) + '. The small 2 is not added.']);
    return b;
  }
  /* typical wrong values for √m (root = √m) */
  function rootBad(m) {
    var s = Math.sqrt(m);
    return [[m / 2, 'u7l1-half', 'A square root is <b>not</b> half the number. Check by squaring: ' + t(N(m / 2) + '^2=' + N(q(m * m / 4))) + ', not ' + N(m) + '.'],
      [m * m, 'u7l1-squared', 'You squared ' + N(m) + '. The square root goes the other way: what number times itself makes ' + N(m) + '?'],
      [m * 2, 'u7l1-half', 'A square root is not the number doubled. What number times itself makes ' + N(m) + '?'],
      [s * 2, 'u7l1-half', 'That is twice the square root. What number times itself makes ' + N(m) + '?']];
  }
  /* one box part */
  function numP(prompt, ans, bad, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', after: o.after, nr: !!o.nr }, check: exChk(ans, bad), key: nS(ans), answer: t(N(ans)) + (o.after ? ' ' + o.after : ''), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = cleanBad(bad, ans).filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    return p;
  }
  function nearP(prompt, x, dp, bad, o) {
    o = o || {};
    var p = K.P.near(prompt, x, dp, { unit: o.after, alts: alts(bad), nr: o.nr }, o.sol, o.hints, o.text);
    p.bad = alts(bad).filter(function (a) { return Math.abs(rd(a.v, dp) - rd(x, dp)) > 1e-9; }).map(function (a) { return rd(a.v, dp).toFixed(dp); });
    return p;
  }
  function angP(prompt, deg, bad, o) {
    o = o || {};
    var p = G.P.angle(prompt, deg, { alts: alts(bad), supplementTrap: false, nr: o.nr, sol: o.sol, hints: o.hints, text: o.text });
    p.bad = cleanBad(bad, deg).map(function (b) { return nS(b[0]); });
    return p;
  }
  /* several boxes: specs [{ label, name, chk, key, show, after, mode }] */
  function fieldsPart(prompt, specs, sol, hints, text) {
    var p = P.fields(prompt, specs.map(function (s) { return { label: s.label, name: s.name || String(s.label).replace(/<[^>]+>|\\\(|\\\)/g, ''), after: s.after, mode: s.mode, wide: s.mode === 'text', placeholder: s.ph }; }),
      specs.map(function (s) { return s.chk; }), specs.map(function (s) { return s.key; }),
      specs.map(function (s) { return (s.label ? s.label + ' ' : '') + s.show + (s.after && s.after !== '°' ? ' ' + s.after : ''); }).join(' &nbsp;&nbsp; '), sol, hints, text);
    return p;
  }
  function sqSpec(label, n) { return { label: label, name: label.replace(/\\\(|\\\)/g, '').replace(/\^2/, '²').replace(/\\times/g, '×'), chk: exChk(q(n * n), sqBad(n)), key: nS(n * n), show: t(N(q(n * n))) }; }
  function rootSpec(label, m) { var s = Math.sqrt(m); return { label: label, name: label.replace(/\\\(|\\\)|\\sqrt\{|\}/g, '').replace(/^(\(\w\)) /, '$1 √'), chk: exChk(s, rootBad(m)), key: nS(s), show: t(N(s)) }; }
  function apxSpec(label, m) {
    var s = Math.sqrt(m), al = alts(rootBad(m));
    return { label: label, name: label.replace(/\\\(|\\\)|\\sqrt\{|\}/g, '').replace(/^(\(\w\)) /, '$1 √'), chk: K.near(s, 1, { alts: al }), key: rd(s, 1).toFixed(1), show: t(fx(s, 1)) };
  }
  function angSpec(label, deg, bad, name) { return { label: label, name: name || label, chk: G.angleChk(deg, { alts: alts(bad), supplementTrap: false }), key: nS(deg), show: D(deg), after: '°' }; }
  function numSpec(label, ans, bad, o) { o = o || {}; return { label: label, name: o.name || label, chk: exChk(ans, bad), key: nS(ans), show: t(N(ans)), after: o.after }; }
  function sqrtWork(m) { var s = Math.sqrt(m); return t('\\sqrt{' + N(m) + '}=' + raw3(s) + (same(s, rd(s, 1)) ? '' : '\\approx ' + fx(s, 1))); }

  /* ================= figures ================= */
  var INK = '#1d2633', RED = '#c93a33', BROWN = '#9a6a24', FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"', RAD = Math.PI / 180;
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function txt(x, y, s, o) {
    o = o || {}; var it = /^[a-zθ]$/.test(String(s)) ? ' font-style="italic"' : '';
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + (o.size || 15) + '" font-weight="' + (o.weight || 600) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it + ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + esc(s) + '</text>';
  }
  function dirTo(V, Q) { return ((Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) / RAD) + 360) % 360; }
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  /* the interior angle mark at V between the arms to P and Q: an arc (or a right-angle box) and a label */
  function angMark(V, P, Q, label, o) {
    o = o || {}; var d1 = dirTo(V, P), d2 = dirTo(V, Q), sp = ((d2 - d1) + 360) % 360, st = d1; if (sp > 180) { st = d2; sp = 360 - sp; }
    var s = '', colr = o.color || INK;
    if (o.right) { var u = at([0, 0], st, 1), v = at([0, 0], st + 90, 1), z = 12; s += '<path d="M' + f1(V[0] + u[0] * z) + ' ' + f1(V[1] + u[1] * z) + 'L' + f1(V[0] + (u[0] + v[0]) * z) + ' ' + f1(V[1] + (u[1] + v[1]) * z) + 'L' + f1(V[0] + v[0] * z) + ' ' + f1(V[1] + v[1] * z) + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>'; return s; }
    var r = o.r || (sp < 30 ? 44 : sp < 50 ? 32 : sp > 100 ? 18 : 24), a = at(V, st, r), b = at(V, st + sp, r);
    s += '<path d="M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + r + ' ' + r + ' 0 0 0 ' + f1(b[0]) + ' ' + f1(b[1]) + '" fill="none" stroke="' + colr + '" stroke-width="1.7"/>';
    if (label != null && label !== '') { var L = String(label), rr = r + 8 + L.length * 3.6 + (sp < 30 ? 6 : 0), m = at(V, st + sp / 2, rr); s += txt(m[0], m[1], L, { color: /^[a-z?]$/.test(L) ? RED : INK }); }
    return s;
  }
  function tick(P, Q, n) {
    var M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], L = Math.hypot(Q[0] - P[0], Q[1] - P[1]), u = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L], nn = [-u[1], u[0]], s = '';
    for (var i = 0; i < n; i++) { var off = (i - (n - 1) / 2) * 5, c = [M[0] + u[0] * off, M[1] + u[1] * off]; s += '<line x1="' + f1(c[0] - nn[0] * 7) + '" y1="' + f1(c[1] - nn[1] * 7) + '" x2="' + f1(c[0] + nn[0] * 7) + '" y2="' + f1(c[1] + nn[1] * 7) + '" stroke="' + INK + '" stroke-width="1.8"/>'; }
    return s;
  }
  /* triSVG({ A, B (angles at the left and right ends of the base), lab: { A, B, C } (angle labels; '' = arc only),
   *   right: 'A'|'B'|'C' (a right-angle box there), ticks: { AB: 1, BC: 1, CA: 1 }, names: ['A','B','C'] | null, base 220, width }) */
  function triSVG(o) {
    var A = o.A, B = o.B, L = o.base || 220, ac = L * Math.sin(B * RAD) / Math.sin((A + B) * RAD);
    var V = { A: [0, 0], B: [L, 0], C: [ac * Math.cos(A * RAD), -ac * Math.sin(A * RAD)] };
    var xs = [V.A[0], V.B[0], V.C[0]], ys = [V.A[1], V.B[1], V.C[1]], pad = 34;
    var x0 = Math.min.apply(null, xs) - pad, y0 = Math.min.apply(null, ys) - pad, W = Math.max.apply(null, xs) - Math.min.apply(null, xs) + 2 * pad, H = Math.max.apply(null, ys) - Math.min.apply(null, ys) + 2 * pad;
    var s = '<path d="M' + f1(V.A[0]) + ' ' + f1(V.A[1]) + 'L' + f1(V.B[0]) + ' ' + f1(V.B[1]) + 'L' + f1(V.C[0]) + ' ' + f1(V.C[1]) + 'Z" fill="#f6f2ea" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
    var lab = o.lab || {}, other = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] };
    ['A', 'B', 'C'].forEach(function (k) { if (o.right === k) s += angMark(V[k], V[other[k][0]], V[other[k][1]], null, { right: true }); else if (lab[k] != null) s += angMark(V[k], V[other[k][0]], V[other[k][1]], lab[k]); });
    Object.keys(o.ticks || {}).forEach(function (sd) { s += tick(V[sd[0]], V[sd[1]], o.ticks[sd]); });
    if (o.names) { var c = [(V.A[0] + V.B[0] + V.C[0]) / 3, (V.A[1] + V.B[1] + V.C[1]) / 3]; ['A', 'B', 'C'].forEach(function (k, i) { var p = at(V[k], dirTo(c, V[k]), 16); s += txt(p[0], p[1], o.names[i], { size: 16, weight: 700 }); }); }
    return '<svg class="fig-svg" viewBox="' + f1(x0) + ' ' + f1(y0) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(o.width || Math.min(300, W * 1.1)) + 'px" role="img" aria-label="' + esc(o.aria || 'triangle') + '">' + s + '</svg>';
  }
  /* sceneSVG({ g (angle at the foot), names: { vert, base, hyp }, rightAt: 'bottom'|'top'|'foot', hypOn: 'hyp'|'vert'|'base', width })
   * a vertical object, level ground and a slanted wire/ladder; the side marked "hypotenuse" is drawn in brown */
  function sceneSVG(o) {
    var H = 150, Wd = H / Math.tan(o.g * RAD), T = [0, -H], Bt = [0, 0], F = [Wd, 0], nm = o.names, s = '';
    var col = function (k) { return o.hypOn === k ? BROWN : INK; };
    s += '<line x1="-14" y1="0" x2="' + f1(Wd + 30) + '" y2="0" stroke="#8a6f4d" stroke-width="2"/>';
    s += '<line x1="0" y1="0" x2="0" y2="' + (-H) + '" stroke="' + col('vert') + '" stroke-width="' + (o.hypOn === 'vert' ? 4 : 3) + '"/>';
    s += '<line x1="0" y1="0" x2="' + f1(Wd) + '" y2="0" stroke="' + col('base') + '" stroke-width="' + (o.hypOn === 'base' ? 4 : 3) + '"/>';
    s += '<line x1="' + f1(Wd) + '" y1="0" x2="0" y2="' + (-H) + '" stroke="' + col('hyp') + '" stroke-width="' + (o.hypOn === 'hyp' ? 4 : 3) + '"/>';
    var corner = o.rightAt === 'top' ? [T, Bt, F] : o.rightAt === 'foot' ? [F, T, Bt] : [Bt, T, F];
    s += angMark(corner[0], corner[1], corner[2], null, { right: true });
    s += angMark(F, Bt, T, dg0(o.g), { r: 30 });
    var lab = function (k, x, y, anchor) { var two = o.hypOn === k; s += txt(x, two ? y - 8 : y, nm[k], { anchor: anchor, size: 14, color: col(k) }); if (two) s += txt(x, y + 8, 'hypotenuse', { anchor: anchor, size: 13, color: BROWN, weight: 700 }); };
    lab('vert', -8, -H / 2, 'end'); lab('base', Wd / 2, 18, 'middle');
    var M = [Wd / 2, -H / 2], nrm = [H, Wd], ln = Math.hypot(nrm[0], nrm[1]), hx = M[0] + nrm[0] / ln * 12, hy = M[1] - nrm[1] / ln * 12;
    lab('hyp', hx, hy, 'start');
    var cw = 7.6, lv = Math.max(nm.vert.length, o.hypOn === 'vert' ? 10 : 0), lh = Math.max(nm.hyp.length, o.hypOn === 'hyp' ? 10 : 0);
    var x0 = -14 - lv * cw, x1 = Math.max(Wd + 34, hx + lh * cw + 6), y0 = -H - 14, y1 = o.hypOn === 'base' ? 40 : 30;
    return '<svg class="fig-svg" viewBox="' + f1(x0) + ' ' + f1(y0) + ' ' + f1(x1 - x0) + ' ' + f1(y1 - y0) + '" width="100%" style="max-width:' + (o.width || 260) + 'px" role="img" aria-label="sketch">' + s + '</svg>';
  }
  function dg0(x) { return N(x) + '°'; }
  function namedTri(letters, rightIdx, sh, rot) {
    var others = [0, 1, 2].filter(function (i) { return i !== rightIdx; });
    return G.rightTriSVG({ a: sh[0], b: sh[1], names: [letters[others[0]], letters[others[1]], letters[rightIdx]], rot: rot, width: 230, px: 170 });
  }

  HW.addCodes({
    'u7l1-double': 'Squared as n × 2 (or n + 2)', 'u7l1-dec-place': 'Decimal point in the wrong place when squaring', 'u7l1-exact': 'Rounded a square that should be exact',
    'u7l1-half': 'Square root as half (or double) the number', 'u7l1-squared': 'Squared instead of taking the square root', 'u7l1-perimeter': 'Perimeter (4 × side) instead of area',
    'u7l1-not-square': 'Chose a number that is not a perfect square', 'u7l1-missed-square': 'Missed a perfect square', 'u7l1-early-round': 'Rounded the side before multiplying',
    'u7l1-round-rolls': 'Rounded the number of rolls down (not enough)', 'u7l1-squares': 'Wrong perfect square below/above', 'u7l1-roots': 'Wrong whole numbers for the root', 'u7l1-closer': 'Wrong “closer to” whole number',
    'u7l1-add-angles': 'Added the known angles instead of subtracting from 180°', 'u7l1-360': 'Subtracted from 360° instead of 180°', 'u7l1-no-right': 'Forgot the right angle (90°)',
    'u7l1-no-half': 'Didn’t halve for the two equal angles', 'u7l1-apex-equal': 'Made the base angles equal to the apex angle', 'u7l1-one-base': 'Used only one of the two equal base angles',
    'u7l1-sides': 'Named a triangle by its sides wrongly', 'u7l1-angles': 'Named a triangle by its angles wrongly', 'u7l1-asn': 'Always / sometimes / never with the wrong reason',
    'u7l1-letter-touch': 'Named a side with the letter of a vertex it touches', 'u7l1-capital': 'Wrote a capital letter for a side', 'u7l1-leg-as-hyp': 'Called a leg the hypotenuse',
    'u7l1-gave-ground': 'Gave the angle that was given (with the ground)', 'u7l1-gave-right': 'Gave the right angle', 'u7l1-acute-sum': 'Used 180° for the two acute angles of a right triangle',
    'u7l1-endpoint': 'Included a perfect square (its root is a whole number, not between)', 'u7l1-halfway': 'Wrong side of the halfway point', 'u7l1-list-missing': 'Missed some whole numbers', 'u7l1-blocks': 'Multiplied the block area by the number of blocks in a row',
    'u7l1-one-letter': 'Typed more than one letter for a side', 'u7l1-two-letters': 'Side not named with two capital letters', 'u7l1-right-where': 'Put the right angle in the wrong corner',
    'u7l1-both': 'Named both sides and angles wrongly', 'u7l1-even-odd': 'Thought even/odd decides a perfect square', 'u7l1-last-digit': 'Thought the last digit decides it', 'u7l1-reasonable': 'Called an unreasonable estimate reasonable',
    'u7l1-both-right': 'Thought both wrong answers were right', 'u7l1-slip': 'Arithmetic slip', 'u7l1-number-not-root': 'Chose the number between, not its root',
    'u7l1-asn-always': 'Chose “always”', 'u7l1-asn-sometimes': 'Chose “sometimes”', 'u7l1-asn-never': 'Chose “never”'
  });
  HW.addPartial({ 'u7l1-early-round': 's', 'u7l1-round-rolls': 'b', 'u7l1-no-half': 'b', 'u7l1-one-base': 'b', 'u7l1-exact': 's', 'u7l1-list-missing': 'b', 'u7l1-halfway': 's', 'u7l1-endpoint': 's' });

  /* ================= question builders ================= */
  /* a fill-in table for estimating √n (two rows) */
  function estTable(prompt, ns, which, label) {
    var all = ['\\text{Below}', '\\text{Above}', '\\text{From}', '\\text{To}', '\\text{Closer}', '\\text{Calc}'], use = which === 'between' ? [0, 1, 2, 3] : [4, 5];
    var cols = use.map(function (j) { return all[j]; });
    prompt += which === 'between' ? '<div class="small muted"><b>Below / Above</b>: the perfect squares just below and just above the number. <b>From / To</b>: the two whole numbers the square root is between.</div>'
      : '<div class="small muted"><b>Closer</b>: the whole number the square root is closer to. <b>Calc</b>: the calculator value, to the nearest tenth.</div>';
    var blanks = [], keyCells = [], sol = [];
    ns.forEach(function (n, i) {
      var a = Math.floor(Math.sqrt(n)), lo = a * a, hi = (a + 1) * (a + 1), cl = n - lo <= hi - n ? a : a + 1, s = Math.sqrt(n), rn = '√' + n + ': ';
      var near = function () { return 'Look for the perfect squares right next to ' + n + ': ' + t(N(a) + '^2=' + N(lo)) + ' and ' + t(N(a + 1) + '^2=' + N(hi)) + '.'; };
      var chks = [exChk(lo, [[hi, 'u7l1-squares', 'That is the square just <b>above</b> ' + n + '. Which perfect square is just below it?'], [n - 1, 'u7l1-squares', n - 1 + ' is not a perfect square. ' + near()], [a, 'u7l1-roots', 'That is the root. This column is the perfect square itself: ' + t(N(a) + '^2') + '.']]),
        exChk(hi, [[lo, 'u7l1-squares', 'That is the square just <b>below</b> ' + n + '. Which perfect square is just above it?'], [n + 1, 'u7l1-squares', n + 1 + ' is not a perfect square. ' + near()], [a + 1, 'u7l1-roots', 'That is the root. This column is the perfect square itself: ' + t(N(a + 1) + '^2') + '.']]),
        exChk(a, [[lo, 'u7l1-roots', 'Take the square root of ' + lo + '.'], [lo / 2, 'u7l1-half', 'A square root is not half: ' + t('\\sqrt{' + lo + '}=' + a) + ' because ' + t(a + '\\times ' + a + '=' + lo) + '.']]),
        exChk(a + 1, [[hi, 'u7l1-roots', 'Take the square root of ' + hi + '.'], [hi / 2, 'u7l1-half', 'A square root is not half: ' + t('\\sqrt{' + hi + '}=' + (a + 1)) + '.']]),
        exChk(cl, [[cl === a ? a + 1 : a, 'u7l1-closer', n + ' is ' + (n - lo) + ' above ' + lo + ' and ' + (hi - n) + ' below ' + hi + '. Which perfect square is it nearer?'], [cl * cl, 'u7l1-roots', 'Give the whole number the <b>root</b> is closer to (not the perfect square).']]),
        K.near(s, 1, { alts: alts(rootBad(n)) })];
      var keys = [String(lo), String(hi), String(a), String(a + 1), String(cl), rd(s, 1).toFixed(1)], names = ['Below', 'Above', 'From', 'To', 'Closer', 'Calc'];
      use.forEach(function (j, jj) { blanks.push({ where: 'cell', i: i, j: jj, name: rn + names[j], chk: chks[j] }); });
      keyCells.push(use.map(function (j) { return keys[j]; }));
      sol.push(which === 'between' ? t('\\sqrt{' + n + '}') + ': ' + t(lo + '<' + n + '<' + hi) + ', so the root is between ' + t('\\sqrt{' + lo + '}=' + a) + ' and ' + t('\\sqrt{' + hi + '}=' + (a + 1)) + '.'
        : t('\\sqrt{' + n + '}') + ': ' + n + ' is ' + (n - lo) + ' above ' + lo + ' and ' + (hi - n) + ' below ' + hi + ', so the root is closer to ' + cl + '. Calculator: ' + sqrtWork(n));
    });
    var key = { rows: ns.map(function (n) { return '\\sqrt{' + n + '}'; }), cols: cols, cells: keyCells };
    return HW.pctKit.tablePart(prompt, { rows: key.rows, cols: cols, cells: ns.map(function () { return use.map(function () { return null; }); }), corner: '\\text{Number}', keys: 'pctkit-money', help: 'Tap a box, then type.' },
      HW.pctKit.tableChk(blanks), key, sol.join('<br>'), which === 'between' ? ['Use your table of perfect squares: find the one just below and the one just above the number.', 'The root is between the square roots of those two perfect squares.'] : ['Which perfect square is the number nearer? The root is closer to that square’s root.', 'Press 2nd x², type the number, then ) and ENTER. Round to one decimal place.'], label);
  }
  /* "find the missing angle" with a drawn triangle */
  function missAngle(r, kind, o) {
    o = o || {};
    var A, B, C, lab = {}, right = null, ticks = null, ans, bad, sol, hints, x, k;
    if (kind === 'scalene') {
      var v = find(function () { return [r.int(25, 85), r.int(25, 85)]; }, function (v) { var c = 180 - v[0] - v[1]; return c >= 20 && v[0] !== v[1] && c !== v[0] && c !== v[1] && Math.abs(c - 90) > 4 && !(v[0] === 62 && v[1] === 71) && !(v[0] === 71 && v[1] === 62) && (!o.obtuse || c > 92) && (o.obtuse || c < 88); }, [54, 81]);
      A = v[0]; B = v[1]; C = 180 - A - B; lab = { A: dg0(A), B: dg0(B), C: 'x' }; ans = C;
      bad = [[A + B, 'u7l1-add-angles', 'The <b>three</b> angles add to 180°, so subtract the two you know from 180°.'], [360 - A - B, 'u7l1-360', 'The angles in a triangle add to <b>180°</b> (a straight line), not 360°.']];
      sol = br([t('x+' + dg(A) + '+' + dg(B) + '=180^\\circ'), t('x=180^\\circ-' + dg(A) + '-' + dg(B) + '=' + dg(C)), 'Check: ' + t(A + '+' + B + '+' + C + '=180') + ' ✓']);
      hints = ['The three angles of a triangle add up to 180°.', 'Missing angle = 180° − (the two angles you know).'];
    } else if (kind === 'right') {
      x = find(function () { return r.int(22, 68); }, function (x) { return x !== 45 && x !== 28 && x !== 62; }, 41);
      if (o.rightAt === 'B') { A = x; B = 90; lab = { A: dg0(x), C: 'x' }; right = 'B'; } else { A = 90; B = x; lab = { B: dg0(x), C: 'x' }; right = 'A'; }
      C = 90 - x; ans = C;
      bad = [[180 - x, 'u7l1-no-right', 'Don’t forget the right angle: the little square is 90°. The other two angles add to 90°.'], [90 + x, 'u7l1-add-angles', 'Subtract: the two acute angles of a right triangle add to 90°.'], [x, 'u7l1-angles', 'The two acute angles are only equal when they are both 45°. Subtract from 90°.']];
      sol = br(['Right triangle, so the other two angles add up to 90°:', t('x=90^\\circ-' + dg(x) + '=' + dg(C)), '(Or ' + t('180^\\circ-90^\\circ-' + dg(x) + '=' + dg(C)) + '.)']);
      hints = ['The small square marks a 90° angle.', 'In a right triangle the other two angles add up to 90°.'];
    } else if (kind === 'apex') {
      k = find(function () { return r.int(8, 50) * 2; }, function (k) { return k !== 110 && k !== 50 && k !== 60 && k !== 90; }, 36);
      A = B = (180 - k) / 2; C = k; lab = { A: 'x', B: 'y', C: dg0(k) }; ticks = { BC: 1, CA: 1 }; ans = A;
      bad = [[180 - k, 'u7l1-no-half', t('180^\\circ-' + dg(k) + '=' + dg(180 - k)) + ' is what the <b>two</b> bottom angles share. Divide by 2.'], [k, 'u7l1-apex-equal', 'The equal angles are the two across from the equal sides (the two at the bottom), not the top one.'], [180 - 2 * k, 'u7l1-apex-equal', 'The top angle is the one that is different. Subtract it from 180°, then halve.']];
      sol = br(['Isosceles: the two bottom angles are equal (across from the equal sides).', t('180^\\circ-' + dg(k) + '=' + dg(180 - k)), t(dg(180 - k) + '\\div 2=' + dg(A)), t('x=y=' + dg(A))]);
      hints = ['The tick marks show the two equal sides. The angles across from them are equal.', 'Subtract the top angle from 180°, then share what is left between the two equal angles.'];
    } else if (kind === 'base') {
      k = find(function () { return r.int(30, 80); }, function (k) { return k !== 65 && k !== 35 && k !== 60; }, 52);
      A = B = k; C = 180 - 2 * k; lab = { A: dg0(k), C: 'x' }; ticks = { BC: 1, CA: 1 }; ans = C;
      bad = [[180 - k, 'u7l1-one-base', 'The other bottom angle is also ' + dg0(k) + ' (isosceles). Subtract <b>both</b> from 180°.'], [k, 'u7l1-apex-equal', 'The top angle is not one of the equal angles. The two <b>bottom</b> angles are equal.'], [(180 - k) / 2, 'u7l1-no-half', 'The two equal angles are the bottom ones: ' + dg0(k) + ' and ' + dg0(k) + '. Subtract both from 180°.']];
      sol = br(['The other bottom angle is also ' + D(k) + '.', t('x=180^\\circ-' + dg(k) + '-' + dg(k)), t('x=' + dg(C))]);
      hints = ['The tick marks show the two equal sides, so the two bottom angles are equal.', 'Subtract both bottom angles from 180°.'];
    } else { // equilateral
      var where = r.pick(['A', 'B', 'C']); A = B = 60; lab = {}; lab[where] = 'x'; ticks = { AB: 1, BC: 1, CA: 1 }; ans = 60;
      bad = [[180, 'u7l1-add-angles', 'All three angles together make 180°. Each one is a third of that.'], [90, 'u7l1-angles', 'There is no right angle here. All three sides are equal, so all three angles are equal.'], [120, 'u7l1-angles', 'All three angles are equal and add to 180°: divide by 3.']];
      sol = br(['Equilateral: all three sides are equal, so all three angles are equal.', t('x=180^\\circ\\div 3=60^\\circ')]);
      hints = ['The tick marks show that all three sides are equal.', 'Three equal angles add up to 180°.'];
    }
    var fig = triSVG({ A: A, B: B, lab: lab, right: right, ticks: ticks, width: 260 });
    return { fig: fig, ans: ans, bad: bad, sol: sol, hints: hints, txt: kind + ' ' + A + ',' + B };
  }
  function angleQ(r, prompt, kind, o) { var m = missAngle(r, kind, o); return angP(prompt + '<br>' + m.fig, m.ans, m.bad, { sol: m.sol, hints: m.hints, text: m.txt }); }

  /* triangles for naming */
  var TRIPLES = [[5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];
  function lawSides(angs, small) { var sn = angs.map(function (a) { return Math.sin(a * RAD); }), m = Math.min.apply(null, sn); return sn.map(function (x) { return rd(x / m * small, 1); }); }
  function makeTri(r, kind) {
    var u = r.pick(['cm', 'm']), angs, sides;
    if (kind === 'equi') { var s0 = pickNot(r, range(3, 12), [5]); angs = [60, 60, 60]; sides = [s0, s0, s0]; }
    else if (kind === 'isoR') { var l = pickNot(r, range(3, 12), [6]); angs = [45, 45, 90]; sides = [l, l, rd(l * Math.SQRT2, 1)]; }
    else if (kind === 'isoA' || kind === 'isoO') { var ap = kind === 'isoA' ? pickNot(r, range(20, 80, 2), [40, 60]) : r.pick(range(100, 140, 2)), bs = (180 - ap) / 2, leg = r.int(4, 12); angs = [bs, bs, ap]; sides = [leg, leg, rd(2 * leg * Math.sin(ap / 2 * RAD), 1)]; if (sides[2] < leg) sides = [sides[2], leg, leg]; }
    else if (kind === 'scaR2') { var A1 = pickNot(r, range(15, 75, 5), [45]); angs = [A1, 90 - A1, 90]; sides = lawSides(angs, r.int(3, 8)); }
    else if (kind === 'scaR') { var tr = r.pick(TRIPLES), A0 = Math.round(Math.atan(tr[0] / tr[1]) / RAD); angs = [A0, 90 - A0, 90]; sides = tr.slice(); u = 'cm'; }
    else {
      var v = find(function () { return kind === 'scaO' ? [r.int(15, 45), r.int(15, 45)] : [r.int(40, 80), r.int(40, 80)]; }, function (v) { var c = 180 - v[0] - v[1]; return v[0] < v[1] && v[1] - v[0] >= 6 && Math.abs(c - v[1]) >= 6 && Math.abs(c - v[0]) >= 6 && (kind === 'scaO' ? c >= 100 && c <= 150 : c < 85 && c > v[1]) && !(v[0] === 25 && v[1] === 48); }, kind === 'scaO' ? [22, 38] : [50, 60]);
      angs = [v[0], v[1], 180 - v[0] - v[1]]; sides = lawSides(angs, r.int(3, 8));
    }
    var bySide = kind === 'equi' ? 'equilateral' : /^iso/.test(kind) ? 'isosceles' : 'scalene', byAng = angs[2] === 90 ? 'right' : angs[2] > 90 ? 'obtuse' : 'acute';
    var sideT = sides.slice().sort(function (a, b) { return a - b; }).map(function (x) { return N(x) + ' ' + u; }).join(', '), angT = angs.slice().sort(function (a, b) { return a - b; }).map(dg0).join(', ');
    var leg = sides.filter(function (x, i) { return sides.indexOf(x) !== i; })[0];
    return { kind: kind, angs: angs, sides: sides, leg: leg, u: u, bySide: bySide, byAng: byAng, sideT: sideT, angT: angT };
  }
  function triRows(r) {
    var kinds = [['equi'], ['scaR', 'isoR'], ['isoO', 'isoA'], ['scaA'], ['scaO']].map(function (g) { return r.pick(g); });
    if (r.chance(0.5)) kinds = [kinds[0]].concat(r.shuffle(kinds.slice(1)));
    return kinds.map(function (k) { return makeTri(r, k); });
  }
  var SIDE_RULE = { equilateral: 'all 3 sides equal', isosceles: 'exactly 2 sides equal', scalene: 'no sides equal' }, ANG_RULE = { acute: 'all 3 angles less than 90°', right: 'one angle exactly 90°', obtuse: 'one angle more than 90°' };
  function nameGrid(rows, which) {
    var L = 'abcde', cols = which === 'sides' ? ['equilateral', 'isosceles', 'scalene'] : ['acute', 'right', 'obtuse'], want = {};
    rows.forEach(function (x, i) { want[L[i]] = which === 'sides' ? x.bySide : x.byAng; });
    var rr = rows.map(function (x, i) { return { id: L[i], html: '(' + L[i] + ') ' + x.sideT + ' &nbsp;·&nbsp; ' + x.angT }; });
    var p = P.grid('Name each triangle by its <b>' + which + '</b>.', rr, cols.map(function (c) { return { id: c, html: c }; }), want, {
      count: true, why: function (row, got, w) {
        var x = rows[L.indexOf(row)];
        if (which === 'sides') return { code: 'u7l1-sides', hint: 'Row (' + row + '): count the equal side lengths (' + x.sideT + '). ' + cap(w) + ' means ' + SIDE_RULE[w] + '.' };
        return { code: 'u7l1-angles', hint: 'Row (' + row + '): look at the <b>biggest</b> angle (' + dg0(Math.max.apply(null, x.angs)) + '). ' + cap(w) + ' means ' + ANG_RULE[w] + '.' };
      } },
      rows.map(function (x, i) { return '(' + L[i] + ') ' + (which === 'sides' ? x.bySide + ' (' + x.sideT + ')' : x.byAng + ' (biggest angle ' + dg0(Math.max.apply(null, x.angs)) + ')'); }).join('<br>'),
      [which === 'sides' ? 'Count the equal sides: 3 equal → equilateral, 2 → isosceles, none → scalene.' : 'Look at the biggest angle: 90° → right, more than 90° → obtuse, otherwise acute.'], 'name by ' + which + ' ' + rows.map(function (x) { return x.kind; }).join(','));
    return p;
  }

  /* always / sometimes / never */
  var ASN = {
    never: [
      { s: 'A triangle has two right angles.', R: { never: 'two right angles already make 180°, leaving 0° for the third angle.', sometimes: 'it can happen when the third angle is very small.', always: 'every triangle has at least two right angles.' }, H: 'Add two right angles. What is left of 180° for the third angle?' },
      { s: 'A triangle has two obtuse angles.', R: { never: 'two angles over 90° already add to more than 180°.', sometimes: 'a long, flat triangle can have two obtuse angles.', always: 'every triangle has two angles over 90°.' }, H: 'Two obtuse angles are each more than 90°. What do they add to?' },
      { s: 'A right triangle has an obtuse angle.', R: { never: 'the right angle uses 90°, so the other two angles add to 90° and each is less than 90°.', sometimes: 'when its hypotenuse is very long.', always: 'its right angle is an obtuse angle.' }, H: 'The other two angles of a right triangle add up to 90°. Can either one be more than 90°?' },
      { s: 'An equilateral triangle has a right angle.', R: { never: 'all three angles of an equilateral triangle are 60°.', sometimes: 'when it is a big triangle.', always: 'its angles are all 90°.' }, H: 'An equilateral triangle has three equal angles that add to 180°. How big is each one?' }],
    sometimes: [
      { s: 'A right triangle is also isosceles.', R: { sometimes: 'yes for a 45°-45°-90° triangle (two equal legs); no for a 30°-60°-90° triangle.', always: 'the two legs of a right triangle are always equal.', never: 'a right triangle can never have two equal sides.' }, H: 'Think of a 45°-45°-90° triangle, then a 30°-60°-90° triangle.' },
      { s: 'An isosceles triangle is obtuse.', R: { sometimes: 'a 30°-30°-120° triangle is; a 70°-70°-40° triangle is not.', always: 'the angle between the equal sides is always more than 90°.', never: 'two equal angles can never leave room for an obtuse angle.' }, H: 'Try a 30°-30°-120° triangle, then a 70°-70°-40° triangle. Are both isosceles?' },
      { s: 'A scalene triangle has a right angle.', R: { sometimes: 'a 30°-60°-90° triangle does; a 50°-60°-70° triangle does not.', always: 'every scalene triangle has one 90° angle.', never: 'a right triangle always has two equal sides.' }, H: 'Try a 30°-60°-90° triangle, then a 50°-60°-70° triangle. Are both scalene?' },
      { s: 'An obtuse triangle is isosceles.', R: { sometimes: 'a 25°-25°-130° triangle is; a 20°-40°-120° triangle is not.', always: 'the two small angles of an obtuse triangle are always equal.', never: 'an isosceles triangle can never have an angle over 90°.' }, H: 'Try a 25°-25°-130° triangle, then a 20°-40°-120° triangle.' }],
    always1: [
      { s: 'An equilateral triangle is acute.', R: { always: 'all three angles are 60°, which is less than 90°.', sometimes: 'only when its sides are short.', never: 'its angles are all bigger than 90°.' }, H: 'How big is each angle of an equilateral triangle? Compare it with 90°.' },
      { s: 'The two acute angles of a right triangle add up to 90°.', R: { always: 'the right angle uses 90° of the 180°, leaving 90° for the other two.', sometimes: 'only when the two acute angles are equal.', never: 'they always add up to 180°.' }, H: '180° − 90° = ? That is what is left for the other two angles.' },
      { s: 'A triangle has at least two acute angles.', R: { always: 'if two angles were 90° or more, they would already use up 180° or more.', sometimes: 'only acute triangles have two acute angles.', never: 'a triangle has only one acute angle.' }, H: 'Could a triangle have two angles of 90° or more? What would they add to?' }],
    always2: [
      { s: 'In a right triangle, the hypotenuse is the longest side.', R: { always: 'the hypotenuse is across from the biggest angle (the 90° angle), so it is the longest side.', sometimes: 'only when the triangle sits with the hypotenuse on the bottom.', never: 'the legs are always longer.' }, H: 'The longest side is across from the biggest angle. Which angle is the biggest in a right triangle?' },
      { s: 'The three angles of a triangle add up to 180°.', R: { always: 'the three corners always fit together to make a straight line, 180°.', sometimes: 'only for right triangles.', never: 'they add up to 360°.' }, H: 'Tear the three corners off a paper triangle and put them side by side. What do they make?' },
      { s: 'In a right triangle, the hypotenuse is across from the right angle.', R: { always: 'that is what “hypotenuse” means: the side opposite the 90° angle.', sometimes: 'only when the right angle is at the bottom.', never: 'the hypotenuse always touches the right angle.' }, H: 'Put your finger on the little square and slide straight across. Which side do you land on?' }]
  };
  function asnPart(r, pool, ans) {
    var it = r.pick(ASN[pool]);
    var opts = ['always', 'sometimes', 'never'].map(function (w) { return { html: '<b>' + cap(w) + '</b>: ' + it.R[w], right: w === ans, why: w === ans ? null : it.H, code: 'u7l1-asn-' + w }; });
    var p = P.mc(r, it.s + '<br>Always, sometimes or never? Choose the answer with the right reason.', opts, '<b>' + cap(ans) + '</b>: ' + it.R[ans], ['Try a few triangles. If it works for some and not others, it is “sometimes”.'], 'asn ' + it.s, true);
    p.input.columns = 1;
    return p;
  }

  /* naming the sides of a right triangle */
  var LETTERS = [['D', 'E', 'F'], ['G', 'H', 'K'], ['S', 'T', 'U'], ['J', 'K', 'L'], ['U', 'V', 'W'], ['A', 'B', 'C'], ['R', 'S', 'T']];
  function sideNm(set, i) { var o = [0, 1, 2].filter(function (j) { return j !== i; }); return set[o[0]] + set[o[1]]; }
  function letterChk(want, set, other) {
    var lows = set.map(function (x) { return x.toLowerCase(); });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/^\s*side\s*/i, '').replace(/[\s.]/g, '');
      if (!s) return form('empty', 'Type a small letter.');
      if (s === want) return ok();
      if (s.length !== 1) return form('u7l1-one-letter', 'Type <b>one small letter</b> (the letter of the vertex across from the side).');
      if (s === want.toUpperCase()) return form('u7l1-capital', 'Use a <b>small</b> letter for a side (a capital letter names a vertex).');
      if (other && lows.indexOf(s.toLowerCase()) >= 0) return wrong('u7l1-leg-as-hyp', other(s.toLowerCase()));
      if (lows.indexOf(s.toLowerCase()) >= 0) return wrong('u7l1-letter-touch', 'That vertex is at one <b>end</b> of the side. A side gets the small letter of the vertex <b>across</b> from it (the one it doesn’t touch).');
      return wrong('value', 'Use the letters of this triangle: ' + lows.join(', ') + '.');
    };
  }
  function segChk(i, set, rightIdx) {
    var want = sideNm(set, i);
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|overline)\{([^{}]*)\}/g, '$1').replace(/^\s*side\s*/i, '').replace(/[\s.]/g, '').toUpperCase();
      if (!s) return form('empty', 'Type the two capital letters at the ends of the side.');
      if (s.length !== 2) return form('u7l1-two-letters', 'Name the side with the <b>two capital letters</b> at its ends, like ' + want + '.');
      if (s === want || s === want.split('').reverse().join('')) return ok();
      if (s.indexOf(set[rightIdx]) >= 0 && i === rightIdx) return wrong('u7l1-leg-as-hyp', 'That side touches the right angle at ' + set[rightIdx] + ', so it is a <b>leg</b>. The hypotenuse is the side across from the right angle.');
      return wrong('u7l1-letter-touch', 'Name the side by its two <b>end points</b>. The side across from ' + set[i] + ' joins the other two vertices.');
    };
  }
  function nameShared(r, fixed) {
    var set = fixed ? fixed.set : r.pick(LETTERS), ri = fixed ? fixed.ri : r.int(0, 2), tr = r.pick([[9, 12, 15], [5, 12, 13], [8, 15, 17], [20, 21, 29], [7, 24, 25], [12, 16, 20], [10, 24, 26]]);
    var oth = [0, 1, 2].filter(function (j) { return j !== ri; }), sw = r.chance(0.5);
    var len = {}; len[ri] = tr[2]; len[oth[0]] = sw ? tr[0] : tr[1]; len[oth[1]] = sw ? tr[1] : tr[0];
    return { set: set, ri: ri, oth: oth, len: len, rot: r.pick([0, 0, 90, 180, 270, 35, -30, 150]), fig: null };
  }
  function nameFig(sh) { return namedTri(sh.set, sh.ri, [sh.len[sh.oth[0]], sh.len[sh.oth[1]]], sh.rot); }
  function rtName(sh) { return '△' + sh.set.join('') + ' has its right angle at ' + sh.set[sh.ri] + '.'; }
  function lettersPart(sh) {
    var specs = [0, 1, 2].map(function (i) { return { label: 'Side ' + sideNm(sh.set, i) + ':', name: 'Side ' + sideNm(sh.set, i), mode: 'text', chk: letterChk(sh.set[i].toLowerCase(), sh.set), key: sh.set[i].toLowerCase(), show: '<i>' + sh.set[i].toLowerCase() + '</i>' }; });
    var p = fieldsPart('Label each side with a small letter.<br>' + nameFig(sh), specs, 'Each side gets the small letter of the vertex across from it:<br>' + [0, 1, 2].map(function (i) { return 'side ' + sideNm(sh.set, i) + ' is across from ' + sh.set[i] + ', so it is <i>' + sh.set[i].toLowerCase() + '</i>'; }).join('<br>'),
      ['A side is named with the small letter of the vertex it does <b>not</b> touch.'], 'letters ' + sh.set.join('') + sh.ri);
    p.bad = [specs.map(function (s, i) { return specs[(i + 1) % 3].key; })];
    return p;
  }
  function hypPart(sh, prompt) {
    var h = sh.ri, hl = sh.set[h].toLowerCase();
    var p = fieldsPart(prompt || 'The hypotenuse is side ___, also called side ___.', [{ label: 'Small letter:', name: 'Small letter', mode: 'text', chk: letterChk(hl, sh.set, function (x) { return 'Side <i>' + x + '</i> is across from ' + x.toUpperCase() + '. It touches the right angle at ' + sh.set[h] + ', so it is a leg. The hypotenuse gets the small letter of the right-angle vertex, ' + sh.set[h] + '.'; }), key: hl, show: '<i>' + hl + '</i>' }, { label: 'Two capital letters:', name: 'Two capital letters', mode: 'text', chk: segChk(h, sh.set, sh.ri), key: sideNm(sh.set, h), show: sideNm(sh.set, h) }],
      'The hypotenuse is across from the right angle at ' + sh.set[h] + ': side <i>' + hl + '</i>, which joins ' + sh.set[sh.oth[0]] + ' and ' + sh.set[sh.oth[1]] + ' (side ' + sideNm(sh.set, h) + ').', ['Put your finger on the right angle and slide straight across the triangle.'], 'hyp ' + sh.set.join('') + sh.ri);
    p.bad = [[sh.set[sh.oth[0]].toLowerCase(), sideNm(sh.set, sh.oth[0])]];
    return p;
  }
  function legsPart(r, sh, prompt) {
    var a = sh.oth[0], b = sh.oth[1], h = sh.ri, lw = function (i) { return '<i>' + sh.set[i].toLowerCase() + '</i>'; };
    var opts = [{ html: lw(a) + ' and ' + lw(b) + ' (sides ' + sideNm(sh.set, a) + ' and ' + sideNm(sh.set, b) + ')', right: true },
      { html: lw(a) + ' and ' + lw(h) + ' (sides ' + sideNm(sh.set, a) + ' and ' + sideNm(sh.set, h) + ')', why: 'Side ' + lw(h) + ' is across from the right angle: it is the hypotenuse, not a leg.', code: 'u7l1-leg-as-hyp' },
      { html: lw(b) + ' and ' + lw(h) + ' (sides ' + sideNm(sh.set, b) + ' and ' + sideNm(sh.set, h) + ')', why: 'Side ' + lw(h) + ' is across from the right angle: it is the hypotenuse, not a leg.', code: 'u7l1-leg-as-hyp' },
      { html: sh.set[a] + ' and ' + sh.set[b], why: sh.set[a] + ' and ' + sh.set[b] + ' are vertices (corners), not sides. The legs are the two sides that make the right angle.', code: 'u7l1-capital' }];
    return P.mc(r, prompt || 'The legs are…', opts, 'The legs are the two sides that make the right angle at ' + sh.set[h] + ': ' + lw(a) + ' (' + sideNm(sh.set, a) + ') and ' + lw(b) + ' (' + sideNm(sh.set, b) + ').', ['The legs both touch the right angle.'], 'legs ' + sh.set.join('') + sh.ri);
  }
  function hypLenPart(sh, prompt) {
    var h = sh.ri, list = r3(sh), ans = sh.len[h];
    return numP(prompt || (list + ' How long is the hypotenuse?'), ans, [[sh.len[sh.oth[0]], 'u7l1-leg-as-hyp', 'Side ' + sideNm(sh.set, sh.oth[0]) + ' touches the right angle, so it is a leg. The hypotenuse is ' + sideNm(sh.set, h) + ', across from the right angle (and the longest side).'], [sh.len[sh.oth[1]], 'u7l1-leg-as-hyp', 'Side ' + sideNm(sh.set, sh.oth[1]) + ' touches the right angle, so it is a leg. The hypotenuse is ' + sideNm(sh.set, h) + ', across from the right angle (and the longest side).']],
      { after: 'cm', sol: 'The hypotenuse is ' + sideNm(sh.set, h) + ' (across from the right angle at ' + sh.set[h] + '): ' + t(N(ans) + '\\text{ cm}') + '. It is the longest side ✓', hints: ['Which side is across from the right angle?'], text: 'hyp length ' + list });
  }
  function r3(sh) { return r3order(sh).map(function (i) { return sideNm(sh.set, i) + ' = ' + sh.len[i] + ' cm'; }).join(', ') + '.'; }
  function r3order(sh) { return [0, 1, 2].slice().sort(function (a, b) { return sideNm(sh.set, a) < sideNm(sh.set, b) ? -1 : 1; }); }

  /* the sketch (choose the right picture) and the other acute angle */
  var SCENES = [
    { stem: function (g) { return 'A guy wire runs from the top of a radio tower that stands straight up to a stake in the level ground. The wire makes a ' + dg0(g) + ' angle with the ground.'; }, names: { vert: 'tower', base: 'ground', hyp: 'wire' }, what: 'the wire', with: 'the tower' },
    { stem: function (g) { return 'A support cable runs from the top of a flagpole that stands straight up to a peg in the level ground. The cable makes a ' + dg0(g) + ' angle with the ground.'; }, names: { vert: 'flagpole', base: 'ground', hyp: 'cable' }, what: 'the cable', with: 'the flagpole' },
    { stem: function (g) { return 'A brace runs from the top of a fence post that stands straight up to the level ground. The brace makes a ' + dg0(g) + ' angle with the ground.'; }, names: { vert: 'post', base: 'ground', hyp: 'brace' }, what: 'the brace', with: 'the post' },
    { stem: function (g) { return 'A ladder leans against the side of a shed. The ground is level and the wall is straight up. The ladder makes a ' + dg0(g) + ' angle with the ground.'; }, names: { vert: 'wall', base: 'ground', hyp: 'ladder' }, what: 'the ladder', with: 'the wall', ladder: true }];
  function sketchPart(r, sc, g) {
    var opts = [{ rightAt: 'bottom', hypOn: 'hyp', right: true },
      { rightAt: 'bottom', hypOn: 'vert', why: 'The hypotenuse is across from the right angle. The ' + sc.names.vert + ' touches the right angle, so it is a leg.', code: 'u7l1-leg-as-hyp' },
      { rightAt: 'top', hypOn: 'base', why: 'The ' + sc.names.vert + ' stands straight up from level ground, so the right angle is where the ' + sc.names.vert + ' meets the ground.', code: 'u7l1-right-where' },
      { rightAt: 'foot', hypOn: 'vert', why: 'The angle at the foot is ' + dg0(g) + ', not 90°. The right angle is where the ' + sc.names.vert + ' meets the ground.', code: 'u7l1-right-where' }];
    var p = P.mc(r, 'Which sketch shows the right angle and the hypotenuse correctly?', opts.map(function (o) { return { html: sceneSVG({ g: g, names: sc.names, rightAt: o.rightAt, hypOn: o.hypOn, width: 250 }), right: !!o.right, why: o.why, code: o.code }; }),
      'The right angle is where the ' + sc.names.vert + ' meets the level ground. ' + cap(sc.what) + ' is across from it, so ' + sc.what + ' is the hypotenuse; the ' + sc.names.vert + ' and the ground are the legs.', ['Something that stands straight up on level ground makes a square corner (90°) with the ground.'], 'sketch ' + sc.names.hyp + ' ' + g);
    p.input.columns = 2;
    return p;
  }
  function otherAngPart(sc, g) {
    var a = 90 - g;
    return angP('What angle does ' + sc.what + ' make with ' + sc.with + '?', a, [[180 - g, 'u7l1-no-right', 'Use the right angle: the two other angles of a right triangle add to <b>90°</b>. ' + t('90^\\circ-' + dg(g)) + '.'], [g, 'u7l1-gave-ground', 'That is the angle with the ground (given). Find the angle at the top, with ' + sc.with + '.'], [90 + g, 'u7l1-add-angles', 'Subtract: the two acute angles add up to 90°.'], [90, 'u7l1-gave-right', 'The 90° angle is between ' + sc.with + ' and the ground. Find the angle between ' + sc.what + ' and ' + sc.with + '.']],
      { sol: br(['Right triangle, so the two other angles add to 90°:', t('90^\\circ-' + dg(g) + '=' + dg(a)), cap(sc.what) + ' makes a ' + D(a) + ' angle with ' + sc.with + '.']), hints: ['The ' + sc.names.vert + ' and the ground make a right angle.', 'The two other angles add up to 90°.'], text: 'other angle ' + g });
  }

  /* "name the triangle" MC (extra A5) */
  function nameMC(r, kind) {
    var x = makeTri(r, kind), s = x.bySide, a = x.byAng, prompt;
    var angT = x.angs.slice().sort(function (p, q2) { return p - q2; }).map(dg0).join(', ');
    if (/^iso/.test(kind)) prompt = 'Two sides are ' + N(x.leg) + ' ' + x.u + ' long. Its angles are ' + angT + '.';
    else prompt = 'Its angles are ' + angT + '.';
    var sAlt = s === 'scalene' ? 'isosceles' : 'scalene', aAlt = a === 'acute' ? (r.chance(0.5) ? 'right' : 'obtuse') : 'acute';
    var opts = [{ html: s + ', ' + a, right: true },
      { html: sAlt + ', ' + a, why: s === 'scalene' ? 'No two angles are equal, so no two sides are equal: scalene.' : 'Two equal sides (and two equal angles): isosceles.', code: 'u7l1-sides' },
      { html: s + ', ' + aAlt, why: 'Look at the biggest angle (' + dg0(Math.max.apply(null, x.angs)) + '). ' + cap(a) + ' means ' + ANG_RULE[a] + '.', code: 'u7l1-angles' },
      { html: sAlt + ', ' + aAlt, why: 'Check both names: count the equal sides (or equal angles), and look at the biggest angle.', code: 'u7l1-both' }];
    return P.mc(r, 'Name the triangle by its sides and by its angles.<br>' + prompt, opts, (s === 'scalene' ? 'No equal angles, so no equal sides: <b>scalene</b>. ' : 'Two equal sides: <b>isosceles</b>. ') + 'The biggest angle is ' + dg0(Math.max.apply(null, x.angs)) + ': <b>' + a + '</b>.', ['Equal angles go with equal sides.', 'The biggest angle decides acute, right or obtuse.'], 'name mc ' + angT);
  }

  /* a list of whole numbers (extra C15) */
  function listChk(want, a, mid2, hi2, lo2, up) {
    return function (resp) {
      if (!resp || !resp.length) return form('empty', 'Add the whole numbers one at a time (press Enter or comma after each).');
      var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + resp[i] + ' more than once.'); seen[resp[i]] = 1; }
      var extra = resp.filter(function (x) { return want.indexOf(x) < 0; }), missing = want.filter(function (x) { return resp.indexOf(x) < 0; });
      if (!extra.length && !missing.length) return ok();
      var e = extra[0];
      if (e === lo2 || e === hi2) return wrong('u7l1-endpoint', t('\\sqrt{' + e + '}=' + Math.round(Math.sqrt(e))) + ' exactly, a whole number, so it is not <b>between</b> ' + a + ' and ' + (a + 1) + '.');
      if (e != null && e > lo2 && e < hi2) return wrong('u7l1-halfway', t('\\sqrt{' + e + '}=' + raw3(Math.sqrt(e))) + ', which is closer to ' + (up ? a : a + 1) + '. Halfway is ' + (a + 0.5) + ', and ' + t((a + 0.5) + '^2=' + mid2) + '.');
      if (e != null) return wrong('value', t('\\sqrt{' + e + '}') + ' is not between ' + a + ' and ' + (a + 1) + ': ' + t(a + '^2=' + lo2) + ' and ' + t((a + 1) + '^2=' + hi2) + '.');
      return wrong('u7l1-list-missing', 'You have ' + (want.length - missing.length) + ' of the ' + want.length + ' numbers. Check every whole number from ' + (up ? Math.ceil(mid2) : lo2 + 1) + ' to ' + (up ? hi2 - 1 : Math.floor(mid2)) + '.');
    };
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u7l1', unit: 7, num: '1', title: 'Squares, Square Roots and Triangle Basics', outcome: 'REV',
    blurb: 'Squares and square roots (exact and to the nearest tenth), estimating a root, the angles of a triangle, naming triangles, and the parts of a right triangle.',
    questions: [
      { num: '1', stem: 'Find each square.', parts: [
        { id: '1a', sub: 'a–f', level: 'BEG', make: function (r) {
          var v = [pickNot(r, range(2, 9), [6, 9, 2, 3, 4]), pickNot(r, range(11, 15), [12]), r.pick([1, 11]), r.pick([10, 100]), pickNot(r, range(30, 90, 10), [20]), pickNot(r, range(0.2, 0.9, 0.1), [0.3])];
          if (v[2] === v[1]) v[2] = 1;
          var L = 'abcdef', specs = v.map(function (n, i) { return sqSpec('(' + L[i] + ') ' + t(N(n) + '^2='), n); });
          return fieldsPart('(a) to (f): no calculator needed.', specs, v.map(function (n, i) { return '(' + L[i] + ') ' + t(N(n) + '\\times ' + N(n) + '=' + N(q(n * n))); }).join('<br>'), ['Multiply the number by itself: ' + t('n^2=n\\times n') + '.', 'For a decimal, count the decimal places: ' + t('0.5\\times 0.5') + ' has 2 decimal places.'], 'squares ' + v.join(','));
        } },
        { id: '1b', sub: 'g–l', level: 'EMG', make: function (r) {
          var v = [pickNot(r, range(13, 29), [20, 12, 14, 15]), pickNot(r, range(1.1, 4.9, 0.1).filter(function (x) { return decs(x) === 1; }), [1.5, 2.4, 3.5, 2.5]), pickNot(r, range(0.2, 0.9, 0.1), [0.3]), pickNot(r, range(21, 39), [30, 25]), r.pick([1.25, 1.75, 2.25, 2.75, 3.25, 0.75]), pickNot(r, [2.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5], [3.5, 1.5])];
          var L = 'ghijkl', specs = v.map(function (n, i) { return sqSpec('(' + L[i] + ') ' + t(N(n) + '^2='), n); });
          return fieldsPart('(g) to (l): use your calculator (number, then <b>x²</b>, then <b>ENTER</b>).', specs, v.map(function (n, i) { return '(' + L[i] + ') ' + t(N(n) + '\\times ' + N(n) + '=' + N(q(n * n))); }).join('<br>'), ['Type the number, press x², then ENTER.', 'Give every digit: these squares end.'], 'squares calc ' + v.join(','));
        } }] },
      { num: '2', stem: '', shared: function (r) {
          var sq = r.sample([16, 25, 36, 49, 81, 121, 144, 196, 225], 4), non = r.sample([24, 30, 45, 60, 90, 99, 120, 150, 200, 250, 1000, 48, 80, 63], 4);
          return { sq: sq, non: non, all: sq.concat(non).sort(function (a, b) { return a - b; }) };
        }, parts: [
        { id: '2a', level: 'BEG', make: function (r, sh) {
          var want = sh.sq.slice().sort(function (a, b) { return a - b; });
          return { prompt: 'Tap the numbers that are <b>perfect squares</b>.', input: { type: 'select', options: sh.all.map(function (n) { return { value: n, html: t(N(n)) }; }) },
            check: K.selectSet(want, function (extra, missing) {
              if (extra.length) { var e = extra[0], a = Math.floor(Math.sqrt(e)); return { code: 'u7l1-not-square', hint: N(e) + ' is not a perfect square: ' + t(a + '^2=' + N(a * a)) + ' and ' + t((a + 1) + '^2=' + N((a + 1) * (a + 1))) + ', and no whole number is between ' + a + ' and ' + (a + 1) + '.' }; }
              return { code: 'u7l1-missed-square', hint: 'One more is a perfect square: ' + t(Math.sqrt(missing[0]) + '\\times ' + Math.sqrt(missing[0]) + '=' + missing[0]) + '. Check your table of perfect squares.' };
            }), key: want, answer: want.map(function (n) { return t(N(n)); }).join(', '),
            solution: 'Perfect squares: ' + want.map(function (n) { return t(N(n) + '=' + Math.sqrt(n) + '^2'); }).join(', ') + '.', hints: ['A perfect square is a whole number times itself. Use your table of squares up to ' + t('15^2=225') + '.'], text: 'perfect squares ' + sh.all.join(',') };
        } },
        { id: '2b', level: 'EMG', make: function (r, sh) {
          var m = r.pick(sh.non.filter(function (n) { return n < 1000; }).concat(sh.non.length ? [] : [90])) || sh.non[0], a = Math.floor(Math.sqrt(m));
          var opts = [{ html: t(a + '^2=' + N(a * a)) + ' and ' + t((a + 1) + '^2=' + N((a + 1) * (a + 1))) + ', and there is no whole number between ' + a + ' and ' + (a + 1) + '.', right: true },
            { html: N(m) + (m % 2 ? ' is odd' : ' is even') + ', and perfect squares can’t be ' + (m % 2 ? 'odd' : 'even') + '.', why: 'Some perfect squares are even (' + t('16=4^2') + ') and some are odd (' + t('25=5^2') + ').', code: 'u7l1-even-odd' },
            { html: t(N(m) + '\\div 2=' + N(m / 2)) + ', and ' + t(N(m / 2) + '\\times 2') + ' isn’t a square.', why: 'A square root is not half the number. Check the perfect squares just below and just above ' + N(m) + '.', code: 'u7l1-half' },
            { html: N(m) + ' ends in ' + (m % 10) + ', and no perfect square ends in ' + (m % 10) + '.', why: (m % 10 === 0 ? t('100=10^2') + ' ends in 0. ' : '') + 'The last digit doesn’t decide it here. Look for whole numbers whose squares are just below and above ' + N(m) + '.', code: 'u7l1-last-digit' }];
          return P.mc(r, N(m) + ' is <b>not</b> a perfect square. How do you know?', opts, t(a + '^2=' + N(a * a)) + ' and ' + t((a + 1) + '^2=' + N((a + 1) * (a + 1))) + '. ' + N(m) + ' is between them, and no whole number is between ' + a + ' and ' + (a + 1) + ', so ' + N(m) + ' is not a whole number squared.', ['Find the perfect squares just below and just above it.'], 'not square ' + m);
        } }] },
      { num: '3', stem: 'Find the area of each square.', parts: [
        { id: '3a', level: 'BEG', make: function (r) {
          var s = pickNot(r, [4.5, 5.5, 6.5, 7.5, 8.5, 9.5], [3.5]), A = q(s * s), it = r.pick(['A square sticky note', 'A square coaster', 'A square tile']);
          return numP('(a) ' + it + ' that is ' + N(s) + ' cm on each side.', A, sqBad(s).concat([[4 * s, 'u7l1-perimeter', 'That is the distance around (4 sides). Area = side × side.']]), { after: 'cm²', sol: t(N(s) + '^2=' + N(s) + '\\times ' + N(s) + '=' + N(A)) + '. The area is ' + t(N(A) + '\\text{ cm}^2') + '.', hints: ['Area of a square = (side)².'], text: 'area ' + s });
        } },
        { id: '3b', level: 'BEG', make: function (r) {
          var s = pickNot(r, range(11, 24), [12, 20]), A = s * s, it = r.pick(['deck', 'patio', 'garage floor']);
          return numP('(b) A square ' + it + ' that is ' + s + ' ft on each side.', A, sqBad(s).concat([[4 * s, 'u7l1-perimeter', 'That is the distance around (4 sides). Area = side × side.']]), { after: 'ft²', sol: t(s + '^2=' + s + '\\times ' + s + '=' + N(A)) + '. The area is ' + t(N(A) + '\\text{ ft}^2') + '.', hints: ['Area of a square = (side)².'], text: 'area ' + s });
        } },
        { id: '3c', level: 'BEG', make: function (r) {
          var s = pickNot(r, range(4.1, 7.9, 0.1).filter(function (x) { return decs(x) === 1 && !same(x * 2, Math.round(x * 2)); }), [3.5]), A = q(s * s), it = r.pick(['boxing ring', 'wrestling mat', 'garden plot']);
          return numP('(c) A square ' + it + ' that is ' + N(s) + ' m on each side.', A, sqBad(s).concat([[4 * s, 'u7l1-perimeter', 'That is the distance around (4 sides). Area = side × side.']]), { after: 'm²', sol: t(N(s) + '^2=' + N(A)) + '. The area is ' + t(N(A) + '\\text{ m}^2') + '.', hints: ['Area of a square = (side)².', 'Give the exact answer the calculator shows.'], text: 'area ' + s });
        } }] },
      { num: '4', stem: 'Find each square root without a calculator.', parts: [
        { id: '4', sub: 'a–f', level: 'BEG', make: function (r) {
          var roots = [pickNot(r, range(5, 9), [6]), pickNot(r, range(11, 15), [13]), r.pick([2, 3, 4]), pickNot(r, [20, 30, 40, 50], []), pickNot(r, range(11, 15), [13]), pickNot(r, range(11, 15), [13])];
          roots[4] = find(function () { return pickNot(r, range(11, 15), [13]); }, function (x) { return x !== roots[1]; }, 11); roots[5] = find(function () { return pickNot(r, range(11, 15), [13]); }, function (x) { return x !== roots[1] && x !== roots[4]; }, 14);
          var L = 'abcdef', specs = roots.map(function (k, i) { return rootSpec('(' + L[i] + ') ' + t('\\sqrt{' + N(k * k) + '}='), k * k); });
          return fieldsPart('Use your table of perfect squares.', specs, roots.map(function (k, i) { return '(' + L[i] + ') ' + t('\\sqrt{' + N(k * k) + '}=' + k) + ' because ' + t(k + '^2=' + N(k * k)); }).join('<br>'), ['Ask: what number times itself gives this?'], 'roots ' + roots.join(','));
        } }] },
      { num: '5', stem: 'Use your calculator. Round each square root to the nearest tenth.', shared: function (r) {
          return { v: [nonSq(r, 13, 30, [20, 12, 27, 18]), nonSq(r, 51, 99, [62, 90]), nonSq(r, 151, 300, [150, 200]), nonSq(r, 2, 11, [8, 3, 6]), find(function () { return pickNot(r, [2.5, 7.5, 10.5, 12.5, 15.5, 17.5, 20.5, 22.5], [6.5]); }, function (x) { return safe(Math.sqrt(x)); }, 12.5)] };
        }, parts: [
        { id: '5a', sub: 'a–e', level: 'EMG', make: function (r, sh) {
          var L = 'abcde', specs = sh.v.map(function (m, i) { return apxSpec('(' + L[i] + ') ' + t('\\sqrt{' + N(m) + '}\\approx'), m); });
          return fieldsPart('Press <b>2nd</b> <b>x²</b> for √, type the number, then <b>)</b> and <b>ENTER</b>.', specs, sh.v.map(function (m, i) { return '(' + L[i] + ') ' + sqrtWork(m); }).join('<br>'), ['Round to one decimal place: look at the hundredths digit.', 'A square root is not half the number.'], 'calc roots ' + sh.v.join(','));
        } },
        { id: '5f', sub: 'f', level: 'EMG', make: function (r, sh) {
          var m = sh.v[1], s1 = rd(Math.sqrt(m), 1), sq = q(s1 * s1);
          return numP('(f) Check your answer to (b): square your rounded answer, ' + t('\\sqrt{' + m + '}\\approx ' + fx(Math.sqrt(m), 1)) + '. What do you get?', sq, [[m, 'u7l1-squared', 'Square the <b>rounded</b> answer, ' + fx(s1, 1) + ', not the exact root (that gives ' + m + ' back).'], [2 * s1, 'u7l1-double', t(fx(s1, 1) + '^2') + ' means ' + t(fx(s1, 1) + '\\times ' + fx(s1, 1)) + '.']],
            { sol: t(fx(s1, 1) + '^2=' + N(sq)) + ', which is close to ' + m + ' ✓', hints: ['Type ' + fx(s1, 1) + ', press x², then ENTER.'], text: 'check ' + m });
        } }] },
      { num: '6', stem: 'Estimate each square root without a calculator. Then check with your calculator (nearest tenth).',
        shared: function (r) { return { v: [nonSq(r, 10, 34, [27, 12, 18]), nonSq(r, 37, 62, [40, 50, 62]), nonSq(r, 65, 99, [90, 80]), nonSq(r, 101, 195, [105, 150, 135])] }; }, parts: [
        { id: '6a', sub: 'a', level: 'EMG', make: function (r, sh) { return estTable('(a) Between which perfect squares is each number? So the square root is between which two whole numbers?', sh.v, 'between', 'estimate between ' + sh.v.join(',')); } },
        { id: '6b', sub: 'b', level: 'PRG', make: function (r, sh) { return estTable('(b) Which whole number is each square root closer to? Then check with your calculator (nearest tenth).', sh.v, 'closer', 'estimate closer ' + sh.v.join(',')); } }] },
      { num: '7', stem: function (sh) { return 'A square ' + sh.what + ' has an area of ' + t(sh.A + '\\text{ m}^2') + '.'; },
        shared: function (r) {
          return find(function () { var A = r.int(40, 140), s = Math.sqrt(A), p = 4 * s, roll = r.pick([5, 6, 8, 10]); return { A: A, s: s, p: p, roll: roll, what: r.pick(['lawn', 'garden', 'play area']) }; },
            function (v) { var fr = v.p / v.roll - Math.floor(v.p / v.roll); return !isSq(v.A) && v.A !== 50 && safe(v.s) && safe(v.p) && fr > 0.05 && fr < 0.45 && Math.abs(rd(4 * rd(v.s, 1), 1) - rd(v.p, 1)) > 0.05; }, { A: 85, s: Math.sqrt(85), p: 4 * Math.sqrt(85), roll: 6, what: 'lawn' });
        }, parts: [
        { id: '7a', level: 'EMG', make: function (r, sh) { return nearP('(a) How long is each side, to the nearest tenth of a metre?', sh.s, 1, rootBad(sh.A).concat([[sh.A / 4, 'u7l1-perimeter', 'Dividing the area by 4 doesn’t give the side. Side = √(area).']]), { after: 'm', sol: 'Side = ' + sqrtWork(sh.A) + ' m', hints: ['Side of a square = √(area).'], text: 'side ' + sh.A }); } },
        { id: '7b', level: 'PRG', make: function (r, sh) {
          var s1 = rd(sh.s, 1);
          return nearP('(b) Edging goes all the way around the ' + sh.what + '. How many metres of edging are needed, to the nearest tenth?', sh.p, 1, [[4 * s1, 'u7l1-early-round', 'Close! You multiplied the <b>rounded</b> side. Use the full calculator value of the side, then round at the end.'], [sh.A, 'u7l1-perimeter', 'That is the area. The edging goes around: 4 sides.'], [2 * sh.s, 'u7l1-perimeter', 'A square has <b>4</b> equal sides.'], [4 * sh.A, 'u7l1-perimeter', 'Multiply the <b>side</b> (from (a)) by 4, not the area.']],
            { after: 'm', sol: br(['4 equal sides. Keep the full value of the side:', t('4\\times ' + raw3(sh.s) + '=' + raw3(sh.p) + '\\approx ' + fx(sh.p, 1)) + ' m', '(Use the full value, not ' + fx(s1, 1) + '.)']), hints: ['A square has 4 equal sides.', 'Don’t round the side first.'], text: 'edging ' + sh.A });
        } },
        { id: '7c', level: 'ADV', make: function (r, sh) {
          var n = sh.p / sh.roll, ans = Math.ceil(n);
          return numP('(c) The edging is sold in ' + sh.roll + ' m rolls. How many rolls must be bought?', ans, [[Math.floor(n), 'u7l1-round-rolls', t(Math.floor(n) + '\\times ' + sh.roll + '=' + Math.floor(n) * sh.roll) + ' m, which is less than ' + fx(sh.p, 1) + ' m. That is not quite enough: buy one more roll.'], [rd(n, 1), 'u7l1-round-rolls', 'You can only buy whole rolls. How many whole rolls cover all of it?'], [rd(n, 2), 'u7l1-round-rolls', 'You can only buy whole rolls.'], [Math.ceil(sh.p), 'u7l1-perimeter', 'That is the metres of edging. Divide by ' + sh.roll + ' m per roll.']],
            { after: 'rolls', sol: br([t(raw3(sh.p) + '\\div ' + sh.roll + '=' + raw3(n))]) + '<br>' + Math.floor(n) + ' rolls are not quite enough, so buy ' + ans + ' rolls.', hints: ['Divide the edging needed by the length of one roll.', 'If it isn’t a whole number, round <b>up</b>: you can’t buy part of a roll.'], text: 'rolls ' + sh.A + '/' + sh.roll });
        } }] },
      { num: '8', stem: 'Find the mistake in each answer.', parts: [
        { id: '8a', level: 'EMG', make: function (r) {
          var p = r.pick(NAMES), n = r.pick([3, 4, 5, 7, 8, 9]), k = r.pick([6, 8, 10, 12, 14]), m = k * k;
          var opts = [{ html: t(n + '^2') + ' means ' + t(n + '\\times ' + n + '=' + n * n) + ' (not ' + t(n + '\\times 2') + '), and ' + t('\\sqrt{' + m + '}=' + k) + ' because ' + t(k + '^2=' + m) + ' (a square root is not half).', right: true },
            { html: t(n + '^2=' + 2 * n) + ' is right, but ' + t('\\sqrt{' + m + '}=' + k) + '.', why: t(n + '^2') + ' means ' + t(n + '\\times ' + n) + ', not ' + t(n + '\\times 2') + '.', code: 'u7l1-double' },
            { html: t('\\sqrt{' + m + '}=' + m / 2) + ' is right, but ' + t(n + '^2=' + n * n) + '.', why: 'Check by squaring: ' + t((m / 2) + '^2=' + N(m * m / 4)) + ', not ' + m + '.', code: 'u7l1-half' },
            { html: 'Both are right.', why: 'Check each one: ' + t(n + '\\times ' + n) + ' = ? and ' + t((m / 2) + '\\times ' + (m / 2)) + ' = ?', code: 'u7l1-both-right' }];
          return P.mc(r, '(a) ' + p[0] + ' wrote: ' + t(n + '^2=' + 2 * n) + ' and ' + t('\\sqrt{' + m + '}=' + m / 2) + '. What are the mistakes, and the correct answers?', opts, br([t(n + '^2') + ' means ' + t(n + '\\times ' + n + '=' + n * n) + ', not ' + t(n + '\\times 2') + '.', 'A square root is not half the number: ' + t('\\sqrt{' + m + '}=' + k) + ' because ' + t(k + '^2=' + m) + '. (Check: ' + t((m / 2) + '^2=' + N(m * m / 4)) + ', not ' + m + '.)']), ['Check each answer: square the root, and multiply the number by itself.'], 'jesse ' + n + ',' + m);
        } },
        { id: '8bi', sub: 'b i', level: 'EMG', make: function (r) {
          var p = r.pick(NAMES), A = find(function () { return r.int(5, 30) * 2; }, function (A) { return !isSq(A) && A >= 12 && A !== 50; }, 18), h = A / 2, a = Math.floor(Math.sqrt(A));
          var he = p[1] === 'f' ? 'She' : 'He';
          var opts = [{ html: 'No: ' + t(h + '^2=' + N(h * h)) + ', far more than ' + A + '. ' + he + ' halved ' + A + '. The side is between ' + a + ' and ' + (a + 1) + ' m.', right: true },
            { html: 'Yes: the side of a square is half its area, ' + t(A + '\\div 2=' + h) + '.', why: 'Check: a ' + h + ' m by ' + h + ' m room has an area of ' + t(h + '^2=' + N(h * h)) + '. Side = √(area).', code: 'u7l1-half' },
            { html: 'No: it should be ' + t(A + '\\times 2=' + 2 * A) + ' m.', why: 'The side is <b>smaller</b> than ' + h + ' m: ' + t(h + '^2') + ' is already far more than ' + A + '. Use √.', code: 'u7l1-double' },
            { html: 'Yes: ' + t(h + '^2') + ' is close to ' + A + '.', why: 'Work it out: ' + t(h + '\\times ' + h + '=' + N(h * h)) + '.', code: 'u7l1-reasonable' }];
          return P.mc(r, p[0] + ' says a square room with an area of ' + t(A + '\\text{ m}^2') + ' is about ' + h + ' m long on each side. Is that reasonable?', opts, br(['Not reasonable: ' + t(h + '^2=' + N(h * h)) + ', far more than ' + A + '. ' + he + ' halved ' + A + '.', t(a * a + '<' + A + '<' + (a + 1) * (a + 1)) + ', so the side is between ' + a + ' and ' + (a + 1) + ' m.']), ['Square ' + h + ' to check.'], 'maya ' + A);
        } },
        { id: '8bii', sub: 'b ii', level: 'PRG', make: function (r) {
          var A = find(function () { return r.int(5, 30) * 2; }, function (A) { return !isSq(A) && A >= 12 && A !== 50 && safe(Math.sqrt(A)); }, 18);
          return nearP('A square room has an area of ' + t(A + '\\text{ m}^2') + '. How long is each side, to the nearest tenth of a metre?', Math.sqrt(A), 1, rootBad(A), { after: 'm', sol: 'Side = ' + sqrtWork(A) + ' m', hints: ['Side = √(area).'], text: 'room side ' + A });
        } }] },
      { num: '9', stem: 'Find each missing angle.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { return angleQ(r, '(a) Find ' + t('x') + '.', 'scalene'); } },
        { id: '9b', level: 'EMG', make: function (r) { return angleQ(r, '(b) Find ' + t('x') + '.', 'right', { rightAt: 'A' }); } },
        { id: '9c', level: 'PRG', make: function (r) {
          var m = missAngle(r, 'apex'), bad = m.bad;
          var p = fieldsPart('(c) Find ' + t('x') + ' and ' + t('y') + '.<br>' + m.fig, [angSpec(t('x='), m.ans, bad, 'x'), angSpec(t('y='), m.ans, bad, 'y')], m.sol, m.hints, m.txt);
          p.bad = [[nS(180 - 2 * m.ans), nS(180 - 2 * m.ans)]];
          return p;
        } },
        { id: '9d', level: 'PRG', make: function (r) { return angleQ(r, '(d) Find ' + t('x') + '.', 'base'); } }] },
      { num: '10', stem: 'Name each triangle by its sides and by its angles.', shared: function (r) { return { rows: triRows(r) }; }, parts: [
        { id: '10a', sub: 'by sides', level: 'EMG', make: function (r, sh) { return nameGrid(sh.rows, 'sides'); } },
        { id: '10b', sub: 'by angles', level: 'EMG', make: function (r, sh) { return nameGrid(sh.rows, 'angles'); } }] },
      { num: '11', stem: 'Write always, sometimes or never. Give a reason or an example.', parts: [
        { id: '11a', level: 'EMG', make: function (r) { return asnPart(r, 'never', 'never'); } },
        { id: '11b', level: 'PRG', make: function (r) { return asnPart(r, 'sometimes', 'sometimes'); } },
        { id: '11c', level: 'EMG', make: function (r) { return asnPart(r, 'always1', 'always'); } },
        { id: '11d', level: 'EMG', make: function (r) { return asnPart(r, 'always2', 'always'); } }] },
      { num: '12', stem: function (sh) { return rtName(sh); }, shared: function (r) { var s = nameShared(r); return s; }, parts: [
        { id: '12a', level: 'EMG', make: function (r, sh) { return lettersPart(sh); } },
        { id: '12b', level: 'EMG', make: function (r, sh) { return hypPart(sh, '(b) The hypotenuse is side ___, also called side ___.<br>' + nameFig(sh)); } },
        { id: '12c', level: 'EMG', make: function (r, sh) { return legsPart(r, sh, '(c) The legs are…<br>' + nameFig(sh)); } },
        { id: '12d', level: 'BEG', make: function (r, sh) { return hypLenPart(sh, '(d) ' + r3(sh) + ' How long is the hypotenuse?'); } }] },
      { num: '13', stem: 'Picture each situation as a right triangle.', shared: function (r) { return { sc: r.pick(SCENES.slice(0, 3)), g: pickNot(r, range(50, 70), [75]) }; }, parts: [
        { id: '13ai', sub: 'a i', level: 'EMG', make: function (r, sh) { var p = sketchPart(r, sh.sc, sh.g); p.prompt = sh.sc.stem(sh.g) + '<br>' + p.prompt; return p; } },
        { id: '13aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var p = otherAngPart(sh.sc, sh.g); p.prompt = sh.sc.stem(sh.g) + '<br>' + p.prompt; return p; } },
        { id: '13b', level: 'PRG', make: function (r) {
          var ctx = r.pick(['A carpenter’s speed square is a right triangle with two equal legs.', 'A square tile is cut along its diagonal into two right triangles. Each has two equal legs.', 'A shelf bracket is a right triangle with two equal legs.']);
          return angP('(b) ' + ctx + ' How big is each of its other two angles?', 45, [[90, 'u7l1-gave-right', 'One angle is the 90° corner. The other two are equal and share the other 90°.'], [67.5, 'u7l1-no-right', 'The right angle is one of the three angles. The other two share 180° − 90° = 90°.'], [60, 'u7l1-angles', 'It isn’t equilateral: one angle is 90°. The other two are equal and add to 90°.'], [135, 'u7l1-no-half', 'Two equal angles share what is left of 180° after the right angle.']],
            { sol: br(['Right isosceles triangle: the two other angles are equal and add up to 90°.', t('90^\\circ\\div 2=45^\\circ') + ' each.', 'The hypotenuse is the long edge across from the square corner.']), hints: ['The right angle uses 90°. The other two angles add up to 90°.', 'Two equal legs means the two angles across from them are equal.'], text: 'speed square ' + ctx.slice(0, 12) });
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var k = pickNot(r, range(11, 19), [13]), m = k * k;
          return P.mc(r, t('\\sqrt{' + N(m) + '}') + ' equals', [{ html: t(N(m / 2)), why: 'A square root is not half: ' + t(N(m / 2) + '^2') + ' is far more than ' + N(m) + '.', code: 'u7l1-half' }, { html: t(N(k)), right: true }, { html: t(N(m * m)), why: 'That is ' + t(N(m) + '^2') + '. The square root goes the other way.', code: 'u7l1-squared' }, { html: t(N(2 * m)), why: 'That doubles ' + N(m) + '. What number times itself gives ' + N(m) + '?', code: 'u7l1-half' }],
            t(k + '^2=' + N(m)) + ', so ' + t('\\sqrt{' + N(m) + '}=' + k) + '.', ['Which number times itself gives ' + N(m) + '?'], 'mc root ' + m, true);
        } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(25, 75), r.int(25, 75)]; }, function (v) { var c = 180 - v[0] - v[1]; return c > 15 && v[0] !== v[1] && !(v[0] === 62 && v[1] === 71); }, [38, 67]), c = 180 - v[0] - v[1];
          return P.mc(r, 'A triangle has angles of ' + D(v[0]) + ' and ' + D(v[1]) + '. The third angle is', [{ html: D(v[0] + v[1]), why: 'That just adds the two angles. Subtract them from 180°.', code: 'u7l1-add-angles' }, { html: D(c), right: true }, { html: D(360 - v[0] - v[1]), why: 'The angles in a triangle add up to 180°, not 360°.', code: 'u7l1-360' }, { html: D(c + 10), why: 'Check the subtraction: ' + t('180-' + v[0] + '-' + v[1]) + '.', code: 'u7l1-slip' }],
            t('180^\\circ-' + dg(v[0]) + '-' + dg(v[1]) + '=' + dg(c)), ['The three angles add up to 180°.'], 'mc third ' + v.join(','), true);
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var set = r.pick([['X', 'Y', 'Z'], ['A', 'B', 'C'], ['L', 'M', 'N'], ['D', 'E', 'F']]), ri = r.int(0, 2), o = [0, 1, 2].filter(function (j) { return j !== ri; });
          var opts = [{ html: 'side ' + set[ri] + set[o[0]], why: 'That side touches the right angle at ' + set[ri] + ', so it is a leg.', code: 'u7l1-leg-as-hyp' }, { html: 'side ' + set[ri] + set[o[1]], why: 'That side touches the right angle at ' + set[ri] + ', so it is a leg.', code: 'u7l1-leg-as-hyp' }, { html: 'side ' + set[o[0]] + set[o[1]], right: true }, { html: 'side <i>' + set[o[0]].toLowerCase() + '</i>', why: 'Side <i>' + set[o[0]].toLowerCase() + '</i> is across from ' + set[o[0]] + ': it is side ' + set[ri] + set[o[1]] + ', a leg.', code: 'u7l1-letter-touch' }];
          return P.mc(r, 'In right △' + set.join('') + ', the right angle is at ' + set[ri] + '. The hypotenuse is', opts, 'The hypotenuse is across from the right angle at ' + set[ri] + ', so it is side <i>' + set[ri].toLowerCase() + '</i>, the side joining ' + set[o[0]] + ' and ' + set[o[1]] + ' (side ' + set[o[0]] + set[o[1]] + ').', ['The hypotenuse does not touch the right angle.'], 'mc hyp ' + set.join('') + ri, true);
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var n = nonSq(r, 60, 199, [62, 90, 105, 150, 80, 75]);
          return nearP('<b>Numerical response.</b> ' + t('\\sqrt{' + n + '}') + ', rounded to the nearest tenth, is ____.', Math.sqrt(n), 1, rootBad(n), { nr: true, sol: sqrtWork(n) + ' (check: between ' + t('\\sqrt{' + Math.pow(Math.floor(Math.sqrt(n)), 2) + '}=' + Math.floor(Math.sqrt(n))) + ' and ' + t('\\sqrt{' + Math.pow(Math.floor(Math.sqrt(n)) + 1, 2) + '}=' + (Math.floor(Math.sqrt(n)) + 1)) + ' ✓)', hints: ['Press 2nd x², type the number, then ) and ENTER.'], text: 'nr root ' + n });
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'PRG', make: function (r) {
          var k = find(function () { return r.int(5, 50) * 2; }, function (k) { return k !== 110 && k !== 36 && k !== 60 && k !== 90; }, 28), b = (180 - k) / 2;
          return angP('<b>Numerical response.</b> An isosceles triangle has a ' + D(k) + ' angle between its two equal sides. Each of the other two angles is ____°.', b, [[180 - k, 'u7l1-no-half', 'The two equal angles <b>share</b> ' + t(dg(180 - k)) + ': divide by 2.'], [k, 'u7l1-apex-equal', 'The angle between the equal sides is the one that is different. The other two are equal to each other.'], [180 - 2 * k, 'u7l1-apex-equal', 'Subtract the angle between the equal sides <b>once</b>, then halve what is left.']],
            { nr: true, sol: t('180^\\circ-' + dg(k) + '=' + dg(180 - k)) + ', ' + t(dg(180 - k) + '\\div 2=' + dg(b)), hints: ['Subtract from 180°, then share between the two equal angles.'], text: 'nr iso ' + k });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find each square.', parts: [
        { id: 'e1a', sub: 'a–c', level: 'BEG', make: function (r) {
          var v = [pickNot(r, range(11, 19), [12]), pickNot(r, range(2, 9), [6, 9]), pickNot(r, range(30, 90, 10), [20])], L = 'abc';
          return fieldsPart('No calculator needed.', v.map(function (n, i) { return sqSpec('(' + L[i] + ') ' + t(N(n) + '^2='), n); }), v.map(function (n, i) { return '(' + L[i] + ') ' + t(N(n) + '\\times ' + N(n) + '=' + N(n * n)); }).join('<br>'), ['Multiply the number by itself.'], 'ep squares ' + v.join(','));
        } },
        { id: 'e1b', sub: 'd–f', level: 'EMG', make: function (r) {
          var v = [pickNot(r, range(0.2, 0.9, 0.1), [0.3]), pickNot(r, [1.5, 2.5, 4.5, 5.5, 6.5, 8.5], [3.5, 1.5]), pickNot(r, range(3.1, 5.9, 0.1).filter(function (x) { return decs(x) === 1; }), [3.5, 4.5, 5.5])], L = 'def';
          return fieldsPart('Use your calculator.', v.map(function (n, i) { return sqSpec('(' + L[i] + ') ' + t(N(n) + '^2='), n); }), v.map(function (n, i) { return '(' + L[i] + ') ' + t(N(n) + '\\times ' + N(n) + '=' + N(q(n * n))); }).join('<br>'), ['Type the number, press x², then ENTER.'], 'ep squares calc ' + v.join(','));
        } }] },
      { num: '2', stem: 'Find each square root.', parts: [
        { id: 'e2a', sub: 'a–d', level: 'BEG', make: function (r) {
          var roots = [pickNot(r, [7, 8, 9], []), r.pick([2, 3]), pickNot(r, range(11, 15), [13]), pickNot(r, [20, 30, 40, 50], [])], L = 'abcd';
          return fieldsPart('Without a calculator.', roots.map(function (k, i) { return rootSpec('(' + L[i] + ') ' + t('\\sqrt{' + N(k * k) + '}='), k * k); }), roots.map(function (k, i) { return '(' + L[i] + ') ' + t('\\sqrt{' + N(k * k) + '}=' + k) + ' because ' + t(k + '^2=' + N(k * k)); }).join('<br>'), ['What number times itself gives this?'], 'ep roots ' + roots.join(','));
        } },
        { id: 'e2b', sub: 'e–h', level: 'EMG', make: function (r) {
          var v = [nonSq(r, 20, 45, [27, 40]), nonSq(r, 2, 15, [8, 12, 3]), nonSq(r, 200, 500, [400]), find(function () { return r.pick([0.2, 0.3, 0.5, 0.6, 0.7, 0.8]); }, function (x) { return safe(Math.sqrt(x)); }, 0.5)], L = 'efgh';
          return fieldsPart('Use your calculator and round to the nearest tenth.', v.map(function (m, i) { return apxSpec('(' + L[i] + ') ' + t('\\sqrt{' + N(m) + '}\\approx'), m); }), v.map(function (m, i) { return '(' + L[i] + ') ' + sqrtWork(m); }).join('<br>') + '<br>(The root of a number less than 1 is <b>bigger</b> than the number.)', ['Press 2nd x², type the number, then ) and ENTER.', 'Round to one decimal place.'], 'ep calc roots ' + v.join(','));
        } }] },
      { num: '3', stem: 'Each square root is between two whole numbers. Name them, and the one it is closer to.', shared: function (r) { return { v: [find(function () { return r.int(10, 24); }, function (n) { var a = Math.floor(Math.sqrt(n)); return !isSq(n) && n - a * a > (a + 1) * (a + 1) - n && n !== 18; }, 14), find(function () { return r.int(50, 60); }, function (n) { var a = Math.floor(Math.sqrt(n)); return !isSq(n) && n - a * a < (a + 1) * (a + 1) - n && n !== 50; }, 55), r.pick([63, 80, 99, 120, 143, 168, 195])] }; },
        parts: [0, 1, 2].map(function (i) {
          return { id: 'e3' + 'abc'[i], level: 'EMG', make: function (r, sh) {
            var n = sh.v[i], a = Math.floor(Math.sqrt(n)), lo = a * a, hi = (a + 1) * (a + 1), cl = n - lo <= hi - n ? a : a + 1;
            var specs = [numSpec('Between', a, [[lo, 'u7l1-roots', 'Give the whole number whose square is ' + lo + ': ' + t('\\sqrt{' + lo + '}') + '.'], [a - 1, 'u7l1-roots', t((a) + '^2=' + lo) + ' is still less than ' + n + '.']], { name: 'Smaller whole number' }), numSpec('and', a + 1, [[hi, 'u7l1-roots', 'Give the whole number whose square is ' + hi + ': ' + t('\\sqrt{' + hi + '}') + '.'], [a + 2, 'u7l1-roots', t((a + 1) + '^2=' + hi) + ' is already more than ' + n + '.']], { name: 'Bigger whole number' }), numSpec('Closer to', cl, [[cl === a ? a + 1 : a, 'u7l1-closer', n + ' is ' + (n - lo) + ' above ' + lo + ' and ' + (hi - n) + ' below ' + hi + '. Which is nearer?']], { name: 'Closer to' })];
            var p = fieldsPart('(' + 'abc'[i] + ') ' + t('\\sqrt{' + n + '}') + ' is between ___ and ___. It is closer to ___.', specs, t(lo + '<' + n + '<' + hi) + ', so ' + t('\\sqrt{' + n + '}') + ' is between ' + a + ' and ' + (a + 1) + '. ' + n + ' is closer to ' + (cl === a ? lo : hi) + ', so the root is closer to ' + cl + '. (' + t(raw3(Math.sqrt(n))) + ')', ['Find the perfect squares just below and just above ' + n + '.'], 'ep between ' + n);
            p.bad = [[String(lo), String(hi), String(cl)]];
            return p;
          } };
        }) },
      { num: '4', stem: 'Find each missing angle.', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { return angleQ(r, '(a) Find ' + t('x') + '.', 'scalene', { obtuse: true }); } },
        { id: 'e4b', level: 'EMG', make: function (r) { return angleQ(r, '(b) Find ' + t('x') + '.', 'right', { rightAt: 'B' }); } },
        { id: 'e4c', level: 'EMG', make: function (r) { return angleQ(r, '(c) Find ' + t('x') + '.', 'equi'); } }] },
      { num: '5', stem: 'Name each triangle by its sides and by its angles.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { return nameMC(r, 'scaR2'); } },
        { id: 'e5b', level: 'EMG', make: function (r) { return nameMC(r, r.chance(0.7) ? 'isoA' : 'isoO'); } },
        { id: 'e5c', level: 'EMG', make: function (r) { return nameMC(r, 'scaO'); } }] },
      { num: '6', stem: function (sh) { return rtName(sh); }, shared: function (r) { return nameShared(r, { set: r.pick([['L', 'M', 'N'], ['D', 'E', 'F'], ['G', 'H', 'K']]), ri: 1 }); }, parts: [
        { id: 'e6a', level: 'EMG', make: function (r, sh) { return hypPart(sh, '(a) The hypotenuse is side ___, also called side ___.<br>' + nameFig(sh)); } },
        { id: 'e6b', level: 'EMG', make: function (r, sh) { return legsPart(r, sh, '(b) The legs are…<br>' + nameFig(sh)); } },
        { id: 'e6c', level: 'BEG', make: function (r, sh) {
          var h = sh.ri, lens = [sh.len[0], sh.len[1], sh.len[2]].sort(function (a, b) { return a - b; });
          return hypLenPart(sh, '(c) The sides are ' + lens.join(' cm, ') + ' cm. Which length is ' + sideNm(sh.set, h) + '?');
        } }] },
      { num: '7', section: 'B. Applying', stem: function (sh) { return 'A square quilt block has an area of ' + t(N(sh.A) + '\\text{ cm}^2') + '.'; }, shared: function (r) { var s = pickNot(r, range(12, 25), [20]), n = r.int(4, 8); return { s: s, A: s * s, n: n }; }, parts: [
        { id: 'e7a', level: 'EMG', make: function (r, sh) { return numP('(a) How long is each side of the block?', sh.s, rootBad(sh.A).concat([[sh.A / 4, 'u7l1-perimeter', 'Dividing the area by 4 doesn’t give the side. Side = √(area).']]), { after: 'cm', sol: t('\\sqrt{' + N(sh.A) + '}=' + sh.s) + ' cm (check: ' + t(sh.s + '^2=' + N(sh.A)) + ' ✓)', hints: ['Side = √(area).'], text: 'quilt side ' + sh.A }); } },
        { id: 'e7b', level: 'PRG', make: function (r, sh) {
          var S = sh.n * sh.s, Ar = S * S;
          var p = fieldsPart('(b) A square quilt is made of ' + sh.n + ' rows of ' + sh.n + ' blocks. How long is each side of the quilt? What is its area?', [numSpec('Side:', S, [[sh.n * sh.n * sh.s, 'u7l1-blocks', 'One side of the quilt has only ' + sh.n + ' blocks along it.'], [sh.n * sh.A, 'u7l1-perimeter', 'That uses the area of a block. The side is ' + sh.n + ' block sides long.']], { after: 'cm', name: 'Side' }),
            numSpec('Area:', Ar, [[sh.n * sh.A, 'u7l1-blocks', 'The quilt has ' + sh.n + ' × ' + sh.n + ' = ' + sh.n * sh.n + ' blocks, not ' + sh.n + '. Or square the side.'], [4 * S, 'u7l1-perimeter', 'That is the distance around. Area = side².'], [2 * S, 'u7l1-double', 'Area = side × side, not side × 2.']], { after: 'cm²', name: 'Area' })],
            br(['Side: ' + t(sh.n + '\\times ' + sh.s + '=' + S) + ' cm', 'Area: ' + t(S + '^2=' + N(Ar) + '\\text{ cm}^2') + ' (or ' + t(sh.n * sh.n + '\\times ' + N(sh.A) + '=' + N(Ar)) + ')']), ['Each side of the quilt is ' + sh.n + ' block sides.', 'Area of a square = side².'], 'quilt ' + sh.s + 'x' + sh.n);
          p.bad = [[nS(sh.n * sh.n * sh.s), nS(sh.n * sh.A)]];
          return p;
        } }] },
      { num: '8', stem: function (sh) { return sh.who + ' floods a square backyard rink with an area of ' + t(sh.A + '\\text{ m}^2') + '.'; }, shared: function (r) {
          return find(function () { var A = r.int(100, 300); return { A: A, s: Math.sqrt(A), p: 4 * Math.sqrt(A), who: r.pick(NAMES)[0] }; }, function (v) { return !isSq(v.A) && v.A !== 150 && safe(v.s) && safe(v.p) && Math.abs(rd(4 * rd(v.s, 1), 1) - rd(v.p, 1)) > 0.05; }, { A: 160, s: Math.sqrt(160), p: 4 * Math.sqrt(160), who: 'Ravi' });
        }, parts: [
        { id: 'e8a', level: 'EMG', make: function (r, sh) { return nearP('(a) How long is each side, to the nearest tenth of a metre?', sh.s, 1, rootBad(sh.A).concat([[sh.A / 4, 'u7l1-perimeter', 'Side = √(area), not area ÷ 4.']]), { after: 'm', sol: sqrtWork(sh.A) + ' m', hints: ['Side = √(area).'], text: 'rink side ' + sh.A }); } },
        { id: 'e8b', level: 'PRG', make: function (r, sh) { var s1 = rd(sh.s, 1); return nearP('(b) Boards go all the way around the rink. How many metres of boards are needed, to the nearest tenth?', sh.p, 1, [[4 * s1, 'u7l1-early-round', 'Close! You multiplied the <b>rounded</b> side. Use the full value, then round at the end.'], [sh.A, 'u7l1-perimeter', 'That is the area. The boards go around: 4 sides.'], [2 * sh.s, 'u7l1-perimeter', 'A square has <b>4</b> sides.']], { after: 'm', sol: t('4\\times ' + raw3(sh.s) + '=' + raw3(sh.p) + '\\approx ' + fx(sh.p, 1)) + ' m', hints: ['4 equal sides. Keep the full value of the side.'], text: 'boards ' + sh.A }); } }] },
      { num: '9', stem: function (sh) { return SCENES[3].stem(sh.g); }, shared: function (r) { return { g: pickNot(r, range(62, 80), [75]) }; }, parts: [
        { id: 'e9a', level: 'EMG', make: function (r, sh) { return sketchPart(r, SCENES[3], sh.g); } },
        { id: 'e9b', level: 'EMG', make: function (r, sh) { return otherAngPart(SCENES[3], sh.g); } }] },
      { num: '10', stem: function (sh) { return 'A roof truss is an isosceles triangle. Each of the two bottom angles is ' + D(sh.b) + '.'; }, shared: function (r) { return { b: r.chance(0.75) ? r.pick([15, 20, 22.5, 25, 27.5, 30, 32.5, 37.5, 40]) : r.pick([45, 50, 55, 60, 65]) }; }, parts: [
        { id: 'e10a', level: 'PRG', make: function (r, sh) { var pk = 180 - 2 * sh.b; return angP('(a) What is the angle at the peak?', pk, [[180 - sh.b, 'u7l1-one-base', 'There are <b>two</b> bottom angles of ' + dg0(sh.b) + '. Subtract both.'], [90 - sh.b, 'u7l1-no-right', 'This triangle has no right angle. Use 180°.'], [2 * sh.b, 'u7l1-add-angles', 'That is the two bottom angles together. Subtract them from 180°.']], { sol: t('180^\\circ-' + dg(sh.b) + '-' + dg(sh.b) + '=' + dg(pk)), hints: ['The three angles add to 180°.'], text: 'truss ' + sh.b }); } },
        { id: 'e10b', level: 'EMG', make: function (r, sh) {
          var pk = 180 - 2 * sh.b, kind = pk > 90 ? 'obtuse' : pk === 90 ? 'right' : 'acute', ks = ['acute', 'right', 'obtuse'];
          var opts = ks.map(function (k) { return { html: k + ' isosceles', right: k === kind, why: k === kind ? null : 'The peak angle is ' + dg0(pk) + '. Look at the biggest angle: ' + ANG_RULE[kind] + '.', code: 'u7l1-angles' }; });
          opts.push({ html: kind + ' scalene', why: 'Two equal angles means two equal sides: isosceles.', code: 'u7l1-sides' });
          return P.mc(r, '(b) What kind of triangle is it by its angles?', opts, 'The peak angle is ' + D(pk) + (kind === 'acute' ? ', and all three angles are less than 90°' : kind === 'right' ? ', exactly 90°' : ', more than 90°') + ', so it is an <b>' + kind + ' isosceles</b> triangle.', ['Find the peak angle first. The biggest angle decides.'], 'truss kind ' + sh.b, true);
        } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var k = r.int(4, 9), lo = k * k, hi = (k + 1) * (k + 1), right = find(function () { return r.int(lo + 1, hi - 1); }, function (n) { return n % 5 === 0 || n % 2 === 0; }, lo + 2), below = find(function () { return r.int((k - 1) * (k - 1) + 1, lo - 1); }, function (n) { return n % 5 === 0 || n % 2 === 0; }, lo - 2), above = find(function () { return r.int(hi + 1, hi + 2 * k); }, function (n) { return n % 5 === 0 || n % 2 === 0; }, hi + 2);
          var opts = [{ html: t(N(right)), right: true }, { html: t(N(below)), why: t('\\sqrt{' + below + '}=' + raw3(Math.sqrt(below))) + ': ' + below + ' is less than ' + t(k + '^2=' + lo) + '.', code: 'u7l1-roots' }, { html: t(N(above)), why: t('\\sqrt{' + above + '}=' + raw3(Math.sqrt(above))) + ': ' + above + ' is more than ' + t((k + 1) + '^2=' + hi) + '.', code: 'u7l1-roots' }, { html: t(k + '.5'), why: 'The number ' + k + '.5 itself is between ' + k + ' and ' + (k + 1) + ', but its square root is about ' + fx(Math.sqrt(k + 0.5), 1) + '.', code: 'u7l1-number-not-root' }];
          return P.mc(r, 'Which number has a square root between ' + k + ' and ' + (k + 1) + '?', opts, t(lo + '<' + right + '<' + hi) + ', so ' + t('\\sqrt{' + right + '}') + ' is between ' + k + ' and ' + (k + 1) + ' (' + t(raw3(Math.sqrt(right))) + ').', ['Square ' + k + ' and ' + (k + 1) + '. The number must be between those squares.'], 'mc between ' + k);
        } }] },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'EMG', make: function (r) {
          var s = pickNot(r, range(1.1, 2.9, 0.1).filter(function (x) { return decs(x) === 1; }), [2.4, 1.5, 1.1, 2]), A = q(s * s), it = r.pick(['tablecloth', 'rug', 'window']);
          return numP('<b>Numerical response.</b> A square ' + it + ' has an area of ' + t(N(A) + '\\text{ m}^2') + '. Each side is ____ m long.', s, rootBad(A), { nr: true, sol: t('\\sqrt{' + N(A) + '}=' + N(s)) + ' (check: ' + t(N(s) + '^2=' + N(A)) + ' ✓)', hints: ['Side = √(area).'], text: 'nr cloth ' + A });
        } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [
        { id: 'e13', level: 'ADV', make: function (r) {
          var v = find(function () { var k = r.int(5, 10), a = r.int(k * k + 1, (k + 1) * (k + 1) - 1), b = r.int(k * k + 1, (k + 1) * (k + 1) - 1), d1 = q(k + r.int(1, 9) / 10), d2 = q(k + r.int(1, 9) / 10); return { k: k, a: Math.min(a, b), b: Math.max(a, b), d1: Math.min(d1, d2), d2: Math.max(d1, d2) }; },
            function (v) { var vals = [Math.sqrt(v.a), Math.sqrt(v.b), v.d1, v.d2].sort(function (x, y) { return x - y; }); for (var i = 1; i < 4; i++) if (vals[i] - vals[i - 1] < 0.04) return false; if (isSq(v.a) || isSq(v.b)) return false; var ord = [['ra', Math.sqrt(v.a)], ['rb', Math.sqrt(v.b)], ['d1', v.d1], ['d2', v.d2]].sort(function (x, y) { return x[1] - y[1]; }).map(function (x) { return x[0][0]; }).join(''); return ord !== 'rrdd' && ord !== 'ddrr'; }, { k: 6, a: 40, b: 45, d1: 6.4, d2: 6.5 });
          var items = [{ id: 'ra', tex: '\\sqrt{' + v.a + '}', val: Math.sqrt(v.a) }, { id: 'rb', tex: '\\sqrt{' + v.b + '}', val: Math.sqrt(v.b) }, { id: 'd1', tex: N(v.d1), val: v.d1 }, { id: 'd2', tex: N(v.d2), val: v.d2 }].sort(function (x, y) { return x.val - y.val; });
          var sqv = function (x) { return x.id[0] === 'r' ? t('(' + x.tex + ')^2=' + x.tex.replace(/\\sqrt\{|\}/g, '')) : t(x.tex + '^2=' + N(q(x.val * x.val))); };
          return P.order(r, 'Put these numbers in order from least to greatest without a calculator. (Hint: square each one.)', items.map(function (x) { return { id: x.id, tex: x.tex }; }), { why: function (x, y) { var X = items.filter(function (z) { return z.id === x; })[0], Y = items.filter(function (z) { return z.id === y; })[0]; return 'Square both to compare: ' + sqv(X) + ' and ' + sqv(Y) + '.'; } },
            br(['Square each one to compare: ' + items.map(sqv).join(', ') + '.', 'Order: ' + items.map(function (x) { return t(x.tex); }).join(', ') + '. (Calculator check: ' + items.map(function (x) { return fx(x.val, 2); }).join(', ') + '.)']), ['Squaring keeps the order the same, and the squares are easy to compare.'], 'order ' + [v.a, v.b, v.d1, v.d2].join(','));
        } }] },
      { num: '14', stem: '', parts: [
        { id: 'e14', level: 'MAS', make: function (r) {
          var mode = r.pick(['times', 'times', 'more']), sm, lg, prompt, sol;
          if (mode === 'times') { var k = r.pick([2, 4, 5, 8, 9, 14]); sm = 90 / (k + 1); lg = 90 - sm; prompt = 'A right triangle has one acute angle that is ' + (k === 2 ? 'twice' : k + ' times') + ' as big as the other acute angle. Find all three angles.'; sol = br(['The two acute angles add to 90°. Together they make ' + (k + 1) + ' equal parts (1 part + ' + k + ' parts).', t('90^\\circ\\div ' + (k + 1) + '=' + dg(sm)) + ', and ' + t(k + '\\times ' + dg(sm) + '=' + dg(lg)) + '.', 'Check: ' + t(N(sm) + '+' + N(lg) + '+90=180') + ' ✓']); }
          else { var d = r.pick([10, 20, 30, 40, 50]); sm = (90 - d) / 2; lg = sm + d; prompt = 'A right triangle has one acute angle that is ' + d + '° bigger than the other acute angle. Find all three angles.'; sol = br(['The two acute angles add to 90°. Take away the extra ' + d + '°: ' + t('90^\\circ-' + dg(d) + '=' + dg(90 - d)) + ', shared equally: ' + t(dg(90 - d) + '\\div 2=' + dg(sm)) + '.', 'The other is ' + t(dg(sm) + '+' + dg(d) + '=' + dg(lg)) + '.', 'Check: ' + t(N(sm) + '+' + N(lg) + '+90=180') + ' ✓']); }
          var smBad = [[mode === 'times' ? 180 / ((90 / sm)) : (180 - (lg - sm)) / 2, 'u7l1-acute-sum', 'The right angle is one of the three angles, so the two <b>acute</b> angles add to 90°, not 180°.'], [lg, 'u7l1-angles', 'That is the bigger acute angle; it goes in the next box.']];
          var lgBad = [[mode === 'times' ? 2 * lg : 180 - (180 - (lg - sm)) / 2, 'u7l1-acute-sum', 'The two acute angles add to 90°, not 180°.'], [sm, 'u7l1-angles', 'That is the smaller acute angle.']];
          var p = fieldsPart(prompt, [angSpec('Smaller acute angle:', sm, smBad, 'Smaller acute angle'), angSpec('Larger acute angle:', lg, lgBad, 'Larger acute angle'), angSpec('Third angle:', 90, [[180 - sm - lg + 90, 'u7l1-angles', 'It is a right triangle.']], 'Third angle')], sol, ['The two acute angles of a right triangle add up to 90°.', 'Guess and check: try two angles that fit the rule and see if they add to 90°.'], 'acute ' + mode + ' ' + sm);
          p.bad = [[nS(lg), nS(sm), '90']];
          return p;
        } }] },
      { num: '15', stem: '', parts: [
        { id: 'e15', level: 'MAS', make: function (r) {
          var a = r.int(5, 12), up = r.chance(0.7), lo2 = a * a, hi2 = (a + 1) * (a + 1), mid2 = q((a + 0.5) * (a + 0.5)), want = [];
          for (var n = lo2 + 1; n < hi2; n++) if (up ? n > mid2 : n < mid2) want.push(n);
          var p = { prompt: 'Find every whole number ' + t('n') + ' so that ' + t('\\sqrt{n}') + ' is between ' + a + ' and ' + (a + 1) + ' <b>and</b> closer to ' + (up ? a + 1 : a) + ' than to ' + (up ? a : a + 1) + '.', input: { type: 'list' }, check: listChk(want, a, mid2, hi2, lo2, up), key: want,
            answer: want.map(function (x) { return t(x); }).join(', '),
            solution: br([t('\\sqrt{n}') + ' is between ' + a + ' and ' + (a + 1) + ' when ' + t('n') + ' is between ' + lo2 + ' and ' + hi2 + '.', 'Halfway is ' + (a + 0.5) + ', and ' + t((a + 0.5) + '^2=' + mid2) + '. So ' + t('\\sqrt{n}') + ' is closer to ' + (up ? a + 1 : a) + ' when ' + t('n') + ' is ' + (up ? 'more' : 'less') + ' than ' + mid2 + ':', t('n=' + want.join(',\\ '))]),
            hints: ['Square ' + a + ' and ' + (a + 1) + ' to find where n starts and stops.', 'Find the halfway point: ' + t((a + 0.5) + '^2') + '.'], text: 'list ' + a + (up ? 'up' : 'down') };
          p.bad = [want.concat([hi2]), want.concat([up ? Math.floor(mid2) : Math.ceil(mid2)])];
          return p;
        } }] }
    ]
  });

  /* kit for later Unit 7 lessons */
  HW.u7l1 = { triSVG: triSVG, sceneSVG: sceneSVG, sqBad: sqBad, rootBad: rootBad, exChk: exChk, fieldsPart: fieldsPart, numP: numP, nearP: nearP, angP: angP, sqrtWork: sqrtWork };
})(window);
