/* Math 10-3 · Unit 5 · Lesson 9 — Unit 5 Review (G1, G5, G6 per part)
 * Assignment 9 (u5_l09.tex: Part A 1–13, Part B 14–21, Part C 22–25) and the Lesson 9 Extra Practice (u5_ep09.tex,
 * Practice Test 2: A 1–5, B 6–12, C 13–15). Set up like the unit test. Every part is a generator: the same situation and
 * difficulty as the booklet item with new numbers (the worked examples' numbers left out).
 * Outcomes per question: G1 spatial puzzles and games (tetrominoes, Tower of Hanoi, tangram, race games); G6 angles
 * (classifying, protractor readings, referents, polygon angle sums, bearings, bisecting and copying, clock angles);
 * G5 angle partners and parallel lines (complements/supplements, vertically opposite, pair names, parallel-line rules).
 * Uses HW.u5tk (u5l7.js) and HW.u5pk (u5l8.js) for the transversal figures and checkers, and HW.geo for protractors,
 * angles, polygons and bearings; the puzzle/game items are built here.
 * Conversions: "classify each angle" → a table of choices; "read the protractor and classify" → the reading (±1°) and the
 * type typed; "estimate using referents" → multiple choice of estimates; "sketch an angle of about 120°" → which referents
 * make it; "fill in the table (none)" → boxes that accept "none"; "draw diagonals… how many triangles" → boxes; "bisect…
 * measure each half" → the reading (±1°) and the half (±0.5°); "describe another way" → multiple choice; "which shapes are
 * the same / what could Kim do" → multiple choice; "which squares do you want to land on" → tap the squares; "list the
 * steps" → put the steps in order; "explain" → multiple choice of reasons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, TK = HW.u5tk, PK = HW.u5pk;
  var A = TK.A, D = TK.D, find = TK.find, LF = TK.LF, RAD = Math.PI / 180, PN = G.PAIR_NAMES, PAIRS = G.PAIRS;
  var KINDS = ['acute', 'right', 'obtuse', 'straight', 'reflex'];
  var KWHY = { acute: 'less than 90°', right: 'exactly 90°', obtuse: 'between 90° and 180°', straight: 'exactly 180°', reflex: 'between 180° and 360°' };
  function bt(b) { return G.bearingText(b) + '°'; }
  function n360(a) { return ((a % 360) + 360) % 360; }

  /* the type of an angle, typed */
  function typeChk(deg) {
    var kind = G.kindOf(deg);
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '');
      if (!s) return form('empty', 'Type the type of angle (acute, right, obtuse, straight or reflex).');
      var hit = KINDS.filter(function (k) { return s === k || s === k + 'angle' || (s.length >= 4 && k.indexOf(s) === 0); })[0];
      if (!hit) { var near = KINDS.filter(function (k) { var a = s, b = k, d = Math.abs(a.length - b.length); for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) d++; return d <= 2; })[0]; hit = near; }
      if (!hit) return form('u5l9-type', 'Use one of the words: acute, right, obtuse, straight or reflex.');
      if (hit === kind) return ok();
      return wrong('u5l9-kind-' + hit, (/^[aeiou]/.test(hit) ? 'An ' : 'A ') + hit + ' angle is ' + KWHY[hit] + '. Compare ' + D(deg) + ' with 90° and 180°.');
    };
  }
  /* a number of degrees, or "none" when ans is null */
  function noneOr(ans, o) {
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1');
      var isNone = /^(none|no|n\/a|na|no complement|there is none|doesn'?t exist|-)$/.test(s.replace(/[.\s]+$/, ''));
      if (ans == null) { if (isNone) return ok(); if (!s) return form('empty', 'Type a number, or “none”.'); return wrong('u5l9-none', o.noneHint || 'An angle bigger than 90° has <b>no</b> complement: type “none”.'); }
      if (isNone) return wrong('u5l9-not-none', 'There is one: ' + (o.what || 'work it out') + '.');
      return G.angleChk(ans, { supplementTrap: false, alts: o.alts || [] })(resp);
    };
  }
  /* the four parts of a polyomino picture: cells [[x, y]] (y up), drawn as squares; label below */
  function polySVG(shapes, o) {
    o = o || {}; var S = o.size || 18, gap = 26, x0 = 0, out = '', maxH = 0;
    shapes.forEach(function (sh) { var h = Math.max.apply(null, sh.cells.map(function (c) { return c[1]; })) + 1; maxH = Math.max(maxH, h); });
    shapes.forEach(function (sh) {
      var w = Math.max.apply(null, sh.cells.map(function (c) { return c[0]; })) + 1;
      sh.cells.forEach(function (c) { out += '<rect x="' + (x0 + c[0] * S) + '" y="' + ((maxH - 1 - c[1]) * S) + '" width="' + S + '" height="' + S + '" fill="#e3e8f1" stroke="#1d2633" stroke-width="1.5"/>'; });
      out += '<text x="' + (x0 + w * S / 2) + '" y="' + (maxH * S + 16) + '" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="#1d2633">' + sh.label + '</text>';
      x0 += w * S + gap;
    });
    var W = x0 - gap + 4, H = maxH * S + 24;
    return '<svg class="fig-svg" viewBox="-2 -2 ' + W + ' ' + H + '" width="100%" style="max-width:' + Math.round(W * 1.25) + 'px" role="img" aria-label="tetrominoes">' + out + '</svg>';
  }
  function rotCells(cells, k) {
    var c = cells.map(function (p) { return p.slice(); });
    for (var i = 0; i < k; i++) c = c.map(function (p) { return [p[1], -p[0]]; });
    var mx = Math.min.apply(null, c.map(function (p) { return p[0]; })), my = Math.min.apply(null, c.map(function (p) { return p[1]; }));
    return c.map(function (p) { return [p[0] - mx, p[1] - my]; });
  }
  var TETRO = { I: [[0, 0], [1, 0], [2, 0], [3, 0]], O: [[0, 0], [1, 0], [0, 1], [1, 1]], T: [[0, 1], [1, 1], [2, 1], [1, 0]], L: [[0, 0], [0, 1], [0, 2], [1, 0]], J: [[1, 0], [1, 1], [1, 2], [0, 0]], S: [[0, 0], [1, 0], [1, 1], [2, 1]], Z: [[0, 1], [1, 1], [1, 0], [2, 0]] };

  HW.addCodes({ 'u5l9-type': 'Not an angle type', 'u5l9-kind-acute': 'Called it acute', 'u5l9-kind-right': 'Called it right', 'u5l9-kind-obtuse': 'Called it obtuse', 'u5l9-kind-straight': 'Called it straight', 'u5l9-kind-reflex': 'Called it reflex',
    'u5l9-none': 'Gave a complement for an angle over 90°', 'u5l9-not-none': 'Said “none” when there is one', 'u5l9-comp-supp': 'Mixed up complement and supplement', 'u5l9-sum-rule': 'Wrong polygon angle-sum rule', 'u5l9-half': 'Half of the wrong angle',
    'u5l9-tiles': 'Used the wrong polygon count', 'u5l9-clock': 'Wrong clock angle', 'u5l9-tangram': 'Wrong share of the tangram', 'u5l9-walk': 'Subtracted the bearings instead of turning round', 'u5l9-dup': 'Counted flipped shapes as different', 'u5l9-race': 'Wrong safe squares', 'u5l9-x': 'Solved for x wrongly' });
  var LT = ['a', 'b', 'c', 'd', 'e', 'f'];

  HW.defineLesson({
    id: 'u5l9', unit: 5, num: '9', title: 'Unit 5 Review', outcome: 'G5',
    blurb: 'The whole unit, set up like the unit test: angles and protractors, referents, polygons, bearings, bisecting, angle partners, parallel lines, and spatial puzzles and games.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A: Written Response', outcome: 'G6', stem: 'Classify each angle as acute, right, obtuse, straight or reflex.', shared: function (r) {
          var near = r.chance(0.5) ? r.int(91, 93) : r.int(87, 89);
          return { v: [find(function () { return r.int(18, 78); }, function (x) { return x !== 51 && x !== 37; }, 33), 90, find(function () { return r.int(104, 172); }, function (x) { return x !== 129 && x !== 154; }, 141), 180, find(function () { return r.int(190, 350); }, function (x) { return x !== 231 && x !== 263; }, 284), near] };
        },
        parts: [{ id: '1', sub: 'a–f', level: 'BEG', make: function (r, sh) {
          var rows = sh.v.map(function (v, i) { return { id: 'r' + i, html: '(' + LT[i] + ') ' + D(v) }; }), want = {}; sh.v.forEach(function (v, i) { want['r' + i] = G.kindOf(v); });
          return P.grid('Choose the type of each angle.', rows, KINDS.map(function (k) { return { id: k, html: k }; }), want,
            { why: function (row, got, w) { var v = sh.v[Number(row.slice(1))]; return { code: 'u5l9-kind-' + got, hint: D(v) + ' is ' + KWHY[w] + ', so it is ' + w + '. (' + got + ' means ' + KWHY[got] + '.)' }; } },
            sh.v.map(function (v, i) { return '(' + LT[i] + ') ' + D(v) + ': ' + G.kindOf(v); }).join('<br>') + '<br>(' + LT[5] + ') is just ' + (sh.v[5] > 90 ? 'over' : 'under') + ' 90°, so it is ' + G.kindOf(sh.v[5]) + '.', ['Compare each angle with 90° and 180°.'], 'classify');
        } }] },
      { num: '2', outcome: 'G6', stem: 'Read each angle on the protractor. Then classify it.', shared: function (r) {
          return { a: find(function () { return r.int(35, 80); }, function (x) { return x !== 51 && x !== 65; }, 58), b: find(function () { return r.int(110, 165); }, function (x) { return x !== 129 && x !== 147; }, 138), ra: r.pick([0, 0, 10, -12, 20]), rb: r.pick([25, 15, 0, -10, 30]) };
        },
        parts: [
          { id: '2a', level: 'EMG', make: function (r, sh) {
            var svg = G.protractorSVG({ angle: sh.a, rot: sh.ra, scale: 'outer', names: ['A', 'B', 'C'], width: 360 });
            return P.fields(svg + 'Read ∠<i>ABC</i>, then classify it.', [{ label: '∠<i>ABC</i> =', after: '°', name: '∠ABC' }, { label: 'Type:', mode: 'text', name: 'Type', placeholder: 'acute, obtuse…' }], [G.angleChk(sh.a, { tol: 1 }), typeChk(sh.a)], [String(sh.a), G.kindOf(sh.a)], D(sh.a) + ', ' + G.kindOf(sh.a),
              'Arm <i>BA</i> is on the 0 of the <b>outer</b> scale, so read the outer scale: ' + D(sh.a) + ' (not ' + (180 - sh.a) + ': the angle is acute).', ['Find the arm on a 0. Read the scale that starts at that 0.'], 'protractor acute');
          } },
          { id: '2b', level: 'EMG', make: function (r, sh) {
            var svg = G.protractorSVG({ angle: sh.b, rot: sh.rb, scale: 'inner', names: ['F', 'E', 'D'], width: 360 });
            return P.fields(svg + 'Read ∠<i>DEF</i>, then classify it.', [{ label: '∠<i>DEF</i> =', after: '°', name: '∠DEF' }, { label: 'Type:', mode: 'text', name: 'Type', placeholder: 'acute, obtuse…' }], [G.angleChk(sh.b, { tol: 1 }), typeChk(sh.b)], [String(sh.b), G.kindOf(sh.b)], D(sh.b) + ', ' + G.kindOf(sh.b),
              'Arm <i>EF</i> is on the 0 of the <b>inner</b> scale: ' + D(sh.b) + ' (not ' + (180 - sh.b) + ': the angle is obtuse).', ['Find the arm on a 0. Read the scale that starts at that 0.'], 'protractor obtuse');
          } },
          { id: '2c', level: 'EMG', make: function (r, sh) { return TK.angP('∠<i>DEF</i> = ' + D(sh.b) + '. Find the reflex angle that goes with ∠<i>DEF</i>.', 360 - sh.b, { trap: false, alts: [[180 - sh.b, 'A reflex angle goes the long way round: subtract from <b>360°</b>.']], sol: t('360^\\circ-' + sh.b + '^\\circ=' + (360 - sh.b) + '^\\circ'), hints: ['A full turn is 360°.'], text: 'reflex' }); } }] },
      { num: '3', outcome: 'G6', stem: 'Estimate each angle using referents (22.5°, 30°, 45°, 60°, 90°, 180°). Do not measure.', shared: function (r) {
          return { a: 30 + r.pick([-3, -2, 2, 3]), b: 60 + r.pick([-3, -2, 2, 3]), c: r.pick([135, 120, 150]) + r.pick([-4, -3, 3, 4]), d: r.pick([120, 150, 135]), rot: [r.int(0, 30), r.int(0, 40), r.int(-10, 10)] };
        },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { return estMC(r, sh.a, sh.rot[0], [30, 45, 60, 90]); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { return estMC(r, sh.b, sh.rot[1], [30, 45, 60, 90]); } },
          { id: '3c', level: 'EMG', make: function (r, sh) { var R0 = Math.round(sh.c / 15) * 15; return estMC(r, sh.c, sh.rot[2], [R0, R0 - 45, R0 + 30 > 175 ? R0 - 30 : R0 + 30, 180 - R0 === R0 - 45 ? R0 - 60 : 180 - R0].filter(function (x, i, arr) { return arr.indexOf(x) === i; }).concat([90]).slice(0, 4)); } },
          { id: '3d', level: 'EMG', make: function (r, sh) {
            var combos = { 120: ['90° + 30°', '180° − 60°'], 150: ['90° + 60°', '180° − 30°'], 135: ['90° + 45°', '180° − 45°'], 105: ['60° + 45°'], 75: ['45° + 30°'], 112.5: ['90° + 22.5°'] };
            var rightTxt = r.pick(combos[sh.d]), wrongs = r.shuffle(Object.keys(combos).filter(function (k) { return Number(k) !== sh.d; })).slice(0, 3).map(function (k) { return [r.pick(combos[k]), Number(k)]; });
            return P.mc(r, 'You want to sketch an angle of about ' + D(sh.d) + ' without a protractor. Which referents make it?', [{ html: rightTxt, right: true }].concat(wrongs.map(function (w) { return { html: w[0], why: w[0] + ' = ' + D(w[1]) + ', not ' + D(sh.d) + '.', code: 'ref-' + w[1] }; })),
              rightTxt + ' = ' + D(sh.d) + '. (Draw a right angle, then add or take away the referent.)', ['Work out each one.'], 'sketch referents');
          } }] },
      { num: '4', outcome: 'G5', stem: 'Fill in the table. If there is no such angle, write “none”.', shared: function (r) {
          var av = [41, 86, 111, 49, 139, 4, 94, 69];
          var a1 = find(function () { return r.int(12, 35); }, function (x) { return av.indexOf(x) < 0; }, 19), s4 = find(function () { return r.int(118, 160); }, function (x) { return av.indexOf(x) < 0 && 180 - x !== a1; }, 142);
          return { a1: a1, a2: find(function () { return r.int(72, 86); }, function (x) { return av.indexOf(x) < 0; }, 81), a3: find(function () { return r.int(104, 160); }, function (x) { return av.indexOf(x) < 0; }, 126), s4: s4, c5: find(function () { return r.int(10, 40); }, function (x) { return av.indexOf(x) < 0 && 90 - x !== 180 - s4 && 90 - x !== a1; }, 23) };
        },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) { return tableRow(sh.a1); } },
          { id: '4b', level: 'BEG', make: function (r, sh) { return tableRow(sh.a2); } },
          { id: '4c', level: 'EMG', make: function (r, sh) { return tableRow(sh.a3); } },
          { id: '4d', level: 'PRG', make: function (r, sh) {
            var a = 180 - sh.s4;
            return P.fields('The supplement is ' + D(sh.s4) + '. Find the angle, its type, and its complement.', [{ label: 'Angle:', after: '°', name: 'Angle' }, { label: 'Type:', mode: 'text', name: 'Type' }, { label: 'Complement:', mode: 'text', name: 'Complement', placeholder: 'number or none' }],
              [G.angleChk(a, { supplementTrap: false, alts: [{ v: sh.s4 - 90, hint: 'The <b>supplement</b> is given: angle = 180° − supplement, not supplement − 90°.' }] }), typeChk(a), noneOr(90 - a, { what: t('90^\\circ-' + a + '^\\circ'), alts: [{ v: sh.s4, hint: 'That’s the supplement (given). The complement is 90° − the angle.' }] })],
              [String(a), G.kindOf(a), String(90 - a)], 'Angle ' + D(a) + ', ' + G.kindOf(a) + ', complement ' + D(90 - a), 'Angle ' + t('=180^\\circ-' + sh.s4 + '^\\circ=' + a + '^\\circ') + ' (acute)<br>Complement ' + t('=90^\\circ-' + a + '^\\circ=' + (90 - a) + '^\\circ'), ['Supplement = 180° − angle, so angle = 180° − supplement.'], 'from supplement');
          } },
          { id: '4e', level: 'PRG', make: function (r, sh) {
            var a = 90 - sh.c5;
            return P.fields('The complement is ' + D(sh.c5) + '. Find the angle, its type, and its supplement.', [{ label: 'Angle:', after: '°', name: 'Angle' }, { label: 'Type:', mode: 'text', name: 'Type' }, { label: 'Supplement:', after: '°', name: 'Supplement' }],
              [G.angleChk(a, { supplementTrap: false, alts: [{ v: 180 - sh.c5, hint: 'The <b>complement</b> is given: angle = 90° − complement.' }] }), typeChk(a), G.angleChk(180 - a, { supplementTrap: false, alts: [{ v: 90 - a, hint: 'That’s the complement. The supplement is 180° − the angle.' }] })],
              [String(a), G.kindOf(a), String(180 - a)], 'Angle ' + D(a) + ', ' + G.kindOf(a) + ', supplement ' + D(180 - a), 'Angle ' + t('=90^\\circ-' + sh.c5 + '^\\circ=' + a + '^\\circ') + ' (acute)<br>Supplement ' + t('=180^\\circ-' + a + '^\\circ=' + (180 - a) + '^\\circ'), ['Complement = 90° − angle, so angle = 90° − complement.'], 'from complement');
          } }] },
      { num: '5', outcome: 'G6', stem: function (sh) { return sh.s.text + sh.svg; },
        shared: function (r) {
          var S = r.pick([
            { n: 5, R: 3, text: 'Home plate on a baseball field is a pentagon with three right angles and two equal angles, <i>x</i>.', pts: [[0, 0], [-1.1, 1.1], [-1.1, 2.2], [1.1, 2.2], [1.1, 1.1]], labels: ['', 'x', '', '', 'x'] },
            { n: 5, R: 2, text: 'The front of a garden shed is a pentagon. It has two right angles at the floor and three equal angles, <i>x</i>, at the walls and the peak of the roof.', pts: [[0, 0], [2.4, 0], [2.4, 1.4], [1.2, 1.4 + 1.2 * Math.tan(30 * RAD)], [0, 1.4]], labels: ['', '', 'x', 'x', 'x'] },
            { n: 6, R: 2, text: 'A sign is a hexagon: a rectangle with its two top corners cut off. It has two right angles at the bottom and four equal angles, <i>x</i>.', pts: [[0, 0], [2.6, 0], [2.6, 1.3], [2.0, 1.9], [0.6, 1.9], [0, 1.3]], labels: ['', '', 'x', 'x', 'x', 'x'] }]);
          var sum = (S.n - 2) * 180, x = (sum - 90 * S.R) / (S.n - S.R);
          var tile = r.pick([{ n: 5, name: 'regular pentagons', each: 108, ok: false }, { n: 6, name: 'regular hexagons', each: 120, ok: true }, { n: 8, name: 'regular octagons', each: 135, ok: false }]);
          return { s: S, sum: sum, x: x, svg: G.polygonSVG({ pts: S.pts.map(function (q) { return [q[0] * 60, q[1] * 60]; }), angles: S.labels.map(function (l) { return l === 'x' ? 'x' : ''; }), arcs: true, width: 240 }), tile: tile };
        },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) {
            var n = sh.s.n;
            return P.fields('Draw all the diagonals from one corner. How many triangles do you get? Use them to find the sum of the angles.', [{ label: 'Triangles:', name: 'Triangles' }, { label: 'Angle sum:', after: '°', name: 'Angle sum' }],
              [K.number(n - 2, function (v) { return v === n ? { code: 'u5l9-sum-rule', hint: 'Diagonals from <b>one</b> corner make ' + (n - 2) + ' triangles (two sides at that corner don’t start a new triangle).' } : v === n - 3 ? { code: 'u5l9-sum-rule', hint: 'That’s the number of diagonals. Count the triangles they make.' } : null; }),
                G.angleChk(sh.sum, { supplementTrap: false, alts: [{ v: n * 180, hint: 'Use the number of <b>triangles</b> (n − 2), not the number of sides.' }, { v: (n - 1) * 180, hint: 'Use n − 2 triangles.' }] })],
              [String(n - 2), String(sh.sum)], (n - 2) + ' triangles; ' + D(sh.sum), (n - 2) + ' triangles. ' + t((n - 2) + '\\times 180^\\circ=' + sh.sum + '^\\circ') + ' (the rule: ' + t('(' + n + '-2)\\times 180^\\circ') + ')', ['A polygon with n sides splits into n − 2 triangles from one corner.'], 'polygon sum');
          } },
          { id: '5b', level: 'PRG', make: function (r, sh) {
            var n = sh.s.n, R = sh.s.R, rest = sh.sum - 90 * R, k = n - R;
            return TK.angP('Find the size of each angle <i>x</i>.', sh.x, { trap: false, alts: [[rest, 'That’s all ' + k + ' angles together. Divide by ' + k + '.'], [(sh.sum - 90 * R) / n, 'Divide by the number of <b>equal</b> angles (' + k + '), not all ' + n + '.'], [sh.sum / n, 'Take the right angles away first: ' + t(sh.sum + '-' + R + '\\times 90') + '.']],
              sol: t(R + '\\times 90^\\circ=' + 90 * R + '^\\circ') + ' for the right angles.<br>' + t(sh.sum + '^\\circ-' + 90 * R + '^\\circ=' + rest + '^\\circ') + ' for the ' + k + ' equal angles.<br>' + t('x=' + rest + '^\\circ\\div ' + k + '=' + sh.x + '^\\circ'), hints: ['Take the right angles away from the angle sum, then share what is left equally.'], text: 'x' });
          } },
          { id: '5c', level: 'PRG', make: function (r, sh) {
            var T = sh.tile, k3 = 360 / T.each;
            var right = T.ok ? '<b>Yes.</b> 3 tiles meet at a point: ' + t('3\\times 120^\\circ=360^\\circ') + ', with no gap.' : '<b>No.</b> ' + Math.floor(k3) + ' tiles make ' + t(Math.floor(k3) + '\\times ' + T.each + '^\\circ=' + Math.floor(k3) * T.each + '^\\circ') + ' (a gap), and ' + Math.ceil(k3) + ' tiles make ' + t(Math.ceil(k3) * T.each + '^\\circ') + ' (they overlap).';
            return P.mc(r, 'A company wants to make floor tiles shaped like <b>' + T.name + '</b>. Each angle is ' + D(T.each) + '. Can these tiles cover a floor with no gaps and no overlaps, if the tiles meet at points?', [
              { html: right, right: true },
              { html: T.ok ? '<b>No.</b> Only squares can cover a floor.' : '<b>Yes.</b> Any regular shape can cover a floor.', why: 'Check the angles where tiles meet: they must add to exactly 360°.', code: 'x5-any' },
              { html: T.ok ? '<b>No.</b> ' + t('120^\\circ') + ' doesn’t go into 180°.' : '<b>Yes.</b> The angles add to ' + t(sh.sum + '^\\circ') + '.', why: 'Use the angles that meet at one point: they must make a full turn, 360°.', code: 'x5-180' },
              { html: T.ok ? '<b>Yes.</b> 4 tiles meet at a point: ' + t('4\\times 120^\\circ=480^\\circ') + '.' : '<b>Yes.</b> ' + Math.ceil(k3) + ' tiles fit at a point.', why: 'Work it out: the angles at a point must add to exactly 360°.', code: 'x5-count' }],
              'The angles where tiles meet must add to 360°. ' + (T.ok ? t('360^\\circ\\div 120^\\circ=3') + ': 3 tiles fit exactly. Yes.' : t('360^\\circ\\div ' + T.each + '^\\circ\\approx ' + (Math.round(k3 * 100) / 100)) + ', not a whole number, so there is always a gap or an overlap. No.'), ['The angles around a point add to 360°.'], 'tiles');
          } }] },
      { num: '6', outcome: 'G6', stem: function (sh) { return 'A snowmobile club has a warming hut, <i>H</i>, near Grande Prairie. <i>F</i> is a fire tower, <i>R</i> is a river crossing and <i>W</i> is the west gate of the trail system.' + sh.svg; },
        shared: function (r) {
          var f = find(function () { return r.int(20, 70); }, function (x) { return x !== 62 && x !== 38; }, 44), s = find(function () { return r.int(22, 62); }, function (x) { return x !== 25 && x !== 41; }, 35), w = find(function () { return r.int(40, 80); }, function (x) { return x !== 60 && x !== 66; }, 54);
          var bF = f, bR = 180 - s, bW = 360 - w;
          var svg = G.compassSVG({ origin: 'H', points: [{ name: 'F', bearing: bF, dist: 110 }, { name: 'R', bearing: bR, dist: 100 }, { name: 'W', bearing: bW, dist: 110 }], bearings: [{ deg: 180, dash: '5 4', arrow: false, len: 90, label: 'S' }],
            arcs: [{ from: 0, to: bF, label: f + '°', r: 34 }, { from: bR, to: 180, label: s + '°', r: 34 }, { from: bW, to: 360, label: w + '°', r: 26 }], grid: false, width: 300 });
          return { f: f, s: s, w: w, bF: bF, bR: bR, bW: bW, svg: svg, dir: r.pick([['south-west', 225], ['south-east', 135], ['north-west', 315]]) };
        },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) {
            return P.fields('Give the true bearing from the hut to <i>F</i>, to <i>R</i> and to <i>W</i>.', [{ label: 'to <i>F</i>:', after: '°', name: 'F' }, { label: 'to <i>R</i>:', after: '°', name: 'R' }, { label: 'to <i>W</i>:', after: '°', name: 'W' }],
              [G.bearingChk(sh.bF), G.bearingChk(sh.bR), G.bearingChk(sh.bW)], [G.bearingText(sh.bF), G.bearingText(sh.bR), G.bearingText(sh.bW)], 'F ' + bt(sh.bF) + ', R ' + bt(sh.bR) + ', W ' + bt(sh.bW),
              '<i>F</i>: ' + bt(sh.bF) + '<br><i>R</i>: ' + t('180^\\circ-' + sh.s + '^\\circ=' + sh.bR + '^\\circ') + '<br><i>W</i>: ' + t('360^\\circ-' + sh.w + '^\\circ=' + sh.bW + '^\\circ'), ['Bearings are measured clockwise from north, with 3 digits.'], 'bearings');
          } },
          { id: '6b', level: 'PRG', make: function (r, sh) { var b = sh.bF + 180; return G.P.bearing('A rider goes to the fire tower. On what bearing does she ride back to the hut?', b, { back: sh.bF, sol: bt(sh.bF) + ' is less than 180°: ' + t(G.bearingText(sh.bF) + '^\\circ+180^\\circ=' + G.bearingText(b) + '^\\circ'), hints: ['Coming back, you face the opposite way: add or subtract 180°.'], text: 'back F' }); } },
          { id: '6c', level: 'PRG', make: function (r, sh) { var b = sh.bW - 180; return G.P.bearing('From the west gate, on what bearing do riders travel to the hut?', b, { back: sh.bW, sol: bt(sh.bW) + ' is more than 180°: ' + t(sh.bW + '^\\circ-180^\\circ=' + G.bearingText(b) + '^\\circ'), hints: ['From W to the hut is the opposite way to the hut to W.'], text: 'back W' }); } },
          { id: '6d', level: 'BEG', make: function (r, sh) { return G.P.bearing('One rider leaves the hut heading ' + sh.dir[0] + '. Write that as a true bearing.', sh.dir[1], { sol: { 225: 'South is 180°; south-west is 45° more: 225°.', 135: 'East is 090° and south is 180°; halfway is 135°.', 315: 'West is 270°; north-west is 45° more: 315°.' }[sh.dir[1]], hints: ['N = 000°, E = 090°, S = 180°, W = 270°.'], text: 'compass point' }); } }] },
      { num: '7', outcome: 'G6', stem: function (sh) { return 'Bisect ∠<i>MNO</i> with a compass and a straightedge. A protractor is laid on the angle.' + G.protractorSVG({ angle: sh.v, rot: sh.rot, scale: 'inner', names: ['O', 'N', 'M'], width: 340 }); },
        shared: function (r) { return { v: find(function () { return r.int(96, 152); }, function (x) { return x !== 124 && x !== 116; }, 132), rot: r.pick([0, 0, 10, -10]) }; },
        parts: [
          { id: '7a', level: 'EMG', make: function (r, sh) {
            var half = sh.v / 2;
            return P.fields('Measure ∠<i>MNO</i> and each half after you bisect it.', [{ label: '∠<i>MNO</i> =', after: '°', name: '∠MNO' }, { label: 'Each half =', after: '°', name: 'half' }],
              [G.angleChk(sh.v, { tol: 1 }), G.angleChk(half, { tol: 0.5, supplementTrap: false, alts: [{ v: sh.v * 2, tol: 0, hint: 'Bisect means cut into two <b>equal halves</b>: divide by 2.' }, { v: (180 - sh.v) / 2, tol: 0.5, hint: 'Halve ∠MNO itself, not the angle that is left over.' }] })],
              [String(sh.v), String(half)], D(sh.v) + '; each half ' + D(half), 'Arm <i>NO</i> is on the 0 of the inner scale: ' + t('\\angle MNO=' + sh.v + '^\\circ') + '.<br>Each half: ' + t(sh.v + '^\\circ\\div 2=' + half + '^\\circ'), ['Bisect means cut into two equal parts.'], 'bisect measure');
          } },
          { id: '7b', level: 'BEG', make: function (r) {
            return P.mc(r, 'Which is another way to bisect an angle drawn on paper?', [
              { html: 'Fold the paper through the vertex so one arm lies exactly on the other arm. The fold line is the bisector.', right: true },
              { html: 'Draw a line from the vertex to the middle of the page.', why: 'The middle of the page has nothing to do with the angle.', code: 'b7-page' },
              { html: 'Measure one arm with a ruler and mark its midpoint, then join it to the vertex.', why: 'That line runs along the arm itself; it doesn’t split the angle.', code: 'b7-arm' },
              { html: 'Draw a line perpendicular to one arm through the vertex.', why: 'That makes a 90° angle with one arm, which only bisects the angle if it is 180°.', code: 'b7-perp' }],
              'Fold the paper through the vertex so the arms lie on top of each other: the fold is the bisector. (Or measure with a protractor and mark half the angle.)', ['Bisect = two equal halves. How could you make the two arms match up?'], 'other way');
          } }] },
      { num: '8', outcome: 'G5', stem: function (sh) { return 'Find <i>a</i>, <i>b</i>, <i>c</i> and <i>d</i>. (Think of the reason for each.)' + sh.svg; },
        shared: function (r) {
          var p = find(function () { return r.int(55, 85); }, function (x) { return x !== 53 && x !== 74; }, 66), q = find(function () { return r.int(30, 60); }, function (x) { return x !== 43 && 180 - p - x >= 30; }, 45), a = 180 - p - q;
          var svg = G.angleSVG({ rays: [0, p, p + q, 180, 180 + p, 180 + p + q].map(function (d) { return { dir: d }; }), arcs: [{ a: 0, b: p, label: p + '°' }, { a: p, b: p + q, label: q + '°' }, { a: p + q, b: 180, label: 'a' }, { a: 180, b: 180 + p, label: 'b' }, { a: 180 + p, b: 180 + p + q, label: 'c' }, { a: 180 + p + q, b: 360, label: 'd' }], width: 260 });
          return { p: p, q: q, a: a, svg: svg };
        },
        parts: [{ id: '8', level: 'PRG', make: function (r, sh) {
          var vals = [sh.a, sh.p, sh.q, sh.a];
          return P.fields('Find each angle.', ['a', 'b', 'c', 'd'].map(function (x) { return { label: t(x + '='), after: '°', name: x }; }),
            [G.angleChk(sh.a, { supplementTrap: false, alts: [{ v: 180 - sh.p, hint: 'Three angles make the straight line: subtract <b>both</b> ' + D(sh.p) + ' and ' + D(sh.q) + '.' }, { v: 180 - sh.q, hint: 'Subtract <b>both</b> given angles from 180°.' }] }),
              G.angleChk(sh.p, { supplementTrap: '<i>b</i> is vertically opposite the ' + D(sh.p) + ' angle, so it is <b>equal</b>.' }), G.angleChk(sh.q, { supplementTrap: '<i>c</i> is vertically opposite the ' + D(sh.q) + ' angle.' }), G.angleChk(sh.a, { supplementTrap: '<i>d</i> is vertically opposite <i>a</i>.' })],
            vals.map(String), t('a=' + sh.a + '^\\circ,\\ b=' + sh.p + '^\\circ,\\ c=' + sh.q + '^\\circ,\\ d=' + sh.a + '^\\circ'),
            t('a=180^\\circ-' + sh.p + '^\\circ-' + sh.q + '^\\circ=' + sh.a + '^\\circ') + ' (angles on a straight line)<br>' + t('b=' + sh.p + '^\\circ') + ' (vertically opposite the ' + D(sh.p) + ' angle)<br>' + t('c=' + sh.q + '^\\circ') + ' (vertically opposite the ' + D(sh.q) + ' angle)<br>' + t('d=' + sh.a + '^\\circ') + ' (vertically opposite <i>a</i>)<br>Check: ' + t(sh.p + '+' + sh.q + '+' + sh.a + '+' + sh.p + '+' + sh.q + '+' + sh.a + '=360') + ' ✓', ['Angles on a straight line add to 180°; vertically opposite angles are equal.'], 'abcd');
        } }] },
      { num: '9', outcome: 'G5', stem: function (sh) { return 'Use the diagram to name each pair of angles.' + TK.std({ tilt: sh.tilt }); },
        shared: function (r) { return { tilt: TK.tilt(r, [79, 101]), p: ['alt-int', 'int-same', 'corresponding', 'ext-same', 'vert-opp'].map(function (id) { return TK.poolPick(r, id, [[3, 5], [1, 7], [4, 5], [1, 8], [2, 6]]); }) }; },
        parts: ['alt-int', 'int-same', 'corresponding', 'ext-same', 'vert-opp'].map(function (id, i) {
          return { id: '9' + 'abcde'.charAt(i), level: id === 'vert-opp' ? 'BEG' : 'EMG', make: function (r, sh) { var pr = sh.p[i]; return TK.pairPick(r, A(pr[0]) + ' and ' + A(pr[1]), id, { sol: TK.why3(pr[0], pr[1]) + '<br>They are <b>' + PN[id] + '</b>.', text: 'name ' + id }); } };
        }) },
      { num: '10', outcome: 'G5', stem: function (sh) { return 'In the diagram, ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '.' + TK.std({ tilt: sh.tilt, angles: (function () { var o = {}; o[sh.k] = sh.v; return o; })() }); },
        shared: function (r) {
          var k = r.pick([3, 4, 5, 6]), v = find(function () { return r.chance(0.5) ? r.int(48, 75) : r.int(105, 132); }, function (x) { return x !== 61 && x !== 101 && x !== 79; }, 66);
          var rel = function (id) { return PAIRS[id].map(function (p) { return p[0] === k ? p[1] : p[1] === k ? p[0] : null; }).filter(function (x) { return x; })[0]; };
          var lin = PAIRS.linear.filter(function (p) { return p[0] === k || p[1] === k; }).map(function (p) { return p[0] === k ? p[1] : p[0]; }).filter(function (x) { return TK.EXT.indexOf(x) >= 0; })[0];
          return { k: k, v: v, tilt: PK.tiltFor(k, v), js: [rel('alt-int'), rel('int-same'), rel('corresponding'), lin] };
        },
        parts: [0, 1, 2, 3].map(function (i) { return { id: '10' + 'abcd'.charAt(i), level: i === 1 ? 'EMG' : 'BEG', make: function (r, sh) { return PK.findPart('Find ' + A(sh.js[i]) + '.', sh.k, sh.v, sh.tilt, sh.js[i]); } }; }).concat([
          { id: '10e', level: 'PRG', make: function (r, sh) {
            var j = sh.js;
            return P.mc(r, 'Suppose ℓ₁ and ℓ₂ were <b>not</b> parallel. Which of your answers would still be true?', [
              { html: 'Only ' + A(j[3]) + ': angles on a straight line always add to 180°.', right: true },
              { html: 'All of them: the angles are still in the same places.', why: 'Most of them used a parallel-line rule. Those rules need parallel lines.', code: 'x10-all' },
              { html: A(j[0]) + ' and ' + A(j[2]) + ': equal angles stay equal.', why: 'Alternate interior and corresponding angles are only equal when the lines are parallel.', code: 'x10-eq' },
              { html: 'None of them.', why: 'One of them didn’t use a parallel-line rule.', code: 'x10-none' }],
              'Only ' + A(j[3]) + ' = ' + D(180 - sh.v) + ': angles on a straight line always add to 180°. The others used parallel-line rules, which only work when the lines are parallel.', ['Which answer used a rule that stays at one crossing?'], 'still true');
          } }]) },
      { num: '11', outcome: 'G5', stem: '', parts: [
        { id: '11', level: 'ADV', make: function (r) {
          var th = find(function () { return r.int(60, 78); }, function (x) { return x !== 68; }, 64), x = 180 - 2 * th, H = 2.2, d = H / Math.tan(th * RAD);
          var lines = { g: { p: [-2.4, 0], q: [2.4, 0], marks: 1, markAt: 0.15, name: 'ground', nameSize: 13 }, bar: { p: [-2.2, H], q: [2.2, H], marks: 1, markAt: 0.15 }, l1: { p: [-d, 0], q: [0, H], width: 3 }, l2: { p: [d, 0], q: [0, H], width: 3 } };
          var F = LF(lines, { scale: 46 });
          var svg = F.svg({ labels: [{ ang: F.ang('g', 1, 'l1', 1), text: th + '°', arc: true }, { ang: F.ang('g', -1, 'l2', 1), text: th + '°', arc: true }, { ang: F.ang('l1', -1, 'l2', -1), text: 'x' }], width: 300, aria: 'swing set' });
          return TK.angP('The top bar of a swing set is parallel to the ground. Each leg makes a ' + D(th) + ' angle with the ground. Find <i>x</i>, the angle between the two legs at the top.' + svg, x, { trap: false,
            alts: [[180 - th, 'Three angles sit along the top bar at the top: the two leg angles <b>and</b> <i>x</i>.'], [2 * th, 'Those angles are at the bottom. Use alternate interior angles to move them to the top bar.'], [360 - 2 * th, 'The angles along the bar make a straight line: 180°, not 360°.']],
            sol: 'The angle between the left leg and the top bar is ' + D(th) + ' (alternate interior angles; the bar and the ground are parallel). The same is true on the right.<br>The three angles at the top lie on a straight line:<br>' + t('x=180^\\circ-' + th + '^\\circ-' + th + '^\\circ=' + x + '^\\circ'), hints: ['Each leg makes a Z with the bar and the ground.', 'The three angles along the bar at the top add to 180°.'], text: 'swing set' });
        } }] },
      { num: '12', outcome: 'G5', stem: function (sh) { return 'On a farm near Brooks, two straight irrigation ditches, ℓ₁ and ℓ₂, are parallel. A straight gravel road, <i>t</i>, crosses both ditches. The road makes ' + A(2) + ' = ' + D(sh.v) + ' with the first ditch.' + TK.std({ tilt: sh.v, angles: { 2: sh.v } }); },
        shared: function (r) { return { v: find(function () { return r.int(40, 76); }, function (x) { return x !== 51 && x !== 79; }, 56), d: r.pick([-2, -1, 1, 2]) }; },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, sh) { return PK.findPart('Find ' + A(6) + '.', 2, sh.v, sh.v, 6); } },
          { id: '12b', level: 'EMG', make: function (r, sh) { return PK.findPart('Find ' + A(5) + '.', 2, sh.v, sh.v, 5); } },
          { id: '12c', level: 'PRG', make: function (r, sh) {
            var w = sh.v + sh.d;
            return P.mc(r, 'Further along, the road crosses a third ditch. There, the angle in the same position as ' + A(2) + ' is ' + D(w) + '. Is the third ditch parallel to the first one?', [
              { html: '<b>No.</b> Those are corresponding angles. If the ditches were parallel they would be equal, but ' + D(w) + ' ≠ ' + D(sh.v) + '.', right: true },
              { html: '<b>Yes.</b> The angles are only ' + Math.abs(sh.d) + '° apart.', why: 'Corresponding angles must be <b>exactly</b> equal for parallel lines.', code: 'x12-close' },
              { html: '<b>Yes.</b> All three ditches cross the same road.', why: 'Crossing the same road doesn’t make lines parallel.', code: 'x12-road' },
              { html: '<b>No.</b> The angles should add to 180°.', why: 'Angles in the same position are corresponding: equal, not 180°.', code: 'x12-180' }],
              'Same position = corresponding angles. For parallel ditches they would be equal, but ' + D(w) + ' ≠ ' + D(sh.v) + '. No.', ['Same position at each crossing: what rule?'], 'third ditch');
          } }] },
      { num: '13', outcome: 'G1', stem: function (sh) { return 'A <b>tetromino</b> is a shape made of 4 equal squares joined edge to edge. ' + sh.who + ' drew these shapes and says, “There are 7 different tetrominoes.”' + sh.svg; },
        shared: function (r) {
          var names = r.shuffle(Object.keys(TETRO)), shapes = names.map(function (n, i) { return { name: n, label: 'ABCDEFG'.charAt(i), cells: rotCells(TETRO[n], r.int(0, 3)) }; });
          var lab = {}; shapes.forEach(function (s) { lab[s.name] = s.label; });
          return { shapes: shapes, lab: lab, who: r.pick(['Kim', 'Ari', 'Dev', 'Mae']), svg: polySVG(shapes) };
        },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) {
            var L = sh.lab, p1 = [L.L, L.J].sort(), p2 = [L.S, L.Z].sort(), w1 = [L.L, L.T].sort(), w2 = [L.O, L.I].sort();
            return P.mc(r, sh.who + ' counted some shapes twice. Which shapes are really the same?', [
              { html: p1.join(' and ') + ', and ' + p2.join(' and ') + ': a flip turns one into the other.', right: true },
              { html: p1.join(' and ') + ' only.', why: 'There is one more pair. Look for two shapes that are mirror images.', code: 't13-one' },
              { html: w1.join(' and ') + ', and ' + p2.join(' and ') + '.', why: 'Try turning and flipping ' + w1[0] + ': can it ever match ' + w1[1] + '?', code: 't13-wrong' },
              { html: 'None: all 7 are different, because they point different ways.', why: 'A turn or a flip does not make a new shape.', code: 't13-none' }],
              p1.join(' and ') + ' are the same: flip one over and you get the other. ' + p2.join(' and ') + ' are the same too. A flip or a turn does not make a new shape.', ['Cut them out in your head: can you turn or flip one to match another?'], 'same tetrominoes');
          } },
          { id: '13b', level: 'EMG', make: function (r, sh) { return P.number('How many different tetrominoes are there?', 5, function (v) { return v === 7 ? { code: 'u5l9-dup', hint: 'Two pairs are the same shape (flipped). Take them away.' } : v === 6 ? { code: 'u5l9-dup', hint: 'There are <b>two</b> pairs that are the same.' } : null; }, t('7-2=5') + ' different tetrominoes.', ['7 shapes, but two pairs are the same.'], 'count tetrominoes'); } },
          { id: '13c', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What could ' + sh.who + ' do to avoid this mistake next time?', [
              { html: 'Make a systematic list, and before adding a new shape, turn and flip it to check it isn’t already on the list.', right: true },
              { html: 'Draw the shapes bigger.', why: 'The size doesn’t matter: flipped copies still look different.', code: 't13-big' },
              { html: 'Only count shapes that point to the right.', why: 'That would miss shapes, and doesn’t check for flips.', code: 't13-right' },
              { html: 'Guess the number and stop.', why: 'A systematic check is what catches the doubles.', code: 't13-guess' }],
              'Make a systematic list, and turn and flip each new shape (or cut it out) to check it isn’t already on the list.', ['How could you catch shapes that are just flips of each other?'], 'strategy');
          } }] },
      /* ---------------- Part B ---------------- */
      { num: '14', section: 'Part B: Multiple Choice', outcome: 'G6', stem: '', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var rf = find(function () { return r.int(190, 350); }, function (x) { return x !== 245 && x !== 231; }, 260), ob = r.int(95, 170), ac = r.int(20, 89);
          return P.mc(r, 'Which angle is a reflex angle?', [{ html: D(rf), right: true }, { html: D(ob), why: D(ob) + ' is obtuse (between 90° and 180°).', code: 'r14-obt' }, { html: D(180), why: '180° is a straight angle.', code: 'r14-str' }, { html: D(ac), why: D(ac) + ' is acute.', code: 'r14-ac' }], D(rf) + ': it is between 180° and 360°.', ['Reflex angles are more than 180°.'], 'reflex MC');
        } }] },
      { num: '15', outcome: 'G5', stem: '', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var v = find(function () { return r.int(18, 82); }, function (x) { return x !== 64 && x !== 41 && x !== 45; }, 52);
          return P.mc(r, 'The supplement of ' + D(v) + ' is', [{ html: D(90 - v), why: 'That’s the complement (adds to 90°).', code: 's15-comp' }, { html: D(180 - v), right: true }, { html: D(360 - v), why: 'Supplements add to 180°, not 360°.', code: 's15-360' }, { html: D(v + 90), why: 'Subtract from 180°.', code: 's15-plus' }], t('180^\\circ-' + v + '^\\circ=' + (180 - v) + '^\\circ'), ['Supplementary angles add to 180°.'], 'supplement');
        } }] },
      { num: '16', outcome: 'G6', stem: '', parts: [
        { id: '16', level: 'BEG', make: function (r) {
          var dirs = [['north-east', 45], ['south-east', 135], ['south-west', 225], ['north-west', 315]], d = r.pick(dirs);
          return P.mc(r, 'A boat heads ' + d[0] + '. Its true bearing is', dirs.slice().reverse().map(function (x) { return { html: bt(x[1]), right: x[1] === d[1], why: x[1] === d[1] ? null : bt(x[1]) + ' is ' + x[0] + '.', code: 'b16-' + x[1] }; }), d[0].charAt(0).toUpperCase() + d[0].slice(1) + ' is halfway between two compass points: ' + bt(d[1]) + '.', ['N = 000°, E = 090°, S = 180°, W = 270°.'], 'compass MC', true);
        } }] },
      { num: '17', outcome: 'G5', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var v = r.pick([88, 89, 91, 92]);
          return P.mc(r, 'Line <i>m</i> crosses line <i>n</i>, making an angle of ' + D(v) + '. How should the pair be sorted?', [
            { html: 'Neither: they cross, but not at 90°.', right: true },
            { html: 'Perpendicular: ' + D(v) + ' is about 90°.', why: 'Perpendicular means <b>exactly</b> 90°.', code: 'p17-perp' },
            { html: 'Parallel: they go almost the same way.', why: 'Parallel lines never cross. These cross.', code: 'p17-par' },
            { html: 'Both parallel and perpendicular.', why: 'Lines can’t be both: parallel lines never meet.', code: 'p17-both' }],
            'Neither. Perpendicular means exactly 90°, and parallel lines never cross.', ['Is ' + D(v) + ' exactly 90°?'], 'sort lines');
        } }] },
      { num: '18', outcome: 'G5', stem: '', parts: [
        { id: '18', level: 'BEG', make: function (r) {
          var target = r.pick(['alt-ext', 'alt-int', 'corresponding']), pr = TK.poolPick(r, target), ids = r.shuffle(['corresponding', 'alt-int', 'vert-opp', 'alt-ext'].filter(function (x) { return x !== target; })).slice(0, 3).concat([target]);
          return P.mc(r, 'In the diagram, ' + A(pr[0]) + ' and ' + A(pr[1]) + ' are' + TK.std({ tilt: TK.tilt(r), width: 260 }), ids.map(function (id) { return { html: G.PAIR_SHORT[id], right: id === target, why: id === target ? null : TK.pairWhy(target, id), code: 'n18-' + id }; }),
            TK.why3(pr[0], pr[1]) + ' They are ' + PN[target] + '.', ['Interior or exterior? Same side of t or opposite sides?'], 'pair MC');
        } }] },
      { num: '19', outcome: 'G5', stem: '', parts: [
        { id: '19', level: 'EMG', make: function (r) {
          var pr = TK.poolPick(r, r.pick(['ext-same', 'int-same'])), v = find(function () { return r.int(102, 138); }, function (x) { return x !== 109; }, 114);
          return P.mc(r, 'ℓ₁ ∥ ℓ₂ and ' + A(pr[0]) + ' = ' + D(v) + ' (same numbering). Then ' + A(pr[1]) + ' is', [{ html: D(v), why: 'They aren’t equal: they are ' + PN[TK.nameOf(pr[0], pr[1])] + ', so they add to 180°.', code: 's19-eq' }, { html: D(180 - v), right: true }, { html: D(v - 90), why: 'Subtract from 180°, not 90°.', code: 's19-90' }, { html: D(360 - v), why: 'Subtract from 180°, not 360°.', code: 's19-360' }],
            A(pr[0]) + ' and ' + A(pr[1]) + ' are ' + PN[TK.nameOf(pr[0], pr[1])] + ', so they add to 180°: ' + t('180^\\circ-' + v + '^\\circ=' + (180 - v) + '^\\circ'), ['Name the pair first.'], 'same side MC');
        } }] },
      { num: '20', outcome: 'G6', stem: '', parts: [
        { id: '20', level: 'BEG', make: function (r) {
          var n = find(function () { return r.int(7, 13); }, function (x) { return x !== 11; }, 9), s = (n - 2) * 180;
          return P.mc(r, 'The sum of the angles in a polygon with ' + n + ' sides is', [{ html: D(n * 180), why: 'Use n − 2 triangles, not n.', code: 'p20-n' }, { html: D((n - 1) * 180), why: 'Use n − 2.', code: 'p20-n1' }, { html: D(s), right: true }, { html: D((n - 3) * 180), why: 'Use n − 2.', code: 'p20-n3' }], t('(' + n + '-2)\\times 180^\\circ=' + (n - 2) + '\\times 180^\\circ=' + s + '^\\circ'), ['Angle sum = (n − 2) × 180°.'], 'polygon MC');
        } }] },
      { num: '21', outcome: 'G1', stem: '', parts: [
        { id: '21', level: 'BEG', make: function (r) {
          var n = r.pick([5, 7, 8, 9]), m = Math.pow(2, n) - 1;
          return P.mc(r, 'The fewest moves to solve the Tower of Hanoi with ' + n + ' discs is', [{ html: String(n * n), why: 'That’s ' + n + '². The pattern doubles and adds 1.', code: 'h21-sq' }, { html: String(m + 1), why: 'Don’t forget to subtract 1: ' + t('2^{' + n + '}-1') + '.', code: 'h21-pow' }, { html: String(Math.pow(2, n - 1) - 1), why: 'That’s the answer for ' + (n - 1) + ' discs.', code: 'h21-prev' }, { html: String(m), right: true }],
            t('2^{' + n + '}-1=' + (m + 1) + '-1=' + m) + ' (each number is double the one before, plus 1).', ['1, 3, 7, 15, … : double and add 1.'], 'Hanoi');
        } }] },
      /* ---------------- Part C ---------------- */
      { num: '22', section: 'Part C: Numerical Response', outcome: 'G6', stem: '', parts: [
        { id: '22', level: 'EMG', make: function (r) {
          var h = find(function () { return r.int(1, 11); }, function (x) { return x !== 5 && x !== 6 && x !== 3 && x !== 9; }, 4), a = Math.min(30 * h, 360 - 30 * h);
          return TK.angP('<b>Numerical response.</b> At exactly ' + h + ':00, the smaller angle between the hands of a clock is ____°.', a, { nr: true, trap: false, alts: [[360 - a, 'That’s the bigger (reflex) angle. Give the smaller one.'], [6 * h, 'Each hour mark is 30° apart (360° ÷ 12), not 6°.'], [h * 60 > 360 ? -1 : h * 60, 'Each hour mark is 30° apart.']],
            sol: 'The hands are ' + Math.min(h, 12 - h) + ' hour mark' + (Math.min(h, 12 - h) === 1 ? '' : 's') + ' apart, and each is ' + t('360^\\circ\\div 12=30^\\circ') + ': ' + t(Math.min(h, 12 - h) + '\\times 30^\\circ=' + a + '^\\circ'), hints: ['The 12 hour marks split 360° into 12 equal parts.'], text: 'clock' });
        } }] },
      { num: '23', outcome: 'G1', stem: '', parts: [
        { id: '23', level: 'EMG', make: function (r) {
          var T = r.pick([64, 96, 112, 128, 160, 176, 192, 208, 240, 256]), s = T / 16;
          return P.nr('<b>Numerical response.</b> A tangram square has a total area of ' + T + ' cm². The area of one small triangle is ____ cm².', s, function (v) { return v === T / 7 ? { code: 'u5l9-tangram', hint: 'The 7 pieces are not all the same size. The whole square is 16 small triangles.' } : v === T / 4 ? { code: 'u5l9-tangram', hint: 'That’s a large triangle (4 small ones). The whole square is 16 small triangles.' } : v === T / 8 ? { code: 'u5l9-tangram', hint: 'That’s a medium piece (2 small triangles). Divide by 16.' } : null; },
            'The whole square is 16 small triangles: ' + t(T + '\\div 16=' + s) + ' cm².', ['Small triangle = 1 unit; the whole square = 16 units.'], 'tangram');
        } }] },
      { num: '24', outcome: 'G6', stem: '', parts: [
        { id: '24', level: 'PRG', make: function (r) {
          var b = find(function () { return r.chance(0.6) ? r.int(200, 350) : r.int(20, 160); }, function (x) { return x !== 326 && x !== 298 && x % 10 !== 0; }, 312), back = b >= 180 ? b - 180 : b + 180;
          var p = G.P.bearing('<b>Numerical response.</b> A canoe travels on a bearing of ' + bt(b) + '. The bearing to paddle straight back is ____°.', back, { back: b, strict3: false, sol: bt(b) + ' is ' + (b >= 180 ? 'more than 180°, so subtract: ' + t(b + '^\\circ-180^\\circ=' + G.bearingText(back) + '^\\circ') : 'less than 180°, so add: ' + t(G.bearingText(b) + '^\\circ+180^\\circ=' + back + '^\\circ')), hints: ['Straight back = the opposite direction: add or subtract 180°.'], text: 'canoe back' });
          p.input.nr = true; return p;
        } }] },
      { num: '25', outcome: 'G6', stem: '', parts: [
        { id: '25', level: 'EMG', make: function (r) {
          var v = find(function () { return r.int(51, 179); }, function (x) { return x % 2 === 1 && x !== 137; }, 113), h = v / 2;
          return TK.angP('<b>Numerical response.</b> An angle of ' + D(v) + ' is bisected. Each new angle measures ____° (to the nearest tenth).', h, { nr: true, trap: false, alts: [[v * 2, 'Bisect means cut in half: divide by 2.'], [(180 - v) / 2, 'Halve the angle itself.'], [Math.floor(h), 'Keep the tenths: ' + t(v + '\\div 2') + ' ends in .5.'], [Math.ceil(h), 'Keep the tenths: ' + t(v + '\\div 2') + ' ends in .5.']],
            sol: t(v + '^\\circ\\div 2=' + h + '^\\circ'), hints: ['Bisect = cut into two equal halves.'], text: 'bisect NR' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Fill in the blanks. If there is no such angle, write “none”.', shared: function (r) { return { a1: find(function () { return r.int(24, 60); }, function (x) { return x !== 42 && x !== 41 && x !== 45; }, 36), a2: find(function () { return r.int(93, 128); }, function (x) { return x !== 99 && x !== 111; }, 104), rf: find(function () { return r.int(35, 85); }, function (x) { return x !== 75; }, 68) }; },
        parts: [
          { id: 'x1a', level: 'BEG', outcome: 'G5', make: function (r, sh) { return tableRow(sh.a1); } },
          { id: 'x1b', level: 'EMG', outcome: 'G5', make: function (r, sh) { return tableRow(sh.a2); } },
          { id: 'x1c', level: 'BEG', outcome: 'G6', make: function (r, sh) { return TK.angP('The reflex angle that goes with a ' + D(sh.rf) + ' angle is ____.', 360 - sh.rf, { trap: false, alts: [[180 - sh.rf, 'That’s the supplement. A reflex angle goes the long way round: 360° − the angle.']], sol: t('360^\\circ-' + sh.rf + '^\\circ=' + (360 - sh.rf) + '^\\circ'), hints: ['A full turn is 360°.'], text: 'reflex' }); } }] },
      { num: '2', outcome: 'G6', stem: function (sh) { return 'Read ∠<i>XYZ</i> on the protractor.' + G.protractorSVG({ angle: sh.v, rot: sh.rot, scale: 'outer', names: ['X', 'Y', 'Z'], width: 360 }); },
        shared: function (r) { return { v: find(function () { return r.int(108, 158); }, function (x) { return x !== 140 && x !== 129; }, 128), rot: r.pick([0, 0, 15, -15]) }; },
        parts: [
          { id: 'x2a', level: 'EMG', make: function (r, sh) { return P.fields('Read ∠<i>XYZ</i> and classify it.', [{ label: '∠<i>XYZ</i> =', after: '°', name: '∠XYZ' }, { label: 'Type:', mode: 'text', name: 'Type', placeholder: 'acute, obtuse…' }], [G.angleChk(sh.v, { tol: 1 }), typeChk(sh.v)], [String(sh.v), G.kindOf(sh.v)], D(sh.v) + ', ' + G.kindOf(sh.v), 'Arm <i>YX</i> is on the 0 of the <b>outer</b> scale: ' + D(sh.v) + ', obtuse.', ['Find the arm on a 0. Read the scale that starts at that 0.'], 'read XYZ'); } },
          { id: 'x2b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Why is the answer not ' + D(180 - sh.v) + '?', [
              { html: 'The angle opens wider than a right angle, so it is obtuse; ' + D(180 - sh.v) + ' would be acute. (' + D(180 - sh.v) + ' is on the other scale.)', right: true },
              { html: 'Because you always read the outer scale.', why: 'Not always: read the scale that starts at 0 on one arm.', code: 'x2-outer' },
              { html: 'Because ' + D(180 - sh.v) + ' is too small to measure.', why: 'Small angles can be measured. Is this angle acute or obtuse?', code: 'x2-small' },
              { html: 'Because the protractor is upside down.', why: 'Check which arm is on a 0, and whether the angle is acute or obtuse.', code: 'x2-upside' }],
              'Arm YX is on the 0 of the outer scale. The angle is wider than a right angle, so it must be obtuse: ' + D(sh.v) + ', not ' + D(180 - sh.v) + '.', ['Is the angle acute or obtuse?'], 'why not');
          } }] },
      { num: '3', outcome: 'G6', stem: 'Write each direction as a true bearing.', shared: function (r) { return { pt: r.pick([['due south', 180], ['due west', 270], ['due east', 90]]), ws: find(function () { return r.int(12, 70); }, function (x) { return x !== 30 && x !== 25; }, 40), en: find(function () { return r.int(5, 40); }, function (x) { return x !== 15; }, 22), bb: find(function () { return r.int(20, 170); }, function (x) { return x !== 98 && x !== 62; }, 84), side: r.pick([['west of south', 180, 1], ['east of south', 180, -1], ['west of north', 360, -1]]) }; },
        parts: [{ id: 'x3', sub: 'a–d', level: 'EMG', make: function (r, sh) {
          var b2 = n360(sh.side[1] + sh.side[2] * sh.ws), b4 = sh.bb + 180;
          return P.fields('Write each one as a true bearing.', [{ label: '(a) ' + sh.pt[0] + ':', after: '°', name: '(a)' }, { label: '(b) ' + sh.ws + '° ' + sh.side[0] + ':', after: '°', name: '(b)' }, { label: '(c) ' + sh.en + '° east of north:', after: '°', name: '(c)' }, { label: '(d) the back bearing of ' + bt(sh.bb) + ':', after: '°', name: '(d)' }],
            [G.bearingChk(sh.pt[1]), G.bearingChk(b2), G.bearingChk(sh.en), G.bearingChk(b4, { back: sh.bb })], [G.bearingText(sh.pt[1]), G.bearingText(b2), G.bearingText(sh.en), G.bearingText(b4)],
            [bt(sh.pt[1]), bt(b2), bt(sh.en), bt(b4)].join(', '),
            '(a) ' + bt(sh.pt[1]) + '<br>(b) ' + (sh.side[1] === 180 ? 'South is 180°; ' + sh.side[0] + ' is ' + (sh.side[2] > 0 ? 'further clockwise: ' + t('180^\\circ+' + sh.ws + '^\\circ') : 'back towards east: ' + t('180^\\circ-' + sh.ws + '^\\circ')) : 'North is 360°; west of north is back from there: ' + t('360^\\circ-' + sh.ws + '^\\circ')) + ' = ' + bt(b2) + '<br>(c) 3 digits: ' + bt(sh.en) + '<br>(d) ' + bt(sh.bb) + ' is less than 180°: ' + t(G.bearingText(sh.bb) + '^\\circ+180^\\circ=' + b4 + '^\\circ'), ['Bearings: clockwise from north, 3 digits.'], 'write bearings');
        } }] },
      { num: '4', outcome: 'G5', stem: function (sh) { return 'Name each pair of angles. (There are no arrow marks: the lines may not be parallel.)' + TK.std({ parallel: false, tilt: sh.tilt, skew: sh.sk }); },
        shared: function (r) { return { tilt: TK.tilt(r, [118]), sk: r.pick([-10, -8, 8, 10]), p: ['corresponding', 'alt-ext', 'int-same', 'vert-opp', 'ext-same'].map(function (id) { return TK.poolPick(r, id, [[4, 8], [2, 8], [3, 6], [6, 8], [1, 8]]); }) }; },
        parts: ['corresponding', 'alt-ext', 'int-same', 'vert-opp', 'ext-same'].map(function (id, i) { return { id: 'x4' + 'abcde'.charAt(i), level: id === 'vert-opp' ? 'BEG' : 'EMG', make: function (r, sh) { var pr = sh.p[i]; return TK.pairPick(r, A(pr[0]) + ' and ' + A(pr[1]), id, { sol: TK.why3(pr[0], pr[1]) + '<br>They are <b>' + PN[id] + '</b>. (The names don’t need parallel lines; only the “equal” and “add to 180°” rules do.)', text: 'name ' + id }); } }; }) },
      { num: '5', outcome: 'G6', stem: 'Polygons: the angle sum is (<i>n</i> − 2) × 180°.', parts: [
        { id: 'x5a', level: 'PRG', make: function (r) {
          var known = find(function () { return [r.int(100, 140), r.int(100, 140), r.int(110, 150), r.int(115, 150), r.int(95, 135)]; }, function (k) { var s = 720 - k.reduce(function (a, b) { return a + b; }, 0); return s > 70 && s < 170; }, [112, 128, 130, 135, 104]);
          var sixth = 720 - known.reduce(function (a, b) { return a + b; }, 0), sk = 720 - sixth;
          return TK.angP('A six-sided garden has angles of ' + known.map(function (x) { return x + '°'; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. Find the sixth angle.', sixth, { trap: false, alts: [[1080 - sk, 'A hexagon has n = 6: ' + t('(6-2)\\times 180^\\circ=720^\\circ') + ', not 1080°.'], [900 - sk, 'Use (6 − 2) × 180° = 720°.'], [540 - sk, 'Use (6 − 2) × 180° = 720°.']],
            sol: 'Sum: ' + t('(6-2)\\times 180^\\circ=720^\\circ') + '<br>Known: ' + t(known.join('+') + '=' + sk) + '<br>Sixth angle: ' + t('720^\\circ-' + sk + '^\\circ=' + sixth + '^\\circ'), hints: ['Find the angle sum first, then subtract the five angles you know.'], text: 'sixth angle' });
        } },
        { id: 'x5b', level: 'ADV', make: function (r) {
          var n = r.pick([10, 12, 15, 18, 20, 5, 6]), e = (n - 2) * 180 / n;
          return P.number('Each angle of a regular polygon is ' + D(e) + '. How many sides does it have? (Try a few values of <i>n</i>.)', n, function (v) { return v > 2 && Math.abs((v - 2) * 180 / v - e) > 0.01 && v < 400 ? { code: 'u5l9-sum-rule', hint: 'Check: a regular polygon with ' + v + ' sides has angles of ' + t('(' + v + '-2)\\times 180\\div ' + v + '\\approx ' + Math.round((v - 2) * 180 / v * 10) / 10 + '^\\circ') + '.' } : null; },
            'Try values: ' + t('n=' + n + ':\\ (' + n + '-2)\\times 180^\\circ=' + (n - 2) * 180 + '^\\circ') + '; ' + t((n - 2) * 180 + '\\div ' + n + '=' + e) + ' ✓<br>It has ' + n + ' sides.', ['More sides → bigger angles. Try n = 6, 8, 10, 12, …'], 'regular n');
        } }] },
      { num: '6', section: 'B. Applying', outcome: 'G5', stem: function (sh) { return 'In the diagram, ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '. Find the other seven angles.' + TK.std({ tilt: PK.tiltFor(sh.k, sh.v), angles: (function () { var o = {}; o[sh.k] = sh.v; return o; })() }); },
        shared: function (r) { return { k: r.int(1, 8), v: find(function () { return r.chance(0.5) ? r.int(40, 70) : r.int(110, 140); }, function (x) { return x !== 134 && x !== 101 && x !== 79; }, 128) }; },
        parts: [{ id: 'x6', level: 'PRG', make: function (r, sh) { return PK.fillAll('Find each angle.', sh.k, sh.v, PK.tiltFor(sh.k, sh.v)); } }] },
      { num: '7', outcome: 'G5', stem: function (sh) { return 'A fence is built on a hill. The posts are straight up, so they are parallel. The top rail slopes up the hill. At the first post, the rail makes a ' + D(sh.a) + ' angle with the post.' + sh.svg; },
        shared: function (r) {
          var sg = find(function () { return r.int(5, 14); }, function (x) { return x !== 8; }, 10), a = 90 - sg, tn = Math.tan(sg * RAD);
          var lines = { gr: { p: [-0.6, -0.6 * tn - 0.05], q: [4.6, 4.6 * tn - 0.05], color: '#7a5a2e', width: 2.4 }, p1: { p: [0, 0], q: [0, 2.1], width: 3.4, marks: 1, markAt: 0.35 }, p2: { p: [3, 3 * tn], q: [3, 3 * tn + 2.1], width: 3.4, marks: 1, markAt: 0.35 }, rail: { p: [-0.5, 1.5 - 0.5 * tn], q: [3.7, 1.5 + 3.7 * tn] } };
          var F = LF(lines, { scale: 46 }), lt = r.pick([['x', 'y'], ['m', 'n'], ['p', 'q']]);
          return { a: a, lt: lt, svg: F.svg({ labels: [{ ang: F.ang('p1', 1, 'rail', 1), text: a + '°', arc: true }, { ang: F.ang('p2', 1, 'rail', 1), text: lt[0] }, { ang: F.ang('p2', 1, 'rail', -1), text: lt[1] }], width: 300, aria: 'fence on a hill' }) };
        },
        parts: [
          { id: 'x7a', level: 'EMG', make: function (r, sh) { return TK.angP('Find <i>' + sh.lt[0] + '</i>.', sh.a, { alts: [[180 - sh.a, '<i>' + sh.lt[0] + '</i> is in the same position at the second post: corresponding angles are equal.']], trap: false, sol: t(sh.lt[0] + '=' + sh.a + '^\\circ') + ': corresponding angles are equal, because the posts are parallel (the rail is the transversal).', hints: ['Same position at each post.'], text: 'fence x' }); } },
          { id: 'x7b', level: 'EMG', make: function (r, sh) { return TK.angP('Find <i>' + sh.lt[1] + '</i>.', 180 - sh.a, { alts: [[sh.a, '<i>' + sh.lt[0] + '</i> and <i>' + sh.lt[1] + '</i> sit side by side along the rail: they add to 180°.']], trap: false, sol: t(sh.lt[1] + '=180^\\circ-' + sh.a + '^\\circ=' + (180 - sh.a) + '^\\circ') + ' (on a straight line with <i>' + sh.lt[0] + '</i>)', hints: ['Angles side by side on a straight line add to 180°.'], text: 'fence y' }); } },
          { id: 'x7c', level: 'PRG', make: function (r) {
            return P.mc(r, 'Why can the builder cut the end of every rail at the same angle?', [
              { html: 'Every post is parallel to the others, so the rail meets each post at the same corresponding angle.', right: true },
              { html: 'Because the hill is straight.', why: 'The angle depends on the posts being parallel, not just the hill.', code: 'f7-hill' },
              { html: 'Because all the posts are the same height.', why: 'Height doesn’t change the angle. What is true about the directions of the posts?', code: 'f7-height' },
              { html: 'Because the rail is perpendicular to the posts.', why: 'It isn’t: the angle is not 90°.', code: 'f7-perp' }],
              'The posts are all parallel, so the rail (a transversal) meets every post at equal corresponding angles.', ['What do all the posts have in common?'], 'same cut');
          } }] },
      { num: '8', outcome: 'G6', stem: '', parts: [
        { id: 'x8', level: 'EMG', make: function (r) {
          var L3 = r.pick([['A', 'B', 'C', 'E'], ['P', 'Q', 'R', 'S'], ['K', 'L', 'M', 'N']]), ang = '∠' + L3[0] + L3[1] + L3[2], V = L3[1], E = L3[3];
          var steps = [{ id: 's1', html: 'Put the compass point on ' + V + ' and draw an arc that crosses both arms of ' + ang + '.' }, { id: 's2', html: 'Without changing the width, put the compass point on ' + E + ' and draw the same arc across the ray.' },
            { id: 's3', html: 'Set the compass to the distance between the two points where the first arc crossed the arms.' }, { id: 's4', html: 'Put the compass point where the second arc crosses the ray, and draw an arc that crosses the second arc.' },
            { id: 's5', html: 'Draw a ray from ' + E + ' through the point where the arcs cross.' }];
          return P.order(r, 'Copy ' + ang + ' onto a ray from ' + E + ' using a compass and a straightedge. Put the steps in order.', steps, { first: 'first step', last: 'last step', sep: '→', why: function (x, y) { return 'Step “' + steps.filter(function (s) { return s.id === y; })[0].html.replace(/\.$/, '') + '” comes before step “' + steps.filter(function (s) { return s.id === x; })[0].html.replace(/\.$/, '') + '”.'; } },
            steps.map(function (s, i) { return (i + 1) + '. ' + s.html; }).join('<br>') + '<br>The new angle equals ' + ang + ' (check with a protractor).', ['The first arc is drawn on the angle you are copying.'], 'copy steps');
        } }] },
      { num: '9', outcome: 'G5', stem: '', parts: [
        { id: 'x9', level: 'EMG', make: function (r) {
          var th = find(function () { return r.int(28, 52); }, function (x) { return x !== 39 && x !== 53; }, 44), lt = r.pick([['p', 'q', 'r'], ['a', 'b', 'c'], ['u', 'v', 'w']]);
          var d1 = 90 - th / 2, d2 = 90 + th / 2, c1 = Math.cos(d1 * RAD), s1 = Math.sin(d1 * RAD), c2 = Math.cos(d2 * RAD), s2 = Math.sin(d2 * RAD);
          var F = LF({ g1: { p: [-2 * c1, -2 * s1], q: [1.8 * c1, 1.8 * s1], width: 4 }, g2: { p: [-2 * c2, -2 * s2], q: [1.8 * c2, 1.8 * s2], width: 4 } }, { scale: 46 });
          var svg = F.svg({ labels: [{ ang: F.ang('g1', 1, 'g2', 1), text: th + '°', arc: true }, { ang: F.ang('g2', 1, 'g1', -1), text: lt[0] }, { ang: F.ang('g1', -1, 'g2', -1), text: lt[1] }, { ang: F.ang('g2', -1, 'g1', 1), text: lt[2] }], width: 200, aria: 'sawhorse legs' });
          return P.fields('The two legs of a sawhorse cross like an X. The angle between the legs at the top is ' + D(th) + '. Find ' + lt.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.' + svg, lt.map(function (x) { return { label: t(x + '='), after: '°', name: x }; }),
            [G.angleChk(180 - th, { supplementTrap: '<i>' + lt[0] + '</i> and the ' + D(th) + ' angle are side by side on a straight leg: they add to 180°.' }), G.angleChk(th, { supplementTrap: '<i>' + lt[1] + '</i> is vertically opposite the ' + D(th) + ' angle, so they are equal.' }), G.angleChk(180 - th, { supplementTrap: '<i>' + lt[2] + '</i> is vertically opposite <i>' + lt[0] + '</i>.' })],
            [String(180 - th), String(th), String(180 - th)], t(lt[0] + '=' + (180 - th) + '^\\circ,\\ ' + lt[1] + '=' + th + '^\\circ,\\ ' + lt[2] + '=' + (180 - th) + '^\\circ'),
            t(lt[0] + '=180^\\circ-' + th + '^\\circ=' + (180 - th) + '^\\circ') + ' (supplementary: on a straight leg)<br>' + t(lt[1] + '=' + th + '^\\circ') + ' (vertically opposite the ' + D(th) + ' angle)<br>' + t(lt[2] + '=' + (180 - th) + '^\\circ') + ' (vertically opposite <i>' + lt[0] + '</i>)', ['Straight line: add to 180°. Vertically opposite: equal.'], 'sawhorse');
        } }] },
      { num: '10', outcome: 'G5', stem: '', parts: [
        { id: 'x10', level: 'BEG', make: function (r) {
          return P.mc(r, 'Two lines are cut by a transversal, but the lines are <b>not</b> parallel. Which statement must be true?', [
            { html: 'Corresponding angles are equal.', why: 'Only for parallel lines.', code: 'm10-c' }, { html: 'Alternate interior angles are equal.', why: 'Only for parallel lines.', code: 'm10-ai' },
            { html: 'Interior angles on the same side add to 180°.', why: 'Only for parallel lines.', code: 'm10-is' }, { html: 'Vertically opposite angles are equal.', right: true }],
            'Vertically opposite angles are equal at any crossing. The other three are true only when the lines are parallel.', ['Which rule stays at one crossing?'], 'must be true');
        } }] },
      { num: '11', outcome: 'G6', stem: '', parts: [
        { id: 'x11', level: 'EMG', make: function (r) {
          var n = find(function () { return r.int(10, 18); }, function (x) { return x !== 11; }, 15), s = (n - 2) * 180;
          return TK.angP('<b>Numerical response.</b> The sum of the interior angles of a polygon with ' + n + ' sides is ____°.', s, { nr: true, trap: false, alts: [[n * 180, 'Use n − 2 triangles: ' + t('(' + n + '-2)\\times 180^\\circ') + '.'], [(n - 1) * 180, 'Use n − 2.'], [(n - 3) * 180, 'Use n − 2.']], sol: t('(' + n + '-2)\\times 180^\\circ=' + (n - 2) + '\\times 180^\\circ=' + s + '^\\circ'), hints: ['Angle sum = (n − 2) × 180°.'], text: 'NR sum' });
        } }] },
      { num: '12', outcome: 'G1', stem: function (sh) { return '<b>Race to ' + sh.N + '.</b> A token starts off the board, before square 1 of a strip numbered 1 to ' + sh.N + '. Two players take turns moving it forward 1, 2 or 3 squares. Whoever lands on square ' + sh.N + ' wins.'; },
        shared: function (r) {
          var N = r.pick([17, 19, 21, 22, 23, 25, 26]), M = r.pick([20, 24, 25, 27, 29, 30]), k = r.pick([4, 4, 5]);
          if (M === 25 && k === 4) M = r.pick([20, 24]);
          return { N: N, M: M, k: k };
        },
        parts: [
          { id: 'x12a', level: 'ADV', make: function (r, sh) {
            var want = []; for (var s = sh.N; s >= 1; s -= 4) want.push(s);
            return squaresPart('Work backward. Which squares do you want to land on? Tap all of them.', sh.N, want, 4, 'Land on ' + sh.N + ' to win. If you land on ' + (sh.N - 4) + ', the other player can only reach ' + (sh.N - 3) + ', ' + (sh.N - 2) + ' or ' + (sh.N - 1) + ', and you reach ' + sh.N + '. So the safe squares are 4 apart: ' + want.slice().reverse().join(', ') + '.');
          } },
          { id: 'x12b', level: 'PRG', make: function (r, sh) {
            var s0 = sh.N % 4, first = s0 !== 0;
            var opts = [{ html: '<b>Go first</b> and move to square ' + (s0 || 4) + '.', right: first, why: first ? null : (s0 === 0 ? 'From the start you can only reach 1, 2 or 3, and none of them is safe (the safe squares are multiples of 4).' : ''), code: 'r12-f' },
              { html: '<b>Go second.</b> Then move to the next safe square each turn.', right: !first, why: first ? 'Square ' + s0 + ' is safe and you can reach it on your first move, so go first.' : null, code: 'r12-s' },
              { html: '<b>Go first</b> and move to square ' + (s0 === 3 ? 1 : 3) + '.', why: 'Is square ' + (s0 === 3 ? 1 : 3) + ' one of the safe squares?', code: 'r12-wrong' },
              { html: 'It doesn’t matter: it is just luck.', why: 'Work backward from ' + sh.N + ': the player who can always reach a safe square wins.', code: 'r12-luck' }];
            return P.mc(r, 'Should you go first or second? What is your first move?', opts, first ? 'Go first and move to square ' + s0 + ' (a safe square). After that, if they move 1, 2 or 3, you move 3, 2 or 1, so you always land on the next safe square.' : 'The safe squares are multiples of 4, and the first player can’t reach one. Go second, then always move to the next multiple of 4.', ['Which safe square can be reached on the very first move?'], 'first or second');
          } },
          { id: 'x12c', level: 'MAS', make: function (r, sh) {
            var want = []; for (var s = sh.M; s >= 1; s -= (sh.k + 1)) want.push(s);
            return squaresPart('Variation: the strip goes to ' + sh.M + ', and each move is 1 to ' + sh.k + ' squares. Which squares do you want to land on now? Tap all of them.', sh.M, want, sh.k + 1, 'Now the safe squares are ' + (sh.k + 1) + ' apart (you can always make the two moves in a round add to ' + (sh.k + 1) + '): ' + want.slice().reverse().join(', ') + '.');
          } },
          { id: 'x12d', level: 'PRG', make: function (r, sh) {
            var st = sh.k + 1, s0 = sh.M % st, first = s0 !== 0;
            return P.mc(r, 'In the variation (strip to ' + sh.M + ', moves of 1 to ' + sh.k + '), should you go first or second?', [
              { html: first ? '<b>First</b>, and move to square ' + s0 + '.' : '<b>Second</b>: the first player can’t reach a safe square, and then you move to square ' + st + '.', right: true },
              { html: first ? '<b>Second</b>, then move to square ' + st + '.' : '<b>First</b>, and move to square ' + Math.min(sh.k, 3) + '.', why: first ? 'Square ' + s0 + ' is safe and reachable on the first move: take it.' : 'The first safe square is ' + st + ', which can’t be reached in one move (at most ' + sh.k + ').', code: 'r12-swap' },
              { html: '<b>First</b>, and move ' + sh.k + ' squares every turn.', why: 'Moving the most each time doesn’t control the game. Aim for the safe squares.', code: 'r12-max' },
              { html: 'It doesn’t matter.', why: 'One player can always win by landing on the safe squares.', code: 'r12-luck2' }],
              'The safe squares are ' + st + ' apart: ' + sh.M + ', ' + (sh.M - st) + ', … , ' + (s0 || st) + '.<br>' + (first ? 'Square ' + s0 + ' can be reached on the first move, so go <b>first</b> and move to ' + s0 + '.' : 'The first player can reach at most ' + sh.k + ', not ' + st + ', so go <b>second</b>: whatever they move, you move to square ' + st + '.'), ['Find the smallest safe square. Can the first player reach it?'], 'variation first/second');
          } }] },
      { num: '13', section: 'C. Stretch', outcome: 'G5', stem: '', parts: [
        { id: 'x13', level: 'MAS', make: function (r) {
          var al = find(function () { return r.int(26, 46); }, function (x) { return x !== 35 && x !== 34; }, 30), be = find(function () { return r.int(38, 60); }, function (x) { return x !== 48 && x !== 51 && Math.abs(x - al) > 4; }, 52), x = al + be;
          var Ap = [0, 2], Bp = [1 / Math.tan(al * RAD), 1.05], Cp = [Bp[0] - 1.05 / Math.tan(be * RAD), 0], xl = Math.min(0, Cp[0]) - 0.8, xr = Bp[0] + 1.4;
          var lines = { l1: { p: [xl, 2], q: [xr, 2], name: 'ℓ₁', marks: 1, markAt: 0.86 }, l2: { p: [xl, 0], q: [xr, 0], name: 'ℓ₂', marks: 1, markAt: 0.86 }, ab: { p: Ap, q: Bp }, bc: { p: Bp, q: Cp } };
          var F = LF(lines, { scale: 52 });
          var svg = F.svg({ labels: [{ ang: F.ang('l1', 1, 'ab', 1), text: al + '°', arc: true }, { ang: F.ang('l2', 1, 'bc', -1), text: be + '°', arc: true }, { ang: F.ang('ab', -1, 'bc', 1), text: 'x', min: 18 }], dots: [Bp], texts: [{ at: [Ap[0], 2.3], s: 'A', weight: 700, color: '#1d2633', size: 14 }, { at: [Bp[0] + 0.28, Bp[1]], s: 'B', weight: 700, color: '#1d2633', size: 14 }, { at: [Cp[0], -0.3], s: 'C', weight: 700, color: '#1d2633', size: 14 }], width: 300, aria: 'a bend between parallel lines' });
          return TK.angP('ℓ₁ ∥ ℓ₂. Find <i>x</i>, the angle at the bend <i>B</i>. (Hint: draw a line through <i>B</i> parallel to ℓ₁.)' + svg, x, { trap: false,
            alts: [[180 - x, 'That’s the angle on the other side of the bend.'], [Math.abs(be - al), 'The line through B splits x into two parts: <b>add</b> them.'], [360 - x, 'Split x with a line through B parallel to ℓ₁: two alternate interior angles.']],
            sol: 'Draw a line through <i>B</i> parallel to ℓ₁ (and ℓ₂). It splits <i>x</i> into two parts.<br>Top part: ' + D(al) + ' (alternate interior with the angle at <i>A</i>).<br>Bottom part: ' + D(be) + ' (alternate interior with the angle at <i>C</i>).<br>' + t('x=' + al + '^\\circ+' + be + '^\\circ=' + x + '^\\circ'), hints: ['Draw the parallel line through B and look for two Z shapes.'], text: 'bend' });
        } }] },
      { num: '14', outcome: 'G5', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂. A transversal makes corresponding angles of ' + t('(' + sh.m + 'x+' + sh.b + ')^\\circ') + ' and ' + D(sh.v) + '.' + TK.std({ tilt: PK.tiltFor(sh.k, sh.v), angles: (function () { var o = {}; o[sh.k] = sh.v; o[sh.j] = '(' + sh.m + 'x + ' + sh.b + ')°'; return o; })(), numbers: false }); },
        shared: function (r) {
          var g = find(function () { var m0 = r.pick([2, 3, 4]), x0 = r.int(12, 40), b0 = r.int(2, 30); return { m: m0, x: x0, b: b0, v: m0 * x0 + b0 }; }, function (g) { return g.v > 40 && g.v < 140 && Math.abs(g.v - 90) > 8 && !(g.m === 2 && g.b === 10); }, { m: 2, x: 31, b: 8, v: 70 });
          var pr = TK.poolPick(r, 'corresponding');
          return { m: g.m, b: g.b, v: g.v, x: g.x, k: pr[0], j: pr[1] };
        },
        parts: [
          { id: 'x14a', level: 'PRG', make: function (r, sh) {
            return P.number('Find <i>x</i>.', sh.x, function (v) { return v === sh.v ? { code: 'u5l9-x', hint: 'That’s the angle. Solve ' + t(sh.m + 'x+' + sh.b + '=' + sh.v) + ' for x.' } : v === (sh.v + sh.b) / sh.m ? { code: 'u5l9-x', hint: 'Subtract ' + sh.b + ' first (don’t add it).' } : v === (180 - sh.v - sh.b) / sh.m ? { code: 'u5l9-x', hint: 'Corresponding angles are <b>equal</b>, not supplementary.' } : null; },
              'Corresponding angles are equal: ' + t(sh.m + 'x+' + sh.b + '=' + sh.v) + '<br>' + t(sh.m + 'x=' + (sh.v - sh.b)) + ', ' + t('x=' + sh.x) + '<br>Check: ' + t(sh.m + '(' + sh.x + ')+' + sh.b + '=' + sh.v) + ' ✓', ['Corresponding angles are equal, so set the two expressions equal.'], 'solve x');
          } },
          { id: 'x14b', level: 'EMG', make: function (r, sh) { return TK.angP('Find the interior angle on the same side of the transversal as the ' + D(sh.v) + ' angle.', 180 - sh.v, { alts: [[sh.v, 'Interior angles on the same side add to 180°.']], trap: false, sol: t('180^\\circ-' + sh.v + '^\\circ=' + (180 - sh.v) + '^\\circ'), hints: ['Same-side interior angles add to 180°.'], text: 'same side' }); } }] },
      { num: '15', outcome: 'G6', stem: '', parts: [
        { id: 'x15', level: 'MAS', make: function (r) {
          var g = find(function () { return { b1: r.int(20, 80), b2: r.int(110, 175) }; }, function (g) { var a = g.b1 + 180 - g.b2; return a > 25 && a < 160 && !(g.b1 === 40 && g.b2 === 160); }, { b1: 50, b2: 150 }), ang = g.b1 + 180 - g.b2;
          var svg = G.compassSVG({ origin: 'A', points: [{ name: 'B', bearing: g.b1, dist: 120 }, { name: 'C', bearing: g.b2, dist: 100, from: 'B' }], northAt: ['B'], width: 280 });
          return TK.angP('A search-and-rescue team walks from base <i>A</i> on a bearing of ' + bt(g.b1) + ' to a checkpoint <i>B</i>. At <i>B</i> they turn and walk on a bearing of ' + bt(g.b2) + ' to point <i>C</i>. Find ∠<i>ABC</i>, the angle between the two parts of the walk at <i>B</i>.' + svg, ang, { trap: false,
            alts: [[g.b2 - g.b1, 'That’s how much the bearing changed. At <i>B</i>, the direction back to <i>A</i> is the back bearing of ' + bt(g.b1) + '.', 'u5l9-walk'], [180 - ang, 'That’s the turn the team makes, not the angle between the two paths at B.']],
            sol: 'At <i>B</i>, draw a north arrow. The direction from <i>B</i> back to <i>A</i> is the back bearing: ' + t(G.bearingText(g.b1) + '^\\circ+180^\\circ=' + (g.b1 + 180) + '^\\circ') + '.<br>The direction from <i>B</i> to <i>C</i> is ' + bt(g.b2) + '.<br>Both are measured clockwise from north at <i>B</i>, so the angle between them is ' + t((g.b1 + 180) + '^\\circ-' + g.b2 + '^\\circ=' + ang + '^\\circ') + '.', hints: ['At B, what is the bearing back to A?', 'Subtract the two bearings measured at B.'], text: 'walk angle' });
        } }] }
    ]
  });

  /* ================= builders used above ================= */
  function estMC(r, v, rot, refs) {
    var R0 = refs[0], uniq = refs.filter(function (x, i, arr) { return arr.indexOf(x) === i && x > 0 && x < 180; });
    var svg = G.angleSVG({ a1: rot, a2: rot + v, width: 200 });
    var best = uniq.reduce(function (b, x) { return Math.abs(x - v) < Math.abs(b - v) ? x : b; }, uniq[0]);
    return P.mc(r, svg + 'Which is the best estimate?', uniq.map(function (x) { return { html: 'about ' + D(x), right: x === best, why: x === best ? null : (x < v ? 'It opens wider than ' + D(x) + '.' : 'It is smaller than ' + D(x) + '.') + ' Compare with a right angle (90°) first.', code: 'est-' + x }; }),
      'It is close to the ' + D(best) + ' referent (it is ' + D(v) + ').', ['Compare with a right angle first, then with half of one (45°).'], 'estimate');
  }
  function tableRow(a) {
    var comp = a < 90 ? 90 - a : null;
    return P.fields('Angle ' + D(a) + ': write its type, its complement and its supplement.', [{ label: 'Type:', mode: 'text', name: 'Type', placeholder: 'acute, obtuse…' }, { label: 'Complement:', mode: 'text', name: 'Complement', placeholder: 'number or none' }, { label: 'Supplement:', after: '°', name: 'Supplement' }],
      [typeChk(a), noneOr(comp, { what: t('90^\\circ-' + a + '^\\circ'), alts: [{ v: 180 - a, hint: 'That’s the supplement. The complement adds to <b>90°</b>.' }] }), G.angleChk(180 - a, { supplementTrap: false, alts: (comp == null ? [] : [{ v: comp, hint: 'That’s the complement. The supplement adds to <b>180°</b>.' }]).concat([{ v: 360 - a, hint: 'Supplements add to 180°, not 360°.' }]) })],
      [G.kindOf(a), comp == null ? 'none' : String(comp), String(180 - a)], G.kindOf(a) + '; complement ' + (comp == null ? 'none' : D(comp)) + '; supplement ' + D(180 - a),
      'Complement = 90° − angle: ' + (comp == null ? 'none, because ' + D(a) + ' is already more than 90°' : t('90^\\circ-' + a + '^\\circ=' + comp + '^\\circ')) + '<br>Supplement = 180° − angle: ' + t('180^\\circ-' + a + '^\\circ=' + (180 - a) + '^\\circ'), ['Complements add to 90°; supplements add to 180°.'], 'table row');
  }
  function squaresPart(prompt, N, want, gap, sol) {
    var W = want.map(String), opts = []; for (var i = 1; i <= N; i++) opts.push({ value: String(i), html: String(i) });
    return { prompt: prompt, input: { type: 'select', options: opts, help: 'Tap every square you want to land on.' },
      check: function (resp) {
        resp = (resp || []).map(String); if (!resp.length) return form('empty', 'Tap the squares first.');
        var ex = resp.filter(function (x) { return W.indexOf(x) < 0; }), mi = W.filter(function (x) { return resp.indexOf(x) < 0; });
        if (!ex.length && !mi.length) return ok();
        if (ex.length) return wrong('u5l9-race', 'If you land on ' + ex[0] + ', can the other player reach a safe square next? Work backward from ' + N + ' in steps of ' + gap + '.');
        return wrong('u5l9-race', 'You’re missing ' + (mi.length === 1 ? 'one square' : mi.length + ' squares') + '. Keep going backward in steps of ' + gap + ' all the way down.');
      }, key: W.slice().sort(), answer: want.slice().reverse().join(', '), solution: sol, hints: ['Start at the winning square and count back ' + gap + ' at a time.'], text: 'race squares' };
  }
})(window);
