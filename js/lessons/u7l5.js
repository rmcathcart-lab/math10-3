/* Math 10-3 · Unit 7 · Lesson 5 — The Sine Ratio (G4; finding the hypotenuse, the unknown on the bottom: A1)
 * Assignment 5 (u7_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u7_ep05.tex, A 1–4, B 5–10, C 11–13).
 * Every part is a generator: the booklet item's situation and difficulty with new numbers around the booklet's (the
 * lesson's worked-example numbers are left out: the 5-12-13, 6.3-8.4-10.5 and 7-24-25 triangles, the 40° table, 34°/12 cm,
 * 61°/8.5 m, the 75° ladder, 27°/4.5 cm, 52°/15 ft, the 4.8° ramp, the 62° boom lift and the 7°/18 m zipline).
 * Calculator allowed, in DEG mode. Lengths to the nearest tenth, sine values to 4 decimal places.
 * Checks: HW.geo.lenChk (RAD mode, × instead of ÷ and back, the wrong ratio, the sine rounded too early → a nudge) and
 * local checkers for sin θ as a fraction (adj/hyp, opp/adj, hyp/opp each get a hint), two-step heights (forgot the pivot
 * height, subtracted it, rounded the first step), the ladder difference (sin of the difference, one height only, the
 * foot's move, cm) and "round up" for the shortest ladder.
 * Conversions: "label opp, adj, hyp" → a table of choices (one row per side, the vertices named); "write sin θ as a
 * fraction, then a decimal" → a fraction box + a decimal box; the skatepark table → the table in the prompt and one box
 * per blank cell; "what do you notice / why does it make sense / explain" → multiple choice of reasons; true or false →
 * true/false buttons; "finish the sentence (top/bottom, multiply/divide)" → multiple choice of the four sentences;
 * "sketch a right triangle" → the sketch is in the worked solution; "list in order" → the ordering widget; "will it
 * reach?" → multiple choice of yes/no with the evidence.
 * Exports HW.u7trig, the sine/cosine kit used by js/lessons/u7l6.js (figures, labelling table, fraction + decimal,
 * side with the unknown on top or on the bottom, calculator values, two-step checks). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.rightTriSVG || !G.lenChk) throw new Error('js/lessons/u7l5.js needs HW.geo from js/geokit.js: load it first');
  var RAD = Math.PI / 180;
  var TR = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var TRR = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  var TOP = { sin: 'opp', cos: 'adj', tan: 'opp' }, BOT = { sin: 'hyp', cos: 'hyp', tan: 'adj' }, MN = { sin: 'SOH', cos: 'CAH', tan: 'TOA' };
  var NAME = { sin: 'sine', cos: 'cosine', tan: 'tangent' }, OTHER = { sin: 'cos', cos: 'sin' };
  var ROLE_WORD = { opp: 'opposite side', adj: 'adjacent side', hyp: 'hypotenuse' };

  /* ================= small helpers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function N(x) { x = q(x); return Math.abs(x) >= 1000 ? HW.fmt(x, true) : String(x); }          // plain text: 1 450
  function NT(x) { x = q(x); return Math.abs(x) >= 1000 ? HW.fmt(x) : String(x); }              // TeX: 1\,450
  function f1(x) { return rd(x, 1).toFixed(1); }
  function f2(x) { return rd(x, 2).toFixed(2); }
  function f4(x) { return rd(x, 4).toFixed(4); }
  function fd(x, dp) { return rd(x, dp).toFixed(dp); }
  function dots(x, d) { d = d == null ? 3 : d; var p = Math.pow(10, d), tr = Math.floor(Math.abs(x) * p + 1e-9) / p * (x < 0 ? -1 : 1); return same(tr, x) ? fd(x, d) : tr.toFixed(d) + '\\ldots'; }
  function deg(d) { return NT(d) + '^\\circ'; }
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function find(gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function clean(v, dp) { dp = dp == null ? 1 : dp; var s = v * Math.pow(10, dp), fr = s - Math.floor(s); return Math.abs(fr - 0.5) > 0.06 && fr > 0.02 && fr < 0.98; }
  function oneDec(r, lo, hi) { return r.int(Math.round(lo * 10), Math.round(hi * 10)) / 10; }
  function half(r, lo, hi) { return r.int(Math.round(lo * 2), Math.round(hi * 2)) / 2; }
  function excluded(list, th, side) { return list.some(function (e) { return same(e[0], th) && (e[1] == null || same(e[1], side)); }); }
  function fn$(fn, d) { return '\\' + fn + ' ' + deg(d); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function readPlain(resp) { return String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/^\s*[A-Za-z]{1,3}\s*(?:=|≈)\s*/, '').replace(/\s*(?:m|cm|km|ft|in)\.?\s*$/i, '').trim(); }
  function decsOf(s) { return (String(s).replace(/,/g, '').split('.')[1] || '').length; }
  /* string values a checker must NOT accept (for tests/gen_test.js), dropping any that round to the key */
  function badList(key, vals, dp) { var seen = {}; return vals.filter(function (v) { return isFinite(v) && v > 0; }).map(function (v) { return fd(v, dp == null ? 1 : dp); }).filter(function (s) { if (s === key || seen[s]) return false; seen[s] = 1; return true; }); }
  var TD = 'border:1px solid #c9b79c;padding:4px 12px;text-align:center';
  function table(head, rows) {
    return '<table style="border-collapse:collapse;margin:6px 0"><tr>' + head.map(function (h) { return '<th style="' + TD + ';background:#f6f1e6">' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  HW.addCodes({
    'u7l5-label-hyp': 'Labelling: missed the hypotenuse (across from the right angle)', 'u7l5-label-swap': 'Labelling: swapped opp and adj', 'u7l5-label': 'Labelling: a side named wrongly',
    'u7l5-frac-adj': 'Used adj ÷ hyp (cosine) for sine', 'u7l5-frac-tan': 'Used opp ÷ adj (tangent)', 'u7l5-frac-upside': 'Ratio upside down (hyp on top)', 'u7l5-frac-other': 'Used the wrong pair of sides',
    'u7l5-frac-decimal': 'Gave a decimal where a fraction was asked', 'u7l5-dec-cos': 'Gave the cosine instead of the sine', 'u7l5-dec-upside': 'Divided hyp ÷ opp', 'u7l5-dec-tan': 'Divided opp ÷ adj (tangent)',
    'u7l5-no-pivot': 'Forgot to add the starting height', 'u7l5-sub-pivot': 'Subtracted the starting height instead of adding', 'u7l5-step-round': 'Rounded the first step too early',
    'u7l5-no-subtract': 'Used one platform height instead of the drop', 'u7l5-added-heights': 'Added the platform heights instead of subtracting', 'u7l5-diff-angle': 'Took the sine of the difference of the angles',
    'u7l5-one-height': 'Gave one height, not the difference', 'u7l5-foot': 'Found how far the foot moved (cosine), not the height', 'u7l5-neg': 'Subtracted the wrong way (negative)', 'u7l5-cm': 'Answer in cm, the box is in m',
    'u7l5-round-down': 'Rounded down where the answer must be rounded up', 'u7l5-pyth-rounded': 'Used the rounded hypotenuse in the next step',
    'u7l5-add': 'Added the trig ratio to a side', 'u7l5-2nd': 'Thought 2nd was needed to find a sine', 'u7l5-bracket': 'Blamed a missing bracket (not RAD mode)', 'u7l5-really': 'Accepted a RAD-mode value as the sine',
    'u7l5-top-bottom': 'Unknown on top / bottom mixed up', 'u7l5-small': 'Thought a small angle has a sine near 1', 'u7l5-size': 'Thought the size of the triangle changes the ratio', 'u7l5-45': 'Thought sin 45° = 1',
    'u7l5-decimal': 'Thought a length can’t be a decimal', 'u7l5-less1': 'Confused the ratio (< 1) with the side', 'u7l5-half': 'Used exactly half (30° rule) for another angle', 'u7l5-round': 'Blamed rounding',
    'u7l5-adj': 'Chose the adjacent side', 'u7l5-sin-only': 'Gave sin θ without multiplying by the hyp', 'u7l5-north': 'Gave the north distance (cosine) instead of east', 'u7l5-always': 'Said sine always works',
    'u7l5-compare': 'Compared the heights the wrong way', 'u7l5-length': 'Compared the ladder’s length, not its height'
  });

  /* ================= figures ================= */
  /* fig(r, o): a right triangle with the marked angle θ (o.th, degrees) at vertex 'A' or 'B' (o.at), the right angle at C.
   *   o.lab: { opp, adj, hyp } text for the sides (from θ), o.ang: the angle label ('34°'; default θ; false = no mark),
   *   o.names: [name at A, name at B, name at C] or false, o.orient: 'std' | 'turn' | 'any', o.draw: the angle drawn
   *   (default θ clamped to 20°–70°), o.width. Returns { svg, at, map } with map = { opp: 'a'|'b', adj: …, hyp: 'c' }. */
  var ORIENT = {
    std: [{ right: 'br' }, { right: 'bl' }],
    turn: [{ right: 'br', rot: 90 }, { right: 'bl', rot: -90 }, { right: 'tr' }, { right: 'tl' }, { right: 'br', flip: true, rot: 90 }],
    any: [{ right: 'br', rot: 35 }, { right: 'bl', rot: -40 }, { right: 'tl', flip: true }, { right: 'tr', rot: 20 }, { right: 'br', rot: 180 }, { right: 'bl', rot: 140 }, { right: 'tl', rot: -25 }]
  };
  function fig(r, o) {
    o = o || {}; var at = o.at || r.pick(['A', 'B']), d = o.draw != null ? o.draw : Math.max(20, Math.min(70, o.th == null ? 38 : o.th));
    var A = at === 'A' ? d : 90 - d, map = G.rolesFor(at), lab = o.lab || {}, sides = {}, angles = {}, or = r.pick(ORIENT[o.orient || 'std']);
    ['opp', 'adj', 'hyp'].forEach(function (k) { if (lab[k] != null) sides[map[k]] = lab[k]; });
    if (o.ang !== false && o.ang != null) angles[at] = o.ang;
    var spec = { c: 1, A: A, right: or.right, rot: or.rot || 0, flip: !!or.flip, names: o.names || false, sides: sides, angles: angles, width: o.width || 270 };
    if (o.ang !== false) { spec.theta = at; if (o.ang == null) spec.thetaLabel = 'θ'; }
    if (o.unknown) spec.unknown = map[o.unknown];
    return { svg: G.rightTriSVG(spec) + (o.note ? '<div style="font-size:13px;color:#6a6f7a">' + o.note + '</div>' : ''), at: at, map: map };
  }
  var LETTERS = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F'], ['K', 'L', 'M'], ['X', 'Y', 'Z'], ['S', 'T', 'U'], ['G', 'H', 'J']];

  /* ================= labelling table: opp / adj / hyp for each side ================= */
  /* labelPart(r, o): o.orient, o.th (drawn angle), o.names (fixed letters), o.at, o.ask: 'theta' (θ marked) | 'vertex' (for ∠X, no mark) */
  function labelPart(r, o) {
    o = o || {}; var nm = o.names || r.shuffle(r.pick(LETTERS)), at = o.at || r.pick(['A', 'B']), th = o.th || r.int(28, 62);
    var F = fig(r, { th: th, at: at, names: nm, orient: o.orient, ang: o.ask === 'vertex' ? false : null, width: 250 });
    var V = { A: nm[0], B: nm[1], C: nm[2] }, seg = { a: V.B + V.C, b: V.A + V.C, c: V.A + V.B }, role = {};
    Object.keys(F.map).forEach(function (k) { role[F.map[k]] = k; });
    var rows = ['a', 'b', 'c'].map(function (s) { return { id: s, html: 'Side ' + seg[s].split('').sort().join('') }; }).sort(function (x, y) { return x.html < y.html ? -1 : 1; });
    var cols = [{ id: 'opp', html: 'opp' }, { id: 'adj', html: 'adj' }, { id: 'hyp', html: 'hyp' }], want = {};
    want.c = 'hyp'; rows.forEach(function (rw) { if (rw.id !== 'c') want[rw.id] = role[rw.id]; });   // the hyp row is checked first (its hint comes first)
    var who = o.ask === 'vertex' ? t('\\angle ' + V[at]) : 'the angle ' + t('\\theta');
    var why = function (rowId, got, w) {
      var s = seg[rowId].split('').sort().join('');
      if (w === 'hyp') return { code: 'u7l5-label-hyp', hint: 'Find the right angle first. Side ' + s + ' is across from it, so it is the <b>hyp</b> (the longest side).' };
      if (got === 'hyp') return { code: 'u7l5-label-hyp', hint: 'There is only one hyp: the side across from the right angle (at ' + V.C + '). Side ' + s + ' is not across from it.' };
      if (w === 'opp') return { code: 'u7l5-label-swap', hint: 'Side ' + s + ' does not touch ' + who + ': it is across from it, so it is the <b>opp</b>.' };
      return { code: 'u7l5-label-swap', hint: 'Side ' + s + ' touches ' + who + ' and is not the hyp, so it is the <b>adj</b>.' };
    };
    var sol = steps(['The right angle is at ' + V.C + ', so the side across from it, ' + seg.c.split('').sort().join('') + ', is the <b>hyp</b>.',
      'Across from ' + who + ' (not touching it): ' + seg[F.map.opp].split('').sort().join('') + ' is the <b>opp</b>.',
      'The last side touches ' + who + ': ' + seg[F.map.adj].split('').sort().join('') + ' is the <b>adj</b>.']);
    var pr = o.prompt != null ? o.prompt : 'Label each side opp, adj or hyp for ' + who + '.';
    var p = P.grid((pr ? pr + '<br>' : '') + F.svg, rows, cols, want, { why: why, rowHead: 'Side', colHead: 'For ' + who }, sol,
      ['Step 1: the side across from the right angle is the hyp.', 'Step 2: the side across from the angle (not touching it) is the opp. Step 3: the last side is the adj.'], o.text || 'label opp adj hyp');
    return p;
  }

  /* ================= sin θ (or cos θ) as a fraction and a decimal ================= */
  var TRIPLES = [[8, 15, 17], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61], [28, 45, 53], [33, 56, 65], [16, 63, 65], [3, 4, 5], [48, 55, 73], [13, 84, 85], [36, 77, 85], [39, 80, 89], [65, 72, 97]];
  var EX_TRI = [[5, 12, 13], [6.3, 8.4, 10.5], [7, 24, 25], [9, 12, 15]];
  function isExTri(s) { return EX_TRI.some(function (e) { return same(e[0], Math.min(s[0], s[1])) && same(e[1], Math.max(s[0], s[1])) && same(e[2], s[2]); }); }
  /* a triangle: kind 'int' (whole numbers) | 'scaled' (×2, ×3 of the small triples) | 'dec' (×0.1 or ×0.2: decimals) */
  function pickTri(r, kind, avoid) {
    return find(function () {
      var tr = r.pick(TRIPLES), k = kind === 'int' ? 1 : kind === 'scaled' ? r.pick([2, 3]) : r.pick([0.1, 0.2, 0.5]);
      if (kind === 'scaled' && tr[2] > 41) return null;
      if (kind === 'int' && tr[0] === 3) return null;
      if (kind === 'dec' && (tr[2] * k > 15 || tr[2] * k < 2.5 || (k === 0.5 && tr[2] > 30))) return null;
      return tr.map(function (x) { return q(x * k); });
    }, function (s) { return !isExTri(s) && !(avoid || []).some(function (a) { return same(a[2], s[2]) && same(a[0], s[0]); }); }, [8, 15, 17]);
  }
  /* the fraction box: right when it equals top ÷ hyp and is written with a fraction bar; other side pairs get a hint */
  function fracChk(fn, s, o) {   // s = { opp, adj, hyp }; o.noDec: no decimal box follows
    var want = s[TOP[fn]] / s.hyp, other = fn === 'sin' ? 'adj' : 'opp';
    var traps = [
      [s[other] / s.hyp, fn === 'sin' ? 'u7l5-frac-adj' : 'u7l5-frac-other', 'That is ' + other + ' ÷ hyp' + (fn === 'sin' ? ' (the cosine)' : ' (the sine)') + '. ' + MN[fn] + ': ' + NAME[fn] + ' is <b>' + TOP[fn] + '</b> over hyp. Which side is ' + (TOP[fn] === 'opp' ? 'across from θ' : 'touching θ (not the hyp)') + '?'],
      [s.opp / s.adj, 'u7l5-frac-tan', 'That is opp ÷ adj (the tangent, Lesson 4). ' + MN[fn] + ': ' + NAME[fn] + ' uses the <b>' + TOP[fn] + '</b> and the <b>hyp</b>.'],
      [s.adj / s.opp, 'u7l5-frac-other', 'Use the ' + TOP[fn] + ' and the <b>hyp</b>: ' + NAME[fn] + ' = ' + TOP[fn] + ' ÷ hyp.'],
      [s.hyp / s[TOP[fn]], 'u7l5-frac-upside', 'Upside down: the <b>hyp</b> goes on the bottom. (A ' + NAME[fn] + ' is never more than 1.)'],
      [s.hyp / s[other], 'u7l5-frac-upside', 'The <b>hyp</b> goes on the bottom, and the top is the ' + TOP[fn] + '.']];
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var v = a.val, sh = HW.ex.shape(a.ast);
      if (!isFinite(v)) return wrong('value', null);
      var isFrac = sh.divs >= 1;
      var asFrac = 'Write it as a <b>fraction</b>' + (o && o.noDec ? ': ' : ' first: ') + TOP[fn] + ' over hyp (use the fraction key).' + (o && o.noDec ? '' : ' The decimal goes in the next box.');
      if (Math.abs(v - want) < 1e-9) return isFrac ? ok() : form('u7l5-frac-decimal', asFrac);
      for (var i = 0; i < traps.length; i++) if (Math.abs(v - traps[i][0]) < 1e-9 || (!isFrac && Math.abs(v - traps[i][0]) < 6e-5)) return wrong(traps[i][1], traps[i][2]);
      if (!isFrac && Math.abs(v - want) < 6e-4) return form('u7l5-frac-decimal', asFrac);
      return wrong('value', null);
    };
  }
  function decChk(fn, s) {
    var want = s[TOP[fn]] / s.hyp, other = fn === 'sin' ? 'adj' : 'opp';
    return K.near(want, 4, { alts: [
      { v: s[other] / s.hyp, code: 'u7l5-dec-cos', hint: 'That is ' + other + ' ÷ hyp. ' + cap(NAME[fn]) + ' is ' + TOP[fn] + ' ÷ hyp.' },
      { v: s.hyp / s[TOP[fn]], code: 'u7l5-dec-upside', hint: 'Divide the ' + TOP[fn] + ' by the hyp (the hyp is on the bottom). A ' + NAME[fn] + ' is less than 1.' },
      { v: s.opp / s.adj, code: 'u7l5-dec-tan', hint: 'That is opp ÷ adj (the tangent). Use the ' + TOP[fn] + ' and the hyp.' },
      { v: s.adj / s.opp, code: 'u7l5-dec-tan', hint: 'Use the ' + TOP[fn] + ' and the hyp: ' + TOP[fn] + ' ÷ hyp.' }] });
  }
  /* fracPart(r, fn, o): o.kind ('int' | 'scaled' | 'dec'), o.unit, o.orient, o.prompt, o.avoid */
  function fracPart(r, fn, o) {
    o = o || {}; var s3 = pickTri(r, o.kind || 'int', o.avoid), sw = r.chance(0.5), legs = sw ? [s3[1], s3[0]] : [s3[0], s3[1]];
    var s = { opp: legs[0], adj: legs[1], hyp: s3[2] }, u = o.unit ? ' ' + o.unit : '';
    var th0 = Math.atan2(s.opp, s.adj) / RAD, F = fig(r, { th: th0, lab: { opp: N(s.opp) + u, adj: N(s.adj) + u, hyp: N(s.hyp) + u }, orient: o.orient, width: 250 });
    var top = s[TOP[fn]], val = top / s.hyp, fracT = '\\dfrac{' + NT(top) + '}{' + NT(s.hyp) + '}', fx = '\\' + fn + '\\theta';
    var keyFrac = '\\frac{' + NT(top) + '}{' + NT(s.hyp) + '}';
    var pr = o.prompt != null ? o.prompt : 'Write ' + t(fx) + ' as a fraction, then as a decimal to 4 decimal places.';
    var p = P.fields((pr ? pr + '<br>' : '') + F.svg,
      [{ label: t(fx + '='), name: 'Fraction', mode: 'math', keys: 'fraction' }, { label: t(fx + '\\approx'), name: 'Decimal' }],
      [fracChk(fn, s), decChk(fn, s)], [keyFrac, f4(val)],
      t(fx + '=' + fracT + (same(rd(val, 4), val) ? '=' : '\\approx ') + f4(val)),
      steps([TOP[fn] + ' = ' + N(top) + ', hyp = ' + N(s.hyp) + (fn === 'sin' ? ' (adj = ' + N(s.adj) + ' is not used)' : ' (opp = ' + N(s.opp) + ' is not used)'),
        t(fx + '=\\dfrac{\\text{' + TOP[fn] + '}}{\\text{hyp}}=' + fracT + (same(rd(val, 4), val) ? '=' : '\\approx ') + f4(val))]),
      ['Find the hyp first: across from the right angle. Then find the ' + TOP[fn] + (TOP[fn] === 'opp' ? ' (across from θ).' : ' (touching θ, not the hyp).'), MN[fn] + ': ' + NAME[fn] + ' = ' + TOP[fn] + ' ÷ hyp. Round the decimal to 4 places.'], o.text || NAME[fn] + ' as a fraction');
    p.bad = [[keyFrac, f4(s[fn === 'sin' ? 'adj' : 'opp'] / s.hyp)], ['\\frac{' + NT(s.hyp) + '}{' + NT(top) + '}', f4(val)], [f4(val), f4(val)]];
    return p;
  }

  /* ================= calculator values to 4 decimal places ================= */
  function valChk(fn, d) {
    return K.near(TR[fn](d), 4, { alts: [
      { v: TRR[fn](d), code: 'trig-rad', hint: G.RAD_HINT },
      { v: TR[OTHER[fn] || 'cos'](d), code: 'trig-wrong-ratio', hint: 'That is ' + (OTHER[fn] || 'cos') + ' ' + d + '°. Press the <b>' + fn + '</b> key.' },
      { v: TR.tan(d), code: 'trig-wrong-ratio', hint: 'That is tan ' + d + '°. Press the <b>' + fn + '</b> key.' }] });
  }
  /* valuesPart(fn, angles, o): one box per angle */
  function valuesPart(fn, angs, o) {
    o = o || {};
    return P.fields(o.prompt || 'Use your calculator (DEG mode). Round to 4 decimal places.', angs.map(function (d) { return { label: t(fn$(fn, d) + '='), name: fn + ' ' + d + '°' }; }),
      angs.map(function (d) { return valChk(fn, d); }), angs.map(function (d) { return f4(TR[fn](d)); }),
      angs.map(function (d) { return t(fn$(fn, d) + '\\approx ' + f4(TR[fn](d))); }).join(', &nbsp; '),
      steps(angs.map(function (d) { return fn + ' ' + d + ' ) ENTER → ' + t(dots(TR[fn](d), 6) + '\\approx ' + f4(TR[fn](d))); })),
      ['Check that the screen shows DEG. Then press ' + fn + ', the angle, ) and ENTER.', 'Round to 4 decimal places: look at the 5th decimal digit.'], o.text || NAME[fn] + ' values');
  }

  /* ================= a side from an angle and one side ================= */
  /* sidePart(fn, th, given, wantRole, o): the given side is the hyp when wantRole is the top (opp for sin, adj for cos), or the
   * top when wantRole is 'hyp'. o: unit, prompt (text before the figure), figure (svg | false), x (unknown's name), check
   * (a sentence after), sol0 (first lines), words (sentence for the answer), nr, hints, text. */
  function sideCalc(fn, th, given, wantRole) {
    var onTop = wantRole !== 'hyp', v = onTop ? given * TR[fn](th) : given / TR[fn](th);
    return { v: v, op: onTop ? 'mul' : 'div', onTop: onTop };
  }
  function sideSol(fn, th, given, wantRole, o) {
    o = o || {}; var c = sideCalc(fn, th, given, wantRole), x = o.x || 'x', u = o.unit ? '\\text{ ' + o.unit + '}' : '', fx = fn$(fn, th);
    var lines = (o.sol0 || []).slice();
    if (c.onTop) {
      if (!o.sol0) lines.push(TOP[fn] + ' = ' + t(x) + ', hyp = ' + N(given));
      lines.push(t(fx + '=\\dfrac{' + x + '}{' + NT(given) + '}'));
      lines.push(t(x + '=' + NT(given) + '\\times' + fx + '=' + dots(c.v) + '\\approx ' + f1(c.v) + u));
      lines.push('Keys: ' + N(given) + ' × ' + fn + ' ' + N(th) + ' ) ENTER');
      if (o.check !== false) lines.push('Check: ' + f1(c.v) + ' < ' + N(given) + ' ✓ (the hyp is the longest side)');
    } else {
      if (!o.sol0) lines.push(TOP[fn] + ' = ' + N(given) + ', hyp = ' + t(x));
      lines.push(t(fx + '=\\dfrac{' + NT(given) + '}{' + x + '}'));
      lines.push(t(x + '\\times' + fx + '=' + NT(given)));
      lines.push(t(x + '=\\dfrac{' + NT(given) + '}{' + fx + '}=' + dots(c.v) + '\\approx ' + f1(c.v) + u));
      lines.push('Keys: ' + N(given) + ' ÷ ' + fn + ' ' + N(th) + ' ) ENTER');
      if (o.check !== false) lines.push('Check: ' + f1(c.v) + ' > ' + N(given) + ' ✓ (the hyp is the longest side)');
    }
    if (o.words) lines.push(o.words.replace('#', f1(c.v) + (o.unit ? ' ' + o.unit : '')));
    return steps(lines);
  }
  function sidePart(fn, th, given, wantRole, o) {
    o = o || {}; var c = sideCalc(fn, th, given, wantRole), key = f1(c.v);
    var hints = o.hints || (c.onTop
      ? ['Label the sides from the ' + N(th) + '° angle. You know the hyp and want the ' + TOP[fn] + ': ' + MN[fn] + '.', 'The unknown is on <b>top</b> of the fraction, so <b>multiply</b>: ' + TOP[fn] + ' = hyp × ' + fn + ' θ.']
      : ['Label the sides from the ' + N(th) + '° angle. You know the ' + TOP[fn] + ' and want the hyp: ' + MN[fn] + '.', 'The unknown is on the <b>bottom</b>, so <b>divide</b>: hyp = ' + TOP[fn] + ' ÷ ' + fn + ' θ.']);
    var p = G.P.len((o.prompt || '') + (o.figure ? (o.prompt ? '<br>' : '') + o.figure : ''), c.v, { unit: o.unit, nr: o.nr, trig: { fn: fn, deg: th, side: given, op: c.op }, alts: o.alts, sol: o.sol || sideSol(fn, th, given, wantRole, o), hints: hints, text: o.text });
    p.bad = badList(key, [c.onTop ? given / TR[fn](th) : given * TR[fn](th), c.onTop ? given * TRR[fn](th) : given / TRR[fn](th), c.onTop ? given * TR[OTHER[fn] || 'cos'](th) : given / TR[OTHER[fn] || 'cos'](th)]);
    if (o.accept) { var inner = p.check, acc = o.accept; p.check = function (resp) { var r0 = inner(resp); if (r0.v === 'correct') return r0; var pv = HW.parse.number(readPlain(resp)); if (pv.ok && decsOf(readPlain(resp)) <= 1 && acc.some(function (a) { return same(pv.value, rd(a, 1)); })) return ok(); return r0; }; p.bad = p.bad.filter(function (b) { return !acc.some(function (a) { return f1(a) === b; }); }); }
    return p;
  }
  /* a figure for a side question: the given side and x */
  function sideFig(r, fn, th, given, wantRole, o) {
    o = o || {}; var lab = {}, u = o.unit ? ' ' + o.unit : '';
    if (wantRole === 'hyp') { lab[TOP[fn]] = N(given) + u; lab.hyp = o.x || 'x'; } else { lab.hyp = N(given) + u; lab[wantRole] = o.x || 'x'; }
    return fig(r, { th: th, lab: lab, ang: N(th) + '°', orient: o.orient, draw: o.draw, note: o.note, width: o.width || 260 }).svg;
  }
  /* a full "find the side" part with its own figure */
  function sideFigPart(r, fn, th, given, wantRole, o) {
    o = o || {};
    return sidePart(fn, th, given, wantRole, Object.assign({}, o, { figure: sideFig(r, fn, th, given, wantRole, o) }));
  }

  /* ================= two-step: a height plus a starting height ================= */
  /* addedChk(fn, th, L, base, o): answer = L × fn(θ) + base. Traps: no base, base subtracted, ÷, the other ratio, RAD;
   * rounding L × fn(θ) first to a tenth gives a nudge when it changes the answer. */
  function addedChk(fn, th, L, base, o) {
    o = o || {}; var h = L * TR[fn](th), v = h + base, oth = OTHER[fn] || 'cos';
    var alts = [{ v: h, code: 'u7l5-no-pivot', hint: o.noBase || 'That is the height above the starting point. Add the ' + N(base) + ' m.' },
      { v: h - base, code: 'u7l5-sub-pivot', hint: 'The ' + N(base) + ' m is below the triangle, so <b>add</b> it.' },
      { v: L / TR[fn](th) + base, code: 'trig-mul-div', hint: 'The unknown height is on <b>top</b> of the fraction, so multiply: ' + N(L) + ' × ' + fn + ' ' + N(th) + '°.' },
      { v: L * TR[oth](th) + base, code: 'trig-wrong-ratio', hint: 'That uses ' + oth + '. The height is ' + (fn === 'sin' ? 'across from' : 'next to') + ' the ' + N(th) + '° angle and ' + N(L) + ' m is the hyp: ' + MN[fn] + '.' },
      { v: L * TR[oth](th), code: 'trig-wrong-ratio', hint: 'Check the ratio (' + MN[fn] + '), then add the ' + N(base) + ' m.' },
      { v: L * TRR[fn](th) + base, code: 'trig-rad', hint: G.RAD_HINT }];
    var c = G.lenChk(v, { unit: o.unit, nr: o.nr, radTrap: false, early: false, alts: alts }), early = rd(h, 1) + base;
    return function (resp) {
      var r0 = c(resp); if (r0.v === 'correct') return r0;
      var pv = HW.parse.number(readPlain(resp));
      if (pv.ok && !same(rd(early, 1), rd(v, 1)) && same(rd(pv.value, 1), rd(early, 1))) return form('u7l5-step-round', 'Nearly! Keep the full calculator value of ' + N(L) + ' × ' + fn + ' ' + N(th) + '° (' + dots(h) + ') and add ' + N(base) + ' to that. Round only at the end.');
      return r0;
    };
  }
  function addedPart(prompt, fn, th, L, base, o) {
    o = o || {}; var h = L * TR[fn](th), v = h + base, key = f1(v);
    return { prompt: prompt, input: { type: 'number', after: o.unit || 'm', nr: !!o.nr }, check: addedChk(fn, th, L, base, o), key: key, answer: t(key) + ' ' + (o.unit || 'm'),
      solution: steps((o.sol0 || []).concat([t(fn$(fn, th) + '=\\dfrac{x}{' + NT(L) + '}') + ', so ' + t('x=' + NT(L) + '\\times' + fn$(fn, th) + '=' + dots(h)) + ' ' + (o.unit || 'm'),
        'Add the ' + N(base) + ' ' + (o.unit || 'm') + ': ' + t(dots(h) + '+' + NT(base) + '=' + dots(v) + '\\approx ' + key) + ' ' + (o.unit || 'm'), o.words ? o.words.replace('#', key + ' ' + (o.unit || 'm')) : null])),
      hints: o.hints || ['First find the height of the triangle: ' + N(L) + ' is the hyp, the height is the ' + TOP[fn] + '.', 'Then add the ' + N(base) + ' m it starts above the ground (or water). Keep the full value until the end.'],
      text: o.text, bad: badList(key, [h, h - base, L * TR[OTHER[fn] || 'cos'](th) + base]) };
  }

  /* ================= multiple-choice builders ================= */
  /* which equation gives the hypotenuse (or the top side)? */
  function eqnMC(r, fn, th, given, wantRole, prompt, x, unit, text) {
    x = x || 'h'; var onTop = wantRole !== 'hyp', g = NT(given), fx = fn$(fn, th), v = onTop ? given * TR[fn](th) : given / TR[fn](th);
    var right = onTop ? x + '=' + g + '\\times' + fx : x + '=\\dfrac{' + g + '}{' + fx + '}', mul = x + '=' + g + '\\times' + fx, dv = x + '=\\dfrac{' + g + '}{' + fx + '}';
    var opts = [{ html: t(right), right: true },
      { html: t(onTop ? dv : mul), why: onTop ? 'The unknown ' + TOP[fn] + ' is on <b>top</b> of ' + t(fx + '=\\dfrac{' + x + '}{' + g + '}') + ', so multiply.' : 'The unknown hyp is on the <b>bottom</b> of ' + t(fx + '=\\dfrac{' + g + '}{' + x + '}') + ', so divide. (Multiplying gives a hyp shorter than ' + N(given) + '.)', code: 'trig-mul-div' },
      { html: t(x + '=\\dfrac{' + fx + '}{' + g + '}'), why: 'Upside down: the side goes on top and ' + t(fx) + ' on the bottom.', code: 'trig-upside' },
      { html: t(x + '=' + g + '+' + fx), why: 'A trig ratio is a fraction, so you multiply or divide, never add.', code: 'u7l5-add' }];
    return P.mc(r, prompt, opts, steps([t(fx + '=' + (onTop ? '\\dfrac{' + x + '}{' + g + '}' : '\\dfrac{' + g + '}{' + x + '}')) + ': the unknown is on the <b>' + (onTop ? 'top' : 'bottom') + '</b>, so ' + (onTop ? 'multiply' : 'divide') + '.', t(right + '\\approx ' + f1(v)) + (unit ? ' ' + unit : '')]),
      ['Write ' + t(fx + '=\\dfrac{\\text{' + TOP[fn] + '}}{\\text{hyp}}') + ' with the numbers. Is the unknown on top or on the bottom?'], text || 'which equation');
  }
  /* RAD mode: the calculator shows fn(x rad) */
  function radMC(r, fn, d, who, text, prompt) {
    var shown = f4(TRR[fn](d)), right = f4(TR[fn](d));
    return P.mc(r, prompt || who + ' presses ' + fn + ' ' + d + ' ) ENTER and the calculator shows ' + t(shown) + '. What is the most likely reason?', [
      { html: 'The calculator is in <b>RAD</b> mode, not DEG mode.', right: true },
      { html: '2nd should have been pressed first.', why: '2nd ' + fn + ' (' + fn + '⁻¹) finds an <b>angle</b> from a ratio. To find ' + fn + ' ' + d + '°, just press ' + fn + '.', code: 'u7l5-2nd' },
      { html: 'A bracket is missing before ' + d + '.', why: 'The TI-30XIIS opens the bracket for you when you press ' + fn + '.', code: 'u7l5-bracket' },
      { html: 'The ' + NAME[fn] + ' of ' + d + '° really is ' + shown + '.', why: 'In DEG mode ' + fn + ' ' + d + '° ≈ ' + right + '. A wrong-looking value like ' + shown + ' means the angle mode is wrong.', code: 'u7l5-really' }],
      steps(['In DEG mode, ' + t(fn$(fn, d) + '\\approx ' + right) + '.', 'The calculator gave ' + t(shown) + ' because it read ' + d + ' as ' + d + ' <b>radians</b>. Press DRG, choose DEG, ENTER.']),
      ['What should ' + fn + ' ' + d + '° be? Try it on your own calculator in DEG mode.'], text || 'RAD mode');
  }
  /* the MC of four "finish the sentence" choices */
  function sentenceMC(r, onTop, figure, prompt, text) {
    var o = [['top', 'multiply'], ['top', 'divide'], ['bottom', 'multiply'], ['bottom', 'divide']], want = onTop ? 0 : 3;
    return P.mc(r, (prompt || 'Finish the sentence.') + '<br>' + figure, o.map(function (s, i) {
      return { html: 'The unknown is on the <b>' + s[0] + '</b>, so I <b>' + s[1] + '</b>.', right: i === want,
        why: s[0] !== o[want][0] ? 'Write the ratio with the numbers: is ' + t('x') + ' in the numerator (top) or the denominator (bottom)?' : 'Right position, but think again: unknown on top → multiply; unknown on the bottom → divide.', code: s[0] !== o[want][0] ? 'u7l5-top-bottom' : 'trig-mul-div' };
    }), (onTop ? 'The unknown ' + t('x') + ' is the top of the fraction, so multiply both sides by the bottom.' : 'The unknown ' + t('x') + ' is on the bottom of the fraction, so divide: side ÷ ratio.'), ['Write the ratio with the numbers in it first.'], text || 'top or bottom', true);
  }

  /* ================= exports for Lesson 6 (cosine) ================= */
  HW.u7trig = { TR: TR, TRR: TRR, TOP: TOP, MN: MN, NAME: NAME, OTHER: OTHER, N: N, NT: NT, f1: f1, f2: f2, f4: f4, fd: fd, dots: dots, deg: deg, steps: steps, find: find, clean: clean,
    oneDec: oneDec, half: half, excluded: excluded, fn$: fn$, table: table, readPlain: readPlain, decsOf: decsOf, badList: badList, same: same, rd: rd, q: q,
    fig: fig, labelPart: labelPart, pickTri: pickTri, fracPart: fracPart, fracChk: fracChk, decChk: decChk, isExTri: isExTri, ORIENT: ORIENT, valChk: valChk, valuesPart: valuesPart, sideCalc: sideCalc, sideSol: sideSol, sidePart: sidePart,
    sideFig: sideFig, sideFigPart: sideFigPart, addedChk: addedChk, addedPart: addedPart, eqnMC: eqnMC, radMC: radMC, sentenceMC: sentenceMC, LETTERS: LETTERS };

  /* ================= lesson data ================= */
  /* worked examples of the lesson (angle, side) to leave out */
  var EX_OPP = [[34, 12], [61, 8.5], [75, 6], [62, 9.5], [50, 10], [40, null]];
  var EX_HYP = [[27, 4.5], [52, 15], [4.8, 0.45], [7, 18], [35, 6]];
  var EX_ANG = [5, 20, 30, 45, 70, 89, 40];
  function oppNums(r, thLo, thHi, sideGen) { return find(function () { var th = r.int(thLo, thHi), s = sideGen(); return { th: th, s: s, v: s * TR.sin(th) }; }, function (z) { return !excluded(EX_OPP, z.th, z.s) && clean(z.v); }, { th: 23, s: 15, v: 15 * TR.sin(23) }); }
  function hypNums(r, thLo, thHi, sideGen, max) { return find(function () { var th = r.int(thLo, thHi), s = sideGen(); return { th: th, s: s, v: s / TR.sin(th) }; }, function (z) { return !excluded(EX_HYP, z.th, z.s) && clean(z.v) && (!max || z.v < max); }, { th: 31, s: 6, v: 6 / TR.sin(31) }); }
  function tf(r, pool, level) { var it = r.pick(pool); return P.tf(r, it[0], it[1], it[2], it[3], it[4] || ['Think of what sine measures: opp ÷ hyp.'], 'true or false'); }

  HW.defineLesson({
    id: 'u7l5', unit: 7, num: '5', title: 'The Sine Ratio', outcome: 'G4',
    blurb: 'Sine = opp ÷ hyp: labelling sides, sine values on the calculator, finding the opposite side (multiply) and the hypotenuse (divide), and checking answers.',
    questions: [
      { num: '1', stem: 'Label each side opp, adj or hyp for the angle θ.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return labelPart(r, { orient: 'std', th: r.int(25, 40), prompt: '' }); } },
        { id: '1b', level: 'BEG', make: function (r) { return labelPart(r, { orient: 'turn', th: r.int(40, 55), prompt: '' }); } },
        { id: '1c', level: 'EMG', make: function (r) { return labelPart(r, { orient: 'any', th: r.int(55, 66), prompt: '' }); } }] },
      { num: '2', stem: 'Write sin θ as a fraction, then as a decimal (4 decimal places).', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return fracPart(r, 'sin', { kind: 'int', orient: 'std', prompt: '' }); } },
        { id: '2b', level: 'BEG', make: function (r) { return fracPart(r, 'sin', { kind: r.pick(['int', 'scaled']), orient: 'turn', prompt: '' }); } },
        { id: '2c', level: 'EMG', make: function (r) { return fracPart(r, 'sin', { kind: r.pick(['dec', 'scaled']), unit: r.pick(['m', 'cm', 'ft']), orient: 'turn', prompt: '' }); } }] },
      { num: '3', stem: 'Use your calculator in DEG mode.',
        shared: function (r) { var pick = function (lo, hi) { return find(function () { return r.int(lo, hi); }, function (d) { return EX_ANG.indexOf(d) < 0; }, lo + 1); }; return { a: [pick(8, 18), pick(31, 44), pick(50, 64), pick(76, 87)] }; },
        parts: [
          { id: '3a', sub: 'a–d', level: 'BEG', make: function (r, sh) { return valuesPart('sin', sh.a, { prompt: 'Find each value. Round to 4 decimal places.' }); } },
          { id: '3e', sub: 'e', level: 'EMG', make: function (r, sh) {
            var big = sh.a[3], small = sh.a[0], mid = sh.a.slice().sort(function (x, y) { return Math.abs(x - 45) - Math.abs(y - 45); })[0];
            return P.mc(r, 'Which of the four angles (' + sh.a.join('°, ') + '°) has the sine closest to 1? Why does that make sense?', [
              { html: '<b>' + big + '°</b>: the bigger the angle, the closer the opposite side gets to the length of the hypotenuse.', right: true },
              { html: '<b>' + small + '°</b>: a small angle makes the opposite side close to the hypotenuse.', why: 'A small angle faces a <b>short</b> side, so opp ÷ hyp is small. Look at your values.', code: 'u7l5-small' },
              { html: '<b>' + big + '°</b>: a bigger triangle has a bigger sine.', why: 'The right angle, wrong reason: the size of the triangle does not change the sine. Only the angle matters.', code: 'u7l5-size' },
              { html: '<b>' + mid + '°</b>: it is the angle closest to 45°, where the sine is 1.', why: 'sin 45° ≈ 0.7071, not 1. The sine keeps growing toward 1 as the angle gets close to 90°.', code: 'u7l5-45' }],
              steps([t('\\sin ' + big + '^\\circ\\approx ' + f4(TR.sin(big))) + ' is the closest to 1.', 'As the angle gets bigger, the opposite side gets almost as long as the hypotenuse, so opp ÷ hyp gets close to 1.']),
              ['Look at your four values. Which is the biggest?'], 'closest to 1');
          } }] },
      { num: '4', stem: function (sh) {
          return 'A skatepark has three ramps of different lengths. All three make a ' + sh.th + '° angle with the ground.' +
            table(['Ramp', 'Length (hyp)', 'Height (opp)', 'opp ÷ hyp (2 decimals)'], sh.L.map(function (L, i) { return ['ABC'[i], N(L).replace(/^(\d+)$/, '$1.0') + ' m', f1(sh.h[i]) + ' m', '?']; }));
        },
        shared: function (r) {
          return find(function () {
            var th = r.int(18, 35), L = [half(r, 4, 6.5), half(r, 7.5, 10), half(r, 11, 14)], s = TR.sin(th), h = L.map(function (x) { return rd(x * s, 1); });
            return { th: th, L: L, h: h, r2: rd(s, 2), L4: r.pick([15, 16, 18, 20, 24, 25, 30]) };
          }, function (z) { return z.th !== 30 && z.h.every(function (h, i) { return same(rd(h / z.L[i], 2), z.r2); }) && clean(z.L4 * TR.sin(z.th)); },
          { th: 25, L: [5, 9, 11], h: [2.1, 3.8, 4.6], r2: 0.42, L4: 20 });
        },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) {
            return P.fields('(a) Fill in the last column: divide each height by the length. Round to 2 decimal places.', sh.L.map(function (L, i) { return { label: 'Ramp ' + 'ABC'[i] + ':', name: 'Ramp ' + 'ABC'[i] }; }),
              sh.L.map(function (L, i) { return K.near(sh.h[i] / L, 2, { alts: [{ v: L / sh.h[i], code: 'u7l5-dec-upside', hint: 'Divide the <b>height</b> (opp) by the <b>length</b> (hyp), not the other way.' }] }); }),
              sh.L.map(function (L, i) { return f2(sh.h[i] / L); }), sh.L.map(function (L, i) { return 'ABC'[i] + ': ' + f2(sh.h[i] / L); }).join(', &nbsp; '),
              steps(sh.L.map(function (L, i) { return 'ABC'[i] + ': ' + t(f1(sh.h[i]) + '\\div ' + NT(L) + '=' + dots(sh.h[i] / L) + '\\approx ' + f2(sh.h[i] / L)); })),
              ['opp ÷ hyp = height ÷ length.'], 'ramp ratios');
          } },
          { id: '4b', level: 'EMG', make: function (r, sh) {
            var s = TR.sin(sh.th);
            return P.mc(r, '(b) What do you notice? Find ' + t('\\sin ' + sh.th + '^\\circ') + ' and compare.', [
              { html: 'Every ratio is ' + f2(s) + '. ' + t('\\sin ' + sh.th + '^\\circ\\approx ' + f4(s)) + ', the same (the heights were rounded).', right: true },
              { html: 'The longer the ramp, the bigger the ratio.', why: 'Look at your last column again: all three ratios are the same.', code: 'u7l5-size' },
              { html: 'Every ratio is ' + f2(s) + ', but ' + t('\\sin ' + sh.th + '^\\circ\\approx ' + f4(TR.cos(sh.th))) + ', so they don’t match.', why: 'That value is cos ' + sh.th + '°. Press <b>sin</b> ' + sh.th + ' ) ENTER.', code: 'trig-wrong-ratio' },
              { html: 'Every ratio is ' + f2(s) + ', but ' + t('\\sin ' + sh.th + '^\\circ\\approx ' + f4(TRR.sin(sh.th))) + ', so the table must be wrong.', why: G.RAD_HINT, code: 'trig-rad' }],
              steps(['All three ratios are ' + f2(s) + '.', t('\\sin ' + sh.th + '^\\circ\\approx ' + f4(s)) + ': the same number. opp ÷ hyp depends only on the angle, not on the size of the ramp.']),
              ['Press sin ' + sh.th + ' ) ENTER in DEG mode and compare with your column.'], 'what do you notice');
          } },
          { id: '4c', level: 'EMG', make: function (r, sh) {
            return sidePart('sin', sh.th, sh.L4, 'opp', { unit: 'm', prompt: '(c) A fourth ramp is ' + sh.L4 + ' m long, also at ' + sh.th + '°. Predict its height, to the nearest tenth of a metre.', accept: [sh.L4 * sh.r2],
              sol0: ['The length is the hyp; the height is the opp.'], check: false, words: 'Its height is about #. (Using the table’s ' + f2(sh.r2) + ': ' + N(sh.L4) + ' × ' + f2(sh.r2) + ' = ' + f1(sh.L4 * sh.r2) + ' m is also fine.)', text: 'predict height' });
          } }] },
      { num: '5', stem: 'True or false?', parts: [
        { id: '5a', level: 'BEG', make: function (r) {
          return tf(r, [['For every acute angle, sin θ is less than 1.', true, 'The opp is always shorter than the hyp (the longest side), so opp ÷ hyp is less than 1.', 'True. The opposite side is always shorter than the hypotenuse, so opp ÷ hyp &lt; 1.'],
            ['In a big enough right triangle, sin θ can be more than 1.', false, 'The opp is always shorter than the hyp, in any size of triangle, so opp ÷ hyp is less than 1.', 'False. The opposite side is always shorter than the hypotenuse, so sin θ &lt; 1 for every acute angle, in any size of triangle.']]);
        } },
        { id: '5b', level: 'EMG', make: function (r) {
          var d = find(function () { return r.int(25, 75); }, function (x) { return EX_ANG.indexOf(x) < 0; }, 50), s = f4(TR.sin(d));
          return tf(r, [['A bigger right triangle with a ' + d + '° angle has a bigger value of sin ' + d + '°.', false, 'The size does not matter: the triangles are similar, so opp ÷ hyp is the same.', 'False. The size does not matter. ' + t('\\sin ' + d + '^\\circ\\approx ' + s) + ' in every right triangle with a ' + d + '° angle.'],
            ['Two right triangles of different sizes, each with a ' + d + '° angle, have the same value of sin ' + d + '°.', true, 'The triangles are similar (same angles), so opp ÷ hyp is the same in both.', 'True. They are similar, so opp ÷ hyp is the same: ' + t('\\sin ' + d + '^\\circ\\approx ' + s) + ' in both.']]);
        } },
        { id: '5c', level: 'EMG', make: function (r) {
          var d = r.pick([15, 20, 25, 35, 40]), s1 = f4(TR.sin(d)), s2 = f4(TR.sin(2 * d));
          return tf(r, [['sin ' + 2 * d + '° is double sin ' + d + '°.', false, 'Find both on your calculator: doubling the angle does not double the sine.', 'False. ' + t('\\sin ' + d + '^\\circ\\approx ' + s1) + ', double is ' + f4(2 * TR.sin(d)) + ', but ' + t('\\sin ' + 2 * d + '^\\circ\\approx ' + s2) + '. Doubling the angle does not double the sine.'],
            ['sin ' + d + '° is half of sin ' + 2 * d + '°.', false, 'Find both on your calculator: halving the angle does not halve the sine.', 'False. ' + t('\\sin ' + d + '^\\circ\\approx ' + s1) + ' and ' + t('\\sin ' + 2 * d + '^\\circ\\approx ' + s2) + ': ' + s1 + ' is not half of ' + s2 + '.'],
            ['sin 30° is half of sin 90°.', true, 'sin 30° = 0.5 and sin 90° = 1. Is 0.5 half of 1?', 'True. ' + t('\\sin 30^\\circ=0.5') + ' and ' + t('\\sin 90^\\circ=1') + '. (This is a special case: in general, doubling the angle does not double the sine.)']]);
        } },
        { id: '5d', level: 'BEG', make: function (r) {
          return tf(r, [['If sin θ = 0.5, the opposite side is half as long as the hypotenuse.', true, 'sin θ = opp ÷ hyp = 0.5, so the opp is 0.5 (half) of the hyp.', 'True. ' + t('\\sin\\theta=\\dfrac{\\text{opp}}{\\text{hyp}}=0.5') + ', so the opp is half of the hyp.'],
            ['If sin θ = 0.25, the opposite side is a quarter of the hypotenuse.', true, 'sin θ = opp ÷ hyp = 0.25, so the opp is 0.25 (a quarter) of the hyp.', 'True. opp ÷ hyp = 0.25, so the opp is a quarter of the hyp.'],
            ['If sin θ = 0.5, the hypotenuse is half as long as the opposite side.', false, 'The hyp is the longest side. opp ÷ hyp = 0.5 means the <b>opp</b> is half of the hyp.', 'False. opp ÷ hyp = 0.5 means the <b>opp</b> is half of the hyp (the hyp is double the opp).']]);
        } }] },
      { num: '6', stem: 'Find the length of the side x (opposite the angle). Round to the nearest tenth.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var z = oppNums(r, 15, 38, function () { return r.int(10, 30); }); return sideFigPart(r, 'sin', z.th, z.s, 'opp', { unit: 'cm', orient: 'std', text: 'opp from hyp' }); } },
        { id: '6b', level: 'BEG', make: function (r) { var z = oppNums(r, 40, 60, function () { return oneDec(r, 4.1, 9.8); }); return sideFigPart(r, 'sin', z.th, z.s, 'opp', { unit: 'm', orient: 'turn', text: 'opp from hyp' }); } },
        { id: '6c', level: 'EMG', make: function (r) { var z = oppNums(r, 60, 80, function () { return r.int(15, 40); }); return sideFigPart(r, 'sin', z.th, z.s, 'opp', { unit: 'in', orient: 'any', text: 'opp from hyp' }); } }] },
      { num: '7', outcome: 'A1', stem: 'Find the length of the hypotenuse h. Round to the nearest tenth.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var z = hypNums(r, 25, 40, function () { return r.int(4, 12); }); return sideFigPart(r, 'sin', z.th, z.s, 'hyp', { unit: 'cm', x: 'h', orient: 'std', text: 'hyp from opp' }); } },
        { id: '7b', level: 'EMG', make: function (r) { var z = hypNums(r, 50, 66, function () { return oneDec(r, 2.4, 7.8); }); return sideFigPart(r, 'sin', z.th, z.s, 'hyp', { unit: 'm', x: 'h', orient: 'turn', text: 'hyp from opp' }); } },
        { id: '7c', level: 'PRG', make: function (r) { var z = hypNums(r, 11, 19, function () { return 5 * r.int(5, 12); }); return sideFigPart(r, 'sin', z.th, z.s, 'hyp', { unit: 'ft', x: 'h', orient: 'any', draw: 26, note: 'Not drawn to scale.', text: 'hyp from opp' }); } }] },
      { num: '8', stem: 'For each triangle, finish the sentence, then solve for x.',
        shared: function (r) {
          var a = oppNums(r, 36, 52, function () { return oneDec(r, 6.2, 12.8); }), b = hypNums(r, 64, 78, function () { return oneDec(r, 6.5, 14.5); });
          return { a: a, b: b, seed: r.int(1, 1e6) };
        },
        parts: [
          { id: '8ai', sub: 'a i', level: 'BEG', make: function (r, sh) { return sentenceMC(r, true, sideFig(HW.rng(sh.seed), 'sin', sh.a.th, sh.a.s, 'opp', { unit: 'cm', orient: 'std' }), 'Finish the sentence.', 'top: multiply'); } },
          { id: '8aii', sub: 'a ii', level: 'BEG', make: function (r, sh) { return sidePart('sin', sh.a.th, sh.a.s, 'opp', { unit: 'cm', figure: sideFig(HW.rng(sh.seed), 'sin', sh.a.th, sh.a.s, 'opp', { unit: 'cm', orient: 'std' }), prompt: 'Solve for x. Round to the nearest tenth.', text: 'opp from hyp' }); } },
          { id: '8bi', sub: 'b i', outcome: 'A1', level: 'BEG', make: function (r, sh) { return sentenceMC(r, false, sideFig(HW.rng(sh.seed + 1), 'sin', sh.b.th, sh.b.s, 'hyp', { unit: 'm', orient: 'turn' }), 'Finish the sentence.', 'bottom: divide'); } },
          { id: '8bii', sub: 'b ii', outcome: 'A1', level: 'EMG', make: function (r, sh) { return sidePart('sin', sh.b.th, sh.b.s, 'hyp', { unit: 'm', figure: sideFig(HW.rng(sh.seed + 1), 'sin', sh.b.th, sh.b.s, 'hyp', { unit: 'm', orient: 'turn' }), prompt: 'Solve for x. Round to the nearest tenth.', text: 'hyp from opp' }); } }] },
      { num: '9', stem: '', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var z = find(function () { var L = r.int(12, 20), th = r.int(25, 40); return { L: L, th: th, v: L * TR.sin(th) }; }, function (z) { return clean(z.v) && !(z.L === 16 && z.th === 33); }, { L: 16, th: 33, v: 16 * TR.sin(33) });
          var sk = fig(r, { th: z.th, lab: { hyp: z.L + ' m (auger)', opp: 'h (bin)' }, ang: z.th + '°', orient: 'std', at: 'A', width: 240 }).svg;
          return sidePart('sin', z.th, z.L, 'opp', { unit: 'm', x: 'h', prompt: 'A farmer sets a ' + z.L + ' m grain auger against a bin. The auger makes a ' + z.th + '° angle with the ground, and its top end rests at the top of the bin. How tall is the bin? Round to the nearest tenth of a metre.',
            sol0: [sk, 'The auger is the hyp; the bin’s height ' + t('h') + ' is the opp.'], words: 'The bin is about # tall.', text: 'auger' });
        } }] },
      { num: '10', outcome: 'A1', stem: '', parts: [
        { id: '10', level: 'PRG', make: function (r) {
          var z = find(function () { var h = oneDec(r, 4, 9), th = r.int(18, 32); return { h: h, th: th, v: h / TR.sin(th) }; }, function (z) { return clean(z.v) && !(same(z.h, 6.5) && z.th === 24); }, { h: 6.5, th: 24, v: 6.5 / TR.sin(24) });
          var sk = fig(r, { th: z.th, lab: { opp: N(z.h) + ' m', hyp: 'b (belt)' }, ang: z.th + '°', orient: 'std', at: 'A', width: 240 }).svg;
          return sidePart('sin', z.th, z.h, 'hyp', { unit: 'm', x: 'b', prompt: 'A conveyor belt at a gravel pit lifts gravel to the top of a pile ' + N(z.h) + ' m high. The belt makes a ' + z.th + '° angle with the ground. How long is the belt, from the ground to the top of the pile? Round to the nearest tenth of a metre.',
            sol0: [sk, 'The height ' + N(z.h) + ' m is the opp; the belt ' + t('b') + ' is the hyp.'], words: 'The belt is about # long.', text: 'conveyor' });
        } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'PRG', make: function (r) {
          var z = find(function () { var L = 5 * r.int(10, 24), th = r.int(25, 50), b = oneDec(r, 1.2, 2.2); return { L: L, th: th, b: b, v: L * TR.sin(th) + b }; }, function (z) { return clean(z.v) && !(z.L === 75 && z.th === 38); }, { L: 75, th: 38, b: 1.5, v: 75 * TR.sin(38) + 1.5 });
          return addedPart('A parasailer is towed behind a boat on a ' + z.L + ' m rope. The rope makes a ' + z.th + '° angle with the horizontal. It is tied to the boat ' + N(z.b) + ' m above the water. How high above the water is the parasailer? (Treat the rope as straight.) Round to the nearest tenth of a metre.',
            'sin', z.th, z.L, z.b, { sol0: ['The rope is the hyp; the height above the tie point is the opp.'], words: 'The parasailer is about # above the water.', noBase: 'That is the height above the tie point on the boat. Add the ' + N(z.b) + ' m to get the height above the water.', text: 'parasailer' });
        } }] },
      { num: '12', stem: 'Checking answers.',
        shared: function (r) {
          var a = find(function () { var H = r.int(9, 18), A = r.int(35, 55); return { H: H, A: A, w: H / TR.sin(A), v: H * TR.sin(A) }; }, function (z) { return clean(z.v) && clean(z.w) && !(z.H === 13 && z.A === 42); }, { H: 13, A: 42, w: 13 / TR.sin(42), v: 13 * TR.sin(42) });
          var c = find(function () { var H = 2 * r.int(6, 20), A = r.pick([25, 26, 27, 28, 29, 31, 32, 33, 34]); return { H: H, A: A }; }, function (z) { return !(z.H === 20 && z.A === 28) && Math.abs(rd(z.H * TR.sin(z.A), 1) - z.H / 2) >= 0.3; }, { H: 20, A: 28 });
          return { a: a, c: c, who: r.pick(['Dev', 'Arun', 'Jesse', 'Malik']) };
        },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) {
            var a = sh.a;
            return P.mc(r, 'A right triangle has a hypotenuse of ' + a.H + ' cm and a ' + a.A + '° angle. ' + sh.who + ' wants the side opposite the ' + a.A + '° angle. His work: &nbsp;' + t('x=' + a.H + '\\div\\sin ' + a.A + '^\\circ\\approx ' + f1(a.w)) + ' cm.<br>(a) How can you tell, without a calculator, that his answer is wrong?', [
              { html: 'The opposite side must be shorter than the hypotenuse, but ' + f1(a.w) + ' &gt; ' + a.H + '.', right: true },
              { html: 'A side length can’t have a decimal.', why: 'Lengths often have decimals. Compare his answer with the hypotenuse instead.', code: 'u7l5-decimal' },
              { html: 'sin ' + a.A + '° is less than 1, so the side must be less than 1 cm.', why: 'The <b>ratio</b> is less than 1, not the side. The side is less than the hyp, ' + a.H + ' cm.', code: 'u7l5-less1' },
              { html: 'The opposite side must be exactly half of the hypotenuse.', why: 'Only with a 30° angle. Here the angle is ' + a.A + '°. Compare his answer with the hyp.', code: 'u7l5-half' }],
              'The hypotenuse is the longest side, so the opposite side must be shorter than ' + a.H + ' cm. ' + sh.who + '’s ' + f1(a.w) + ' cm is longer, so it can’t be right.', ['Which side of a right triangle is always the longest?'], 'tell it is wrong');
          } },
          { id: '12bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            var a = sh.a;
            return P.mc(r, 'What did ' + sh.who + ' do wrong? (His work: ' + t('x=' + a.H + '\\div\\sin ' + a.A + '^\\circ') + '.)', [
              { html: 'He divided. The unknown opp is on <b>top</b> of ' + t('\\sin ' + a.A + '^\\circ=\\dfrac{x}{' + a.H + '}') + ', so he should multiply.', right: true },
              { html: 'He should have used tan instead of sin.', why: 'He knows the hyp and wants the opp: SOH, so sine is the right ratio. The problem is the ÷.', code: 'trig-wrong-ratio' },
              { html: 'His calculator was in RAD mode.', why: 'In RAD mode the answer would look strange (even negative). ' + t(a.H + '\\div\\sin ' + a.A + '^\\circ') + ' really is ' + f1(a.w) + ' in DEG mode: the set-up is wrong.', code: 'trig-rad' },
              { html: 'He rounded too early.', why: 'Rounding can’t make the answer longer than the hyp. Look at the operation he used.', code: 'u7l5-round' }],
              t('\\sin ' + a.A + '^\\circ=\\dfrac{x}{' + a.H + '}') + ': the unknown is on top, so multiply both sides by ' + a.H + '. He divided instead.', ['Write the sine ratio with the numbers. Where is x?'], 'what went wrong');
          } },
          { id: '12bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { var a = sh.a; return sidePart('sin', a.A, a.H, 'opp', { unit: 'cm', prompt: 'Find the correct length of the side opposite the ' + a.A + '° angle (hypotenuse ' + a.H + ' cm).', text: 'fix the answer' }); } },
          { id: '12c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var c = sh.c, s = c.H * TR.sin(c.A), co = c.H * TR.cos(c.A), dv = c.H / TR.sin(c.A), less = c.A < 30, hlf = c.H / 2;
            return P.mc(r, '(c) Another right triangle has a hypotenuse of ' + c.H + ' m and a ' + c.A + '° angle. Three students found the side opposite the ' + c.A + '° angle: &nbsp;' + [s, co, dv].sort(function (x, y) { return x - y; }).map(function (v) { return f1(v) + ' m'; }).join(', &nbsp;') + '.<br>Use ' + t('\\sin 30^\\circ=0.5') + ' to decide which answer is reasonable, without finding the exact answer.', [
              { html: '<b>' + f1(s) + ' m</b>: at 30° the opposite side would be half of ' + c.H + ' m, ' + N(hlf) + ' m. ' + c.A + '° is a little ' + (less ? 'less' : 'more') + ' than 30°, so the answer should be a little ' + (less ? 'less' : 'more') + ' than ' + N(hlf) + ' m.', right: true },
              { html: '<b>' + f1(co) + ' m</b>: it is the closest to the hypotenuse.', why: 'At about 30° the opposite side is only about half the hyp (' + N(hlf) + ' m). ' + f1(co) + ' m is much more than half.', code: 'u7l5-adj' },
              { html: '<b>' + f1(dv) + ' m</b>: it is the biggest, so it must be right.', why: f1(dv) + ' m is longer than the hypotenuse, ' + c.H + ' m. That can’t be the opposite side.', code: 'trig-mul-div' },
              { html: '<b>' + N(hlf) + ' m</b>: with ' + t('\\sin 30^\\circ=0.5') + ', the opposite side is exactly half of ' + c.H + ' m.', why: 'The angle is ' + c.A + '°, not 30°, so the answer is close to ' + N(hlf) + ' m but not exactly it. It is not one of the three answers.', code: 'u7l5-half' }],
              steps(['With a 30° angle the opposite side would be half of ' + c.H + ' m: ' + N(hlf) + ' m.', c.A + '° is a little ' + (less ? 'less' : 'more') + ' than 30°, so the answer is a little ' + (less ? 'less' : 'more') + ' than ' + N(hlf) + ' m: <b>' + f1(s) + ' m</b> is reasonable.',
                '(' + f1(co) + ' m is far more than half; ' + f1(dv) + ' m is longer than the hypotenuse.)']), ['What is half of the hypotenuse? Is ' + c.A + '° a bit more or a bit less than 30°?'], 'reasonable answer');
          } }] },
      { num: '13', outcome: 'A1', stem: '', parts: [
        { id: '13', level: 'ADV', make: function (r) {
          var z = find(function () { var s = half(r, 18, 32), e = half(r, 2, 6), th = r.int(4, 9); return { s: s, e: e, th: th, d: q(s - e), v: (s - e) / TR.sin(th) }; }, function (z) { return clean(z.v) && !(same(z.s, 25) && same(z.e, 3.5) && z.th === 6) && !(same(z.d, 18) && z.th === 7); }, { s: 25, e: 3.5, th: 6, d: 21.5, v: 21.5 / TR.sin(6) });
          var key = f1(z.v);
          var sk = fig(r, { th: z.th, lab: { opp: N(z.s) + ' − ' + N(z.e) + ' = ' + N(z.d) + ' m', hyp: 'c (cable)' }, ang: z.th + '°', orient: 'std', at: 'A', draw: 22, note: 'Not drawn to scale.', width: 260 }).svg;
          var p = G.P.len('A zipline starts on a platform ' + N(z.s) + ' m above the ground and ends on a platform ' + N(z.e) + ' m above the ground. The cable makes a ' + z.th + '° angle with the horizontal. How long is the cable? (Treat it as straight.) Round to the nearest tenth of a metre.', z.v,
            { unit: 'm', trig: { fn: 'sin', deg: z.th, side: z.d, op: 'div' }, alts: [{ v: z.s / TR.sin(z.th), code: 'u7l5-no-subtract', hint: 'The cable only drops from ' + N(z.s) + ' m to ' + N(z.e) + ' m. The opp is the <b>drop</b>: ' + N(z.s) + ' − ' + N(z.e) + '.' },
              { v: (z.s + z.e) / TR.sin(z.th), code: 'u7l5-added-heights', hint: 'The drop is the <b>difference</b> of the two heights: subtract.' }, { v: z.e / TR.sin(z.th), code: 'u7l5-no-subtract', hint: 'The opp is the drop from the start to the end: ' + N(z.s) + ' − ' + N(z.e) + '.' }],
              sol: steps([sk, 'The drop from start to end is ' + t(NT(z.s) + '-' + NT(z.e) + '=' + NT(z.d)) + ' m. That is the opp; the cable ' + t('c') + ' is the hyp.', t('\\sin ' + deg(z.th) + '=\\dfrac{' + NT(z.d) + '}{c}'), t('c=\\dfrac{' + NT(z.d) + '}{\\sin ' + deg(z.th) + '}=' + dots(z.v) + '\\approx ' + key) + ' m', 'The cable is about ' + key + ' m long.']),
              hints: ['Sketch it: the opp is how far the cable <b>drops</b>, not the height of one platform.', 'The cable is the hyp (unknown on the bottom): divide by sin ' + z.th + '°.'], text: 'zipline' });
          p.bad = badList(key, [z.s / TR.sin(z.th), (z.s + z.e) / TR.sin(z.th), z.d * TR.sin(z.th)]);
          return p;
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'MAS', make: function (r) {
          var z = find(function () { var L = oneDec(r, 4.5, 7.2), a = r.int(60, 70), b = a + r.int(4, 9); return { L: L, a: a, b: b, who: r.pick(['Nadia', 'Priya', 'Sam', 'Leah']) }; }, function (z) {
            var v = z.L * (TR.sin(z.b) - TR.sin(z.a)); return z.b <= 78 && clean(v, 2) && !(same(z.L, 5.5) && z.a === 68) && !(same(z.L, 6) && z.b === 75) && !same(rd(v, 2), rd(z.L * TR.sin(z.b - z.a), 2));
          }, { L: 5.5, a: 68, b: 75, who: 'Nadia' });
          var h1 = z.L * TR.sin(z.a), h2 = z.L * TR.sin(z.b), v = h2 - h1, key = f2(v), book = rd(rd(h2, 4) - rd(h1, 4), 2), two = rd(rd(h2, 2) - rd(h1, 2), 2), one = rd(rd(h2, 1) - rd(h1, 1), 2);
          var alts = [{ v: z.L * TR.sin(z.b - z.a), code: 'u7l5-diff-angle', hint: 'You can’t subtract the angles first: sin ' + (z.b - z.a) + '° is not the change in height. Find the height at each angle, then subtract the heights.' },
            { v: h2, code: 'u7l5-one-height', hint: 'That is the height at ' + z.b + '°. Find the height at ' + z.a + '° too, and subtract.' }, { v: h1, code: 'u7l5-one-height', hint: 'That is the height at ' + z.a + '°. Find the height at ' + z.b + '° too, and subtract.' },
            { v: z.L * (TR.cos(z.a) - TR.cos(z.b)), code: 'u7l5-foot', hint: 'That uses cosine: it is how far the <b>foot</b> moved. The height up the wall is across from the angle with the ground: sine.' },
            { v: -v, code: 'u7l5-neg', hint: 'Subtract the lower height from the higher one: the height at ' + z.b + '° minus the height at ' + z.a + '°.' },
            { v: z.L * (TRR.sin(z.b) - TRR.sin(z.a)), code: 'trig-rad', hint: G.RAD_HINT }];
          var near = K.near(v, 2, { alts: alts, unit: 'm' });
          var check = function (resp) {
            var s = readPlain(resp), pv = HW.parse.number(s);
            if (pv.ok) {
              var x = pv.value, d = decsOf(s);
              if (d <= 2 && same(x, book)) return ok();
              if (d <= 2 && !same(two, book) && same(x, two)) return form('u7l5-step-round', 'Nearly! You rounded the two heights to the hundredth first. Keep more decimals (4 or the full value) for each height, then subtract and round.');
              if (d <= 2 && !same(one, book) && same(x, one)) return form('u7l5-step-round', 'You rounded the heights to the tenth first, so the difference is too rough. Keep the full values (or 4 decimals), subtract, then round to the hundredth.');
              if (Math.abs(x - 100 * v) < 1.5 && x > 3) return form('u7l5-cm', 'That looks like centimetres. The box is in <b>metres</b>: give the answer in m, to the hundredth.');
            }
            return near(resp);
          };
          return { prompt: z.who + ' leans a ' + N(z.L) + ' m ladder against a wall at ' + z.a + '° to the ground. Her neighbour tells her to move the foot closer to the wall so the angle is ' + z.b + '°. How much higher up the wall does the ladder reach after she moves it? Round to the nearest hundredth of a metre.',
            input: { type: 'number', after: 'm' }, check: check, key: key, answer: t(key) + ' m',
            solution: steps(['The ladder is the hyp; the height up the wall is the opp.', 'At ' + z.a + '°: ' + t(NT(z.L) + '\\times\\sin ' + deg(z.a) + '=' + dots(h1, 4)) + ' m', 'At ' + z.b + '°: ' + t(NT(z.L) + '\\times\\sin ' + deg(z.b) + '=' + dots(h2, 4)) + ' m',
              'Difference: ' + t(dots(h2, 4).replace('\\ldots', '') + '-' + dots(h1, 4).replace('\\ldots', '') + '\\approx ' + key) + ' m', 'It reaches about ' + key + ' m (' + Math.round(v * 100) + ' cm) higher.']),
            hints: ['Find the height up the wall at ' + z.a + '° and at ' + z.b + '° (ladder × sin angle).', 'Subtract the two heights. Keep 4 decimals until the last step.'], text: 'ladder higher',
            bad: badList(key, [z.L * TR.sin(z.b - z.a), h2, h1, z.L * (TR.cos(z.a) - TR.cos(z.b))], 2), good: [book.toFixed(2)] };
        } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var s3 = pickTri(r, r.pick(['int', 'scaled'])), nm = r.shuffle(r.pick(LETTERS)), at = r.pick(['A', 'B']), sw = r.chance(0.5), legs = sw ? [s3[1], s3[0]] : [s3[0], s3[1]];
          var s = { opp: legs[0], adj: legs[1], hyp: s3[2] }, V = at === 'A' ? nm[0] : nm[1];
          var F = fig(r, { th: Math.atan2(s.opp, s.adj) / RAD, at: at, names: nm, ang: false, lab: { opp: N(s.opp), adj: N(s.adj), hyp: N(s.hyp) }, orient: r.pick(['std', 'turn']), width: 240 });
          var fr = function (a, b) { return t('\\dfrac{' + NT(a) + '}{' + NT(b) + '}'); };
          return P.mc(r, 'For ' + t('\\angle ' + V) + ', which ratio is ' + t('\\sin ' + V) + '?<br>' + F.svg, [
            { html: fr(s.opp, s.hyp), right: true },
            { html: fr(s.adj, s.hyp), why: N(s.adj) + ' touches ' + t('\\angle ' + V) + ': it is the adj. That is adj over hyp (the cosine). Sine uses the side <b>across</b> from ' + t('\\angle ' + V) + '.', code: 'u7l5-frac-adj' },
            { html: fr(s.opp, s.adj), why: 'That is opp over adj (the tangent). Sine is opp over <b>hyp</b>.', code: 'u7l5-frac-tan' },
            { html: fr(s.hyp, s.opp), why: 'Upside down: the hyp goes on the bottom. A sine is never more than 1.', code: 'u7l5-frac-upside' }],
            'opp = ' + N(s.opp) + ' (across from ' + t('\\angle ' + V) + '), hyp = ' + N(s.hyp) + ' (across from the right angle).<br>' + t('\\sin ' + V + '=' + '\\dfrac{' + NT(s.opp) + '}{' + NT(s.hyp) + '}'), ['Find the side across from ' + t('\\angle ' + V) + ' and the side across from the right angle.'], 'which ratio');
        } }] },
      { num: '16', outcome: 'A1', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var z = find(function () { return { o: r.int(4, 12), th: r.int(25, 65) }; }, function (z) { return !excluded(EX_HYP, z.th, z.o) && z.th !== 30; }, { o: 7, th: 36 });
          return eqnMC(r, 'sin', z.th, z.o, 'hyp', 'A right triangle has an opposite side of ' + z.o + ' cm and a ' + z.th + '° angle. Which equation gives the hypotenuse ' + t('h') + '?', 'h', 'cm', 'which equation');
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          var d = find(function () { return r.int(15, 75); }, function (x) { return Math.abs(Math.sin(x) - TR.sin(x)) > 0.25; }, 30);
          return radMC(r, 'sin', d, r.pick(['Jaden', 'Owen', 'Liam', 'Ethan']), 'RAD mode');
        } }] },
      { num: '18', outcome: 'A1', stem: '', parts: [
        { id: '18', level: 'PRG', make: function (r) {
          var z = find(function () { var h = oneDec(r, 1.0, 2.6), th = r.int(6, 14); return { h: h, th: th, v: h / TR.sin(th) }; }, function (z) { return clean(z.v) && z.v < 99 && !(same(z.h, 1.8) && z.th === 9); }, { h: 1.8, th: 9, v: 1.8 / TR.sin(9) });
          return sidePart('sin', z.th, z.h, 'hyp', { unit: 'm', nr: true, x: 'r', prompt: '<b>Numerical response.</b> A boat-launch ramp rises ' + N(z.h) + ' m from the water to the parking lot. The ramp makes a ' + z.th + '° angle with the horizontal. The length of the ramp surface, to the nearest tenth of a metre, is ____ m.',
            sol0: ['The rise is the opp; the ramp ' + t('r') + ' is the hyp.'], words: 'The ramp is about # long.', text: 'NR boat ramp' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'The same triangle is shown in each part. Label each side opp, adj or hyp.',
        shared: function (r) { return { nm: r.shuffle(r.pick(LETTERS)), th: r.int(30, 40), seed: r.int(1, 1e6) }; },
        parts: [
          { id: 'x1a', sub: 'a', level: 'BEG', make: function (r, sh) { return labelPart(HW.rng(sh.seed), { names: sh.nm, at: 'A', th: sh.th, orient: 'std', ask: 'vertex', prompt: '(a) Label each side for ' + t('\\angle ' + sh.nm[0]) + '.' }); } },
          { id: 'x1b', sub: 'b', level: 'EMG', make: function (r, sh) { return labelPart(HW.rng(sh.seed), { names: sh.nm, at: 'B', th: 90 - sh.th, orient: 'std', ask: 'vertex', prompt: '(b) The same triangle. Now label each side for ' + t('\\angle ' + sh.nm[1]) + '.' }); } }] },
      { num: '2', section: 'A. Skills', stem: 'Write sin θ as a fraction and as a decimal.', parts: [
        { id: 'x2a', sub: 'a', level: 'BEG', make: function (r) { return fracPart(r, 'sin', { kind: r.pick(['int', 'scaled']), unit: 'cm', orient: 'std', prompt: '' }); } },
        { id: 'x2b', sub: 'b', level: 'EMG', make: function (r) { return fracPart(r, 'sin', { kind: 'dec', unit: 'm', orient: 'turn', prompt: '' }); } }] },
      { num: '3', section: 'A. Skills', stem: 'Use your calculator in DEG mode.',
        shared: function (r) { var a = find(function () { return r.shuffle([r.int(6, 15), r.int(36, 48), r.int(58, 68), r.int(80, 87)]); }, function (a) { return a.every(function (d) { return EX_ANG.indexOf(d) < 0; }); }, [64, 8, 86, 41]); return { a: a }; },
        parts: [
          { id: 'x3a', sub: 'a–d', level: 'BEG', make: function (r, sh) { return valuesPart('sin', sh.a, { prompt: 'Find each value to 4 decimal places.' }); } },
          { id: 'x3e', sub: 'order', level: 'EMG', make: function (r, sh) {
            var srt = sh.a.slice().sort(function (x, y) { return x - y; });
            return P.order(r, 'List the four angles in order from the smallest sine to the largest.', srt.map(function (d) { return { id: 'a' + d, tex: deg(d) }; }), { first: 'smallest sine', last: 'largest sine', why: function () { return 'Compare the four sine values you found. (For acute angles, the bigger the angle, the bigger the sine.)'; } },
              steps([srt.map(function (d) { return t('\\sin ' + deg(d) + '\\approx ' + f4(TR.sin(d))); }).join(', '), 'Order: ' + srt.map(function (d) { return d + '°'; }).join(', ') + ' — the order of the angles, because the sine gets bigger as the angle gets bigger.']),
              ['Use the four values you found.'], 'order sines');
          } }] },
      { num: '4', section: 'A. Skills', stem: 'Find x. Round to the nearest tenth.', parts: [
        { id: 'x4a', sub: 'a', level: 'BEG', make: function (r) { var z = oppNums(r, 32, 46, function () { return r.int(12, 25); }); return sideFigPart(r, 'sin', z.th, z.s, 'opp', { unit: 'cm', orient: 'std', text: 'opp from hyp' }); } },
        { id: 'x4b', sub: 'b', level: 'BEG', make: function (r) { var z = oppNums(r, 64, 78, function () { return oneDec(r, 3.2, 8.4); }); return sideFigPart(r, 'sin', z.th, z.s, 'opp', { unit: 'm', orient: 'turn', text: 'opp from hyp' }); } },
        { id: 'x4c', sub: 'c', outcome: 'A1', level: 'EMG', make: function (r) { var z = hypNums(r, 36, 48, function () { return oneDec(r, 4.5, 9.5); }); return sideFigPart(r, 'sin', z.th, z.s, 'hyp', { unit: 'cm', orient: 'turn', text: 'hyp from opp' }); } },
        { id: 'x4d', sub: 'd', outcome: 'A1', level: 'EMG', make: function (r) { var z = hypNums(r, 12, 18, function () { return oneDec(r, 1.4, 3.6); }); return sideFigPart(r, 'sin', z.th, z.s, 'hyp', { unit: 'm', orient: 'any', draw: 24, note: 'Not drawn to scale.', text: 'hyp from opp' }); } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [
        { id: 'x5', level: 'PRG', make: function (r) {
          var z = find(function () { var L = 10 * r.int(90, 180), th = r.int(15, 28); return { L: L, th: th, v: L * TR.sin(th) }; }, function (z) { return clean(z.v) && !(z.L === 1450 && z.th === 21); }, { L: 1450, th: 21, v: 1450 * TR.sin(21) });
          return sidePart('sin', z.th, z.L, 'opp', { unit: 'm', prompt: 'A chairlift cable at a ski hill in the Rockies is ' + N(z.L) + ' m long. It climbs at an average angle of ' + z.th + '°. How much higher is the top station than the bottom station? Round to the nearest tenth of a metre.',
            sol0: [fig(r, { th: z.th, lab: { hyp: N(z.L) + ' m', opp: 'rise' }, ang: z.th + '°', at: 'A', orient: 'std', width: 230 }).svg, 'The cable is the hyp; the vertical rise is the opp.'], x: '\\text{rise}', words: 'The top station is about # higher.', text: 'chairlift' });
        } }] },
      { num: '6', section: 'B. Applying', outcome: 'A1', stem: '', parts: [
        { id: 'x6', level: 'EMG', make: function (r) {
          var h = find(function () { return oneDec(r, 3.6, 7.4); }, function (h) { return !same(h, 5.4); }, 4.8), v = 2 * h;
          return sidePart('sin', 30, h, 'hyp', { unit: 'm', prompt: 'An escalator in a Calgary mall climbs ' + N(h) + ' m from one floor to the next. It makes a 30° angle with the floor. How long is the escalator? Find the answer in your head first using ' + t('\\sin 30^\\circ=0.5') + ', then check with your calculator.',
            sol0: ['The rise is the opp; the escalator ' + t('e') + ' is the hyp.', 'In your head: at 30° the opp is half the hyp, so the hyp is double the opp: ' + t('2\\times ' + NT(h) + '=' + NT(q(v))) + ' m.'], x: 'e', check: false, words: 'The escalator is # long.',
            hints: ['At 30°, the opp is half of the hyp. So the hyp is double the opp.', 'Check: ' + N(h) + ' ÷ sin 30 ) ENTER.'], text: 'escalator' });
        } }] },
      { num: '7', section: 'B. Applying', stem: '', parts: [
        { id: 'x7', level: 'EMG', make: function (r) {
          var z = find(function () { var L = 10 * r.int(10, 25), th = r.int(8, 20); return { L: L, th: th, v: L * TR.sin(th) }; }, function (z) { return clean(z.v) && !(z.L === 150 && z.th === 12); }, { L: 150, th: 12, v: 150 * TR.sin(12) });
          return sidePart('sin', z.th, z.L, 'opp', { unit: 'm', prompt: 'A survey drone flies ' + z.L + ' m in a straight line from its launch pad, climbing at ' + z.th + '° above the horizontal. How high above the launch pad is it? Round to the nearest tenth of a metre.',
            sol0: ['The flight path is the hyp; the height is the opp.'], words: 'The drone is about # above the pad.', text: 'drone' });
        } }] },
      { num: '8', section: 'B. Applying', outcome: 'A1', stem: '', parts: [
        { id: 'x8', level: 'PRG', make: function (r) {
          var z = find(function () { var h = oneDec(r, 1.2, 1.9), th = r.int(9, 14); return { h: h, th: th, v: h / TR.sin(th) }; }, function (z) { return clean(z.v) && !(same(z.h, 1.6) && z.th === 11); }, { h: 1.6, th: 11, v: 1.6 / TR.sin(11) });
          return sidePart('sin', z.th, z.h, 'hyp', { unit: 'm', x: 'd', prompt: 'The deck of a tilting tow truck tips down until its back end touches the road. The front end of the deck is then ' + N(z.h) + ' m above the road, and the deck makes a ' + z.th + '° angle with the road. How long is the deck? Round to the nearest tenth of a metre.',
            sol0: ['The ' + N(z.h) + ' m height is the opp; the deck ' + t('d') + ' is the hyp.'], words: 'The deck is about # long.', text: 'tow truck' });
        } }] },
      { num: '9', section: 'B. Applying', stem: '', parts: [
        { id: 'x9', level: 'EMG', make: function (r) {
          var z = find(function () { return { H: r.int(8, 16), th: r.int(50, 62) }; }, function (z) { var v = [z.H * TR.sin(z.th), z.H * TR.cos(z.th), z.H / TR.sin(z.th), TR.sin(z.th)].map(f1); return !(z.H === 10 && z.th === 53) && v.every(function (x, i) { return v.indexOf(x) === i; }) && clean(z.H * TR.sin(z.th)); }, { H: 10, th: 53 });
          var s = z.H * TR.sin(z.th);
          return P.mc(r, 'A right triangle has a hypotenuse of ' + z.H + ' cm and a ' + z.th + '° angle. Which is the length of the side opposite the ' + z.th + '° angle, to the nearest tenth?', [
            { html: f1(s) + ' cm', right: true },
            { html: f1(z.H * TR.cos(z.th)) + ' cm', why: 'That is the adjacent side (' + z.H + ' × cos ' + z.th + '°). The side across from the angle uses sine.', code: 'trig-wrong-ratio' },
            { html: f1(z.H / TR.sin(z.th)) + ' cm', why: 'That divides, and it is longer than the hyp. The unknown opp is on top: multiply.', code: 'trig-mul-div' },
            { html: f1(TR.sin(z.th)) + ' cm', why: 'That is just sin ' + z.th + '°. Multiply it by the hyp, ' + z.H + ' cm.', code: 'u7l5-sin-only' }],
            t(z.H + '\\times\\sin ' + deg(z.th) + '=' + dots(s) + '\\approx ' + f1(s)) + ' cm', ['opp = hyp × sin θ.'], 'opp MC');
        } }] },
      { num: '10', section: 'B. Applying', stem: '', parts: [
        { id: 'x10', level: 'PRG', make: function (r) {
          var z = find(function () { var L = oneDec(r, 24, 32), th = r.int(55, 72), b = oneDec(r, 2, 3.5); return { L: L, th: th, b: b, v: L * TR.sin(th) + b }; }, function (z) { return clean(z.v) && z.v < 99.9 && !(same(z.L, 30.5) && z.th === 64); }, { L: 30.5, th: 64, b: 2.8, v: 30.5 * TR.sin(64) + 2.8 });
          return addedPart('<b>Numerical response.</b> A fire truck’s ladder is ' + N(z.L) + ' m long. It is raised to ' + z.th + '° from the horizontal, and its bottom end turns on a pivot ' + N(z.b) + ' m above the ground. The height of the top of the ladder above the ground, to the nearest tenth of a metre, is ____ m.',
            'sin', z.th, z.L, z.b, { nr: true, sol0: ['The ladder is the hyp; its height above the pivot is the opp.'], noBase: 'That is the height above the pivot. Add the ' + N(z.b) + ' m pivot height.', text: 'NR fire ladder' });
        } }] },
      { num: '11', section: 'C. Stretch', stem: function (sh) { return 'A bush plane leaves Fort McMurray and flies ' + sh.d + ' km in a straight line. Its path makes a ' + sh.th + '° angle with the line pointing due north, toward the east. Sketch a right triangle with one leg pointing north and one pointing east.'; },
        shared: function (r) { return find(function () { return { d: 5 * r.int(8, 24), th: r.int(15, 40) }; }, function (z) { return clean(z.d * TR.sin(z.th)) && !(z.d === 60 && z.th === 25) && z.th !== 30; }, { d: 60, th: 25 }); },
        parts: [
          { id: 'x11a', sub: 'a', level: 'ADV', make: function (r, sh) {
            var sk = G.rightTriSVG({ c: 1, A: 90 - sh.th, right: 'tl', theta: 'B', angles: { B: sh.th + '°' }, sides: { c: sh.d + ' km', a: 'north', b: 'east = x' }, names: ['', 'Fort McMurray', ''], width: 250 });
            return sidePart('sin', sh.th, sh.d, 'opp', { unit: 'km', prompt: '(a) How far east of Fort McMurray is the plane? Round to the nearest tenth of a kilometre.',
              alts: [{ v: sh.d * TR.cos(sh.th), code: 'u7l5-north', hint: 'That is how far <b>north</b> the plane went (next to the ' + sh.th + '° angle). The east distance is across from the angle: sine.' }],
              sol0: [sk, 'The path is the hyp (' + sh.d + ' km). The east distance is across from the ' + sh.th + '° angle (between north and the path), so it is the opp.'], x: 'x', words: 'The plane is about # east of Fort McMurray.', text: 'bush plane' });
          } },
          { id: 'x11b', sub: 'b', level: 'PRG', make: function (r, sh) {
            return P.mc(r, '(b) Why does the sine ratio work here?', [
              { html: 'The path is the hypotenuse, and the east distance is across from the ' + sh.th + '° angle: opp and hyp, so SOH.', right: true },
              { html: 'The east distance touches the ' + sh.th + '° angle, so it is the adj.', why: 'The angle is between the north line and the path. The east leg does not touch it: it is across from it.', code: 'u7l5-label-swap' },
              { html: 'Sine always works for distances on a map.', why: 'The ratio depends on which sides you have: here the hyp (the path) and the side across from the angle (east).', code: 'u7l5-always' },
              { html: 'The plane flies north, so the north leg is the hypotenuse.', why: 'The hypotenuse is the path itself, across from the right angle between north and east.', code: 'u7l5-label-hyp' }],
              'The right angle is between the north leg and the east leg, so the path (' + sh.d + ' km) is the hyp. The ' + sh.th + '° angle is at Fort McMurray, between north and the path; the east leg is across from it (opp). opp and hyp → sine.', ['Where is the right angle? Which side is across from the ' + sh.th + '° angle?'], 'why sine');
          } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'A right triangle has an opposite side of ' + N(sh.o).replace(/^(\d+)$/, '$1.0') + ' cm and a ' + sh.th + '° angle.'; },
        shared: function (r) { return find(function () { var o = oneDec(r, 6, 12), th = r.int(30, 50); return { o: o, th: th }; }, function (z) { var h = z.o / TR.sin(z.th), a = Math.sqrt(h * h - z.o * z.o); return clean(h) && clean(a) && !(same(z.o, 9) && z.th === 37) && z.th !== 30 && z.th !== 45 && !same(rd(Math.sqrt(rd(h, 1) * rd(h, 1) - z.o * z.o), 1), rd(a, 1)); }, { o: 9, th: 37 }); },
        parts: [
          { id: 'x12a', sub: 'a', outcome: 'A1', level: 'PRG', make: function (r, sh) { return sidePart('sin', sh.th, sh.o, 'hyp', { unit: 'cm', x: 'h', prompt: '(a) Find the hypotenuse. Round to the nearest tenth.', text: 'hyp then Pythagoras' }); } },
          { id: 'x12b', sub: 'b', outcome: 'G2', level: 'MAS', make: function (r, sh) {
            var h = sh.o / TR.sin(sh.th), a = Math.sqrt(h * h - sh.o * sh.o), key = f1(a), hr = rd(h, 1), ar = Math.sqrt(hr * hr - sh.o * sh.o);
            var c = G.lenChk(a, { unit: 'cm', pyth: { hyp: h, leg: sh.o }, radTrap: false, early: false, alts: [{ v: sh.o * TR.tan(sh.th), code: 'trig-wrong-ratio', hint: 'That is opp × tan θ. Use the Pythagorean theorem: adj² = hyp² − opp².' }] });
            var check = function (resp) { var r0 = c(resp); if (r0.v === 'correct') return r0; var pv = HW.parse.number(readPlain(resp)); if (pv.ok && same(rd(pv.value, 1), rd(ar, 1))) return form('u7l5-pyth-rounded', 'Nearly! You used the rounded hypotenuse (' + f1(h) + '). Use the full calculator value from (a), ' + t(dots(h)) + ', and round only at the end.'); return r0; };
            return { prompt: '(b) Use the Pythagorean theorem to find the third side. Use the full calculator value from (a). Round to the nearest tenth.', input: { type: 'number', after: 'cm' }, check: check, key: key, answer: t(key) + ' cm',
              solution: steps([t('h=\\dfrac{' + NT(sh.o) + '}{\\sin ' + deg(sh.th) + '}=' + dots(h)) + ' (keep it in the calculator)', t('\\text{adj}^2=' + dots(h) + '^2-' + NT(sh.o) + '^2=' + dots(h * h, 2) + '-' + NT(q(sh.o * sh.o)) + '=' + dots(a * a, 2)), t('\\text{adj}=\\sqrt{' + dots(a * a, 2) + '}\\approx ' + key) + ' cm']),
              hints: ['The hyp is the longest side: adj² = hyp² − opp².', 'Use the unrounded hyp from (a) (press ANS or keep it on the screen).'], text: 'third side',
              bad: badList(key, [Math.sqrt(h * h + sh.o * sh.o), h * h - sh.o * sh.o, h - sh.o, ar]) };
          } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return sh.who + ' has a ' + N(sh.L).replace(/^(\d+)$/, '$1.0') + ' m ladder. He needs to reach a window ledge ' + N(sh.h) + ' m above the ground, with the ladder at the safe angle of 75°.'; },
        shared: function (r) {
          return find(function () { var L = oneDec(r, 3.5, 6.0), h = q(rd(L * TR.sin(75), 1) + r.pick([-0.3, -0.2, -0.1, 0.1, 0.2])); return { L: L, h: h, who: r.pick(['Arjun', 'Tyler', 'Ravi', 'Cole']) }; },
            function (z) { var m = z.h / TR.sin(75), hd = Math.round((m * 100) % 10); return !(same(z.L, 4) && same(z.h, 3.7)) && Math.abs(z.L * TR.sin(75) - z.h) > 0.04 && hd >= 1 && hd <= 4 && !same(Math.ceil(m * 10 - 1e-9) / 10, z.L); }, { L: 4, h: 3.7, who: 'Arjun' });
        },
        parts: [
          { id: 'x13a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var reach = sh.L * TR.sin(75), yes = reach > sh.h, rS = f2(reach);
            return P.mc(r, '(a) Will his ladder reach?', [
              { html: (yes ? '<b>Yes</b>: ' : '<b>No</b>: ') + t(NT(sh.L) + '\\times\\sin 75^\\circ\\approx ' + rS) + ' m, which is ' + (yes ? 'more' : 'less') + ' than ' + N(sh.h) + ' m.', right: true },
              { html: (yes ? '<b>No</b>: ' : '<b>Yes</b>: ') + t(NT(sh.L) + '\\times\\sin 75^\\circ\\approx ' + rS) + ' m, which is ' + (yes ? 'more' : 'less') + ' than ' + N(sh.h) + ' m.', why: 'Compare again: the ladder reaches ' + rS + ' m and the ledge is at ' + N(sh.h) + ' m.', code: 'u7l5-compare' },
              { html: '<b>Yes</b>: the ladder is ' + N(sh.L) + ' m long and the ledge is only ' + N(sh.h) + ' m high.', why: 'A leaning ladder reaches less high than its length. Find the height: ladder × sin 75°.', code: 'u7l5-length' },
              { html: (sh.L * TR.cos(75) > sh.h ? '<b>Yes</b>: ' : '<b>No</b>: ') + t(NT(sh.L) + '\\times\\cos 75^\\circ\\approx ' + f2(sh.L * TR.cos(75))) + ' m.', why: 'That is how far the foot is from the wall (adjacent). The height is across from the 75° angle: sine.', code: 'trig-wrong-ratio' }],
              steps(['The ladder is the hyp; the height it reaches is the opp.', t(NT(sh.L) + '\\times\\sin 75^\\circ=' + dots(reach, 4)) + ' m', rS + ' m ' + (yes ? '&gt;' : '&lt;') + ' ' + N(sh.h) + ' m, so ' + (yes ? 'yes, it reaches.' : 'no, it does not reach.')]),
              ['Find how high the ladder reaches: ladder × sin 75°. Compare with ' + N(sh.h) + ' m.'], 'will it reach');
          } },
          { id: 'x13b', sub: 'b', outcome: 'A1', level: 'MAS', make: function (r, sh) {
            var m = sh.h / TR.sin(75), up = Math.ceil(m * 10 - 1e-9) / 10, dn = rd(m, 1), key = up.toFixed(1);
            var near = K.near(up, 1, { unit: 'm', alts: [{ v: dn, code: 'u7l5-round-down', hint: 'A ' + dn.toFixed(1) + ' m ladder reaches only ' + f2(dn * TR.sin(75)) + ' m at 75°, a little short of ' + N(sh.h) + ' m. Here you must round <b>up</b>.' },
              { v: sh.h * TR.sin(75), code: 'trig-mul-div', hint: 'The ladder (hyp) is the unknown, on the bottom of ' + t('\\sin 75^\\circ=\\dfrac{' + NT(sh.h) + '}{L}') + ': divide.' }, { v: sh.h / TR.cos(75), code: 'trig-wrong-ratio', hint: 'The ledge height is across from the 75° angle: sine, not cosine.' }, { v: sh.h / TRR.sin(75), code: 'trig-rad', hint: G.RAD_HINT }] });
            var check = function (resp) {
              var s = readPlain(resp), pv = HW.parse.number(s);
              if (pv.ok && decsOf(s) > 1 && Math.abs(pv.value - m) < 0.006) return form('round', 'Right — now give it to the nearest tenth of a metre. Think: which way must you round so the ladder still reaches?');
              return near(resp);
            };
            return { prompt: '(b) What is the shortest ladder that would reach the ledge at 75°? Give the answer to the nearest tenth of a metre (think about which way to round).', input: { type: 'number', after: 'm' }, check: check, key: key, answer: t(key) + ' m',
              solution: steps(['The ladder ' + t('L') + ' is the hyp; the ledge height ' + N(sh.h) + ' m is the opp.', t('L=\\dfrac{' + NT(sh.h) + '}{\\sin 75^\\circ}=' + dots(m)) + ' m', 'Round <b>up</b> to ' + key + ' m: a ' + dn.toFixed(1) + ' m ladder would be a little too short.']),
              hints: ['hyp = opp ÷ sin 75°.', 'A ladder that is a little too short will not reach. Which way should you round?'], text: 'shortest ladder', bad: [dn.toFixed(1), f1(sh.h * TR.sin(75))].filter(function (b) { return b !== key; }) };
          } }] }
    ]
  });
})(window);
