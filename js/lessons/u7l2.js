/* Math 10-3 · Unit 7 · Lesson 2 — The Pythagorean Theorem: Finding the Hypotenuse (G2)
 * Assignment 2 (u7_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u7_ep02.tex: A Skills 1–5, B Applying 6–12,
 * C Stretch 13–15). Every part is a generator: the same kind of triangle (a Pythagorean triple, a decimal triple, two
 * non-square leg areas, legs that need rounding, an isosceles right triangle, a 1 : 12 ramp, feet and inches, a two-step
 * figure, a 3-D box…) as the booklet item, new numbers around the booklet's (the booklet's own numbers are among the
 * possible values; the lesson's worked-example numbers — 3-4, 6-8, 5-12, 8-15, 20-21, 7.5-4, 11-6, the 48 × 27 TV, the
 * 140 × 90 park, the 5 ft 3 in × 7 ft stringer — are left out). Calculator allowed.
 * Answers: lengths to the nearest tenth unless the booklet says otherwise (exact answers are typed as they are; "13" and
 * "13.0" are both right); the ramp to the nearest centimetre; feet-and-inches answers in two boxes; money to the cent.
 * An unrounded answer gets a "now round it" nudge; a unit typed in the box gets a nudge. Recognised mistakes each get
 * their own hint (HW.geo.lenChk): c² given without the square root, the legs added without squaring, the squares
 * subtracted, 2a for a²; plus: minutes used as hours, the speeds used instead of the distances, feet-and-inches written as
 * a decimal (3 ft 4 in as 3.4 ft), a decimal of a foot read as inches, one wire instead of all of them, the wrong side
 * alone in the equation.
 * Conversions: the "squares on the sides" and "complete the table" tables → the fill-in table (given cells shown, each
 * blank a box; the leg table split into two tables of two rows); "name the hypotenuse and write the theorem with the
 * triangle's letters" → multiple choice of equations; "who is correct / explain the mistakes / how could they tell" →
 * multiple choice of reasons; "yes or no, and where is the right angle" → multiple choice (yes + where / no + why);
 * "one way it was used long ago and today" → multiple choice of pairs; "work out c² and compare" → two boxes; "explain
 * why…" / "is it a 27-inch monitor?" / "will it fit?" / "which is longer?" → a number part for the evidence plus a
 * multiple choice for the decision and reason.
 * Outcome G2 throughout. Levels: LIM BEG EMG PRG ADV MAS (MAS: the feet-and-inches loading ramp, the snowmobiles,
 * x then y, the rafter in feet and inches, the box diagonal).
 * Uses HW.u7l1 (js/lessons/u7l1.js: exChk, sqBad, rootBad, numP, fieldsPart) and HW.pctKit (u1l7.js: tables, money). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, G = HW.geo, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, U = HW.u7l1, PK = HW.pctKit;

  /* ================= numbers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function raw(x, k) { var s = +x.toFixed(k || 3); return HW.fmt(String(s)) + (same(x, s) ? '' : '\\ldots'); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return Math.abs(r * r - n) < 1e-9; }
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function range(a, b, step) { var o = []; for (var x = a; x <= b + 1e-9; x += (step || 1)) o.push(q(x)); return o; }
  function pickNot(r, arr, not) { var a = arr.filter(function (x) { return (not || []).indexOf(x) < 0; }); return r.pick(a.length ? a : arr); }
  function uT(u) { return u ? '\\text{ ' + u + '}' : ''; }
  function L(x, u) { return t(N(x) + uT(u)); }
  function exact(c) { return same(c, rd(c, 1)); }
  var NAMES = [['Jordan', 'm'], ['Ava', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Liam', 'm'], ['Priya', 'f'], ['Noah', 'm'], ['Zoe', 'f'], ['Kai', 'm'], ['Leah', 'f'], ['Owen', 'm'], ['Sara', 'f']];
  /* whole-number triples (worked-example ones left out) */
  var TRIPLES = [[7, 24, 25], [12, 16, 20], [9, 12, 15], [15, 20, 25], [10, 24, 26], [9, 40, 41], [12, 35, 37], [18, 24, 30], [11, 60, 61], [16, 30, 34], [33, 56, 65], [28, 45, 53], [13, 84, 85], [39, 80, 89], [48, 55, 73], [36, 77, 85], [14, 48, 50], [24, 32, 40], [21, 28, 35], [16, 63, 65]];
  var EXCL = [[3, 4], [6, 8], [5, 12], [8, 15], [20, 21], [7.5, 4], [11, 6], [48, 27], [140, 90]];
  function excluded(a, b) { return EXCL.some(function (e) { return (same(e[0], a) && same(e[1], b)) || (same(e[0], b) && same(e[1], a)); }); }

  /* ================= checkers / parts ================= */
  function cleanBad(bad, ans) { var seen = []; return (bad || []).filter(function (b) { if (!b || !isFinite(b[0]) || same(b[0], ans) || seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true; }); }
  function alts(bad) { return (bad || []).filter(function (b) { return b && isFinite(b[0]); }).map(function (b) { return { v: b[0], code: b[1], hint: b[2] }; }); }
  /* the Pythagorean working for the hypotenuse */
  function pythSol(a, b, u, dp, name) {
    var S = q(a * a + b * b), c = Math.sqrt(S), cn = name || 'c';
    return br([t('a^2+b^2=c^2'), t(N(a) + '^2+' + N(b) + '^2=' + cn + '^2'), t(N(q(a * a)) + '+' + N(q(b * b)) + '=' + N(S)),
      t(cn + '=\\sqrt{' + N(S) + '}=' + (exact(c) ? N(rd(c, 1)) : raw(c) + '\\approx ' + fx(c, dp == null ? 1 : dp))) + (u ? ' ' + u : ''),
      'Check: ' + t(fx(c, dp == null ? 1 : dp) + '>' + N(Math.max(a, b))) + ' and ' + t(fx(c, dp == null ? 1 : dp) + '<' + N(q(a + b))) + ' ✓']);
  }
  /* the hypotenuse from two legs (nearest tenth unless o.dp) */
  function lenP(prompt, a, b, o) {
    o = o || {}; var c = Math.sqrt(a * a + b * b), dp = o.dp == null ? 1 : o.dp;
    var p = G.P.len(prompt, c, { dp: dp, unit: o.unit, nr: o.nr, pyth: { legs: [a, b] }, alts: alts(o.bad), sol: o.sol || pythSol(a, b, o.unit, dp), hints: o.hints || ['Square each leg and add: ' + t('c^2=a^2+b^2') + '.', 'Then take the square root (2nd x²) to find c.'], text: o.text || 'hyp ' + a + ',' + b });
    p.bad = [q(a * a + b * b), q(a + b)].concat((o.bad || []).map(function (x) { return x[0]; })).filter(function (v) { return Math.abs(rd(v, dp) - rd(c, dp)) > 1e-9; }).map(function (v) { return rd(v, dp).toFixed(dp); });
    return p;
  }
  function mc(r, prompt, opts, sol, hints, text, keep) { return P.mc(r, prompt, opts, sol, hints, text, keep); }
  /* feet and inches in two boxes; ans = total inches (whole) */
  function ftIn(x) { return { ft: Math.floor(x / 12), inch: x - 12 * Math.floor(x / 12) }; }
  function ftInChk(ans, o) {
    o = o || {};
    return function (resp) {
      resp = resp || []; var a = HW.parse.number(String(resp[0] == null ? '' : resp[0]).replace(/\s*(ft|feet|')\s*$/i, '')), b = HW.parse.number(String(resp[1] == null ? '' : resp[1]).replace(/\s*(in|inches|")\s*$/i, ''));
      if (!a.ok || !b.ok) return form('empty', 'Fill in both boxes: whole feet in the first, inches in the second (type 0 if there are no inches).');
      if (a.value % 1 || b.value < 0) return form('u7l2-ft-whole', 'Give a whole number of feet, and the inches left over in the second box.');
      if (b.value >= 12) { if (same(12 * a.value + b.value, ans)) return form('u7l2-regroup', 'Right length — but ' + N(b.value) + ' in is 12 in or more. Change 12 in into 1 more foot.'); }
      var tot = 12 * a.value + b.value;
      if (same(tot, ans)) return ok();
      if (Math.abs(tot - ans) === 1 && o.exact != null && Math.abs(o.exact - ans) < 0.5) return wrong('u7l2-round-dir', 'Check the rounding to the nearest inch: ' + t(raw(o.exact) + '\\text{ in}') + '.');
      for (var i = 0; o.bad && i < o.bad.length; i++) { var bb = o.bad[i]; if ((bb.tot != null && same(tot, bb.tot)) || (bb.ft != null && same(a.value, bb.ft) && same(b.value, bb.inch))) return wrong(bb.code, bb.hint); }
      return wrong('value', null);
    };
  }
  function ftInPart(prompt, ans, o) {
    var f = ftIn(ans);
    var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: '', name: 'Feet', after: 'ft' }, { label: '', name: 'Inches', after: 'in' }] }, check: ftInChk(ans, o), key: [String(f.ft), String(f.inch)],
      answer: t(f.ft + '\\text{ ft }' + f.inch + '\\text{ in}'), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = [[String(f.ft), String(f.inch + 1 > 11 ? f.inch - 1 : f.inch + 1)]];
    return p;
  }

  /* ================= figures ================= */
  /* a right triangle with capital-letter vertices and small-letter sides (the right angle at set[ri]) */
  function letterFig(set, ri, sh, rot, sideNames) {
    var o = [0, 1, 2].filter(function (j) { return j !== ri; }), Rr = (rot || 0) * Math.PI / 180, pts = {}, raw0 = {};
    raw0[set[ri]] = [0, 0]; raw0[set[o[0]]] = [sh[0], 0]; raw0[set[o[1]]] = [0, sh[1]];
    Object.keys(raw0).forEach(function (k) { var x = raw0[k][0], y = raw0[k][1]; pts[k] = [x * Math.cos(Rr) - y * Math.sin(Rr), x * Math.sin(Rr) + y * Math.cos(Rr)]; });
    var lab = function (i) { return sideNames ? sideNames[i] : set[i].toLowerCase(); };
    return HW.fig({ pts: pts, segs: [[set[ri], set[o[0]], lab(o[1])], [set[ri], set[o[1]], lab(o[0])], [set[o[0]], set[o[1]], lab(ri)]], right: [[set[ri], set[o[0]], set[o[1]]]], width: 230, aria: 'right triangle ' + set.join('') });
  }
  function legFig(a, b, u, o) {
    o = o || {};
    return G.rightTriSVG({ a: a, b: b, right: o.right || 'br', rot: o.rot || 0, names: false, sides: { a: N(a) + ' ' + u, b: N(b) + ' ' + u, c: o.c || 'c' }, width: 240, px: 190 });
  }

  HW.addCodes({
    'u7l2-leg-sum': 'Added the leg squares wrong / multiplied them', 'u7l2-area-root': 'Gave the hypotenuse length as the area (no square root)', 'u7l2-root-legs': 'Added the leg lengths instead of the areas',
    'u7l2-eq-wrong-hyp': 'Put a leg alone in the Pythagorean equation', 'u7l2-eq-no-squares': 'Wrote the equation without squares', 'u7l2-who': 'Chose the wrong student', 'u7l2-why': 'Wrong explanation of the mistakes',
    'u7l2-reasonable': 'Wrong check for a reasonable hypotenuse', 'u7l2-compare': 'Hinge: wrong c² or a² + b²', 'u7l2-counter': 'Wrong reason the theorem needs a right angle', 'u7l2-right-where': 'Wrong place for the right angle',
    'u7l2-said-no': 'Said there is no right angle', 'u7l2-said-yes': 'Said there is a right angle', 'u7l2-history': 'Mixed up the history of the theorem', 'u7l2-one-wire': 'Found the cost of one wire only',
    'u7l2-no-length': 'Multiplied the number of wires by the price only', 'u7l2-ft-decimal': 'Wrote feet and inches as a decimal (3 ft 4 in as 3.4 ft)', 'u7l2-dec-inches': 'Read a decimal of a foot as inches',
    'u7l2-no-convert': 'Mixed feet and inches without converting', 'u7l2-minutes': 'Used minutes as hours', 'u7l2-per-hour': 'Used the speeds (1 hour) instead of the distances', 'u7l2-ft-whole': 'Feet not a whole number',
    'u7l2-regroup': 'Inches 12 or more (not regrouped)', 'u7l2-round-dir': 'Rounded to the wrong inch', 'u7l2-y-early': 'Used a rounded x for y', 'u7l2-x-for-y': 'Used a leg of the small triangle in the big one',
    'u7l2-decide': 'Wrong decision from the numbers', 'u7l2-statement': 'Chose a false statement about the theorem', 'u7l2-mc-subtract': 'Subtracted the legs', 'u7l2-mc-add': 'Added the legs', 'u7l2-mc-no-root': 'Forgot the square root',
    'u7l2-shorter-total': 'Gave a distance instead of how much shorter', 'u7l2-box-base': 'Used the bottom diagonal as the answer', 'u7l2-box-3add': 'Added the three edges', 'u7l2-ramp-unit': 'Ramp: rounded to the tenth instead of the centimetre'
  });
  HW.addPartial({ 'u7l2-area-root': 'b', 'u7l2-ft-decimal': 'b', 'u7l2-dec-inches': 's', 'u7l2-regroup': 's', 'u7l2-round-dir': 's', 'u7l2-one-wire': 'b', 'u7l2-minutes': 'b', 'u7l2-per-hour': 'b', 'u7l2-y-early': 's', 'u7l2-box-base': 'b' });

  /* ================= builders ================= */
  /* Q1 / extra A2: squares on the legs → square on the hypotenuse and its length */
  function areaRowChks(A, B, rn) {
    var S = q(A + B), c = Math.sqrt(S);
    return [U.exChk(S, [[A * B, 'u7l2-leg-sum', 'The two leg squares <b>add</b> to the square on the hypotenuse.'], [Math.abs(B - A), 'u7l2-leg-sum', 'Add the two leg squares (don’t subtract) — the hypotenuse square is the biggest.'], [Math.sqrt(A) + Math.sqrt(B), 'u7l2-root-legs', 'That adds the leg lengths. Add the <b>areas</b> of the two squares.']]),
      U.exChk(c, [[S, 'u7l2-area-root', 'That is the <b>area</b> of the square. Its side (the hypotenuse) is the square root: ' + t('\\sqrt{' + N(S) + '}') + '.'], [Math.sqrt(A) + Math.sqrt(B), 'u7l2-root-legs', 'The legs don’t add up to the hypotenuse. Take the square root of the hypotenuse square.'], [S / 2, 'u7l1-half', 'A square root is not half. What number times itself makes ' + N(S) + '?']])];
  }
  function areaTable(rows) {
    var cols = ['\\text{Leg square}', '\\text{Other leg square}', '\\text{Hyp. square}', '\\text{Hyp. length}'], blanks = [], keyCells = [], sol = [], cells = [];
    rows.forEach(function (rw, i) {
      var ch = areaRowChks(rw.A, rw.B), S = q(rw.A + rw.B), c = Math.sqrt(S), rn = '(' + 'abc'[i] + ') ';
      blanks.push({ where: 'cell', i: i, j: 2, name: rn + 'hypotenuse square', chk: ch[0] }, { where: 'cell', i: i, j: 3, name: rn + 'hypotenuse length', chk: ch[1] });
      cells.push([N(rw.A) + '\\text{ ' + rw.u + '}^2', N(rw.B) + '\\text{ ' + rw.u + '}^2', null, null]);
      keyCells.push([cells[i][0], cells[i][1], nS(S), nS(c)]);
      sol.push(rn + t(N(rw.A) + '+' + N(rw.B) + '=' + N(S) + '\\text{ ' + rw.u + '}^2') + '; ' + t('\\sqrt{' + N(S) + '}=' + N(c) + '\\text{ ' + rw.u + '}'));
    });
    var key = { rows: rows.map(function (x, i) { return '\\text{(' + 'abc'[i] + ')}'; }), cols: cols, cells: keyCells };
    return PK.tablePart('Use the areas of the squares on the legs to complete the table. (Type the numbers only; the units are in each row.)<br>' + G.rightTriSVG({ a: 3, b: 4, squares: true, names: false, width: 240, px: 120, size: 17 }),
      { rows: key.rows, cols: cols, cells: cells, corner: '\\phantom{0}', keys: 'pctkit-money', help: 'Tap a box, then type the number.' }, PK.tableChk(blanks), key,
      'Add the two leg squares to get the square on the hypotenuse. Its side is the hypotenuse: take the square root.<br>' + sol.join('<br>'),
      ['The square on the hypotenuse = the two leg squares added together.', 'The hypotenuse is the <b>side</b> of that square: take its square root.'], 'area table ' + rows.map(function (x) { return x.A + '+' + x.B; }).join(','));
  }
  /* Q3: legs → a², b², c², c */
  function legTable(rows, letters, label) {
    var cols = ['a', 'b', 'a^2', 'b^2', 'c^2', 'c'], blanks = [], keyCells = [], sol = [], cells = [];
    rows.forEach(function (rw, i) {
      var a = rw[0], b = rw[1], S = q(a * a + b * b), c = Math.sqrt(S), rn = '(' + letters[i] + ') ';
      blanks.push({ where: 'cell', i: i, j: 2, name: rn + 'a²', chk: U.exChk(q(a * a), U.sqBad(a)) }, { where: 'cell', i: i, j: 3, name: rn + 'b²', chk: U.exChk(q(b * b), U.sqBad(b)) },
        { where: 'cell', i: i, j: 4, name: rn + 'c²', chk: U.exChk(S, [[q(a + b), 'pyth-add-sides', 'Add the <b>squares</b>: ' + t('a^2+b^2') + '.'], [q(Math.abs(b * b - a * a)), 'pyth-subtract', 'For the hypotenuse, <b>add</b> the squares.'], [q(a * a * b * b), 'u7l2-leg-sum', 'Add the squares, don’t multiply them.']]) },
        { where: 'cell', i: i, j: 5, name: rn + 'c', chk: U.exChk(c, [[S, 'pyth-no-root', 'That is ' + t('c^2') + '. Take the <b>square root</b> to find c.'], [q(a + b), 'pyth-add-sides', 'The hypotenuse is not the legs added. ' + t('c=\\sqrt{c^2}') + '.'], [S / 2, 'u7l1-half', 'A square root is not half.']]) });
      cells.push([N(a), N(b), null, null, null, null]);
      keyCells.push([N(a), N(b), nS(a * a), nS(b * b), nS(S), nS(c)]);
      sol.push(rn + t(N(a) + '^2=' + N(q(a * a))) + ', ' + t(N(b) + '^2=' + N(q(b * b))) + ', ' + t('c^2=' + N(q(a * a)) + '+' + N(q(b * b)) + '=' + N(S)) + ', ' + t('c=\\sqrt{' + N(S) + '}=' + N(c)));
    });
    var key = { rows: rows.map(function (x, i) { return '\\text{(' + letters[i] + ')}'; }), cols: cols, cells: keyCells };
    return PK.tablePart('Each row is a right triangle with legs ' + t('a') + ' and ' + t('b') + ' and hypotenuse ' + t('c') + '. Complete the table. (The answers come out to whole numbers or tenths.)' + (label ? ' ' + label : ''),
      { rows: key.rows, cols: cols, cells: cells, corner: '\\phantom{0}', keys: 'pctkit-money', help: 'Tap a box, then type the number.' }, PK.tableChk(blanks), key, sol.join('<br>'),
      ['Square each leg (x² key), then add: ' + t('c^2=a^2+b^2') + '.', 'Take the square root of ' + t('c^2') + ' to get c.'], 'leg table ' + rows.map(function (x) { return x.join('-'); }).join(','));
  }
  /* "write the Pythagorean theorem with the triangle's letters": multiple choice of equations */
  function eqMC(r, prompt, legs, hyp, extraSol) {
    var sq = function (x) { return x + '^2'; };
    var opts = [{ html: t(sq(legs[0]) + '+' + sq(legs[1]) + '=' + sq(hyp)), right: true },
      { html: t(sq(legs[0]) + '+' + sq(hyp) + '=' + sq(legs[1])), why: 'Side ' + t(hyp) + ' is across from the right angle: it is the hypotenuse, so ' + t(sq(hyp)) + ' goes alone.', code: 'u7l2-eq-wrong-hyp' },
      { html: t(sq(legs[1]) + '+' + sq(hyp) + '=' + sq(legs[0])), why: 'Side ' + t(hyp) + ' is across from the right angle: it is the hypotenuse, so ' + t(sq(hyp)) + ' goes alone.', code: 'u7l2-eq-wrong-hyp' },
      { html: t(legs[0] + '+' + legs[1] + '=' + hyp), why: 'The theorem uses the <b>squares</b> of the sides.', code: 'u7l2-eq-no-squares' }];
    return mc(r, prompt, opts, (extraSol ? extraSol + '<br>' : '') + 'The hypotenuse is ' + t(hyp) + ' (across from the right angle), so ' + t(sq(hyp)) + ' goes alone: ' + t(sq(legs[0]) + '+' + sq(legs[1]) + '=' + sq(hyp)) + '.', ['Find the right angle. The side across from it is the hypotenuse.'], 'eq ' + legs.join('') + hyp);
  }
  var LSETS = [['D', 'E', 'F'], ['K', 'L', 'M'], ['G', 'H', 'J'], ['S', 'T', 'U'], ['X', 'Y', 'Z'], ['R', 'S', 'T'], ['A', 'B', 'C'], ['U', 'V', 'W']];
  function lettersEq(r, label, setPool) {
    var set = r.pick(setPool || LSETS), ri = r.int(0, 2), o = [0, 1, 2].filter(function (j) { return j !== ri; }), sh = r.pick([[3.6, 2.4], [3, 2.2], [2.6, 3.4], [4, 2.6]]), rot = r.pick([0, 90, 180, 270, 30, -35]);
    var fig = letterFig(set, ri, sh, rot), lw = function (i) { return set[i].toLowerCase(); };
    return eqMC(r, label + 'Which equation is the Pythagorean theorem for this triangle?<br>' + fig, [lw(o[0]), lw(o[1])], lw(ri), 'The right angle is at ' + set[ri] + '. The hypotenuse is ' + t(lw(ri)) + ', across from it.');
  }
  /* Q5: three students */
  function trioShared(r) {
    var tr = r.pick([[15, 20, 25], [9, 12, 15], [12, 16, 20], [7, 24, 25], [10, 24, 26], [18, 24, 30], [9, 40, 41]]), u = r.pick(['cm', 'm', 'in']);
    var ppl = r.sample(NAMES, 3), roles = r.shuffle(['add', 'noroot', 'right']);
    return { a: tr[0], b: tr[1], c: tr[2], S: tr[0] * tr[0] + tr[1] * tr[1], u: u, ppl: ppl, roles: roles };
  }
  function trioStem(sh) {
    var w = function (role) { return role === 'add' ? t(sh.a + '+' + sh.b + '=' + (sh.a + sh.b)) + ' ' + sh.u : role === 'noroot' ? t(sh.a + '^2+' + sh.b + '^2=' + N(sh.S)) + ', so ' + t('c=' + N(sh.S)) + ' ' + sh.u : t(sh.a + '^2+' + sh.b + '^2=' + N(sh.S)) + ', ' + t('\\sqrt{' + N(sh.S) + '}=' + sh.c) + ' ' + sh.u; };
    return 'A right triangle has legs of ' + L(sh.a, sh.u) + ' and ' + L(sh.b, sh.u) + '. Three students found the hypotenuse.<br>' + sh.ppl.map(function (p, i) { return '<b>' + p[0] + ':</b> ' + w(sh.roles[i]); }).join('<br>');
  }
  function who(sh, role) { return sh.ppl[sh.roles.indexOf(role)][0]; }
  /* yes/no situations */
  var SITS = {
    ladder: [{ s: 'A ladder leans against the wall of a house on flat ground.', at: 'where the wall meets the ground', bad: 'at the top of the ladder, where it touches the wall', no: 'a ladder is slanted, so nothing makes a square corner' },
      { s: 'A flagpole stands straight up on level ground, and a rope runs from its top to a peg in the ground.', at: 'where the pole meets the ground', bad: 'where the rope meets the peg', no: 'the rope is slanted, so there is no square corner' },
      { s: 'A wheelchair ramp runs from the sidewalk up to a doorway in a wall that goes straight up.', at: 'where the wall meets the sidewalk, under the doorway', bad: 'where the ramp meets the sidewalk', no: 'a ramp is slanted, so there is no square corner' }],
    no: [{ s: 'A slice cut from a round pizza.', yes: 'at the point of the slice', yes2: 'where the crust meets a cut edge', why: 'The point of a slice is a small angle (much less than 90°), and the crust is curved, so it is not even a triangle with straight sides.' },
      { s: 'A yield sign (a triangle with all three sides equal).', yes: 'at the bottom corner', yes2: 'at every corner', why: 'All three sides are equal, so all three angles are 60°. None is 90°.' },
      { s: 'A roof truss whose two bottom angles are both 30°.', yes: 'at the peak', yes2: 'at each bottom corner', why: 'The angles are 30°, 30° and 120°. None is 90°.' }],
    travel: [{ s: 'A cyclist rides due west, then turns and rides due south.', at: 'where west turns to south', bad: 'where the cyclist started' },
      { s: 'A hiker walks due north, then turns and walks due east.', at: 'where north turns to east', bad: 'where the hiker started' },
      { s: 'A boat sails due east, then turns and sails due north.', at: 'where east turns to north', bad: 'where the boat started' }],
    rect: [{ s: 'The diagonal of a rectangular phone screen.', at: 'at the corner of the screen (the one the diagonal does not touch)', bad: 'where the diagonal meets a corner' },
      { s: 'A diagonal brace across a rectangular gate.', at: 'at a corner of the gate (the one the brace does not touch)', bad: 'where the brace meets a corner' },
      { s: 'Walking straight across a rectangular field from one corner to the opposite corner.', at: 'at a corner of the field (the one the path does not touch)', bad: 'where the path starts' }]
  };
  function sitPart(r, kind) {
    var it = r.pick(SITS[kind]), opts, sol;
    if (kind === 'no') {
      opts = [{ html: '<b>No</b>: there is no right angle.', right: true }, { html: '<b>Yes</b>: the right angle is ' + it.yes + '.', why: it.why, code: 'u7l2-said-yes' }, { html: '<b>Yes</b>: the right angle is ' + it.yes2 + '.', why: it.why, code: 'u7l2-said-yes' }];
      sol = '<b>No.</b> ' + it.why;
    } else {
      opts = [{ html: '<b>Yes</b>: the right angle is ' + it.at + '.', right: true }, { html: '<b>Yes</b>: the right angle is ' + it.bad + '.', why: 'That corner is not a square corner. Look for two lines that meet at 90° (straight up and level, or north/south and east/west, or the corner of a rectangle).', code: 'u7l2-right-where' },
        { html: '<b>No</b>: ' + (it.no || 'there is no square corner') + '.', why: 'Look again: ' + (kind === 'travel' ? 'compass directions like north and east meet at 90°.' : kind === 'rect' ? 'every corner of a rectangle is 90°.' : 'something straight up on level ground makes a 90° corner.'), code: 'u7l2-said-no' }];
      sol = '<b>Yes.</b> The right angle is ' + it.at + '.';
    }
    var p = mc(r, it.s + '<br>Does this make a right triangle? If yes, where is the right angle?', opts, sol, ['Look for a square corner: straight up meeting level ground, two compass directions like north and east, or the corner of a rectangle.'], 'sit ' + it.s.slice(0, 20));
    p.input.columns = 1; return p;
  }
  /* a two-step check on a decision */
  function ynMC(r, prompt, yes, yesTxt, noTxt, yesWhy, noWhy, sol) {
    var p = mc(r, prompt, [{ html: '<b>Yes</b>: ' + yesTxt, right: yes, why: yes ? null : yesWhy, code: 'u7l2-decide' }, { html: '<b>No</b>: ' + noTxt, right: !yes, why: yes ? noWhy : null, code: 'u7l2-decide' }], sol, ['Compare the length you worked out with the one in the question.'], 'yn ' + prompt.slice(0, 30), true);
    p.tries = 1; p.input.columns = 1; return p;
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u7l2', unit: 7, num: '2', title: 'The Pythagorean Theorem: Finding the Hypotenuse', outcome: 'G2',
    blurb: 'The squares on the sides of a right triangle, a² + b² = c², finding the hypotenuse (exact and to the nearest tenth), why it needs a right angle, and real problems: screens, ramps, guy wires, diamonds, stairs and travel.',
    questions: [
      { num: '1', stem: 'A square is drawn on each side of a right triangle.', parts: [
        { id: '1', level: 'EMG', make: function (r) {
          var trs = find(function () { return r.sample(TRIPLES.filter(function (x) { return x[2] <= 41; }), 2); }, function (v) { return v[0][2] !== v[1][2]; }, [[7, 24, 25], [12, 16, 20]]);
          var k2 = r.pick([16, 25, 36, 49, 64, 81, 100]), A3 = find(function () { return r.int(2, k2 - 2); }, function (A) { return !isSq(A) && !isSq(k2 - A) && A < k2 - A; }, 7);
          var us = r.shuffle(['cm', 'm', 'in', 'ft']);
          return areaTable([{ A: trs[0][0] * trs[0][0], B: trs[0][1] * trs[0][1], u: us[0] }, { A: trs[1][0] * trs[1][0], B: trs[1][1] * trs[1][1], u: us[1] }, { A: A3, B: k2 - A3, u: us[2] }]);
        } }] },
      { num: '2', stem: 'For each right triangle, name the hypotenuse. Then write the Pythagorean theorem using the triangle’s letters.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return lettersEq(r, '(a) ', LSETS.slice(0, 4)); } },
        { id: '2b', level: 'BEG', make: function (r) { return lettersEq(r, '(b) ', LSETS.slice(4)); } },
        { id: '2c', level: 'EMG', make: function (r) {
          var ctx = r.pick([{ s: 'A gate with a diagonal brace', w: 'w', h: 'h', g: 'g', lw: 'width', lh: 'height', lg: 'brace' }, { s: 'A rectangular window with a diagonal', w: 'w', h: 'h', g: 'd', lw: 'width', lh: 'height', lg: 'diagonal' }, { s: 'A ramp beside a step', w: 'r', h: 'h', g: 's', lw: 'run', lh: 'rise', lg: 'ramp' }]);
          var fig = HW.fig({ pts: { P: [0, 0], Q: [4, 0], R: [4, 2.6], S: [0, 2.6] }, segs: ctx.lg === 'ramp' ? [['P', 'Q', ctx.lw + ' ' + ctx.w], ['Q', 'R', ctx.lh + ' ' + ctx.h], ['P', 'R', ctx.lg + ' ' + ctx.g, { color: '#9a6a24', width: 3 }]] : [['P', 'Q', ctx.lw + ' ' + ctx.w], ['Q', 'R', ctx.lh + ' ' + ctx.h], ['R', 'S'], ['S', 'P'], ['P', 'R', ctx.lg + ' ' + ctx.g, { color: '#9a6a24', width: 3 }]], right: [['Q', 'P', 'R']], names: false, width: 240 });
          return eqMC(r, '(c) ' + ctx.s + '. Which equation is the Pythagorean theorem for the right triangle?<br>' + fig, [ctx.w, ctx.h], ctx.g, 'The corner between the ' + ctx.lw + ' and the ' + ctx.lh + ' is 90°, so the ' + ctx.lg + ' ' + t(ctx.g) + ' is the hypotenuse.');
        } }] },
      { num: '3', stem: '', shared: function (r) {
          var w = r.sample(TRIPLES.filter(function (x) { return x[2] <= 41 && x[0] < 20; }), 2), d = r.pick([[0.9, 1.2], [1.5, 2], [0.5, 1.2], [2.1, 2.8], [1.2, 1.6], [0.7, 2.4], [1.8, 2.4], [2.4, 3.2]]), big = r.pick([[11, 60], [9, 40], [13, 84], [33, 56], [28, 45], [16, 63], [39, 80], [48, 55]]);
          return { rows: [w[0].slice(0, 2), w[1].slice(0, 2), d, big] };
        }, parts: [
        { id: '3a', sub: 'a–b', level: 'EMG', make: function (r, sh) { return legTable(sh.rows.slice(0, 2), 'ab', 'Rows (a) and (b).'); } },
        { id: '3b', sub: 'c–d', level: 'PRG', make: function (r, sh) { return legTable(sh.rows.slice(2), 'cd', 'Rows (c) and (d).'); } }] },
      { num: '4', stem: 'Find the length of the hypotenuse, to the nearest tenth. Check that each answer is reasonable.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(6, 15), r.int(3, 9)]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return v[0] > v[1] + 1 && !isSq(S) && safe(Math.sqrt(S)) && !excluded(v[0], v[1]); }, [9, 5]); return lenP('(a)<br>' + legFig(v[0], v[1], 'cm', { right: 'bl' }), v[0], v[1], { unit: 'cm' }); } },
        { id: '4b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(15, 35) / 10, r.int(25, 50) / 10]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return v[1] > v[0] + 0.4 && !isSq(q(S)) && safe(Math.sqrt(S)) && decs(v[0]) === 1 && !excluded(v[0], v[1]); }, [2.4, 3.7]); return lenP('(b)<br>' + legFig(v[1], v[0], 'm', { right: 'tr' }), v[0], v[1], { unit: 'm' }); } },
        { id: '4c', level: 'EMG', make: function (r) { var s = find(function () { return r.int(6, 24); }, function (s) { return safe(s * Math.SQRT2); }, 14); return lenP('(c)<br>' + legFig(s, s, 'in', { right: 'br' }), s, s, { unit: 'in' }); } }] },
      { num: '5', stem: function (sh) { return trioStem(sh); }, shared: trioShared, parts: [
        { id: '5a', level: 'BEG', make: function (r, sh) {
          var opts = sh.ppl.map(function (p, i) { var role = sh.roles[i]; return { html: p[0], right: role === 'right', why: role === 'add' ? p[0] + ' added the legs. The hypotenuse is not the legs added together.' : role === 'noroot' ? p[0] + ' found ' + t('c^2') + ' but stopped. ' + N(sh.S) + ' is ' + t('c^2') + ', not c.' : null, code: 'u7l2-who' }; });
          opts.push({ html: 'None of them', why: 'Check each one: square the legs, add, and take the square root.', code: 'u7l2-who' });
          return mc(r, '(a) Who is correct?', opts, '<b>' + who(sh, 'right') + '</b>: ' + t(sh.a + '^2+' + sh.b + '^2=' + N(sh.S)) + ' and ' + t('\\sqrt{' + N(sh.S) + '}=' + sh.c) + ' ' + sh.u + '.', ['Work it out yourself: ' + t('c^2=a^2+b^2') + ', then the square root.'], 'who', true);
        } },
        { id: '5b', level: 'EMG', make: function (r, sh) {
          var A = who(sh, 'add'), B = who(sh, 'noroot');
          var opts = [{ html: A + ' added the legs instead of their squares. ' + B + ' found ' + t('c^2') + ' but forgot to take the square root.', right: true },
            { html: A + ' found ' + t('c^2') + ' but forgot to take the square root. ' + B + ' added the legs instead of their squares.', why: 'Look again at what each one wrote: who added ' + sh.a + ' and ' + sh.b + '?', code: 'u7l2-why' },
            { html: A + ' should have subtracted the legs. ' + B + ' should have divided ' + N(sh.S) + ' by 2.', why: 'For the hypotenuse you add the <b>squares</b>, then take the <b>square root</b> (not half).', code: 'u7l2-why' },
            { html: 'Both should have multiplied the legs: ' + t(sh.a + '\\times ' + sh.b) + '.', why: 'The theorem squares each leg and adds: ' + t('a^2+b^2=c^2') + '.', code: 'u7l2-why' }];
          return mc(r, '(b) Explain the mistake each of the other two students made.', opts, br([A + ' added the legs (' + t(sh.a + '+' + sh.b) + ') instead of adding their squares.', B + ' found ' + t('c^2=' + N(sh.S)) + ' but forgot the last step: ' + t('c=\\sqrt{' + N(sh.S) + '}=' + sh.c) + '.']), ['Compare each student’s work with ' + t('a^2+b^2=c^2') + ', then ' + t('c=\\sqrt{c^2}') + '.'], 'why');
        } },
        { id: '5c', level: 'PRG', make: function (r, sh) {
          var A = who(sh, 'add'), B = who(sh, 'noroot'), s = sh.a + sh.b, m = Math.max(sh.a, sh.b);
          var opts = [{ html: 'The hypotenuse must be longer than the longest leg (' + m + ' ' + sh.u + ') but shorter than the two legs added (' + s + ' ' + sh.u + '). ' + s + ' and ' + N(sh.S) + ' are not shorter than ' + s + '.', right: true },
            { html: 'The hypotenuse must be shorter than each leg, and ' + s + ' and ' + N(sh.S) + ' are not.', why: 'The hypotenuse is the <b>longest</b> side, so it is longer than each leg.', code: 'u7l2-reasonable' },
            { html: 'The hypotenuse is always a whole number, and ' + A + '’s and ' + B + '’s answers are not.', why: 'Hypotenuses are often decimals (like ' + t('\\sqrt{2}') + '). That is not the check.', code: 'u7l2-reasonable' },
            { html: 'The hypotenuse must equal the two legs added, so only ' + A + ' could be right.', why: 'The hypotenuse is always <b>shorter</b> than the two legs added together.', code: 'u7l2-reasonable' }];
          return mc(r, '(c) How could ' + A + ' and ' + B + ' each tell that their answer was not reasonable?', opts, 'The hypotenuse is longer than the longest leg (' + m + ' ' + sh.u + ') and shorter than the legs added (' + s + ' ' + sh.u + '). Neither ' + s + ' nor ' + N(sh.S) + ' is less than ' + s + '. ' + sh.c + ' ' + sh.u + ' fits.', ['Think about the shortest and longest the hypotenuse could be.'], 'reasonable');
        } }] },
      { num: '6', stem: function (sh) { return 'Two boards, ' + sh.a + ' ft and ' + sh.b + ' ft long, are joined at one end by a hinge.'; }, shared: function (r) {
          var tr = r.pick([[5, 12, 13], [9, 12, 15], [7, 24, 25], [12, 16, 20], [9, 40, 41], [15, 20, 25]]), closed = r.chance(0.6), ang = closed ? r.int(55, 80) : r.int(100, 125);
          var d = rd(Math.sqrt(tr[0] * tr[0] + tr[1] * tr[1] - 2 * tr[0] * tr[1] * Math.cos(ang * Math.PI / 180)), 1);
          return { a: tr[0], b: tr[1], c: tr[2], closed: closed, d: d, d2: q(d * d), S: tr[0] * tr[0] + tr[1] * tr[1] };
        }, parts: [
        { id: '6a', level: 'EMG', make: function (r, sh) { return lenP('(a) When the hinge is open to exactly 90°, how far apart are the free ends?', sh.a, sh.b, { unit: 'ft', hints: ['At 90° the boards are the legs of a right triangle.', 'Square, add, then take the square root.'] }); } },
        { id: '6b', level: 'PRG', make: function (r, sh) {
          var p = U.fieldsPart('(b) The hinge is ' + (sh.closed ? 'closed a bit, to an angle smaller than 90°' : 'opened wider, to an angle bigger than 90°') + '. Now the free ends are ' + N(sh.d) + ' ft apart. Work out ' + t('c^2') + ' (with ' + t('c=' + N(sh.d)) + ') and ' + t(sh.a + '^2+' + sh.b + '^2') + '.',
            [{ label: t('c^2='), name: 'c²', chk: U.exChk(sh.d2, U.sqBad(sh.d).concat([[sh.S, 'u7l2-compare', 'That is ' + t(sh.a + '^2+' + sh.b + '^2') + '. In this box, square the new distance, ' + N(sh.d) + '.']])), key: nS(sh.d2), show: t(N(sh.d2)) },
              { label: t(sh.a + '^2+' + sh.b + '^2='), name: sh.a + '² + ' + sh.b + '²', chk: U.exChk(sh.S, [[sh.a + sh.b, 'pyth-add-sides', 'Square each one first, then add.'], [sh.d2, 'u7l2-compare', 'That is c². Here, square ' + sh.a + ' and ' + sh.b + ' and add.']]), key: nS(sh.S), show: t(N(sh.S)) }],
            br([t('c^2=' + N(sh.d) + '^2=' + N(sh.d2)), t(sh.a + '^2+' + sh.b + '^2=' + (sh.a * sh.a) + '+' + (sh.b * sh.b) + '=' + N(sh.S)), 'They are not equal (' + t(N(sh.d2) + (sh.closed ? '<' : '>') + N(sh.S)) + ').']), ['Use the x² key for each square.'], 'hinge ' + sh.d);
          p.bad = [[nS(sh.S), nS(sh.d2)]];
          return p;
        } },
        { id: '6c', level: 'PRG', make: function (r, sh) {
          var opts = [{ html: 'The legs stay ' + sh.a + ' ft and ' + sh.b + ' ft, so ' + t(sh.a + '^2+' + sh.b + '^2') + ' is always ' + N(sh.S) + '. Only the 90° triangle has ' + t('c^2=' + N(sh.S)) + '; the other triangle is a counterexample.', right: true },
            { html: 'The theorem works for every triangle; ' + N(sh.d) + ' ft must have been measured wrong.', why: 'The ' + N(sh.d) + ' ft triangle is real: when the angle changes, the third side changes, but ' + t(sh.a + '^2+' + sh.b + '^2') + ' does not.', code: 'u7l2-counter' },
            { html: t(sh.a + '^2+' + sh.b + '^2') + ' changes when the angle changes, so it never matches.', why: 'The legs don’t change, so ' + t(sh.a + '^2+' + sh.b + '^2') + ' is always ' + N(sh.S) + '. It is c that changes.', code: 'u7l2-counter' },
            { html: 'It only works when the boards are the same length.', why: 'These boards are different lengths, and at 90° it worked: ' + t(sh.c + '^2=' + N(sh.S)) + '.', code: 'u7l2-counter' }];
          return mc(r, '(c) Use (a) and (b) to explain why the Pythagorean theorem only works for right triangles.', opts, 'The two legs stay ' + sh.a + ' ft and ' + sh.b + ' ft, but the third side changes with the angle. ' + t(sh.a + '^2+' + sh.b + '^2') + ' is always ' + N(sh.S) + ', and only the 90° triangle has ' + t('c^2=' + N(sh.S)) + '. The ' + N(sh.d) + ' ft triangle is a counterexample.', ['What stays the same when the hinge moves, and what changes?'], 'counter');
        } }] },
      { num: '7', stem: 'Which of these situations makes a right triangle? For each yes, say where the right angle is.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { return sitPart(r, 'ladder'); } },
        { id: '7b', level: 'BEG', make: function (r) { return sitPart(r, 'no'); } },
        { id: '7c', level: 'EMG', make: function (r) { return sitPart(r, 'travel'); } },
        { id: '7d', level: 'EMG', make: function (r) { return sitPart(r, 'rect'); } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'BEG', make: function (r) {
          var old = r.pick(['Babylonians wrote sets of numbers that fit ' + t('a^2+b^2=c^2') + ' on a clay tablet about 3800 years ago.', 'Writers in ancient India and China described the rule.', 'Pythagoras and his followers in ancient Greece, about 2500 years ago, studied it.']);
          var now = r.pick(['finding the size of a TV or phone screen (its diagonal)', 'working out the length of a ramp, stairs or a roof rafter', 'finding a straight-line distance on a map', 'video games working out how far apart two players are', 'carpenters checking that a corner is square']);
          var opts = [{ html: '<b>Long ago:</b> ' + old + '<br><b>Today:</b> ' + cap(now) + '.', right: true },
            { html: '<b>Long ago:</b> Video games used it to find how far apart two players are.<br><b>Today:</b> ' + cap(now) + '.', why: 'Video games are a modern use, not an ancient one.', code: 'u7l2-history' },
            { html: '<b>Long ago:</b> ' + old + '<br><b>Today:</b> It is no longer used.', why: 'It is used all the time today: screens, ramps, rafters, maps, games…', code: 'u7l2-history' },
            { html: '<b>Long ago:</b> Nobody knew the rule until about 200 years ago.<br><b>Today:</b> ' + cap(now) + '.', why: 'The rule is thousands of years old (Babylon, India, China, Greece).', code: 'u7l2-history' }];
          var p = mc(r, 'Which gives one way the Pythagorean theorem was used long ago and one way it is used today?', opts, 'For example — long ago: ' + old + ' Today: ' + now + '.', ['Think of the “Did you know?” box in the lesson.'], 'history');
          p.input.columns = 1; return p;
        } }] },
      { num: '9', stem: '', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var rise = pickNot(r, range(0.3, 0.75, 0.05), []), run = q(12 * rise), c = Math.sqrt(rise * rise + run * run);
          return lenP('A wheelchair ramp rises ' + L(rise, 'm') + ' over a horizontal distance of ' + L(run, 'm') + ' (a slope of 1 : 12). How long is the ramp’s surface, to the nearest centimetre?', rise, run,
            { dp: 2, unit: 'm', bad: [[rd(c, 1), 'u7l2-ramp-unit', 'Nearest <b>centimetre</b>: a centimetre is 0.01 m, so give 2 decimal places.']], sol: pythSol(rise, run, 'm', 2), hints: ['Rise and run are the legs; the ramp surface is the hypotenuse.', 'Nearest centimetre = 2 decimal places in metres.'], text: 'ramp ' + rise });
        } }] },
      { num: '10', stem: function (sh) { return 'A guy wire runs from a point ' + L(sh.h, 'm') + ' up a cell tower to a stake in the ground ' + L(sh.d, 'm') + ' from the base of the tower.'; }, shared: function (r) {
          var tr = r.pick([[5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29], [12, 16, 20]]), k = r.pick([0.5, 1, 1.5, 2]);
          return find(function () { return { d: q(tr[0] * k), h: q(tr[1] * k), c: q(tr[2] * k), n: r.int(2, 4), price: r.pick([3.49, 3.79, 3.99, 4.29, 4.59, 4.99, 5.49]) }; }, function (v) { return v.h >= 9 && v.h <= 48; }, { d: 7.5, h: 18, c: 19.5, n: 4, price: 4.29 });
        }, parts: [
        { id: '10a', level: 'PRG', make: function (r, sh) { return lenP('(a) How long is the wire?<br>' + legFig(sh.h, sh.d, 'm', { right: 'bl', c: 'wire' }), sh.d, sh.h, { unit: 'm', hints: ['The tower and the ground meet at 90°. The wire is the hypotenuse.'] }); } },
        { id: '10b', level: 'ADV', make: function (r, sh) {
          var len = q(sh.n * sh.c), cost = q(len * sh.price);
          return PK.moneyPart('(b) The tower needs ' + sh.n + ' wires like this. Wire costs ' + t('\\$' + sh.price.toFixed(2)) + ' per metre. Find the cost of the wire before tax.', cost,
            PK.diagFrom([[sh.c * sh.price, 'u7l2-one-wire', 'That is the cost of <b>one</b> wire. The tower needs ' + sh.n + '.'], [sh.n * sh.price, 'u7l2-no-length', 'Multiply by the length of wire too: ' + sh.n + ' × ' + N(sh.c) + ' m.'], [sh.n * (sh.h + sh.d) * sh.price, 'pyth-add-sides', 'Each wire is the hypotenuse (' + N(sh.c) + ' m), not the height plus the distance.'], [len, 'u7l2-no-length', 'That is the metres of wire. Multiply by the price per metre.']], true),
            br([t(sh.n + '\\times ' + N(sh.c) + '=' + N(len)) + ' m', t(N(len) + '\\times \\$' + sh.price.toFixed(2) + '=\\$' + cost.toFixed(2))]), ['Total length = number of wires × length of one wire.', 'Cost = total length × price per metre.'], 'wire cost ' + sh.n + 'x' + sh.c);
        } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'PRG', make: function (r) {
          var it = r.pick([{ s: 'A baseball diamond is a square with sides of 90 ft.', side: 90 }, { s: 'A softball diamond is a square with sides of 60 ft.', side: 60 }, { s: 'A softball diamond is a square with sides of 65 ft.', side: 65 }, { s: 'A Little League diamond is a square with sides of 60 ft.', side: 60 }, { s: 'A baseball diamond is a square with sides of 80 ft.', side: 80 }, { s: 'A youth baseball diamond is a square with sides of 70 ft.', side: 70 }]);
          var s = it.side, fig = HW.fig({ pts: { H: [0, 0], F: [1, 1], S: [0, 2], T: [-1, 1] }, segs: [['H', 'F', s + ' ft'], ['F', 'S', s + ' ft'], ['S', 'T'], ['T', 'H'], ['H', 'S', '?', { dash: true, color: '#c93a33' }]], right: [['F', 'H', 'S']], names: { H: 'home', F: '1st', S: '2nd', T: '3rd' }, width: 220 });
          return lenP(it.s + ' How far does the catcher throw from home plate to second base? Round to the nearest tenth of a foot.<br>' + fig, s, s, { unit: 'ft', sol: 'Home, first base and second base make a right triangle with legs ' + s + ' ft and ' + s + ' ft.<br>' + pythSol(s, s, 'ft'), hints: ['Home, first and second base make a right triangle. The throw is the hypotenuse.'], text: 'diamond ' + s });
        } }] },
      { num: '12', stem: '', parts: [
        { id: '12', level: 'MAS', make: function (r) {
          var v = find(function () { return { rf: r.int(2, 3), ri: r.int(1, 11), run: r.int(8, 14) }; }, function (v) { var rise = 12 * v.rf + v.ri, run = 12 * v.run, c = Math.sqrt(rise * rise + run * run); return safe(c, 0) && v.ri !== 0 && !(v.rf === 5 && v.ri === 3) && Math.round(c) % 12 !== 0; }, { rf: 3, ri: 4, run: 10 });
          var rise = 12 * v.rf + v.ri, run = 12 * v.run, cx = Math.sqrt(rise * rise + run * run), c = Math.round(cx), f = ftIn(c);
          var dec = Math.sqrt(Math.pow(v.rf + v.ri / 10, 2) + v.run * v.run), decIn = Math.round(dec * 12), cf = cx / 12, dFt = Math.floor(cf), dIn = Math.round((cf - dFt) * 10), dIn2 = Math.round((cf - dFt) * 100);
          var bad = [{ tot: decIn, code: 'u7l2-ft-decimal', hint: v.rf + ' ft ' + v.ri + ' in is not ' + v.rf + '.' + v.ri + ' ft. Change it to inches: ' + t(v.rf + '\\times 12+' + v.ri + '=' + rise) + ' in.' }, { ft: dFt, inch: dIn, code: 'u7l2-dec-inches', hint: t(raw(cf, 2) + '\\text{ ft}') + ' is not ' + dFt + ' ft ' + dIn + ' in. Work in inches: ' + t(c + '\\div 12') + ' is ' + f.ft + ' remainder ' + f.inch + '.' }, { ft: dFt, inch: dIn2, code: 'u7l2-dec-inches', hint: 'The decimal part of a foot is not inches. Find the remainder: ' + t(c + '-' + f.ft + '\\times 12=' + f.inch) + ' in.' }, { tot: 12 * v.rf + v.ri + run, code: 'pyth-add-sides', hint: 'Square the rise and the run, add, then take the square root.' }];
          return ftInPart('A loading ramp for a pickup truck rises ' + v.rf + ' ft ' + v.ri + ' in over a horizontal distance of ' + v.run + ' ft. How long is the ramp, to the nearest inch? Give your answer in feet and inches.', c,
            { exact: cx, bad: bad, sol: br(['Rise: ' + t(v.rf + '\\times 12+' + v.ri + '=' + rise) + ' in. Run: ' + t(v.run + '\\times 12=' + run) + ' in.', t(rise + '^2+' + run + '^2=' + N(rise * rise) + '+' + N(run * run) + '=' + N(rise * rise + run * run)), t('c=\\sqrt{' + N(rise * rise + run * run) + '}=' + raw(cx) + '\\approx ' + c) + ' in', t(c + '\\div 12=' + f.ft) + ' remainder ' + f.inch + ', so the ramp is about ' + f.ft + ' ft ' + f.inch + ' in long.']),
              hints: ['Change both lengths to inches first (1 ft = 12 in).', 'At the end, divide by 12: the whole number is feet, the remainder is inches.'], text: 'ramp ftin ' + v.rf + ',' + v.ri + ',' + v.run });
        } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'MAS', make: function (r) {
          var v = find(function () { return { v1: r.int(4, 12) * 4, v2: r.int(4, 14) * 3, tm: r.pick([20, 30, 40, 45, 90]) }; }, function (v) { var a = v.v1 * v.tm / 60, b = v.v2 * v.tm / 60, c = Math.sqrt(a * a + b * b); return v.v1 !== v.v2 && same(a * 10, Math.round(a * 10)) && same(b * 10, Math.round(b * 10)) && safe(c) && !isSq(q(a * a + b * b)); }, { v1: 32, v2: 45, tm: 30 });
          var place = r.pick(['Grande Prairie', 'Peace River', 'Hinton', 'Slave Lake']), h = v.tm / 60, a = q(v.v1 * h), b = q(v.v2 * h), tT = v.tm === 90 ? '1 h 30 min' : v.tm + ' minutes';
          return lenP('Two snowmobiles leave a cabin near ' + place + ' at the same time. One travels due north at ' + v.v1 + ' km/h. The other travels due east at ' + v.v2 + ' km/h. How far apart are they after ' + tT + ', in a straight line? Round to the nearest tenth of a kilometre.', a, b,
            { unit: 'km', bad: [[Math.sqrt(v.v1 * v.v1 + v.v2 * v.v2), 'u7l2-per-hour', 'That is how far apart they are after <b>1 hour</b>. First find each distance: speed × time, with ' + tT + ' = ' + N(h) + ' h.'], [Math.sqrt(Math.pow(v.v1 * v.tm, 2) + Math.pow(v.v2 * v.tm, 2)), 'u7l2-minutes', 'The speeds are per <b>hour</b>: change ' + v.tm + ' minutes to hours first (' + N(h) + ' h).'], [a + b, 'pyth-add-sides', 'North and east meet at 90°: the distance apart is the hypotenuse, not the two distances added.']],
              sol: br([tT + ' = ' + N(h) + ' h. North: ' + t(v.v1 + '\\times ' + N(h) + '=' + N(a)) + ' km. East: ' + t(v.v2 + '\\times ' + N(h) + '=' + N(b)) + ' km. North and east meet at 90°.', pythSol(a, b, 'km')]), hints: ['Find how far each one goes: distance = speed × time (in hours).', 'North and east make a right angle: the distance apart is the hypotenuse.'], text: 'snowmobiles ' + v.v1 + ',' + v.v2 + ',' + v.tm });
        } }] },
      { num: '14', stem: 'Find ' + t('x') + ' first, then use it to find ' + t('y') + '.', parts: [
        { id: '14', level: 'MAS', make: function (r) {
          var v = find(function () { var s = r.pick([[0.9, 1.2, 1.5], [1.5, 2, 2.5], [1.2, 1.6, 2], [2.1, 2.8, 3.5], [0.6, 0.8, 1], [3, 4, 5], [1.8, 2.4, 3]]), Lg = r.pick([r.int(30, 80) / 10, 0]); if (!Lg) { var m = r.pick([[5, 12], [3, 4], [8, 15], [7, 24]]); Lg = q(s[2] / m[0] * m[1]); } return { p: s[0], qq: s[1], x: s[2], Lg: Lg }; },
            function (v) { var y = Math.sqrt(v.x * v.x + v.Lg * v.Lg); return v.Lg > v.x * 1.4 && v.Lg <= v.x * 3 && v.Lg <= 9 && decs(v.Lg) <= 1 && (exact(y) || safe(y)) && !(v.x === 2.5 && v.Lg === 6); }, { p: 1.5, qq: 2, x: 2.5, Lg: 6 });
          var y = Math.sqrt(v.x * v.x + v.Lg * v.Lg), yd = rd(y, 1), u = 'cm';
          var B = [v.p, v.qq], th = Math.atan2(v.qq, v.p), Cpt = [B[0] - Math.sin(th) * v.Lg, B[1] + Math.cos(th) * v.Lg];   // C: Lg from B, at 90° to OB
          var fig = HW.fig({ pts: { O: [0, 0], A: [v.p, 0], B: B, C: Cpt }, segs: [['O', 'A', N(v.p) + ' ' + u], ['A', 'B', N(v.qq) + ' ' + u, { side: 1 }], ['O', 'B'], ['B', 'C', N(v.Lg) + ' ' + u], ['O', 'C', 'y']], right: [['A', 'O', 'B'], ['B', 'O', 'C']], names: false, width: 260,
            extra: [{ type: 'text', at: [v.p / 2 + Math.sin(th) * v.x * 0.16, v.qq / 2 - Math.cos(th) * v.x * 0.16], text: 'x', size: 15 }] });
          var p = U.fieldsPart('Round to the nearest tenth if needed.<br>' + fig, [
            { label: t('x='), name: 'x', chk: G.lenChk(v.x, { pyth: { legs: [v.p, v.qq] } }), key: nS(v.x), show: L(v.x, u), after: 'cm' },
            { label: t('y='), name: 'y', chk: G.lenChk(y, { pyth: { legs: [v.x, v.Lg] }, alts: [{ v: Math.sqrt(v.p * v.p + v.Lg * v.Lg), code: 'u7l2-x-for-y', hint: 'The big triangle’s legs are <b>x</b> and ' + N(v.Lg) + ' cm (x is shared by both triangles).' }, { v: Math.sqrt(v.qq * v.qq + v.Lg * v.Lg), code: 'u7l2-x-for-y', hint: 'The big triangle’s legs are <b>x</b> and ' + N(v.Lg) + ' cm (x is shared by both triangles).' }] }), key: fx(y, 1), show: t(fx(y, 1) + '\\text{ cm}'), after: 'cm' }],
            br(['Small triangle: ' + t(N(v.p) + '^2+' + N(v.qq) + '^2=' + N(q(v.p * v.p)) + '+' + N(q(v.qq * v.qq)) + '=' + N(q(v.x * v.x))) + ', so ' + t('x=\\sqrt{' + N(q(v.x * v.x)) + '}=' + N(v.x)) + ' cm.', 'Big triangle: its legs are ' + t('x=' + N(v.x)) + ' cm and ' + N(v.Lg) + ' cm.', t(N(v.x) + '^2+' + N(v.Lg) + '^2=' + N(q(v.x * v.x)) + '+' + N(q(v.Lg * v.Lg)) + '=' + N(q(v.x * v.x + v.Lg * v.Lg))) + ', so ' + t('y=\\sqrt{' + N(q(v.x * v.x + v.Lg * v.Lg)) + '}' + (exact(y) ? '=' + N(yd) : '=' + raw(y) + '\\approx ' + fx(y, 1))) + ' cm.']),
            ['x is the hypotenuse of the small triangle.', 'x is also a leg of the big triangle, with ' + N(v.Lg) + ' cm. y is its hypotenuse.'], 'x then y ' + v.x + ',' + v.Lg);
          p.bad = [[nS(q(v.x * v.x)), fx(q(v.x * v.x + v.Lg * v.Lg), 1)]];
          return p;
        } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(6, 15), r.int(2, 9)]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return v[0] > v[1] + 2 && !isSq(S) && safe(Math.sqrt(S)) && !excluded(v[0], v[1]); }, [10, 4]), S = v[0] * v[0] + v[1] * v[1], c = Math.sqrt(S);
          return mc(r, 'The legs of a right triangle are ' + v[0] + ' cm and ' + v[1] + ' cm. The hypotenuse is about', [{ html: fx(v[0] - v[1], 1) + ' cm', why: 'That subtracts the legs. The hypotenuse is the <b>longest</b> side.', code: 'u7l2-mc-subtract' }, { html: fx(c, 1) + ' cm', right: true }, { html: fx(v[0] + v[1], 1) + ' cm', why: 'That adds the legs. The hypotenuse is shorter than the legs added together.', code: 'u7l2-mc-add' }, { html: S + ' cm', why: 'That is ' + t('c^2') + '. Take the square root.', code: 'u7l2-mc-no-root' }],
            t(v[0] + '^2+' + v[1] + '^2=' + S) + ', ' + t('\\sqrt{' + S + '}\\approx ' + fx(c, 1)) + ' cm.', ['Square, add, square root.'], 'mc hyp ' + v.join(','), true);
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var set = r.pick([['P', 'Q', 'R'], ['D', 'E', 'F'], ['L', 'M', 'N'], ['X', 'Y', 'Z'], ['G', 'H', 'K']]), ri = r.int(0, 2), o = [0, 1, 2].filter(function (j) { return j !== ri; }), lw = function (i) { return set[i].toLowerCase(); };
          return eqMC(r, 'In △' + set.join('') + ', the right angle is at ' + set[ri] + '. Which equation is correct?', [lw(o[0]), lw(o[1])], lw(ri));
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          return mc(r, 'Which statement is true?', [
            { html: t('a^2+b^2=c^2') + ' is true for every triangle.', why: 'Triangles without a right angle are counterexamples (like the hinge at 60°).', code: 'u7l2-statement' },
            { html: t('a^2+b^2=c^2') + ' is true only for right triangles, where ' + t('c') + ' is the side across from the right angle.', right: true },
            { html: r.pick(['The hypotenuse is the shortest side of a right triangle.', 'The hypotenuse is one of the two sides that make the right angle.']), why: 'The hypotenuse is across from the right angle, and it is the <b>longest</b> side.', code: 'u7l2-statement' },
            { html: r.pick(['In a right triangle, the hypotenuse is equal to the two legs added together.', 'In a right triangle, ' + t('a+b=c') + '.']), why: 'The hypotenuse is always <b>shorter</b> than the two legs added. It is the <b>squares</b> that add.', code: 'u7l2-statement' }],
            'B: the theorem is only true for right triangles, and ' + t('c') + ' is the hypotenuse (across from the right angle).', ['Think about the hinge example.'], 'statement');
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.int(100, 160) / 10, r.int(60, 100) / 10]; }, function (v) { var c = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return v[0] > v[1] * 1.3 && safe(c) && c < 99 && decs(v[0]) === 1 && !excluded(v[0], v[1]); }, [13.6, 8.5]);
          var it = r.pick(['laptop screen', 'tablet screen', 'computer monitor']);
          return lenP('<b>Numerical response.</b> A ' + it + ' is ' + L(v[0], 'in') + ' wide and ' + L(v[1], 'in') + ' high. The length of its diagonal, to the nearest tenth of an inch, is ____ in.', v[0], v[1], { nr: true, text: 'nr screen ' + v.join(',') });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'For each right triangle, name the hypotenuse and write the Pythagorean theorem using its letters.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { return lettersEq(r, '(a) ', [['X', 'Y', 'Z'], ['D', 'E', 'F'], ['A', 'B', 'C']]); } },
        { id: 'e1b', level: 'BEG', make: function (r) { return lettersEq(r, '(b) ', [['R', 'S', 'T'], ['K', 'L', 'M'], ['U', 'V', 'W']]); } }] },
      { num: '2', stem: 'Squares are drawn on the sides of a right triangle. Find the area of the square on the hypotenuse, then the length of the hypotenuse.', parts: [0, 1].map(function (i) {
        return { id: 'e2' + 'ab'[i], level: 'EMG', make: function (r) {
          var v = i === 0 ? r.pick([[7, 24], [9, 40], [12, 16], [10, 24], [16, 30]]) : r.pick([[1.2, 1.6], [0.9, 4], [1.5, 2], [0.9, 1.2], [2.4, 3.2], [1.1, 6]]), u = i === 0 ? 'cm' : 'm', A = q(v[0] * v[0]), B = q(v[1] * v[1]), ch = areaRowChks(A, B), S = q(A + B), c = Math.sqrt(S);
          var p = U.fieldsPart('(' + 'ab'[i] + ') The squares on the legs have areas ' + t(N(A) + '\\text{ ' + u + '}^2') + ' and ' + t(N(B) + '\\text{ ' + u + '}^2') + '.', [{ label: 'Square on the hypotenuse:', name: 'Square on the hypotenuse', chk: ch[0], key: nS(S), show: t(N(S)), after: u + '²' }, { label: 'Length of the hypotenuse:', name: 'Length of the hypotenuse', chk: ch[1], key: nS(c), show: t(N(c)), after: u }],
            t(N(A) + '+' + N(B) + '=' + N(S) + '\\text{ ' + u + '}^2') + '; ' + t('\\sqrt{' + N(S) + '}=' + N(c) + '\\text{ ' + u + '}'), ['Add the two leg squares.', 'The hypotenuse is the side of that square: take the square root.'], 'ep areas ' + A + ',' + B);
          p.bad = [[nS(S), nS(S)]];
          return p;
        } };
      }) },
      { num: '3', stem: 'Find the hypotenuse of each right triangle. (The answers are exact.)', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var v = r.pick([[16, 30], [10, 24], [9, 40], [12, 35], [14, 48], [24, 32]]); return lenP('(a) legs ' + L(v[0], 'cm') + ' and ' + L(v[1], 'cm'), v[0], v[1], { unit: 'cm' }); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var v = r.pick([[2.8, 4.5], [1.6, 3], [3.3, 5.6], [2.4, 7], [1.1, 6], [3.6, 7.7]]); return lenP('(b) legs ' + L(v[0], 'm') + ' and ' + L(v[1], 'm'), v[0], v[1], { unit: 'm' }); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var v = r.pick([[33, 56], [28, 45], [16, 63], [39, 80], [48, 55], [36, 77], [13, 84]]); return lenP('(c) legs ' + L(v[0], 'ft') + ' and ' + L(v[1], 'ft'), v[0], v[1], { unit: 'ft' }); } }] },
      { num: '4', stem: 'Find the hypotenuse of each right triangle, to the nearest tenth.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 9), r.int(3, 12)]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return v[0] < v[1] && !isSq(S) && safe(Math.sqrt(S)) && !excluded(v[0], v[1]); }, [4, 7]); return lenP('(a) legs ' + L(v[0], 'in') + ' and ' + L(v[1], 'in'), v[0], v[1], { unit: 'in' }); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(80, 150) / 10, r.int(20, 50) / 10]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return safe(Math.sqrt(S)) && !isSq(q(S)) && !excluded(v[0], v[1]); }, [12.5, 3.2]); return lenP('(b) legs ' + L(v[0], 'cm') + ' and ' + L(v[1], 'cm'), v[0], v[1], { unit: 'cm' }); } },
        { id: 'e4c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 9) / 10, r.int(3, 12) / 10]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return v[0] < v[1] && safe(Math.sqrt(S)) && !isSq(q(S * 100)); }, [0.6, 0.9]); return lenP('(c) legs ' + L(v[0], 'm') + ' and ' + L(v[1], 'm'), v[0], v[1], { unit: 'm' }); } }] },
      { num: '5', stem: 'Without a calculator, find ' + t('c^2') + ', then say which two whole numbers the hypotenuse ' + t('c') + ' is between.', parts: [0, 1].map(function (i) {
        return { id: 'e5' + 'ab'[i], level: 'PRG', make: function (r) {
          var v = find(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return v[0] < v[1] && !isSq(S) && !excluded(v[0], v[1]); }, i ? [3, 9] : [5, 6]), S = v[0] * v[0] + v[1] * v[1], k = Math.floor(Math.sqrt(S));
          var p = U.fieldsPart('(' + 'ab'[i] + ') legs ' + v[0] + ' and ' + v[1], [{ label: t('c^2='), name: 'c²', chk: U.exChk(S, [[v[0] + v[1], 'pyth-add-sides', 'Square each leg, then add.'], [2 * v[0] + 2 * v[1], 'pyth-double', t('a^2') + ' means a × a, not 2 × a.']]), key: String(S), show: t(S) },
            { label: t('c') + ' is between', name: 'Smaller whole number', chk: U.exChk(k, [[k * k, 'u7l1-roots', 'Give the whole number, not its square: ' + t('\\sqrt{' + k * k + '}=' + k) + '.'], [k - 1, 'u7l1-roots', t(k + '^2=' + k * k) + ' is still less than ' + S + '.']]), key: String(k), show: t(k) },
            { label: 'and', name: 'Bigger whole number', chk: U.exChk(k + 1, [[(k + 1) * (k + 1), 'u7l1-roots', 'Give the whole number, not its square.'], [k + 2, 'u7l1-roots', t((k + 1) + '^2=' + (k + 1) * (k + 1)) + ' is already more than ' + S + '.']]), key: String(k + 1), show: t(k + 1) }],
            t('c^2=' + v[0] * v[0] + '+' + v[1] * v[1] + '=' + S) + '. ' + t(k + '^2=' + k * k) + ' and ' + t((k + 1) + '^2=' + (k + 1) * (k + 1)) + ', so c is between ' + k + ' and ' + (k + 1) + '. (' + t('\\sqrt{' + S + '}\\approx ' + fx(Math.sqrt(S), 1)) + ')', ['Square the legs and add.', 'Find the perfect squares just below and above c².'], 'ep between ' + v.join(','));
          p.bad = [[String(S), String(k * k), String((k + 1) * (k + 1))]];
          return p;
        } };
      }) },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A computer monitor’s screen is ' + L(sh.w, 'in') + ' wide and ' + L(sh.h, 'in') + ' high.'; }, shared: function (r) {
          return find(function () { var size = r.pick([24, 27, 32, 22, 21.5]), d = size + (r.chance(0.6) ? r.int(-3, 3) / 10 : r.pick([-2.5, -2, -1.5, 1.5, 2, 2.5])), w = rd(d * 16 / Math.sqrt(337) + r.int(-2, 2) / 10, 1), h = rd(Math.sqrt(d * d - w * w), 1); return { size: size, w: w, h: h, c: Math.sqrt(w * w + h * h) }; },
            function (v) { return safe(v.c) && Math.abs(v.c - v.size) > 0.04 && (Math.abs(v.c - v.size) < 0.6 || Math.abs(v.c - v.size) > 1.2); }, { size: 27, w: 23.5, h: 13.2, c: Math.sqrt(23.5 * 23.5 + 13.2 * 13.2) });
        }, parts: [
        { id: 'e6a', level: 'PRG', make: function (r, sh) { return lenP('(a) How long is its diagonal, to the nearest tenth of an inch?', sh.w, sh.h, { unit: 'in' }); } },
        { id: 'e6b', level: 'PRG', make: function (r, sh) {
          var yes = Math.abs(sh.c - sh.size) < 0.6;
          return ynMC(r, '(b) Is it a ' + sh.size + '-inch monitor?', yes, 'the diagonal is about ' + fx(sh.c, 1) + ' in, which is about ' + sh.size + ' in.', 'the diagonal is about ' + fx(sh.c, 1) + ' in, not ' + sh.size + ' in.', 'The diagonal is ' + fx(sh.c, 1) + ' in. Is that about ' + sh.size + ' in?', 'The diagonal is ' + fx(sh.c, 1) + ' in. Compare it with ' + sh.size + ' in.',
            'The diagonal is ' + t(fx(sh.c, 1)) + ' in, so it ' + (yes ? '<b>is</b>' : 'is <b>not</b>') + ' a ' + sh.size + '-inch monitor.');
        } }] },
      { num: '7', stem: function (sh) { return 'A soccer field in ' + sh.town + ' is ' + sh.a + ' m long and ' + sh.b + ' m wide. A player jogs from one corner to the opposite corner.'; }, shared: function (r) {
          return find(function () { return { a: r.int(90, 120), b: r.int(45, 90), town: r.pick(['Red Deer', 'Lethbridge', 'Medicine Hat', 'Lacombe']) }; }, function (v) { var c = Math.sqrt(v.a * v.a + v.b * v.b); return v.a > v.b + 15 && safe(c) && safe(v.a + v.b - c) && !isSq(v.a * v.a + v.b * v.b); }, { a: 100, b: 64, town: 'Red Deer' });
        }, parts: [
        { id: 'e7a', level: 'PRG', make: function (r, sh) { return lenP('(a) How far is the jog straight across the field (the diagonal), to the nearest tenth of a metre?', sh.a, sh.b, { unit: 'm' }); } },
        { id: 'e7b', level: 'ADV', make: function (r, sh) {
          var c = Math.sqrt(sh.a * sh.a + sh.b * sh.b), d = sh.a + sh.b - c;
          return U.nearP('(b) How much shorter is that than jogging along two sidelines, to the nearest tenth of a metre?', d, 1, [[sh.a + sh.b, 'u7l2-shorter-total', 'That is the jog along two sidelines. Subtract the diagonal.'], [c, 'u7l2-shorter-total', 'That is the diagonal. How much <b>shorter</b> is it than ' + (sh.a + sh.b) + ' m?'], [sh.a - sh.b, 'u7l2-shorter-total', 'Two sidelines: add the length and the width, then subtract the diagonal.']],
            { after: 'm', sol: br([t(sh.a + '+' + sh.b + '=' + (sh.a + sh.b)) + ' m along two sidelines.', t((sh.a + sh.b) + '-' + raw(c) + '=' + raw(d) + '\\approx ' + fx(d, 1)) + ' m', 'The diagonal is about ' + fx(d, 1) + ' m shorter.']), hints: ['Two sidelines = length + width.', 'Shorter by = two sidelines − diagonal.'], text: 'shorter ' + sh.a + ',' + sh.b });
        } }] },
      { num: '8', stem: function (sh) { return 'A zipline starts on a platform ' + sh.h + ' m higher than the end platform. The two platforms are ' + sh.d + ' m apart, measured along the ground.'; }, shared: function (r) {
          return find(function () { return { h: r.int(6, 20), d: r.int(60, 150) }; }, function (v) { return safe(Math.sqrt(v.h * v.h + v.d * v.d)) && !isSq(v.h * v.h + v.d * v.d); }, { h: 12, d: 85 });
        }, parts: [
        { id: 'e8a', level: 'PRG', make: function (r, sh) { return lenP('(a) About how long is the cable (pulled straight)? Round to the nearest tenth of a metre.', sh.h, sh.d, { unit: 'm', hints: ['The height difference and the ground distance are the legs. The cable is the hypotenuse.'] }); } },
        { id: 'e8b', level: 'EMG', make: function (r, sh) {
          var c = Math.sqrt(sh.h * sh.h + sh.d * sh.d);
          return mc(r, '(b) Why is the cable only a little longer than ' + sh.d + ' m?', [{ html: 'One leg (' + sh.h + ' m) is much shorter than the other (' + sh.d + ' m), so the hypotenuse is only a bit longer than the long leg.', right: true },
            { html: 'The cable is the hypotenuse, which is always about the same as the longer leg.', why: 'Not always: with two equal legs the hypotenuse is about 1.4 times as long. It depends on how short the other leg is.', code: 'u7l2-reasonable' },
            { html: 'The cable sags, so it must be shorter.', why: 'The question says the cable is pulled straight.', code: 'u7l2-reasonable' },
            { html: 'Because ' + sh.h + ' + ' + sh.d + ' = ' + (sh.h + sh.d) + ', which is close to ' + sh.d + '.', why: 'The hypotenuse isn’t found by adding the legs. Think about how short one leg is compared with the other.', code: 'u7l2-reasonable' }],
            'The cable is about ' + fx(c, 1) + ' m. One leg (' + sh.h + ' m) is much shorter than the other (' + sh.d + ' m), so the hypotenuse is only a little longer than the long leg.', ['Picture a very flat right triangle.'], 'zip why');
        } }] },
      { num: '9', stem: function (sh) { return 'A shed roof rafter rises ' + sh.rise + ' ft over a horizontal run of ' + sh.rf + ' ft ' + sh.ri + ' in.'; }, shared: function (r) {
          return find(function () { return { rise: r.int(2, 4), rf: r.int(5, 9), ri: r.int(1, 11), board: 0 }; }, function (v) { var a = 12 * v.rise, b = 12 * v.rf + v.ri, c = Math.sqrt(a * a + b * b); v.c = c; v.board = r.pick([8, 10, 12]); return safe(c, 0) && Math.abs(c - 12 * v.board) > 2 && Math.abs(c - 12 * v.board) < 30 && Math.round(c) % 12 !== 0; }, { rise: 3, rf: 6, ri: 8, board: 8, c: Math.sqrt(36 * 36 + 80 * 80) });
        }, parts: [
        { id: 'e9a', level: 'MAS', make: function (r, sh) {
          var a = 12 * sh.rise, b = 12 * sh.rf + sh.ri, c = Math.round(sh.c), f = ftIn(c), dec = Math.sqrt(sh.rise * sh.rise + Math.pow(sh.rf + sh.ri / 10, 2)), cf = sh.c / 12, dFt = Math.floor(cf);
          return ftInPart('(a) How long is the rafter, to the nearest inch? Give your answer in feet and inches.', c, { exact: sh.c, bad: [{ tot: Math.round(dec * 12), code: 'u7l2-ft-decimal', hint: sh.rf + ' ft ' + sh.ri + ' in is not ' + sh.rf + '.' + sh.ri + ' ft. Change it to inches: ' + t(sh.rf + '\\times 12+' + sh.ri + '=' + b) + ' in.' }, { ft: dFt, inch: Math.round((cf - dFt) * 10), code: 'u7l2-dec-inches', hint: 'The decimal part of a foot is not inches. Work in inches: ' + t(c + '\\div 12') + ' is ' + f.ft + ' remainder ' + f.inch + '.' }, { ft: dFt, inch: Math.round((cf - dFt) * 100), code: 'u7l2-dec-inches', hint: 'The decimal part of a foot is not inches. Find the remainder: ' + t(c + '-' + f.ft + '\\times 12=' + f.inch) + ' in.' }],
            sol: br(['Rise: ' + t(sh.rise + '\\times 12=' + a) + ' in. Run: ' + t(sh.rf + '\\times 12+' + sh.ri + '=' + b) + ' in.', t(a + '^2+' + b + '^2=' + N(a * a) + '+' + N(b * b) + '=' + N(a * a + b * b)) + '; ' + t('c=\\sqrt{' + N(a * a + b * b) + '}=' + raw(sh.c) + '\\approx ' + c) + ' in', t(c + '\\div 12=' + f.ft) + ' remainder ' + f.inch + ', so the rafter is about ' + f.ft + ' ft ' + f.inch + ' in.']), hints: ['Change both lengths to inches first.', 'At the end: divide by 12; the whole number is feet and the remainder is inches.'], text: 'rafter ' + sh.rise + ',' + sh.rf + ',' + sh.ri });
        } },
        { id: 'e9b', level: 'PRG', make: function (r, sh) {
          var c = Math.round(sh.c), f = ftIn(c), yes = 12 * sh.board >= c;
          return ynMC(r, '(b) Will ' + (sh.board === 8 ? 'an' : 'a') + ' ' + sh.board + ' ft board be long enough?', yes, 'a ' + sh.board + ' ft board is ' + 12 * sh.board + ' in, longer than ' + c + ' in.', 'a ' + sh.board + ' ft board is only ' + 12 * sh.board + ' in, shorter than ' + c + ' in.', 'Change ' + sh.board + ' ft to inches (' + 12 * sh.board + ' in) and compare with ' + c + ' in.', 'Change ' + sh.board + ' ft to inches (' + 12 * sh.board + ' in) and compare with ' + c + ' in.',
            'The rafter is about ' + c + ' in (' + f.ft + ' ft ' + f.inch + ' in). ' + cap((sh.board === 8 ? 'an ' : 'a ') + sh.board) + ' ft board is ' + 12 * sh.board + ' in, so it is ' + (yes ? '' : '<b>not</b> ') + 'long enough.');
        } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'PRG', make: function (r) {
          var p = r.pick(NAMES)[0], s = r.int(3, 9);
          return mc(r, p + ' says, “' + t('a^2+b^2=c^2') + ' works for any triangle.” A triangle has all three sides ' + s + ' cm long (it has no right angle). Which work shows that ' + p + ' is wrong?', [
            { html: t(s + '^2+' + s + '^2=' + 2 * s * s) + ', but the third side squared is ' + t(s + '^2=' + s * s) + '. ' + t(2 * s * s + '\\ne ' + s * s) + ', so the rule fails: a counterexample.', right: true },
            { html: t(s + '+' + s + '=' + 2 * s) + ', and ' + t(2 * s + '\\ne ' + s) + '.', why: 'The theorem is about the <b>squares</b> of the sides. Square them.', code: 'u7l2-counter' },
            { html: t(s + '^2+' + s + '^2=' + 2 * s * s) + ' and ' + t('\\sqrt{' + 2 * s * s + '}\\approx ' + fx(Math.sqrt(2 * s * s), 1)) + ', so the third side is ' + fx(Math.sqrt(2 * s * s), 1) + ' cm.', why: 'That assumes the rule works. The third side is ' + s + ' cm, so check whether ' + t(s + '^2+' + s + '^2') + ' equals ' + t(s + '^2') + '.', code: 'u7l2-counter' },
            { html: t(s + '^2+' + s + '^2=' + 2 * s * s) + ' and ' + t(2 * s * s + '=' + 2 * s * s) + ', so ' + p + ' is right.', why: 'Compare with the <b>third side</b> squared: ' + t(s + '^2=' + s * s) + '.', code: 'u7l2-counter' }],
            t(s + '^2+' + s + '^2=' + s * s + '+' + s * s + '=' + 2 * s * s) + ', but the third side squared is ' + t(s + '^2=' + s * s) + '. ' + t(2 * s * s + '\\ne ' + s * s) + ', so the rule fails. This triangle is a counterexample: the theorem only works for right triangles.', ['Use the triangle’s own sides in ' + t('a^2+b^2') + ' and ' + t('c^2') + '.'], 'equilateral ' + s);
        } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'BEG', make: function (r) {
          var v = find(function () { var w = r.int(26, 60); return [w, Math.round(w * 9 / 16)]; }, function (v) { var S = v[0] * v[0] + v[1] * v[1]; return !isSq(S) && safe(Math.sqrt(S)) && !excluded(v[0], v[1]); }, [32, 18]), S = v[0] * v[0] + v[1] * v[1], c = Math.sqrt(S);
          return mc(r, 'A TV screen is ' + v[0] + ' in wide and ' + v[1] + ' in high. Its size (the diagonal) is about', [{ html: fx(v[0] - v[1], 1) + ' in', why: 'That subtracts. The diagonal is the longest side.', code: 'u7l2-mc-subtract' }, { html: fx(c, 1) + ' in', right: true }, { html: fx(v[0] + v[1], 1) + ' in', why: 'That adds the sides. The diagonal is shorter than the two added.', code: 'u7l2-mc-add' }, { html: N(S) + ' in', why: 'That is ' + t('c^2') + '. Take the square root.', code: 'u7l2-mc-no-root' }],
            t(v[0] + '^2+' + v[1] + '^2=' + N(v[0] * v[0]) + '+' + N(v[1] * v[1]) + '=' + N(S)) + '; ' + t('\\sqrt{' + N(S) + '}\\approx ' + fx(c, 1)) + ' in.', ['Square, add, square root.'], 'mc tv ' + v.join(','), true);
        } }] },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.int(8, 25) / 10, r.int(35, 80) / 10]; }, function (v) { var c = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return safe(c) && !isSq(q(v[0] * v[0] + v[1] * v[1])); }, [1.4, 5.2]);
          return lenP('<b>Numerical response.</b> The foot of a ladder is ' + L(v[0], 'm') + ' from a wall, and the top of the ladder touches the wall ' + L(v[1], 'm') + ' above the ground. The length of the ladder, to the nearest tenth of a metre, is ____ m.', v[0], v[1], { nr: true, text: 'nr ladder ' + v.join(',') });
        } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A box is ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm tall. Will a ' + sh.stick + ' cm hockey stick fit inside, from a bottom corner to the opposite top corner?'; }, shared: function (r) {
          return find(function () { var b = r.pick([[40, 30, 50], [48, 36, 60], [32, 24, 40], [36, 27, 45], [60, 45, 75], [20, 48, 52]]), h = r.int(9, 14) * 10; var D = Math.sqrt(b[2] * b[2] + h * h), stick = Math.round(D) + r.pick([-7, -5, -4, 3, 5, 6]); return { l: b[0], w: b[1], base: b[2], h: h, D: D, stick: stick }; }, function (v) { return safe(v.D) || same(v.D, Math.round(v.D)); }, { l: 40, w: 30, base: 50, h: 120, D: 130, stick: 125 });
        }, parts: [
        { id: 'e13a', level: 'PRG', make: function (r, sh) { return lenP('(a) How long is the diagonal across the bottom of the box?', sh.l, sh.w, { unit: 'cm', hints: ['The length and width of the bottom are the legs.'] }); } },
        { id: 'e13b', level: 'MAS', make: function (r, sh) { return lenP('(b) Use the bottom diagonal as a leg of a second right triangle that stands up inside the box. How long is the longest straight line inside the box, from a bottom corner to the opposite top corner? Round to the nearest tenth if needed.', sh.base, sh.h, { unit: 'cm', bad: [[sh.base, 'u7l2-box-base', 'That is the bottom diagonal. Now use it with the height (' + sh.h + ' cm) as the two legs.'], [Math.sqrt(sh.l * sh.l + sh.h * sh.h), 'u7l2-box-base', 'Use the <b>bottom diagonal</b> (' + sh.base + ' cm) and the height as the legs, not the length.'], [sh.l + sh.w + sh.h, 'u7l2-box-3add', 'Add the squares, not the edges.']], hints: ['Its legs are the bottom diagonal from (a) and the height of the box.'] }); } },
        { id: 'e13c', level: 'ADV', make: function (r, sh) {
          var yes = sh.stick <= sh.D;
          return ynMC(r, '(c) Will the ' + sh.stick + ' cm stick fit?', yes, 'the longest line inside the box is about ' + fx(sh.D, 1) + ' cm, longer than ' + sh.stick + ' cm.', 'the longest line inside the box is only about ' + fx(sh.D, 1) + ' cm, shorter than ' + sh.stick + ' cm.', 'The longest line in the box is ' + fx(sh.D, 1) + ' cm. Is the stick shorter than that?', 'The longest line in the box is ' + fx(sh.D, 1) + ' cm. Compare it with ' + sh.stick + ' cm.',
            'Bottom diagonal: ' + t('\\sqrt{' + sh.l + '^2+' + sh.w + '^2}=' + sh.base) + ' cm. Longest line: ' + t('\\sqrt{' + sh.base + '^2+' + sh.h + '^2}' + (exact(sh.D) ? '=' + N(rd(sh.D, 1)) : '\\approx ' + fx(sh.D, 1))) + ' cm. ' + t(fx(sh.D, 1) + (yes ? '>' : '<') + sh.stick) + ', so ' + (yes ? '<b>yes</b>, the stick fits.' : 'it does <b>not</b> fit.'));
        } }] },
      { num: '14', stem: '', parts: [
        { id: 'e14', level: 'ADV', make: function (r) {
          var v = find(function () { return [r.int(10, 60) / 10, r.int(10, 60) / 10]; }, function (v) { var c = Math.sqrt(v[0] * v[0] + v[1] * v[1]); return safe(c) && Math.abs(v[0] - v[1]) > 0.4 && !isSq(q(v[0] * v[0] + v[1] * v[1])); }, [2.5, 3.5]), park = r.pick(['Kananaskis', 'Jasper', 'Banff', 'Waterton']);
          return lenP('On a trail map of ' + park + ', a lookout is ' + L(v[0], 'km') + ' east and ' + L(v[1], 'km') + ' north of a campground. How far is the lookout from the campground in a straight line, to the nearest tenth of a kilometre?', v[0], v[1], { unit: 'km', hints: ['East and north meet at 90°: sketch the right triangle.'], text: 'trail ' + v.join(',') });
        } }] },
      { num: '15', stem: function (sh) { return 'Which has the longer diagonal: a rectangle ' + sh.a + ' m by ' + sh.b + ' m, or a square ' + sh.s + ' m by ' + sh.s + ' m?'; }, shared: function (r) {
          return find(function () { var tr = r.pick([[5, 12], [7, 24], [8, 6], [9, 12], [12, 16], [10, 24], [15, 8], [20, 21]]), s = 0, d = Math.sqrt(tr[0] * tr[0] + tr[1] * tr[1]); s = Math.round(d / Math.SQRT2) + r.pick([-1, 0, 1]); return { a: tr[0], b: tr[1], s: s, d1: d, d2: s * Math.SQRT2 }; }, function (v) { return Math.abs(v.d1 - v.d2) > 0.15 && safe(v.d2) && !excluded(v.a, v.b); }, { a: 5, b: 12, s: 9, d1: 13, d2: 9 * Math.SQRT2 });
        }, parts: [
        { id: 'e15a', level: 'ADV', make: function (r, sh) {
          var p = U.fieldsPart('Find each diagonal (to the nearest tenth if needed).', [{ label: 'Rectangle:', name: 'Rectangle', chk: G.lenChk(sh.d1, { pyth: { legs: [sh.a, sh.b] } }), key: fx(sh.d1, 1), show: t(fx(sh.d1, 1)), after: 'm' }, { label: 'Square:', name: 'Square', chk: G.lenChk(sh.d2, { pyth: { legs: [sh.s, sh.s] } }), key: fx(sh.d2, 1), show: t(fx(sh.d2, 1)), after: 'm' }],
            br(['Rectangle: ' + t(sh.a + '^2+' + sh.b + '^2=' + (sh.a * sh.a + sh.b * sh.b)) + ', diagonal ' + t('\\sqrt{' + (sh.a * sh.a + sh.b * sh.b) + '}' + (exact(sh.d1) ? '=' + N(rd(sh.d1, 1)) : '\\approx ' + fx(sh.d1, 1))) + ' m', 'Square: ' + t(sh.s + '^2+' + sh.s + '^2=' + 2 * sh.s * sh.s) + ', diagonal ' + t('\\sqrt{' + 2 * sh.s * sh.s + '}\\approx ' + fx(sh.d2, 1)) + ' m']), ['Each diagonal is the hypotenuse of a right triangle made by two sides.'], 'diagonals ' + sh.a + ',' + sh.b + ',' + sh.s);
          p.bad = [[fx(sh.d2, 1), fx(sh.d1, 1)]];
          return p;
        } },
        { id: 'e15b', level: 'PRG', make: function (r, sh) {
          var rect = sh.d1 > sh.d2;
          return mc(r, 'Which has the longer diagonal?', [{ html: 'The rectangle (' + fx(sh.d1, 1) + ' m)', right: rect, why: rect ? null : 'Compare: ' + fx(sh.d1, 1) + ' m and ' + fx(sh.d2, 1) + ' m.', code: 'u7l2-decide' }, { html: 'The square (' + fx(sh.d2, 1) + ' m)', right: !rect, why: rect ? 'Compare: ' + fx(sh.d1, 1) + ' m and ' + fx(sh.d2, 1) + ' m.' : null, code: 'u7l2-decide' }, { html: 'They are the same, because ' + t(sh.a + '+' + sh.b) + ' and ' + t(sh.s + '+' + sh.s) + ' are ' + (sh.a + sh.b === 2 * sh.s ? 'equal' : 'close') + '.', why: 'The diagonal depends on the <b>squares</b> of the sides, not the sides added. Work out both diagonals.', code: 'u7l2-decide' }],
            'Rectangle ' + fx(sh.d1, 1) + ' m, square ' + fx(sh.d2, 1) + ' m: the <b>' + (rect ? 'rectangle' : 'square') + '</b> has the longer diagonal.', ['Work out both diagonals with ' + t('a^2+b^2=c^2') + '.'], 'which longer', true);
        } }] }
    ]
  });
})(window);
