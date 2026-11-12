/* Math 10-3 · Unit 7 Test (G2, G4, A1) — Right Triangles and Trigonometry: squares and square roots (estimating a root
 * between two whole numbers), the Pythagorean theorem (the hypotenuse, a missing leg, the right-triangle test, squaring a
 * corner with a diagonal, two-step and 3-D problems), naming opp / adj / hyp from an angle θ, the tangent, sine and cosine
 * ratios (as decimals, to find a side with the unknown on top or on the bottom), angles from inverse ratios and the other
 * acute angle, angles of elevation and depression (with the eye or instrument height), solving a right triangle, and two
 * right triangles in one problem. Built the way the Unit 5 test was built (Beginning / Progressing / Mastery boxes, typed
 * answers, keys from the generated numbers, `bad` answers with u7t- codes, worked solutions and hints), with new items in
 * the style of the booklet's review lesson (u7_l10.tex) and Practice Test 2 (u7_ep10.tex). Calculator allowed, in DEG mode.
 * Conventions as in the booklet: the right angle is at C (a = BC is opposite ∠A, b = AC is opposite ∠B, c = AB is the
 * hypotenuse); opp, adj and hyp are named from the angle θ in use; lengths to the nearest tenth and angles to the nearest
 * degree unless a question says otherwise; keep the full calculator value until the last step.
 * Outcomes per part: G2 for the Pythagorean theorem (and the square roots it needs); G4 for the trig ratios, elevation and
 * depression, and solving triangles; A1 for the parts where the unknown is on the bottom of the ratio (x = side ÷ sin θ, …)
 * or a formula is rearranged (h = √(d² − w²)).
 * 26 questions / 27 parts: Beginning 10 parts, Progressing 11, Mastery 6 — about 78 minutes (short_report.js:
 * 1.5 / 3 / 5 min a part). G2 3 / 3 / 2, G4 5 / 4 / 2, A1 2 / 4 / 2. The short version (def.short) is about half of that
 * and keeps every box of all three outcomes.
 *
 *   Beginning   — one-step skills: G2 √n between two whole numbers and to the nearest tenth; the hypotenuse from two legs;
 *                 a missing leg (drawn). G4 label opp, adj and hyp (type each length); sin θ, cos θ or tan θ as a decimal
 *                 (4 places); a side with the unknown on top (x = side × ratio); an angle from two sides and the other
 *                 acute angle; which tool (sin, cos, tan or Pythagoras: multiple choice). A1 a side with the unknown on the
 *                 bottom (x = side ÷ ratio); which equation gives x (multiple choice).
 *   Progressing — the typical assignment question: G2 the right-triangle test (the squares and the verdict); a ladder,
 *                 field, screen, guy wire or ramp; squaring a corner (the diagonal, and whether the corner is less than,
 *                 exactly or more than 90°). G4 a height from an angle of elevation plus the eye height; a side in a
 *                 story (ladder, guy wire, auger, ski run, kite); an angle in a story (ramp, roof, ladder, zipline, string;
 *                 some to the nearest tenth of a degree); solve a triangle from an angle and the hypotenuse. A1 a ground
 *                 distance from an angle of depression (÷ tan); a hypotenuse in a story (÷ sin or ÷ cos); a screen:
 *                 (a) the rearranged formula (multiple choice), (b) the height or width from it.
 *   Mastery     — skills combined: G2 a pole held by two ropes (the height, then the second stake, full value kept);
 *                 a box (car trunk): the floor diagonal and the longest diagonal, and whether the stick fits. G4 an
 *                 antenna (flagpole, sign) from two angles of elevation; solve a triangle from its two legs (no picture:
 *                 sketch it). A1 two angles of depression from a roof (or two guy wires on opposite sides): the distance
 *                 between; a zipline between two platforms (or a plane coming in to land, in km).
 * Conversions to online: "show your work / explain" → the numbers asked for typed in boxes; "is it a right triangle?" →
 * the two numbers compared and yes / no (a word box); "is the corner square, too big or too small?" → the diagonal and
 * less / exactly / more (a word box); "will it fit?" → yes / no boxes beside the diagonals; "rearrange the formula" →
 * multiple choice of formulas (Progressing only); "sketch and solve" → the solution shows the sketch. Multiple choice
 * only in the Beginning and Progressing boxes.
 * Partial credit: a recognized mistake that is one slip keeps 2/3 ('s'), a bigger but reasonable one keeps 1/3 ('b'), see
 * HW.addPartial below; in a set of 3+ boxes, one box wrong is a small mistake. The trig and Pythagoras checks are
 * HW.geo.lenChk and HW.geo.angleRatioChk (RAD mode, × vs ÷, the wrong ratio, no inverse, no square root, adding the
 * squares for a leg, …), their codes renamed to u7t- ones here so the partial credit is decided in this file. Rounding the
 * trig ratio too early gets a nudge (no try used); rounding a length too early in a two-step problem is a small mistake.
 *
 * Also exports HW.u7assess, the assessment kit used by the Unit 7 exit slips (js/exits/u7.js loads after this file).
 * The test uses only the shared geometry kit HW.geo (js/geokit.js), no Unit 7 lesson kit, so tools that load only the test
 * files (tests/short_report.js) still work. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.rightTriSVG || !G.lenChk) throw new Error('js/lessons/u7test.js needs HW.geo from js/geokit.js: load it first');
  var A = HW.u7assess = {};
  var RAD = Math.PI / 180;

  /* ================= numbers and words ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dg(x) { return N(x) + '^\\circ'; }                 // an angle, inside t()
  function D(x) { return t(dg(x)); }                           // an angle in TeX
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function rawN(x, k) { var s = +x.toFixed(k || 3); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  /* "= 9.375… ≈ 9.4" (or "= 9.4" when exact) */
  function toN(x, dp) { return near(x, rd(x, dp), 1e-9) ? '=' + N(rd(x, dp)) : '=' + rawN(x, 3) + '\\approx ' + fx(x, dp); }
  function find(gen, test, fb) { for (var i = 0; i < 2000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7 assessment: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  /* far enough from a rounding boundary that a slightly different (but right) method can't land on the other side */
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function uT(u) { if (!u) return ''; if (u === '°') return '^\\circ'; var m = /^(.*?)([²³])$/.exec(u); return m ? '\\text{ ' + m[1] + '}^{' + (m[2] === '²' ? 2 : 3) + '}' : '\\text{ ' + u + '}'; }
  function L(x, u) { return t(N(x) + uT(u)); }                // a length in TeX
  function lab(x, u) { return String(q(x)) + (u ? ' ' + u : ''); }   // a length on a figure (plain text)
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  Object.assign(A, { rd: rd, q: q, near: near, nS: nS, N: N, dg: dg, D: D, fx: fx, rawN: rawN, toN: toN, find: find, br: br, cap: cap, pickR: pickR, safe: safe, uT: uT, L: L, lab: lab, person: person });

  /* ================= trig in degrees ================= */
  var TRG = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var TRR = { sin: Math.sin, cos: Math.cos, tan: Math.tan };          // what a calculator in RAD mode gives
  var INV = { sin: function (v) { return Math.asin(v) / RAD; }, cos: function (v) { return Math.acos(v) / RAD; }, tan: function (v) { return Math.atan(v) / RAD; } };
  var MN = { sin: 'SOH', cos: 'CAH', tan: 'TOA' }, SIDES = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] };
  var ROLE_WORD = { opp: 'opp', adj: 'adj', hyp: 'hyp' }, ROLE_LONG = { opp: 'opposite side', adj: 'adjacent side', hyp: 'hypotenuse' };
  function fnT(fn, deg) { return '\\' + fn + ' ' + dg(deg); }
  function fracT(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }
  function fnOf(r1, r2) { var s = [r1, r2].sort().join(','); return s === 'hyp,opp' ? 'sin' : s === 'adj,hyp' ? 'cos' : 'tan'; }
  /* the three sides of a right triangle with acute angle θ (deg), from one side { role: len } */
  function sidesFrom(deg, role, len) {
    var s = TRG.sin(deg), c = TRG.cos(deg), tn = TRG.tan(deg);
    if (role === 'hyp') return { opp: len * s, adj: len * c, hyp: len };
    if (role === 'adj') return { opp: len * tn, adj: len, hyp: len / c };
    return { opp: len, adj: len / tn, hyp: len / s };
  }
  Object.assign(A, { TRG: TRG, TRR: TRR, INV: INV, MN: MN, SIDES: SIDES, fnT: fnT, fracT: fracT, fnOf: fnOf, sidesFrom: sidesFrom, ROLE_LONG: ROLE_LONG });

  /* ================= reading and checking a number ================= */
  /* a typed number: "57", "57°", "x = 57", "12.5 m" are all read as the number */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1);
    s = s.replace(/\\approx|≈/g, ' ').replace(/\\angle|∠/g, ' ');
    s = s.replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, ' °').replace(/\\[,;: !]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/°²³][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u7t-comma', 'Use a decimal point (not a comma), like 37.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  /* "8/17" or \frac{8}{17} typed where a decimal was asked → its value, else null */
  function fracVal(resp) {
    var s = String(resp == null ? '' : resp).replace(/\s/g, ''), m = /^\\d?frac\{(-?[\d.]+)\}\{([\d.]+)\}$/.exec(s) || /^(-?[\d.]+)\/([\d.]+)$/.exec(s);
    return m && +m[2] ? +m[1] / +m[2] : null;
  }
  /* an answer rounded to dp places (default 0). o: { dp, exact, alts (other right values), tol, diag [{v, code, hint}] (wrong),
   * nudge [{v, code, hint}] (a format nudge, no try used), word (the rounding place in words), noPlaces, fracOk (a
   * fraction of the right value gets "now as a decimal"), miss } */
  function amtChk(ans, o) {
    o = o || {};
    var dp = o.dp == null ? 0 : o.dp, step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (dp === 0 ? 'a whole number' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc0 = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var isAcc = function (x) { return isAcc0(x) || (o.tol && Math.abs(x - ans) <= o.tol + 1e-9); };
    var keep = function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); };
    var dgs = (o.diag || []).filter(keep), ng = (o.nudge || []).filter(keep);
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      if (o.fracOk) { var fv = fracVal(resp); if (fv != null && near(fv, exact, 1e-9)) return form('u7t-as-decimal', 'Right fraction! Now divide and write it as a decimal to ' + word + '.'); }
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc0(v) || (d <= dp && isAcc(v)) || (o.tol && Math.abs(v - ans) <= o.tol + 1e-9)) return ok();
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      for (var j = 0; j < ng.length; j++) if (near(v, ng[j].v, tol) || near(v, rd(ng[j].v, dp), tol)) return form(ng[j].code, ng[j].hint);
      for (var i = 0; i < dgs.length; i++) {
        var m = dgs[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
      }
      if (!o.noPlaces && dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u7t-places', 'Round to ' + word + '.');
      if (dp >= 1 && d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u7t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  function keyOf(ans, o) { o = o || {}; return nS(rd(ans, o.dp == null ? 0 : o.dp)); }
  function badOf(o, ans) {
    var dp = o.dp == null ? 0 : o.dp, acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    return (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }) && !(o.tol && Math.abs(rd(m.v, dp) - ans) <= o.tol + 1e-9); })
      .map(function (m) { return keyOf(m.v, o); });
  }

  /* ================= words: a choice typed in a box ================= */
  var STOP = { the: 1, it: 1, is: 1, a: 1, an: 1, angle: 1, are: 1, they: 1, i: 1, should: 1, would: 1, you: 1, its: 1, to: 1, be: 1, will: 1, than: 1, use: 1, roof: 1, corner: 1 };
  function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/[.,'’!:;()?]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
  function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
  function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
  /* -> 'right' | 'wrong' | 'both' | 'none' | 'empty' */
  function whichOf(resp, right, wrongs) {
    var ws = words(resp); if (!ws.length) return 'empty';
    var a = hit(ws, right), b = hit(ws, wrongs);
    return a && b ? 'both' : a ? 'right' : b ? 'wrong' : 'none';
  }
  /* a word box. o: { right: [tokens], wrongs: [tokens], choices (text for the nudge), why (hint when wrong), code (default 'value') }
   * Anything that isn't one of the choices gets a nudge with code 'word' (no credit if it is left: TestCore.FORM_NO_CREDIT). */
  function wordChk(o) {
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var w = whichOf(resp, o.right, o.wrongs);
      if (w === 'empty') return form('empty', 'Type your answer first.');
      if (w === 'right') return ok();
      if (w === 'wrong') return wrong(o.code || 'value', typeof o.why === 'function' ? o.why(resp) : o.why || null);
      return form('word', 'Type just one of: ' + o.choices + '.');
    };
  }
  var YES = ['yes', 'y', 'yep', 'yeah'], NO = ['no', 'n', 'nope', 'not'];
  /* a yes / no box */
  function ynFld(label, yes, o) {
    o = o || {};
    return { label: label, name: o.name || 'Yes or no', mode: 'text', ph: 'yes or no', chk: wordChk({ right: yes ? YES : NO, wrongs: yes ? NO : YES, choices: 'yes or no', why: o.why, code: o.code }), key: yes ? 'yes' : 'no', show: '<b>' + (yes ? 'yes' : 'no') + '</b>', bad: [yes ? 'no' : 'yes'] };
  }

  /* ================= part builders ================= */
  /* one number. o as amtChk, plus after (unit after the box), unit, sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {};
    var key = keyOf(ans, o), after = o.after, unit = o.unit !== undefined ? o.unit : after;
    var p = { prompt: prompt, input: { type: 'number', after: after }, check: amtChk(ans, o), key: key, answer: t(HW.fmt(key) + uT(unit)), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badOf(o, ans); p.good = [];
    if (after === '°') p.good.push(key + '°');
    return p;
  }
  /* a number box in a set of boxes */
  function fld(label, ans, o) {
    o = o || {}; var key = keyOf(ans, o);
    return { label: label, name: o.name, after: o.after, chk: amtChk(ans, o), key: key, show: t(HW.fmt(key) + uT(o.after)), bad: badOf(o, ans) };
  }
  /* a word box in a set of boxes. o: wordChk options + key (shown answer), ph, name, bad (wrong words) */
  function wfld(label, o) { return { label: label, name: o.name, mode: 'text', ph: o.ph, chk: wordChk(o), key: o.key, show: '<b>' + o.key + '</b>', bad: o.bad || [] }; }
  /* several boxes. Grading: all right → correct; one box wrong in a set of 3 or more with no recognized mistake →
   * 'u7t-one-box' (small), of 2 → 'u7t-half-box' (bigger); one recognized mistake → its own code; several wrong boxes
   * with the same recognized mistake → that code; otherwise 'u7t-many-box'. */
  function multiChk(checks, labels) {
    return function (resp) {
      resp = resp || [];
      var res = checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      var lb = function (i) { return labels.length > 1 ? '<b>' + labels[i] + ':</b> ' : ''; };
      var wi = [], fi = [];
      res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); });
      if (!wi.length && !fi.length) return ok();
      if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lb(fi[0]) + (f0.hint || 'Check this one again.')); }
      var w0 = res[wi[0]], hint = lb(wi[0]) + (w0.hint || 'Check this one again.');
      if (wi.length === 1) {
        if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
        if (res.length === 1) return wrong('value', w0.hint || null);
        return wrong(res.length >= 3 ? 'u7t-one-box' : 'u7t-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
      return wrong('u7t-many-box', hint);
    };
  }
  function fieldsPart(prompt, specs, sol, hints, text) {
    var labels = specs.map(function (s) { return String(s.name || s.label).replace(/:$/, '').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s) { return { label: s.label, name: s.name || String(s.label).replace(/:$/, '').replace(/<[^>]+>|\\\(|\\\)/g, ''), after: s.after, mode: s.mode, placeholder: s.ph, wide: s.mode === 'text' }; }) },
      check: multiChk(specs.map(function (s) { return s.chk; }), labels), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return s.label + ' ' + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    var b0 = (specs[0].bad || []).filter(function (x) { return x !== String(specs[0].key); })[0];
    p.bad = [specs.map(function (s, i) { return i === 0 ? (b0 || (s.mode === 'text' ? 'zzz' : '99999')) : String(s.key); })];
    return p;
  }
  Object.assign(A, { readNum: readNum, fracVal: fracVal, amtChk: amtChk, keyOf: keyOf, badOf: badOf, whichOf: whichOf, wordChk: wordChk, ynFld: ynFld, num: num, fld: fld, wfld: wfld,
    multiChk: multiChk, fieldsPart: fieldsPart, YES: YES, NO: NO });

  /* ================= lengths and angles: HW.geo checkers with this unit's codes ================= */
  var GEO_CODE = { 'trig-rad': 'u7t-rad', 'trig-mul-div': 'u7t-mul-div', 'trig-upside': 'u7t-upside', 'trig-wrong-ratio': 'u7t-ratio', 'trig-no-inverse': 'u7t-no-inv', 'trig-complement': 'u7t-other-angle',
    'pyth-no-root': 'u7t-no-root', 'pyth-subtract': 'u7t-pyth-sub', 'pyth-add-sides': 'u7t-add-sides', 'pyth-double': 'u7t-double', 'pyth-hyp-leg': 'u7t-hyp-leg', 'pyth-sub-sides': 'u7t-sub-sides',
    'pyth-too-long': 'u7t-leg-long', truncate: 'u7t-chop', sign: 'value', diag: 'value', alt: 'value' };
  function geoWrap(c) {
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first.');
      if (/^(?:[a-zA-Zθ∠\\ ]{0,8}=)?\s*-?\d*,\d{1,2}\s*(?:°|[a-zA-Z]{1,3})?$/.test(s)) return form('u7t-comma', 'Use a decimal point (not a comma), like 12.5.');
      var x = c(s);
      return x && x.v === 'wrong' && x.code && GEO_CODE[x.code] ? { v: 'wrong', code: GEO_CODE[x.code], hint: x.hint } : x;
    };
  }
  function lenDp(o) { return o.dp == null ? 1 : o.dp; }
  function lenKey(v, o) { var dp = lenDp(o), w = rd(v, dp); return nS(w); }
  function lenOpts(o) { return { dp: lenDp(o), unit: o.unit, trig: o.trig, pyth: o.pyth, alts: o.alts, radTrap: o.radTrap, early: o.early }; }
  /* a few wrong values the checker must not mark right (the set-up's classic mistakes) */
  function lenBad(v, o) {
    var dp = lenDp(o), out = [], key = rd(v, dp), add = function (x) { if (isFinite(x) && x > 0 && Math.abs(rd(x, dp) - key) > 1e-9 && out.indexOf(nS(rd(x, dp))) < 0) out.push(nS(rd(x, dp))); };
    var tr = o.trig; if (tr) { add(G.trigLen({ fn: tr.fn, deg: tr.deg, side: tr.side, op: tr.op === 'div' ? 'mul' : 'div' })); }
    var py = o.pyth; if (py && py.legs) add(py.legs[0] * py.legs[0] + py.legs[1] * py.legs[1]); else if (py && py.hyp != null) add(Math.sqrt(py.hyp * py.hyp + py.leg * py.leg));
    (o.alts || []).forEach(function (a) { add(a.v); });
    return out.slice(0, 3);
  }
  /* a length (nearest tenth unless o.dp). o: HW.geo.lenChk options (trig: { fn, deg, side, op }, pyth: { legs } | { hyp, leg },
   * alts with u7t- codes, radTrap) + unit, sol, hints, text */
  function lenPart(prompt, v, o) {
    o = o || {}; var key = lenKey(v, o);
    return { prompt: prompt, input: { type: 'number', after: o.unit }, check: geoWrap(G.lenChk(v, lenOpts(o))), key: key, answer: t(HW.fmt(key) + uT(o.unit)), solution: o.sol, hints: o.hints || [], text: o.text, bad: lenBad(v, o) };
  }
  function lenFld(label, v, o) {
    o = o || {}; var key = lenKey(v, o);
    return { label: label, name: o.name, after: o.unit, chk: geoWrap(G.lenChk(v, lenOpts(o))), key: key, show: t(HW.fmt(key) + uT(o.unit)), bad: lenBad(v, o) };
  }
  /* an angle from an inverse ratio (nearest degree unless o.dp). o: HW.geo.angleRatioChk options (ratio: { fn, num, den }, alts, radTrap, complementTrap) */
  function angOpts(o) { return { dp: o.dp == null ? 0 : o.dp, ratio: o.ratio, alts: o.alts, radTrap: o.radTrap, complementTrap: o.complementTrap }; }
  function angBad(deg, o) {
    var dp = o.dp == null ? 0 : o.dp, out = [], add = function (x) { if (isFinite(x) && Math.abs(rd(x, dp) - rd(deg, dp)) > 1e-9) out.push(nS(rd(x, dp))); };
    if (o.complementTrap !== false) add(90 - deg);
    if (o.ratio) add(TRG[o.ratio.fn](o.ratio.num / o.ratio.den));
    return out;
  }
  function angPart(prompt, deg, o) {
    o = o || {}; var dp = o.dp == null ? 0 : o.dp, key = nS(rd(deg, dp));
    return { prompt: prompt, input: { type: 'number', after: '°' }, check: geoWrap(G.angleRatioChk(deg, angOpts(o))), key: key, answer: t(HW.fmt(key) + '^\\circ'), solution: o.sol, hints: o.hints || [], text: o.text, bad: angBad(deg, o), good: [key + '°'] };
  }
  function angFld(label, deg, o) {
    o = o || {}; var dp = o.dp == null ? 0 : o.dp, key = nS(rd(deg, dp));
    return { label: label, name: o.name, after: '°', chk: geoWrap(G.angleRatioChk(deg, angOpts(o))), key: key, show: t(HW.fmt(key) + '^\\circ'), bad: angBad(deg, o) };
  }
  /* the other acute angle: 90° − θ (90° minus the rounded θ is right too) */
  function otherFld(label, th, o) {
    o = o || {};
    return fld(label, 90 - th, { after: '°', name: o.name || 'Other angle', alts: [90 - rd(th, 0)], diag: [{ v: 180 - th, code: 'u7t-180-angle', hint: 'The two acute angles of a right triangle add to <b>90°</b> (the right angle takes the other 90° of the 180°).' }, { v: 180 - rd(th, 0), code: 'u7t-180-angle', hint: 'The two acute angles of a right triangle add to <b>90°</b>.' }] });
  }
  Object.assign(A, { GEO_CODE: GEO_CODE, geoWrap: geoWrap, lenPart: lenPart, lenFld: lenFld, lenKey: lenKey, angPart: angPart, angFld: angFld, otherFld: otherFld });

  /* ================= drawings ================= */
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', RED = '#c93a33', AMBER = '#b26b00', GREEN = '#12805a';
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function n360(a) { return ((a % 360) + 360) % 360; }
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* a small SVG canvas that tracks its bounding box (directions in math degrees: 0 = right, counterclockwise; y down) */
  function Fig() { this.s = ''; this.bb = [1e9, 1e9, -1e9, -1e9]; }
  Fig.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); return this; };
  Fig.prototype.line = function (p, p2, o) {
    o = o || {};
    this.s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(p2[0]) + '" y2="' + f1(p2[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
    return this.grow(p[0], p[1]).grow(p2[0], p2[1]);
  };
  Fig.prototype.path = function (d, o, pts) {
    o = o || {}; var me = this;
    this.s += '<path d="' + d + '" fill="' + (o.fill || 'none') + '"' + (o.fillOpacity != null ? ' fill-opacity="' + o.fillOpacity + '"' : '') + ' stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); return this;
  };
  Fig.prototype.poly = function (pts, o) { return this.path('M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z', o, pts); };
  Fig.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-zθ]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '';
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it +
      (o.halo === false ? '' : ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"') + '>' + esc(str).replace(/-/g, '−') + '</text>';
    var w = str.length * size * 0.3 + 2, ax = o.anchor === 'start' ? x + w : o.anchor === 'end' ? x - w : x;
    return this.grow(ax, y, w, size * 0.62);
  };
  Fig.prototype.dot = function (p, o) { o = o || {}; this.s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (o.r || 3.2) + '" fill="' + (o.color || INK) + '"/>'; return this.grow(p[0], p[1], o.r || 3.2); };
  /* an angle mark at V from direction d1 counterclockwise to d2 (less than 180°), with a label */
  Fig.prototype.arc = function (V, d1, d2, o) {
    o = o || {}; var span = n360(d2 - d1), r0 = o.r || (span < 20 ? 52 : span < 35 ? 40 : 28), right = o.right != null ? o.right : Math.abs(span - 90) < 0.01, col = o.color || INK;
    if (right) { var s = 11, u = at([0, 0], d1, 1), v = at([0, 0], d1 + 90, 1); this.path('M' + f1(V[0] + u[0] * s) + ' ' + f1(V[1] + u[1] * s) + 'L' + f1(V[0] + (u[0] + v[0]) * s) + ' ' + f1(V[1] + (u[1] + v[1]) * s) + 'L' + f1(V[0] + v[0] * s) + ' ' + f1(V[1] + v[1] * s), { stroke: col, width: 1.6 }); }
    else { var a = at(V, d1, r0), b = at(V, d1 + span, r0); this.path('M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + r0 + ' ' + r0 + ' 0 ' + (span > 180 ? 1 : 0) + ' 0 ' + f1(b[0]) + ' ' + f1(b[1]), { stroke: col, width: 1.7 }, [a, b]); }
    if (o.label != null && o.label !== '') {
      var str = String(o.label), hw = str.length * 14 * 0.3 + 3, lr = o.labelR || Math.min(120, Math.max((right ? 14 : r0) + 13, (hw + 6) / Math.max(0.12, Math.sin(Math.min(span, 179) / 2 * RAD)) + 4));
      var p = at(V, d1 + span / 2, lr); this.text(p[0], p[1], str, { size: 14, color: o.labelColor || col });
    }
    return this;
  };
  /* a label beside segment PQ, pushed away from point O */
  Fig.prototype.side = function (Pp, Qq, O, s, o) {
    o = o || {}; var M = [(Pp[0] + Qq[0]) / 2, (Pp[1] + Qq[1]) / 2], dx = Qq[0] - Pp[0], dy = Qq[1] - Pp[1], len = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / len, ny = dx / len;
    if ((O[0] - M[0]) * nx + (O[1] - M[1]) * ny > 0) { nx = -nx; ny = -ny; }
    var w = String(s).length * 15 * 0.3 + 4, off = (o.gap || 8) + Math.abs(nx) * w + Math.abs(ny) * 9;
    return this.text(M[0] + nx * off, M[1] + ny * off, s, { size: 15, color: o.color || INK });
  };
  Fig.prototype.svg = function (o) {
    o = o || {}; var pad = o.pad == null ? 8 : o.pad, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>';
  };
  /* the right triangle of HW.geo (right angle at C), in one of four positions. o: rightTriSVG options (a, b numbers; sides; theta; …) */
  var CORNERS = ['br', 'bl', 'br', 'bl', 'tr', 'tl'];
  function triSVG(r, o) { return G.rightTriSVG(Object.assign({ right: r ? r.pick(CORNERS) : 'br', names: false, width: 270 }, o)); }
  /* the side letters (a, b) for the roles opp / adj from θ at vertex th */
  function letters(th) { return G.rolesFor(th); }
  /* lengths { opp, adj, hyp } → { a, b, c } for θ at vertex th */
  function abc(th, s) { var R = letters(th), out = {}; out[R.opp] = s.opp; out[R.adj] = s.adj; out.c = s.hyp; return out; }
  Object.assign(A, { Fig: Fig, at: at, n360: n360, triSVG: triSVG, letters: letters, abc: abc, INK: INK, BLUE: BLUE, RED: RED, AMBER: AMBER, GREEN: GREEN, GREY: GREY });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u7t-comma': 'Comma instead of a decimal point', 'u7t-places': 'Not rounded to the place asked', 'u7t-round-dir': 'Rounded the wrong way', 'u7t-as-decimal': 'Gave the fraction, not the decimal',
    'u7t-one-box': 'One box of several wrong', 'u7t-half-box': 'One of the two boxes wrong', 'u7t-many-box': 'Several boxes wrong',
    'u7t-rad': 'Calculator in RAD mode', 'u7t-mul-div': 'Multiplied by the trig ratio instead of dividing (or the reverse)', 'u7t-upside': 'Ratio upside down',
    'u7t-ratio': 'Used the wrong trig ratio (sin, cos, tan)', 'u7t-no-inv': 'Forgot the inverse key (sin⁻¹, cos⁻¹, tan⁻¹)', 'u7t-other-angle': 'Gave the other acute angle (90° − θ)',
    'u7t-no-root': 'Pythagoras: forgot the square root', 'u7t-pyth-sub': 'Pythagoras: subtracted the squares to find the hypotenuse', 'u7t-add-sides': 'Pythagoras: added the sides without squaring',
    'u7t-double': 'Doubled a side instead of squaring it', 'u7t-hyp-leg': 'Pythagoras: added the squares to find a leg (hypotenuse used as a leg)', 'u7t-sub-sides': 'Pythagoras: subtracted the sides without squaring',
    'u7t-leg-long': 'A leg longer than the hypotenuse', 'u7t-chop': 'Chopped instead of rounding',
    'u7t-root-squares': 'Square root: gave the perfect squares, not their roots', 'u7t-root-half': 'Square root: halved the number',
    'u7t-opp-adj': 'Opp and adj swapped (named from the other angle)', 'u7t-adj-hyp': 'Called the hypotenuse the adjacent side', 'u7t-hyp-wrong': 'Hypotenuse: not the side across from the right angle',
    'u7t-180-angle': 'Other acute angle: used 180° instead of 90°', 'u7t-verdict': 'Right numbers, wrong conclusion', 'u7t-not-longest': 'Right-triangle test: c was not the longest side',
    'u7t-no-eye': 'Left out the eye (or instrument) height', 'u7t-eye-sub': 'Subtracted the eye height instead of adding it', 'u7t-early': 'Rounded a length too early (used the rounded value in the next step)',
    'u7t-one-tri': 'Two triangles: used only one of them', 'u7t-angle-diff': 'Two triangles: used the difference of the angles in one ratio', 'u7t-sum-diff': 'Two triangles: added instead of subtracting (or the reverse)',
    'u7t-no-diff': 'Used the whole height, not the difference in heights', 'u7t-km': 'Gave metres instead of kilometres'
  });
  HW.addPartial({
    'u7t-round-dir': 's', 'u7t-one-box': 's', 'u7t-half-box': 'b', 'u7t-many-box': 'n', 'u7t-rad': 'b', 'u7t-mul-div': 'b', 'u7t-upside': 'n', 'u7t-ratio': 'b', 'u7t-no-inv': 'b', 'u7t-other-angle': 'b',
    'u7t-no-root': 's', 'u7t-pyth-sub': 'b', 'u7t-add-sides': 'n', 'u7t-double': 'b', 'u7t-hyp-leg': 'b', 'u7t-sub-sides': 'n', 'u7t-leg-long': 'n', 'u7t-chop': 's',
    'u7t-root-squares': 'b', 'u7t-root-half': 'n', 'u7t-opp-adj': 'b', 'u7t-adj-hyp': 'b', 'u7t-hyp-wrong': 'n', 'u7t-180-angle': 'b', 'u7t-verdict': 'b', 'u7t-not-longest': 'b',
    'u7t-no-eye': 's', 'u7t-eye-sub': 'b', 'u7t-early': 's', 'u7t-one-tri': 'b', 'u7t-angle-diff': 'n', 'u7t-sum-diff': 'b', 'u7t-no-diff': 'b', 'u7t-km': 's'
  });

  /* ======================================================================================================
   * G2 — square roots and the Pythagorean theorem
   * ====================================================================================================== */
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41], [28, 45, 53], [33, 56, 65], [16, 63, 65], [11, 60, 61], [48, 55, 73], [13, 84, 85], [36, 77, 85], [39, 80, 89], [65, 72, 97]];
  var UNITS = ['cm', 'm', 'ft', 'in'];
  var LEN = { cm: [3, 30, 0.5], m: [2.5, 40, 0.5], ft: [4, 36, 1], 'in': [5, 48, 1] };
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  /* a scaled Pythagorean triple with every side at most mx: [a, b, c] */
  function triple(r, mx) { return find(function () { var tr = r.pick(TRIPLES), k = r.pick([1, 1, 2, 3, 0.5, 1.5, 2.5, 4, 10]); return tr.map(function (x) { return q(x * k); }); }, function (s) { return s[2] <= (mx || 100) && s[0] >= 1.5; }); }
  /* ---- √n: between two whole numbers, and to the nearest tenth ---- */
  function rootPart(r, o) {
    o = o || {};
    var n = find(function () { return r.int(11, 230); }, function (n) { return !isSq(n) && safe(Math.sqrt(n), 1); }), lo = Math.floor(Math.sqrt(n)), hi = lo + 1, v = Math.sqrt(n);
    var sqHint = 'Those are the perfect squares on each side of ' + n + '. Give the whole numbers whose squares they are.';
    var specs = [fld('Between:', lo, { name: 'Lower', diag: [{ v: lo * lo, code: 'u7t-root-squares', hint: sqHint }] }), fld('and', hi, { name: 'Upper', diag: [{ v: hi * hi, code: 'u7t-root-squares', hint: sqHint }] }),
      fld(t('\\sqrt{' + n + '}\\approx'), v, { dp: 1, name: 'Square root', diag: [{ v: n / 2, code: 'u7t-root-half', hint: 'A square root is <b>not</b> half the number. Check by squaring: what number times itself gives ' + n + '?' }, { v: n * n, code: 'u7t-root-half', hint: 'That is ' + n + ' squared. The square root undoes squaring: ' + t('\\sqrt{\\ }') + ' is 2nd ' + t('x^2') + '.' }] })];
    return fieldsPart(t('\\sqrt{' + n + '}') + ' is between which two whole numbers? Then use your calculator to find ' + t('\\sqrt{' + n + '}') + ' to the nearest tenth.', specs,
      br([t(lo + '^2=' + lo * lo) + ' and ' + t(hi + '^2=' + hi * hi) + ', and ' + n + ' is between ' + lo * lo + ' and ' + hi * hi + ', so ' + t('\\sqrt{' + n + '}') + ' is between <b>' + lo + '</b> and <b>' + hi + '</b>' + (n - lo * lo < hi * hi - n ? ' (closer to ' + lo + ').' : ' (closer to ' + hi + ').'),
        '2nd ' + t('x^2') + ' ' + n + ' ) ENTER: ' + t('\\sqrt{' + n + '}' + toN(v, 1)) + ' (check: ' + t(fx(v, 1) + '^2\\approx ' + N(rd(rd(v, 1) * rd(v, 1), 2))) + ')']),
      ['Which perfect squares (1, 4, 9, 16, 25, …) are just below and just above ' + n + '?', 'The square root key is 2nd then x².'], o.text || 'square root between two whole numbers');
  }
  /* ---- the hypotenuse from two legs ---- */
  function legsShared(r, o) {
    o = o || {}; var u = r.pick(UNITS), a, b;
    if (o.exact) { var tr = triple(r, 90); a = tr[0]; b = tr[1]; }
    else { var R = LEN[u]; var s = find(function () { return [pickR(r, R), pickR(r, R)]; }, function (s) { var c = Math.sqrt(s[0] * s[0] + s[1] * s[1]); return s[0] !== s[1] && Math.max(s[0], s[1]) / Math.min(s[0], s[1]) < 4 && !near(c, rd(c, 1), 1e-9) && safe(c, 1); }); a = s[0]; b = s[1]; }
    if (r.chance(0.5)) { var tmp = a; a = b; b = tmp; }
    return { u: u, a: a, b: b, c: Math.sqrt(a * a + b * b) };
  }
  function hypSol(a, b, c, u, nm) {
    nm = nm || 'c';
    return br([t(nm + '^2=a^2+b^2=' + N(a) + '^2+' + N(b) + '^2=' + N(q(a * a)) + '+' + N(q(b * b)) + '=' + N(q(a * a + b * b))), t(nm + '=\\sqrt{' + N(q(a * a + b * b)) + '}' + toN(c, 1) + uT(u)),
      'Check: longer than the longer leg (' + L(Math.max(a, b), u) + ') but shorter than ' + t(N(a) + '+' + N(b) + '=' + N(q(a + b))) + ' ✓']);
  }
  function hypPart(r, o) {
    o = o || {};
    var s = legsShared(r, o), svg = triSVG(r, { a: s.a, b: s.b, sides: { a: lab(s.a, s.u), b: lab(s.b, s.u), c: 'x' }, unknown: 'c' });
    return lenPart('Find the hypotenuse ' + t('x') + (o.exact ? '.' : ', to the nearest tenth.') + svg, s.c, { unit: s.u, pyth: { legs: [s.a, s.b] }, sol: hypSol(s.a, s.b, s.c, s.u, 'x'),
      hints: ['The hypotenuse is across from the right angle: ' + t('c^2=a^2+b^2') + '.', 'Square both legs, add, then take the square root.'], text: o.text || (o.exact ? 'hypotenuse (exact)' : 'hypotenuse to the nearest tenth') });
  }
  /* ---- a missing leg ---- */
  function legShared(r, o) {
    o = o || {}; var u = r.pick(UNITS), c, l;
    if (o.exact) { var tr = triple(r, 90), i = r.int(0, 1); c = tr[2]; l = tr[i]; }
    else { var R = LEN[u]; var s = find(function () { var cc = pickR(r, [R[0] + 3, R[1] + 10, R[2]]), ll = pickR(r, R); return [cc, ll]; }, function (s) { var x = Math.sqrt(s[0] * s[0] - s[1] * s[1]); return s[1] < s[0] - 1 && s[1] > s[0] * 0.25 && !near(x, rd(x, 1), 1e-9) && safe(x, 1) && x > s[0] * 0.25; }); c = s[0]; l = s[1]; }
    return { u: u, c: c, l: l, x: Math.sqrt(c * c - l * l) };
  }
  function legSol(c, l, x, u, nm) {
    nm = nm || 'x';
    return br(['The ' + L(c, u) + ' side is the hypotenuse (across from the right angle), so <b>subtract</b>: big square minus small square.', t(nm + '^2=' + N(c) + '^2-' + N(l) + '^2=' + N(q(c * c)) + '-' + N(q(l * l)) + '=' + N(q(c * c - l * l))),
      t(nm + '=\\sqrt{' + N(q(c * c - l * l)) + '}' + toN(x, 1) + uT(u)), 'Check: a leg is shorter than the hypotenuse ✓']);
  }
  function legPart(r, o) {
    o = o || {};
    var s = legShared(r, o), lg = r.chance(0.5) ? 'a' : 'b', other = lg === 'a' ? 'b' : 'a', len = {}; len[lg] = s.l; len[other] = s.x;
    var sides = { c: lab(s.c, s.u) }; sides[lg] = lab(s.l, s.u); sides[other] = 'x';
    var svg = triSVG(r, { a: len.a, b: len.b, sides: sides, unknown: other });
    return lenPart('Find the missing leg ' + t('x') + (o.exact ? '.' : ', to the nearest tenth.') + svg, s.x, { unit: s.u, pyth: { hyp: s.c, leg: s.l }, sol: legSol(s.c, s.l, s.x, s.u),
      hints: ['Which side is the hypotenuse? It is across from the right angle.', 'For a leg: ' + t('a^2=c^2-b^2') + ' (big square minus small square).'], text: o.text || (o.exact ? 'missing leg (exact)' : 'missing leg to the nearest tenth') });
  }
  /* ---- is it a right triangle? ---- */
  var TEST_CTX = ['A carpenter cuts a triangular corner shelf with sides', 'A triangle has sides', 'A triangular garden bed has sides', 'A roof truss is a triangle with sides', 'A triangular sail has sides', 'A welder joins three steel bars into a triangle with lengths'];
  function rightTestPart(r, o) {
    o = o || {};
    var yes = r.chance(0.5), u = r.pick(UNITS), s;
    if (yes) s = triple(r, 99);
    else s = find(function () { var a = r.int(4, 40), b = r.int(a + 1, 60), c0 = Math.round(Math.sqrt(a * a + b * b)), c = c0 + r.pick([-2, -1, 1, 2]); return [a, b, c]; }, function (s) { return s[2] > s[1] && s[0] * s[0] + s[1] * s[1] !== s[2] * s[2] && Math.abs(s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) > 8; });
    var a = s[0], b = s[1], c = s[2], show = r.shuffle([a, b, c]), sum = q(a * a + b * b), cc = q(c * c), lastNotC = show[2] !== c;
    var d2 = { dp: 2, noPlaces: true }, wrongSum = [{ v: q(a + b), code: 'u7t-add-sides', hint: 'Square each side first: ' + t('a^2+b^2') + '.' }];
    if (lastNotC) { wrongSum.push({ v: q(show[0] * show[0] + show[1] * show[1]), code: 'u7t-not-longest', hint: t('c') + ' must be the <b>longest</b> side, even when it is not written last. Add the squares of the two <b>shorter</b> sides.' }); }
    var specs = [fld('Two shorter sides, ' + t('a^2+b^2') + ' =', sum, Object.assign({ name: 'a² + b²', diag: wrongSum }, d2)),
      fld('Longest side, ' + t('c^2') + ' =', cc, Object.assign({ name: 'c²', diag: lastNotC ? [{ v: q(show[2] * show[2]), code: 'u7t-not-longest', hint: 'Use the <b>longest</b> side for ' + t('c') + ', not the last one written.' }, { v: q(2 * c), code: 'u7t-double', hint: t('c^2') + ' means ' + t('c\\times c') + '.' }] : [{ v: q(2 * c), code: 'u7t-double', hint: t('c^2') + ' means ' + t('c\\times c') + '.' }] }, d2)),
      ynFld('Right triangle?', yes, { name: 'Right triangle', code: 'u7t-verdict', why: 'Compare the two numbers: <b>equal</b> means a right triangle; not equal means it is not.' })];
    return fieldsPart((o.ctx || r.pick(TEST_CTX)) + ' ' + show.map(function (x) { return L(x, u); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. Is it a right triangle? Use the Pythagorean theorem: compare ' + t('a^2+b^2') + ' with ' + t('c^2') + '.', specs,
      br(['The longest side is ' + L(c, u) + ', so ' + t('c=' + N(c)) + '.', t('a^2+b^2=' + N(a) + '^2+' + N(b) + '^2=' + N(q(a * a)) + '+' + N(q(b * b)) + '=' + N(sum)), t('c^2=' + N(c) + '^2=' + N(cc)),
        yes ? 'They are equal, so <b>yes</b>: it is a right triangle (the right angle is across from the ' + L(c, u) + ' side).' : t(N(sum) + '\\ne ' + N(cc)) + ', so <b>no</b>: it is not a right triangle.']),
      ['Let c be the longest side. Square the other two and add.', 'Equal: right triangle. Not equal: not a right triangle.'], o.text || 'is it a right triangle?');
  }
  /* ---- Pythagoras in a story: the hypotenuse or a leg ---- */
  function pythCtxPart(r, o) {
    o = o || {};
    var kind = o.kind || (r.chance(0.5) ? 'hyp' : 'leg'), c, hint2, sol, prompt, pyth, u, dp = 1, fig, p = person(r);
    if (kind === 'hyp') {
      var k = r.int(0, 4), x1, x2;
      if (k === 0) { var fld0 = r.pick([['A Canadian football field (without the end zones) is', 'yd', [100, 115, 5], [60, 68, 1]], ['A soccer field in Lethbridge is', 'm', [95, 110, 1], [60, 75, 1]], ['A hockey rink is about', 'ft', [190, 200, 5], [80, 90, 5]]]); u = fld0[1]; x1 = pickR(r, fld0[2]); x2 = pickR(r, fld0[3]);
        prompt = fld0[0] + ' a rectangle ' + L(x1, u) + ' long and ' + L(x2, u) + ' wide. ' + p.n + ' runs straight from one corner to the opposite corner. How far does ' + p.he + ' run, to the nearest tenth?'; }
      else if (k === 1) { u = 'm'; x1 = pickR(r, [12, 30, 0.5]); x2 = pickR(r, [5, 14, 0.5]); prompt = 'A guy wire runs from a point ' + L(x1, u) + ' up a cell tower to a stake in the ground ' + L(x2, u) + ' from the base of the tower. How long is the wire, to the nearest tenth of a metre?'; }
      else if (k === 2) { u = 'cm'; x1 = pickR(r, [6.4, 7.6, 0.1]); x2 = pickR(r, [13.8, 16.4, 0.1]); prompt = 'A phone screen is ' + L(x1, u) + ' wide and ' + L(x2, u) + ' tall. Screens are sold by the length of the diagonal. How long is the diagonal, to the nearest tenth of a centimetre?'; }
      else if (k === 3) { u = 'm'; x2 = pickR(r, [0.3, 0.75, 0.05]); x1 = q(x2 * 12); dp = 2; prompt = 'A wheelchair ramp rises ' + L(x2, u) + ' over a horizontal distance of ' + L(x1, u) + ' (a slope of 1 : 12). How long is the ramp’s surface, to the nearest hundredth of a metre?'; }
      else { u = 'ft'; x1 = r.pick([60, 65, 70, 75, 80, 90]); x2 = x1; prompt = 'A baseball diamond is a square with sides of ' + L(x1, u) + '. How far does the catcher throw from home plate to second base (the opposite corner)? Round to the nearest tenth of a foot.'; }
      c = Math.sqrt(x1 * x1 + x2 * x2); pyth = { legs: [x1, x2] }; fig = triSVG(null, { a: x2, b: x1, sides: { a: lab(x2, u), b: lab(x1, u), c: '?' }, unknown: 'c', width: 220 });
      sol = br([fig, 'The distance asked for is the hypotenuse (across from the right angle).', t('c^2=' + N(x1) + '^2+' + N(x2) + '^2=' + N(q(x1 * x1)) + '+' + N(q(x2 * x2)) + '=' + N(q(x1 * x1 + x2 * x2))), t('c=\\sqrt{' + N(q(x1 * x1 + x2 * x2)) + '}' + toN(c, dp) + uT(u))]);
      hint2 = 'Square the two legs, add, then take the square root.';
    } else {
      var k2 = r.int(0, 3), hy, lg, what;
      if (k2 === 0) { u = 'm'; hy = pickR(r, [4, 9, 0.5]); lg = pickR(r, [0.9, 2.4, 0.1]); prompt = p.n + ' leans a ' + L(hy, u) + ' ladder against a wall. The foot of the ladder is ' + L(lg, u) + ' from the wall. How high up the wall does the ladder reach, to the nearest tenth of a metre?'; what = 'the height up the wall'; }
      else if (k2 === 1) { u = 'm'; hy = pickR(r, [80, 140, 5]); lg = pickR(r, [40, 90, 5]); prompt = p.n + ' flies a drone over a field near Strathmore. The controller shows that the drone is ' + L(hy, u) + ' away in a straight line, and it is right above a fence post ' + L(lg, u) + ' from ' + p.him + ' (ignore ' + p.his + ' height). How high is the drone, to the nearest tenth of a metre?'; what = 'the height'; }
      else if (k2 === 2) { u = 'm'; hy = pickR(r, [12, 18, 0.5]); lg = pickR(r, [7, 11, 0.5]); prompt = 'A hay bale elevator is ' + L(hy, u) + ' long. Its lower end is on the ground ' + L(lg, u) + ' from the wall of a barn, and its top end rests at the bottom of the hayloft door. How high is the hayloft door, to the nearest tenth of a metre?'; what = 'the height of the door'; }
      else { u = 'm'; hy = pickR(r, [1.8, 2.6, 0.05]); lg = pickR(r, [1.0, 1.4, 0.1]); dp = 2; prompt = 'A farm gate is a rectangle ' + L(lg, u) + ' high. A diagonal brace from one corner to the opposite corner is ' + L(hy, u) + ' long. How wide is the gate, to the nearest hundredth of a metre?'; what = 'the width'; }
      c = Math.sqrt(hy * hy - lg * lg); pyth = { hyp: hy, leg: lg }; fig = triSVG(null, { a: c, b: lg, sides: { a: '?', b: lab(lg, u), c: lab(hy, u) }, unknown: 'a', width: 200 });
      sol = br([fig, 'The ' + L(hy, u) + ' length is the hypotenuse (across from the right angle). We want a leg, so <b>subtract</b>.', t('x^2=' + N(hy) + '^2-' + N(lg) + '^2=' + N(q(hy * hy)) + '-' + N(q(lg * lg)) + '=' + N(q(hy * hy - lg * lg))), t('x=\\sqrt{' + N(q(hy * hy - lg * lg)) + '}' + toN(c, dp) + uT(u)) + ': ' + what + '.', 'Check: shorter than the hypotenuse ✓']);
      hint2 = 'For a leg: big square minus small square, then the square root.';
    }
    if (!safe(c, dp)) return pythCtxPart(r, o);
    return lenPart(prompt, c, { dp: dp, unit: u, pyth: pyth, sol: sol, hints: ['Sketch it and mark the right angle. Which length is the hypotenuse?', hint2], text: o.text || 'Pythagoras story: ' + kind });
  }
  /* ---- squaring a corner: the diagonal, and less than / exactly / more than 90° ---- */
  var LESS = ['less', 'smaller', 'under', 'below', 'acute', 'small', 'too small'], MORE = ['more', 'bigger', 'greater', 'larger', 'over', 'above', 'obtuse', 'big'], EXACT = ['exactly', 'exact', 'square', 'equal', 'squared'];
  var FRAMES = [['the floor frame for a garden shed', 'ft', [8, 14, 1], [6, 10, 1]], ['a deck frame', 'ft', [12, 24, 1], [10, 18, 1]], ['a backyard rink with string lines', 'ft', [30, 50, 2], [20, 32, 2]],
    ['the forms for a concrete patio', 'm', [3, 6, 0.5], [2, 4.5, 0.5]], ['the lines of a soccer field', 'm', [90, 110, 1], [55, 70, 1]], ['the foundation of a garage', 'm', [6, 9, 0.5], [5, 7.5, 0.5]]];
  function squareCornerPart(r, o) {
    o = o || {};
    var fr = r.pick(FRAMES), u = fr[1], kind = r.pick(['less', 'more', 'exact']), Lg, W;
    if (kind === 'exact') { var tr = find(function () { var k = r.pick(u === 'ft' ? [2, 3, 4, 5, 6, 8, 10] : [0.5, 1, 1.5, 2, 20]); return [3 * k, 4 * k, 5 * k]; }, function (s) { return s[1] >= fr[2][0] * 0.6 && s[1] <= fr[2][1] * 1.2; }); W = tr[0]; Lg = tr[1]; }
    else { var s = find(function () { return [pickR(r, fr[2]), pickR(r, fr[3])]; }, function (s) { var d = Math.sqrt(s[0] * s[0] + s[1] * s[1]); return s[0] > s[1] && !near(d, rd(d, 1), 1e-9) && safe(d, 1); }); Lg = s[0]; W = s[1]; }
    var dgl = Math.sqrt(Lg * Lg + W * W), dk = rd(dgl, 1), del = kind === 'exact' ? 0 : (kind === 'less' ? -1 : 1) * pickR(r, dgl > 40 ? [0.4, 1.2, 0.1] : [0.2, 0.6, 0.1]), meas = q(dk + del);
    var p = person(r), right = kind === 'less' ? LESS : kind === 'more' ? MORE : EXACT, wr = (kind === 'less' ? MORE.concat(EXACT) : kind === 'more' ? LESS.concat(EXACT) : LESS.concat(MORE));
    var specs = [lenFld('Diagonal if square:', dgl, { unit: u, name: 'Diagonal', pyth: { legs: [Lg, W] } }),
      wfld('The corner is:', { name: 'Corner', ph: 'less, exactly or more', right: right, wrongs: wr, choices: 'less, exactly or more (than 90°)', key: kind === 'less' ? 'less than 90°' : kind === 'more' ? 'more than 90°' : 'exactly 90°', code: 'u7t-verdict', bad: [kind === 'less' ? 'more' : 'less'],
        why: 'Compare the measured diagonal with the diagonal it should be. Too long: the sides are pushed apart, so the corner is <b>more</b> than 90°. Too short: the sides are pulled together, so it is <b>less</b> than 90°.' })];
    return fieldsPart(p.n + ' is laying out ' + fr[0] + ', a rectangle ' + L(Lg, u) + ' by ' + L(W, u) + '. (a) What should the diagonal be if the corners are square? Round to the nearest tenth. (b) ' + cap(p.he) + ' measures the diagonal: ' + L(meas, u) + '. Is the corner angle less than 90°, exactly 90°, or more than 90°? Type <b>less</b>, <b>exactly</b> or <b>more</b>.', specs,
      br([t('d=\\sqrt{' + N(Lg) + '^2+' + N(W) + '^2}=\\sqrt{' + N(q(Lg * Lg + W * W)) + '}' + toN(dgl, 1) + uT(u)) + (kind === 'exact' ? ' (a 3-4-5 triangle, times ' + N(q(W / 3)) + ')' : ''),
        kind === 'exact' ? 'The measured diagonal is the same, so the corner is square: <b>exactly 90°</b>.' : L(meas, u) + ' is ' + (kind === 'less' ? 'too <b>short</b>: the sides are pulled closer together, so the corner is <b>less than 90°</b>.' : 'too <b>long</b>: the sides are pushed apart, so the corner is <b>more than 90°</b>.')]),
      ['The diagonal of a rectangle is the hypotenuse of a right triangle: ' + t('d^2=l^2+w^2') + '.', 'A diagonal that is too long means the corner is opened too wide.'], o.text || 'squaring a corner');
  }
  Object.assign(A, { TRIPLES: TRIPLES, UNITS: UNITS, LEN: LEN, isSq: isSq, triple: triple, rootPart: rootPart, legsShared: legsShared, hypSol: hypSol, hypPart: hypPart, legShared: legShared, legSol: legSol, legPart: legPart,
    rightTestPart: rightTestPart, pythCtxPart: pythCtxPart, squareCornerPart: squareCornerPart });

  /* ======================================================================================================
   * G4 (and A1) — naming the sides, the trig ratios, finding sides and angles
   * ====================================================================================================== */
  /* a triangle with whole-number (or .5) sides and θ at A or B: { th, s: {opp, adj, hyp}, ab: {a, b, c} } */
  function ratioTri(r) {
    var tr = triple(r, 99), th = r.chance(0.5) ? 'A' : 'B', legs = r.shuffle([tr[0], tr[1]]), ab = { a: legs[0], b: legs[1], c: tr[2] }, R = letters(th);
    return { th: th, ab: ab, s: { opp: ab[R.opp], adj: ab[R.adj], hyp: ab.c } };
  }
  function ratioSVG(r, x, extra) { return triSVG(r, Object.assign({ a: x.ab.a, b: x.ab.b, sides: { a: lab(x.ab.a), b: lab(x.ab.b), c: lab(x.ab.c) }, theta: x.th }, extra || {})); }
  /* ---- label opp, adj and hyp (type each length) ---- */
  function labelPart(r, o) {
    o = o || {};
    var x = ratioTri(r), s = x.s, svg = ratioSVG(r, x);
    var specs = [fld('opp =', s.opp, { dp: 1, noPlaces: true, name: 'opp', diag: [{ v: s.adj, code: 'u7t-opp-adj', hint: 'The <b>opp</b> side is across from θ: it does not touch θ.' }, { v: s.hyp, code: 'u7t-hyp-wrong', hint: 'The hyp is across from the right angle. The opp is across from θ.' }] }),
      fld('adj =', s.adj, { dp: 1, noPlaces: true, name: 'adj', diag: [{ v: s.opp, code: 'u7t-opp-adj', hint: 'The <b>adj</b> side touches θ (and it is not the hyp).' }, { v: s.hyp, code: 'u7t-adj-hyp', hint: 'The hyp touches θ too, but it is never called adj. The adj is the <b>other</b> side that touches θ.' }] }),
      fld('hyp =', s.hyp, { dp: 1, noPlaces: true, name: 'hyp', diag: [{ v: s.opp, code: 'u7t-hyp-wrong', hint: 'The hyp is across from the <b>right angle</b>: it is always the longest side.' }, { v: s.adj, code: 'u7t-hyp-wrong', hint: 'The hyp is across from the <b>right angle</b>: it is always the longest side.' }] })];
    return fieldsPart('Name the sides from the angle marked θ. Type the length of the <b>opposite</b> side, the <b>adjacent</b> side and the <b>hypotenuse</b>.' + svg, specs,
      br([ratioSVG(null, x, { roles: true, width: 220 }), 'Step 1: the side across from the right angle is the <b>hyp</b>: ' + N(s.hyp) + '.', 'Step 2: the side across from θ (not touching it) is the <b>opp</b>: ' + N(s.opp) + '.', 'Step 3: the last side touches θ: the <b>adj</b>: ' + N(s.adj) + '.']),
      ['Find the right angle first: the side across from it is the hyp.', 'The opp does not touch θ. The adj touches θ and is not the hyp.'], o.text || 'label opp, adj, hyp');
  }
  /* ---- sin θ, cos θ or tan θ as a decimal (4 places) ---- */
  function ratioDecPart(r, o) {
    o = o || {};
    var x = ratioTri(r), s = x.s, fn = o.fn || r.pick(['sin', 'cos', 'tan']), sd = SIDES[fn], top = s[sd[0]], bot = s[sd[1]], v = top / bot, others = ['sin', 'cos', 'tan'].filter(function (g) { return g !== fn; });
    var diag = [{ v: bot / top, code: 'u7t-upside', hint: 'Upside down: ' + t('\\' + fn + '\\theta=\\dfrac{\\text{' + sd[0] + '}}{\\text{' + sd[1] + '}}') + ' (' + MN[fn] + ').' }].concat(others.map(function (g) { return { v: s[SIDES[g][0]] / s[SIDES[g][1]], code: 'u7t-ratio', hint: 'That is ' + t('\\' + g + '\\theta') + '. ' + MN[fn] + ': ' + t('\\' + fn + '\\theta=\\dfrac{\\text{' + sd[0] + '}}{\\text{' + sd[1] + '}}') + '.' }; }));
    return num('Write ' + t('\\' + fn + '\\theta') + ' as a decimal to 4 decimal places.' + ratioSVG(r, x), v, { dp: 4, fracOk: true, exact: v, diag: diag,
      sol: br([ratioSVG(null, x, { roles: true, width: 220 }), 'From θ: opp = ' + N(s.opp) + ', adj = ' + N(s.adj) + ', hyp = ' + N(s.hyp) + '.', MN[fn] + ': ' + t('\\' + fn + '\\theta=\\dfrac{\\text{' + sd[0] + '}}{\\text{' + sd[1] + '}}=\\dfrac{' + N(top) + '}{' + N(bot) + '}' + toN(v, 4))]),
      hints: ['Label opp, adj and hyp from θ first.', 'SOH CAH TOA: sin = opp ÷ hyp, cos = adj ÷ hyp, tan = opp ÷ adj.'], text: o.text || fn + ' θ as a decimal' });
  }
  /* ---- a side from an angle and a side: the unknown on top (mul) or on the bottom (div) ---- */
  var CASES = { mul: [{ fn: 'sin', know: 'hyp', want: 'opp' }, { fn: 'cos', know: 'hyp', want: 'adj' }, { fn: 'tan', know: 'adj', want: 'opp' }],
    div: [{ fn: 'sin', know: 'opp', want: 'hyp' }, { fn: 'cos', know: 'adj', want: 'hyp' }, { fn: 'tan', know: 'opp', want: 'adj' }] };
  /* { fn, know, want, op, deg, u, k (known length), s: {opp, adj, hyp}, x (the answer), th } */
  function trigShared(r, o) {
    o = o || {};
    return find(function () {
      var op = o.op || r.pick(['mul', 'div']), cs = r.pick(CASES[op].filter(function (c) { return !o.fn || c.fn === o.fn; })), deg = r.int(o.lo || 15, o.hi || 75), u = o.u || r.pick(UNITS), k = pickR(r, o.range || LEN[u]);
      var s = sidesFrom(deg, cs.know, k);
      return { fn: cs.fn, know: cs.know, want: cs.want, op: op, deg: deg, u: u, k: k, s: s, x: s[cs.want], th: r.chance(0.5) ? 'A' : 'B' };
    }, function (c) { return c.deg !== 45 && safe(c.x, o.dp == null ? 1 : o.dp) && c.x >= 0.8 && c.x < 400 && Math.max(c.s.opp, c.s.adj) / Math.min(c.s.opp, c.s.adj) < 5; });
  }
  /* the worked lines of a trig side: "We have …, we want …: TOA", the ratio, x = …, the check */
  function trigLines(c, dp, nm) {
    nm = nm || 'x'; var F = fnT(c.fn, c.deg), K0 = N(c.k), eq = c.op === 'mul' ? t(F + '=' + fracT(nm, K0)) : t(F + '=' + fracT(K0, nm));
    var sol = c.op === 'mul' ? t(nm + '=' + K0 + '\\times ' + F + toN(c.x, dp) + uT(c.u)) : t(nm + '=' + K0 + '\\div ' + F + toN(c.x, dp) + uT(c.u));
    var chk = c.want === 'hyp' ? 'Check: the hypotenuse is the longest side ✓ (' + fx(c.x, dp) + ' > ' + N(c.k) + ')' : c.know === 'hyp' ? 'Check: a leg is shorter than the hypotenuse ✓' : null;
    return ['We have the <b>' + c.know + '</b> and want the <b>' + c.want + '</b>: ' + MN[c.fn] + '.', eq, (c.op === 'mul' ? 'The unknown is on <b>top</b>: multiply.' : 'The unknown is on the <b>bottom</b>: divide.'), sol, chk];
  }
  function trigOpts(c, o) { return { dp: o && o.dp, unit: c.u, trig: { fn: c.fn, deg: c.deg, side: c.k, op: c.op } }; }
  function trigSidePart(r, o) {
    o = o || {};
    var c = trigShared(r, o), ab = abc(c.th, c.s), R = letters(c.th), sides = {}; sides[R[c.know] || 'c'] = lab(c.k, c.u); sides[R[c.want] || 'c'] = 'x';
    var svg = triSVG(r, { a: ab.a, b: ab.b, theta: c.th, thetaLabel: c.deg + '°', sides: sides, unknown: R[c.want] || 'c' });
    return lenPart('Find ' + t('x') + ', to the nearest tenth.' + svg, c.x, Object.assign(trigOpts(c, o), { sol: br([triSVG(null, { a: ab.a, b: ab.b, theta: c.th, thetaLabel: c.deg + '°', sides: sides, roles: [c.know, c.want], unknown: R[c.want] || 'c', width: 220 })].concat(trigLines(c, 1))),
      hints: ['Label the side you know and the side you want (opp, adj, hyp) from the ' + c.deg + '° angle. Which ratio uses those two?', c.op === 'mul' ? 'When x is on top of the ratio, multiply.' : 'When x is on the bottom of the ratio, divide.'], text: o.text || 'side: unknown ' + (c.op === 'mul' ? 'on top' : 'on the bottom') + ' (' + c.fn + ')' }));
  }
  /* ---- an angle from two sides (and the other acute angle) ---- */
  function angleShared(r, o) {
    o = o || {};
    return find(function () {
      var fn = o.fn || r.pick(['sin', 'cos', 'tan']), u = r.pick(UNITS), R = LEN[u], top, bot;
      if (fn === 'tan') { top = pickR(r, R); bot = pickR(r, R); } else { bot = pickR(r, [R[0] + 2, R[1] + 8, R[2]]); top = pickR(r, R); }
      var th = INV[fn](top / bot), sd = SIDES[fn], s = {}; s[sd[0]] = top; s[sd[1]] = bot;
      if (fn === 'tan') s.hyp = Math.sqrt(top * top + bot * bot); else if (fn === 'sin') s.adj = Math.sqrt(bot * bot - top * top); else s.opp = Math.sqrt(bot * bot - top * top);
      return { fn: fn, u: u, top: top, bot: bot, th: th, s: s, v: r.chance(0.5) ? 'A' : 'B' };
    }, function (c) { return c.top < c.bot * 3 && (c.fn === 'tan' || c.top < c.bot * 0.95) && c.th > 10 && c.th < 80 && Math.abs(c.th - 45) > 2 && safe(c.th, 0) && safe(90 - c.th, 0); });
  }
  function angleLines(c, nm) {
    var sd = SIDES[c.fn];
    return ['We have the <b>' + sd[0] + '</b> (' + N(c.top) + ') and the <b>' + sd[1] + '</b> (' + N(c.bot) + '): ' + MN[c.fn] + '.', t((nm || '\\theta') + '=\\' + c.fn + '^{-1}\\!\\left(' + fracT(N(c.top), N(c.bot)) + '\\right)' + toN(c.th, 0) + '^\\circ'), '2nd ' + c.fn + ' ' + N(c.top) + ' ÷ ' + N(c.bot) + ' ) ENTER'];
  }
  function anglePart(r, o) {
    o = o || {};
    var c = angleShared(r, o), ab = abc(c.v, { opp: c.s.opp, adj: c.s.adj, hyp: c.s.hyp }), R = letters(c.v), sd = SIDES[c.fn], sides = {};
    sides[R[sd[0]] || 'c'] = lab(c.top, c.u); sides[R[sd[1]] || 'c'] = lab(c.bot, c.u);
    var svg = triSVG(r, { a: ab.a, b: ab.b, theta: c.v, sides: sides }), ratio = { fn: c.fn, num: c.top, den: c.bot };
    var sol = br([triSVG(null, { a: ab.a, b: ab.b, theta: c.v, sides: sides, roles: [sd[0], sd[1]], width: 220 })].concat(angleLines(c), o.single ? [] : ['Other acute angle: ' + t('90^\\circ-' + dg(rd(c.th, 0)) + '=' + dg(90 - rd(c.th, 0)))]));
    var hints = ['Label the two sides you know from θ. Which ratio uses them?', 'Use the inverse key: 2nd then sin, cos or tan.'];
    if (o.single) return angPart('Find θ, to the nearest degree.' + svg, c.th, { ratio: ratio, sol: sol, hints: hints, text: o.text || 'angle from two sides' });
    return fieldsPart('Find θ to the nearest degree. Then find the other acute angle of the triangle.' + svg, [angFld('θ =', c.th, { name: 'θ', ratio: ratio }), otherFld('Other acute angle:', c.th)], sol,
      hints.concat(['The two acute angles add to 90°.']), o.text || 'angle from two sides + the other angle');
  }
  /* ---- which tool? (multiple choice of the three ratios and Pythagoras) ---- */
  function toolMCPart(r, o) {
    o = o || {};
    var want = r.pick(['sin', 'cos', 'tan', 'pyth', 'sin', 'cos', 'tan']), prompt, sol;
    if (want === 'pyth') {
      var tr = triple(r, 60), lg = r.chance(0.5), u = r.pick(UNITS), sides = lg ? { a: lab(tr[0], u), c: lab(tr[2], u), b: 'x' } : { a: lab(tr[0], u), b: lab(tr[1], u), c: 'x' };
      prompt = 'Which would you use to find ' + t('x') + '? (Do not solve.)' + triSVG(r, { a: tr[0], b: tr[1], sides: sides, unknown: lg ? 'b' : 'c' });
      sol = 'Two sides are known, a third side is wanted, and no angle is given (except the right angle): the <b>Pythagorean theorem</b>.';
    } else {
      var cs = r.pick(CASES.mul.concat(CASES.div).filter(function (c) { return c.fn === want; })), deg = find(function () { return r.int(15, 75); }, function (x) { return x !== 45; }), u2 = r.pick(UNITS), k = pickR(r, LEN[u2]), s = sidesFrom(deg, cs.know, k), th = r.chance(0.5) ? 'A' : 'B', ab = abc(th, s), R = letters(th), sd = {};
      sd[R[cs.know] || 'c'] = lab(k, u2); sd[R[cs.want] || 'c'] = 'x';
      prompt = 'Which would you use to find ' + t('x') + '? (Do not solve.)' + triSVG(r, { a: ab.a, b: ab.b, theta: th, thetaLabel: deg + '°', sides: sd, unknown: R[cs.want] || 'c' });
      sol = 'From the ' + deg + '° angle: you know the <b>' + cs.know + '</b> and want the <b>' + cs.want + '</b>. Those two go together in ' + MN[want] + ': ' + t('\\' + want + '\\theta=\\dfrac{\\text{' + SIDES[want][0] + '}}{\\text{' + SIDES[want][1] + '}}') + '.';
    }
    return G.P.ratioMC(r, prompt, want, { sol: sol, hints: ['Is an angle given (other than the right angle)? If not, use Pythagoras.', 'Label the side you know and the side you want from the angle: SOH CAH TOA.'], text: o.text || 'which tool' });
  }
  /* ---- which equation gives x? (unknown on the bottom; multiple choice) ---- */
  function eqnMCPart(r, o) {
    o = o || {};
    var cs = r.pick(CASES.div), deg = find(function () { return r.int(18, 72); }, function (x) { return x !== 45; }), u = r.pick(['m', 'cm', 'ft']), k = pickR(r, LEN[u]), s = sidesFrom(deg, cs.know, k), F = fnT(cs.fn, deg);
    var wantTxt = cs.want === 'hyp' ? 'the hypotenuse' : 'the side adjacent to the ' + deg + '° angle', knowTxt = cs.know === 'opp' ? 'the side opposite it' : 'the side adjacent to it';
    var other = cs.fn === 'tan' ? 'sin' : cs.fn === 'sin' ? 'cos' : 'sin';
    var opts = [{ html: t('x=' + N(k) + '\\div ' + F), right: true },
      { html: t('x=' + N(k) + '\\times ' + F), why: 'x is on the <b>bottom</b> of ' + t('\\' + cs.fn + ' ' + dg(deg) + '=\\dfrac{' + N(k) + '}{x}') + ', so divide. (Multiplying gives ' + fx(k * TRG[cs.fn](deg), 1) + ' ' + u + (cs.want === 'hyp' ? ', shorter than the leg.)' : '.)'), code: 'mul' },
      { html: t('x=' + N(k) + '\\div ' + fnT(other, deg)), why: 'Label the sides from the ' + deg + '° angle: you know the ' + cs.know + ' and want the ' + cs.want + ': ' + MN[cs.fn] + ', not ' + other + '.', code: 'ratio' },
      { html: t('x=' + F + '\\div ' + N(k)), why: 'Upside down: x = ' + N(k) + ' ÷ ' + cs.fn + ' ' + deg + '°, not ' + cs.fn + ' ' + deg + '° ÷ ' + N(k) + '.', code: 'upside' }];
    return P.mc(r, 'A right triangle has a ' + D(deg) + ' angle, and ' + knowTxt + ' is ' + L(k, u) + '. Which equation gives ' + wantTxt + ', ' + t('x') + '?', opts,
      br(['From the ' + deg + '° angle: the ' + L(k, u) + ' side is the <b>' + cs.know + '</b> and x is the <b>' + cs.want + '</b>: ' + MN[cs.fn] + '.', t(F + '=\\dfrac{' + N(k) + '}{x}') + ': x is on the bottom, so divide: ' + t('x=' + N(k) + '\\div ' + F + toN(s[cs.want], 1) + uT(u)) + '.']),
      ['Sketch the triangle and label the sides from the angle.', 'If x ends up on the bottom of the ratio, you divide.'], o.text || 'which equation (unknown on the bottom)');
  }
  /* ---- elevation with the eye (or instrument) height ---- */
  var EYE_CTX = [['tree', 'a spruce tree', 'the tree'], ['building', 'an office building', 'the building'], ['tower', 'a cell tower', 'the tower'], ['flag', 'a flagpole', 'the flagpole'], ['building', 'a grain elevator', 'the grain elevator'], ['tree', 'a poplar tree', 'the tree']];
  function eyeShared(r) {
    return find(function () {
      var c = r.pick(EYE_CTX), d = pickR(r, [12, 60, 1]), th = r.int(20, 62), inst = r.chance(0.35), e = inst ? r.pick([1.2, 1.4, 1.5, 1.6]) : pickR(r, [1.4, 1.8, 0.1]), p = person(r);
      return { c: c, d: d, th: th, e: e, inst: inst, p: p, top: d * TRG.tan(th), h: d * TRG.tan(th) + e };
    }, function (s) { return s.th !== 45 && safe(s.h, 1) && s.top > 4; });
  }
  function elevEyePart(r, o) {
    o = o || {};
    var s = eyeShared(r), who = s.inst ? 'A surveyor sets up her instrument ' + L(s.d, 'm') + ' from the base of ' + s.c[1] + '. The instrument is ' + L(s.e, 'm') + ' above the ground' : s.p.n + ' stands ' + L(s.d, 'm') + ' from the base of ' + s.c[1] + '. ' + cap(s.p.his) + ' eyes are ' + L(s.e, 'm') + ' above the ground';
    var svg = G.elevationSVG({ angle: s.th, dist: s.d, eye: s.e, target: s.c[0], labels: { angle: s.th + '°', dist: lab(s.d, 'm'), eye: lab(s.e, 'm'), height: false }, width: 330 });
    var alts = [{ v: s.top, code: 'u7t-no-eye', hint: 'That is only the part above ' + (s.inst ? 'the instrument' : 'the eyes') + '. Add the ' + L(s.e, 'm') + '.' }, { v: s.top - s.e, code: 'u7t-eye-sub', hint: 'The eyes are <b>above</b> the ground, so <b>add</b> the eye height.' },
      { v: s.d * Math.tan(s.th) + s.e, code: 'u7t-rad', hint: G.RAD_HINT }, { v: s.d / TRG.tan(s.th) + s.e, code: 'u7t-mul-div', hint: 'The unknown (opp) is on <b>top</b> of ' + t('\\tan ' + dg(s.th) + '=\\dfrac{\\text{opp}}{' + N(s.d) + '}') + ': multiply.' },
      { v: s.d * TRG.sin(s.th) + s.e, code: 'u7t-ratio', hint: 'You know the adj (the distance along the ground) and want the opp: TOA.' }, { v: s.d * TRG.cos(s.th) + s.e, code: 'u7t-ratio', hint: 'You know the adj and want the opp: TOA.' }];
    return lenPart(who + '. The angle of elevation to the top of ' + s.c[2] + ' is ' + D(s.th) + '. How tall is ' + s.c[2] + ', to the nearest tenth of a metre?' + svg, s.h, { unit: 'm', radTrap: false, alts: alts,
      sol: br(['From the ' + (s.inst ? 'instrument' : 'eyes') + ': the adj is ' + L(s.d, 'm') + ' and the part above eye level is the opp: TOA.', t('\\text{opp}=' + N(s.d) + '\\times\\tan ' + dg(s.th) + toN(s.top, 2) + '\\text{ m}'), 'Add the ' + (s.inst ? 'instrument' : 'eye') + ' height: ' + t(rawN(s.top, 2) + '+' + N(s.e) + toN(s.h, 1) + '\\text{ m}'), cap(s.c[2]) + ' is about ' + t(fx(s.h, 1) + '\\text{ m}') + ' tall.']),
      hints: ['The right triangle starts at eye level, not at the ground.', 'Find the opp with tan, then add the eye height.'], text: o.text || 'elevation + eye height' });
  }
  /* ---- a side in a story (the unknown on top) ---- */
  function trigCtxPart(r, o) {
    o = o || {};
    var k = r.int(0, 5), p = person(r), c, prompt, dp = 1, fig;
    if (k === 0) { c = { fn: 'sin', know: 'hyp', want: 'opp', deg: r.int(64, 78), k: pickR(r, [4, 8, 0.5]), u: 'm' }; prompt = p.n + ' leans a ' + L(c.k, 'm') + ' ladder against a wall. It makes an angle of ' + D(c.deg) + ' with the level ground. How high up the wall does it reach, to the nearest tenth of a metre?'; }
    else if (k === 1) { c = { fn: 'cos', know: 'hyp', want: 'adj', deg: r.int(52, 70), k: pickR(r, [18, 40, 1]), u: 'm' }; prompt = 'A guy wire ' + L(c.k, 'm') + ' long runs from the top of a radio tower to an anchor in the ground. It makes an angle of ' + D(c.deg) + ' with the ground. How far is the anchor from the base of the tower, to the nearest tenth of a metre?'; }
    else if (k === 2) { c = { fn: 'sin', know: 'hyp', want: 'opp', deg: r.int(25, 40), k: pickR(r, [12, 20, 1]), u: 'm' }; prompt = 'A farmer sets a ' + L(c.k, 'm') + ' grain auger against a bin. The auger makes an angle of ' + D(c.deg) + ' with the ground, and its top end rests on the top of the bin. How tall is the bin, to the nearest tenth of a metre?'; }
    else if (k === 3) { c = { fn: 'cos', know: 'hyp', want: 'adj', deg: r.int(14, 28), k: 10 * r.int(50, 120), u: 'm' }; dp = 0; prompt = 'A straight ski run is ' + L(c.k, 'm') + ' long and slopes down at ' + D(c.deg) + ' from the horizontal. What horizontal distance does it cover, to the nearest metre?'; }
    else if (k === 4) { c = { fn: 'tan', know: 'adj', want: 'opp', deg: r.int(35, 65), k: pickR(r, [20, 45, 1]), u: 'm' }; prompt = p.n + ' flies a kite. The kite is right above a fence post that is ' + L(c.k, 'm') + ' from ' + p.him + ', measured along the ground, and the angle up to the kite is ' + D(c.deg) + '. How high is the kite above the ground? (Ignore ' + p.his + ' height.) Round to the nearest tenth of a metre.'; }
    else { c = { fn: 'sin', know: 'hyp', want: 'opp', deg: r.pick([3, 4, 4.5]), k: pickR(r, [5, 9, 0.5]), u: 'm' }; dp = 2; prompt = 'A wheelchair ramp is ' + L(c.k, 'm') + ' long and rises at an angle of ' + D(c.deg) + '. How high does it rise, to the nearest hundredth of a metre?'; }
    c.op = 'mul'; c.s = sidesFrom(c.deg, c.know, c.k); c.x = c.s[c.want];
    if (!safe(c.x, dp)) return trigCtxPart(r, o);
    var ab = abc('A', c.s), R = letters('A'), sd = {}; sd[R[c.know] || 'c'] = lab(c.k, c.u); sd[R[c.want] || 'c'] = 'x';
    fig = triSVG(null, { a: ab.a, b: ab.b, theta: 'A', thetaLabel: c.deg + '°', sides: sd, roles: [c.know, c.want], unknown: R[c.want] || 'c', width: 220 });
    return lenPart(prompt, c.x, Object.assign(trigOpts(c, { dp: dp }), { sol: br([fig].concat(trigLines(c, dp))), hints: ['Sketch the right triangle. Label the side you know and the side you want from the angle.', 'SOH CAH TOA: which ratio uses those two sides?'], text: o.text || 'trig story: unknown on top' }));
  }
  /* ---- an angle in a story ---- */
  function angleCtxPart(r, o) {
    o = o || {};
    var k = r.int(0, 5), p = person(r), c = null, prompt, dp = 0, what = 'θ';
    if (k === 0) { c = { fn: 'tan', top: pickR(r, [0.3, 0.75, 0.05]), bot: pickR(r, [4.5, 9, 0.1]) }; dp = 1; prompt = 'A wheelchair ramp rises ' + L(c.top, 'm') + ' over a horizontal distance of ' + L(c.bot, 'm') + '. Find the angle between the ramp and the ground, to the nearest tenth of a degree.'; }
    else if (k === 1) { c = { fn: 'tan', top: pickR(r, [1.5, 4, 0.5]), bot: pickR(r, [4, 8, 0.5]) }; prompt = 'A shed roof rises ' + L(c.top, 'm') + ' over a horizontal run of ' + L(c.bot, 'm') + '. Find the angle of the roof, to the nearest degree.'; }
    else if (k === 2) { c = { fn: 'cos', top: pickR(r, [1.2, 2.6, 0.1]), bot: pickR(r, [5, 9, 0.1]) }; prompt = p.n + ' leans a ' + L(c.bot, 'm') + ' ladder against a house. The foot of the ladder is ' + L(c.top, 'm') + ' from the wall. What angle does the ladder make with the ground, to the nearest degree?'; }
    else if (k === 3) { c = { fn: 'sin', top: pickR(r, [8, 25, 1]), bot: 10 * r.int(8, 25) }; prompt = 'A zipline cable is ' + L(c.bot, 'm') + ' long. The bottom end is ' + L(c.top, 'm') + ' lower than the top end. Find the angle of depression of the cable at the top, to the nearest degree. (Treat the cable as straight.)'; what = 'the angle of depression'; }
    else if (k === 4) { c = { fn: 'cos', top: pickR(r, [20, 40, 1]), bot: pickR(r, [42, 70, 1]) }; prompt = p.n + ' flies a kite on a ' + L(c.bot, 'm') + ' string. The kite is right above a point on the ground ' + L(c.top, 'm') + ' from ' + p.him + '. Find the angle between the string and the ground, to the nearest degree.'; }
    else { c = { fn: 'sin', top: pickR(r, [0.2, 0.6, 0.05]), bot: pickR(r, [2.4, 4, 0.1]) }; dp = 1; prompt = 'A ramp into a moving truck is ' + L(c.bot, 'm') + ' long and rises ' + L(c.top, 'm') + '. Find the angle between the ramp and the ground, to the nearest tenth of a degree.'; }
    var th = INV[c.fn](c.top / c.bot);
    if (!(th > 2 && th < 85 && Math.abs(th - 45) > 1.5 && safe(th, dp))) return angleCtxPart(r, o);
    var sd = SIDES[c.fn], s = {}; s[sd[0]] = c.top; s[sd[1]] = c.bot; if (!s.hyp) s.hyp = Math.sqrt(c.top * c.top + c.bot * c.bot); if (!s.adj) s.adj = Math.sqrt(s.hyp * s.hyp - s.opp * s.opp); if (!s.opp) s.opp = Math.sqrt(s.hyp * s.hyp - s.adj * s.adj);
    var ab = abc('A', s), R = letters('A'), lb = {}; lb[R[sd[0]] || 'c'] = lab(c.top, 'm'); lb[R[sd[1]] || 'c'] = lab(c.bot, 'm');
    var fig = triSVG(null, { a: ab.a, b: ab.b, theta: 'A', sides: lb, roles: [sd[0], sd[1]], width: 220 });
    return angPart(prompt, th, { dp: dp, ratio: { fn: c.fn, num: c.top, den: c.bot }, sol: br([fig, 'We have the <b>' + sd[0] + '</b> and the <b>' + sd[1] + '</b>: ' + MN[c.fn] + '.', t('\\theta=\\' + c.fn + '^{-1}\\!\\left(' + fracT(N(c.top), N(c.bot)) + '\\right)' + toN(th, dp) + '^\\circ') + (what !== 'θ' ? ' (' + what + ')' : '')]),
      hints: ['Sketch it: which two sides do you know, from the angle you want?', 'Use the inverse key: 2nd then sin, cos or tan.'], text: o.text || 'angle story (' + c.fn + '⁻¹)' });
  }
  /* ---- solve a triangle from an angle and the hypotenuse ---- */
  function solveAHPart(r, o) {
    o = o || {};
    var s = find(function () { var u = r.pick(UNITS), a = r.int(20, 70), c = pickR(r, [LEN[u][0] + 4, LEN[u][1] + 6, LEN[u][2]]); return { u: u, A: a, c: c, a: c * TRG.sin(a), b: c * TRG.cos(a) }; }, function (s) { return s.A !== 45 && safe(s.a, 1) && safe(s.b, 1); });
    var svg = triSVG(r, { a: s.a, b: s.b, names: ['A', 'B', 'C'], theta: 'A', thetaLabel: s.A + '°', sides: { c: lab(s.c, s.u), a: 'a', b: 'b' } });
    var specs = [fld(t('\\angle B') + ' =', 90 - s.A, { after: '°', name: '∠B', diag: [{ v: 180 - s.A, code: 'u7t-180-angle', hint: 'The two acute angles add to <b>90°</b>.' }] }),
      lenFld(t('a') + ' =', s.a, { unit: s.u, name: 'a', trig: { fn: 'sin', deg: s.A, side: s.c, op: 'mul' } }),
      lenFld(t('b') + ' =', s.b, { unit: s.u, name: 'b', trig: { fn: 'cos', deg: s.A, side: s.c, op: 'mul' } })];
    return fieldsPart('In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('\\angle A=' + dg(s.A)) + ' and the hypotenuse ' + t('c=' + N(s.c)) + ' ' + s.u + '. Solve the triangle: find ' + t('\\angle B') + ', ' + t('a') + ' and ' + t('b') + ' (to the nearest tenth).' + svg, specs,
      br([t('\\angle B=90^\\circ-' + dg(s.A) + '=' + dg(90 - s.A)), 'For ∠A: a is opp, b is adj, c is hyp.', t('a=' + N(s.c) + '\\times\\sin ' + dg(s.A) + toN(s.a, 1)) + ' ' + s.u + ' (SOH)', t('b=' + N(s.c) + '\\times\\cos ' + dg(s.A) + toN(s.b, 1)) + ' ' + s.u + ' (CAH)',
        'Check with Pythagoras: ' + t(rawN(s.a, 3) + '^2+' + rawN(s.b, 3) + '^2\\approx ' + N(q(s.c * s.c)) + '=' + N(s.c) + '^2') + ' ✓']),
      ['The acute angles add to 90°.', 'From ∠A: a is opp and b is adj. Use SOH and CAH with the hypotenuse.'], o.text || 'solve a triangle (angle + hyp)');
  }
  Object.assign(A, { ratioTri: ratioTri, ratioSVG: ratioSVG, labelPart: labelPart, ratioDecPart: ratioDecPart, CASES: CASES, trigShared: trigShared, trigLines: trigLines, trigOpts: trigOpts, trigSidePart: trigSidePart,
    angleShared: angleShared, angleLines: angleLines, anglePart: anglePart, toolMCPart: toolMCPart, eqnMCPart: eqnMCPart, eyeShared: eyeShared, elevEyePart: elevEyePart, trigCtxPart: trigCtxPart, angleCtxPart: angleCtxPart, solveAHPart: solveAHPart });

  /* ======================================================================================================
   * A1 — the unknown on the bottom, rearranged formulas
   * ====================================================================================================== */
  /* ---- a ground distance from an angle of depression (÷ tan) ---- */
  var DEP_CTX = [['A ranger in a fire lookout tower in the foothills is', 'above the ground. She sees a deer', 'building', 'stick', 'the deer', 'from the base of the tower'],
    ['A worker on the walkway of a water tower is', 'above the ground. He sees a lost dog', 'building', 'stick', 'the dog', 'from the base of the tower'],
    ['A lighthouse keeper’s window is', 'above the water. She sees a boat', 'lighthouse', 'boat', 'the boat', 'from the base of the lighthouse'],
    ['A lookout on top of a cliff at Waterton Lake is', 'above the water. He sees a canoe', 'cliff', 'boat', 'the canoe', 'from the bottom of the cliff'],
    ['From the roof of an apartment building, Ines is', 'above the street. She sees a parked car', 'building', 'stick', 'the car', 'from the base of the building']];
  function depressionPart(r, o) {
    o = o || {};
    var s = find(function () { var c = r.pick(DEP_CTX), h = pickR(r, [18, 60, 1]), th = r.int(6, 38); return { c: c, h: h, th: th, d: h / TRG.tan(th) }; }, function (s) { return safe(s.d, s.d >= 100 ? 0 : 1); }), dp = s.d >= 100 ? 0 : 1;
    var svg = G.elevationSVG({ kind: 'depression', observer: s.c[2], target: s.c[3], angle: s.th, labels: { angle: s.th + '°', dist: 'd', height: lab(s.h, 'm') }, alt: false, width: 330 });
    var c = { fn: 'tan', know: 'opp', want: 'adj', op: 'div', deg: s.th, k: s.h, u: 'm', x: s.d };
    return lenPart(s.c[0] + ' ' + L(s.h, 'm') + ' ' + s.c[1] + ' at an angle of depression of ' + D(s.th) + '. How far is ' + s.c[4] + ' ' + s.c[5] + '? (The ' + (/water/.test(s.c[1]) ? 'water' : 'ground') + ' is level.) Round to the nearest ' + (dp ? 'tenth of a metre.' : 'metre.') + svg, s.d, Object.assign(trigOpts(c, { dp: dp }), {
      sol: br(['The angle of elevation from ' + s.c[4] + ' up to the observer is also ' + D(s.th) + ' (alternate interior angles: the two horizontal lines are parallel).', 'In that triangle, ' + L(s.h, 'm') + ' is the <b>opp</b> and d is the <b>adj</b>: TOA.',
        t('\\tan ' + dg(s.th) + '=\\dfrac{' + N(s.h) + '}{d}') + ': d is on the bottom, so divide.', t('d=' + N(s.h) + '\\div\\tan ' + dg(s.th) + toN(s.d, dp) + '\\text{ m}'), 'Check: a small angle of depression means the object is far away ✓']),
      hints: ['The angle of depression from the top equals the angle of elevation from the bottom.', 'The height is opp and the distance is adj. Is d on the top or the bottom of the ratio?'], text: o.text || 'depression: distance (÷ tan)' }));
  }
  /* ---- a hypotenuse (or adj) in a story: the unknown on the bottom ---- */
  function hypCtxPart(r, o) {
    o = o || {};
    var k = r.int(0, 5), p = person(r), c, prompt, dp = 1;
    if (k === 0) { c = { fn: 'sin', know: 'opp', want: 'hyp', deg: r.int(20, 32), k: pickR(r, [4, 9, 0.5]) }; prompt = 'A conveyor belt at a gravel pit lifts gravel to the top of a pile ' + L(c.k, 'm') + ' high. The belt makes an angle of ' + D(c.deg) + ' with the ground. How long is the belt, from the ground to the top of the pile? Round to the nearest tenth of a metre.'; }
    else if (k === 1) { c = { fn: 'sin', know: 'opp', want: 'hyp', deg: r.int(35, 55), k: pickR(r, [1.8, 3, 0.1]) }; prompt = 'A rope runs from the top of a ' + L(c.k, 'm') + ' tent pole to a peg in the ground and makes an angle of ' + D(c.deg) + ' with the ground. How long is the rope, to the nearest tenth of a metre?'; }
    else if (k === 2) { c = { fn: 'sin', know: 'opp', want: 'hyp', deg: r.int(6, 12), k: pickR(r, [1.2, 2.4, 0.1]) }; prompt = 'A boat-launch ramp rises ' + L(c.k, 'm') + ' from the water to the parking lot. It makes an angle of ' + D(c.deg) + ' with the horizontal. How long is the ramp surface, to the nearest tenth of a metre?'; }
    else if (k === 3) { c = { fn: 'cos', know: 'adj', want: 'hyp', deg: r.int(38, 60), k: pickR(r, [20, 45, 1]) }; prompt = p.n + ' flies a kite on a straight string that makes an angle of ' + D(c.deg) + ' with the ground. The kite is right above a fence post ' + L(c.k, 'm') + ' from ' + p.him + ', measured along the ground. How long is the string, to the nearest tenth of a metre? (Ignore ' + p.his + ' height.)'; }
    else if (k === 4) { c = { fn: 'cos', know: 'adj', want: 'hyp', deg: r.int(16, 28), k: 10 * r.int(60, 140) }; dp = 0; prompt = 'A chairlift cable runs in a straight line up a ski hill at ' + D(c.deg) + ' to the horizontal. On a map, the horizontal distance from the bottom station to the top station is ' + L(c.k, 'm') + '. How long is the cable, to the nearest metre?'; }
    else { c = { fn: 'sin', know: 'opp', want: 'hyp', deg: r.int(55, 68), k: pickR(r, [18, 40, 1]) }; prompt = 'A guy wire runs from a point ' + L(c.k, 'm') + ' up a radio tower to an anchor in the ground. The wire makes an angle of ' + D(c.deg) + ' with the ground. How long is the wire, to the nearest tenth of a metre?'; }
    c.op = 'div'; c.u = 'm'; c.s = sidesFrom(c.deg, c.know, c.k); c.x = c.s[c.want];
    if (!safe(c.x, dp)) return hypCtxPart(r, o);
    var ab = abc('A', c.s), R = letters('A'), sd = {}; sd[R[c.know] || 'c'] = lab(c.k, 'm'); sd[R[c.want] || 'c'] = 'x';
    var fig = triSVG(null, { a: ab.a, b: ab.b, theta: 'A', thetaLabel: c.deg + '°', sides: sd, roles: [c.know, c.want], unknown: R[c.want] || 'c', width: 220 });
    return lenPart(prompt, c.x, Object.assign(trigOpts(c, { dp: dp }), { sol: br([fig].concat(trigLines(c, dp))), hints: ['Sketch the right triangle and label the side you know and the side you want.', 'If x ends up on the bottom of the ratio, divide.'], text: o.text || 'story: unknown on the bottom (' + c.fn + ')' }));
  }
  /* ---- a screen: (a) the rearranged formula (multiple choice), (b) the length from it ---- */
  var SCREENS = [['TV', 'in', [32, 40, 43, 50, 55, 65, 70, 75, 85], '-inch TV'], ['computer monitor', 'in', [22, 24, 27, 32, 34], '-inch monitor'], ['laptop', 'in', [13.3, 14, 15.6, 17.3], '-inch laptop']];
  function tvShared(r) {
    var sc = r.pick(SCREENS), d = r.pick(sc[2]), wantH = r.chance(0.6), w0 = d * 16 / Math.sqrt(337), h0 = d * 9 / Math.sqrt(337), given = rd(wantH ? w0 : h0, 1), x = Math.sqrt(d * d - given * given);
    if (!safe(x, 1)) return tvShared(r);
    return { sc: sc, d: d, wantH: wantH, given: given, x: x, w: wantH ? 'h' : 'w', o: wantH ? 'w' : 'h' };
  }
  function tvStem(s) { return 'The size of a ' + s.sc[0] + ' is the length of its diagonal, ' + t('d') + '. A screen with width ' + t('w') + ' and height ' + t('h') + ' has ' + t('w^2+h^2=d^2') + ' (the diagonal is the hypotenuse). ' + (s.sc[0] === 'TV' ? 'Amara is shopping for a ' : 'Kai is shopping for a ') + N(s.d) + s.sc[3] + ' (' + t('d=' + N(s.d)) + ' in).'; }
  function tvFormulaPart(r, s) {
    var X = s.w, Y = s.o;
    var opts = [{ html: t(X + '=\\sqrt{d^2-' + Y + '^2}'), right: true },
      { html: t(X + '=\\sqrt{d^2+' + Y + '^2}'), why: 'Adding the squares gives a length <b>longer</b> than the diagonal. To find a leg, subtract: ' + t(X + '^2=d^2-' + Y + '^2') + '.', code: 'add' },
      { html: t(X + '=d-' + Y), why: 'The theorem is about the <b>squares</b> of the sides. Subtract the squares, then take the square root.', code: 'nosq' },
      { html: t(X + '=d^2-' + Y + '^2'), why: 'That gives ' + t(X + '^2') + '. Take the square root to get ' + t(X) + '.', code: 'noroot' },
      { html: t(X + '=\\sqrt{' + Y + '^2-d^2}'), why: 'Big square minus small square: the diagonal (the hypotenuse) is the longest side, so ' + t('d^2') + ' comes first.', code: 'order' }];
    return P.mc(r, 'Rearrange ' + t('w^2+h^2=d^2') + ' to find the ' + (s.wantH ? 'height' : 'width') + ' ' + t(X) + '. Which formula is right?', opts,
      br([t('w^2+h^2=d^2'), 'Subtract ' + t(Y + '^2') + ' from both sides: ' + t(X + '^2=d^2-' + Y + '^2'), 'Take the square root of both sides: ' + t(X + '=\\sqrt{d^2-' + Y + '^2}')]),
      ['Get ' + t(X + '^2') + ' by itself first: undo the ' + t('+' + Y + '^2') + '.', 'Then undo the square with a square root.'], 'rearrange the screen formula');
  }
  function tvValuePart(r, s) {
    var X = s.w, Y = s.o;
    return lenPart('The ' + N(s.d) + s.sc[3] + ' is ' + L(s.given, 'in') + ' ' + (s.wantH ? 'wide' : 'high') + '. Use your formula to find its ' + (s.wantH ? 'height' : 'width') + ', to the nearest tenth of an inch.', s.x, { unit: 'in', pyth: { hyp: s.d, leg: s.given },
      sol: br([t(X + '=\\sqrt{d^2-' + Y + '^2}=\\sqrt{' + N(s.d) + '^2-' + N(s.given) + '^2}=\\sqrt{' + N(q(s.d * s.d)) + '-' + N(q(s.given * s.given)) + '}=\\sqrt{' + N(q(s.d * s.d - s.given * s.given)) + '}' + toN(s.x, 1) + '\\text{ in}'), 'Check: shorter than the diagonal ✓']),
      hints: ['Put the numbers into ' + t(X + '=\\sqrt{d^2-' + Y + '^2}') + '.', 'Square, subtract, then take the square root.'], text: 'screen: the length from the formula' });
  }
  Object.assign(A, { depressionPart: depressionPart, hypCtxPart: hypCtxPart, tvShared: tvShared, tvStem: tvStem, tvFormulaPart: tvFormulaPart, tvValuePart: tvValuePart });

  /* ======================================================================================================
   * Mastery — two steps, two triangles, three dimensions
   * ====================================================================================================== */
  /* ---- a pole held by two ropes: the height, then the second stake ---- */
  function poleSVG(s) {
    var fg = new Fig(), sc = 230 / Math.max(s.d1 + s.x, s.h * 1.25), H = s.h * sc, x1 = -s.d1 * sc, x2 = s.x * sc, T = [0, -H];
    fg.line([x1 - 18, 0], [x2 + 18, 0], { width: 2, color: GREY });
    fg.line([0, 0], T, { width: 4, color: '#7a5a2a' }).line(T, [x1, 0], { width: 2.2 }).line(T, [x2, 0], { width: 2.2 }).dot([x1, 0]).dot([x2, 0]);
    fg.arc([0, 0], 90, 180, { right: true }).arc([0, 0], 0, 90, { right: true });
    fg.side(T, [x1, 0], [0, 0], s.lab1).side(T, [x2, 0], [0, 0], s.lab2);
    fg.text(x1 / 2, 16, s.labd1, { size: 15 }).text(x2 / 2, 16, 'x', { size: 15, color: RED });
    fg.text(12, -H / 2, 'h', { size: 15, anchor: 'start' });
    return fg.svg({ width: 330, aria: 'a pole held by two ropes' });
  }
  var POLES = [['A flagpole is held straight up by two ropes, one on each side', 'flagpole'], ['A tent’s centre pole is held up by two ropes, one on each side', 'pole'], ['A new tree is held straight by two guy ropes on opposite sides', 'tree’s stake'], ['A radio mast is held up by two guy wires on opposite sides', 'mast']];
  function poleShared(r) {
    return find(function () { var c = r.pick(POLES), L1 = pickR(r, [5, 12, 0.1]), d1 = pickR(r, [1.8, 5, 0.1]), h = Math.sqrt(L1 * L1 - d1 * d1), L2 = q(rd(h + pickR(r, [1.5, 5, 0.1]), 1)), x = Math.sqrt(L2 * L2 - h * h); return { c: c, L1: L1, d1: d1, h: h, L2: L2, x: x }; },
      function (s) { return s.d1 < s.L1 * 0.6 && safe(s.h, 1) && safe(s.x, 1) && s.x > 1.5 && s.x < s.h * 1.8; });
  }
  function polePart(r, o) {
    o = o || {};
    var s = poleShared(r), early = Math.sqrt(s.L2 * s.L2 - rd(s.h, 1) * rd(s.h, 1));
    var svg = poleSVG({ d1: s.d1, x: s.x, h: s.h, lab1: lab(s.L1, 'm'), lab2: lab(s.L2, 'm'), labd1: lab(s.d1, 'm') });
    var alts = Math.abs(rd(early, 1) - rd(s.x, 1)) > 1e-9 ? [{ v: early, code: 'u7t-early', hint: 'Close! Keep the <b>full</b> value of h (' + rawN(s.h, 3) + '), not the rounded ' + fx(s.h, 1) + ', when you use it again.' }] : [];
    var specs = [lenFld('Height ' + t('h') + ' =', s.h, { unit: 'm', name: 'h', pyth: { hyp: s.L1, leg: s.d1 } }), lenFld('Distance ' + t('x') + ' =', s.x, { unit: 'm', name: 'x', pyth: { hyp: s.L2, leg: s.h }, alts: alts })];
    return fieldsPart(s.c[0] + '. The left rope is ' + L(s.L1, 'm') + ' long and is staked ' + L(s.d1, 'm') + ' from the bottom of the ' + s.c[1] + '. The right rope is ' + L(s.L2, 'm') + ' long. Both ropes are tied at the same point at the top. (a) How high is that point, ' + t('h') + '? (b) How far from the bottom of the ' + s.c[1] + ' is the right rope staked, ' + t('x') + '? Round each to the nearest tenth of a metre, but keep the full value of ' + t('h') + ' for (b).' + svg, specs,
      br(['(a) The left rope is the hypotenuse: ' + t('h^2=' + N(s.L1) + '^2-' + N(s.d1) + '^2=' + N(q(s.L1 * s.L1)) + '-' + N(q(s.d1 * s.d1)) + '=' + N(q(s.L1 * s.L1 - s.d1 * s.d1))) + ', ' + t('h=\\sqrt{' + N(q(s.L1 * s.L1 - s.d1 * s.d1)) + '}' + toN(s.h, 1) + '\\text{ m}'),
        '(b) The right rope is the hypotenuse of the other triangle, and h is a leg: ' + t('x^2=' + N(s.L2) + '^2-h^2=' + N(q(s.L2 * s.L2)) + '-' + N(q(s.L1 * s.L1 - s.d1 * s.d1)) + '=' + N(q(s.L2 * s.L2 - s.h * s.h))) + ' (use ' + t('h^2') + ' itself, not the rounded h)', t('x=\\sqrt{' + N(q(s.L2 * s.L2 - s.h * s.h)) + '}' + toN(s.x, 1) + '\\text{ m}')]),
      ['Solve the left triangle first: it has two sides you know.', 'Then h is a leg of the right triangle. Keep all the digits of h.'], o.text || 'two ropes: two steps of Pythagoras');
  }
  /* ---- a box: the floor diagonal, the longest diagonal, and does it fit? ---- */
  var BOXES = [['A car trunk is shaped like a box', 'm', [1.0, 1.3, 0.05], [0.7, 0.95, 0.05], [0.45, 0.65, 0.05], 'a hockey stick', 'the trunk'], ['A storage tote is a box', 'cm', [55, 80, 1], [35, 50, 1], [30, 45, 1], 'an umbrella', 'the tote'],
    ['A shipping box is', 'cm', [60, 95, 1], [40, 60, 1], [25, 45, 1], 'a curtain rod', 'the box'], ['The back of a cargo van is a box', 'm', [2.4, 3.2, 0.1], [1.4, 1.8, 0.1], [1.2, 1.6, 0.1], 'a length of pipe', 'the van']];
  function boxShared(r) {
    return find(function () {
      var b = r.pick(BOXES), l = pickR(r, b[2]), w = pickR(r, b[3]), h = pickR(r, b[4]), fd = Math.sqrt(l * l + w * w), sd = Math.sqrt(l * l + w * w + h * h), kind = r.pick(['flat', 'slant', 'slant', 'no']);
      var lo = kind === 'flat' ? Math.max(l, w) + (fd - Math.max(l, w)) * 0.3 : kind === 'slant' ? fd + (sd - fd) * 0.25 : sd * 1.03, hi = kind === 'flat' ? fd * 0.985 : kind === 'slant' ? sd * 0.985 : sd * 1.12;
      var dp = b[1] === 'm' ? 2 : 0, s = rd(lo + (hi - lo) * r.int(0, 10) / 10, dp);
      return { b: b, u: b[1], l: l, w: w, h: h, fd: fd, sd: sd, s: s, kind: kind, flat: s <= fd, fits: s <= sd };
    }, function (x) { var dp = x.u === 'm' ? 2 : 1; return safe(x.fd, dp) && safe(x.sd, dp) && Math.abs(x.s - x.fd) > (x.u === 'm' ? 0.015 : 1) && Math.abs(x.s - x.sd) > (x.u === 'm' ? 0.015 : 1) && x.s > Math.max(x.l, x.w); });
  }
  function trunkPart(r, o) {
    o = o || {};
    var s = boxShared(r), u = s.u, dp = u === 'm' ? 2 : 1, fd2 = q(s.l * s.l + s.w * s.w), word = dp === 2 ? 'hundredth' : 'tenth';
    var early = Math.sqrt(rd(s.fd, dp) * rd(s.fd, dp) + s.h * s.h), alts = [{ v: s.fd + s.h, code: 'u7t-add-sides', hint: 'Square the floor diagonal and the height, add, then take the square root.' }];
    if (Math.abs(rd(early, dp) - rd(s.sd, dp)) > 1e-9) alts.push({ v: early, code: 'u7t-early', hint: 'Close! Use the unrounded ' + t('d^2=' + N(fd2)) + ' for the floor diagonal, not the rounded diagonal squared.' });
    var specs = [lenFld('Floor diagonal:', s.fd, { dp: dp, unit: u, name: 'Floor diagonal', pyth: { legs: [s.l, s.w] } }), ynFld('Lies flat on the floor?', s.flat, { name: 'Flat', code: 'u7t-verdict', why: 'Compare the length of ' + s.b[5] + ' with the floor diagonal: it fits flat only if it is not longer.' }),
      lenFld('Longest diagonal:', s.sd, { dp: dp, unit: u, name: 'Longest diagonal', pyth: { legs: [s.fd, s.h] }, alts: alts }), ynFld('Fits on the slant?', s.fits, { name: 'Slant', code: 'u7t-verdict', why: 'Compare the length with the longest diagonal (bottom corner to the opposite top corner).' })];
    return fieldsPart(s.b[0] + ' ' + L(s.l, u) + ' long, ' + L(s.w, u) + ' wide and ' + L(s.h, u) + ' tall. Someone wants to fit ' + s.b[5] + ' ' + L(s.s, u) + ' long inside ' + s.b[6] + '. (a) Find the diagonal of the floor, to the nearest ' + word + '. Will it lie flat on the floor? (b) The longest straight line inside goes from a bottom corner to the opposite top corner: it is the hypotenuse of a right triangle whose legs are the floor diagonal and the height. Find it, to the nearest ' + word + '. Will it fit on that slant?', specs,
      br(['(a) ' + t('d=\\sqrt{' + N(s.l) + '^2+' + N(s.w) + '^2}=\\sqrt{' + N(q(s.l * s.l)) + '+' + N(q(s.w * s.w)) + '}=\\sqrt{' + N(fd2) + '}' + toN(s.fd, dp) + uT(u)) + '. ' + L(s.s, u) + (s.flat ? ' is not longer, so <b>yes</b>, it lies flat.' : ' is longer, so <b>no</b>, it will not lie flat.'),
        '(b) ' + t('\\sqrt{' + N(fd2) + '+' + N(s.h) + '^2}=\\sqrt{' + N(fd2) + '+' + N(q(s.h * s.h)) + '}=\\sqrt{' + N(q(fd2 + s.h * s.h)) + '}' + toN(s.sd, dp) + uT(u)) + ' (use ' + N(fd2) + ', the unrounded square). ' + (s.fits ? 'It is not longer than that, so <b>yes</b>, it fits on the slant.' : 'It is longer than that, so <b>no</b>, it does not fit.')]),
      ['The floor is a rectangle: its diagonal is the hypotenuse of a right triangle.', 'For the longest diagonal, the legs are the floor diagonal and the height.'], o.text || 'box: floor and longest diagonals');
  }
  /* ---- an antenna (flagpole, sign) from two angles of elevation ---- */
  function twoSightSVG(s) {
    var fg = new Fig(), sc = 250 / Math.max(s.d * 1.15, s.H2 * 1.1), X = s.d * sc, Y1 = -s.H1 * sc, Y2 = -s.H2 * sc, Pp = [0, 0], bw = Math.max(18, X * 0.12);
    fg.line([-14, 0], [X + bw + 14, 0], { width: 2, color: GREY });
    fg.poly([[X, 0], [X, Y1], [X + bw, Y1], [X + bw, 0]], { fill: '#eef1f6', stroke: INK, width: 2 });
    fg.line([X + 2, Y1], [X + 2, Y2], { width: 4, color: '#7a5a2a' });
    fg.line(Pp, [X, Y1], { width: 2 }).line(Pp, [X + 2, Y2], { width: 2, color: AMBER }).dot(Pp);
    var a1 = Math.atan2(s.H1, s.d) / RAD, a2 = Math.atan2(s.H2, s.d) / RAD;
    fg.arc(Pp, 0, a1, { r: 46, label: s.al + '°', labelR: 70 }).arc(Pp, 0, a2, { r: 88, label: s.be + '°', labelR: 104, color: AMBER });
    fg.arc([X, 0], 90, 180, { right: true });
    fg.text(X / 2, 16, s.d + ' m', { size: 15 }).text(X + 10, (Y1 + Y2) / 2, 'x', { size: 15, color: RED, anchor: 'start' }).text(X + bw / 2, Y1 / 2, s.what, { size: 12, weight: 600, color: GREY });
    return fg.svg({ width: 340, aria: 'two angles of elevation' });
  }
  var ON_TOP = [['An antenna stands on top of a hotel', 'the hotel', 'the antenna', 'hotel'], ['A flagpole stands on the roof of a school', 'the roof', 'the flagpole', 'school'], ['A sign stands on top of a grain elevator', 'the elevator', 'the sign', 'elevator'], ['A spire sits on top of a church tower', 'the tower', 'the spire', 'tower']];
  function antennaPart(r, o) {
    o = o || {};
    var s = find(function () { var c = r.pick(ON_TOP), d = pickR(r, [30, 80, 1]), al = r.int(22, 44), be = al + r.int(4, 10); return { c: c, d: d, al: al, be: be, H1: d * TRG.tan(al), H2: d * TRG.tan(be), x: d * (TRG.tan(be) - TRG.tan(al)) }; }, function (s) { return safe(s.x, 1) && s.x > 2; });
    var early = rd(s.H2, 1) - rd(s.H1, 1), alts = [{ v: s.H2, code: 'u7t-one-tri', hint: 'That is the height to the top of ' + s.c[2] + '. Subtract the height of ' + s.c[1] + ' (the other triangle).' }, { v: s.H1, code: 'u7t-one-tri', hint: 'That is the height of ' + s.c[1] + '. Find the height to the top of ' + s.c[2] + ' too, and subtract.' },
      { v: s.d * TRG.tan(s.be - s.al), code: 'u7t-angle-diff', hint: 'The ' + (s.be - s.al) + '° angle is not in a right triangle with the ' + s.d + ' m side. Find each height with its own angle, then subtract.' },
      { v: s.d * (Math.tan(s.be) - Math.tan(s.al)), code: 'u7t-rad', hint: G.RAD_HINT }, { v: Math.abs(s.d / TRG.tan(s.al) - s.d / TRG.tan(s.be)), code: 'u7t-mul-div', hint: 'The heights are on <b>top</b> of the tan ratio: multiply, ' + t(N(s.d) + '\\times\\tan') + '.' },
      { v: s.H1 + s.H2, code: 'u7t-sum-diff', hint: 'The two heights overlap: ' + s.c[2] + ' is the <b>difference</b> between them.' }];
    if (Math.abs(rd(early, 1) - rd(s.x, 1)) > 1e-9) alts.push({ v: early, code: 'u7t-early', hint: 'Close! Keep the full value of each height and round only at the end.' });
    var svg = twoSightSVG({ d: s.d, H1: s.H1, H2: s.H2, al: s.al, be: s.be, what: s.c[3] });
    return lenPart(s.c[0] + '. From a point on the ground ' + L(s.d, 'm') + ' from the building, the angle of elevation to the top of ' + s.c[1] + ' is ' + D(s.al) + ' and to the top of ' + s.c[2] + ' is ' + D(s.be) + '. How tall is ' + s.c[2] + ', to the nearest tenth of a metre?' + svg, s.x, { unit: 'm', radTrap: false, alts: alts,
      sol: br(['Two right triangles share the ' + L(s.d, 'm') + ' side (the adj in both): TOA.', 'To the top of ' + s.c[2] + ': ' + t(N(s.d) + '\\times\\tan ' + dg(s.be) + '=' + rawN(s.H2, 3)) + ' m', 'To the top of ' + s.c[1] + ': ' + t(N(s.d) + '\\times\\tan ' + dg(s.al) + '=' + rawN(s.H1, 3)) + ' m',
        cap(s.c[2]) + ': ' + t(rawN(s.H2, 3) + '-' + rawN(s.H1, 3) + toN(s.x, 1) + '\\text{ m}')]),
      hints: ['There are two right triangles. Both have the ' + s.d + ' m side as the adj.', 'Find both heights, then subtract.'], text: o.text || 'two angles of elevation: the difference' });
  }
  /* ---- solve a triangle from its two legs (sketch it) ---- */
  var TRI_NAMES = [['D', 'E', 'F'], ['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['J', 'K', 'L'], ['M', 'N', 'P'], ['G', 'H', 'K']];
  function solveLegsPart(r, o) {
    o = o || {};
    var s = find(function () { var u = r.pick(['m', 'cm', 'ft']), p = pickR(r, [LEN[u][0] + 2, LEN[u][1], LEN[u][2]]), e = pickR(r, [LEN[u][0] + 2, LEN[u][1], LEN[u][2]]); return { u: u, p: p, e: e, h: Math.sqrt(p * p + e * e), A: INV.tan(e / p), nm: r.pick(TRI_NAMES) }; },
      function (s) { return s.p !== s.e && Math.max(s.p, s.e) / Math.min(s.p, s.e) < 3 && safe(s.h, 1) && safe(s.A, 0) && safe(90 - s.A, 0) && Math.abs(s.A - 45) > 3; });
    var n = s.nm, X = n[0], Y = n[1], Z = n[2], XZ = X + Z, YZ = Y + Z, XY = X + Y;
    var specs = [lenFld(t(XY) + ' =', s.h, { unit: s.u, name: XY, pyth: { legs: [s.p, s.e] } }), angFld(t('\\angle ' + X) + ' =', s.A, { name: '∠' + X, ratio: { fn: 'tan', num: s.e, den: s.p } }), otherFld(t('\\angle ' + Y) + ' =', s.A, { name: '∠' + Y })];
    var fig = G.rightTriSVG({ a: s.e, b: s.p, names: n, sides: { a: lab(s.e, s.u), b: lab(s.p, s.u), c: XY }, theta: 'A', thetaLabel: ' ', roles: ['opp', 'adj'], width: 230 });
    return fieldsPart('In ' + t('\\triangle ' + X + Y + Z) + ', ' + t('\\angle ' + Z + '=90^\\circ') + ', ' + t(XZ + '=' + N(s.p)) + ' ' + s.u + ' and ' + t(YZ + '=' + N(s.e)) + ' ' + s.u + '. Sketch and label the triangle, then solve it: find ' + t(XY) + ' (nearest tenth), ' + t('\\angle ' + X) + ' and ' + t('\\angle ' + Y) + ' (nearest degree).', specs,
      br([fig, t(XY) + ' is the hypotenuse (across from the right angle at ' + Z + '): ' + t(XY + '=\\sqrt{' + N(s.p) + '^2+' + N(s.e) + '^2}=\\sqrt{' + N(q(s.p * s.p + s.e * s.e)) + '}' + toN(s.h, 1) + uT(s.u)),
        'For ∠' + X + ': ' + YZ + ' is opp and ' + XZ + ' is adj: ' + t('\\angle ' + X + '=\\tan^{-1}\\!\\left(' + fracT(N(s.e), N(s.p)) + '\\right)' + toN(s.A, 0) + '^\\circ'), t('\\angle ' + Y + '=90^\\circ-' + dg(rd(s.A, 0)) + '=' + dg(90 - rd(s.A, 0))),
        'Check: the bigger angle faces the longer leg ✓']),
      ['Sketch it with the right angle at ' + Z + '. Which side is the hypotenuse?', 'Use the two legs you were given (not your rounded hypotenuse) for ∠' + X + ': TOA.'], o.text || 'solve a triangle from two legs');
  }
  /* ---- two angles of depression from a roof (or two guy wires on opposite sides) ---- */
  function twoDepSVG(s) {
    var fg = new Fig(), far = s.same ? s.d2 : s.d2, sc = s.same ? 300 / Math.max(far * 1.08, s.h * 2) : 300 / Math.max(s.d1 + s.d2, s.h * 1.5), H = s.h * sc, T = [0, -H];
    if (s.same) {
      var x1 = s.d1 * sc, x2 = s.d2 * sc;
      fg.poly([[-22, 0], [-22, -H], [0, -H], [0, 0]], { fill: '#eef1f6', stroke: INK, width: 2 }); fg.line([-30, 0], [x2 + 24, 0], { width: 2, color: GREY });
      fg.line(T, [x2 + 16, -H], { dash: '6 4', width: 1.6, color: GREY }).line(T, [x1, 0], { width: 2 }).line(T, [x2, 0], { width: 2, color: AMBER }).dot([x1, 0]).dot([x2, 0]).dot(T);
      var a1 = Math.atan2(H, x1) / RAD, a2 = Math.atan2(H, x2) / RAD;
      fg.arc(T, 360 - a1, 360, { r: 40, label: s.al + '°', labelR: 62 }).arc(T, 360 - a2, 360, { r: 96, label: s.be + '°', labelR: 118, color: AMBER });
      fg.text(-34, -H / 2, lab(s.h, 'm'), { size: 15, anchor: 'end' }).text(x1, 16, s.n1, { size: 13, weight: 600 }).text(x2, 16, s.n2, { size: 13, weight: 600 });
    } else {
      var xa = -s.d1 * sc, xb = s.d2 * sc;
      fg.line([xa - 20, 0], [xb + 20, 0], { width: 2, color: GREY }).line([0, 0], T, { width: 4, color: '#7a5a2a' }).line(T, [xa, 0], { width: 2 }).line(T, [xb, 0], { width: 2, color: AMBER }).dot([xa, 0]).dot([xb, 0]);
      var b1 = Math.atan2(H, s.d1 * sc) / RAD, b2 = Math.atan2(H, s.d2 * sc) / RAD;
      fg.arc([xa, 0], 0, b1, { r: 34, label: s.al + '°' }).arc([xb, 0], 180 - b2, 180, { r: 34, label: s.be + '°', color: AMBER }).arc([0, 0], 90, 180, { right: true });
      fg.text(10, -H * 0.55, lab(s.h, 'm'), { size: 15, anchor: 'start' });
    }
    return fg.svg({ width: 360, aria: s.same ? 'two angles of depression' : 'two guy wires' });
  }
  function twoDepPart(r, o) {
    o = o || {};
    var same = o.same != null ? o.same : r.chance(0.6);
    var s = find(function () {
      var h = pickR(r, same ? [20, 45, 1] : [35, 70, 1]), al = same ? r.int(30, 50) : r.int(52, 66), be = same ? al - r.int(10, 18) : r.int(42, 60);
      var d1 = h / TRG.tan(al), d2 = h / TRG.tan(be);
      return { h: h, al: al, be: be, d1: d1, d2: d2, x: same ? d2 - d1 : d1 + d2, same: same };
    }, function (s) { return safe(s.x, 1) && s.al !== s.be && s.be > 8; });
    var objs = r.pick([['a parked car', 'a bus stop', 'car', 'bus stop', 'From the roof of a', 'building', 'street'], ['a canoe', 'a kayak', 'canoe', 'kayak', 'From the top of a', 'cliff', 'lake'], ['a mailbox', 'a fire hydrant', 'mailbox', 'hydrant', 'From the roof of a', 'building', 'street']]);
    s.n1 = objs[2]; s.n2 = objs[3];
    var e1 = h0(s), alts = [{ v: s.d2, code: 'u7t-one-tri', hint: 'That is the distance to one point only. Find the other distance too, then ' + (same ? 'subtract' : 'add') + '.' }, { v: s.d1, code: 'u7t-one-tri', hint: 'That is the distance to one point only. Find the other distance too, then ' + (same ? 'subtract' : 'add') + '.' },
      { v: same ? s.d1 + s.d2 : Math.abs(s.d2 - s.d1), code: 'u7t-sum-diff', hint: same ? 'Both are on the same side, so the distance between them is the <b>difference</b>.' : 'The anchors are on <b>opposite</b> sides of the tower: add the two distances.' },
      { v: same ? s.h * (TRG.tan(s.al) - TRG.tan(s.be)) : s.h * (TRG.tan(s.al) + TRG.tan(s.be)), code: 'u7t-mul-div', hint: 'The distance along the ground is on the <b>bottom</b> of ' + t('\\tan\\theta=\\dfrac{' + N(s.h) + '}{d}') + ': divide.' },
      { v: same ? Math.abs(s.h / Math.tan(s.be) - s.h / Math.tan(s.al)) : Math.abs(s.h / Math.tan(s.al) + s.h / Math.tan(s.be)), code: 'u7t-rad', hint: G.RAD_HINT }];
    if (Math.abs(rd(e1, 1) - rd(s.x, 1)) > 1e-9) alts.push({ v: e1, code: 'u7t-early', hint: 'Close! Keep the full value of each distance and round only at the end.' });
    function h0(z) { return z.same ? rd(z.d2, 1) - rd(z.d1, 1) : rd(z.d1, 1) + rd(z.d2, 1); }
    var prompt = same ? objs[4] + ' ' + L(s.h, 'm') + ' ' + objs[5] + ', Ines looks down at ' + objs[0] + ' at an angle of depression of ' + D(s.al) + '. Farther away on the same straight line is ' + objs[1] + ', at an angle of depression of ' + D(s.be) + '. How far is the ' + objs[2] + ' from the ' + objs[3] + ', to the nearest tenth of a metre? (The ' + objs[6] + ' is level.)'
      : 'A cell tower is ' + L(s.h, 'm') + ' tall. Two guy wires run from the top of the tower to anchors on opposite sides of it, on flat ground. One wire makes an angle of ' + D(s.al) + ' with the ground and the other makes ' + D(s.be) + '. How far apart are the two anchors, to the nearest tenth of a metre?';
    return lenPart(prompt + twoDepSVG(s), s.x, { unit: 'm', radTrap: false, alts: alts,
      sol: br([same ? 'The angles of elevation from the ground are also ' + D(s.al) + ' and ' + D(s.be) + ' (alternate interior angles). In each triangle, ' + L(s.h, 'm') + ' is opp and the ground distance is adj: TOA, with the distance on the bottom (divide).' : 'Two right triangles share the tower (opp in both). The ground distances are adj: TOA, with the distance on the bottom (divide).',
        (same ? 'To the ' + objs[2] + ': ' : 'Left: ') + t(N(s.h) + '\\div\\tan ' + dg(s.al) + '=' + rawN(s.d1, 3)) + ' m', (same ? 'To the ' + objs[3] + ': ' : 'Right: ') + t(N(s.h) + '\\div\\tan ' + dg(s.be) + '=' + rawN(s.d2, 3)) + ' m',
        (same ? 'Between them: ' + t(rawN(s.d2, 3) + '-' + rawN(s.d1, 3)) : 'Total: ' + t(rawN(s.d1, 3) + '+' + rawN(s.d2, 3))) + ' ' + t(toN(s.x, 1) + '\\text{ m}')]),
      hints: ['There are two right triangles with the same opp side (the height).', 'Find each ground distance with ÷ tan, then ' + (same ? 'subtract.' : 'add.')], text: o.text || (same ? 'two angles of depression: the difference' : 'two guy wires: the total') });
  }
  /* ---- a zipline between two platforms, or a plane coming in to land (km) ---- */
  function ziplinePart(r, o) {
    o = o || {};
    var plane = o.plane != null ? o.plane : r.chance(0.4), s;
    if (plane) {
      s = find(function () { var h = 10 * r.int(60, 150), th = r.pick([3, 4, 5, 6, 7, 8]); return { h: h, th: th, x: h / TRG.sin(th) / 1000 }; }, function (s) { return safe(s.x, 1); });
      var altsP = [{ v: s.x * 1000, code: 'u7t-km', hint: 'That is in <b>metres</b>. Change it to kilometres: ÷ 1000.' }, { v: s.h / TRG.tan(s.th) / 1000, code: 'u7t-ratio', hint: 'That is the distance along the <b>ground</b>. The plane flies along the hypotenuse: you know the opp and want the hyp, SOH.' },
        { v: s.h * TRG.sin(s.th) / 1000, code: 'u7t-mul-div', hint: 'The hyp is on the <b>bottom</b> of ' + t('\\sin ' + dg(s.th) + '=\\dfrac{' + N(s.h) + '}{x}') + ': divide.' }, { v: s.h / Math.sin(s.th) / 1000, code: 'u7t-rad', hint: G.RAD_HINT }];
      return lenPart('A small plane is ' + L(s.h, 'm') + ' above the runway at Red Deer. It comes in to land in a straight line at an angle of depression of ' + D(s.th) + '. How far does it fly along its path to touch down? Give the answer in <b>kilometres</b>, to the nearest tenth.', s.x, { unit: 'km', radTrap: false, alts: altsP,
        sol: br([triSVG(null, { a: s.h, b: s.h / TRG.tan(s.th), theta: 'A', thetaLabel: s.th + '°', sides: { a: lab(s.h, 'm'), c: 'x' }, roles: ['opp', 'hyp'], unknown: 'c', px: 260, width: 300 }), 'The angle of elevation from the touchdown point is also ' + D(s.th) + '. The height is opp and the path is hyp: SOH.',
          t('\\sin ' + dg(s.th) + '=\\dfrac{' + N(s.h) + '}{x}') + ', so ' + t('x=' + N(s.h) + '\\div\\sin ' + dg(s.th) + '=' + rawN(s.x * 1000, 1) + '\\text{ m}'), 'In kilometres: ' + t(rawN(s.x * 1000, 1) + '\\div 1000' + toN(s.x, 1) + '\\text{ km}') + ' (much longer than the height, because the angle is small ✓)']),
        hints: ['The angle of depression from the plane equals the angle of elevation from the runway.', 'Height is opp, the path is hyp. Then change metres to kilometres.'], text: o.text || 'plane landing path (km)' });
    }
    s = find(function () { var H1 = pickR(r, [15, 32, 0.5]), H2 = pickR(r, [2, 6, 0.5]), th = r.int(5, 14); return { H1: H1, H2: H2, th: th, x: (H1 - H2) / TRG.sin(th) }; }, function (s) { return safe(s.x, 1); });
    var dh = q(s.H1 - s.H2), alts = [{ v: s.H1 / TRG.sin(s.th), code: 'u7t-no-diff', hint: 'The cable drops from ' + L(s.H1, 'm') + ' to ' + L(s.H2, 'm') + ': the opp is the <b>difference</b>, ' + t(N(s.H1) + '-' + N(s.H2)) + '.' },
      { v: (s.H1 + s.H2) / TRG.sin(s.th), code: 'u7t-sum-diff', hint: 'The cable drops from one platform to the other: <b>subtract</b> the heights.' }, { v: dh * TRG.sin(s.th), code: 'u7t-mul-div', hint: 'The cable (hyp) is on the <b>bottom</b> of ' + t('\\sin\\theta=\\dfrac{\\text{opp}}{x}') + ': divide.' },
      { v: dh / TRG.tan(s.th), code: 'u7t-ratio', hint: 'That is the horizontal distance. The cable is the hypotenuse: you know the opp and want the hyp, SOH.' }, { v: dh / Math.sin(s.th), code: 'u7t-rad', hint: G.RAD_HINT }];
    return lenPart('A zipline at a summer camp in Kananaskis starts on a platform ' + L(s.H1, 'm') + ' above the ground and ends on a platform ' + L(s.H2, 'm') + ' above the ground. The cable makes an angle of ' + D(s.th) + ' with the horizontal. How long is the cable, to the nearest tenth of a metre? (Treat it as straight.)', s.x, { unit: 'm', radTrap: false, alts: alts,
      sol: br([triSVG(null, { a: dh, b: dh / TRG.tan(s.th), theta: 'A', thetaLabel: s.th + '°', sides: { a: lab(dh, 'm'), c: 'x' }, roles: ['opp', 'hyp'], unknown: 'c', px: 260, width: 300 }), 'The drop is ' + t(N(s.H1) + '-' + N(s.H2) + '=' + N(dh)) + ' m: that is the opp. The cable is the hyp: SOH.',
        t('\\sin ' + dg(s.th) + '=\\dfrac{' + N(dh) + '}{x}') + ', so ' + t('x=' + N(dh) + '\\div\\sin ' + dg(s.th) + toN(s.x, 1) + '\\text{ m}')]),
      hints: ['Sketch it: the right triangle’s vertical side is the drop between the platforms.', 'You know the opp and want the hyp: is x on the top or the bottom of the ratio?'], text: o.text || 'zipline between platforms' });
  }
  Object.assign(A, { poleSVG: poleSVG, poleShared: poleShared, polePart: polePart, boxShared: boxShared, trunkPart: trunkPart, twoSightSVG: twoSightSVG, antennaPart: antennaPart, solveLegsPart: solveLegsPart,
    twoDepSVG: twoDepSVG, twoDepPart: twoDepPart, ziplinePart: ziplinePart, TRI_NAMES: TRI_NAMES });

  /* ======================= the questions (paper order; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function QS(num, outcome, level, shared, stem, makes, text) { return { num: String(num), outcome: outcome, text: text, shared: shared, stem: stem, parts: makes.map(function (mk, i) { return { id: num + String.fromCharCode(97 + i), outcome: outcome, level: level, make: mk }; }) }; }
  var QUESTIONS = [
    /* ---------- Beginning ---------- */
    Q(1, 'G2', 'BEG', function (r) { return rootPart(r); }, '√n between two whole numbers, and to the nearest tenth'),
    Q(2, 'G2', 'BEG', function (r) { return hypPart(r); }, 'The hypotenuse from two legs'),
    Q(3, 'G2', 'BEG', function (r) { return legPart(r); }, 'A missing leg'),
    Q(4, 'G4', 'BEG', function (r) { return labelPart(r); }, 'Name opp, adj and hyp from θ'),
    Q(5, 'G4', 'BEG', function (r) { return ratioDecPart(r); }, 'sin θ, cos θ or tan θ as a decimal'),
    Q(6, 'G4', 'BEG', function (r) { return trigSidePart(r, { op: 'mul' }); }, 'A side: the unknown on top (multiply)'),
    Q(7, 'G4', 'BEG', function (r) { return anglePart(r); }, 'An angle from two sides, and the other acute angle'),
    Q(8, 'G4', 'BEG', function (r) { return toolMCPart(r); }, 'Which tool: sin, cos, tan or Pythagoras (multiple choice)'),
    Q(9, 'A1', 'BEG', function (r) { return trigSidePart(r, { op: 'div' }); }, 'A side: the unknown on the bottom (divide)'),
    Q(10, 'A1', 'BEG', function (r) { return eqnMCPart(r); }, 'Which equation gives x (multiple choice)'),
    /* ---------- Progressing ---------- */
    Q(11, 'G2', 'PRG', function (r) { return rightTestPart(r); }, 'Is it a right triangle?'),
    Q(12, 'G2', 'PRG', function (r) { return pythCtxPart(r); }, 'Pythagoras in a story (hypotenuse or leg)'),
    Q(13, 'G2', 'PRG', function (r) { return squareCornerPart(r); }, 'Squaring a corner: the diagonal and the angle'),
    Q(14, 'G4', 'PRG', function (r) { return elevEyePart(r); }, 'A height from an angle of elevation plus the eye height'),
    Q(15, 'G4', 'PRG', function (r) { return trigCtxPart(r); }, 'A side in a story (unknown on top)'),
    Q(16, 'G4', 'PRG', function (r) { return angleCtxPart(r); }, 'An angle in a story'),
    Q(17, 'G4', 'PRG', function (r) { return solveAHPart(r); }, 'Solve a triangle from an angle and the hypotenuse'),
    Q(18, 'A1', 'PRG', function (r) { return depressionPart(r); }, 'A distance from an angle of depression (÷ tan)'),
    Q(19, 'A1', 'PRG', function (r) { return hypCtxPart(r); }, 'A side in a story with the unknown on the bottom'),
    QS(20, 'A1', 'PRG', tvShared, tvStem, [tvFormulaPart, tvValuePart], 'A screen: rearrange w² + h² = d², then use it'),
    /* ---------- Mastery ---------- */
    Q(21, 'G2', 'MAS', function (r) { return polePart(r); }, 'A pole held by two ropes: two steps of Pythagoras'),
    Q(22, 'G2', 'MAS', function (r) { return trunkPart(r); }, 'A box: the floor diagonal and the longest diagonal'),
    Q(23, 'G4', 'MAS', function (r) { return antennaPart(r); }, 'Two angles of elevation: an antenna on a building'),
    Q(24, 'G4', 'MAS', function (r) { return solveLegsPart(r); }, 'Solve a triangle from its two legs (sketch it)'),
    Q(25, 'A1', 'MAS', function (r) { return twoDepPart(r); }, 'Two angles of depression (or two guy wires): the distance between'),
    Q(26, 'A1', 'MAS', function (r) { return ziplinePart(r); }, 'A zipline between platforms, or a plane landing (km)')
  ];

  HW.defineTest({
    id: 'u7test', unit: 7, title: 'Unit 7 Test', outcome: 'G4', calc: true,
    blurb: 'The Unit 7 outcomes-based test (G2 the Pythagorean theorem, G4 the trig ratios, A1 rearranging formulas): square roots, the hypotenuse and a missing leg, the right-triangle test and square corners; opp, adj and hyp, sine, cosine and tangent, finding sides and angles, elevation and depression, and solving right triangles, in Beginning, Progressing and Mastery boxes.',
    // Short version (~50%): Beginning keeps G2 the hypotenuse and a leg, G4 a side (unknown on top) and an angle with the
    // other acute angle, A1 a side with the unknown on the bottom; Progressing keeps G2 the right-triangle test and a
    // Pythagoras story, G4 elevation with the eye height and solving a triangle, A1 the depression distance and a story with
    // the unknown on the bottom; Mastery keeps G2 the two ropes, G4 the antenna and A1 the two angles of depression.
    short: ['2', '3', '6', '7', '9', '11', '12', '14', '17', '18', '19', '21', '23', '25'],
    questions: QUESTIONS
  });
})(window);
