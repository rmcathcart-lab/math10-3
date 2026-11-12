/* Math 10-3 · Unit 2 · Lesson 5 — Commission and Salary Plus Commission (N2)
 * Assignment 5 (u2_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u2_ep05.tex, Questions 1–14).
 * NEEDS js/lessons/u1l7.js loaded first (the money / percent kit HW.pctKit).
 * Every part is a generator: the same kind of sales, rate (one-digit, two-digit, 2.5%, 4.25%…), base pay, levels and
 * quota as the booklet item, with new numbers around the booklet's (the booklet's own numbers are among the possible
 * values; the lesson's worked-example numbers are left out). Calculator allowed. Money to the cent ("$12.49", "12.49",
 * "12.490" are right; 12.4 or 12.488 for 12.49 get a nudge, no try used; rounding the wrong way is wrong with a hint).
 * Recognised mistakes get their own hint: the rate not changed to a decimal (× 6 or × 0.6 for 6%), the percent of the
 * base pay instead of the sales, the base pay or the commission left out, the hours left out, the higher level's rate
 * used on all the sales, the first level not subtracted, commission on all the sales when there is a quota, the rate
 * worked upside down (sales ÷ commission), multiplying instead of dividing when working backwards, the salary used
 * instead of the difference in base pay for the break-even point, and so on.
 * Conversions: the rate table and the pay-plan tables → the table input (given cells shown, blanks as boxes); the
 * daily sales table → a table in the prompt with labelled boxes; the graph → an SVG drawn here; "which plan / job
 * and by how much" → a box for the plan's letter and a box for the amount; "explain", "give a reason", "find his
 * mistake" and "which would you suggest" → multiple choice of reasons; "one advantage and one disadvantage" → a
 * table that sorts four statements into advantage / disadvantage, plus a multiple choice for the owner's reason.
 * Outcome N2. Levels: LIM BEG EMG PRG ADV MAS (MAS: Question 11(b) and Extra 14(b)).
 *
 * Exports HW.u2earn, a small kit for the other Unit 2 earnings lessons (u2l6.js uses it; load order = lesson number):
 * money with thin-space thousands (MM, MW), rate decimal / multiplier text, a prompt table, diagnosis lists, a
 * "p% of an amount" money part, a rate-as-a-percent checker, a working-backwards checker, a word-choice checker for
 * "which one" boxes, the advantage / disadvantage sorting table, graduated (tiered) commission, and the pay graph. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = K.P, PK = HW.pctKit;
  if (!PK || !PK.money) throw new Error('u2l5 needs HW.pctKit: load js/lessons/u1l7.js before js/lessons/u2l5.js');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, near = PK.near, pctOf = PK.pctOf, find = PK.find;

  /* ================= the Unit 2 earnings kit (HW.u2earn) ================= */
  var U = HW.u2earn = HW.u2earn || {};
  function grp(s) { // "12680.00" → "12\,680.00" (5 digits or more, as the booklet does)
    var parts = String(s).split('.'), w = parts[0], neg = w.charAt(0) === '-';
    if (neg) w = w.slice(1);
    if (w.length > 4) w = w.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
    return (neg ? '-' : '') + w + (parts.length > 1 ? '.' + parts[1] : '');
  }
  function MM(x) { return '\\$' + grp(m$(x)); }                                       // $12\,680.00
  function MW(x) { return near(x, Math.round(x)) ? '\\$' + grp(String(Math.round(x))) : MM(x); } // $27\,850 (whole dollars)
  function NN(x) { return grp(dS(x)); }
  function eqMM(x) { return near(x, r2(x)) ? '=' + MM(x) : '=\\$' + grp(dS(rnd(x, 6))) + '\\approx ' + MM(x); }
  function pctT(p) { return dS(p) + '\\%'; }
  function decT(p) { var s = dS(p / 100); return /^0\.\d$/.test(s) ? s + '0' : s; }    // 10 → "0.10", 2.5 → "0.025"
  function mulT(p) { var s = dS(1 + p / 100); return /^\d+\.\d$/.test(s) ? s + '0' : /^\d+$/.test(s) ? s + '.00' : s; } // 30 → "1.30"
  function nearM(v, x) { return near(v, r2(x)) || near(v, x); }
  function sol(lines) { return lines.filter(function (x) { return x != null && x !== ''; }).join('<br>'); }
  function aN(p) { return /^(8|11|18)/.test(dS(p)) && !/^1[^18]/.test(dS(p)) ? 'An' : 'A'; }   // "An 8%", "An 11%", "An 18%"
  /* PK.moneyPart with the answer written in the booklet's style ($12 680.00) */
  function mp(prompt, exact, diag, sl, hints, text, inp) { var p = PK.moneyPart(prompt, exact, diag, sl, hints, text, inp); p.answer = t(MM(exact)); return p; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* a table for the prompt: rows of cells (HTML); the first row is the header; o.side: first column as headers too */
  function tbl(rows, o) {
    o = o || {};
    return '<table class="vtab">' + rows.map(function (r, i) {
      return '<tr>' + r.map(function (c, j) { var th = (i === 0 && o.head !== false) || (j === 0 && o.side); return (th ? '<th>' : '<td>') + c + (th ? '</th>' : '</td>'); }).join('') + '</tr>';
    }).join('') + '</table>';
  }
  /* [value, code, hint] list → diag(v) (extra(v) first) */
  function dl(list, extra) {
    return function (v, a) {
      if (extra) { var h = extra(v, a); if (h) return h; }
      for (var i = 0; i < list.length; i++) if (isFinite(list[i][0]) && nearM(v, list[i][0])) return { code: list[i][1], hint: list[i][2] };
      return null;
    };
  }
  function badOf(list, ans) { return list.map(function (x) { return m$(x[0]); }).filter(function (s, i, arr) { return !nearM(Number(s), ans) && arr.indexOf(s) === i && Number(s) >= 0; }); }
  /* p% of A: the usual mistakes (PK.ofMistakes) + the amount plus the percent */
  function ofList(p, A, o) { o = o || {}; return PK.ofMistakes(p, A, { Atex: MM(A), addOn: o.addOn !== false }).concat(o.more || []); }
  /* a "p% of A" money part. o: { word: 'commission', of: 'sales', diag, solEnd, hints, text, more } */
  function pctPart(p, A, prompt, o) {
    o = o || {}; var c = pctOf(p, A), word = o.word || 'commission', list = ofList(p, A, o);
    var part = mp(prompt, c, dl(list, o.diag), sol([t(pctT(p) + '=' + decT(p)), word + ' ' + t('=' + MM(A) + '\\times ' + decT(p) + eqMM(c))].concat(o.solEnd || [])),
      o.hints || ['Change ' + t(pctT(p)) + ' to a decimal: move the decimal point 2 places left.', cap(word) + ' = ' + (o.of || 'sales') + ' × rate (as a decimal).'], o.text || word + ' ' + p + '% of ' + A);
    part.bad = badOf(list, c);
    return part;
  }
  /* part ÷ whole × 100 as a percent (dp: rounding place, null = exact) */
  function rateChk(part, whole, dp, o) {
    o = o || {}; var P0 = part / whole * 100;
    return PK.pct(P0, dp, function (v) {
      if (near(v, whole / part * 100) || near(v, rnd(whole / part, 2)) || near(v, rnd(whole / part, 1)) || near(v, rnd(whole / part * 100, dp == null ? 2 : dp))) return { code: 'u2e-flip', hint: 'Divide the ' + (o.partName || 'commission') + ' by the ' + (o.wholeName || 'sales') + ' (the small amount by the big one), then multiply by ' + t('100') + '.' };
      if (near(v, rnd(P0 / 10, 4)) || near(v, rnd(P0 / 10, dp == null ? 3 : dp + 1))) return { code: 'u2e-x10', hint: 'Multiply by ' + t('100') + ' (not ' + t('10') + ') to change the decimal to a percent.' };
      if (near(v, P0 * 10)) return { code: 'u2e-x1000', hint: 'Multiply the decimal by ' + t('100') + ', not ' + t('1000') + '.' };
      if (o.diag) return o.diag(v);
      return null;
    }, { nr: o.nr });
  }
  /* working backwards: amount = part ÷ rate (as a decimal) */
  function backList(c, p, o) {
    o = o || {}; var whole = o.whole || 'sales';
    return [[c * p / 100, 'u2e-back-mult', 'Work backwards: <b>divide</b> by the rate (as a decimal), don’t multiply. The ' + whole + ' should be much bigger than ' + t(MM(c)) + '.'],
      [c * p, 'u2e-back-mult', 'Divide by the rate as a decimal: ' + t(MM(c) + '\\div ' + decT(p)) + '.'],
      [c / p, 'u2e-back-nodec', 'Change ' + t(pctT(p)) + ' to a decimal first (' + t(decT(p)) + '), then divide. (Or: ' + t(MM(c) + '\\div ' + dS(p)) + ' is ' + t('1\\%') + ', so multiply that by ' + t('100') + '.)'],
      [c / (p / 10), 'u2e-back-nodec', t(pctT(p)) + ' as a decimal is ' + t(decT(p)) + ' — move the decimal point <b>2</b> places left.'],
      [c * (1 + p / 100), 'u2e-back-mult', 'Divide by the rate as a decimal: ' + t(MM(c) + '\\div ' + decT(p)) + '.'],
      [c - pctOf(p, c), 'u2e-back-mult', 'Divide by the rate as a decimal: ' + t(MM(c) + '\\div ' + decT(p)) + '.']].filter(function (x) { return !nearM(x[0], c / (p / 100)); });
  }
  /* a word answer ("which job"): opts = [{ re: RegExp on the cleaned text, right, code, hint }] */
  function choiceChk(opts, nudge) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\\$|\\%/g, function (m) { return m.slice(1); }).replace(/\\,/g, '').replace(/[.!]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var hit = opts.filter(function (o) { return o.re.test(s); });
      if (hit.length !== 1) return form('u2e-which', hit.length ? 'Type just one choice. ' + (nudge || '') : (nudge || 'Type your choice.'));
      return hit[0].right ? ok() : wrong(hit[0].code || 'u2e-wrong-choice', hit[0].hint || null);
    };
  }
  function letterOpts(right, other, hintWrong) { // "A" / "Job A" / "Plan X"
    var mk = function (L) { return new RegExp('^((job|plan|store|option)\\s*)?' + L.toLowerCase() + '$'); };
    return [{ re: mk(right), right: true }, { re: mk(other), code: 'u2e-wrong-choice', hint: hintWrong }];
  }
  /* sort statements: advantage / disadvantage for the worker (two of each, shuffled) */
  function advGrid(r, prompt, adv, dis, what, text) {
    var items = r.shuffle(r.sample(adv, 2).map(function (h) { return { h: h, k: 'adv' }; }).concat(r.sample(dis, 2).map(function (h) { return { h: h, k: 'dis' }; })));
    var rows = items.map(function (x, i) { return { id: 'r' + i, html: x.h, label: x.h } }), want = {};
    items.forEach(function (x, i) { want['r' + i] = x.k; });
    return P.grid(prompt, rows, [{ id: 'adv', html: 'Advantage' }, { id: 'dis', html: 'Disadvantage' }], want,
      { rowHead: 'For the worker…', why: function (id) { var x = items[+id.slice(1)]; return { code: 'u2e-adv-dis', hint: '“' + x.h + '” is ' + (x.k === 'adv' ? 'good' : 'bad') + ' for the worker, so it is a' + (x.k === 'adv' ? 'n <b>advantage</b>' : ' <b>disadvantage</b>') + '.' }; } },
      sol(items.map(function (x) { return '<b>' + (x.k === 'adv' ? 'Advantage' : 'Disadvantage') + ':</b> ' + x.h; })),
      ['Ask: is this good for the worker or bad for the worker?', 'Think about ' + what + '.'], text || 'adv/dis');
  }
  /* graduated commission. lv = [{ upto, rate }, …, { upto: Infinity, rate }] */
  function tierCalc(S, lv) {
    var lo = 0, tot = 0, pieces = [];
    lv.forEach(function (x) { var hi = Math.min(S, x.upto), amt = Math.max(0, hi - lo), c = pctOf(x.rate, amt); pieces.push({ lo: lo, upto: x.upto, amt: amt, rate: x.rate, c: c }); tot += c; lo = x.upto; });
    return { pieces: pieces, total: rnd(tot, 6) };
  }
  function tierName(pc, i, lv) {
    if (i === 0) return 'first ' + t(MW(pc.upto));
    if (pc.upto === Infinity) return 'over ' + t(MW(pc.lo));
    return 'next ' + t(MW(pc.upto - pc.lo)) + ' (' + t(MW(pc.lo)) + ' to ' + t(MW(pc.upto)) + ')';
  }
  function tierSol(S, lv, o) {
    o = o || {}; var T = tierCalc(S, lv), L = [], used = T.pieces.filter(function (pc) { return pc.amt > 0; });
    T.pieces.forEach(function (pc, i) {
      if (pc.amt <= 0) return;
      var full = pc.amt === pc.upto - pc.lo;
      if (i === 0) L.push((S <= lv[0].upto ? 'All ' + t(MW(S)) + ' is in the first level: ' : tierName(pc, i, lv) + ': ') + t(MW(pc.amt) + '\\times ' + decT(pc.rate) + eqMM(pc.c)));
      else if (full && pc.upto !== Infinity) L.push(tierName(pc, i, lv) + ': ' + t(MW(pc.amt) + '\\times ' + decT(pc.rate) + eqMM(pc.c)));
      else L.push('over ' + t(MW(pc.lo)) + ': ' + t(MW(S) + '-' + MW(pc.lo) + '=' + MW(pc.amt)) + '; ' + t(MW(pc.amt) + '\\times ' + decT(pc.rate) + eqMM(pc.c)));
    });
    if (S <= lv[0].upto && S === lv[0].upto) L.push('(nothing over ' + t(MW(lv[0].upto)) + ')');
    if (used.length > 1) L.push((o.word || 'total commission') + ' ' + t('=' + used.map(function (pc) { return MM(pc.c); }).join('+') + eqMM(T.total)));
    return L;
  }
  function tierList(S, lv) {
    var T = tierCalc(S, lv), top = lv[lv.length - 1].rate, out = [], first = lv[0];
    if (S > first.upto) {
      out.push([pctOf(top, S), 'u2e-tier-all-top', 'The ' + t(pctT(top)) + ' is only for the part of the sales <b>over</b> ' + t(MW(T.pieces[T.pieces.length - 1].lo)) + ', not for all the sales. Split the sales into the levels first.']);
      out.push([pctOf(first.rate, S), 'u2e-tier-all-low', 'Only the first ' + t(MW(first.upto)) + ' gets ' + t(pctT(first.rate)) + '. The sales over that get ' + t(pctT(lv[1].rate)) + '.']);
      out.push([pctOf(first.rate, first.upto) + pctOf(lv[1].rate, S), 'u2e-tier-no-sub', 'For the second level use only the sales <b>over</b> ' + t(MW(first.upto)) + ': ' + t(MW(S) + '-' + MW(first.upto)) + '.']);
      var sumR = lv.reduce(function (s, x) { return s + x.rate; }, 0);
      out.push([pctOf(sumR, S), 'u2e-tier-add-rates', 'Don’t add the rates. Each rate is used only on its own level of the sales.']);
      out.push([T.total - T.pieces[0].c, 'u2e-tier-missing', 'Add the commission on the first ' + t(MW(first.upto)) + ' too.']);
      out.push([T.pieces[0].c, 'u2e-tier-missing', 'That’s only the first level. Add the commission on the sales over ' + t(MW(first.upto)) + '.']);
      if (lv.length > 2) {
        out.push([T.pieces[0].c + pctOf(top, S - first.upto), 'u2e-tier-middle', 'There are three levels. The middle level (' + t(MW(lv[0].upto)) + ' to ' + t(MW(lv[1].upto)) + ') has its own rate, ' + t(pctT(lv[1].rate)) + '.']);
        out.push([T.pieces[0].c + T.pieces[1].c + pctOf(top, S), 'u2e-tier-no-sub', 'For the top level use only the sales over ' + t(MW(lv[1].upto)) + '.']);
      }
    } else {
      out.push([pctOf(lv[1].rate, S), 'u2e-tier-all-top', 'These sales are not over ' + t(MW(first.upto)) + ', so all of them get the first rate, ' + t(pctT(first.rate)) + '.']);
      out.push([pctOf(first.rate + lv[1].rate, S), 'u2e-tier-add-rates', 'Don’t add the rates. All these sales are in the first level.']);
    }
    return out.concat(ofList(first.rate, S, { addOn: false }).filter(function (x) { return S <= first.upto; }));
  }
  function tierText(lv) {
    var items = lv.map(function (x, i) { return i === 0 ? t(pctT(x.rate)) + ' on the first ' + t(MW(x.upto)) : x.upto === Infinity ? t(pctT(x.rate)) + ' on sales over ' + t(MW(lv[i - 1].upto)) : t(pctT(x.rate)) + ' on the next ' + t(MW(x.upto - lv[i - 1].upto)) + ' (from ' + t(MW(lv[i - 1].upto)) + ' to ' + t(MW(x.upto)) + ')'; });
    return items.length === 2 ? items.join(' and ') : items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
  }
  function tierPart(S, lv, prompt, o) {
    o = o || {}; var T = tierCalc(S, lv), list = tierList(S, lv).filter(function (x) { return !nearM(x[0], T.total); });
    var hints = ['Split the sales into the levels. Each level gets its own rate.', 'Find the commission for each level, then add.'];
    if (o.nr) {
      var want = Math.round(T.total), dg = function (v) { for (var i = 0; i < list.length; i++) if (Math.abs(v - list[i][0]) < 0.5 + 1e-9) return { code: list[i][1], hint: list[i][2] }; return null; };
      var p = PK.part(prompt, PK.num(T.total, 0, dg, { nr: true }), String(want), String(want), sol(tierSol(S, lv).concat(near(T.total, want) ? [] : ['to the nearest dollar: ' + t('\\$' + want)])), hints, o.text || 'NR tiers', { nr: true });
      p.bad = list.map(function (x) { return String(Math.round(x[0])); }).filter(function (s, i, a) { return Number(s) !== want && a.indexOf(s) === i && s.length <= 4; });
      return p;
    }
    var part = mp(prompt, T.total, dl(list, o.diag), sol(tierSol(S, lv).concat(o.solEnd || [])), o.hints || hints, o.text || 'tiers ' + S);
    part.bad = badOf(list, T.total);
    return part;
  }
  /* base pay + commission: the usual mistakes. o: { hours, wage } when the base is an hourly wage; o.quota */
  function grossList(base, S, p, o) {
    o = o || {}; var Sq = o.quota ? Math.max(0, S - o.quota) : S, c = pctOf(p, Sq), L = [];
    L.push([base, 'u2e-no-comm', 'That’s only the ' + (o.hours ? 'wage pay' : 'base pay') + '. Add the commission' + (o.quota ? ' on the sales over the quota' : '') + '.']);
    L.push([c, 'u2e-comm-only', 'That’s the commission. Add the ' + (o.hours ? 'wage pay (hours × wage)' : 'base pay') + ' to get the gross pay.']);
    if (!o.hours) L.push([base * (1 + p / 100), 'u2e-pct-base', 'Take the percent of the <b>sales</b>, not of the base pay.']);
    L.push([base + p * Sq, 'pct-no-div', 'Change ' + t(pctT(p)) + ' to a decimal (' + t(decT(p)) + ') before you multiply.']);
    L.push([base + p * Sq / 10, 'pct-one-place', t(pctT(p)) + ' as a decimal is ' + t(decT(p)) + ' — move the decimal point <b>2</b> places left.']);
    L.push([base + Sq, 'u2e-added-sales', 'Add the <b>commission</b>, not the whole sales.']);
    L.push([S + c, 'u2e-added-sales', 'Gross pay is the base pay plus the commission. The sales are not part of your pay.']);
    if (o.hours) { L.push([o.wage + c, 'u2e-no-hours', 'Multiply the wage by the hours first: ' + t(o.hours + '\\times ' + MM(o.wage)) + '.']); L.push([o.hours * o.wage * (1 + p / 100), 'u2e-pct-base', 'Take the percent of the <b>sales</b>, not of the wage pay.']); }
    if (o.quota && S > o.quota) { L.push([base + pctOf(p, S), 'u2e-quota-all', 'Commission is only on the sales <b>over</b> the quota: ' + t(MW(S) + '-' + MW(o.quota)) + '.']); L.push([base + pctOf(p, o.quota), 'u2e-quota-all', 'Use the sales <b>over</b> the quota (' + t(MW(S) + '-' + MW(o.quota)) + '), not the quota itself.']); }
    return L;
  }
  /* a line graph of pay (one or more straight lines) */
  function payGraph(o) {
    var W = 480, H = 300, L = 62, R = 26, T0 = 12, B = 44, pw = W - L - R, ph = H - T0 - B;
    var X = function (x) { return L + x / o.xmax * pw; }, Y = function (y) { return T0 + ph - y / o.ymax * ph; };
    var s = '<svg class="u2l5-graph" viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px" role="img" aria-label="' + (o.label || 'Pay graph') + '">';
    s += '<rect x="' + L + '" y="' + T0 + '" width="' + pw + '" height="' + ph + '" fill="#fff"/>';
    var g; for (g = o.xminor; g < o.xmax; g += o.xminor) if (Math.abs(g / o.xstep - Math.round(g / o.xstep)) > 1e-9) s += '<line x1="' + X(g) + '" y1="' + T0 + '" x2="' + X(g) + '" y2="' + (T0 + ph) + '" stroke="#eceef1"/>';
    for (g = o.yminor; g < o.ymax; g += o.yminor) if (Math.abs(g / o.ystep - Math.round(g / o.ystep)) > 1e-9) s += '<line x1="' + L + '" y1="' + Y(g) + '" x2="' + (L + pw) + '" y2="' + Y(g) + '" stroke="#eceef1"/>';
    for (g = 0; g <= o.xmax + 1e-9; g += o.xstep) s += '<line x1="' + X(g) + '" y1="' + T0 + '" x2="' + X(g) + '" y2="' + (T0 + ph) + '" stroke="#c9ced6"/><text x="' + X(g) + '" y="' + (T0 + ph + 15) + '" font-size="11" text-anchor="middle" fill="#2b3340">' + String(g).replace(/\B(?=(\d{3})+(?!\d))/g, g >= 10000 ? '&#8201;' : '') + '</text>';
    for (g = 0; g <= o.ymax + 1e-9; g += o.ystep) s += '<line x1="' + L + '" y1="' + Y(g) + '" x2="' + (L + pw) + '" y2="' + Y(g) + '" stroke="#c9ced6"/><text x="' + (L - 6) + '" y="' + (Y(g) + 4) + '" font-size="11" text-anchor="end" fill="#2b3340">' + g + '</text>';
    s += '<rect x="' + L + '" y="' + T0 + '" width="' + pw + '" height="' + ph + '" fill="none" stroke="#2b3340" stroke-width="1.3"/>';
    o.lines.forEach(function (ln) {
      var x1 = 0, x2 = o.xmax, y1 = ln.f(x1), y2 = ln.f(x2);
      if (y2 > o.ymax) { x2 = (o.ymax - ln.b) / ln.m; y2 = o.ymax; }
      s += '<line x1="' + X(x1) + '" y1="' + Y(y1) + '" x2="' + X(x2) + '" y2="' + Y(y2) + '" stroke="' + (ln.color || '#1f4e8c') + '" stroke-width="2.6"' + (ln.dash ? ' stroke-dasharray="9 6"' : '') + '/>';
      var lx = X(x2 * 0.93), ly = Y(ln.f(x2 * 0.93)) + (ln.below ? 18 : -8);
      s += '<text x="' + lx + '" y="' + ly + '" font-size="14" font-weight="700" text-anchor="middle" fill="' + (ln.color || '#1f4e8c') + '">' + ln.name + '</text>';
    });
    s += '<text x="' + (L + pw / 2) + '" y="' + (H - 6) + '" font-size="12" text-anchor="middle" fill="#2b3340">' + o.xlab + '</text>';
    s += '<text transform="translate(14 ' + (T0 + ph / 2) + ') rotate(-90)" font-size="12" text-anchor="middle" fill="#2b3340">' + o.ylab + '</text>';
    return s + '</svg>';
  }
  /* a numeric part that is not money (hours, sales to the dollar): exact or to dp places */
  Object.assign(U, { aN: aN, mp: mp, grp: grp, MM: MM, MW: MW, NN: NN, eqMM: eqMM, pctT: pctT, decT: decT, mulT: mulT, nearM: nearM, sol: sol, cap: cap, tbl: tbl, dl: dl, badOf: badOf,
    ofList: ofList, pctPart: pctPart, rateChk: rateChk, backList: backList, choiceChk: choiceChk, letterOpts: letterOpts, advGrid: advGrid, tierCalc: tierCalc,
    tierSol: tierSol, tierList: tierList, tierText: tierText, tierPart: tierPart, grossList: grossList, payGraph: payGraph });

  HW.addCodes({
    'u2e-flip': 'Rate: divided the bigger amount by the smaller (upside down)', 'u2e-x10': 'Rate: × 10 instead of × 100', 'u2e-x1000': 'Rate: × 1000 instead of × 100',
    'u2e-back-mult': 'Working backwards: multiplied instead of dividing', 'u2e-back-nodec': 'Working backwards: rate not changed to a decimal', 'u2e-which': 'Choice answer unreadable',
    'u2e-wrong-choice': 'Picked the wrong plan / option', 'u2e-adv-dis': 'Sorted an advantage / disadvantage the wrong way', 'u2e-tier-all-top': 'Graduated: higher rate on all the sales',
    'u2e-tier-all-low': 'Graduated: first rate on all the sales', 'u2e-tier-no-sub': 'Graduated: did not subtract the first level', 'u2e-tier-add-rates': 'Graduated: added the rates',
    'u2e-tier-missing': 'Graduated: left out a level', 'u2e-tier-middle': 'Graduated: skipped the middle level', 'u2e-no-comm': 'Gross pay: left out the commission', 'u2e-comm-only': 'Gross pay: gave the commission only',
    'u2e-pct-base': 'Took the percent of the base pay instead of the sales', 'u2e-added-sales': 'Added the sales instead of the commission', 'u2e-no-hours': 'Left out the hours (wage pay)',
    'u2e-quota-all': 'Quota: commission on all the sales', 'u2e-half': 'Split: divided the wrong amount', 'u2e-est': 'Estimate far off', 'u2e-break-salary': 'Break-even: used one base pay instead of the difference',
    'u2e-break-mult': 'Break-even: multiplied by the rate instead of dividing', 'u2e-break-nodec': 'Break-even: rate not changed to a decimal', 'u2e-table': 'Pay table: a pay worked wrong',
    'u2e-profit-price': 'Profit commission: used the selling price', 'u2e-profit-only': 'Profit commission: gave the profit', 'u2e-day-only': 'Used only one day', 'u2e-pay-at': 'Pay at the break-even point wrong'
  });
  HW.addPartial({
    'u2e-flip': 'n', 'u2e-x10': 'b', 'u2e-x1000': 'b', 'u2e-back-mult': 'n', 'u2e-back-nodec': 'b', 'u2e-wrong-choice': 'n', 'u2e-adv-dis': 'n', 'u2e-tier-all-top': 'n', 'u2e-tier-all-low': 'n',
    'u2e-tier-no-sub': 'b', 'u2e-tier-add-rates': 'n', 'u2e-tier-missing': 's', 'u2e-tier-middle': 'b', 'u2e-no-comm': 's', 'u2e-comm-only': 's', 'u2e-pct-base': 'n', 'u2e-added-sales': 'n', 'u2e-no-hours': 'b',
    'u2e-quota-all': 'b', 'u2e-half': 'n', 'u2e-est': 'n', 'u2e-break-salary': 'n', 'u2e-break-mult': 'n', 'u2e-break-nodec': 'b', 'u2e-table': 's', 'u2e-profit-price': 'n', 'u2e-profit-only': 's', 'u2e-day-only': 'n', 'u2e-pay-at': 's'
  });

  /* ================= Lesson 5 generators ================= */
  /* lesson worked examples (left out): 6% of 7385; 2.5% of 38 900; 8% Bianca; $450 + 4% on 7325; $15.50/h + 2.5%, 32 h,
   * 18 640; 3%/5% over 10 000 on 16 400; $2400 + 6% over 20 000; 378 on 8400; 15% → 1620; $2800 vs $1500 + 5% */
  function grossPart(base, S, p, prompt, o) {
    o = o || {}; var Sq = o.quota ? Math.max(0, S - o.quota) : S, c = pctOf(p, Sq), g = base + r2(c), list = grossList(base, S, p, o).filter(function (x) { return !nearM(x[0], g); });
    var L = [];
    if (o.hours) L.push('wage: ' + t(o.hours + '\\times ' + MM(o.wage) + '=' + MM(base)));
    if (o.quota) L.push(S > o.quota ? 'over quota: ' + t(MW(S) + '-' + MW(o.quota) + '=' + MW(Sq)) : t(MW(S)) + ' is less than the ' + t(MW(o.quota)) + ' quota, so there are no sales over the quota.');
    L.push('commission ' + t('=' + (Sq ? MW(Sq) + '\\times ' + decT(p) : '\\$0') + eqMM(c)));
    L.push('gross pay ' + t('=' + MM(base) + '+' + MM(c) + '=' + MM(g)) + (o.name ? '. ' + o.name + '’s gross pay is ' + t(MM(g)) + '.' : ''));
    var part = mp(prompt, g, dl(list), sol(L), o.hints || [(o.quota ? 'Find the sales over the quota first. ' : '') + 'Commission = ' + (o.quota ? 'sales over the quota' : 'sales') + ' × rate (as a decimal).', 'Gross pay = ' + (o.hours ? 'wage pay (hours × wage)' : 'base pay') + ' + commission.'], o.text || 'gross ' + base + '+' + p + '%');
    part.check = PK.either(part.check, PK.money(base + c));
    part.bad = badOf(list, g);
    return part;
  }
  function commSol(p, S, c, who) { return sol([t(pctT(p) + '=' + decT(p)), 'commission ' + t('=' + MM(S) + '\\times ' + decT(p) + eqMM(c)) + (who ? '. ' + who + ' earns ' + t(MM(c)) + '.' : '')]); }

  /* Q1: the rate table */
  function rateTable(r) {
    var S = r.pick([2400, 3600, 1600, 4800, 3200, 2800, 1200, 4400]);
    var rates = [r.pick([6, 4, 5, 7, 8, 3, 9]), r.pick([12, 15, 11, 14, 10]), r.pick([2.5, 3.5, 1.5, 4.5]), r.pick([4.25, 3.75, 2.75, 5.25, 1.25, 2.25])];
    var blanks = [], cols = rates.map(pctT);
    rates.forEach(function (p, j) {
      blanks.push({ where: 'cell', i: 0, j: j, name: dS(p) + '% as a decimal', chk: PK.dec(p / 100, null, function (v) {
        if (near(v, p / 10)) return p < 10 ? { code: 'pct-one-place', hint: t(pctT(p)) + ' is less than ' + t('10\\%') + ', so the decimal is less than ' + t('0.10') + ': ' + t(pctT(p) + '=' + decT(p)) + '.' } : { code: 'pct-one-place', hint: 'Move the decimal point <b>2</b> places left.' };
        if (near(v, p / 1000)) return { code: 'pct-three-places', hint: 'Move the decimal point 2 places left, not 3.' };
        if (near(v, 1 + p / 100)) return { code: 'pct-added', hint: 'This row is just the rate as a decimal (no ' + t('1+') + ').' };
        return null;
      }) });
      var c = pctOf(p, S);
      blanks.push({ where: 'cell', i: 1, j: j, name: 'Commission at ' + dS(p) + '%', chk: PK.money(c, dl(ofList(p, S))) });
    });
    var rows = ['\\text{As a decimal}', '\\text{Commission on }' + MW(S) + '\\text{ of sales}'];
    return PK.tablePart('Complete the table.', { rows: rows, cols: cols, cells: [rates.map(function () { return null; }), rates.map(function () { return null; })], corner: '\\text{Commission rate}', keys: 'pctkit-money', help: 'Tap a box, then type the number (no $ or % needed).' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: [rates.map(function (p) { return dS(p / 100); }), rates.map(function (p) { return m$(pctOf(p, S)); })] },
      sol(rates.map(function (p) { return t(pctT(p) + '=' + decT(p)) + '; ' + t(MW(S) + '\\times ' + decT(p) + eqMM(pctOf(p, S))); })),
      ['Rate as a decimal: move the decimal point 2 places left (' + t('6\\%=0.06') + ', ' + t('2.5\\%=0.025') + ').', 'Commission = sales × the decimal.'], 'rate table');
  }
  /* an estimate of p% of A: anything within 15% */
  function estChk(p, A) {
    var c = pctOf(p, A);
    return function (resp) {
      var a = PK.readV(resp); if (!a.ok) return form(a.code === 'empty' ? 'empty' : 'notnumber', a.code === 'empty' ? 'Type your estimate first.' : 'Enter a single number.');
      if (Math.abs(a.v - c) <= 0.15 * c) return ok();
      if (p !== 10 && Math.abs(a.v - A / 10) <= 0.1 * A / 10) return wrong('u2e-est', 'That’s about ' + t('10\\%') + '. ' + t(pctT(p)) + ' is ' + (p < 10 ? 'a bit less' : 'a bit more') + ' than that.');
      if (Math.abs(a.v - p * A) <= 0.2 * p * A || Math.abs(a.v - p * A / 10) <= 0.2 * p * A / 10) return wrong('pct-no-div', 'A commission is a small part of the price. Find ' + t('10\\%') + ' first (decimal point 1 place left).');
      return wrong('u2e-est', 'Round the price, find ' + t('10\\%') + ' (decimal point 1 place left), then adjust for ' + t(pctT(p)) + '.');
    };
  }
  /* break-even sales between a salary and a smaller base + commission */
  function breakChk(A, B, p, o) {
    o = o || {}; var E = (A - B) / (p / 100);
    if (o.only) return PK.money(E, dl(o.more || []));
    return PK.money(E, dl([[A / (p / 100), 'u2e-break-salary', 'Use the <b>difference</b> in base pay (' + t(MW(A) + '-' + MW(B)) + '), then divide by the rate.'], [B / (p / 100), 'u2e-break-salary', 'Use the <b>difference</b> in base pay (' + t(MW(A) + '-' + MW(B)) + '), then divide by the rate.'],
      [(A - B) * p / 100, 'u2e-break-mult', 'Divide the difference by the rate (as a decimal): ' + t(MW(A - B) + '\\div ' + decT(p)) + '.'], [(A - B) / p, 'u2e-break-nodec', 'Change ' + t(pctT(p)) + ' to a decimal first: ' + t(MW(A - B) + '\\div ' + decT(p)) + '.'],
      [(A - B) / (p / 10), 'u2e-break-nodec', t(pctT(p) + '=' + decT(p)) + ' — 2 places left.'], [(A + B) / (p / 100), 'u2e-break-salary', 'Subtract the base pays, don’t add them.']].concat(o.more || [])));
  }
  function payTable(prompt, salesCols, rowDefs, o) { // rowDefs: [{ name, pay(S), diag(S) }]
    var cols = salesCols.map(MW), rows = rowDefs.map(function (d) { return '\\text{' + d.name + '}'; }), blanks = [];
    rowDefs.forEach(function (d, i) { salesCols.forEach(function (S, j) { blanks.push({ where: 'cell', i: i, j: j, name: d.name + ' at ' + '$' + S, chk: PK.money(d.pay(S), d.diag ? d.diag(S) : null) }); }); });
    return PK.tablePart(prompt, { rows: rows, cols: cols, cells: rowDefs.map(function () { return salesCols.map(function () { return null; }); }), corner: '\\text{' + o.corner + '}', keys: 'pctkit-money', help: 'Tap a box, then type the pay (no $ needed).' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: rowDefs.map(function (d) { return salesCols.map(function (S) { return m$(d.pay(S)); }); }) }, o.sol, o.hints, o.text);
  }
  function bPayDiag(B, p) { return function (S) { return dl([[pctOf(p, S), 'u2e-comm-only', 'Add the base pay ' + t(MW(B)) + ' to the commission.'], [B + p * S, 'pct-no-div', t(pctT(p) + '=' + decT(p)) + '.'], [B + p * S / 10, 'pct-one-place', t(pctT(p) + '=' + decT(p)) + '.'], [B, 'u2e-no-comm', 'Add the commission: ' + t(MW(S) + '\\times ' + decT(p)) + '.'], [B * (1 + p / 100), 'u2e-pct-base', 'Take the percent of the sales, not of the base pay.']]); }; }

  var NAMES = ['Tyler', 'Rachel', 'Diego', 'Kayla', 'Malik', 'Sam', 'Ben', 'Leila', 'Noor', 'Owen', 'Sofia', 'Grant', 'Mei', 'Arjun', 'Nadia', 'Lena', 'Harpreet', 'Jesse', 'Amira', 'Cole', 'Talia', 'Wyatt'];

  HW.defineLesson({
    id: 'u2l5', unit: 2, num: '5', title: 'Commission and Salary Plus Commission', outcome: 'N2',
    blurb: 'Straight commission, salary or wage plus commission, graduated commission and quotas, finding the rate or the sales, and comparing pay plans.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1', level: 'BEG', make: function (r) { return rateTable(r); } }] },
      { num: '2', stem: 'Find the commission. Round to the nearest cent if needed.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var S = r.pick([3500, 2500, 4500, 1500, 6500, 5500, 3000]), p = r.pick([5, 4, 6, 3]); return pctPart(p, S, 'sales ' + t(MM(S)) + ', rate ' + t(pctT(p)), { text: '2a' }); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(1000, 1999) * 10, r.pick([7, 9, 6, 8, 3])]; }, function (v) { return !(v[0] === 7385); }, [12680, 7]); return pctPart(v[1], v[0], 'sales ' + t(MM(v[0])) + ', rate ' + t(pctT(v[1])), { text: '2b' }); } },
        { id: '2c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(300, 999) + 0.5, r.pick([15, 12, 18, 14, 16])]; }, function (v) { var c = pctOf(v[1], v[0]); return !near(c, r2(c)); }, [945.5, 15]); return pctPart(v[1], v[0], 'sales ' + t(MM(v[0])) + ', rate ' + t(pctT(v[1])), { text: '2c' }); } },
        { id: '2d', level: 'EMG', make: function (r) { var S = r.int(300, 890) * 100, p = r.pick([2.75, 3.25, 1.75, 2.25, 3.75]); return pctPart(p, S, 'sales ' + t(MM(S)) + ', rate ' + t(pctT(p)), { text: '2d' }); } }] },
      { num: '3', stem: function (sh) { return sh.name + ' sells ' + sh.what + 's and earns ' + t(pctT(sh.p)) + ' commission. He sells a ' + sh.what + ' for ' + t(MM(sh.P)) + '.'; },
        shared: function (r) { return { name: r.pick(['Tyler', 'Jesse', 'Cole', 'Wyatt']), what: r.pick(['hot tub', 'riding mower', 'boat motor', 'snowmobile']), p: r.pick([8, 7, 9, 12, 6, 4]), P: r.int(40, 129) * 100 - r.pick([1, 1, 101, 51]) }; },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) {
            var Rd = Math.round(sh.P / 100) * 100, ten = Rd / 10, est = Math.round(sh.p * Rd / 100 / 10) * 10;
            var p = PK.fields('Estimate his commission.', [{ label: 'about', before: '$', name: 'Estimate' }], [estChk(sh.p, sh.P)], [String(est)], t(MW(est)) + ' (any close estimate)', sol(['Round: ' + t(MM(sh.P) + '\\approx ' + MW(Rd)) + '. ' + t('10\\%') + ' of ' + t(MW(Rd)) + ' is ' + t(MW(ten)) + '.', t(pctT(sh.p)) + ' is ' + (sh.p < 10 ? 'a bit less' : 'a bit more') + ' than that: about ' + t(MW(est)) + '. (Any estimate close to this is fine.)']),
              ['Round the price, then find ' + t('10\\%') + ' (decimal point 1 place left).', t(pctT(sh.p)) + ' is ' + (sh.p < 10 ? 'a bit less' : 'a bit more') + ' than ' + t('10\\%') + '.'], 'estimate');
            p.bad = [String(Math.round(sh.P / 10)), String(sh.p * sh.P)].filter(function (x) { return Math.abs(Number(x) - pctOf(sh.p, sh.P)) > 0.15 * pctOf(sh.p, sh.P); }).map(function (x) { return [x]; });
            return p;
          } },
          { id: '3b', level: 'BEG', make: function (r, sh) { return pctPart(sh.p, sh.P, 'Calculate his commission.', { text: 'calc', solEnd: [sh.name + ' earns ' + t(MM(pctOf(sh.p, sh.P))) + '.'] }); } }] },
      { num: '4', stem: function (sh) { return sh.name + ' sells ' + sh.what + '. She earns ' + t(MM(sh.B)) + ' a week plus ' + t(pctT(sh.p)) + ' of her sales.'; },
        shared: function (r) { return find(function () { return { name: r.pick(['Rachel', 'Amira', 'Talia', 'Harpreet']), what: r.pick(['home security systems', 'hot tubs', 'TVs and sound systems', 'water softeners']), B: r.pick([520, 480, 550, 500, 425, 575, 450]), p: r.pick([3, 4, 2, 5]) }; }, function (s) { return !(s.B === 450 && s.p === 4); }, { name: 'Rachel', what: 'home security systems', B: 520, p: 3 }); },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) { var S = r.int(80, 125) * 100 + r.pick([0, 50]); return grossPart(sh.B, S, sh.p, 'Find her gross pay in a week when she sells ' + t(MM(S)) + '.', { text: 'gross busy' }); } },
          { id: '4b', level: 'EMG', make: function (r, sh) { var S = r.int(15, 32) * 100; return grossPart(sh.B, S, sh.p, 'Find her gross pay in a slow week when she sells ' + t(MM(S)) + '.', { text: 'gross slow' }); } }] },
      { num: '5', stem: '', parts: [{ id: '5', level: 'EMG', make: function (r) {
        var v = find(function () { return { w: r.pick([16.25, 15.75, 16.5, 17.25, 15.25, 16.75]), h: r.pick([30, 28, 32, 35, 26, 24]), p: r.pick([2, 3, 1.5, 2.5]), S: r.int(50, 99) * 100 + r.pick([0, 40, 60, 20]), name: r.pick(['Diego', 'Owen', 'Jesse', 'Cole']), city: r.pick(['Medicine Hat', 'Red Deer', 'Lethbridge', 'Grande Prairie']) }; }, function (s) { return !(s.w === 15.5 && s.h === 32); }, { w: 16.25, h: 30, p: 2, S: 7840, name: 'Diego', city: 'Medicine Hat' });
        var base = v.h * v.w;
        return grossPart(base, v.S, v.p, v.name + ' works at a shoe store in ' + v.city + '. He earns ' + t(MM(v.w) + '\\text{/h}') + ' plus ' + t(pctT(v.p)) + ' commission on his sales. One week he works ' + t(v.h + '\\text{ h}') + ' and sells ' + t(MM(v.S)) + ' of shoes. Find his gross pay.', { hours: v.h, wage: v.w, name: v.name, text: 'wage + commission' });
      } }] },
      { num: '6', stem: function (sh) { return 'A store pays ' + tierText(sh.lv) + '. Find the commission for each month.'; },
        shared: function (r) { return find(function () { var L = r.pick([15000, 12000, 20000, 8000, 10000]), r1 = r.pick([4, 3, 2, 5]); return { L: L, lv: [{ upto: L, rate: r1 }, { upto: Infinity, rate: r1 + r.pick([2, 1, 3]) }] }; }, function (s) { return !(s.L === 10000 && s.lv[0].rate === 3 && s.lv[1].rate === 5); }, { L: 15000, lv: [{ upto: 15000, rate: 4 }, { upto: Infinity, rate: 6 }] }); },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { var S = sh.L - r.int(2, Math.min(12, sh.L / 1000 - 2)) * 500; return tierPart(S, sh.lv, 'sales ' + t(MW(S)), { text: 'below' }); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { return tierPart(sh.L, sh.lv, 'sales ' + t(MW(sh.L)), { text: 'at level' }); } },
          { id: '6c', level: 'PRG', make: function (r, sh) { var S = sh.L + r.int(4, 22) * 500; return tierPart(S, sh.lv, 'sales ' + t(MW(S)), { text: 'over' }); } }] },
      { num: '7', stem: function (sh) { return 'In Alberta, many real estate offices charge ' + t('7\\%') + ' on the first ' + t('\\$100\\,000') + ' of a home’s price and ' + t('3\\%') + ' on the rest. A house in ' + sh.city + ' sells for ' + t(MW(sh.H)) + '.'; },
        shared: function (r) { return { H: r.int(250, 699) * 1000 + r.pick([0, 0, 500]), city: r.pick(['Airdrie', 'Cochrane', 'Okotoks', 'Chestermere', 'Strathmore']) }; },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return tierPart(sh.H, [{ upto: 100000, rate: 7 }, { upto: Infinity, rate: 3 }], 'Find the total commission.', { text: 'real estate' }); } },
          { id: '7b', level: 'BEG', make: function (r, sh) {
            var c = tierCalc(sh.H, [{ upto: 100000, rate: 7 }, { upto: Infinity, rate: 3 }]).total, h = c / 2;
            var p = mp('The commission is split equally between the seller’s office and the buyer’s office. How much does each office get?', h, dl([[sh.H / 2, 'u2e-half', 'Split the <b>commission</b> from (a), not the price of the house.'], [c, 'u2e-half', 'That’s the whole commission. Split it equally between the 2 offices.'], [c * 2, 'u2e-half', 'Divide by 2, don’t multiply.']]),
              sol(['commission from (a): ' + t(MM(c)), t(MM(c) + '\\div 2=' + MM(h)) + ' each']), ['Use the total commission from (a).', 'Split equally between 2 offices: divide by 2.'], 'split');
            p.bad = [m$(sh.H / 2), m$(c)];
            return p;
          } }] },
      { num: '8', stem: function (sh) { return sh.name + ' sells ' + sh.what + '. She earns ' + t(MM(sh.B)) + ' a month plus ' + t(pctT(sh.p)) + ' of her sales over a quota of ' + t(MW(sh.Q)) + '.'; },
        shared: function (r) { return { name: r.pick(['Kayla', 'Amira', 'Talia', 'Brooke']), what: r.pick(['gym memberships', 'home insurance', 'radio ads', 'cell phone plans']), B: r.pick([1800, 2000, 1600, 2200, 1900]), p: r.pick([10, 8, 12, 5]), Q: r.pick([12000, 15000, 10000, 18000]) }; },
        parts: [
          { id: '8a', level: 'PRG', make: function (r, sh) { var S = sh.Q + r.int(5, 16) * 500; return grossPart(sh.B, S, sh.p, 'Find her gross pay in a month when she sells ' + t(MW(S)) + '.', { quota: sh.Q, text: 'quota over' }); } },
          { id: '8b', level: 'EMG', make: function (r, sh) {
            var S = sh.Q - r.int(2, 9) * 100, short = sh.Q - S;
            return P.mc(r, 'In another month she sells ' + t(MW(S)) + '. What is her gross pay?', [
              { html: t(MM(sh.B)) + '. She did not reach the ' + t(MW(sh.Q)) + ' quota, so she earns no commission.', right: true },
              { html: t(MM(sh.B + pctOf(sh.p, S))) + '. She earns ' + t(pctT(sh.p)) + ' of all her sales.', why: 'She is paid commission only on sales <b>over</b> the quota. Did she sell more than ' + t(MW(sh.Q)) + '?', code: 'all' },
              { html: t(MM(sh.B - pctOf(sh.p, short))) + '. She loses ' + t(pctT(sh.p)) + ' of the ' + t(MW(short)) + ' she is short.', why: 'Missing the quota doesn’t take money off her base pay. She just gets no commission.', code: 'minus' },
              { html: t('\\$0.00') + '. She did not reach the quota, so she earns nothing.', why: 'Her base pay of ' + t(MM(sh.B)) + ' is paid every month, quota or not.', code: 'zero' }],
              sol([t(MW(S)) + ' is less than the ' + t(MW(sh.Q)) + ' quota, so there are no sales over the quota.', 'commission ' + t('=\\$0') + '; gross pay ' + t('=' + MM(sh.B)) + '.']), ['Compare her sales with the quota.'], 'below quota');
          } }] },
      { num: '9', stem: 'Find the commission rate as a percent.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(6, 30) * 1000, r.pick([4.5, 3.5, 5.5, 2.5, 1.5])]; }, function (v) { return !(v[0] === 8400 && v[1] === 4.5); }, [12000, 4.5]); return ratePart(pctOf(v[1], v[0]), v[0], 'r9a'); } },
        { id: '9b', level: 'EMG', make: function (r) { var S = r.int(80, 200) * 10 + r.pick([0, 0, 5]), p = r.pick([8, 6, 7, 9, 12]); return ratePart(pctOf(p, S), S, 'r9b'); } },
        { id: '9c', level: 'EMG', make: function (r) { var S = r.int(40, 99) * 1000 + r.pick([0, 500]), p = r.pick([2.5, 1.5, 3.5, 2.25, 1.75]); return ratePart(pctOf(p, S), S, 'r9c'); } }] },
      { num: '10', stem: '', parts: [{ id: '10', level: 'PRG', make: function (r) {
        var v = find(function () { return { p: r.pick([9, 8, 6, 12, 7]), S: r.int(80, 250) * 100 }; }, function (v) { return !(v.p === 15); }, { p: 9, S: 14600 }), c = pctOf(v.p, v.S), who = r.pick(['travel agent', 'wedding planner', 'ticket agent']);
        var list = backList(c, v.p, { whole: 'value of the trips' });
        var p = mp('A ' + who + ' earns ' + t(pctT(v.p)) + ' commission on the ' + (who === 'travel agent' ? 'trips she books' : who === 'wedding planner' ? 'weddings she plans' : 'tickets she sells') + '. Last month she earned ' + t(MM(c)) + ' in commission. What was the total value of her sales? Check your answer.', v.S, dl(list),
          sol(['sales ' + t('=' + MM(c) + '\\div ' + decT(v.p) + '=' + MM(v.S)), 'Check: ' + t(MW(v.S) + '\\times ' + decT(v.p) + '=' + MM(c)) + ' ✓']), ['Commission = sales × rate, so sales = commission ÷ rate (as a decimal).', 'Check: your sales × the rate should give ' + t(MM(c)) + '.'], 'backwards');
        p.bad = badOf(list, v.S);
        return p;
      } }] },
      { num: '11', stem: function (sh) { return 'Two ' + sh.what + ' companies offer ' + sh.name + ' a sales job.<br><b>Job A:</b> ' + t(MW(sh.A)) + ' a week. &nbsp; <b>Job B:</b> ' + t(MW(sh.B)) + ' a week plus ' + t(pctT(sh.p)) + ' of his sales.'; },
        shared: function (r) {
          return find(function () { var p = r.pick([7, 5, 4, 8, 10, 6]), B = r.pick([300, 250, 350, 400, 200]), E = r.int(3, 10) * 1000; return { p: p, B: B, E: E, A: B + E * p / 100, name: r.pick(['Malik', 'Jesse', 'Cole', 'Arjun']), what: r.pick(['car-wash supply', 'office supply', 'solar panel', 'roofing']) }; },
            function (s) { return s.A % 50 === 0 && s.A >= 550 && s.A <= 950 && s.A - s.B >= 200; }, { p: 7, B: 300, E: 5000, A: 650, name: 'Malik', what: 'car-wash supply' });
        },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var d = Math.max(1000, Math.round(sh.E * 0.4 / 1000) * 1000), cols = [sh.E - d, sh.E, sh.E + d];
            return payTable('Complete the table.', cols, [{ name: 'Job A pay', pay: function () { return sh.A; }, diag: function () { return dl([[sh.B, 'u2e-table', 'Job A is a salary only: ' + t(MW(sh.A)) + ' every week.']]); } }, { name: 'Job B pay', pay: function (S) { return sh.B + pctOf(sh.p, S); }, diag: bPayDiag(sh.B, sh.p) }],
              { corner: 'Weekly sales', sol: sol(['Job A pays ' + t(MW(sh.A)) + ' every week.', 'Job B: ' + cols.map(function (S) { return t(MW(sh.B) + '+' + MW(S) + '\\times ' + decT(sh.p) + '=' + MW(sh.B + pctOf(sh.p, S))); }).join('; ')]), hints: ['Job A is the same at every sales amount.', 'Job B = ' + t(MW(sh.B)) + ' + sales × ' + t(decT(sh.p)) + '.'], text: 'job table' });
          } },
          { id: '11b', level: 'MAS', make: function (r, sh) {
            var p = mp('At what weekly sales do the jobs pay the same?', sh.E, null, sol(['Job A pays ' + t(MW(sh.A) + '-' + MW(sh.B) + '=' + MW(sh.A - sh.B)) + ' more in base pay.', 'Job B catches up when ' + t(pctT(sh.p)) + ' of the sales is ' + t(MW(sh.A - sh.B)) + ':', 'sales ' + t('=' + MW(sh.A - sh.B) + '\\div ' + decT(sh.p) + '=' + MW(sh.E)), 'Check: ' + t(MW(sh.B) + '+' + MW(sh.E) + '\\times ' + decT(sh.p) + '=' + MW(sh.A)) + ' ✓']),
              ['Find the difference in base pay first.', 'Sales needed = difference in base pay ÷ rate (as a decimal).'], 'break-even');
            p.check = breakChk(sh.A, sh.B, sh.p);
            p.bad = [m$(sh.A / (sh.p / 100)), m$((sh.A - sh.B) * sh.p / 100)];
            return p;
          } },
          { id: '11c', level: 'EMG', make: function (r, sh) {
            var d = Math.max(1000, Math.round(sh.E * 0.4 / 1000) * 1000), up = r.chance(0.4), S = up ? sh.E + d / 2 : sh.E - d / 2, b = sh.B + pctOf(sh.p, S);
            return P.mc(r, sh.name + ' expects to sell about ' + t(MW(S)) + ' a week. Which job pays more?', [
              { html: 'Job A', right: !up, why: up ? t(MW(S)) + ' is more than ' + t(MW(sh.E)) + ', so Job B has caught up. Job B pays ' + t(MW(sh.B) + '+' + MW(pctOf(sh.p, S)) + '=' + MM(b)) + '.' : null, code: 'A' },
              { html: 'Job B', right: up, why: up ? null : t(MW(S)) + ' is less than ' + t(MW(sh.E)) + ', where the jobs pay the same. Job B pays only ' + t(MW(sh.B) + '+' + MW(pctOf(sh.p, S)) + '=' + MM(b)) + '.', code: 'B' },
              { html: 'They pay the same.', why: 'They pay the same only at ' + t(MW(sh.E)) + ' of sales.', code: 'same' }],
              sol([t(MW(S)) + ' is ' + (up ? 'more' : 'less') + ' than ' + t(MW(sh.E)) + ', so Job ' + (up ? 'B' : 'A') + ' pays more.', '(B: ' + t(MW(sh.B) + '+' + MW(S) + '\\times ' + decT(sh.p) + '=' + MM(b)) + '; A: ' + t(MW(sh.A)) + '.)']), ['Compare ' + t(MW(S)) + ' with the sales where the jobs pay the same.'], 'which job', true);
          } }] },
      { num: '12', stem: function (sh) {
          return 'The graph shows the weekly pay for two plans at a ' + sh.store + '.<br><b>Plan X:</b> ' + t(pctT(sh.rx)) + ' straight commission. &nbsp; <b>Plan Y:</b> ' + t(MW(sh.B)) + ' a week plus ' + t(pctT(sh.ry)) + ' commission.<br>' +
            payGraph({ xmax: 12000, xstep: 2000, xminor: 1000, ymax: sh.ymax, ystep: 200, yminor: 100, xlab: 'Weekly sales ($)', ylab: 'Weekly pay ($)', label: 'Graph of weekly pay against weekly sales for Plan X and Plan Y',
              lines: [{ name: 'X', m: sh.rx / 100, b: 0, f: function (x) { return sh.rx / 100 * x; } }, { name: 'Y', m: sh.ry / 100, b: sh.B, f: function (x) { return sh.B + sh.ry / 100 * x; }, dash: true, below: true, color: '#9a4b16' }] });
        },
        shared: function (r) {
          var combos = [];
          [10, 8, 12, 6].forEach(function (rx) { [5, 4, 3, 6, 2].forEach(function (ry) { [4000, 6000, 8000].forEach(function (E) { var B = E * (rx - ry) / 100, top = Math.max(rx * 120, B + ry * 120); if (ry < rx && B % 50 === 0 && B >= 100 && (E * rx / 100) % 20 === 0 && top <= 1500) combos.push({ rx: rx, ry: ry, E: E, B: B, ymax: Math.ceil(top / 200) * 200 + (top % 200 === 0 ? 200 : 0) }); }); }); });
          var c = r.pick(combos); c.store = r.pick(['computer store', 'phone store', 'furniture store', 'sporting goods store']); return c;
        },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) {
            var S = r.int(2, sh.E / 1000 - 1) * 1000, x = pctOf(sh.rx, S), y = sh.B + pctOf(sh.ry, S), d = y - x;
            var p = PK.fields('Which plan pays more at ' + t(MW(S)) + ' of sales? By how much?', [{ label: 'Plan (X or Y)', mode: 'text', placeholder: 'X or Y', name: 'Which plan' }, { label: 'More by', before: '$', name: 'How much more' }],
              [choiceChk(letterOpts('Y', 'X', 'Find each plan’s pay at ' + t(MW(S)) + ': X ' + t('=' + MW(S) + '\\times ' + decT(sh.rx)) + ', Y ' + t('=' + MW(sh.B) + '+' + MW(S) + '\\times ' + decT(sh.ry)) + '.'), 'Type <b>X</b> or <b>Y</b>.'),
                PK.money(d, dl([[x, 'u2e-pay-at', 'That’s Plan X’s pay. Subtract to find how much more Plan Y pays.'], [y, 'u2e-pay-at', 'That’s Plan Y’s pay. Subtract Plan X’s pay.'], [x + y, 'u2e-pay-at', 'Subtract the two pays, don’t add them.']]))],
              ['Y', m$(d)], 'Plan Y, by ' + t(MM(d)), sol(['X: ' + t(MW(S) + '\\times ' + decT(sh.rx) + '=' + MM(x)), 'Y: ' + t(MW(sh.B) + '+' + MW(S) + '\\times ' + decT(sh.ry) + '=' + MW(sh.B) + '+' + MM(pctOf(sh.ry, S)) + '=' + MM(y)), 'Plan Y pays ' + t(MM(y) + '-' + MM(x) + '=' + MM(d)) + ' more.']),
              ['Read each line at ' + t(MW(S)) + ' (or work out each plan’s pay).', 'Then subtract.'], 'graph a');
            p.bad = [['X', m$(d)], ['Y', m$(y)]];
            return p;
          } },
          { id: '12b', level: 'BEG', make: function (r, sh) {
            var x = pctOf(sh.rx, 12000), y = sh.B + pctOf(sh.ry, 12000);
            return P.mc(r, 'Which plan pays more at ' + t('\\$12\\,000') + ' of sales?', [
              { html: 'Plan X', right: true }, { html: 'Plan Y', why: 'Look at the right side of the graph: the solid line X is above the dashed line Y there. (X ' + t('=' + MM(x)) + ', Y ' + t('=' + MM(y)) + '.)', code: 'Y' }, { html: 'They pay the same.', why: 'The lines cross at only one point, and it is not at ' + t('\\$12\\,000') + '.', code: 'same' }],
              sol(['X: ' + t('\\$12\\,000\\times ' + decT(sh.rx) + '=' + MM(x)), 'Y: ' + t(MW(sh.B) + '+\\$12\\,000\\times ' + decT(sh.ry) + '=' + MM(y)), 'Plan X pays more.']), ['Which line is higher at ' + t('\\$12\\,000') + '?'], 'graph b', true);
          } },
          { id: '12c', level: 'PRG', make: function (r, sh) {
            var pay = pctOf(sh.rx, sh.E);
            var p = PK.fields('At what sales do the plans pay the same? What is the pay there?', [{ label: 'Sales', before: '$', name: 'Sales' }, { label: 'Pay', before: '$', name: 'Pay' }],
              [breakChk(sh.B, 0, sh.rx - sh.ry, { only: true, more: [[sh.B / (sh.ry / 100), 'u2e-break-mult', 'Use the <b>difference</b> in the rates: ' + t(pctT(sh.rx) + '-' + pctT(sh.ry) + '=' + pctT(sh.rx - sh.ry)) + '. Or read where the lines cross.'], [sh.B / (sh.rx / 100), 'u2e-break-mult', 'Use the difference in the rates (' + t(pctT(sh.rx - sh.ry)) + '), or read where the lines cross.'], [pay, 'u2e-pay-at', 'That’s the pay. The sales are on the horizontal axis.']] }),
                PK.money(pay, dl([[sh.E, 'u2e-pay-at', 'That’s the sales. The pay is on the vertical axis.']]))],
              [m$(sh.E), m$(pay)], 'sales ' + t(MW(sh.E)) + ', pay ' + t(MM(pay)),
              sol(['The lines cross at ' + t(MW(sh.E)) + ' of sales, where both pay ' + t(MW(pay)) + '.', '(Check: Plan Y has ' + t(MW(sh.B)) + ' more base pay, and Plan X earns ' + t(pctT(sh.rx - sh.ry)) + ' more of the sales: ' + t(MW(sh.B) + '\\div ' + decT(sh.rx - sh.ry) + '=' + MW(sh.E)) + '.)']),
              ['Find where the two lines cross.', 'Read the sales below the crossing point and the pay to the left of it.'], 'graph c');
            p.bad = [[m$(pay), m$(sh.E)]];
            return p;
          } },
          { id: '12d', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'Why does the line for Plan X start at ' + t('\\$0') + '?', [
              { html: 'With straight commission, if you sell nothing you earn nothing.', right: true },
              { html: 'Plan X pays a higher rate, so it starts lower.', why: 'The rate decides how steep the line is, not where it starts.', code: 'rate' },
              { html: 'Every graph starts at ' + t('\\$0') + '.', why: 'Plan Y’s line starts at ' + t(MW(sh.B)) + ', its base pay.', code: 'all' },
              { html: 'Plan X pays only on sales over a quota.', why: 'Plan X has no quota. It is ' + t(pctT(sh.rx)) + ' of all sales, with no base pay.', code: 'quota' }],
              'With straight commission there is no base pay: at ' + t('\\$0') + ' of sales the pay is ' + t('\\$0') + '. (Plan Y starts at its base pay, ' + t(MW(sh.B)) + '.)', ['What does Plan X pay if the sales are ' + t('\\$0') + '?'], 'graph d');
          } }] },
      { num: '13', stem: 'Straight commission: one advantage and one disadvantage for the worker, and one reason a store owner might like it.', parts: [
        { id: '13a', level: 'BEG', make: function (r) {
          return advGrid(r, 'Is each statement about <b>straight commission</b> an advantage or a disadvantage for the worker?',
            ['There is no limit: the more you sell, the more you earn.', 'Good selling is rewarded right away on your pay.', 'In a great month you can earn much more than a salary.'],
            ['In a slow month (like January), your pay can be very low.', 'Your pay changes every month, so it is hard to budget.', 'If you are sick or on holiday, you earn nothing.'], 'whether the worker gets more money or less, and how steady it is', 'straight commission adv/dis');
        } },
        { id: '13b', level: 'BEG', make: function (r) {
          return P.mc(r, 'Which is a good reason a store owner might like to pay commission?', [
            { html: 'Workers are paid only when they make sales, so they try hard to sell, and the owner pays less when business is slow.', right: true },
            { html: 'Commission is always less money than a salary.', why: 'Not always: a good salesperson on commission can earn more than a salary.', code: 'less' },
            { html: 'The owner doesn’t have to keep track of sales.', why: 'To pay commission, the owner has to track every worker’s sales.', code: 'track' },
            { html: 'Workers on commission don’t pay income tax.', why: 'Commission is income, and income tax is taken off it like any pay.', code: 'tax' }],
            'Sample: workers are paid only when they make sales, so they work harder to sell, and the owner pays less when business is slow.', ['Think about what the owner pays in a slow month.'], 'owner reason');
        } }] },
      { num: '14', stem: function (sh) { return sh.name + ' earns ' + tierText(sh.lv) + '. He sold ' + t(MW(sh.S)) + '. Here is his work:<br>' + '<div style="margin:6px 0 4px 18px">' + t(MW(sh.S) + '\\times ' + decT(sh.lv[1].rate) + '=' + MW(pctOf(sh.lv[1].rate, sh.S))) + ' &nbsp; “My commission is ' + t(MW(pctOf(sh.lv[1].rate, sh.S))) + '.”</div>'; },
        shared: function (r) { return find(function () { var L = r.pick([10000, 8000, 12000, 5000, 15000]), r1 = r.pick([3, 2, 4]); return { name: r.pick(['Sam', 'Cole', 'Jesse', 'Wyatt']), L: L, S: L + r.int(3, 10) * 1000, lv: [{ upto: L, rate: r1 }, { upto: Infinity, rate: r1 + r.pick([2, 1, 3]) }] }; }, function (s) { return !(s.L === 10000 && s.S === 16400); }, { name: 'Sam', L: 10000, S: 18000, lv: [{ upto: 10000, rate: 3 }, { upto: Infinity, rate: 5 }] }); },
        parts: [
          { id: '14a', level: 'EMG', make: function (r, sh) {
            var hi = sh.lv[1].rate, lo = sh.lv[0].rate;
            return P.mc(r, 'What is his mistake?', [
              { html: 'He used ' + t(pctT(hi)) + ' on all of his sales. The ' + t(pctT(hi)) + ' is only for the part over ' + t(MW(sh.L)) + '.', right: true },
              { html: 'He should have used ' + t(pctT(lo)) + ' on all of his sales.', why: 'Only the first ' + t(MW(sh.L)) + ' gets ' + t(pctT(lo)) + '. The part over ' + t(MW(sh.L)) + ' does get ' + t(pctT(hi)) + '.', code: 'low' },
              { html: 'He should have added ' + t(pctT(lo)) + ' and ' + t(pctT(hi)) + ' and used ' + t(pctT(lo + hi)) + ' on all his sales.', why: 'Each rate is used only on its own level. Don’t add the rates.', code: 'add' },
              { html: 'He forgot to subtract his commission from his sales.', why: 'Commission is a part of the sales; nothing is subtracted. Look at which rate he used on which sales.', code: 'sub' }],
              sol(['He used ' + t(pctT(hi)) + ' on all of his sales. The ' + t(pctT(hi)) + ' is only for the part over ' + t(MW(sh.L)) + '.']), ['Read the pay plan again: which sales get ' + t(pctT(hi)) + '?'], 'Sam mistake');
          } },
          { id: '14b', level: 'PRG', make: function (r, sh) { return tierPart(sh.S, sh.lv, 'Find the correct commission.', { text: 'Sam correct' }); } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.pick([4, 5, 3, 6, 2, 8]), r.int(40, 180) * 50]; }, function (v) { return v[1] % 100 !== 0 || r.chance(0.3); }, [4, 6250]), p = v[0], S = v[1], c = pctOf(p, S);
        return P.mc(r, aN(p) + ' ' + t(pctT(p)) + ' commission on sales of ' + t(MW(S)) + ' is', [
          { html: t(MM(c / 10)), why: 'That uses ' + t(dS(p / 1000)) + '. ' + t(pctT(p) + '=' + decT(p)) + '.', code: 'small' }, { html: t(MM(c)), right: true },
          { html: t(MM(c * 10)), why: 'That uses ' + t(dS(p / 10)) + '. ' + t(pctT(p) + '=' + decT(p)) + ' (2 places left).', code: 'big' }, { html: t(MM(S + c)), why: 'That’s the sales plus ' + t(pctT(p)) + '. The commission is only the ' + t(pctT(p)) + '.', code: 'plus' }],
          t(MW(S) + '\\times ' + decT(p) + '=' + MM(c)) + '.', ['Commission = sales × rate (as a decimal).'], 'MC commission', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { return { B: r.pick([400, 350, 300, 500, 450]), p: r.pick([5, 4, 6, 3]), S: r.pick([3000, 2000, 4000, 5000, 2500]), name: r.pick(['Ben', 'Cole', 'Arjun', 'Wyatt']) }; }, function (v) { var o = [pctOf(v.p, v.S), v.B * (1 + v.p / 100), v.B + pctOf(v.p, v.S), v.B + v.p * v.S / 10]; return o.every(function (x, i) { return o.every(function (y, j) { return i === j || Math.abs(x - y) > 1; }); }) && !(v.B === 450 && v.p === 4); }, { B: 400, p: 5, S: 3000, name: 'Ben' });
        var c = pctOf(v.p, v.S), opts = [
          { v: c, why: 'That’s the commission only. Add the ' + t(MW(v.B)) + ' base pay.', code: 'comm' }, { v: v.B * (1 + v.p / 100), why: 'That takes ' + t(pctT(v.p)) + ' of the salary. The commission is ' + t(pctT(v.p)) + ' of the <b>sales</b>.', code: 'salary' },
          { v: v.B + c, right: true }, { v: v.B + v.p * v.S / 10, why: 'That uses ' + t(dS(v.p / 10)) + ' for ' + t(pctT(v.p)) + '. ' + t(pctT(v.p) + '=' + decT(v.p)) + '.', code: 'big' }].sort(function (a, b) { return a.v - b.v; });
        return P.mc(r, v.name + ' earns ' + t(MW(v.B)) + ' a week plus ' + t(pctT(v.p)) + ' commission. In a week when he sells ' + t(MW(v.S)) + ', his gross pay is', opts.map(function (o) { return { html: t(MW(o.v)), right: o.right, why: o.why, code: o.code }; }),
          t(MW(v.S) + '\\times ' + decT(v.p) + '=' + MW(c)) + '; ' + t(MW(v.B) + '+' + MW(c) + '=' + MW(v.B + c)) + '.', ['Find the commission on the sales, then add the base pay.'], 'MC gross', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.int(400, 1500) * 10, r.pick([4.5, 3.5, 5.5, 6.5, 2.5])]; }, function (v) { return !(v[0] === 8400 && v[1] === 4.5); }, [9120, 4.5]), c = pctOf(v[1], v[0]), name = r.pick(['Leila', 'Noor', 'Amira', 'Talia']);
        var p = PK.part('<b>Numerical response.</b> ' + name + ' earned ' + t(MM(c)) + ' in commission on sales of ' + t(MM(v[0])) + '. Her commission rate, as a percent, is ________%.', rateChk(c, v[0], 2, { nr: true }), dS(v[1]), dS(v[1]) + '\\%',
          sol([t(MM(c) + '\\div ' + MM(v[0]) + '=' + dS(v[1] / 100)), t(dS(v[1] / 100) + '\\times 100=' + pctT(v[1]))]), ['Rate = commission ÷ sales, then × 100.'], 'NR rate', { nr: true });
        p.bad = [dS(rnd(v[0] / c, 2)), dS(v[1] / 100)];
        return p;
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'PRG', make: function (r) {
        var v = find(function () { var L = r.pick([5000, 4000, 6000, 8000, 3000]), r1 = r.pick([2, 3, 1.5]); return { L: L, S: L + r.int(15, 60) * 100, lv: [{ upto: L, rate: r1 }, { upto: Infinity, rate: r.pick([4, 5, 6]) }] }; }, function (s) { return s.lv[1].rate > s.lv[0].rate && tierCalc(s.S, s.lv).total < 9999; }, { L: 5000, S: 8200, lv: [{ upto: 5000, rate: 2 }, { upto: Infinity, rate: 4 }] });
        return tierPart(v.S, v.lv, '<b>Numerical response.</b> A salesperson earns ' + tierText(v.lv) + '. On sales of ' + t(MW(v.S)) + ', the commission, to the nearest dollar, is ' + t('\\$') + '________.', { nr: true, text: 'NR tiers' });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the commission. Round to the nearest cent if needed.', parts: [
        { id: 'e1a', level: 'LIM', make: function (r) { var S = r.pick([800, 600, 900, 700, 1200, 500]); return pctPart(10, S, t(MM(S)) + ' at ' + t('10\\%'), { text: 'e1a' }); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var S = r.int(30, 60) * 50 + r.pick([0, 2000]), p = r.pick([6, 4, 3, 7]); return pctPart(p, S, t(MM(S)) + ' at ' + t(pctT(p)), { text: 'e1b' }); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var S = r.int(1500, 3500) * 10, p = r.pick([2.5, 1.5, 3.5]); return pctPart(p, S, t(MM(S)) + ' at ' + t(pctT(p)), { text: 'e1c' }); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(300, 999) + 0.99, r.pick([12, 15, 11, 14])]; }, function (v) { return !near(pctOf(v[1], v[0]), r2(pctOf(v[1], v[0]))); }, [689.99, 12]); return pctPart(v[1], v[0], t(MM(v[0])) + ' at ' + t(pctT(v[1])), { text: 'e1d' }); } }] },
      { num: '2', stem: '', parts: [{ id: 'e2', level: 'EMG', make: function (r) {
        var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], amts = days.map(function () { return rnd(r.int(40000, 260000) / 100, 2); }), tot = rnd(amts.reduce(function (s, x) { return s + x; }, 0), 2), p = r.pick([5, 4, 6, 3]), c = pctOf(p, tot), name = r.pick(['Noor', 'Amira', 'Talia', 'Brooke']);
        var dayC = function (v) { for (var i = 0; i < amts.length; i++) if (nearM(v, pctOf(p, amts[i]))) return { code: 'u2e-day-only', hint: 'That’s the commission on one day. Use the total for the week.' }; return null; };
        var p2 = PK.fields(name + ' works at an electronics store and earns ' + t(pctT(p)) + ' commission. Find her total sales for the week and her commission.' + tbl([days.concat(['Total']), amts.map(function (a) { return t(MM(a)); }).concat(['?'])]),
          [{ label: 'Total sales', before: '$', name: 'Total sales' }, { label: 'Commission', before: '$', name: 'Commission' }],
          [PK.money(tot, function (v) { for (var i = 0; i < amts.length; i++) if (nearM(v, tot - amts[i])) return { code: 'u2e-day-only', hint: 'Add all five days (one is missing).' }; return null; }), PK.money(c, dl(ofList(p, tot), dayC))], [m$(tot), m$(c)], 'total ' + t(MM(tot)) + ', commission ' + t(MM(c)),
          sol(['total ' + t('=' + amts.map(MM).join('+') + '=' + MM(tot)), 'commission ' + t('=' + MM(tot) + '\\times ' + decT(p) + eqMM(c))]), ['Add the five days first.', 'Commission = total sales × ' + t(decT(p)) + '.'], 'weekly table');
        p2.bad = [[m$(tot), m$(p * tot)]];
        return p2;
      } }] },
      { num: '3', stem: '', parts: [{ id: 'e3', level: 'EMG', make: function (r) {
        var v = find(function () { return { B: r.pick([375, 350, 400, 425, 325]), p: r.pick([6, 5, 4, 7]), S: r.int(35, 80) * 100 + r.pick([0, 80, 40]), name: r.pick(['Owen', 'Cole', 'Jesse', 'Arjun']) }; }, function (s) { return !(s.B === 450 && s.p === 4); }, { B: 375, p: 6, S: 5280, name: 'Owen' });
        return grossPart(v.B, v.S, v.p, v.name + ' earns ' + t(MM(v.B)) + ' a week plus ' + t(pctT(v.p)) + ' of his sales. This week he sold ' + t(MM(v.S)) + '. Find his gross pay.', { text: 'e3 gross' });
      } }] },
      { num: '4', stem: '', parts: [{ id: 'e4', level: 'PRG', make: function (r) {
        var v = find(function () { var L = r.pick([8000, 6000, 9000, 7000, 12000]), r1 = r.pick([5, 4, 3]); return { L: L, S: L + r.int(5, 20) * 250, lv: [{ upto: L, rate: r1 }, { upto: Infinity, rate: r1 + r.pick([3, 2, 4]) }] }; }, function (s) { return !(s.L === 10000); }, { L: 8000, S: 11750, lv: [{ upto: 8000, rate: 5 }, { upto: Infinity, rate: 8 }] });
        return tierPart(v.S, v.lv, 'A company pays ' + tierText(v.lv) + '. Find the commission on sales of ' + t(MW(v.S)) + '.', { text: 'e4 tiers' });
      } }] },
      { num: '5', stem: 'Find the commission rate as a percent.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) { var S = r.int(30, 90) * 100, p = r.pick([4, 3, 5, 6, 7]); return ratePart(pctOf(p, S), S, 'e5a'); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var S = r.int(20, 80) * 2000, p = r.pick([2.25, 1.75, 3.25, 2.75]); return ratePart(pctOf(p, S), S, 'e5b'); } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var v = find(function () { return { w: r.pick([15, 15.5, 16, 15.25, 16.5]), h: r.pick([25, 20, 24, 28, 22]), p: r.pick([3, 2, 4, 3.5]), S: r.int(60, 140) * 100 + r.pick([0, 60, 40]), name: r.pick(['Sofia', 'Amira', 'Talia', 'Brooke']), city: r.pick(['Red Deer', 'Lethbridge', 'Airdrie', 'Brooks']) }; }, function (s) { return !(s.w === 15.5 && s.h === 32); }, { w: 15, h: 25, p: 3, S: 9860, name: 'Sofia', city: 'Red Deer' });
        return grossPart(v.h * v.w, v.S, v.p, v.name + ' works at a furniture store in ' + v.city + '. She earns ' + t(MM(v.w) + '\\text{/h}') + ' plus ' + t(pctT(v.p)) + ' commission. One week she works ' + t(v.h + '\\text{ h}') + ' and sells ' + t(MM(v.S)) + '. Find her gross pay.', { hours: v.h, wage: v.w, text: 'e6 wage + comm' });
      } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
        var v = find(function () { return { B: r.pick([2000, 1800, 2200, 2500]), p: r.pick([1.5, 2, 1.25, 2.5]), Q: r.pick([80000, 60000, 100000, 75000]), n: r.int(3, 6), name: r.pick(['Grant', 'Cole', 'Wyatt', 'Jesse']), month: r.pick(['June', 'May', 'September', 'October']) }; }, function () { return true; }, { B: 2000, p: 1.5, Q: 80000, n: 4, name: 'Grant', month: 'June' });
        var S = find(function () { return v.n * r.int(35, 62) * 1000 + r.pick([0, 400, 800, 200]); }, function (S) { return S > v.Q + 20000; }, 186400);
        return grossPart(v.B, S, v.p, 'A truck dealership pays ' + v.name + ' ' + t(MM(v.B)) + ' a month plus ' + t(pctT(v.p)) + ' of his sales over a monthly quota of ' + t(MW(v.Q)) + '. In ' + v.month + ' he sold ' + t(v.n) + ' trucks for a total of ' + t(MW(S)) + '. Find his gross pay for ' + v.month + '.', { quota: v.Q, text: 'e7 quota' });
      } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
        var p = r.pick([12, 10, 15, 8]), S = r.int(200, 700) * 250, c = pctOf(p, S), list = backList(c, p, { whole: 'value of the items' }), place = r.pick(['Brooks', 'Vulcan', 'Olds', 'Camrose']);
        var part = mp('A farm auction company near ' + place + ' earns ' + t(pctT(p)) + ' commission on everything it sells. At one auction it earned ' + t(MM(c)) + '. What was the total value of the items sold? Check your answer.', S, dl(list),
          sol(['sales ' + t('=' + MM(c) + '\\div ' + decT(p) + '=' + MM(S)), 'Check: ' + t(MW(S) + '\\times ' + decT(p) + '=' + MM(c)) + ' ✓']), ['Sales = commission ÷ rate (as a decimal).', 'Check: your answer × ' + t(decT(p)) + ' should give ' + t(MM(c)) + '.'], 'e8 backwards');
        part.bad = badOf(list, S);
        return part;
      } }] },
      { num: '9', stem: function (sh) { return sh.name + ' is offered two jobs selling ' + sh.what + '.<br><b>Job P:</b> ' + t(pctT(sh.rP)) + ' straight commission. &nbsp; <b>Job Q:</b> ' + t(MW(sh.B)) + ' a month plus ' + t(pctT(sh.rQ)) + ' commission.'; },
        shared: function (r) { return find(function () { var rP = r.pick([8, 10, 9, 7]), rQ = r.pick([3, 4, 2, 5]), B = r.pick([1600, 1500, 1200, 1800, 2000]); return { rP: rP, rQ: rQ, B: B, E: B / ((rP - rQ) / 100), name: r.pick(['Mei', 'Amira', 'Talia', 'Brooke']), what: r.pick(['kitchen cabinets', 'flooring', 'windows and doors', 'furniture']) }; },
          function (s) { return s.rQ < s.rP && near(s.E, Math.round(s.E / 1000) * 1000) && s.E >= 15000 && s.E <= 60000 && !(s.B === 1500 && s.rQ === 5); }, { rP: 8, rQ: 3, B: 1600, E: 32000, name: 'Mei', what: 'kitchen cabinets' }); },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) {
            var lo = Math.round(sh.E * 0.6 / 1000) * 1000, hi = Math.round(sh.E * 1.25 / 1000) * 1000, cols = [lo, sh.E, hi];
            return payTable('Complete the table.', cols, [{ name: 'Job P pay', pay: function (S) { return pctOf(sh.rP, S); }, diag: function (S) { return dl(ofList(sh.rP, S)); } }, { name: 'Job Q pay', pay: function (S) { return sh.B + pctOf(sh.rQ, S); }, diag: bPayDiag(sh.B, sh.rQ) }],
              { corner: 'Monthly sales', sol: sol(['P: ' + cols.map(function (S) { return t(MW(S) + '\\times ' + decT(sh.rP) + '=' + MW(pctOf(sh.rP, S))); }).join('; '), 'Q: ' + cols.map(function (S) { return t(MW(sh.B) + '+' + MW(pctOf(sh.rQ, S)) + '=' + MW(sh.B + pctOf(sh.rQ, S))); }).join('; ')]), hints: ['Job P = sales × ' + t(decT(sh.rP)) + '.', 'Job Q = ' + t(MW(sh.B)) + ' + sales × ' + t(decT(sh.rQ)) + '.'], text: 'e9 table' });
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'For what sales does Job P pay more?', [
              { html: 'For sales of more than ' + t(MW(sh.E)) + ' a month', right: true },
              { html: 'For sales of less than ' + t(MW(sh.E)) + ' a month', why: 'Look at the first column of your table: Job Q pays more there. Job P only catches up at ' + t(MW(sh.E)) + '.', code: 'less' },
              { html: 'Only at ' + t(MW(sh.E)) + ' a month', why: 'At ' + t(MW(sh.E)) + ' the jobs pay the <b>same</b>.', code: 'at' },
              { html: 'For all sales, because ' + t(pctT(sh.rP)) + ' is more than ' + t(pctT(sh.rQ)), why: 'Job Q also has ' + t(MW(sh.B)) + ' of base pay. At low sales Job Q pays more.', code: 'always' }],
              sol(['The jobs pay the same at ' + t(MW(sh.E)) + ' (both ' + t(MW(pctOf(sh.rP, sh.E))) + ').', 'Job P’s rate is higher, so it pays more when she sells more than ' + t(MW(sh.E)) + ' a month.']), ['Find the sales where the two jobs pay the same in your table.'], 'e9 when P');
          } },
          { id: 'e9c', level: 'BEG', make: function (r, sh) {
            return P.mc(r, sh.name + ' is new to sales. Which job would you suggest, and why?', [
              { html: 'Job Q: she is sure to get ' + t(MW(sh.B)) + ' a month while she learns, and it pays more until her sales pass ' + t(MW(sh.E)) + '.', right: true },
              { html: 'Job P: its commission rate is higher, so it always pays more.', why: 'Job P pays more only above ' + t(MW(sh.E)) + ' of sales. A new salesperson may not sell that much.', code: 'P' },
              { html: 'Job Q: it has a higher commission rate.', why: 'Job Q’s rate (' + t(pctT(sh.rQ)) + ') is lower. Its advantage is the base pay.', code: 'Qrate' },
              { html: 'Job P: with straight commission, a slow month doesn’t matter.', why: 'With straight commission, a slow month means very low pay.', code: 'Pslow' }],
              'Sample: Job Q. She is sure to get ' + t(MW(sh.B)) + ' a month while she learns, and it pays more until her sales pass ' + t(MW(sh.E)) + '.', ['Think about what she earns in a slow month while she is learning.'], 'e9 suggest');
          } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var v = find(function () { var L = r.pick([20000, 10000, 15000]), r1 = r.pick([3, 2, 4]), r2_ = r1 + r.pick([1, 2]); return { L: L, r1: r1, r2: r2_, S: L + r.pick([5000, 10000, 8000]) }; }, function (v) { return !(v.L === 10000 && v.r1 === 3 && v.r2 === 5); }, { L: 20000, r1: 3, r2: 4, S: 30000 });
        var lv = [{ upto: v.L, rate: v.r1 }, { upto: Infinity, rate: v.r2 }], c = tierCalc(v.S, lv).total, opts = [
          { v: pctOf(v.r1, v.S), why: 'That’s ' + t(pctT(v.r1)) + ' of all the sales. The part over ' + t(MW(v.L)) + ' gets ' + t(pctT(v.r2)) + '.', code: 'low' }, { v: c, right: true },
          { v: pctOf(v.r2, v.S), why: 'That’s ' + t(pctT(v.r2)) + ' of all the sales. Only the part over ' + t(MW(v.L)) + ' gets ' + t(pctT(v.r2)) + '.', code: 'top' },
          { v: pctOf(v.r1 + v.r2, v.S), why: 'That adds ' + t(pctT(v.r1)) + ' and ' + t(pctT(v.r2)) + ' of all of it. Use each rate on its own level only.', code: 'add' }].sort(function (a, b) { return a.v - b.v; });
        return P.mc(r, 'A company pays ' + tierText(lv) + '. The commission on ' + t(MW(v.S)) + ' of sales is', opts.map(function (o) { return { html: t(MW(o.v)), right: o.right, why: o.why, code: o.code }; }),
          sol(tierSol(v.S, lv)), ['Split the sales into the two levels.'], 'MC tiers', true);
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return { B: r.pick([480, 450, 500, 420, 520]), p: r.pick([4.5, 3.5, 5.5, 2.5]), S: r.int(40, 99) * 100, name: r.pick(['Arjun', 'Cole', 'Jesse', 'Wyatt']) }; }, function (s) { return !(s.B === 450 && s.p === 4); }, { B: 480, p: 4.5, S: 6800, name: 'Arjun' });
        var c = pctOf(v.p, v.S), g = v.B + c, want = Math.round(g), list = grossList(v.B, v.S, v.p).filter(function (x) { return Math.abs(x[0] - g) >= 0.5; });
        var dg = function (x) { for (var i = 0; i < list.length; i++) if (Math.abs(x - list[i][0]) < 0.5 + 1e-9) return { code: list[i][1], hint: list[i][2] }; return null; };
        var p = PK.part('<b>Numerical response.</b> ' + v.name + ' earns ' + t(MW(v.B)) + ' a week plus ' + t(pctT(v.p)) + ' of his sales. In a week when he sells ' + t(MW(v.S)) + ', his gross pay, to the nearest dollar, is ' + t('\\$') + '________.', PK.num(g, 0, dg, { nr: true }), String(want), String(want),
          sol([t(MW(v.S) + '\\times ' + decT(v.p) + eqMM(c)), t(MW(v.B) + '+' + MM(c) + '=' + MM(g)) + (near(g, want) ? '' : ' ≈ ' + t('\\$' + want))]), ['Commission first, then add the base pay.'], 'NR gross', { nr: true });
        p.bad = list.map(function (x) { return String(Math.round(x[0])); }).filter(function (s, i, a) { return Number(s) !== want && a.indexOf(s) === i && s.length <= 4; });
        return p;
      } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'PRG', make: function (r) {
        var v = find(function () { var C = r.int(60, 220) * 100, pr = r.int(20, 70) * 100; return { C: C, Sp: C + pr, pr: pr, p: r.pick([25, 20, 30, 15]), name: r.pick(['Nadia', 'Amira', 'Talia', 'Brooke']) }; }, function (s) { return pctOf(s.p, s.pr) >= 300; }, { C: 9400, Sp: 13900, pr: 4500, p: 25, name: 'Nadia' });
        var c = pctOf(v.p, v.pr), list = [[pctOf(v.p, v.Sp), 'u2e-profit-price', 'This lot pays on the <b>profit</b>, not the selling price. Profit = selling price − what the lot paid.'], [pctOf(v.p, v.C), 'u2e-profit-price', 'Use the profit (' + t(MW(v.Sp) + '-' + MW(v.C)) + '), not what the lot paid.'], [v.pr, 'u2e-profit-only', 'That’s the profit. Her commission is ' + t(pctT(v.p)) + ' of it.']].concat(ofList(v.p, v.pr, { addOn: false }));
        var p = mp('Some car lots pay commission on the <b>profit</b> from a car (selling price − what the lot paid), not on the selling price. A used-car lot pays its salespeople ' + t(pctT(v.p)) + ' of the profit. The lot paid ' + t(MW(v.C)) + ' for a car, and ' + v.name + ' sells it for ' + t(MW(v.Sp)) + '. What is her commission?', c, dl(list),
          sol(['profit ' + t('=' + MW(v.Sp) + '-' + MW(v.C) + '=' + MW(v.pr)), 'commission ' + t('=' + MW(v.pr) + '\\times ' + decT(v.p) + eqMM(c))]), ['Find the profit first.', 'Commission = profit × ' + t(decT(v.p)) + '.'], 'profit');
        p.bad = badOf(list, c);
        return p;
      } }] },
      { num: '13', stem: '', parts: [{ id: 'e13', level: 'ADV', make: function (r) {
        var set = r.pick([[20000, 40000, 2, 3, 5], [15000, 30000, 1, 2, 4], [10000, 25000, 2, 4, 6], [20000, 50000, 1.5, 2.5, 4]]), lv = [{ upto: set[0], rate: set[2] }, { upto: set[1], rate: set[3] }, { upto: Infinity, rate: set[4] }];
        var S = set[1] + r.int(4, 40) * 500, what = r.pick(['boat dealer', 'RV dealer', 'motorcycle dealer']);
        return tierPart(S, lv, 'A ' + what + ' pays ' + tierText(lv) + '. Find the commission on monthly sales of ' + t(MW(S)) + '.', { text: '3 tiers', hints: ['There are three levels. Split the sales: the first level, the next level, and the part over ' + t(MW(set[1])) + '.', 'Find the commission for each level, then add.'] });
      } }] },
      { num: '14', stem: function (sh) { return sh.name + ' earns ' + t(MW(sh.B0)) + ' a month plus ' + t(pctT(sh.r0)) + ' commission. Her sales are usually about ' + t(MW(sh.U)) + ' a month. Her boss offers her a choice: a raise in base pay to ' + t(MW(sh.B1)) + ', <i>or</i> a raise in commission rate to ' + t(pctT(sh.r1)) + '.'; },
        shared: function (r) { return find(function () { var B0 = r.pick([2200, 2000, 2400, 1800]), r0 = r.pick([4, 3, 5]), dB = r.pick([300, 200, 250, 400]), E = dB * 100; return { name: r.pick(['Lena', 'Amira', 'Talia', 'Brooke']), B0: B0, r0: r0, B1: B0 + dB, r1: r0 + 1, E: E, U: E + r.pick([-2000, -4000, 2000, 4000, -3000, 3000]) }; }, function () { return true; }, { name: 'Lena', B0: 2200, r0: 4, B1: 2500, r1: 5, E: 30000, U: 28000 }); },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) {
            var a = sh.B1 + pctOf(sh.r0, sh.U), b = sh.B0 + pctOf(sh.r1, sh.U), baseWins = a > b, d = Math.abs(a - b);
            var reBase = /base|salary|^\$?\s?\d{4}$/, reRate = /rate|%|percent|commission/;
            var p = PK.fields('Which choice pays more at ' + t(MW(sh.U)) + ' of sales? By how much?', [{ label: 'Choice', mode: 'text', placeholder: 'base or rate', name: 'Which choice' }, { label: 'More by', before: '$', name: 'How much more' }],
              [choiceChk([{ re: reRate, right: !baseWins, code: 'u2e-wrong-choice', hint: 'Work out her pay both ways at ' + t(MW(sh.U)) + ' and compare.' }, { re: reBase, right: baseWins, code: 'u2e-wrong-choice', hint: 'Work out her pay both ways at ' + t(MW(sh.U)) + ' and compare.' }], 'Type <b>base</b> (the raise in base pay) or <b>rate</b> (the raise in commission rate).'),
                PK.money(d, dl([[a, 'u2e-pay-at', 'That’s her pay with the raise in base pay. Find the difference.'], [b, 'u2e-pay-at', 'That’s her pay with the raise in rate. Find the difference.'], [sh.B1 - sh.B0, 'u2e-pay-at', 'That’s only the difference in base pay. Find her whole pay each way first.']]))],
              [baseWins ? 'base' : 'rate', m$(d)], (baseWins ? 'the raise in base pay' : 'the raise in commission rate') + ', by ' + t(MM(d)),
              sol(['Raise in base: ' + t(MW(sh.B1) + '+' + MW(sh.U) + '\\times ' + decT(sh.r0) + '=' + MW(sh.B1) + '+' + MW(pctOf(sh.r0, sh.U)) + '=' + MW(a)), 'Raise in rate: ' + t(MW(sh.B0) + '+' + MW(sh.U) + '\\times ' + decT(sh.r1) + '=' + MW(sh.B0) + '+' + MW(pctOf(sh.r1, sh.U)) + '=' + MW(b)), 'The raise in ' + (baseWins ? 'base pay' : 'commission rate') + ' pays ' + t(MW(d)) + ' more.']),
              ['Find her pay with each choice at ' + t(MW(sh.U)) + '.', 'Base raise: new base + old rate. Rate raise: old base + new rate.'], 'Lena a');
            p.bad = [[baseWins ? 'rate' : 'base', m$(d)], [baseWins ? 'base' : 'rate', m$(sh.B1 - sh.B0)]];
            return p;
          } },
          { id: 'e14b', level: 'MAS', make: function (r, sh) {
            var pay = sh.B1 + pctOf(sh.r0, sh.E);
            var p = PK.fields('What if her sales grow? Find the sales where the two choices pay the same, and say which choice is better above that.', [{ label: 'Same pay at sales of', before: '$', name: 'Sales' }, { label: 'Better above that', mode: 'text', placeholder: 'base or rate', name: 'Better choice' }],
              [PK.money(sh.E, dl([[(sh.B1 - sh.B0) * 0.01, 'u2e-break-mult', 'Divide the extra base pay by the extra rate (as a decimal): ' + t(MW(sh.B1 - sh.B0) + '\\div 0.01') + '.'], [(sh.B1 - sh.B0) / 1, 'u2e-break-nodec', 'The extra rate is ' + t('1\\%=0.01') + '. Divide by ' + t('0.01') + '.'], [sh.B1 / 0.01, 'u2e-break-salary', 'Use the <b>extra</b> base pay (' + t(MW(sh.B1) + '-' + MW(sh.B0)) + '), not the whole base pay.'], [sh.B1 / (sh.r1 / 100), 'u2e-break-salary', 'Use the extra base pay and the extra rate (' + t('1\\%') + ').'], [pay, 'u2e-pay-at', 'That’s the pay there. The question asks for the sales.']])),
                choiceChk([{ re: /rate|%|percent|commission/, right: true }, { re: /base|salary|^\$?\s?\d{4}$/, code: 'u2e-wrong-choice', hint: 'Above ' + t(MW(sh.E)) + ', the extra ' + t('1\\%') + ' of sales is more than the extra ' + t(MW(sh.B1 - sh.B0)) + ' of base pay.' }], 'Type <b>base</b> or <b>rate</b>.')],
              [m$(sh.E), 'rate'], t(MW(sh.E)) + '; the raise in commission rate',
              sol(['The base raise gives ' + t(MW(sh.B1) + '-' + MW(sh.B0) + '=' + MW(sh.B1 - sh.B0)) + ' more. The rate raise gives an extra ' + t('1\\%') + ' (' + t('0.01') + ') of sales.', t(MW(sh.B1 - sh.B0) + '\\div 0.01=' + MW(sh.E)) + '. They pay the same at ' + t(MW(sh.E)) + ' (both ' + t(MW(pay)) + ').', 'Above ' + t(MW(sh.E)) + ' a month, the ' + t(pctT(sh.r1)) + ' rate is the better choice.']),
              ['The extra base pay is the gap; the extra ' + t('1\\%') + ' of sales closes it.', 'Sales = extra base pay ÷ 0.01.'], 'Lena b');
            p.bad = [[m$(sh.E), 'base'], [m$(pay), 'rate']];
            return p;
          } }] }
    ]
  });

  /* Q9 / Extra 5 / Q17: the rate from the commission and the sales */
  function ratePart(c, S, text) {
    var P0 = c / S * 100;
    var p = PK.part(t(MM(c)) + ' on sales of ' + t(MM(S)), rateChk(c, S, 2), dS(rnd(P0, 2)), pctT(rnd(P0, 2)), sol([t(MM(c) + '\\div ' + MM(S) + '=' + dS(rnd(P0 / 100, 6))), t(dS(rnd(P0 / 100, 6)) + '\\times 100=' + pctT(rnd(P0, 2))), 'Check: ' + t(MM(S) + '\\times ' + dS(rnd(P0 / 100, 6)) + '=' + MM(c)) + ' ✓']),
      ['Rate = commission ÷ sales.', 'Multiply the decimal by ' + t('100') + ' to get a percent.'], text, { after: '%' });
    p.bad = [dS(rnd(S / c, 2)), dS(rnd(P0 / 100, 6)), dS(rnd(P0 * 10, 2))];
    return p;
  }
})(window);
