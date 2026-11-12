/* Math 10-3 · Unit 1 · Lesson 4 — Proportions: Finding the Missing Value (N1)
 * Assignment 4 (u1_l04.tex, Questions 1–17) and the Lesson 4 Extra Practice (u1_ep04.tex, Questions 1–14).
 * Every part is a generator: the same kind of proportion as the booklet item (x on top or bottom, left or right; a
 * scale factor that is easy to spot for "solve by scaling", awkward numbers or decimals for "cross-multiply"; the
 * same real context — recipe, map scale, floor plan, fuel mix in mL and L, dose, photo enlargement, boxes to buy),
 * new numbers around the booklet's, never the lesson's worked-example numbers.
 * Every proportion answer gets hints for the classic mistakes: adding instead of scaling, multiplying the two tops
 * (Tyler's mistake), dividing by the wrong number, mL/L not converted, rounding a "how many to buy" down.
 * "Round to the nearest tenth where needed" answers are nudged (no try used) when they are right but not rounded.
 * Conversions: "do they form a proportion? show how you know" → a yes/no table; "what mistake did Tyler make?",
 * "check each answer with cross products", "does he have enough? explain", "whose juice is stronger?" → multiple
 * choice whose options carry the reasons (and the corrected answer where there is one).
 * Needs the ratio kit HW.u1ratio from js/lessons/u1l3.js, so u1l3.js must load first. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var X = HW.u1ratio;
  if (!X) throw new Error('js/lessons/u1l4.js needs the ratio kit from js/lessons/u1l3.js: load u1l3.js first');
  var gcd = X.gcd, rnd = X.rnd, nf = X.nf, nT = X.nT, rT = X.rT, isInt = X.isInt, simp = X.simp, mT = X.mT, find = X.find, cop = X.cop, br = X.br, u = X.u, pron = X.pron;
  var numChk = X.numChk, moneyChk = X.moneyChk, numPart = X.numPart, moneyPart = X.moneyPart, fieldsPart = X.fieldsPart, cleanW = X.cleanW;
  function mP(x) { return isInt(x) ? '\\$' + Math.round(x) : mT(x); }
  function d1(x) { return isInt(x * 10) ? nT(rnd(x, 6)) : null; }     // a value with at most one decimal place, else null

  /* ================= a proportion a/b = c/d with one unknown =================
   * M = [[n1, n2], [d1, d2]] (rows: tops, bottoms; columns: left ratio, right ratio); x at (rx, sx). */
  function texSide(M, s, form, xs) { var top = M[0][s] == null ? 'x' : nT(M[0][s]), bot = M[1][s] == null ? 'x' : nT(M[1][s]); return form === 'colon' ? top + ':' + bot : '\\dfrac{' + top + '}{' + bot + '}'; }
  function propTex(M, form) { return texSide(M, 0, form) + '=' + texSide(M, 1, form); }
  function where(M) { for (var r = 0; r < 2; r++) for (var s = 0; s < 2; s++) if (M[r][s] == null) return [r, s]; return null; }
  function solveM(M) { var w = where(M), rx = w[0], sx = w[1]; return M[rx][1 - sx] * M[1 - rx][sx] / M[1 - rx][1 - sx]; }
  /* recognised wrong answers for x */
  function propWrongs(M) {
    var w = where(M), rx = w[0], sx = w[1], p = M[1 - rx][1 - sx], q = M[rx][1 - sx], s2 = M[1 - rx][sx], ans = q * s2 / p, W = [];
    var rowName = rx === 0 ? 'tops' : 'bottoms';
    W.push({ v: M[1 - rx][0] * M[1 - rx][1] / q, code: 'u1l4-same-row', hint: 'Multiply along the <b>diagonals</b> (top-left with bottom-right, bottom-left with top-right). Don’t multiply the two ' + (rx === 0 ? 'bottoms' : 'tops') + ' together.' });
    W.push({ v: p * q / s2, code: 'u1l4-wrong-divide', hint: 'After you cross-multiply, divide by the number that is <b>with x</b> (the one on x’s diagonal): ' + t(nT(p)) + '.' });
    W.push({ v: p * s2 / q, code: 'u1l4-wrong-divide', hint: 'After you cross-multiply, divide by the number that is <b>with x</b> (the one on x’s diagonal): ' + t(nT(p)) + '.' });
    W.push({ v: q + s2 - p, code: 'u1l4-added', hint: 'Only multiply or divide. Adding the same amount to the top and bottom does <b>not</b> make an equal ratio.' });
    W.push({ v: q - s2 + p, code: 'u1l4-added', hint: 'Only multiply or divide. Subtracting the same amount does <b>not</b> make an equal ratio.' });
    var seen = [ans];
    return W.filter(function (x) { if (!(x.v > 0) || !isFinite(x.v)) return false; for (var i = 0; i < seen.length; i++) if (Math.abs(seen[i] - x.v) < 1e-6) return false; seen.push(x.v); return true; });
  }
  /* worked solution: method 'scale' or 'cross' */
  function scaleLines(M) {
    var w = where(M), rx = w[0], sx = w[1], so = 1 - sx, a = M[1 - rx][so], b = M[1 - rx][sx], f = b / a, x = solveM(M);
    var op = f >= 1 ? '\\times ' + nT(rnd(f, 6)) : '\\div ' + nT(rnd(1 / f, 6));
    return [t(nT(a) + op + '=' + nT(b)), 'so ' + t('x=' + nT(M[rx][so]) + op), t('x=' + nT(rnd(x, 6)))];
  }
  function crossLines(M, dp) {
    var w = where(M), rx = w[0], sx = w[1], p = M[1 - rx][1 - sx], q = M[rx][1 - sx], s2 = M[1 - rx][sx], x = q * s2 / p, prod = rnd(q * s2, 6);
    if (p === 1) return [t('x=' + nT(q) + '\\times ' + nT(s2) + '=' + nT(prod))].concat(dp != null && !isInt(x * Math.pow(10, dp)) ? [t('x\\approx ' + rnd(x, dp).toFixed(dp))] : []);
    var L = [t(nT(q) + '\\times ' + nT(s2) + '=' + nT(p) + '\\times x'), t(nT(prod) + '=' + nT(p) + 'x'), t('x=' + nT(prod) + '\\div ' + nT(p))];
    if (dp != null && !isInt(x * Math.pow(10, dp))) L.push(t('x=' + nT(rnd(x, 4)) + '\\ldots\\approx ' + rnd(x, dp).toFixed(dp)));
    else L.push(t('x=' + nT(rnd(x, 6))));
    return L;
  }
  /* a "solve the proportion" part. o.method 'scale' | 'cross'; o.form 'frac' | 'colon'; rounds to a tenth where needed */
  function propPart(M, o) {
    o = o || {};
    var x = solveM(M), dp = isInt(x * 10) ? null : 1;
    var p = numPart(t(propTex(M, o.form)), dp == null ? rnd(x, 6) : x, { dp: dp, wrongs: propWrongs(M), before: t('x='),
      sol: br(o.method === 'scale' ? scaleLines(M) : crossLines(M, 1)), text: (o.method || 'cross') + ' ' + JSON.stringify(M),
      hints: o.method === 'scale' ? ['Look at the pair where both numbers are known. What was it multiplied or divided by?', 'Do the same to the other number.'] : ['Multiply along the diagonals and write an equation.', 'Divide both sides by the number that is with x.'] });
    if (dp != null) p.good = [rnd(x, dp).toFixed(dp)];
    return p;
  }
  /* random proportion: left ratio a:b (from a simple ratio scaled by k1), right = left × f; x put at position pos */
  function placeX(L, R, pos) { var M = [[L[0], R[0]], [L[1], R[1]]]; M[pos[0]][pos[1]] = null; return M; }
  function samePropM(M, list) { var s = JSON.stringify(M); return list.some(function (m) { return JSON.stringify(m) === s; }); }
  var EX_PROP = [[[3, null], [4, 20]], [[5, 35], [8, null]], [[18, null], [24, 4]], [[6, 30], [null, 45]], [[null, 7], [12, 8]], [[9, 15], [null, 40]], [[6, null], [11, 25]], [[2.5, 7], [4, null]]];
  /* scaling: the right ratio is the left one × f (or ÷ f); x on the side picked by pos */
  function genScale(r, o) {
    return find(function () {
      var pq = o.base ? o.base(r) : [r.int(1, 9), r.int(2, 12)], f = r.pick(o.f || [2, 3, 4, 5, 6, 7, 8]);
      var L = pq, R = [pq[0] * f, pq[1] * f];
      if (o.down) { var tmp = L; L = R; R = tmp; }
      return placeX(L, R, o.pos(r));
    }, function (M) { var x = solveM(M); return isInt(x) && x > 0 && !samePropM(M, EX_PROP) && (!o.test || o.test(M)); }, o.fallback);
  }
  /* cross-multiplying: the numbers do not scale nicely; x ends in at most one decimal place (or gets rounded) */
  function genCross(r, o) {
    return find(function () { var v = o.gen(r); return placeX([v[0], v[1]], [v[2], v[3]], o.pos(r)); }, function (M) {
      var x = solveM(M), w = where(M), rx = w[0], sx = w[1], ff = M[1 - rx][sx] / M[1 - rx][1 - sx];
      return x > 0 && x < 1000 && !samePropM(M, EX_PROP) && !isInt(ff) && !isInt(1 / ff) && [0, 1].every(function (c) { return M[0][c] == null || M[1][c] == null || M[0][c] !== M[1][c]; }) && (o.round ? !isInt(x * 10) && !isInt(x * 100) : isInt(x * 10)) && (!o.test || o.test(M, x));
    }, o.fallback);
  }
  function posAny(r) { return [r.int(0, 1), r.int(0, 1)]; }
  function posRight(r) { return [r.int(0, 1), 1]; }

  /* ---- do two ratios form a proportion? (a yes/no table) ---- */
  function pairTex(a, kind) { return kind === 'frac' ? t('\\dfrac{' + nT(a[0]) + '}{' + nT(a[1]) + '}') : t(rT(a)); }
  function propGridPart(r, rows, prompt) {
    var want = {}; rows.forEach(function (x, i) { x.id = 'r' + i; want[x.id] = x.yes ? 'y' : 'n'; });
    function line(x) { var A = x.a, B = x.b, sa = simp(A), sb = simp(B);
      if (x.kind === 'frac' || !isInt(A[0]) || !isInt(A[1]) || !isInt(B[0]) || !isInt(B[1])) return t(nT(A[0]) + '\\div ' + nT(A[1]) + (isInt(A[0] / A[1] * 1000) ? '=' : '\\approx ') + nT(rnd(A[0] / A[1], 3))) + ', ' + t(nT(B[0]) + '\\div ' + nT(B[1]) + (isInt(B[0] / B[1] * 1000) ? '=' : '\\approx ') + nT(rnd(B[0] / B[1], 3)));
      return t(rT(A) + (X.gcdAll(A) > 1 ? '=' + rT(sa) : '')) + ', ' + t(rT(B) + (X.gcdAll(B) > 1 ? '=' + rT(sb) : '')); }
    return P.grid(prompt || 'Do the two ratios form a proportion?', rows.map(function (x) { return { id: x.id, html: pairTex(x.a, x.kind) + ' and ' + pairTex(x.b, x.kind) }; }), [{ id: 'y', html: 'Yes' }, { id: 'n', html: 'No' }], want,
      { why: function (row) { var x = rows.filter(function (y) { return y.id === row; })[0]; return 'Check: ' + line(x) + '. ' + (x.yes ? 'Same, so it <b>is</b> a proportion.' : 'Different, so it is <b>not</b> a proportion.'); } },
      br(rows.map(function (x) { return line(x) + ': ' + (x.yes ? '<b>yes</b>' : 'no'); })), ['Simplify both ratios, or divide top ÷ bottom for each, and compare.'], 'proportion yes/no');
  }
  function yesPair(r, kind) { var pq = cop(r, 2, 9), m = r.int(2, 4), n = r.int(2, 5); if (m === n) n = m + 1; return { a: kind === 'big' ? [pq[0] * m, pq[1] * m] : pq, b: [pq[0] * n, pq[1] * n], yes: true, kind: kind === 'frac' ? 'frac' : 'colon' }; }
  function noPair(r, kind) {
    return find(function () {
      var pq = cop(r, 2, 9), m = r.int(2, 4), a = pq, b;
      if (r.chance(0.5)) { var k = r.int(2, 9); b = [pq[0] + k, pq[1] + k]; }            // the same number added to both terms
      else { var n = m + r.pick([1, -1]); b = [pq[0] * m, pq[1] * n]; }                   // the terms scaled by different numbers
      if (r.chance(0.5)) { var tmp = a; a = b; b = tmp; }
      return { a: a, b: b, yes: false, kind: kind === 'frac' ? 'frac' : 'colon' };
    }, function (x) { return x.b[0] > 0 && x.b[1] > 0 && x.a[0] !== x.a[1] && rnd(x.a[0] / x.a[1], 3) !== rnd(x.b[0] / x.b[1], 3); }, { a: [4, 6], b: [10, 12], yes: false, kind: 'frac' });
  }

  /* ---- check a claimed answer with cross products (multiple choice with the reason and the fix) ---- */
  function checkClaimPart(r, M, name, right) {
    var x = solveM(M), dpx = isInt(x * 10) ? nT(rnd(x, 6)) : rnd(x, 1).toFixed(1);
    var claim = right ? x : find(function () { return r.pick([Math.floor(x), Math.ceil(x), Math.round(x) + 1, Math.round(x) - 1, Math.round(x * 2) / 2 + 0.5]); }, function (c) { return c > 0 && Math.abs(c - x) > 0.05; }, Math.round(x) + 1);
    var w = where(M), rx = w[0], sx = w[1], p = M[1 - rx][1 - sx], q = M[rx][1 - sx], s2 = M[1 - rx][sx];
    var c1 = rnd(q * s2, 6), c2 = rnd(p * claim, 6), other = find(function () { return r.pick([x + 1, x - 1, x * 2, x + 0.5, Math.round(x) + 2]); }, function (v) { return v > 0 && Math.abs(v - x) > 0.05 && Math.abs(v - claim) > 0.05; }, x + 3);
    var Mc = M.map(function (row) { return row.slice(); }); Mc[rx][sx] = claim;
    var pron2 = pron(name) === 'she' ? 'She' : 'He';
    var opts = right ? [
      { html: 'Correct: ' + t(nT(q) + '\\times ' + nT(s2) + '=' + nT(c1)) + ' and ' + t(nT(p) + '\\times ' + nT(claim) + '=' + nT(c2)) + '. The cross products are equal.', right: true },
      { html: 'Wrong: the cross products are not equal. The answer should be ' + t(nT(rnd(other, 2))) + '.', why: 'Work them out: ' + t(nT(q) + '\\times ' + nT(s2) + '=' + nT(c1)) + ' and ' + t(nT(p) + '\\times ' + nT(claim) + '=' + nT(c2)) + '. They are equal.' },
      { html: 'Wrong: ' + t(nT(M[1 - rx][0]) + '\\times ' + nT(M[1 - rx][1]) + '=' + nT(rnd(M[1 - rx][0] * M[1 - rx][1], 6))) + ', which doesn’t match.', why: 'Multiply along the diagonals, not the two ' + (rx === 0 ? 'bottoms' : 'tops') + '.' }]
      : [
      { html: 'Wrong: ' + t(nT(q) + '\\times ' + nT(s2) + '=' + nT(c1)) + ' but ' + t(nT(p) + '\\times ' + nT(claim) + '=' + nT(c2)) + '. The correct answer is ' + t('x=' + dpx) + '.', right: true },
      { html: 'Correct: the cross products are equal.', why: 'Work them out: ' + t(nT(q) + '\\times ' + nT(s2) + '=' + nT(c1)) + ' but ' + t(nT(p) + '\\times ' + nT(claim) + '=' + nT(c2)) + '. Not equal.' },
      { html: 'Wrong: the cross products are not equal. The correct answer is ' + t('x=' + nT(rnd(other, 2))) + '.', why: 'Right that it’s wrong — but solve it: ' + t(nT(c1) + '=' + nT(p) + 'x') + ', so ' + t('x=' + nT(c1) + '\\div ' + nT(p)) + '.' }];
    if (!right) opts.push({ html: 'Close enough: ' + t(nT(c2)) + ' is near ' + t(nT(c1)) + ', so it is correct.', why: 'Only a rounded answer gives cross products that are “very close”. Here x can be found exactly: ' + t(nT(c1) + '\\div ' + nT(p) + '=' + dpx) + '.' });
    var sol = right ? br([t(nT(q) + '\\times ' + nT(s2) + '=' + nT(c1)) + ' and ' + t(nT(p) + '\\times ' + nT(claim) + '=' + nT(c2)) + '.', 'The cross products are equal, so ' + name + ' is <b>correct</b>.'])
      : br([t(nT(q) + '\\times ' + nT(s2) + '=' + nT(c1)) + ' but ' + t(nT(p) + '\\times ' + nT(claim) + '=' + nT(c2)) + '. Not equal, so ' + name + ' is <b>wrong</b>.', t(nT(p) + 'x=' + nT(c1)) + ', so ' + t('x=' + nT(c1) + '\\div ' + nT(p) + '=' + dpx) + '.']);
    return P.mc(r, name + ' says the solution of ' + t(propTex(M)) + ' is ' + t('x=' + nT(claim)) + '. Check ' + (pron(name) === 'she' ? 'her' : 'his') + ' answer with cross products.', opts, sol, ['Put ' + nT(claim) + ' in for x and multiply along both diagonals.'], 'check claim');
  }

  /* ---- "how many must you buy?" (round up) ---- */
  function buyChk(n, exact, wrongs) {
    var base = numChk(n, wrongs);
    return function (resp) {
      var pn = HW.parse.number(String(resp == null ? '' : resp).replace(/\s*[a-zA-Z]+\s*$/, ''));
      if (pn.ok && !isInt(pn.value) && Math.abs(pn.value - exact) < 0.06) return form('u1l4-whole', 'Right calculation — but you can only buy whole ones. Round to a whole number (think: up or down?).');
      if (pn.ok && Math.abs(pn.value - Math.floor(exact)) < 1e-9 && !isInt(exact)) return wrong('u1l4-round-down', t(Math.floor(exact)) + ' wouldn’t be enough: it covers less than you need. Round <b>up</b>.');
      return base(resp);
    };
  }

  HW.addCodes({ 'u1l4-same-row': 'Multiplied the two tops/bottoms (not diagonals)', 'u1l4-wrong-divide': 'Divided by the wrong number', 'u1l4-added': 'Added instead of scaling', 'u1l4-flip': 'Ratio flipped on one side',
    'u1l4-no-convert': 'Units not converted (mL / L, cm / m)', 'u1l4-wrong-unit': 'Answer in the wrong unit', 'u1l4-whole': 'Did not round to a whole number', 'u1l4-round-down': 'Rounded down when it must round up',
    'u1l4-unrounded': 'Used the unrounded number of items', 'u1l4-real': 'Gave the real distance instead of the map distance', 'u1l4-batch': 'Used the number of batches as the answer' });
  HW.addPartial({ 'u1l4-same-row': 'n', 'u1l4-wrong-divide': 'n', 'u1l4-added': 'n', 'u1l4-flip': 'n', 'u1l4-no-convert': 'b', 'u1l4-wrong-unit': 's', 'u1l4-round-down': 'b', 'u1l4-unrounded': 's', 'u1l4-real': 'b', 'u1l4-batch': 'b' });

  /* ---------- word problems: a/b = c/x with the words ---------- */
  /* Solve "A per B": given known pair (k1 of thing1 with k2 of thing2), find thing1 for v2 (dir 'top') or thing2 for v1 (dir 'bot').
   * Returns {ans, M, lines} with the word proportion. */
  function wordProp(n1, n2, k1, k2, given, dir, dp) {
    var M = dir === 'top' ? [[k1, null], [k2, given]] : [[k1, given], [k2, null]], x = solveM(M);
    var head = t('\\dfrac{\\text{' + n1 + '}}{\\text{' + n2 + '}}') + ': \\(\\;\\)' + t(propTex(M));
    return { ans: x, M: M, lines: [head].concat(crossLines(M, dp).slice(0)) };
  }
  function flipW(k1, k2, given, dir, extraHint) { // the ratio flipped on one side, and adding
    var W = [];
    if (dir === 'top') { W.push({ v: k2 * given / k1, code: 'u1l4-flip', hint: 'Keep the <b>same thing in the same position</b> on both sides. ' + (extraHint || '') }); W.push({ v: k1 + given - k2, code: 'u1l4-added', hint: 'Only multiply or divide. Adding the same amount doesn’t keep the ratio equal.' }); }
    else { W.push({ v: k1 * given / k2, code: 'u1l4-flip', hint: 'Keep the <b>same thing in the same position</b> on both sides. ' + (extraHint || '') }); W.push({ v: k2 + given - k1, code: 'u1l4-added', hint: 'Only multiply or divide. Adding the same amount doesn’t keep the ratio equal.' }); }
    return W;
  }
  var CITIES = [['Calgary', 'Red Deer', 145], ['Calgary', 'Lethbridge', 210], ['Edmonton', 'Red Deer', 150], ['Calgary', 'Banff', 125], ['Lethbridge', 'Medicine Hat', 165], ['Edmonton', 'Jasper', 365], ['Calgary', 'Drumheller', 135], ['Edmonton', 'Lloydminster', 250], ['Red Deer', 'Drumheller', 100], ['Calgary', 'Edmonton', 280], ['Calgary', 'Medicine Hat', 295], ['Edmonton', 'Grande Prairie', 455]];

  HW.defineLesson({
    id: 'u1l4', unit: 1, num: '4', title: 'Proportions: Finding the Missing Value', outcome: 'N1',
    blurb: 'Deciding if two ratios form a proportion, then solving for the missing value by scaling or cross-multiplying, in recipes, maps, fuel mixes, doses and photos.',
    questions: [
      /* ---------- Q1 ---------- */
      { num: '1', stem: '', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var kinds = r.shuffle([['yes', 'colon'], ['no', 'frac'], ['yes', 'colon'], ['yes', 'frac'], ['no', 'colon']]).slice(0, 4);
          if (!kinds.some(function (k) { return k[0] === 'no'; })) kinds[0] = ['no', 'frac'];
          var rows = kinds.map(function (k) { var x = k[0] === 'yes' ? yesPair(r, k[1] === 'frac' ? 'frac' : 'colon') : noPair(r, k[1] === 'frac' ? 'frac' : 'colon'); x.kind = k[1]; return x; });
          return propGridPart(r, rows, 'Do the two ratios form a proportion?');
        } }] },
      /* ---------- Q2 ---------- */
      { num: '2', stem: 'Solve each proportion by scaling.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { return propPart(genScale(r, { pos: function () { return [0, 1]; }, base: function (r) { return cop(r, 1, 6, function (v) { return v[0] < v[1]; }); }, fallback: [[2, null], [7, 28]] }), { method: 'scale' }); } },
        { id: '2b', level: 'BEG', make: function (r) { return propPart(genScale(r, { pos: function () { return [1, 1]; }, base: function (r) { return cop(r, 2, 8, function (v) { return v[0] < v[1]; }); }, fallback: [[5, 30], [6, null]] }), { method: 'scale' }); } },
        { id: '2c', level: 'BEG', make: function (r) { return propPart(genScale(r, { down: true, pos: function () { return [0, 1]; }, base: function (r) { return cop(r, 1, 6, function (v) { return v[0] < v[1]; }); }, fallback: [[24, null], [32, 4]] }), { method: 'scale' }); } },
        { id: '2d', level: 'BEG', make: function (r) { var M = genScale(r, { down: true, pos: function () { return [0, 1]; }, base: function (r) { return cop(r, 2, 9); }, fallback: [[27, null], [30, 10]] }); return propPart([[M[0][1], M[0][0]], [M[1][1], M[1][0]]], { method: 'scale' }); } },
        { id: '2e', level: 'BEG', make: function (r) { return propPart(genScale(r, { pos: function () { return [1, 1]; }, base: function (r) { return cop(r, 2, 9, function (v) { return v[0] < v[1]; }); }, fallback: [[4, 16], [9, null]] }), { method: 'scale', form: 'colon' }); } },
        { id: '2f', level: 'EMG', make: function (r) { var M = genScale(r, { pos: function () { return [1, 1]; }, base: function (r) { return cop(r, 2, 9, function (v) { return v[0] > v[1]; }); }, fallback: [[9, 45], [2, null]] }); return propPart([[M[0][1], M[0][0]], [M[1][1], M[1][0]]], { method: 'scale', form: 'colon' }); } }] },
      /* ---------- Q3 ---------- */
      { num: '3', stem: 'Solve by cross-multiplying. Round to the nearest tenth where needed.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return propPart(genCross(r, { pos: function () { return [0, 0]; }, gen: function (r) { return [0, r.int(4, 16), r.int(5, 20), r.int(6, 20)]; }, test: function (M, x) { return isInt(x) && x > 1; }, fallback: [[null, 15], [8, 12]] })); } },
        { id: '3b', level: 'BEG', make: function (r) { return propPart(genCross(r, { pos: function () { return [1, 0]; }, gen: function (r) { return [r.int(3, 20), 0, r.int(3, 12), r.int(5, 20)]; }, test: function (M, x) { return isInt(x) && x > 1; }, fallback: [[9, 6], [null, 10]] })); } },
        { id: '3c', level: 'EMG', make: function (r) { return propPart(genCross(r, { pos: function () { return [0, 1]; }, gen: function (r) { return [r.int(2, 11), r.int(6, 16), 0, r.int(10, 40)]; }, test: function (M, x) { return gcd(M[0][0], M[1][0]) === 1 && M[0][0] < M[1][0]; }, fallback: [[7, null], [12, 30]] })); } },
        { id: '3d', level: 'EMG', make: function (r) { return propPart(genCross(r, { pos: function () { return [1, 0]; }, gen: function (r) { return [r.int(7, 19), 0, r.int(2, 9), r.int(4, 12)]; }, test: function (M, x) { return M[0][1] < M[1][1] && gcd(M[0][1], M[1][1]) === 1; }, fallback: [[13, 5], [null, 9]] })); } },
        { id: '3e', level: 'PRG', make: function (r) { return propPart(genCross(r, { pos: function () { return [0, 0]; }, gen: function (r) { return [0, r.pick([1.5, 2.5, 3.5, 4.5, 1.2, 2.4]), r.int(2, 9), r.pick([2.5, 7.5, 1.5, 4.5, 3.6, 4.8])]; }, test: function (M, x) { return M[1][0] !== M[1][1] && isInt(x * 10); }, fallback: [[null, 6], [4.5, 7.5]] })); } },
        { id: '3f', level: 'PRG', make: function (r) { return propPart(genCross(r, { round: true, pos: function () { return [1, 1]; }, gen: function (r) { return [r.int(3, 13), r.int(7, 17), r.int(15, 50), 0]; }, test: function (M, x) { return M[0][0] < M[1][0]; }, fallback: [[11, 40], [15, null]] })); } }] },
      /* ---------- Q4 ---------- */
      { num: '4', shared: function (r) {
        var v = find(function () { return [r.int(2, 9), r.pick([5, 10, 4, 8, 6, 12]), r.pick([15, 20, 25, 30, 18, 24, 35])]; }, function (v) { var x = v[0] * v[2] / v[1], ty = v[0] * v[1] / v[2]; return isInt(x) && x > 1 && Math.abs(ty - x) > 1 && v[1] < v[2] && !isInt(v[2] / v[1]); }, [4, 10, 25]);
        return { a: v[0], c: v[1], d: v[2], nm: r.pick(['Tyler', 'Jordan', 'Owen', 'Raj', 'Liam']) };
      }, stem: function (s) { var ty = s.a * s.c / s.d; return s.nm + ' solved ' + t('\\dfrac{' + s.a + '}{x}=\\dfrac{' + s.c + '}{' + s.d + '}') + ' like this: \\(\\quad\\)' + t(s.a + '\\times ' + s.c + '=' + s.d + '\\times x') + ', \\(\\quad\\)' + t(s.a * s.c + '=' + s.d + 'x') + ', \\(\\quad\\)' + t('x=' + nT(rnd(ty, 4))) + '.'; }, parts: [
        { id: '4a', level: 'EMG', make: function (r, s) {
          var opts = [{ html: 'He multiplied the two top numbers (' + t(s.a) + ' and ' + t(s.c) + ') together. He should multiply along the diagonals: ' + t(s.a) + ' with ' + t(s.d) + ', and ' + t('x') + ' with ' + t(s.c) + '.', right: true },
            { html: 'He divided by the wrong number: he should have divided ' + t(s.a * s.c) + ' by ' + t(s.c) + '.', why: 'Look at the first line: which numbers did he multiply? Cross products go along the diagonals.' },
            { html: 'He should have added: ' + t(s.a + '+' + s.c + '=' + s.d + '+x') + '.', why: 'Proportions are never solved by adding. Multiply along the diagonals.' },
            { html: 'Nothing: his answer is correct.', why: 'Check it: ' + t('\\frac{' + s.a + '}{' + nT(rnd(s.a * s.c / s.d, 4)) + '}') + ' is not equal to ' + t('\\frac{' + s.c + '}{' + s.d + '}') + '.' }];
          return P.mc(r, 'What mistake did ' + s.nm + ' make?', opts, 'He multiplied the two top numbers. In a proportion, multiply along the <b>diagonals</b>: ' + t(s.a) + ' with ' + t(s.d) + ', and ' + t('x') + ' with ' + t(s.c) + '.', ['Which numbers sit diagonally across from each other?'], 'Q4a');
        } },
        { id: '4b', level: 'EMG', make: function (r, s) { var M = [[s.a, s.c], [null, s.d]], p = propPart(M); p.prompt = 'Solve the proportion correctly.'; p.solution += '<br>(Check: ' + t('\\frac{' + s.a + '}{' + nT(solveM(M)) + '}=' + nT(rnd(s.a / solveM(M), 3))) + ' and ' + t('\\frac{' + s.c + '}{' + s.d + '}=' + nT(rnd(s.c / s.d, 3))) + '.)'; return p; } }] },
      /* ---------- Q5 ---------- */
      { num: '5', stem: 'Check each student’s answer using cross products. If the answer is wrong, find the correct one.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var M = find(function () { var pq = cop(r, 2, 9, function (v) { return v[0] < v[1]; }), m = r.int(2, 3), n = r.int(3, 7); return [[pq[0] * m, null], [pq[1] * m, pq[1] * n]]; }, function (M) { return !isInt(M[1][1] / M[1][0]) && !samePropM(M, EX_PROP); }, [[6, null], [14, 35]]); return checkClaimPart(r, M, r.pick(['Mai', 'Ava', 'Sofia', 'Hana']), r.chance(0.7)); } },
        { id: '5b', level: 'EMG', make: function (r) { var M = genCross(r, { pos: function () { return [0, 0]; }, gen: function (r) { return [0, r.int(5, 12), r.int(4, 15), r.int(6, 16)]; }, fallback: [[null, 10], [9, 12]] }); return checkClaimPart(r, M, r.pick(['Devon', 'Ben', 'Omar', 'Kofi']), r.chance(0.3)); } }] },
      /* ---------- Q6 ---------- */
      { num: '6', shared: function (r) {
        var v = find(function () { return [r.pick([4, 6, 8, 10, 12]), r.pick([500, 600, 700, 800, 900, 1000, 1200]), r.pick([2, 3, 4]), r.int(2, 11), r.int(9, 30)]; }, function (v) { var S = v[0], beef = v[1] * v[3] / S, cans = v[2] * v[4] / S; return v[3] !== S && v[4] > S && isInt(beef) && beef % 5 === 0 && isInt(cans) && !(S === 12 && v[1] === 2.5); }, [8, 900, 2, 6, 20]);
        return { S: v[0], B: v[1], C: v[2], n1: v[3], n2: v[4], dish: r.pick(['chili', 'pasta bake', 'taco filling', 'stew']) };
      }, stem: function (s) { return 'A ' + s.dish + ' recipe serves ' + t(s.S) + ' people. It uses ' + t(s.B + u('g')) + ' of ground beef and ' + t(s.C) + ' cans of beans.'; }, parts: [
        { id: '6a', level: 'EMG', make: function (r, s) { var w = wordProp('beef', 'people', s.B, s.S, s.n1, 'top'); return numPart('How much ground beef is needed to serve ' + t(s.n1) + ' people?', w.ans, { after: 'g', unit: 'g', wrongs: flipW(s.B, s.S, s.n1, 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['You need ' + t(nT(w.ans) + u('g')) + ' of ground beef.'])), hints: ['Write the proportion in words first: beef over people on both sides.'], text: 'Q6a' }); } },
        { id: '6b', level: 'EMG', make: function (r, s) { var w = wordProp('cans', 'people', s.C, s.S, s.n2, 'top'); return numPart('How many cans of beans are needed to serve ' + t(s.n2) + ' people?', w.ans, { after: 'cans', unit: 'cans', wrongs: flipW(s.C, s.S, s.n2, 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['You need ' + t(nT(w.ans)) + ' cans of beans.'])), hints: ['Cans over people on both sides.'], text: 'Q6b' }); } }] },
      /* ---------- Q7 ---------- */
      { num: '7', shared: function (r) {
        var s = r.pick([25, 20, 40, 50, 30]);
        var pa = find(function () { return r.pick(CITIES); }, function (c) { return isInt(c[2] / s * 10) && c[2] / s >= 2 && c[2] / s <= 20; }, CITIES[0]);
        var pb = find(function () { return r.pick(CITIES); }, function (c) { var x = c[2] / s; return c !== pa && x >= 2 && x <= 20 && (isInt(x * 10) || !isInt(x * 20)); }, CITIES[9]);
        return { s: s, A: pa, B: pb };
      }, stem: function (s) { return 'On a road map of Alberta, ' + t('1' + u('cm')) + ' represents ' + t(s.s + u('km')) + '.'; }, parts: [
        { id: '7a', level: 'EMG', make: function (r, s) { var cm = rnd(s.A[2] / s.s, 1), km = rnd(cm * s.s, 6); var w = wordProp('map (cm)', 'real (km)', 1, s.s, cm, 'bot');
          return numPart(s.A[0] + ' and ' + s.A[1] + ' are ' + t(nT(cm) + u('cm')) + ' apart on the map. About how far apart are they really?', km, { after: 'km', unit: 'km', wrongs: [{ v: cm / s.s, code: 'u1l4-flip', hint: 'Each centimetre on the map is ' + t(s.s + u('km')) + ' in real life, so the real distance is much bigger: multiply.' }, { v: cm + s.s - 1, code: 'u1l4-added', hint: 'Only multiply or divide.' }],
            sol: br(w.lines.concat(['They are about ' + t(nT(km) + u('km')) + ' apart.'])), hints: ['Each centimetre stands for ' + t(s.s + u('km')) + '.'], text: 'Q7a' }); } },
        { id: '7b', level: 'EMG', make: function (r, s) { var km = s.B[2], x = km / s.s, dp = isInt(x * 10) ? null : 1; var w = wordProp('map (cm)', 'real (km)', 1, s.s, km, 'top', 1);
          return numPart(s.B[0] + ' and ' + s.B[1] + ' are about ' + t(km + u('km')) + ' apart. How far apart are they on the map?' + (dp ? ' Round to the nearest tenth of a centimetre.' : ''), dp ? x : rnd(x, 6), { dp: dp, after: 'cm', unit: 'cm', wrongs: [{ v: km * s.s, code: 'u1l4-flip', hint: 'The map distance is much <b>smaller</b> than the real distance: divide by ' + t(s.s) + '.' }, { v: km - s.s + 1, code: 'u1l4-added', hint: 'Only multiply or divide.' }],
            sol: br(w.lines.concat(['They are ' + (dp ? 'about ' : '') + t((dp ? rnd(x, 1).toFixed(1) : nT(x)) + u('cm')) + ' apart on the map.'])), hints: ['Each ' + t(s.s + u('km')) + ' of real distance is ' + t('1' + u('cm')) + ' on the map.'], text: 'Q7b' }); } }] },
      /* ---------- Q8 ---------- */
      { num: '8', shared: function (r) {
        var sc = r.pick([[1.5, 2], [2, 3], [2.5, 2], [1.5, 1], [3, 4], [2, 5]]);
        var plan = find(function () { return rnd(r.int(25, 120) / 10, 6); }, function (p) { var real = p * sc[1] / sc[0]; return isInt(real * 10) && real >= 3 && real <= 15 && !(sc[0] === 1.5 && sc[1] === 2 && p === 6.3 && false); }, 6.3);
        var real2 = find(function () { return rnd(r.int(15, 60) / 10, 6); }, function (m) { var x = m * sc[0] / sc[1]; return !isInt(x * 20) && x >= 1; }, 3.5);
        return { c: sc[0], m: sc[1], plan: plan, real2: real2, room: r.pick(['family room', 'games room', 'bedroom', 'home gym']) };
      }, stem: function (s) { return 'On a floor plan for a basement, ' + t(nT(s.c) + u('cm')) + ' represents ' + t(nT(s.m) + u('m')) + '.'; }, parts: [
        { id: '8a', level: 'PRG', make: function (r, s) { var w = wordProp('plan (cm)', 'real (m)', s.c, s.m, s.plan, 'bot');
          return numPart('A ' + s.room + ' is ' + t(nT(s.plan) + u('cm')) + ' long on the plan. How long is the real room?', rnd(w.ans, 6), { after: 'm', unit: 'm', wrongs: flipW(s.c, s.m, s.plan, 'bot').concat(propWrongs(w.M)), sol: br(w.lines.concat(['The room is ' + t(nT(rnd(w.ans, 6)) + u('m')) + ' long.'])), hints: ['Write plan over real on both sides.'], text: 'Q8a' }); } },
        { id: '8b', level: 'PRG', make: function (r, s) { var w = wordProp('plan (cm)', 'real (m)', s.c, s.m, s.real2, 'top', 1);
          return numPart('A real wall is ' + t(nT(s.real2) + u('m')) + ' long. How long should it be on the plan? Round to the nearest tenth of a centimetre.', w.ans, { dp: 1, after: 'cm', unit: 'cm', wrongs: flipW(s.c, s.m, s.real2, 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['It should be about ' + t(rnd(w.ans, 1).toFixed(1) + u('cm')) + ' long on the plan.'])), hints: ['Plan over real on both sides: ' + t('\\dfrac{' + nT(s.c) + '}{' + nT(s.m) + '}=\\dfrac{x}{' + nT(s.real2) + '}') + '.'], text: 'Q8b' }); } }] },
      /* ---------- Q9 ---------- */
      { num: '9', shared: function (r) {
        var v = find(function () { return [r.pick([25, 32, 40, 50]), r.pick([1, 2, 2.5, 4, 5, 1.5]), r.pick([100, 125, 200, 250, 500])]; }, function (v) { var oil = v[1] * 1000 / v[0], gas = v[2] * v[0] / 1000; return isInt(oil * 2) && isInt(gas * 100) && !(v[0] === 50 && (v[1] === 4 || v[2] === 250)); }, [40, 2, 100]);
        return { R: v[0], G: v[1], O: v[2], nm: r.pick(['Ella', 'Mateo', 'Grace', 'Ben']), tool: r.pick(['chainsaw', 'leaf blower', 'string trimmer', 'dirt bike']) };
      }, stem: function (s) { return s.nm + '’s ' + s.tool + ' needs gas and oil mixed in the ratio ' + t(s.R + ':1') + '.'; }, parts: [
        { id: '9a', level: 'PRG', make: function (r, s) { var mL = rnd(s.G * 1000, 6), x = mL / s.R;
          return numPart('How many millilitres of oil should ' + pron(s.nm) + ' add to ' + t(nT(s.G) + u('L')) + ' of gas?', x, { after: 'mL', unit: 'mL', wrongs: [{ v: s.G / s.R, code: 'u1l4-no-convert', hint: 'Units in the same position must match. Change the gas to millilitres first: ' + t(nT(s.G) + u('L') + '=' + HW.fmt(mL) + u('mL')) + '.' }, { v: s.G * s.R, code: 'u1l4-flip', hint: 'There is much <b>less</b> oil than gas: ' + t(s.R) + ' parts gas to ' + t('1') + ' part oil.' }, { v: mL * s.R, code: 'u1l4-flip', hint: 'There is much <b>less</b> oil than gas: divide by ' + t(s.R) + '.' }],
            sol: br(['Units must match: ' + t(nT(s.G) + u('L') + '=' + HW.fmt(mL) + u('mL')), t('\\dfrac{\\text{gas}}{\\text{oil}}') + ': ' + t('\\dfrac{' + s.R + '}{1}=\\dfrac{' + HW.fmt(mL) + '}{x}'), t(s.R + 'x=' + HW.fmt(mL)) + ', so ' + t('x=' + nT(x)), 'Add ' + t(nT(x) + u('mL')) + ' of oil.']), hints: ['Change litres to millilitres first.', 'Gas over oil on both sides.'], text: 'Q9a' }); } },
        { id: '9b', level: 'PRG', make: function (r, s) { var mL = s.O * s.R, L = mL / 1000;
          return numPart(pron(s.nm) === 'she' ? 'She has a ' + t(s.O + u('mL')) + ' bottle of oil. How many litres of gas can she mix with all of it?' : 'He has a ' + t(s.O + u('mL')) + ' bottle of oil. How many litres of gas can he mix with all of it?', L, { after: 'L', unit: 'L', wrongs: [{ v: mL, code: 'u1l4-wrong-unit', hint: 'That is in millilitres. The question asks for litres: divide by ' + t('1000') + '.' }, { v: s.O / s.R, code: 'u1l4-flip', hint: 'There is much <b>more</b> gas than oil: multiply by ' + t(s.R) + '.' }, { v: s.O / s.R / 1000, code: 'u1l4-flip', hint: 'There is much <b>more</b> gas than oil: multiply by ' + t(s.R) + '.' }],
            sol: br([t('\\dfrac{' + s.R + '}{1}=\\dfrac{x}{' + s.O + '}') + ', so ' + t('x=' + s.R + '\\times ' + s.O + '=' + HW.fmt(mL) + u('mL')), t(HW.fmt(mL) + '\\div 1000=' + nT(L)) + ', so ' + t(nT(L) + u('L')) + ' of gas.']), hints: ['Gas over oil: ' + t('\\dfrac{' + s.R + '}{1}=\\dfrac{x}{' + s.O + '}') + '.', 'Then change mL to L.'], text: 'Q9b' }); } }] },
      /* ---------- Q10 ---------- */
      { num: '10', shared: function (r) {
        var v = find(function () { return [r.pick([25, 15, 10, 20, 30, 12.5]), r.pick([2, 3, 4, 5]), r.int(14, 60), r.pick([300, 400, 450, 500, 600, 750, 360, 240])]; }, function (v) { var dose = v[0] * v[2] / v[1], mass = v[3] * v[1] / v[0]; return isInt(dose) && isInt(mass) && mass >= 10 && mass <= 90 && v[2] !== mass && !isInt(v[2] / v[1]) && !(v[0] === 1.5); }, [25, 2, 34, 600]);
        return { d: v[0], k: v[1], M: v[2], D: v[3] };
      }, stem: function (s) { return 'A medicine is ordered at ' + t(nT(s.d) + u('mg')) + ' for every ' + t(s.k + u('kg')) + ' of body mass. <i>(Practice numbers only.)</i>'; }, parts: [
        { id: '10a', level: 'EMG', make: function (r, s) { var w = wordProp('mg', 'kg', s.d, s.k, s.M, 'top'); return numPart('How many milligrams should a ' + t(s.M + u('kg')) + ' child get?', w.ans, { after: 'mg', unit: 'mg', wrongs: flipW(s.d, s.k, s.M, 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['The child should get ' + t(nT(w.ans) + u('mg')) + '.'])), hints: ['mg over kg on both sides.'], text: 'Q10a' }); } },
        { id: '10b', level: 'EMG', make: function (r, s) { var w = wordProp('mg', 'kg', s.d, s.k, s.D, 'bot'); return numPart('Another patient was given ' + t(s.D + u('mg')) + '. What is the patient’s mass?', w.ans, { after: 'kg', unit: 'kg', wrongs: flipW(s.d, s.k, s.D, 'bot').concat(propWrongs(w.M)), sol: br(w.lines.concat(['The patient’s mass is ' + t(nT(w.ans) + u('kg')) + '.'])), hints: ['mg over kg on both sides; x is the kilograms.'], text: 'Q10b' }); } }] },
      /* ---------- Q11 ---------- */
      { num: '11', shared: function (r) {
        var v = find(function () { var wh = r.pick([[12, 9], [15, 10], [10, 8], [6, 4], [12, 8], [16, 12], [9, 6], [8, 6]]); return [wh[0], wh[1], r.int(18, 60), r.int(2, 8)]; }, function (v) { var H = v[2] * v[1] / v[0], W2 = v[3] * v[0] / v[1]; return isInt(H * 2) && isInt(W2 * 2) && v[3] < v[1] && !(v[0] === 10 && v[1] === 15) && !isInt(v[2] / v[0]); }, [12, 9, 40, 6]);
        return { w: v[0], h: v[1], W: v[2], h2: v[3], dev: r.pick(['phone', 'camera', 'tablet']) };
      }, stem: function (s) { return 'A photo from a ' + s.dev + ' is printed ' + t(s.w + u('cm')) + ' wide and ' + t(s.h + u('cm')) + ' tall.'; }, parts: [
        { id: '11a', level: 'EMG', make: function (r, s) { var w = wordProp('width', 'height', s.w, s.h, s.W, 'bot'); return numPart('It is enlarged to ' + t(s.W + u('cm')) + ' wide without stretching. How tall is the enlargement?', rnd(w.ans, 6), { after: 'cm', unit: 'cm', wrongs: flipW(s.w, s.h, s.W, 'bot', 'Width over height on both sides.').concat(propWrongs(w.M)), sol: br(w.lines.concat(['It is ' + t(nT(rnd(w.ans, 6)) + u('cm')) + ' tall.'])), hints: ['Width over height on both sides.'], text: 'Q11a' }); } },
        { id: '11b', level: 'EMG', make: function (r, s) { var w = wordProp('width', 'height', s.w, s.h, s.h2, 'top'); return numPart('A small copy for a wallet is ' + t(s.h2 + u('cm')) + ' tall. How wide is it?', rnd(w.ans, 6), { after: 'cm', unit: 'cm', wrongs: flipW(s.w, s.h, s.h2, 'top', 'Width over height on both sides.').concat(propWrongs(w.M)), sol: br(w.lines.concat(['It is ' + t(nT(rnd(w.ans, 6)) + u('cm')) + ' wide.'])), hints: ['Width over height on both sides; this time x is a width.'], text: 'Q11b' }); } }] },
      /* ---------- Q12 ---------- */
      { num: '12', shared: function (r) {
        var v = find(function () { return [r.pick([1.8, 2.2, 2.4, 1.6, 2.6, 1.9]), r.int(20, 60), r.pick([39.99, 44.99, 49.99, 54.99, 59.99, 42.49, 47.49])]; }, function (v) { var n = v[1] / v[0]; return !isInt(n) && n - Math.floor(n) < 0.6 && n - Math.floor(n) > 0.05; }, [2.2, 38, 54.99]);
        return { c: v[0], A: v[1], p: v[2], nm: r.pick(['Nadia', 'Mateo', 'Aisha', 'Tyler']), what: r.pick([['laminate flooring', 'basement room'], ['vinyl plank flooring', 'basement room'], ['carpet tile', 'rec room']]) };
      }, stem: function (s) { return 'One box of ' + s.what[0] + ' covers ' + t(nT(s.c) + u('m') + '^{2}') + '. ' + s.nm + ' is putting ' + s.what[0] + ' in a ' + t(s.A + u('m') + '^{2}') + ' ' + s.what[1] + '.'; }, parts: [
        { id: '12a', level: 'PRG', make: function (r, s) { var ex = s.A / s.c, n = Math.ceil(ex);
          var p = { prompt: 'How many boxes must ' + pron(s.nm) + ' buy?', input: { type: 'number', after: 'boxes' }, check: buyChk(n, ex, [{ v: s.A * s.c, code: 'u1l4-flip', hint: 'Divide the area by what one box covers: ' + t(s.A + '\\div ' + nT(s.c)) + '.' }, { v: Math.round(s.c / s.A * 100) / 100, code: 'u1l4-flip', hint: 'Divide the area by what one box covers: ' + t(s.A + '\\div ' + nT(s.c)) + '.' }]),
            key: String(n), answer: t(n) + ' boxes', text: 'Q12a', solution: br([t('\\dfrac{1}{' + nT(s.c) + '}=\\dfrac{x}{' + s.A + '}'), t(nT(s.c) + 'x=' + s.A) + ', so ' + t('x=' + s.A + '\\div ' + nT(s.c) + '\\approx ' + rnd(ex, 2).toFixed(2)) + ' boxes', t(Math.floor(ex)) + ' boxes is not enough, so round up: ' + pron(s.nm) + ' must buy ' + t(n) + ' boxes.']),
            hints: ['Boxes over area on both sides: ' + t('\\dfrac{1}{' + nT(s.c) + '}=\\dfrac{x}{' + s.A + '}') + '.', 'Can you buy part of a box? Would rounding down cover the room?'] };
          p.bad = [String(Math.floor(ex)), rnd(ex, 2).toFixed(2)]; return p; } },
        { id: '12b', level: 'EMG', make: function (r, s) { var n = Math.ceil(s.A / s.c), cost = n * s.p;
          return moneyPart('Each box costs ' + t(mT(s.p)) + '. What do the boxes cost before tax?', cost, { wrongs: [{ v: Math.floor(s.A / s.c) * s.p, code: 'u1l4-round-down', hint: 'Use the number of boxes ' + pron(s.nm) + ' must <b>buy</b> (rounded up): ' + t(n) + '.' }, { v: s.A / s.c * s.p, code: 'u1l4-unrounded', hint: 'You can only buy whole boxes. Use ' + t(n) + ' boxes.' }, { v: s.A * s.p, code: 'u1l4-flip', hint: 'Multiply the price by the number of <b>boxes</b>, not the area.' }],
            sol: t(n + '\\times ' + mT(s.p) + '=' + mT(cost)), hints: ['Use the number of boxes from part (a).'], text: 'Q12b' }); } }] },
      /* ---------- Q13 ---------- */
      { num: '13', shared: function (r) {
        var v = find(function () { return [r.pick([2, 3, 4]), r.pick([200, 250]), r.pick([1, 1.5, 2, 2.5]), r.int(8, 30)]; }, function (v) { var need = v[0] * v[2] * 1000 / v[1]; var L = v[3] * v[1] / v[0] / 1000; return isInt(need) && v[3] < need && need - v[3] >= 2 && !isInt(L * 10) && !isInt(L * 20); }, [3, 250, 2, 20]);
        return { p: v[0], V: v[1], L: v[2], P: v[3], need: v[0] * v[2] * 1000 / v[1], nm: r.pick(['Kofi', 'Maya', 'Liam', 'Zoe']), drink: r.pick(['hot chocolate', 'chai latte']) };
      }, stem: function (s) { return 'A ' + s.drink + ' mix says to use ' + t(s.p + u('tbsp')) + ' of powder for every ' + t(s.V + u('mL')) + ' of milk. ' + s.nm + ' has ' + t(nT(s.L) + u('L')) + ' of milk and ' + t(s.P + u('tbsp')) + ' of powder.'; }, parts: [
        { id: '13a', level: 'PRG', make: function (r, s) {
          var mL = s.L * 1000, N = s.need, Nb = s.p * s.L, Nc = s.P * s.V;
          var opts = [{ html: 'No. ' + (pron(s.nm) === 'she' ? 'She' : 'He') + ' needs ' + t(N + u('tbsp')) + ' for ' + t(nT(s.L) + u('L')) + ' of milk but has only ' + t(s.P) + '. ' + (pron(s.nm) === 'she' ? 'She' : 'He') + ' is ' + t(N - s.P + u('tbsp')) + ' short.', right: true },
            { html: 'Yes. ' + (pron(s.nm) === 'she' ? 'She' : 'He') + ' needs only ' + t(nT(Nb) + u('tbsp')) + ', and has ' + t(s.P) + '.', why: 'Units must match: ' + t(nT(s.L) + u('L') + '=' + HW.fmt(mL) + u('mL')) + '. Then ' + t('\\dfrac{' + s.p + '}{' + s.V + '}=\\dfrac{x}{' + HW.fmt(mL) + '}') + '.' },
            { html: 'Yes. ' + t(s.P + u('tbsp')) + ' is much more than ' + t(s.p + u('tbsp')) + '.', why: t(s.p + u('tbsp')) + ' is only enough for ' + t(s.V + u('mL')) + '. Find how much powder ' + t(nT(s.L) + u('L')) + ' needs.' },
            { html: 'Yes. ' + t(s.P + u('tbsp')) + ' makes ' + t(s.P + '\\times ' + s.V + '=' + HW.fmt(Nc) + u('mL')) + ' of hot drink.', why: 'Each ' + t(s.V + u('mL')) + ' needs ' + t(s.p) + ' tbsp, not ' + t('1') + '. Set up the proportion ' + t('\\dfrac{\\text{powder}}{\\text{milk}}') + '.' }];
          return P.mc(r, 'Does ' + pron(s.nm) + ' have enough powder to use all the milk?', opts,
            br([t(nT(s.L) + u('L') + '=' + HW.fmt(mL) + u('mL')), t('\\dfrac{' + s.p + '}{' + s.V + '}=\\dfrac{x}{' + HW.fmt(mL) + '}') + ': scale ' + t(s.V + '\\times ' + nT(mL / s.V) + '=' + HW.fmt(mL)) + ', so ' + t('x=' + s.p + '\\times ' + nT(mL / s.V) + '=' + N) + ' tbsp', 'Needs ' + t(N) + ' tbsp but has only ' + t(s.P) + ', so <b>no</b>. ' + t(N - s.P) + ' tbsp short.']),
            ['Change the litres of milk to millilitres.', 'How much powder does all the milk need?'], 'Q13a');
        } },
        { id: '13b', level: 'ADV', make: function (r, s) { var mL = s.P * s.V / s.p, L = mL / 1000;
          return numPart('How much milk can ' + pron(s.nm) + ' use with ' + (pron(s.nm) === 'she' ? 'her ' : 'his ') + t(s.P + u('tbsp')) + ' of powder? Round to the nearest tenth of a litre.', L, { dp: 1, after: 'L', unit: 'L', wrongs: [{ v: rnd(mL, 1), code: 'u1l4-wrong-unit', hint: 'That is in millilitres. Change it to litres: divide by ' + t('1000') + '.' }, { v: s.P * s.V / 1000, code: 'u1l4-flip', hint: 'Each ' + t(s.V + u('mL')) + ' uses ' + t(s.p) + ' tbsp, not ' + t('1') + ': set up ' + t('\\dfrac{' + s.p + '}{' + s.V + '}=\\dfrac{' + s.P + '}{x}') + '.' }, { v: s.p * s.V / s.P / 1000, code: 'u1l4-wrong-divide', hint: 'Cross-multiply: ' + t(s.p + 'x=' + s.V + '\\times ' + s.P) + '.' }],
            sol: br([t('\\dfrac{' + s.p + '}{' + s.V + '}=\\dfrac{' + s.P + '}{x}'), t(s.p + 'x=' + s.V + '\\times ' + s.P + '=' + HW.fmt(s.V * s.P)) + ', so ' + t('x=' + nT(rnd(mL, 1)) + (isInt(mL * 10) ? '' : '\\ldots') + u('mL')), t(nT(rnd(mL, 1)) + '\\div 1000\\approx ' + rnd(L, 1).toFixed(1)) + ', about ' + t(rnd(L, 1).toFixed(1) + u('L')) + ' of milk.']), hints: ['Powder over milk on both sides; x is the millilitres of milk.', 'Change mL to L, then round.'], text: 'Q13b' }); } }] },
      /* ---------- Q14 ---------- */
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var c = r.pick([['recipe', 'cups of flour', 'cups of sugar', 'flour', 'sugar'], ['concrete mix', 'buckets of gravel', 'buckets of cement', 'gravel', 'cement'], ['paint colour', 'cans of blue', 'cans of white', 'blue', 'white'], ['bread recipe', 'cups of flour', 'cups of water', 'flour', 'water']]);
          var v = find(function () { var pq = cop(r, 2, 9); return [pq[0], pq[1], r.int(2, 12)]; }, function (v) { return v[2] !== v[0] && v[2] !== v[1]; }, [4, 3, 5]);
          var a = v[0], b = v[1], n = v[2], fr = function (x, y, z, w) { return t('\\dfrac{' + x + '}{' + y + '}=\\dfrac{' + z + '}{' + w + '}'); };
          var opts = [{ html: fr(a, b, 'x', n), right: true }, { html: fr(a, b, n, 'x'), why: 'On the right, ' + c[4] + ' is on top. Keep ' + c[3] + ' on top on <b>both</b> sides.' }, { html: fr(b, a, 'x', n), why: 'On the left, ' + c[4] + ' is on top but on the right ' + c[3] + ' (x) is on top. Keep the same thing in the same position.' }, { html: fr(a, n, 'x', b), why: 'Each ratio must compare ' + c[3] + ' with ' + c[4] + ' from the <b>same</b> batch. This mixes the two batches.' }];
          return P.mc(r, 'A ' + c[0] + ' uses ' + t(a) + ' ' + c[1] + ' for every ' + t(b) + ' ' + c[2] + '. Which proportion finds the ' + c[3] + ' needed for ' + t(n) + ' ' + c[2] + '?', opts, c[3] + ' over ' + c[4] + ' on both sides: ' + fr(a, b, 'x', n) + '.', ['Write it in words first: ' + c[3] + ' over ' + c[4] + ' = ' + c[3] + ' over ' + c[4] + '.'], 'Q14 MC');
        } }] },
      /* ---------- Q15 ---------- */
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.int(3, 12), r.int(10, 30), r.int(15, 50)]; }, function (v) { var a = v[0], c = v[1], d = v[2], x = a * d / c, o = [x, d * c / a, d - c + a, a * c / d].map(function (y) { return rnd(y, 1); }); return isInt(x) && c < d && !isInt(d / c) && o.every(function (y, i) { return y > 0 && o.indexOf(y) === i; }) && !(a === 8 && c === 20 && d === 35); }, [8, 20, 35]);
          var a = v[0], c = v[1], d = v[2], x = a * d / c;
          var opts = [{ html: t(nT(rnd(d * c / a, 1))), why: 'That multiplies the wrong pair. Cross-multiply along the diagonals: ' + t(a + '\\times ' + d + '=' + c + 'x') + '.' }, { html: t(nT(rnd(d - c + a, 1))), why: 'That adds and subtracts. Only multiply or divide in a proportion.' }, { html: t(nT(x)), right: true }, { html: t(nT(rnd(a * c / d, 1))), why: 'That multiplies the two tops. Multiply along the diagonals.' }];
          return P.mc(r, 'What is the solution of ' + t('\\dfrac{' + a + '}{x}=\\dfrac{' + c + '}{' + d + '}') + '?', opts.sort(function (p, q) { return Number(q.html.replace(/[^\d.]/g, '').slice(0, 8)) - Number(p.html.replace(/[^\d.]/g, '').slice(0, 8)); }),
            t(a + '\\times ' + d + '=' + c + 'x') + ', so ' + t(a * d + '=' + c + 'x') + ' and ' + t('x=' + a * d + '\\div ' + c + '=' + nT(x)) + '.', ['Cross-multiply.'], 'Q15 MC', true);
        } }] },
      /* ---------- Q16 ---------- */
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([20, 25, 30, 40, 50]), r.pick([2000, 4000, 5000, 10000]), r.pick([24000, 32000, 36000, 45000, 48000, 52000, 60000, 64000, 75000])]; }, function (v) { var x = v[0] * v[2] / v[1]; return isInt(x) && x < 10000 && x >= 100; }, [30, 4000, 52000]);
          var d = v[0], V = v[1], PV = v[2], x = d * PV / V;
          return numPart('A pool needs ' + t(d + u('mL')) + ' of chlorine for every ' + t(HW.fmt(V) + u('L')) + ' of water. The pool holds ' + t(HW.fmt(PV) + u('L')) + ' of water. The number of millilitres of chlorine it needs is ________.', x, { nr: true,
            wrongs: [{ v: V * PV / d, code: 'u1l4-flip', hint: 'Chlorine over water on <b>both</b> sides: ' + t('\\dfrac{' + d + '}{' + HW.fmt(V) + '}=\\dfrac{x}{' + HW.fmt(PV) + '}') + '.' }, { v: d * PV, code: 'u1l4-wrong-divide', hint: 'After cross-multiplying, divide by ' + t(HW.fmt(V)) + '.' }, { v: PV / V, code: 'u1l4-batch', hint: 'That is how many times bigger the pool is. Multiply it by ' + t(d + u('mL')) + '.' }],
            sol: br([t('\\dfrac{' + d + '}{' + HW.fmt(V) + '}=\\dfrac{x}{' + HW.fmt(PV) + '}'), t(HW.fmt(V) + 'x=' + d + '\\times ' + HW.fmt(PV) + '=' + HW.fmt(d * PV)) + ', so ' + t('x=' + HW.fmt(x) + u('mL'))]), hints: ['Chlorine over water on both sides.'], text: 'Q16 NR' });
        } }] },
      /* ---------- Q17 ---------- */
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var M = genCross(r, { round: true, pos: function () { return [0, 0]; }, gen: function (r) { return [0, r.int(3, 12), r.int(8, 25), r.int(6, 15)]; }, test: function (M, x) { return x < 100 && gcd(M[0][1], M[1][1]) === 1; }, fallback: [[null, 18], [7, 11]] });
          var x = solveM(M), p = propPart(M);
          p.prompt = 'The solution of ' + t(propTex(M)) + ', to the nearest tenth, is ________.'; p.input = { type: 'number', nr: true };
          var ws = propWrongs(M);
          p.check = K.approx(x, 1, { nr: true, diag: function (v) { return X.matchW(v, ws, 0.051); } }); p.text = 'Q17 NR';
          return p;
        } }] }
    ],
    extra: [
      /* ---------- A. Skills ---------- */
      { num: '1', section: 'Extra practice A — Skills', stem: '', parts: [
        { id: 'e1', level: 'BEG', make: function (r) {
          var firstYes = r.chance(0.5), rows = [firstYes ? yesPair(r, 'colon') : noPair(r, 'colon'), firstYes ? noPair(r, 'frac') : yesPair(r, 'frac')];
          var dec = r.chance(0.5) ? (function () { var a = r.pick([2.5, 1.5, 0.5, 3.5, 1.2]), k = r.int(2, 5); return { a: [a, 1], b: [rnd(a * k, 6), k], yes: true, kind: 'colon' }; })() : (function () { var a = r.pick([2.5, 1.5, 3.5]), k = r.int(2, 5); return { a: [a, 1], b: [rnd(a * k, 6) + 1, k], yes: false, kind: 'colon' }; })();
          rows.push(dec);
          return propGridPart(r, rows, 'Do the two ratios form a proportion?');
        } }] },
      { num: '2', stem: 'Solve by scaling.', parts: [
        { id: 'e2a', level: 'LIM', make: function (r) { return propPart(genScale(r, { pos: function () { return [0, 1]; }, base: function (r) { return cop(r, 1, 7, function (v) { return v[0] < v[1]; }); }, fallback: [[3, null], [5, 40]] }), { method: 'scale' }); } },
        { id: 'e2b', level: 'BEG', make: function (r) { return propPart(genScale(r, { down: true, pos: function () { return [1, 1]; }, base: function (r) { return cop(r, 2, 9, function (v) { return v[0] < v[1]; }); }, f: [3, 4, 5, 6], fallback: [[28, 7], [36, null]] }).map(function (row) { return [row[1], row[0]]; }), { method: 'scale' }); } },
        { id: 'e2c', level: 'BEG', make: function (r) { return propPart(genScale(r, { down: true, pos: function () { return [0, 1]; }, base: function (r) { return cop(r, 2, 9); }, f: [2, 3, 4, 5], fallback: [[15, null], [36, 12]] }).map(function (row) { return [row[1], row[0]]; }), { method: 'scale', form: 'colon' }); } }] },
      { num: '3', stem: 'Solve by cross-multiplying. Round to the nearest tenth where needed.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { return propPart(genCross(r, { pos: function () { return [0, 0]; }, gen: function (r) { return [0, r.int(5, 15), r.int(2, 9), r.int(4, 12)]; }, test: function (M, x) { return !isInt(x); }, fallback: [[null, 5], [9, 6]] })); } },
        { id: 'e3b', level: 'PRG', make: function (r) { return propPart(genCross(r, { round: true, pos: function () { return [1, 0]; }, gen: function (r) { return [r.int(7, 20), 0, r.int(3, 11), r.int(3, 9)]; }, fallback: [[14, 8], [null, 5]] })); } },
        { id: 'e3c', level: 'PRG', make: function (r) { return propPart(genCross(r, { round: true, pos: function () { return [1, 1]; }, gen: function (r) { return [r.int(2, 8), r.int(5, 13), r.int(9, 30), 0]; }, test: function (M) { return M[0][0] < M[1][0] && gcd(M[0][0], M[1][0]) === 1; }, fallback: [[3, 10], [7, null]] })); } },
        { id: 'e3d', level: 'PRG', make: function (r) { return propPart(genCross(r, { pos: function () { return [0, 0]; }, gen: function (r) { return [0, r.pick([2.4, 1.8, 3.6, 4.2, 1.5, 2.5]), r.int(2, 9), r.int(2, 9)]; }, test: function (M, x) { return isInt(x * 10) && M[0][1] !== M[1][1]; }, fallback: [[null, 5], [2.4, 3]] })); } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4', level: 'EMG', make: function (r) { var M = genCross(r, { pos: function () { return [1, 0]; }, gen: function (r) { return [r.int(3, 9), 0, r.int(2, 7), r.int(7, 15)]; }, test: function (M, x) { return !isInt(x) && isInt(x * 2); }, fallback: [[5, 2], [null, 9]] }); return checkClaimPart(r, M, r.pick(['Sasha', 'Ella', 'Priya', 'Nadia']), false); } }] },
      /* ---------- B. Applying ---------- */
      { num: '5', section: 'Extra practice B — Applying', stem: '', parts: [
        { id: 'e5', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([4, 6, 8, 10]), r.pick([1.5, 2, 1.2, 2.4, 3]), r.int(3, 16)]; }, function (v) { var x = v[1] * v[2] / v[0]; return v[2] !== v[0] && isInt(x * 10) && !isInt(v[2] / v[0]); }, [6, 1.5, 10]);
          var w = wordProp('broth (L)', 'servings', v[1], v[0], v[2], 'top');
          return numPart('A ' + r.pick(['soup', 'stew', 'chowder']) + ' recipe makes ' + t(v[0]) + ' servings with ' + t(nT(v[1]) + u('L')) + ' of broth. How much broth is needed for ' + t(v[2]) + ' servings?', rnd(w.ans, 6), { after: 'L', unit: 'L', wrongs: flipW(v[1], v[0], v[2], 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['You need ' + t(nT(rnd(w.ans, 6)) + u('L')) + ' of broth.'])), hints: ['Broth over servings on both sides.'], text: 'EP5' });
        } }] },
      { num: '6', shared: function (r) {
        var v = find(function () { return [r.pick([24, 18, 32, 20, 25]), rnd(r.int(120, 260) / 10, 6), rnd(r.int(35, 60) / 10, 6)]; }, function (v) { var real = v[0] * v[1], mod = v[2] * 100 / v[0]; return isInt(real) && isInt(mod * 10); }, [24, 18.5, 5.4]);
        return { s: v[0], m: v[1], T: v[2], thing: r.pick(['car', 'van', 'SUV']) };
      }, stem: function (s) { return 'A model ' + s.thing + ' is built to a scale of ' + t('1:' + s.s) + ' (' + t('1' + u('cm')) + ' on the model is ' + t(s.s + u('cm')) + ' on the real ' + s.thing + ').'; }, parts: [
        { id: 'e6a', level: 'PRG', make: function (r, s) { var cm = s.s * s.m, m = cm / 100; return numPart('The model is ' + t(nT(s.m) + u('cm')) + ' long. How long is the real ' + s.thing + ', in <b>metres</b>?', m, { after: 'm', unit: 'm', wrongs: [{ v: cm, code: 'u1l4-wrong-unit', hint: 'That is in centimetres. Change to metres: divide by ' + t('100') + '.' }, { v: s.m / s.s, code: 'u1l4-flip', hint: 'The real ' + s.thing + ' is much bigger than the model: multiply.' }, { v: cm / 1000, code: 'u1l4-wrong-unit', hint: 'Check the conversion: ' + t('1' + u('m') + '=100' + u('cm')) + '.' }],
          sol: br([t('\\dfrac{1}{' + s.s + '}=\\dfrac{' + nT(s.m) + '}{x}') + ', so ' + t('x=' + s.s + '\\times ' + nT(s.m) + '=' + nT(cm) + u('cm')), t(nT(cm) + u('cm') + '=' + nT(m) + u('m'))]), hints: ['Model over real on both sides.', 'Then change cm to m.'], text: 'EP6a' }); } },
        { id: 'e6b', level: 'PRG', make: function (r, s) { var cm = s.T * 100, x = cm / s.s; return numPart('A real pickup truck is ' + t(nT(s.T) + u('m')) + ' long. How long is its model, in centimetres?', rnd(x, 6), { after: 'cm', unit: 'cm', wrongs: [{ v: s.T / s.s, code: 'u1l4-no-convert', hint: 'Change the real length to centimetres first: ' + t(nT(s.T) + u('m') + '=' + nT(cm) + u('cm')) + '.' }, { v: cm * s.s, code: 'u1l4-flip', hint: 'The model is much smaller: divide by ' + t(s.s) + '.' }],
          sol: br([t(nT(s.T) + u('m') + '=' + nT(cm) + u('cm')), t('\\dfrac{1}{' + s.s + '}=\\dfrac{x}{' + nT(cm) + '}') + ', so ' + t(s.s + 'x=' + nT(cm)) + ' and ' + t('x=' + nT(rnd(x, 6)) + u('cm'))]), hints: ['Change metres to centimetres first.'], text: 'EP6b' }); } }] },
      { num: '7', stem: '', parts: [
        { id: 'e7', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([5, 10, 15, 4, 6]), r.pick([2, 4, 3, 5]), r.pick([7, 9, 5, 6, 10, 11, 12])]; }, function (v) { var x = v[0] * v[2] / v[1]; return isInt(x * 10) && !isInt(v[2] / v[1]) && !isInt(x); }, [5, 2, 7]);
          var w = wordProp('fertilizer (mL)', 'water (L)', v[0], v[1], v[2], 'top');
          return numPart('A plant fertilizer label says to mix ' + t(v[0] + u('mL')) + ' of fertilizer with every ' + t(v[1] + u('L')) + ' of water. How much fertilizer goes in a ' + t(v[2] + u('L')) + ' watering can?', rnd(w.ans, 6), { after: 'mL', unit: 'mL', wrongs: flipW(v[0], v[1], v[2], 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['Use ' + t(nT(rnd(w.ans, 6)) + u('mL')) + ' of fertilizer.'])), hints: ['Fertilizer over water on both sides.'], text: 'EP7' });
        } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([2, 3, 4, 5, 2.5]), r.pick([10, 15, 20, 12]), r.int(13, 45)]; }, function (v) { var x = v[0] * v[2] / v[1]; return isInt(x * 10) && !isInt(v[2] / v[1]) && !(v[0] === 1.5 && v[1] === 10); }, [3, 15, 21]);
          var w = wordProp('mL', 'kg', v[0], v[1], v[2], 'top');
          return numPart('A nurse gives ' + t(nT(v[0]) + u('mL')) + ' of a medicine for every ' + t(v[1] + u('kg')) + ' of body mass. How much does a ' + t(v[2] + u('kg')) + ' child get? <i>(Practice numbers only.)</i>', rnd(w.ans, 6), { after: 'mL', unit: 'mL', wrongs: flipW(v[0], v[1], v[2], 'top').concat(propWrongs(w.M)), sol: br(w.lines.concat(['The child gets ' + t(nT(rnd(w.ans, 6)) + u('mL')) + '.'])), hints: ['mL over kg on both sides.'], text: 'EP8' });
        } }] },
      { num: '9', shared: function (r) {
        var v = find(function () { return [r.pick([2.5, 1.5, 3, 2, 4]), r.int(9, 40), r.pick([6.49, 5.99, 7.49, 8.99, 4.99])]; }, function (v) { var n = v[1] / v[0]; return !isInt(n) && n - Math.floor(n) < 0.6; }, [2.5, 18, 6.49]);
        return { c: v[0], A: v[1], p: v[2], what: r.pick(['bark mulch', 'garden soil', 'pea gravel']) };
      }, stem: function (s) { return 'One bag of ' + s.what + ' covers ' + t(nT(s.c) + u('m') + '^{2}') + ' of garden.'; }, parts: [
        { id: 'e9a', level: 'PRG', make: function (r, s) { var ex = s.A / s.c, n = Math.ceil(ex);
          var p = { prompt: 'How many bags are needed for a garden of ' + t(s.A + u('m') + '^{2}') + '?', input: { type: 'number', after: 'bags' }, check: buyChk(n, ex, [{ v: s.A * s.c, code: 'u1l4-flip', hint: 'Divide the area by what one bag covers.' }]), key: String(n), answer: t(n) + ' bags', text: 'EP9a',
            solution: br([t('\\dfrac{1}{' + nT(s.c) + '}=\\dfrac{x}{' + s.A + '}') + ', so ' + t(nT(s.c) + 'x=' + s.A) + ' and ' + t('x\\approx ' + rnd(ex, 2).toFixed(2)), 'Round up: ' + t(n) + ' bags.']), hints: ['Bags over area on both sides.', 'You can’t buy part of a bag.'] };
          p.bad = [String(Math.floor(ex))]; return p; } },
        { id: 'e9b', level: 'EMG', make: function (r, s) { var n = Math.ceil(s.A / s.c), cost = n * s.p; return moneyPart('The bags cost ' + t(mT(s.p)) + ' each. What is the cost before tax?', cost, { wrongs: [{ v: Math.floor(s.A / s.c) * s.p, code: 'u1l4-round-down', hint: 'Use the number of bags you must <b>buy</b> (rounded up): ' + t(n) + '.' }, { v: s.A / s.c * s.p, code: 'u1l4-unrounded', hint: 'You can only buy whole bags: ' + t(n) + ' bags.' }], sol: t(n + '\\times ' + mT(s.p) + '=' + mT(cost)), hints: ['Use the number of bags from part (a).'], text: 'EP9b' }); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var v = find(function () { var wh = r.pick([[15, 10], [12, 8], [9, 6], [10, 8], [16, 10], [20, 15]]); return [wh[0], wh[1], r.int(18, 60)]; }, function (v) { var H = v[2] * v[1] / v[0], o = [H, v[2] * v[0] / v[1], v[1] + v[2] - v[0], v[2] / v[0]].map(function (y) { return rnd(y, 1); }); return isInt(H) && !isInt(v[2] / v[0]) && o.every(function (y, i) { return y > 0 && o.indexOf(y) === i; }); }, [15, 10, 36]);
          var w = v[0], h = v[1], W = v[2], H = W * h / w;
          var opts = [{ html: t(nT(rnd(W * w / h, 1)) + u('cm')), why: 'That flips one ratio. Width over height on <b>both</b> sides: ' + t('\\dfrac{' + w + '}{' + h + '}=\\dfrac{' + W + '}{x}') + '.' }, { html: t(nT(H) + u('cm')), right: true }, { html: t(nT(h + W - w) + u('cm')), why: 'That adds ' + t(W - w + u('cm')) + ' to the height. Enlarging multiplies both sides by the same number.' }, { html: t(nT(rnd(W / w, 1)) + u('cm')), why: 'That is ' + t(W + '\\div ' + w) + ', the scale factor, not the height.' }];
          return P.mc(r, 'A photo ' + t(w + u('cm')) + ' wide and ' + t(h + u('cm')) + ' tall is enlarged to ' + t(W + u('cm')) + ' wide without stretching. How tall is the enlargement?', opts, t('\\dfrac{' + w + '}{' + h + '}=\\dfrac{' + W + '}{x}') + ', so ' + t(w + 'x=' + h * W) + ' and ' + t('x=' + nT(H) + u('cm')) + '.', ['Width over height on both sides.'], 'EP10 MC');
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.pick([32, 40, 25, 50, 24]), r.pick([3, 4, 5, 2.5, 7])]; }, function (v) { var x = v[1] * 1000 / v[0]; return !isInt(x) && !isInt(x * 2) && x < 10000 && !(v[0] === 50); }, [32, 5]);
          var R = v[0], G = v[1], mL = G * 1000, x = mL / R, ans = Math.round(x);
          var p = numPart('A dirt bike needs gas and oil mixed in the ratio ' + t(R + ':1') + '. The number of millilitres of oil needed for ' + t(nT(G) + u('L')) + ' of gas, to the nearest millilitre, is ________.', ans, { nr: true, wrongs: [{ v: Math.round(G * R), code: 'u1l4-flip', hint: 'There is much <b>less</b> oil than gas: divide.' }, { v: rnd(G / R, 4), code: 'u1l4-no-convert', hint: 'Change the gas to millilitres first: ' + t(nT(G) + u('L') + '=' + HW.fmt(mL) + u('mL')) + '.' }],
            sol: br([t(nT(G) + u('L') + '=' + HW.fmt(mL) + u('mL')), t('\\dfrac{' + R + '}{1}=\\dfrac{' + HW.fmt(mL) + '}{x}') + ', so ' + t(R + 'x=' + HW.fmt(mL)) + ' and ' + t('x=' + nT(rnd(x, 4)) + '\\approx ' + ans + u('mL'))]), hints: ['Change litres to millilitres first.'], text: 'EP11 NR' });
          p.check = K.approx(x, 0, { nr: true, diag: function (vv) { return X.matchW(vv, cleanW([{ v: Math.round(G * R), code: 'u1l4-flip', hint: 'There is much <b>less</b> oil than gas: divide.' }], ans), 0.5); } });
          return p;
        } }] },
      /* ---------- C. Stretch ---------- */
      { num: '12', section: 'Extra practice C — Stretch', stem: '', parts: [
        { id: 'e12', level: 'PRG', make: function (r) {
          var nm = r.pick([['Arjun', 'Bea'], ['Kofi', 'Hana'], ['Omar', 'Zoe']]);
          var v = find(function () { var a = cop(r, 1, 9, function (v) { return v[0] < v[1]; }), b = cop(r, 1, 12, function (v) { return v[0] < v[1]; }); return a.concat(b); }, function (v) { var x = v[0] / v[1], y = v[2] / v[3]; return Math.abs(x - y) > 0.005 && Math.abs(x - y) < 0.06 && rnd(x, 3) !== rnd(y, 3); }, [2, 7, 3, 10]);
          var x = v[0] / v[1], y = v[2] / v[3], st = x > y ? 0 : 1, wk = 1 - st, more = v[0] > v[2] ? 0 : v[2] > v[0] ? 1 : wk;
          var dx = rnd(x, 3), dy = rnd(y, 3);
          var opts = [{ html: nm[st] + '’s is stronger: ' + t(nT([dx, dy][st])) + ' cans of concentrate for each can of water, compared with ' + t(nT([dx, dy][wk])) + '.', right: true },
            { html: nm[wk] + '’s is stronger: ' + t(nT([dx, dy][wk])) + ' cans of concentrate for each can of water, compared with ' + t(nT([dx, dy][st])) + '.', why: 'Compare the decimals carefully: ' + t(nT([dx, dy][st])) + ' is bigger than ' + t(nT([dx, dy][wk])) + '.' },
            { html: (more === wk ? nm[wk] + '’s is stronger, because ' + pron(nm[wk]) + ' uses more cans of concentrate.' : nm[st === more ? wk : st] + '’s is stronger, because ' + pron(nm[st === more ? wk : st]) + ' uses less water.'), why: 'The totals don’t decide it. Compare concentrate for <b>each can</b> of water (concentrate ÷ water).' },
            { html: 'They are the same strength: each uses ' + t(Math.abs(v[1] - v[0]) === Math.abs(v[3] - v[2]) ? Math.abs(v[1] - v[0]) : '7') + ' more cans of water than concentrate.', why: 'Differences don’t compare ratios. Divide concentrate ÷ water for each.' }];
          if (Math.abs(v[1] - v[0]) !== Math.abs(v[3] - v[2])) opts[3] = { html: 'They are the same strength: both mixes are mostly water.', why: 'Divide concentrate ÷ water for each and compare.' };
          return P.mc(r, nm[0] + ' mixes juice with ' + t(v[0]) + ' cans of concentrate for every ' + t(v[1]) + ' cans of water. ' + nm[1] + ' mixes ' + t(v[2]) + ' cans of concentrate for every ' + t(v[3]) + ' cans of water. Whose juice is stronger?', opts,
            br(['Concentrate : water as decimals: ' + nm[0] + ' ' + t(v[0] + '\\div ' + v[1] + (isInt(x * 1000) ? '=' : '\\approx ') + nT(dx)) + ', ' + nm[1] + ' ' + t(v[2] + '\\div ' + v[3] + (isInt(y * 1000) ? '=' : '\\approx ') + nT(dy)), nm[st] + ' uses more concentrate for each can of water, so ' + nm[st] + '’s juice is <b>stronger</b>.', '(Or scale both to ' + t(v[1] * v[3] / gcd(v[1], v[3])) + ' cans of water and compare the concentrate.)']),
            ['Divide concentrate by water for each person.'], 'EP12');
        } }] },
      { num: '13', stem: '', parts: [
        { id: 'e13', level: 'MAS', make: function (r) {
          var v = find(function () { return [r.pick([15, 20, 25, 10, 12]), rnd(r.int(30, 120) / 10, 6), r.pick([40, 50, 30, 60, 8, 5])]; }, function (v) { var km = v[0] * v[1], c2 = km / v[2]; return v[0] !== v[2] && isInt(km * 10) && isInt(c2 * 100); }, [15, 8.4, 40]);
          var s1 = v[0], c1 = v[1], s2 = v[2], km = rnd(s1 * c1, 6), c2 = rnd(km / s2, 6);
          return numPart('On a map with scale ' + t('1' + u('cm') + ':' + s1 + u('km')) + ', a bike route measures ' + t(nT(c1) + u('cm')) + '. How long would the same route measure on a different map with scale ' + t('1' + u('cm') + ':' + s2 + u('km')) + '?', c2, { after: 'cm', unit: 'cm',
            wrongs: [{ v: km, code: 'u1l4-real', hint: t(nT(km) + u('km')) + ' is the <b>real</b> length of the route. Now use the second map’s scale to find its length on that map.' }, { v: c1 * s2 / s1, code: 'u1l4-flip', hint: 'Check the direction: on a map where ' + t('1' + u('cm')) + ' stands for ' + (s2 > s1 ? '<b>more</b>' : '<b>less</b>') + ' km, the route is ' + (s2 > s1 ? 'shorter' : 'longer') + '.' }, { v: km * s2, code: 'u1l4-flip', hint: 'The map length is much smaller than the real length: divide by ' + t(s2) + '.' }],
            sol: br(['Real length: ' + t('\\dfrac{1}{' + s1 + '}=\\dfrac{' + nT(c1) + '}{x}') + ', so ' + t('x=' + s1 + '\\times ' + nT(c1) + '=' + nT(km) + u('km')), 'Second map: ' + t('\\dfrac{1}{' + s2 + '}=\\dfrac{x}{' + nT(km) + '}') + ', so ' + t(s2 + 'x=' + nT(km)) + ' and ' + t('x=' + nT(c2) + u('cm'))]), hints: ['First find the real length of the route.', 'Then use the second map’s scale.'], text: 'EP13' });
        } }] },
      { num: '14', stem: '', parts: [
        { id: 'e14', level: 'MAS', make: function (r) {
          var v = find(function () { return [r.pick([2, 1.5, 2.5, 3]), r.pick([1.5, 1, 2, 1.25]), r.pick([2, 3, 4]), r.pick([12, 10, 16, 8]), r.int(3, 11)]; }, function (v) { var k = v[4] / v[2]; return !isInt(k) && isInt(v[3] * k) && isInt(v[0] * k * 100) && isInt(v[1] * k * 100) && v[4] > v[2]; }, [2, 1.5, 2, 12, 5]);
          var F = v[0], Mk = v[1], E = v[2], N = v[3], e = v[4], k = e / E, n = N * k, f = rnd(F * k, 6), m = rnd(Mk * k, 6), nm = r.pick(['Jayden', 'Maya', 'Raj', 'Ellie']), food = r.pick([['pancake', 'pancakes'], ['muffin', 'muffins'], ['waffle', 'waffles']]);
          var chk = [numChk(n, [{ v: N * e, code: 'u1l4-flip', hint: 'Eggs over ' + food[1] + ' on both sides: ' + t('\\dfrac{' + E + '}{' + N + '}=\\dfrac{' + e + '}{x}') + '.' }, { v: N + e - E, code: 'u1l4-added', hint: 'Only multiply or divide.' }, { v: k, code: 'u1l4-batch', hint: 'That is the number of batches. Multiply by ' + t(N) + ' ' + food[1] + ' per batch.' }]),
            numChk(f, [{ v: F * e, code: 'u1l4-flip', hint: 'Scale the flour by the number of batches, ' + t(e + '\\div ' + E + '=' + nT(k)) + '.' }, { v: F * n, code: 'u1l4-flip', hint: 'Flour goes with batches, not with each ' + food[0] + ': ' + t(nT(F) + '\\times ' + nT(k)) + '.' }]),
            numChk(m, [{ v: Mk * e, code: 'u1l4-flip', hint: 'Scale the milk by the number of batches, ' + t(nT(k)) + '.' }, { v: Mk * n, code: 'u1l4-flip', hint: 'Milk goes with batches: ' + t(nT(Mk) + '\\times ' + nT(k)) + '.' }])];
          return fieldsPart('A ' + food[0] + ' recipe uses ' + t(nT(F)) + ' cups of flour, ' + t(nT(Mk)) + ' cups of milk and ' + t(E) + ' eggs to make ' + t(N) + ' ' + food[1] + '. ' + nm + ' has only ' + t(e) + ' eggs (and lots of flour and milk). What is the most ' + food[1] + ' ' + pron(nm) + ' can make, and how much flour and milk will ' + pron(nm) + ' need?',
            [{ label: food[1], name: food[1] }, { label: 'flour', name: 'flour', after: 'cups' }, { label: 'milk', name: 'milk', after: 'cups' }], chk, [nf(n), nf(f), nf(m)], t(nT(n)) + ' ' + food[1] + ', ' + t(nT(f)) + ' cups of flour, ' + t(nT(m)) + ' cups of milk',
            { sol: br(['Eggs : ' + food[1] + ': ' + t('\\dfrac{' + E + '}{' + N + '}=\\dfrac{' + e + '}{x}') + ', so ' + t(E + 'x=' + N * e) + ' and ' + t('x=' + nT(n)) + ' ' + food[1] + '.', t(nT(n)) + ' ' + food[1] + ' is ' + t(nT(n) + '\\div ' + N + '=' + nT(k)) + ' batches.', 'Flour: ' + t(nT(F) + '\\times ' + nT(k) + '=' + nT(f)) + ' cups. Milk: ' + t(nT(Mk) + '\\times ' + nT(k) + '=' + nT(m)) + ' cups.']),
              hints: ['The eggs decide how many ' + food[1] + ' you can make.', 'Then find how many batches that is, and scale the flour and milk.'], text: 'EP14' });
        } }] }
    ]
  });
})(window);
