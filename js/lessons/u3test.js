/* Math 10-3 · Unit 3 Test (M1, M2, M3, M4, A1) — Length, Area and Surface Area: SI units and the staircase, referents,
 * imperial units and feet and inches, converting between SI and imperial (1 in = 2.54 cm exactly; 1 ft = 30.48 cm;
 * 1 yd = 0.9144 m; 1 m ≈ 3.28 ft; 1 mi ≈ 1.609 km; 1 km ≈ 0.621 mi), reading a ruler or tape measure to 1/16 in, perimeter
 * and circumference, rearranging P = 2l + 2w, C = πd, A = lw, area of 2-D shapes, composite and irregular shapes, area
 * units (1 ft² = 144 in², 1 yd² = 9 ft², 1 m² = 10 000 cm², 1 m² ≈ 10.76 ft²) and the surface area of prisms, cylinders,
 * square pyramids and cones (the slant height is always given). Built the way the Unit 1 test was built (Beginning /
 * Progressing / Mastery boxes, typed answers, keys from the generated numbers, `bad` answers with u3t- codes, worked
 * solutions and hints), with new items in the style of the booklet's review lesson (u3_l12.tex) and Practice Test 2
 * (u3_ep12.tex). Calculator allowed (π key).
 * Outcomes, tagged per part the way Unit 4 tags them: M1 = SI only; M2 = imperial units, feet and inches, and SI ↔ imperial;
 * M3 = linear measurement problems (ruler and tape readings, perimeter, circumference, cutting and fitting, fractions of an
 * inch); A1 = rearranging a formula; M4 = area and surface area. The refresher skills of Lesson 1 (mixed numbers) only
 * appear as steps inside M3 problems.
 * 27 questions / 27 parts: Beginning 10, Progressing 10, Mastery 7 — about 80 minutes (short_report.js: 1.5 / 3 / 5 min a
 * part). Every outcome has 2 Beginning and 2 Progressing parts and 1 or 2 Mastery parts. The short version (def.short)
 * keeps one part of every box of every outcome (15 parts, about 48 minutes, the least that keeps every box).
 *
 *   Beginning   — SI staircase fill-ins (3 boxes); the most reasonable SI measurement (multiple choice); imperial fill-ins
 *                 (ft → in, yd ↔ ft or miles, inches → ft and in); one imperial → SI conversion; reading two arrows on a
 *                 ruler or tape (SVG) as mixed numbers; a circumference from d or r; a one-step rearrangement (P = 4s,
 *                 A = lw, P = a + b + c); a diameter from a circumference; the area of a parallelogram, triangle,
 *                 trapezoid or circle (drawn); an irregular shape on a grid (full + part ÷ 2 squares).
 *   Progressing — a total distance in mixed SI units; cups from a jug and jugs for a party (round down / round up);
 *                 a height in feet and inches to cm (or the difference of two heights); an SI → imperial conversion; feet
 *                 and inches left on a board after two cuts; the missing sides and perimeter of an L-shaped yard; the
 *                 length of a rink from P = 2l + 2w; one length of edging as a circle (d or r) and as a square; a composite
 *                 area (a stage with a half circle, or a lawn minus a pond and deck); the surface area of a box, triangular
 *                 prism, cylinder, square pyramid or cone (drawn).
 *   Mastery     — trim lengths to buy for cut pieces, and the cost; will a van fit under a clearance sign, and by how many
 *                 cm; edging pieces and cost for a bed with a half-circle end; a fence section of boards and gaps (mixed
 *                 numbers); a dog run fenced on three sides (width from the fencing, or fencing from the area); painting a
 *                 room (walls − door − window, 2 coats, whole gallons, cost); steel for a tank's side and cone roof, and
 *                 its cost.
 * Conversions to online: "fill in the blanks" → labelled boxes; "read the arrows / write as a mixed number" → the fraction
 * keypad (2 3/4 typed with a space); feet and inches → two boxes (ft, in); "will it fit, by how much" → a yes/no box and a
 * number box; "estimate the area on the grid" → the grid is drawn with full squares dark and part squares light; "which is
 * the most reasonable" → multiple choice (Beginning only). Multi-step jobs are one Mastery part with 2–3 boxes, and a later
 * box is marked against the student's own earlier box (a slip doesn't snowball).
 * Partial credit: a recognized slip keeps 2/3 ('s'), a bigger but reasonable mistake keeps 1/3 ('b'), see HW.addPartial
 * below; in a set of 3+ boxes one wrong box is small ('u3t-one-box'); using 3.14 for π (when it changes the rounded answer),
 * not simplifying, too many or too few decimals and an improper fraction where a mixed number is asked are "right value,
 * wrong form" nudges.
 *
 * Also exports HW.u3assess, the assessment kit used by the Unit 3 exit slips (js/exits/u3.js loads after this file). It
 * needs only the shared engine (core, expr, kit, kitx, geom), not the Unit 3 practice files. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u3assess = {};
  var PI = Math.PI;

  /* ================= the booklet's facts (u3_l05.tex lines 9–14, u3_l08.tex line 274, u3_l12.tex summary) ================= */
  var F = A.F = { in_cm: 2.54, in_mm: 25.4, ft_cm: 30.48, ft_m: 0.3048, yd_m: 0.9144, m_ft: 3.28, m_in: 39.37, mi_km: 1.609, km_mi: 0.621,
    ft_in: 12, yd_ft: 3, yd_in: 36, mi_ft: 5280, mi_yd: 1760, ft2_in2: 144, yd2_ft2: 9, m2_cm2: 10000, m2_ft2: 10.76 };

  /* ================= keypad: fractions and mixed numbers ================= */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u3mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u3mixed = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }], [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u3mixed = ['Fraction: type the top number, press <b><sup>a</sup>⁄<sub>b</sub></b>, then the bottom number. Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then the top and bottom numbers. Press <b>▶</b> to move on.',
      'Type a fraction as <code>3/16</code> and a mixed number as <code>2 3/16</code> (a space between the whole number and the fraction).'];
  }

  /* ================= numbers ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) <= (e == null ? 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : e); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }                          // TeX: 10\,000
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? s.replace(/^(\d+)(\d{3})/, '$1 $2') : s; }   // text: 10 000
  function raw(x, k) { var s = +x.toFixed(k == null ? 4 : k); return N(s) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function eqR(x, dp) { return dp == null || near(x, rd(x, dp), 1e-9) ? '=' + N(dp == null ? q(x) : rd(x, dp)) : '=' + raw(x, dp + 2) + '\\approx ' + N(rd(x, dp), dp); }
  function c2(x) { return rd(x, 2).toFixed(2); }
  function Mt(x) { return '\\$' + c2(x); }
  function MM(x) { return t(Mt(x)); }
  function eqM(x) { return near(x, rd(x, 2), 1e-7) ? '=\\$' + c2(x) : '=' + raw(x, 4) + '\\approx\\$' + c2(x); }
  function uT(u) { u = String(u || ''); if (!u) return ''; var m = /^(.*?)([²³])$/.exec(u); return m ? '\\text{ ' + m[1] + '}^' + (m[2] === '²' ? 2 : 3) : '\\text{ ' + u + '}'; }
  function L(x, u, dp) { return t(N(x, dp) + uT(u)); }
  function find(gen, test, fb) { for (var i = 0; i < 900; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u3 assessment: no valid numbers'); return fb; }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function placeWord(dp, money) { return money ? 'the cent (2 decimal places)' : dp === 0 ? 'the nearest whole number' : dp === 1 ? 'the nearest tenth' : dp === 2 ? 'the nearest hundredth' : dp + ' decimal places'; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'], ['Devon', 'm'], ['Rosa', 'f'],
    ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f'], ['Ravi', 'm'], ['Ines', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  function people(r, k) { var out = []; while (out.length < k) out.push(person(r, out.map(function (p) { return p.n; }))); return out; }
  Object.assign(A, { rd: rd, q: q, near: near, nS: nS, N: N, Np: Np, raw: raw, eqR: eqR, c2: c2, Mt: Mt, MM: MM, eqM: eqM, uT: uT, L: L, find: find, br: br, cap: cap, pickR: pickR, placeWord: placeWord, person: person, people: people });

  /* ================= fractions ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function R(p, d) { var g = gcd(p, d) || 1; return [p / g, d / g]; }
  function fv(fr) { return fr[0] / fr[1]; }
  function frOf(x, maxD) { for (var d = 1; d <= (maxD || 64); d++) { var p = Math.round(x * d); if (near(p / d, x, 1e-9)) return R(p, d); } return null; }
  function mixT(fr) { var p = fr[0], d = fr[1], w = Math.floor(p / d + 1e-9), n = p - w * d; if (!n) return String(w); return (w ? w : '') + '\\frac{' + n + '}{' + d + '}'; }
  function mixD(fr) { return mixT(fr).replace('\\frac', '\\tfrac'); }
  function frT(fr) { return fr[1] === 1 ? String(fr[0]) : '\\frac{' + fr[0] + '}{' + fr[1] + '}'; }
  function mixP(fr) { var p = fr[0], d = fr[1], w = Math.floor(p / d + 1e-9), n = p - w * d; if (!n) return String(w); return (w ? w + ' ' : '') + n + '/' + d; }
  var UNI = { '1/2': '½', '1/4': '¼', '3/4': '¾', '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞' };
  function mixU(fr) { var p = fr[0], d = fr[1], w = Math.floor(p / d + 1e-9), n = p - w * d; if (!n) return String(w); var u = UNI[n + '/' + d]; return u ? (w ? w : '') + u : (w ? w + ' ' : '') + n + '/' + d; } // text (SVG labels)
  function xT(x) { var fr = frOf(x, 16); return fr && fr[1] > 1 && fr[1] <= 16 ? mixD(fr) : N(x); }   // a length as a mixed number when it is one
  function xU(x) { var fr = frOf(x, 16); return fr && fr[1] > 1 && fr[1] <= 16 ? mixU(fr) : Np(x); }
  /* a typed mixed number / fraction / decimal: { ok, kind: 'mixed' | 'frac' | 'dec' | 'whole', v, w, n, d } or { empty } */
  function readMix(resp) {
    var s = String(resp == null ? '' : resp).replace(/[⁄∕]/g, '/').replace(/\\[dt]frac/g, '\\frac').replace(/\\left|\\right/g, '').replace(/\\[,;: !]|~/g, ' ').replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').trim();
    /* every MathLive fraction form (\frac{5}{16}, \frac5{16}, \frac{5}6, \frac14) becomes " 5/16 ", as HW.u3len.readMix (js/lessons/u3l1.js) does;
       copied here so the test does not need the lesson kits */
    s = s.replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '').replace(/\\frac\s*(?:\{\s*(\d+)\s*\}|(\d))\s*(?:\{\s*(\d+)\s*\}|(\d))/g, function (m0, a1, a2, b1, b2) { return ' ' + (a1 || a2) + '/' + (b1 || b2) + ' '; }).replace(/[\u00a0\u2009\u202f]/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/\s*(inches|inch|in|feet|foot|ft|yards?|yd|cups?|''|"|″|”|′′)\.?\s*$/i, '').trim();
    if (!s) return { empty: true };
    var m = /^(\d+)\s*\\frac\s*\{\s*(\d+)\s*\}\s*\{\s*(\d+)\s*\}$/.exec(s) || /^(\d+)\s*\\frac(\d)(\d)$/.exec(s) || /^(\d+)\s*[- ]\s*(\d+)\s*\/\s*(\d+)$/.exec(s) || /^(\d+)\s*\+\s*(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (m) { var d = +m[3]; if (!d) return { ok: false }; return { ok: true, kind: 'mixed', w: +m[1], n: +m[2], d: d, v: +m[1] + m[2] / d }; }
    m = /^\\frac\s*\{\s*(\d+)\s*\}\s*\{\s*(\d+)\s*\}$/.exec(s) || /^\\frac(\d)(\d)$/.exec(s) || /^(\d+)\s*\/\s*(\d+)$/.exec(s);
    if (m) { var d2 = +m[2]; if (!d2) return { ok: false }; return { ok: true, kind: 'frac', n: +m[1], d: d2, v: m[1] / d2 }; }
    var c = s.replace(/\s/g, ''); if (/^\d{1,3}(,\d{3})+(\.\d*)?$/.test(c)) c = c.replace(/,/g, '');
    if (/^\d+(\.\d*)?$|^\.\d+$/.test(c)) return { ok: true, kind: /\./.test(c) ? 'dec' : 'whole', v: Number(c) };
    return { ok: false };
  }
  Object.assign(A, { gcd: gcd, R: R, fv: fv, frOf: frOf, mixT: mixT, mixD: mixD, frT: frT, mixP: mixP, mixU: mixU, xT: xT, xU: xU, readMix: readMix });

  /* ================= reading and checking a number ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\\$|\$/g, '').replace(/\\[,;: ]|~/g, ' ').replace(/[²³]/g, '').replace(/\^\{?[23]\}?/g, '').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/"'′″][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u3t-comma', 'Use a decimal point (not a comma), like 12.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) { var mx = readMix(resp); if (mx.ok && (mx.kind === 'mixed' || mx.kind === 'frac')) return { frac: true, v: mx.v }; return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') }; }
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  /* one number. o: { dp (null = exact), alts (other right values), diag [{v, code, hint}], money, word, exact (for rounding
   * direction), p314 (the value with π = 3.14: a nudge when it rounds differently), miss (hint for any other value) } */
  function numChk(ans, o) {
    o = o || {};
    var dp = o.dp != null ? o.dp : o.money ? 2 : null, ex0 = dp == null, step = ex0 ? 0 : Math.pow(10, -dp), tol = ex0 ? 0 : step / 20, money = !!o.money, word = o.word || placeWord(dp, money);
    var exact = o.exact != null ? o.exact : ans;
    var acc = [ex0 ? q(ans) : rd(ans, dp)].concat((o.alts || []).map(function (a) { return ex0 ? q(a) : rd(a, dp); }));
    function isAcc(v) { return acc.some(function (y) { return ex0 ? near(v, y, 1e-7 * Math.max(1, Math.abs(y))) : Math.abs(v - y) <= tol; }); }
    var dg = (o.diag || []).filter(function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(ex0 ? m.v : rd(m.v, dp)); });
    var p314 = o.p314 != null && !isAcc(ex0 ? o.p314 : rd(o.p314, dp)) ? o.p314 : null;
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (a.frac) { if (isAcc(ex0 ? a.v : rd(a.v, dp)) || near(a.v, ans, 1e-9)) return form('u3t-as-decimal', 'Right value — now write it as a decimal' + (ex0 ? '' : ', rounded to ' + word) + '.'); return wrong('value', o.miss || null); }
      var v = a.v, d = a.d;
      if (isAcc(v)) return ok();
      if (!ex0 && d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      if (p314 != null && (ex0 ? Math.abs(v - p314) < Math.max(0.006, 1e-4 * Math.abs(p314)) : near(rd(v, Math.min(d, dp)), rd(p314, Math.min(d, dp)), 1e-9) && d >= dp)) return form('u3t-pi', 'Use the <b>π key</b> on your calculator, not 3.14: 3.14 is only close to π, and here it changes the answer.');
      var i, m;
      for (i = 0; i < dg.length; i++) { m = dg[i]; if (ex0 ? near(v, m.v, 1e-7 * Math.max(1, Math.abs(m.v))) || (d >= 1 && near(v, rd(m.v, d), 1e-9) && !near(m.v, rd(m.v, d), 1e-9)) : near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint); }
      if (!ex0 && d < dp && acc.some(function (y) { var fct = Math.pow(10, d); return near(v, Math.round(y * fct) / fct, 1e-9) || near(v, Math.floor(y * fct + 1e-7) / fct, 1e-9); }))
        return form('u3t-places', money ? 'Give money to the cent (2 decimal places).' : 'Round to ' + word + '.');
      if (!ex0) for (i = 0; i < dg.length; i++) { m = dg[i]; if (d < dp && near(v, rd(m.v, d), 1e-9)) return wrong(m.code, m.hint); }
      if (!ex0 && d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u3t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
    f.bad = dg; f.isAcc = isAcc;
    return f;
  }
  function keyOf(ans, o) { o = o || {}; return o.money ? c2(ans) : o.dp == null ? nS(ans) : nS(rd(ans, o.dp)); }
  /* a number part: o as numChk plus before, after (unit shown after the box), unit (for the answer), sol, hints, text */
  function numPart(prompt, ans, o) {
    o = o || {};
    var chk = numChk(ans, o), key = keyOf(ans, o), u = o.unit != null ? o.unit : o.after;
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after }, check: chk, key: key, answer: t((o.money ? '\\$' : '') + N(Number(key), o.money ? 2 : null) + uT(o.money ? '' : u)),
      solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = chk.bad.map(function (m) { return keyOf(m.v, o); }).filter(function (b, i, arr) { return b !== key && arr.indexOf(b) === i && !chk.isAcc(Number(b)); });
    p.good = o.money ? ['$' + key] : u ? [key + ' ' + String(u).replace(/[²³]/, '')] : [];
    return p;
  }
  /* a mixed number (or fraction) answer: fr = [p, q] in lowest terms. o: { want 'mixed' | 'improper', diag [{v, code, hint}], miss } */
  function mixChk(fr, o) {
    o = o || {}; var T = fv(fr), want = o.want || 'mixed', what = want === 'improper' ? 'an improper fraction' : 'a mixed number';
    var dg = (o.diag || []).filter(function (m) { return m && m.v != null && isFinite(m.v) && !near(m.v, T, 1e-9); });
    var f = function (resp) {
      var a = readMix(resp);
      if (a.empty) return form('empty', 'Type your answer first.');
      if (!a.ok) return form('notnumber', want === 'improper' ? 'Write a fraction like 11/4.' : 'Write a mixed number like 2 3/4 (the whole number, a space, then the fraction).');
      if (near(a.v, T, 1e-9)) {
        if (a.kind === 'whole') return fr[1] === 1 ? ok() : wrong('value', null);
        if (a.kind === 'dec') return fr[1] === 1 ? ok() : form('u3t-as-fraction', 'Right value — now write it as ' + what + ' (tape measures and plans use fractions).');
        if (a.kind === 'mixed') {
          if (want === 'improper') return form('u3t-want-improper', 'Right value — now write it as an <b>improper fraction</b> (the top bigger than the bottom).');
          if (a.n >= a.d) return form('u3t-mixed-improper', 'Right value — but the fraction part must be less than 1: take another whole out of it.');
          if (!a.n) return ok();
          if (gcd(a.n, a.d) > 1) return form('u3t-lowest', 'Right value — now simplify the fraction part: divide its top and bottom by ' + t(gcd(a.n, a.d)) + '.');
          return ok();
        }
        if (gcd(a.n, a.d) > 1) return form('u3t-lowest', 'Right value — now write it in simplest form: divide the top and bottom by ' + t(gcd(a.n, a.d)) + '.');
        if (want === 'mixed' && a.n > a.d) return form('u3t-want-mixed', 'Right value — now write it as a <b>mixed number</b>: divide the top by the bottom; the remainder goes over the same bottom.');
        return ok();
      }
      for (var i = 0; i < dg.length; i++) if (near(a.v, dg[i].v, 1e-9)) return wrong(dg[i].code, dg[i].hint);
      if (a.kind === 'dec' && Math.abs(a.v - T) < 0.01) return wrong('u3t-dec-close', 'That decimal is close, but not exact. Give the exact answer as ' + what + '.');
      return wrong('value', o.miss || null);
    };
    f.bad = dg;
    return f;
  }
  function mixPart(prompt, fr, o) {
    o = o || {};
    var chk = mixChk(fr, o), key = o.want === 'improper' ? frT(fr) : mixT(fr);
    var p = { prompt: prompt, input: { type: 'math', keys: 'u3mixed', before: o.before, after: o.after, placeholder: o.want === 'improper' ? 'e.g. 11/4' : 'e.g. 2 3/4' }, check: chk, key: key,
      answer: t((o.want === 'improper' ? frT(fr) : mixT(fr)) + uT(o.unit != null ? o.unit : o.after)), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = chk.bad.map(function (m) { var g = frOf(m.v); return g ? mixP(g) : nS(m.v); }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    p.good = [o.want === 'improper' ? fr[0] + '/' + fr[1] : mixP(fr)];
    return p;
  }
  Object.assign(A, { readNum: readNum, numChk: numChk, numPart: numPart, keyOf: keyOf, mixChk: mixChk, mixPart: mixPart });

  /* ================= several boxes ================= */
  /* Grading: all right → correct; one box wrong → its own code if it is a recognized mistake, else 'u3t-one-box' (small)
   * in a set of 3 or more and 'u3t-half-box' (bigger) in a set of 2 — but in a fill-in set (fill: separate little
   * questions, like "fill in the blanks") one wrong box of 3 or more is always 'u3t-one-box'; several wrong boxes with the
   * same recognized mistake → that code; otherwise 'u3t-many-box'. A box can follow on from an earlier one: spec.from(vals)
   * gives the value it should have from the numbers the student typed before it (a slip doesn't snowball). */
  function multiChk(specs, labels, fill) {
    return function (resp) {
      resp = resp || [];
      var vals = [], res = [], lab = function (i) { return '<b>' + labels[i] + ':</b> '; };
      specs.forEach(function (s, i) {
        var x = resp[i] == null ? '' : resp[i], r1 = s.chk(x);
        var rn = readNum(x); vals.push(rn.res ? NaN : rn.v);
        if (r1.v !== 'correct' && s.from && i > 0) { var want = s.from(vals); if (want != null && isFinite(want) && isFinite(vals[i]) && Math.abs(vals[i] - want) <= (s.ftol != null ? s.ftol : 0.006)) r1 = { v: 'follow' }; }
        res.push(r1);
      });
      var wi = [], fi = [], roots = 0;
      res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); else if (x.v === 'follow') roots++; });
      if (!wi.length && !fi.length) return ok();
      if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lab(fi[0]) + (f0.hint || 'Check this one again.')); }
      var w0 = res[wi[0]], hint = lab(wi[0]) + (w0.hint || 'Check this one again.');
      if (wi.length === 1) {
        if (fill && res.length >= 3) return wrong('u3t-one-box', hint);
        if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
        return wrong(res.length >= 3 ? 'u3t-one-box' : 'u3t-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
      return wrong('u3t-many-box', hint);
    };
  }
  /* specs: [{label, name, before, after, mode ('math' for a fraction box), ph, chk, key, show, bad: [values as strings], from, ftol}] */
  function fieldsPart(prompt, specs, sol, hints, text, fill) {
    var labels = specs.map(function (s) { return String(s.name || s.label || '').replace(/:$/, '').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s) { return { label: s.label, name: labels[specs.indexOf(s)], before: s.before, after: s.after, mode: s.mode, keys: s.mode === 'math' ? 'u3mixed' : undefined, placeholder: s.ph, wide: s.mode === 'text' }; }) },
      check: multiChk(specs, labels, fill), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return (s.label ? s.label + ' ' : '') + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    // wrong answers for the checks: the first box a recognized mistake (the others right); the first box way off
    p.bad = [];
    specs.forEach(function (s, i) { var b = (s.bad || []).filter(function (x) { return x !== String(s.key); })[0]; if (b != null && !s.from) { var arr = specs.map(function (z) { return String(z.key); }); arr[i] = b; if (i === 0 || !specs.slice(i + 1).some(function (z) { return z.from; })) p.bad.push(arr); } });
    if (!p.bad.length) p.bad.push(specs.map(function (s, i) { return i === 0 ? '99999' : String(s.key); }));
    return p;
  }
  /* one box of a fields part from numChk options */
  function nfld(label, ans, o) {
    o = o || {}; var chk = numChk(ans, o), key = keyOf(ans, o);
    return { label: label, name: o.name, before: o.money ? '$' : o.before, after: o.after, chk: chk, key: key, show: t((o.money ? '\\$' : '') + N(Number(key), o.money ? 2 : null) + uT(o.money ? '' : (o.unit != null ? o.unit : o.after))),
      bad: chk.bad.map(function (m) { return keyOf(m.v, o); }).filter(function (b) { return b !== key && !chk.isAcc(Number(b)); }), from: o.from, ftol: o.ftol };
  }
  function mfld(label, fr, o) {
    o = o || {}; var chk = mixChk(fr, o);
    return { label: label, name: o.name, after: o.after, mode: 'math', ph: 'e.g. 2 3/4', chk: chk, key: mixT(fr), show: t(mixT(fr) + uT(o.unit != null ? o.unit : o.after)), bad: chk.bad.map(function (m) { var g = frOf(m.v); return g ? mixP(g) : nS(m.v); }) };
  }
  /* yes / no */
  function yesNo(s) {
    var w = ' ' + String(s == null ? '' : s).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[’']/g, '').replace(/[.,!:;()]/g, ' ') + ' ';
    if (!w.trim()) return 'empty';
    var no = /\s(no|n|nope|not|wont|doesnt|cannot|cant|nah)\s/.test(w), yes = /\s(yes|y|yep|yeah|yup|fits?|will|ok|sure)\s/.test(w);
    return no ? 'no' : yes ? 'yes' : 'none';
  }
  /* "Will it fit? By how much?": a yes/no box + a number box. The number decides the credit: right number, wrong choice →
   * 'u3t-which' (bigger). o: { yes (the right answer is yes), label, amt (numChk), key, show, after, sol, hints, text } */
  function yesAmtPart(prompt, o) {
    var check = function (resp) {
      resp = resp || []; var w = yesNo(resp[0]), a = o.amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.label + '</b> Type yes or no.');
      if (w === 'none') return form('yes-no', '<b>' + o.label + '</b> Type yes or no.');
      if (a.v === 'form') return form(a.code, '<b>By how much:</b> ' + (a.hint || 'Check the format.'));
      var right = (w === 'yes') === !!o.yes;
      if (right && a.v === 'correct') return ok();
      if (!right && a.v === 'correct') return wrong('u3t-which', o.why);
      return wrong(a.code || 'value', '<b>By how much:</b> ' + (a.hint || o.miss || 'Change both to the same unit, then subtract.'));
    };
    var yk = o.yes ? 'yes' : 'no', key = [yk, o.key];
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label, name: 'Yes or no', mode: 'text', placeholder: 'yes or no', wide: true }, { label: 'By how much:', name: 'By how much', after: o.after }] },
      check: check, key: key, answer: o.label + ' <b>' + yk + '</b><br>By how much: ' + o.show, solution: o.sol, hints: o.hints || [], text: o.text,
      bad: [[o.yes ? 'no' : 'yes', o.key]].concat((o.amt.bad || []).map(function (m) { return [yk, keyOf(m.v, { dp: o.dp })]; }).filter(function (b) { return b[1] !== o.key; })),
      good: [[o.yes ? 'Yes, it fits' : 'No', o.key]] };
  }
  /* feet and inches in two boxes. T = total inches (a multiple of 1/16). o: { diag [{v (total inches), code, hint}], frac (the inches
   * box takes fractions), miss } */
  function ftinChk(T, o) {
    o = o || {}; var dg = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !near(m.v, T, 1e-9); });
    return function (resp) {
      resp = resp || [];
      var fs = String(resp[0] == null ? '' : resp[0]).trim(), is = String(resp[1] == null ? '' : resp[1]).trim();
      if (!fs || !is) return form('empty', 'Fill in both boxes (write 0 if there are no ' + (!fs ? 'feet' : 'inches') + ').');
      var f = readNum(fs), i = readMix(is);
      if (f.res || f.frac) return form('notnumber', '<b>Feet:</b> enter a whole number of feet.');
      if (!i.ok) return form('notnumber', '<b>Inches:</b> enter a number of inches' + (o.frac ? ', like 6 1/2.' : '.'));
      var tot = 12 * f.v + i.v;
      if (near(tot, T, 1e-9)) {
        if (Math.abs(f.v - Math.round(f.v)) > 1e-9) return form('u3t-whole-ft', 'Right length — give the feet as a whole number and the rest in inches.');
        if (i.v >= 12 - 1e-9) return form('u3t-regroup', 'Right length — but the inches part must be less than 12: trade 12 in for 1 ft.');
        if (i.kind === 'mixed' && i.n >= i.d) return form('u3t-mixed-improper', '<b>Inches:</b> the fraction part must be less than 1.');
        if ((i.kind === 'mixed' || i.kind === 'frac') && i.n && gcd(i.n, i.d) > 1) return form('u3t-lowest', '<b>Inches:</b> simplify the fraction.');
        return ok();
      }
      for (var k = 0; k < dg.length; k++) if (near(tot, dg[k].v, 1e-9)) return wrong(dg[k].code, dg[k].hint);
      return wrong('value', o.miss || null);
    };
  }
  function ftinKey(T) { var f = Math.floor(T / 12 + 1e-9), i = q(T - 12 * f), fr = frOf(i, 16); return [String(f), fr && fr[1] > 1 ? mixT(fr) : nS(i)]; }
  function ftinT(T) { var k = ftinKey(T); return k[0] + "'\\," + k[1] + "''"; }
  function ftinPart(prompt, T, o) {
    o = o || {}; var k = ftinKey(T), chk = ftinChk(T, o);
    var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label || '', name: 'Feet', after: 'ft' }, { name: 'Inches', after: 'in', mode: o.frac ? 'math' : undefined, keys: o.frac ? 'u3mixed' : undefined, placeholder: o.frac ? 'e.g. 6 1/2' : undefined }] },
      check: chk, key: k, answer: t(ftinT(T)) + ' &nbsp;(' + k[0] + ' ft ' + t(k[1]) + ' in)', solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && m.v >= 0 && !near(m.v, T, 1e-9); }).map(function (m) { var kk = ftinKey(m.v); return [kk[0], kk[1].replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/, '$1 $2/$3').replace(/^\\frac\{(\d+)\}\{(\d+)\}$/, '$1/$2')]; });
    p.good = [[k[0], k[1].replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/, '$1 $2/$3').replace(/^\\frac\{(\d+)\}\{(\d+)\}$/, '$1/$2')]];
    if (Number(k[0]) >= 1 && T - 12 * Number(k[0]) < 1e-9) p.good.push([String(Number(k[0]) - 1), '12']); // 7 ft 12 in is right length, wrong form: not in good
    p.good = p.good.filter(function (g) { return chk(g).v === 'correct'; });
    return p;
  }
  function mcPart(r, prompt, opts, sol, hints, text) { return P.mc(r, prompt, opts, sol, hints || [], text); }
  Object.assign(A, { multiChk: multiChk, fieldsPart: fieldsPart, nfld: nfld, mfld: mfld, yesNo: yesNo, yesAmtPart: yesAmtPart, ftinChk: ftinChk, ftinKey: ftinKey, ftinT: ftinT, ftinPart: ftinPart, mcPart: mcPart });

  /* ================= drawings (SVG; labels are plain text) ================= */
  var INK = '#2b3340', SOFT = '#f5ecdf', ACC = '#9a6a24';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function sTxt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + (o.bold ? ' font-weight="700"' : '') +
      (o.halo === false ? '' : ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round"') + '>' + esc(s) + '</text>';
  }
  function svgWrap(w, h, s, aria) { return '<svg viewBox="0 0 ' + Math.ceil(w) + ' ' + Math.ceil(h) + '" width="100%" style="max-width:' + Math.ceil(w) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(aria || 'diagram') + '">' + s + '</svg>'; }
  /* a ruler (white) or tape measure (yellow) from whole inch a to b. o: { a, b, tape, marks: [{x, lab}], objs: [{x1, x2, lab}] } */
  function tapeSvg(o) {
    var a = o.a, b = o.b, ppi = o.ppi || Math.min(92, Math.floor(480 / (b - a))), tape = !!o.tape, objs = o.objs || [], marks = o.marks || [];
    var padL = 18, padR = 22, T = objs.length ? 16 + 30 * objs.length : marks.length ? 50 : 12, Hb = 52;
    var X = function (x) { return padL + (x - a) * ppi; }, Wd = X(b) + padR, Ht = T + Hb + 6, s = '';
    var left = X(a) - (tape && a === 0 ? 0 : 9), right = X(b) + 9;
    if (tape && a === 0) s += '<rect x="' + (X(0) - 6) + '" y="' + (T - 4) + '" width="6" height="' + (Hb + 8) + '" fill="#9aa0a8" stroke="' + INK + '" stroke-width="1.2"/>';
    s += '<rect x="' + left.toFixed(1) + '" y="' + T + '" width="' + (right - left).toFixed(1) + '" height="' + Hb + '" fill="' + (tape ? '#fbeea6' : '#ffffff') + '" stroke="' + INK + '" stroke-width="1.6"/>';
    for (var k = Math.round(a * 16); k <= Math.round(b * 16); k++) {
      var x = X(k / 16), h = k % 16 === 0 ? 30 : k % 8 === 0 ? 23 : k % 4 === 0 ? 17 : k % 2 === 0 ? 12 : 8, w = k % 16 === 0 ? 1.7 : k % 8 === 0 ? 1.4 : k % 4 === 0 ? 1.2 : 0.9;
      s += '<line x1="' + x.toFixed(2) + '" y1="' + T + '" x2="' + x.toFixed(2) + '" y2="' + (T + h) + '" stroke="' + INK + '" stroke-width="' + w + '"/>';
    }
    for (var i = Math.ceil(a); i <= b; i++) {
      var xi = X(i), red = tape && i > 0 && i % 16 === 0;
      if (red) s += '<rect x="' + (xi - 10).toFixed(1) + '" y="' + (T + 33) + '" width="20" height="15" rx="2" fill="#b3261e"/>';
      s += sTxt(xi, T + 41, String(i), { size: 13, bold: true, color: red ? '#fff' : INK, halo: false });
      if (tape && i > 0 && i % 12 === 0) s += '<rect x="' + (xi + 11).toFixed(1) + '" y="' + (T + 36) + '" width="19" height="12" fill="#111"/>' + sTxt(xi + 20.5, T + 42, (i / 12) + 'F', { size: 9, bold: true, color: '#fff', halo: false });
    }
    marks.forEach(function (m) {
      var xm = X(m.x);
      s += '<line x1="' + xm.toFixed(1) + '" y1="' + (T - 26) + '" x2="' + xm.toFixed(1) + '" y2="' + (T - 7) + '" stroke="' + ACC + '" stroke-width="2"/>';
      s += '<polygon points="' + (xm - 5).toFixed(1) + ',' + (T - 9) + ' ' + (xm + 5).toFixed(1) + ',' + (T - 9) + ' ' + xm.toFixed(1) + ',' + (T - 1) + '" fill="' + ACC + '"/>';
      s += sTxt(xm, T - 37, m.lab, { size: 14, bold: true, color: ACC });
    });
    objs.forEach(function (ob, j) {
      var y = T - 30 * (j + 1), x1 = X(ob.x1), x2 = X(ob.x2);
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + (y + 20) + '" x2="' + x1.toFixed(1) + '" y2="' + T + '" stroke="#8a8f99" stroke-width="1" stroke-dasharray="3 3"/><line x1="' + x2.toFixed(1) + '" y1="' + (y + 20) + '" x2="' + x2.toFixed(1) + '" y2="' + T + '" stroke="#8a8f99" stroke-width="1" stroke-dasharray="3 3"/>';
      s += '<rect x="' + x1.toFixed(1) + '" y="' + y + '" width="' + (x2 - x1).toFixed(1) + '" height="20" rx="3" fill="#e4dccd" stroke="' + INK + '" stroke-width="1.2"/>' + sTxt((x1 + x2) / 2, y + 10, ob.lab, { size: 12, halo: false });
    });
    return svgWrap(Wd, Ht, s, tape ? 'tape measure' : 'ruler');
  }
  function arcPts(cx, cy, r, a0, a1, n) { n = n || 28; var out = []; for (var i = 0; i <= n; i++) { var an = (a0 + (a1 - a0) * i / n) * PI / 180; out.push([cx + r * Math.cos(an), cy + r * Math.sin(an)]); } return out; }
  /* a flat figure from items in math coordinates (y up): {k: 'poly', pts, fill, dash, sw, open} {k: 'line', a, b, dash, color}
   * {k: 'circle', c, r, fill} {k: 'dot', at} {k: 'right', at, u, v} {k: 'text', at, s, dx, dy, anchor, color, bold} */
  function fig2(items, o) {
    o = o || {}; var maxW = o.w || 300, maxH = o.h || 220, pad = o.pad == null ? 36 : o.pad, xs = [], ys = [];
    items.forEach(function (it) { (it.pts || []).concat(it.a ? [it.a, it.b] : []).concat(it.k !== 'text' && it.at ? [it.at] : []).forEach(function (p) { xs.push(p[0]); ys.push(p[1]); }); if (it.c) { xs.push(it.c[0] - it.r, it.c[0] + it.r); ys.push(it.c[1] - it.r, it.c[1] + it.r); } });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var sx = Math.max(x1 - x0, 1e-6), sy = Math.max(y1 - y0, 1e-6), sc = Math.min((maxW - 2 * pad) / sx, (maxH - 2 * pad) / sy);
    var Wd = sx * sc + 2 * pad, Ht = sy * sc + 2 * pad, X = function (x) { return pad + (x - x0) * sc; }, Y = function (y) { return pad + (y1 - y) * sc; }, s = '';
    var pp = function (pts) { return pts.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' '); };
    items.forEach(function (it) {
      if (it.k === 'poly') s += '<' + (it.open ? 'polyline' : 'polygon') + ' points="' + pp(it.pts) + '" fill="' + (it.open ? 'none' : it.fill || SOFT) + '" stroke="' + (it.color || INK) + '" stroke-width="' + (it.sw || 2) + '" stroke-linejoin="round"' + (it.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
      else if (it.k === 'circle') s += '<circle cx="' + X(it.c[0]).toFixed(1) + '" cy="' + Y(it.c[1]).toFixed(1) + '" r="' + (it.r * sc).toFixed(1) + '" fill="' + (it.fill || SOFT) + '" stroke="' + INK + '" stroke-width="' + (it.sw || 2) + '"/>';
      else if (it.k === 'line') s += '<line x1="' + X(it.a[0]).toFixed(1) + '" y1="' + Y(it.a[1]).toFixed(1) + '" x2="' + X(it.b[0]).toFixed(1) + '" y2="' + Y(it.b[1]).toFixed(1) + '" stroke="' + (it.color || INK) + '" stroke-width="' + (it.sw || 1.6) + '"' + (it.dash ? ' stroke-dasharray="5 4"' : '') + ' stroke-linecap="round"/>';
      else if (it.k === 'dot') s += '<circle cx="' + X(it.at[0]).toFixed(1) + '" cy="' + Y(it.at[1]).toFixed(1) + '" r="2.8" fill="' + INK + '"/>';
      else if (it.k === 'right') { var c = [X(it.at[0]), Y(it.at[1])], u = [it.u[0], -it.u[1]], v = [it.v[0], -it.v[1]], k = 9; s += '<polyline points="' + [c[0] + u[0] * k, c[1] + u[1] * k, c[0] + (u[0] + v[0]) * k, c[1] + (u[1] + v[1]) * k, c[0] + v[0] * k, c[1] + v[1] * k].map(function (z) { return z.toFixed(1); }).join(' ') + '" fill="none" stroke="' + INK + '" stroke-width="1.2"/>'; }
    });
    items.forEach(function (it) { if (it.k === 'text') s += sTxt(X(it.at[0]) + (it.dx || 0), Y(it.at[1]) + (it.dy || 0), it.s, { anchor: it.anchor, color: it.color, bold: it.bold, size: it.size }); });
    return svgWrap(Wd, Ht, s, o.aria);
  }
  /* a grid (cols × rows) with cells: 1 full (dark), 2 part (light) */
  function gridSvg(cells, cols, rows, o) {
    o = o || {}; var cs = o.cs || 26, pad = 8, s = '';
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { var c = cells[y * cols + x]; if (c) s += '<rect x="' + (pad + x * cs) + '" y="' + (pad + y * cs) + '" width="' + cs + '" height="' + cs + '" fill="' + (c === 1 ? '#6f9fc4' : '#cfe2f1') + '"/>'; }
    for (var i = 0; i <= cols; i++) s += '<line x1="' + (pad + i * cs) + '" y1="' + pad + '" x2="' + (pad + i * cs) + '" y2="' + (pad + rows * cs) + '" stroke="#8a8f99" stroke-width="1"/>';
    for (var j = 0; j <= rows; j++) s += '<line x1="' + pad + '" y1="' + (pad + j * cs) + '" x2="' + (pad + cols * cs) + '" y2="' + (pad + j * cs) + '" stroke="#8a8f99" stroke-width="1"/>';
    return svgWrap(cols * cs + 2 * pad, rows * cs + 2 * pad, s, 'shape on a grid');
  }
  function solid(kind, opt) { return '<div style="margin:6px 0">' + HW.solid(kind, opt) + '</div>'; }
  function table(head, rows) {
    var td = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em"><tr>' + head.map(function (h) { return '<th ' + td + '>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c) { return '<td ' + td + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  Object.assign(A, { tapeSvg: tapeSvg, fig2: fig2, arcPts: arcPts, gridSvg: gridSvg, solid: solid, table: table, esc: esc });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u3t-comma': 'Comma instead of a decimal point', 'u3t-places': 'Not rounded to the place asked', 'u3t-round-dir': 'Rounded the wrong way', 'u3t-pi': 'Used 3.14 instead of the π key',
    'u3t-as-decimal': 'Fraction where a decimal was asked', 'u3t-as-fraction': 'Decimal where a fraction was asked', 'u3t-dec-close': 'A rounded decimal instead of the exact fraction', 'u3t-lowest': 'Fraction not in simplest form',
    'u3t-want-mixed': 'Improper fraction instead of a mixed number', 'u3t-want-improper': 'Mixed number instead of an improper fraction', 'u3t-mixed-improper': 'Mixed number with an improper fraction part',
    'u3t-regroup': '12 or more inches not regrouped as a foot', 'u3t-whole-ft': 'Feet not a whole number', 'u3t-which': 'Right amount, wrong (or unclear) choice',
    'u3t-one-box': 'One box of several wrong', 'u3t-half-box': 'One of the two boxes wrong', 'u3t-many-box': 'Several boxes wrong',
    'u3t-si-steps': 'SI: moved the decimal point the wrong number of places', 'u3t-si-dir': 'SI: moved the decimal point the wrong way', 'u3t-no-convert': 'Did not change to the same unit first', 'u3t-unit-ans': 'Right amount in another unit',
    'u3t-one-lap': 'Counted one lap only', 'u3t-round-up-cut': 'Rounded up a number you can cut or fill', 'u3t-round-down': 'Rounded down a number you must buy', 'u3t-total-len': 'Total length ÷ length of one piece (ignored the leftover)', 'u3t-gave-per': 'Gave the pieces per length instead of the lengths to buy',
    'u3t-imp-10': 'Used 10 or 100 instead of an imperial factor (12, 3, 5280)', 'u3t-imp-dir': 'Imperial: multiplied instead of dividing (or the reverse)', 'u3t-wrong-fact': 'Used the wrong conversion fact', 'u3t-dec-in': 'Wrote the decimal part of a foot as inches', 'u3t-dec-ft': 'Gave decimal feet instead of whole feet and inches',
    'u3t-conv-dir': 'SI ↔ imperial: multiplied instead of dividing (or the reverse)', 'u3t-est-only': 'Used the estimate (× 2.5) instead of 2.54', 'u3t-ftin-dec': 'Read feet and inches as a decimal (5′4″ = 5.4 ft)', 'u3t-no-inches': 'Left out the inches', 'u3t-in-not-conv': 'Changed the feet but not the inches', 'u3t-not-conv': 'Gave the length before converting',
    'u3t-gave-total': 'Gave a length instead of the difference', 'u3t-no-borrow': 'Subtracted the smaller inches from the larger (didn’t borrow a foot)', 'u3t-tape-eighths': 'Ruler: counted sixteenths as eighths', 'u3t-tape-whole': 'Ruler: wrong whole inch', 'u3t-tape-back': 'Ruler: counted back from the next inch',
    'u3t-pi-r': 'π × r (only half the circumference)', 'u3t-2pid': '2π × diameter (double the circumference)', 'u3t-area-not-c': 'Found the area instead of the circumference', 'u3t-gave-used': 'Gave the length used instead of what is left',
    'u3t-missing-sides': 'Left out the missing sides', 'u3t-swap': 'Two answers swapped', 'u3t-area-not-p': 'Found the area instead of the perimeter', 'u3t-inside-line': 'Counted a line inside the shape', 'u3t-full-circle': 'Used a whole circle for a half circle', 'u3t-no-curve': 'Left out a curved edge or a side',
    'u3t-gaps-n': 'Counted one gap too many or too few', 'u3t-no-gaps': 'Left out the gaps', 'u3t-mix-mult': 'Multiplied the whole number and the fraction separately',
    'u3t-undo-wrong': 'Did the same operation instead of the opposite', 'u3t-half-step': 'Forgot to divide by 2 (only one step undone)', 'u3t-one-w': 'Subtracted only one width (or length)', 'u3t-r-d': 'Radius and diameter mixed up', 'u3t-calc-order': '÷ 2 × π instead of ÷ (2π)', 'u3t-no-pi': 'Left π out', 'u3t-sq-two': 'Divided by 2 instead of 4 (a square has 4 sides)', 'u3t-one-side': 'Subtracted only one of the known sides',
    'u3t-four-sides': 'Fenced 4 sides instead of 3', 'u3t-gave-w': 'Gave the width instead of the fencing', 'u3t-wrong-sides': 'Used the wrong sides',
    'u3t-no-half': 'Forgot the ½', 'u3t-slant': 'Used the slanted side instead of the height', 'u3t-d-as-r': 'Used the diameter as the radius', 'u3t-r-times-2': 'r × 2 instead of r²', 'u3t-c-not-a': 'Found the circumference instead of the area', 'u3t-trap-one': 'Trapezoid: used only one parallel side', 'u3t-all-three': 'Multiplied all the numbers',
    'u3t-half-extra': 'Parallelogram: took half (it is not a triangle)', 'u3t-part-full': 'Counted part squares as full squares', 'u3t-no-part': 'Left out the part squares', 'u3t-sq-side': 'Used the side of a square instead of its area', 'u3t-count-only': 'Gave the number of squares, not the area',
    'u3t-missing-piece': 'Left out a piece of the shape', 'u3t-added-cut': 'Added the cut-out instead of subtracting it', 'u3t-no-cutout': 'Did not take away the cut-out(s)', 'u3t-overlap': 'Counted an overlap twice',
    'u3t-volume': 'Found the volume instead of the surface area', 'u3t-half-faces': 'Counted each pair of faces once', 'u3t-one-end': 'Counted only one end', 'u3t-side-only': 'Found only the curved side', 'u3t-h-not-s': 'Used the height instead of the slant height', 'u3t-no-base': 'Left out the base',
    'u3t-tri-height': 'Used the triangle’s height for a slanted side', 'u3t-missing-face': 'Left out some faces', 'u3t-extra-face': 'Included a face that is not covered', 'u3t-two-walls': 'Found only two of the walls', 'u3t-floor': 'Included the floor', 'u3t-one-coat': 'One coat instead of two', 'u3t-len-factor': 'Used the length factor (12, 3, 100) for area'
  });
  HW.addPartial({
    'u3t-round-dir': 's', 'u3t-dec-close': 's', 'u3t-which': 'b', 'u3t-one-box': 's', 'u3t-half-box': 'b', 'u3t-many-box': 'n',
    'u3t-si-steps': 'b', 'u3t-si-dir': 'n', 'u3t-no-convert': 'b', 'u3t-unit-ans': 's', 'u3t-one-lap': 'b', 'u3t-round-up-cut': 's', 'u3t-round-down': 's', 'u3t-total-len': 'b', 'u3t-gave-per': 'b',
    'u3t-imp-10': 'n', 'u3t-imp-dir': 'n', 'u3t-wrong-fact': 'b', 'u3t-dec-in': 'b', 'u3t-dec-ft': 'b', 'u3t-conv-dir': 'n', 'u3t-est-only': 'b', 'u3t-ftin-dec': 'b', 'u3t-no-inches': 'b', 'u3t-in-not-conv': 'b', 'u3t-not-conv': 'b',
    'u3t-gave-total': 'b', 'u3t-no-borrow': 'b', 'u3t-tape-eighths': 'b', 'u3t-tape-whole': 's', 'u3t-tape-back': 'b', 'u3t-pi-r': 'b', 'u3t-2pid': 'b', 'u3t-area-not-c': 'n', 'u3t-gave-used': 'b',
    'u3t-missing-sides': 'b', 'u3t-swap': 's', 'u3t-area-not-p': 'n', 'u3t-inside-line': 'b', 'u3t-full-circle': 'b', 'u3t-no-curve': 'b', 'u3t-gaps-n': 's', 'u3t-no-gaps': 'b', 'u3t-mix-mult': 'n',
    'u3t-undo-wrong': 'n', 'u3t-half-step': 'b', 'u3t-one-w': 'b', 'u3t-r-d': 'b', 'u3t-calc-order': 'b', 'u3t-no-pi': 'n', 'u3t-sq-two': 'b', 'u3t-one-side': 'b', 'u3t-four-sides': 'b', 'u3t-gave-w': 'b', 'u3t-wrong-sides': 'b',
    'u3t-no-half': 'b', 'u3t-slant': 'b', 'u3t-d-as-r': 'b', 'u3t-r-times-2': 'b', 'u3t-c-not-a': 'n', 'u3t-trap-one': 'n', 'u3t-all-three': 'n', 'u3t-half-extra': 'b', 'u3t-part-full': 'b', 'u3t-no-part': 'b', 'u3t-sq-side': 'b', 'u3t-count-only': 's',
    'u3t-missing-piece': 'b', 'u3t-added-cut': 'n', 'u3t-no-cutout': 'b', 'u3t-overlap': 'b', 'u3t-volume': 'n', 'u3t-half-faces': 'b', 'u3t-one-end': 's', 'u3t-side-only': 'b', 'u3t-h-not-s': 'b', 'u3t-no-base': 'b',
    'u3t-tri-height': 'b', 'u3t-missing-face': 'b', 'u3t-extra-face': 'b', 'u3t-two-walls': 'b', 'u3t-floor': 'b', 'u3t-one-coat': 'b', 'u3t-len-factor': 'b'
  });

  /* ======================= shared generators (the test and the exit slips) ======================= */
  /* ---- SI: the staircase ---- */
  var SI = { km: 3, hm: 2, dam: 1, m: 0, dm: -1, cm: -2, mm: -3 }, SINAME = { km: 'kilometres', hm: 'hectometres', dam: 'decametres', m: 'metres', dm: 'decimetres', cm: 'centimetres', mm: 'millimetres' };
  var SIBASIC = [['m', 'cm'], ['km', 'm'], ['mm', 'cm'], ['cm', 'm'], ['m', 'mm'], ['cm', 'mm'], ['mm', 'm'], ['m', 'km']], SISTAIR = [['hm', 'm'], ['dam', 'm'], ['m', 'dm'], ['dm', 'cm'], ['km', 'dam'], ['cm', 'dm'], ['m', 'hm'], ['dm', 'mm']];
  function siVal(r, k) { // a value in the "from" unit for a change of k steps (k > 0: to a smaller unit)
    if (k > 0) return find(function () { return q(r.int(2, 999) / Math.pow(10, r.int(1, Math.min(k, 2)))); }, function (x) { return x % 1 !== 0 && x * Math.pow(10, k) < 100000; });
    var hi = [0, 999, 9999, 9999][-k];
    return find(function () { return r.int(12, hi); }, function (x) { return x % 10 !== 0 || r.chance(0.3); });
  }
  function siConv(r, pair) {
    var from = pair[0], to = pair[1], k = SI[from] - SI[to], x = siVal(r, k), y = q(x * Math.pow(10, k)), f = Math.pow(10, Math.abs(k));
    var diag = [{ v: q(x * Math.pow(10, k + (k > 0 ? -1 : 1))), code: 'u3t-si-steps', hint: 'Count the steps from ' + from + ' to ' + to + ' again: it is ' + Math.abs(k) + ' step' + (Math.abs(k) > 1 ? 's' : '') + ', so ' + (k > 0 ? '×' : '÷') + ' ' + Np(f) + '.' },
      { v: q(x * Math.pow(10, k + (k > 0 ? 1 : -1))), code: 'u3t-si-steps', hint: 'Count the steps from ' + from + ' to ' + to + ' again: it is ' + Math.abs(k) + ' step' + (Math.abs(k) > 1 ? 's' : '') + ', so ' + (k > 0 ? '×' : '÷') + ' ' + Np(f) + '.' },
      { v: q(x * Math.pow(10, -k)), code: 'u3t-si-dir', hint: (k > 0 ? 'A smaller unit means a <b>bigger</b> number: multiply.' : 'A bigger unit means a <b>smaller</b> number: divide.') }];
    return { from: from, to: to, k: k, x: x, y: y, f: f, diag: diag,
      sol: t(N(x) + uT(from)) + ' to ' + to + ': ' + Math.abs(k) + ' step' + (Math.abs(k) > 1 ? 's' : '') + ' ' + (k > 0 ? 'down' : 'up') + ', ' + t((k > 0 ? '\\times ' : '\\div ') + N(f)) + ': ' + t(N(x) + (k > 0 ? '\\times ' : '\\div ') + N(f) + '=' + N(y) + uT(to)) };
  }
  var SIHINTS = ['Find both units on the staircase (km, hm, dam, m, dm, cm, mm) and count the steps between them.', 'Down to a smaller unit: multiply by 10 for each step. Up to a bigger unit: divide.'];
  function siFillPart(r, o) {
    o = o || {}; var pairs = r.sample(o.pool || SIBASIC, o.n || 3), letters = 'abcdef';
    var cs = pairs.map(function (pr) { return siConv(r, pr); });
    if (cs.length === 1) { var c = cs[0]; return numPart('Change ' + t(N(c.x) + uT(c.from)) + ' to ' + SINAME[c.to] + '.', c.y, { after: c.to, diag: c.diag, sol: c.sol, hints: SIHINTS, text: o.text || 'SI ' + c.from + ' to ' + c.to }); }
    var specs = cs.map(function (c, i) { return nfld('(' + letters[i] + ') ' + t(N(c.x) + uT(c.from) + '='), c.y, { name: '(' + letters[i] + ')', after: c.to, diag: c.diag }); });
    return fieldsPart('Fill in the blanks.', specs, br(cs.map(function (c, i) { return '(' + letters[i] + ') ' + c.sol; })), SIHINTS, o.text || 'SI fill-ins', true);
  }
  /* ---- SI: the most reasonable measurement ---- */
  var REFS = [['the width of a classroom door', 90, 'cm'], ['the length of a new pencil', 18, 'cm'], ['the height of a basketball hoop', 3, 'm'], ['the thickness of a loonie', 2, 'mm'], ['the length of a hockey rink', 61, 'm'],
    ['the drive from Calgary to Red Deer', 150, 'km'], ['the length of a phone', 15, 'cm'], ['the height of a classroom ceiling', 3, 'm'], ['the length of a staple', 12, 'mm'], ['the length of a school bus', 12, 'm'],
    ['the width of a sheet of paper', 22, 'cm'], ['the thickness of a phone case', 3, 'mm'], ['a walk from the school to a store across town', 2, 'km'], ['the height of a kitchen counter', 90, 'cm'], ['the length of a soccer field', 100, 'm']];
  var REFOF = { mm: 'the thickness of a dime', cm: 'the width of your smallest fingernail', m: 'a long step', km: 'about a 12-minute walk' }, USIZE = { mm: 0.001, cm: 0.01, m: 1, km: 1000 };
  function referentPart(r, o) {
    o = o || {}; var c = r.pick(REFS), v = c[1], u = c[2];
    var opts = ['mm', 'cm', 'm', 'km'].map(function (un) { return un === u ? { html: t(N(v) + uT(un)), right: true } : { html: t(N(v) + uT(un)), why: '1 ' + un + ' is ' + REFOF[un] + ', so ' + v + ' ' + un + ' is far too ' + (USIZE[un] < USIZE[u] ? 'small' : 'big') + ' for ' + c[0] + '.' }; });
    return mcPart(r, 'Which is the most reasonable measurement for ' + c[0] + '?', opts, t(N(v) + uT(u)) + '. Referents: 1 mm is the thickness of a dime, 1 cm the width of your smallest fingernail, 1 m a long step, 1 km about a 12-minute walk.',
      ['Picture each unit with a referent: a dime’s thickness, a fingernail, a long step, a 12-minute walk.'], o.text || 'reasonable SI measurement');
  }
  /* ---- SI: a total in mixed units ---- */
  function siTotalPart(r, o) {
    o = o || {}; var p = person(r);
    if (r.chance(0.5)) {
      var a = q(r.int(8, 35) / 10), b = r.int(15, 95) * 10, c = q(r.int(105, 395) / 100), tot = q(a + b / 1000 + c);
      return numPart('A hiking trail in Kananaskis has three parts: ' + L(a, 'km') + ', ' + L(b, 'm') + ' and ' + L(c, 'km') + '. How long is the whole trail, in kilometres?', tot, { after: 'km',
        diag: [{ v: a + b + c, code: 'u3t-no-convert', hint: 'Change ' + L(b, 'm') + ' to kilometres before you add: ' + t(b + '\\div 1000=' + N(b / 1000)) + '.' }, { v: a + b / 100 + c, code: 'u3t-si-steps', hint: 'm to km is 3 steps up: ÷ 1000.' }, { v: tot * 1000, code: 'u3t-unit-ans', hint: 'That’s the length in metres. The question asks for kilometres.' }],
        sol: br([t(N(b) + '\\text{ m}=' + N(b) + '\\div 1000=' + N(b / 1000) + '\\text{ km}'), t(N(a) + '+' + N(b / 1000) + '+' + N(c) + '=' + N(tot) + '\\text{ km}')]), hints: ['Put every length in the same unit (km) before you add.', 'm to km: ÷ 1000.'], text: o.text || 'trail total in km' });
    }
    var n = r.int(2, 8), Lp = r.pick([400, 250, 200]), x = q(r.int(12, 45) / 10), tot2 = q(n * Lp / 1000 + x);
    return numPart(p.n + ' runs ' + t(n) + ' laps of a ' + L(Lp, 'm') + ' track. Then ' + p.he + ' runs ' + L(x, 'km') + ' on the road. How far does ' + p.he + ' run in all, in kilometres?', tot2, { after: 'km',
      diag: [{ v: n * Lp + x, code: 'u3t-no-convert', hint: 'Change the track distance to kilometres before you add: ' + t(N(n * Lp) + '\\text{ m}\\div 1000') + '.' }, { v: Lp / 1000 + x, code: 'u3t-one-lap', hint: p.n + ' runs ' + n + ' laps: ' + t(n + '\\times ' + Lp + '=' + N(n * Lp)) + ' m.' },
        { v: tot2 * 1000, code: 'u3t-unit-ans', hint: 'That’s the distance in metres. The question asks for kilometres.' }, { v: n * Lp / 100 + x, code: 'u3t-si-steps', hint: 'm to km is 3 steps up: ÷ 1000.' }],
      sol: br(['Track: ' + t(n + '\\times ' + Lp + '=' + N(n * Lp) + '\\text{ m}=' + N(n * Lp / 1000) + '\\text{ km}'), 'Total: ' + t(N(n * Lp / 1000) + '+' + N(x) + '=' + N(tot2) + '\\text{ km}')]), hints: ['Find the track distance in metres, then change it to km (÷ 1000).', 'Add the road distance.'], text: o.text || 'run total in km' });
  }
  /* ---- SI: cups from a jug (round down) and jugs for a party (round up) ---- */
  function jugsPart(r, o) {
    o = o || {}; var p = person(r);
    var s = find(function () { var c = r.pick([200, 250, 300, 350, 375, 400]), J = r.pick([2, 3, 4, 1.5, 2.5, 3.5]), Nn = r.int(30, 90); return { c: c, J: J, N: Nn }; },
      function (s) { var per = s.J * 1000 / s.c, jugs = s.N * s.c / (s.J * 1000); return per > 3 && Math.abs(jugs - Math.round(jugs)) > 0.08 && Math.ceil(s.N / Math.floor(per)) === Math.ceil(jugs - 1e-9) && (Math.abs(per - Math.round(per)) > 0.05 || r.chance(0.3)); });
    var per = s.J * 1000 / s.c, cups = Math.floor(per + 1e-9), jugs = Math.ceil(s.N * s.c / (s.J * 1000) - 1e-9);
    var specs = [nfld('(a) Cups from one jug:', cups, { name: 'Cups from one jug', dp: 0, after: 'cups', diag: [{ v: Math.ceil(per - 1e-9), code: 'u3t-round-up-cut', hint: 'The last cup is not full: count only the <b>full</b> cups (round down).' }, { v: Math.floor(s.J * 100 / s.c), code: 'u3t-si-steps', hint: '1 L = 1000 mL, so ' + L(s.J, 'L') + ' = ' + L(s.J * 1000, 'mL') + '.' }] }),
      nfld('(b) Jugs for ' + s.N + ' cups:', jugs, { name: 'Jugs', dp: 0, after: 'jugs', diag: [{ v: Math.floor(s.N * s.c / (s.J * 1000) + 1e-9), code: 'u3t-round-down', hint: 'That many jugs is not quite enough. You must make whole jugs: round <b>up</b>.' }, { v: Math.ceil(s.N * s.c / s.J / 100 - 1e-9), code: 'u3t-si-steps', hint: '1 L = 1000 mL.' }] })];
    return fieldsPart(p.n + ' is selling lemonade at a fundraiser. Each cup holds ' + L(s.c, 'mL') + '. A jug holds ' + L(s.J, 'L') + '.', specs,
      br(['(a) ' + t(N(s.J) + '\\text{ L}=' + N(s.J * 1000) + '\\text{ mL}') + '; ' + t(N(s.J * 1000) + '\\div ' + s.c + eqR(per, 2)) + ', so ' + cups + ' full cups (round down).', '(b) ' + t(s.N + '\\times ' + s.c + '=' + N(s.N * s.c) + '\\text{ mL}=' + N(s.N * s.c / 1000) + '\\text{ L}') + '; ' + t(N(s.N * s.c / 1000) + '\\div ' + N(s.J) + eqR(s.N * s.c / (s.J * 1000), 2)) + ', so ' + jugs + ' jugs (round up).']),
      ['Change the litres to millilitres first (× 1000).', 'Cups you can fill: round down. Jugs you must make: round up.'], o.text || 'cups and jugs');
  }
  /* ---- SI: trim lengths to buy for cut pieces ---- */
  function trimBuyPart(r, o) {
    o = o || {}; var p = person(r), it = r.pick([['baseboard trim', 'a shelf unit'], ['wood moulding', 'picture frames'], ['metal edging', 'garden boxes'], ['PVC pipe', 'a bike rack']]);
    var s = find(function () { var Ln = r.pick([2.4, 3, 3.6, 2.5, 1.8]), c = r.int(7, 19) * 5, Nn = r.int(7, 20), pr = q(r.int(4, 15) + r.pick([0.48, 0.98, 0.79, 0.29])); return { Ln: Ln, c: c, N: Nn, pr: pr }; },
      function (s) { var per = Math.floor(s.Ln * 100 / s.c + 1e-9); if (per < 2 || per > 6) return false; var buy = Math.ceil(s.N / per - 1e-9), bad = Math.ceil(s.N * s.c / (s.Ln * 100) - 1e-9); return bad !== buy && s.N % per !== 0 && Math.round(s.Ln * 100) % s.c !== 0; });
    var per = Math.floor(s.Ln * 100 / s.c + 1e-9), buy = Math.ceil(s.N / per - 1e-9), bad = Math.ceil(s.N * s.c / (s.Ln * 100) - 1e-9), lo = Math.floor(s.N / per);
    var hint1 = 'Find how many whole pieces one length gives first: ' + t(N(s.Ln * 100) + '\\div ' + s.c) + ', rounded down. The leftover bit of each length is too short to use.';
    var specs = [nfld('Lengths to buy:', buy, { name: 'Lengths to buy', dp: 0, after: 'lengths', diag: [{ v: bad, code: 'u3t-total-len', hint: hint1 }, { v: lo, code: 'u3t-round-down', hint: t(lo) + ' lengths give only ' + t(lo * per) + ' pieces. Round <b>up</b>.' }, { v: per, code: 'u3t-gave-per', hint: 'That’s the number of pieces from one length. How many lengths for ' + s.N + ' pieces?' }] }),
      nfld('Cost:', buy * s.pr, { name: 'Cost', money: true, diag: [{ v: bad * s.pr, code: 'u3t-total-len', hint: hint1 }, { v: lo * s.pr, code: 'u3t-round-down', hint: 'Buy enough lengths: round up.' }], from: function (v) { return Math.round(v[0]) === v[0] && v[0] > 0 ? q(v[0] * s.pr) : null; } })];
    return fieldsPart(cap(it[0]) + ' is sold in ' + L(s.Ln, 'm') + ' lengths for ' + MM(s.pr) + ' each. ' + p.n + ' needs ' + t(s.N) + ' pieces, each ' + L(s.c, 'cm') + ' long, for ' + it[1] + '. (Ignore the saw cuts.) How many lengths must ' + p.he + ' buy, and what do they cost before tax?', specs,
      br(['One length: ' + t(N(s.Ln) + '\\text{ m}=' + N(s.Ln * 100) + '\\text{ cm}') + '; ' + t(N(s.Ln * 100) + '\\div ' + s.c + eqR(s.Ln * 100 / s.c, 2)) + ', so ' + per + ' pieces from each length (round down).', 'Lengths: ' + t(s.N + '\\div ' + per + eqR(s.N / per, 2)) + ', so buy ' + buy + ' lengths (round up).', 'Cost: ' + t(buy + '\\times ' + Mt(s.pr) + '=' + Mt(buy * s.pr))]),
      ['Change the length to centimetres. How many whole pieces does one length give? (Round down.)', 'How many lengths for all the pieces? (Round up.) Then multiply by the price.'], o.text || 'trim lengths to buy');
  }
  A.siConv = siConv; A.siFillPart = siFillPart; A.SIBASIC = SIBASIC; A.SISTAIR = SISTAIR; A.SI = SI; A.SINAME = SINAME; A.SIHINTS = SIHINTS; A.referentPart = referentPart; A.siTotalPart = siTotalPart; A.jugsPart = jugsPart; A.trimBuyPart = trimBuyPart;

  /* ---- imperial: fill-ins ---- */
  var IMP = {
    ftin: function (r) { var x = r.int(2, 15); return { x: x, from: 'ft', to: 'in', y: 12 * x, op: '\\times 12', diag: [{ v: 10 * x, code: 'u3t-imp-10', hint: '1 ft = <b>12</b> in, not 10.' }, { v: x / 12, code: 'u3t-imp-dir', hint: 'Inches are smaller than feet, so the number gets <b>bigger</b>: multiply by 12.' }] }; },
    ydin: function (r) { var x = r.int(2, 9); return { x: x, from: 'yd', to: 'in', y: 36 * x, op: '\\times 36', diag: [{ v: 12 * x, code: 'u3t-wrong-fact', hint: '1 yd = 3 ft = <b>36</b> in.' }, { v: 3 * x, code: 'u3t-wrong-fact', hint: 'That’s feet. 1 yd = 36 in.' }] }; },
    ydft: function (r) { var x = r.int(2, 12); return { x: x, from: 'yd', to: 'ft', y: 3 * x, op: '\\times 3', diag: [{ v: 12 * x, code: 'u3t-wrong-fact', hint: '1 yd = <b>3</b> ft (12 is for inches in a foot).' }, { v: q(x / 3), code: 'u3t-imp-dir', hint: 'Feet are smaller than yards: multiply by 3.' }] }; },
    ftyd: function (r) { var k = r.int(2, 9); return { x: 3 * k, from: 'ft', to: 'yd', y: k, op: '\\div 3', diag: [{ v: 9 * k, code: 'u3t-imp-dir', hint: 'Yards are bigger than feet, so the number gets <b>smaller</b>: divide by 3.' }, { v: q(3 * k / 12), code: 'u3t-wrong-fact', hint: '1 yd = <b>3</b> ft.' }] }; },
    mift: function (r) { var x = r.pick([2, 3, 0.5, 1.5, 4]); return { x: x, from: 'mi', to: 'ft', y: q(5280 * x), op: '\\times 5280', diag: [{ v: q(1760 * x), code: 'u3t-wrong-fact', hint: 'That’s yards. 1 mi = <b>5280</b> ft.' }, { v: q(1000 * x), code: 'u3t-imp-10', hint: '1 mi = 5280 ft (1000 is for km to m).' }] }; },
    miyd: function (r) { var x = r.pick([2, 3, 0.5, 1.5, 4]); return { x: x, from: 'mi', to: 'yd', y: q(1760 * x), op: '\\times 1760', diag: [{ v: q(5280 * x), code: 'u3t-wrong-fact', hint: 'That’s feet. 1 mi = <b>1760</b> yd.' }] }; }
  };
  function inToFtIn(n) { var f = Math.floor(n / 12), i = n - 12 * f, dec = n / 12, dIn = Number(String(rd(dec, 2)).split('.')[1] || 0); return { f: f, i: i, dec: dec, dIn: dIn }; }
  function impFillPart(r, o) {
    o = o || {}; var a = IMP[r.pick(['ftin', 'ftin', 'ydin'])](r), b = IMP[r.pick(['ydft', 'ftyd', 'mift', 'miyd'])](r);
    var n = find(function () { return r.int(26, 150); }, function (x) { return x % 12 !== 0 && x % 12 !== 6; }), c = inToFtIn(n);
    var specs = [nfld('(a) ' + t(N(a.x) + uT(a.from) + '='), a.y, { name: '(a)', after: a.to, diag: a.diag }), nfld('(b) ' + t(N(b.x) + uT(b.from) + '='), b.y, { name: '(b)', after: b.to, diag: b.diag }),
      nfld('(c) ' + t(n + '\\text{ in}=') , c.f, { name: '(c) feet', after: 'ft', diag: [{ v: c.dec, code: 'u3t-dec-ft', hint: 'Give the whole feet, then the inches left over.' }] }),
      nfld('', c.i, { name: '(c) inches', after: 'in', diag: [{ v: c.dIn, code: 'u3t-dec-in', hint: t(n + '\\div 12' + eqR(c.dec, 2)) + ': the decimal is part of a <b>foot</b>, not inches. Inches left: ' + t(n + '-' + c.f + '\\times 12') + '.' }] })];
    return fieldsPart('Fill in the blanks.', specs, br(['(a) ' + t(N(a.x) + a.op + '=' + N(a.y)) + ' ' + a.to, '(b) ' + t(N(b.x) + b.op + '=' + N(b.y)) + ' ' + b.to, '(c) ' + t(n + '\\div 12' + eqR(c.dec, 2)) + ', so ' + c.f + ' ft; ' + t(n + '-' + c.f + '\\times 12=' + c.i) + ' in, so ' + t(c.f + "'\\," + c.i + "''")]),
      ['12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5280 ft = 1 mi, 1760 yd = 1 mi.', 'To a smaller unit, multiply. To a bigger unit, divide. Inches left = inches − feet × 12.'], o.text || 'imperial fill-ins', true);
  }
  /* ---- imperial → SI ---- */
  var I2S = [
    function (r) { var x = r.chance(0.5) ? r.int(5, 40) : q(r.int(5, 30) + 0.5); return { pr: 'A board is ' + L(x, 'in') + ' wide. What is its width in centimetres, to the nearest tenth?', x: x, f: 2.54, u: 'cm', fu: '1 in = 2.54 cm', diag: [{ v: x / 2.54, code: 'u3t-conv-dir', hint: 'A centimetre is shorter than an inch, so the number gets <b>bigger</b>: multiply by 2.54.' }, { v: x * 2.5, code: 'u3t-est-only', hint: 'Use the exact fact 1 in = 2.54 cm (2.5 is only for estimating).' }, { v: x * 30.48, code: 'u3t-wrong-fact', hint: '30.48 is for feet. 1 in = 2.54 cm.' }] }; },
    function (r) { var x = r.int(3, 12); return { pr: 'A bookshelf is ' + L(x, 'ft') + ' long. What is its length in centimetres, to the nearest tenth?', x: x, f: 30.48, u: 'cm', fu: '1 ft = 30.48 cm', diag: [{ v: x / 30.48, code: 'u3t-conv-dir', hint: 'Centimetres are smaller: the number gets bigger. Multiply by 30.48.' }, { v: x * 2.54, code: 'u3t-wrong-fact', hint: '2.54 is for inches. 1 ft = 30.48 cm.' }, { v: x * 12, code: 'u3t-not-conv', hint: 'That’s inches. 1 ft = 30.48 cm.' }] }; },
    function (r) { var x = r.int(3, 25); return { pr: 'A roll of fabric has ' + L(x, 'yd') + ' left. How many metres is that, to the nearest tenth?', x: x, f: 0.9144, u: 'm', fu: '1 yd = 0.9144 m', diag: [{ v: x / 0.9144, code: 'u3t-conv-dir', hint: 'A yard is a bit less than a metre, so the number of metres is a bit <b>smaller</b>: multiply by 0.9144.' }, { v: x * 3, code: 'u3t-not-conv', hint: 'That’s feet. 1 yd = 0.9144 m.' }] }; },
    function (r) { var x = r.pick([3, 5, 6.2, 13.1, 26.2, 2.5, 8, 10]); return { pr: 'A road race is ' + L(x, 'mi') + ' long. How many kilometres is that, to the nearest tenth?', x: x, f: 1.609, u: 'km', fu: '1 mi ≈ 1.609 km', diag: [{ v: x / 1.609, code: 'u3t-conv-dir', hint: 'A kilometre is shorter than a mile, so the number gets <b>bigger</b>: multiply by 1.609.' }, { v: x * 0.621, code: 'u3t-wrong-fact', hint: '0.621 is for km to miles. For miles to km, multiply by 1.609.' }] }; }];
  function impToSIPart(r, o) {
    o = o || {}; var c = r.pick(o.only ? [I2S[o.only]] : I2S)(r), y = c.x * c.f;
    return numPart(c.pr, y, { dp: 1, after: c.u, diag: c.diag, sol: c.fu + ': ' + t(N(c.x) + '\\times ' + c.f + eqR(y, 1) + uT(c.u)), hints: ['Use ' + c.fu + '.', 'Should the number get bigger or smaller? The smaller unit has the bigger number.'], text: o.text || 'imperial to SI ' + c.u });
  }
  /* ---- feet and inches → cm ---- */
  function hT(a, b) { return t(a + "'\\," + xT(b) + "''"); }
  function heightPart(r, o) {
    o = o || {};
    if (!o.single && r.chance(0.4)) {
      var ps = people(r, 2), h1 = find(function () { return [r.int(4, 5), r.int(3, 11)]; }, function (h) { return h[0] * 12 + h[1] >= 56; }), h2 = find(function () { return [r.int(5, 6), r.int(0, 11)]; }, function (h) { var d = h[0] * 12 + h[1] - h1[0] * 12 - h1[1]; return d >= 3 && d <= 16 && h[1] < h1[1]; });
      var i1 = 12 * h1[0] + h1[1], i2 = 12 * h2[0] + h2[1], d = i2 - i1, cm = d * 2.54;
      return numPart(ps[0].n + ' is ' + hT(h1[0], h1[1]) + ' tall and ' + ps[1].n + ' is ' + hT(h2[0], h2[1]) + ' tall. How much taller is ' + ps[1].n + ', in centimetres, to the nearest tenth?', cm, { dp: 1, after: 'cm',
        diag: [{ v: d, code: 'u3t-not-conv', hint: 'That’s the difference in inches. Change it to centimetres: × 2.54.' }, { v: ((h2[0] + h2[1] / 10) - (h1[0] + h1[1] / 10)) * 30.48, code: 'u3t-ftin-dec', hint: t(h2[0] + "'\\," + h2[1] + "''") + ' is not ' + t(h2[0] + '.' + h2[1]) + ' ft: there are 12 inches in a foot. Change both heights to inches.' },
          { v: ((h2[0] - h1[0]) * 12 + h1[1] - h2[1]) * 2.54, code: 'u3t-no-borrow', hint: 'Borrow 1 ft (12 in) when you subtract: ' + t(h2[0] + "'\\," + h2[1] + "''=" + (h2[0] - 1) + "'\\," + (h2[1] + 12) + "''") + ' (or change both heights to inches).' }, { v: d / 2.54, code: 'u3t-conv-dir', hint: 'Centimetres are smaller than inches: multiply by 2.54.' }],
        sol: br(['In inches: ' + t(h1[0] + '\\times 12+' + h1[1] + '=' + i1) + ' and ' + t(h2[0] + '\\times 12+' + h2[1] + '=' + i2), 'Difference: ' + t(i2 + '-' + i1 + '=' + d + '\\text{ in}'), t(d + '\\times 2.54' + eqR(cm, 1) + '\\text{ cm}')]),
        hints: ['Change both heights to inches (feet × 12 + inches), then subtract.', 'Change the difference to cm: × 2.54.'], text: o.text || 'height difference in cm' });
    }
    var p = person(r), a = r.int(4, 6), b = find(function () { return r.int(1, 11); }, function (b) { return a < 6 || b <= 6; }), n = 12 * a + b, cm2 = n * 2.54;
    return numPart(p.n + ' is ' + hT(a, b) + ' tall (' + a + ' ft ' + b + ' in). What is ' + p.his + ' height in centimetres, to the nearest centimetre?', cm2, { dp: 0, after: 'cm',
      diag: [{ v: (a + b / 10) * 30.48, code: 'u3t-ftin-dec', hint: t(a + "'\\," + b + "''") + ' is not ' + t(a + '.' + b) + ' ft. Change it to inches first: ' + t(a + '\\times 12+' + b) + '.' }, { v: a * 30.48 + b, code: 'u3t-in-not-conv', hint: 'Change the ' + b + ' in to centimetres too (or change everything to inches first).' },
        { v: (10 * a + b) * 2.54, code: 'u3t-imp-10', hint: 'There are 12 inches in a foot, not 10.' }, { v: 12 * a * 2.54, code: 'u3t-no-inches', hint: 'Add the ' + b + ' in before you convert.' }, { v: n / 2.54, code: 'u3t-conv-dir', hint: 'Centimetres are smaller than inches: multiply by 2.54.' }, { v: n, code: 'u3t-not-conv', hint: 'That’s the height in inches. Now × 2.54.' }],
      sol: br(['Inches: ' + t(a + '\\times 12+' + b + '=' + n + '\\text{ in}'), t(n + '\\times 2.54' + eqR(cm2, 0) + '\\text{ cm}')]), hints: ['Change the height to inches first: feet × 12 + inches.', 'Then × 2.54.'], text: o.text || 'height in cm' });
  }
  /* ---- SI → imperial ---- */
  var S2I = [
    function (r) { var x = r.int(60, 400); return { pr: 'A roll of ribbon is ' + L(x, 'cm') + ' long. How long is it in inches, to the nearest tenth?', x: x, y: x / 2.54, u: 'in', alts: [], sol: '1 in = 2.54 cm, so divide: ' + t(N(x) + '\\div 2.54' + eqR(x / 2.54, 1) + '\\text{ in}'), diag: [{ v: x * 2.54, code: 'u3t-conv-dir', hint: 'An inch is longer than a centimetre, so the number of inches is <b>smaller</b>: divide by 2.54.' }, { v: x / 2.5, code: 'u3t-est-only', hint: 'Use 2.54 (2.5 is only for estimating).' }, { v: x / 30.48, code: 'u3t-wrong-fact', hint: 'That’s feet (30.48 cm = 1 ft). 1 in = 2.54 cm.' }] }; },
    function (r) { var x = r.pick([5, 8, 10, 12, 15, 21.1, 42.2, 3, 7.5]); return { pr: 'A fun run is ' + L(x, 'km') + ' long. How many miles is that, to the nearest tenth? (1 km ≈ 0.621 mi)', x: x, y: x * 0.621, u: 'mi', alts: [x / 1.609], sol: t(N(x) + '\\times 0.621' + eqR(x * 0.621, 1) + '\\text{ mi}'), diag: [{ v: x * 1.609, code: 'u3t-conv-dir', hint: 'A mile is longer than a kilometre, so the number of miles is <b>smaller</b>.' }, { v: x / 0.621, code: 'u3t-conv-dir', hint: 'Multiply by 0.621 (the number of miles in 1 km).' }] }; },
    function (r) { var x = q(r.int(25, 120) / 10); return { pr: 'A room is ' + L(x, 'm') + ' long. How long is it in feet, to the nearest tenth? (1 m ≈ 3.28 ft)', x: x, y: x * 3.28, u: 'ft', alts: [x / 0.3048], sol: t(N(x) + '\\times 3.28' + eqR(x * 3.28, 1) + '\\text{ ft}'), diag: [{ v: x / 3.28, code: 'u3t-conv-dir', hint: 'A foot is shorter than a metre, so the number of feet is <b>bigger</b>.' }, { v: x * 39.37, code: 'u3t-wrong-fact', hint: 'That’s inches. 1 m ≈ 3.28 ft.' }, { v: x * 3, code: 'u3t-est-only', hint: 'A metre is a bit <b>more</b> than 3 ft: use 3.28.' }] }; },
    function (r) { var x = r.pick([25, 50, 100, 200, 400, 1500, 60, 75]); return { pr: 'A pool is ' + L(x, 'm') + ' long. How many yards is that, to the nearest tenth? (1 yd = 0.9144 m)', x: x, y: x / 0.9144, u: 'yd', alts: [], sol: '1 yd = 0.9144 m, so divide: ' + t(N(x) + '\\div 0.9144' + eqR(x / 0.9144, 1) + '\\text{ yd}'), diag: [{ v: x * 0.9144, code: 'u3t-conv-dir', hint: 'A yard is shorter than a metre, so the number of yards is <b>bigger</b>: divide by 0.9144.' }, { v: x * 3.28, code: 'u3t-wrong-fact', hint: 'That’s feet. 1 yd = 0.9144 m.' }] }; }];
  function siToImpPart(r, o) {
    o = o || {}; var c = r.pick(S2I)(r);
    return numPart(c.pr, c.y, { dp: 1, after: c.u, alts: c.alts, diag: c.diag, sol: c.sol, hints: ['Should the number get bigger or smaller? The smaller unit has the bigger number.', 'Use the conversion facts: 1 in = 2.54 cm, 1 m ≈ 3.28 ft, 1 yd = 0.9144 m, 1 km ≈ 0.621 mi.'], text: o.text || 'SI to imperial ' + c.u });
  }
  /* ---- will it fit under a clearance sign? ---- */
  function clearPart(r, o) {
    o = o || {}; var p = person(r), veh = r.pick(['van with a roof box', 'SUV with a cargo box on the roof', 'pickup truck with a rack', 'camper van']), place = r.pick(['a parkade', 'a car wash', 'a hotel’s covered drop-off', 'a drive-through']);
    var s = find(function () { var a = r.int(6, 7), b = r.int(0, 11), cl = (12 * a + b) * 2.54 / 100, h = rd(cl + r.pick([-1, 1]) * r.int(5, 90) / 1000, 2); return { a: a, b: b, cl: cl, h: h }; },
      function (s) { var d = Math.abs(s.cl - s.h) * 100; return d >= 0.6 && d < 9.5 && s.b !== 0 && Math.abs((s.a + s.b / 10) * 0.3048 - s.cl) > 0.01; });
    var cm = (s.cl - s.h) * 100, fit = s.cl > s.h, d = Math.abs(cm), dec = (s.a + s.b / 10) * 30.48;
    var amt = numChk(d, { dp: 1, diag: [{ v: Math.abs(dec - s.h * 100), code: 'u3t-ftin-dec', hint: t(s.a + "'\\," + s.b + "''") + ' is not ' + t(s.a + '.' + s.b) + ' ft. Change it to inches first: ' + t(s.a + '\\times 12+' + s.b) + '.' },
      { v: Math.abs(s.a * 30.48 - s.h * 100), code: 'u3t-no-inches', hint: 'Include the ' + s.b + ' inches: ' + t(s.a + "'\\," + s.b + "''=" + (12 * s.a + s.b)) + ' in.' }, { v: s.cl * 100, code: 'u3t-gave-total', hint: 'That’s the clearance in cm. Subtract the vehicle’s height.' }, { v: d / 100, code: 'u3t-unit-ans', hint: 'That’s the difference in metres. The question asks for centimetres (× 100).' }, { v: d * 10, code: 'u3t-unit-ans', hint: 'That’s millimetres. The question asks for centimetres.' }] });
    return yesAmtPart('The entrance to ' + place + ' has a sign: “Clearance ' + hT(s.a, s.b) + '”. ' + p.n + '’s ' + veh + ' is ' + L(s.h, 'm') + ' tall. Will it fit under? By how many centimetres is it under (or over) the clearance, to the nearest tenth?', { yes: fit, label: 'Will it fit?', amt: amt, key: nS(rd(d, 1)), dp: 1, show: L(rd(d, 1), 'cm'), after: 'cm',
      why: 'Compare the two heights in the same unit: the ' + veh + ' fits only if it is <b>shorter</b> than the clearance.', miss: 'Change the clearance to cm: inches × 2.54.',
      sol: br(['Clearance: ' + t(s.a + '\\times 12+' + s.b + '=' + (12 * s.a + s.b) + '\\text{ in}') + '; ' + t((12 * s.a + s.b) + '\\times 2.54' + eqR(s.cl * 100, 2) + '\\text{ cm}'), cap(veh.split(' ')[0]) + ': ' + t(N(s.h) + '\\text{ m}=' + N(s.h * 100) + '\\text{ cm}'), (fit ? 'It fits, with ' : 'It does <b>not</b> fit: it is ') + t(N(rd(Math.max(s.cl * 100, s.h * 100), 2)) + '-' + N(rd(Math.min(s.cl * 100, s.h * 100), 2)) + eqR(d, 1) + '\\text{ cm}') + (fit ? ' to spare.' : ' too tall.')]),
      hints: ['Change the clearance to inches, then to centimetres (× 2.54).', 'Change the height in metres to cm (× 100) and compare.'], text: o.text || 'clearance: fit and by how much' });
  }
  A.IMP = IMP; A.inToFtIn = inToFtIn; A.impFillPart = impFillPart; A.impToSIPart = impToSIPart; A.heightPart = heightPart; A.hT = hT; A.siToImpPart = siToImpPart; A.clearPart = clearPart;

  /* ---- M3: reading a ruler or tape ---- */
  function tapeDiag(x) {
    var w = Math.floor(x + 1e-9), k = Math.round((x - w) * 16), out = [];
    if (k && k < 8) out.push({ v: w + k / 8, code: 'u3t-tape-eighths', hint: 'Each small space is <b>1/16</b> of an inch (16 spaces in an inch), not 1/8.' });
    if (k && k % 2 === 0 && k < 16) out.push({ v: w + k / 32, code: 'u3t-tape-eighths', hint: 'Count the 1/16 spaces from the last whole inch.' });
    out.push({ v: w + 1 + k / 16, code: 'u3t-tape-whole', hint: 'The whole inches are the <b>last</b> number you passed, ' + w + '.' });
    if (w >= 1) out.push({ v: w - 1 + k / 16, code: 'u3t-tape-whole', hint: 'The whole inches are the last number you passed, ' + w + '.' });
    if (k) out.push({ v: w + (16 - k) / 16, code: 'u3t-tape-back', hint: 'Count the small spaces <b>past</b> ' + w + ', not back from ' + (w + 1) + '.' });
    return out;
  }
  function tapeSol(x) { var w = Math.floor(x + 1e-9), k = Math.round((x - w) * 16), fr = R(16 * w + k, 16); return 'the last number passed is ' + w + '; ' + k + ' small space' + (k === 1 ? '' : 's') + ' past it' + (k ? ': ' + t('\\frac{' + k + '}{16}' + (gcd(k, 16) > 1 ? '=' + frT(R(k, 16)) : '')) : '') + ', so ' + t(mixT(fr)) + ' in'; }
  function tapePos(r, a, b, odd) { return find(function () { var w = r.int(a, b - 1), k = odd ? 2 * r.int(0, 7) + 1 : r.pick([2, 4, 6, 8, 10, 12, 14]); return q(w + k / 16); }, function (x) { return x > a + 0.1 && x < b - 0.1; }); }
  function tapeReadPart(r, o) {
    o = o || {}; var tape = o.tape != null ? o.tape : r.chance(0.4), a = tape ? r.int(10, 30) : 0, b = a + (tape ? 5 : 6), n = o.n || 2;
    var xs = find(function () { var odd = r.chance(0.5); return n === 1 ? [tapePos(r, a, b, r.chance(0.5))] : [tapePos(r, a, b, odd), tapePos(r, a, b, !odd)]; }, function (v) { return v.length === 1 || Math.abs(v[0] - v[1]) > 0.8; });
    xs.sort(function (x, y) { return x - y; });
    var labs = 'AB', fig = tapeSvg({ a: a, b: b, tape: tape, marks: xs.map(function (x, i) { return { x: x, lab: labs[i] }; }) });
    var intro = (tape ? 'Here is part of a tape measure.' : 'Here is a ruler (in inches).') + fig;
    if (n === 1) { var fr0 = R(Math.round(xs[0] * 16), 16); return mixPart(intro + 'Read the length at arrow A. Write it as a mixed number in simplest form.', fr0, { after: 'in', diag: tapeDiag(xs[0]), sol: 'A: ' + tapeSol(xs[0]) + '.', hints: ['The whole inches are the last number you passed.', 'Count the small (1/16 in) spaces past it, then simplify the fraction.'], text: o.text || 'read a ruler' }); }
    var specs = xs.map(function (x, i) { return mfld(labs[i] + ':', R(Math.round(x * 16), 16), { name: labs[i], after: 'in', diag: tapeDiag(x) }); });
    return fieldsPart(intro + 'Read the length at each arrow. Write each one as a mixed number in simplest form.', specs, br(xs.map(function (x, i) { return labs[i] + ': ' + tapeSol(x) + '.'; })),
      ['The whole inches are the last number you passed.', 'Count the small spaces past it: each is 1/16 in. Then simplify (e.g. 6/16 = 3/8).'], o.text || 'read a ruler or tape', true);
  }
  /* ---- M3: circumference ---- */
  var CIRC = [['a round table', 'cm', 70, 150], ['a bike wheel', 'cm', 50, 70], ['a round rug', 'm', 1.2, 3.5, 0.1], ['a clock face', 'cm', 20, 40], ['a hula hoop', 'cm', 70, 100], ['a round trampoline', 'm', 2.4, 4.6, 0.1], ['a pizza pan', 'in', 10, 18], ['a round tabletop', 'in', 30, 48]];
  function circleFig(val, u, isR) { var it = [{ k: 'circle', c: [0, 0], r: 1 }, { k: 'dot', at: [0, 0] }]; if (isR) it.push({ k: 'line', a: [0, 0], b: [1, 0], sw: 1.8 }, { k: 'text', at: [0.5, 0], s: val + ' ' + u, dy: -10 }); else it.push({ k: 'line', a: [-1, 0], b: [1, 0], sw: 1.8 }, { k: 'text', at: [0, 0], s: val + ' ' + u, dy: -10 }); return fig2(it, { w: 170, h: 170, pad: 12, aria: 'circle' }); }
  function circumfPart(r, o) {
    o = o || {}; var c = r.pick(CIRC), d = pickR(r, c[2], c[3], c[4] || 1), isR = o.r != null ? o.r : r.chance(0.5), rr = q(d / 2), given = isR ? rr : d, C = PI * d;
    var diag = isR ? [{ v: PI * rr, code: 'u3t-pi-r', hint: 'π × r is only half way around. Use C = 2πr (or double the radius first).' }, { v: PI * rr * rr, code: 'u3t-area-not-c', hint: 'That’s the area (πr²). The circumference is the distance around: C = 2πr.' }, { v: 4 * PI * rr, code: 'u3t-2pid', hint: 'C = 2πr: double the radius only once.' }]
      : [{ v: 2 * PI * d, code: 'u3t-2pid', hint: 'With the diameter, C = πd (no 2).' }, { v: PI * d / 2, code: 'u3t-pi-r', hint: 'C = πd: use the whole diameter.' }, { v: PI * d * d / 4, code: 'u3t-area-not-c', hint: 'That’s the area. The circumference is C = πd.' }];
    return numPart('Find the circumference of ' + c[0] + ' with a ' + (isR ? 'radius' : 'diameter') + ' of ' + L(given, c[1]) + '. Round to the nearest tenth.' + circleFig(Np(given), c[1], isR), C, { dp: 1, after: c[1], diag: diag, p314: 3.14 * d,
      sol: isR ? t('C=2\\pi r=2\\times\\pi\\times ' + N(rr) + eqR(C, 1) + uT(c[1])) : t('C=\\pi d=\\pi\\times ' + N(d) + eqR(C, 1) + uT(c[1])), hints: [isR ? 'With the radius: C = 2πr.' : 'With the diameter: C = πd.', 'Use the π key. Estimate: a bit more than 3 times the diameter.'], text: o.text || 'circumference' });
  }
  /* ---- M3: feet and inches left on a board ---- */
  function boardLeftPart(r, o) {
    o = o || {}; var p = person(r), B = r.pick([8, 10, 12]);
    var s = find(function () { return [r.int(1, 4), r.int(1, 11), r.int(1, 3), r.int(1, 11)]; }, function (v) { var S = 12 * (v[0] + v[2]) + v[1] + v[3]; return S <= 12 * B - 13 && S > 12 * B - 50 && v[1] + v[3] >= 12 && v[1] <= 9 && v[3] <= 9 && (12 * B - S) % 12 !== 0; });
    var a = s[0], b = s[1], c = s[2], d = s[3], S = 12 * (a + c) + b + d, left = 12 * B - S, decL = B - (a + b / 10) - (c + d / 10), decT = decL > 0 ? Math.floor(decL) * 12 + Math.round((decL - Math.floor(decL)) * 10) : -1;
    var diag = [{ v: S, code: 'u3t-gave-used', hint: 'That’s the length of the two pieces together. Subtract it from the ' + B + ' ft board.' }];
    if (decT >= 0 && decT !== left) diag.push({ v: decT, code: 'u3t-ftin-dec', hint: 'Feet and inches are not decimals: 12 inches make a foot, not 10. Add the inches and trade 12 in for 1 ft.' });
    return ftinPart(p.n + ' has ' + (B === 8 ? 'an ' : 'a ') + L(B, 'ft') + ' board. ' + cap(p.he) + ' cuts off two pieces, ' + hT(a, b) + ' and ' + hT(c, d) + ' long. (Ignore the saw cuts.) How much of the board is left?', left, { diag: diag,
      sol: br(['Pieces: ' + t(a + "'\\," + b + "''+" + c + "'\\," + d + "''=" + (a + c) + "'\\," + (b + d) + "''") + '; ' + t((b + d) + "''=1'\\," + (b + d - 12) + "''") + ', so ' + t(ftinT(S)), 'Left: ' + t(B + "'\\,0''=" + (B - 1) + "'\\,12''") + '; ' + t((B - 1) + "'\\,12''-" + ftinT(S) + '=' + ftinT(left)) + ' &nbsp;(check: ' + t(12 * B + '-' + S + '=' + left) + ' in)']),
      hints: ['Add the two pieces: feet to feet, inches to inches. Trade 12 in for 1 ft.', 'To subtract from ' + B + ' ft, borrow: ' + B + '′0″ = ' + (B - 1) + '′12″.'], text: o.text || 'feet and inches left on a board' });
  }
  /* ---- M3: an L-shaped yard (all corners square) ---- */
  function lShape(r, o) {
    o = o || {}; var u = o.u || r.pick(['m', 'ft']);
    var s = find(function () { var Wd = r.int(14, 30), H = r.int(10, 24), T = r.int(Math.ceil(Wd * 0.3), Math.floor(Wd * 0.7)), Rt = r.int(Math.ceil(H * 0.3), Math.floor(H * 0.7)); return { W: Wd, H: H, T: T, R: Rt }; }, function (s) { return s.W - s.T !== s.H - s.R && s.W !== s.H && s.T !== s.R; });
    s.u = u; s.a = s.W - s.T; s.b = s.H - s.R; s.P = 2 * s.W + 2 * s.H; s.A = s.W * s.R + s.T * (s.H - s.R);
    s.fig = function (showAB) { var Wd = s.W, H = s.H, T = s.T, Rt = s.R; return fig2([{ k: 'poly', pts: [[0, 0], [Wd, 0], [Wd, Rt], [T, Rt], [T, H], [0, H]] }, { k: 'text', at: [Wd / 2, 0], s: Wd + ' ' + u, dy: 13 }, { k: 'text', at: [0, H / 2], s: H + ' ' + u, dx: -8, anchor: 'end' }, { k: 'text', at: [T / 2, H], s: T + ' ' + u, dy: -12 }, { k: 'text', at: [Wd, Rt / 2], s: Rt + ' ' + u, dx: 8, anchor: 'start' }].concat(showAB ? [{ k: 'text', at: [(T + Wd) / 2, Rt], s: 'a', dy: -12, bold: true }, { k: 'text', at: [T, (Rt + H) / 2], s: 'b', dx: 10, anchor: 'start', bold: true }] : []), { w: 300, h: 230, pad: 40, aria: 'L-shaped figure' }); };
    return s;
  }
  function lYardPart(r, o) {
    o = o || {}; var s = lShape(r, o), u = s.u;
    var specs = [nfld('a =', s.a, { name: 'a', after: u, diag: [{ v: s.b, code: 'u3t-swap', hint: 'a is the short side along the top right, across from the ' + s.W + ' ' + u + ' side: ' + t(s.W + '-' + s.T) + '.' }] }),
      nfld('b =', s.b, { name: 'b', after: u, diag: [{ v: s.a, code: 'u3t-swap', hint: 'b is the side going up, across from the ' + s.H + ' ' + u + ' side: ' + t(s.H + '-' + s.R) + '.' }] }),
      nfld('Perimeter:', s.P, { name: 'Perimeter', after: u, diag: [{ v: s.W + s.H + s.T + s.R, code: 'u3t-missing-sides', hint: 'The yard has <b>6</b> sides: add a and b too.' }, { v: s.A, code: 'u3t-area-not-p', hint: 'That’s the area. The perimeter is the distance around: add all 6 sides.' }], from: function (v) { return isFinite(v[0]) && isFinite(v[1]) ? s.W + s.H + s.T + s.R + v[0] + v[1] : null; } })];
    return fieldsPart('The diagram shows a back yard. All the corners are square. Find the missing lengths a and b, then the perimeter of the yard.' + s.fig(true), specs,
      br(['a: ' + t(s.W + '-' + s.T + '=' + s.a) + ' ' + u + ' &nbsp; b: ' + t(s.H + '-' + s.R + '=' + s.b) + ' ' + u, 'P: ' + t(s.W + '+' + s.R + '+' + s.a + '+' + s.b + '+' + s.T + '+' + s.H + '=' + s.P) + ' ' + u]),
      ['Missing side = the long side − the part you know.', 'Go around the shape and add all 6 sides.'], o.text || 'L-shape missing sides and perimeter');
  }
  /* ---- M3: edging for a bed with a half-circle end ---- */
  function bedFig(Ln, Wd, u) {
    var arc = arcPts(Ln, Wd / 2, Wd / 2, -90, 90, 30);
    return fig2([{ k: 'poly', pts: [[0, 0], [Ln, 0]].concat(arc.slice(1, -1)).concat([[Ln, Wd], [0, Wd]]) }, { k: 'line', a: [Ln, 0], b: [Ln, Wd], dash: true }, { k: 'text', at: [Ln / 2, 0], s: Np(Ln) + ' ' + u, dy: 13 }, { k: 'text', at: [0, Wd / 2], s: Np(Wd) + ' ' + u, dx: -8, anchor: 'end' }], { w: 300, h: 160, pad: 36, aria: 'rectangle with a half circle on one end' });
  }
  function bedEdgingPart(r, o) {
    o = o || {}; var p = person(r);
    var s = find(function () { var Ln = pickR(r, 4, 9, 0.5), Wd = pickR(r, 2, 4, 0.5), pc = r.pick([1.5, 2.4, 2, 3]), pr = q(r.int(3, 11) + r.pick([0.49, 0.98, 0.79])); return { Ln: Ln, W: Wd, pc: pc, pr: pr }; },
      function (s) { var P0 = 2 * s.Ln + s.W + PI * s.W / 2, n = P0 / s.pc; return s.Ln > s.W + 1 && Math.abs(n - Math.round(n)) > 0.1 && n > 3; });
    var Ln = s.Ln, Wd = s.W, P0 = 2 * Ln + Wd + PI * Wd / 2, n = Math.ceil(P0 / s.pc - 1e-9), cost = n * s.pr;
    var alt = function (len) { return Math.ceil(len / s.pc - 1e-9); }, dn = [];
    [[2 * Ln + 2 * Wd + PI * Wd / 2, 'u3t-inside-line', 'The dashed line is inside the bed: no edging goes there. The straight sides are ' + Np(Ln) + ' + ' + Np(Ln) + ' + ' + Np(Wd) + '.'], [2 * Ln + Wd + PI * Wd, 'u3t-full-circle', 'The end is a <b>half</b> circle: its curved edge is πd ÷ 2.'], [2 * Ln + PI * Wd / 2, 'u3t-no-curve', 'Don’t forget the straight end, ' + L(Wd, 'm') + '.'], [2 * Ln + Wd, 'u3t-no-curve', 'Add the curved edge of the half circle: πd ÷ 2.']].forEach(function (x) { if (alt(x[0]) !== n) dn.push({ v: alt(x[0]), code: x[1], hint: x[2] }); });
    dn.push({ v: Math.floor(P0 / s.pc), code: 'u3t-round-down', hint: 'Pieces you must buy: round <b>up</b>, or the edging is too short.' });
    var specs = [nfld('Pieces:', n, { name: 'Pieces', dp: 0, after: 'pieces', diag: dn }), nfld('Cost:', cost, { name: 'Cost', money: true, diag: dn.map(function (m) { return { v: m.v * s.pr, code: m.code, hint: m.hint }; }), from: function (v) { return v[0] > 0 && Math.round(v[0]) === v[0] ? q(v[0] * s.pr) : null; } })];
    return fieldsPart(p.n + '’s garden bed is a rectangle with a half circle on one end (the dashed line is not an edge). Plastic edging goes all the way around it. Edging is sold in ' + L(s.pc, 'm') + ' pieces for ' + MM(s.pr) + ' each. How many pieces does ' + p.he + ' need, and what do they cost before tax?' + bedFig(Ln, Wd, 'm'), specs,
      br(['Straight sides: ' + t(N(Ln) + '+' + N(Ln) + '+' + N(Wd) + '=' + N(2 * Ln + Wd)) + ' m; curved edge: ' + t('\\pi\\times ' + N(Wd) + '\\div 2' + eqR(PI * Wd / 2, 3)) + ' m', 'Perimeter: ' + t(N(2 * Ln + Wd) + '+' + N(rd(PI * Wd / 2, 3)) + eqR(P0, 2)) + ' m', 'Pieces: ' + t(N(rd(P0, 3)) + '\\div ' + N(s.pc) + eqR(P0 / s.pc, 2)) + ', so ' + n + ' pieces (round up)', 'Cost: ' + t(n + '\\times ' + Mt(s.pr) + '=' + Mt(cost))]),
      ['Perimeter = the straight sides + the curved edge (πd ÷ 2). The dashed line is not part of it.', 'Pieces = perimeter ÷ length of one piece, rounded up. Then multiply by the price.'], o.text || 'edging with a half circle');
  }
  /* ---- M3: a fence section of boards and gaps ---- */
  function fencePart(r, o) {
    o = o || {}; var p = person(r);
    var Wb = r.pick([[11, 2], [7, 2], [23, 4], [29, 4], [29, 8], [15, 4]]), g = r.pick([[3, 4], [1, 2], [5, 8], [1, 4], [3, 8]]), n = r.int(8, 16);
    var wv = fv(Wb), gv = fv(g), Lv = n * wv + (n - 1) * gv, fr = frOf(Lv, 16), wW = Math.floor(wv), wF = wv - wW;
    return mixPart(p.n + ' is building a fence section from ' + t(n) + ' boards. Each board is ' + t(mixT(Wb) + '\\text{ in}') + ' wide. ' + cap(p.he) + ' leaves a ' + t(frT(g) + '\\text{ in}') + ' gap between each pair of boards (there is no gap at the ends). How long is the fence section, in inches? Give a mixed number.', fr, { after: 'in',
      diag: [{ v: n * wv + n * gv, code: 'u3t-gaps-n', hint: t(n) + ' boards have only ' + t(n - 1) + ' gaps <b>between</b> them.' }, { v: n * wv + (n + 1) * gv, code: 'u3t-gaps-n', hint: 'There are no gaps at the ends: ' + t(n) + ' boards have ' + t(n - 1) + ' gaps.' }, { v: n * wv, code: 'u3t-no-gaps', hint: 'Add the ' + (n - 1) + ' gaps too.' }, { v: n * wW + wF + (n - 1) * gv, code: 'u3t-mix-mult', hint: 'Change ' + t(mixT(Wb)) + ' to an improper fraction before you multiply: every board has the fraction part too.' }],
      sol: br(['Boards: ' + t(n + '\\times ' + mixT(Wb) + '=\\frac{' + n + '}{1}\\times ' + frT(Wb) + '=' + frT(R(n * Wb[0], Wb[1])) + (n * Wb[0] % Wb[1] ? '=' + mixT(R(n * Wb[0], Wb[1])) : '')) + ' in', t(n) + ' boards have ' + t(n - 1) + ' gaps: ' + t((n - 1) + '\\times ' + frT(g) + '=' + frT(R((n - 1) * g[0], g[1])) + ((n - 1) * g[0] > g[1] && (n - 1) * g[0] % g[1] ? '=' + mixT(R((n - 1) * g[0], g[1])) : '')) + ' in', 'Total: ' + t(mixT(frOf(n * wv, 16)) + '+' + mixT(frOf((n - 1) * gv, 16)) + '=' + mixT(fr)) + ' in']),
      hints: ['Boards: multiply (change the mixed number to an improper fraction first).', 'How many gaps are there between ' + n + ' boards? Add them on.'], text: o.text || 'fence boards and gaps' });
  }
  A.tapeDiag = tapeDiag; A.tapeSol = tapeSol; A.tapePos = tapePos; A.tapeReadPart = tapeReadPart; A.circumfPart = circumfPart; A.circleFig = circleFig; A.CIRC = CIRC; A.boardLeftPart = boardLeftPart; A.lShape = lShape; A.lYardPart = lYardPart; A.bedFig = bedFig; A.bedEdgingPart = bedEdgingPart; A.fencePart = fencePart;

  /* ---- A1: one-step rearranging ---- */
  function oneStepPart(r, o) {
    o = o || {}; var kind = o.kind || r.pick(['sq', 'rug', 'tri']);
    if (kind === 'sq') {
      var s = q(r.int(25, 160) / 4), Pq = q(4 * s), u = r.pick(['ft', 'm']);
      return numPart('A square patio has a perimeter of ' + L(Pq, u) + '. How long is each side? Use ' + t('P=4s') + '.', s, { after: u, diag: [{ v: 4 * Pq, code: 'u3t-undo-wrong', hint: 's is <b>multiplied</b> by 4, so undo it by <b>dividing</b> by 4.' }, { v: Pq - 4, code: 'u3t-undo-wrong', hint: 'The 4 multiplies s: divide both sides by 4.' }, { v: Pq / 2, code: 'u3t-sq-two', hint: 'A square has <b>4</b> equal sides: ÷ 4.' }],
        sol: br([t(N(Pq) + '=4s') + ': divide both sides by 4.', t('s=' + N(Pq) + '\\div 4=' + N(s)) + ' ' + u + ' &nbsp;Check: ' + t('4\\times ' + N(s) + '=' + N(Pq)) + ' ✓']), hints: ['Substitute: ' + N(Pq) + ' = 4s.', 'Undo × 4 by dividing by 4.'], text: o.text || 'square side from P' });
    }
    if (kind === 'rug') {
      var l = r.pick([2, 2.5, 3, 4, 1.5, 3.2, 1.6, 2.4]), w = q(pickR(r, 1, 3.5, 0.5)), Ar = q(l * w);
      if (near(l, w)) w = q(w + 0.5), Ar = q(l * w);
      return numPart('A rectangular rug has an area of ' + L(Ar, 'm²') + '. It is ' + L(l, 'm') + ' long. How wide is it? Use ' + t('A=lw') + '.', w, { after: 'm', diag: [{ v: Ar * l, code: 'u3t-undo-wrong', hint: 'w is multiplied by ' + N(l) + ': undo it by <b>dividing</b>.' }, { v: Ar - l, code: 'u3t-undo-wrong', hint: 'A = l × w: the length multiplies, so divide.' }, { v: Ar / 2, code: 'u3t-undo-wrong', hint: 'Divide by the <b>length</b>, ' + N(l) + '.' }],
        sol: br([t(N(Ar) + '=' + N(l) + '\\times w') + ': divide both sides by ' + N(l) + '.', t('w=' + N(Ar) + '\\div ' + N(l) + '=' + N(w)) + ' m &nbsp;Check: ' + t(N(l) + '\\times ' + N(w) + '=' + N(Ar)) + ' ✓']), hints: ['Substitute: ' + N(Ar) + ' = ' + N(l) + ' × w.', 'Undo the multiplication by dividing.'], text: o.text || 'width from A = lw' });
    }
    var a = q(r.int(18, 48) / 10), b = q(r.int(18, 48) / 10), c = q(r.int(18, 48) / 10), Pt = q(a + b + c);
    return numPart('Wood edging for a triangle-shaped flower bed is ' + L(Pt, 'm') + ' long. Two sides are ' + L(a, 'm') + ' and ' + L(b, 'm') + '. How long is the third side? Use ' + t('P=a+b+c') + '.', c, { after: 'm',
      diag: [{ v: Pt - a, code: 'u3t-one-side', hint: 'Take away <b>both</b> known sides.' }, { v: Pt + a + b, code: 'u3t-undo-wrong', hint: 'The known sides are added, so undo by <b>subtracting</b> them.' }, { v: a + b, code: 'u3t-gave-used', hint: 'That’s the two known sides. Subtract it from the perimeter.' }],
      sol: br([t(N(Pt) + '=' + N(a) + '+' + N(b) + '+c=' + N(q(a + b)) + '+c'), t('c=' + N(Pt) + '-' + N(q(a + b)) + '=' + N(c)) + ' m &nbsp;Check: ' + t(N(a) + '+' + N(b) + '+' + N(c) + '=' + N(Pt)) + ' ✓']), hints: ['Substitute the numbers you know.', 'Undo the adding by subtracting.'], text: o.text || 'third side from P' });
  }
  /* ---- A1: a diameter (or radius) from a circumference ---- */
  var DCTX = [['An arborist wraps a tape measure around a spruce trunk. The circumference is', 'cm', 90, 260, 'the trunk'], ['A hula hoop has a circumference of', 'cm', 200, 290, 'the hoop'], ['A round table has metal trim around its edge. The trim is', 'in', 90, 160, 'the table'],
    ['A round pool cover has an edge', 'm', 9, 20, 'the cover'], ['A round clock face has a circumference of', 'cm', 60, 120, 'the clock face'], ['A round garden bed has edging all the way around. The edging is', 'm', 6, 15, 'the bed']];
  function diamPart(r, o) {
    o = o || {}; var c = r.pick(DCTX), C = c[2] < 30 ? q(r.int(c[2] * 10, c[3] * 10) / 10) : r.int(c[2], c[3]), wantR = !!o.radius, ans = wantR ? C / (2 * PI) : C / PI;
    var diag = wantR ? [{ v: C / PI, code: 'u3t-r-d', hint: 'That’s the diameter. The radius is half of it: r = C ÷ (2π).' }, { v: C / 2 * PI, code: 'u3t-calc-order', hint: 'Divide by 2 <b>and</b> by π: type C ÷ ( 2 × π ), with brackets, or ÷ 2 ÷ π.' }, { v: C * 2 * PI, code: 'u3t-undo-wrong', hint: 'C = 2πr multiplies r by 2π: undo it by dividing.' }]
      : [{ v: C / (2 * PI), code: 'u3t-r-d', hint: 'That’s the radius. The diameter is d = C ÷ π.' }, { v: C * PI, code: 'u3t-undo-wrong', hint: 'C = πd multiplies d by π: undo it by <b>dividing</b> by π.' }, { v: C / 2, code: 'u3t-no-pi', hint: 'Divide by π (about 3.14), not by 2.' }];
    return numPart(c[0] + ' ' + L(C, c[1]) + '. Find the ' + (wantR ? 'radius' : 'diameter') + ' of ' + c[4] + ', to the nearest tenth. (' + (wantR ? t('C=2\\pi r') : t('C=\\pi d')) + ')', ans, { dp: 1, after: c[1], diag: diag, p314: wantR ? C / 6.28 : C / 3.14,
      sol: br([wantR ? t('r=C\\div (2\\pi)=' + N(C) + '\\div (2\\times\\pi)' + eqR(ans, 1) + uT(c[1])) : t('d=C\\div\\pi=' + N(C) + '\\div\\pi' + eqR(ans, 1) + uT(c[1])), 'Check: ' + (wantR ? t('2\\times\\pi\\times ' + N(rd(ans, 1)) + '\\approx ' + N(rd(2 * PI * rd(ans, 1), 1))) : t('\\pi\\times ' + N(rd(ans, 1)) + '\\approx ' + N(rd(PI * rd(ans, 1), 1)))) + ' ✓ (a diameter is about a third of the circumference)']),
      hints: [wantR ? 'Rearrange C = 2πr: divide both sides by 2π.' : 'Rearrange C = πd: divide both sides by π.', 'Use the π key' + (wantR ? ' and brackets: C ÷ (2 × π).' : '.')], text: o.text || (wantR ? 'radius from C' : 'diameter from C') });
  }
  /* ---- A1: two steps, P = 2l + 2w ---- */
  function rinkPart(r, o) {
    o = o || {}; var findW = !!o.findW, c = r.pick([['A rectangular outdoor rink uses', 'of boards around the outside', 'ft', 'rink'], ['A rectangular garden is fenced with', 'of fencing', 'm', 'garden'], ['A rectangular picture frame uses', 'of moulding', 'in', 'frame'], ['A rectangular dog park has', 'of fence around it', 'm', 'park']]);
    var s = find(function () { var l = c[2] === 'in' ? pickR(r, 14, 40, 0.5) : pickR(r, 18, 110, 0.5), w = c[2] === 'in' ? pickR(r, 8, 30, 0.5) : pickR(r, 9, 60, 0.5); return [l, w]; }, function (v) { return v[0] > v[1] + 3 && (v[0] % 1 !== 0 || v[1] % 1 !== 0 || r.chance(0.3)); });
    var l = s[0], w = s[1], Pr = q(2 * l + 2 * w), known = findW ? l : w, ans = findW ? w : l, kn = findW ? 'long' : 'wide', an = findW ? 'wide' : 'long', kv = findW ? 'l' : 'w', av = findW ? 'w' : 'l';
    return numPart(c[0] + ' ' + L(Pr, c[2]) + ' ' + c[1] + '. The ' + c[3] + ' is ' + L(known, c[2]) + ' ' + kn + '. How ' + an + ' is it? (' + t('P=2l+2w') + ')', ans, { after: c[2],
      diag: [{ v: Pr - 2 * known, code: 'u3t-half-step', hint: t(N(Pr) + '-' + N(2 * known)) + ' is the <b>two</b> ' + (findW ? 'widths' : 'lengths') + ' together. Divide by 2.' }, { v: (Pr - known) / 2, code: 'u3t-one-w', hint: 'There are <b>two</b> ' + (findW ? 'lengths' : 'widths') + ' in the perimeter: subtract ' + t('2' + kv + '=' + N(2 * known)) + '.' }, { v: Pr - known, code: 'u3t-one-w', hint: 'Subtract both ' + (findW ? 'lengths' : 'widths') + ' (2' + kv + '), then divide by 2.' }, { v: Pr / 2 + known, code: 'u3t-undo-wrong', hint: 'Undo the + 2' + kv + ' by <b>subtracting</b> it.' }],
      sol: br([t(N(Pr) + '=2' + av + '+2(' + N(known) + ')=2' + av + '+' + N(2 * known)), 'Subtract ' + N(2 * known) + ': ' + t('2' + av + '=' + N(Pr - 2 * known)) + '; divide by 2: ' + t(av + '=' + N(ans)) + ' ' + c[2], 'Check: ' + t('2(' + N(l) + ')+2(' + N(w) + ')=' + N(2 * l) + '+' + N(2 * w) + '=' + N(Pr)) + ' ✓']),
      hints: ['Undo + first: subtract 2' + kv + ' from both sides.', 'Then undo × 2: divide by 2. Check by putting your answer back in.'], text: o.text || (findW ? 'width from P' : 'length from P') });
  }
  /* ---- A1: one length of edging as a circle and as a square ---- */
  function bedCSPart(r, o) {
    o = o || {}; var E = q(r.int(60, 200) / 10), wantR = r.chance(0.4), d = E / PI, rr = E / (2 * PI), side = E / 4;
    var specs = [nfld(wantR ? 'Circle, radius:' : 'Circle, diameter:', wantR ? rr : d, { name: wantR ? 'Radius' : 'Diameter', dp: 1, after: 'm', p314: wantR ? E / 6.28 : E / 3.14,
      diag: wantR ? [{ v: d, code: 'u3t-r-d', hint: 'That’s the diameter. r = C ÷ (2π).' }, { v: E / 2 * PI, code: 'u3t-calc-order', hint: 'Use brackets: C ÷ (2 × π).' }] : [{ v: rr, code: 'u3t-r-d', hint: 'That’s the radius. d = C ÷ π.' }, { v: E * PI, code: 'u3t-undo-wrong', hint: 'Divide by π.' }] }),
      nfld('Square, each side:', side, { name: 'Side', dp: 2, after: 'm', diag: [{ v: E / 2, code: 'u3t-sq-two', hint: 'A square has <b>4</b> equal sides: s = P ÷ 4.' }, { v: E * 4, code: 'u3t-undo-wrong', hint: 'P = 4s: divide by 4.' }] })];
    return fieldsPart('A school has ' + L(E, 'm') + ' of edging for a new flower bed. All of it goes around the bed. (a) If the bed is a circle, what is its ' + (wantR ? 'radius' : 'diameter') + ', to the nearest tenth? (b) If the bed is a square, how long is each side, to the nearest hundredth?', specs,
      br(['(a) ' + (wantR ? t('r=C\\div (2\\pi)=' + N(E) + '\\div (2\\pi)' + eqR(rr, 1)) : t('d=C\\div\\pi=' + N(E) + '\\div\\pi' + eqR(d, 1))) + ' m', '(b) ' + t('s=P\\div 4=' + N(E) + '\\div 4' + eqR(side, 2)) + ' m']), ['Circle: C = πd, so d = C ÷ π (and r = C ÷ (2π)).', 'Square: P = 4s, so s = P ÷ 4.'], o.text || 'circle or square bed');
  }
  /* ---- A1: a dog run fenced on three sides ---- */
  function runFig(lab, wl) { return fig2([{ k: 'poly', pts: [[0, 0], [6, 0], [6, 3.2], [0, 3.2]], fill: '#eef3e6', color: ACC, dash: true }, { k: 'line', a: [-0.6, 3.2], b: [6.6, 3.2], sw: 6 }, { k: 'text', at: [3, 3.2], s: 'house wall', dy: -14 }, { k: 'text', at: [3, 0], s: lab, dy: 13 }, { k: 'text', at: [6, 1.6], s: wl, dx: 8, anchor: 'start' }], { w: 280, h: 170, pad: 30, aria: 'dog run against a house wall' }); }
  function dogRunPart(r, o) {
    o = o || {}; var p = person(r);
    if (o.v2 || (o.v2 == null && r.chance(0.5))) {
      var s2 = find(function () { var l = r.pick([12, 15, 16, 18, 20, 24, 25, 30]), w = pickR(r, 6, 14, 0.5); return [l, w]; }, function (v) { return v[0] > v[1] + 2; }), l = s2[0], w = s2[1], Ar = q(l * w), fence = l + 2 * w;
      return numPart(p.n + ' is building a rectangular dog run against the back wall of the house. The wall is one of the long sides, so fence goes on the other three sides only. The run must have an area of ' + L(Ar, 'ft²') + ' and be ' + L(l, 'ft') + ' long along the wall. How much fence does ' + p.he + ' need?' + runFig(l + ' ft', 'w = ?'), fence, { after: 'ft',
        diag: [{ v: 2 * l + 2 * w, code: 'u3t-four-sides', hint: 'The house wall is one side: no fence there. Fence = l + 2w.' }, { v: w, code: 'u3t-gave-w', hint: 'That’s the width. Now add up the three fenced sides.' }, { v: l + w, code: 'u3t-wrong-sides', hint: 'There are <b>two</b> widths (the ends) and one length.' }, { v: 2 * l + w, code: 'u3t-wrong-sides', hint: 'The wall is a <b>length</b>: the fence is one length and two widths.' }],
        sol: br(['Width: ' + t('A=lw') + ', so ' + t('w=A\\div l=' + N(Ar) + '\\div ' + l + '=' + N(w)) + ' ft', 'Fence (one length, two widths): ' + t(l + '+2\\times ' + N(w) + '=' + N(fence)) + ' ft']), hints: ['Rearrange A = lw to find the width.', 'Which sides get fence? The wall side doesn’t.'], text: o.text || 'dog run: fence from the area' });
    }
    var s = find(function () { var l = pickR(r, 12, 30, 1), w = pickR(r, 5, 14, 0.5); return [l, w]; }, function (v) { return v[0] > v[1] + 3; }), l1 = s[0], w1 = s[1], Fn = q(l1 + 2 * w1);
    return numPart(p.n + ' is building a rectangular dog run against the back wall of the house. The wall is one of the long sides, so fence goes on the other three sides only. ' + cap(p.he) + ' has ' + L(Fn, 'ft') + ' of fencing and wants the run to be ' + L(l1, 'ft') + ' long along the wall. How wide can the run be?' + runFig(l1 + ' ft', 'w = ?'), w1, { after: 'ft',
      diag: [{ v: Fn - 2 * l1 > 0 ? (Fn - 2 * l1) / 2 : null, code: 'u3t-four-sides', hint: 'Only <b>one</b> length gets fence (the wall is the other): F = l + 2w.' }, { v: Fn - l1, code: 'u3t-half-step', hint: t(N(Fn) + '-' + l1) + ' is the two widths together: ÷ 2.' }, { v: Fn / 3, code: 'u3t-wrong-sides', hint: 'The three sides are not equal: F = l + 2w.' }, { v: (Fn + l1) / 2, code: 'u3t-undo-wrong', hint: 'Undo the + l by <b>subtracting</b> it.' }],
      sol: br(['Fence = one length + two widths: ' + t(N(Fn) + '=' + l1 + '+2w'), 'Subtract ' + l1 + ': ' + t('2w=' + N(Fn - l1)) + '; divide by 2: ' + t('w=' + N(w1)) + ' ft', 'Check: ' + t(l1 + '+2\\times ' + N(w1) + '=' + N(Fn)) + ' ✓']), hints: ['Write a formula for the fence: only three sides, one length and two widths.', 'Undo the + first, then the × 2.'], text: o.text || 'dog run: width from the fence' });
  }
  A.oneStepPart = oneStepPart; A.diamPart = diamPart; A.rinkPart = rinkPart; A.bedCSPart = bedCSPart; A.dogRunPart = dogRunPart;

  /* ---- M4: the area of a 2-D shape ---- */
  function areaShapePart(r, o) {
    o = o || {}; var kind = r.pick(o.kinds || ['para', 'tri', 'trap', 'circ']), u = r.pick(['cm', 'm', 'in', 'ft']), u2 = u + '²', A0, fig, pr, diag = [], sol, hints, p314 = null;
    var big = u === 'm' || u === 'ft';
    if (kind === 'rect') {
      var lr = big ? pickR(r, 3, 14, 0.5) : pickR(r, 8, 40, 0.5), wr = big ? pickR(r, 2, 9, 0.5) : pickR(r, 5, 25, 0.5); if (near(lr, wr)) lr = q(lr + 1.5);
      A0 = lr * wr; fig = fig2([{ k: 'poly', pts: [[0, 0], [lr, 0], [lr, wr], [0, wr]] }, { k: 'text', at: [lr / 2, 0], s: Np(lr) + ' ' + u, dy: 13 }, { k: 'text', at: [lr, wr / 2], s: Np(wr) + ' ' + u, dx: 8, anchor: 'start' }], { w: 260, h: 180, aria: 'rectangle' });
      pr = 'Find the area of the rectangle.'; diag = [{ v: 2 * lr + 2 * wr, code: 'u3t-area-not-p', hint: 'That’s the perimeter. Area = length × width.' }, { v: lr + wr, code: 'u3t-area-not-p', hint: 'Area = length × width (multiply).' }];
      sol = t('A=lw=' + N(lr) + '\\times ' + N(wr) + eqR(A0, 1) + uT(u2)); hints = ['A = l × w.'];
    } else if (kind === 'para') {
      var b = big ? pickR(r, 4, 15, 0.5) : pickR(r, 6, 24, 0.5), h = big ? r.int(3, 9) : r.int(4, 16), off = q(h * r.pick([0.4, 0.5, 0.6, 0.75])), sl = rd(Math.sqrt(h * h + off * off), 1);
      A0 = b * h; fig = fig2([{ k: 'poly', pts: [[0, 0], [b, 0], [b + off, h], [off, h]] }, { k: 'line', a: [off, h], b: [off, 0], dash: true }, { k: 'right', at: [off, 0], u: [1, 0], v: [0, 1] }, { k: 'text', at: [b / 2, 0], s: Np(b) + ' ' + u, dy: 13 }, { k: 'text', at: [off, h / 2], s: Np(h) + ' ' + u, dx: 6, anchor: 'start' }, { k: 'text', at: [b + off / 2, h / 2], s: Np(sl) + ' ' + u, dx: 8, anchor: 'start' }], { w: 280, h: 180, aria: 'parallelogram' });
      pr = 'Find the area of the parallelogram. Round to the nearest tenth if you need to.'; diag = [{ v: b * sl, code: 'u3t-slant', hint: 'Use the <b>height</b> (the dashed line, at a right angle to the base), not the slanted side.' }, { v: b * h / 2, code: 'u3t-half-extra', hint: 'A parallelogram is not a triangle: A = bh, with no ½.' }, { v: 2 * b + 2 * sl, code: 'u3t-area-not-p', hint: 'That’s the perimeter. A = bh.' }];
      sol = t('A=bh=' + N(b) + '\\times ' + N(h) + eqR(A0, 1) + uT(u2)); hints = ['A = base × height.', 'The height is the dashed line, at a right angle to the base.'];
    } else if (kind === 'tri') {
      var half = r.chance(0.4), bt = half ? q(r.int(3, 11) + 0.5) : (big ? r.int(4, 16) : r.int(6, 24)), ht = big ? r.int(3, 10) : r.int(4, 18), px = q(bt * r.pick([0.3, 0.4, 0.6, 0.7])), s1 = rd(Math.hypot(px, ht), 1), s2 = rd(Math.hypot(bt - px, ht), 1);
      if (half) u = r.pick(['ft', 'in']), u2 = u + '²';
      A0 = bt * ht / 2; fig = fig2([{ k: 'poly', pts: [[0, 0], [bt, 0], [px, ht]] }, { k: 'line', a: [px, ht], b: [px, 0], dash: true }, { k: 'right', at: [px, 0], u: [1, 0], v: [0, 1] }, { k: 'text', at: [bt / 2, 0], s: xU(bt) + ' ' + u, dy: 13 }, { k: 'text', at: [px, ht * 0.45], s: Np(ht) + ' ' + u, dx: 6, anchor: 'start' }, { k: 'text', at: [px / 2, ht / 2], s: Np(s1) + ' ' + u, dx: -8, anchor: 'end' }, { k: 'text', at: [(px + bt) / 2, ht / 2], s: Np(s2) + ' ' + u, dx: 8, anchor: 'start' }], { w: 280, h: 190, aria: 'triangle' });
      pr = 'Find the area of the triangle' + (half ? ' (the base is ' + t(xT(bt) + uT(u)) + ')' : '') + '. Round to the nearest tenth if you need to.'; diag = [{ v: bt * ht, code: 'u3t-no-half', hint: 'Base × height is the whole parallelogram: a triangle is half of it. A = ½bh.' }, { v: bt * s1 / 2, code: 'u3t-slant', hint: 'Use the height (the dashed line), not a slanted side.' }, { v: bt * s2 / 2, code: 'u3t-slant', hint: 'Use the height (the dashed line), not a slanted side.' }];
      sol = t('A=\\frac{1}{2}bh=\\frac{1}{2}\\times ' + N(bt) + '\\times ' + N(ht) + eqR(A0, 1) + uT(u2)); hints = ['A = ½ × base × height.', 'The height is the dashed line' + (half ? '; ' + xU(bt) + ' = ' + N(bt) + '.' : '.')];
    } else if (kind === 'trap') {
      var a2 = big ? pickR(r, 2, 8, 0.5) : pickR(r, 4, 14, 1), b2 = q(a2 + (big ? pickR(r, 1.5, 6, 0.5) : r.int(3, 10))), h2 = big ? pickR(r, 2, 6, 0.5) : r.int(3, 12), o2 = q((b2 - a2) * r.pick([0.3, 0.5, 0.7]));
      A0 = (a2 + b2) * h2 / 2; fig = fig2([{ k: 'poly', pts: [[0, 0], [b2, 0], [o2 + a2, h2], [o2, h2]] }, { k: 'line', a: [o2, h2], b: [o2, 0], dash: true }, { k: 'right', at: [o2, 0], u: [1, 0], v: [0, 1] }, { k: 'text', at: [b2 / 2, 0], s: Np(b2) + ' ' + u, dy: 13 }, { k: 'text', at: [o2 + a2 / 2, h2], s: Np(a2) + ' ' + u, dy: -12 }, { k: 'text', at: [o2, h2 / 2], s: Np(h2) + ' ' + u, dx: 6, anchor: 'start' }], { w: 280, h: 180, aria: 'trapezoid' });
      pr = 'Find the area of the trapezoid. Round to the nearest tenth if you need to.'; diag = [{ v: (a2 + b2) * h2, code: 'u3t-no-half', hint: 'Don’t forget the ½: A = ½(a + b)h.' }, { v: a2 * b2 * h2, code: 'u3t-all-three', hint: '<b>Add</b> the parallel sides first: A = ½(a + b)h.' }, { v: b2 * h2 / 2, code: 'u3t-trap-one', hint: 'Use <b>both</b> parallel sides: add them first.' }, { v: a2 * h2 / 2, code: 'u3t-trap-one', hint: 'Use both parallel sides: ½(a + b)h.' }];
      sol = t('A=\\frac{1}{2}(a+b)h=\\frac{1}{2}\\times(' + N(a2) + '+' + N(b2) + ')\\times ' + N(h2) + eqR(A0, 1) + uT(u2)); hints = ['A = ½(a + b)h: add the two parallel sides first.'];
    } else {
      var isR = r.chance(0.5), d = big ? pickR(r, 2, 12, 0.5) : r.int(8, 40), rr = q(d / 2);
      A0 = PI * rr * rr; p314 = 3.14 * rr * rr; fig = circleFig(Np(isR ? rr : d), u, isR);
      pr = 'Find the area of a circle with a ' + (isR ? 'radius' : 'diameter') + ' of ' + L(isR ? rr : d, u) + '. Round to the nearest tenth.';
      diag = [{ v: PI * d * d, code: 'u3t-d-as-r', hint: isR ? 'Use r = ' + N(rr) + ' in A = πr².' : 'Halve the diameter first: r = ' + N(rr) + '.' }, { v: PI * rr * 2, code: 'u3t-r-times-2', hint: 'r² means r × r, not r × 2.' }, { v: 2 * PI * rr, code: 'u3t-c-not-a', hint: 'That’s the circumference. The area is A = πr².' }, { v: PI * d * 2, code: 'u3t-r-times-2', hint: 'Halve the diameter, then square the radius: r × r.' }];
      sol = br([isR ? '' : t('r=' + N(d) + '\\div 2=' + N(rr)) + ' ' + u, t('A=\\pi r^2=\\pi\\times ' + N(rr) + '^2' + eqR(A0, 1) + uT(u2))]); hints = ['A = πr². ' + (isR ? '' : 'Halve the diameter first.'), 'Use the π key and the x² key.'];
    }
    return numPart(pr + fig, A0, { dp: 1, after: u2, diag: diag, p314: p314, sol: sol, hints: hints, text: o.text || 'area of a ' + kind });
  }
  /* ---- M4: an irregular shape on a grid ---- */
  function gridPart(r, o) {
    o = o || {}; var cols = 10, rows = 7;
    var s = find(function () {
      var cells = []; for (var i = 0; i < cols * rows; i++) cells.push(0);
      var target = r.int(9, 20), blob = [[r.int(3, 6), r.int(2, 4)]]; cells[blob[0][1] * cols + blob[0][0]] = 1;
      for (var g = 0; g < 300 && blob.length < target; g++) { var b0 = r.pick(blob), dd = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), x = b0[0] + dd[0], y = b0[1] + dd[1]; if (x < 1 || y < 1 || x > cols - 2 || y > rows - 2 || cells[y * cols + x]) continue; cells[y * cols + x] = 1; blob.push([x, y]); }
      for (var y2 = 0; y2 < rows; y2++) for (var x2 = 0; x2 < cols; x2++) { if (cells[y2 * cols + x2]) continue; var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (e) { var xx = x2 + e[0], yy = y2 + e[1]; return xx >= 0 && yy >= 0 && xx < cols && yy < rows && cells[yy * cols + xx] === 1; }); if (nb && r.chance(0.85)) cells[y2 * cols + x2] = 2; }
      var full = cells.filter(function (c) { return c === 1; }).length, part = cells.filter(function (c) { return c === 2; }).length; return { cells: cells, full: full, part: part };
    }, function (s) { return s.full >= 8 && s.part >= 8; });
    var side = r.pick([2, 3, 5, 0.5]), u = 'm', sq = q(side * side), sqN = s.full + s.part / 2, ans = q(sqN * sq), what = r.pick(['a new skating pond', 'an oil spill on a parking lot', 'a wetland', 'a flower garden']);
    return numPart('A plan shows ' + what + ' on a grid. Each square is ' + L(side, u) + ' by ' + L(side, u) + '. The <b>dark</b> squares are covered all the way (full squares). The <b>light</b> squares are only partly covered (part squares). Estimate the area.' + gridSvg(s.cells, cols, rows), ans, { after: 'm²',
      diag: [{ v: (s.full + s.part) * sq, code: 'u3t-part-full', hint: 'A part square counts as about <b>half</b> a square: part squares ÷ 2.' }, { v: s.full * sq, code: 'u3t-no-part', hint: 'Count the part squares too (each about half a square).' }, { v: sqN * side, code: 'u3t-sq-side', hint: 'Each square has an area of ' + t(N(side) + '\\times ' + N(side) + '=' + N(sq)) + ' m², not ' + N(side) + ' m².' }, { v: sqN, code: 'u3t-count-only', hint: 'That’s the number of squares. Multiply by the area of one square, ' + N(sq) + ' m².' }, { v: (s.full / 2 + s.part) * sq, code: 'u3t-part-full', hint: 'Halve the <b>part</b> squares, not the full ones.' }],
      sol: br(['Full squares: ' + s.full + '; part squares: ' + s.part + ', and ' + t(s.part + '\\div 2=' + N(s.part / 2)), t(s.full + '+' + N(s.part / 2) + '=' + N(sqN)) + ' squares', 'One square: ' + t(N(side) + '\\times ' + N(side) + '=' + N(sq)) + ' m²; area ≈ ' + t(N(sqN) + '\\times ' + N(sq) + '=' + N(ans)) + ' m²']),
      hints: ['Area ≈ (full squares + part squares ÷ 2) × area of one square.', 'One square is ' + side + ' m by ' + side + ' m.'], text: o.text || 'irregular area on a grid' });
  }
  /* ---- M4: composite areas ---- */
  function stageFig(Wd, D) { var arc = arcPts(Wd / 2, 0, Wd / 2, 0, -180, 30); return fig2([{ k: 'poly', pts: [[0, 0]].concat(arc.slice(1, -1).reverse()).concat([[Wd, 0], [Wd, D], [0, D]]).reverse() }, { k: 'line', a: [0, 0], b: [Wd, 0], dash: true }, { k: 'text', at: [Wd / 2, D], s: Np(Wd) + ' m', dy: -12 }, { k: 'text', at: [0, D / 2], s: Np(D) + ' m', dx: -8, anchor: 'end' }], { w: 260, h: 230, pad: 36, aria: 'rectangle with a half circle' }); }
  function compositePart(r, o) {
    o = o || {}; var kind = o.kind || r.pick(['stage', 'lawn']);
    if (kind === 'lshape') {
      var s = lShape(r, o), u = s.u;
      return numPart('Find the area of the L-shaped floor. All the corners are square.' + s.fig(false), s.A, { after: u + '²',
        diag: [{ v: s.W * s.H, code: 'u3t-no-cutout', hint: 'The whole rectangle includes the missing corner. Split the shape into two rectangles (or take away the corner).' }, { v: s.W * s.R + s.T * s.H, code: 'u3t-overlap', hint: 'Your two rectangles overlap: count each square unit only once.' }, { v: s.P, code: 'u3t-area-not-p', hint: 'That’s the perimeter. Area: split into rectangles and add.' }],
        sol: br(['Bottom rectangle: ' + t(s.W + '\\times ' + s.R + '=' + s.W * s.R), 'Top rectangle: ' + t(s.T + '\\times (' + s.H + '-' + s.R + ')=' + s.T + '\\times ' + (s.H - s.R) + '=' + s.T * (s.H - s.R)), 'Area: ' + t(s.W * s.R + '+' + s.T * (s.H - s.R) + '=' + s.A + uT(u + '²'))]),
        hints: ['Split the shape into two rectangles that don’t overlap.', 'Find any missing side: the long side − the part you know.'], text: o.text || 'L-shape area' });
    }
    if (kind === 'stage') {
      var Wd = r.int(6, 12), D = r.int(4, 8), rr = Wd / 2, Ar = Wd * D + PI * rr * rr / 2;
      return numPart('A school stage is a rectangle ' + L(Wd, 'm') + ' wide and ' + L(D, 'm') + ' deep, with a half circle across the front. The half circle is ' + L(Wd, 'm') + ' across. Find the area of the stage floor, to the nearest hundredth.' + stageFig(Wd, D), Ar, { dp: 2, after: 'm²', p314: Wd * D + 3.14 * rr * rr / 2,
        diag: [{ v: Wd * D + PI * rr * rr, code: 'u3t-full-circle', hint: 'Only <b>half</b> a circle: ½ × πr².' }, { v: Wd * D + PI * Wd * Wd / 2, code: 'u3t-d-as-r', hint: 'The half circle is ' + Wd + ' m <b>across</b>: its radius is ' + N(rr) + ' m.' }, { v: Wd * D, code: 'u3t-missing-piece', hint: 'Add the half circle at the front.' }, { v: Wd * D + PI * rr / 2, code: 'u3t-r-times-2', hint: 'πr² means π × r × r.' }],
        sol: br(['Rectangle: ' + t(Wd + '\\times ' + D + '=' + Wd * D) + ' m²', 'Half circle: ' + t('r=' + N(rr)) + '; ' + t('\\frac{1}{2}\\times\\pi\\times ' + N(rr) + '^2' + eqR(PI * rr * rr / 2, 3)) + ' m²', 'Total: ' + t(Wd * D + '+' + N(rd(PI * rr * rr / 2, 3)) + eqR(Ar, 2)) + ' m²']),
        hints: ['Split it: a rectangle and a half circle.', 'Half circle: ½ × πr², with r = half of ' + Wd + ' m.'], text: o.text || 'stage area' });
    }
    var Ln = r.int(12, 20), Wl = r.int(8, 15), pd = r.pick([2, 2.4, 3, 3.6, 4, 2.8]), deck = r.chance(0.6), da = deck ? r.int(3, 6) : 0, db = deck ? pickR(r, 3, 5, 0.5) : 0, rp = pd / 2, pond = PI * rp * rp, Al = Ln * Wl - da * db - pond, fam = r.pick(['Nguyen', 'Singh', 'Martin', 'Chen', 'Okafor', 'Tremblay', 'Ali', 'Morin', 'Lee', 'Gagnon']);
    var lawnFig = fig2([{ k: 'poly', pts: [[0, 0], [Ln, 0], [Ln, Wl], [0, Wl]], fill: '#e3efd9' }].concat(deck ? [{ k: 'poly', pts: [[0, Wl - db], [da, Wl - db], [da, Wl], [0, Wl]], fill: '#e4dccd' }, { k: 'text', at: [da / 2, Wl - db / 2], s: 'deck', size: 12 }] : []).concat([{ k: 'circle', c: [Ln * 0.66, Wl * 0.42], r: rp, fill: '#cfe2f1' }, { k: 'text', at: [Ln * 0.66, Wl * 0.42], s: 'pond', size: 12 }, { k: 'text', at: [Ln / 2, 0], s: Ln + ' m', dy: 13 }, { k: 'text', at: [Ln, Wl / 2], s: Wl + ' m', dx: 8, anchor: 'start' }]), { w: 300, h: 220, aria: 'back yard with a deck and a pond' });
    return numPart('The ' + fam + ' family’s back yard is a rectangle ' + L(Ln, 'm') + ' by ' + L(Wl, 'm') + '. It has ' + (deck ? 'a deck ' + L(da, 'm') + ' by ' + L(db, 'm') + ' and ' : '') + 'a round pond ' + L(pd, 'm') + ' across. The rest will be sod (grass). Find the area of sod, to the nearest hundredth.' + lawnFig, Al, { dp: 2, after: 'm²', p314: Ln * Wl - da * db - 3.14 * rp * rp,
      diag: [{ v: Ln * Wl + da * db + pond, code: 'u3t-added-cut', hint: 'The ' + (deck ? 'deck and pond are' : 'pond is') + ' <b>not</b> sod: take ' + (deck ? 'them' : 'it') + ' away.' }, { v: Ln * Wl - da * db - PI * pd * pd, code: 'u3t-d-as-r', hint: 'The pond is ' + N(pd) + ' m <b>across</b>: r = ' + N(rp) + ' m.' }, { v: Ln * Wl - da * db, code: 'u3t-missing-piece', hint: 'Take away the pond too.' }].concat(deck ? [{ v: Ln * Wl - pond, code: 'u3t-missing-piece', hint: 'Take away the deck too.' }] : []),
      sol: br(['Whole yard: ' + t(Ln + '\\times ' + Wl + '=' + Ln * Wl) + ' m²', deck ? 'Deck: ' + t(da + '\\times ' + N(db) + '=' + N(da * db)) + ' m²' : '', 'Pond: ' + t('r=' + N(rp)) + '; ' + t('\\pi\\times ' + N(rp) + '^2' + eqR(pond, 3)) + ' m²', 'Sod: ' + t(Ln * Wl + (deck ? '-' + N(da * db) : '') + '-' + N(rd(pond, 3)) + eqR(Al, 2)) + ' m²']),
      hints: ['Area of sod = the whole yard − the cut-outs.', 'The pond is a circle: r = half the distance across.'], text: o.text || 'lawn minus cut-outs' });
  }
  /* ---- M4: surface area of a solid ---- */
  var PYTH = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
  function solidPart(r, o) {
    o = o || {}; var kind = r.pick(o.kinds || ['box', 'tri', 'cyl', 'pyr', 'cone']), u = r.pick(['cm', 'in']), u2 = u + '²', SA, pr, diag = [], sol, fig, hints, p314 = null;
    if (kind === 'box') {
      var l = r.int(8, 30), w = r.int(5, 20), h = r.int(4, 18); if (l === w || w === h || l === h) h = h + 1;
      SA = 2 * (l * w + l * h + w * h); fig = solid('rectprism', { l: l + ' ' + u, w: w + ' ' + u, h: h + ' ' + u });
      pr = 'A closed box is ' + L(l, u) + ' long, ' + L(w, u) + ' wide and ' + L(h, u) + ' tall. Find its surface area.'; diag = [{ v: l * w * h, code: 'u3t-volume', hint: 'l × w × h is the volume. Surface area <b>adds</b> the areas of the 6 faces.' }, { v: l * w + l * h + w * h, code: 'u3t-half-faces', hint: 'A box has <b>3 pairs</b> of equal faces: count each pair twice.' }];
      sol = br(['Top and bottom: ' + t('2\\times ' + l + '\\times ' + w + '=' + 2 * l * w) + '; front and back: ' + t('2\\times ' + l + '\\times ' + h + '=' + 2 * l * h) + '; ends: ' + t('2\\times ' + w + '\\times ' + h + '=' + 2 * w * h), t('SA=' + 2 * l * w + '+' + 2 * l * h + '+' + 2 * w * h + '=' + SA + uT(u2))]); hints = ['A box has 6 faces in 3 pairs of equal rectangles.', 'Find each pair and add.'];
    } else if (kind === 'tri') {
      var pt = r.pick(PYTH.slice(0, 3)), k = r.pick([1, 1.5, 2]), hb = q(pt[0] * k), ht = q(pt[1] * k), e = q(pt[2] * k), b = q(2 * hb), Lp = r.int(15, 40);
      if (r.chance(0.5)) { ht = q(pt[0] * k); hb = q(pt[1] * k); b = q(2 * hb); }
      SA = b * ht + Lp * (b + 2 * e); fig = solid('triprism', { b: Np(b) + ' ' + u, ht: Np(ht) + ' ' + u, l: Lp + ' ' + u, slant: Np(e) + ' ' + u });
      pr = 'A gift box is a triangular prism. Each triangle end has sides of ' + L(e, u) + ', ' + L(e, u) + ' and ' + L(b, u) + ' and a height of ' + L(ht, u) + '. The box is ' + L(Lp, u) + ' long. Find its surface area.';
      diag = [{ v: 2 * b * ht + Lp * (b + 2 * e), code: 'u3t-no-half', hint: 'Each triangle is ½ × b × h.' }, { v: b * ht + Lp * (b + 2 * ht), code: 'u3t-tri-height', hint: 'The two slanted rectangles are ' + N(e) + ' ' + u + ' wide (the sides of the triangle), not the height.' }, { v: b * ht / 2 * Lp, code: 'u3t-volume', hint: 'That’s the volume. Add the areas of the 5 faces.' }, { v: Lp * (b + 2 * e), code: 'u3t-missing-face', hint: 'Add the two triangle ends.' }, { v: b * ht + Lp * b, code: 'u3t-missing-face', hint: 'There are 3 rectangles: one for each side of the triangle.' }];
      sol = br(['2 triangles: ' + t('2\\times\\frac{1}{2}\\times ' + N(b) + '\\times ' + N(ht) + '=' + N(b * ht)), '3 rectangles: ' + t(N(b) + '\\times ' + Lp + '+2\\times ' + N(e) + '\\times ' + Lp + '=' + N(b * Lp) + '+' + N(2 * e * Lp) + '=' + N(Lp * (b + 2 * e))), t('SA=' + N(b * ht) + '+' + N(Lp * (b + 2 * e)) + '=' + N(SA) + uT(u2))]); hints = ['SA = 2 triangles + 3 rectangles.', 'Use the height for the triangles and the 3 sides for the rectangles.'];
    } else if (kind === 'cyl') {
      var isR = r.chance(0.5), d = r.int(4, 20), rr = q(d / 2), hc = r.int(5, 25);
      SA = 2 * PI * rr * rr + 2 * PI * rr * hc; p314 = 2 * 3.14 * rr * rr + 2 * 3.14 * rr * hc; fig = solid('cylinder', isR ? { r: Np(rr) + ' ' + u, h: hc + ' ' + u } : { d: d + ' ' + u, h: hc + ' ' + u });
      pr = 'A closed cylinder has a ' + (isR ? 'radius' : 'diameter') + ' of ' + L(isR ? rr : d, u) + ' and a height of ' + L(hc, u) + '. Find its surface area, to the nearest tenth.';
      diag = [{ v: 2 * PI * d * d + 2 * PI * d * hc, code: 'u3t-d-as-r', hint: isR ? 'Use r = ' + N(rr) + '.' : 'Halve the diameter: r = ' + N(rr) + '.' }, { v: PI * rr * rr + 2 * PI * rr * hc, code: 'u3t-one-end', hint: 'A closed cylinder has <b>2</b> circles (top and bottom).' }, { v: 2 * PI * rr * hc, code: 'u3t-side-only', hint: 'That’s only the curved side. Add the 2 circles.' }, { v: PI * rr * rr * hc, code: 'u3t-volume', hint: 'That’s the volume. SA = 2πr² + 2πrh.' }, { v: 2 * PI * rr * rr + PI * rr * hc, code: 'u3t-no-half', hint: 'The side unrolls to a rectangle 2πr long: 2πrh.' }];
      sol = br([isR ? '' : t('r=' + d + '\\div 2=' + N(rr)), '2 circles: ' + t('2\\times\\pi\\times ' + N(rr) + '^2' + eqR(2 * PI * rr * rr, 2)), 'Side: ' + t('2\\times\\pi\\times ' + N(rr) + '\\times ' + hc + eqR(2 * PI * rr * hc, 2)), t('SA' + eqR(SA, 1) + uT(u2))]); hints = ['SA = 2 circles + the side: 2πr² + 2πrh.', isR ? 'Use the π key.' : 'Halve the diameter first.'];
    } else if (kind === 'pyr') {
      var pp = r.pick([[3, 4, 5], [5, 12, 13], [8, 6, 10], [4, 3, 5]]), kk = r.pick([1, 1.5, 2]), bb = q(2 * pp[0] * kk), hh = q(pp[1] * kk), ss = q(pp[2] * kk);
      SA = bb * bb + 2 * bb * ss; fig = solid('sqpyramid', { s: Np(bb) + ' ' + u, h: Np(hh) + ' ' + u, sl: Np(ss) + ' ' + u });
      pr = 'A square pyramid has a base ' + L(bb, u) + ' on each side, a height of ' + L(hh, u) + ' and a slant height of ' + L(ss, u) + '. Find its total surface area.';
      diag = [{ v: bb * bb + 2 * bb * hh, code: 'u3t-h-not-s', hint: 'The triangles use the <b>slant height</b> ' + N(ss) + ' (on the outside), not the height.' }, { v: 2 * bb * ss, code: 'u3t-no-base', hint: 'Add the square base: ' + t(N(bb) + '\\times ' + N(bb)) + '.' }, { v: bb * bb + 4 * bb * ss, code: 'u3t-no-half', hint: 'Each triangle is ½ × b × s.' }, { v: bb * bb * hh / 3, code: 'u3t-volume', hint: 'That’s the volume. Add the base and the 4 triangles.' }];
      sol = br(['Base: ' + t(N(bb) + '\\times ' + N(bb) + '=' + N(bb * bb)), '4 triangles: ' + t('4\\times\\frac{1}{2}\\times ' + N(bb) + '\\times ' + N(ss) + '=' + N(2 * bb * ss)), t('SA=' + N(bb * bb) + '+' + N(2 * bb * ss) + '=' + N(SA) + uT(u2))]); hints = ['SA = base + 4 triangles: b² + 4 × ½ × b × s.', 'Use the slant height s, not the height.'];
    } else {
      var cp = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10]]), k2 = r.pick([1, 1.5, 2]), rc = q(cp[0] * k2), hcn = q(cp[1] * k2), sc = q(cp[2] * k2), giveD = r.chance(0.3);
      SA = PI * rc * rc + PI * rc * sc; p314 = 3.14 * rc * rc + 3.14 * rc * sc; fig = solid('cone', giveD ? { d: Np(2 * rc) + ' ' + u, h: Np(hcn) + ' ' + u, s: Np(sc) + ' ' + u } : { r: Np(rc) + ' ' + u, h: Np(hcn) + ' ' + u, s: Np(sc) + ' ' + u });
      pr = 'A closed cone has a ' + (giveD ? 'diameter of ' + L(2 * rc, u) : 'radius of ' + L(rc, u)) + ', a height of ' + L(hcn, u) + ' and a slant height of ' + L(sc, u) + '. Find its surface area, to the nearest tenth.';
      diag = [{ v: PI * rc * rc + PI * rc * hcn, code: 'u3t-h-not-s', hint: 'The curved side uses the <b>slant height</b>: πrs.' }, { v: PI * rc * sc, code: 'u3t-no-base', hint: 'That’s only the curved side. Add the base, πr².' }, { v: PI * 4 * rc * rc + PI * 2 * rc * sc, code: 'u3t-d-as-r', hint: giveD ? 'Halve the diameter: r = ' + N(rc) + '.' : 'Use the radius, ' + N(rc) + '.' }, { v: PI * rc * rc * hcn / 3, code: 'u3t-volume', hint: 'That’s the volume. SA = πr² + πrs.' }];
      sol = br([giveD ? t('r=' + N(2 * rc) + '\\div 2=' + N(rc)) : '', 'Base: ' + t('\\pi\\times ' + N(rc) + '^2' + eqR(PI * rc * rc, 2)) + '; curved side: ' + t('\\pi\\times ' + N(rc) + '\\times ' + N(sc) + eqR(PI * rc * sc, 2)), t('SA' + eqR(SA, 1) + uT(u2))]); hints = ['SA = πr² + πrs.', 'Use the slant height s, not the height h.'];
    }
    return numPart(pr + fig, SA, { dp: 1, after: u2, diag: diag, p314: p314, sol: sol, hints: hints, text: o.text || 'surface area of a ' + kind });
  }
  /* ---- M4: painting a room ---- */
  var WINS = [[4, 0, 3, 0], [3, 6, 4, 0], [5, 0, 3, 6], [4, 0, 4, 0], [6, 0, 3, 0]];
  function paintRoomPart(r, o) {
    o = o || {}; var p = person(r);
    var s = find(function () { var Ln = r.int(10, 16), Wd = r.int(9, 13), H = r.pick([8, 9]), win = r.pick(WINS), cov = r.pick([350, 400]), pr = q(r.int(39, 64) + 0.99); return { Ln: Ln, W: Wd, H: H, win: win, cov: cov, pr: pr }; },
      function (s) { var wa = (s.win[0] + s.win[1] / 12) * (s.win[2] + s.win[3] / 12), A0 = 2 * (s.Ln + s.W) * s.H - 20 - wa, g = 2 * A0 / s.cov; return s.Ln !== s.W && Math.abs(g - Math.round(g)) > 0.12 && Math.ceil(A0 / s.cov - 1e-9) !== Math.ceil(g - 1e-9); });
    var wa = (s.win[0] + s.win[1] / 12) * (s.win[2] + s.win[3] / 12), walls = 2 * (s.Ln + s.W) * s.H, A0 = walls - 20 - wa, gal = Math.ceil(2 * A0 / s.cov - 1e-9), cost = gal * s.pr, winT = hT(s.win[0], s.win[1]) + ' by ' + hT(s.win[2], s.win[3]);
    var aD = [{ v: walls, code: 'u3t-no-cutout', hint: 'Take away the door and the window: they don’t get painted.' }, { v: walls - 20, code: 'u3t-no-cutout', hint: 'Take away the window too.' }, { v: walls - wa, code: 'u3t-no-cutout', hint: 'Take away the door too: ' + t("3'\\,0''") + ' by ' + t("6'\\,8''") + ' = 3 ft by ' + t('6\\tfrac{2}{3}') + ' ft = 20 ft².' }, { v: walls - 3 * 6.8 - wa, code: 'u3t-ftin-dec', hint: t("6'\\,8''") + ' is not 6.8 ft: 8 in = ' + t('\\tfrac{8}{12}=\\tfrac{2}{3}') + ' ft, so the door is ' + t('3\\times 6\\tfrac{2}{3}=20') + ' ft².' }, { v: A0 + s.Ln * s.W, code: 'u3t-floor', hint: 'Only the walls get painted, not the floor.' }, { v: (s.Ln + s.W) * s.H - 20 - wa, code: 'u3t-two-walls', hint: 'A room has <b>4</b> walls: 2 of ' + s.Ln + ' ft and 2 of ' + s.W + ' ft (or perimeter × height).' }];
    var gD = [{ v: Math.ceil(A0 / s.cov - 1e-9), code: 'u3t-one-coat', hint: 'Two coats: paint ' + t('2\\times') + ' the area.' }, { v: Math.floor(2 * A0 / s.cov), code: 'u3t-round-down', hint: 'That is not quite enough paint. Buy whole gallons: round <b>up</b>.' }];
    var specs = [nfld('Area to paint (one coat):', A0, { name: 'Area', after: 'ft²', dp: 1, diag: aD }),
      nfld('Gallons to buy:', gal, { name: 'Gallons', dp: 0, after: 'gal', diag: gD, from: function (v) { return v[0] > 0 ? Math.ceil(2 * v[0] / s.cov - 1e-9) : null; }, ftol: 0 }),
      nfld('Cost before tax:', cost, { name: 'Cost', money: true, diag: gD.map(function (m) { return { v: m.v * s.pr, code: m.code, hint: m.hint }; }), from: function (v) { return v[1] > 0 && Math.round(v[1]) === v[1] ? q(v[1] * s.pr) : null; } })];
    return fieldsPart(p.n + ' is painting the walls of a bedroom. The floor is ' + L(s.Ln, 'ft') + ' by ' + L(s.W, 'ft') + ' and the walls are ' + L(s.H, 'ft') + ' high. The room has a door ' + t("3'\\,0''") + ' by ' + t("6'\\,8''") + ' and a window ' + winT + ' that will not be painted. ' + cap(p.he) + ' wants <b>2 coats</b>. One gallon of paint covers ' + L(s.cov, 'ft²') + ' and costs ' + MM(s.pr) + '. Find the area to paint (one coat), the number of gallons to buy, and the cost before tax.', specs,
      br(['Walls: the perimeter is ' + t('2(' + s.Ln + ')+2(' + s.W + ')=' + 2 * (s.Ln + s.W)) + ' ft, so ' + t(2 * (s.Ln + s.W) + '\\times ' + s.H + '=' + walls) + ' ft²', 'Door: ' + t("6'\\,8''=6\\tfrac{2}{3}") + ' ft, ' + t('3\\times 6\\tfrac{2}{3}=20') + ' ft²; window: ' + t(N(s.win[0] + s.win[1] / 12) + '\\times ' + N(s.win[2] + s.win[3] / 12) + '=' + N(wa)) + ' ft²', 'Area to paint: ' + t(walls + '-20-' + N(wa) + '=' + N(A0)) + ' ft²',
        '2 coats: ' + t('2\\times ' + N(A0) + '=' + N(2 * A0)) + ' ft²; ' + t(N(2 * A0) + '\\div ' + s.cov + eqR(2 * A0 / s.cov, 2)) + ', so buy ' + gal + ' gallons (round up)', 'Cost: ' + t(gal + '\\times ' + Mt(s.pr) + '=' + Mt(cost))]),
      ['The 4 walls unroll into one long rectangle: perimeter of the floor × height. Take away the door and the window.', 'Double the area for 2 coats, divide by the coverage, and round up.'], o.text || 'paint a room');
  }
  /* ---- M4: steel for a tank (side + cone roof) ---- */
  function tankPart(r, o) {
    o = o || {}; var c = r.pick(['A round steel storage tank at a water plant', 'A grain bin on a farm near Lethbridge', 'A round steel oil tank', 'A water tower tank']);
    var s = find(function () { var D = r.pick([4, 5, 6, 7, 8]), H = r.int(6, 14), sl = pickR(r, 3, 6.5, 0.5), rate = q(r.int(22, 36) + r.pick([0.5, 0.75, 0.25, 0])); return { D: D, H: H, s: sl, rate: rate }; }, function (s) { return s.s > s.D / 2 + 0.4; });
    var rr = s.D / 2, side = 2 * PI * rr * s.H, roof = PI * rr * s.s, Ar = side + roof, cost = rd(Ar, 2) * s.rate;
    var aD = [{ v: Ar + PI * rr * rr, code: 'u3t-extra-face', hint: 'The floor is concrete (no circle at the bottom), and the roof is only the cone’s curved part, πrs (no flat circle under it).' }, { v: Ar + 2 * PI * rr * rr, code: 'u3t-extra-face', hint: 'No circles: only the side of the tank and the curved part of the roof.' }, { v: 2 * PI * s.D * s.H + PI * s.D * s.s, code: 'u3t-d-as-r', hint: 'The tank is ' + s.D + ' m <b>across</b>: r = ' + N(rr) + ' m.' }, { v: side, code: 'u3t-missing-piece', hint: 'Add the roof: the cone’s curved part, πrs.' }, { v: roof, code: 'u3t-missing-piece', hint: 'Add the side of the tank: 2πrh.' }, { v: PI * rr * s.H + roof, code: 'u3t-no-half', hint: 'The side unrolls to a rectangle 2πr long: 2πrh.' }];
    var specs = [nfld('Area of steel:', Ar, { name: 'Area', dp: 2, after: 'm²', diag: aD, p314: 2 * 3.14 * rr * s.H + 3.14 * rr * s.s }),
      nfld('Cost:', cost, { name: 'Cost', money: true, alts: [Ar * s.rate], diag: aD.map(function (m) { return { v: m.v * s.rate, code: m.code, hint: m.hint }; }), from: function (v) { return v[0] > 0 ? q(v[0] * s.rate) : null; }, ftol: 0.011 })];
    return fieldsPart(c + ' is a cylinder ' + L(s.D, 'm') + ' across and ' + L(s.H, 'm') + ' tall, with a cone roof. The roof has the same radius as the tank and a slant height of ' + L(s.s, 'm') + '. Steel sheeting covers the side and the roof (the floor is concrete) and costs ' + MM(s.rate) + ' per square metre. Find the area of steel, to the nearest hundredth, and its cost.' +
      solid('cylinder', { d: s.D + ' m', h: s.H + ' m' }), specs,
      br(['r = ' + t(s.D + '\\div 2=' + N(rr)) + ' m', 'Side: ' + t('2\\pi rh=2\\times\\pi\\times ' + N(rr) + '\\times ' + s.H + eqR(side, 3)) + ' m²', 'Roof (curved part of the cone): ' + t('\\pi rs=\\pi\\times ' + N(rr) + '\\times ' + N(s.s) + eqR(roof, 3)) + ' m²', 'Area: ' + t(N(rd(side, 3)) + '+' + N(rd(roof, 3)) + eqR(Ar, 2)) + ' m²', 'Cost: ' + t(N(rd(Ar, 2)) + '\\times ' + Mt(s.rate) + eqM(cost))]),
      ['Which pieces get steel? The side (2πrh) and the curved part of the cone roof (πrs).', 'Add them, then multiply by the price per square metre.'], o.text || 'tank side and cone roof');
  }
  A.areaShapePart = areaShapePart; A.gridPart = gridPart; A.compositePart = compositePart; A.stageFig = stageFig; A.solidPart = solidPart; A.paintRoomPart = paintRoomPart; A.tankPart = tankPart; A.PYTH = PYTH;

  /* ======================= the test (paper order by outcome; defineTest orders it Beginning → Progressing → Mastery) ======================= */
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  var QUESTIONS = [
    /* ---------- M1: SI ---------- */
    Q(1, 'M1', 'BEG', function (r) { return siFillPart(r); }, 'SI staircase: three fill-ins'),
    Q(2, 'M1', 'BEG', function (r) { return referentPart(r); }, 'The most reasonable SI measurement (multiple choice)'),
    Q(3, 'M1', 'PRG', function (r) { return siTotalPart(r); }, 'A total distance in mixed SI units'),
    Q(4, 'M1', 'PRG', function (r) { return jugsPart(r); }, 'Cups from a jug and jugs for a party (mL and L)'),
    Q(5, 'M1', 'MAS', function (r) { return trimBuyPart(r); }, 'Trim lengths to buy for cut pieces, and the cost'),
    /* ---------- M2: imperial and SI ↔ imperial ---------- */
    Q(6, 'M2', 'BEG', function (r) { return impFillPart(r); }, 'Imperial fill-ins (ft, in, yd, mi)'),
    Q(7, 'M2', 'BEG', function (r) { return impToSIPart(r); }, 'One imperial → SI conversion'),
    Q(8, 'M2', 'PRG', function (r) { return heightPart(r); }, 'A height in feet and inches to cm (or the difference of two)'),
    Q(9, 'M2', 'PRG', function (r) { return siToImpPart(r); }, 'One SI → imperial conversion'),
    Q(10, 'M2', 'MAS', function (r) { return clearPart(r); }, 'Will it fit under a clearance sign, and by how much'),
    /* ---------- M3: linear measurement ---------- */
    Q(11, 'M3', 'BEG', function (r) { return tapeReadPart(r); }, 'Read two arrows on a ruler or tape (mixed numbers)'),
    Q(12, 'M3', 'BEG', function (r) { return circumfPart(r); }, 'Circumference from d or r'),
    Q(13, 'M3', 'PRG', function (r) { return boardLeftPart(r); }, 'Feet and inches left on a board'),
    Q(14, 'M3', 'PRG', function (r) { return lYardPart(r); }, 'L-shaped yard: missing sides and perimeter'),
    Q(15, 'M3', 'MAS', function (r) { return bedEdgingPart(r); }, 'Edging pieces and cost for a bed with a half-circle end'),
    Q(16, 'M3', 'MAS', function (r) { return fencePart(r); }, 'A fence section of boards and gaps (mixed numbers)'),
    /* ---------- A1: rearranging formulas ---------- */
    Q(17, 'A1', 'BEG', function (r) { return oneStepPart(r); }, 'One-step rearranging (P = 4s, A = lw, P = a + b + c)'),
    Q(18, 'A1', 'BEG', function (r) { return diamPart(r); }, 'A diameter from a circumference'),
    Q(19, 'A1', 'PRG', function (r) { return rinkPart(r); }, 'A length from P = 2l + 2w'),
    Q(20, 'A1', 'PRG', function (r) { return bedCSPart(r); }, 'One length of edging as a circle and as a square'),
    Q(21, 'A1', 'MAS', function (r) { return dogRunPart(r); }, 'A dog run fenced on three sides'),
    /* ---------- M4: area and surface area ---------- */
    Q(22, 'M4', 'BEG', function (r) { return areaShapePart(r); }, 'Area of a parallelogram, triangle, trapezoid or circle'),
    Q(23, 'M4', 'BEG', function (r) { return gridPart(r); }, 'An irregular shape on a grid'),
    Q(24, 'M4', 'PRG', function (r) { return compositePart(r); }, 'Composite area: a stage, or a lawn minus a pond and deck'),
    Q(25, 'M4', 'PRG', function (r) { return solidPart(r); }, 'Surface area of a box, triangular prism, cylinder, pyramid or cone'),
    Q(26, 'M4', 'MAS', function (r) { return paintRoomPart(r); }, 'Painting a room: area, gallons and cost'),
    Q(27, 'M4', 'MAS', function (r) { return tankPart(r); }, 'Steel for a tank’s side and cone roof, and its cost')
  ];

  HW.defineTest({
    id: 'u3test', unit: 3, title: 'Unit 3 Test', outcome: 'M3', calc: true,
    blurb: 'The Unit 3 outcomes-based test (M1, M2, M3, M4, A1): SI and imperial units, converting between them, reading a tape measure, perimeter and circumference, rearranging formulas, area of 2-D and composite shapes, and surface area, in Beginning, Progressing and Mastery boxes.',
    // Short version (~59%, the least that keeps every box of every outcome): one part of each box of each outcome —
    // M1 SI fill-ins, trail/run total, trim lengths; M2 imperial fill-ins, height in cm, clearance; M3 ruler/tape reading,
    // L-shaped yard, half-circle edging; A1 one-step rearranging, rink length, dog run; M4 area of a shape, surface area of
    // a solid, painting a room.
    short: ['1', '3', '5', '7', '9', '11', '13', '16', '17', '20', '21', '22', '23', '25', '26'],
    questions: QUESTIONS
  });
})(window);
