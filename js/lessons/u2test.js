/* Math 10-3 · Unit 2 Test (N2, A1) — Earning an Income: gross pay from a wage (hours and minutes), salaries and pay
 * periods, the hourly equivalent of a salary, overtime rates and Alberta's 8/44 rule, piecework and contracts, commission
 * (straight, salary plus commission, quotas, graduated), tips, bonuses, pooled tips, deductions (CPP, EI, income tax,
 * before-tax deductions) and net pay (N2); and working backwards by rearranging the pay formulas — hours = pay ÷ rate,
 * rate = pay ÷ hours, sales = commission ÷ rate, rounding hours up (A1). Built the way the Unit 1 test was built
 * (Beginning / Progressing / Mastery boxes, typed answers, keys from the generated numbers, `bad` answers with u2t- codes,
 * worked solutions and hints), with new items in the style of the booklet's review lesson (u2_l09.tex) and Practice
 * Test 2 (u2_ep09.tex). Calculator allowed. Constants as the booklet gives them (as of 2026): Alberta minimum wage $15.00/h;
 * students under 18 $13.00/h for the first 28 h a week while school is in session; overtime over 8 h a day or 44 h a week
 * (whichever gives more) at 1.5 × the wage; example deduction rates CPP 5.95%, EI 1.64%, income tax as each question gives.
 * The time math of Lesson 2.1 (REV) only appears as steps inside N2 problems.
 * 25 questions / 27 parts: Beginning 10 parts (N2 7, A1 3), Progressing 12 (N2 9, A1 3), Mastery 5 (N2 3, A1 2) — about
 * 76 minutes (short_report.js: 1.5 / 3 / 5 min a part). The short version (def.short) is about half of that and keeps every
 * box of both outcomes.
 *
 *   Beginning   — one-step skills: gross pay for hours and minutes (15/30/45 min); the pay for one pay period of a salary;
 *                 a time-and-a-half or double-time rate; piecework pay; a straight commission; a tip or a percent bonus;
 *                 one deduction (CPP, EI or income tax); (A1) the hours for a gross pay, the hourly rate from pay and
 *                 hours, the sales for a commission.
 *   Progressing — the typical assignment question: a timesheet with start and end times and unpaid breaks → gross pay;
 *                 the hourly equivalent of a salary, then which job pays more in a year and by how much; the Alberta 8/44
 *                 rule on a week's hours — overtime hours, then gross pay; a contractor's effective hourly rate; salary +
 *                 commission over a quota or a graduated commission; pooled tips shared by hours; a pay stub (gross, CPP,
 *                 EI, income tax, total, net); (A1) the wage from a stub with overtime (paid hours), the sales needed with
 *                 salary + commission, the whole hours needed to take home an amount (take-home %, round up).
 *   Mastery     — skills combined: the boss who counted only weekly overtime — how much more is owed; piecework in two
 *                 tiers topped up to the minimum wage; net pay with overtime and before-tax deductions (taxable income);
 *                 (A1) the sales where two pay plans pay the same; the hours to buy something with GST after CPP, EI and
 *                 income tax (round up).
 * Conversions to online: "complete the timesheet / pay stub" → the stub or timesheet shown as a table with labelled boxes
 * for the blanks (a pay stub's total and net are also right when they follow from the student's own boxes); "which job
 * pays more, and by how much" → a word box + a money box; "explain the mistake" (the boss's weekly-only count) → the amount
 * owed; "is it at least minimum wage?" → the top-up the employer must add; "how many whole hours" → a whole number (the
 * next whole number up is right; rounding down is wrong with a hint that shows the money is short; an unrounded answer gets
 * a nudge that doesn't use a try). Partial credit: a recognized mistake that is one slip keeps 2/3 ('s'), a bigger but
 * reasonable one keeps 1/3 ('b'), see HW.addPartial below; in a set of 3+ boxes, one box wrong is a small mistake.
 * Income tax follows Lesson 2.7 (as do the review u2_l09.tex and Practice Test 2 u2_ep09.tex): union dues, a pension and an
 * RRSP are before-tax deductions, and income tax is on the taxable income. Stubs here with tax "of gross pay" carry only
 * after-tax deductions (health plan, parking, a donation, boots), so taxable income = gross pay; the before-tax question
 * says "of taxable income".
 *
 * Also exports HW.u2assess, the assessment kit used by the Unit 2 exit slips (js/exits/u2.js loads after this file).
 * No lesson kit is needed: everything here is self-contained, so tools that load only the test files
 * (tests/short_report.js) still work. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u2assess = {};
  var MINW = 15, STUW = 13, STUH = 28, CPP = 5.95, EI = 1.64;

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
  function MH(x) { return t(Mt(x) + '\\text{/h}'); }
  function raw5(x) { var s = +x.toFixed(5); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toM(x) { return near(x, r2(x), 1e-7) ? '=\\$' + c2(x) : '=' + raw5(x) + '\\approx\\$' + c2(x); }
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '=' + raw5(x) + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u2 assessment: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function uT(s) { return s === '%' ? '\\%' : '\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function dec(p) { return nS(p / 100); }
  function pctT(p) { return N(p) + '\\%'; }
  function hmT(mins) { var h = Math.floor(mins / 60), m = mins % 60; return (h ? h + '\\text{ h}' : '') + (h && m ? '\\ ' : '') + (m || !h ? m + '\\text{ min}' : ''); }
  function clock(mins) { var h = Math.floor(mins / 60) % 24, m = mins % 60, h12 = h % 12 === 0 ? 12 : h % 12; return h12 + ':' + (m < 10 ? '0' : '') + m + '&nbsp;' + (h >= 12 ? 'p.m.' : 'a.m.'); }
  function c24(mins) { var h = Math.floor(mins / 60) % 24, m = mins % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  function people(r, k) { var out = []; while (out.length < k) out.push(person(r, out.map(function (p) { return p.n; }))); return out; }
  var CITIES = ['Red Deer', 'Airdrie', 'Lethbridge', 'Okotoks', 'Cochrane', 'Medicine Hat', 'Calgary', 'Edmonton', 'Camrose', 'Brooks'];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  Object.assign(A, { MINW: MINW, STUW: STUW, STUH: STUH, CPP: CPP, EI: EI, rd: rd, r2: r2, q: q, near: near, nS: nS, N: N, c2: c2, Mt: Mt, MM: MM, MH: MH, raw5: raw5, toM: toM, toN: toN,
    find: find, br: br, uT: uT, cap: cap, pickR: pickR, dec: dec, pctT: pctT, hmT: hmT, clock: clock, c24: c24, person: person, people: people, CITIES: CITIES, DAYS: DAYS });

  /* ================= reading and checking a number ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    var pct = /%/.test(s);
    s = s.replace(/\\\$|\$/g, '').replace(/\\%|%/g, '').replace(/\\[,;: ]|~/g, ' ').replace(/¢/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u2t-comma', 'Use a decimal point (not a comma), like 12.49.') };
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
      if (isAcc(v)) { if (money && a.pct) return form('u2t-pct-sign', 'This answer is an amount of money, not a percent. Leave the % sign out.'); return ok(); }
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      if (o.pct && v > 0 && v < 1.5 && isAcc(rd(v * 100, dp))) return form('u2t-as-pct', 'That’s the answer as a decimal. Multiply by 100 to write it as a percent.');
      for (var i = 0; i < dg.length; i++) {
        var m = dg[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
        if (dp >= 2 && d === dp - 1 && near(v, rd(m.v, d), 1e-9) && !acc.some(function (y) { return near(rd(y, d), v, 1e-9); })) return wrong(m.code, m.hint);
      }
      if (dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u2t-places', money ? 'Give money to the cent (2 decimal places), like $12.49.' : 'Round to ' + word + '.');
      if (d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u2t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  /* a whole number that must be rounded UP (hours, shifts, packages): exact = the unrounded value. o: { diag [{v, code, hint}]
   * (whole-number values), unit ('hours'), short(n) → text for the money n units give (shows rounding down is short) } */
  function upChk(exact, o) {
    o = o || {};
    var up = Math.ceil(exact - 1e-9), dn = up - 1, unit = o.unit || 'hours';
    var dg = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && m.v !== up; });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (near(v, up)) return ok();
      if (!near(v, Math.round(v)) && Math.abs(v - exact) < 0.6) return form('u2t-whole', 'Right so far — now give a whole number of ' + unit + '. To have <b>enough</b>, round up.');
      if (near(v, dn) && dn < exact - 1e-9) return wrong('u2t-round-down', t(dn) + ' ' + unit + ' is not quite enough' + (o.short ? ': ' + o.short(dn) : '') + '. To reach the goal, round <b>up</b>.');
      for (var i = 0; i < dg.length; i++) if (near(v, dg[i].v) || (!near(v, Math.round(v)) && Math.abs(v - dg[i].v) < 1)) return wrong(dg[i].code, dg[i].hint);
      return wrong('value', o.miss || null);
    };
  }
  /* a word answer (A or B, salary or hourly): the first 3 letters are enough */
  var STOP = { the: 1, job: 1, jobs: 1, store: 1, plan: 1, offer: 1, option: 1, is: 1, it: 1, pays: 1, more: 1, one: 1, 'in': 1, at: 1, by: 1 };
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
  function upPart(prompt, exact, o) {
    o = o || {};
    var up = Math.ceil(exact - 1e-9), key = String(up), unit = o.unit || 'hours';
    var p = { prompt: prompt, input: { type: 'number', after: o.after || 'h' }, check: upChk(exact, o), key: key, answer: t(up + '\\text{ ' + (o.ansUnit || 'h') + '}'), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = [String(up - 1)].concat((o.diag || []).filter(function (m) { return m && isFinite(m.v) && m.v !== up; }).map(function (m) { return String(m.v); }));
    p.good = [key + ' ' + unit];
    return p;
  }
  function mfld(label, ans, o) { o = o || {}; return { label: label, name: o.name, before: '$', after: o.after, chk: amtChk(ans, o), key: r2(ans).toFixed(2), show: t(Mt(ans)), bad: (o.diag || []).map(function (m) { return r2(m.v).toFixed(2); }) }; }
  /* several boxes (specs [{label, name, before, after, mode, ph, chk, key, show}]). Grading: all right → correct; one box wrong
   * in a set of 3 or more with no recognized mistake → 'u2t-one-box' (small), of 2 → 'u2t-half-box' (bigger); one recognized
   * mistake → its own code; several wrong boxes with the same recognized mistake → that code; otherwise 'u2t-many-box'. */
  function combine(res, labels) {
    var lab = function (i) { return '<b>' + labels[i] + ':</b> '; };
    var wi = [], fi = [];
    res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); });
    if (!wi.length && !fi.length) return ok();
    if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lab(fi[0]) + (f0.hint || 'Check this one again.')); }
    var w0 = res[wi[0]], hint = lab(wi[0]) + (w0.hint || 'Check this one again.');
    if (wi.length === 1) {
      if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
      return wrong(res.length >= 3 ? 'u2t-one-box' : 'u2t-half-box', hint);
    }
    var codes = wi.map(function (i) { return res[i].code; });
    if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
    return wrong('u2t-many-box', hint);
  }
  function multiChk(checks, labels) {
    return function (resp) { resp = resp || []; return combine(checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); }), labels); };
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
  /* "Which pays more, and by how much?": a word box + a money box. The amount decides the credit: right amount but the
   * wrong (or unclear) choice → 'u2t-which' (bigger); a wrong amount → its own code. */
  function whichAmtPart(prompt, o) {
    var amt = amtChk(o.amt, { alts: o.alts, diag: o.diag });
    var check = function (resp) {
      resp = resp || []; var w = whichOf(resp[0], o.right, o.wrongs), a = amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.whichLabel + '</b> Type your choice.');
      if (a.v === 'form') return form(a.code, '<b>By how much:</b> ' + (a.hint || 'Check the format.'));
      if (w === 'right' && a.v === 'correct') return ok();
      if (w !== 'right' && a.v === 'correct') return wrong('u2t-which', w === 'both' || w === 'none' ? 'Type just one choice: ' + o.nudge : o.why);
      return wrong(a.code || 'value', '<b>By how much:</b> ' + (a.hint || 'Find each amount, then subtract.'));
    };
    var key = [o.rightKey, r2(o.amt).toFixed(2)];
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.whichLabel, name: o.whichName || 'Which', mode: 'text', placeholder: o.ph, wide: true }, { label: 'By how much:', name: 'By how much', before: '$' }] },
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
  /* a timesheet, pay stub or rate table (HTML) */
  function table(head, rows, title) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em">' + (title ? '<tr><th colspan="' + head.length + '" ' + th + '>' + title + '</th></tr>' : '') +
      (head.length ? '<tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  /* the usual percent mistakes for "p% of X" (money): × p, × p/10 (or p/1000 for a rate under 10%), X + the part, X − the part */
  function pctDiag(p, X, o) {
    o = o || {};
    var L = [{ v: X * p, code: 'u2t-pct-whole', hint: 'Change the percent to a decimal first: ' + t(pctT(p) + '=' + dec(p)) + ' (move the decimal point 2 places left).' },
      { v: X * p / 10, code: 'u2t-pct-10', hint: t(pctT(p) + '=' + dec(p)) + ': move the decimal point <b>two</b> places left, not one.' }];
    if (p < 10) L.push({ v: X * p / 1000, code: 'u2t-pct-10', hint: t(pctT(p) + '=' + dec(p)) + ': move the decimal point exactly two places left.' });
    if (o.total !== false) L.push({ v: X * (1 + p / 100), code: 'u2t-pct-total', hint: o.totalHint || 'That adds the ' + t(pctT(p)) + ' to the whole amount. The question asks for the ' + t(pctT(p)) + ' part only.' });
    if (o.left) L.push({ v: X * (1 - p / 100), code: 'u2t-left', hint: o.left });
    return L;
  }
  Object.assign(A, { readNum: readNum, amtChk: amtChk, upChk: upChk, whichOf: whichOf, amtPart: amtPart, upPart: upPart, mfld: mfld, combine: combine, multiChk: multiChk, fieldsPart: fieldsPart,
    whichAmtPart: whichAmtPart, reasonMC: reasonMC, numMC: numMC, table: table, pctDiag: pctDiag });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u2t-comma': 'Comma instead of a decimal point', 'u2t-places': 'Not rounded to the place asked', 'u2t-round-dir': 'Rounded the wrong way', 'u2t-pct-sign': 'Money written with a % sign',
    'u2t-as-pct': 'Gave the decimal instead of the percent', 'u2t-which': 'Right amount, wrong (or unclear) choice', 'u2t-whole': 'Not rounded to a whole number',
    'u2t-one-box': 'One box of several wrong', 'u2t-half-box': 'One of the two boxes wrong', 'u2t-many-box': 'Several boxes wrong',
    'u2t-min-dec': 'Minutes written as a decimal (45 min as 0.45 h)', 'u2t-no-min': 'Left the minutes out', 'u2t-mins': 'Used the time in minutes as hours',
    'u2t-periods': 'Wrong number of pay periods', 'u2t-add15': 'Added $1.50 (or 2) instead of multiplying', 'u2t-half-only': 'Gave only the extra half', 'u2t-ot-mix': 'Mixed up time and a half and double time',
    'u2t-cents': 'Used a rate in cents as dollars', 'u2t-flip': 'Divided the wrong way', 'u2t-times': 'Multiplied instead of dividing', 'u2t-sub': 'Subtracted instead of dividing',
    'u2t-pct-whole': 'Percent not changed to a decimal', 'u2t-pct-10': 'Percent changed to a decimal wrongly (one or three places)', 'u2t-pct-total': 'Added the percent to the whole amount',
    'u2t-left': 'Gave the amount left instead of the deduction', 'u2t-div-pct': 'Divided by the percent, not the decimal (÷ 8 for 8%)', 'u2t-pct-dec-10': 'Divided by the percent ÷ 10',
    'u2t-break': 'Unpaid break not taken off', 'u2t-weekly': 'Gave the weekly pay instead of the hourly', 'u2t-no52': 'Left out the 52 weeks', 'u2t-brackets': 'Hourly equivalent without brackets (÷ hours × 52)',
    'u2t-week-diff': 'Compared one week instead of a year', 'u2t-same-hours': 'Used the same hours for both jobs', 'u2t-gave-total': 'Gave a total instead of the difference',
    'u2t-ot-added': 'Added the daily and weekly overtime', 'u2t-ot-smaller': 'Used the smaller overtime count', 'u2t-ot-40': 'Weekly overtime over 40 h (not 44 h)',
    'u2t-ot-none': 'Paid overtime hours at the regular rate', 'u2t-ot-reg-all': 'Regular hours not reduced by the overtime hours', 'u2t-ot-all': 'Paid every hour at the overtime rate',
    'u2t-no-mat': 'Left out the materials', 'u2t-no-helper': 'Left out the helper’s pay', 'u2t-no-costs': 'Divided the whole price by the hours', 'u2t-helper-hrs': 'Added the helper’s hours to the contractor’s',
    'u2t-gave-profit': 'Gave the profit instead of the hourly rate', 'u2t-quota': 'Commission on all the sales, not just over the quota', 'u2t-no-base': 'Left out the base pay',
    'u2t-quota-nobase': 'Commission on all sales and no base pay', 'u2t-grad-all': 'Higher rate on all the sales', 'u2t-grad-nosub': 'First level not subtracted from the sales',
    'u2t-grad-low': 'Lower rate on all the sales', 'u2t-tips-equal': 'Shared the tips equally, not by hours', 'u2t-per-hour': 'Gave the tips per hour', 'u2t-tips-div': 'Divided the tips by the person’s hours',
    'u2t-stub-gross': 'Gross pay wrong on the stub', 'u2t-ded-added': 'Added the deductions to the gross pay', 'u2t-paid-hrs': 'Overtime hours not counted as 1.5 paid hours',
    'u2t-no-ot': 'Left the overtime hours out', 'u2t-paid-dbl': 'Counted overtime hours as 2 paid hours', 'u2t-no-salary': 'Did not take the salary off first',
    'u2t-round-down': 'Rounded the hours down (not enough)', 'u2t-gross': 'Used the gross pay where net pay is needed', 'u2t-ded-rate': 'Used the deduction rate instead of the part kept',
    'u2t-owed-full': 'Owed amount at the full overtime rate (not the extra half)', 'u2t-owed-reg': 'Owed amount at the regular rate', 'u2t-no-daily': 'Did not use the daily overtime count',
    'u2t-tier-all': 'One piece rate for all the pieces', 'u2t-topup-total': 'Gave the minimum-wage pay instead of the top-up', 'u2t-gave-pay': 'Gave the piecework pay instead of the top-up',
    'u2t-topup-perh': 'Gave the shortfall per hour, not for the week', 'u2t-tax-gross': 'Income tax on the gross pay instead of the taxable income', 'u2t-pretax-left': 'Before-tax deductions left out of the total',
    'u2t-cpp-taxable': 'CPP and EI on the taxable income', 'u2t-gave-ded': 'Gave the total deductions instead of the net pay', 'u2t-gave-taxable': 'Gave the taxable income instead of the net pay',
    'u2t-be-salary': 'Divided the whole salary by the rate', 'u2t-be-base': 'Divided only the base pay by the rate', 'u2t-be-one-rate': 'Used one rate instead of the difference in rates',
    'u2t-no-gst': 'Left out the GST', 'u2t-early-round': 'Rounded the net pay per hour too early'
  });
  HW.addPartial({
    'u2t-round-dir': 's', 'u2t-which': 'b', 'u2t-one-box': 's', 'u2t-half-box': 'b', 'u2t-many-box': 'n', 'u2t-min-dec': 'b', 'u2t-no-min': 'b', 'u2t-mins': 'n', 'u2t-periods': 'b', 'u2t-add15': 'n',
    'u2t-half-only': 'b', 'u2t-ot-mix': 'b', 'u2t-cents': 'b', 'u2t-flip': 'n', 'u2t-times': 'n', 'u2t-sub': 'n', 'u2t-pct-whole': 'n', 'u2t-pct-10': 'b', 'u2t-pct-total': 'b', 'u2t-left': 'b',
    'u2t-div-pct': 'b', 'u2t-pct-dec-10': 'b', 'u2t-break': 'b', 'u2t-weekly': 'b', 'u2t-no52': 'n', 'u2t-brackets': 'n', 'u2t-week-diff': 'b', 'u2t-same-hours': 'b', 'u2t-gave-total': 'b',
    'u2t-ot-added': 'n', 'u2t-ot-smaller': 'b', 'u2t-ot-40': 'b', 'u2t-ot-none': 'b', 'u2t-ot-reg-all': 'b', 'u2t-ot-all': 'n', 'u2t-no-mat': 'b', 'u2t-no-helper': 'b', 'u2t-no-costs': 'n',
    'u2t-helper-hrs': 'b', 'u2t-gave-profit': 'b', 'u2t-quota': 'b', 'u2t-no-base': 'b', 'u2t-quota-nobase': 'n', 'u2t-grad-all': 'b', 'u2t-grad-nosub': 'b', 'u2t-grad-low': 'n',
    'u2t-tips-equal': 'n', 'u2t-per-hour': 'b', 'u2t-tips-div': 'n', 'u2t-stub-gross': 'b', 'u2t-ded-added': 'n', 'u2t-paid-hrs': 'b', 'u2t-no-ot': 'n', 'u2t-paid-dbl': 's', 'u2t-no-salary': 'b',
    'u2t-round-down': 's', 'u2t-gross': 'b', 'u2t-ded-rate': 'n', 'u2t-owed-full': 'b', 'u2t-owed-reg': 'b', 'u2t-no-daily': 'n', 'u2t-tier-all': 'b', 'u2t-topup-total': 'b', 'u2t-gave-pay': 'b',
    'u2t-topup-perh': 'b', 'u2t-tax-gross': 'b', 'u2t-pretax-left': 'b', 'u2t-cpp-taxable': 's', 'u2t-gave-ded': 'b', 'u2t-gave-taxable': 'b', 'u2t-be-salary': 'b', 'u2t-be-base': 'n',
    'u2t-be-one-rate': 'b', 'u2t-no-gst': 'b', 'u2t-early-round': 's'
  });

  /* ================= shared generators (the test and the exit slips) ================= */
  var WORK = ['at a grocery store', 'at a coffee shop', 'at a garden centre', 'at a car wash', 'at a hardware store', 'at a movie theatre', 'at a pizza place', 'at a sporting goods store'];
  /* gross pay for h h m min (15, 30 or 45 min) at a wage */
  function grossHMPart(r, o) {
    o = o || {};
    var p = person(r), h = r.int(16, 38), m = r.pick(o.mins || [15, 30, 45, 45, 15]), w = pickR(r, [15.25, 22.75, 0.05]), dh = h + m / 60, G = dh * w;
    return amtPart(p.n + ' works ' + t(h + '\\text{ h }' + m + '\\text{ min}') + ' this week ' + r.pick(WORK) + ' for ' + MH(w) + '. What is ' + p.his + ' gross pay?', G, { alts: [rd(dh, 2) * w],
      diag: [{ v: (h + m / 100) * w, code: 'u2t-min-dec', hint: t(m + '\\text{ min}') + ' is not ' + t(nS(m / 100) + '\\text{ h}') + '. Change the minutes to hours: ' + t(m + '\\div 60=' + nS(rd(m / 60, 4))) + '.' },
        { v: h * w, code: 'u2t-no-min', hint: 'Include the ' + t(m + '\\text{ min}') + ': ' + t(m + '\\div 60=' + nS(rd(m / 60, 4))) + ' h.' }, { v: (60 * h + m) * w, code: 'u2t-mins', hint: 'That multiplies the minutes by the hourly wage. Change the time to hours first.' }],
      sol: br([t(m + '\\div 60=' + nS(rd(m / 60, 4))) + ', so ' + t(h + '\\text{ h }' + m + '\\text{ min}=' + nS(rd(dh, 4)) + '\\text{ h}'), t(nS(rd(dh, 4)) + '\\times ' + Mt(w) + toM(G))]),
      hints: ['Change the minutes to part of an hour: minutes ÷ 60.', 'Gross pay = hours × hourly wage.'], text: o.text || 'gross pay, h and min' });
  }
  /* the pay for one pay period of a salary */
  var PERIODS = [{ k: 'weekly', n: 52, d: 'every week: 52 pays a year' }, { k: 'biweekly', n: 26, d: 'every 2 weeks: 26 pays a year' }, { k: 'semi-monthly', n: 24, d: 'twice a month: 24 pays a year' }, { k: 'monthly', n: 12, d: 'once a month: 12 pays a year' }];
  var SALJOBS = ['A lab technician', 'An office manager', 'An apprentice welder', 'A dental assistant', 'A youth worker', 'A bookkeeper', 'A park ranger', 'A pharmacy assistant'];
  function periodPart(r, o) {
    o = o || {};
    var S = pickR(r, [33800, 64480, 520]), pr = r.pick(PERIODS), ans = S / pr.n;
    var diag = PERIODS.filter(function (x) { return x.n !== pr.n; }).map(function (x) { return { v: S / x.n, code: 'u2t-periods', hint: 'That divides by ' + x.n + ' (' + x.k + '). ' + cap(pr.k) + ' means ' + pr.d + '.' }; });
    diag.push({ v: S * pr.n, code: 'u2t-times', hint: 'Each pay is part of the salary: divide by the number of pays.' });
    return amtPart(r.pick(SALJOBS) + ' earns a salary of ' + t('\\$' + N(S)) + ' a year, paid ' + pr.k + '. How much is each pay?', ans, { diag: diag,
      sol: br([cap(pr.k) + ': ' + pr.d + '.', t('\\$' + N(S) + '\\div ' + pr.n + toM(ans))]), hints: ['How many pays are there in a year? Weekly 52, biweekly 26, semi-monthly 24, monthly 12.', 'Pay per cheque = yearly salary ÷ number of pays.'], text: o.text || pr.k + ' pay' });
  }
  /* a time-and-a-half or double-time rate */
  var OTJOBS = ['A cook', 'A welder', 'A hotel clerk', 'A warehouse worker', 'A nurse aide', 'A carpenter', 'A bus driver'];
  function otRatePart(r, o) {
    o = o || {};
    var w = pickR(r, [15.5, 26.75, 0.05]), dbl = r.chance(0.3), k = dbl ? 2 : 1.5, R = w * k;
    var diag = [{ v: w + k, code: 'u2t-add15', hint: (dbl ? 'Double time' : 'Time and a half') + ' means ' + k + ' <b>times</b> the wage, not ' + t('\\$' + k.toFixed(2)) + ' more: ' + t(Mt(w) + '\\times ' + k) + '.' },
      { v: w * (dbl ? 1.5 : 2), code: 'u2t-ot-mix', hint: dbl ? 'That’s time and a half. Double time is 2 × the wage.' : 'That’s double time. Time and a half is 1.5 × the wage.' }];
    if (!dbl) diag.push({ v: w * 0.5, code: 'u2t-half-only', hint: 'That’s only the extra half. Add it to the wage (or multiply by 1.5).' });
    return amtPart(r.pick(OTJOBS) + ' earns ' + MH(w) + '. What is ' + (dbl ? 'the double-time' : 'the time-and-a-half') + ' rate?', R, { after: '/h', diag: diag,
      sol: t(Mt(w) + '\\times ' + k + toM(R)) + '/h', hints: [dbl ? 'Double time = wage × 2.' : 'Time and a half = wage × 1.5.'], text: o.text || (dbl ? 'double-time rate' : 'time-and-a-half rate') });
  }
  /* piecework pay */
  var PIECE = [{ w: 'plants trees in northern Alberta for', it: 'tree', pl: 'trees', c: [12, 22], n: [1200, 2600, 50] }, { w: 'delivers flyers for', it: 'flyer', pl: 'flyers', c: [6, 12], n: [800, 1800, 25] },
    { w: 'sews shirts at home for', it: 'shirt', pl: 'shirts', d: [2.25, 4.75, 0.25], n: [35, 110, 1] }, { w: 'picks strawberries for', it: 'flat', pl: 'flats', d: [3.5, 6, 0.25], n: [24, 70, 1] },
    { w: 'paints model kits for', it: 'kit', pl: 'kits', d: [1.75, 3.5, 0.25], n: [40, 120, 1] }];
  function piecePart(r, o) {
    o = o || {};
    var c = r.pick(PIECE), p = person(r), rate = c.c ? r.int(c.c[0], c.c[1]) / 100 : pickR(r, c.d), n = pickR(r, c.n), pay = n * rate;
    var diag = [{ v: n / rate, code: 'u2t-flip', hint: 'Pay = number of pieces × pay per piece.' }];
    if (c.c) diag.push({ v: n * rate * 100, code: 'u2t-cents', hint: t(Math.round(rate * 100)) + '¢ is ' + t(Mt(rate)) + ': write the rate in dollars first.' });
    return amtPart(p.n + ' ' + c.w + ' ' + (c.c ? t(Math.round(rate * 100)) + '¢ (' + MM(rate) + ')' : MM(rate)) + ' a ' + c.it + '. One week ' + p.he + ' finishes ' + t(N(n)) + ' ' + c.pl + '. What does ' + p.he + ' earn?', pay, { diag: diag,
      sol: t(N(n) + '\\times ' + Mt(rate) + toM(pay)), hints: ['Piecework pay = number of pieces × piece rate.'], text: o.text || 'piecework pay' });
  }
  /* a straight commission */
  var SALES = [['sells phones', 3500, 18000], ['sells cars', 30000, 90000], ['sells furniture', 8000, 32000], ['sells appliances', 6000, 26000], ['sells hot tubs', 12000, 48000], ['sells shoes', 3000, 12000]];
  function commPart(r, o) {
    o = o || {};
    var c = r.pick(SALES), p = person(r), pc = r.pick([3, 4, 5, 6, 2.5, 3.5, 4.5, 7, 8, 12]), S = r.int(c[1] / 5, c[2] / 5) * 5, C = S * pc / 100;
    return amtPart(p.n + ' ' + c[0] + ' and earns a straight commission of ' + t(pctT(pc)) + '. This month ' + p.his + ' sales are ' + MM(S) + '. What is ' + p.his + ' commission?', C, { diag: pctDiag(pc, S, { totalHint: 'That adds the commission to the sales. The commission is only the ' + t(pctT(pc)) + ' part.' }),
      sol: br([t(pctT(pc) + '=' + dec(pc)), t(Mt(S) + '\\times ' + dec(pc) + toM(C))]), hints: ['Change the rate to a decimal.', 'Commission = sales × rate.'], text: o.text || 'straight commission' });
  }
  /* a tip on a bill, or a percent bonus on a salary */
  function extraPart(r, o) {
    o = o || {};
    var kind = o.kind || r.pick(['tip', 'bonus']);
    if (kind === 'tip') {
      var B = q(r.int(3500, 19500) / 100), pc = r.pick([15, 18, 20, 12, 15]), T = B * pc / 100, who = r.pick(['a family of four', 'a group of friends', 'a hockey team', 'a couple']);
      return amtPart('The restaurant bill for ' + who + ' is ' + MM(B) + '. They leave a ' + t(pctT(pc)) + ' tip. How much is the tip?', T, { diag: pctDiag(pc, B, { totalHint: 'That’s the bill plus the tip. The question asks for the tip only.' }),
        sol: t(Mt(B) + '\\times ' + dec(pc) + toM(T)), hints: ['Tip = bill × tip rate (as a decimal).'], text: o.text || 'tip' });
    }
    var S = pickR(r, [38000, 66000, 400]), b = r.pick([2, 3, 4, 2.5, 5, 1.5]), X = S * b / 100;
    return amtPart('A store manager earns a salary of ' + t('\\$' + N(S)) + ' and gets a ' + t(pctT(b)) + ' year-end bonus. How much is the bonus?', X, { diag: pctDiag(b, S, { totalHint: 'That’s the salary plus the bonus. The question asks for the bonus only.' }),
      sol: t('\\$' + N(S) + '\\times ' + dec(b) + toM(X)), hints: ['Bonus = salary × bonus rate (as a decimal).'], text: o.text || 'percent bonus' });
  }
  /* one deduction: CPP, EI or income tax on a gross pay */
  function dedPart(r, o) {
    o = o || {};
    var p = person(r), G = q(r.int(1080, 3360) / 2), kind = o.kind || r.pick(['CPP', 'EI', 'tax']), rate = kind === 'CPP' ? CPP : kind === 'EI' ? EI : r.int(12, 18), D = G * rate / 100;
    var nm = kind === 'CPP' ? 'CPP (Canada Pension Plan)' : kind === 'EI' ? 'EI (Employment Insurance)' : 'income tax';
    return amtPart(p.n + '’s gross pay this week is ' + MM(G) + '. ' + cap(p.his) + ' ' + nm + ' deduction is ' + t(pctT(rate)) + ' of gross pay. How much is taken off for ' + (kind === 'tax' ? 'income tax' : kind) + '?', D, {
      diag: pctDiag(rate, G, { total: false, left: 'That’s what is left after the deduction. The question asks for the deduction itself: ' + t(Mt(G) + '\\times ' + dec(rate)) + '.' }),
      sol: br([t(pctT(rate) + '=' + dec(rate)), t(Mt(G) + '\\times ' + dec(rate) + toM(D))]), hints: ['Change the percent to a decimal: move the decimal point 2 places left.', 'Deduction = gross pay × rate.'], text: o.text || kind + ' deduction' });
  }
  /* (A1) hours = pay ÷ rate */
  function hoursPart(r, o) {
    o = o || {};
    var p = person(r), w = pickR(r, [15.5, 19.75, 0.25]), h = r.int(22, 44), pay = w * h;
    return amtPart(p.n + ' earns ' + MH(w) + ' ' + r.pick(WORK) + '. How many hours must ' + p.he + ' work to earn ' + MM(pay) + ' (gross)?', h, { dp: 2, plain: true, after: 'h',
      diag: [{ v: w / pay, code: 'u2t-flip', hint: 'hours = pay ÷ rate: divide the <b>pay</b> by the wage.' }, { v: pay * w, code: 'u2t-times', hint: 'pay = rate × hours, so hours = pay ÷ rate. Divide.' }, { v: pay - w, code: 'u2t-sub', hint: 'Rearrange pay = rate × hours: hours = pay ÷ rate.' }],
      sol: br(['hours = pay ÷ rate', t(Mt(pay) + '\\div ' + Mt(w) + '=' + N(h)) + ' h', 'Check: ' + t(N(h) + '\\times ' + Mt(w) + '=' + Mt(pay)) + ' ✓']),
      hints: ['Rearrange pay = rate × hours to get the hours by themselves.', 'hours = pay ÷ rate.'], text: o.text || 'hours = pay ÷ rate' });
  }
  /* (A1) rate = pay ÷ hours */
  function ratePart(r, o) {
    o = o || {};
    var v = find(function () { return [pickR(r, [15.25, 22.5, 0.25]), r.pick([24, 25.5, 30, 32.5, 36, 37.5, 38, 120, 144, 160, 136])]; }, function (v) { return near(v[0] * v[1] * 100, Math.round(v[0] * v[1] * 100), 1e-6); }), w = v[0], h = v[1], pay = w * h, job = r.pick(['A summer job', 'A job at a garden centre', 'A lifeguard job', 'A job at a landscaping company']);
    return amtPart(job + ' paid ' + MM(pay) + ' gross for ' + t(N(h)) + ' h of work. What was the hourly rate?', w, { after: '/h',
      diag: [{ v: h / pay, code: 'u2t-flip', hint: 'rate = pay ÷ hours: divide the <b>pay</b> by the hours.' }, { v: pay * h, code: 'u2t-times', hint: 'pay = rate × hours, so rate = pay ÷ hours. Divide.' }],
      sol: br(['rate = pay ÷ hours', t(Mt(pay) + '\\div ' + N(h) + '=' + Mt(w)) + '/h', 'Check: ' + t(N(h) + '\\times ' + Mt(w) + '=' + Mt(pay)) + ' ✓']),
      hints: ['Rearrange pay = rate × hours to get the rate by itself.', 'rate = pay ÷ hours.'], text: o.text || 'rate = pay ÷ hours' });
  }
  /* (A1) sales = commission ÷ rate */
  function salesPart(r, o) {
    o = o || {};
    var p = person(r), v = find(function () { return [r.pick([4, 5, 6, 8, 2.5, 3, 7.5, 12]), pickR(r, [800, 3600, 100])]; }, function (v) { var s = v[1] / (v[0] / 100); return near(s * 100, Math.round(s * 100), 1e-6); });
    var pc = v[0], C = v[1], S = C / (pc / 100);
    return amtPart(p.n + ' earns a straight ' + t(pctT(pc)) + ' commission. How much must ' + p.he + ' sell to earn ' + MM(C) + ' this month?', S, {
      diag: [{ v: C / pc, code: 'u2t-div-pct', hint: 'Change the rate to a decimal first: ' + t(pctT(pc) + '=' + dec(pc)) + '. Sales needed are always much bigger than the commission.' }, { v: C * pc / 100, code: 'u2t-times', hint: 'commission = rate × sales, so sales = commission ÷ rate. Divide.' },
        { v: C / (pc / 10), code: 'u2t-pct-10', hint: t(pctT(pc) + '=' + dec(pc)) + ': move the decimal point two places left.' }],
      sol: br(['sales = commission ÷ rate', t(Mt(C) + '\\div ' + dec(pc) + '=' + Mt(S)), 'Check: ' + t(Mt(S) + '\\times ' + dec(pc) + '=' + Mt(C)) + ' ✓']),
      hints: ['Rearrange commission = rate × sales.', 'sales = commission ÷ rate (as a decimal).'], text: o.text || 'sales = commission ÷ rate' });
  }
  /* a timesheet with start / end times and unpaid breaks → gross pay */
  function sheetShifts(r, k) {
    return find(function () {
      var ds = r.sample([0, 1, 2, 3, 4, 5, 6], k).sort(function (a, b) { return a - b; });
      return ds.map(function (d) { var st = 60 * r.int(7, 15) + 15 * r.int(0, 3), len = 15 * r.int(16, 38), brk = len > 300 ? r.pick([30, 30, 0]) : 0; return { d: d, st: st, en: st + len, len: len, brk: brk, h: (len - brk) / 60 }; });
    }, function (rows) { return rows.every(function (x) { return x.en <= 23 * 60; }) && rows.some(function (x) { return x.brk; }) && rows.some(function (x) { return x.st < 720 && x.en > 720; }) && rows.some(function (x) { return x.len % 60; }); });
  }
  function sheetTable(rows, use24) { return table(['Day', 'Start', 'End', 'Unpaid break'], rows.map(function (x) { return [DAYS[x.d], use24 ? c24(x.st) : clock(x.st), use24 ? c24(x.en) : clock(x.en), x.brk ? x.brk + ' min' : 'none']; })); }
  function sheetLines(rows) { return rows.map(function (x) { return DAYS[x.d] + ': ' + clock(x.st) + ' to ' + clock(x.en) + ' is ' + t(hmT(x.len)) + (x.brk ? ', minus ' + x.brk + ' min = ' + t(hmT(x.len - x.brk)) : '') + ' = ' + t(nS(x.h) + '\\text{ h}'); }); }
  function sheetPart(r, o) {
    o = o || {};
    var p = person(r), w = pickR(r, [15.25, 19.75, 0.05]), rows = sheetShifts(r, 3), H = rows.reduce(function (s, x) { return s + x.h; }, 0), G = H * w;
    var noBrk = rows.reduce(function (s, x) { return s + x.len / 60; }, 0), asDec = rows.reduce(function (s, x) { var m = (x.len - x.brk) % 60; return s + Math.floor((x.len - x.brk) / 60) + m / 100; }, 0);
    return amtPart(p.n + ' works ' + r.pick(WORK) + ' for ' + MH(w) + '. Here is ' + p.his + ' timesheet for the week.' + sheetTable(rows) + 'What is ' + p.his + ' gross pay for the week?', G, {
      diag: [{ v: noBrk * w, code: 'u2t-break', hint: 'Take each <b>unpaid</b> break off that day’s hours before you add them.' }, { v: asDec * w, code: 'u2t-min-dec', hint: 'Change minutes to part of an hour (30 min = 0.5 h, 45 min = 0.75 h), not to a decimal like 0.30.' },
        { v: H, code: 'u2t-no-min', hint: 'That’s the hours worked. Multiply by the wage to get the pay.' }],
      sol: br(sheetLines(rows).concat(['Total: ' + t(rows.map(function (x) { return nS(x.h); }).join('+') + '=' + nS(H)) + ' h', 'Gross pay: ' + t(nS(H) + '\\times ' + Mt(w) + toM(G))])),
      hints: ['For each day, count up from the start to the end, then take off the unpaid break.', 'Add the hours, then multiply by the wage.'], text: o.text || 'timesheet gross pay' });
  }
  /* a salary job and an hourly job */
  function salShared(r) {
    return find(function () {
      var wk = pickR(r, [820, 1160, 10]), hrs = r.pick([40, 40, 37.5]), S = wk * 52, hr = wk / hrs, h2 = r.pick([37.5, 35, 40, 36, 32]), w2 = q(Math.round((hr + r.pick([0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, -0.25, 0.25])) * 20) / 20);
      return { p: person(r), S: S, wk: wk, hrs: hrs, hr: hr, h2: h2, w2: w2, Y2: w2 * h2 * 52, job: r.pick(['an office manager', 'a lab technician', 'a dental assistant', 'an apprentice welder', 'a bookkeeper']) };
    }, function (s) { return Math.abs(s.Y2 - s.S) >= 150 && near(s.hr * 100, Math.round(s.hr * 100), 1e-6) && near(s.Y2 * 100, Math.round(s.Y2 * 100), 1e-6) && s.w2 > MINW && s.h2 !== s.hrs; });
  }
  function salStem(s) { return s.p.n + ' is offered two jobs.<br><b>Job A:</b> ' + s.job + ', with a salary of ' + t('\\$' + N(s.S)) + ' a year for ' + t(N(s.hrs)) + ' h a week.<br><b>Job B:</b> ' + MH(s.w2) + ' for ' + t(N(s.h2)) + ' h a week.'; }
  function salHourPart(r, s) {
    return amtPart('What is the hourly equivalent of Job A’s salary?', s.hr, { after: '/h',
      diag: [{ v: s.wk, code: 'u2t-weekly', hint: 'That’s the weekly pay. Divide it by the ' + t(N(s.hrs)) + ' hours in a week.' }, { v: s.S / s.hrs, code: 'u2t-no52', hint: 'Find the weekly pay first: ' + t('\\$' + N(s.S) + '\\div 52') + '.' },
        { v: s.S / s.hrs * 52, code: 'u2t-brackets', hint: 'Divide by the hours in a <b>year</b>: ' + t('\\$' + N(s.S) + '\\div(' + N(s.hrs) + '\\times 52)') + ' — use brackets.' }, { v: s.S / 12 / s.hrs, code: 'u2t-periods', hint: 'Use weeks: the salary ÷ 52 is the weekly pay, then ÷ the hours a week.' }],
      sol: br(['Weekly: ' + t('\\$' + N(s.S) + '\\div 52=' + Mt(s.wk)), 'Hourly: ' + t(Mt(s.wk) + '\\div ' + N(s.hrs) + toM(s.hr)) + ' per hour']),
      hints: ['Find the weekly pay: salary ÷ 52.', 'Then divide by the hours in a week.'], text: 'hourly equivalent' });
  }
  function salWhichPart(r, s) {
    var aMore = s.S > s.Y2, d = Math.abs(s.S - s.Y2);
    return whichAmtPart('Which job pays more in a year, and by how much?', { amt: d, whichLabel: 'Pays more (A or B):', whichName: 'Pays more', ph: 'A or B', right: [aMore ? 'a' : 'b'], wrongs: [aMore ? 'b' : 'a'],
      rightKey: 'Job ' + (aMore ? 'A' : 'B'), wrongKey: 'Job ' + (aMore ? 'B' : 'A'), why: 'Find what each job pays in a year, then compare.', nudge: 'type A or B.',
      diag: [{ v: Math.abs(s.wk - s.w2 * s.h2), code: 'u2t-week-diff', hint: 'That’s the difference for one week. The question asks about a year (52 weeks).' }, { v: Math.abs(s.S - s.w2 * s.hrs * 52), code: 'u2t-same-hours', hint: 'Job B is only ' + t(N(s.h2)) + ' h a week.' },
        { v: Math.max(s.S, s.Y2), code: 'u2t-gave-total', hint: 'That’s one job’s yearly pay. Subtract to find how much more.' }, { v: Math.abs(s.hr - s.w2), code: 'u2t-week-diff', hint: 'That compares the hourly rates. The jobs have different hours: compare the pay for a whole year.' }],
      sol: br(['Job B: ' + t(Mt(s.w2) + '\\times ' + N(s.h2) + '\\times 52=' + Mt(s.Y2)) + ' a year', 'Job A: ' + t('\\$' + N(s.S)) + ' a year', t(Mt(Math.max(s.S, s.Y2)) + '-' + Mt(Math.min(s.S, s.Y2)) + '=' + Mt(d)), '<b>Job ' + (aMore ? 'A' : 'B') + '</b> pays ' + MM(d) + ' more a year.' + (aMore && s.w2 > s.hr ? ' (Job B has the higher rate but fewer hours.)' : '')]),
      hints: ['Job B in a year: rate × hours a week × 52.', 'Subtract the smaller yearly pay from the bigger one.'], text: 'salary vs hourly, a year' });
  }
  /* Alberta 8/44 on a week of hours */
  var DHRS = [0, 6, 7, 7.5, 8, 8, 8, 8.5, 9, 9.5, 10, 10.5, 11];
  function otCount(days) { var tot = days.reduce(function (s, h) { return s + h; }, 0), daily = days.reduce(function (s, h) { return s + Math.max(0, h - 8); }, 0), weekly = Math.max(0, tot - 44); return { tot: q(tot), daily: q(daily), weekly: q(weekly), ot: q(Math.max(daily, weekly)) }; }
  function otShared(r) {
    var dailyWins = r.chance(0.5);
    return find(function () {
      var days = [0, 1, 2, 3, 4, 5].map(function () { return r.pick(DHRS); });
      return { p: person(r), w: pickR(r, [17.5, 25.8, 0.1]), days: days, c: otCount(days), city: r.pick(CITIES), job: r.pick(['a tire shop', 'a warehouse', 'a lumber yard', 'a bakery', 'a greenhouse', 'an auto body shop']) };
    }, function (s) { var c = s.c, n = s.days.filter(Boolean).length; return n >= 5 && c.tot >= 40 && c.tot <= 54 && Math.abs(c.daily - c.weekly) >= 0.5 && c.ot >= 1.5 && c.ot <= 9 && (dailyWins ? c.daily > c.weekly : c.weekly > c.daily); });
  }
  function otTable(days) { return table(['Day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], [['Hours worked'].concat(days.map(function (h) { return nS(h); }))]); }
  function otStem(s) { return s.p.n + ' works at ' + s.job + ' in ' + s.city + ' for ' + MH(s.w) + '. Overtime is time and a half under the Alberta rules. Here are ' + s.p.his + ' hours this week.' + otTable(s.days); }
  function otLines(s) { var c = s.c; return ['Daily: hours over 8 = ' + t(s.days.filter(function (h) { return h > 8; }).map(function (h) { return nS(q(h - 8)); }).join('+') || '0') + ' = ' + t(nS(c.daily)) + ' h', 'Weekly: total ' + t(nS(c.tot)) + ' h; ' + (c.tot > 44 ? t(nS(c.tot) + '-44=' + nS(c.weekly)) + ' h' : 'not over 44, so 0 h'), 'Use the bigger: ' + t(nS(c.ot)) + ' h of overtime; regular hours ' + t(nS(c.tot) + '-' + nS(c.ot) + '=' + nS(q(c.tot - c.ot))) + ' h']; }
  function otHoursPart(r, s) {
    var c = s.c, sm = Math.min(c.daily, c.weekly);
    return amtPart('How many overtime hours ' + (s.p.he === 'she' ? 'does she' : 'does he') + ' get?', c.ot, { dp: 2, plain: true, after: 'h',
      diag: [{ v: q(c.daily + c.weekly), code: 'u2t-ot-added', hint: 'Don’t add the two counts: they count the same extra hours two ways. Use the bigger one.' }, { v: sm, code: 'u2t-ot-smaller', hint: 'Count both ways: daily (hours over 8 each day) and weekly (total − 44). Use the <b>bigger</b> count.' },
        { v: q(c.tot - 40), code: 'u2t-ot-40', hint: 'In Alberta, weekly overtime starts after <b>44</b> h, not 40 h. Check the daily count too.' }, { v: c.tot, code: 'u2t-ot-all', hint: 'That’s all the hours. Overtime is only the hours over 8 in a day or over 44 in the week.' }],
      sol: br(otLines(s)), hints: ['Daily count: add up the hours over 8 on each day.', 'Weekly count: total − 44. Use the bigger of the two.'], text: '8/44 overtime hours' });
  }
  function otGross(w, tot, ot) { return (tot - ot) * w + ot * 1.5 * w; }
  function otGrossPart(r, s, o) {
    o = o || {};
    var c = s.c, w = s.w, G = otGross(w, c.tot, c.ot), sm = Math.min(c.daily, c.weekly);
    return amtPart(o.prompt || 'What is ' + s.p.his + ' gross pay for the week?', G, {
      diag: [{ v: c.tot * w, code: 'u2t-ot-none', hint: 'Pay the ' + t(nS(c.ot)) + ' overtime hours at time and a half: ' + t(Mt(w) + '\\times 1.5') + '.' }, { v: c.tot * w + c.ot * 1.5 * w, code: 'u2t-ot-reg-all', hint: 'Regular hours = total − overtime hours. Don’t pay the overtime hours twice.' },
        { v: otGross(w, c.tot, sm), code: 'u2t-ot-smaller', hint: 'Use the bigger overtime count: ' + t(nS(c.ot)) + ' h.' }, { v: c.tot * 1.5 * w, code: 'u2t-ot-all', hint: 'Only the overtime hours get time and a half.' },
        { v: (c.tot - c.ot) * w + c.ot * (w + 1.5), code: 'u2t-add15', hint: 'Time and a half is 1.5 <b>times</b> the wage, not ' + t('\\$1.50') + ' more.' }, { v: otGross(w, c.tot, q(c.daily + c.weekly)), code: 'u2t-ot-added', hint: 'Don’t add the daily and weekly counts: use the bigger one.' }],
      sol: br((o.withCount ? otLines(s) : ['Overtime ' + t(nS(c.ot)) + ' h, regular ' + t(nS(q(c.tot - c.ot))) + ' h (from the last part).']).concat(['Regular: ' + t(nS(q(c.tot - c.ot)) + '\\times ' + Mt(w) + toM((c.tot - c.ot) * w)), 'Overtime rate: ' + t(Mt(w) + '\\times 1.5' + toM(1.5 * w)) + '/h; overtime pay: ' + t(nS(c.ot) + '\\times ' + Mt(1.5 * w) + toM(c.ot * 1.5 * w)), 'Gross: ' + t(Mt((c.tot - c.ot) * w) + '+' + Mt(c.ot * 1.5 * w) + toM(G))])),
      hints: ['Regular hours = total − overtime hours.', 'Gross = regular hours × wage + overtime hours × 1.5 × wage.'], text: o.text || '8/44 gross pay' });
  }
  /* a contractor's effective hourly rate */
  var CONTRACT = [['stain a fence and deck', 'Stain and supplies'], ['paint the outside of a house', 'Paint and supplies'], ['build raised garden beds', 'Lumber and soil'], ['tile a bathroom', 'Tile and grout'], ['build a shed', 'Lumber and shingles']];
  function contractPart(r, o) {
    o = o || {};
    var c = r.pick(CONTRACT), p = person(r);
    var s = find(function () { var B = pickR(r, [1400, 4200, 50]), M = q(pickR(r, [240, 980, 5]) + r.pick([0, 0.5, 0.75, 0.25])), help = r.chance(0.75), hw = help ? pickR(r, [16, 21, 0.5]) : 0, hh = help ? r.int(8, 24) : 0, h = r.int(14, 40); return { B: B, M: M, help: help, hw: hw, hh: hh, h: h, E: B - M - hw * hh }; },
      function (s) { var rt = s.E / s.h; return rt > 25 && rt < 95; });
    var HP = s.hw * s.hh, rt = s.E / s.h;
    var diag = [{ v: (s.B - HP) / s.h, code: 'u2t-no-mat', hint: 'Take the materials (' + MM(s.M) + ') off the price too.' }, { v: s.B / s.h, code: 'u2t-no-costs', hint: 'The contract price is not all profit. Subtract all the costs before you divide by the hours.' }, { v: s.E, code: 'u2t-gave-profit', hint: 'That’s the profit. Divide it by the hours ' + p.he + ' works.' }];
    if (s.help) diag.push({ v: (s.B - s.M) / s.h, code: 'u2t-no-helper', hint: 'Take off the helper’s pay too: ' + t(s.hh + '\\times ' + Mt(s.hw)) + '.' }, { v: s.E / (s.h + s.hh), code: 'u2t-helper-hrs', hint: 'Divide by ' + p.his + ' own hours only: the helper was already paid for ' + p.his + ' hours.' });
    return amtPart(p.n + ' bids ' + MM(s.B) + ' to ' + c[0] + '. ' + c[1] + ' cost ' + p.him + ' ' + MM(s.M) + '. ' + (s.help ? cap(p.he) + ' pays a helper ' + MH(s.hw) + ' for ' + t(s.hh) + ' h, and ' + p.he + ' works ' : cap(p.he) + ' does all the work ' + p.him + 'self in ') + t(s.h) + ' h' + (s.help ? ' ' + p.him + 'self' : '') + '. What is ' + p.his + ' effective hourly rate?', rt, { after: '/h', diag: diag,
      sol: br([s.help ? 'Helper: ' + t(s.hh + '\\times ' + Mt(s.hw) + '=' + Mt(HP)) : '', 'Profit: ' + t(Mt(s.B) + '-' + Mt(s.M) + (s.help ? '-' + Mt(HP) : '') + '=' + Mt(s.E)), 'Per hour: ' + t(Mt(s.E) + '\\div ' + s.h + toM(rt))]),
      hints: ['Profit = contract price − materials − helper’s pay.', 'Effective hourly rate = profit ÷ the contractor’s own hours.'], text: o.text || 'contract hourly rate' });
  }
  /* salary + commission over a quota, or a graduated commission */
  function tierCommPart(r, o) {
    o = o || {};
    var p = person(r), kind = o.kind || r.pick(['quota', 'grad']);
    if (kind === 'quota') {
      var sal = pickR(r, [1500, 2500, 100]), pc = r.pick([2, 2.5, 3, 4, 5]), Qt = r.pick([15000, 20000, 25000]), S = Qt + pickR(r, [4000, 22000, 50]), C = (S - Qt) * pc / 100, G = sal + C;
      return amtPart(p.n + ' earns ' + MM(sal) + ' a month plus ' + t(pctT(pc)) + ' on sales <b>over a quota</b> of ' + MM(Qt) + '. This month ' + p.his + ' sales are ' + MM(S) + '. What does ' + p.he + ' earn this month?', G, {
        diag: [{ v: sal + S * pc / 100, code: 'u2t-quota', hint: 'The commission is only on the sales <b>over</b> the quota: ' + t(Mt(S) + '-' + Mt(Qt)) + '.' }, { v: C, code: 'u2t-no-base', hint: 'That’s the commission. Add the ' + MM(sal) + ' base pay.' },
          { v: S * pc / 100, code: 'u2t-quota-nobase', hint: 'Take the quota off the sales first, and add the base pay at the end.' }, { v: sal + (S - Qt) * pc, code: 'u2t-pct-whole', hint: 'Change ' + t(pctT(pc)) + ' to a decimal: ' + t(dec(pc)) + '.' }],
        sol: br(['Over the quota: ' + t(Mt(S) + '-' + Mt(Qt) + '=' + Mt(S - Qt)), 'Commission: ' + t(Mt(S - Qt) + '\\times ' + dec(pc) + toM(C)), 'Total: ' + t(Mt(sal) + '+' + Mt(C) + toM(G))]),
        hints: ['Commission is paid only on the sales above the quota.', 'Earnings = base pay + commission.'], text: o.text || 'salary + commission over a quota' });
    }
    var p1 = r.pick([2, 3, 4, 5]), p2 = p1 + r.pick([1, 2, 3]), L = r.pick([10000, 20000, 25000, 50000]), S2 = L + pickR(r, [L * 0.2, L * 1.6, 50]), a = L * p1 / 100, b = (S2 - L) * p2 / 100, T = a + b;
    return amtPart(p.n + ' earns a <b>graduated commission</b>: ' + t(pctT(p1)) + ' on the first ' + MM(L) + ' of sales and ' + t(pctT(p2)) + ' on the rest. This month ' + p.his + ' sales are ' + MM(S2) + '. What is ' + p.his + ' commission?', T, {
      diag: [{ v: S2 * p2 / 100, code: 'u2t-grad-all', hint: 'The higher rate is only for the sales <b>above</b> ' + MM(L) + '.' }, { v: a + S2 * p2 / 100, code: 'u2t-grad-nosub', hint: 'The ' + t(pctT(p2)) + ' is on the rest: ' + t(Mt(S2) + '-' + Mt(L)) + '.' },
        { v: S2 * p1 / 100, code: 'u2t-grad-low', hint: 'Only the first ' + MM(L) + ' is at ' + t(pctT(p1)) + '; the rest is at ' + t(pctT(p2)) + '.' }, { v: S2 * (p1 + p2) / 200, code: 'u2t-grad-low', hint: 'Work out each part on its own, then add.' }],
      sol: br(['First part: ' + t(Mt(L) + '\\times ' + dec(p1) + '=' + Mt(a)), 'Rest: ' + t(Mt(S2) + '-' + Mt(L) + '=' + Mt(S2 - L)) + '; ' + t(Mt(S2 - L) + '\\times ' + dec(p2) + toM(b)), 'Total: ' + t(Mt(a) + '+' + Mt(b) + toM(T))]),
      hints: ['Split the sales: the first part and the rest.', 'Find the commission on each part, then add.'], text: o.text || 'graduated commission' });
  }
  /* pooled tips shared by hours */
  function tipsPart(r, o) {
    o = o || {};
    var ns = people(r, 3), v = find(function () { return { hs: [r.int(8, 28), r.int(8, 28), r.int(8, 28)], per: q(r.int(10, 17) + r.pick([0, 0, 0.5, 0.25])) }; }, function (v) { return v.hs[0] !== v.hs[1] && v.hs[1] !== v.hs[2] && v.hs[0] !== v.hs[2]; });
    var hs = v.hs, per = v.per, H = hs[0] + hs[1] + hs[2], T = per * H, eq = T / 3;
    var specs = ns.map(function (pn, i) { return mfld(pn.n + ':', hs[i] * per, { name: pn.n, diag: [{ v: eq, code: 'u2t-tips-equal', hint: 'The tips are shared by <b>hours worked</b>, not equally.' }, { v: per, code: 'u2t-per-hour', hint: t(Mt(per)) + ' is the tips for one hour. ' + pn.n + ' worked ' + hs[i] + ' h.' }, { v: T / hs[i], code: 'u2t-tips-div', hint: 'Divide the tips by the <b>total</b> hours (' + H + ' h) to get the tips per hour.' }] }); });
    return fieldsPart((o.who || 'Three servers') + ', ' + ns[0].n + ', ' + ns[1].n + ' and ' + ns[2].n + ', pool their tips and share them by hours worked. The tips total ' + MM(T) + '. ' + ns[0].n + ' worked ' + t(hs[0]) + ' h, ' + ns[1].n + ' ' + t(hs[1]) + ' h and ' + ns[2].n + ' ' + t(hs[2]) + ' h. How much does each get?', specs,
      br(['Total hours: ' + t(hs.join('+') + '=' + H) + ' h', 'Per hour: ' + t(Mt(T) + '\\div ' + H + '=' + Mt(per))].concat(ns.map(function (pn, i) { return pn.n + ': ' + t(hs[i] + '\\times ' + Mt(per) + '=' + Mt(hs[i] * per)); })).concat(['Check: ' + t(hs.map(function (h) { return c2(h * per); }).join('+') + '=' + c2(T)) + ' ✓'])),
      ['Add the hours. Tips per hour = total tips ÷ total hours.', 'Each share = tips per hour × that person’s hours.'], o.text || 'pooled tips');
  }
  /* a pay stub: gross, CPP, EI, income tax (of gross), one after-tax deduction, total, net. The total and the net are
   * also right when they follow from the student's own boxes, and a deduction worked from the student's own gross pay
   * is right too (so one slip costs one box). */
  var FIXED = [['Health plan', 'a health plan'], ['Parking', 'parking'], ['Food bank donation', 'a food bank donation'], ['Safety boots', 'safety boots (paid off over a few cheques)'], ['Social club', 'the staff social club']];
  function stubWork(G, tx, fixed) { var c = r2(G * CPP / 100), e = r2(G * EI / 100), x = r2(G * tx / 100), tot = r2(c + e + x + fixed); return { G: G, c: c, e: e, x: x, tot: tot, net: r2(G - tot) }; }
  function stubPart(r, o) {
    o = o || {};
    var p = person(r), h = r.pick([32, 35, 36, 37.5, 38, 40, 30]), w = pickR(r, [16, 25, 0.1]), tx = r.int(12, 17), fx = r.pick(FIXED), fname = fx[0], fixed = pickR(r, [5, 25, 0.25]), G = r2(h * w), W = stubWork(G, tx, fixed);
    var labels = ['Gross pay', 'CPP', 'EI', 'Income tax', 'Total deductions', 'Net pay'], rates = [null, CPP, EI, tx];
    var chk = function (resp) {
      resp = resp || [];
      var vals = labels.map(function (l, i) { var a = readNum(resp[i]); return a.res ? null : a.v; });
      var gS = vals[0];
      var res = labels.map(function (l, i) {
        var a = readNum(resp[i]); if (a.res) return a.res;
        var v = a.v;
        if (i === 0) return amtChk(G, { diag: [{ v: h + w, code: 'u2t-stub-gross', hint: 'Gross pay = hours × rate.' }] })(resp[i]);
        if (i <= 3) {
          var right = [W.c, W.e, W.x][i - 1], rate = rates[i];
          if (gS != null && !near(gS, G, 0.004) && near(v, r2(gS * rate / 100), 0.004)) return ok();
          return amtChk(right, { diag: pctDiag(rate, G, { total: false, left: 'That’s what is left after the deduction. The deduction is ' + t(Mt(G) + '\\times ' + dec(rate)) + '.' }) })(resp[i]);
        }
        if (i === 4) {
          var own = vals[1] != null && vals[2] != null && vals[3] != null ? r2(vals[1] + vals[2] + vals[3] + fixed) : null;
          if (own != null && near(v, own, 0.004)) return ok();
          return amtChk(W.tot, { diag: [{ v: W.c + W.e + W.x, code: 'u2t-one-box', hint: 'Add the ' + fname.toLowerCase() + ' deduction (' + MM(fixed) + ') too: every deduction goes in the total.' }, { v: G + W.tot, code: 'u2t-ded-added', hint: 'The total deductions is the sum of the deductions only.' }] })(resp[i]);
        }
        var own2 = gS != null && vals[4] != null ? r2(gS - vals[4]) : null;
        if (own2 != null && near(v, own2, 0.004)) return ok();
        return amtChk(W.net, { diag: [{ v: G + W.tot, code: 'u2t-ded-added', hint: 'Net pay = gross pay <b>minus</b> the total deductions.' }, { v: G - W.x, code: 'u2t-one-box', hint: 'Take off <b>all</b> the deductions, not only the income tax.' }] })(resp[i]);
      });
      return combine(res, labels);
    };
    var key = [W.G, W.c, W.e, W.x, W.tot, W.net].map(function (x) { return x.toFixed(2); });
    var stub = table([], [['Hours', N(h)], ['Rate', '$' + w.toFixed(2) + '/h'], [fname, '$' + fixed.toFixed(2)]]);
    return { prompt: p.n + ' works ' + t(N(h)) + ' h at ' + MH(w) + '. Complete ' + p.his + ' pay stub. Use CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(tx + '\\%') + ' of gross pay. ' + cap(p.he) + ' also pays ' + MM(fixed) + ' for ' + fx[1] + '.' + stub,
      input: { type: 'fields', fields: labels.map(function (l, i) { return { label: l + (i >= 1 && i <= 3 ? ' (' + (i === 1 ? '5.95' : i === 2 ? '1.64' : tx) + '%)' : '') + ':', name: l, before: '$' }; }) },
      check: chk, key: key, answer: labels.map(function (l, i) { return l + ': ' + MM(Number(key[i])); }).join('<br>'),
      solution: br(['Gross: ' + t(N(h) + '\\times ' + Mt(w) + '=' + Mt(G)), 'CPP: ' + t(Mt(G) + '\\times 0.0595' + toM(G * 0.0595)), 'EI: ' + t(Mt(G) + '\\times 0.0164' + toM(G * 0.0164)), 'Income tax: ' + t(Mt(G) + '\\times ' + dec(tx) + toM(G * tx / 100)),
        'Total: ' + t(Mt(W.c) + '+' + Mt(W.e) + '+' + Mt(W.x) + '+' + Mt(fixed) + '=' + Mt(W.tot)), 'Net: ' + t(Mt(G) + '-' + Mt(W.tot) + '=' + Mt(W.net))]),
      hints: ['Gross = hours × rate. Each percent deduction = gross × rate (as a decimal), rounded to the cent.', 'Add <b>every</b> deduction for the total; net = gross − total.'], text: o.text || 'pay stub',
      bad: [[key[0], (W.c * 100).toFixed(2), key[2], key[3], key[4], key[5]], [key[0], key[1], key[2], key[3], r2(G + W.tot).toFixed(2), key[5]]] };
  }
  /* (A1) the wage from a stub with overtime: paid hours = regular + 1.5 × overtime */
  function otWagePart(r, o) {
    o = o || {};
    var p = person(r), reg = 40, k = r.pick([2, 3, 4, 4.5, 5, 6, 7.5, 8, 3.5]), w = pickR(r, [16, 27, 0.25]), ph = reg + 1.5 * k, G = w * ph;
    return amtPart(p.n + '’s pay stub shows ' + t(reg) + ' regular hours and ' + t(nS(k)) + ' overtime hours at time and a half. ' + cap(p.his) + ' gross pay is ' + MM(G) + '. What is ' + p.his + ' hourly wage?', w, { after: '/h',
      diag: [{ v: G / (reg + k), code: 'u2t-paid-hrs', hint: 'Each overtime hour is paid like 1.5 regular hours: paid hours = ' + t(reg + '+1.5\\times ' + nS(k)) + '.' }, { v: G / reg, code: 'u2t-no-ot', hint: 'The gross pay includes the overtime: count the paid hours, ' + t(reg + '+1.5\\times ' + nS(k)) + '.' },
        { v: G / (reg + 2 * k), code: 'u2t-paid-dbl', hint: 'Time and a half: each overtime hour counts as <b>1.5</b> paid hours, not 2.' }, { v: G / ph * 1.5, code: 'u2t-paid-hrs', hint: 'That’s the overtime rate. The question asks for the regular wage.' }],
      sol: br(['paid hours = ' + t(reg + '+1.5\\times ' + nS(k) + '=' + nS(ph)), 'wage = gross ÷ paid hours = ' + t(Mt(G) + '\\div ' + nS(ph) + '=' + Mt(w)), 'Check: ' + t(reg + '\\times ' + Mt(w) + '+' + nS(k) + '\\times ' + Mt(1.5 * w) + '=' + Mt(G)) + ' ✓']),
      hints: ['An overtime hour at time and a half is paid like 1.5 regular hours.', 'wage = gross pay ÷ paid hours.'], text: o.text || 'wage from overtime stub' });
  }
  /* (A1) sales needed with salary + commission */
  function salesSalPart(r, o) {
    o = o || {};
    var p = person(r), v = find(function () { return { S: pickR(r, [1200, 2400, 100]), pc: r.pick([3, 4, 5, 6, 8, 2.5, 7]), C: pickR(r, [600, 2600, 100]) }; }, function (v) { var x = v.C / (v.pc / 100); return near(x * 100, Math.round(x * 100), 1e-6); });
    var S = v.S, pc = v.pc, C = v.C, T = S + C, x = C / (pc / 100);
    return amtPart(p.n + ' earns a salary of ' + MM(S) + ' a month plus ' + t(pctT(pc)) + ' commission on ' + p.his + ' sales. How much must ' + p.he + ' sell to earn ' + MM(T) + ' this month?', x, {
      diag: [{ v: T / (pc / 100), code: 'u2t-no-salary', hint: 'The salary is paid anyway. Find the commission needed first: ' + t(Mt(T) + '-' + Mt(S)) + '.' }, { v: C / pc, code: 'u2t-div-pct', hint: 'Divide by the rate as a decimal: ' + t(pctT(pc) + '=' + dec(pc)) + '.' },
        { v: C * pc / 100, code: 'u2t-times', hint: 'sales = commission ÷ rate. Divide.' }, { v: (T + S) / (pc / 100), code: 'u2t-no-salary', hint: 'Take the salary <b>off</b> the target: the commission needed is ' + t(Mt(T) + '-' + Mt(S)) + '.' }],
      sol: br(['commission needed = ' + t(Mt(T) + '-' + Mt(S) + '=' + Mt(C)), 'sales = commission ÷ rate = ' + t(Mt(C) + '\\div ' + dec(pc) + '=' + Mt(x)), 'Check: ' + t(Mt(S) + '+' + dec(pc) + '\\times ' + Mt(x) + '=' + Mt(T)) + ' ✓']),
      hints: ['First: commission needed = target pay − salary.', 'Then sales = commission ÷ rate (as a decimal).'], text: o.text || 'sales needed, salary + commission' });
  }
  /* (A1) whole hours to take home an amount (take-home %), rounded up */
  function netHoursPart(r, o) {
    o = o || {};
    var p = person(r), it = r.pick(['a laptop', 'a used e-bike', 'a phone', 'a trip to Jasper', 'a gaming console', 'a drum kit']);
    var v = find(function () { return { w: pickR(r, [15.5, 19.5, 0.25]), k: r.int(76, 84), goal: pickR(r, [500, 1400, 25]) }; }, function (v) { var x = v.goal / (v.w * v.k / 100), f = x - Math.floor(x); return f > 0.08 && f < 0.92 && Math.ceil(v.goal / v.w) !== Math.ceil(x); });
    var w = v.w, k = v.k, goal = v.goal, n = w * k / 100, x = goal / n, up = Math.ceil(x);
    return upPart(p.n + ' earns ' + MH(w) + '. ' + cap(p.he) + ' takes home ' + t(k + '\\%') + ' of ' + p.his + ' gross pay. ' + cap(p.he) + ' wants to save ' + MM(goal) + ' of take-home pay for ' + it + '. How many whole hours must ' + p.he + ' work?', x, {
      short: function (dn) { return t(dn + '\\times\\$' + raw5(n) + toM(dn * n)); },
      diag: [{ v: Math.ceil(goal / w - 1e-9), code: 'u2t-gross', hint: 'Use the take-home pay per hour, not the wage: ' + t(Mt(w) + '\\times ' + dec(k)) + '.' }, { v: Math.ceil(goal / (w * (100 - k) / 100) - 1e-9), code: 'u2t-ded-rate', hint: p.n + ' <b>keeps</b> ' + t(k + '\\%') + ': net per hour = ' + t(Mt(w) + '\\times ' + dec(k)) + '.' }],
      sol: br(['Net per hour: ' + t(Mt(w) + '\\times ' + dec(k) + '=\\$' + raw5(n)), 'hours = ' + t(Mt(goal) + '\\div ' + nS(rd(n, 5)) + '=' + raw5(x)) + ', so ' + t(up) + ' h (round up)', 'Check: ' + t((up - 1) + '\\times ' + nS(rd(n, 5)) + toM((up - 1) * n)) + ' is not enough; ' + t(up + '\\times ' + nS(rd(n, 5)) + toM(up * n)) + ' is.']),
      hints: ['Take-home per hour = wage × take-home rate (as a decimal).', 'hours = amount needed ÷ take-home per hour. Round <b>up</b>.'], text: o.text || 'hours to take home an amount' });
  }
  /* (N2, Mastery) the boss who counted only the weekly overtime */
  function owedPart(r, o) {
    o = o || {};
    var p = person(r), v = find(function () { var d = r.int(3, 5), h = r.pick([9, 9.5, 10, 10.5, 11, 12]); return { d: d, h: h, w: pickR(r, [16, 24, 0.5]) }; }, function (v) { return v.d * v.h <= 44 && v.d * (v.h - 8) >= 3; });
    var d = v.d, h = v.h, w = v.w, tot = q(d * h), ot = q(d * (h - 8)), paid = tot * w, G = otGross(w, tot, ot), owed = G - paid, dl = DAYS.slice(0, d);
    return amtPart(p.n + ' works in Alberta for ' + MH(w) + '. One week ' + p.he + ' works ' + t(nS(h)) + ' h a day on ' + dl.slice(0, -1).join(', ') + ' and ' + dl[d - 1] + ', and no other days. ' + cap(p.his) + ' boss paid ' + p.him + ' ' + t(nS(tot) + '\\times ' + Mt(w) + '=' + Mt(paid)) + ', saying “' + nS(tot) + ' hours is not over 44, so there is no overtime.” How much more should ' + p.n + ' have been paid?', owed, {
      diag: [{ v: G, code: 'u2t-gave-total', hint: 'That’s what ' + p.he + ' should have been paid. Subtract what the boss paid.' }, { v: ot * 1.5 * w, code: 'u2t-owed-full', hint: 'The ' + t(nS(ot)) + ' overtime hours were already paid at ' + MH(w) + ' in the boss’s amount. Find the correct gross pay, then subtract.' },
        { v: ot * w, code: 'u2t-owed-reg', hint: 'Those hours were paid, but at the regular rate. Find the correct gross pay (regular + overtime at 1.5 × the wage), then subtract.' }, { v: 0, code: 'u2t-no-daily', hint: 'Alberta also counts hours over <b>8 in a day</b>: ' + t(nS(q(h - 8))) + ' h on each of ' + d + ' days.' }],
      sol: br(['Daily: ' + t(nS(q(h - 8))) + ' h over 8 on each of ' + d + ' days = ' + t(nS(ot)) + ' h. Weekly: ' + nS(tot) + ' h is not over 44, so 0 h. Use ' + t(nS(ot)) + ' h.', 'Regular: ' + t(nS(q(tot - ot)) + '\\times ' + Mt(w) + '=' + Mt((tot - ot) * w)) + '; overtime: ' + t(nS(ot) + '\\times ' + Mt(1.5 * w) + toM(ot * 1.5 * w)), 'Should have been paid: ' + t(Mt(G)) + '. Owed: ' + t(Mt(G) + '-' + Mt(paid) + toM(owed))]),
      hints: ['Check both overtime counts: over 8 in a day, and over 44 in the week.', 'Find the correct gross pay, then subtract what the boss paid.'], text: o.text || 'boss missed daily overtime' });
  }
  /* (N2, Mastery) piecework in two tiers, topped up to the minimum wage */
  var TIERS = [{ w: 'A courier is paid', it: 'package', pl: 'packages', L: 100, p1: [2.6, 3.4, 0.1], up: [0.3, 0.6, 0.1], n: [104, 140] }, { w: 'A berry picker is paid', it: 'flat', pl: 'flats', L: 40, p1: [3.5, 4.5, 0.25], up: [0.5, 1, 0.25], n: [42, 62] }];
  function topUpPart(r, o) {
    o = o || {};
    var c = r.pick(TIERS), s = find(function () { var p1 = pickR(r, c.p1), p2 = q(p1 + pickR(r, c.up)), n = r.int(c.n[0], c.n[1]), pay = c.L * p1 + (n - c.L) * p2; return { p1: p1, p2: p2, n: n, pay: pay, h: Math.ceil(pay / MINW) + r.int(2, 6) }; }, function (s) { return s.pay / s.h < MINW - 0.4; });
    var lo = c.L * s.p1, hi = (s.n - c.L) * s.p2, mw = MINW * s.h, top = mw - s.pay;
    return amtPart(c.w + ' ' + MM(s.p1) + ' for each of the first ' + c.L + ' ' + c.pl + ' in a week and ' + MM(s.p2) + ' for each ' + c.it + ' after that. This week ' + s.n + ' ' + c.pl + ' take ' + s.h + ' h. In Alberta, a worker paid by the piece must still earn at least the minimum wage, ' + MH(MINW) + ', for the hours worked. How much must the employer add to this week’s pay?', top, {
      diag: [{ v: mw - s.n * s.p1, code: 'u2t-tier-all', hint: 'Only the first ' + c.L + ' ' + c.pl + ' are at ' + MM(s.p1) + '; the other ' + (s.n - c.L) + ' are at ' + MM(s.p2) + '.' }, mw - s.n * s.p2 > 0 && { v: mw - s.n * s.p2, code: 'u2t-tier-all', hint: 'The higher rate is only for the ' + c.pl + ' after the first ' + c.L + '.' },
        { v: mw, code: 'u2t-topup-total', hint: 'That’s the minimum-wage pay. Subtract the piecework pay to find the top-up.' }, { v: s.pay, code: 'u2t-gave-pay', hint: 'That’s the piecework pay. Compare it with ' + t(s.h + '\\times ' + Mt(MINW)) + '.' },
        { v: MINW - s.pay / s.h, code: 'u2t-topup-perh', hint: 'That’s the shortfall for one hour. The question asks for the whole week.' }],
      sol: br(['First ' + c.L + ': ' + t(c.L + '\\times ' + Mt(s.p1) + '=' + Mt(lo)) + '; the rest: ' + t((s.n - c.L) + '\\times ' + Mt(s.p2) + toM(hi)), 'Piecework pay: ' + t(Mt(lo) + '+' + Mt(hi) + toM(s.pay)) + ' (about ' + MM(s.pay / s.h) + ' an hour, less than ' + MH(MINW) + ')', 'Minimum: ' + t(s.h + '\\times ' + Mt(MINW) + '=' + Mt(mw)), 'Top-up: ' + t(Mt(mw) + '-' + Mt(s.pay) + toM(top))]),
      hints: ['Find the piecework pay: the first ' + c.L + ' at one rate, the rest at the other.', 'Minimum pay = hours × ' + '$15.00. The employer adds the difference.'], text: o.text || 'piecework top-up to minimum wage' });
  }
  /* (N2, Mastery) net pay with overtime and before-tax deductions */
  function otNetPart(r, o) {
    o = o || {};
    var p = person(r), v = find(function () { return { w: pickR(r, [18, 28, 0.2]), k: r.pick([2, 3, 4, 5, 6, 2.5, 3.5]), u: r.pick([1, 1.5, 2, 1.25]), rrsp: r.pick([0, 25, 40, 50, 60]), tx: r.int(14, 20), trade: r.pick(['carpentry', 'electrical', 'plumbing', 'welding']) }; }, function () { return true; });
    var G = r2(40 * v.w + v.k * 1.5 * v.w), du = r2(G * v.u / 100), pre = r2(du + v.rrsp), TI = r2(G - pre), c = r2(G * CPP / 100), e = r2(G * EI / 100), x = r2(TI * v.tx / 100), tot = r2(pre + c + e + x), net = r2(G - tot);
    var G2 = r2((40 + v.k) * v.w), net2 = (function () { var d2 = r2(G2 * v.u / 100), T2 = r2(G2 - d2 - v.rrsp); return G2 - (d2 + v.rrsp + r2(G2 * CPP / 100) + r2(G2 * EI / 100) + r2(T2 * v.tx / 100)); })();
    var xg = r2(G * v.tx / 100), cT = r2(TI * CPP / 100), eT = r2(TI * EI / 100);
    return amtPart(p.n + ' is a first-year ' + v.trade + ' apprentice earning ' + MH(v.w) + '. This week ' + p.he + ' works ' + t(40) + ' regular hours and ' + t(nS(v.k)) + ' overtime hours at time and a half. ' + cap(p.his) + ' <b>before-tax</b> deductions are union dues of ' + t(pctT(v.u)) + ' of gross pay' + (v.rrsp ? ' and ' + MM(v.rrsp) + ' into an RRSP' : '') + '. ' + cap(p.his) + ' other deductions are CPP ' + t('5.95\\%') + ' and EI ' + t('1.64\\%') + ' of gross pay, and income tax ' + t(v.tx + '\\%') + ' of <b>taxable income</b>. What is ' + p.his + ' net pay?', net, {
      diag: [{ v: G - (pre + c + e + xg), code: 'u2t-tax-gross', hint: 'Income tax is on the <b>taxable income</b>: gross pay − before-tax deductions = ' + MM(TI) + '.' }, { v: G - (c + e + x), code: 'u2t-pretax-left', hint: 'Before-tax deductions are still deductions: count them in the total.' },
        { v: G - (pre + cT + eT + x), code: 'u2t-cpp-taxable', hint: 'CPP and EI are worked out on the <b>gross</b> pay.' }, { v: net2, code: 'u2t-ot-none', hint: 'Pay the overtime hours at ' + t(Mt(v.w) + '\\times 1.5') + '.' }, { v: tot, code: 'u2t-gave-ded', hint: 'That’s the total deductions. Net pay = gross − total deductions.' },
        { v: TI, code: 'u2t-gave-taxable', hint: 'That’s the taxable income. Now take off CPP, EI and the income tax too.' }, { v: TI - x, code: 'u2t-gave-taxable', hint: 'CPP and EI come off as well.' }],
      sol: br(['Gross: ' + t('40\\times ' + Mt(v.w) + '+' + nS(v.k) + '\\times ' + Mt(1.5 * v.w) + '=' + Mt(G)), 'Before-tax: dues ' + t(Mt(G) + '\\times ' + dec(v.u) + toM(G * v.u / 100)) + (v.rrsp ? ', RRSP ' + MM(v.rrsp) : '') + '; taxable income ' + t(Mt(G) + '-' + Mt(pre) + '=' + Mt(TI)),
        'CPP ' + t(Mt(G) + '\\times 0.0595' + toM(G * 0.0595)) + '; EI ' + t(Mt(G) + '\\times 0.0164' + toM(G * 0.0164)) + '; tax ' + t(Mt(TI) + '\\times ' + dec(v.tx) + toM(TI * v.tx / 100)),
        'Total: ' + t(Mt(du) + (v.rrsp ? '+' + Mt(v.rrsp) : '') + '+' + Mt(c) + '+' + Mt(e) + '+' + Mt(x) + '=' + Mt(tot)), 'Net: ' + t(Mt(G) + '-' + Mt(tot) + '=' + Mt(net))]),
      hints: ['Gross pay first (overtime at 1.5 × the wage). Taxable income = gross − before-tax deductions.', 'CPP and EI on the gross; tax on the taxable income. Add all the deductions, then subtract.'], text: o.text || 'net pay, overtime and before-tax deductions' });
  }
  /* (A1, Mastery) the sales where two pay plans pay the same */
  function breakEvenPart(r, o) {
    o = o || {};
    var p = person(r), kind = o.kind || r.pick(['salary', 'straight']);
    if (kind === 'salary') {
      var v = find(function () { return { S: pickR(r, [2000, 3200, 100]), b: pickR(r, [800, 1600, 100]), pc: r.pick([4, 5, 6, 8, 2.5, 3]) }; }, function (v) { var x = (v.S - v.b) / (v.pc / 100); return v.S - v.b >= 600 && near(x * 100, Math.round(x * 100), 1e-6); });
      var x = (v.S - v.b) / (v.pc / 100);
      return amtPart(p.n + ' is offered two sales jobs. <b>Job A:</b> ' + MM(v.S) + ' a month salary. <b>Job B:</b> ' + MM(v.b) + ' a month plus ' + t(pctT(v.pc)) + ' commission on all sales. At what monthly sales do the two jobs pay the same?', x, {
        diag: [{ v: v.S / (v.pc / 100), code: 'u2t-be-salary', hint: 'Job B already pays ' + MM(v.b) + ': its commission only has to make up ' + t(Mt(v.S) + '-' + Mt(v.b)) + '.' }, { v: (v.S - v.b) / v.pc, code: 'u2t-div-pct', hint: 'Divide by the rate as a decimal: ' + t(pctT(v.pc) + '=' + dec(v.pc)) + '.' },
          { v: v.b / (v.pc / 100), code: 'u2t-be-base', hint: 'The commission must make up the <b>difference</b> in base pay, ' + t(Mt(v.S) + '-' + Mt(v.b)) + '.' }, { v: (v.S - v.b) * v.pc / 100, code: 'u2t-times', hint: 'sales = commission ÷ rate. Divide.' }],
        sol: br(['Commission Job B needs: ' + t(Mt(v.S) + '-' + Mt(v.b) + '=' + Mt(v.S - v.b)), 'sales = commission ÷ rate = ' + t(Mt(v.S - v.b) + '\\div ' + dec(v.pc) + '=' + Mt(x)), 'Check: ' + t(Mt(v.b) + '+' + dec(v.pc) + '\\times ' + Mt(x) + '=' + Mt(v.S)) + ' ✓']),
        hints: ['How much more does Job A pay before any sales? That is what Job B’s commission must make up.', 'sales = commission needed ÷ rate.'], text: o.text || 'break-even: salary vs base + commission' });
    }
    var u = find(function () { var a = r.pick([4, 5, 6, 7, 8]), c = a - r.pick([1, 2, 3]); return { a: a, c: c, b: pickR(r, [800, 2000, 100]) }; }, function (u) { var x = u.b / ((u.a - u.c) / 100); return u.c >= 1 && near(x * 100, Math.round(x * 100), 1e-6) && x <= 200000; });
    var y = u.b / ((u.a - u.c) / 100);
    return amtPart('Two stores offer ' + p.n + ' a sales job. <b>Store A:</b> a straight ' + t(pctT(u.a)) + ' commission. <b>Store B:</b> ' + MM(u.b) + ' a month plus ' + t(pctT(u.c)) + ' commission. At what monthly sales do the two stores pay the same?', y, {
      diag: [{ v: u.b / (u.a / 100), code: 'u2t-be-one-rate', hint: 'Store A pays ' + t(pctT(u.a - u.c)) + ' <b>more</b> on every dollar of sales. That extra must make up Store B’s ' + MM(u.b) + '.' }, { v: u.b / (u.c / 100), code: 'u2t-be-one-rate', hint: 'Use the difference in the rates: ' + t(pctT(u.a) + '-' + pctT(u.c) + '=' + pctT(u.a - u.c)) + '.' },
        { v: u.b / (u.a - u.c), code: 'u2t-div-pct', hint: 'Divide by the rate as a decimal: ' + t(pctT(u.a - u.c) + '=' + dec(u.a - u.c)) + '.' }],
      sol: br(['Store A pays ' + t(pctT(u.a) + '-' + pctT(u.c) + '=' + pctT(u.a - u.c)) + ' more on every dollar of sales. That must make up Store B’s ' + MM(u.b) + ' base.', 'sales = ' + t(Mt(u.b) + '\\div ' + dec(u.a - u.c) + '=' + Mt(y)), 'Check: A: ' + t(dec(u.a) + '\\times ' + Mt(y) + '=' + Mt(y * u.a / 100)) + '; B: ' + t(Mt(u.b) + '+' + dec(u.c) + '\\times ' + Mt(y) + '=' + Mt(u.b + y * u.c / 100)) + ' ✓']),
      hints: ['How much more does Store A pay on each dollar of sales?', 'sales = Store B’s base ÷ the difference in rates (as a decimal).'], text: o.text || 'break-even: straight vs base + commission' });
  }
  /* (A1, Mastery) the hours to buy something with GST after CPP, EI and income tax */
  var BUY = [['a laptop', 699.99, 1299.99], ['a used e-bike', 900, 1600], ['a phone', 799.99, 1199.99], ['a snowboard and boots', 549.99, 899.99], ['a gaming PC', 1099.99, 1799.99], ['a set of mechanic’s tools', 499.99, 999.99]];
  function buyHoursPart(r, o) {
    o = o || {};
    var p = person(r), it = r.pick(BUY), v = find(function () {
      var P0 = it[1] % 1 ? q(r.int(Math.floor(it[1] / 50), Math.floor(it[2] / 50)) * 50 - 0.01) : pickR(r, [it[1], it[2], 50]), w = pickR(r, [15.5, 21.5, 0.25]), tx = r.int(12, 17);
      return { P0: P0, w: w, tx: tx, keep: q(100 - CPP - EI - tx) };
    }, function (v) { var cost = r2(v.P0 * 1.05), n = v.w * v.keep / 100, x = cost / n, f = x - Math.floor(x); return f > 0.06 && f < 0.94 && Math.ceil(v.P0 / n) !== Math.ceil(x); });
    var cost = r2(v.P0 * 1.05), n = v.w * v.keep / 100, x = cost / n, up = Math.ceil(x), xr = cost / r2(n);
    var diag = [{ v: Math.ceil(v.P0 / n - 1e-9), code: 'u2t-no-gst', hint: 'Add the ' + t('5\\%') + ' GST to the price first: ' + t(Mt(v.P0) + '\\times 1.05') + '.' }, { v: Math.ceil(cost / v.w - 1e-9), code: 'u2t-gross', hint: 'The money to spend is <b>net</b> pay: use the take-home pay for each hour.' },
      { v: Math.ceil(cost / (v.w * (100 - v.keep) / 100) - 1e-9), code: 'u2t-ded-rate', hint: 'Add the deduction rates, then take them away from 100%: ' + p.he + ' keeps ' + t(pctT(v.keep)) + '.' }];
    if (Math.ceil(xr - 1e-9) !== up) diag.push({ v: Math.ceil(xr - 1e-9), code: 'u2t-early-round', hint: 'Don’t round the net pay per hour to the cent before you divide: keep all the decimals.' });
    return upPart(p.n + ' earns ' + MH(v.w) + '. ' + cap(p.his) + ' deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(v.tx + '\\%') + ' of gross pay. ' + cap(p.he) + ' wants ' + it[0] + ' that costs ' + MM(v.P0) + ' in Calgary, plus ' + t('5\\%') + ' GST. How many whole hours must ' + p.he + ' work to pay for it?', x, { diag: diag,
      short: function (dn) { return t(dn + '\\times ' + Mt(v.w) + '\\times ' + nS(v.keep / 100) + toM(dn * n)) + ', less than ' + MM(cost); },
      sol: br(['Cost with GST: ' + t(Mt(v.P0) + '\\times 1.05' + toM(v.P0 * 1.05)), 'Deductions: ' + t('5.95\\%+1.64\\%+' + v.tx + '\\%=' + pctT(q(CPP + EI + v.tx))) + '; ' + p.he + ' keeps ' + t(pctT(v.keep)), 'Net per hour: ' + t(Mt(v.w) + '\\times ' + nS(v.keep / 100) + '=\\$' + raw5(n)), 'hours = ' + t(Mt(cost) + '\\div ' + nS(rd(n, 5)) + '=' + raw5(x)) + ', so ' + t(up) + ' h (round up)',
        'Check: ' + t(up + '\\text{ h}') + ' gives ' + t(Mt(up * n)) + ' ✓; ' + t((up - 1) + '\\text{ h}') + ' gives only ' + t(Mt((up - 1) * n)) + '.']),
      hints: ['Cost with GST = price × 1.05. Part kept = 100% − all the deduction rates.', 'hours = cost ÷ net pay per hour. Round <b>up</b>.'], text: o.text || 'hours to buy with GST after deductions' });
  }
  Object.assign(A, { WORK: WORK, PERIODS: PERIODS, grossHMPart: grossHMPart, periodPart: periodPart, otRatePart: otRatePart, piecePart: piecePart, commPart: commPart, extraPart: extraPart, dedPart: dedPart,
    hoursPart: hoursPart, ratePart: ratePart, salesPart: salesPart, sheetShifts: sheetShifts, sheetTable: sheetTable, sheetLines: sheetLines, sheetPart: sheetPart, salShared: salShared, salStem: salStem,
    salHourPart: salHourPart, salWhichPart: salWhichPart, otCount: otCount, otShared: otShared, otTable: otTable, otStem: otStem, otLines: otLines, otHoursPart: otHoursPart, otGross: otGross, otGrossPart: otGrossPart,
    contractPart: contractPart, tierCommPart: tierCommPart, tipsPart: tipsPart, stubWork: stubWork, stubPart: stubPart, otWagePart: otWagePart, salesSalPart: salesSalPart, netHoursPart: netHoursPart,
    owedPart: owedPart, topUpPart: topUpPart, otNetPart: otNetPart, breakEvenPart: breakEvenPart, buyHoursPart: buyHoursPart });

  /* ======================= the questions (already in Beginning → Progressing → Mastery order, so paper numbers = test numbers) ======================= */
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function QS(num, outcome, level, shared, stem, makes, text) { return { num: String(num), outcome: outcome, text: text, shared: shared, stem: stem, parts: makes.map(function (mk, i) { return { id: num + String.fromCharCode(97 + i), outcome: outcome, level: level, make: mk }; }) }; }
  var QUESTIONS = [
    /* ---------- Beginning ---------- */
    Q(1, 'N2', 'BEG', grossHMPart, 'Gross pay for hours and minutes'),
    Q(2, 'N2', 'BEG', periodPart, 'Salary: the pay for one pay period'),
    Q(3, 'N2', 'BEG', otRatePart, 'Time-and-a-half or double-time rate'),
    Q(4, 'N2', 'BEG', piecePart, 'Piecework pay'),
    Q(5, 'N2', 'BEG', commPart, 'Straight commission'),
    Q(6, 'N2', 'BEG', extraPart, 'A tip or a percent bonus'),
    Q(7, 'N2', 'BEG', dedPart, 'One deduction: CPP, EI or income tax'),
    Q(8, 'A1', 'BEG', hoursPart, 'Working backwards: hours = pay ÷ rate'),
    Q(9, 'A1', 'BEG', ratePart, 'Working backwards: rate = pay ÷ hours'),
    Q(10, 'A1', 'BEG', salesPart, 'Working backwards: sales = commission ÷ rate'),
    /* ---------- Progressing ---------- */
    Q(11, 'N2', 'PRG', sheetPart, 'Timesheet with unpaid breaks: gross pay'),
    QS(12, 'N2', 'PRG', salShared, salStem, [salHourPart, salWhichPart], 'Hourly equivalent of a salary; which job pays more in a year'),
    QS(13, 'N2', 'PRG', otShared, otStem, [otHoursPart, otGrossPart], 'Alberta 8/44 overtime: hours, then gross pay'),
    Q(14, 'N2', 'PRG', contractPart, 'Contract: effective hourly rate'),
    Q(15, 'N2', 'PRG', tierCommPart, 'Commission over a quota, or graduated'),
    Q(16, 'N2', 'PRG', tipsPart, 'Pooled tips shared by hours'),
    Q(17, 'N2', 'PRG', stubPart, 'Pay stub: deductions and net pay'),
    Q(18, 'A1', 'PRG', otWagePart, 'Working backwards: the wage from a stub with overtime'),
    Q(19, 'A1', 'PRG', salesSalPart, 'Working backwards: sales needed with salary + commission'),
    Q(20, 'A1', 'PRG', netHoursPart, 'Working backwards: whole hours to take home an amount'),
    /* ---------- Mastery: skills combined ---------- */
    Q(21, 'N2', 'MAS', owedPart, 'The boss missed the daily overtime: how much is owed'),
    Q(22, 'N2', 'MAS', topUpPart, 'Piecework in two tiers, topped up to minimum wage'),
    Q(23, 'N2', 'MAS', otNetPart, 'Net pay with overtime and before-tax deductions'),
    Q(24, 'A1', 'MAS', breakEvenPart, 'Working backwards: where two pay plans pay the same'),
    Q(25, 'A1', 'MAS', buyHoursPart, 'Working backwards: hours to buy with GST after deductions')
  ];

  HW.defineTest({
    id: 'u2test', unit: 2, title: 'Unit 2 Test', outcome: 'N2', calc: true,
    blurb: 'The Unit 2 outcomes-based test (N2, A1): wages, salaries and pay periods, overtime and the Alberta 8/44 rule, piecework and contracts, commission, tips and bonuses, pay stubs and net pay, and working backwards with the pay formulas, in Beginning, Progressing and Mastery boxes.',
    // Short version (~50%): Beginning keeps gross pay for h and min, a salary's pay period, a commission, one deduction (N2),
    // hours = pay ÷ rate and sales = commission ÷ rate (A1); Progressing keeps the 8/44 week (both parts), the contract and
    // the pay stub (N2), the sales needed with salary + commission and the whole hours to take home an amount (A1); Mastery
    // keeps the boss's missed overtime (N2) and the hours to buy with GST after deductions (A1).
    short: ['1', '2', '5', '7', '8', '10', '13', '14', '17', '19', '20', '21', '25'],
    questions: QUESTIONS
  });
})(window);
