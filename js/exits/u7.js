/* Math 10-3 · Unit 7 (Right Triangles and Trigonometry) — exit slips for Lessons 1–9 (u7l1x … u7l9x), written in test mode.
 * Calculator allowed, in DEG mode (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core
 * skill — Beginning, Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student.
 * Outcomes per part, as on the test: G2 for the Pythagorean theorem, G4 for the trig ratios, elevation / depression and
 * solving triangles, A1 for a side with the unknown on the bottom of the ratio. Lesson 7.1 is the refresher (REV).
 *   7.1 the area of a square (a number squared) · √n between two whole numbers and to the nearest tenth · the third angle
 *       of a triangle and its name (acute, right, obtuse) · a square lawn: the side, the edging and the rolls to buy (REV)
 *   7.2 the hypotenuse (whole or tenths answers) · the hypotenuse to the nearest tenth · a field, screen, guy wire, ramp or
 *       baseball diamond · two snowmobiles heading north and east: how far apart after some minutes (all G2)
 *   7.3 a missing leg (whole or tenths answers) · a ladder, drone, hay elevator or gate brace · is it a right triangle? (the
 *       squares and yes / no) · a pole held by two ropes (two steps, full value kept) (all G2)
 *   7.4 tan θ as a decimal (G4) · opp = adj × tan θ (G4) · adj = opp ÷ tan θ (A1) · a roof pitch against a roof angle: the
 *       two tangents and which roof is steeper (G4)
 *   7.5 sin θ as a decimal (G4) · opp = hyp × sin θ (G4) · hyp = opp ÷ sin θ (A1) · a ladder moved to a steeper angle (how
 *       much higher) or a parasailer on a rope tied above the water (G4)
 *   7.6 cos θ as a decimal (G4) · adj = hyp × cos θ (G4) · hyp = adj ÷ cos θ (A1) · an A-frame tent: the floor width and
 *       whether two sleeping pads fit (G4)
 *   7.7 an angle of depression (from the vertical, or equal to the angle of elevation) (G4) · a height from an angle of
 *       elevation plus the eye height (G4) · a ground distance from an angle of depression, ÷ tan (A1) · a clinometer
 *       reading: the angle of elevation, then the height (G4)
 *   7.8 an angle from a trig ratio (sin⁻¹, cos⁻¹, tan⁻¹) · an angle from two sides and the other acute angle · an angle
 *       in a story · a ladder: its angle with the ground, and where the foot goes for 75° (all G4)
 *   7.9 which tool (sin, cos, tan or Pythagoras: a word) · solve a triangle from an angle and the hypotenuse · solve a
 *       triangle from an angle and a leg · two right triangles that share a side (all G4)
 * No multiple choice. Shared helpers and the u7t- codes come from the Unit 7 test (HW.u7assess, js/lessons/u7test.js,
 * which loads first); several slips use the test's own generators with new numbers. Codes only the slips use are u7x-,
 * with labels and partial-credit decisions below. Not on the slips: naming triangles by their sides, always / sometimes /
 * never, sketches, clinometer making, and "explain" questions (their answers can't be checked automatically). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, G = HW.geo;
  var A = HW.u7assess;
  if (!A) throw new Error('js/exits/u7.js needs HW.u7assess from js/lessons/u7test.js: load it first');
  var rd = A.rd, q = A.q, near = A.near, N = A.N, dg = A.dg, D = A.D, fx = A.fx, rawN = A.rawN, toN = A.toN, find = A.find, br = A.br, cap = A.cap, pickR = A.pickR, safe = A.safe, uT = A.uT, L = A.L, lab = A.lab, person = A.person,
    TRG = A.TRG, INV = A.INV, MN = A.MN, SIDES = A.SIDES, fnT = A.fnT, fracT = A.fracT, sidesFrom = A.sidesFrom, num = A.num, fld = A.fld, wfld = A.wfld, ynFld = A.ynFld, fieldsPart = A.fieldsPart,
    lenPart = A.lenPart, lenFld = A.lenFld, angPart = A.angPart, angFld = A.angFld, otherFld = A.otherFld, Fig = A.Fig, triSVG = A.triSVG, letters = A.letters, abc = A.abc, LEN = A.LEN, UNITS = A.UNITS;

  HW.addCodes({
    'u7x-sq-double': 'Square: doubled the side instead of squaring it', 'u7x-sq-perim': 'Square: found the perimeter, not the area', 'u7x-tri-360': 'Triangle: used 360° for the angle sum',
    'u7x-tri-90': 'Triangle: used 90° for the angle sum', 'u7x-quarter': 'Square: divided the area by 4 instead of taking the square root', 'u7x-roll-down': 'Rounded the number of rolls down (not enough)',
    'u7x-min': 'Used minutes as hours (did not change minutes to hours)', 'u7x-angle-diff': 'Used the change in the angle in one ratio', 'u7x-half': 'Found only half the width',
    'u7x-vertical': 'Gave the angle from the vertical, not from the horizontal', 'u7x-180': 'Subtracted from 180° instead of 90°', 'u7x-clino': 'Used the clinometer reading as the angle of elevation'
  });
  HW.addPartial({ 'u7x-sq-double': 'n', 'u7x-sq-perim': 'n', 'u7x-tri-360': 'n', 'u7x-tri-90': 'n', 'u7x-quarter': 'n', 'u7x-roll-down': 's', 'u7x-min': 'b', 'u7x-angle-diff': 'n', 'u7x-half': 'b', 'u7x-vertical': 'b', 'u7x-180': 'n', 'u7x-clino': 'b' });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }

  /* =====================================================================================================
   * 7.1 Squares, square roots and triangle basics (REV)
   * ===================================================================================================== */
  var SQUARES = [['A square sticky note is', 'cm', [6.5, 9.5, 0.5]], ['A square deck is', 'ft', [9, 18, 1]], ['A square boxing ring is', 'm', [4.9, 7.3, 0.1]], ['A square floor tile is', 'cm', [20, 45, 0.5]], ['A square sandbox is', 'm', [1.2, 3.4, 0.1]], ['A square quilt is', 'in', [36, 90, 1]]];
  function l1q1(r) {
    var c = r.pick(SQUARES), s = find(function () { return pickR(r, c[2]); }, function (x) { return x !== 2 && x !== 4; }), Ar = q(s * s);
    return num(c[0] + ' ' + L(s, c[1]) + ' on each side. What is its area?', Ar, { dp: 4, noPlaces: true, word: 'the exact value', after: c[1] + '²',
      diag: [{ v: 2 * s, code: 'u7x-sq-double', hint: t(N(s) + '^2') + ' means ' + t(N(s) + '\\times ' + N(s)) + ', not ' + t(N(s) + '\\times 2') + '.' }, { v: 4 * s, code: 'u7x-sq-perim', hint: 'That is the distance around (the perimeter). The area of a square is side × side.' }],
      sol: 'Area of a square = (side)²: ' + t(N(s) + '^2=' + N(s) + '\\times ' + N(s) + '=' + N(Ar) + uT(c[1] + '²')), hints: ['Area of a square = side × side = (side)².', 'Calculator: the number, then x², then ENTER.'], text: 'area of a square' });
  }
  var KINDS = ['acute', 'right', 'obtuse'];
  function l1q3(r) {
    var s = find(function () { var k = r.pick(KINDS), a, b; if (k === 'right') { a = 90; b = r.int(15, 75); } else if (k === 'obtuse') { a = r.int(95, 140); b = r.int(10, 180 - a - 10); } else { a = r.int(45, 85); b = r.int(Math.max(10, 95 - a), 85); } return { k: k, a: a, b: b, c: 180 - a - b }; },
      function (s) { return s.c > 0 && s.c !== 90 && (s.k !== 'acute' || (s.c < 90 && s.c > 5)) && s.a !== s.b; });
    var show = r.chance(0.5) ? [s.a, s.b] : [s.b, s.a], diag = [{ v: 360 - s.a - s.b, code: 'u7x-tri-360', hint: 'The angles of a triangle add to <b>180°</b> (360° is all the way round a point, or a quadrilateral).' }];
    if (90 - s.a - s.b > 0) diag.push({ v: 90 - s.a - s.b, code: 'u7x-tri-90', hint: 'The angles of a triangle add to <b>180°</b>.' });
    var specs = [fld('Third angle:', s.c, { after: '°', name: 'Third angle', diag: diag }),
      wfld('The triangle is:', { name: 'Type', ph: 'acute, right or obtuse', right: [s.k], wrongs: KINDS.filter(function (k) { return k !== s.k; }), choices: 'acute, right or obtuse', key: s.k, bad: [s.k === 'acute' ? 'obtuse' : 'acute'], why: 'The biggest angle decides the name: 90° is right, more than 90° is obtuse, and if every angle is less than 90° it is acute.' })];
    return fieldsPart('A triangle has angles of ' + D(show[0]) + ' and ' + D(show[1]) + '. Find the third angle. Is the triangle acute, right or obtuse?', specs,
      br([t('180^\\circ-' + dg(show[0]) + '-' + dg(show[1]) + '=' + dg(s.c)), 'The biggest angle is ' + D(Math.max(s.a, s.b, s.c)) + ': ' + (s.k === 'right' ? 'a right angle, so it is a <b>right</b> triangle.' : s.k === 'obtuse' ? 'more than 90°, so it is an <b>obtuse</b> triangle.' : 'less than 90°, so every angle is acute: an <b>acute</b> triangle.')]),
      ['The three angles of a triangle add to 180°.', 'Look at the biggest angle to name the triangle.'], 'third angle of a triangle and its name');
  }
  function l1q4(r) {
    var s = find(function () { var Ar = r.int(30, 160), R = r.pick([5, 6, 8, 10]), side = Math.sqrt(Ar), edge = 4 * side; return { Ar: Ar, R: R, side: side, edge: edge, rolls: Math.ceil(edge / R - 1e-9) }; },
      function (s) { return !A.isSq(s.Ar) && safe(s.side, 1) && safe(s.edge, 1) && s.edge / s.R - Math.floor(s.edge / s.R) > 0.08 && Math.ceil(4 * rd(s.side, 1) / s.R - 1e-9) === s.rolls; });
    var early = 4 * rd(s.side, 1), specs = [fld('Side:', s.side, { dp: 1, after: 'm', name: 'Side', diag: [{ v: s.Ar / 4, code: 'u7x-quarter', hint: 'The area is side × side, so the side is the <b>square root</b> of the area (not area ÷ 4).' }, { v: s.Ar / 2, code: 'u7t-root-half', hint: 'A square root is not half the number: the side is ' + t('\\sqrt{' + s.Ar + '}') + '.' }] }),
      fld('Edging:', s.edge, { dp: 1, after: 'm', name: 'Edging', diag: Math.abs(rd(early, 1) - rd(s.edge, 1)) > 1e-9 ? [{ v: early, code: 'u7t-early', hint: 'Close! Use the full value of the side (' + rawN(s.side, 3) + '), not the rounded ' + fx(s.side, 1) + '.' }] : [] }),
      fld('Rolls:', s.rolls, { name: 'Rolls', diag: [{ v: s.rolls - 1, code: 'u7x-roll-down', hint: t(rawN(s.edge / s.R, 3)) + ' rolls: ' + (s.rolls - 1) + ' rolls are not quite enough, so buy one more.' }] })];
    return fieldsPart('A square lawn has an area of ' + t(s.Ar + '\\text{ m}^2') + '. (a) How long is each side, to the nearest tenth of a metre? (b) Edging goes all the way around the lawn: how many metres are needed, to the nearest tenth? Use the full value of the side. (c) The edging is sold in ' + s.R + ' m rolls. How many rolls must be bought?', specs,
      br(['(a) ' + t('\\sqrt{' + s.Ar + '}' + toN(s.side, 1) + '\\text{ m}'), '(b) ' + t('4\\times ' + rawN(s.side, 3) + toN(s.edge, 1) + '\\text{ m}'), '(c) ' + t(rawN(s.edge, 3) + '\\div ' + s.R + '=' + rawN(s.edge / s.R, 3)) + ': ' + (s.rolls - 1) + ' rolls are not quite enough, so buy <b>' + s.rolls + '</b>.']),
      ['The side of a square is the square root of its area.', 'Perimeter = 4 × side. Round the rolls up.'], 'square lawn: side, edging, rolls');
  }
  HW.defineExit({ lesson: 'u7l1', outcome: 'REV', calc: true, blurb: 'Squares and square roots: the area of a square, a square root between two whole numbers, the third angle of a triangle, and a square lawn’s side and edging.',
    questions: [Q(1, 'REV', 'BEG', l1q1, 'Area of a square'), Q(2, 'REV', 'PRG', function (r) { return A.rootPart(r); }, '√n between two whole numbers'),
      Q(3, 'REV', 'PRG', l1q3, 'Third angle of a triangle'), Q(4, 'REV', 'MAS', l1q4, 'Square lawn: side, edging, rolls')] });

  /* =====================================================================================================
   * 7.2 The Pythagorean theorem: finding the hypotenuse (G2)
   * ===================================================================================================== */
  function l2q4(r) {
    var s = find(function () { var v1 = 5 * r.int(5, 14), v2 = 5 * r.int(5, 14), m = 5 * r.int(2, 11); return { v1: v1, v2: v2, m: m, d1: v1 * m / 60, d2: v2 * m / 60 }; }, function (s) { var x = Math.sqrt(s.d1 * s.d1 + s.d2 * s.d2); return s.v1 !== s.v2 && s.m !== 60 && safe(x, 1); });
    var x = Math.sqrt(s.d1 * s.d1 + s.d2 * s.d2), hrs = s.m / 60, vh = r.pick([['snowmobiles', 'a cabin near Grande Prairie'], ['quads', 'a campsite near Hinton'], ['boats', 'a dock on Sylvan Lake']]);
    var alts = [{ v: Math.sqrt(Math.pow(s.v1 * s.m, 2) + Math.pow(s.v2 * s.m, 2)), code: 'u7x-min', hint: 'The speeds are in km <b>per hour</b>: change ' + s.m + ' min to hours first (' + s.m + ' ÷ 60).' }, { v: Math.sqrt(Math.pow(s.v1 * s.m / 100, 2) + Math.pow(s.v2 * s.m / 100, 2)), code: 'u7x-min', hint: 'An hour has 60 minutes, not 100: ' + s.m + ' min = ' + s.m + ' ÷ 60 h.' }];
    return lenPart('Two ' + vh[0] + ' leave ' + vh[1] + ' at the same time. One travels due north at ' + t(s.v1 + '\\text{ km/h}') + ' and the other due east at ' + t(s.v2 + '\\text{ km/h}') + '. How far apart are they after ' + s.m + ' minutes, in a straight line? Round to the nearest tenth of a kilometre.', x, { unit: 'km', pyth: { legs: [s.d1, s.d2] }, alts: alts,
      sol: br(['Time: ' + t(s.m + '\\div 60=' + rawN(hrs, 4)) + ' h.', 'North: ' + t(s.v1 + '\\times ' + rawN(hrs, 4) + '=' + rawN(s.d1, 3)) + ' km; east: ' + t(s.v2 + '\\times ' + rawN(hrs, 4) + '=' + rawN(s.d2, 3)) + ' km.', 'North and east make a right angle, so the distance apart is the hypotenuse:', t('d=\\sqrt{' + rawN(s.d1, 3) + '^2+' + rawN(s.d2, 3) + '^2}' + toN(x, 1) + '\\text{ km}')]),
      hints: ['Distance = speed × time, with the time in hours.', 'Due north and due east meet at a right angle: use the Pythagorean theorem.'], text: 'two vehicles north and east' });
  }
  HW.defineExit({ lesson: 'u7l2', outcome: 'G2', calc: true, blurb: 'The Pythagorean theorem: the hypotenuse of a right triangle (exact and to the nearest tenth), in a story, and two vehicles heading north and east.',
    questions: [Q(1, 'G2', 'BEG', function (r) { return A.hypPart(r, { exact: true }); }, 'Hypotenuse (whole or tenths)'), Q(2, 'G2', 'PRG', function (r) { return A.hypPart(r); }, 'Hypotenuse to the nearest tenth'),
      Q(3, 'G2', 'PRG', function (r) { return A.pythCtxPart(r, { kind: 'hyp' }); }, 'Hypotenuse in a story'), Q(4, 'G2', 'MAS', l2q4, 'Two vehicles north and east')] });

  /* =====================================================================================================
   * 7.3 The Pythagorean theorem: finding a leg, and squaring a corner (G2)
   * ===================================================================================================== */
  HW.defineExit({ lesson: 'u7l3', outcome: 'G2', calc: true, blurb: 'Finding a missing leg (exact and in a story), testing whether a triangle is a right triangle, and a pole held by two ropes.',
    questions: [Q(1, 'G2', 'BEG', function (r) { return A.legPart(r, { exact: true }); }, 'Missing leg (whole or tenths)'), Q(2, 'G2', 'PRG', function (r) { return A.pythCtxPart(r, { kind: 'leg' }); }, 'Missing leg in a story'),
      Q(3, 'G2', 'PRG', function (r) { return A.rightTestPart(r); }, 'Is it a right triangle?'), Q(4, 'G2', 'MAS', function (r) { return A.polePart(r); }, 'Two ropes: two steps')] });

  /* =====================================================================================================
   * 7.4 – 7.6 The tangent, sine and cosine ratios (G4; the unknown on the bottom is A1)
   * ===================================================================================================== */
  function l4q4(r) {
    var s = find(function () { var p = r.int(3, 11), th = r.int(14, 44); return { p: p, th: th, tp: p / 12, tt: TRG.tan(th) }; }, function (s) { return Math.abs(s.tp - s.tt) > 0.04 && s.p !== 6; });
    var garage = s.tp > s.tt, specs = [fld(t('\\tan ' + dg(s.th)) + ' =', s.tt, { dp: 4, name: 'tan', diag: [{ v: Math.tan(s.th), code: 'u7t-rad', hint: G.RAD_HINT }] }),
      fld('Pitch ' + s.p + '/12 =', s.tp, { dp: 4, name: 'Pitch', diag: [{ v: 12 / s.p, code: 'u7t-upside', hint: 'Rise over run: ' + s.p + ' ÷ 12.' }] }),
      wfld('Steeper roof:', { name: 'Steeper', ph: 'garage or house', right: [garage ? 'garage' : 'house'], wrongs: [garage ? 'house' : 'garage'], choices: 'garage or house', key: garage ? 'garage' : 'house', bad: [garage ? 'house' : 'garage'], code: 'u7t-verdict', why: 'Both numbers are rise ÷ run (opp ÷ adj). The bigger one rises more for each unit of run: it is steeper.' })];
    return fieldsPart('A garage roof has a pitch of ' + s.p + '/12: it rises ' + s.p + ' units for every 12 units it runs across. The house roof slopes at ' + D(s.th) + '. Find ' + t('\\tan ' + dg(s.th)) + ' and the pitch as a decimal, each to 4 decimal places. Which roof is steeper: the garage or the house?', specs,
      br(['House: ' + t('\\tan ' + dg(s.th) + toN(s.tt, 4)) + ' (opp ÷ adj: the rise for 1 unit of run).', 'Garage: ' + t(s.p + '\\div 12' + toN(s.tp, 4)) + '.', (garage ? 'The garage’s ratio is bigger, so the <b>garage</b>' : 'The house’s ratio is bigger, so the <b>house</b>') + ' roof is steeper.']),
      ['tan θ = opp ÷ adj = rise ÷ run.', 'Compare the two decimals: the bigger one is steeper.'], 'roof pitch vs roof angle');
  }
  HW.defineExit({ lesson: 'u7l4', outcome: 'G4', calc: true, blurb: 'The tangent ratio: tan θ as a decimal, the opposite side (× tan), the adjacent side (÷ tan), and comparing a roof pitch with a roof angle.',
    questions: [Q(1, 'G4', 'BEG', function (r) { return A.ratioDecPart(r, { fn: 'tan' }); }, 'tan θ as a decimal'), Q(2, 'G4', 'PRG', function (r) { return A.trigSidePart(r, { op: 'mul', fn: 'tan' }); }, 'opp = adj × tan θ'),
      Q(3, 'A1', 'PRG', function (r) { return A.trigSidePart(r, { op: 'div', fn: 'tan' }); }, 'adj = opp ÷ tan θ'), Q(4, 'G4', 'MAS', l4q4, 'Roof pitch vs angle')] });

  function l5q4(r) {
    if (r.chance(0.5)) {
      var s = find(function () { var Lg = pickR(r, [4, 8, 0.5]), a1 = r.int(60, 70), a2 = a1 + r.int(4, 9); return { Lg: Lg, a1: a1, a2: a2, h1: Lg * TRG.sin(a1), h2: Lg * TRG.sin(a2) }; }, function (s) { return s.a2 <= 80 && safe(s.h2 - s.h1, 2); }), p = person(r), x = s.h2 - s.h1;
      return lenPart(p.n + ' leans a ' + L(s.Lg, 'm') + ' ladder against a wall at ' + D(s.a1) + ' to the ground. ' + cap(p.he) + ' moves the foot closer to the wall so the angle is ' + D(s.a2) + '. How much higher up the wall does the ladder reach now? Round to the nearest hundredth of a metre.', x, { dp: 2, unit: 'm', radTrap: false,
        alts: [{ v: s.Lg * TRG.sin(s.a2 - s.a1), code: 'u7x-angle-diff', hint: 'The ' + (s.a2 - s.a1) + '° change is not an angle of a right triangle with the ladder. Find each height with its own angle, then subtract.' }, { v: s.h2, code: 'u7t-one-tri', hint: 'That is the new height. Subtract the old height (at ' + s.a1 + '°).' },
          { v: s.h1, code: 'u7t-one-tri', hint: 'That is the old height. Find the new one (at ' + s.a2 + '°) and subtract.' }, { v: s.Lg * (TRG.cos(s.a1) - TRG.cos(s.a2)), code: 'u7t-ratio', hint: 'The height up the wall is opp and the ladder is hyp: SOH.' }, { v: Math.abs(s.Lg * (Math.sin(s.a2) - Math.sin(s.a1))), code: 'u7t-rad', hint: G.RAD_HINT }],
        sol: br(['The ladder is the hyp and the height up the wall is the opp: SOH.', 'Before: ' + t(N(s.Lg) + '\\times\\sin ' + dg(s.a1) + '=' + rawN(s.h1, 4)) + ' m', 'After: ' + t(N(s.Lg) + '\\times\\sin ' + dg(s.a2) + '=' + rawN(s.h2, 4)) + ' m', 'Higher by ' + t(rawN(s.h2, 4) + '-' + rawN(s.h1, 4) + toN(x, 2) + '\\text{ m}')]),
        hints: ['Find the height at each angle (SOH), then subtract.', 'Keep the full values and round at the end.'], text: 'ladder moved: how much higher' });
    }
    var z = find(function () { var Lr = 5 * r.int(10, 24), th = r.int(25, 50), e = pickR(r, [1.2, 2.0, 0.1]); return { Lr: Lr, th: th, e: e, up: Lr * TRG.sin(th), h: Lr * TRG.sin(th) + e }; }, function (z) { return safe(z.h, 1); });
    return lenPart('A parasailer is towed behind a boat on a ' + L(z.Lr, 'm') + ' rope. The rope makes an angle of ' + D(z.th) + ' with the horizontal, and it is tied to the boat ' + L(z.e, 'm') + ' above the water. How high above the water is the parasailer, to the nearest tenth of a metre? (Treat the rope as straight.)', z.h, { unit: 'm', radTrap: false,
      alts: [{ v: z.up, code: 'u7t-no-eye', hint: 'That is the height above the point where the rope is tied. Add the ' + L(z.e, 'm') + '.' }, { v: z.Lr * TRG.cos(z.th) + z.e, code: 'u7t-ratio', hint: 'The height is opp and the rope is hyp: SOH.' }, { v: z.Lr / TRG.sin(z.th) + z.e, code: 'u7t-mul-div', hint: 'The unknown (opp) is on top: multiply.' }, { v: z.Lr * Math.sin(z.th) + z.e, code: 'u7t-rad', hint: G.RAD_HINT }],
      sol: br(['The rope is the hyp; the height above the tie point is the opp: SOH.', t(N(z.Lr) + '\\times\\sin ' + dg(z.th) + '=' + rawN(z.up, 3)) + ' m', 'Add the ' + L(z.e, 'm') + ': ' + t(rawN(z.up, 3) + '+' + N(z.e) + toN(z.h, 1) + '\\text{ m}')]),
      hints: ['Sketch it: the right triangle starts at the tie point on the boat.', 'Find the opp with sin, then add the height of the tie point.'], text: 'parasailer height' });
  }
  HW.defineExit({ lesson: 'u7l5', outcome: 'G4', calc: true, blurb: 'The sine ratio: sin θ as a decimal, the opposite side (× sin), the hypotenuse (÷ sin), and a height in a two-step story.',
    questions: [Q(1, 'G4', 'BEG', function (r) { return A.ratioDecPart(r, { fn: 'sin' }); }, 'sin θ as a decimal'), Q(2, 'G4', 'PRG', function (r) { return A.trigSidePart(r, { op: 'mul', fn: 'sin' }); }, 'opp = hyp × sin θ'),
      Q(3, 'A1', 'PRG', function (r) { return A.trigSidePart(r, { op: 'div', fn: 'sin' }); }, 'hyp = opp ÷ sin θ'), Q(4, 'G4', 'MAS', l5q4, 'Ladder moved, or a parasailer')] });

  function l6q4(r) {
    var s = find(function () { var sd = pickR(r, [1.6, 2.6, 0.1]), th = r.int(50, 66), w = pickR(r, [0.55, 0.8, 0.05]); return { sd: sd, th: th, w: w, half: sd * TRG.cos(th), floor: 2 * sd * TRG.cos(th) }; }, function (s) { return safe(s.floor, 1) && Math.abs(s.floor - 2 * s.w) > 0.06; });
    var fits = 2 * s.w <= s.floor;
    var specs = [lenFld('Floor width:', s.floor, { unit: 'm', name: 'Floor width', radTrap: false, alts: [{ v: s.half, code: 'u7x-half', hint: 'That is one half of the floor (one right triangle). The floor is <b>twice</b> as wide.' }, { v: 2 * s.sd * TRG.sin(s.th), code: 'u7t-ratio', hint: 'Half the floor is the adj of the ' + s.th + '° angle and the side is the hyp: CAH.' }, { v: 2 * s.sd * Math.cos(s.th), code: 'u7t-rad', hint: G.RAD_HINT }] }),
      ynFld('Do the pads fit?', fits, { name: 'Fit', code: 'u7t-verdict', why: 'Compare the floor width with the two pads side by side: ' + t('2\\times ' + N(s.w) + '=' + N(q(2 * s.w))) + ' m.' })];
    return fieldsPart('The front of an A-frame tent is a triangle. Each sloping side is ' + L(s.sd, 'm') + ' long and makes an angle of ' + D(s.th) + ' with the ground. (a) How wide is the tent floor, to the nearest tenth of a metre? (b) Can two sleeping pads that are each ' + L(s.w, 'm') + ' wide lie side by side on the floor?', specs,
      br(['The centre pole splits the front into two right triangles. In each, the side is the hyp and half the floor is the adj: CAH.', 'Half the floor: ' + t(N(s.sd) + '\\times\\cos ' + dg(s.th) + '=' + rawN(s.half, 3)) + ' m', 'Floor: ' + t('2\\times ' + rawN(s.half, 3) + toN(s.floor, 1) + '\\text{ m}'),
        'Two pads: ' + t('2\\times ' + N(s.w) + '=' + N(q(2 * s.w))) + ' m. ' + (fits ? 'That is not more than the floor, so <b>yes</b>.' : 'That is more than the floor, so <b>no</b>.')]),
      ['Split the triangle down the middle: each half is a right triangle.', 'Half the floor is adj, the sloping side is hyp: CAH. Then double it.'], 'A-frame tent width');
  }
  HW.defineExit({ lesson: 'u7l6', outcome: 'G4', calc: true, blurb: 'The cosine ratio: cos θ as a decimal, the adjacent side (× cos), the hypotenuse (÷ cos), and the width of an A-frame tent.',
    questions: [Q(1, 'G4', 'BEG', function (r) { return A.ratioDecPart(r, { fn: 'cos' }); }, 'cos θ as a decimal'), Q(2, 'G4', 'PRG', function (r) { return A.trigSidePart(r, { op: 'mul', fn: 'cos' }); }, 'adj = hyp × cos θ'),
      Q(3, 'A1', 'PRG', function (r) { return A.trigSidePart(r, { op: 'div', fn: 'cos' }); }, 'hyp = adj ÷ cos θ'), Q(4, 'G4', 'MAS', l6q4, 'A-frame tent')] });

  /* =====================================================================================================
   * 7.7 Angles of elevation and depression (G4; the distance ÷ tan is A1)
   * ===================================================================================================== */
  function l7q1(r) {
    var x = find(function () { return r.int(12, 78); }, function (v) { return Math.abs(v - 45) > 3; }), p = person(r);
    if (r.chance(0.55)) {
      var c = r.pick([['looks down from a balcony', 'the wall of the building'], ['looks down from the top of a cliff', 'the cliff face'], ['looks down from a fire lookout tower', 'the tower’s vertical support'], ['looks down from a hot-air balloon', 'the rope hanging straight down']]);
      return num(p.n + ' ' + c[0] + ' at a dog on the ground. ' + cap(p.his) + ' line of sight makes an angle of ' + D(x) + ' with ' + c[1] + ' (a vertical line). What is the angle of depression?', 90 - x, { after: '°',
        diag: [{ v: x, code: 'u7x-vertical', hint: 'An angle of depression is measured from the <b>horizontal</b>, not from the vertical. Horizontal and vertical make 90°.' }, { v: 180 - x, code: 'u7x-180', hint: 'The horizontal and the vertical make a right angle: subtract from <b>90°</b>.' }],
        sol: br(['The horizontal and the vertical make 90°. The angle of depression is measured from the horizontal down to the line of sight:', t('90^\\circ-' + dg(x) + '=' + dg(90 - x))]), hints: ['An angle of depression starts at the horizontal (level) line.', 'Horizontal and vertical make 90°.'], text: 'depression from the vertical' });
    }
    var d = r.pick([['From a sailboat, the angle of elevation to the top of a lighthouse is', 'the angle of depression from the top of the lighthouse to the sailboat'], ['From the bottom of a ski hill, the angle of elevation to the chalet at the top is', 'the angle of depression from the chalet to the bottom'], ['From a bridge, the angle of depression to a boat is', 'the angle of elevation from the boat to the bridge']]);
    return num(d[0] + ' ' + D(x) + '. What is ' + d[1] + '?', x, { after: '°', diag: [{ v: 90 - x, code: 'u7x-vertical', hint: 'Both angles are measured from a <b>horizontal</b> line, and the two horizontal lines are parallel: alternate interior angles are <b>equal</b>.' }, { v: 180 - x, code: 'u7x-180', hint: 'The two angles are alternate interior angles between parallel (horizontal) lines: they are <b>equal</b>.' }],
      sol: 'The two horizontal lines are parallel, and the line of sight crosses them: the angle of elevation and the angle of depression are alternate interior angles, so they are equal: ' + D(x) + '.', hints: ['Both angles are measured from a horizontal line.', 'Alternate interior angles between parallel lines are equal.'], text: 'elevation = depression' });
  }
  function l7q4(r) {
    var s = find(function () { var e = r.int(18, 55), up = r.chance(0.5), R = up ? 90 + e : 90 - e, d = pickR(r, [12, 40, 1]), eye = pickR(r, [1.4, 1.8, 0.1]); return { e: e, R: R, d: d, eye: eye, h: d * TRG.tan(e) + eye }; }, function (s) { return Math.abs(s.e - 45) > 3 && safe(s.h, 1) && s.R !== 90 + 45; }), p = person(r);
    var wrongR = s.R > 90 ? s.R - 180 : s.R;   // reading used as the angle (only sensible below 90°)
    var specs = [fld('Angle of elevation:', s.e, { after: '°', name: 'Elevation', diag: [{ v: s.R, code: 'u7x-clino', hint: 'The reading is measured from the straw’s 90° mark: the angle of elevation is the <b>difference</b> between the reading and 90°.' }, { v: 180 - s.R, code: 'u7x-clino', hint: 'The angle of elevation is the difference between the reading and <b>90°</b>.' }] }),
      lenFld('Height:', s.h, { unit: 'm', name: 'Height', radTrap: false, alts: [{ v: s.d * TRG.tan(s.e), code: 'u7t-no-eye', hint: 'That is the height above ' + p.his + ' eyes. Add the eye height.' }, { v: wrongR > 0 && wrongR < 89 ? s.d * TRG.tan(wrongR) + s.eye : NaN, code: 'u7x-clino', hint: 'Use the angle of elevation (the difference from 90°), not the reading.' }, { v: s.d / TRG.tan(s.e) + s.eye, code: 'u7t-mul-div', hint: 'The height (opp) is on top of the tan ratio: multiply.' }, { v: s.d * Math.tan(s.e) + s.eye, code: 'u7t-rad', hint: G.RAD_HINT }] })];
    return fieldsPart(p.n + ' stands ' + L(s.d, 'm') + ' from the wall of the school gym and looks through a clinometer at the top of the wall. The string crosses the scale at ' + D(s.R) + '. ' + cap(p.his) + ' eyes are ' + L(s.eye, 'm') + ' above the ground. (a) What is the angle of elevation? (b) How tall is the wall, to the nearest tenth of a metre?', specs,
      br(['(a) Angle of elevation = the difference between the reading and 90°: ' + t((s.R > 90 ? dg(s.R) + '-90^\\circ' : '90^\\circ-' + dg(s.R)) + '=' + dg(s.e)), '(b) From the eyes: adj ' + L(s.d, 'm') + ', want opp: TOA. ' + t(N(s.d) + '\\times\\tan ' + dg(s.e) + '=' + rawN(s.d * TRG.tan(s.e), 3)) + ' m',
        'Add the eye height: ' + t(rawN(s.d * TRG.tan(s.e), 3) + '+' + N(s.eye) + toN(s.h, 1) + '\\text{ m}')]),
      ['Angle of elevation = the difference between the reading and 90°.', 'Find the opp with tan, then add the eye height.'], 'clinometer: angle and height');
  }
  HW.defineExit({ lesson: 'u7l7', outcome: 'G4', calc: true, blurb: 'Angles of elevation and depression: from the vertical or equal angles, a height with the eye height, a distance from an angle of depression, and a clinometer reading.',
    questions: [Q(1, 'G4', 'BEG', l7q1, 'Angle of depression'), Q(2, 'G4', 'PRG', function (r) { return A.elevEyePart(r); }, 'Height with the eye height'),
      Q(3, 'A1', 'PRG', function (r) { return A.depressionPart(r); }, 'Distance from an angle of depression'), Q(4, 'G4', 'MAS', l7q4, 'Clinometer: angle and height')] });

  /* =====================================================================================================
   * 7.8 Finding angles with inverse trig ratios (G4)
   * ===================================================================================================== */
  function l8q1(r) {
    var s = find(function () { var fn = r.pick(['sin', 'cos', 'tan']), v = fn === 'tan' ? pickR(r, [0.2, 3.5, 0.05]) : pickR(r, [0.1, 0.95, 0.01]); return { fn: fn, v: v, th: INV[fn](v) }; }, function (s) { return s.th > 5 && s.th < 85 && Math.abs(s.th - 45) > 2 && safe(s.th, 0); });
    return angPart(t('\\' + s.fn + '\\theta=' + N(s.v)) + '. Find θ, to the nearest degree.', s.th, { ratio: { fn: s.fn, num: s.v, den: 1 },
      sol: br([t('\\theta=\\' + s.fn + '^{-1}(' + N(s.v) + ')' + toN(s.th, 0) + '^\\circ'), 'Calculator (DEG): 2nd ' + s.fn + ' ' + N(s.v) + ' ) ENTER']), hints: ['To get an angle from a ratio, use the inverse key.', 'Press 2nd, then ' + s.fn + '.'], text: 'angle from a ratio' });
  }
  function l8q4(r) {
    var s = find(function () { var Lg = pickR(r, [5, 9, 0.1]), d = pickR(r, [1.2, 2.8, 0.1]); return { Lg: Lg, d: d, th: INV.cos(d / Lg), d75: Lg * TRG.cos(75) }; }, function (s) { return s.th > 62 && s.th < 82 && Math.abs(s.th - 75) > 0.8 && safe(s.th, 0) && safe(s.d75, 1); }), p = person(r);
    var specs = [angFld('Angle with the ground:', s.th, { name: 'Angle', ratio: { fn: 'cos', num: s.d, den: s.Lg } }),
      lenFld('Foot for 75°:', s.d75, { unit: 'm', name: 'Foot distance', trig: { fn: 'cos', deg: 75, side: s.Lg, op: 'mul' } })];
    return fieldsPart(p.n + ' leans a ' + L(s.Lg, 'm') + ' ladder against a house. The foot of the ladder is ' + L(s.d, 'm') + ' from the wall. (a) What angle does the ladder make with the ground, to the nearest degree? (b) The safe angle is about 75°. How far from the wall should the foot be for an angle of exactly 75°? Round to the nearest tenth of a metre.', specs,
      br(['(a) The distance from the wall is adj and the ladder is hyp: CAH. ' + t('\\theta=\\cos^{-1}\\!\\left(' + fracT(N(s.d), N(s.Lg)) + '\\right)' + toN(s.th, 0) + '^\\circ') + (s.th < 75 ? ' (a little too flat).' : ' (a little too steep).'),
        '(b) ' + t('\\cos 75^\\circ=\\dfrac{x}{' + N(s.Lg) + '}') + ', so ' + t('x=' + N(s.Lg) + '\\times\\cos 75^\\circ' + toN(s.d75, 1) + '\\text{ m}')]),
      ['The ground distance is adj and the ladder is hyp: CAH.', 'For (b), x is on top of the cos ratio: multiply.'], 'ladder angle and the 75° foot');
  }
  HW.defineExit({ lesson: 'u7l8', outcome: 'G4', calc: true, blurb: 'Inverse trig ratios: an angle from a ratio, an angle from two sides and the other acute angle, an angle in a story, and a ladder at a safe angle.',
    questions: [Q(1, 'G4', 'BEG', l8q1, 'Angle from a ratio'), Q(2, 'G4', 'PRG', function (r) { return A.anglePart(r); }, 'Angle from two sides + the other angle'),
      Q(3, 'G4', 'PRG', function (r) { return A.angleCtxPart(r); }, 'Angle in a story'), Q(4, 'G4', 'MAS', l8q4, 'Ladder: angle and the 75° foot')] });

  /* =====================================================================================================
   * 7.9 Solving right triangles: choosing the right ratio (G4)
   * ===================================================================================================== */
  var TOOL = { sin: ['sin', 'sine', 'soh'], cos: ['cos', 'cosine', 'cah'], tan: ['tan', 'tangent', 'toa'], pyth: ['pythagoras', 'pythagorean', 'pyth', 'pythag'] };
  function l9q1(r) {
    var want = r.pick(['sin', 'cos', 'tan', 'pyth', 'sin', 'cos', 'tan']), prompt, sol, wrongs = [];
    Object.keys(TOOL).forEach(function (k) { if (k !== want) wrongs = wrongs.concat(TOOL[k]); });
    if (want === 'pyth') {
      var tr = A.triple(r, 60), lg = r.chance(0.5), u = r.pick(UNITS), sides = lg ? { a: lab(tr[0], u), c: lab(tr[2], u), b: 'x' } : { a: lab(tr[0], u), b: lab(tr[1], u), c: 'x' };
      prompt = triSVG(r, { a: tr[0], b: tr[1], sides: sides, unknown: lg ? 'b' : 'c' }); sol = 'Two sides are known, a third side is wanted, and no angle is given (except the right angle): <b>Pythagoras</b>.';
    } else {
      var cs = r.pick(A.CASES.mul.concat(A.CASES.div).filter(function (c) { return c.fn === want; })), deg = find(function () { return r.int(15, 75); }, function (x) { return x !== 45; }), u2 = r.pick(UNITS), k = pickR(r, LEN[u2]), s = sidesFrom(deg, cs.know, k), th = r.chance(0.5) ? 'A' : 'B', ab = abc(th, s), R = letters(th), sd = {};
      sd[R[cs.know] || 'c'] = lab(k, u2); sd[R[cs.want] || 'c'] = 'x';
      prompt = triSVG(r, { a: ab.a, b: ab.b, theta: th, thetaLabel: deg + '°', sides: sd, unknown: R[cs.want] || 'c' });
      sol = 'From the ' + deg + '° angle: you know the <b>' + cs.know + '</b> and want the <b>' + cs.want + '</b>. Those two go together in ' + MN[want] + ': <b>' + { sin: 'sine', cos: 'cosine', tan: 'tangent' }[want] + '</b>.';
    }
    var key = want === 'pyth' ? 'Pythagoras' : want;
    return fieldsPart('Which tool would you use to find ' + t('x') + ': <b>sin</b>, <b>cos</b>, <b>tan</b> or <b>Pythagoras</b>? (Do not solve.)' + prompt, [wfld('Tool:', { name: 'Tool', ph: 'sin, cos, tan or Pythagoras', right: TOOL[want], wrongs: wrongs, choices: 'sin, cos, tan or Pythagoras', key: key, bad: [want === 'tan' ? 'sin' : 'tan'],
      why: want === 'pyth' ? 'No angle is given (except the right angle), so a trig ratio can’t be used: two sides → the third side.' : 'Label the side you know and the side you want from the angle: SOH CAH TOA.' })], sol,
      ['Is an angle given (other than the right angle)? If not, use Pythagoras.', 'Label opp, adj and hyp from the angle: SOH CAH TOA.'], 'which tool (typed)');
  }
  function l9q3(r) {
    var s = find(function () { var u = r.pick(UNITS), a = r.int(20, 70), b = pickR(r, LEN[u]); return { u: u, A: a, b: b, a: b * TRG.tan(a), c: b / TRG.cos(a) }; }, function (s) { return s.A !== 45 && safe(s.a, 1) && safe(s.c, 1) && s.a < 300; });
    var svg = triSVG(r, { a: s.a, b: s.b, names: ['A', 'B', 'C'], theta: 'A', thetaLabel: s.A + '°', sides: { b: lab(s.b, s.u), a: 'a', c: 'c' } });
    var specs = [fld(t('\\angle B') + ' =', 90 - s.A, { after: '°', name: '∠B', diag: [{ v: 180 - s.A, code: 'u7t-180-angle', hint: 'The two acute angles add to <b>90°</b>.' }] }),
      lenFld(t('a') + ' =', s.a, { unit: s.u, name: 'a', trig: { fn: 'tan', deg: s.A, side: s.b, op: 'mul' } }), lenFld(t('c') + ' =', s.c, { unit: s.u, name: 'c', trig: { fn: 'cos', deg: s.A, side: s.b, op: 'div' } })];
    return fieldsPart('In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('\\angle A=' + dg(s.A)) + ' and ' + t('b=' + N(s.b)) + ' ' + s.u + '. Solve the triangle: find ' + t('\\angle B') + ', ' + t('a') + ' and ' + t('c') + ' (to the nearest tenth). Watch where the unknown goes!' + svg, specs,
      br([t('\\angle B=90^\\circ-' + dg(s.A) + '=' + dg(90 - s.A)), 'For ∠A: b is adj, a is opp, c is hyp.', t('\\tan ' + dg(s.A) + '=\\dfrac{a}{' + N(s.b) + '}') + ': ' + t('a=' + N(s.b) + '\\times\\tan ' + dg(s.A) + toN(s.a, 1)) + ' ' + s.u + ' (TOA, on top: multiply)',
        t('\\cos ' + dg(s.A) + '=\\dfrac{' + N(s.b) + '}{c}') + ': ' + t('c=' + N(s.b) + '\\div\\cos ' + dg(s.A) + toN(s.c, 1)) + ' ' + s.u + ' (CAH, on the bottom: divide)', 'Check: c is the longest side ✓']),
      ['The acute angles add to 90°.', 'From ∠A: b is adj. Use TOA for a and CAH for c. Is the unknown on top or on the bottom?'], 'solve a triangle (angle + leg)');
  }
  function sharedSVG(s) {
    var fg = new Fig(), sc = 300 / Math.max(s.AD + s.DC, s.BD * 1.4), Ap = [0, 0], Dp = [s.AD * sc, 0], Cp = [(s.AD + s.DC) * sc, 0], Bp = [s.AD * sc, -s.BD * sc];
    fg.poly([Ap, Bp, Cp], { fill: '#f6f2ea', stroke: A.INK, width: 2.4 }); fg.line(Bp, Dp, { width: 2 });
    fg.arc(Dp, 90, 180, { right: true }).arc(Dp, 0, 90, { right: true }).arc(Ap, 0, Math.atan2(s.BD, s.AD) * 180 / Math.PI, { label: s.al + '°', color: A.AMBER });
    var dC = 180 - Math.atan2(s.BD, s.DC) * 180 / Math.PI; fg.arc(Cp, dC, 180, { label: '?', color: A.RED, r: 30 });
    fg.text(Ap[0] - 12, 6, 'A').text(Bp[0], Bp[1] - 14, 'B').text(Cp[0] + 12, 6, 'C').text(Dp[0], 16, 'D');
    fg.side(Ap, Bp, Dp, lab(s.AB, s.u)).text((Dp[0] + Cp[0]) / 2, 16, lab(s.DC, s.u), { size: 15 });
    return fg.svg({ width: 330, aria: 'two right triangles sharing side BD' });
  }
  function l9q4(r) {
    var s = find(function () { var u = r.pick(['cm', 'm']), al = r.int(28, 58), AB = pickR(r, [10, 24, 1]), DC = pickR(r, [4, 14, 0.5]), BD = AB * TRG.sin(al); return { u: u, al: al, AB: AB, DC: DC, BD: BD, AD: AB * TRG.cos(al), BC: Math.sqrt(BD * BD + DC * DC), C: INV.tan(BD / DC) }; },
      function (s) { return safe(s.BD, 1) && safe(s.BC, 1) && safe(s.C, 0) && Math.abs(s.C - 45) > 3 && s.C > 25 && s.C < 75; });
    var eBC = Math.sqrt(rd(s.BD, 1) * rd(s.BD, 1) + s.DC * s.DC), eC = INV.tan(rd(s.BD, 1) / s.DC);
    var specs = [lenFld('BD =', s.BD, { unit: s.u, name: 'BD', trig: { fn: 'sin', deg: s.al, side: s.AB, op: 'mul' } }),
      lenFld('BC =', s.BC, { unit: s.u, name: 'BC', pyth: { legs: [s.BD, s.DC] }, alts: Math.abs(rd(eBC, 1) - rd(s.BC, 1)) > 1e-9 ? [{ v: eBC, code: 'u7t-early', hint: 'Close! Keep the full value of BD (' + rawN(s.BD, 3) + ') when you use it again.' }] : [] }),
      angFld(t('\\angle C') + ' =', s.C, { name: '∠C', ratio: { fn: 'tan', num: s.BD, den: s.DC }, alts: Math.abs(rd(eC, 0) - rd(s.C, 0)) > 1e-9 ? [{ v: eC, code: 'u7t-early', hint: 'Close! Use the full value of BD.' }] : [] })];
    return fieldsPart('The two right triangles share side BD, and ' + t('BD\\perp AC') + '. ' + t('\\angle A=' + dg(s.al)) + ', ' + t('AB=' + N(s.AB)) + ' ' + s.u + ' and ' + t('DC=' + N(s.DC)) + ' ' + s.u + '. Find BD and BC (to the nearest tenth) and ' + t('\\angle C') + ' (to the nearest degree). Keep the full value of BD.' + sharedSVG(s), specs,
      br(['Solve △ABD first: it has an angle and a side. For ∠A, BD is opp and AB is hyp: SOH. ' + t('BD=' + N(s.AB) + '\\times\\sin ' + dg(s.al) + toN(s.BD, 1) + uT(s.u)),
        'In △BDC, BD and DC are the legs: ' + t('BC=\\sqrt{' + rawN(s.BD, 3) + '^2+' + N(s.DC) + '^2}' + toN(s.BC, 1) + uT(s.u)), 'For ∠C, BD is opp and DC is adj: ' + t('\\angle C=\\tan^{-1}\\!\\left(' + fracT(rawN(s.BD, 3), N(s.DC)) + '\\right)' + toN(s.C, 0) + '^\\circ')]),
      ['Which triangle has enough facts to solve first?', 'BD is shared: it is a side of both triangles.'], 'two triangles sharing a side');
  }
  HW.defineExit({ lesson: 'u7l9', outcome: 'G4', calc: true, blurb: 'Solving right triangles: choosing the tool, solving from an angle and the hypotenuse or a leg, and two right triangles that share a side.',
    questions: [Q(1, 'G4', 'BEG', l9q1, 'Which tool'), Q(2, 'G4', 'PRG', function (r) { return A.solveAHPart(r); }, 'Solve: angle + hypotenuse'), Q(3, 'G4', 'PRG', l9q3, 'Solve: angle + leg'), Q(4, 'G4', 'MAS', l9q4, 'Two triangles sharing a side')] });
})(window);
