/* Math 10-3 · Unit 6 · Lesson 3 — Drawing Enlargements and Reductions (G3)
 * Assignment 3 (u6_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u6_ep03.tex, A 1–6, B 7–12, C 13–14).
 * Every part is a generator: the same figure and difficulty as the booklet item with new numbers around the booklet's (the
 * lesson's worked-example numbers are left out: the 6-10-8-4 quadrilateral, the birdhouse, the house and arrow on the grid,
 * triangle PQR, the ramp, Mei's 4 × 6 photo, the art club's 15 × 10 photo, Jada's WXYZ). Calculator allowed.
 * Answers: lengths exactly (they come out exact) or to the nearest tenth where the booklet rounds; a unit typed after the
 * number is fine when it is the box's unit; a decimal comma, a wrong unit, or a correct value rounded too soon gets a nudge
 * (no try used). Recognised mistakes get their own hint: adding k (or the same amount) instead of multiplying, dividing by k
 * instead of multiplying (and back), changing the angle (× k, ÷ k, + k), giving the original grid count, doubling instead of
 * halving for k = ½, mixing up across and up/down, measuring the projection distance from the old corner, cm ↔ m not changed,
 * the larger k when fitting a frame or poster, adding scale factors instead of multiplying, area × k instead of × k².
 * Conversions: "enlargement, reduction or same size" → a table of choices (tap one per row); the fill-in tables → the table
 * input (given cells shown, blanks as boxes); "draw on the grid" → (i) the moves of the copy in boxes (squares right/left
 * and up/down, as the booklet's move tables) and (ii) "which drawing is the copy?" (multiple choice of grid pictures: the
 * right one, only the moves across multiplied, only the moves up/down, the slanted moves not multiplied); "measure, then
 * draw with a ruler and protractor" → the measurements are printed on the figure (not to scale) and the copy's sides and
 * angles go in boxes; "the projection method" → the distances from O are given (as Ana measured them) and the new
 * distances go in boxes; "is it similar? explain" / "is he right?" → multiple choice whose options are reasons; "find his
 * two mistakes" → tap the wrong measurements, then the correct values in boxes; "draw the enlargement of the 2 by 3
 * rectangle" → its length and width. Numerical-response items keep the 4-box answer.
 * Outcome G3 throughout. Levels: LIM BEG EMG PRG ADV MAS.
 * Exports HW.u6draw (number reading/checking with unit and rounding nudges, number/box/scale-factor part builders, tables) for
 * Lesson 6.4 (u6l4.js), so this file must load before u6l4.js. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, G = HW.geo, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= numbers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function nS(x) { return String(q(x)); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function trunc(x, dp) { var f = Math.pow(10, dp); return Math.floor(x * f + 1e-9) / f; }
  function find(gen, test, fb) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function place(dp) { return dp <= 0 ? 'whole number' : dp === 1 ? 'tenth' : 'hundredth'; }
  function cm(x, u) { return nS(x) + ' ' + (u || 'cm'); }                        // plain "4.5 cm"
  function T(x, u) { return t(nS(x) + (u === '°' ? '^\\circ' : u === 'm²' ? '\\text{ m}^2' : u ? '\\text{ ' + u + '}' : '')); }
  function dg(x) { return t(nS(x) + '^\\circ'); }
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function kT(k) { var fr = { 0.5: '\\frac{1}{2}', 0.25: '\\frac{1}{4}', 0.75: '\\frac{3}{4}' }; return fr[q(k)] || nS(k); }
  function fracTex(p, d) { return '\\frac{' + p + '}{' + d + '}'; }
  function an(x) { var s = String(Math.floor(q(x))); return /^8/.test(s) || /^1[18]$/.test(s) || /^1[18]\d\d$/.test(s) ? 'an' : 'a'; }
  function row(items, w) {
    return '<div style="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;margin:6px 0">' + items.map(function (it) {
      return '<div style="flex:0 1 ' + (w || 180) + 'px;min-width:' + Math.round((w || 180) * 0.7) + 'px;text-align:center">' + it[0] + (it[1] ? '<div style="font-weight:600;margin-top:2px">' + it[1] + '</div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  var TD = 'border:1px solid #b9c2d0;padding:4px 10px;text-align:center';
  function table(head, rows) {
    return '<table style="border-collapse:collapse;margin:6px 0"><tr>' + head.map(function (h) { return '<th style="' + TD + ';background:#eef2f8">' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td style="' + TD + (i === 0 ? ';font-weight:700;text-align:left' : '') + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ================= reading and checking a number ================= */
  var UNITS = { mm: 'mm', cm: 'cm', m: 'm', km: 'km', 'in': 'in', inch: 'in', inches: 'in', ft: 'ft', feet: 'ft', '°': '°', degree: '°', degrees: '°', deg: '°', square: 'squares', squares: 'squares', times: 'times', 'm²': 'm²', h: 'h', hr: 'h', hrs: 'h', hour: 'h', hours: 'h', min: 'min', mins: 'min', minute: 'min', minutes: 'min' };
  function readN(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|textrm)\{\s*([^{}]*?)\s*\}/g, ' $1 ').replace(/\\[,;: !]|~|\\quad/g, ' ').replace(/\^\{?\\circ\}?|\\circ|\\degree|º|˚/g, '°').replace(/\s+/g, ' ').trim();
    s = s.replace(/^(?:\\angle\s*|∠\s*)?[A-Za-z]{1,3}['′’]*\s*(?:=|≈|\\approx)\s*/, '').trim();
    var unit = null, m = /^(.*?[\d.])\s*(mm|cm|km|m²|m\^\{?2\}?|m2|sq\.? ?m|m|in|inch|inches|ft|feet|°|degrees?|deg|squares?|times|h|hr|hrs|hours?|min|mins|minutes?)\.?\s*$/i.exec(s);
    if (m && /^m(²|\^|2)|^sq/i.test(m[2])) m[2] = 'm²';
    if (m) { unit = UNITS[m[2].toLowerCase()] || m[2]; s = m[1].trim(); }
    if (/^x\s*/i.test(s) && unit === null) s = s.replace(/^x\s*/i, '');
    if (!s) return { code: 'empty' };
    if (/^-?\d+,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { code: 'comma' };
    var p = HW.parse.number(s); if (!p.ok) return { code: p.code === 'empty' ? 'empty' : 'notnumber' };
    var plain = HW.parse.plain(s).replace(/\s/g, '');
    return { v: p.value, dec: (plain.split('.')[1] || '').length, unit: unit, len: plain.replace(/^-/, '').length };
  }
  /* one number. v = the exact value. o: { dp (rounding asked for; default: exact, up to 2 decimals), unit (the box's unit),
   *   alts: [{ v, code, hint }] (recognised wrong values), also: [other right values], nr (4 characters), diag(x) } */
  function numC(v, o) {
    o = o || {}; v = q(v);
    var dp = o.dp != null ? o.dp : Math.min(2, decs(v)), want = rd(v, dp), exactNice = same(v, want), also = (o.also || []).map(q);
    var alts = (o.alts || []).filter(function (a) { return a && isFinite(a.v) && !same(rd(a.v, dp), want) && !also.some(function (w) { return same(rd(a.v, dp), rd(w, dp)); }); });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var a = readN(resp);
      if (a.code === 'empty') return form('empty', 'Type your answer first.');
      if (a.code === 'comma') return form('u6l3-comma', 'Use a decimal <b>point</b>, not a comma (for example 4.5).');
      if (a.code) return form('notnumber', 'Type a single number' + (o.unit ? ' (the unit is already beside the box).' : '.'));
      var x = a.v, i;
      var right = same(x, want) || also.some(function (w) { return same(x, w) || same(x, rd(w, dp)); });
      if (!right && dp >= 0) { var sc = Math.pow(10, dp), fl = Math.floor(v * sc + 1e-9); if (Math.abs(v * sc - fl - 0.5) < 1e-7 && same(x, fl / sc)) right = true; }
      if (right) {
        if (a.unit && o.unit && a.unit !== o.unit && !(o.unit === '°' && a.unit === '°')) return form('u6l3-unit', 'Check the unit: this box is in <b>' + o.unit + '</b>. Type just the number.');
        if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
        return ok();
      }
      if (a.dec > dp && same(rd(x, dp), want)) return form('round', 'Right — now round to the nearest ' + place(dp) + '.');
      for (i = 0; i < alts.length; i++) { var w = alts[i].v; if (same(x, w) || same(x, rd(w, dp)) || (a.dec > 0 && a.dec <= 2 && same(x, rd(w, a.dec)) && Math.abs(x - w) > 1e-9 && a.dec < decs(w))) return wrong(alts[i].code, alts[i].hint); }
      if (!exactNice && a.dec < dp && same(x, rd(v, a.dec))) return form('places', 'Round to the nearest ' + place(dp) + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      if (exactNice && a.dec < decs(v) && same(x, rd(v, a.dec))) return form('u6l3-exact', 'Close — but this answer comes out exactly. Don’t round it: keep every decimal place.');
      if (!exactNice && dp > 0 && same(x, trunc(v, dp))) return wrong('truncate', 'Round, don’t chop: look at the next digit. If it is 5 or more, round up.');
      var h = o.diag ? o.diag(x) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  function keyOf(v, o) { o = o || {}; var dp = o.dp != null ? o.dp : Math.min(2, decs(v)); return nS(rd(v, dp)); }
  function badOf(v, o) { o = o || {}; var dp = o.dp != null ? o.dp : Math.min(2, decs(v)), out = []; (o.alts || []).forEach(function (a) { if (a && isFinite(a.v) && !same(rd(a.v, dp), rd(v, dp)) && !(o.also || []).some(function (w) { return same(rd(a.v, dp), rd(w, dp)); })) { var s = nS(rd(a.v, Math.max(dp, 2))); if (out.indexOf(s) < 0) out.push(s); } }); return out; }
  function showV(v, o) { o = o || {}; var x = Number(keyOf(v, o)); return T(x, o.unit === 'squares' && x === 1 ? 'square' : o.unit); }
  /* a number part */
  function num(prompt, v, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', before: o.before, after: o.unit === 'squares' ? 'squares' : o.unit, nr: !!o.nr }, check: numC(v, o), key: keyOf(v, o), answer: showV(v, o), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badOf(v, o).filter(function (s) { return !o.nr || s.replace(/^-/, '').length <= 4; }); p.good = o.unit && o.unit !== '°' && o.unit !== 'squares' && !o.nr ? [p.key + ' ' + o.unit] : [];
    return p;
  }
  /* a box in a set of boxes */
  function fld(label, v, o) { o = o || {}; return { label: label, name: o.name, after: o.unit, chk: numC(v, o), key: keyOf(v, o), show: showV(v, o), bad: badOf(v, o) }; }
  /* a scale factor box (HW.geo.kChk), with extra recognised values first */
  function kChkX(k, alts) {
    var c = G.kChk(k, {});
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var a = readN(resp);
      if (!a.code) for (var i = 0; i < (alts || []).length; i++) if (!same(alts[i].v, k) && (same(a.v, alts[i].v) || (rd(alts[i].v, 2) !== 0 && same(a.v, rd(alts[i].v, 2))) || (a.dec >= 3 && same(a.v, rd(alts[i].v, a.dec))))) return wrong(alts[i].code, alts[i].hint);
      return c(String(resp == null ? '' : resp).replace(/^\s*[kK]\s*=\s*/, ''));
    };
  }
  function kFld(label, k, alts) { return { label: label || t('k='), name: 'k', chk: kChkX(k, alts), key: nS(k), show: t(nS(k)), bad: (alts || []).filter(function (a) { return !same(a.v, k); }).map(function (a) { return nS(rd(a.v, 4)); }) }; }
  function kPart(prompt, k, alts, sol, hints, text) {
    return { prompt: prompt, input: { type: 'number', before: t('k=') }, check: kChkX(k, alts), key: nS(k), answer: t('k=' + nS(k)), solution: sol, hints: hints || [], text: text,
      bad: (alts || []).filter(function (a) { return !same(a.v, k); }).map(function (a) { return nS(rd(a.v, 4)); }), good: [] };
  }
  function fieldsPart(prompt, flds, sol, hints, text) {
    var keys = flds.map(function (f) { return f.key; });
    var p = P.fields(prompt, flds.map(function (f) { return { label: f.label, name: f.name || String(f.label || '').replace(/<[^>]+>|\\\(|\\\)/g, '').replace(/[:=]\s*$/, '').trim(), before: f.before, after: f.after === 'squares' ? 'squares' : f.after, mode: f.mode, wide: f.wide, placeholder: f.ph }; }),
      flds.map(function (f) { return f.chk; }), keys, flds.map(function (f) { return (f.label ? f.label + ' ' : '') + f.show; }).join(' &nbsp;·&nbsp; '), sol, hints, text);
    p.bad = []; flds.forEach(function (f, i) { (f.bad || []).forEach(function (b) { var arr = keys.slice(); arr[i] = b; p.bad.push(arr); }); });
    if (flds.length > 1 && keys[0] !== keys[1]) { var sw = keys.slice(); sw[0] = keys[1]; sw[1] = keys[0]; p.bad.push(sw); }
    return p;
  }

  /* ================= common wrong values ================= */
  function lenAlts(len, k, o) {   // new = len × k
    o = o || {}; var out = [{ v: len + k, code: 'u6l3-add-k', hint: 'A scale factor <b>multiplies</b> every length: ' + t(nS(len) + '\\times ' + kT(k)) + ', not ' + t(nS(len) + '+' + kT(k)) + '.' },
      { v: len / k, code: 'u6l3-div-k', hint: k > 1 ? 'The copy is an <b>enlargement</b> (k > 1), so its sides are longer. Multiply by k.' : 'New length = original × k. (You divided by k.)' }];
    if (o.angle) out.push({ v: o.angle, code: 'u6l3-mixed', hint: 'That’s the angle. This box is a side length.' });
    return out;
  }
  function angAlts(ang, k) {
    return [{ v: ang * k, code: 'u6l3-angle-k', hint: 'Angles <b>don’t change</b> in a similar figure. Only the lengths are multiplied by k.' },
      { v: ang / k, code: 'u6l3-angle-k', hint: 'Angles stay the same in an enlargement or a reduction.' }, { v: ang + k, code: 'u6l3-angle-k', hint: 'Angles stay the same: don’t add or multiply anything.' }];
  }
  function origAlts(len, k) {   // original = len ÷ k
    return [{ v: len * k, code: 'u6l3-mul-k', hint: 'Going back to the original: <b>divide</b> by k (original = copy ÷ k).' }, { v: len - k, code: 'u6l3-add-k', hint: 'Divide by k (original = copy ÷ k); don’t subtract it.' }];
  }

  HW.addCodes({
    'u6l3-add-k': 'Added k instead of multiplying', 'u6l3-div-k': 'Divided by k instead of multiplying', 'u6l3-mul-k': 'Multiplied by k instead of dividing (back to the original)',
    'u6l3-angle-k': 'Changed the angle (× k, ÷ k or + k)', 'u6l3-mixed': 'Put an angle in a length box (or the reverse)', 'u6l3-unit': 'Wrong unit for the box', 'u6l3-comma': 'Decimal comma', 'u6l3-exact': 'Rounded an exact answer',
    'u6l3-type': 'Enlargement / reduction / same size mixed up', 'u6l3-ratio-flip': 'Divided old ÷ new', 'u6l3-ratio-diff': 'Subtracted instead of dividing', 'u6l3-add-sim': 'Thought adding the same amount keeps the shape',
    'u6l3-angles-only': 'Thought equal angles are enough', 'u6l3-bigger': 'Thought "bigger" means similar', 'u6l3-prop-add': 'Added the difference instead of multiplying by k', 'u6l3-prop-flip': 'Scale factor upside down',
    'u6l3-grid-nok': 'Grid: gave the original count (not × k)', 'u6l3-grid-add': 'Grid: added k to the count', 'u6l3-grid-swap': 'Grid: mixed up across and up/down', 'u6l3-grid-double': 'Grid: doubled instead of halving',
    'u6l3-pic-x': 'Picture: only the moves across multiplied', 'u6l3-pic-y': 'Picture: only the moves up/down multiplied', 'u6l3-pic-slant': 'Picture: the slanted moves not multiplied',
    'u6l3-angle-sum': 'Angle sum: left out an angle', 'u6l3-para-same': 'Parallelogram: gave the same angle for the neighbouring angle', 'u6l3-from-a': 'Projection: measured from the old corner',
    'u6l3-proj-add': 'Projection: added k to the distance', 'u6l3-proj-frac': 'Projection: multiplied by the bottom of the fraction', 'u6l3-amir-yes': 'Agreed with measuring from the old corner', 'u6l3-amir-between': 'Put an enlargement’s corner between O and A', 'u6l3-amir-k': 'Gave k instead of the real factor',
    'u6l3-cm-m': 'Didn’t change cm to m (or m to cm)', 'u6l3-cm-m-1000': 'Changed cm to m with 1000', 'u6l3-print-k2': 'Thought a similar print must use one fixed k', 'u6l3-standard': 'Thought standard sizes are always similar',
    'u6l3-fit-big': 'Used the larger k (the copy does not fit)', 'u6l3-fit-left': 'Left-over strip worked from the wrong side', 'u6l3-sam-right': 'Marked a correct measurement as a mistake', 'u6l3-sam-missed': 'Missed one of the mistakes',
    'u6l3-k-sum': 'Added the two scale factors', 'u6l3-area-k': 'Area: multiplied by k instead of k × k', 'u6l3-area-sq': 'Gave the number of squares, not how many times bigger', 'u6l3-noah-yes': 'Ignored the angles',
    'u6l3-notsim': 'Chose a method that does give a similar figure', 'u6l3-mc-add': 'Added k to each side', 'u6l3-mc-one': 'Multiplied only one side', 'u6l3-mc-div': 'Divided by k', 'u6l3-units-k': 'Scale factor without changing to the same units'
  });
  HW.addPartial({
    'u6l3-add-k': 'n', 'u6l3-div-k': 'b', 'u6l3-mul-k': 'b', 'u6l3-angle-k': 'n', 'u6l3-mixed': 'b', 'u6l3-ratio-flip': 'b', 'u6l3-ratio-diff': 'n', 'u6l3-prop-add': 'n', 'u6l3-prop-flip': 'b',
    'u6l3-grid-nok': 'n', 'u6l3-grid-add': 'n', 'u6l3-grid-swap': 's', 'u6l3-grid-double': 'b', 'u6l3-angle-sum': 'b', 'u6l3-para-same': 'b', 'u6l3-from-a': 'b', 'u6l3-proj-add': 'n', 'u6l3-proj-frac': 'b',
    'u6l3-amir-k': 'b', 'u6l3-cm-m': 's', 'u6l3-cm-m-1000': 's', 'u6l3-fit-big': 'b', 'u6l3-fit-left': 's', 'u6l3-k-sum': 'n', 'u6l3-area-k': 'b', 'u6l3-area-sq': 's', 'u6l3-units-k': 'b'
  });

  /* ================= enlargement / reduction / same size (a table of choices) ================= */
  function typeOf(k) { return k > 1 + 1e-9 ? 'enl' : k < 1 - 1e-9 ? 'red' : 'same'; }
  var TYPE_COLS = [{ id: 'enl', html: 'Enlargement' }, { id: 'red', html: 'Reduction' }, { id: 'same', html: 'Same size' }];
  /* ks: [{ v, tex }] */
  function typeGrid(prompt, ks, letters) {
    var rows = ks.map(function (k, i) { return { id: 'r' + i, html: (letters ? '(' + String.fromCharCode(97 + i) + ') ' : '') + t('k=' + k.tex), label: 'k = ' + k.tex }; }), want = {};
    ks.forEach(function (k, i) { want['r' + i] = typeOf(k.v); });
    var why = function (rid) {
      var k = ks[Number(rid.slice(1))], ty = typeOf(k.v), dec = /frac/.test(k.tex) ? t(k.tex + '=' + nS(rd(k.v, 3))) + (same(k.v, rd(k.v, 3)) ? '' : '…') + ', which is ' : 'it is ';
      return { code: 'u6l3-type', hint: 'Check ' + t('k=' + k.tex) + ': ' + dec + (ty === 'enl' ? 'more than 1, so the copy is bigger (an enlargement).' : ty === 'red' ? 'less than 1, so the copy is smaller (a reduction).' : 'exactly 1, so the copy is the same size.') };
    };
    return P.grid(prompt, rows, TYPE_COLS, want, { why: why, rowHead: t('k') },
      'More than 1: enlargement. Less than 1: reduction. Exactly 1: same size.<br>' + ks.map(function (k, i) { return (letters ? '(' + String.fromCharCode(97 + i) + ') ' : '') + t('k=' + k.tex) + ': ' + { enl: 'enlargement', red: 'reduction', same: 'same size' }[typeOf(k.v)]; }).join('<br>'),
      ['Compare k with 1. A fraction like ' + t('\\frac{3}{2}') + ' is ' + t('3\\div 2=1.5') + '.'], 'enlargement or reduction');
  }
  function typeKs(r) {
    var fr1 = r.pick([[3, 2], [5, 4], [4, 3], [5, 2], [7, 4]]), fr2 = r.pick([[1, 4], [1, 3], [2, 3], [1, 5], [3, 4]]);
    return r.shuffle([{ v: r.int(2, 5), tex: '' }, { v: r.pick([0.8, 0.6, 0.4, 0.9, 0.3, 0.75]), tex: '' }, { v: 1, tex: '1' }, { v: fr1[0] / fr1[1], tex: fracTex(fr1[0], fr1[1]) }, { v: fr2[0] / fr2[1], tex: fracTex(fr2[0], fr2[1]) }, { v: r.pick([1.05, 1.02, 1.1, 0.95, 0.98, 1.01, 0.99]), tex: '' }])
      .map(function (k) { if (!k.tex) k.tex = nS(k.v); return k; });
  }

  /* ================= fill-in tables (copies of a figure) ================= */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS['u6-num']) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS['u6-num'] = [[dk(7), dk(8), dk(9), { label: '⌫', fn: 'del', title: 'Delete' }], [dk(4), dk(5), dk(6), { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }], [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
  }
  /* sides: [lengths], ang: the angle, ks: [k values]; one row per k, one column per side and one for the angle */
  function copyTable(prompt, sides, ang, ks, o) {
    o = o || {};
    var cols = sides.map(function (s) { return nS(s) + '\\text{ cm side}'; }).concat([nS(ang) + '^\\circ\\text{ angle}']), rows = ks.map(function (k) { return 'k=' + kT(k); });
    var blanks = [], cells = [], key = [];
    ks.forEach(function (k, i) {
      cells.push(cols.map(function () { return null; }));
      key.push(sides.map(function (s) { return nS(s * k); }).concat([nS(ang)]));
      sides.forEach(function (s, j) { blanks.push({ where: 'cell', i: i, j: j, name: t('k=' + kT(k)) + ', ' + cm(s) + ' side', chk: numC(s * k, { unit: 'cm', alts: lenAlts(s, k, { angle: ang }) }) }); });
      blanks.push({ where: 'cell', i: i, j: sides.length, name: t('k=' + kT(k)) + ', angle', chk: numC(ang, { unit: '°', alts: angAlts(ang, k).concat(sides.map(function (s) { return { v: s * k, code: 'u6l3-mixed', hint: 'This column is the <b>angle</b>. Angles don’t change.' }; })) }) });
    });
    var inp = { type: 'areabox', rows: rows, cols: cols, cells: cells, corner: 'k', keys: 'u6-num', help: 'Tap a box, then type the number (the units are in the column heading).' };
    var keyV = { rows: rows, cols: cols, cells: key };
    var sol = steps(['Multiply each side by k; the angle does not change.'].concat(ks.map(function (k) { return t('k=' + kT(k)) + ': ' + sides.map(function (s) { return t(nS(s) + '\\times ' + nS(k) + '=' + nS(s * k)); }).join(', \\ ') + '; the angle stays ' + dg(ang) + '.'; })));
    return { prompt: prompt, input: inp, check: HW.pctKit.tableChk(blanks), key: keyV, answer: HW.draw.areaboxHtml(inp, keyV), solution: sol, hints: o.hints || ['New length = original length × k.', 'Every angle stays the same size.'], text: o.text || 'copy table' };
  }
  /* a triangle with sides a < b < c (whole cm) */
  function triSides(r, not) {
    return find(function () { var a = r.int(3, 9), b = a + r.int(1, 5), c = b + r.int(1, 5); return [a, b, c]; }, function (s) { return s[0] + s[1] > s[2] + 1 && s[2] <= 15 && (not || []).every(function (n) { return n.join() !== s.join(); }); }, [5, 8, 12]);
  }

  /* ================= grids: moves and pictures ================= */
  function movesOf(pts) { return pts.map(function (p, i) { var q2 = pts[(i + 1) % pts.length]; return [q(q2[0] - p[0]), q(q2[1] - p[1])]; }); }
  function moveText(m, k) { k = k == null ? 1 : k; var a = []; if (m[0]) a.push(nS(Math.abs(m[0]) * k) + (m[0] > 0 ? ' right' : ' left')); if (m[1]) a.push(nS(Math.abs(m[1]) * k) + (m[1] > 0 ? ' up' : ' down')); return a.join(' and '); }
  function scalePts(pts, kx, ky) { return pts.map(function (p) { return [q(p[0] * kx), q(p[1] * (ky == null ? kx : ky))]; }); }
  function bb(pts) { var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }); return [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)]; }
  function gridPic(pts, o) {
    o = o || {}; var b = bb(pts), cols = o.cols || Math.ceil(b[2] - b[0]) + 2, rows = o.rows || Math.ceil(b[3] - b[1]) + 2;
    return G.gridSVG({ pts: pts, at: [1, 1], image: false, cols: cols, rows: rows, cell: o.cell || 20, names: o.names, width: o.width || Math.min(420, cols * (o.cell || 20) + 20) });
  }
  /* boxes for the copy's moves. which: the side indices to ask about */
  function moveFields(prompt, nm, pts, k, which, o) {
    o = o || {}; var mv = movesOf(pts), flds = [], n = pts.length, kt = kT(k);
    which.forEach(function (i) {
      var m = mv[i], a = nm[i] + '′ → ' + nm[(i + 1) % n] + '′', ax = Math.abs(m[0]), ay = Math.abs(m[1]);
      var mk = function (c, other, word) {
        var al = [{ v: c, code: 'u6l3-grid-nok', hint: 'That’s the move on the <b>original</b>. Multiply it by ' + t(kt) + '.' }];
        if (k > 1) al.push({ v: c + k, code: 'u6l3-grid-add', hint: 'Multiply the count by k; don’t add k.' }); else al.push({ v: c / k, code: 'u6l3-grid-double', hint: t('k=' + kt) + ' makes the copy <b>smaller</b>: ' + (same(k, 0.5) ? 'halve each count (divide by 2).' : 'multiply each count by ' + t(kt) + '.') });
        if (other && other !== c) al.push({ v: other * k, code: 'u6l3-grid-swap', hint: 'This box is the move <b>' + word + '</b>. Count that direction on the original.' });
        return fld(a + ' ' + word, c * k, { unit: 'squares', alts: al, name: a + ' ' + word });
      };
      if (ax) flds.push(mk(ax, ay, m[0] > 0 ? 'right' : 'left'));
      if (ay) flds.push(mk(ay, ax, m[1] > 0 ? 'up' : 'down'));
    });
    var sol = steps(['Original moves: ' + mv.map(function (m) { return moveText(m); }).join('; ') + '.', 'New moves (' + t('\\times ' + kt) + '): ' + mv.map(function (m) { return moveText(m, k); }).join('; ') + '.', o.solEnd]);
    return fieldsPart(prompt, flds, sol, ['Count the move on the original from one corner to the next: squares across, then squares up or down.', 'Multiply <b>both</b> counts by ' + t(kt) + '.'], o.text || 'grid moves');
  }
  /* which drawing is the copy? cands: [{ pts, right, code, why }] drawn on the same grid */
  function picMC(r, prompt, cands, sol, hints, text) {
    var all = []; cands.forEach(function (c) { all = all.concat(c.pts); }); var b0 = bb(cands.reduce(function (acc, c) { return acc.concat(c.pts.map(function (p) { var bc = bb(c.pts); return [p[0] - bc[0], p[1] - bc[1]]; })); }, []));
    var cols = Math.ceil(b0[2]) + 2, rows = Math.ceil(b0[3]) + 2;
    var opts = cands.map(function (c) { return { html: gridPic(c.pts, { cols: cols, rows: rows, cell: 13, width: Math.min(230, cols * 13 + 20) }), right: !!c.right, why: c.why, code: c.code }; });
    var p = P.mc(r, prompt, opts, sol, hints, text);
    p.input.columns = 2; return p;
  }

  /* ================= figures ================= */
  function polyPic(pts, o) { o = o || {}; var u = o.u || 40; return G.polygonSVG({ pts: pts.map(function (p) { return [p[0] * u, p[1] * u]; }), names: o.names, sides: o.sides, angles: o.angles, width: o.width || 280, aria: o.aria }); }
  function apex(base, A, B) { var ta = Math.tan(A * Math.PI / 180), tb = Math.tan(B * Math.PI / 180), x = base * tb / (ta + tb); return [x, x * ta]; }
  /* the projection method: O and rays through each corner. pts: [{ name, dir (degrees), d }], ext: how far to draw the rays (× d) */
  function projPic(pts, o) {
    o = o || {}; var ext = o.ext || 1.25, dmax = Math.max.apply(null, pts.map(function (p) { return p.d * Math.max(ext, 1.08); })), u = (o.px || 230) / dmax, RADN = Math.PI / 180;
    var P0 = function (dir, d) { return [d * u * Math.cos(dir * RADN), -d * u * Math.sin(dir * RADN)]; }, s = '', xs = [0], ys = [0];
    var grow = function (p) { xs.push(p[0]); ys.push(p[1]); };
    pts.forEach(function (p) { var e = P0(p.dir, p.d * Math.max(ext, 1.08)); grow(e); s += '<line x1="0" y1="0" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="#8a93a3" stroke-width="1.1" stroke-dasharray="5 4"/>'; });
    var V = pts.map(function (p) { return P0(p.dir, p.d); });
    s += '<path d="M' + V.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z" fill="#e9edf4" stroke="#1d2633" stroke-width="2.2" stroke-linejoin="round"/>';
    var c = [0, 0]; V.forEach(function (p) { c[0] += p[0] / V.length; c[1] += p[1] / V.length; });
    pts.forEach(function (p, i) {
      var v = V[i], dx = v[0] - c[0], dy = v[1] - c[1], L = Math.hypot(dx, dy) || 1, lx = v[0] + dx / L * 13, ly = v[1] + dy / L * 13; grow([lx, ly]);
      s += '<circle cx="' + v[0].toFixed(1) + '" cy="' + v[1].toFixed(1) + '" r="2.6" fill="#1d2633"/><text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" font-size="15" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#1d2633" paint-order="stroke" stroke="#fff" stroke-width="3.5" font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif">' + p.name + '</text>';
    });
    var mx = 0, my = 0; V.forEach(function (p) { var L = Math.hypot(p[0], p[1]) || 1; mx += p[0] / L; my += p[1] / L; }); var mL = Math.hypot(mx, my) || 1;
    var oc = o.oLabel || [-mx / mL * 15, -my / mL * 15]; grow([oc[0] * 1.6, oc[1] * 1.6]);
    s += '<circle cx="0" cy="0" r="3.4" fill="#c93a33"/><text x="' + oc[0] + '" y="' + oc[1] + '" font-size="15" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="#c93a33" font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif">O</text>';
    var x0 = Math.min.apply(null, xs) - 14, y0 = Math.min.apply(null, ys) - 14, w = Math.max.apply(null, xs) - x0 + 14, h = Math.max.apply(null, ys) - y0 + 14;
    return '<svg class="fig-svg" viewBox="' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || 360, w * 1.4)) + 'px" role="img" aria-label="the projection method: rays from O through each corner">' + s + '</svg>';
  }
  /* a projection question: names, distances; k. Returns the stem picture + the fields */
  function projFields(prompt, nm, ds, k, o) {
    o = o || {}; var kt = kT(k);
    var flds = nm.map(function (L, i) {
      var al = [{ v: ds[i] + k, code: 'u6l3-proj-add', hint: 'Multiply the distance from O by k: ' + t('O' + L + "'=k\\times O" + L) + '.' }];
      if (k > 1) al.push({ v: ds[i] * k + ds[i], code: 'u6l3-from-a', hint: 'Measure ' + t('O' + L + "'") + ' from <b>O</b>, not from ' + L + ': ' + t('O' + L + "'=" + nS(k) + '\\times O' + L) + '.' }, { v: ds[i] / k, code: 'u6l3-div-k', hint: 'k > 1: the new corner is <b>farther</b> from O. Multiply by k.' });
      else al.push({ v: ds[i] / k, code: 'u6l3-proj-frac', hint: t('k=' + kt) + ' is a <b>reduction</b>: the new corner is closer to O. Multiply by ' + t(kt) + ' (' + (same(k, 0.5) ? 'halve the distance' : 'divide by ' + nS(rd(1 / k, 3))) + ').' }, { v: ds[i] - ds[i] * k, code: 'u6l3-from-a', hint: 'That’s how far ' + L + '′ is from ' + L + '. The box asks for the distance from <b>O</b>.' });
      return fld(t('O' + L + "'="), ds[i] * k, { unit: 'cm', alts: al, name: 'O' + L + '′' });
    });
    var sol = steps(nm.map(function (L, i) { return t('O' + L + '=' + nS(ds[i]) + '\\text{ cm}\\ \\to\\ O' + L + "'=" + kt + '\\times ' + nS(ds[i]) + '=' + nS(ds[i] * k) + '\\text{ cm}'); }).concat(['Mark each new corner on its own ray, that far from O, and join them in the same order.']));
    return fieldsPart(prompt, flds, sol, ['Each new corner is on the same ray: ' + t("OA'=k\\times OA") + '.', k > 1 ? 'k > 1: the new corners are past the old ones.' : 'k < 1: the new corners are between O and the old ones.'], o.text || 'projection');
  }
  function midMax(d) { var i = d.indexOf(Math.max.apply(null, d)), x = d[1]; d[1] = d[i]; d[i] = x; return d; }   // the middle ray's corner is the farthest: a fat triangle
  function dirsFor(r, n, inside) {
    if (inside) { var s0 = r.int(0, 359), gaps = n === 5 ? [70, 70, 70, 75, 75] : [90, 90, 90, 90]; return gaps.map(function (g, i) { return (s0 + gaps.slice(0, i).reduce(function (a, b) { return a + b; }, 0) + r.int(-8, 8)) % 360; }); }
    var base = r.pick([0, 0, 180, 20, 160, -20]), spread = n === 3 ? [36, 0, -36] : [33, 12, -12, -33];
    return spread.map(function (d) { return base + d + r.int(-4, 4); });
  }

  /* shared with Lesson 6.4 (u6l4.js), which loads after this file */
  HW.u6draw = { q: q, rd: rd, same: same, nS: nS, decs: decs, trunc: trunc, find: find, cm: cm, T: T, dg: dg, steps: steps, an: an, row: row, table: table, readN: readN, numC: numC, keyOf: keyOf, badOf: badOf, showV: showV,
    num: num, fld: fld, kChkX: kChkX, kFld: kFld, kPart: kPart, fieldsPart: fieldsPart, TYPE_COLS: TYPE_COLS };

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u6l3', unit: 6, num: '3', title: 'Drawing Enlargements and Reductions', outcome: 'G3',
    blurb: 'Multiply every length by k and keep every angle: copies in tables, the grid method, ruler-and-protractor copies, the projection method, photo prints and posters, and checking a copy.',
    questions: [
      /* ---- Q1: enlargement, reduction or same size ---- */
      { num: '1', stem: 'Is each copy an enlargement, a reduction or the same size?', parts: [
        { id: '1a', sub: 'a–f', level: 'BEG', make: function (r) { return typeGrid('Choose one for each scale factor.', typeKs(r), true); } }] },

      /* ---- Q2: the triangle table ---- */
      { num: '2', stem: function (sh) { return 'A triangle has sides of ' + cm(sh.s[0]) + ', ' + cm(sh.s[1]) + ' and ' + cm(sh.s[2]) + ', and one angle of ' + sh.ang + '°. Complete the table for each similar copy.'; },
        shared: function (r) { return { s: triSides(r), ang: find(function () { return r.int(35, 80); }, function (a) { return a !== 75; }, 48) }; },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) { return copyTable('Fill in the rows for these two copies.', sh.s, sh.ang, [r.pick([2, 3, 4]), 0.5]); } },
          { id: '2b', level: 'EMG', make: function (r, sh) { return copyTable('Fill in the rows for these two copies.', sh.s, sh.ang, [r.pick([1.5, 2.5, 1.2]), r.pick([0.2, 0.25, 0.1])], { hints: ['New length = original length × k (use your calculator for the decimals).', 'Every angle stays the same size.'] }); } }] },

      /* ---- Q3: adding is not multiplying ---- */
      { num: '3', stem: function (sh) { return 'A rectangle is ' + cm(sh.w) + ' by ' + cm(sh.l) + '. Leon adds ' + cm(sh.d) + ' to each side to get ' + an(sh.w + sh.d) + ' ' + cm(sh.w + sh.d) + ' by ' + cm(sh.l + sh.d) + ' rectangle.'; },
        shared: function (r) {
          return find(function () { var w = r.int(3, 9), l = w + r.int(2, 7), d = r.int(2, 6), k2 = r.pick([1.5, 2, 2.5, 0.5, 3, 1.2]); return { w: w, l: l, d: d, k2: k2, L2: q(l * k2), W2: q(w * k2) }; },
            function (s) { return decs(s.W2) <= 1 && decs(s.L2) <= 1 && !same(s.L2, s.l + s.d) && !same(s.L2, s.l) && !(s.w === 2 && s.l === 4) && Math.abs((s.w + s.d) / s.w - (s.l + s.d) / s.l) > 0.05; }, { w: 6, l: 10, d: 4, k2: 1.5, L2: 15, W2: 9 });
        },
        parts: [
          { id: '3a', sub: 'a i', level: 'EMG', make: function (r, sh) {
            var r1 = (sh.w + sh.d) / sh.w, r2 = (sh.l + sh.d) / sh.l;
            return fieldsPart('Divide matching sides (Leon’s ÷ the first one). Round to the nearest hundredth.', [
              fld('Short sides: ' + t(nS(sh.w + sh.d) + '\\div ' + sh.w + '='), r1, { dp: 2, name: 'Short sides', alts: [{ v: sh.w / (sh.w + sh.d), code: 'u6l3-ratio-flip', hint: 'Divide Leon’s side by the first side (new ÷ old).' }, { v: sh.d, code: 'u6l3-ratio-diff', hint: 'Divide, don’t subtract.' }] }),
              fld('Long sides: ' + t(nS(sh.l + sh.d) + '\\div ' + sh.l + '='), r2, { dp: 2, name: 'Long sides', alts: [{ v: sh.l / (sh.l + sh.d), code: 'u6l3-ratio-flip', hint: 'Divide Leon’s side by the first side (new ÷ old).' }, { v: sh.d, code: 'u6l3-ratio-diff', hint: 'Divide, don’t subtract.' }] })],
              steps([t(nS(sh.w + sh.d) + '\\div ' + sh.w + (same(r1, rd(r1, 2)) ? '=' : '\\approx ') + nS(rd(r1, 2))) + ' and ' + t(nS(sh.l + sh.d) + '\\div ' + sh.l + (same(r2, rd(r2, 2)) ? '=' : '\\approx ') + nS(rd(r2, 2))), 'The two numbers are different.']),
              ['Divide each side of Leon’s rectangle by the matching side of the first one.'], 'Leon ratios');
          } },
          { id: '3a2', sub: 'a ii', level: 'EMG', make: function (r, sh) {
            var r1 = rd((sh.w + sh.d) / sh.w, 2), r2 = rd((sh.l + sh.d) / sh.l, 2);
            return P.mc(r, 'Is Leon’s rectangle similar to the first one?', [
              { html: '<b>No.</b> The short sides grew by ×' + nS(r1) + ' but the long sides by ×' + nS(r2) + '. The sides were not multiplied by the same number.', right: true },
              { html: '<b>Yes.</b> The same amount (' + cm(sh.d) + ') was added to every side, so the shape stays the same.', why: 'Adding the same amount changes the shape: the short sides grow by a bigger fraction. Divide matching sides and compare.', code: 'u6l3-add-sim' },
              { html: '<b>Yes.</b> Both are rectangles, and all their angles are 90°.', why: 'Equal angles are not enough: the matching sides must also be in the same ratio.', code: 'u6l3-angles-only' },
              { html: '<b>No.</b> Leon’s rectangle is bigger than the first one.', why: 'A similar copy can be bigger (an enlargement). The question is whether every side was multiplied by the same number.', code: 'u6l3-bigger' }],
              'Short sides: ×' + nS(r1) + '. Long sides: ×' + nS(r2) + '.<br>The numbers are different, so the rectangles are <b>not</b> similar. Leon added; he should have multiplied.', ['Look at your two answers to (a) i.'], 'Leon verdict');
          } },
          { id: '3b', sub: 'b', level: 'PRG', make: function (r, sh) {
            return num('Find the short side of a similar rectangle whose long side is ' + cm(sh.L2) + '.', sh.W2, { unit: 'cm', alts: [{ v: sh.w + sh.L2 - sh.l, code: 'u6l3-prop-add', hint: 'Find the scale factor first (' + t('k=' + nS(sh.L2) + '\\div ' + sh.l) + ') and <b>multiply</b> the short side by it. Adding the difference changes the shape.' },
              { v: sh.w * sh.l / sh.L2, code: 'u6l3-prop-flip', hint: 'Check k: new ÷ original = ' + t(nS(sh.L2) + '\\div ' + sh.l) + '.' }, { v: sh.L2 / sh.w, code: 'u6l3-prop-flip', hint: 'Divide the new long side by the old <b>long</b> side to get k, then multiply the short side by k.' }, { v: sh.k2, code: 'u6l3-prop-flip', hint: 'That’s the scale factor. Now multiply the short side by it.' }],
              sol: steps([t('k=' + nS(sh.L2) + '\\div ' + sh.l + '=' + nS(sh.k2)), 'Short side: ' + t(sh.w + '\\times ' + nS(sh.k2) + '=' + nS(sh.W2)) + ' cm.', 'The rectangle is ' + cm(sh.W2) + ' by ' + cm(sh.L2) + '.']), hints: ['Find k from the long sides: k = new ÷ original.', 'Multiply the short side by k.'], text: 'similar rectangle' });
          } }] },

      /* ---- Q4: grid enlargement of a trapezoid (k = 2) ---- */
      { num: '4', stem: function (sh) { return 'Draw an enlargement of trapezoid ABCD with ' + t('k=2') + '. Start at A′.' + gridPic(sh.pts, { names: ['ABCD'], cell: 22 }); },
        shared: function (r) {
          return find(function () { var w = r.int(4, 7), a1 = r.int(0, 2), a2 = r.int(1, 2), h = r.int(2, 4); return { w: w, a1: a1, a2: a2, h: h, pts: [[0, 0], [w, 0], [w - a2, h], [a1, h]] }; },
            function (s) { return s.w - s.a1 - s.a2 >= 2 && !(s.w === 4 && s.a1 === 0); }, { w: 5, a1: 1, a2: 1, h: 3, pts: [[0, 0], [5, 0], [4, 3], [1, 3]] });
        },
        parts: [
          { id: '4a', sub: 'i', level: 'EMG', make: function (r, sh) { return moveFields('Fill in the moves on the copy, going round from A′.', 'ABCD'.split(''), sh.pts, 2, [0, 1, 2, 3], { solEnd: 'Check: the last move lands back on A′ ✓.' }); } },
          { id: '4b', sub: 'ii', level: 'EMG', make: function (r, sh) {
            var s = sh, c = [{ pts: scalePts(s.pts, 2), right: true }, { pts: scalePts(s.pts, 2, 1), code: 'u6l3-pic-x', why: 'In this one only the moves <b>across</b> were doubled: it is no taller than the original. Multiply the up/down moves too.' },
              { pts: scalePts(s.pts, 1, 2), code: 'u6l3-pic-y', why: 'In this one only the moves <b>up and down</b> were doubled. Its bottom is still ' + s.w + ' squares.' },
              { pts: [[0, 0], [2 * s.w, 0], [2 * s.w - s.a2, 2 * s.h], [s.a1, 2 * s.h]], code: 'u6l3-pic-slant', why: 'Check a slanted side: the move across must be doubled too (' + s.a2 + ' left becomes ' + 2 * s.a2 + ' left).' }];
            return picMC(r, 'Which drawing is the enlargement with ' + t('k=2') + '?', c, 'Every move is doubled: the bottom is ' + 2 * s.w + ' squares, the top ' + 2 * (s.w - s.a1 - s.a2) + ' squares and the height ' + 2 * s.h + ' squares. The slanted sides go ' + 2 * s.a2 + ' across for ' + 2 * s.h + ' up.', ['Count the bottom, the top and the height of each drawing. Each must be twice the original.'], 'grid picture');
          } }] },

      /* ---- Q5: grid reduction of a shield (k = ½) ---- */
      { num: '5', stem: function (sh) { return 'A hockey team’s crest is a shield. Draw a reduction of the shield with ' + t('k=\\frac{1}{2}') + '. Start at A′.' + gridPic(sh.pts, { names: ['ABCDE'], cell: 20 }); },
        shared: function (r) {
          var Wd = r.pick([8, 8, 12, 4]), S = r.pick([2, 4, 6]), Pd = r.pick([2, 4]);
          return { W: Wd, S: S, Pd: Pd, pts: [[0, S + Pd], [Wd, S + Pd], [Wd, Pd], [Wd / 2, 0], [0, Pd]] };
        },
        parts: [
          { id: '5a', sub: 'i', level: 'EMG', make: function (r, sh) { return moveFields('Fill in the first three moves on the copy, going round from A′. (The other two are mirror images.)', 'ABCDE'.split(''), sh.pts, 0.5, [0, 1, 2], { solEnd: 'Check: halving every move brings you back to A′ ✓.' }); } },
          { id: '5b', sub: 'ii', level: 'EMG', make: function (r, sh) {
            var s = sh, c = [{ pts: scalePts(s.pts, 0.5), right: true }, { pts: scalePts(s.pts, 0.5, 1), code: 'u6l3-pic-x', why: 'Only the moves <b>across</b> were halved here: it is as tall as the original. Halve the up/down moves too.' },
              { pts: scalePts(s.pts, 1, 0.5), code: 'u6l3-pic-y', why: 'Only the moves <b>up and down</b> were halved here. It is still ' + s.W + ' squares wide.' },
              { pts: [[0, s.S / 2 + s.Pd], [s.W / 2, s.S / 2 + s.Pd], [s.W / 2, s.Pd], [s.W / 4, 0], [0, s.Pd]], code: 'u6l3-pic-slant', why: 'Look at the point of the shield: its slanted moves must be halved too (' + s.Pd + ' down becomes ' + s.Pd / 2 + ' down).' }];
            return picMC(r, 'Which drawing is the reduction with ' + t('k=\\frac{1}{2}') + '?', c, 'Every move is halved: the top is ' + s.W / 2 + ' squares, the straight sides ' + s.S / 2 + ' squares, and the point goes ' + s.W / 4 + ' across and ' + s.Pd / 2 + ' down on each side.', ['Count the width, the straight sides and the point of each drawing. Each must be half of the original.'], 'grid picture');
          } }] },

      /* ---- Q6: ruler and protractor: triangle XYZ ---- */
      { num: '6', stem: function (sh) { return 'Ana measured ' + t('\\triangle XYZ') + ' (the sketch is not to scale): ' + t('YZ=' + nS(sh.b) + '\\text{ cm}') + ', ' + t('\\angle Y=' + sh.Y + '^\\circ') + ' and ' + t('\\angle Z=' + sh.Z + '^\\circ') + '. She draws an enlargement ' + t("\\triangle X'Y'Z'") + ' with ' + t('k=' + sh.k) + '.' +
          polyPic([[0, 0], [sh.b, 0], apex(sh.b, sh.Y, sh.Z)], { names: ['Y', 'Z', 'X'], sides: [cm(sh.b), '', ''], angles: [sh.Y, sh.Z, ''], u: 150 / sh.b / Math.max(1, apex(sh.b, sh.Y, sh.Z)[1] / sh.b * 1.2), width: 260 }); },
        shared: function (r) { return find(function () { return { b: r.pick([2.5, 3, 3.5, 4.5, 5, 2]), Y: r.int(32, 62), Z: r.int(45, 80), k: r.pick([2, 2, 3, 1.5]) }; }, function (s) { return 180 - s.Y - s.Z >= 40 && !(s.Y === 55 && s.Z === 65) && Math.abs(s.Y - s.Z) >= 8; }, { b: 3, Y: 40, Z: 75, k: 2 }); },
        parts: [
          { id: '6a', sub: 'a–b', level: 'BEG', make: function (r, sh) {
            return fieldsPart('What does she draw for the new side and the two angles at its ends?', [
              fld(t("Y'Z'="), sh.b * sh.k, { unit: 'cm', alts: lenAlts(sh.b, sh.k), name: 'Y′Z′' }), fld(t("\\angle Y'="), sh.Y, { unit: '°', alts: angAlts(sh.Y, sh.k), name: '∠Y′' }), fld(t("\\angle Z'="), sh.Z, { unit: '°', alts: angAlts(sh.Z, sh.k), name: '∠Z′' })],
              steps([t("Y'Z'=" + nS(sh.b) + '\\times ' + sh.k + '=' + nS(sh.b * sh.k)) + ' cm', 'Copy the angles: ' + t("\\angle Y'=" + sh.Y + '^\\circ') + ' and ' + t("\\angle Z'=" + sh.Z + '^\\circ') + '. The arms meet at X′.']),
              ['Multiply the side by k.', 'Angles stay the same.'], 'ruler and protractor copy');
          } },
          { id: '6c', sub: 'c', level: 'EMG', make: function (r, sh) {
            var X = 180 - sh.Y - sh.Z, al = [{ v: 180 - sh.Y, code: 'u6l3-angle-sum', hint: 'The three angles of a triangle add to 180°: subtract <b>both</b> known angles.' }, { v: 180 - sh.Z, code: 'u6l3-angle-sum', hint: 'The three angles of a triangle add to 180°: subtract <b>both</b> known angles.' }, { v: sh.Y + sh.Z, code: 'u6l3-angle-sum', hint: 'That’s ∠Y + ∠Z. Subtract it from 180°.' }];
            return fieldsPart('What should ' + t('\\angle X') + ' and ' + t("\\angle X'") + ' measure?', [fld(t('\\angle X='), X, { unit: '°', alts: al, name: '∠X' }), fld(t("\\angle X'="), X, { unit: '°', alts: al.concat(angAlts(X, sh.k)), name: '∠X′' })],
              steps([t('\\angle X=180^\\circ-' + sh.Y + '^\\circ-' + sh.Z + '^\\circ=' + X + '^\\circ'), t("\\angle X'=" + X + '^\\circ') + ' too: they are equal, because angles don’t change in a similar copy.']), ['The angles of a triangle add to 180°.', 'Matching angles of similar figures are equal.'], 'third angle');
          } }] },

      /* ---- Q7: parallelogram, k = 0.75 ---- */
      { num: '7', stem: function (sh) { var a = sh.th * Math.PI / 180, top = [sh.b * Math.cos(a), sh.b * Math.sin(a)]; return 'A sketch of a parallelogram is shown (not to scale). Draw a reduction of it with ' + t('k=' + nS(sh.k)) + '.' + polyPic([[0, 0], [sh.a, 0], [sh.a + top[0], top[1]], top], { sides: [cm(sh.a), '', '', cm(sh.b)], angles: [sh.th, '', '', ''], u: 210 / (sh.a + top[0]), width: 280 }); },
        shared: function (r) { return find(function () { return { a: r.int(5, 9), b: r.int(3, 5), th: r.pick([55, 60, 65, 70, 75, 80, 50]), k: r.pick([0.75, 0.75, 0.5, 0.25]) }; }, function (s) { return s.b < s.a && decs(s.a * s.k) <= 2 && decs(s.b * s.k) <= 2; }, { a: 6, b: 4, th: 70, k: 0.75 }); },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) {
            var o = 180 - sh.th;
            return fieldsPart('Label your copy: the two side lengths and the two different angles.', [
              fld('Bottom side:', sh.a * sh.k, { unit: 'cm', alts: lenAlts(sh.a, sh.k), name: 'Bottom side' }), fld('Slanted side:', sh.b * sh.k, { unit: 'cm', alts: lenAlts(sh.b, sh.k), name: 'Slanted side' }),
              fld('The ' + sh.th + '° angle:', sh.th, { unit: '°', alts: angAlts(sh.th, sh.k), name: sh.th + '° angle' }),
              fld('The other angle:', o, { unit: '°', alts: angAlts(o, sh.k).concat([{ v: sh.th, code: 'u6l3-para-same', hint: 'Neighbouring angles of a parallelogram add to 180°: the other angle is ' + t('180^\\circ-' + sh.th + '^\\circ') + '.' }, { v: 360 - 2 * sh.th, code: 'u6l3-angle-sum', hint: 'There are <b>two</b> of each angle: the four add to 360°. Neighbouring angles add to 180°.' }]), name: 'Other angle' })],
              steps([t(nS(sh.a) + '\\times ' + nS(sh.k) + '=' + nS(sh.a * sh.k)) + ' cm and ' + t(nS(sh.b) + '\\times ' + nS(sh.k) + '=' + nS(sh.b * sh.k)) + ' cm.', 'Angles stay ' + dg(sh.th) + ' and ' + t('180^\\circ-' + sh.th + '^\\circ=' + o + '^\\circ') + '.']),
              ['Multiply each side by k.', 'The angles don’t change. Neighbouring angles of a parallelogram add to 180°.'], 'parallelogram copy');
          } }] },

      /* ---- Q8: projection enlargement, k = 2 ---- */
      { num: '8', stem: function (sh) { return 'Ana is drawing an enlargement of ' + t('\\triangle ABC') + ' with centre O and ' + t('k=' + sh.k) + '. She measured ' + sh.nm.map(function (L, i) { return t('O' + L + '=' + nS(sh.ds[i]) + '\\text{ cm}' + (i < sh.nm.length - 1 ? ',' : '')); }).join(' ') + '.' + projPic(sh.nm.map(function (L, i) { return { name: L, dir: sh.dirs[i], d: sh.ds[i] }; }), { ext: sh.k + 0.2 }); },
        shared: function (r) { var ds = midMax(r.sample([1, 1.2, 1.5, 1.8, 2, 2.4, 2.5, 3], 3)), k = r.pick([2, 2, 3]); return { nm: ['A', 'B', 'C'], ds: ds, k: k, dirs: dirsFor(r, 3) }; },
        parts: [{ id: '8a', level: 'BEG', make: function (r, sh) { return projFields('How far from O is each new corner?', sh.nm, sh.ds, sh.k); } }] },

      /* ---- Q9: projection reduction, k = ½ ---- */
      { num: '9', stem: function (sh) { return 'Ana is drawing a reduction of quadrilateral EFGH with centre O and ' + t('k=' + kT(sh.k)) + '. She measured ' + sh.nm.map(function (L, i) { return t('O' + L + '=' + nS(sh.ds[i]) + '\\text{ cm}' + (i < sh.nm.length - 1 ? ',' : '')); }).join(' ') + '.' + projPic(sh.nm.map(function (L, i) { return { name: L, dir: sh.dirs[i], d: sh.ds[i] }; }), { ext: 1.08 }); },
        shared: function (r) {
          var k = r.pick([0.5, 0.5, 0.25]), pool = k === 0.5 ? [3, 4, 5, 6, 7, 3.6, 4.4, 5.2] : [4, 6, 8, 5, 7, 6.4];
          var ds = find(function () { return r.sample(pool, 4); }, function (d) { return d[3] < d[0] && d[3] < d[2] && d[1] > d[0] && d[1] > d[2]; }, [4, 6, 5, 3]);
          var base = r.pick([180, 180, 0]), dirs = [-20, -5, 15, 5].map(function (x) { return base + x + r.int(-3, 3); });
          return { nm: ['E', 'F', 'G', 'H'], ds: ds, k: k, dirs: dirs };
        },
        parts: [{ id: '9a', level: 'EMG', make: function (r, sh) { return projFields('How far from O is each new corner?', sh.nm, sh.ds, sh.k); } }] },

      /* ---- Q10: Amir measures from the wrong place ---- */
      { num: '10', stem: function (sh) { return 'Amir uses the projection method with ' + t('k=' + sh.k) + '. Corner A is ' + cm(sh.d) + ' from O. He marks A′ on the ray, ' + cm(sh.d * sh.k) + ' <em>past</em> A.'; },
        shared: function (r) { return { k: r.pick([3, 2, 4, 3]), d: r.pick([2.5, 1.5, 2, 3, 1.2, 1.6]) }; },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Is he right?', [
              { html: '<b>No.</b> ' + t("OA'=" + sh.k + '\\times OA') + ' must be measured from <b>O</b>, not from A. His point is too far from O.', right: true },
              { html: '<b>Yes.</b> ' + t(sh.k + '\\times ' + nS(sh.d) + '=' + nS(sh.k * sh.d)) + ', so A′ goes ' + cm(sh.k * sh.d) + ' along the ray past A.', why: 'The distance ' + t("OA'") + ' is measured from O. Starting at A adds an extra ' + cm(sh.d) + '.', code: 'u6l3-amir-yes' },
              { html: '<b>No.</b> For an enlargement, A′ goes between O and A.', why: 'k > 1 is an enlargement: the new corner is <b>past</b> A. The mistake is where he measured from.', code: 'u6l3-amir-between' },
              { html: '<b>Yes.</b> In the projection method you always measure from the old corner.', why: 'You always measure from the centre O: ' + t("OA'=k\\times OA") + '.', code: 'u6l3-amir-yes' }],
              'No. ' + t("OA'=" + sh.k + '\\times ' + nS(sh.d) + '=' + nS(sh.k * sh.d)) + ' cm, measured <b>from O</b>, not from A.', ['Read the rule: ' + t("OA'=k\\times OA") + '. Where does the distance start?'], 'Amir');
          } },
          { id: '10b', level: 'PRG', make: function (r, sh) {
            var far = sh.d + sh.k * sh.d;
            return fieldsPart('How far from O is his point really, and what scale factor did he really use?', [
              fld('Distance from O:', far, { unit: 'cm', name: 'Distance from O', alts: [{ v: sh.k * sh.d, code: 'u6l3-from-a', hint: 'That’s where A′ <b>should</b> be. He started at A, ' + cm(sh.d) + ' from O, then went ' + cm(sh.k * sh.d) + ' more.' }, { v: sh.k * sh.d - sh.d, code: 'u6l3-from-a', hint: 'He went ' + cm(sh.k * sh.d) + ' <b>past</b> A. Add the ' + cm(sh.d) + ' from O to A.' }] }),
              fld('He really used ' + t('k='), sh.k + 1, { name: 'Real k', alts: [{ v: sh.k, code: 'u6l3-amir-k', hint: 'Divide his distance from O by ' + t('OA=' + nS(sh.d)) + ': that is the scale factor he really used.' }, { v: far, code: 'u6l3-amir-k', hint: 'k is a ratio: (his distance from O) ÷ OA.' }] })],
              steps(['His point is ' + t(nS(sh.d) + '+' + nS(sh.k * sh.d) + '=' + nS(far)) + ' cm from O.', 'That is ' + t(nS(far) + '\\div ' + nS(sh.d) + '=' + nS(sh.k + 1)) + ' times as far, so he really used ' + t('k=' + nS(sh.k + 1)) + '.']),
              ['He started at A, which is already ' + cm(sh.d) + ' from O.', 'Real k = (his distance from O) ÷ OA.'], 'Amir real k');
          } }] },

      /* ---- Q11: Kalani's deck plan ---- */
      { num: '11', stem: function (sh) { return 'Kalani draws a plan of a deck. On her drawing, the deck is ' + cm(sh.L) + ' by ' + cm(sh.W) + '. The builder uses a scale factor of ' + sh.k + ' to build it.'; },
        shared: function (r) { return find(function () { return { L: r.pick([5, 5.5, 6, 6.5, 7, 7.5, 8]), W: r.pick([3, 3.5, 4, 4.5, 5]), k: r.pick([80, 80, 50, 60, 40, 120]), s: r.pick([1.2, 1, 1.5, 0.8, 2, 1.4]) }; }, function (s) { return s.W < s.L - 0.5; }, { L: 6, W: 4.5, k: 80, s: 1.2 }); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var Lc = sh.L * sh.k, Wc = sh.W * sh.k;
            var mAl = function (c, x) { return [{ v: c, code: 'u6l3-cm-m', hint: 'That’s the length in <b>centimetres</b>. Divide by 100 to change cm to m.' }, { v: c / 1000, code: 'u6l3-cm-m-1000', hint: '1 m = <b>100</b> cm, so divide by 100.' }, { v: x / sh.k, code: 'u6l3-div-k', hint: 'The real deck is bigger: multiply the drawing’s length by ' + sh.k + '.' }]; };
            var cAl = function (x) { return [{ v: x / sh.k, code: 'u6l3-div-k', hint: 'The real deck is bigger: multiply by ' + sh.k + '.' }, { v: x * sh.k / 100, code: 'u6l3-cm-m', hint: 'That’s in metres. This box is in centimetres.' }, { v: x + sh.k, code: 'u6l3-add-k', hint: 'Multiply by the scale factor.' }]; };
            return fieldsPart('What are the real length and width of the deck, in centimetres and in metres?', [
              fld('Length:', Lc, { unit: 'cm', alts: cAl(sh.L), name: 'Length (cm)' }), fld('Length:', Lc / 100, { unit: 'm', alts: mAl(Lc, sh.L), name: 'Length (m)' }),
              fld('Width:', Wc, { unit: 'cm', alts: cAl(sh.W), name: 'Width (cm)' }), fld('Width:', Wc / 100, { unit: 'm', alts: mAl(Wc, sh.W), name: 'Width (m)' })],
              steps([t(nS(sh.L) + '\\times ' + sh.k + '=' + nS(Lc) + '\\text{ cm}=' + nS(Lc / 100) + '\\text{ m}'), t(nS(sh.W) + '\\times ' + sh.k + '=' + nS(Wc) + '\\text{ cm}=' + nS(Wc / 100) + '\\text{ m}'), 'The deck is ' + cm(Lc / 100, 'm') + ' by ' + cm(Wc / 100, 'm') + '.']),
              ['Multiply each drawing length by the scale factor: the answer is in cm.', 'To change cm to m, divide by 100.'], 'deck plan');
          } },
          { id: '11b', level: 'BEG', make: function (r, sh) {
            return num('The steps on the drawing are ' + cm(sh.s) + ' wide. How wide are the real steps?', sh.s * sh.k, { unit: 'cm', alts: [{ v: sh.s / sh.k, code: 'u6l3-div-k', hint: 'The real steps are bigger: multiply by ' + sh.k + '.' }, { v: sh.s * sh.k / 100, code: 'u6l3-cm-m', hint: 'That’s in metres. This box is in centimetres.' }, { v: sh.s + sh.k, code: 'u6l3-add-k', hint: 'Multiply by the scale factor.' }],
              sol: t(nS(sh.s) + '\\times ' + sh.k + '=' + nS(sh.s * sh.k)) + ' cm. The real steps are ' + cm(sh.s * sh.k) + ' wide.', hints: ['Real length = drawing length × the scale factor.'], text: 'steps' });
          } }] },

      /* ---- Q12: Owen's photo ---- */
      { num: '12', stem: function (sh) { return 'Owen has a ' + sh.p + ' in by ' + sh.r + ' in photo of his dog.'; },
        shared: function (r) {
          var FR = [[8, 10], [11, 14], [12, 18], [16, 20], [11, 17], [8, 12], [20, 24], [12, 16]];
          return find(function () { var ph = r.pick([[5, 7], [3, 5], [4, 5], [5, 8], [3, 4], [6, 8]]), F = r.pick(FR), k1 = r.pick([2, 3]); return { p: ph[0], r: ph[1], k1: k1, F1: F[0], F2: F[1], kA: F[0] / ph[0], kB: F[1] / ph[1] }; },
            function (s) { var kf = Math.min(s.kA, s.kB); return s.kA >= 1.4 && s.kB >= 1.4 && Math.abs(s.kA - s.kB) > 0.05 && same(kf, rd(kf, 2)) && decs(s.p * kf) <= 2 && decs(s.r * kf) <= 2 && !(s.p * s.k1 === s.F1 && s.r * s.k1 === s.F2); }, { p: 5, r: 7, k1: 2, F1: 11, F2: 14, kA: 2.2, kB: 2 });
        },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, sh) {
            return fieldsPart('What size is an enlargement with ' + t('k=' + sh.k1) + '?', [fld('Short side:', sh.p * sh.k1, { unit: 'in', alts: lenAlts(sh.p, sh.k1), name: 'Short side' }), fld('Long side:', sh.r * sh.k1, { unit: 'in', alts: lenAlts(sh.r, sh.k1), name: 'Long side' })],
              t(sh.p + '\\times ' + sh.k1 + '=' + sh.p * sh.k1) + ' and ' + t(sh.r + '\\times ' + sh.k1 + '=' + sh.r * sh.k1) + '. The print is ' + sh.p * sh.k1 + ' in by ' + sh.r * sh.k1 + ' in.', ['Multiply both sides by k.'], 'photo enlargement');
          } },
          { id: '12b', level: 'EMG', make: function (r, sh) {
            var a = rd(sh.kA, 2), b = rd(sh.kB, 2), ea = same(a, sh.kA) ? '=' : '\\approx ', eb = same(b, sh.kB) ? '=' : '\\approx ';
            return P.mc(r, 'Is ' + an(sh.F1) + ' ' + sh.F1 + ' in by ' + sh.F2 + ' in print similar to the photo?', [
              { html: '<b>No.</b> ' + t(sh.F1 + '\\div ' + sh.p + ea + nS(a)) + ' but ' + t(sh.F2 + '\\div ' + sh.r + eb + nS(b)) + '. Different numbers, so part of the photo would be cropped.', right: true },
              { html: '<b>Yes.</b> Both are standard photo sizes, so they match.', why: 'Standard print sizes are <b>not</b> all similar. Divide matching sides and compare.', code: 'u6l3-standard' },
              { html: '<b>Yes.</b> The print is bigger in both directions, so it is an enlargement.', why: 'Bigger in both directions isn’t enough: both sides must be multiplied by the <b>same</b> number.', code: 'u6l3-bigger' },
              { html: '<b>No.</b> A similar print must be exactly ' + sh.k1 + ' times as big.', why: 'Any scale factor can make a similar copy. What matters is that both sides use the same one.', code: 'u6l3-print-k2' }],
              t(sh.F1 + '\\div ' + sh.p + ea + nS(a)) + ' but ' + t(sh.F2 + '\\div ' + sh.r + eb + nS(b)) + '.<br>Different numbers, so it is not similar. Part of the photo would be cropped.', ['Divide each side of the print by the matching side of the photo.'], 'print similar?');
          } },
          { id: '12c', level: 'MAS', make: function (r, sh) {
            var kf = Math.min(sh.kA, sh.kB), kb = Math.max(sh.kA, sh.kB), small = sh.kA < sh.kB ? 'short' : 'long';
            var bigAl = function (side) { return [{ v: side * kb, code: 'u6l3-fit-big', hint: 'With ' + t('k=' + nS(rd(kb, 2))) + ' the other side would be too long for the opening. Use the <b>smaller</b> k.' }]; };
            return fieldsPart('He wants the largest similar print that fits in a frame with ' + an(sh.F1) + ' ' + sh.F1 + ' in by ' + sh.F2 + ' in opening. Find ' + t('k') + ' and the size of the print.', [
              kFld(null, kf, [{ v: kb, code: 'u6l3-fit-big', hint: 'With the larger k, one side of the print would not fit. Find k for both directions and use the <b>smaller</b> one.' }]),
              fld('Short side:', sh.p * kf, { unit: 'in', alts: bigAl(sh.p), name: 'Short side' }), fld('Long side:', sh.r * kf, { unit: 'in', alts: bigAl(sh.r), name: 'Long side' })],
              steps(['Short sides: ' + t(sh.F1 + '\\div ' + sh.p + (same(sh.kA, rd(sh.kA, 2)) ? '=' : '\\approx ') + nS(rd(sh.kA, 2))) + '. Long sides: ' + t(sh.F2 + '\\div ' + sh.r + (same(sh.kB, rd(sh.kB, 2)) ? '=' : '\\approx ') + nS(rd(sh.kB, 2))) + '.', 'Use the smaller: ' + t('k=' + nS(kf)) + ' (the ' + small + ' sides fill the frame).',
                'Print: ' + t(sh.p + '\\times ' + nS(kf) + '=' + nS(sh.p * kf)) + ' in by ' + t(sh.r + '\\times ' + nS(kf) + '=' + nS(sh.r * kf)) + ' in.']),
              ['Find k both ways: opening ÷ photo, for the short sides and for the long sides.', 'Use the smaller k, so the whole picture fits.'], 'largest print');
          } }] },

      /* ---- Q13: Sam's mistakes ---- */
      { num: '13', stem: function (sh) { return 'Sam was asked to draw ' + (sh.k < 1 ? 'a reduction' : 'an enlargement') + ' of quadrilateral PQRS with ' + t('k=' + nS(sh.k)) + '. Here are his measurements.' + table(['', 'PQ', 'QR', 'RS', 'SP', '∠P'], [['Original'].concat(sh.o.map(function (x) { return cm(x); }), [sh.ang + '°']), ['Sam’s copy'].concat(sh.c.map(function (x) { return cm(x); }), [sh.cAng + '°'])]); },
        shared: function (r) {
          return find(function () {
            var k = r.pick([0.5, 0.5, 2, 1.5]), o = [r.int(5, 10), r.int(4, 8), r.int(3, 7), r.pick([7.4, 8.2, 9.4, 6.8, 10.6])], ang = r.pick([70, 75, 80, 85, 100, 105, 110]), bad = r.int(0, 3);
            var c = o.map(function (x) { return q(x * k); }), wrongV = q(c[bad] + r.pick([1, -1, 0.5]) * (k < 1 ? 1 : 2));
            c[bad] = wrongV;
            var cAng = k < 1 ? ang * k : r.pick([ang + 10, ang - 10, ang + 5]);
            return { k: k, o: o, ang: ang, bad: bad, c: c, cAng: q(cAng) };
          }, function (s) { return s.c[s.bad] > 0 && !same(s.c[s.bad], s.o[s.bad] * s.k) && decs(s.c[s.bad]) <= 2 && !(s.o.join() === '2,3,2.5,4') && s.cAng < 180; }, { k: 0.5, o: [8, 6, 5, 9.4], ang: 80, bad: 2, c: [4, 3, 3.5, 4.7], cAng: 40 });
        },
        parts: [
          { id: '13a', sub: 'i', level: 'EMG', make: function (r, sh) {
            var names = ['PQ', 'QR', 'RS', 'SP'], wrongs = [names[sh.bad], 'angle'];
            var opts = names.map(function (n) { return { value: n, html: '<b>' + n + '</b>' }; }).concat([{ value: 'angle', html: '<b>∠P</b>' }]);
            var p = { prompt: 'Tap the two measurements that are mistakes.', input: { type: 'select', options: opts, help: 'Tap the two mistakes. Tap again to unselect.' },
              check: K.selectSet(wrongs, function (extra, missing) {
                if (extra.length) { var e = extra[0]; if (e === 'angle') return { code: 'u6l3-sam-right', hint: 'Check ∠P: angles don’t change.' }; var i = names.indexOf(e); return { code: 'u6l3-sam-right', hint: 'Check ' + e + ': ' + t(nS(sh.c[i]) + '\\div ' + nS(sh.o[i]) + '=' + nS(sh.k)) + ', which is k. That one is right.' }; }
                if (missing.indexOf('angle') >= 0) return { code: 'u6l3-sam-missed', hint: 'One more: look at the angle. Should it change in a similar copy?' };
                return { code: 'u6l3-sam-missed', hint: 'One more: divide each of Sam’s sides by the original side. Each answer should be ' + nS(sh.k) + '.' };
              }), key: wrongs, answer: '<b>' + names[sh.bad] + '</b> and <b>∠P</b>',
              solution: steps([names.map(function (n, i) { return n + ': ' + t(nS(sh.c[i]) + '\\div ' + nS(sh.o[i]) + '=' + nS(rd(sh.c[i] / sh.o[i], 3))); }).join(', '), names[sh.bad] + ' gives ' + nS(rd(sh.c[sh.bad] / sh.o[sh.bad], 3)) + ', not ' + nS(sh.k) + '. And ∠P changed from ' + sh.ang + '° to ' + sh.cAng + '°, but angles don’t change.']),
              hints: ['Divide each of Sam’s sides by the original side. Each should give k = ' + nS(sh.k) + '.', 'Angles should not change.'], text: 'Sam mistakes' };
            return p;
          } },
          { id: '13b', sub: 'ii', level: 'EMG', make: function (r, sh) {
            var names = ['PQ', 'QR', 'RS', 'SP'], n = names[sh.bad], v = sh.o[sh.bad] * sh.k;
            return fieldsPart('What should those two measurements be on a correct copy?', [fld(n + '′ =', v, { unit: 'cm', alts: lenAlts(sh.o[sh.bad], sh.k).concat([{ v: sh.c[sh.bad], code: 'u6l3-sam-right', hint: 'That’s Sam’s value. Multiply the original by k.' }]), name: n + '′' }),
              fld(t("\\angle P'="), sh.ang, { unit: '°', alts: angAlts(sh.ang, sh.k).concat([{ v: sh.cAng, code: 'u6l3-angle-k', hint: 'That’s Sam’s angle. Angles don’t change.' }]), name: '∠P′' })],
              steps([n + ' should be ' + t(nS(sh.o[sh.bad]) + '\\times ' + nS(sh.k) + '=' + nS(v)) + ' cm, not ' + cm(sh.c[sh.bad]) + '.', '∠P′ should be ' + dg(sh.ang) + ', the same as ∠P.']), ['Multiply the original side by k.', 'Angles stay the same.'], 'Sam fixes');
          } }] },

      /* ---- Q14–16: multiple choice ---- */
      { num: '14', stem: '', shared: function (r) { return find(function () { var a = r.int(2, 5), b = a + r.int(1, 4), k = r.int(2, 5); return { a: a, b: b, k: k }; }, function (s) { return s.a + s.k !== s.a * s.k && s.b + s.k !== s.b * s.k; }, { a: 3, b: 5, k: 4 }); },
        parts: [{ id: '14a', level: 'BEG', make: function (r, sh) {
          var a = sh.a, b = sh.b, k = sh.k;
          var p = P.mc(r, 'A rectangle is ' + cm(a) + ' by ' + cm(b) + '. Which rectangle is an enlargement of it with ' + t('k=' + k) + '?', [
            { html: cm(a * k) + ' by ' + cm(b * k), right: true }, { html: cm(a + k) + ' by ' + cm(b + k), why: 'That adds ' + k + ' to each side. Multiply each side by ' + k + '.', code: 'u6l3-mc-add' },
            { html: cm(a * k) + ' by ' + cm(b), why: 'Only one side was multiplied. Both sides must be multiplied by k.', code: 'u6l3-mc-one' }, { html: cm(rd(a / k, 2)) + ' by ' + cm(rd(b / k, 2)), why: 'That divides by ' + k + ' (a reduction). An enlargement multiplies.', code: 'u6l3-mc-div' }],
            t(a + '\\times ' + k + '=' + a * k) + ' and ' + t(b + '\\times ' + k + '=' + b * k) + ': ' + cm(a * k) + ' by ' + cm(b * k) + '.', ['Multiply both sides by k.'], 'rectangle MC');
          return p;
        } }] },
      { num: '15', stem: '', parts: [{ id: '15a', level: 'BEG', make: function (r) {
        var th = r.int(25, 55), k = r.pick([2, 3, 4]);
        if (th * k >= 180) k = 2;
        return P.mc(r, 'A triangle has ' + an(th) + ' ' + th + '° angle. It is enlarged with ' + t('k=' + k) + '. The matching angle in the enlargement is', [
          { html: dg(th), right: true }, { html: dg(rd(th / k, 1)), why: 'That divides the angle by ' + k + '. Angles don’t change in a similar figure.', code: 'u6l3-angle-k' },
          { html: dg(th + k), why: 'That adds ' + k + '. Angles don’t change.', code: 'u6l3-angle-k' }, { html: dg(th * k), why: 'That multiplies the angle by ' + k + '. Only lengths are multiplied; angles stay the same.', code: 'u6l3-angle-k' }],
          dg(th) + '. Angles don’t change in a similar figure.', ['What happens to angles in an enlargement?'], 'angle MC');
      } }] },
      { num: '16', stem: '', parts: [{ id: '16a', level: 'BEG', make: function (r) {
        var n = r.pick([3, 4, 2, 3]), d = n * r.pick([2, 3, 4, 5]), other = n === 2 ? 4 : 2;
        return P.mc(r, 'In the projection method, corner A is ' + cm(d) + ' from the centre O. For a reduction with ' + t('k=\\frac{1}{' + n + '}') + ', how far from O is A′?', [
          { html: cm(d / n), right: true }, { html: cm(d / other), why: 'That uses ' + t('k=\\frac{1}{' + other + '}') + '. Multiply ' + d + ' by ' + t('\\frac{1}{' + n + '}') + ' (divide by ' + n + ').', code: 'u6l3-proj-frac' },
          { html: cm(d + d / 2), why: 'A reduction puts A′ <b>between</b> O and A, closer to O.', code: 'u6l3-proj-add' }, { html: cm(d * n), why: 'That multiplies by ' + n + ' (an enlargement). ' + t('\\frac{1}{' + n + '}\\times ' + d) + ' means divide by ' + n + '.', code: 'u6l3-proj-frac' }],
          t("OA'=\\frac{1}{" + n + '}\\times ' + d + '=' + nS(d / n)) + ' cm.', [t("OA'=k\\times OA") + '.'], 'projection MC');
      } }] },

      /* ---- Q17–18: numerical response ---- */
      { num: '17', stem: '', parts: [{ id: '17a', level: 'BEG', make: function (r) {
        var s = find(function () { return { w: r.pick([6.4, 7.2, 5.6, 4.8, 8, 6, 5.2]), k: r.pick([12.5, 15, 25, 7.5, 20, 12]) }; }, function (s) { var v = q(s.w * s.k); return decs(v) <= 1 && nS(v).length <= 4; }, { w: 6.4, k: 12.5 });
        return num('<b>Numerical response.</b> A photo on a phone screen is ' + cm(s.w) + ' wide. It is printed as a poster with a scale factor of ' + nS(s.k) + '. The width of the poster, in centimetres, is ____ cm.', s.w * s.k, { nr: true, dp: 1, alts: [{ v: s.w / s.k, code: 'u6l3-div-k', hint: 'The poster is bigger: multiply by the scale factor.' }, { v: s.w + s.k, code: 'u6l3-add-k', hint: 'Multiply by the scale factor; don’t add it.' }],
          sol: t(nS(s.w) + '\\times ' + nS(s.k) + '=' + nS(s.w * s.k)) + ' cm', hints: ['New length = original length × k.'], text: 'poster width NR' });
      } }] },
      { num: '18', stem: '', parts: [{ id: '18a', level: 'EMG', make: function (r) {
        var s = find(function () { return { w: r.pick([8, 6, 12, 5, 4, 7.5, 9]), S: r.pick([1.4, 1.2, 0.9, 2, 1.5, 2.5, 1.8]) }; }, function (s) { var k = s.S * 100 / s.w; return nS(rd(k, 1)).length <= 4 && k > 5; }, { w: 8, S: 1.4 });
        var k = s.S * 100 / s.w;
        return num('<b>Numerical response.</b> A sign shop has a logo drawing that is ' + cm(s.w) + ' wide. The finished sign must be ' + cm(s.S, 'm') + ' wide, and similar to the drawing. The scale factor, to the nearest tenth, is ____.', k, { nr: true, dp: 1,
          alts: [{ v: s.S / s.w, code: 'u6l3-units-k', hint: 'Use the same units first: change ' + cm(s.S, 'm') + ' to centimetres.' }, { v: s.w / (s.S * 100), code: 'u6l3-prop-flip', hint: 'k = new ÷ original: the sign’s width on top.' }, { v: s.S * 1000 / s.w, code: 'u6l3-cm-m-1000', hint: '1 m = <b>100</b> cm.' }, { v: s.w / s.S, code: 'u6l3-prop-flip', hint: 'k = new ÷ original, in the same units.' }],
          sol: steps(['Same units first: ' + t(nS(s.S) + '\\text{ m}=' + nS(s.S * 100) + '\\text{ cm}') + '.', t('k=' + nS(s.S * 100) + '\\div ' + nS(s.w) + (same(k, rd(k, 1)) ? '=' : '\\approx ') + nS(rd(k, 1)))]), hints: ['Change the sign’s width to centimetres.', 'k = new ÷ original.'], text: 'sign k NR' });
      } }] }
    ],

    extra: [
      /* ---- A. Skills ---- */
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'A quadrilateral has sides of ' + sh.s.map(function (x) { return cm(x); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ', and one angle of ' + sh.ang + '°. Complete the table for each similar copy.'; },
        shared: function (r) { return find(function () { return { s: [r.int(6, 10), r.int(4, 7), r.int(5, 8), r.int(10, 14)], ang: r.int(95, 125), ks: [r.pick([2.5, 1.5, 3.5]), r.pick([0.25, 0.75]), r.pick([1.2, 1.4, 0.8])] }; }, function (s) { return s.s.join() !== '6,10,8,4'; }, { s: [8, 5, 6, 12], ang: 110, ks: [2.5, 0.25, 1.2] }); },
        parts: [
          { id: 'e1a', sub: 'a', level: 'EMG', make: function (r, sh) { return copyTable('Fill in the rows for the first two copies.', sh.s, sh.ang, sh.ks.slice(0, 2)); } },
          { id: 'e1b', sub: 'b', level: 'EMG', make: function (r, sh) { return copyTable('Fill in the row for the third copy.', sh.s, sh.ang, sh.ks.slice(2)); } },
          { id: 'e1c', sub: 'c', level: 'BEG', make: function (r, sh) { return typeGrid('Is each copy an enlargement or a reduction?', sh.ks.map(function (k) { return { v: k, tex: kT(k) }; }), false); } }] },
      { num: '2', stem: 'Each copy was made from an original with the scale factor shown. Find the length of the matching side on the original.', parts: [
        { id: 'e2', level: 'EMG', make: function (r) {
          var a = [r.pick([4, 5, 2.5]), r.pick([0.5, 0.25, 0.4]), r.pick([1.5, 1.25, 3])], c = [q(r.pick([6.5, 4.5, 3.5, 7.5, 5.5]) * a[0]), q(r.pick([14, 12, 9, 7.5, 16]) * a[1]), q(r.pick([8, 6, 12, 4]) * a[2])];
          return fieldsPart(table(['', '(a)', '(b)', '(c)'], [['Scale factor k'].concat(a.map(nS)), ['Side on the copy'].concat(c.map(function (x) { return cm(x); }))]) + 'Side on the original:', a.map(function (k, i) { return fld('(' + 'abc'.charAt(i) + ')', c[i] / k, { unit: 'cm', alts: origAlts(c[i], k), name: '(' + 'abc'.charAt(i) + ')' }); }),
            'Original = copy ÷ k:<br>' + a.map(function (k, i) { return '(' + 'abc'.charAt(i) + ') ' + t(nS(c[i]) + '\\div ' + nS(k) + '=' + nS(c[i] / k)); }).join(' &nbsp;&nbsp; '), ['Going back to the original: divide by k.'], 'originals');
        } }] },
      { num: '3', stem: function (sh) { return 'Draw an enlargement of the shape with ' + t('k=3') + '. Start at A′.' + gridPic(sh.pts, { names: ['ABCDE'], cell: 24 }); },
        shared: function (r) { return find(function () { var w = r.int(2, 4), h1 = r.int(1, 2), c = r.int(1, 2); return { pts: [[0, 0], [w, 0], [w, h1], [w - c, h1 + c], [0, h1 + c]], w: w, c: c }; }, function (s) { return s.w - s.c >= 1; }, { pts: [[0, 0], [2, 0], [2, 1], [1, 2], [0, 2]] }); },
        parts: [{ id: 'e3', level: 'EMG', make: function (r, sh) { return moveFields('Fill in the moves on the copy, going round from A′.', 'ABCDE'.split(''), sh.pts, 3, [0, 1, 2, 3, 4], { solEnd: 'Check: the last move lands back on A′ ✓.' }); } }] },
      { num: '4', stem: function (sh) { return 'Draw an enlargement of the parallelogram with ' + t('k=1.5') + '. Start at A′.' + gridPic(sh.pts, { names: ['ABCD'], cell: 22 }); },
        shared: function (r) { return find(function () { var b = r.int(2, 6), dx = r.int(1, 3), dy = r.int(2, 4); return { pts: [[0, 0], [b, 0], [b + dx, dy], [dx, dy]] }; }, function (s) { return true; }, null); },
        parts: [{ id: 'e4', level: 'PRG', make: function (r, sh) { return moveFields('Fill in the first three moves on the copy, going round from A′. (A move can end in the middle of a square: ' + t('3\\times 1.5=4.5') + '.)', 'ABCD'.split(''), sh.pts, 1.5, [0, 1, 2], { solEnd: 'The last move is ' + moveText(movesOf(sh.pts)[3], 1.5) + ', back to A′ ✓.' }); } }] },
      { num: '5', stem: function (sh) { return 'The sketch of ' + t('\\triangle RST') + ' is not to scale. Mo draws an enlargement with ' + t('k=' + nS(sh.k)) + ' using a ruler and protractor. On the original, ' + t('RT') + ' measures ' + cm(sh.RT) + '.' +
          polyPic([[0, 0], [sh.ST, 0], [sh.SR * Math.cos(sh.S * Math.PI / 180), sh.SR * Math.sin(sh.S * Math.PI / 180)]], { names: ['S', 'T', 'R'], sides: [cm(sh.ST), '', cm(sh.SR)], angles: [sh.S, '', ''], u: 190 / sh.ST, width: 270 }); },
        shared: function (r) { return find(function () { var ST = r.pick([5, 4.5, 6, 5.5, 4]), SR = r.pick([4, 3.5, 3, 4.5]), S = r.int(40, 70), k = r.pick([1.2, 1.5, 2, 1.4]); var RT = Math.sqrt(ST * ST + SR * SR - 2 * ST * SR * Math.cos(S * Math.PI / 180)); return { ST: ST, SR: SR, S: S, k: k, RT: rd(RT, 1), RTx: RT }; }, function (s) { return s.SR < s.ST && decs(s.ST * s.k) <= 2 && decs(s.SR * s.k) <= 2; }, { ST: 5, SR: 4, S: 50, k: 1.2, RT: 3.9, RTx: 3.9 }); },
        parts: [{ id: 'e5', level: 'EMG', make: function (r, sh) {
          var nt = sh.RT * sh.k;
          return fieldsPart('What are the two sides and the angle that Mo draws, and how long should ' + t("R'T'") + ' measure? (Round ' + t("R'T'") + ' to the nearest tenth.)', [
            fld(t("S'T'="), sh.ST * sh.k, { unit: 'cm', alts: lenAlts(sh.ST, sh.k), name: 'S′T′' }), fld(t("S'R'="), sh.SR * sh.k, { unit: 'cm', alts: lenAlts(sh.SR, sh.k), name: 'S′R′' }), fld(t("\\angle S'="), sh.S, { unit: '°', alts: angAlts(sh.S, sh.k), name: '∠S′' }),
            fld(t("R'T'\\approx"), nt, { unit: 'cm', dp: 1, also: [sh.RTx * sh.k], alts: lenAlts(sh.RT, sh.k), name: 'R′T′' })],
            steps([t("S'T'=" + nS(sh.ST) + '\\times ' + nS(sh.k) + '=' + nS(sh.ST * sh.k)) + ' cm, ' + t("S'R'=" + nS(sh.SR) + '\\times ' + nS(sh.k) + '=' + nS(sh.SR * sh.k)) + ' cm, with ' + dg(sh.S) + ' between them. Join R′ to T′.', t("R'T'\\approx " + nS(sh.RT) + '\\times ' + nS(sh.k) + (same(nt, rd(nt, 1)) ? '=' : '\\approx ') + nS(rd(nt, 1))) + ' cm.']),
            ['Multiply each side by k; the angle stays the same.', 'R′T′ = RT × k.'], 'RST copy');
        } }] },
      { num: '6', stem: function (sh) { return 'Draw an enlargement of ' + t('\\triangle DEF') + ' with centre O and ' + t('k=3') + '. On the original, ' + sh.nm.map(function (L, i) { return t('O' + L + '=' + nS(sh.ds[i]) + '\\text{ cm}' + (i < sh.nm.length - 1 ? ',' : '')); }).join(' ') + '.' + projPic(sh.nm.map(function (L, i) { return { name: L, dir: sh.dirs[i], d: sh.ds[i] }; }), { ext: 3.2 }); },
        shared: function (r) { return { nm: ['D', 'E', 'F'], ds: midMax(r.sample([1.2, 1.8, 1.5, 1.4, 1.1, 1.6, 0.8], 3)), dirs: dirsFor(r, 3) }; },
        parts: [{ id: 'e6', level: 'EMG', make: function (r, sh) { return projFields('How far from O is each new corner?', sh.nm, sh.ds, 3); } }] },

      /* ---- B. Applying ---- */
      { num: '7', section: 'B. Applying', stem: '', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
        var L = r.pick([12, 6]), Wd = r.pick([2.4, 2.5]), H = r.pick([2.6, 2.9]), n = find(function () { return r.pick([50, 40, 20, 25, 100]); }, function (n) { return decs(L * 100 / n) <= 2 && decs(Wd * 100 / n) <= 2 && decs(H * 100 / n) <= 2; }, 50);
        var dims = [['Length:', L], ['Width:', Wd], ['Height:', H]];
        return fieldsPart('A shipping container is ' + cm(L, 'm') + ' long, ' + cm(Wd, 'm') + ' wide and ' + cm(H, 'm') + ' tall. A toy container is similar to it, with a scale factor of ' + t('\\frac{1}{' + n + '}') + '. Find the toy’s dimensions in centimetres.',
          dims.map(function (d) { return fld(d[0], d[1] * 100 / n, { unit: 'cm', name: d[0].replace(':', ''), alts: [{ v: d[1] / n, code: 'u6l3-cm-m', hint: 'That’s in metres. Change to centimetres (× 100).' }, { v: d[1] * n, code: 'u6l3-div-k', hint: 'The toy is smaller: divide by ' + n + ' (that is, × ' + t('\\frac{1}{' + n + '}') + ').' }, { v: d[1] * 100 * n, code: 'u6l3-div-k', hint: 'The toy is smaller: divide by ' + n + '.' }] }); }),
          steps(['Change to cm: ' + dims.map(function (d) { return nS(d[1] * 100) + ' cm'; }).join(', ') + '. ' + t('k=\\frac{1}{' + n + '}') + ', so divide by ' + n + '.', dims.map(function (d) { return t(nS(d[1] * 100) + '\\div ' + n + '=' + nS(d[1] * 100 / n)) + ' cm'; }).join(', '),
            'The toy is ' + cm(L * 100 / n) + ' long, ' + cm(Wd * 100 / n) + ' wide and ' + cm(H * 100 / n) + ' tall.']), ['Change the metres to centimetres first.', 'Multiplying by ' + t('\\frac{1}{' + n + '}') + ' is the same as dividing by ' + n + '.'], 'toy container');
      } }] },
      { num: '8', stem: function (sh) { return 'The front of a garden shed is a pentagon: ' + an(sh.B) + ' ' + cm(sh.B, 'm') + ' base, two ' + cm(sh.Wl, 'm') + ' walls and two ' + cm(sh.Rf, 'm') + ' roof edges. Hana builds a similar model whose base is ' + cm(sh.mb) + '.'; },
        shared: function (r) { return find(function () { var B = r.pick([2.4, 3, 2, 3.6, 1.8, 2.5]), mb = r.pick([12, 15, 10, 9, 18, 20, 6]), Wl = r.pick([2, 1.8, 2.2, 2.4]), Rf = r.pick([1.5, 1.6, 1.8, 2]), ang = r.int(96, 124); var k = mb / (B * 100); return { B: B, mb: mb, Wl: Wl, Rf: Rf, ang: ang, k: k }; }, function (s) { return decs(s.k) <= 3 && same(s.k, rd(s.k, 3)) && decs(s.Wl * 100 * s.k) <= 2 && decs(s.Rf * 100 * s.k) <= 2 && s.Rf < s.B; }, { B: 2.4, mb: 12, Wl: 2, Rf: 1.5, ang: 106, k: 0.05 }); },
        parts: [
          { id: 'e8a', sub: 'a', level: 'PRG', make: function (r, sh) { return kPart('Find the scale factor. (Use the same units.)', sh.k, [{ v: sh.mb / sh.B, code: 'u6l3-units-k', hint: 'Use the same units: change ' + cm(sh.B, 'm') + ' to centimetres first.' }, { v: sh.mb / (sh.B * 1000), code: 'u6l3-cm-m-1000', hint: '1 m = <b>100</b> cm.' }],
            steps([t(nS(sh.B) + '\\text{ m}=' + nS(sh.B * 100) + '\\text{ cm}'), t('k=' + sh.mb + '\\div ' + nS(sh.B * 100) + '=' + nS(sh.k))]), ['Change the base to centimetres.', 'k = model ÷ real.'], 'shed k'); } },
          { id: 'e8b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var wv = sh.Wl * 100 * sh.k, rv = sh.Rf * 100 * sh.k, al = function (x) { return [{ v: x * sh.k, code: 'u6l3-cm-m', hint: 'Change ' + cm(x, 'm') + ' to centimetres first, then multiply by k.' }, { v: x * 100 / sh.k, code: 'u6l3-div-k', hint: 'The model is smaller: multiply by k.' }]; };
            return fieldsPart('Find the model’s wall and roof-edge lengths.', [fld('Walls:', wv, { unit: 'cm', alts: al(sh.Wl), name: 'Walls' }), fld('Roof edges:', rv, { unit: 'cm', alts: al(sh.Rf), name: 'Roof edges' })],
              'Walls: ' + t(nS(sh.Wl * 100) + '\\times ' + nS(sh.k) + '=' + nS(wv)) + ' cm. Roof edges: ' + t(nS(sh.Rf * 100) + '\\times ' + nS(sh.k) + '=' + nS(rv)) + ' cm.', ['Change to cm, then multiply by the k from (a).'], 'shed model');
          } },
          { id: 'e8c', sub: 'c', level: 'BEG', make: function (r, sh) { return num('The real roof has ' + an(sh.ang) + ' ' + sh.ang + '° angle at the peak. What is the angle on the model?', sh.ang, { unit: '°', alts: angAlts(sh.ang, sh.k), sol: dg(sh.ang) + ': angles don’t change.', hints: ['Do angles change in a similar model?'], text: 'model angle' }); } }] },
      { num: '9', stem: '', shared: function (r) {
          return find(function () {
            var a = r.pick([6, 8, 10, 12, 5]), b = a + r.pick([2, 4, 6, 3]), kf = r.pick([3, 4, 5, 6, 7, 2.5, 3.5]), e = r.int(2, 9), shortLim = r.chance(0.5);
            var c = shortLim ? a * kf : a * kf + e, d = shortLim ? b * kf + e : b * kf;
            return { a: a, b: b, kf: kf, e: e, c: q(c), d: q(d), shortLim: shortLim };
          }, function (s) { return s.c < s.d && !(s.a === 10 && s.b === 15) && decs(s.c) <= 1 && decs(s.d) <= 1 && !(s.c === 45 && s.d === 60); }, { a: 8, b: 12, kf: 7, e: 6, c: 56, d: 90, shortLim: true });
        },
        parts: [{ id: 'e9', level: 'MAS', make: function (r, sh) {
          var kA = sh.c / sh.a, kB = sh.d / sh.b, kb = Math.max(kA, kB), Ps = sh.a * sh.kf, Pl = sh.b * sh.kf;
          return fieldsPart('Tariq wants to enlarge ' + an(sh.a) + ' ' + cm(sh.a) + ' by ' + cm(sh.b) + ' picture onto ' + an(sh.c) + ' ' + cm(sh.c) + ' by ' + cm(sh.d) + ' piece of poster board. The enlargement must be similar and fit on the board. Find the largest scale factor he can use, the size of the poster, and how much board is left over.', [
            kFld(null, sh.kf, [{ v: kb, code: 'u6l3-fit-big', hint: 'With the larger k one side of the poster would hang off the board. Find k both ways and use the <b>smaller</b>.' }]),
            fld('Poster short side:', Ps, { unit: 'cm', name: 'Short side', alts: [{ v: sh.a * kb, code: 'u6l3-fit-big', hint: 'Use the smaller k, so the poster fits.' }] }), fld('Poster long side:', Pl, { unit: 'cm', name: 'Long side', alts: [{ v: sh.b * kb, code: 'u6l3-fit-big', hint: 'Use the smaller k: this side would not fit on the board.' }] }),
            fld('Board left over:', sh.e, { unit: 'cm', name: 'Left over', alts: [{ v: (sh.shortLim ? sh.c : sh.d) - (sh.shortLim ? Ps : Pl), code: 'u6l3-fit-left', hint: 'That side fills the board exactly. The strip is left along the <b>other</b> side.' }, { v: sh.c * sh.d - Ps * Pl, code: 'u6l3-fit-left', hint: 'Give the <b>width</b> of the strip left over (board side − poster side), not an area.' }] })],
            steps(['Short sides: ' + t(nS(sh.c) + '\\div ' + sh.a + (same(kA, rd(kA, 2)) ? '=' : '\\approx ') + nS(rd(kA, 2))) + '. Long sides: ' + t(nS(sh.d) + '\\div ' + sh.b + (same(kB, rd(kB, 2)) ? '=' : '\\approx ') + nS(rd(kB, 2))) + '. Use the smaller: ' + t('k=' + nS(sh.kf)) + '.',
              'Poster: ' + t(sh.a + '\\times ' + nS(sh.kf) + '=' + nS(Ps)) + ' cm by ' + t(sh.b + '\\times ' + nS(sh.kf) + '=' + nS(Pl)) + ' cm.', 'Left over: ' + t(sh.shortLim ? nS(sh.d) + '-' + nS(Pl) + '=' + nS(sh.e) : nS(sh.c) + '-' + nS(Ps) + '=' + nS(sh.e)) + ' cm along the ' + (sh.shortLim ? 'long' : 'short') + ' side.']),
            ['Find k for the short sides and for the long sides (board ÷ picture).', 'Use the smaller k. Then subtract to find the strip left over.'], 'poster fit');
        } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var a = r.int(2, 4), b = a + r.int(1, 3), k = r.pick([2, 3]), A = r.pick([80, 75, 70, 85]);
        return P.mc(r, 'Noah “enlarges” ' + an(a) + ' ' + cm(a) + ' by ' + cm(b) + ' rectangle with ' + t('k=' + k) + '. He draws ' + an(a * k) + ' ' + cm(a * k) + ' by ' + cm(b * k) + ' shape, but his corners are ' + A + '° and ' + (180 - A) + '°. Is his shape similar to the rectangle?', [
          { html: '<b>No.</b> The sides are in the same ratio (' + t(a * k + '\\div ' + a + '=' + b * k + '\\div ' + b + '=' + k) + '), but the angles changed. Similar figures need equal angles <b>and</b> sides in the same ratio.', right: true },
          { html: '<b>Yes.</b> Every side was multiplied by ' + k + '.', why: 'The sides are fine, but look at the angles: a rectangle has four 90° angles.', code: 'u6l3-noah-yes' },
          { html: '<b>No.</b> The sides are not in the same ratio.', why: 'Check: ' + t(a * k + '\\div ' + a + '=' + k) + ' and ' + t(b * k + '\\div ' + b + '=' + k) + '. The sides are fine. What else must match?', code: 'u6l3-ratio-flip' },
          { html: '<b>Yes.</b> It still has four sides and two pairs of equal sides.', why: 'Similar figures need matching angles to be equal. His angles are not 90°.', code: 'u6l3-noah-yes' }],
          'No. ' + t(a * k + '\\div ' + a + '=' + b * k + '\\div ' + b + '=' + k) + ', so the sides are in the same ratio, but the angles changed. The rectangle has four 90° angles; his shape is a parallelogram.', ['Similar figures: equal angles AND sides in the same ratio. Check both.'], 'Noah');
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'BEG', make: function (r) {
        var m = r.pick([2, 3, 4]), kp = r.pick([0.5, 2, 3]), d = r.pick([2, 3, 1]), g = r.pick([3, 2, 4]);
        return P.mc(r, 'Which of these does <b>not</b> make a figure similar to the original?', [
          { html: 'Adding ' + cm(d) + ' to every side', right: true },
          { html: 'Multiplying every side by ' + m + ' and keeping every angle the same', why: 'That is exactly how a similar copy is made.', code: 'u6l3-notsim' },
          { html: 'The projection method with ' + t('k=' + kT(kp)), why: 'The projection method multiplies every distance from O by k, so it makes a similar figure.', code: 'u6l3-notsim' },
          { html: 'On a grid, multiplying every move by ' + g, why: 'Multiplying every move by the same number makes a similar figure.', code: 'u6l3-notsim' }],
          'Adding the same amount changes the shape (short sides grow by a bigger fraction than long sides). The other three multiply every length by the same k.', ['Which one adds instead of multiplying?'], 'not similar MC');
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'BEG', make: function (r) {
        var s = find(function () { return { x: r.pick([7.2, 6.4, 8.8, 5.6, 9.6, 4.4]), k: r.pick([0.25, 0.75, 0.5]) }; }, function (s) { return nS(q(s.x * s.k)).length <= 4; }, { x: 7.2, k: 0.25 });
        return num('<b>Numerical response.</b> A side of a triangle is ' + cm(s.x) + '. The triangle is reduced with ' + t('k=' + nS(s.k)) + '. The length of the matching side, in centimetres, is ____ cm.', s.x * s.k, { nr: true, alts: [{ v: s.x / s.k, code: 'u6l3-div-k', hint: 'A reduction makes it smaller: multiply by ' + nS(s.k) + '.' }, { v: s.x - s.k, code: 'u6l3-add-k', hint: 'Multiply by k; don’t subtract it.' }],
          sol: t(nS(s.x) + '\\times ' + nS(s.k) + '=' + nS(s.x * s.k)) + ' cm', hints: ['New length = original × k.'], text: 'reduced side NR' });
      } }] },

      /* ---- C. Stretch ---- */
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A figure has a side of ' + cm(sh.s) + '. It is enlarged with ' + t('k=' + sh.k1) + '. Then the enlargement is reduced with ' + t('k=\\frac{1}{' + sh.n + '}') + '.'; },
        shared: function (r) { return find(function () { return { s: r.pick([12, 8, 16, 10, 20, 18]), k1: r.pick([2, 3, 4]), n: r.pick([4, 2, 3, 5]) }; }, function (s) { return s.k1 !== s.n && decs(s.s * s.k1 / s.n) <= 1 && decs(s.k1 / s.n) <= 2 && same(s.k1 / s.n, rd(s.k1 / s.n, 2)); }, { s: 12, k1: 2, n: 4 }); },
        parts: [
          { id: 'e13a', sub: 'a', level: 'PRG', make: function (r, sh) { var mid = sh.s * sh.k1, fin = mid / sh.n; return num('How long is the side in the final figure?', fin, { unit: 'cm', alts: [{ v: mid, code: 'u6l3-mixed', hint: 'That’s after the first step. Now reduce it with ' + t('k=\\frac{1}{' + sh.n + '}') + '.' }, { v: sh.s / sh.n, code: 'u6l3-mixed', hint: 'Do the enlargement first (× ' + sh.k1 + '), then the reduction.' }, { v: mid * sh.n, code: 'u6l3-div-k', hint: t('\\frac{1}{' + sh.n + '}') + ' makes it smaller: divide by ' + sh.n + '.' }],
            sol: t(sh.s + '\\times ' + sh.k1 + '=' + mid) + ' cm, then ' + t(mid + '\\times \\frac{1}{' + sh.n + '}=' + nS(fin)) + ' cm.', hints: ['Do one step at a time: first × ' + sh.k1 + ', then ÷ ' + sh.n + '.'], text: 'two steps' }); } },
          { id: 'e13b', sub: 'b', level: 'ADV', make: function (r, sh) { var k = sh.k1 / sh.n; return kPart('What single scale factor takes the original straight to the final figure?', k, [{ v: sh.k1 + 1 / sh.n, code: 'u6l3-k-sum', hint: 'Scale factors <b>multiply</b>: ' + t(sh.k1 + '\\times\\frac{1}{' + sh.n + '}') + '. Or divide: final ÷ original.' }, { v: sh.s * k, code: 'u6l3-mixed', hint: 'That’s the final length. k = final ÷ original.' }],
            t(nS(sh.s * k) + '\\div ' + sh.s + '=' + nS(k)) + ' (also ' + t(sh.k1 + '\\times \\frac{1}{' + sh.n + '}=' + nS(k)) + ').', ['k = final length ÷ original length.'], 'single k'); } }] },
      { num: '14', stem: function (sh) { return 'The grid shows ' + an(sh.a) + ' ' + sh.a + ' by ' + sh.b + ' rectangle.' + gridPic([[0, 0], [sh.b, 0], [sh.b, sh.a], [0, sh.a]], { cell: 20, cols: sh.b * sh.k + 2, rows: sh.a * sh.k + 2 }); },
        shared: function (r) { var a = r.int(1, 3), b = a + r.int(1, 2), k = r.pick([2, 3]); return { a: a, b: b, k: k, k3: r.pick(k === 2 ? [3, 4, 5] : [2, 4, 5]) }; },
        parts: [
          { id: 'e14a', sub: 'a', level: 'BEG', make: function (r, sh) { return fieldsPart('Its enlargement with ' + t('k=' + sh.k) + ' would be how many squares across and up?', [fld('Across:', sh.b * sh.k, { unit: 'squares', alts: [{ v: sh.b + sh.k, code: 'u6l3-grid-add', hint: 'Multiply by k; don’t add it.' }, { v: sh.a * sh.k, code: 'u6l3-grid-swap', hint: 'This box is the length <b>across</b>.' }], name: 'Across' }), fld('Up:', sh.a * sh.k, { unit: 'squares', alts: [{ v: sh.a + sh.k, code: 'u6l3-grid-add', hint: 'Multiply by k; don’t add it.' }, { v: sh.b * sh.k, code: 'u6l3-grid-swap', hint: 'This box is the height (up).' }], name: 'Up' })],
            'A ' + sh.b * sh.k + ' by ' + sh.a * sh.k + ' rectangle: ' + t(sh.b + '\\times ' + sh.k + '=' + sh.b * sh.k) + ' across and ' + t(sh.a + '\\times ' + sh.k + '=' + sh.a * sh.k) + ' up.', ['Multiply both sides by k.'], 'rectangle on grid'); } },
          { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, sh) { var A0 = sh.a * sh.b, A1 = A0 * sh.k * sh.k; return fieldsPart('How many squares are inside each rectangle? How many times bigger is the area of the enlargement?', [fld('Original:', A0, { unit: 'squares', alts: [{ v: 2 * (sh.a + sh.b), code: 'u6l3-area-sq', hint: 'Count the squares <b>inside</b> (area), not around the edge.' }], name: 'Original' }),
              fld('Enlargement:', A1, { unit: 'squares', alts: [{ v: A0 * sh.k, code: 'u6l3-area-k', hint: 'Both sides were multiplied by ' + sh.k + '. Count again: ' + t(sh.b * sh.k + '\\times ' + sh.a * sh.k) + '.' }, { v: 2 * (sh.a + sh.b) * sh.k, code: 'u6l3-area-sq', hint: 'Count the squares <b>inside</b>, not the edge.' }], name: 'Enlargement' }),
              fld('Times bigger:', sh.k * sh.k, { name: 'Times bigger', alts: [{ v: sh.k, code: 'u6l3-area-k', hint: 'Divide: ' + t(A1 + '\\div ' + A0) + '. The area grows by more than k.' }, { v: A1, code: 'u6l3-area-sq', hint: 'That’s the number of squares. How many <b>times</b> bigger? Divide by the original.' }] })],
            steps(['Original: ' + t(sh.a + '\\times ' + sh.b + '=' + A0) + ' squares. Enlargement: ' + t(sh.a * sh.k + '\\times ' + sh.b * sh.k + '=' + A1) + ' squares.', t(A1 + '\\div ' + A0 + '=' + sh.k * sh.k) + ' times bigger (not ' + sh.k + ' times!).']), ['Area = length × width (count the squares inside).', 'Times bigger: divide the two areas.'], 'area grows'); } },
          { id: 'e14c', sub: 'c', level: 'ADV', make: function (r, sh) { var k3 = sh.k3; return num('Did you know? The area grows by ' + t('k\\times k') + '. Predict how many times bigger the area is when ' + t('k=' + k3) + '.', k3 * k3, { alts: [{ v: k3, code: 'u6l3-area-k', hint: 'The area grows by ' + t('k\\times k') + ', not by k.' }, { v: 2 * k3, code: 'u6l3-area-k', hint: t('k\\times k') + ' means ' + t(k3 + '\\times ' + k3) + ', not ' + t('2\\times ' + k3) + '.' }],
            sol: t(k3 + '\\times ' + k3 + '=' + k3 * k3) + ' times bigger.', hints: ['Multiply k by itself.'], text: 'predict area' }); } }] }
    ]
  });
})(window);
