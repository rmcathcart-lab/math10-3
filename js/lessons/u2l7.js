/* Math 10-3 · Unit 2 · Lesson 7 — Deductions and Net Pay: Reading a Pay Stub (N2)
 * Assignment 7 (u2_l07.tex, Questions 1–18) and the Lesson 7 Extra Practice (u2_ep07.tex, Questions 1–13).
 * NEEDS js/lessons/u1l7.js loaded first (the money / percent kit HW.pctKit).
 * Every part is a generator: the same kind of pay, deductions (CPP 5.95%, EI 1.64% and the income tax rate the question
 * gives, as the booklet's example rates), before-tax deductions and the same steps as the booklet item, with new numbers
 * (the booklet's own numbers can come up; the lesson's worked-example numbers are left out). Calculator allowed.
 * Money to the cent ("$12.49", "12.49", "12.490" are right; 12.4 or 12.488 get a nudge, no try used; rounding the wrong
 * way is wrong, with a hint). A total worked from unrounded deductions (a cent off) gets a nudge: round each one first.
 * Recognised mistakes get their own hint: the rate not changed to a decimal (× 5.95), 5.95% as 0.595 or 0.00595, the
 * amount left given for the deduction, income tax on the gross pay instead of the taxable income, CPP/EI on the
 * taxable income, a deduction left out of the total, the deductions added to the gross, only the tax taken off, the
 * percent upside down, the take-home percent given for the deductions percent, overtime at the regular rate…
 * Conversions: the vocabulary blanks → a matching grid (sentence × word); "explain" items → multiple choice of reasons;
 * the deduction tables → labelled boxes (the row shown as a table); the pay stubs → the fill-in table input (given cells
 * shown, blanks as boxes), laid out as one column of lines (earnings, then deductions) so it fits a phone; "find the
 * mistake on the stub" → which line (MC), the correct net pay, and "too much or too little, by how much" (two boxes).
 * Jun's stub (Q11) is a generator: the slip can be on the EI, the income tax, the total or the net pay line; the lines
 * below it are worked from the wrong amount (the paper version has it on the net pay line only).
 *
 * Shared kit for later Unit 2 lessons: HW.u2pay (pay-stub work-out, deduction / total / net / percent checkers with the
 * hints above, labelled-box and fill-in pay-stub builders, money formatting with thin spaces). Lessons 2.8 and 2.9 use
 * it, so this file must load before u2l8.js and u2l9.js.
 * Outcome N2. Levels: LIM BEG EMG PRG ADV MAS (MAS: Q11(c), Extra 8(c), Extra 11(b), Extra 13(b)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit;
  if (!PK || !PK.money) throw new Error('u2l7 needs HW.pctKit: load js/lessons/u1l7.js before js/lessons/u2l7.js');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, near = PK.near, pctOf = PK.pctOf, find = PK.find;

  /* ================= the pay kit (HW.u2pay) ================= */
  var U = HW.u2pay = HW.u2pay || {};
  U.CPP = 5.95; U.EI = 1.64;
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function cents(x) { return Math.round(x * 100) / 100; }
  function grp(w, sep) { return w.length > 4 ? w.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : w; }
  /* LaTeX money: \$1240.00, \$32\,550.00 (thin space from 10 000 up, as in the booklet) */
  function M(x) { var s = m$(x).split('.'); return '\\$' + grp(s[0], '\\,') + '.' + s[1]; }
  /* plain HTML money for tables: $32 550.00 */
  function D$(x) { var s = m$(x).split('.'); return '$' + grp(s[0], '&#8239;') + '.' + s[1]; }
  function eqM(x) { return near(x, r2(x)) ? '=' + M(x) : '=\\$' + dS(rnd(x, 6)) + '\\approx ' + M(x); }
  function dec(p) { return dS(p / 100); }
  function dec2(p) { var s = dec(p); return /\.\d$/.test(s) ? s + '0' : s; }      // 20 → 0.20, 4 → 0.04
  function pT(p) { return dS(p) + '\\%'; }
  function nearM(v, x) { return near(v, r2(x)) || near(v, x); }
  function sol(lines) { return lines.join('<br>'); }
  function pick(r, a) { return r.pick(a); }
  U.sum = sum; U.M = M; U.D$ = D$; U.eqM = eqM; U.dec = dec; U.dec2 = dec2; U.pT = pT; U.nearM = nearM; U.sol = sol;

  /* ---- work out a pay: g = gross; deds = [{ name, rate | amt, before (before-tax), tax (income tax: on taxable income) }]
   * Returns { g, ti, deds (each with exact, v = to the cent, base), total, net, before (any before-tax) } */
  U.work = function (g, deds) {
    var out = deds.map(function (d) { return Object.assign({}, d); }), before = out.some(function (d) { return d.before; });
    out.forEach(function (d) { if (d.before) { d.base = g; d.exact = d.rate != null ? pctOf(d.rate, g) : d.amt; d.v = r2(d.exact); } });
    var ti = cents(g - sum(out.filter(function (d) { return d.before; }).map(function (d) { return d.v; })));
    out.forEach(function (d) { if (!d.before) { d.base = d.tax ? ti : g; d.exact = d.rate != null ? pctOf(d.rate, d.base) : d.amt; d.v = r2(d.exact); } });
    var total = cents(sum(out.map(function (d) { return d.v; })));
    return { g: g, ti: ti, deds: out, total: total, net: cents(g - total), before: before, rawTotal: sum(out.map(function (d) { return d.exact; })) };
  };
  /* the usual three: CPP, EI and income tax at rate tx (plus extras) */
  U.std = function (tx, extra, pre) { return (pre || []).concat([{ name: 'CPP', rate: U.CPP }, { name: 'EI', rate: U.EI }, { name: 'Income tax', rate: tx, tax: true }]).concat(extra || []); };
  function dedLine(d, W) { return d.rate != null ? d.name + ' ' + t('=' + M(d.base) + '\\times ' + dec2(d.rate) + eqM(d.exact)) : d.name + ' ' + t('=' + M(d.v)); }
  /* solution lines for a whole pay (o.noGross: skip nothing; o.from: lines before) */
  U.lines = function (W, o) {
    o = o || {}; var L = (o.pre || []).slice();
    W.deds.filter(function (d) { return d.before; }).forEach(function (d) { L.push(dedLine(d, W) + (d.rate != null ? '' : ' (before tax)')); });
    if (W.before) L.push('taxable income ' + t('=' + M(W.g) + W.deds.filter(function (d) { return d.before; }).map(function (d) { return '-' + M(d.v); }).join('') + '=' + M(W.ti)));
    W.deds.filter(function (d) { return !d.before && d.rate != null; }).forEach(function (d) { L.push(dedLine(d, W)); });
    if (o.noTotal) return L;
    L.push('total deductions ' + t('=' + W.deds.map(function (d) { return M(d.v); }).join('+') + '=' + M(W.total)));
    L.push('net pay ' + t('=' + M(W.g) + '-' + M(W.total) + '=' + M(W.net)));
    return L;
  };
  /* a deduction amount */
  U.dedDiag = function (d, W) {
    return function (v) {
      if (d.rate == null) return null;
      var b = d.base;
      if (nearM(v, d.rate * b)) return { code: 'u2l7-no-dec', hint: 'Change ' + t(pT(d.rate)) + ' to a decimal first: ' + t(pT(d.rate) + '=' + dec(d.rate)) + '.' };
      if (nearM(v, d.rate * b / 10)) return { code: 'u2l7-one-place', hint: t(pT(d.rate)) + ' is ' + t(dec(d.rate)) + ', not ' + t(dS(d.rate / 10)) + '. Move the decimal point <b>2</b> places left. (Estimate: ' + t('1\\%') + ' of ' + t(M(b)) + ' is ' + t(M(b / 100)) + '.)' };
      if (nearM(v, d.rate * b / 1000)) return { code: 'pct-three-places', hint: t(pT(d.rate)) + ' is ' + t(dec(d.rate)) + ' — move the decimal point 2 places left, not 3.' };
      if (nearM(v, b - d.exact)) return { code: 'u2l7-left-for-ded', hint: 'That’s what is left after the ' + d.name + '. The deduction is only ' + t(M(b) + '\\times ' + dec2(d.rate)) + '.' };
      if (nearM(v, b / (d.rate / 100))) return { code: 'pct-div', hint: 'Multiply the pay by the rate (as a decimal) — don’t divide.' };
      if (W && W.before && d.tax && nearM(v, pctOf(d.rate, W.g))) return { code: 'u2l7-tax-on-gross', hint: 'Income tax is on the <b>taxable income</b> (gross pay − before-tax deductions), not on the gross pay.' };
      if (W && W.before && !d.tax && !d.before && nearM(v, pctOf(d.rate, W.ti))) return { code: 'u2l7-cpp-on-taxable', hint: 'CPP and EI are worked out on the <b>gross</b> pay. Only the income tax uses the taxable income.' };
      return null;
    };
  };
  U.dedChk = function (d, W, extra) { var dg = U.dedDiag(d, W); return PK.money(d.exact, function (v, a) { return (extra && extra(v)) || dg(v, a); }); };
  /* the total of the deductions (rounded ones). Worked from the unrounded amounts → a nudge */
  U.totalChk = function (W, extra) {
    var base = PK.money(W.total, function (v) {
      var h = extra && extra(v); if (h) return h;
      for (var i = 0; i < W.deds.length; i++) if (W.deds.length > 1 && near(v, cents(W.total - W.deds[i].v))) return { code: 'u2l7-missed-ded', hint: 'You left out the <b>' + W.deds[i].name + '</b>. Add every deduction' + (W.before ? ', the before-tax ones too' : '') + '.' };
      if (near(v, W.net)) return { code: 'u2l7-net-for-total', hint: 'That’s the net pay. The total deductions is just the deductions added up.' };
      if (near(v, cents(W.g + W.total))) return { code: 'u2l7-added', hint: 'Add only the deductions, not the gross pay.' };
      return null;
    });
    return function (resp) { var a = PK.readV(resp); if (a.ok && !near(r2(W.rawTotal), W.total) && near(a.v, r2(W.rawTotal))) return form('u2l7-round-first', 'Close — round <b>each</b> deduction to the cent first, then add the rounded amounts.'); return base(resp); };
  };
  /* the net pay */
  U.netChk = function (W, extra) {
    var tax = W.deds.filter(function (d) { return d.tax; })[0];
    var base = PK.money(W.net, function (v) {
      var h = extra && extra(v); if (h) return h;
      if (near(v, cents(W.g + W.total))) return { code: 'u2l7-added', hint: 'Deductions come <b>off</b> your pay: net pay = gross pay − total deductions.' };
      if (near(v, W.total)) return { code: 'u2l7-total-for-net', hint: 'That’s the total deductions. Net pay = gross pay − total deductions.' };
      if (tax && W.deds.length > 1 && near(v, cents(W.g - tax.v))) return { code: 'u2l7-tax-only', hint: 'You took off only the income tax. <b>All</b> the deductions come off.' };
      for (var i = 0; i < W.deds.length; i++) if (W.deds.length > 1 && near(v, cents(W.net + W.deds[i].v))) return { code: 'u2l7-missed-ded', hint: 'You left out the <b>' + W.deds[i].name + '</b>. Take off every deduction' + (W.before ? ', the before-tax ones too' : '') + '.' };
      if (W.before && near(v, cents(W.ti - W.total))) return { code: 'u2l7-net-from-taxable', hint: 'Start from the <b>gross</b> pay: net pay = gross pay − total deductions (the before-tax deductions are already in the total).' };
      if (W.before && near(v, W.ti)) return { code: 'u2l7-taxable-for-net', hint: 'That’s the taxable income. Now take off all the deductions from the gross pay.' };
      return null;
    });
    return function (resp) { var a = PK.readV(resp); if (a.ok && !near(r2(W.rawTotal), W.total) && near(a.v, r2(W.g - r2(W.rawTotal)))) return form('u2l7-round-first', 'Close — round <b>each</b> deduction to the cent first, add them, then subtract.'); return base(resp); };
  };
  U.taxableChk = function (W) {
    return PK.money(W.ti, function (v) {
      if (near(v, W.g)) return { code: 'u2l7-no-before', hint: 'Take the before-tax deductions off the gross pay.' };
      var bs = W.deds.filter(function (d) { return d.before; });
      for (var i = 0; i < bs.length; i++) if (bs.length > 1 && near(v, cents(W.ti + bs[i].v))) return { code: 'u2l7-missed-ded', hint: 'Take off the ' + bs[i].name + ' too.' };
      if (near(v, cents(W.g - W.total))) return { code: 'u2l7-net-for-taxable', hint: 'That’s the net pay. Taxable income = gross pay − <b>before-tax</b> deductions only.' };
      return null;
    });
  };
  /* labelled boxes for a pay. which: list of 'gross' | 'taxable' | a deduction name | 'total' | 'net' */
  U.fields = function (prompt, W, which, o) {
    o = o || {}; var fields = [], chks = [], keys = [], ans = [];
    which.forEach(function (w) {
      var lab, chk, val;
      if (w === 'gross') { lab = o.grossLabel || 'Gross pay'; chk = o.grossChk || PK.money(W.g); val = W.g; }
      else if (w === 'taxable') { lab = 'Taxable income'; chk = U.taxableChk(W); val = W.ti; }
      else if (w === 'total') { lab = 'Total deductions'; chk = U.totalChk(W); val = W.total; }
      else if (w === 'net') { lab = 'Net pay'; chk = U.netChk(W, o.netExtra); val = W.net; }
      else { var d = W.deds.filter(function (x) { return x.name === w; })[0]; lab = d.name; chk = U.dedChk(d, W); val = d.exact; }
      fields.push({ label: (o.labels && o.labels[w]) || lab, before: '$', name: (o.labels && o.labels[w]) || lab }); chks.push(chk); keys.push(m$(val)); ans.push(((o.labels && o.labels[w]) || lab) + ' ' + t(M(val)));
    });
    var p = PK.fields(prompt, fields, chks, keys, ans.join(', '), o.sol || sol(U.lines(W, o)), o.hints || ['Each deduction = pay × rate (as a decimal). Round each to the cent.', 'Total deductions = add them all. Net pay = gross pay − total deductions.'], o.text || 'pay fields');
    p.bad = [keys.map(function () { return m$(W.g); })];
    return p;
  };
  /* a percent of a whole (take-home %, deductions %), to the nearest tenth (dp 1) unless o.dp */
  U.pctPart = function (prompt, part, whole, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, P0 = part / whole * 100, ans = dp == null ? P0 : rnd(P0, dp);
    var dg = function (v) {
      var h = o.extra && o.extra(v); if (h) return h;
      if (near(v, rnd(whole / part * 100, dp || 2)) || near(v, rnd(whole / part * 100, 1))) return { code: 'u2l7-flip', hint: 'Divide the part by the whole: ' + t(M(part) + '\\div ' + M(whole)) + ' (the gross pay goes on the bottom).' };
      if (o.comp && (near(v, rnd(100 - P0, dp)) || near(v, rnd(100 - P0, 2)))) return { code: 'u2l7-other-pct', hint: 'That’s the percent ' + o.comp + '. The question asks for the other part.' };
      if (o.wrongWhole != null && (near(v, rnd(part / o.wrongWhole * 100, dp)) || near(v, rnd(part / o.wrongWhole * 100, 2)))) return { code: 'u2l7-wrong-whole', hint: 'Divide by the <b>gross</b> pay, ' + t(M(whole)) + '.' };
      if (near(v, r2(part)) && !near(part, ans)) return { code: 'u2l7-dollars', hint: 'That’s the amount in dollars. Divide it by the gross pay, then multiply by 100.' };
      return null;
    };
    var q = part / whole, qT = near(q, rnd(q, 4)) ? dS(rnd(q, 4)) : dS(rnd(q, 4)) + '\\ldots', exact = near(P0, ans);
    var s = (o.pre ? o.pre + '<br>' : '') + t(M(part) + '\\div ' + M(whole) + '=' + qT) + '<br>' + t(qT + '\\times 100' + (exact ? '=' : '\\approx ') + dS(ans) + '\\%') + (o.end || '');
    var p = PK.part(prompt, PK.pct(P0, dp, dg, { nr: o.nr }), dS(ans), dS(ans) + '\\%', s, o.hints || ['Percent = part ÷ whole × 100.', 'The whole is the gross pay.'], o.text || 'pct of gross', o.nr ? { nr: true } : { after: '%' });
    p.bad = [dS(rnd(whole / part * 100, 1)), dS(rnd(100 - P0, 1))].filter(function (x) { return !near(Number(x), ans); });
    return p;
  };
  /* a rate from a deduction and the pay it was taken from (exact) */
  U.ratePart = function (prompt, ded, base, rate, o) {
    o = o || {};
    var dg = function (v) {
      if (near(v, rnd(base / ded, 2)) || near(v, rnd(base / ded * 100, 2)) || near(v, rnd(base / ded, 4))) return { code: 'u2l7-flip', hint: 'Divide the deduction by the pay: ' + t(M(ded) + '\\div ' + M(base)) + '.' };
      if (near(v, rate * 10)) return { code: 'u1l7-x1000', hint: 'Multiply the decimal by ' + t('100') + ', not ' + t('1000') + '.' };
      if (near(v, rate / 10)) return { code: 'u1l7-x10', hint: 'Multiply the decimal by ' + t('100') + ', not ' + t('10') + '.' };
      return null;
    };
    var p = PK.part(prompt, PK.pct(rate, null, dg, { nr: o.nr }), dS(rate), dS(rate) + '\\%', t(M(ded) + '\\div ' + M(base) + '=' + dec(rate)) + '<br>' + t(dec(rate) + '\\times 100=' + pT(rate)) + '<br>Check: ' + t(M(base) + '\\times ' + dec(rate) + '=' + M(ded)) + ' ✓', o.hints || ['rate = deduction ÷ pay it was taken from × 100.'], o.text || 'find rate', o.nr ? { nr: true } : { after: '%' });
    p.bad = [dS(rnd(base / ded, 2)), dS(rate / 10)];
    return p;
  };
  /* ---- pay stubs ---- */
  /* HTML stub (display only). rows: [[label, hours, rate, amount, bold]] */
  U.stubHtml = function (head, rows, cols) {
    cols = cols || ['', 'Hours', 'Rate', 'Amount'];
    var TD = 'border:1.5px solid #9aa3ad;padding:3px 9px;', h = '<div class="u2l7-stub" style="margin:6px 0">' + (head ? '<div style="font-size:0.95em;margin-bottom:3px">' + head + '</div>' : '') + '<table style="border-collapse:collapse;font-size:0.95em"><tr>' + cols.map(function (c, j) { return '<th style="' + TD + 'background:#f1efe9;text-align:' + (j ? 'center' : 'left') + '">' + c + '</th>'; }).join('') + '</tr>';
    rows.forEach(function (rw) { var b = rw[rw.length - 1] === true; h += '<tr>' + rw.slice(0, cols.length).map(function (c, j) { return '<td style="' + TD + 'text-align:' + (j === 0 ? 'left' : j === cols.length - 1 ? 'right' : 'center') + (b ? ';font-weight:600' : '') + '">' + (c == null ? '' : c) + '</td>'; }).join('') + '</tr>'; });
    return h + '</table></div>';
  };
  U.head = function (co, city, emp, period) { return '<b>' + co + '</b>, ' + city + ', AB<br>Employee: ' + emp + (period ? ' &nbsp;·&nbsp; Pay period: ' + period : ''); };
  /* a fill-in pay stub (areabox). rows: [{ label (plain text), cells: [c0, c1, c2] each '' | text (LaTeX) | { blank: true, chk, key } }] */
  U.stubPart = function (prompt, rows, cols, sol2, hints, text, o) {
    o = o || {}; var blanks = [], cells = [], keyCells = [];
    rows.forEach(function (rw, i) {
      cells.push(rw.cells.map(function (c) { return c && c.blank ? null : (c || ''); }));
      keyCells.push(rw.cells.map(function (c, j) { if (c && c.blank) { blanks.push({ where: 'cell', i: i, j: j, name: c.name || rw.label, chk: c.chk }); return c.key; } return c || ''; }));
    });
    var rl = rows.map(function (rw) { return rw.bold ? '\\textbf{' + rw.label + '}' : '\\text{' + rw.label + '}'; }), cl = cols.map(function (c) { return '\\text{' + c + '}'; });
    var p = PK.tablePart(prompt, { rows: rl, cols: cl, cells: cells, corner: o.corner || '\\text{Pay stub}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' }, PK.tableChk(blanks), { rows: rl, cols: cl, cells: keyCells }, sol2, hints, text);
    return p;
  };
  /* money cell text for a fill-in table (LaTeX) */
  U.cM = function (x) { return M(x); };
  U.cP = function (p) { return pT(p); };
  /* a whole hourly pay stub: o = { h, rate, ot (hours), mult (1.5), deds (as U.std), blankOTRate } → { rows, W, sol } */
  U.hourlyStub = function (o) {
    var mult = o.mult || 1.5, otR = rnd(o.rate * mult, 2), reg = cents(o.h * o.rate), otA = o.ot ? cents(o.ot * otR) : 0, g = cents(reg + otA), W = U.work(g, o.deds);
    var rows = [{ label: 'Regular', cells: [dS(o.h), M(o.rate), { blank: true, name: 'Regular amount', chk: PK.money(reg, function (v) { if (near(v, cents(o.h + o.rate))) return { code: 'u2l7-add-hr', hint: 'Multiply the hours by the rate.' }; return null; }), key: m$(reg) }] }];
    if (o.ot) {
      rows.push({ label: 'Overtime', cells: [dS(o.ot), o.blankOTRate === false ? M(otR) : { blank: true, name: 'Overtime rate', chk: PK.money(otR, function (v) {
        if (near(v, o.rate * 2)) return { code: 'u2l7-double', hint: 'That’s double time. Time and a half is the rate ' + t('\\times 1.5') + '.' };
        if (near(v, o.rate + 1.5)) return { code: 'u2l7-plus-15', hint: 'Multiply the rate by ' + t('1.5') + ' — don’t add ' + t('1.50') + '.' };
        if (near(v, o.rate / 2)) return { code: 'u2l7-half-only', hint: 'That’s only the extra half. Time and a half is ' + t(M(o.rate) + '\\times 1.5') + '.' };
        return null; }), key: m$(otR) }, { blank: true, name: 'Overtime amount', chk: PK.money(otA, function (v) { if (near(v, cents(o.ot * o.rate))) return { code: 'u2l7-ot-reg-rate', hint: 'Use the <b>overtime</b> rate (time and a half) for the overtime hours.' }; return null; }), key: m$(otA) }] });
    }
    rows.push({ label: 'Gross pay', bold: true, cells: ['', '', { blank: true, name: 'Gross pay', chk: PK.money(g, function (v) { if (o.ot && near(v, reg)) return { code: 'u2l7-missed-ot', hint: 'Add the overtime amount to the regular amount.' }; if (o.ot && near(v, cents((o.h + o.ot) * o.rate))) return { code: 'u2l7-ot-reg-rate', hint: 'The overtime hours are paid at the overtime rate.' }; return null; }), key: m$(g) }] });
    W.deds.forEach(function (d) { rows.push({ label: d.name, cells: ['', d.rate != null ? pT(d.rate) : '', d.rate != null ? { blank: true, name: d.name, chk: U.dedChk(d, W), key: m$(d.exact) } : M(d.v)] }); });
    rows.push({ label: 'Total deductions', bold: true, cells: ['', '', { blank: true, name: 'Total deductions', chk: U.totalChk(W), key: m$(W.total) }] });
    rows.push({ label: 'Net pay', bold: true, cells: ['', '', { blank: true, name: 'Net pay', chk: U.netChk(W), key: m$(W.net) }] });
    var pre = [(o.ot ? 'overtime rate ' + t('=' + M(o.rate) + '\\times ' + dS(mult) + '=' + M(otR)) + '; ' : '') + 'regular ' + t('=' + dS(o.h) + '\\times ' + M(o.rate) + '=' + M(reg)) + (o.ot ? '; overtime ' + t('=' + dS(o.ot) + '\\times ' + M(otR) + '=' + M(otA)) : ''), 'gross ' + t('=' + (o.ot ? M(reg) + '+' + M(otA) + '=' : '') + M(g))];
    return { rows: rows, W: W, g: g, otR: otR, reg: reg, otA: otA, sol: sol(U.lines(W, { pre: pre })) };
  };
  /* a word answer: 'too much' / 'too little' (or the store / job letter) */
  U.wordChk = function (groups, right, nudge) { // groups: { key: [words…] }
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var hit = null; Object.keys(groups).forEach(function (k) { groups[k].forEach(function (w) { if (s.indexOf(w) >= 0 && !hit) hit = k; }); });
      if (!hit) return form('u2l7-word', nudge);
      return hit === right ? ok() : wrong('u2l7-wrong-way', null);
    };
  };
  U.muchChk = function (tooMuch, why) {
    var c = U.wordChk({ much: ['much', 'more', 'over', 'high', 'big'], little: ['little', 'less', 'under', 'short', 'low', 'small'] }, tooMuch ? 'much' : 'little', 'Type <b>too much</b> or <b>too little</b>.');
    return function (resp) { var r = c(resp); if (r.v === 'wrong') return wrong('u2l7-wrong-way', why); return r; };
  };

  HW.addCodes({
    'u2l7-no-dec': 'Deduction: rate not changed to a decimal', 'u2l7-one-place': 'Deduction: 5.95% as 0.595 (decimal moved 1 place)', 'u2l7-left-for-ded': 'Gave the pay left instead of the deduction',
    'u2l7-tax-on-gross': 'Income tax on the gross pay instead of the taxable income', 'u2l7-cpp-on-taxable': 'CPP/EI on the taxable income instead of the gross', 'u2l7-missed-ded': 'Left a deduction out of the total',
    'u2l7-net-for-total': 'Gave the net pay for the total deductions', 'u2l7-added': 'Added the deductions to the gross pay', 'u2l7-round-first': 'Added unrounded deductions (a cent off)', 'u2l7-total-for-net': 'Gave the total deductions for the net pay',
    'u2l7-tax-only': 'Took off only the income tax', 'u2l7-net-from-taxable': 'Net pay worked from the taxable income', 'u2l7-taxable-for-net': 'Gave the taxable income for the net pay', 'u2l7-no-before': 'Taxable income: before-tax deductions not taken off',
    'u2l7-net-for-taxable': 'Gave the net pay for the taxable income', 'u2l7-flip': 'Percent upside down (whole ÷ part)', 'u2l7-other-pct': 'Gave the other percent (take-home ↔ deductions)', 'u2l7-wrong-whole': 'Percent: divided by the wrong whole',
    'u2l7-dollars': 'Gave dollars instead of a percent', 'u2l7-add-hr': 'Added hours and rate', 'u2l7-double': 'Used double time for time and a half', 'u2l7-plus-15': 'Added 1.50 to the rate', 'u2l7-half-only': 'Gave only the extra half',
    'u2l7-ot-reg-rate': 'Overtime hours at the regular rate', 'u2l7-missed-ot': 'Gross pay: left out the overtime', 'u2l7-word': 'Word answer unreadable', 'u2l7-wrong-way': 'Too much / too little the wrong way round',
    'u2l7-gross-for-ded': 'Used the gross pay for the deduction', 'u2l7-raise-gross': 'Gave the raise in gross pay, not net', 'u2l7-ytd-week': 'Mixed this-pay and year-to-date amounts', 'u2l7-weeks': 'Weeks: divided the wrong way',
    'u2l7-tax-saving-total': 'Gave a tax amount, not the saving', 'u2l7-one-job': 'Used only one job', 'u2l7-extra-gross': 'Gave the extra gross, not the extra take-home'
  });
  HW.addPartial({
    'u2l7-no-dec': 'n', 'u2l7-one-place': 'b', 'u2l7-left-for-ded': 's', 'u2l7-tax-on-gross': 'b', 'u2l7-cpp-on-taxable': 'b', 'u2l7-missed-ded': 's', 'u2l7-net-for-total': 's', 'u2l7-added': 'n',
    'u2l7-total-for-net': 's', 'u2l7-tax-only': 'b', 'u2l7-net-from-taxable': 'b', 'u2l7-taxable-for-net': 's', 'u2l7-no-before': 'b', 'u2l7-net-for-taxable': 'b', 'u2l7-flip': 'n', 'u2l7-other-pct': 's',
    'u2l7-wrong-whole': 'b', 'u2l7-dollars': 'b', 'u2l7-add-hr': 'n', 'u2l7-double': 'b', 'u2l7-plus-15': 'n', 'u2l7-half-only': 'b', 'u2l7-ot-reg-rate': 'b', 'u2l7-missed-ot': 's', 'u2l7-wrong-way': 'n',
    'u2l7-gross-for-ded': 'b', 'u2l7-raise-gross': 'b', 'u2l7-ytd-week': 'b', 'u2l7-weeks': 'n', 'u2l7-tax-saving-total': 's', 'u2l7-one-job': 's', 'u2l7-extra-gross': 's'
  });

  /* ================= Lesson 7 generators ================= */
  var NAMES = ['Owen', 'Brooke', 'Dana', 'Tyler', 'Jasmine', 'Jun', 'Dev', 'Kayla', 'Rosa', 'Leo', 'Mia', 'Amir', 'Talia', 'Reece', 'Nia', 'Caleb', 'Priya', 'Logan', 'Hailey', 'Mateo'];
  var CITIES = ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Airdrie', 'Medicine Hat', 'Grande Prairie', 'Okotoks', 'Cochrane', 'Canmore', 'Camrose', 'Brooks'];
  function step(r, lo, hi, st) { return rnd(lo + st * r.int(0, Math.round((hi - lo) / st)), 2); }
  function tbl(head, rows) { return U.stubHtml(null, rows, head); }
  /* worked-example grosses (Kai 684, Hana 1240, Noah 234, Sofia 960, Marcus 810, Ethan 2080, Lucas 897.60, Aisha 674.50) */
  var EXG = [684, 1240, 234, 960, 810, 2080, 897.6, 674.5];
  function notEx(g) { return !EXG.some(function (x) { return near(x, g); }); }

  /* Q1 vocabulary */
  var VOC = [
    { id: 'a', w: 'ded', s: ['Money your employer takes off your pay is a ____.', 'Each amount taken off your pay before you are paid is a ____.'] },
    { id: 'b', w: 'net', s: ['The money that goes into your bank account is your ____.', 'Your take-home pay is also called your ____.'] },
    { id: 'c', w: 'gross', s: ['Everything you earned before anything is taken off is your ____.', 'Your wages, overtime, commission and bonuses for a pay period add up to your ____.'] },
    { id: 'd', w: 'ti', s: ['Gross pay minus before-tax deductions is your ____.', 'The amount your income tax is worked out on is your ____.'] },
    { id: 'e', w: 'stub', s: ['The paper (or web page) that lists your pay and deductions is a ____.', 'Each payday you get a ____ that shows your gross pay, every deduction and your net pay.'] }];
  var WORDS = { gross: 'gross pay', net: 'net pay', ded: 'deduction', stub: 'pay stub', ti: 'taxable income' };
  function q1(r) {
    var rows = VOC.map(function (v) { return { id: v.id, html: '(' + v.id + ') ' + r.pick(v.s).replace('____', '<b>____</b>') }; }), want = {};
    VOC.forEach(function (v) { want[v.id] = v.w; });
    var cols = r.shuffle(Object.keys(WORDS)).map(function (k) { return { id: k, html: WORDS[k] }; });
    var WHY = { gross: 'Gross pay is <b>everything</b> you earned, before deductions.', net: 'Net pay is what is <b>left</b> after deductions — the money you actually get.', ded: 'A deduction is one amount taken <b>off</b> your pay.', stub: 'The pay stub is the paper or page that <b>lists</b> it all.', ti: 'Taxable income = gross pay − before-tax deductions.' };
    return P.grid('Choose the word that fills each blank.', rows, cols, want, { why: function (row, got) { return { code: 'u2l7-vocab', hint: 'Row (' + row + '): ' + (WHY[got] || 'check the meaning of each word.') }; } },
      VOC.map(function (v) { return '(' + v.id + ') ' + WORDS[v.w]; }).join('<br>'), ['Gross = before anything comes off. Net = what is left. Each amount taken off is a deduction.'], 'vocab');
  }
  function q1f(r) {
    return P.mc(r, 'Why is your net pay less than your gross pay?', [
      { html: 'My employer takes deductions (CPP, EI, income tax and others) off my gross pay before I am paid, so I take home less than I earned.', right: true },
      { html: 'Net pay counts only my regular hours, not my overtime.', why: 'Overtime is part of the gross pay. Net pay is less because the <b>deductions</b> come off.', code: 'ot' },
      { html: 'The bank keeps part of my pay when it goes into my account.', why: 'The money comes off before you are paid: your employer takes the deductions.', code: 'bank' },
      { html: 'Gross pay is worked out at a higher hourly rate than net pay.', why: 'Both use the same pay. Net pay = gross pay − total deductions.', code: 'rate' }],
      'Sample: my employer takes deductions (CPP, EI, income tax and others) off my gross pay before I am paid, so I take home less than I earned.', ['Net pay = gross pay − total deductions.'], 'why net less');
  }
  /* Q2: one row of the table */
  function q2row(r, kind) {
    if (kind === 'a') {
      var v = find(function () { var g = step(r, 360, 620, 5), d = rnd(g * (0.11 + r.int(0, 60) / 1000), 2); return { g: g, d: d }; }, function (s) { return notEx(s.g); }, { g: 450, d: 63.27 });
      var W0 = { g: v.g, total: v.d, net: cents(v.g - v.d), deds: [], rawTotal: v.d };
      var p = PK.moneyPart(tbl(['', 'Gross pay', 'Total deductions', 'Net pay'], [['(a)', D$(v.g), D$(v.d), '?']]) + 'Find the net pay.', W0.net, function (x) { if (near(x, cents(v.g + v.d))) return { code: 'u2l7-added', hint: 'Deductions come <b>off</b>: subtract.' }; return null; },
        'net pay ' + t('=' + M(v.g) + '-' + M(v.d) + '=' + M(W0.net)), ['Net pay = gross pay − total deductions.'], 'Q2a');
      p.bad = [m$(v.g + v.d)];
      return p;
    }
    var big = kind === 'c', g = find(function () { return big ? step(r, 1800, 2700, 4) : step(r, 950, 1350, 0.5); }, notEx, big ? 2316 : 1125.5);
    var tx = big ? r.pick([15, 16, 17, 18]) : r.pick([12, 13, 14, 15]), extra = big ? [{ name: r.pick(['Health plan', 'Dental plan', 'Health and dental']), amt: step(r, 30, 55, 0.25) }] : [];
    var W = U.work(g, U.std(tx, extra));
    var dl = W.deds.map(function (d) { return d.name + ' ' + D$(d.v); }).join(', ');
    var p2 = U.fields(tbl(['', 'Gross pay', 'Deductions'], [['(' + kind + ')', D$(g), dl]]) + 'Find the total deductions and the net pay.', { g: W.g, ti: W.ti, deds: W.deds.map(function (d) { return Object.assign({}, d, { exact: d.v, rate: null }); }), total: W.total, net: W.net, before: false, rawTotal: W.total }, ['total', 'net'],
      { sol: sol(['total ' + t('=' + W.deds.map(function (d) { return M(d.v); }).join('+') + '=' + M(W.total)), 'net ' + t('=' + M(g) + '-' + M(W.total) + '=' + M(W.net))]), hints: ['Add every deduction to get the total.', 'Net pay = gross pay − total deductions.'], text: 'Q2' + kind });
    return p2;
  }
  /* Q3: a deduction at a rate: the decimal and the amount */
  function q3(r, name, rate, base) {
    var W = U.work(base, [{ name: name, rate: rate }]), d = W.deds[0];
    var decChk = PK.dec(rate / 100, null, function (v) {
      if (near(v, rate / 10)) return { code: 'u2l7-one-place', hint: 'Move the decimal point <b>2</b> places left: ' + t(pT(rate) + '=' + dec(rate)) + '.' };
      if (near(v, rate)) return { code: 'pct-not-div100', hint: 'Divide by ' + t('100') + ' (move the decimal point 2 places left).' };
      if (near(v, rate / 1000)) return { code: 'pct-three-places', hint: 'Move the decimal point 2 places left, not 3.' };
      return null;
    });
    var p = PK.fields(name + ' at ' + t(pT(rate)) + ' of ' + t(M(base)), [{ label: t(pT(rate)) + ' as a decimal', name: 'Decimal' }, { label: name, before: '$', name: name }], [decChk, U.dedChk(d, W)], [dec(rate), m$(d.exact)], t(pT(rate) + '=' + dec(rate)) + ', ' + name + ' ' + t(M(d.exact)),
      t(pT(rate) + '=' + dec(rate)) + '<br>' + t(M(base) + '\\times ' + dec(rate) + eqM(d.exact)), ['Percent → decimal: move the decimal point 2 places left.', 'Deduction = pay × the decimal. Round to the cent.'], 'Q3 ' + name);
    p.bad = [[dS(rate / 10), m$(rate * base / 10)], [dec(rate), m$(rate * base)]];
    return p;
  }
  /* Q11 / Jun's stub */
  function junShared(r) {
    return find(function () {
      var h = r.int(26, 36), rate = step(r, 16.5, 19.75, 0.25), tx = r.pick([10, 11, 12, 13, 14]), hp = step(r, 7.5, 12.5, 0.25), err = r.pick(['ei', 'tax', 'total', 'net', 'net']);
      return { h: h, rate: rate, tx: tx, hp: hp, err: err, name: r.pick(['Jun Park', 'Ana Silva', 'Ben Okafor', 'Maya Chen', 'Sam Novak']), co: r.pick(['Chinook Garden Market', 'Bow Valley Foods', 'Prairie Hardware', 'Aspen Pet Supply']), city: r.pick(CITIES), swap: r.chance(0.5) };
    }, function (s) {
      var g = cents(s.h * s.rate); if (near(g, 584) && s.err === 'net') return false;
      var W = U.work(g, U.std(s.tx, [{ name: 'Health plan', amt: s.hp }])), str = m$(W.net);
      if (s.err === 'net') { var sw = swapNet(str); return sw && Math.abs(Number(sw) - W.net) > 5; }
      return true;
    }, { h: 32, rate: 18.25, tx: 13, hp: 9.5, err: 'net', name: 'Jun Park', co: 'Chinook Garden Market', city: 'Calgary', swap: true });
  }
  function swapNet(str) { // swap the first two different neighbouring digits (545.25 for 454.25)
    var d = str.replace('.', ''); for (var i = 0; i < d.length - 3; i++) if (d[i] !== d[i + 1]) { var s2 = d.slice(0, i) + d[i + 1] + d[i] + d.slice(i + 2); if (s2[0] === '0') continue; return s2.slice(0, -2) + '.' + s2.slice(-2); } return null;
  }
  function junStub(s) {
    var g = cents(s.h * s.rate), W = U.work(g, U.std(s.tx, [{ name: 'Health plan', amt: s.hp }])), cpp = W.deds[0], ei = W.deds[1], tax = W.deds[2];
    var shown = { cpp: cpp.v, ei: ei.v, tax: tax.v, hp: s.hp }, why = '';
    if (s.err === 'ei') { shown.ei = r2(pctOf(16.4, g)); why = 'The EI was worked at ' + t('16.4\\%') + ' (' + t('0.164') + ') instead of ' + t('1.64\\%') + ' (' + t('0.0164') + ').'; }
    if (s.err === 'tax') { var wr = s.tx * 10 % 10 === 0 && s.tx >= 10 ? Number(String(s.tx).split('').reverse().join('')) : s.tx + 10; if (wr === s.tx) wr = s.tx + 10; shown.tax = r2(pctOf(wr, g)); s.wrongRate = wr; why = 'The income tax was worked at ' + t(wr + '\\%') + ' instead of ' + t(s.tx + '\\%') + '.'; }
    var tot = cents(shown.cpp + shown.ei + shown.tax + shown.hp);
    if (s.err === 'total') { tot = cents(shown.cpp + shown.ei + shown.tax); why = 'The total deductions leaves out the health plan.'; }
    var net = cents(g - tot);
    if (s.err === 'net') { net = Number(swapNet(m$(W.net))); why = 'The net pay has two digits switched: ' + t(M(g) + '-' + M(W.total) + '=' + M(W.net)) + '.'; }
    var rows = [['Regular', String(s.h), D$(s.rate), D$(g)], ['<b>Gross pay</b>', '', '', '<b>' + D$(g) + '</b>'], ['CPP', '', '5.95%', D$(shown.cpp)], ['EI', '', '1.64%', D$(shown.ei)], ['Income tax', '', s.tx + '%', D$(shown.tax)], ['Health plan', '', '', D$(shown.hp)], ['<b>Total deductions</b>', '', '', '<b>' + D$(tot) + '</b>'], ['<b>Net pay</b>', '', '', '<b>' + D$(net) + '</b>']];
    return { g: g, W: W, shown: shown, tot: tot, net: net, why: why, html: U.stubHtml(U.head(s.co, s.city, s.name, 'Sept. 7–13, 2026'), rows), diff: cents(net - W.net) };
  }
  /* Q12 Dev */
  function devShared(r) { return find(function () { return { g: step(r, 700, 1150, 50), tx: r.pick([12, 13, 14, 15, 16, 17]), name: r.pick(['Dev', 'Arjun', 'Nico', 'Eli', 'Omar']) }; }, function () { return true; }, { g: 900, tx: 15, name: 'Dev' }); }
  /* Q13 / Extra 11 what-if */
  function kayShared(r) { return find(function () { return { h: r.int(24, 34), w: step(r, 15.5, 18.5, 0.25), up: r.pick([1, 1.25, 1.5, 1.75, 2, 0.75]), tx: r.pick([10, 11, 12, 13]), name: r.pick(['Kayla', 'Jada', 'Sienna', 'Ava', 'Zara']) }; }, function (s) { return true; }, { h: 30, w: 17, up: 1.5, tx: 12, name: 'Kayla' }); }

  HW.addCodes({ 'u2l7-vocab': 'Pay words mixed up' });
  HW.addPartial({ 'u2l7-vocab': 's' });

  HW.defineLesson({
    id: 'u2l7', unit: 2, num: '7', title: 'Deductions and Net Pay: Reading a Pay Stub', outcome: 'N2',
    blurb: 'CPP, EI and income tax, other deductions, before-tax deductions and taxable income, net pay and percent kept, and checking a pay stub.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1ae', sub: 'a–e', level: 'BEG', make: function (r) { return q1(r); } }, { id: '1f', sub: 'f', level: 'BEG', make: function (r) { return q1f(r); } }] },
      { num: '2', stem: 'Complete the table.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { return q2row(r, 'a'); } },
        { id: '2b', level: 'BEG', make: function (r) { return q2row(r, 'b'); } },
        { id: '2c', level: 'BEG', make: function (r) { return q2row(r, 'c'); } }] },
      { num: '3', stem: 'Change each rate to a decimal, then find the deduction. Round to the nearest cent.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return q3(r, 'CPP', 5.95, find(function () { return step(r, 400, 720, 10); }, notEx, 520)); } },
        { id: '3b', level: 'BEG', make: function (r) { return q3(r, 'EI', 1.64, find(function () { return step(r, 600, 1050, 10); }, function (x) { return notEx(x) && !near(pctOf(1.64, x), r2(pctOf(1.64, x))); }, 880)); } },
        { id: '3c', level: 'BEG', make: function (r) { return q3(r, 'Income tax', r.pick([9, 11, 12, 13, 14, 16]), step(r, 1100, 1700, 10)); } },
        { id: '3d', level: 'EMG', make: function (r) { return q3(r, 'Union dues', r.pick([2.25, 1.75, 2.5, 1.25, 2.75]), step(r, 1300, 1900, 10)); } }] },
      { num: '4', stem: function (sh) { return sh.name + '’s gross pay is ' + t(M(sh.g)) + '. Her pay stub shows EI of ' + t(M(sh.bad)) + ' at a rate of ' + t('1.64\\%') + '.'; },
        shared: function (r) { var g = step(r, 600, 1000, 50); return { g: g, bad: r2(pctOf(16.4, g)), name: r.pick(['Mia', 'Ruby', 'Lila', 'Nora', 'Isla']) }; },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) {
            var two = sh.g * 0.02;
            return P.mc(r, 'Without working out the exact answer, why can’t this be right?', [
              { html: t('1\\%') + ' of ' + t(M(sh.g)) + ' is ' + t(M(sh.g / 100)) + ', so ' + t('1.64\\%') + ' is less than ' + t(M(two)) + ' (that’s ' + t('2\\%') + '). ' + t(M(sh.bad)) + ' is far too big.', right: true },
              { html: 'EI is taken off the net pay, not the gross pay, so it should be bigger.', why: 'EI is a percent of the <b>gross</b> pay. Estimate ' + t('1\\%') + ' of ' + t(M(sh.g)) + ' first.', code: 'net' },
              { html: t(M(sh.bad)) + ' is too small: ' + t('1.64\\%') + ' of ' + t(M(sh.g)) + ' should be more than ' + t('\\$200') + '.', why: t('1\\%') + ' of ' + t(M(sh.g)) + ' is only ' + t(M(sh.g / 100)) + '. ' + t('1.64\\%') + ' must be less than double that.', code: 'small' },
              { html: 'EI is always a fixed ' + t('\\$10.00') + ' a pay.', why: 'EI is a percent of your pay (here ' + t('1.64\\%') + ').', code: 'fixed' }],
              'Estimate: ' + t('1\\%') + ' of ' + t(M(sh.g)) + ' is ' + t(M(sh.g / 100)) + ', and ' + t('1.64\\%') + ' is less than ' + t('2\\%') + ', which is ' + t(M(two)) + '. ' + t(M(sh.bad)) + ' is far too big (it is ' + t('16.4\\%') + ').', ['Find ' + t('1\\%') + ' of the pay: move the decimal point 2 places left.'], 'why EI wrong');
          } },
          { id: '4b', level: 'BEG', make: function (r, sh) { var W = U.work(sh.g, [{ name: 'EI', rate: 1.64 }]), d = W.deds[0]; var p = PK.moneyPart('Find the correct EI.', d.exact, U.dedDiag(d, W), t(M(sh.g) + '\\times 0.0164' + eqM(d.exact)), ['EI = gross pay × 0.0164.'], 'correct EI'); p.bad = [m$(sh.bad)]; return p; } }] },
      { num: '5', stem: function (sh) { return sh.name + ' is a lifeguard at a ' + sh.city + ' rec centre. He earns ' + t(M(sh.w)) + ' an hour and works ' + t(dS(sh.h)) + ' hours this week. His deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + '.'; },
        shared: function (r) { return { w: step(r, 15.4, 18.6, 0.2), h: step(r, 16, 28, 0.5), tx: r.pick([7, 8, 9, 10]), name: r.pick(['Owen', 'Liam', 'Noel', 'Theo', 'Kian']), city: r.pick(CITIES) }; },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) { var g = cents(sh.h * sh.w); var p = PK.moneyPart('Find his gross pay.', g, function (v) { if (near(v, cents(sh.h + sh.w))) return { code: 'u2l7-add-hr', hint: 'Multiply the hours by the hourly rate.' }; return null; }, t(dS(sh.h) + '\\times ' + M(sh.w) + '=' + M(g)), ['Gross pay = hours × rate.'], 'Owen gross'); return p; } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var W = U.work(cents(sh.h * sh.w), U.std(sh.tx)); return U.fields('Find each deduction and his net pay.', W, ['CPP', 'EI', 'Income tax', 'total', 'net'], { text: 'Owen net' }); } }] },
      { num: '6', stem: '', parts: [{ id: '6', level: 'PRG', make: function (r) {
        var g = find(function () { return step(r, 1500, 2300, 2.5); }, notEx, 1875), tx = r.pick([15, 16, 17, 18]), hp = step(r, 24, 42, 0.2), don = r.pick([5, 10, 15, 20, 25]), who = r.pick(['children’s hospital', 'food bank', 'animal shelter']);
        var job = r.pick([['Brooke', 'a dental assistant'], ['Ella', 'a pharmacy technician'], ['Tara', 'a vet assistant'], ['Grace', 'a medical office assistant']]), city = r.pick(CITIES);
        var W = U.work(g, U.std(tx, [{ name: 'Health and dental', amt: hp }, { name: 'Donation', amt: don }]));
        return U.fields(job[0] + ' is ' + job[1] + ' in ' + city + '. Her gross pay for two weeks is ' + t(M(g)) + '. Her deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', income tax ' + t(tx + '\\%') + ', a health and dental plan of ' + t(M(hp)) + ', and a ' + t(M(don)) + ' donation to the ' + who + '. Find her net pay.', W, ['CPP', 'EI', 'Income tax', 'total', 'net'], { text: 'Brooke net' });
      } }] },
      { num: '7', stem: '', parts: [{ id: '7', level: 'PRG', make: function (r) {
        var v = find(function () { return { rate: step(r, 18.5, 24.5, 0.1), ot: r.pick([3, 4, 5, 6, 7, 2.5, 3.5, 5.5]), tx: r.pick([13, 14, 15, 16, 17]), fixed: r.pick([['Parking', 15], ['Parking', 12.5], ['Health plan', 11.4], ['Staff jacket', 10]]) }; }, function (s) { return !(near(s.rate, 19.2) && s.ot === 4.5); }, { rate: 21.5, ot: 6, tx: 16, fixed: ['Parking', 15] });
        var S = U.hourlyStub({ h: 40, rate: v.rate, ot: v.ot, deds: U.std(v.tx, [{ name: v.fixed[0], amt: v.fixed[1] }]) });
        var who = r.pick([['Dana Kowalski', 'Three Sisters Ski & Board', 'Canmore', 'a ski rental shop'], ['Riley Dubois', 'Peace Country Tire', 'Grande Prairie', 'a tire shop'], ['Sasha Petrov', 'Big Rock Rentals', 'Okotoks', 'an equipment rental shop']]);
        return U.stubPart(who[0].split(' ')[0] + ' works at ' + who[3] + ' in ' + who[2] + '. Overtime is paid at time and a half. Complete the pay stub.<br>' + U.head(who[1], who[2], who[0], 'Dec. 14–20, 2026'), S.rows, ['Hours', 'Rate', 'Amount'], S.sol,
          ['Overtime rate = rate × 1.5. Each amount = hours × rate. Gross = the two amounts added.', 'Each deduction = gross × rate (as a decimal), to the cent. Net = gross − total deductions.'], 'Dana stub');
      } }] },
      { num: '8', stem: function (sh) { return sh.name + '’s gross pay is ' + t(M(sh.g)) + ' and his net pay is ' + t(M(sh.n)) + '.'; },
        shared: function (r) { return find(function () { var g = step(r, 1200, 1800, 10), P0 = rnd(20 + r.int(0, 80) / 10, 1); return { g: g, P: P0, d: cents(g * P0 / 100), n: cents(g - g * P0 / 100), name: r.pick(['Tyler', 'Mason', 'Ezra', 'Cole', 'Jack']) }; }, function (s) { return s.P % 1 !== 0 && notEx(s.g); }, { g: 1450, P: 24.6, d: 356.7, n: 1093.3, name: 'Tyler' }); },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { var p = PK.moneyPart('What are his total deductions?', sh.d, function (v) { if (near(v, cents(sh.g + sh.n))) return { code: 'u2l7-added', hint: 'Subtract: total deductions = gross pay − net pay.' }; return null; }, t(M(sh.g) + '-' + M(sh.n) + '=' + M(sh.d)), ['Gross pay − net pay = what was taken off.'], 'Tyler total'); p.bad = [m$(sh.g + sh.n)]; return p; } },
          { id: '8b', level: 'EMG', make: function (r, sh) { return U.pctPart('What percent of his gross pay are his deductions? Round to the nearest tenth if needed.', sh.d, sh.g, { comp: 'he takes home', wrongWhole: sh.n, text: 'Tyler ded %' }); } },
          { id: '8c', level: 'EMG', make: function (r, sh) { return U.pctPart('What percent of his gross pay does he take home?', sh.n, sh.g, { comp: 'that goes to deductions', end: '<br>Check: ' + t(dS(sh.P) + '\\%+' + dS(rnd(100 - sh.P, 1)) + '\\%=100\\%') + ' ✓', text: 'Tyler home %' }); } }] },
      { num: '9', stem: 'Find each rate as a percent.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { var g = find(function () { return step(r, 600, 1000, 25); }, function (x) { return !near(x, 800); }, 750), d = pctOf(1.64, g); return U.ratePart('EI of ' + t(M(d)) + ' on gross pay of ' + t(M(g)), d, g, 1.64, { text: 'EI rate' }); } },
        { id: '9b', level: 'BEG', make: function (r) { var tx = r.pick([13, 14, 16, 17, 18, 19]), ti = step(r, 1000, 1500, 10), d = pctOf(tx, ti); return U.ratePart('income tax of ' + t(M(d)) + ' on taxable income of ' + t(M(ti)), d, ti, tx, { text: 'tax rate' }); } },
        { id: '9c', level: 'EMG', make: function (r) { var v = find(function () { var u = r.pick([1.5, 1.25, 2.5, 1.75, 2.25]), g = step(r, 1400, 2000, 20); return { u: u, g: g }; }, function (s) { return near(pctOf(s.u, s.g), r2(pctOf(s.u, s.g))); }, { u: 1.5, g: 1820 }); var d = pctOf(v.u, v.g); return U.ratePart('union dues of ' + t(M(d)) + ' on gross pay of ' + t(M(v.g)), d, v.g, v.u, { text: 'dues rate' }); } }] },
      { num: '10', stem: function (sh) { return sh.name + ' is a health care aide in ' + sh.city + '. Her gross pay for two weeks is ' + t(M(sh.g)) + '. She puts ' + t(pT(sh.pen)) + ' of her gross pay into the company pension plan (a before-tax deduction). Her other deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', and income tax ' + t(sh.tx + '\\%') + ' of her taxable income.'; },
        shared: function (r) { return { g: step(r, 1800, 2600, 20), pen: r.pick([3, 4, 5, 3.5, 4.5]), tx: r.pick([17, 18, 19, 20, 21]), name: r.pick(['Jasmine', 'Alicia', 'Mira', 'Selena']), city: r.pick(['Medicine Hat', 'Red Deer', 'St. Albert', 'Fort McMurray']) }; },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { var W = U.work(sh.g, U.std(sh.tx, [], [{ name: 'Pension', rate: sh.pen, before: true }])); return U.fields('Find her pension deduction and her taxable income.', W, ['Pension', 'taxable'], { sol: sol(U.lines(W, { noTotal: true }).slice(0, 2)), hints: ['Pension = gross pay × its rate.', 'Taxable income = gross pay − pension.'], text: 'Jasmine taxable' }); } },
          { id: '10b', level: 'PRG', make: function (r, sh) { var W = U.work(sh.g, U.std(sh.tx, [], [{ name: 'Pension', rate: sh.pen, before: true }])); return U.fields('Find her CPP, EI and income tax.', W, ['CPP', 'EI', 'Income tax'], { sol: sol(U.lines(W, { noTotal: true })), hints: ['CPP and EI are on the gross pay.', 'Income tax is on the taxable income from (a).'], text: 'Jasmine deductions' }); } },
          { id: '10c', level: 'PRG', make: function (r, sh) { var W = U.work(sh.g, U.std(sh.tx, [], [{ name: 'Pension', rate: sh.pen, before: true }])); return U.fields('Find her total deductions and net pay.', W, ['total', 'net'], { text: 'Jasmine net', hints: ['Add all the deductions, the pension too.', 'Net pay = gross pay − total deductions.'] }); } }] },
      { num: '11', stem: function (sh) { var S = junStub(sh); return 'Check each line of ' + sh.name.split(' ')[0] + '’s pay stub. One line has a mistake, and the lines below it were worked out from the wrong amount.' + S.html; },
        shared: function (r) { return junShared(r); },
        parts: [
          { id: '11a', level: 'PRG', make: function (r, sh) {
            var S = junStub(sh), lines = { ei: 'EI', tax: 'Income tax', total: 'Total deductions', net: 'Net pay' }, WHY = {
              ei: 'Check the EI: ' + t(M(S.g) + '\\times 0.0164' + eqM(S.W.deds[1].exact)) + '.', tax: 'Check the income tax: ' + t(M(S.g) + '\\times ' + dec2(sh.tx) + eqM(S.W.deds[2].exact)) + '.', total: 'Add the four deductions on the stub and compare with the total.', net: 'Check: gross pay − total deductions.' };
            var opts = ['CPP', 'ei', 'tax', 'total', 'net'].map(function (k) { return k === 'CPP' ? { html: 'CPP', why: 'CPP is right: ' + t(M(S.g) + '\\times 0.0595' + eqM(S.W.deds[0].exact)) + '. ' + WHY[sh.err], code: 'cpp' } : { html: lines[k], right: k === sh.err, why: k === sh.err ? null : 'That line works out. ' + WHY[sh.err], code: k }; });
            return P.mc(r, 'Which line has the mistake?', opts, 'The <b>' + lines[sh.err] + '</b> line. ' + S.why, ['Check every line: hours × rate, each rate × gross, the total, then gross − total.'], 'which line', true);
          } },
          { id: '11b', level: 'ADV', make: function (r, sh) { var S = junStub(sh); var p = PK.moneyPart('What should the net pay be?', S.W.net, function (v) { if (near(v, S.net)) return { code: 'u2l7-stub-net', hint: 'That’s the net pay on the stub. Fix the wrong line first, then work out the lines below it again.' }; return null; }, sol(U.lines(S.W)), ['Work out each deduction, the total and the net pay again.'], 'Jun correct net'); p.bad = [m$(S.net)]; return p; } },
          { id: '11c', level: 'MAS', make: function (r, sh) {
            var S = junStub(sh), much = S.diff > 0, amt = Math.abs(S.diff);
            var p = PK.fields('Would the mistake pay ' + sh.name.split(' ')[0] + ' too much or too little, and by how much?', [{ label: 'Too much or too little?', mode: 'text', placeholder: 'too much / too little', name: 'Too much or too little', wide: true }, { label: 'By', before: '$', name: 'By how much' }],
              [U.muchChk(much, 'The stub pays ' + t(M(S.net)) + '; the right net pay is ' + t(M(S.W.net)) + '. ' + (much ? 'The stub pays more.' : 'The stub pays less.')), PK.money(amt, function (v) { if (near(v, S.W.net) || near(v, S.net)) return { code: 'u2l7-stub-net', hint: 'Subtract the two net pays (the stub’s and the right one).' }; return null; })],
              [much ? 'too much' : 'too little', m$(amt)], (much ? 'too much' : 'too little') + ', by ' + t(M(amt)), S.why + '<br>right net pay ' + t('=' + M(S.W.net)) + '; stub ' + t('=' + M(S.net)) + '<br>' + t((much ? M(S.net) + '-' + M(S.W.net) : M(S.W.net) + '-' + M(S.net)) + '=' + M(amt)) + '. It would pay ' + t(M(amt)) + ' <b>' + (much ? 'too much' : 'too little') + '</b>.', ['Compare the stub’s net pay with the right net pay from (b).'], 'too much little');
            p.bad = [[much ? 'too little' : 'too much', m$(amt)]];
            return p;
          } }] },
      { num: '12', stem: function (sh) { var cpp = pctOf(5.95, sh.g), ei = pctOf(1.64, sh.g), base = cents(sh.g - r2(cpp) - r2(ei)), tx = r2(pctOf(sh.tx, base)); return sh.name + '’s gross pay is ' + t(M(sh.g)) + '. His deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + '. He has no before-tax deductions. Here is his work:<div style="margin:6px 0 6px 12px">' + t('\\text{CPP}=' + sh.g + '\\times 0.0595=' + m$(cpp)) + ' &nbsp; ' + t('\\text{EI}=' + sh.g + '\\times 0.0164=' + m$(ei)) + '<br>' + t('\\text{income tax}=(' + sh.g + '-' + m$(cpp) + '-' + m$(ei) + ')\\times ' + dec2(sh.tx) + '=' + m$(base) + '\\times ' + dec2(sh.tx) + '=' + m$(tx)) + '<br>' + t('\\text{net pay}=' + sh.g + '-' + m$(tx) + '=\\$' + m$(sh.g - tx)) + '</div>'; },
        shared: function (r) { return devShared(r); },
        parts: [
          { id: '12a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'What are his two mistakes?', [
              { html: 'The income tax should be on his whole gross pay (CPP and EI are not before-tax deductions), and he took off only the income tax instead of all the deductions.', right: true },
              { html: 'The CPP should be on his net pay, and the EI should be ' + t('16.4\\%') + '.', why: 'His CPP and EI are right: each is a percent of the gross pay.', code: 'cpp' },
              { html: 'He should have added the deductions to his gross pay, and the tax rate should be ' + t('1.5\\%') + '.', why: 'Deductions come off. Look at what he took the tax on, and what he took off at the end.', code: 'add' },
              { html: 'There is only one mistake: he should round the tax up.', why: 'Look at the line for the tax <b>and</b> the line for the net pay.', code: 'one' }],
              'Mistake 1: income tax is on the taxable income, which is the whole gross pay here (CPP and EI are not before-tax deductions).<br>Mistake 2: he took off only the income tax. All the deductions must come off.', ['With no before-tax deductions, taxable income = gross pay.'], 'Dev mistakes');
          } },
          { id: '12b', level: 'ADV', make: function (r, sh) { var W = U.work(sh.g, U.std(sh.tx)), base = cents(sh.g - W.deds[0].v - W.deds[1].v), wrongTax = r2(pctOf(sh.tx, base)); var p = PK.moneyPart('Find his correct net pay.', W.net, function (v) { if (near(v, cents(sh.g - wrongTax))) return { code: 'u2l7-tax-only', hint: 'That’s his answer. Take off all three deductions, with the tax on the whole gross pay.' }; if (near(v, cents(sh.g - W.deds[0].v - W.deds[1].v - wrongTax))) return { code: 'u2l7-tax-on-net', hint: 'The tax is still on the wrong amount. With no before-tax deductions, tax = gross × ' + t(dec2(sh.tx)) + '.' }; return null; }, sol(U.lines(W)), ['Income tax = gross × rate here.', 'Net pay = gross − all three deductions.'], 'Dev net'); p.bad = [m$(sh.g - wrongTax)]; return p; } }] },
      { num: '13', stem: function (sh) { return '<b>What if?</b> ' + sh.name + ' works ' + t(sh.h) + ' hours a week at ' + t(M(sh.w)) + ' an hour. Her boss gives her a raise to ' + t(M(sh.w + sh.up)) + ' an hour. Her deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + '.'; },
        shared: function (r) { return kayShared(r); },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, sh) { var g1 = cents(sh.h * sh.w), g2 = cents(sh.h * (sh.w + sh.up)), d = cents(g2 - g1); var p = PK.moneyPart('How much more is her weekly gross pay after the raise?', d, function (v) { if (near(v, sh.up)) return { code: 'u2l7-one-hour', hint: 'That’s the raise for one hour. She works ' + t(sh.h) + ' hours.' }; if (near(v, g2)) return { code: 'u2l7-new-not-diff', hint: 'That’s her new gross pay. How much <b>more</b> is it?' }; return null; }, t(sh.h + '\\times ' + M(sh.up) + '=' + M(d)) + ' more (' + t(M(g1)) + ' before, ' + t(M(g2)) + ' after)', ['Raise per hour × hours.'], 'raise gross'); p.bad = [m$(sh.up), m$(g2)]; return p; } },
          { id: '13b', level: 'PRG', make: function (r, sh) {
            var A = U.work(cents(sh.h * sh.w), U.std(sh.tx)), B = U.work(cents(sh.h * (sh.w + sh.up)), U.std(sh.tx));
            var p = PK.fields('Find her weekly net pay before and after the raise.', [{ label: 'Before', before: '$', name: 'Net pay before' }, { label: 'After', before: '$', name: 'Net pay after' }], [U.netChk(A), U.netChk(B)], [m$(A.net), m$(B.net)], 'before ' + t(M(A.net)) + ', after ' + t(M(B.net)),
              '<b>Before</b> (gross ' + t(M(A.g)) + '):<br>' + sol(U.lines(A)) + '<br><b>After</b> (gross ' + t(M(B.g)) + '):<br>' + sol(U.lines(B)), ['Find the gross pay each way first.', 'Then the three deductions, the total and the net pay.'], 'net before after');
            p.bad = [[m$(A.g), m$(B.g)]];
            return p;
          } },
          { id: '13c', level: 'ADV', make: function (r, sh) {
            var A = U.work(cents(sh.h * sh.w), U.std(sh.tx)), B = U.work(cents(sh.h * (sh.w + sh.up)), U.std(sh.tx)), d = cents(B.net - A.net), dg = cents(B.g - A.g);
            var p = PK.moneyPart('Her take-home pay goes up by less than ' + t(M(dg)) + '. By how much does it go up?', d, function (v) { if (near(v, dg)) return { code: 'u2l7-raise-gross', hint: 'That’s the raise in <b>gross</b> pay. Compare her two <b>net</b> pays.' }; return null; }, t(M(B.net) + '-' + M(A.net) + '=' + M(d)), ['Use your two net pays from (b).'], 'raise net');
            p.bad = [m$(dg)];
            return p;
          } },
          { id: '13d', sub: 'c, why', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Why does her take-home pay go up by less than her gross pay?', [
              { html: 'The deductions are percents of her pay, so part of the raise also goes to CPP, EI and income tax.', right: true },
              { html: 'Her boss takes back part of the raise each week.', why: 'Her boss pays the whole raise. Look at what the deductions are worked out on.', code: 'boss' },
              { html: 'The deductions stay the same, so she gets the whole raise.', why: 'Then her net pay would go up by the whole raise. CPP, EI and tax are percents of her pay, so they go up too.', code: 'same' },
              { html: 'Income tax is only charged on the raise.', why: 'Income tax (and CPP and EI) is on <b>all</b> her pay — it just goes up when her pay goes up.', code: 'tax' }],
              'The deductions are percents of her pay. When her gross pay goes up, CPP, EI and income tax go up too, so she keeps only part of the raise (here about ' + t(dS(rnd(100 - 5.95 - 1.64 - sh.tx, 2)) + '\\%') + ').', ['Are the deductions fixed amounts or percents?'], 'why less');
          } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'BEG', make: function (r) {
        return P.mc(r, 'Which of these is <b>net pay</b>?', [
          { html: 'the pay you earn before anything is taken off', why: 'That’s gross pay.', code: 'gross' }, { html: 'the total of all your deductions', why: 'That’s the total deductions.', code: 'total' },
          { html: 'the pay you get after all deductions are taken off', right: true }, { html: 'your pay after only the income tax is taken off', why: 'Net pay is after <b>all</b> the deductions (CPP, EI and the others too).', code: 'tax' }],
          'C: net pay is what is left after all deductions. (A is gross pay; B is total deductions; D forgets CPP, EI and the other deductions.)', ['Net = what is left.'], 'MC net', true);
      } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var g = find(function () { return step(r, 480, 920, 10); }, function (x) { var e = r2(pctOf(1.64, x)); return !near(r2(x * 0.00164), e / 10) || true; }, 640), e = r2(pctOf(1.64, g));
        return P.mc(r, 'The EI at ' + t('1.64\\%') + ' on gross pay of ' + t(M(g)) + ' is', [
          { html: t(M(g * 0.00164)), why: 'That uses ' + t('0.00164') + '. ' + t('1.64\\%=0.0164') + '.', code: 'small' }, { html: t(M(e)), right: true },
          { html: t(M(g * 0.164)), why: 'That uses ' + t('0.164') + '. ' + t('1.64\\%=0.0164') + ' (2 places left).', code: 'big' }, { html: t(M(g - e)), why: 'That’s the gross pay minus the EI.', code: 'left' }],
          t(M(g) + '\\times 0.0164' + eqM(pctOf(1.64, g))) + '.', ['1.64% = 0.0164.'], 'MC EI', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { return { g: step(r, 1000, 1600, 50), u: step(r, 20, 45, 5), tx: r.pick([15, 18, 20, 22, 25]), name: r.pick(['Rosa', 'Elena', 'Kim', 'Ivy']) }; }, function (s) { return true; }, { g: 1200, u: 30, tx: 20, name: 'Rosa' });
        var ti = v.g - v.u, tax = r2(pctOf(v.tx, ti));
        return P.mc(r, v.name + '’s gross pay is ' + t(M(v.g)) + '. Her union dues are ' + t(M(v.u)) + ' (before tax). Her income tax is ' + t(v.tx + '\\%') + ' of her taxable income. Her income tax is', [
          { html: t(M(pctOf(v.tx, v.u))), why: 'That’s ' + t(v.tx + '\\%') + ' of the dues. Use the taxable income: ' + t(M(v.g) + '-' + M(v.u)) + '.', code: 'dues' }, { html: t(M(tax)), right: true },
          { html: t(M(pctOf(v.tx, v.g))), why: 'That’s ' + t(v.tx + '\\%') + ' of the gross pay. Take the dues off first.', code: 'gross' }, { html: t(M(ti - tax)), why: 'That’s the taxable income minus the tax.', code: 'left' }],
          'taxable income ' + t('=' + M(v.g) + '-' + M(v.u) + '=' + M(ti)) + '; tax ' + t('=' + M(ti) + '\\times ' + dec2(v.tx) + '=' + M(tax)) + '.', ['Taxable income = gross − before-tax deductions.'], 'MC Rosa', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'BEG', make: function (r) {
        var g = find(function () { return step(r, 380, 605, 5); }, function (x) { var e = pctOf(1.64, x); return !near(e, r2(e)) && !near(x, 640); }, 545), e = pctOf(1.64, g), W = U.work(g, [{ name: 'EI', rate: 1.64 }]);
        var p = PK.part('<b>Numerical response.</b> The EI at ' + t('1.64\\%') + ' on gross pay of ' + t(M(g)) + ', to the nearest cent, is ' + t('\\$') + '________.', PK.money(e, U.dedDiag(W.deds[0], W), { nr: true }), m$(e), M(e), t(M(g) + '\\times 0.0164' + eqM(e)), ['EI = gross × 0.0164.'], 'NR EI', { nr: true });
        p.bad = [m$(g * 0.164)];
        return p;
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var v = find(function () { var g = step(r, 700, 1000, 10), d = rnd(g * (0.18 + r.int(0, 80) / 1000), 2); return { g: g, d: d, name: r.pick(['Leo', 'Ari', 'Max', 'Jay']) }; }, function (s) { var P0 = (s.g - s.d) / s.g * 100; return dS(rnd(P0, 1)).length <= 4 && rnd(P0, 1) < 99.95; }, { g: 860, d: 197.8, name: 'Leo' });
        var n = cents(v.g - v.d);
        return U.pctPart('<b>Numerical response.</b> ' + v.name + '’s gross pay is ' + t(M(v.g)) + ' and his total deductions are ' + t(M(v.d)) + '. The percent of his gross pay that he takes home, to the nearest tenth of a percent, is ________ %.', n, v.g, { nr: true, comp: 'that goes to deductions', pre: 'net ' + t('=' + M(v.g) + '-' + M(v.d) + '=' + M(n)), extra: function (x) { if (near(x, rnd(v.d / v.g * 100, 1))) return { code: 'u2l7-other-pct', hint: 'That’s the deductions percent. Find the net pay first, then divide it by the gross pay.' }; return null; }, text: 'NR take-home' });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the total deductions and the net pay.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var g = find(function () { return step(r, 440, 680, 10); }, notEx, 530), tx = r.pick([7, 8, 9]), W = U.work(g, U.std(tx)); return U.fields('gross pay ' + t(M(g)) + '; CPP ' + t(M(W.deds[0].v)) + ', EI ' + t(M(W.deds[1].v)) + ', income tax ' + t(M(W.deds[2].v)), fixed(W), ['total', 'net'], { sol: fixedSol(W), text: 'e1a' }); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var g = find(function () { return step(r, 1450, 1950, 0.4); }, notEx, 1688.4), W = U.work(g, U.std(r.pick([15, 16, 17]), [{ name: 'Health plan', amt: step(r, 20, 35, 0.25) }, { name: 'Charity', amt: r.pick([5, 10, 12, 15]) }])); return U.fields('gross pay ' + t(M(g)) + '; ' + W.deds.map(function (d) { return d.name + ' ' + t(M(d.v)); }).join(', '), fixed(W), ['total', 'net'], { sol: fixedSol(W), text: 'e1b' }); } }] },
      { num: '2', stem: 'The rates are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', and the income tax rate shown. Round each deduction to the nearest cent.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var g = step(r, 380, 480, 5), tx = r.pick([8, 9, 10]), W = U.work(g, U.std(tx)); return U.fields(tbl(['Gross pay', 'Tax rate'], [[D$(g), tx + '%']]), W, ['CPP', 'EI', 'Income tax', 'total', 'net'], { text: 'e2a' }); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var g = find(function () { return step(r, 1200, 1500, 2.5); }, function (x) { return x % 1 !== 0; }, 1362.5), tx = r.pick([15, 16, 17, 18]), W = U.work(g, U.std(tx)); return U.fields(tbl(['Gross pay', 'Tax rate'], [[D$(g), tx + '%']]), W, ['CPP', 'EI', 'Income tax', 'total', 'net'], { text: 'e2b' }); } }] },
      { num: '3', stem: 'Find each percent.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var v = find(function () { return { p: rnd(2 + r.int(0, 30) / 10, 1), g: step(r, 600, 900, 10) }; }, function (s) { return s.p % 1 !== 0 && near(pctOf(s.p, s.g), r2(pctOf(s.p, s.g))); }, { p: 3.2, g: 690 }); var d = pctOf(v.p, v.g); return U.ratePart('A pension deduction of ' + t(M(d)) + ' on gross pay of ' + t(M(v.g)) + '. What is the pension rate?', d, v.g, v.p, { text: 'pension rate' }); } },
        { id: 'e3b', level: 'BEG', make: function (r) { var v = find(function () { var g = step(r, 1400, 1900, 50), P0 = rnd(74 + r.int(0, 80) / 10, 1); return { g: g, P: P0, n: cents(g * P0 / 100) }; }, function (s) { return s.P % 1 !== 0; }, { g: 1650, P: 79.2, n: 1306.8 }); return U.pctPart('Net pay of ' + t(M(v.n)) + ' on gross pay of ' + t(M(v.g)) + '. What percent is take-home?', v.n, v.g, { comp: 'that goes to deductions', text: 'take-home %' }); } },
        { id: 'e3c', level: 'BEG', make: function (r) { var v = find(function () { return { u: r.pick([2.5, 1.5, 2.25, 1.75, 3]), g: step(r, 1000, 1300, 4) }; }, function (s) { return near(pctOf(s.u, s.g), r2(pctOf(s.u, s.g))); }, { u: 2.5, g: 1144 }); var d = pctOf(v.u, v.g); return U.ratePart('Union dues of ' + t(M(d)) + ' on gross pay of ' + t(M(v.g)) + '. What is the union dues rate?', d, v.g, v.u, { text: 'dues rate' }); } }] },
      { num: '4', stem: 'Find the taxable income.', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var g = step(r, 1600, 2000, 20), u = step(r, 35, 55, 0.5), rr = r.pick([40, 50, 60, 75, 100]); var W = U.work(g, U.std(15, [], [{ name: 'Union dues', amt: u, before: true }, { name: 'RRSP', amt: rr, before: true }])); return taxPart(tbl(['Gross pay', 'Before-tax deductions'], [[D$(g), 'union dues ' + D$(u) + ', RRSP ' + D$(rr)]]), W, 'e4a'); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var g = step(r, 2300, 2900, 0.4), pp = r.pick([3, 4, 2.5, 3.5]), u = r.pick([30, 35, 40, 25]); var W = U.work(g, U.std(15, [], [{ name: 'Pension', rate: pp, before: true }, { name: 'Union dues', amt: u, before: true }])); return taxPart(tbl(['Gross pay', 'Before-tax deductions'], [[D$(g), 'pension plan ' + pp + '% of gross pay, union dues ' + D$(u)]]), W, 'e4b'); } },
        { id: 'e4c', level: 'LIM', make: function (r) { var g = step(r, 800, 1100, 10), W = U.work(g, U.std(12)); var p = PK.moneyPart(tbl(['Gross pay', 'Before-tax deductions'], [[D$(g), 'none']]) + 'Taxable income:', g, function (v) { if (near(v, W.net)) return { code: 'u2l7-net-for-taxable', hint: 'CPP, EI and income tax are not before-tax deductions. With none, taxable income = gross pay.' }; if (near(v, 0)) return { code: 'u2l7-zero', hint: 'With no before-tax deductions, taxable income is the whole gross pay.' }; return null; }, 'No before-tax deductions, so taxable income ' + t('=') + ' gross pay ' + t('=' + M(g)) + '.', ['Taxable income = gross pay − before-tax deductions.'], 'e4c'); p.bad = ['0']; return p; } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [{ id: 'e5', level: 'EMG', make: function (r) {
        var g = step(r, 600, 900, 0.4), tx = r.pick([10, 11, 12]), meals = r.pick([8, 10, 12, 15]), W = U.work(g, U.std(tx, [{ name: 'Staff meals', amt: meals }])), nm = r.pick(['Ella', 'Sofia', 'Kenzie', 'Lucia']);
        return U.fields(nm + ' is a server in ' + r.pick(CITIES) + '. Her gross pay this week, including the tips paid out on her cheque, is ' + t(M(g)) + '. Her deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', income tax ' + t(tx + '\\%') + ', and ' + t(M(meals)) + ' for staff meals. Find her net pay.', W, ['CPP', 'EI', 'Income tax', 'total', 'net'], { text: 'Ella net' });
      } }] },
      { num: '6', stem: function (sh) { return sh.name + ' has two part-time jobs. This week he earns ' + t(M(sh.a)) + ' gross at a ' + sh.ja + ' (income tax ' + t(sh.ta + '\\%') + ') and ' + t(M(sh.b)) + ' gross ' + sh.jb + ' (income tax ' + t(sh.tb + '\\%') + '). Both jobs take off CPP ' + t('5.95\\%') + ' and EI ' + t('1.64\\%') + '.'; },
        shared: function (r) { return find(function () { return { a: step(r, 350, 480, 2), b: step(r, 240, 330, 2), ta: r.pick([10, 11, 12]), tb: r.pick([6, 7, 8]), name: r.pick(['Ravi', 'Hugo', 'Ben', 'Yusuf']), ja: r.pick(['bike shop', 'grocery store', 'hardware store']), jb: r.pick(['tutoring at a learning centre', 'coaching at a gym', 'working at a library']) }; }, function (s) { return s.ta - s.tb >= 2; }, { a: 410, b: 286, ta: 10, tb: 8, name: 'Ravi', ja: 'bike shop', jb: 'tutoring at a learning centre' }); },
        parts: [
          { id: 'e6a', level: 'PRG', make: function (r, sh) {
            var A = U.work(sh.a, U.std(sh.ta)), B = U.work(sh.b, U.std(sh.tb)), T = cents(A.net + B.net);
            var p = PK.fields('Find his net pay from each job and his total net pay.', [{ label: 'Job 1 (' + sh.ja + ')', before: '$', name: 'Net pay, job 1' }, { label: 'Job 2', before: '$', name: 'Net pay, job 2' }, { label: 'Total net pay', before: '$', name: 'Total net pay' }],
              [U.netChk(A), U.netChk(B), PK.money(T, function (v) { if (near(v, A.net) || near(v, B.net)) return { code: 'u2l7-one-job', hint: 'Add the net pay from both jobs.' }; return null; })], [m$(A.net), m$(B.net), m$(T)], t(M(A.net)) + ', ' + t(M(B.net)) + ', total ' + t(M(T)),
              '<b>Job 1:</b><br>' + sol(U.lines(A)) + '<br><b>Job 2:</b><br>' + sol(U.lines(B)) + '<br>total ' + t('=' + M(A.net) + '+' + M(B.net) + '=' + M(T)), ['Work out each job on its own (each has its own tax rate).'], 'two jobs');
            p.bad = [[m$(sh.a), m$(sh.b), m$(sh.a + sh.b)]];
            return p;
          } },
          { id: 'e6b', level: 'EMG', make: function (r, sh) {
            var A = U.work(sh.a, U.std(sh.ta)), B = U.work(sh.b, U.std(sh.tb)), pa = dS(rnd(A.net / sh.a * 100, 1)), pb = dS(rnd(B.net / sh.b * 100, 1));
            return P.mc(r, 'Which job lets him keep a bigger percent of his gross pay?', [
              { html: 'Job 2: he keeps about ' + t(pb + '\\%') + ' there and ' + t(pa + '\\%') + ' at job 1, because its income tax rate is lower.', right: true },
              { html: 'Job 1, because it pays more dollars.', why: 'More dollars is not a bigger <b>percent</b>. Divide each net pay by its own gross pay.', code: 'dollars' },
              { html: 'They are the same, because both take off CPP and EI.', why: 'The income tax rates are different. Divide each net pay by its own gross pay.', code: 'same' },
              { html: 'Job 1: he keeps ' + t(pa + '\\%') + ' there and ' + t(pb + '\\%') + ' at job 2.', why: 'Compare the two percents again: the bigger one is job 2.', code: 'swap' }],
              'Job 1: ' + t(M(A.net) + '\\div ' + M(sh.a) + '\\approx ' + pa + '\\%') + '; job 2: ' + t(M(B.net) + '\\div ' + M(sh.b) + '\\approx ' + pb + '\\%') + '. Job 2, because its income tax rate is lower.', ['Percent kept = net ÷ gross × 100, for each job.'], 'which job keeps more');
          } }] },
      { num: '7', stem: function (sh) { var W = grace(sh); return 'Use ' + sh.name.split(' ')[0] + '’s pay stub. She is paid the same amount every week.' + U.stubHtml(U.head('Westwinds Auto Body', 'Calgary', sh.name, 'Oct. 19–25, 2026'), [['Regular earnings', dS(sh.h), D$(sh.w), D$(W.g), D$(W.g * sh.n)], ['CPP', '', '5.95%', D$(W.deds[0].v), D$(W.deds[0].v * sh.n)], ['EI', '', '1.64%', D$(W.deds[1].v), D$(W.deds[1].v * sh.n)], ['Income tax', '', '', D$(W.deds[2].v), D$(W.deds[2].v * sh.n)], ['Health plan', '', '', D$(sh.hp), D$(sh.hp * sh.n)], ['<b>Total deductions</b>', '', '', '?', '?'], ['<b>Net pay</b>', '', '', '?', '?']], ['', 'Hours', 'Rate', 'This pay', 'Year to date']); },
        shared: function (r) { return find(function () { return { h: r.pick([37.5, 40, 35, 37.5]), w: step(r, 21, 27, 0.2), tx: r.pick([15, 16, 17, 18]), hp: step(r, 15, 24, 0.2), n: r.int(28, 42), name: r.pick(['Grace Lindqvist', 'Hannah Moore', 'Rachel Kim', 'Zoe Laurent']) }; }, function (s) { var g = cents(s.h * s.w); return near(s.h * s.w, g) && near(pctOf(s.tx, g), r2(pctOf(s.tx, g))); }, { h: 37.5, w: 24.8, tx: 17, hp: 19.4, n: 35, name: 'Grace Lindqvist' }); },
        parts: [
          { id: 'e7a', level: 'BEG', make: function (r, sh) { var g = cents(sh.h * sh.w); return PK.moneyPart('Check her gross pay for this week: what should it be?', g, null, t(dS(sh.h) + '\\times ' + M(sh.w) + '=' + M(g)) + ' ✓ (it matches the stub)', ['Gross = hours × rate.'], 'Grace gross'); } },
          { id: 'e7b', level: 'BEG', make: function (r, sh) { var W = grace(sh); return U.fields('Find her total deductions and net pay for this week.', fixed(W), ['total', 'net'], { sol: fixedSol(W), text: 'Grace week' }); } },
          { id: 'e7c', level: 'EMG', make: function (r, sh) { var W = grace(sh); return U.ratePart('What income tax rate is she paying?', W.deds[2].v, W.g, sh.tx, { text: 'Grace tax rate' }); } },
          { id: 'e7d', level: 'EMG', make: function (r, sh) { var W = grace(sh), ytd = cents(W.g * sh.n); var p = PK.part('How many weeks has she been paid so far this year?', PK.num(sh.n, null, function (v) { if (near(v, rnd(W.g / ytd, 4)) || near(v, rnd(W.g / ytd, 3))) return { code: 'u2l7-weeks', hint: 'Divide the year-to-date pay by one week’s pay: ' + t(M(ytd) + '\\div ' + M(W.g)) + '.' }; return null; }), String(sh.n), String(sh.n), t(M(ytd) + '\\div ' + M(W.g) + '=' + sh.n) + ' weeks', ['Year-to-date ÷ this pay.'], 'Grace weeks', { after: 'weeks' }); p.bad = [String(sh.n + 1)]; return p; } },
          { id: 'e7e', level: 'PRG', make: function (r, sh) {
            var W = grace(sh), n = sh.n, Y = W.deds.map(function (d) { return cents(d.v * n); }), yt = cents(sum(Y)), yg = cents(W.g * n), yn = cents(yg - yt);
            var p = PK.fields('Find her year-to-date total deductions and net pay.', [{ label: 'YTD total deductions', before: '$', name: 'YTD total deductions' }, { label: 'YTD net pay', before: '$', name: 'YTD net pay' }],
              [PK.money(yt, function (v) { if (near(v, W.total)) return { code: 'u2l7-ytd-week', hint: 'That’s this week. Add the <b>year-to-date</b> column.' }; return null; }), PK.money(yn, function (v) { if (near(v, W.net)) return { code: 'u2l7-ytd-week', hint: 'That’s this week. Use the year-to-date column.' }; if (near(v, cents(yg + yt))) return { code: 'u2l7-added', hint: 'Subtract the deductions.' }; return null; })],
              [m$(yt), m$(yn)], t(M(yt)) + ' and ' + t(M(yn)), t(Y.map(function (y) { return M(y); }).join('+') + '=' + M(yt)) + '<br>' + t(M(yg) + '-' + M(yt) + '=' + M(yn)) + ' &nbsp; (check: ' + t(n + '\\times ' + M(W.net) + '=' + M(W.net * n)) + ' ✓)', ['Use the year-to-date column.', 'YTD net = YTD gross − YTD deductions.'], 'Grace YTD');
            p.bad = [[m$(W.total), m$(W.net)]];
            return p;
          } }] },
      { num: '8', stem: function (sh) { return sh.name + ' is a journeyman electrician in Fort McMurray. His gross pay this week is ' + t(M(sh.g)) + '. His before-tax deductions are union dues of ' + t(M(sh.u)) + ' and a pension plan of ' + t(sh.pp + '\\%') + ' of gross pay. His other deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', and income tax ' + t(sh.tx + '\\%') + ' of his taxable income.'; },
        shared: function (r) { return { g: step(r, 2100, 2700, 10), u: step(r, 35, 50, 0.5), pp: r.pick([4, 5, 6]), tx: r.pick([20, 21, 22, 23]), name: r.pick(['Marc', 'Andre', 'Lucas', 'Pierre']) }; },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) { var W = marc(sh); return taxPart('Find his taxable income.', W, 'Marc taxable'); } },
          { id: 'e8b', level: 'ADV', make: function (r, sh) { var W = marc(sh); var p = PK.moneyPart('Find his net pay.', W.net, null, sol(U.lines(W)), ['CPP and EI on the gross pay; income tax on the taxable income.', 'Add all five deductions, then subtract from the gross pay.'], 'Marc net'); p.check = U.netChk(W); return p; } },
          { id: 'e8c', level: 'MAS', make: function (r, sh) { var W = marc(sh), all = pctOf(sh.tx, sh.g), sv = cents(r2(all) - W.deds[W.deds.length - 1].v); var p = PK.moneyPart('How much income tax do his before-tax deductions save him this week?', sv, function (v) { if (near(v, r2(all)) || near(v, W.deds[W.deds.length - 1].v)) return { code: 'u2l7-tax-saving-total', hint: 'Find the tax both ways (on the gross pay and on the taxable income), then subtract.' }; if (near(v, cents(W.g - W.ti))) return { code: 'u2l7-tax-saving-total', hint: 'That’s the before-tax deductions. The saving is ' + t(sh.tx + '\\%') + ' of that.' }; return null; },
            'tax on all his gross pay: ' + t(M(sh.g) + '\\times ' + dec2(sh.tx) + eqM(all)) + '<br>tax he pays: ' + t(M(W.ti) + '\\times ' + dec2(sh.tx) + eqM(W.deds[W.deds.length - 1].exact)) + '<br>' + t(M(all) + '-' + M(W.deds[W.deds.length - 1].v) + '=' + M(sv)), ['Tax without the before-tax deductions − tax with them.'], 'Marc saving'); p.bad = [m$(all)]; return p; } }] },
      { num: '9', stem: '', parts: [{ id: 'e9', level: 'EMG', make: function (r) {
        var v = find(function () { var g = step(r, 1200, 1800, 100), P0 = r.pick([22, 23, 24, 26, 27, 21]); return { g: g, d: g * P0 / 100, P: P0, name: r.pick(['Nadia', 'Farah', 'Lena', 'Amy']) }; }, function (s) { return near(s.d, cents(s.d)); }, { g: 1500, d: 345, P: 23, name: 'Nadia' });
        var n = cents(v.g - v.d), wr = dS(rnd(v.d / n * 100, 1));
        return P.mc(r, v.name + '’s gross pay is ' + t(M(v.g)) + ' and her net pay is ' + t(M(n)) + '. Her deductions are what percent of her gross pay?', [
          { html: t(v.P + '\\%'), right: true }, { html: t(wr + '\\%'), why: 'That divides by the net pay. Divide by the <b>gross</b> pay.', code: 'net' },
          { html: t((100 - v.P) + '\\%'), why: 'That’s the take-home percent.', code: 'home' }, { html: t(dS(v.d) + '\\%'), why: 'That’s the dollar amount, not a percent.', code: 'dollars' }],
          'deductions ' + t('=' + M(v.g) + '-' + M(n) + '=' + M(v.d)) + '; ' + t(dS(v.d) + '\\div ' + dS(v.g) + '=' + dS(v.P / 100) + '=' + v.P + '\\%') + '.', ['Deductions = gross − net. Then ÷ gross × 100.'], 'MC Nadia', true);
      } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'BEG', make: function (r) {
        var g = find(function () { return step(r, 600, 1100, 20); }, function (x) { return !near(x, 800); }, 800), d = pctOf(5.95, g), nm = r.pick(['Lena', 'Tess', 'Gia', 'Rae']);
        return U.ratePart('<b>Numerical response.</b> ' + nm + '’s pay stub shows CPP of ' + t(M(d)) + ' on gross pay of ' + t(M(g)) + '. Her CPP rate, as a percent to the nearest hundredth, is ________ %.', d, g, 5.95, { nr: true, text: 'NR CPP rate' });
      } }] },
      { num: '11', section: 'C. Stretch', stem: function (sh) { return '<b>What if?</b> ' + sh.name + ' works ' + t(sh.h) + ' hours a week at a grocery store for ' + t(M(sh.w)) + ' an hour. His deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + '. His manager asks him to add an ' + t(sh.x) + '-hour shift every Saturday, at the same rate.'; },
        shared: function (r) { return { h: r.int(20, 28), w: step(r, 15.6, 18.4, 0.2), tx: r.pick([9, 10, 11]), x: r.pick([6, 7, 8]), name: r.pick(['Jordan', 'Kai', 'Nate', 'Ryan']) }; },
        parts: [
          { id: 'e11a', level: 'PRG', make: function (r, sh) { var A = U.work(cents(sh.h * sh.w), U.std(sh.tx)), B = U.work(cents((sh.h + sh.x) * sh.w), U.std(sh.tx)); var p = PK.fields('Find his weekly net pay for ' + sh.h + ' hours and for ' + (sh.h + sh.x) + ' hours.', [{ label: sh.h + ' hours', before: '$', name: 'Net, ' + sh.h + ' h' }, { label: (sh.h + sh.x) + ' hours', before: '$', name: 'Net, ' + (sh.h + sh.x) + ' h' }], [U.netChk(A), U.netChk(B)], [m$(A.net), m$(B.net)], t(M(A.net)) + ' and ' + t(M(B.net)), '<b>' + sh.h + ' h</b> (gross ' + t(M(A.g)) + '):<br>' + sol(U.lines(A)) + '<br><b>' + (sh.h + sh.x) + ' h</b> (gross ' + t(M(B.g)) + '):<br>' + sol(U.lines(B)), ['Gross = hours × rate, then the deductions.'], 'Jordan nets'); p.bad = [[m$(A.g), m$(B.g)]]; return p; } },
          { id: 'e11b', level: 'MAS', make: function (r, sh) {
            var A = U.work(cents(sh.h * sh.w), U.std(sh.tx)), B = U.work(cents((sh.h + sh.x) * sh.w), U.std(sh.tx)), xg = cents(sh.x * sh.w), xn = cents(B.net - A.net), pc = rnd(xn / xg * 100, 1);
            var p = PK.fields('The extra shift adds how much gross pay? How much of it does ' + sh.name + ' take home, in dollars and as a percent (to the nearest tenth)?', [{ label: 'Extra gross pay', before: '$', name: 'Extra gross' }, { label: 'Extra take-home', before: '$', name: 'Extra take-home' }, { label: 'Percent kept', after: '%', name: 'Percent kept' }],
              [PK.money(xg), PK.money(xn, function (v) { if (near(v, xg)) return { code: 'u2l7-extra-gross', hint: 'That’s the extra gross. Subtract the two net pays from (a).' }; return null; }), PK.pct(xn / xg * 100, 1, function (v) { if (near(v, rnd(xg / xn * 100, 1))) return { code: 'u2l7-flip', hint: 'Divide the extra take-home by the extra gross.' }; if (near(v, rnd(100 - xn / xg * 100, 1))) return { code: 'u2l7-other-pct', hint: 'That’s the part that goes to deductions.' }; return null; })],
              [m$(xg), m$(xn), dS(pc)], t(M(xg)) + ', ' + t(M(xn)) + ', ' + t(dS(pc) + '\\%'), 'extra gross ' + t('=' + sh.x + '\\times ' + M(sh.w) + '=' + M(xg)) + '<br>extra net ' + t('=' + M(B.net) + '-' + M(A.net) + '=' + M(xn)) + '<br>' + t(M(xn) + '\\div ' + M(xg) + '\\approx ' + dS(rnd(xn / xg, 4)) + '\\to ' + dS(pc) + '\\%'), ['Extra gross = extra hours × rate.', 'Extra take-home = the difference of the two net pays.'], 'extra shift');
            p.bad = [[m$(xg), m$(xg), '100']];
            return p;
          } }] },
      { num: '12', stem: function (sh) { var W = paul(sh); return sh.name + '’s gross pay is ' + t(M(sh.g)) + '. His union dues are ' + t(sh.u + '\\%') + ' of gross pay (before tax). His other deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + ' of taxable income. He says his net pay is ' + t(M(cents(W.net + W.deds[0].v))) + '.'; },
        shared: function (r) { return find(function () { return { g: step(r, 1300, 1800, 20), u: r.pick([2, 1.5, 2.5]), tx: r.pick([14, 15, 16]), name: r.pick(['Paul', 'Simon', 'Victor', 'Adam']) }; }, function () { return true; }, { g: 1520, u: 2, tx: 15, name: 'Paul' }); },
        parts: [
          { id: 'e12a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'What is his mistake?', [
              { html: 'He forgot to count the union dues as a deduction (he used them only to find the taxable income).', right: true },
              { html: 'He worked the income tax on the gross pay.', why: 'Work it out: tax on the taxable income gives his CPP, EI and tax exactly. Check what is missing from his total.', code: 'tax' },
              { html: 'He forgot the CPP.', why: 'Add his CPP, EI and tax and take them off: that gives his answer. Something else is missing.', code: 'cpp' },
              { html: 'There is no mistake.', why: 'Work out the net pay with all four deductions and compare.', code: 'none' }],
              'Without the dues, net ' + t('=') + ' his answer. His mistake: he forgot to count the union dues as a deduction.', ['Work it out yourself, then see which deduction makes the difference.'], 'Paul mistake');
          } },
          { id: 'e12b', level: 'ADV', make: function (r, sh) { var W = paul(sh); var p = PK.moneyPart('Find his correct net pay.', W.net, function (v) { if (near(v, cents(W.net + W.deds[0].v))) return { code: 'u2l7-missed-ded', hint: 'That’s his answer. Count the union dues as a deduction too.' }; return null; }, sol(U.lines(W)), ['Before-tax deductions are still deductions: count them in the total.'], 'Paul net'); p.check = U.netChk(W); p.bad = [m$(W.net + W.deds[0].v)]; return p; } }] },
      { num: '13', stem: function (sh) { return 'Two jobs at a Calgary print shop each work ' + t(dS(sh.h)) + ' hours a week. Job A pays ' + t(M(sh.a)) + ' an hour, with no union and no health plan. Job B pays ' + t(M(sh.b)) + ' an hour, with union dues of ' + t(pT(sh.u)) + ' of gross pay (before tax) and a health plan of ' + t(M(sh.hp)) + '. For both: CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', income tax ' + t(sh.tx + '\\%') + ' of taxable income.'; },
        shared: function (r) { return find(function () { var a = step(r, 17, 21, 0.5); return { h: r.pick([37.5, 40, 35]), a: a, b: a + r.pick([1.5, 1.25, 1.75, 2]), u: r.pick([2.5, 2, 1.5]), hp: step(r, 18, 28, 1), tx: r.pick([14, 15, 16]) }; }, function (s) { var A = U.work(cents(s.h * s.a), U.std(s.tx)), B = jobB(s); return B.net - A.net > 1 && B.net - A.net < 40; }, { h: 37.5, a: 19, b: 20.5, u: 2.5, hp: 22, tx: 15 }); },
        parts: [
          { id: 'e13a', level: 'ADV', make: function (r, sh) { var A = U.work(cents(sh.h * sh.a), U.std(sh.tx)), B = jobB(sh); var p = PK.fields('Find the weekly net pay for each job.', [{ label: 'Job A', before: '$', name: 'Job A net' }, { label: 'Job B', before: '$', name: 'Job B net' }], [U.netChk(A), U.netChk(B)], [m$(A.net), m$(B.net)], 'A ' + t(M(A.net)) + ', B ' + t(M(B.net)), '<b>Job A</b> (gross ' + t(dS(sh.h) + '\\times ' + M(sh.a) + '=' + M(A.g)) + '):<br>' + sol(U.lines(A)) + '<br><b>Job B</b> (gross ' + t(dS(sh.h) + '\\times ' + M(sh.b) + '=' + M(B.g)) + '):<br>' + sol(U.lines(B)), ['Job B: union dues first, then taxable income, then the tax on it.'], 'two jobs net'); p.bad = [[m$(A.g), m$(B.g)]]; return p; } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) { var A = U.work(cents(sh.h * sh.a), U.std(sh.tx)), B = jobB(sh), d = cents(B.net - A.net), dg = cents(B.g - A.g); var p = PK.moneyPart('Job B pays ' + t(M(sh.b - sh.a)) + ' more an hour. How much more does it pay in net pay each week?', d, function (v) { if (near(v, dg)) return { code: 'u2l7-raise-gross', hint: 'That’s the difference in <b>gross</b> pay. Compare the two net pays.' }; if (near(v, cents(sh.b - sh.a))) return { code: 'u2l7-one-hour', hint: 'That’s for one hour, before deductions. Compare the weekly net pays.' }; return null; }, t(M(B.net) + '-' + M(A.net) + '=' + M(d)) + ' more a week (the gross is ' + t(M(dg)) + ' more).', ['Use your two net pays from (a).'], 'net diff'); p.bad = [m$(dg)]; return p; } },
          { id: 'e13c', sub: 'b, reason', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'Give one reason someone might still choose Job B.', [
              { html: 'Job B has a health plan (dental, glasses, prescriptions) and a union, which can be worth more than the small dollar difference.', right: true },
              { html: 'Job B takes home a lot more money each week.', why: 'Look at (b): the difference in net pay is small. The question asks for a reason other than that.', code: 'money' },
              { html: 'Job B has no deductions.', why: 'Job B has more deductions (union dues and a health plan).', code: 'none' },
              { html: 'Job B pays less income tax because its rate is lower.', why: 'Both jobs use the same tax rate.', code: 'rate' }],
              'Sample: Job B has a health plan and a union, which can be worth more than the dollar difference.', ['Think about what the health plan and the union give you.'], 'why job B');
          } }] }
    ]
  });
  /* helpers used above (hoisted) */
  function fixed(W) { return { g: W.g, ti: W.ti, deds: W.deds.map(function (d) { return Object.assign({}, d, { exact: d.v, rate: null }); }), total: W.total, net: W.net, before: false, rawTotal: W.total }; }
  function fixedSol(W) { return sol(['total ' + t('=' + W.deds.map(function (d) { return M(d.v); }).join('+') + '=' + M(W.total)), 'net ' + t('=' + M(W.g) + '-' + M(W.total) + '=' + M(W.net))]); }
  function taxPart(prompt, W, text) {
    var bs = W.deds.filter(function (d) { return d.before; });
    var p = PK.moneyPart(prompt, W.ti, null, sol(bs.filter(function (d) { return d.rate != null; }).map(function (d) { return dedLine(d, W); }).concat(['taxable income ' + t('=' + M(W.g) + bs.map(function (d) { return '-' + M(d.v); }).join('') + '=' + M(W.ti))])), ['Taxable income = gross pay − before-tax deductions.', 'Work out any percent deduction first (gross × rate).'], text);
    p.check = U.taxableChk(W); p.bad = [m$(W.g)];
    return p;
  }
  function grace(sh) { return U.work(cents(sh.h * sh.w), U.std(sh.tx, [{ name: 'Health plan', amt: sh.hp }])); }
  function marc(sh) { return U.work(sh.g, U.std(sh.tx, [], [{ name: 'Union dues', amt: sh.u, before: true }, { name: 'Pension', rate: sh.pp, before: true }])); }
  function paul(sh) { return U.work(sh.g, U.std(sh.tx, [], [{ name: 'Union dues', rate: sh.u, before: true }])); }
  function jobB(s) { return U.work(cents(s.h * s.b), U.std(s.tx, [{ name: 'Health plan', amt: s.hp }], [{ name: 'Union dues', rate: s.u, before: true }])); }
  U.fixed = fixed; U.fixedSol = fixedSol; U.taxPart = taxPart;
  HW.addCodes({ 'u2l7-stub-net': 'Gave the stub’s (wrong) net pay', 'u2l7-tax-on-net': 'Income tax on gross − CPP − EI', 'u2l7-one-hour': 'Gave the per-hour amount', 'u2l7-new-not-diff': 'Gave the new pay, not the difference', 'u2l7-zero': 'Taxable income 0 with no before-tax deductions' });
  HW.addPartial({ 'u2l7-stub-net': 'n', 'u2l7-tax-on-net': 'b', 'u2l7-one-hour': 'b', 'u2l7-new-not-diff': 's', 'u2l7-zero': 'n' });
})(window);
