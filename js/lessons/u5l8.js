/* Math 10-3 · Unit 5 · Lesson 8 — Parallel Lines and Transversals: Finding Missing Angles (G5)
 * Assignment 8 (u5_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u5_ep08.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the same situation and difficulty as the booklet item with new numbers around the booklet's
 * (the worked-example numbers 115°, 72°, 62°, 48°/57°, 36° are left out) and, for numbered diagrams, a new given angle.
 * Uses HW.u5tk from u5l7.js (numbered diagrams, line figures, pair names, the angle checker with targeted hints).
 * Answers: angles in degrees (the ° is optional). A recognised wrong value gets its own hint: the supplement when the pair
 * is equal (or the angle itself when the pair adds to 180°), copying an angle across lines that are not parallel, 90° − x
 * instead of 180° − x, 360° − x.
 * Conversions: "fill in the blanks (equal / 180°)" → a table of choices; "name the pair and write equal or add to 180°"
 * → multiple choice of name + rule; "find each angle and give a reason" → the angle (the reason is in the worked solution,
 * and the hints name the rule); "write every angle in its corner" → one box per angle; "name the pair, write an equation,
 * solve for x" → the pair name typed + x; "are the lines parallel? give the rule" → multiple choice of yes/no with the
 * rule; "explain / what mistake" → multiple choice of reasons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, TK = HW.u5tk;
  var A = TK.A, D = TK.D, find = TK.find, LF = TK.LF, RAD = Math.PI / 180, PN = G.PAIR_NAMES, PS = G.PAIR_SHORT, PAIRS = G.PAIRS;
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function tiltFor(k, v) { return [2, 4, 6, 8].indexOf(k) >= 0 ? v : 180 - v; }
  function M(tilt, k) { return TK.meas(tilt, 0, k); }
  var EQ = { corresponding: 1, 'alt-int': 1, 'alt-ext': 1, 'vert-opp': 1 };
  function relOf(a, b) { return EQ[TK.nameOf(a, b)] ? 'equal' : 'supp'; }
  var RELT = { equal: 'equal', supp: 'add to 180°' };
  /* the reason for ∠j from ∠k = v (parallel lines) */
  function reason(j, k, v) {
    var n = TK.nameOf(j, k), s = t('180^\\circ-' + v + '^\\circ');
    return { corresponding: 'corresponding to ' + A(k), 'alt-int': 'alternate interior with ' + A(k), 'alt-ext': 'alternate exterior with ' + A(k), 'vert-opp': 'vertically opposite ' + A(k),
      'int-same': 'interior, same side as ' + A(k) + ': ' + s, 'ext-same': 'exterior, same side as ' + A(k) + ': ' + s, linear: 'on a straight line with ' + A(k) + ': ' + s,
      none: (function () { var m = PAIRS.linear.filter(function (q) { return q[0] === j || q[1] === j; }).map(function (q) { return q[0] === j ? q[1] : q[0]; }).filter(function (x) { return EQ[TK.nameOf(x, k)]; })[0]; return 'on a straight line with ' + A(m) + ', which equals ' + A(k) + ': ' + s; })() }[n];
  }
  /* ∠j when ∠k = v and the lines are parallel */
  function findPart(prompt, k, v, tilt, j, o) {
    o = o || {}; var ans = M(tilt, j), n = TK.nameOf(j, k), rel = EQ[n] ? 'equal' : 'supp', nm = n === 'none' ? 'not a named pair' : n === 'linear' ? 'side by side on a straight line' : PN[n];
    var alts = rel === 'equal' ? [[180 - v, A(j) + ' and ' + A(k) + ' are ' + nm + ': with parallel lines they are <b>equal</b>.']] : [[v, A(j) + ' and ' + A(k) + ' are ' + nm + ': they <b>add to 180°</b>, so subtract from 180°.']];
    alts.push([360 - v, 'Use 180°, not 360°.']); if (rel === 'supp' && v < 90) alts.push([90 - v, 'Subtract from 180°, not 90°.']); if (rel === 'supp' && v > 90) alts.push([v - 90, 'Subtract from 180°, not 90°.']);
    return TK.angP(prompt, ans, { trap: false, alts: alts, sol: t('\\angle ' + j + '=' + ans + '^\\circ') + ' (' + reason(j, k, v) + ')', hints: o.hints || ['Name the pair first. Equal, or add to 180°?'], text: o.text || ('∠' + j) });
  }
  /* every other angle when ∠k = v (parallel) */
  function fillAll(prompt, k, v, tilt, o) {
    o = o || {}; var ks = [1, 2, 3, 4, 5, 6, 7, 8].filter(function (x) { return x !== k; }), big = Math.max(v, 180 - v), small = Math.min(v, 180 - v);
    return P.fields(prompt, ks.map(function (x) { return { label: t('\\angle ' + x + '='), after: '°', name: '∠' + x }; }),
      ks.map(function (x) { var ans = M(tilt, x); return G.angleChk(ans, { supplementTrap: A(x) + ' is the ' + (ans === small ? 'small' : 'big') + ' size, not the ' + (ans === small ? 'big' : 'small') + ' one. With parallel lines there are only two sizes: ' + D(small) + ' and ' + D(big) + '.' }); }),
      ks.map(function (x) { return String(M(tilt, x)); }), ks.map(function (x) { return A(x) + ' = ' + D(M(tilt, x)); }).join(', '),
      'With parallel lines there are only two sizes of angle.<br>' + ks.filter(function (x) { return M(tilt, x) === v; }).map(function (x) { return t('\\angle ' + x + '=' + v + '^\\circ') + ' (' + reason(x, k, v) + ')'; }).join('<br>') + '<br>' +
      ks.filter(function (x) { return M(tilt, x) !== v; }).map(function (x) { return t('\\angle ' + x + '=180^\\circ-' + v + '^\\circ=' + (180 - v) + '^\\circ'); }).join('<br>'), o.hints || ['Find the angles equal to ' + A(k) + ' first (vertically opposite, corresponding, alternate). The rest are ' + t('180^\\circ-' + v + '^\\circ') + '.'], o.text || 'all angles');
  }
  /* name + rule multiple choice for a numbered pair */
  function pairRelMC(r, a, b, o) {
    o = o || {}; var n = TK.nameOf(a, b), rel = EQ[n] ? 'equal' : 'supp', other = rel === 'equal' ? 'supp' : 'equal';
    var nm = function (x) { return x === 'linear' ? 'on a straight line' : PS[x]; };
    var pool = n === 'vert-opp' ? ['linear', 'corresponding', 'alt-int'] : n === 'linear' ? ['vert-opp', 'int-same', 'corresponding'] : ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'].filter(function (x) { return x !== n; });
    var others = r.sample(pool, 2);
    var opts = [{ html: '<b>' + nm(n) + '</b> · ' + RELT[rel], right: true },
      { html: '<b>' + nm(n) + '</b> · ' + RELT[other], why: 'Right name. With parallel lines, ' + (n === 'linear' ? 'angles on a straight line' : PN[n]) + ' ' + (rel === 'equal' ? 'are <b>equal</b>' : '<b>add to 180°</b>') + '.', code: 'rel-' + n }]
      .concat(others.map(function (x) { return { html: '<b>' + nm(x) + '</b> · ' + RELT[EQ[x] ? 'equal' : 'supp'], why: TK.pairWhy(n, x), code: 'name-' + x }; }));
    var p = P.mc(r, A(a) + ' and ' + A(b), opts, TK.why3(a, b) + '<br>They are <b>' + (n === 'linear' ? 'on a straight line' : PN[n]) + '</b>, so they ' + (rel === 'equal' ? 'are <b>equal</b>' : '<b>add to 180°</b>') + '.', ['Name the pair first, then use the rule for that name.'], o.text || 'name+rule');
    p.input.columns = 2; return p;
  }
  /* x from a pair: the pair name typed and x */
  function xPart(r, type, avoid, o) {
    o = o || {}; var pr = TK.poolPick(r, type, avoid), v = find(function () { return r.chance(0.5) ? r.int(38, 80) : r.int(100, 142); }, function (x) { return (o.avoidV || []).indexOf(x) < 0; }, 64);
    var k = pr[0], j = pr[1], tilt = tiltFor(k, v), x = M(tilt, j), lab = {}; lab[k] = v; lab[j] = 'x';
    var rel = EQ[type] ? 'equal' : 'supp';
    return P.fields(TK.std({ tilt: tilt, angles: lab, numbers: false, width: 280 }) + 'Name the pair of angles, then solve for <i>x</i>.', [{ label: 'Pair:', name: 'Pair name', mode: 'text', wide: true, placeholder: 'pair name' }, { label: t('x='), after: '°', name: 'x' }],
      [G.pairChk(type), G.angleChk(x, { supplementTrap: false, alts: [{ v: rel === 'equal' ? 180 - v : v, hint: cap(PN[type]) + (rel === 'equal' ? ' are <b>equal</b> when the lines are parallel.' : ' <b>add to 180°</b>: ' + t('x+' + v + '^\\circ=180^\\circ') + '.') }] })],
      [PS[type], String(x)], cap(PN[type]) + '; ' + t('x=' + x + '^\\circ'),
      cap(PN[type]) + (rel === 'equal' ? ' are equal.<br>' + t('x=' + v + '^\\circ') : ' add to 180°.<br>' + t('x+' + v + '^\\circ=180^\\circ') + '<br>' + t('x=' + x + '^\\circ')), ['Interior or exterior? Same side of the transversal or opposite sides?'], o.text || ('x ' + type));
  }
  /* "are ℓ1 and ℓ2 parallel?" for a pair of the given type */
  function parTest(r, type, o) {
    o = o || {}; var pr = TK.poolPick(r, type), a = pr[0], b = pr[1], tilt = find(function () { return r.int(64, 116); }, function (x) { return Math.abs(x - 90) > 4 && (o.avoidT || []).indexOf(x) < 0; }, 74);
    var par = o.par != null ? o.par : r.chance(0.5), va = M(tilt, a), vb = M(tilt, b) + (par ? 0 : (r.chance(0.5) ? 1 : -1) * r.int(1, 3)), rel = EQ[type] ? 'equal' : 'supp', lab = {}; lab[a] = va; lab[b] = vb;
    var rule = cap(PN[type]) + (rel === 'equal' ? ' must be <b>equal</b>' : ' must <b>add to 180°</b>'), sum = va + vb;
    var fact = rel === 'equal' ? (va === vb ? D(va) + ' = ' + D(vb) : D(va) + ' ≠ ' + D(vb)) : t(va + '^\\circ+' + vb + '^\\circ=' + sum + '^\\circ');
    var opts = [{ html: '<b>Yes.</b> For parallel lines, ' + PN[type] + (rel === 'equal' ? ' are equal' : ' add to 180°') + ', and these do.', right: par, why: par ? null : 'Check exactly: ' + fact + '.', code: 'par-yes' },
      { html: '<b>No.</b> For parallel lines, ' + PN[type] + (rel === 'equal' ? ' are equal' : ' add to 180°') + ', and these don’t.', right: !par, why: par ? 'Check again: ' + fact + '.' : null, code: 'par-no' },
      { html: '<b>Yes.</b> The angles are close, and the lines look parallel.', why: 'Close isn’t enough, and the diagram is not drawn to scale. The rule must work <b>exactly</b>.', code: 'par-close' },
      { html: '<b>' + (par ? 'No' : 'Yes') + '.</b> ' + cap(PN[type]) + (rel === 'equal' ? ' must add to 180°.' : ' must be equal.'), why: 'Wrong rule: ' + PN[type] + (rel === 'equal' ? ' are equal' : ' add to 180°') + ' when the lines are parallel.', code: 'par-rule' }];
    var p = P.mc(r, TK.std({ tilt: tilt, angles: lab, numbers: false, marks: 0, width: 260 }) + (o.prompt || 'Are ℓ₁ and ℓ₂ parallel? (Not drawn to scale.)'), opts,
      A(a) + ' and ' + A(b) + ' are ' + PN[type] + '. ' + rule + ' for parallel lines.<br>' + fact + (rel === 'supp' ? (sum === 180 ? '' : ', not 180°') : '') + '.<br>' + (par ? '<b>Yes</b>, the lines are parallel.' : '<b>No</b>, the lines are not parallel.'), ['Name the pair, then check its rule exactly.'], o.text || ('parallel? ' + type));
    p.input.columns = 1; return p;
  }
  /* a numbered parallel diagram with ∠k = v */
  function givenFig(k, v, extra) { var lab = {}; lab[k] = v; Object.assign(lab, extra || {}); return TK.std({ tilt: tiltFor(k, v), angles: lab }); }
  /* polygon (convex): pts in order, labels by vertex { text, arc }, marks: edges with ">" marks */
  function polyFig(pts, labels, o) {
    o = o || {}; var n = pts.length, lines = {};
    for (var i = 0; i < n; i++) lines['e' + i] = { p: pts[i], q: pts[(i + 1) % n] };
    (o.marks || []).forEach(function (i) { var a = pts[i], b = pts[(i + 1) % n], lr = a[0] <= b[0] ? [a, b] : [b, a]; lines['mk' + i] = { p: lr[0], q: lr[1], marks: o.mk || 1, markAt: 0.5 }; });   // ">" marks all pointing the same way
    var F = LF(lines, { scale: o.scale || 46 }), labs = [];
    labels.forEach(function (lb, i) { if (lb == null || lb === '') return; var lt = typeof lb === 'object' ? lb : { text: lb }; labs.push({ ang: F.ang('e' + ((i + n - 1) % n), -1, 'e' + i, 1), text: lt.text, arc: lt.arc }); });
    var polys = [{ pts: pts, fill: o.fill || '#eef3fb' }];
    return F.svg({ labels: labs, polys: polys, texts: o.texts, width: o.width || 300, aria: o.aria || 'shape' });
  }
  /* two parallel lines; two transversals meet at A on one line and make a triangle with the other */
  function veeFig(Lg, Rg, labs, flip) {
    var h = 2, Ax = 0, Bx = -h / Math.tan(Lg * RAD), Cx = h / Math.tan(Rg * RAD), xl = Math.min(Bx, -0.6) - 1.2, xr = Math.max(Cx, 0.6) + 1.2;
    var Y = function (y) { return flip ? h - y : y; };
    var lines = { l1: { p: [xl, Y(h)], q: [xr, Y(h)], name: 'ℓ₁', marks: 1, markAt: 0.08 }, l2: { p: [xl, Y(0)], q: [xr, Y(0)], name: 'ℓ₂', marks: 1, markAt: 0.08 },
      ab: { p: [Ax + (Ax - Bx) * 0.25, Y(h + h * 0.25)], q: [Bx + (Bx - Ax) * 0.2, Y(-h * 0.2)] }, ac: { p: [Ax + (Ax - Cx) * 0.25, Y(h + h * 0.25)], q: [Cx + (Cx - Ax) * 0.2, Y(-h * 0.2)] } };
    var F = LF(lines, { scale: 46 }), L1 = F.ang('l1', -1, 'ab', 1), R1 = F.ang('l1', 1, 'ac', 1), C1 = F.ang('ab', 1, 'ac', 1);
    var out = [{ ang: L1, text: labs[0], arc: true }, { ang: R1, text: labs[1], arc: true }, { ang: C1, text: labs[2] }];
    return F.svg({ labels: out, dots: [[Ax, Y(h)]], texts: [{ at: [Ax + 0.3, Y(h) + (flip ? -0.42 : 0.42)], s: 'A', weight: 700, size: 14, color: '#1d2633' }], width: 320, aria: 'two transversals meeting at A' });
  }

  HW.u5pk = { findPart: findPart, fillAll: fillAll, pairRelMC: pairRelMC, parTest: parTest, polyFig: polyFig, veeFig: veeFig, reason: reason, M: M, tiltFor: tiltFor, EQ: EQ };   // reused by the Unit 5 review (u5l9.js)
  HW.addCodes({ 'u5l8-turn': 'Wrong amount to turn', 'u5l8-90': 'Used 90° instead of 180°', 'u5l8-perp': 'Perpendicular angle not 90°' });
  var EXV = [115, 65, 72, 108, 62, 118, 48, 57, 36];   // the worked examples' angles

  HW.defineLesson({
    id: 'u5l8', unit: 5, num: '8', title: 'Parallel Lines and Transversals: Finding Missing Angles', outcome: 'G5',
    blurb: 'The parallel-line rules: equal pairs and pairs that add to 180°, finding every missing angle with a reason, real-world parallel lines, and testing whether two lines are parallel.',
    questions: [
      { num: '1', stem: 'Fill in the blanks. When two parallel lines are cut by a transversal:', shared: function (r) { return { ord: r.shuffle([0, 1, 2, 3, 4, 5]) }; }, parts: [
        { id: '1', sub: 'a–f', level: 'BEG', make: function (r, sh) {
          var rows = [['ca', 'corresponding angles are', 'eq'], ['ai', 'alternate interior angles are', 'eq'], ['ae', 'alternate exterior angles are', 'eq'], ['is', 'interior angles on the same side', 's'], ['es', 'exterior angles on the same side', 's'], ['vo', 'vertically opposite angles are', 'eq']];
          var order = sh.ord.map(function (i) { return rows[i]; }), want = {}; order.forEach(function (rw) { want[rw[0]] = rw[2]; });
          return P.grid('Choose for each pair.', order.map(function (rw) { return { id: rw[0], html: rw[1] }; }), [{ id: 'eq', html: 'equal' }, { id: 's', html: 'add to 180°' }], want,
            { why: function (row, got) { return { code: 'row', hint: (row === 'is' || row === 'es' ? 'Same-side pairs make a C or U shape: one is big and one is small, so they <b>add to 180°</b>.' : 'Corresponding, alternate and vertically opposite angles are <b>equal</b> when the lines are parallel.') }; } },
            'Equal: corresponding, alternate interior, alternate exterior, vertically opposite.<br>Add to 180°: interior angles on the same side, exterior angles on the same side.', ['Which pairs are one big angle and one small angle?'], 'rules');
        } }] },
      { num: '2', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂. For each pair, choose the name of the pair and the rule: <b>equal</b> or <b>add to 180°</b>.' + TK.std({ tilt: sh.tilt }); },
        shared: function (r) { return { tilt: TK.tilt(r, [62, 65, 115, 72, 108]), p: ['corresponding', 'alt-int', 'int-same', 'alt-ext', 'vert-opp', 'ext-same', 'linear'].map(function (id) { return TK.poolPick(r, id, [[3, 5], [3, 7], [3, 6], [3, 4], [3, 1]]); }) }; },
        parts: ['corresponding', 'alt-int', 'int-same', 'alt-ext', 'vert-opp', 'ext-same', 'linear'].map(function (id, i) {
          return { id: '2' + 'abcdefg'.charAt(i), level: id === 'vert-opp' || id === 'linear' ? 'BEG' : 'EMG', make: function (r, sh) { return pairRelMC(r, sh.p[i][0], sh.p[i][1], { text: 'rule ' + id }); } };
        }) },
      { num: '3', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '. Find each angle. (Think of the reason for each one.)' + givenFig(sh.k, sh.v); },
        shared: function (r) {
          var k = r.pick([1, 2, 7, 8]), v = find(function () { return r.chance(0.6) ? r.int(100, 145) : r.int(35, 80); }, function (x) { return EXV.indexOf(x) < 0 && x !== 125; }, 128);
          var rel = function (id) { return PAIRS[id].map(function (p) { return p[0] === k ? p[1] : p[1] === k ? p[0] : null; }).filter(function (x) { return x; })[0]; };
          var c = rel('corresponding'), lin = PAIRS.linear.filter(function (p) { return (p[0] === c || p[1] === c); }).map(function (p) { return p[0] === c ? p[1] : p[0]; }).filter(function (x) { return TK.nameOf(x, k) === 'none'; })[0];
          return { k: k, v: v, tilt: tiltFor(k, v), js: [c, rel('vert-opp'), rel('alt-ext'), rel('ext-same'), lin] };
        },
        parts: [0, 1, 2, 3, 4].map(function (i) {
          return { id: '3' + 'abcde'.charAt(i), level: ['BEG', 'BEG', 'EMG', 'EMG', 'EMG'][i], make: function (r, sh) {
            var j = sh.js[i], p = findPart('Find ' + A(j) + '.', sh.k, sh.v, sh.tilt, j, { text: '∠' + j });
            if (i === 4) { var c = sh.js[0]; p.solution = t('\\angle ' + j + '=180^\\circ-' + sh.v + '^\\circ=' + (180 - sh.v) + '^\\circ') + ' (on a straight line with ' + A(c) + ', which is ' + D(sh.v) + ')'; p.hints = ['Use your answer to (a): which angle sits beside ' + A(c) + ' on the line?']; }
            return p;
          } };
        }) },
      { num: '4', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '. Write the size of every other angle.' + givenFig(sh.k, sh.v); },
        shared: function (r) { return { k: r.int(1, 8), v: find(function () { return r.chance(0.5) ? r.int(32, 58) : r.int(122, 148); }, function (x) { return EXV.indexOf(x) < 0 && x !== 41; }, 44) }; },
        parts: [{ id: '4', level: 'PRG', make: function (r, sh) { return fillAll('Find each angle.', sh.k, sh.v, tiltFor(sh.k, sh.v)); } }] },
      { num: '5', stem: 'ℓ₁ ∥ ℓ₂. For each diagram, name the pair of angles, and solve for <i>x</i>.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { return xPart(r, 'corresponding', [[2, 6]], { avoidV: EXV.concat([73]) }); } },
        { id: '5b', level: 'PRG', make: function (r) { return xPart(r, 'int-same', [[4, 5]], { avoidV: EXV.concat([52]) }); } },
        { id: '5c', level: 'EMG', make: function (r) { return xPart(r, 'alt-ext', [[1, 7]], { avoidV: EXV.concat([138]) }); } }] },
      { num: '6', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂ and <i>t</i>₁ ∥ <i>t</i>₂. Find <i>a</i>, <i>b</i> and <i>c</i>, in that order.' + sh.svg; },
        shared: function (r) {
          var th = find(function () { return r.int(52, 80); }, function (x) { return EXV.indexOf(x) < 0 && x !== 67; }, 70), H = 1.8, W = 2.6, run = H / Math.tan(th * RAD), mir = r.chance(0.4);
          var lines = { l2: { p: [-1.7, 0], q: [W + run + 1.2, 0], name: 'ℓ₂', marks: 1, markAt: 0.05 }, l1: { p: [-1.7, H], q: [W + run + 1.2, H], name: 'ℓ₁', marks: 1, markAt: 0.05 },
            t1: { p: [-0.6 * Math.cos(th * RAD), -0.6 * Math.sin(th * RAD)], q: [(H + 0.8) / Math.tan(th * RAD), H + 0.8], name: 't₁', marks: 2, markAt: 0.22 },
            t2: { p: [W - 0.6 * Math.cos(th * RAD), -0.6 * Math.sin(th * RAD)], q: [W + (H + 0.8) / Math.tan(th * RAD), H + 0.8], name: 't₂', marks: 2, markAt: 0.22 } };
          if (mir) lines = TK.turn(lines, 0, true);
          var F = LF(lines, { scale: 46 }), sx = 1;
          var g0 = F.ang('l2', sx, 't1', 1), a = F.ang('t1', -1, 'l1', sx), b = F.ang('l1', -sx, 't2', -1), c = F.ang('t2', 1, 'l2', -sx);
          return { th: th, svg: F.svg({ labels: [{ ang: g0, text: th + '°', arc: true }, { ang: a, text: 'a' }, { ang: b, text: 'b' }, { ang: c, text: 'c' }], width: 330, aria: 'two pairs of parallel lines' }) };
        },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return TK.angP('Find <i>a</i>.', 180 - sh.th, { alts: [[sh.th, '<i>a</i> and the ' + D(sh.th) + ' angle are interior angles on the same side of <i>t</i>₁: they add to 180°.']], trap: false, sol: t('a=180^\\circ-' + sh.th + '^\\circ=' + (180 - sh.th) + '^\\circ') + ' (interior angles on the same side; <i>t</i>₁ is the transversal of ℓ₁ and ℓ₂)', hints: ['Use the transversal <i>t</i>₁. Where are <i>a</i> and the ' + D(sh.th) + ' angle?'], text: 'a' }); } },
          { id: '6b', level: 'PRG', make: function (r, sh) { return TK.angP('Find <i>b</i>.', sh.th, { alts: [[180 - sh.th, '<i>b</i> and <i>a</i> are interior angles on the same side (ℓ₁ is the transversal of <i>t</i>₁ and <i>t</i>₂): they add to 180°.']], trap: false, sol: t('b=180^\\circ-' + (180 - sh.th) + '^\\circ=' + sh.th + '^\\circ') + ' (interior angles on the same side as <i>a</i>; ℓ₁ is the transversal of <i>t</i>₁ and <i>t</i>₂)', hints: ['Now use ℓ₁ as the transversal and <i>t</i>₁, <i>t</i>₂ as the two parallel lines.'], text: 'b' }); } },
          { id: '6c', level: 'PRG', make: function (r, sh) { return TK.angP('Find <i>c</i>.', 180 - sh.th, { alts: [[sh.th, '<i>c</i> and <i>b</i> are interior angles on the same side (<i>t</i>₂ is the transversal): they add to 180°.']], trap: false, sol: t('c=180^\\circ-' + sh.th + '^\\circ=' + (180 - sh.th) + '^\\circ') + ' (interior angles on the same side as <i>b</i>; <i>t</i>₂ is the transversal of ℓ₁ and ℓ₂)<br>(Other reasons work too.)', hints: ['Use <i>t</i>₂ as the transversal of ℓ₁ and ℓ₂.'], text: 'c' }); } }] },
      { num: '7', stem: '', parts: [
        { id: '7', level: 'PRG', make: function (r) {
          var a = find(function () { return r.int(72, 88); }, function (x) { return x !== 81; }, 79), b = find(function () { return r.int(66, 86); }, function (x) { return x !== 74 && Math.abs(x - a) >= 4; }, 70);
          var h = 1.4, pts = [[0, 0], [4, 0], [4 - h / Math.tan(b * RAD), h], [h / Math.tan(a * RAD), h]];
          var fig = polyFig(pts, [{ text: a + '°', arc: true }, { text: b + '°', arc: true }, 'q', 'p'], { marks: [0, 2], width: 300, aria: 'trapezoid window' });
          return P.fields('A window over a door is shaped like a trapezoid. Its top and bottom edges are parallel. The two bottom angles are ' + D(a) + ' and ' + D(b) + '. Find the two top angles, <i>p</i> and <i>q</i>.' + fig,
            [{ label: t('p='), after: '°', name: 'p' }, { label: t('q='), after: '°', name: 'q' }],
            [G.angleChk(180 - a, { supplementTrap: false, alts: [{ v: a, hint: 'The top and bottom angles on the same slanted side are interior angles on the same side: they add to 180°.' }, { v: 180 - b, hint: '<i>p</i> is on the same side as the ' + D(a) + ' angle.' }] }),
              G.angleChk(180 - b, { supplementTrap: false, alts: [{ v: b, hint: 'The top and bottom angles on the same slanted side add to 180°.' }, { v: 180 - a, hint: '<i>q</i> is on the same side as the ' + D(b) + ' angle.' }] })],
            [String(180 - a), String(180 - b)], t('p=' + (180 - a) + '^\\circ,\\ q=' + (180 - b) + '^\\circ'),
            'Each slanted side is a transversal of the parallel top and bottom. The top and bottom angles on one side are interior angles on the same side, so they add to 180°.<br>' + t('p=180^\\circ-' + a + '^\\circ=' + (180 - a) + '^\\circ') + '<br>' + t('q=180^\\circ-' + b + '^\\circ=' + (180 - b) + '^\\circ'), ['Each slanted side is a transversal of the two parallel edges.'], 'trapezoid');
        } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var a = find(function () { return r.int(42, 70); }, function (x) { return x !== 53 && EXV.indexOf(x) < 0; }, 58), h = 1.3, s = h / Math.tan(a * RAD), pts = [[0, 0], [3, 0], [3 + s, h], [s, h]];
          var lt = r.pick([['d', 'e', 'f'], ['p', 'q', 'r'], ['u', 'v', 'w']]);
          var fig = polyFig(pts, [{ text: a + '°', arc: true }, lt[2], lt[1], lt[0]], { width: 280, fill: '#fdf1e2', aria: 'parallelogram tile' });
          var A1 = 180 - a;
          return P.fields('A floor tile is a parallelogram (both pairs of opposite sides are parallel). One of its angles is ' + D(a) + '. Find the other three angles.' + fig, lt.map(function (x) { return { label: t(x + '='), after: '°', name: x }; }),
            [G.angleChk(A1, { supplementTrap: 'Interior angles on the same side add to 180°.' }), G.angleChk(a, { supplementTrap: 'Interior angles on the same side add to 180° (use the top as the transversal).' }), G.angleChk(A1, { supplementTrap: 'Interior angles on the same side add to 180°.' })],
            [String(A1), String(a), String(A1)], t(lt[0] + '=' + A1 + '^\\circ,\\ ' + lt[1] + '=' + a + '^\\circ,\\ ' + lt[2] + '=' + A1 + '^\\circ'),
            t(lt[0] + '=180^\\circ-' + a + '^\\circ=' + A1 + '^\\circ') + ' (interior angles on the same side; the left side is the transversal)<br>' + t(lt[1] + '=180^\\circ-' + A1 + '^\\circ=' + a + '^\\circ') + ' (interior angles on the same side; the top is the transversal)<br>' + t(lt[2] + '=180^\\circ-' + a + '^\\circ=' + A1 + '^\\circ') + ' (interior angles on the same side; the right side is the transversal)', ['Go round the tile one corner at a time. Each side is a transversal of two parallel sides.'], 'parallelogram');
        } }] },
      { num: '9', stem: function (sh) { return 'Two railway tracks are parallel. A road crosses both tracks, and it is perpendicular to track 1. A bike path also crosses both tracks. It makes a ' + D(sh.th) + ' angle with track 1.' + sh.svg; },
        shared: function (r) {
          var th = find(function () { return r.int(24, 40); }, function (x) { return x !== 29 && x !== 36; }, 32), H = 1.3, q = -H / Math.tan(th * RAD), mir = r.chance(0.4);
          var lines = { t1: { p: [q - 1.4, H], q: [2.4, H], name: 'track 1', nameSize: 13, marks: 1, markAt: 0.06 }, t2: { p: [q - 1.4, 0], q: [2.4, 0], name: 'track 2', nameSize: 13, marks: 1, markAt: 0.06 },
            rd: { p: [1.4, H + 0.6], q: [1.4, -0.6], color: '#8a909c', width: 3 }, bp: { p: [q - 0.7 * Math.cos(th * RAD), -0.7 * Math.sin(th * RAD)], q: [1.0 * Math.cos(th * RAD), H + 1.0 * Math.sin(th * RAD)], dash: '7 5' } };
          if (mir) lines = TK.turn(lines, 0, true);
          var F = LF(lines, { scale: 46 }), sx = 1;
          var g = F.ang('t1', sx, 'bp', 1), pA = F.ang('bp', 1, 't2', -sx), rt = F.ang('t1', -sx, 'rd', 1);
          var tp = function (pt) { return mir ? [-pt[0], pt[1]] : pt; };
          return { th: th, svg: F.svg({ labels: [{ ang: g, text: th + '°', arc: true }, { ang: pA, text: 'p' }], rights: [rt], texts: [{ at: tp([1.4, -0.85]), s: 'road' }, { at: tp([q - 0.95 * Math.cos(th * RAD) - 0.35, -0.95 * Math.sin(th * RAD) - 0.15]), s: 'bike path' }], width: 340, aria: 'tracks, road and bike path' }) };
        },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { return TK.angP('What angle does the road make with track 2?', 90, { trap: false, alts: [[sh.th, 'That’s the bike path. The road is perpendicular to track 1.'], [180 - sh.th, 'Use the road, not the bike path.']], sol: '90°. A transversal that is perpendicular to one of two parallel lines is perpendicular to the other one too (corresponding angles are equal).', hints: ['The road meets track 1 at a right angle. What about track 2?'], text: 'road 90' }); } },
          { id: '9b', level: 'ADV', make: function (r, sh) {
            return TK.angP('Find angle <i>p</i>, where the bike path meets track 2.', 180 - sh.th, { trap: false, alts: [[sh.th, 'The ' + D(sh.th) + ' angle is <b>above</b> track 1 and <i>p</i> is between the tracks. Find the angle at track 1 that is in the same position as <i>p</i>, or use vertically opposite first.'], [90 - sh.th, 'The road isn’t part of this angle. Use the bike path and the tracks.'], [90 + sh.th, 'Use 180°: the bike path and the tracks make a big angle and a small angle.']],
              sol: 'The angle below track 1, on the other side of the path, is ' + D(sh.th) + ' (vertically opposite the ' + D(sh.th) + ' angle).<br>That angle and <i>p</i> are interior angles on the same side, so ' + t('p=180^\\circ-' + sh.th + '^\\circ=' + (180 - sh.th) + '^\\circ') + '.', hints: ['Find the angle just below track 1 first (vertically opposite).', 'Then that angle and <i>p</i> are on the same side of the path, between the tracks.'], text: 'bike p' });
          } }] },
      { num: '10', stem: function (sh) { return 'In this bridge, the top beam is parallel to the deck. The posts are perpendicular to the deck. A diagonal brace makes a ' + D(sh.th) + ' angle with the deck.' + sh.svg; },
        shared: function (r) {
          var th = find(function () { return r.int(44, 62); }, function (x) { return EXV.indexOf(x) < 0 && x !== 52; }, 50), H = 2, w = H / Math.tan(th * RAD);
          var lines = { deck: { p: [-0.3, 0], q: [4 * w + 0.3, 0], width: 3.2, name: 'deck', nameSize: 13 }, beam: { p: [0, H], q: [4 * w, H], name: 'top beam', nameSize: 13 }, br: { p: [0, 0], q: [w, H] }, post: { p: [w, 0], q: [w, H] } };
          var F = LF(lines, { scale: 40 }), segs = [];
          [0, 2, 3, 4].forEach(function (i) { segs.push({ p: [i * w, 0], q: [i * w, H], color: '#1d2633', width: 2.4 }); });
          segs.push({ p: [w, 0], q: [2 * w, H], color: '#1d2633', width: 2.4 }); segs.push({ p: [2 * w, H], q: [3 * w, 0], color: '#1d2633', width: 2.4 }); segs.push({ p: [3 * w, H], q: [4 * w, 0], color: '#1d2633', width: 2.4 });
          var lt = r.pick([['g', 'k'], ['m', 'n'], ['x', 'y']]);
          var g = F.ang('beam', -1, 'br', -1), k = F.ang('post', -1, 'br', -1), z = F.ang('deck', 1, 'br', 1);
          return { th: th, lt: lt, svg: F.svg({ labels: [{ ang: z, text: th + '°', arc: true }, { ang: g, text: lt[0] }, { ang: k, text: lt[1] }], rights: [F.ang('deck', 1, 'post', 1)], segs: segs, width: 380, aria: 'bridge truss' }) };
        },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { return TK.angP('What angle does each post make with the top beam?', 90, { trap: false, alts: [[sh.th, 'That’s the brace. The posts are perpendicular to the deck, and the beam is parallel to the deck.']], sol: '90°. The posts are perpendicular to the deck, and the top beam is parallel to the deck, so the posts are perpendicular to the beam too.', hints: ['A line perpendicular to one of two parallel lines is perpendicular to the other.'], text: 'post 90' }); } },
          { id: '10b', level: 'PRG', make: function (r, sh) { return TK.angP('Find <i>' + sh.lt[0] + '</i>, the angle between the brace and the top beam.', sh.th, { alts: [[180 - sh.th, 'The top beam and the deck are parallel and the brace is a transversal: <i>' + sh.lt[0] + '</i> and the ' + D(sh.th) + ' angle make a Z (alternate interior), so they are equal.'], [90 - sh.th, 'That’s the angle between the brace and the post.']], trap: false, sol: t(sh.lt[0] + '=' + sh.th + '^\\circ') + '. The top beam and the deck are parallel and the brace is a transversal, so <i>' + sh.lt[0] + '</i> and ' + D(sh.th) + ' are alternate interior angles.', hints: ['Look for a Z shape.'], text: 'beam angle' }); } },
          { id: '10c', level: 'ADV', make: function (r, sh) { return TK.angP('Find <i>' + sh.lt[1] + '</i>, the angle between the brace and the post.', 90 - sh.th, { alts: [[180 - sh.th, 'The post and the beam make a 90° corner, not a straight line: <i>' + sh.lt[0] + '</i> + <i>' + sh.lt[1] + '</i> = 90°.'], [sh.th, 'That’s <i>' + sh.lt[0] + '</i>. <i>' + sh.lt[0] + '</i> and <i>' + sh.lt[1] + '</i> together make the 90° corner.'], [90 + sh.th, 'Subtract: <i>' + sh.lt[0] + '</i> + <i>' + sh.lt[1] + '</i> = 90°.']], trap: false, sol: 'The post makes 90° with the top beam, so ' + t(sh.lt[0] + '+' + sh.lt[1] + '=90^\\circ') + ' (complementary).<br>' + t(sh.lt[1] + '=90^\\circ-' + sh.th + '^\\circ=' + (90 - sh.th) + '^\\circ'), hints: ['<i>' + sh.lt[0] + '</i> and <i>' + sh.lt[1] + '</i> together fill the corner between the beam and the post.'], text: 'post angle' }); } }] },
      { num: '11', stem: 'Are ℓ₁ and ℓ₂ parallel? Choose the answer with the rule you used. (The diagrams are not drawn to scale.)', shared: function (r) { var ps = [r.chance(0.5), r.chance(0.5), r.chance(0.5)]; if (ps[0] === ps[1] && ps[1] === ps[2]) ps[r.int(0, 2)] = !ps[0]; return { ps: ps }; }, parts: [
        { id: '11a', level: 'EMG', make: function (r, sh) { return parTest(r, 'alt-int', { par: sh.ps[0], prompt: '(a) Are ℓ₁ and ℓ₂ parallel?' }); } },
        { id: '11b', level: 'EMG', make: function (r, sh) { return parTest(r, 'corresponding', { par: sh.ps[1], prompt: '(b) Are ℓ₁ and ℓ₂ parallel?' }); } },
        { id: '11c', level: 'PRG', make: function (r, sh) { return parTest(r, 'int-same', { par: sh.ps[2], prompt: '(c) Are ℓ₁ and ℓ₂ parallel?' }); } }] },
      { num: '12', stem: function (sh) { return 'Three lines <i>a</i>, <i>b</i> and <i>c</i> are crossed by a transversal <i>t</i>. (Not drawn to scale.)' + sh.svg; },
        shared: function (r) {
          var th = find(function () { return r.chance(0.5) ? r.int(104, 124) : r.int(56, 76); }, function (x) { return x !== 113; }, 110), d = (r.chance(0.5) ? 1 : -1) * r.int(2, 4), vb = 180 - th + d;   // lower-right at b
          var tau = th * RAD, gap = 2, rows = { a: gap, b: 0, c: -gap };
          var lines = {};
          Object.keys(rows).forEach(function (id) { var y = rows[id], X = [ -y / Math.tan(tau) * -1 * -1, y]; X = [y / Math.tan(tau), y]; var dir = id === 'b' ? (th - 180 + vb) : 0; lines[id] = { p: [X[0] - 2.4 * Math.cos(dir * RAD), y - 2.4 * Math.sin(dir * RAD)], q: [X[0] + 2.4 * Math.cos(dir * RAD), y + 2.4 * Math.sin(dir * RAD)], name: id }; });
          lines.t = { p: [(-gap - 0.9) / Math.tan(tau), -gap - 0.9], q: [(gap + 0.9) / Math.tan(tau), gap + 0.9], name: 't' };
          var F = LF(lines, { scale: 38 });
          var la = F.ang('a', 1, 't', 1), lb = F.ang('b', 1, 't', -1), lc = F.ang('c', 1, 't', 1);
          return { th: th, vb: vb, svg: F.svg({ labels: [{ ang: la, text: th + '°', arc: true }, { ang: lb, text: vb + '°', arc: true }, { ang: lc, text: th + '°', arc: true }], width: 300, aria: 'three lines and a transversal' }) };
        },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) { return TK.angP('Find the angle just <b>above</b> line <i>b</i>, on the same side of <i>t</i> as the ' + D(sh.vb) + ' angle.', 180 - sh.vb, { alts: [[sh.vb, 'The two angles sit side by side on line <i>b</i>: they add to 180°.']], trap: false, sol: t('180^\\circ-' + sh.vb + '^\\circ=' + (180 - sh.vb) + '^\\circ') + ' (straight line with the ' + D(sh.vb) + ' angle)', hints: ['Angles side by side on a straight line add to 180°.'], text: 'above b' }); } },
          { id: '12b', level: 'PRG', make: function (r, sh) {
            var ab = 180 - sh.vb;
            return P.mc(r, 'Which two lines are parallel?', [
              { html: '<i>a</i> and <i>c</i>: the two ' + D(sh.th) + ' angles are corresponding angles, and they are equal.', right: true },
              { html: '<i>a</i> and <i>b</i>: the angles at <i>a</i> and <i>b</i> are close.', why: 'Close isn’t enough. The angle above <i>b</i> is ' + D(ab) + ', not ' + D(sh.th) + '.', code: 'x12-ab' },
              { html: 'All three: they all look parallel.', why: 'The diagram is not drawn to scale. Check the corresponding angles at <i>b</i>.', code: 'x12-all' },
              { html: '<i>b</i> and <i>c</i>: ' + D(sh.vb) + ' and ' + D(sh.th) + ' add to about 180°.', why: 'Those two angles are not a same-side pair. Compare angles in the <b>same position</b> at each line.', code: 'x12-bc' }],
              '<i>a</i> and <i>c</i>: the two ' + D(sh.th) + ' angles are corresponding angles and they are equal, so ' + t('a\\parallel c') + '.<br>At <i>b</i>, the corresponding angle is ' + t('180^\\circ-' + sh.vb + '^\\circ=' + ab + '^\\circ') + ', and ' + D(ab) + ' ≠ ' + D(sh.th) + ', so <i>b</i> is not parallel to <i>a</i> or <i>c</i>.', ['Compare the angles in the same position (corresponding angles) at each line.'], 'which parallel');
          } }] },
      { num: '13', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '. ' + sh.who + ' writes: “' + A(sh.j) + ' = ' + D(sh.v) + ', because ' + A(sh.k) + ' and ' + A(sh.j) + ' are alternate interior angles, and those are equal.”' + givenFig(sh.k, sh.v); },
        shared: function (r) { var pr = TK.poolPick(r, 'int-same'), v = find(function () { return r.chance(0.5) ? r.int(118, 146) : r.int(34, 62); }, function (x) { return x !== 131 && EXV.indexOf(x) < 0; }, 128); return { k: pr[0], j: pr[1], v: v, who: r.pick(['Ella', 'Marcus', 'Jade', 'Theo']) }; },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) {
            var side = TK.LEFT.indexOf(sh.k) >= 0 ? 'left' : 'right';
            return P.mc(r, 'What mistake did ' + sh.who + ' make?', [
              { html: A(sh.k) + ' and ' + A(sh.j) + ' are both on the ' + side + ' of the transversal, so they are <b>interior angles on the same side</b>, not alternate. They add to 180°.', right: true },
              { html: 'No mistake: alternate interior angles are equal.', why: 'Check the name: are the two angles on opposite sides of t?', code: 'x13-none' },
              { html: 'The lines are not parallel, so you can’t use any rule.', why: 'ℓ₁ ∥ ℓ₂ is given (and there are arrow marks).', code: 'x13-par' },
              { html: 'They are corresponding angles, so ' + A(sh.j) + ' = ' + t('180^\\circ-' + sh.v + '^\\circ') + '.', why: 'Corresponding angles have one interior and one exterior angle. Both of these are between the lines.', code: 'x13-corr' }],
              A(sh.k) + ' and ' + A(sh.j) + ' are both between the lines and both on the ' + side + ' of t: <b>interior angles on the same side</b>, not alternate. They add to 180°.', ['Same side of t, or opposite sides?'], 'mistake');
          } },
          { id: '13b', level: 'EMG', make: function (r, sh) { return findPart('Find the correct size of ' + A(sh.j) + '.', sh.k, sh.v, tiltFor(sh.k, sh.v), sh.j, { text: 'correct ∠' }); } }] },
      { num: '14', stem: function (sh) { return 'The white stripes of a crosswalk must be parallel. The road edge is straight. A worker measures where two stripes meet the road edge: ' + D(sh.a) + ' for stripe 1 and ' + D(sh.b) + ' for stripe 2, both on the right side of the stripe, above the edge.' + sh.svg; },
        shared: function (r) {
          var a = find(function () { return r.int(78, 89); }, function (x) { return x !== 84; }, 86), b = find(function () { return a + (r.chance(0.5) ? 1 : -1) * r.int(2, 4); }, function (x) { return x !== a && x <= 89 && x !== 87; }, a - 3);
          var lines = { e: { p: [-0.4, 0], q: [4.8, 0], width: 3.4, name: 'road edge', nameSize: 13 }, s1: { p: [1, 0], q: [1 + 2.3 * Math.cos(a * RAD), 2.3 * Math.sin(a * RAD)], name: 'stripe 1', nameSize: 13 }, s2: { p: [3, 0], q: [3 + 2.3 * Math.cos(b * RAD), 2.3 * Math.sin(b * RAD)], name: 'stripe 2', nameSize: 13 } };
          var F = LF(lines, { scale: 44 });
          return { a: a, b: b, svg: F.svg({ labels: [{ ang: F.ang('e', 1, 's1', 1), text: a + '°', arc: true }, { ang: F.ang('e', 1, 's2', 1), text: b + '°', arc: true }], polys: [{ pts: [[-0.4, -0.3], [4.8, -0.3], [4.8, 0], [-0.4, 0]], fill: '#e7e7e7' }], width: 320, aria: 'crosswalk stripes' }) };
        },
        parts: [
          { id: '14a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Are the stripes parallel?', [
              { html: '<b>No.</b> These are corresponding angles, and ' + D(sh.a) + ' ≠ ' + D(sh.b) + '.', right: true },
              { html: '<b>Yes.</b> The angles are only a few degrees apart.', why: 'For parallel lines, corresponding angles must be <b>exactly</b> equal.', code: 'x14-close' },
              { html: '<b>Yes.</b> Both stripes cross the same road edge.', why: 'Lots of lines can cross the same edge without being parallel.', code: 'x14-same' },
              { html: '<b>No.</b> They should add to 180°.', why: 'These are corresponding angles (same position). Corresponding angles are equal when the lines are parallel.', code: 'x14-180' }],
              'Both angles are on the right side of a stripe, above the edge: corresponding angles. ' + D(sh.a) + ' ≠ ' + D(sh.b) + ', so <b>no</b>, the stripes are not parallel.', ['Same position at each stripe: what kind of pair is that?'], 'stripes');
          } },
          { id: '14b', level: 'PRG', make: function (r, sh) {
            var d = Math.abs(sh.b - sh.a);
            return P.fields('Stripe 1 is correct. What angle should stripe 2 make with the road edge? By how many degrees must it change?', [{ label: 'Stripe 2 should be', after: '°', name: 'stripe 2 angle' }, { label: 'Change by', after: '°', name: 'change' }],
              [G.angleChk(sh.a, { supplementTrap: 'Corresponding angles are <b>equal</b> for parallel lines.', alts: [{ v: sh.b, hint: 'That’s what it is now. It should match stripe 1.' }] }), K.number(d, function (v) { return v === sh.a || v === sh.b ? { code: 'u5l8-turn', hint: 'How far is it from ' + D(sh.b) + ' to ' + D(sh.a) + '?' } : null; })],
              [String(sh.a), String(d)], D(sh.a) + '; change by ' + D(d), 'It should be ' + D(sh.a) + ' (corresponding angles are equal).<br>' + t(Math.max(sh.a, sh.b) + '^\\circ-' + Math.min(sh.a, sh.b) + '^\\circ=' + d + '^\\circ') + ': the angle must get ' + d + '° ' + (sh.b > sh.a ? 'smaller' : 'bigger') + '.', ['Corresponding angles are equal when the lines are parallel.'], 'fix stripe');
          } },
          { id: '14c', level: 'EMG', make: function (r, sh) { return TK.angP('Once stripe 2 is fixed, what angle does it make with the road edge on its <b>left</b> side?', 180 - sh.a, { alts: [[180 - sh.b, 'Use the fixed angle, ' + D(sh.a) + '.']], sol: 'On a straight line: ' + t('180^\\circ-' + sh.a + '^\\circ=' + (180 - sh.a) + '^\\circ'), hints: ['The two angles at the stripe make a straight line along the edge.'], text: 'left side' }); } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var target = r.pick(['int-same', 'ext-same']), tilt = TK.tilt(r, [62, 65, 115]), ids = ['corresponding', 'alt-int', 'alt-ext', target];
          var opts = ids.map(function (id) { var p = TK.poolPick(r, id); return { html: A(p[0]) + ' and ' + A(p[1]), right: id === target, why: id === target ? null : 'Those are ' + PN[id] + ': with parallel lines they are equal.', code: 'x15-' + id, _p: p }; });
          var rp = opts[3]._p;
          return P.mc(r, 'ℓ₁ ∥ ℓ₂. Which pair of angles adds to 180°?' + TK.std({ tilt: tilt, width: 260 }), opts, A(rp[0]) + ' and ' + A(rp[1]) + ' are ' + PN[target] + ': they add to 180°. (The other pairs are equal.)', ['Which pair is one big angle and one small angle?'], 'adds to 180');
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var pr = TK.poolPick(r, r.pick(['int-same', 'ext-same'])), v = find(function () { return r.int(106, 142); }, function (x) { return x !== 124 && EXV.indexOf(x) < 0; }, 128), lab = {}; lab[pr[0]] = v;
          return P.mc(r, 'ℓ₁ ∥ ℓ₂ and ' + A(pr[0]) + ' = ' + D(v) + '. What is the size of ' + A(pr[1]) + '?' + TK.std({ tilt: tiltFor(pr[0], v), angles: lab, width: 260 }), [
            { html: D(v), why: 'Those angles aren’t equal: they are ' + PN[TK.nameOf(pr[0], pr[1])] + '.', code: 'x16-eq' },
            { html: D(180 - v), right: true },
            { html: D(360 - v), why: 'Use 180°, not 360°.', code: 'x16-360' },
            { html: D(v - 90), why: 'Subtract from 180°, not 90°.', code: 'x16-90' }],
            A(pr[0]) + ' and ' + A(pr[1]) + ' are ' + PN[TK.nameOf(pr[0], pr[1])] + ', so they add to 180°: ' + t('180^\\circ-' + v + '^\\circ=' + (180 - v) + '^\\circ'), ['Name the pair first.'], 'size MC');
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'PRG', make: function (r) {
          var big = find(function () { return r.int(98, 118); }, function (x) { return x !== 104; }, 106), sm = 180 - big, kind = r.pick(['corresponding', 'alt-int', 'int-same']);
          var right = kind === 'corresponding' ? (function () { var p = TK.poolPick(r, 'corresponding'); var v = M(r.pick([big, sm]), p[0]); return [p, v, v]; })() : kind === 'alt-int' ? (function () { var p = TK.poolPick(r, 'alt-int'), v = r.pick([big, sm]); return [p, v, v]; })() : (function () { var p = TK.poolPick(r, 'int-same'); return [p, big, sm]; })();
          var vo = TK.poolPick(r, 'vert-opp'), is = TK.poolPick(r, 'int-same'), is2 = TK.poolPick(r, 'ext-same'), cr = TK.poolPick(r, 'alt-ext');
          var m = function (p, a, b) { return A(p[0]) + ' = ' + D(a) + ' and ' + A(p[1]) + ' = ' + D(b); };
          var opts = [{ html: m(right[0], right[1], right[2]), right: true }, { html: m(vo, big, big), why: 'Vertically opposite angles are <b>always</b> equal, so they prove nothing about the lines.', code: 'x17-vo' }];
          if (kind !== 'int-same') opts.push({ html: m(is, big, big), why: 'Interior angles on the same side must <b>add to 180°</b> for parallel lines: ' + t(big + '+' + big + '=' + 2 * big) + '.', code: 'x17-is' });
          else opts.push({ html: m(cr, big, sm), why: 'Alternate exterior angles must be <b>equal</b> for parallel lines.', code: 'x17-ae' });
          opts.push({ html: m(is2, sm, sm), why: 'Exterior angles on the same side must <b>add to 180°</b>: ' + t(sm + '+' + sm + '=' + 2 * sm) + '.', code: 'x17-es' });
          return P.mc(r, 'Two lines are cut by a transversal (angles numbered the usual way). Which measurements show that the lines <b>are</b> parallel?', opts,
            A(right[0][0]) + ' and ' + A(right[0][1]) + ' are ' + PN[kind] + (kind === 'int-same' ? ' and ' + t(big + '^\\circ+' + sm + '^\\circ=180^\\circ') : ', and they are equal') + ', so the lines are parallel.', ['Vertically opposite angles are always equal, so they can’t prove anything. Check each rule.'], 'proves parallel');
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var L0 = find(function () { return r.int(36, 61); }, function (x) { return x !== 44 && x !== 48; }, 40), R0 = find(function () { return r.int(52, 76); }, function (x) { return x !== 69 && x !== 57 && x !== L0 && 180 - L0 - x !== L0 && 180 - L0 - x !== x; }, 60), c = 180 - L0 - R0;
          return TK.angP('<b>Numerical response.</b> ℓ₁ ∥ ℓ₂. Two ramps meet at <i>A</i> on ℓ₁ and make a triangle with ℓ₂. The angles at <i>A</i> outside the triangle are ' + D(L0) + ' and ' + D(R0) + '. The size of the angle <i>c</i> inside the triangle at <i>A</i> is ____°.' + veeFig(L0, R0, [L0 + '°', R0 + '°', 'c'], false), c, { nr: true, trap: false,
            alts: [[180 - L0, 'Three angles make the straight line at <i>A</i>. Subtract <b>both</b> outside angles.'], [180 - R0, 'Three angles make the straight line at <i>A</i>. Subtract <b>both</b> outside angles.'], [L0 + R0, 'That’s the two outside angles together. <i>c</i> is what is left of the 180°.']],
            sol: 'The three angles at <i>A</i> make a straight line:<br>' + t('c=180^\\circ-' + L0 + '^\\circ-' + R0 + '^\\circ=' + c + '^\\circ'), hints: ['The three angles at A sit along the straight line ℓ₁.'], text: 'NR vee' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '. Find each angle. (Think of the reason for each one.)' + givenFig(sh.k, sh.v); },
        shared: function (r) {
          var k = r.pick([5, 6, 3, 4]), v = find(function () { return r.chance(0.5) ? r.int(34, 60) : r.int(120, 146); }, function (x) { return x !== 46 && EXV.indexOf(x) < 0; }, 52);
          var rel = function (id) { return PAIRS[id].map(function (p) { return p[0] === k ? p[1] : p[1] === k ? p[0] : null; }).filter(function (x) { return x; })[0]; };
          var lin = PAIRS.linear.filter(function (p) { return p[0] === k || p[1] === k; }).map(function (p) { return p[0] === k ? p[1] : p[0]; }).filter(function (x) { return TK.INT.indexOf(x) >= 0 || TK.EXT.indexOf(x) >= 0; })[0];
          return { k: k, v: v, js: [rel('corresponding'), rel('alt-int'), rel('vert-opp'), lin, rel('int-same')] };
        },
        parts: [0, 1, 2, 3, 4].map(function (i) { return { id: 'x1' + 'abcde'.charAt(i), level: ['BEG', 'EMG', 'BEG', 'BEG', 'EMG'][i], make: function (r, sh) { return findPart('Find ' + A(sh.js[i]) + '.', sh.k, sh.v, tiltFor(sh.k, sh.v), sh.js[i]); } }; }) },
      { num: '2', stem: function (sh) { return 'ℓ₁ ∥ ℓ₂ and ' + A(sh.k) + ' = ' + D(sh.v) + '. Write the size of every other angle.' + givenFig(sh.k, sh.v); },
        shared: function (r) { return { k: r.int(1, 8), v: find(function () { return r.chance(0.5) ? r.int(52, 76) : r.int(104, 128); }, function (x) { return x !== 64 && EXV.indexOf(x) < 0; }, 68) }; },
        parts: [{ id: 'x2', level: 'PRG', make: function (r, sh) { return fillAll('Find each angle.', sh.k, sh.v, tiltFor(sh.k, sh.v)); } }] },
      { num: '3', stem: 'ℓ₁ ∥ ℓ₂. Name the pair of angles, and solve for <i>x</i>.', parts: [
        { id: 'x3a', level: 'EMG', make: function (r) { return xPart(r, 'alt-int', [[3, 5]], { avoidV: EXV.concat([101, 79]) }); } },
        { id: 'x3b', level: 'PRG', make: function (r) { return xPart(r, 'ext-same', [[2, 7]], { avoidV: EXV.concat([77, 103]) }); } }] },
      { num: '4', stem: 'True or false?', parts: [
        { id: 'x4a', level: 'BEG', make: function (r) { var s = r.pick([['When two lines are parallel, alternate exterior angles are equal.', true], ['When two lines are parallel, corresponding angles are equal.', true], ['When two lines are parallel, alternate interior angles are equal.', true]]); return TK.tf(r, s[0], s[1], 'It is true: that pair is equal when the lines are parallel.', 'True.'); } },
        { id: 'x4b', level: 'BEG', make: function (r) { var s = r.pick(['interior angles on the same side of the transversal are equal.', 'exterior angles on the same side of the transversal are equal.']); return TK.tf(r, 'When two lines are parallel, ' + s, false, 'Same-side pairs are one big and one small angle: they <b>add to 180°</b>.', 'False. They add to 180° (supplementary).'); } },
        { id: 'x4c', level: 'BEG', make: function (r) { var s = r.pick([['Vertically opposite angles are equal only when the lines are parallel.', 'Vertically opposite angles are <b>always</b> equal.'], ['Angles side by side on a straight line add to 180° only when the lines are parallel.', 'Angles on a straight line <b>always</b> add to 180°.']]); return TK.tf(r, s[0], false, s[1], 'False. ' + s[1]); } },
        { id: 'x4d', level: 'BEG', make: function (r) { return TK.tf(r, r.pick(['If a transversal is perpendicular to one of two parallel lines, it is perpendicular to the other one too.', 'If a transversal makes a 90° angle with one of two parallel lines, it makes a 90° angle with the other one too.']), true, 'It is true: the corresponding angles are equal, so both are 90°.', 'True: corresponding angles are equal, so both are 90°.'); } }] },
      { num: '5', stem: 'Are ℓ₁ and ℓ₂ parallel? Choose the answer with the rule you used. (Not drawn to scale.)', shared: function (r) { var a = r.chance(0.5); return { ps: [a, r.chance(0.7) ? !a : a] }; }, parts: [
        { id: 'x5a', level: 'EMG', make: function (r, sh) { return parTest(r, 'corresponding', { par: sh.ps[0], prompt: '(a) Are ℓ₁ and ℓ₂ parallel?' }); } },
        { id: 'x5b', level: 'EMG', make: function (r, sh) { return parTest(r, 'alt-int', { par: sh.ps[1], prompt: '(b) Are ℓ₁ and ℓ₂ parallel?' }); } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [
        { id: 'x6', level: 'EMG', make: function (r) {
          var v = find(function () { return r.int(100, 122); }, function (x) { return x !== 109; }, 112), h = 1.3, s = h / Math.tan((180 - v) * RAD), pts = [[s, 0], [3 - s, 0], [3, h], [0, h]], lt = r.pick([['m', 'n'], ['p', 'q'], ['a', 'b']]);
          var fig = polyFig(pts, [{ text: v + '°', arc: true }, { text: v + '°', arc: true }, lt[1], lt[0]], { marks: [0, 2], width: 260, aria: 'trough end' });
          return P.fields('The end of a cattle water trough is a trapezoid. The top edge is parallel to the bottom. Each angle at the bottom, inside the trough, is ' + D(v) + '. Find the angles <i>' + lt[0] + '</i> and <i>' + lt[1] + '</i> at the top.' + fig,
            lt.map(function (x) { return { label: t(x + '='), after: '°', name: x }; }), [0, 1].map(function () { return G.angleChk(180 - v, { supplementTrap: 'Each slanted side is a transversal: the top and bottom angles on that side are interior angles on the same side, so they <b>add to 180°</b>.' }); }),
            [String(180 - v), String(180 - v)], t(lt[0] + '=' + lt[1] + '=' + (180 - v) + '^\\circ'), 'Each slanted side is a transversal of the parallel top and bottom, so the top and bottom angles on that side are interior angles on the same side.<br>' + t(lt[0] + '=180^\\circ-' + v + '^\\circ=' + (180 - v) + '^\\circ') + ' \\(\\quad\\) ' + t(lt[1] + '=180^\\circ-' + v + '^\\circ=' + (180 - v) + '^\\circ'), ['Each slanted side is a transversal of the two parallel edges.'], 'trough');
        } }] },
      { num: '7', stem: function (sh) { return 'A highway crosses two parallel railway tracks. The acute angle between the highway and track 1 is ' + D(sh.v) + '. Find the angles 5, 6, 7 and 8 at track 2.' + TK.std({ tilt: sh.v, angles: { 2: sh.v }, names: { top: 'track 1', bottom: 'track 2', t: 'highway' }, width: 360 }); },
        shared: function (r) { return { v: find(function () { return r.int(34, 56); }, function (x) { return x !== 43 && EXV.indexOf(x) < 0; }, 47) }; },
        parts: [{ id: 'x7', level: 'EMG', make: function (r, sh) {
          var ks = [5, 6, 7, 8];
          return P.fields('Find each angle.', ks.map(function (x) { return { label: t('\\angle ' + x + '='), after: '°', name: '∠' + x }; }), ks.map(function (x) { return G.angleChk(M(sh.v, x), { supplementTrap: 'Compare ' + A(x) + ' with the ' + D(sh.v) + ' angle (' + A(2) + '): is it the small size or the big size?' }); }),
            ks.map(function (x) { return String(M(sh.v, x)); }), ks.map(function (x) { return A(x) + ' = ' + D(M(sh.v, x)); }).join(', '),
            t('\\angle 6=' + sh.v + '^\\circ') + ' (corresponding to ' + A(2) + ')<br>' + t('\\angle 5=180^\\circ-' + sh.v + '^\\circ=' + (180 - sh.v) + '^\\circ') + ' (on a straight line with ' + A(6) + ')<br>' + t('\\angle 7=' + (180 - sh.v) + '^\\circ') + ' and ' + t('\\angle 8=' + sh.v + '^\\circ') + ' (vertically opposite)', ['' + A(6) + ' is in the same position as the ' + D(sh.v) + ' angle.'], 'highway');
        } }] },
      { num: '8', stem: function (sh) { return 'A farm gate has a top rail and a bottom rail that are parallel. The two end posts are perpendicular to the rails. A diagonal brace makes a ' + D(sh.th) + ' angle with the bottom rail.' + sh.svg; },
        shared: function (r) {
          var th = find(function () { return r.int(26, 44); }, function (x) { return x !== 33 && x !== 36; }, 30), H = 1.8, W = H / Math.tan(th * RAD), mir = r.chance(0.4), lt = r.pick([['u', 'v'], ['m', 'n'], ['x', 'y']]);
          var lines = { bot: { p: [0, 0], q: [W, 0], width: 3 }, top: { p: [0, H], q: [W, H], width: 3 }, pl: { p: [0, 0], q: [0, H], width: 3 }, pr: { p: [W, 0], q: [W, H], width: 3 }, br: { p: [0, 0], q: [W, H] } };
          if (mir) lines = TK.turn(lines, 0, true);
          var F = LF(lines, { scale: 46 }), sx = 1;
          return { th: th, lt: lt, svg: F.svg({ labels: [{ ang: F.ang('bot', 1, 'br', 1), text: th + '°', arc: true }, { ang: F.ang('top', -1, 'br', -1), text: lt[0] }, { ang: F.ang('pr', -1, 'br', -1), text: lt[1] }], rights: [F.ang('bot', -1, 'pr', 1)], width: 300, aria: 'gate with a brace' }) };
        },
        parts: [
          { id: 'x8a', level: 'EMG', make: function (r, sh) { return TK.angP('Find <i>' + sh.lt[0] + '</i>, the angle between the brace and the top rail.', sh.th, { trap: false, alts: [[180 - sh.th, '<i>' + sh.lt[0] + '</i> and the ' + D(sh.th) + ' angle make a Z (alternate interior angles), so they are equal.'], [90 - sh.th, 'That’s the angle between the brace and the post.']], sol: t(sh.lt[0] + '=' + sh.th + '^\\circ') + '. The rails are parallel and the brace is a transversal, so <i>' + sh.lt[0] + '</i> and ' + D(sh.th) + ' are alternate interior angles.', hints: ['Look for a Z shape.'], text: 'gate u' }); } },
          { id: 'x8b', level: 'PRG', make: function (r, sh) { return TK.angP('Find <i>' + sh.lt[1] + '</i>, the angle between the brace and the post.', 90 - sh.th, { trap: false, alts: [[180 - sh.th, 'The post and the top rail make a 90° corner: ' + t(sh.lt[0] + '+' + sh.lt[1] + '=90^\\circ') + '.'], [sh.th, 'That’s <i>' + sh.lt[0] + '</i>. Together they make 90°.']], sol: 'The post is perpendicular to the top rail, so ' + t(sh.lt[0] + '+' + sh.lt[1] + '=90^\\circ') + '.<br>' + t(sh.lt[1] + '=90^\\circ-' + sh.th + '^\\circ=' + (90 - sh.th) + '^\\circ'), hints: ['<i>' + sh.lt[0] + '</i> and <i>' + sh.lt[1] + '</i> fill the square corner.'], text: 'gate v' }); } }] },
      { num: '9', stem: function (sh) { return sh.who + ' put up two shelves, ℓ₁ and ℓ₂, along a slanted bracket <i>t</i>. He measures ' + A(sh.k) + ' = ' + D(sh.a) + ' and ' + A(sh.j) + ' = ' + D(sh.b) + '. He says, “Those are close, so my shelves are parallel.”' + sh.fig; },
        shared: function (r) {
          var pr = TK.poolPick(r, 'corresponding'), k = Math.min(pr[0], pr[1]), j = Math.max(pr[0], pr[1]), a = find(function () { return r.int(92, 99); }, function (x) { return x !== 96; }, 97), b = a + (r.chance(0.5) ? -1 : 1) * r.int(1, 3), lab = {}; lab[k] = a; lab[j] = b;
          return { k: k, j: j, a: a, b: b, who: r.pick(['Sam', 'Raj', 'Ben', 'Eli']), fig: TK.std({ tilt: 85, angles: lab, numbers: false, marks: 0, width: 260 }) };
        },
        parts: [
          { id: 'x9a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Is ' + sh.who + ' right?', [
              { html: '<b>No.</b> ' + A(sh.k) + ' and ' + A(sh.j) + ' are corresponding angles. For parallel shelves they must be <b>exactly</b> equal, and ' + D(sh.a) + ' ≠ ' + D(sh.b) + '.', right: true },
              { html: '<b>Yes.</b> A difference of ' + Math.abs(sh.a - sh.b) + '° is too small to matter.', why: 'Even 1° means the shelves will slowly get closer (or further apart).', code: 'x9-close' },
              { html: '<b>No.</b> Corresponding angles should add to 180°.', why: 'Corresponding angles are <b>equal</b> for parallel lines.', code: 'x9-180' },
              { html: '<b>Yes.</b> Both angles are obtuse.', why: 'Both being obtuse isn’t enough: they must be equal.', code: 'x9-obtuse' }],
              A(sh.k) + ' and ' + A(sh.j) + ' are corresponding angles. For parallel shelves they must be exactly equal, and ' + D(sh.a) + ' ≠ ' + D(sh.b) + '. No.', ['Name the pair, then use its rule exactly.'], 'Sam');
          } },
          { id: 'x9b', level: 'PRG', make: function (r, sh) {
            var d = Math.abs(sh.a - sh.b);
            return P.fields(sh.who + ' keeps ℓ₁ where it is. What should ' + A(sh.j) + ' be? By how many degrees must he turn ℓ₂?', [{ label: t('\\angle ' + sh.j + '='), after: '°', name: '∠' + sh.j }, { label: 'Turn by', after: '°', name: 'turn' }],
              [G.angleChk(sh.a, { supplementTrap: 'Corresponding angles are <b>equal</b> for parallel lines.', alts: [{ v: sh.b, hint: 'That’s what it is now. It should match ' + A(sh.k) + '.' }] }), K.number(d, function (v) { return v === sh.a || v === sh.b ? { code: 'u5l8-turn', hint: 'How far is it from ' + D(sh.b) + ' to ' + D(sh.a) + '?' } : null; })],
              [String(sh.a), String(d)], D(sh.a) + '; turn by ' + D(d), A(sh.j) + ' should be ' + D(sh.a) + ' (equal corresponding angles).<br>' + t(Math.max(sh.a, sh.b) + '^\\circ-' + Math.min(sh.a, sh.b) + '^\\circ=' + d + '^\\circ'), ['ℓ₁ stays put, so ' + A(sh.k) + ' stays ' + D(sh.a) + '.'], 'Sam fix');
          } }] },
      { num: '10', stem: '', parts: [
        { id: 'x10', level: 'BEG', make: function (r) {
          var k = r.pick([3, 4, 5, 6]), rel = function (id) { return PAIRS[id].map(function (p) { return p[0] === k ? p[1] : p[1] === k ? p[0] : null; }).filter(function (x) { return x; })[0]; };
          var ai = rel('alt-int'), is = rel('int-same'), lin = PAIRS.linear.filter(function (p) { return p[0] === k || p[1] === k; }).map(function (p) { return p[0] === k ? p[1] : p[0]; })[0], none = TK.NONE.filter(function (p) { return p[0] === k || p[1] === k; }).map(function (p) { return p[0] === k ? p[1] : p[0]; })[0];
          return P.mc(r, 'ℓ₁ ∥ ℓ₂. Which angle is <b>always</b> equal to ' + A(k) + '?' + TK.std({ tilt: TK.tilt(r, [62, 65]), width: 260 }), [
            { html: A(ai), right: true }, { html: A(is), why: A(k) + ' and ' + A(is) + ' are interior angles on the same side: they add to 180°.', code: 'x10-is' },
            { html: A(lin), why: A(lin) + ' is on a straight line with ' + A(k) + ': they add to 180°.', code: 'x10-lin' }, { html: A(none), why: A(none) + ' is the other size of angle.', code: 'x10-none' }],
            A(k) + ' and ' + A(ai) + ' are alternate interior angles, so they are equal.', ['Look for a Z.'], 'always equal');
        } }] },
      { num: '11', stem: '', parts: [
        { id: 'x11', level: 'EMG', make: function (r) {
          var L0 = find(function () { return r.int(34, 58); }, function (x) { return x !== 41 && x !== 44 && x !== 48; }, 38), R0 = find(function () { return r.int(54, 74); }, function (x) { return x !== 63 && x !== 69 && x !== 57 && 180 - L0 - x !== L0 && 180 - L0 - x !== x; }, 66), w = 180 - L0 - R0;
          return TK.angP('<b>Numerical response.</b> ℓ₁ ∥ ℓ₂. Two straight fences start at point <i>A</i> on ℓ₂ and make a triangle with ℓ₁. The angles at <i>A</i> outside the triangle are ' + D(L0) + ' and ' + D(R0) + '. The size of angle <i>w</i>, inside the triangle at <i>A</i>, is ____°.' + veeFig(L0, R0, [L0 + '°', R0 + '°', 'w'], true), w, { nr: true, trap: false,
            alts: [[180 - L0, 'Subtract <b>both</b> outside angles from 180°.'], [180 - R0, 'Subtract <b>both</b> outside angles from 180°.'], [L0 + R0, '<i>w</i> is what is left of the straight line at <i>A</i>.']],
            sol: 'The three angles at <i>A</i> make a straight line:<br>' + t('w=180^\\circ-' + L0 + '^\\circ-' + R0 + '^\\circ=' + w + '^\\circ'), hints: ['The three angles at A sit along a straight line.'], text: 'NR fences' });
        } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [
        { id: 'x12', level: 'MAS', make: function (r) {
          var al = find(function () { return r.int(26, 48); }, function (x) { return x !== 34; }, 30), be = find(function () { return r.int(36, 60); }, function (x) { return x !== 51 && Math.abs(x - al) > 4; }, 50), y = al + be;
          var Ap = [0, 2], Pp = [1 / Math.tan(al * RAD), 1], Bp = [Pp[0] - 1 / Math.tan(be * RAD), 0];
          var xl = Math.min(0, Bp[0]) - 1, xr = Pp[0] + 1.6;
          var lines = { l1: { p: [xl, 2], q: [xr, 2], name: 'ℓ₁', marks: 1, markAt: 0.1 }, l2: { p: [xl, 0], q: [xr, 0], name: 'ℓ₂', marks: 1, markAt: 0.1 }, ap: { p: Ap, q: Pp }, pb: { p: Pp, q: Bp } };
          var F = LF(lines, { scale: 50 });
          var svg = F.svg({ labels: [{ ang: F.ang('l1', 1, 'ap', 1), text: al + '°', arc: true }, { ang: F.ang('l2', 1, 'pb', -1), text: be + '°', arc: true }, { ang: F.ang('ap', -1, 'pb', 1), text: 'y', min: 18 }], dots: [Pp], texts: [{ at: [Pp[0] + 0.28, Pp[1]], s: 'P', weight: 700, color: '#1d2633', size: 14 }], width: 300, aria: 'a path bending between parallel lines' });
          return TK.angP('ℓ₁ ∥ ℓ₂. A path bends at point <i>P</i> between the lines. Find the size of the bend, angle <i>y</i>. (Hint: draw a line through <i>P</i> parallel to ℓ₁. It splits <i>y</i> into two parts.)' + svg, y, { trap: false,
            alts: [[180 - y, 'That’s the angle on the other side of the bend. Split <i>y</i> with a line through <i>P</i> parallel to ℓ₁.'], [Math.abs(be - al), 'Both parts are <b>added</b>: the line through P splits y into a ' + D(al) + ' part and a ' + D(be) + ' part.'], [360 - y, 'Split <i>y</i> into two parts with a line through P parallel to ℓ₁ (alternate interior angles).']],
            sol: 'Draw a line through <i>P</i> parallel to ℓ₁ and ℓ₂. It splits <i>y</i> into two parts.<br>Top part: ' + D(al) + ' (alternate interior with the ' + D(al) + ' angle).<br>Bottom part: ' + D(be) + ' (alternate interior with the ' + D(be) + ' angle).<br>' + t('y=' + al + '^\\circ+' + be + '^\\circ=' + y + '^\\circ'), hints: ['Draw the line through P parallel to ℓ₁. Look for two Z shapes.'], text: 'bend' });
        } }] },
      { num: '13', stem: function (sh) { return 'A sign is cut in the shape of quadrilateral <i>ABCD</i>. Its angles are ∠<i>A</i> = ' + D(sh.a) + ', ∠<i>B</i> = ' + D(sh.b) + ', ∠<i>C</i> = ' + D(sh.c) + ' and ∠<i>D</i> = ' + D(sh.d) + '.' + sh.svg; },
        shared: function (r) {
          var a = find(function () { return r.int(60, 80); }, function (x) { return x !== 69; }, 66), b = 180 - a, c = a + r.pick([-5, -4, -3, 3, 4, 5]), d = 180 - c, h = 1.6;
          var Ap = [0, 0], Dp = [4, 0], Bp = [h / Math.tan(a * RAD), h], Cp = [4 - h / Math.tan(d * RAD), h];
          var pts = [Ap, Bp, Cp, Dp];
          var fig = polyFig(pts, [{ text: a + '°' }, { text: b + '°' }, { text: c + '°' }, { text: d + '°' }], { width: 300, fill: '#fdf6dc', aria: 'quadrilateral ABCD', texts: [{ at: [-0.25, -0.2], s: 'A', weight: 700, color: '#1d2633', size: 14 }, { at: [Bp[0] - 0.25, h + 0.2], s: 'B', weight: 700, color: '#1d2633', size: 14 }, { at: [Cp[0] + 0.25, h + 0.2], s: 'C', weight: 700, color: '#1d2633', size: 14 }, { at: [4.25, -0.2], s: 'D', weight: 700, color: '#1d2633', size: 14 }] });
          return { a: a, b: b, c: c, d: d, svg: fig };
        },
        parts: [
          { id: 'x13a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Which two sides are parallel?', [
              { html: t('BC\\parallel AD') + ': ' + t('\\angle A+\\angle B=' + sh.a + '^\\circ+' + sh.b + '^\\circ=180^\\circ') + ', and with side AB as the transversal these are interior angles on the same side.', right: true },
              { html: t('AB\\parallel DC') + ': ' + t('\\angle B+\\angle C') + ' is close to 180°.', why: t(sh.b + '+' + sh.c + '=' + (sh.b + sh.c)) + ', not exactly 180°.', code: 'x13-abdc' },
              { html: t('AB\\parallel BC') + ': they meet at B.', why: 'Sides that meet can’t be parallel.', code: 'x13-meet' },
              { html: 'No sides are parallel.', why: 'Check ' + t('\\angle A+\\angle B') + '.', code: 'x13-none' }],
              t('\\angle A+\\angle B=' + sh.a + '^\\circ+' + sh.b + '^\\circ=180^\\circ') + '. With side AB as the transversal, these are interior angles on the same side, so ' + t('BC\\parallel AD') + '.', ['Look for two angles next to each other (sharing a side) that add to 180°.'], 'which sides');
          } },
          { id: 'x13b', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Is <i>ABCD</i> a parallelogram?', [
              { html: '<b>No.</b> ' + t('\\angle B+\\angle C=' + (sh.b + sh.c) + '^\\circ') + ', not 180°, so AB is not parallel to DC. Only one pair of sides is parallel (a trapezoid).', right: true },
              { html: '<b>Yes.</b> It has a pair of parallel sides.', why: 'A parallelogram needs <b>both</b> pairs of opposite sides parallel.', code: 'x13-one' },
              { html: '<b>Yes.</b> Its angles add to 360°.', why: 'Every quadrilateral’s angles add to 360°.', code: 'x13-360' },
              { html: '<b>No.</b> None of its sides are parallel.', why: 'BC ∥ AD (from part a).', code: 'x13-no' }],
              t('\\angle B+\\angle C=' + sh.b + '^\\circ+' + sh.c + '^\\circ=' + (sh.b + sh.c) + '^\\circ') + ', not 180°, so AB is not parallel to DC.<br>Only one pair of sides is parallel, so it is a trapezoid, not a parallelogram.', ['Check the other pair of opposite sides.'], 'parallelogram?');
          } }] },
      { num: '14', stem: '', parts: [
        { id: 'x14', level: 'MAS', make: function (r) {
          var ph = find(function () { return r.int(16, 34); }, function (x) { return x !== 22 && x !== 29; }, 24), z = 90 - ph, H = 2.8, Qx = H * Math.tan(ph * RAD), mir = r.chance(0.4);
          var lines = { l1: { p: [-1.6, H], q: [Qx + 1.5, H], name: 'ℓ₁', marks: 1, markAt: 0.1 }, l2: { p: [-1.6, 0], q: [Qx + 1.5, 0], name: 'ℓ₂', marks: 1, markAt: 0.1 }, t: { p: [0, -0.6], q: [0, H + 0.7], name: 't' },
            s: { p: [-0.6 * Math.tan(ph * RAD), H + 0.6], q: [Qx + 0.6 * Math.tan(ph * RAD), -0.6], name: 's', nameAt: 'q' } };
          if (mir) lines = TK.turn(lines, 0, true);
          var F = LF(lines, { scale: 50 }), sx = 1;
          var svg = F.svg({ labels: [{ ang: F.ang('t', -1, 's', 1), text: ph + '°', arc: true, min: 30 }, { ang: F.ang('l2', -sx, 's', -1), text: 'z' }], rights: [F.ang('t', 1, 'l1', -sx)], dots: [[0, H]], texts: [{ at: [mir ? 0.25 : -0.25, H - 0.22], s: 'P', weight: 700, color: '#1d2633', size: 14 }], width: 300, aria: 'parallel lines, a perpendicular and a slanted line' });
          return TK.angP('ℓ₁ ∥ ℓ₂ and ' + t('t\\perp \\ell_1') + '. Line <i>s</i> goes through point <i>P</i> on ℓ₁. The angle between <i>s</i> and <i>t</i> is ' + D(ph) + '. Find <i>z</i>, the acute angle between <i>s</i> and ℓ₂.' + svg, z, { trap: false,
            alts: [[ph, 'That’s the angle between <i>s</i> and <i>t</i>. First find the angle between <i>s</i> and ℓ₁ (they make a right angle with <i>t</i>).'], [180 - z, '<i>z</i> is the <b>acute</b> angle.'], [90 + ph, 'Subtract: the angle between s and ℓ₁ and the ' + D(ph) + ' angle make 90° together.']],
            sol: 'At <i>P</i>, <i>t</i> makes 90° with ℓ₁. So the angle between <i>s</i> and ℓ₁ (below ℓ₁) is ' + t('90^\\circ-' + ph + '^\\circ=' + z + '^\\circ') + ' (complementary).<br>That angle and <i>z</i> are alternate interior angles (<i>s</i> is a transversal of the parallel lines), so ' + t('z=' + z + '^\\circ') + '.', hints: ['Start at P: the right angle between t and ℓ₁ is split into two parts.'], text: 'perp z' });
        } }] }
    ]
  });
})(window);
