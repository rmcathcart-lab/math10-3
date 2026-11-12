/* Math 10-3 · Unit 6 (Similarity and Scale) — exit slips for Lessons 1–6 (u6l1x … u6l6x), written in test mode. Calculator
 * allowed (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core skill — Beginning,
 * Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student. One outcome: every part is G3.
 *   6.1 the scale factor and enlargement / reduction · the scale factor when the units differ (an enlargement as a decimal,
 *       a model as 1/n) · similar figures (turned or flipped): k, a new side and an original side · a giant pennant: its
 *       long side and the cost of trim around it
 *   6.2 is a print similar to a photo (long ÷ short, yes / no) · regular polygons: each angle and k · two rectangles, one
 *       turned: short ÷ short, long ÷ long, similar? · a mat border: the outside, and a similar outside
 *   6.3 a copy's side and angle · the grid method (the move between two corners of the copy) · the projection method and a
 *       classmate's mistake (measuring past A instead of from O) · the largest similar enlargement that fits a sheet
 *   6.4 a scale in words as a ratio · a map at 1 : n, both ways · a ratio scale that is not 1 : n (an enlargement n : 1, a
 *       model 3 : 100) · a route on a scale map: the real length and the time it takes
 *   6.5 the AA test · similar triangles: a missing side to the nearest tenth · nested triangles: a side and a piece ·
 *       nested triangles backwards: the two pieces of a side
 *   6.6 the shadow method · the mirror method · stakes across a river · the mirror method, then where a second person stands
 * No multiple choice. Measuring on the page becomes labelled drawings, as on the test. Shared helpers and the u6t- codes come
 * from the Unit 6 test (HW.u6assess, js/lessons/u6test.js, which loads first); several slips use the test's own generators
 * with new numbers. Codes only the slips use are u6x-, with labels and partial-credit decisions below. Drawing by hand on
 * grid paper or with a protractor is not on the slips: the copy's lengths, moves and distances are asked instead. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, G = HW.geo;
  var A = HW.u6assess;
  if (!A) throw new Error('js/exits/u6.js needs HW.u6assess from js/lessons/u6test.js: load it first');
  var rd = A.rd, q = A.q, N = A.N, U = A.U, MM = A.MM, c2 = A.c2, toN = A.toN, toM = A.toM, fx = A.fx, places = A.places, find = A.find, br = A.br, cap = A.cap, aN = A.aN, pickR = A.pickR, person = A.person,
    num = A.num, fld = A.fld, fieldsPart = A.fieldsPart, kChk = A.kChk, kKey = A.kKey, lenFld = A.lenFld, lenPart = A.lenPart, yesNoFld = A.yesNoFld, Fig = A.Fig;

  HW.addCodes({
    'u6x-k-decimal': 'Gave k as a decimal, not 1/n', 'u6x-cm-price': 'Priced the trim in centimetres, not metres', 'u6x-perim-one': 'Perimeter: counted the long side once',
    'u6x-small-perim': 'Used the small pennant’s perimeter', 'u6x-amir-k': 'Gave the scale factor he was told, not the one he used', 'u6x-gave-h': 'Gave the time in hours, not minutes',
    'u6x-gave-other': 'Gave the other piece of the side', 'u6x-stake-whole': 'Stakes: used the whole bank distance (AB + BC)'
  });
  HW.addPartial({ 'u6x-cm-price': 'b', 'u6x-perim-one': 'b', 'u6x-small-perim': 'b', 'u6x-amir-k': 'n', 'u6x-gave-h': 'b', 'u6x-gave-other': 'b', 'u6x-stake-whole': 'b' });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }

  /* =====================================================================================================
   * 6.1 Similar polygons and scale factor
   * ===================================================================================================== */
  /* the scale factor when the units differ: an enlargement (a decimal) or a model (1/n) */
  var ENL = [['A school logo is', 'wide on a letter. On a banner in the gym, the logo is', 'wide', [4, 8, 0.5], [0.6, 2.4, 0.1]], ['A cookie cutter is', 'wide. A giant cookie-shaped sign for a bakery is', 'wide', [5, 8, 0.5], [1, 2, 0.1]],
    ['A sticker is', 'tall. A mural copied from it is', 'tall', [3, 6, 0.5], [0.9, 2.7, 0.1]]];
  var RED = [['canoe', [3.6, 5.4, 0.3]], ['pickup truck', [5.4, 6, 0.06]], ['sailboat', [6, 9, 0.5]], ['school bus', [10.8, 12.6, 0.24]]];
  function l1q2(r) {
    if (r.chance(0.5)) {
      var e = r.pick(ENL), s = find(function () { return { a: pickR(r, e[3]), b: pickR(r, e[4]) }; }, function (s) { var k = s.b * 100 / s.a; return places(q(k)) <= 2 && k >= 8; });
      var k = q(s.b * 100 / s.a), key = kKey(k);
      return { prompt: e[0] + ' ' + U(s.a, 'cm') + ' ' + e[2] + '. ' + e[1] + ' ' + U(s.b, 'm') + ' ' + e[2] + '. Find the scale factor from the small one to the big one.', input: { type: 'number', before: t('k=') },
        check: kChk(k, { diag: [{ v: s.b / s.a, code: 'u6t-k-unit', hint: 'Change to the same unit first: ' + N(s.b) + ' m = ' + N(q(s.b * 100)) + ' cm.' }, { v: s.b * 1000 / s.a, code: 'u6t-unit-way', hint: '1 m = 100 cm (not 1000).' }] }),
        key: key, answer: t('k=' + HW.fmt(key)), bad: [nS2(s.b / s.a), nS2(s.a / (s.b * 100))],
        solution: br(['Same units first: ' + t(N(s.b) + '\\text{ m}=' + N(q(s.b * 100)) + '\\text{ cm}'), t('k=\\dfrac{\\text{new}}{\\text{original}}=\\dfrac{' + N(q(s.b * 100)) + '}{' + N(s.a) + '}=' + N(k)) + ' (an enlargement)']),
        hints: ['Change metres to centimetres first (× 100).', 'k = new ÷ original.'], text: 'k with a unit change (enlargement)' };
    }
    var m = r.pick(RED), s2 = find(function () { return { L: pickR(r, m[1]), n: r.pick([24, 30, 32, 40, 48, 60, 64, 20]) }; }, function (s) { var toy = s.L * 100 / s.n; return places(q(toy)) <= 2 && toy >= 6; });
    var toy = q(s2.L * 100 / s2.n), p = num('A real ' + m[0] + ' is ' + U(s2.L, 'm') + ' long. A toy model of it is ' + U(toy, 'cm') + ' long. Find the scale factor from the real ' + m[0] + ' to the toy, as a fraction with 1 on top.', s2.n, {
      before: t('k=\\dfrac{1}{\\phantom{0}}') + ' bottom number:', unit: '', dp: 2, noPlaces: true, nudge: [{ v: 1 / s2.n, code: 'u6x-k-decimal', hint: 'Right size — now write it as 1 over a whole number: type just the bottom number.' }],
      diag: [{ v: s2.L / toy, code: 'u6t-k-unit', hint: 'Change ' + N(s2.L) + ' m to centimetres first (× 100).' }, { v: toy / s2.L, code: 'u6t-k-unit', hint: 'Change ' + N(s2.L) + ' m to centimetres first (× 100).' }, { v: s2.L * 1000 / toy, code: 'u6t-unit-way', hint: '1 m = 100 cm (not 1000).' }],
      sol: br(['Same units: ' + t(N(s2.L) + '\\text{ m}=' + N(q(s2.L * 100)) + '\\text{ cm}'), t('k=\\dfrac{' + N(toy) + '}{' + N(q(s2.L * 100)) + '}') + '. Flip it to see it better: ' + t(N(q(s2.L * 100)) + '\\div ' + N(toy) + '=' + s2.n) + ', so ' + t('k=\\dfrac{1}{' + s2.n + '}') + ' (a reduction).']),
      hints: ['Change metres to centimetres first.', 'k = toy ÷ real. How many times does the toy fit into the real length?'], text: 'k with a unit change (model 1/n)' });
    p.answer = t('k=\\dfrac{1}{' + s2.n + '}');
    return p;
  }
  function nS2(x) { return String(rd(x, 4)); }
  /* a giant pennant: its long side and the cost of the trim */
  function l1q4(r) {
    var s = find(function () { var a = pickR(r, [20, 40, 2]), b = pickR(r, [8, 16, 1]), k = r.pick([2.5, 3, 3.5, 4, 4.5, 5, 6]), pr = q(r.int(149, 399) / 100); return { a: a, b: b, k: k, B: q(b * k), A: q(a * k), pr: pr }; }, function (s) { return s.a > s.b + 6; });
    var P = 2 * s.A + s.B, cost = P / 100 * s.pr;
    var specs = [fld('Long side:', s.A, { dp: 2, noPlaces: true, after: 'cm', name: 'Long side', diag: [{ v: s.a + s.B - s.b, code: 'u6t-prop-add', hint: 'Similar figures <b>multiply</b> every side by the same k; don’t add the same amount.' }, { v: s.a / s.k, code: 'u6t-k-way', hint: 'The giant pennant is bigger: multiply by k.' }] }),
      fld('Cost of trim:', cost, { money: true, name: 'Cost', diag: [{ v: P * s.pr, code: 'u6x-cm-price', hint: 'The price is per <b>metre</b>: change the perimeter to metres (÷ 100).' }, { v: (s.A + s.B) / 100 * s.pr, code: 'u6x-perim-one', hint: 'The trim goes all the way around: two long sides and the short side.' }, { v: (2 * s.a + s.b) / 100 * s.pr, code: 'u6x-small-perim', hint: 'Use the <b>giant</b> pennant’s sides.' }] })];
    return fieldsPart('A team pennant is a triangle with sides ' + s.a + ' cm, ' + s.a + ' cm and ' + s.b + ' cm. The team orders a similar giant pennant for the arena. Its short side is ' + U(s.B, 'cm') + '. (a) How long is each long side of the giant pennant? (b) Gold trim goes all the way around the giant pennant. The trim costs ' + MM(s.pr) + ' per metre. Find the cost of the trim before tax.', specs,
      br(['(a) ' + t('k=' + N(s.B) + '\\div ' + s.b + '=' + N(s.k)) + '; long sides ' + t(s.a + '\\times ' + N(s.k) + '=' + N(s.A)) + ' cm each', '(b) Perimeter: ' + t(N(s.A) + '+' + N(s.A) + '+' + N(s.B) + '=' + N(q(P))) + ' cm ' + t('=' + N(q(P / 100))) + ' m',
        'Cost: ' + t(N(q(P / 100)) + '\\times\\$' + c2(s.pr) + toM(cost))]),
      ['Find k from the short sides (new ÷ original).', 'Perimeter in metres × the price per metre.'], 'giant pennant');
  }
  HW.defineExit({ lesson: 'u6l1', outcome: 'G3', calc: true, blurb: 'Similar polygons and the scale factor: k from two lengths, k with a unit change, missing sides of similar figures, and a giant pennant.',
    questions: [Q(1, 'G3', 'BEG', function (r) { return A.kTypePart(r); }, 'Scale factor and type'), Q(2, 'G3', 'PRG', l1q2, 'Scale factor with a unit change'),
      Q(3, 'G3', 'PRG', function (r) { return A.simFigPart(r); }, 'Similar figures: k and two sides'), Q(4, 'G3', 'MAS', l1q4, 'A giant pennant: side and trim cost')] });

  /* =====================================================================================================
   * 6.2 Are they similar?
   * ===================================================================================================== */
  /* two rectangles, the second written long side first: short ÷ short, long ÷ long, similar? */
  function l2q3(r) {
    var sim = r.chance(0.5), p = person(r);
    var s = find(function () {
      var s1 = pickR(r, [4, 30, 1]), L1 = pickR(r, [s1 + 3, s1 * 2.5, 1]), k = r.pick([1.25, 1.5, 2, 2.5, 0.75, 1.2, 0.8, 3]);
      var s2 = q(s1 * k), L2 = sim ? q(L1 * k) : q(L1 * k + r.pick([-4, -3, -2, 2, 3, 5, 6]));
      return { s1: s1, L1: L1, s2: s2, L2: L2, k: k };
    }, function (s) { return s.L2 > s.s2 + 1 && places(s.s2) <= 1 && places(s.L2) <= 1 && (sim || Math.abs(rd(s.L2 / s.L1, 2) - rd(s.s2 / s.s1, 2)) >= 0.02) && Math.abs(rd(s.L2 / s.s1, 2) - rd(s.s2 / s.s1, 2)) > 0.02; });
    var rs = s.s2 / s.s1, rl = s.L2 / s.L1;
    var specs = [fld('Short ÷ short:', rs, { dp: 2, noPlaces: places(rs) <= 2, name: 'Short ratio', diag: [{ v: s.L2 / s.s1, code: 'u6t-ratio-mix', hint: 'Match <b>short with short</b>: ' + N(s.s2) + ' is the short side of the second rectangle.' }, { v: s.s1 / s.s2, code: 'u6t-ratio-flip', hint: 'Second rectangle ÷ first, the same way every time.' }] }),
      fld('Long ÷ long:', rl, { dp: 2, noPlaces: places(rl) <= 2, name: 'Long ratio', diag: [{ v: s.s2 / s.L1, code: 'u6t-ratio-mix', hint: 'Match <b>long with long</b>: ' + N(s.L2) + ' is the long side of the second rectangle.' }, { v: s.L1 / s.L2, code: 'u6t-ratio-flip', hint: 'Second rectangle ÷ first, the same way every time.' }] }),
      yesNoFld('Similar?', sim, 'Similar only if the two ratios are equal.', 'u6t-sim-verdict')];
    return fieldsPart(p.n + ' checks whether ' + aN(s.s1) + ' ' + U(s.s1, 'cm') + ' by ' + U(s.L1, 'cm') + ' rectangle and ' + aN(s.L2) + ' ' + U(s.L2, 'cm') + ' by ' + U(s.s2, 'cm') + ' rectangle are similar. Divide (second rectangle ÷ first) short side by short side and long side by long side, to 2 decimal places if needed. Are they similar?', specs,
      br(['The second rectangle is written long side first: its short side is ' + N(s.s2) + ' cm and its long side is ' + N(s.L2) + ' cm.', 'Short: ' + t(N(s.s2) + '\\div ' + N(s.s1) + toN(rs, 2)) + '. Long: ' + t(N(s.L2) + '\\div ' + N(s.L1) + toN(rl, 2)) + '.',
        sim ? 'Equal, so the rectangles <b>are</b> similar (' + t('k=' + N(s.k)) + ').' : 'Not equal, so the rectangles are <b>not</b> similar.']),
      ['Match short with short and long with long, even if a rectangle is turned.', 'The same number both times means similar.'], 'two rectangles, one turned');
  }
  HW.defineExit({ lesson: 'u6l2', outcome: 'G3', calc: true, blurb: 'Are they similar? A print and a photo, regular polygons, two rectangles (one turned), and a mat border.',
    questions: [Q(1, 'G3', 'BEG', function (r) { return A.rectSimPart(r); }, 'Is the print similar?'), Q(2, 'G3', 'PRG', function (r) { return A.regPolyPart(r); }, 'Regular polygons: angle and k'),
      Q(3, 'G3', 'PRG', l2q3, 'Two rectangles, one turned'), Q(4, 'G3', 'MAS', function (r) { return A.framePart(r); }, 'A mat border and a similar outside')] });

  /* =====================================================================================================
   * 6.3 Drawing enlargements and reductions
   * ===================================================================================================== */
  /* the projection method and a classmate's mistake */
  function l3q3(r) {
    var p = person(r), k = r.pick([2, 3, 4, 2.5]), a = find(function () { return pickR(r, [1.5, 4, 0.5]); }, function (x) { return places(q(x * k)) <= 2; });
    var right = q(a * k), his = q(a + a * k), used = q(1 + k);
    var specs = [lenFld('O to A′ (correct):', right, { dp: 2, unit: 'cm', name: 'Correct OA′', scale: { len: a, k: k, op: 'mul' }, alts: [{ v: his, code: 'u6t-proj-past', hint: 'Measure from <b>O</b>: ' + t("OA'=k\\times OA") + '.' }] }),
      fld('O to ' + p.his + ' point:', his, { dp: 2, noPlaces: true, after: 'cm', name: 'His point', diag: [{ v: right, code: 'u6t-proj-o', hint: p.n + ' marked the point ' + N(right) + ' cm <b>past A</b>, and A is ' + N(a) + ' cm from O.' }, { v: a * k * k, code: 'value', hint: 'Add: OA + the distance past A.' }] }),
      fld(t('k') + ' ' + p.he + ' really used:', used, { dp: 2, noPlaces: true, name: 'k used', diag: [{ v: k, code: 'u6x-amir-k', hint: 'That is the k ' + p.he + ' was told. Divide ' + p.his + ' distance from O by OA.' }] })];
    return fieldsPart(p.n + ' uses the projection method with centre O and ' + t('k=' + N(k)) + '. Corner A is ' + U(a, 'cm') + ' from O. ' + cap(p.he) + ' marks A′ on the ray, ' + U(right, 'cm') + ' <b>past A</b>. (a) How far from O should A′ be? (b) How far from O is ' + p.his + ' point? (c) What scale factor did ' + p.he + ' really use?', specs,
      br(['(a) Measure from O: ' + t("OA'=" + N(k) + '\\times ' + N(a) + '=' + N(right)) + ' cm', '(b) ' + p.his.replace(/^./, function (c) { return c.toUpperCase(); }) + ' point is ' + t(N(a) + '+' + N(right) + '=' + N(his)) + ' cm from O.', '(c) ' + t(N(his) + '\\div ' + N(a) + '=' + N(used)) + ': ' + p.he + ' really used ' + t('k=' + N(used)) + '.']),
      ['Every distance in the projection method is measured from O.', 'The scale factor used = distance from O ÷ OA.'], 'projection: a mistake');
  }
  HW.defineExit({ lesson: 'u6l3', outcome: 'G3', calc: true, blurb: 'Drawing enlargements and reductions: a copy’s side and angle, the grid method, the projection method (and a mistake), and the largest copy that fits.',
    questions: [Q(1, 'G3', 'BEG', function (r) { return A.copyPart(r); }, 'A copy: side and angle'), Q(2, 'G3', 'PRG', function (r) { return A.gridPart(r); }, 'Grid method: a move'),
      Q(3, 'G3', 'PRG', l3q3, 'Projection method: a mistake'), Q(4, 'G3', 'MAS', function (r) { return A.fitPart(r); }, 'The largest copy that fits')] });

  /* =====================================================================================================
   * 6.4 Scale diagrams: maps and floor plans
   * ===================================================================================================== */
  /* a ratio scale that is not 1 : n */
  function l4q3(r) {
    var v = r.int(0, 2);
    if (v === 0) {
      var a = r.pick([4, 5, 8, 10, 20]), d = find(function () { return pickR(r, [2, 9, 0.1]); }, function (x) { return places(q(x * 10 / a)) <= 2; }), ans = q(d * 10 / a), what = r.pick(['a watch gear', 'a computer chip', 'a ladybug', 'a seed']);
      return lenPart('A science book shows ' + what + ' at a scale of ' + t(a + ':1') + '. In the picture it is ' + U(d, 'cm') + ' across. How wide is the real ' + what.replace(/^an? /, '') + ', in millimetres?', ans, { dp: 2, unit: 'mm',
        alts: [{ v: d / a, code: 'u6t-unit-cm', hint: 'That is in centimetres. Change it to millimetres: × 10.' }, { v: d * a * 10, code: 'u6t-scale-way', hint: 'At ' + a + ' : 1 the picture is <b>bigger</b> than the real thing: divide by ' + a + '.' }],
        sol: br([t('\\dfrac{' + a + '}{1}=\\dfrac{' + N(d) + '}{x}') + ', so ' + t('x=' + N(d) + '\\div ' + a + '=' + N(q(d / a))) + ' cm', t(N(q(d / a)) + '\\times 10=' + N(ans)) + ' mm']), hints: ['picture : real = ' + a + ' : 1, so the real one is smaller.', '1 cm = 10 mm.'], text: 'enlargement scale' });
    }
    var sc = r.pick([[3, 100], [1, 50], [2, 75], [1, 40], [3, 200]]), real = v === 1;
    if (real) {
      var mod = find(function () { return pickR(r, [9, 60, 1]); }, function (x) { return places(q(x * sc[1] / sc[0] / 100)) <= 2; }), ansR = q(mod * sc[1] / sc[0] / 100);
      return lenPart('A model sailboat is built at a scale of ' + t(sc[0] + ':' + sc[1]) + ' (model : real). The model is ' + U(mod, 'cm') + ' long. How long is the real boat, in metres?', ansR, { dp: 2, unit: 'm',
        alts: [{ v: ansR * 100, code: 'u6t-unit-cm', hint: 'That is in centimetres. Change it to metres: ÷ 100.' }, { v: mod * sc[0] / sc[1] / 100, code: 'u6t-scale-way', hint: 'The real boat is bigger than the model.' }, { v: mod * sc[1] / 100, code: 'value', hint: 'Use the whole ratio: ' + sc[0] + ' cm on the model stands for ' + sc[1] + ' cm.' }],
        sol: br([t('\\dfrac{' + sc[0] + '}{' + sc[1] + '}=\\dfrac{' + N(mod) + '}{x}') + ', so ' + t(sc[0] + 'x=' + N(q(mod * sc[1]))) + ' and ' + t('x=' + N(q(mod * sc[1] / sc[0]))) + ' cm', t('=' + N(ansR)) + ' m']),
        hints: ['Write a proportion: model over real on both sides.', 'Change cm to m at the end (÷ 100).'], text: 'model scale a : b (real)' });
    }
    var mast = find(function () { return pickR(r, [4, 16, 0.5]); }, function (x) { return places(q(x * 100 * sc[0] / sc[1])) <= 1; }), ansM = q(mast * 100 * sc[0] / sc[1]);
    return lenPart('A model sailboat is built at a scale of ' + t(sc[0] + ':' + sc[1]) + ' (model : real). The real mast is ' + U(mast, 'm') + ' tall. How tall is the model’s mast, in centimetres?', ansM, { dp: 1, unit: 'cm',
      alts: [{ v: mast * sc[0] / sc[1], code: 'u6t-no-unit', hint: 'Change the real mast to centimetres first (× 100).' }, { v: mast * 100 * sc[1] / sc[0], code: 'u6t-scale-way', hint: 'The model is smaller than the real boat.' }],
      sol: br([t(N(mast) + '\\text{ m}=' + N(q(mast * 100)) + '\\text{ cm}'), t('\\dfrac{' + sc[0] + '}{' + sc[1] + '}=\\dfrac{x}{' + N(q(mast * 100)) + '}') + ', so ' + t('x=' + N(q(mast * 100)) + '\\times ' + sc[0] + '\\div ' + sc[1] + '=' + N(ansM)) + ' cm']),
      hints: ['Same units: change metres to centimetres.', 'Write a proportion: model over real on both sides.'], text: 'model scale a : b (model)' });
  }
  /* a route on a scale map: the real length and the time it takes */
  var SCALES = [['1 cm : 200 m', 0.2], ['1 cm : 250 m', 0.25], ['1 cm : 0.5 km', 0.5], ['1 cm : 100 m', 0.1], ['1 cm : 1 km', 1]];
  function l4q4(r) {
    var sc = r.pick(SCALES), p = person(r), mode = sc[1] >= 0.5 ? r.pick([['bikes', 15], ['bikes', 12], ['walks', 5]]) : r.pick([['walks', 5], ['walks', 4], ['jogs', 8]]);
    var s = find(function () {
      var pts = [[pickR(r, [0.8, 2, 0.1]), pickR(r, [1.4, 5.6, 0.1])]], Ls = [];
      for (var i = 0; i < 3; i++) { var L = pickR(r, [2.4, 4.2, 0.1]), d = r.pick([0, 0, 20, -20, 30, -30, 40, -40]) * Math.PI / 180, P = pts[i]; pts.push([P[0] + L * Math.cos(d), P[1] + L * Math.sin(d)]); Ls.push(L); }
      return { pts: pts, Ls: Ls };
    }, function (s) { var mm = (s.Ls[0] + s.Ls[1] + s.Ls[2]) * sc[1] / mode[1] * 60; return s.pts.every(function (P) { return P[0] >= 0.6 && P[0] <= 11.4 && P[1] >= 1.3 && P[1] <= 6.4 && !(P[0] < 1.4 && P[1] > 4.6); }) && s.pts[3][0] - s.pts[0][0] > 4 && Math.abs(mm - Math.floor(mm) - 0.5) > 0.08; });
    var tot = q(s.Ls[0] + s.Ls[1] + s.Ls[2]), km = q(tot * sc[1]), mins = km / mode[1] * 60, nm = ['T', 'A', 'B', 'C'];
    var svg = G.scaleMapSVG({ scale: sc[0], w: 12, h: 7, places: nm.map(function (n, i) { return { name: n, at: s.pts[i] }; }), routes: [0, 1, 2].map(function (i) { return { from: nm[i], to: nm[i + 1], label: N(s.Ls[i]) + ' cm' }; }), width: 420 });
    var specs = [lenFld('Trail length:', km, { dp: places(km) <= 2 ? 2 : 3, unit: 'km', name: 'Trail length', alts: [{ v: km * 1000, code: 'u6t-unit-way', hint: 'That is in metres. Give kilometres (÷ 1000).' }, { v: tot, code: 'u6t-no-unit', hint: 'That is the length on the map. Multiply by ' + N(sc[1]) + ' km per cm.' }] }),
      fld('Time:', mins, { dp: 0, after: 'min', name: 'Time', diag: [{ v: km / mode[1], code: 'u6x-gave-h', hint: 'That is in hours. Multiply by 60 to get minutes.' }, { v: mode[1] / km * 60, code: 'value', hint: 'time = distance ÷ speed.' }] })];
    return fieldsPart('This trail map is drawn to scale (' + sc[0].replace(':', 'represents') + '). The trail goes from the trailhead T past A and B to C. The map lengths of the three straight parts are marked. (a) How long is the real trail from T to C, in km? (b) ' + p.n + ' ' + mode[0] + ' it at about ' + mode[1] + ' km/h. About how many minutes does it take, to the nearest minute?' + svg, specs,
      br(['(a) Map total: ' + t(s.Ls.map(N).join('+') + '=' + N(tot)) + ' cm; real: ' + t(N(tot) + '\\times ' + N(sc[1]) + '=' + N(km)) + ' km', '(b) time = distance ÷ speed: ' + t(N(km) + '\\div ' + mode[1] + toN(km / mode[1], 4)) + ' h; ' + t('\\times 60' + toN(mins, 0)) + ' min']),
      ['Add the map lengths first, then change the total to a real length once.', 'Hours × 60 = minutes.'], 'route on a scale map');
  }
  HW.defineExit({ lesson: 'u6l4', outcome: 'G3', calc: true, blurb: 'Scale diagrams: a scale as a ratio, a map both ways, model and enlargement scales, and a trail on a scale map.',
    questions: [Q(1, 'G3', 'BEG', function (r) { return A.scaleRatioPart(r); }, 'A scale as a ratio'), Q(2, 'G3', 'PRG', function (r) { return A.mapBothPart(r); }, 'A map both ways'),
      Q(3, 'G3', 'PRG', l4q3, 'Model and enlargement scales'), Q(4, 'G3', 'MAS', l4q4, 'A trail: length and time')] });

  /* =====================================================================================================
   * 6.5 Similar triangles
   * ===================================================================================================== */
  /* nested triangles backwards: the two pieces of a side */
  function l5q4(r) {
    var nm = r.pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T'], ['K', 'L', 'M', 'N', 'P']]), u = r.pick(['m', 'cm']);
    var s = find(function () { return { DE: pickR(r, [2, 9, 0.5]), BC: pickR(r, [5, 14, 0.5]), AB: pickR(r, [6, 18, 0.5]) }; },
      function (s) { var AD = s.AB * s.DE / s.BC; return s.BC > s.DE + 1.5 && s.DE / s.BC > 0.25 && s.DE / s.BC < 0.8 && Math.abs(AD * 10 - Math.floor(AD * 10) - 0.5) > 0.06 && Math.abs((s.AB - AD) * 10 - Math.floor((s.AB - AD) * 10) - 0.5) > 0.06; });
    var AD = s.AB * s.DE / s.BC, DB = s.AB - AD, sd = function (a, b) { return nm[a] + nm[b]; };
    var svg = A.nestedSVG(nm, s.DE / s.BC, { AD: '?', DB: '?', DE: N(s.DE) + ' ' + u, BC: N(s.BC) + ' ' + u });
    var specs = [lenFld(t(sd(0, 3)) + ' =', AD, { dp: 1, unit: u, name: sd(0, 3), prop: { given: s.AB, num: s.DE, den: s.BC } }),
      lenFld(t(sd(3, 1)) + ' =', DB, { dp: 1, unit: u, name: sd(3, 1), alts: [{ v: AD, code: 'u6x-gave-other', hint: 'That is ' + sd(0, 3) + '. ' + sd(3, 1) + ' is the rest of the side: ' + sd(0, 1) + ' − ' + sd(0, 3) + '.' }, { v: s.AB * s.BC / s.DE - s.AB, code: 'u6t-prop-flip', hint: sd(0, 3) + ' is in the <b>small</b> triangle, so it is shorter than ' + sd(0, 1) + '.' }] })];
    return fieldsPart('In ' + t('\\triangle ' + nm[0] + nm[1] + nm[2]) + ', ' + t(sd(3, 4) + '\\parallel ' + sd(1, 2)) + '. ' + t(sd(3, 4) + '=' + N(s.DE)) + ', ' + t(sd(1, 2) + '=' + N(s.BC)) + ' and the whole side ' + t(sd(0, 1) + '=' + N(s.AB)) + ' (in ' + u + '). Find ' + t(sd(0, 3)) + ' and ' + t(sd(3, 1)) + ' to the nearest tenth.' + svg, specs,
      br(['△' + nm[0] + nm[3] + nm[4] + ' ∼ △' + nm[0] + nm[1] + nm[2] + ', so ' + sd(0, 3) + ' ↔ ' + sd(0, 1) + ' and ' + sd(3, 4) + ' ↔ ' + sd(1, 2) + '.', t('\\dfrac{' + sd(0, 3) + '}{' + N(s.AB) + '}=\\dfrac{' + N(s.DE) + '}{' + N(s.BC) + '}') + ', so ' + t(sd(0, 3) + '=' + N(s.AB) + '\\times ' + N(s.DE) + '\\div ' + N(s.BC) + toN(AD, 1)),
        t(sd(3, 1) + '=' + N(s.AB) + '-' + fx(AD, 2) + toN(DB, 1))]),
      ['The small triangle’s side ' + sd(0, 3) + ' matches the whole side ' + sd(0, 1) + '.', 'Then the other piece is what is left of ' + sd(0, 1) + '.'], 'nested triangles backwards');
  }
  HW.defineExit({ lesson: 'u6l5', outcome: 'G3', calc: true, blurb: 'Similar triangles: the AA test, a missing side by a proportion, and nested triangles both ways.',
    questions: [Q(1, 'G3', 'BEG', function (r) { return A.aaPart(r); }, 'AA test'), Q(2, 'G3', 'PRG', function (r) { return A.triSidePart(r); }, 'A missing side'),
      Q(3, 'G3', 'PRG', function (r) { return A.nestedPart(r); }, 'Nested triangles'), Q(4, 'G3', 'MAS', l5q4, 'Nested triangles backwards')] });

  /* =====================================================================================================
   * 6.6 Indirect measurement
   * ===================================================================================================== */
  /* stakes across a river: T on the far bank, A straight across, B and C along the bank, D straight back from C */
  function riverSVG(w, ab, bc, cd, lab) {
    var fg = new Fig(), sc = 300 / (ab + bc), W = w * sc, T = [0, 0], Av = [0, W], B = [ab * sc, W], C = [(ab + bc) * sc, W], D = [(ab + bc) * sc, W + cd * sc];
    fg.path('M-30 4H' + (C[0] + 30) + 'V' + (W - 4) + 'H-30Z', { fill: '#cfe3f7' }, [[-30, 4], [C[0] + 30, W - 4]]);
    fg.line([-30, 4], [C[0] + 30, 4], { color: '#7a9cc0', width: 1.6 }).line([-30, W - 4], [C[0] + 30, W - 4], { color: '#7a9cc0', width: 1.6 });
    fg.line(T, Av, { dash: '5 4' }).line(Av, C).line(C, D).line(T, D, { color: A.BLUE, width: 2 });
    fg.right(Av, T, B).right(C, B, D);
    [T, Av, B, C, D].forEach(function (P) { fg.dot(P); });
    fg.text(-14, 0, 'T', { italic: false }).text(-14, W + 4, 'A', { italic: false }).text(B[0], W + 16, 'B', { italic: false }).text(C[0] + 14, W - 10, 'C', { italic: false }).text(D[0] + 14, D[1], 'D', { italic: false });
    fg.seg(T, Av, B, lab.w).seg(Av, B, T, lab.ab, { inside: true, gap: 4 }).seg(B, C, T, lab.bc, { inside: true, gap: 4 }).seg(C, D, B, lab.cd);
    fg.text(C[0] / 2 + 40, W / 2, 'river', { size: 13, weight: 600, color: '#4a6a90' });
    return fg.svg({ width: 380, aria: 'stakes across a river' });
  }
  function l6q3(r) {
    var p = person(r), wat = r.pick(['river', 'creek', 'the Bow River', 'an irrigation canal']);
    var s = find(function () { return { ab: pickR(r, [18, 48, 1]), bc: pickR(r, [6, 15, 0.5]), cd: pickR(r, [4, 12, 0.1]) }; },
      function (s) { var w = s.cd * s.ab / s.bc; return s.ab > 1.6 * s.bc && w >= 12 && w <= 60 && w / (s.ab + s.bc) < 0.9 && Math.abs(w * 10 - Math.floor(w * 10) - 0.5) > 0.06; });
    var w = s.cd * s.ab / s.bc, wn = wat.replace(/^the |^an /, '');
    return lenPart(p.n + ' uses stakes to find the width ' + t('w') + ' of ' + (/^the|^an/.test(wat) ? wat : 'a ' + wat) + '. T is a tree on the far bank and A is straight across from it. ' + cap(p.he) + ' walks along the bank to B and then C, turns 90° at C and walks away from the water to D, where B lines up with the tree. ' + cap(p.he) + ' measures ' + t('AB=' + N(s.ab)) + ' m, ' + t('BC=' + N(s.bc)) + ' m and ' + t('CD=' + N(s.cd)) + ' m. How wide is the ' + wn + ', to the nearest tenth of a metre?' + riverSVG(w, s.ab, s.bc, s.cd, { w: 'w', ab: N(s.ab) + ' m', bc: N(s.bc) + ' m', cd: N(s.cd) + ' m' }), w, { dp: 1, unit: 'm',
      prop: { given: s.cd, num: s.ab, den: s.bc }, alts: [{ v: s.cd * (s.ab + s.bc) / s.bc, code: 'u6x-stake-whole', hint: 'TA matches DC, and AB matches CB. Use AB = ' + N(s.ab) + ' m, not AB + BC.' }],
      sol: br(['Both triangles have a right angle (at A and at C), and the angles at B are vertically opposite, so △TAB ∼ △DCB.', t('\\dfrac{w}{' + N(s.ab) + '}=\\dfrac{' + N(s.cd) + '}{' + N(s.bc) + '}') + ', so ' + t('w=' + N(s.ab) + '\\times ' + N(s.cd) + '\\div ' + N(s.bc) + toN(w, 1)) + ' m',
        'Check: AB is ' + t(N(s.ab) + '\\div ' + N(s.bc) + toN(s.ab / s.bc, 2)) + ' times BC, so w is that many times CD ✓']),
      hints: ['TA matches DC; AB matches CB.', 'w ÷ AB = CD ÷ CB.'], text: 'stakes across a river' });
  }
  HW.defineExit({ lesson: 'u6l6', outcome: 'G3', calc: true, blurb: 'Indirect measurement: shadows, mirrors, stakes across a river, and where a second person must stand.',
    questions: [Q(1, 'G3', 'BEG', function (r) { return A.shadowPart(r); }, 'Shadow method'), Q(2, 'G3', 'PRG', function (r) { return A.mirrorPart(r); }, 'Mirror method'),
      Q(3, 'G3', 'PRG', l6q3, 'Stakes across a river'), Q(4, 'G3', 'MAS', function (r) { return A.mirror2Part(r); }, 'Mirror method twice')] });
})(window);
