/* Math 10-3 · Unit 1 · Lesson 6 — Unit Price: Finding the Best Buy (N1)
 * Assignment 6 (u1_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u1_ep06.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the same situation and difficulty as the booklet item with new numbers around the booklet's
 * (the lesson's worked-example numbers are left out). Calculator allowed.
 * Answers: money to the cent ("$12.49", "12.49", "12.490" accepted; too many or too few decimals gets a nudge, rounding
 * the wrong way is wrong with a hint). Unit prices that are compared (per 100 g, per box…) may be given to the cent or to
 * a tenth of a cent ($1.415): any correctly rounded value with 2–4 decimals is accepted. Recognised wrong values each get
 * their own hint: dividing the wrong way (quantity ÷ price), multiplying, not changing L to mL or g to kg, per gram
 * instead of per 100 g, leaving out the delivery, adding the delivery to each item, rounding too early, the regular
 * total instead of the savings, revenue instead of profit.
 * Conversions: "which is the better buy?" → multiple choice whose options pair a choice with a reason (lower unit
 * price / lower total price / bigger is always cheaper…); the unit prices themselves → labelled boxes (one per size);
 * price charts and unit-price tables → labelled boxes, one per blank cell; "estimate" → multiple choice of estimates;
 * sentence frames and "give a reason (not price)" → multiple choice of reasons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= numbers and money (same helpers as u1l5) ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, dp) { var f = Math.pow(10, dp); return Math.floor(x * f + 1e-9) / f; }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }
  function D(x, dp) { return '\\$' + rd(x, dp || 2).toFixed(dp || 2); }
  function Dp(x, dp) { return '$' + rd(x, dp || 2).toFixed(dp || 2); }
  function Dg(x) { return Number.isInteger(q(x)) ? '$' + q(x) : Dp(x); }
  function u(s) { s = s.replace(/^ +/, ''); return ('\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}').replace(/²/g, '}^2\\text{'); }
  function an(n) { var s = String(n); return /^8/.test(s) || /^1[18]$/.test(s) || /^1[18]\d\d$/.test(s) ? 'an' : 'a'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function decs(x) { var s = nS(x); return (s.split('.')[1] || '').length; }
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function p9(x) { return q(Math.max(0.09, Math.round(x * 10) / 10 - 0.01)); }            // a shelf price: 8.47 → 8.49
  function vol(mL) { return mL < 1000 ? mL + ' mL' : N(mL / 1000) + ' L'; }
  function mass(g) { return g < 1000 ? g + ' g' : N(g / 1000) + ' kg'; }
  function up3(x) { return rd(x, 3).toFixed(3); }                                     // a unit price to a tenth of a cent
  var TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  function argmin(a) { var b = 0; for (var i = 1; i < a.length; i++) if (a[i] < a[b]) b = i; return b; }
  function argmax(a) { var b = 0; for (var i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; }
  function apart(a, gap) { for (var i = 0; i < a.length; i++) for (var j = i + 1; j < a.length; j++) if (Math.abs(a[i] - a[j]) < gap) return false; return true; }

  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\\$/g, '$').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\s+/g, ' ').trim();
    s = s.replace(/^\$\s*/, '').replace(/\s*\$$/, '').trim();
    if (!s) return { code: 'empty' };
    var unit = null, m = /^(-?[\d.,]*\d\.?)\s*([a-zA-Z%°²³\/¢][\s\S]*)$/.exec(s);
    if (m) { unit = m[2]; s = m[1]; }
    if (/^-?\d+,\d{1,2}$/.test(s)) return { code: 'comma' };
    var p = HW.parse.number(s); if (!p.ok) return { code: 'notnumber' };
    return { v: p.value, dec: (s.replace(/,/g, '').split('.')[1] || '').length, unit: unit };
  }
  function near(v, w, dec) {
    if (!isFinite(w)) return false;
    if (same(v, w)) return true;
    if (dec > 4 || (dec === 0 && Math.abs(w) < 20)) return false;
    var r1 = rd(w, dec), r2 = trunc(w, dec);
    return (r1 !== 0 && same(v, r1)) || (dec > 0 && r2 !== 0 && same(v, r2));
  }
  function slip(a) {
    if (a.code === 'empty') return form('empty', 'Type your answer first.');
    if (a.code === 'comma') return form('u1l6-comma', 'Use a decimal <b>point</b>, not a comma (for example 12.49).');
    return form('notnumber', 'Type a single number (the unit is already written beside the box).');
  }
  function badHit(o, v, dec) {
    for (var i = 0; o.bad && i < o.bad.length; i++) { var b = o.bad[i]; if (near(v, b[0], dec)) return b[3] === 'form' ? form(b[1], b[2]) : wrong(b[1], b[2]); }
    return null;
  }
  /* an amount: o.money / o.dp (rounded answer), o.exact, o.bad [[value, code, hint, 'form'?]], o.alt (other right values) */
  function numChk(ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans;
    var place = o.money ? 'cent' : dp === 1 ? 'tenth' : dp === 0 ? 'whole number' : 'hundredth';
    return function (resp) {
      var a = readNum(resp); if (a.code) return slip(a);
      var v = a.v, h;
      if (same(v, ans)) return ok();
      for (var i = 0; o.alt && i < o.alt.length; i++) if (same(v, o.alt[i])) return ok();
      if (dp != null && a.dec > dp && same(rd(v, dp), ans)) return form('round', 'Right — now round to the nearest ' + place + '.');
      if ((h = badHit(o, v, a.dec))) return h;
      if (dp != null && a.dec < dp && Math.abs(v - ans) < Math.pow(10, -a.dec) - 1e-9) return form('places', o.money ? 'Give the amount to the cent (two decimal places), like ' + Dp(ans >= 1 ? 12.5 : 0.5) + '.' : 'Round to the nearest ' + place + '.');
      if (dp != null && !same(exact, ans) && a.dec <= dp && Math.abs(Math.abs(v - ans) - Math.pow(10, -dp)) < 1e-9 && (same(v, trunc(exact, dp)) || same(v, trunc(exact, dp) + Math.pow(10, -dp))))
        return wrong('u1l6-round-dir', 'Check your rounding: look at the digit after the ' + place + (o.money ? 's (the third decimal place)' : 's') + '. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  /* a unit price used for comparing: right when it is the exact value rounded correctly to 2, 3 or 4 decimals */
  function upChk(exact, o) {
    o = o || {};
    return function (resp) {
      var a = readNum(resp); if (a.code) return slip(a);
      var v = a.v, h;
      if (same(v, exact) || (a.dec >= 2 && a.dec <= 4 && same(v, rd(exact, a.dec))) || (a.dec > 4 && Math.abs(v - exact) < 6e-5)) return ok();
      if ((h = badHit(o, v, a.dec))) return h;
      if (a.dec < 2 && Math.abs(v - exact) < Math.pow(10, -a.dec)) return form('u1l6-keep-dec', 'Keep more decimals: give the unit price to the cent or, better for comparing, to a tenth of a cent (3 decimal places).');
      if (a.dec >= 2 && a.dec <= 4 && same(v, trunc(exact, a.dec)) && !same(rd(exact, a.dec), trunc(exact, a.dec))) return wrong('u1l6-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  function cleanBad(bad, ans, dp, alt) {
    var seen = [];
    return (bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || same(b[0], ans) || (dp != null && same(rd(b[0], dp), ans)) || (alt || []).some(function (x) { return same(x, b[0]); })) return false;
      if (seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true;
    });
  }
  /* a number part. o: money, dp, exact, bad, alt, before, after, ans (TeX), sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {}; ans = q(ans);
    var dp = o.money ? 2 : o.dp, key = dp != null ? ans.toFixed(dp) : nS(ans), bad = cleanBad(o.bad, ans, dp, o.alt);
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after },
      check: numChk(ans, { money: o.money, dp: o.dp, exact: o.exact, bad: bad, alt: o.alt }),
      key: key, answer: t(o.ans || ((o.money ? '\\$' + key : N(ans, dp)) + (o.after ? u(o.after) : ''))), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    p.good = o.money ? ['$' + key, key + '0'] : [];
    return p;
  }
  /* a unit price to compare (to the cent or a tenth of a cent) */
  function upPart(prompt, exact, o) {
    o = o || {};
    var bad = cleanBad(o.bad, exact, 3).filter(function (b) { return ![2, 3, 4].some(function (d) { return same(rd(b[0], d), rd(exact, d)); }); });
    var p = { prompt: prompt, input: { type: 'number', before: '$', after: o.after }, check: upChk(exact, { bad: bad }), key: up3(exact),
      answer: t(D(exact, 3) + (o.after ? u(o.after) : '')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    p.good = [rd(exact, 2).toFixed(2), '$' + up3(exact)];
    return p;
  }
  /* several boxes. rows: [{label, exact, kind: 'up' | 'money', bad, after}] */
  function boxes(prompt, rows, sol, hints, text) {
    var ck = rows.map(function (rw, i) { var bad = cleanBad((rw.bad || []).concat(rows.length === 2 ? [[rows[1 - i].exact, 'u1l6-other-box', 'That’s the answer for the other box (' + (rows[1 - i].name || rows[1 - i].label) + '). Check which box is which.']] : []), rw.exact, rw.kind === 'up' ? 3 : 2); return rw.kind === 'up' ? upChk(rw.exact, { bad: bad }) : numChk(rd(rw.exact, 2), { money: true, exact: rw.exact, bad: bad }); });
    var keys = rows.map(function (rw) { return rw.kind === 'up' ? up3(rw.exact) : rd(rw.exact, 2).toFixed(2); });
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: '$', after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }), ck, keys,
      rows.map(function (rw, i) { return rw.label + ' ' + t(rw.kind === 'up' ? D(rw.exact, 3) : D(rd(rw.exact, 2))) + (rw.after ? (/^\//.test(rw.after) ? '' : ' ') + rw.after.trim() : ''); }).join(' &nbsp; '), sol, hints, text);
    if (rows.length === 2 && !same(rows[0].exact, rows[1].exact)) p.bad = [[keys[1], keys[0]]];
    return p;
  }
  /* which is the better buy? items: [{name, up (unit price), total, size}] */
  function betterMC(r, prompt, items, sol, hints, text, o) {
    o = o || {};
    var b = argmin(items.map(function (x) { return x.up; })), w = 1 - b, lt = argmin(items.map(function (x) { return x.total; })), big = argmax(items.map(function (x) { return x.size; }));
    var opts = [{ html: '<b>' + items[b].name + '</b>: the unit price is lower.', right: true },
      { html: '<b>' + items[w].name + '</b>: the unit price is lower.', why: 'Check the unit prices again: the lower one is the better buy.', code: 'u1l6-higher-up' }];
    var li = items.map(function (x) { return !!x.loose; }).indexOf(true);
    if (li >= 0) opts.push({ html: '<b>' + items[1 - li].name + '</b>: ' + (o.packWord || 'a bag') + ' is always cheaper than buying ' + (o.looseWord || 'loose') + '.', why: 'Not always! Compare the price per kg (or per 100 g) of each.', code: 'u1l6-bigger' });
    else if (items[lt].total !== items[1 - lt].total) opts.push({ html: '<b>' + items[lt].name + '</b>: the price on the shelf is lower.', why: 'The two sizes hold different amounts, so compare the price for the <b>same</b> amount (the unit price), not the shelf price.', code: 'u1l6-total' });
    if (li < 0 && items[0].size !== items[1].size) opts.push({ html: '<b>' + items[big].name + '</b>: the bigger size is always the better buy.', why: 'Bigger is <b>not always</b> cheaper per unit. Compare the unit prices.', code: 'u1l6-bigger' });
    if (o.extra) opts.push(o.extra);
    return P.mc(r, prompt, opts, sol, hints || ['Compare the unit prices. The lower unit price is the better buy.'], text);
  }

  HW.addCodes({
    'u1l6-wrong-way': 'Divided the wrong way (quantity ÷ price)', 'u1l6-multiplied': 'Multiplied instead of dividing', 'u1l6-divided': 'Divided instead of multiplying', 'u1l6-per-g': 'Price per gram/mL instead of per 100',
    'u1l6-no-convert': 'Didn’t change to the same unit (L↔mL, kg↔g)', 'u1l6-per-kg': 'Price per kg/L instead of per 100 g/mL', 'u1l6-no-delivery': 'Left out the delivery/shipping', 'u1l6-delivery-each': 'Added the delivery to each item',
    'u1l6-early-round': 'Rounded too early', 'u1l6-regular-total': 'Gave a total instead of the savings', 'u1l6-revenue': 'Revenue instead of profit (didn’t subtract the cost)', 'u1l6-one-item': 'Gave the amount for one item, not all',
    'u1l6-box-cost': 'Used the whole box price instead of the price of one', 'u1l6-added': 'Added instead of subtracting', 'u1l6-round-dir': 'Rounded the wrong way', 'u1l6-keep-dec': 'Unit price rounded too much',
    'u1l6-comma': 'Decimal comma', 'u1l6-other-box': 'Answers in each other’s boxes', 'u1l6-perimeter': 'Used the perimeter instead of the area', 'u1l6-per100': 'Forgot the price is per 100 g', 'u1l6-higher-up': 'Chose the higher unit price', 'u1l6-total': 'Compared shelf prices, not unit prices',
    'u1l6-bigger': 'Assumed bigger is always cheaper', 'u1l6-per-day': 'Used one day instead of the week', 'u1l6-per-week': 'Used one week instead of all the weeks', 'u1l6-jug-price': 'Used the jug price as the price per litre'
  });
  HW.addPartial({
    'u1l6-wrong-way': 'n', 'u1l6-multiplied': 'n', 'u1l6-divided': 'n', 'u1l6-per-g': 'b', 'u1l6-no-convert': 'b', 'u1l6-per-kg': 'b', 'u1l6-no-delivery': 'b', 'u1l6-delivery-each': 'b',
    'u1l6-early-round': 's', 'u1l6-regular-total': 'b', 'u1l6-revenue': 'b', 'u1l6-one-item': 'b', 'u1l6-box-cost': 'n', 'u1l6-added': 'n', 'u1l6-round-dir': 's', 'u1l6-perimeter': 'n',
    'u1l6-per100': 'b', 'u1l6-per-day': 'b', 'u1l6-per-week': 'b', 'u1l6-jug-price': 'b'
  });

  /* ================= part builders ================= */
  /* unit price of n items (or n kg / n L) to the cent */
  function unitPricePart(prompt, price, n, per, o) {
    o = o || {}; var ex = price / n, ans = rd(ex, 2), work = q(price).toFixed(2) + '\\div ' + N(n) + '=' + (same(ex, ans) ? ans.toFixed(2) : nS(rd(ex, 5)) + '\\ldots');
    return num(prompt, ans, { money: true, exact: ex, after: '/' + per, ans: D(ans) + '\\text{ per ' + per + '}',
      bad: [[n / price, 'u1l6-wrong-way', 'Divide the <b>price</b> by the quantity (money ÷ amount). Estimate: about ' + Dp(Math.round(price)) + ' for ' + N(n) + ' is about ' + Dp(Math.round(price) / n) + ' each.'], [price * n, 'u1l6-multiplied', 'To find the price of <b>one</b>, divide the price by ' + N(n) + '.'], [price / 10, 'u1l6-wrong-way', 'Divide by ' + N(n) + ' (the quantity), not by 10.']].concat(o.bad || []),
      sol: t(work) + (same(ex, ans) ? '' : '<br>Round to the nearest cent: ' + t(D(ans))) + '<br>The unit price is ' + t(D(ans)) + ' per ' + per + '.',
      hints: ['Unit price = price ÷ quantity.', 'Round to the nearest cent.'], text: o.text || 'unit price' });
  }
  /* price per 100 g / 100 mL */
  function per100Bad(price, amt, unit) {
    return [[price / amt, 'u1l6-per-g', 'That’s the price per <b>1 ' + unit + '</b>. Multiply by 100 to get the price per 100 ' + unit + '.'], [amt / price * 100, 'u1l6-wrong-way', 'Divide the <b>price</b> by the ' + (unit === 'g' ? 'grams' : 'millilitres') + ', then multiply by 100.'], [price / amt * 1000, 'u1l6-per-kg', 'Multiply by 100 (per 100 ' + unit + '), not 1000.'], [price * amt / 100, 'u1l6-multiplied', 'Divide the price by the ' + (unit === 'g' ? 'grams' : 'millilitres') + ', then multiply by 100.']];
  }
  function per100Sol(price, amt, unit) { return t(q(price).toFixed(2) + '\\div ' + N(amt) + '\\times 100\\approx ' + D(price / amt * 100, 3)) + ' per 100 ' + unit; }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u1l6', unit: 1, num: '6', title: 'Unit Price: Finding the Best Buy', outcome: 'N1',
    blurb: 'Unit prices, comparing sizes (per 100 g, per litre), multi-buy deals, delivery costs, and choosing the best buy.',
    questions: [
      { num: '1', stem: 'Find each unit price. Round to the nearest cent.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var n = r.int(2, 6), up = r.pick([1.49, 1.79, 1.99, 2.29, 2.49, 2.79, 2.99, 3.25]); return unitPricePart(n + ' toothbrushes for ' + Dp(n * up), q(n * up), n, 'toothbrush'); } },
        { id: '1b', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([2, 4, 5, 8, 10]), r.int(129, 299) / 100]; }, function (v) { return !(v[0] === 3 && v[1] === 1.99); }, [10, 2.19]); return unitPricePart(an(v[0]) + ' ' + v[0] + ' kg bag of rice for ' + Dp(v[0] * v[1]), q(v[0] * v[1]), v[0], 'kg'); } },
        { id: '1c', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([6, 8, 12, 15, 24]), p9(r.int(35, 120) / 10)]; }, function (v) { var c = v[1] / v[0] * 100; return Math.abs(c - Math.floor(c) - 0.5) > 0.02 && !same(rd(v[1] / v[0], 2), v[1] / v[0]) && v[1] / v[0] < 1.2 && v[1] / v[0] > 0.3; }, [8, 5.99]); return unitPricePart(v[0] + ' cans of pop for ' + Dp(v[1]), v[1], v[0], 'can'); } },
        { id: '1d', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([3, 4, 5, 6]), p9(r.int(30, 90) / 10)]; }, function (v) { var c = v[1] / v[0] * 100; return Math.abs(c - Math.floor(c) - 0.5) > 0.02 && !same(rd(v[1] / v[0], 2), v[1] / v[0]) && !(v[0] === 4 && v[1] === 6.29); }, [5, 4.49]); return unitPricePart(v[0] + ' L of windshield washer fluid for ' + Dp(v[1]), v[1], v[0], 'L'); } }] },
      { num: '2', stem: function (sh) { return 'A box of ' + sh.n + ' granola bars costs ' + Dp(sh.P) + '.'; },
        shared: function (r) { return find(function () { var n = r.pick([8, 10, 12, 15, 16, 20, 24]), uu = r.int(29, 99) / 100, P0 = q(n * uu), E = Math.round(P0); return { n: n, u: uu, P: P0, E: E, est: E / n }; }, function (s) { return s.E >= 3 && Math.round(s.E * 100) % s.n === 0 && Math.abs(s.est - s.u) <= 0.06 && !same(s.est, s.u) && rd(s.n / s.P, 2) > 1; }, { n: 12, u: 0.49, P: 5.88, E: 6, est: 0.5 }); },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'Estimate the price of one bar. Which is the best estimate?', [
              { html: 'About ' + t(D(sh.E) + '\\div ' + sh.n + '=' + D(sh.est)) + ' per bar', right: true },
              { html: 'About ' + t(sh.n + '\\div ' + D(sh.E) + '=' + D(sh.n / sh.E)) + ' per bar', why: 'Divide the <b>price</b> by the number of bars, not the bars by the price.', code: 'u1l6-wrong-way' },
              { html: 'About ' + t(D(sh.E) + '\\times ' + sh.n + '=' + D(sh.E * sh.n)) + ' per bar', why: 'One bar must cost less than the whole box. Divide.', code: 'u1l6-multiplied' },
              { html: 'About ' + t(D(sh.E) + '\\div 100=' + D(sh.E / 100)) + ' per bar', why: 'There are ' + sh.n + ' bars, so divide by ' + sh.n + '.', code: 'u1l6-div100' }],
              'Round ' + Dp(sh.P) + ' to about ' + Dg(sh.E) + ':<br>' + t(D(sh.E) + '\\div ' + sh.n + '=' + D(sh.est)) + ', so about ' + t(D(sh.est)) + ' per bar.', ['Round the price to a friendly number of dollars, then divide by the number of bars.'], 'estimate');
          } },
          { id: '2b', level: 'BEG', make: function (r, sh) { return unitPricePart('Calculate the price of one bar.', sh.P, sh.n, 'bar'); } },
          { id: '2c', level: 'EMG', make: function (r, sh) {
            var w = rd(sh.n / sh.P, 2);
            return P.mc(r, 'Mateo’s calculator shows ' + w.toFixed(2) + '. What mistake did he make, and how does your estimate show it is wrong?', [
              { html: 'He divided the wrong way (' + t(sh.n + '\\div ' + q(sh.P).toFixed(2)) + '). The estimate is about ' + Dp(sh.est) + ' a bar, and ' + Dp(w) + ' a bar would make ' + sh.n + ' bars cost about ' + Dg(Math.round(w * sh.n)) + ', not ' + Dp(sh.P) + '.', right: true },
              { html: 'He multiplied ' + t(q(sh.P).toFixed(2) + '\\times ' + sh.n) + ' instead of dividing.', why: t(q(sh.P).toFixed(2) + '\\times ' + sh.n + '=' + N(q(sh.P * sh.n))) + ', not ' + w.toFixed(2) + '. Try ' + t(sh.n + '\\div ' + q(sh.P).toFixed(2)) + ' on your calculator.', code: 'u1l6-multiplied' },
              { html: 'He forgot to round to the nearest cent.', why: 'Rounding can’t turn about ' + Dp(sh.est) + ' into ' + Dp(w) + '. Something else went wrong.', code: 'round' },
              { html: 'Nothing is wrong: ' + Dp(w) + ' is a fair price for one bar.', why: 'Check with the estimate: ' + sh.n + ' bars at ' + Dp(w) + ' would cost far more than ' + Dp(sh.P) + '.', code: 'fine' }],
              'He divided the number of bars by the price: ' + t(sh.n + '\\div ' + q(sh.P).toFixed(2) + '\\approx ' + w.toFixed(2)) + '.<br>The estimate says about ' + Dp(sh.est) + ' a bar. At ' + Dp(w) + ' a bar, ' + sh.n + ' bars would cost about ' + Dg(Math.round(w * sh.n)) + ', not ' + Dp(sh.P) + '.', ['Try dividing the two numbers the other way on your calculator.'], 'Mateo mistake');
          } }] },
      { num: '3', stem: function (sh) { return sh.who + ' buys a box of ' + sh.N + ' ' + sh.item + ' for ' + Dp(sh.C) + '. It sells the ' + sh.item + ' for ' + Dp(sh.S) + ' each.'; },
        shared: function (r) { var ctx = r.pick([['A sports store', 'hockey pucks', 'puck'], ['A golf shop', 'golf balls', 'ball'], ['A school store', 'notebooks', 'notebook']]);
          return find(function () { var N0 = r.pick([20, 24, 25, 40, 50, 60]), c = r.int(15, 50) * 5 / 100; return { who: ctx[0], item: ctx[1], one: ctx[2], N: N0, c: c, C: q(N0 * c), S: r.pick([1.99, 2.49, 2.99, 3.49, 3.99]) }; }, function (s) { return s.S - s.c >= 0.5 && !(s.N === 36); }, { who: 'A sports store', item: 'hockey pucks', one: 'puck', N: 50, c: 1.25, C: 62.5, S: 2.99 }); },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { return num('How much does one ' + sh.one + ' cost the store?', sh.c, { money: true, bad: [[sh.N / sh.C, 'u1l6-wrong-way', 'Divide the <b>price</b> of the box by the number of ' + sh.item + '.'], [sh.C * sh.N, 'u1l6-multiplied', 'One ' + sh.one + ' costs much less than the box. Divide.']], sol: t(q(sh.C).toFixed(2) + '\\div ' + sh.N + '=' + sh.c.toFixed(2)) + '<br>One ' + sh.one + ' costs the store ' + t(D(sh.c)) + '.', hints: ['Price of one = box price ÷ number in the box.'], text: 'cost of one' }); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { var ans = q(sh.S - sh.c); return num('How much profit does the store make on one ' + sh.one + '?', ans, { money: true, bad: [[sh.S + sh.c, 'u1l6-added', 'Profit is the money the store keeps: selling price <b>minus</b> cost.'], [sh.S, 'u1l6-revenue', 'That’s the selling price. Subtract what one ' + sh.one + ' cost the store.'], [sh.C - sh.S, 'u1l6-box-cost', 'Use the cost of <b>one</b> ' + sh.one + ' from (a), not the price of the box.']], sol: 'Profit = selling price − cost<br>' + t(sh.S.toFixed(2) + '-' + sh.c.toFixed(2) + '=' + ans.toFixed(2)) + '<br>The profit is ' + t(D(ans)) + ' per ' + sh.one + '.', hints: ['Profit = selling price − cost.'], text: 'profit one' }); } },
          { id: '3c', level: 'EMG', make: function (r, sh) { var pr = q(sh.S - sh.c), ans = q(sh.N * pr); return num('How much profit does the store make if it sells the whole box?', ans, { money: true, bad: [[sh.N * sh.S, 'u1l6-revenue', 'That’s the money from selling them all. Subtract what the box cost (or multiply the profit on one by ' + sh.N + ').'], [pr, 'u1l6-one-item', 'That’s the profit on one ' + sh.one + '. Multiply by the ' + sh.N + ' in the box.']], sol: t(sh.N + '\\times ' + pr.toFixed(2) + '=' + ans.toFixed(2)) + '<br>(Or: ' + t(sh.N + '\\times ' + sh.S.toFixed(2) + '-' + q(sh.C).toFixed(2) + '=' + ans.toFixed(2)) + '.)<br>The profit on the box is ' + t(D(ans)) + '.', hints: ['Multiply the profit on one by the number in the box.'], text: 'profit box' }); } }] },
      { num: '4', stem: function (sh) { var a = sh.a, b = sh.b; return 'Which is the better buy? Show the unit price of each.<br>(a) ' + a.n[0] + ' ' + a.what + ' for ' + Dp(a.P[0]) + ', or ' + a.n[1] + ' for ' + Dp(a.P[1]) + '<br>(b) ' + an(b.g[0]) + ' ' + b.g[0] + ' g bag of ' + b.what + ' for ' + Dp(b.P[0]) + ', or ' + an(b.g[1]) + ' ' + b.g[1] + ' g bag for ' + Dp(b.P[1]); },
        shared: function (r) {
          var A = r.pick([['rolls of paper towel', 'roll', [4, 6, 8], 1.1, 1.9], ['rolls of toilet paper', 'roll', [6, 12], 0.45, 0.9], ['garbage bags', 'bag', [20, 30, 40], 0.15, 0.45]]);
          var a = find(function () { var n1 = r.pick(A[2]), n2 = n1 * r.pick([2, 3]), u1 = A[3] + r.int(0, 20) / 20 * (A[4] - A[3]), bigBetter = r.chance(0.6), u2 = u1 * (bigBetter ? 1 - r.int(3, 12) / 100 : 1 + r.int(2, 8) / 100), P1 = p9(n1 * u1), P2 = p9(n2 * u2); return { what: A[0], one: A[1], n: [n1, n2], P: [P1, P2], up: [P1 / n1, P2 / n2] }; },
            function (v) { return Math.abs(v.up[0] - v.up[1]) >= 0.004 && v.P[1] > v.P[0]; }, { what: 'rolls of paper towel', one: 'roll', n: [6, 12], P: [8.49, 15.99], up: [8.49 / 6, 15.99 / 12] });
          var B = r.pick([['coffee', 1.8, 3.2], ['mixed nuts', 1.2, 2.6], ['loose-leaf tea', 2.5, 4.5]]);
          var b = find(function () { var g1 = r.pick([250, 300, 340, 400]), g2 = r.pick([750, 800, 900, 925, 950]), u1 = B[1] + r.int(0, 20) / 20 * (B[2] - B[1]), smallBetter = r.chance(0.5), u2 = u1 * (smallBetter ? 1 + r.int(2, 9) / 100 : 1 - r.int(3, 10) / 100); return { what: B[0], g: [g1, g2], P: [p9(g1 / 100 * u1), p9(g2 / 100 * u2)] }; },
            function (v) { v.up = [v.P[0] / v.g[0] * 100, v.P[1] / v.g[1] * 100]; return Math.abs(v.up[0] - v.up[1]) >= 0.008 && !(v.g[0] === 525 || v.g[1] === 750 && v.P[1] === 6.79); }, { what: 'coffee', g: [340, 925], P: [8.99, 24.99], up: [8.99 / 3.4, 24.99 / 9.25] });
          b.up = [b.P[0] / b.g[0] * 100, b.P[1] / b.g[1] * 100];
          return { a: a, b: b };
        },
        parts: [
          { id: '4ai', sub: 'a i', level: 'EMG', make: function (r, sh) { var a = sh.a; return boxes('(a) Find the price per ' + a.one + ' of each pack (to the cent, or to a tenth of a cent).', [0, 1].map(function (i) { return { label: a.n[i] + '-pack:', name: a.n[i] + '-pack', exact: a.up[i], kind: 'up', after: '/' + a.one, bad: [[a.n[i] / a.P[i], 'u1l6-wrong-way', 'Divide the <b>price</b> by the number of ' + a.one + 's.'], [a.P[i] * a.n[i], 'u1l6-multiplied', 'Divide the price by the number of ' + a.one + 's.']] }; }), [0, 1].map(function (i) { return a.n[i] + '-pack: ' + t(a.P[i].toFixed(2) + '\\div ' + a.n[i] + '\\approx ' + D(a.up[i], 3)) + ' per ' + a.one; }).join('<br>'), ['Unit price = price ÷ number in the pack.', 'Keep three decimals so you can compare.'], 'pack unit prices'); } },
          { id: '4aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var a = sh.a, b = argmin(a.up); return betterMC(r, '(a) Which pack of ' + a.what + ' is the better buy?', [0, 1].map(function (i) { return { name: 'The ' + a.n[i] + '-pack', up: a.up[i], total: a.P[i], size: a.n[i] }; }), [0, 1].map(function (i) { return a.n[i] + '-pack: ' + t(D(a.up[i], 3)) + ' per ' + a.one; }).join('<br>') + '<br>The <b>' + a.n[b] + '-pack</b> has the lower unit price, so it is the better buy.', null, 'better pack'); } },
          { id: '4bi', sub: 'b i', level: 'PRG', make: function (r, sh) { var b = sh.b; return boxes('(b) Find the price per 100 g of each bag.', [0, 1].map(function (i) { return { label: b.g[i] + ' g:', name: b.g[i] + ' g', exact: b.up[i], kind: 'up', after: ' per 100 g', bad: per100Bad(b.P[i], b.g[i], 'g') }; }), [0, 1].map(function (i) { return b.g[i] + ' g: ' + per100Sol(b.P[i], b.g[i], 'g'); }).join('<br>'), ['Price per 100 g = price ÷ grams × 100.'], 'per 100 g'); } },
          { id: '4bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { var b = sh.b, k = argmin(b.up); return betterMC(r, '(b) Which bag of ' + b.what + ' is the better buy?', [0, 1].map(function (i) { return { name: 'The ' + b.g[i] + ' g bag', up: b.up[i], total: b.P[i], size: b.g[i] }; }), [0, 1].map(function (i) { return b.g[i] + ' g: ' + t(D(b.up[i], 3)) + ' per 100 g'; }).join('<br>') + '<br>The <b>' + b.g[k] + ' g bag</b> is the better buy.' + (k === 0 ? ' (Bigger is not always cheaper!)' : ''), null, 'better bag'); } }] },
      { num: '5', stem: function (sh) { return cap(sh.what) + ' comes in three sizes: ' + [0, 1, 2].map(function (i) { return vol(sh.v[i]) + ' for ' + Dp(sh.P[i]); }).join(', ') + '.'; },
        shared: function (r) {
          var W = r.pick([['olive oil', 0.9, 1.9], ['canola oil', 0.3, 0.6], ['white vinegar', 0.15, 0.35]]), V = r.pick([[500, 1000, 3000], [250, 1000, 2000], [750, 1500, 3000], [500, 1000, 4000]]);
          return find(function () { var r1 = W[1] + r.int(0, 20) / 20 * (W[2] - W[1]), r2 = r1 * (1 - r.int(8, 18) / 100), r3 = r.chance(0.7) ? r2 * (1 - r.int(4, 10) / 100) : r2 * (1 + r.int(3, 8) / 100); var Pp = [p9(V[0] / 100 * r1), p9(V[1] / 100 * r2), p9(V[2] / 100 * r3)]; return { what: W[0], v: V, P: Pp, up: [0, 1, 2].map(function (i) { return Pp[i] / V[i] * 100; }) }; },
            function (s) { return apart(s.up, 0.006) && argmin(s.up) !== 0 && s.P[0] < s.P[1] && s.P[1] < s.P[2]; }, { what: 'olive oil', v: [500, 1000, 3000], P: [7.99, 13.49, 37.99], up: [7.99 / 5, 13.49 / 10, 37.99 / 30] });
        },
        parts: [
          { id: '5a', level: 'PRG', make: function (r, sh) { return boxes('Complete the table: find the price per 100 mL of each size. (Remember: 1 L = 1000 mL.)', [0, 1, 2].map(function (i) { var mL = sh.v[i]; return { label: vol(mL) + ' for ' + Dp(sh.P[i]) + ':', name: vol(mL), exact: sh.up[i], kind: 'up', after: ' per 100 mL', bad: per100Bad(sh.P[i], mL, 'mL').concat(mL >= 1000 ? [[sh.P[i] / (mL / 1000) * 100, 'u1l6-no-convert', 'Change ' + vol(mL) + ' to millilitres first: ' + t(N(mL / 1000) + '\\times 1000=' + mL) + ' mL.'], [sh.P[i] / (mL / 1000), 'u1l6-per-kg', 'That’s the price per <b>litre</b>. A litre is 10 groups of 100 mL, so divide by 10.']] : []) }; }),
            '<table style="border-collapse:collapse"><tr>' + ['Size', 'Price', 'Work', 'Per 100 mL'].map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' + [0, 1, 2].map(function (i) { return '<tr><td style="' + TD + '">' + vol(sh.v[i]) + '</td><td style="' + TD + '">' + Dp(sh.P[i]) + '</td><td style="' + TD + '">' + t(sh.P[i].toFixed(2) + '\\div ' + sh.v[i] + '\\times 100') + '</td><td style="' + TD + '">' + t(D(sh.up[i], 3)) + '</td></tr>'; }).join('') + '</table>',
            ['Change litres to millilitres first (1 L = 1000 mL).', 'Price per 100 mL = price ÷ mL × 100.'], 'oil table'); } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var b = argmin(sh.up); return P.mc(r, 'Which size is the best buy?', [0, 1, 2].map(function (i) { return { html: 'The ' + vol(sh.v[i]) + ' size', right: i === b, why: i === b ? null : 'Compare the prices per 100 mL from (a). The <b>lowest</b> one is the best buy.' + (i === 2 ? ' The biggest size isn’t always the cheapest per 100 mL.' : ''), code: 'size' + i }; }), [0, 1, 2].map(function (i) { return vol(sh.v[i]) + ': ' + t(D(sh.up[i], 3)) + ' per 100 mL'; }).join('<br>') + '<br>The <b>' + vol(sh.v[b]) + '</b> size has the lowest price per 100 mL.', ['Use your table from (a).'], 'best size', true); } },
          { id: '5c', level: 'EMG', make: function (r, sh) {
            var small = vol(sh.v[0]), big = vol(sh.v[argmin(sh.up)]), good = r.pick(['After it is opened, ' + sh.what + ' slowly goes stale, and a small household may not use ' + big + ' in time.', 'The ' + big + ' size may not fit in the cupboard.', 'The ' + big + ' size costs ' + Dp(sh.P[argmin(sh.up)]) + ' all at once, which may be more than someone can spend today.']);
            return P.mc(r, 'Which is a good reason, <b>not</b> about the unit price, why someone might still choose the ' + small + ' size?', [
              { html: good, right: true },
              { html: 'The ' + small + ' size has the lowest price per 100 mL.', why: 'That’s a reason about price — and it isn’t true here. Look for a reason that isn’t about price.', code: 'price' },
              { html: 'A smaller bottle always holds better-quality ' + sh.what + '.', why: 'It’s the same product in a different size, so the quality is the same.', code: 'quality' },
              { html: 'The ' + small + ' size gives you more ' + sh.what + ' for your money.', why: 'It gives <b>less</b> for your money — its price per 100 mL is the highest. Look for a reason that isn’t about price.', code: 'more' }],
              'For example: ' + good + ' Other good reasons: not enough storage space, or not wanting to spend a lot at one time.', ['Think about spoiling, storage space, and how much money someone has today.'], 'reason not price');
          } }] },
      { num: '6', stem: function (sh) { return 'Ana is putting trim around a room. The store sells the trim in ' + N(sh.L[0]) + ' m pieces for ' + Dp(sh.P[0]) + ' each, or in ' + N(sh.L[1]) + ' m pieces for ' + Dp(sh.P[1]) + ' each.'; },
        shared: function (r) { return find(function () { var L1 = r.pick([1.2, 1.8, 2.4, 3]), L2 = q(L1 * 1.5), r1 = r.int(56, 84) * 5 / 100, longBetter = r.chance(0.75), r2 = q(r1 + (longBetter ? -1 : 1) * r.int(1, 6) * 5 / 100); return { L: [L1, L2], rate: [r1, r2], P: [q(L1 * r1), q(L2 * r2)], X: q(3 * L1) }; }, function (s) { return decs(s.P[0]) <= 2 && decs(s.P[1]) <= 2; }, { L: [2.4, 3.6], rate: [3.2, 3.1], P: [7.68, 11.16], X: 7.2 }); },
        parts: [
          { id: '6ai', sub: 'a i', level: 'EMG', make: function (r, sh) { return boxes('Find the price per metre of each piece.', [0, 1].map(function (i) { return { label: N(sh.L[i]) + ' m piece:', name: N(sh.L[i]) + ' m', exact: sh.rate[i], kind: 'up', after: '/m', bad: [[sh.L[i] / sh.P[i], 'u1l6-wrong-way', 'Divide the <b>price</b> by the length.'], [sh.P[i] * sh.L[i], 'u1l6-multiplied', 'Divide the price by the length in metres.']] }; }), [0, 1].map(function (i) { return N(sh.L[i]) + ' m: ' + t(D(sh.P[i]) + '\\div ' + N(sh.L[i]) + '=' + D(sh.rate[i])) + ' per m'; }).join('<br>'), ['Price per metre = price ÷ length.'], 'trim per m'); } },
          { id: '6aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var b = argmin(sh.rate); return betterMC(r, 'Which pieces are the better buy?', [0, 1].map(function (i) { return { name: 'The ' + N(sh.L[i]) + ' m pieces', up: sh.rate[i], total: sh.P[i], size: sh.L[i] }; }), 'The <b>' + N(sh.L[b]) + ' m pieces</b> cost less per metre (' + Dp(sh.rate[b]) + ' vs ' + Dp(sh.rate[1 - b]) + ').', null, 'better trim'); } },
          { id: '6b', level: 'PRG', make: function (r, sh) { var n1 = Math.round(sh.X / sh.L[0]), n2 = Math.round(sh.X / sh.L[1]), c1 = q(n1 * sh.P[0]), c2 = q(n2 * sh.P[1]), sv = q(Math.abs(c1 - c2));
            return boxes('Ana needs exactly ' + N(sh.X) + ' m of trim. Find the cost using only short pieces, and using only long pieces. How much does she save with the better choice?', [
              { label: 'Only ' + N(sh.L[0]) + ' m pieces:', name: 'Short pieces', exact: c1, kind: 'money', bad: [[sh.P[0], 'u1l6-one-item', 'That’s one piece. How many ' + N(sh.L[0]) + ' m pieces make ' + N(sh.X) + ' m?']] },
              { label: 'Only ' + N(sh.L[1]) + ' m pieces:', name: 'Long pieces', exact: c2, kind: 'money', bad: [[sh.P[1], 'u1l6-one-item', 'That’s one piece. How many ' + N(sh.L[1]) + ' m pieces make ' + N(sh.X) + ' m?']] },
              { label: 'She saves:', name: 'Savings', exact: sv, kind: 'money', bad: [[Math.abs(sh.P[0] - sh.P[1]), 'u1l6-one-item', 'Compare the <b>total</b> costs for ' + N(sh.X) + ' m, not the price of one piece.'], [Math.abs(sh.rate[0] - sh.rate[1]), 'u1l6-one-item', 'That’s the saving for 1 m. Compare the total costs for ' + N(sh.X) + ' m.']] }],
              'Short: ' + t(N(sh.X) + '\\div ' + N(sh.L[0]) + '=' + n1) + ' pieces, ' + t(n1 + '\\times ' + D(sh.P[0]) + '=' + D(c1)) + '<br>Long: ' + t(N(sh.X) + '\\div ' + N(sh.L[1]) + '=' + n2) + ' pieces, ' + t(n2 + '\\times ' + D(sh.P[1]) + '=' + D(c2)) + '<br>She saves ' + t(D(Math.max(c1, c2)) + '-' + D(Math.min(c1, c2)) + '=' + D(sv)) + ' with the ' + (c2 < c1 ? 'long' : 'short') + ' pieces.',
              ['How many pieces of each length make ' + N(sh.X) + ' m?', 'Multiply by the price of one piece, then subtract the two costs.'], 'trim totals'); } }] },
      { num: '7', stem: function (sh) { var a = sh.a, b = sh.b, c = sh.c; return 'Change to the same unit, then decide which is the better buy.<br>(a) ' + a.what + ': ' + a.m[0] + ' mL for ' + Dp(a.P[0]) + ', or ' + vol(a.m[1]) + ' for ' + Dp(a.P[1]) + '<br>(b) ' + b.what + ': ' + Dp(b.loose) + ' per kg loose, or ' + an(b.w) + ' ' + N(b.w) + ' kg bag for ' + Dp(b.bag) + '<br>(c) ' + c.what + ': ' + an(c.g) + ' ' + c.g + ' g bag for ' + Dp(c.bag) + ', or ' + Dp(c.loose) + ' per kg loose'; },
        shared: function (r) {
          var a = find(function () { var m1 = r.pick([500, 750, 900]), L2 = r.pick([1.25, 1.5, 2]), u1 = r.int(45, 80) / 100, u2 = u1 * (r.chance(0.7) ? 1 - r.int(5, 14) / 100 : 1 + r.int(3, 9) / 100), P1 = p9(m1 / 100 * u1), P2 = p9(L2 * 10 * u2); return { what: r.pick(['ketchup', 'dish soap', 'apple juice']), m: [m1, L2 * 1000], P: [P1, P2], up: [P1 / m1 * 100, P2 / (L2 * 1000) * 100] }; }, function (v) { return Math.abs(v.up[0] - v.up[1]) >= 0.008 && !(v.m[0] === 740); }, { what: 'ketchup', m: [750, 1250], P: [4.29, 6.49], up: [4.29 / 7.5, 6.49 / 12.5] });
          var b = find(function () { var w = r.pick([1.36, 1.5, 2.27, 1.81, 3]), loose = r.int(299, 499) / 100, bag = p9(w * loose * (r.chance(0.6) ? 1 - r.int(4, 12) / 100 : 1 + r.int(4, 10) / 100)); return { what: r.pick(['apples', 'oranges', 'potatoes']), w: w, loose: loose, bag: bag, bu: bag / w }; }, function (v) { return Math.abs(v.bu - v.loose) >= 0.05 && !same(rd(v.bu, 2), v.loose); }, { what: 'apples', w: 1.36, loose: 4.39, bag: 5.49, bu: 5.49 / 1.36 });
          var c = find(function () { var g = r.pick([250, 500, 750]), loose = r.int(449, 899) / 100, bag = p9(g / 1000 * loose * (r.chance(0.5) ? 1 - r.int(4, 12) / 100 : 1 + r.int(4, 12) / 100)); return { what: r.pick(['grapes', 'cherries', 'mushrooms']), g: g, loose: loose, bag: bag, bu: bag / g * 1000 }; }, function (v) { return Math.abs(v.bu - v.loose) >= 0.08 && !(v.g === 650); }, { what: 'grapes', g: 500, loose: 6.59, bag: 3.49, bu: 6.98 });
          return { a: a, b: b, c: c };
        },
        parts: [
          { id: '7ai', sub: 'a i', level: 'PRG', make: function (r, sh) { var a = sh.a; return upPart('(a) Change ' + vol(a.m[1]) + ' to millilitres, then find the price per 100 mL of the ' + vol(a.m[1]) + ' size.', a.up[1], { after: ' per 100 mL',
            bad: per100Bad(a.P[1], a.m[1], 'mL').concat([[a.P[1] / (a.m[1] / 1000), 'u1l6-no-convert', 'That’s the price per <b>litre</b>. Change ' + vol(a.m[1]) + ' to ' + a.m[1] + ' mL, then divide and multiply by 100.'], [a.P[1] / (a.m[1] / 1000) * 100, 'u1l6-no-convert', 'Change ' + vol(a.m[1]) + ' to millilitres first: ' + t(N(a.m[1] / 1000) + '\\times 1000=' + a.m[1]) + ' mL.']]),
            sol: t(N(a.m[1] / 1000) + '\\text{ L}=' + N(a.m[1] / 1000) + '\\times 1000=' + a.m[1] + '\\text{ mL}') + '<br>' + per100Sol(a.P[1], a.m[1], 'mL'), hints: ['1 L = 1000 mL.', 'Price per 100 mL = price ÷ mL × 100.'], text: 'per 100 mL' }); } },
          { id: '7aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var a = sh.a, k = argmin(a.up); return betterMC(r, '(a) Which ' + a.what + ' is the better buy? (The ' + a.m[0] + ' mL size is ' + Dp(a.up[0], 3) + ' per 100 mL.)', [0, 1].map(function (i) { return { name: 'The ' + vol(a.m[i]) + ' bottle', up: a.up[i], total: a.P[i], size: a.m[i] }; }), a.m[0] + ' mL: ' + t(D(a.up[0], 3)) + ' per 100 mL<br>' + vol(a.m[1]) + ': ' + t(D(a.up[1], 3)) + ' per 100 mL<br>The <b>' + vol(a.m[k]) + '</b> bottle is the better buy.', null, 'better bottle'); } },
          { id: '7bi', sub: 'b i', level: 'EMG', make: function (r, sh) { var b = sh.b; return upPart('(b) Find the price per kg of the ' + N(b.w) + ' kg bag of ' + b.what + '.', b.bu, { after: ' per kg',
            bad: [[b.w / b.bag, 'u1l6-wrong-way', 'Divide the <b>price</b> by the kilograms.'], [b.bag * b.w, 'u1l6-multiplied', 'Divide the price by the kilograms in the bag.']], sol: t(D(b.bag) + '\\div ' + N(b.w) + '\\approx ' + D(b.bu, 3)) + ' per kg', hints: ['Price per kg = price ÷ kg.'], text: 'bag per kg' }); } },
          { id: '7bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { var b = sh.b, bagBetter = b.bu < b.loose; return betterMC(r, '(b) Which ' + b.what + ' are the better buy?', [{ name: 'The ' + N(b.w) + ' kg bag', up: b.bu, total: b.bag, size: b.w }, { name: 'The loose ' + b.what, up: b.loose, total: b.loose, size: 1, loose: true }], 'Bag: ' + t(D(b.bu, 3)) + ' per kg. Loose: ' + t(D(b.loose)) + ' per kg.<br>The <b>' + (bagBetter ? 'bag' : 'loose ' + b.what) + '</b> ' + (bagBetter ? 'is' : 'are') + ' the better buy.', null, 'bag or loose'); } },
          { id: '7ci', sub: 'c i', level: 'EMG', make: function (r, sh) { var c = sh.c; return upPart('(c) Change ' + c.g + ' g to kilograms, then find the price per kg of the bag of ' + c.what + '.', c.bu, { after: ' per kg',
            bad: [[c.bag / c.g, 'u1l6-no-convert', 'That’s the price per <b>gram</b>. Change ' + c.g + ' g to kg first: ' + t(c.g + '\\div 1000=' + N(c.g / 1000)) + ' kg.'], [c.bag / c.g * 100, 'u1l6-per100', 'That’s the price per 100 g. The loose price is per <b>kg</b>, so find the price per kg.'], [c.g / 1000 / c.bag, 'u1l6-wrong-way', 'Divide the <b>price</b> by the kilograms.'], [c.bag * c.g / 1000, 'u1l6-multiplied', 'Divide the price by ' + N(c.g / 1000) + ' kg.']],
            sol: t(c.g + '\\text{ g}=' + c.g + '\\div 1000=' + N(c.g / 1000) + '\\text{ kg}') + '<br>' + t(D(c.bag) + '\\div ' + N(c.g / 1000) + '\\approx ' + D(c.bu, 3)) + ' per kg', hints: ['1 kg = 1000 g, so ' + c.g + ' g = ' + N(c.g / 1000) + ' kg.', 'Price per kg = price ÷ kg.'], text: 'grapes per kg' }); } },
          { id: '7cii', sub: 'c ii', level: 'EMG', make: function (r, sh) { var c = sh.c, bagBetter = c.bu < c.loose; return betterMC(r, '(c) Which ' + c.what + ' are the better buy?', [{ name: 'The ' + c.g + ' g bag', up: c.bu, total: c.bag, size: c.g / 1000 }, { name: 'The loose ' + c.what, up: c.loose, total: c.loose, size: 1, loose: true }], 'Bag: ' + t(D(c.bu, 3)) + ' per kg. Loose: ' + t(D(c.loose)) + ' per kg.<br>The <b>' + (bagBetter ? 'bag' : 'loose ' + c.what) + '</b> ' + (bagBetter ? 'is' : 'are') + ' the better buy.', null, 'bag or loose 2'); } }] },
      { num: '8', stem: function (sh) { return 'A can of soup costs ' + Dp(sh.s) + '. This week the sign says “' + sh.k + ' for ' + Dp(sh.D) + '”.'; },
        shared: function (r) { return find(function () { var k = r.pick([3, 3, 4, 5]), s = r.int(119, 199) / 100, D0 = r.pick([3, 3.5, 4, 4.5, 5, 6, 7]); return { k: k, s: s, D: D0, g: r.int(2, 4) }; }, function (v) { var d = v.D / v.k; return v.s - d >= 0.08 && v.s - d <= 0.45 && !(v.k === 4 && v.D === 5) && !Number.isInteger(q(v.D / v.k)); }, { k: 3, s: 1.49, D: 4, g: 3 }); },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { return unitPricePart('What is the price of one can with the deal?', sh.D, sh.k, 'can'); } },
          { id: '8b', level: 'EMG', make: function (r, sh) { var ex = sh.s - sh.D / sh.k, ans = rd(ex, 2), alt = rd(sh.s - rd(sh.D / sh.k, 2), 2); return num('About how much do you save on each can with the deal?', ans, { money: true, exact: ex, alt: same(alt, ans) ? [] : [alt], bad: [[sh.D / sh.k, 'u1l6-regular-total', 'That’s the deal price of one can. Subtract it from the regular price, ' + Dp(sh.s) + '.'], [sh.k * sh.s - sh.D, 'u1l6-regular-total', 'That’s the saving on ' + sh.k + ' cans. The question asks about <b>each</b> can.']], sol: t(D(sh.s) + '-' + (decs(q(sh.D / sh.k)) <= 2 ? D(sh.D / sh.k) + '=' : D(sh.D / sh.k, 3) + '\\approx ') + D(ans)) + ' per can', hints: ['Regular price − deal price for one can.'], text: 'save per can' }); } },
          { id: '8c', level: 'PRG', make: function (r, sh) { var m = sh.k * sh.g, reg = q(m * sh.s), deal = q(sh.g * sh.D), ans = q(reg - deal); return num('Sam buys ' + m + ' cans at the deal price. How much does he save compared with paying ' + Dp(sh.s) + ' for each?', ans, { money: true,
            bad: [[reg, 'u1l6-regular-total', 'That’s what ' + m + ' cans cost at the regular price. Subtract what he pays with the deal.'], [deal, 'u1l6-regular-total', 'That’s what he pays with the deal. Subtract it from the regular cost.'], [m * rd(sh.s - sh.D / sh.k, 2), 'u1l6-early-round', 'Close! Rounding the saving per can first makes the answer a little off. Find the two totals instead: ' + m + ' cans at ' + Dp(sh.s) + ', and ' + sh.g + ' groups of ' + sh.k + ' at ' + Dp(sh.D) + '.']],
            sol: 'Deal: ' + m + ' cans is ' + sh.g + ' groups of ' + sh.k + ', so ' + t(sh.g + '\\times ' + D(sh.D) + '=' + D(deal)) + '<br>Regular: ' + t(m + '\\times ' + D(sh.s) + '=' + D(reg)) + '<br>He saves ' + t(D(reg) + '-' + D(deal) + '=' + D(ans)) + '.', hints: ['Find the regular cost and the deal cost of ' + m + ' cans.', 'Subtract.'], text: 'Sam saves' }); } }] },
      { num: '9', stem: function (sh) { return 'At the arena canteen, a sports drink costs ' + Dp(sh.c) + '. At a grocery store, a case of ' + sh.n + ' of the same drinks costs ' + Dp(sh.C) + '.'; },
        shared: function (r) { return find(function () { var n = r.pick([12, 24, 30]), uu = r.int(85, 149) / 100; return { n: n, u: uu, C: q(n * uu), c: r.pick([2.25, 2.5, 2.75, 3, 3.25, 3.5]) }; }, function (s) { return s.c - s.u >= 0.8; }, { n: 24, u: 1.14, C: 27.36, c: 2.75 }); },
        parts: [
          { id: '9a', level: 'BEG', make: function (r, sh) { return unitPricePart('Find the price of one drink in the case.', sh.C, sh.n, 'drink'); } },
          { id: '9b', level: 'EMG', make: function (r, sh) { var can = q(sh.n * sh.c), ans = q(can - sh.C); return num('A team needs ' + sh.n + ' drinks. How much does the team save by buying the case instead of buying ' + sh.n + ' drinks at the canteen?', ans, { money: true, bad: [[can, 'u1l6-regular-total', 'That’s what ' + sh.n + ' canteen drinks cost. Subtract the price of the case.'], [sh.c - sh.u, 'u1l6-one-item', 'That’s the saving on <b>one</b> drink. The team buys ' + sh.n + '.']], sol: 'Canteen: ' + t(sh.n + '\\times ' + D(sh.c) + '=' + D(can)) + '<br>Save ' + t(D(can) + '-' + D(sh.C) + '=' + D(ans)), hints: ['Find the canteen cost of ' + sh.n + ' drinks.', 'Subtract the price of the case.'], text: 'team saves' }); } }] },
      { num: '10', stem: function (sh) { return 'Lena runs a small bakery. She orders cake boxes from one of two suppliers.<br>• Supplier A: ' + sh.n[0] + ' boxes for ' + Dp(sh.P[0]) + ', plus ' + Dp(sh.d[0]) + ' delivery.<br>• Supplier B: ' + sh.n[1] + ' boxes for ' + Dp(sh.P[1]) + ', plus ' + Dp(sh.d[1]) + ' delivery.'; },
        shared: function (r) { var trap = r.chance(0.6); return find(function () { var n = [r.pick([100, 120, 200]), r.pick([150, 250, 300])], b = [r.int(36, 60) / 100, r.int(36, 60) / 100], Pp = [q(n[0] * b[0]), q(n[1] * b[1])], d = [r.pick([9.5, 12.5, 15, 18, 20]), r.pick([9.5, 12.5, 15, 18, 20, 25])]; return { n: n, P: Pp, d: d, b: b, up: [(Pp[0] + d[0]) / n[0], (Pp[1] + d[1]) / n[1]] }; },
          function (s) { return Math.abs(s.up[0] - s.up[1]) >= 0.01 && Math.abs(s.b[0] - s.b[1]) >= 0.01 && ((argmin(s.b) !== argmin(s.up)) === trap); }, { n: [100, 150], P: [48, 69], d: [12.5, 18], b: [0.48, 0.46], up: [0.605, 0.58] }); },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) { return boxes('Find the real price per box at each supplier, including the delivery (to the cent, or to a tenth of a cent).', [0, 1].map(function (i) { var nm = 'Supplier ' + 'AB'.charAt(i); return { label: nm + ':', name: nm, exact: sh.up[i], kind: 'up', after: ' per box', bad: [[sh.b[i], 'u1l6-no-delivery', 'That leaves out the ' + Dp(sh.d[i]) + ' delivery. Add it to the price <b>before</b> you divide.'], [sh.b[i] + sh.d[i], 'u1l6-delivery-each', 'The delivery is paid once for the whole order, not for each box. Add it to the order price, then divide.'], [sh.n[i] / (sh.P[i] + sh.d[i]), 'u1l6-wrong-way', 'Divide the total <b>price</b> by the number of boxes.']] }; }),
            [0, 1].map(function (i) { return 'AB'.charAt(i) + ': ' + t(D(sh.P[i]) + '+' + D(sh.d[i]) + '=' + D(sh.P[i] + sh.d[i])) + '; ' + t(D(sh.P[i] + sh.d[i]) + '\\div ' + sh.n[i] + '\\approx ' + D(sh.up[i], 3)) + ' per box'; }).join('<br>'), ['Add the delivery to the price first.', 'Then divide by the number of boxes.'], 'supplier per box'); } },
          { id: '10b', level: 'EMG', make: function (r, sh) { var b = argmin(sh.up), lowB = argmin(sh.b), cheapD = argmin(sh.d), more = argmax(sh.n), L = 'AB';
            var opts = [{ html: '<b>Supplier ' + L.charAt(b) + '</b>, because its price per box <b>with</b> delivery is lower.', right: true },
              { html: '<b>Supplier ' + L.charAt(1 - b) + '</b>, because its price per box with delivery is lower.', why: 'Check your answers to (a): the lower price per box is the better buy.', code: 'u1l6-higher-up' }];
            if (lowB !== b) opts.push({ html: '<b>Supplier ' + L.charAt(lowB) + '</b>, because its price per box <b>before</b> delivery is lower.', why: 'Lena has to pay the delivery too. Add it before you compare.', code: 'u1l6-no-delivery' });
            if (sh.d[0] !== sh.d[1]) opts.push({ html: '<b>Supplier ' + L.charAt(cheapD) + '</b>, because its delivery costs less.', why: 'The delivery is only part of the cost. Compare the price per box with delivery included.', code: 'delivery' });
            if (opts.length < 4) opts.push({ html: '<b>Supplier ' + L.charAt(more) + '</b>, because it sends more boxes.', why: 'More boxes doesn’t mean cheaper per box. Compare the price per box with delivery included.', code: 'u1l6-bigger' });
            return P.mc(r, 'Which supplier is the better buy?', opts, 'A: ' + t(D(sh.up[0], 3)) + ' per box. B: ' + t(D(sh.up[1], 3)) + ' per box (delivery included).<br><b>Supplier ' + L.charAt(b) + '</b> is the better buy.', ['Use your prices per box from (a).'], 'better supplier'); } },
          { id: '10c', level: 'PRG', make: function (r, sh) { var df = Math.abs(sh.up[0] - sh.up[1]); return upPart('By how much per box is the better supplier cheaper?', df, { after: ' per box', bad: [[Math.abs(sh.b[0] - sh.b[1]), 'u1l6-no-delivery', 'Include the delivery: use the prices per box from (a).'], [Math.abs(sh.P[0] + sh.d[0] - sh.P[1] - sh.d[1]), 'u1l6-regular-total', 'That compares the order totals, but the orders have different numbers of boxes. Subtract the prices <b>per box</b>.']],
            sol: t(D(Math.max(sh.up[0], sh.up[1]), 3) + '-' + D(Math.min(sh.up[0], sh.up[1]), 3) + '\\approx ' + D(df, 3)) + ' per box' + (df < 0.1 ? ' (about ' + nS(rd(df * 100, 1)) + '¢)' : '') + '.', hints: ['Subtract the two prices per box from (a).'], text: 'difference per box' }); } }] },
      { num: '11', stem: function (sh) { return 'A loaf of bread costs ' + Dp(sh.s) + '. A two-pack of the same bread costs ' + Dp(sh.p) + '. Devon lives alone and eats about one loaf every two weeks. The bread goes mouldy in about one week.'; },
        shared: function (r) { return find(function () { var s = r.pick([2.99, 3.29, 3.49, 3.79, 3.99]), p = r.pick([4.99, 5.49, 5.79, 5.99, 6.49, 6.99]); return { s: s, p: p }; }, function (v) { return v.s - v.p / 2 >= 0.2; }, { s: 3.49, p: 5.99 }); },
        parts: [
          { id: '11a', level: 'BEG', make: function (r, sh) { var ex = sh.p / 2, tie = Math.abs(ex * 100 - Math.floor(ex * 100) - 0.5) < 1e-6; var p = unitPricePart('Find the price per loaf in the two-pack.', sh.p, 2, 'loaf'); if (tie) { var ans = rd(ex, 2), lo = q(ans - 0.01); p.check = numChk(ans, { money: true, exact: ex, alt: [lo], bad: [[2 / sh.p, 'u1l6-wrong-way', 'Divide the <b>price</b> by 2.'], [sh.p * 2, 'u1l6-multiplied', 'To find the price of one loaf, divide by 2.']] }); } return p; } },
          { id: '11b', level: 'EMG', make: function (r, sh) { var per = rd(sh.p / 2, 2);
            return P.mc(r, 'Which should Devon buy? Choose the sentence that is correct.', [
              { html: 'Devon should buy <b>the single loaf</b> because he can’t eat even one loaf before it goes mouldy, so a second loaf would be wasted.', right: true },
              { html: 'Devon should buy <b>the two-pack</b> because it is cheaper per loaf (' + Dp(per) + ' instead of ' + Dp(sh.s) + ').', why: 'It is cheaper per loaf, but Devon would throw the second loaf out. He would pay ' + Dp(sh.p) + ' instead of ' + Dp(sh.s) + ' for the bread he eats.', code: 'cheaper' },
              { html: 'Devon should buy <b>the two-pack</b> because he gets more bread.', why: 'More bread is no help if it goes mouldy before he can eat it.', code: 'more' },
              { html: 'Devon should buy <b>the single loaf</b> because it is cheaper per loaf.', why: 'The single loaf is <b>not</b> cheaper per loaf (' + Dp(sh.s) + ' vs ' + Dp(per) + '). It is the better choice for another reason.', code: 'false-price' }],
              'The single loaf. He eats one loaf in two weeks, but bread goes mouldy in one week, so the second loaf would be wasted. He would pay ' + Dp(sh.p) + ' instead of ' + Dp(sh.s) + '.', ['How long does one loaf last Devon? How long until it goes mouldy?'], 'Devon choice');
          } },
          { id: '11c', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'What could Devon do so that the two-pack becomes a good choice?', [
              { html: 'Freeze one loaf (or share it with a friend), so it doesn’t go mouldy.', right: true },
              { html: 'Buy two two-packs so he gets an even lower price per loaf.', why: 'That makes even more bread go to waste.', code: 'more' },
              { html: 'Keep the bread on the counter so it lasts longer.', why: 'Bread on the counter still goes mouldy in about a week.', code: 'counter' },
              { html: 'Only buy the two-pack when the single loaf is on sale.', why: 'If the single loaf is on sale, the two-pack is even less of a deal.', code: 'sale' }],
              'Freeze the extra loaf (or share it), so it doesn’t go mouldy before he eats it.', ['The problem is that the bread goes mouldy. How can he stop that?'], 'Devon fix');
          } }] },
      { num: '12', stem: '', parts: [
        { id: '12a', level: 'EMG', make: function (r) {
          var v = find(function () { return { w: r.pick([1.5, 2, 2.5, 3, 5]), up: r.int(98, 198) / 100, x: r.pick([1, 3, 4, 6, 7.5]), what: r.pick(['carrots', 'onions', 'potatoes']) }; }, function (v) { return v.x !== v.w && decs(q(v.w * v.up)) <= 2 && !(v.what === 'potatoes' && v.w === 3); }, { w: 2.5, up: 1.38, x: 4, what: 'carrots' });
          var P0 = q(v.w * v.up), ex = v.x * v.up, ans = rd(ex, 2);
          return num(cap(an(v.w)) + ' ' + N(v.w) + ' kg bag of ' + v.what + ' costs ' + Dp(P0) + '. At the same unit price, how much would ' + N(v.x) + ' kg cost?', ans, { money: true, exact: ex,
            bad: [[P0 * v.x, 'u1l6-box-cost', Dp(P0) + ' is for ' + N(v.w) + ' kg, not 1 kg. Find the price per kg first.'], [P0 / v.w / v.x, 'u1l6-divided', 'You have the price per kg — now <b>multiply</b> by ' + N(v.x) + ' kg.'], [v.w / P0 * v.x, 'u1l6-wrong-way', 'Price per kg = price ÷ kg: ' + t(D(P0) + '\\div ' + N(v.w)) + '.']],
            sol: 'Unit price: ' + t(D(P0) + '\\div ' + N(v.w) + '=' + D(v.up)) + ' per kg<br>' + t(N(v.x) + '\\times ' + D(v.up) + '=' + (same(ex, ans) ? D(ans) : N(q(ex)) + '\\approx ' + D(ans))) + '<br>' + N(v.x) + ' kg would cost ' + t(D(ans)) + '.', hints: ['Find the price per kg first.', 'Then multiply by the number of kg.'], text: 'carrots' });
        } },
        { id: '12b', level: 'PRG', make: function (r) {
          var up = r.int(62, 124) * 2 / 100, am = r.sample([50, 150, 250, 350, 450, 750], 3).sort(function (a, b) { return a - b; }).concat([r.pick([1000, 1500])]);
          var what = r.pick(['Bulk almonds cost', 'Bulk cashews cost', 'Bulk trail mix costs']);
          return boxes(what + ' ' + Dp(up) + ' per 100 g. Complete the price chart.', am.map(function (g) { var ex = g / 100 * up; return { label: mass(g) + ':', name: mass(g), exact: ex, kind: 'money', bad: [[g * up, 'u1l6-per100', 'The price is per <b>100 g</b>. ' + mass(g) + ' is ' + N(g / 100) + ' groups of 100 g.'], [up * (g >= 1000 ? g / 1000 : g / 10), 'u1l6-no-convert', g >= 1000 ? N(g / 1000) + ' kg = ' + g + ' g, which is ' + N(g / 100) + ' groups of 100 g.' : 'Divide the grams by 100 (not 10): ' + g + ' g is ' + N(g / 100) + ' groups of 100 g.']] }; }),
            am.map(function (g) { var ex = g / 100 * up; return mass(g) + ': ' + (g >= 1000 ? g + ' g, ' : '') + t(N(g / 100) + '\\times ' + D(up) + '=' + (same(ex, rd(ex, 2)) ? D(ex) : N(q(ex)) + '\\approx ' + D(rd(ex, 2)))); }).join('<br>'), ['How many groups of 100 g are in each amount? (1 kg = 1000 g.)', 'Multiply that by the price per 100 g.'], 'price chart');
        } }] },
      { num: '13', stem: function (sh) { return 'A daycare uses ' + N(sh.L) + ' L of milk each day. It is open ' + sh.days + ' days a week. Milk costs ' + Dp(sh.P) + ' for ' + an(sh.J) + ' ' + sh.J + ' L jug.'; },
        shared: function (r) { return find(function () { var J = r.pick([2, 4]), pl = r.int(130, 180) / 100; return { L: r.pick([2, 2.5, 3, 4, 6]), days: 5, J: J, pl: pl, P: q(J * pl), W: r.pick([3, 4, 6, 8]) }; }, function (s) { return decs(s.P) <= 2 && !(s.L === 3 && s.P === 6.2 && s.W === 4 && false); }, { L: 3, days: 5, J: 4, pl: 1.55, P: 6.2, W: 4 }); },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, sh) { var ans = q(sh.L * sh.days); return num('How many litres of milk does the daycare use in one week?', ans, { after: 'L', bad: [[sh.L * 7, 'u1l6-per-day', 'The daycare is open only ' + sh.days + ' days a week.'], [sh.L + sh.days, 'u1l6-added', 'Multiply the litres per day by the days.']], sol: t(sh.days + '\\times ' + N(sh.L) + '=' + N(ans)) + ' L', hints: ['Litres per day × days per week.'], text: 'milk per week' }); } },
          { id: '13b', level: 'BEG', make: function (r, sh) { return unitPricePart('What is the price of milk per litre?', sh.P, sh.J, 'L'); } },
          { id: '13c', level: 'PRG', make: function (r, sh) { var Lw = q(sh.L * sh.days), tot = q(Lw * sh.W), ex = tot * sh.pl, ans = rd(ex, 2); return num('How much should the daycare budget for milk for ' + sh.W + ' weeks?', ans, { money: true, exact: ex,
            bad: [[Lw * sh.pl, 'u1l6-per-week', 'That’s the cost for <b>one</b> week. Budget for ' + sh.W + ' weeks.'], [tot * sh.P, 'u1l6-jug-price', Dp(sh.P) + ' is the price of a ' + sh.J + ' L jug. Use the price per <b>litre</b> from (b).'], [sh.L * sh.W * sh.pl, 'u1l6-per-day', 'Use the litres for a whole week (from (a)), not for one day.']],
            sol: t(sh.W + '\\times ' + N(Lw) + '=' + N(tot)) + ' L<br>' + t(N(tot) + '\\times ' + D(sh.pl) + '=' + (same(ex, ans) ? D(ans) : N(q(ex)) + '\\approx ' + D(ans))) + (Number.isInteger(q(tot / sh.J)) ? '<br>(Check: ' + t(N(tot) + '\\div ' + sh.J + '=' + N(q(tot / sh.J))) + ' jugs, ' + t(N(q(tot / sh.J)) + '\\times ' + D(sh.P) + '=' + D(q(tot / sh.J * sh.P))) + '.)' : ''), hints: ['Find the litres for ' + sh.W + ' weeks.', 'Multiply by the price per litre.'], text: 'milk budget' }); } }] },
      { num: '14', stem: '', parts: [
        { id: '14a', level: 'EMG', make: function (r) {
          var v = find(function () { return { rr: r.int(49, 78) * 20 / 100, a: r.pick([2.5, 3, 3.5, 4]), b: r.pick([3, 4, 4.5, 5]), who: r.pick(['Jordan', 'Priya', 'Mason']) }; }, function (v) { return v.a !== v.b; }, { rr: 12.4, a: 3, b: 4.5, who: 'Jordan' });
          var A = q(v.a * v.b), ex = A * v.rr, ans = rd(ex, 2);
          return num('Rubber gym flooring costs ' + Dp(v.rr) + ' per m². ' + v.who + '’s garage gym is ' + N(v.a) + ' m by ' + N(v.b) + ' m. How much will the flooring cost?', ans, { money: true, exact: ex,
            bad: [[2 * (v.a + v.b) * v.rr, 'u1l6-perimeter', 'That uses the perimeter (the distance around). Flooring covers the <b>area</b>: length × width.'], [(v.a + v.b) * v.rr, 'u1l6-perimeter', 'Area = length <b>×</b> width, not length + width.'], [A, 'u1l6-one-item', 'That’s the area. Multiply it by the price per m².']],
            sol: 'Area: ' + t(N(v.a) + '\\times ' + N(v.b) + '=' + N(A) + '\\text{ m}^2') + '<br>Cost: ' + t(N(A) + '\\times ' + D(v.rr) + '=' + D(ans)), hints: ['Find the area: length × width.', 'Multiply the area by the price per m².'], text: 'flooring' });
        } },
        { id: '14b', level: 'PRG', make: function (r) {
          var v = find(function () { var s = r.pick([[1.2, 2.4, 'A sheet of plywood'], [0.6, 2.4, 'A half sheet of plywood'], [1.2, 2.4, 'A sheet of drywall']]); return { a: s[0], b: s[1], what: s[2], rr: r.int(36, 96) / 4 }; }, function (v) { return decs(q(v.a * v.b * v.rr)) <= 2 && !(v.what === 'A box of laminate'); }, { a: 1.2, b: 2.4, what: 'A sheet of plywood', rr: 16 });
          var A = q(v.a * v.b), C = q(A * v.rr);
          return upPart(v.what + ' is ' + N(v.a) + ' m by ' + N(v.b) + ' m and costs ' + Dp(C) + '. Find the price per m².', v.rr, { after: ' per m²',
            bad: [[C / (v.a + v.b), 'u1l6-perimeter', 'Divide by the <b>area</b> (length × width), not length + width.'], [C / (2 * (v.a + v.b)), 'u1l6-perimeter', 'Divide by the area, not the perimeter.'], [C * A, 'u1l6-multiplied', 'Divide the price by the area.'], [A / C, 'u1l6-wrong-way', 'Divide the <b>price</b> by the area.'], [C / v.b, 'u1l6-no-convert', 'Divide by the whole area: ' + t(N(v.a) + '\\times ' + N(v.b) + '=' + N(A)) + ' m².']],
            sol: 'Area: ' + t(N(v.a) + '\\times ' + N(v.b) + '=' + N(A) + '\\text{ m}^2') + '<br>' + t(D(C) + '\\div ' + N(A) + '=' + D(v.rr)) + ' per m²', hints: ['Find the area first.', 'Price per m² = price ÷ area.'], text: 'per m2' });
        } }] },
      { num: '15', stem: function (sh) { return cap(an(sh.g1)) + ' ' + sh.g1 + ' g jar of ' + sh.what + ' costs ' + Dp(sh.P1) + '. The store also sells ' + an(sh.g2) + ' ' + sh.g2 + ' g jar.'; },
        shared: function (r) { return find(function () { var g1 = r.pick([300, 400, 500]), uu = r.int(14, 30) * 5 / 100, g2 = r.pick([650, 750, 850, 900]), mx = g2 / 100 * uu, P2 = q(mx + (r.chance(0.5) ? -1 : 1) * r.int(4, 30) / 100); return { what: r.pick(['salsa', 'peanut butter', 'honey']), g1: g1, u: uu, P1: q(g1 / 100 * uu), g2: g2, max: q(mx), P2: P2 }; }, function (s) { return decs(s.max) <= 2 && decs(s.P1) <= 2 && !same(s.P2, s.max); }, { what: 'salsa', g1: 400, u: 0.9, P1: 3.6, g2: 650, max: 5.85, P2: 5.79 }); },
        parts: [
          { id: '15a', level: 'MAS', make: function (r, sh) { return num('What is the highest price the ' + sh.g2 + ' g jar can have and still not cost more per 100 g than the ' + sh.g1 + ' g jar?', sh.max, { money: true,
            bad: [[sh.u, 'u1l6-one-item', 'That’s the price per 100 g of the small jar. The big jar has ' + N(sh.g2 / 100) + ' groups of 100 g.'], [sh.P1 / sh.g1 * sh.g2 / 10, 'u1l6-no-convert', sh.g2 + ' g is ' + N(sh.g2 / 100) + ' groups of <b>100</b> g.'], [sh.P1 * sh.g2 / 100, 'u1l6-box-cost', Dp(sh.P1) + ' is for ' + sh.g1 + ' g, not 100 g. Find the price per 100 g first.'], [sh.P1 + (sh.g2 - sh.g1) / 100, 'u1l6-added', 'Find the price per 100 g of the small jar, then multiply by the ' + N(sh.g2 / 100) + ' hundreds in the big jar.']],
            sol: sh.g1 + ' g jar: ' + t(D(sh.P1) + '\\div ' + sh.g1 + '\\times 100=' + D(sh.u)) + ' per 100 g<br>' + sh.g2 + ' g at the same rate: ' + t(N(sh.g2 / 100) + '\\times ' + D(sh.u) + '=' + D(sh.max)) + '<br>The ' + sh.g2 + ' g jar can cost at most ' + t(D(sh.max)) + '. (At ' + Dp(sh.max) + ' both jars cost the same per 100 g.)', hints: ['Find the price per 100 g of the ' + sh.g1 + ' g jar.', 'What would ' + sh.g2 + ' g cost at that same rate?'], text: 'highest price' }); } },
          { id: '15b', level: 'PRG', make: function (r, sh) { var yes = sh.P2 < sh.max, u2 = sh.P2 / sh.g2 * 100;
            return P.mc(r, 'The ' + sh.g2 + ' g jar costs ' + Dp(sh.P2) + '. Is it the better buy?', [
              { html: '<b>Yes</b>, because ' + Dp(sh.P2) + ' is less than the highest price from (a).', right: yes, why: yes ? null : 'Compare ' + Dp(sh.P2) + ' with your answer to (a). Is it more or less?', code: 'yes' },
              { html: '<b>No</b>, because ' + Dp(sh.P2) + ' is more than the highest price from (a).', right: !yes, why: !yes ? null : 'Compare ' + Dp(sh.P2) + ' with your answer to (a). Is it more or less?', code: 'no' },
              { html: '<b>No</b>, because ' + Dp(sh.P2) + ' is more than ' + Dp(sh.P1) + '.', why: 'The big jar holds more, so of course it costs more. Compare the price for the <b>same</b> amount.', code: 'u1l6-total' },
              { html: '<b>Yes</b>, because the bigger jar is always the better buy.', why: 'Bigger is not always cheaper per 100 g. Compare with your answer to (a).', code: 'u1l6-bigger' }],
              (yes ? '<b>Yes.</b> ' + Dp(sh.P2) + ' is less than ' + Dp(sh.max) + '.' : '<b>No.</b> ' + Dp(sh.P2) + ' is more than ' + Dp(sh.max) + '.') + ' (Its unit price is ' + t(D(sh.P2) + '\\div ' + sh.g2 + '\\times 100\\approx ' + D(u2, 3)) + ' per 100 g, ' + (yes ? 'less' : 'more') + ' than ' + t(D(sh.u)) + '.)', ['Compare the price with your answer to (a).'], 'salsa better', true);
          } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) {
          var v = find(function () { return { n: r.pick([4, 6, 8]), up: r.int(65, 135) / 100, what: r.pick(['muffins', 'bagels', 'cinnamon buns']) }; }, function (v) { var P0 = q(v.n * v.up), a = [v.up, rd(v.n / P0, 2), q(v.n * P0), rd(P0 / 10, 2)]; return a.every(function (x, i) { return a.indexOf(x) === i; }) && !(v.what === 'bagels' && v.n === 6); }, { n: 6, up: 0.89, what: 'muffins' });
          var P0 = q(v.n * v.up);
          return P.mc(r, 'A pack of ' + v.n + ' ' + v.what + ' costs ' + Dp(P0) + '. The price of one is', [
            { html: Dp(v.up), right: true },
            { html: Dp(rd(v.n / P0, 2)), why: 'That divides the wrong way (' + t(v.n + '\\div ' + P0.toFixed(2)) + '). Divide the price by the number in the pack.', code: 'u1l6-wrong-way' },
            { html: Dp(v.n * P0), why: 'One costs less than the pack, so divide, don’t multiply.', code: 'u1l6-multiplied' },
            { html: Dp(rd(P0 / 10, 2)), why: 'There are ' + v.n + ' in the pack, so divide by ' + v.n + ', not 10.', code: 'div10' }],
            t(D(P0) + '\\div ' + v.n + '=' + D(v.up)), ['Price of one = pack price ÷ number in the pack.'], 'MC one muffin');
        } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var sizes = [250, 500, 1000, 2000];
          var v = find(function () { var base = r.int(70, 90) / 100, f = [1, 0.95, 0.97, 0.98].map(function (x) { return x * (1 + (r.int(-3, 3) / 100)); }); var Pp = sizes.map(function (s, i) { return p9(s / 100 * base * f[i]); }); return { P: Pp, up: Pp.map(function (p, i) { return p / sizes[i] * 100; }) }; }, function (v) { return apart(v.up, 0.004) && argmin(v.up) !== 3 && argmin(v.up) !== 0; }, { P: [1.99, 3.79, 7.89, 15.49], up: [0.796, 0.758, 0.789, 0.7745] });
          var b = argmin(v.up);
          return P.mc(r, 'Which size of juice is the best buy?', sizes.map(function (s, i) { return { html: vol(s) + ' for ' + Dp(v.P[i]), right: i === b, why: i === b ? null : 'Find the price per 100 mL of each size. ' + vol(s) + ': ' + t(D(v.P[i]) + '\\div ' + s + '\\times 100\\approx ' + D(v.up[i], 3)) + ' — not the lowest.' + (i === 3 ? ' The biggest isn’t always the cheapest per 100 mL.' : ''), code: 'size' + i }; }),
            'Per 100 mL: ' + sizes.map(function (s, i) { return vol(s) + ' ' + t(D(v.up[i], 3)); }).join(', ') + '.<br>The <b>' + vol(sizes[b]) + '</b> size is the best buy.', ['Find the price per 100 mL of each size (1 L = 1000 mL).'], 'MC juice', true);
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var v = find(function () { return { up: r.int(35, 95) / 100, kg: r.pick([0.75, 1.2, 1.5, 2, 2.5]) }; }, function (v) { return v.up * v.kg * 10 < 10; }, { up: 0.63, kg: 1.5 });
          var g = v.kg * 1000, n = g / 100, ex = n * v.up, ans = rd(ex, 2);
          var p = num('Large-flake oats cost ' + Dp(v.up) + ' per 100 g. The cost of ' + N(v.kg) + ' kg of oats, to the nearest cent, is $________.', ans, { money: true, exact: ex,
            bad: [[v.kg * v.up, 'u1l6-no-convert', N(v.kg) + ' kg is ' + N(g) + ' g, which is ' + N(n) + ' groups of 100 g — not ' + N(v.kg) + '.'], [g * v.up, 'u1l6-per100', 'The price is per <b>100 g</b>. ' + N(g) + ' g is ' + N(n) + ' groups of 100 g.'], [v.kg * 100 * v.up, 'u1l6-no-convert', '1 kg = 1000 g, so ' + N(v.kg) + ' kg = ' + N(g) + ' g = ' + N(n) + ' hundreds.']],
            sol: t(N(v.kg) + '\\text{ kg}=' + N(g) + '\\text{ g}=' + N(n)) + ' hundreds<br>' + t(N(n) + '\\times ' + D(v.up) + '=' + (same(ex, ans) ? D(ans) : N(q(ex)) + '\\approx ' + D(ans))), hints: ['Change kg to g, then count the groups of 100 g.'], text: 'NR oats' });
          p.input.nr = true; p.input.before = null; return p;
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find each unit price. Round to the nearest cent.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var n = r.pick([3, 4, 5, 6]), up = r.pick([2.49, 2.79, 2.99, 3.25, 3.49]); return unitPricePart(n + ' pairs of socks for ' + Dp(n * up), q(n * up), n, 'pair'); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var w = r.pick([2, 4, 5, 10]), up = r.int(119, 289) / 100; return unitPricePart(an(w) + ' ' + w + ' kg bag of flour for ' + Dp(w * up), q(w * up), w, 'kg'); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([12, 24, 30, 35]), p9(r.int(35, 90) / 10)]; }, function (v) { var c = v[1] / v[0] * 100; return Math.abs(c - Math.floor(c) - 0.5) > 0.02 && !same(rd(v[1] / v[0], 2), v[1] / v[0]); }, [24, 4.97]); return unitPricePart(v[0] + ' bottles of water for ' + Dp(v[1]), v[1], v[0], 'bottle'); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([12, 18, 30]), p9(r.int(40, 120) / 10)]; }, function (v) { var c = v[1] / v[0] * 100; return Math.abs(c - Math.floor(c) - 0.5) > 0.02 && !same(rd(v[1] / v[0], 2), v[1] / v[0]); }, [18, 6.29]); return unitPricePart(v[0] + ' eggs for ' + Dp(v[1]), v[1], v[0], 'egg'); } }] },
      { num: '2', stem: function (sh) { return cap(an(sh.g[0])) + ' ' + sh.g[0] + ' g bag of chips costs ' + Dp(sh.P[0]) + '. ' + cap(an(sh.g[1])) + ' ' + sh.g[1] + ' g bag of the same chips costs ' + Dp(sh.P[1]) + '.'; },
        shared: function (r) { return find(function () { var g = [r.pick([150, 200, 235]), r.pick([280, 300, 350, 400])], u1 = r.int(110, 170) / 100, u2 = u1 * (r.chance(0.7) ? 1 - r.int(3, 9) / 100 : 1 + r.int(3, 8) / 100), Pp = [p9(g[0] / 100 * u1), p9(g[1] / 100 * u2)]; return { g: g, P: Pp, up: [Pp[0] / g[0] * 100, Pp[1] / g[1] * 100] }; }, function (s) { return Math.abs(s.up[0] - s.up[1]) >= 0.01 && s.P[1] > s.P[0]; }, { g: [200, 280], P: [2.99, 3.99], up: [1.495, 3.99 / 2.8] }); },
        parts: [
          { id: 'e2a', level: 'EMG', make: function (r, sh) { return boxes('Find the price per 100 g of each bag.', [0, 1].map(function (i) { return { label: sh.g[i] + ' g:', name: sh.g[i] + ' g', exact: sh.up[i], kind: 'up', after: ' per 100 g', bad: per100Bad(sh.P[i], sh.g[i], 'g') }; }), [0, 1].map(function (i) { return sh.g[i] + ' g: ' + per100Sol(sh.P[i], sh.g[i], 'g'); }).join('<br>'), ['Price per 100 g = price ÷ grams × 100.'], 'chips per 100 g'); } },
          { id: 'e2b', level: 'EMG', make: function (r, sh) { var k = argmin(sh.up); return betterMC(r, 'Which bag is the better buy?', [0, 1].map(function (i) { return { name: 'The ' + sh.g[i] + ' g bag', up: sh.up[i], total: sh.P[i], size: sh.g[i] }; }), 'The <b>' + sh.g[k] + ' g bag</b> has the lower price per 100 g (' + t(D(sh.up[k], 3)) + ').', null, 'better chips'); } }] },
      { num: '3', stem: function (sh) { var a = sh.a, b = sh.b; return 'Change to the same unit, then decide which is the better buy.<br>(a) orange juice: ' + a.m[0] + ' mL for ' + Dp(a.P[0]) + ', or ' + vol(a.m[1]) + ' for ' + Dp(a.P[1]) + '<br>(b) ' + b.what + ': ' + Dp(b.d) + ' per 100 g at the deli, or ' + an(b.g) + ' ' + b.g + ' g block for ' + Dp(b.blk); },
        shared: function (r) {
          var a = find(function () { var m1 = r.pick([750, 900, 946]), L2 = r.pick([1.75, 2, 2.5]), u1 = r.int(30, 45) / 100, u2 = u1 * (r.chance(0.65) ? 1 - r.int(3, 10) / 100 : 1 + r.int(3, 8) / 100), Pp = [p9(m1 / 100 * u1), p9(L2 * 10 * u2)]; return { m: [m1, L2 * 1000], P: Pp, up: [Pp[0] / m1 * 100, Pp[1] / (L2 * 10)] }; }, function (v) { return Math.abs(v.up[0] - v.up[1]) >= 0.006; }, { m: [900, 2000], P: [3.29, 6.99], up: [3.29 / 9, 0.3495] });
          var b = find(function () { var d = r.int(159, 229) / 100, g = r.pick([300, 400, 450, 600]), blk = p9(g / 100 * d * (r.chance(0.6) ? 1 - r.int(2, 8) / 100 : 1 + r.int(3, 8) / 100)); return { what: r.pick(['cheddar', 'mozzarella', 'Swiss cheese']), d: d, g: g, blk: blk, bu: blk / g * 100 }; }, function (v) { return Math.abs(v.bu - v.d) >= 0.01; }, { what: 'cheddar', d: 1.85, g: 400, blk: 7.29, bu: 1.8225 });
          return { a: a, b: b };
        },
        parts: [
          { id: 'e3ai', sub: 'a i', level: 'PRG', make: function (r, sh) { var a = sh.a; return boxes('(a) Find the price per 100 mL of each size.', [0, 1].map(function (i) { return { label: vol(a.m[i]) + ':', name: vol(a.m[i]), exact: a.up[i], kind: 'up', after: ' per 100 mL', bad: per100Bad(a.P[i], a.m[i], 'mL').concat(a.m[i] >= 1000 ? [[a.P[i] / (a.m[i] / 1000) * 100, 'u1l6-no-convert', 'Change ' + vol(a.m[i]) + ' to millilitres first: ' + a.m[i] + ' mL.'], [a.P[i] / (a.m[i] / 1000), 'u1l6-per-kg', 'That’s the price per <b>litre</b>. Divide by 10 to get the price per 100 mL.']] : []) }; }), vol(a.m[1]) + ' = ' + a.m[1] + ' mL<br>' + [0, 1].map(function (i) { return vol(a.m[i]) + ': ' + per100Sol(a.P[i], a.m[i], 'mL'); }).join('<br>'), ['1 L = 1000 mL.', 'Price per 100 mL = price ÷ mL × 100.'], 'OJ per 100 mL'); } },
          { id: 'e3aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var a = sh.a, k = argmin(a.up); return betterMC(r, '(a) Which orange juice is the better buy?', [0, 1].map(function (i) { return { name: 'The ' + vol(a.m[i]) + ' size', up: a.up[i], total: a.P[i], size: a.m[i] }; }), 'The <b>' + vol(a.m[k]) + '</b> size has the lower price per 100 mL.', null, 'better OJ'); } },
          { id: 'e3bi', sub: 'b i', level: 'EMG', make: function (r, sh) { var b = sh.b; return upPart('(b) Find the price per 100 g of the ' + b.g + ' g block.', b.bu, { after: ' per 100 g', bad: per100Bad(b.blk, b.g, 'g'), sol: per100Sol(b.blk, b.g, 'g'), hints: ['Price per 100 g = price ÷ grams × 100.'], text: 'block per 100 g' }); } },
          { id: 'e3bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { var b = sh.b, blkBetter = b.bu < b.d; return betterMC(r, '(b) Which ' + b.what + ' is the better buy?', [{ name: 'The ' + b.g + ' g block', up: b.bu, total: b.blk, size: b.g }, { name: cap(b.what) + ' from the deli', up: b.d, total: b.d, size: 100, loose: true }], 'Block: ' + t(D(b.bu, 3)) + ' per 100 g. Deli: ' + t(D(b.d)) + ' per 100 g.<br>The <b>' + (blkBetter ? 'block' : 'deli ' + b.what) + '</b> is the better buy.', null, 'block or deli', { packWord: 'a block', looseWord: 'at the deli' }); } }] },
      { num: '4', stem: function (sh) { return 'A jar of pasta sauce costs ' + Dp(sh.s) + '. The sign says “' + sh.k + ' for ' + Dp(sh.D) + '”.'; },
        shared: function (r) { return find(function () { var k = r.pick([2, 3]), s = p9(r.int(30, 45) / 10), D0 = r.pick([6, 6.5, 7, 7.5, 8, 9, 10]); return { k: k, s: s, D: D0, m: k * r.int(2, 4) }; }, function (v) { var d = v.D / v.k; return v.s - d >= 0.1 && v.s - d <= 0.6 && decs(q(d)) <= 2; }, { k: 2, s: 3.79, D: 7, m: 6 }); },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) { return unitPricePart('What is the price of one jar with the deal?', sh.D, sh.k, 'jar'); } },
          { id: 'e4b', level: 'EMG', make: function (r, sh) { var reg = q(sh.m * sh.s), deal = q(sh.m / sh.k * sh.D), ans = q(reg - deal); return num('How much do you save on ' + sh.m + ' jars with the deal?', ans, { money: true, bad: [[reg, 'u1l6-regular-total', 'That’s the regular price of ' + sh.m + ' jars. Subtract the deal price.'], [deal, 'u1l6-regular-total', 'That’s the deal price of ' + sh.m + ' jars. Subtract it from the regular price.'], [sh.s - sh.D / sh.k, 'u1l6-one-item', 'That’s the saving on one jar. You buy ' + sh.m + '.']], sol: 'Regular: ' + t(sh.m + '\\times ' + D(sh.s) + '=' + D(reg)) + '; deal: ' + t((sh.m / sh.k) + '\\times ' + D(sh.D) + '=' + D(deal)) + '<br>Save ' + t(D(reg) + '-' + D(deal) + '=' + D(ans)), hints: ['Find the regular cost and the deal cost of ' + sh.m + ' jars.'], text: 'sauce save' }); } }] },
      { num: '5', stem: '', parts: [
        { id: 'e5', level: 'PRG', make: function (r) {
          var up = r.int(55, 99) * 2 / 100 + r.pick([0, 0.04]), am = [r.pick([25, 75]), r.pick([200, 300]), r.pick([450, 650]), r.pick([1000, 1500])], what = r.pick(['Bulk candy costs', 'Bulk jelly beans cost', 'Bulk chocolate chips cost']);
          up = q(up);
          return boxes(what + ' ' + Dp(up) + ' per 100 g. Complete the price chart (to the nearest cent).', am.map(function (g) { var ex = g / 100 * up; return { label: mass(g) + ':', name: mass(g), exact: ex, kind: 'money', bad: [[g * up, 'u1l6-per100', 'The price is per <b>100 g</b>. ' + mass(g) + ' is ' + N(g / 100) + ' groups of 100 g.'], [up * (g >= 1000 ? g / 1000 : g / 10), 'u1l6-no-convert', g >= 1000 ? N(g / 1000) + ' kg = ' + g + ' g = ' + N(g / 100) + ' groups of 100 g.' : 'Divide the grams by 100: ' + g + ' g is ' + N(g / 100) + ' groups of 100 g.']] }; }),
            am.map(function (g) { var ex = g / 100 * up; return mass(g) + ': ' + t(N(g / 100) + '\\times ' + D(up) + '=' + (same(ex, rd(ex, 2)) ? D(ex) : N(q(ex)) + '\\approx ' + D(rd(ex, 2)))); }).join('<br>'), ['How many groups of 100 g are in each amount?', 'Multiply by the price per 100 g.'], 'candy chart');
        } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A phone repair shop buys a pack of ' + sh.n + ' screen protectors for ' + Dp(sh.C) + '. It sells them for ' + Dp(sh.S) + ' each.'; },
        shared: function (r) { return find(function () { var n = r.pick([10, 20, 25, 40]), c = r.int(30, 90) * 5 / 100; return { n: n, c: c, C: q(n * c), S: r.pick([9.99, 12.99, 14.99, 19.99]), k: r.int(8, 18) }; }, function (s) { return s.k < s.n; }, { n: 20, c: 1.8, C: 36, S: 14.99, k: 15 }); },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) { var pr = q(sh.S - sh.c); return num('What is the shop’s profit on one screen protector?', pr, { money: true, bad: [[sh.c, 'u1l6-one-item', 'That’s what one costs the shop. Profit = selling price − cost.'], [sh.S - sh.C, 'u1l6-box-cost', 'Use the cost of <b>one</b> protector: ' + t(D(sh.C) + '\\div ' + sh.n) + '.'], [sh.S + sh.c, 'u1l6-added', 'Profit = selling price <b>minus</b> cost.']], sol: 'Cost: ' + t(D(sh.C) + '\\div ' + sh.n + '=' + D(sh.c)) + '<br>Profit: ' + t(D(sh.S) + '-' + D(sh.c) + '=' + D(pr)), hints: ['Find what one costs the shop.', 'Profit = selling price − cost.'], text: 'protector profit' }); } },
          { id: 'e6b', level: 'EMG', make: function (r, sh) { var pr = q(sh.S - sh.c), ans = q(sh.k * pr); return num('What is the profit if the shop sells ' + sh.k + ' of them?', ans, { money: true, bad: [[sh.k * sh.S, 'u1l6-revenue', 'That’s the money taken in. Use the profit on one from (a).'], [sh.k * sh.S - sh.C, 'u1l6-box-cost', 'The shop only sold ' + sh.k + ', so use the profit on one from (a) × ' + sh.k + '.']], sol: t(sh.k + '\\times ' + D(pr) + '=' + D(ans)), hints: ['Profit on one × number sold.'], text: 'protector profit k' }); } }] },
      { num: '7', stem: function (sh) { return 'The school drama club is ordering T-shirts online. Site A sells ' + sh.n[0] + ' shirts for ' + Dp(sh.P[0]) + ' plus ' + Dp(sh.d) + ' shipping. Site B sells ' + sh.n[1] + ' shirts for ' + Dp(sh.P[1]) + ' with free shipping.'; },
        shared: function (r) { return find(function () { var n = [r.pick([10, 15, 20]), r.pick([25, 30])], b = [r.int(26, 36) * 25 / 100, r.int(28, 38) * 25 / 100], d = r.pick([10, 12.5, 15, 20]); var Pp = [q(n[0] * b[0]), q(n[1] * b[1])]; return { n: n, b: b, d: d, P: Pp, up: [(Pp[0] + d) / n[0], Pp[1] / n[1]] }; }, function (s) { return Math.abs(s.up[0] - s.up[1]) >= 0.1 && decs(q(s.up[0])) <= 2 && decs(q(s.up[1])) <= 2; }, { n: [15, 25], b: [7.5, 7.8], d: 15, P: [112.5, 195], up: [8.5, 7.8] }); },
        parts: [
          { id: 'e7a', level: 'PRG', make: function (r, sh) { return boxes('Find the price per shirt at each site (include the shipping).', [0, 1].map(function (i) { var nm = 'Site ' + 'AB'.charAt(i); return { label: nm + ':', name: nm, exact: sh.up[i], kind: 'up', after: ' per shirt', bad: (i === 0 ? [[sh.b[0], 'u1l6-no-delivery', 'Add the ' + Dp(sh.d) + ' shipping to the price <b>before</b> you divide.'], [sh.b[0] + sh.d, 'u1l6-delivery-each', 'The shipping is paid once for the order. Add it, then divide.']] : []).concat([[sh.n[i] / (sh.P[i] + (i ? 0 : sh.d)), 'u1l6-wrong-way', 'Divide the <b>price</b> by the number of shirts.']]) }; }), 'A: ' + t(D(sh.P[0]) + '+' + D(sh.d) + '=' + D(sh.P[0] + sh.d)) + '; ' + t(D(sh.P[0] + sh.d) + '\\div ' + sh.n[0] + '=' + D(sh.up[0])) + ' per shirt<br>B: ' + t(D(sh.P[1]) + '\\div ' + sh.n[1] + '=' + D(sh.up[1])) + ' per shirt', ['Add the shipping to Site A’s price first.', 'Divide by the number of shirts.'], 'shirts per shirt'); } },
          { id: 'e7b', level: 'EMG', make: function (r, sh) { var b = argmin(sh.up), d = q(Math.abs(sh.up[0] - sh.up[1])), L = 'AB', d0 = q(Math.abs(sh.b[0] - sh.b[1]));
            var opts = [{ html: 'Site ' + L.charAt(b) + ', by ' + Dp(d) + ' per shirt', right: true }, { html: 'Site ' + L.charAt(1 - b) + ', by ' + Dp(d) + ' per shirt', why: 'Check your prices per shirt from (a): which is lower?', code: 'u1l6-higher-up' }];
            if (!same(d0, d) && d0 > 0) opts.push({ html: 'Site ' + L.charAt(argmin(sh.b)) + ', by ' + Dp(d0) + ' per shirt', why: 'That leaves out Site A’s shipping. Use the prices from (a).', code: 'u1l6-no-delivery' });
            opts.push({ html: 'Site ' + L.charAt(argmin(sh.P)) + ', by ' + Dp(Math.abs(sh.P[0] - sh.P[1])), why: 'The sites sell different numbers of shirts, so compare the price <b>per shirt</b>.', code: 'u1l6-total' });
            return P.mc(r, 'Which site has the lower price per shirt, and by how much?', opts, 'Site ' + L.charAt(b) + ' is lower, by ' + t(D(Math.max(sh.up[0], sh.up[1])) + '-' + D(Math.min(sh.up[0], sh.up[1])) + '=' + D(d)) + ' per shirt.', ['Use your answers to (a).'], 'better site'); } }] },
      { num: '8', stem: function (sh) { return 'A hockey team uses ' + sh.a + ' rolls of tape at each practice and has ' + sh.b + ' practices a week. A box of ' + sh.n + ' rolls costs ' + Dp(sh.P) + '.'; },
        shared: function (r) { return find(function () { var n = r.pick([6, 10, 12, 24]), up = r.pick([1.99, 2.29, 2.49, 2.79, 2.99]); return { a: r.int(2, 4), b: r.int(2, 4), n: n, up: up, P: q(n * up), W: r.pick([8, 10, 12, 16]) }; }, function (s) { return true; }, { a: 3, b: 4, n: 12, up: 2.49, P: 29.88, W: 10 }); },
        parts: [
          { id: 'e8a', level: 'BEG', make: function (r, sh) { var ans = sh.a * sh.b; return num('How many rolls does the team use in a week?', ans, { after: 'rolls', bad: [[sh.a + sh.b, 'u1l6-added', sh.a + ' rolls at <b>each</b> of ' + sh.b + ' practices: multiply.']], sol: t(sh.a + '\\times ' + sh.b + '=' + ans) + ' rolls', hints: ['Rolls per practice × practices per week.'], text: 'rolls per week' }); } },
          { id: 'e8b', level: 'BEG', make: function (r, sh) { return unitPricePart('What is the price of one roll?', sh.P, sh.n, 'roll'); } },
          { id: 'e8c', level: 'EMG', make: function (r, sh) { var rolls = sh.a * sh.b * sh.W, ans = q(rolls * sh.up); return num('How much should the team budget for tape for ' + an(sh.W) + ' ' + sh.W + '-week season?', ans, { money: true, bad: [[sh.a * sh.b * sh.up, 'u1l6-per-week', 'That’s one week. Budget for ' + sh.W + ' weeks.'], [sh.W * sh.P, 'u1l6-box-cost', 'The team uses ' + (sh.a * sh.b) + ' rolls a week, not one box of ' + sh.n + '. Find the rolls for the season first.'], [sh.a * sh.W * sh.up, 'u1l6-per-day', 'Use the rolls for a whole week (from (a)), not one practice.']], sol: t(sh.W + '\\times ' + (sh.a * sh.b) + '=' + rolls) + ' rolls<br>' + t(rolls + '\\times ' + D(sh.up) + '=' + D(ans)), hints: ['Find the number of rolls for the season.', 'Multiply by the price of one roll.'], text: 'tape budget' }); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'EMG', make: function (r) {
          var v = find(function () { return { rr: r.int(70, 110) * 50 / 100, a: r.pick([1.8, 2.4, 3, 3.6]), b: r.pick([0.4, 0.5, 0.6]) }; }, function (v) { return true; }, { rr: 45.5, a: 2.4, b: 0.5 });
          var A = q(v.a * v.b), ex = A * v.rr, ans = rd(ex, 2);
          return num('Tile for a kitchen backsplash costs ' + Dp(v.rr) + ' per m². The backsplash is ' + N(v.a) + ' m long and ' + N(v.b) + ' m high. How much will the tile cost?', ans, { money: true, exact: ex, bad: [[(v.a + v.b) * v.rr, 'u1l6-perimeter', 'Area = length <b>×</b> height, not length + height.'], [2 * (v.a + v.b) * v.rr, 'u1l6-perimeter', 'Tile covers the area (length × height), not the perimeter.'], [A, 'u1l6-one-item', 'That’s the area. Multiply it by the price per m².']], sol: 'Area: ' + t(N(v.a) + '\\times ' + N(v.b) + '=' + N(A) + '\\text{ m}^2') + '<br>Cost: ' + t(N(A) + '\\times ' + D(v.rr) + '=' + (same(ex, ans) ? D(ans) : N(q(ex)) + '\\approx ' + D(ans))), hints: ['Find the area first.'], text: 'backsplash' });
        } }] },
      { num: '10', stem: function (sh) { return 'Leah wants to paint one small bathroom door. She needs about 0.8 L of paint. A 3.78 L can costs ' + Dp(sh.P[0]) + ' and a 946 mL can costs ' + Dp(sh.P[1]) + '.'; },
        shared: function (r) { return find(function () { return { P: [r.pick([49.99, 54.99, 59.99, 64.99]), r.pick([17.99, 19.99, 21.99, 24.99])] }; }, function (s) { return s.P[0] / 3.78 < s.P[1] / 0.946; }, { P: [54.99, 19.99] }); },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) { var up = [sh.P[0] / 3.78, sh.P[1] / 0.946]; return boxes('Find the price per litre of each can.', [{ label: '3.78 L can:', name: '3.78 L', exact: up[0], kind: 'up', after: ' per L', bad: [[3.78 / sh.P[0], 'u1l6-wrong-way', 'Divide the <b>price</b> by the litres.']] }, { label: '946 mL can:', name: '946 mL', exact: up[1], kind: 'up', after: ' per L', bad: [[sh.P[1] / 946, 'u1l6-no-convert', 'That’s the price per <b>mL</b>. Change 946 mL to litres first: 946 ÷ 1000 = 0.946 L.'], [sh.P[1] / 946 * 100, 'u1l6-per-g', 'That’s the price per 100 mL. Change 946 mL to 0.946 L and find the price per litre.'], [0.946 / sh.P[1], 'u1l6-wrong-way', 'Divide the <b>price</b> by the litres.']] }],
            '3.78 L: ' + t(D(sh.P[0]) + '\\div 3.78\\approx ' + D(up[0])) + ' per L<br>946 mL = 0.946 L: ' + t(D(sh.P[1]) + '\\div 0.946\\approx ' + D(up[1])) + ' per L', ['Change 946 mL to litres: 946 ÷ 1000.', 'Price per litre = price ÷ litres.'], 'paint per L'); } },
          { id: 'e10b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Which can should Leah buy? Choose the best reason that is <b>not</b> the unit price.', [
              { html: '<b>The 946 mL can</b>: it is enough for the door, it costs ' + Dp(sh.P[0] - sh.P[1]) + ' less today, and she won’t have almost 3 L of leftover paint to store.', right: true },
              { html: '<b>The 3.78 L can</b>: its price per litre is lower.', why: 'That’s a unit-price reason, and Leah only needs 0.8 L. Think about what she actually needs.', code: 'up' },
              { html: '<b>The 3.78 L can</b>: she gets more paint for her money.', why: 'She only needs about 0.8 L. The extra paint would be wasted or have to be stored.', code: 'more' },
              { html: '<b>The 946 mL can</b>: its price per litre is lower.', why: 'Its price per litre is <b>higher</b> — check (a). The reason to choose it is something else.', code: 'false' }],
              'The 946 mL can. It is enough for one door, it costs ' + Dp(sh.P[0] - sh.P[1]) + ' less today, and she won’t have almost 3 L of leftover paint to store (or let dry out).', ['How much paint does Leah actually need?'], 'paint choice');
          } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var sizes = [1.47, 2.95, 4.43, 5.9];
          var v = find(function () { var base = r.int(48, 60) / 10, f = [1.07, 1, 1.02, 1.05].map(function (x) { return x * (1 + r.int(-2, 2) / 100); }); var Pp = sizes.map(function (s, i) { return p9(s * base * f[i]); }); return { P: Pp, up: Pp.map(function (p, i) { return p / sizes[i]; }) }; }, function (v) { return apart(v.up, 0.03) && argmin(v.up) !== 3 && argmin(v.up) !== 0; }, { P: [7.97, 14.97, 22.97, 31.47], up: [5.422, 5.075, 5.185, 5.334] });
          var b = argmin(v.up);
          return P.mc(r, 'Which jug of laundry detergent is the best buy?', sizes.map(function (s, i) { return { html: N(s) + ' L for ' + Dp(v.P[i]), right: i === b, why: i === b ? null : N(s) + ' L: ' + t(D(v.P[i]) + '\\div ' + N(s) + '\\approx ' + D(v.up[i], 3)) + ' per L — not the lowest.' + (i === 3 ? ' The biggest isn’t always the cheapest per litre.' : ''), code: 'size' + i }; }),
            'Per litre: ' + sizes.map(function (s, i) { return N(s) + ' L ' + t(D(v.up[i], 3)); }).join(', ') + '.<br>The <b>' + N(sizes[b]) + ' L</b> jug is the best buy.', ['Find the price per litre of each jug.'], 'MC detergent', true);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'EMG', make: function (r) {
          var v = find(function () { return { w: r.pick([5, 6, 8, 9, 10, 12]), up: r.int(105, 195) / 100, x: r.int(2, 7) }; }, function (v) { return v.x < v.w && v.x * v.up < 10; }, { w: 9, up: 1.55, x: 4 });
          var P0 = q(v.w * v.up), ans = q(v.x * v.up);
          var p = num(cap(an(v.w)) + ' ' + v.w + ' kg bag of cat litter costs ' + Dp(P0) + '. At the same unit price, the cost of ' + v.x + ' kg of litter, to the nearest cent, is $________.', ans, { money: true, bad: [[P0 * v.x, 'u1l6-box-cost', Dp(P0) + ' is for ' + v.w + ' kg. Find the price per kg first.'], [v.w / P0 * v.x, 'u1l6-wrong-way', 'Price per kg = price ÷ kg.'], [P0 / v.x, 'u1l6-divided', 'Find the price per kg (' + t(D(P0) + '\\div ' + v.w) + '), then multiply by ' + v.x + '.']], sol: t(D(P0) + '\\div ' + v.w + '=' + D(v.up)) + ' per kg<br>' + t(v.x + '\\times ' + D(v.up) + '=' + D(ans)), hints: ['Find the price per kg, then multiply.'], text: 'NR litter' });
          p.input.nr = true; p.input.before = null; return p;
        } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return cap(an(sh.m)) + ' ' + sh.m + ' mL bottle of shampoo costs ' + Dp(sh.P) + '.'; },
        shared: function (r) { return find(function () { var m = r.pick([400, 500, 650, 750, 800]), up = r.int(16, 30) * 5 / 100; return { m: m, up: up, P: q(m / 100 * up), big: 10 * up, y: q(10 * up + (r.chance(0.6) ? -1 : 1) * r.pick([0.21, 0.51, 0.71, 0.31])) }; }, function (s) { return decs(s.P) <= 2; }, { m: 650, up: 1.2, P: 7.8, big: 12, y: 11.49 }); },
        parts: [
          { id: 'e13a', level: 'MAS', make: function (r, sh) { return num('What price would a 1 L bottle need to have the same unit price?', sh.big, { money: true, bad: [[sh.up, 'u1l6-one-item', 'That’s the price per 100 mL. 1 L = 1000 mL = 10 groups of 100 mL.'], [sh.P / sh.m * 1000 / 10, 'u1l6-no-convert', '1 L = 1000 mL = <b>10</b> groups of 100 mL.'], [sh.P * 1000 / 100, 'u1l6-box-cost', Dp(sh.P) + ' is for ' + sh.m + ' mL. Find the price per 100 mL first.'], [sh.P + (1000 - sh.m) / 100, 'u1l6-added', 'Find the price per 100 mL, then multiply by 10 (1 L = 10 × 100 mL).']], sol: t(D(sh.P) + '\\div ' + sh.m + '\\times 100=' + D(sh.up)) + ' per 100 mL<br>1 L = 1000 mL = 10 hundreds, so ' + t('10\\times ' + D(sh.up) + '=' + D(sh.big)) + '.', hints: ['Find the price per 100 mL.', '1 L = 1000 mL = 10 groups of 100 mL.'], text: 'shampoo 1 L' }); } },
          { id: 'e13b', level: 'PRG', make: function (r, sh) { var better = sh.y < sh.big;
            return P.mc(r, 'What does that tell you about a 1 L bottle priced at ' + Dp(sh.y) + '?', [
              { html: 'The 1 L bottle is the <b>better</b> buy, because ' + Dp(sh.y) + ' is less than your answer to (a).', right: better, why: better ? null : 'Compare ' + Dp(sh.y) + ' with your answer to (a).', code: 'better' },
              { html: 'The 1 L bottle is the <b>worse</b> buy, because ' + Dp(sh.y) + ' is more than your answer to (a).', right: !better, why: !better ? null : 'Compare ' + Dp(sh.y) + ' with your answer to (a).', code: 'worse' },
              { html: 'The 1 L bottle is the worse buy, because ' + Dp(sh.y) + ' is more than ' + Dp(sh.P) + '.', why: 'The 1 L bottle holds more, so of course it costs more. Compare it with the price that gives the <b>same</b> unit price.', code: 'u1l6-total' }],
              (better ? 'It is the better buy: ' + Dp(sh.y) + ' is less than ' + Dp(sh.big) + '.' : 'It is the worse buy: ' + Dp(sh.y) + ' is more than ' + Dp(sh.big) + '.'), ['Compare with your answer to (a).'], 'shampoo verdict', true);
          } }] },
      { num: '14', stem: function (sh) { return 'Laundry pods come in ' + an(sh.n[0]) + ' ' + sh.n[0] + '-pack for ' + Dp(sh.P[0]) + ' or ' + an(sh.n[1]) + ' ' + sh.n[1] + '-pack for ' + Dp(sh.P[1]) + '. Tess has a coupon for ' + Dp(sh.c) + ' off the ' + sh.n[0] + '-pack.'; },
        shared: function (r) { return find(function () { var n = [r.pick([20, 24, 30]), r.pick([42, 48, 60])], u2 = r.int(30, 40) / 100, u1 = u2 * (1 + r.int(3, 9) / 100), Pp = [p9(n[0] * u1), p9(n[1] * u2)]; return { n: n, P: Pp, c: r.pick([1.5, 2, 2.5, 3]) }; }, function (s) { var a = s.P[0] / s.n[0], b = s.P[1] / s.n[1], c = (s.P[0] - s.c) / s.n[0]; return a - b >= 0.008 && b - c >= 0.008; }, { n: [24, 42], P: [8.99, 14.99], c: 2 }); },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) { var up = [sh.P[0] / sh.n[0], sh.P[1] / sh.n[1]]; return betterMC(r, 'Without the coupon, which pack is the better buy?', [0, 1].map(function (i) { return { name: 'The ' + sh.n[i] + '-pack', up: up[i], total: sh.P[i], size: sh.n[i] }; }), sh.n[0] + '-pack: ' + t(D(sh.P[0]) + '\\div ' + sh.n[0] + '\\approx ' + D(up[0], 3)) + ' per pod<br>' + sh.n[1] + '-pack: ' + t(D(sh.P[1]) + '\\div ' + sh.n[1] + '\\approx ' + D(up[1], 3)) + ' per pod<br>The <b>' + sh.n[1] + '-pack</b> is better.', ['Find the price per pod of each pack.'], 'pods no coupon'); } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) { var c1 = q(sh.P[0] - sh.c), up = [c1 / sh.n[0], sh.P[1] / sh.n[1]]; return upPart('With the coupon, what is the price per pod of the ' + sh.n[0] + '-pack? (Compare it with the ' + sh.n[1] + '-pack: which is the better buy now?)', up[0], { after: ' per pod', bad: [[sh.P[0] / sh.n[0], 'u1l6-no-delivery', 'Take the ' + Dp(sh.c) + ' coupon off the price first.'], [sh.P[0] / sh.n[0] - sh.c, 'u1l6-delivery-each', 'The coupon comes off the whole pack, not off each pod. Subtract it from the pack price, then divide.'], [sh.n[0] / c1, 'u1l6-wrong-way', 'Divide the <b>price</b> by the number of pods.']],
            sol: t(D(sh.P[0]) + '-' + D(sh.c) + '=' + D(c1)) + '<br>' + t(D(c1) + '\\div ' + sh.n[0] + '\\approx ' + D(up[0], 3)) + ' per pod<br>That is less than the ' + sh.n[1] + '-pack (' + t(D(up[1], 3)) + '), so now the <b>' + sh.n[0] + '-pack</b> is the better buy.', hints: ['Take the coupon off the pack price first.', 'Then divide by the number of pods.'], text: 'pods coupon' }); } }] },
      { num: '15', stem: function (sh) { return 'Juice comes in 1 L cartons for ' + Dp(sh.a) + ' and 2 L bottles for ' + Dp(sh.b) + '. Omar needs exactly 3 L for a party.'; },
        shared: function (r) { return find(function () { var a = r.pick([2.49, 2.69, 2.89, 2.99, 3.19]), b = p9(2 * a * (1 - r.int(4, 12) / 100)); return { a: a, b: b }; }, function (s) { return s.b < 2 * s.a - 0.1; }, { a: 2.89, b: 5.49 }); },
        parts: [
          { id: 'e15a', level: 'EMG', make: function (r, sh) { var c3 = q(3 * sh.a), c21 = q(sh.b + sh.a); return boxes('Find the cost of each choice. (Which is cheaper?)', [{ label: 'Three 1 L cartons:', name: 'Three 1 L', exact: c3, kind: 'money', bad: [[sh.a, 'u1l6-one-item', 'That’s one carton. He needs three.']] }, { label: 'One 2 L bottle + one 1 L carton:', name: '2 L + 1 L', exact: c21, kind: 'money', bad: [[sh.b, 'u1l6-one-item', 'Add the 1 L carton too.'], [2 * sh.b, 'u1l6-one-item', 'One 2 L bottle and one 1 L carton.']] }], 'Three 1 L: ' + t('3\\times ' + D(sh.a) + '=' + D(c3)) + '<br>2 L + 1 L: ' + t(D(sh.b) + '+' + D(sh.a) + '=' + D(c21)) + ', which is cheaper.', ['Add up the cost of the cartons and bottles in each choice.'], 'juice choices'); } },
          { id: 'e15bi', sub: 'b i', level: 'PRG', make: function (r, sh) { var two = q(2 * sh.b), c21 = q(sh.b + sh.a), ans = q(two - c21); return num('Two 2 L bottles give 4 L. How much more is that than the cheaper 3 L choice?', ans, { money: true, bad: [[two, 'u1l6-regular-total', 'That’s the cost of two 2 L bottles. Subtract the cheaper 3 L choice.'], [two - 3 * sh.a, 'u1l6-regular-total', 'Compare with the <b>cheaper</b> 3 L choice (2 L + 1 L).']], sol: t('2\\times ' + D(sh.b) + '=' + D(two)) + '<br>' + t(D(two) + '-' + D(c21) + '=' + D(ans)) + ' more, for 1 L more juice.', hints: ['Find the cost of two 2 L bottles.', 'Subtract the cheaper 3 L choice from (a).'], text: 'juice more' }); } },
          { id: 'e15bii', sub: 'b ii', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'Why might Omar still choose two 2 L bottles?', [
              { html: 'He might expect more guests, or want some juice left over (it keeps a few days in the fridge).', right: true },
              { html: 'Two 2 L bottles cost less than the 3 L choice.', why: 'They cost <b>more</b> — see (b) i. Look for a reason that isn’t about price.', code: 'price' },
              { html: 'Bigger bottles always taste better.', why: 'It’s the same juice. Think about how much juice he might need.', code: 'taste' },
              { html: 'Stores don’t sell 1 L cartons.', why: 'The question says they do. Think about how much juice he might need.', code: 'false' }],
              'For example: he might expect more guests, or want leftovers — juice keeps a few days in the fridge.', ['Think about how much juice he might really need.'], 'juice reason');
          } }] }
    ]
  });
})(window);
