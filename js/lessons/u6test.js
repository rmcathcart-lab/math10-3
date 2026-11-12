/* Math 10-3 · Unit 6 Test (G3) — Similarity and Scale: similar polygons and the scale factor (naming in matching order,
 * corresponding angles and sides, enlargements and reductions, models), the two tests for similar polygons (rectangles and
 * photos, boxes, regular polygons, frames), drawing enlargements and reductions (multiply every length, keep every angle; the
 * grid method, the projection method, the largest copy that fits), scale diagrams (scales in words and as ratios, maps and
 * floor plans both ways, real areas), similar triangles (the AA test, a missing side by a proportion, nested and crossing
 * triangles) and indirect measurement (shadows, mirrors, a ruler at arm's length). Built the way the Unit 5 test was built
 * (Beginning / Progressing / Mastery boxes, typed answers, keys from the generated numbers, `bad` answers with u6t- codes,
 * worked solutions and hints), with new items in the style of the booklet's review lesson (u6_l07.tex) and Practice Test 2
 * (u6_ep07.tex). Calculator allowed. One outcome: every part is G3.
 * 26 questions / 26 parts: Beginning 10 parts, Progressing 10, Mastery 6 — about 75 minutes (short_report.js:
 * 1.5 / 3 / 5 min a part). The short version (def.short) is about half of that and keeps all three boxes.
 *
 *   Beginning   — one-step skills: the scale factor from two lengths, and enlargement / reduction / same size; the angles of
 *                 two similar triangles from the naming order; a new side (× k) and an original side (÷ k); is a print similar
 *                 to a photo (long ÷ short, yes / no); a copy's side and angle (the angle does not change); a scale in words as
 *                 a ratio 1 : n; a real length from a floor plan ("1 cm represents x m"); the AA test (both third angles, yes /
 *                 no); the shadow method; the projection method (OA′ = k × OA, and how far A′ is from A).
 *   Progressing — the typical assignment question: similar figures (turned or flipped) — k, a new side and an original side;
 *                 an angle found through the naming order and the angle sum; which box (or can) is similar, and k; regular
 *                 polygons — each angle and k; the grid method (the move between two corners of the copy); a map at 1 : n —
 *                 map → real (km) and real → map (cm); similar triangles — a missing side to the nearest tenth; nested
 *                 triangles (DE ∥ BC) — BC and EC; the mirror method (eye height, not full height); a ruler at arm's length.
 *   Mastery     — skills combined: a 1 : n model both ways with unit changes; a picture with a mat border — the outside size
 *                 and what the long side would have to be to be similar; the largest similar enlargement that fits a sheet
 *                 (k, the poster size, the paper left over); a floor plan's real area and its cost; crossing triangles (a
 *                 sawhorse or a pond) — a piece and a whole length; the mirror method, then where a second person must stand.
 * Conversions to online: "measure with a ruler / protractor" → labelled drawings (every length or angle needed is printed on
 * the figure or in the question, so nothing is measured on the screen); "draw the enlargement / reduction" → the length or
 * angle of the copy, the move between two corners on the grid (squares across and up or down), the distance from O
 * (projection), the size of the copy; "is it similar? explain" → the ratio(s) and yes / no in boxes (the numbers carry the
 * explanation); "which box is similar" → a word box (B or C) + k (whichAmtPart); "name the triangles in matching order" →
 * the angle (or side) that the order gives; "choose a scale that fits" → the largest copy that fits a sheet (k and the
 * sizes); "write the proportion" → the answer it gives (the solution shows the proportion); "sketch the triangles" → the
 * figure is drawn. No multiple choice.
 * Partial credit: a recognized mistake that is one slip keeps 2/3 ('s'), a bigger but reasonable one keeps 1/3 ('b'), see
 * HW.addPartial below; in a set of 3+ boxes, one box wrong is a small mistake. Scale factors use HW.geo.kChk (a fraction or
 * a decimal; 1/k, new − original and the wrong side of 1 get their hints) and lengths from similar figures use
 * HW.geo.lenChk with its scale / proportion traps (× instead of ÷ k, adding k, the proportion upside down, adding the
 * difference); their codes are renamed to u6t- ones here so the partial credit is decided in this file.
 *
 * Also exports HW.u6assess, the assessment kit used by the Unit 6 exit slips (js/exits/u6.js loads after this file).
 * The test uses only the shared geometry kit HW.geo (js/geokit.js), no Unit 6 lesson kit, so tools that load only the test
 * files (tests/short_report.js) still work. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.similarSVG || !G.kChk || !G.lenChk) throw new Error('js/lessons/u6test.js needs HW.geo from js/geokit.js: load it first');
  var A = HW.u6assess = {};

  /* ================= numbers and words ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dg(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dg(x)); }
  function c2(x) { return HW.fmt(rd(x, 2).toFixed(2)); }
  function MM(x) { return t('\\$' + c2(x)); }
  function raw5(x) { var s = +x.toFixed(5); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '=' + raw5(x) + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function toM(x) { return near(x, rd(x, 2), 1e-7) ? '=\\$' + c2(x) : '=' + raw5(x) + '\\approx\\$' + c2(x); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function places(x) { for (var i = 0; i < 7; i++) { if (near(x * Math.pow(10, i), Math.round(x * Math.pow(10, i)), 1e-6)) return i; } return 9; }
  function find(gen, test, fb) { for (var i = 0; i < 2000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u6 assessment: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function art(s) { return (/^[aeiou]/i.test(s) ? 'an ' : 'a ') + s; }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function U(x, u) { return t(N(x) + uT(u)); }
  /* "a" or "an" before a number: an 8, an 11, an 18, an 80 */
  function aN(x) { var s = nS(x); return /^8/.test(s) || /^1[18](\.\d+)?$/.test(s) ? 'an' : 'a'; }
  /* a unit in TeX: 'cm' → \text{ cm}, 'm²' → \text{ m}^{2}, '°' → ^\circ */
  function uT(u) { if (!u) return ''; if (u === '°') return '^\\circ'; var m = /^(.*?)([²³])$/.exec(u); return m ? '\\text{ ' + m[1] + '}^{' + (m[2] === '²' ? 2 : 3) + '}' : '\\text{ ' + u + '}'; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  /* letters for figures: two triangles (or quadrilaterals) with no letter in common */
  var TRIS = [['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['J', 'K', 'L'], ['G', 'H', 'J'], ['L', 'M', 'N'], ['S', 'T', 'U'], ['K', 'L', 'M'], ['R', 'S', 'T'], ['U', 'V', 'W']];
  var QUADS = ['ABCD', 'PQRS', 'EFGH', 'JKLM', 'WXYZ', 'RSTU', 'KLMN', 'STUV'];
  function asArr(x) { return typeof x === 'string' ? x.split('') : x.slice(); }
  function twoNames(r, list) { var a = asArr(r.pick(list)), b = find(function () { return asArr(r.pick(list)); }, function (b) { return b.every(function (x) { return a.indexOf(x) < 0; }); }); return [a, b]; }
  Object.assign(A, { rd: rd, q: q, near: near, nS: nS, N: N, dg: dg, D: D, c2: c2, MM: MM, toN: toN, toM: toM, fx: fx, places: places, find: find, br: br, cap: cap, art: art, aN: aN, pickR: pickR, U: U, uT: uT,
    person: person, TRIS: TRIS, QUADS: QUADS, twoNames: twoNames });

  /* ================= reading and checking a number ================= */
  /* a typed number: "57", "57°", "x = 57", "12 cm", "$8.07", "1 : 500" (the "1 :" part) are all read as the number */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1);
    s = s.replace(/\\angle|∠/g, ' ').replace(/\\\$|\$/g, '');
    s = s.replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, ' °').replace(/\\[,;: !]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/°²³][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u6t-comma', 'Use a decimal point (not a comma), like 37.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  /* an answer rounded to dp places (default 0). o: { dp, money, exact, alts (other right values), tol, diag [{v, code, hint}]
   * (wrong), nudge [{v, code, hint}] (a format nudge, no try used), word (the rounding place in words), noPlaces (an exact
   * answer: no "round to …" nudge for too few decimals), miss } */
  function amtChk(ans, o) {
    o = o || {};
    var money = !!o.money, dp = money ? 2 : (o.dp == null ? 0 : o.dp), step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (money ? 'the cent (2 decimal places)' : dp === 0 ? 'a whole number' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp === 2 ? 'the nearest hundredth (2 decimal places)' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc0 = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var isAcc = function (x) { return isAcc0(x) || (o.tol && Math.abs(x - ans) <= o.tol + 1e-9); };
    var keep = function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); };
    var dgs = (o.diag || []).filter(keep), ng = (o.nudge || []).filter(keep);
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc0(v) || (d <= dp && isAcc(v)) || (o.tol && Math.abs(v - ans) <= o.tol + 1e-9)) return ok();
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      for (var j = 0; j < ng.length; j++) if (near(v, ng[j].v, tol) || near(v, rd(ng[j].v, dp), tol)) return form(ng[j].code, ng[j].hint);
      for (var i = 0; i < dgs.length; i++) {
        var m = dgs[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
        if (dp >= 2 && d === dp - 1 && near(v, rd(m.v, d), 1e-9) && !acc.some(function (y) { return near(rd(y, d), v, 1e-9); })) return wrong(m.code, m.hint);
      }
      if (!o.noPlaces && dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u6t-places', money ? 'Give money to the cent (2 decimal places), like $12.49.' : 'Round to ' + word + '.');
      if (dp >= 1 && d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u6t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  function keyOf(ans, o) { o = o || {}; var dp = o.money ? 2 : (o.dp == null ? 0 : o.dp); return o.money ? rd(ans, 2).toFixed(2) : nS(rd(ans, dp)); }
  function badOf(o, ans) {
    var dp = o.money ? 2 : (o.dp == null ? 0 : o.dp), acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    return (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }) && !(o.tol && Math.abs(rd(m.v, dp) - ans) <= o.tol + 1e-9); })
      .map(function (m) { return keyOf(m.v, o); });
  }

  /* ================= HW.geo checkers with this unit's codes ================= */
  var GEO_CODE = { 'k-mul-div': 'u6t-k-way', 'k-added': 'u6t-k-add', 'prop-flip': 'u6t-prop-flip', 'prop-add': 'u6t-prop-add', 'truncate': 'u6t-round-dir', 'sign': 'value', 'alt': 'value',
    'k-flip': 'u6t-k-flip', 'k-subtract': 'u6t-k-diff', 'k-direction': 'value', 'k-ratio': 'u6t-k-ratio', 'k-percent': 'u6t-k-pct', 'k-round': 'u6t-places', 'places': 'u6t-places', 'units': 'u6t-units', 'decimal': 'notnumber' };
  function mapRes(r) { return r && r.code && GEO_CODE[r.code] ? { v: r.v, code: GEO_CODE[r.code], hint: r.hint } : r; }
  /* a scale factor (HW.geo.kChk: a fraction or a decimal). o: { from: { new, orig }, dp 2, diag [{v, code, hint}] (checked first) } */
  function kChk(k, o) {
    o = o || {}; var base = G.kChk(k, { from: o.from, dp: o.dp == null ? 2 : o.dp }), dgs = (o.diag || []).filter(function (m) { return isFinite(m.v) && Math.abs(m.v - k) > 0.006; });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var r = base(resp);
      if (r.v === 'wrong' && r.code !== 'k-flip') { var a = readNum(resp); if (!a.res) for (var i = 0; i < dgs.length; i++) if (Math.abs(a.v - dgs[i].v) < 0.006 || near(rd(a.v, 2), rd(dgs[i].v, 2), 1e-9)) return wrong(dgs[i].code, dgs[i].hint); }
      return mapRes(r);
    };
  }
  function kKey(k) { return places(k) <= 4 ? nS(k) : nS(rd(k, 2)); }
  function kFld(label, k, o) {
    o = o || {}; var key = kKey(k), bad = [];
    if (Math.abs(k - 1) > 1e-9) bad.push(nS(rd(1 / k, 4)));
    (o.diag || []).forEach(function (m) { if (isFinite(m.v) && Math.abs(m.v - k) > 0.006 && Math.abs(m.v * k - 1) > 1e-6) bad.push(nS(rd(m.v, 4))); });
    return { label: label, name: o.name || 'k', chk: kChk(k, o), key: key, show: t(HW.fmt(key)), bad: bad };
  }
  /* a length from similar figures (HW.geo.lenChk). o: { dp 1, unit, scale: { len, k, op 'mul'|'div' }, prop: { given, num, den }
   * (answer = given × num ÷ den), alts [{v, code, hint}] } */
  function lenChk(v, o) {
    o = o || {}; var c = G.lenChk(v, { dp: o.dp == null ? 1 : o.dp, unit: o.unit, scale: o.scale, prop: o.prop, alts: o.alts || [], radTrap: false, early: false });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var sR = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{\s*([^{}]*?)\s*\}/g, ' $1'), m = /^(.*?\d\.?)\s*(mm|cm|km|m|in|ft|°|\^\{?\\circ\}?)\.?\s*$/i.exec(sR.trim());
      if (m && HW.parse.number(m[1].replace(/^\s*[A-Za-z]{1,3}\s*=\s*/, '')).ok) resp = m[1];
      return mapRes(c(resp));
    };
  }
  function lenBad(v, o) {
    var dp = o.dp == null ? 1 : o.dp, vals = (o.alts || []).map(function (a) { return a.v; }), sc = o.scale, pr = o.prop;
    if (sc) vals.push(sc.op === 'div' ? sc.len * sc.k : sc.len / sc.k, sc.len + sc.k);
    if (pr) vals.push(pr.given * pr.den / pr.num, pr.given + pr.num - pr.den);
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
  Object.assign(A, { readNum: readNum, amtChk: amtChk, keyOf: keyOf, badOf: badOf, mapRes: mapRes, kChk: kChk, kKey: kKey, kFld: kFld, lenChk: lenChk, lenFld: lenFld, lenPart: lenPart, lenBad: lenBad });

  /* ================= words: a choice typed in a box ================= */
  var STOP = { the: 1, it: 1, is: 1, a: 1, an: 1, are: 1, they: 1, i: 1, to: 1, be: 1, similar: 1, box: 1, can: 1, figure: 1, new: 1, its: 1, of: 1, so: 1, shape: 1, one: 1 };
  function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/[.,'’!:;()?]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
  function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
  function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
  /* -> 'right' | 'wrong' | 'both' | 'none' | 'empty' */
  function whichOf(resp, right, wrongs) {
    var ws = words(resp); if (!ws.length) return 'empty';
    var a = hit(ws, right), b = hit(ws, wrongs);
    return a && b ? 'both' : a ? 'right' : b ? 'wrong' : 'none';
  }
  /* a word box. o: { right, wrongs, choices (text for the nudge), why (hint when wrong), code (default 'value') }. Anything that is
   * not one of the choices gets a nudge with code 'word' (no credit if it is left). */
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
  var YES = ['yes', 'y', 'yep', 'yeah'], NO = ['no', 'n', 'not', 'nope'];
  var TYPE_TOK = { enlargement: ['enlargement', 'enlarge', 'enlarged', 'enlarg', 'bigger', 'larger'], reduction: ['reduction', 'reduce', 'reduced', 'reduc', 'smaller', 'shrink'], 'same size': ['same', 'congruent', 'samesize'] };
  function typeOf(k) { return k > 1 + 1e-9 ? 'enlargement' : k < 1 - 1e-9 ? 'reduction' : 'same size'; }

  /* ================= part builders ================= */
  /* one number. o as amtChk, plus before, after (unit after the box), unit (for the answer), sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {};
    var key = keyOf(ans, o), before = o.before !== undefined ? o.before : o.money ? '$' : undefined, after = o.after, unit = o.unit !== undefined ? o.unit : after;
    var p = { prompt: prompt, input: { type: 'number', before: before, after: after }, check: amtChk(ans, o), key: key, answer: t((o.money ? '\\$' : '') + HW.fmt(key) + (o.money ? '' : uT(unit))), solution: o.sol, hints: o.hints || [], text: o.text };
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
  /* a word box in a set of boxes. o: wordChk options + key (shown answer), ph, name, bad (wrong words) */
  function wfld(label, o) { return { label: label, name: o.name, mode: 'text', ph: o.ph, chk: wordChk(o), key: o.key, show: '<b>' + o.key + '</b>', bad: o.bad || [] }; }
  function yesNoFld(label, yes, why, code) { return wfld(label, { name: 'Similar', ph: 'yes or no', right: yes ? YES : NO, wrongs: yes ? NO : YES, choices: 'yes or no', key: yes ? 'yes' : 'no', bad: [yes ? 'no' : 'yes'], why: why, code: code }); }
  function typeFld(label, k) {
    var ty = typeOf(k), wr = []; Object.keys(TYPE_TOK).forEach(function (x) { if (x !== ty) wr = wr.concat(TYPE_TOK[x]); });
    return wfld(label, { name: 'Type', ph: 'enlargement, reduction or same size', right: TYPE_TOK[ty], wrongs: wr, choices: 'enlargement, reduction or same size', key: ty, bad: [ty === 'enlargement' ? 'reduction' : 'enlargement'],
      why: 'Compare k with 1: more than 1 is an enlargement (bigger), less than 1 a reduction (smaller), exactly 1 the same size.' });
  }
  /* several boxes. Grading: all right → correct; one box wrong in a set of 3 or more with no recognized mistake →
   * 'u6t-one-box' (small), of 2 → 'u6t-half-box' (bigger); one recognized mistake → its own code; several wrong boxes
   * with the same recognized mistake → that code; otherwise 'u6t-many-box'. */
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
        return wrong(res.length >= 3 ? 'u6t-one-box' : 'u6t-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
      return wrong('u6t-many-box', hint);
    };
  }
  function fieldsPart(prompt, specs, sol, hints, text) {
    var labels = specs.map(function (s) { return String(s.name || s.label).replace(/:$/, '').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s) { return { label: s.label, name: s.name || String(s.label).replace(/:$/, '').replace(/<[^>]+>|\\\(|\\\)/g, ''), before: s.before, after: s.after, mode: s.mode, placeholder: s.ph, wide: s.mode === 'text' }; }) },
      check: multiChk(specs.map(function (s) { return s.chk; }), labels), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return s.label + ' ' + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    var b0 = (specs[0].bad || []).filter(function (x) { return x !== String(specs[0].key); })[0];
    p.bad = [specs.map(function (s, i) { return i === 0 ? (b0 || (s.mode === 'text' ? 'zzz' : '99999')) : String(s.key); })];
    return p;
  }
  /* a word box + a number box ("which box is similar, and what is k?"). The number decides the credit: right number but the
   * wrong (or unclear) word → 'u6t-which' (bigger); a wrong number → its own code.
   * o: { amt, dp, after, alts, diag, noPlaces, whichLabel, amtLabel, ph, right, wrongs, rightKey, wrongKey, why, nudge, sol, hints, text } */
  function whichAmtPart(prompt, o) {
    var ao = { dp: o.dp, alts: o.alts, diag: o.diag, noPlaces: o.noPlaces }, amt = amtChk(o.amt, ao);
    var check = function (resp) {
      resp = resp || []; var w = whichOf(resp[0], o.right, o.wrongs), a = amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.whichLabel + '</b> Type your choice.');
      if (a.v === 'form') return form(a.code, '<b>' + o.amtLabel + '</b> ' + (a.hint || 'Check the format.'));
      if (w === 'right' && a.v === 'correct') return ok();
      if (w !== 'right' && a.v === 'correct') return w === 'both' || w === 'none' ? form('word', 'Type just one choice: ' + o.nudge) : wrong('u6t-which', o.why);
      return wrong(a.code || 'value', '<b>' + o.amtLabel + '</b> ' + (a.hint || 'Check this one again.'));
    };
    var key = [o.rightKey, keyOf(o.amt, ao)];
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.whichLabel, name: 'Choice', mode: 'text', placeholder: o.ph, wide: true }, { label: o.amtLabel, name: 'Number', after: o.after }] },
      check: check, key: key, answer: o.whichLabel + ' <b>' + o.rightKey + '</b><br>' + o.amtLabel + ' ' + t(HW.fmt(key[1]) + uT(o.after)), solution: o.sol, hints: o.hints || [], text: o.text,
      bad: [[o.wrongKey, key[1]]].concat(badOf(ao, o.amt).map(function (b) { return [o.rightKey, b]; })) };
  }
  function table(head, rows) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em"><tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  Object.assign(A, { whichOf: whichOf, wordChk: wordChk, YES: YES, NO: NO, TYPE_TOK: TYPE_TOK, typeOf: typeOf, num: num, fld: fld, wfld: wfld, yesNoFld: yesNoFld, typeFld: typeFld, multiChk: multiChk,
    fieldsPart: fieldsPart, whichAmtPart: whichAmtPart, table: table });

  /* ================= drawings (the shared figures are HW.geo's; these few are this unit's own) ================= */
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', RED = '#c93a33', GREEN = '#12805a', RAD = Math.PI / 180;
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function dirTo(V, P) { return ((Math.atan2(-(P[1] - V[1]), P[0] - V[0]) / RAD) % 360 + 360) % 360; }
  function lerp(P, Q, s) { return [P[0] + (Q[0] - P[0]) * s, P[1] + (Q[1] - P[1]) * s]; }
  /* a small SVG canvas that tracks its bounding box (screen coordinates, y down) */
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
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-z]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '';
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it +
      (o.halo === false ? '' : ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"') + '>' + esc(str).replace(/-/g, '−') + '</text>';
    return this.grow(x, y, str.length * size * 0.32 + 2, size * 0.62);
  };
  Fig.prototype.dot = function (p, o) { o = o || {}; this.s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (o.r || 3.4) + '" fill="' + (o.color || INK) + '"/>'; return this.grow(p[0], p[1], o.r || 3.4); };
  /* a right-angle mark at V with arms toward P and Q */
  Fig.prototype.right = function (V, P, Q, s) {
    s = s || 11; var u = at([0, 0], dirTo(V, P), 1), v = at([0, 0], dirTo(V, Q), 1);
    return this.path('M' + f1(V[0] + u[0] * s) + ' ' + f1(V[1] + u[1] * s) + 'L' + f1(V[0] + (u[0] + v[0]) * s) + ' ' + f1(V[1] + (u[1] + v[1]) * s) + 'L' + f1(V[0] + v[0] * s) + ' ' + f1(V[1] + v[1] * s), { stroke: INK, width: 1.5 });
  };
  /* a ">" mark (parallel lines) in the middle of PQ, pointing from P to Q (n marks) */
  Fig.prototype.chev = function (P, Q, n) {
    var d = dirTo(P, Q), M = lerp(P, Q, 0.5);
    for (var i = 0; i < (n || 1); i++) { var c = at(M, d, i * 7 + 4), a = at(c, d + 180, 8), u = at([0, 0], d + 90, 5.5); this.path('M' + f1(a[0] + u[0]) + ' ' + f1(a[1] + u[1]) + 'L' + f1(c[0]) + ' ' + f1(c[1]) + 'L' + f1(a[0] - u[0]) + ' ' + f1(a[1] - u[1]), { stroke: INK, width: 2 }); }
    return this;
  };
  /* a label beside segment PQ, on the side away from point C (or toward it with o.inside) */
  Fig.prototype.seg = function (P, Q, C, s, o) {
    o = o || {}; var M = lerp(P, Q, o.at == null ? 0.5 : o.at), n = at([0, 0], dirTo(P, Q) + 90, 1);
    if ((C[0] - M[0]) * n[0] + (C[1] - M[1]) * n[1] > 0) n = [-n[0], -n[1]];
    if (o.inside) n = [-n[0], -n[1]];
    var size = o.size || 14, str = String(s), d = (o.gap || 6) + Math.abs(n[0]) * (str.length * size * 0.3 + 2) + Math.abs(n[1]) * size * 0.6;
    return this.text(M[0] + n[0] * d, M[1] + n[1] * d, str, { size: size, color: o.color || (str === '?' || /^[a-z]$/.test(str) ? RED : INK), weight: 700 });
  };
  Fig.prototype.name = function (P, C, s) { var d = dirTo(C, P), q2 = at(P, d, 13); return this.text(q2[0], q2[1], s, { size: 15, italic: false }); };
  Fig.prototype.svg = function (o) {
    o = o || {}; var pad = o.pad == null ? 8 : o.pad, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>';
  };
  /* △ABC with DE ∥ BC (D on AB, E on AC). lab: { AD, DB, DE, AE, EC, BC } strings (or null) */
  function nestedSVG(nm, s, lab, o) {
    o = o || {}; var fg = new Fig(), Av = [80, 0], B = [0, 170], C = [230, 170], Dp = lerp(Av, B, s), E = lerp(Av, C, s), G0 = [(Av[0] + B[0] + C[0]) / 3, (Av[1] + B[1] + C[1]) / 3];
    fg.poly([Av, B, C], { fill: '#eef1f6', stroke: INK, width: 2.4 }).line(Dp, E, { width: 2.4, color: BLUE }).chev(Dp, E).chev(B, C);
    [[Av, Dp, 'AD'], [Dp, B, 'DB'], [Av, E, 'AE'], [E, C, 'EC']].forEach(function (z) { if (lab[z[2]]) fg.seg(z[0], z[1], G0, lab[z[2]]); });
    if (lab.DE) fg.seg(Dp, E, Av, lab.DE, { inside: true, gap: 4 });
    if (lab.BC) fg.seg(B, C, Av, lab.BC);
    fg.name(Av, G0, nm[0]).name(B, G0, nm[1]).name(C, G0, nm[2]).name(Dp, E, nm[3]).name(E, Dp, nm[4]);
    return fg.svg({ width: o.width || 300, aria: 'a triangle cut by a line parallel to one side' });
  }
  /* two segments crossing at X: tops P1 (left) and P2 (right) joined by a top line, feet Q1 (left) and Q2 (right) on a bottom
   * line parallel to it; P1–X–Q2 and P2–X–Q1 are straight. s = top width ÷ bottom width. lab: { top, bottom, P1X, XQ2, P2X, XQ1 } */
  function crossSVG(nm, s, lab, o) {
    o = o || {}; var fg = new Fig(), big = 230, Wb = s >= 1 ? big / s : big, H = 190, Wt = Wb * s, yX = H * s / (1 + s), cx = big / 2;
    var P1 = [cx - Wt / 2, 0], P2 = [cx + Wt / 2, 0], Q1 = [cx - Wb / 2, H], Q2 = [cx + Wb / 2, H], X = [cx, yX];
    if (o.ground) fg.line([Q1[0] - 25, H], [Q2[0] + 25, H], { color: '#8a6f4d', width: 2.4 });
    fg.line(P1, Q2).line(P2, Q1).line(P1, P2).line(Q1, Q2, { color: o.ground ? '#8a6f4d' : INK });
    if (!o.ground) fg.chev(P1, P2).chev(Q1, Q2);
    fg.poly([P1, P2, X], { fill: BLUE, fillOpacity: 0.08 }).poly([Q1, Q2, X], { fill: BLUE, fillOpacity: 0.08 });
    var top = [cx, -40], bot = [cx, H + 40];
    if (lab.top) fg.seg(P1, P2, X, lab.top); if (lab.bottom) fg.seg(Q1, Q2, X, lab.bottom);
    if (lab.P1X) fg.seg(P1, X, P2, lab.P1X); if (lab.P2X) fg.seg(P2, X, P1, lab.P2X); if (lab.XQ2) fg.seg(X, Q2, Q1, lab.XQ2); if (lab.XQ1) fg.seg(X, Q1, Q2, lab.XQ1);
    if (nm) { fg.name(P1, [P1[0] + 20, P1[1] + 20], nm[0]).name(P2, [P2[0] - 20, P2[1] + 20], nm[1]).name(Q1, [Q1[0] + 20, Q1[1] - 20], nm[3]).name(Q2, [Q2[0] - 20, Q2[1] - 20], nm[4]); fg.text(X[0] + 18, X[1], nm[2], { size: 15, italic: false }); }
    else if (o.xName) fg.text(X[0] + 18, X[1], o.xName, { size: 15, italic: false });
    void top; void bot;
    return fg.svg({ width: o.width || 300, aria: o.aria || 'two crossing triangles' });
  }
  Object.assign(A, { Fig: Fig, at: at, lerp: lerp, dirTo: dirTo, nestedSVG: nestedSVG, crossSVG: crossSVG, INK: INK, BLUE: BLUE, RED: RED, GREEN: GREEN, GREY: GREY });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u6t-comma': 'Comma instead of a decimal point', 'u6t-places': 'Not rounded to the place asked', 'u6t-round-dir': 'Rounded the wrong way (or chopped)', 'u6t-units': 'Typed the unit in the box',
    'u6t-which': 'Right number, wrong (or unclear) choice', 'u6t-one-box': 'One box of several wrong', 'u6t-half-box': 'One of the two boxes wrong', 'u6t-many-box': 'Several boxes wrong',
    'u6t-k-flip': 'Scale factor upside down (original ÷ new)', 'u6t-k-diff': 'Scale factor as a difference (new − original)', 'u6t-k-ratio': 'Wrote the scale factor as a ratio', 'u6t-k-pct': 'Wrote the scale factor as a percent',
    'u6t-k-unit': 'Scale factor: did not change to the same units', 'u6t-k-way': 'Multiplied by k instead of dividing (or the reverse)', 'u6t-k-add': 'Added the scale factor instead of multiplying',
    'u6t-prop-flip': 'Proportion set up upside down', 'u6t-prop-add': 'Added the same amount instead of multiplying', 'u6t-angle-k': 'Changed the angle by the scale factor (angles stay the same)',
    'u6t-match': 'Matched the wrong corner or side (naming order)', 'u6t-angle-sum': 'Used the wrong angle sum', 'u6t-ratio-flip': 'Ratio upside down (short ÷ long)', 'u6t-ratio-mix': 'Matched a short side with a long side',
    'u6t-sim-verdict': 'Right ratios, wrong decision (similar or not)', 'u6t-aa-verdict': 'Right angles, wrong decision (similar or not)', 'u6t-reg-sum': 'Regular polygon: gave the angle sum, not one angle',
    'u6t-reg-ext': 'Regular polygon: 360° ÷ n (the turn at a corner)', 'u6t-grid-add': 'Grid: added k to the squares', 'u6t-grid-nok': 'Grid: gave the move of the original (not × k)', 'u6t-grid-swap': 'Grid: mixed up across and up / down',
    'u6t-proj-past': 'Projection: measured k × OA past A, not from O', 'u6t-proj-o': 'Projection: gave the distance from O, not from A', 'u6t-no-unit': 'Did not change to the same unit', 'u6t-unit-way': 'Used the wrong unit factor (10, 100, 1000, 100 000)',
    'u6t-unit-cm': 'Gave the length in centimetres, not in the unit asked', 'u6t-scale-way': 'Scale: multiplied instead of dividing (or the reverse)', 'u6t-area-scale': 'Area: scaled the plan area by n (not each length)',
    'u6t-area-cm': 'Area: gave square centimetres, not square metres', 'u6t-piece': 'Used a piece of a side instead of the whole side (or the reverse)', 'u6t-whole': 'Gave the whole side, not the piece asked',
    'u6t-full-height': 'Mirror: used the full height, not the eye height', 'u6t-mirror-total': 'Mirror: used the distance from the person to the object', 'u6t-unit-mix': 'Mixed centimetres and metres in one ratio',
    'u6t-border-once': 'Added the border on one side only', 'u6t-add-not-mult': 'Added the same amount to both sides (not similar)', 'u6t-fit-big': 'Fit: used the bigger scale factor (does not fit)',
    'u6t-left-other': 'Fit: gave the leftover of the other direction', 'u6t-same-spot': 'Mirror: kept the first person’s distance'
  });
  HW.addPartial({
    'u6t-round-dir': 's', 'u6t-which': 'b', 'u6t-one-box': 's', 'u6t-half-box': 'b', 'u6t-many-box': 'n',
    'u6t-k-flip': 'b', 'u6t-k-diff': 'n', 'u6t-k-unit': 'b', 'u6t-k-way': 'b', 'u6t-k-add': 'n', 'u6t-prop-flip': 'b', 'u6t-prop-add': 'n', 'u6t-angle-k': 'n', 'u6t-match': 'b', 'u6t-angle-sum': 'b',
    'u6t-ratio-flip': 'b', 'u6t-ratio-mix': 'b', 'u6t-sim-verdict': 'b', 'u6t-aa-verdict': 'b', 'u6t-reg-sum': 'b', 'u6t-reg-ext': 'n', 'u6t-grid-add': 'n', 'u6t-grid-nok': 'n', 'u6t-grid-swap': 'b',
    'u6t-proj-past': 'b', 'u6t-proj-o': 'b', 'u6t-no-unit': 'b', 'u6t-unit-way': 'b', 'u6t-unit-cm': 's', 'u6t-scale-way': 'n', 'u6t-area-scale': 'b', 'u6t-area-cm': 's', 'u6t-piece': 'b', 'u6t-whole': 's',
    'u6t-full-height': 's', 'u6t-mirror-total': 'b', 'u6t-unit-mix': 'b', 'u6t-border-once': 'b', 'u6t-add-not-mult': 'b', 'u6t-fit-big': 'b', 'u6t-left-other': 'b', 'u6t-same-spot': 'n'
  });
  var H_KWAY = 'New = k × original; original = new ÷ k.';

  /* ======================================================================================================
   * 6.1 Similar polygons and the scale factor
   * ====================================================================================================== */
  var KS = [2.5, 0.25, 0.4, 3.5, 0.6, 4, 1.5, 0.75, 1.25, 3, 0.8, 2, 0.2, 1.6, 2.4, 0.5, 5, 0.3, 1.2];
  /* the scale factor from two lengths, and enlargement / reduction / same size */
  function kTypePart(r, o) {
    o = o || {};
    var same = r.chance(0.08), k = same ? 1 : r.pick(KS), u = r.pick(['cm', 'm', 'in', 'ft', 'cm']);
    var s = find(function () { var a = pickR(r, [2, 24, 0.5]); return { a: a, b: q(a * k) }; }, function (s) { return places(s.b) <= 2 && s.b >= 0.5 && (same || Math.abs(s.b - s.a) > 0.4) && !(s.a === 4 && s.b === 10); });
    var ty = typeOf(k);
    var ctx = r.pick(['A side of an original figure is ' + U(s.a, u) + '. The matching side of a similar new figure is ' + U(s.b, u) + '.',
      'A shape is copied. One side of the original is ' + U(s.a, u) + ' and the matching side of the copy is ' + U(s.b, u) + '.',
      'A figure has a side of ' + U(s.a, u) + '. In a similar figure, the matching side is ' + U(s.b, u) + '.']);
    return fieldsPart(ctx + ' Find the scale factor ' + t('k') + ' (new ÷ original). Is the new figure an enlargement, a reduction or the same size?',
      [kFld(t('k') + ' =', k, { from: { new: s.b, orig: s.a } }), typeFld('Type:', k)],
      br([t('k=\\dfrac{\\text{new}}{\\text{original}}=\\dfrac{' + N(s.b) + '}{' + N(s.a) + '}=' + N(k)), ty === 'same size' ? t('k=1') + ': the <b>same size</b> (congruent).' : t('k' + (k > 1 ? '>' : '<') + '1') + ': ' + art(ty) + '.']),
      ['Scale factor = new length ÷ original length (the new one on top).', 'More than 1: bigger. Less than 1: smaller.'], o.text || 'scale factor and type');
  }
  /* the angles of two similar triangles from the naming order */
  function triAnglePart(r, o) {
    o = o || {};
    var nm = twoNames(r, TRIS), T1 = nm[0], T2 = nm[1];
    var s = find(function () { var a = r.int(25, 85), b = r.int(30, 110); return { a: a, b: b, c: 180 - a - b }; }, function (s) { return s.c >= 22 && s.a !== s.b && s.b !== s.c && s.a !== s.c && [s.a, s.b, s.c].indexOf(90) < 0 && !(s.a === 38 && s.b === 97); });
    var A1 = '\\angle ' + T1[0], B1 = '\\angle ' + T1[1], C1 = '\\angle ' + T1[2];
    var specs = [fld(t(C1) + ' =', s.c, { after: '°', name: '∠' + T1[2], diag: [{ v: 360 - s.a - s.b, code: 'u6t-angle-sum', hint: 'The angles of a <b>triangle</b> add to 180°.' }] }),
      fld(t('\\angle ' + T2[1]) + ' =', s.b, { after: '°', name: '∠' + T2[1], diag: [{ v: s.a, code: 'u6t-match', hint: 'Match the letters in order: the 2nd letter of △' + T2.join('') + ' goes with the 2nd letter of △' + T1.join('') + '.' }, { v: s.c, code: 'u6t-match', hint: 'Match the letters in order: ' + T2[1] + ' is the 2nd letter, so it goes with ' + T1[1] + '.' }] }),
      fld(t('\\angle ' + T2[2]) + ' =', s.c, { after: '°', name: '∠' + T2[2], diag: [{ v: s.a, code: 'u6t-match', hint: T2[2] + ' is the 3rd letter, so it goes with ' + T1[2] + '.' }, { v: s.b, code: 'u6t-match', hint: T2[2] + ' is the 3rd letter, so it goes with ' + T1[2] + '.' }] })];
    return fieldsPart(t('\\triangle ' + T1.join('') + '\\sim\\triangle ' + T2.join('')) + '. ' + t(A1 + '=' + dg(s.a)) + ' and ' + t(B1 + '=' + dg(s.b)) + '. Find ' + t(C1) + ', ' + t('\\angle ' + T2[1]) + ' and ' + t('\\angle ' + T2[2]) + '.', specs,
      br([t(C1 + '=180^\\circ-' + dg(s.a) + '-' + dg(s.b) + '=' + dg(s.c)) + ' (the angles of a triangle add to 180°)', 'The letters match in order: ' + T1[0] + ' ↔ ' + T2[0] + ', ' + T1[1] + ' ↔ ' + T2[1] + ', ' + T1[2] + ' ↔ ' + T2[2] + '. Corresponding angles are equal:',
        t('\\angle ' + T2[1] + '=' + B1 + '=' + dg(s.b)) + ', ' + t('\\angle ' + T2[2] + '=' + C1 + '=' + dg(s.c))]),
      ['Third angle = 180° − the other two.', 'The 1st letters match, the 2nd letters match, the 3rd letters match.'], o.text || 'angles from the naming order');
  }
  /* a new side (× k) and an original side (÷ k) */
  function kSidesPart(r, o) {
    o = o || {};
    var k = r.pick([2.5, 0.4, 1.5, 0.75, 3, 0.6, 1.25, 4, 0.8, 1.6, 2.4, 0.5, 3.5]), u = r.pick(['cm', 'm', 'cm', 'in']);
    var s = find(function () { var x = pickR(r, [2, 16, 0.5]), y = pickR(r, [2, 30, 0.5]); return { x: x, nx: q(x * k), y: y, oy: q(y / k) }; }, function (s) { return places(s.nx) <= 2 && places(s.oy) <= 2 && s.x !== s.oy && Math.abs(s.y - s.nx) > 0.4 && !(k === 2.5 && s.y === 20); });
    var specs = [lenFld('New side:', s.nx, { dp: 2, unit: u, name: 'New side', scale: { len: s.x, k: k, op: 'mul' } }), lenFld('Original side:', s.oy, { dp: 2, unit: u, name: 'Original side', scale: { len: s.y, k: k, op: 'div' } })];
    return fieldsPart('A figure is ' + (k > 1 ? 'enlarged' : 'reduced') + ' with a scale factor of ' + t('k=' + N(k)) + '. (a) A side of the original is ' + U(s.x, u) + '. How long is the matching side of the new figure? (b) A side of the new figure is ' + U(s.y, u) + '. How long was that side on the original?', specs,
      br(['(a) New = k × original: ' + t(N(k) + '\\times ' + N(s.x) + '=' + N(s.nx)) + ' ' + u, '(b) Original = new ÷ k: ' + t(N(s.y) + '\\div ' + N(k) + '=' + N(s.oy)) + ' ' + u + '. Check: ' + t(N(s.oy) + '\\times ' + N(k) + '=' + N(s.y)) + ' ✓']),
      [H_KWAY, k > 1 ? 'An enlargement: new sides are longer, original sides are shorter.' : 'A reduction: new sides are shorter, original sides are longer.'], o.text || 'new and original sides with k');
  }
  /* similar figures (turned or flipped): k, a new side x and an original side y */
  var QPTS = [[[0, 0], [5, 0], [4, 3], [0, 2]], [[0, 0], [4, 0], [5, 3], [1, 2.5]], [[0, 0], [5, 0], [3.5, 3], [0.5, 3]], [[0, 0], [4.5, 0], [4.5, 2], [1, 3]], [[0, 0], [5, 0], [5, 2.2], [1.5, 3]]];
  var TPTS = [[[0, 0], [5, 0], [1.5, 3]], [[0, 0], [4.5, 0], [3.5, 3]], [[0, 0], [5, 0], [2.8, 2.4]], [[0, 0], [4, 0], [0, 3]], [[0, 0], [5, 0], [4, 2.6]]];
  function dk(k) { return Math.max(0.6, Math.min(1.75, k)); }
  function sideName(nm, i) { return nm[i] + nm[(i + 1) % nm.length]; }
  function simFigShared(r, o) {
    o = o || {};
    var tri = o.tri != null ? o.tri : r.chance(0.4), n = tri ? 3 : 4, nm = tri ? twoNames(r, TRIS) : twoNames(r, QUADS), k = r.pick([1.5, 2.5, 0.4, 0.75, 1.25, 0.6, 3, 1.6, 0.8, 2, 2.4, 0.5]);
    var u = r.pick(['cm', 'm', 'cm']);
    var s = find(function () {
      var L = []; for (var i = 0; i < n; i++) L.push(pickR(r, [2, 14, 0.5]));
      var ix = r.shuffle([0, 1, 2, 3].slice(0, n));
      return { L: L, i0: ix[0], i1: ix[1], i2: ix[2] };
    }, function (s) {
      var L = s.L, ok3 = L.every(function (x) { return places(q(x * k)) <= 2; });
      var uniq = L.every(function (x, i) { return L.indexOf(x) === i; });
      var triOk = !tri || (L[0] + L[1] > L[2] + 1 && L[1] + L[2] > L[0] + 1 && L[0] + L[2] > L[1] + 1);
      return ok3 && uniq && triOk;
    });
    var L = s.L, NL = L.map(function (x) { return q(x * k); }), lab0 = [], lab1 = [];
    for (var i = 0; i < n; i++) { lab0.push(''); lab1.push(''); }
    lab0[s.i0] = N(L[s.i0]) + ' ' + u; lab1[s.i0] = N(NL[s.i0]) + ' ' + u;
    lab0[s.i1] = N(L[s.i1]) + ' ' + u; lab1[s.i1] = 'x';
    lab0[s.i2] = 'y'; lab1[s.i2] = N(NL[s.i2]) + ' ' + u;
    if (n === 4) { var i3 = [0, 1, 2, 3].filter(function (j) { return [s.i0, s.i1, s.i2].indexOf(j) < 0; })[0]; lab0[i3] = N(L[i3]) + ' ' + u; }
    var rot = r.pick([0, 0, 90, 180, -90, 30]), flip = r.chance(0.35);
    var svg = G.similarSVG({ pts: r.pick(tri ? TPTS : QPTS), k: k, drawK: dk(k), names: [nm[0].join(''), nm[1].join('')], labels: [lab0, lab1], rot: rot, flip: flip, width: 440 });
    return { tri: tri, n: n, nm: nm, k: k, u: u, L: L, NL: NL, i0: s.i0, i1: s.i1, i2: s.i2, svg: svg, rel: (tri ? '\\triangle ' : '') + nm[0].join('') + '\\sim ' + (tri ? '\\triangle ' : '') + nm[1].join('') };
  }
  function simFigPart(r, o) {
    o = o || {};
    var s = simFigShared(r, o), a = s.nm[0], b = s.nm[1], x = s.NL[s.i1], y = s.L[s.i2];
    var sp = [kFld(t('k') + ' =', s.k, { from: { new: s.NL[s.i0], orig: s.L[s.i0] } }), lenFld(t('x') + ' =', x, { dp: 2, unit: s.u, name: 'x', scale: { len: s.L[s.i1], k: s.k, op: 'mul' } }),
      lenFld(t('y') + ' =', y, { dp: 2, unit: s.u, name: 'y', scale: { len: s.NL[s.i2], k: s.k, op: 'div' } })];
    return fieldsPart(t(s.rel) + '. The diagrams are not drawn to scale. Find the scale factor ' + t('k') + ' from ' + a.join('') + ' to ' + b.join('') + '. Then find ' + t('x') + ' (side ' + sideName(b, s.i1) + ') and ' + t('y') + ' (side ' + sideName(a, s.i2) + ').' + s.svg, sp,
      br(['Match the sides in the naming order: ' + [0, 1, 2, 3].slice(0, s.n).map(function (i) { return sideName(a, i) + ' ↔ ' + sideName(b, i); }).join(', ') + '.',
        sideName(a, s.i0) + ' and ' + sideName(b, s.i0) + ' are both known: ' + t('k=' + N(s.NL[s.i0]) + '\\div ' + N(s.L[s.i0]) + '=' + N(s.k)) + ' (' + (s.k > 1 ? 'an enlargement' : 'a reduction') + ').',
        t('x') + ' is in the new figure: ' + t('x=' + N(s.k) + '\\times ' + N(s.L[s.i1]) + '=' + N(x)) + ' ' + s.u, t('y') + ' is in the original: ' + t('y=' + N(s.NL[s.i2]) + '\\div ' + N(s.k) + '=' + N(y)) + ' ' + s.u]),
      ['Find a pair of matching sides where you know both lengths. k = new ÷ original.', H_KWAY], o.text || 'similar figures: k and two sides');
  }
  /* an angle found through the naming order and the angle sum (n = 4 or 5) */
  function angleNamePart(r, o) {
    o = o || {};
    var n = o.n || r.pick([4, 4, 5]), S = (n - 2) * 180, L1 = n === 4 ? r.pick(QUADS).split('') : r.pick(['ABCDE', 'VWXYZ', 'FGHJK', 'PQRST', 'LMNUW']).split('');
    var L2 = find(function () { return n === 4 ? r.pick(QUADS).split('') : r.pick(['ABCDE', 'VWXYZ', 'FGHJK', 'PQRST', 'LMNUW']).split(''); }, function (L) { return L.every(function (x) { return L1.indexOf(x) < 0; }); });
    var ang = find(function () { var a = []; for (var i = 0; i < n - 1; i++) a.push(Math.round(S / n) + r.int(-32, 32)); a.push(S - a.reduce(function (x, y) { return x + y; }, 0)); return a; },
      function (a) { return a.every(function (x, i) { return x >= 55 && x <= 172 && x !== 90 && a.indexOf(x) === i; }); });
    var j = r.int(0, n - 1), from = []; for (var i = 0; i < n; i++) if (i !== j) from.push(r.chance(0.5) ? 1 : 0);
    var given = [], gi = 0; for (var i2 = 0; i2 < n; i2++) if (i2 !== j) { given.push({ i: i2, L: from[gi] ? L2[i2] : L1[i2], v: ang[i2] }); gi++; }
    if (given.every(function (g) { return g.L === L1[g.i]; })) given[0].L = L2[given[0].i];
    if (given.every(function (g) { return g.L === L2[g.i]; })) given[0].L = L1[given[0].i];
    given = r.shuffle(given);
    var ask = L2[j], ans = ang[j], sumG = S - ans, nmw = n === 4 ? 'quadrilateral' : 'pentagon';
    var diag = [{ v: (n === 4 ? 540 : 360) - sumG, code: 'u6t-angle-sum', hint: 'The angles of a ' + nmw + ' add to ' + S + '°: ' + t('(' + n + '-2)\\times 180^\\circ') + '.' }, { v: (n === 4 ? 720 : 720) - sumG, code: 'u6t-angle-sum', hint: 'The angles of a ' + nmw + ' add to ' + S + '°.' }].filter(function (m) { return m.v > 0 && m.v < 360; });
    given.forEach(function (g) { diag.push({ v: g.v, code: 'u6t-match', hint: 'Match the letters in order: ' + ask + ' is letter ' + (j + 1) + ' of ' + L2.join('') + ', so it goes with ' + L1[j] + ' — the one angle not given.' }); });
    return num(cap(nmw) + ' ' + L1.join('') + ' ∼ ' + nmw + ' ' + L2.join('') + '. ' + given.map(function (g) { return t('\\angle ' + g.L + '=' + dg(g.v)); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. Find ' + t('\\angle ' + ask) + '. (You don’t need a picture: use the naming order.)', ans, { after: '°', diag: diag,
      sol: br(['Match the letters in order: ' + L1.map(function (x, i) { return x + ' ↔ ' + L2[i]; }).join(', ') + '. Corresponding angles are equal, so the angles of either figure are ' + given.map(function (g) { return D(g.v); }).join(', ') + ' and the missing one.',
        'The angles of a ' + nmw + ' add to ' + t('(' + n + '-2)\\times 180^\\circ=' + S + '^\\circ') + '.', t('\\angle ' + ask + '=\\angle ' + L1[j] + '=' + S + '^\\circ-' + given.map(function (g) { return dg(g.v); }).join('-') + '=' + dg(ans))]),
      hints: ['Write the two names one above the other: the letters in the same position match.', 'The angles of a ' + nmw + ' add to ' + S + '°.'], text: o.text || 'an angle from the naming order' });
  }
  /* a 1 : n model both ways, with unit changes */
  var MODELS = [{ n: 24, what: 'pickup truck', L: [5.2, 6.1, 0.01], p: ['cab is', 7.2, 8.6, 0.05, 'tall'] }, { n: 64, what: 'car', L: [4.2, 4.9, 0.01], p: ['wheel is', 0.9, 1.2, 0.05, 'across'] },
    { n: 87, what: 'grain boxcar', L: [15, 17.5, 0.1], p: ['door is', 3.2, 4.6, 0.1, 'wide'] }, { n: 18, what: 'motorcycle', L: [2.0, 2.4, 0.01], p: ['seat is', 4.5, 5.5, 0.1, 'high'] },
    { n: 150, what: 'ferry', L: [45, 70, 0.5], p: ['deck is', 6.5, 9.5, 0.1, 'wide'] }, { n: 43, what: 'fire truck', L: [9.5, 12.5, 0.1], p: ['ladder is', 22, 28, 0.5, 'long'] }];
  function modelPart(r, o) {
    o = o || {};
    var m = r.pick(MODELS), s = find(function () { return { L: pickR(r, m.L), p: pickR(r, [m.p[1], m.p[2], m.p[3]]) }; }, function (s) { var a = s.L * 100 / m.n; return Math.abs(a * 10 - Math.floor(a * 10) - 0.5) > 0.05 && places(q(s.p * m.n / 100)) <= 3; });
    var mod = s.L * 100 / m.n, real = s.p * m.n / 100, dp2 = places(q(real)) <= 2 ? 2 : 3;
    var specs = [lenFld('Model length:', mod, { dp: 1, unit: 'cm', name: 'Model length', alts: [{ v: s.L / m.n, code: 'u6t-no-unit', hint: 'Change ' + N(s.L) + ' m to centimetres first: × 100.' }, { v: s.L * 100 * m.n, code: 'u6t-scale-way', hint: 'The model is <b>smaller</b> than the real ' + m.what + ': divide by ' + m.n + '.' }, { v: s.L * 1000 / m.n, code: 'u6t-unit-way', hint: '1 m = 100 cm (not 1000).' }] }),
      lenFld('Real ' + m.p[0].replace(/ is$/, '') + ':', real, { dp: dp2, unit: 'm', name: 'Real size', alts: [{ v: s.p * m.n, code: 'u6t-unit-cm', hint: 'That is in centimetres. Change it to metres: ÷ 100.' }, { v: s.p / m.n, code: 'u6t-scale-way', hint: 'The real ' + m.what + ' is <b>bigger</b>: multiply by ' + m.n + '.' }, { v: s.p * m.n / 1000, code: 'u6t-unit-way', hint: '1 m = 100 cm: divide by 100 (not 1000).' }] })];
    return fieldsPart('A hobby shop sells ' + (String(m.n).charAt(0) === '8' || m.n === 18 ? 'an' : 'a') + ' 1 : ' + m.n + ' model of a ' + m.what + '. (a) The real ' + m.what + ' is ' + U(s.L, 'm') + ' long. How long is the model, to the nearest tenth of a centimetre? (b) On the model, the ' + m.p[0] + ' ' + U(s.p, 'cm') + ' ' + m.p[4] + '. How big is that on the real ' + m.what + ', in metres?', specs,
      br(['1 : ' + m.n + ' means every model length is ' + t('\\tfrac{1}{' + m.n + '}') + ' of the real length (the same unit on both sides).', '(a) ' + t(N(s.L) + '\\text{ m}=' + N(q(s.L * 100)) + '\\text{ cm}') + '; ' + t(N(q(s.L * 100)) + '\\div ' + m.n + toN(mod, 1)) + ' cm',
        '(b) ' + t(N(s.p) + '\\times ' + m.n + '=' + N(q(s.p * m.n))) + ' cm ' + t('=' + N(q(s.p * m.n)) + '\\div 100=' + N(q(real))) + ' m']),
      ['Use the same unit: change metres to centimetres (× 100) first.', 'Real → model: ÷ ' + m.n + '. Model → real: × ' + m.n + '.'], o.text || 'a 1 : n model both ways');
  }
  Object.assign(A, { KS: KS, kTypePart: kTypePart, triAnglePart: triAnglePart, kSidesPart: kSidesPart, simFigShared: simFigShared, simFigPart: simFigPart, angleNamePart: angleNamePart, modelPart: modelPart, MODELS: MODELS, sideName: sideName, dk: dk, QPTS: QPTS, TPTS: TPTS });

  /* ======================================================================================================
   * 6.2 Are they similar? Rectangles, boxes, regular polygons, frames
   * ====================================================================================================== */
  var PHOTOS = [[4, 6], [5, 7], [8, 10], [3, 5], [6, 8], [10, 15], [9, 12], [6, 9], [12, 18], [11, 14], [16, 20], [20, 30], [8, 12], [10, 14]];
  /* is a print similar to a photo? long ÷ short and yes / no */
  function rectSimPart(r, o) {
    o = o || {};
    var ph = r.pick(PHOTOS), w = ph[0], l = ph[1], u = r.pick(['in', 'cm']), sim = r.chance(0.5), p = person(r), R0 = l / w;
    var s = find(function () {
      if (sim) { var k = r.pick([1.5, 2, 2.5, 3, 4, 1.25, 0.5, 3.5]); return { W: q(w * k), L: q(l * k) }; }
      var how = r.int(0, 2);
      if (how === 0) { var d = r.pick([1, 2, 3, 4, 5, 6, 10]); return { W: w + d, L: l + d, add: d }; }
      if (how === 1) { var k1 = r.pick([1.5, 2, 2.5, 3]), k2 = k1 + r.pick([-0.5, 0.5, 1]); return { W: q(w * k1), L: q(l * k2) }; }
      var P0 = r.pick(PHOTOS); return { W: P0[0], L: P0[1] };
    }, function (s) { return s.W > 0 && s.L > s.W && places(s.W) <= 2 && places(s.L) <= 2 && !(s.W === w && s.L === l) && (sim || Math.abs(rd(s.L / s.W, 2) - rd(R0, 2)) >= 0.02); });
    var R = s.L / s.W, inM = u === 'cm' && r.chance(0.25) && places(q(s.W / 100)) <= 3, Wt = inM ? U(q(s.W / 100), 'm') : U(s.W, u), Lt = inM ? U(q(s.L / 100), 'm') : U(s.L, u);
    var specs = [fld('Print: long ÷ short =', R, { dp: 2, noPlaces: places(R) <= 2, name: 'Ratio', diag: [{ v: s.W / s.L, code: 'u6t-ratio-flip', hint: 'Divide the <b>long</b> side by the <b>short</b> side, the same way as for the photo.' }] }),
      yesNoFld('Similar?', sim, 'Compare the print’s ratio with the photo’s ratio, ' + t(fx(R0, 2)) + '. Equal: similar. Different: not similar.', 'u6t-sim-verdict')];
    return fieldsPart(p.n + ' has ' + aN(w) + ' ' + U(w, u) + ' by ' + U(l, u) + ' photo. Is ' + aN(inM ? q(s.W / 100) : s.W) + ' ' + Wt + ' by ' + Lt + ' print similar to it (exactly the same shape)? Use long ÷ short for each rectangle. ' + cap(p.his) + ' photo: ' + t(l + '\\div ' + w + toN(R0, 2)) + '. (Round the ratio to 2 decimal places if needed.)', specs,
      br([inM ? 'Long ÷ short works without changing units (both sides are in metres).' : null, 'Print: ' + t((inM ? N(q(s.L / 100)) + '\\div ' + N(q(s.W / 100)) : N(s.L) + '\\div ' + N(s.W)) + toN(R, 2)), 'Photo: ' + t(fx(R0, 2)) + '. ' + (sim ? 'The ratios are equal, so the print <b>is</b> similar.' : 'The ratios are different, so the print is <b>not</b> similar: part of the photo would be cut off (cropped) or stretched.' + (s.add ? ' (Adding ' + s.add + ' ' + u + ' to both sides does not keep the shape.)' : ''))]),
      ['Every rectangle has 90° corners, so only the sides decide.', 'Long ÷ short for each one: the same number means similar.'], o.text || 'is the print similar?');
  }
  /* which box (or can) is similar, and k */
  function boxSimPart(r, o) {
    o = o || {};
    var can = r.chance(0.35), k = r.pick([1.25, 1.5, 2, 0.5, 0.75, 1.2, 2.5, 0.8]), what = can ? 'can' : 'box';
    var s = find(function () {
      var dims = can ? [pickR(r, [2, 8, 0.5]), pickR(r, [6, 16, 1])] : [pickR(r, [8, 40, 1]), pickR(r, [4, 20, 1]), pickR(r, [10, 50, 1])];
      var simD = dims.map(function (x) { return q(x * k); }), j = r.int(0, dims.length - 1), k2 = k + r.pick([-0.2, 0.2, 0.1, -0.1, 0.25, 0.3]);
      var offD = dims.map(function (x, i) { return q(x * (i === j ? k2 : k)); });
      return { dims: dims, simD: simD, offD: offD, j: j, k2: k2 };
    }, function (s) { return s.simD.concat(s.offD).every(function (x) { return x > 0 && places(x) <= 2; }) && s.k2 > 0.2 && Math.abs(s.k2 - 1) > 0.01; });
    var bFirst = r.chance(0.5), Bd = bFirst ? s.simD : s.offD, Cd = bFirst ? s.offD : s.simD, ans = bFirst ? 'B' : 'C', other = bFirst ? 'C' : 'B';
    var fmt = function (d) { return can ? 'radius ' + U(d[0], 'cm') + ', height ' + U(d[1], 'cm') : U(d[0], 'cm') + ' by ' + U(d[1], 'cm') + ' by ' + U(d[2], 'cm'); };
    var labs = can ? ['radius', 'height'] : ['length', 'width', 'height'];
    var ratios = function (d) { return d.map(function (x, i) { return t(N(x) + '\\div ' + N(s.dims[i]) + '=' + N(q(x / s.dims[i]))); }).join(', '); };
    return whichAmtPart('Three ' + (can ? 'soup cans (cylinders)' : 'shipping boxes (rectangular prisms)') + ' are listed ' + (can ? '' : 'as length by width by height') + '.<br>' + cap(what) + ' A: ' + fmt(s.dims) + '<br>' + cap(what) + ' B: ' + fmt(Bd) + '<br>' + cap(what) + ' C: ' + fmt(Cd) + '<br>Which ' + what + ' is similar to ' + what + ' A? What is the scale factor from ' + what + ' A to it?', {
      amt: k, dp: 2, noPlaces: true, whichLabel: 'Similar ' + what + ' (B or C):', amtLabel: 'Scale factor ' + t('k') + ' =', ph: 'B or C', right: [ans.toLowerCase()], wrongs: [other.toLowerCase()], rightKey: ans, wrongKey: other, nudge: 'type B or C.',
      why: 'Divide every measurement by the matching one of ' + what + ' A. Only one ' + what + ' gives the same number every time.',
      diag: [{ v: 1 / k, code: 'u6t-k-flip', hint: 'k = new ÷ original: ' + what + ' ' + ans + '’s measurement on top.' }],
      sol: br([cap(what) + ' B ÷ ' + what + ' A: ' + ratios(Bd) + (bFirst ? ' — all the same' : ' — not all the same'), cap(what) + ' C ÷ ' + what + ' A: ' + ratios(Cd) + (bFirst ? ' — not all the same' : ' — all the same'),
        cap(what) + ' <b>' + ans + '</b> is similar to ' + what + ' A, with ' + t('k=' + N(k)) + '. (The ' + labs[s.j] + ' of ' + what + ' ' + other + ' does not match.)']),
      hints: ['Divide each measurement of B (and of C) by the matching one of A.', 'Similar: the same ratio for every pair.'], text: o.text || 'which box is similar' });
  }
  /* regular polygons: each angle and k */
  var REGS = [[3, 'equilateral triangles', 'A yield sign is an equilateral triangle', [60, 90]], [4, 'squares', 'A floor tile is a square', [10, 40]], [5, 'regular pentagons', 'A garden stepping stone is a regular pentagon', [20, 40]],
    [6, 'regular hexagons', 'A patio paving stone is a regular hexagon', [12, 30]], [8, 'regular octagons', 'A stop sign is a regular octagon', [20, 40]], [10, 'regular decagons', 'A table top is a regular decagon (10 sides)', [25, 50]], [12, 'regular dodecagons', 'A clock face is a regular dodecagon (12 sides)', [6, 16]]];
  function regPolyPart(r, o) {
    o = o || {};
    var R = r.pick(REGS), n = R[0], S = (n - 2) * 180, e = S / n, k = r.pick([1.28, 1.6, 1.5, 2, 1.25, 2.5, 0.8, 0.75, 1.2, 3]);
    var s = find(function () { var a = pickR(r, [R[3][0], R[3][1], 1]); return { a: a, b: q(a * k) }; }, function (s) { return places(s.b) <= 2; });
    var specs = [fld('Each angle:', e, { dp: 1, noPlaces: true, after: '°', name: 'Each angle', diag: [{ v: S, code: 'u6t-reg-sum', hint: 'That is the sum of all ' + n + ' angles. The angles are equal: divide by ' + n + '.' }, { v: 360 / n, code: 'u6t-reg-ext', hint: 'Find the angle sum first, ' + t('(n-2)\\times 180^\\circ') + ', then divide by ' + n + '.' }] }),
      kFld(t('k') + ' =', k, { from: { new: s.b, orig: s.a } })];
    return fieldsPart(R[2] + ' with sides of ' + U(s.a, 'cm') + '. Another one has sides of ' + U(s.b, 'cm') + '. The two are similar (two ' + R[1] + ' are always similar). Find the size of each angle, and the scale factor from the ' + U(s.a, 'cm') + ' one to the ' + U(s.b, 'cm') + ' one.', specs,
      br(['Regular polygons with the same number of sides are always similar.', 'Each angle: ' + t('(' + n + '-2)\\times 180^\\circ\\div ' + n + '=' + S + '^\\circ\\div ' + n + toN(e, 1) + '^\\circ') + ' (in both)', t('k=' + N(s.b) + '\\div ' + N(s.a) + '=' + N(k))]),
      ['Angle sum = (n − 2) × 180°; a regular polygon has n equal angles.', 'k = new side ÷ original side.'], o.text || 'regular polygons: angle and k');
  }
  /* a picture with a mat border: the outside size, and the long side a similar outside would need */
  function framePart(r, o) {
    o = o || {};
    var s = find(function () { var ph = r.pick(PHOTOS), b = r.pick([2, 3, 4, 5, 2.5, 1.5, 6]); return { w: ph[0], l: ph[1], b: b, W: ph[0] + 2 * b, L: ph[1] + 2 * b }; }, function (s) { var z = s.W * s.l / s.w; return Math.abs(z * 10 - Math.floor(z * 10) - 0.5) > 0.05 && Math.abs(rd(z, 1) - s.L) > 0.15; });
    var u = r.pick(['cm', 'in']), wi = r.int(0, 2), what = ['A picture is put on a mat with a border', 'A print is put in a frame that is', 'A poster is put on a backing board with a border'][wi], noun = ['picture', 'print', 'poster'][wi], z = s.W * s.l / s.w;
    var specs = [fld('Outside short side:', s.W, { dp: 1, noPlaces: true, after: u, name: 'Outside short', diag: [{ v: s.w + s.b, code: 'u6t-border-once', hint: 'The border is on <b>both</b> sides: add it twice.' }] }),
      fld('Outside long side:', s.L, { dp: 1, noPlaces: true, after: u, name: 'Outside long', diag: [{ v: s.l + s.b, code: 'u6t-border-once', hint: 'The border is on <b>both</b> ends: add it twice.' }] }),
      lenFld('Similar long side:', z, { dp: 1, unit: u, name: 'Similar long side', prop: { given: s.W, num: s.l, den: s.w }, alts: [{ v: s.L, code: 'u6t-add-not-mult', hint: 'That is the real outside, which is <b>not</b> similar: adding the same amount to both sides changes the shape. Multiply instead: k = ' + N(s.W) + ' ÷ ' + N(s.w) + '.' }] })];
    return fieldsPart(what + ' ' + N(s.b) + ' ' + u + ' wide on every side. The ' + noun + ' is ' + U(s.w, u) + ' by ' + U(s.l, u) + '. (a) Find the outside size. (b) The outside is not similar to the ' + noun + '. To be similar, with the same outside short side, how long would the outside long side have to be? (Nearest tenth.)', specs,
      br(['(a) ' + t(N(s.w) + '+' + N(s.b) + '+' + N(s.b) + '=' + N(s.W)) + ' by ' + t(N(s.l) + '+' + N(s.b) + '+' + N(s.b) + '=' + N(s.L)) + ' ' + u,
        'Check: ' + t(N(s.W) + '\\div ' + N(s.w) + toN(s.W / s.w, 2)) + ' but ' + t(N(s.L) + '\\div ' + N(s.l) + toN(s.L / s.l, 2)) + ': not the same, so the outside is not similar.',
        '(b) For a similar outside, multiply both sides by ' + t('k=' + N(s.W) + '\\div ' + N(s.w)) + ': long side ' + t('=' + N(s.l) + '\\times ' + N(s.W) + '\\div ' + N(s.w) + toN(z, 1)) + ' ' + u + '.']),
      ['The border is on both sides: add it twice.', 'Similar means multiply both sides by the same k (adding the same amount changes the shape).'], o.text || 'a mat border and a similar outside');
  }
  Object.assign(A, { PHOTOS: PHOTOS, rectSimPart: rectSimPart, boxSimPart: boxSimPart, regPolyPart: regPolyPart, REGS: REGS, framePart: framePart });

  /* ======================================================================================================
   * 6.3 Drawing enlargements and reductions
   * ====================================================================================================== */
  /* a copy's side and angle (the angle does not change) */
  function copyPart(r, o) {
    o = o || {};
    var nm = r.pick(TRIS.concat([['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['W', 'X', 'Y', 'Z']])), quad = nm.length === 4, k = r.pick([2, 3, 0.5, 1.5, 1.25, 2.5, 0.75, 0.4, 1.6]);
    var s = find(function () { return { a: pickR(r, [2, 15, 0.5]), th: r.int(32, 148) }; }, function (s) { return places(q(s.a * k)) <= 2 && s.th !== 90 && s.th !== 60 && q(s.th * k) !== s.th; });
    var side = nm[0] + nm[1], side2 = nm[0] + "'" + nm[1] + "'", vtx = nm[1], u = r.pick(['cm', 'cm', 'm', 'in']), shape = quad ? 'Quadrilateral ' + nm.join('') : 'Triangle ' + nm.join('');
    var specs = [lenFld(t(side2) + ' =', q(s.a * k), { dp: 2, unit: u, name: 'Side', scale: { len: s.a, k: k, op: 'mul' } }),
      fld(t('\\angle ' + vtx + "'") + ' =', s.th, { after: '°', name: 'Angle', diag: [{ v: s.th * k, code: 'u6t-angle-k', hint: 'Angles <b>do not change</b> in a similar figure. Only the lengths are multiplied by k.' }, { v: s.th / k, code: 'u6t-angle-k', hint: 'Angles stay the same in an enlargement or a reduction.' }, { v: s.th + k, code: 'u6t-angle-k', hint: 'Angles stay the same.' }] })];
    return fieldsPart(shape + ' has ' + t(side + '=' + N(s.a) + uT(u)) + ' and ' + t('\\angle ' + vtx + '=' + dg(s.th)) + '. A similar copy ' + nm.map(function (x) { return x + '′'; }).join('') + ' is drawn with a scale factor of ' + t('k=' + N(k)) + '. Find ' + t(side2) + ' and ' + t('\\angle ' + vtx + "'") + '.', specs,
      br(['Every length is multiplied by k: ' + t(side2 + '=' + N(k) + '\\times ' + N(s.a) + '=' + N(q(s.a * k))) + ' ' + u, 'Every angle stays the same: ' + t('\\angle ' + vtx + "'=" + dg(s.th))]),
      ['Multiply every length by k.', 'Angles do not change.'], o.text || 'a copy: side and angle');
  }
  /* the projection method: OA′ = k × OA, and the distance from A to A′ */
  function projPart(r, o) {
    o = o || {};
    var k = r.pick([2, 3, 2.5, 1.5, 0.5, 4, 0.25]), s = find(function () { return { a: pickR(r, [1.5, 5, 0.1]) }; }, function (s) { return places(q(s.a * k)) <= 2 && s.a !== 2.5; });
    var a = s.a, b = q(a * k), d = q(Math.abs(b - a)), L = r.pick([['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F'], ['J', 'K', 'L']])[0];
    var specs = [lenFld('O' + L + "′ =", b, { dp: 2, unit: 'cm', name: 'O' + L + '′', scale: { len: a, k: k, op: 'mul' }, alts: [{ v: a + a * k, code: 'u6t-proj-past', hint: 'Measure from <b>O</b>, not from ' + L + ': ' + t('O' + L + "'=k\\times O" + L) + '.' }] }),
      fld(L + ' to ' + L + '′:', d, { dp: 2, noPlaces: true, after: 'cm', name: L + ' to ' + L + '′', diag: [{ v: b, code: 'u6t-proj-o', hint: 'That is the distance from <b>O</b>. How far is ' + L + '′ from ' + L + '? Subtract.' }, { v: a * k + a, code: 'u6t-proj-past', hint: L + '′ is ' + t(N(b)) + ' cm from O, and ' + L + ' is ' + t(N(a)) + ' cm from O.' }] })];
    return fieldsPart('Draw ' + (k > 1 ? 'an enlargement' : 'a reduction') + ' by the projection method, with centre O and ' + t('k=' + N(k)) + '. Corner ' + L + ' is ' + U(a, 'cm') + ' from O. How far from O is the new corner ' + L + '′ (on the same ray)? How far apart are ' + L + ' and ' + L + '′?', specs,
      br([t('O' + L + "'=k\\times O" + L + '=' + N(k) + '\\times ' + N(a) + '=' + N(b)) + ' cm, measured from O', k > 1 ? L + '′ is past ' + L + ': ' + t(N(b) + '-' + N(a) + '=' + N(d)) + ' cm from ' + L + '.' : L + '′ is between O and ' + L + ': ' + t(N(a) + '-' + N(b) + '=' + N(d)) + ' cm from ' + L + '.']),
      ['Each new corner is on its ray, k times as far from O.', k > 1 ? 'k > 1: the new corner is past the old one.' : 'k < 1: the new corner is between O and the old one.'], o.text || 'projection method');
  }
  /* the grid method: the move between two corners of the copy */
  var GRID_T = [
    function (r) { var w = r.pick([4, 6]), h = r.pick([2, 3]), p = r.pick([1, 2, 3]); return { pts: [[0, 0], [w, 0], [w, h], [w / 2, h + p], [0, h]], nm: 'ABCDE', what: 'house shape' }; },
    function (r) { var b = r.pick([5, 6, 4]), tp = r.pick([2, 3]), h = r.pick([2, 3]), off = r.pick([1, 2]); return { pts: [[0, 0], [b, 0], [off + tp, h], [off, h]], nm: 'ABCD', what: 'trapezoid' }; },
    function (r) { var b = r.pick([4, 3, 5]), sl = r.pick([1, 2]), h = r.pick([2, 3]); return { pts: [[0, 0], [b, 0], [b + sl, h], [sl, h]], nm: 'PQRS', what: 'parallelogram' }; },
    function (r) { var w = r.pick([6, 4]), d = r.pick([2, 3]), h = r.pick([2, 1]); return { pts: [[0, h + d], [w, h + d], [w, d], [w / 2, 0], [0, d]], nm: 'ABCDE', what: 'shield' }; },
    function (r) { var a = r.pick([3, 4]), c = r.pick([2, 3]); return { pts: [[0, 1], [a, 1], [a, 0], [a + c, 2], [a, 4], [a, 3], [0, 3]], nm: 'ABCDEFG', what: 'arrow' }; }
  ];
  function gridShared(r) {
    return find(function () {
      var T = r.pick(GRID_T)(r), k = r.pick([2, 1.5, 0.5, 3, 2]), pts = T.pts;
      if (k === 0.5) pts = pts.map(function (p) { return [p[0] * 2, p[1] * 2]; });
      var n = pts.length, sl = []; for (var i = 0; i < n; i++) { var P = pts[i], Q = pts[(i + 1) % n]; if (P[0] !== Q[0] && P[1] !== Q[1]) sl.push(i); }
      if (!sl.length) return null;
      var i0 = r.pick(sl), P0 = pts[i0], Q0 = pts[(i0 + 1) % n];
      return { T: T, k: k, pts: pts, i: i0, dx: Q0[0] - P0[0], dy: Q0[1] - P0[1], nm: T.nm.split('') };
    }, function (s) { var b = s.pts.reduce(function (m, p) { return [Math.max(m[0], p[0]), Math.max(m[1], p[1])]; }, [0, 0]); return b[0] <= 12 && b[1] <= 9 && places(q(Math.abs(s.dx) * s.k)) <= 1 && places(q(Math.abs(s.dy) * s.k)) <= 1; });
  }
  function gridPart(r, o) {
    o = o || {};
    var s = gridShared(r), n = s.pts.length, a = s.nm[s.i], b = s.nm[(s.i + 1) % n], ax = Math.abs(s.dx), ay = Math.abs(s.dy), nx = q(ax * s.k), ny = q(ay * s.k);
    var bx = s.pts.reduce(function (m, p) { return [Math.max(m[0], p[0]), Math.max(m[1], p[1])]; }, [0, 0]);
    var svg = G.gridSVG({ pts: s.pts, at: [1, 1], image: false, cols: bx[0] + 2, rows: bx[1] + 2, cell: 22, names: [s.nm.join('')], width: Math.min(420, (bx[0] + 2) * 26) });
    var lr = s.dx > 0 ? 'right' : 'left', ud = s.dy > 0 ? 'up' : 'down';
    var dX = [{ v: ax + s.k, code: 'u6t-grid-add', hint: 'Multiply the count by k (do not add k).' }, { v: ax, code: 'u6t-grid-nok', hint: 'That is the move on the original. Multiply it by ' + N(s.k) + '.' }];
    var dY = [{ v: ay + s.k, code: 'u6t-grid-add', hint: 'Multiply the count by k (do not add k).' }, { v: ay, code: 'u6t-grid-nok', hint: 'That is the move on the original. Multiply it by ' + N(s.k) + '.' }];
    if (ax !== ay) { dX.push({ v: ny, code: 'u6t-grid-swap', hint: 'Count the squares <b>across</b> (right or left) in this box, and up or down in the other.' }); dY.push({ v: nx, code: 'u6t-grid-swap', hint: 'Count the squares <b>up or down</b> in this box.' }); }
    var specs = [fld('Squares across (' + lr + '):', nx, { dp: 1, noPlaces: true, name: 'Across', diag: dX }), fld('Squares ' + ud + ':', ny, { dp: 1, noPlaces: true, name: ud === 'up' ? 'Up' : 'Down', diag: dY })];
    return fieldsPart('Ava uses the grid method to draw ' + (s.k > 1 ? 'an enlargement' : 'a reduction') + ' of this ' + s.T.what + ' with ' + t('k=' + N(s.k)) + '. Each small square is 1 unit. On her copy, how many squares does she move to go from ' + a + '′ to ' + b + '′?' + svg, specs,
      br(['On the original, ' + a + ' → ' + b + ' is ' + ax + ' ' + lr + ' and ' + ay + ' ' + ud + ' (count the squares across and up or down, not along the slanted side).', 'Multiply both counts by ' + N(s.k) + ': ' + t(ax + '\\times ' + N(s.k) + '=' + N(nx)) + ' ' + lr + ' and ' + t(ay + '\\times ' + N(s.k) + '=' + N(ny)) + ' ' + ud + '.']),
      ['Count the move on the original: squares across, then squares up or down.', 'Multiply both counts by k.'], o.text || 'grid method: a move');
  }
  /* the largest similar enlargement that fits a sheet: k, the poster size, the paper left over */
  function fitShared(r) {
    return find(function () {
      var ph = r.pick([[10, 15], [4, 6], [5, 7], [8, 10], [6, 9], [12, 18], [8, 12], [3, 5], [6, 8], [10, 14]]), k = r.pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 1.5, 6]), k2 = k + r.pick([0.5, 1, 1.5, 0.25]), longLim = r.chance(0.5);
      var w = ph[0], l = ph[1], SW = longLim ? q(w * k2) : q(w * k), SL = longLim ? q(l * k) : q(l * k2);
      return { w: w, l: l, k: k, k2: k2, longLim: longLim, SW: SW, SL: SL, pw: q(w * k), pl: q(l * k), left: longLim ? q(SW - w * k) : q(SL - l * k) };
    }, function (s) { return [s.SW, s.SL, s.pw, s.pl, s.left].every(function (x) { return places(x) <= 2; }) && s.SL > s.SW && !(s.w === 15 && s.SL === 60); });
  }
  function fitPart(r, o) {
    o = o || {};
    var s = fitShared(r), u = 'cm', kL = s.SL / s.l, kW = s.SW / s.w;
    var specs = [fld(t('k') + ' =', s.k, { dp: 2, noPlaces: true, name: 'k', diag: [{ v: s.k2, code: 'u6t-fit-big', hint: 'With the bigger k, the ' + (s.longLim ? 'long' : 'short') + ' side would not fit. Use the <b>smaller</b> k.' }, { v: s.SL / s.w, code: 'u6t-ratio-mix', hint: 'Match long with long and short with short.' }, { v: s.SW / s.l, code: 'u6t-ratio-mix', hint: 'Match long with long and short with short.' }] }),
      fld('Poster short side:', s.pw, { dp: 2, noPlaces: true, after: u, name: 'Short side', diag: [{ v: s.w * s.k2, code: 'u6t-fit-big', hint: 'Use the smaller k, so the whole poster fits.' }] }),
      fld('Poster long side:', s.pl, { dp: 2, noPlaces: true, after: u, name: 'Long side', diag: [{ v: s.l * s.k2, code: 'u6t-fit-big', hint: 'Use the smaller k, so the whole poster fits.' }] }),
      fld('Paper left over:', s.left, { dp: 2, noPlaces: true, after: u, name: 'Left over', diag: [{ v: 0, code: 'u6t-left-other', hint: 'In one direction the poster fills the sheet; the strip left over is in the <b>other</b> direction.' }] })];
    return fieldsPart('The art club has ' + aN(s.w) + ' ' + U(s.w, u) + ' by ' + U(s.l, u) + ' photo. They want the biggest similar enlargement that fits on ' + aN(s.SW) + ' ' + U(s.SW, u) + ' by ' + U(s.SL, u) + ' sheet of poster paper. Find ' + t('k') + ', the size of the poster, and the width of the strip of paper left over.', specs,
      br(['Long sides: ' + t(N(s.SL) + '\\div ' + N(s.l) + '=' + N(q(kL))) + '. Short sides: ' + t(N(s.SW) + '\\div ' + N(s.w) + '=' + N(q(kW))) + '. Use the <b>smaller</b>: ' + t('k=' + N(s.k)) + '.',
        'Poster: ' + t(N(s.w) + '\\times ' + N(s.k) + '=' + N(s.pw)) + ' by ' + t(N(s.l) + '\\times ' + N(s.k) + '=' + N(s.pl)) + ' cm. (With ' + N(s.k2) + ' the ' + (s.longLim ? 'long' : 'short') + ' side would be too big.)',
        'Left over: ' + (s.longLim ? t(N(s.SW) + '-' + N(s.pw) + '=' + N(s.left)) : t(N(s.SL) + '-' + N(s.pl) + '=' + N(s.left))) + ' cm across the ' + (s.longLim ? 'short' : 'long') + ' direction.']),
      ['Find k for each direction: space ÷ photo length (long with long, short with short).', 'Use the smaller k, so the whole picture fits.'], o.text || 'the largest copy that fits');
  }
  Object.assign(A, { copyPart: copyPart, projPart: projPart, GRID_T: GRID_T, gridShared: gridShared, gridPart: gridPart, fitShared: fitShared, fitPart: fitPart });

  /* ======================================================================================================
   * 6.4 Scale diagrams: maps and floor plans
   * ====================================================================================================== */
  /* a scale in words as a ratio 1 : n (or n : 1 for an enlargement) */
  function scaleRatioPart(r, o) {
    o = o || {};
    var kind = r.pick(['m', 'm', 'km', 'km', 'ft', 'mm']), x, n, words, diag, sol, enl = kind === 'mm';
    if (kind === 'm') { x = r.pick([2, 2.5, 4, 5, 0.5, 1.5, 3, 8, 10, 20, 25, 50, 200, 400, 750, 1.2]); n = q(x * 100); words = '1 cm represents ' + N(x) + ' m';
      diag = [{ v: x * 1000, code: 'u6t-unit-way', hint: '1 m = <b>100</b> cm.' }, { v: x * 10, code: 'u6t-unit-way', hint: '1 m = <b>100</b> cm.' }, { v: x, code: 'u6t-no-unit', hint: 'A ratio scale uses the <b>same unit</b> on both sides: change ' + N(x) + ' m to centimetres.' }];
      sol = t(N(x) + '\\text{ m}=' + N(x) + '\\times 100=' + HW.fmt(nS(n)) + '\\text{ cm}') + ', so the scale is ' + t('1:' + HW.fmt(nS(n))) + '.'; }
    else if (kind === 'km') { x = r.pick([1, 2, 3, 5, 10, 15, 20, 25, 50, 0.5, 2.5, 0.25]); n = q(x * 100000); words = '1 cm represents ' + N(x) + ' km';
      diag = [{ v: x * 1000, code: 'u6t-unit-way', hint: 'That is the number of metres. 1 km = 1000 m = <b>100 000</b> cm.' }, { v: x * 10000, code: 'u6t-unit-way', hint: '1 km = 100 000 cm (5 zeros).' }, { v: x * 1000000, code: 'u6t-unit-way', hint: '1 km = 100 000 cm (5 zeros).' }, { v: x, code: 'u6t-no-unit', hint: 'Use the same unit on both sides: change km to cm.' }];
      sol = t(N(x) + '\\text{ km}=' + N(x) + '\\times 100\\,000=' + HW.fmt(nS(n)) + '\\text{ cm}') + ', so the scale is ' + t('1:' + HW.fmt(nS(n))) + '.'; }
    else if (kind === 'ft') { x = r.pick([2, 4, 8, 6, 10, 3, 5]); n = 12 * x; words = '1 in represents ' + x + ' ft';
      diag = [{ v: 10 * x, code: 'u6t-unit-way', hint: '1 ft = <b>12</b> in.' }, { v: x, code: 'u6t-no-unit', hint: 'Use the same unit on both sides: change feet to inches.' }];
      sol = t(x + '\\text{ ft}=' + x + '\\times 12=' + n + '\\text{ in}') + ', so the scale is ' + t('1:' + n) + '.'; }
    else { x = r.pick([2, 5, 3, 4, 1.5]); n = q(10 * x); words = N(x) + ' cm represents 1 mm';
      diag = [{ v: x, code: 'u6t-no-unit', hint: 'Use the same unit: change ' + N(x) + ' cm to millimetres (× 10).' }, { v: 100 * x, code: 'u6t-unit-way', hint: '1 cm = <b>10</b> mm.' }];
      sol = t(N(x) + '\\text{ cm}=' + N(n) + '\\text{ mm}') + ', so the scale is ' + t(N(n) + ':1') + ' (an enlargement: the drawing is bigger).'; }
    var p = num('Write the scale “' + words + '” as a ratio' + (enl ? ' (drawing : real).' : ' 1 : n.'), n, { before: enl ? undefined : t('1:'), after: enl ? t(':1') : undefined, unit: '', diag: diag,
      sol: br(['A ratio scale is diagram : real, with the <b>same unit</b> on both sides.', sol]), hints: ['Change the real length to the diagram’s unit.', '1 m = 100 cm; 1 km = 100 000 cm; 1 ft = 12 in; 1 cm = 10 mm.'], text: o.text || 'scale in words to a ratio' });
    var inner = p.check; p.check = function (resp) { var sR = String(resp == null ? '' : resp); sR = enl ? sR.replace(/\s*:\s*1\s*$/, '') : sR.replace(/^\s*1\s*:\s*/, ''); return inner(sR); };
    p.answer = enl ? t(HW.fmt(nS(n)) + ':1') : t('1:' + HW.fmt(nS(n)));
    return p;
  }
  /* a real length from a plan ("1 cm represents x m") */
  function planRealPart(r, o) {
    o = o || {};
    var ft = r.chance(0.25), s = find(function () { return ft ? { x: r.pick([4, 2, 8, 5]), y: pickR(r, [1.5, 6, 0.25]) } : { x: r.pick([1.5, 2, 0.5, 2.5, 0.4, 1.2, 0.25, 5, 3]), y: pickR(r, [1.2, 9, 0.1]) }; }, function (s) { return places(q(s.x * s.y)) <= 2 && s.y !== s.x; });
    var u = ft ? 'ft' : 'm', du = ft ? 'in' : 'cm', ans = q(s.x * s.y), room = r.pick(['kitchen', 'living room', 'garage', 'bedroom', 'deck', 'classroom']);
    return lenPart('A floor plan is drawn to the scale 1 ' + du + ' represents ' + N(s.x) + ' ' + u + '. On the plan, the ' + room + ' is ' + U(s.y, du) + ' long. How long is the real ' + room + '?', ans, { dp: 2, unit: u,
      alts: [{ v: s.y / s.x, code: 'u6t-scale-way', hint: 'Each ' + du + ' on the plan is ' + N(s.x) + ' ' + u + ' in real life, so <b>multiply</b>: the real ' + room + ' is bigger.' }, { v: s.x + s.y, code: 'value', hint: 'Multiply: ' + N(s.y) + ' ' + du + ' × ' + N(s.x) + ' ' + u + ' per ' + du + '.' }],
      sol: 'Real length = plan length × (real length for 1 ' + du + '): ' + t(N(s.y) + '\\times ' + N(s.x) + '=' + N(ans)) + ' ' + u + '.', hints: ['1 ' + du + ' on the plan is ' + N(s.x) + ' ' + u + ' in real life.', 'Multiply.'], text: o.text || 'plan to real' });
  }
  /* a map at 1 : n — map → real (km) and real → map (cm) */
  var MAPN = [25000, 50000, 75000, 100000, 200000, 250000, 500000, 1500000, 2000000, 30000];
  var PLACES = [['Calgary', 'Banff'], ['Lethbridge', 'Medicine Hat'], ['Red Deer', 'Edmonton'], ['Airdrie', 'Cochrane'], ['Olds', 'Didsbury'], ['Drumheller', 'Three Hills'], ['Canmore', 'Exshaw']];
  function mapBothPart(r, o) {
    o = o || {};
    var n = r.pick(MAPN), per = n / 100000, s = find(function () { return { L: pickR(r, [1.5, 12, 0.1]), Dd: per >= 5 ? pickR(r, [20, 180, 1]) : pickR(r, [0.4, 6, 0.05]) }; },
      function (s) { var b = s.Dd / per; return b >= 1.2 && b <= 16 && places(q(s.L * per)) <= 3 && Math.abs(b * 10 - Math.floor(b * 10) - 0.5) > 0.05; });
    var a = q(s.L * per), b = s.Dd / per, pl = r.pick(PLACES), dpA = places(a) <= 2 ? 2 : 3;
    var specs = [lenFld('Real distance:', a, { dp: dpA, unit: 'km', name: 'Real distance', alts: [{ v: s.L * n / 1000, code: 'u6t-unit-way', hint: 'That is in metres. 1 km = 100 000 cm: divide the centimetres by 100 000.' }, { v: s.L * n / 10000, code: 'u6t-unit-way', hint: '1 km = 100 000 cm (5 zeros).' }, { v: s.L * n, code: 'u6t-unit-cm', hint: 'That is in centimetres. Change it to kilometres: ÷ 100 000.' }, { v: s.L / per, code: 'u6t-scale-way', hint: 'Real distances are bigger than map distances: multiply.' }] }),
      lenFld('Map distance:', b, { dp: 1, unit: 'cm', name: 'Map distance', alts: [{ v: s.Dd * per, code: 'u6t-scale-way', hint: 'The map distance is <b>smaller</b> than the real one: divide by ' + N(per) + ' km per cm.' }, { v: s.Dd * 1000 / n, code: 'u6t-unit-way', hint: 'Change km to cm with × 100 000 (not × 1000).' }, { v: s.Dd * 10000 / n, code: 'u6t-unit-way', hint: '1 km = 100 000 cm.' }] })];
    return fieldsPart('A road map has a scale of ' + t('1:' + HW.fmt(String(n))) + '. (a) On the map, ' + pl[0] + ' and ' + pl[1] + ' are ' + U(s.L, 'cm') + ' apart. How far apart are they really (in a straight line), in kilometres? (b) Two other places are ' + U(s.Dd, 'km') + ' apart. How far apart are they on the map, to the nearest tenth of a centimetre?', specs,
      br(['1 cm represents ' + HW.fmt(String(n)) + ' cm ' + t('=' + HW.fmt(String(n)) + '\\div 100\\,000=' + N(per)) + ' km.', '(a) ' + t(N(s.L) + '\\times ' + N(per) + '=' + N(a)) + ' km', '(b) ' + t(N(s.Dd) + '\\div ' + N(per) + toN(b, 1)) + ' cm']),
      ['First find how many km 1 cm stands for: ÷ 100 000.', 'Map → real: multiply. Real → map: divide.'], o.text || 'map both ways');
  }
  /* a floor plan's real area and its cost */
  function planAreaPart(r, o) {
    o = o || {};
    var s = find(function () { var n = r.pick([50, 40, 75, 80, 100, 25, 60, 20]), l = pickR(r, [3, 14, 0.1]), w = pickR(r, [2.5, 10, 0.1]), pr = q(r.int(1850, 6499) / 100); return { n: n, l: l, w: w, pr: pr, L: q(l * n / 100), W: q(w * n / 100) }; },
      function (s) { return s.l > s.w && s.L >= 2.5 && s.L <= 12 && s.W >= 2 && s.W <= 10 && places(s.L) <= 2 && places(s.W) <= 2; });
    var Ar = s.L * s.W, room = r.pick(['workshop', 'garage', 'rec room', 'classroom', 'basement', 'studio']), what = r.pick([['new flooring', 'flooring'], ['an epoxy floor coating', 'coating'], ['carpet', 'carpet']]);
    var wrongA = s.l * s.w * s.n / 10000;
    var specs = [fld('Real floor area:', Ar, { dp: 2, after: 'm²', name: 'Area', diag: [{ v: wrongA, code: 'u6t-area-scale', hint: 'Areas don’t grow by the scale number. Change each <b>length</b> to a real length first, then multiply.' }, { v: s.l * s.n * s.w * s.n, code: 'u6t-area-cm', hint: 'That is in square centimetres. Change each length to metres before you multiply.' }, { v: s.l * s.w * s.n, code: 'u6t-area-scale', hint: 'Change each length to a real length first, then multiply.' }] }),
      fld('Cost:', Ar * s.pr, { money: true, name: 'Cost', alts: [rd(Ar, 2) * s.pr], diag: [{ v: wrongA * s.pr, code: 'u6t-area-scale', hint: 'Find the real lengths first, then the area, then the cost.' }] })];
    return fieldsPart('A plan of a ' + room + ' is drawn at a scale of ' + t('1:' + s.n) + '. On the plan, the floor is ' + U(s.l, 'cm') + ' by ' + U(s.w, 'cm') + '. ' + cap(what[0]) + ' costs ' + MM(s.pr) + ' per square metre. Find the real floor area and the cost of the ' + what[1] + ' (before tax).', specs,
      br(['Real lengths: ' + t(N(s.l) + '\\times ' + s.n + '=' + N(q(s.l * s.n)) + '\\text{ cm}=' + N(s.L) + '\\text{ m}') + ' and ' + t(N(s.w) + '\\times ' + s.n + '=' + N(q(s.w * s.n)) + '\\text{ cm}=' + N(s.W) + '\\text{ m}'),
        'Area: ' + t(N(s.L) + '\\times ' + N(s.W) + toN(Ar, 2) + '\\text{ m}^2'), 'Cost: ' + t(fx(Ar, 2) + '\\times\\$' + c2(s.pr) + toM(rd(Ar, 2) * s.pr)),
        '(The plan area is ' + t(N(q(s.l * s.w))) + ' cm², but areas grow by ' + t(s.n + '\\times ' + s.n) + ', not by ' + s.n + ': always change the lengths first.)']),
      ['Change each plan length to a real length (× ' + s.n + ', then cm → m).', 'Area = length × width; cost = area × price.'], o.text || 'plan: real area and cost');
  }
  Object.assign(A, { scaleRatioPart: scaleRatioPart, planRealPart: planRealPart, MAPN: MAPN, mapBothPart: mapBothPart, planAreaPart: planAreaPart });

  /* ======================================================================================================
   * 6.5 Similar triangles
   * ====================================================================================================== */
  /* the AA test: both third angles, and similar yes / no */
  function aaPart(r, o) {
    o = o || {};
    var nm = twoNames(r, TRIS), T1 = nm[0], T2 = nm[1], sim = r.chance(0.5);
    var s = find(function () {
      var a = r.int(25, 85), b = r.int(28, 110), c = 180 - a - b, A1 = [a, b, c];
      var g = r.shuffle([0, 1, 2]).slice(0, 2), v2;
      if (sim) v2 = [A1[g[0]], A1[g[1]]]; else { var dlt = r.pick([-12, -9, -7, -5, -4, -3, 3, 4, 5, 7, 9, 12]); v2 = [A1[g[0]], A1[g[1]] + dlt]; }
      var pos = r.shuffle([0, 1, 2]), miss = pos[2], ang2 = [0, 0, 0]; ang2[pos[0]] = v2[0]; ang2[pos[1]] = v2[1]; ang2[miss] = 180 - v2[0] - v2[1];
      return { a: a, b: b, c: c, A1: A1, ang2: ang2, miss: miss, pos: pos };
    }, function (s) { var u2 = s.ang2.slice().sort(), u1 = s.A1.slice().sort(); return s.c >= 20 && s.ang2[s.miss] >= 15 && s.A1.concat(s.ang2).indexOf(90) < 0 && s.a !== s.b && s.b !== s.c && s.a !== s.c && (sim ? u1.join() === u2.join() : u1.join() !== u2.join()) && s.ang2[s.pos[0]] !== s.ang2[s.pos[1]]; });
    var m2 = T2[s.miss], g2 = [s.pos[0], s.pos[1]].sort();
    var specs = [fld(t('\\angle ' + T1[2]) + ' =', s.c, { after: '°', name: '∠' + T1[2], diag: [{ v: 360 - s.a - s.b, code: 'u6t-angle-sum', hint: 'The angles of a triangle add to <b>180°</b>.' }] }),
      fld(t('\\angle ' + m2) + ' =', s.ang2[s.miss], { after: '°', name: '∠' + m2, diag: [{ v: 360 - s.ang2[g2[0]] - s.ang2[g2[1]], code: 'u6t-angle-sum', hint: 'The angles of a triangle add to <b>180°</b>.' }] }),
      yesNoFld('Similar?', sim, 'Compare all three angles of each triangle. Similar only if the angles match (AA).', 'u6t-aa-verdict')];
    var list = function (Ts, v) { return Ts.map(function (x, i) { return dg(v[i]); }); };
    return fieldsPart('In ' + t('\\triangle ' + T1.join('')) + ', ' + t('\\angle ' + T1[0] + '=' + dg(s.a)) + ' and ' + t('\\angle ' + T1[1] + '=' + dg(s.b)) + '. In ' + t('\\triangle ' + T2.join('')) + ', ' + g2.map(function (i) { return t('\\angle ' + T2[i] + '=' + dg(s.ang2[i])); }).join(' and ') + '. Find the missing angle of each triangle. Are the triangles similar?', specs,
      br([t('\\angle ' + T1[2] + '=180^\\circ-' + dg(s.a) + '-' + dg(s.b) + '=' + dg(s.c)), t('\\angle ' + m2 + '=180^\\circ-' + dg(s.ang2[g2[0]]) + '-' + dg(s.ang2[g2[1]]) + '=' + dg(s.ang2[s.miss])),
        '△' + T1.join('') + ': ' + t(list(T1, s.A1).join(',\\ ')) + '; △' + T2.join('') + ': ' + t(list(T2, s.ang2).join(',\\ ')) + '.', sim ? 'The angles match, so the triangles <b>are</b> similar (AA).' : 'The angles do not all match, so the triangles are <b>not</b> similar.']),
      ['Third angle = 180° − the other two.', 'AA: if two angles match, the third matches too, and the triangles are similar.'], o.text || 'AA test');
  }
  /* similar triangles: a missing side to the nearest tenth (a proportion) */
  function permName(r, T2) { var p = find(function () { return r.shuffle([0, 1, 2]); }, function (p) { return !(p[0] === 0 && p[1] === 1); }); return p.map(function (i) { return T2[i]; }); }
  function triSidePart(r, o) {
    o = o || {};
    var nm = twoNames(r, TRIS), T1 = nm[0], T2 = permName(r, nm[1]), u = r.pick(['cm', 'm', 'in', 'ft']), toOrig = r.chance(0.4);
    var s = find(function () {
      var L = [pickR(r, [3, 12, 0.1]), pickR(r, [3, 12, 0.1]), pickR(r, [3, 12, 0.1])], ix = r.shuffle([0, 1, 2]), m = pickR(r, [3, 18, 0.1]);
      return { L: L, i0: ix[0], i1: ix[1], m: m };
    }, function (s) {
      var L = s.L, kk = s.m / L[s.i0], tri = L[0] + L[1] > L[2] + 0.8 && L[1] + L[2] > L[0] + 0.8 && L[0] + L[2] > L[1] + 0.8;
      var x = toOrig ? rd(L[s.i1] * kk, 1) * L[s.i0] / s.m : L[s.i1] * kk;
      return tri && kk > 0.35 && kk < 2.8 && Math.abs(kk - 1) > 0.15 && Math.abs(x * 10 - Math.floor(x * 10) - 0.5) > 0.06 && places(x) > 1 && rd(L[s.i1] * kk, 1) > 0.5;
    });
    var k = s.m / s.L[s.i0], NL = s.L.map(function (x) { return x * k; }), lab0 = ['', '', ''], lab1 = ['', '', ''];
    lab0[s.i0] = N(s.L[s.i0]) + ' ' + u; lab1[s.i0] = N(s.m) + ' ' + u;
    var x, prop, sol;
    if (!toOrig) { x = NL[s.i1]; lab0[s.i1] = N(s.L[s.i1]) + ' ' + u; lab1[s.i1] = 'x'; prop = { given: s.L[s.i1], num: s.m, den: s.L[s.i0] }; }
    else { var nv = rd(NL[s.i1], 1); x = nv * s.L[s.i0] / s.m; lab1[s.i1] = N(nv) + ' ' + u; lab0[s.i1] = 'x'; prop = { given: nv, num: s.L[s.i0], den: s.m }; }
    var a0 = sideName(T1, s.i0), b0 = sideName(T2, s.i0), a1 = sideName(T1, s.i1), b1 = sideName(T2, s.i1);
    var svg = G.similarSVG({ pts: r.pick(TPTS), k: k, drawK: dk(k), names: [T1.join(''), T2.join('')], labels: [lab0, lab1], rot: r.pick([90, 180, -90, 150, 120]), flip: r.chance(0.4), width: 440 });
    sol = br(['Match in order: ' + T1.map(function (c, i) { return c + ' ↔ ' + T2[i]; }).join(', ') + '. So ' + a0 + ' ↔ ' + b0 + ' and ' + a1 + ' ↔ ' + b1 + '.',
      toOrig ? t('\\dfrac{x}{' + N(prop.given) + '}=\\dfrac{' + N(s.L[s.i0]) + '}{' + N(s.m) + '}') + ' (△' + T1.join('') + ' on top on both sides)' : t('\\dfrac{x}{' + N(prop.given) + '}=\\dfrac{' + N(s.m) + '}{' + N(s.L[s.i0]) + '}') + ' (△' + T2.join('') + ' on top on both sides)',
      t('x=' + N(prop.given) + '\\times ' + N(prop.num) + '\\div ' + N(prop.den) + toN(x, 1)) + ' ' + u]);
    return lenPart(t('\\triangle ' + T1.join('') + '\\sim\\triangle ' + T2.join('')) + '. The second triangle is turned' + (r.chance(0.5) ? ' (and not drawn to scale)' : '') + '. Find ' + t('x') + ' to the nearest tenth.' + svg, x, { dp: 1, unit: u, prop: prop, sol: sol,
      hints: ['Match the vertices in the naming order to find the matching sides.', 'Write a proportion with the same triangle on top on both sides.'], text: o.text || 'similar triangles: a missing side' });
  }
  /* nested triangles (DE ∥ BC): BC and EC */
  function nestedShared(r) {
    var nm = r.pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T'], ['K', 'L', 'M', 'N', 'P'], ['V', 'W', 'X', 'Y', 'Z']]);
    var s = find(function () { return { AD: pickR(r, [3, 10, 0.5]), DB: pickR(r, [2, 8, 0.5]), DE: pickR(r, [3, 10, 0.5]), AE: pickR(r, [3, 10, 0.5]) }; },
      function (s) { var BC = s.DE * (s.AD + s.DB) / s.AD, EC = s.AE * s.DB / s.AD; return s.AD !== s.DB && s.DE !== s.AE && Math.abs(BC * 10 - Math.floor(BC * 10) - 0.5) > 0.06 && Math.abs(EC * 10 - Math.floor(EC * 10) - 0.5) > 0.06 && !(s.AD === 5 && s.DB === 3); });
    s.AB = q(s.AD + s.DB); s.k = s.AB / s.AD; s.BC = s.DE * s.k; s.AC = s.AE * s.k; s.EC = s.AC - s.AE; s.nm = nm; s.u = r.pick(['cm', 'm']);
    return s;
  }
  function nestedPart(r, o) {
    o = o || {};
    var s = nestedShared(r), n = s.nm, u = s.u, sd = function (a, b) { return n[a] + n[b]; };
    var svg = nestedSVG(n, s.AD / s.AB, { AD: N(s.AD) + ' ' + u, DB: N(s.DB) + ' ' + u, DE: N(s.DE) + ' ' + u, AE: N(s.AE) + ' ' + u, EC: '?', BC: '?' });
    var specs = [lenFld(t(sd(1, 2)) + ' =', s.BC, { dp: 1, unit: u, name: sd(1, 2), prop: { given: s.DE, num: s.AB, den: s.AD }, alts: [{ v: s.DE * s.DB / s.AD, code: 'u6t-piece', hint: 'Use the <b>whole</b> side ' + sd(0, 1) + ' = ' + N(s.AD) + ' + ' + N(s.DB) + ' = ' + N(s.AB) + ', not the piece ' + sd(3, 1) + '.' }] }),
      lenFld(t(sd(4, 2)) + ' =', s.EC, { dp: 1, unit: u, name: sd(4, 2), alts: [{ v: s.AC, code: 'u6t-whole', hint: 'That is the whole side ' + sd(0, 2) + '. Subtract ' + sd(0, 4) + ' to get the piece ' + sd(4, 2) + '.' }, { v: s.AE * s.AD / s.AB, code: 'u6t-prop-flip', hint: 'The big triangle’s side is longer: ' + sd(0, 2) + ' = ' + sd(0, 4) + ' × ' + N(s.AB) + ' ÷ ' + N(s.AD) + '.' }] })];
    return fieldsPart('In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(sd(3, 4) + '\\parallel ' + sd(1, 2)) + '. ' + t(sd(0, 3) + '=' + N(s.AD)) + ', ' + t(sd(3, 1) + '=' + N(s.DB)) + ', ' + t(sd(3, 4) + '=' + N(s.DE)) + ' and ' + t(sd(0, 4) + '=' + N(s.AE)) + ' (in ' + u + '). Find ' + t(sd(1, 2)) + ' and ' + t(sd(4, 2)) + ' to the nearest tenth.' + svg, specs,
      br(['△' + n[0] + n[3] + n[4] + ' ∼ △' + n[0] + n[1] + n[2] + ': they share ∠' + n[0] + ', and ' + sd(3, 4) + ' ∥ ' + sd(1, 2) + ' makes equal corresponding angles (AA).', 'Whole side: ' + t(sd(0, 1) + '=' + N(s.AD) + '+' + N(s.DB) + '=' + N(s.AB)) + ', so ' + t('k=' + N(s.AB) + '\\div ' + N(s.AD) + toN(s.k, 3)),
        t(sd(1, 2) + '=' + N(s.DE) + '\\times ' + N(s.AB) + '\\div ' + N(s.AD) + toN(s.BC, 1)) + ' ' + u, t(sd(0, 2) + '=' + N(s.AE) + '\\times ' + N(s.AB) + '\\div ' + N(s.AD) + toN(s.AC, 3)) + ', so ' + t(sd(4, 2) + '=' + sd(0, 2) + '-' + sd(0, 4) + toN(s.EC, 1)) + ' ' + u]),
      ['The big triangle’s side is the <b>whole</b> side, not just the bottom piece.', 'Find the whole side ' + sd(0, 2) + ' first, then subtract.'], o.text || 'nested triangles');
  }
  /* crossing triangles — a sawhorse (a piece and the whole leg) or a pond (AB and the whole line BE) */
  function crossPart(r, o) {
    o = o || {};
    if (r.chance(0.5)) {
      var s = find(function () { return { a: pickR(r, [40, 70, 2]), b: pickR(r, [60, 100, 2]), tp: pickR(r, [28, 50, 1]) }; }, function (s) { var lo = s.tp * s.b / s.a; return s.b > s.a + 8 && Math.abs(lo * 10 - Math.floor(lo * 10) - 0.5) > 0.06; });
      var lo = s.tp * s.b / s.a, whole = s.tp + lo;
      var svg = crossSVG(null, s.a / s.b, { top: s.a + ' cm', bottom: s.b + ' cm', P1X: s.tp + ' cm', XQ2: '?' }, { ground: true, xName: 'X', aria: 'sawhorse legs crossing' });
      var specs = [lenFld('X to the floor:', lo, { dp: 1, unit: 'cm', name: 'Lower piece', prop: { given: s.tp, num: s.b, den: s.a } }),
        lenFld('Whole leg:', whole, { dp: 1, unit: 'cm', name: 'Whole leg', alts: [{ v: lo, code: 'u6t-piece', hint: 'That is the piece below X. Add the ' + s.tp + ' cm piece above X.' }, { v: s.tp * s.b / s.a * 2, code: 'value', hint: 'Whole leg = the piece above X + the piece below X.' }] })];
      return fieldsPart('The legs of a folding sawhorse cross at X. The top bar is parallel to the floor. The tops of the legs are ' + s.a + ' cm apart and the feet are ' + s.b + ' cm apart. Each leg measures ' + s.tp + ' cm from its top to X. How long is each leg from X to the floor, and how long is a whole leg? (Nearest tenth.)' + svg, specs,
        br(['The angles at X are vertically opposite (equal), and the top bar ∥ the floor makes equal alternate interior angles, so the top and bottom triangles are similar (AA).', 'The ' + s.b + ' cm matches the ' + s.a + ' cm: ' + t('k=' + s.b + '\\div ' + s.a + toN(s.b / s.a, 3)),
          'Below X: ' + t(s.tp + '\\times ' + s.b + '\\div ' + s.a + toN(lo, 1)) + ' cm', 'Whole leg: ' + t(s.tp + '+' + fx(lo, 1) + toN(whole, 1)) + ' cm']),
        ['Which length in the bottom triangle matches the ' + s.a + ' cm top?', 'A whole leg is the piece above X plus the piece below X.'], o.text || 'crossing triangles: sawhorse');
    }
    var nm = r.pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T']]), p = person(r);
    var s2 = find(function () { return { AC: pickR(r, [24, 60, 1]), CD: pickR(r, [8, 18, 0.5]), DE: pickR(r, [9, 22, 0.5]), CE: pickR(r, [8, 20, 0.5]) }; },
      function (s) { var k = s.AC / s.CD, AB = s.DE * k, BC = s.CE * k; return k > 1.8 && k < 5 && Math.abs(AB * 10 - Math.floor(AB * 10) - 0.5) > 0.06 && Math.abs((BC + s.CE) * 10 - Math.floor((BC + s.CE) * 10) - 0.5) > 0.06 && places(AB) > 0; });
    var k = s2.AC / s2.CD, AB = s2.DE * k, BC = s2.CE * k, BE = BC + s2.CE, n = nm;
    var svg2 = crossSVG([n[0], n[1], n[2], n[4], n[3]], AB / s2.DE, { top: '?', P1X: s2.AC + ' m', XQ2: N(s2.CD) + ' m', bottom: N(s2.DE) + ' m', XQ1: N(s2.CE) + ' m' }, { aria: 'a pond measured with crossing triangles' });
    var specs2 = [lenFld(t(n[0] + n[1]) + ' =', AB, { dp: 1, unit: 'm', name: n[0] + n[1], prop: { given: s2.DE, num: s2.AC, den: s2.CD } }),
      lenFld(t(n[1] + n[4]) + ' =', BE, { dp: 1, unit: 'm', name: n[1] + n[4], alts: [{ v: BC, code: 'u6t-piece', hint: 'That is ' + n[1] + n[2] + ', only part of the line. Add ' + n[2] + n[4] + ' = ' + N(s2.CE) + ' m.' }, { v: s2.CE * s2.CD / s2.AC + s2.CE, code: 'u6t-prop-flip', hint: n[1] + n[2] + ' is in the <b>big</b> triangle, so it is longer than ' + n[2] + n[4] + '.' }] })];
    return fieldsPart(p.n + ' wants the width ' + n[0] + n[1] + ' of a pond. ' + cap(p.he) + ' puts a stake at ' + n[2] + ', so ' + n[0] + ', ' + n[2] + ', ' + n[3] + ' are in a line and ' + n[1] + ', ' + n[2] + ', ' + n[4] + ' are in a line, with ' + t(n[3] + n[4] + '\\parallel ' + n[0] + n[1]) + '. ' + cap(p.he) + ' measures ' + t(n[0] + n[2] + '=' + s2.AC) + ' m, ' + t(n[2] + n[3] + '=' + N(s2.CD)) + ' m, ' + t(n[3] + n[4] + '=' + N(s2.DE)) + ' m and ' + t(n[2] + n[4] + '=' + N(s2.CE)) + ' m. Find the width ' + t(n[0] + n[1]) + ' and the whole length of the line ' + t(n[1] + n[4]) + ' (nearest tenth).' + svg2, specs2,
      br(['∠' + n[0] + n[2] + n[1] + ' = ∠' + n[3] + n[2] + n[4] + ' (vertically opposite) and ∠' + n[2] + n[0] + n[1] + ' = ∠' + n[2] + n[3] + n[4] + ' (alternate interior angles, ' + n[0] + n[1] + ' ∥ ' + n[3] + n[4] + '), so △' + n[0] + n[1] + n[2] + ' ∼ △' + n[3] + n[4] + n[2] + ' (AA).',
        t('k=' + n[0] + n[2] + '\\div ' + n[2] + n[3] + '=' + s2.AC + '\\div ' + N(s2.CD) + toN(k, 3)), t(n[0] + n[1] + '=' + N(s2.DE) + '\\times ' + s2.AC + '\\div ' + N(s2.CD) + toN(AB, 1)) + ' m',
        t(n[1] + n[2] + '=' + N(s2.CE) + '\\times ' + s2.AC + '\\div ' + N(s2.CD) + toN(BC, 2)) + ' m, so ' + t(n[1] + n[4] + '=' + fx(BC, 2) + '+' + N(s2.CE) + toN(BE, 1)) + ' m']),
      ['Match in order: ' + n[0] + ' ↔ ' + n[3] + ', ' + n[1] + ' ↔ ' + n[4] + ', ' + n[2] + ' ↔ ' + n[2] + '.', 'The line ' + n[1] + n[4] + ' is ' + n[1] + n[2] + ' + ' + n[2] + n[4] + '.'], o.text || 'crossing triangles: pond');
  }
  Object.assign(A, { aaPart: aaPart, permName: permName, triSidePart: triSidePart, nestedShared: nestedShared, nestedPart: nestedPart, crossPart: crossPart });

  /* ======================================================================================================
   * 6.6 Indirect measurement: shadows, mirrors, a ruler at arm's length
   * ====================================================================================================== */
  var BIG = [['flagpole', 'flag'], ['cell-phone tower', 'tower'], ['tree', 'tree'], ['grain elevator', 'building'], ['light pole', 'pole'], ['church steeple', 'tower'], ['Ferris wheel', 'tower'], ['school', 'building']];
  /* the shadow method */
  function shadowPart(r, o) {
    o = o || {};
    var pp = r.chance(0.55), p = person(r), b = r.pick(BIG);
    var s = find(function () { var h = pp ? pickR(r, [1.45, 1.85, 0.01]) : r.pick([1, 1.5, 2, 1.2, 2.4]), sh = pickR(r, [0.5, 3.2, 0.05]), S = pickR(r, [6, 60, 0.1]); return { h: h, sh: sh, S: S, H: S * h / sh }; },
      function (s) { return s.H >= 4 && s.H <= 55 && Math.abs(s.h / s.sh - 1) > 0.12 && Math.abs(s.H * 10 - Math.floor(s.H * 10) - 0.5) > 0.06 && places(s.S) <= 1; });
    var svg = G.shadowSVG({ small: { h: s.h, shadow: s.sh, kind: pp ? 'person' : 'stick', label: { h: N(s.h) + ' m', s: N(s.sh) + ' m' } }, big: { h: s.H, shadow: s.S, kind: b[1], label: { h: 'h', s: N(s.S) + ' m' } }, units: 'm', width: 420 });
    var who = pp ? p.n + ' is ' + U(s.h, 'm') + ' tall and casts a shadow ' + U(s.sh, 'm') + ' long' : 'An upright post ' + U(s.h, 'm') + ' tall casts a shadow ' + U(s.sh, 'm') + ' long';
    return lenPart(r.pick(['At 3:00 p.m., ', 'Late one afternoon, ', 'At noon, ', 'One sunny morning, ']) + (pp ? who : who.charAt(0).toLowerCase() + who.slice(1)) + '. At the same time, a ' + b[0] + ' casts a shadow ' + U(s.S, 'm') + ' long. How tall is the ' + b[0] + ', to the nearest tenth of a metre?' + svg, s.H, { dp: 1, unit: 'm',
      prop: { given: s.S, num: s.h, den: s.sh }, alts: [{ v: s.S * s.h, code: 'value', hint: 'Write the proportion: height ÷ shadow is the same for both. Then divide by ' + N(s.sh) + '.' }],
      sol: br(['The sun’s rays are parallel and both stand straight up, so the triangles are similar.', t('\\dfrac{h}{' + N(s.S) + '}=\\dfrac{' + N(s.h) + '}{' + N(s.sh) + '}') + ' (height over shadow on both sides)', t('h=' + N(s.S) + '\\times ' + N(s.h) + '\\div ' + N(s.sh) + toN(s.H, 1)) + ' m',
        'Check: ' + (s.h < s.sh ? 'the shadows are longer than the objects, so h is less than ' + N(s.S) + ' m ✓' : 'the shadows are shorter than the objects, so h is more than ' + N(s.S) + ' m ✓')]),
      hints: ['Height ÷ shadow is the same for both objects (at the same time).', 'h ÷ ' + N(s.S) + ' = ' + N(s.h) + ' ÷ ' + N(s.sh) + '.'], text: o.text || 'shadow method' });
  }
  /* the mirror method (eye height, not full height) */
  function mirrorPart(r, o) {
    o = o || {};
    var p = person(r), b = r.pick([['flagpole', 'flag'], ['light pole', 'pole'], ['tree', 'tree'], ['gym wall', 'building'], ['climbing wall', 'building'], ['basketball backboard pole', 'pole']]);
    var s = find(function () { var e = pickR(r, [1.35, 1.75, 0.01]), d1 = pickR(r, [1.2, 3.5, 0.1]), d2 = pickR(r, [5, 24, 0.1]); return { e: e, H: q(e + pickR(r, [0.1, 0.14, 0.01])), d1: d1, d2: d2, h: e * d2 / d1 }; },
      function (s) { return Math.abs(s.e - s.d1) > 0.2 && s.h >= 4 && s.h <= 30 && s.d2 > 3 * s.d1 && Math.abs(s.h * 10 - Math.floor(s.h * 10) - 0.5) > 0.06 && Math.abs(rd(s.H * s.d2 / s.d1, 1) - rd(s.h, 1)) > 0.15; });
    var svg = G.mirrorSVG({ eye: s.e, d1: s.d1, d2: s.d2, h: s.h, kind: b[1], labels: { eye: N(s.e) + ' m', d1: N(s.d1) + ' m', d2: N(s.d2) + ' m', h: 'h' }, width: 420 });
    return lenPart(p.n + ' wants the height of a ' + b[0] + '. ' + cap(p.he) + ' puts a mirror flat on the ground ' + U(s.d2, 'm') + ' from the base of the ' + b[0] + ' and backs up until ' + p.he + ' sees the top in the centre of the mirror. ' + cap(p.he) + ' is then ' + U(s.d1, 'm') + ' from the mirror. ' + cap(p.he) + ' is ' + U(s.H, 'm') + ' tall, and ' + p.his + ' eyes are ' + U(s.e, 'm') + ' above the ground. How tall is the ' + b[0] + ', to the nearest tenth of a metre?' + svg, s.h, { dp: 1, unit: 'm',
      prop: { given: s.d2, num: s.e, den: s.d1 }, alts: [{ v: s.H * s.d2 / s.d1, code: 'u6t-full-height', hint: 'The light goes to ' + p.his + ' <b>eyes</b>: use the eye height, ' + N(s.e) + ' m, not the full height.' }, { v: s.e * (s.d1 + s.d2) / s.d1, code: 'u6t-mirror-total', hint: 'Use the distance from the <b>mirror</b> to the ' + b[0] + ', ' + N(s.d2) + ' m.' }],
      sol: br(['Angle in = angle out at the mirror, and both stand straight up, so the triangles are similar.', t('\\dfrac{h}{' + N(s.d2) + '}=\\dfrac{' + N(s.e) + '}{' + N(s.d1) + '}') + ' (height over distance to the mirror)', t('h=' + N(s.d2) + '\\times ' + N(s.e) + '\\div ' + N(s.d1) + toN(s.h, 1)) + ' m']),
      hints: ['Height ÷ distance to the mirror is the same for both triangles.', 'Use the eye height (the light goes to the eyes).'], text: o.text || 'mirror method' });
  }
  /* a ruler held upright at arm's length */
  function rulerPart(r, o) {
    o = o || {};
    var p = person(r), back = r.chance(0.3), what = r.pick(['wind turbine tower', 'radio tower', 'water tower', 'grain elevator', 'cell-phone tower']);
    var s = find(function () { return { a: r.pick([50, 55, 60, 65, 70, 75]), rr: pickR(r, [3, 20, 0.5]), Dd: pickR(r, [80, 800, 10]) }; },
      function (s) { var h = s.Dd * s.rr / s.a; return h >= 15 && h <= 150 && (back ? places(q(h)) <= 1 : Math.abs(h * 10 - Math.floor(h * 10) - 0.5) > 0.06); });
    var h = s.Dd * s.rr / s.a;
    if (!back) return lenPart(p.n + ' is ' + s.Dd + ' m from a ' + what + ' (' + p.he + ' found the distance on a map app). ' + cap(p.he) + ' holds a ruler upright ' + s.a + ' cm from ' + p.his + ' eye. The ' + what + ', from the ground to the top, covers ' + U(s.rr, 'cm') + ' of the ruler. How tall is the ' + what + ', to the nearest tenth of a metre?', h, { dp: 1, unit: 'm',
      prop: { given: s.Dd, num: s.rr, den: s.a }, alts: [{ v: s.Dd * s.rr / (s.a / 100), code: 'u6t-unit-mix', hint: 'The ruler reading and the eye-to-ruler distance must be in the same unit (both cm). Then the height comes out in metres, like the distance.' }],
      sol: br(['The ruler and the ' + what + ' are both upright (parallel), so the two triangles from the eye are similar.', t('\\dfrac{h}{' + s.Dd + '}=\\dfrac{' + N(s.rr) + '}{' + s.a + '}') + ' (both cm on the right, so h is in metres)', t('h=' + s.Dd + '\\times ' + N(s.rr) + '\\div ' + s.a + toN(h, 1)) + ' m']),
      hints: ['Height ÷ distance = ruler reading ÷ eye-to-ruler distance.', 'Keep the two ruler numbers in cm.'], text: o.text || 'ruler method' });
    var Hh = q(h);
    return lenPart('A ' + what + ' is known to be ' + U(Hh, 'm') + ' tall. ' + p.n + ' holds a ruler upright ' + s.a + ' cm from ' + p.his + ' eye, and the ' + what + ' covers ' + U(s.rr, 'cm') + ' of the ruler. How far is ' + p.n + ' from the ' + what + ', to the nearest metre?', s.Dd, { dp: 0, unit: 'm',
      prop: { given: Hh, num: s.a, den: s.rr }, alts: [{ v: Hh * (s.a / 100) / s.rr, code: 'u6t-unit-mix', hint: 'Keep the ruler reading and the eye distance in the same unit (both cm).' }],
      sol: br([t('\\dfrac{' + N(Hh) + '}{D}=\\dfrac{' + N(s.rr) + '}{' + s.a + '}'), t(N(s.rr) + 'D=' + N(Hh) + '\\times ' + s.a), t('D=' + N(Hh) + '\\times ' + s.a + '\\div ' + N(s.rr) + '=' + s.Dd) + ' m']),
      hints: ['Height ÷ distance = ruler reading ÷ eye-to-ruler distance.', 'Now the distance is missing: cross-multiply.'], text: o.text || 'ruler method (distance)' });
  }
  /* the mirror method, then where a second person must stand */
  function mirror2Part(r, o) {
    o = o || {};
    var p = person(r), p2 = person(r, [p.n]), what = r.pick([['flagpole', 'flag'], ['light pole', 'pole'], ['tree', 'tree']]);
    var s = find(function () { var e1 = pickR(r, [1.4, 1.8, 0.05]), d1 = pickR(r, [1.6, 3.2, 0.1]), d2 = pickR(r, [8, 24, 0.1]), e2 = q(e1 + r.pick([-0.25, -0.2, -0.15, 0.15, 0.2, 0.25])); return { e1: e1, d1: d1, d2: d2, e2: e2, h: e1 * d2 / d1 }; },
      function (s) { var dd = s.e2 * s.d2 / s.h; return Math.abs(s.e1 - s.d1) > 0.2 && places(q(s.h)) <= 2 && s.h >= 5 && s.h <= 25 && Math.abs(dd * 100 - Math.floor(dd * 100) - 0.5) > 0.06; });
    var dd = s.e2 * s.d2 / s.h, svg = G.mirrorSVG({ eye: s.e1, d1: s.d1, d2: s.d2, h: s.h, kind: what[1], labels: { eye: N(s.e1) + ' m', d1: N(s.d1) + ' m', d2: N(s.d2) + ' m', h: 'h' }, width: 420 });
    var specs = [lenFld('Height of the ' + what[0] + ':', s.h, { dp: 2, unit: 'm', name: 'Height', prop: { given: s.d2, num: s.e1, den: s.d1 }, alts: [{ v: s.e1 * (s.d1 + s.d2) / s.d1, code: 'u6t-mirror-total', hint: 'Use the distance from the <b>mirror</b> to the ' + what[0] + '.' }] }),
      lenFld(p2.n + ' to the mirror:', dd, { dp: 2, unit: 'm', name: p2.n + ' to mirror', prop: { given: s.e2, num: s.d2, den: s.h }, alts: [{ v: s.d1, code: 'u6t-same-spot', hint: p2.n + '’s eyes are ' + (s.e2 > s.e1 ? 'higher' : 'lower') + ', so ' + p2.he + ' must stand ' + (s.e2 > s.e1 ? 'farther from' : 'closer to') + ' the mirror.' }] })];
    return fieldsPart(p.n + ' puts a mirror on the ground ' + U(s.d2, 'm') + ' from the base of a ' + what[0] + ' and backs up until ' + p.he + ' sees the top in the mirror. ' + cap(p.his) + ' eyes are ' + U(s.e1, 'm') + ' above the ground and ' + p.he + ' is ' + U(s.d1, 'm') + ' from the mirror. (a) How tall is the ' + what[0] + '? (b) ' + p2.n + '’s eyes are ' + U(s.e2, 'm') + ' above the ground. The mirror stays in the same spot. How far from the mirror must ' + p2.n + ' stand to see the top? Round to the nearest hundredth of a metre.' + svg, specs,
      br(['(a) ' + t('\\dfrac{h}{' + N(s.d2) + '}=\\dfrac{' + N(s.e1) + '}{' + N(s.d1) + '}') + ', so ' + t('h=' + N(s.d2) + '\\times ' + N(s.e1) + '\\div ' + N(s.d1) + '=' + N(q(s.h))) + ' m',
        '(b) ' + t('\\dfrac{' + N(q(s.h)) + '}{' + N(s.d2) + '}=\\dfrac{' + N(s.e2) + '}{d}') + ', so ' + t('d=' + N(s.e2) + '\\times ' + N(s.d2) + '\\div ' + N(q(s.h)) + toN(dd, 2)) + ' m (' + (s.e2 > s.e1 ? 'higher eyes: farther back' : 'lower eyes: closer') + ' ✓)']),
      ['Height ÷ distance to the mirror is the same in both triangles.', 'In (b) the height is known and the distance is missing.'], o.text || 'mirror method twice');
  }
  Object.assign(A, { BIG: BIG, shadowPart: shadowPart, mirrorPart: mirrorPart, rulerPart: rulerPart, mirror2Part: mirror2Part });

  /* ======================= the questions (paper order; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  var QUESTIONS = [
    /* ---------- Beginning ---------- */
    Q(1, 'G3', 'BEG', function (r) { return kTypePart(r); }, 'Scale factor from two lengths; enlargement or reduction'),
    Q(2, 'G3', 'BEG', function (r) { return triAnglePart(r); }, 'Angles of similar triangles from the naming order'),
    Q(3, 'G3', 'BEG', function (r) { return kSidesPart(r); }, 'A new side (× k) and an original side (÷ k)'),
    Q(4, 'G3', 'BEG', function (r) { return rectSimPart(r); }, 'Is a print similar to a photo? (long ÷ short)'),
    Q(5, 'G3', 'BEG', function (r) { return copyPart(r); }, 'A copy: its side and its angle'),
    Q(6, 'G3', 'BEG', function (r) { return scaleRatioPart(r); }, 'A scale in words as a ratio'),
    Q(7, 'G3', 'BEG', function (r) { return planRealPart(r); }, 'A real length from a floor plan'),
    Q(8, 'G3', 'BEG', function (r) { return aaPart(r); }, 'The AA test: third angles, similar or not'),
    Q(9, 'G3', 'BEG', function (r) { return shadowPart(r); }, 'The shadow method'),
    Q(10, 'G3', 'BEG', function (r) { return projPart(r); }, 'The projection method: distance from O'),
    /* ---------- Progressing ---------- */
    Q(11, 'G3', 'PRG', function (r) { return simFigPart(r); }, 'Similar figures (turned): k, a new side and an original side'),
    Q(12, 'G3', 'PRG', function (r) { return angleNamePart(r); }, 'An angle from the naming order and the angle sum'),
    Q(13, 'G3', 'PRG', function (r) { return boxSimPart(r); }, 'Which box (or can) is similar, and k'),
    Q(14, 'G3', 'PRG', function (r) { return regPolyPart(r); }, 'Regular polygons: each angle and k'),
    Q(15, 'G3', 'PRG', function (r) { return gridPart(r); }, 'The grid method: a move on the copy'),
    Q(16, 'G3', 'PRG', function (r) { return mapBothPart(r); }, 'A map at 1 : n, both ways'),
    Q(17, 'G3', 'PRG', function (r) { return triSidePart(r); }, 'Similar triangles: a missing side to the nearest tenth'),
    Q(18, 'G3', 'PRG', function (r) { return nestedPart(r); }, 'Nested triangles (DE ∥ BC): a side and a piece'),
    Q(19, 'G3', 'PRG', function (r) { return mirrorPart(r); }, 'The mirror method'),
    Q(20, 'G3', 'PRG', function (r) { return rulerPart(r); }, 'A ruler at arm’s length'),
    /* ---------- Mastery ---------- */
    Q(21, 'G3', 'MAS', function (r) { return modelPart(r); }, 'A 1 : n model both ways, with unit changes'),
    Q(22, 'G3', 'MAS', function (r) { return framePart(r); }, 'A mat border: the outside, and a similar outside'),
    Q(23, 'G3', 'MAS', function (r) { return fitPart(r); }, 'The largest similar enlargement that fits'),
    Q(24, 'G3', 'MAS', function (r) { return planAreaPart(r); }, 'A floor plan: real area and cost'),
    Q(25, 'G3', 'MAS', function (r) { return crossPart(r); }, 'Crossing triangles: a piece and a whole'),
    Q(26, 'G3', 'MAS', function (r) { return mirror2Part(r); }, 'The mirror method, then where a second person stands')
  ];

  HW.defineTest({
    id: 'u6test', unit: 6, title: 'Unit 6 Test', outcome: 'G3', calc: true,
    blurb: 'The Unit 6 outcomes-based test (G3 similarity of polygons): similar polygons and scale factors, checking angles and side ratios, drawing enlargements and reductions, maps and floor plans, similar triangles, and indirect measurement with shadows and mirrors, in Beginning, Progressing and Mastery boxes.',
    // Short version (~50%): Beginning keeps the scale factor and type, the print-and-photo test, the scale as a ratio, the AA
    // test and the shadow method; Progressing keeps similar figures (k and two sides), which box is similar, the map both ways,
    // a missing side of similar triangles and the mirror method; Mastery keeps the model both ways, crossing triangles and
    // the mirror method twice.
    short: ['1', '4', '6', '8', '9', '11', '13', '16', '17', '19', '21', '25', '26'],
    questions: QUESTIONS
  });
})(window);
