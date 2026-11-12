/* Math 10-3 · Unit 5 (Angles, Parallel Lines and Spatial Puzzles) — exit slips for Lessons 1–8 (u5l1x … u5l8x), written in
 * test mode. Calculator allowed (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core skill —
 * Beginning, Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student.
 * Outcomes per part, as on the test: G1 for puzzles and games, G6 for measuring / estimating / bearings / copying / bisecting /
 * polygons, G5 for perpendicular and parallel lines, angle partners and transversals.
 *   5.1 the area of a tangram piece · the total area of a set of tangram pieces (small triangle = 1 unit) · squares of any
 *       size in an n by n grid · squares of any size in a rectangle grid (all G1)
 *   5.2 the take-away game · tic-tac-toe (the one square that wins or blocks) · the tower puzzle's fewest moves (2ⁿ − 1) ·
 *       race to N: go first or second, and the first square (all G1)
 *   5.3 read a protractor (±1°) · a protractor reading and its reflex angle · the missing angle of a polygon · each angle of
 *       a regular polygon, to the nearest tenth (all G6)
 *   5.4 estimate an angle from a picture (within 10°) · a direction such as “20° south of east” as a true bearing · a bearing
 *       on a map and the bearing back · the angle between two legs of a route from their bearings (all G6)
 *   5.5 bisect an angle (G6) · a table leg that is not quite perpendicular: how far off, and the other angle (G5) · parallel,
 *       perpendicular or neither (a word; G5) · an angle bisected twice, worked forward or backward (G6)
 *   5.6 complement and supplement · a missing angle on a straight line or in a right angle · three lines through a point ·
 *       two crossing lines with an angle written (ax + b)°: x, then another angle (all G5)
 *   5.7 name a pair of angles (typed) · which angle is alternate interior (corresponding, …) to a given one · name a pair in
 *       a lettered diagram · a lettered diagram: a pair name and the letter of a partner angle (all G5)
 *   5.8 ℓ1 ∥ ℓ2: an equal pair · a pair that adds to 180° (one or two steps) · are the lines parallel? (yes / no and what
 *       the angle would have to be) · the angle at a bend between parallel lines (all G5)
 * No multiple choice. Shared helpers and the u5t- codes come from the Unit 5 test (HW.u5assess, js/lessons/u5test.js,
 * which loads first); several slips use the test's own generators with new numbers. Codes only the slips use are u5x-,
 * with labels and partial-credit decisions below. Pentominoes (5.1) and dots and boxes (5.2) are not on the slips: their
 * answers are pictures or explanations that can't be checked automatically. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, G = HW.geo;
  var A = HW.u5assess;
  if (!A) throw new Error('js/exits/u5.js needs HW.u5assess from js/lessons/u5test.js: load it first');
  var q = A.q, near = A.near, N = A.N, dg = A.dg, D = A.D, toN = A.toN, find = A.find, br = A.br, cap = A.cap, pickR = A.pickR, n360 = A.n360, person = A.person,
    num = A.num, fld = A.fld, wfld = A.wfld, fieldsPart = A.fieldsPart, Fig = A.Fig, PAIRS = A.PAIRS, PAIR_NAMES = A.PAIR_NAMES, PAIR_SHORT = A.PAIR_SHORT, EQUAL = A.EQUAL, tAngle = A.tAngle, pairOfAngles = A.pairOfAngles;

  HW.addCodes({
    'u5x-tan-count': 'Tangram: counted the pieces, not the units', 'u5x-tan-large': 'Tangram: counted a large triangle as 2 units', 'u5x-tan-two': 'Tangram: counted the medium triangle, square or parallelogram as 1 unit',
    'u5x-sq-small': 'Squares in a grid: counted only the small squares', 'u5x-sq-two': 'Squares in a grid: only the small squares and the whole grid', 'u5x-sq-grid': 'Squares in a grid: used the next smaller grid',
    'u5x-sq-square': 'Squares in a rectangle: counted it like a square grid', 'u5x-gave-angle': 'Gave the angle instead of how far it is off 90°', 'u5x-other-90': 'Took the other angle to be 90°',
    'u5x-bis-once': 'Bisected only once', 'u5x-bis-part': 'Gave the smallest part, not the angle asked', 'u5x-wrong-total': 'Used 180° for a right angle (or 90° for a straight line)',
    'u5x-pair-angle': 'Gave the partner angle from a different pair', 'u5x-hanoi-prev': 'Tower: used one disc too few', 'u5x-sq-line': 'Squares: counted the places in one direction only', 'u5x-sq-overlap': 'Squares: did not count overlapping squares'
  });
  HW.addPartial({
    'u5x-tan-count': 'n', 'u5x-tan-large': 'b', 'u5x-tan-two': 'b', 'u5x-sq-small': 'n', 'u5x-sq-two': 'n', 'u5x-sq-grid': 'b', 'u5x-sq-square': 'b', 'u5x-gave-angle': 'b', 'u5x-other-90': 'n',
    'u5x-bis-once': 'b', 'u5x-bis-part': 'b', 'u5x-wrong-total': 'n', 'u5x-pair-angle': 'n', 'u5x-hanoi-prev': 's', 'u5x-sq-line': 'b', 'u5x-sq-overlap': 'b'
  });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }

  /* =====================================================================================================
   * 5.1 Spatial puzzles: tangrams and pentominoes (G1)
   * ===================================================================================================== */
  var TSET = [['large', 4], ['large', 4], ['medium', 2], ['small', 1], ['square', 2], ['small', 1], ['para', 2]];   // the order of the test's TAN_PIECES
  function setText(ix) {
    var c = { large: 0, medium: 0, small: 0, square: 0, para: 0 }; ix.forEach(function (i) { c[TSET[i][0]]++; });
    var out = [];
    if (c.large) out.push(c.large === 2 ? 'both large triangles' : 'one large triangle'); if (c.medium) out.push('the medium triangle'); if (c.square) out.push('the square'); if (c.para) out.push('the parallelogram');
    if (c.small) out.push(c.small === 2 ? 'both small triangles' : 'one small triangle');
    return out.length > 1 ? out.slice(0, -1).join(', ') + ' and ' + out[out.length - 1] : out[0];
  }
  function l1q2(r) {
    var ix = find(function () { return r.sample([0, 1, 2, 3, 4, 5, 6], r.int(3, 5)).sort(); }, function (ix) { var tot = ix.reduce(function (s, i) { return s + TSET[i][1]; }, 0); return tot !== ix.length && ix.some(function (i) { return i < 2; }) && ix.some(function (i) { return [2, 4, 6].indexOf(i) >= 0; }); });
    var tot = ix.reduce(function (s, i) { return s + TSET[i][1]; }, 0), units = ix.map(function (i) { return TSET[i][1]; });
    var lg = ix.filter(function (i) { return i < 2; }).length, tw = ix.filter(function (i) { return [2, 4, 6].indexOf(i) >= 0; }).length;
    return num('Use the tangram pieces, with a <b>small triangle as 1 unit</b> of area. Jordan wants to fill a silhouette with ' + setText(ix) + '. What is the total area of these pieces, in small triangles?' + A.tanSVG(null, { idx: ix }), tot, { dp: 0, after: 'units',
      diag: [{ v: ix.length, code: 'u5x-tan-count', hint: 'Count the <b>area</b> of each piece, not the number of pieces.' }, { v: tot - 2 * lg, code: 'u5x-tan-large', hint: 'A large triangle is 4 small triangles (two medium triangles).' }, { v: tot - tw, code: 'u5x-tan-two', hint: 'The medium triangle, the square and the parallelogram are 2 small triangles each.' }],
      sol: br(['Small 1, medium / square / parallelogram 2, large 4 (the whole square is 16).', 'Total: ' + t(units.join('+') + '=' + tot) + ' units. A silhouette of ' + tot + ' units could work; any other area rules this set out.']),
      hints: ['Picture each piece covered with small triangles.', 'Small 1, medium 2, square 2, parallelogram 2, large 4.'], text: 'area of a set of tangram pieces' });
  }
  function gridSVG(m, n) { var fg = new Fig(), cs = 26; for (var i = 0; i <= n; i++) fg.line([i * cs, 0], [i * cs, m * cs], { width: 1.6 }); for (var j = 0; j <= m; j++) fg.line([0, j * cs], [n * cs, j * cs], { width: 1.6 }); return fg.svg({ width: n * cs + 16, aria: m + ' by ' + n + ' grid' }); }
  function sqCount(m, n) { var s = 0, rows = []; for (var k = 1; k <= Math.min(m, n); k++) { var c = (m - k + 1) * (n - k + 1); rows.push([k, c]); s += c; } return { s: s, rows: rows }; }
  function sqTable(rows) { return A.wrapFig('<table style="border-collapse:collapse;font-size:0.95em"><tr><th style="border:1px solid currentColor;padding:3px 8px">Size</th>' + rows.map(function (x) { return '<td style="border:1px solid currentColor;padding:3px 8px">' + x[0] + ' by ' + x[0] + '</td>'; }).join('') + '</tr><tr><th style="border:1px solid currentColor;padding:3px 8px">How many</th>' + rows.map(function (x) { return '<td style="border:1px solid currentColor;padding:3px 8px;text-align:center">' + x[1] + '</td>'; }).join('') + '</tr></table>'); }
  function l1q3(r) {
    var n = r.int(4, 9), c = sqCount(n, n), prev = sqCount(n - 1, n - 1).s;
    if (r.chance(0.4)) {
      var k = r.int(2, n - 1), m = n - k + 1, ans = m * m;
      return num('How many ' + k + ' by ' + k + ' squares are in this ' + n + ' by ' + n + ' grid? (They may overlap.)' + gridSVG(n, n), ans, { dp: 0, after: 'squares',
        diag: [{ v: m, code: 'u5x-sq-line', hint: 'That is the number of places across. The square can also start in ' + m + ' places down: multiply.' }, { v: Math.floor(n / k) * Math.floor(n / k), code: 'u5x-sq-overlap', hint: 'The squares may overlap: slide a ' + k + ' by ' + k + ' square one step at a time.' }, { v: n * n, code: 'u5x-sq-small', hint: 'That counts the 1 by 1 squares. Count the ' + k + ' by ' + k + ' squares.' }],
        sol: br(['A ' + k + ' by ' + k + ' square can start in ' + t(n + '-' + k + '+1=' + m) + ' places across and ' + m + ' places down.', t(m + '\\times ' + m + '=' + ans) + ' squares.']),
        hints: ['Slide a ' + k + ' by ' + k + ' square across the top row: how many places does it fit?', 'Then the same number of places down: multiply.'], text: 'k by k squares in a grid' });
    }
    return num('How many squares of <b>any</b> size are in this ' + n + ' by ' + n + ' grid? (Make a systematic list by the size of the square.)' + gridSVG(n, n), c.s, { dp: 0, after: 'squares',
      diag: [{ v: n * n, code: 'u5x-sq-small', hint: 'The bigger squares count too: 2 by 2, 3 by 3, … up to the whole grid.' }, { v: n * n + 1, code: 'u5x-sq-two', hint: 'There are squares of every size in between too: 2 by 2, 3 by 3, …' }, { v: prev, code: 'u5x-sq-grid', hint: 'That is the count for a ' + (n - 1) + ' by ' + (n - 1) + ' grid. Add the next square number, ' + t(n + '^2') + '.' }],
      sol: br([sqTable(c.rows), 'A k by k square fits in ' + t('(' + n + '-k+1)') + ' places across and the same down. Total: ' + t(c.rows.map(function (x) { return x[1]; }).join('+') + '=' + c.s) + '.', 'Pattern: ' + t('1^2+2^2+\\dots+' + n + '^2=' + c.s) + '.']),
      hints: ['List by size: 1 by 1, 2 by 2, 3 by 3, …', 'A 2 by 2 square can start in how many places across? How many down?'], text: 'squares in a square grid' });
  }
  function l1q4(r) {
    var s = find(function () { var m = r.int(2, 5), n = r.int(m + 1, 9); return { m: m, n: n }; }, function () { return true; }), c = sqCount(s.m, s.n), sq = sqCount(s.m, s.m).s;
    return num('How many squares of <b>any</b> size are in this ' + s.m + ' by ' + s.n + ' grid of squares?' + gridSVG(s.m, s.n), c.s, { dp: 0, after: 'squares',
      diag: [{ v: s.m * s.n, code: 'u5x-sq-small', hint: 'The bigger squares count too: 2 by 2 and up.' }, { v: sq, code: 'u5x-sq-square', hint: 'The grid is a rectangle: a 2 by 2 square can start in ' + (s.n - 1) + ' places across but only ' + (s.m - 1) + ' down.' }],
      sol: br([sqTable(c.rows), 'A k by k square fits in ' + t('(' + s.n + '-k+1)') + ' places across and ' + t('(' + s.m + '-k+1)') + ' down: ' + c.rows.map(function (x) { return t((s.n - x[0] + 1) + '\\times ' + (s.m - x[0] + 1) + '=' + x[1]); }).join(', ') + '.', 'Total: ' + t(c.rows.map(function (x) { return x[1]; }).join('+') + '=' + c.s) + '. (No square can be bigger than ' + s.m + ' by ' + s.m + '.)']),
      hints: ['Make a systematic list by size. The biggest square is ' + s.m + ' by ' + s.m + '.', 'For each size, count the places across × the places down.'], text: 'squares in a rectangle grid' });
  }
  HW.defineExit({ lesson: 'u5l1', outcome: 'G1', calc: true, blurb: 'Spatial puzzles: the area of a tangram piece and of a set of pieces, and counting squares of every size in a grid.',
    questions: [Q(1, 'G1', 'BEG', function (r) { return A.tanPart(r); }, 'Area of a tangram piece'), Q(2, 'G1', 'PRG', l1q2, 'Area of a set of tangram pieces'),
      Q(3, 'G1', 'PRG', l1q3, 'Squares in an n by n grid'), Q(4, 'G1', 'MAS', l1q4, 'Squares in a rectangle grid')] });

  /* =====================================================================================================
   * 5.2 Spatial games and strategies (G1)
   * ===================================================================================================== */
  function l2q3(r) {
    var n = r.int(4, 12), mv = Math.pow(2, n) - 1, who = r.pick(['A tower puzzle has', 'A puzzle app’s tower game has', 'A giant tower puzzle at a science centre has']);
    return num('<b>The tower puzzle.</b> ' + who + ' ' + n + ' discs on peg A, biggest at the bottom. Move the whole tower to peg C, one disc at a time, never putting a disc on a smaller one. What is the fewest number of moves?', mv, { dp: 0, after: 'moves',
      diag: [{ v: Math.pow(2, n), code: 'u5t-hanoi-pow', hint: 'Fewest moves = ' + t('2^n-1') + ': one less than ' + t('2^{' + n + '}') + '.' }, { v: 2 * n - 1, code: 'u5t-hanoi-add2', hint: 'Each disc does not add 2 moves: 1, 3, 7, 15, … each is double the one before, plus 1.' },
        { v: Math.pow(2, n - 1) - 1, code: 'u5x-hanoi-prev', hint: 'That is for ' + (n - 1) + ' discs. Double it and add 1 for ' + n + ' discs.' }],
      sol: br(['Move the top ' + (n - 1) + ' discs off, move the biggest disc once, then move the ' + (n - 1) + ' discs back on: the moves double and add 1 (1, 3, 7, 15, 31, …).', 'Fewest moves = ' + t('2^{' + n + '}-1=' + HW.fmt(String(Math.pow(2, n))) + '-1=' + HW.fmt(String(mv))) + '.']),
      hints: ['1 disc: 1 move, 2 discs: 3, 3 discs: 7, 4 discs: 15. Look for the pattern.', 'Fewest moves = 2ⁿ − 1.'], text: 'tower puzzle fewest moves' });
  }
  HW.defineExit({ lesson: 'u5l2', outcome: 'G1', calc: true, blurb: 'Games: the take-away game, tic-tac-toe (win or block), the tower puzzle, and the race game (first or second).',
    questions: [Q(1, 'G1', 'BEG', function (r) { return A.takePart(r); }, 'Take-away game'), Q(2, 'G1', 'PRG', function (r) { return A.tttPart(r); }, 'Tic-tac-toe: win or block'),
      Q(3, 'G1', 'PRG', l2q3, 'Tower puzzle: fewest moves'), Q(4, 'G1', 'MAS', function (r) { return A.racePart(r); }, 'Race to N: first or second')] });

  /* =====================================================================================================
   * 5.3 Measuring, drawing and classifying angles; polygons (G6)
   * ===================================================================================================== */
  var REG = [['A stop sign is a regular octagon.', 8], ['A loonie has 11 equal sides and 11 equal angles.', 11], ['A honeycomb cell is a regular hexagon.', 6], ['A park gazebo floor is a regular heptagon (7 sides).', 7],
    ['A table top is a regular nonagon (9 sides).', 9], ['A window is a regular decagon (10 sides).', 10], ['A clock face is a regular dodecagon (12 sides).', 12], ['A tile is a regular pentagon.', 5], ['A fountain is a regular polygon with 15 sides.', 15], ['A carousel floor is a regular polygon with 18 sides.', 18], ['A trophy base is a regular polygon with 14 sides.', 14]];
  function l3q4(r) {
    var c = r.chance(0.5) ? r.pick(REG) : (function () { var n0 = r.pick([13, 16, 17, 19, 20, 21, 22, 24, 25, 30, 36]); return ['A regular polygon has ' + n0 + ' equal sides and ' + n0 + ' equal angles.', n0]; })(), n = c[1], S = (n - 2) * 180, e = S / n;
    return num(c[0] + ' What is the size of each of its angles? (Round to the nearest tenth if needed.)', e, { dp: 1, after: '°',
      diag: [{ v: S, code: 'u5t-poly-gave-sum', hint: 'That is the sum of all ' + n + ' angles. The angles are equal: divide by ' + n + '.' }, { v: 360 / n, code: 'u5t-poly-ext', hint: 'Find the angle sum first, ' + t('(n-2)\\times 180^\\circ') + ', then divide by the number of angles.' }, { v: 180, code: 'u5t-poly-n180', hint: 'The angle sum is ' + t('(n-2)\\times 180^\\circ') + ', not ' + t('n\\times 180^\\circ') + '.' }],
      sol: br(['Sum: ' + t('(' + n + '-2)\\times 180^\\circ=' + HW.fmt(String(S)) + '^\\circ'), 'Each angle: ' + t(HW.fmt(String(S)) + '^\\circ\\div ' + n + toN(e, 1) + '^\\circ') + ' (obtuse ✓)']),
      hints: ['Angle sum = (n − 2) × 180°.', 'A regular polygon has equal angles: divide the sum by n.'], text: 'each angle of a regular polygon' });
  }
  HW.defineExit({ lesson: 'u5l3', outcome: 'G6', calc: true, blurb: 'Angles: reading a protractor, reflex angles, the missing angle of a polygon, and each angle of a regular polygon.',
    questions: [Q(1, 'G6', 'BEG', function (r) { return A.protPart(r); }, 'Read a protractor'), Q(2, 'G6', 'PRG', function (r) { return A.protReflexPart(r, { rot: false }); }, 'Protractor reading and the reflex angle'),
      Q(3, 'G6', 'PRG', function (r) { return A.polyMissPart(r, { ns: [4, 5, 6] }); }, 'Missing angle of a polygon'), Q(4, 'G6', 'MAS', l3q4, 'Each angle of a regular polygon')] });

  /* =====================================================================================================
   * 5.4 Estimating angles; true bearings (G6)
   * ===================================================================================================== */
  HW.defineExit({ lesson: 'u5l4', outcome: 'G6', calc: true, blurb: 'Estimating an angle with referents, directions as true bearings, a bearing on a map and the bearing back, and the angle between two legs of a route.',
    questions: [Q(1, 'G6', 'BEG', function (r) { return A.estPart(r); }, 'Estimate an angle'), Q(2, 'G6', 'PRG', function (r) { return A.bearWordsPart(r); }, 'A direction as a true bearing'),
      Q(3, 'G6', 'PRG', function (r) { return A.mapBearPart(r); }, 'Map bearing and the bearing back'), Q(4, 'G6', 'MAS', function (r) { return A.routePart(r); }, 'Angle between two legs of a route')] });

  /* =====================================================================================================
   * 5.5 Copying and bisecting angles; perpendicular lines (G6, G5)
   * ===================================================================================================== */
  var LEGS = [['Mateo is building a table. He checks one leg and finds that it makes an angle of', 'with the underside of the tabletop', 'leg'], ['A fence post should stand perpendicular to the level ground. Kayla measures the angle between the post and the ground:', '', 'post'],
    ['A shelf bracket should be perpendicular to the wall. Omar measures the angle between the bracket and the wall:', '', 'bracket'], ['A wall stud should be perpendicular to the floor plate. The angle between them is', '', 'stud']];
  function l5q2(r) {
    var c = r.pick(LEGS), e = pickR(r, [0.5, 4.5, 0.5]), up = r.chance(0.6), ang = up ? 90 + e : 90 - e, other = 180 - ang;
    var specs = [fld('Off by:', e, { dp: 1, noPlaces: true, after: '°', name: 'Off by', diag: [{ v: ang, code: 'u5x-gave-angle', hint: 'How far is ' + D(ang) + ' from 90°? Subtract.' }] }),
      fld('Other angle:', other, { dp: 1, noPlaces: true, after: '°', name: 'Other angle', diag: [{ v: 90, code: 'u5x-other-90', hint: 'The ' + c[2] + ' is not perpendicular, so the other angle is not 90°: the two angles make a straight line (180°).' }, { v: 90 - ang, code: 'u5x-wrong-total', hint: 'The two angles side by side make a <b>straight line</b>: 180°.' }] })];
    return fieldsPart(c[0] + ' ' + D(ang) + (c[1] ? ' ' + c[1] : '') + '. By how many degrees is it off from perpendicular? The ' + c[2] + ' makes a second angle on the other side, along the same straight line. What is that angle?', specs,
      br(['Perpendicular means exactly 90°: ' + t(up ? dg(ang) + '-90^\\circ=' + dg(e) : '90^\\circ-' + dg(ang) + '=' + dg(e)) + ' off.', 'The two angles make a straight line: ' + t('180^\\circ-' + dg(ang) + '=' + dg(other)) + '.']),
      ['Perpendicular means exactly 90°.', 'Angles side by side on a straight line add to 180°.'], 'not quite perpendicular');
  }
  var PARX = ['the two rails of a straight railway track', 'the top and bottom edges of a door', 'two lines on a page of lined paper', 'the two side rails of a ladder', 'the long sides of a hockey rink'];
  var PERPX = ['a wall and the floor', 'a flagpole standing straight up and the level ground', 'the two edges at the corner of a sheet of paper', 'the side and the bottom of a bookshelf'];
  var NEITHERX = ['the two straight edges of a slice of pizza', 'the hands of a clock at 2:00', 'a ladder leaning on a wall and the floor', 'the two sloped sides of a roof'];
  function l5q3(r) {
    var k = r.int(0, 9), ans, txt, why;
    if (k < 4) { var v = r.chance(0.3) ? 90 : find(function () { return r.int(20, 160); }, function (x) { return x !== 90; }); ans = v === 90 ? 'perpendicular' : 'neither'; txt = 'Two straight lines meet at an angle of ' + D(v) + '.'; why = v === 90 ? 'They meet at exactly 90°: <b>perpendicular</b>.' : 'They meet, so they are not parallel, and ' + D(v) + ' is not 90°: <b>neither</b>.'; }
    else if (k < 7) { var d1 = pickR(r, [1.5, 4.5, 0.1]), same = r.chance(0.45), d2 = same ? d1 : q(d1 + (r.chance(0.5) ? 1 : -1) * pickR(r, [0.2, 0.9, 0.1])); ans = same ? 'parallel' : 'neither'; txt = 'Two straight lines on a page do not touch. Measured straight across, they are ' + t(N(d1) + '\\text{ cm}') + ' apart at one end and ' + t(N(d2) + '\\text{ cm}') + ' apart at the other end.'; why = same ? 'The gap is the same in both places, so they never meet: <b>parallel</b>.' : 'The gap changes, so the lines would meet if you made them longer: they are not parallel. They do not meet at 90° on the page either: <b>neither</b>.'; }
    else { var g = r.int(0, 2); ans = ['parallel', 'perpendicular', 'neither'][g]; var c = r.pick([PARX, PERPX, NEITHERX][g]); txt = 'Think of ' + c + ' as two straight lines.'; why = ['They never meet and stay the same distance apart: <b>parallel</b>.', 'They meet at 90°: <b>perpendicular</b>.', 'They meet, but not at 90°: <b>neither</b>.'][g]; }
    var all = ['parallel', 'perpendicular', 'neither'];
    return fieldsPart(txt + ' Are the lines parallel, perpendicular or neither?', [wfld('Answer:', { name: 'Answer', ph: 'parallel, perpendicular or neither', right: [ans], wrongs: all.filter(function (x) { return x !== ans; }), choices: 'parallel, perpendicular or neither', key: ans, bad: [all.filter(function (x) { return x !== ans; })[0]],
      why: 'Do the lines meet (or would they, if made longer)? If not: parallel. If they do, is the angle exactly 90°?' })], why,
      ['Parallel lines never meet: the gap stays the same.', 'Perpendicular lines meet at exactly 90°. Any other angle: neither.'], 'parallel, perpendicular or neither');
  }
  function l5q4(r) {
    var nm = r.pick(A.LETS.filter(function (L) { return L.indexOf('D') < 0 && L.indexOf('E') < 0; })), back = r.chance(0.5), ABC = '\\angle ' + nm.join(''), w, e, ans, prompt, diag, sol;
    if (back) { e = pickR(r, [8, 40, 0.5]); w = 4 * e; ans = w; prompt = 'Ray ' + nm[1] + 'D bisects ' + t(ABC) + '. Then ray ' + nm[1] + 'E bisects ' + t('\\angle D' + nm[1] + nm[2]) + '. If ' + t('\\angle E' + nm[1] + nm[2] + '=' + dg(e)) + ', find ' + t(ABC) + '.';
      diag = [{ v: 2 * e, code: 'u5x-bis-once', hint: 'That is ' + t('\\angle D' + nm[1] + nm[2]) + '. It is half of ' + t(ABC) + ': double again.' }, { v: e / 4, code: 'u5t-bis-way', hint: 'Work backward: each bisect halves the angle, so going back you <b>double</b>.' }, { v: 3 * e, code: 'u5x-bis-part', hint: 'Two bisects: ' + t(ABC) + ' is 2 × 2 = 4 times the small angle.' }];
      sol = br([t('\\angle D' + nm[1] + nm[2] + '=2\\times ' + dg(e) + '=' + dg(2 * e)) + ' (' + nm[1] + 'E bisects it)', t(ABC + '=2\\times ' + dg(2 * e) + '=' + dg(w)) + ' (' + nm[1] + 'D bisects it)']); }
    else { w = find(function () { return 4 * r.int(10, 40); }, function (x) { return x !== 90 && x !== 180; }); e = w / 4; ans = 3 * w / 4; prompt = t(ABC + '=' + dg(w)) + '. Ray ' + nm[1] + 'D bisects ' + t(ABC) + '. Then ray ' + nm[1] + 'E bisects ' + t('\\angle D' + nm[1] + nm[2]) + '. Find ' + t('\\angle ' + nm[0] + nm[1] + 'E') + '.';
      diag = [{ v: w / 2, code: 'u5x-bis-once', hint: 'That is ' + t('\\angle ' + nm[0] + nm[1] + 'D') + '. Add the part from D to E too.' }, { v: e, code: 'u5x-bis-part', hint: 'That is ' + t('\\angle D' + nm[1] + 'E') + ' (or ' + t('\\angle E' + nm[1] + nm[2]) + '). ' + t('\\angle ' + nm[0] + nm[1] + 'E') + ' goes from arm ' + nm[1] + nm[0] + ' to ray ' + nm[1] + 'E.' }];
      sol = br([t('\\angle ' + nm[0] + nm[1] + 'D=\\angle D' + nm[1] + nm[2] + '=' + dg(w) + '\\div 2=' + dg(w / 2)), t('\\angle D' + nm[1] + 'E=\\angle E' + nm[1] + nm[2] + '=' + dg(w / 2) + '\\div 2=' + dg(e)), t('\\angle ' + nm[0] + nm[1] + 'E=' + dg(w / 2) + '+' + dg(e) + '=' + dg(ans))]); }
    var base = r.int(0, 30), fig = G.angleSVG({ rays: [{ dir: base, name: nm[2] }, { dir: base + w / 4, name: 'E', len: 96 }, { dir: base + w / 2, name: 'D', len: 96 }, { dir: base + w, name: nm[0] }], arcs: [], vertexName: nm[1], width: 230 });
    return num(prompt + fig, ans, { dp: 1, noPlaces: true, after: '°', diag: diag, sol: sol, hints: ['Bisect means cut into two equal angles.', back ? 'Work backward: double, then double again.' : 'Find each half step by step, then add the parts you need.'], text: 'bisect twice' });
  }
  HW.defineExit({ lesson: 'u5l5', outcome: 'G6', calc: true, blurb: 'Bisecting angles, a leg or post that is not quite perpendicular, parallel / perpendicular / neither, and an angle bisected twice.',
    questions: [Q(1, 'G6', 'BEG', function (r) { return A.bisectPart(r); }, 'Bisect an angle'), Q(2, 'G5', 'PRG', l5q2, 'Not quite perpendicular'),
      Q(3, 'G5', 'PRG', l5q3, 'Parallel, perpendicular or neither'), Q(4, 'G6', 'MAS', l5q4, 'An angle bisected twice')] });

  /* =====================================================================================================
   * 5.6 Angle partners: complementary, supplementary, vertically opposite (G5)
   * ===================================================================================================== */
  function l6q2(r) {
    var right = r.chance(0.4), phi = r.int(0, 40), rays, arcs, ans, diag, sol, eq;
    if (right) {
      var p = find(function () { return r.int(15, 75); }, function (x) { return x !== 45; }); ans = 90 - p;
      rays = [phi, phi + p, phi + 90]; arcs = [{ a: phi, b: phi + 90, right: true }, { a: phi, b: phi + p, label: p + '°', r: 44 }, { a: phi + p, b: phi + 90, label: 'x', r: 34 }];
      eq = 'x+' + dg(p) + '=90^\\circ'; diag = [{ v: 180 - p, code: 'u5x-wrong-total', hint: 'The square mark means a <b>right angle</b>: the two angles add to 90°.' }];
      sol = br(['Right angle: ' + t(eq), t('x=90^\\circ-' + dg(p) + '=' + dg(ans)), 'Check: ' + t(ans + '+' + p + '=90') + ' ✓']);
    } else {
      var two = r.chance(0.5), s = find(function () { var a1 = r.int(25, 120), a2 = two ? r.int(25, 100) : 0; return { a1: a1, a2: a2, x: 180 - a1 - a2 }; }, function (s) { return s.x >= 22 && (!two || (s.a1 !== s.a2 && s.x !== 90 && s.a1 !== 90 && s.a2 !== 90)) && s.x !== 90 && s.a1 !== 90; });
      ans = s.x;
      if (two) { rays = [phi, phi + s.a1, phi + s.a1 + s.x, phi + 180]; arcs = [{ a: phi, b: phi + s.a1, label: s.a1 + '°' }, { a: phi + s.a1, b: phi + s.a1 + s.x, label: 'x' }, { a: phi + s.a1 + s.x, b: phi + 180, label: s.a2 + '°' }]; eq = dg(s.a1) + '+x+' + dg(s.a2) + '=180^\\circ'; }
      else { rays = [phi, phi + s.a1, phi + 180]; arcs = [{ a: phi, b: phi + s.a1, label: s.a1 + '°' }, { a: phi + s.a1, b: phi + 180, label: 'x' }]; eq = 'x+' + dg(s.a1) + '=180^\\circ'; }
      diag = [{ v: 360 - s.a1 - s.a2, code: 'u5t-point-360', hint: 'The angles make a <b>straight line</b>: 180°, not 360°.' }];
      if (90 - s.a1 - s.a2 > 0) diag.push({ v: 90 - s.a1 - s.a2, code: 'u5x-wrong-total', hint: 'There is no square mark: the angles make a <b>straight line</b>, 180°.' });
      sol = br(['Straight line: ' + t(eq), t('x=180^\\circ-' + dg(s.a1) + (two ? '-' + dg(s.a2) : '') + '=' + dg(ans)), 'Check: ' + t((two ? s.a1 + '+' + ans + '+' + s.a2 : ans + '+' + s.a1) + '=180') + ' ✓']);
    }
    var fig = G.angleSVG({ rays: rays.map(function (d) { return { dir: d, len: 100 }; }), arcs: arcs, width: 240 });
    return num('Find ' + t('x') + '. (The square mark means a right angle.)' + fig, ans, { dp: 0, after: '°', diag: diag, sol: sol, hints: ['Is it a right angle (square mark, 90°) or a straight line (180°)?', 'Write an equation, then subtract.'], text: 'missing angle: corner or straight line' });
  }
  function l6q4(r) {
    var s = find(function () {
      var v = r.int(30, 150), k = r.chance(0.5) ? 2 : 1, E = k === 2 ? v : 180 - v, a = r.int(2, 5), x = r.int(6, 35), b = E - a * x;
      return { v: v, k: k, E: E, a: a, x: x, b: b };
    }, function (s) { return Math.abs(s.v - 90) > 6 && s.b !== 0 && s.b >= -30 && s.b <= 45; });
    var d = r.int(0, 40), e = d + s.v, rays = [d, e, d + 180, e + 180], ex = '(' + s.a + 'x ' + (s.b > 0 ? '+ ' + s.b : '− ' + Math.abs(s.b)) + ')°', exT = s.a + 'x' + (s.b > 0 ? '+' + s.b : '-' + Math.abs(s.b));
    var ysec = s.k === 2 ? 1 : 3, y = 180 - s.v;
    var arcs = [{ a: rays[0], b: rays[1], label: s.v + '°' }, { a: rays[s.k], b: rays[(s.k + 1) % 4], label: ex }, { a: rays[ysec], b: rays[(ysec + 1) % 4], label: 'y' }];
    var fig = G.angleSVG({ rays: rays.map(function (x) { return { dir: x, len: 110 }; }), arcs: arcs, width: 260 }), eqv = s.k === 2;
    var wrongE = eqv ? 180 - s.v : s.v;
    var specs = [fld(t('x') + ' =', s.x, { dp: 1, noPlaces: true, name: 'x', diag: [{ v: (wrongE - s.b) / s.a, code: 'u5t-alg-rule', hint: eqv ? 'The two angles are across from each other (vertically opposite): they are <b>equal</b>.' : 'The two angles are next to each other on a straight line: they <b>add to 180°</b>.' },
      { v: (s.E + s.b) / s.a, code: 'u5t-alg-sign', hint: 'Undo the ' + (s.b > 0 ? '+ ' + s.b + ' by subtracting' : '− ' + Math.abs(s.b) + ' by adding') + ' on both sides.' }, { v: s.E - s.b, code: 'u5t-alg-div', hint: 'You found ' + s.a + 'x. Now divide by ' + s.a + '.' }] }),
      fld(t('y') + ' =', y, { after: '°', name: 'y', diag: [{ v: s.v, code: 'u5t-vo-supp', hint: 'y is next to the ' + s.v + '° angle on a straight line: they add to 180°.' }] })];
    return fieldsPart('Two straight lines cross. Find ' + t('x') + ' and ' + t('y') + '.' + fig, specs,
      br([eqv ? 'Vertically opposite angles are equal: ' + t(exT + '=' + s.v) : 'Angles on a straight line add to 180°: ' + t(exT + '+' + s.v + '=180') + ', so ' + t(exT + '=' + s.E), t(s.a + 'x=' + (s.E - s.b)) + ', so ' + t('x=' + (s.E - s.b) + '\\div ' + s.a + '=' + s.x) + '. Check: ' + t(s.a + '(' + s.x + ')' + (s.b > 0 ? '+' + s.b : '-' + Math.abs(s.b)) + '=' + s.E),
        t('y=180^\\circ-' + dg(s.v) + '=' + dg(y)) + ' (on a straight line with the ' + s.v + '° angle)']),
      ['Is the (ax + b)° angle across from the ' + s.v + '° angle, or next to it?', 'Write an equation: undo the + or − first, then divide.'], 'crossing lines with (ax + b)°');
  }
  HW.defineExit({ lesson: 'u5l6', outcome: 'G5', calc: true, blurb: 'Angle partners: complement and supplement, a missing angle in a corner or on a line, three lines through a point, and crossing lines with an algebra angle.',
    questions: [Q(1, 'G5', 'BEG', function (r) { return A.compSuppPart(r); }, 'Complement and supplement'), Q(2, 'G5', 'PRG', l6q2, 'Missing angle: corner or straight line'),
      Q(3, 'G5', 'PRG', function (r) { return A.threeLinesPart(r); }, 'Three lines through a point'), Q(4, 'G5', 'MAS', l6q4, 'Crossing lines with (ax + b)°')] });

  /* =====================================================================================================
   * 5.7 Transversals: naming the angle pairs (G5)
   * ===================================================================================================== */
  var SIX = ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'];
  function tilted(r) { return find(function () { return r.int(40, 140); }, function (x) { return x < 82 || x > 98; }); }
  function whyPair(type) { return ({ corresponding: 'different crossings, the same position (one interior, one exterior, same side of t: an F)', 'alt-int': 'different crossings, both between the lines, opposite sides of t (a Z)', 'alt-ext': 'different crossings, both outside the lines, opposite sides of t', 'int-same': 'different crossings, both between the lines, the same side of t (a C or U)', 'ext-same': 'different crossings, both outside the lines, the same side of t', 'vert-opp': 'the same crossing, across from each other' })[type]; }
  function l7q1(r) {
    var type = r.pick(SIX), pr = pairOfAngles(r, type), par = r.chance(0.5), svg = G.transversalSVG({ parallel: par, tilt: tilted(r), skew: par ? 0 : r.pick([-14, -10, 10, 14]), numbers: true, width: 290 });
    return A.pairPart('Name the pair of angles ' + t('\\angle ' + pr[0]) + ' and ' + t('\\angle ' + pr[1]) + '.' + svg, type, { sol: '∠' + pr[0] + ' and ∠' + pr[1] + ': ' + whyPair(type) + ', so they are <b>' + PAIR_NAMES[type] + '</b>.',
      hints: ['Same crossing or different crossings?', 'Interior or exterior? The same side of t or opposite sides?'], text: 'name the pair (typed)' });
  }
  function l7q2(r) {
    var type = r.pick(SIX), pr = pairOfAngles(r, type), k = pr[0], ans = pr[1], svg = G.transversalSVG({ parallel: r.chance(0.5), tilt: tilted(r), numbers: true, width: 290 }), diag = [];
    SIX.forEach(function (t2) { if (t2 === type) return; PAIRS[t2].forEach(function (p) { var o = p[0] === k ? p[1] : p[1] === k ? p[0] : null; if (o != null && o !== ans) diag.push({ v: o, code: 'u5x-pair-angle', hint: '∠' + o + ' is ' + PAIR_NAMES[t2].replace(/ angles?/, '') + ' to ∠' + k + ', not ' + PAIR_SHORT[type] + '.' }); }); });
    return num('Which angle is <b>' + PAIR_SHORT[type] + '</b> to ' + t('\\angle ' + k) + '? Type its number.' + svg, ans, { dp: 0, diag: diag,
      sol: '∠' + ans + ': ' + whyPair(type) + ' as ∠' + k + '.', hints: ['Angles 1–4 are at the top crossing, 5–8 at the bottom, clockwise from the upper left.', type === 'vert-opp' ? 'Same crossing, across the X.' : 'Look at the other crossing.'], text: 'which angle is the partner' });
  }
  var LETTERS = 'bcdefghk'.split('');   // no a (a word) and no t (the transversal)
  function lettered(r, par) {
    var L = r.shuffle(LETTERS), lab = {}; for (var k = 1; k <= 8; k++) lab[k] = L[k - 1];
    return { L: L, lab: lab, svg: G.transversalSVG({ parallel: par, tilt: tilted(r), skew: par ? 0 : r.pick([-12, 12]), angles: lab, numbers: false, width: 290 }) };
  }
  function l7q3(r) {
    var type = r.pick(SIX), pr = pairOfAngles(r, type), s = lettered(r, r.chance(0.5)), a = s.lab[pr[0]], b = s.lab[pr[1]];
    return A.pairPart('The angles are named with letters, in no special order. Name the pair of angles ' + t('\\angle ' + a) + ' and ' + t('\\angle ' + b) + '.' + s.svg, type, { sol: '∠' + a + ' and ∠' + b + ': ' + whyPair(type) + ', so they are <b>' + PAIR_NAMES[type] + '</b>.',
      hints: ['Look at <b>where</b> each angle is, not at its letter.', 'Same crossing? Interior or exterior? Which side of t?'], text: 'name the pair (lettered diagram)' });
  }
  function l7q4(r) {
    var s = lettered(r, true), t1 = r.pick(['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same']), p1 = pairOfAngles(r, t1);
    var t2 = r.pick(['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'].filter(function (x) { return x !== t1; })), p2 = pairOfAngles(r, t2), kL = s.lab[p2[0]], ansL = s.lab[p2[1]];
    var specs = [A.pairFld('Pair ∠' + s.lab[p1[0]] + ', ∠' + s.lab[p1[1]] + ':', t1, { name: 'Pair name' }),
      wfld('Angle ' + PAIR_SHORT[t2] + ' to ∠' + kL + ':', { name: 'Letter', ph: 'a letter', right: [ansL], wrongs: LETTERS.filter(function (x) { return x !== ansL; }), choices: 'one of the letters in the diagram', key: ansL, bad: [LETTERS.filter(function (x) { return x !== ansL && x !== kL; })[0]],
        why: 'Find ∠' + kL + ' first. ' + (t2 === 'vert-opp' ? 'Its partner is at the same crossing, across the X.' : 'Its partner is at the other crossing: ' + whyPair(t2) + '.') })];
    return fieldsPart('The angles are named with letters, in no special order. (a) Name the pair ' + t('\\angle ' + s.lab[p1[0]]) + ' and ' + t('\\angle ' + s.lab[p1[1]]) + '. (b) Which angle is ' + PAIR_SHORT[t2] + ' to ' + t('\\angle ' + kL) + '? Type its letter.' + s.svg, specs,
      br(['(a) ∠' + s.lab[p1[0]] + ' and ∠' + s.lab[p1[1]] + ': ' + whyPair(t1) + ': <b>' + PAIR_NAMES[t1] + '</b>.', '(b) ∠' + ansL + ': ' + whyPair(t2) + ' as ∠' + kL + '.']),
      ['Look at where each angle is, not at its letter.', 'Same crossing? Interior or exterior? Which side of t?'], 'lettered diagram: a pair and a partner');
  }
  HW.defineExit({ lesson: 'u5l7', outcome: 'G5', calc: true, blurb: 'Transversals: naming pairs of angles (corresponding, alternate, same-side, vertically opposite) in numbered and lettered diagrams.',
    questions: [Q(1, 'G5', 'BEG', l7q1, 'Name the pair'), Q(2, 'G5', 'PRG', l7q2, 'Which angle is the partner'), Q(3, 'G5', 'PRG', l7q3, 'Name the pair (lettered)'), Q(4, 'G5', 'MAS', l7q4, 'Lettered: a pair and a partner')] });

  /* =====================================================================================================
   * 5.8 Parallel lines and transversals: finding missing angles (G5)
   * ===================================================================================================== */
  function l8find(r, types, level) {
    var type = r.pick(types), pr = type === 'none' ? r.pick([[1, 6], [6, 1], [2, 5], [5, 2], [3, 8], [8, 3], [4, 7], [7, 4]]) : pairOfAngles(r, type), tilt = tilted(r), v = tAngle(pr[0], tilt), ans = tAngle(pr[1], tilt), lab = {}; lab[pr[0]] = v;
    var svg = G.transversalSVG({ parallel: true, tilt: tilt, angles: lab, numbers: true, width: 290 }), eq = type !== 'none' && EQUAL[type];
    var step = type === 'none' ? (function () { var mid = PAIRS.corresponding.filter(function (p) { return p.indexOf(pr[0]) >= 0; })[0], c = mid[0] === pr[0] ? mid[1] : mid[0]; return '∠' + c + ' = ' + v + '° (corresponding to ∠' + pr[0] + '). ∠' + c + ' and ∠' + pr[1] + ' are on a straight line: ' + t('\\angle ' + pr[1] + '=180^\\circ-' + dg(v) + '=' + dg(ans)) + '.'; })() : null;
    return num(t('\\ell_1\\parallel\\ell_2') + ' and ' + t('\\angle ' + pr[0] + '=' + dg(v)) + '. Find ' + t('\\angle ' + pr[1]) + '.' + svg, ans, { dp: 0, after: '°',
      diag: [{ v: 180 - ans, code: 'u5t-rule-swap', hint: type === 'none' ? 'Go in two steps: first an angle that is corresponding (or alternate) to ∠' + pr[0] + ', then the one next to it on a straight line.' : 'These are ' + PAIR_SHORT[type] + ' angles: with parallel lines they ' + (eq ? 'are <b>equal</b>.' : '<b>add to 180°</b>.') }],
      sol: type === 'none' ? step : '∠' + pr[0] + ' and ∠' + pr[1] + ' are ' + PAIR_NAMES[type] + '. The lines are parallel, so they ' + (eq ? 'are equal: ' + t('\\angle ' + pr[1] + '=' + dg(ans)) : 'add to 180°: ' + t('\\angle ' + pr[1] + '=180^\\circ-' + dg(v) + '=' + dg(ans))) + '.',
      hints: ['Name the pair first.', 'Corresponding and alternate: equal. Same side: add to 180°.'], text: level === 'BEG' ? 'parallel lines: an equal pair' : 'parallel lines: a pair that adds to 180°' });
  }
  function l8q3(r) {
    var s = A.parGeom(r, ['corresponding', 'alt-int', 'int-same', 'alt-ext', 'ext-same']), eq = EQUAL[s.type], would = eq ? s.vT : 180 - s.vT, yes = s.par;
    var specs = [wfld('Parallel?', { name: 'Parallel', ph: 'yes or no', right: [yes ? 'yes' : 'no'], wrongs: [yes ? 'no' : 'yes'], choices: 'yes or no', key: yes ? 'yes' : 'no', bad: [yes ? 'no' : 'yes'],
      why: 'Compare the lower angle with what it would have to be for parallel lines. Even 1° off means not parallel.' }),
      fld('It would be:', would, { after: '°', name: 'Would be', diag: [{ v: 180 - would, code: 'u5t-rule-swap', hint: 'These are ' + PAIR_SHORT[s.type] + ' angles: for parallel lines they ' + (eq ? 'are <b>equal</b>.' : '<b>add to 180°</b>.') }] })];
    return fieldsPart('Two lines are cut by a transversal (there are no arrow marks). The two angles are ' + PAIR_NAMES[s.type] + '. (a) Are the lines parallel? (b) If the lines were parallel, what would the lower angle have to be?' + s.svg, specs,
      br(['For parallel lines, ' + PAIR_NAMES[s.type] + ' ' + (eq ? 'are equal, so the lower angle would be ' + D(would) + '.' : 'add to 180°, so the lower angle would be ' + t('180^\\circ-' + dg(s.vT) + '=' + dg(would)) + '.'),
        'It is ' + D(s.vB) + (yes ? ', so the lines <b>are</b> parallel.' : ', not ' + D(would) + ', so the lines are <b>not</b> parallel (made longer, they would meet).')]),
      ['What does the parallel-line rule say for this pair?', 'Check the numbers exactly.'], 'are the lines parallel?');
  }
  HW.defineExit({ lesson: 'u5l8', outcome: 'G5', calc: true, blurb: 'Parallel lines: finding angles with the parallel-line rules, checking whether lines are parallel, and the angle at a bend.',
    questions: [Q(1, 'G5', 'BEG', function (r) { return l8find(r, ['corresponding', 'alt-int', 'alt-ext'], 'BEG'); }, 'Parallel lines: an equal pair'),
      Q(2, 'G5', 'PRG', function (r) { return l8find(r, ['int-same', 'ext-same', 'none'], 'PRG'); }, 'Parallel lines: adds to 180° (one or two steps)'),
      Q(3, 'G5', 'PRG', l8q3, 'Are the lines parallel?'), Q(4, 'G5', 'MAS', function (r) { return A.bendPart(r); }, 'The angle at a bend')] });
})(window);
