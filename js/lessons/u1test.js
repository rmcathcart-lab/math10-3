/* Math 10-3 · Unit 1 Test (N1) — Unit Pricing and Currency Exchange: ratios and proportions, rates and unit rates
 * (L/100 km), unit price and the best buy, markup and markup percent, GST / PST / HST, discounts and percent decrease,
 * comparing promotions and stacked discounts, currency exchange both ways with the bank's buying and selling rates, and
 * estimating. Built the way the Math 15 / 10C unit tests were built (Beginning / Progressing / Mastery boxes, typed
 * answers, keys from the generated numbers, `bad` answers with u1t- codes, worked solutions and hints), with new items in
 * the style of the booklet's review lesson (u1_l11.tex) and Practice Test 2 (u1_ep11.tex). Calculator allowed.
 * One outcome, N1 (the refresher skills of Lessons 1, 2 and 7 only appear as steps inside N1 problems).
 * 23 questions / 26 parts: Beginning 10 parts, Progressing 10, Mastery 6 — about 75 minutes (short_report.js:
 * 1.5 / 3 / 5 min a part). The short version (def.short) is about half of that and keeps every box.
 *
 *   Beginning   — one-step skills: a ratio with different units in simplest form; a recipe proportion; a unit rate
 *                 (pay per hour or km/h); fuel economy in L/100 km; one unit price per 100 g (or 100 mL); a retail price
 *                 from a markup percent; the total with PST + GST or HST; a sale price; US dollars to Canadian; the best
 *                 estimate of a US price in Canadian dollars (multiple choice).
 *   Progressing — the typical assignment question: sharing an amount in a 3-term ratio; a proportion with a unit change
 *                 (L to mL); the cost of gas for a trip from L/100 km; three sizes — unit prices, then the best buy with a
 *                 reason that is not about price; the markup percent; the percent decrease; a sale price, then tax; a bank
 *                 board — buying foreign cash (selling rate) and changing CAD into USD (selling rate, divide).
 *   Mastery     — skills combined: a cross-border purchase (shipping or US sales tax, then the exchange rate) against a
 *                 Calgary price with GST — the cost in CAD, then which is cheaper and by how much; a fake deal (the
 *                 price raised, then "% off") — the real percent saved; working backwards from a total paid (discount
 *                 and GST) to the regular price; a stacked discount against one bigger discount — which store and by how
 *                 much; a mix in a ratio, bought in whole jugs or bags — the cost.
 * Conversions to online: "which is cheaper and by how much" → a word box + a money box; "explain / give a reason" →
 * multiple choice whose options pair the best buy with a reason (Progressing only); "estimate" → multiple choice of
 * estimates (Beginning). Partial credit: a recognized mistake that is one slip keeps 2/3 ('s'), a bigger but reasonable
 * one keeps 1/3 ('b'), see HW.addPartial below; in a set of 3+ boxes, one box wrong is a small mistake.
 *
 * Also exports HW.u1assess, the assessment kit used by the Unit 1 exit slips (js/exits/u1.js loads after this file).
 * The lesson kits (HW.u1ratio from js/lessons/u1l3.js) are looked up when a question is made, so tools that load only the
 * test files (tests/short_report.js) still work. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u1assess = {};

  /* ================= numbers and money ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function r2(x) { return rd(x, 2); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function c2(x) { return HW.fmt(r2(x).toFixed(2)); }
  function Mt(x) { return '\\$' + c2(x); }
  function MM(x) { return t(Mt(x)); }
  function raw5(x) { var s = +x.toFixed(5); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toM(x) { return near(x, r2(x), 1e-7) ? '=\\$' + c2(x) : '=' + raw5(x) + '\\approx\\$' + c2(x); }
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '=' + raw5(x) + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u1 assessment: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function uT(s) { return s === '%' ? '\\%' : '\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function dec(p) { return nS(p / 100); }
  function mult(p) { var s = nS(1 + p / 100); return /\.\d$/.test(s) ? s + '0' : /^\d+$/.test(s) ? s + '.00' : s; }
  function pay(p) { return nS(1 - p / 100); }
  function sz(x, small, big) { return x < 1000 ? HW.fmt(String(x)) + ' ' + small : nS(x / 1000) + ' ' + big; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  function people(r, k) { var out = []; while (out.length < k) out.push(person(r, out.map(function (p) { return p.n; }))); return out; }
  var CITIES = ['Red Deer', 'Airdrie', 'Lethbridge', 'Okotoks', 'Cochrane', 'Medicine Hat', 'Calgary', 'Edmonton', 'Camrose', 'Brooks'];
  Object.assign(A, { rd: rd, r2: r2, q: q, near: near, nS: nS, N: N, c2: c2, Mt: Mt, MM: MM, raw5: raw5, toM: toM, toN: toN, find: find, br: br, uT: uT, cap: cap, pickR: pickR,
    dec: dec, mult: mult, pay: pay, sz: sz, person: person, people: people, CITIES: CITIES });

  /* ================= reading and checking a number ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    var pct = /%/.test(s);
    s = s.replace(/\\\$|\$/g, '').replace(/\\%|%/g, '').replace(/\\[,;: ]|~/g, ' ').replace(/¢/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u1t-comma', 'Use a decimal point (not a comma), like 12.49.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, pct: pct, len: pl.replace(/^-/, '').length };
  }
  /* an answer rounded to dp places (2: the cent). o: { dp, exact, alts (other right values), diag [{v, code, hint}],
   * pct (a percent), plain (a number that isn't money), word (the rounding place in words), miss (hint for any other value) } */
  function amtChk(ans, o) {
    o = o || {};
    var dp = o.dp == null ? 2 : o.dp, money = dp === 2 && !o.pct && !o.plain, step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (money ? 'the cent (2 decimal places)' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp === 0 ? 'the nearest whole number' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var dg = (o.diag || []).filter(function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc(v)) { if (money && a.pct) return form('u1t-pct-sign', 'This answer is an amount of money, not a percent. Leave the % sign out.'); return ok(); }
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      if (o.pct && v > 0 && v < 1.5 && isAcc(rd(v * 100, dp))) return form('u1t-as-pct', 'That’s the answer as a decimal. Multiply by 100 to write it as a percent.');
      for (var i = 0; i < dg.length; i++) {
        var m = dg[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
        if (dp >= 2 && d === dp - 1 && near(v, rd(m.v, d), 1e-9) && !acc.some(function (y) { return near(rd(y, d), v, 1e-9); })) return wrong(m.code, m.hint);
      }
      if (dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u1t-places', money ? 'Give money to the cent (2 decimal places), like $12.49.' : 'Round to ' + word + '.');
      if (d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u1t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  /* a unit price used for comparing: right when it is the exact value correctly rounded to 2, 3 or 4 decimals */
  function upChk(exact, bad) {
    bad = (bad || []).filter(function (b) { return b && isFinite(b.v) && ![2, 3, 4].some(function (d) { return near(rd(b.v, d), rd(exact, d), 1e-9); }); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d, f = Math.pow(10, d);
      if (near(v, exact, 1e-9) || (d >= 2 && d <= 4 && near(v, rd(exact, d), 1e-9)) || (d > 4 && Math.abs(v - exact) < 6e-5)) return ok();
      for (var i = 0; i < bad.length; i++) {
        var b = bad[i];
        if (near(v, b.v, 1e-9) || (d >= 1 && d <= 4 && (near(v, rd(b.v, d), 1e-9) || near(v, Math.floor(b.v * f + 1e-9) / f, 1e-9))) || (d > 4 && Math.abs(v - b.v) < 6e-5)) return wrong(b.code, b.hint);
      }
      if (d < 2 && Math.abs(v - exact) < Math.pow(10, -d)) return form('u1t-keep-dec', 'Keep more decimals: give the unit price to the cent or, better for comparing, to a tenth of a cent (3 decimal places).');
      if (d >= 2 && d <= 4 && near(v, Math.floor(exact * f + 1e-9) / f, 1e-9) && !near(rd(exact, d), Math.floor(exact * f + 1e-9) / f, 1e-9))
        return wrong('u1t-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  /* a word answer (A or B, online or Calgary): the first 3 letters are enough */
  var STOP = { the: 1, promotion: 1, promo: 1, store: 1, buy: 1, buying: 1, 'in': 1, at: 1, from: 1, option: 1, is: 1, cheaper: 1, it: 1, deal: 1 };
  function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[.,'’!:;()]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
  function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
  function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
  /* -> 'right' | 'wrong' | 'both' | 'none' | 'empty' */
  function whichOf(resp, right, wrongs) {
    var ws = words(resp); if (!ws.length) return 'empty';
    var a = hit(ws, right), b = hit(ws, wrongs);
    return a && b ? 'both' : a ? 'right' : b ? 'wrong' : 'none';
  }

  /* ================= part builders ================= */
  function amtPart(prompt, ans, o) {
    o = o || {};
    var dp = o.dp == null ? 2 : o.dp, isMoney = dp === 2 && !o.pct && !o.plain, key = isMoney ? rd(ans, dp).toFixed(dp) : nS(rd(ans, dp));
    var before = o.before !== undefined ? o.before : isMoney ? '$' : undefined;
    var after = o.after !== undefined ? o.after : o.pct ? '%' : undefined;
    var ansT = o.ansTex || ((isMoney ? '\\$' : '') + HW.fmt(key) + (o.ansUnit ? uT(o.ansUnit) : after ? uT(after) : ''));
    var p = { prompt: prompt, input: { type: 'number', before: before, after: after }, check: amtChk(ans, o), key: key, answer: t(ansT), solution: o.sol, hints: o.hints || [], text: o.text };
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    p.bad = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }); }).map(function (m) { return isMoney ? rd(m.v, dp).toFixed(dp) : nS(rd(m.v, dp)); });
    if (isMoney) p.good = ['$' + key, key + '0'];
    return p;
  }
  function upField(label, exact, o) {
    o = o || {};
    return { label: label, before: '$', after: o.after, chk: upChk(exact, o.bad), key: rd(exact, 3).toFixed(3), show: t('\\$' + rd(exact, 3).toFixed(3)) };
  }
  function mfld(label, ans, o) { o = o || {}; return { label: label, name: o.name, before: '$', after: o.after, chk: amtChk(ans, o), key: r2(ans).toFixed(2), show: t(Mt(ans)), bad: (o.diag || []).map(function (m) { return r2(m.v).toFixed(2); }) }; }
  /* several boxes (specs [{label, name, before, after, mode, ph, chk, key, show}]). Grading: all right → correct; one box wrong
   * in a set of 3 or more with no recognized mistake → 'u1t-one-box' (small), of 2 → 'u1t-half-box' (bigger); one recognized
   * mistake → its own code; several wrong boxes with the same recognized mistake → that code; otherwise 'u1t-many-box'. */
  function multiChk(checks, labels) {
    return function (resp) {
      resp = resp || [];
      var res = checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      var lab = function (i) { return '<b>' + labels[i] + ':</b> '; };
      var wi = [], fi = [];
      res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); });
      if (!wi.length && !fi.length) return ok();
      if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lab(fi[0]) + (f0.hint || 'Check this one again.')); }
      var w0 = res[wi[0]], hint = lab(wi[0]) + (w0.hint || 'Check this one again.');
      if (wi.length === 1) {
        if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
        return wrong(res.length >= 3 ? 'u1t-one-box' : 'u1t-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
      return wrong('u1t-many-box', hint);
    };
  }
  function fieldsPart(prompt, specs, sol, hints, text) {
    var labels = specs.map(function (s) { return String(s.name || s.label).replace(/:$/, '').replace(/<[^>]+>/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s) { return { label: s.label, name: s.name || s.label.replace(/:$/, ''), before: s.before, after: s.after, mode: s.mode, placeholder: s.ph, wide: s.mode === 'text' }; }) },
      check: multiChk(specs.map(function (s) { return s.chk; }), labels), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return s.label + ' ' + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    // a wrong answer for the checks: every box but the first right, the first one a recognized mistake (or way off)
    var b0 = (specs[0].bad || []).filter(function (x) { return x !== String(specs[0].key); })[0];
    p.bad = [specs.map(function (s, i) { return i === 0 ? (b0 || '99999') : String(s.key); })];
    return p;
  }
  /* "Which is cheaper, and by how much?": a word box + a money box. The amount decides the credit: right amount but the
   * wrong (or unclear) choice → 'u1t-which' (bigger); a wrong amount → its own code. */
  function whichAmtPart(prompt, o) {
    var amt = amtChk(o.amt, { alts: o.alts, diag: o.diag });
    var check = function (resp) {
      resp = resp || []; var w = whichOf(resp[0], o.right, o.wrongs), a = amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.whichLabel + '</b> Type your choice.');
      if (a.v === 'form') return form(a.code, '<b>By how much:</b> ' + (a.hint || 'Check the format.'));
      if (w === 'right' && a.v === 'correct') return ok();
      if (w !== 'right' && a.v === 'correct') return wrong('u1t-which', w === 'both' || w === 'none' ? 'Type just one choice: ' + o.nudge : o.why);
      return wrong(a.code || 'value', '<b>By how much:</b> ' + (a.hint || 'Find each total, then subtract.'));
    };
    var key = [o.rightKey, r2(o.amt).toFixed(2)];
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.whichLabel, name: 'Cheaper', mode: 'text', placeholder: o.ph, wide: true }, { label: 'By how much:', name: 'By how much', before: '$' }] },
      check: check, key: key, answer: o.whichLabel + ' <b>' + o.rightKey + '</b><br>By how much: ' + MM(o.amt), solution: o.sol, hints: o.hints || [], text: o.text,
      bad: [[o.wrongKey, key[1]]].concat((o.diag || []).filter(function (m) { return m && isFinite(m.v) && [o.amt].concat(o.alts || []).every(function (y) { return Math.abs(r2(m.v) - r2(y)) > 0.004; }); }).map(function (m) { return [o.rightKey, r2(m.v).toFixed(2)]; })),
      good: [['the ' + o.rightKey, '$' + key[1]]] };
  }
  function reasonMC(r, prompt, right, wrongs, sol, hints, text) {
    return P.mc(r, prompt, [{ html: right, right: true }].concat(wrongs.map(function (w) { return { html: w[0], why: w[1] }; })), sol, hints || [], text);
  }
  /* an MC of numbers: opts [{v, right, why}] (values must differ) */
  function numMC(r, prompt, opts, fmt, sol, hints, text) {
    return P.mc(r, prompt, opts.map(function (o) { return { html: fmt(o.v), right: !!o.right, why: o.why }; }), sol, hints || [], text);
  }
  /* a board or rate table (HTML) */
  function table(head, rows, title) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em">' + (title ? '<tr><th colspan="' + head.length + '" ' + th + '>' + title + '</th></tr>' : '') +
      '<tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  /* the ratio kit from js/lessons/u1l3.js (looked up when a question is made) */
  function RX() { var k = HW.u1ratio; if (!k) throw new Error('the Unit 1 test needs HW.u1ratio from js/lessons/u1l3.js'); return k; }
  Object.assign(A, { readNum: readNum, amtChk: amtChk, upChk: upChk, whichOf: whichOf, amtPart: amtPart, upField: upField, mfld: mfld, multiChk: multiChk, fieldsPart: fieldsPart,
    whichAmtPart: whichAmtPart, reasonMC: reasonMC, numMC: numMC, table: table, RX: RX });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u1t-comma': 'Comma instead of a decimal point', 'u1t-places': 'Not rounded to the place asked', 'u1t-round-dir': 'Rounded the wrong way', 'u1t-keep-dec': 'Unit price rounded too much to compare',
    'u1t-pct-sign': 'Money written with a % sign', 'u1t-as-pct': 'Gave the decimal instead of the percent', 'u1t-which': 'Right amount, wrong (or unclear) choice',
    'u1t-one-box': 'One box of several wrong', 'u1t-half-box': 'One of the two boxes wrong', 'u1t-many-box': 'Several boxes wrong',
    'u1t-flip': 'Divided the wrong way', 'u1t-times': 'Multiplied instead of dividing', 'u1t-no-convert': 'Did not change the units', 'u1t-unit-ans': 'Right amount in the other unit (mL / L, g / kg)',
    'u1t-prop-added': 'Proportion: added instead of scaling', 'u1t-prop-flip': 'Proportion: scaled the wrong way', 'u1t-prop-times': 'Proportion: multiplied the two given terms',
    'u1t-no-x100': 'Forgot × 100', 'u1t-per-g': 'Price per gram (or mL) instead of per 100', 'u1t-per-kg': 'Price per kg (or L) instead of per 100 g (or mL)',
    'u1t-fuel-only': 'Gave the litres of gas instead of the cost', 'u1t-fuel-no100': 'Used L/100 km as litres per km',
    'u1t-markup-only': 'Gave the markup instead of the retail price', 'u1t-pct-dollars': 'Used the percent as dollars', 'u1t-sub-pct': 'Took the percent off instead of adding it',
    'u1t-tax-only': 'Gave the tax instead of the total', 'u1t-gst-only': 'Used only the GST (left out the PST)', 'u1t-compound': 'Multiplied the two tax rates instead of adding them',
    'u1t-gave-discount': 'Gave the discount instead of the sale price', 'u1t-added-pct': 'Added the percent instead of taking it off', 'u1t-divided': 'Divided by the exchange rate instead of multiplying',
    'u1t-multiplied': 'Multiplied by the exchange rate instead of dividing', 'u1t-per-part': 'Gave one part instead of the share', 'u1t-equal': 'Split equally instead of in the ratio',
    'u1t-term-div': 'Divided the total by one term', 'u1t-div-new': 'Percent: divided by the new (or selling) price', 'u1t-ratio-pct': 'Percent: new ÷ old × 100 (no subtraction)',
    'u1t-gave-markup': 'Gave the markup in dollars instead of the percent', 'u1t-gave-saving': 'Gave the dollars saved instead of the percent', 'u1t-no-disc': 'Left out the discount',
    'u1t-no-tax': 'Left out the tax', 'u1t-rate-sub': 'Combined the discount and tax rates by adding/subtracting', 'u1t-tax-reg': 'Tax worked on the regular price',
    'u1t-buy-rate': 'Used the buying rate instead of the selling rate', 'u1t-sell-rate': 'Used the selling rate instead of the buying rate',
    'u1t-no-ship': 'Left out shipping', 'u1t-no-ustax': 'Left out the US sales tax', 'u1t-gst-us': 'Used GST on the US price', 'u1t-not-converted': 'Left the US price in US dollars',
    'u1t-no-gst': 'Compared with the Calgary price before GST', 'u1t-gave-total': 'Gave a total instead of the difference',
    'u1t-sub-pcts': 'Subtracted the two percents', 'u1t-ad-pct': 'Gave the advertised percent', 'u1t-raised-base': 'Used the raised price as the original',
    'u1t-forward': 'Worked forwards instead of backwards', 'u1t-back-add': 'Undid a discount by adding the percent back', 'u1t-back-notax': 'Did not take the GST out first',
    'u1t-tax-back-mult': 'Took the GST out by × 0.95 instead of ÷ 1.05', 'u1t-back-nodisc': 'Took out only the GST', 'u1t-stack-added': 'Added the stacked discounts',
    'u1t-round-down': 'Rounded a count to buy down', 'u1t-whole-mix': 'Used the whole mix', 'u1t-exact-pkgs': 'Paid for part of a package', 'u1t-ratio-part': 'Used part ÷ other part instead of part ÷ whole',
    'u1t-pkgs': 'Gave the number of packages instead of the cost'
  });
  HW.addPartial({
    'u1t-round-dir': 's', 'u1t-which': 'b', 'u1t-one-box': 's', 'u1t-half-box': 'b', 'u1t-many-box': 'n', 'u1t-flip': 'n', 'u1t-times': 'n', 'u1t-no-convert': 'b', 'u1t-unit-ans': 's',
    'u1t-prop-added': 'n', 'u1t-prop-flip': 'n', 'u1t-prop-times': 'n', 'u1t-no-x100': 'b', 'u1t-per-g': 'b', 'u1t-per-kg': 'b', 'u1t-fuel-only': 'b', 'u1t-fuel-no100': 'n',
    'u1t-markup-only': 's', 'u1t-pct-dollars': 'n', 'u1t-sub-pct': 'n', 'u1t-tax-only': 's', 'u1t-gst-only': 'b', 'u1t-compound': 's', 'u1t-gave-discount': 's', 'u1t-added-pct': 'n',
    'u1t-divided': 'n', 'u1t-multiplied': 'n', 'u1t-per-part': 'b', 'u1t-equal': 'n', 'u1t-term-div': 'n', 'u1t-div-new': 'b', 'u1t-ratio-pct': 'b', 'u1t-gave-markup': 'b', 'u1t-gave-saving': 'b',
    'u1t-no-disc': 'b', 'u1t-no-tax': 'b', 'u1t-rate-sub': 's', 'u1t-tax-reg': 'b', 'u1t-buy-rate': 'b', 'u1t-sell-rate': 'b', 'u1t-no-ship': 'b', 'u1t-no-ustax': 'b', 'u1t-gst-us': 'b',
    'u1t-not-converted': 'n', 'u1t-no-gst': 'b', 'u1t-gave-total': 'b', 'u1t-sub-pcts': 'n', 'u1t-ad-pct': 'n', 'u1t-raised-base': 'b', 'u1t-forward': 'n', 'u1t-back-add': 'b',
    'u1t-back-notax': 'b', 'u1t-tax-back-mult': 's', 'u1t-back-nodisc': 'n', 'u1t-stack-added': 'n', 'u1t-round-down': 's', 'u1t-whole-mix': 'n', 'u1t-exact-pkgs': 'b', 'u1t-ratio-part': 'b', 'u1t-pkgs': 'b'
  });

  /* ================= shared generators (the test and the exit slips) ================= */
  /* markup: retail from cost and markup % */
  var GOODS = [['a hockey stick', 40, 120], ['a pair of headphones', 30, 90], ['a backpack', 24, 70], ['a skateboard', 45, 110], ['a winter jacket', 60, 160], ['a phone case', 8, 20],
    ['a lamp', 22, 60], ['a pair of work boots', 55, 130], ['a toaster', 18, 45], ['a set of wrenches', 25, 70]];
  function retailPart(r, o) {
    o = o || {};
    var g = r.pick(GOODS), C = q(r.int(g[1], g[2]) + r.pick([0, 0, 0.5, 0.25, 0.75])), m = r.pick([30, 35, 40, 45, 50, 55, 60, 65, 75, 80]);
    var mk = C * m / 100, R = C + mk;
    return amtPart('A store pays ' + MM(C) + ' for ' + g[0] + ' and marks it up ' + t(m + '\\%') + '. What is the retail price?', R, {
      diag: [{ v: mk, code: 'u1t-markup-only', hint: 'That’s the markup. Add it to the cost (or multiply by ' + t(mult(m)) + ').' }, { v: C + m, code: 'u1t-pct-dollars', hint: t(m + '\\%') + ' is not ' + t('\\$' + m) + '. Change the percent to a decimal.' },
        { v: C * (1 - m / 100), code: 'u1t-sub-pct', hint: 'A markup is <b>added</b> to the cost: multiply by ' + t(mult(m)) + '.' }],
      sol: br([t('\\text{markup}=' + Mt(C) + '\\times ' + dec(m) + toM(mk)), t('\\text{retail}=' + Mt(C) + '+' + Mt(mk) + '=' + Mt(R)) + ' &nbsp;(or ' + t(Mt(C) + '\\times ' + mult(m)) + ')']),
      hints: ['Markup = cost × rate (as a decimal).', 'Retail price = cost + markup.'], text: o.text || 'retail from markup' });
  }
  /* markup percent from cost and selling price, to the nearest tenth */
  function markupPctPart(r, o) {
    o = o || {};
    var g = r.pick(GOODS);
    var v = find(function () { var C = r.int(g[1], g[2]), S = q(C * (1 + r.int(25, 95) / 100)); S = q(Math.floor(S) + r.pick([0, 0.5, 0.99, 0.49])); return [C, S]; }, function (v) { var p = (v[1] - v[0]) / v[0] * 100; return p > 20 && p < 110; });
    var C = v[0], S = v[1], mk = q(S - C), pc = mk / C * 100;
    return amtPart('A store pays ' + MM(C) + ' for ' + g[0] + ' and sells it for ' + MM(S) + '. What is the markup percent, to the nearest tenth of a percent?', pc, { dp: 1, pct: true,
      diag: [{ v: mk / S * 100, code: 'u1t-div-new', hint: 'Divide the markup by the <b>cost</b> (what the store paid), not by the selling price.' }, { v: S / C * 100, code: 'u1t-ratio-pct', hint: 'Find the markup first: selling price − cost. Then divide by the cost.' },
        { v: mk, code: 'u1t-gave-markup', hint: 'That’s the markup in dollars. Divide it by the cost and multiply by 100 to get the percent.' }],
      sol: br([t('\\text{markup}=' + Mt(S) + '-' + Mt(C) + '=' + Mt(mk)), t(c2(mk) + '\\div ' + c2(C) + '\\times 100' + toN(pc, 1) + '\\%')]),
      hints: ['Markup in dollars = selling price − cost.', 'Markup % = markup ÷ cost × 100.'], text: o.text || 'markup percent' });
  }
  /* PST + GST, or HST */
  var PROV = [{ p: 'British Columbia', c: ['Kamloops', 'Kelowna', 'Vancouver'], g: 5, s: 7, tax: '5% GST and 7% PST' }, { p: 'Saskatchewan', c: ['Regina', 'Saskatoon'], g: 5, s: 6, tax: '5% GST and 6% PST' },
    { p: 'Ontario', c: ['Toronto', 'Ottawa'], h: 13, tax: '13% HST' }, { p: 'Nova Scotia', c: ['Halifax'], h: 14, tax: '14% HST' }];
  var TAXGOODS = [['snowboard boots', 149, 289], ['a winter coat', 119, 249], ['a pair of runners', 89, 179], ['a bike helmet', 49, 119], ['a gaming headset', 59, 159], ['a tent', 129, 299]];
  function taxTotalPart(r, o) {
    o = o || {};
    var pv = r.pick(PROV), c = r.pick(pv.c), g = r.pick(TAXGOODS), Pr = q(r.int(g[1], g[2]) + r.pick([0.99, 0.49, 0.95, 0])), rate = pv.h || pv.g + pv.s;
    var tot = Pr * (1 + rate / 100), diag = [{ v: Pr * rate / 100, code: 'u1t-tax-only', hint: 'That’s the tax alone. Add it to the price.' }, { v: Pr + rate, code: 'u1t-pct-dollars', hint: t(rate + '\\%') + ' is not ' + t('\\$' + rate) + '. Multiply by ' + t(mult(rate)) + '.' }];
    if (pv.s) diag.push({ v: Pr * 1.05, code: 'u1t-gst-only', hint: pv.p + ' adds a PST too: ' + t('5\\%+' + pv.s + '\\%=' + rate + '\\%') + '.' }, { v: Pr * 1.05 * (1 + pv.s / 100), code: 'u1t-compound', hint: 'Both taxes are worked on the price: <b>add</b> the rates, ' + t('5\\%+' + pv.s + '\\%=' + rate + '\\%') + ', so multiply by ' + t(mult(rate)) + '.' });
    var L = pv.s ? [t('\\text{GST}=' + Mt(Pr) + '\\times 0.05' + toM(Pr * 0.05)), t('\\text{PST}=' + Mt(Pr) + '\\times ' + dec(pv.s) + toM(Pr * pv.s / 100)), 'Total: ' + t(Mt(Pr) + '\\times ' + mult(rate) + toM(tot))]
      : [t('\\text{HST}=' + Mt(Pr) + '\\times ' + dec(rate) + toM(Pr * rate / 100)), 'Total: ' + t(Mt(Pr) + '\\times ' + mult(rate) + toM(tot))];
    return amtPart(cap(g[0]) + ' cost' + (/^a /.test(g[0]) ? 's' : '') + ' ' + MM(Pr) + ' in ' + c + ', ' + pv.p + ' (' + pv.tax + '). What is the total with tax?', tot, { diag: diag, alts: pv.s ? [r2(Pr * 0.05) + r2(Pr * pv.s / 100) + Pr] : [],
      sol: br(L), hints: [pv.s ? 'Add the two rates: GST + PST.' : 'HST is one tax: ' + t(rate + '\\%') + '.', 'Total = price × (1 + rate).'], text: o.text || 'tax total ' + pv.p });
  }
  /* sale price from % off */
  var SALEGOODS = [['A pair of jeans', 49, 89], ['A hoodie', 39, 79], ['A camping stove', 59, 129], ['A pair of skates', 89, 229], ['A coffee maker', 45, 120], ['A desk chair', 99, 249], ['A blender', 40, 110], ['A rain jacket', 69, 149]];
  function salePart(r, o) {
    o = o || {};
    var g = r.pick(SALEGOODS), R = q(r.int(g[1], g[2]) + r.pick([0, 0.99, 0.5, 0.95])), d = r.pick([15, 20, 25, 30, 35, 40, 45, 60]), D = R * d / 100, S = R - D;
    return amtPart(g[0] + ' regularly sells for ' + MM(R) + '. It is on sale for ' + t(d + '\\%') + ' off. What is the sale price?', S, {
      diag: [{ v: D, code: 'u1t-gave-discount', hint: 'That’s the discount. Take it off the regular price (or multiply by ' + t(pay(d)) + ').' }, { v: R + D, code: 'u1t-added-pct', hint: 'A discount is taken <b>off</b>: multiply by ' + t(pay(d)) + '.' },
        { v: R - d, code: 'u1t-pct-dollars', hint: t(d + '\\%') + ' off is not ' + t('\\$' + d) + ' off. Change the percent to a decimal.' }],
      sol: br([t('\\text{discount}=' + Mt(R) + '\\times ' + dec(d) + toM(D)), t('\\text{sale price}=' + Mt(R) + '-' + Mt(r2(D)) + '=' + Mt(r2(S))) + ' &nbsp;(or ' + t(Mt(R) + '\\times ' + pay(d)) + ')']),
      hints: ['Discount = regular price × rate (as a decimal).', 'Sale price = regular price − discount.'], text: o.text || 'sale price', alts: [R - r2(D)] });
  }
  /* percent decrease from a regular price to a sale price, to the nearest tenth */
  function pctDecPart(r, o) {
    o = o || {};
    var g = r.pick(SALEGOODS);
    var v = find(function () { var R = r.int(g[1], g[2]), S = q(Math.round(R * (1 - r.int(12, 45) / 100)) + r.pick([0, 0.5, 0.99])); return [R, S]; }, function (v) { return v[1] < v[0] - 3; });
    var R = v[0], S = v[1], D = q(R - S), pc = D / R * 100;
    return amtPart(g[0] + ' that regularly costs ' + MM(R) + ' is on sale for ' + MM(S) + '. What is the percent decrease, to the nearest tenth of a percent?', pc, { dp: 1, pct: true,
      diag: [{ v: D / S * 100, code: 'u1t-div-new', hint: 'Divide the decrease by the <b>original</b> (regular) price, not by the sale price.' }, { v: S / R * 100, code: 'u1t-ratio-pct', hint: 'That’s the sale price as a percent of the regular price. Find the decrease first: regular − sale.' },
        { v: D, code: 'u1t-gave-saving', hint: 'That’s the decrease in dollars. Divide it by the regular price and multiply by 100.' }],
      sol: br([t('\\text{decrease}=' + Mt(R) + '-' + Mt(S) + '=' + Mt(D)), t(c2(D) + '\\div ' + c2(R) + '\\times 100' + toN(pc, 1) + '\\%')]),
      hints: ['Decrease = regular price − sale price.', 'Percent decrease = decrease ÷ <b>original</b> price × 100.'], text: o.text || 'percent decrease' });
  }
  /* a sale price, then tax */
  function saleTaxPart(r, o) {
    o = o || {};
    var g = r.pick(SALEGOODS), R = q(r.int(g[1], g[2]) + r.pick([0, 0.99, 0.5])), d = r.pick([15, 20, 25, 30, 35, 40]);
    var pl = r.pick([{ c: r.pick(CITIES.slice(0, 7)) + ', Alberta', rate: 5, tax: '5% GST' }, { c: 'Toronto, Ontario', rate: 13, tax: '13% HST' }, { c: 'Kelowna, BC', rate: 12, tax: '5% GST and 7% PST, 12% in all' }]);
    var S = R * (1 - d / 100), T = S * (1 + pl.rate / 100), T2 = r2(S) * (1 + pl.rate / 100);
    return amtPart(g[0] + ' regularly sells for ' + MM(R) + '. It is ' + t(d + '\\%') + ' off. What is the total you pay in ' + pl.c + ' (' + pl.tax + ')?', T, { alts: [T2],
      diag: [{ v: R * (1 + pl.rate / 100), code: 'u1t-no-disc', hint: 'Take the ' + t(d + '\\%') + ' off first, then add the tax to the <b>sale</b> price.' }, { v: S, code: 'u1t-no-tax', hint: 'That’s the sale price. Now add the ' + t(pl.rate + '\\%') + ' tax.' },
        { v: S + R * pl.rate / 100, code: 'u1t-tax-reg', hint: 'Tax goes on the <b>sale</b> price, not on the regular price.' }, { v: R * d / 100 * (1 + pl.rate / 100), code: 'u1t-gave-discount', hint: 'That’s the discount (with tax). The sale price is regular − discount.' }],
      sol: br(['Sale price: ' + t(Mt(R) + '\\times ' + pay(d) + toM(S)), 'With tax: ' + t(Mt(r2(S)) + '\\times ' + mult(pl.rate) + toM(T2))]),
      hints: ['First the sale price: regular × (1 − discount rate).', 'Then the tax on the <b>sale</b> price: × (1 + tax rate).'], text: o.text || 'sale then tax' });
  }
  /* L/100 km from litres and km */
  var VEH = ['Mateo’s truck', 'Kayla’s car', 'The family minivan', 'Liam’s SUV', 'A delivery van', 'Noor’s hatchback', 'The school bus'];
  function fuelEconPart(r, o) {
    o = o || {};
    var v = find(function () { var e = pickR(r, [5.5, 13.5, 0.1]), d = pickR(r, [250, 900, 10]); return [e, d, q(e * d / 100)]; }, function (v) { return v[2] >= 15 && v[2] <= 110; }, [8.5, 560, 47.6]);
    var e = v[0], d = v[1], L = v[2];
    return amtPart(r.pick(VEH) + ' used ' + t(N(L)) + ' L of gas to drive ' + t(N(d)) + ' km. What is its fuel economy in L/100 km?', e, { dp: 1, plain: true, after: 'L/100 km',
      diag: [{ v: L / d, code: 'u1t-no-x100', hint: 'That’s litres per <b>1</b> km. Multiply by 100 to get litres per 100 km.' }, { v: d / L, code: 'u1t-flip', hint: 'L/100 km means litres ÷ km: put the litres first.' }, { v: d / L * 100, code: 'u1t-flip', hint: 'L/100 km means litres ÷ km × 100: put the litres first.' }],
      sol: t(N(L) + '\\div ' + N(d) + '\\times 100=' + N(e)) + ' L/100 km', hints: ['Fuel economy = litres ÷ km × 100.'], text: o.text || 'L/100 km' });
  }
  /* gas cost of a trip from L/100 km */
  var TRIPS = [['from Calgary to Vancouver', 970], ['from Edmonton to Jasper', 365], ['from Calgary to Banff and back', 256], ['from Red Deer to Saskatoon', 520], ['from Lethbridge to Edmonton', 515], ['from Calgary to Kelowna', 605], ['from Medicine Hat to Calgary', 295], ['from Grande Prairie to Edmonton', 460]];
  function tripCostPart(r, o) {
    o = o || {};
    var tr = r.pick(TRIPS), e = pickR(r, [6.2, 12.8, 0.1]), g = pickR(r, [1.29, 1.59, 0.01]), d = tr[1], Lt = e * d / 100, C = Lt * g;
    return amtPart(r.pick(VEH) + ' uses ' + t(N(e)) + ' L/100 km. Gas costs ' + MM(g) + '/L. What does the gas cost for a ' + t(N(d)) + ' km trip ' + tr[0] + '?', C, { alts: [r2(rd(Lt, 1) * g), r2(rd(Lt, 2) * g)],
      diag: [{ v: Lt, code: 'u1t-fuel-only', hint: 'That’s the litres of gas. Multiply by the price per litre.' }, { v: e * d * g, code: 'u1t-fuel-no100', hint: t(N(e)) + ' L is for every <b>100</b> km: the trip is ' + t(N(d / 100)) + ' hundreds of km.' },
        { v: d / e * g, code: 'u1t-flip', hint: 'Litres = (km ÷ 100) × L/100 km, not km ÷ L/100 km.' }],
      sol: br(['Hundreds of km: ' + t(N(d) + '\\div 100=' + N(d / 100)), 'Gas: ' + t(N(d / 100) + '\\times ' + N(e) + '=' + N(rd(Lt, 3))) + ' L', 'Cost: ' + t(N(rd(Lt, 3)) + '\\times ' + c2(g) + toM(C))]),
      hints: ['How many hundreds of km is the trip? Multiply by the L/100 km to get the litres.', 'Then multiply the litres by the price per litre.'], text: o.text || 'trip gas cost' });
  }
  /* the cheapest promotion problems */
  A.retailPart = retailPart; A.markupPctPart = markupPctPart; A.taxTotalPart = taxTotalPart; A.salePart = salePart; A.pctDecPart = pctDecPart; A.saleTaxPart = saleTaxPart;
  A.fuelEconPart = fuelEconPart; A.tripCostPart = tripCostPart; A.VEH = VEH; A.GOODS = GOODS; A.SALEGOODS = SALEGOODS;

  /* ================= bank boards ================= */
  var BOARDS = [
    { USD: [1.34, 1.42], EUR: [1.46, 1.56], MXN: [0.072, 0.081], GBP: [1.71, 1.83] },
    { USD: [1.33, 1.43], EUR: [1.47, 1.57], MXN: [0.069, 0.081], GBP: [1.72, 1.84] },
    { USD: [1.35, 1.41], EUR: [1.49, 1.60], MXN: [0.070, 0.080], GBP: [1.70, 1.82] }];
  var CUR = { USD: { n: 'US dollar (USD)', pl: 'US dollars', amt: [150, 900, 50], w: function (x) { return MM(x) + ' USD'; } }, EUR: { n: 'Euro (EUR)', pl: 'euros', amt: [150, 650, 50], w: function (x) { return t(N(x)) + ' euros'; }, trip: 'a trip to Italy' },
    MXN: { n: 'Mexican peso (MXN)', pl: 'Mexican pesos', amt: [2000, 7000, 500], w: function (x) { return t(N(x)) + ' pesos'; }, trip: 'a trip to Cancun' }, GBP: { n: 'British pound (GBP)', pl: 'British pounds', amt: [100, 450, 50], w: function (x) { return t(N(x)) + ' pounds'; }, trip: 'a trip to London' } };
  function rateS(x) { return x < 1 ? x.toFixed(3) : x.toFixed(2); }
  function boardHtml(B, list) { return table(['<b>Currency</b>', '<b>We buy</b>', '<b>We sell</b>'], list.map(function (k) { return [CUR[k].n, rateS(B[k][0]), rateS(B[k][1])]; })); }
  A.BOARDS = BOARDS; A.CUR = CUR; A.boardHtml = boardHtml;

  /* ======================= the questions (paper numbers; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  var UNITS = {
    min_h: { s: 'min', b: 'h', f: 60, bad: 100, Ys: [1, 1.5, 2, 2.5, 3], Xs: [10, 15, 20, 25, 35, 40, 50, 75, 80, 100], ctx: function (a, b) { return 'Ana rides the bus for ' + a + ' and works a shift of ' + b + '. Write the ratio of her bus time to her shift time in simplest form.'; } },
    cm_m: { s: 'cm', b: 'm', f: 100, bad: 1000, Ys: [1, 1.2, 1.5, 2, 2.4, 3], Xs: [15, 20, 24, 30, 36, 40, 45, 60, 75, 80, 90], ctx: function (a, b) { return 'A carpenter cuts a piece ' + a + ' long from a board ' + b + ' long. Write the ratio of the piece to the whole board in simplest form.'; } },
    mL_L: { s: 'mL', b: 'L', f: 1000, bad: 100, Ys: [1, 1.5, 2, 2.5, 4], Xs: [100, 150, 200, 250, 300, 400, 600, 750], ctx: function (a, b) { return 'A juice mix uses ' + a + ' of concentrate for ' + b + ' of water. Write the ratio of concentrate to water in simplest form.'; } },
    g_kg: { s: 'g', b: 'kg', f: 1000, bad: 100, Ys: [1, 1.5, 2, 2.5, 3], Xs: [100, 150, 200, 250, 300, 400, 450, 600, 750], ctx: function (a, b) { return 'A bread recipe uses ' + a + ' of sugar for ' + b + ' of flour. Write the ratio of sugar to flour in simplest form.'; } } };
  function unitRatioPart(r) {
    var X = RX(), U = UNITS[r.pick(Object.keys(UNITS))];
    var v = find(function () { return [r.pick(U.Xs), r.pick(U.Ys)]; }, function (v) { var S = q(v[1] * U.f); if (v[0] >= S || S % 1) return false; var s = X.simp([v[0], S]); return s[0] <= 20 && s[1] <= 30 && X.gcd(v[0], S) > 1 && !(v[0] === 45 && v[1] === 2) && !(v[0] === 90 && v[1] === 1.5) && s[1] !== 1; });
    var a = v[0], Y = v[1], S = q(Y * U.f), want = X.simp([a, S]);
    return X.ratioPart(U.ctx(t(N(a) + uT(U.s)), t(N(Y) + uT(U.b))), want, { orig: [a, S],
      wrongs: [{ r: [a, Y], code: 'u1l3-no-convert', hint: 'Change both amounts to the <b>same unit</b> first: ' + t(N(Y) + uT(U.b) + '=' + N(S) + uT(U.s)) + '.' }, { r: [a, q(Y * U.bad)], code: 'u1l3-wrong-factor', hint: 'Check the conversion: ' + t('1' + uT(U.b) + '=' + U.f + uT(U.s)) + '.' }],
      sol: br(['Same unit: ' + t(N(Y) + uT(U.b) + '=' + N(S) + uT(U.s)) + ', so the ratio is ' + t(N(a) + ':' + N(S)) + '.'].concat(X.simpLines([a, S]))),
      hints: ['Change ' + t(N(Y) + uT(U.b)) + ' to ' + U.s + ' first.', 'Then divide both terms by their greatest common factor.'], text: 'ratio with units ' + a + U.s + ':' + Y + U.b });
  }
  var RECIPES = [{ what: 'cups of flour', for: 'pancakes', n: [12, 16, 20, 24], a: [1.5, 2, 2.5, 3] }, { what: 'cups of rice', for: 'servings', n: [4, 6, 8], a: [1, 1.5, 2, 2.5] },
    { what: 'tablespoons of drink mix', for: 'glasses of iced tea', n: [4, 6, 8], a: [3, 5, 6, 9] }, { what: 'cups of oats', for: 'granola bars', n: [12, 16, 18, 24], a: [2, 2.5, 3, 4] }];
  function recipePart(r) {
    var c = r.pick(RECIPES), v = find(function () { var n = r.pick(c.n), a = r.pick(c.a), m = r.int(Math.max(3, Math.ceil(n / 2)), n * 3); return [n, a, m]; }, function (v) { var x = v[1] * v[2] / v[0]; return v[2] !== v[0] && v[2] % v[0] !== 0 && near(x * 100, Math.round(x * 100), 1e-7); });
    var n = v[0], a = v[1], m = v[2], x = a * m / n;
    return amtPart('A recipe uses ' + t(N(a)) + ' ' + c.what + ' to make ' + t(n) + ' ' + c.for + '. How many ' + c.what + ' are needed for ' + t(m) + ' ' + c.for + '?', x, { dp: 2, plain: true,
      diag: [{ v: a + (m - n), code: 'u1t-prop-added', hint: 'Adding the same amount doesn’t keep the ratio. Set up ' + t('\\dfrac{' + N(a) + '}{' + n + '}=\\dfrac{x}{' + m + '}') + '.' }, { v: a * n / m, code: 'u1t-prop-flip', hint: 'More ' + c.for + ' need <b>more</b> ' + c.what + '. Keep matching units in matching places.' },
        { v: n * m / a, code: 'u1t-prop-flip', hint: 'Put ' + c.what + ' on top of both fractions: ' + t('\\dfrac{' + N(a) + '}{' + n + '}=\\dfrac{x}{' + m + '}') + '.' }],
      sol: br([t('\\dfrac{' + N(a) + '}{' + n + '}=\\dfrac{x}{' + m + '}'), 'Cross-multiply: ' + t(n + 'x=' + N(a) + '\\times ' + m + '=' + N(a * m)), t('x=' + N(a * m) + '\\div ' + n + '=' + N(x)) + ' ' + c.what]),
      hints: ['Write a proportion with ' + c.what + ' on top and ' + c.for + ' on the bottom.', 'Cross-multiply, then divide.'], text: 'recipe proportion' });
  }
  function unitRatePart(r) {
    if (r.chance(0.5)) {
      var p = person(r), w = pickR(r, [15.25, 21.75, 0.25]), h = r.pick([6, 7, 8, 9, 11, 12, 14, 15, 18, 22]), E = q(w * h);
      return amtPart(p.n + ' earns ' + MM(E) + ' for ' + t(h) + ' hours of work. What is ' + p.his + ' hourly rate of pay?', w, { after: '/h',
        diag: [{ v: h / E, code: 'u1t-flip', hint: 'Divide the pay by the hours: dollars per <b>hour</b>.' }, { v: E * h, code: 'u1t-times', hint: 'A rate per hour: divide the pay by the number of hours.' }],
        sol: t(Mt(E) + '\\div ' + h + '=' + Mt(w)) + ' per hour', hints: ['Pay per hour = total pay ÷ hours.'], text: 'hourly rate' });
    }
    var who = r.pick(['A bus', 'A cyclist on a long ride', 'A train', 'Rosa, driving to Banff,']), cyc = who === 'A cyclist on a long ride';
    var v = find(function () { var s0 = cyc ? r.int(14, 32) : r.int(48, 105), h0 = r.pick([1.5, 2.5, 3.5, 4.5, 2.25, 3.25]); return [s0, h0, q(s0 * h0)]; }, function (v) { return near(v[2] * 10, Math.round(v[2] * 10), 1e-9); });
    var s = v[0], hh = v[1], d = v[2];
    return amtPart(who + ' travels ' + t(N(d)) + ' km in ' + t(N(hh)) + ' h. What is the average speed in km/h?', s, { dp: 1, plain: true, after: 'km/h',
      diag: [{ v: hh / d, code: 'u1t-flip', hint: 'Speed = distance ÷ time (km per hour).' }, { v: d * hh, code: 'u1t-times', hint: 'A rate per hour: divide the distance by the hours.' }],
      sol: t(N(d) + '\\div ' + N(hh) + '=' + N(s)) + ' km/h', hints: ['Speed = distance ÷ time.'], text: 'speed' });
  }
  var UPGOODS = [{ n: 'A jar of peanut butter', u: 'g', s: [500, 680, 750, 1000, 1500], c: [55, 115] }, { n: 'A bag of shredded cheese', u: 'g', s: [320, 450, 600, 900], c: [140, 220] },
    { n: 'A box of cereal', u: 'g', s: [370, 450, 525, 750, 1200], c: [85, 160] }, { n: 'A bottle of shampoo', u: 'mL', s: [355, 400, 650, 750, 1000], c: [90, 190] }, { n: 'A bottle of olive oil', u: 'mL', s: [500, 750, 1000, 3000], c: [130, 250] },
    { n: 'A bag of coffee beans', u: 'g', s: [340, 454, 907, 1360], c: [190, 330] }];
  function unitPricePart(r) {
    var g = r.pick(UPGOODS), s0 = r.pick(g.s), uc = r.int(g.c[0], g.c[1]), Pr = q(Math.max(1, Math.round(s0 / 100 * uc) / 100) - 0.01);
    if (Pr < 1) Pr = 1.99;
    var big = g.u === 'g' ? 'kg' : 'L', sw = sz(s0, g.u, big), exact = Pr / s0 * 100;
    var bad = [{ v: s0 / Pr, code: 'u1t-flip', hint: 'Unit price = price ÷ quantity (dollars on top).' }, { v: Pr / s0, code: 'u1t-per-g', hint: 'That’s the price per 1 ' + g.u + '. Multiply by 100 for the price per 100 ' + g.u + '.' }];
    if (s0 >= 1000) bad.push({ v: Pr / (s0 / 1000), code: 'u1t-per-kg', hint: 'That’s the price per ' + big + '. Change ' + sw + ' to ' + HW.fmt(String(s0)) + ' ' + g.u + ' first: there are ' + t(nS(s0 / 100)) + ' hundreds of ' + g.u + '.' }, { v: Pr / (s0 / 1000) * 100, code: 'u1t-no-convert', hint: 'Change ' + sw + ' to ' + g.u + ' first: ' + sw + ' = ' + HW.fmt(String(s0)) + ' ' + g.u + '.' });
    var p = { prompt: g.n + ' (' + sw + ') costs ' + MM(Pr) + '. What is its unit price per 100 ' + g.u + '?', input: { type: 'number', before: '$', after: '/100 ' + g.u }, check: upChk(exact, bad), key: rd(exact, 3).toFixed(3),
      answer: t('\\$' + rd(exact, 3).toFixed(3)) + ' per 100 ' + g.u + ' (' + t(Mt(exact)) + ' to the cent)',
      solution: br([s0 >= 1000 ? sw + ' = ' + HW.fmt(String(s0)) + ' ' + g.u : '', t(c2(Pr) + '\\div ' + HW.fmt(String(s0)) + '\\times 100' + (near(exact, rd(exact, 3), 1e-9) ? '=' : '=' + raw5(exact) + '\\approx') + '\\$' + rd(exact, 3).toFixed(3)) + ' per 100 ' + g.u]),
      hints: ['Price per 100 ' + g.u + ' = price ÷ ' + g.u + ' × 100.'], text: 'unit price per 100 ' + g.u };
    p.good = [rd(exact, 2).toFixed(2), '$' + rd(exact, 4).toFixed(4)];
    p.bad = bad.filter(function (b) { return Math.abs(b.v - exact) > 0.001; }).map(function (b) { return rd(b.v, 3).toFixed(3); });
    return p;
  }
  function usdCadPart(r) {
    var R = r.pick([1.36, 1.37, 1.38, 1.38, 1.39]), it = r.pick([['A hotel room in Great Falls, Montana', 119, 219, 0], ['A hoodie at a store in Spokane', 35, 69, 0.99], ['A pair of runners in Seattle', 79, 159, 0.99], ['A concert ticket in Minneapolis', 65, 145, 0], ['A theme-park ticket in California', 99, 189, 0]]);
    var U = q(r.int(it[1], it[2]) + it[3]), C = U * R;
    return amtPart(it[0] + ' costs ' + MM(U) + ' USD. The exchange rate is ' + t('1\\text{ USD}=' + R + '\\text{ CAD}') + '. What is the cost in Canadian dollars?', C, { after: 'CAD',
      diag: [{ v: U / R, code: 'u1t-divided', hint: 'The rate starts with USD, the currency you have, so <b>multiply</b>. A Canadian price is a bigger number than the US price.' }],
      sol: 'The rate starts with USD (the currency you have): multiply.<br>' + t(Mt(U) + '\\times ' + R + toM(C)) + ' CAD', hints: ['1 USD = ' + R + ' CAD: each US dollar costs $' + R + ' Canadian.', 'Should the Canadian number be bigger or smaller?'], text: 'USD to CAD' });
  }
  function estimatePart(r) {
    var it = r.pick([['a pair of jeans', 45, 75], ['a video game', 49, 69], ['a winter jacket', 110, 190], ['a pair of skates', 140, 220], ['a backpack', 35, 60], ['a phone charger', 21, 39]]);
    var U = q(r.int(it[1], it[2]) + 0.99), R = r.pick([1.36, 1.37, 1.38, 1.39]), Ur = Math.round(U / 5) * 5 || Math.round(U), E = Math.round(Ur * 1.4);
    var opts = [{ v: E, right: true }, { v: Math.round(U), why: 'That’s still the US price. Each US dollar costs about ' + t('\\$1.40') + ' CAD, so the Canadian price is bigger.' },
      { v: Math.round(U / 1.4), why: 'That divides by the rate. A Canadian price is a <b>bigger</b> number than the US price: multiply.' }, { v: Math.round(U * 2), why: 'Each US dollar is about ' + t('\\$1.40') + ', not ' + t('\\$2') + '. Add about 40% (or a third) to the US price.' }];
    if (Math.abs(opts[3].v - E) < 4) opts[3] = { v: Math.round(U + 14), why: 'Adding ' + t('\\$14') + ' is too little. Multiply by about 1.4: add about 40% (or a third).' };
    return numMC(r, 'In Montana, ' + it[0] + ' costs ' + MM(U) + ' USD. The rate is ' + t('1\\text{ USD}=' + R + '\\text{ CAD}') + '. Which is the best estimate of the cost in Canadian dollars?', opts, function (v) { return 'about ' + t('\\$' + v) + ' CAD'; },
      br(['Round: ' + t(Mt(U) + '\\approx\\$' + Ur) + '.', 'Multiply by about 1.4: ' + t(Ur + '\\times 1.4=' + N(q(Ur * 1.4))) + ', so about ' + t('\\$' + E) + ' CAD.', '(Exact: ' + t(Mt(U) + '\\times ' + R + toM(U * R)) + '.)']), ['Round the price, then multiply by about 1.4 (or add about a third).'], 'estimate USD to CAD');
  }
  /* ---- P1: sharing in a 3-term ratio ---- */
  var SHARE = [{ s: function (ns, T, rt) { return ns[0].n + ', ' + ns[1].n + ' and ' + ns[2].n + ' share a ' + MM(T) + ' monthly rent in the ratio ' + t(rt) + ', based on the size of their bedrooms. How much does each person pay?'; }, T: [900, 2400] },
    { s: function (ns, T, rt) { return ns[0].n + ', ' + ns[1].n + ' and ' + ns[2].n + ' ran a car wash and made ' + MM(T) + '. They split it in the ratio of the hours they worked, ' + t(rt) + '. How much does each person get?'; }, T: [150, 600] },
    { s: function (ns, T, rt) { return 'Three friends, ' + ns[0].n + ', ' + ns[1].n + ' and ' + ns[2].n + ', put money in to buy a used ' + MM(T) + ' boat in the ratio ' + t(rt) + '. How much does each person pay?'; }, T: [1200, 4800] }];
  function sharePart(r) {
    var c = r.pick(SHARE), ns = people(r, 3);
    var v = find(function () { var a = [r.int(1, 7), r.int(1, 7), r.int(1, 7)], s = a[0] + a[1] + a[2], pp = r.pick([5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90, 120, 150, 160]); return { a: a, s: s, p: pp, T: s * pp }; },
      function (v) { return v.a[0] !== v.a[1] && v.a[1] !== v.a[2] && v.a[0] !== v.a[2] && RX().gcdAll(v.a) === 1 && v.T >= c.T[0] && v.T <= c.T[1]; });
    var a = v.a, s = v.s, pp = v.p, T = v.T, rt = a.join(':');
    var specs = ns.map(function (pn, i) { return mfld(pn.n + ':', a[i] * pp, { name: pn.n, diag: [{ v: pp, code: 'u1t-per-part', hint: t(Mt(pp)) + ' is one part. ' + pn.n + ' gets ' + t(a[i]) + ' parts.' }, { v: T / 3, code: 'u1t-equal', hint: 'The money is not split equally: use the ratio ' + t(rt) + '.' }, { v: T / a[i], code: 'u1t-term-div', hint: 'Divide the total by the <b>total number of parts</b>, ' + t(s) + ', to find one part.' }] }); });
    return fieldsPart(c.s(ns, T, rt), specs, br(['Total parts: ' + t(a.join('+') + '=' + s), 'One part: ' + t(Mt(T) + '\\div ' + s + '=' + Mt(pp))].concat(ns.map(function (pn, i) { return pn.n + ': ' + t(a[i] + '\\times ' + Mt(pp) + '=' + Mt(a[i] * pp)); })).concat(['Check: ' + t(a.map(function (x) { return c2(x * pp); }).join('+') + '=' + c2(T)) + ' ✓'])),
      ['Add the terms to get the total number of parts.', 'Find one part, then multiply by each person’s term.'], 'share in ' + rt);
  }
  /* ---- P2: a proportion with a unit change ---- */
  function mixPart(r) {
    if (r.chance(0.5)) {
      var k = r.pick([25, 32, 40, 50]), G = find(function () { return pickR(r, [1.5, 6, 0.5]); }, function (g) { return !(k === 50 && g === 2.5) && near(g * 1000 / k * 10, Math.round(g * 1000 / k * 10), 1e-9); }, 4), oil = G * 1000 / k;
      return amtPart('A chainsaw runs on a ' + t(k + ':1') + ' mix of gas to oil. How many millilitres of oil go with ' + t(N(G)) + ' L of gas?', oil, { dp: 1, plain: true, after: 'mL',
        diag: [{ v: G / k, code: 'u1t-unit-ans', hint: 'That’s the oil in <b>litres</b>. The question asks for millilitres: ' + t('1\\text{ L}=1000\\text{ mL}') + '.' }, { v: G * k, code: 'u1t-prop-times', hint: 'There is ' + t(k) + ' times as much gas as oil, so the oil is the gas <b>divided</b> by ' + t(k) + '.' }, { v: 1000 / k, code: 'u1t-no-convert', hint: 'That’s the oil for 1 L of gas. You have ' + t(N(G)) + ' L.' }],
        sol: br(['Gas in mL: ' + t(N(G) + '\\text{ L}=' + N(G * 1000) + '\\text{ mL}'), t('\\dfrac{' + k + '}{1}=\\dfrac{' + N(G * 1000) + '}{x}') + ', so ' + t('x=' + N(G * 1000) + '\\div ' + k + '=' + N(oil)) + ' mL of oil']),
        hints: ['Change the litres of gas to millilitres first.', k + ':1 means the gas is ' + k + ' times the oil.'], text: 'fuel mix' });
    }
    var c = r.pick([{ w: 'sports-drink powder', u: 'g', per: [500, 750], a: [25, 60] }, { w: 'liquid plant food', u: 'mL', per: [1000, 2000, 4000], a: [5, 25] }]);
    var v = find(function () { var per = r.pick(c.per), a0 = r.int(c.a[0], c.a[1]), V = pickR(r, [2, 12, 0.5]); return [per, a0, V, a0 * V * 1000 / per]; }, function (v) { return v[2] * 1000 % v[0] !== 0 && near(v[3] * 10, Math.round(v[3] * 10), 1e-9); });
    var per = v[0], a0 = v[1], V = v[2], x = v[3];
    return amtPart('The label says to mix ' + t(a0) + ' ' + c.u + ' of ' + c.w + ' with every ' + t(N(per)) + ' mL of water. How much ' + c.w + ' do you need for ' + t(N(V)) + ' L of water?', x, { dp: 1, plain: true, after: c.u,
      diag: [{ v: a0 * V / per, code: 'u1t-no-convert', hint: 'Change ' + t(N(V)) + ' L to millilitres first: ' + t(N(V) + '\\text{ L}=' + N(V * 1000) + '\\text{ mL}') + '.' }, { v: a0 * per / (V * 1000), code: 'u1t-prop-flip', hint: 'More water needs <b>more</b> ' + c.w + '.' }, { v: a0 * V, code: 'u1t-no-convert', hint: 'The ' + t(a0) + ' ' + c.u + ' is for ' + t(N(per)) + ' mL, not for 1 L.' }],
      sol: br(['Water in mL: ' + t(N(V) + '\\text{ L}=' + N(V * 1000) + '\\text{ mL}'), t('\\dfrac{' + a0 + '}{' + N(per) + '}=\\dfrac{x}{' + N(V * 1000) + '}'), t(N(per) + 'x=' + a0 + '\\times ' + N(V * 1000)) + ', so ' + t('x=' + N(x)) + ' ' + c.u]),
      hints: ['Use the same unit for the water in both ratios (mL).', 'Set up a proportion and cross-multiply.'], text: 'mix proportion' });
  }
  /* ---- P4: three sizes ---- */
  var THREE = [{ n: 'Ground coffee', u: 'g', S: [[300, 340, 400], [750, 850, 925], [1200, 1360, 1500]], c: [180, 260], small: 'bag', reason: 'coffee goes stale once the bag is open, and someone who drinks a little coffee finishes a small bag while it is fresh' },
    { n: 'Shampoo', u: 'mL', S: [[300, 355, 400], [650, 750, 800], [1000, 1200]], c: [110, 170], small: 'bottle', reason: 'a small bottle fits in a gym bag or a carry-on suitcase' },
    { n: 'Plain yogurt', u: 'g', S: [[175, 350, 500], [650, 750], [1500, 2000]], c: [50, 90], small: 'tub', reason: 'yogurt spoils, and a person living alone may not finish a big tub before it goes bad' },
    { n: 'Rice', u: 'g', S: [[900, 1000], [2000, 3000], [4000, 5000, 8000]], c: [30, 60], small: 'bag', reason: 'a small bag is easier to carry home on the bus and fits in a small cupboard' },
    { n: 'Laundry detergent', u: 'mL', S: [[1000, 1180], [1700, 2030], [3000, 4430]], c: [50, 90], small: 'jug', reason: 'a small jug is lighter to carry up to an apartment and it is a cheap way to try a new brand' }];
  function threeSizes(r, c) {
    return find(function () {
      var s = c.S.map(function (a) { return r.pick(a); }), b = r.pick([1, 2, 1]), u = r.int(c.c[0], c.c[1]) / 100;
      var us = s.map(function (x, i) { return i === b ? u : u + r.int(5, 22) / 100; });
      var pr = s.map(function (x, i) { return q(Math.max(1, Math.round(x / 100 * us[i] * 2) / 2) - 0.01); });
      return { s: s, pr: pr, up: pr.map(function (p, i) { return p / s[i] * 100; }), b: b };
    }, function (v) {
      var a = v.up.map(function (x) { return rd(x, 3); }), b = v.b, o1 = a[(b + 1) % 3], o2 = a[(b + 2) % 3];
      return o1 - a[b] >= 0.02 && o2 - a[b] >= 0.02 && Math.abs(o1 - o2) >= 0.01 && a[0] > a[b];
    });
  }
  function sizeName(c, s) { return sz(s, c.u, c.u === 'g' ? 'kg' : 'L'); }
  function threeShared(r) { var c = r.pick(THREE); return { c: c, v: threeSizes(r, c) }; }
  function threeStem(s) {
    var c = s.c, v = s.v;
    return c.n + ' comes in three sizes at a store in ' + 'Calgary.' + table(['Size'].concat(v.s.map(function (x) { return sizeName(c, x); })), [['Price'].concat(v.pr.map(function (p) { return MM(p); }))]);
  }
  function threeUP(r, s) {
    var c = s.c, v = s.v;
    var specs = v.s.map(function (x, i) { var e = v.up[i]; return upField(sizeName(c, x) + ':', e, { after: '/100 ' + c.u, bad: [{ v: x / v.pr[i], code: 'u1t-flip', hint: 'Price ÷ quantity: dollars on top.' }, { v: v.pr[i] / x, code: 'u1t-per-g', hint: 'That’s per 1 ' + c.u + '. Multiply by 100.' }, x >= 1000 ? { v: v.pr[i] / (x / 1000), code: 'u1t-per-kg', hint: 'Change ' + sizeName(c, x) + ' to ' + HW.fmt(String(x)) + ' ' + c.u + ' first.' } : null].filter(Boolean) }); });
    specs.forEach(function (sp) { sp.name = sp.label.replace(/:$/, ''); });
    var p = fieldsPart('Find the unit price of each size, per 100 ' + c.u + '. (Keep at least 3 decimal places to compare.)', specs,
      br(v.s.map(function (x, i) { return (x >= 1000 ? sizeName(c, x) + ' = ' + HW.fmt(String(x)) + ' ' + c.u + ': ' : '') + t(c2(v.pr[i]) + '\\div ' + HW.fmt(String(x)) + '\\times 100' + (near(v.up[i], rd(v.up[i], 3), 1e-9) ? '=' : '\\approx') + '\\$' + rd(v.up[i], 3).toFixed(3)); })),
      ['Unit price per 100 ' + c.u + ' = price ÷ ' + c.u + ' × 100.', 'Change kg to g (or L to mL) first.'], 'three unit prices');
    p.bad = [specs.map(function (sp, i) { return rd(v.s[i] / v.pr[i], 3).toFixed(3); })];
    return p;
  }
  function threeMC(r, s) {
    var c = s.c, v = s.v, best = sizeName(c, v.s[v.b]), small = sizeName(c, v.s[0]), large = sizeName(c, v.s[2]), cn = 'the ' + small + ' ' + c.small;
    var right = 'The <b>' + best + '</b> ' + c.small + ' is the best buy: it has the lowest price per 100 ' + c.u + '. Someone might still buy ' + cn + ' because ' + c.reason + '.';
    var w = [['The <b>' + large + '</b> ' + c.small + ' is the best buy, because the biggest size always costs the least per 100 ' + c.u + '.', 'The biggest size is not always the cheapest per 100 ' + c.u + ', so “always” is wrong. Compare the unit prices.'],
      ['The <b>' + small + '</b> ' + c.small + ' is the best buy, because it has the lowest price.', 'It costs the least to pay today, but you get less. The best buy has the lowest <b>unit</b> price.'],
      ['The <b>' + best + '</b> ' + c.small + ' is the best buy: it has the lowest price per 100 ' + c.u + '. Someone might still buy ' + cn + ' because it costs less per 100 ' + c.u + '.', 'The small ' + c.small + ' costs <b>more</b> per 100 ' + c.u + '. A reason that is not about price is about storage, spoiling, carrying or trying it first.']];
    if (v.b === 2) w[0] = ['The <b>' + sizeName(c, v.s[1]) + '</b> ' + c.small + ' is the best buy, because the middle size is always the best value.', 'No size is “always” the best value. Compare the unit prices: the lowest one is the best buy.'];
    return reasonMC(r, 'Which statement is correct?', right, w, 'Lowest unit price: the ' + best + ' ' + c.small + ' (' + t('\\$' + rd(v.up[v.b], 3).toFixed(3)) + ' per 100 ' + c.u + ').<br>A reason that is not about price: ' + c.reason + '.',
      ['The best buy has the lowest <b>unit</b> price.', 'A reason that is “not about price” is about spoiling, storing, carrying or trying a product.'], 'best buy + reason');
  }
  /* ---- P8: a bank board ---- */
  function bankShared(r) { var B = r.pick(BOARDS), f = r.pick(['EUR', 'MXN', 'GBP']); return { B: B, f: f, list: ['USD', f] }; }
  function bankStem(s) { return 'A bank in Calgary shows these rates, in Canadian dollars for 1 unit of each currency.' + boardHtml(s.B, s.list); }
  function bankBuyPart(r, s) {
    var f = s.f, C = CUR[f], B = s.B[f], n = pickR(r, C.amt), p = person(r), cost = n * B[1];
    return amtPart(p.n + ' buys ' + C.w(n) + ' in cash for ' + C.trip + '. How much does it cost ' + p.him + ' in Canadian dollars?', cost, { after: 'CAD',
      diag: [{ v: n * B[0], code: 'u1t-buy-rate', hint: 'The bank is <b>selling</b> ' + C.pl + ' to ' + p.him + ': use the “We sell” rate, ' + t(rateS(B[1])) + '.' }, { v: n / B[1], code: 'u1t-divided', hint: 'The rate is CAD for <b>1</b> unit of foreign money: multiply the number of ' + C.pl + ' by it.' }, { v: n / B[0], code: 'u1t-divided', hint: 'Multiply by the selling rate.' }],
      sol: br(['The bank sells ' + C.pl + ' at ' + t(rateS(B[1])) + '.', t(N(n) + '\\times ' + rateS(B[1]) + toM(cost)) + ' CAD']), hints: ['When you buy foreign cash, the bank <b>sells</b> it to you: “We sell”.', 'Rate = CAD for 1 unit: multiply.'], text: 'buy ' + f });
  }
  function bankCadPart(r, s) {
    var B = s.B.USD, p = person(r), Y = pickR(r, [300, 1200, 50]), U = Y / B[1];
    return amtPart(p.n + ' changes ' + MM(Y) + ' CAD into US dollars at this bank for a trip to Arizona. How many US dollars does ' + p.he + ' get?', U, { after: 'USD',
      diag: [{ v: Y / B[0], code: 'u1t-buy-rate', hint: p.n + ' is buying US dollars, so the bank <b>sells</b> them: use ' + t(B[1]) + '.' }, { v: Y * B[1], code: 'u1t-multiplied', hint: 'The rate starts with USD, the currency ' + p.he + ' <b>wants</b>: divide. ' + p.n + ' should get fewer US dollars than ' + p.his + ' Canadian dollars.' }, { v: Y * B[0], code: 'u1t-multiplied', hint: 'Divide by the selling rate.' }],
      sol: br(['Buying USD: the bank sells at ' + t(B[1]) + '. Canadian to US: divide.', t(N(Y) + '\\div ' + B[1] + toM(U)) + ' USD']), hints: ['Which rate does the bank use when it sells you US dollars?', '1 USD = ' + B[1] + ' CAD starts with the currency you want, so divide.'], text: 'CAD to USD at the bank' });
  }
  /* ---- M1: shopping across the border ---- */
  var XB = [{ it: 'pair of boots', u: [99, 179], c: 'Calgary' }, { it: 'winter jacket', u: [119, 219], c: 'Calgary' }, { it: 'pair of headphones', u: [79, 149], c: 'Red Deer' }, { it: 'pair of hockey skates', u: [129, 239], c: 'Edmonton' }, { it: 'tent', u: [109, 199], c: 'Lethbridge' }];
  function xbShared(r) {
    var c = r.pick(XB), R = r.pick([1.36, 1.37, 1.38, 1.38, 1.39]), online = r.chance(0.55);
    return find(function () {
      var U = q(r.int(c.u[0], c.u[1]) + r.pick([0, 0.99])), sh = online ? r.int(12, 28) : 0, st = online ? 0 : r.pick([6, 8, 9, 10]);
      var usT = online ? U + sh : U * (1 + st / 100), cad = r2(usT * R), delta = r.int(4, 30) * (r.chance(0.5) ? 1 : -1);
      var Cp = q(Math.round((cad + delta) / 1.05) - 0.01), cal = r2(Cp * 1.05);
      return { c: c, R: R, online: online, U: U, sh: sh, st: st, usT: usT, cad: cad, Cp: Cp, cal: cal, diff: r2(Math.abs(cad - cal)), usCheaper: cad < cal };
    }, function (s) { return s.diff >= 2 && Math.abs(s.cad - s.Cp) > 2; });
  }
  function xbStem(s) {
    return s.online ? 'A ' + s.c.it + ' costs ' + MM(s.U) + ' USD on a US website, plus ' + MM(s.sh) + ' USD for shipping (no duty or other fees). The same ' + s.c.it + ' costs ' + MM(s.Cp) + ' plus ' + t('5\\%') + ' GST at a store in ' + s.c.c + '. Use ' + t('1\\text{ USD}=' + s.R + '\\text{ CAD}') + '.'
      : 'At a store in Spokane, Washington, a ' + s.c.it + ' costs ' + MM(s.U) + ' USD plus ' + t(s.st + '\\%') + ' sales tax. The same ' + s.c.it + ' costs ' + MM(s.Cp) + ' plus ' + t('5\\%') + ' GST at a store in ' + s.c.c + '. Use ' + t('1\\text{ USD}=' + s.R + '\\text{ CAD}') + '.';
  }
  function xbCadPart(r, s) {
    var R = s.R, diag = s.online ? [{ v: s.U * R, code: 'u1t-no-ship', hint: 'Add the ' + MM(s.sh) + ' shipping to the price before you convert.' }, { v: s.usT / R, code: 'u1t-divided', hint: 'The rate starts with USD (you have USD): <b>multiply</b>.' }, { v: s.usT, code: 'u1t-not-converted', hint: 'That’s the total in US dollars. Change it to Canadian dollars.' }, { v: s.usT * R * 1.05, code: 'u1t-gst-us', hint: 'The US website charges no GST here: just the price plus shipping, converted.' }]
      : [{ v: s.U * R, code: 'u1t-no-ustax', hint: 'Add the ' + t(s.st + '\\%') + ' US sales tax first: ' + t(Mt(s.U) + '\\times ' + mult(s.st)) + '.' }, { v: s.usT / R, code: 'u1t-divided', hint: 'The rate starts with USD (you have USD): <b>multiply</b>.' }, { v: s.usT, code: 'u1t-not-converted', hint: 'That’s the total in US dollars. Change it to Canadian dollars.' }, { v: s.U * 1.05 * R, code: 'u1t-gst-us', hint: 'In Spokane you pay the ' + t(s.st + '\\%') + ' US sales tax, not GST.' }];
    return amtPart(s.online ? 'What is the total cost of buying it online, in Canadian dollars?' : 'What is the total cost of buying it in Spokane, in Canadian dollars?', s.usT * R, { after: 'CAD', alts: [r2(s.usT) * R], diag: diag,
      sol: br([s.online ? 'US total: ' + t(Mt(s.U) + '+' + Mt(s.sh) + '=' + Mt(s.usT)) + ' USD' : 'US total: ' + t(Mt(s.U) + '\\times ' + mult(s.st) + toM(s.usT)) + ' USD', 'In CAD: ' + t(Mt(r2(s.usT)) + '\\times ' + R + toM(r2(s.usT) * R))]),
      hints: [s.online ? 'Add the shipping, then convert.' : 'Add the US sales tax, then convert.', 'USD to CAD: multiply by the rate.'], text: 'cross-border cost in CAD' });
  }
  function xbWhichPart(r, s) {
    var place = s.online ? 'online' : 'Spokane', right = s.usCheaper ? (s.online ? ['online', 'website', 'us', 'usa', 'internet', 'web', 'american', 'states'] : ['spokane', 'us', 'usa', 'washington', 'american', 'states']) : ['calgary', 'red', 'deer', 'edmonton', 'lethbridge', 'canada', 'canadian', 'alberta', 'local', 'home', s.c.c.toLowerCase()];
    var wrongs = s.usCheaper ? ['calgary', 'red', 'deer', 'edmonton', 'lethbridge', 'canada', 'canadian', 'alberta', 'local', 'home', s.c.c.toLowerCase()] : (s.online ? ['online', 'website', 'us', 'usa', 'internet', 'web', 'american', 'states'] : ['spokane', 'us', 'usa', 'washington', 'american', 'states']);
    var rk = s.usCheaper ? place : s.c.c, wk = s.usCheaper ? s.c.c : place;
    var noG = r2(Math.abs(s.cad - s.Cp));
    return whichAmtPart('Which is cheaper, and by how much?', { amt: s.diff, alts: [Math.abs(s.usT * s.R - s.Cp * 1.05), Math.abs(r2(r2(s.usT) * s.R) - s.cal)], whichLabel: 'Cheaper (' + place + ' or ' + s.c.c + '):', ph: place + ' or ' + s.c.c, right: right, wrongs: wrongs, rightKey: rk, wrongKey: wk,
      why: 'Compare the two totals in Canadian dollars: the smaller one is cheaper.', nudge: 'type ' + place + ' or ' + s.c.c + '.',
      diag: [{ v: noG, code: 'u1t-no-gst', hint: 'The ' + s.c.c + ' price has ' + t('5\\%') + ' GST added: ' + t(Mt(s.Cp) + '\\times 1.05') + '.' }, { v: Math.min(s.cad, s.cal), code: 'u1t-gave-total', hint: 'That’s the cheaper total. Subtract to find <b>how much</b> cheaper it is.' }, { v: Math.abs(r2(s.usT) - s.cal), code: 'u1t-not-converted', hint: 'Compare in Canadian dollars: convert the US total first.' }],
      sol: br([s.c.c + ': ' + t(Mt(s.Cp) + '\\times 1.05' + toM(s.Cp * 1.05)), cap(s.online ? 'online' : 'Spokane') + ': ' + t(Mt(s.cad)) + ' (from the last part)', t(Mt(Math.max(s.cad, s.cal)) + '-' + Mt(Math.min(s.cad, s.cal)) + '=' + Mt(s.diff)), '<b>' + rk + '</b> is cheaper by ' + MM(s.diff) + '.']),
      hints: ['Find the ' + s.c.c + ' total with GST.', 'Compare both totals in Canadian dollars and subtract.'], text: 'cross-border: which is cheaper' });
  }
  /* ---- M2: the fake deal ---- */
  var FAKE = [[20, 25], [25, 30], [10, 20], [20, 30], [50, 40], [30, 40], [40, 50], [25, 40], [25, 20], [20, 40], [60, 50]];
  function fakePart(r) {
    var ab = r.pick(FAKE), a = ab[0], b = ab[1], g = r.pick([['a blender', [40, 90]], ['a space heater', [60, 120]], ['a pair of boots', [80, 160]], ['an air fryer', [80, 140]], ['a desk lamp', [30, 70]]]);
    var U = find(function () { return r.int(g[1][0], g[1][1]); }, function (u) { return near(u * (1 + a / 100) * 100, Math.round(u * (1 + a / 100) * 100), 1e-7); });
    var R = q(U * (1 + a / 100)), S = R * (1 - b / 100), save = (U - S) / U * 100;
    return amtPart('A store usually sells ' + g[0] + ' for ' + MM(U) + '. One week it raises the price by ' + t(a + '\\%') + '. The next week it advertises the ' + g[0].replace(/^an? /, '') + ' at “' + t(b + '\\%') + ' off!” Compared with the <b>usual</b> price, what percent do you really save? (Give the percent to the nearest tenth; type 0 if you save nothing.)', save, { dp: 1, pct: true,
      diag: [{ v: b - a, code: 'u1t-sub-pcts', hint: 'Percents of different prices can’t be subtracted. Find the raised price, then the sale price, then compare with the usual price.' }, { v: b, code: 'u1t-ad-pct', hint: 'The ' + t(b + '\\%') + ' is taken off the <b>raised</b> price, not the usual price. Find the sale price and compare it with ' + MM(U) + '.' },
        { v: U - S, code: 'u1t-gave-saving', hint: 'That’s the saving in dollars. Divide by the usual price and multiply by 100.' }, { v: (U - S) / S * 100, code: 'u1t-div-new', hint: 'Divide the saving by the <b>usual</b> price (the original).' }, { v: (R - S) / U * 100, code: 'u1t-raised-base', hint: 'The saving is from the <b>usual</b> price: usual − sale.' }],
      sol: br(['Raised price: ' + t(Mt(U) + '\\times ' + mult(a) + '=' + Mt(R)), '“Sale” price: ' + t(Mt(R) + '\\times ' + pay(b) + toM(S)), 'Real saving: ' + t(Mt(U) + '-' + Mt(r2(S)) + '=' + Mt(r2(U - S))), 'Percent: ' + t(c2(U - S) + '\\div ' + c2(U) + '\\times 100' + toN(save, 1) + '\\%') + (near(save, 0) ? ' — the “sale” saves nothing.' : ', not ' + t(b + '\\%') + '.')]),
      hints: ['Work out the raised price first, then the sale price.', 'Compare the sale price with the <b>usual</b> price: saving ÷ usual × 100.'], text: 'fake deal real percent' });
  }
  /* ---- M3: backwards from the total paid ---- */
  function backPart(r) {
    var d = r.pick([15, 20, 25, 30, 40]), Rg = find(function () { return 20 * r.int(2, 12); }, function (x) { return near(x * (1 - d / 100), Math.round(x * (1 - d / 100)), 1e-9); }), S = q(Rg * (1 - d / 100)), T = q(S * 1.05), g = r.pick(['backpack', 'pair of hiking boots', 'jacket', 'drill', 'set of headphones', 'carry-on suitcase']), p = person(r);
    return amtPart('After ' + t(d + '\\%') + ' off, plus ' + t('5\\%') + ' GST, ' + p.n + ' paid ' + MM(T) + ' for a ' + g + '. What was the regular price before the discount and the tax?', Rg, {
      diag: [{ v: T * (1 - d / 100), code: 'u1t-forward', hint: 'Work backwards: undo the GST (÷ 1.05), then undo the discount (÷ ' + pay(d) + ').' }, { v: S * (1 + d / 100), code: 'u1t-back-add', hint: 'The ' + t(d + '\\%') + ' was taken off the <b>regular</b> price, so the sale price is ' + t(100 - d + '\\%') + ' of it: divide by ' + t(pay(d)) + '.' },
        { v: T / (1 - d / 100), code: 'u1t-back-notax', hint: 'Take the GST out first: ' + t(Mt(T) + '\\div 1.05') + ' is the sale price.' }, { v: T * 0.95 / (1 - d / 100), code: 'u1t-tax-back-mult', hint: 'To take out 5% GST, divide by 1.05 (× 0.95 is not quite the same).' },
        { v: S, code: 'u1t-back-nodisc', hint: 'That’s the sale price. Now undo the ' + t(d + '\\%') + ' off.' }],
      sol: br(['Undo the GST: ' + t(Mt(T) + '\\div 1.05=' + Mt(S)) + ' (the sale price).', 'The sale price is ' + t(100 - d + '\\%') + ' of the regular price: ' + t(Mt(S) + '\\div ' + pay(d) + '=' + Mt(Rg)), 'Check: ' + t(Mt(Rg) + '\\times ' + pay(d) + '\\times 1.05=' + Mt(T)) + ' ✓']),
      hints: ['Undo the last step first: the GST was added last (÷ 1.05).', 'After ' + d + '% off you pay ' + (100 - d) + '% of the regular price.'], text: 'backwards to the regular price' });
  }
  /* ---- M4: a stacked discount against one discount ---- */
  var STACK = [[25, 10], [30, 20], [20, 15], [40, 10], [30, 10], [20, 20], [25, 20], [40, 20], [30, 15]];
  function stackPart(r) {
    var ab = r.pick(STACK), a = ab[0], b = ab[1], eff = 100 - (100 - a) * (100 - b) / 100, sum = a + b;
    var cands = [], lo = Math.floor(eff) + 1; for (var c0 = lo; c0 < sum; c0++) cands.push(c0);
    var Bc = cands.length && r.chance(0.75), c = Bc ? r.pick(cands) : find(function () { return r.int(Math.max(a + 2, Math.floor(eff) - 6), Math.ceil(eff) - 1); }, function (x) { return x > a && x < eff; }, Math.ceil(eff) - 1);
    var Pr = q(r.int(60, 220) + r.pick([0, 0.99])), g = r.pick(['a pair of runners', 'a winter coat', 'a pair of snow pants', 'a rice cooker', 'a hockey helmet', 'a duffel bag']);
    var stackFirst = r.chance(0.5), Ls = stackFirst ? 'A' : 'B', Lo = stackFirst ? 'B' : 'A';
    var pS = r2(r2(Pr * (1 - a / 100)) * (1 - b / 100)), pS2 = Pr * (1 - a / 100) * (1 - b / 100), pO = r2(Pr * (1 - c / 100)), diff = r2(Math.abs(pS - pO)), cheapStack = pS < pO;
    var dS = 'Store ' + Ls + ': ' + t(a + '\\%') + ' off, then an extra ' + t(b + '\\%') + ' off the sale price at the till.', dO = 'Store ' + Lo + ': ' + t(c + '\\%') + ' off.';
    var rk = cheapStack ? 'Store ' + Ls : 'Store ' + Lo, wk = cheapStack ? 'Store ' + Lo : 'Store ' + Ls;
    return whichAmtPart(cap(g) + ' costs ' + MM(Pr) + ' at two stores.<br>' + (stackFirst ? dS + '<br>' + dO : dO + '<br>' + dS) + '<br>Before tax, which store is cheaper, and by how much?', { amt: diff, alts: [Math.abs(pS2 - Pr * (1 - c / 100))],
      whichLabel: 'Cheaper (A or B):', ph: 'A or B', right: [rk.slice(-1).toLowerCase()], wrongs: [wk.slice(-1).toLowerCase()], rightKey: rk, wrongKey: wk,
      why: 'Find the price at each store. Two discounts in a row are <b>not</b> added: the second one comes off the lower price.', nudge: 'type A or B.',
      diag: [{ v: Math.abs(Pr * (1 - sum / 100) - pO), code: 'u1t-stack-added', hint: t(a + '\\%') + ' off and then ' + t(b + '\\%') + ' off is not ' + t(sum + '\\%') + ' off: the ' + t(b + '\\%') + ' comes off the sale price.' },
        { v: Math.min(pS, pO), code: 'u1t-gave-total', hint: 'That’s the lower price. Subtract the two prices to find how much cheaper.' }, { v: Math.abs(r2(Pr * (1 - a / 100)) - pO), code: 'u1t-no-disc', hint: 'Store ' + Ls + ' takes off the extra ' + t(b + '\\%') + ' too.' }],
      sol: br(['Store ' + Ls + ': ' + t(Mt(Pr) + '\\times ' + pay(a) + toM(Pr * (1 - a / 100))) + ', then ' + t(Mt(r2(Pr * (1 - a / 100))) + '\\times ' + pay(b) + toM(r2(Pr * (1 - a / 100)) * (1 - b / 100))),
        'Store ' + Lo + ': ' + t(Mt(Pr) + '\\times ' + pay(c) + toM(Pr * (1 - c / 100))), t(Mt(Math.max(pS, pO)) + '-' + Mt(Math.min(pS, pO)) + '=' + Mt(diff)), '<b>' + rk + '</b> is cheaper by ' + MM(diff) + '. (' + t(a + '\\%') + ' then ' + t(b + '\\%') + ' is the same as ' + t(N(eff) + '\\%') + ' off, not ' + t(sum + '\\%') + '.)']),
      hints: ['Store ' + Ls + ': take ' + a + '% off, then take ' + b + '% off the <b>new</b> price.', 'Find both prices, then subtract.'], text: 'stacked discount vs one discount' });
  }
  /* ---- M5: a mix in a ratio, bought in whole packages ---- */
  var MIX = [{ intro: function (a, b, V) { return 'A punch recipe mixes juice and soda in the ratio ' + t(a + ':' + b) + '. You are making ' + t(N(V)) + ' L of punch for a school dance.'; }, part: 'juice', pkg: function (J, p) { return 'Juice comes in ' + t(N(J)) + ' L jugs for ' + MM(p) + ' each.'; }, ask: 'How much will the juice cost?', u: 'L', V: [8, 30, 1], J: [1.75, 1.89, 2.5], p: [2.99, 4.49], A: [1, 4], B: [2, 5], pk: 'jugs' },
    { intro: function (a, b, V) { return 'A trail mix uses nuts and dried fruit in the ratio ' + t(a + ':' + b) + ' by mass. You are making ' + t(N(V)) + ' kg of trail mix for a class camping trip.'; }, part: 'nuts', pkg: function (J, p) { return 'Nuts come in ' + t(N(J * 1000)) + ' g bags for ' + MM(p) + ' each.'; }, ask: 'How much will the nuts cost?', u: 'kg', V: [2, 6, 0.5], J: [0.3, 0.4, 0.5], p: [3.99, 6.49], A: [2, 5], B: [1, 3], pk: 'bags' },
    { intro: function (a, b, V) { return 'A windshield-washer mix uses concentrate and water in the ratio ' + t(a + ':' + b) + '. A shop is making ' + t(N(V)) + ' L of washer fluid.'; }, part: 'concentrate', pkg: function (J, p) { return 'Concentrate comes in ' + t(N(J)) + ' L jugs for ' + MM(p) + ' each.'; }, ask: 'How much will the concentrate cost?', u: 'L', V: [20, 60, 2], J: [3.78, 4], p: [5.99, 9.49], A: [1, 2], B: [2, 4], pk: 'jugs' }];
  function mixBuyPart(r) {
    var c = r.pick(MIX), s = find(function () { var a = r.int(c.A[0], c.A[1]), b = r.int(c.B[0], c.B[1]), V = pickR(r, c.V), J = r.pick(c.J), p = q(r.int(Math.floor(c.p[0]), Math.floor(c.p[1])) + r.pick([0.49, 0.99, 0.79])); return { a: a, b: b, V: V, J: J, p: p }; },
      function (s) { var x = s.V * s.a / (s.a + s.b), n = x / s.J; return s.a !== s.b && RX().gcd(s.a, s.b) === 1 && Math.abs(n - Math.round(n)) > 0.08 && n > 1.3 && n < 14 && near(x * 1000, Math.round(x * 1000), 1e-6) && Math.ceil(x / s.J) !== Math.ceil(s.V / s.J); });
    var a = s.a, b = s.b, V = s.V, J = s.J, p = s.p, x = V * a / (a + b), n = Math.ceil(x / J - 1e-9), cost = n * p;
    return amtPart(c.intro(a, b, V) + ' ' + c.pkg(J, p) + ' ' + c.ask, cost, {
      diag: [{ v: Math.floor(x / J) * p, code: 'u1t-round-down', hint: 'You can only buy whole ' + c.pk + ', and ' + t(Math.floor(x / J)) + ' ' + c.pk + ' are not enough: round <b>up</b>.' }, { v: x / J * p, code: 'u1t-exact-pkgs', hint: 'The store sells whole ' + c.pk + ': round the number of ' + c.pk + ' up first.' },
        { v: Math.ceil(V / J) * p, code: 'u1t-whole-mix', hint: 'Only part of the mix is ' + c.part + ': ' + t(a + '\\text{ out of }' + (a + b)) + ' parts.' }, { v: Math.ceil(V * a / b / J - 1e-9) * p, code: 'u1t-ratio-part', hint: 'The ' + c.part + ' is ' + t(a) + ' of the ' + t(a + b) + ' parts: ' + t(N(V) + '\\times\\dfrac{' + a + '}{' + (a + b) + '}') + '.' },
        { v: n, code: 'u1t-pkgs', hint: 'That’s the number of ' + c.pk + '. Multiply by the price of one.' }],
      sol: br(['Total parts: ' + t(a + '+' + b + '=' + (a + b)) + '; one part: ' + t(N(V) + '\\div ' + (a + b) + toN(V / (a + b), 3)) + ' ' + c.u, cap(c.part) + ': ' + t(a + '\\times ' + N(rd(V / (a + b), 4)) + (near(x, rd(x, 3), 1e-9) ? '=' : '\\approx ') + N(rd(x, 3))) + ' ' + c.u,
        (c.u === 'kg' ? 'One bag: ' + t(N(J * 1000) + '\\text{ g}=' + N(J) + '\\text{ kg}') + '. ' : '') + cap(c.pk) + ': ' + t(N(rd(x, 3)) + '\\div ' + N(J) + toN(x / J, 2)) + ', so buy ' + t(n) + ' ' + c.pk + ' (round up).', 'Cost: ' + t(n + '\\times ' + Mt(p) + '=' + Mt(cost))]),
      hints: ['Find how much of the mix is ' + c.part + ' (use the total number of parts).', 'How many whole ' + c.pk + ' hold that much? Round up, then multiply by the price.'], text: 'ratio mix, whole packages' });
  }

  function Q(num, level, make, text) { return { num: String(num), outcome: 'N1', text: text, parts: [{ id: String(num), outcome: 'N1', level: level, make: make }] }; }
  function QS(num, level, shared, stem, makes, text) { return { num: String(num), outcome: 'N1', text: text, shared: shared, stem: stem, parts: makes.map(function (mk, i) { return { id: num + String.fromCharCode(97 + i), outcome: 'N1', level: level, make: mk }; }) }; }
  var QUESTIONS = [
    /* ---------- ratios and proportions ---------- */
    Q(1, 'BEG', unitRatioPart, 'Ratio with different units, simplest form'),
    Q(2, 'BEG', recipePart, 'Recipe proportion'),
    Q(3, 'PRG', sharePart, 'Share an amount in a 3-term ratio'),
    Q(4, 'PRG', mixPart, 'Proportion with a unit change (L to mL)'),
    /* ---------- rates ---------- */
    Q(5, 'BEG', unitRatePart, 'Unit rate: pay per hour or km/h'),
    Q(6, 'BEG', fuelEconPart, 'Fuel economy in L/100 km'),
    Q(7, 'PRG', tripCostPart, 'Gas cost of a trip from L/100 km'),
    /* ---------- unit price ---------- */
    Q(8, 'BEG', unitPricePart, 'Unit price per 100 g or 100 mL'),
    QS(9, 'PRG', threeShared, threeStem, [threeUP, threeMC], 'Three sizes: unit prices, best buy and a non-price reason'),
    /* ---------- markup and tax ---------- */
    Q(10, 'BEG', retailPart, 'Retail price from a markup percent'),
    Q(11, 'PRG', markupPctPart, 'Markup percent'),
    Q(12, 'BEG', taxTotalPart, 'Total with PST + GST or HST'),
    /* ---------- discounts ---------- */
    Q(13, 'BEG', salePart, 'Sale price from a percent off'),
    Q(14, 'PRG', pctDecPart, 'Percent decrease'),
    Q(15, 'PRG', saleTaxPart, 'Sale price, then tax'),
    /* ---------- currency ---------- */
    Q(16, 'BEG', usdCadPart, 'US dollars to Canadian dollars'),
    Q(17, 'BEG', estimatePart, 'Estimate a US price in CAD (multiple choice)'),
    QS(18, 'PRG', bankShared, bankStem, [bankBuyPart, bankCadPart], 'Bank board: buy foreign cash, change CAD to USD'),
    /* ---------- Mastery: skills combined ---------- */
    QS(19, 'MAS', xbShared, xbStem, [xbCadPart, xbWhichPart], 'Cross-border purchase vs a Calgary price with GST'),
    Q(20, 'MAS', fakePart, 'Fake deal: the real percent saved'),
    Q(21, 'MAS', backPart, 'Backwards from the total paid to the regular price'),
    Q(22, 'MAS', stackPart, 'Stacked discounts vs one discount'),
    Q(23, 'MAS', mixBuyPart, 'Ratio mix bought in whole packages')
  ];

  HW.defineTest({
    id: 'u1test', unit: 1, title: 'Unit 1 Test', outcome: 'N1', calc: true,
    blurb: 'The Unit 1 outcomes-based test (N1): ratios and proportions, rates and L/100 km, unit price and the best buy, markup and sales tax, discounts and promotions, and currency exchange, in Beginning, Progressing and Mastery boxes.',
    // Short version (~50%): Beginning keeps ratio with units, unit price, retail from markup, tax total, USD to CAD;
    // Progressing keeps sharing in a ratio, gas cost of a trip, sale then tax, the bank board (both parts);
    // Mastery keeps the cross-border purchase (both parts) and working backwards to the regular price.
    short: ['1', '5', '6', '7', '9', '11', '13', '17', '18', '19', '21'],
    questions: QUESTIONS
  });
})(window);
