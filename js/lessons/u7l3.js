/* Math 10-3 · Unit 7 · Lesson 3 — The Pythagorean Theorem: Finding a Leg, and Squaring a Corner (G2; A1 for rearranging)
 * Assignment 3 (u7_l03.tex, Questions 1–17) and the Lesson 3 Extra Practice (u7_ep03.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the booklet situation with new numbers around the booklet's (the booklet's own numbers can
 * come up; the lesson's worked-example numbers — 17/8, 10.6/5.6, 7 & 4, 11/6, the 7.3 m ladder, the 45 m kite, the
 * 9.5/4.1/6.3 pair, the 9-40-41 / 7-9-12 / 3.3-5.6-6.5 / 15-9-13 table, the 30-40-49 bracket, the 6-8-10 deck, the
 * 1.2 × 2.4 bed — are left out). Calculator allowed. Figures from the shared kit HW.geo (rightTriSVG) and HW.fig.
 * Answers: lengths to the nearest tenth unless the booklet asks otherwise (hundredths for the gate and the ramp; whole
 * numbers for exact triples); an unrounded answer gets "now round it" (no try used). The length checks are
 * HW.geo.lenChk: adding the squares to find a leg (hyp used as a leg), no square root, subtracting the sides, 2a for a²,
 * a leg longer than the hypotenuse, adding to find the hypotenuse the wrong way; each gets its own hint. Rounding the shared
 * side too early in a two-triangle problem gets a nudge (the question says keep the full value); forgetting to halve the
 * span of a roof, using the full diagonal or the wrong side as the shared leg each get a hint.
 * Conversions:
 *   "name the hypotenuse and write the theorem with its letters" → multiple choice of (hypotenuse, equation) pairs;
 *   "rearrange the formula" → multiple choice of formulas (A1);
 *   "leg or hypotenuse? then find it" → a word box (leg / hypotenuse) and a number box;
 *   "is it a right triangle? show your work" → boxes for a² + b², c² and a yes / no word box;
 *   "draw a sketch" → choose the right sketch; "explain / what should she do / what does this tell them" → multiple
 *   choice of reasons; the 3-4-5 multiples table → the fill-in table (HW.pctKit.tablePart); "which multiple fits the
 *   tape" → three boxes (the two marks and the diagonal).
 * Levels: LIM BEG EMG PRG ADV MAS. MAS: Q9(b) (two triangles, full value kept), Extra 12(b) (garage peak from half the
 * span), Extra 13(b) (the biggest 3-4-5 multiple a short tape can check).
 * Outcome G2 throughout; Q6(b) and Extra 4(b) (rearranging a² + b² = c²) are A1.
 * Exports HW.u7pyth (missing leg / hypotenuse parts with worked lines, the right-triangle test part, exact-value and
 * leg/hypotenuse/yes/no word checkers, Pythagorean triples and near misses) for later Unit 7 lessons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P, PK = HW.pctKit;
  if (!G || !G.lenChk || !PK || !PK.tablePart) throw new Error('u7l3 needs HW.geo (js/geokit.js) and HW.pctKit (u1l7.js) loaded first');

  /* ================= numbers and words ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b)); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }                                   // TeX number (thin-space thousands)
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function rawN(x) { var s = +x.toFixed(3); return HW.fmt(String(s)) + (same(x, s) ? '' : '\\ldots'); }
  function toN(x, dp) { return same(x, rd(x, dp)) ? '=' + N(rd(x, dp)) : '=' + rawN(x) + '\\approx ' + fx(x, dp); }
  function sq(x) { return q(x * x); }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7l3: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, lo, hi, st) { return q(lo + st * r.int(0, Math.round((hi - lo) / st))); }
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function uT(u) { return u ? '\\text{ ' + u + '}' : ''; }
  function L(x, u) { return t(N(x) + uT(u)); }                             // a length in TeX
  function Lf(x, dp, u) { return t(fx(x, dp) + uT(u)); }                    // a rounded length, trailing zeros kept
  function lab(x, u) { return nS(x) + (u ? ' ' + u : ''); }                 // a length on a figure (plain text)
  function hasPair(list, a, b) { return list.some(function (p) { return (same(p[0], a) && same(p[1], b)) || (same(p[0], b) && same(p[1], a)); }); }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Priya', 'f'], ['Liam', 'm'], ['Hana', 'f'], ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'],
    ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Jaya', 'f'], ['Ethan', 'm'], ['Leah', 'f']];
  function person(r) { var p = r.pick(NAMES); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his' }; }

  /* Pythagorean triples (primitive), and the worked-example ones that are left out */
  var PRIM = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41], [28, 45, 53], [11, 60, 61], [16, 63, 65], [33, 56, 65], [48, 55, 73], [13, 84, 85], [36, 77, 85], [39, 80, 89], [65, 72, 97]];
  function triples(maxC, o) {
    o = o || {}; var out = [];
    PRIM.forEach(function (p) { for (var k = 1; k * p[2] <= maxC; k++) out.push([p[0] * k, p[1] * k, p[2] * k]); });
    return out.filter(function (tr) { return !(o.not || []).some(function (n) { return n[0] === tr[0] && n[1] === tr[1] && n[2] === tr[2]; }) && (!o.minC || tr[2] >= o.minC); });
  }
  var WORKED_TRIPLES = [[8, 15, 17], [9, 40, 41], [6, 8, 10], [30, 40, 50], [3, 4, 5]];

  /* ================= reading answers ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1);
    s = s.replace(/\\approx|≈/g, ' ').replace(/\\[,;: !]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z²³][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u7l3-comma', 'Use a decimal point (not a comma), like 37.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  function decs(x) { var s = nS(x); return (s.split('.')[1] || '').length; }
  /* an exact value (a square, a sum of squares, a 3-4-5 multiple). o.bad = [[value, code, hint]] */
  function exactChk(v, o) {
    o = o || {};
    var bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && !same(b[0], v); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (same(a.v, v)) return ok();
      for (var i = 0; i < bad.length; i++) if (same(a.v, bad[i][0])) return wrong(bad[i][1], bad[i][2]);
      if (a.d < decs(v) && Math.abs(a.v - v) < Math.pow(10, -a.d)) return form('u7l3-keep-decimals', 'Keep every decimal of the square — don’t round it.');
      return wrong('value', o.hint || null);
    };
  }
  /* a word: kind 'lh' (leg / hypotenuse) or 'yn' (yes / no). want = 'leg' | 'hyp' | 'yes' | 'no' */
  function lev(a, b) { var m = [], i, j; for (i = 0; i <= a.length; i++) { m[i] = [i]; } for (j = 0; j <= b.length; j++) m[0][j] = j; for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return m[a.length][b.length]; }
  function readWord(resp, kind) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!s) return 'empty';
    s = s.replace(/^(it is|it's|its|the|a|an)\s+/, '').replace(/\s+(side)$/, '');
    if (kind === 'lh') {
      if (/^legs?$/.test(s) || s === 'a leg') return 'leg';
      if (/^hyp/.test(s) || lev(s, 'hypotenuse') <= 3 || lev(s, 'hypothenuse') <= 2) return 'hyp';
      return null;
    }
    if (/^(yes|y|yep|yeah|yup|it is|right|true|yes it is)$/.test(s) || /^yes\b/.test(s)) return 'yes';
    if (/^(no|n|nope|not|false|isn't|it isn't|it is not)$/.test(s) || /^no\b/.test(s) || /^not\b/.test(s)) return 'no';
    return null;
  }
  function wordChk(want, kind, why) {
    return function (resp) {
      var w = readWord(resp, kind);
      if (w === 'empty') return form('empty', 'Type your answer first.');
      if (w == null) return form('u7l3-word', kind === 'lh' ? 'Type <b>leg</b> or <b>hypotenuse</b> (hyp is fine).' : 'Type <b>yes</b> or <b>no</b>.');
      if (w === want) return ok();
      return wrong(kind === 'lh' ? 'u7l3-leg-hyp' : 'u7l3-yes-no', why || null);
    };
  }
  HW.addCodes({
    'u7l3-comma': 'Decimal comma', 'u7l3-keep-decimals': 'Rounded a square', 'u7l3-word': 'Answer not leg/hypotenuse or yes/no', 'u7l3-leg-hyp': 'Mixed up leg and hypotenuse',
    'u7l3-yes-no': 'Wrong conclusion (right triangle or not)', 'u7l3-not-longest': 'Used a side that isn’t the longest as c', 'u7l3-no-square': 'Didn’t square the sides', 'u7l3-other-sum': 'Squared and added the wrong pair of sides',
    'u7l3-round-early': 'Rounded the shared side too early', 'u7l3-shared': 'Used the wrong shared side', 'u7l3-full-span': 'Used the full span instead of half', 'u7l3-round-squares': 'Rounded the squares',
    'u7l3-table-add': 'Added the multiplier instead of multiplying', 'u7l3-table-row': 'Multiplied the wrong side', 'u7l3-k-diag': 'Gave the diagonal instead of the multiplier', 'u7l3-tape-long': 'The diagonal doesn’t fit on the tape',
    'u7l3-tape-small': 'A smaller multiple than needed', 'u7l3-two-sides': 'Went along two sides instead of the diagonal', 'u7l3-tape-side': 'A mark longer than the wall', 'u7l3-not-345': 'The three lengths aren’t a 3-4-5 multiple'
  });

  /* ================= part builders ================= */
  /* the worked lines for a missing leg: nm² = hyp² − leg² … */
  function legLines(hyp, leg, nm, u, dp, o) {
    o = o || {}; var d = q(sq(hyp) - sq(leg)), v = Math.sqrt(d);
    return br([o.lead,
      t(nm + '^2=' + N(hyp) + '^2-' + N(leg) + '^2'),
      t(nm + '^2=' + N(sq(hyp)) + '-' + N(sq(leg)) + '=' + N(d)),
      t(nm + '=\\sqrt{' + N(d) + '}' + toN(v, dp)),
      o.end || ('The ' + (o.what || 'leg') + ' is ' + (same(v, rd(v, dp)) ? '' : 'about ') + Lf(v, dp, u) + '.' + (o.check === false ? '' : ' (' + fx(v, dp) + ' is less than ' + N(hyp) + ' ✓)'))]);
  }
  function hypLines(a, b, nm, u, dp, o) {
    o = o || {}; var s = q(sq(a) + sq(b)), v = Math.sqrt(s);
    return br([o.lead,
      t(nm + '^2=' + N(a) + '^2+' + N(b) + '^2'),
      t(nm + '^2=' + N(sq(a)) + '+' + N(sq(b)) + '=' + N(s)),
      t(nm + '=\\sqrt{' + N(s) + '}' + toN(v, dp)),
      o.end || ('The ' + (o.what || 'hypotenuse') + ' is ' + (same(v, rd(v, dp)) ? '' : 'about ') + Lf(v, dp, u) + '.')]);
  }
  var LEG_HINTS = ['To find a <b>leg</b>, subtract: leg² = hypotenuse² − other leg² (big square minus small square).', 'Then take the square root (2nd x²).'];
  var HYP_HINTS = ['To find the <b>hypotenuse</b>, add: c² = a² + b².', 'Then take the square root (2nd x²).'];
  /* a missing leg. o: unit, dp 1, name 'x', before (TeX in front of the box), sol, lead, hints, text, nr, alts, what, end */
  function legPart(prompt, hyp, leg, o) {
    o = o || {}; var v = Math.sqrt(q(sq(hyp) - sq(leg))), dp = o.dp == null ? 1 : o.dp, nm = o.name || 'x';
    var p = GP.len(prompt, v, { dp: dp, unit: o.unit, nr: o.nr, pyth: { hyp: hyp, leg: leg }, alts: o.alts, sol: o.sol || legLines(hyp, leg, nm, o.unit, dp, o), hints: o.hints || LEG_HINTS, text: o.text || 'leg' });
    if (o.before !== false && !o.nr) p.input.before = t((o.before || nm) + '=');
    return p;
  }
  function hypPart(prompt, a, b, o) {
    o = o || {}; var v = Math.sqrt(q(sq(a) + sq(b))), dp = o.dp == null ? 1 : o.dp, nm = o.name || 'c';
    var p = GP.len(prompt, v, { dp: dp, unit: o.unit, nr: o.nr, pyth: { legs: [a, b] }, alts: o.alts, sol: o.sol || hypLines(a, b, nm, o.unit, dp, o), hints: o.hints || HYP_HINTS, text: o.text || 'hypotenuse' });
    if (o.before !== false && !o.nr) p.input.before = t((o.before || nm) + '=');
    return p;
  }
  /* a drawn right triangle: right angle at the corner R ('bl' | 'br' | 'tl' | 'tr'); v = vertical leg, h = horizontal leg,
   * labels { v, h, c } (plain text); the unknown (a letter) in red */
  function triFig(v, h, labs, o) {
    o = o || {}; var sides = {}; if (labs.v != null) sides.a = labs.v; if (labs.h != null) sides.b = labs.h; if (labs.c != null) sides.c = labs.c;
    return G.rightTriSVG({ a: v, b: h, right: o.right || 'bl', rot: o.rot || 0, names: o.names || false, sides: sides, unknown: o.unknown, width: o.width || 240, px: o.px || 170 });
  }
  /* the right-triangle test: sides in the order listed. Boxes a² + b², c², yes/no. */
  function rtTest(prompt, sides, u, o) {
    o = o || {}; var s = sides.slice().sort(function (x, y) { return x - y; }), a = s[0], b = s[1], c = s[2];
    var sum = q(sq(a) + sq(b)), cc = sq(c), right = same(sum, cc), last = sides[2], cNotLast = !same(last, c);
    var firstTwo = q(sq(sides[0]) + sq(sides[1]));
    var bad = [[q(a + b), 'u7l3-no-square', 'Square each of the two shorter sides first, then add: a² + b².'], [q(2 * a + 2 * b), 'pyth-double', 'a² means a × a, not 2 × a.']];
    if (cNotLast) bad.unshift([firstTwo, 'u7l3-not-longest', 'c must be the <b>longest</b> side (' + lab(c, u) + '), even when it isn’t written last. Add the squares of the two <b>shorter</b> sides.']);
    else bad.push([q(sq(a) + sq(c)), 'u7l3-other-sum', 'Use the two <b>shorter</b> sides for a² + b². The longest side is c.'], [q(sq(b) + sq(c)), 'u7l3-other-sum', 'Use the two <b>shorter</b> sides for a² + b². The longest side is c.']);
    var cBad = [[c, 'u7l3-no-square', 'Square the longest side: c × c.'], [q(2 * c), 'pyth-double', 'c² means c × c, not 2 × c.']];
    [a, b].forEach(function (z) { if (!same(z, c)) cBad.push([sq(z), 'u7l3-not-longest', 'c is the <b>longest</b> side, ' + lab(c, u) + '. Square that one.']); });
    if (cNotLast) cBad.unshift([sq(last), 'u7l3-not-longest', 'c is the <b>longest</b> side, ' + lab(c, u) + ' — not the one written last.']);
    var why = right ? 'The two numbers are <b>equal</b>, so a² + b² = c²: it <b>is</b> a right triangle.' : 'The two numbers are <b>not equal</b>, so it is <b>not</b> a right triangle.';
    var p = P.fields(prompt, [{ label: t('a^2+b^2='), name: 'a² + b²' }, { label: t('c^2='), name: 'c²' }, { label: 'Right triangle?', mode: 'text', placeholder: 'yes/no', name: 'Right triangle?' }],
      [exactChk(sum, { bad: bad }), exactChk(cc, { bad: cBad }), wordChk(right ? 'yes' : 'no', 'yn', why)],
      [nS(sum), nS(cc), right ? 'yes' : 'no'], t('a^2+b^2=' + N(sum)) + ', ' + t('c^2=' + N(cc)) + '; ' + (right ? 'yes' : 'no'),
      br([cNotLast ? 'The longest side is ' + L(c, u) + ', so ' + t('c=' + N(c)) + '.' : null,
        t(N(a) + '^2+' + N(b) + '^2=' + N(sq(a)) + '+' + N(sq(b)) + '=' + N(sum)),
        t(N(c) + '^2=' + N(cc)),
        right ? 'Equal, so <b>yes</b>, it is a right triangle.' : 'Not equal, so <b>no</b>, it is not a right triangle.' + (o.close ? ' (But it is close.)' : '')]),
      ['Let c be the <b>longest</b> side. Work out a² + b² for the two shorter sides and c² for the longest.', 'Equal → a right triangle. Not equal → not a right triangle.'], o.text || 'right test');
    return p;
  }
  /* triangle tests: a right triple (scaled), or a near miss */
  function nearMiss(r, tr) {
    return find(function () { var s = tr.slice(), i = r.int(0, 2), d = r.pick([-2, -1, 1, 2]) * (s.some(function (x) { return !same(x, Math.round(x)); }) ? 0.1 : 1); s[i] = q(s[i] + d); return s; },
      function (s) { var z = s.slice().sort(function (x, y) { return x - y; }); return z[0] > 0 && z[0] + z[1] > z[2] && !same(sq(z[0]) + sq(z[1]), sq(z[2])) && Math.abs(sq(z[0]) + sq(z[1]) - sq(z[2])) / sq(z[2]) < 0.2; });
  }
  /* (hypotenuse, equation) multiple choice for a right triangle with the right angle at vertex V (letters [x, y, V]) */
  function thmMC(r, prompt, legs, hyp, sol) {
    var x = legs[0], y = legs[1], h = hyp, E = function (p, q2, s) { return t(p + '^2+' + q2 + '^2=' + s + '^2'); };
    var opts = [{ html: 'Hypotenuse ' + t(h) + ': ' + E(x, y, h), right: true },
      { html: 'Hypotenuse ' + t(x) + ': ' + E(y, h, x), why: 'The hypotenuse is across from the <b>right angle</b> (the box), at ' + t(h.toUpperCase()) + '. That is side ' + t(h) + '.', code: 'u7l3-hyp-leg' },
      { html: 'Hypotenuse ' + t(y) + ': ' + E(x, h, y), why: 'The hypotenuse is across from the <b>right angle</b> (the box), at ' + t(h.toUpperCase()) + '. That is side ' + t(h) + '.', code: 'u7l3-hyp-leg' },
      { html: 'Hypotenuse ' + t(h) + ': ' + t(x + '+' + y + '=' + h), why: 'Right hypotenuse, but the theorem uses the <b>squares</b> of the sides.', code: 'u7l3-no-square' }];
    var p = P.mc(r, prompt, opts, sol || ('The right angle is at ' + t(h.toUpperCase()) + ', so the side across from it, ' + t(h) + ', is the hypotenuse.<br>' + E(x, y, h)), ['Find the right-angle box. The hypotenuse is the side across from it (named by the small letter of that corner).'], 'name hypotenuse');
    p.input.columns = 2; return p;
  }
  var LETTER_SETS = ['DEF', 'EFG', 'FGH', 'JKL', 'KLM', 'LMN', 'PQR', 'QRS', 'RST', 'STU', 'TUV', 'UVW', 'XYZ'];
  function triLetters(r, notPQRatQ) {
    return find(function () { var s = r.pick(LETTER_SETS).split(''), ri = r.int(0, 2); return { s: s, R: s[ri], legs: s.filter(function (c, i) { return i !== ri; }) }; },
      function (o) { return !(notPQRatQ && o.s.join('') === 'PQR' && o.R === 'Q'); });
  }
  /* a picture for a ladder against a wall (plain labels) */
  function ladderFig(f, h, labs, o) {
    o = o || {};
    return HW.fig({ pts: { B: [0, 0], T: [0, h], F: [f, 0] }, segs: [['B', 'T', labs.wall, { width: 3 }], ['B', 'F', labs.ground], ['F', 'T', labs.ladder, { color: '#8a5a2b', width: 3.4 }]], right: [['B', 'F', 'T']], names: false,
      extra: [{ type: 'ground', y: 0, x0: -0.4, x1: f + h * 0.18 }], width: o.width || 210, height: o.height || 190, aria: 'a ladder against a wall' });
  }
  /* a rectangle with its diagonals (a frame, a field, a screen) */
  function rectFig(w, h, labs, o) {
    o = o || {};
    var segs = [['A', 'B', labs.w], ['B', 'C', labs.h], ['C', 'D'], ['D', 'A']];
    segs.push(['A', 'C', labs.d || null, { dash: true, color: '#1f5bd6' }]); if (o.both) segs.push(['B', 'D', labs.d2 || null, { dash: true, color: '#1f5bd6' }]);
    segs = segs.map(function (s) { return s[2] == null ? (s[3] ? [s[0], s[1], s[3]] : [s[0], s[1]]) : s; });
    return HW.fig({ pts: { A: [0, 0], B: [w, 0], C: [w, h], D: [0, h] }, segs: segs, right: o.right ? [['B', 'A', 'C']] : [], names: false, fill: [['A', 'B', 'C', 'D']], width: o.width || 260, height: o.height || 200, aria: o.aria || 'a rectangle and its diagonal' });
  }
  function mcCols(p, n) { p.input.columns = n; return p; }

  /* kit for later Unit 7 lessons (7.9, the review): HW.u7pyth */
  HW.u7pyth = { readNum: readNum, exactChk: exactChk, wordChk: wordChk, readWord: readWord, legPart: legPart, hypPart: hypPart, legLines: legLines, hypLines: hypLines, rtTest: rtTest, nearMiss: nearMiss, triples: triples, triFig: triFig, thmMC: thmMC };

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u7l3', unit: 7, num: '3', title: 'The Pythagorean Theorem: Finding a Leg, and Squaring a Corner', outcome: 'G2',
    blurb: 'Finding a missing leg (big square minus small square), testing whether a triangle is a right triangle, two-triangle problems, and squaring corners with the 3-4-5 method and equal diagonals.',
    questions: [
      /* ---------- 1. name the hypotenuse, write the theorem ---------- */
      { num: '1', stem: 'For each right triangle, name the hypotenuse and write the Pythagorean theorem using its letters.', parts: [['a', 'BEG', 'bl', 0, false], ['b', 'EMG', 'bl', 205, false], ['c', 'BEG', 'br', 0, true]].map(function (z) {
        return { id: '1' + z[0], level: z[1], make: function (r) {
          var L3 = triLetters(r, true), A = L3.legs[0], B = L3.legs[1], C = L3.R;
          var v = pickR(r, 2.4, 3.6, 0.2), h = pickR(r, 3.6, 5, 0.2), sides = {};
          var fig = G.rightTriSVG({ a: v, b: h, right: z[2], rot: z[3] ? z[3] + r.int(-25, 25) : 0, flip: z[4], names: [A, B, C], sides: { a: A.toLowerCase(), b: B.toLowerCase(), c: C.toLowerCase() }, width: 240, px: 160 });
          return thmMC(r, '(' + z[0] + ') Which is the hypotenuse, and which equation is the Pythagorean theorem for this triangle?' + fig, [A.toLowerCase(), B.toLowerCase()], C.toLowerCase());
        } };
      }) },
      /* ---------- 2. missing leg, exact ---------- */
      { num: '2', stem: 'Find the missing leg. Each triangle is a right triangle.', parts: [['a', 'cm', 30], ['b', 'm', 70], ['c', 'in', 45]].map(function (z) {
        return { id: '2' + z[0], level: 'BEG', make: function (r) {
          var tr = r.pick(triples(z[2] > 50 ? 100 : 60, { not: WORKED_TRIPLES, minC: z[2] > 50 ? 30 : 13 })), gi = r.int(0, 1), leg = tr[gi], H = tr[2];
          return legPart('(' + z[0] + ') hypotenuse ' + L(H, z[1]) + ', one leg ' + L(leg, z[1]), H, leg, { unit: z[1], dp: 0, before: 'x' });
        } };
      }) },
      /* ---------- 3. missing leg, nearest tenth ---------- */
      { num: '3', stem: 'Find the missing leg, to the nearest tenth.', parts: [['a', 'cm'], ['b', 'm'], ['c', 'in']].map(function (z) {
        return { id: '3' + z[0], level: 'EMG', make: function (r) {
          var v = find(function () { var H = r.int(80, 250) / 10, lg = r.int(Math.round(H * 3), Math.round(H * 8.5)) / 10; return { H: H, lg: lg, x: Math.sqrt(sq(H) - sq(lg)) }; },
            function (o) { return safe(o.x, 1) && !same(o.x, rd(o.x, 0)) && !hasPair([[10.6, 5.6], [7.3, 1.8], [9.5, 4.1], [11, 6], [17, 8]], o.H, o.lg); });
          return legPart('(' + z[0] + ') hypotenuse ' + L(v.H, z[1]) + ', one leg ' + L(v.lg, z[1]), v.H, v.lg, { unit: z[1] });
        } };
      }) },
      /* ---------- 4. leg or hypotenuse? ---------- */
      { num: '4', stem: 'For each triangle, write whether the missing side is a <b>leg</b> or the <b>hypotenuse</b>. Then find it to the nearest tenth.', parts: [
        { id: '4a', level: 'EMG', make: function (r) {
          var v = find(function () { return [pickR(r, 2.5, 9, 0.1), pickR(r, 2.5, 9, 0.1)]; }, function (s) { var c = Math.sqrt(sq(s[0]) + sq(s[1])); return Math.abs(s[0] - s[1]) > 0.4 && safe(c, 1) && !hasPair([[7, 4]], s[0], s[1]); });
          return lhPart('(a)', { v: v[1], h: v[0], u: 'cm', unk: 'c', nm: 'w', fig: { right: 'bl' } });
        } },
        { id: '4b', level: 'PRG', make: function (r) {
          var v = find(function () { var H = pickR(r, 9, 20, 0.1), lg = r.int(Math.round(H * 0.45), Math.round(H * 0.85)); return { H: H, lg: lg }; }, function (o) { var x = Math.sqrt(sq(o.H) - sq(o.lg)); return safe(x, 1) && !hasPair([[11, 6], [17, 8]], o.H, o.lg); });
          return lhPart('(b)', { h: v.lg, H: v.H, u: 'm', unk: 'v', nm: 'k', fig: { right: 'bl' } });
        } },
        { id: '4c', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.int(10, 24), r.int(4, 12)]; }, function (s) { var c = Math.sqrt(sq(s[0]) + sq(s[1])); return s[0] > s[1] + 3 && safe(c, 1) && !same(c, rd(c, 0)) && !hasPair([[7, 4]], s[0], s[1]); });
          return lhPart('(c)', { h: v[0], v: v[1], u: 'ft', unk: 'c', nm: 'z', fig: { right: 'tr' } });
        } }] },
      /* ---------- 5. Tyler's mistake ---------- */
      { num: '5', stem: function (sh) { return 'A right triangle has a hypotenuse of ' + L(sh.H, 'cm') + ' and one leg of ' + L(sh.l, 'cm') + '. ' + sh.p.n + ' found the other leg like this:<div style="margin:6px 0 2px 12px">' + t(N(sh.l) + '^2+' + N(sh.H) + '^2=x^2') + ' &nbsp;&nbsp; ' + t('x^2=' + N(sh.s)) + ' &nbsp;&nbsp; ' + t('x\\approx ' + fx(sh.w, 1) + '\\text{ cm}') + '</div>'; },
        shared: function (r) {
          var tr = find(function () { return r.pick(triples(30, { not: [[8, 15, 17], [9, 12, 15]] })); }, function (x) { return !same(Math.sqrt(sq(x[2]) + sq(x[0])), rd(Math.sqrt(sq(x[2]) + sq(x[0])), 0)); });
          var gi = r.int(0, 1), l = tr[gi], H = tr[2], s = sq(l) + sq(H); return { H: H, l: l, x: tr[1 - gi], s: s, w: Math.sqrt(s), p: person(r) };
        },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, '(a) How can you tell, <b>without doing any math</b>, that ' + sh.p.n + '’s answer is wrong?', [
              { html: 'A leg is always <b>shorter</b> than the hypotenuse, but ' + Lf(sh.w, 1, 'cm') + ' is longer than ' + L(sh.H, 'cm') + '.', right: true },
              { html: 'Answers to the Pythagorean theorem are always whole numbers.', why: 'Not true: many answers are decimals (like ' + t('\\sqrt{65}\\approx 8.1') + '). Compare the answer with the hypotenuse.', code: 'whole' },
              { html: 'The two legs of a right triangle are always the same length, so ' + t('x') + ' should be ' + L(sh.l, 'cm') + '.', why: 'The legs can be any lengths. Think about which side of a right triangle is always the longest.', code: 'same-legs' },
              { html: sh.p.he === 'she' ? 'She should have rounded to the nearest whole number.' : 'He should have rounded to the nearest whole number.', why: 'Rounding isn’t the problem. Look at which side should be the longest.', code: 'round' }],
              'The hypotenuse is always the <b>longest</b> side, so a leg must be shorter than ' + L(sh.H, 'cm') + '. ' + Lf(sh.w, 1, 'cm') + ' is longer, so it can’t be right.', ['Which side of a right triangle is always the longest?'], 'tell without math');
          } },
          { id: '5bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What was ' + sh.p.his + ' mistake?', [
              { html: cap(sh.p.he) + ' <b>added</b> the squares. To find a leg, <b>subtract</b>: ' + t('x^2=' + N(sh.H) + '^2-' + N(sh.l) + '^2') + '.', right: true },
              { html: cap(sh.p.he) + ' forgot to take the square root.', why: cap(sh.p.he) + ' did take the square root: ' + t('\\sqrt{' + N(sh.s) + '}\\approx ' + fx(sh.w, 1)) + '. The problem is the step before.', code: 'root' },
              { html: cap(sh.p.he) + ' should have subtracted the sides: ' + t(N(sh.H) + '-' + N(sh.l) + '=' + N(sh.H - sh.l)) + '.', why: 'The theorem works with the <b>squares</b> of the sides, not the sides.', code: 'sides' },
              { html: cap(sh.p.he) + ' should have multiplied: ' + t(N(sh.l) + '\\times ' + N(sh.H) + '=' + N(sh.l * sh.H)) + '.', why: 'The Pythagorean theorem adds or subtracts squares; it doesn’t multiply the two sides.', code: 'mult' }],
              cap(sh.p.he) + ' added the squares, which is how you find the <b>hypotenuse</b>. Here the hypotenuse is known (' + L(sh.H, 'cm') + '), so subtract: ' + t('x^2=' + N(sh.H) + '^2-' + N(sh.l) + '^2') + '.', ['Is the missing side a leg or the hypotenuse? Which one do you get by adding?'], 'Tyler mistake');
          } },
          { id: '5bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { return legPart('Find the correct length of the other leg.', sh.H, sh.l, { unit: 'cm', dp: 0 }); } }] },
      /* ---------- 6. TV screen ---------- */
      { num: '6', stem: function (sh) { return 'The size of a TV is the length of its diagonal ' + t('d') + '. A TV screen has width ' + t('w') + ' and height ' + t('h') + '.' + rectFig(16, 9, { w: 'w', h: 'h', d: 'd' }, { right: true, width: 220, height: 150, aria: 'a TV screen with its diagonal' }); },
        shared: function (r) { var d = r.pick([32, 40, 43, 50, 55, 58, 60, 65, 70, 75, 85]), w = rd(d * 0.8716 + r.int(-1, 1) / 10, 1); return { d: d, w: w, h: Math.sqrt(sq(d) - sq(w)) }; },
        parts: [
          { id: '6a', level: 'BEG', make: function (r) {
            return mcCols(P.mc(r, '(a) Which is the Pythagorean theorem for the screen, using ' + t('d') + ', ' + t('w') + ' and ' + t('h') + '?', [
              { html: t('w^2+h^2=d^2'), right: true },
              { html: t('d^2+w^2=h^2'), why: 'The diagonal ' + t('d') + ' is across from the right angle at a corner, so it is the <b>hypotenuse</b>: it goes alone on one side.', code: 'hyp-leg' },
              { html: t('d^2+h^2=w^2'), why: 'The diagonal ' + t('d') + ' is the <b>hypotenuse</b> (the longest side): it goes alone on one side.', code: 'hyp-leg' },
              { html: t('w+h=d'), why: 'The theorem uses the <b>squares</b> of the sides.', code: 'no-square' }],
              'The diagonal is the hypotenuse (across from the right angle at the corner of the screen):<br>' + t('w^2+h^2=d^2'), ['The width and height meet at a right angle. Which side is across from it?'], 'TV theorem'), 2);
          } },
          { id: '6b', level: 'EMG', outcome: 'A1', make: function (r) {
            return mcCols(P.mc(r, '(b) Rearrange the formula to find ' + t('h') + '. Which is right?', [
              { html: t('h=\\sqrt{d^2-w^2}'), right: true },
              { html: t('h=\\sqrt{d^2+w^2}'), why: 'Adding the squares gives the <b>diagonal</b>. To get ' + t('h^2') + ' by itself, <b>subtract</b> ' + t('w^2') + ' from both sides.', code: 'add' },
              { html: t('h=\\sqrt{w^2-d^2}'), why: 'Big square minus small square: the diagonal is the longest side, so ' + t('d^2') + ' comes first.', code: 'order' },
              { html: t('h=d-w'), why: 'Rearrange the squares: ' + t('h^2=d^2-w^2') + ', then take the square root.', code: 'no-square' }],
              t('w^2+h^2=d^2') + '<br>Subtract ' + t('w^2') + ' from both sides: ' + t('h^2=d^2-w^2') + '<br>Take the square root: ' + t('h=\\sqrt{d^2-w^2}'), ['Get ' + t('h^2') + ' by itself first: what do you do to both sides to move ' + t('w^2') + '?'], 'rearrange TV'), 2);
          } },
          { id: '6c', level: 'PRG', make: function (r, sh) {
            return legPart('(c) A ' + sh.d + ' in TV is ' + L(sh.w, 'in') + ' wide. Use your formula to find its height, to the nearest tenth of an inch.', sh.d, sh.w, { unit: 'in', name: 'h', what: 'height', lead: t('h^2=d^2-w^2') });
          } }] },
      /* ---------- 7. painter's ladder ---------- */
      { num: '7', stem: function (sh) { return 'A painter leans a ' + L(sh.L, 'm') + ' ladder against a wall. The foot of the ladder is ' + L(sh.f, 'm') + ' from the wall.'; },
        shared: function (r) {
          var st = r.pick(['ok', 'ok', 'far', 'close']);
          return find(function () {
            var Ld = pickR(r, 4.5, 9, 0.5), f0 = Ld / Math.sqrt(17), f = rd(st === 'ok' ? f0 + r.pick([-0.1, 0, 0, 0.1]) : st === 'far' ? f0 + r.int(5, 10) / 10 : f0 - r.int(4, 7) / 10, 1);
            var h = Math.sqrt(sq(Ld) - sq(f)), h4 = rd(h, 1) / 4; return { L: Ld, f: f, h: h, h4: h4, st: st };
          }, function (o) { var d = o.f - o.h4; return o.f >= 0.4 && safe(o.h, 1) && (o.st === 'ok' ? Math.abs(d) <= 0.15 : o.st === 'far' ? d >= 0.35 : -d >= 0.35) && !(o.L === 7.3); });
        },
        parts: [
          { id: '7ai', sub: 'a i', level: 'BEG', make: function (r, sh) {
            var f = 1, h = 2.5, Lb = lab(sh.L, 'm'), Fb = lab(sh.f, 'm');
            var p = P.mc(r, 'Which sketch shows the ladder, the wall and the ground correctly?', [
              { html: ladderFig(f, h, { wall: 'h', ground: Fb, ladder: Lb }), right: true },
              { html: ladderFig(f, h, { wall: Lb, ground: Fb, ladder: 'h' }), why: 'The <b>ladder</b> is the slanted side. It is ' + Lb + ' long; the height up the wall is the unknown.', code: 'ladder-wall' },
              { html: ladderFig(f, h, { wall: 'h', ground: Lb, ladder: Fb }), why: 'The foot is ' + Fb + ' from the wall: that distance is along the <b>ground</b>.', code: 'ladder-ground' },
              { html: ladderFig(f, h, { wall: Fb, ground: 'h', ladder: Lb }), why: 'The ' + Fb + ' is the distance along the ground, from the wall to the foot of the ladder. The unknown height is up the wall.', code: 'swap' }],
              'The ladder is the slanted side (the hypotenuse, ' + Lb + '). The ground from the wall to the foot is ' + Fb + '. The height up the wall is ' + t('h') + '.', ['The ladder leans: it is the slanted side.'], 'ladder sketch');
            p.input.columns = 2; return p;
          } },
          { id: '7aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { return legPart('How high up the wall does the ladder reach, to the nearest tenth of a metre?', sh.L, sh.f, { unit: 'm', name: 'h', what: 'height', lead: 'The ladder is the hypotenuse.', end: 'The ladder reaches about ' + Lf(sh.h, 1, 'm') + ' up the wall.' }); } },
          { id: '7b', level: 'PRG', make: function (r, sh) {
            var H = rd(sh.h, 1), want = '\\approx ' + fx(sh.h4, 1), wantT = t(fx(H, 1) + '\\div 4' + want);
            return P.mc(r, '(b) The 4-to-1 rule says the foot should be about (height ÷ 4) from the wall. Is the ladder set up safely by the rule?', [
              { html: '<b>Yes.</b> ' + wantT + ' m, and the foot is ' + L(sh.f, 'm') + ' out: about right.', right: sh.st === 'ok', why: sh.st === 'ok' ? null : 'Compare ' + wantT + ' m with the ' + L(sh.f, 'm') + ' the foot is out: is that close?', code: 'ok' },
              { html: '<b>No.</b> ' + wantT + ' m, but the foot is ' + L(sh.f, 'm') + ' out: too far from the wall.', right: sh.st === 'far', why: sh.st === 'far' ? null : 'Compare ' + wantT + ' m with the ' + L(sh.f, 'm') + '. Is the foot really farther out than that?', code: 'far' },
              { html: '<b>No.</b> ' + wantT + ' m, but the foot is ' + L(sh.f, 'm') + ' out: too close to the wall.', right: sh.st === 'close', why: sh.st === 'close' ? null : 'Compare ' + wantT + ' m with the ' + L(sh.f, 'm') + '. Is the foot really closer than that?', code: 'close' },
              { html: '<b>No.</b> The foot should be ' + t(fx(H, 1) + '\\times 4=' + fx(H * 4, 1)) + ' m from the wall.', why: 'The rule says the distance out is the height <b>÷</b> 4, not × 4.', code: 'times4' }],
              'By the rule, the foot should be about ' + wantT + ' m from the wall.<br>It is ' + L(sh.f, 'm') + ' out, so ' + (sh.st === 'ok' ? '<b>yes</b>, that is about right.' : sh.st === 'far' ? '<b>no</b>: it is too far from the wall (the ladder could slide out).' : '<b>no</b>: it is too close to the wall (the ladder could tip backward).'), ['Use your height from (a): divide it by 4 and compare with the distance out.'], '4 to 1 rule', true);
          } }] },
      /* ---------- 8. drone ---------- */
      { num: '8', stem: function (sh) { return sh.p.n + ' flies a drone over a field near Strathmore. ' + cap(sh.p.his) + ' controller shows that the drone is ' + L(sh.H, 'm') + ' from ' + (sh.p.he === 'she' ? 'her' : 'him') + ' in a straight line. The drone is directly above a fence post that is ' + L(sh.g, 'm') + ' from ' + sh.p.n + '. (Ignore ' + sh.p.n + '’s height.)'; },
        shared: function (r) { return find(function () { var H = pickR(r, 90, 200, 5), g = pickR(r, 30, H - 20, 5); return { H: H, g: g, h: Math.sqrt(sq(H) - sq(g)), p: person(r) }; }, function (o) { return safe(o.h, 1) && Math.abs(o.h - 122) > 4 && o.g < o.H * 0.9; }); },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) { return legPart('(a) How high is the drone, to the nearest tenth of a metre?', sh.H, sh.g, { unit: 'm', name: 'h', what: 'height', lead: 'The ' + lab(sh.H, 'm') + ' line is the hypotenuse.', end: 'The drone is about ' + Lf(sh.h, 1, 'm') + ' high.' }); } },
          { id: '8b', level: 'BEG', make: function (r, sh) {
            var H = rd(sh.h, 1), below = sh.h < 122, opts = [
              { html: '<b>Yes.</b> ' + L(H, 'm') + ' is less than 122 m.', right: below, why: below ? null : 'Compare your height from (a) with 122 m again.', code: 'yes' },
              { html: '<b>No.</b> ' + L(H, 'm') + ' is more than 122 m.', right: !below, why: below ? 'Compare your height from (a) with 122 m again.' : null, code: 'no' }];
            if (below && sh.H > 122) opts.push({ html: '<b>No.</b> The drone is ' + L(sh.H, 'm') + ' away, which is more than 122 m.', why: sh.H + ' m is the straight-line distance, not the <b>height</b>. Use the height from (a).', code: 'slant' });
            if (!below) opts.push({ html: '<b>Yes.</b> The fence post is only ' + L(sh.g, 'm') + ' away.', why: 'The rule is about the <b>height</b>. Use the height from (a).', code: 'ground' });
            return P.mc(r, '(b) In Canada, most drones must stay below 122 m. Is ' + sh.p.n + '’s drone below that height?', opts, (below ? '<b>Yes.</b> ' + L(H, 'm') + ' is less than 122 m.' : '<b>No.</b> ' + L(H, 'm') + ' is more than 122 m: the drone is too high.'), ['Compare the height from (a) with 122 m.'], 'drone limit', true);
          } }] },
      /* ---------- 9. tent pole, two triangles ---------- */
      { num: '9', stem: function (sh) {
          return 'A tall pole stands straight up in the middle of a big event tent. Two ropes run from the top of the pole to stakes in the ground. The left rope is ' + L(sh.Lr, 'm') + ' long and is staked ' + L(sh.s, 'm') + ' from the bottom of the pole. The right rope is ' + L(sh.Rr, 'm') + ' long.' +
            HW.fig({ pts: { A: [0, 0], D: [sh.s, 0], R: [sh.s + sh.x, 0], T: [sh.s, sh.h] }, segs: [['A', 'D', lab(sh.s, 'm')], ['D', 'R', 'x'], ['A', 'T', lab(sh.Lr, 'm')], ['T', 'R', lab(sh.Rr, 'm')], ['D', 'T', 'h', { width: 3.6 }]], right: [['D', 'R', 'T']], names: false, extra: [{ type: 'ground', y: 0, x0: -0.6, x1: sh.s + sh.x + 0.6 }], width: 330, height: 220, aria: 'a tent pole held by two ropes' });
        },
        shared: function (r) {
          var need = r.chance(0.8);
          return find(function () { var Lr = pickR(r, 5.5, 9.5, 0.1), s = pickR(r, 2, 4.5, 0.1), Rr = q(Lr + pickR(r, 1, 3.5, 0.1)), h = Math.sqrt(sq(Lr) - sq(s)), x = Math.sqrt(sq(Rr) - sq(h)), xe = Math.sqrt(sq(Rr) - sq(rd(h, 1))); return { Lr: Lr, s: s, Rr: Rr, h: h, x: x, xe: xe }; },
            function (o) { return safe(o.h, 1) && safe(o.x, 1) && (rd(o.xe, 1) !== rd(o.x, 1)) === need && o.x > 2 && !hasPair([[9.5, 4.1]], o.Lr, o.s); });
        },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) { return legPart('(a) How tall is the pole, to the nearest tenth of a metre?', sh.Lr, sh.s, { unit: 'm', name: 'h', what: 'pole', lead: 'Left triangle: the ' + lab(sh.Lr, 'm') + ' rope is the hypotenuse.', end: 'The pole is about ' + Lf(sh.h, 1, 'm') + ' tall.' }); } },
          { id: '9b', level: 'MAS', make: function (r, sh) {
            var h2 = q(sq(sh.Lr) - sq(sh.s)), x2 = q(sq(sh.Rr) - h2), early = rd(sh.xe, 1) !== rd(sh.x, 1);
            var p = GP.len('(b) How far from the pole is the right rope staked, to the nearest tenth of a metre? Keep the full value from (a).', sh.x, { unit: 'm', pyth: { hyp: sh.Rr, leg: sh.h },
              alts: [{ v: Math.sqrt(Math.abs(sq(sh.Rr) - sq(sh.Lr))), code: 'u7l3-shared', hint: 'The side the two triangles share is the <b>pole</b> ' + t('h') + ', not the left rope. Use ' + t('h^2') + ' from (a).' },
                { v: Math.sqrt(sq(sh.Rr) - sq(sh.s)), code: 'u7l3-shared', hint: 'The ' + lab(sh.s, 'm') + ' belongs to the left triangle. In the right triangle the legs are the pole ' + t('h') + ' and ' + t('x') + '.' }],
              sol: br(['Right triangle: the ' + lab(sh.Rr, 'm') + ' rope is the hypotenuse; the legs are the pole ' + t('h') + ' and ' + t('x') + '.', 'Use the full value ' + t('h^2=' + N(h2)) + ' from (a).',
                t('x^2=' + N(sh.Rr) + '^2-h^2=' + N(sq(sh.Rr)) + '-' + N(h2) + '=' + N(x2)), t('x=\\sqrt{' + N(x2) + '}' + toN(sh.x, 1)), 'The right rope is staked about ' + Lf(sh.x, 1, 'm') + ' from the pole.',
                early ? '(Using the rounded ' + fx(sh.h, 1) + ' m gives ' + t('x\\approx ' + fx(sh.xe, 1)) + ' m, which is a little off.)' : null]),
              hints: ['The pole is a leg of <b>both</b> triangles. In the right triangle, the ' + lab(sh.Rr, 'm') + ' rope is the hypotenuse.', 'Use ' + t('h^2') + ' (or the full value of ' + t('h') + ') from (a), not the rounded height.'], text: 'second stake' });
            p.input.before = t('x=');
            var base = p.check;
            if (early) p.check = function (resp) { var a = readNum(resp); if (!a.res && same(rd(a.v, 1), rd(sh.xe, 1)) && a.d <= 2) return form('u7l3-round-early', 'Nearly! You used the <b>rounded</b> pole height (' + fx(sh.h, 1) + ' m). Keep the full value from (a): use ' + t('h^2=' + N(h2)) + '.'); return base(resp); };
            return p;
          } }] },
      /* ---------- 10. is it a right triangle? ---------- */
      { num: '10', stem: 'Is each triangle a right triangle? Show your work.', shared: function (r) { return { aRight: r.chance(0.5) }; }, parts: [
        { id: '10a', level: 'EMG', make: function (r, sh) {
          var tr = r.pick(triples(70, { not: WORKED_TRIPLES.concat([[9, 12, 15], [5, 12, 13]]), minC: 25 })), s = sh.aRight ? tr : nearMiss(r, tr);
          return rtTest('(a) ' + s.map(function (x) { return lab(x, 'cm'); }).join(', ') + '. Let c be the longest side.', s, 'cm');
        } },
        { id: '10b', level: 'EMG', make: function (r, sh) {
          var tr = r.pick(triples(30, { not: WORKED_TRIPLES, minC: 10 })), s = sh.aRight ? nearMiss(r, tr) : tr;
          if (hasPair([[7, 9]], s[0], s[1]) && s[2] === 12) s = [5, 11, 12];
          return rtTest('(b) ' + s.map(function (x) { return lab(x, 'm'); }).join(', '), s, 'm');
        } },
        { id: '10c', level: 'PRG', make: function (r) {
          var tr = find(function () { var p = r.pick([[5, 12, 13], [7, 24, 25], [8, 15, 17], [20, 21, 29], [3, 4, 5], [9, 40, 41], [12, 35, 37]]), k = r.pick([0.1, 0.2, 0.5]); return p.map(function (x) { return q(x * k); }); },
            function (s) { return s[2] <= 8 && s[0] >= 0.5 && !hasPair([[3.3, 5.6]], s[0], s[1]) && !(same(s[0], 0.9) && same(s[1], 4)); });
          var s = r.chance(0.75) ? tr : nearMiss(r, tr), order = [s[1], s[0], s[2]];
          var o2 = r.chance(0.5) ? [order[0], order[2], order[1]] : [order[2], order[1], order[0]];
          return rtTest('(c) ' + o2.map(function (x) { return lab(x, 'ft'); }).join(', '), o2, 'ft');
        } },
        { id: '10d', level: 'PRG', make: function (r) {
          var n = find(function () { return r.int(5, 20); }, function (x) { return x !== 10; }), m = Math.round(n * Math.SQRT2);
          return rtTest('(d) ' + [n, n, m].map(function (x) { return lab(x, 'in'); }).join(', '), [n, n, m], 'in', { close: true });
        } }] },
      /* ---------- 11. Ana's mistake ---------- */
      { num: '11', stem: '', parts: [{ id: '11', level: 'EMG', make: function (r) {
        var tr = r.pick(triples(30, { not: [[3, 4, 5], [9, 40, 41], [8, 15, 17]], minC: 10 })), a = tr[0], b = tr[1], c = tr[2], who = person(r), w = q(sq(b) + sq(c));
        var P2 = cap(who.he);
        return P.mc(r, who.n + ' tested a triangle with sides ' + lab(b, 'cm') + ', ' + lab(c, 'cm') + ' and ' + lab(a, 'cm') + '. ' + P2 + ' wrote: “' + t(N(b) + '^2+' + N(c) + '^2=' + N(w)) + ' and ' + t(N(a) + '^2=' + N(sq(a))) + '. They are not equal, so it is not a right triangle.” Is ' + who.n + ' right? Find the mistake.', [
          { html: '<b>No.</b> The longest side (' + lab(c, 'cm') + ') must be ' + t('c') + ': ' + t(N(a) + '^2+' + N(b) + '^2=' + N(sq(a) + sq(b)) + '=' + N(c) + '^2') + ', so it <b>is</b> a right triangle.', right: true },
          { html: '<b>Yes.</b> ' + t(N(w) + '\\ne ' + N(sq(a))) + ', so it is not a right triangle.', why: 'Check which side was used as ' + t('c') + '. It must be the <b>longest</b> side.', code: 'agree' },
          { html: '<b>No.</b> ' + P2 + ' should add the sides: ' + t(N(a) + '+' + N(b) + '=' + N(a + b)) + ', which is not ' + N(c) + ', so it is not a right triangle.', why: 'The test uses the <b>squares</b> of the sides, not the sides.', code: 'sides' },
          { html: '<b>No.</b> ' + P2 + ' forgot the square roots: ' + t('\\sqrt{' + N(w) + '}\\ne\\sqrt{' + N(sq(a)) + '}') + ', so it is still not a right triangle.', why: 'Square roots don’t fix the real mistake: the longest side must be ' + t('c') + '.', code: 'roots' }],
          who.n + ' is not right. The longest side, ' + L(c, 'cm') + ', must be ' + t('c') + '. Test the two shorter sides:<br>' + t(N(a) + '^2+' + N(b) + '^2=' + N(sq(a)) + '+' + N(sq(b)) + '=' + N(sq(a) + sq(b))) + ' and ' + t(N(c) + '^2=' + N(sq(c))) + '.<br>They are equal, so it <b>is</b> a right triangle.', ['Which side must be ' + t('c') + ' in the test?'], 'Ana mistake');
      } }] },
      /* ---------- 12. Wei's shed: 3-4-5 ---------- */
      { num: '12', stem: function (sh) { return sh.p.n + ' is laying out the floor frame for a garden shed.'; }, shared: function (r) { return { p: person(r) }; }, parts: [
        { id: '12a', level: 'EMG', make: function (r) {
          var ints = r.sample([4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20], 3).sort(function (x, y) { return x - y; }), dc = r.pick([0.2, 0.3, 0.4, 0.6, 1.5, 2.5]), ks = ints.concat([dc]);
          var rows = ['3', '4', '5'], cols = ks.map(function (k) { return '\\times ' + nS(k); });
          var blanks = [], cells = [];
          [3, 4, 5].forEach(function (s, i) {
            cells.push(ks.map(function (k) { return nS(s * k); }));
            ks.forEach(function (k, j) { blanks.push({ where: 'cell', i: i, j: j, name: s + ' × ' + nS(k), chk: exactChk(q(s * k), { bad: [[q(s + k), 'u7l3-table-add', '<b>Multiply</b> the side by ' + nS(k) + '; don’t add.']].concat([3, 4, 5].filter(function (z) { return z !== s; }).map(function (z) { return [q(z * k), 'u7l3-table-row', 'That is ' + z + ' × ' + nS(k) + '. This box is in the row for the side ' + s + '.']; })) }) }); });
          });
          return PK.tablePart('(a) Complete the table of 3-4-5 multiples. Each column multiplies 3, 4 and 5 by the number at the top.', { rows: rows, cols: cols, cells: [[null, null, null, null], [null, null, null, null], [null, null, null, null]], corner: '\\text{side}', keys: 'pctkit-money', help: 'Tap a box, then type the number.' },
            PK.tableChk(blanks), { rows: rows, cols: cols, cells: cells },
            ks.map(function (k) { return '× ' + nS(k) + ': ' + t('3\\times ' + nS(k) + '=' + nS(3 * k)) + ', ' + t('4\\times ' + nS(k) + '=' + nS(4 * k)) + ', ' + t('5\\times ' + nS(k) + '=' + nS(5 * k)); }).join('<br>'), ['Multiply each of 3, 4 and 5 by the same number.'], '345 table');
        } },
        { id: '12b', level: 'PRG', make: function (r, sh) {
          var k = r.pick([1, 1, 2, 3]), st = r.pick(['short', 'short', 'long', 'long', 'exact']), off = r.int(1, 4);
          if (k === 2 && st === 'long' && off === 2) off = 3;
          var D = 5 * k * 12 + (st === 'short' ? -off : st === 'long' ? off : 0), ftin = Math.floor(D / 12) + ' ft' + (D % 12 ? ' ' + (D % 12) + ' in' : ''), Wn = sh.p.n, he = sh.p.he;
          var opts = [
            { html: '<b>Yes.</b> The diagonal is exactly what it should be, so the corner is square.', right: st === 'exact', why: 'The diagonal should be ' + 5 * k + ' ft. Is ' + ftin + ' exactly that?', code: 'yes' },
            { html: '<b>No.</b> ' + ftin + ' is too short: the corner is less than 90°. Open the boards up (move them apart) until the diagonal is ' + 5 * k + ' ft.', right: st === 'short', why: st === 'long' ? ftin + ' is <b>longer</b> than ' + 5 * k + ' ft.' : 'Compare ' + ftin + ' with ' + 5 * k + ' ft.', code: 'short' },
            { html: '<b>No.</b> ' + ftin + ' is too long: the corner is more than 90°. Push the boards closer together until the diagonal is ' + 5 * k + ' ft.', right: st === 'long', why: st === 'short' ? ftin + ' is <b>shorter</b> than ' + 5 * k + ' ft.' : 'Compare ' + ftin + ' with ' + 5 * k + ' ft.', code: 'long' }];
          if (st === 'short') opts.push({ html: '<b>No.</b> ' + ftin + ' is too short: the corner is more than 90°. Push the boards closer together.', why: 'A diagonal that is too <b>short</b> means the corner is too closed (less than 90°): open it up.', code: 'short-wrong-way' });
          else if (st === 'long') opts.push({ html: '<b>No.</b> ' + ftin + ' is too long: the corner is less than 90°. Open the boards up.', why: 'A diagonal that is too <b>long</b> means the corner is too open (more than 90°): push the sides together.', code: 'long-wrong-way' });
          else opts.push({ html: '<b>No.</b> The diagonal should be ' + (7 * k) + ' ft (' + 3 * k + ' + ' + 4 * k + ').', why: 'For a square corner the diagonal is ' + 5 * k + ' ft, because ' + t((3 * k) + '^2+' + (4 * k) + '^2=' + (5 * k) + '^2') + '.', code: 'add' });
          return P.mc(r, '(b) ' + Wn + ' measures ' + 3 * k + ' ft along one side and ' + 4 * k + ' ft along the other. The diagonal between the marks is ' + ftin + '. Is the corner square? What should ' + he + ' do?', opts,
            br([t((3 * k) + '^2+' + (4 * k) + '^2=' + (9 * k * k) + '+' + (16 * k * k) + '=' + (25 * k * k) + '=' + (5 * k) + '^2') + ', so the diagonal should be ' + 5 * k + ' ft.',
              st === 'exact' ? 'It is exactly ' + 5 * k + ' ft, so the corner is square.' : st === 'short' ? ftin + ' is too short, so the corner is less than 90°. ' + cap(he) + ' should open the boards up until the diagonal is ' + 5 * k + ' ft.' : ftin + ' is too long, so the corner is more than 90°. ' + cap(he) + ' should push the boards closer together until the diagonal is ' + 5 * k + ' ft.']),
            ['What should the diagonal be for a square corner? (' + 3 * k + '-' + 4 * k + '-?)', 'Too short → the corner is too closed. Too long → too open.'], 'Wei diagonal', true);
        } },
        { id: '12c', level: 'PRG', make: function (r, sh) {
          var Lb = r.pick([8, 10, 12, 12, 16, 20]), k = Math.floor(Lb / 4), T = function (m) { return (3 * m) + '-' + (4 * m) + '-' + (5 * m); };
          return P.mc(r, '(c) ' + sh.p.n + '’s boards are ' + Lb + ' ft long. Which multiple of 3-4-5 would give a more accurate check than 3-4-5? Why?', [
            { html: '<b>' + T(k) + '</b>: it still fits on ' + Lb + ' ft boards, and on a bigger triangle a small measuring error matters less.', right: true },
            { html: '<b>' + T(k + 1) + '</b>: the bigger the triangle, the better.', why: 'The ' + 4 * (k + 1) + ' ft side doesn’t fit on a ' + Lb + ' ft board.', code: 'too-big' },
            { html: '<b>1.5-2-2.5</b>: a small triangle is easier to measure exactly.', why: 'On a small triangle, a small measuring error makes a <b>bigger</b> difference to the corner.', code: 'small' },
            { html: '<b>3-4-5</b> itself: every multiple gives exactly the same accuracy.', why: 'Every multiple makes a right angle, but a bigger triangle is <b>more accurate</b>: a small error matters less on a long diagonal.', code: 'same' }],
            'The longest leg must fit on a ' + Lb + ' ft board: ' + t('4\\times ' + k + '=' + 4 * k) + ' ft fits, so use <b>' + T(k) + '</b>' + (k > 2 ? ' (or a smaller multiple like 6-8-10)' : '') + '. A bigger triangle is more accurate, because a small measuring error matters less on a long diagonal.', ['Which is the biggest multiple whose sides still fit on the boards?'], 'best multiple');
        } }] },
      /* ---------- 13. soccer field ---------- */
      { num: '13', stem: function (sh) { return 'A grounds crew paints the lines of a soccer field in Lethbridge. The field is a rectangle ' + L(sh.l, 'm') + ' long and ' + L(sh.w, 'm') + ' wide.' + rectFig(sh.l, sh.w, { w: lab(sh.l, 'm'), h: lab(sh.w, 'm'), d: 'd' }, { width: 260, height: 170, aria: 'a soccer field with its diagonal' }); },
        shared: function (r) { return find(function () { var l = r.int(90, 120), w = r.int(45, 90); return { l: l, w: w, d: Math.sqrt(sq(l) + sq(w)), eq: r.chance(0.25), off: r.int(3, 12) / 10, sw: r.chance(0.5) }; }, function (o) { return safe(o.d, 1) && o.l - o.w >= 20; }); },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) { return hypPart('(a) How long should each diagonal be, to the nearest tenth of a metre?', sh.l, sh.w, { unit: 'm', name: 'd', what: 'diagonal' }); } },
          { id: '13b', level: 'PRG', make: function (r, sh) {
            var d1 = rd(sh.d, 1), d2 = sh.eq ? d1 : q(d1 + sh.off), ms = sh.sw ? [d2, d1] : [d1, d2];
            return P.mc(r, '(b) The crew measures the two diagonals: ' + L(ms[0], 'm') + ' and ' + L(ms[1], 'm') + '. What does this tell them?', [
              { html: 'The diagonals are equal, so the field is a true rectangle: its corners are square.', right: sh.eq, why: sh.eq ? null : 'Are ' + nS(ms[0]) + ' m and ' + nS(ms[1]) + ' m really equal?', code: 'equal' },
              { html: 'The diagonals are not equal, so the corners are not square. They need to fix the corners before painting.', right: !sh.eq, why: sh.eq ? 'Look again: both diagonals are ' + nS(d1) + ' m.' : null, code: 'unequal' },
              { html: 'Only one diagonal matters; the longer one is right, so the field is fine.', why: 'In a rectangle <b>both</b> diagonals are equal. Compare them.', code: 'one' },
              { html: 'The field is not ' + sh.l + ' m long, because the diagonals are longer than ' + sh.l + ' m.', why: 'A diagonal is always longer than the sides: it is the hypotenuse.', code: 'longer' }],
              'In a rectangle the two diagonals are equal (both should be about ' + L(d1, 'm') + ').<br>' + (sh.eq ? 'They are equal, so the corners are square.' : 'They are not equal, so the field is not a true rectangle: its corners are not square. Fix the corners before painting.'), ['What is true about the two diagonals of a rectangle?'], 'field diagonals');
          } }] },
      /* ---------- 14. which set is a right triangle? ---------- */
      { num: '14', stem: '', parts: [{ id: '14', level: 'EMG', make: function (r) {
        var tr = r.pick(triples(30, { not: [[3, 4, 5], [9, 40, 41], [8, 15, 17]], minC: 10 })), outs = [];
        while (outs.length < 3) { var nm = nearMiss(r, tr).slice().sort(function (x, y) { return x - y; }); if (!outs.concat([tr]).some(function (o) { return o.join() === nm.join(); })) outs.push(nm); }
        var fmt = function (s) { return s.join(', '); }, chk = function (s) { return t(s[0] + '^2+' + s[1] + '^2=' + (sq(s[0]) + sq(s[1])) + (same(sq(s[0]) + sq(s[1]), sq(s[2])) ? '=' : '\\ne ') + s[2] + '^2=' + sq(s[2])); };
        var p = P.mc(r, 'Which set of side lengths makes a right triangle?', [{ html: fmt(tr), right: true }].concat(outs.map(function (s) { return { html: fmt(s), why: chk(s) + ', so not a right triangle.', code: 'near' }; })),
          chk(tr) + ', so <b>' + fmt(tr) + '</b> makes a right triangle.<br>' + outs.map(function (s) { return fmt(s) + ': ' + chk(s); }).join('<br>'), ['For each set, compare (shorter)² + (shorter)² with (longest)².'], 'which set');
        p.input.columns = 4; return p;
      } }] },
      /* ---------- 15. ladder MC ---------- */
      { num: '15', stem: '', parts: [{ id: '15', level: 'EMG', make: function (r) {
        var tr = r.pick(triples(30, { not: [[8, 15, 17], [3, 4, 5]], minC: 10 })), gi = r.int(0, 1), f = tr[gi], H = tr[2], h = tr[1 - gi];
        var s2 = rd(Math.sqrt(sq(H) + sq(f)), 1);
        var p = P.mc(r, 'A ' + H + ' ft ladder leans against a wall with its foot ' + f + ' ft from the wall. How high up the wall does it reach?', [
          { html: h + ' ft', right: true }, { html: (H - f) + ' ft', why: 'Subtract the <b>squares</b>, not the lengths: ' + t(H + '^2-' + f + '^2') + '.', code: 'sides' },
          { html: nS(s2) + ' ft', why: 'The ladder is the <b>hypotenuse</b>, so subtract the squares to find the height (a leg).', code: 'add-sq' }, { html: (H + f) + ' ft', why: 'The height must be shorter than the ladder. Subtract the squares.', code: 'add' }],
          t(H + '^2-' + f + '^2=' + sq(H) + '-' + sq(f) + '=' + sq(h)) + ', and ' + t('\\sqrt{' + sq(h) + '}=' + h) + ' ft.', ['The ladder is the hypotenuse. The height is a leg.'], 'ladder MC');
        p.input.columns = 4; return p;
      } }] },
      /* ---------- 16. NR gate ---------- */
      { num: '16', stem: '', parts: [{ id: '16', level: 'PRG', make: function (r) {
        var v = find(function () { var hh = pickR(r, 1, 1.5, 0.05), B = pickR(r, 1.8, 3, 0.05); return { hh: hh, B: B, w: Math.sqrt(sq(B) - sq(hh)) }; }, function (o) { return o.w > o.hh && safe(o.w, 2); });
        return legPart('<b>Numerical response.</b> A farm gate is a rectangle ' + L(v.hh, 'm') + ' high. A diagonal brace runs from one corner to the opposite corner and is ' + L(v.B, 'm') + ' long. The width of the gate, to the nearest hundredth of a metre, is ____ m.', v.B, v.hh, { dp: 2, nr: true, name: 'w', what: 'width', lead: 'The brace is the hypotenuse.', check: false, end: 'The gate is about ' + Lf(v.w, 2, 'm') + ' wide.' });
      } }] },
      /* ---------- 17. NR deck ---------- */
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var base = r.chance(0.75) ? [3, 4, 5] : r.pick([[5, 12, 13], [7, 24, 25]]), k = base[0] === 3 ? r.pick([3, 4, 5, 6, 7, 8, 9, 11, 12]) : r.int(1, 3), a = base[0] * k, b = base[1] * k;
        return hypPart('<b>Numerical response.</b> A deck frame is a rectangle ' + a + ' ft by ' + b + ' ft. To check that it is square, a builder measures a diagonal. If the corners are square, the diagonal is ____ ft.', a, b, { dp: 0, nr: true, name: 'd', end: 'The diagonal is ' + base[2] * k + ' ft. (' + a + '-' + b + '-' + base[2] * k + ' is ' + base.join('-') + ' times ' + k + '.)' });
      } }] }
    ],
    extra: [
      /* ---------- A1 missing legs, drawn ---------- */
      { num: '1', section: 'A. Skills', stem: 'Find the missing leg of each right triangle. Round to the nearest tenth if needed.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) {
          var tr = r.pick(triples(60, { not: WORKED_TRIPLES, minC: 13 })), gi = r.int(0, 1), g = tr[gi], x = tr[1 - gi], H = tr[2];
          return legPart('(a)' + triFig(x, g, { v: 'a', h: lab(g, 'cm'), c: lab(H, 'cm') }, { unknown: 'a' }), H, g, { unit: 'cm', dp: 0, name: 'a' });
        } },
        { id: 'e1b', level: 'BEG', make: function (r) {
          var tr = find(function () { var p = r.pick([[8, 15, 17], [3, 4, 5], [5, 12, 13], [7, 24, 25], [20, 21, 29]]), k = r.pick([0.5, 0.2, 0.3]); return p.map(function (x) { return q(x * k); }); }, function (s) { return s[2] <= 15 && !hasPair([[5.6, 9]], s[0], s[1]); });
          var gi = r.int(0, 1), g = tr[gi], x = tr[1 - gi], H = tr[2];
          return legPart('(b)' + triFig(g, x, { v: lab(g, 'm'), h: 'b', c: lab(H, 'm') }, { unknown: 'b' }), H, g, { unit: 'm', name: 'b' });
        } },
        { id: 'e1c', level: 'EMG', make: function (r) {
          var v = find(function () { var H = r.int(8, 20), g = pickR(r, H * 0.5, H * 0.85, 0.5); return { H: H, g: g, x: Math.sqrt(sq(H) - sq(g)) }; }, function (o) { return safe(o.x, 1) && !same(o.x, rd(o.x, 1)) && !hasPair([[11, 6], [17, 8]], o.H, o.g); });
          return legPart('(c)' + triFig(v.x, v.g, { v: 'x', h: lab(v.g, 'ft'), c: lab(v.H, 'ft') }, { unknown: 'a' }), v.H, v.g, { unit: 'ft' });
        } }] },
      /* ---------- A2 table: leg or hypotenuse ---------- */
      { num: '2', section: 'A. Skills', stem: 'Each row describes a right triangle. Write <b>leg</b> or <b>hypotenuse</b> for the missing side, then find it to the nearest tenth.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) {
          var v = find(function () { var p = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = r.pick([0.3, 0.5, 0.6, 0.7]); return p.map(function (x) { return q(x * k); }); }, function (s) { return s[0] >= 1; });
          return rowPart('(a) legs ' + L(v[0], 'm') + ' and ' + L(v[1], 'm'), 'hyp', v[0], v[1], 'm');
        } },
        { id: 'e2b', level: 'EMG', make: function (r) {
          var tr = r.pick(triples(40, { not: WORKED_TRIPLES, minC: 13 })), gi = r.int(0, 1);
          return rowPart('(b) hypotenuse ' + L(tr[2], 'in') + ', a leg ' + L(tr[gi], 'in'), 'leg', tr[2], tr[gi], 'in', 0);
        } },
        { id: 'e2c', level: 'EMG', make: function (r) {
          var v = find(function () { var H = r.int(9, 25), g = r.int(Math.ceil(H * 0.5), H - 2); return [g, H]; }, function (s) { var x = Math.sqrt(sq(s[1]) - sq(s[0])); return safe(x, 1) && !same(x, rd(x, 0)) && !hasPair([[11, 6], [17, 8]], s[1], s[0]); });
          return rowPart('(c) a leg ' + L(v[0], 'cm') + ', hypotenuse ' + L(v[1], 'cm'), 'leg', v[1], v[0], 'cm');
        } }] },
      /* ---------- A3 right triangle test ---------- */
      { num: '3', section: 'A. Skills', stem: 'Is each triangle a right triangle? Show your work.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var tr = r.pick(triples(100, { not: WORKED_TRIPLES.concat([[11, 60, 61]]), minC: 25 })); return rtTest('(a) ' + tr.map(function (x) { return lab(x, 'm'); }).join(', '), tr, 'm'); } },
        { id: 'e3b', level: 'EMG', make: function (r) {
          var s = find(function () { var a = r.int(4, 12), b = r.int(a + 1, a + 6), c = r.int(b + 1, a + b - 1); return [a, b, c]; }, function (z) { return !same(sq(z[0]) + sq(z[1]), sq(z[2])) && !(z.join() === '6,7,9') && !(z.join() === '7,9,12'); });
          return rtTest('(b) ' + s.map(function (x) { return lab(x, 'cm'); }).join(', '), s, 'cm');
        } },
        { id: 'e3c', level: 'PRG', make: function (r) {
          var tr = find(function () { var p = r.pick([[9, 40, 41], [7, 24, 25], [11, 60, 61], [5, 12, 13], [8, 15, 17], [20, 21, 29]]); return p.map(function (x) { return q(x / 10); }); }, function (s) { return !hasPair([[0.9, 4]], s[0], s[1]) || r.chance(0.2); });
          var s = r.chance(0.7) ? tr : nearMiss(r, tr), o2 = [s[2], s[0], s[1]];
          return rtTest('(c) ' + o2.map(function (x) { return lab(x, 'ft'); }).join(', '), o2, 'ft');
        } }] },
      /* ---------- A4 DEF: hypotenuse and rearranging ---------- */
      { num: '4', section: 'A. Skills', stem: function (sh) { return 'In ' + t('\\triangle ' + sh.s.join('')) + ' the right angle is at ' + t(sh.R) + '. The sides are ' + t(sh.s.map(function (c) { return c.toLowerCase(); }).join(',\\ ')) + ' (each across from the matching corner).'; },
        shared: function (r) { return triLetters(r, true); },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) { return thmMC(r, '(a) Which side is the hypotenuse? Which equation is the Pythagorean theorem for ' + t('\\triangle ' + sh.s.join('')) + '?', sh.legs.map(function (c) { return c.toLowerCase(); }), sh.R.toLowerCase()); } },
          { id: 'e4b', level: 'EMG', outcome: 'A1', make: function (r, sh) {
            var x = sh.legs[0].toLowerCase(), y = sh.legs[1].toLowerCase(), h = sh.R.toLowerCase(), S = function (a, b, op) { return t(a + '^2=' + (op === '+' ? b[0] + '^2+' + b[1] + '^2' : b[0] + '^2-' + b[1] + '^2')); };
            return mcCols(P.mc(r, '(b) Rearrange your formula to find ' + t(x) + ', and again to find ' + t(y) + '.', [
              { html: S(x, [h, y]) + ' and ' + S(y, [h, x]), right: true },
              { html: S(x, [h, y], '+') + ' and ' + S(y, [h, x], '+'), why: 'To get a leg by itself, <b>subtract</b> the other leg’s square from both sides.', code: 'add' },
              { html: S(x, [y, h]) + ' and ' + S(y, [x, h]), why: 'Big square minus small square: the hypotenuse ' + t(h) + ' comes first.', code: 'order' },
              { html: t(x + '=' + h + '-' + y) + ' and ' + t(y + '=' + h + '-' + x), why: 'Rearrange the <b>squares</b>: ' + t(x + '^2=' + h + '^2-' + y + '^2') + '.', code: 'no-square' }],
              t(x + '^2+' + y + '^2=' + h + '^2') + '<br>Subtract ' + t(y + '^2') + ': ' + t(x + '^2=' + h + '^2-' + y + '^2') + '<br>Subtract ' + t(x + '^2') + ': ' + t(y + '^2=' + h + '^2-' + x + '^2'), ['Start from ' + t(x + '^2+' + y + '^2=' + h + '^2') + '. Subtract the other leg’s square from both sides.'], 'rearrange DEF'), 1);
          } }] },
      /* ---------- A5 Mia ---------- */
      { num: '5', section: 'A. Skills', stem: function (sh) { return sh.p.n + ' had to find a leg when the hypotenuse is ' + L(sh.H, 'cm') + ' and the other leg is ' + L(sh.l, 'cm') + '. ' + cap(sh.p.he) + ' wrote ' + t('b^2=' + N(sh.l) + '^2-' + N(sh.H) + '^2=' + N(sq(sh.l) - sq(sh.H))) + ' and said the triangle can’t exist.'; },
        shared: function (r) { var tr = r.pick(triples(30, { not: [[8, 15, 17], [3, 4, 5]], minC: 10 })), gi = r.int(0, 1); return { H: tr[2], l: tr[gi], x: tr[1 - gi], p: person(r) }; },
        parts: [
          { id: 'e5i', sub: 'i', level: 'EMG', make: function (r, sh) {
            return P.mc(r, '(i) What did ' + sh.p.he + ' do wrong?', [
              { html: cap(sh.p.he) + ' subtracted in the wrong order. Always do hypotenuse² minus leg² (big square minus small square).', right: true },
              { html: cap(sh.p.he) + ' should have added the squares.', why: 'Adding the squares gives the <b>hypotenuse</b>, which is already known here.', code: 'add' },
              { html: cap(sh.p.he) + ' is right: the triangle can’t exist.', why: 'A right triangle with a ' + sh.H + ' cm hypotenuse and a ' + sh.l + ' cm leg is fine: the leg is shorter than the hypotenuse.', code: 'agree' },
              { html: cap(sh.p.he) + ' forgot to take the square root first.', why: 'The square root comes <b>last</b>. The problem is the order of the subtraction.', code: 'root' }],
              cap(sh.p.he) + ' subtracted in the wrong order. Always do hypotenuse² minus leg² (big minus small).', ['A square can’t be negative. Which number should come first?'], 'Mia mistake');
          } },
          { id: 'e5ii', sub: 'ii', level: 'EMG', make: function (r, sh) { return legPart('(ii) Find the leg.', sh.H, sh.l, { unit: 'cm', dp: 0, name: 'b' }); } }] },
      /* ---------- B6 laptop ---------- */
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'PRG', make: function (r) {
        var v = find(function () { var d = r.pick([11.6, 12.5, 13.3, 14, 15.6, 16, 17.3]), w = rd(d * 0.87 + r.int(-2, 2) / 10, 1); return { d: d, w: w, h: Math.sqrt(sq(d) - sq(w)) }; }, function (o) { return safe(o.h, 1) && !hasPair([[15.6, 13.6]], o.d, o.w) || r.chance(0.15); });
        return legPart('A laptop screen is ' + L(v.d, 'in') + ' on the diagonal and ' + L(v.w, 'in') + ' wide. How tall is the screen, to the nearest tenth of an inch?', v.d, v.w, { unit: 'in', name: 'h', what: 'height', lead: 'The diagonal is the hypotenuse.', end: 'The screen is about ' + Lf(v.h, 1, 'in') + ' tall.' });
      } }] },
      /* ---------- B7 ramp ---------- */
      { num: '7', section: 'B. Applying', stem: function (sh) { return 'A wheelchair ramp at a community hall in Brooks is ' + L(sh.Lr, 'm') + ' long. It covers ' + L(sh.R, 'm') + ' along the ground.'; },
        shared: function (r) { return find(function () { var R = r.pick([3.6, 4.2, 4.8, 5.4, 6, 6.6, 7.2]), d = r.pick([0.01, 0.02, 0.02, 0.03, 0.04]), Lr = q(R + d); return { R: R, Lr: Lr, h: Math.sqrt(sq(Lr) - sq(R)) }; }, function (o) { return safe(o.h, 2) && Math.abs(o.h - o.R / 12) >= 0.02; }); },
        parts: [
          { id: 'e7a', level: 'ADV', make: function (r, sh) {
            var r1 = Math.sqrt(Math.max(0, rd(sq(sh.Lr), 1) - rd(sq(sh.R), 1)));
            return legPart('(a) How high does the ramp rise, to the nearest hundredth of a metre?', sh.Lr, sh.R, { unit: 'm', dp: 2, name: 'r', what: 'rise', lead: 'The ramp is the hypotenuse.', end: 'The ramp rises about ' + Lf(sh.h, 2, 'm') + '.',
              alts: [{ v: r1, code: 'u7l3-round-squares', hint: 'Keep <b>every</b> decimal of the squares (' + t(N(sh.Lr) + '^2=' + N(sq(sh.Lr))) + '). The two squares are very close, so rounding them changes the answer a lot.' }] });
          } },
          { id: 'e7b', level: 'PRG', make: function (r, sh) {
            var M = q(sh.R / 12), H = rd(sh.h, 2), steep = sh.h > M;
            return P.mc(r, '(b) A common guideline says a ramp should rise no more than about 1 m for every 12 m along the ground. Does this ramp follow it?', [
              { html: '<b>Yes.</b> The most it should rise is ' + t(N(sh.R) + '\\div 12=' + M.toFixed(2)) + ' m, and it rises only ' + H.toFixed(2) + ' m.', right: !steep, why: steep ? 'Compare: is ' + H.toFixed(2) + ' m really less than ' + M.toFixed(2) + ' m?' : null, code: 'ok' },
              { html: '<b>No.</b> The most it should rise is ' + t(N(sh.R) + '\\div 12=' + M.toFixed(2)) + ' m, but it rises ' + H.toFixed(2) + ' m: it is too steep.', right: steep, why: steep ? null : 'Compare: is ' + H.toFixed(2) + ' m really more than ' + M.toFixed(2) + ' m?', code: 'steep' },
              { html: '<b>No.</b> The ramp is longer than the ground distance, so it is too steep.', why: 'A ramp is always a little longer than the ground it covers. Compare the rise with the ground distance ÷ 12.', code: 'longer' },
              { html: 'You can’t tell without the angle of the ramp.', why: 'You can tell: the most it should rise is the ground distance ÷ 12. Compare that with the rise from (a).', code: 'cant' }],
              'Over ' + L(sh.R, 'm') + ' the most it should rise is ' + t(N(sh.R) + '\\div 12=' + M.toFixed(2)) + ' m.<br>It rises ' + H.toFixed(2) + ' m, ' + (steep ? 'which is more, so the ramp is a little too steep.' : 'which is less, so the ramp follows the guideline.'), ['Find ground distance ÷ 12 and compare it with the rise.'], 'ramp guideline', true);
          } }] },
      /* ---------- B8 diamond ---------- */
      { num: '8', section: 'B. Applying', stem: '', parts: [{ id: 'e8', level: 'EMG', make: function (r) {
        var g = r.pick([['softball', [55, 60, 65]], ['baseball', [60, 70, 80, 90]]]), s = r.pick(g[1]);
        return hypPart('A ' + g[0] + ' diamond is a square with ' + s + ' ft between the bases. How far does the catcher throw from home plate to second base, to the nearest tenth of a foot?' + rectFig(1, 1, { w: lab(s, 'ft'), h: lab(s, 'ft'), d: 'd' }, { width: 170, height: 170, aria: 'a square diamond with its diagonal' }), s, s, { unit: 'ft', name: 'd', what: 'throw',
          lead: 'Home to second is the diagonal of the square: the hypotenuse of a right triangle with legs ' + s + ' ft and ' + s + ' ft.', alts: [{ v: 2 * s, code: 'u7l3-two-sides', hint: 'Going along two bases is ' + 2 * s + ' ft, but the throw goes straight across: the hypotenuse.' }] });
      } }] },
      /* ---------- B9 concrete pad ---------- */
      { num: '9', section: 'B. Applying', stem: function (sh) { return 'A concrete crew builds the wooden form for a rectangular pad ' + L(sh.a, 'm') + ' by ' + L(sh.b, 'm') + '.'; },
        shared: function (r) { var k = r.pick([0.6, 0.8, 1.2, 1.4, 1.6, 1.8, 2.2, 2.4]); return { k: k, a: q(3 * k), b: q(4 * k), d: q(5 * k) }; },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) {
            var s = q(sq(sh.a) + sq(sh.b));
            return P.fields('(a) How long should each diagonal be? Which 3-4-5 multiple is this?', [{ label: 'Diagonal:', after: 'm', name: 'diagonal' }, { label: '3-4-5 times', name: 'multiple' }],
              [G.lenChk(sh.d, { dp: 1, pyth: { legs: [sh.a, sh.b] } }), exactChk(sh.k, { bad: [[sh.d, 'u7l3-k-diag', 'That is the diagonal. The multiple is the number that 3, 4 and 5 are multiplied by: ' + t(nS(sh.a) + '\\div 3') + '.'], [q(sh.a / 4), 'u7l3-table-row', 'Divide the <b>short</b> side by 3 (or the long side by 4).']] })],
              [nS(sh.d), nS(sh.k)], 'Diagonal ' + L(sh.d, 'm') + '; 3-4-5 times ' + t(nS(sh.k)),
              br([t('d^2=' + N(sh.a) + '^2+' + N(sh.b) + '^2=' + N(sq(sh.a)) + '+' + N(sq(sh.b)) + '=' + N(s)), t('d=\\sqrt{' + N(s) + '}=' + N(sh.d)) + ' m', 'This is 3-4-5 times ' + nS(sh.k) + ': ' + t(nS(sh.a) + '\\div 3=' + nS(sh.k)) + '.']),
              HYP_HINTS.concat(['For the multiple, divide the short side by 3.']), 'pad diagonal');
          } },
          { id: 'e9b', level: 'PRG', make: function (r, sh) {
            return P.mc(r, '(b) Why does the crew measure <b>both</b> diagonals, not just one?', [
              { html: 'In a rectangle the two diagonals are equal. If both are ' + nS(sh.d) + ' m, every corner is square; if they are different, the form is pushed over.', right: true },
              { html: 'To get an average, in case they measured one wrong.', why: 'An average hides the problem. Equal diagonals show the corners are square.', code: 'avg' },
              { html: 'One diagonal checks the length and the other checks the width.', why: 'Each diagonal depends on <b>both</b> the length and the width.', code: 'lw' },
              { html: 'There is no reason: one diagonal is always enough.', why: 'One diagonal can be right while the form is still pushed over. Compare both.', code: 'one' }],
              'In a rectangle the two diagonals are equal. If they are both ' + nS(sh.d) + ' m, every corner is square. If they are different, the form is pushed over and must be fixed.', ['What is true about the two diagonals of a rectangle?'], 'both diagonals');
          } }] },
      /* ---------- B10 MC 20-21-29 ---------- */
      { num: '10', section: 'B. Applying', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var tr = r.pick(triples(60, { not: [[3, 4, 5], [9, 40, 41], [8, 15, 17], [6, 8, 10]], minC: 13 })), a = tr[0], b = tr[1], c = tr[2];
        return P.mc(r, 'A triangle has sides of ' + a + ' cm, ' + b + ' cm and ' + c + ' cm. Which statement is true?', [
          { html: 'It is a right triangle, because ' + t(a + '^2+' + b + '^2=' + c + '^2') + '.', right: true },
          { html: 'It is not a right triangle, because ' + t(a + '+' + b) + ' is not ' + c + '.', why: 'The test uses the <b>squares</b> of the sides, not the sides.', code: 'sides' },
          { html: 'It is a right triangle, because ' + c + ' is the longest side.', why: 'Every triangle has a longest side. Test the squares.', code: 'longest' },
          { html: 'It is not a right triangle, because ' + t(b + '^2+' + c + '^2') + ' is not ' + t(a + '^2') + '.', why: 'The longest side must be ' + t('c') + ': test ' + t(a + '^2+' + b + '^2') + ' against ' + t(c + '^2') + '.', code: 'wrong-c' }],
          t(a + '^2+' + b + '^2=' + sq(a) + '+' + sq(b) + '=' + sq(c) + '=' + c + '^2') + ', so it is a right triangle.', ['Square the two shorter sides and add. Compare with the longest side squared.'], 'which statement');
      } }] },
      /* ---------- B11 NR frame ---------- */
      { num: '11', section: 'B. Applying', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.int(20, 60), r.int(30, 75)]; }, function (s) { var d = Math.sqrt(sq(s[0]) + sq(s[1])); return s[1] > s[0] + 5 && d < 99.9 && safe(d, 1) && !same(d, rd(d, 0)); });
        return hypPart('<b>Numerical response.</b> A framer checks a picture frame that should be a rectangle ' + v[0] + ' cm by ' + v[1] + ' cm. If its corners are square, each diagonal, to the nearest tenth of a centimetre, is ____ cm.', v[0], v[1], { nr: true, name: 'd', what: 'diagonal' });
      } }] },
      /* ---------- C12 roof ---------- */
      { num: '12', section: 'C. Stretch', stem: function () {
          return 'A house has a peaked roof. Each rafter runs from the peak down to the top of a side wall. The peak is straight above the middle of the house.' +
            HW.fig({ pts: { A: [0, 0], B: [9.6, 0], T: [4.8, 2], M: [4.8, 0] }, segs: [['A', 'B', 'span'], ['A', 'T', 'rafter'], ['T', 'B'], ['M', 'T', 'height', { dash: true }]], right: [['M', 'B', 'T']], names: false, extra: [{ type: 'dash', from: [0, 0], to: [0, -1.4] }, { type: 'dash', from: [9.6, 0], to: [9.6, -1.4] }], width: 300, height: 150, aria: 'a peaked roof' });
        },
        parts: [
          { id: 'e12a', level: 'ADV', make: function (r) {
            var v = find(function () { var S = pickR(r, 6, 12, 0.4), Pk = pickR(r, 1.2, 3, 0.1); return { S: S, Pk: Pk, hs: q(S / 2), r: Math.sqrt(sq(S / 2) + sq(Pk)) }; }, function (o) { return safe(o.r, 1) && !(o.S === 9.6 && o.Pk === 2); });
            return hypPart('(a) The house is ' + L(v.S, 'm') + ' wide (the span) and the peak is ' + L(v.Pk, 'm') + ' above the top of the walls. How long is each rafter, to the nearest tenth of a metre?', v.hs, v.Pk, { unit: 'm', name: 'r', what: 'rafter', lead: 'Half the span is ' + t(N(v.S) + '\\div 2=' + N(v.hs)) + ' m. The rafter is the hypotenuse.',
              alts: [{ v: Math.sqrt(sq(v.S) + sq(v.Pk)), code: 'u7l3-full-span', hint: 'The rafter only goes to the middle: use <b>half</b> the span (' + t(N(v.S) + '\\div 2') + ') as the leg.' }], hints: ['The peak is above the middle, so the right triangle uses <b>half</b> the span.', 'The rafter is the hypotenuse: add the squares.'] });
          } },
          { id: 'e12b', level: 'MAS', make: function (r) {
            var v = find(function () {
              if (r.chance(0.5)) { var p = r.pick([[5, 12, 13], [3, 4, 5], [8, 15, 17], [7, 24, 25]]), k = r.pick([0.5, 0.4, 0.3, 0.2, 1]); var hs = q(p[1] * k), Pk = q(p[0] * k); return { S: q(2 * hs), hs: hs, R: q(p[2] * k), Pk: Pk }; }
              var S = pickR(r, 8, 14, 0.4), R = q(S / 2 + pickR(r, 0.3, 1.2, 0.1)); return { S: S, hs: q(S / 2), R: R, Pk: Math.sqrt(sq(R) - sq(S / 2)) };
            }, function (o) { return o.Pk >= 0.9 && o.Pk < o.hs && safe(o.Pk, 1) && o.S >= 6 && o.S <= 16 && !(o.S === 12 && o.R === 6.5); });
            return legPart('(b) On a garage, the span is ' + L(v.S, 'm') + ' and each rafter is ' + L(v.R, 'm') + ' long. How high is the peak above the top of the walls, to the nearest tenth of a metre?', v.R, v.hs, { unit: 'm', name: 'h', what: 'peak', lead: 'Half the span is ' + t(N(v.S) + '\\div 2=' + N(v.hs)) + ' m. The rafter is the hypotenuse; the height is a leg.', end: 'The peak is about ' + Lf(v.Pk, 1, 'm') + ' above the walls.',
              alts: [{ v: Math.sqrt(sq(v.R) + sq(v.hs)), code: 'pyth-hyp-leg', hint: 'The rafter is the <b>hypotenuse</b> (the longest side), so subtract: ' + t('h^2=' + N(v.R) + '^2-' + N(v.hs) + '^2') + '.' }, { v: Math.sqrt(Math.abs(sq(v.S) - sq(v.R))), code: 'u7l3-full-span', hint: 'The rafter only reaches the middle: use <b>half</b> the span as the leg.' }],
              hints: ['The peak is above the middle, so the right triangle uses <b>half</b> the span.', 'The rafter is the hypotenuse; the height is a leg: subtract the squares.'] });
          } }] },
      /* ---------- C13 foundation, short tape ---------- */
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A crew is laying out a house foundation ' + sh.a + ' ft by ' + sh.b + ' ft. Their tape measure is only ' + sh.T + ' ft long.'; },
        shared: function (r) { return find(function () { var m = r.int(6, 12), T = r.pick([12, 15, 16, 20, 25, 25, 30]); return { m: m, a: 3 * m, b: 4 * m, T: T, k: Math.floor(T / 5) }; }, function (o) { return 5 * o.m > o.T && 4 * o.k <= o.b && o.k >= 2; }); },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) { return hypPart('(a) If the corners are square, how long is the full diagonal of the foundation?', sh.a, sh.b, { unit: 'ft', dp: 0, name: 'd', what: 'diagonal', end: 'The diagonal is ' + 5 * sh.m + ' ft (3-4-5 times ' + sh.m + '). That is too long for their ' + sh.T + ' ft tape.' }); } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) {
            var k = sh.k, want = [3 * k, 4 * k, 5 * k];
            var chk = function (resp) {
              resp = resp || []; var a = resp.map(function (x) { return readNum(x); });
              for (var i = 0; i < 3; i++) if (a[i].res) return { v: a[i].res.v, code: a[i].res.code, hint: '<b>' + ['First mark', 'Second mark', 'Diagonal'][i] + ':</b> ' + a[i].res.hint };
              var x = a[0].v, y = a[1].v, d = a[2].v, s = [x, y].sort(function (p, q2) { return p - q2; });
              if (same(s[0], 3 * k) && same(s[1], 4 * k) && same(d, 5 * k)) return ok();
              var m = s[0] / 3;
              if (!(same(s[1], 4 * m) && same(d, 5 * m))) return wrong('u7l3-not-345', 'The marks and the diagonal must be a 3-4-5 multiple: 3 × m, 4 × m and 5 × m for the same m.');
              if (d > sh.T + 1e-9) return wrong('u7l3-tape-long', 'A ' + nS(d) + ' ft diagonal is too long for a ' + sh.T + ' ft tape.');
              if (s[1] > sh.b + 1e-9 || s[0] > sh.a + 1e-9) return wrong('u7l3-tape-side', 'The marks must fit along the walls (' + sh.a + ' ft and ' + sh.b + ' ft).');
              return wrong('u7l3-tape-small', 'That works, but a <b>bigger</b> triangle is more accurate. What is the biggest 3-4-5 multiple whose diagonal still fits on the ' + sh.T + ' ft tape?');
            };
            return { prompt: '(b) Which 3-4-5 multiple should they use at each corner to check it with their tape? Use the biggest one that fits.', input: { type: 'fields', fields: [{ label: 'Mark along one wall:', after: 'ft', name: 'First mark' }, { label: 'Mark along the other wall:', after: 'ft', name: 'Second mark' }, { label: 'The diagonal should be:', after: 'ft', name: 'Diagonal' }] },
              check: chk, key: want.map(String), answer: want.join(' ft, ') + ' ft (3-4-5 times ' + k + ')',
              solution: br(['The diagonal is the longest side, so it must fit on the tape: ' + t('5\\times ' + k + '=' + 5 * k + '\\le ' + sh.T) + ' (but ' + t('5\\times ' + (k + 1) + '=' + 5 * (k + 1)) + ' is too long).', 'Use ' + want.join('-') + ' (3-4-5 times ' + k + '): mark ' + 3 * k + ' ft on one wall and ' + 4 * k + ' ft on the other; the diagonal should be ' + 5 * k + ' ft.']),
              hints: ['The diagonal (the 5 part) is the longest: it has to fit on the ' + sh.T + ' ft tape.', 'Find the biggest whole number m with 5 × m no more than ' + sh.T + '.'], text: 'tape multiple', bad: [[String(3 * (k - 1)), String(4 * (k - 1)), String(5 * (k - 1))], [String(3 * (k + 1)), String(4 * (k + 1)), String(5 * (k + 1))]] };
          } }] },
      /* ---------- C14 knotted rope ---------- */
      { num: '14', section: 'C. Stretch', stem: function (sh) { return 'Long ago, builders are said to have made square corners with a loop of rope tied with knots that split it into ' + sh.n + ' equal sections.'; },
        shared: function (r) { var m = r.pick([1, 1, 2, 3]); return { m: m, n: 12 * m }; },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) {
            var m = sh.m, a = 3 * m, b = 4 * m, c = 5 * m, eq = 4 * m, z = 2 * m;
            return P.mc(r, '(a) How can you stretch the rope into a triangle with a right angle? Why does it work?', [
              { html: 'Sides of ' + a + ', ' + b + ' and ' + c + ' sections: ' + t(a + '^2+' + b + '^2=' + c + '^2') + ', so the angle between the ' + a + ' and ' + b + ' sides is 90°.', right: true },
              { html: 'Sides of ' + eq + ', ' + eq + ' and ' + eq + ' sections: equal sides make a right angle.', why: 'Equal sides make all three angles 60°. Check ' + t(eq + '^2+' + eq + '^2') + ' against ' + t(eq + '^2') + '.', code: 'equal' },
              { html: 'Sides of ' + a + ', ' + b + ' and ' + c + ' sections: the right angle is between the ' + b + ' and ' + c + ' sides.', why: 'The right angle is <b>across from</b> the longest side (' + c + '), so it is between the ' + a + ' and ' + b + ' sides.', code: 'where' },
              { html: 'Sides of ' + z + ', ' + (5 * m) + ' and ' + (5 * m) + ' sections: two long sides make a square corner.', why: t(z + '^2+' + 5 * m + '^2') + ' is not ' + t(5 * m + '^2') + ', so that corner is not 90°.', code: 'iso' }],
              'Pull it into a triangle with sides of ' + a + ', ' + b + ' and ' + c + ' sections (' + a + ' + ' + b + ' + ' + c + ' = ' + sh.n + '). Since ' + t(a + '^2+' + b + '^2=' + (a * a) + '+' + (b * b) + '=' + (c * c) + '=' + c + '^2') + ', the angle between the ' + a + ' and ' + b + ' sides is 90°.', ['Which three whole numbers add to ' + sh.n + ' and pass the right-triangle test?'], 'rope triangle');
          } },
          { id: 'e14b', level: 'ADV', make: function (r) {
            var c = r.pick([{ n: 30, s: [5, 12, 13] }, { n: 40, s: [8, 15, 17] }, { n: 56, s: [7, 24, 25] }, { n: 36, s: [9, 12, 15] }, { n: 30, s: [6, 11, 13] }, { n: 30, s: [7, 10, 13] }, { n: 40, s: [9, 14, 17] }, { n: 36, s: [8, 13, 15] }, { n: 60, s: [10, 24, 26] }]);
            var s = c.s, sum = s[0] + s[1] + s[2], sq2 = sq(s[0]) + sq(s[1]), cc = sq(s[2]), right = sq2 === cc;
            return P.fields('(b) Could a loop with ' + c.n + ' equal sections make a right triangle using ' + s[0] + ', ' + s[1] + ' and ' + s[2] + ' sections? Show your work.', [{ label: t(s[0] + '+' + s[1] + '+' + s[2] + '='), name: 'sum of the sections' }, { label: t(s[0] + '^2+' + s[1] + '^2='), name: 'a² + b²' }, { label: t(s[2] + '^2='), name: 'c²' }, { label: 'Right triangle?', mode: 'text', placeholder: 'yes/no', name: 'Right triangle?' }],
              [exactChk(sum), exactChk(sq2, { bad: [[s[0] + s[1], 'u7l3-no-square', 'Square each number first, then add.'], [2 * s[0] + 2 * s[1], 'pyth-double', 'a² means a × a, not 2 × a.']] }), exactChk(cc, { bad: [[2 * s[2], 'pyth-double', 'c² means c × c, not 2 × c.']] }), wordChk(right ? 'yes' : 'no', 'yn', right ? 'The sections add to ' + c.n + ' and the squares match: it <b>is</b> a right triangle.' : t(sq2 + '\\ne ' + cc) + ', so the triangle would <b>not</b> have a right angle.')],
              [String(sum), String(sq2), String(cc), right ? 'yes' : 'no'], t(s.join('+') + '=' + sum) + ', ' + t(s[0] + '^2+' + s[1] + '^2=' + sq2) + ', ' + t(s[2] + '^2=' + cc) + '; ' + (right ? 'yes' : 'no'),
              br([t(s.join('+') + '=' + sum) + ' ✓ (the whole loop)', t(s[0] + '^2+' + s[1] + '^2=' + sq(s[0]) + '+' + sq(s[1]) + '=' + sq2) + ' and ' + t(s[2] + '^2=' + cc), right ? 'Equal, so <b>yes</b>, it makes a right triangle.' : 'Not equal, so <b>no</b>: it makes a triangle, but not a right triangle.']),
              ['The sections must use the whole loop. Then test the squares.'], 'rope 30');
          } }] }
    ]
  });

  /* a "leg or hypotenuse?" part with a drawn triangle. o: { v, h (the legs: numbers, either may be the unknown), H (hyp when a leg is unknown), u, unk 'c' | 'v' | 'h', nm, fig } */
  function lhPart(tag, o) {
    var u = o.u, nm = o.nm, isHyp = o.unk === 'c', fig, chk, key, sol, val;
    if (isHyp) {
      val = Math.sqrt(sq(o.v) + sq(o.h));
      fig = triFig(o.v, o.h, { v: lab(o.v, u), h: lab(o.h, u), c: nm }, Object.assign({ unknown: 'c' }, o.fig));
      chk = G.lenChk(val, { dp: 1, pyth: { legs: [o.v, o.h] } });
      sol = hypLines(o.v, o.h, nm, u, 1, { lead: t(nm) + ' is across from the right angle: it is the <b>hypotenuse</b>. Add.', end: 'The missing side is the hypotenuse, about ' + Lf(val, 1, u) + '.' });
    } else {
      val = Math.sqrt(sq(o.H) - sq(o.h));
      fig = triFig(val, o.h, { v: nm, h: lab(o.h, u), c: lab(o.H, u) }, Object.assign({ unknown: 'a' }, o.fig));
      chk = G.lenChk(val, { dp: 1, pyth: { hyp: o.H, leg: o.h } });
      sol = legLines(o.H, o.h, nm, u, 1, { lead: t(nm) + ' is next to the right angle: it is a <b>leg</b>. The ' + lab(o.H, u) + ' side is the hypotenuse. Subtract.', end: 'The missing side is a leg, about ' + Lf(val, 1, u) + '.' });
    }
    key = [isHyp ? 'hypotenuse' : 'leg', rd(val, 1).toFixed(1)];
    return P.fields(tag + fig, [{ label: 'The missing side is a', mode: 'text', wide: true, placeholder: 'leg or hypotenuse', name: 'Leg or hypotenuse' }, { label: t(nm + '='), after: u, name: nm }],
      [wordChk(isHyp ? 'hyp' : 'leg', 'lh', isHyp ? t(nm) + ' is across from the right-angle box, so it is the <b>hypotenuse</b>.' : t(nm) + ' is one of the two sides that make the right angle, so it is a <b>leg</b>.'), chk],
      key, (isHyp ? 'hypotenuse' : 'leg') + '; ' + t(nm + '\\approx ' + fx(val, 1)) + ' ' + u, sol,
      ['The hypotenuse is across from the right-angle box. Missing hypotenuse: add the squares. Missing leg: subtract.'], 'leg or hyp');
  }
  /* a row of the "what you know" table: want 'hyp' (a, b legs) | 'leg' (a = hyp, b = leg) */
  function rowPart(prompt, want, a, b, u, dp) {
    dp = dp == null ? 1 : dp;
    var isHyp = want === 'hyp', val = isHyp ? Math.sqrt(sq(a) + sq(b)) : Math.sqrt(sq(a) - sq(b));
    var chk = G.lenChk(val, { dp: dp, pyth: isHyp ? { legs: [a, b] } : { hyp: a, leg: b } });
    var work = isHyp ? t('\\sqrt{' + N(sq(a)) + '+' + N(sq(b)) + '}=\\sqrt{' + N(q(sq(a) + sq(b))) + '}' + toN(val, dp)) : t('\\sqrt{' + N(sq(a)) + '-' + N(sq(b)) + '}=\\sqrt{' + N(q(sq(a) - sq(b))) + '}' + toN(val, dp));
    return P.fields(prompt, [{ label: 'Missing side is a', mode: 'text', wide: true, placeholder: 'leg or hypotenuse', name: 'Leg or hypotenuse' }, { label: 'Missing side:', after: u, name: 'length' }],
      [wordChk(isHyp ? 'hyp' : 'leg', 'lh', isHyp ? 'Both <b>legs</b> are given, so the missing side is the hypotenuse.' : 'The hypotenuse is given, so the missing side is a <b>leg</b>.'), chk],
      [isHyp ? 'hypotenuse' : 'leg', dp ? rd(val, dp).toFixed(dp) : String(rd(val, 0))], (isHyp ? 'hypotenuse' : 'leg') + '; ' + t(fx(val, dp)) + ' ' + u,
      (isHyp ? 'Both legs are given: the missing side is the <b>hypotenuse</b>. Add the squares.' : 'The hypotenuse is given: the missing side is a <b>leg</b>. Subtract the squares.') + '<br>' + work + ' ' + u,
      ['If both legs are given, the missing side is the hypotenuse (add). If the hypotenuse is given, the missing side is a leg (subtract).'], 'table row');
  }
})(window);
