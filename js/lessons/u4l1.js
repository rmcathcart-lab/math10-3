/* Math 10-3 · Unit 4 · Lesson 1 — Volume of Prisms and Cylinders (M1 for SI parts, M2 for imperial or SI↔imperial parts)
 * Assignment 1 (u4_l01.tex, Questions 1–17) and the Lesson 1 Extra Practice (u4_ep01.tex, A 1–4, B 5–11, C 12–15).
 * Every part is a generator: the same object, units and difficulty as the booklet item, new numbers around the booklet's
 * (the lesson's worked-example numbers are left out). Calculator allowed (π key).
 * Answers: typed numbers; a unit typed after the number is ignored; thousands may be written 64000, 64 000 or 64,000.
 * Rounding as the booklet asks (to the tenth / hundredth / whole cubic foot); too many decimals gets a nudge, too few a
 * nudge, rounding the wrong way is wrong with a hint. Answers the booklet leaves exact must be exact. π = 3.14 instead of
 * the π key gets a nudge (no try used) when it changes the rounded answer. Recognised wrong values each get their own
 * hint: adding the lengths, the bottom layer only, the surface area, forgetting the ½ of a triangle, the diameter used as
 * the radius, r × 2 instead of r², no r², no π, a cubic conversion with 12 / 3 / 100 (the length factor) or 144 / 9 /
 * 10 000 (the area factor), multiplying instead of dividing, inches not changed to feet (cm to m), not rounding an order
 * up, rounding to whole yards instead of half yards, ×1.31 the wrong way, and so on.
 * Conversions: the cube-built box is drawn (SVG) and its three blanks are labelled boxes; the volume table → one part per
 * row, the table in the stem; "which holds more and by how much" → the two volumes (boxes), then multiple choice, then
 * the difference; "what mistake did Jordan make / explain Kim's mistake / is Ella right / is the flyer right" → multiple
 * choice whose options are reasons (one right); "how many bags / how much to order, and the cost" → two labelled boxes.
 *
 * Shared kit for later Unit 4 lessons: HW.u4conv (conversion factors exactly as the booklet gives them, a number reader
 * that ignores typed units, a rounding-aware checker with targeted wrong values, number / multi-box / conversion /
 * estimate part builders, cylinder / prism / box formulas with booklet-style solution lines, round-up-to-an-order, a
 * cube-built box picture). Lesson 2 (u4l2.js) uses it, so this file must load BEFORE u4l2.js. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ======================= the Unit 4 conversion kit (HW.u4conv) ======================= */
  var C = HW.u4conv = HW.u4conv || {};
  /* factors exactly as the Unit 4 booklet gives them */
  C.F = {
    in3_ft3: 1728, ft3_yd3: 27, cm3_m3: 1000000, m3_yd3: 1.31, yd3_m3: 0.765, m3_ft3: 35.3, in_ft: 12, ft_yd: 3, cm_m: 100, cm_in: 2.54, cm_ft: 30.48, m_yd: 0.9144,
    mL_L: 1000, L_m3: 1000, mL_cm3: 1,
    floz_cup: 8, cup_pt: 2, pt_qt: 2, qt_gal: 4, floz_gal: 128, floz_qt: 32, floz_pt: 16, cup_gal: 16, cup_qt: 4, pt_gal: 8,
    usgal_L: 3.785, brgal_L: 4.546, usfloz_mL: 29.57, brfloz_mL: 28.4, uspt_mL: 473, brpt_mL: 568, brfloz_pt: 20, uscup_mL: 237, usqt_mL: 946,
    tsp_mL: 5, tbsp_mL: 15, tsp_tbsp: 3, metcup_mL: 250, mi_km: 1.609
  };
  /* US capacity units in fluid ounces (1 gal = 4 qt = 8 pt = 16 cups = 128 fl oz) */
  C.US = { gal: 128, qt: 32, pt: 16, cup: 8, floz: 1 };
  C.USNAME = { gal: 'gal', qt: 'qt', pt: 'pt', cup: 'cups', floz: 'fl oz' };

  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, d) { var f = Math.pow(10, d); return Math.floor(x * f + 1e-9) / f; }
  function near(a, b, e) { return Math.abs(a - b) <= (e == null ? 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : e); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }                       // TeX: 64\,000
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true).replace(/ /g, ' ') : s; } // text: 64 000
  function raw(x, k) { var s = +x.toFixed(k == null ? 3 : k); return N(s) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function eqR(x, dp) { return dp == null || near(x, rd(x, dp), 1e-9) ? '=' + N(dp == null ? q(x) : rd(x, dp)) : '=' + raw(x, dp + 2) + '\\approx ' + N(rd(x, dp), dp); }
  function uT(s) { s = String(s || '').replace(/^ +/, ''); if (!s) return ''; return ('\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}').replace(/³/g, '}^3\\text{').replace(/²/g, '}^2\\text{').replace(/\\text\{\}/g, ''); }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u4conv: no numbers found'); return fb; }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function roundUp(v, step) { return q(Math.ceil(q(v / step) - 1e-9) * step); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function placeWord(dp, money) { return money ? 'the nearest cent' : dp === 0 ? 'the nearest whole number' : dp === 1 ? 'the nearest tenth' : dp === 2 ? 'the nearest hundredth' : dp === 3 ? 'the nearest thousandth' : dp + ' decimal places'; }
  /* a mixed number of quarters / thirds as TeX: 4.5 → 4\tfrac{1}{2} */
  function mixT(x) {
    var w = Math.floor(x + 1e-9), f = q(x - w), fr = [[0.25, '\\tfrac{1}{4}'], [0.5, '\\tfrac{1}{2}'], [0.75, '\\tfrac{3}{4}'], [1 / 3, '\\tfrac{1}{3}'], [2 / 3, '\\tfrac{2}{3}']].filter(function (p) { return near(f, p[0], 1e-6); })[0];
    if (!fr) return N(x); return (w ? w : '') + fr[1];
  }
  function M(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Mp(x) { return '$' + rd(x, 2).toFixed(2); }
  var NAMES = ['Amara', 'Kai', 'Malik', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Devon', 'Rosa', 'Theo', 'Aisha', 'Ben', 'Maya', 'Dani', 'Kenji', 'Sofia', 'Omar', 'Tyler', 'Jaya'];
  Object.assign(C, { q: q, rd: rd, trunc: trunc, near: near, nS: nS, decs: decs, N: N, Np: Np, raw: raw, eqR: eqR, uT: uT, br: br, find: find, pickR: pickR, roundUp: roundUp, cap: cap, mixT: mixT, M: M, Mp: Mp, NAMES: NAMES, placeWord: placeWord });

  /* ---- reading a typed number: strips $, \text{…} and a unit after the number ("252 cm³", "15.3 ft3", "18 in") ---- */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\\$|\$/g, '').replace(/\\[,;: !]|~| | /g, ' ').trim();
    var unit = '', um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^°%'"][\s\S]*)$/.exec(s);
    if (um) { s = um[1].trim(); unit = um[2]; }
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u4k-comma', 'Use a decimal point (not a comma), like 12.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Type a single number (the unit is already written beside the box).') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, unit: unit, len: pl.replace(/^-/, '').length };
  }
  C.readNum = readNum;

  /* ---- one number. o: { dp (rounding place; null = exact), money, exact (unrounded value, for the rounding-direction hint),
   *   exactOk (the unrounded value is right too), alts (other right values), bad [[value, code, hint, 'form'?]],
   *   cubic (nudge a squared unit), nr (numerical response, 4 characters), miss (hint for any other value) } ---- */
  C.chk = function (ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans, want = dp == null ? q(ans) : rd(ans, dp), step = dp == null ? 0 : Math.pow(10, -dp);
    var acc = [want].concat((o.alts || []).map(function (a) { return dp == null ? q(a) : rd(a, dp); }));
    if (o.exactOk) acc.push(q(exact));
    function tl(y) { return dp == null ? 1e-7 * Math.max(1, Math.abs(y)) : step / 20; }
    function isAcc(v) { return acc.some(function (y) { return Math.abs(v - y) <= tl(y); }); }
    var seen = [], bad = (o.bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || isAcc(b[0]) || (dp != null && isAcc(rd(b[0], dp)))) return false;
      if (seen.some(function (x) { return near(x, b[0], 1e-9); })) return false; seen.push(b[0]); return true;
    });
    function mBad(v, d, b) {
      return Math.abs(v - b) <= 1e-6 * Math.max(1, Math.abs(b)) || (d >= 1 && d <= 6 && (near(v, rd(b, d)) || near(v, trunc(b, d)))) ||
        (d === 0 && (dp === 0 || Math.abs(b - Math.round(b)) < 1e-6) && near(v, rd(b, 0)));
    }
    var place = placeWord(dp, o.money);
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d, i;
      if (isAcc(v)) {
        if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
        if (o.cubic && /²|\^\s*\(?\{?\s*2|[a-z]2$/.test(a.unit)) return form('u4k-sq-unit', 'Right number, but volume has a <b>cubed</b> unit (like cm³), not a squared unit. The unit is written beside the box.');
        return ok();
      }
      if (dp != null && d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round to ' + place + '.');
      if (dp != null && d < dp && acc.some(function (y) { return near(v, rd(y, d)) || near(v, trunc(y, d)); }))
        return form('places', o.money ? 'Give the amount to the cent (2 decimal places), like $12.50.' : 'Round to ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      for (i = 0; i < bad.length; i++) if (mBad(v, d, bad[i][0])) return bad[i][3] === 'form' ? form(bad[i][1], bad[i][2]) : wrong(bad[i][1], bad[i][2]);
      if (dp == null && d < decs(want) && (near(v, rd(want, d)) || near(v, trunc(want, d)))) return form('u4k-exact', 'Close, but don’t round this answer: give the exact value (' + decs(want) + ' decimal place' + (decs(want) === 1 ? '' : 's') + ').');
      if (dp != null && d === dp && !near(exact, want, 1e-9) && near(Math.abs(v - want), step, step / 20) && Math.abs(v - exact) < step)
        return wrong('u4k-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      return wrong('value', o.miss || null);
    };
    f.bad = bad; f.key = o.exactOk && decs(exact) <= 4 ? nS(exact) : dp != null ? want.toFixed(dp) : nS(want); f.keyDp = o.exactOk ? null : dp;
    return f;
  };
  /* an estimate: anything within tol (default 15%) of the exact value; bad = [[value, code, hint]] for the far-off mistakes */
  C.estChk = function (exact, o) {
    o = o || {}; var tol = o.tol || 0.15, bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && Math.abs(b[0] - exact) > tol * exact; });
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (Math.abs(a.v - exact) <= tol * Math.abs(exact)) return ok();
      for (var i = 0; i < bad.length; i++) if (Math.abs(a.v - bad[i][0]) <= tol * Math.abs(bad[i][0])) return wrong(bad[i][1], bad[i][2]);
      return wrong('u4k-est', o.miss || 'An estimate should be close to the real answer. Use the friendly numbers ' + (o.friendly || '') + ' and do the same operation.');
    };
    f.bad = bad; return f;
  };

  /* ---- a number part. o: dp, money, exact, exactOk, alts, bad, before, after (unit beside the box, e.g. 'cm³'), sol, hints, text, nr, cubic ---- */
  C.num = function (prompt, ans, o) {
    o = o || {}; ans = q(ans);
    var dp = o.money ? 2 : o.dp, chk = C.chk(ans, o), key = chk.key;
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after, nr: !!o.nr }, check: chk, key: key,
      answer: t((o.money ? '\\$' : '') + N(Number(key), chk.keyDp) + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = chk.bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(rd(b[0], 6)); });
    p.good = o.nr ? [] : [key + (o.after ? ' ' + o.after : '')].concat(o.money ? ['$' + key] : []);
    return p;
  };
  /* ---- several boxes. rows: [{ label, name, ans, dp, money, exact, exactOk, alts, bad, before, after, est (an estimate box: { tol, bad, friendly }) }] ---- */
  C.fields = function (prompt, rows, sol, hints, text) {
    var chks = rows.map(function (rw, i) {
      if (rw.est) return C.estChk(rw.ans, rw.est);
      var others = rows.filter(function (x, j) { return j !== i && !x.est && !near(q(x.ans), q(rw.ans), 1e-9); }).map(function (x) { return [x.ans, 'amt-swap', 'That’s the answer for another box (' + (x.name || x.label.replace(/:$/, '')) + '). Check which box is which.']; });
      return C.chk(q(rw.ans), { dp: rw.dp, money: rw.money, exact: rw.exact, exactOk: rw.exactOk, alts: rw.alts, bad: (rw.bad || []).concat(others), cubic: rw.cubic });
    });
    var keys = rows.map(function (rw, i) { return rw.est ? nS(rd(rw.ans, rw.est.dp == null ? 2 : rw.est.dp)) : chks[i].key; });
    var ans = rows.map(function (rw, i) { var dp = rw.est ? null : chks[i].keyDp; return rw.label + ' ' + (rw.est ? 'about ' : '') + t((rw.money ? '\\$' : '') + N(Number(keys[i]), dp) + uT(rw.after)); }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: rw.money ? '$' : rw.before, after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }), chks, keys, ans, br(sol), hints, text);
    var b0 = []; rows.forEach(function (rw, i) { var bb = chks[i].bad.filter(function (b) { return b[3] !== 'form'; })[0]; if (bb) { var arr = keys.slice(); arr[i] = nS(rd(bb[0], 6)); b0.push(arr); } });
    p.bad = b0.slice(0, 3);
    return p;
  };
  /* ---- a conversion x (from) → to, by multiplying (mul) or dividing by f.
   *   o: { from, to (unit names as shown), dp, wrongF: [[factor, code, hint]], sol, hints, text, exactOk } ---- */
  C.conv = function (prompt, x, f, mul, o) {
    o = o || {};
    var ans = q(mul ? x * f : x / f);
    var bad = [[mul ? x / f : x * f, 'u4k-wrong-way', mul ? 'You divided. ' + o.from + ' is the <b>bigger</b> unit, so you need <b>more</b> ' + o.to + ': multiply by ' + Np(f) + '.' : 'You multiplied. ' + o.from + ' is the <b>smaller</b> unit, so you need <b>fewer</b> ' + o.to + ': divide by ' + Np(f) + '.']];
    (o.wrongF || []).forEach(function (w) { bad.push([mul ? x * w[0] : x / w[0], w[1], w[2]]); bad.push([mul ? x / w[0] : x * w[0], w[1], w[2]]); });
    return C.num(prompt, ans, { dp: o.dp, exactOk: o.exactOk, after: o.to, bad: bad.concat(o.bad || []),
      sol: o.sol || t(N(x) + (mul ? '\\times ' : '\\div ') + N(f) + eqR(ans, o.dp) + uT(o.to)),
      hints: o.hints || [(mul ? 'Bigger unit → smaller unit: multiply' : 'Smaller unit → bigger unit: divide') + ' by ' + t(N(f)) + '.'], text: o.text });
  };
  /* the cubic-unit factors and their usual mistakes (the length factor, the area factor) */
  C.CUBIC = {
    ft3_in3: { f: 1728, big: 'ft³', small: 'in³', wrongF: [[12, 'u4k-cube-12', 'A cubic foot is 12 in long, 12 in wide <b>and</b> 12 in high: 1 ft³ = 12 × 12 × 12 = 1728 in³.'], [144, 'u4k-cube-144', '12 × 12 = 144 is a <b>square</b> foot. A cubic foot also has 12 layers: 12 × 12 × 12 = 1728 in³.']] },
    yd3_ft3: { f: 27, big: 'yd³', small: 'ft³', wrongF: [[3, 'u4k-cube-3', 'A cubic yard is 3 ft long, 3 ft wide <b>and</b> 3 ft high: 1 yd³ = 3 × 3 × 3 = 27 ft³.'], [9, 'u4k-cube-9', '3 × 3 = 9 is a <b>square</b> yard. A cubic yard has 3 layers of 9: 1 yd³ = 27 ft³.']] },
    m3_cm3: { f: 1000000, big: 'm³', small: 'cm³', wrongF: [[100, 'u4k-cube-100', '1 m = 100 cm, but a cubic metre is 100 cm long, wide <b>and</b> high: 1 m³ = 100 × 100 × 100 = 1 000 000 cm³.'], [10000, 'u4k-cube-10000', '100 × 100 = 10 000 is a <b>square</b> metre. A cubic metre has 100 layers: 1 m³ = 1 000 000 cm³.'], [1000, 'u4k-cube-1000', '1000 is the factor for litres. For cm³: 1 m³ = 100 × 100 × 100 = 1 000 000 cm³.']] }
  };
  /* convert a volume between the two units of C.CUBIC[k]; toSmall = true multiplies */
  C.cubicPart = function (prompt, x, k, toSmall, o) {
    var c = C.CUBIC[k]; o = o || {};
    return C.conv(prompt, x, c.f, toSmall, { from: toSmall ? c.big : c.small, to: toSmall ? c.small : c.big, wrongF: c.wrongF, dp: o.dp, text: o.text || k,
      hints: [(toSmall ? 'Big unit → small unit: multiply by ' : 'Small unit → big unit: divide by ') + t(N(c.f)) + ' (1 ' + c.big + ' = ' + Np(c.f) + ' ' + c.small + ').'] });
  };

  /* ---- formulas and solution lines ---- */
  C.cylV = function (r, h) { return Math.PI * r * r * h; };
  /* typical cylinder mistakes. o: { d (the diameter was given), dp } */
  C.cylBad = function (r, h, o) {
    o = o || {}; var b = [];
    if (o.d) b.push([Math.PI * 4 * r * r * h, 'u4k-diam', 'Use the <b>radius</b>: halve the diameter first (' + t('r=' + N(2 * r) + '\\div 2=' + N(r)) + ').']);
    b.push([Math.PI * r * 2 * h, 'u4k-r-times-2', t('r^2') + ' means ' + t('r\\times r') + ', not ' + t('r\\times 2') + '. Use the ' + t('x^2') + ' key.']);
    b.push([Math.PI * r * h, 'u4k-no-square', 'Square the radius: ' + t('V=\\pi\\times r^2\\times h') + '.']);
    b.push([r * r * h, 'u4k-no-pi', 'Multiply by ' + t('\\pi') + ' too: ' + t('V=\\pi\\times r^2\\times h') + '.']);
    if (o.d) b.push([Math.PI * 2 * r * h * 2, 'u4k-diam', 'Use the radius (half the diameter), and square it.']);
    b.push([3.14 * r * r * h, 'u4k-pi314', 'Use the ' + t('\\pi') + ' key on your calculator: 3.14 is a little off, and it changes the rounded answer.', 'form']);
    return b;
  };
  C.cylSol = function (r, h, u, dp, o) {
    o = o || {}; var V = C.cylV(r, h);
    return [o.d ? t('r=' + N(2 * r) + '\\div 2=' + N(r) + uT(u)) : '', t('V=\\pi r^2h=\\pi\\times ' + N(r) + '^2\\times ' + N(h)), t('V' + eqR(V, dp) + uT(u + '³'))];
  };
  C.boxSol = function (l, w, h, u, dp) { return t('V=l\\times w\\times h=' + N(l) + '\\times ' + N(w) + '\\times ' + N(h) + eqR(l * w * h, dp) + uT(u + '³')); };
  C.boxBad = function (l, w, h) {
    return [[l + w + h, 'u4k-added', 'Multiply the three lengths (length × width × height); don’t add them.'], [2 * (l * w + l * h + w * h), 'u4k-surface', 'That’s the surface area (the outside). Volume = length × width × height.'],
      [l * w, 'u4k-one-layer', 'That’s only the bottom layer (length × width). Multiply by the height too.'], [l * h, 'u4k-one-layer', 'Multiply all three lengths.'], [w * h, 'u4k-one-layer', 'Multiply all three lengths.']];
  };
  C.triBad = function (b, h, L) {
    return [[b * h * L, 'u4k-no-half', 'The base is a <b>triangle</b>: its area is ' + t('\\tfrac{1}{2}\\times b\\times h') + '. Don’t forget the ' + t('\\tfrac{1}{2}') + '.'], [b * h / 2, 'u4k-area-only', 'That’s the area of the triangle. Multiply by the length of the prism.'], [b + h + L, 'u4k-added', 'Find the area of the triangle, then multiply by the length.'], [b * L / 2, 'u4k-no-height', 'Use the height of the triangle in its area: ' + t('\\tfrac{1}{2}\\times b\\times h') + '.']];
  };
  C.triSol = function (b, h, L, u, dp) {
    var A = b * h / 2;
    return [t('\\text{Area of base}=\\tfrac{1}{2}\\times ' + N(b) + '\\times ' + N(h) + '=' + N(A) + uT(u + '²')), t('V=' + N(A) + '\\times ' + N(L) + eqR(A * L, dp) + uT(u + '³'))];
  };
  /* ---- pictures ---- */
  /* a box built from cubes (l across, w deep, h high), oblique view; labels { l, w, h } plain text */
  C.cubes = function (l, w, h, lab) {
    lab = lab || {};
    var s = Math.min(30, 170 / (l + 0.5 * w), 130 / (h + 0.33 * w)), dx = 0.5 * s, dy = -0.33 * s, x0 = 48, y0 = 18 + h * s + w * -dy;
    var P2 = function (x, y, k) { return [(x0 + x * s + k * dx).toFixed(1), (y0 - y * s + k * dy).toFixed(1)]; };
    var ln = function (a, b) { return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="#2b3340" stroke-width="1.3"/>'; };
    var poly = function (pts, fill) { return '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="' + fill + '" stroke="#2b3340" stroke-width="1.6"/>'; };
    var g = poly([P2(0, 0, 0), P2(l, 0, 0), P2(l, h, 0), P2(0, h, 0)], '#f4faf9') + poly([P2(0, h, 0), P2(l, h, 0), P2(l, h, w), P2(0, h, w)], '#e4efe9') + poly([P2(l, 0, 0), P2(l, 0, w), P2(l, h, w), P2(l, h, 0)], '#cfe0d8');
    var i;
    for (i = 1; i < l; i++) g += ln(P2(i, 0, 0), P2(i, h, 0)) + ln(P2(i, h, 0), P2(i, h, w));
    for (i = 1; i < h; i++) g += ln(P2(0, i, 0), P2(l, i, 0)) + ln(P2(l, i, 0), P2(l, i, w));
    for (i = 1; i < w; i++) g += ln(P2(0, h, i), P2(l, h, i)) + ln(P2(l, 0, i), P2(l, h, i));
    var tx = function (p, sx, sy, str, anc) { return '<text x="' + (+p[0] + sx).toFixed(1) + '" y="' + (+p[1] + sy).toFixed(1) + '" font-size="14" text-anchor="' + (anc || 'middle') + '" fill="#2b3340">' + str + '</text>'; };
    if (lab.l) g += tx(P2(l / 2, 0, 0), 0, 18, lab.l);
    if (lab.h) g += tx(P2(0, h / 2, 0), -6, 5, lab.h, 'end');
    if (lab.w) g += tx(P2(l, 0, w / 2), 8, 10, lab.w, 'start');
    var W = x0 + l * s + w * dx + 60, H = y0 + 28;
    return '<svg class="fig-svg" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" width="100%" style="max-width:' + Math.min(300, W).toFixed(0) + 'px" role="img" aria-label="box built from cubes">' + g + '</svg>';
  };
  C.solid = function (kind, opt) { return '<div style="margin:6px 0">' + HW.solid(kind, opt) + '</div>'; };
  var TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  C.TD = TD;
  C.table = function (head, rows) { return '<table style="border-collapse:collapse;margin:4px 0">' + '<tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'; };

  HW.addCodes({
    'u4k-comma': 'Decimal comma', 'u4k-wrong-way': 'Multiplied instead of dividing (or the reverse)', 'u4k-cube-12': 'Used 12 for ft³ ↔ in³ (not 1728)', 'u4k-cube-144': 'Used 144 (square feet) for ft³ ↔ in³',
    'u4k-cube-3': 'Used 3 for yd³ ↔ ft³ (not 27)', 'u4k-cube-9': 'Used 9 (square yards) for yd³ ↔ ft³', 'u4k-cube-100': 'Used 100 for m³ ↔ cm³ (not 1 000 000)', 'u4k-cube-10000': 'Used 10 000 (square) for m³ ↔ cm³', 'u4k-cube-1000': 'Used 1000 for m³ ↔ cm³',
    'u4k-diam': 'Used the diameter as the radius', 'u4k-r-times-2': 'Took r × 2 instead of r²', 'u4k-no-square': 'Didn’t square the radius', 'u4k-no-pi': 'Left out π', 'u4k-pi314': 'Used 3.14 instead of the π key',
    'u4k-added': 'Added the lengths', 'u4k-surface': 'Found the surface area', 'u4k-one-layer': 'Multiplied only two lengths', 'u4k-no-half': 'Forgot the ½ in the triangle’s area', 'u4k-area-only': 'Gave the base area, not the volume', 'u4k-no-height': 'Left out the triangle’s height',
    'u4k-round-dir': 'Rounded the wrong way', 'u4k-exact': 'Rounded an exact answer', 'u4k-sq-unit': 'Squared unit for a volume', 'u4k-est': 'Estimate too far off'
  });
  HW.addPartial({ 'u4k-cube-12': 'b', 'u4k-cube-144': 'b', 'u4k-cube-3': 'b', 'u4k-cube-9': 'b', 'u4k-cube-100': 'b', 'u4k-cube-10000': 'b', 'u4k-cube-1000': 'b', 'u4k-diam': 'b', 'u4k-r-times-2': 'b', 'u4k-no-square': 'b', 'u4k-no-pi': 's', 'u4k-no-half': 'b', 'u4k-area-only': 'b', 'u4k-round-dir': 's', 'u4k-wrong-way': 'n', 'u4k-added': 'n', 'u4k-surface': 'n' });

  /* ======================= Lesson 1 ======================= */
  var num = C.num, fields = C.fields, sol3 = C.solid;
  function inFt(i) { return q(i / 12); }
  function ftT(i) { var f = i / 12; return near(f, rd(f, 4)) ? N(rd(f, 4)) : N(i) + '\\div 12'; }   // 4 in → 4 ÷ 12 (exact in the next step)
  function frT(i) { return i % 12 === 0 ? N(i / 12) : [3, 4, 6].indexOf(i) >= 0 ? '\\tfrac{1}{' + (12 / i) + '}' : i === 8 ? '\\tfrac{2}{3}' : i === 9 ? '\\tfrac{3}{4}' : nS(rd(i / 12, 4)) + '\\ldots'; }

  HW.addCodes({
    'u4l1-in-ft': 'Didn’t change inches to feet', 'u4l1-cm-m': 'Didn’t change cm to m', 'u4l1-no-round-up': 'Didn’t round the order up', 'u4l1-round-down': 'Rounded down (the job comes up short)', 'u4l1-whole-yd': 'Rounded to whole yards, not half yards',
    'u4l1-ft3-price': 'Priced cubic feet as cubic yards', 'u4l1-no-27': 'Didn’t change ft³ to yd³', 'u4l1-m3-yd3-way': 'Divided by 1.31 instead of multiplying', 'u4l1-m3-order': 'Ordered in m³ instead of yd³', 'u4l1-cost-unrounded': 'Cost of the unrounded amount',
    'u4l1-depth-ft': 'Gave the depth in feet, not inches', 'u4l1-vol-not-depth': 'Gave the volume, not the depth', 'u4l1-diff-sum': 'Added the volumes instead of subtracting', 'u4l1-est-diam': 'Estimate used the diameter', 'u4l1-est-exact': 'Calculated instead of estimating',
    'u4l1-floor-boxes': 'Didn’t round down to full boxes', 'u4l1-frac-drop': 'Dropped the fractions', 'u4l1-front': 'Counted the front face, not the bottom layer', 'u4l1-early-round': 'Rounded too early', 'u4l1-foam-once': 'Added the foam to one side only', 'u4l1-outer-only': 'Forgot to subtract the hole', 'u4l1-ft-in-6': 'Read 7 ft 6 in as 7.6 ft', 'u4l1-in-12': 'Changed feet to inches with ×10'
  });

  /* ---- the cubic conversions (Q9 and E4): one generator per kind ---- */
  var CONV = {
    ft3in3: function (r, ex) { var x = find(function () { return r.pick([1.5, 2, 2.5, 3, 4, 4.5, 5, 6]); }, function (v) { return (ex || []).indexOf(v) < 0; }); return C.cubicPart(N(x) + ' ft³ to in³', x, 'ft3_in3', true); },
    in3ft3: function (r, ex) { var k = find(function () { return r.pick([2, 4, 5, 6, 7, 8, 9, 10]); }, function (v) { return (ex || []).indexOf(v) < 0; }); return C.cubicPart(Np(k * 1728) + ' in³ to ft³', k * 1728, 'ft3_in3', false); },
    yd3ft3: function (r, ex) { var x = find(function () { return r.pick([2, 3, 5, 6, 7, 8, 10, 12]); }, function (v) { return (ex || []).indexOf(v) < 0; }); return C.cubicPart(N(x) + ' yd³ to ft³', x, 'yd3_ft3', true); },
    ft3yd3: function (r, ex) { var k = find(function () { return r.pick([2, 4, 5, 6, 7, 8, 9]); }, function (v) { return (ex || []).indexOf(v) < 0; }); return C.cubicPart(Np(k * 27) + ' ft³ to yd³', k * 27, 'yd3_ft3', false); },
    m3cm3: function (r, ex) { var x = find(function () { return r.pick([0.5, 0.6, 1.5, 2, 2.5, 3, 4, 0.8]); }, function (v) { return (ex || []).indexOf(v) < 0; }); return C.cubicPart(N(x) + ' m³ to cm³', x, 'm3_cm3', true); },
    cm3m3: function (r, ex) { var x = find(function () { return r.pick([125000, 250000, 300000, 500000, 600000, 750000, 80000, 120000]); }, function (v) { return (ex || []).indexOf(v) < 0; }); return C.cubicPart(Np(x) + ' cm³ to m³', x, 'm3_cm3', false); }
  };

  /* ---- Q2 / E1: a rectangular prism row ---- */
  function boxPart(prompt, l, w, h, u, dp, o) {
    o = o || {}; var V = l * w * h;
    return num(prompt, V, { dp: dp, exact: V, after: u + '³', cubic: true, bad: C.boxBad(l, w, h).concat(o.bad || []), sol: [o.pre, C.boxSol(l, w, h, u, dp)], hints: o.hints || ['Volume = length × width × height.'], text: o.text });
  }
  /* ---- a cylinder ---- */
  function cylPart(prompt, r, h, u, dp, o) {
    o = o || {}; var V = C.cylV(r, h);
    return num(prompt, V, { dp: dp, exact: V, after: u + '³', cubic: true, bad: C.cylBad(r, h, { d: o.d }).concat(o.bad || []), sol: C.cylSol(r, h, u, dp, { d: o.d }).concat(o.post || []),
      hints: o.hints || [(o.d ? 'Halve the diameter to get the radius. ' : '') + t('V=\\pi r^2h') + '.', 'Round at the end.'], text: o.text });
  }
  /* ---- an order of material: amount to buy (rounded up to step) and the cost ---- */
  function orderRows(need, step, price, unit, o) {
    o = o || {}; var buy = roundUp(need, step), cost = q(buy * price);
    var sold = step === 1 ? 'It is sold only in whole ' + (o.word || 'cubic yards') + '.' : 'It is sold in ' + (step === 0.5 ? 'half' : 'quarter') + ' ' + (o.word || 'cubic yards') + ' (' + (step === 0.5 ? '1, 1.5, 2, …' : '1, 1.25, 1.5, 1.75, …') + ').';
    var bad = [[rd(need, 2), 'u4l1-no-round-up', sold + ' Round <b>up</b> to the next amount you can buy.'], [rd(need, 1), 'u4l1-no-round-up', sold + ' Round <b>up</b> to the next amount you can buy.'],
      [q(buy - step), 'u4l1-round-down', 'Always round <b>up</b> when ordering. ' + N(q(buy - step)) + ' is not quite enough, so the job would come up short.']];
    if (step < 1 && !near(Math.ceil(need - 1e-9), buy)) bad.push([Math.ceil(need - 1e-9), 'u4l1-whole-yd', 'It is sold in ' + (step === 0.5 ? 'half' : 'quarter') + ' cubic yards, so you can buy ' + (step === 0.5 ? '1, 1.5, 2, …' : '1, 1.25, 1.5, 1.75, …') + '. Round up to the next one of those.']);
    var cbad = [[need * price, 'u4l1-cost-unrounded', 'Find the cost of the amount you <b>order</b> (rounded up), not the exact amount needed.'], [q((buy - step) * price), 'u4l1-round-down', 'Use the amount you order (rounded <b>up</b>).']].concat(o.cbad || []);
    return [{ label: 'Order:', name: 'Amount to order', ans: buy, dp: null, after: unit, bad: bad.concat(o.bad || []) }, { label: 'Cost:', name: 'Cost', ans: cost, money: true, bad: cbad }];
  }

  HW.defineLesson({
    id: 'u4l1', unit: 4, num: '1', title: 'Volume of Prisms and Cylinders', outcome: 'M1',
    blurb: 'Volume of boxes, triangular prisms and cylinders, cubic unit conversions, and ordering concrete, soil and gravel.',
    questions: [
      { num: '1', parts: [
        { id: '1a', level: 'BEG', outcome: 'M1', make: function (r) {
          var v = find(function () { return [r.int(3, 6), r.int(2, 4), r.int(2, 4)]; }, function (v) { return !(v[0] === 4 && v[1] === 3 && v[2] === 2) && v[0] !== v[1]; }), l = v[0], w = v[1], h = v[2];
          return fields('(a) This box is built from 1 cm cubes. How many cubes are in the bottom layer? How many layers are there? What is the volume?' + C.cubes(l, w, h, { l: l + ' cm', w: w + ' cm', h: h + ' cm' }), [
            { label: 'Bottom layer:', name: 'Bottom layer', ans: l * w, after: 'cubes', bad: [[l + w, 'u4k-added', 'The bottom layer is ' + l + ' cubes long and ' + w + ' cubes deep: multiply.'], [l * h, 'u4l1-front', 'That’s the front face. The bottom layer is ' + l + ' cubes by ' + w + ' cubes.']] },
            { label: 'Layers:', name: 'Layers', ans: h, after: 'layers', bad: [] },
            { label: 'Volume:', name: 'Volume', ans: l * w * h, after: 'cm³', cubic: true, bad: C.boxBad(l, w, h) }],
            ['Bottom layer: ' + t(l + '\\times ' + w + '=' + l * w) + ' cubes; ' + h + ' layers', t('V=' + l * w + '\\times ' + h + '=' + l * w * h + uT('cm³'))], ['Count the cubes along the front and along the side of the bottom layer, then multiply.', 'Volume = cubes in a layer × number of layers.'], 'cube box');
        } },
        { id: '1b', level: 'BEG', outcome: 'M2', make: function (r) {
          var a = r.int(4, 9), b = r.int(3, 7), n = r.int(3, 6);
          return num('(b) A box is filled with 1 in cubes. Each layer is ' + a + ' cubes by ' + b + ' cubes, and there are ' + n + ' layers. What is the volume of the box?', a * b * n, { after: 'in³', cubic: true,
            bad: [[a * b, 'u4k-one-layer', 'That’s one layer. Multiply by the ' + n + ' layers.'], [a + b + n, 'u4k-added', 'Multiply: cubes per layer × layers.'], [(a + b) * n, 'u4k-added', 'Cubes per layer = ' + a + ' × ' + b + ' (multiply, don’t add).']],
            sol: [t(a + '\\times ' + b + '=' + a * b) + ' cubes per layer', t(a * b + '\\times ' + n + '=' + a * b * n + uT('in³'))], hints: ['Cubes per layer × number of layers.'], text: 'cube layers' });
        } }] },
      { num: '2', stem: function (sh) {
          return 'Find the volume of each rectangular prism. Round (c) to the nearest tenth.' + C.table(['Object', 'Length × width × height', 'Volume'], sh.rows.map(function (rw, i) { return ['(' + 'abcd'[i] + ') ' + rw.name, rw.dims, '?']; }));
        },
        shared: function (r) {
          var a = find(function () { return [r.pick([5, 6, 7, 8]), r.pick([4, 5]), r.pick([9.5, 10, 10.5, 11, 12.5])]; }, function (v) { return v[0] !== v[1]; });
          var b = find(function () { return [r.int(18, 26), r.int(14, 18), r.int(11, 16)]; }, function (v) { return v[0] > v[1] && v[1] > v[2] && !(v[0] === 13); });
          var c = find(function () { return [pickR(r, 3.6, 4.8, 0.1), pickR(r, 2.0, 2.4, 0.1), pickR(r, 2.1, 2.5, 0.1)]; }, function (v) { var V = v[0] * v[1] * v[2]; return decs(V) >= 2 && !near(v[0], 12) && Math.abs(rd(V, 1) - V) > 0.002; });
          var d = find(function () { return [r.pick([3.5, 4, 4.5, 5, 5.5]), r.pick([1.5, 2, 2.5]), r.pick([1.75, 2, 2.25, 2.5])]; }, function (v) { var V = v[0] * v[1] * v[2], fr = v.filter(function (x) { return !Number.isInteger(x); }).length; return fr >= 2 && decs(V) <= 2 && !(v[0] === 2.5 && v[1] === 1.5); });
          var nm = [r.pick(['Juice box', 'Cracker box', 'Tissue box']), r.pick(['Microwave box', 'Shipping box', 'TV stand box']), r.pick(['Moving truck box', 'Storage shed', 'Trailer box']), r.pick(['Garden storage chest', 'Toy box', 'Firewood box'])];
          return { rows: [{ name: nm[0], v: a, u: 'cm', dims: a.map(function (x) { return N(x) + ' cm'; }).join(' × ') }, { name: nm[1], v: b, u: 'in', dims: b.map(function (x) { return x + ' in'; }).join(' × ') },
            { name: nm[2], v: c, u: 'm', dims: c.map(function (x) { return N(x) + ' m'; }).join(' × ') }, { name: nm[3], v: d, u: 'ft', dims: d.map(function (x) { return t(mixT(x)) + ' ft'; }).join(' × ') }] };
        },
        parts: [
          { id: '2a', level: 'BEG', outcome: 'M1', make: function (r, sh) { var v = sh.rows[0].v; return boxPart('(a) ' + sh.rows[0].name + ': ' + sh.rows[0].dims, v[0], v[1], v[2], 'cm', null, { text: 'box cm' }); } },
          { id: '2b', level: 'BEG', outcome: 'M2', make: function (r, sh) { var v = sh.rows[1].v; return boxPart('(b) ' + sh.rows[1].name + ': ' + sh.rows[1].dims, v[0], v[1], v[2], 'in', null, { text: 'box in' }); } },
          { id: '2c', level: 'EMG', outcome: 'M1', make: function (r, sh) { var v = sh.rows[2].v; return boxPart('(c) ' + sh.rows[2].name + ': ' + sh.rows[2].dims + '. Round to the nearest tenth.', v[0], v[1], v[2], 'm', 1, { text: 'box m' }); } },
          { id: '2d', level: 'EMG', outcome: 'M2', make: function (r, sh) { var v = sh.rows[3].v;
            return boxPart('(d) ' + sh.rows[3].name + ': ' + sh.rows[3].dims, v[0], v[1], v[2], 'ft', null, { pre: 'Change the fractions to decimals: ' + v.map(function (x) { return t(mixT(x) + '=' + N(x)); }).join(', '),
              bad: [[Math.floor(v[0]) * Math.floor(v[1]) * Math.floor(v[2]), 'u4l1-frac-drop', 'Keep the fractions: ' + t('\\tfrac{1}{2}=0.5') + ', ' + t('\\tfrac{1}{4}=0.25') + ', ' + t('\\tfrac{3}{4}=0.75') + '.']],
              hints: ['Change each mixed number to a decimal first: ' + t('2\\tfrac{1}{4}=2.25') + '.', 'Then multiply the three lengths.'], text: 'box ft fractions' }); } }] },
      { num: '3', stem: function (sh) { return sh.who + ' is choosing a planter for ' + sh.his + ' balcony. One is a cube ' + sh.e + ' cm on each edge. The other is a long box ' + sh.b.join(' cm by ') + ' cm.'; },
        shared: function (r) {
          return find(function () { var e = r.pick([30, 35, 40, 45, 50]), b = [r.int(12, 20) * 5, r.int(4, 7) * 5, r.int(5, 8) * 5]; var who = r.pick([['Ashok', 'his'], ['Lena', 'her'], ['Marcus', 'his'], ['Yuki', 'her']]); return { e: e, b: b, Vc: e * e * e, Vb: b[0] * b[1] * b[2], who: who[0], his: who[1] }; },
            function (s) { var d = Math.abs(s.Vc - s.Vb) / s.Vc; return d > 0.02 && d < 0.15 && s.b[0] > s.b[2] && s.b[2] >= s.b[1]; },
            { e: 40, b: [80, 25, 30], Vc: 64000, Vb: 60000, who: 'Ashok', his: 'his' });
        },
        parts: [
          { id: '3a', level: 'EMG', outcome: 'M1', make: function (r, sh) {
            return fields('(a) Find the volume of each planter.', [{ label: 'Cube:', name: 'Cube', ans: sh.Vc, after: 'cm³', cubic: true, bad: [[sh.e * 3, 'u4k-added', 'A cube’s three edges are all ' + sh.e + ' cm: ' + t(sh.e + '\\times ' + sh.e + '\\times ' + sh.e) + '.'], [sh.e * sh.e, 'u4k-one-layer', 'Multiply by the third edge too.'], [6 * sh.e * sh.e, 'u4k-surface', 'That’s the surface area. Volume = edge × edge × edge.']] },
              { label: 'Long box:', name: 'Long box', ans: sh.Vb, after: 'cm³', cubic: true, bad: C.boxBad(sh.b[0], sh.b[1], sh.b[2]) }],
              ['Cube: ' + t(sh.e + '\\times ' + sh.e + '\\times ' + sh.e + '=' + N(sh.Vc) + uT('cm³')), 'Long box: ' + t(sh.b.join('\\times ') + '=' + N(sh.Vb) + uT('cm³'))], ['A cube has the same length, width and height.'], 'planter volumes');
          } },
          { id: '3b', level: 'EMG', outcome: 'M1', make: function (r, sh) { var cube = sh.Vc > sh.Vb;
            return P.mc(r, '(b) Which planter holds more soil?', [{ html: 'The cube', right: cube, why: cube ? null : 'Compare your two volumes from (a): the bigger volume holds more soil.', code: 'cube' }, { html: 'The long box', right: !cube, why: !cube ? null : 'Compare your two volumes from (a). Longer doesn’t always mean more.', code: 'long' }, { html: 'They hold the same amount', why: 'Look at the volumes again: they are close, but not the same.', code: 'same' }],
              'Cube: ' + t(N(sh.Vc) + uT('cm³')) + ', long box: ' + t(N(sh.Vb) + uT('cm³')) + '.<br>The <b>' + (cube ? 'cube' : 'long box') + '</b> holds more.', ['Use the volumes from (a).'], 'which planter', true); } },
          { id: '3c', level: 'EMG', outcome: 'M1', make: function (r, sh) { var dif = Math.abs(sh.Vc - sh.Vb);
            return num('(c) By how much?', dif, { after: 'cm³', cubic: true, bad: [[sh.Vc + sh.Vb, 'u4l1-diff-sum', 'Subtract the smaller volume from the bigger one.']], sol: t(N(Math.max(sh.Vc, sh.Vb)) + '-' + N(Math.min(sh.Vc, sh.Vb)) + '=' + N(dif) + uT('cm³')), hints: ['Bigger volume − smaller volume.'], text: 'planter difference' }); } }] },
      { num: '4', stem: 'Find the volume of each triangular prism.', parts: [
        { id: '4a', level: 'EMG', outcome: 'M2', make: function (r) {
          var b = r.pick([6, 7, 8, 9, 10]), h = r.pick([3, 4, 5, 6]), L = r.pick([12, 14, 15, 16, 18, 20, 24]);
          return num('(a) A wooden doorstop. The triangle has a base of ' + b + ' in and a height of ' + h + ' in; the doorstop is ' + L + ' in long.' + sol3('triprism', { b: b + ' in', ht: h + ' in', l: L + ' in', width: 220 }), b * h / 2 * L, { after: 'in³', cubic: true, bad: C.triBad(b, h, L), sol: C.triSol(b, h, L, 'in'), hints: ['Area of the triangle = ½ × base × height.', 'Volume = area of the triangle × length of the prism.'], text: 'doorstop' });
        } },
        { id: '4b', level: 'EMG', outcome: 'M1', make: function (r) {
          var v = find(function () { return [r.pick([2, 2.2, 2.4, 2.6, 2.8, 3]), pickR(r, 1.2, 1.8, 0.1), pickR(r, 2.1, 3.2, 0.1)]; }, function (v) { return decs(v[0] * v[1] / 2 * v[2]) <= 3; }), b = v[0], h = v[1], L = v[2], V = q(b * h / 2 * L);
          return num('(b) An A-frame tent. The triangle at the front is ' + N(b) + ' m wide at the bottom and ' + N(h) + ' m tall. The tent is ' + N(L) + ' m long. Round to the nearest hundredth if needed.', V, { dp: decs(V) > 2 ? 2 : null, exactOk: true, after: 'm³', cubic: true, bad: C.triBad(b, h, L),
            sol: C.triSol(b, h, L, 'm', decs(V) > 2 ? 2 : null), hints: ['The triangle at the front is the base: area = ½ × ' + N(b) + ' × ' + N(h) + '.', 'Multiply by the length of the tent.'], text: 'tent' });
        } }] },
      { num: '5', stem: function (sh) { return 'A triangular prism has a triangle base with ' + t('b=' + sh.b) + ' cm and ' + t('h=' + sh.h) + ' cm. The prism is ' + sh.L + ' cm long. Jordan wrote: ' + t('V=' + sh.b + '\\times ' + sh.h + '\\times ' + sh.L + '=' + sh.b * sh.h * sh.L + uT('cm³')) + '.'; },
        shared: function (r) { return find(function () { return { b: r.pick([4, 6, 8, 10, 12]), h: r.pick([3, 4, 5, 6, 7]), L: r.pick([8, 9, 10, 12, 14, 15]) }; }, function (s) { return !(s.b === 6 && s.h === 4 && s.L === 15) && s.b !== s.h; }); },
        parts: [
          { id: '5a', level: 'EMG', outcome: 'M1', make: function (r, sh) {
            return P.mc(r, '(a) What mistake did Jordan make?', [
              { html: 'He forgot the ' + t('\\tfrac{1}{2}') + ' in the area of the triangle, so he found the volume of a box instead.', right: true },
              { html: 'He should have added the three lengths.', why: 'Volume is never found by adding lengths. Look at the triangle’s area.', code: 'add' },
              { html: 'He used the wrong unit: the answer should be in cm².', why: 'Volume has a cubed unit, so cm³ is right. Look at the area of the triangle.', code: 'unit' },
              { html: 'He should have multiplied by 2, not by ' + sh.L + '.', why: 'The length of the prism (' + sh.L + ' cm) is right to use. Look at the triangle’s area.', code: 'times2' }],
              'The base is a triangle, so its area is ' + t('\\tfrac{1}{2}\\times b\\times h') + '. Jordan left out the ' + t('\\tfrac{1}{2}') + ' (he found the volume of a box).', ['How do you find the area of a triangle?'], 'Jordan mistake');
          } },
          { id: '5b', level: 'EMG', outcome: 'M1', make: function (r, sh) { return num('(b) Find the correct volume.', sh.b * sh.h / 2 * sh.L, { after: 'cm³', cubic: true, bad: C.triBad(sh.b, sh.h, sh.L), sol: C.triSol(sh.b, sh.h, sh.L, 'cm'), hints: ['Area of base = ½ × b × h. Then multiply by the length.'], text: 'Jordan correct' }); } }] },
      { num: '6', stem: 'Find the volume of each cylinder. Round to the nearest tenth.', parts: [
        { id: '6a', level: 'BEG', outcome: 'M1', make: function (r) { var v = find(function () { return [r.int(2, 6), r.int(5, 12)]; }, function (v) { return v[0] !== v[1]; });
          return cylPart('(a) radius ' + v[0] + ' cm, height ' + v[1] + ' cm' + sol3('cylinder', { r: v[0] + ' cm', h: v[1] + ' cm', width: 170 }), v[0], v[1], 'cm', 1, { text: 'cyl radius' }); } },
        { id: '6b', level: 'EMG', outcome: 'M2', make: function (r) { var d = r.pick([6, 8, 10, 12, 14]), h = r.int(7, 15);
          return cylPart('(b) diameter ' + d + ' in, height ' + h + ' in' + sol3('cylinder', { d: d + ' in', h: h + ' in', width: 170 }), d / 2, h, 'in', 1, { d: true, text: 'cyl diameter' }); } },
        { id: '6c', level: 'EMG', outcome: 'M2', make: function (r) { var it = r.pick([['a hockey puck', 3, 1], ['a round tin of mints', 2.5, 0.75], ['a candle in a jar', 3, 3.5], ['a round coaster', 4, 0.25], ['a roll of tape', 2, 1]]);
          return cylPart('(c) ' + it[0] + ': diameter ' + N(it[1]) + ' in, height ' + N(it[2]) + ' in', it[1] / 2, it[2], 'in', 1, { d: true, text: 'cyl object' }); } }] },
      { num: '7', stem: function (sh) { return 'A pillar candle is a cylinder ' + N(sh.d) + ' cm across and ' + sh.h + ' cm tall.'; },
        shared: function (r) { var d = r.pick([6.2, 6.4, 6.6, 6.8, 7.2, 7.6, 7.8, 8.2, 8.4, 8.6, 8.8]); return { d: d, r: q(d / 2), R: Math.round(d / 2), h: r.pick([10, 12, 15, 18, 20]) }; },
        parts: [
          { id: '7a', level: 'EMG', outcome: 'M1', make: function (r, sh) { var est = 3 * sh.R * sh.R * sh.h, V = C.cylV(sh.r, sh.h);
            return num('(a) Estimate its volume. Use ' + t('\\pi\\approx 3') + ' and round the radius to a whole number.', est, { after: 'cm³', cubic: true,
              bad: [[3 * Math.round(sh.d) * Math.round(sh.d) * sh.h, 'u4l1-est-diam', 'Use the radius, not the diameter: ' + t('r=' + N(sh.d) + '\\div 2=' + N(sh.r) + '\\approx ' + sh.R) + '.'], [3 * sh.R * 2 * sh.h, 'u4k-r-times-2', t('r^2=r\\times r') + ': ' + t(sh.R + '^2=' + sh.R * sh.R) + '.'], [3 * sh.R * sh.h, 'u4k-no-square', 'Square the radius: ' + t('3\\times ' + sh.R + '^2\\times ' + sh.h) + '.'],
                [V, 'u4l1-est-exact', 'That’s the exact volume. For the estimate, use ' + t('\\pi\\approx 3') + ' and ' + t('r\\approx ' + sh.R) + '.', 'form'], [3 * sh.r * sh.r * sh.h, 'u4l1-est-exact', 'Round the radius to a whole number first: ' + t(N(sh.r) + '\\approx ' + sh.R) + '.', 'form'], [Math.PI * sh.R * sh.R * sh.h, 'u4l1-est-exact', 'Use ' + t('\\pi\\approx 3') + ' for the estimate.', 'form']],
              sol: [t('r=' + N(sh.d) + '\\div 2=' + N(sh.r) + '\\approx ' + sh.R) + ' cm', t('3\\times ' + sh.R + '^2\\times ' + sh.h + '=3\\times ' + sh.R * sh.R + '\\times ' + sh.h + '=' + est + uT('cm³'))], hints: ['Radius = diameter ÷ 2, then round it to a whole number.', 'Estimate = 3 × r² × h.'], text: 'candle estimate' }); } },
          { id: '7b', level: 'EMG', outcome: 'M1', make: function (r, sh) { var est = 3 * sh.R * sh.R * sh.h;
            return cylPart('(b) Calculate its volume to the nearest tenth. (Check: is it close to your estimate?)', sh.r, sh.h, 'cm', 1, { d: true, post: ['This is close to the estimate of ' + t(est + uT('cm³')) + ', so it is reasonable.'], text: 'candle volume' }); } }] },
      { num: '8', stem: function (sh) { return 'Can A is ' + N(sh.dA) + ' cm across and ' + N(sh.hA) + ' cm tall. Can B is ' + N(sh.dB) + ' cm across and ' + N(sh.hB) + ' cm tall. Ella says Can A must hold more because it is taller.'; },
        shared: function (r) { var bMore = r.chance(0.7);
          return find(function () { var s = { dA: pickR(r, 6.0, 7.0, 0.2), hA: pickR(r, 11, 13, 0.2), dB: pickR(r, 8.0, 9.2, 0.2), hB: pickR(r, 6.6, 8.4, 0.2) }; s.VA = C.cylV(s.dA / 2, s.hA); s.VB = C.cylV(s.dB / 2, s.hB); return s; },
            function (s) { var d = (s.VB - s.VA) / s.VA; return (bMore ? d > 0.004 && d < 0.06 : d < -0.004 && d > -0.06) && Math.abs(rd(s.VA, 1) - rd(s.VB, 1)) >= 1 && Math.abs(rd(s.VA, 1) - s.VA) > 0.004 && Math.abs(rd(s.VB, 1) - s.VB) > 0.004; }); },
        parts: [
          { id: '8a', level: 'PRG', outcome: 'M1', make: function (r, sh) {
            return fields('(a) Find the volume of each can, to the nearest tenth.', [{ label: 'Can A:', name: 'Can A', ans: sh.VA, dp: 1, exact: sh.VA, after: 'cm³', bad: C.cylBad(sh.dA / 2, sh.hA, { d: true }) }, { label: 'Can B:', name: 'Can B', ans: sh.VB, dp: 1, exact: sh.VB, after: 'cm³', bad: C.cylBad(sh.dB / 2, sh.hB, { d: true }) }],
              ['A: ' + t('r=' + N(sh.dA / 2) + ';\\ V=\\pi\\times ' + N(sh.dA / 2) + '^2\\times ' + N(sh.hA) + eqR(sh.VA, 1) + uT('cm³')), 'B: ' + t('r=' + N(sh.dB / 2) + ';\\ V=\\pi\\times ' + N(sh.dB / 2) + '^2\\times ' + N(sh.hB) + eqR(sh.VB, 1) + uT('cm³'))], ['Halve each diameter to get the radius.', t('V=\\pi r^2h') + ' for each can.'], 'two cans');
          } },
          { id: '8b', level: 'EMG', outcome: 'M1', make: function (r, sh) { var bMore = sh.VB > sh.VA, dif = Math.abs(rd(sh.VB, 1) - rd(sh.VA, 1));
            return P.mc(r, '(b) Is Ella right?', [
              { html: 'No. Can B holds more, even though it is shorter: its radius is bigger, and the radius is squared.', right: bMore, why: bMore ? null : 'Look at your volumes from (a) again: which one is bigger?', code: 'b-more' },
              { html: 'Yes. A taller can always holds more.', why: 'Height is not the whole story: the radius is squared, so a wider can can hold more.', code: 'taller' },
              { html: 'Can A does hold more this time, but not just because it is taller: you have to compare the volumes.', right: !bMore, why: !bMore ? null : 'Look at your volumes from (a) again: which one is bigger?', code: 'a-more' },
              { html: 'They hold exactly the same amount.', why: 'The volumes are close, but not the same.', code: 'same' }],
              'A: ' + t(N(rd(sh.VA, 1), 1) + uT('cm³')) + ', B: ' + t(N(rd(sh.VB, 1), 1) + uT('cm³')) + '.<br>' + (bMore ? 'No. Can B holds about ' + N(rd(dif, 1)) + ' cm³ more, even though it is shorter. Its radius is bigger, and the radius is squared.' : 'Can A holds about ' + N(rd(dif, 1)) + ' cm³ more, but you can only tell by finding both volumes: a wider can can hold more.'), ['Compare the two volumes from (a).'], 'Ella', true); } }] },
      { num: '9', stem: 'Convert each volume.', parts: [
        { id: '9a', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.ft3in3(r, [3.5]); p.prompt = '(a) ' + p.prompt; return p; } },
        { id: '9b', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.in3ft3(r, [3]); p.prompt = '(b) ' + p.prompt; return p; } },
        { id: '9c', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.yd3ft3(r, [4]); p.prompt = '(c) ' + p.prompt; return p; } },
        { id: '9d', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.ft3yd3(r, [3]); p.prompt = '(d) ' + p.prompt; return p; } },
        { id: '9e', level: 'BEG', outcome: 'M1', make: function (r) { var p = CONV.m3cm3(r, [0.25]); p.prompt = '(e) ' + p.prompt; return p; } },
        { id: '9f', level: 'EMG', outcome: 'M1', make: function (r) { var p = CONV.cm3m3(r, [45000]); p.prompt = '(f) ' + p.prompt; return p; } },
        { id: '9g', level: 'EMG', outcome: 'M1', make: function (r) {
          var k = r.pick([['m', 'cm', 100, 1000000], ['ft', 'in', 12, 1728], ['yd', 'ft', 3, 27]]), who = r.pick(['Kim', 'Raj', 'Lucy', 'Sam']);
          return P.mc(r, '(g) ' + who + ' says, “1 ' + k[0] + ' = ' + k[2] + ' ' + k[1] + ', so 1 ' + k[0] + '³ = ' + k[2] + ' ' + k[1] + '³.” What is the mistake?', [
            { html: 'A 1 ' + k[0] + ' cube is ' + k[2] + ' ' + k[1] + ' long, ' + k[2] + ' ' + k[1] + ' wide <b>and</b> ' + k[2] + ' ' + k[1] + ' high, so 1 ' + k[0] + '³ = ' + t(k[2] + '\\times ' + k[2] + '\\times ' + k[2] + '=' + N(k[3])) + ' ' + k[1] + '³. The ' + k[2] + ' is used three times, not once.', right: true },
            { html: 'It should be ' + t(k[2] + '\\times 3=' + k[2] * 3) + ' ' + k[1] + '³, because there are three dimensions.', why: 'The three dimensions are <b>multiplied</b>: ' + t(k[2] + '\\times ' + k[2] + '\\times ' + k[2]) + '.', code: 'times3' },
            { html: 'It should be ' + t(k[2] + '\\times ' + k[2] + '=' + N(k[2] * k[2])) + ' ' + k[1] + '³.', why: t(k[2] + '\\times ' + k[2]) + ' is a <b>square</b> unit (one layer). A cube also has ' + k[2] + ' layers.', code: 'square' },
            { html: 'There is no mistake: you can always use the same number for cubic units.', why: 'Picture a 1 ' + k[0] + ' cube filled with 1 ' + k[1] + ' cubes. How many fit?', code: 'none' }],
            'A cube 1 ' + k[0] + ' on each edge is ' + k[2] + ' ' + k[1] + ' long, wide and high, so 1 ' + k[0] + '³ = ' + t(k[2] + '\\times ' + k[2] + '\\times ' + k[2] + '=' + N(k[3])) + ' ' + k[1] + '³. ' + who + ' used the ' + k[2] + ' only once.', ['Picture the cube filled with small cubes: length × width × height.'], 'cubic mistake');
        } }] },
      { num: '10', stem: function (sh) { return 'The space inside a chest freezer is ' + sh.l + ' in long, ' + sh.w + ' in wide and ' + sh.h + ' in deep.'; },
        shared: function (r) { return find(function () { var s = { l: r.int(36, 48), w: r.int(20, 26), h: r.int(26, 34) }; s.V = s.l * s.w * s.h; s.ft = s.V / 1728; s.fair = r.chance(0.65); s.flyer = s.fair ? Math.round(s.ft) : Math.round(s.ft) + r.int(3, 5); return s; }, function (s) { return Math.abs(rd(s.ft, 1) - s.ft) > 0.003 && Math.abs(s.ft - Math.round(s.ft)) < 0.45 && s.l % 2 === 0; }); },
        parts: [
          { id: '10a', level: 'BEG', outcome: 'M2', make: function (r, sh) { return boxPart('(a) Find the volume in cubic inches.', sh.l, sh.w, sh.h, 'in', null, { text: 'freezer in3' }); } },
          { id: '10b', level: 'EMG', outcome: 'M2', make: function (r, sh) {
            return num('(b) Change it to cubic feet. Round to the nearest tenth.', sh.ft, { dp: 1, exact: sh.ft, after: 'ft³', bad: [[sh.V / 12, 'u4k-cube-12', C.CUBIC.ft3_in3.wrongF[0][2]], [sh.V / 144, 'u4k-cube-144', C.CUBIC.ft3_in3.wrongF[1][2]], [sh.V * 1728, 'u4k-wrong-way', 'Cubic inches → cubic feet: divide by 1728.']],
              sol: t(N(sh.V) + '\\div 1728' + eqR(sh.ft, 1) + uT('ft³')), hints: ['1 ft³ = 1728 in³. Small unit → big unit: divide.'], text: 'freezer ft3' }); } },
          { id: '10c', level: 'EMG', outcome: 'M2', make: function (r, sh) { var x = rd(sh.ft, 1);
            return P.mc(r, '(c) The flyer says the freezer holds “' + sh.flyer + ' cu. ft.” Is that about right?', [
              { html: 'Yes. ' + N(x) + ' ft³ is about ' + sh.flyer + ' ft³ (“cu. ft.” means cubic feet).', right: sh.fair, why: sh.fair ? null : 'Compare: ' + N(x) + ' ft³ is a few cubic feet less than ' + sh.flyer + '.', code: 'yes' },
              { html: 'No. It holds only about ' + N(x) + ' ft³, which is well under ' + sh.flyer + ' ft³.', right: !sh.fair, why: !sh.fair ? null : N(x) + ' ft³ rounds to ' + sh.flyer + ' ft³, so the flyer is about right.', code: 'no' },
              { html: 'No. It holds ' + Np(sh.V) + ', much more than ' + sh.flyer + '.', why: Np(sh.V) + ' is in cubic <b>inches</b>. Compare in the same unit (ft³).', code: 'in3' },
              { html: 'No. “cu. ft.” means square feet, so it can’t be compared.', why: '“cu. ft.” means <b>cubic</b> feet (ft³).', code: 'sq' }],
              N(x) + ' ft³ ' + (sh.fair ? 'is about ' + sh.flyer + ' ft³, so the flyer is about right.' : 'is a few cubic feet less than ' + sh.flyer + ' ft³, so the flyer is not right.'), ['Compare your answer from (b) with the flyer.'], 'flyer', true); } }] },
      { num: '11', stem: function (sh) { return sh.who + ' is filling a raised garden bed ' + sh.L + ' ft long and ' + sh.W + ' ft wide with soil ' + sh.D + ' in deep. Bags of garden soil hold ' + N(sh.bag) + ' ft³ and cost ' + Mp(sh.pr) + ' each.'; },
        shared: function (r) { return find(function () { var s = { who: r.pick(['Destiny', 'Arjun', 'Carmen', 'Wes']), L: r.pick([6, 8, 10, 12]), W: r.pick([3, 4, 5]), D: r.pick([8, 9, 10, 11]), bag: r.pick([1.5, 2]), pr: r.pick([5.97, 6.47, 7.97, 8.49, 9.29]) }; s.V = s.L * s.W * s.D / 12; s.Vr = rd(s.V, 2); s.n = Math.ceil(s.Vr / s.bag - 1e-9); return s; },
          function (s) { var fr = s.Vr / s.bag - Math.floor(s.Vr / s.bag); return fr > 0.1 && fr < 0.9 && Math.ceil(s.V / s.bag - 1e-9) === s.n && !(s.L === 8 && s.W === 4 && s.D === 10 && s.bag === 1.5); }); },
        parts: [
          { id: '11a', level: 'PRG', outcome: 'M2', make: function (r, sh) {
            return num('(a) Find the volume of soil ' + (sh.who === 'Arjun' || sh.who === 'Wes' ? 'he' : 'she') + ' needs, to the nearest hundredth of a cubic foot.', sh.V, { dp: 2, exact: sh.V, after: 'ft³',
              bad: [[sh.L * sh.W * sh.D, 'u4l1-in-ft', 'The depth is in <b>inches</b>. Change it to feet first: ' + t(sh.D + '\\div 12') + '.'], [sh.L * sh.W * sh.D / 10, 'u4l1-in-ft', 'There are 12 inches in a foot, not 10: ' + t(sh.D + '\\div 12') + '.'], [sh.L * sh.W * sh.D / 1728, 'u4k-cube-12', 'Only the depth is in inches. Change it to feet (' + t('\\div 12') + '), then multiply.'], [sh.L * sh.W * rd(sh.D / 12, 2), 'u4l1-early-round', 'Don’t round the depth too early: use ' + t(sh.D + '\\div 12') + ' in the calculator.', 'form']],
              sol: [t(sh.D + '\\text{ in}=' + sh.D + '\\div 12=' + raw(sh.D / 12, 4) + '\\text{ ft}'), t('V=' + sh.L + '\\times ' + sh.W + '\\times ' + raw(sh.D / 12, 4) + eqR(sh.V, 2) + uT('ft³'))], hints: ['Change the depth to feet: inches ÷ 12.', 'Then V = length × width × depth.'], text: 'soil volume' }); } },
          { id: '11b', level: 'PRG', outcome: 'M2', make: function (r, sh) { var n = sh.n, cost = q(n * sh.pr), ex = sh.Vr / sh.bag;
            return fields('(b) How many bags should ' + (sh.who === 'Arjun' || sh.who === 'Wes' ? 'he' : 'she') + ' buy, and what will they cost before tax?', [
              { label: 'Bags:', name: 'Bags', ans: n, after: 'bags', bad: [[Math.floor(ex), 'u4l1-round-down', 'With ' + Math.floor(ex) + ' bags the bed won’t be full. Round <b>up</b>.'], [rd(ex, 2), 'u4l1-no-round-up', 'You can only buy whole bags. Round <b>up</b>.'], [sh.Vr * sh.bag, 'u4k-wrong-way', 'Divide the volume by the size of one bag.']] },
              { label: 'Cost:', name: 'Cost', ans: cost, money: true, bad: [[Math.floor(ex) * sh.pr, 'u4l1-round-down', 'Use the number of bags you buy (rounded up).'], [ex * sh.pr, 'u4l1-cost-unrounded', 'You pay for whole bags: multiply the number of bags by the price.'], [sh.Vr * sh.pr, 'u4l1-ft3-price', 'The price is per <b>bag</b>, not per cubic foot.']] }],
              [t(N(sh.Vr) + '\\div ' + N(sh.bag) + eqR(ex, 2)) + ', so round up to ' + n + ' bags.', t(n + '\\times ' + M(sh.pr) + '=' + M(cost))], ['Bags = volume ÷ size of one bag. Round up.', 'Cost = bags × price.'], 'soil bags'); } }] },
      { num: '12', stem: function (sh) { return 'A round concrete pad for a fire pit is ' + sh.D + ' ft across and ' + sh.T + ' in thick. Concrete is sold in half cubic yards at ' + Mp(sh.pr) + ' per yd³.'; },
        shared: function (r) { return find(function () { var s = { D: r.pick([8, 9, 10, 11, 12, 14]), T: r.pick([4, 5, 6]), pr: r.pick([210, 215, 220, 225, 230, 235, 240, 245]) }; s.V = C.cylV(s.D / 2, s.T / 12); s.Vr = rd(s.V, 2); s.yd = s.Vr / 27; s.buy = roundUp(s.yd, 0.5); return s; },
          function (s) { var fr = (s.yd * 2) % 1; return fr > 0.08 && fr < 0.92 && roundUp(s.V / 27, 0.5) === s.buy && !(s.D === 12 && s.T === 4 && s.pr === 230) && !(s.pr === 215); }); },
        parts: [
          { id: '12a', level: 'PRG', outcome: 'M2', make: function (r, sh) { var rr = sh.D / 2, h = sh.T / 12;
            return num('(a) Find the volume of the pad in ft³, to the nearest hundredth. (Hint: it is a short cylinder.)', sh.V, { dp: 2, exact: sh.V, after: 'ft³',
              bad: C.cylBad(rr, h, { d: true }).concat([[C.cylV(rr, sh.T), 'u4l1-in-ft', 'The thickness is in inches. Change it to feet first: ' + t(sh.T + '\\div 12') + '.'], [C.cylV(rr, sh.T / 10), 'u4l1-in-ft', '12 inches make a foot: ' + t(sh.T + '\\div 12') + '.'], [C.cylV(sh.D, sh.T), 'u4k-diam', 'Use the radius (half of ' + sh.D + ' ft), and change the inches to feet.']]),
              sol: [t('r=' + sh.D + '\\div 2=' + N(rr)) + ' ft; ' + t(sh.T + '\\text{ in}=' + frT(sh.T)) + ' ft', t('V=\\pi\\times ' + N(rr) + '^2\\times ' + frT(sh.T) + eqR(sh.V, 2) + uT('ft³'))], hints: ['Radius = diameter ÷ 2. Thickness in feet = inches ÷ 12.', t('V=\\pi r^2h')], text: 'pad volume' }); } },
          { id: '12b', level: 'ADV', outcome: 'M2', make: function (r, sh) {
            var rows = orderRows(sh.yd, 0.5, sh.pr, 'yd³', { bad: [[sh.Vr, 'u4l1-no-27', 'That’s in cubic <b>feet</b>. Concrete is sold by the cubic yard: divide by 27.'], [roundUp(sh.Vr / 9, 0.5), 'u4k-cube-9', '1 yd³ = 27 ft³ (3 × 3 × 3), not 9.'], [roundUp(sh.Vr / 3, 0.5), 'u4k-cube-3', '1 yd³ = 27 ft³ (3 × 3 × 3), not 3.']], cbad: [[sh.Vr * sh.pr, 'u4l1-ft3-price', 'The price is per cubic <b>yard</b>. Change the volume to yd³ and round up first.']] });
            return fields('(b) How much concrete should be ordered, and what will it cost?', rows, [t(N(sh.Vr) + '\\div 27' + eqR(sh.yd, 3) + uT('yd³')) + '; round up to ' + N(sh.buy) + ' yd³', t(N(sh.buy) + '\\times ' + M(sh.pr) + '=' + M(sh.buy * sh.pr))],
              ['ft³ ÷ 27 = yd³.', 'Round <b>up</b> to the next half yard (1, 1.5, 2, …), then multiply by the price.'], 'pad order'); } }] },
      { num: '13', parts: [
        { id: '13', level: 'MAS', outcome: 'M2', make: function (r) {
          var s = find(function () { var s = { L: r.int(10, 16), W: r.int(6, 10), cm: r.pick([10, 15, 20, 25]), pr: r.pick([35, 36, 38, 39, 40, 42, 45]), what: r.pick([['A school playground', 'wood mulch', 'the school'], ['A dog park', 'wood chips', 'the city'], ['A daycare yard', 'rubber mulch', 'the daycare']]) }; s.m3 = q(s.L * s.W * s.cm / 100); s.yd = q(s.m3 * 1.31); s.buy = Math.ceil(s.yd - 1e-9); return s; },
            function (s) { var fr = s.yd % 1; return fr > 0.08 && fr < 0.92 && !(s.L === 15 && s.cm === 10) && !(s.pr === 48); });
          var rows = orderRows(s.yd, 1, s.pr, 'yd³', { bad: [[Math.ceil(s.m3 / 1.31 - 1e-9), 'u4l1-m3-yd3-way', 'A cubic metre is <b>bigger</b> than a cubic yard, so there are more cubic yards: multiply by 1.31.'], [Math.ceil(s.m3 - 1e-9), 'u4l1-m3-order', 'That’s in cubic <b>metres</b>. The supplier sells cubic yards: ' + t('\\times 1.31') + '.'], [Math.ceil(s.L * s.W * s.cm * 1.31 - 1e-9), 'u4l1-cm-m', 'Change the depth to metres first: ' + t(s.cm + '\\text{ cm}=' + N(s.cm / 100) + '\\text{ m}') + '.']],
            cbad: [[s.m3 * s.pr, 'u4l1-m3-order', 'Change m³ to yd³ (× 1.31) and round up before finding the cost.'], [Math.ceil(s.m3 - 1e-9) * s.pr, 'u4l1-m3-order', 'Change m³ to yd³ (× 1.31) and round up before finding the cost.']] });
          return fields(s.what[0] + ' is ' + s.L + ' m by ' + s.W + ' m. It needs ' + s.what[1] + ' ' + s.cm + ' cm deep. The supplier sells whole cubic yards at ' + Mp(s.pr) + ' per yd³. Use 1 m³ ≈ 1.31 yd³. How many cubic yards should ' + s.what[2] + ' order, and what will it cost?', rows,
            [t(s.cm + '\\text{ cm}=' + N(s.cm / 100) + '\\text{ m}') + '; ' + t('V=' + s.L + '\\times ' + s.W + '\\times ' + N(s.cm / 100) + '=' + N(s.m3) + uT('m³')), t(N(s.m3) + '\\times 1.31=' + N(s.yd) + uT('yd³')) + '; round up to ' + s.buy + ' yd³', t(s.buy + '\\times ' + M(s.pr) + '=' + M(s.buy * s.pr))],
            ['Change the depth to metres, then find the volume in m³.', 'm³ × 1.31 = yd³. Round up to a whole cubic yard.', 'Cost = cubic yards × price.'], 'mulch order');
        } }] },
      { num: '14', stem: 'Work backwards to find the missing measurement. Check each answer.', parts: [
        { id: '14a', level: 'ADV', outcome: 'M2', make: function (r) {
          var s = find(function () { var s = { l: r.pick([5, 6, 8, 10]), w: r.pick([2, 2.5, 3]), d: r.pick([1.25, 1.5, 1.75, 2, 2.25]) }; s.V = q(s.l * s.w * s.d); return s; }, function (s) { return Number.isInteger(s.V) && !(s.l === 6 && s.w === 2 && s.d === 1.5); });
          return fields('(a) A water trough for cattle is a rectangular prism ' + s.l + ' ft long and ' + N(s.w) + ' ft wide. It holds ' + s.V + ' ft³. How deep is it, in feet and in inches?', [
            { label: 'Depth:', name: 'Depth in feet', ans: s.d, after: 'ft', bad: [[s.V * s.l * s.w, 'u4k-wrong-way', 'Undo the multiplication: depth = volume ÷ (length × width).'], [s.V / (s.l + s.w), 'u4k-added', 'Divide by the area of the base: length × width = ' + N(s.l * s.w) + ' ft².'], [s.V / s.l, 'u4k-one-layer', 'Divide by length × width (the base), not just the length.'], [s.d * 12, 'u4l1-depth-ft', 'This box is for the depth in <b>feet</b>; the next box is for inches.']] },
            { label: 'Depth:', name: 'Depth in inches', ans: s.d * 12, after: 'in', bad: [[s.d * 10, 'u4l1-in-12', '1 ft = 12 in, so multiply the feet by 12.'], [s.V / (s.l * s.w) * 12 * 12, 'u4k-cube-144', 'Only the depth changes to inches: feet × 12.']] }],
            [t('h=' + s.V + '\\div (' + s.l + '\\times ' + N(s.w) + ')=' + s.V + '\\div ' + N(s.l * s.w) + '=' + N(s.d)) + ' ft ' + t('=' + N(s.d) + '\\times 12=' + N(s.d * 12)) + ' in', 'Check: ' + t(s.l + '\\times ' + N(s.w) + '\\times ' + N(s.d) + '=' + s.V + uT('ft³'))],
            ['Depth = volume ÷ (length × width).', 'Feet → inches: × 12.'], 'trough depth');
        } },
        { id: '14b', level: 'MAS', outcome: 'M2', make: function (r) {
          var s = find(function () { var s = { a: r.pick([5, 6, 7, 8]), b: r.pick([3, 4, 5]), d1: r.pick([6, 8, 9, 10]), c: pickR(r, 6, 10, 0.5), e: pickR(r, 4, 6, 0.5) }; s.V = q(s.a * s.b * s.d1 / 12); s.d2 = q(s.V / (s.c * s.e) * 12); return s; },
            function (s) { return (Number.isInteger(s.d2) || Number.isInteger(s.d2 * 2)) && s.d2 >= 3 && s.d2 < s.d1 && s.c * s.e > s.a * s.b && !(s.a === 6 && s.b === 4 && s.d1 === 9 && s.c === 8); },
            { a: 6, b: 5, d1: 8, c: 8, e: 5, V: 20, d2: 6 });
          var ft1 = q(s.d1 / 12), d2f = s.V / (s.c * s.e);
          return num('(b) An old sandbox is ' + s.a + ' ft by ' + s.b + ' ft, with sand ' + s.d1 + ' in deep. All the sand is moved to a new sandbox ' + N(s.c) + ' ft by ' + N(s.e) + ' ft. How deep is the sand now, in inches?', s.d2, { after: 'in',
            bad: [[d2f, 'u4l1-depth-ft', 'That’s the depth in <b>feet</b>. Change it to inches: × 12.'], [s.V, 'u4l1-vol-not-depth', 'That’s the volume of sand. Divide it by the base of the new sandbox (' + N(s.c) + ' × ' + N(s.e) + ').'], [s.V / (s.c * s.e) * 10, 'u4l1-in-12', '1 ft = 12 in.'], [s.V * s.c * s.e, 'u4k-wrong-way', 'Depth = volume ÷ (length × width).']],
            sol: [t(s.d1 + '\\text{ in}=' + raw(ft1, 4) + '\\text{ ft}') + '; sand: ' + t(s.a + '\\times ' + s.b + '\\times ' + raw(ft1, 4) + '=' + N(s.V) + uT('ft³')), 'New depth: ' + t(N(s.V) + '\\div (' + N(s.c) + '\\times ' + N(s.e) + ')=' + N(s.V) + '\\div ' + N(s.c * s.e) + eqR(d2f, 4)) + ' ft ' + t('=' + N(s.d2)) + ' in', 'Check: ' + t(N(s.c) + '\\times ' + N(s.e) + '\\times ' + raw(d2f, 4) + (near(d2f, rd(d2f, 4)) ? '=' : '\\approx ') + N(s.V) + uT('ft³'))],
            hints: ['First find the volume of the sand (change the depth to feet first).', 'The same volume goes in the new box: depth = volume ÷ (length × width).', 'Change the depth back to inches: × 12.'], text: 'sandbox depth' });
        } }] },
      { num: '15', parts: [
        { id: '15', level: 'BEG', outcome: 'M1', make: function (r) {
          var v = find(function () { return [r.int(3, 8), r.int(2, 6), r.int(2, 5)]; }, function (v) { var V = v[0] * v[1] * v[2], S = 2 * (v[0] * v[1] + v[0] * v[2] + v[1] * v[2]), A = v[0] + v[1] + v[2]; return v[0] > v[1] && v[1] > v[2] && S !== V && A !== V && !(v.join() === '4,3,2'); }), l = v[0], w = v[1], h = v[2], V = l * w * h, S = 2 * (l * w + l * h + w * h);
          return P.mc(r, 'The volume of a box ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high is', [{ html: (l + w + h) + ' cm³', why: 'That adds the lengths. Multiply them.', code: 'add' }, { html: V + ' cm²', why: 'Right number, but volume has a <b>cubed</b> unit (cm³).', code: 'sq' }, { html: S + ' cm³', why: 'That’s the surface area (the outside of the box).', code: 'surf' }, { html: V + ' cm³', right: true }],
            t(l + '\\times ' + w + '\\times ' + h + '=' + V + uT('cm³')), ['Volume = length × width × height, in a cubed unit.'], 'box mc', true);
        } }] },
      { num: '16', parts: [
        { id: '16', level: 'BEG', outcome: 'M1', make: function (r) {
          var v = find(function () { return [r.pick([6, 8, 10, 12]), r.int(4, 8)]; }, function (v) { return v[0] !== 2 * v[1] && !(v[0] === 10 && v[1] === 5); }), d = v[0], h = v[1], rr = d / 2;
          var vals = [[Math.PI * rr * rr * h, true, null, 'right'], [Math.PI * d * h, false, 'That’s ' + t('\\pi\\times d\\times h') + '. Square the radius instead.', 'pdh'], [Math.PI * d * d * h, false, 'That squares the <b>diameter</b>. Halve it first: ' + t('r=' + rr) + '.', 'diam'], [Math.PI * rr * h, false, 'That doesn’t square the radius.', 'nosq']];
          return P.mc(r, 'A cylinder has a diameter of ' + d + ' cm and a height of ' + h + ' cm. Its volume is closest to', vals.map(function (x) { return { html: N(Math.round(x[0])) + ' cm³', right: x[1], why: x[2], code: x[3] }; }),
            t('r=' + rr) + '; ' + t('\\pi\\times ' + rr + '^2\\times ' + h + eqR(vals[0][0], 0) + uT('cm³')), ['Halve the diameter, then ' + t('V=\\pi r^2h') + '.'], 'cyl mc');
        } }] },
      { num: '17', parts: [
        { id: '17', level: 'EMG', outcome: 'M2', make: function (r) {
          var v = find(function () { return [r.pick([2, 3, 4]), r.pick([2.5, 3, 4, 5])]; }, function (v) { return nS(rd(C.cylV(v[0] / 2, v[1]), 1)).length <= 4; }), d = v[0], h = v[1], V = C.cylV(d / 2, h);
          return num('<b>Numerical response.</b> A cylinder-shaped water tank is ' + d + ' ft across and ' + N(h) + ' ft tall. Its volume, to the nearest tenth of a cubic foot, is ____ ft³.', V, { dp: 1, exact: V, nr: true, bad: C.cylBad(d / 2, h, { d: true }),
            sol: C.cylSol(d / 2, h, 'ft', 1, { d: true }), hints: ['Radius = diameter ÷ 2.', t('V=\\pi r^2h') + '. Round to the nearest tenth.'], text: 'NR tank' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the volume of each rectangular prism.', parts: [
        { id: 'e1a', level: 'BEG', outcome: 'M1', make: function (r) { var v = find(function () { return [r.int(6, 12), r.int(3, 6), r.int(2, 5)]; }, function (v) { return v[0] > v[1]; }); return boxPart('(a) ' + v.join(' cm by ') + ' cm', v[0], v[1], v[2], 'cm', null, { text: 'E box cm' }); } },
        { id: 'e1b', level: 'BEG', outcome: 'M1', make: function (r) { var v = find(function () { return [pickR(r, 1.5, 3.5, 0.5), pickR(r, 0.8, 1.6, 0.2), pickR(r, 0.5, 1.2, 0.1)]; }, function (v) { return decs(v[0] * v[1] * v[2]) <= 3 && v[0] > v[1]; }); return boxPart('(b) ' + v.map(function (x) { return N(x); }).join(' m by ') + ' m', v[0], v[1], v[2], 'm', null, { text: 'E box m' }); } },
        { id: 'e1c', level: 'EMG', outcome: 'M2', make: function (r) { var v = [r.int(12, 18), r.int(8, 12), r.pick([4.5, 5.5, 6.5, 7.5])]; return boxPart('(c) ' + v[0] + ' in by ' + v[1] + ' in by ' + t(mixT(v[2])) + ' in', v[0], v[1], v[2], 'in', null, { pre: t(mixT(v[2]) + '=' + N(v[2])), text: 'E box in fraction' }); } }] },
      { num: '2', parts: [
        { id: 'e2', level: 'EMG', outcome: 'M1', make: function (r) { var s = find(function () { return { L: r.pick([20, 24, 25, 30]), b: r.pick([8, 10, 12, 14]), h: r.pick([5, 6, 7, 9]) }; }, function (s) { return !(s.b === 6 && s.h === 4); });
          return num('A triangular prism is ' + s.L + ' cm long. The triangle at each end has a base of ' + s.b + ' cm and a height of ' + s.h + ' cm. Find its volume.' + sol3('triprism', { b: s.b + ' cm', ht: s.h + ' cm', l: s.L + ' cm', width: 200 }), s.b * s.h / 2 * s.L, { after: 'cm³', cubic: true, bad: C.triBad(s.b, s.h, s.L), sol: C.triSol(s.b, s.h, s.L, 'cm'), hints: ['Area of base = ½ × b × h, then × length.'], text: 'E tri prism' }); } }] },
      { num: '3', stem: 'Find the volume of each cylinder. Round to the nearest tenth.', parts: [
        { id: 'e3a', level: 'BEG', outcome: 'M1', make: function (r) { var v = find(function () { return [r.int(2, 7), r.int(6, 14)]; }, function (v) { return v[0] !== v[1]; }); return cylPart('(a) radius ' + v[0] + ' cm, height ' + v[1] + ' cm', v[0], v[1], 'cm', 1, { text: 'E cyl r' }); } },
        { id: 'e3b', level: 'EMG', outcome: 'M1', make: function (r) { var d = r.pick([1.6, 1.8, 2, 2.2, 2.4, 2.6, 3]), h = r.pick([2, 2.5, 3, 3.5, 4]); return cylPart('(b) diameter ' + N(d) + ' m, height ' + N(h) + ' m', d / 2, h, 'm', 1, { d: true, text: 'E cyl d' }); } }] },
      { num: '4', stem: 'Convert each volume.', parts: [
        { id: 'e4a', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.ft3in3(r, [3.5]); p.prompt = '(a) ' + p.prompt; return p; } },
        { id: 'e4b', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.in3ft3(r, [3]); p.prompt = '(b) ' + p.prompt; return p; } },
        { id: 'e4c', level: 'BEG', outcome: 'M2', make: function (r) { var p = CONV.yd3ft3(r, [4]); p.prompt = '(c) ' + p.prompt; return p; } },
        { id: 'e4d', level: 'BEG', outcome: 'M1', make: function (r) { var p = CONV.m3cm3(r, [0.25]); p.prompt = '(d) ' + p.prompt; return p; } },
        { id: 'e4e', level: 'EMG', outcome: 'M1', make: function (r) { var p = CONV.cm3m3(r, [45000]); p.prompt = '(e) ' + p.prompt; return p; } }] },
      { num: '5', section: 'B. Applying', parts: [
        { id: 'e5', level: 'EMG', outcome: 'M2', make: function (r) {
          var v = find(function () { return [r.pick([12, 15, 18, 24]), r.pick([12, 15, 18]), r.pick([18, 24, 30])]; }, function (v) { return decs(v[0] * v[1] * v[2] / 1728) <= 3 && !(v.join() === '30,18,16'); }), V = v[0] * v[1] * v[2], ft = q(V / 1728);
          return fields('A large moving box is ' + v.join(' in by ') + ' in. Find its volume in cubic inches and in cubic feet. (Round to the nearest hundredth if needed.)', [
            { label: 'Volume:', name: 'Cubic inches', ans: V, after: 'in³', bad: C.boxBad(v[0], v[1], v[2]) },
            { label: 'Volume:', name: 'Cubic feet', ans: ft, dp: 2, exactOk: true, after: 'ft³', bad: [[V / 12, 'u4k-cube-12', C.CUBIC.ft3_in3.wrongF[0][2]], [V / 144, 'u4k-cube-144', C.CUBIC.ft3_in3.wrongF[1][2]]] }],
            [t(v.join('\\times ') + '=' + N(V) + uT('in³')), t(N(V) + '\\div 1728=' + N(ft) + uT('ft³')), '(Or in feet: ' + t(v.map(function (x) { return N(x / 12); }).join('\\times ') + '=' + N(ft)) + ' ft³.)'], ['Multiply the three lengths, then divide by 1728.'], 'E moving box');
        } }] },
      { num: '6', stem: function (sh) { return 'A storage unit is ' + sh.l + ' ft long, ' + sh.a + ' ft 6 in wide and ' + sh.h + ' ft high.'; },
        shared: function (r) { var s = { l: r.pick([10, 12, 15]), a: r.int(5, 9), h: r.pick([8, 9, 10]), fam: r.pick(['Nguyen', 'Okafor', 'Martin', 'Singh']) }; s.w = s.a + 0.5; s.V = q(s.l * s.w * s.h); s.ok = r.chance(0.6); s.need = s.ok ? Math.round(s.V * r.pick([0.7, 0.75, 0.8, 0.85]) / 10) * 10 : Math.round(s.V * r.pick([1.1, 1.15, 1.2]) / 10) * 10; return s; },
        parts: [
          { id: 'e6a', level: 'EMG', outcome: 'M2', make: function (r, sh) { return num('(a) Find its volume in cubic feet.', sh.V, { after: 'ft³', cubic: true, bad: C.boxBad(sh.l, sh.w, sh.h).concat([[q(sh.l * (sh.a + 0.6) * sh.h), 'u4l1-ft-in-6', sh.a + ' ft 6 in is ' + sh.a + '.5 ft (6 in is half a foot), not ' + sh.a + '.6 ft.'], [sh.l * sh.a * sh.h, 'u4l1-in-ft', 'Include the 6 in: it is half a foot, so the width is ' + N(sh.w) + ' ft.']]),
            sol: [sh.a + ' ft 6 in = ' + N(sh.w) + ' ft (6 in = ' + t('6\\div 12=0.5') + ' ft)', C.boxSol(sh.l, sh.w, sh.h, 'ft')], hints: ['6 in is half a foot.', 'V = l × w × h.'], text: 'E storage' }); } },
          { id: 'e6b', level: 'EMG', outcome: 'M2', make: function (r, sh) {
            return P.mc(r, '(b) The ' + sh.fam + ' family needs about ' + sh.need + ' ft³ of space for their things. Is the unit big enough?', [
              { html: 'Yes. ' + N(sh.V) + ' ft³ is more than ' + sh.need + ' ft³.', right: sh.ok, why: sh.ok ? null : 'Compare: ' + N(sh.V) + ' ft³ is <b>less</b> than ' + sh.need + ' ft³.', code: 'yes' },
              { html: 'No. ' + N(sh.V) + ' ft³ is less than ' + sh.need + ' ft³.', right: !sh.ok, why: !sh.ok ? null : 'Compare: ' + N(sh.V) + ' ft³ is <b>more</b> than ' + sh.need + ' ft³.', code: 'no' },
              { html: 'You can’t tell: the unit is measured in feet and the space in cubic feet.', why: 'The volume from (a) is in cubic feet too, so you can compare.', code: 'cant' }],
              N(sh.V) + ' ft³ is ' + (sh.ok ? 'more than ' + sh.need + ' ft³, with about ' + N(q(sh.V - sh.need)) + ' ft³ to spare. It is big enough.' : 'less than ' + sh.need + ' ft³. It is not big enough.'), ['Compare your volume from (a) with ' + sh.need + ' ft³.'], 'E storage enough', true); } }] },
      { num: '7', parts: [
        { id: 'e7', level: 'ADV', outcome: 'M2', make: function (r) {
          var s = find(function () { var s = { L: r.pick([24, 27, 30, 33, 36, 40, 42, 45, 48]), W: r.pick([3, 4, 5]), T: r.pick([4, 5, 6]), pr: r.pick([215, 220, 225, 230, 240]) }; s.V = q(s.L * s.W * s.T / 12); s.yd = s.V / 27; s.buy = roundUp(s.yd, 0.25); return s; }, function (s) { var fr = (s.yd * 4) % 1; return fr > 0.06 && fr < 0.94; });
          var rows = orderRows(s.yd, 0.25, s.pr, 'yd³', { bad: [[s.V, 'u4l1-no-27', 'That’s in cubic <b>feet</b>. Divide by 27 to get cubic yards.'], [roundUp(s.yd, 0.5), 'u4l1-whole-yd', 'Here concrete is sold in <b>quarter</b> cubic yards (1, 1.25, 1.5, 1.75, …). Round up to the next quarter.'], [roundUp(s.L * s.W * s.T / 27, 0.25), 'u4l1-in-ft', 'Change the thickness to feet first: ' + t(s.T + '\\div 12') + '.']], cbad: [[s.V * s.pr, 'u4l1-ft3-price', 'The price is per cubic yard.']] });
          return fields('A sidewalk is ' + s.L + ' ft long, ' + s.W + ' ft wide and ' + s.T + ' in thick. Concrete is sold in quarter cubic yards (1, 1.25, 1.5, 1.75, 2, …) at ' + Mp(s.pr) + ' per yd³. How much concrete should be ordered, and what will it cost?', rows,
            [t(s.T + '\\text{ in}=' + frT(s.T) + '\\text{ ft}') + '; ' + t('V=' + s.L + '\\times ' + s.W + '\\times ' + frT(s.T) + '=' + N(s.V) + uT('ft³')), t(N(s.V) + '\\div 27' + eqR(s.yd, 2) + uT('yd³')) + ', so round up to ' + N(s.buy) + ' yd³.', t(N(s.buy) + '\\times ' + M(s.pr) + '=' + M(s.buy * s.pr))],
            ['Thickness in feet = inches ÷ 12. Find the volume in ft³.', 'ft³ ÷ 27 = yd³. Round up to the next quarter yard.'], 'E sidewalk');
        } }] },
      { num: '8', stem: function (sh) { return 'A round steel grain bin is ' + sh.D + ' ft across. The wheat inside is ' + sh.h + ' ft deep.'; },
        shared: function (r) { return { D: r.pick([14, 16, 18, 20, 22, 24]), h: r.int(8, 16) }; },
        parts: [
          { id: 'e8a', level: 'EMG', outcome: 'M2', make: function (r, sh) { var R = sh.D / 2, est = 3 * R * R * sh.h;
            return num('(a) Estimate the volume of wheat. Use ' + t('\\pi\\approx 3') + '.', est, { after: 'ft³', cubic: true, bad: [[3 * sh.D * sh.D * sh.h, 'u4l1-est-diam', 'Use the radius: ' + t(sh.D + '\\div 2=' + R) + '.'], [3 * R * 2 * sh.h, 'u4k-r-times-2', t('r^2=r\\times r') + '.'], [C.cylV(R, sh.h), 'u4l1-est-exact', 'For the estimate, use ' + t('\\pi\\approx 3') + '.', 'form']],
              sol: [t('r=' + R) + ' ft', t('3\\times ' + R + '^2\\times ' + sh.h + '=3\\times ' + R * R + '\\times ' + sh.h + '=' + N(est) + uT('ft³'))], hints: ['Estimate = 3 × r² × h.'], text: 'E bin estimate' }); } },
          { id: 'e8b', level: 'EMG', outcome: 'M2', make: function (r, sh) { return cylPart('(b) Calculate the volume of wheat to the nearest cubic foot.', sh.D / 2, sh.h, 'ft', 0, { d: true, text: 'E bin volume' }); } }] },
      { num: '9', parts: [
        { id: 'e9', level: 'PRG', outcome: 'M2', make: function (r) {
          var s = find(function () { var s = { bin: r.pick([2, 2.5, 3, 3.5, 4, 4.5]), b: r.pick([[6, 4, 12], [6, 6, 8], [4, 4, 9], [6, 6, 6], [8, 6, 6], [6, 4, 8], [5, 4, 10]]), what: r.pick(['birdseed', 'rice', 'dog treats', 'oats']) }; s.Vi = s.bin * 1728; s.Vb = s.b[0] * s.b[1] * s.b[2]; s.n = Math.floor(s.Vi / s.Vb + 1e-9); return s; }, function (s) { return s.n >= 8 && s.n <= 40; });
          var ex = s.Vi / s.Vb;
          return num('A store has a bulk bin that holds ' + N(s.bin) + ' ft³ of ' + s.what + '. It is packed into small boxes ' + s.b.join(' in by ') + ' in. How many boxes can be filled from the full bin?', s.n, { after: 'boxes',
            bad: [[s.bin / s.Vb, 'u4l1-in-ft', 'Change the bin to cubic inches first: ' + t(N(s.bin) + '\\times 1728') + '.'], [s.bin * 12 / s.Vb, 'u4k-cube-12', '1 ft³ = 1728 in³, not 12.'], [Math.ceil(ex - 1e-9), 'u4l1-floor-boxes', 'The last box can’t be filled all the way. Count only the <b>full</b> boxes (round down).'], [rd(ex, 2), 'u4l1-floor-boxes', 'Give a whole number of full boxes.']],
            sol: ['Bin: ' + t(N(s.bin) + '\\times 1728=' + N(s.Vi) + uT('in³')) + '; box: ' + t(s.b.join('\\times ') + '=' + s.Vb + uT('in³')), t(N(s.Vi) + '\\div ' + s.Vb + eqR(ex, 2)) + (Number.isInteger(q(ex)) ? '' : ', so ' + s.n + ' full boxes') + '. The bin fills ' + s.n + ' boxes.'], hints: ['Change the bin to cubic inches (× 1728).', 'Divide by the volume of one box.'], text: 'E bin boxes' });
        } }] },
      { num: '10', parts: [
        { id: 'e10', level: 'PRG', outcome: 'M1', make: function (r) {
          var s = find(function () { var c = { r: r.int(2, 4), h: r.int(3, 6) }, p = { L: r.int(6, 10), b: r.int(4, 7), h: r.int(4, 6) }, e = r.int(4, 6), x = [r.int(8, 12), r.int(3, 5), r.int(2, 4)];
            return { c: c, p: p, e: e, x: x, V: [C.cylV(c.r, c.h), p.b * p.h / 2 * p.L, e * e * e, x[0] * x[1] * x[2]] }; },
            function (s) { var srt = s.V.slice().sort(function (a, b) { return b - a; }); return srt[0] - srt[1] >= 2 && srt[0] / srt[3] < 1.6; });
          var big = s.V.indexOf(Math.max.apply(null, s.V));
          var opts = ['a cylinder with radius ' + s.c.r + ' cm and height ' + s.c.h + ' cm', 'a triangular prism ' + s.p.L + ' cm long; its triangle has base ' + s.p.b + ' cm and height ' + s.p.h + ' cm', 'a cube with ' + s.e + ' cm edges', 'a rectangular prism ' + s.x.join(' cm by ') + ' cm'];
          var nm = ['cylinder', 'prism', 'cube', 'box'];
          return P.mc(r, 'Which object has the greatest volume?', opts.map(function (o, i) { return { html: o, right: i === big, why: i === big ? null : 'Find all four volumes: this one is ' + N(rd(s.V[i], 1)) + ' cm³. Is another one bigger?', code: nm[i] }; }),
            'Cylinder: ' + t('\\pi\\times ' + s.c.r + '^2\\times ' + s.c.h + '\\approx ' + N(rd(s.V[0], 1))) + '; prism: ' + t('\\tfrac{1}{2}\\times ' + s.p.b + '\\times ' + s.p.h + '\\times ' + s.p.L + '=' + N(s.V[1])) + '; cube: ' + t(s.e + '^3=' + s.V[2]) + '; box: ' + t(s.x.join('\\times ') + '=' + s.V[3]) + ' (all in cm³).<br>The <b>' + nm[big] + '</b> has the greatest volume.', ['Find the volume of each one.'], 'E greatest', true);
        } }] },
      { num: '11', parts: [
        { id: 'e11', level: 'EMG', outcome: 'M1', make: function (r) {
          var v = find(function () { return [r.pick([0.4, 0.5, 0.6, 0.7, 0.8]), r.pick([0.8, 0.9, 1, 1.1, 1.2])]; }, function (v) { var x = rd(C.cylV(v[0] / 2, v[1]), 2); return nS(x).length <= 4 && x >= 0.1; }), V = C.cylV(v[0] / 2, v[1]);
          return num('<b>Numerical response.</b> A rain barrel is a cylinder ' + N(v[0]) + ' m across and ' + N(v[1]) + ' m tall. Its volume, to the nearest hundredth of a cubic metre, is ____ m³.', V, { dp: 2, exact: V, nr: true, bad: C.cylBad(v[0] / 2, v[1], { d: true }), sol: C.cylSol(v[0] / 2, v[1], 'm', 2, { d: true }), hints: ['Radius = diameter ÷ 2.', t('V=\\pi r^2h') + ', to the nearest hundredth.'], text: 'E NR barrel' });
        } }] },
      { num: '12', section: 'C. Stretch', parts: [
        { id: 'e12', level: 'ADV', outcome: 'M2', make: function (r) {
          var s = find(function () { return { Do: r.pick([4, 5, 6]), w: r.pick([0.5, 1]), h: r.pick([1, 1.5, 2]) }; }, function (s) { return true; }), Di = s.Do - s.w, R = s.Do / 2, ri = Di / 2, Vo = C.cylV(R, s.h), Vi = C.cylV(ri, s.h), V = Vo - Vi;
          return num('A concrete fire-pit ring is a cylinder ' + s.Do + ' ft across with a cylinder ' + N(Di) + ' ft across cut out of the middle. It is ' + N(s.h) + ' ft high. How much concrete is in the ring, to the nearest tenth of a cubic foot?', V, { dp: 1, exact: V, after: 'ft³',
            bad: [[Vo, 'u4l1-outer-only', 'That’s the whole cylinder. Subtract the hole in the middle.'], [C.cylV(R - ri, s.h), 'u4l1-outer-only', 'Find the two volumes first, then subtract. (Subtracting the radii first doesn’t work, because the radius is squared.)'], [Math.PI * 4 * (R * R - ri * ri) * s.h, 'u4k-diam', 'Use the radii (half of each diameter).'], [Vo + Vi, 'u4l1-diff-sum', 'Subtract the hole, don’t add it.']].concat(C.cylBad(R, s.h, { d: true }).filter(function (b) { return b[3] !== 'form'; })),
            sol: ['Outside: ' + t('\\pi\\times ' + N(R) + '^2\\times ' + N(s.h) + '=' + raw(Vo, 3)) + ' ft³; hole: ' + t('\\pi\\times ' + N(ri) + '^2\\times ' + N(s.h) + '=' + raw(Vi, 3)) + ' ft³', 'Ring: ' + t(raw(Vo, 3) + '-' + raw(Vi, 3) + eqR(V, 1) + uT('ft³'))], hints: ['Volume of the ring = volume of the big cylinder − volume of the hole.', 'Use the radius of each one (half the diameter).'], text: 'E ring' });
        } }] },
      { num: '13', parts: [
        { id: 'e13', level: 'ADV', outcome: 'M1', make: function (r) {
          var s = find(function () { return { a: r.pick([50, 60, 70, 80]), b: r.pick([30, 40, 50]), h: r.pick([25, 30, 35, 40]), L: r.pick([1.5, 2, 2.5, 3]) }; }, function (s) { return s.b < s.a && !(s.a === 60 && s.b === 40 && s.h === 30 && s.L === 2); });
          var A = (s.a + s.b) / 2 * s.h, cm = s.L * 100, V = A * cm, m3 = V / 1e6;
          return fields('A water trough is a prism ' + N(s.L) + ' m long. Its end is a trapezoid ' + s.a + ' cm across the top, ' + s.b + ' cm across the bottom and ' + s.h + ' cm deep. Find its volume in cm³ and in m³. (Trapezoid: ' + t('A=\\tfrac{1}{2}(a+b)h') + '.)', [
            { label: 'Volume:', name: 'Cubic centimetres', ans: V, after: 'cm³', bad: [[A * s.L, 'u4l1-cm-m', 'Change the length to centimetres first: ' + t(N(s.L) + '\\text{ m}=' + cm + '\\text{ cm}') + '.'], [(s.a + s.b) * s.h * cm, 'u4k-no-half', 'Don’t forget the ' + t('\\tfrac{1}{2}') + ' in the trapezoid’s area.'], [A, 'u4k-area-only', 'That’s the area of the end. Multiply by the length (in cm).']] },
            { label: 'Volume:', name: 'Cubic metres', ans: m3, after: 'm³', bad: [[V / 100, 'u4k-cube-100', C.CUBIC.m3_cm3.wrongF[0][2]], [V / 10000, 'u4k-cube-10000', C.CUBIC.m3_cm3.wrongF[1][2]], [V / 1000, 'u4k-cube-1000', C.CUBIC.m3_cm3.wrongF[2][2]]] }],
            [t('\\text{Area of base}=\\tfrac{1}{2}(' + s.a + '+' + s.b + ')\\times ' + s.h + '=' + N(A) + uT('cm²')) + '; ' + t(N(s.L) + '\\text{ m}=' + cm + '\\text{ cm}'), t('V=' + N(A) + '\\times ' + cm + '=' + N(V) + uT('cm³')) + ' ' + t('=' + N(V) + '\\div 1\\,000\\,000=' + N(m3) + uT('m³'))], ['Area of the trapezoid end × length (all in cm).', 'cm³ ÷ 1 000 000 = m³.'], 'E trapezoid');
        } }] },
      { num: '14', parts: [
        { id: 'e14', level: 'MAS', outcome: 'M1', make: function (r) {
          var s = find(function () { return { r: r.pick([3, 3.5, 4, 4.5, 5]), V: r.pick([350, 400, 450, 500, 600, 750]) }; }, function (s) { var h = s.V / (Math.PI * s.r * s.r); return h > 4 && h < 20 && !(s.r === 4 && s.V === 500); }), B = Math.PI * s.r * s.r, h = s.V / B;
          return num('A food company wants a can with a radius of ' + N(s.r) + ' cm that holds ' + s.V + ' cm³. How tall must the can be, to the nearest tenth of a centimetre?', h, { dp: 1, exact: h, after: 'cm',
            bad: [[s.V / (Math.PI * s.r), 'u4k-no-square', 'The area of the base is ' + t('\\pi r^2') + ': square the radius.'], [s.V / (s.r * s.r), 'u4k-no-pi', 'The area of the base is ' + t('\\pi\\times r^2') + '.'], [s.V / (Math.PI * 2 * s.r), 'u4k-r-times-2', t('r^2=r\\times r') + ', not ' + t('r\\times 2') + '.'], [s.V / (Math.PI * 4 * s.r * s.r), 'u4k-diam', 'The radius is ' + N(s.r) + ' cm; use it as it is.'], [s.V * B, 'u4k-wrong-way', 'Height = volume ÷ area of the base.'], [B, 'u4k-area-only', 'That’s the area of the base. Height = volume ÷ area of base.']],
            sol: [t('\\text{Area of base}=\\pi\\times ' + N(s.r) + '^2=' + raw(B, 2) + uT('cm²')), t('h=' + s.V + '\\div ' + raw(B, 2) + eqR(h, 1) + uT('cm')), 'Check: ' + t('\\pi\\times ' + N(s.r) + '^2\\times ' + nS(rd(h, 3)) + '\\approx ' + s.V + uT('cm³'))], hints: ['Find the area of the base: ' + t('\\pi r^2') + '.', 'Work backwards: height = volume ÷ area of base.'], text: 'E can height' });
        } }] },
      { num: '15', parts: [
        { id: 'e15', level: 'MAS', outcome: 'M2', make: function (r) {
          var s = find(function () { return { W: r.int(14, 22), D: r.int(8, 14), H: r.int(12, 20), f: r.pick([1, 1.5, 2, 3]), what: r.pick(['guitar amp', 'speaker', 'microwave', 'printer']) }; }, function (s) { var V = (s.W + 2 * s.f) * (s.D + 2 * s.f) * (s.H + 2 * s.f) / 1728; return Math.abs(rd(V, 1) - V) > 0.004 && !(s.W === 18 && s.D === 10 && s.H === 16 && s.f === 2); });
          var o = [s.W + 2 * s.f, s.D + 2 * s.f, s.H + 2 * s.f], Vi = o[0] * o[1] * o[2], ft = Vi / 1728, once = [s.W + s.f, s.D + s.f, s.H + s.f];
          var fb = function (i) { return [[once[i], 'u4l1-foam-once', 'The foam is on <b>both</b> sides: add ' + N(s.f) + ' + ' + N(s.f) + ' = ' + N(2 * s.f) + ' in.']]; };
          return fields('A ' + s.what + ' is ' + s.W + ' in wide, ' + s.D + ' in deep and ' + s.H + ' in high. It is shipped in a box with ' + N(s.f) + ' in of foam on every side (front, back, left, right, top and bottom). Find the outside size of the box and its volume in cubic feet, to the nearest tenth.', [
            { label: 'Width:', name: 'Width', ans: o[0], after: 'in', bad: fb(0) }, { label: 'Depth:', name: 'Depth', ans: o[1], after: 'in', bad: fb(1) }, { label: 'Height:', name: 'Height', ans: o[2], after: 'in', bad: fb(2) },
            { label: 'Volume:', name: 'Volume', ans: ft, dp: 1, exact: ft, after: 'ft³', bad: [[once[0] * once[1] * once[2] / 1728, 'u4l1-foam-once', 'Each length grows by the foam on both sides.'], [s.W * s.D * s.H / 1728, 'u4l1-foam-once', 'Use the <b>outside</b> size of the box (with the foam).'], [Vi / 12, 'u4k-cube-12', C.CUBIC.ft3_in3.wrongF[0][2]], [Vi / 144, 'u4k-cube-144', C.CUBIC.ft3_in3.wrongF[1][2]]] }],
            ['Each length grows by ' + t(N(s.f) + '+' + N(s.f) + '=' + N(2 * s.f)) + ' in: ' + o.join(' in by ') + ' in', t('V=' + o.join('\\times ') + '=' + N(Vi) + uT('in³')) + '; ' + t(N(Vi) + '\\div 1728' + eqR(ft, 1) + uT('ft³'))], ['Foam on both sides: each length grows by 2 × ' + N(s.f) + ' in.', 'Volume in in³, then ÷ 1728.'], 'E foam box');
        } }] }
    ]
  });
})(window);
