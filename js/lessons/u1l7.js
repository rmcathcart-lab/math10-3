/* Math 10-3 · Unit 1 · Lesson 7 — Percents Refresher: Percents, Decimals and Percent of an Amount (REV: refresher)
 * Assignment 7 (u1_l07.tex, Questions 1–18) and the Lesson 7 Extra Practice (u1_ep07.tex, Questions 1–15).
 * Every part is a generator: the same kind of percent, decimal or fraction as the booklet item (a one-digit percent, a
 * percent with a decimal, more than 100%, less than 1%, a repeating fraction…), new numbers around the booklet's (the
 * booklet's own numbers are among the possible values; the lesson's worked-example numbers are left out). Calculator
 * allowed (the benchmark questions say "without a calculator" as the booklet does).
 * Answers: percents are typed with or without the % sign; money to the cent ("$12.49", "12.49" and "12.490" are all
 * right; 12.4 or 12.488 for 12.49 gets a nudge that doesn't use a try; rounding the wrong way is wrong, with a hint);
 * fractions in simplest form (improper or mixed). Recognised mistakes get their own hint: percent not divided by 100,
 * the decimal point moved 1 or 3 places, a one-digit percent written as 0.7, the decimal given instead of the percent,
 * dividing the wrong way (whole ÷ part), "of" done as a division, the tip given instead of the total, and so on.
 * Conversions: the 10 × 10 grids are drawn; "shade 8% of the grid" → "how many squares would you shade?"; the fill-in
 * tables (percent/decimal/fraction, benchmark percents of an amount) use the table input (draw2.js areabox) with the
 * given cells shown and the blanks as boxes, split into two shorter tables each; "estimate in your head, show your
 * thinking" and "explain" → multiple choice whose options are lines of reasoning (one right).
 *
 * Shared kit for later lessons: HW.pctKit (money / percent / decimal / fraction checkers with the rounding nudges, the
 * "percent of an amount" builder, money formatting, a 10 × 10 grid picture). Lesson 1.8 (u1l8.js) uses it, so this
 * file must be loaded BEFORE u1l8.js (and before any later lesson that uses HW.pctKit).
 * Outcome REV (refresher: never counts toward a level). Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, D = HW.draw;

  /* ================= the money / percent kit (HW.pctKit) ================= */
  var PK = HW.pctKit = HW.pctKit || {};
  function rnd(x, dp) { return K.roundTo(x, dp); }
  function r2(x) { return rnd(x, 2); }
  function dS(x) { return String(parseFloat(Number(x).toFixed(10))); }               // 0.035 → "0.035" (no binary noise)
  function m$(x) { return r2(x).toFixed(2); }                                        // 12.488 → "12.49"
  function M(x) { return '\\$' + m$(x); }                                            // LaTeX money
  function pT(p) { return dS(p) + '\\%'; }                                           // LaTeX percent
  function near(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function red(p, q) { var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function fT(f) { return f[1] === 1 ? String(f[0]) : '\\frac{' + f[0] + '}{' + f[1] + '}'; }
  function mixT(f) { return f[0] > f[1] && f[1] !== 1 ? Math.floor(f[0] / f[1]) + '\\frac{' + (f[0] % f[1]) + '}{' + f[1] + '}' : fT(f); }
  /* p % of A, worked exactly (p may have one or two decimals, A may have cents) */
  function pctOf(p, A) { return Math.round(p * 100) * Math.round(A * 100) / 1e6; }
  function placeName(dp) { return dp === 0 ? 'whole number' : dp === 1 ? 'tenth' : dp === 2 ? 'hundredth' : 'thousandth'; }
  PK.r2 = r2; PK.rnd = rnd; PK.dS = dS; PK.m$ = m$; PK.M = M; PK.pT = pT; PK.near = near; PK.gcd = gcd; PK.red = red; PK.fT = fT; PK.pctOf = pctOf;

  /* read a typed number: strips $, %, \text{…}, a trailing unit word; notes what was there */
  function readV(resp) {
    var s = String(resp == null ? '' : resp);
    var pct = /\\%|%|percent/i.test(s), dol = /\\\$|\$|dollar/i.test(s);
    s = s.replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, ' $2 ').replace(/\\\$|\$|\\%|%/g, ' ').replace(/\\[,;: !]|~|\\quad/g, ' ').replace(/\b(dollars?|percent)\b/gi, ' ').trim();
    var unit = false, um = /^(.*?\d)\s*([a-zA-Z]{1,6}\.?(\s*[a-zA-Z]{1,6})?)\s*$/.exec(s);
    if (um && !/\\/.test(um[2])) { unit = true; s = um[1]; }
    var compact = s.replace(/\s+/g, '');
    if (!compact) return { code: 'empty' };
    if (/^-?\d*,\d{1,2}$/.test(compact)) return { code: 'comma' };
    var p = HW.parse.number(s);
    if (!p.ok) return { code: p.code, raw: s };
    var plain = HW.parse.plain(s).replace(/\s|,/g, ''), dec = (plain.split('.')[1] || '').replace(/\D/g, '').length;
    return { ok: true, v: p.value, dec: dec, pct: pct, dol: dol, unit: unit, raw: plain };
  }
  PK.readV = readV;
  var NOTE = { empty: 'Type your answer first.', comma: 'Use a decimal point (.), not a comma.', notnumber: 'Enter a single number.' };
  /* a typed fraction (for the fraction-or-decimal reminder) */
  function readFrac(resp) {
    var s = String(resp == null ? '' : resp).trim(), m = /^\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
    if (m) s = m[1] + '\\frac{' + m[2] + '}{' + m[3] + '}';
    var a = ex.parse(s); if (!a.ok) return null;
    var mv = ex.mixedValue(a.ast);
    if (mv != null) { var mm = /^(\d+)\\frac\{?(\d)\}?\{?(\d+)\}?$|^(\d+)\\frac\{(\d+)\}\{(\d+)\}$/.exec(s.replace(/\s/g, '').replace(/\\[dt]frac/g, '\\frac')); var w, n, d; if (mm) { w = +(mm[1] || mm[4]); n = +(mm[2] || mm[5]); d = +(mm[3] || mm[6]); } return { v: mv, mixed: true, w: w, n: n, d: d }; }
    var pf = ex.plainFraction(a.ast), sh = ex.shape(a.ast);
    return { v: ex.value(a.ast), pf: pf, decimals: sh.decimals, bare: sh.bare };
  }
  PK.readFrac = readFrac;

  /* one number. o: { kind: 'money' | 'pct' | 'dec' | 'num', dp (rounding place; money defaults to 2; null = exact),
   *   diag(v) -> {code, hint} | null, nr (numerical response: 4 characters), what (e.g. 'the tip') } */
  function numChk(exact, o) {
    o = o || {}; var kind = o.kind || 'num', dp = o.dp != null ? o.dp : kind === 'money' ? 2 : null;
    var want = dp == null ? exact : rnd(exact, dp), exactIsWant = near(exact, want), step = dp == null ? 0 : Math.pow(10, -dp);
    var place = kind === 'money' ? 'cent' : dp != null ? placeName(dp) : '';
    return function (resp) {
      var a = readV(resp);
      if (!a.ok) {
        if (a.code === 'notnumber' && kind !== 'money') { var fr = readFrac(resp); if (fr && near(fr.v, kind === 'pct' ? exact / 100 : exact)) return form('pct-as-fraction', kind === 'pct' ? 'That’s the fraction. Change it to a percent: divide the top by the bottom, then multiply by ' + t('100') + '.' : 'Right value — now write it as a <b>decimal</b> (divide the top by the bottom).'); }
        return form(a.code === 'empty' ? 'empty' : a.code === 'comma' ? 'pct-comma' : 'notnumber', NOTE[a.code] || NOTE.notnumber);
      }
      var v = a.v;
      if (o.nr && a.raw.replace(/^-/, '').length > 4) {
        if (dp != null && near(rnd(v, dp), want)) return form('round', 'Right — now round to the nearest ' + place + '. (Numerical response: up to 4 characters.)');
        return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      }
      if (near(v, want) || (dp != null && a.dec <= dp && near(v, exact))) {
        if (a.unit) return form('units', 'Leave the unit out — just type the number.');
        if (kind === 'dec' && a.pct) return form('pct-dec-sign', 'Right digits — but a decimal has no % sign. Leave the % out.');
        if (kind === 'money' && a.pct) return form('pct-money-sign', 'This answer is an amount of money, not a percent. Leave the % sign out.');
        return ok();
      }
      if (dp != null && a.dec > dp && near(rnd(v, dp), want)) return form('round', kind === 'money' ? 'Right — now round to the nearest cent (2 decimal places).' : 'Right — now round to the nearest ' + place + '.');
      if (dp != null && !exactIsWant && a.dec < dp && Math.abs(v - want) < 2 * Math.pow(10, -a.dec) && (near(v, rnd(exact, a.dec)) || near(v, Math.floor(exact * Math.pow(10, a.dec) + 1e-9) / Math.pow(10, a.dec))))
        return form('places', kind === 'money' ? 'Give money to the cent: 2 decimal places, like ' + t('\\$12.49') + '.' : 'Round to the nearest ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      if (dp != null && !exactIsWant && a.dec === dp && (near(v, want - step) || near(v, want + step)) && Math.abs(v - exact) < step)
        return wrong('pct-round-dir', 'Check the rounding. Look at the digit just after the ' + (kind === 'money' ? 'cents' : place + 's') + ' place: 5 or more rounds up, 4 or less leaves it as it is.');
      var h = o.diag ? o.diag(v, a) : null;
      if (h) return wrong(h.code || 'diag', h.hint);
      if (kind === 'pct' && exact !== 0 && (near(v, exact / 100) || (dp != null && near(v, rnd(exact / 100, dp + 2))))) return wrong('pct-not-x100', 'That’s the decimal. Multiply by ' + t('100') + ' (move the decimal point 2 places right) to write it as a percent.');
      if (kind === 'dec' && exact !== 0 && near(v, exact * 100)) return wrong('pct-not-div100', 'That’s still the percent. Divide by ' + t('100') + ' (move the decimal point 2 places left) to write it as a decimal.');
      if (kind === 'money' && exact !== 0 && near(v, r2(exact) * 100)) return wrong('pct-cents', 'That looks like the answer in cents. Give it in dollars (divide by 100).');
      return wrong('value', null);
    };
  }
  PK.numChk = numChk;
  PK.money = function (exact, diag, o) { o = Object.assign({}, o || {}); o.kind = 'money'; o.diag = diag; return numChk(exact, o); };
  PK.pct = function (exact, dp, diag, o) { o = Object.assign({}, o || {}); o.kind = 'pct'; o.dp = dp; o.diag = diag; return numChk(exact, o); };
  PK.dec = function (exact, dp, diag, o) { o = Object.assign({}, o || {}); o.kind = 'dec'; o.dp = dp; o.diag = diag; return numChk(exact, o); };
  PK.num = function (exact, dp, diag, o) { o = Object.assign({}, o || {}); o.kind = 'num'; o.dp = dp; o.diag = diag; return numChk(exact, o); };

  /* a fraction in simplest form (improper or mixed). fr = [p, q] in lowest terms */
  PK.frac = function (fr, diag) {
    var T = fr[0] / fr[1];
    return function (resp) {
      var raw = String(resp == null ? '' : resp).trim();
      if (!raw) return form('empty', 'Type your answer first.');
      var a = readFrac(raw);
      if (!a || !isFinite(a.v)) return form('notnumber', 'Write a fraction like ' + t('\\frac{3}{4}') + ' (use the fraction key, or type 3/4).');
      if (near(a.v, T)) {
        if (a.mixed) { if (a.n != null && a.n >= a.d) return form('pct-mixed-improper', 'In a mixed number the fraction part must be less than 1.'); if (a.n != null && gcd(a.n, a.d) > 1) return form('lowest', 'Right value — now write the fraction part in simplest form (divide its top and bottom by ' + t(gcd(a.n, a.d)) + ').'); return ok(); }
        if (a.pf) { if (gcd(a.pf[0], a.pf[1]) > 1) return form('lowest', 'Right value — now write it in simplest form: divide the top and bottom by ' + t(gcd(a.pf[0], a.pf[1])) + '.'); return ok(); }
        if (a.decimals) return form('decimal', 'Right value — now write it as a <b>fraction</b>.');
        if (fr[1] === 1 && a.bare) return ok();
        return form('simplify', 'Write it as a single fraction.');
      }
      var h = diag ? diag(a.v, a) : null;
      if (h) return wrong(h.code || 'diag', h.hint);
      if (near(a.v, 1 / T)) return wrong('flip', 'Your fraction is upside down — check which number goes on top.');
      return wrong('value', null);
    };
  };

  /* typical "percent of an amount" mistakes: [value, code, hint] */
  PK.ofMistakes = function (p, A, o) {
    o = o || {}; var d = dS(p / 100), out = [], seen = [pctOf(p, A)];
    function add(v, code, hint) { if (!isFinite(v)) return; for (var i = 0; i < seen.length; i++) if (Math.abs(v - seen[i]) < 0.006) return; seen.push(v); out.push([v, code, hint]); }
    add(p * A, 'pct-no-div', 'Change the percent to a decimal first: ' + t(pT(p) + '=' + d) + '. Then multiply.');
    add(p / 10 * A, 'pct-one-place', t(pT(p)) + ' as a decimal is ' + t(d) + ' — move the decimal point <b>2</b> places left, not 1.');
    add(p / 1000 * A, 'pct-three-places', t(pT(p)) + ' as a decimal is ' + t(d) + ' — move the decimal point 2 places left, not 3.');
    add(A / p, 'pct-div', '“Of” means <b>multiply</b>: ' + t(d + '\\times ' + (o.Atex || dS(A))) + '.');
    if (p !== 100) add(A / (p / 100), 'pct-div', '“Of” means <b>multiply</b> by the decimal, not divide: ' + t(d + '\\times ' + (o.Atex || dS(A))) + '.');
    if (o.addOn) add(A + pctOf(p, A), 'pct-added', 'That’s the amount <b>plus</b> ' + t(pT(p)) + '. The question asks for ' + t(pT(p)) + ' of it only.');
    return out;
  };
  PK.diagFrom = function (list, money) {
    return function (v) { for (var i = 0; i < list.length; i++) { var x = list[i][0]; if (near(v, x) || (money && near(v, r2(x))) || near(v, rnd(x, 2))) return { code: list[i][1], hint: list[i][2] }; } return null; };
  };
  /* an estimate line for p % of A (the booklet's "estimate first") */
  PK.estimate = function (p, A, money) {
    var at = money ? M(A) : dS(A), ten = money && A >= 10 ? Math.round(A) / 10 : A / 10, tt = money ? M(ten) : dS(rnd(ten, 2)), about = money && !near(ten, A / 10);
    if (p >= 100) return 'Estimate: ' + t(pT(p)) + ' is more than ' + t('100\\%') + ', so the answer is more than ' + t(at) + '.';
    if (p < 1) return 'Estimate: ' + t('1\\%') + ' of ' + t(at) + ' is ' + t(money ? M(A / 100) : dS(A / 100)) + ', and ' + t(pT(p)) + ' is less than ' + t('1\\%') + ', so the answer is less than that.';
    if (p === 50) return 'Estimate: ' + t('50\\%') + ' is half.';
    if (p < 10) return 'Estimate: ' + t('10\\%') + ' of ' + t(at) + ' is ' + (about ? 'about ' : '') + t(tt) + ', so ' + t(pT(p)) + ' is less than that.';
    var fm = function (x) { return money ? M(x) : dS(rnd(x, 2)); }, k = Math.floor(p / 10), lead = 'Estimate: ' + t('10\\%') + ' of ' + t(at) + ' is ' + (about ? 'about ' : '') + t(tt) + ', so ';
    if (p % 10 === 0) return lead + t(pT(p)) + ' is ' + (about ? 'about ' : '') + t(k + '\\times ' + tt + '=' + fm(k * ten)) + '.';
    if (p % 5 === 0) return lead + t(pT(p)) + ' is ' + (k > 1 ? t(k + '\\times ' + tt) : t(tt)) + ' plus half of ' + t(tt) + ': about ' + t(fm(k * ten + ten / 2)) + '.';
    var q = Math.round(p / 10);
    return lead + t(pT(p)) + ' is a bit ' + (q * 10 > p ? 'less' : 'more') + ' than ' + t(q * 10 + '\\%') + ' ' + t('=' + (q > 1 ? q + '\\times ' + tt + '=' : '') + fm(q * ten)) + '.';
  };
  /* a "p % of A" part. o: { money (answer to the cent), prompt, before, after, nr, addOn, extraDiag } */
  PK.ofPart = function (p, A, o) {
    o = o || {}; var money = !!o.money, exact = pctOf(p, A), d = dS(p / 100), at = money ? M(A) : dS(A), ans = money ? r2(exact) : exact;
    var ms = PK.ofMistakes(p, A, { Atex: at, addOn: o.addOn }), dg0 = PK.diagFrom(ms, money);
    var dg = function (v) { return (o.extraDiag && o.extraDiag(v)) || dg0(v); };
    var chk = money ? PK.money(exact, dg, { nr: o.nr }) : PK.num(exact, null, dg, { nr: o.nr });
    var resT = money ? (near(exact, ans) ? M(exact) : '\\$' + dS(exact) + '\\approx ' + M(exact)) : dS(exact);
    var sol = (o.noEstimate ? '' : PK.estimate(p, A, money) + '<br>') + t(pT(p) + '=' + d) + '<br>' + t(d + '\\times ' + at + '=' + resT) + (o.solEnd || '');
    var p2 = { prompt: o.prompt || t(pT(p) + '\\text{ of }' + at), input: { type: 'number', before: money && !o.nr ? '$' : o.before, after: o.after, nr: !!o.nr }, check: chk,
      key: money ? m$(exact) : dS(exact), answer: t(money ? M(exact) : dS(exact)), solution: sol,
      hints: o.hints || ['Change ' + t(pT(p)) + ' to a decimal (move the decimal point 2 places left).', '“Of” means multiply: (the decimal) ' + t('\\times') + ' ' + t(at) + '.'], text: o.text || p + '% of ' + A };
    p2.bad = ms.map(function (m) { return money ? m$(m[0]) : dS(rnd(m[0], 6)); }).filter(function (s) { return !near(Number(s), ans); });
    return p2;
  };
  /* a 10 × 10 grid with n squares shaded (row by row from the top, as in the booklet) */
  PK.grid = function (n, label) {
    var s = 12, W0 = 10 * s, h = '<svg class="u1l7-grid" width="' + (W0 + 3) + '" height="' + (W0 + 3) + '" viewBox="-1.5 -1.5 ' + (W0 + 3) + ' ' + (W0 + 3) + '" role="img" aria-label="' + (label || 'A 10 by 10 grid') + '">';
    for (var i = 0; i < 100; i++) h += '<rect x="' + (i % 10) * s + '" y="' + Math.floor(i / 10) * s + '" width="' + s + '" height="' + s + '" fill="' + (i < n ? '#9db4d6' : '#ffffff') + '" stroke="#9aa3ad" stroke-width="0.8"/>';
    return h + '<rect x="0" y="0" width="' + W0 + '" height="' + W0 + '" fill="none" stroke="#2b3340" stroke-width="1.6"/></svg>';
  };
  /* a fill-in table (the draw2.js areabox input): rows = row labels (LaTeX, null = a box), cols = column labels,
   * cells[i][j] = LaTeX given or null (a box). check(resp) gets { rows, cols, cells }. */
  PK.tablePart = function (prompt, I, check, key, sol, hints, text) {
    var inp = { type: 'areabox', rows: I.rows, cols: I.cols, cells: I.cells, corner: I.corner || '', keys: I.keys || 'fraction', help: I.help || 'Tap a box, then type. Fill in every empty box.' };
    return { prompt: prompt, input: inp, check: check, key: key, answer: D.areaboxHtml(inp, key), solution: sol, hints: hints || [], text: text, tries: I.tries };
  };
  /* check a table: blanks = [{ where: 'row'|'col'|'cell', i, j, name, chk }] */
  PK.tableChk = function (blanks) {
    return function (resp) {
      resp = resp || {}; var R = resp.rows || [], C = resp.cols || [], Mx = resp.cells || [];
      var get = function (b) { var v = b.where === 'row' ? R[b.i] : b.where === 'col' ? C[b.j] : (Mx[b.i] || [])[b.j]; return String(v == null ? '' : v).trim(); };
      var empty = blanks.filter(function (b) { return !get(b).replace(/\\placeholder\{\}|\s/g, ''); }).length;
      if (empty) return form('empty', empty === blanks.length ? 'Fill in the table first.' : 'Fill in every empty box (' + empty + ' still empty).');
      var firstForm = null, nWrong = 0, firstWrong = null;
      blanks.forEach(function (b) {
        var r = b.chk(get(b)); if (r.v === 'correct') return;
        var out = { v: r.v, code: r.code, hint: '<b>' + b.name + ':</b> ' + (r.hint || 'Check this box again.') };
        if (r.v === 'form') { if (!firstForm) firstForm = out; } else { nWrong++; if (!firstWrong) firstWrong = out; }
      });
      if (firstWrong) { if (nWrong > 1) firstWrong.hint += ' <span class="muted">(' + nWrong + ' boxes need another look.)</span>'; return firstWrong; }
      return firstForm || ok();
    };
  };
  /* a small keypad for money and percent boxes in tables */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS['pctkit-money']) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS['pctkit-money'] = [[dk(7), dk(8), dk(9), { label: '⌫', fn: 'del', title: 'Delete' }], [dk(4), dk(5), dk(6), { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }], [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP['pctkit-money'] = ['Tap a box, then type the amount, e.g. 7.50 (no $ needed).', 'Type the amount, e.g. 7.50 (no $ needed).'];
  }
  PK.part = function (prompt, chk, key, answerTex, sol, hints, text, inp) {
    return { prompt: prompt, input: Object.assign({ type: 'number' }, inp || {}), check: chk, key: key, answer: t(answerTex), solution: sol, hints: hints || [], text: text };
  };
  PK.moneyPart = function (prompt, exact, diag, sol, hints, text, inp) {
    var p = PK.part(prompt, PK.money(exact, diag), m$(exact), M(exact), sol, hints, text, Object.assign({ before: '$' }, inp || {}));
    return p;
  };
  PK.fields = function (prompt, fields, checkers, keys, answer, sol, hints, text) {
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: K.fields(checkers, { labels: fields.map(function (f) { return f.name || f.label; }) }), key: keys, answer: answer, solution: sol, hints: hints || [], text: text };
  };
  PK.find = function (gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; };
  PK.money$ = function (x) { return '$' + m$(x); };
  /* how much a money result needs rounding: "= $4.17" or "= $2.7495 ≈ $2.75" */
  PK.eqM = function (x) { return near(x, r2(x)) ? '=' + M(x) : '=\\$' + dS(rnd(x, 6)) + '\\approx ' + M(x); };

  HW.addCodes({
    'pct-comma': 'Decimal comma instead of a point', 'pct-as-fraction': 'Fraction instead of a percent/decimal', 'pct-dec-sign': 'Decimal written with a % sign', 'pct-money-sign': 'Money written with a % sign',
    'pct-round-dir': 'Rounded the wrong way', 'pct-not-x100': 'Gave the decimal instead of the percent (no × 100)', 'pct-not-div100': 'Gave the percent instead of the decimal (no ÷ 100)', 'pct-cents': 'Gave cents instead of dollars',
    'pct-mixed-improper': 'Mixed number with an improper fraction part', 'pct-no-div': 'Percent not changed to a decimal (× p instead of × p/100)', 'pct-one-place': 'Percent → decimal: moved the point 1 place',
    'pct-three-places': 'Percent → decimal: moved the point 3 places', 'pct-div': 'Divided instead of multiplying (“of”)', 'pct-added': 'Gave the amount plus the percent',
    'u1l7-one-digit': 'One-digit percent written as 0.p instead of 0.0p', 'u1l7-x10': 'Decimal → percent: moved the point 1 place', 'u1l7-x1000': 'Decimal → percent: moved the point 3 places', 'u1l7-frac-flip': 'Divided the bottom by the top',
    'u1l7-digits': 'Wrote the fraction’s digits as a decimal', 'u1l7-whole-part': 'Divided the whole by the part (wrong way round)', 'u1l7-no-x100': 'Percent of a whole: forgot × 100', 'u1l7-x10b': 'Percent of a whole: × 10 instead of × 100',
    'u1l7-shaded': 'Gave the shaded part instead of the unshaded part', 'u1l7-squares': 'Wrong number of squares', 'u1l7-other-col': 'Used a different benchmark percent', 'u1l7-tip-only': 'Gave the tip instead of the total',
    'u1l7-split-bill': 'Split the bill without the tip', 'u1l7-split-tip': 'Split only the tip', 'u1l7-journey': 'Used the journeyperson’s wage', 'u1l7-hours-add': 'Added the hours instead of multiplying', 'u1l7-left-dollars': 'Subtracted percents from dollars',
    'u1l7-pct-of-pct': 'Took the percent of the given part, not of the number', 'u1l7-div10': 'Divided by 10 instead of multiplying', 'u1l7-tip-of-tip': 'Took the percent of the tip instead of working backwards', 'u1l7-off-by-one': 'One hour off (not yet below / already below)',
    'u1l7-used': 'Gave the amount used instead of the amount left', 'u1l7-raise-new': 'Gave the new wage instead of the raise', 'u1l7-raise-only': 'Gave the raise instead of the new wage', 'u1l7-total-15': 'Total with the wrong tip', 'u1l7-diff-total': 'Gave a total instead of the difference', 'u1l7-took-off': 'Took the percent off instead of finding the percent'
  });
  HW.addPartial({
    'pct-round-dir': 's', 'pct-not-x100': 'n', 'pct-not-div100': 'n', 'pct-cents': 's', 'pct-no-div': 'n', 'pct-one-place': 'b', 'pct-three-places': 'b', 'pct-div': 'n', 'pct-added': 's',
    'u1l7-one-digit': 'b', 'u1l7-x10': 'b', 'u1l7-x1000': 'b', 'u1l7-frac-flip': 'n', 'u1l7-digits': 'n', 'u1l7-whole-part': 'n', 'u1l7-no-x100': 'b', 'u1l7-x10b': 'b', 'u1l7-shaded': 'n', 'u1l7-squares': 'n',
    'u1l7-other-col': 'n', 'u1l7-tip-only': 's', 'u1l7-split-bill': 'b', 'u1l7-split-tip': 'b', 'u1l7-journey': 'n', 'u1l7-hours-add': 'n', 'u1l7-left-dollars': 'n', 'u1l7-pct-of-pct': 'n', 'u1l7-div10': 'n',
    'u1l7-tip-of-tip': 'n', 'u1l7-off-by-one': 's', 'u1l7-used': 's', 'u1l7-raise-new': 's', 'u1l7-raise-only': 's', 'u1l7-total-15': 's', 'u1l7-diff-total': 's', 'u1l7-took-off': 'n'
  });

  /* ================= Lesson 7 generators ================= */
  var find = PK.find;
  function range(a, b, st) { var o = []; for (var x = a; x <= b + 1e-9; x += (st || 1)) o.push(Number(x.toFixed(4))); return o; }
  function notIn(arr, ex2) { return arr.filter(function (x) { return ex2.indexOf(x) < 0; }); }
  function sol1(lines) { return lines.join('<br>'); }
  /* accept either of two checkers (e.g. the difference of two rounded tips, or 5% worked directly) */
  function either(c1, c2) { return function (resp) { var a = c1(resp); if (a.v === 'correct') return a; var b = c2(resp); return b.v === 'correct' ? b : a; }; }
  PK.either = either;

  /* ---- percent → decimal ---- */
  var P2D = {
    two: notIn(range(11, 99).filter(function (x) { return x % 10; }), [48, 37, 15]),
    one: [1, 2, 3, 4, 5, 6, 8, 9],
    tens: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    half: [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 8.5, 9.5],
    over: notIn(range(105, 195, 5), [125, 140, 175]),
    sub1: [0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9],
    big: notIn(range(210, 490, 10).filter(function (x) { return x % 100; }), [250]),
    hund: [100, 200, 400, 500, 600]
  };
  function p2dPart(r, cat) {
    var p = r.pick(P2D[cat]), d = p / 100, ds = dS(d);
    var chk = PK.dec(d, null, function (v) {
      if (near(v, p)) return { code: 'pct-not-div100', hint: 'That’s still the percent number. Divide by ' + t('100') + ': move the decimal point <b>2</b> places left.' };
      if (near(v, p / 10)) return p < 10 && p >= 1 && p % 1 === 0 ? { code: 'u1l7-one-digit', hint: 'A one-digit percent needs a zero after the decimal point: ' + t(p + '\\%') + ' is less than ' + t('10\\%=0.10') + ', so the decimal must be less than ' + t('0.10') + '.' } : { code: 'pct-one-place', hint: 'Move the decimal point <b>2</b> places left, not 1.' };
      if (near(v, p / 1000)) return { code: 'pct-three-places', hint: 'Move the decimal point 2 places left, not 3.' };
      return null;
    });
    var part = PK.part(t(pT(p)), chk, ds, ds, 'Divide by 100: move the decimal point 2 places left' + (p < 10 ? ' (fill the empty place with a zero)' : '') + '.<br>' + t(pT(p) + '\\;\\to\\;' + ds) + (p % 1 === 0 && p < 10 ? ' &nbsp; (' + t(p + '\\%=' + p + '.\\%') + ': with no decimal point, it is at the end)' : ''),
      ['Percent → decimal: divide by ' + t('100') + ' (move the decimal point 2 places left).', p < 10 ? 'Check: ' + t(pT(p)) + ' is less than ' + t('10\\%=0.10') + '.' : 'If there is no decimal point, it is at the end of the number.'], 'pct to dec ' + p, { before: t('=') });
    part.bad = [dS(p), dS(p / 10), dS(p / 1000)].filter(function (s) { return s !== ds; });
    return part;
  }
  /* ---- decimal or fraction → percent ---- */
  var D2P = {
    h2: notIn(range(11, 99).filter(function (x) { return x % 10; }), [82, 37]).map(function (x) { return x / 100; }),
    t1: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    h1: [0.01, 0.02, 0.03, 0.04, 0.05, 0.07, 0.08, 0.09],
    ov: [1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9, 1.05, 1.15, 1.35, 1.65],
    ov2: [2.5, 2.2, 2.4, 2.8, 3.5, 3.2, 2.6],
    th: [0.125, 0.375, 0.875, 0.105, 0.135, 0.165, 0.245, 0.315, 0.455, 0.625, 0.725, 0.185],
    th0: [0.015, 0.035, 0.045, 0.055, 0.065, 0.085, 0.095, 0.075]
  };
  var D2PF = {
    f5: [[1, 2], [1, 4], [3, 4], [1, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10]],
    f10: [[1, 10], [3, 10], [7, 10], [9, 10], [1, 2], [4, 5], [1, 5]],
    f20: [[1, 20], [3, 20], [7, 20], [9, 20], [11, 20], [13, 20], [17, 20], [19, 20], [1, 25], [3, 25], [6, 25], [11, 25], [1, 50], [7, 50], [9, 50], [13, 50]],
    f8: [[1, 8], [3, 8], [5, 8], [1, 16], [3, 16], [5, 16], [1, 40], [3, 40], [7, 40]]
  };
  function d2pPart(r, cat) {
    var d = r.pick(D2P[cat]), P = rnd(d * 100, 6), ds = dS(d);
    var chk = PK.pct(P, null, function (v) {
      if (near(v, d)) return { code: 'pct-not-x100', hint: 'That’s still the decimal. Multiply by ' + t('100') + ': move the decimal point <b>2</b> places right.' };
      if (near(v, d * 10)) return { code: 'u1l7-x10', hint: 'Move the decimal point <b>2</b> places right, not 1. ' + (d < 0.1 ? 'Fill empty places with zeros.' : '') };
      if (near(v, d * 1000)) return { code: 'u1l7-x1000', hint: 'Move the decimal point 2 places right, not 3.' };
      return null;
    });
    var part = PK.part(t(ds), chk, dS(P), dS(P) + '\\%', 'Multiply by 100: move the decimal point 2 places right' + (d >= 1 || Math.round(d * 100) % 10 === 0 ? ' (fill empty places with zeros)' : '') + '.<br>' + t(ds + '\\;\\to\\;' + dS(P) + '\\%'),
      ['Decimal → percent: multiply by ' + t('100') + ' (move the decimal point 2 places right).', d >= 1 ? 'A decimal bigger than ' + t('1') + ' is more than ' + t('100\\%') + '.' : 'Fill any empty places with zeros.'], 'dec to pct ' + ds, { before: t('='), after: '%' });
    part.bad = [ds, dS(d * 10), dS(d * 1000)].filter(function (s) { return !near(Number(s), P); });
    return part;
  }
  function f2pPart(r, cat) {
    var f = r.pick(D2PF[cat]), d = f[0] / f[1], P = rnd(d * 100, 6);
    var chk = PK.pct(P, null, function (v) {
      if (near(v, d)) return { code: 'pct-not-x100', hint: t(f[0] + '\\div ' + f[1] + '=' + dS(d)) + ' is the decimal. Multiply by ' + t('100') + ' to get the percent.' };
      if (near(v, f[1] / f[0] * 100) || near(v, f[1] / f[0])) return { code: 'u1l7-frac-flip', hint: 'Divide the <b>top</b> by the bottom: ' + t(f[0] + '\\div ' + f[1]) + '.' };
      if (near(v, d * 10)) return { code: 'u1l7-x10', hint: 'Multiply the decimal by ' + t('100') + ', not ' + t('10') + '.' };
      return null;
    });
    var part = PK.part(t('\\frac{' + f[0] + '}{' + f[1] + '}'), chk, dS(P), dS(P) + '\\%', t('\\frac{' + f[0] + '}{' + f[1] + '}=' + f[0] + '\\div ' + f[1] + '=' + dS(d)) + '<br>' + t(dS(d) + '\\times 100=' + dS(P) + '\\%') + (100 % f[1] === 0 ? ' &nbsp; (or: ' + t('\\frac{' + f[0] + '}{' + f[1] + '}=\\frac{' + f[0] * 100 / f[1] + '}{100}=' + dS(P) + '\\%') + ')' : ''),
      ['Fraction → percent: divide the top by the bottom, then multiply by ' + t('100') + '.', 'On the calculator: ' + f[0] + ' ÷ ' + f[1] + ' =, then × 100.'], 'frac to pct ' + f.join('/'), { before: t('='), after: '%' });
    part.bad = [dS(d), dS(f[1] / f[0] * 100)].filter(function (s) { return !near(Number(s), P); });
    return part;
  }

  /* ---- Q1: the grids ---- */
  var GRID_N = notIn([12, 15, 16, 24, 28, 32, 35, 36, 44, 45, 48, 52, 55, 56, 64, 65, 68, 72, 76, 84, 85, 88, 92, 95, 96, 20, 40, 60, 80], [37, 25, 75, 50]);
  /* ---- Q4: percent / decimal / fraction table rows ---- */
  function rowSpec(r, kind) {
    var p, f, d, dp = null;
    if (kind === 'pctTens') { p = r.pick(notIn(range(10, 90, 10), [60])); d = p / 100; f = red(p, 100); return { give: 'p', p: p, d: d, f: f }; }
    if (kind === 'decHund') { var n = r.pick(notIn([12, 14, 16, 18, 22, 24, 26, 28, 32, 34, 35, 36, 38, 42, 44, 45, 46, 52, 54, 55, 56, 58, 62, 64, 65, 66, 68, 72, 74, 76, 78, 84, 85, 86, 88, 92, 94, 95, 96, 98], [48, 15])); p = n; d = n / 100; f = red(n, 100); return { give: 'd', p: p, d: d, f: f }; }
    if (kind === 'fracEasy') { f = r.pick([[1, 4], [1, 5], [3, 5], [4, 5], [1, 2], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [9, 20], [1, 25], [2, 25], [1, 50]]); d = f[0] / f[1]; p = rnd(d * 100, 6); return { give: 'f', p: p, d: d, f: f }; }
    if (kind === 'pctOne') { p = r.pick([1, 2, 3, 4, 5, 6, 8, 9]); d = p / 100; f = red(p, 100); return { give: 'p', p: p, d: d, f: f }; }
    if (kind === 'fracRep') { f = r.pick([[2, 3], [1, 6], [5, 6], [1, 9], [2, 9], [4, 9], [5, 9], [8, 9], [1, 12], [5, 12], [7, 12], [11, 12]]); d = f[0] / f[1]; return { give: 'f', p: d * 100, d: d, f: f, rep: true }; }
    if (kind === 'decOver') { var o = r.pick([[1.75, [7, 4]], [1.5, [3, 2]], [1.2, [6, 5]], [1.6, [8, 5]], [1.8, [9, 5]], [2.25, [9, 4]], [2.5, [5, 2]], [2.75, [11, 4]], [1.05, [21, 20]], [1.35, [27, 20]], [1.15, [23, 20]]]); return { give: 'd', p: rnd(o[0] * 100, 6), d: o[0], f: o[1] }; }
  }
  function tableRows(r, kinds) { return kinds.map(function (k) { return rowSpec(r, k); }); }
  function rowCheckers(row, i, off) {
    var lab = 'Row ' + (i + 1 + (off || 0)) + ', ', pdp = row.rep ? 1 : null, ddp = row.rep ? 3 : null;
    var pChk = PK.pct(row.p, pdp, function (v) {
      if (near(v, row.d) || (row.rep && near(v, rnd(row.d, 3)))) return { code: 'pct-not-x100', hint: 'That’s the decimal. Multiply by ' + t('100') + ' to get the percent.' };
      if (near(v, row.d * 10) || (row.rep && near(v, rnd(row.d * 10, 2)))) return { code: 'u1l7-x10', hint: 'Multiply the decimal by ' + t('100') + ' (2 places right), not ' + t('10') + '.' };
      if (near(v, row.f[1] / row.f[0] * 100) || (row.rep && near(v, rnd(row.f[1] / row.f[0] * 100, 1)))) return { code: 'u1l7-frac-flip', hint: 'Divide the <b>top</b> by the bottom.' };
      return null;
    });
    var dChk = PK.dec(row.d, ddp, function (v) {
      if (near(v, row.p) || (row.rep && near(v, rnd(row.p, 1)))) return { code: 'pct-not-div100', hint: 'That’s the percent. Divide by ' + t('100') + ' (move the decimal point 2 places left).' };
      if (near(v, row.d * 10)) return row.p < 10 ? { code: 'u1l7-one-digit', hint: 'A one-digit percent needs a zero after the decimal point: ' + t(pT(row.p)) + ' is less than ' + t('10\\%=0.10') + '.' } : { code: 'pct-one-place', hint: 'Move the decimal point <b>2</b> places left, not 1.' };
      if (near(v, row.f[1] / row.f[0]) || (row.rep && near(v, rnd(row.f[1] / row.f[0], 3)))) return { code: 'u1l7-frac-flip', hint: 'Divide the <b>top</b> by the bottom.' };
      if (row.give === 'f' && near(v, Number('0.' + row.f[0] + '' + row.f[1]))) return { code: 'u1l7-digits', hint: 'A fraction isn’t changed to a decimal by writing its digits. Divide the top by the bottom.' };
      return null;
    });
    var fChk = PK.frac(row.f, function (v) {
      if (near(v, row.p / 10) || near(v, row.p)) return { code: 'pct-not-div100', hint: 'A percent is “out of 100”: write ' + t(pT(row.p) + '=\\frac{' + dS(row.p) + '}{100}') + ', then simplify.' };
      return null;
    });
    return { p: { name: lab + 'Percent', chk: pChk }, d: { name: lab + 'Decimal', chk: dChk }, f: { name: lab + 'Fraction', chk: fChk } };
  }
  function pdfTablePart(r, kinds, label, off) {
    off = off || 0;
    var rows = tableRows(r, kinds), Rr = [], C = ['\\text{Decimal}', '\\text{Fraction}'], cells = [], blanks = [], keyR = [], keyC = [], sol = [];
    rows.forEach(function (row, i) {
      var ch = rowCheckers(row, i, off), rn = 'Row ' + (i + 1 + off) + ': ', pS = row.rep ? dS(rnd(row.p, 1)) : dS(row.p), dSs = row.rep ? dS(rnd(row.d, 3)) : dS(row.d);
      Rr.push(row.give === 'p' ? pT(row.p) : null);
      cells.push([row.give === 'd' ? dS(row.d) : null, row.give === 'f' ? fT(row.f) : null]);
      if (row.give !== 'p') blanks.push({ where: 'row', i: i, name: ch.p.name, chk: ch.p.chk });
      if (row.give !== 'd') blanks.push({ where: 'cell', i: i, j: 0, name: ch.d.name, chk: ch.d.chk });
      if (row.give !== 'f') blanks.push({ where: 'cell', i: i, j: 1, name: ch.f.name, chk: ch.f.chk });
      keyR.push(pS + '\\%'); keyC.push([dSs, fT(row.f)]);
      var fr = fT(row.f) + (row.f[0] > row.f[1] ? '=' + mixT(row.f) : '');
      if (row.give === 'p') sol.push(rn + t(pT(row.p) + '=' + dS(row.d)) + ' (2 places left); ' + t(pT(row.p) + '=\\frac{' + row.p + '}{100}=' + fr));
      else if (row.give === 'd') sol.push(rn + t(dS(row.d) + '=' + dS(row.p) + '\\%') + ' (2 places right); ' + t(dS(row.d) + '=\\frac{' + Math.round(row.d * 100) + '}{100}=' + fr));
      else if (row.rep) sol.push(rn + t(row.f[0] + '\\div ' + row.f[1] + '=' + K.decTex(row.f) + '=' + dS(rnd(row.d, 6)) + '\\ldots\\approx ' + dSs) + '; ' + t('\\times 100') + ': ' + t(dS(rnd(row.p, 4)) + '\\ldots\\%\\approx ' + pS + '\\%'));
      else sol.push(rn + t(row.f[0] + '\\div ' + row.f[1] + '=' + dS(row.d)) + '; ' + t(dS(row.d) + '\\times 100=' + dS(row.p) + '\\%'));
    });
    var key = { rows: keyR, cols: C, cells: keyC };
    return PK.tablePart('Complete the table' + (label ? ' (' + label + ')' : '') + '.', { rows: Rr, cols: C, cells: cells, corner: '\\text{Percent}', keys: 'fraction', help: 'Tap a box, then type. Percents can be typed without the % sign; use the fraction key for fractions.' },
      PK.tableChk(blanks), key, sol.join('<br>'), ['Percent → decimal: 2 places left. Decimal → percent: 2 places right.', 'Percent → fraction: write it over ' + t('100') + ', then simplify. Fraction → decimal: divide the top by the bottom.'], 'pdf table ' + kinds.join(','));
  }
  /* ---- Q5 / E3: benchmark percents of an amount ---- */
  var BENCH = [10, 5, 15, 20, 25, 50, 1];
  function benchHow(p, A) {
    var ten = A / 10, at = M(A);
    switch (p) {
      case 10: return t('10\\%') + ': move the decimal point 1 place left: ' + t(M(ten));
      case 5: return t('5\\%') + ' is half of ' + t('10\\%') + ': ' + t(M(ten) + '\\div 2' + PK.eqM(ten / 2));
      case 15: return t('15\\%=10\\%+5\\%') + ': ' + t(M(ten) + '+' + M(ten / 2) + '=' + M(r2(ten) + r2(ten / 2)));
      case 20: return t('20\\%=2\\times 10\\%') + ': ' + t('2\\times ' + M(ten) + '=' + M(2 * ten));
      case 25: return t('25\\%') + ' is a quarter: ' + t(at + '\\div 4' + PK.eqM(A / 4));
      case 30: return t('30\\%=3\\times 10\\%') + ': ' + t('3\\times ' + M(ten) + '=' + M(3 * ten));
      case 50: return t('50\\%') + ' is half: ' + t(at + '\\div 2' + PK.eqM(A / 2));
      case 1: return t('1\\%') + ': move the decimal point 2 places left: ' + t(at + '\\to\\$' + dS(rnd(A / 100, 4)) + (near(A / 100, r2(A / 100)) ? '' : '\\approx ' + M(A / 100)));
    }
  }
  function benchChk(p, A, list) {
    return PK.money(pctOf(p, A), function (v) {
      for (var i = 0; i < list.length; i++) { var q = list[i]; if (q !== p && near(v, r2(pctOf(q, A)))) return { code: 'u1l7-other-col', hint: 'That’s ' + t(q + '\\%') + ' of ' + t(M(A)) + '. ' + (p === 5 ? t('5\\%') + ' is half of ' + t('10\\%') + '.' : p === 1 ? t('1\\%') + ': move the decimal point <b>2</b> places left.' : p === 20 ? t('20\\%') + ' is ' + t('2\\times 10\\%') + '.' : p === 15 ? t('15\\%=10\\%+5\\%') + '.' : p === 25 ? t('25\\%') + ' is a quarter: divide by ' + t('4') + '.' : p === 30 ? t('30\\%') + ' is ' + t('3\\times 10\\%') + '.' : '') }; }
      if (near(v, r2(A / p))) return { code: 'pct-div', hint: 'Don’t divide by ' + t(p) + '. ' + (p === 5 ? 'Find ' + t('10\\%') + ' first, then take half.' : p === 20 ? 'Find ' + t('10\\%') + ', then double it.' : p === 25 ? 'For ' + t('25\\%') + ' divide by ' + t('4') + ' (a quarter).' : 'Use the benchmarks.') };
      if (near(v, r2(p * A / 1000))) return { code: 'pct-one-place', hint: 'Check the decimal point: ' + t('10\\%') + ' of ' + t(M(A)) + ' is ' + t(M(A / 10)) + '.' };
      return null;
    });
  }
  function benchTablePart(A, cols, o) {
    o = o || {};
    var blanks = cols.map(function (p, j) { return { where: 'cell', i: 0, j: j, name: p + '% box', chk: benchChk(p, A, cols) }; });
    var key = { rows: [M(A)], cols: cols.map(function (p) { return p + '\\%'; }), cells: [cols.map(function (p) { return m$(pctOf(p, A)); })] };
    return PK.tablePart(o.prompt || 'Complete this row of the table without a calculator.', { rows: [M(A)], cols: cols.map(function (p) { return p + '\\%'; }), cells: [cols.map(function () { return null; })], corner: '\\text{Amount}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed). Money to the cent.' },
      PK.tableChk(blanks), key, cols.map(function (p) { return benchHow(p, A); }).join('<br>'), ['Start with ' + t('10\\%') + ': move the decimal point 1 place left.', t('5\\%') + ' is half of ' + t('10\\%') + '; ' + t('20\\%') + ' is double; ' + t('25\\%') + ' is a quarter; ' + t('1\\%') + ' is 2 places left.'], 'benchmarks of ' + A);
  }
  /* ---- percent of a whole (part ÷ whole × 100) ---- */
  function whatPctPart(part, whole, o) {
    o = o || {}; var P = part / whole * 100, exact = near(P, rnd(P, 1)), ans = rnd(P, 1);
    var dg = function (v) {
      if (near(v, rnd(whole / part * 100, 1)) || near(v, whole / part * 100) || near(v, rnd(whole / part, 3))) return { code: 'u1l7-whole-part', hint: 'Divide the <b>part</b> by the <b>whole</b>: ' + t(part + '\\div ' + whole) + '. The whole is the number after “of”' + (o.wholeWord ? ' (' + o.wholeWord + ')' : '') + '.' };
      if (near(v, part / whole) || near(v, rnd(part / whole, 1)) || near(v, rnd(part / whole, 2)) || near(v, rnd(part / whole, 3))) return { code: 'u1l7-no-x100', hint: t(part + '\\div ' + whole) + ' gives a decimal. Multiply by ' + t('100') + ' to write it as a percent.' };
      if (near(v, rnd(P / 10, 1)) || near(v, P / 10)) return { code: 'u1l7-x10b', hint: 'Multiply the decimal by ' + t('100') + ', not ' + t('10') + '.' };
      return null;
    };
    var q = part / whole, qT = exact ? dS(rnd(q, 6)) : dS(rnd(q, 5)) + '\\ldots';
    var sol = t(part + '\\div ' + whole + '=' + qT) + '<br>' + t(qT + '\\times 100' + (exact ? '=' + dS(ans) + '\\%' : '=' + dS(rnd(P, 3)) + '\\ldots\\%\\approx ' + dS(ans) + '\\%')) + (part > whole ? '<br>(part bigger than the whole, so more than ' + t('100\\%') + ')' : '') + (o.solEnd || '');
    var p = PK.part(o.prompt || t(part) + ' of ' + t(whole), PK.pct(P, 1, dg, { nr: o.nr }), dS(ans), dS(ans) + '\\%', sol,
      o.hints || ['Percent = part ÷ whole × 100. The whole is the number after “of”.', 'Round to the nearest tenth only at the end.'], o.text || part + ' of ' + whole, o.nr ? { nr: true } : { after: '%' });
    p.bad = [dS(rnd(whole / part * 100, 1)), dS(rnd(part / whole, 3))].filter(function (s) { return !near(Number(s), ans); });
    return p;
  }
  function pctPairs(r, kind) {
    var pick = function () {
      if (kind === 'quarter') { var w = r.pick([8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 60, 64, 80]), k = r.pick([1, 3]); return [w * k / 4, w]; }
      if (kind === 'tenths') { var w2 = r.pick([20, 30, 40, 50, 60, 70, 80, 90, 25, 15, 35, 45, 120]), k2 = r.pick([1, 2, 3, 4, 6, 7, 8, 9]); return [w2 * k2 / 10, w2]; }
      if (kind === 'half') { var w3 = r.pick([40, 80, 120, 200, 160, 24, 16, 32, 48]), pc = r.pick([12.5, 17.5, 22.5, 27.5, 32.5, 37.5, 42.5, 62.5, 2.5, 7.5]); return [w3 * pc / 100, w3]; }
      if (kind === 'over') { var w4 = r.pick([20, 25, 30, 40, 50, 60, 75, 80, 15, 12, 16, 36, 56]), m = r.pick([1.2, 1.25, 1.4, 1.5, 1.6, 1.75, 1.8, 2.5]); return [w4 * m, w4]; }
      if (kind === 'rep') { var w5 = r.pick([3, 6, 7, 9, 11, 12, 13, 14, 15, 18, 21]), k5 = r.int(1, w5 - 1); return [k5, w5]; }
      if (kind === 'repOver') { var w6 = r.pick([3, 6, 7, 9, 11, 12, 13]), k6 = r.int(w6 + 1, 2 * w6 - 1); return [k6, w6]; }
    };
    return find(pick, function (v) {
      var P = v[0] / v[1] * 100, isEx = near(P, rnd(P, 1));
      if (v[0] % 1 || v[1] % 1 || v[0] <= 0) return false;
      if (kind === 'rep' || kind === 'repOver') { if (isEx || gcd(v[0], v[1]) > 1) return false; }
      else if (!isEx) return false;
      var bad = [[18, 72], [9, 40], [7, 9], [60, 48], [38, 45], [22, 25], [12, 64]];
      return !bad.some(function (b) { return b[0] === v[0] && b[1] === v[1]; });
    }, kind === 'rep' ? [5, 12] : kind === 'repOver' ? [13, 7] : kind === 'over' ? [90, 75] : kind === 'half' ? [7, 40] : [18, 24]);
  }

  /* ---- Q6 / E4: percent of an amount by kind ---- */
  function ofPick(r, kind) {
    var bad = [[35, 260], [8, 54.75], [140, 85], [0.4, 3200], [12.5, 96], [250, 18]];
    var v = find(function () {
      if (kind === 'two') return [r.pick([15, 35, 45, 55, 65, 75, 85, 95, 25, 60, 40, 30]), r.pick([40, 60, 80, 120, 140, 160, 180, 200, 220, 240, 340, 360])];
      if (kind === 'two12') return [r.pick([12, 14, 16, 18, 22, 24, 28, 32, 36, 9, 6, 8, 3, 4]), r.pick([150, 250, 350, 450, 550, 650, 300, 600, 700, 800, 900])];
      if (kind === 'dec') return [r.pick([2.5, 4.5, 6.5, 8.5, 3.5, 5.5, 1.5]), r.pick([200, 400, 600, 800, 1000, 120, 160, 240, 280])];
      if (kind === 'over') return [r.pick([110, 120, 125, 150, 160, 175, 180, 130, 115]), r.pick([24, 28, 36, 44, 48, 52, 56, 64, 72, 45, 65, 40, 60, 80])];
      if (kind === 'sub1') return [r.pick([0.2, 0.3, 0.5, 0.6, 0.8, 0.9]), r.pick([1500, 2500, 3500, 4500, 750, 1250, 2000, 3000, 5000])];
      if (kind === 'mult') return [r.pick([200, 300, 400, 500]), r.int(11, 49)];
      if (kind === 'money') return [r.pick([15, 18, 20, 12, 8, 6, 25]), r.int(1205, 4995) / 100];
      if (kind === 'moneyBig') return [r.pick([2.5, 1.5, 3.5, 4.5, 7.5]), r.int(30, 250) * 10];
    }, function (v) {
      var x = pctOf(v[0], v[1]);
      if (bad.some(function (b) { return b[0] === v[0] && b[1] === v[1]; })) return false;
      if (kind === 'money') return v[1] * 100 % 10 === 0 && near(x, r2(x));            // a bill like $27.80 whose tip comes out to the cent
      if (kind === 'moneyBig') return near(x, r2(x));
      return near(x, rnd(x, 2)) && x < 10000;
    }, kind === 'money' ? [15, 27.8] : [45, 80]);
    return v;
  }

  /* ---- MC helpers ---- */
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder, cols) { var p = K.P.mc(r, prompt, opts, sol, hints, text, keepOrder); if (cols) p.input.columns = cols; return p; }
  var NAMES = ['Jordan', 'Kiera', 'Mason', 'Priya', 'Tyson', 'Hailey', 'Noah', 'Ava', 'Diego', 'Leah', 'Owen', 'Sara'];

  HW.defineLesson({
    id: 'u1l7', unit: 1, num: '7', title: 'Percents Refresher: Percents, Decimals and Percent of an Amount', outcome: 'REV',
    blurb: 'What a percent means, switching between percents, decimals and fractions, quick benchmark percents, finding a percent of an amount, and what percent one number is of another.',
    questions: [
      { num: '1', stem: 'Each grid is one whole (100 squares).', shared: function (r) { return { n: r.pick(GRID_N), k: r.pick([2, 3, 4, 5, 6, 8, 9]) }; }, parts: [
        { id: '1a', level: 'BEG', make: function (r, sh) {
          var n = sh.n, f = red(n, 100), d = dS(n / 100);
          var chks = [PK.pct(n, null, function (v) { if (near(v, 100 - n)) return { code: 'u1l7-shaded', hint: 'That’s the part that is <b>not</b> shaded. Count the shaded squares.' }; if (near(v, n / 100)) return { code: 'pct-not-x100', hint: 'That’s the decimal. As a percent, the shaded squares out of 100 is ' + t('\\square\\%') + '.' }; return null; }),
            PK.dec(n / 100, null, function (v) { if (near(v, n)) return { code: 'pct-not-div100', hint: 'That’s the percent. As a decimal: divide by ' + t('100') + '.' }; if (near(v, n / 10)) return { code: 'pct-one-place', hint: 'Move the decimal point 2 places left, not 1.' }; if (near(v, (100 - n) / 100)) return { code: 'u1l7-shaded', hint: 'That’s the part that is not shaded.' }; return null; }),
            PK.frac(f, function (v) { if (near(v, (100 - n) / 100)) return { code: 'u1l7-shaded', hint: 'That’s the part that is not shaded.' }; return null; }),
            PK.pct(100 - n, null, function (v) { if (near(v, n)) return { code: 'u1l7-shaded', hint: 'That’s the <b>shaded</b> part. The whole is ' + t('100\\%') + ': subtract.' }; return null; })];
          var p = PK.fields('<div class="u1l7-pic">' + PK.grid(n, 'Grid A: ' + n + ' of 100 squares shaded') + '<div class="muted" style="font-size:13px">Grid A</div></div>For Grid A, write the shaded part as a percent, a decimal and a fraction in simplest form. What percent is <b>not</b> shaded?',
            [{ label: 'Percent', after: '%', name: 'Percent' }, { label: 'Decimal', name: 'Decimal' }, { label: 'Fraction', mode: 'math', keys: 'fraction', name: 'Fraction' }, { label: 'Not shaded', after: '%', name: 'Not shaded' }], chks,
            [String(n), d, fT(f), String(100 - n)], 'Percent ' + t(n + '\\%') + ', decimal ' + t(d) + ', fraction ' + t(fT(f)) + ', not shaded ' + t((100 - n) + '\\%'),
            sol1([t(n) + ' of the ' + t('100') + ' squares are shaded: ' + t(n + '\\%') + '.', 'Decimal: ' + t(n + '\\%=' + d) + ' (2 places left).', 'Fraction: ' + t('\\frac{' + n + '}{100}=' + fT(f)) + ' (divide the top and bottom by ' + t(gcd(n, 100)) + ').', 'Not shaded: ' + t('100\\%-' + n + '\\%=' + (100 - n) + '\\%') + '.']),
            ['Count the shaded squares: each full row is ' + t('10') + ' squares. Each square is ' + t('1\\%') + '.', 'For the fraction, write it over ' + t('100') + ' and simplify.'], 'grid ' + n);
          p.bad = [[String(100 - n), d, fT(f), String(100 - n)], [String(n), String(n), fT(f), String(100 - n)]];
          return p;
        } },
        { id: '1b', level: 'LIM', make: function (r, sh) {
          var k = sh.k, d = dS(k / 100);
          var chks = [PK.num(k, null, function (v) { if (near(v, k * 10)) return { code: 'u1l7-squares', hint: 'Each square is ' + t('1\\%') + ', so ' + t(k + '\\%') + ' is ' + t(k) + ' squares.' }; return null; }),
            PK.dec(k / 100, null, function (v) { if (near(v, k / 10)) return { code: 'u1l7-one-digit', hint: t(k + '\\%') + ' is less than ' + t('10\\%=0.10') + '. A one-digit percent needs a zero after the decimal point.' }; if (near(v, k)) return { code: 'pct-not-div100', hint: 'Divide by ' + t('100') + ': move the decimal point 2 places left.' }; return null; })];
          var p = PK.fields('<div class="u1l7-pic">' + PK.grid(0, 'Grid B: an empty 10 by 10 grid') + '<div class="muted" style="font-size:13px">Grid B</div></div>You want to shade ' + t(k + '\\%') + ' of Grid B. How many squares would you shade? Write ' + t(k + '\\%') + ' as a decimal.',
            [{ label: 'Squares to shade', name: 'Squares' }, { label: t(k + '\\%=') + ' (decimal)', name: 'Decimal' }], chks, [String(k), d], t(k) + ' squares; ' + t(k + '\\%=' + d),
            'Each square is ' + t('1\\%') + ', so shade ' + t(k) + ' squares.<br>' + t(k + '\\%=' + k + '.\\%\\to ' + d) + ' (2 places left; the empty place gets a zero).', ['Each of the 100 squares is ' + t('1\\%') + '.', 'Percent → decimal: move the decimal point 2 places left.'], 'shade ' + k);
          p.bad = [[String(k), dS(k / 10)], [String(k * 10), d]];
          return p;
        } }] },
      { num: '2', stem: 'Write each percent as a decimal.', parts: [['a', 'two', 'LIM'], ['b', 'one', 'BEG'], ['c', 'tens', 'LIM'], ['d', 'half', 'EMG'], ['e', 'over', 'BEG'], ['f', 'sub1', 'EMG'], ['g', 'big', 'BEG'], ['h', 'hund', 'LIM']].map(function (x) {
        return { id: '2' + x[0], level: x[2], make: function (r) { return p2dPart(r, x[1]); } }; }) },
      { num: '3', stem: 'Write each decimal or fraction as a percent.', parts: [['a', 'h2', 'LIM', 'd'], ['b', 't1', 'BEG', 'd'], ['c', 'h1', 'BEG', 'd'], ['d', 'ov', 'BEG', 'd'], ['e', 'th', 'EMG', 'd'], ['f', 'f5', 'BEG', 'f'], ['g', 'f20', 'EMG', 'f'], ['h', 'f8', 'EMG', 'f']].map(function (x) {
        return { id: '3' + x[0], level: x[2], make: function (r) { return x[3] === 'd' ? d2pPart(r, x[1]) : f2pPart(r, x[1]); } }; }) },
      { num: '4', stem: 'Complete the table. Write fractions in simplest form. Round the percent to the nearest tenth and the decimal to the nearest thousandth where needed.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return pdfTablePart(r, ['pctTens', 'decHund', 'fracEasy'], 'rows 1 to 3'); } },
        { id: '4b', level: 'EMG', make: function (r) { return pdfTablePart(r, ['pctOne', 'fracRep', 'decOver'], 'rows 4 to 6', 3); } }] },
      { num: '5', stem: 'Benchmarks: find each percent of the amount <b>without a calculator</b>.', shared: function (r) {
          return { A: r.pick([40, 50, 70, 80, 90, 30, 120, 140, 110]), B: find(function () { return r.int(51, 499) * 20 / 100; }, function (x) { return x % 1 !== 0 && !near(x, 84.2) && x >= 10.2; }, 12.6),
            bill: rnd(r.int(3, 9) * 10 + r.pick([-0.9, -0.8, -0.6, -0.4, -0.3, 0.2, 0.3, 0.4]), 2) };
        }, parts: [
        { id: '5a', level: 'BEG', make: function (r, sh) { return benchTablePart(sh.A, BENCH, { prompt: 'Complete the row for ' + t(M(sh.A)) + '.' }); } },
        { id: '5b', level: 'EMG', make: function (r, sh) { return benchTablePart(sh.B, BENCH, { prompt: 'Complete the row for ' + t(M(sh.B)) + '. Round to the cent where needed.' }); } },
        { id: '5c', level: 'BEG', make: function (r, sh) {
          var b = sh.bill, R = Math.round(b / 10) * 10, ten = R / 10, five = ten / 2;
          return mcPart(r, 'Estimate a ' + t('15\\%') + ' tip on a bill of ' + t(M(b)) + ' in your head. Which thinking is best?', [
            { html: t(M(b) + '\\approx ' + M(R)) + '. ' + t('10\\%') + ' is ' + t(M(ten)) + ', ' + t('5\\%') + ' is half of that, ' + t(M(five)) + ', so ' + t('15\\%') + ' is about ' + t(M(ten) + '+' + M(five) + '=' + M(ten + five)) + '.', right: true },
            { html: t(M(b) + '\\approx ' + M(R)) + '. ' + t('10\\%') + ' is ' + t(M(ten)) + ' and ' + t('5\\%') + ' is ' + t(M(R / 100)) + ', so ' + t('15\\%') + ' is about ' + t(M(ten + R / 100)) + '.', why: t('5\\%') + ' is <b>half</b> of ' + t('10\\%') + ', not the same as ' + t('1\\%') + '.', code: 'five-as-one' },
            { html: t(M(b) + '\\approx ' + M(R)) + '. ' + t('15\\%') + ' is ' + t(dS(R) + '\\div 15\\approx ' + M(R / 15)) + '.', why: 'A percent of an amount is not the amount ÷ the percent. Use the benchmarks: ' + t('10\\%') + ' then ' + t('5\\%') + '.', code: 'div15' },
            { html: t(M(b) + '\\approx ' + M(R)) + '. ' + t('10\\%') + ' is ' + t(M(ten)) + ', so ' + t('15\\%') + ' is about ' + t('15\\times ' + M(ten) + '=' + M(15 * ten)) + '.', why: 'That would be ' + t('150\\%') + '. ' + t('15\\%=10\\%+5\\%') + '.', code: 'x15' }],
            'Round: ' + t(M(b) + '\\approx ' + M(R)) + '. ' + t('10\\%') + ' of ' + t(M(R)) + ' is ' + t(M(ten)) + '; ' + t('5\\%') + ' is half: ' + t(M(five)) + '.<br>' + t('15\\%\\approx ' + M(ten) + '+' + M(five) + '=' + M(ten + five)) + '. The tip is about ' + t(M(ten + five)) + '.',
            ['Round the bill to an easy number first.', t('15\\%=10\\%+5\\%') + ', and ' + t('5\\%') + ' is half of ' + t('10\\%') + '.'], 'estimate tip ' + b);
        } }] },
      { num: '6', stem: 'Calculate. Estimate first to check your answer.', parts: [['a', 'two', 'BEG'], ['b', 'two12', 'BEG'], ['c', 'dec', 'EMG'], ['d', 'over', 'EMG'], ['e', 'sub1', 'EMG'], ['f', 'mult', 'BEG'], ['g', 'money', 'BEG'], ['h', 'moneyBig', 'EMG']].map(function (x) {
        return { id: '6' + x[0], level: x[2], make: function (r) { var v = ofPick(r, x[1]); return PK.ofPart(v[0], v[1], { money: x[1] === 'money' || x[1] === 'moneyBig', before: t('=') }); } }; }) },
      { num: '7', stem: function (sh) { return 'A first-year apprentice ' + sh.trade + ' earns ' + t(sh.p + '\\%') + ' of a journeyperson’s wage. The journeyperson earns ' + t(M(sh.W)) + ' per hour.'; },
        shared: function (r) { return find(function () { return { p: r.pick([50, 55, 60, 65, 70, 75, 80]), W: r.int(68, 108) / 2, h: r.pick([35, 37.5, 40, 44, 40]), trade: r.pick(['electrician', 'plumber', 'carpenter', 'welder', 'electrician']) }; }, function (s) { return near(pctOf(s.p, s.W), r2(pctOf(s.p, s.W))) && near(r2(pctOf(s.p, s.W)) * s.h, r2(r2(pctOf(s.p, s.W)) * s.h)); }, { p: 60, W: 48.5, h: 40, trade: 'electrician' }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { var p = PK.ofPart(sh.p, sh.W, { money: true, prompt: 'How much does the apprentice earn per hour?', after: 'per hour', noEstimate: true, solEnd: '<br>The apprentice earns ' + t(M(pctOf(sh.p, sh.W))) + ' per hour.',
            extraDiag: function (v) { if (near(v, r2(sh.W - pctOf(sh.p, sh.W)))) return { code: 'u1l7-took-off', hint: 'That’s the journeyperson’s wage minus ' + t(sh.p + '\\%') + ' of it. The apprentice earns ' + t(sh.p + '\\%') + ' of the wage.' }; return null; } }); p.text = 'apprentice wage'; return p; } },
          { id: '7b', level: 'EMG', make: function (r, sh) {
            var w = r2(pctOf(sh.p, sh.W)), tot = w * sh.h;
            var p = PK.moneyPart('How much does the apprentice earn for a ' + t(dS(sh.h)) + '-hour week?', tot, function (v) {
              if (near(v, r2(sh.W * sh.h))) return { code: 'u1l7-journey', hint: 'That’s the journeyperson’s pay. Use the apprentice’s hourly wage from (a).' };
              if (near(v, r2(w + sh.h))) return { code: 'u1l7-hours-add', hint: 'Multiply the hourly wage by the number of hours.' };
              return null;
            }, t(dS(sh.h) + '\\times ' + M(w) + '=' + M(tot)), ['Use the hourly wage from (a).', 'Weekly pay = hours × hourly wage.'], 'apprentice week');
            p.bad = [m$(sh.W * sh.h)];
            return p;
          } }] },
      { num: '8', stem: function (sh) { return sh.word + ' friends have ' + sh.food + ' at a restaurant in ' + sh.city + '. The bill is ' + t(M(sh.B)) + ' and they leave ' + (sh.p === 18 || sh.p === 8 || sh.p === 11 ? 'an ' : 'a ') + t(sh.p + '\\%') + ' tip.'; },
        shared: function (r) { var n = r.pick([2, 3, 4, 5, 4]); return find(function () { return { n: n, word: ['', '', 'Two', 'Three', 'Four', 'Five'][n], B: r.int(24, 99) + r.pick([0, 0, 0.5, 0.25, 0.75, 0.4, 0.8]), p: r.pick([15, 16, 18, 20, 18]), food: r.pick(['pizza', 'burgers', 'pho', 'wings', 'pizza']), city: r.pick(['Calgary', 'Airdrie', 'Cochrane', 'Calgary', 'Red Deer']) }; },
          function (s) { var tip = r2(pctOf(s.p, s.B)), tot = s.B + tip; return near(tot / s.n, r2(tot / s.n)); }, { n: 4, word: 'Four', B: 82, p: 18, food: 'pizza', city: 'Calgary' }); },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { var p = PK.ofPart(sh.p, sh.B, { money: true, prompt: 'Find the tip.', noEstimate: false, addOn: true }); p.text = 'tip'; return p; } },
          { id: '8b', level: 'BEG', make: function (r, sh) {
            var tip = r2(pctOf(sh.p, sh.B)), tot = sh.B + tip;
            var p = PK.moneyPart('Find the total with the tip.', tot, function (v) { if (near(v, tip)) return { code: 'u1l7-tip-only', hint: 'That’s the tip. Add it to the bill.' }; if (near(v, r2(sh.B * (1 + sh.p)))) return { code: 'pct-no-div', hint: 'Use the tip from (a): change ' + t(sh.p + '\\%') + ' to ' + t(dS(sh.p / 100)) + ' first.' }; return null; },
              t(M(sh.B) + '+' + M(tip) + '=' + M(tot)), ['Total = bill + tip.'], 'total with tip');
            p.bad = [m$(tip)];
            return p;
          } },
          { id: '8c', level: 'EMG', make: function (r, sh) {
            var tip = r2(pctOf(sh.p, sh.B)), tot = sh.B + tip, each = tot / sh.n;
            var p = PK.moneyPart('They split the total equally. How much does each friend pay?', each, function (v) {
              if (near(v, r2(sh.B / sh.n))) return { code: 'u1l7-split-bill', hint: 'Split the <b>total with the tip</b> from (b), not just the bill.' };
              if (near(v, r2(tip / sh.n))) return { code: 'u1l7-split-tip', hint: 'That’s each person’s share of the tip. Split the whole total from (b).' };
              if (near(v, r2(tot * sh.n))) return { code: 'pct-div', hint: 'Split means divide by ' + t(sh.n) + '.' };
              return null;
            }, t(M(tot) + '\\div ' + sh.n + PK.eqM(each)) + '<br>Each friend pays ' + t(M(each)) + '.', ['Use the total from (b).', 'Divide it by the number of friends.'], 'split ' + sh.n);
            p.bad = [m$(sh.B / sh.n)];
            return p;
          } }] },
      { num: '9', stem: 'Find each percent. Round to the nearest tenth of a percent if needed.', parts: [['a', 'quarter', 'BEG'], ['b', 'tenths', 'BEG'], ['c', 'half', 'BEG'], ['d', 'over', 'EMG'], ['e', 'rep', 'EMG'], ['f', 'repOver', 'EMG']].map(function (x) {
        return { id: '9' + x[0], level: x[2], make: function (r) { var v = pctPairs(r, x[1]); return whatPctPart(v[0], v[1]); } }; }) },
      { num: '10', stem: function (sh) { return sh.name + ' got ' + t(sh.a) + ' out of ' + t(sh.A) + ' on Quiz A and ' + t(sh.b) + ' out of ' + t(sh.B) + ' on Quiz B.'; },
        shared: function (r) { return find(function () { var A = r.pick([20, 25, 40, 30]), B = r.pick([50, 60, 80, 45, 75]), a = r.int(Math.ceil(A * 0.7), A - 1), b = r.int(a + 1, B - 1); return { A: A, B: B, a: a, b: b, name: r.pick(NAMES) }; },
          function (s) { var pa = s.a / s.A * 100, pb = s.b / s.B * 100; return s.B > s.A && s.b > s.a && pa - pb >= 2 && near(pa, rnd(pa, 1)) && near(pb, rnd(pb, 1)) && !(s.a === 38 && s.A === 45); }, { A: 40, B: 50, a: 34, b: 41, name: 'Jordan' }); },
        parts: [
          { id: '10a', level: 'BEG', make: function (r, sh) {
            var pa = sh.a / sh.A * 100, pb = sh.b / sh.B * 100;
            var cA = whatPctPart(sh.a, sh.A).check, cB = whatPctPart(sh.b, sh.B).check;
            var p = PK.fields('Write each score as a percent.', [{ label: 'Quiz A', after: '%', name: 'Quiz A' }, { label: 'Quiz B', after: '%', name: 'Quiz B' }], [cA, cB], [dS(pa), dS(pb)], 'Quiz A ' + t(dS(pa) + '\\%') + ', Quiz B ' + t(dS(pb) + '\\%'),
              'Quiz A: ' + t(sh.a + '\\div ' + sh.A + '=' + dS(sh.a / sh.A) + '=' + dS(pa) + '\\%') + '<br>Quiz B: ' + t(sh.b + '\\div ' + sh.B + '=' + dS(sh.b / sh.B) + '=' + dS(pb) + '\\%'), ['Percent = marks ÷ total × 100.'], 'quiz percents');
            p.bad = [[dS(pb), dS(pa)], [dS(sh.a / sh.A), dS(sh.b / sh.B)]];
            return p;
          } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var pa = dS(sh.a / sh.A * 100), pb = dS(sh.b / sh.B * 100), he = /^(Jordan|Mason|Tyson|Noah|Diego|Owen)$/.test(sh.name) ? 'he' : 'she';
            return mcPart(r, sh.name + ' says ' + he + ' did better on Quiz B because ' + he + ' got more marks. Is ' + he + ' right?', [
              { html: '<b>No.</b> Quiz B was out of more marks. As percents, Quiz A (' + t(pa + '\\%') + ') is better than Quiz B (' + t(pb + '\\%') + ').', right: true },
              { html: '<b>Yes.</b> ' + t(sh.b) + ' marks is more than ' + t(sh.a) + ' marks.', why: 'The quizzes have different totals, so compare the <b>percents</b>, not the marks.', code: 'more-marks' },
              { html: '<b>Yes.</b> As a percent, Quiz B is higher.', why: 'Work out both percents: ' + t(sh.a + '\\div ' + sh.A) + ' and ' + t(sh.b + '\\div ' + sh.B) + ', each ' + t('\\times 100') + '.', code: 'pct-wrong' },
              { html: '<b>No.</b> Quiz A had fewer questions, so it was easier.', why: 'The right answer is “no”, but not for that reason. Compare the two percents.', code: 'easier' }],
              'No. Quiz A: ' + t(pa + '\\%') + '; Quiz B: ' + t(pb + '\\%') + '. Quiz A is the better score, even though Quiz B has more marks, because Quiz B was out of more. Percents let us compare tests with different totals.', ['Use your answers to (a).'], 'quiz compare');
          } }] },
      { num: '11', stem: function (sh) { return 'Sam says, “' + t(sh.p + '\\%') + ' as a decimal is ' + t('0.' + sh.p) + ', so ' + t(sh.p + '\\%') + ' of ' + t(M(sh.A)) + ' is ' + t(M(sh.A * sh.p / 10)) + '.”'; },
        shared: function (r) { return { p: r.pick([2, 3, 4]), A: r.pick([150, 200, 250, 300, 350, 400, 450, 500, 600, 800]) }; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var p = sh.p, A = sh.A;
            return mcPart(r, 'What is Sam’s mistake?', [
              { html: t(p + '\\%') + ' as a decimal is ' + t('0.0' + p) + ', not ' + t('0.' + p) + '. (' + t('0.' + p) + ' is ' + t(p + '0\\%') + '.)', right: true },
              { html: 'He should divide ' + t(M(A)) + ' by ' + t(p) + ' instead of multiplying.', why: '“Of” does mean multiply. The problem is the decimal he multiplied by.', code: 'divide' },
              { html: t(p + '\\%') + ' as a decimal is ' + t(p) + ', so the answer is ' + t(p + '\\times ' + M(A)) + '.', why: 'A percent is “out of 100”: divide by ' + t('100') + ' to get the decimal.', code: 'no-div' },
              { html: 'There is no mistake.', why: 'Use a benchmark: ' + t('10\\%') + ' of ' + t(M(A)) + ' is only ' + t(M(A / 10)) + '.', code: 'none' }],
              t(p + '\\%=0.0' + p) + ' (move the decimal point 2 places left). Sam used ' + t('0.' + p) + ', which is ' + t(p + '0\\%') + '.', ['A one-digit percent needs a zero after the decimal point.'], 'Sam mistake');
          } },
          { id: '11b', level: 'BEG', make: function (r, sh) { var p = PK.ofPart(sh.p, sh.A, { money: true, prompt: 'Find the correct answer: ' + t(sh.p + '\\%\\text{ of }' + M(sh.A)) + '.' }); p.text = 'Sam correct'; return p; } },
          { id: '11c', level: 'EMG', make: function (r, sh) {
            var p = sh.p, A = sh.A, X = A * p / 10;
            return mcPart(r, 'Which benchmark shows that ' + t(M(X)) + ' cannot be right?', [
              { html: t('10\\%') + ' of ' + t(M(A)) + ' is ' + t(M(A / 10)) + '. ' + t(p + '\\%') + ' is less than ' + t('10\\%') + ', so the answer must be less than ' + t(M(A / 10)) + '.', right: true },
              { html: t('50\\%') + ' of ' + t(M(A)) + ' is ' + t(M(A / 2)) + ', and ' + t(M(X)) + ' is less than that.', why: 'That doesn’t rule ' + t(M(X)) + ' out — it is less than half. Use a benchmark closer to ' + t(p + '\\%') + '.', code: 'half' },
              { html: t('100\\%') + ' of ' + t(M(A)) + ' is ' + t(M(A)) + ', and ' + t(M(X)) + ' is less than ' + t(M(A)) + '.', why: 'Being less than the whole amount doesn’t make it wrong. Use a benchmark closer to ' + t(p + '\\%') + '.', code: 'whole' }],
              t('10\\%') + ' of ' + t(M(A)) + ' is ' + t(M(A / 10)) + ' (decimal point 1 place left). ' + t(p + '\\%') + ' is less than ' + t('10\\%') + ', so ' + t(p + '\\%') + ' of ' + t(M(A)) + ' must be less than ' + t(M(A / 10)) + '. ' + t(M(X)) + ' is far too big.', ['Find ' + t('10\\%') + ' of ' + t(M(A)) + ' in your head.'], 'Sam benchmark');
          } }] },
      { num: '12', stem: function (sh) { return sh.name + '’s paycheque is ' + t(M(sh.P)) + '. She puts ' + t(sh.s + '\\%') + ' into savings and ' + t(sh.c + '\\%') + ' toward her car payment.'; },
        shared: function (r) { return find(function () { return { P: r.int(16, 45) * 20, s: r.pick([10, 15, 20, 25]), c: r.pick([20, 25, 30, 35, 40]), name: r.pick(['Ava', 'Kiera', 'Hailey', 'Leah', 'Sara', 'Priya']) }; }, function (s) { return s.s + s.c < 80 && s.c !== s.s && s.s + s.c !== 50; }, { P: 640, s: 15, c: 35, name: 'Ava' }); },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, sh) { var p = PK.ofPart(sh.s, sh.P, { money: true, prompt: 'How much goes into savings?', noEstimate: true }); p.text = 'savings'; return p; } },
          { id: '12b', level: 'BEG', make: function (r, sh) { var p = PK.ofPart(sh.c, sh.P, { money: true, prompt: 'How much goes toward the car?', noEstimate: true }); p.text = 'car'; return p; } },
          { id: '12c', level: 'EMG', make: function (r, sh) {
            var S = pctOf(sh.s, sh.P), C = pctOf(sh.c, sh.P), L = sh.P - S - C, lp = 100 - sh.s - sh.c;
            var p = PK.fields('How much is left? What percent of her paycheque is that?', [{ label: 'Left', before: '$', name: 'Money left' }, { label: 'Percent left', after: '%', name: 'Percent left' }],
              [PK.money(L, function (v) { if (near(v, sh.P - sh.s - sh.c)) return { code: 'u1l7-left-dollars', hint: 'Subtract the <b>dollar amounts</b> from (a) and (b), not the percents.' }; if (near(v, S + C)) return { code: 'u1l7-used', hint: 'That’s the amount spent. Subtract it from the paycheque.' }; return null; }),
                PK.pct(lp, null, function (v) { if (near(v, sh.s + sh.c)) return { code: 'u1l7-used', hint: 'That’s the percent used. What percent is <b>left</b>?' }; if (near(v, L / sh.P)) return { code: 'pct-not-x100', hint: 'Multiply by ' + t('100') + '.' }; return null; })],
              [m$(L), String(lp)], t(M(L)) + ' left, which is ' + t(lp + '\\%'),
              t(M(sh.P) + '-' + M(S) + '-' + M(C) + '=' + M(L)) + ' left.<br>' + t(dS(L) + '\\div ' + dS(sh.P) + '=' + dS(L / sh.P) + '=' + lp + '\\%') + ' &nbsp; (Or: ' + t('100\\%-' + sh.s + '\\%-' + sh.c + '\\%=' + lp + '\\%') + '.)', ['Subtract both amounts from the paycheque.', 'Percent left = left ÷ paycheque × 100 (or ' + t('100\\%') + ' minus both percents).'], 'left over');
            p.bad = [[m$(sh.P - sh.s - sh.c), String(lp)], [m$(L), String(sh.s + sh.c)]];
            return p;
          } }] },
      { num: '13', stem: function (sh) { return t('10\\%') + ' of a number is ' + t(dS(sh.N)) + '.'; },
        shared: function (r) { return find(function () { return { N: r.int(31, 99) / 10, q: r.pick([15, 25, 35, 45, 35]) }; }, function (s) { return Math.round(s.N * 10) % 10 !== 0 && !near(s.N, 7.4) || r.chance(0.15); }, { N: 7.4, q: 35 }); },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) {
            var X = rnd(sh.N * 10, 4);
            var p = PK.part('What is the number?', PK.num(X, null, function (v) { if (near(v, sh.N / 10)) return { code: 'u1l7-div10', hint: t('10\\%') + ' is ' + t('\\frac{1}{10}') + ' of the number, so the number is <b>10 times</b> ' + t(dS(sh.N)) + '.' }; if (near(v, sh.N * 100)) return { code: 'pct-one-place', hint: 'If ' + t('10\\%') + ' is ' + t(dS(sh.N)) + ', then ' + t('100\\%') + ' is 10 times as much.' }; if (near(v, sh.N * 0.1)) return { code: 'u1l7-div10', hint: 'Work backwards: the number is ' + t('10\\times ' + dS(sh.N)) + '.' }; return null; }),
              dS(X), dS(X), t('10\\%') + ' is ' + t('\\frac{1}{10}') + ' of the number, so the number is ' + t('10\\times ' + dS(sh.N) + '=' + dS(X)) + '.<br>Check: ' + t('10\\%') + ' of ' + t(dS(X)) + ' is ' + t(dS(sh.N)) + ' ✓', ['Ten lots of ' + t('10\\%') + ' make ' + t('100\\%') + '.'], '10% is ' + sh.N);
            p.bad = [dS(sh.N / 10)];
            return p;
          } },
          { id: '13b', level: 'PRG', make: function (r, sh) {
            var X = sh.N * 10, k = Math.floor(sh.q / 10), ans = rnd(sh.q / 100 * X, 4), five = rnd(sh.N / 2, 4);
            var p = PK.part('Find ' + t(sh.q + '\\%') + ' of the number using benchmarks (no calculator). Check with a calculator.', PK.num(ans, null, function (v) {
              if (near(v, rnd(sh.q / 100 * sh.N, 4))) return { code: 'u1l7-pct-of-pct', hint: 'That’s ' + t(sh.q + '\\%') + ' of ' + t(dS(sh.N)) + '. Find ' + t(sh.q + '\\%') + ' of the <b>number</b> from (a).' };
              if (near(v, rnd(k * sh.N, 4))) return { code: 'u1l7-other-col', hint: 'That’s ' + t((10 * k) + '\\%') + '. Add ' + t('5\\%') + ' (half of ' + t('10\\%') + ') too.' };
              if (near(v, rnd(sh.q * sh.N, 4))) return { code: 'pct-no-div', hint: t(sh.q + '\\%') + ' is ' + t(dS(sh.q / 10)) + ' lots of ' + t('10\\%') + ', not ' + t(sh.q) + ' lots.' };
              return null;
            }), dS(ans), dS(ans), t(sh.q + '\\%=' + (k > 1 ? k + '\\times ' : '') + '10\\%+5\\%') + '<br>' + t((k > 1 ? k + '(' + dS(sh.N) + ')' : dS(sh.N)) + '+' + dS(five) + '=' + dS(rnd(k * sh.N, 4)) + '+' + dS(five) + '=' + dS(ans)) + '<br>Check: ' + t(dS(sh.q / 100) + '\\times ' + dS(X) + '=' + dS(ans)) + ' ✓',
              [t('10\\%') + ' of the number is ' + t(dS(sh.N)) + ', and ' + t('5\\%') + ' is half of that.', 'Build ' + t(sh.q + '\\%') + ' from ' + t('10\\%') + 's and a ' + t('5\\%') + '.'], sh.q + '% by benchmarks');
            p.bad = [dS(rnd(sh.q / 100 * sh.N, 4))];
            return p;
          } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'BEG', make: function (r) {
        var a = r.pick([2, 3, 6, 7, 8, 9]);
        return mcPart(r, 'As a decimal, ' + t('0.' + a + '\\%') + ' is', [
          { html: t('0.' + a), why: 'You still need to divide by ' + t('100') + ': move the decimal point 2 places left.', code: 'nodiv' },
          { html: t('0.0' + a), why: 'That moves the decimal point only 1 place. Move it 2 places left.', code: 'one' },
          { html: t('0.00' + a), right: true },
          { html: t(a), why: 'That multiplies by 10. To change a percent to a decimal, divide by ' + t('100') + '.', code: 'times' }],
          t('0.' + a + '\\%\\to 0.00' + a) + ': move the decimal point 2 places left.', ['Percent → decimal: divide by 100.'], '0.' + a + '% as decimal', true, 4);
      } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var B = find(function () { return r.int(251, 899) / 10; }, function (x) { return !near(x, 47.6) && Math.round(x * 10) % 10 !== 0; }, 43.5), ten = B / 10;
        return mcPart(r, 'A ' + t('20\\%') + ' tip on a bill of ' + t(M(B)) + ' is', [
          { html: t(M(2 * ten)), right: true },
          { html: t(M(ten)), why: 'That’s ' + t('10\\%') + '. ' + t('20\\%') + ' is double ' + t('10\\%') + '.', code: 'ten' },
          { html: t(M(B + 2 * ten)), why: 'That’s the total with the tip. The question asks for the tip only.', code: 'total' },
          { html: t(M(B / 50)), why: 'That’s ' + t('2\\%') + '. ' + t('20\\%') + ' is ' + t('2\\times 10\\%') + '.', code: 'two' }],
          t('10\\%') + ' of ' + t(M(B)) + ' is ' + t(M(ten)) + ', so ' + t('20\\%') + ' is ' + t('2\\times ' + M(ten) + '=' + M(2 * ten)) + '.', [t('20\\%=2\\times 10\\%') + '.'], '20% tip ' + B, false, 2);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { var b = r.pick([12, 15, 16, 20, 24, 25, 30, 32, 40, 45, 50]), m = r.pick([1.2, 1.25, 1.4, 1.5, 1.6, 1.75, 1.8, 2.5]); return [b * m, b]; }, function (v) { return v[0] % 1 === 0 && !(v[0] === 60 && v[1] === 48); }, [18, 15]);
        var a = v[0], b = v[1], P = dS(a / b * 100), flip = dS(rnd(b / a * 100, 1)), dec = dS(rnd(a / b, 3));
        return mcPart(r, t(a) + ' is what percent of ' + t(b) + '?', [
          { html: t(flip + '\\%'), why: 'You divided the wrong way. The whole is ' + t(b) + ' (the number after “of”): ' + t(a + '\\div ' + b) + '.', code: 'flip' },
          { html: t(P + '\\%'), right: true },
          { html: t(a + '\\%'), why: t(a) + ' isn’t out of 100 here — it is out of ' + t(b) + '. Divide ' + t(a + '\\div ' + b) + ', then multiply by 100.', code: 'same' },
          { html: t(dec + '\\%'), why: t(a + '\\div ' + b + '=' + dec) + ' is the decimal. Multiply by 100 to get the percent.', code: 'nox100' }],
          'The whole is ' + t(b) + ' (after “of”): ' + t(a + '\\div ' + b + '=' + dS(a / b) + '=' + P + '\\%') + '. The part is bigger than the whole, so it is more than ' + t('100\\%') + '.', ['The whole is the number after “of”.'], a + ' of ' + b, true, 4);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.pick([2.5, 7.5, 1.5, 4.5, 3.5, 12.5, 6.5]), r.pick([84, 64, 48, 36, 72, 56, 44, 24, 92, 88, 60, 40])]; }, function (v) { var x = pctOf(v[0], v[1]); return near(x, rnd(x, 2)) && dS(x).length <= 4 && !(v[0] === 12.5 && v[1] === 96) && x > 0.5; }, [7.5, 84]);
        var p = PK.ofPart(v[0], v[1], { nr: true, prompt: '<b>Numerical response.</b> ' + t(pT(v[0]) + '\\text{ of }' + v[1]) + ' is ________.' }); p.text = 'NR ' + v[0] + '% of ' + v[1]; return p;
      } }] },
      { num: '18', stem: '', shared: function (r) { return { name: r.pick(['Ty', 'Kai', 'Mia', 'Jess', 'Arjun', 'Zoe']) }; }, parts: [{ id: '18', level: 'EMG', make: function (r, sh) {
        var v = find(function () { var b = r.int(30, 60); return [r.int(Math.ceil(b * 0.6), b - 2), b]; }, function (v) { var P = v[0] / v[1] * 100; return !near(P, rnd(P, 1)) && gcd(v[0], v[1]) === 1 && P < 100; }, [43, 52]);
        var p = whatPctPart(v[0], v[1], { nr: true, prompt: '<b>Numerical response.</b> ' + sh.name + ' answered ' + t(v[0]) + ' out of ' + t(v[1]) + ' questions correctly on a driver’s test practice quiz. The score, as a percent to the nearest tenth, is ________ %.' });
        p.text = 'NR score ' + v[0] + '/' + v[1]; return p;
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Write each percent as a decimal.', parts: [['a', 'two', 'LIM'], ['b', 'one', 'BEG'], ['c', 'half', 'EMG'], ['d', 'over', 'BEG'], ['e', 'sub1', 'EMG'], ['f', 'hund', 'LIM']].map(function (x) {
        return { id: 'e1' + x[0], level: x[2], make: function (r) { return p2dPart(r, x[1]); } }; }) },
      { num: '2', stem: 'Write each decimal or fraction as a percent.', parts: [['a', 'h2', 'LIM', 'd'], ['b', 'h1', 'BEG', 'd'], ['c', 'ov2', 'BEG', 'd'], ['d', 'th0', 'EMG', 'd'], ['e', 'f10', 'BEG', 'f'], ['f', 'f8', 'EMG', 'f']].map(function (x) {
        return { id: 'e2' + x[0], level: x[2], make: function (r) { return x[3] === 'd' ? d2pPart(r, x[1]) : f2pPart(r, x[1]); } }; }) },
      { num: '3', stem: function (sh) { return 'Without a calculator, find each percent of ' + t(M(sh.A)) + '.'; }, shared: function (r) { return { A: r.pick([24, 32, 36, 44, 48, 52, 56, 64, 72, 76, 88, 96, 28]) }; },
        parts: [['a', 10, 'LIM'], ['b', 5, 'BEG'], ['c', 15, 'BEG'], ['d', 1, 'BEG'], ['e', 25, 'BEG'], ['f', 30, 'BEG']].map(function (x) {
          return { id: 'e3' + x[0], level: x[2], make: function (r, sh) {
            var p = x[1], A = sh.A, v = pctOf(p, A);
            var part = PK.moneyPart(t(p + '\\%'), v, null, benchHow(p, A), ['Start with ' + t('10\\%') + ': move the decimal point 1 place left.', p === 5 ? t('5\\%') + ' is half of ' + t('10\\%') + '.' : p === 1 ? t('1\\%') + ': move the decimal point 2 places left.' : p === 25 ? t('25\\%') + ' is a quarter.' : p === 30 ? t('30\\%=3\\times 10\\%') : t('15\\%=10\\%+5\\%')], p + '% of ' + A, { before: t('=\\$') });
            part.check = benchChk(p, A, [10, 5, 15, 1, 25, 30, 20, 50]);
            part.bad = [m$(A / p), m$(p * A / 1000)].filter(function (s) { return !near(Number(s), v); });
            return part;
          } };
        }) },
      { num: '4', stem: 'Calculate.', parts: [['a', 'two', 'BEG'], ['b', 'two12', 'BEG'], ['c', 'over', 'EMG'], ['d', 'sub1', 'EMG']].map(function (x) {
        return { id: 'e4' + x[0], level: x[2], make: function (r) { var v = ofPick(r, x[1]); return PK.ofPart(v[0], v[1], { before: t('=') }); } }; }) },
      { num: '5', stem: 'Find each percent. Round to the nearest tenth of a percent if needed.', parts: [['a', 'quarter', 'BEG'], ['b', 'tenths', 'BEG'], ['c', 'over', 'EMG'], ['d', 'rep', 'EMG']].map(function (x) {
        return { id: 'e5' + x[0], level: x[2], make: function (r) { var v = pctPairs(r, x[1]); return whatPctPart(v[0], v[1]); } }; }) },
      { num: '6', section: 'B. Applying', stem: function (sh) { return sh.name + '’s phone plan has ' + t(sh.G) + ' GB of data each month. She has used ' + t(sh.p + '\\%') + ' of it.'; },
        shared: function (r) { return find(function () { return { G: r.pick([4, 5, 6, 8, 10, 12, 15, 20]), p: r.pick([35, 45, 55, 65, 75, 85, 90, 95, 60, 40]), name: r.pick(['Ella', 'Maya', 'Zoe', 'Leah', 'Ava']) }; }, function (s) { var u = pctOf(s.p, s.G); return near(u, rnd(u, 2)); }, { G: 8, p: 85, name: 'Ella' }); },
        parts: [
          { id: 'e6a', level: 'BEG', make: function (r, sh) { var p = PK.ofPart(sh.p, sh.G, { prompt: 'How many gigabytes has she used?', after: 'GB', noEstimate: true }); p.solution += ' GB'; return p; } },
          { id: 'e6b', level: 'BEG', make: function (r, sh) {
            var u = pctOf(sh.p, sh.G), L = rnd(sh.G - u, 4);
            var p = PK.part('How many gigabytes are left?', PK.num(L, null, function (v) { if (near(v, u)) return { code: 'u1l7-used', hint: 'That’s the data used. Subtract it from ' + t(sh.G) + ' GB.' }; if (near(v, 100 - sh.p)) return { code: 'u1l7-left-dollars', hint: t((100 - sh.p) + '\\%') + ' is left — find ' + t((100 - sh.p) + '\\%') + ' of ' + t(sh.G) + ' GB.' }; return null; }),
              dS(L), dS(L) + '\\text{ GB}', t(sh.G + '-' + dS(u) + '=' + dS(L)) + ' GB &nbsp; (or: ' + t((100 - sh.p) + '\\%') + ' of ' + t(sh.G) + ' ' + t('=' + dS((100 - sh.p) / 100) + '\\times ' + sh.G + '=' + dS(L)) + ' GB)', ['Subtract the data used from the plan.'], 'data left', { after: 'GB' });
            p.bad = [dS(u)];
            return p;
          } }] },
      { num: '7', stem: function (sh) { return 'A goalie stopped ' + t(sh.s1) + ' of ' + t(sh.t1) + ' shots in one game and ' + t(sh.s2) + ' of ' + t(sh.t2) + ' shots in the next game.'; },
        shared: function (r) { return find(function () { var t1 = r.int(24, 42), t2 = r.int(24, 42); return { t1: t1, t2: t2, s1: t1 - r.int(1, 5), s2: t2 - r.int(1, 5) }; }, function (s) { var a = s.s1 / s.t1, b = s.s2 / s.t2; return Math.abs(rnd(a * 100, 1) - rnd(b * 100, 1)) >= 0.5 && s.t1 !== s.t2; }, { t1: 37, t2: 30, s1: 34, s2: 28 }); },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) {
            var a = whatPctPart(sh.s1, sh.t1), b = whatPctPart(sh.s2, sh.t2);
            var p = PK.fields('Find the save percent for each game, to the nearest tenth.', [{ label: 'Game 1', after: '%', name: 'Game 1' }, { label: 'Game 2', after: '%', name: 'Game 2' }], [a.check, b.check], [a.key, b.key], 'Game 1 ' + t(a.key + '\\%') + ', Game 2 ' + t(b.key + '\\%'),
              'Game 1: ' + a.solution + '<br>Game 2: ' + b.solution, ['Save percent = saves ÷ shots × 100.'], 'save percents');
            p.bad = [[b.key, a.key]];
            return p;
          } },
          { id: 'e7b', level: 'BEG', make: function (r, sh) {
            var a = rnd(sh.s1 / sh.t1 * 100, 1), b = rnd(sh.s2 / sh.t2 * 100, 1), first = a > b, more2 = sh.s2 > sh.s1;
            return mcPart(r, 'In which game did the goalie do better?', [
              { html: 'Game 1', right: first, why: first ? null : 'Compare the save <b>percents</b> from (a): ' + t(dS(a) + '\\%') + ' and ' + t(dS(b) + '\\%') + '.', code: 'g1' },
              { html: 'Game 2', right: !first, why: !first ? null : 'Compare the save <b>percents</b> from (a): ' + t(dS(a) + '\\%') + ' and ' + t(dS(b) + '\\%') + '.', code: 'g2' }],
              'Game 1: ' + t(dS(a) + '\\%') + ', Game 2: ' + t(dS(b) + '\\%') + '. The goalie did better in <b>Game ' + (first ? 1 : 2) + '</b>' + ((first && more2) || (!first && !more2) ? ', even though there were more saves in the other game.' : '.'), ['Use the percents from (a), not the number of saves.'], 'better game', true, 2);
          } }] },
      { num: '8', stem: function (sh) { return sh.name + ' earns ' + t(M(sh.W)) + ' per hour at a ' + sh.job + '. He gets a ' + t(pT(sh.p)) + ' raise.'; },
        shared: function (r) { return find(function () { return { W: r.int(1525, 2290) / 100, p: r.pick([2.5, 3.5, 4.5, 3, 2, 4, 1.5, 5.5]), name: r.pick(['Desmond', 'Mason', 'Tyson', 'Noah', 'Diego']), job: r.pick(['hardware store', 'grocery store', 'lumber yard', 'car wash']) }; }, function (s) { var x = pctOf(s.p, s.W); return !near(x, r2(x)) && Math.round(s.W * 100) % 5 === 0; }, { W: 16.4, p: 3.5, name: 'Desmond', job: 'hardware store' }); },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) { var x = pctOf(sh.p, sh.W); var p = PK.ofPart(sh.p, sh.W, { money: true, prompt: 'How much more will he earn per hour?', after: 'per hour', noEstimate: true, extraDiag: function (v) { if (near(v, r2(sh.W + x))) return { code: 'u1l7-raise-new', hint: 'That’s the new wage. The question asks how much <b>more</b> (the raise).' }; return null; } }); p.text = 'raise'; return p; } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) {
            var x = pctOf(sh.p, sh.W), N = sh.W + x;
            var p = PK.moneyPart('What is his new hourly wage?', N, function (v) { if (near(v, r2(x))) return { code: 'u1l7-raise-only', hint: 'That’s the raise. Add it to his old wage.' }; if (near(v, r2(sh.W + sh.p))) return { code: 'pct-no-div', hint: 'Add the raise in dollars from (a), not ' + t(dS(sh.p)) + '.' }; return null; },
              t(M(sh.W) + '+\\$' + dS(rnd(x, 6)) + '=\\$' + dS(rnd(N, 6)) + '\\approx ' + M(N)) + ' per hour', ['New wage = old wage + raise.', 'Round to the cent at the end.'], 'new wage', { before: '$', after: 'per hour' });
            p.bad = [m$(x)];
            return p;
          } }] },
      { num: '9', stem: function (sh) { return 'A ' + t(sh.M) + ' kg bag of concrete mix is ' + t(sh.p + '\\%') + ' cement by mass.'; },
        shared: function (r) { return find(function () { return { M: r.pick([20, 25, 30, 40]), p: r.pick([12, 14, 15, 16, 18, 20]) }; }, function (s) { return !(s.M === 30 && s.p === 15) || r.chance(0.3); }, { M: 30, p: 15 }); },
        parts: [{ id: 'e9', level: 'BEG', make: function (r, sh) {
          var c = pctOf(sh.p, sh.M), n = rnd(sh.M - c, 4);
          var p = PK.fields('How many kilograms of cement are in the bag? How many kilograms are not cement?', [{ label: 'Cement', after: 'kg', name: 'Cement' }, { label: 'Not cement', after: 'kg', name: 'Not cement' }],
            [PK.num(c, null, PK.diagFrom(PK.ofMistakes(sh.p, sh.M))), PK.num(n, null, function (v) { if (near(v, c)) return { code: 'u1l7-used', hint: 'That’s the cement. Subtract it from the whole bag.' }; if (near(v, 100 - sh.p)) return { code: 'u1l7-left-dollars', hint: 'That’s a percent. Find the mass: ' + t(sh.M + '-' + dS(c)) + '.' }; return null; })],
            [dS(c), dS(n)], t(dS(c)) + ' kg of cement, ' + t(dS(n)) + ' kg not cement', t(dS(sh.p / 100) + '\\times ' + sh.M + '=' + dS(c)) + ' kg of cement<br>' + t(sh.M + '-' + dS(c) + '=' + dS(n)) + ' kg is not cement (sand and gravel)', ['“Of” means multiply: (percent as a decimal) × the mass.'], 'concrete');
          p.bad = [[dS(n), dS(c)]];
          return p;
        } }] },
      { num: '10', stem: function (sh) { return sh.name + '’s lunch bill is ' + t(M(sh.B)) + '. He can’t decide between a ' + t('15\\%') + ' tip and a ' + t('20\\%') + ' tip.'; },
        shared: function (r) { return find(function () { return { B: r.int(1505, 6995) / 100, name: r.pick(['Owen', 'Mason', 'Diego', 'Noah']) }; }, function (s) { return Math.round(s.B * 100) % 5 === 0 && !near(s.B, 47.6); }, { B: 38.6, name: 'Owen' }); },
        parts: [
          { id: 'e10a', level: 'BEG', make: function (r, sh) {
            var a = PK.ofPart(15, sh.B, { money: true }), b = PK.ofPart(20, sh.B, { money: true });
            var p = PK.fields('Find both tips.', [{ label: '15% tip', before: '$', name: '15% tip' }, { label: '20% tip', before: '$', name: '20% tip' }], [a.check, b.check], [a.key, b.key], t('15\\%') + ': ' + t(M(pctOf(15, sh.B))) + '; ' + t('20\\%') + ': ' + t(M(pctOf(20, sh.B))),
              t('15\\%') + ': ' + t('0.15\\times ' + M(sh.B) + PK.eqM(pctOf(15, sh.B))) + '<br>' + t('20\\%') + ': ' + t('0.20\\times ' + M(sh.B) + PK.eqM(pctOf(20, sh.B))), ['Change each percent to a decimal and multiply by the bill.'], 'two tips');
            p.bad = [[b.key, a.key]];
            return p;
          } },
          { id: 'e10b', level: 'EMG', make: function (r, sh) {
            var a = r2(pctOf(15, sh.B)), b = r2(pctOf(20, sh.B)), d = b - a, T = sh.B + b;
            var p = PK.fields('How much more is the ' + t('20\\%') + ' tip? What is the total with the ' + t('20\\%') + ' tip?', [{ label: 'How much more', before: '$', name: 'How much more' }, { label: 'Total', before: '$', name: 'Total' }],
              [either(PK.money(d, function (v) { if (near(v, b) || near(v, a)) return { code: 'u1l7-tip-only', hint: 'Subtract: the ' + t('20\\%') + ' tip minus the ' + t('15\\%') + ' tip.' }; if (near(v, r2(T))) return { code: 'u1l7-diff-total', hint: 'That’s the total. How much more is one tip than the other?' }; return null; }), PK.money(pctOf(5, sh.B))),
                PK.money(T, function (v) { if (near(v, r2(sh.B + a))) return { code: 'u1l7-total-15', hint: 'That’s the total with the ' + t('15\\%') + ' tip. Use the ' + t('20\\%') + ' tip.' }; if (near(v, b)) return { code: 'u1l7-tip-only', hint: 'That’s the tip. Add it to the bill.' }; return null; })],
              [m$(d), m$(T)], t(M(d)) + ' more; total ' + t(M(T)), t(M(b) + '-' + M(a) + '=' + M(d)) + ' more<br>Total: ' + t(M(sh.B) + '+' + M(b) + '=' + M(T)), ['Use your tips from (a).'], 'tip difference');
            p.bad = [[m$(d), m$(sh.B + a)]];
            return p;
          } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'BEG', make: function (r) {
        var P = r.pick([20, 30, 40, 60, 70, 80, 90]), f = red(P, 100);
        return mcPart(r, 'Which of these is <b>not</b> equal to ' + t(P + '\\%') + '?', [
          { html: t(dS(P / 100)), why: t(dS(P / 100) + '=' + P + '\\%') + ' (2 places right). Find the one that is <b>not</b> equal.', code: 'dec' },
          { html: t(fT(f)), why: t(f[0] + '\\div ' + f[1] + '=' + dS(P / 100) + '=' + P + '\\%') + '. Find the one that is not equal.', code: 'frac' },
          { html: t(dS(P / 1000)), right: true },
          { html: t('\\frac{' + P + '}{100}'), why: 'That is ' + t(P) + ' per hundred, which is exactly ' + t(P + '\\%') + '.', code: 'hund' }],
          t(dS(P / 1000) + '=' + dS(P / 10) + '\\%') + ', not ' + t(P + '\\%') + '. (' + t(dS(P / 100) + '=' + P + '\\%') + '; ' + t(fT(f) + '=' + f[0] + '\\div ' + f[1] + '=' + dS(P / 100)) + '; ' + t('\\frac{' + P + '}{100}') + ' is ' + t(P) + ' per hundred.)', ['Change each one to a percent.'], 'not equal ' + P, true, 4);
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'EMG', make: function (r) {
        var v = find(function () { var T = r.pick([240, 280, 320, 360, 400, 440, 480, 500, 600]); return [r.int(Math.ceil(T * 0.4), T - 10), T]; }, function (v) { var P = v[0] / v[1] * 100; return dS(rnd(P, 1)).length <= 4 && P < 100 && !(v[0] === 225 && v[1] === 360 && false); }, [225, 360]);
        var p = whatPctPart(v[0], v[1], { nr: true, prompt: '<b>Numerical response.</b> A school sold ' + t(v[0]) + ' of its ' + t(v[1]) + ' tickets for a concert. The percent of the tickets sold, to the nearest tenth, is ________ %.' });
        p.text = 'NR tickets'; return p;
      } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [{ id: 'e13', level: 'ADV', make: function (r) {
        var v = find(function () { return { p: r.pick([15, 20, 10, 15, 18]), B: r.int(18, 96) + r.pick([0, 0.5, 0.2, 0.4, 0.6, 0.8]), name: r.pick(['Lena', 'Hailey', 'Sara', 'Kiera']) }; }, function (s) { var tp = pctOf(s.p, s.B); return near(tp, r2(tp)) && !(s.p === 15 && near(s.B, 42)); }, { p: 15, B: 42, name: 'Lena' });
        var T = r2(pctOf(v.p, v.B)), fifth = v.p % 5 === 0 ? v.p / 5 : null;
        var p = PK.moneyPart(v.name + ' left a ' + t(v.p + '\\%') + ' tip of ' + t(M(T)) + '. What was her bill before the tip?', v.B, function (x) {
          if (near(x, r2(pctOf(v.p, T)))) return { code: 'u1l7-tip-of-tip', hint: 'That’s ' + t(v.p + '\\%') + ' of the tip. Work backwards: ' + t(M(T)) + ' is ' + t(v.p + '\\%') + ' of the bill, so the bill is ' + t(M(T) + '\\div ' + dS(v.p / 100)) + '.' };
          if (near(x, r2(T + pctOf(v.p, T)))) return { code: 'u1l7-tip-of-tip', hint: 'Work backwards: the tip is ' + t(v.p + '\\%') + ' of the bill, so divide the tip by ' + t(dS(v.p / 100)) + '.' };
          if (near(x, r2(T * v.p))) return { code: 'pct-no-div', hint: 'Divide the tip by the percent <b>as a decimal</b>, ' + t(dS(v.p / 100)) + '.' };
          if (near(x, r2(T / v.p))) return { code: 'pct-div', hint: 'That’s ' + t('1\\%') + ' of the bill. The bill is ' + t('100\\%') + ': multiply by ' + t('100') + '.' };
          return null;
        }, (fifth ? t(v.p + '\\%') + ' is ' + t(M(T)) + ', so ' + t('5\\%') + ' is ' + t(M(T) + '\\div ' + fifth + '=' + M(T / fifth)) + '.<br>' + t('100\\%=20\\times ' + M(T / fifth) + '=' + M(v.B)) + '.<br>Or: ' : '') + 'bill ' + t('=' + M(T) + '\\div ' + dS(v.p / 100) + '=' + M(v.B)) + '.<br>Check: ' + t(dS(v.p / 100) + '\\times ' + M(v.B) + '=' + M(T)) + ' ✓',
          ['The tip is ' + t(v.p + '\\%') + ' of the bill. What is ' + t('5\\%') + '? What is ' + t('100\\%') + '?', 'Or undo the multiplying: bill ' + t('=') + ' tip ' + t('\\div ' + dS(v.p / 100)) + '.'], 'bill from tip');
        p.bad = [m$(pctOf(v.p, T)), m$(T * v.p), m$(T / v.p)].filter(function (x) { return !near(Number(x), v.B); });
        return p;
      } }] },
      { num: '14', stem: '',
        shared: function (r) { return find(function () { var a = r.pick([10, 20, 30, 40, 60]), b = r.pick([25, 50, 75, 20, 80, 40]); return { a: a, b: b, c: r.pick([2, 4, 6, 8, 3]), d: r.pick([25, 50, 75]) }; }, function (s) { return s.a !== s.b && !(s.c === 4 && s.d === 75 && false); }, { a: 30, b: 50, c: 4, d: 75 }); },
        parts: [
          { id: 'e14a', level: 'BEG', make: function (r, sh) {
            var x = pctOf(sh.a, sh.b), y = pctOf(sh.b, sh.a);
            var p = PK.fields('Find ' + t(sh.a + '\\%') + ' of ' + t(sh.b) + ' and ' + t(sh.b + '\\%') + ' of ' + t(sh.a) + '.', [{ label: t(sh.a + '\\%\\text{ of }' + sh.b), name: sh.a + '% of ' + sh.b }, { label: t(sh.b + '\\%\\text{ of }' + sh.a), name: sh.b + '% of ' + sh.a }],
              [PK.num(x, null, PK.diagFrom(PK.ofMistakes(sh.a, sh.b))), PK.num(y, null, PK.diagFrom(PK.ofMistakes(sh.b, sh.a)))], [dS(x), dS(y)], t(dS(x)) + ' and ' + t(dS(y)),
              t(dS(sh.a / 100) + '\\times ' + sh.b + '=' + dS(x)) + ' and ' + t(dS(sh.b / 100) + '\\times ' + sh.a + '=' + dS(y)), ['Change each percent to a decimal and multiply.'], 'swap percents');
            p.bad = [[dS(sh.a * sh.b), dS(y)]];
            return p;
          } },
          { id: 'e14b', level: 'EMG', make: function (r, sh) {
            return mcPart(r, 'What do you notice?', [
              { html: 'They are equal. Both are ' + t(sh.a + '\\times ' + sh.b + '\\div 100') + ', so you can swap the percent and the number.', right: true },
              { html: 'They are equal only because ' + t(sh.a) + ' and ' + t(sh.b) + ' are both multiples of 10.', why: 'Try other numbers: ' + t('8\\%') + ' of ' + t('25') + ' and ' + t('25\\%') + ' of ' + t('8') + ' are both ' + t('2') + '. It always works.', code: 'tens' },
              { html: 'The bigger percent always gives the bigger answer.', why: 'Look at your answers to (a) again.', code: 'bigger' },
              { html: 'One answer is 100 times the other.', why: 'Compare your two answers to (a).', code: 'hundred' }],
              t(sh.a + '\\%\\text{ of }' + sh.b + '=' + sh.a + '\\times ' + sh.b + '\\div 100') + ' and ' + t(sh.b + '\\%\\text{ of }' + sh.a + '=' + sh.b + '\\times ' + sh.a + '\\div 100') + ': the same numbers multiplied, so they are equal. ' + t('x\\%') + ' of ' + t('y') + ' is always ' + t('y\\%') + ' of ' + t('x') + '.', ['Write each one as a multiplication.'], 'notice swap');
          } },
          { id: 'e14c', level: 'PRG', make: function (r, sh) {
            var ans = pctOf(sh.c, sh.d);
            var p = PK.part('Use what you noticed to find ' + t(sh.c + '\\%') + ' of ' + t(sh.d) + ' in your head.', PK.num(ans, null, PK.diagFrom(PK.ofMistakes(sh.c, sh.d))), dS(ans), dS(ans),
              t(sh.c + '\\%') + ' of ' + t(sh.d) + ' is the same as ' + t(sh.d + '\\%') + ' of ' + t(sh.c) + '. ' + t(sh.d + '\\%') + ' is ' + (sh.d === 50 ? 'half' : sh.d === 25 ? 'a quarter' : 'three quarters') + ', so the answer is ' + t(dS(ans)) + '.', ['Swap them: ' + t(sh.d + '\\%') + ' of ' + t(sh.c) + ' is easy.'], 'swap trick', { before: t('=') });
            return p;
          } }] },
      { num: '15', stem: '', parts: [{ id: 'e15', level: 'PRG', make: function (r) {
        var v = find(function () { return { u: r.pick([8, 9, 11, 12, 13, 14, 15, 16, 18]), T: r.pick([20, 15, 25, 10]), name: r.pick(['Kai', 'Mia', 'Arjun', 'Zoe', 'Jess']) }; }, function (s) { return !(s.u === 12 && s.T === 20) || r.chance(0.2); }, { u: 12, T: 20, name: 'Kai' });
        var n = 0, lev = 100, lines = []; while (lev >= v.T) { n++; lev -= v.u; lines.push(n + ' h: ' + t(lev + '\\%')); }
        var ex2 = (100 - v.T) / v.u;
        var p = PK.part(v.name + '’s phone is fully charged (' + t('100\\%') + '). Watching video uses ' + t(v.u + '\\%') + ' of the battery each hour. After how many full hours of video will the battery first be below ' + t(v.T + '\\%') + '?', PK.num(n, null, function (x) {
          if (x === n - 1) return { code: 'u1l7-off-by-one', hint: 'After ' + t(n - 1) + ' hours the battery is at ' + t((100 - (n - 1) * v.u) + '\\%') + ', which is not below ' + t(v.T + '\\%') + ' yet.' };
          if (x === n + 1) return { code: 'u1l7-off-by-one', hint: 'Check the hour before: after ' + t(n) + ' hours the battery is at ' + t((100 - n * v.u) + '\\%') + '.' };
          if (near(x, rnd(ex2, 2)) || near(x, rnd(ex2, 1))) return { code: 'round', hint: 'The question asks for <b>full hours</b>. Check the battery level after each whole hour.' };
          return null;
        }), String(n), n + '\\text{ hours}', 'Battery each hour: ' + lines.join(', ') + '.<br>The battery first drops below ' + t(v.T + '\\%') + ' after <b>' + n + ' hours</b>.' + (Number.isInteger(ex2) ? '' : ' (Or: ' + t((100 - v.T) + '\\div ' + v.u + '\\approx ' + dS(rnd(ex2, 2))) + ', so after ' + t(Math.floor(ex2)) + ' hours it is still at or above ' + t(v.T + '\\%') + '; after ' + t(n) + ' it is below.)'),
          ['Subtract ' + t(v.u + '\\%') + ' for each hour and write the battery level down.', '“Below ' + t(v.T + '\\%') + '” means less than ' + t(v.T + '\\%') + '.'], 'battery', { after: 'hours' });
        p.bad = [String(n - 1), String(n + 1)];
        return p;
      } }] }
    ]
  });
})(window);
