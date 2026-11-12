/* Math 10-3 · Unit 1 · Lesson 9 — On Sale! Discounts and Sale Prices (N1)
 * Assignment 9 (u1_l09.tex, Questions 1–17) and the Lesson 9 Extra Practice (u1_ep09.tex, Questions 1–15).
 * Every part is a generator: the same kind of price, rate and steps as the booklet item, new numbers (the booklet's own
 * numbers are among the possible values; the lesson's worked-example numbers are left out). Calculator allowed.
 * Money answers are to the cent: "$12.49", "12.49" and "12.490" are all accepted; an unrounded answer (12.488) or one
 * short of the cent (12.4) gets a nudge (no try used); rounding the wrong way is wrong, with a hint. Where the booklet
 * rounds each item before adding (or rounds the sale price before the tax) both that total and the one rounded only at
 * the end are accepted.
 * Recognised mistakes each get their own hint: the discount given as the sale price, "30% off" read as $30 off, the
 * percent not changed to a decimal, multiplying by the percent off instead of the percent you pay, tax on the regular
 * price, dividing by the sale price for a percent decrease, adding stacked discounts, trusting a raised "sale" price.
 * Conversions: the fill-in table → a table with the blanks as boxes; "estimate first" → an estimate box (any sensible
 * estimate is accepted); "which store / is it a deal / explain" → multiple choice whose options are reasons, or a choice
 * plus a number box for the evidence; "give a reason other than price" → multiple choice of reasons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* keypad for the percent table (digits, decimal point, %) */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u1l9pct) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u1l9pct = [[dk(7), dk(8), dk(9), { label: '%', tex: '\\%', plain: '%', title: 'Percent' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
  }

  /* ================= numbers and money ================= */
  function r2(x) { return Math.round(x * 100 + (x >= 0 ? 1e-6 : -1e-6)) / 100; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 0.0005 : e); }
  function grp(s, sep) { var neg = s.charAt(0) === '-'; if (neg) s = s.slice(1); var p = s.split('.'), i = p[0], out = ''; if (i.length < 5) return (neg ? '-' : '') + s; while (i.length > 3) { out = sep + i.slice(-3) + out; i = i.slice(0, -3); } return (neg ? '-' : '') + i + out + (p.length > 1 ? '.' + p[1] : ''); }
  function M(x) { return '$' + grp(r2(x).toFixed(2), '&#8239;'); }          // money in text
  function Mt(x) { return '\\$' + grp(r2(x).toFixed(2), '\\,'); }          // money in TeX
  function c2(x) { return grp(r2(x).toFixed(2), '\\,'); }                  // money digits in TeX
  function N(x) { return grp(String(+Number(x).toFixed(6)), '\\,'); }     // a number in TeX, no trailing zeros
  function pc(p) { return String(+Number(p).toFixed(4)); }                 // a percent: 12.5
  function dec(p) { var s = String(+(p / 100).toFixed(6)); if (s.indexOf('.') < 0) s += '.00'; else if (s.split('.')[1].length < 2) s += '0'; return s; } // 80 → 0.80
  function pay(p) { return dec(100 - p); }                                 // 30 → 0.70
  function rounds(x) { return !near(x, r2(x), 1e-7); }                     // does it need rounding to the cent?
  function to(x) { return rounds(x) ? '=' + N(x) + '\\to ' + Mt(x) : '=' + Mt(x); }  // "= 41.997 → $42.00" or "= $42.00"
  function pct1(x) { return String(+x.toFixed(1)); }
  var BOX = function (s) { return '<span style="display:inline-block;border:2px solid currentColor;padding:1px 7px;font-weight:700;white-space:nowrap">' + s + '</span>'; };
  function sentence(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* read a typed amount: "$12.49", "12.49", "\$12.49", "12.49 dollars", "25%", "25\%" */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    var info = { dollar: /\$/.test(s), pct: /%/.test(s) };
    s = s.replace(/\\\$|\$/g, '').replace(/\\%|%/g, '').replace(/\\[,;: ]|~/g, ' ').trim();
    s = s.replace(/\s*(dollars?|percent|CAD|USD)\.?$/i, '').trim();
    if (/^\d+,\d{1,2}$/.test(s)) return { res: form('u1l9-comma', 'Use a decimal point (not a comma) for the cents, like 12.49.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : /[a-zA-Z]/.test(s) ? form('units', 'Just type the number — leave out the words.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, dollar: info.dollar, pct: info.pct };
  }
  /* money to the cent. o.alts: other accepted totals (rounding at a different step); o.diag: [{v, code, hint}];
     o.exact: the unrounded value (to catch rounding the wrong way) */
  function moneyChk(ans, o) {
    o = o || {};
    var acc = [r2(ans)].concat((o.alts || []).map(r2));
    var isAcc = function (x) { return acc.some(function (y) { return near(x, y); }); };
    var dg = (o.diag || []).filter(function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(r2(m.v)); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc(v)) return ok();
      if (d > 2 && isAcc(r2(v))) return form('u1l9-cents', 'Right — now round it to the nearest cent (2 decimal places).');
      for (var i = 0; i < dg.length; i++) { var m = dg[i]; if (near(v, m.v) || near(v, r2(m.v)) || (d > 2 && near(r2(v), r2(m.v)))) return wrong(m.code, m.hint); }
      if (d < 2 && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f) || near(v, Math.round(y * f + 1e-7) / f); })) return form('u1l9-to-cent', 'Give money to the cent (2 decimal places), like $12.49.');
      if (o.exact != null && d === 2 && near(Math.abs(v - acc[0]), 0.01) && (v - o.exact) * (acc[0] - o.exact) < 0) return wrong('u1l9-round-dir', 'Check your rounding to the cent: look at the third decimal place of ' + t(N(o.exact)) + '. If it is 5 or more, round up; otherwise round down.');
      return wrong('value', o.miss || null);
    };
  }
  /* a percent. o.dp: null (exact) | 0 | 1; o.tol: accepted distance; o.diag: [{v, code, hint}] (unrounded values); o.nr */
  function pctChk(x, o) {
    o = o || {};
    var dp = o.dp, want = dp == null ? x : K.roundTo(x, dp), tol = o.tol || 0, place = dp === 0 ? 'whole percent' : 'tenth of a percent';
    var rd = function (v) { return dp == null ? v : K.roundTo(v, dp); };
    var dg = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !near(rd(m.v), want, 1e-6) && !near(m.v, x, 1e-6); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (near(v, want, 1e-6 + tol) || near(v, x, 1e-6 + tol)) return ok();
      if (dp != null && d > dp && near(K.roundTo(v, dp), want, 1e-6) && Math.abs(v - x) < Math.pow(10, -d) + 1e-9) return form('round', 'Right — now round it to the nearest ' + place + '.');
      if (v > 0 && v <= 1.0001 && (near(v * 100, want, 1e-6 + tol) || near(v * 100, x, 0.06))) return form('u1l9-as-percent', 'That’s the answer as a decimal. Multiply by 100 to write it as a percent.');
      for (var i = 0; i < dg.length; i++) { var m = dg[i]; if (near(v, m.v, 1e-6) || near(v, rd(m.v), 1e-6) || (dp != null && d > dp && near(K.roundTo(v, dp), rd(m.v), 1e-6)) || near(v, K.roundTo(m.v, 1), 1e-6) || (d >= 1 && Math.abs(v - m.v) <= 0.5 * Math.pow(10, -d) + 1e-9)) return wrong(m.code, m.hint); }
      if (dp != null && d <= dp && near(Math.abs(v - want), Math.pow(10, -dp), 1e-6) && (v - x) * (want - x) < 0) return wrong('u1l9-round-dir', 'Check your rounding: look at the digit after the ' + (dp === 0 ? 'ones' : 'tenths') + ' place. If it is 5 or more, round up.');
      return wrong('value', o.miss || null);
    };
  }
  /* the decimal you multiply by for p% off */
  function multChk(p) {
    var want = (100 - p) / 100;
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (near(v, want, 1e-9)) return a.pct ? form('u1l9-want-decimal', 'Write it as a decimal (like 0.75), not a percent.') : ok();
      if (near(v, 100 - p, 1e-9)) return a.pct ? form('u1l9-want-decimal', 'Right percent — now write it as a decimal (divide by 100).') : wrong('u1l9-not-decimal', 'Change the percent to a decimal: divide by 100 (move the decimal point 2 places to the left).');
      if (near(v, p / 100, 1e-9) || near(v, p, 1e-9)) return wrong('u1l9-mult-off', 'That’s the percent <b>off</b>. To get the sale price, multiply by the part you <b>pay</b>: ' + t('100\\%-' + pc(p) + '\\%') + ', as a decimal.');
      if (near(v, 1 + p / 100, 1e-9)) return wrong('u1l9-plus', 'Multiplying by more than 1 is for a markup or a tax. With a discount you pay <b>less</b> than 100%.');
      if (p < 10 && near(v, (100 - 10 * p) / 100, 1e-9)) return wrong('u1l9-small-pct', t(pc(p) + '\\%=' + dec(p)) + ' (not ' + t('0.' + pc(p)) + '). Take it away from ' + t('1.00') + '.');
      if (near(v, (100 - p) / 10, 1e-9) || near(v, (100 - p) / 1000, 1e-9)) return wrong('u1l9-dec-place', 'Check the decimal point: a percent is hundredths, so divide the percent you pay by 100.');
      return wrong('value', 'Find the percent you pay (100% minus the percent off), then change it to a decimal.');
    };
  }
  /* the percent you pay for p% off */
  function payChk(p) {
    var want = 100 - p;
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (near(v, want, 1e-9)) return ok();
      if (near(v, want / 100, 1e-9)) return form('u1l9-row-percent', 'This row is the percent you pay — write it as a percent (the next row is the decimal).');
      if (near(v, p, 1e-9)) return wrong('u1l9-pay-off', 'That’s the percent <b>off</b>. You pay what is left of the 100%.');
      return wrong('value', 'You pay ' + t('100\\%') + ' minus the percent off.');
    };
  }
  function estChk(x, sale) {   // an estimate of a discount: anything sensible
    var tol = Math.max(0.15 * x, 1.5);
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (Math.abs(a.v - x) <= tol + 1e-9) return ok();
      if (Math.abs(a.v - sale) <= Math.max(0.12 * sale, 2)) return wrong('u1l9-est-sale', 'That’s close to the <b>sale price</b>. This box is for the estimate of the <b>discount</b> (the amount you save).');
      return wrong('u1l9-est', 'Round the price to a friendly number, find 10% of it (move the decimal point one place left), then build up the percent off from 10%s and 5%s.');
    };
  }
  function vals(list) { return list.filter(function (m) { return m && m.v != null && isFinite(m.v); }).map(function (m) { return r2(m.v).toFixed(2); }); }
  function fld(label, before, after) { return { label: label, before: before, after: after }; }
  /* several boxes: specs [{label, before, after, chk, key, show}] */
  function fieldsPart(prompt, specs, sol, hints, text) {
    var p = P.fields(prompt, specs.map(function (s) { return fld(s.label, s.before, s.after); }), specs.map(function (s) { return s.chk; }), specs.map(function (s) { return String(s.key); }),
      specs.map(function (s) { return s.label + ': ' + s.show; }).join('<br>'), sol, hints, text);
    return p;
  }
  function moneyPart(prompt, ans, o, sol, hints, text) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', before: o.before == null ? '$' : o.before, after: o.after }, check: moneyChk(ans, o), key: r2(ans).toFixed(2), answer: o.show || t(Mt(ans)), solution: sol, hints: hints || [], text: text };
    p.bad = vals(o.diag || []).filter(function (s) { return !near(Number(s), r2(ans)) && !(o.alts || []).some(function (a) { return near(Number(s), r2(a)); }); });
    return p;
  }
  function pctPart(prompt, x, o, sol, hints, text) {
    o = o || {};
    var want = o.dp == null ? x : K.roundTo(x, o.dp), key = o.dp == null ? pc(x) : want.toFixed(o.dp);
    var p = { prompt: prompt, input: { type: 'number', after: '%', nr: !!o.nr, before: o.before }, check: pctChk(x, o), key: key, answer: t(key + '\\%'), solution: sol, hints: hints || [], text: text };
    p.bad = (o.diag || []).filter(function (m) { var rv = o.dp == null ? m.v : K.roundTo(m.v, o.dp); return isFinite(m.v) && !near(rv, want, 1e-6) && !near(m.v, x, 1e-6); }).map(function (m) { return pc(o.dp == null ? m.v : K.roundTo(m.v, o.dp)); });
    return p;
  }

  /* ---------- typical mistakes ---------- */
  function saleDiag(price, p) { // finding the sale price for p% off
    return [
      { v: price * p / 100, code: 'u1l9-gave-discount', hint: 'That’s the <b>discount</b> (the amount you save). The sale price is what you pay: take the discount off the regular price — or multiply by the percent you pay.' },
      { v: price - p, code: 'u1l9-dollars-off', hint: t(pc(p) + '\\%') + ' off is not ' + t('\\$' + pc(p)) + ' off. Change the percent to a decimal and multiply.' },
      { v: price * (1 + p / 100), code: 'u1l9-added', hint: 'A discount makes the price go <b>down</b>. Subtract the discount (or multiply by the percent you pay, ' + t(pay(p)) + ').' },
      { v: price * p, code: 'u1l9-not-decimal', hint: 'Change the percent to a decimal first: ' + t(pc(p) + '\\%=' + dec(p)) + '.' },
      { v: price * (100 - p), code: 'u1l9-not-decimal', hint: 'Change the percent to a decimal first: you pay ' + t(pc(100 - p) + '\\%=' + pay(p)) + '.' }];
  }
  function discDiag(price, p) { // finding the discount
    return [
      { v: price * (100 - p) / 100, code: 'u1l9-gave-sale', hint: 'That’s the <b>sale price</b>. The discount is the amount you <b>save</b>: ' + t(dec(p) + '\\times') + ' the regular price.' },
      { v: price * p, code: 'u1l9-not-decimal', hint: 'Change the percent to a decimal first: ' + t(pc(p) + '\\%=' + dec(p)) + '.' },
      { v: p, code: 'u1l9-dollars-off', hint: t(pc(p) + '\\%') + ' off is not ' + t('\\$' + pc(p)) + ' off. Multiply the price by ' + t(dec(p)) + '.' }];
  }
  function decDiag(o, n) { // percent decrease from o to n
    return [
      { v: (o - n) / n * 100, code: 'u1l9-by-new', hint: 'Divide by the <b>original</b> price, not the new price. The percent is “out of” what it used to cost.' },
      { v: n / o * 100, code: 'u1l9-pct-pay', hint: 'That’s the percent of the old price you still <b>pay</b>. Find the amount of the decrease first, then divide it by the original price.' },
      { v: o - n, code: 'u1l9-dollars', hint: 'That’s the drop in <b>dollars</b>. Divide it by the original price and multiply by 100 to get the percent.' }];
  }
  function pdSol(o, n, dp) {
    var d = r2(o - n), x = d / o * 100, show = dp == null ? pct1(x) : K.roundTo(x, dp).toFixed(dp);
    return 'Decrease: ' + t(c2(o) + '-' + c2(n) + '=' + Mt(d)) + '<br>' + t('\\dfrac{' + c2(d) + '}{' + c2(o) + '}\\times 100' + (near(x, +show, 1e-9) ? '=' : '=' + N(+x.toFixed(4)) + (near(x, +x.toFixed(4), 1e-9) ? '' : '\\ldots') + '\\approx ') + show + '\\%') + '<br>The price dropped by ' + (near(x, +show, 1e-9) ? '' : 'about ') + show + '%.';
  }
  var RULE_DEC = 'Percent decrease = decrease ÷ <b>original</b> price × 100.';

  HW.addCodes({
    'u1l9-comma': 'Comma instead of a decimal point', 'u1l9-cents': 'Not rounded to the cent', 'u1l9-to-cent': 'Not given to the cent', 'u1l9-round-dir': 'Rounded the wrong way',
    'u1l9-as-percent': 'Gave the decimal instead of the percent', 'u1l9-want-decimal': 'Gave a percent instead of the decimal', 'u1l9-not-decimal': 'Percent not changed to a decimal',
    'u1l9-mult-off': 'Multiplied by the percent off instead of the percent paid', 'u1l9-plus': 'Added the percent (markup) instead of taking it off', 'u1l9-small-pct': 'A one-digit percent as the wrong decimal (8% as 0.8)',
    'u1l9-dec-place': 'Decimal point in the wrong place', 'u1l9-row-percent': 'Decimal in the percent row', 'u1l9-pay-off': 'Gave the percent off as the percent paid',
    'u1l9-est': 'Estimate too far off', 'u1l9-est-sale': 'Estimated the sale price instead of the discount', 'u1l9-gave-discount': 'Gave the discount as the sale price', 'u1l9-gave-sale': 'Gave the sale price as the discount',
    'u1l9-dollars-off': 'Took the percent off as dollars', 'u1l9-added': 'Added the discount', 'u1l9-no-discount': 'Left out the discount', 'u1l9-one-item': 'Priced only one item', 'u1l9-qty': 'Left out a quantity',
    'u1l9-one-rate': 'Used one discount rate for every item', 'u1l9-saved-total': 'Gave the total saved instead of the total paid', 'u1l9-by-new': 'Percent decrease: divided by the new price',
    'u1l9-pct-pay': 'Gave the percent paid instead of the percent off', 'u1l9-dollars': 'Gave the dollar amount instead of the percent', 'u1l9-tax-regular': 'Tax on the regular price',
    'u1l9-no-tax': 'Left out the tax', 'u1l9-gave-tax': 'Gave the tax instead of the total', 'u1l9-tax-dollars': 'Took the tax rate as dollars', 'u1l9-pct-combined': 'Combined the discount and tax percents by adding',
    'u1l9-save-no-tax': 'Savings without the tax', 'u1l9-gave-regular': 'Gave the regular price (with tax)', 'u1l9-paid-all': 'Paid for every item (free one included)', 'u1l9-out-of-paid': 'Percent saved out of what was paid',
    'u1l9-half-whole': 'Took the half-price as the percent saved', 'u1l9-added-discounts': 'Added the stacked discounts', 'u1l9-one-discount': 'Applied only one discount', 'u1l9-second-off-regular': 'Took the second discount off the regular price',
    'u1l9-markup-added': 'Combined markup and discount by adding/subtracting percents', 'u1l9-with-gst': 'Used the price with GST', 'u1l9-ad-pct': 'Trusted the advertised percent', 'u1l9-by-raised': 'Divided by the raised price',
    'u1l9-by-sale': 'Divided by the sale price', 'u1l9-backwards-up': 'Worked backwards by adding the percent', 'u1l9-backwards-mult': 'Worked backwards by multiplying', 'u1l9-backwards-off': 'Worked backwards with the percent off',
    'u1l9-wrong-hours': 'Left out the hours', 'u1l9-diff-sign': 'Difference of the wrong pair'
  });
  HW.addPartial({
    'u1l9-round-dir': 's', 'u1l9-gave-discount': 'b', 'u1l9-gave-sale': 'b', 'u1l9-dollars-off': 'n', 'u1l9-added': 'n', 'u1l9-not-decimal': 'b', 'u1l9-mult-off': 'b', 'u1l9-plus': 'n',
    'u1l9-small-pct': 's', 'u1l9-dec-place': 's', 'u1l9-pay-off': 'b', 'u1l9-est': 'n', 'u1l9-est-sale': 'b', 'u1l9-no-discount': 'b', 'u1l9-one-item': 'b', 'u1l9-qty': 's', 'u1l9-one-rate': 'b',
    'u1l9-saved-total': 'b', 'u1l9-by-new': 'b', 'u1l9-pct-pay': 'b', 'u1l9-dollars': 'b', 'u1l9-tax-regular': 'b', 'u1l9-no-tax': 'b', 'u1l9-gave-tax': 'b', 'u1l9-tax-dollars': 'n',
    'u1l9-pct-combined': 'b', 'u1l9-save-no-tax': 'b', 'u1l9-gave-regular': 'n', 'u1l9-paid-all': 'n', 'u1l9-out-of-paid': 'b', 'u1l9-half-whole': 'n', 'u1l9-added-discounts': 'n',
    'u1l9-one-discount': 'b', 'u1l9-second-off-regular': 'b', 'u1l9-markup-added': 'b', 'u1l9-with-gst': 's', 'u1l9-ad-pct': 'n', 'u1l9-by-raised': 'b', 'u1l9-by-sale': 'b',
    'u1l9-backwards-up': 'n', 'u1l9-backwards-mult': 'n', 'u1l9-backwards-off': 'n', 'u1l9-wrong-hours': 'b', 'u1l9-diff-sign': 'b'
  });

  /* ================= generators ================= */
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  var NAMES = ['Owen', 'Mei', 'Priya', 'Jesse', 'Ali', 'Natalie', 'Daniel', 'Maya', 'Liam', 'Ava', 'Noah', 'Sofia', 'Ethan', 'Zara', 'Lucas', 'Hana', 'Mateo', 'Chloe', 'Arjun', 'Tessa'];
  var AB_CITIES = ['Red Deer', 'Lethbridge', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Okotoks', 'Cochrane', 'Edmonton', 'Fort McMurray', 'Camrose'];
  var TAX_PLACES = [{ city: 'Toronto', prov: 'Ontario', tax: 13, name: 'HST', what: '13% HST' }, { city: 'Ottawa', prov: 'Ontario', tax: 13, name: 'HST', what: '13% HST' },
    { city: 'Vancouver', prov: 'BC', tax: 12, name: 'GST and PST', what: '5% GST and 7% PST' }, { city: 'Kelowna', prov: 'BC', tax: 12, name: 'GST and PST', what: '5% GST and 7% PST' },
    { city: 'Halifax', prov: 'Nova Scotia', tax: 14, name: 'HST', what: '14% HST' }];
  function taxWord(pl) { return pl.tax === 12 ? 'Tax: ' + t('5\\%+7\\%=12\\%') + ', so multiply by ' + t('1.12') + '.' : pl.name + ' is ' + pl.tax + '%, so multiply by ' + t(dec(100 + pl.tax)) + '.'; }

  /* Q1 / table: percent off → percent you pay → multiply by */
  function tablePart(r) {
    var offs = find(function () {
      var big = r.sample([20, 30, 35, 45, 50, 55, 65, 70, 75, 80, 85, 90], 3), small = r.pick([2, 3, 4, 6, 7, 8, 9]), half = r.pick([12.5, 7.5, 17.5, 22.5, 2.5, 37.5, 62.5]);
      var arr = big.slice(0, 2).concat([small, half, big[2]]).concat([r.pick([12, 18, 24, 32, 42, 48, 16, 28])]);
      return r.shuffle(arr.slice(0, 4)).concat(arr.slice(4));
    }, function (a) { return a.every(function (x, i) { return a.indexOf(x) === i; }); }, [20, 35, 50, 8, 12.5, 75]);
    var cols = offs.map(function (p) { return pc(p) + '\\%'; });
    var rows = ['\\text{Percent you pay}', '\\text{Multiply by}'];
    var keyCells = [offs.map(function (p) { return pc(100 - p); }), offs.map(function (p) { return pay(p); })];
    var payC = offs.map(payChk), mulC = offs.map(multChk);
    var check = function (resp) {
      resp = resp || {}; var M2 = resp.cells || [], firstForm = null, firstWrong = null, good = 0, n = offs.length * 2;
      for (var j = 0; j < offs.length; j++) for (var i = 0; i < 2; i++) {
        var raw = (M2[i] || [])[j], rr = (i === 0 ? payC : mulC)[j](raw == null ? '' : raw);
        if (rr.v === 'correct') { good++; continue; }
        var where = 'Under <b>' + pc(offs[j]) + '% off</b> (' + (i === 0 ? 'percent you pay' : 'multiply by') + '): ';
        if (rr.v === 'form') { if (rr.code === 'empty') { if (!firstForm) firstForm = form('empty', 'Fill in every box in the table.'); } else if (!firstForm) firstForm = form(rr.code, where + rr.hint); }
        else if (!firstWrong) firstWrong = wrong(rr.code, where + (rr.hint || 'Check this box.'));
      }
      if (firstWrong) { firstWrong.hint += ' (' + good + ' of ' + n + ' boxes right.)'; return firstWrong; }
      return firstForm || ok();
    };
    var thead = '<tr><th style="text-align:left;padding:3px 8px">Percent off</th>' + offs.map(function (p) { return '<th style="padding:3px 8px">' + pc(p) + '%</th>'; }).join('') + '</tr>';
    var answer = '<table class="u1l9-tbl" style="border-collapse:collapse">' + thead + ['Percent you pay', 'Multiply by'].map(function (h, i) { return '<tr><th style="text-align:left;padding:3px 8px">' + h + '</th>' + keyCells[i].map(function (c) { return '<td style="padding:3px 8px;text-align:center">' + c + (i === 0 ? '%' : '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
    var p = { prompt: 'Complete the table. For each percent off, find the percent you pay, then the decimal you multiply by to get the sale price.',
      input: { type: 'areabox', rows: rows, cols: cols, cells: [offs.map(function () { return null; }), offs.map(function () { return null; })], keys: 'u1l9pct', corner: '\\text{Percent off}', help: 'Tap a box and type. Top row: the percent you pay. Bottom row: that percent as a decimal.' },
      check: check, key: { rows: rows, cols: cols, cells: keyCells }, answer: answer, text: 'table ' + offs.join(','),
      solution: 'You pay what is left of 100%, then divide by 100 to get the decimal:<br>' + offs.map(function (p) { return t(pc(p) + '\\%\\text{ off}:\\ 100\\%-' + pc(p) + '\\%=' + pc(100 - p) + '\\%=' + pay(p)); }).join('<br>'),
      hints: ['Percent you pay = 100% − percent off.', 'To change a percent to a decimal, divide by 100: 92% = 0.92, 87.5% = 0.875.'] };
    p.bad = [{ rows: rows, cols: cols, cells: [offs.map(function (q) { return pc(q); }), offs.map(function (q) { return dec(q); })] }, { rows: rows, cols: cols, cells: [keyCells[0], keyCells[0]] }];
    p.good = [{ rows: rows, cols: cols, cells: [keyCells[0].map(function (c) { return c + '\\%'; }), keyCells[1].map(function (c) { return String(Number(c)); })] }];
    return p;
  }

  /* Q2: estimate, then the discount and the sale price */
  function estPart(r, kind) {
    var item, price, p, base, est, estSol;
    if (kind === 'a') {
      item = r.pick(['backpack', 'hoodie', 'board game', 'pair of jeans', 'lunch kit', 'set of headphones', 'pair of sandals', 'phone case set']);
      price = r.int(3, 8) * 10 - 0.01; p = r.pick([20, 30, 20]); base = Math.round(price);
      est = base * p / 100;
      estSol = 'Estimate: ' + M(price) + ' is about $' + base + '. 10% of $' + base + ' is $' + N(base / 10) + ', so ' + p + '% is about ' + t((p / 10) + '\\times ' + N(base / 10) + '=' + N(est)) + ': about $' + N(est) + ' off, so you pay about $' + N(base - est) + '.';
    } else {
      item = r.pick(['car seat', 'stroller', 'bike rack', 'tent', 'mini fridge', 'desk chair', 'snowboard', 'space heater']);
      price = find(function () { return r.int(15, 39) * 10 + r.pick([-3, -2, -1, 1, 2, 3]); }, function (x) { return x % 10 !== 0; }, 219); p = r.pick([15, 35, 15]); base = Math.round(price / 10) * 10;
      est = base * p / 100;
      var tens = Math.floor(p / 10);
      estSol = 'Estimate: ' + M(price) + ' is about $' + base + '. 10% of $' + base + ' is $' + N(base / 10) + ' and 5% is half of that, $' + N(base / 20) + ', so ' + p + '% is about ' + t((tens > 1 ? tens + '\\times ' + N(base / 10) : N(base / 10)) + '+' + N(base / 20) + '=' + N(est)) + ': about $' + N(est) + ' off, so you pay about $' + N(base - est) + '.';
    }
    var dx = price * p / 100, disc = r2(dx), sale = r2(price - disc), sale2 = r2(price * (100 - p) / 100);
    var sol = estSol + '<br>Discount: ' + t(dec(p) + '\\times ' + c2(price) + to(dx)) + '<br>Sale price: ' + t(c2(price) + '-' + c2(disc) + '=' + Mt(sale)) + (near(sale, sale2) ? '' : ' (or ' + t(c2(price) + '\\times ' + pay(p) + to(price * (100 - p) / 100)) + ')');
    var pp = fieldsPart('A ' + item + ', regularly ' + M(price) + ', is ' + p + '% off. Estimate the discount first, then calculate the discount and the sale price.', [
      { label: 'Estimated discount', before: 'about $', chk: estChk(est, price - est), key: N(est), show: 'about $' + N(est) },
      { label: 'Discount', before: '$', chk: moneyChk(disc, { exact: dx, diag: discDiag(price, p) }), key: disc.toFixed(2), show: Mt(disc) },
      { label: 'Sale price', before: '$', chk: moneyChk(sale, { alts: [sale2], diag: saleDiag(price, p) }), key: sale.toFixed(2), show: Mt(sale) }],
      sol, ['10% of a price: move the decimal point one place left. 5% is half of 10%.', 'Discount = rate (as a decimal) × regular price. Sale price = regular price − discount.'], 'estimate ' + p + '% off ' + price);
    pp.answer = 'Estimate about $' + N(est) + '; discount ' + t(Mt(disc)) + '; sale price ' + t(Mt(sale));
    pp.bad = [[N(est), r2(price - disc).toFixed(2), disc.toFixed(2)], [N(est), (price * p).toFixed(2), r2(price - p).toFixed(2)]];
    pp.good = [['$' + N(est + 1), '$' + disc.toFixed(2), '$' + sale.toFixed(2)]];
    return pp;
  }

  /* a sale price with the shortcut */
  function shortcutPart(prompt, price, p, text) {
    var x = price * (100 - p) / 100, sale = r2(x);
    return moneyPart(prompt, sale, { exact: x, diag: saleDiag(price, p) },
      'Pay ' + t(pc(100 - p) + '\\%') + ': ' + t(c2(price) + '\\times ' + pay(p) + to(x)) + '<br>The sale price is ' + t(Mt(sale)) + '.',
      ['You pay ' + t('100\\%-' + pc(p) + '\\%') + '. Change that to a decimal.', 'Multiply the regular price by that decimal, then round to the cent.'], text);
  }

  /* percent decrease, exact or rounded */
  function pdPart(prompt, o, n, dp, text, more) {
    var x = (o - n) / o * 100;
    var p = pctPart(prompt, x, { dp: dp, diag: decDiag(o, n), nr: more && more.nr }, pdSol(o, n, dp), ['First find the decrease: original − new.', RULE_DEC], text);
    if (more && more.nr) { p.input.after = '%'; }
    return p;
  }
  function niceDecrease(r, origs, pcts, step) {
    return find(function () { var o = r.pick(origs), q = r.pick(pcts), n = o * (100 - q) / 100; return [o, n, q]; }, function (v) { return near(v[1] / step, Math.round(v[1] / step), 1e-9) && v[1] > 0; }, null);
  }

  /* Q5 / several items, each with its own discount */
  function multiItem(r) {
    var ctx = r.pick([
      { sale: 'Hockey Weekend', items: [{ buy: 'skates', cat: 'skates are', nm: 'Skates', lo: 150, hi: 260 }, { buy: 'a stick', cat: 'sticks are', nm: 'Stick', lo: 80, hi: 140 }, { buy: 'rolls of tape', cat: 'tape is', nm: 'Tape', lo: 3.5, hi: 6 }] },
      { sale: 'Camping Days', items: [{ buy: 'a tent', cat: 'tents are', nm: 'Tent', lo: 140, hi: 280 }, { buy: 'a sleeping bag', cat: 'sleeping bags are', nm: 'Sleeping bag', lo: 60, hi: 130 }, { buy: 'fuel canisters', cat: 'fuel is', nm: 'Fuel', lo: 4, hi: 8 }] },
      { sale: 'Back to School', items: [{ buy: 'a laptop bag', cat: 'bags are', nm: 'Laptop bag', lo: 90, hi: 160 }, { buy: 'a graphing calculator', cat: 'calculators are', nm: 'Calculator', lo: 70, hi: 130 }, { buy: 'packs of pens', cat: 'pens are', nm: 'Pens', lo: 3, hi: 7 }] },
      { sale: 'Ski Week', items: [{ buy: 'ski boots', cat: 'boots are', nm: 'Boots', lo: 180, hi: 320 }, { buy: 'a helmet', cat: 'helmets are', nm: 'Helmet', lo: 70, hi: 140 }, { buy: 'pairs of ski socks', cat: 'socks are', nm: 'Socks', lo: 9, hi: 16 }] }]);
    var it = ctx.items, who = r.pick(NAMES), rates = [r.pick([25, 20, 25]), r.pick([30, 35, 40]), r.pick([10, 15])], qty = r.pick([3, 2, 4]);
    var prices = it.map(function (x, i) { return i < 2 ? r.int(x.lo, x.hi) + r.pick([0.96, 0.9, 0.99, 0.95, 0.5]) : Math.round((x.lo + r.next() * (x.hi - x.lo)) * 4) / 4; });
    var lineReg = [prices[0], prices[1], qty * prices[2]], lineX = lineReg.map(function (v, i) { return v * (100 - rates[i]) / 100; }), lines = lineX.map(r2);
    var tot = r2(lines[0] + lines[1] + lines[2]), alt = r2(lineX[0] + lineX[1] + lineX[2]);
    var regT = lineReg[0] + lineReg[1] + lineReg[2];
    var diag = [
      { v: lineX[0] + lineX[1] + prices[2] * (100 - rates[2]) / 100, code: 'u1l9-qty', hint: 'There are ' + qty + ' ' + it[2].buy + ' — multiply that price by ' + qty + ' first.' },
      { v: regT * (100 - rates[0]) / 100, code: 'u1l9-one-rate', hint: 'Each kind of item has its <b>own</b> discount. Find each sale price separately, then add.' },
      { v: regT, code: 'u1l9-no-discount', hint: 'That’s the regular total. Take each item’s discount off first.' },
      { v: regT - (lineX[0] + lineX[1] + lineX[2]), code: 'u1l9-saved-total', hint: 'That’s how much is <b>saved</b>. The question asks for the total paid.' },
      { v: regT * (100 - rates[0] - rates[1] - rates[2]) / 100, code: 'u1l9-added-discounts', hint: 'Don’t add the percents together. Each discount comes off its own item.' }];
    var sol = it[0].nm + ' (pay ' + (100 - rates[0]) + '%): ' + t(c2(prices[0]) + '\\times ' + pay(rates[0]) + to(lineX[0])) +
      '<br>' + it[1].nm + ' (pay ' + (100 - rates[1]) + '%): ' + t(c2(prices[1]) + '\\times ' + pay(rates[1]) + to(lineX[1])) +
      '<br>' + it[2].nm + ': ' + t(qty + '\\times ' + c2(prices[2]) + '=' + c2(lineReg[2])) + ', then ' + t(c2(lineReg[2]) + '\\times ' + pay(rates[2]) + to(lineX[2])) +
      '<br>Total: ' + t(c2(lines[0]) + '+' + c2(lines[1]) + '+' + c2(lines[2]) + '=' + Mt(tot));
    return moneyPart('At a “' + ctx.sale + '” sale, ' + it[0].cat + ' ' + rates[0] + '% off, ' + it[1].cat + ' ' + rates[1] + '% off and ' + it[2].cat + ' ' + rates[2] + '% off. ' + who + ' buys ' + it[0].buy + ' (' + M(prices[0]) + '), ' + it[1].buy + ' (' + M(prices[1]) + ') and ' + qty + ' ' + it[2].buy + ' at ' + M(prices[2]) + ' each. What is the total before tax?',
      tot, { alts: [alt], diag: diag }, sol, ['Find the sale price of each kind of item with its own discount.', 'Don’t forget to multiply by the quantity. Then add the three sale prices.'], 'multi-item ' + ctx.sale);
  }

  /* sale price, GST and total (Alberta) */
  function gstFields(r, prompt, price, p, o) {
    o = o || {};
    var sx = price * (100 - p) / 100, sale = r2(sx), g = r2(sale * 0.05), tot = r2(sale + g), tot2 = r2(price * (100 - p) / 100 * 1.05);
    var specs = [
      { label: 'Sale price', before: '$', chk: moneyChk(sale, { exact: sx, diag: saleDiag(price, p) }), key: sale.toFixed(2), show: t(Mt(sale)) },
      { label: 'GST', before: '$', chk: moneyChk(g, { alts: [r2(sx * 0.05)], diag: [{ v: price * 0.05, code: 'u1l9-tax-regular', hint: 'GST is charged on the <b>sale price</b> (what you actually pay), not the regular price.' }, { v: sale * 5, code: 'u1l9-not-decimal', hint: 'Change 5% to a decimal: 0.05.' }, { v: 5, code: 'u1l9-tax-dollars', hint: '5% GST is not $5. Multiply the sale price by 0.05.' }, { v: sale * 1.05, code: 'u1l9-gave-tax', hint: 'That’s the total. This box is just the GST: sale price × 0.05.' }] }), key: g.toFixed(2), show: t(Mt(g)) },
      { label: 'Total cost', before: '$', chk: moneyChk(tot, { alts: [tot2], diag: [{ v: price * 1.05, code: 'u1l9-no-discount', hint: 'Take the discount off first, then add the GST.' }, { v: sale + price * 0.05, code: 'u1l9-tax-regular', hint: 'GST is charged on the sale price, not the regular price.' }, { v: sale, code: 'u1l9-no-tax', hint: 'Add the GST to the sale price.' }, { v: price * (100 - p + 5) / 100, code: 'u1l9-pct-combined', hint: 'You can’t just combine the percents (' + t('-' + p + '\\%+5\\%') + '). Take the discount off first, then multiply the sale price by ' + t('1.05') + '.' }] }), key: tot.toFixed(2), show: t(Mt(tot)) }];
    var sol = 'Sale price: ' + t(c2(price) + '\\times ' + pay(p) + to(sx)) + '<br>GST: ' + t(c2(sale) + '\\times 0.05' + to(sale * 0.05)) + '<br>Total: ' + t(c2(sale) + '+' + c2(g) + '=' + Mt(tot)) + ' (or ' + t(N(price) + '\\times ' + pay(p) + '\\times 1.05' + to(price * (100 - p) / 100 * 1.05)) + ')';
    var hints = ['Sale price first: multiply by the percent you pay.', 'GST is 5% of the <b>sale</b> price. Total = sale price + GST (or sale price × 1.05).'];
    if (o.only === 'total') return moneyPart(prompt, tot, { alts: [tot2], diag: [{ v: price * 1.05, code: 'u1l9-no-discount', hint: 'Take the discount off first, then add the GST.' }, { v: sale + price * 0.05, code: 'u1l9-tax-regular', hint: 'GST is charged on the sale price, not the regular price.' }, { v: sale, code: 'u1l9-no-tax', hint: 'That’s the sale price. Add the 5% GST.' }, { v: price * (100 - p + 5) / 100, code: 'u1l9-pct-combined', hint: 'You can’t just combine the percents. Take the discount off first, then multiply the sale price by ' + t('1.05') + '.' }, { v: price * p / 100, code: 'u1l9-gave-discount', hint: 'That’s the discount. Find the sale price, then add the GST.' }] }, sol, hints, o.text);
    var fp = fieldsPart(prompt, specs, sol, hints, o.text);
    fp.answer = 'Sale price ' + t(Mt(sale)) + '; GST ' + t(Mt(g)) + '; total ' + t(Mt(tot));
    fp.bad = [[r2(price * p / 100).toFixed(2), r2(price * 0.05).toFixed(2), r2(price * 1.05).toFixed(2)]];
    return fp;
  }

  /* sale then tax in another province: total and the savings vs the regular price with tax */
  function provShared(r) {
    var pl = r.pick(TAX_PLACES), price = r.int(8, 22) * 10, p = r.pick([35, 30, 40, 25]), who = r.pick(NAMES), item = r.pick(['sneakers', 'a winter coat', 'winter boots', 'a backpack', 'a rain jacket', 'headphones']);
    var sx = price * (100 - p) / 100, sale = r2(sx), totX = sale * (100 + pl.tax) / 100, tot = r2(totX), regT = r2(price * (100 + pl.tax) / 100);
    return { pl: pl, price: price, p: p, who: who, item: item, sale: sale, tot: tot, tot2: r2(sx * (100 + pl.tax) / 100), regT: regT, totX: totX };
  }
  function provTotal(s, extraQ) {
    var m = dec(100 + s.pl.tax);
    return moneyPart('On a trip to ' + s.pl.city + ', ' + s.pl.prov + ' (' + s.pl.what + '), ' + s.who + ' buys ' + s.item + ' that ' + (/s$/.test(s.item) ? 'are' : 'is') + ' regularly ' + M(s.price) + ', at ' + s.p + '% off. What is the total cost with tax?',
      s.tot, { alts: [s.tot2], exact: s.totX, diag: [{ v: s.sale, code: 'u1l9-no-tax', hint: 'That’s the sale price. Now add the tax: multiply by ' + t(m) + '.' }, { v: s.price * (100 + s.pl.tax) / 100, code: 'u1l9-no-discount', hint: 'Take the ' + s.p + '% off first, then add the tax.' },
        { v: s.price * (100 - s.p + s.pl.tax) / 100, code: 'u1l9-pct-combined', hint: 'You can’t just combine the percents. Take the discount off first, then multiply the sale price by ' + t(m) + '.' }, { v: s.sale + s.pl.tax, code: 'u1l9-tax-dollars', hint: s.pl.tax + '% tax is not $' + s.pl.tax + '. Multiply by ' + t(m) + '.' }, { v: s.sale * 1.05, code: 'u1l9-tax-regular', hint: s.pl.city + ' is not in Alberta: use ' + s.pl.what + ', not just 5% GST.' }] },
      'Sale price: ' + t(c2(s.price) + '\\times ' + pay(s.p) + '=' + Mt(s.sale)) + '<br>' + taxWord(s.pl) + '<br>Total: ' + t(c2(s.sale) + '\\times ' + m + to(s.totX)), ['Find the sale price first.', 'Then add the tax for that province: multiply by 1 + the tax rate.'], 'trip total ' + s.pl.city);
  }
  function provSave(s) {
    var m = dec(100 + s.pl.tax), sv = r2(s.regT - s.tot);
    return moneyPart('How much less is this than the regular price with ' + s.pl.name + '?', sv, { alts: [r2(s.regT - s.tot2)], diag: [{ v: s.price * s.p / 100, code: 'u1l9-save-no-tax', hint: 'That’s the discount before tax. Compare the two totals <b>with</b> tax: regular price with tax − what ' + s.who + ' paid.' }, { v: s.regT, code: 'u1l9-gave-regular', hint: 'That’s the regular price with tax. Subtract what ' + s.who + ' paid.' }, { v: s.price - s.tot, code: 'u1l9-no-tax', hint: 'Add the tax to the regular price too, so you compare total with total.' }] },
      'Regular with tax: ' + t(c2(s.price) + '\\times ' + m + '=' + Mt(s.regT)) + '<br>Savings: ' + t(c2(s.regT) + '-' + c2(s.tot) + '=' + Mt(sv)), ['Find what the item would cost with tax at the regular price.', 'Subtract the total ' + s.who + ' paid.'], 'trip savings');
  }

  /* reasons other than price */
  function reasonMC(r, prompt, right, wrongs, sol, text) {
    var opts = [{ html: right, right: true }].concat(wrongs.map(function (w) { return { html: w[0], why: w[1] }; }));
    return P.mc(r, prompt, opts, sol, ['A good reason is about what <b>you</b> need: how many you will use, storage, freshness, distance, returns or warranty.'], text);
  }

  HW.defineLesson({
    id: 'u1l9', unit: 1, num: '9', title: 'On Sale! Discounts and Sale Prices', outcome: 'N1',
    blurb: 'Finding the discount and the sale price, the percent decrease, tax on a sale price, and deciding which sale is really the best deal.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1', level: 'BEG', make: function (r) { return tablePart(r); } }] },
      { num: '2', stem: 'Estimate first, then calculate the discount and the sale price.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return estPart(r, 'a'); } },
        { id: '2b', level: 'EMG', make: function (r) { return estPart(r, 'b'); } }] },
      { num: '3', stem: 'Use the shortcut (multiply by the percent you pay) to find each sale price.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var it = r.pick(['A bike helmet', 'A pair of shin pads', 'A hoodie', 'A basketball', 'A desk lamp', 'A yoga mat']), price = r.int(10, 30) * 4, p = r.pick([25, 25, 75, 50]); return shortcutPart(it + ', ' + M(price) + ', ' + p + '% off', price, p, 'shortcut ' + price + ' ' + p); } },
        { id: '3b', level: 'BEG', make: function (r) { var it = r.pick(['A skateboard deck', 'A pair of sunglasses', 'A soccer ball', 'A rain jacket', 'A wireless speaker', 'A sleeping bag']), price = r.int(30, 110) + 0.95, p = r.pick([40, 30, 60, 40]); return shortcutPart(it + ', ' + M(price) + ', ' + p + '% off', price, p, 'shortcut ' + price + ' ' + p); } },
        { id: '3c', level: 'BEG', make: function (r) { var it = r.pick(['A laptop', 'A gaming console bundle', 'A mountain bike', 'A sofa', 'A big-screen TV', 'A pair of skis with bindings']), price = r.int(70, 160) * 10 - 0.01, p = r.pick([10, 10, 20, 5]); return shortcutPart(it + ', ' + M(price) + ', ' + p + '% off', price, p, 'shortcut ' + price + ' ' + p); } }] },
      { num: '4', stem: '', parts: [{ id: '4', level: 'EMG', make: function (r) {
        var c = r.pick([
          { shop: 'A print shop', unit: 'page', units: 'pages', u: r.pick([0.12, 0.15, 0.18, 0.2, 0.22, 0.25]), min: r.pick([250, 500, 1000]), k: [1.2, 1.4, 1.6, 2, 2.4] },
          { shop: 'A bakery', unit: 'cupcake', units: 'cupcakes', u: r.pick([1.25, 1.5, 1.75, 2.1, 2.25]), min: r.pick([24, 36, 48]), k: [1.25, 1.5, 2] },
          { shop: 'A sign shop', unit: 'sticker', units: 'stickers', u: r.pick([0.4, 0.45, 0.6, 0.75, 0.85]), min: r.pick([100, 200, 250]), k: [1.2, 1.5, 2, 3] }]);
        var d = r.pick([10, 15, 20, 15]), n = Math.round(c.min * r.pick(c.k)), regX = n * c.u, reg = r2(regX), x = reg * (100 - d) / 100, ans = r2(x);
        return moneyPart(c.shop + ' charges ' + M(c.u) + ' per ' + c.unit + '. Orders of ' + c.min + ' ' + c.units + ' or more get ' + d + '% off. What does an order of ' + n + ' ' + c.units + ' cost before tax?', ans,
          { exact: x, diag: [{ v: reg, code: 'u1l9-no-discount', hint: 'The order is ' + c.min + ' or more, so take ' + d + '% off the regular cost.' }, { v: reg * d / 100, code: 'u1l9-gave-discount', hint: 'That’s the discount. Pay ' + (100 - d) + '% of the regular cost.' }, { v: c.u * (100 - d) / 100, code: 'u1l9-one-item', hint: 'That’s for one ' + c.unit + '. Find the cost of all ' + n + ' first.' }, { v: reg - d, code: 'u1l9-dollars-off', hint: d + '% off is not $' + d + ' off. Multiply by ' + t(pay(d)) + '.' }, { v: reg * (100 + d) / 100, code: 'u1l9-added', hint: 'A discount makes the cost go down: multiply by ' + t(pay(d)) + '.' }] },
          'Regular: ' + t(n + '\\times ' + c2(c.u) + '=' + Mt(reg)) + '<br>Pay ' + (100 - d) + '%: ' + t(c2(reg) + '\\times ' + pay(d) + to(x)) + '<br>The order costs ' + t(Mt(ans)) + '.', ['Find the regular cost of the whole order first.', 'Is the order big enough for the discount? Then multiply by the percent you pay.'], 'bulk order ' + c.unit);
      } }] },
      { num: '5', stem: '', parts: [{ id: '5', level: 'PRG', make: function (r) { return multiItem(r); } }] },
      { num: '6', stem: 'Find the percent decrease.', shared: function (r) {
        var o = r.pick([60, 70, 80, 90, 100, 110, 120, 150]), w = r.pick([10, 20, 25, 30]), n = o * (100 - w) / 100;
        if (o === 80 && w === 25) { o = 90; w = 20; n = 72; }
        return { o: o, n: n, w: w, who: r.pick(['Jesse', 'Maya', 'Liam', 'Ava', 'Kian', 'Rosa']), item: r.pick(['drill', 'bike lock', 'jacket', 'pair of skates', 'toolbox', 'printer']) };
      }, parts: [
        { id: '6a', level: 'BEG', make: function (r) { var v = niceDecrease(r, [20, 30, 40, 50, 60], [10, 20, 30, 40, 50], 1) || [50, 35, 30]; return pdPart('$' + v[0].toFixed(2) + ' to $' + v[1].toFixed(2), v[0], v[1], null, 'pd ' + v[0] + '-' + v[1]); } },
        { id: '6b', level: 'BEG', make: function (r) { var v = niceDecrease(r, [120, 160, 200, 240, 280, 320, 360, 400], [15, 20, 25, 35, 40], 1) || [240, 180, 25]; return pdPart('$' + v[0].toFixed(2) + ' to $' + v[1].toFixed(2), v[0], v[1], null, 'pd ' + v[0] + '-' + v[1]); } },
        { id: '6c', level: 'EMG', make: function (r) { var v = find(function () { var o = r.int(80, 250) * 100, q = r.pick([12.5, 7.5, 17.5, 22.5, 8, 14, 6, 12]); return [o, o * (100 - q) / 100, q]; }, function (v) { return near(v[1] / 50, Math.round(v[1] / 50), 1e-9) && !(v[0] === 18500); }, [12400, 10850, 12.5]); var veh = r.pick(['A used car', 'A used truck', 'A boat', 'A used snowmobile', 'A camper trailer']); return pdPart(veh + ': $' + HW.fmt(v[0], true) + ' to $' + HW.fmt(v[1], true), v[0], v[1], null, 'pd ' + v[0] + '-' + v[1]); } },
        { id: '6di', sub: 'd i', level: 'EMG', make: function (r, s) {
          var dlt = s.o - s.n, claim = dlt / s.n * 100, cl = near(claim, Math.round(claim), 1e-9) ? String(Math.round(claim)) : 'about ' + pct1(claim);
          return P.mc(r, 'A ' + s.item + ' goes on sale from ' + M(s.o) + ' to ' + M(s.n) + '. ' + s.who + ' says it is ' + cl + '% off because ' + t(N(dlt) + '\\div ' + N(s.n) + (near(claim, Math.round(claim), 1e-9) ? '=' + N(claim / 100) : '\\approx ' + N(+(claim / 100).toFixed(3)))) + '. What is ' + s.who + '’s mistake?', [
            { html: s.who + ' divided by the <b>sale</b> price. A percent decrease is out of the <b>original</b> price, so divide ' + t(N(dlt)) + ' by ' + t(N(s.o)) + '.', right: true },
            { html: s.who + ' forgot to multiply by 100.', why: s.who + ' did change ' + t(N(+(claim / 100).toFixed(3))) + ' to ' + cl + '%. Look at the number ' + s.who + ' divided by.' },
            { html: s.who + ' should have subtracted the other way: ' + t(N(s.n) + '-' + N(s.o)) + '.', why: 'The decrease ' + t(N(s.o) + '-' + N(s.n) + '=' + N(dlt)) + ' is right. Look at the number ' + s.who + ' divided by.' },
            { html: 'There is no mistake: ' + s.who + ' is right.', why: 'Check what a percent decrease is “out of”: the original price or the sale price?' }],
            s.who + ' divided by the sale price ' + t(N(s.n)) + '. A percent decrease is always out of the original price: ' + t('\\dfrac{' + N(dlt) + '}{' + N(s.o) + '}\\times 100=' + pc(s.w) + '\\%') + '.', [RULE_DEC], 'Jesse mistake', true);
        } },
        { id: '6dii', sub: 'd ii', level: 'EMG', make: function (r, s) { return pdPart('What is the correct percent decrease for the ' + s.item + ' (' + M(s.o) + ' to ' + M(s.n) + ')?', s.o, s.n, null, 'pd correct ' + s.o); } }] },
      { num: '7', stem: '', parts: [{ id: '7', level: 'EMG', make: function (r) {
        var it = r.pick(['microwave', 'vacuum cleaner', 'coffee maker', 'air fryer', 'printer', 'toaster oven']), price = r.int(9, 30) * 10 + r.pick([0, 9, 5]), p = r.pick([20, 25, 30, 15]);
        return gstFields(r, 'In ' + r.pick(AB_CITIES) + ', a ' + it + ' is regularly ' + M(price) + '. It is on sale for ' + p + '% off. Find the sale price, the GST (5%) and the total cost.', price, p, { text: 'gst ' + price + ' ' + p });
      } }] },
      { num: '8', stem: '', shared: function (r) { return provShared(r); }, parts: [
        { id: '8a', level: 'EMG', make: function (r, s) { return provTotal(s); } },
        { id: '8b', level: 'PRG', make: function (r, s) { var p = provSave(s); p.prompt = 'In part (a), ' + s.who + ' bought ' + s.item + ' regularly ' + M(s.price) + ' at ' + s.p + '% off in ' + s.pl.city + ' (' + s.pl.what + '). ' + p.prompt; return p; } }] },
      { num: '9', stem: function (s) { return 'A sports store sells cans of tennis balls for ' + M(s.c) + ' each with the deal ' + BOX('Buy ' + s.n + ', get 1 free') + '.'; },
        shared: function (r) { var n = r.pick([3, 3, 4]); return { c: r.int(5, 11) + r.pick([0.99, 0.49, 0.79]), n: n, x: n === 3 ? 50 : 40 }; }, parts: [
          { id: '9a', level: 'EMG', make: function (r, s) {
            var pay2 = r2(s.n * s.c), reg = r2((s.n + 1) * s.c), saved = 100 / (s.n + 1);
            var p = fieldsPart('What do you pay for ' + (s.n + 1) + ' cans? What percent do you save?', [
              { label: 'You pay', before: '$', chk: moneyChk(pay2, { diag: [{ v: reg, code: 'u1l9-paid-all', hint: 'One of the ' + (s.n + 1) + ' cans is free, so you pay for only ' + s.n + '.' }, { v: (s.n - 1) * s.c, code: 'u1l9-one-item', hint: 'You pay for ' + s.n + ' cans (the ' + (s.n + 1) + 'th is free).' }] }), key: pay2.toFixed(2), show: t(Mt(pay2)) },
              { label: 'Percent saved', after: '%', chk: pctChk(saved, { dp: 1, tol: 0.05, diag: [{ v: 100 / s.n, code: 'u1l9-out-of-paid', hint: 'The percent saved is out of the regular price of <b>everything you take home</b> (' + (s.n + 1) + ' cans), not the cans you paid for.' }, { v: s.c, code: 'u1l9-dollars', hint: 'That’s the dollars saved. Divide it by the regular price of all ' + (s.n + 1) + ' cans and multiply by 100.' }] }), key: pc(saved), show: t(pc(saved) + '\\%') }],
              'Pay for ' + s.n + ': ' + t(s.n + '\\times ' + c2(s.c) + '=' + Mt(pay2)) + '. Regular for ' + (s.n + 1) + ': ' + t((s.n + 1) + '\\times ' + c2(s.c) + '=' + Mt(reg)) + '.<br>Saved ' + t(Mt(s.c)) + ': ' + t('\\dfrac{' + c2(s.c) + '}{' + c2(reg) + '}\\times 100=' + pc(saved) + '\\%'),
              ['You take home ' + (s.n + 1) + ' cans but pay for ' + s.n + '.', 'Percent saved = amount saved ÷ regular price of everything you take home × 100.'], 'buy ' + s.n + ' get 1');
            p.bad = [[reg.toFixed(2), pc(100 / s.n)]];
            return p;
          } },
          { id: '9b', level: 'EMG', make: function (r, s) {
            var sv = s.x / 2, sec = r2(s.c * (100 - s.x) / 100);
            return pctPart('Another store has the same cans at ' + M(s.c) + ' with ' + BOX(s.x === 50 ? 'Buy one, get the second half price' : 'Buy one, get the second ' + s.x + '% off') + '. What percent do you save on 2 cans there?', sv,
              { dp: 1, tol: 0.06, diag: [{ v: s.x, code: 'u1l9-half-whole', hint: 'Only the <b>second</b> can is ' + s.x + '% off. You save that on one can out of the two you take home.' }, { v: s.c * s.x / 100, code: 'u1l9-dollars', hint: 'That’s the dollars saved. Divide by the regular price of 2 cans and multiply by 100.' }] },
              'Saved on the second can: ' + t(dec(s.x) + '\\times ' + c2(s.c) + '=' + N(s.c * s.x / 100)) + '. Regular for 2 cans: ' + t('2\\times ' + c2(s.c) + '=' + c2(2 * s.c)) + '.<br>' + t('\\dfrac{' + N(s.c * s.x / 100) + '}{' + c2(2 * s.c) + '}\\times 100=' + pc(sv) + '\\%') + ' (you save ' + s.x + '% of one can out of two).',
              ['How much do you save on the second can?', 'Divide by the regular price of both cans.'], 'second off ' + s.x);
          } },
          { id: '9c', level: 'BEG', make: function (r, s) {
            return reasonMC(r, 'Both deals save the same percent. Which is a good reason to choose the ' + (s.x === 50 ? 'half-price' : s.x + '%-off') + ' deal instead?',
              'If you only need 2 cans, you spend less and don’t buy cans you won’t use.',
              [['It saves a bigger percent.', 'Both deals save ' + pc(s.x / 2) + '%. Think about how many cans you actually need.'], ['You always get more cans for your money.', 'With this deal you take home only 2 cans. Think about how many you need.'], ['The cans in this deal are a better brand.', 'They are the same cans at the same price. Think about how many you need.']],
              'You might choose the ' + (s.x === 50 ? 'half-price' : s.x + '%-off') + ' deal if you only need 2 cans: you spend less and you don’t buy extra. The “buy ' + s.n + ', get 1” deal is fine if you play a lot and will use ' + (s.n + 1) + ' cans.', 'reason tennis');
          } }] },
      { num: '10', stem: function (s) { return 'The same ' + s.item + ' is sold at two stores. Store A: regularly ' + M(s.a) + ', ' + s.p + '% off. Store B: regularly ' + M(s.b) + ', $' + s.d + ' off.'; },
        shared: function (r) {
          return find(function () { var a = r.int(9, 20) * 10 - 0.01, p = r.pick([25, 20, 30, 15]), b = a - r.pick([5, 10, 15, 20]), d = r.pick([10, 15, 20, 25]); var A = r2(a * (100 - p) / 100), B = r2(b - d); return { item: r.pick(['speaker', 'blender', 'video game', 'hockey helmet', 'drill', 'smart watch']), a: a, p: p, b: b, d: d, A: A, B: B, Ax: a * (100 - p) / 100 }; }, function (s) { return Math.abs(s.A - s.B) >= 0.5 && Math.abs(s.A - s.B) <= 15; }, { item: 'speaker', a: 129.99, p: 25, b: 119.99, d: 20, A: 97.49, B: 99.99, Ax: 97.4925 });
        }, parts: [
          { id: '10ai', sub: 'a i', level: 'EMG', make: function (r, s) {
            var aw = s.A < s.B, sol = 'A: ' + t(c2(s.a) + '\\times ' + pay(s.p) + to(s.Ax)) + '<br>B: ' + t(c2(s.b) + '-' + s.d + '.00=' + Mt(s.B)) + '<br>Store ' + (aw ? 'A' : 'B') + ' is cheaper.';
            var p = P.mc(r, 'Which store has the lower price?', [{ html: '<b>Store A</b> (' + s.p + '% off)', right: aw, why: aw ? null : 'Work out both sale prices: Store A is ' + t(c2(s.a) + '\\times ' + pay(s.p)) + ' and Store B is ' + t(c2(s.b) + '-' + s.d) + '.' }, { html: '<b>Store B</b> ($' + s.d + ' off)', right: !aw, why: aw ? 'Work out both sale prices: Store A is ' + t(c2(s.a) + '\\times ' + pay(s.p)) + ' and Store B is ' + t(c2(s.b) + '-' + s.d) + '.' : null }], sol, ['Find each store’s sale price, then compare.'], 'which store', true);
            p.tries = 1; p.input.columns = 2; return p;
          } },
          { id: '10aii', sub: 'a ii', level: 'EMG', make: function (r, s) {
            var df = r2(Math.abs(s.A - s.B));
            return moneyPart('By how much is that store’s price lower?', df, { alts: [r2(Math.abs(s.Ax - s.B))], diag: [{ v: Math.abs(s.a - s.b), code: 'u1l9-no-discount', hint: 'That’s the difference in the <b>regular</b> prices. Find both sale prices first.' }, { v: Math.abs(s.a * s.p / 100 - s.d), code: 'u1l9-diff-sign', hint: 'That compares the two <b>discounts</b>, but the regular prices are different. Compare the two sale prices.' }] },
              'A: ' + t(c2(s.a) + '\\times ' + pay(s.p) + to(s.Ax)) + '<br>B: ' + t(c2(s.b) + '-' + s.d + '.00=' + Mt(s.B)) + '<br>Difference: ' + t(c2(Math.max(s.A, s.B)) + '-' + c2(Math.min(s.A, s.B)) + '=' + Mt(df)), ['Find both sale prices.', 'Subtract the smaller from the larger.'], 'store diff');
          } },
          { id: '10b', level: 'BEG', make: function (r, s) {
            return reasonMC(r, 'Which is a good reason, other than price, that someone might still buy at the store with the higher price?', 'That store is closer, or it has a longer warranty or a better return policy.',
              [['Its regular price is lower.', 'That’s about price. Think about service, distance, warranty or returns.'], ['A dollar-off deal is always better than a percent-off deal.', 'Not true: it depends on the price. And that’s about price anyway.'], ['A bigger percent off always means a lower price.', 'Not true, and it is still about price. Think about service, distance, warranty or returns.']],
              'Possible reasons: the store is closer, has the item in stock today, has a longer warranty or a better return policy.', 'reason store');
          } }] },
      { num: '11', stem: function (s) { return 'A clearance rack says “' + s.p1 + '% off, plus an extra ' + s.p2 + '% off at the till”. A ' + s.item + ' is regularly ' + M(s.price) + '.'; },
        shared: function (r) { var c = r.pick([[40, 25], [30, 20], [50, 20], [40, 15], [30, 25], [50, 10], [40, 30]]); return { p1: c[0], p2: c[1], price: r.int(10, 30) * 4, item: r.pick(['sweater', 'pair of jeans', 'jacket', 'pair of boots', 'backpack']), who: r.pick(['Natalie', 'Tomas', 'Grace', 'Omar']) }; }, parts: [
          { id: '11a', level: 'PRG', make: function (r, s) {
            var s1 = s.price * (100 - s.p1) / 100, f = s1 * (100 - s.p2) / 100;
            return moneyPart('What is the final price?', f, { alts: [r2(r2(s1) * (100 - s.p2) / 100)], exact: f, diag: [{ v: s.price * (100 - s.p1 - s.p2) / 100, code: 'u1l9-added-discounts', hint: 'The extra ' + s.p2 + '% comes off the <b>sale</b> price, not the regular price, so the percents don’t add. Multiply by ' + t(pay(s.p1)) + ', then by ' + t(pay(s.p2)) + '.' }, { v: s1, code: 'u1l9-one-discount', hint: 'That’s after the first discount. Now take the extra ' + s.p2 + '% off.' }, { v: s1 - s.price * s.p2 / 100, code: 'u1l9-second-off-regular', hint: 'The extra ' + s.p2 + '% is taken from the lower sale price, not from the regular price.' }] },
              'After ' + s.p1 + '% off: ' + t(c2(s.price) + '\\times ' + pay(s.p1) + to(s1)) + '<br>After the extra ' + s.p2 + '% off: ' + t(c2(s1) + '\\times ' + pay(s.p2) + to(f)), ['Take the first discount off.', 'Then take the extra discount off the <b>sale</b> price.'], 'stacked ' + s.p1 + '+' + s.p2);
          } },
          { id: '11b', level: 'PRG', make: function (r, s) {
            var f = s.price * (100 - s.p1) / 100 * (100 - s.p2) / 100, off = 100 - (100 - s.p1) * (100 - s.p2) / 100;
            return pctPart(s.who + ' thinks this is ' + (s.p1 + s.p2) + '% off. What is the real total percent off?', off, { dp: 1, diag: [{ v: s.p1 + s.p2, code: 'u1l9-added-discounts', hint: 'Stacked discounts don’t add: the second one is taken from a smaller price. Find the final price, then the percent saved.' }, { v: (100 - s.p1) * (100 - s.p2) / 100, code: 'u1l9-pct-pay', hint: 'That’s the percent you <b>pay</b>. The percent off is 100% minus that.' }, { v: s.price - f, code: 'u1l9-dollars', hint: 'That’s the dollars saved. Divide by the regular price and multiply by 100.' }] },
              'Saved: ' + t(c2(s.price) + '-' + c2(f) + '=' + Mt(s.price - f)) + '<br>' + t('\\dfrac{' + c2(s.price - f) + '}{' + c2(s.price) + '}\\times 100=' + pct1(off) + '\\%') + ' off, not ' + (s.p1 + s.p2) + '%.<br>(Or: ' + t(pay(s.p1) + '\\times ' + pay(s.p2) + '=' + N((100 - s.p1) * (100 - s.p2) / 10000)) + ', so you pay ' + pct1(100 - off) + '% and save ' + pct1(off) + '%.)',
              ['Find how many dollars you save in total.', 'Divide by the regular price and multiply by 100.'], 'stacked pct');
          } }] },
      { num: '12', stem: function (s) { return 'A ' + s.shop + ' buys ' + s.item + ' at a wholesale price of ' + M(s.w) + ' and marks it up ' + s.m + '%. ' + s.when + ' it sells the ' + s.short + ' at ' + s.d + '% off.'; },
        shared: function (r) {
          var c = r.pick([{ shop: 'garden store', item: 'a patio umbrella', short: 'umbrella', when: 'At the end of summer' }, { shop: 'sports store', item: 'a ski jacket', short: 'jacket', when: 'In the spring' }, { shop: 'party store', item: 'a costume', short: 'costume', when: 'After Halloween' }, { shop: 'hardware store', item: 'a snow blower', short: 'snow blower', when: 'In April' }]);
          var v = find(function () { return [r.int(6, 24) * 5, r.pick([60, 50, 40, 80, 100, 60]), r.pick([50, 40, 30, 25, 50])]; }, function (v) { var k = (100 + v[1]) * (100 - v[2]); return k !== 10000 && Math.abs(k - 10000) <= 2500; }, [40, 60, 50]);
          c.w = v[0]; c.m = v[1]; c.d = v[2]; c.ret = r2(c.w * (100 + c.m) / 100); c.sale = r2(c.ret * (100 - c.d) / 100); c.gst = r2(c.sale * 1.05); return c;
        }, parts: [
          { id: '12a', level: 'BEG', make: function (r, s) { return moneyPart('What was the regular (retail) price?', s.ret, { diag: [{ v: s.w * s.m / 100, code: 'u1l9-gave-discount', hint: 'That’s the markup (the amount added). Retail = wholesale + markup, or wholesale × ' + t(dec(100 + s.m)) + '.' }, { v: s.w + s.m, code: 'u1l9-dollars-off', hint: s.m + '% is not $' + s.m + '. Multiply by ' + t(dec(100 + s.m)) + '.' }, { v: s.w * (100 - s.m) / 100, code: 'u1l9-added', hint: 'A markup <b>raises</b> the price: multiply by ' + t(dec(100 + s.m)) + '.' }] }, t(c2(s.w) + '\\times ' + dec(100 + s.m) + '=' + Mt(s.ret)), ['A markup of ' + s.m + '% means the store charges ' + (100 + s.m) + '% of the wholesale price.'], 'retail'); } },
          { id: '12b', level: 'BEG', make: function (r, s) { return moneyPart('What is the sale price?', s.sale, { diag: saleDiag(s.ret, s.d).concat([{ v: s.w * (100 + s.m - s.d) / 100, code: 'u1l9-markup-added', hint: 'You can’t just combine the percents (' + t('+' + s.m + '\\%-' + s.d + '\\%') + '). Take ' + s.d + '% off the <b>retail</b> price.' }, { v: s.w * (100 - s.d) / 100, code: 'u1l9-no-discount', hint: 'The sale is ' + s.d + '% off the <b>retail</b> price (from part (a)), not the wholesale price.' }]) }, t(c2(s.ret) + '\\times ' + pay(s.d) + '=' + Mt(s.sale)), ['Take ' + s.d + '% off the retail price from part (a).'], 'sale after markup'); } },
          { id: '12c', level: 'EMG', make: function (r, s) { return moneyPart('What does a customer in Alberta pay on sale, with 5% GST?', s.gst, { alts: [r2(s.ret * (100 - s.d) / 100 * 1.05)], exact: s.sale * 1.05, diag: [{ v: s.sale * 0.05, code: 'u1l9-gave-tax', hint: 'That’s just the GST. Add it to the sale price (or multiply by 1.05).' }, { v: s.ret * 1.05, code: 'u1l9-tax-regular', hint: 'The customer pays the <b>sale</b> price plus GST.' }, { v: s.sale + 5, code: 'u1l9-tax-dollars', hint: '5% GST is not $5. Multiply by 1.05.' }] }, t(c2(s.sale) + '\\times 1.05' + to(s.sale * 1.05)), ['Multiply the sale price by 1.05.'], 'sale gst'); } },
          { id: '12di', sub: 'd i', level: 'EMG', make: function (r, s) {
            var made = s.sale > s.w;
            return P.mc(r, 'Did the store make money or lose money on this ' + s.short + ' (before tax)?', [{ html: 'It <b>made</b> money.', right: made, why: made ? null : 'Compare what the store paid (' + M(s.w) + ') with what it sold the ' + s.short + ' for (before tax).' }, { html: 'It <b>lost</b> money.', right: !made, why: made ? 'Compare what the store paid (' + M(s.w) + ') with what it sold the ' + s.short + ' for (before tax).' : null }, { html: 'It broke even (no gain, no loss).', why: 'Compare the sale price with the wholesale price — are they the same?' }],
              'It sold for ' + t(Mt(s.sale)) + ' and cost ' + t(Mt(s.w)) + ', so it ' + (made ? 'made' : 'lost') + ' money.', ['The store paid the wholesale price. What did it get for the ' + s.short + ' (before tax)?'], 'made or lost', true);
          } },
          { id: '12dii', sub: 'd ii', level: 'ADV', make: function (r, s) {
            var df = r2(Math.abs(s.sale - s.w)), made = s.sale > s.w;
            return moneyPart('How much did it ' + (made ? 'make' : 'lose') + ' (before tax)?', df, { diag: [{ v: Math.abs(s.gst - s.w), code: 'u1l9-with-gst', hint: 'Use the price <b>before tax</b>. The GST goes to the government, not the store.' }, { v: Math.abs(s.ret - s.w), code: 'u1l9-no-discount', hint: 'That’s the markup at the regular price. The store sold it on sale.' }, { v: Math.abs(s.ret - s.sale), code: 'u1l9-gave-discount', hint: 'That’s the discount. Compare the sale price with what the store paid (the wholesale price).' }] },
              'It sold for ' + t(Mt(s.sale)) + ' and cost ' + t(Mt(s.w)) + ': ' + t(c2(Math.max(s.sale, s.w)) + '-' + c2(Math.min(s.sale, s.w)) + '=' + Mt(df)) + '. The store ' + (made ? 'made' : 'lost') + ' ' + t(Mt(df)) + '.', ['Compare the sale price (before tax) with the wholesale price.'], 'profit/loss');
          } }] },
      { num: '13', stem: function (s) { return 'A ' + s.item + ' cost ' + M(s.p0) + ' in ' + s.m0 + '. In ' + s.m1 + ' the store raised the price to ' + M(s.p1) + ', then ran an ad: “' + s.d + '% off. Save big!”'; },
        shared: function (r) {
          var c = r.pick([{ item: 'sofa', m0: 'August', m1: 'October' }, { item: 'TV', m0: 'September', m1: 'November' }, { item: 'treadmill', m0: 'November', m1: 'December' }, { item: 'barbecue', m0: 'March', m1: 'May' }]);
          return find(function () { var p0 = r.int(40, 130) * 10 - 1, d = r.pick([25, 25, 30, 20]), p1 = Math.round(p0 * (1 + r.int(12, 30) / 100) / 10) * 10 - 1, sale = r2(p1 * (100 - d) / 100); return { item: c.item, m0: c.m0, m1: c.m1, p0: p0, p1: p1, d: d, sale: sale, sx: p1 * (100 - d) / 100 }; },
            function (s) { var real = (s.p0 - s.sale) / s.p0 * 100; return real >= 2 && real <= s.d - 6; }, { item: 'sofa', m0: 'August', m1: 'October', p0: 899, p1: 1099, d: 25, sale: 824.25, sx: 824.25 });
        }, parts: [
          { id: '13a', level: 'EMG', make: function (r, s) { return moneyPart('What is the sale price?', s.sale, { exact: s.sx, diag: saleDiag(s.p1, s.d).concat([{ v: s.p0 * (100 - s.d) / 100, code: 'u1l9-no-discount', hint: 'The ' + s.d + '% comes off the <b>raised</b> price, ' + M(s.p1) + '.' }]) }, t(c2(s.p1) + '\\times ' + pay(s.d) + to(s.sx)), ['The ad’s discount is taken off the raised price.'], 'raised sale'); } },
          { id: '13b', level: 'MAS', make: function (r, s) {
            var sv = s.p0 - s.sale, x = sv / s.p0 * 100;
            return pctPart('Compared with the ' + s.m0 + ' price, what percent do you really save? (Nearest tenth of a percent.)', x, { dp: 1, diag: [{ v: s.d, code: 'u1l9-ad-pct', hint: 'That’s what the ad says. Compare the sale price with the <b>' + s.m0 + '</b> price, before the store raised it.' }, { v: (s.p1 - s.sale) / s.p1 * 100, code: 'u1l9-ad-pct', hint: 'That’s the saving off the raised price — the ad’s ' + s.d + '%. Compare the sale price with the ' + s.m0 + ' price.' }, { v: sv / s.p1 * 100, code: 'u1l9-by-raised', hint: 'Divide by the ' + s.m0 + ' price, ' + M(s.p0) + ', not the raised price.' }, { v: sv / s.sale * 100, code: 'u1l9-by-sale', hint: 'Divide by the ' + s.m0 + ' price, ' + M(s.p0) + ', not the sale price.' }, { v: sv, code: 'u1l9-dollars', hint: 'That’s the dollars saved. Divide by the ' + s.m0 + ' price and multiply by 100.' }, { v: (s.p1 - s.p0) / s.p0 * 100, code: 'u1l9-ad-pct', hint: 'That’s how much the store raised the price. Compare the <b>sale</b> price with the ' + s.m0 + ' price.' }] },
              'Saved compared with ' + s.m0 + ': ' + t(c2(s.p0) + '-' + c2(s.sale) + '=' + Mt(sv)) + '<br>' + t('\\dfrac{' + c2(sv) + '}{' + c2(s.p0) + '}\\times 100=' + N(+x.toFixed(4)) + '\\ldots\\approx ' + K.roundTo(x, 1).toFixed(1) + '\\%') + '<br>You really save about ' + K.roundTo(x, 1).toFixed(1) + '%, not ' + s.d + '%.',
              ['How many dollars less than the ' + s.m0 + ' price is the sale price?', 'Divide by the ' + s.m0 + ' price and multiply by 100.'], 'fake deal pct');
          } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '14', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.int(4, 18) * 5, r.pick([30, 20, 40, 30])]; }, function (v) { var a = v[0] * v[1] / 100, b = v[0] - v[1], c = v[0] * (100 + v[1]) / 100, d = v[0] * (100 - v[1]) / 100; return [a, b, c, d].every(function (x, i, arr) { return arr.indexOf(x) === i; }) && b > 0; }, [55, 30]);
        var price = v[0], p = v[1], right = r2(price * (100 - p) / 100);
        return P.mc(r, 'A ' + M(price) + ' item is on sale for ' + p + '% off. The sale price is', [
          { html: t(Mt(price * p / 100)), why: 'That’s the discount (the amount saved). The sale price is what you pay.' },
          { html: t(Mt(right)), right: true },
          { html: t(Mt(price - p)), why: p + '% off is not $' + p + ' off.' },
          { html: t(Mt(price * (100 + p) / 100)), why: 'That adds ' + p + '%. A sale takes it off.' }],
          t(c2(price) + '\\times ' + pay(p) + '=' + Mt(right)) + '. (The others are the discount, ' + p + ' dollars off, and ' + p + '% added on.)', ['Pay ' + (100 - p) + '%: multiply by ' + t(pay(p)) + '.'], 'MC sale', true);
      } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '15', level: 'EMG', make: function (r) {
        var p = r.pick([20, 10, 30, 25, 15]), payd = (100 - p) * (100 - p) / 100, off = 100 - payd;
        var opts = [{ html: t(pc(2 * p) + '\\%'), why: 'That adds the two percents. The second ' + p + '% comes off a smaller price.' }, { html: t(pc(off) + '\\%'), right: true }, { html: t(pc(payd) + '\\%'), why: 'That’s the percent you <b>pay</b>. The discount is 100% minus that.' }, { html: t(pc(p) + '\\%'), why: 'That counts only one of the discounts.' }];
        opts.sort(function (a, b) { return parseFloat(a.html.replace(/[^\d.]/g, '')) - parseFloat(b.html.replace(/[^\d.]/g, '')); });
        return P.mc(r, 'A store takes ' + p + '% off, then an extra ' + p + '% off the sale price. This is the same as a single discount of', opts,
          t(pay(p) + '\\times ' + pay(p) + '=' + N(payd / 100)) + ', so you pay ' + pc(payd) + '% and save ' + t(pc(off) + '\\%') + '.', ['Multiply the two “percent you pay” decimals.'], 'MC stacked', true);
      } }] },
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { var o = r.int(30, 95) * 10, n = r.int(Math.round(o * 0.6), Math.round(o * 0.9)); return [o, n]; }, function (v) { var x = (v[0] - v[1]) / v[0] * 100, f = x - Math.floor(x); return f > 0.1 && f < 0.9; }, [650, 494]);
        var it = r.pick(['bike', 'e-scooter', 'set of golf clubs', 'kayak', 'guitar']);
        var p = pdPart('A ' + it + ' is regularly ' + M(v[0]) + ' and is on sale for ' + M(v[1]) + '. The percent decrease, to the nearest whole percent, is ________%.', v[0], v[1], 0, 'NR pd', { nr: true });
        return p;
      } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [{ id: '17', level: 'PRG', make: function (r) {
        var c = r.pick([[25, 10], [15, 10], [35, 10], [25, 30], [15, 30], [45, 10], [5, 10], [15, 50], [35, 30]]), payd = (100 - c[0]) * (100 - c[1]) / 100, off = 100 - payd;
        return pctPart('A store takes ' + c[0] + '% off, then an extra ' + c[1] + '% off the sale price. The total percent off, to the nearest tenth, is ________%.', off, { dp: 1, nr: true, diag: [{ v: c[0] + c[1], code: 'u1l9-added-discounts', hint: 'Stacked discounts don’t add. Multiply the two “percent you pay” decimals: ' + t(pay(c[0]) + '\\times ' + pay(c[1])) + '.' }, { v: payd, code: 'u1l9-pct-pay', hint: 'That’s the percent you <b>pay</b>. The total percent off is 100% minus that.' }] },
          t(pay(c[0]) + '\\times ' + pay(c[1]) + '=' + N(payd / 100)) + ': you pay ' + pc(payd) + '%, so the total is ' + t('100-' + pc(payd) + '=' + pc(off) + '\\%') + ' off.', ['Multiply the two “percent you pay” decimals.', 'Subtract the percent you pay from 100%.'], 'NR stacked');
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the discount and the sale price.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { return dsPart(r.int(8, 24) * 4, r.pick([25, 20, 75])); } },
        { id: 'e1b', level: 'BEG', make: function (r) { return dsPart(r.int(60, 190) + 0.5, 10); } },
        { id: 'e1c', level: 'BEG', make: function (r) { return dsPart(r.int(3, 19) + r.pick([0.48, 0.24, 0.86, 0.62, 0.98, 0.5]), 50); } }] },
      { num: '2', stem: 'What decimal do you multiply by to find the sale price?', parts: [
        { id: 'e2a', level: 'LIM', make: function (r) { return multPart(r.pick([45, 55, 65, 35, 85, 95])); } },
        { id: 'e2b', level: 'BEG', make: function (r) { return multPart(r.pick([8, 6, 4, 3, 7, 2, 9])); } },
        { id: 'e2c', level: 'LIM', make: function (r) { return multPart(r.pick([70, 80, 90, 30, 20])); } },
        { id: 'e2d', level: 'BEG', make: function (r) { return multPart(r.pick([33, 27, 42, 18, 13, 22, 38, 12])); } }] },
      { num: '3', stem: 'Find the percent decrease.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var v = niceDecrease(r, [20, 30, 40, 50], [20, 10, 30, 40], 1) || [20, 16]; return pdPart('$' + v[0].toFixed(2) + ' to $' + v[1].toFixed(2), v[0], v[1], null, 'pd ' + v[0]); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var v = niceDecrease(r, [32, 48, 64, 72, 88, 96, 56], [12.5, 37.5, 62.5], 1) || [64, 56]; return pdPart('$' + v[0].toFixed(2) + ' to $' + v[1].toFixed(2), v[0], v[1], null, 'pd ' + v[0]); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var v = niceDecrease(r, [3.6, 2.4, 4.8, 1.6, 5.2, 6.4, 2.8], [25, 50, 75, 12.5], 0.05) || [3.6, 2.7]; return pdPart('$' + v[0].toFixed(2) + ' to $' + v[1].toFixed(2), v[0], v[1], null, 'pd ' + v[0]); } }] },
      { num: '4', stem: '', parts: [{ id: 'e4', level: 'EMG', make: function (r) {
        var it = r.pick(['lamp', 'rug', 'pair of curtains', 'bookshelf', 'mirror']), price = r.int(5, 15) * 6, p = r.pick([20, 25, 30, 40]);
        return gstFields(r, 'In ' + r.pick(AB_CITIES) + ', a ' + it + ' is regularly ' + M(price) + ' and is ' + p + '% off. Find the total cost with 5% GST.', price, p, { only: 'total', text: 'lamp gst' });
      } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
        var c = r.pick([['A mobile mechanic', 'job'], ['An electrician', 'job'], ['A plumber', 'repair'], ['A furnace technician', 'service call']]), rate = r.pick([85, 90, 95, 105, 110, 120]), h = r.pick([2, 3, 4, 2.5]), p = r.pick([10, 15]);
        var reg = rate * h, sx = reg * (100 - p) / 100, sale = r2(sx), x = sale * 1.05, ans = r2(x);
        return moneyPart(c[0] + ' charges ' + M(rate) + ' per hour and gives seniors ' + p + '% off. What does a senior in ' + r.pick(AB_CITIES) + ' pay for a ' + N(h) + '-hour ' + c[1] + ', including 5% GST?', ans,
          { alts: [r2(reg * (100 - p) / 100 * 1.05)], exact: x, diag: [{ v: rate * (100 - p) / 100 * 1.05, code: 'u1l9-wrong-hours', hint: 'That’s for one hour. Multiply by the ' + N(h) + ' hours first.' }, { v: reg * 1.05, code: 'u1l9-no-discount', hint: 'Take the seniors’ ' + p + '% off before adding the GST.' }, { v: sale, code: 'u1l9-no-tax', hint: 'Add the 5% GST: multiply by 1.05.' }, { v: reg * (100 - p + 5) / 100, code: 'u1l9-pct-combined', hint: 'Don’t combine the percents. Take ' + p + '% off, then multiply by 1.05.' }] },
          'Regular: ' + t(N(h) + '\\times ' + c2(rate) + '=' + Mt(reg)) + '<br>Seniors pay ' + (100 - p) + '%: ' + t(c2(reg) + '\\times ' + pay(p) + to(sx)) + '<br>Total: ' + t(c2(sale) + '\\times 1.05' + to(x)), ['Find the regular cost for all the hours.', 'Take the discount off, then add the GST.'], 'mechanic');
      } }] },
      { num: '6', stem: function (s) { return 'A ' + s.item + ' costs ' + M(s.a) + ' at Store A with ' + s.p + '% off, and ' + M(s.b) + ' at Store B with $' + s.d + ' off.'; },
        shared: function (r) {
          return find(function () { var a = r.int(20, 49) + 0.99, p = r.pick([40, 30, 50, 25]), b = r.int(16, Math.round(a)) + 0.99, d = r.pick([5, 4, 6, 8]); var A = r2(a * (100 - p) / 100), B = r2(b - d); return { item: r.pick(['phone charger', 'pair of earbuds', 'water bottle', 'video game', 'phone case']), a: a, p: p, b: b, d: d, A: A, B: B, Ax: a * (100 - p) / 100 }; }, function (s) { return Math.abs(s.A - s.B) >= 0.3 && Math.abs(s.A - s.B) <= 6; }, { item: 'phone charger', a: 32.99, p: 40, b: 25.99, d: 5, A: 19.79, B: 20.99, Ax: 19.794 });
        }, parts: [
          { id: 'e6i', sub: 'i', level: 'EMG', make: function (r, s) {
            var aw = s.A < s.B, why = 'Work out both prices: Store A is ' + t(c2(s.a) + '\\times ' + pay(s.p)) + ' and Store B is ' + t(c2(s.b) + '-' + s.d) + '.';
            var p = P.mc(r, 'Which store is cheaper?', [{ html: '<b>Store A</b>', right: aw, why: aw ? null : why }, { html: '<b>Store B</b>', right: !aw, why: aw ? why : null }], 'A: ' + t(c2(s.a) + '\\times ' + pay(s.p) + to(s.Ax)) + '; B: ' + t(c2(s.b) + '-' + s.d + '.00=' + Mt(s.B)) + '. Store ' + (aw ? 'A' : 'B') + ' is cheaper.', ['Find both sale prices.'], 'which cheaper', true);
            p.tries = 1; p.input.columns = 2; return p;
          } },
          { id: 'e6ii', sub: 'ii', level: 'EMG', make: function (r, s) {
            var df = r2(Math.abs(s.A - s.B));
            return moneyPart('By how much?', df, { alts: [r2(Math.abs(s.Ax - s.B))], diag: [{ v: Math.abs(s.a - s.b), code: 'u1l9-no-discount', hint: 'Compare the <b>sale</b> prices, not the regular prices.' }] },
              'A: ' + t(c2(s.a) + '\\times ' + pay(s.p) + to(s.Ax)) + '; B: ' + t(c2(s.b) + '-' + s.d + '.00=' + Mt(s.B)) + '<br>' + t(c2(Math.max(s.A, s.B)) + '-' + c2(Math.min(s.A, s.B)) + '=' + Mt(df)), ['Find both sale prices, then subtract.'], 'cheaper by');
          } }] },
      { num: '7', stem: function (s) { return 'A box of cereal is ' + M(s.c) + '. One store has ' + BOX(s.x === 50 ? 'Buy one, get one 50% off' : 'Buy one, get one ' + s.x + '% off') + '. Another has ' + BOX(s.n + ' for the price of ' + (s.n - 1)) + '.'; },
        shared: function (r) { var c = r.pick([[50, 3], [40, 3], [30, 3], [30, 4], [40, 4]]); return { x: c[0], n: c[1], c: r.int(4, 8) + r.pick([0.79, 0.49, 0.99, 0.29]) }; }, parts: [
          { id: 'e7a', level: 'PRG', make: function (r, s) {
            var a = s.x / 2, b = 100 / s.n;
            var p = fieldsPart('Find the percent saved with each deal (to the nearest tenth of a percent).', [
              { label: 'Buy one, get one ' + s.x + '% off', after: '%', chk: pctChk(a, { dp: 1, tol: 0.06, diag: [{ v: s.x, code: 'u1l9-half-whole', hint: 'Only the second box is ' + s.x + '% off. You save that on one box out of the two you take home.' }] }), key: pc(a), show: t(pc(a) + '\\%') },
              { label: s.n + ' for the price of ' + (s.n - 1), after: '%', chk: pctChk(b, { dp: 1, tol: 0.06, diag: [{ v: 100 / (s.n - 1), code: 'u1l9-out-of-paid', hint: 'Divide by the regular price of <b>all ' + s.n + '</b> boxes you take home, not the ' + (s.n - 1) + ' you pay for.' }] }), key: pct1(b), show: t(pct1(b) + '\\%') }],
              'Buy one, get one ' + s.x + '% off: you save ' + s.x + '% of one box out of 2 boxes: ' + t('\\dfrac{' + dec(s.x) + '}{2}\\times 100=' + pc(a) + '\\%') + '<br>' + s.n + ' for ' + (s.n - 1) + ': you save one box out of ' + s.n + ': ' + t('\\dfrac{1}{' + s.n + '}\\times 100' + (s.n === 3 ? '\\approx 33.3' : '=' + pc(b)) + '\\%') + '<br>(The price of a box doesn’t matter — you can check with ' + M(s.c) + '.)',
              ['How much of one box do you save, and how many boxes do you take home?', 'Percent saved = amount saved ÷ regular price of everything you take home × 100.'], 'cereal deals');
            p.bad = [[pc(s.x), pc(100 / (s.n - 1))]];
            return p;
          } },
          { id: 'e7b', level: 'BEG', make: function (r, s) {
            return reasonMC(r, 'The “buy one, get one ' + s.x + '% off” deal saves the smaller percent. Which is a good reason it could still be the better choice?', 'You only need 2 boxes, or a third box would go stale or has no room in the cupboard.',
              [['It costs less per box.', 'It doesn’t: it saves a smaller percent, so each box costs more. Think about how many boxes you need.'], ['Saving a smaller percent is always better.', 'Not true. Think about how many boxes you will really use.'], ['Cereal never goes stale, so buy as many as you can.', 'Cereal does go stale, and you might not have room. Think about what you need.']],
              'Possible reasons: you only need 2 boxes; a third box would go stale; you have no room to store it.', 'reason cereal');
          } }] },
      { num: '8', stem: '', shared: function (r) { return provShared(r); }, parts: [
        { id: 'e8', level: 'PRG', make: function (r, s) {
          var t1 = provTotal(s), t2 = provSave(s), sv = r2(s.regT - s.tot);
          var p = P.fields('On a trip to ' + s.pl.city + ', ' + s.pl.prov + ' (' + s.pl.what + '), ' + s.who + ' buys ' + s.item + ' regularly ' + M(s.price) + ' at ' + s.p + '% off. What is the total cost, and how much is saved compared with the regular price plus tax?',
            [fld('Total cost', '$'), fld('Saved', '$')], [t1.check, t2.check], [t1.key, t2.key], 'Total ' + t(Mt(s.tot)) + '; saved ' + t(Mt(sv)), t1.solution + '<br>' + t2.solution, ['Sale price first, then multiply by 1 + the tax rate.', 'Saved = regular price with tax − what was paid.'], 'trip total + savings');
          p.bad = [[s.sale.toFixed(2), r2(s.price * s.p / 100).toFixed(2)]];
          return p;
        } }] },
      { num: '9', stem: '', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
        var c = r.pick([[15, 10], [20, 10], [25, 10], [15, 5], [20, 15], [10, 10]]), price = r.int(5, 14) * 100, it = r.pick(['laptop', 'tablet', 'e-bike', 'drum kit', 'telescope']), grp2 = r.pick(['students', 'seniors', 'members']);
        if (c[0] === 15 && c[1] === 10 && price === 900) price = 800;
        var s1 = price * (100 - c[0]) / 100, f = s1 * (100 - c[1]) / 100, off = 100 - (100 - c[0]) * (100 - c[1]) / 100;
        var p = fieldsPart('A ' + it + ' is regularly ' + M(price) + '. It is ' + c[0] + '% off, and ' + grp2 + ' get an extra ' + c[1] + '% off the sale price. Find the final price and the total percent off.', [
          { label: 'Final price', before: '$', chk: moneyChk(f, { diag: [{ v: price * (100 - c[0] - c[1]) / 100, code: 'u1l9-added-discounts', hint: 'The extra ' + c[1] + '% comes off the sale price, so don’t add the percents. Multiply by ' + t(pay(c[0])) + ', then by ' + t(pay(c[1])) + '.' }, { v: s1, code: 'u1l9-one-discount', hint: 'Now take the extra ' + c[1] + '% off.' }] }), key: r2(f).toFixed(2), show: t(Mt(f)) },
          { label: 'Total percent off', after: '%', chk: pctChk(off, { dp: 1, diag: [{ v: c[0] + c[1], code: 'u1l9-added-discounts', hint: 'Stacked discounts don’t add. Find the dollars saved and divide by the regular price.' }, { v: 100 - off, code: 'u1l9-pct-pay', hint: 'That’s the percent you pay. Subtract it from 100%.' }] }), key: pct1(off), show: t(pct1(off) + '\\%') }],
          t(c2(price) + '\\times ' + pay(c[0]) + '=' + Mt(s1)) + '; ' + t(c2(s1) + '\\times ' + pay(c[1]) + to(f)) + '<br>Saved ' + t(c2(price) + '-' + c2(f) + '=' + Mt(price - f)) + '; ' + t('\\dfrac{' + c2(price - f) + '}{' + c2(price) + '}\\times 100=' + pct1(off) + '\\%') + ' off (not ' + (c[0] + c[1]) + '%).',
          ['Take the second discount off the sale price.', 'Total percent off = dollars saved ÷ regular price × 100.'], 'student stacked');
        p.bad = [[r2(price * (100 - c[0] - c[1]) / 100).toFixed(2), pc(c[0] + c[1])]];
        return p;
      } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var c = r.pick([[60, 75, 20], [40, 50, 20], [80, 100, 20], [60, 80, 25], [90, 120, 25], [45, 60, 25], [48, 60, 20], [50, 70, 25], [70, 90, 25], [60, 70, 10]]), it = r.pick(['hoodie', 'pair of jeans', 'jacket', 'video game', 'pair of runners']);
        var old = c[0], up = c[1], d = c[2], sale = up * (100 - d) / 100, same = near(sale, old), more = sale > old + 1e-9;
        var opts = [
          { html: 'No: the sale price is exactly the old price, so you save nothing.', right: same, why: same ? null : 'Work out ' + t(N(up) + '\\times ' + pay(d)) + ' and compare it with the old price, ' + M(old) + '.' },
          { html: 'No: the sale price is <b>more</b> than the old price.', right: more, why: more ? null : 'Work out ' + t(N(up) + '\\times ' + pay(d)) + ' and compare it with the old price, ' + M(old) + '.' },
          { html: 'Yes: it is a little less than the old price, but not ' + d + '% less.', right: !same && !more, why: !same && !more ? null : 'Work out ' + t(N(up) + '\\times ' + pay(d)) + ' and compare it with the old price, ' + M(old) + '.' },
          { html: 'Yes: you save ' + d + '% off the price.', why: 'The ' + d + '% comes off the <b>raised</b> price. Compare the sale price with the old price, ' + M(old) + '.' }];
        return P.mc(r, 'A ' + it + ' was ' + M(old) + '. A store raised the price to ' + M(up) + ' and then put up a “' + d + '% off” sign. Is the sale a real deal?', opts,
          t(c2(up) + '\\times ' + pay(d) + '=' + Mt(sale)) + '. ' + (same ? 'The sale price is exactly the old price, so you save nothing: not a real deal.' : more ? 'That is more than the old price of ' + M(old) + ': not a real deal at all.' : 'That is only ' + M(old - sale) + ' less than the old price — a real deal, but a small one.'), ['Find the sale price, then compare it with the price before the store raised it.'], 'fake deal MC', true);
      } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [{ id: 'e11', level: 'BEG', make: function (r) {
        var v = r.pick([[250, 200], [200, 150], [400, 300], [150, 120], [300, 240], [500, 400], [120, 90]]), o = v[0], n = v[1], d = o - n, x = d / o * 100;
        var cand = [{ v: x, right: true }, { v: d / n * 100, why: 'That divides by the sale price. A percent decrease is out of the original price.' }, { v: d, why: 'That’s the dollars saved, not a percent.' }, { v: n / o * 100, why: 'That’s the percent you pay.' }];
        var opts = cand.map(function (c) { return { html: t(pct1(c.v) + '\\%'), right: !!c.right, why: c.why }; }).sort(function (a, b) { return parseFloat(a.html.replace(/[^\d.]/g, '')) - parseFloat(b.html.replace(/[^\d.]/g, '')); });
        return P.mc(r, 'A ' + M(o) + ' bike is on sale for ' + M(n) + '. The percent decrease is', opts, t('\\dfrac{' + d + '}{' + o + '}\\times 100=' + pct1(x) + '\\%') + '.', [RULE_DEC], 'MC pd', true);
      } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [{ id: 'e12', level: 'PRG', make: function (r) {
        var v = find(function () { return [r.int(4, 16) * 5, r.pick([60, 50, 40, 80]), r.pick([25, 20, 30, 40])]; }, function (v) { var s = v[0] * (100 + v[1]) / 100 * (100 - v[2]) / 100; return s < 1000 && Math.abs(s - Math.round(s) - 0.5) > 0.02; }, [40, 50, 25]);
        var ret = v[0] * (100 + v[1]) / 100, sale = ret * (100 - v[2]) / 100, ans = Math.round(sale);
        var it = r.pick(['jacket', 'pair of boots', 'backpack', 'hockey stick']);
        var p = { prompt: 'A store buys a ' + it + ' wholesale for ' + M(v[0]) + ', marks it up ' + v[1] + '%, then later sells it at ' + v[2] + '% off. The sale price, to the nearest dollar, is $________.', input: { type: 'number', nr: true },
          check: function (resp) { var a = readNum(resp); if (a.res) return a.res; if (near(a.v, ans)) return ok(); if (a.d > 0 && near(Math.round(a.v), ans)) return form('round', 'Right — now round it to the nearest dollar.');
            if (near(Math.round(a.v), Math.round(v[0] * (100 + v[1] - v[2]) / 100))) return wrong('u1l9-markup-added', 'You can’t just combine the percents. Find the retail price first, then take ' + v[2] + '% off it.');
            if (near(Math.round(a.v), Math.round(ret))) return wrong('u1l9-no-discount', 'That’s the retail price. Now take ' + v[2] + '% off.');
            if (near(Math.round(a.v), Math.round(v[0] * (100 - v[2]) / 100))) return wrong('u1l9-no-discount', 'Mark it up first: the ' + v[2] + '% comes off the retail price.');
            return wrong('value', null); },
          key: String(ans), answer: t(String(ans)), text: 'NR markup then sale',
          solution: 'Retail: ' + t(c2(v[0]) + '\\times ' + dec(100 + v[1]) + '=' + Mt(ret)) + '<br>Sale: ' + t(c2(ret) + '\\times ' + pay(v[2]) + '=' + N(sale)) + ', which rounds to ' + t('\\$' + ans) + '.', hints: ['Retail = wholesale × (1 + markup rate).', 'Then take the discount off the retail price.'] };
        p.bad = [String(Math.round(ret))];
        return p;
      } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
        var v = [r.int(6, 30) * 5, r.pick([30, 20, 25, 40, 15])];
        var reg = v[0], p = v[1], sale = reg * (100 - p) / 100, it = r.pick(['jacket', 'pair of skates', 'tent', 'guitar', 'coffee table']);
        return moneyPart('After ' + p + '% off, a ' + it + ' costs ' + M(sale) + '. What was the regular price? (Hint: the sale price is ' + (100 - p) + '% of the regular price.)', reg,
          { diag: [{ v: sale * (100 + p) / 100, code: 'u1l9-backwards-up', hint: 'Adding ' + p + '% back on doesn’t work: the ' + p + '% was taken from the <b>regular</b> price, which is bigger. Divide the sale price by ' + t(pay(p)) + '.' }, { v: sale * (100 - p) / 100, code: 'u1l9-backwards-mult', hint: 'The regular price must be <b>more</b> than the sale price. Regular × ' + t(pay(p)) + ' = sale price, so divide.' }, { v: sale / (p / 100), code: 'u1l9-backwards-off', hint: 'The sale price is the part you <b>pay</b> (' + (100 - p) + '%), so divide by ' + t(pay(p)) + ', not ' + t(dec(p)) + '.' }, { v: sale + p, code: 'u1l9-dollars-off', hint: p + '% is not $' + p + '. Divide the sale price by ' + t(pay(p)) + '.' }] },
          'regular ' + t('\\times ' + pay(p) + '=' + c2(sale)) + ', so regular ' + t('=' + c2(sale) + '\\div ' + pay(p) + '=' + Mt(reg)) + '.<br>Check: ' + t(c2(reg) + '\\times ' + pay(p) + '=' + c2(sale)) + '.', ['The sale price is ' + (100 - p) + '% of the regular price: regular × ' + pay(p) + ' = ' + M(sale) + '.', 'Undo the multiplication: divide.'], 'reverse sale');
      } }] },
      { num: '14', stem: function (s) { return 'Which is the bigger discount on a ' + M(s.price) + ' item: ' + s.a + '% off then an extra ' + s.b + '% off, or a single ' + s.c + '% off?'; },
        shared: function (r) { var c = r.pick([[25, 20, 40], [20, 25, 40], [20, 25, 45], [30, 20, 45], [50, 20, 55], [10, 10, 20], [50, 40, 70], [30, 30, 50], [40, 50, 70], [20, 20, 35]]); return { a: c[0], b: c[1], c: c[2], price: r.pick([80, 100, 120, 160, 200, 60, 140]) }; }, parts: [
          { id: 'e14i', sub: 'i', level: 'PRG', make: function (r, s) {
            var two = s.price * (100 - s.a) / 100 * (100 - s.b) / 100, one = s.price * (100 - s.c) / 100;
            var p = fieldsPart('Find the final price each way.', [
              { label: s.a + '% then ' + s.b + '%', before: '$', chk: moneyChk(two, { diag: [{ v: s.price * (100 - s.a - s.b) / 100, code: 'u1l9-added-discounts', hint: 'Take the ' + s.b + '% off the <b>sale</b> price, not the regular price.' }] }), key: r2(two).toFixed(2), show: t(Mt(two)) },
              { label: 'Single ' + s.c + '%', before: '$', chk: moneyChk(one, { diag: saleDiag(s.price, s.c) }), key: r2(one).toFixed(2), show: t(Mt(one)) }],
              t(c2(s.price) + '\\times ' + pay(s.a) + '\\times ' + pay(s.b) + '=' + Mt(two)) + '<br>' + t(c2(s.price) + '\\times ' + pay(s.c) + '=' + Mt(one)), ['Two discounts: multiply by each “percent you pay”.'], 'two ways');
            p.bad = [[r2(s.price * (100 - s.a - s.b) / 100).toFixed(2), r2(one).toFixed(2)]];
            return p;
          } },
          { id: 'e14ii', sub: 'ii', level: 'PRG', make: function (r, s) {
            var k = (100 - s.a) * (100 - s.b) / 100, kc = 100 - s.c, w = near(k, kc) ? 'same' : k < kc ? 'two' : 'one';
            var why = 'Compare the two final prices from part (i): the lower price is the bigger discount.';
            return P.mc(r, 'Which is the bigger discount?', [
              { html: s.a + '% then an extra ' + s.b + '%', right: w === 'two', why: w === 'two' ? null : why },
              { html: 'A single ' + s.c + '%', right: w === 'one', why: w === 'one' ? null : why },
              { html: 'They are the same.', right: w === 'same', why: w === 'same' ? null : why }],
              t(pay(s.a) + '\\times ' + pay(s.b) + '=' + N(k / 100)) + ': you pay ' + pc(k) + '% (save ' + pc(100 - k) + '%) with the two discounts, and ' + kc + '% (save ' + s.c + '%) with the single one. ' + (w === 'same' ? 'They are the same.' : w === 'two' ? 'The two discounts save more.' : 'The single ' + s.c + '% saves more.'), ['Multiply the two “percent you pay” decimals and compare with ' + pay(s.c) + '.'], 'bigger discount', true);
          } }] },
      { num: '15', stem: function (s) { return s.k + ' says, “It’s cheaper if the store takes ' + s.p + '% off first and then adds GST.” ' + s.l + ' says, “It’s cheaper if the store adds GST first and then takes ' + s.p + '% off.” Test both on a ' + M(s.price) + ' item.'; },
        shared: function (r) { var nm = r.sample(['Kai', 'Lena', 'Jordan', 'Amira', 'Ben', 'Rosa', 'Theo', 'Isla'], 2); return { k: nm[0], l: nm[1], p: r.pick([30, 20, 25, 40]), price: r.pick([60, 80, 120, 140, 50, 90]) }; }, parts: [
          { id: 'e15i', sub: 'i', level: 'EMG', make: function (r, s) {
            var a = r2(s.price * (100 - s.p) / 100 * 1.05), b = r2(s.price * 1.05 * (100 - s.p) / 100);
            var p = fieldsPart('Find the total both ways.', [
              { label: 'Discount first, then GST', before: '$', chk: moneyChk(a, { diag: [{ v: s.price * (100 - s.p) / 100, code: 'u1l9-no-tax', hint: 'Now add the GST: multiply by 1.05.' }] }), key: a.toFixed(2), show: t(Mt(a)) },
              { label: 'GST first, then discount', before: '$', chk: moneyChk(b, { diag: [{ v: s.price * 1.05, code: 'u1l9-no-discount', hint: 'Now take the ' + s.p + '% off: multiply by ' + t(pay(s.p)) + '.' }] }), key: b.toFixed(2), show: t(Mt(b)) }],
              'Discount first: ' + t(c2(s.price) + '\\times ' + pay(s.p) + '\\times 1.05=' + Mt(a)) + '<br>GST first: ' + t(c2(s.price) + '\\times 1.05\\times ' + pay(s.p) + '=' + Mt(b)), ['Discount first: × ' + pay(s.p) + ', then × 1.05.', 'GST first: × 1.05, then × ' + pay(s.p) + '.'], 'order test');
            p.bad = [[r2(s.price * (100 - s.p) / 100).toFixed(2), r2(s.price * 1.05).toFixed(2)]];
            return p;
          } },
          { id: 'e15ii', sub: 'ii', level: 'PRG', make: function (r, s) {
            return P.mc(r, 'Who is right?', [
              { html: s.k + ' is right: take the discount off first.', why: 'Look at your two totals from part (i).' },
              { html: s.l + ' is right: add the GST first.', why: 'Look at your two totals from part (i).' },
              { html: 'Neither: the total is the same, because you can multiply in any order.', right: true }],
              'Both ways give ' + t(Mt(s.price * (100 - s.p) / 100 * 1.05)) + ': ' + t(N(s.price) + '\\times ' + pay(s.p) + '\\times 1.05=' + N(s.price) + '\\times 1.05\\times ' + pay(s.p)) + '. Neither is right — you can multiply in any order.', ['Compare the two totals.'], 'who is right', true);
          } }] }
    ]
  });

  /* extra practice 1: discount and sale price */
  function dsPart(price, p) {
    var dx = price * p / 100, disc = r2(dx), sale = r2(price - disc), sale2 = r2(price * (100 - p) / 100);
    var pp = fieldsPart(M(price) + ', ' + p + '% off', [
      { label: 'Discount', before: '$', chk: moneyChk(disc, { exact: dx, diag: discDiag(price, p) }), key: disc.toFixed(2), show: t(Mt(disc)) },
      { label: 'Sale price', before: '$', chk: moneyChk(sale, { alts: [sale2], diag: saleDiag(price, p) }), key: sale.toFixed(2), show: t(Mt(sale)) }],
      'Discount: ' + t(dec(p) + '\\times ' + c2(price) + to(dx)) + '<br>Sale: ' + t(c2(price) + '-' + c2(disc) + '=' + Mt(sale)), ['Discount = rate (as a decimal) × price.', 'Sale price = price − discount.'], 'discount+sale ' + price + ' ' + p);
    pp.answer = 'Discount ' + t(Mt(disc)) + '; sale price ' + t(Mt(sale));
    pp.bad = p === 50 ? [[disc.toFixed(2), (price - p).toFixed(2)]] : [[sale.toFixed(2), disc.toFixed(2)]];
    return pp;
  }
  function multPart(p) {
    var want = pay(p);
    var pp = { prompt: pc(p) + '% off', input: { type: 'number', before: '× ' }, check: multChk(p), key: want, answer: t(want), text: 'multiplier ' + p,
      solution: 'You pay ' + t('100\\%-' + pc(p) + '\\%=' + pc(100 - p) + '\\%=' + want) + '.', hints: ['You pay 100% minus the percent off.', 'Change that percent to a decimal: divide by 100.'] };
    pp.bad = [dec(p), String(100 - p), dec(100 + p)];
    return pp;
  }
})(window);
