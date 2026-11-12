/* Math 10-3 · Unit 7 · Lesson 10 — Unit 7 Review (G2, G4, A1 per part)
 * Assignment 10 (u7_l10.tex, set up like the unit test: Part A Written Response 1–14, Part B Multiple Choice 15–22,
 * Part C Numerical Response 23–26) and the Lesson 10 Extra Practice (u7_ep10.tex, Practice Test 2: A 1–5, B 6–12,
 * C 13–15). Every part is a generator: the booklet item's situation and difficulty with new numbers around the booklet's
 * (the worked examples' numbers — √70, 34°, legs 9 and 14, the 15 m elevator 9.5 m out, the 2.4 × 3.2 shed, 16-63-65,
 * 12-35-37, 38° / 27° / 63° sides, the 35° solar panel, 1.8 m over 14 m, 60 m over 250 m, the 55 m steeple at 27°, the
 * 32 m tower at 9°, 41° with 15 cm, the 52 m tower with 61° and 48° — are left out).
 * Outcomes per part: G2 squares, square roots and the Pythagorean theorem (the right-triangle test, square corners, the
 * 3-4-5 method, diagonals); G4 naming sides, the trig ratios, angles from inverse ratios, elevation and depression,
 * solving triangles; A1 where the unknown is on the bottom of the ratio (x = side ÷ sin θ …, the same convention as the
 * Unit 7 test).
 * Conversions for answering on screen: "fill in the blanks" → labelled boxes; "is it a right triangle? show your work" →
 * a² + b², c² and yes/no in boxes; "is the corner square? too big or too small?" → multiple choice of reasons; "label
 * opp, adj, hyp" → the lengths typed beside opp, adj and hyp; ratios "as a fraction and a decimal" → the decimal to 4
 * places (a fraction is accepted too); "fill in the table, what do you notice?" → the three ratios in boxes plus a
 * multiple-choice reason; "sketch and label, then solve" → the sketch is in the solution; "how can you tell / find and
 * fix the error" → multiple choice of reasons plus the corrected number; "will it fit?" → yes/no beside the diagonal.
 * Hints aimed at real mistakes (HW.geo.lenChk / angleRatioChk): RAD mode, × vs ÷, the wrong ratio, no inverse, the
 * other acute angle, no square root, adding the squares for a leg, the hypotenuse as a leg, doubling for a square; here:
 * a ratio upside down, adding the legs, forgetting the post or instrument height, adding the two distances, subtracting
 * the angles first, the right-triangle test with the wrong longest side, a rounded floor diagonal squared again.
 * Self-contained: uses only HW.geo (js/geokit.js) and the kit, no other Unit 7 lesson file. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P;
  var RAD = Math.PI / 180;

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
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7l10: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function pickR(r, a, b, st) { st = st || 1; return q(a + st * r.int(0, Math.round((b - a) / st))); }
  function intNot(r, a, b, not) { return find(function () { return r.int(a, b); }, function (v) { return (not || []).indexOf(v) < 0; }, a); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var TR = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var INV = { sin: function (v) { return Math.asin(v) / RAD; }, cos: function (v) { return Math.acos(v) / RAD; }, tan: function (v) { return Math.atan(v) / RAD; } };
  var MN = { sin: 'SOH', cos: 'CAH', tan: 'TOA' }, NOSIDE = { sin: 'adj', cos: 'opp', tan: 'hyp' }, RW = { sin: 'opp ÷ hyp', cos: 'adj ÷ hyp', tan: 'opp ÷ adj' };
  function fnT(fn, deg) { return '\\' + fn + ' ' + dg(deg); }
  function fr(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }
  var NAMES = ['Amara', 'Kai', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Devon', 'Rosa', 'Theo', 'Aisha', 'Maya', 'Dani', 'Kenji', 'Sofia', 'Omar', 'Tyler', 'Jaya', 'Reza', 'Ines', 'Tariq', 'Gita'];
  var SHE = { Amara: 1, Noor: 1, Priya: 1, Kayla: 1, Hana: 1, Rosa: 1, Aisha: 1, Maya: 1, Dani: 1, Sofia: 1, Jaya: 1, Ines: 1, Gita: 1 };
  function he(n) { return SHE[n] ? 'she' : 'he'; }
  function his(n) { return SHE[n] ? 'her' : 'his'; }
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [11, 60, 61], [28, 45, 53], [33, 56, 65], [13, 84, 85], [36, 77, 85], [39, 80, 89], [48, 55, 73]];

  /* a nudge (no try) for a carried value rounded too early */
  function early(chk, vals, dp, hint) {
    return function (resp) {
      var res = chk(resp); if (res.v === 'correct') return res;
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/^\s*[A-Za-z∠ ]{0,8}=\s*/, '').replace(/\^\{?\\circ\}?|°|\\circ/g, '').replace(/\s*[a-zA-Z]+\.?\s*$/, '').trim();
      var p = HW.parse.number(s);
      if (p.ok) for (var i = 0; i < vals.length; i++) if (isFinite(vals[i]) && Math.abs(rd(p.value, dp) - rd(vals[i], dp)) < 1e-9) return form('u7l10-early', hint || 'Nearly! You rounded a value too early. Keep the <b>full</b> calculator value until the last step.');
      return res;
    };
  }
  /* also correct: the answer from an intermediate rounded the way the booklet's solution rounds it */
  function orAlso(chk, vals, dp) {
    return function (resp) {
      var res = chk(resp); if (res.v === 'correct') return res;
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\s*[a-zA-Z]+\.?\s*$/, '').trim(), p = HW.parse.number(s);
      if (p.ok) for (var i = 0; i < vals.length; i++) { var dec = (String(s).split('.')[1] || '').length; if (dec === dp && Math.abs(p.value - rd(vals[i], dp)) < 1e-9) return ok(); }
      return res;
    };
  }
  function yesNo(want, why) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '');
      if (!s) return form('empty', 'Type yes or no.');
      var v = /^(y|yes|yeah|yep|true|itis|itfits|fits)$/.test(s) ? 'yes' : /^(n|no|nope|false|itisnt|isnt|not|doesnt|doesntfit|itdoesnt)$/.test(s) ? 'no' : null;
      if (!v) return form('u7l10-yesno', 'Type <b>yes</b> or <b>no</b>.');
      return v === want ? ok() : wrong('u7l10-yesno-' + v, typeof why === 'function' ? why(v) : why || null);
    };
  }
  function wordChk(want, words, why) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '').replace(/triangle$/, '');
      if (!s) return form('empty', 'Type a word: ' + words.join(', ') + '.');
      var hit = words.filter(function (w) { return s === w || (s.length >= 3 && w.indexOf(s) === 0); })[0];
      if (!hit) return form('u7l10-word', 'Use one of the words: ' + words.join(', ') + '.');
      return hit === want ? ok() : wrong('u7l10-word-' + hit, why(hit));
    };
  }
  /* a trig ratio as a decimal to 4 places (a fraction is fine too); num/den the right sides */
  function ratioChk(num, den, fn, o) {
    o = o || {}; var v = num / den;
    var inner = K.approx(v, 4, { diag: function (x) {
      if (near(x, rd(den / num, 4), 1e-9) || near(rd(x, 4), rd(den / num, 4), 1e-9)) return { code: 'u7l10-ratio-flip', hint: 'Upside down: ' + fn + ' θ = ' + RW[fn] + '.' + (fn !== 'tan' ? ' (A sine or cosine is never more than 1.)' : '') };
      for (var i = 0; o.others && i < o.others.length; i++) if (near(rd(x, 4), rd(o.others[i][0], 4), 1e-9)) return { code: 'u7l10-ratio-wrong', hint: o.others[i][1] };
      return null;
    } });
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\s/g, ''), m = /^\\d?frac\{([\d.]+)\}\{([\d.]+)\}$/.exec(s) || /^([\d.]+)\/([\d.]+)$/.exec(s);
      if (m && +m[2]) { var fv = +m[1] / +m[2]; if (near(fv, v, 1e-9)) return ok(); if (near(fv, den / num, 1e-9)) return wrong('u7l10-ratio-flip', 'Upside down: ' + fn + ' θ = ' + RW[fn] + '.'); return wrong('value', 'Check which sides go in ' + fn + ' θ = ' + RW[fn] + '.'); }
      return inner(resp);
    };
  }
  function tri(o) { return G.rightTriSVG(Object.assign({ names: false, width: 240, px: 160 }, o)); }

  HW.addCodes({ 'u7l10-early': 'Rounded a carried value too early', 'u7l10-yesno': 'Not yes/no', 'u7l10-yesno-yes': 'Said yes', 'u7l10-yesno-no': 'Said no', 'u7l10-word': 'Not one of the words', 'u7l10-word-acute': 'Called it acute',
    'u7l10-word-right': 'Called it right', 'u7l10-word-obtuse': 'Called it obtuse', 'u7l10-word-opp': 'Named it opp', 'u7l10-word-adj': 'Named it adj', 'u7l10-word-hyp': 'Named it hyp', 'u7l10-ratio-flip': 'Ratio upside down', 'u7l10-ratio-wrong': 'Used the wrong ratio',
    'u7l10-sq-double': 'Doubled instead of squaring', 'u7l10-root-half': 'Halved instead of taking the square root', 'u7l10-between': 'Wrong whole numbers around the root', 'u7l10-angle-sum': 'Wrong third angle', 'u7l10-test-sum': 'Added the wrong two sides',
    'u7l10-added': 'Added the two distances instead of subtracting (or the reverse)', 'u7l10-one': 'Gave only one of the two lengths', 'u7l10-tan-diff': 'Subtracted the angles before using tan', 'u7l10-no-post': 'Forgot the post or instrument height', 'u7l10-post-horiz': 'Added a height to a horizontal distance',
    'u7l10-inches': 'Multiplied by 2.54 instead of dividing', 'u7l10-run': 'Wrong run from the slope', 'u7l10-shadow-flip': 'Shadow ratio upside down', 'u7l10-swap': 'Mixed up the two legs', 'u7l10-345': 'Forgot to scale 3-4-5' });

  /* ================= part builders ================= */
  /* x = a side from an angle at A and one side (drawn, booklet layout: right angle lower right) */
  function sidePart(deg, have, len, want, u, o) {
    o = o || {};
    var fn = [have, want].sort().join() === 'hyp,opp' ? 'sin' : [have, want].sort().join() === 'adj,hyp' ? 'cos' : 'tan';
    var top = { sin: 'opp', cos: 'adj', tan: 'opp' }[fn], op = want === top ? 'mul' : 'div', S = { opp: 'a', adj: 'b', hyp: 'c' }, sd = {}, spec = { A: deg };
    spec[S[have]] = len; sd[S[have]] = lab(len, u); sd[S[want]] = 'x';
    var v = op === 'mul' ? len * TR[fn](deg) : len / TR[fn](deg);
    return GP.len((o.lead || 'Find <i>x</i>, to the nearest tenth.') + tri(Object.assign(spec, { sides: sd, angles: { A: deg + '°' }, unknown: S[want] })), v, { unit: u, trig: { fn: fn, deg: deg, side: len, op: op },
      sol: br([(want === 'hyp' ? 'We have ' + have + ', we want hyp' : 'We have ' + have + ', we want ' + want) + ': ' + MN[fn] + '.', t(fnT(fn, deg) + '=' + (op === 'mul' ? fr('x', N(len)) : fr(N(len), 'x'))),
        t('x=' + N(len) + (op === 'mul' ? '\\times' : '\\div') + fnT(fn, deg) + toN(v)) + ' ' + u, want !== 'hyp' && have === 'hyp' ? 'Check: shorter than ' + N(len) + ' ' + u + ' ✓' : '']),
      hints: ['Label opp, adj and hyp from the angle. Leave out the side you don’t know and don’t want.', op === 'mul' ? 'x is on top of the ratio: multiply.' : 'x is on the bottom of the ratio: divide.'], text: o.text || (fn + ' side ' + (op === 'mul' ? '×' : '÷')) });
  }
  /* θ from two sides (drawn) */
  function anglePart(r1, v1, r2, v2, o) {
    o = o || {};
    var k = [r1, r2].sort().join(), fn = k === 'hyp,opp' ? 'sin' : k === 'adj,hyp' ? 'cos' : 'tan';
    var num = fn === 'cos' ? (r1 === 'adj' ? v1 : v2) : (r1 === 'opp' ? v1 : v2), den = fn === 'tan' ? (r1 === 'adj' ? v1 : v2) : (r1 === 'hyp' ? v1 : v2);
    var deg = INV[fn](num / den), S = { opp: 'a', adj: 'b', hyp: 'c' }, spec = {}, sd = {};
    spec[S[r1]] = v1; spec[S[r2]] = v2; sd[S[r1]] = String(v1); sd[S[r2]] = String(v2);
    return GP.trigAngle((o.lead || 'Find θ, to the nearest degree.') + tri(Object.assign(spec, { sides: sd, angles: { A: 'θ' } })), deg, { ratio: { fn: fn, num: num, den: den },
      sol: br([MN[fn] + ': ' + t('\\theta=\\' + fn + '^{-1}\\!\\left(' + fr(N(num), N(den)) + '\\right)' + toN(deg, 0) + '^\\circ'), '(2nd ' + fn + ' ' + N(num) + ' ÷ ' + N(den) + ' ) ENTER)']),
      hints: ['You know two sides and want the angle: inverse key.', 'Label the two sides from θ: opp, adj or hyp?'], text: o.text || ('angle ' + fn + '⁻¹') });
  }
  /* the right-triangle test: a² + b², c² and yes/no */
  function rtTestPart(prompt, s, u) {
    var a = s[0], b = s[1], c = s[2], sum = a * a + b * b, yes = near(sum, c * c);
    return P.fields(prompt + ' Use the two shorter sides for ' + t('a^2+b^2') + ' and the longest side for ' + t('c^2') + '.', [{ label: t('a^2+b^2='), name: 'a²+b²' }, { label: t('c^2='), name: 'c²' }, { label: 'Right triangle? (yes/no)', mode: 'text', name: 'yes/no' }],
      [K.number(sum, function (v) { return v === a * a + c * c || v === b * b + c * c ? { code: 'u7l10-test-sum', hint: 'Add the squares of the two <b>shorter</b> sides (' + a + ' and ' + b + ').' } : v === 2 * a + 2 * b ? { code: 'u7l10-sq-double', hint: 'Squaring means times itself: ' + t(a + '^2=' + a + '\\times' + a) + '.' } : v === a + b ? { code: 'pyth-add-sides', hint: 'Square each side first.' } : null; }),
        K.number(c * c, function (v) { return v === 2 * c ? { code: 'u7l10-sq-double', hint: t(c + '^2=' + c + '\\times' + c) + ', not ' + t('2\\times' + c) + '.' } : null; }),
        yesNo(yes ? 'yes' : 'no', yes ? 'The two numbers are equal, so it <b>is</b> a right triangle.' : 'The two numbers are not equal, so it is <b>not</b> a right triangle.')],
      [String(sum), String(c * c), yes ? 'yes' : 'no'], t(N(sum)) + ', ' + t(N(c * c)) + ': ' + (yes ? 'yes' : 'no'),
      br([t(a + '^2+' + b + '^2=' + N(a * a) + '+' + N(b * b) + '=' + N(sum)), t(c + '^2=' + N(c * c)), yes ? 'Equal, so <b>yes</b>: it is a right triangle (the right angle is across from the ' + c + ' ' + u + ' side).' : 'Not equal, so <b>no</b>: it is not a right triangle.']),
      ['The longest side would be the hypotenuse. Is the sum of the other two squares equal to its square?'], 'right-triangle test');
  }
  function testTriple(r, yes, lo, hi) {
    return find(function () {
      var tr = r.pick(TRIPLES), k = r.pick([1, 2, 3, 5, 10]), s = tr.map(function (x) { return x * k; });
      if (!yes) { var d = r.pick([-2, -1, 1, 2, 3]); s = [s[0], s[1], s[2] + d]; if (s[2] <= s[1]) return null; }
      return s;
    }, function (s) { return s[2] >= lo && s[2] <= hi && !(s[0] === 16 && s[1] === 63) && !(s[0] === 12 && s[1] === 35); });
  }
  /* figure: a rope from a post (or a hand) to a balloon (or kite) */
  function ropeSVG(R, th, post, what) {
    var X = 6 * Math.cos(th * RAD), Y = 6 * Math.sin(th * RAD), hh = 1.1, B = [X, hh + Y];
    return HW.fig({ pts: { F: [0, 0], H: [0, hh], Pp: [X, hh], G0: [X, 0], K: B },
      segs: [['H', 'K', R + ' m'], ['F', 'H', post + ' m', { side: -1, width: 4, color: '#7a5a3a' }], ['H', 'Pp', { dash: 1, color: '#6a7182', width: 1.4 }], ['K', 'G0', { dash: 1, color: '#6a7182', width: 1.4 }]],
      right: [['Pp', 'H', 'K']], angles: [['H', 'Pp', 'K', th + '°']], names: false,
      extra: [{ type: 'ground', y: 0, x0: -0.8, x1: X + 1 }, { type: 'eye', at: B }, { type: 'text', at: [B[0], B[1] + 0.45], text: what }], width: 300, aria: 'a rope at an angle of elevation' });
  }
  /* figure: two angles of depression from a roof, both objects on the same side */
  function roofSVG(h, a1, a2) {
    var d1 = h / Math.tan(a1 * RAD), d2 = h / Math.tan(a2 * RAD), H = Math.max(h, d2 * 0.42), w = d2 * 0.1;
    return HW.fig({ pts: { T: [0, H], O: [0, 0], Nc: [d1, 0], Fc: [d2, 0], Hz: [d2 * 1.05, H], Wb: [-w, H], Wo: [-w, 0] },
      segs: [['T', 'O'], ['O', 'Fc'], ['T', 'Nc'], ['T', 'Fc'], ['T', 'Hz', { dash: 1, color: '#6a7182', width: 1.4 }], ['Wb', 'T'], ['Wb', 'Wo']],
      right: [['O', 'T', 'Fc']], angles: [['T', 'Hz', 'Nc', a1 + '°', { r: 30 }], ['T', 'Hz', 'Fc', a2 + '°', { r: 78, color: '#1f5bd6' }]], fill: [['Wb', 'T', 'O', 'Wo']], names: false,
      extra: [{ type: 'text', at: [-w - d2 * 0.07, H / 2], text: h + ' m' }, { type: 'text', at: [d1, -H * 0.1], text: 'car' }, { type: 'text', at: [d2, -H * 0.1], text: 'bus stop' }, { type: 'eye', at: [d1, 0] }, { type: 'eye', at: [d2, 0] }, { type: 'text', at: [d2 * 0.55, H * 1.08], text: '(not to scale)', size: 11, color: '#6a7182' }], width: 420, aria: 'two angles of depression from a roof' });
  }
  function antennaSVG(d, al, be) {
    var hb = d * Math.tan(al * RAD), ht = Math.max(d * Math.tan(be * RAD), hb * 1.35), bw = d * 0.3;
    return HW.fig({ pts: { Nn: [0, 0], B0: [d, 0], R0: [d, hb], F0: [d, ht], Bk: [d + bw, 0], Rk: [d + bw, hb] },
      segs: [['Nn', 'B0', d + ' m'], ['B0', 'R0'], ['R0', 'F0', { color: '#c93a33', width: 3 }], ['Nn', 'R0', { color: '#6a7182', width: 1.4 }], ['Nn', 'F0', { color: '#6a7182', width: 1.4 }], ['R0', 'Rk'], ['Rk', 'Bk']],
      right: [['B0', 'Nn', 'R0']], angles: [['Nn', 'B0', 'R0', al + '°', { r: 46 }], ['Nn', 'B0', 'F0', be + '°', { r: 92, color: '#1f5bd6' }]], fill: [['B0', 'R0', 'Rk', 'Bk']], names: false,
      extra: [{ type: 'ground', y: 0, x0: -d * 0.08, x1: d + bw * 1.3 }, { type: 'text', at: [d + bw * 0.5, hb * 0.5], text: 'hotel' }, { type: 'text', at: [d + bw * 0.62, (hb + ht) / 2], text: 'antenna', color: '#c93a33' }, { type: 'text', at: [d * 0.35, ht], text: '(not to scale)', size: 11, color: '#6a7182' }], width: 340, aria: 'antenna on a hotel' });
  }

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u7l10', unit: 7, num: '10', title: 'Unit 7 Review', outcome: 'G4',
    blurb: 'The whole unit, set up like the unit test: squares and roots, the Pythagorean theorem and square corners, the trig ratios, angles of elevation and depression, and solving right triangles.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A: Written Response', stem: 'Fill in the blanks.', shared: function (r) {
          return { n: intNot(r, 11, 19, [13, 14]), sq: intNot(r, 11, 19, [13, 14, 9]), d: r.pick([1.5, 2.5, 3.5, 4.5, 1.2, 1.3, 2.4, 3.2, 0.8, 0.6]), rt: find(function () { return r.int(20, 140); }, function (v) { return Math.round(Math.sqrt(v)) ** 2 !== v && v !== 60 && v !== 70 && v !== 50 && safe(Math.sqrt(v)); }),
            ang: find(function () { return { a: r.int(98, 130), b: r.int(18, 45) }; }, function (v) { return v.a + v.b < 170 && !(v.a === 112 && v.b === 35); }) };
        },
        parts: [
          { id: '1abc', sub: 'a–c', level: 'BEG', outcome: 'G2', make: function (r, sh) {
            var n = sh.n, s = sh.sq, d = sh.d;
            return P.fields('Fill in each blank.', [{ label: '(a) ' + t('' + n + '^2='), name: '(a)' }, { label: '(b) ' + t('\\sqrt{' + s * s + '}='), name: '(b)' }, { label: '(c) ' + t('' + N(d) + '^2='), name: '(c)' }],
              [K.number(n * n, function (v) { return v === 2 * n ? { code: 'u7l10-sq-double', hint: t(n + '^2') + ' means ' + t(n + '\\times' + n) + ', not ' + t('2\\times' + n) + '.' } : null; }),
                K.number(s, function (v) { return v === s * s / 2 ? { code: 'u7l10-root-half', hint: 'A square root is not half. Which number times itself makes ' + s * s + '?' } : v === s * s * s * s ? { code: 'u7l10-sq-double', hint: 'You squared it. The square root undoes squaring.' } : null; }),
                K.number(q(d * d), function (v) { return near(v, 2 * d) ? { code: 'u7l10-sq-double', hint: t(N(d) + '^2=' + N(d) + '\\times' + N(d)) + '.' } : null; })],
              [String(n * n), String(s), String(q(d * d))], t(n + '^2=' + n * n + ',\\ \\sqrt{' + s * s + '}=' + s + ',\\ ' + N(d) + '^2=' + N(q(d * d))),
              br([t(n + '^2=' + n + '\\times' + n + '=' + n * n), t('\\sqrt{' + s * s + '}=' + s) + ' because ' + t(s + '\\times' + s + '=' + s * s), t(N(d) + '^2=' + N(d) + '\\times' + N(d) + '=' + N(q(d * d)))]), ['Squaring multiplies a number by itself. The square root undoes it.'], 'squares and roots');
          } },
          { id: '1d', level: 'BEG', outcome: 'G2', make: function (r, sh) {
            var n = sh.rt, lo = Math.floor(Math.sqrt(n)), v = Math.sqrt(n);
            return P.fields(t('\\sqrt{' + n + '}') + ' is between which two whole numbers? To the nearest tenth, what is it?', [{ label: 'between', name: 'smaller' }, { label: 'and', name: 'larger' }, { label: t('\\sqrt{' + n + '}\\approx'), name: '≈' }],
              [K.number(lo, function (x) { return x * x === lo * lo || x === Math.floor(n / 2) ? { code: 'u7l10-between', hint: 'Find the perfect squares on each side of ' + n + ': ' + t(lo + '^2=' + lo * lo) + '.' } : null; }), K.number(lo + 1, function (x) { return x === lo * lo || x === (lo + 1) * (lo + 1) ? { code: 'u7l10-between', hint: 'Give the square <b>roots</b>, not the perfect squares.' } : null; }), G.lenChk(v, {})],
              [String(lo), String(lo + 1), key(v)], 'between ' + lo + ' and ' + (lo + 1) + '; ' + t('\\sqrt{' + n + '}\\approx ' + fx(v)),
              br([t(lo + '^2=' + lo * lo) + ' and ' + t((lo + 1) + '^2=' + (lo + 1) * (lo + 1)) + ', so ' + t('\\sqrt{' + n + '}') + ' is between ' + lo + ' and ' + (lo + 1) + '.', '2nd x² ' + n + ' ) ENTER: ' + t('\\sqrt{' + n + '}' + toN(v))]), ['Which perfect squares are just below and just above ' + n + '?'], 'root between');
          } },
          { id: '1e', level: 'BEG', outcome: 'G4', make: function (r, sh) {
            var a = sh.ang.a, b = sh.ang.b, c = 180 - a - b;
            return P.fields('A triangle has angles of ' + D(a) + ' and ' + D(b) + '. Find the third angle. What kind of triangle is it (acute, right or obtuse)?', [{ label: 'Third angle:', after: '°', name: 'angle' }, { label: 'Kind:', mode: 'text', name: 'kind', placeholder: 'acute, right or obtuse' }],
              [G.angleChk(c, { supplementTrap: false, alts: [{ v: 90 - b, code: 'u7l10-angle-sum', hint: 'This triangle has no right angle. All three angles add to 180°.' }, { v: 360 - a - b, code: 'u7l10-angle-sum', hint: 'The angles of a triangle add to <b>180°</b>, not 360°.' }, { v: 180 - a, code: 'u7l10-angle-sum', hint: 'Subtract <b>both</b> angles from 180°.' }] }),
                wordChk('obtuse', ['acute', 'right', 'obtuse'], function (h) { return h === 'right' ? 'A right triangle has a 90° angle. Does this one?' : 'It has an angle of ' + a + '°, which is more than 90°.'; })],
              [String(c), 'obtuse'], D(c) + ', obtuse', br([t('180^\\circ-' + a + '^\\circ-' + b + '^\\circ=' + c + '^\\circ'), 'It has an angle over 90° (' + D(a) + '), so it is <b>obtuse</b>.']), ['The angles of any triangle add to 180°.'], 'third angle');
          } }] },
      { num: '2', stem: 'Find the hypotenuse of each right triangle, to the nearest tenth.', shared: function (r) {
          return { a: find(function () { var a = r.int(5, 12), b = r.int(a + 2, 18); return [a, b]; }, function (v) { return safe(Math.hypot(v[0], v[1])) && !(v[0] === 9 && v[1] === 14) && !(v[0] === 5 && v[1] === 12); }),
            b: find(function () { return [pickR(r, 1.5, 4, 0.1), pickR(r, 3, 6.5, 0.1)]; }, function (v) { return v[0] < v[1] && safe(Math.hypot(v[0], v[1])); }) };
        },
        parts: ['a', 'b'].map(function (k, i) {
          return { id: '2' + k, level: 'BEG', outcome: 'G2', make: function (r, sh) {
            var s = sh[k], u = i ? 'm' : 'cm', c = Math.hypot(s[0], s[1]), sum = q(s[0] * s[0] + s[1] * s[1]);
            return GP.len('Find <i>x</i>.' + tri({ a: s[0], b: s[1], sides: { a: lab(s[0], u), b: lab(s[1], u), c: 'x' }, unknown: 'c' }), c, { unit: u, pyth: { legs: s },
              sol: br([t('x^2=' + N(s[0]) + '^2+' + N(s[1]) + '^2=' + N(q(s[0] * s[0])) + '+' + N(q(s[1] * s[1])) + '=' + N(sum)), t('x=\\sqrt{' + N(sum) + '}' + toN(c)) + ' ' + u]), hints: ['x is across from the right angle: add the squares, then take the square root.'], text: 'hypotenuse' });
          } };
        }) },
      { num: '3', stem: 'Find the missing leg of each right triangle, to the nearest tenth.', shared: function (r) {
          return { a: find(function () { var a = r.int(6, 12); return [a, r.int(a + 4, a + 12)]; }, function (v) { return safe(Math.sqrt(v[1] * v[1] - v[0] * v[0])) && !(v[0] === 9 && v[1] === 15); }),
            b: find(function () { var a = pickR(r, 1.5, 4, 0.5); return [a, pickR(r, a + 1.5, a + 5, 0.5)]; }, function (v) { return safe(Math.sqrt(v[1] * v[1] - v[0] * v[0])); }) };
        },
        parts: ['a', 'b'].map(function (k, i) {
          return { id: '3' + k, level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var s = sh[k], u = i ? 'ft' : 'cm', v = Math.sqrt(s[1] * s[1] - s[0] * s[0]), dif = q(s[1] * s[1] - s[0] * s[0]);
            return GP.len('Find <i>x</i>.' + tri({ a: s[0], c: s[1], sides: { a: lab(s[0], u), c: lab(s[1], u), b: 'x' }, unknown: 'b' }), v, { unit: u, pyth: { hyp: s[1], leg: s[0] },
              sol: br([lab(s[1], u) + ' is the hypotenuse, so subtract.', t('x^2=' + N(s[1]) + '^2-' + N(s[0]) + '^2=' + N(q(s[1] * s[1])) + '-' + N(q(s[0] * s[0])) + '=' + N(dif)), t('x=\\sqrt{' + N(dif) + '}' + toN(v)) + ' ' + u]), hints: ['Which side is across from the right angle? That one is the hypotenuse.', 'To find a leg, subtract the squares.'], text: 'missing leg' });
          } };
        }) },
      { num: '4', stem: 'Is each triangle a right triangle? Show your work.', shared: function (r) {
          var ya = r.chance(0.5), yb = r.chance(0.5); return { a: testTriple(r, ya, 20, 120), b: testTriple(r, yb, 8, 40) };
        },
        parts: [
          { id: '4a', level: 'EMG', outcome: 'G2', make: function (r, sh) { var s = sh.a; return rtTestPart('Sides ' + s[0] + ' m, ' + s[1] + ' m and ' + s[2] + ' m.', s, 'm'); } },
          { id: '4b', level: 'EMG', outcome: 'G2', make: function (r, sh) { var s = sh.b; return rtTestPart('Sides ' + s[0] + ' in, ' + s[1] + ' in and ' + s[2] + ' in.', s, 'in'); } }] },
      { num: '5', stem: function (sh) { return 'Phone screens are sold by the length of their diagonal, in inches. A phone screen is ' + L(sh.w, 'cm') + ' wide and ' + L(sh.h, 'cm') + ' tall.'; },
        shared: function (r) { return find(function () { return { w: pickR(r, 6.2, 7.8, 0.1), h: pickR(r, 13.5, 16.5, 0.1) }; }, function (v) { var d = Math.hypot(v.w, v.h); return safe(d, 2) && safe(d / 2.54) && rd(rd(d, 2) / 2.54) === rd(d / 2.54) && !(v.w === 6.9 && v.h === 15); }); },
        parts: [
          { id: '5a', level: 'PRG', outcome: 'G2', make: function (r, sh) {
            var d = Math.hypot(sh.w, sh.h), s2 = q(sh.w * sh.w + sh.h * sh.h);
            return GP.len('Find the diagonal of the screen in centimetres, to the nearest <b>hundredth</b>.', d, { dp: 2, unit: 'cm', pyth: { legs: [sh.w, sh.h] }, sol: br(['The width, the height and the diagonal make a right triangle; the diagonal is the hypotenuse.', t('d=\\sqrt{' + N(sh.w) + '^2+' + N(sh.h) + '^2}=\\sqrt{' + N(q(sh.w * sh.w)) + '+' + N(q(sh.h * sh.h)) + '}=\\sqrt{' + N(s2) + '}' + toN(d, 2)) + ' cm']), hints: ['The diagonal is the hypotenuse of a right triangle with the width and the height as legs.'], text: 'screen diagonal (cm)' });
          } },
          { id: '5b', level: 'PRG', outcome: 'G2', make: function (r, sh) {
            var d = Math.hypot(sh.w, sh.h), inch = d / 2.54;
            var p = GP.len('Change the diagonal to inches (1 in = 2.54 cm), to the nearest tenth. What size would the ad say?', inch, { unit: 'in', alts: [{ v: d * 2.54, code: 'u7l10-inches', hint: 'An inch is <b>longer</b> than a centimetre, so there are fewer inches: divide by 2.54.' }, { v: d, code: 'u7l10-inches', hint: 'That is still in centimetres. Divide by 2.54.' }],
              sol: br([t(fx(d, 2) + '\\div 2.54' + toN(inch)) + ' in', 'The ad would say a ' + fx(inch) + '-inch screen.']), hints: ['1 in = 2.54 cm. Are there more centimetres or more inches?'], text: 'screen in inches' });
            p.check = orAlso(p.check, [rd(d, 2) / 2.54], 1); return p;
          } }] },
      { num: '6', stem: function (sh) { return sh.who + ' is laying out a backyard rink ' + sh.w + ' ft wide and ' + sh.l + ' ft long with string lines.'; },
        shared: function (r) {
          var k = r.pick([4, 5, 6, 7, 8, 9, 11, 12]), more = r.chance(0.5), inch = r.int(3, 10);
          return { k: k, w: 3 * k, l: 4 * k, d: 5 * k, more: more, inch: inch, meas: more ? (5 * k) + ' ft ' + inch + ' in' : (5 * k - 1) + ' ft ' + (12 - inch) + ' in', who: r.pick(NAMES), m: r.pick([2, 3, 4]) };
        },
        parts: [
          { id: '6a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            return GP.len('What should each diagonal measure if the corners are square?', sh.d, { dp: 0, unit: 'ft', pyth: { legs: [sh.w, sh.l] }, sol: br([t('\\sqrt{' + sh.w + '^2+' + sh.l + '^2}=\\sqrt{' + sh.w * sh.w + '+' + sh.l * sh.l + '}=\\sqrt{' + sh.d * sh.d + '}=' + sh.d) + ' ft', '(A 3-4-5 triangle, times ' + sh.k + '.)']), hints: ['The diagonal is the hypotenuse of a right triangle with the width and the length as legs.'], text: 'rink diagonal' });
          } },
          { id: '6b', level: 'PRG', outcome: 'G2', make: function (r, sh) {
            var right = sh.more ? 'The corner is <b>not</b> square. The diagonal is longer than ' + sh.d + ' ft, so the angle is a little <b>more</b> than 90°.' : 'The corner is <b>not</b> square. The diagonal is shorter than ' + sh.d + ' ft, so the angle is a little <b>less</b> than 90°.';
            var other = sh.more ? 'The corner is not square. The angle is a little <b>less</b> than 90°.' : 'The corner is not square. The angle is a little <b>more</b> than 90°.';
            return P.mc(r, sh.who + ' measures one diagonal: ' + sh.meas + '. Is that corner square? Is the angle too big or too small?', [
              { html: right, right: true },
              { html: other, why: 'Picture the corner opening wider: the diagonal gets <b>longer</b>. Closing it makes the diagonal shorter.', code: 'r6-dir' },
              { html: 'Yes, it is square: the diagonal is within a foot of ' + sh.d + ' ft.', why: 'For a square corner the diagonal must be <b>exactly</b> ' + sh.d + ' ft.', code: 'r6-close' },
              { html: 'You can’t tell without a protractor.', why: 'The diagonal tells you: compare it with ' + sh.d + ' ft.', code: 'r6-cant' }],
              'A square corner needs a diagonal of exactly ' + sh.d + ' ft. ' + sh.meas + ' is ' + (sh.more ? 'longer' : 'shorter') + ', so the sides are spread ' + (sh.more ? 'wider' : 'closer together') + ' than a right angle: the angle is a little ' + (sh.more ? 'more' : 'less') + ' than 90°.', ['A wider corner stretches the diagonal; a narrower one shrinks it.'], 'square corner?');
          } },
          { id: '6c', level: 'BEG', outcome: 'G2', make: function (r, sh) {
            var m = sh.m;
            return P.number('Using the 3-4-5 method, what diagonal should ' + sh.who + ' get if ' + he(sh.who) + ' measures ' + 3 * m + ' ft along one side and ' + 4 * m + ' ft along the other? (ft)', 5 * m, function (v) { return v === 7 * m ? { code: 'pyth-add-sides', hint: 'Not the sides added: 3-4-5 times ' + m + '.' } : v === 5 ? { code: 'u7l10-345', hint: 'The sides are 3 and 4 <b>times ' + m + '</b>, so the diagonal is 5 times ' + m + '.' } : null; },
              t(3 * m + '\\text{-}' + 4 * m + '\\text{-}' + 5 * m) + ' is 3-4-5 times ' + m + ': the diagonal should be ' + 5 * m + ' ft. (Check: ' + t(3 * m + '^2+' + 4 * m + '^2=' + 25 * m * m + '=' + 5 * m + '^2') + ')', ['3-4-5 times ' + m + '.'], '3-4-5 method');
          } }] },
      { num: '7', stem: function (sh) { return 'For angle θ, the sides are ' + sh.s[0] + ', ' + sh.s[1] + ' and ' + sh.s[2] + '.' + tri({ a: sh.s[0], b: sh.s[1], sides: { a: String(sh.s[0]), b: String(sh.s[1]), c: String(sh.s[2]) }, angles: { A: 'θ' } }); },
        shared: function (r) { var tr = find(function () { return r.pick(TRIPLES.slice(2, 11)); }, function (v) { return v[0] !== 12; }); return { s: tr }; },
        parts: [
          { id: '7a', level: 'BEG', outcome: 'G4', make: function (r, sh) {
            var s = sh.s, W = ['opp', 'adj', 'hyp'];
            var nm = function (want) { return K.number(s[W.indexOf(want)], function (v) { var i = s.indexOf(v); return i >= 0 ? { code: 'u7l10-word-' + W[i], hint: v + ' is the <b>' + W[i] + '</b>: ' + ({ opp: 'across from θ', adj: 'next to θ (not the hyp)', hyp: 'across from the right angle' })[W[i]] + '.' } : null; }); };
            return P.fields('Label the sides for θ: type the length of each.', [{ label: 'opp =', name: 'opp' }, { label: 'adj =', name: 'adj' }, { label: 'hyp =', name: 'hyp' }], [nm('opp'), nm('adj'), nm('hyp')], s.map(String), 'opp = ' + s[0] + ', adj = ' + s[1] + ', hyp = ' + s[2],
              br(['hyp = ' + s[2] + ' (across from the right angle)', 'opp = ' + s[0] + ' (across from θ)', 'adj = ' + s[1] + ' (next to θ)']), ['Start with the hyp: it is across from the right angle.'], 'label sides');
          } },
          { id: '7b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var o = sh.s[0], a = sh.s[1], h = sh.s[2];
            return P.fields('Write each ratio as a decimal to 4 decimal places. (A fraction is fine too.)', [{ label: t('\\sin\\theta='), name: 'sin θ' }, { label: t('\\cos\\theta='), name: 'cos θ' }, { label: t('\\tan\\theta='), name: 'tan θ' }],
              [ratioChk(o, h, 'sin', { others: [[a / h, 'That is cos θ (adj ÷ hyp). sin θ = <b>opp</b> ÷ hyp.'], [o / a, 'That is tan θ. sin θ = opp ÷ <b>hyp</b>.']] }), ratioChk(a, h, 'cos', { others: [[o / h, 'That is sin θ. cos θ = <b>adj</b> ÷ hyp.'], [a / o, 'cos θ = adj ÷ <b>hyp</b>.']] }), ratioChk(o, a, 'tan', { others: [[o / h, 'tan θ = opp ÷ <b>adj</b>.'], [a / h, 'tan θ = <b>opp</b> ÷ adj.']] })],
              [key(o / h, 4), key(a / h, 4), key(o / a, 4)], t('\\sin\\theta=' + fr(o, h) + '\\approx ' + fx(o / h, 4) + ',\\ \\cos\\theta=' + fr(a, h) + '\\approx ' + fx(a / h, 4) + ',\\ \\tan\\theta=' + fr(o, a) + '\\approx ' + fx(o / a, 4)),
              br([t('\\sin\\theta=' + fr('\\text{opp}', '\\text{hyp}') + '=' + fr(o, h) + '\\approx ' + fx(o / h, 4)), t('\\cos\\theta=' + fr('\\text{adj}', '\\text{hyp}') + '=' + fr(a, h) + '\\approx ' + fx(a / h, 4)), t('\\tan\\theta=' + fr('\\text{opp}', '\\text{adj}') + '=' + fr(o, a) + '\\approx ' + fx(o / a, 4))]), ['SOH CAH TOA.'], 'sin cos tan');
          } }] },
      { num: '8', stem: function (sh) {
          var rows = sh.rows.map(function (rw) { return '<tr><th style="text-align:left">' + rw.n + '</th><td>' + N(rw.o) + '</td><td>' + N(rw.a) + '</td></tr>'; }).join('');
          return 'Three students each drew a right triangle with a ' + D(sh.th) + ' angle, then measured the sides.<table class="vtab"><tr><th>Student</th><th>opp (cm)</th><th>adj (cm)</th></tr>' + rows + '</table>';
        },
        shared: function (r) {
          var R = find(function () { return r.pick([[6, 5], [5, 4], [3, 4], [7, 10], [4, 5], [9, 10], [11, 10], [13, 10], [3, 2], [7, 5]]); }, function (v) { var th = INV.tan(v[0] / v[1]); return Math.abs(Math.tan(Math.round(th) * RAD) - v[0] / v[1]) < 0.02 && Math.round(th) !== 50 && safe(Math.round(th) > 0 ? 15 * Math.tan(Math.round(th) * RAD) : 0); });
          var th = Math.round(INV.tan(R[0] / R[1])), ms = r.sample([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.4], 3).sort(function (x, y) { return x - y; }), who = r.sample(NAMES, 3);
          return { R: R, th: th, rows: ms.map(function (m, i) { return { n: who[i], o: q(R[0] * m), a: q(R[1] * m) }; }), adj: r.pick([12, 15, 18, 20, 24]) };
        },
        parts: [
          { id: '8a', level: 'BEG', outcome: 'G4', make: function (r, sh) {
            var v = sh.R[0] / sh.R[1];
            return P.fields('Find ' + t(fr('\\text{opp}', '\\text{adj}')) + ' for each student, to 2 decimal places.', sh.rows.map(function (rw) { return { label: rw.n + ':', name: rw.n }; }),
              sh.rows.map(function (rw) { return K.approx(v, 2, { diag: function (x) { return near(rd(x, 2), rd(rw.a / rw.o, 2), 1e-9) ? { code: 'u7l10-ratio-flip', hint: 'Upside down: opp ÷ adj, so ' + N(rw.o) + ' ÷ ' + N(rw.a) + '.' } : null; } }); }),
              sh.rows.map(function () { return key(v, 2); }), 'all ' + fx(v, 2), br(sh.rows.map(function (rw) { return rw.n + ': ' + t(N(rw.o) + '\\div ' + N(rw.a) + '=' + fx(v, 2)); })), ['Divide opp by adj for each row.'], 'ratio table');
          } },
          { id: '8b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.R[0] / sh.R[1], tn = TR.tan(sh.th);
            return P.mc(r, 'What do you notice? Find ' + t('\\tan ' + dg(sh.th)) + ' on your calculator and compare.', [
              { html: 'Every ratio is ' + fx(v, 2) + ': the triangles are similar, so opp ÷ adj stays the same. ' + t('\\tan ' + dg(sh.th) + '\\approx ' + fx(tn, 4)) + ', very close.', right: true },
              { html: 'The ratios get bigger as the triangles get bigger.', why: 'Work them out: they are all the same.', code: 'n8-bigger' },
              { html: 'The ratios are all the same, but they have nothing to do with ' + t('\\tan ' + dg(sh.th)) + '.', why: 'tan θ <b>is</b> opp ÷ adj. Compare ' + fx(v, 2) + ' with ' + t('\\tan ' + dg(sh.th)) + '.', code: 'n8-nothing' },
              { html: 'The ratio equals the angle divided by 100.', why: 'The ratio is opp ÷ adj, which is tan θ, not θ ÷ 100.', code: 'n8-angle' }],
              'Each ratio is ' + fx(v, 2) + '. The triangles have the same angles, so they are similar and opp ÷ adj is the same in all of them. That ratio is ' + t('\\tan ' + dg(sh.th) + '\\approx ' + fx(tn, 4)) + ' (a ruler measurement is never perfect).', ['Similar triangles have the same ratios.'], 'what do you notice');
          } },
          { id: '8c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.adj * TR.tan(sh.th);
            return GP.len('A fourth right triangle has a ' + D(sh.th) + ' angle and an adjacent side of ' + L(sh.adj, 'cm') + '. Use ' + t('\\tan ' + dg(sh.th)) + ' to find the opposite side, to the nearest tenth.', v, { unit: 'cm', trig: { fn: 'tan', deg: sh.th, side: sh.adj, op: 'mul' }, sol: t('\\text{opp}=' + sh.adj + '\\times\\tan ' + dg(sh.th) + toN(v)) + ' cm', hints: ['tan θ = opp ÷ adj, so opp = adj × tan θ.'], text: 'opp from tan' });
          } }] },
      { num: '9', stem: 'Find each side marked <i>x</i>, to the nearest tenth.', shared: function (r) {
          return { a: find(function () { return { d: intNot(r, 40, 62, [52, 38, 27]), s: pickR(r, 4, 12, 0.5) }; }, function (v) { return safe(v.s * TR.tan(v.d)); }),
            b: find(function () { return { d: intNot(r, 24, 44, [34, 27, 35]), s: pickR(r, 3, 9, 0.1) }; }, function (v) { return safe(v.s / TR.sin(v.d)); }),
            c: find(function () { return { d: intNot(r, 58, 76, [63, 71]), s: r.int(12, 30) }; }, function (v) { return safe(v.s * TR.cos(v.d)); }),
            e: find(function () { return { d: intNot(r, 14, 24, [18]), s: pickR(r, 2, 5, 0.1) }; }, function (v) { return safe(v.s / TR.tan(v.d)); }) };
        },
        parts: [
          { id: '9a', level: 'BEG', outcome: 'G4', make: function (r, sh) { return sidePart(sh.a.d, 'adj', sh.a.s, 'opp', 'cm'); } },
          { id: '9b', level: 'EMG', outcome: 'A1', make: function (r, sh) { return sidePart(sh.b.d, 'opp', sh.b.s, 'hyp', 'm'); } },
          { id: '9c', level: 'BEG', outcome: 'G4', make: function (r, sh) { return sidePart(sh.c.d, 'hyp', sh.c.s, 'adj', 'ft'); } },
          { id: '9d', level: 'EMG', outcome: 'A1', make: function (r, sh) { return sidePart(sh.e.d, 'opp', sh.e.s, 'adj', 'm'); } }] },
      { num: '10', stem: 'Find each angle θ, to the nearest degree.', shared: function (r) {
          return { a: find(function () { var o = r.int(3, 9); return [o, r.int(o + 2, 14)]; }, function (v) { return safe(INV.tan(v[0] / v[1]), 0) && !(v[0] === 5 && v[1] === 9) && !(v[0] === 4 && v[1] === 7); }),
            b: find(function () { var o = r.int(6, 14); return [o, r.int(o + 3, o + 9)]; }, function (v) { return safe(INV.sin(v[0] / v[1]), 0) && !(v[0] === 11 && v[1] === 16); }),
            c: find(function () { var h = pickR(r, 5, 9, 0.5); return [pickR(r, h * 0.4, h - 1, 0.1), h]; }, function (v) { return safe(INV.cos(v[0] / v[1]), 0) && !(v[0] === 4.8 && v[1] === 7.5); }) };
        },
        parts: [
          { id: '10a', level: 'BEG', outcome: 'G4', make: function (r, sh) { return anglePart('opp', sh.a[0], 'adj', sh.a[1]); } },
          { id: '10b', level: 'EMG', outcome: 'G4', make: function (r, sh) { return anglePart('opp', sh.b[0], 'hyp', sh.b[1]); } },
          { id: '10c', level: 'EMG', outcome: 'G4', make: function (r, sh) { return anglePart('adj', sh.c[0], 'hyp', sh.c[1]); } },
          { id: '10d', level: 'BEG', outcome: 'G4', make: function (r, sh) {
            var th = INV.tan(sh.a[0] / sh.a[1]), o = 90 - th;
            return GP.trigAngle('Find the other acute angle in triangle (a), to the nearest degree.', o, { ratio: { fn: 'tan', num: sh.a[1], den: sh.a[0] }, complementTrap: true, sol: t('90^\\circ-' + fx(th, 0) + '^\\circ=' + fx(o, 0) + '^\\circ') + ' (the two acute angles add to 90°)', hints: ['The two acute angles add to 90°.'], text: 'other acute angle' });
          } }] },
      { num: '11', stem: function (sh) { return 'A car dealership flies a big advertising balloon on a ' + L(sh.R, 'm') + ' rope. The rope is tied to the top of a post ' + L(sh.p, 'm') + ' tall and makes an angle of elevation of ' + D(sh.th) + '. Assume the rope is straight.' + ropeSVG(sh.R, sh.th, sh.p, 'balloon'); },
        shared: function (r) { return find(function () { return { R: 5 * r.int(9, 18), p: pickR(r, 0.9, 1.5, 0.1), th: intNot(r, 42, 66, [56]) }; }, function (v) { var y = v.R * TR.sin(v.th); return safe(y + v.p) && safe(v.R * TR.cos(v.th)) && safe(y); }); },
        parts: [
          { id: '11a', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var y = sh.R * TR.sin(sh.th), v = y + sh.p;
            return GP.len('How high is the balloon above the ground, to the nearest tenth of a metre?', v, { unit: 'm', trig: { fn: 'sin', deg: sh.th, side: sh.R, op: 'mul' }, radTrap: { fn: 'sin', deg: sh.th, side: sh.R, op: 'mul' }, alts: [{ v: y, code: 'u7l10-no-post', hint: 'That is the height above the <b>post</b>. Add the ' + sh.p + ' m post.' }],
              sol: br(['The rope is hyp; the height above the post is opp → SOH.', t('\\text{opp}=' + sh.R + '\\sin ' + dg(sh.th) + '=' + rawN(y)) + ' m', 'Add the post: ' + t(rawN(y) + '+' + N(sh.p) + toN(v)) + ' m']), hints: ['The right triangle starts at the top of the post.', 'Then add the post’s height.'], text: 'balloon height' });
          } },
          { id: '11b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var v = sh.R * TR.cos(sh.th);
            return GP.len('How far is the post from the point on the ground right under the balloon, to the nearest tenth?', v, { unit: 'm', trig: { fn: 'cos', deg: sh.th, side: sh.R, op: 'mul' }, alts: [{ v: v + sh.p, code: 'u7l10-post-horiz', hint: 'The post is vertical: it doesn’t change a horizontal distance.' }], sol: br(['The ground distance is adj → CAH.', t(sh.R + '\\cos ' + dg(sh.th) + toN(v)) + ' m']), hints: ['The distance along the ground is next to the angle: adj.'], text: 'balloon distance' });
          } }] },
      { num: '12', stem: function (sh) { return 'In ' + t('\\triangle DEF') + ', ' + t('\\angle F=90^\\circ') + ', ' + t('DF=' + fx(sh.df)) + ' m and ' + t('EF=' + fx(sh.ef)) + ' m. Sketch and label the triangle, then solve it.'; },
        shared: function (r) { return find(function () { var df = pickR(r, 5, 12, 0.5); return { df: df, ef: pickR(r, df + 2, df + 8, 0.5) }; }, function (v) { return safe(Math.hypot(v.df, v.ef)) && safe(INV.tan(v.ef / v.df), 0) && !(v.df === 9 && v.ef === 13.5); }); },
        parts: [
          { id: '12a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var c = Math.hypot(sh.df, sh.ef), s2 = q(sh.df * sh.df + sh.ef * sh.ef);
            return GP.len('Find ' + t('DE') + ', to the nearest tenth.', c, { unit: 'm', pyth: { legs: [sh.df, sh.ef] }, sol: br([tri({ a: sh.ef, b: sh.df, names: ['D', 'E', 'F'], sides: { a: fx(sh.ef) + ' m', b: fx(sh.df) + ' m', c: 'DE' }, width: 200 }), 'DE is across from the right angle at F: the hypotenuse.', t('DE=\\sqrt{' + N(sh.df) + '^2+' + N(sh.ef) + '^2}=\\sqrt{' + N(s2) + '}' + toN(c)) + ' m']), hints: ['Sketch it with the right angle at F. DE is across from F.'], text: 'DEF: DE' });
          } },
          { id: '12b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var Dg = INV.tan(sh.ef / sh.df), E = 90 - Dg;
            return P.fields('Find ' + t('\\angle D') + ' and ' + t('\\angle E') + ', to the nearest degree.', [{ label: t('\\angle D='), after: '°', name: '∠D' }, { label: t('\\angle E='), after: '°', name: '∠E' }],
              [G.angleRatioChk(Dg, { ratio: { fn: 'tan', num: sh.ef, den: sh.df } }), G.angleRatioChk(E, { ratio: { fn: 'tan', num: sh.df, den: sh.ef } })], [key(Dg, 0), key(E, 0)], t('\\angle D\\approx ' + fx(Dg, 0) + '^\\circ,\\ \\angle E\\approx ' + fx(E, 0) + '^\\circ'),
              br(['For ∠D: opp = EF = ' + fx(sh.ef) + ' m, adj = DF = ' + fx(sh.df) + ' m → TOA.', t('\\angle D=\\tan^{-1}\\!\\left(' + fr(N(sh.ef), N(sh.df)) + '\\right)' + toN(Dg, 0) + '^\\circ'), t('\\angle E=90^\\circ-' + rawN(Dg) + '^\\circ' + toN(E, 0) + '^\\circ'), 'Check: the bigger angle, ∠D, faces the longer leg, EF ✓']),
              ['From ∠D, EF is across (opp) and DF is next to it (adj).', 'The two acute angles add to 90°.'], 'DEF: angles');
          } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'MAS', outcome: 'A1', make: function (r) {
          var s = find(function () { var a1 = r.int(30, 50); return { h: r.int(18, 45), a1: a1, a2: r.int(12, a1 - 10), who: r.pick(['Ines', 'Kai', 'Rosa', 'Theo', 'Aisha']) }; }, function (v) { var d = v.h / TR.tan(v.a2) - v.h / TR.tan(v.a1); return safe(d) && rd(rd(v.h / TR.tan(v.a2), 2) - rd(v.h / TR.tan(v.a1), 2)) === rd(d) && !(v.h === 28 && v.a1 === 35); });
          var d1 = s.h / TR.tan(s.a1), d2 = s.h / TR.tan(s.a2), v = d2 - d1;
          return GP.len('From the roof of a ' + s.h + ' m apartment building, ' + s.who + ' looks down at a parked car at an angle of depression of ' + D(s.a1) + '. A bus stop is farther away on the same straight street, at an angle of depression of ' + D(s.a2) + '. How far is the car from the bus stop, to the nearest tenth of a metre?' + roofSVG(s.h, s.a1, s.a2), v, { unit: 'm', radTrap: false,
            alts: [{ v: d1 + d2, code: 'u7l10-added', hint: 'The car and the bus stop are on the <b>same</b> side of the building: subtract the two distances.' }, { v: d2, code: 'u7l10-one', hint: 'That is the distance to the bus stop. Subtract the distance to the car.' }, { v: d1, code: 'u7l10-one', hint: 'That is the distance to the car. Find the bus stop’s distance too, then subtract.' },
              { v: s.h * TR.tan(s.a1) - s.h * TR.tan(s.a2), code: 'trig-mul-div', hint: 'The height is opp and the distance is adj: ' + t('\\tan\\theta=' + fr(s.h, 'd')) + '. d is on the bottom, so divide.' }, { v: s.h / TR.tan(s.a1 - s.a2), code: 'u7l10-tan-diff', hint: 'Find each distance in its own triangle first, then subtract the distances (not the angles).' },
              { v: Math.abs(s.h / Math.tan(s.a2) - s.h / Math.tan(s.a1)), code: 'trig-rad', hint: G.RAD_HINT }],
            sol: br(['The angles of elevation from the street are also ' + D(s.a1) + ' and ' + D(s.a2) + ' (alternate interior angles). In each triangle, ' + s.h + ' m is opp and the street distance is adj.', 'To the car: ' + t(s.h + '\\div\\tan ' + dg(s.a1) + '=' + rawN(d1)) + ' m', 'To the bus stop: ' + t(s.h + '\\div\\tan ' + dg(s.a2) + '=' + rawN(d2)) + ' m', 'Between them: ' + t(rawN(d2) + '-' + rawN(d1) + toN(v)) + ' m']),
            hints: ['The angle of depression from the roof equals the angle of elevation from the street.', 'Find both street distances (÷ tan), then subtract.'], text: 'car and bus stop' });
        } }] },
      { num: '14', stem: function (sh) { return 'A right triangle has a hypotenuse of ' + L(sh.c, 'm') + ' and a ' + D(sh.A) + ' angle. ' + sh.who + ' wants the side opposite the ' + D(sh.A) + ' angle. ' + cap(his(sh.who)) + ' work: ' + t(fnT('sin', sh.A) + '=' + fr('x', sh.c) + '\\qquad x=' + sh.c + '\\div\\sin ' + dg(sh.A) + '\\approx ' + fx(sh.c / TR.sin(sh.A)) + '\\text{ m}'); },
        shared: function (r) { return find(function () { return { c: r.int(8, 20), A: intNot(r, 28, 58, [40, 45]), who: r.pick(['Tariq', 'Noor', 'Liam', 'Sofia', 'Devon']) }; }, function (v) { return safe(v.c * TR.sin(v.A)) && safe(v.c / TR.sin(v.A)); }); },
        parts: [
          { id: '14a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var w = fx(sh.c / TR.sin(sh.A));
            return P.mc(r, 'How can you tell the answer is not reasonable, without redoing it?', [
              { html: 'A leg can’t be longer than the hypotenuse, and ' + w + ' m is longer than ' + sh.c + ' m.', right: true },
              { html: 'The opposite side should be exactly half the hypotenuse.', why: 'That is only true at 30°.', code: 'r14-half' },
              { html: 'He should have used cosine.', why: 'Opp and hyp go with sine: the ratio is right. Look at the size of the answer.', code: 'r14-cos' },
              { html: 'The answer should be a whole number.', why: 'Trig answers are almost never whole numbers.', code: 'r14-whole' }].map(function (o) { o.html = o.html.replace('He should', cap(he(sh.who)) + ' should'); return o; }),
              'The opposite side is a leg, and a leg is always shorter than the hypotenuse. ' + w + ' m is longer than ' + sh.c + ' m.', ['Which side is always the longest?'], 'spot unreasonable');
          } },
          { id: '14b', level: 'PRG', outcome: 'A1', make: function (r, sh) {
            var v = sh.c * TR.sin(sh.A);
            return GP.len('Find and fix the error: what is the opposite side, to the nearest tenth?', v, { unit: 'm', trig: { fn: 'sin', deg: sh.A, side: sh.c, op: 'mul' }, sol: br('x is on <b>top</b> of the ratio, so multiply, not divide:'.split('|').concat([t('x=' + sh.c + '\\times\\sin ' + dg(sh.A) + toN(v)) + ' m'])), hints: ['In ' + t(fnT('sin', sh.A) + '=' + fr('x', sh.c)) + ', is x on the top or the bottom?'], text: 'fix ÷ to ×' });
          } }] },
      /* ---------------- Part B ---------------- */
      { num: '15', section: 'Part B: Multiple Choice', stem: '', parts: [
        { id: '15', level: 'BEG', outcome: 'G2', make: function (r) {
          var n = find(function () { return r.int(20, 150); }, function (v) { var s = Math.sqrt(v); return Math.abs(s - Math.round(s)) > 0.15 && v !== 110; }), lo = Math.floor(Math.sqrt(n));
          return P.mc(r, t('\\sqrt{' + n + '}') + ' is between', [{ html: (lo - 1) + ' and ' + lo, why: t(lo + '^2=' + lo * lo) + ' is less than ' + n + ', so the root is more than ' + lo + '.', code: 'b15-low' }, { html: lo + ' and ' + (lo + 1), right: true },
            { html: Math.floor(n / 2) + ' and ' + (Math.floor(n / 2) + 1), why: 'A square root is not half the number.', code: 'b15-half' }, { html: lo * lo + ' and ' + (lo + 1) * (lo + 1), why: 'Those are the perfect squares. Their roots are the answer.', code: 'b15-squares' }],
            t(lo + '^2=' + lo * lo) + ' and ' + t((lo + 1) + '^2=' + (lo + 1) * (lo + 1)) + ', and ' + n + ' is between them, so ' + t('\\sqrt{' + n + '}') + ' is between ' + lo + ' and ' + (lo + 1) + '.', ['Which perfect squares are around ' + n + '?'], 'root between MC', true);
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'BEG', outcome: 'G4', make: function (r) {
          var fn = r.pick(['tan', 'sin', 'cos']), F = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] };
          var opts = [['opp', 'hyp'], ['adj', 'hyp'], ['opp', 'adj'], ['adj', 'opp']].map(function (p) {
            var name = p.join() === 'opp,hyp' ? 'sin' : p.join() === 'adj,hyp' ? 'cos' : p.join() === 'opp,adj' ? 'tan' : null;
            return { html: t(fr('\\text{' + p[0] + '}', '\\text{' + p[1] + '}')), right: name === fn, code: 'b16-' + p.join(''), why: name ? 'That is ' + name + ' θ (' + MN[name] + ').' : 'That is tan θ upside down.' };
          });
          return P.mc(r, 'For an acute angle θ in a right triangle, ' + t('\\' + fn + '\\theta') + ' is', opts, MN[fn] + ': ' + t('\\' + fn + '\\theta=' + fr('\\text{' + F[fn][0] + '}', '\\text{' + F[fn][1] + '}')) + '.', ['SOH CAH TOA.'], 'ratio definition', true);
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'BEG', outcome: 'G2', make: function (r) {
          var s = find(function () { var a = r.int(3, 9); return [a, r.int(a + 1, 12)]; }, function (v) { var c = Math.hypot(v[0], v[1]); return Math.abs(c - Math.round(c)) > 0.05 && !(v[0] === 5 && v[1] === 7) && rd(Math.sqrt(v[1] * v[1] - v[0] * v[0])) !== rd(c); });
          var c = Math.hypot(s[0], s[1]), sum = s[0] * s[0] + s[1] * s[1];
          return P.mc(r, 'A right triangle has legs of ' + s[0] + ' m and ' + s[1] + ' m. To the nearest tenth, its hypotenuse is', [{ html: fx(s[0] + s[1]) + ' m', why: 'Square the legs before adding.', code: 'b17-add' }, { html: fx(c) + ' m', right: true },
            { html: fx(Math.sqrt(s[1] * s[1] - s[0] * s[0])) + ' m', why: 'For the hypotenuse, <b>add</b> the squares.', code: 'b17-sub' }, { html: fx(sum) + ' m', why: 'That is c². Take the square root.', code: 'b17-noroot' }],
            t('\\sqrt{' + s[0] * s[0] + '+' + s[1] * s[1] + '}=\\sqrt{' + sum + '}\\approx ' + fx(c)) + ' m', ['c² = a² + b², then the square root.'], 'hypotenuse MC', true);
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'EMG', outcome: 'G2', make: function (r) {
          var k = r.pick([0.3, 0.4, 0.6, 0.7, 0.8, 1.2, 2]), a = q(3 * k), b = q(4 * k), c = q(5 * k);
          return P.mc(r, 'To check that a corner of a concrete form is square, a builder measures ' + L(a, 'm') + ' along one side and ' + L(b, 'm') + ' along the other. The diagonal between the two marks should be', [
            { html: L(q(a + b), 'm'), why: 'Not the sides added: the diagonal is a hypotenuse.', code: 'b18-add' }, { html: L(c, 'm'), right: true },
            { html: L(q(2 * a), 'm'), why: 'Doubling a side doesn’t give the diagonal. Think 3-4-5.', code: 'b18-double' }, { html: L(q((a + b) / 2), 'm'), why: 'The diagonal is longer than both sides.', code: 'b18-mid' }],
            t(N(a) + '\\text{-}' + N(b) + '\\text{-}' + N(c)) + ' is 3-4-5 times ' + N(k) + ' (' + t(N(q(a * a)) + '+' + N(q(b * b)) + '=' + N(q(c * c)) + '=' + N(c) + '^2') + ').', ['3-4-5 times what?'], '3-4-5 MC', true);
        } }] },
      { num: '19', stem: '', parts: [
        { id: '19', level: 'BEG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { d: intNot(r, 18, 40, [25]), c: r.int(9, 22) }; }, function (v) { var vals = [v.c * TR.sin(v.d), v.c / TR.sin(v.d), v.c * TR.cos(v.d), v.c * TR.tan(v.d)].map(function (x) { return fx(x); }); return vals.every(function (x, i) { return vals.indexOf(x) === i; }) && !(v.d === 25 && v.c === 14); });
          var v = s.c * TR.sin(s.d);
          return P.mc(r, 'If ' + t(fnT('sin', s.d) + '=' + fr('x', s.c)) + ', then to the nearest tenth ' + t('x') + ' is', [{ html: fx(v), right: true }, { html: fx(s.c / TR.sin(s.d)), why: 'x is on top: multiply, don’t divide.', code: 'b19-div' }, { html: fx(s.c * TR.cos(s.d)), why: 'That uses cos. The equation has sin.', code: 'b19-cos' }, { html: fx(s.c * TR.tan(s.d)), why: 'That uses tan. The equation has sin.', code: 'b19-tan' }],
            t('x=' + s.c + '\\times\\sin ' + dg(s.d) + '\\approx ' + fx(v)), ['Multiply both sides by ' + s.c + '.'], 'solve sin = x/c MC', true);
        } }] },
      { num: '20', stem: '', parts: [
        { id: '20', level: 'EMG', outcome: 'G4', make: function (r) {
          var v = find(function () { return r.pick([0.4, 0.45, 0.55, 0.6, 0.65, 0.7, 0.75, 0.85, 0.9]); }, function (x) { var a = INV.tan(x); return safe(a, 0) && safe(INV.sin(x), 0) && safe(INV.cos(x), 0) && new Set([rd(a, 0), rd(INV.sin(x), 0), rd(INV.cos(x), 0), rd(90 - a, 0)]).size === 4; });
          var a = INV.tan(v);
          return P.mc(r, t('\\tan\\theta=' + N(v)) + '. To the nearest degree, θ is', [{ html: D(rd(INV.sin(v), 0)), why: 'That is sin⁻¹. Use tan⁻¹.', code: 'b20-sin' }, { html: D(rd(INV.cos(v), 0)), why: 'That is cos⁻¹. Use tan⁻¹.', code: 'b20-cos' }, { html: D(rd(90 - a, 0)), why: 'That is the other acute angle (90° − θ).', code: 'b20-comp' }, { html: D(rd(a, 0)), right: true }],
            t('\\tan^{-1}(' + N(v) + ')' + toN(a, 0) + '^\\circ'), ['2nd tan.'], 'inverse tan MC', true);
        } }] },
      { num: '21', stem: '', parts: [
        { id: '21', level: 'BEG', outcome: 'G4', make: function (r) {
          var d = intNot(r, 8, 35, [14, 9]), what = r.pick([['a lookout', 'a canoe'], ['a lighthouse', 'a boat'], ['a balcony', 'a parked car'], ['a hilltop', 'a cabin']]);
          return P.mc(r, 'From the top of ' + what[0] + ', the angle of depression to ' + what[1] + ' is ' + D(d) + '. The angle of elevation from ' + what[1] + ' to the top of ' + what[0] + ' is', [{ html: D(d), right: true }, { html: D(90 - d), why: 'That is the angle with the vertical. The two angles with the horizontal are equal.', code: 'b21-comp' }, { html: D(90 + d), why: 'The angles are alternate interior angles: equal.', code: 'b21-plus' }, { html: D(180 - d), why: 'They are alternate interior angles between two horizontal lines: equal, not supplementary.', code: 'b21-supp' }],
            D(d) + ': the two angles are alternate interior angles between two horizontal (parallel) lines, so they are equal.', ['Both angles are measured from a horizontal line.'], 'depression = elevation', true);
        } }] },
      { num: '22', stem: '', parts: [
        { id: '22', level: 'BEG', outcome: 'G4', make: function (r) {
          var fn = r.pick(['sine', 'cosine']), bad = pickR(r, 1.05, 1.6, 0.05), goods = r.sample([0.15, 0.25, 0.35, 0.5, 0.62, 0.8, 0.95, 0.99], 3);
          return P.mc(r, 'Which number can <b>not</b> be the ' + fn + ' of an acute angle?', goods.map(function (g) { return { html: N(g), why: N(g) + ' is less than 1, so it can be a ' + fn + '. Look for one that is <b>more</b> than 1.', code: 'b22-ok' }; }).concat([{ html: N(bad), right: true }]),
            N(bad) + ': ' + (fn === 'sine' ? 'sin θ = opp ÷ hyp' : 'cos θ = adj ÷ hyp') + ', and the hyp is the longest side, so the ' + fn + ' is less than 1.', ['The hyp is on the bottom. Can the top be bigger?'], 'impossible ratio');
        } }] },
      /* ---------------- Part C ---------------- */
      { num: '23', section: 'Part C: Numerical Response', stem: '', parts: [
        { id: '23', level: 'EMG', outcome: 'G2', make: function (r) {
          var tr = find(function () { var t0 = r.pick(TRIPLES), k = r.pick([1, 2, 3]); return t0.map(function (x) { return x * k; }); }, function (v) { return v[2] < 100 && !(v[0] === 20 && v[1] === 21); });
          return P.nr('<b>Numerical response.</b> A right triangle has legs of ' + tr[0] + ' cm and ' + tr[1] + ' cm. The length of the hypotenuse is ___ cm.', tr[2], function (v) { return v === tr[0] + tr[1] ? { code: 'pyth-add-sides', hint: 'Square the legs, add, then take the square root.' } : null; },
            t('\\sqrt{' + tr[0] + '^2+' + tr[1] + '^2}=\\sqrt{' + tr[0] * tr[0] + '+' + tr[1] * tr[1] + '}=\\sqrt{' + tr[2] * tr[2] + '}=' + tr[2]) + ' cm', ['c² = a² + b².'], 'NR hypotenuse');
        } }] },
      { num: '24', stem: '', parts: [
        { id: '24', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { h: pickR(r, 1.5, 3.5, 0.5), run: r.int(4, 9) }; }, function (v) { return safe(INV.tan(v.h / v.run), 0) && v.h < v.run && !(v.h === 2.5 && v.run === 6); });
          var a = INV.tan(s.h / s.run);
          return GP.trigAngle('<b>Numerical response.</b> A shed roof rises ' + L(s.h, 'm') + ' over a horizontal run of ' + L(s.run, 'm') + '. To the nearest degree, the angle of the roof is ___°.', a, { nr: true, ratio: { fn: 'tan', num: s.h, den: s.run }, sol: 'TOA: ' + t('\\theta=\\tan^{-1}(' + N(s.h) + '\\div ' + s.run + ')' + toN(a, 0) + '^\\circ'), hints: ['The rise is opp and the run is adj.'], text: 'NR roof angle' });
        } }] },
      { num: '25', stem: '', parts: [
        { id: '25', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { w: r.int(20, 45), d: intNot(r, 52, 72, [64]) }; }, function (v) { return safe(v.w * TR.sin(v.d)); });
          var v = s.w * TR.sin(s.d);
          return GP.len('<b>Numerical response.</b> A guy wire ' + s.w + ' m long runs from the top of a tower to the ground and makes an angle of ' + D(s.d) + ' with the ground. To the nearest tenth of a metre, the tower is ___ m tall.', v, { nr: true, unit: 'm', trig: { fn: 'sin', deg: s.d, side: s.w, op: 'mul' }, sol: 'SOH: height ' + t('=' + s.w + '\\times\\sin ' + dg(s.d) + toN(v)) + ' m', hints: ['The wire is the hyp; the tower is opp.'], text: 'NR tower height' });
        } }] },
      { num: '26', stem: '', parts: [
        { id: '26', level: 'EMG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { L: 50 * r.int(10, 24), d: intNot(r, 14, 30, [21]) }; }, function (v) { var x = v.L * TR.cos(v.d); return safe(x, 0) && x < 9999; });
          var v = s.L * TR.cos(s.d);
          return GP.len('<b>Numerical response.</b> A straight ski run is ' + L(s.L, 'm') + ' long and slopes down at ' + D(s.d) + ' from the horizontal. To the nearest <b>metre</b>, the horizontal distance it covers is ___ m.', v, { dp: 0, nr: true, unit: 'm', trig: { fn: 'cos', deg: s.d, side: s.L, op: 'mul' }, sol: 'CAH: horizontal ' + t('=' + N(s.L) + '\\times\\cos ' + dg(s.d) + toN(v, 0)) + ' m', hints: ['The run is the hyp; the horizontal distance is adj.'], text: 'NR ski run' });
        } }] }
    ],
    extra: [
      /* ---------------- A. Skills ---------------- */
      { num: '1', section: 'A. Skills', stem: 'Fill in the blanks.', shared: function (r) { return { n: intNot(r, 12, 21, [13, 15]), s: intNot(r, 12, 21, [14, 17]), rt: find(function () { return r.int(18, 130); }, function (v) { return Math.round(Math.sqrt(v)) ** 2 !== v && v !== 45 && safe(Math.sqrt(v)); }), a: intNot(r, 22, 74, [58, 34, 45]) }; },
        parts: [
          { id: 'x1abc', sub: 'a–c', level: 'BEG', outcome: 'G2', make: function (r, sh) {
            var v = Math.sqrt(sh.rt);
            return P.fields('Fill in each blank.', [{ label: '(a) ' + t('' + sh.n + '^2='), name: '(a)' }, { label: '(b) ' + t('\\sqrt{' + sh.s * sh.s + '}='), name: '(b)' }, { label: '(c) ' + t('\\sqrt{' + sh.rt + '}\\approx'), name: '(c)' }],
              [K.number(sh.n * sh.n, function (x) { return x === 2 * sh.n ? { code: 'u7l10-sq-double', hint: t(sh.n + '^2=' + sh.n + '\\times' + sh.n) + '.' } : null; }), K.number(sh.s, function (x) { return x === sh.s * sh.s / 2 ? { code: 'u7l10-root-half', hint: 'Not half: which number times itself makes ' + sh.s * sh.s + '?' } : null; }), G.lenChk(v, {})],
              [String(sh.n * sh.n), String(sh.s), key(v)], t(sh.n + '^2=' + sh.n * sh.n + ',\\ \\sqrt{' + sh.s * sh.s + '}=' + sh.s + ',\\ \\sqrt{' + sh.rt + '}\\approx ' + fx(v)),
              br([t(sh.n + '\\times' + sh.n + '=' + sh.n * sh.n), t(sh.s + '\\times' + sh.s + '=' + sh.s * sh.s), t(Math.floor(v) + '^2=' + Math.floor(v) * Math.floor(v)) + ' and ' + t((Math.floor(v) + 1) + '^2=' + (Math.floor(v) + 1) * (Math.floor(v) + 1)) + ', so ' + t('\\sqrt{' + sh.rt + '}') + ' is between ' + Math.floor(v) + ' and ' + (Math.floor(v) + 1) + ': ' + t('\\approx ' + fx(v))]), ['Round the root to the nearest tenth.'], 'squares and roots');
          } },
          { id: 'x1d', level: 'BEG', outcome: 'G4', make: function (r, sh) {
            return P.fields('A right triangle has an acute angle of ' + D(sh.a) + '. Its other acute angle is', [{ label: '', after: '°', name: 'angle' }], [G.angleChk(90 - sh.a, { supplementTrap: false, alts: [{ v: 180 - sh.a, code: 'u7l10-angle-sum', hint: 'Don’t forget the right angle: ' + t('180^\\circ-90^\\circ-' + sh.a + '^\\circ') + '.' }] })], [String(90 - sh.a)], D(90 - sh.a), t('180^\\circ-90^\\circ-' + sh.a + '^\\circ=' + (90 - sh.a) + '^\\circ'), ['The two acute angles add to 90°.'], 'other acute angle');
          } }] },
      { num: '2', stem: 'Find each side marked <i>x</i> with the Pythagorean theorem, to the nearest tenth.', shared: function (r) {
          return { a: find(function () { var a = r.int(6, 14); return [a, r.int(a + 2, 18)]; }, function (v) { return safe(Math.hypot(v[0], v[1])) && !(v[0] === 10 && v[1] === 13); }),
            b: find(function () { var t0 = r.pick(TRIPLES.slice(0, 8)), k = r.pick([1, 2, 3, 5]); return [t0[0] * k, t0[2] * k]; }, function (v) { return v[1] < 70 && !(v[0] === 15 && v[1] === 25); }) };
        },
        parts: [
          { id: 'x2a', level: 'BEG', outcome: 'G2', make: function (r, sh) {
            var s = sh.a, c = Math.hypot(s[0], s[1]);
            return GP.len('Find <i>x</i>.' + tri({ a: s[0], b: s[1], sides: { a: s[0] + ' m', b: s[1] + ' m', c: 'x' }, unknown: 'c' }), c, { unit: 'm', pyth: { legs: s }, sol: br([t('x^2=' + s[0] + '^2+' + s[1] + '^2=' + s[0] * s[0] + '+' + s[1] * s[1] + '=' + (s[0] * s[0] + s[1] * s[1])), t('x=\\sqrt{' + (s[0] * s[0] + s[1] * s[1]) + '}' + toN(c)) + ' m']), hints: ['Add the squares of the legs.'], text: 'hypotenuse' });
          } },
          { id: 'x2b', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var s = sh.b, v = Math.sqrt(s[1] * s[1] - s[0] * s[0]);
            return GP.len('Find <i>x</i>.' + tri({ a: s[0], c: s[1], sides: { a: s[0] + ' in', c: s[1] + ' in', b: 'x' }, unknown: 'b' }), v, { unit: 'in', pyth: { hyp: s[1], leg: s[0] }, sol: br([t('x^2=' + s[1] + '^2-' + s[0] + '^2=' + s[1] * s[1] + '-' + s[0] * s[0] + '=' + (s[1] * s[1] - s[0] * s[0])), t('x=\\sqrt{' + (s[1] * s[1] - s[0] * s[0]) + '}' + toN(v)) + ' in']), hints: [s[1] + ' in is the hypotenuse: subtract the squares.'], text: 'leg' });
          } }] },
      { num: '3', stem: function (sh) { var s = sh.s; return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('a=' + s[0]) + ', ' + t('b=' + s[1]) + ' and ' + t('c=' + s[2]) + '.' + tri({ a: s[0], b: s[1], names: ['A', 'B', 'C'], sides: { a: 'a = ' + s[0], b: 'b = ' + s[1], c: 'c = ' + s[2] }, width: 260 }); },
        shared: function (r) { return { s: find(function () { return r.pick(TRIPLES.slice(1)); }, function (v) { return v[0] !== 33 || r.chance(0.3); }) }; },
        parts: [
          { id: 'x3a', level: 'BEG', outcome: 'G4', make: function (r, sh) {
            var s = sh.s, W = ['opp', 'adj', 'hyp'];
            var nm = function (want) { return K.number(s[W.indexOf(want)], function (v) { var i = s.indexOf(v); return i >= 0 ? { code: 'u7l10-word-' + W[i], hint: v + ' is the ' + W[i] + ' for ∠A: ' + ({ opp: 'a is across from ∠A', adj: 'b is next to ∠A', hyp: 'c is across from the right angle' })[W[i]] + '.' } : null; }); };
            return P.fields('For ' + t('\\angle A') + ', name opp, adj and hyp (type the lengths).', [{ label: 'opp =', name: 'opp' }, { label: 'adj =', name: 'adj' }, { label: 'hyp =', name: 'hyp' }], [nm('opp'), nm('adj'), nm('hyp')], s.map(String), 'opp = a = ' + s[0] + ', adj = b = ' + s[1] + ', hyp = c = ' + s[2], 'opp = a = ' + s[0] + ' (across from ∠A), adj = b = ' + s[1] + ', hyp = c = ' + s[2], ['Side a is across from ∠A.'], 'name sides for A');
          } },
          { id: 'x3b', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var o = sh.s[0], a = sh.s[1], h = sh.s[2];
            return P.fields('Write ' + t('\\sin A') + ', ' + t('\\cos A') + ' and ' + t('\\tan A') + ' as decimals to 4 decimal places.', [{ label: t('\\sin A='), name: 'sin A' }, { label: t('\\cos A='), name: 'cos A' }, { label: t('\\tan A='), name: 'tan A' }],
              [ratioChk(o, h, 'sin', { others: [[a / h, 'That is cos A. sin A = <b>opp</b> ÷ hyp.']] }), ratioChk(a, h, 'cos', { others: [[o / h, 'That is sin A. cos A = <b>adj</b> ÷ hyp.']] }), ratioChk(o, a, 'tan', { others: [[o / h, 'tan A = opp ÷ <b>adj</b>.']] })],
              [key(o / h, 4), key(a / h, 4), key(o / a, 4)], t('\\sin A\\approx ' + fx(o / h, 4) + ',\\ \\cos A\\approx ' + fx(a / h, 4) + ',\\ \\tan A\\approx ' + fx(o / a, 4)),
              t('\\sin A=' + fr(o, h) + '\\approx ' + fx(o / h, 4) + ',\\quad \\cos A=' + fr(a, h) + '\\approx ' + fx(a / h, 4) + ',\\quad \\tan A=' + fr(o, a) + '\\approx ' + fx(o / a, 4)), ['SOH CAH TOA.'], 'ratios of A');
          } },
          { id: 'x3c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var o = sh.s[0], a = sh.s[1], h = sh.s[2];
            return P.fields('Which side is opposite ' + t('\\angle B') + '? Write ' + t('\\sin B') + ' to 4 decimal places.', [{ label: 'Side opposite ∠B =', name: 'side' }, { label: t('\\sin B='), name: 'sin B' }],
              [K.number(a, function (v) { return v === o ? { code: 'u7l10-swap', hint: 'a = ' + o + ' is across from ∠A. Across from ∠B is b.' } : v === h ? { code: 'u7l10-word-hyp', hint: 'c is across from the <b>right</b> angle.' } : null; }), ratioChk(a, h, 'sin', { others: [[o / h, 'That is sin A. From ∠B, the opposite side is b = ' + a + '.']] })],
              [String(a), key(a / h, 4)], 'b = ' + a + '; ' + t('\\sin B=' + fr(a, h) + '\\approx ' + fx(a / h, 4)), 'b = ' + a + ' is opposite ∠B. ' + t('\\sin B=' + fr(a, h) + '\\approx ' + fx(a / h, 4)) + ' (the same as cos A).', ['Opp and adj swap when you change the angle.'], 'sin B');
          } }] },
      { num: '4', stem: 'Find each side marked <i>x</i>, to the nearest tenth.', shared: function (r) {
          return { a: find(function () { return { d: intNot(r, 36, 56, [44, 38]), s: pickR(r, 4, 9, 0.5) }; }, function (v) { return safe(v.s * TR.tan(v.d)); }), b: find(function () { return { d: intNot(r, 20, 40, [29, 27]), s: r.int(8, 20) }; }, function (v) { return safe(v.s / TR.cos(v.d)); }),
            c: find(function () { return { d: intNot(r, 50, 70, [57, 63]), s: pickR(r, 6, 12, 0.5) }; }, function (v) { return safe(v.s * TR.sin(v.d)); }) };
        },
        parts: [
          { id: 'x4a', level: 'BEG', outcome: 'G4', make: function (r, sh) { return sidePart(sh.a.d, 'adj', sh.a.s, 'opp', 'cm'); } },
          { id: 'x4b', level: 'EMG', outcome: 'A1', make: function (r, sh) { return sidePart(sh.b.d, 'adj', sh.b.s, 'hyp', 'm'); } },
          { id: 'x4c', level: 'BEG', outcome: 'G4', make: function (r, sh) { return sidePart(sh.c.d, 'hyp', sh.c.s, 'opp', 'ft'); } }] },
      { num: '5', stem: 'Find each angle θ, to the nearest degree.', shared: function (r) {
          return { a: find(function () { var a = r.int(2, 6); return [r.int(a + 2, 12), a]; }, function (v) { return safe(INV.tan(v[0] / v[1]), 0) && !(v[0] === 7 && v[1] === 3); }), b: find(function () { var h = r.int(8, 20); return [r.int(Math.ceil(h * 0.6), h - 1), h]; }, function (v) { return safe(INV.cos(v[0] / v[1]), 0) && !(v[0] === 12 && v[1] === 13); }),
            c: find(function () { var h = r.int(6, 15); return [pickR(r, 1.5, h * 0.4, 0.1), h]; }, function (v) { return safe(INV.sin(v[0] / v[1]), 0) && INV.sin(v[0] / v[1]) > 6; }) };
        },
        parts: [
          { id: 'x5a', level: 'BEG', outcome: 'G4', make: function (r, sh) { return anglePart('opp', sh.a[0], 'adj', sh.a[1]); } },
          { id: 'x5b', level: 'EMG', outcome: 'G4', make: function (r, sh) { return anglePart('adj', sh.b[0], 'hyp', sh.b[1]); } },
          { id: 'x5c', level: 'EMG', outcome: 'G4', make: function (r, sh) { return anglePart('opp', sh.c[0], 'hyp', sh.c[1]); } }] },
      /* ---------------- B. Applying ---------------- */
      { num: '6', section: 'B. Applying', stem: 'A carpenter cuts two triangular corner shelves. Which one has a square corner? Show your work.', shared: function (r) { var y = r.chance(0.5); return { a: testTriple(r, y, 25, 100), b: testTriple(r, !y, 25, 100) }; },
        parts: [
          { id: 'x6a', level: 'EMG', outcome: 'G2', make: function (r, sh) { var s = sh.a; return rtTestPart('Shelf A: sides ' + s[0] + ' cm, ' + s[1] + ' cm and ' + s[2] + ' cm.', s, 'cm'); } },
          { id: 'x6b', level: 'EMG', outcome: 'G2', make: function (r, sh) { var s = sh.b; return rtTestPart('Shelf B: sides ' + s[0] + ' cm, ' + s[1] + ' cm and ' + s[2] + ' cm.', s, 'cm'); } }] },
      { num: '7', stem: '', parts: [
        { id: 'x7', level: 'EMG', outcome: 'G2', make: function (r) {
          var s = r.pick([{ what: 'a Canadian football field (not counting the end zones)', l: 110, w: 65, u: 'yd' }, { what: 'a soccer field', l: 105, w: 68, u: 'm' }, { what: 'a hockey rink (ignore the rounded corners)', l: 61, w: 26, u: 'm' }, { what: 'a basketball court', l: 28, w: 15, u: 'm' }, { what: 'a schoolyard', l: pickR(r, 60, 95, 5), w: pickR(r, 35, 55, 5), u: 'm' }]);
          var d = Math.hypot(s.l, s.w);
          return GP.len(cap(s.what.replace(/^a /, 'A ')) + ' is a rectangle ' + s.l + ' ' + s.u + ' long and ' + s.w + ' ' + s.u + ' wide. A player runs straight from one corner to the opposite corner. How far is that, to the nearest tenth?', d, { unit: s.u, pyth: { legs: [s.l, s.w] }, sol: br([t('d=\\sqrt{' + s.l + '^2+' + s.w + '^2}=\\sqrt{' + N(s.l * s.l) + '+' + N(s.w * s.w) + '}=\\sqrt{' + N(s.l * s.l + s.w * s.w) + '}' + toN(d)) + ' ' + s.u, 'Check: longer than ' + s.l + ' but less than ' + (s.l + s.w) + ' ✓']), hints: ['The diagonal is the hypotenuse of a right triangle.'], text: 'field diagonal' });
        } }] },
      { num: '8', stem: '', parts: [
        { id: 'x8', level: 'PRG', outcome: 'G4', make: function (r) {
          var s = find(function () { return { d: 5 * r.int(6, 16), th: intNot(r, 25, 50, [38, 27]), e: pickR(r, 1.3, 1.7, 0.1) }; }, function (v) { return safe(v.d * TR.tan(v.th) + v.e) && !(v.d === 50 && v.th === 38); });
          var y = s.d * TR.tan(s.th), v = y + s.e;
          return GP.len('A surveyor sets up her instrument ' + L(s.d, 'm') + ' from the base of an office building. The instrument is ' + L(s.e, 'm') + ' above the ground, and the angle of elevation to the top of the building is ' + D(s.th) + '. How tall is the building, to the nearest tenth of a metre?' + G.elevationSVG({ angle: s.th, dist: s.d, eye: s.e, target: 'building', labels: { height: 'h', dist: s.d + ' m', eye: s.e + ' m' }, width: 330 }), v, { unit: 'm', trig: { fn: 'tan', deg: s.th, side: s.d, op: 'mul' }, radTrap: { fn: 'tan', deg: s.th, side: s.d, op: 'mul' },
            alts: [{ v: y, code: 'u7l10-no-post', hint: 'That is the height above the <b>instrument</b>. Add its height, ' + s.e + ' m.' }],
            sol: br(['From the instrument: adj = ' + s.d + ' m, want opp → TOA.', t('\\text{opp}=' + s.d + '\\times\\tan ' + dg(s.th) + '=' + rawN(y)) + ' m', 'Add the instrument height: ' + t(rawN(y) + '+' + N(s.e) + toN(v)) + ' m']), hints: ['The triangle starts at the instrument, not the ground.'], text: 'building height' });
        } }] },
      { num: '9', stem: function (sh) { return 'A ramp to the front door of a clinic must rise ' + L(sh.r, 'm') + '. The town asks for a slope of 1 : 12 (1 m up for every 12 m along the ground).'; },
        shared: function (r) { return find(function () { return { r: pickR(r, 0.35, 0.95, 0.05) }; }, function (v) { return v.r !== 0.75 && safe(Math.hypot(12 * v.r, v.r)); }); },
        parts: [
          { id: 'x9a', level: 'EMG', outcome: 'G2', make: function (r, sh) {
            var run = q(12 * sh.r);
            return GP.len('How long must the horizontal run be?', run, { dp: 1, unit: 'm', alts: [{ v: sh.r / 12, code: 'u7l10-run', hint: '12 m along for every 1 m up: the run is <b>12 times</b> the rise.' }, { v: sh.r + 12, code: 'u7l10-run', hint: 'Multiply by 12, don’t add.' }], sol: t(N(sh.r) + '\\times 12=' + N(run)) + ' m', hints: ['Every 1 m up needs 12 m along.'], text: 'ramp run' });
          } },
          { id: 'x9b', level: 'PRG', outcome: 'G2', make: function (r, sh) {
            var run = q(12 * sh.r), c = Math.hypot(run, sh.r);
            return GP.len('How long is the sloped surface of the ramp, to the nearest tenth?', c, { unit: 'm', pyth: { legs: [run, sh.r] }, sol: br([t('\\sqrt{' + N(run) + '^2+' + N(sh.r) + '^2}=\\sqrt{' + N(q(run * run + sh.r * sh.r)) + '}' + toN(c)) + ' m', '(just a little longer than the run)']), hints: ['The run and the rise are the legs; the sloped surface is the hypotenuse.'], text: 'ramp length' });
          } },
          { id: 'x9c', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var run = q(12 * sh.r), a = INV.tan(1 / 12);
            return GP.trigAngle('Find the angle of the ramp, to the nearest <b>tenth</b> of a degree.', a, { dp: 1, ratio: { fn: 'tan', num: sh.r, den: run }, sol: t('\\theta=\\tan^{-1}(' + N(sh.r) + '\\div ' + N(run) + ')=\\tan^{-1}\\!\\left(' + fr(1, 12) + '\\right)' + toN(a) + '^\\circ'), hints: ['Rise is opp, run is adj: TOA.'], text: 'ramp angle' });
          } }] },
      { num: '10', stem: function (sh) { return 'At 4:00 one afternoon, ' + sh.who + ', who is ' + L(sh.h, 'm') + ' tall, casts a shadow ' + L(sh.s, 'm') + ' long. At the same time, a lamp post casts a shadow ' + L(sh.S, 'm') + ' long.' + G.shadowSVG({ small: { h: sh.h, shadow: sh.s, kind: 'person', label: { h: sh.h + ' m', s: sh.s + ' m' } }, big: { h: sh.S * sh.h / sh.s, shadow: sh.S, kind: 'pole', label: { h: '?', s: sh.S + ' m' } }, sunLabel: 'θ', width: 400 }); },
        shared: function (r) { return find(function () { var h = pickR(r, 1.5, 1.9, 0.1); return { h: h, s: pickR(r, 1.2, 3.6, 0.2), S: r.int(6, 16), who: r.pick(NAMES) }; }, function (v) { return safe(INV.tan(v.h / v.s), 0) && safe(v.S * v.h / v.s) && !(v.h === 1.8 && v.s === 2.4); }); },
        parts: [
          { id: 'x10a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var a = INV.tan(sh.h / sh.s);
            return GP.trigAngle('Find the angle of elevation of the sun, to the nearest degree.', a, { ratio: { fn: 'tan', num: sh.h, den: sh.s }, sol: sh.who + ' is opp and the shadow is adj → TOA: ' + t('\\theta=\\tan^{-1}(' + N(sh.h) + '\\div ' + N(sh.s) + ')' + toN(a, 0) + '^\\circ'), hints: ['The person is opp; the shadow is adj.'], text: 'sun angle' });
          } },
          { id: 'x10b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var k = sh.h / sh.s, v = sh.S * k;
            return GP.len('The sun’s rays are parallel, so the lamp post’s triangle has the same angle and the same tangent ratio. Find the height of the lamp post, to the nearest tenth.', v, { unit: 'm', alts: [{ v: sh.S * sh.s / sh.h, code: 'u7l10-shadow-flip', hint: 'tan θ = height ÷ shadow = ' + N(sh.h) + ' ÷ ' + N(sh.s) + '. Multiply the post’s shadow by that.' }, { v: sh.S * TR.tan(rd(INV.tan(k), 0)), code: 'u7l10-early', hint: 'Use the exact ratio ' + N(sh.h) + ' ÷ ' + N(sh.s) + ' (or the full angle), not the rounded angle.' }],
              sol: br([t('\\tan\\theta=' + fr(N(sh.h), N(sh.s)) + '=' + rawN(k)) + ' in both triangles.', 'height ' + t('=' + sh.S + '\\times ' + rawN(k) + toN(v)) + ' m']), hints: ['height = shadow × tan θ.'], text: 'lamp post' });
          } }] },
      { num: '11', stem: '', parts: [
        { id: 'x11', level: 'BEG', outcome: 'A1', make: function (r) {
          var d = intNot(r, 24, 48, [32]), o = r.int(5, 14), want = r.pick(['hyp', 'adj']);
          var opts = want === 'hyp' ? [{ html: t('x=' + o + '\\times\\sin ' + dg(d)), why: 'That gives a length shorter than ' + o + ' m, but the hyp is the longest side. x is on the bottom: divide.', code: 'e11-mul' }, { html: t('x=' + o + '\\div\\sin ' + dg(d)), right: true }, { html: t('x=' + o + '\\div\\cos ' + dg(d)), why: 'Cos uses the adjacent side. You know the opposite side.', code: 'e11-cos' }, { html: t('x=\\sin ' + dg(d) + '\\div ' + o), why: 'Upside down: side ÷ sin θ.', code: 'e11-flip' }]
            : [{ html: t('x=' + o + '\\times\\tan ' + dg(d)), why: 'x is on the bottom of ' + t('\\tan\\theta=' + fr(o, 'x')) + ': divide.', code: 'e11-mul' }, { html: t('x=' + o + '\\div\\tan ' + dg(d)), right: true }, { html: t('x=' + o + '\\div\\sin ' + dg(d)), why: 'That gives the hypotenuse. You want the adjacent side: TOA.', code: 'e11-sin' }, { html: t('x=\\tan ' + dg(d) + '\\div ' + o), why: 'Upside down: side ÷ tan θ.', code: 'e11-flip' }];
          var fn = want === 'hyp' ? 'sin' : 'tan';
          return P.mc(r, 'A right triangle has a ' + D(d) + ' angle, and the side opposite it is ' + o + ' m. Which equation gives ' + (want === 'hyp' ? 'the hypotenuse' : 'the side adjacent to the angle') + ', ' + t('x') + '?', opts,
            t(fnT(fn, d) + '=' + fr(o, 'x')) + ', and x is on the bottom, so divide: ' + t('x=' + o + '\\div\\' + fn + ' ' + dg(d) + '\\approx ' + fx(o / TR[fn](d))) + ' m.', ['Write the ratio first. Is x on the top or the bottom?'], 'which equation (÷)', true);
        } }] },
      { num: '12', stem: '', parts: [
        { id: 'x12', level: 'EMG', outcome: 'A1', make: function (r) {
          var s = find(function () { return { p: pickR(r, 1.8, 3.2, 0.1), d: intNot(r, 30, 55, [40]) }; }, function (v) { return safe(v.p / TR.sin(v.d)); });
          var v = s.p / TR.sin(s.d);
          return GP.len('<b>Numerical response.</b> A rope runs from the top of a ' + L(s.p, 'm') + ' tent pole to a peg in the ground and makes an angle of ' + D(s.d) + ' with the ground. To the nearest tenth of a metre, the rope is ___ m long.', v, { nr: true, unit: 'm', trig: { fn: 'sin', deg: s.d, side: s.p, op: 'div' }, sol: 'The pole is opp and the rope is hyp → SOH: ' + t('x=' + N(s.p) + '\\div\\sin ' + dg(s.d) + toN(v)) + ' m', hints: ['The rope is on the bottom of the ratio: divide.'], text: 'NR rope' });
        } }] },
      /* ---------------- C. Stretch ---------------- */
      { num: '13', section: 'C. Stretch', stem: '', parts: [
        { id: 'x13', level: 'MAS', outcome: 'G4', make: function (r) {
          var s = find(function () { var al = r.int(24, 40); return { d: 5 * r.int(6, 14), al: al, be: al + r.int(3, 7) }; }, function (v) { var x = v.d * (TR.tan(v.be) - TR.tan(v.al)); return safe(x) && rd(rd(v.d * TR.tan(v.be), 2) - rd(v.d * TR.tan(v.al), 2)) === rd(x) && !(v.d === 45 && v.al === 34); });
          var top = s.d * TR.tan(s.be), bot = s.d * TR.tan(s.al), v = top - bot;
          return GP.len('An antenna stands on top of a hotel. From a point on the ground ' + L(s.d, 'm') + ' from the hotel, the angle of elevation to the top of the hotel is ' + D(s.al) + ' and to the top of the antenna is ' + D(s.be) + '. How tall is the antenna, to the nearest tenth of a metre?' + antennaSVG(s.d, s.al, s.be), v, { unit: 'm', radTrap: false,
            alts: [{ v: s.d * TR.tan(s.be - s.al), code: 'u7l10-tan-diff', hint: 'You can’t subtract the angles first. Find both heights with tan, then subtract.' }, { v: top, code: 'u7l10-one', hint: 'That is the height to the top of the antenna. Subtract the hotel’s height.' }, { v: bot, code: 'u7l10-one', hint: 'That is the hotel’s height. Find the height to the top of the antenna too.' },
              { v: top + bot, code: 'u7l10-added', hint: 'The antenna is the <b>difference</b> of the two heights.' }, { v: s.d * (Math.tan(s.be) - Math.tan(s.al)), code: 'trig-rad', hint: G.RAD_HINT }],
            sol: br(['Two right triangles share the ' + s.d + ' m side (adj in both) → TOA.', 'To the top of the antenna: ' + t(s.d + '\\times\\tan ' + dg(s.be) + '=' + rawN(top)) + ' m', 'To the top of the hotel: ' + t(s.d + '\\times\\tan ' + dg(s.al) + '=' + rawN(bot)) + ' m', 'Antenna: ' + t(rawN(top) + '-' + rawN(bot) + toN(v)) + ' m']), hints: ['Two triangles share the ' + s.d + ' m ground distance.', 'Find both heights, then subtract.'], text: 'antenna' });
        } }] },
      { num: '14', stem: function (sh) { return 'A car trunk is shaped like a box ' + L(sh.w, 'm') + ' wide, ' + L(sh.dp, 'm') + ' deep and ' + L(sh.h, 'm') + ' tall. ' + sh.who + ' wants to fit in a hockey stick ' + L(sh.st, 'm') + ' long.' + HW.solid('rectprism', { l: sh.w + ' m', w: sh.dp + ' m', h: sh.h + ' m', width: 220 }); },
        shared: function (r) { return find(function () { return { w: pickR(r, 1.0, 1.3, 0.1), dp: pickR(r, 0.6, 0.9, 0.1), h: pickR(r, 0.4, 0.7, 0.1), st: pickR(r, 1.35, 1.6, 0.05), who: r.pick(NAMES) }; }, function (v) {
          var fd = Math.hypot(v.w, v.dp), sd = Math.hypot(fd, v.h); return fd < v.st - 0.02 && safe(fd, 2) && safe(sd, 2) && Math.abs(sd - v.st) > 0.02 && !(v.w === 1.2 && v.dp === 0.8 && v.h === 0.6); }); },
        parts: [
          { id: 'x14a', level: 'PRG', outcome: 'G2', make: function (r, sh) {
            var fd = Math.hypot(sh.w, sh.dp), s2 = q(sh.w * sh.w + sh.dp * sh.dp);
            return P.fields('Find the diagonal of the trunk’s floor, to the nearest hundredth. Will the stick lie flat on the floor?', [{ label: 'Floor diagonal:', after: 'm', name: 'diagonal' }, { label: 'Lies flat? (yes/no)', mode: 'text', name: 'yes/no' }],
              [G.lenChk(fd, { dp: 2, pyth: { legs: [sh.w, sh.dp] } }), yesNo('no', function () { return fx(fd, 2) + ' m is shorter than the ' + N(sh.st) + ' m stick, so it won’t fit flat.'; })], [key(fd, 2), 'no'], t(fx(fd, 2) + '\\text{ m}') + '; no',
              br([t('\\sqrt{' + N(sh.w) + '^2+' + N(sh.dp) + '^2}=\\sqrt{' + N(q(sh.w * sh.w)) + '+' + N(q(sh.dp * sh.dp)) + '}=\\sqrt{' + N(s2) + '}' + toN(fd, 2)) + ' m', t(fx(fd, 2) + '<' + N(sh.st)) + ', so it will <b>not</b> lie flat.']), ['The floor diagonal is the hypotenuse of a right triangle with the width and depth as legs.'], 'trunk floor');
          } },
          { id: 'x14b', level: 'MAS', outcome: 'G2', make: function (r, sh) {
            var fd = Math.hypot(sh.w, sh.dp), s2 = q(sh.w * sh.w + sh.dp * sh.dp), sd = Math.sqrt(s2 + sh.h * sh.h), fits = sd >= sh.st;
            return P.fields('The longest straight line in the trunk goes from a bottom corner to the opposite top corner. It is the hypotenuse of a right triangle with legs equal to the floor diagonal and the height. Find it to the nearest hundredth. Will the stick fit that way?', [{ label: 'Longest line:', after: 'm', name: 'length' }, { label: 'Fits? (yes/no)', mode: 'text', name: 'yes/no' }],
              [early(G.lenChk(sd, { dp: 2, pyth: { legs: [fd, sh.h] }, alts: [{ v: Math.hypot(sh.w, sh.h), code: 'u7l10-one', hint: 'Use the <b>floor diagonal</b> as one leg, not the width.' }] }), [Math.hypot(rd(fd, 2), sh.h), Math.hypot(rd(fd, 1), sh.h)], 2, 'Nearly! Use the unrounded square of the floor diagonal (' + N(s2) + '), not the rounded ' + fx(fd, 2) + ' squared.'),
                yesNo(fits ? 'yes' : 'no', function () { return fits ? fx(sd, 2) + ' m is longer than the stick, so it fits on a slant.' : fx(sd, 2) + ' m is shorter than the stick, so it does not fit.'; })],
              [key(sd, 2), fits ? 'yes' : 'no'], t(fx(sd, 2) + '\\text{ m}') + '; ' + (fits ? 'yes' : 'no'),
              br([t('\\sqrt{' + N(s2) + '+' + N(sh.h) + '^2}=\\sqrt{' + N(s2) + '+' + N(q(sh.h * sh.h)) + '}=\\sqrt{' + N(q(s2 + sh.h * sh.h)) + '}' + toN(sd, 2)) + ' m', t(fx(sd, 2) + (fits ? '>' : '<') + N(sh.st)) + ', so ' + (fits ? '<b>yes</b>, it fits on a slant from corner to corner.' : '<b>no</b>, it does not fit even on a slant.'), '(Use ' + N(s2) + ', the unrounded square, not ' + t(fx(fd, 2) + '^2') + '.)']), ['The legs are the floor diagonal (part a) and the height.', 'Keep the full value: use the floor diagonal squared, ' + N(s2) + '.'], 'trunk space diagonal');
          } }] },
      { num: '15', stem: function (sh) { return 'A right triangle has an adjacent side of ' + L(sh.a, 'cm') + ' and a hypotenuse of ' + L(sh.h, 'cm') + '. ' + sh.who + ' wrote ' + t('\\cos\\theta=' + fr(sh.h, sh.a)) + '. ' + cap(he(sh.who)) + ' pressed 2nd cos ' + sh.h + ' ÷ ' + sh.a + ' ) ENTER, and the calculator showed an error.'; },
        shared: function (r) { return find(function () { var h = r.int(8, 25); return { h: h, a: r.int(Math.ceil(h * 0.35), h - 2), who: r.pick(['Reza', 'Maya', 'Kenji', 'Hana', 'Omar']) }; }, function (v) { return safe(INV.cos(v.a / v.h), 0) && !(v.h === 15 && v.a === 9); }); },
        parts: [
          { id: 'x15a', level: 'EMG', outcome: 'G4', make: function (r, sh) {
            var q0 = rd(sh.h / sh.a, 2);
            return P.mc(r, 'Why did the calculator give an error?', [
              { html: t(fr(sh.h, sh.a) + '\\approx ' + N(q0)) + ' is more than 1. The cosine of an angle in a right triangle is always less than 1 (adj is shorter than hyp), so no angle works.', right: true },
              { html: 'The calculator is in RAD mode.', why: 'RAD mode gives a wrong <b>number</b>, not an error. Look at the size of the ratio.', code: 'z15-rad' },
              { html: 'You can’t use the inverse cosine on a fraction.', why: 'You can: cos⁻¹(adj ÷ hyp) is exactly how you find the angle.', code: 'z15-frac' },
              { html: 'The 2nd key should be pressed after cos.', why: 'The key order was fine. The problem is the ratio itself.', code: 'z15-order' }],
              t(sh.h + '\\div ' + sh.a + '\\approx ' + N(q0)) + ' is more than 1. cos θ = adj ÷ hyp, and the adj is always shorter than the hyp, so a cosine is less than 1: no angle has that cosine.', ['Is the ratio more or less than 1?'], 'calculator error');
          } },
          { id: 'x15b', level: 'PRG', outcome: 'G4', make: function (r, sh) {
            var th = INV.cos(sh.a / sh.h), o = 90 - th;
            return P.fields('Fix the work and find θ. Then find the other acute angle. (Nearest degree.)', [{ label: 'θ =', after: '°', name: 'θ' }, { label: 'Other angle =', after: '°', name: 'other' }],
              [G.angleRatioChk(th, { ratio: { fn: 'cos', num: sh.a, den: sh.h } }), G.angleRatioChk(o, { ratio: { fn: 'sin', num: sh.a, den: sh.h } })], [key(th, 0), key(o, 0)], t('\\theta\\approx ' + fx(th, 0) + '^\\circ') + ', other ' + t('\\approx ' + fx(o, 0) + '^\\circ'),
              br([t('\\cos\\theta=' + fr('\\text{adj}', '\\text{hyp}') + '=' + fr(sh.a, sh.h)) + ', ' + t('\\theta=\\cos^{-1}\\!\\left(' + fr(sh.a, sh.h) + '\\right)' + toN(th, 0) + '^\\circ'), 'Other angle: ' + t('90^\\circ-' + rawN(th) + '^\\circ' + toN(o, 0) + '^\\circ') + '. Check: ' + t('\\sin ' + fx(o, 0) + '^\\circ\\approx ' + fx(TR.sin(rd(o, 0)), 2) + '\\approx ' + fr(sh.a, sh.h)) + ' ✓ (' + sh.a + ' cm is opposite the other angle)']), ['cos θ = adj ÷ hyp: the smaller number goes on top.'], 'fix cos ratio');
          } }] }
    ]
  });
})(window);
