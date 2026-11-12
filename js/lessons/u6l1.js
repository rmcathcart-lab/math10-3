/* Math 10-3 · Unit 6 · Lesson 1 — Similar Polygons and Scale Factor (G3)
 * Assignment 1 (u6_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u6_ep01.tex, A 1–4, B 5–11, C 12–14).
 * Every part is a generator: the booklet situation with new numbers around the booklet's (the worked-example numbers —
 * angles 52°/71°, 78°/112°/64°, the k table 4→10, 12→3, 15→6, 7→7, 2.4→8.4, the 5 cm logo on a 1.2 m banner, the 18 cm
 * boxcar, ABCD ~ PQRS with 8, 5, 6 and 12, 6.6, the 10 × 15 photo on a 60 cm poster, the 1 : 24 truck — are left out).
 * Calculator allowed. Lengths are exact here (or to the nearest tenth where the booklet says so); money to the cent.
 * Hints aimed at real mistakes: k upside down (original ÷ new), k as a difference, k on the wrong side of 1, units not
 * changed (m and cm), multiplying when the unknown side is in the original (and dividing when it is in the new figure),
 * adding k, matching letters by position on the page instead of by the naming order, the wrong angle sum (180°/360°/540°),
 * a model scale used the wrong way, a model length left in cm when metres are asked, the perimeter in cm × a price per m.
 * Conversions for answering on screen:
 *   "similar? × what?" for grid copies → a tap table (not similar / similar ×1, ×1.5, ×2, ×3) with the copies drawn;
 *   "true or false? explain" → multiple choice whose options pair True/False with a reason;
 *   tables of corresponding parts and "complete the equal ratios" → labelled letter boxes (WX and XW both fine);
 *   the k / type table → k boxes (one per row) + a tap table of enlargement / reduction / same size;
 *   "find k, enlargement or reduction?" → a k box + a type word box; "does it fit? explain", "find his mistake",
 *   "how does the perimeter compare? explain why", "how could you find it from 2 and 0.75?" → multiple choice of reasons.
 *
 * Exports HW.u6kit (number/length/scale-factor checkers and boxes, letter boxes for corresponding parts, word boxes,
 * HTML tables, triangle/quadrilateral figures from side lengths, corresponding-parts boxes) for Lesson 6.2, so this file loads before
 * u6l2.js. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.similarSVG || !G.kChk || !G.lenChk) throw new Error('js/lessons/u6l1.js needs HW.geo from js/geokit.js: load it first');
  var KT = HW.u6kit = HW.u6kit || {};

  /* ======================================================================================================
   *  THE UNIT 6 KIT (HW.u6kit)
   * ====================================================================================================== */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dgT(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dgT(x)); }
  function c2(x) { return HW.fmt(rd(x, 2).toFixed(2)); }
  function MM(x) { return t('\\$' + c2(x)); }
  function raw5(x) { var s = +x.toFixed(5); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '=' + raw5(x) + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function places(x) { for (var i = 0; i < 7; i++) { if (near(x * Math.pow(10, i), Math.round(x * Math.pow(10, i)), 1e-6)) return i; } return 9; }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u6 kit: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function aN(x) { var s = nS(x); return /^8/.test(s) || /^1[18](\.\d+)?$/.test(s) ? 'an' : 'a'; }
  function uT(u) { if (!u) return ''; if (u === '°') return '^\\circ'; var m = /^(.*?)([²³])$/.exec(u); return m ? '\\text{ ' + m[1] + '}^{' + (m[2] === '²' ? 2 : 3) + '}' : '\\text{ ' + u + '}'; }
  function U(x, u) { return t(N(x) + uT(u)); }
  function pickNot(r, arr, not) { return find(function () { return r.pick(arr); }, function (v) { return (not || []).indexOf(v) < 0; }, arr[0]); }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Hana', 'f'], ['Devon', 'm'], ['Rosa', 'f'],
    ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f'], ['Liam', 'm']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  var TRIS = ['ABC', 'DEF', 'PQR', 'XYZ', 'JKL', 'GHJ', 'LMN', 'STU', 'KLM', 'RST', 'UVW'];
  var QUADS = ['ABCD', 'PQRS', 'EFGH', 'JKLM', 'WXYZ', 'RSTU', 'KLMN', 'STUV', 'MNOP'];
  var PENTS = ['ABCDE', 'FGHJK', 'LMNPQ', 'RSTUV', 'VWXYZ', 'PQRST'];
  /* two names with no letter in common */
  function twoNames(r, list) { var a = r.pick(list), b = find(function () { return r.pick(list); }, function (b) { return b.split('').every(function (x) { return a.indexOf(x) < 0; }); }); return [a, b]; }
  function sideOf(nm, i) { var n = nm.length; return nm.charAt(i % n) + nm.charAt((i + 1) % n); }
  Object.assign(KT, { rd: rd, q: q, near: near, nS: nS, N: N, dgT: dgT, D: D, c2: c2, MM: MM, toN: toN, places: places, find: find, br: br, cap: cap, aN: aN, uT: uT, U: U, pickNot: pickNot,
    person: person, TRIS: TRIS, QUADS: QUADS, PENTS: PENTS, twoNames: twoNames, sideOf: sideOf });

  /* ---------------- reading and checking a number ---------------- */
  /* a typed number: "57", "57°", "x = 57", "12 cm", "$8.07" are all read as the number */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1);
    s = s.replace(/\\angle|∠/g, ' ').replace(/\\\$|\$/g, '');
    s = s.replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, ' °').replace(/\\[,;: !]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/°²³][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u6k-comma', 'Use a decimal point (not a comma), like 37.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  /* an answer rounded to dp places (default 0). o: { dp, money, exact, alts (other right values), diag [{v, code, hint}] (wrong),
   * nudge [{v, code, hint}] (no try used), word (the rounding place in words), noPlaces, miss } */
  function amtChk(ans, o) {
    o = o || {};
    var money = !!o.money, dp = money ? 2 : (o.dp == null ? 0 : o.dp), step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (money ? 'the cent (2 decimal places)' : dp === 0 ? 'a whole number' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp === 2 ? 'the nearest hundredth (2 decimal places)' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var keep = function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); };
    var dgs = (o.diag || []).filter(keep), ng = (o.nudge || []).filter(keep);
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc(v)) return ok();
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      for (var j = 0; j < ng.length; j++) if (near(v, ng[j].v, tol) || near(v, rd(ng[j].v, dp), tol)) return form(ng[j].code, ng[j].hint);
      for (var i = 0; i < dgs.length; i++) {
        var m = dgs[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
      }
      if (!o.noPlaces && dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u6k-places', money ? 'Give money to the cent (2 decimal places), like $12.49.' : 'Round to ' + word + '.');
      if (dp >= 1 && d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u6k-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  function keyOf(ans, o) { o = o || {}; var dp = o.money ? 2 : (o.dp == null ? 0 : o.dp); return o.money ? rd(ans, 2).toFixed(2) : nS(rd(ans, dp)); }
  function badOf(o, ans) {
    var dp = o.money ? 2 : (o.dp == null ? 0 : o.dp), acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    return (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }); }).map(function (m) { return keyOf(m.v, o); });
  }
  /* one number part. o: amtChk options + before, after (unit after the box), sol, hints, text, nr */
  function num(prompt, ans, o) {
    o = o || {};
    var key = keyOf(ans, o), before = o.before !== undefined ? o.before : o.money ? '$' : undefined, after = o.after;
    var p = { prompt: prompt, input: { type: 'number', before: before, after: after, nr: !!o.nr }, check: amtChk(ans, o), key: key, answer: t((o.money ? '\\$' : '') + HW.fmt(key) + (o.money ? '' : uT(after))), solution: o.sol, hints: o.hints || [], text: o.text };
    if (o.nr) { var inner = p.check; p.check = function (resp) { if (String(resp == null ? '' : resp).replace(/\s/g, '').length > 4 && readNum(resp).v != null) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return inner(resp); }; }
    p.bad = badOf(o, ans); p.good = [];
    if (after === '°') p.good.push(key + '°');
    if (o.money) p.good.push('$' + key);
    return p;
  }
  /* a number box in a set of boxes */
  function fld(label, ans, o) {
    o = o || {}; var key = keyOf(ans, o);
    return { label: label, name: o.name, before: o.before !== undefined ? o.before : o.money ? '$' : undefined, after: o.after, chk: amtChk(ans, o), key: key, show: t((o.money ? '\\$' : '') + HW.fmt(key) + (o.money ? '' : uT(o.after))), bad: badOf(o, ans) };
  }
  function angFld(label, ans, diag, name) { return fld(label, ans, { after: '°', diag: diag, name: name }); }

  /* ---------------- scale factors (HW.geo.kChk) ---------------- */
  /* o: { from: { new, orig }, dp 2, diag [{v, code, hint}] (checked first when the shared checker says wrong) } */
  function kChk(k, o) {
    o = o || {}; var base = G.kChk(k, { from: o.from, dp: o.dp == null ? 2 : o.dp }), dgs = (o.diag || []).filter(function (m) { return isFinite(m.v) && Math.abs(m.v - k) > 0.006; });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var r = base(resp);
      if (r.v === 'wrong' && r.code !== 'k-flip') { var a = K.read(String(resp == null ? '' : resp).replace(/^\s*k\s*=\s*/i, '')); if (!a.res && isFinite(a.val)) for (var i = 0; i < dgs.length; i++) if (Math.abs(a.val - dgs[i].v) < 0.006 || near(rd(a.val, 2), rd(dgs[i].v, 2), 1e-9)) return wrong(dgs[i].code, dgs[i].hint); }
      return r;
    };
  }
  function kKey(k) { return places(k) <= 4 ? nS(k) : nS(rd(k, 2)); }
  function kBad(k, o) { var bad = []; if (Math.abs(k - 1) > 1e-9) bad.push(nS(rd(1 / k, 4))); ((o && o.diag) || []).forEach(function (m) { if (isFinite(m.v) && Math.abs(m.v - k) > 0.006 && Math.abs(m.v * k - 1) > 1e-6) bad.push(nS(rd(m.v, 4))); }); return bad; }
  function kFld(label, k, o) { o = o || {}; var key = kKey(k); return { label: label, name: o.name || 'k', chk: kChk(k, o), key: key, show: t(HW.fmt(key)), bad: kBad(k, o) }; }
  /* a scale-factor part (math box with a fraction key). k: a number or [p, q]. o: kChk options + sol, hints, text */
  function kPart(prompt, k, o) {
    o = o || {}; var kv = Array.isArray(k) ? k[0] / k[1] : k;
    var p = G.P.k(prompt, k, { sol: o.sol, hints: o.hints, text: o.text });
    p.check = kChk(kv, o); p.bad = kBad(kv, o); return p;
  }

  /* ---------------- lengths from similar figures (HW.geo.lenChk) ---------------- */
  /* o: { dp 1, unit, scale: { len, k, op 'mul'|'div' }, prop: { given, num, den }, alts [{v, code, hint}] } */
  function lenChk(v, o) {
    o = o || {}; var c = G.lenChk(v, { dp: o.dp == null ? 1 : o.dp, unit: o.unit, scale: o.scale, prop: o.prop, alts: o.alts || [], radTrap: false, early: false });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var sR = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{\s*([^{}]*?)\s*\}/g, ' $1'), m = /^(.*?\d\.?)\s*(mm|cm|km|m|in|ft)\.?\s*$/i.exec(sR.trim());
      if (m && HW.parse.number(m[1].replace(/^\s*[A-Za-z]{1,3}\s*=\s*/, '')).ok) resp = m[1];
      return c(resp);
    };
  }
  function lenBad(v, o) {
    var dp = o.dp == null ? 1 : o.dp, vals = (o.alts || []).map(function (a) { return a.v; }), sc = o.scale, pr = o.prop;
    if (sc) vals.push(sc.op === 'div' ? sc.len * sc.k : sc.len / sc.k, sc.len + sc.k);
    if (pr) vals.push(pr.given * pr.den / pr.num);
    var out = [];
    vals.forEach(function (x) { if (isFinite(x) && Math.abs(rd(x, dp) - rd(v, dp)) > 1e-9) { var s = nS(rd(x, dp)); if (out.indexOf(s) < 0) out.push(s); } });
    return out;
  }
  function lenKey(v, o) { return nS(rd(v, o.dp == null ? 1 : o.dp)); }
  function lenFld(label, v, o) { o = o || {}; var key = lenKey(v, o); return { label: label, name: o.name, after: o.unit, chk: lenChk(v, o), key: key, show: t(HW.fmt(key) + uT(o.unit)), bad: lenBad(v, o) }; }
  function lenPart(prompt, v, o) {
    o = o || {}; var key = lenKey(v, o);
    return { prompt: prompt, input: { type: 'number', after: o.unit }, check: lenChk(v, o), key: key, answer: t(HW.fmt(key) + uT(o.unit)), solution: o.sol, hints: o.hints || [], text: o.text, bad: lenBad(v, o), good: [] };
  }

  /* ---------------- words and letters typed in a box ---------------- */
  var STOP = { the: 1, it: 1, is: 1, a: 1, an: 1, are: 1, they: 1, i: 1, to: 1, be: 1, similar: 1, its: 1, of: 1, so: 1, one: 1 };
  function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/[.,'’!:;()?]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
  function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
  function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
  function whichOf(resp, right, wrongs) { var ws = words(resp); if (!ws.length) return 'empty'; var a = hit(ws, right), b = hit(ws, wrongs); return a && b ? 'both' : a ? 'right' : b ? 'wrong' : 'none'; }
  /* o: { right, wrongs, choices (text for the nudge), why, code } */
  function wordChk(o) {
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var w = whichOf(resp, o.right, o.wrongs);
      if (w === 'empty') return form('empty', 'Type your answer first.');
      if (w === 'right') return ok();
      if (w === 'wrong') return wrong(o.code || 'value', typeof o.why === 'function' ? o.why(resp) : o.why || null);
      return form('u6k-word', 'Type just one of: ' + o.choices + '.');
    };
  }
  function wfld(label, o) { return { label: label, name: o.name, mode: 'text', ph: o.ph, wide: true, chk: wordChk(o), key: o.key, show: '<b>' + o.key + '</b>', bad: o.bad || [] }; }
  var YES = ['yes', 'y', 'yep', 'yeah'], NO = ['no', 'n', 'not', 'nope'];
  var TYPE_TOK = { enlargement: ['enlargement', 'enlarge', 'enlarged', 'enlarg', 'bigger', 'larger'], reduction: ['reduction', 'reduce', 'reduced', 'reduc', 'smaller', 'shrink'], 'same size': ['same', 'congruent', 'samesize'] };
  function typeOf(k) { return k > 1 + 1e-9 ? 'enlargement' : k < 1 - 1e-9 ? 'reduction' : 'same size'; }
  function yesNoFld(label, yes, why, code) { return wfld(label, { name: 'Similar', ph: 'yes or no', right: yes ? YES : NO, wrongs: yes ? NO : YES, choices: 'yes or no', key: yes ? 'yes' : 'no', bad: [yes ? 'no' : 'yes'], why: why, code: code || 'u6k-yes-no' }); }
  function typeFld(label, k) {
    var ty = typeOf(k), wr = []; Object.keys(TYPE_TOK).forEach(function (x) { if (x !== ty) wr = wr.concat(TYPE_TOK[x]); });
    return wfld(label, { name: 'Type', ph: 'enlargement or reduction', right: TYPE_TOK[ty], wrongs: wr, choices: 'enlargement, reduction or same size', key: ty, bad: [ty === 'enlargement' ? 'reduction' : 'enlargement'], code: 'u6k-type',
      why: 'Compare k with 1: more than 1 is an enlargement (bigger), less than 1 a reduction (smaller), exactly 1 the same size.' });
  }
  /* a vertex (one letter) or a side (two letters, either order) typed in a box.
   * o: { pool (letters of the figure the answer is in), otherName, otherPool, hint (when the letters are wrong) } */
  function letters(resp) { return String(resp == null ? '' : resp).replace(/\\angle|∠|\\overline|\\text|angle|side/gi, ' ').replace(/[^A-Za-z]/g, '').toUpperCase(); }
  function nameChk(want, o) {
    o = o || {};
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var s = letters(resp);
      if (!s) return form('empty', 'Type the letter' + (want.length > 1 ? 's' : '') + ' first.');
      if (s === want || (want.length === 2 && s === want.charAt(1) + want.charAt(0))) return ok();
      if (want.length === 1 && s.length !== 1) return form('u6k-one-letter', 'Type just one letter: the vertex (for example ' + want.replace(/./, function () { return o.pool ? o.pool.charAt(0) : 'W'; }) + ').');
      if (want.length === 2 && s.length !== 2) return form('u6k-two-letters', 'Type the two letters of the side (for example ' + (o.pool ? o.pool.slice(0, 2) : 'WX') + ').');
      if (o.pool && o.otherPool && s.split('').every(function (c) { return o.otherPool.indexOf(c) >= 0; }) && !s.split('').every(function (c) { return o.pool.indexOf(c) >= 0; }))
        return wrong('u6k-other-fig', 'Those letters are from ' + o.otherName + '. The answer is in ' + o.poolName + ': use its letters.');
      if (o.pool && s.split('').some(function (c) { return o.pool.indexOf(c) < 0; })) return wrong('u6k-not-letter', 'Use the letters of ' + o.poolName + ' (' + o.pool.split('').join(', ') + ').');
      return wrong('u6k-order', o.hint || 'Write the two names one above the other and read down the columns: the 1st letter matches the 1st letter, the 2nd the 2nd, …');
    };
  }
  function nameFld(label, want, o) { o = o || {}; return { label: label, name: o.name, before: o.before, mode: 'text', ph: o.ph, chk: nameChk(want, o), key: want, show: t(o.angle ? '\\angle ' + want : want), bad: o.bad || [] }; }

  /* ---------------- several boxes ---------------- */
  /* all right → correct; one box wrong in a set of 3+ with no recognized mistake → 'u6k-one-box' (small), of 2 → 'u6k-half-box';
   * a recognized mistake → its own code; several wrong boxes with the same recognized mistake → that code; else 'u6k-many-box'. */
  function multiChk(checks, labels) {
    return function (resp) {
      resp = resp || [];
      var res = checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      var lab = function (i) { return labels.length > 1 ? '<b>' + labels[i] + ':</b> ' : ''; };
      var wi = [], fi = [];
      res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); });
      if (!wi.length && !fi.length) return ok();
      if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lab(fi[0]) + (f0.hint || 'Check this one again.')); }
      var w0 = res[wi[0]], hint = lab(wi[0]) + (w0.hint || 'Check this one again.');
      if (wi.length === 1) {
        if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
        if (res.length === 1) return wrong('value', w0.hint || null);
        return wrong(res.length >= 3 ? 'u6k-one-box' : 'u6k-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint + ' (' + wi.length + ' boxes have this mistake.)');
      return wrong('u6k-many-box', hint + ' (' + wi.length + ' boxes are not right yet.)');
    };
  }
  function plainLab(s) { return String(s).replace(/:$/, '').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, '').replace(/\\angle\s*/g, '∠').replace(/\\[a-z]+/g, '').replace(/[{}]/g, '').trim(); }
  function fieldsPart(prompt, specs, sol, hints, text) {
    var labels = specs.map(function (s) { return plainLab(s.name || s.label); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s, i) { return { label: s.label, name: labels[i], before: s.before, after: s.after, mode: s.mode, placeholder: s.ph, wide: !!s.wide }; }) },
      check: multiChk(specs.map(function (s) { return s.chk; }), labels), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return s.label + ' ' + (s.before ? '' : '') + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    var b0 = (specs[0].bad || []).filter(function (x) { return x !== String(specs[0].key); })[0];
    p.bad = [specs.map(function (s, i) { return i === 0 ? (b0 || (s.mode === 'text' ? 'zzz' : '99999')) : String(s.key); })];
    return p;
  }
  function table(head, rows) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em">' + (head ? '<tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  /* a multiple-choice part (shuffled unless keep) */
  function mc(r, prompt, opts, sol, hints, text, keep) { return P.mc(r, prompt, opts, sol, hints, text, keep); }
  Object.assign(KT, { readNum: readNum, amtChk: amtChk, keyOf: keyOf, badOf: badOf, num: num, fld: fld, angFld: angFld, kChk: kChk, kKey: kKey, kFld: kFld, kPart: kPart,
    lenChk: lenChk, lenFld: lenFld, lenPart: lenPart, lenBad: lenBad, whichOf: whichOf, wordChk: wordChk, wfld: wfld, YES: YES, NO: NO, TYPE_TOK: TYPE_TOK, typeOf: typeOf,
    yesNoFld: yesNoFld, typeFld: typeFld, letters: letters, nameChk: nameChk, nameFld: nameFld, multiChk: multiChk, fieldsPart: fieldsPart, table: table, mc: mc });

  /* ---------------- figures ---------------- */
  /* a triangle (math coords, y up) with sides s0 = V0V1, s1 = V1V2, s2 = V2V0 */
  function triFrom(s0, s1, s2) { var x = (s0 * s0 + s2 * s2 - s1 * s1) / (2 * s0), y = Math.sqrt(Math.max(0, s2 * s2 - x * x)); return [[0, 0], [s0, 0], [x, y]]; }
  function triOK(s) { var a = s[0], b = s[1], c = s[2]; if (a + b <= c * 1.12 || a + c <= b * 1.12 || b + c <= a * 1.12) return false; var p = triFrom(a, b, c); return p[2][1] > 0.3 * Math.max(a, b, c); }
  function convex(P) { var sg = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length], c = P[(i + 2) % P.length], cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (Math.abs(cr) < 1e-6) return false; var s = cr > 0 ? 1 : -1; if (!sg) sg = s; else if (s !== sg) return false; } return sg > 0; }
  /* a convex quadrilateral (counterclockwise) with sides s0 = V0V1, s1, s2, s3 = V3V0 — or null */
  function quadFrom(s) {
    for (var th = 70; th <= 125; th += 5) {
      var V3 = [s[3] * Math.cos(th * Math.PI / 180), s[3] * Math.sin(th * Math.PI / 180)], V1 = [s[0], 0], dx = V3[0] - V1[0], dy = V3[1] - V1[1], d = Math.hypot(dx, dy);
      if (d > s[1] + s[2] - 1e-6 || d < Math.abs(s[1] - s[2]) + 1e-6) continue;
      var a = (s[1] * s[1] - s[2] * s[2] + d * d) / (2 * d), h = Math.sqrt(Math.max(0, s[1] * s[1] - a * a)), mx = V1[0] + a * dx / d, my = V1[1] + a * dy / d;
      var cands = [[mx - h * dy / d, my + h * dx / d], [mx + h * dy / d, my - h * dx / d]];
      for (var j = 0; j < 2; j++) { var Q = [[0, 0], V1, cands[j], V3]; if (convex(Q) && minAngle(Q) > 50) return Q; }
    }
    return null;
  }
  function minAngle(P) { var m = 180; for (var i = 0; i < P.length; i++) { var a = P[(i + P.length - 1) % P.length], b = P[i], c = P[(i + 1) % P.length], u = [a[0] - b[0], a[1] - b[1]], v = [c[0] - b[0], c[1] - b[1]]; var an = Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(u[0], u[1]) / Math.hypot(v[0], v[1])) * 180 / Math.PI; m = Math.min(m, an); } return m; }
  /* two similar polygons drawn side by side ("not drawn to scale": the image is drawn between 0.7 and 1.5 times the first) */
  function pairSVG(pts, o) {
    var dk = o.k > 1 ? Math.min(o.k, 1.45) : Math.max(o.k, 0.7);
    return G.similarSVG({ pts: pts, k: o.k, drawK: dk, names: o.names, labels: o.labels, rot: o.rot || 0, flip: !!o.flip, angles: o.angles, width: o.width || 440, aria: o.aria || 'two similar figures' });
  }
  Object.assign(KT, { triFrom: triFrom, triOK: triOK, quadFrom: quadFrom, convex: convex, pairSVG: pairSVG });

  HW.addCodes({
    'u6k-comma': 'Decimal comma', 'u6k-places': 'Not rounded as asked', 'u6k-round-dir': 'Rounded the wrong way', 'u6k-word': 'Answer word not recognised', 'u6k-yes-no': 'Said similar / not similar the wrong way',
    'u6k-type': 'Enlargement / reduction mixed up', 'u6k-one-letter': 'Typed more than one letter for a vertex', 'u6k-two-letters': 'Side not named with two letters', 'u6k-other-fig': 'Used the letters of the wrong figure',
    'u6k-not-letter': 'Used a letter that is not in the figure', 'u6k-order': 'Matched the letters by position, not by the naming order', 'u6k-one-box': 'One box not right', 'u6k-half-box': 'One of two boxes not right',
    'u6k-many-box': 'Several boxes not right'
  });
  HW.addPartial({ 'u6k-round-dir': 's', 'u6k-one-box': 's', 'u6k-half-box': 'b', 'u6k-many-box': 'n', 'u6k-order': 'n', 'u6k-other-fig': 'n', 'u6k-type': 'b', 'u6k-yes-no': 'n' });

  /* ======================================================================================================
   *  LESSON 6.1
   * ====================================================================================================== */
  HW.addCodes({
    'u6l1-angle-sum': 'Used the wrong angle sum (180° / 360° / 540°)', 'u6l1-forgot-angle': 'Left one angle out of the subtraction', 'u6l1-added-angles': 'Added the angles instead of subtracting from the sum',
    'u6l1-no-convert': 'Didn’t change to the same units (m and cm)', 'u6l1-in-cm': 'Gave the answer in cm when m was asked', 'u6l1-in-m': 'Gave the answer in m when cm was asked', 'u6l1-model-way': 'Used the model scale the wrong way (× instead of ÷)',
    'u6l1-one-top': 'Fraction not written with 1 on top', 'u6l1-as-fraction': 'Gave a decimal, not a fraction', 'u6l1-added-diff': 'Added the same amount instead of multiplying', 'u6l1-one-long': 'Left a side out of the perimeter',
    'u6l1-small-perim': 'Used the small figure’s perimeter', 'u6l1-cm-price': 'Multiplied centimetres by a price per metre', 'u6l1-k-sq': 'Areas: used k instead of k × k', 'u6l1-k-add': 'Added the scale factors instead of multiplying',
    'u6l1-not-sim': 'Called a stretched copy similar', 'u6l1-sim-not': 'Called a similar copy not similar', 'u6l1-wrong-k': 'Similar, but the wrong number', 'u6l1-jaxon': 'Repeated Jaxon’s upside-down scale factor'
  });
  HW.addPartial({ 'u6l1-angle-sum': 'b', 'u6l1-forgot-angle': 'b', 'u6l1-no-convert': 'b', 'u6l1-in-cm': 's', 'u6l1-in-m': 's', 'u6l1-model-way': 'n', 'u6l1-one-top': 's', 'u6l1-as-fraction': 's',
    'u6l1-added-diff': 'n', 'u6l1-one-long': 'b', 'u6l1-small-perim': 'b', 'u6l1-cm-price': 'b', 'u6l1-k-sq': 'b', 'u6l1-k-add': 'n', 'u6l1-wrong-k': 'b' });

  /* ---------------- Q1: copies on a grid ---------------- */
  var GSH = {   // 2 units wide; the L shape of the worked example (2 by 3) is left out
    house: [[0, 0], [2, 0], [2, 2], [1, 3], [0, 2]], roof: [[0, 0], [2, 0], [2, 1], [1, 2], [0, 1]], step: [[0, 0], [2, 0], [2, 2], [1, 2], [1, 1], [0, 1]],
    ramp: [[0, 0], [2, 0], [2, 2], [0, 1]], tri: [[0, 0], [2, 0], [0, 2]]
  };
  function shH(P) { return Math.max.apply(null, P.map(function (p) { return p[1]; })); }
  function copyPts(P, c) { return P.map(function (p) { return [(c.flip ? 2 - p[0] : p[0]) * c.sx, p[1] * c.sy]; }); }
  function gridCopiesSVG(P, copies) {
    var cs = 15, H = Math.max(shH(P), Math.max.apply(null, copies.map(function (c) { return shH(c.pts); }))) + 1, x0 = 1, items = [{ pts: P, name: 'Original' }].concat(copies);
    var pos = items.map(function (it) { var w = Math.max.apply(null, it.pts.map(function (p) { return p[0]; })), at = x0; x0 += Math.ceil(w) + 2; return at; });
    var W = x0 - 1, s = '', d = '';
    for (var i = 0; i <= W; i++) d += 'M' + i * cs + ' 0V' + H * cs; for (var j = 0; j <= H; j++) d += 'M0 ' + j * cs + 'H' + W * cs;
    s += '<path d="' + d + '" stroke="#cfd5df" stroke-width="0.8" fill="none"/>';
    items.forEach(function (it, k) {
      var pts = it.pts.map(function (p) { return (pos[k] + p[0]) * cs + ',' + (H - p[1]) * cs; }).join(' '), w = Math.max.apply(null, it.pts.map(function (p) { return p[0]; }));
      s += '<polygon points="' + pts + '" fill="' + (k ? '#dbe7fb' : '#e9edf4') + '" stroke="' + (k ? '#1f5bd6' : '#1d2633') + '" stroke-width="2" stroke-linejoin="round"/>';
      s += '<text x="' + (pos[k] + w / 2) * cs + '" y="' + (H * cs + 16) + '" font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#1d2633">' + it.name + '</text>';
    });
    return '<svg class="fig-svg" viewBox="-4 -4 ' + (W * cs + 8) + ' ' + (H * cs + 28) + '" width="100%" style="max-width:' + Math.round(Math.min(560, (W * cs + 8) * 1.3)) + 'px" role="img" aria-label="an original shape and four copies on a grid">' + s + '</svg>';
  }
  function q1Shared(r) {
    var nm = r.pick(Object.keys(GSH)), P = GSH[nm], h = shH(P);
    var sims = [{ k: 2 }, { k: 1.5 }, { k: 1, flip: true }].concat(h <= 2 ? [{ k: 3 }] : []), str = [{ sx: 2, sy: 1 }, { sx: 1, sy: 2 }, { sx: 1, sy: 1.5 }, { sx: 1.5, sy: 1 }].concat(h <= 2 ? [{ sx: 1, sy: 3 }, { sx: 3, sy: 1.5 }] : []);
    var nSim = r.pick([2, 2, 3]), chosen = r.sample(sims, nSim).map(function (c) { return { sx: c.k, sy: c.k, flip: !!c.flip, k: c.k }; }).concat(r.sample(str, 4 - nSim).map(function (c) { return { sx: c.sx, sy: c.sy, flip: r.chance(0.3), k: null }; }));
    chosen = r.shuffle(chosen);
    chosen.forEach(function (c, i) { c.name = 'ABCD'.charAt(i); c.pts = copyPts(P, c); });
    return { P: P, h: h, copies: chosen, svg: gridCopiesSVG(P, chosen) };
  }
  function kId(k) { return k == null ? 'no' : 'k' + nS(k); }
  function copyWork(P, c) {
    var w = 2, h = shH(P), w2 = w * c.sx, h2 = h * c.sy;
    var s = c.name + ': width ' + N(w) + ' → ' + N(w2) + ', height ' + N(h) + ' → ' + N(h2);
    return s + (c.k != null ? ': every length ' + t('\\times ' + N(c.k)) + (c.flip ? ' (flipped, ' + (c.k === 1 ? 'same size: congruent' : 'but the same shape') + ')' : '') + '. Similar.' : ': not multiplied by the same number (stretched ' + (c.sx !== c.sy && c.sx > c.sy ? 'sideways' : 'up') + '). Not similar.');
  }

  /* ---------------- Q2: true or false, with a reason ---------------- */
  function tfA(r) {
    if (r.chance(0.5)) return { s: 'Two congruent figures are also similar.', opts: [
      { html: '<b>True.</b> Congruent figures have the same shape (every side is multiplied by 1).', right: true },
      { html: '<b>False.</b> Similar figures must be different sizes.', why: 'Similar figures <i>can</i> be the same size: a scale factor of 1 is allowed.', code: 'tf-diff-size' },
      { html: '<b>False.</b> Congruent figures can have different angles.', why: 'Congruent figures have the same angles <b>and</b> the same sides.', code: 'tf-cong-angles' },
      { html: '<b>True.</b> Any two figures with the same number of sides are similar.', why: 'True is right, but not that reason: a square and a long thin rectangle both have 4 sides and are not similar.', code: 'tf-sides' }],
      sol: 'True. Congruent figures have the same shape and the same size. Every side is multiplied by 1, so they are similar too.' };
    return { s: 'If two figures are similar, they must be congruent.', opts: [
      { html: '<b>False.</b> Similar figures have the same shape, but they can be different sizes.', right: true },
      { html: '<b>True.</b> Similar figures have equal angles, so they are the same size.', why: 'Equal angles don’t make the same size: a photo and a big poster of it have equal angles.', code: 'tf-angles-size' },
      { html: '<b>True.</b> Similar figures always have a scale factor of 1.', why: 'A scale factor can be any positive number (2, 0.5, 1.5, …). Only congruent figures have k = 1.', code: 'tf-k1' },
      { html: '<b>False.</b> Similar figures have different angles.', why: 'False is right, but not that reason: similar figures have <b>equal</b> angles.', code: 'tf-diff-angles' }],
      sol: 'False. Similar figures have the same shape, but one can be bigger or smaller (a photo and a poster). Only when k = 1 are they congruent.' };
  }
  function tfB(r) {
    var v = r.pick([['enlarged', 'bigger', false], ['reduced', 'smaller', false], ['enlarged', 'the same size', true], ['reduced', 'the same size', true]]), how = v[0] === 'enlarged' ? 'longer' : 'shorter';
    var s = 'When a figure is ' + v[0] + ', its angles ' + (v[2] ? 'stay ' : 'get ') + v[1] + '.';
    var opts = v[2] ? [
      { html: '<b>True.</b> Corresponding angles of similar figures are equal. Only the sides get ' + how + '.', right: true },
      { html: '<b>False.</b> The angles get ' + (v[0] === 'enlarged' ? 'bigger' : 'smaller') + ' by the scale factor.', why: 'Angles are never multiplied by k. Picture a photo and a poster: the corners are the same.', code: 'tf-angles-k' },
      { html: '<b>False.</b> Some angles get bigger and some get smaller.', why: 'In an enlargement or reduction no angle changes at all.', code: 'tf-some' },
      { html: '<b>True.</b> The sides also stay the same length.', why: 'True is right, but not that reason: the sides do change (they get ' + how + ').', code: 'tf-sides-same' }] : [
      { html: '<b>False.</b> Corresponding angles of similar figures are equal. Only the sides get ' + how + '.', right: true },
      { html: '<b>True.</b> Every part of the figure is multiplied by the scale factor.', why: 'Every <b>length</b> is multiplied by k, but the angles stay the same.', code: 'tf-angles-k' },
      { html: '<b>True.</b> ' + (v[0] === 'enlarged' ? 'Bigger' : 'Smaller') + ' figures always have ' + (v[0] === 'enlarged' ? 'bigger' : 'smaller') + ' angles.', why: 'A small square and a big square both have 90° angles.', code: 'tf-bigger' },
      { html: '<b>False.</b> The angles get ' + (v[0] === 'enlarged' ? 'smaller' : 'bigger') + ' instead.', why: 'False is right, but not that reason: the angles don’t change at all.', code: 'tf-other-way' }];
    return { s: s, opts: opts, sol: (v[2] ? 'True' : 'False') + '. Corresponding angles of similar figures are equal. When a figure is ' + v[0] + ', only its sides get ' + how + '.' };
  }
  function tfC(r) {
    var k = r.pick([0.5, 0.8, 0.75, 0.6, 0.4, 1.5, 2.5, 1.25, 3]), claim = r.pick(['an enlargement', 'a reduction']), isEn = k > 1, truth = (claim === 'an enlargement') === isEn, kk = N(k);
    var real = isEn ? 'an enlargement: each new side is ' + kk + ' times as long' : 'a reduction: each new side is shorter (' + kk + ' of the original)';
    var right = (truth ? '<b>True.</b> ' : '<b>False.</b> ') + kk + ' is ' + (isEn ? 'more' : 'less') + ' than 1, so it is ' + (isEn ? 'an enlargement' : 'a reduction') + '.';
    var opts = [{ html: right, right: true }];
    if (!isEn) {
      opts.push({ html: (truth ? '<b>False.</b> ' : '<b>True.</b> ') + 'Multiplying always makes a length longer.', why: 'Multiplying by a number less than 1 makes it shorter: ' + t('10\\times ' + kk + '=' + N(10 * k)) + '.', code: 'tf-mult-bigger' });
      opts.push({ html: (truth ? '<b>False.</b> ' : '<b>True.</b> ') + 'A scale factor makes a new figure, and a new figure is always bigger.', why: 'A new figure can be smaller: that is a reduction (k < 1).', code: 'tf-new-bigger' });
    } else {
      opts.push({ html: (truth ? '<b>False.</b> ' : '<b>True.</b> ') + 'Dividing by ' + kk + ' makes the figure smaller.', why: 'With a scale factor you <b>multiply</b> every side by k, and multiplying by ' + kk + ' (more than 1) makes it longer.', code: 'tf-divide' });
      opts.push({ html: (truth ? '<b>False.</b> ' : '<b>True.</b> ') + 'A scale factor only changes the angles.', why: 'A scale factor changes the <b>sides</b>; the angles stay the same.', code: 'tf-angles' });
    }
    opts.push({ html: (truth ? '<b>True.</b> ' : '<b>False.</b> ') + (isEn ? 'Every scale factor makes an enlargement.' : 'Any decimal scale factor makes a reduction.'), why: (truth ? 'True' : 'False') + ' is right, but not that reason: ' + (isEn ? '0.5 makes a reduction.' : '1.5 is a decimal and makes an enlargement.') + ' Compare k with 1.', code: 'tf-bad-reason' });
    return { s: 'A scale factor of ' + kk + ' makes ' + claim + '.', opts: opts, sol: (truth ? 'True' : 'False') + '. ' + kk + ' is ' + (isEn ? 'more' : 'less') + ' than 1, so it makes ' + real + '.' };
  }
  function tfPart(r, b, hint) { return mc(r, '“' + b.s + '” True or false? Choose the answer with the right reason.', b.opts, b.sol, [hint], 'TF ' + b.s); }

  /* ---------------- corresponding parts ---------------- */
  /* a second name in a scrambled order sometimes (still a proper name: a rotation or reversal of the letters) */
  function corrNames(r, list, scramble) {
    var nm = twoNames(r, list), a = nm[0], b = nm[1];
    if (scramble && r.chance(0.45)) { var L = b.split(''), s = r.int(1, L.length - 1); L = L.slice(s).concat(L.slice(0, s)); if (r.chance(0.5)) L = [L[0]].concat(L.slice(1).reverse()); b = L.join(''); }
    return [a, b];
  }
  function corrTable(a, b) { return table(null, [['In ' + t(a)].concat(a.split('').map(function (c) { return t(c); })), ['In ' + t(b)].concat(b.split('').map(function (c) { return t(c); }))]); }
  function corrFields(a, b, which) {   // which: 'angles' | 'sides' | 'both'
    var specs = [], o = { pool: b, poolName: b, otherPool: a, otherName: a };
    if (which !== 'sides') a.split('').forEach(function (c, i) { specs.push(nameFld(t('\\angle ' + c) + ' matches', b.charAt(i), Object.assign({ angle: true, name: '∠' + c, before: t('\\angle'), hint: c + ' is letter ' + (i + 1) + ' of ' + a + ', so it matches letter ' + (i + 1) + ' of ' + b + '. Read down the columns.' }, o))); });
    if (which !== 'angles') a.split('').forEach(function (c, i) { var sa = sideOf(a, i), sb = sideOf(b, i); specs.push(nameFld('Side ' + t(sa) + ' matches', sb, Object.assign({ name: sa, hint: sa + ' uses letters ' + (i + 1) + ' and ' + ((i + 1) % a.length + 1) + ' of ' + a + ', so it matches letters ' + (i + 1) + ' and ' + ((i + 1) % a.length + 1) + ' of ' + b + '.' }, o))); });
    return specs;
  }
  function corrSol(a, b, which) {
    var L = [t(a + '\\sim ' + b) + ': ' + a.split('').map(function (c, i) { return t(c + '\\leftrightarrow ' + b.charAt(i)); }).join(', ')];
    if (which !== 'sides') L.push('Angles: ' + a.split('').map(function (c, i) { return t('\\angle ' + c + '=\\angle ' + b.charAt(i)); }).join(', '));
    if (which !== 'angles') L.push('Sides: ' + a.split('').map(function (c, i) { return t(sideOf(a, i)) + ' and ' + t(sideOf(b, i)); }).join(', '));
    return br(L);
  }

  Object.assign(KT, { corrNames: corrNames, corrFields: corrFields, corrSol: corrSol, corrTable: corrTable });

  /* ---------------- k / type tables ---------------- */
  var UNITS = ['cm', 'm', 'in', 'ft'];
  var EX_ROWS = [[4, 10], [12, 3], [15, 6], [7, 7], [2.4, 8.4]];
  function kRows(r) {
    var types = r.shuffle(['en', 'en', 're', 're', r.pick(['same', 'en', 're'])].slice(0, 4).concat(['same'])), rows = [], used = {};
    types.forEach(function (ty) {
      var row = find(function () {
        var o, k;
        if (ty === 'en') { o = r.pick([2, 2.5, 3, 3.2, 4, 5, 6, 8, 1.5, 1.2, 2.4]); k = r.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]); }
        else if (ty === 're') { o = r.pick([10, 12, 16, 20, 25, 30, 40, 50, 60, 80]); k = r.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]); }
        else { o = r.pick([3, 6, 8, 9, 11, 13, 4.5]); k = 1; }
        return { o: o, n: q(o * k), k: k, u: r.pick(UNITS) };
      }, function (w) { return places(w.n) <= 1 && w.n < 100 && !used[w.o + ':' + w.n] && !EX_ROWS.some(function (e) { return near(e[0], w.o) && near(e[1], w.n); }) && !rows.some(function (x) { return near(x.k, w.k); }); });
      used[row.o + ':' + row.n] = 1; rows.push(row);
    });
    return rows;
  }
  function kRowsTable(rows) { return table(['', 'Original', 'New'], rows.map(function (w, i) { return ['(' + 'abcde'.charAt(i) + ')', U(w.o, w.u), U(w.n, w.u)]; })); }
  function kRowsSol(rows) { return br(rows.map(function (w, i) { return '(' + 'abcde'.charAt(i) + ') ' + t('k=' + N(w.n) + '\\div ' + N(w.o) + '=' + N(w.k)) + ': ' + typeOf(w.k); })); }
  function kRowsPart(rows, text) {
    return fieldsPart('Find the scale factor ' + t('k') + ' for each row.' + kRowsTable(rows), rows.map(function (w, i) { return kFld('(' + 'abcde'.charAt(i) + ') ' + t('k='), w.k, { name: '(' + 'abcde'.charAt(i) + ')', from: { new: w.n, orig: w.o } }); }),
      kRowsSol(rows), ['k = new ÷ original (the new length on top).'], text);
  }
  function typeRowsPart(rows, text) {
    var cols = [{ id: 'enlargement', html: 'enlargement' }, { id: 'reduction', html: 'reduction' }, { id: 'same size', html: 'same size' }], want = {};
    rows.forEach(function (w, i) { want['r' + i] = typeOf(w.k); });
    return P.grid('Is each one an enlargement, a reduction, or the same size?' + kRowsTable(rows), rows.map(function (w, i) { return { id: 'r' + i, html: '(' + 'abcde'.charAt(i) + ') ' + U(w.o, w.u) + ' → ' + U(w.n, w.u) }; }), cols, want,
      { why: function (row, got, wt) { return { code: 'u6k-type', hint: 'Look at row ' + row.replace('r', '(').replace(/\d/, function (d) { return 'abcde'.charAt(+d); }) + '): is the new length bigger, smaller, or the same? (k > 1: enlargement; k < 1: reduction; k = 1: same size.)' }; } },
      kRowsSol(rows), ['Bigger new figure (k > 1): enlargement. Smaller (k < 1): reduction. Equal (k = 1): same size.'], text);
  }

  /* ---------------- scale-factor problems ---------------- */
  function kWork(newS, origS, k) { return t('k=\\dfrac{\\text{new}}{\\text{original}}=\\dfrac{' + newS + '}{' + origS + '}=' + N(k)); }
  /* a fraction with 1 on top (k = 1/n): a decimal or another form of the fraction gets a nudge */
  function oneOverChk(n, o) {
    var base = kChk(1 / n, o);
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/^\s*k\s*=\s*/i, ''), a = K.read(raw);
      if (!a.res && isFinite(a.val)) {
        var pl = HW.parse.plain(raw).replace(/\s/g, ''), fr = /^\(?(\d+)\)?\/\(?(\d+)\)?$/.exec(pl);
        if (near(a.val, 1 / n, 1e-9)) { if (fr && +fr[1] === 1) return ok(); if (fr) return form('u6l1-one-top', 'Right value — now write it with 1 on top: divide the top and the bottom by ' + fr[1] + '.'); }
        if (!fr && /\./.test(pl) && Math.abs(a.val - 1 / n) < 0.006) return form('u6l1-as-fraction', 'Close, but write k as a <b>fraction with 1 on top</b>, like ' + t('\\frac{1}{\\square}') + '. (Flip it: real ÷ model tells you the number on the bottom.)');
      }
      return base(resp);
    };
  }
  /* a 1 : n model scale */
  function scaleTxt(n) { return '1&#8239;:&#8239;' + n; }

  /* ---------------- Q8 / Q9 / e5: similar figures with labelled sides ---------------- */
  function triShared(r) {
    var nm = twoNames(r, TRIS), k = r.pick([0.4, 0.5, 0.6, 0.75, 0.8, 1.5, 2, 2.5, 1.25]);
    var S = find(function () { var big = k < 1; var s = [0, 0, 0].map(function () { return big ? r.int(5, 20) : r.int(3, 12); }); return s; },
      function (s) { return triOK(s) && s[0] !== s[1] && s[1] !== s[2] && s[0] !== s[2] && s.every(function (x) { return places(x * k) <= 1; }); });
    var perm = r.shuffle([0, 1, 2]);   // [known pair, unknown in the new (× k), unknown in the original (÷ k)]
    return { a: nm[0], b: nm[1], k: k, S: S, T: S.map(function (x) { return q(x * k); }), iK: perm[0], iM: perm[1], iD: perm[2], rot: r.pick([0, 180, 160, 200, -90, 90]), flip: r.chance(0.5) };
  }
  function triFig(sh, u) {
    var L0 = [0, 1, 2].map(function (i) { return i === sh.iD ? 'x' : N(sh.S[i]) + ' ' + u; }), L1 = [0, 1, 2].map(function (i) { return i === sh.iM ? 'y' : N(sh.T[i]) + ' ' + u; });
    return pairSVG(triFrom(sh.S[0], sh.S[1], sh.S[2]), { k: sh.k, names: [sh.a, sh.b], labels: [L0, L1], rot: sh.rot, flip: sh.flip, width: 420 });
  }

  HW.defineLesson({
    id: 'u6l1', unit: 6, num: '1', title: 'Similar Polygons and Scale Factor', outcome: 'G3',
    blurb: 'Same shape, different size: matching corners and sides in naming order, the scale factor k = new ÷ original, enlargements and reductions, models, and missing sides.',
    questions: [
      { num: '1', stem: function (sh) { return 'Each small square is 1 unit. For each copy, is it similar to the original? If yes, what number was every length multiplied by?' + sh.svg; }, shared: q1Shared, parts: [
        { id: '1', level: 'EMG', make: function (r, sh) {
          var cols = [{ id: 'no', html: 'not similar' }, { id: 'k1', html: 'similar, ×1' }, { id: 'k1.5', html: 'similar, ×1.5' }, { id: 'k2', html: 'similar, ×2' }, { id: 'k3', html: 'similar, ×3' }], want = {};
          sh.copies.forEach(function (c) { want[c.name] = kId(c.k); });
          return P.grid('Choose one answer for each copy.', sh.copies.map(function (c) { return { id: c.name, html: 'Copy ' + c.name }; }), cols, want, {
            why: function (row, got, wt) {
              var c = sh.copies.filter(function (x) { return x.name === row; })[0], w2 = 2 * c.sx, h2 = sh.h * c.sy;
              if (wt === 'no') return { code: 'u6l1-not-sim', hint: 'Copy ' + row + ': the width went 2 → ' + N(w2) + ' but the height went ' + sh.h + ' → ' + N(h2) + '. Were they multiplied by the same number?' };
              if (got === 'no') return { code: 'u6l1-sim-not', hint: 'Copy ' + row + ': check the width (2 → ' + N(w2) + ') and the height (' + sh.h + ' → ' + N(h2) + '). ' + (c.flip ? 'Flipping doesn’t change the shape.' : 'Both are multiplied by the same number.') };
              return { code: 'u6l1-wrong-k', hint: 'Copy ' + row + ' is similar, but check the number: the width went from 2 to ' + N(w2) + '.' };
            } }, br(sh.copies.map(function (c) { return copyWork(sh.P, c); })), ['Count the width and the height of each copy. Similar means <b>both</b> were multiplied by the same number.', 'Turning or flipping doesn’t change the shape.'], 'grid copies');
        } }] },
      { num: '2', stem: 'True or false? Explain each answer.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return tfPart(r, tfA(r), 'Similar = same shape (any size). Congruent = same shape and same size.'); } },
        { id: '2b', level: 'BEG', make: function (r) { return tfPart(r, tfB(r), 'What happens to the corners of a photo when you make a poster of it?'); } },
        { id: '2c', level: 'BEG', make: function (r) { return tfPart(r, tfC(r), 'k > 1: enlargement. k < 1: reduction. k = 1: same size.'); } }] },
      { num: '3', stem: function (sh) { return t(sh.a + '\\sim ' + sh.b) + '.'; }, shared: function (r) { var nm = corrNames(r, QUADS, true); return { a: nm[0], b: nm[1] }; }, parts: [
        { id: '3a', level: 'EMG', make: function (r, sh) { return fieldsPart('(a) Complete the table of corresponding parts.', corrFields(sh.a, sh.b, 'both'), corrSol(sh.a, sh.b, 'both'),
          ['Write ' + sh.a + ' above ' + sh.b + ' and read down the columns.', 'A side uses two letters next to each other: the matching side uses the matching two letters.'], 'corr table'); } },
        { id: '3b', level: 'EMG', make: function (r, sh) {
          var a = sh.a, b = sh.b, F = function (i) { return sideOf(a, i); }, S = function (i) { return sideOf(b, i); }, bx = function (n) { return '\\boxed{\\,' + n + '\\,}'; };
          var oT = { pool: b, poolName: b, otherPool: a, otherName: a, hint: 'The tops are sides of ' + b + ' (new). Use the naming order to find the side that matches.' }, oB = { pool: a, poolName: a, otherPool: b, otherName: b, hint: 'The bottoms are sides of ' + a + ' (original). Use the naming order to find the side that matches.' };
          return fieldsPart('(b) Complete the equal ratios: ' + t('\\dfrac{' + S(0) + '}{' + F(0) + '}=\\dfrac{' + bx(1) + '}{' + F(1) + '}=\\dfrac{' + S(2) + '}{' + bx(2) + '}=\\dfrac{' + bx(3) + '}{' + bx(4) + '}'),
            [nameFld('Box 1:', S(1), oT), nameFld('Box 2:', F(2), oB), nameFld('Box 3:', S(3), oT), nameFld('Box 4:', F(3), oB)],
            t('\\dfrac{' + S(0) + '}{' + F(0) + '}=\\dfrac{' + S(1) + '}{' + F(1) + '}=\\dfrac{' + S(2) + '}{' + F(2) + '}=\\dfrac{' + S(3) + '}{' + F(3) + '}') + '<br>Each ratio is a side of ' + b + ' over the matching side of ' + a + '.',
            ['Every ratio is (side of ' + b + ') ÷ (matching side of ' + a + '), in the same order every time.'], 'equal ratios');
        } }] },
      { num: '4', stem: '', parts: [
        { id: '4', level: 'EMG', make: function (r) {
          var nm = twoNames(r, TRIS), a = nm[0], b = nm[1], v = find(function () { return [r.int(30, 72), r.int(55, 110)]; }, function (v) { var c = 180 - v[0] - v[1]; return c >= 22 && c !== v[0] && c !== v[1] && v[0] !== v[1] && !(v[0] === 52 && v[1] === 71); }), c = 180 - v[0] - v[1], A = [v[0], v[1], c];
          var specs = [angFld(t('\\angle ' + a.charAt(2) + '='), c, [{ v: 180 - v[0], code: 'u6l1-forgot-angle', hint: 'Subtract <b>both</b> given angles from 180°.' }, { v: 360 - v[0] - v[1], code: 'u6l1-angle-sum', hint: 'The angles in a <b>triangle</b> add up to 180°, not 360°.' }, { v: v[0] + v[1], code: 'u6l1-added-angles', hint: 'Subtract the two angles from 180°.' }], '∠' + a.charAt(2))];
          b.split('').forEach(function (L, i) { specs.push(angFld(t('\\angle ' + L + '='), A[i], A.filter(function (x, j) { return j !== i; }).map(function (x) { return { v: x, code: 'u6k-order', hint: L + ' is letter ' + (i + 1) + ' of ' + b + ', so it matches letter ' + (i + 1) + ' of ' + a + ': ' + t('\\angle ' + a.charAt(i)) + '.' }; }), '∠' + L)); });
          return fieldsPart(t('\\triangle ' + a + '\\sim\\triangle ' + b) + '. ' + t('\\angle ' + a.charAt(0) + '=' + dgT(v[0])) + ' and ' + t('\\angle ' + a.charAt(1) + '=' + dgT(v[1])) + '. Find ' + t('\\angle ' + a.charAt(2)) + ', ' + b.split('').map(function (L) { return t('\\angle ' + L); }).join(', ') + '.', specs,
            br([t('\\angle ' + a.charAt(2) + '=180^\\circ-' + dgT(v[0]) + '-' + dgT(v[1]) + '=' + dgT(c)) + ' (angles in a triangle)', 'Corresponding angles are equal: ' + b.split('').map(function (L, i) { return t('\\angle ' + L + '=\\angle ' + a.charAt(i) + '=' + dgT(A[i])); }).join(', ')]),
            ['The angles in a triangle add up to 180°.', 'Match the letters in order: 1st with 1st, 2nd with 2nd, 3rd with 3rd.'], 'triangle angles');
        } }] },
      { num: '5', stem: function (sh) { return 'Pentagon ' + t(sh.a) + ' ' + t('\\sim') + ' pentagon ' + t(sh.b) + '. ' + [0, 1, 2, 3].map(function (i) { return t('\\angle ' + sh.b.charAt(i) + '=' + dgT(sh.A[i])); }).join(', ') + '. You don’t need a picture: use the naming order.'; },
        shared: function (r) { var nm = twoNames(r, PENTS); return { a: nm[0], b: nm[1], A: find(function () { var x = [0, 1, 2, 3].map(function () { return r.int(92, 128); }); x.push(540 - x.reduce(function (s, y) { return s + y; }, 0)); return x; }, function (x) { return x[4] >= 88 && x[4] <= 135 && x.slice(0, 4).every(function (y) { return y !== x[4]; }); }) }; }, parts: [
        { id: '5a', level: 'EMG', make: function (r, sh) { var s4 = sh.A[0] + sh.A[1] + sh.A[2] + sh.A[3], z = sh.b.charAt(4);
          return num('(a) Find ' + t('\\angle ' + z) + '. (The angles in a pentagon add up to 540°.)', sh.A[4], { after: '°', diag: [{ v: 360 - s4, code: 'u6l1-angle-sum', hint: 'A pentagon’s angles add up to <b>540°</b> (360° is for a quadrilateral).' }, { v: 720 - s4, code: 'u6l1-angle-sum', hint: 'A pentagon’s angles add up to <b>540°</b>.' }, { v: s4, code: 'u6l1-added-angles', hint: 'Subtract the four angles from 540°.' }],
            sol: t('\\angle ' + z + '=540^\\circ-' + sh.A.slice(0, 4).map(dgT).join('-') + '=' + dgT(sh.A[4])), hints: ['Subtract the four known angles from 540°.'], text: 'pentagon angle' }); } },
        { id: '5b', level: 'EMG', make: function (r, sh) {
          return fieldsPart('(b) Find the five angles of ' + t(sh.a) + '.', sh.a.split('').map(function (L, i) { return angFld(t('\\angle ' + L + '='), sh.A[i], sh.A.filter(function (x, j) { return j !== i; }).map(function (x) { return { v: x, code: 'u6k-order', hint: L + ' is letter ' + (i + 1) + ' of ' + sh.a + ', so it matches letter ' + (i + 1) + ' of ' + sh.b + ' (' + t('\\angle ' + sh.b.charAt(i)) + ').' }; }), '∠' + L); }),
            br([t(sh.a.split('').map(function (L, i) { return L + '\\leftrightarrow ' + sh.b.charAt(i); }).join(',\\ ')), sh.a.split('').map(function (L, i) { return t('\\angle ' + L + '=' + dgT(sh.A[i])); }).join(', ')]), ['Corresponding angles are equal. Use the naming order.', 'The last one is the angle you found in (a).'], 'pentagon five');
        } }] },
      { num: '6', stem: 'Complete the table: find the scale factor and the type.', shared: kRows, parts: [
        { id: '6k', sub: 'k', level: 'EMG', make: function (r, sh) { return kRowsPart(sh, 'k table'); } },
        { id: '6t', sub: 'type', level: 'BEG', make: function (r, sh) { return typeRowsPart(sh, 'type table'); } }] },
      { num: '7', stem: 'Change to the same units first, then find the scale factor.', parts: [
        { id: '7a', level: 'PRG', make: function (r) {
          var v = find(function () { return { w: r.pick([4, 5, 6, 8, 10, 12]), k: r.pick([15, 20, 25, 30, 40, 50]) }; }, function (v) { return !(v.w === 5 && v.k === 24) && v.w * v.k <= 400; }), cm = v.w * v.k, m = cm / 100;
          var it = r.pick([['A cookie cutter', 'a giant cookie-shaped sign for a bakery in Airdrie', 'cookie cutter', 'sign'], ['A team crest on a ball cap', 'a crest painted on the arena wall', 'cap crest', 'wall crest'], ['A sticker', 'a matching window decal for a store in Cochrane', 'sticker', 'decal']]);
          return kPart(it[0] + ' is ' + U(v.w, 'cm') + ' wide. ' + cap(it[1].replace(/^a /, 'There is a ')) + ' that is ' + U(m, 'm') + ' wide. Find the scale factor from the ' + it[2] + ' to the ' + it[3] + '.', v.k,
            { from: { new: cm, orig: v.w }, diag: [{ v: m / v.w, code: 'u6l1-no-convert', hint: 'Change ' + U(m, 'm') + ' to centimetres first (× 100) so both lengths are in cm.' }],
              sol: br([U(m, 'm') + ' = ' + U(cm, 'cm'), kWork(N(cm), N(v.w), v.k) + ' (an enlargement)']), hints: ['1 m = 100 cm.', 'k = new ÷ original.'], text: 'cutter sign' });
        } },
        { id: '7b', level: 'PRG', make: function (r) {
          var v = find(function () { return { t: r.pick([10, 12, 15, 16, 20, 24, 25]), n: r.pick([20, 24, 25, 30, 32, 40, 50]) }; }, function (v) { return !(v.t === 18) && v.t * v.n >= 300 && v.t * v.n <= 1200; }), cm = v.t * v.n, m = cm / 100;
          var it = r.pick([['canoe', 'toy canoe'], ['kayak', 'toy kayak'], ['pickup truck', 'toy truck'], ['school bus', 'toy bus']]);
          var p = kPart('A real ' + it[0] + ' is ' + U(m, 'm') + ' long. A ' + it[1] + ' is ' + U(v.t, 'cm') + ' long. Find the scale factor from the real ' + it[0] + ' to the toy, as a fraction with 1 on top.', [1, v.n], {
            sol: br([U(m, 'm') + ' = ' + U(cm, 'cm'), t('k=\\dfrac{\\text{new}}{\\text{original}}=\\dfrac{' + v.t + '}{' + cm + '}'), 'Flip it to see it better: ' + t(cm + '\\div ' + v.t + '=' + v.n) + ', so ' + t('k=\\dfrac{1}{' + v.n + '}') + ' (a reduction).']),
            hints: ['Change metres to centimetres first.', 'The toy is the new figure: k = toy ÷ real. Then find real ÷ toy to get the number under the 1.'], text: 'toy fraction' });
          p.check = oneOverChk(v.n, { from: { new: v.t, orig: cm }, diag: [{ v: v.t / m, code: 'u6l1-no-convert', hint: 'Change ' + U(m, 'm') + ' to centimetres first.' }, { v: 1 / (cm / v.t / 100), code: 'u6l1-no-convert', hint: 'Change ' + U(m, 'm') + ' to centimetres first.' }] });
          p.key = '\\frac{1}{' + v.n + '}'; p.bad = [String(v.n), '\\frac{' + v.t + '}{' + m + '}'];
          return p;
        } }] },
      { num: '8', stem: function (sh) { return t('\\triangle ' + sh.a + '\\sim\\triangle ' + sh.b) + '. The diagrams are not drawn to scale.' + triFig(sh, 'cm'); }, shared: triShared, parts: [
        { id: '8a', level: 'EMG', make: function (r, sh) { var i = sh.iK, sa = sideOf(sh.a, i), sb = sideOf(sh.b, i);
          return fieldsPart('(a) Find the scale factor from ' + t('\\triangle ' + sh.a) + ' to ' + t('\\triangle ' + sh.b) + '. Is it an enlargement or a reduction?', [kFld(t('k='), sh.k, { from: { new: sh.T[i], orig: sh.S[i] } }), typeFld('Type:', sh.k)],
            br([t(sa) + ' and ' + t(sb) + ' are both known.', kWork(N(sh.T[i]), N(sh.S[i]), sh.k) + ', ' + (sh.k > 1 ? 'an enlargement (k > 1)' : 'a reduction (k < 1)') + '.']), ['Find the pair of matching sides where you know both lengths.', 'k = new ÷ original.'], 'tri k'); } },
        { id: '8b', level: 'EMG', make: function (r, sh) { var i = sh.iM, sa = sideOf(sh.a, i), sb = sideOf(sh.b, i), y = sh.T[i];
          return lenPart('(b) Find ' + t('y') + ' (side ' + t(sb) + ').', y, { unit: 'cm', scale: { len: sh.S[i], k: sh.k, op: 'mul' }, sol: br(['A side of the new triangle: multiply by k.', t(sb + '=' + N(sh.k) + '\\times ' + sa + '=' + N(sh.k) + '\\times ' + N(sh.S[i]) + '=' + N(y)) + ' cm']), hints: [sb + ' matches ' + sa + '.', 'New side = k × original side.'], text: 'tri y' }); } },
        { id: '8c', level: 'PRG', make: function (r, sh) { var i = sh.iD, sa = sideOf(sh.a, i), sb = sideOf(sh.b, i), x = sh.S[i];
          return lenPart('(c) Find ' + t('x') + ' (side ' + t(sa) + ').', x, { unit: 'cm', scale: { len: sh.T[i], k: sh.k, op: 'div' }, sol: br(['A side of the original triangle: divide by k.', t(sa + '=' + sb + '\\div ' + N(sh.k) + '=' + N(sh.T[i]) + '\\div ' + N(sh.k) + '=' + N(x)) + ' cm']), hints: [sa + ' matches ' + sb + '.', 'Original side = new side ÷ k.'], text: 'tri x' }); } }] },
      { num: '9', stem: function (sh) { var L0 = [0, 1, 2, 3].map(function (i) { return i === sh.iD ? '?' : N(sh.S[i]) + ' m'; }), L1 = [0, 1, 2, 3].map(function (i) { return i === sh.iM[0] || i === sh.iM[1] ? '?' : N(sh.T[i]) + ' m'; });
          return t(sh.a + '\\sim ' + sh.b) + '. The diagrams are not drawn to scale.' + pairSVG(sh.pts, { k: sh.k, names: [sh.a, sh.b], labels: [L0, L1], rot: sh.rot, flip: false, width: 440 }); },
        shared: function (r) {
          var nm = twoNames(r, QUADS), k, S = find(function () { k = r.pick([1.5, 2, 2.5, 3, 4, 1.25, 0.5, 0.4]); var kk = k; var s = [0, 1, 2, 3].map(function () { return kk < 1 || kk === 1.25 ? r.int(4, 16) : r.int(4, 14) / 2; }); s.k = k; return s; },
            function (s) { if (!s.every(function (x) { return places(x * s.k) <= 1; }) || new Set(s).size < 3 || (near(s[0], 8) && near(s[1], 5) && near(s[3], 6))) return false; var Q = quadFrom(s); if (!Q) return false; s.Q = Q; return true; }); k = S.k;
          var o = r.int(0, 3);
          return { a: nm[0], b: nm[1], k: k, S: S, T: S.map(function (x) { return q(x * k); }), pts: S.Q, iK: o, iM: [(o + 1) % 4, (o + 3) % 4], iD: (o + 2) % 4, rot: r.pick([-90, 90, 180, 0]) };
        }, parts: [
        { id: '9a', level: 'EMG', make: function (r, sh) { var i = sh.iK; return kPart('(a) Find the scale factor from ' + t(sh.a) + ' to ' + t(sh.b) + '.', sh.k, { from: { new: sh.T[i], orig: sh.S[i] }, sol: br([t(sideOf(sh.a, i)) + ' and ' + t(sideOf(sh.b, i)) + ' are both known.', t('k=\\dfrac{' + sideOf(sh.b, i) + '}{' + sideOf(sh.a, i) + '}=\\dfrac{' + N(sh.T[i]) + '}{' + N(sh.S[i]) + '}=' + N(sh.k))]), hints: ['Use the pair of matching sides where you know both lengths.', 'k = new ÷ original.'], text: 'quad k' }); } },
        { id: '9b', level: 'EMG', make: function (r, sh) { var ii = sh.iM;
          return fieldsPart('(b) Find ' + t(sideOf(sh.b, ii[0])) + ' and ' + t(sideOf(sh.b, ii[1])) + '.', ii.map(function (i) { return lenFld(t(sideOf(sh.b, i) + '='), sh.T[i], { unit: 'm', name: sideOf(sh.b, i), scale: { len: sh.S[i], k: sh.k, op: 'mul' } }); }),
            br(['Sides of the new figure: multiply by k = ' + N(sh.k) + '.'].concat(ii.map(function (i) { return t(sideOf(sh.b, i) + '=' + N(sh.k) + '\\times ' + N(sh.S[i]) + '=' + N(sh.T[i])) + ' m'; }))), ['Find the matching side in ' + sh.a + ' (naming order).', 'New side = k × original side.'], 'quad new sides'); } },
        { id: '9c', level: 'PRG', make: function (r, sh) { var i = sh.iD, sa = sideOf(sh.a, i), sb = sideOf(sh.b, i);
          return lenPart('(c) Find ' + t(sa) + '.', sh.S[i], { unit: 'm', scale: { len: sh.T[i], k: sh.k, op: 'div' }, sol: br([sa + ' is in the original: divide by k.', t(sa + '=' + sb + '\\div ' + N(sh.k) + '=' + N(sh.T[i]) + '\\div ' + N(sh.k) + '=' + N(sh.S[i])) + ' m']), hints: [sa + ' matches ' + sb + '.', 'Original side = new side ÷ k.'], text: 'quad orig side' }); } }] },
      { num: '10', stem: function (sh) { return sh.p.n + ' takes a photo on ' + sh.p.his + ' phone that is ' + U(sh.w, 'cm') + ' wide and ' + U(sh.h, 'cm') + ' tall. In class, it is shown on a projector screen as a similar picture that is ' + U(sh.W, 'm') + ' wide.'; },
        shared: function (r) { return find(function () { var w = r.pick([8, 12, 15, 16, 10]), h = q(w * r.pick([0.75, 0.6, 0.5625, 0.8, 0.7])), k = r.pick([10, 12, 15, 20, 25]), ph = q(h * k), fits = r.chance(0.5), Hs = fits ? Math.ceil((ph + 6) / 10) / 10 : Math.floor((ph - 6) / 10) / 10; return { p: person(r), w: w, h: h, k: k, W: q(w * k / 100), ph: ph, Hs: Hs, fits: fits }; },
          function (s) { return places(s.h) <= 1 && places(s.W) <= 2 && s.W <= 3.6 && s.Hs > 0.4 && !(s.w === 10 && s.h === 15) && Math.abs(s.Hs * 100 - s.ph) >= 5; }); }, parts: [
        { id: '10a', level: 'EMG', make: function (r, sh) { return kPart('(a) Find the scale factor. (Change ' + U(sh.W, 'm') + ' to centimetres first.)', sh.k, { from: { new: sh.W * 100, orig: sh.w }, diag: [{ v: sh.W / sh.w, code: 'u6l1-no-convert', hint: 'Change ' + U(sh.W, 'm') + ' to centimetres first: ' + t(N(sh.W) + '\\times 100=' + N(sh.W * 100)) + ' cm.' }],
          sol: br([U(sh.W, 'm') + ' = ' + U(sh.W * 100, 'cm'), t('k=' + N(sh.W * 100) + '\\div ' + N(sh.w) + '=' + N(sh.k))]), hints: ['1 m = 100 cm.', 'k = new width ÷ phone width.'], text: 'projector k' }); } },
        { id: '10b', level: 'EMG', make: function (r, sh) { return num('(b) How tall is the picture on the screen?', sh.ph, { after: 'cm', dp: 2, noPlaces: true, nudge: [{ v: sh.ph / 100, code: 'u6l1-in-m', hint: 'That’s the height in <b>metres</b>. The box is in centimetres (× 100).' }],
          diag: [{ v: sh.h + sh.W * 100 - sh.w, code: 'u6l1-added-diff', hint: 'Similar figures <b>multiply</b> every length by k; they don’t add the same amount.' }, { v: sh.h * sh.W, code: 'u6l1-no-convert', hint: 'Multiply the height by k from (a), not by the width in metres.' }, { v: sh.h / sh.k, code: 'k-mul-div', hint: 'The screen picture is bigger: <b>multiply</b> by k.' }],
          sol: br([t(N(sh.h) + '\\times ' + N(sh.k) + '=' + N(sh.ph)) + ' cm = ' + U(sh.ph / 100, 'm')]), hints: ['New height = k × phone height.'], text: 'projector height' }); } },
        { id: '10c', level: 'PRG', make: function (r, sh) { var pm = sh.ph / 100;
          return mc(r, '(c) The screen is ' + U(sh.Hs, 'm') + ' tall. Does the whole picture fit?', [
            { html: sh.fits ? '<b>Yes.</b> The picture is ' + U(pm, 'm') + ' tall, which is less than ' + U(sh.Hs, 'm') + '.' : '<b>No.</b> The picture is ' + U(pm, 'm') + ' tall, which is more than ' + U(sh.Hs, 'm') + ', so the top or bottom is cut off.', right: true },
            { html: sh.fits ? '<b>No.</b> The picture is ' + U(sh.ph, 'cm') + ' tall, and ' + N(sh.ph) + ' is more than ' + N(sh.Hs) + '.' : '<b>Yes.</b> The picture is ' + U(sh.h, 'cm') + ' tall, much less than the screen.', why: sh.fits ? 'Compare in the <b>same units</b>: ' + U(sh.ph, 'cm') + ' = ' + U(pm, 'm') + '.' : U(sh.h, 'cm') + ' is the phone picture. Use the height on the screen from (b).', code: sh.fits ? 'u6l1-no-convert' : 'phone' },
            { html: '<b>Yes.</b> The picture is similar to the photo, so it always fits.', why: 'Similar means the same shape, not the same size as the screen. Compare the picture’s height with the screen’s.', code: 'always' },
            { html: '<b>' + (sh.fits ? 'No' : 'Yes') + '.</b> The picture is ' + U(sh.W, 'm') + ' wide, and the screen is ' + U(sh.Hs, 'm') + ' tall.', why: 'Compare the picture’s <b>height</b> with the screen’s height.', code: 'width' }],
            br(['Picture height: ' + U(sh.ph, 'cm') + ' = ' + U(pm, 'm') + '.', U(pm, 'm') + (sh.fits ? ' < ' : ' > ') + U(sh.Hs, 'm') + ', so ' + (sh.fits ? 'the whole picture fits.' : 'it does not fit: the top or bottom is cut off.')]), ['Use the height from (b), in metres.'], 'projector fits');
        } }] },
      { num: '11', stem: function (sh) { return sh.p.n + ' collects ' + scaleTxt(sh.n) + ' model cars.'; },
        shared: function (r) { var n = r.pick([64, 24, 43, 18, 32]); return { p: person(r), n: n, m: find(function () { return r.pick([5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10, 12, 15, 18, 20, 25]); }, function (m) { var L = m * n; return Number.isInteger(q(L)) && L >= 300 && L <= 600 && !(n === 24 && near(L, 588)); }), h: find(function () { return r.pick([1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 4, 5, 6.5, 7]); }, function (h) { var H = h * n; return H >= 110 && H <= 200 && !(n === 24 && near(h, 8.25)); }) }; }, parts: [
        { id: '11a', level: 'PRG', make: function (r, sh) { var Lcm = q(sh.m * sh.n), L = Lcm / 100;
          return num('(a) ' + cap(sh.p.his) + ' favourite real car is ' + U(L, 'm') + ' long. How long is the model, in centimetres?', sh.m, { after: 'cm', dp: 2, noPlaces: true,
            diag: [{ v: L / sh.n, code: 'u6l1-no-convert', hint: 'Change ' + U(L, 'm') + ' to centimetres first (× 100), then divide by ' + sh.n + '.' }, { v: Lcm * sh.n, code: 'u6l1-model-way', hint: 'The model is <b>smaller</b>: divide the real length by ' + sh.n + '.' }, { v: L * sh.n, code: 'u6l1-model-way', hint: 'The model is smaller than the real car: <b>divide</b> by ' + sh.n + ' (and change m to cm first).' }],
            sol: br([U(L, 'm') + ' = ' + U(Lcm, 'cm') + ', ' + t('k=\\frac{1}{' + sh.n + '}'), t(N(Lcm) + '\\div ' + sh.n + '=' + N(sh.m)) + ' cm']), hints: ['Model length = real length ÷ ' + sh.n + '.', 'Work in centimetres.'], text: 'model length' }); } },
        { id: '11b', level: 'PRG', make: function (r, sh) { var Hcm = q(sh.h * sh.n), H = Hcm / 100;
          return num('(b) The model is ' + U(sh.h, 'cm') + ' tall. How tall is the real car, in metres?', H, { after: 'm', dp: 4, noPlaces: true, nudge: [{ v: Hcm, code: 'u6l1-in-cm', hint: 'That’s the height in <b>centimetres</b>. Change it to metres (÷ 100).' }],
            diag: [{ v: sh.h / sh.n, code: 'u6l1-model-way', hint: 'The real car is <b>bigger</b>: multiply by ' + sh.n + '.' }, { v: Hcm / 1000, code: 'u6l1-in-cm', hint: '1 m = 100 cm, so divide by 100 (not 1000).' }],
            sol: br(['The real car is ' + sh.n + ' times as big:', t(N(sh.h) + '\\times ' + sh.n + '=' + N(Hcm)) + ' cm = ' + U(H, 'm')]), hints: ['Real = model × ' + sh.n + '.', '100 cm = 1 m.'], text: 'real height' }); } }] },
      { num: '12', stem: function (sh) { return 'A team pennant is a triangle with sides ' + U(sh.L, 'cm') + ', ' + U(sh.L, 'cm') + ' and ' + U(sh.s, 'cm') + '. The team orders a similar giant pennant for the arena. Its short side is ' + U(sh.S, 'cm') + '.'; },
        shared: function (r) { return find(function () { var L = r.pick([25, 30, 35, 40, 45]), s = r.pick([10, 12, 14, 15, 16]), k = r.pick([3, 3.5, 4, 4.5, 5, 2.5]); return { L: L, s: s, k: k, S: q(s * k), pr: r.pick([1.99, 2.29, 2.49, 2.79, 3.19, 3.49]) }; }, function (v) { return places(v.L * v.k) <= 1 && v.s * 2 < v.L; }); }, parts: [
        { id: '12a', level: 'PRG', make: function (r, sh) { var LL = q(sh.L * sh.k);
          return fieldsPart('(a) Find the scale factor and the length of each of the two long sides of the giant pennant.', [kFld(t('k='), sh.k, { from: { new: sh.S, orig: sh.s } }), lenFld('Each long side:', LL, { unit: 'cm', name: 'Long side', scale: { len: sh.L, k: sh.k, op: 'mul' }, alts: [{ v: sh.L + sh.S - sh.s, code: 'u6l1-added-diff', hint: 'Similar figures <b>multiply</b> every side by k; they don’t add the same amount.' }] })],
            br([t('k=' + N(sh.S) + '\\div ' + N(sh.s) + '=' + N(sh.k)), 'Long sides: ' + t(N(sh.L) + '\\times ' + N(sh.k) + '=' + N(LL)) + ' cm each']), ['k = new short side ÷ old short side.', 'Multiply each long side by k.'], 'pennant k'); } },
        { id: '12b', level: 'MAS', make: function (r, sh) { var LL = q(sh.L * sh.k), Pc = q(2 * LL + sh.S), Pm = Pc / 100, cost = Pm * sh.pr;
          return num('(b) Gold trim goes all the way around the giant pennant. The trim costs ' + MM(sh.pr) + ' per metre. Find the cost of the trim before tax.', cost, { money: true, exact: cost,
            diag: [{ v: Pc * sh.pr, code: 'u6l1-cm-price', hint: 'The price is per <b>metre</b>: change the perimeter from cm to m (÷ 100) first.' }, { v: (LL + sh.S) / 100 * sh.pr, code: 'u6l1-one-long', hint: 'The trim goes all the way around: there are <b>two</b> long sides.' }, { v: (2 * sh.L + sh.s) / 100 * sh.pr, code: 'u6l1-small-perim', hint: 'That’s the trim for the <b>small</b> pennant. Use the giant pennant’s sides from (a).' }, { v: 3 * LL / 100 * sh.pr, code: 'u6l1-one-long', hint: 'Only two sides are long; the short side is ' + U(sh.S, 'cm') + '.' }],
            sol: br(['Perimeter = ' + t(N(LL) + '+' + N(LL) + '+' + N(sh.S) + '=' + N(Pc)) + ' cm = ' + U(Pm, 'm'), 'Cost = ' + t(N(Pm) + '\\times\\$' + c2(sh.pr) + toN(cost, 2).replace(/=|\\approx /g, function (m) { return m === '=' ? '=\\$' : '\\approx\\$'; }))]), hints: ['Add all three sides of the giant pennant.', 'Change cm to m before you multiply by the price per metre.'], text: 'pennant trim' }); } }] },
      { num: '13', stem: function (sh) { return 'Jaxon is reducing a drawing. A ' + U(sh.a, 'cm') + ' side becomes ' + U(sh.b, 'cm') + '. Here is his work for the new length of a ' + U(sh.c, 'cm') + ' side:' + table(null, [[t('k=' + N(sh.a) + '\\div ' + N(sh.b) + '=' + N(sh.a / sh.b)) + ' &nbsp;&nbsp; new side ' + t('=' + N(sh.c) + '\\times ' + N(sh.a / sh.b) + '=' + N(sh.c * sh.a / sh.b)) + ' cm']]); },
        shared: function (r) { return find(function () { var a = r.pick([20, 25, 30, 40, 50]), k = r.pick([0.4, 0.5, 0.6, 0.8, 0.25, 0.2]), c = r.pick([10, 12, 15, 18, 24, 35]); return { a: a, b: q(a * k), k: k, c: c }; }, function (v) { return places(v.a / v.b) <= 2 && places(v.c * v.a / v.b) <= 2 && places(v.c * v.k) <= 1 && v.c !== v.a && v.c - (v.a - v.b) > 1; }); }, parts: [
        { id: '13a', level: 'EMG', make: function (r, sh) { var w = q(sh.a / sh.b), wr = q(sh.c * w);
          return mc(r, '(a) What is his mistake, and how could he have seen that his answer was wrong?', [
            { html: 'He divided original ÷ new. ' + t('k') + ' is new ÷ original. It is a reduction, so the new side must be <b>shorter</b> than ' + U(sh.c, 'cm') + ', but ' + U(wr, 'cm') + ' is longer.', right: true },
            { html: 'He should have subtracted: the sides got ' + U(sh.a - sh.b, 'cm') + ' shorter, so the new side is ' + U(sh.c - (sh.a - sh.b), 'cm') + '.', why: 'Similar figures <b>multiply</b> every side by the same number; they don’t lose the same amount.', code: 'subtract' },
            { html: 'He rounded the scale factor too early.', why: t(N(w)) + ' is exact. The mistake is which number goes on top.', code: 'round' },
            { html: 'Nothing is wrong: when a drawing is changed, its sides get longer.', why: 'A ' + U(sh.a, 'cm') + ' side became ' + U(sh.b, 'cm') + ': it is a reduction, so every side gets shorter.', code: 'fine' }],
            br(['He divided original ÷ new. The scale factor is new ÷ original.', 'It is a reduction, so the new side must be shorter than ' + U(sh.c, 'cm') + '. ' + U(wr, 'cm') + ' is longer, so it can’t be right.']), ['Is the drawing getting bigger or smaller? What must k be, then?'], 'Jaxon mistake'); } },
        { id: '13b', level: 'PRG', make: function (r, sh) { var ans = q(sh.c * sh.k);
          return lenPart('(b) Give the correct length of the new side.', ans, { unit: 'cm', scale: { len: sh.c, k: sh.k, op: 'mul' }, alts: [{ v: sh.c * sh.a / sh.b, code: 'u6l1-jaxon', hint: 'That’s Jaxon’s answer. Find k = new ÷ original first.' }],
            sol: br([t('k=' + N(sh.b) + '\\div ' + N(sh.a) + '=' + N(sh.k)), 'New side = ' + t(N(sh.c) + '\\times ' + N(sh.k) + '=' + N(ans)) + ' cm']), hints: ['k = new ÷ original = ' + N(sh.b) + ' ÷ ' + N(sh.a) + '.', 'Multiply the ' + N(sh.c) + ' cm side by k.'], text: 'Jaxon fix' }); } }] },
      { num: '14', stem: function (sh) { return 'A small triangle has sides ' + U(sh.s[0], 'cm') + ', ' + U(sh.s[1], 'cm') + ' and ' + U(sh.s[2], 'cm') + '. It is enlarged with a scale factor of ' + N(sh.k) + '.'; },
        shared: function (r) { return find(function () { var a = r.int(3, 9), b = a + r.int(1, 4), c = b + r.int(1, 4); return { s: [a, b, c], k: r.pick([2, 3, 4, 1.5, 2.5]) }; }, function (v) { return v.s[0] + v.s[1] > v.s[2] * 1.15 && v.s.every(function (x) { return places(x * v.k) <= 1; }); }); }, parts: [
        { id: '14a', level: 'BEG', make: function (r, sh) {
          return fieldsPart('(a) Find the sides of the large triangle.', sh.s.map(function (x) { return lenFld(U(x, 'cm') + ' →', q(x * sh.k), { unit: 'cm', name: N(x) + ' cm side', scale: { len: x, k: sh.k, op: 'mul' } }); }),
            br(sh.s.map(function (x) { return t(N(x) + '\\times ' + N(sh.k) + '=' + N(x * sh.k)) + ' cm'; })), ['Multiply each side by the scale factor.'], 'sides x k'); } },
        { id: '14b', sub: 'b i', level: 'EMG', make: function (r, sh) { var p1 = sh.s[0] + sh.s[1] + sh.s[2], p2 = q(p1 * sh.k);
          return fieldsPart('(b) Find both perimeters. How many times as long is the large perimeter?', [fld('Small perimeter:', p1, { after: 'cm', name: 'Small', dp: 2, noPlaces: true }), fld('Large perimeter:', p2, { after: 'cm', name: 'Large', dp: 2, noPlaces: true, diag: [{ v: p1 + sh.k, code: 'k-added', hint: 'Add the three <b>large</b> sides from (a).' }] }), fld('Large ÷ small:', sh.k, { after: 'times', name: 'Times', dp: 2, noPlaces: true, diag: [{ v: p2 - p1, code: 'k-subtract', hint: '“How many times as long” means <b>divide</b>: large ÷ small.' }, { v: 1 / sh.k, code: 'k-flip', hint: 'Divide large ÷ small.' }] })],
            br(['Small: ' + t(sh.s.join('+') + '=' + p1) + ' cm', 'Large: ' + t(sh.s.map(function (x) { return N(x * sh.k); }).join('+') + '=' + N(p2)) + ' cm', t(N(p2) + '\\div ' + p1 + '=' + N(sh.k))]), ['Perimeter = add all the sides.', 'Divide the large perimeter by the small one.'], 'perimeters'); } },
        { id: '14c', sub: 'b ii', level: 'EMG', make: function (r, sh) {
          return mc(r, '(b) Why is the large perimeter ' + N(sh.k) + ' times the small one?', [
            { html: 'Every side that adds up to it was multiplied by ' + N(sh.k) + ', so the total is multiplied by ' + N(sh.k) + ' too.', right: true },
            { html: 'The perimeter always doubles when a triangle is enlarged.', why: 'It is multiplied by k (here ' + N(sh.k) + '), not always by 2.', code: 'doubles' },
            { html: 'The angles were multiplied by ' + N(sh.k) + '.', why: 'The angles don’t change. The <b>sides</b> were multiplied by k.', code: 'angles' },
            { html: 'It is a coincidence: it only works for these sides.', why: 'It works for every similar figure: perimeter × k, because every side is × k.', code: 'luck' }],
            'Perimeter = side + side + side. Each side was multiplied by ' + N(sh.k) + ', so the sum is ' + N(sh.k) + ' times as big: the perimeter is also multiplied by ' + t('k') + '.', ['What happens to each side that you add up?'], 'perimeter why'); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) { var red = r.chance(0.7), rt = red ? r.pick([0.8, 0.6, 0.75, 0.5, 0.9, 0.4]) : r.pick([1.2, 1.25, 1.5, 2.5]), others = red ? r.sample([1.25, 1.5, 2, 3, 1.2], 2).concat([1]) : r.sample([0.8, 0.5, 0.75, 0.25], 2).concat([1]);
          var want = red ? 'a reduction' : 'an enlargement';
          return mc(r, 'Which scale factor makes ' + (red ? 'a <b>reduction</b>' : 'an <b>enlargement</b>') + '?', [{ html: t(N(rt)), right: true }].concat(others.map(function (x) { return { html: t(N(x)), why: N(x) + (x === 1 ? ' keeps the same size.' : x > 1 ? ' is more than 1, so it makes an enlargement.' : ' is less than 1, so it makes a reduction.'), code: 'k' + nS(x) }; })),
            N(rt) + ' is ' + (red ? 'less' : 'more') + ' than 1, so it makes ' + want + '. (1 keeps the same size.)', ['Compare each one with 1.'], 'which k'); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) { var nm = twoNames(r, QUADS), a = nm[0], b = nm[1], i = r.int(0, 3);
          return mc(r, t(a + '\\sim ' + b) + '. Which side corresponds to ' + t(sideOf(a, i)) + '?', [0, 1, 2, 3].map(function (j) { return { html: t(sideOf(b, j)), right: j === i, why: j === i ? null : sideOf(b, j) + ' uses letters ' + (j + 1) + ' and ' + ((j + 1) % 4 + 1) + ' of ' + b + '. ' + sideOf(a, i) + ' uses letters ' + (i + 1) + ' and ' + ((i + 1) % 4 + 1) + '.', code: 'side' + j }; }),
            sideOf(a, i).charAt(0) + ' is letter ' + (i + 1) + ' and ' + sideOf(a, i).charAt(1) + ' is letter ' + ((i + 1) % 4 + 1) + ' of ' + a + ', so ' + t(sideOf(a, i)) + ' matches letters ' + (i + 1) + ' and ' + ((i + 1) % 4 + 1) + ' of ' + b + ': ' + t(sideOf(b, i)) + '.', ['Write the names one above the other.'], 'which side', true); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'PRG', make: function (r) { var v = find(function () { return { n: r.pick([100, 150, 200, 250, 300, 120, 125]), L: r.int(18, 60) }; }, function (v) { var m = v.L * v.n / 100; return places(m) <= 1 && String(m).length <= 4 && m >= 20 && !(v.n === 150 && v.L === 42); }), cm = v.L * v.n, m = cm / 100;
          var it = r.pick(['ferry', 'cargo ship', 'passenger jet', 'freight train engine']);
          return num('A ' + scaleTxt(v.n) + ' model of a ' + it + ' is ' + U(v.L, 'cm') + ' long. The length of the real ' + it + ', in metres, is ____ m.', m, { nr: true, dp: 1, noPlaces: true, nudge: [{ v: cm, code: 'u6l1-in-cm', hint: 'That’s in <b>centimetres</b>. Give the answer in metres (÷ 100).' }],
            diag: [{ v: v.L / v.n, code: 'u6l1-model-way', hint: 'The real ' + it + ' is ' + v.n + ' times as <b>long</b>: multiply.' }, { v: cm / 1000, code: 'u6l1-in-cm', hint: '100 cm = 1 m: divide by 100.' }],
            sol: br(['The real ' + it + ' is ' + v.n + ' times as long:', t(N(v.L) + '\\times ' + v.n + '=' + N(cm)) + ' cm = ' + U(m, 'm')]), hints: ['Real = model × ' + v.n + '.', 'Change cm to m.'], text: 'NR model' }); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var v = find(function () { var a = r.pick([3, 3.5, 4, 4.5, 5, 6, 2.5]), m = r.pick([4 / 3, 1.2, 1.5, 1.25]), b = q(a * m), c = q(a * r.pick([5 / 3, 1.75, 1.6, 2])); return { s: [a, b, c], k: r.pick([1.5, 2.4, 2.5, 1.6, 3.5, 1.2, 0.8]) }; }, function (v) { var L = v.s[2] * v.k; return v.s.every(function (x) { return places(x) <= 1; }) && v.s[0] + v.s[1] > v.s[2] * 1.1 && v.s[1] < v.s[2] && places(L) <= 1 && String(q(L)).length <= 4; }), L = q(v.s[2] * v.k);
          return num('A triangle has sides ' + v.s.map(function (x) { return U(x, 'cm'); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. It is ' + (v.k > 1 ? 'enlarged' : 'reduced') + ' with a scale factor of ' + N(v.k) + '. The longest side of the new triangle is ____ cm.', L, { nr: true, dp: 1, noPlaces: true,
            diag: [{ v: v.s[0] * v.k, code: 'u6k-order', hint: 'The <b>longest</b> side matches the longest side: ' + U(v.s[2], 'cm') + '.' }, { v: v.s[1] * v.k, code: 'u6k-order', hint: 'The <b>longest</b> side matches the longest side: ' + U(v.s[2], 'cm') + '.' }, { v: v.s[2] + v.k, code: 'k-added', hint: 'Multiply by the scale factor; don’t add it.' }, { v: v.s[2] / v.k, code: 'k-mul-div', hint: 'New side = k × original: multiply.' }],
            sol: 'The longest side matches the longest side: ' + t(N(v.s[2]) + '\\times ' + N(v.k) + '=' + N(L)) + ' cm', hints: ['Which side of the new triangle is the longest?'], text: 'NR longest' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return t('\\triangle ' + sh.a + '\\sim\\triangle ' + sh.b) + '.'; }, shared: function (r) { var nm = corrNames(r, TRIS, false); return { a: nm[0], b: nm[1] }; }, parts: [
        { id: 'e1a', level: 'BEG', make: function (r, sh) { return fieldsPart('Complete the table of corresponding parts.', corrFields(sh.a, sh.b, 'both'), corrSol(sh.a, sh.b, 'both'), ['Write ' + sh.a + ' above ' + sh.b + ' and read down the columns.'], 'tri corr'); } },
        { id: 'e1b', level: 'EMG', make: function (r, sh) { var a = sh.a, b = sh.b, bx = function (n) { return '\\boxed{\\,' + n + '\\,}'; }, oT = { pool: b, poolName: b, otherPool: a, otherName: a, hint: 'The tops are sides of ' + b + ' (new). Use the naming order.' };
          return fieldsPart('Write the three equal ratios of corresponding sides (new over original): ' + t('\\dfrac{' + bx(1) + '}{' + sideOf(a, 0) + '}=\\dfrac{' + bx(2) + '}{' + sideOf(a, 1) + '}=\\dfrac{' + bx(3) + '}{' + sideOf(a, 2) + '}'),
            [0, 1, 2].map(function (i) { return nameFld('Box ' + (i + 1) + ':', sideOf(b, i), oT); }), t([0, 1, 2].map(function (i) { return '\\dfrac{' + sideOf(b, i) + '}{' + sideOf(a, i) + '}'; }).join('=')), ['Each top is the side of ' + b + ' that matches the side of ' + a + ' below it.'], 'tri ratios'); } }] },
      { num: '2', stem: 'Find the scale factor ' + t('k') + '. Write enlargement, reduction or same size.', shared: kRows, parts: [
        { id: 'e2k', sub: 'k', level: 'EMG', make: function (r, sh) { return kRowsPart(sh, 'ep k table'); } },
        { id: 'e2t', sub: 'type', level: 'BEG', make: function (r, sh) { return typeRowsPart(sh, 'ep type table'); } }] },
      { num: '3', stem: function (sh) { return 'A quadrilateral has sides ' + sh.s.map(function (x) { return U(x, 'cm'); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. Find the sides of a similar quadrilateral for each scale factor.'; },
        shared: function (r) { return find(function () { var s = r.sample([3, 4, 5, 6, 7, 8, 9, 10, 12], 4).sort(function (a, b) { return a - b; }); return { s: s, k1: r.pick([1.5, 2.5, 1.2, 3, 2]), k2: r.pick([0.5, 0.25, 0.4, 0.2]) }; }, function (v) { return v.s.every(function (x) { return places(x * v.k1) <= 1 && places(x * v.k2) <= 2; }); }); }, parts: [
        { id: 'e3a', level: 'BEG', make: function (r, sh) { return fieldsPart('(a) ' + t('k=' + N(sh.k1)), sh.s.map(function (x) { return lenFld(U(x, 'cm') + ' →', q(x * sh.k1), { unit: 'cm', dp: 2, name: N(x) + ' cm', scale: { len: x, k: sh.k1, op: 'mul' } }); }), br(sh.s.map(function (x) { return t(N(x) + '\\times ' + N(sh.k1) + '=' + N(x * sh.k1)) + ' cm'; })), ['Multiply every side by k.'], 'quad x k1'); } },
        { id: 'e3b', level: 'BEG', make: function (r, sh) { return fieldsPart('(b) ' + t('k=' + N(sh.k2)), sh.s.map(function (x) { return lenFld(U(x, 'cm') + ' →', q(x * sh.k2), { unit: 'cm', dp: 2, name: N(x) + ' cm', scale: { len: x, k: sh.k2, op: 'mul' } }); }), br(sh.s.map(function (x) { return t(N(x) + '\\times ' + N(sh.k2) + '=' + N(x * sh.k2)) + ' cm'; })), ['Multiply every side by k (a reduction: the sides get shorter).'], 'quad x k2'); } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4', level: 'EMG', make: function (r) {
          var nm = twoNames(r, QUADS), a = nm[0], b = nm[1], A = find(function () { var x = [r.int(70, 125), r.int(60, 120), r.int(70, 130)]; x.push(360 - x[0] - x[1] - x[2]); return x; }, function (x) { return x[3] >= 55 && x[3] <= 140 && new Set(x).size === 4 && !(x[0] === 78 && x[1] === 112); }), s3 = A[0] + A[1] + A[2];
          var specs = [angFld(t('\\angle ' + a.charAt(3) + '='), A[3], [{ v: 180 - s3, code: 'u6l1-angle-sum', hint: 'The angles in a <b>quadrilateral</b> add up to 360°.' }, { v: 540 - s3, code: 'u6l1-angle-sum', hint: 'The angles in a quadrilateral add up to 360°.' }, { v: s3, code: 'u6l1-added-angles', hint: 'Subtract the three angles from 360°.' }], '∠' + a.charAt(3))];
          b.split('').forEach(function (L, i) { specs.push(angFld(t('\\angle ' + L + '='), A[i], A.filter(function (x, j) { return j !== i; }).map(function (x) { return { v: x, code: 'u6k-order', hint: L + ' matches ' + a.charAt(i) + ' (letter ' + (i + 1) + ').' }; }), '∠' + L)); });
          return fieldsPart('Quadrilateral ' + t(a) + ' ' + t('\\sim') + ' quadrilateral ' + t(b) + '. ' + [0, 1, 2].map(function (i) { return t('\\angle ' + a.charAt(i) + '=' + dgT(A[i])); }).join(', ') + '. Find ' + t('\\angle ' + a.charAt(3)) + ', then all four angles of ' + t(b) + '.', specs,
            br([t('\\angle ' + a.charAt(3) + '=360^\\circ-' + A.slice(0, 3).map(dgT).join('-') + '=' + dgT(A[3])) + ' (angles in a quadrilateral)', b.split('').map(function (L, i) { return t('\\angle ' + L + '=' + dgT(A[i])); }).join(', ')]), ['A quadrilateral’s angles add up to 360°.', 'Corresponding angles are equal (naming order).'], 'quad angles');
        } }] },
      { num: '5', section: 'B. Applying', stem: function (sh) { var L0 = [N(sh.S[0]) + ' cm', N(sh.S[1]) + ' cm', '?', N(sh.S[3]) + ' cm'], L1 = [N(sh.T[0]) + ' cm', '?', N(sh.T[2]) + ' cm', '?'];
          return t(sh.a + '\\sim ' + sh.b) + '. The diagrams are not drawn to scale.' + pairSVG(sh.pts, { k: sh.k, names: [sh.a, sh.b], labels: [L0, L1], flip: true, angles: [[null, ' ', ' ', null], [null, ' ', ' ', null]], width: 440 }); },
        shared: function (r) { var nm = twoNames(r, QUADS), tr = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13]]), top = r.pick([2, 3, 4, 5]), b = tr[0] + top, k = find(function () { return r.pick([1.5, 2, 2.5, 3, 0.5, 1.2]); }, function (k) { return [b, tr[1], top, tr[2]].every(function (x) { return places(x * k) <= 1; }); });
          var S = [b, tr[1], top, tr[2]]; return { a: nm[0], b: nm[1], k: k, S: S, T: S.map(function (x) { return q(x * k); }), pts: [[0, 0], [b, 0], [b, tr[1]], [tr[0], tr[1]]] }; }, parts: [
        { id: 'e5a', level: 'EMG', make: function (r, sh) { return kPart('(a) Find the scale factor from ' + t(sh.a) + ' to ' + t(sh.b) + '.', sh.k, { from: { new: sh.T[0], orig: sh.S[0] }, sol: t('k=\\dfrac{' + sideOf(sh.b, 0) + '}{' + sideOf(sh.a, 0) + '}=\\dfrac{' + N(sh.T[0]) + '}{' + N(sh.S[0]) + '}=' + N(sh.k)), hints: ['Use the pair of matching sides where you know both lengths.'], text: 'trap k' }); } },
        { id: 'e5b', level: 'PRG', make: function (r, sh) { var a = sh.a, b = sh.b;
          return fieldsPart('(b) Find ' + t(sideOf(b, 1)) + ', ' + t(sideOf(b, 3)) + ' and ' + t(sideOf(a, 2)) + '.', [lenFld(t(sideOf(b, 1) + '='), sh.T[1], { unit: 'cm', name: sideOf(b, 1), scale: { len: sh.S[1], k: sh.k, op: 'mul' } }), lenFld(t(sideOf(b, 3) + '='), sh.T[3], { unit: 'cm', name: sideOf(b, 3), scale: { len: sh.S[3], k: sh.k, op: 'mul' } }), lenFld(t(sideOf(a, 2) + '='), sh.S[2], { unit: 'cm', name: sideOf(a, 2), scale: { len: sh.T[2], k: sh.k, op: 'div' } })],
            br([t(sideOf(b, 1) + '=' + N(sh.k) + '\\times ' + N(sh.S[1]) + '=' + N(sh.T[1])) + ' cm; ' + t(sideOf(b, 3) + '=' + N(sh.k) + '\\times ' + N(sh.S[3]) + '=' + N(sh.T[3])) + ' cm', t(sideOf(a, 2) + '=' + sideOf(b, 2) + '\\div ' + N(sh.k) + '=' + N(sh.T[2]) + '\\div ' + N(sh.k) + '=' + N(sh.S[2])) + ' cm']), ['New sides: × k. Original sides: ÷ k.'], 'trap sides'); } }] },
      { num: '6', stem: function (sh) { return 'A club logo is printed ' + U(sh.w, 'cm') + ' wide and ' + U(sh.h, 'cm') + ' tall on a T-shirt. A similar logo is printed on a banner. The banner logo is ' + U(sh.W, 'm') + ' wide.'; },
        shared: function (r) { return find(function () { var w = r.pick([6, 8, 10, 12, 4]), h = q(w * r.pick([0.7, 0.6, 0.75, 0.8, 1.2])), k = r.pick([15, 20, 25, 30, 40]); return { w: w, h: h, k: k, W: q(w * k / 100) }; }, function (v) { return places(v.h) <= 1 && v.W <= 3 && !(v.w === 5 && v.k === 24); }); }, parts: [
        { id: 'e6a', level: 'EMG', make: function (r, sh) { return kPart('(a) Find the scale factor from the T-shirt to the banner.', sh.k, { from: { new: sh.W * 100, orig: sh.w }, diag: [{ v: sh.W / sh.w, code: 'u6l1-no-convert', hint: 'Change ' + U(sh.W, 'm') + ' to centimetres first.' }], sol: br([U(sh.W, 'm') + ' = ' + U(sh.W * 100, 'cm'), t('k=' + N(sh.W * 100) + '\\div ' + N(sh.w) + '=' + N(sh.k))]), hints: ['Same units first: 1 m = 100 cm.'], text: 'banner k' }); } },
        { id: 'e6b', level: 'EMG', make: function (r, sh) { var H = q(sh.h * sh.k); return num('(b) How tall is the banner logo?', H, { after: 'cm', dp: 2, noPlaces: true, nudge: [{ v: H / 100, code: 'u6l1-in-m', hint: 'That’s in metres. The box is in centimetres.' }], diag: [{ v: sh.h + sh.W * 100 - sh.w, code: 'u6l1-added-diff', hint: 'Multiply by k; don’t add the same amount.' }, { v: sh.h * sh.W, code: 'u6l1-no-convert', hint: 'Multiply by k from (a).' }],
          sol: t(N(sh.h) + '\\times ' + N(sh.k) + '=' + N(H)) + ' cm = ' + U(H / 100, 'm'), hints: ['New height = k × old height.'], text: 'banner height' }); } }] },
      { num: '7', stem: function (sh) { return 'A model train set uses the ' + scaleTxt(sh.n) + ' scale.'; },
        shared: function (r) { var n = r.pick([87, 160, 48]); return { n: n, m: find(function () { return r.int(10, 40); }, function (m) { var c = m * n; return c >= 1200 && c <= 3200 && !(n === 87 && m === 18); }), h: find(function () { return r.int(15, 80) / 10; }, function (h) { var c = h * n; return c >= 300 && c <= 520 && Math.abs(c / 10 - Math.round(c / 10)) > 0.05 && Math.abs((c / 10 % 1) - 0.5) > 0.05; }) }; }, parts: [
        { id: 'e7a', level: 'PRG', make: function (r, sh) { var cm = sh.m * sh.n, L = cm / 100;
          return num('(a) A real locomotive is ' + U(L, 'm') + ' long. How long is the model, in centimetres?', sh.m, { after: 'cm', dp: 2, noPlaces: true, diag: [{ v: L / sh.n, code: 'u6l1-no-convert', hint: 'Change metres to centimetres first (× 100).' }, { v: L * sh.n, code: 'u6l1-model-way', hint: 'The model is smaller: divide by ' + sh.n + '.' }, { v: cm * sh.n, code: 'u6l1-model-way', hint: 'The model is smaller: divide by ' + sh.n + '.' }],
            sol: U(L, 'm') + ' = ' + U(cm, 'cm') + '; ' + t(N(cm) + '\\div ' + sh.n + '=' + N(sh.m)) + ' cm', hints: ['Model = real ÷ ' + sh.n + ', in cm.'], text: 'train model' }); } },
        { id: 'e7b', level: 'PRG', make: function (r, sh) { var cm = q(sh.h * sh.n), H = cm / 100;
          return num('(b) The model locomotive is ' + U(sh.h, 'cm') + ' tall. How tall is the real one, to the nearest tenth of a metre?', H, { after: 'm', dp: 1, exact: H, nudge: [{ v: cm, code: 'u6l1-in-cm', hint: 'That’s in centimetres. Change it to metres (÷ 100).' }], diag: [{ v: sh.h / sh.n, code: 'u6l1-model-way', hint: 'The real one is bigger: multiply by ' + sh.n + '.' }],
            sol: t(N(sh.h) + '\\times ' + sh.n + '=' + N(cm)) + ' cm = ' + t(N(H) + '\\text{ m}\\approx ' + rd(H, 1).toFixed(1) + '\\text{ m}'), hints: ['Real = model × ' + sh.n + '.', 'Then change cm to m and round.'], text: 'train real' }); } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'PRG', make: function (r) { var v = find(function () { var w = r.pick([10, 12, 14, 15, 16]), h = q(w * r.pick([0.45, 0.5625, 0.5, 0.6])), k = r.pick([6, 7, 8, 9, 10]); return { w: w, h: h, k: k, T: w * k }; }, function (v) { return places(v.h) <= 1 && !(v.w === 12 && v.k === 9); }), H = q(v.h * v.k);
          return num('A video is ' + U(v.w, 'cm') + ' wide and ' + U(v.h, 'cm') + ' tall on a phone. The same video fills a TV screen that is ' + U(v.T, 'cm') + ' wide. How tall is the video on the TV?', H, { after: 'cm', dp: 2, noPlaces: true,
            diag: [{ v: v.h + v.T - v.w, code: 'u6l1-added-diff', hint: 'Similar pictures multiply every length by k; they don’t add the same amount.' }, { v: v.h * v.T, code: 'value', hint: 'Find k first: TV width ÷ phone width.' }, { v: v.h / v.k, code: 'k-mul-div', hint: 'The TV picture is bigger: multiply by k.' }],
            sol: br([t('k=' + N(v.T) + '\\div ' + N(v.w) + '=' + N(v.k)), 'Height = ' + t(N(v.h) + '\\times ' + N(v.k) + '=' + N(H)) + ' cm']), hints: ['k = TV width ÷ phone width.', 'Height on the TV = k × phone height.'], text: 'video TV' }); } }] },
      { num: '9', stem: function (sh) { return sh.p.n + ' changes ' + aN(sh.a) + ' ' + N(sh.a) + ' cm by ' + N(sh.b) + ' cm photo to ' + N(sh.c) + ' cm by ' + N(sh.d) + ' cm.'; },
        shared: function (r) { return find(function () { var a = r.pick([6, 8, 10, 12]), b = a + r.pick([2, 3, 4, 5, 6]), m = r.pick([2, 1.5, 2.5]), c = q(a * m); return { p: person(r), a: a, b: b, m: m, c: c, d: b + c - a }; }, function (v) { return places(v.b * v.m) <= 1 && Math.abs(v.d / v.b - v.m) > 0.05; }); }, parts: [
        { id: 'e9a', level: 'EMG', make: function (r, sh) { var r2 = sh.d / sh.b;
          return mc(r, '(a) Is the new photo similar to the original? Explain.', [
            { html: '<b>No.</b> The short side was multiplied by ' + t(N(sh.c) + '\\div ' + N(sh.a) + '=' + N(sh.m)) + ', but the long side by ' + t(N(sh.d) + '\\div ' + N(sh.b) + toN(r2, 2)) + '. Not the same number.', right: true },
            { html: '<b>Yes.</b> Both sides got ' + U(sh.c - sh.a, 'cm') + ' longer.', why: 'Adding the same amount changes the shape. Similar means every side is <b>multiplied</b> by the same number.', code: 'u6l1-added-diff' },
            { html: '<b>Yes.</b> Both photos are rectangles, so all their angles are 90°.', why: 'Equal angles are not enough: the sides must also be multiplied by the same number.', code: 'angles' },
            { html: '<b>No.</b> The new photo is bigger than the original.', why: 'A bigger copy can still be similar (an enlargement). Compare the two ratios.', code: 'bigger' }],
            br(['Short: ' + t(N(sh.c) + '\\div ' + N(sh.a) + '=' + N(sh.m)) + '. Long: ' + t(N(sh.d) + '\\div ' + N(sh.b) + toN(r2, 2)) + '.', 'The sides were not multiplied by the same number, so the new photo is not similar.']), ['Divide new ÷ original for the short sides and for the long sides.'], 'Sam similar'); } },
        { id: 'e9b', level: 'PRG', make: function (r, sh) { var L = q(sh.b * sh.m);
          return lenPart('(b) For a similar photo with a short side of ' + U(sh.c, 'cm') + ', what should the long side be?', L, { unit: 'cm', scale: { len: sh.b, k: sh.m, op: 'mul' }, alts: [{ v: sh.d, code: 'u6l1-added-diff', hint: 'That’s ' + sh.p.n + '’s photo, which isn’t similar. Multiply the long side by ' + t('k=' + N(sh.m)) + '.' }],
            sol: br([t('k=' + N(sh.c) + '\\div ' + N(sh.a) + '=' + N(sh.m)), 'Long side = ' + t(N(sh.b) + '\\times ' + N(sh.m) + '=' + N(L)) + ' cm']), hints: ['Find k from the short sides.', 'Multiply the long side by k.'], text: 'Sam fix' }); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'BEG', make: function (r) { var nm = twoNames(r, TRIS), v = find(function () { return { k: r.pick([2, 3, 4, 2.5, 1.5]), s: r.pick([4, 5, 6, 8, 3]) }; }, function (v) { return new Set([q(v.k * v.s), q(v.s / v.k), q(v.s + v.k), v.s * v.s]).size === 4 && places(v.s / v.k) <= 2; }), a = nm[0], b = nm[1], A = sideOf(a, 0), B = sideOf(b, 0);
          return mc(r, t('\\triangle ' + a + '\\sim\\triangle ' + b) + ', and the scale factor from ' + t('\\triangle ' + a) + ' to ' + t('\\triangle ' + b) + ' is ' + N(v.k) + '. If ' + t(A + '=' + N(v.s)) + ' cm, then ' + t(B) + ' is', [
            { html: U(v.s / v.k, 'cm'), why: 'That divides by k. ' + B + ' is in the new triangle: multiply.', code: 'k-mul-div' }, { html: U(v.s + v.k, 'cm'), why: 'That adds k. A scale factor multiplies.', code: 'k-added' },
            { html: U(v.s * v.k, 'cm'), right: true }, { html: U(v.s * v.s, 'cm'), why: 'That multiplies ' + N(v.s) + ' by itself. Multiply by k = ' + N(v.k) + '.', code: 'square' }].sort(function (x, y) { return parseFloat(x.html.replace(/[^\d.]/g, '')) - parseFloat(y.html.replace(/[^\d.]/g, '')); }),
            t(B + '=' + N(v.k) + '\\times ' + N(v.s) + '=' + N(v.s * v.k)) + ' cm', ['New side = k × original side.'], 'MC k x side', true); } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'PRG', make: function (r) { var v = find(function () { var W = r.pick([40, 50, 60, 80]), L = q(W * r.pick([1.5, 1.25, 1.4, 1.75])), s = r.int(12, 30); return { W: W, L: L, s: s }; }, function (v) { var x = v.L * v.s / v.W; return Number.isInteger(v.L) && !(v.L === 90 && v.s === 21) && String(rd(x, 1)).length <= 4 && Math.abs(x * 100 - Math.round(x * 100)) > 1e-6 || (Number.isInteger(v.L) && places(x) <= 1 && !(v.L === 90 && v.s === 21)); }), x = v.L * v.s / v.W;
          return num('A poster is ' + N(v.L) + ' cm by ' + N(v.W) + ' cm. It is reduced to a similar flyer whose short side is ' + U(v.s, 'cm') + '. The long side of the flyer, to the nearest tenth of a centimetre, is ____ cm.', x, { nr: true, dp: 1, exact: x,
            diag: [{ v: v.L * v.W / v.s, code: 'k-flip', hint: 'k = new ÷ original = ' + N(v.s) + ' ÷ ' + N(v.W) + ' (the short sides).' }, { v: v.L - (v.W - v.s), code: 'u6l1-added-diff', hint: 'Multiply by k; don’t subtract the same amount.' }, { v: v.s * v.s / v.W, code: 'u6k-order', hint: 'Multiply the poster’s <b>long</b> side by k.' }],
            sol: br([t('k=' + N(v.s) + '\\div ' + N(v.W) + toN(v.s / v.W, 4)), 'Long side = ' + t(N(v.L) + '\\times ' + N(v.s) + '\\div ' + N(v.W) + toN(x, 1)) + ' cm']), hints: ['k = flyer short side ÷ poster short side.', 'Long side = poster long side × k.'], text: 'NR flyer' }); } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'A rectangle is ' + N(sh.L) + ' cm by ' + N(sh.W) + ' cm. It is enlarged with a scale factor of ' + N(sh.k) + '.'; },
        shared: function (r) { return find(function () { return { L: r.pick([8, 9, 10, 12, 15]), W: r.pick([4, 5, 6, 7]), k: r.pick([1.5, 1.8, 2.5, 1.2, 3]) }; }, function (v) { return v.L > v.W && places(v.L * v.k) <= 1 && places(v.W * v.k) <= 1 && !(v.L === 9 && v.W === 6 && v.k === 1.8); }); }, parts: [
        { id: 'e12a', level: 'EMG', make: function (r, sh) { return fieldsPart('(a) Find the length and width of the new rectangle.', [lenFld('Length:', q(sh.L * sh.k), { unit: 'cm', name: 'Length', scale: { len: sh.L, k: sh.k, op: 'mul' } }), lenFld('Width:', q(sh.W * sh.k), { unit: 'cm', name: 'Width', scale: { len: sh.W, k: sh.k, op: 'mul' } })], t(N(sh.L) + '\\times ' + N(sh.k) + '=' + N(sh.L * sh.k)) + ' cm; ' + t(N(sh.W) + '\\times ' + N(sh.k) + '=' + N(sh.W * sh.k)) + ' cm', ['Multiply each side by k.'], 'rect new'); } },
        { id: 'e12b', level: 'PRG', make: function (r, sh) { var p1 = 2 * (sh.L + sh.W), p2 = q(p1 * sh.k);
          return fieldsPart('(b) Find both perimeters. How many times as long is the new perimeter?', [fld('Old perimeter:', p1, { after: 'cm', dp: 2, noPlaces: true, name: 'Old', diag: [{ v: sh.L + sh.W, code: 'u6l1-one-long', hint: 'A rectangle has 4 sides: 2 lengths and 2 widths.' }] }), fld('New perimeter:', p2, { after: 'cm', dp: 2, noPlaces: true, name: 'New', diag: [{ v: q((sh.L + sh.W) * sh.k), code: 'u6l1-one-long', hint: 'A rectangle has 4 sides: 2 lengths and 2 widths.' }] }), fld('New ÷ old:', sh.k, { after: 'times', dp: 2, noPlaces: true, name: 'Times', diag: [{ v: p2 - p1, code: 'k-subtract', hint: '“How many times” means divide.' }] })],
            br([t('2\\times ' + N(sh.L) + '+2\\times ' + N(sh.W) + '=' + N(p1)) + ' cm', t('2\\times ' + N(sh.L * sh.k) + '+2\\times ' + N(sh.W * sh.k) + '=' + N(p2)) + ' cm', t(N(p2) + '\\div ' + N(p1) + '=' + N(sh.k)) + ' times (the same as k)']), ['Perimeter = 2 × length + 2 × width.'], 'rect perimeters'); } },
        { id: 'e12c', level: 'MAS', make: function (r, sh) { var a1 = sh.L * sh.W, a2 = q(sh.L * sh.k * sh.W * sh.k), kk = q(sh.k * sh.k);
          return fieldsPart('(c) Find both areas. How many times as big is the new area?', [fld('Old area:', a1, { after: 'cm²', dp: 2, noPlaces: true, name: 'Old area', diag: [{ v: 2 * (sh.L + sh.W), code: 'value', hint: 'That’s the perimeter. Area = length × width.' }] }), fld('New area:', a2, { after: 'cm²', dp: 4, noPlaces: true, name: 'New area', diag: [{ v: a1 * sh.k, code: 'u6l1-k-sq', hint: 'Find the new area from the new length and width (from (a)): both were multiplied by k.' }] }), fld('New ÷ old:', kk, { after: 'times', dp: 4, noPlaces: true, name: 'Times', diag: [{ v: sh.k, code: 'u6l1-k-sq', hint: 'Divide the two areas: it is not ' + N(sh.k) + ' this time.' }, { v: a2 - a1, code: 'k-subtract', hint: '“How many times” means divide.' }] })],
            br([t(N(sh.L) + '\\times ' + N(sh.W) + '=' + N(a1)) + ' cm²', t(N(sh.L * sh.k) + '\\times ' + N(sh.W * sh.k) + '=' + N(a2)) + ' cm²', t(N(a2) + '\\div ' + N(a1) + '=' + N(kk)) + ' times', t(N(kk) + '=' + N(sh.k) + '\\times ' + N(sh.k)) + ': the area grows by ' + t('k\\times k') + ', not by ' + t('k') + '.']), ['Area = length × width. Use the new sides from (a).'], 'rect areas'); } },
        { id: 'e12d', level: 'PRG', make: function (r, sh) { var kk = q(sh.k * sh.k);
          return mc(r, '(c) The new area is ' + N(kk) + ' times as big. How is ' + N(kk) + ' related to ' + t('k=' + N(sh.k)) + '?', [
            { html: t(N(kk) + '=' + N(sh.k) + '\\times ' + N(sh.k)) + ': the area grows by ' + t('k\\times k') + ' because both the length and the width are multiplied by ' + t('k') + '.', right: true },
            { html: t(N(kk) + '=' + N(sh.k) + '+' + N(kk - sh.k)) + ': the area grows by ' + t('k') + ' plus a bit.', why: 'Look for a multiplication: ' + N(sh.k) + ' × ' + N(sh.k) + ' = ?', code: 'plus' },
            { html: t(N(kk) + '=2\\times ' + N(sh.k / 2 * sh.k)) + ': areas always double.', why: 'Areas don’t always double. Try ' + N(sh.k) + ' × ' + N(sh.k) + '.', code: 'double' },
            { html: 'It isn’t related: the area changes in a different way for every rectangle.', why: 'Try ' + N(sh.k) + ' × ' + N(sh.k) + '. It works for every similar figure.', code: 'none' }],
            'Length × k and width × k, so area × ' + t('k\\times k=' + N(sh.k) + '\\times ' + N(sh.k) + '=' + N(kk)) + '.', ['What happens when both the length and the width are multiplied by k?'], 'area k^2'); } }] },
      { num: '13', stem: function (sh) { return 'A drawing is enlarged with a scale factor of ' + N(sh.k1) + '. Then the copy is reduced with a scale factor of ' + N(sh.k2) + '.'; },
        shared: function (r) { return find(function () { return { k1: r.pick([2, 3, 4, 2.5]), k2: r.pick([0.75, 0.5, 0.6, 0.8, 0.4]), s: r.pick([6, 8, 10, 12, 5]) }; }, function (v) { var k = v.k1 * v.k2; return Math.abs(k - 1) > 0.01 && places(v.s * v.k1 * v.k2) <= 1 && places(k) <= 2 && !(v.k1 === 2 && v.k2 === 0.75); }); }, parts: [
        { id: 'e13a', level: 'PRG', make: function (r, sh) { var c = q(sh.s * sh.k1), f = q(c * sh.k2);
          return fieldsPart('(a) A side of the first drawing is ' + U(sh.s, 'cm') + '. How long is it on the copy? On the final drawing?', [lenFld('Copy:', c, { unit: 'cm', name: 'Copy', scale: { len: sh.s, k: sh.k1, op: 'mul' } }), lenFld('Final:', f, { unit: 'cm', name: 'Final', scale: { len: c, k: sh.k2, op: 'mul' }, alts: [{ v: sh.s * sh.k2, code: 'u6k-order', hint: 'Reduce the <b>copy</b> (' + U(c, 'cm') + '), not the first drawing.' }] })],
            'Copy: ' + t(N(sh.s) + '\\times ' + N(sh.k1) + '=' + N(c)) + ' cm. Final: ' + t(N(c) + '\\times ' + N(sh.k2) + '=' + N(f)) + ' cm.', ['Multiply by ' + N(sh.k1) + ', then multiply that answer by ' + N(sh.k2) + '.'], 'two step sides'); } },
        { id: 'e13b', level: 'MAS', make: function (r, sh) { var k = q(sh.k1 * sh.k2), f = q(sh.s * k);
          return kPart('(b) What single scale factor changes the first drawing into the final drawing?', k, { from: { new: f, orig: sh.s }, diag: [{ v: sh.k1 + sh.k2, code: 'u6l1-k-add', hint: 'Scale factors don’t add. Try it with the side: ' + U(sh.s, 'cm') + ' → ' + U(f, 'cm') + '.' }, { v: sh.k1 - sh.k2, code: 'k-subtract', hint: 'Use the side from (a): final ÷ first.' }, { v: sh.k1 / sh.k2, code: 'value', hint: 'Use the side from (a): k = final ÷ first.' }],
            sol: br([t('k=' + N(f) + '\\div ' + N(sh.s) + '=' + N(k)), 'It is ' + t(N(sh.k1) + '\\times ' + N(sh.k2) + '=' + N(k)) + ': multiply the two scale factors.']), hints: ['Use the side from (a): k = final length ÷ first length.'], text: 'combined k' }); } },
        { id: 'e13c', level: 'PRG', make: function (r, sh) { var k = q(sh.k1 * sh.k2);
          return mc(r, '(b) How could you find the single scale factor from ' + N(sh.k1) + ' and ' + N(sh.k2) + '?', [
            { html: 'Multiply them: ' + t(N(sh.k1) + '\\times ' + N(sh.k2) + '=' + N(k)) + '.', right: true },
            { html: 'Add them: ' + t(N(sh.k1) + '+' + N(sh.k2) + '=' + N(sh.k1 + sh.k2)) + '.', why: 'Check with (a): ' + U(sh.s, 'cm') + ' × ' + N(sh.k1 + sh.k2) + ' isn’t the final length.', code: 'u6l1-k-add' },
            { html: 'Subtract them: ' + t(N(sh.k1) + '-' + N(sh.k2) + '=' + N(q(sh.k1 - sh.k2))) + '.', why: 'Check with (a): ' + U(sh.s, 'cm') + ' × ' + N(q(sh.k1 - sh.k2)) + ' isn’t the final length.', code: 'sub' },
            { html: 'Divide them: ' + t(N(sh.k1) + '\\div ' + N(sh.k2) + toN(sh.k1 / sh.k2, 2)) + '.', why: 'Check with (a): that doesn’t give the final length.', code: 'div' }],
            'Each step multiplies every length, so the two steps together multiply by ' + t(N(sh.k1) + '\\times ' + N(sh.k2) + '=' + N(k)) + '.', ['Try each one on the ' + N(sh.s) + ' cm side from (a).'], 'combine how'); } }] },
      { num: '14', stem: function (sh) { return 'Figure B is an enlargement of figure A with a scale factor of ' + N(sh.k) + '.'; }, shared: function (r) { return find(function () { return { k: r.pick([4, 5, 2, 2.5, 8]), b: r.int(9, 40) }; }, function (v) { return places(v.b / v.k) <= 2 && v.b % v.k !== 0; }); }, parts: [
        { id: 'e14a', level: 'ADV', make: function (r, sh) { var back = q(1 / sh.k);
          var p = kPart('(a) What scale factor changes figure B back into figure A?', Number.isInteger(sh.k) ? [1, sh.k] : back, { diag: [{ v: -sh.k, code: 'sign', hint: 'A scale factor is always positive.' }, { v: sh.k - 1, code: 'k-subtract', hint: 'Going back divides every length by ' + N(sh.k) + '.' }], sol: 'Going back divides every length by ' + N(sh.k) + ': ' + t('k=\\dfrac{1}{' + N(sh.k) + '}=' + N(back)) + '.', hints: ['Going from B to A, B is the original and A is the new figure.', 'Multiplying by ' + t('\\frac{1}{' + N(sh.k) + '}') + ' is the same as dividing by ' + N(sh.k) + '.'], text: 'reverse k' });
          if (Number.isInteger(sh.k)) p.key = '\\frac{1}{' + sh.k + '}'; else p.key = nS(back); return p; } },
        { id: 'e14b', level: 'PRG', make: function (r, sh) { var a = q(sh.b / sh.k);
          return lenPart('(b) A side of figure B is ' + U(sh.b, 'cm') + '. How long is the matching side of figure A?', a, { unit: 'cm', dp: 2, scale: { len: sh.b, k: sh.k, op: 'div' }, sol: t(N(sh.b) + '\\times ' + N(q(1 / sh.k)) + '=' + N(a)) + ' cm (or ' + t(N(sh.b) + '\\div ' + N(sh.k) + '=' + N(a)) + ' cm)', hints: ['A is the smaller figure: divide by ' + N(sh.k) + '.'], text: 'back side' }); } }] }
    ]
  });
})(window);
