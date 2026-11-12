/* Math 10-3 · Unit 1 · Lesson 8 — Setting a Price: Markup and Sales Tax (N1)
 * Assignment 8 (u1_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u1_ep08.tex, Questions 1–14).
 * NEEDS js/lessons/u1l7.js loaded first: it uses the money / percent kit HW.pctKit from Lesson 1.7.
 * Every part is a generator: the same kind of cost, markup rate (under 100%, over 100%, with cents), tax (Alberta GST,
 * BC GST + PST, Saskatchewan GST + PST, Ontario / Nova Scotia HST) and the same steps as the booklet item, with new
 * numbers (the booklet's own numbers are among the possible values; the lesson's worked-example numbers are left out).
 * Calculator allowed. Money to the cent ("$12.49", "12.49", "12.490" are right; 12.4 or 12.488 for 12.49 get a nudge,
 * no try used; rounding the wrong way is wrong with a hint). Percents with or without the % sign.
 * Recognised mistakes get their own hint: the percent not changed to a decimal, 5% as 0.5, the markup given for the
 * retail price (or the other way), the percent number added to the dollars, markup percent divided by the retail price
 * (or retail ÷ cost), tax worked on the cost instead of the retail price, the GST taken off instead of added, the two
 * markups added, taking 5% off a GST-included total instead of dividing by 1.05, and so on.
 * Conversions: the rate table and the receipts → the table input (given cells shown, blanks as boxes); "estimate the
 * GST" → an estimate box that accepts any sensible estimate; "which store is cheaper, and by how much" → a box for the
 * store or city and a box for the amount; "is she right? explain" and "give a reason" → multiple choice of reasons.
 * Outcome N1. Levels: LIM BEG EMG PRG ADV MAS (MAS: Question 14(b) and Extra 13(b)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit;
  if (!PK || !PK.money) throw new Error('u1l8 needs HW.pctKit: load js/lessons/u1l7.js before js/lessons/u1l8.js');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, M = PK.M, near = PK.near, pctOf = PK.pctOf, find = PK.find, eqM = PK.eqM;

  function dec(p) { return dS(p / 100); }                                    // 35 → "0.35"
  function dec2(p) { var s = dS(p / 100); return /\.\d$/.test(s) ? s + '0' : s; }   // 40 → "0.40" (as in the booklet)
  function mult(p) { return dS(1 + p / 100); }                              // 35 → "1.35"
  function mult2(p) { var s = mult(p); return /\.\d$/.test(s) ? s + '0' : /^\d+$/.test(s) ? s + '.00' : s; }
  function aW(w) { return (/^[aeiou]/i.test(w) ? 'An ' : 'A ') + w; }
  function nearM(v, x) { return near(v, r2(x)) || near(v, x); }
  function sol(lines) { return lines.join('<br>'); }
  function textChk(answers, wrongs, nudge) { // a word answer (a store or a city): first 3 letters are enough
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/store|the|\s|\./g, '');
      if (!s) return form('empty', 'Type your answer first.');
      for (var i = 0; i < answers.length; i++) if (s.length >= 1 && (answers[i].indexOf(s) === 0 || s.indexOf(answers[i]) === 0) && (s.length >= 3 || answers[i].length <= 1 || s === answers[i])) return ok();
      for (var j = 0; j < (wrongs || []).length; j++) if (wrongs[j][0].indexOf(s) === 0 || s.indexOf(wrongs[j][0]) === 0) return wrong(wrongs[j][1], wrongs[j][2]);
      return form('u1l8-which', nudge || 'Type the name.');
    };
  }

  /* ---- markup and retail price ---- */
  function markupDiag(C, m) {
    var mk = pctOf(m, C), R = C + r2(mk);
    return {
      markup: function (v) {
        if (nearM(v, R)) return { code: 'u1l8-gave-retail', hint: 'That’s the retail price (cost + markup). The <b>markup</b> is only the amount added: ' + t(M(C) + '\\times ' + dec(m)) + '.' };
        if (nearM(v, m * C)) return { code: 'pct-no-div', hint: 'Change ' + t(m + '\\%') + ' to a decimal first: ' + t(m + '\\%=' + dec(m)) + '.' };
        if (nearM(v, m * C / 10)) return { code: 'pct-one-place', hint: t(m + '\\%') + ' as a decimal is ' + t(dec(m)) + ' — move the decimal point <b>2</b> places left.' };
        if (nearM(v, m * C / 1000)) return { code: 'pct-three-places', hint: t(m + '\\%') + ' as a decimal is ' + t(dec(m)) + ' — move the decimal point 2 places left, not 3.' };
        if (nearM(v, C / (m / 100))) return { code: 'pct-div', hint: 'Multiply the cost by the markup rate — don’t divide.' };
        return null;
      },
      retail: function (v) {
        if (nearM(v, mk)) return { code: 'u1l8-gave-markup', hint: 'That’s the markup. The retail price is the cost <b>plus</b> the markup.' };
        if (nearM(v, C + m)) return { code: 'u1l8-added-pct', hint: 'You added ' + t(m) + ' dollars. Add the markup in dollars, ' + t(M(C) + '\\times ' + dec(m)) + ', not the percent number.' };
        if (nearM(v, C * (1 + m / 1000)) && m !== 0) return { code: 'pct-one-place', hint: 'Check the decimal: ' + t(m + '\\%=' + dec(m)) + ', so multiply by ' + t(mult(m)) + '.' };
        if (nearM(v, C + m * C)) return { code: 'pct-no-div', hint: 'Change ' + t(m + '\\%') + ' to a decimal first.' };
        return null;
      }
    };
  }
  function markupSol(C, m) { var mk = pctOf(m, C), R = C + r2(mk); return [t(m + '\\%=' + dec2(m)), 'markup ' + t('=' + M(C) + '\\times ' + dec2(m) + eqM(mk)), 'retail ' + t('=' + M(C) + '+' + M(mk) + '=' + M(R)), '(Shortcut: ' + t(M(C) + '\\times ' + mult2(m) + eqM(C * (1 + m / 100))) + ')']; }
  function markupFields(C, m, prompt) {
    var mk = pctOf(m, C), R = C + r2(mk), dg = markupDiag(C, m);
    var p = PK.fields(prompt || 'cost ' + t(M(C)) + ', markup ' + t(m + '\\%'), [{ label: 'Markup', before: '$', name: 'Markup' }, { label: 'Retail price', before: '$', name: 'Retail price' }],
      [PK.money(mk, dg.markup), PK.either(PK.money(R, dg.retail), PK.money(C * (1 + m / 100)))], [m$(mk), m$(R)], 'markup ' + t(M(mk)) + ', retail ' + t(M(R)), sol(markupSol(C, m)),
      ['Markup = cost × markup rate (as a decimal).', 'Retail price = cost + markup.'], 'markup ' + m + '% on ' + C);
    p.bad = [[m$(R), m$(mk)], [m$(mk), m$(mk)]];
    return p;
  }
  /* ---- markup percent / percent increase ---- */
  function incPart(C, R, o) {
    o = o || {}; var inc = R - C, P = inc / C * 100, ans = rnd(P, 1), exact = near(P, ans), word = o.word || 'markup';
    var dg = function (v) {
      if (near(v, rnd(inc / R * 100, 1)) || near(v, inc / R * 100)) return { code: 'u1l8-div-new', hint: 'Divide by the <b>' + (o.orig || 'cost') + '</b> (the starting amount), not by the ' + (o.newer || 'retail price') + '.' };
      if (near(v, rnd(R / C * 100, 1)) || near(v, R / C * 100)) return { code: 'u1l8-new-over-old', hint: 'That compares the whole ' + (o.newer || 'retail price') + ' with the ' + (o.orig || 'cost') + '. Use the <b>increase</b> first: ' + t(M(R) + '-' + M(C)) + '.' };
      if (near(v, r2(inc))) return { code: 'u1l8-dollars', hint: 'That’s the ' + word + ' in dollars. Divide it by the ' + (o.orig || 'cost') + ', then multiply by ' + t('100') + '.' };
      if (near(v, rnd(inc / C, 4)) || near(v, rnd(inc / C, 3)) || near(v, rnd(inc / C, 2))) return { code: 'pct-not-x100', hint: 'Multiply by ' + t('100') + ' to write it as a percent.' };
      if (near(v, rnd(R / C, 4)) || near(v, rnd(R / C, 2))) return { code: 'u1l8-new-over-old', hint: 'Use the increase (' + t(M(R) + '-' + M(C)) + '), then divide by the ' + (o.orig || 'cost') + '.' };
      return null;
    };
    var q = inc / C, qT = near(q, rnd(q, 4)) ? dS(rnd(q, 4)) : dS(rnd(q, 4)) + '\\ldots';
    var s = sol([(o.step1 || word) + ' ' + t('=' + M(R) + '-' + M(C) + '=' + M(inc)), t(M(inc) + '\\div ' + M(C) + '=' + qT), t(qT + '\\times 100' + (exact ? '=' + dS(ans) + '\\%' : '\\approx ' + dS(ans) + '\\%'))]) + (o.solEnd || '');
    var p = PK.part(o.prompt || 'cost ' + t(M(C)) + ', retail ' + t(M(R)), PK.pct(P, 1, dg, { nr: o.nr }), dS(ans), dS(ans) + '\\%', s,
      o.hints || ['Find the ' + word + ' in dollars first (' + (o.newer || 'retail') + ' − ' + (o.orig || 'cost') + ').', 'Divide by the ' + (o.orig || 'cost') + ', then multiply by ' + t('100') + '.'], o.text || 'inc ' + C + '→' + R, o.nr ? { nr: true } : { after: '%' });
    p.bad = [dS(rnd(inc / R * 100, 1)), dS(rnd(R / C * 100, 1))].filter(function (x) { return !near(Number(x), ans); });
    return p;
  }
  /* ---- sales tax ---- */
  var PROV = {
    AB: { name: 'Alberta', tax: [['GST', 5]], cities: ['Calgary', 'Edmonton', 'Red Deer', 'Airdrie', 'Lethbridge', 'Okotoks', 'Cochrane'] },
    BC: { name: 'British Columbia', short: 'BC', tax: [['GST', 5], ['PST', 7]], cities: ['Kelowna', 'Kamloops', 'Vancouver', 'Victoria', 'Prince George'] },
    SK: { name: 'Saskatchewan', tax: [['GST', 5], ['PST', 6]], cities: ['Regina', 'Saskatoon', 'Moose Jaw'] },
    ON: { name: 'Ontario', tax: [['HST', 13]], cities: ['Toronto', 'Ottawa', 'Hamilton'] },
    NS: { name: 'Nova Scotia', tax: [['HST', 14]], cities: ['Halifax', 'Sydney', 'Truro'] }
  };
  function totRate(pv) { return PROV[pv].tax.reduce(function (s, x) { return s + x[1]; }, 0); }
  function taxDesc(pv) { var T = PROV[pv].tax; return T.length === 1 ? (T[0][1] + '% ' + T[0][0]) : T.map(function (x) { return x[1] + '% ' + x[0]; }).join(' and '); }
  /* the usual tax mistakes on a price P with rate r: [value, code, hint] */
  function taxDiag(P, r, o) {
    o = o || {}; var tax = pctOf(r, P), tot = P + r2(tax), out = [];
    out.push([P * r, 'pct-no-div', 'Change ' + t(r + '\\%') + ' to a decimal first: ' + t(r + '\\%=' + dec2(r)) + '.']);
    if (r < 10) out.push([P * r / 10, 'u1l8-five-as-half', t(r + '\\%') + ' is ' + t(dec2(r)) + ', not ' + t(dS(r / 10)) + '. A one-digit percent needs a zero after the decimal point.']);
    out.push([P * (1 + r / 10), 'u1l8-five-as-half', t(r + '\\%') + ' is ' + t(dec2(r)) + ', so the multiplier is ' + t(mult(r)) + ', not ' + t(dS(1 + r / 10)) + '.']);
    out.push([P - tax, 'u1l8-tax-off', 'Sales tax is <b>added</b> to the price, not taken off.']);
    out.push([P + r, 'u1l8-added-pct', 'You added ' + t(r) + ' dollars. Add the tax in dollars: ' + t(M(P) + '\\times ' + dec2(r)) + '.']);
    out.push([P + r / 100, 'u1l8-added-pct', 'You added ' + t(dec2(r)) + ' dollars. Multiply instead: ' + t(M(P) + '\\times ' + mult2(r)) + '.']);
    if (o.cost != null) { out.push([o.cost * (1 + r / 100), 'u1l8-tax-on-cost', 'The tax is on the <b>retail</b> price, not on the cost. The customer never sees the cost.']); out.push([pctOf(r, o.cost), 'u1l8-tax-on-cost', 'The tax is on the retail price, not on the cost.']); }
    return out;
  }
  function diagList(list, extra) {
    return function (v) { if (extra) { var h = extra(v); if (h) return h; } for (var i = 0; i < list.length; i++) if (nearM(v, list[i][0])) return { code: list[i][1], hint: list[i][2] }; return null; };
  }
  /* total with tax: accept price + each rounded tax, or the shortcut price × (1 + rate) rounded (they can differ by a cent) */
  function totalChk(P, pv, extra) {
    var T = PROV[pv].tax, r = totRate(pv), sep = P + T.reduce(function (s, x) { return s + r2(pctOf(x[1], P)); }, 0), sc = P * (1 + r / 100);
    var dg = diagList(taxDiag(P, r).filter(function (x) { return !nearM(x[0], sep) && !nearM(x[0], sc); }), function (v) {
      if (extra) { var h = extra(v); if (h) return h; }
      if (T.length > 1) { for (var i = 0; i < T.length; i++) if (nearM(v, P + pctOf(T[i][1], P))) return { code: 'u1l8-one-tax', hint: 'That has only the ' + T[i][0] + '. Add both taxes (' + taxDesc(pv) + ').' }; }
      if (nearM(v, pctOf(r, P))) return { code: 'u1l8-tax-only', hint: 'That’s the tax. Add it to the price to get the total.' };
      return null;
    });
    return PK.either(PK.money(sep, dg), PK.money(sc, dg));
  }
  function taxChk(P, rate, name) {
    return PK.money(pctOf(rate, P), diagList(taxDiag(P, rate).filter(function (x) { return !/u1l8-tax-off|u1l8-added-pct/.test(x[1]); }).concat([[P + pctOf(rate, P), 'u1l8-total-for-tax', 'That’s the total. The ' + name + ' is just the tax: ' + t(M(P) + '\\times ' + dec2(rate)) + '.']])));
  }
  function taxSol(P, pv) {
    var T = PROV[pv].tax, r = totRate(pv), sum = P, L = [];
    T.forEach(function (x) { var tx = pctOf(x[1], P); sum += r2(tx); L.push(x[0] + ' ' + t('=' + M(P) + '\\times ' + dec2(x[1]) + eqM(tx))); });
    L.push('total ' + t('=' + M(P) + T.map(function (x) { return '+' + M(pctOf(x[1], P)); }).join('') + '=' + M(sum)) + (T.length > 1 ? ' &nbsp; (check: ' + t(M(P) + '\\times ' + mult2(r) + eqM(P * (1 + r / 100))) + ')' : ' &nbsp; (shortcut: ' + t(M(P) + '\\times ' + mult2(r) + eqM(P * (1 + r / 100))) + ')'));
    return L;
  }
  function taxFields(P, pv, prompt, text) {
    var T = PROV[pv].tax, fields = [], chks = [], keys = [], ans = [];
    T.forEach(function (x) { fields.push({ label: x[0], before: '$', name: x[0] }); chks.push(taxChk(P, x[1], x[0])); keys.push(m$(pctOf(x[1], P))); ans.push(x[0] + ' ' + t(M(pctOf(x[1], P)))); });
    var sum = P + T.reduce(function (s, x) { return s + r2(pctOf(x[1], P)); }, 0);
    fields.push({ label: 'Total', before: '$', name: 'Total' }); chks.push(totalChk(P, pv)); keys.push(m$(sum)); ans.push('total ' + t(M(sum)));
    var p = PK.fields(prompt, fields, chks, keys, ans.join(', '), sol(taxSol(P, pv)), ['Each tax = price × its rate (as a decimal). Round each to the cent.', 'Total = price + the tax' + (T.length > 1 ? 'es' : '') + '.'], text || 'tax ' + pv + ' ' + P);
    p.bad = [keys.map(function () { return m$(P); }), keys.slice(0, -1).map(function (k) { return k; }).concat([m$(P - pctOf(totRate(pv), P))])];
    return p;
  }

  /* ---- prices ---- */
  function price99(r, lo, hi) { return r.int(lo, hi) + r.pick([0.99, 0.49, 0.99, 0.95, 0.79, 0]); }
  var NOT_EX = [[48, 40], [6.5, 180], [0.9, 150], [85, 60]];                 // the lesson's worked examples (cost, markup)
  function okMk(C, m) { return !NOT_EX.some(function (e) { return near(e[0], C) && e[1] === m; }); }

  HW.addCodes({
    'u1l8-gave-retail': 'Gave the retail price for the markup', 'u1l8-gave-markup': 'Gave the markup for the retail price', 'u1l8-added-pct': 'Added the percent number to the dollars',
    'u1l8-div-new': 'Percent increase: divided by the new price', 'u1l8-new-over-old': 'Percent increase: new ÷ original (not the increase)', 'u1l8-dollars': 'Gave the increase in dollars, not the percent',
    'u1l8-five-as-half': '5% (a one-digit percent) as 0.5', 'u1l8-tax-off': 'Took the tax off instead of adding it', 'u1l8-tax-on-cost': 'Worked the tax on the cost instead of the retail price',
    'u1l8-one-tax': 'Added only one of the two taxes', 'u1l8-tax-only': 'Gave the tax instead of the total', 'u1l8-total-for-tax': 'Gave the total instead of the tax', 'u1l8-which': 'Store/city answer unreadable',
    'u1l8-whole-case': 'Gave the price of the whole case', 'u1l8-per-item': 'Divided the wrong way for the price of one', 'u1l8-one-night': 'Left out the number of nights', 'u1l8-tax-one-night': 'Taxed only one night',
    'u1l8-wrong-store': 'Picked the wrong store/city', 'u1l8-tag-diff': 'Compared the prices before tax', 'u1l8-cost-diff': 'Compared what the stores paid', 'u1l8-qty': 'Left out the quantity on a receipt line',
    'u1l8-subtotal': 'Receipt: subtotal wrong', 'u1l8-change': 'Receipt: amount left on card worked from the wrong amount', 'u1l8-gst-subtotal': 'Receipt: GST not on the subtotal', 'u1l8-added-markups': 'Added the two markup percents',
    'u1l8-took-5-off': 'Took 5% off the total instead of dividing by 1.05', 'u1l8-took-off': 'Took the markup off the retail price instead of dividing', 'u1l8-mult-not-div': 'Multiplied instead of dividing (working backwards)',
    'u1l8-mult-rate': 'Multiplier: gave the rate without the 1', 'u1l8-mult-100': 'Multiplier: added 100 instead of 1', 'u1l8-gst-only': 'Used GST only where there is more tax', 'u1l8-retail-only': 'Left out the tax', 'u1l8-cost-total': 'Gave the cost of the items, not the price'
  });
  HW.addPartial({
    'u1l8-gave-retail': 's', 'u1l8-gave-markup': 's', 'u1l8-added-pct': 'n', 'u1l8-div-new': 'b', 'u1l8-new-over-old': 'b', 'u1l8-dollars': 'b', 'u1l8-five-as-half': 'b', 'u1l8-tax-off': 'n',
    'u1l8-tax-on-cost': 'b', 'u1l8-one-tax': 's', 'u1l8-tax-only': 's', 'u1l8-total-for-tax': 's', 'u1l8-whole-case': 'b', 'u1l8-per-item': 'n', 'u1l8-one-night': 'b', 'u1l8-tax-one-night': 'b',
    'u1l8-wrong-store': 'n', 'u1l8-tag-diff': 'n', 'u1l8-cost-diff': 'n', 'u1l8-qty': 's', 'u1l8-subtotal': 's', 'u1l8-change': 's', 'u1l8-gst-subtotal': 's', 'u1l8-added-markups': 'n',
    'u1l8-took-5-off': 'n', 'u1l8-took-off': 'n', 'u1l8-mult-not-div': 'n', 'u1l8-mult-rate': 'b', 'u1l8-mult-100': 'b', 'u1l8-gst-only': 'b', 'u1l8-retail-only': 's', 'u1l8-cost-total': 'b'
  });

  /* ---- Q1: rate table ---- */
  function rateTable(r) {
    var rates = [r.pick([25, 35, 45, 55, 65, 85, 30, 20]), 5, r.pick([13, 14, 12, 11]), r.pick([120, 125, 160, 175, 200, 250, 140]), r.pick([7.5, 2.5, 4.5, 6.5, 8.5])];
    var blanks = [], cols = rates.map(function (p) { return dS(p) + '\\%'; });
    rates.forEach(function (p, j) {
      blanks.push({ where: 'cell', i: 0, j: j, name: dS(p) + '% as a decimal', chk: PK.dec(p / 100, null, function (v) {
        if (near(v, p / 10)) return p < 10 ? { code: 'u1l8-five-as-half', hint: 'A one-digit percent needs a zero after the decimal point: ' + t(dS(p) + '\\%') + ' is less than ' + t('0.10') + '.' } : { code: 'pct-one-place', hint: 'Move the decimal point <b>2</b> places left.' };
        if (near(v, p)) return { code: 'pct-not-div100', hint: 'Divide by ' + t('100') + ' (2 places left).' };
        if (near(v, 1 + p / 100)) return { code: 'u1l8-mult-rate', hint: 'That’s the multiplier. This row is just the rate as a decimal.' };
        return null;
      }) });
      blanks.push({ where: 'cell', i: 1, j: j, name: dS(p) + '% multiplier', chk: PK.num(1 + p / 100, null, function (v) {
        if (near(v, p / 100)) return { code: 'u1l8-mult-rate', hint: 'Add the ' + t('1') + ': ' + t('1+' + dS(p / 100)) + ' (100% of the price plus the rate).' };
        if (near(v, 1 + p / 10)) return { code: 'u1l8-five-as-half', hint: t(dS(p) + '\\%=' + dS(p / 100)) + ', so the multiplier is ' + t('1+' + dS(p / 100)) + '.' };
        if (near(v, 100 + p) || near(v, 1 + p)) return { code: 'u1l8-mult-100', hint: 'Use the decimal: ' + t('1+' + dS(p / 100)) + '.' };
        return null;
      }) });
    });
    var key = { rows: ['\\text{As a decimal}', '\\text{Multiply by }(1+\\text{rate})'], cols: cols, cells: [rates.map(function (p) { return dS(p / 100); }), rates.map(function (p) { return mult(p); })] };
    return PK.tablePart('Complete the table.', { rows: key.rows, cols: cols, cells: [rates.map(function () { return null; }), rates.map(function () { return null; })], corner: '\\text{Rate}', keys: 'pctkit-money', help: 'Tap a box, then type the decimal.' },
      PK.tableChk(blanks), key, rates.map(function (p) { return t(dS(p) + '\\%=' + dS(p / 100)) + ', and ' + t('1+' + dS(p / 100) + '=' + mult(p)); }).join('<br>'),
      ['Rate as a decimal: move the decimal point 2 places left.', 'Multiplier: add ' + t('1') + ' (that’s ' + t('100\\%') + ' of the price) to the decimal.'], 'rate table ' + rates.join(','));
  }
  /* ---- receipts ---- */
  var HW_ITEMS = [['Paint brush', 4.99, 9.99], ['Roller cover', 5.49, 9.99], ['Paint, 3.78 L', 39.98, 64.98], ['Painter’s tape', 5.49, 8.99], ['Drop sheet', 6.99, 14.99], ['Sandpaper pack', 7.49, 12.99], ['Box of screws', 6.49, 11.99], ['Wood filler', 7.99, 10.99], ['Caulking tube', 4.99, 8.49], ['Work gloves', 9.99, 16.99]];
  function receiptPart(r, o) {
    var items = r.sample(HW_ITEMS, 4).map(function (it, i) { var pr = find(function () { return it[1] + r.int(0, Math.round((it[2] - it[1]) * 2)) / 2; }, function (x) { return Math.round(x * 100) % 100 === 49 || Math.round(x * 100) % 100 === 99 || Math.round(x * 100) % 100 === 98; }, it[2]); return { name: it[0], q: i < 2 ? r.int(2, 4) : 1, p: rnd(pr, 2) }; });
    if (r.chance(0.5)) { var sw = items[1]; items[1] = items[2]; items[2] = sw; }
    var amts = items.map(function (x) { return rnd(x.q * x.p, 2); }), sub = rnd(amts.reduce(function (s, x) { return s + x; }, 0), 2), gst = pctOf(5, sub), tot = rnd(sub + r2(gst), 2);
    var cash = tot < 100 ? (tot < 90 ? 100 : 110) : Math.ceil(tot / 20) * 20 + (r.chance(0.5) ? 0 : 20), change = rnd(cash - tot, 2);
    var rows = items.map(function (x) { return '\\text{' + x.name + '}'; }).concat(['\\text{Subtotal}', '\\text{GST 5\\%}', '\\textbf{Total}', '\\text{Gift card}', '\\text{Left on card}']);
    var cols = ['\\text{Qty}', '\\text{Price each}', '\\text{Amount}'];
    var cells = items.map(function (x) { return [String(x.q), M(x.p), null]; }).concat([['', '', null], ['', '', null], ['', '', null], ['', '', M(cash)], ['', '', null]]);
    var blanks = items.map(function (x, i) { return { where: 'cell', i: i, j: 2, name: x.name, chk: PK.money(amts[i], function (v) { if (x.q > 1 && near(v, x.p)) return { code: 'u1l8-qty', hint: 'The quantity is ' + t(x.q) + ': multiply ' + t(x.q + '\\times ' + M(x.p)) + '.' }; if (near(v, rnd(x.q + x.p, 2))) return { code: 'u1l8-qty', hint: 'Multiply the quantity by the price each.' }; return null; }) }; });
    var priceSum = rnd(items.reduce(function (s, x) { return s + x.p; }, 0), 2);
    blanks.push({ where: 'cell', i: 4, j: 2, name: 'Subtotal', chk: PK.money(sub, function (v) { if (near(v, priceSum)) return { code: 'u1l8-qty', hint: 'Add the <b>Amount</b> column (quantity × price each), not the prices.' }; return null; }) });
    blanks.push({ where: 'cell', i: 5, j: 2, name: 'GST', chk: PK.money(gst, function (v) { if (near(v, r2(sub * 0.5))) return { code: 'u1l8-five-as-half', hint: t('5\\%=0.05') + ', not ' + t('0.5') + '.' }; if (near(v, r2(sub * 1.05))) return { code: 'u1l8-total-for-tax', hint: 'That’s the total. The GST line is just the tax.' }; return null; }) });
    blanks.push({ where: 'cell', i: 6, j: 2, name: 'Total', chk: PK.money(tot, function (v) { if (near(v, sub)) return { code: 'u1l8-retail-only', hint: 'Add the GST to the subtotal.' }; return null; }) });
    blanks.push({ where: 'cell', i: 8, j: 2, name: 'Left on card', chk: PK.money(change, function (v) { if (near(v, rnd(cash - sub, 2))) return { code: 'u1l8-change', hint: 'What is left on the card is the gift card amount minus the <b>total</b> (with GST).' }; if (near(v, rnd(tot - cash, 2))) return { code: 'sign', hint: 'Left on card = gift card − total.' }; return null; }) });
    var keyCells = items.map(function (x, i) { return [String(x.q), M(x.p), m$(amts[i])]; }).concat([['', '', m$(sub)], ['', '', m$(gst)], ['', '', m$(tot)], ['', '', M(cash)], ['', '', m$(change)]]);
    var s = items.map(function (x, i) { return x.q > 1 ? t(x.q + '\\times ' + M(x.p) + '=' + M(amts[i])) : null; }).filter(Boolean).join('; ');
    return PK.tablePart('Complete this receipt from <b>' + o.store + '</b>, ' + o.city + ', AB. The customer pays with a ' + t(M(cash)) + ' gift card. How much is left on the card?', { rows: rows, cols: cols, cells: cells, corner: '\\text{Item}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells },
      sol([s + '.', 'subtotal ' + t('=' + amts.map(function (a) { return M(a); }).join('+') + '=' + M(sub)), 'GST ' + t('=' + M(sub) + '\\times 0.05' + eqM(gst)) + '; total ' + t('=' + M(sub) + '+' + M(gst) + '=' + M(tot)), 'left on card ' + t('=' + M(cash) + '-' + M(tot) + '=' + M(change))]),
      ['Amount = quantity × price each. Subtotal = the sum of the amounts.', 'GST = subtotal × 0.05 (round to the cent). Total = subtotal + GST. Left on card = gift card − total.'], 'receipt');
  }
  function estChk(P, rate) { // an estimate of the tax: anything sensible (within 20% or 10 cents)
    var g = pctOf(rate, P), tol = Math.max(0.1, 0.2 * g);
    return function (resp) {
      var a = PK.readV(resp); if (!a.ok) return form(a.code === 'empty' ? 'empty' : 'notnumber', a.code === 'empty' ? 'Type your answer first.' : 'Enter a single number.');
      if (Math.abs(a.v - g) <= tol) return ok();
      if (Math.abs(a.v - P * rate / 10) <= Math.max(1, 0.2 * P * rate / 10)) return wrong('u1l8-five-as-half', 'That’s about ' + t(rate * 10 + '\\%') + '. For ' + t('5\\%') + ': find ' + t('10\\%') + ' (decimal point 1 place left), then take half.');
      if (Math.abs(a.v - P / 10) <= Math.max(0.05, 0.2 * P / 10)) return wrong('u1l7-other-col', 'That’s about ' + t('10\\%') + '. ' + t('5\\%') + ' is half of that.');
      return wrong('value', 'Round the price, find ' + t('10\\%') + ' (decimal point 1 place left), then take half.');
    };
  }
  function gstRowPart(P) {
    var g = pctOf(5, P), tot = P + r2(g), Pr = P >= 100 ? Math.round(P / 10) * 10 : Math.round(P), est = Pr / 20;
    var blanks = [{ where: 'cell', i: 0, j: 0, name: 'Estimate', chk: estChk(P, 5) }, { where: 'cell', i: 0, j: 1, name: 'GST', chk: taxChk(P, 5, 'GST') }, { where: 'cell', i: 0, j: 2, name: 'Total', chk: totalChk(P, 'AB') }];
    var cols = ['\\text{Estimate of GST}', '\\text{GST}', '\\text{Total}'];
    var p = PK.tablePart('Fill in this row of the table.', { rows: [M(P)], cols: cols, cells: [[null, null, null]], corner: '\\text{Price}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed). Any sensible estimate is fine.' },
      PK.tableChk(blanks), { rows: [M(P)], cols: cols, cells: [[m$(est), m$(g), m$(tot)]] },
      sol(['Estimate: ' + t(M(P) + '\\approx ' + M(Pr)) + '; ' + t('10\\%') + ' is ' + t(M(Pr / 10)) + ', half of that is about ' + t(M(est)) + '.', 'GST ' + t('=' + M(P) + '\\times 0.05' + eqM(g)), 'total ' + t('=' + M(P) + '+' + M(g) + '=' + M(tot))]),
      ['To estimate ' + t('5\\%') + ': find ' + t('10\\%') + ' (decimal point 1 place left), then take half.', 'GST = price × 0.05, rounded to the cent. Total = price + GST.'], 'GST row ' + P);
    return p;
  }
  /* ---- multiplier part (Extra 4) ---- */
  function multPart(p, label) {
    return PK.part(label, PK.num(1 + p / 100, null, function (v) {
      if (near(v, p / 100)) return { code: 'u1l8-mult-rate', hint: 'Add the ' + t('1') + ' (the ' + t('100\\%') + ' you start with): ' + t('1+' + dS(p / 100)) + '.' };
      if (near(v, 1 + p / 10)) return { code: 'u1l8-five-as-half', hint: t(p + '\\%=' + dS(p / 100)) + ', so the multiplier is ' + t('1+' + dS(p / 100)) + '.' };
      if (near(v, 100 + p) || near(v, 1 + p)) return { code: 'u1l8-mult-100', hint: 'Write the percent as a decimal and add ' + t('1') + '.' };
      return null;
    }), mult(p), mult(p), t(p + '\\%=' + dS(p / 100)) + ', so multiply by ' + t('1+' + dS(p / 100) + '=' + mult(p)) + ' (' + t('100\\%') + ' of the price plus ' + t(p + '\\%') + ').', ['Change the percent to a decimal, then add ' + t('1') + '.'], 'multiplier ' + p, { before: t('\\times') });
  }

  HW.defineLesson({
    id: 'u1l8', unit: 1, num: '8', title: 'Setting a Price: Markup and Sales Tax', outcome: 'N1',
    blurb: 'Markup and retail price, markup percent and percent increase, GST, PST and HST, and markup then tax.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1', level: 'BEG', make: function (r) { return rateTable(r); } }] },
      { num: '2', stem: 'Find the markup and the retail price.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([10, 20, 30, 40, 50, 60, 80, 12, 24]), r.pick([50, 100, 20])]; }, function (v) { return okMk(v[0], v[1]); }, [20, 50]); return markupFields(v[0], v[1]); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([64, 48, 36, 72, 84, 96, 52, 44, 28]), r.pick([25, 75, 50])]; }, function (v) { return okMk(v[0], v[1]); }, [64, 25]); return markupFields(v[0], v[1]); } },
        { id: '2c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(21, 99) * 0.4, r.pick([120, 110, 130, 140, 160, 175, 200, 250])]; }, function (v) { return okMk(v[0], v[1]) && Math.round(v[0] * 100) % 100 !== 0; }, [8.4, 120]); return markupFields(rnd(v[0], 2), v[1]); } },
        { id: '2d', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(1010, 2990) / 20, r.pick([35, 45, 15, 65, 55, 85, 30])]; }, function (v) { return okMk(v[0], v[1]) && Math.round(v[0] * 100) % 100 !== 0; }, [135.6, 35]); return markupFields(rnd(v[0], 2), v[1]); } }] },
      { num: '3', stem: function (sh) { return aW(sh.shop) + ' buys a case of ' + t(sh.n) + ' ' + sh.item + ' for ' + t(M(sh.C)) + '. It marks them up ' + t(sh.m + '\\%') + '.'; },
        shared: function (r) { return find(function () { var n = r.pick([24, 12, 18, 20, 30, 36]), u = r.int(55, 220) / 100; return { n: n, C: rnd(n * u, 2), u: u, m: r.pick([85, 65, 70, 90, 95, 80, 110, 120]), shop: r.pick(['corner store', 'gas station', 'school store', 'concession stand']), item: r.pick(['energy drinks', 'bottles of juice', 'cans of iced tea', 'bags of chips', 'chocolate bars']) }; }, function (s) { var mk = pctOf(s.m, s.u); return !near(mk, r2(mk)) && !(s.n === 24 && near(s.C, 21.6)); }, { n: 24, C: 27.6, u: 1.15, m: 85, shop: 'corner store', item: 'energy drinks' }); },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { var p = PK.moneyPart('What does the ' + sh.shop + ' pay for one?', sh.u, function (v) { if (near(v, rnd(sh.n / sh.C, 2)) || near(v, rnd(sh.n / sh.C, 4))) return { code: 'u1l8-per-item', hint: 'Divide the <b>price</b> by the number of items: ' + t(M(sh.C) + '\\div ' + sh.n) + '.' }; if (near(v, sh.C * sh.n)) return { code: 'u1l8-per-item', hint: 'For the price of one, divide by ' + t(sh.n) + '.' }; return null; },
            t(M(sh.C) + '\\div ' + sh.n + '=' + M(sh.u)), ['The case costs ' + t(M(sh.C)) + ' for ' + t(sh.n) + ' items. Share the cost equally.'], 'cost of one'); return p; } },
          { id: '3b', level: 'EMG', make: function (r, sh) {
            var R = sh.u * (1 + sh.m / 100), mk = pctOf(sh.m, sh.u);
            var p = PK.moneyPart('What is the retail price of one?', R, function (v) {
              if (nearM(v, sh.C * (1 + sh.m / 100))) return { code: 'u1l8-whole-case', hint: 'That’s the price of the whole case. Mark up the price of <b>one</b> from (a).' };
              if (nearM(v, mk)) return { code: 'u1l8-gave-markup', hint: 'That’s the markup on one. Add it to the cost of one (or multiply by ' + t(mult(sh.m)) + ').' };
              if (nearM(v, sh.u + sh.m)) return { code: 'u1l8-added-pct', hint: 'Add the markup in dollars, not the percent number.' };
              if (nearM(v, sh.u * (1 + sh.m / 1000))) return { code: 'pct-one-place', hint: 'Check the decimal: ' + t(sh.m + '\\%=' + dec(sh.m)) + '.' };
              return null;
            }, t(M(sh.u) + '\\times ' + mult2(sh.m) + eqM(R)) + '<br>One sells for ' + t(M(R)) + '. (Or: markup ' + t(M(sh.u) + '\\times ' + dec2(sh.m) + eqM(mk)) + ', then ' + t(M(sh.u) + '+' + M(mk) + '=' + M(sh.u + r2(mk))) + '.)', ['Use the cost of one from (a).', 'Retail = cost × (1 + markup rate). Round to the cent at the end.'], 'retail of one');
            var alt = PK.money(sh.u + r2(mk)), c0 = p.check; p.check = PK.either(c0, alt);
            p.bad = [m$(sh.C * (1 + sh.m / 100))];
            return p;
          } }] },
      { num: '4', stem: 'Find the markup percent. Round to the nearest tenth of a percent if needed.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var v = find(function () { var C = r.pick([40, 20, 60, 80, 120, 16, 24]), m = r.pick([25, 50, 20, 75, 40]); return [C, C * (1 + m / 100)]; }, function (v) { return !(v[0] === 32 && v[1] === 56) && v[1] % 1 === 0; }, [40, 50]); return incPart(v[0], v[1]); } },
        { id: '4b', level: 'EMG', make: function (r) { var v = find(function () { var C = r.pick([12.5, 7.5, 2.5, 22.5, 17.5]), m = r.pick([140, 120, 160, 180, 200, 220]); return [C, C * (1 + m / 100)]; }, function (v) { return near(v[1], r2(v[1])); }, [12.5, 30]); return incPart(v[0], rnd(v[1], 2)); } },
        { id: '4c', level: 'EMG', make: function (r) { var v = find(function () { var C = r.int(150, 650) / 100, R = r.int(Math.ceil(C * 1.5), Math.floor(C * 3)) + 0.99; return [rnd(C, 2), rnd(R, 2)]; }, function (v) { var P = (v[1] - v[0]) / v[0] * 100; return !near(P, rnd(P, 1)) && P > 40; }, [3.2, 7.99]); return incPart(v[0], v[1]); } }] },
      { num: '5', stem: '', parts: [
        { id: '5a', level: 'EMG', make: function (r) {
          var v = find(function () { var o = r.int(9, 22) + 0.99, n = o + r.pick([1, 2, 3, 1.5, 0.5, 2.5]); return { o: o, n: rnd(n, 2), what: r.pick(['streaming service', 'music app', 'phone plan add-on', 'game subscription']) }; }, function (s) { var P = (s.n - s.o) / s.o * 100; return !near(P, rnd(P, 1)); }, { o: 16.99, n: 18.99, what: 'streaming service' });
          return incPart(v.o, v.n, { word: 'increase', orig: 'original price', newer: 'new price', step1: 'increase', prompt: 'A ' + v.what + ' raises its monthly price from ' + t(M(v.o)) + ' to ' + t(M(v.n)) + '. What is the percent increase, to the nearest tenth?', text: 'percent increase' });
        } },
        { id: '5b', level: 'BEG', make: function (r) {
          var v = find(function () { return { P: r.pick([42, 36, 28, 55, 65, 24, 38, 46, 120]), p: r.pick([6, 4, 5, 3, 7, 9]), what: r.pick(['hair salon', 'barber shop', 'dog groomer', 'nail salon']), item: r.pick(['haircut', 'service']) }; }, function (s) { return !(s.P === 17.5 && s.p === 8); }, { P: 42, p: 6, what: 'hair salon', item: 'haircut' });
          var N = v.P * (1 + v.p / 100), d = taxDiag(v.P, v.p).filter(function (x) { return x[1] !== 'u1l8-tax-off'; });
          var p = PK.moneyPart('A ' + v.what + ' raises the price of a ' + t(M(v.P)) + ' ' + v.item + ' by ' + t(v.p + '\\%') + '. What is the new price?', N, diagList(d, function (x) { if (nearM(x, pctOf(v.p, v.P))) return { code: 'u1l8-gave-markup', hint: 'That’s the increase. Add it to the old price.' }; return null; }),
            t(mult2(v.p) + '=1+' + dec2(v.p)) + '<br>new price ' + t('=' + M(v.P) + '\\times ' + mult2(v.p) + eqM(N)) + ' &nbsp; (or: ' + t(v.p + '\\%') + ' of ' + t(M(v.P)) + ' is ' + t(M(pctOf(v.p, v.P))) + ', and ' + t(M(v.P) + '+' + M(pctOf(v.p, v.P)) + '=' + M(N)) + ')', ['New price = old price × (1 + rate).', t(v.p + '\\%') + ' as a decimal is ' + t(dec2(v.p)) + '.'], 'price raise');
          p.bad = [m$(v.P + v.p), m$(v.P * (1 + v.p / 10))];
          return p;
        } }] },
      { num: '6', stem: function (sh) { return aW(sh.who) + ' buys ' + sh.what + ' for ' + t(M(sh.C)) + '. She charges her customer ' + t(sh.m + '\\%') + ' more than she paid.'; },
        shared: function (r) { return find(function () { return { C: r.int(26, 190) * 5, m: r.pick([18, 15, 12, 20, 22, 25]), who: r.pick(['plumber', 'plumber', 'contractor', 'electrician']), what: r.pick(['a hot water tank', 'a furnace part', 'a new faucet set', 'a sump pump']) }; }, function (s) { return true; }, { C: 725, m: 18, who: 'plumber', what: 'a hot water tank' }); },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) { var mk = pctOf(sh.m, sh.C), dg = markupDiag(sh.C, sh.m); return PK.moneyPart('What is her markup in dollars?', mk, dg.markup, t(M(sh.C) + '\\times ' + dec2(sh.m) + eqM(mk)), ['Markup = cost × rate (as a decimal).'], 'markup $'); } },
          { id: '6b', level: 'BEG', make: function (r, sh) { var mk = pctOf(sh.m, sh.C), R = sh.C + r2(mk), dg = markupDiag(sh.C, sh.m); var p = PK.moneyPart('What does she charge the customer (before tax)?', R, dg.retail, t(M(sh.C) + '+' + M(mk) + '=' + M(R)) + ' &nbsp; (or ' + t(M(sh.C) + '\\times ' + mult2(sh.m) + eqM(sh.C * (1 + sh.m / 100))) + ')', ['Add the markup to what she paid.'], 'charge'); p.bad = [m$(mk), m$(sh.C + sh.m)]; return p; } }] },
      { num: '7', stem: 'These prices are in Alberta. Estimate the GST first, then find the GST and the total.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var P = find(function () { return r.int(12, 89) + r.pick([0.99, 0.49, 0.95]); }, function (x) { return !near(x, 54.99); }, 24.99); return gstRowPart(rnd(P, 2)); } },
        { id: '7b', level: 'EMG', make: function (r) { var P = find(function () { return r.int(2, 9) + r.pick([0.49, 0.29, 0.69, 0.89]); }, function (x) { var g = pctOf(5, x); return !near(g, r2(g)); }, 8.49); return gstRowPart(rnd(P, 2)); } },
        { id: '7c', level: 'BEG', make: function (r) { return gstRowPart(r.int(80, 249) * 10 + r.pick([-1, 9, 0])); } }] },
      { num: '8', stem: '', parts: [{ id: '8', level: 'EMG', make: function (r) {
        var P = find(function () { return rnd(r.int(39, 299) + r.pick([0.99, 0.49, 0.95]), 2); }, function (x) { return !near(x, 129.99); }, 219.99), city = r.pick(PROV.BC.cities), what = r.pick(['Snowboard boots', 'A hockey helmet', 'Hiking boots', 'A pair of skis', 'A rain jacket']);
        return taxFields(P, 'BC', what + ' cost' + (what.indexOf('A ') === 0 ? 's ' : ' ') + t(M(P)) + ' in ' + city + ', BC (' + t('5\\%') + ' GST and ' + t('7\\%') + ' PST). Find the GST, the PST and the total cost.', 'BC taxes');
      } }] },
      { num: '9', stem: '', parts: [{ id: '9', level: 'EMG', make: function (r) {
        var pv = r.pick(['NS', 'NS', 'ON']), city = r.pick(PROV[pv].cities), N = r.int(109, 249), n = r.pick([2, 3, 2, 4]), rate = totRate(pv), base = N * n, tot = base * (1 + rate / 100);
        var p = PK.moneyPart('A hotel room in ' + city + ', ' + PROV[pv].name + ' costs ' + t(M(N)) + ' a night. ' + PROV[pv].name + ' has ' + t(rate + '\\%') + ' HST. What is the total for ' + t(n) + ' nights?', tot, diagList(taxDiag(base, rate), function (v) {
          if (nearM(v, N * (1 + rate / 100))) return { code: 'u1l8-one-night', hint: 'That’s one night. Find the cost of ' + t(n) + ' nights first.' };
          if (nearM(v, base + pctOf(rate, N))) return { code: 'u1l8-tax-one-night', hint: 'The HST is on all ' + t(n) + ' nights: ' + t(M(base) + '\\times ' + dec2(rate)) + '.' };
          if (nearM(v, base * 1.05)) return { code: 'u1l8-gst-only', hint: PROV[pv].name + ' has ' + t(rate + '\\%') + ' HST, not ' + t('5\\%') + ' GST.' };
          if (nearM(v, base)) return { code: 'u1l8-retail-only', hint: 'Add the HST.' };
          return null;
        }), sol(['before tax: ' + t(n + '\\times ' + M(N) + '=' + M(base)), 'HST ' + t('=' + M(base) + '\\times ' + dec2(rate) + eqM(pctOf(rate, base))) + '; total ' + t('=' + M(base) + '+' + M(pctOf(rate, base)) + '=' + M(base + r2(pctOf(rate, base)))), '(Or: ' + t(M(base) + '\\times ' + mult2(rate) + eqM(tot)) + '.)']), ['Find the cost of all the nights first.', 'Then add the HST (multiply by ' + t(mult2(rate)) + ').'], 'hotel');
        p.check = PK.either(p.check, PK.money(base + r2(pctOf(rate, base))));
        p.bad = [m$(N * (1 + rate / 100)), m$(base * 1.05)];
        return p;
      } }] },
      { num: '10', stem: function (sh) { return aW(sh.what) + ' costs ' + t(M(sh.A)) + ' at a store in Calgary. The same ' + sh.what + ' costs ' + t(M(sh.B)) + ' at a store in ' + sh.city + ', BC (' + t('12\\%') + ' tax in all).'; },
        shared: function (r) { return find(function () { var B = r.int(8, 25) * 100 - r.pick([1, 51, 0]); return { B: B, A: B + r.pick([50, 100, 80, 60, 120]), what: r.pick(['e-bike', 'canoe', 'gaming laptop', 'TV']), city: r.pick(['Vancouver', 'Kelowna', 'Victoria']) }; },
          function (s) { var a = s.A * 1.05, b = s.B * 1.12; return a < b && b - a > 1; }, { A: 1849, B: 1749, what: 'e-bike', city: 'Vancouver' }); },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) {
            var a = r2(sh.A * 1.05), b = r2(sh.B * 1.12);
            return K.P.mc(r, 'Which store is cheaper after tax?', [
              { html: 'The Calgary store', right: true },
              { html: 'The ' + sh.city + ' store', why: 'Its tag price is lower, but find each price <b>after tax</b>: Calgary ' + t(M(sh.A) + '\\times 1.05') + ', ' + sh.city + ' ' + t(M(sh.B) + '\\times 1.12') + '.', code: 'tag' }],
              sol(['Calgary: ' + t(M(sh.A) + '\\times 1.05' + eqM(sh.A * 1.05)), sh.city + ': ' + t(M(sh.B) + '\\times 1.12' + eqM(sh.B * 1.12)), 'The Calgary store is cheaper after tax, even though its tag price is higher.']), ['Work out the price after tax at each store.'], 'cheaper store', true);
          } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var a = r2(sh.A * 1.05), b = r2(sh.B * 1.12), d = rnd(b - a, 2);
            var p = PK.moneyPart('By how much is it cheaper?', d, function (v) {
              if (near(v, sh.A - sh.B)) return { code: 'u1l8-tag-diff', hint: 'That’s the difference in the tag prices. Compare the prices <b>after tax</b>.' };
              if (near(v, rnd(sh.B * 1.05 - sh.A * 1.05, 2)) || near(v, rnd(sh.A * 1.12 - sh.B * 1.12, 2)) || near(v, rnd(Math.abs(sh.B * 1.05 - sh.A * 1.05), 2))) return { code: 'u1l8-wrong-store', hint: 'Use each store’s own tax: ' + t('5\\%') + ' in Calgary, ' + t('12\\%') + ' in BC.' };
              return null;
            }, sol(['Calgary: ' + t(M(sh.A) + '\\times 1.05' + eqM(sh.A * 1.05)), sh.city + ': ' + t(M(sh.B) + '\\times 1.12' + eqM(sh.B * 1.12)), t(M(b) + '-' + M(a) + '=' + M(d)) + '. The Calgary store is cheaper by ' + t(M(d)) + '.']), ['Find both prices after tax, then subtract.'], 'how much cheaper');
            p.bad = [m$(sh.A - sh.B)];
            return p;
          } },
          { id: '10c', level: 'BEG', make: function (r, sh) {
            return K.P.mc(r, 'Which is a good reason, <b>other than price</b>, that a person might still buy the ' + sh.what + ' in ' + sh.city + '?', [
              { html: 'They live in ' + sh.city + ', so they don’t have to travel or ship it, and warranty repairs are close to home.', right: true },
              { html: 'The tag price in ' + sh.city + ' is lower.', why: 'That’s about price — and after tax it costs more there.', code: 'price' },
              { html: 'BC has less sales tax than Alberta.', why: 'BC has ' + t('12\\%') + ' tax; Alberta has ' + t('5\\%') + '.', code: 'tax' },
              { html: 'There is no tax on ' + sh.what + 's in BC.', why: 'The question says there is ' + t('12\\%') + ' tax in all.', code: 'notax' }],
              'Sample: they live in ' + sh.city + ', so they don’t have to travel or pay for shipping, and repairs under warranty are close to home.', ['The question asks for a reason that is not about price.'], 'reason');
          } }] },
      { num: '11', stem: function (sh) { return 'A sports store buys ' + sh.item + ' for ' + t(M(sh.C)) + ' each and marks them up ' + t(sh.m + '\\%') + '.'; },
        shared: function (r) { return find(function () { return { C: r.pick([72, 64, 56, 48, 88, 96, 36, 44]), m: r.pick([65, 55, 45, 35, 70, 80]), item: r.pick(['hockey sticks', 'basketballs', 'skateboards', 'baseball gloves']) }; }, function (s) { return okMk(s.C, s.m); }, { C: 72, m: 65, item: 'hockey sticks' }); },
        parts: [
          { id: '11a', level: 'BEG', make: function (r, sh) { var R = sh.C * (1 + sh.m / 100), dg = markupDiag(sh.C, sh.m); var p = PK.moneyPart('Find the retail price.', R, dg.retail, t(M(sh.C) + '\\times ' + mult2(sh.m) + eqM(R)), ['Retail = cost × (1 + markup rate).'], 'retail'); p.bad = [m$(pctOf(sh.m, sh.C))]; return p; } },
          { id: '11b', level: 'EMG', make: function (r, sh) { var R = r2(sh.C * (1 + sh.m / 100)), T = R * 1.05; var p = PK.moneyPart('What does a customer in Calgary pay, with GST?', T, diagList(taxDiag(R, 5, { cost: sh.C }), function (v) { if (nearM(v, R)) return { code: 'u1l8-retail-only', hint: 'Add the GST.' }; return null; }), t(M(R) + '\\times 1.05' + eqM(T)), ['Use the retail price from (a).', 'Alberta: multiply by ' + t('1.05') + '.'], 'with GST'); p.bad = [m$(sh.C * 1.05), m$(R * 1.5)]; return p; } },
          { id: '11c', level: 'EMG', make: function (r, sh) { var R = r2(sh.C * (1 + sh.m / 100)), T = R * 1.13; var p = PK.moneyPart('If the store were in Toronto (' + t('13\\%') + ' HST), what would the customer pay?', T, diagList(taxDiag(R, 13, { cost: sh.C }), function (v) { if (nearM(v, R * 1.05)) return { code: 'u1l8-gst-only', hint: 'Toronto has ' + t('13\\%') + ' HST: multiply by ' + t('1.13') + '.' }; return null; }), t(M(R) + '\\times 1.13' + eqM(T)), ['Use the retail price from (a).', 'Multiply by ' + t('1.13') + '.'], 'with HST'); p.bad = [m$(R * 1.05), m$(sh.C * 1.13)]; return p; } }] },
      { num: '12', stem: '', parts: [{ id: '12', level: 'EMG', make: function (r) { return receiptPart(r, { store: r.pick(['Nose Creek Hardware', 'Prairie Paint & Supply', 'Foothills Home Centre']), city: r.pick(['Airdrie', 'Okotoks', 'Cochrane', 'Calgary']) }); } }] },
      { num: '13', stem: function (sh) { return sh.name + ' says, “A ' + t(sh.m + '\\%') + ' markup and then ' + t('5\\%') + ' GST is the same as adding ' + t((sh.m + 5) + '\\%') + ' to the cost.” Test the idea with an item that costs ' + t('\\$100.00') + '.'; },
        shared: function (r) { return { m: r.pick([20, 30, 40, 10, 50, 60]), name: r.pick(['Jada', 'Kiera', 'Priya', 'Hailey']) }; },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) {
            var R = 100 * (1 + sh.m / 100), T = R * 1.05, J = 100 + sh.m + 5;
            var p = PK.fields('Find the total both ways.', [{ label: 'Markup, then GST', before: '$', name: 'Markup, then GST' }, { label: 'Adding ' + t((sh.m + 5) + '\\%'), before: '$', name: 'Adding ' + (sh.m + 5) + '%' }],
              [PK.money(T, function (v) { if (near(v, J)) return { code: 'u1l8-added-markups', hint: 'Do it in order: retail ' + t('=\\$100.00\\times ' + mult2(sh.m)) + ', then the GST on the <b>retail</b> price.' }; if (near(v, R)) return { code: 'u1l8-retail-only', hint: 'Now add the GST to the retail price.' }; return null; }), PK.money(J)],
              [m$(T), m$(J)], t(M(T)) + ' and ' + t(M(J)), sol(['retail ' + t('=\\$100.00\\times ' + mult2(sh.m) + '=' + M(R)) + '; total ' + t('=' + M(R) + '\\times 1.05=' + M(T)), 'Adding ' + t((sh.m + 5) + '\\%') + ': ' + t('\\$100.00\\times ' + mult2(sh.m + 5) + '=' + M(J))]), ['Work in store order: markup first, then GST on the retail price.'], 'Jada totals');
            p.bad = [[m$(J), m$(J)]];
            return p;
          } },
          { id: '13b', level: 'EMG', make: function (r, sh) {
            var R = 100 * (1 + sh.m / 100), T = R * 1.05, J = 100 + sh.m + 5, more = dS(rnd(T - 100, 2));
            return K.P.mc(r, 'Is ' + sh.name + ' right?', [
              { html: '<b>No.</b> The GST is ' + t('5\\%') + ' of ' + t(M(R)) + ' (the retail price), not of ' + t('\\$100.00') + ', so the total is ' + t(more + '\\%') + ' more than the cost, not ' + t((sh.m + 5) + '\\%') + '.', right: true },
              { html: '<b>Yes.</b> ' + t(sh.m + '\\%+5\\%=' + (sh.m + 5) + '\\%') + ', so both ways give the same total.', why: 'Compare your two totals from (a). Percents of different amounts can’t just be added.', code: 'yes-add' },
              { html: '<b>No.</b> The GST should be worked on the cost, so the total is less.', why: 'The GST <b>is</b> on the retail price, which is more than the cost. That makes the total more, not less.', code: 'no-cost' },
              { html: '<b>Yes.</b> The difference is only a few cents, so it doesn’t count.', why: 'Look at the difference in (a): ' + t(M(T) + '-' + M(J) + '=' + M(T - J)) + '. That’s a real difference, and it grows with the price.', code: 'yes-small' }],
              'Markup then GST: ' + t(M(T)) + '. Adding ' + t((sh.m + 5) + '\\%') + ': ' + t(M(J)) + '. She is <b>not</b> right. The GST is ' + t('5\\%') + ' of ' + t(M(R)) + ', not of ' + t('\\$100') + ', so the total is ' + t(more + '\\%') + ' more than the cost.', ['Use your totals from (a).'], 'Jada right?');
          } }] },
      { num: '14', stem: function (sh) { return 'Two stores in Edmonton sell the same ' + sh.item + '. Store A pays ' + t(M(sh.CA)) + ' for it and marks it up ' + t(sh.mA + '\\%') + '. Store B pays only ' + t(M(sh.CB)) + ' but marks it up ' + t(sh.mB + '\\%') + '.'; },
        shared: function (r) { return find(function () { var CA = r.pick([60, 50, 80, 40, 70, 90]), CB = CA - r.pick([2, 4, 5, 3, 6]), mA = r.pick([75, 60, 50, 80, 65]), mB = mA + r.pick([10, 15, 20, 5]); return { CA: CA, CB: CB, mA: mA, mB: mB, item: r.pick(['jacket', 'pair of boots', 'backpack', 'hoodie']) }; },
          function (s) { var a = r2(s.CA * (1 + s.mA / 100)), b = r2(s.CB * (1 + s.mB / 100)); return Math.abs(a - b) > 0.5 && Math.abs(r2(a * 1.05) - r2(b * 1.05)) > 0.5; }, { CA: 60, CB: 56, mA: 75, mB: 90, item: 'jacket' }); },
        parts: [
          { id: '14a', level: 'PRG', make: function (r, sh) {
            var RA = r2(sh.CA * (1 + sh.mA / 100)), RB = r2(sh.CB * (1 + sh.mB / 100)), TA = RA * 1.05, TB = RB * 1.05;
            var dA = diagList(taxDiag(RA, 5, { cost: sh.CA }), function (v) { if (nearM(v, RA)) return { code: 'u1l8-retail-only', hint: 'That’s Store A’s retail price. Add the GST.' }; return null; }), dB = diagList(taxDiag(RB, 5, { cost: sh.CB }), function (v) { if (nearM(v, RB)) return { code: 'u1l8-retail-only', hint: 'That’s Store B’s retail price. Add the GST.' }; return null; });
            var p = PK.fields('What does a customer pay at each store, with GST?', [{ label: 'Store A', before: '$', name: 'Store A' }, { label: 'Store B', before: '$', name: 'Store B' }], [PK.money(TA, dA), PK.money(TB, dB)], [m$(TA), m$(TB)], 'Store A ' + t(M(TA)) + ', Store B ' + t(M(TB)),
              sol(['Store A: ' + t(M(sh.CA) + '\\times ' + mult2(sh.mA) + '=' + M(RA)) + '; ' + t(M(RA) + '\\times 1.05' + eqM(TA)), 'Store B: ' + t(M(sh.CB) + '\\times ' + mult2(sh.mB) + '=' + M(RB)) + '; ' + t(M(RB) + '\\times 1.05' + eqM(TB))]), ['For each store: retail = cost × (1 + markup rate), then × 1.05 for the GST.'], 'two stores totals');
            p.bad = [[m$(RA), m$(RB)], [m$(TB), m$(TA)]];
            return p;
          } },
          { id: '14b', level: 'MAS', make: function (r, sh) {
            var RA = r2(sh.CA * (1 + sh.mA / 100)), RB = r2(sh.CB * (1 + sh.mB / 100)), TA = r2(RA * 1.05), TB = r2(RB * 1.05), cheapA = TA < TB, d = rnd(Math.abs(TA - TB), 2);
            var win = cheapA ? 'a' : 'b', lose = cheapA ? 'b' : 'a';
            var whichChk = textChk([win, win === 'a' ? 'storea' : 'storeb'], [[lose, 'u1l8-wrong-store', 'Compare the totals <b>with GST</b>: Store A ' + t('=' + M(sh.CA) + '\\times ' + mult2(sh.mA) + '\\times 1.05') + ', Store B ' + t('=' + M(sh.CB) + '\\times ' + mult2(sh.mB) + '\\times 1.05') + '.'], ['store' + lose, 'u1l8-wrong-store', 'Compare the two totals with GST.']], 'Type <b>A</b> or <b>B</b> for the store.');
            var amt = PK.money(d, function (v) {
              if (near(v, rnd(Math.abs(RA - RB), 2))) return { code: 'u1l8-tag-diff', hint: 'That’s the difference <b>before tax</b>. Compare what the customer pays with GST.' };
              if (near(v, rnd(sh.CA - sh.CB, 2))) return { code: 'u1l8-cost-diff', hint: 'That’s the difference in what the <b>stores paid</b>. Compare what the customer pays.' };
              if (near(v, Math.abs(sh.mA - sh.mB))) return { code: 'u1l8-cost-diff', hint: 'Compare dollar totals, not the markup percents.' };
              return null;
            });
            var p = PK.fields('Which store charges the customer less, with GST, and by how much?', [{ label: 'Store (A or B)', mode: 'text', placeholder: 'A or B', name: 'Which store' }, { label: 'Less by', before: '$', name: 'How much less' }], [whichChk, amt], [cheapA ? 'A' : 'B', m$(d)],
              'Store ' + (cheapA ? 'A' : 'B') + ', by ' + t(M(d)),
              sol(['Store A: ' + t(M(sh.CA) + '\\times ' + mult2(sh.mA) + '=' + M(RA)) + '; ' + t(M(RA) + '\\times 1.05' + eqM(RA * 1.05)), 'Store B: ' + t(M(sh.CB) + '\\times ' + mult2(sh.mB) + '=' + M(RB)) + '; ' + t(M(RB) + '\\times 1.05' + eqM(RB * 1.05)), t((cheapA ? M(TB) + '-' + M(TA) : M(TA) + '-' + M(TB)) + '=' + M(d)), '<b>Store ' + (cheapA ? 'A' : 'B') + '</b> charges ' + t(M(d)) + ' less' + ((cheapA && sh.CA > sh.CB) ? ', even though it paid more for the ' + sh.item + '.' : '.')]),
              ['Find each store’s retail price, then add GST.', 'Compare the two totals and subtract.'], 'which store');
            p.bad = [[lose.toUpperCase(), m$(d)], [win.toUpperCase(), m$(Math.abs(RA - RB))]];
            return p;
          } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var P = r.pick([40, 60, 80, 20, 120, 30, 50, 70]);
        return K.P.mc(r, 'In Alberta, the total cost of a ' + t(M(P)) + ' item with GST is', [
          { html: t(M(P * 0.05)), why: 'That’s the GST only. Add it to the price.', code: 'gst' },
          { html: t(M(P + 0.05)), why: 'That adds 5 cents. ' + t('5\\%') + ' of ' + t(M(P)) + ' is ' + t(M(P * 0.05)) + '.', code: 'cents' },
          { html: t(M(P * 1.05)), right: true },
          { html: t(M(P * 1.5)), why: 'That uses ' + t('0.5') + ' for ' + t('5\\%') + '. ' + t('5\\%=0.05') + ', so multiply by ' + t('1.05') + '.', code: 'half' }],
          t(M(P) + '\\times 1.05=' + M(P * 1.05)) + '.', ['Alberta: multiply by ' + t('1.05') + '.'], 'total with GST ' + P, true, 4);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { var C = r.pick([25, 20, 40, 50, 30, 15, 60]), m = r.pick([40, 20, 60, 80, 30, 25]); return [C, C * (1 + m / 100), m]; }, function (v) { return v[1] % 1 === 0 && !(v[0] === 60 && v[1] === 90) && !(v[0] === 32 && v[1] === 56); }, [25, 35, 40]);
        var C = v[0], S = v[1], m = v[2], onR = dS(rnd((S - C) / S * 100, 1)), opts = [
          { html: t(dS(S - C) + '\\%'), why: 'That’s the markup in dollars. Divide it by the cost and multiply by 100.', code: 'dollars' },
          { html: t(onR + '\\%'), why: 'Divide by the <b>cost</b> (the starting amount), not the selling price.', code: 'div-retail' },
          { html: t(m + '\\%'), right: true },
          { html: t(dS(S / C * 100) + '\\%'), why: 'That’s retail ÷ cost. Use the markup (' + t(M(S) + '-' + M(C)) + ') divided by the cost.', code: 'ratio' }];
        if (near(S - C, m)) opts[0] = { html: t(dS(rnd((S - C) / C, 2)) + '\\%'), why: 'Multiply the decimal by 100 to get the percent.', code: 'nox100' };
        return K.P.mc(r, 'A store pays ' + t(M(C)) + ' for a shirt and sells it for ' + t(M(S)) + '. The markup percent is', opts,
          t('(' + M(S) + '-' + M(C) + ')\\div ' + M(C) + '=' + dS((S - C) / C) + '=' + m + '\\%') + '.', ['Markup percent = (retail − cost) ÷ cost × 100.'], 'MC markup %', true, 4);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'BEG', make: function (r) {
        var P = find(function () { return rnd(r.int(1201, 9999) / 100, 2); }, function (x) { return !near(x, 54.99) && Math.round(x * 100) % 10 !== 0 || r.chance(0.2); }, 68.4), g = pctOf(5, P);
        var p = PK.part('<b>Numerical response.</b> The GST on a ' + t(M(P)) + ' purchase in Alberta, to the nearest cent, is ' + t('\\$') + '________.', PK.money(g, diagList(taxDiag(P, 5).filter(function (x) { return !/tax-off|added-pct/.test(x[1]); })), { nr: true }), m$(g), M(g), t(M(P) + '\\times 0.05' + eqM(g)), ['GST = price × 0.05.'], 'NR GST', { nr: true });
        p.bad = [m$(P * 0.5)];
        return p;
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var v = find(function () { var C = rnd(r.int(800, 2400) / 100, 2), R = rnd(Math.round(C * (1.3 + r.next() * 0.6)) + 0.99, 2); return [C, R]; }, function (v) { var P = (v[1] - v[0]) / v[0] * 100; return P < 99.95 && P > 10 && !near(P, rnd(P, 1)) && dS(rnd(P, 1)).length <= 4; }, [14.4, 24.99]);
        return incPart(v[0], v[1], { nr: true, prompt: '<b>Numerical response.</b> A store buys a ' + r.pick(['backpack', 'phone charger', 'water bottle', 'ball cap']) + ' for ' + t(M(v[0])) + ' and sells it for ' + t(M(v[1])) + '. The markup percent, to the nearest tenth of a percent, is ________ %.', text: 'NR markup %' });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the markup and the retail price.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([15, 25, 35, 45, 12, 18]), r.pick([60, 40, 80, 20, 30])]; }, function (v) { return okMk(v[0], v[1]); }, [15, 60]); return markupFields(v[0], v[1]); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([250, 150, 350, 450, 220, 180]), r.pick([35, 45, 15, 65, 55])]; }, function (v) { return okMk(v[0], v[1]); }, [250, 35]); return markupFields(v[0], v[1]); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(5, 39) * 0.25, r.pick([200, 300, 150, 250])]; }, function (v) { return okMk(v[0], v[1]) && v[0] % 1 !== 0; }, [4.75, 200]); return markupFields(v[0], v[1]); } }] },
      { num: '2', stem: 'Find the markup percent.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var v = find(function () { var C = r.pick([80, 40, 60, 120, 200]), m = r.pick([25, 20, 15, 30, 35]); return [C, C * (1 + m / 100)]; }, function (v) { return v[1] % 1 === 0; }, [80, 100]); return incPart(v[0], v[1]); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var v = find(function () { var C = r.pick([2.5, 1.5, 3.5, 4.5]), m = r.pick([140, 120, 160, 180, 220]); return [C, rnd(C * (1 + m / 100), 2)]; }, function (v) { return near(v[1], r2(v[1])) && !(v[0] === 0.9); }, [2.5, 6]); return incPart(v[0], v[1]); } }] },
      { num: '3', stem: 'Find the GST and the total cost in Alberta.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var P = r.pick([36, 24, 48, 52, 64, 28, 44, 76]), w = r.pick(['video game gift card', 'music gift card', 'movie pass']); return taxFields(P, 'AB', 'a ' + t(M(P)) + ' ' + w, 'GST ' + P); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var P = find(function () { return r.int(59, 249) + 0.99; }, function (x) { return !near(x, 54.99) && !near(x, 129.99); }, 149.99), w = r.pick(['pair of running shoes', 'winter jacket', 'pair of headphones']); return taxFields(rnd(P, 2), 'AB', 'a ' + t(M(P)) + ' ' + w, 'GST ' + P); } }] },
      { num: '4', stem: 'Write the number you multiply by to get the new price.', parts: [
        { id: 'e4a', level: 'LIM', make: function (r) { var p = r.pick([45, 35, 55, 65, 85, 25]); return multPart(p, 'a ' + t(p + '\\%') + ' markup'); } },
        { id: 'e4b', level: 'BEG', make: function (r) { var w = r.pick(['Alberta GST', 'Yukon GST', 'Northwest Territories GST', 'Nunavut GST']); return multPart(5, w + ' (' + t('5\\%') + ')'); } },
        { id: 'e4c', level: 'BEG', make: function (r) { var pv = r.pick(['ON', 'NS']); return multPart(totRate(pv), PROV[pv].name + ' HST (' + t(totRate(pv) + '\\%') + ')'); } },
        { id: 'e4d', level: 'BEG', make: function (r) { var pv = r.pick(['BC', 'SK']); return multPart(totRate(pv), (PROV[pv].short || PROV[pv].name) + ' GST + PST (' + t(totRate(pv) + '\\%') + ')'); } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [{ id: 'e5', level: 'BEG', make: function (r) {
        var v = find(function () { return { C: rnd(r.int(25, 95) / 5 * 2, 2), m: r.pick([75, 65, 85, 55, 95]), what: r.pick(['wiper blade', 'oil filter', 'set of spark plugs', 'headlight bulb']) }; }, function (s) { return okMk(s.C, s.m) && s.C % 1 !== 0; }, { C: 9.8, m: 75, what: 'wiper blade' });
        var R = v.C * (1 + v.m / 100), dg = markupDiag(v.C, v.m);
        var p = PK.moneyPart('An auto parts store pays ' + t(M(v.C)) + ' for a ' + v.what + ' and marks it up ' + t(v.m + '\\%') + '. What is the retail price?', R, dg.retail, t(M(v.C) + '\\times ' + mult2(v.m) + eqM(R)) + '. The ' + v.what + ' sells for ' + t(M(R)) + '.', ['Retail = cost × (1 + markup rate).'], 'auto parts retail');
        p.check = PK.either(p.check, PK.money(v.C + r2(pctOf(v.m, v.C))));
        p.bad = [m$(pctOf(v.m, v.C))];
        return p;
      } }] },
      { num: '6', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var v = find(function () { var o = r.int(8, 16) + r.pick([0.5, 0.25, 0.75, 0]), n = o + r.pick([1.25, 0.75, 1.5, 1, 0.5]); return { o: o, n: n, item: r.pick(['poutine', 'burrito', 'combo meal', 'smoothie']) }; }, function (s) { var P = (s.n - s.o) / s.o * 100; return !near(P, rnd(P, 1)); }, { o: 11.5, n: 12.75, item: 'poutine' });
        return incPart(v.o, v.n, { word: 'increase', orig: 'original price', newer: 'new price', step1: 'increase', prompt: 'A food truck raises the price of a ' + v.item + ' from ' + t(M(v.o)) + ' to ' + t(M(v.n)) + '. What is the percent increase, to the nearest tenth?', text: 'food truck increase' });
      } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'EMG', make: function (r) {
        var P = r.int(149, 499) + r.pick([0, 0.99, 0]), city = r.pick(PROV.SK.cities), what = r.pick(['A lawn mower', 'A snowblower', 'A barbecue', 'A bike']);
        return taxFields(P, 'SK', what + ' costs ' + t(M(P)) + ' in ' + city + ', Saskatchewan (' + t('5\\%') + ' GST and ' + t('6\\%') + ' PST). Find the GST, the PST and the total.', 'SK taxes');
      } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
        var v = find(function () { return { n: r.pick([3, 4, 2, 5, 6]), x: r.pick([47, 39, 52, 28, 64, 35, 18]), m: r.pick([25, 20, 30, 15, 35]), city: r.pick(['Lethbridge', 'Medicine Hat', 'Grande Prairie', 'Red Deer']), what: r.pick(['light fixtures', 'smoke detectors', 'ceiling fans', 'dimmer switches']) }; }, function (s) { return true; }, { n: 3, x: 47, m: 25, city: 'Lethbridge', what: 'light fixtures' });
        var cost = v.n * v.x, ch = r2(cost * (1 + v.m / 100)), T = ch * 1.05;
        var p = PK.moneyPart('An electrician in ' + v.city + ' buys ' + t(v.n) + ' ' + v.what + ' at ' + t(M(v.x)) + ' each. She charges her customer ' + t(v.m + '\\%') + ' more than she paid, plus GST. What does the customer pay?', T, diagList(taxDiag(ch, 5, { cost: cost }), function (x) {
          if (nearM(x, ch)) return { code: 'u1l8-retail-only', hint: 'That’s her price before tax. Add the GST.' };
          if (nearM(x, v.x * (1 + v.m / 100) * 1.05)) return { code: 'u1l8-qty', hint: 'That’s for one. She bought ' + t(v.n) + '.' };
          if (nearM(x, cost * (1 + (v.m + 5) / 100))) return { code: 'u1l8-added-markups', hint: 'Markup first, then the GST on her price: multiply by ' + t(mult2(v.m)) + ', then by ' + t('1.05') + '.' };
          if (nearM(x, cost)) return { code: 'u1l8-cost-total', hint: 'That’s what she paid. Add her ' + t(v.m + '\\%') + ' and the GST.' };
          return null;
        }), sol(['cost ' + t('=' + v.n + '\\times ' + M(v.x) + '=' + M(cost)), 'charge ' + t('=' + M(cost) + '\\times ' + mult2(v.m) + eqM(cost * (1 + v.m / 100))), 'with GST: ' + t(M(ch) + '\\times 1.05' + eqM(T)) + '. The customer pays ' + t(M(T)) + '.']), ['Find what she paid for all of them first.', 'Then her ' + t(v.m + '\\%') + ' more, then the GST on that.'], 'electrician');
        p.bad = [m$(ch), m$(cost * (1 + (v.m + 5) / 100))].filter(function (x) { return !near(Number(x), r2(T)); });
        return p;
      } }] },
      { num: '9', stem: '', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
        var v = find(function () { var H = r.int(6, 14) * 100 - 0.01, E = H + r.pick([50, 30, 40, 60, 80]); return { H: rnd(H, 2), E: rnd(E, 2), what: r.pick(['laptop', 'tablet', 'phone', 'camera']) }; }, function (s) { var h = r2(s.H * 1.14), e = r2(s.E * 1.05); return h > e + 1; }, { H: 899.99, E: 949.99, what: 'laptop' });
        var h = r2(v.H * 1.14), e = r2(v.E * 1.05), d = rnd(h - e, 2);
        var p = PK.fields(aW(v.what) + ' costs ' + t(M(v.H)) + ' in Halifax (' + t('14\\%') + ' HST) and ' + t(M(v.E)) + ' in Edmonton (' + t('5\\%') + ' GST). Where is it cheaper after tax, and by how much?', [{ label: 'Cheaper in', mode: 'text', placeholder: 'city', name: 'City' }, { label: 'by', before: '$', name: 'How much' }],
          [textChk(['edmonton'], [['halifax', 'u1l8-tag-diff', 'Its tag price is lower in Halifax, but compare the prices <b>after tax</b>: ' + t(M(v.H) + '\\times 1.14') + ' and ' + t(M(v.E) + '\\times 1.05') + '.']], 'Type the city: Halifax or Edmonton.'),
            PK.money(d, function (x) { if (near(x, rnd(v.E - v.H, 2))) return { code: 'u1l8-tag-diff', hint: 'That’s the difference before tax. Compare the prices after tax.' }; return null; })],
          ['Edmonton', m$(d)], 'Edmonton, by ' + t(M(d)), sol(['Halifax: ' + t(M(v.H) + '\\times 1.14' + eqM(v.H * 1.14)), 'Edmonton: ' + t(M(v.E) + '\\times 1.05' + eqM(v.E * 1.05)), 'It is cheaper in <b>Edmonton</b> by ' + t(M(h) + '-' + M(e) + '=' + M(d)) + '.']), ['Find the price after tax in each city.', 'Then subtract.'], 'Halifax vs Edmonton');
        p.bad = [['Halifax', m$(d)], ['Edmonton', m$(v.E - v.H)]];
        return p;
      } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var v = find(function () { var C = r.pick([60, 40, 80, 120, 20]), m = r.pick([50, 25, 75, 40]); return [C, C * (1 + m / 100), m]; }, function (v) { return v[1] % 1 === 0 && !(v[0] === 25 && v[1] === 35) && !(v[0] === 32 && v[1] === 56) && dS(v[1] - v[0]) !== String(v[2]); }, [60, 90, 50]);
        var C = v[0], S = v[1], m = v[2];
        return K.P.mc(r, 'A store pays ' + t(M(C)) + ' for a lamp and sells it for ' + t(M(S)) + '. The markup percent is', [
          { html: t(dS(rnd((S - C) / S * 100, 1)) + '\\%'), why: 'Divide by the <b>cost</b> (what the store paid), not the selling price.', code: 'div-retail' },
          { html: t(m + '\\%'), right: true },
          { html: t(dS(S - C) + '\\%'), why: 'That’s the markup in dollars. Divide it by the cost and multiply by 100.', code: 'dollars' },
          { html: t(dS(S / C * 100) + '\\%'), why: 'That’s retail ÷ cost. Use the markup divided by the cost.', code: 'ratio' }],
          t('(' + M(S) + '-' + M(C) + ')\\div ' + M(C) + '=' + dS((S - C) / C) + '=' + m + '\\%') + '.', ['Markup percent = (retail − cost) ÷ cost × 100.'], 'MC lamp', true, 4);
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'BEG', make: function (r) {
        var P = find(function () { return rnd(r.int(1201, 9999) / 100, 2); }, function (x) { var g = pctOf(7, x); return !near(g, r2(g)) && !near(x, 129.99); }, 52.3), g = pctOf(7, P);
        var p = PK.part('<b>Numerical response.</b> The PST in British Columbia (' + t('7\\%') + ') on a ' + t(M(P)) + ' purchase, to the nearest cent, is ' + t('\\$') + '________.', PK.money(g, diagList(taxDiag(P, 7).filter(function (x) { return !/tax-off|added-pct/.test(x[1]); }).concat([[pctOf(12, P), 'u1l8-gst-only', 'That’s GST and PST together. The question asks for the PST only (' + t('7\\%') + ').'], [pctOf(5, P), 'u1l8-gst-only', 'That’s the GST. The PST in BC is ' + t('7\\%') + '.']])), { nr: true }), m$(g), M(g), t(M(P) + '\\times 0.07' + eqM(g)), ['PST = price × 0.07.'], 'NR PST', { nr: true });
        p.bad = [m$(P * 0.7)];
        return p;
      } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'ADV', make: function (r) {
        var P = find(function () { return r.pick([60, 40, 80, 120, 20, 100, 140, 36, 52]); }, function () { return true; }, 60), T = P * 1.05;
        var p = PK.moneyPart('A receipt from a Calgary store shows a total of ' + t(M(T)) + ', with GST included. What was the price before tax?', P, function (v) {
          if (nearM(v, T * 0.95)) return { code: 'u1l8-took-5-off', hint: 'Taking ' + t('5\\%') + ' off the total doesn’t undo it: the GST was ' + t('5\\%') + ' of the <b>price</b>, not of the total. Undo “× 1.05” by dividing: ' + t(M(T) + '\\div 1.05') + '.' };
          if (nearM(v, T * 1.05)) return { code: 'u1l8-mult-not-div', hint: 'The GST is already in. Undo the multiplying: divide by ' + t('1.05') + '.' };
          if (nearM(v, T - 5) || nearM(v, T - 0.05)) return { code: 'u1l8-added-pct', hint: 'The GST isn’t 5 dollars. total ' + t('=') + ' price ' + t('\\times 1.05') + ', so price ' + t('=') + ' total ' + t('\\div 1.05') + '.' };
          if (nearM(v, T / 1.5)) return { code: 'u1l8-five-as-half', hint: t('5\\%=0.05') + ', so the multiplier is ' + t('1.05') + ', not ' + t('1.5') + '.' };
          return null;
        }, sol(['total ' + t('=') + ' price ' + t('\\times 1.05') + ', so price ' + t('=' + M(T) + '\\div 1.05=' + M(P)) + '.', 'Check: ' + t(M(P) + '\\times 1.05=' + M(T)) + ' ✓']), ['total = price × 1.05. Undo the multiplying.', 'Taking 5% off the total is not the same thing.'], 'undo GST');
        p.bad = [m$(T * 0.95)];
        return p;
      } }] },
      { num: '13', stem: function (sh) { return 'A factory sells a ' + sh.item + ' to a distributor for ' + t(M(sh.F)) + '. The distributor marks it up ' + t(sh.m1 + '\\%') + ' and sells it to a store. The store marks that price up ' + t(sh.m2 + '\\%') + '.'; },
        shared: function (r) { return find(function () { return { F: r.pick([20, 40, 16, 24, 32, 60, 80]), m1: r.pick([25, 20, 50, 10, 30]), m2: r.pick([40, 60, 20, 50, 80]), item: r.pick(['toaster', 'kettle', 'blender', 'coffee maker']) }; }, function (s) { var a = s.F * (1 + s.m1 / 100), b = a * (1 + s.m2 / 100); return near(a, r2(a)) && near(b, r2(b)) && s.m1 !== s.m2; }, { F: 20, m1: 25, m2: 40, item: 'toaster' }); },
        parts: [
          { id: 'e13a', level: 'PRG', make: function (r, sh) {
            var a = sh.F * (1 + sh.m1 / 100), b = a * (1 + sh.m2 / 100);
            var p = PK.moneyPart('What is the store’s retail price?', b, function (v) {
              if (nearM(v, sh.F * (1 + (sh.m1 + sh.m2) / 100))) return { code: 'u1l8-added-markups', hint: 'The store’s ' + t(sh.m2 + '\\%') + ' is on the <b>distributor’s</b> price, ' + t(M(a)) + ', not on ' + t(M(sh.F)) + '.' };
              if (nearM(v, a)) return { code: 'u1l8-retail-only', hint: 'That’s the distributor’s price. Now the store marks it up ' + t(sh.m2 + '\\%') + '.' };
              if (nearM(v, sh.F * (1 + sh.m2 / 100))) return { code: 'u1l8-added-markups', hint: 'Start with the distributor’s markup first.' };
              return null;
            }, sol(['distributor: ' + t(M(sh.F) + '\\times ' + mult2(sh.m1) + '=' + M(a)), 'store: ' + t(M(a) + '\\times ' + mult2(sh.m2) + '=' + M(b))]), ['Mark up the factory price, then mark up that price.'], 'chain retail');
            p.bad = [m$(sh.F * (1 + (sh.m1 + sh.m2) / 100))];
            return p;
          } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) {
            var a = sh.F * (1 + sh.m1 / 100), b = a * (1 + sh.m2 / 100), P = (b - sh.F) / sh.F * 100;
            var p = incPart(sh.F, b, { prompt: 'What is the total markup percent from the factory price? (Is it ' + t(sh.m1 + '\\%+' + sh.m2 + '\\%=' + (sh.m1 + sh.m2) + '\\%') + '?)', orig: 'factory price', newer: 'store’s price', word: 'total markup', text: 'total markup %',
              solEnd: '<br>No: it is ' + t(dS(rnd(P, 1)) + '\\%') + ', not ' + t((sh.m1 + sh.m2) + '\\%') + '. The store’s ' + t(sh.m2 + '\\%') + ' is on ' + t(M(a)) + ', not on ' + t(M(sh.F)) + '. (Or: ' + t(mult2(sh.m1) + '\\times ' + mult2(sh.m2) + '=' + dS(rnd((1 + sh.m1 / 100) * (1 + sh.m2 / 100), 4))) + '.)' });
            var c0 = p.check;
            p.check = function (resp) { var x = PK.readV(resp); if (x.ok && near(x.v, sh.m1 + sh.m2)) return wrong('u1l8-added-markups', 'That’s ' + t(sh.m1 + '\\%+' + sh.m2 + '\\%') + '. But the store’s ' + t(sh.m2 + '\\%') + ' is a percent of ' + t(M(a)) + ', not of ' + t(M(sh.F)) + '. Use the prices: (store price − factory price) ÷ factory price × 100.'); return c0(resp); };
            p.bad.push(String(sh.m1 + sh.m2));
            return p;
          } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'ADV', make: function (r) {
        var v = find(function () { var C = r.pick([240, 160, 320, 200, 120, 280, 400]), m = r.pick([75, 50, 25, 60, 40]); return { C: C, m: m, R: C * (1 + m / 100), what: r.pick(['bike', 'kayak', 'guitar', 'tent']) }; }, function (s) { return near(s.R, r2(s.R)); }, { C: 240, m: 75, R: 420, what: 'bike' });
        var p = PK.moneyPart(aW(v.what) + ' sells for ' + t(M(v.R)) + ' before tax. The store’s markup was ' + t(v.m + '\\%') + '. What did the store pay for the ' + v.what + '?', v.C, function (x) {
          if (nearM(x, v.R * (1 - v.m / 100))) return { code: 'u1l8-took-off', hint: 'Taking ' + t(v.m + '\\%') + ' off the retail price doesn’t undo the markup: the markup was ' + t(v.m + '\\%') + ' of the <b>cost</b>. retail ' + t('=') + ' cost ' + t('\\times ' + mult2(v.m)) + ', so divide by ' + t(mult2(v.m)) + '.' };
          if (nearM(x, v.R * (1 + v.m / 100))) return { code: 'u1l8-mult-not-div', hint: 'Undo the markup: divide by ' + t(mult2(v.m)) + '.' };
          if (nearM(x, v.R / (v.m / 100))) return { code: 'u1l8-mult-rate', hint: 'Divide by ' + t('1+' + dec(v.m) + '=' + mult2(v.m)) + ', not by ' + t(dec2(v.m)) + '.' };
          if (nearM(x, pctOf(v.m, v.R))) return { code: 'u1l8-took-off', hint: 'Work backwards: cost ' + t('=') + ' retail ' + t('\\div ' + mult2(v.m)) + '.' };
          return null;
        }, sol(['retail ' + t('=') + ' cost ' + t('\\times ' + mult2(v.m)) + ', so cost ' + t('=' + M(v.R) + '\\div ' + mult2(v.m) + '=' + M(v.C)) + '.', 'Check: ' + t(M(v.C) + '\\times ' + mult2(v.m) + '=' + M(v.R)) + ' ✓']), ['retail = cost × (1 + markup rate). Undo the multiplying.'], 'undo markup');
        p.bad = [m$(v.R * (1 - v.m / 100))].filter(function (x) { return !near(Number(x), v.C); });
        return p;
      } }] }
    ]
  });
})(window);
