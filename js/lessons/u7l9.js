/* Math 10-3 · Unit 7 · Lesson 9 — Solving Right Triangles: Choosing the Right Ratio (G2 / G4 per part)
 * Assignment 9 (u7_l09.tex, Questions 1–18) and the Lesson 9 Extra Practice (u7_ep09.tex: A 1–5, B 6–11, C 12–13).
 * Every part is a generator: the booklet situation and difficulty with new numbers around the booklet's (the worked
 * examples' numbers — 5-12-13, 35° and 20 m, 4 and 7, 62°, 38° and 14.5 m, 7.2 and 9.6, the 4.8° ramp with 0.6 m, the
 * 24 ft ladder 6 ft out, the drone at 45 m / 34° / 52°, the 7.2 m garage at 24° — are left out).
 * Outcomes per part: G2 for the Pythagorean theorem (a hypotenuse, a leg, a diagonal); G4 for the trig ratios, the
 * inverse ratios, the other acute angle, choosing a tool and the reasonableness checks.
 * Conventions as in the booklet: right angle at C, a = BC is opposite ∠A, b = AC is opposite ∠B, c = AB; lengths to the
 * nearest tenth and angles to the nearest degree unless a question says otherwise; keep the full calculator value.
 * Conversions for answering on screen:
 *   Q1 "write the tool" table → a tap table (8 tools × 7 rows; the rows are drawn from 12 situations and shuffled);
 *   "name the tool and write the equation, then find x" → a typed tool (Pythagoras, sine, inverse tangent… any
 *     reasonable spelling: sin, SOH, tan⁻¹, arctan, 2nd tan, 90 − angle) and the value; the equation is in the solution;
 *   "solve the triangle" → one box per missing side/angle (the Pythagoras side and the angles are separate parts so each
 *     carries its own outcome); "sketch and label the triangle" → choose the correctly labelled sketch;
 *   "which triangle first? why?", "is it reasonable? explain", "how can you tell… without a calculator" → multiple
 *     choice of reasons; "is it within the guidance?" → a yes/no box beside the number.
 * Hints aimed at real mistakes (HW.geo.lenChk / angleRatioChk): RAD mode, × instead of ÷ when the unknown is on the
 * bottom, the wrong ratio (a leave-one-out reminder), no inverse key, the other acute angle, no square root, adding the
 * squares for a leg, the hypotenuse used as a leg; here: the wrong tool, the full width instead of half, adding instead
 * of subtracting the two distances, subtracting the angles before taking tan, the answer left in metres. Rounding a
 * carried value (BD, the floor diagonal, θ) too early gets a nudge that doesn't use a try.
 * Exports HW.u7solve (tool checker, tool table, small figure and number helpers) for later Unit 7 files. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P;
  var RAD = Math.PI / 180;
  var S = HW.u7solve = {};

  /* ================= numbers and words ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp == null ? 1 : dp); }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function N(x) { return HW.fmt(String(q(x))); }
  function dg(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dg(x)); }
  function fx(x, dp) { dp = dp == null ? 1 : dp; return HW.fmt(rd(x, dp).toFixed(dp)); }
  function rawN(x) { var s = +x.toFixed(3); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toN(x, dp) { dp = dp == null ? 1 : dp; return near(x, rd(x, dp), 1e-9) ? '=' + fx(x, dp) : '=' + rawN(x) + '\\approx ' + fx(x, dp); }
  function L(x, u) { return t(N(x) + (u ? '\\text{ ' + u + '}' : '')); }
  function lab(x, u) { return String(q(x)) + (u ? ' ' + u : ''); }
  function key(x, dp) { return rd(x, dp == null ? 1 : dp).toFixed(dp == null ? 1 : dp); }
  /* not within 0.08 of a rounding boundary, so a slightly different right method can't round the other way */
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7l9: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function pickR(r, a, b, st) { st = st || 1; return q(a + st * r.int(0, Math.round((b - a) / st))); }
  function intNot(r, a, b, not) { return find(function () { return r.int(a, b); }, function (v) { return (not || []).indexOf(v) < 0; }, a); }
  var TR = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var INV = { sin: function (v) { return Math.asin(v) / RAD; }, cos: function (v) { return Math.acos(v) / RAD; }, tan: function (v) { return Math.atan(v) / RAD; } };
  var MN = { sin: 'SOH', cos: 'CAH', tan: 'TOA' }, NOSIDE = { sin: 'adj', cos: 'opp', tan: 'hyp' };
  function fnT(fn, deg) { return '\\' + fn + ' ' + dg(deg); }
  function fr(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }
  var NAMES = ['Amara', 'Kai', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Devon', 'Rosa', 'Theo', 'Aisha', 'Maya', 'Dani', 'Kenji', 'Sofia', 'Omar', 'Tyler', 'Jaya', 'Reid', 'Tess'];
  var HE = { Amara: 'she', Noor: 'she', Priya: 'she', Kayla: 'she', Hana: 'she', Rosa: 'she', Aisha: 'she', Maya: 'she', Dani: 'she', Sofia: 'she', Jaya: 'she', Tess: 'she' };
  function he(n) { return HE[n] || 'he'; }
  function his(n) { return HE[n] ? 'her' : 'his'; }
  Object.assign(S, { q: q, rd: rd, near: near, N: N, dg: dg, D: D, fx: fx, rawN: rawN, toN: toN, L: L, lab: lab, key: key, safe: safe, find: find, br: br, pickR: pickR, intNot: intNot, TR: TR, INV: INV, MN: MN, fnT: fnT, fr: fr, NAMES: NAMES, he: he, his: his });

  /* a nudge (no try) when the answer is what you get from a carried value rounded too early */
  function early(chk, vals, dp, hint) {
    dp = dp == null ? 1 : dp;
    return function (resp) {
      var res = chk(resp); if (res.v === 'correct') return res;
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/^\s*[A-Za-z∠\\angle ]{0,8}=\s*/, '').replace(/\^\{?\\circ\}?|°|\\circ/g, '').replace(/\s*[a-zA-Z]+\.?\s*$/, '').trim();
      var p = HW.parse.number(s);
      if (p.ok) for (var i = 0; i < vals.length; i++) if (isFinite(vals[i]) && Math.abs(rd(p.value, dp) - rd(vals[i], dp)) < 1e-9) return form('u7l9-early', hint || 'Nearly! You rounded a value too early. Keep the <b>full</b> calculator value until the last step.');
      return res;
    };
  }
  S.early = early;

  /* ================= the tools ================= */
  var TOOLS = ['pyth', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'comp'];
  var TOOL_WORD = { pyth: 'Pythagoras', sin: 'sine', cos: 'cosine', tan: 'tangent', asin: 'inverse sine', acos: 'inverse cosine', atan: 'inverse tangent', comp: '90° − angle' };
  var TOOL_COL = { pyth: 'Pythag&shy;oras', sin: 'sin', cos: 'cos', tan: 'tan', asin: 'sin⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹', comp: '90° −<br>angle' };
  /* a typed tool name → its id (null: not a tool name) */
  function toolOf(resp) {
    var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/\\/g, '').replace(/\s+/g, ' ').trim();
    if (!s) return { empty: true };
    if (/p[iy]?th|pythag|pyt|pith|a\s*\^?\s*2\s*\+\s*b|a²/.test(s)) return { id: 'pyth' };
    if (/90|complement|subtract|minus/.test(s)) return { id: 'comp' };
    var fn = /cos|cah|co-?sine/.test(s) ? 'cos' : /tan|toa/.test(s) ? 'tan' : /sin|soh|sign|sine/.test(s) ? 'sin' : null;
    if (!fn) return { none: true };
    var inv = /inv|\^\s*\{?\s*-\s*1|⁻¹|-\s*1|arc|2nd|second|reverse|opposite key/.test(s);
    return { id: inv ? 'a' + fn : fn };
  }
  /* the hint for typing tool `got` when `want` is right */
  function toolWhy(want, got) {
    var trigSide = ['sin', 'cos', 'tan'].indexOf(want) >= 0, trigAng = ['asin', 'acos', 'atan'].indexOf(want) >= 0;
    if (want === 'pyth') return got === 'comp' ? 'You want a <b>side</b>, not an angle.' : 'No angle is given or wanted: two sides and the third side → <b>Pythagoras</b>.';
    if (want === 'comp') return 'You know one acute angle and want the other: they add to 90°, so just subtract from 90°.';
    if (got === 'pyth') return 'Pythagoras needs <b>two</b> sides. Here an angle is involved, so use a trig ratio.';
    if (got === 'comp') return trigSide ? 'You want a <b>side</b>: use a trig ratio with the angle and the side you know.' : 'You know two sides, not an angle: use an inverse ratio.';
    if (trigSide && got.charAt(0) === 'a') return 'You want a <b>side</b>, so use the ratio itself (' + want + '), not the inverse key. The inverse key gives an angle.';
    if (trigAng && got.charAt(0) !== 'a') return 'You want an <b>angle</b>, so use the <b>inverse</b> key (2nd then ' + want.slice(1) + '): ' + TOOL_WORD[want] + '.';
    var fn = want.replace(/^a/, '');
    return 'Leave one out: the side you don’t know and don’t want is the <b>' + NOSIDE[fn] + '</b>, so it is ' + MN[fn] + ': <b>' + TOOL_WORD[want] + '</b>.';
  }
  function toolChk(want) {
    return function (resp) {
      var g = toolOf(resp);
      if (g.empty) return form('empty', 'Type the tool: Pythagoras, sine, cosine, tangent, inverse sine/cosine/tangent, or 90° − angle.');
      if (g.none) return form('u7l9-tool-word', 'Type one of the tools: Pythagoras, sine, cosine, tangent, inverse sine, inverse cosine, inverse tangent, or 90 − angle.');
      if (g.id === want) return ok();
      return wrong('u7l9-tool-' + g.id, toolWhy(want, g.id));
    };
  }
  Object.assign(S, { TOOLS: TOOLS, TOOL_WORD: TOOL_WORD, TOOL_COL: TOOL_COL, toolOf: toolOf, toolWhy: toolWhy, toolChk: toolChk });

  /* ================= figures ================= */
  function tri(o) { return G.rightTriSVG(Object.assign({ names: false, width: 250, px: 170 }, o)); }
  function row(items, w) {
    return '<div style="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;margin:6px 0">' + items.map(function (it) {
      return '<div style="flex:0 1 ' + (w || 150) + 'px;min-width:' + Math.round((w || 150) * 0.7) + 'px;text-align:center">' + it[0] + (it[1] ? '<div style="font-weight:600;margin-top:2px">' + it[1] + '</div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  Object.assign(S, { tri: tri, row: row });

  /* the typed tool and the value in one part */
  function toolVal(prompt, tool, chk, keyV, ansTex, unit, sol, hints, txt) {
    var ang = unit === '°';
    return P.fields(prompt, [{ label: 'Tool:', mode: 'text', name: 'Tool', placeholder: 'e.g. sine', wide: true }, { label: t('x='), after: ang ? '°' : (unit || ''), name: 'x' }],
      [toolChk(tool), chk], [TOOL_WORD[tool], keyV], 'Tool: <b>' + TOOL_WORD[tool] + '</b>; ' + ansTex, sol, hints, txt);
  }
  S.toolVal = toolVal;
  /* the other acute angle, typed */
  function compChk(want, given, gName) {
    return G.angleChk(want, { supplementTrap: false, alts: [{ v: given, code: 'u7l9-same-angle', hint: 'That is ' + gName + ', the angle you were given. The other acute angle is 90° − ' + gName + '.' }, { v: 180 - given, code: 'u7l9-180', hint: 'The <b>two acute</b> angles add to 90° (the right angle takes the other 90°). Subtract from 90°, not 180°.' }] });
  }
  S.compChk = compChk;
  function yesNo(want, why) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '');
      if (!s) return form('empty', 'Type yes or no.');
      var v = /^(y|yes|yeah|yep|true|itis|within)$/.test(s) ? 'yes' : /^(n|no|nope|false|itisnt|isnt|not|tooSteep|toosteep)$/.test(s) ? 'no' : null;
      if (!v) return form('u7l9-yesno', 'Type <b>yes</b> or <b>no</b>.');
      return v === want ? ok() : wrong('u7l9-yesno-' + v, why || null);
    };
  }
  S.yesNo = yesNo;

  /* the two-step checks used in the solutions */
  function checkPy(a, b, c) { return 'Check: ' + t(rawN(a) + '^2+' + rawN(b) + '^2\\approx ' + N(rd(a * a + b * b, 2)) + '\\approx ' + N(c) + '^2') + ' ✓'; }

  HW.addCodes({ 'u7l9-early': 'Rounded a carried value too early', 'u7l9-tool-word': 'Not a tool name', 'u7l9-same-angle': 'Gave the given angle for the other acute angle', 'u7l9-180': 'Subtracted from 180° for the other acute angle',
    'u7l9-tool-pyth': 'Chose Pythagoras', 'u7l9-tool-sin': 'Chose sine', 'u7l9-tool-cos': 'Chose cosine', 'u7l9-tool-tan': 'Chose tangent', 'u7l9-tool-asin': 'Chose inverse sine', 'u7l9-tool-acos': 'Chose inverse cosine', 'u7l9-tool-atan': 'Chose inverse tangent', 'u7l9-tool-comp': 'Chose 90° − angle',
    'u7l9-yesno': 'Not yes/no', 'u7l9-yesno-yes': 'Said yes', 'u7l9-yesno-no': 'Said no', 'u7l9-added': 'Added the two distances instead of subtracting', 'u7l9-one': 'Gave only one of the two distances', 'u7l9-tan-diff': 'Subtracted the angles before using tan',
    'u7l9-full-width': 'Used the full width instead of half', 'u7l9-half-top': 'Gave half the top angle', 'u7l9-metres': 'Left the answer in metres', 'u7l9-not-total': 'Forgot to add the hand height', 'u7l9-hand': 'Added the hand height to a horizontal distance',
    'u7l9-sub': 'Subtracted instead of adding', 'u7l9-mul': 'Multiplied instead of using the ratio' });

  /* ================= Q1: which tool? ================= */
  var SIT = [
    { know: 'the two legs', want: 'the hypotenuse', tool: 'pyth' },
    { know: 'one leg and the hypotenuse', want: 'the other leg', tool: 'pyth' },
    { know: 'an acute angle and the hypotenuse', want: 'the side opposite the angle', tool: 'sin' },
    { know: 'an acute angle and the side opposite it', want: 'the hypotenuse', tool: 'sin' },
    { know: 'an acute angle and the hypotenuse', want: 'the side adjacent to the angle', tool: 'cos' },
    { know: 'an acute angle and the side adjacent to it', want: 'the hypotenuse', tool: 'cos' },
    { know: 'an acute angle and the side adjacent to it', want: 'the side opposite the angle', tool: 'tan' },
    { know: 'an acute angle and the side opposite it', want: 'the side adjacent to the angle', tool: 'tan' },
    { know: 'the side opposite θ and the hypotenuse', want: 'the angle θ', tool: 'asin' },
    { know: 'the side adjacent to θ and the hypotenuse', want: 'the angle θ', tool: 'acos' },
    { know: 'the sides opposite and adjacent to θ', want: 'the angle θ', tool: 'atan' },
    { know: 'one acute angle', want: 'the other acute angle', tool: 'comp' }];
  function toolTablePart(r, prompt, n) {
    var pick = find(function () { return r.sample(SIT, n || 7); }, function (a) {
      var tl = a.map(function (s) { return s.tool; });
      return tl.indexOf('pyth') >= 0 && tl.indexOf('comp') >= 0 && tl.filter(function (x) { return /^a/.test(x); }).length >= 1 && ['sin', 'cos', 'tan'].every(function (f) { return tl.indexOf(f) >= 0 || tl.indexOf('a' + f) >= 0; });
    }, SIT.slice(0, n || 7));
    var LT = 'abcdefgh', rows = pick.map(function (s, i) { return { id: 'r' + i, html: '(' + LT[i] + ') know <b>' + s.know + '</b>; want <b>' + s.want + '</b>' }; });
    var want = {}; pick.forEach(function (s, i) { want['r' + i] = s.tool; });
    var cols = TOOLS.map(function (id) { return { id: id, html: TOOL_COL[id] }; });
    return P.grid(prompt, rows, cols, want, { rowHead: 'You know … you want …', why: function (row, got, w) { return { code: 'u7l9-tool-' + got, hint: '<b>' + rows[Number(row.slice(1))].html.replace(/ know.*/, '') + '</b> ' + toolWhy(w, got) }; } },
      pick.map(function (s, i) { var f = s.tool.replace(/^a/, ''); return '(' + LT[i] + ') ' + TOOL_WORD[s.tool] + (MN[f] ? ' (no ' + NOSIDE[f] + ' → ' + MN[f] + (f !== s.tool ? ', and you want an angle' : '') + ')' : s.tool === 'pyth' ? ' (two sides, no angle)' : ' (the acute angles add to 90°)'); }).join('<br>') +
      '<br>Leave one out: find the side you don’t know and don’t want. No hyp → TOA, no opp → CAH, no adj → SOH.',
      ['Two sides and no angle → Pythagoras. A side from an angle → sin, cos or tan. An angle from two sides → the inverse key.', 'Leave one out: no hyp → TOA, no opp → CAH, no adj → SOH.'], 'which tool table');
  }
  S.toolTablePart = toolTablePart;

  /* ================= shared part builders ================= */
  /* x = the hypotenuse from two legs (drawn), with the tool */
  function pythHypPart(p, qq, u, o) {
    o = o || {}; var c = Math.sqrt(p * p + qq * qq);
    var svg = tri({ a: p, b: qq, flip: o.flip, sides: { a: lab(p, u), b: lab(qq, u), c: 'x' }, unknown: 'c' });
    return toolVal((o.lead || 'Name the tool, then find <i>x</i> to the nearest tenth.') + svg, 'pyth', G.lenChk(c, { pyth: { legs: [p, qq] } }), key(c), t('x' + toN(c)) + ' ' + u, u,
      br(['Two sides known, want the third side → <b>Pythagoras</b>.', t('x^2=' + N(p) + '^2+' + N(qq) + '^2=' + N(q(p * p)) + '+' + N(q(qq * qq)) + '=' + N(q(p * p + qq * qq))), t('x=\\sqrt{' + N(q(p * p + qq * qq)) + '}' + toN(c)) + ' ' + u]),
      ['No angle is involved: two sides and the third side.', 'x is across from the right angle: add the squares, then take the square root.'], o.text || 'tool + hypotenuse');
  }
  /* x = a side from an angle and a side (drawn), with the tool. given/wanted roles from θ at A */
  function trigSidePart(deg, have, len, want, u, o) {
    o = o || {};
    var fn = [have, want].sort().join() === 'hyp,opp' ? 'sin' : [have, want].sort().join() === 'adj,hyp' ? 'cos' : 'tan';
    var top = { sin: 'opp', cos: 'adj', tan: 'opp' }[fn], op = want === top ? 'mul' : 'div';
    var sides = { opp: 'a', adj: 'b', hyp: 'c' }, sd = {}, spec = { A: deg, flip: o.flip };
    spec[sides[have]] = len; sd[sides[have]] = lab(len, u); sd[sides[want]] = 'x';
    var v = op === 'mul' ? len * TR[fn](deg) : len / TR[fn](deg);
    var svg = tri(Object.assign(spec, { sides: sd, angles: { A: deg + '°' }, unknown: sides[want] }));
    var eq = fnT(fn, deg) + '=' + (top === want ? fr('x', N(len)) : fr(N(len), 'x'));
    return toolVal((o.lead || 'Name the tool, then find <i>x</i> to the nearest tenth.') + svg, fn, G.lenChk(v, { trig: { fn: fn, deg: deg, side: len, op: op } }), key(v), t('x' + toN(v)) + ' ' + u, u,
      br(['From ' + D(deg) + ': ' + (want === 'hyp' ? 'x' : N(len) + ' ' + u) + ' is ' + (want === 'hyp' ? 'hyp' : have) + ' and ' + (want === 'hyp' ? N(len) + ' ' + u + ' is ' + have : 'x is ' + want) + '. No ' + NOSIDE[fn] + ' → ' + MN[fn] + ': <b>' + TOOL_WORD[fn] + '</b>.', t(eq),
        op === 'mul' ? 'x is on top: multiply. ' + t('x=' + N(len) + '\\times' + fnT(fn, deg) + toN(v)) + ' ' + u : 'x is on the bottom: divide. ' + t('x=' + N(len) + '\\div' + fnT(fn, deg) + toN(v)) + ' ' + u]),
      ['Label opp, adj and hyp from the angle. Which side do you not know and not want? Leave it out.', op === 'mul' ? 'x is on the top of the ratio: multiply.' : 'x is on the bottom of the ratio: divide (side ÷ ' + fn + ' θ).'], o.text || 'tool + side');
  }
  /* x = an angle from two sides (drawn), with the tool */
  function trigAnglePart(r1, v1, r2, v2, u, o) {
    o = o || {};
    var key2 = [r1, r2].sort().join(), fn = key2 === 'hyp,opp' ? 'sin' : key2 === 'adj,hyp' ? 'cos' : 'tan';
    var num = fn === 'cos' ? (r1 === 'adj' ? v1 : v2) : (r1 === 'opp' ? v1 : v2), den = fn === 'tan' ? (r1 === 'adj' ? v1 : v2) : (r1 === 'hyp' ? v1 : v2);
    var deg = INV[fn](num / den), sides = { opp: 'a', adj: 'b', hyp: 'c' }, spec = { flip: o.flip }, sd = {};
    spec[sides[r1]] = v1; spec[sides[r2]] = v2; sd[sides[r1]] = lab(v1, u); sd[sides[r2]] = lab(v2, u);
    var svg = tri(Object.assign(spec, { sides: sd, angles: { A: 'x' } }));
    var tool = 'a' + fn;
    return toolVal((o.lead || 'Name the tool, then find the angle <i>x</i> to the nearest degree.') + svg, tool, G.angleRatioChk(deg, { ratio: { fn: fn, num: num, den: den } }), key(deg, 0), t('x' + toN(deg, 0).replace(/(\d)$/, '$1^\\circ')), '°',
      br(['From x: ' + N(num) + ' ' + u + ' is ' + (fn === 'cos' ? 'adj' : 'opp') + ' and ' + N(den) + ' ' + u + ' is ' + (fn === 'tan' ? 'adj' : 'hyp') + '. No ' + NOSIDE[fn] + ' → ' + MN[fn] + ', and you want an angle: <b>' + TOOL_WORD[tool] + '</b>.',
        t('\\' + fn + ' x=' + fr(N(num), N(den))), t('x=\\' + fn + '^{-1}\\!\\left(' + fr(N(num), N(den)) + '\\right)' + toN(deg, 0) + '^\\circ')]),
      ['You know two sides and want an angle: use the inverse key (2nd, then sin, cos or tan).', 'Label the two sides you know from x: opp, adj or hyp?'], o.text || 'tool + angle');
  }
  Object.assign(S, { pythHypPart: pythHypPart, trigSidePart: trigSidePart, trigAnglePart: trigAnglePart });

  /* solve: an angle (A or B) and the hypotenuse given → the other angle and both legs */
  function solveAH(o) {
    var th = o.deg, c = o.c, u = o.u, at = o.at || 'A', other = at === 'A' ? 'B' : 'A';
    var opp = c * TR.sin(th), adj = c * TR.cos(th);
    // from the given angle: opp = the leg across from it
    var oppName = at === 'A' ? 'a' : 'b', adjName = at === 'A' ? 'b' : 'a';
    var vals = { a: at === 'A' ? opp : adj, b: at === 'A' ? adj : opp };
    var angs = {}; angs[at] = th + '°';
    var svg = G.rightTriSVG({ A: at === 'A' ? th : 90 - th, c: c, sides: { a: 'a', b: 'b', c: lab(c, u) }, angles: angs, flip: o.flip, width: 260, px: 170 });
    var specs = [{ label: t('\\angle ' + other + '='), after: '°', name: '∠' + other }, { label: t('a='), after: u, name: 'a' }, { label: t('b='), after: u, name: 'b' }];
    var chk = [compChk(90 - th, th, '∠' + at), G.lenChk(vals.a, { trig: { fn: oppName === 'a' ? 'sin' : 'cos', deg: th, side: c, op: 'mul' } }), G.lenChk(vals.b, { trig: { fn: oppName === 'b' ? 'sin' : 'cos', deg: th, side: c, op: 'mul' } })];
    return P.fields(o.prompt + svg, specs, chk, [String(90 - th), key(vals.a), key(vals.b)], t('\\angle ' + other + '=' + dg(90 - th) + ',\\ a\\approx ' + fx(vals.a) + '\\text{ ' + u + '},\\ b\\approx ' + fx(vals.b) + '\\text{ ' + u + '}'),
      br([t('\\angle ' + other + '=90^\\circ-' + dg(th) + '=' + dg(90 - th)),
        'From ∠' + at + ': ' + t(oppName) + ' is opp, ' + L(c, u) + ' is hyp → SOH: ' + t(oppName + '=' + N(c) + '\\sin ' + dg(th) + toN(opp)) + ' ' + u,
        'From ∠' + at + ': ' + t(adjName) + ' is adj, ' + L(c, u) + ' is hyp → CAH: ' + t(adjName + '=' + N(c) + '\\cos ' + dg(th) + toN(adj)) + ' ' + u,
        checkPy(opp, adj, c)]),
      ['The two acute angles add to 90°.', 'Label from ∠' + at + ': the leg across from it is opp, the leg next to it is adj. Both go with the hyp: SOH and CAH.'], o.text || 'solve: angle + hyp');
  }
  S.solveAH = solveAH;
  /* the two acute angles from two known sides; num/den for ∠X = fn⁻¹(num/den) */
  function anglesPart(prompt, X, Y, fn, num, den, o) {
    o = o || {}; var x = INV[fn](num / den), y = 90 - x;
    return P.fields(prompt, [{ label: t('\\angle ' + X + '='), after: '°', name: '∠' + X }, { label: t('\\angle ' + Y + '='), after: '°', name: '∠' + Y }],
      [G.angleRatioChk(x, { ratio: { fn: fn, num: num, den: den } }), early(G.angleRatioChk(y, { ratio: { fn: fn === 'tan' ? 'tan' : fn === 'sin' ? 'cos' : 'sin', num: fn === 'tan' ? den : num, den: fn === 'tan' ? num : den } }), [], 0)],
      [key(x, 0), key(y, 0)], t('\\angle ' + X + '\\approx ' + fx(x, 0) + '^\\circ,\\ \\angle ' + Y + '\\approx ' + fx(y, 0) + '^\\circ'),
      br([o.lead, t('\\angle ' + X + '=\\' + fn + '^{-1}\\!\\left(' + fr(N(num), N(den)) + '\\right)' + toN(x, 0) + '^\\circ'), t('\\angle ' + Y + '=90^\\circ-' + rawN(x) + '^\\circ' + toN(y, 0) + '^\\circ'), o.check]),
      o.hints || ['Use the two sides you were <b>given</b> (not a rounded answer) and the inverse key.', 'The two acute angles add to 90°.'], o.text || 'the two acute angles');
  }
  S.anglesPart = anglesPart;

  /* ================= small story figures (HW.fig, not to scale) ================= */
  function kiteSVG(S0, th, hand) {
    var X = 6 * Math.cos(th * RAD), Y = 6 * Math.sin(th * RAD), hh = 1.1, K0 = [X, hh + Y];
    return HW.fig({ pts: { F: [0, 0], H: [0, hh], Pp: [X, hh], G0: [X, 0], K: K0, k1: [X - 0.3, K0[1] + 0.45], k2: [X, K0[1] + 0.95], k3: [X + 0.3, K0[1] + 0.45] },
      segs: [['H', 'K', S0 + ' m'], ['F', 'H', hand + ' m', { side: -1 }], ['H', 'Pp', { dash: 1, color: '#6a7182', width: 1.4 }], ['K', 'G0', { dash: 1, color: '#6a7182', width: 1.4 }], ['K', 'k1', { color: '#1f5bd6', width: 1.6 }], ['k1', 'k2', { color: '#1f5bd6', width: 1.6 }], ['k2', 'k3', { color: '#1f5bd6', width: 1.6 }], ['k3', 'K', { color: '#1f5bd6', width: 1.6 }]],
      right: [['Pp', 'H', 'K']], angles: [['H', 'Pp', 'K', th + '°']], fill: [['K', 'k1', 'k2', 'k3']], names: false,
      extra: [{ type: 'ground', y: 0, x0: -0.8, x1: X + 1 }, { type: 'person', at: [-0.3, 0], h: 1.3 }], width: 300, aria: 'kite on a string' });
  }
  function twoTriSVG(A0, AB, DC) {
    var h = AB * Math.sin(A0 * RAD), d = AB * Math.cos(A0 * RAD);
    return HW.fig({ pts: { A: [0, 0], D: [d, 0], B: [d, h], C: [d + DC, 0] }, segs: [['A', 'B', AB + ' cm'], ['B', 'C'], ['A', 'D'], ['D', 'C', DC + ' cm', { side: -1 }], ['B', 'D']],
      right: [['D', 'C', 'B']], angles: [['A', 'D', 'B', A0 + '°']], width: 360, aria: 'two right triangles sharing BD' });
  }
  function cliffSVG(h, a1, a2) {
    // a sketch, not to scale: the cliff is drawn taller (as in the booklet) so the two angles and labels stay apart
    var d1 = h / Math.tan(a1 * RAD), d2 = h / Math.tan(a2 * RAD), H = Math.max(h, d2 * 0.42), w = d2 * 0.07;
    return HW.fig({ pts: { T: [0, H], O: [0, 0], Nc: [d1, 0], Fc: [d2, 0], Hz: [d2 * 1.05, H], Wb: [-w, H], Wo: [-w, 0] },
      segs: [['T', 'O'], ['O', 'Fc', { color: '#2f6fb3' }], ['T', 'Nc'], ['T', 'Fc'], ['T', 'Hz', { dash: 1, color: '#6a7182', width: 1.4 }], ['Wb', 'T'], ['Wb', 'Wo', { color: '#8a7a5c' }]],
      right: [['O', 'T', 'Fc']], angles: [['T', 'Hz', 'Nc', a1 + '°', { r: 30 }], ['T', 'Hz', 'Fc', a2 + '°', { r: 78, color: '#1f5bd6' }]], fill: [['Wb', 'T', 'O', 'Wo']], names: false,
      extra: [{ type: 'text', at: [-w - d2 * 0.07, H / 2], text: h + ' m' }, { type: 'text', at: [d1, -H * 0.1], text: 'near canoe' }, { type: 'text', at: [d2, -H * 0.1], text: 'far canoe' }, { type: 'eye', at: [d1, 0] }, { type: 'eye', at: [d2, 0] }, { type: 'text', at: [d2 * 0.55, H * 1.08], text: '(not to scale)', size: 11, color: '#6a7182' }], width: 420, aria: 'two angles of depression from a cliff' });
  }
  function tentSVG(o) {
    var hw = o.w / 2, h = o.h, lb = o.labels || {};
    return HW.fig({ pts: { L0: [0, 0], R0: [o.w, 0], T: [hw, h], M: [hw, 0] },
      segs: [['L0', 'T', lb.left], ['T', 'R0', lb.right], ['L0', 'R0', lb.base], ['T', 'M', lb.mid || undefined, { dash: 1, color: '#6a7182', width: 1.4 }]].map(function (s) { return s[2] == null ? [s[0], s[1], s[3] || {}] : s; }),
      right: [['M', 'R0', 'T']], angles: (o.angles || []), fill: [['L0', 'T', 'R0']], names: false, extra: [{ type: 'ground', y: 0, x0: -0.25 * o.w, x1: 1.25 * o.w }], width: o.width || 300, aria: o.aria || 'isosceles triangle' });
  }
  function flagSVG(d, al, be) {
    // a sketch, not to scale: the flagpole is drawn longer so it can be seen
    var hb = d * Math.tan(al * RAD), ht = Math.max(d * Math.tan(be * RAD), hb * 1.35), bw = d * 0.3;
    return HW.fig({ pts: { Nn: [0, 0], B0: [d, 0], R0: [d, hb], F0: [d, ht], Bk: [d + bw, 0], Rk: [d + bw, hb] },
      segs: [['Nn', 'B0', d + ' m'], ['B0', 'R0'], ['R0', 'F0', { color: '#c93a33', width: 3 }], ['Nn', 'R0', { color: '#6a7182', width: 1.4 }], ['Nn', 'F0', { color: '#6a7182', width: 1.4 }], ['R0', 'Rk'], ['Rk', 'Bk']],
      right: [['B0', 'Nn', 'R0']], angles: [['Nn', 'B0', 'R0', al + '°', { r: 46 }], ['Nn', 'B0', 'F0', be + '°', { r: 92, color: '#1f5bd6' }]], fill: [['B0', 'R0', 'Rk', 'Bk']], names: false,
      extra: [{ type: 'ground', y: 0, x0: -d * 0.08, x1: d + bw * 1.3 }, { type: 'text', at: [d + bw * 0.5, hb * 0.5], text: 'building' }, { type: 'text', at: [d + bw * 0.62, (hb + ht) / 2], text: 'flagpole', color: '#c93a33' }, { type: 'text', at: [d * 0.35, ht], text: '(not to scale)', size: 11, color: '#6a7182' }], width: 340, aria: 'flagpole on a building' });
  }
  Object.assign(S, { kiteSVG: kiteSVG, twoTriSVG: twoTriSVG, cliffSVG: cliffSVG, tentSVG: tentSVG, flagSVG: flagSVG });

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u7l9', unit: 7, num: '9', title: 'Solving Right Triangles: Choosing the Right Ratio', outcome: 'G4',
    blurb: 'Choose the right tool (Pythagoras, sine, cosine, tangent, an inverse key or 90° − the angle), solve whole right triangles, work with two triangles at once, and check that answers make sense.',
    questions: [
      { num: '1', stem: 'Which tool would you use? Choose Pythagoras, sine, cosine, tangent, inverse sine, inverse cosine, inverse tangent or 90° − angle.', parts: [
        { id: '1', sub: 'a–g', level: 'BEG', outcome: 'G4', make: function (r) { return toolTablePart(r, 'Choose the tool for each row.', 7); } }] },
      { num: '2', stem: 'Name the tool. Then find <i>x</i>. Round sides to the nearest tenth and angles to the nearest degree.', shared: function (r) {
          var pq = find(function () { var a = r.int(5, 16), b = r.int(a + 2, 24); return [a, b]; }, function (v) { var c = Math.hypot(v[0], v[1]); return !(v[0] === 5 && v[1] === 12) && safe(c) && !(near(c, Math.round(c), 1e-9) && r.chance(0.6)); });
          var s2 = find(function () { return { s: r.int(8, 20), d: intNot(r, 24, 64, [35, 38, 62, 34, 52, 24]) }; }, function (v) { return safe(v.s * TR.tan(v.d)); });
          var s3 = find(function () { var o = r.int(3, 12); return { o: o, h: r.int(o + 2, o + 10) }; }, function (v) { return !(v.o === 8 && v.h === 12) && safe(INV.sin(v.o / v.h), 0) && INV.sin(v.o / v.h) > 12; });
          return { pq: pq, s2: s2, s3: s3, u: r.pick([['cm', 'm', 'ft'], ['m', 'cm', 'in'], ['in', 'm', 'cm']]) };
        },
        parts: [
          { id: '2a', level: 'BEG', outcome: 'G2', make: function (r, sh) { return pythHypPart(sh.pq[0], sh.pq[1], sh.u[0], { lead: 'Name the tool, then find <i>x</i>.' }); } },
          { id: '2b', level: 'BEG', outcome: 'G4', make: function (r, sh) { return trigSidePart(sh.s2.d, 'adj', sh.s2.s, 'opp', sh.u[1]); } },
          { id: '2c', level: 'EMG', outcome: 'G4', make: function (r, sh) { return trigAnglePart('opp', sh.s3.o, 'hyp', sh.s3.h, sh.u[2]); } }] },
      { num: '3', stem: '', parts: [
        { id: '3', level: 'PRG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { c: r.int(12, 32), B: intNot(r, 28, 64, [38, 52, 62, 35]) }; }, function (v) { return safe(v.c * TR.sin(v.B)) && safe(v.c * TR.cos(v.B)) && v.B !== 45; });
          return solveAH({ deg: s.B, at: 'B', c: s.c, u: 'cm', prompt: 'Solve ' + t('\\triangle ABC') + ' (' + t('\\angle C=90^\\circ') + '): find ' + t('\\angle A') + ', ' + t('a') + ' and ' + t('b') + '.', text: 'solve: ∠B + hyp' });
        } }] },
      { num: '4', stem: function (sh) { return 'Solve ' + t('\\triangle ABC') + ' (' + t('\\angle C=90^\\circ') + '): find ' + t('c') + ', ' + t('\\angle A') + ' and ' + t('\\angle B') + '.' + tri({ a: sh.a, b: sh.b, names: ['A', 'B', 'C'], sides: { a: lab(sh.a, 'm'), b: lab(sh.b, 'm'), c: 'c' } }); },
        shared: function (r) { return find(function () { var a = pickR(r, 3, 8, 0.1), b = pickR(r, a + 1.5, 12, 0.1); return { a: a, b: b }; }, function (v) { var A0 = INV.tan(v.a / v.b); return !(v.a === 7.2 && v.b === 9.6) && safe(Math.hypot(v.a, v.b)) && safe(A0, 0) && A0 > 18 && A0 < 42; }); },
        parts: [
          { id: '4a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var c = Math.hypot(sh.a, sh.b);
            return GP.len('Find ' + t('c') + ', to the nearest tenth.', c, { unit: 'm', pyth: { legs: [sh.a, sh.b] }, sol: br(['Two sides known → Pythagoras.', t('c^2=' + N(sh.a) + '^2+' + N(sh.b) + '^2=' + N(q(sh.a * sh.a)) + '+' + N(q(sh.b * sh.b)) + '=' + N(q(sh.a * sh.a + sh.b * sh.b))), t('c=\\sqrt{' + N(q(sh.a * sh.a + sh.b * sh.b)) + '}' + toN(c)) + ' m']), hints: ['c is across from the right angle: add the squares.'], text: 'solve: c from legs' });
          } },
          { id: '4b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            return anglesPart('Find ' + t('\\angle A') + ' and ' + t('\\angle B') + ', to the nearest degree.', 'A', 'B', 'tan', sh.a, sh.b, { lead: 'From ∠A: ' + L(sh.a, 'm') + ' is opp and ' + L(sh.b, 'm') + ' is adj (both given). No hyp → TOA.', check: 'Check: the bigger angle, ∠B, faces the longer leg (' + L(sh.b, 'm') + ') ✓', text: 'solve: angles from legs' });
          } }] },
      { num: '5', stem: function (sh) { return 'Solve ' + t('\\triangle DEF') + ', where ' + t('\\angle F=90^\\circ') + ': find ' + t('EF') + ', ' + t('\\angle D') + ' and ' + t('\\angle E') + '.' + tri({ b: sh.df, c: sh.de, names: ['D', 'E', 'F'], sides: { b: lab(sh.df, 'in'), c: lab(sh.de, 'in') } }); },
        shared: function (r) { return find(function () { var df = pickR(r, 3, 9, 0.1), de = pickR(r, df + 2, df + 7, 0.1); return { df: df, de: de }; }, function (v) { var D0 = INV.cos(v.df / v.de); return safe(Math.sqrt(v.de * v.de - v.df * v.df)) && safe(D0, 0) && D0 > 30 && D0 < 70; }); },
        parts: [
          { id: '5a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var v = Math.sqrt(sh.de * sh.de - sh.df * sh.df), s2 = q(sh.de * sh.de - sh.df * sh.df);
            return GP.len('Find ' + t('EF') + ', to the nearest tenth.', v, { unit: 'in', pyth: { hyp: sh.de, leg: sh.df }, sol: br(['Two sides known → Pythagoras. ' + L(sh.de, 'in') + ' is the hypotenuse, so subtract.', t('EF^2=' + N(sh.de) + '^2-' + N(sh.df) + '^2=' + N(q(sh.de * sh.de)) + '-' + N(q(sh.df * sh.df)) + '=' + N(s2)), t('EF=\\sqrt{' + N(s2) + '}' + toN(v)) + ' in']), hints: ['DE is across from the right angle: it is the hypotenuse. To find a leg, subtract the squares.'], text: 'solve: leg EF' });
          } },
          { id: '5b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            return anglesPart('Find ' + t('\\angle D') + ' and ' + t('\\angle E') + ', to the nearest degree.', 'D', 'E', 'cos', sh.df, sh.de, { lead: 'From ∠D: ' + L(sh.df, 'in') + ' is adj and ' + L(sh.de, 'in') + ' is hyp (both given). No opp → CAH.', text: 'solve: angles from leg + hyp' });
          } }] },
      { num: '6', stem: '', parts: [
        { id: '6', level: 'PRG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { A: intNot(r, 24, 44, [35, 38, 34, 24]), a: pickR(r, 5, 14, 0.5) }; }, function (v) { return safe(v.a / TR.sin(v.A)) && safe(v.a / TR.tan(v.A)); });
          var c = s.a / TR.sin(s.A), b = s.a / TR.tan(s.A);
          var svg = G.rightTriSVG({ A: s.A, a: s.a, flip: true, sides: { a: lab(s.a, 'm'), b: 'b', c: 'c' }, angles: { A: s.A + '°' }, width: 280, px: 180 });
          return P.fields('Solve ' + t('\\triangle ABC') + ' (' + t('\\angle C=90^\\circ') + '): find ' + t('\\angle B') + ', ' + t('b') + ' and ' + t('c') + '. (Watch where the unknown goes!)' + svg,
            [{ label: t('\\angle B='), after: '°', name: '∠B' }, { label: t('b='), after: 'm', name: 'b' }, { label: t('c='), after: 'm', name: 'c' }],
            [compChk(90 - s.A, s.A, '∠A'), G.lenChk(b, { trig: { fn: 'tan', deg: s.A, side: s.a, op: 'div' } }), G.lenChk(c, { trig: { fn: 'sin', deg: s.A, side: s.a, op: 'div' } })],
            [String(90 - s.A), key(b), key(c)], t('\\angle B=' + dg(90 - s.A) + ',\\ b\\approx ' + fx(b) + '\\text{ m},\\ c\\approx ' + fx(c) + '\\text{ m}'),
            br([t('\\angle B=90^\\circ-' + dg(s.A) + '=' + dg(90 - s.A)),
              'From ∠A: ' + L(s.a, 'm') + ' is opp, c is hyp → SOH: ' + t(fnT('sin', s.A) + '=' + fr(N(s.a), 'c')) + ', so ' + t('c=' + N(s.a) + '\\div\\sin ' + dg(s.A) + toN(c)) + ' m',
              'From ∠A: ' + L(s.a, 'm') + ' is opp, b is adj → TOA: ' + t(fnT('tan', s.A) + '=' + fr(N(s.a), 'b')) + ', so ' + t('b=' + N(s.a) + '\\div\\tan ' + dg(s.A) + toN(b)) + ' m',
              'Check: c is the longest side ✓']),
            ['The unknown is on the <b>bottom</b> of each ratio, so divide.', 'Use the given ' + s.a + ' m for both sides, not a rounded answer.'], 'solve: unknowns on the bottom');
        } }] },
      { num: '7', stem: function (sh) { return 'A ' + L(sh.L, 'm') + ' ladder leans against a wall. It makes an angle of ' + D(sh.th) + ' with the ground.'; },
        shared: function (r) { return find(function () { return { L: pickR(r, 4, 8.5, 0.5), th: intNot(r, 66, 80, [75, 76]) }; }, function (v) { return safe(v.L * TR.sin(v.th)) && safe(v.L * TR.cos(v.th)); }); },
        parts: [
          { id: '7a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var a = 4 * TR.sin(52), b = 4 * TR.cos(52), Ls = lab(sh.L, 'm'), th = sh.th + '°', W = 170;   // sketches, not to scale (a 52° shape keeps the labels clear)
            var pics = {
              right: tri({ a: a, b: b, sides: { c: Ls }, angles: { A: th }, width: W, px: 130 }),
              top: tri({ a: a, b: b, sides: { c: Ls }, angles: { B: th }, width: W, px: 130 }),
              wall: tri({ a: a, b: b, sides: { a: Ls }, angles: { A: th }, width: W, px: 130 }),
              ground: tri({ a: a, b: b, sides: { b: Ls }, angles: { A: th }, width: W, px: 130 }) };
            var p = P.mc(r, 'Which sketch is labelled correctly? (The wall is on the right; the ground is along the bottom.)', [
              { html: pics.right, right: true },
              { html: pics.top, why: 'The ' + th + ' angle is with the <b>ground</b>, at the foot of the ladder, not at the top.', code: 's7-top' },
              { html: pics.wall, why: 'The ladder is the <b>sloping</b> side (the hypotenuse), not the wall.', code: 's7-wall' },
              { html: pics.ground, why: 'The ladder is the <b>sloping</b> side (the hypotenuse), not the ground.', code: 's7-ground' }],
              'The wall is vertical and the ground is horizontal, so they make the right angle. The ladder is the hypotenuse (' + Ls + '), and the ' + th + ' angle is at the foot of the ladder, between the ladder and the ground.' + pics.right,
              ['Where are the wall and the ground? They meet at the right angle.', 'The angle is "with the ground": at the foot of the ladder.'], 'sketch the ladder');
            p.input.columns = 2; return p;
          } },
          { id: '7b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.L * TR.sin(sh.th);
            return GP.len('How high up the wall does the ladder reach?', v, { unit: 'm', trig: { fn: 'sin', deg: sh.th, side: sh.L, op: 'mul' }, sol: br(['From ' + D(sh.th) + ': the height is opp, the ladder is hyp → SOH.', t('h=' + N(sh.L) + '\\sin ' + dg(sh.th) + toN(v)) + ' m']), hints: ['The height is across from the ' + sh.th + '° angle. The ladder is the hyp.'], text: 'ladder height' });
          } },
          { id: '7c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.L * TR.cos(sh.th);
            return GP.len('How far is the foot of the ladder from the wall?', v, { unit: 'm', trig: { fn: 'cos', deg: sh.th, side: sh.L, op: 'mul' }, sol: br(['From ' + D(sh.th) + ': the distance along the ground is adj, the ladder is hyp → CAH.', t('d=' + N(sh.L) + '\\cos ' + dg(sh.th) + toN(v)) + ' m', 'Check: a steep ladder has its foot close to the wall ✓']), hints: ['The distance along the ground is next to the ' + sh.th + '° angle: adj. The ladder is the hyp.'], text: 'ladder foot' });
          } }] },
      { num: '8', stem: function (sh) { return 'A zipline at a summer camp in ' + sh.place + ' starts on a platform ' + L(sh.h, 'm') + ' higher than where it ends. The horizontal distance between the two ends is ' + L(sh.d, 'm') + '.'; },
        shared: function (r) { return find(function () { return { h: r.int(10, 32), d: 10 * r.int(10, 26), place: r.pick(['Kananaskis', 'Sylvan Lake', 'Waterton', 'Pigeon Lake']) }; }, function (v) { return safe(INV.tan(v.h / v.d), 0) && safe(Math.hypot(v.h, v.d)) && INV.tan(v.h / v.d) > 3; }); },
        parts: [
          { id: '8a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var th = INV.tan(sh.h / sh.d);
            return GP.trigAngle('Find the angle the cable makes with the horizontal, to the nearest degree.', th, { ratio: { fn: 'tan', num: sh.h, den: sh.d }, sol: br(['Sketch: the drop (' + L(sh.h, 'm') + ') is opp, the horizontal distance (' + L(sh.d, 'm') + ') is adj. No hyp → TOA.', t('\\theta=\\tan^{-1}\\!\\left(' + fr(sh.h, sh.d) + '\\right)' + toN(th, 0) + '^\\circ')]), hints: ['Sketch a right triangle: the cable is the hypotenuse, the drop is vertical, the distance is horizontal.', 'You know opp and adj, and want the angle: inverse tangent.'], text: 'zipline angle' });
          } },
          { id: '8b', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var c = Math.hypot(sh.h, sh.d), s2 = sh.h * sh.h + sh.d * sh.d;
            return GP.len('Find the length of the cable (assume it is straight), to the nearest tenth of a metre.', c, { unit: 'm', pyth: { legs: [sh.h, sh.d] }, sol: br(['Two sides known (both given) → Pythagoras.', t('c=\\sqrt{' + N(sh.d) + '^2+' + N(sh.h) + '^2}=\\sqrt{' + N(s2) + '}' + toN(c)) + ' m']), hints: ['The cable is the hypotenuse. Use the two given numbers, not the angle.'], text: 'zipline length' });
          } },
          { id: '8c', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var c = Math.hypot(sh.h, sh.d);
            return P.mc(r, 'Is your answer to (b), about ' + L(rd(c), 'm') + ', reasonable?', [
              { html: '<b>Yes.</b> The cable is the hypotenuse, so it must be longer than ' + L(sh.d, 'm') + ', but only a little longer because the angle is small.', right: true },
              { html: '<b>No.</b> The cable should be ' + t(N(sh.d) + '+' + N(sh.h) + '=' + N(sh.d + sh.h)) + ' m.', why: 'The two legs added together are a path down and across. The straight cable is a shortcut, so it is <b>shorter</b> than that.', code: 'r8-add' },
              { html: '<b>No.</b> The cable should be shorter than ' + L(sh.d, 'm') + '.', why: 'The cable is the hypotenuse: the <b>longest</b> side.', code: 'r8-short' },
              { html: '<b>Yes.</b> It is between ' + L(sh.h, 'm') + ' and ' + L(sh.d, 'm') + '.', why: 'Look again: the answer is <b>more</b> than both legs, which is what a hypotenuse must be. The reason matters.', code: 'r8-between' }],
              'The cable is the hypotenuse, so it is the longest side: more than ' + L(sh.d, 'm') + '. The angle is small, so the triangle is long and flat and the hypotenuse is only a little longer than the horizontal side. ' + L(rd(c), 'm') + ' fits.', ['Which side of the triangle is the cable?'], 'zipline reasonable');
          } }] },
      { num: '9', stem: function (sh) { return sh.who + ' is flying a kite on a ' + L(sh.S, 'm') + ' string. The string makes an angle of elevation of ' + D(sh.th) + '. ' + cap(he(sh.who)) + ' holds the string ' + L(sh.hand, 'm') + ' above the ground. Assume the string is straight.' + kiteSVG(sh.S, sh.th, sh.hand); },
        shared: function (r) { return find(function () { return { S: 5 * r.int(8, 18), th: intNot(r, 38, 66, [52, 45]), hand: pickR(r, 1.2, 1.6, 0.1), who: r.pick(NAMES) }; }, function (v) { var y = v.S * TR.sin(v.th); return safe(y) && safe(y + v.hand) && safe(v.S * TR.cos(v.th)); }); },
        parts: [
          { id: '9a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.S * TR.sin(sh.th);
            return GP.len('How high is the kite above ' + sh.who + '’s hand?', v, { unit: 'm', trig: { fn: 'sin', deg: sh.th, side: sh.S, op: 'mul' }, alts: [{ v: v + sh.hand, code: 'u7l9-hand', hint: 'This part asks for the height above the <b>hand</b>. (Adding the hand height comes in part (b).)' }], sol: br(['From ' + D(sh.th) + ': the height above the hand is opp, the string is hyp → SOH.', t('h=' + N(sh.S) + '\\sin ' + dg(sh.th) + toN(v)) + ' m']), hints: ['The right triangle starts at the hand. The string is the hyp.'], text: 'kite above hand' });
          } },
          { id: '9b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var y = sh.S * TR.sin(sh.th), v = y + sh.hand;
            return GP.len('How high is the kite above the ground?', v, { unit: 'm', trig: { fn: 'sin', deg: sh.th, side: sh.S, op: 'mul' }, radTrap: { fn: 'sin', deg: sh.th, side: sh.S, op: 'mul' }, alts: [{ v: y, code: 'u7l9-not-total', hint: 'That is the height above the <b>hand</b>. Add the ' + sh.hand + ' m from the ground to the hand.' }, { v: y - sh.hand, code: 'u7l9-sub', hint: 'The hand is <b>above</b> the ground, so add its height.' }], sol: br(['Height above the hand: ' + t(N(sh.S) + '\\sin ' + dg(sh.th) + '=' + rawN(y)) + ' m', 'Add the hand height: ' + t(rawN(y) + '+' + N(sh.hand) + toN(v)) + ' m']), hints: ['First find the height above the hand, then add the hand height.'], text: 'kite above ground' });
          } },
          { id: '9c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.S * TR.cos(sh.th);
            return GP.len('How far is ' + sh.who + ' from the spot on the ground right under the kite?', v, { unit: 'm', trig: { fn: 'cos', deg: sh.th, side: sh.S, op: 'mul' }, alts: [{ v: v + sh.hand, code: 'u7l9-hand', hint: 'The hand height is vertical. It doesn’t change a <b>horizontal</b> distance.' }], sol: br(['From ' + D(sh.th) + ': the horizontal distance is adj, the string is hyp → CAH.', t('d=' + N(sh.S) + '\\cos ' + dg(sh.th) + toN(v)) + ' m']), hints: ['The horizontal distance is next to the angle: adj.'], text: 'kite distance' });
          } }] },
      { num: '10', stem: function (sh) { return 'The two right triangles share side ' + t('BD') + '. ' + t('\\angle A=' + dg(sh.A)) + ', ' + t('AB=' + sh.AB) + ' cm and ' + t('DC=' + sh.DC) + ' cm.' + twoTriSVG(sh.A, sh.AB, sh.DC); },
        shared: function (r) { return find(function () { return { A: intNot(r, 28, 48, [34, 35, 38]), AB: r.int(10, 24), DC: r.int(4, 12) }; }, function (v) { var bd = v.AB * TR.sin(v.A), bc = Math.hypot(bd, v.DC), C0 = INV.tan(bd / v.DC); return safe(bd) && safe(v.AB * TR.cos(v.A)) && safe(bc) && safe(C0, 0) && v.DC < v.AB * TR.cos(v.A) && C0 > 30 && C0 < 72; }); },
        parts: [
          { id: '10a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            return P.mc(r, 'Which triangle do you solve first? Why?', [
              { html: t('\\triangle ABD') + ': it has a side (' + t('AB') + ') and an angle (' + t('\\angle A') + ') you know.', right: true },
              { html: t('\\triangle BDC') + ': it has the right angle at ' + t('D') + '.', why: 'Both triangles have the right angle at D. Count what else you know in each.', code: 's10-right' },
              { html: t('\\triangle BDC') + ': it is the smaller triangle.', why: 'Size doesn’t matter. You need two facts besides the right angle: △BDC has only one (DC).', code: 's10-small' },
              { html: 'Either one: they share ' + t('BD') + '.', why: 'BD isn’t known yet. △BDC has only DC, so it can’t be solved first.', code: 's10-either' }],
              t('\\triangle ABD') + ' first: it has a side (' + sh.AB + ' cm) and an angle (' + D(sh.A) + '). ' + t('\\triangle BDC') + ' only has one side.', ['Which triangle has two facts you know (besides the right angle)?'], 'which triangle first');
          } },
          { id: '10b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.AB * TR.sin(sh.A);
            return GP.len('Find ' + t('BD') + ', to the nearest tenth.', v, { unit: 'cm', trig: { fn: 'sin', deg: sh.A, side: sh.AB, op: 'mul' }, sol: br(['From ' + D(sh.A) + ': BD is opp, ' + sh.AB + ' cm is hyp → SOH.', t('BD=' + sh.AB + '\\sin ' + dg(sh.A) + toN(v)) + ' cm']), hints: ['Work in △ABD. Label from ∠A: BD is across from it.'], text: 'two triangles: BD' });
          } },
          { id: '10c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.AB * TR.cos(sh.A);
            return GP.len('Find ' + t('AD') + ', to the nearest tenth.', v, { unit: 'cm', trig: { fn: 'cos', deg: sh.A, side: sh.AB, op: 'mul' }, sol: br(['From ' + D(sh.A) + ': AD is adj, ' + sh.AB + ' cm is hyp → CAH.', t('AD=' + sh.AB + '\\cos ' + dg(sh.A) + toN(v)) + ' cm']), hints: ['AD is next to ∠A: adj. Use the given ' + sh.AB + ' cm, not BD.'], text: 'two triangles: AD' });
          } },
          { id: '10d', level: 'ADV', outcome: 'G2', make: function (r, sh) {
            var bd = sh.AB * TR.sin(sh.A), v = Math.hypot(bd, sh.DC);
            var chk = early(G.lenChk(v, { pyth: { legs: [bd, sh.DC] } }), [Math.hypot(rd(bd), sh.DC)], 1, 'Nearly! Use the <b>full</b> value of BD (' + rawN(bd).replace('\\ldots', '…') + '), not the rounded ' + fx(bd) + '.');
            var p = GP.len('Find ' + t('BC') + ', to the nearest tenth.', v, { unit: 'cm', sol: br(['In △BDC, two legs are known: BD and DC → Pythagoras.', t('BC=\\sqrt{' + rawN(bd) + '^2+' + sh.DC + '^2}=\\sqrt{' + rawN(bd * bd + sh.DC * sh.DC) + '}' + toN(v)) + ' cm']), hints: ['BC is the hypotenuse of △BDC. Its legs are BD (from part b) and DC.', 'Keep all the digits of BD.'], text: 'two triangles: BC' });
            p.check = chk; return p;
          } },
          { id: '10e', level: 'MAS', outcome: 'G4', make: function (r, sh) {
            var bd = sh.AB * TR.sin(sh.A), C0 = INV.tan(bd / sh.DC);
            var chk = early(G.angleRatioChk(C0, { ratio: { fn: 'tan', num: bd, den: sh.DC } }), [INV.tan(rd(bd) / sh.DC)], 0, 'Nearly! Use the <b>full</b> value of BD, not the rounded ' + fx(bd) + '.');
            var p = GP.trigAngle('Find ' + t('\\angle C') + ', to the nearest degree.', C0, { sol: br(['From ∠C: BD is opp and DC = ' + sh.DC + ' cm is adj → TOA.', t('\\angle C=\\tan^{-1}\\!\\left(' + fr(rawN(bd), sh.DC) + '\\right)' + toN(C0, 0) + '^\\circ')]), hints: ['Work in △BDC. From ∠C, BD is across and DC is next to it.', 'You know opp and adj: inverse tangent.'], text: 'two triangles: ∠C' });
            p.check = chk; return p;
          } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'MAS', outcome: 'G4', make: function (r) {
          var s = find(function () { var a1 = r.int(36, 56); return { h: r.int(24, 60), a1: a1, a2: r.int(14, a1 - 12), lake: r.pick(['Waterton Lake', 'Lake Minnewanka', 'Abraham Lake', 'Spray Lakes']) }; }, function (v) {
            var d1 = v.h / TR.tan(v.a1), d2 = v.h / TR.tan(v.a2); return v.a1 !== 52 && v.a2 !== 34 && safe(d2 - d1) && rd(rd(d2) - rd(d1)) === rd(d2 - d1);
          });
          var d1 = s.h / TR.tan(s.a1), d2 = s.h / TR.tan(s.a2), v = d2 - d1;
          return GP.len('A lookout stands on top of a cliff ' + L(s.h, 'm') + ' above the water at ' + s.lake + '. Two canoes are lined up straight out from the bottom of the cliff. The angle of depression to the nearer canoe is ' + D(s.a1) + ' and to the farther canoe is ' + D(s.a2) + '. How far apart are the canoes, to the nearest tenth of a metre?' + cliffSVG(s.h, s.a1, s.a2), v, { unit: 'm', radTrap: false,
            alts: [{ v: d1 + d2, code: 'u7l9-added', hint: 'Both canoes are on the <b>same</b> side of the cliff. The distance between them is the far distance <b>minus</b> the near distance.' },
              { v: d2, code: 'u7l9-one', hint: 'That is the distance to the <b>far</b> canoe. Subtract the distance to the near canoe.' }, { v: d1, code: 'u7l9-one', hint: 'That is the distance to the <b>near</b> canoe. Find the far one too, then subtract.' },
              { v: s.h * TR.tan(s.a1) - s.h * TR.tan(s.a2), code: 'trig-mul-div', hint: 'From each canoe, the cliff is opp and the distance is adj: ' + t('\\tan\\theta=' + fr(N(s.h), 'd')) + '. d is on the <b>bottom</b>, so divide: ' + t('d=' + N(s.h) + '\\div\\tan\\theta') + '.' },
              { v: Math.abs(s.h / Math.tan(s.a2) - s.h / Math.tan(s.a1)), code: 'trig-rad', hint: G.RAD_HINT },
              { v: s.h / TR.tan(s.a1 - s.a2), code: 'u7l9-tan-diff', hint: 'Work out each distance in its own triangle first, then subtract the distances (not the angles).' }],
            sol: br(['Both triangles share the ' + s.h + ' m cliff. From each canoe, the angle of elevation equals the angle of depression (alternate interior angles).', 'Near canoe: ' + s.h + ' m is opp, the distance is adj → TOA: ' + t('d_1=' + N(s.h) + '\\div\\tan ' + dg(s.a1) + '=' + rawN(d1)) + ' m',
              'Far canoe: ' + t('d_2=' + N(s.h) + '\\div\\tan ' + dg(s.a2) + '=' + rawN(d2)) + ' m', 'Apart: ' + t(rawN(d2) + '-' + rawN(d1) + toN(v)) + ' m', 'Check: the smaller angle goes with the farther canoe ✓']),
            hints: ['The angle of depression from the top equals the angle of elevation from each canoe.', 'Find each canoe’s distance from the cliff (÷ tan), then subtract.'], text: 'two canoes' });
        } }] },
      { num: '12', stem: function (sh) { return 'The front of a camping tent is an isosceles triangle. Each sloped side is ' + L(sh.s, 'm') + ' long and the base is ' + L(sh.w, 'm') + ' wide. A pole goes straight up the middle.' + tentSVG({ w: sh.w, h: sh.h, labels: { left: lab(sh.s, 'm'), right: lab(sh.s, 'm'), base: lab(sh.w, 'm') } }); },
        shared: function (r) { return find(function () { var s = pickR(r, 1.8, 3.0, 0.1), w = pickR(r, 2.2, 4.2, 0.2); return { s: s, w: w, h: Math.sqrt(s * s - w * w / 4), th: INV.cos(w / 2 / s) }; }, function (v) { return v.w / 2 < v.s * 0.85 && v.th > 32 && v.th < 66 && safe(v.h) && safe(v.th, 0) && safe(180 - 2 * v.th, 0) && !(v.s === 2.2 && v.w === 3); }); },
        parts: [
          { id: '12a', level: 'PRG', outcome: 'G2', make: function (r, sh) {
            var hw = q(sh.w / 2), s2 = q(sh.s * sh.s - hw * hw);
            return GP.len('How tall is the centre pole, to the nearest tenth of a metre?', sh.h, { unit: 'm', pyth: { hyp: sh.s, leg: hw }, alts: [{ v: Math.sqrt(sh.s * sh.s - sh.w * sh.w), code: 'u7l9-full-width', hint: 'The pole cuts the base in half. Each right triangle has a base of ' + t(N(sh.w) + '\\div 2=' + N(hw)) + ' m.' }, { v: Math.sqrt(Math.abs(sh.w * sh.w - sh.s * sh.s)), code: 'u7l9-full-width', hint: 'Use <b>half</b> the base (' + N(hw) + ' m) as a leg, and the sloped side as the hypotenuse.' }],
              sol: br(['The pole splits the tent into two equal right triangles: base ' + t(N(sh.w) + '\\div 2=' + N(hw)) + ' m, hypotenuse ' + L(sh.s, 'm') + '.', t('h=\\sqrt{' + N(sh.s) + '^2-' + N(hw) + '^2}=\\sqrt{' + N(s2) + '}' + toN(sh.h)) + ' m']), hints: ['The pole cuts the base in half.', 'The sloped side is the hypotenuse: subtract the squares.'], text: 'tent pole' });
          } },
          { id: '12b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var hw = q(sh.w / 2);
            return GP.trigAngle('What angle does each side make with the ground, to the nearest degree?', sh.th, { ratio: { fn: 'cos', num: hw, den: sh.s }, alts: [{ v: INV.cos(Math.min(1, sh.w / 2 / sh.s * 2)) || -99, code: 'u7l9-full-width', hint: 'Use half the base, ' + N(hw) + ' m.' }], sol: br(['In one half: ' + N(hw) + ' m is adj and ' + L(sh.s, 'm') + ' is hyp → CAH.', t('\\theta=\\cos^{-1}\\!\\left(' + fr(N(hw), N(sh.s)) + '\\right)' + toN(sh.th, 0) + '^\\circ')]), hints: ['Use one of the two right triangles. The angle is at the ground.', 'You know adj (half the base) and hyp: inverse cosine.'], text: 'tent angle' });
          } },
          { id: '12c', level: 'ADV', outcome: 'G4', make: function (r, sh) {
            var top = 180 - 2 * sh.th, half = 90 - sh.th;
            var chk = early(G.angleRatioChk(top, { complementTrap: false, alts: [{ v: half, code: 'u7l9-half-top', hint: 'That is the top angle of <b>one</b> half. The pole splits the top angle in two: double it.' }, { v: 90 - sh.th / 2, code: 'u7l9-half-top', hint: 'In one half, the top angle is 90° − θ. The whole top angle is twice that.' }, { v: 180 - sh.th, code: 'u7l9-sub', hint: 'There are <b>two</b> base angles of ' + fx(sh.th, 0) + '°. The three angles add to 180°.' }] }), [180 - 2 * rd(sh.th, 0)], 0, 'Nearly! Use the full value of the base angle (' + rawN(sh.th).replace('\\ldots', '…') + '°), then round at the end.');
            var p = GP.trigAngle('What is the angle at the top of the tent, to the nearest degree?', top, { sol: br(['Each half has a top angle of ' + t('90^\\circ-' + rawN(sh.th) + '^\\circ=' + rawN(half) + '^\\circ') + '.', 'The whole top angle: ' + t('2\\times ' + rawN(half) + '^\\circ' + toN(top, 0) + '^\\circ'), 'Check: ' + t(fx(sh.th, 0) + '^\\circ+' + fx(sh.th, 0) + '^\\circ+' + fx(top, 0) + '^\\circ\\approx 180^\\circ') + ' ✓']), hints: ['In one right triangle, the top angle is 90° minus the base angle.', 'The pole splits the top angle into two equal parts.'], text: 'tent top angle' });
            p.check = chk; return p;
          } }] },
      { num: '13', stem: function (sh) { return sh.who + ' is solving a right triangle with ' + t('\\angle A=' + dg(sh.A)) + ' and a hypotenuse of ' + L(sh.c, 'm') + '. To find the leg <b>opposite</b> ' + t('\\angle A') + ', ' + he(sh.who) + ' wrote ' + t('\\cos ' + dg(sh.A) + '=' + fr('x', sh.c)) + ' and got ' + t('x=' + fx(sh.c * TR.cos(sh.A))) + ' m.'; },
        shared: function (r) { return find(function () { return { c: r.int(9, 22), A: intNot(r, 26, 41, [35, 38]), who: r.pick(NAMES) }; }, function (v) { return safe(v.c * TR.sin(v.A)) && safe(v.c * TR.cos(v.A)); }); },
        parts: [
          { id: '13a', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var hc = rd(sh.c / Math.SQRT2), x = fx(sh.c * TR.cos(sh.A));
            return P.mc(r, 'Without a calculator: why can’t ' + his(sh.who) + ' answer be right?', [
              { html: 'The leg opposite ' + D(sh.A) + ' faces the <b>smaller</b> acute angle, so it is the shorter leg. At 45° both legs would be about ' + L(hc, 'm') + ', so it must be less than that; ' + x + ' m is too long.', right: true },
              { html: 'A leg can’t be longer than the hypotenuse.', why: 'True, but ' + x + ' m is shorter than ' + sh.c + ' m, so that isn’t what’s wrong here.', code: 'm13-hyp' },
              { html: 'The answer should be exactly half of ' + sh.c + ' m.', why: 'Half the hypotenuse is only right at 30°.', code: 'm13-half' },
              { html: 'Cosine is never used to find a side.', why: 'Cosine finds sides all the time: the <b>adjacent</b> side.', code: 'm13-never' }],
              'The two acute angles are ' + D(sh.A) + ' and ' + D(90 - sh.A) + '. The leg opposite the smaller angle is the shorter leg. At 45° both legs would be ' + t(N(sh.c) + '\\div\\sqrt2\\approx ' + N(hc)) + ' m, so the leg opposite ' + D(sh.A) + ' is less than that. ' + x + ' m is too long.',
              ['Which acute angle is bigger: ' + sh.A + '° or the other one? The bigger angle faces the longer leg.'], 'why not right');
          } },
          { id: '13b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var v = sh.c * TR.sin(sh.A);
            return GP.len('Find the correct length of the leg opposite ' + t('\\angle A') + ', to the nearest tenth.', v, { unit: 'm', trig: { fn: 'sin', deg: sh.A, side: sh.c, op: 'mul' }, sol: br(['The opposite side and the hypotenuse go with sine, not cosine. (Cosine gave the adjacent leg.)', t('x=' + sh.c + '\\sin ' + dg(sh.A) + toN(v)) + ' m']), hints: ['Opp and hyp: which ratio? (Leave out adj.)'], text: 'fix the ratio' });
          } }] },
      { num: '14', stem: 'Without solving, decide whether each statement is reasonable.', shared: function (r) {
          var p = r.int(4, 11), qq = r.int(p + 2, p + 8), cr = Math.hypot(p, qq);
          return { p: p, qq: qq, okA: r.chance(0.3), clA: q(qq - pickR(r, 0.5, 1.5, 0.5)), cr: rd(cr), who: r.sample(NAMES, 4),
            okB: r.chance(0.3), cosBad: pickR(r, 1.1, 1.6, 0.05), cosOk: pickR(r, 0.25, 0.95, 0.05),
            okC: r.chance(0.3), a1: r.int(12, 30), dC: r.pick([-12, -10, 10, 12]),
            okD: r.chance(0.4), Lr: pickR(r, 3, 9, 0.5) };
        },
        parts: [
          { id: '14a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var cl = sh.okA ? sh.cr : sh.clA;
            return P.mc(r, 'The legs of a right triangle are ' + L(sh.p, 'm') + ' and ' + L(sh.qq, 'm') + ', and ' + sh.who[0] + ' says the hypotenuse is ' + L(cl, 'm') + '.', [
              { html: '<b>Not reasonable.</b> The hypotenuse must be longer than the longer leg (' + L(sh.qq, 'm') + ').', right: !sh.okA, why: L(cl, 'm') + ' <b>is</b> longer than both legs.', code: 'r14a-short' },
              { html: '<b>Reasonable.</b> It is longer than both legs, but shorter than the two legs added together.', right: sh.okA, why: 'Compare ' + L(cl, 'm') + ' with the longer leg, ' + L(sh.qq, 'm') + '. The hypotenuse is the longest side.', code: 'r14a-ok' },
              { html: '<b>Not reasonable.</b> The hypotenuse should be ' + t(sh.p + '+' + sh.qq + '=' + (sh.p + sh.qq)) + ' m.', why: 'Adding the legs is the long way round. The hypotenuse is shorter than that.', code: 'r14a-add' },
              { html: '<b>Reasonable.</b> The hypotenuse is between the two legs.', why: 'The hypotenuse is never between the legs: it is the <b>longest</b> side.', code: 'r14a-between' }],
              sh.okA ? 'Reasonable: ' + L(cl, 'm') + ' is longer than ' + L(sh.qq, 'm') + ' but less than ' + (sh.p + sh.qq) + ' m. (It is ' + t('\\sqrt{' + sh.p + '^2+' + sh.qq + '^2}\\approx ' + fx(Math.hypot(sh.p, sh.qq))) + ' m.)' : 'Not reasonable: the hypotenuse must be longer than the ' + sh.qq + ' m leg. (It is actually ' + t('\\sqrt{' + sh.p + '^2+' + sh.qq + '^2}\\approx ' + fx(Math.hypot(sh.p, sh.qq))) + ' m.)',
              ['The hypotenuse is the longest side.'], 'reasonable hyp');
          } },
          { id: '14b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.okB ? sh.cosOk : sh.cosBad;
            return P.mc(r, sh.who[1] + ' found that ' + t('\\cos\\theta=' + N(v)) + ' for an acute angle θ in a right triangle.', [
              { html: '<b>Not reasonable.</b> ' + t('\\cos\\theta=\\text{adj}\\div\\text{hyp}') + ', and the adj is always shorter than the hyp, so ' + t('\\cos\\theta') + ' is less than 1.', right: !sh.okB, why: N(v) + ' <b>is</b> less than 1.', code: 'r14b-not' },
              { html: '<b>Reasonable.</b> ' + t('\\cos\\theta=\\text{adj}\\div\\text{hyp}') + ' is always less than 1, and so is ' + N(v) + '.', right: sh.okB, why: 'Is ' + N(v) + ' less than 1? A cosine must be.', code: 'r14b-ok' },
              { html: '<b>Not reasonable.</b> A cosine must be more than 1.', why: 'adj ÷ hyp: the adjacent side is shorter than the hyp, so the answer is less than 1.', code: 'r14b-more' },
              { html: '<b>Reasonable.</b> Any decimal can be a cosine.', why: 'adj ÷ hyp is always less than 1 (the hyp is the longest side).', code: 'r14b-any' }],
              (sh.okB ? 'Reasonable: ' : 'Not reasonable: ') + t('\\cos\\theta=\\text{adj}\\div\\text{hyp}') + ', and the adjacent side is shorter than the hypotenuse, so a cosine is less than 1. ' + N(v) + (sh.okB ? ' is less than 1.' : ' is more than 1.'), ['Which side is on the bottom of cos θ? Is it the longest side?'], 'reasonable cos');
          } },
          { id: '14c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var a2 = sh.okC ? 90 - sh.a1 : 90 - sh.a1 + sh.dC, sum = sh.a1 + a2;
            return P.mc(r, 'In a right triangle, ' + sh.who[2] + ' says the two acute angles are ' + D(sh.a1) + ' and ' + D(a2) + '.', [
              { html: '<b>Not reasonable.</b> The two acute angles must add to 90°, but these add to ' + D(sum) + '.', right: !sh.okC, why: 'Add them: ' + t(sh.a1 + '^\\circ+' + a2 + '^\\circ=' + sum + '^\\circ') + '.', code: 'r14c-not' },
              { html: '<b>Reasonable.</b> The two acute angles add to 90°.', right: sh.okC, why: 'Add them: ' + t(sh.a1 + '^\\circ+' + a2 + '^\\circ=' + sum + '^\\circ') + '.', code: 'r14c-ok' },
              { html: '<b>Reasonable.</b> Both angles are less than 90°, so they are acute.', why: 'Being acute isn’t enough: with the 90° angle, all three must add to 180°.', code: 'r14c-acute' },
              { html: '<b>Not reasonable.</b> The angles of a triangle add to 360°.', why: 'The angles of a triangle add to <b>180°</b>.', code: 'r14c-360' }],
              t(sh.a1 + '^\\circ+' + a2 + '^\\circ=' + sum + '^\\circ') + '. The two acute angles of a right triangle add to 90° (the right angle takes the other 90°), so this is ' + (sh.okC ? 'reasonable.' : 'not reasonable.'), ['The three angles add to 180°, and one of them is 90°.'], 'reasonable angles');
          } },
          { id: '14d', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var half = q(sh.Lr / 2), bad = rd(sh.Lr * TR.cos(30)), cl = sh.okD ? half : bad;
            return P.mc(r, 'A ramp ' + L(sh.Lr, 'm') + ' long rises at 30°. ' + sh.who[3] + ' says it rises ' + L(cl, 'm') + '.', [
              { html: '<b>Reasonable.</b> At 30°, the side opposite the angle is half the hypotenuse: ' + t(N(sh.Lr) + '\\div 2=' + N(half)) + ' m.', right: sh.okD, why: 'At 30° the rise is half the ramp: ' + t(N(sh.Lr) + '\\div 2=' + N(half)) + ' m, not ' + N(cl) + ' m.', code: 'r14d-ok' },
              { html: '<b>Not reasonable.</b> At 30°, the rise should be half the ramp, ' + t(N(half)) + ' m.', right: !sh.okD, why: 'Half of ' + N(sh.Lr) + ' is ' + N(half) + ': that is what was said.', code: 'r14d-not' },
              { html: '<b>Reasonable.</b> The rise is less than the length of the ramp.', why: 'True, but not enough. Use the 30° benchmark: the opposite side is half the hypotenuse.', code: 'r14d-less' },
              { html: '<b>Not reasonable.</b> A ramp at 30° rises 30% of its length.', why: 'An angle is not a percent. At 30° the rise is half the ramp (50%).', code: 'r14d-pct' }],
              'Benchmark: at 30° the opposite side is half the hypotenuse: ' + t(N(sh.Lr) + '\\div 2=' + N(half)) + ' m (' + t(N(sh.Lr) + '\\sin 30^\\circ=' + N(half)) + '). So ' + N(cl) + ' m is ' + (sh.okD ? 'reasonable.' : 'not reasonable (that would be the horizontal run, from cos).'), ['At 30°, how does the opposite side compare with the hypotenuse?'], 'reasonable 30°');
          } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'BEG', outcome: 'G4', make: function (r) {
          var c = r.int(10, 25), th = intNot(r, 22, 68, [35, 38, 45]), adj = r.chance(0.6), sd = adj ? 'adjacent to' : 'opposite';
          var o = [{ k: 'sin', html: t('x=' + c + '\\sin ' + dg(th)) }, { k: 'cos', html: t('x=' + c + '\\cos ' + dg(th)) }, { k: 'div', html: t('x=' + c + '\\div\\cos ' + dg(th)) }, { k: 'tan', html: t('x=' + c + '\\tan ' + dg(th)) }];
          var right = adj ? 'cos' : 'sin';
          return P.mc(r, 'In a right triangle, the hypotenuse is ' + c + ' cm and one acute angle is ' + D(th) + '. Which equation gives ' + t('x') + ', the leg ' + sd + ' the ' + D(th) + ' angle?', o.map(function (z) {
            return { html: z.html, right: z.k === right, code: 'e15-' + z.k, why: z.k === 'div' ? 'x is on <b>top</b> of the ratio, so multiply. Dividing gives more than ' + c + ' cm: longer than the hyp!' : z.k === 'tan' ? 'Tan uses opp and adj, with no hyp. Here the hyp is known.' : z.k === 'sin' ? 'Sine gives the <b>opposite</b> leg. You want the adjacent leg: CAH.' : 'Cosine gives the <b>adjacent</b> leg. You want the opposite leg: SOH.' };
          }), 'The ' + (adj ? 'adjacent' : 'opposite') + ' side and the hyp go with ' + (adj ? 'cosine' : 'sine') + ': ' + t('\\' + right + ' ' + dg(th) + '=' + fr('x', c)) + ', so ' + t('x=' + c + '\\' + right + ' ' + dg(th) + '\\approx ' + fx(c * TR[right](th))) + ' cm.', ['Leave one out: which side is not involved?'], 'which equation');
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { Ln: pickR(r, 2, 5, 0.5), h: pickR(r, 0.4, 1.4, 0.1) }; }, function (v) { var a = INV.sin(v.h / v.Ln); return a > 6 && a < 30 && safe(a) && rd(INV.tan(v.h / v.Ln)) !== rd(a) && !(v.Ln === 3 && v.h === 0.9); });
          var a = INV.sin(s.h / s.Ln), b = INV.tan(s.h / s.Ln), c = 90 - a, d = s.h / s.Ln;
          var opts = [{ html: t(fx(a) + '^\\circ'), right: true }, { html: t(fx(b) + '^\\circ'), why: 'That uses tan, as if ' + s.Ln + ' m were the horizontal. The ramp is the sloped side: the hyp.', code: 'r16-tan' },
            { html: t(fx(c) + '^\\circ'), why: 'That is the angle at the top of the ramp. You want the angle with the ground.', code: 'r16-top' }];
          if (rd(d) !== rd(a) && rd(d) !== rd(b) && rd(d) !== rd(c)) opts.push({ html: t(fx(d) + '^\\circ'), why: 'That is just ' + s.h + ' ÷ ' + s.Ln + '. Use the inverse key to turn the ratio into an angle.', code: 'r16-ratio' });
          else opts.push({ html: t(fx(INV.sin(s.h / s.Ln) * RAD) + '^\\circ'), why: G.RAD_HINT, code: 'r16-rad' });
          return P.mc(r, 'A loading ramp is ' + L(s.Ln, 'm') + ' long and rises ' + L(s.h, 'm') + '. To the nearest tenth of a degree, the angle between the ramp and the ground is', opts,
            s.h + ' m is opp and ' + s.Ln + ' m (the ramp) is hyp: ' + t('\\sin^{-1}\\!\\left(' + fr(N(s.h), N(s.Ln)) + '\\right)' + toN(a) + '^\\circ'), ['The ramp is the sloped side.'], 'ramp angle MC');
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { a: r.int(7, 16), b: r.int(4, 10) }; }, function (v) { return v.b < v.a && safe(INV.tan(v.b / v.a), 0) && !(v.a === 11 && v.b === 6); });
          var B = INV.tan(s.b / s.a);
          return GP.trigAngle('<b>Numerical response.</b> In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('a=' + s.a) + ' m and ' + t('b=' + s.b) + ' m. The measure of ' + t('\\angle B') + ', to the nearest degree, is ___°.', B, { nr: true, ratio: { fn: 'tan', num: s.b, den: s.a },
            sol: br(['From ∠B: ' + t('b=' + s.b) + ' m is opp (across from B) and ' + t('a=' + s.a) + ' m is adj → TOA.', t('\\angle B=\\tan^{-1}\\!\\left(' + fr(s.b, s.a) + '\\right)' + toN(B, 0) + '^\\circ')]), hints: ['Sketch it with the right angle at C. Side b is across from ∠B.'], text: 'NR angle B' });
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { h: r.int(14, 40), th: r.int(50, 72) }; }, function (v) { var w = v.h / TR.sin(v.th); return safe(w) && w < 99.9 && !(v.h === 24 && v.th === 63); });
          var w = s.h / TR.sin(s.th);
          return GP.len('<b>Numerical response.</b> A guy wire runs from a point ' + L(s.h, 'm') + ' up a radio tower to an anchor in the ground. The wire makes an angle of ' + D(s.th) + ' with the ground. The length of the wire, to the nearest tenth of a metre, is ___ m.', w, { nr: true, unit: 'm', trig: { fn: 'sin', deg: s.th, side: s.h, op: 'div' },
            sol: br([s.h + ' m is opp, the wire is hyp → SOH: ' + t(fnT('sin', s.th) + '=' + fr(s.h, 'w')), 'w is on the bottom: ' + t('w=' + s.h + '\\div\\sin ' + dg(s.th) + toN(w)) + ' m']), hints: ['The wire is the hypotenuse. Is it on the top or the bottom of the ratio?'], text: 'NR guy wire' });
        } }] }
    ],
    extra: [
      /* ---------------- A. Skills ---------------- */
      { num: '1', section: 'A. Skills', stem: 'Name the tool. Then find <i>x</i>.', shared: function (r) {
          var pq = find(function () { return [pickR(r, 1.2, 4, 0.2), pickR(r, 5, 9.6, 0.2)]; }, function (v) { return safe(Math.hypot(v[0], v[1])); });
          var s2 = find(function () { return { o: r.int(8, 24), d: intNot(r, 40, 66, [62, 52, 45]) }; }, function (v) { return safe(v.o / TR.sin(v.d)); });
          var s3 = find(function () { var h = 5 * r.int(3, 8); return { a: r.int(Math.round(h * 0.45), h - 2), h: h }; }, function (v) { return safe(INV.cos(v.a / v.h), 0) && INV.cos(v.a / v.h) > 15; });
          return { pq: pq, s2: s2, s3: s3 };
        },
        parts: [
          { id: 'x1a', level: 'BEG', outcome: 'G2', make: function (r, sh) { return pythHypPart(sh.pq[0], sh.pq[1], 'm', { lead: 'Name the tool, then find <i>x</i> to the nearest tenth.' }); } },
          { id: 'x1b', level: 'EMG', outcome: 'G4', make: function (r, sh) { return trigSidePart(sh.s2.d, 'opp', sh.s2.o, 'hyp', 'cm'); } },
          { id: 'x1c', level: 'EMG', outcome: 'G4', make: function (r, sh) { return trigAnglePart('adj', sh.s3.a, 'hyp', sh.s3.h, 'ft'); } }] },
      { num: '2', stem: '', parts: [
        { id: 'x2', level: 'PRG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { A: intNot(r, 52, 72, [62]), b: pickR(r, 3, 7, 0.5) }; }, function (v) { return safe(v.b * TR.tan(v.A)) && safe(v.b / TR.cos(v.A)); });
          var a = s.b * TR.tan(s.A), c = s.b / TR.cos(s.A);
          var svg = G.rightTriSVG({ A: s.A, b: s.b, sides: { a: 'a', b: lab(s.b, 'm'), c: 'c' }, angles: { A: s.A + '°' }, width: 220, px: 170 });
          return P.fields('Solve ' + t('\\triangle ABC') + ', where ' + t('\\angle C=90^\\circ') + ', ' + t('\\angle A=' + dg(s.A)) + ' and ' + t('b=' + N(s.b)) + ' m: find ' + t('\\angle B') + ', ' + t('a') + ' and ' + t('c') + '.' + svg,
            [{ label: t('\\angle B='), after: '°', name: '∠B' }, { label: t('a='), after: 'm', name: 'a' }, { label: t('c='), after: 'm', name: 'c' }],
            [compChk(90 - s.A, s.A, '∠A'), G.lenChk(a, { trig: { fn: 'tan', deg: s.A, side: s.b, op: 'mul' } }), G.lenChk(c, { trig: { fn: 'cos', deg: s.A, side: s.b, op: 'div' } })],
            [String(90 - s.A), key(a), key(c)], t('\\angle B=' + dg(90 - s.A) + ',\\ a\\approx ' + fx(a) + '\\text{ m},\\ c\\approx ' + fx(c) + '\\text{ m}'),
            br([t('\\angle B=90^\\circ-' + dg(s.A) + '=' + dg(90 - s.A)), 'From ∠A: a is opp, ' + L(s.b, 'm') + ' is adj → TOA: ' + t('a=' + N(s.b) + '\\tan ' + dg(s.A) + toN(a)) + ' m',
              'From ∠A: ' + L(s.b, 'm') + ' is adj, c is hyp → CAH: ' + t(fnT('cos', s.A) + '=' + fr(N(s.b), 'c')) + ', so ' + t('c=' + N(s.b) + '\\div\\cos ' + dg(s.A) + toN(c)) + ' m', 'Check: c is the longest side ✓']),
            ['Label from ∠A: b is next to it (adj).', 'For c, the unknown is on the bottom: divide.'], 'solve: angle + adj');
        } }] },
      { num: '3', stem: function (sh) { return 'Solve ' + t('\\triangle ABC') + ', where ' + t('\\angle C=90^\\circ') + ', ' + t('a=' + sh.a) + ' ft and the hypotenuse ' + t('c=' + sh.c) + ' ft. (Sketch it first.)'; },
        shared: function (r) { return find(function () { var a = r.int(7, 18); return { a: a, c: r.int(a + 4, a + 12) }; }, function (v) { return !(v.a === 13 && v.c === 21) && safe(Math.sqrt(v.c * v.c - v.a * v.a)) && safe(INV.sin(v.a / v.c), 0); }); },
        parts: [
          { id: 'x3a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var b = Math.sqrt(sh.c * sh.c - sh.a * sh.a);
            return GP.len('Find ' + t('b') + ', to the nearest tenth.', b, { unit: 'ft', pyth: { hyp: sh.c, leg: sh.a }, sol: br([tri({ a: sh.a, c: sh.c, names: ['A', 'B', 'C'], sides: { a: sh.a + ' ft', b: 'b', c: sh.c + ' ft' }, width: 200 }), 'c is the hypotenuse, so subtract: ' + t('b=\\sqrt{' + sh.c + '^2-' + sh.a + '^2}=\\sqrt{' + (sh.c * sh.c - sh.a * sh.a) + '}' + toN(b)) + ' ft']), hints: ['c (across from the right angle) is the hypotenuse.', 'To find a leg, subtract the squares.'], text: 'solve: leg b' });
          } },
          { id: 'x3b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            return anglesPart('Find ' + t('\\angle A') + ' and ' + t('\\angle B') + ', to the nearest degree.', 'A', 'B', 'sin', sh.a, sh.c, { lead: 'From ∠A: ' + t('a=' + sh.a) + ' ft is opp and ' + t('c=' + sh.c) + ' ft is hyp → SOH.', text: 'solve: angles from leg + hyp' });
          } }] },
      { num: '4', stem: function (sh) { return 'Solve ' + t('\\triangle PQR') + ', where ' + t('\\angle R=90^\\circ') + ', ' + t('PR=' + N(sh.pr)) + ' cm and ' + t('QR=' + N(sh.qr)) + ' cm.' + tri({ a: sh.qr, b: sh.pr, names: ['P', 'Q', 'R'], sides: { a: lab(sh.qr, 'cm'), b: lab(sh.pr, 'cm') }, width: 200 }); },
        shared: function (r) { return find(function () { var pr = pickR(r, 2, 6, 0.1); return { pr: pr, qr: pickR(r, pr + 2.5, 10, 0.1) }; }, function (v) { return safe(Math.hypot(v.pr, v.qr)) && safe(INV.tan(v.qr / v.pr), 0) && !(v.pr === 3.5 && v.qr === 8.4); }); },
        parts: [
          { id: 'x4a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var c = Math.hypot(sh.pr, sh.qr);
            return GP.len('Find ' + t('PQ') + ', to the nearest tenth.', c, { unit: 'cm', pyth: { legs: [sh.pr, sh.qr] }, sol: br([t('PQ=\\sqrt{' + N(sh.pr) + '^2+' + N(sh.qr) + '^2}=\\sqrt{' + N(q(sh.pr * sh.pr + sh.qr * sh.qr)) + '}' + toN(c)) + ' cm']), hints: ['PQ is across from the right angle: add the squares.'], text: 'solve: PQ' });
          } },
          { id: 'x4b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            return anglesPart('Find ' + t('\\angle P') + ' and ' + t('\\angle Q') + ', to the nearest degree.', 'P', 'Q', 'tan', sh.qr, sh.pr, { lead: 'From ∠P: ' + L(sh.qr, 'cm') + ' is opp and ' + L(sh.pr, 'cm') + ' is adj → TOA.', text: 'solve: angles P, Q' });
          } }] },
      { num: '5', stem: function (sh) { return sh.who + ' solved a right triangle with ' + t('\\angle A=' + dg(sh.A)) + ' and a hypotenuse of ' + L(sh.c, 'cm') + '. ' + cap(he(sh.who)) + ' wrote: ' + t('a=' + fx(sh.c * TR.cos(sh.A))) + ' cm (opposite ' + t('\\angle A') + ') and ' + t('b=' + fx(sh.c * TR.sin(sh.A))) + ' cm.'; },
        shared: function (r) { return find(function () { return { A: r.pick([25, 28, 30, 30, 32, 36, 40]), c: r.int(8, 20), who: r.pick(NAMES) }; }, function (v) { return safe(v.c * TR.sin(v.A)) && safe(v.c * TR.cos(v.A)); }); },
        parts: [
          { id: 'x5a', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var b30 = sh.A === 30;
            return P.mc(r, 'How can you tell ' + he(sh.who) + ' made a mistake?', [
              { html: 'The side opposite the smaller angle (' + D(sh.A) + ') must be the shorter leg, but ' + he(sh.who) + ' made it the longer one.', right: true },
              { html: 'The two legs should be equal.', why: 'The legs are only equal at 45°.', code: 'x5-equal' },
              { html: 'Both legs should be longer than ' + sh.c + ' cm.', why: 'The hypotenuse is the <b>longest</b> side: the legs are shorter.', code: 'x5-longer' },
              { html: 'The legs should add to ' + sh.c + ' cm.', why: 'The legs don’t add to the hypotenuse (their squares do).', code: 'x5-add' }],
              'The acute angles are ' + D(sh.A) + ' and ' + D(90 - sh.A) + '. The side opposite the smaller angle is the shorter leg, but ' + he(sh.who) + ' made ' + t('a') + ' the longer one.' + (b30 ? ' Also, at 30° the opposite side is half the hyp: ' + t(sh.c + '\\div 2=' + N(sh.c / 2)) + ' cm.' : '') + ' ' + cap(he(sh.who)) + ' swapped sine and cosine.', ['Which acute angle is smaller? Which leg faces it?'], 'spot the swap');
          } },
          { id: 'x5b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var a = sh.c * TR.sin(sh.A), b = sh.c * TR.cos(sh.A);
            return P.fields('Fix it: find the correct ' + t('a') + ' and ' + t('b') + ', to the nearest tenth.', [{ label: t('a='), after: 'cm', name: 'a' }, { label: t('b='), after: 'cm', name: 'b' }],
              [G.lenChk(a, { trig: { fn: 'sin', deg: sh.A, side: sh.c, op: 'mul' } }), G.lenChk(b, { trig: { fn: 'cos', deg: sh.A, side: sh.c, op: 'mul' } })], [key(a), key(b)], t('a\\approx ' + fx(a) + '\\text{ cm},\\ b\\approx ' + fx(b) + '\\text{ cm}'),
              br(['a is opp ∠A → SOH: ' + t('a=' + sh.c + '\\sin ' + dg(sh.A) + toN(a)) + ' cm', 'b is adj ∠A → CAH: ' + t('b=' + sh.c + '\\cos ' + dg(sh.A) + toN(b)) + ' cm']), ['a is across from ∠A: opp and hyp → sine.'], 'fix the swap');
          } }] },
      /* ---------------- B. Applying ---------------- */
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A ' + L(sh.L, 'm') + ' guy wire is fastened to a cell tower ' + L(sh.h, 'm') + ' above the ground.'; },
        shared: function (r) { return find(function () { var Ln = r.int(22, 48); return { L: Ln, h: r.int(Math.round(Ln * 0.55), Ln - 3) }; }, function (v) { return safe(INV.sin(v.h / v.L), 0) && safe(Math.sqrt(v.L * v.L - v.h * v.h)) && !(v.L === 35 && v.h === 30); }); },
        parts: [
          { id: 'x6a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var a = INV.sin(sh.h / sh.L);
            return GP.trigAngle('What angle does the wire make with the ground, to the nearest degree?', a, { ratio: { fn: 'sin', num: sh.h, den: sh.L }, sol: br([sh.h + ' m is opp, the ' + sh.L + ' m wire is hyp → SOH.', t('\\theta=\\sin^{-1}\\!\\left(' + fr(sh.h, sh.L) + '\\right)' + toN(a, 0) + '^\\circ')]), hints: ['Sketch it: the tower is vertical, the wire is the hypotenuse.'], text: 'guy wire angle' });
          } },
          { id: 'x6b', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var d = Math.sqrt(sh.L * sh.L - sh.h * sh.h);
            return GP.len('How far from the base of the tower is the wire anchored, to the nearest tenth of a metre?', d, { unit: 'm', pyth: { hyp: sh.L, leg: sh.h }, sol: br(['Pythagoras (the given numbers): ' + t('d=\\sqrt{' + sh.L + '^2-' + sh.h + '^2}=\\sqrt{' + (sh.L * sh.L - sh.h * sh.h) + '}' + toN(d)) + ' m']), hints: ['The wire is the hypotenuse: subtract the squares.'], text: 'guy wire distance' });
          } }] },
      { num: '7', stem: function (sh) { return 'A plane flying at ' + L(sh.H, 'm') + ' starts a straight descent to the runway at ' + sh.city + '’s airport at an angle of depression of ' + D(sh.th) + '.'; },
        shared: function (r) { return find(function () { return { H: 100 * r.int(6, 16), th: r.int(2, 5), city: r.pick(['Calgary', 'Edmonton', 'Lethbridge', 'Grande Prairie']) }; }, function (v) { return safe(v.H / TR.tan(v.th) / 1000) && safe(v.H / TR.sin(v.th) / 1000) && !(v.H === 1200 && v.th === 3); }); },
        parts: [
          { id: 'x7a', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var m = sh.H / TR.tan(sh.th), km = m / 1000;
            return GP.len('How far does the plane travel along the ground before it lands? Give your answer in <b>km</b>, to the nearest tenth.', km, { unit: 'km', trig: { fn: 'tan', deg: sh.th, side: sh.H / 1000, op: 'div' }, alts: [{ v: m, code: 'u7l9-metres', hint: 'That is in metres. Change to kilometres: divide by 1000.' }], sol: br(['The angle of elevation from the runway is also ' + D(sh.th) + ' (alternate interior angles).', sh.H + ' m is opp, the ground distance is adj → TOA: ' + t('d=' + N(sh.H) + '\\div\\tan ' + dg(sh.th) + '=' + rawN(m)) + ' m', t(rawN(m) + '\\text{ m}\\div 1000' + toN(km)) + ' km']), hints: ['The height is opp and the ground distance is adj: ÷ tan.', 'Then change metres to kilometres.'], text: 'plane ground distance' });
          } },
          { id: 'x7b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var m = sh.H / TR.sin(sh.th), km = m / 1000;
            return GP.len('How far does it fly along its slanted path? Give your answer in <b>km</b>, to the nearest tenth.', km, { unit: 'km', trig: { fn: 'sin', deg: sh.th, side: sh.H / 1000, op: 'div' }, alts: [{ v: m, code: 'u7l9-metres', hint: 'That is in metres. Change to kilometres: divide by 1000.' }], sol: br(['The path is the hyp → SOH: ' + t('p=' + N(sh.H) + '\\div\\sin ' + dg(sh.th) + '=' + rawN(m)) + ' m', t(rawN(m) + '\\text{ m}\\div 1000' + toN(km)) + ' km']), hints: ['The height is opp and the path is hyp: ÷ sin.'], text: 'plane path' });
          } },
          { id: 'x7c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var diff = sh.H / TR.sin(sh.th) - sh.H / TR.tan(sh.th);
            return P.mc(r, 'Why are your two answers so close?', [
              { html: 'The angle is very small, so the triangle is long and flat. The hypotenuse is only a little longer than the adjacent side.', right: true },
              { html: 'Sine and tangent are always equal.', why: 'They are only close for <b>small</b> angles. At 45°, sin is 0.71 and tan is 1.', code: 'x7-equal' },
              { html: 'Both answers were rounded, so they are really the same length.', why: 'The path (the hyp) is longer: about ' + Math.round(diff) + ' m more. Rounding to the nearest tenth of a km hides it.', code: 'x7-same' },
              { html: 'The plane flies faster on the way down.', why: 'Speed has nothing to do with the lengths of the sides.', code: 'x7-speed' }],
              'The angle is only ' + D(sh.th) + ', so the triangle is very long and flat. The hypotenuse is only about ' + Math.round(diff) + ' m longer than the ground distance.', ['Picture a very flat right triangle. How do the hyp and the long leg compare?'], 'why so close');
          } }] },
      { num: '8', stem: function (sh) { return 'An A-frame cabin near ' + sh.place + ' is ' + L(sh.W, 'm') + ' wide at the floor. Each side of the roof makes an angle of ' + D(sh.th) + ' with the floor, and the sides meet at the peak.' + tentSVG({ w: sh.W, h: sh.W / 2 * TR.tan(sh.th), labels: { base: lab(sh.W, 'm') }, angles: [['L0', 'R0', 'T', sh.th + '°', { r: 18 }], ['R0', 'L0', 'T', sh.th + '°', { r: 18 }]], width: 330, aria: 'A-frame cabin' }); },
        shared: function (r) { return find(function () { return { W: pickR(r, 6, 10, 0.2), th: intNot(r, 52, 66, [58, 62]), place: r.pick(['Canmore', 'Bragg Creek', 'Jasper', 'Cochrane']) }; }, function (v) { var hw = v.W / 2; return safe(hw * TR.tan(v.th)) && safe(hw / TR.cos(v.th)); }); },
        parts: [
          { id: 'x8a', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var hw = q(sh.W / 2), h = hw * TR.tan(sh.th);
            return GP.len('How tall is the cabin at the centre, to the nearest tenth of a metre?', h, { unit: 'm', trig: { fn: 'tan', deg: sh.th, side: hw, op: 'mul' }, alts: [{ v: sh.W * TR.tan(sh.th), code: 'u7l9-full-width', hint: 'The centre line cuts the floor in half: use ' + t(N(sh.W) + '\\div 2=' + N(hw)) + ' m.' }], sol: br(['Half the width: ' + t(N(sh.W) + '\\div 2=' + N(hw)) + ' m (adj to ' + D(sh.th) + ').', 'TOA: ' + t('h=' + N(hw) + '\\tan ' + dg(sh.th) + toN(h)) + ' m']), hints: ['Draw the line from the peak straight down: it cuts the floor in half.', 'Height is opp, half the width is adj: TOA.'], text: 'A-frame height' });
          } },
          { id: 'x8b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var hw = q(sh.W / 2), s = hw / TR.cos(sh.th);
            return GP.len('How long is each sloped side, to the nearest tenth of a metre?', s, { unit: 'm', trig: { fn: 'cos', deg: sh.th, side: hw, op: 'div' }, alts: [{ v: sh.W / TR.cos(sh.th), code: 'u7l9-full-width', hint: 'Use half the width, ' + N(hw) + ' m.' }], sol: br(['Half the width (' + N(hw) + ' m) is adj, the side is hyp → CAH.', t(fnT('cos', sh.th) + '=' + fr(N(hw), 's')) + ', so ' + t('s=' + N(hw) + '\\div\\cos ' + dg(sh.th) + toN(s)) + ' m']), hints: ['Adj and hyp → cosine. The unknown is on the bottom: divide.'], text: 'A-frame side' });
          } }] },
      { num: '9', stem: function (sh) { return 'A new ramp at a rink in ' + sh.town + ' is ' + L(sh.L, 'm') + ' long and rises ' + L(sh.h, 'm') + '.'; },
        shared: function (r) { return find(function () { return { L: pickR(r, 4, 8, 0.5), h: pickR(r, 0.4, 0.9, 0.05), town: r.pick(['Brooks', 'Olds', 'Camrose', 'Taber']) }; }, function (v) { var a = INV.sin(v.h / v.L); return a > 5.0 && a < 7.5 && safe(a) && safe(v.h / TR.sin(4.8)) && !(v.L === 6 && v.h === 0.55); }); },
        parts: [
          { id: 'x9a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var a = INV.sin(sh.h / sh.L);
            return GP.trigAngle('Find the angle of the ramp, to the nearest <b>tenth</b> of a degree.', a, { dp: 1, ratio: { fn: 'sin', num: sh.h, den: sh.L }, sol: br([sh.h + ' m is opp, the ramp (' + sh.L + ' m) is hyp → SOH.', t('\\theta=\\sin^{-1}\\!\\left(' + fr(N(sh.h), N(sh.L)) + '\\right)' + toN(a) + '^\\circ')]), hints: ['The ramp is the sloped side: the hyp.'], text: 'rink ramp angle' });
          } },
          { id: 'x9b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var a = INV.sin(sh.h / sh.L), Ln = sh.h / TR.sin(4.8);
            return P.fields('Is it within the guidance of about 4.8° or less? If not, how long should a ramp rising ' + L(sh.h, 'm') + ' at 4.8° be?', [{ label: 'Within the guidance? (yes/no)', mode: 'text', name: 'yes/no' }, { label: 'Length at 4.8°:', after: 'm', name: 'length' }],
              [yesNo('no', fx(a) + '° is <b>more</b> than 4.8°, so the ramp is too steep.'), G.lenChk(Ln, { trig: { fn: 'sin', deg: 4.8, side: sh.h, op: 'div' } })], ['no', key(Ln)], 'No; about ' + L(rd(Ln), 'm'),
              br(['No: ' + t(fx(a) + '^\\circ') + ' is more than 4.8°, so it is too steep.', 'At 4.8°: the rise is opp, the ramp is hyp → SOH: ' + t('x=' + N(sh.h) + '\\div\\sin 4.8^\\circ' + toN(Ln)) + ' m']), ['Compare your angle from (a) with 4.8°.', 'The ramp is on the bottom of the ratio: divide.'], 'rink ramp: new length');
          } }] },
      { num: '10', stem: '', parts: [
        { id: 'x10', level: 'BEG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { o: r.int(3, 12), a: r.int(4, 15) }; }, function (v) { return v.o !== v.a && !(v.o === 7 && v.a === 10); });
          return P.mc(r, 'In a right triangle, the side opposite θ is ' + s.o + ' cm and the side adjacent to θ is ' + s.a + ' cm. Which gives θ?', [
            { html: t('\\sin^{-1}\\!\\left(' + fr(s.o, s.a) + '\\right)'), why: 'Sine uses the hyp. Here you know opp and adj: TOA.', code: 'x10-sin' },
            { html: t('\\tan^{-1}\\!\\left(' + fr(s.o, s.a) + '\\right)'), right: true },
            { html: t('\\tan^{-1}\\!\\left(' + fr(s.a, s.o) + '\\right)'), why: 'Upside down: tan θ = opp ÷ adj (opp on top). That gives the other acute angle.', code: 'x10-flip' },
            { html: t('\\tan\\left(' + fr(s.o, s.a) + '\\right)'), why: 'To get an angle from a ratio, use the inverse key: tan⁻¹.', code: 'x10-noinv' }],
            'Opp and adj (no hyp) → TOA, opp on top: ' + t('\\theta=\\tan^{-1}\\!\\left(' + fr(s.o, s.a) + '\\right)\\approx ' + fx(INV.tan(s.o / s.a), 0) + '^\\circ'), ['No hyp → TOA. Which side goes on top?'], 'which inverse', true);
        } }] },
      { num: '11', stem: '', parts: [
        { id: 'x11', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { d: 10 * r.int(14, 40), Ls: 50 * r.int(12, 26), hill: r.pick(['Nakiska', 'Sunshine Village', 'Marmot Basin', 'Castle Mountain']) }; }, function (v) { var a = INV.sin(v.d / v.Ls); return a > 8 && a < 30 && safe(a, 0) && !(v.d === 240 && v.Ls === 950); });
          var a = INV.sin(s.d / s.Ls);
          return GP.trigAngle('<b>Numerical response.</b> A ski run at ' + s.hill + ' drops ' + L(s.d, 'm') + ' vertically over a slope length of ' + L(s.Ls, 'm') + '. The average angle of the slope with the horizontal, to the nearest degree, is ___°.', a, { nr: true, ratio: { fn: 'sin', num: s.d, den: s.Ls },
            sol: br([s.d + ' m is opp, ' + s.Ls + ' m (along the slope) is hyp → SOH.', t('\\sin^{-1}\\!\\left(' + fr(s.d, s.Ls) + '\\right)' + toN(a, 0) + '^\\circ')]), hints: ['The slope length is the sloped side: the hyp.'], text: 'NR ski run' });
        } }] },
      /* ---------------- C. Stretch ---------------- */
      { num: '12', section: 'C. Stretch', stem: '', parts: [
        { id: 'x12', level: 'MAS', outcome: 'G4', make: function (r) {
          var s = find(function () { var al = r.int(24, 40); return { d: 5 * r.int(6, 16), al: al, be: al + r.int(3, 8), who: r.pick(NAMES), city: r.pick(['Edmonton', 'Calgary', 'Red Deer', 'Lethbridge']) }; }, function (v) { var x = v.d * (TR.tan(v.be) - TR.tan(v.al)); return safe(x) && rd(rd(v.d * TR.tan(v.be)) - rd(v.d * TR.tan(v.al))) === rd(x) && !(v.d === 50 && v.al === 31); });
          var top = s.d * TR.tan(s.be), bot = s.d * TR.tan(s.al), v = top - bot;
          return GP.len(s.who + ' stands ' + L(s.d, 'm') + ' from an office building in ' + s.city + '. From the ground, the angle of elevation to the bottom of a flagpole on the roof is ' + D(s.al) + ', and to the top of the flagpole is ' + D(s.be) + '. How tall is the flagpole, to the nearest tenth of a metre?' + flagSVG(s.d, s.al, s.be), v, { unit: 'm', radTrap: false,
            alts: [{ v: s.d * TR.tan(s.be - s.al), code: 'u7l9-tan-diff', hint: 'You can’t subtract the angles first. Find the height to the top and to the bottom of the pole (each with tan), then subtract the heights.' },
              { v: top, code: 'u7l9-one', hint: 'That is the height to the <b>top</b> of the flagpole (building + pole). Subtract the building’s height.' }, { v: bot, code: 'u7l9-one', hint: 'That is the height of the building. Find the height to the top of the pole too, then subtract.' },
              { v: top + bot, code: 'u7l9-added', hint: 'The flagpole is the <b>difference</b> between the two heights.' }, { v: s.d / TR.tan(s.al) - s.d / TR.tan(s.be), code: 'trig-mul-div', hint: 'The heights are opp and ' + s.d + ' m is adj: height = ' + s.d + ' × tan θ (multiply).' },
              { v: s.d * (Math.tan(s.be) - Math.tan(s.al)), code: 'trig-rad', hint: G.RAD_HINT }],
            sol: br(['Two triangles share the ' + s.d + ' m side (adj in both) → TOA.', 'To the top of the flagpole: ' + t(N(s.d) + '\\tan ' + dg(s.be) + '=' + rawN(top)) + ' m', 'To the bottom (the roof): ' + t(N(s.d) + '\\tan ' + dg(s.al) + '=' + rawN(bot)) + ' m', 'Flagpole: ' + t(rawN(top) + '-' + rawN(bot) + toN(v)) + ' m']),
            hints: ['There are two right triangles. Both have the ' + s.d + ' m ground distance as the adj.', 'Find both heights, then subtract.'], text: 'flagpole on a roof' });
        } }] },
      { num: '13', stem: function (sh) { return 'A moving box is ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm tall. ' + sh.who + ' wants to fit a curtain rod in it, corner to corner.' + HW.solid('rectprism', { l: sh.l + ' cm', w: sh.w + ' cm', h: sh.h + ' cm', width: 230 }); },
        shared: function (r) { return find(function () { var l = 5 * r.int(10, 18); return { l: l, w: 5 * r.int(6, l / 5 - 2), h: 5 * r.int(6, 12), who: r.pick(NAMES) }; }, function (v) { var fd = Math.hypot(v.l, v.w), sd = Math.hypot(fd, v.h); return safe(fd) && safe(sd) && safe(INV.tan(v.h / fd), 0) && !(v.l === 60 && v.w === 40 && v.h === 45); }); },
        parts: [
          { id: 'x13a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var fd = Math.hypot(sh.l, sh.w), s2 = sh.l * sh.l + sh.w * sh.w;
            return GP.len('Find the diagonal of the bottom of the box, to the nearest tenth.', fd, { unit: 'cm', pyth: { legs: [sh.l, sh.w] }, sol: br(['The bottom is a rectangle; its diagonal is the hypotenuse of a right triangle with legs ' + sh.l + ' cm and ' + sh.w + ' cm.', t('\\sqrt{' + sh.l + '^2+' + sh.w + '^2}=\\sqrt{' + N(s2) + '}' + toN(fd)) + ' cm']), hints: ['Use the length and the width of the bottom.'], text: 'box floor diagonal' });
          } },
          { id: 'x13b', level: 'MAS', outcome: 'G2', make: function (r, sh) {
            var fd = Math.hypot(sh.l, sh.w), s2 = sh.l * sh.l + sh.w * sh.w, sd = Math.sqrt(s2 + sh.h * sh.h);
            var p = GP.len('The rod goes from a bottom corner to the opposite top corner. It makes a right triangle with the bottom diagonal and a ' + sh.h + ' cm edge. What is the longest rod that fits, to the nearest tenth?', sd, { unit: 'cm', sol: br([t('\\sqrt{' + N(s2) + '+' + sh.h + '^2}=\\sqrt{' + N(s2 + sh.h * sh.h) + '}' + toN(sd)) + ' cm', '(Use the full value ' + N(s2) + ' for the bottom diagonal squared, not the rounded ' + fx(fd) + '.)']), hints: ['The legs are the bottom diagonal (from part a) and the height.', 'Keep the full value of the bottom diagonal.'], text: 'box space diagonal' });
            p.check = early(G.lenChk(sd, { pyth: { legs: [fd, sh.h] }, alts: [{ v: Math.hypot(sh.l, sh.h), code: 'u7l9-one', hint: 'Use the <b>bottom diagonal</b> as one leg, not the length of the box.' }, { v: sh.l + sh.w + sh.h, code: 'pyth-add-sides', hint: 'Square the sides first, then add, then take the square root.' }] }), [Math.hypot(rd(fd), sh.h), Math.hypot(Math.round(fd), sh.h)], 1, 'Nearly! Use the <b>full</b> value of the bottom diagonal (' + N(s2) + ' when squared), not the rounded ' + fx(fd) + '.');
            return p;
          } },
          { id: 'x13c', level: 'MAS', outcome: 'G4', make: function (r, sh) {
            var fd = Math.hypot(sh.l, sh.w), a = INV.tan(sh.h / fd), sd = Math.hypot(fd, sh.h);
            var p = GP.trigAngle('What angle does that rod make with the bottom of the box, to the nearest degree?', a, { sol: br([sh.h + ' cm is opp and the bottom diagonal (' + t(rawN(fd)) + ' cm) is adj → TOA.', t('\\tan^{-1}\\!\\left(' + fr(sh.h, rawN(fd)) + '\\right)' + toN(a, 0) + '^\\circ') + ' (or ' + t('\\sin^{-1}(' + sh.h + '\\div ' + rawN(sd) + ')') + ')']), hints: ['The triangle stands up inside the box: the rod is the hyp, the height is opp, the bottom diagonal is adj.'], text: 'box rod angle' });
            p.check = early(G.angleRatioChk(a, { ratio: { fn: 'tan', num: sh.h, den: fd } }), [INV.tan(sh.h / rd(fd))], 0);
            return p;
          } }] }
    ]
  });
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
})(window);
