/* Math 10-3 · Unit 3 (Length, Area and Surface Area) — exit slips for Lessons 1–11 (u3l1x … u3l11x), written in test mode.
 * Calculator allowed (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core skill —
 * Beginning, Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student.
 * Lesson 1 is a refresher (outcome REV: its slip is written like the others but never counts toward a level). Outcomes
 * per part as on the unit test: M1 SI only; M2 imperial units, feet and inches, SI ↔ imperial; M3 linear measurement
 * problems (ruler and tape readings, perimeter, circumference, cutting and fitting); A1 rearranging formulas; M4 area and
 * surface area.
 *   3.1 (REV) improper fraction ↔ mixed number · add mixed numbers (regroup) · subtract (borrow) · a board or fabric
 *       problem (multiply or add, then subtract)
 *   3.2 (M1) one SI conversion · which of two lengths is longer, by how many cm · cups from a jug and jugs for a party ·
 *       four long jumps in m, cm, mm and km: who won, by how much over the shortest
 *   3.3 (M2, M3) one imperial conversion · read one arrow on a ruler (SVG) · read a tape past 12 in, in feet and inches ·
 *       an object that does not start at 0
 *   3.4 (M1, M2, M3) a staircase conversion (with hm, dam, dm) · inches ↔ feet and inches ↔ decimal feet · add or subtract
 *       feet and inches · pieces cut from boards: boards to buy and the cost
 *   3.5 (M2) one imperial → SI conversion · a height in cm · a price per yard (or foot) as a price per metre · a metric
 *       length found on an inch tape, to the nearest 1/16 in
 *   3.6 (M3) a perimeter (rectangle, or a triangle with mixed units) · a circumference from the radius · how far a wheel
 *       rolls in N turns, in metres · edging pieces for a round bed and the cost
 *   3.7 (A1) one-step rearranging · a radius from a circumference · a width from P = 2l + 2w · a rectangle twice as long as
 *       it is wide (or a set amount longer): its width and length from the perimeter
 *   3.8 (M4) a rectangle, parallelogram or triangle · a circle or trapezoid · an area-unit change · carpet for a floor in
 *       feet and inches: ft², yd² and the cost
 *   3.9 (M4) an irregular shape on a grid · an L-shaped floor · a yard minus a pond and deck · a stage with a half circle:
 *       its area and the cans of paint
 *   3.10 (M4) the surface area of a cube · a closed box in in² and ft² · a triangular prism · an open toy bin and the cost
 *       to stain it
 *   3.11 (M4) a can's label (2πrh) · a closed cylinder · a square pyramid or cone · a giant crayon (cylinder + cone,
 *       bottom painted) or a pail with no lid
 * Multiple choice is not used. Shared helpers, drawings and the u3t- codes come from the Unit 3 test (HW.u3assess,
 * js/lessons/u3test.js, which loads first); several slips use the test's own generators with new numbers. Codes only the
 * slips use are u3x-, with labels and partial-credit decisions below. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u3assess;
  if (!A) throw new Error('js/exits/u3.js needs HW.u3assess from js/lessons/u3test.js: load it first');
  var rd = A.rd, q = A.q, near = A.near, nS = A.nS, N = A.N, Np = A.Np, eqR = A.eqR, Mt = A.Mt, MM = A.MM, eqM = A.eqM, uT = A.uT, L = A.L, find = A.find, br = A.br, cap = A.cap, pickR = A.pickR, person = A.person, people = A.people;
  var gcd = A.gcd, R = A.R, fv = A.fv, frOf = A.frOf, mixT = A.mixT, frT = A.frT, mixP = A.mixP, readMix = A.readMix, numChk = A.numChk, numPart = A.numPart, keyOf = A.keyOf, mixPart = A.mixPart, fieldsPart = A.fieldsPart, nfld = A.nfld, ftinPart = A.ftinPart, ftinT = A.ftinT, hT = A.hT, tapeSvg = A.tapeSvg, fig2 = A.fig2, solid = A.solid;
  var PI = Math.PI;

  HW.addCodes({
    'u3x-rem-swap': 'Mixed number: swapped the quotient and the remainder', 'u3x-mix-wrong': 'Mixed → improper: whole × top + bottom', 'u3x-mix-add': 'Mixed → improper: added the whole number to the top', 'u3x-mix-noadd': 'Mixed → improper: forgot to add the top',
    'u3x-add-den': 'Added the denominators', 'u3x-flip-sub': 'Subtracted the fractions the wrong way round (no borrowing)', 'u3x-borrow-lost': 'Borrowed a whole but lost the first fraction', 'u3x-borrow-whole': 'Regrouped the fraction but did not take 1 from the whole',
    'u3x-ab-which': 'Right amount, wrong (or unclear) choice', 'u3x-mm-cm': 'Read millimetres as centimetres', 'u3x-second': 'Compared with the wrong jump',
    'u3x-tape-digits': 'Tape: split the inch number into feet and inches by its digits', 'u3x-no-sub-ft': 'Tape: did not take 12 in off for each foot', 'u3x-no-start': 'Gave the end reading (did not take away the start)', 'u3x-start-whole': 'Took away only the whole inches of the start',
    'u3x-borrow-10': 'Borrowed 10 in instead of 12', 'u3x-cm-m': 'Used centimetres instead of metres', 'u3x-16-down': 'Rounded down instead of to the nearest sixteenth', 'u3x-tenths-16': 'Used tenths as sixteenths',
    'u3x-two-sides': 'Added only two sides', 'u3x-square': 'Treated the rectangle as a square', 'u3x-p3': 'Divided the perimeter by 3', 'u3x-area-dir': 'Area units: multiplied instead of dividing (or the reverse)', 'u3x-no-area-conv': 'Did not change ft² to yd²',
    'u3x-one-face': 'Found one face only', 'u3x-five-faces': 'Counted 5 faces instead of 6', 'u3x-four-faces': 'Counted 4 faces instead of 6', 'u3x-no-2': 'Left out the 2 in 2πrh', 'u3x-regroup-lost': 'Traded 12 in for a foot but did not add the foot'
  });
  HW.addPartial({
    'u3x-rem-swap': 'n', 'u3x-mix-wrong': 'n', 'u3x-mix-add': 'n', 'u3x-mix-noadd': 'n', 'u3x-add-den': 'n', 'u3x-flip-sub': 'n', 'u3x-borrow-lost': 'b', 'u3x-borrow-whole': 's',
    'u3x-ab-which': 'b', 'u3x-mm-cm': 'b', 'u3x-second': 'b', 'u3x-tape-digits': 'b', 'u3x-no-sub-ft': 'b', 'u3x-no-start': 'b', 'u3x-start-whole': 'b', 'u3x-borrow-10': 'b', 'u3x-cm-m': 'b', 'u3x-16-down': 's', 'u3x-tenths-16': 'b',
    'u3x-two-sides': 'b', 'u3x-square': 'b', 'u3x-p3': 'b', 'u3x-area-dir': 'n', 'u3x-no-area-conv': 'b', 'u3x-one-face': 'b', 'u3x-five-faces': 's', 'u3x-four-faces': 'b', 'u3x-no-2': 'b', 'u3x-regroup-lost': 'b'
  });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  /* a word (or letter) box + a number box: o.choices [{key, tokens}], o.right (key), label, ph, amt (numChk), key, show, after, why */
  function pick1(s, choices) {
    var ws = String(s == null ? '' : s).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[.,!:;()’']/g, ' ').split(/\s+/).filter(Boolean);
    if (!ws.length) return 'empty';
    var hits = choices.filter(function (c) { return c.tokens.some(function (tk) { return ws.some(function (w) { return w === tk || (tk.length >= 3 && w.length >= 3 && (w.indexOf(tk.slice(0, Math.max(3, Math.min(tk.length, w.length)))) === 0)); }); }); });
    return hits.length === 1 ? hits[0].key : hits.length ? 'both' : 'none';
  }
  function choiceAmtPart(prompt, o) {
    var check = function (resp) {
      resp = resp || []; var w = pick1(resp[0], o.choices), a = o.amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.label + '</b> Type your choice.');
      if (w === 'none' || w === 'both') return form('word', '<b>' + o.label + '</b> Type just one choice: ' + o.ph + '.');
      if (a.v === 'form') return form(a.code, '<b>By how much:</b> ' + (a.hint || 'Check the format.'));
      if (w === o.right && a.v === 'correct') return ok();
      if (w !== o.right && a.v === 'correct') return wrong('u3x-ab-which', o.why);
      return wrong(a.code || 'value', '<b>By how much:</b> ' + (a.hint || 'Change both to the same unit, then subtract.'));
    };
    var key = [o.rightText, o.key], wrongKey = o.choices.filter(function (c) { return c.key !== o.right; })[0].tokens[0];
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label, name: 'Choice', mode: 'text', placeholder: o.ph, wide: true }, { label: 'By how much:', name: 'By how much', after: o.after }] },
      check: check, key: key, answer: o.label + ' <b>' + o.rightText + '</b><br>By how much: ' + o.show, solution: o.sol, hints: o.hints || [], text: o.text,
      bad: [[wrongKey, o.key]].concat((o.amt.bad || []).map(function (m) { return [o.rightText, keyOf(m.v, { dp: o.dp })]; }).filter(function (b) { return b[1] !== o.key; })) };
  }

  /* =====================================================================================================
   * 3.1 Fractions refresher: mixed numbers (REV)
   * ===================================================================================================== */
  var DENS = [2, 3, 4, 5, 6, 8, 10, 12, 16];
  function l1q1(r) {
    if (r.chance(0.5)) {
      var s = find(function () { var d = r.pick([2, 3, 4, 5, 6, 8, 12, 16]), p = r.int(d + 1, 6 * d); return [p, d]; }, function (v) { return v[0] % v[1] !== 0 && !(v[0] === 17 && v[1] === 5) && !(v[0] === 23 && v[1] === 4); });
      var p = s[0], d = s[1], fr = R(p, d), w = Math.floor(p / d), rem = p - w * d;
      return mixPart('Write ' + t('\\dfrac{' + p + '}{' + d + '}') + ' as a mixed number in simplest form.', fr, { diag: [{ v: rem + w / d, code: 'u3x-rem-swap', hint: 'The whole number is how many times ' + d + ' goes into ' + p + ' (' + w + '); the remainder goes over ' + d + '.' }],
        sol: br([t(p + '\\div ' + d + '=' + w) + ' R ' + rem + ', so ' + t('\\frac{' + p + '}{' + d + '}=' + w + '\\frac{' + rem + '}{' + d + '}' + (gcd(rem, d) > 1 ? '=' + mixT(fr) : ''))]), hints: ['Divide the top by the bottom: the answer is the whole number.', 'The remainder goes over the same bottom. Then simplify.'], text: 'improper to mixed' });
    }
    var s2 = find(function () { var d = r.pick([2, 3, 4, 5, 6, 8, 10, 16]), n = r.int(1, d - 1), w = r.int(2, 12); return [w, n, d]; }, function (v) { return gcd(v[1], v[2]) === 1 && !(v[0] === 4 && v[1] === 2 && v[2] === 3); });
    var w2 = s2[0], n2 = s2[1], d2 = s2[2], top = w2 * d2 + n2;
    return mixPart('Write ' + t(w2 + '\\dfrac{' + n2 + '}{' + d2 + '}') + ' as an improper fraction.', [top, d2], { want: 'improper',
      diag: [{ v: (w2 * n2 + d2) / d2, code: 'u3x-mix-wrong', hint: 'Multiply the whole number by the <b>bottom</b>, then add the top: ' + t(w2 + '\\times ' + d2 + '+' + n2) + '.' }, { v: (w2 + n2) / d2, code: 'u3x-mix-add', hint: 'Each whole is ' + d2 + ' pieces: ' + t(w2 + '\\times ' + d2) + ', then add ' + n2 + '.' }, { v: w2, code: 'u3x-mix-noadd', hint: 'Add the top, ' + n2 + ', too.' }, { v: w2 * n2 / d2, code: 'u3x-mix-wrong', hint: 'Multiply the whole number by the bottom, then add the top.' }],
      sol: t(w2 + '\\frac{' + n2 + '}{' + d2 + '}=\\frac{' + w2 + '\\times ' + d2 + '+' + n2 + '}{' + d2 + '}=\\frac{' + top + '}{' + d2 + '}'), hints: ['Multiply the whole number by the bottom, then add the top.', 'Keep the same bottom.'], text: 'mixed to improper' });
  }
  var PAIRS = [[4, 8], [2, 8], [3, 6], [2, 3], [4, 6], [5, 10], [2, 5], [8, 16], [4, 16], [3, 4], [2, 4]];
  function lcd(a, b) { return a / gcd(a, b) * b; }
  function fracLine(w, n, d, D) { return w + '\\frac{' + n * (D / d) + '}{' + D + '}'; }
  function l1q2(r) {
    var s = find(function () { var pr = r.pick(PAIRS), sw = r.chance(0.5), d1 = sw ? pr[1] : pr[0], d2 = sw ? pr[0] : pr[1], n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1); return [r.int(1, 9), n1, d1, r.int(1, 9), n2, d2]; },
      function (v) { return gcd(v[1], v[2]) === 1 && gcd(v[4], v[5]) === 1 && v[1] / v[2] + v[4] / v[5] > 1 && !(v[0] === 4 && v[1] === 3 && v[3] === 1 && v[4] === 5); });
    var w1 = s[0], n1 = s[1], d1 = s[2], w2 = s[3], n2 = s[4], d2 = s[5], D = lcd(d1, d2), tot = R((w1 + w2) * D + n1 * D / d1 + n2 * D / d2, D), fsum = n1 * D / d1 + n2 * D / d2;
    return mixPart('Add. Write the answer as a mixed number in simplest form: ' + t(w1 + '\\frac{' + n1 + '}{' + d1 + '}+' + w2 + '\\frac{' + n2 + '}{' + d2 + '}'), tot, {
      diag: [{ v: w1 + w2 + (n1 + n2) / (d1 + d2), code: 'u3x-add-den', hint: 'Never add the bottoms. Give the fractions a common denominator (' + D + ') first.' }, { v: w1 + w2 + (n1 + n2) / D, code: 'u3x-add-den', hint: 'Change <b>both</b> tops when you change to ' + D + 'ths.' }],
      sol: br(['Common denominator ' + D + ': ' + t(fracLine(w1, n1, d1, D) + '+' + fracLine(w2, n2, d2, D) + '=' + (w1 + w2) + '\\frac{' + fsum + '}{' + D + '}'), 'Regroup: ' + t('\\frac{' + fsum + '}{' + D + '}=1\\frac{' + (fsum - D) + '}{' + D + '}') + ', so ' + t((w1 + w2 + 1) + '\\frac{' + (fsum - D) + '}{' + D + '}' + (gcd(fsum - D, D) > 1 && fsum - D ? '=' + mixT(tot) : ''))]),
      hints: ['Give the fraction parts a common denominator.', 'Add the wholes and the fractions; if the fraction is more than 1, regroup.'], text: 'add mixed numbers' });
  }
  function l1q3(r) {
    if (r.chance(0.3)) {
      var W = r.int(4, 12), d = r.pick([4, 8, 16, 3, 5]), w2 = r.int(1, W - 2), n2 = find(function () { return r.int(1, d - 1); }, function (n) { return gcd(n, d) === 1; }), ans = R((W - w2) * d - n2, d);
      return mixPart('Subtract. Write the answer in simplest form: ' + t(W + '-' + w2 + '\\frac{' + n2 + '}{' + d + '}'), ans, { diag: [{ v: W - w2 + n2 / d, code: 'u3x-flip-sub', hint: 'You are taking away the ' + t('\\frac{' + n2 + '}{' + d + '}') + ' too. Regroup: ' + t(W + '=' + (W - 1) + '\\frac{' + d + '}{' + d + '}') + '.' }, { v: W - w2 + 1 - n2 / d, code: 'u3x-borrow-whole', hint: 'When you change 1 whole into ' + t('\\frac{' + d + '}{' + d + '}') + ', take 1 from the ' + W + '.' }],
        sol: br(['Regroup: ' + t(W + '=' + (W - 1) + '\\frac{' + d + '}{' + d + '}'), t((W - 1) + '\\frac{' + d + '}{' + d + '}-' + w2 + '\\frac{' + n2 + '}{' + d + '}=' + mixT(ans))]), hints: ['Change 1 of the wholes into a fraction: ' + W + ' = ' + (W - 1) + ' ' + d + '/' + d + '.', 'Subtract the wholes and the fractions.'], text: 'whole minus mixed' });
    }
    var s = find(function () { var pr = r.pick(PAIRS), sw = r.chance(0.5), d1 = sw ? pr[1] : pr[0], d2 = sw ? pr[0] : pr[1], n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1), w1 = r.int(4, 11), w2 = r.int(1, w1 - 2); return [w1, n1, d1, w2, n2, d2]; },
      function (v) { return gcd(v[1], v[2]) === 1 && gcd(v[4], v[5]) === 1 && v[1] / v[2] < v[4] / v[5] && !(v[0] === 5 && v[1] === 1 && v[2] === 4); });
    var w1 = s[0], n1 = s[1], d1 = s[2], w2 = s[3], n2 = s[4], d2 = s[5], D = lcd(d1, d2), a1 = n1 * D / d1, a2 = n2 * D / d2, ans2 = R((w1 - w2) * D + a1 - a2, D);
    return mixPart('Subtract. Write the answer in simplest form: ' + t(w1 + '\\frac{' + n1 + '}{' + d1 + '}-' + w2 + '\\frac{' + n2 + '}{' + d2 + '}'), ans2, {
      diag: [{ v: w1 - w2 + (a2 - a1) / D, code: 'u3x-flip-sub', hint: 'Don’t flip the fractions to make it easy. ' + t('\\frac{' + a1 + '}{' + D + '}') + ' is less than ' + t('\\frac{' + a2 + '}{' + D + '}') + ': regroup 1 whole as ' + t('\\frac{' + D + '}{' + D + '}') + '.' },
        { v: w1 - 1 - w2 + (D - a2) / D, code: 'u3x-borrow-lost', hint: 'After you borrow, add the ' + t('\\frac{' + a1 + '}{' + D + '}') + ' you already had: ' + t('\\frac{' + D + '}{' + D + '}+\\frac{' + a1 + '}{' + D + '}=\\frac{' + (D + a1) + '}{' + D + '}') + '.' },
        { v: w1 - w2 + (D + a1 - a2) / D, code: 'u3x-borrow-whole', hint: 'When you borrow 1 whole, the ' + w1 + ' becomes ' + (w1 - 1) + '.' }, { v: w1 - w2 + (n1 - n2) / (d1 - d2 || 1), code: 'u3x-add-den', hint: 'Give the fractions a common denominator (' + D + ') first.' }],
      sol: br(['Common denominator ' + D + ': ' + t(fracLine(w1, n1, d1, D) + '-' + fracLine(w2, n2, d2, D)), t('\\frac{' + a1 + '}{' + D + '}') + ' is less than ' + t('\\frac{' + a2 + '}{' + D + '}') + ', so regroup: ' + t(fracLine(w1, n1, d1, D) + '=' + (w1 - 1) + '\\frac{' + (D + a1) + '}{' + D + '}'), t((w1 - 1) + '\\frac{' + (D + a1) + '}{' + D + '}-' + w2 + '\\frac{' + a2 + '}{' + D + '}=' + (w1 - 1 - w2) + '\\frac{' + (D + a1 - a2) + '}{' + D + '}' + (gcd(D + a1 - a2, D) > 1 ? '=' + mixT(ans2) : ''))]),
      hints: ['Common denominator first.', 'If the first fraction is smaller, borrow 1 whole from the whole number.'], text: 'subtract with borrowing' });
  }
  function l1q4(r) {
    var p = person(r);
    if (r.chance(0.5)) {
      var B = r.pick([72, 96, 60, 84]), s = find(function () { var a = r.int(12, 38) + r.int(1, 7) / 8, b = r.int(10, 30) + r.int(1, 3) / 4; return [q(a), q(b)]; }, function (v) { var f = (v[0] % 1) + (v[1] % 1); return f > 1 && v[0] + v[1] < B - 3 && frOf(v[0], 8)[1] === 8; });
      var a = s[0], b = s[1], used = a + b, left = B - used, fr = frOf(left, 8), fa = frOf(a, 8), fb = frOf(b, 8), fu = frOf(used, 8);
      return mixPart(p.n + ' has a ' + t(B + '\\text{ in}') + ' board. ' + cap(p.he) + ' cuts off one piece ' + t(mixT(fa) + '\\text{ in}') + ' long and another piece ' + t(mixT(fb) + '\\text{ in}') + ' long. Ignoring the saw cuts, how much of the board is left?', fr, { after: 'in',
        diag: [{ v: used, code: 'u3t-gave-used', hint: 'That’s the length of the two pieces. Subtract it from ' + B + ' in.' }, { v: left + 1, code: 'u3x-borrow-whole', hint: 'To subtract from ' + B + ', regroup: ' + t(B + '=' + (B - 1) + '\\frac{8}{8}') + ' (the ' + B + ' becomes ' + (B - 1) + ').' }],
        sol: br(['Used: ' + t(mixT(fa) + '+' + mixT(fb) + '=' + mixT(fu)) + ' in', 'Left: ' + t(B + '-' + mixT(fu) + '=' + (B - 1) + '\\frac{8}{8}-' + mixT(fu) + '=' + mixT(fr)) + ' in']), hints: ['Add the two pieces first (eighths).', 'Subtract from ' + B + ': regroup ' + B + ' as ' + (B - 1) + ' 8/8.'], text: 'board left (mixed numbers)' });
    }
    var k = r.int(3, 7), m = r.pick([[11, 8], [7, 4], [5, 4], [13, 8], [9, 8], [5, 3], [7, 3]]), need = k * fv(m), Bt = Math.ceil(need) + r.int(0, 2), fr2 = frOf(Bt - need, 24), fn = frOf(need, 24);
    if (near(Bt, need)) Bt += 1, fr2 = frOf(Bt - need, 24);
    var mw = Math.floor(fv(m)), mf = fv(m) - mw;
    return mixPart(p.n + ' is sewing ' + t(k) + ' cushion covers. Each cover needs ' + t(mixT(m) + '\\text{ yd}') + ' of fabric. ' + cap(p.he) + ' bought ' + t(Bt + '\\text{ yd}') + '. How much fabric will be left over?', fr2, { after: 'yd',
      diag: [{ v: need, code: 'u3t-gave-used', hint: 'That’s the fabric for the ' + k + ' covers. Subtract it from ' + Bt + ' yd.' }, { v: Bt - (k * mw + mf), code: 'u3t-mix-mult', hint: 'Change ' + t(mixT(m)) + ' to an improper fraction before you multiply.' }, { v: Bt - need + 1, code: 'u3x-borrow-whole', hint: 'When you regroup ' + Bt + ' as a mixed number, the whole number goes down by 1.' }],
      sol: br(['Fabric for ' + k + ' covers: ' + t('\\frac{' + k + '}{1}\\times ' + frT(m) + '=' + frT(R(k * m[0], m[1])) + '=' + mixT(fn)) + ' yd', 'Left: ' + t(Bt + '-' + mixT(fn) + '=' + mixT(fr2)) + ' yd']), hints: ['Multiply: change the mixed number to an improper fraction first.', 'Then subtract from ' + Bt + ' (regroup a whole).'], text: 'fabric left (mixed numbers)' });
  }
  HW.defineExit({ lesson: 'u3l1', outcome: 'REV', calc: true, blurb: 'Mixed numbers: improper fractions and mixed numbers, adding, subtracting with borrowing, and a board or fabric problem.',
    questions: [Q(1, 'REV', 'BEG', l1q1, 'Improper fraction ↔ mixed number'), Q(2, 'REV', 'PRG', l1q2, 'Add mixed numbers'), Q(3, 'REV', 'PRG', l1q3, 'Subtract mixed numbers'), Q(4, 'REV', 'MAS', l1q4, 'Board or fabric left over')] });

  /* =====================================================================================================
   * 3.2 The SI system (M1)
   * ===================================================================================================== */
  function l2q2(r) {
    var it = r.pick(['rope', 'ribbon', 'board', 'piece of trim', 'hose']), s = find(function () { var cmA = r.int(40, 260), cmB = cmA + r.pick([-1, 1]) * r.int(2, 30); return [cmA, cmB]; }, function (v) { return v[1] > 20 && v[0] % 10 !== 0; });
    var aIsM = r.chance(0.5), cmA = s[0], cmB = s[1], A_txt = aIsM ? L(cmA / 100, 'm') : L(cmA, 'cm'), B_txt = aIsM ? L(cmB, 'cm') : L(cmB / 100, 'm'), longer = cmA > cmB ? 'A' : 'B', d = Math.abs(cmA - cmB);
    var mVal = aIsM ? cmA / 100 : cmB / 100, cmVal = aIsM ? cmB : cmA;
    var amt = numChk(d, { diag: [{ v: Math.abs(mVal - cmVal), code: 'u3t-no-convert', hint: 'Change the metres to centimetres first (× 100).' }, { v: d / 100, code: 'u3t-unit-ans', hint: 'That’s the difference in metres. The question asks for centimetres.' }, { v: Math.abs(mVal * 10 - cmVal), code: 'u3t-si-steps', hint: 'm to cm is 2 steps down: × 100.' }] });
    return choiceAmtPart(cap(it) + ' A is ' + A_txt + ' long. ' + cap(it) + ' B is ' + B_txt + ' long. Which is longer, and by how many centimetres?', { choices: [{ key: 'A', tokens: ['a'] }, { key: 'B', tokens: ['b'] }], right: longer, rightText: longer, label: 'Longer (A or B):', ph: 'A or B', amt: amt, key: nS(d), show: L(d, 'cm'), after: 'cm',
      why: 'Change both to the same unit, then compare: the bigger number is longer.', sol: br(['In centimetres: ' + t(N(mVal) + '\\text{ m}=' + N(mVal) + '\\times 100=' + N(mVal * 100) + '\\text{ cm}') + ' and ' + L(cmVal, 'cm'), cap(it) + ' <b>' + longer + '</b> is longer by ' + t(Math.max(cmA, cmB) + '-' + Math.min(cmA, cmB) + '=' + d) + ' cm.']),
      hints: ['To compare, change both to the same unit (cm).', 'Then subtract.'], text: 'which is longer, by how much' });
  }
  function l2q4(r) {
    var ns = people(r, 4), cms = find(function () { var base = r.int(380, 470); return r.shuffle([base, base + r.int(2, 6), base + r.int(8, 13), base + r.int(15, 22)]); }, function () { return true; });
    var units = r.shuffle(['m', 'cm', 'mm', 'km']), shown = cms.map(function (c, i) { var u = units[i]; return u === 'm' ? L(c / 100, 'm') : u === 'cm' ? L(c, 'cm') : u === 'mm' ? L(c * 10, 'mm') : L(c / 100000, 'km'); });
    var mx = Math.max.apply(null, cms), mn = Math.min.apply(null, cms), win = ns[cms.indexOf(mx)].n, d = mx - mn;
    var mmI = units.indexOf('mm'), wrongMM = cms.map(function (c, i) { return i === mmI ? c * 10 : c; }), sorted = cms.slice().sort(function (a, b) { return b - a; });
    var amt = numChk(d, { diag: [{ v: d * 10, code: 'u3t-unit-ans', hint: 'That’s millimetres. Give the answer in centimetres.' }, { v: d / 100, code: 'u3t-unit-ans', hint: 'That’s metres. Give the answer in centimetres.' }, { v: mx - sorted[1], code: 'u3x-second', hint: 'Compare with the <b>shortest</b> jump, not the second-best one.' }] });
    return choiceAmtPart('Four friends did the long jump. ' + ns.map(function (p, i) { return p.n + ' jumped ' + shown[i]; }).join(', ') + '. Who won? How many centimetres farther did the winner jump than the shortest jump?', { choices: ns.map(function (p) { return { key: p.n, tokens: [p.n.toLowerCase()] }; }), right: win, rightText: win, label: 'Winner:', ph: 'a name', amt: amt, key: nS(d), show: L(d, 'cm'), after: 'cm',
      why: 'Change every jump to centimetres before you compare. (mm ÷ 10, m × 100, km × 100 000.)', sol: br(['In cm: ' + ns.map(function (p, i) { return p.n + ' ' + cms[i]; }).join(', '), '<b>' + win + '</b> won: ' + t(mx + '-' + mn + '=' + d) + ' cm farther than the shortest jump.']),
      hints: ['Change all four jumps to centimetres.', 'km to cm: × 1000, then × 100.'], text: 'long jumps in mixed units' });
  }
  HW.defineExit({ lesson: 'u3l2', outcome: 'M1', calc: true, blurb: 'SI units: changing units on the staircase, comparing lengths, cups and jugs, and four jumps in four units.',
    questions: [Q(1, 'M1', 'BEG', function (r) { return A.siFillPart(r, { n: 1 }); }, 'One SI conversion'), Q(2, 'M1', 'PRG', l2q2, 'Which is longer, and by how much'), Q(3, 'M1', 'PRG', function (r) { return A.jugsPart(r); }, 'Cups from a jug and jugs for a party'), Q(4, 'M1', 'MAS', l2q4, 'Long jumps in m, cm, mm and km')] });

  /* =====================================================================================================
   * 3.3 The imperial system and reading a tape measure (M2, M3)
   * ===================================================================================================== */
  function l3q1(r) {
    var k = r.pick(['ftin', 'ydin', 'ydft', 'ftyd', 'mift', 'miyd']), c = A.IMP[k](r);
    return numPart('Change ' + L(c.x, c.from) + ' to ' + { in: 'inches', ft: 'feet', yd: 'yards' }[c.to] + '.', c.y, { after: c.to, diag: c.diag, sol: t(N(c.x) + c.op + '=' + N(c.y)) + ' ' + c.to,
      hints: ['12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5280 ft = 1 mi, 1760 yd = 1 mi.', 'To a smaller unit, multiply. To a bigger unit, divide.'], text: 'imperial ' + c.from + ' to ' + c.to });
  }
  function l3q3(r) {
    var k12 = 12 * r.int(1, 3), a = k12 - r.int(0, 2), b = a + 5, x = A.tapePos(r, k12, b, r.chance(0.5)), w = Math.floor(x + 1e-9), f = q(x - w), ft = Math.floor(x / 12 + 1e-9), diag = [];
    A.tapeDiag(x).forEach(function (m) { diag.push(m); });
    if (w >= 20) diag.push({ v: 12 * Math.floor(w / 10) + (w % 10) + f, code: 'u3x-tape-digits', hint: 'The tape counts <b>inches</b>: ' + w + ' is ' + w + ' inches, not ' + Math.floor(w / 10) + ' ft ' + (w % 10) + ' in. Find the last foot tag passed.' });
    diag.push({ v: 12 * ft + w + f, code: 'u3x-no-sub-ft', hint: 'Take the feet out of the inches: ' + t(N(x) + '-' + 12 * ft) + '.' });
    return ftinPart('Here is part of a tape measure. Write the reading at arrow A in feet and inches. (The inches part is less than 12.)' + tapeSvg({ a: a, b: b, tape: true, marks: [{ x: x, lab: 'A' }] }), x, { frac: true, diag: diag,
      sol: br(['Reading: ' + A.tapeSol(x) + '.', 'The last foot tag passed is ' + ft + 'F (' + 12 * ft + ' in): ' + t(mixT(R(Math.round(x * 16), 16)) + '-' + 12 * ft + '=' + mixT(R(Math.round((x - 12 * ft) * 16), 16))) + ', so ' + t(ftinT(x))]),
      hints: ['Read the inches first (the last number passed, then the 1/16 spaces).', 'The feet are the last foot tag (1F, 2F, 3F) you passed; the inches are how far past it.'], text: 'tape reading in feet and inches' });
  }
  function l3q4(r) {
    var it = r.pick(['a screw', 'a key', 'a crayon', 'a bolt', 'an eraser', 'a nail']), s = find(function () { var x1 = q(r.int(1, 2) + r.int(1, 15) / 16), x2 = q(r.int(4, 5) + r.int(1, 15) / 16); return [x1, x2]; }, function (v) { return (v[1] % 1) < (v[0] % 1) || r.chance(0.4); });
    var x1 = s[0], x2 = s[1], len = q(x2 - x1), fr = frOf(len, 16), f1 = frOf(x1, 16), f2 = frOf(x2, 16);
    return mixPart('The ruler is in inches. How long is ' + it + '? Write the length as a mixed number in simplest form.' + tapeSvg({ a: 0, b: 6, objs: [{ x1: x1, x2: x2, lab: it.replace(/^an? /, '') }] }), fr, { after: 'in',
      diag: [{ v: x2, code: 'u3x-no-start', hint: 'The object doesn’t start at 0: take away the starting mark, ' + t(mixT(f1)) + ' in.' }, { v: x2 - Math.floor(x1), code: 'u3x-start-whole', hint: 'It starts at ' + t(mixT(f1)) + ', not at ' + Math.floor(x1) + ': take away the fraction too.' }, { v: x1 + x2, code: 'u3x-no-start', hint: 'Subtract: end − start.' }],
      sol: br(['It starts at ' + t(mixT(f1)) + ' in and ends at ' + t(mixT(f2)) + ' in.', t(mixT(f2) + '-' + mixT(f1) + '=' + mixT(fr)) + ' in']), hints: ['Read where it starts and where it ends.', 'Length = end − start (borrow 1 inch as 16/16 if you need to).'], text: 'length from a non-zero start' });
  }
  HW.defineExit({ lesson: 'u3l3', outcome: 'M2', calc: true, blurb: 'Imperial units and the tape measure: changing units, reading a ruler to 1/16 in, a tape in feet and inches, and an object that does not start at 0.',
    questions: [Q(1, 'M2', 'BEG', l3q1, 'One imperial conversion'), Q(2, 'M3', 'PRG', function (r) { return A.tapeReadPart(r, { n: 1, tape: false }); }, 'Read one arrow on a ruler'), Q(3, 'M2', 'PRG', l3q3, 'A tape reading in feet and inches'), Q(4, 'M3', 'MAS', l3q4, 'An object that does not start at 0')] });

  /* =====================================================================================================
   * 3.4 Converting length within SI and within imperial (M1, M2, M3)
   * ===================================================================================================== */
  function l4q2(r) {
    var kind = r.pick(['in2ft', 'ft2dec', 'dec2ft']);
    if (kind === 'in2ft') {
      var n = find(function () { return r.int(40, 160); }, function (x) { return x % 12 !== 0; }), c = A.inToFtIn(n);
      return ftinPart('Write ' + L(n, 'in') + ' in feet and inches.', n, { diag: [{ v: 12 * c.f + c.dIn, code: 'u3t-dec-in', hint: t(n + '\\div 12' + eqR(c.dec, 2)) + ': the decimal is part of a <b>foot</b>, not inches. Inches left = ' + t(n + '-' + c.f + '\\times 12') + '.' }, { v: 12 * Math.floor(n / 10) + n % 10, code: 'u3t-imp-10', hint: 'There are 12 inches in a foot, not 10.' }],
        sol: br([t(n + '\\div 12' + eqR(c.dec, 2)) + ', so ' + c.f + ' ft', 'Inches left: ' + t(n + '-' + c.f + '\\times 12=' + c.i) + ', so ' + t(c.f + "'\\," + c.i + "''")]), hints: ['Divide by 12: the whole number is the feet.', 'Inches left = inches − feet × 12.'], text: 'inches to feet and inches' });
    }
    if (kind === 'ft2dec') {
      var f = r.int(2, 12), i = r.pick([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), dec = f + i / 12;
      return numPart('A plan says a wall is ' + hT(f, i) + ' long. Write this in decimal feet, to the nearest hundredth.', dec, { dp: 2, after: 'ft', diag: [{ v: f + i / 10, code: 'u3t-ftin-dec', hint: t(i + "''") + ' is not ' + t('0.' + i) + ' ft: divide the inches by 12.' }, { v: f + i / 100, code: 'u3t-ftin-dec', hint: 'Divide the inches by 12, then add the feet.' }, { v: 12 * f + i, code: 'u3t-not-conv', hint: 'That’s inches. Decimal feet: feet + inches ÷ 12.' }],
        sol: t(f + '+' + i + '\\div 12' + eqR(dec, 2)) + ' ft', hints: ['Decimal feet = feet + inches ÷ 12.'], text: 'feet and inches to decimal feet' });
    }
    var f2 = r.int(3, 14), dd = r.pick([0.25, 0.5, 0.75, 0.2, 0.4, 0.6, 0.8, 0.3, 0.7, 0.9]), x = q(f2 + dd), inch = Math.round(dd * 12), digits = Number(String(dd).split('.')[1]);
    var T = 12 * f2 + inch;
    return ftinPart('A laser measure shows a room is ' + L(x, 'ft') + ' long. Write this in feet and inches, to the nearest inch.', T, { diag: digits !== inch ? [{ v: 12 * f2 + digits, code: 'u3t-dec-in', hint: 'The ' + N(dd) + ' is part of a <b>foot</b>: ' + t(N(dd) + '\\times 12') + ' inches.' }] : [],
      sol: br([t(N(dd) + '\\times 12' + eqR(dd * 12, 0)) + ' in', 'So ' + L(x, 'ft') + ' ≈ ' + t(f2 + "'\\," + inch + "''")]), hints: ['The whole number is the feet.', 'Inches = decimal part × 12.'], text: 'decimal feet to feet and inches' });
  }
  function l4q3(r) {
    if (r.chance(0.5)) {
      var s = find(function () { return [r.int(2, 9), r.int(1, 11), r.int(1, 7), r.int(1, 11)]; }, function (v) { return v[1] + v[3] >= 12 && v[1] + v[3] !== 12; });
      var a = s[0], b = s[1], c = s[2], d = s[3], T = 12 * (a + c) + b + d;
      return ftinPart('Add. Write the answer in feet and inches (fewer than 12 inches): ' + t(a + "'\\," + b + "''+" + c + "'\\," + d + "''"), T, { diag: [{ v: 12 * (a + c) + (b + d - 10) + 12, code: 'u3x-borrow-10', hint: 'Trade <b>12</b> in for 1 ft, not 10.' }, { v: 12 * (a + c) + b + d - 12, code: 'u3x-regroup-lost', hint: 'When you trade 12 in for 1 ft, add that foot to the feet.' }],
        sol: br([t(a + "'\\," + b + "''+" + c + "'\\," + d + "''=" + (a + c) + "'\\," + (b + d) + "''"), t((b + d) + "''=1'\\," + (b + d - 12) + "''") + ', so ' + t(ftinT(T)), 'Check in inches: ' + t((12 * a + b) + '+' + (12 * c + d) + '=' + T) + ' ✓']), hints: ['Add feet to feet and inches to inches.', 'If you get 12 in or more, trade 12 in for 1 ft.'], text: 'add feet and inches' });
    }
    var s2 = find(function () { return [r.int(5, 12), r.int(0, 10), r.int(1, 5), r.int(1, 11)]; }, function (v) { return v[1] < v[3] && v[0] > v[2] + 1; });
    var a2 = s2[0], b2 = s2[1], c2v = s2[2], d2 = s2[3], T2 = 12 * (a2 - c2v) + b2 - d2;
    return ftinPart('Subtract. Write the answer in feet and inches: ' + t(a2 + "'\\," + b2 + "''-" + c2v + "'\\," + d2 + "''"), T2, { diag: [{ v: 12 * (a2 - c2v) + d2 - b2, code: 'u3t-no-borrow', hint: 'Don’t subtract the smaller inches from the bigger. Borrow 1 ft: ' + t(a2 + "'\\," + b2 + "''=" + (a2 - 1) + "'\\," + (b2 + 12) + "''") + '.' }, { v: 12 * (a2 - 1 - c2v) + b2 + 10 - d2, code: 'u3x-borrow-10', hint: '1 ft is <b>12</b> in, not 10.' }, { v: 12 * (a2 - c2v) + b2 + 12 - d2, code: 'u3x-borrow-whole', hint: 'When you borrow 1 ft, the feet go down by 1.' }],
      sol: br(['Borrow 1 ft: ' + t(a2 + "'\\," + b2 + "''=" + (a2 - 1) + "'\\," + (b2 + 12) + "''"), t((a2 - 1) + "'\\," + (b2 + 12) + "''-" + c2v + "'\\," + d2 + "''=" + ftinT(T2))]), hints: ['Not enough inches on top? Borrow 1 ft = 12 in.', 'Then subtract feet from feet and inches from inches.'], text: 'subtract feet and inches' });
  }
  function l4q4(r) {
    var p = person(r), it = r.pick(['garden planters', 'shelves', 'a deck railing', 'birdhouses']);
    var s = find(function () { var B = r.pick([8, 10, 12]), c = r.int(14, 44), Nn = r.int(8, 22), pr = q(r.int(4, 14) + r.pick([0.48, 0.98, 0.29, 0.79])); return { B: B, c: c, N: Nn, pr: pr }; },
      function (s) { var per = Math.floor(12 * s.B / s.c); if (per < 2 || per > 6) return false; return s.N % per !== 0 && (12 * s.B) % s.c !== 0 && Math.ceil(s.N * s.c / (12 * s.B) - 1e-9) !== Math.ceil(s.N / per - 1e-9); });
    var per = Math.floor(12 * s.B / s.c), buy = Math.ceil(s.N / per - 1e-9), bad = Math.ceil(s.N * s.c / (12 * s.B) - 1e-9), cost = buy * s.pr;
    var hint1 = 'First find how many whole ' + s.c + ' in pieces one board gives: ' + t(12 * s.B + '\\div ' + s.c) + ', rounded down. The leftover piece is too short.';
    var specs = [nfld('Boards to buy:', buy, { name: 'Boards', dp: 0, after: 'boards', diag: [{ v: bad, code: 'u3t-total-len', hint: hint1 }, { v: Math.floor(s.N / per), code: 'u3t-round-down', hint: 'Not enough boards: round <b>up</b>.' }, { v: per, code: 'u3t-gave-per', hint: 'That’s the number of pieces from one board.' }, { v: Math.ceil(s.N * s.c / s.B - 1e-9), code: 'u3t-no-convert', hint: 'Change the board length to inches first: ' + t(s.B + '\\times 12=' + 12 * s.B) + ' in.' }] }),
      nfld('Cost:', cost, { name: 'Cost', money: true, diag: [{ v: bad * s.pr, code: 'u3t-total-len', hint: hint1 }], from: function (v) { return v[0] > 0 && Math.round(v[0]) === v[0] ? q(v[0] * s.pr) : null; } })];
    return fieldsPart(p.n + ' is building ' + it + '. ' + cap(p.he) + ' needs ' + t(s.N) + ' pieces of board, each ' + L(s.c, 'in') + ' long. The boards are ' + L(s.B, 'ft') + ' long and cost ' + MM(s.pr) + ' each. (Ignore the saw cuts.) How many boards must ' + p.he + ' buy, and what do they cost?', specs,
      br([t(s.B + '\\text{ ft}=' + s.B + '\\times 12=' + 12 * s.B + '\\text{ in}') + '; ' + t(12 * s.B + '\\div ' + s.c + eqR(12 * s.B / s.c, 2)) + ', so ' + per + ' pieces from each board (round down)', t(s.N + '\\div ' + per + eqR(s.N / per, 2)) + ', so buy ' + buy + ' boards (round up)', 'Cost: ' + t(buy + '\\times ' + Mt(s.pr) + '=' + Mt(cost))]),
      ['Pieces you can cut from one board: round down.', 'Boards you must buy: round up.'], 'boards to buy');
  }
  HW.defineExit({ lesson: 'u3l4', outcome: 'M2', calc: true, blurb: 'Converting within a system: the SI staircase, inches, feet and inches and decimal feet, adding and subtracting feet and inches, and boards to buy.',
    questions: [Q(1, 'M1', 'BEG', function (r) { return A.siFillPart(r, { n: 1, pool: A.SISTAIR.concat(A.SIBASIC.slice(0, 3)) }); }, 'A staircase conversion'), Q(2, 'M2', 'PRG', l4q2, 'Inches, feet and inches, decimal feet'), Q(3, 'M2', 'PRG', l4q3, 'Add or subtract feet and inches'), Q(4, 'M3', 'MAS', l4q4, 'Boards to buy for cut pieces')] });

  /* =====================================================================================================
   * 3.5 Converting length between SI and imperial (M2)
   * ===================================================================================================== */
  function l5q3(r) {
    var it = r.pick([['Rope', 'yd', [0.89, 3.49]], ['Fabric', 'yd', [6.99, 18.99]], ['Pipe insulation', 'ft', [0.79, 2.49]], ['Trim', 'ft', [0.99, 3.29]], ['Chain', 'ft', [1.49, 4.99]]]);
    var pr = q(r.int(Math.round(it[2][0] * 100), Math.round(it[2][1] * 100)) / 100), f = it[1] === 'yd' ? 0.9144 : 0.3048, ans = pr / f;
    var diag = [{ v: pr * f, code: 'u3t-conv-dir', hint: 'A metre is longer than a ' + (it[1] === 'yd' ? 'yard' : 'foot') + ', so a metre costs <b>more</b>: divide by ' + f + '.' }];
    if (it[1] === 'ft') diag.push({ v: pr / 30.48, code: 'u3x-cm-m', hint: '1 ft = 30.48 cm = <b>0.3048 m</b>. Divide by 0.3048 for the price per metre.' }, { v: pr / 0.9144, code: 'u3t-wrong-fact', hint: '0.9144 is for yards. 1 ft = 0.3048 m.' });
    else diag.push({ v: pr / 0.3048, code: 'u3t-wrong-fact', hint: '0.3048 is for feet. 1 yd = 0.9144 m.' }, { v: pr / 3, code: 'u3t-wrong-fact', hint: 'Use 1 yd = 0.9144 m.' });
    return numPart(it[0] + ' costs ' + MM(pr) + ' per ' + (it[1] === 'yd' ? 'yard' : 'foot') + ' at a hardware store. What is the price per metre, to the nearest cent? (1 ' + it[1] + ' = ' + f + ' m)', ans, { money: true, after: '/m', diag: diag,
      sol: '1 ' + it[1] + ' = ' + f + ' m, so the price per metre is ' + t(Mt(pr) + '\\div ' + f + eqM(ans)), hints: ['Price per metre = price ÷ length in metres.', '1 ' + it[1] + ' = ' + f + ' m.'], text: 'price per metre' });
  }
  function l5q4(r) {
    var s = find(function () { var cm = r.chance(0.5) ? r.int(20, 95) : q(r.int(40, 180) / 2); var x = cm / 2.54, w = Math.floor(x), k = Math.round((x - w) * 16); return { cm: cm, x: x, w: w, k: k }; },
      function (s) { var fr16 = (s.x - s.w) * 16; return s.k > 0 && s.k < 16 && Math.abs(fr16 - Math.round(fr16)) > 0.08 && Math.abs(fr16 - Math.round(fr16)) < 0.47; });
    var cm = s.cm, x = s.x, w = s.w, k = s.k, fr = R(16 * w + k, 16), kd = Math.floor((x - w) * 16), kt = Math.round((x - w) * 10), place = r.pick(['A metric plan says a shelf is', 'A kitchen drawing says a cabinet is', 'A European furniture kit says a board is', 'A metric plan says a door frame is']);
    var diag = [{ v: kd ? w + kd / 16 : null, code: 'u3x-16-down', hint: t(N(rd((x - w) * 16, 3)) + '\\ldots') + ' is closer to ' + k + ' than to ' + kd + ': round to the <b>nearest</b> sixteenth.' }, { v: w + kt / 16, code: 'u3x-tenths-16', hint: 'Multiply the decimal part by <b>16</b> (not 10) to get sixteenths.' }, { v: Math.floor(cm * 2.54) + Math.round((cm * 2.54 % 1) * 16) / 16, code: 'u3t-conv-dir', hint: 'An inch is longer than a centimetre, so the number of inches is <b>smaller</b>: divide by 2.54.' }];
    return mixPart(place + ' ' + L(cm, 'cm') + ' long. Kim has an inch tape measure. Find ' + L(cm, 'cm') + ' to the nearest ' + t('\\tfrac{1}{16}') + ' in, as a mixed number in simplest form.', fr, { after: 'in', diag: diag,
      sol: br([t(N(cm) + '\\div 2.54=' + N(rd(x, 4)) + '\\ldots') + ' in', 'Decimal part: ' + t(N(rd(x - w, 4)) + '\\times 16=' + N(rd((x - w) * 16, 2)) + '\\ldots\\approx ' + k), 'So ' + L(cm, 'cm') + ' ≈ ' + t(w + '\\frac{' + k + '}{16}' + (gcd(k, 16) > 1 ? '=' + mixT(fr) : '')) + ' in']),
      hints: ['Change cm to inches: ÷ 2.54.', 'Multiply the decimal part by 16 and round to a whole number: that many sixteenths. Simplify.'], text: 'metric length on an inch tape' });
  }
  HW.defineExit({ lesson: 'u3l5', outcome: 'M2', calc: true, blurb: 'SI and imperial: an inch, foot, yard or mile in SI, a height in cm, a price per metre, and a metric length on an inch tape.',
    questions: [Q(1, 'M2', 'BEG', function (r) { return A.impToSIPart(r); }, 'One imperial → SI conversion'), Q(2, 'M2', 'PRG', function (r) { return A.heightPart(r, { single: true }); }, 'A height in centimetres'), Q(3, 'M2', 'PRG', l5q3, 'A price per yard or foot as a price per metre'), Q(4, 'M2', 'MAS', l5q4, 'A metric length on an inch tape (1/16 in)')] });

  /* =====================================================================================================
   * 3.6 Perimeter and circumference (M3)
   * ===================================================================================================== */
  function l6q1(r) {
    if (r.chance(0.4)) {
      var a = r.int(55, 99), b = q(r.int(10, 16) / 10), c = r.int(60, 99), P0 = q(a / 100 + b + c / 100);
      return numPart('A triangle-shaped garden bed has sides of ' + L(a, 'cm') + ', ' + L(b, 'm') + ' and ' + L(c, 'cm') + '. What is its perimeter, in metres?', P0, { after: 'm',
        diag: [{ v: a + b + c, code: 'u3t-no-convert', hint: 'All the sides must be in the <b>same unit</b> before you add: change cm to m (÷ 100).' }, { v: P0 * 100, code: 'u3t-unit-ans', hint: 'That’s centimetres. The question asks for metres.' }],
        sol: br([t(a + '\\text{ cm}=' + N(a / 100) + '\\text{ m}') + ', ' + t(c + '\\text{ cm}=' + N(c / 100) + '\\text{ m}'), t('P=' + N(a / 100) + '+' + N(b) + '+' + N(c / 100) + '=' + N(P0)) + ' m']), hints: ['Change every side to metres first.', 'Then add all three sides.'], text: 'perimeter with mixed units' });
    }
    var u = r.pick(['m', 'ft', 'in']), l = u === 'in' ? pickR(r, 10, 30, 0.5) : pickR(r, 6, 40, 0.5), w = u === 'in' ? pickR(r, 6, 20, 0.5) : pickR(r, 3, 25, 0.5); if (l <= w) l = q(w + r.int(2, 6));
    var what = r.pick([['a rectangular garden', 'm'], ['a rectangular deck', 'ft'], ['a picture frame', 'in'], ['a rectangular patio', 'm']]);
    return numPart('A rectangle is ' + L(l, u) + ' long and ' + L(w, u) + ' wide. Find its perimeter.' + fig2([{ k: 'poly', pts: [[0, 0], [l, 0], [l, w], [0, w]] }, { k: 'text', at: [l / 2, 0], s: Np(l) + ' ' + u, dy: 13 }, { k: 'text', at: [l, w / 2], s: Np(w) + ' ' + u, dx: 8, anchor: 'start' }], { w: 240, h: 160, aria: 'rectangle' }), 2 * l + 2 * w, { after: u,
      diag: [{ v: l + w, code: 'u3x-two-sides', hint: 'A rectangle has <b>4</b> sides: 2 lengths and 2 widths.' }, { v: l * w, code: 'u3t-area-not-p', hint: 'That’s the area. The perimeter is the distance around: P = 2l + 2w.' }, { v: 2 * l + w, code: 'u3t-missing-sides', hint: 'Add both widths.' }],
      sol: t('P=2l+2w=2(' + N(l) + ')+2(' + N(w) + ')=' + N(2 * l) + '+' + N(2 * w) + '=' + N(2 * l + 2 * w)) + ' ' + u, hints: ['P = 2l + 2w (or add all 4 sides).'], text: 'rectangle perimeter' });
  }
  function l6q3(r) {
    var d = r.int(50, 72), n = r.pick([100, 250, 500, 400, 750, 1000]), C = PI * d, dist = C * n / 100, veh = r.pick(['bike wheel', 'wheelchair wheel', 'scooter wheel', 'wagon wheel']);
    return numPart('A ' + veh + ' is ' + L(d, 'cm') + ' across. How far does it roll in ' + t(n) + ' turns? Give your answer in metres, to the nearest tenth.', dist, { dp: 1, after: 'm', p314: 3.14 * d * n / 100,
      diag: [{ v: C * n, code: 'u3t-unit-ans', hint: 'That’s centimetres. Change to metres: ÷ 100.' }, { v: C * n / 1000, code: 'u3t-si-steps', hint: 'cm to m is ÷ 100.' }, { v: PI * d / 2 * n / 100, code: 'u3t-pi-r', hint: 'One turn rolls the whole circumference: C = πd (use the whole diameter).' }, { v: PI * d * d / 4 * n / 100, code: 'u3t-area-not-c', hint: 'Use the circumference (the distance around), not the area.' }],
      sol: br(['One turn: ' + t('C=\\pi\\times ' + d + eqR(C, 2)) + ' cm', t(n) + ' turns: ' + t(N(rd(C, 4)) + '\\times ' + n + eqR(C * n, 1)) + ' cm', 'In metres: ' + t(N(rd(C * n, 2)) + '\\div 100' + eqR(dist, 1)) + ' m']), hints: ['One turn rolls one circumference: C = πd.', 'Multiply by the turns, then change cm to m (÷ 100).'], text: 'wheel rolling distance' });
  }
  function l6q4(r) {
    var p = person(r), s = find(function () { var D = pickR(r, 2, 6, 0.2), pc = r.pick([1.2, 1.5, 2, 2.4]), pr = q(r.int(3, 9) + r.pick([0.49, 0.99, 0.79])); return { D: D, pc: pc, pr: pr }; }, function (s) { var n = PI * s.D / s.pc; return Math.abs(n - Math.round(n)) > 0.12 && n > 2.5 && Math.ceil(PI * s.D / 2 / s.pc - 1e-9) !== Math.ceil(n - 1e-9); });
    var C = PI * s.D, n = Math.ceil(C / s.pc - 1e-9), cost = n * s.pr, rr = s.D / 2;
    var dn = [{ v: Math.ceil(PI * rr / s.pc - 1e-9), code: 'u3t-pi-r', hint: 'π × r is only half way around. C = πd.' }, { v: Math.floor(C / s.pc), code: 'u3t-round-down', hint: 'That’s not quite enough edging: round <b>up</b>.' }, { v: Math.ceil(PI * rr * rr / s.pc - 1e-9), code: 'u3t-area-not-c', hint: 'Edging goes around the edge: use the circumference, πd.' }];
    var specs = [nfld('Pieces:', n, { name: 'Pieces', dp: 0, after: 'pieces', diag: dn }), nfld('Cost:', cost, { name: 'Cost', money: true, diag: dn.map(function (m) { return { v: m.v * s.pr, code: m.code, hint: m.hint }; }), from: function (v) { return v[0] > 0 && Math.round(v[0]) === v[0] ? q(v[0] * s.pr) : null; } })];
    return fieldsPart(p.n + ' is putting plastic edging around a round flower bed ' + L(s.D, 'm') + ' across. The edging is sold in ' + L(s.pc, 'm') + ' pieces for ' + MM(s.pr) + ' each. How many pieces are needed, and what do they cost before tax?', specs,
      br(['Circumference: ' + t('C=\\pi d=\\pi\\times ' + N(s.D) + eqR(C, 2)) + ' m', 'Pieces: ' + t(N(rd(C, 3)) + '\\div ' + N(s.pc) + eqR(C / s.pc, 2)) + ', so ' + n + ' pieces (round up)', 'Cost: ' + t(n + '\\times ' + Mt(s.pr) + '=' + Mt(cost))]), ['Find the circumference: C = πd.', 'Pieces = circumference ÷ length of one piece, rounded up. Then × the price.'], 'round bed edging');
  }
  HW.defineExit({ lesson: 'u3l6', outcome: 'M3', calc: true, blurb: 'Perimeter and circumference: a perimeter, a circumference from the radius, how far a wheel rolls, and edging for a round bed.',
    questions: [Q(1, 'M3', 'BEG', l6q1, 'Perimeter'), Q(2, 'M3', 'PRG', function (r) { return A.circumfPart(r, { r: true }); }, 'Circumference from the radius'), Q(3, 'M3', 'PRG', l6q3, 'How far a wheel rolls'), Q(4, 'M3', 'MAS', l6q4, 'Edging pieces for a round bed')] });

  /* =====================================================================================================
   * 3.7 Rearranging formulas (A1)
   * ===================================================================================================== */
  function l7q4(r) {
    var u = r.pick(['m', 'ft']), what = r.pick(['garden', 'dog park', 'patio', 'skating rink']);
    if (r.chance(0.5)) {
      var w = pickR(r, 3, 15, 0.5), l = 2 * w, P0 = 6 * w;
      var specs = [nfld('Width:', w, { name: 'Width', after: u, diag: [{ v: P0 / 4, code: 'u3x-square', hint: 'It is not a square: the length is <b>twice</b> the width. P = 2(2w) + 2w = 6w.' }, { v: P0 / 3, code: 'u3x-p3', hint: 'Write the perimeter with w only: P = 2(2w) + 2w = <b>6w</b>.' }, { v: P0 / 2, code: 'u3t-half-step', hint: 'P = 6w: divide by 6.' }] }),
        nfld('Length:', l, { name: 'Length', after: u, diag: [{ v: P0 / 3 * 2, code: 'u3x-p3', hint: 'The length is twice the width.' }], from: function (v) { return v[0] > 0 ? 2 * v[0] : null; } })];
      return fieldsPart('A rectangular ' + what + ' is twice as long as it is wide. Its perimeter is ' + L(P0, u) + '. Find its width and its length. (' + t('P=2l+2w') + ')', specs,
        br(['The length is 2w, so ' + t('P=2(2w)+2w=4w+2w=6w'), t(N(P0) + '=6w') + ', so ' + t('w=' + N(P0) + '\\div 6=' + N(w)) + ' ' + u + ' and ' + t('l=2\\times ' + N(w) + '=' + N(l)) + ' ' + u, 'Check: ' + t('2(' + N(l) + ')+2(' + N(w) + ')=' + N(P0)) + ' ✓']),
        ['Write the length using w: l = 2w. Put it into P = 2l + 2w.', 'Collect the w’s, then divide.'], 'twice as long as wide');
    }
    var w2 = pickR(r, 3, 14, 0.5), m = r.int(2, 6), l2 = w2 + m, P2 = 2 * l2 + 2 * w2;
    var specs2 = [nfld('Width:', w2, { name: 'Width', after: u, diag: [{ v: (P2 - m) / 4, code: 'u3t-one-w', hint: 'There are <b>two</b> lengths, so the extra ' + m + ' ' + u + ' is counted twice: P = 4w + ' + 2 * m + '.' }, { v: P2 / 4, code: 'u3x-square', hint: 'The length is ' + m + ' ' + u + ' more than the width: take away the extra first.' }, { v: (P2 - 2 * m) / 2, code: 'u3t-half-step', hint: 'P − ' + 2 * m + ' is <b>four</b> widths: divide by 4.' }] }),
      nfld('Length:', l2, { name: 'Length', after: u, diag: [], from: function (v) { return v[0] > 0 ? v[0] + m : null; } })];
    return fieldsPart('A rectangular ' + what + ' is ' + L(m, u) + ' longer than it is wide. Its perimeter is ' + L(P2, u) + '. Find its width and its length. (' + t('P=2l+2w') + ')', specs2,
      br(['The length is w + ' + m + ', so ' + t('P=2(w+' + m + ')+2w=4w+' + 2 * m), t(N(P2) + '=4w+' + 2 * m) + ': subtract ' + 2 * m + ', ' + t('4w=' + N(P2 - 2 * m)) + ', divide by 4: ' + t('w=' + N(w2)) + ' ' + u, t('l=' + N(w2) + '+' + m + '=' + N(l2)) + ' ' + u + ' &nbsp;Check: ' + t('2(' + N(l2) + ')+2(' + N(w2) + ')=' + N(P2)) + ' ✓']),
      ['Write the length using w: l = w + ' + m + '.', 'Put it into P = 2l + 2w, undo + first, then ÷.'], 'longer than wide');
  }
  HW.defineExit({ lesson: 'u3l7', outcome: 'A1', calc: true, blurb: 'Rearranging formulas: one step, a radius from a circumference, a width from the perimeter, and a rectangle described by its length and width.',
    questions: [Q(1, 'A1', 'BEG', function (r) { return A.oneStepPart(r); }, 'One-step rearranging'), Q(2, 'A1', 'PRG', function (r) { return A.diamPart(r, { radius: true }); }, 'A radius from a circumference'), Q(3, 'A1', 'PRG', function (r) { return A.rinkPart(r, { findW: true }); }, 'A width from P = 2l + 2w'), Q(4, 'A1', 'MAS', l7q4, 'Width and length from the perimeter')] });

  /* =====================================================================================================
   * 3.8 Area of 2-D shapes (M4)
   * ===================================================================================================== */
  var AU = [['ft²', 'in²', 144, 12, 'square inches'], ['in²', 'ft²', 1 / 144, 1 / 12, 'square feet'], ['yd²', 'ft²', 9, 3, 'square feet'], ['ft²', 'yd²', 1 / 9, 1 / 3, 'square yards'], ['m²', 'cm²', 10000, 100, 'square centimetres'], ['cm²', 'm²', 1 / 10000, 1 / 100, 'square metres'], ['m²', 'ft²', 10.76, 3.28, 'square feet']];
  function l8q3(r) {
    var c = r.pick(AU), x;
    if (c[2] === 144) x = r.int(2, 12); else if (c[2] === 1 / 144) x = 144 * r.int(2, 9); else if (c[2] === 9) x = r.int(2, 14); else if (c[2] === 1 / 9) x = 9 * r.int(3, 20); else if (c[2] === 10000) x = q(r.int(5, 50) / 10); else if (c[2] === 1 / 10000) x = 1000 * r.int(5, 90); else x = r.int(8, 40);
    var y = q(x * c[2]), mult = c[2] >= 1, f = mult ? c[2] : Math.round(1 / c[2]), lf = mult ? c[3] : Math.round(1 / c[3]), dp = c[2] === 10.76 ? 1 : null;
    return numPart('Change ' + L(x, c[0]) + ' to ' + c[4] + (dp ? ', to the nearest tenth' : '') + '.' + (c[2] === 10.76 ? ' (1 m² ≈ 10.76 ft²)' : ''), y, { dp: dp, after: c[1], diag: [{ v: mult ? x * lf : x / lf, code: 'u3t-len-factor', hint: 'For <b>area</b> the length factor is used twice: ' + (c[2] === 10.76 ? '1 m² ≈ 10.76 ft² (3.28 is for length).' : t(lf + '\\times ' + lf + '=' + N(f)) + '.') }, { v: mult ? x / f : x * f, code: 'u3x-area-dir', hint: mult ? 'The smaller unit has the bigger number: multiply.' : 'The bigger unit has the smaller number: divide.' }],
      sol: (c[2] === 10.76 ? '1 m² ≈ 10.76 ft²: ' : '1 ' + (mult ? c[0] : c[1]) + ' = ' + N(f) + ' ' + (mult ? c[1] : c[0]) + ': ') + t(N(x) + (mult ? '\\times ' : '\\div ') + N(f) + (dp ? eqR(x * c[2], 1) : '=' + N(y)) + uT(c[1])), hints: ['1 ft² = 144 in², 1 yd² = 9 ft², 1 m² = 10 000 cm², 1 m² ≈ 10.76 ft².', 'To a smaller unit, multiply. To a bigger unit, divide.'], text: 'area units ' + c[0] + ' to ' + c[1] });
  }
  function l8q4(r) {
    var p = person(r), s = find(function () { var a = r.int(9, 16), b = r.pick([0, 6, 3, 9]), c = r.int(8, 13), d = r.pick([0, 6]), pr = q(r.int(18, 45) + r.pick([0.8, 0.5, 0.95, 0.25])); return { a: a, b: b, c: c, d: d, pr: pr }; }, function (s) { return (s.b || s.d) && s.a * 12 + s.b !== s.c * 12 + s.d; });
    var Lf = s.a + s.b / 12, Wf = s.c + s.d / 12, ft2 = Lf * Wf, yd2 = ft2 / 9, cost = rd(yd2, 2) * s.pr;
    var specs = [nfld('Area in ft²:', ft2, { name: 'Square feet', dp: 2, after: 'ft²', diag: [{ v: (s.a + s.b / 10) * (s.c + s.d / 10), code: 'u3t-ftin-dec', hint: t(s.a + "'\\," + s.b + "''") + ' is not ' + t(s.a + '.' + s.b) + ' ft: ' + s.b + ' in = ' + t(s.b + '\\div 12=' + N(s.b / 12)) + ' ft.' }, { v: 2 * Lf + 2 * Wf, code: 'u3t-area-not-p', hint: 'Area = length × width.' }] }),
      nfld('Area in yd²:', yd2, { name: 'Square yards', dp: 2, after: 'yd²', diag: [{ v: ft2 / 3, code: 'u3t-len-factor', hint: '1 yd² = 3 ft × 3 ft = <b>9</b> ft²: divide by 9.' }, { v: ft2 * 9, code: 'u3x-area-dir', hint: 'A square yard is bigger, so the number is smaller: ÷ 9.' }], from: function (v) { return v[0] > 0 ? v[0] / 9 : null; }, ftol: 0.006 }),
      nfld('Cost:', cost, { name: 'Cost', money: true, alts: [yd2 * s.pr], diag: [{ v: ft2 * s.pr, code: 'u3x-no-area-conv', hint: 'The price is per <b>square yard</b>: use the area in yd².' }, { v: ft2 / 3 * s.pr, code: 'u3t-len-factor', hint: '1 yd² = 9 ft².' }], from: function (v) { return v[1] > 0 ? v[1] * s.pr : null; }, ftol: 0.011 * s.pr + 0.006 })];
    return fieldsPart(p.n + '’s bedroom floor is a rectangle ' + hT(s.a, s.b) + ' by ' + hT(s.c, s.d) + '. Carpet costs ' + MM(s.pr) + ' per square yard. Find the area of the floor in square feet and in square yards (to the nearest hundredth), and the cost of the carpet before tax.', specs,
      br(['In feet: ' + t(s.a + "'\\," + s.b + "''=" + N(rd(Lf, 4)) + (near(Lf, rd(Lf, 4)) ? '' : '\\ldots')) + ' ft and ' + t(s.c + "'\\," + s.d + "''=" + N(rd(Wf, 4)) + (near(Wf, rd(Wf, 4)) ? '' : '\\ldots')) + ' ft', 'Area: ' + t(N(rd(Lf, 4)) + '\\times ' + N(rd(Wf, 4)) + eqR(ft2, 2)) + ' ft²', 'In yd²: ' + t(N(rd(ft2, 2)) + '\\div 9' + eqR(yd2, 2)) + ' yd²', 'Cost: ' + t(N(rd(yd2, 2)) + '\\times ' + Mt(s.pr) + eqM(cost))]),
      ['Change feet and inches to decimal feet: inches ÷ 12.', 'Area in ft² ÷ 9 = area in yd². Then × the price per yd².'], 'carpet for a room');
  }
  HW.defineExit({ lesson: 'u3l8', outcome: 'M4', calc: true, blurb: 'Area: rectangles, parallelograms and triangles, circles and trapezoids, changing area units, and carpet for a floor in feet and inches.',
    questions: [Q(1, 'M4', 'BEG', function (r) { return A.areaShapePart(r, { kinds: ['rect', 'para', 'tri'] }); }, 'Rectangle, parallelogram or triangle'), Q(2, 'M4', 'PRG', function (r) { return A.areaShapePart(r, { kinds: ['circ', 'trap'] }); }, 'Circle or trapezoid'), Q(3, 'M4', 'PRG', l8q3, 'Change area units'), Q(4, 'M4', 'MAS', l8q4, 'Carpet for a room: ft², yd², cost')] });

  /* =====================================================================================================
   * 3.9 Composite and irregular shapes (M4)
   * ===================================================================================================== */
  function l9q4(r) {
    var Wd = r.int(6, 12), D = r.int(4, 8), rr = Wd / 2, Ar = Wd * D + PI * rr * rr / 2, cov = r.pick([10, 12, 15, 8]), cans = Math.ceil(Ar / cov - 1e-9);
    if (Math.abs(Ar / cov - Math.round(Ar / cov)) < 0.05) cov = cov === 15 ? 12 : 15, cans = Math.ceil(Ar / cov - 1e-9);
    var aD = [{ v: Wd * D + PI * rr * rr, code: 'u3t-full-circle', hint: 'Only <b>half</b> a circle: ½ × πr².' }, { v: Wd * D + PI * Wd * Wd / 2, code: 'u3t-d-as-r', hint: 'The half circle is ' + Wd + ' m across: r = ' + N(rr) + ' m.' }, { v: Wd * D, code: 'u3t-missing-piece', hint: 'Add the half circle.' }];
    var specs = [nfld('Area:', Ar, { name: 'Area', dp: 2, after: 'm²', diag: aD, p314: Wd * D + 3.14 * rr * rr / 2 }),
      nfld('Cans:', cans, { name: 'Cans', dp: 0, after: 'cans', diag: [{ v: Math.floor(Ar / cov), code: 'u3t-round-down', hint: 'That’s not enough paint: round <b>up</b>.' }].concat(aD.map(function (m) { return { v: Math.ceil(m.v / cov - 1e-9), code: m.code, hint: m.hint }; }).filter(function (m) { return m.v !== cans; })), from: function (v) { return v[0] > 0 ? Math.ceil(v[0] / cov - 1e-9) : null; }, ftol: 0 })];
    return fieldsPart('A school stage is a rectangle ' + L(Wd, 'm') + ' wide and ' + L(D, 'm') + ' deep, with a half circle ' + L(Wd, 'm') + ' across on the front. Find the area of the stage, to the nearest hundredth. One can of floor paint covers ' + L(cov, 'm²') + '. How many cans are needed for one coat?' + A.stageFig(Wd, D), specs,
      br(['Rectangle: ' + t(Wd + '\\times ' + D + '=' + Wd * D) + ' m²; half circle: ' + t('\\frac{1}{2}\\times\\pi\\times ' + N(rr) + '^2' + eqR(PI * rr * rr / 2, 3)) + ' m²', 'Area: ' + t(Wd * D + '+' + N(rd(PI * rr * rr / 2, 3)) + eqR(Ar, 2)) + ' m²', 'Cans: ' + t(N(rd(Ar, 2)) + '\\div ' + cov + eqR(Ar / cov, 2)) + ', so ' + cans + ' cans (round up)']),
      ['Split the stage into a rectangle and a half circle.', 'Cans = area ÷ coverage, rounded up.'], 'stage area and paint');
  }
  HW.defineExit({ lesson: 'u3l9', outcome: 'M4', calc: true, blurb: 'Composite and irregular shapes: an estimate on a grid, an L-shaped floor, a yard minus a pond and deck, and painting a stage.',
    questions: [Q(1, 'M4', 'BEG', function (r) { return A.gridPart(r); }, 'An irregular shape on a grid'), Q(2, 'M4', 'PRG', function (r) { return A.compositePart(r, { kind: 'lshape' }); }, 'An L-shaped floor'), Q(3, 'M4', 'PRG', function (r) { return A.compositePart(r, { kind: 'lawn' }); }, 'A yard minus a pond (and deck)'), Q(4, 'M4', 'MAS', l9q4, 'A stage: area and cans of paint')] });

  /* =====================================================================================================
   * 3.10 Nets and surface area of prisms (M4)
   * ===================================================================================================== */
  function l10q1(r) {
    var u = r.pick(['cm', 'in', 'm']), s = u === 'm' ? pickR(r, 0.5, 2.5, 0.1) : pickR(r, 2, 15, 0.5), f = q(s * s), SA = q(6 * f);
    return numPart('A cube has edges of ' + L(s, u) + '. Find its surface area.' + solid('cube', { s: Np(s) + ' ' + u }), SA, { after: u + '²',
      diag: [{ v: s * s * s, code: 'u3t-volume', hint: 's × s × s is the volume. Surface area adds the 6 faces.' }, { v: f, code: 'u3x-one-face', hint: 'That’s one face. A cube has <b>6</b> equal faces.' }, { v: 5 * f, code: 'u3x-five-faces', hint: 'Count again: a closed cube has 6 faces.' }, { v: 4 * f, code: 'u3x-four-faces', hint: 'Don’t forget the top and the bottom: 6 faces.' }],
      sol: br(['One face: ' + t(N(s) + '\\times ' + N(s) + '=' + N(f) + uT(u + '²')), t('SA=6\\times ' + N(f) + '=' + N(SA) + uT(u + '²'))]), hints: ['A cube has 6 equal square faces.', 'SA = 6 × (one face).'], text: 'surface area of a cube' });
  }
  function l10q2(r) {
    var s = find(function () { return [r.int(10, 36), r.int(6, 24), r.int(4, 18)]; }, function (v) { return v[0] > v[1] && v[1] !== v[2] && v[0] !== v[2]; }), l = s[0], w = s[1], h = s[2], SA = 2 * (l * w + l * h + w * h), ft2 = SA / 144;
    var specs = [nfld('In square inches:', SA, { name: 'Square inches', after: 'in²', diag: [{ v: l * w * h, code: 'u3t-volume', hint: 'That’s the volume. Add the areas of the 6 faces.' }, { v: l * w + l * h + w * h, code: 'u3t-half-faces', hint: 'There are 2 of each face.' }] }),
      nfld('In square feet:', ft2, { name: 'Square feet', dp: 1, after: 'ft²', diag: [{ v: SA / 12, code: 'u3t-len-factor', hint: '1 ft² = 12 in × 12 in = <b>144</b> in².' }, { v: SA * 144, code: 'u3x-area-dir', hint: 'Square feet are bigger: divide by 144.' }], from: function (v) { return v[0] > 0 ? v[0] / 144 : null; }, ftol: 0.06 })];
    return fieldsPart('A closed shipping box is ' + L(l, 'in') + ' long, ' + L(w, 'in') + ' wide and ' + L(h, 'in') + ' tall. Find its surface area in square inches, then in square feet (to the nearest tenth).' + solid('rectprism', { l: l + ' in', w: w + ' in', h: h + ' in' }), specs,
      br(['Top and bottom: ' + t('2\\times ' + l + '\\times ' + w + '=' + 2 * l * w) + '; front and back: ' + t('2\\times ' + l + '\\times ' + h + '=' + 2 * l * h) + '; ends: ' + t('2\\times ' + w + '\\times ' + h + '=' + 2 * w * h), t('SA=' + SA) + ' in²', 'In ft²: ' + t(SA + '\\div 144' + eqR(ft2, 1)) + ' ft²']),
      ['Add the 3 pairs of faces.', '1 ft² = 144 in²: divide.'], 'box SA in in² and ft²');
  }
  function l10q4(r) {
    var p = person(r), s = find(function () { return [pickR(r, 0.8, 1.6, 0.1), pickR(r, 0.4, 0.8, 0.1), pickR(r, 0.3, 0.7, 0.1), q(r.int(6, 14) + r.pick([0.5, 0.25, 0.75, 0]))]; }, function (v) { return v[0] > v[1] && v[1] !== v[2]; });
    var l = s[0], w = s[1], h = s[2], rate = s[3], bot = q(l * w), fb = q(2 * l * h), ends = q(2 * w * h), Ar = q(bot + fb + ends), cost = Ar * rate;
    var aD = [{ v: Ar + bot, code: 'u3t-extra-face', hint: 'The bin has <b>no top</b>: only 5 faces.' }, { v: bot + l * h + w * h, code: 'u3t-half-faces', hint: 'There are 2 long sides and 2 ends.' }, { v: l * w * h, code: 'u3t-volume', hint: 'That’s the volume. Add the areas of the 5 faces.' }, { v: fb + ends, code: 'u3t-no-base', hint: 'Add the bottom too.' }];
    var specs = [nfld('Area:', Ar, { name: 'Area', after: 'm²', dp: 2, diag: aD }), nfld('Cost:', cost, { name: 'Cost', money: true, diag: aD.map(function (m) { return { v: m.v * rate, code: m.code, hint: m.hint }; }), from: function (v) { return v[0] > 0 ? v[0] * rate : null; }, ftol: 0.011 })];
    return fieldsPart(p.n + ' made a wooden toy bin. It is a rectangular prism ' + L(l, 'm') + ' long, ' + L(w, 'm') + ' wide and ' + L(h, 'm') + ' tall, with <b>no top</b>. A waterproof stain costs ' + MM(rate) + ' for each square metre covered. Find the outside surface area, and the cost to stain the outside.' + solid('rectprism', { l: Np(l) + ' m', w: Np(w) + ' m', h: Np(h) + ' m' }), specs,
      br(['Bottom: ' + t(N(l) + '\\times ' + N(w) + '=' + N(bot)) + '; front and back: ' + t('2\\times ' + N(l) + '\\times ' + N(h) + '=' + N(fb)) + '; 2 ends: ' + t('2\\times ' + N(w) + '\\times ' + N(h) + '=' + N(ends)), 'Area (5 faces, no top): ' + t(N(bot) + '+' + N(fb) + '+' + N(ends) + '=' + N(Ar)) + ' m²', 'Cost: ' + t(N(Ar) + '\\times ' + Mt(rate) + eqM(cost))]),
      ['No top: only 5 faces (the bottom, 2 long sides, 2 ends).', 'Multiply the area by the price per m².'], 'open toy bin');
  }
  HW.defineExit({ lesson: 'u3l10', outcome: 'M4', calc: true, blurb: 'Surface area of prisms: a cube, a closed box in in² and ft², a triangular prism, and an open toy bin to stain.',
    questions: [Q(1, 'M4', 'BEG', l10q1, 'Surface area of a cube'), Q(2, 'M4', 'PRG', l10q2, 'A closed box in in² and ft²'), Q(3, 'M4', 'PRG', function (r) { return A.solidPart(r, { kinds: ['tri'] }); }, 'A triangular prism'), Q(4, 'M4', 'MAS', l10q4, 'An open toy bin and the cost to stain it')] });

  /* =====================================================================================================
   * 3.11 Surface area of cylinders, pyramids and cones (M4)
   * ===================================================================================================== */
  function l11q1(r) {
    var u = r.pick(['cm', 'in']), isR = r.chance(0.5), d = r.int(5, 16), rr = q(d / 2), h = r.int(6, 20), A0 = 2 * PI * rr * h;
    return numPart('A can has a ' + (isR ? 'radius' : 'diameter') + ' of ' + L(isR ? rr : d, u) + ' and a height of ' + L(h, u) + '. Find the area of the paper label that wraps around its side (no overlap), to the nearest tenth.' + solid('cylinder', isR ? { r: Np(rr) + ' ' + u, h: h + ' ' + u } : { d: d + ' ' + u, h: h + ' ' + u }), A0, { dp: 1, after: u + '²', p314: 2 * 3.14 * rr * h,
      diag: [{ v: PI * rr * h, code: 'u3x-no-2', hint: 'The label unrolls to a rectangle as long as the circumference, 2πr: A = 2πrh.' }, { v: 2 * PI * d * h, code: 'u3t-d-as-r', hint: isR ? 'Use r = ' + N(rr) + '.' : 'Halve the diameter: r = ' + N(rr) + '.' }, { v: A0 + 2 * PI * rr * rr, code: 'u3t-extra-face', hint: 'A label covers only the side, not the top and bottom.' }, { v: PI * rr * rr * h, code: 'u3t-volume', hint: 'That’s the volume. The label is the curved side: 2πrh.' }],
      sol: br([isR ? '' : t('r=' + d + '\\div 2=' + N(rr)), t('A=2\\pi rh=2\\times\\pi\\times ' + N(rr) + '\\times ' + h + eqR(A0, 1) + uT(u + '²'))]), hints: ['The label unrolls into a rectangle: circumference × height.', 'A = 2πrh.'], text: 'label of a can' });
  }
  function l11q4(r) {
    if (r.chance(0.5)) {
      var rr = q(r.int(2, 5) / 10), h = pickR(r, 1.2, 2.5, 0.1), s = q(rr + pickR(r, 0.2, 0.6, 0.1)), Ar = PI * rr * rr + 2 * PI * rr * h + PI * rr * s;
      return numPart('A giant crayon for a school display is a cylinder with a cone on top. The cylinder has a radius of ' + L(rr, 'm') + ' and a height of ' + L(h, 'm') + '. The cone has the same radius and a slant height of ' + L(s, 'm') + '. Every outside surface gets painted, including the flat bottom. Find the area to paint, to the nearest hundredth.', Ar, { dp: 2, after: 'm²', p314: 3.14 * rr * rr + 2 * 3.14 * rr * h + 3.14 * rr * s,
        diag: [{ v: Ar + PI * rr * rr, code: 'u3t-extra-face', hint: 'The top of the cylinder is covered by the cone: there is only <b>one</b> circle, the bottom.' }, { v: Ar - PI * rr * rr, code: 'u3t-no-base', hint: 'The flat bottom is painted too: add πr².' }, { v: Ar + 2 * PI * rr * rr, code: 'u3t-extra-face', hint: 'Only the bottom circle shows: the cone covers the cylinder’s top, and the cone has no base of its own outside.' }, { v: PI * rr * rr + PI * rr * h + PI * rr * s, code: 'u3x-no-2', hint: 'The cylinder’s side is 2πrh.' }],
        sol: br(['Bottom: ' + t('\\pi r^2=\\pi\\times ' + N(rr) + '^2' + eqR(PI * rr * rr, 4)) + ' m²', 'Cylinder side: ' + t('2\\pi rh=2\\times\\pi\\times ' + N(rr) + '\\times ' + N(h) + eqR(2 * PI * rr * h, 4)) + ' m²', 'Cone: ' + t('\\pi rs=\\pi\\times ' + N(rr) + '\\times ' + N(s) + eqR(PI * rr * s, 4)) + ' m²', 'Total: ' + t(N(rd(PI * rr * rr, 4)) + '+' + N(rd(2 * PI * rr * h, 4)) + '+' + N(rd(PI * rr * s, 4)) + eqR(Ar, 2)) + ' m²']),
        hints: ['Which surfaces show? The bottom circle, the cylinder’s side and the cone’s curved side.', 'Bottom πr², side 2πrh, cone πrs. Add them.'], text: 'giant crayon' });
    }
    var d = r.int(20, 40), rp = d / 2, hp = r.int(18, 40), Ap = PI * rp * rp + 2 * PI * rp * hp;
    return numPart('A metal pail has a bottom but no lid. It is ' + L(d, 'cm') + ' across and ' + L(hp, 'cm') + ' tall. How much metal is in the pail, to the nearest square centimetre?' + solid('cylinder', { d: d + ' cm', h: hp + ' cm' }), Ap, { dp: 0, after: 'cm²', p314: 3.14 * rp * rp + 2 * 3.14 * rp * hp,
      diag: [{ v: Ap + PI * rp * rp, code: 'u3t-extra-face', hint: 'The pail has <b>no lid</b>: only one circle.' }, { v: 2 * PI * rp * hp, code: 'u3t-side-only', hint: 'Add the bottom.' }, { v: PI * d * d + 2 * PI * d * hp, code: 'u3t-d-as-r', hint: 'Halve the diameter: r = ' + N(rp) + ' cm.' }, { v: PI * rp * rp * hp, code: 'u3t-volume', hint: 'That’s the volume. Add the bottom and the side.' }],
      sol: br(['r = ' + t(d + '\\div 2=' + N(rp)) + ' cm', 'Bottom: ' + t('\\pi\\times ' + N(rp) + '^2' + eqR(PI * rp * rp, 2)) + '; side: ' + t('2\\times\\pi\\times ' + N(rp) + '\\times ' + hp + eqR(2 * PI * rp * hp, 2)), 'Metal: ' + t(N(rd(PI * rp * rp, 2)) + '+' + N(rd(2 * PI * rp * hp, 2)) + eqR(Ap, 0)) + ' cm²']),
      hints: ['Open at one end: 1 circle + the side.', 'SA = πr² + 2πrh.'], text: 'pail with no lid' });
  }
  HW.defineExit({ lesson: 'u3l11', outcome: 'M4', calc: true, blurb: 'Surface area of cylinders, pyramids and cones: a label, a closed cylinder, a square pyramid or cone, and a crayon or pail.',
    questions: [Q(1, 'M4', 'BEG', l11q1, 'The label of a can'), Q(2, 'M4', 'PRG', function (r) { return A.solidPart(r, { kinds: ['cyl'] }); }, 'A closed cylinder'), Q(3, 'M4', 'PRG', function (r) { return A.solidPart(r, { kinds: ['pyr', 'cone'] }); }, 'A square pyramid or a cone'), Q(4, 'M4', 'MAS', l11q4, 'A giant crayon or a pail')] });
})(window);
