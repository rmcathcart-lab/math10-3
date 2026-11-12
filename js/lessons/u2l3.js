/* Math 10-3 · Unit 2 · Lesson 3 — Overtime: Time-and-a-Half and Double Time (N2)
 * Assignment 3 (u2_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u2_ep03.tex, A 1–5, B 6–11, C 12–14).
 * NEEDS js/lessons/u1l7.js loaded first: it uses the money / percent kit HW.pctKit (money checker with the rounding
 * nudges, fill-in tables).
 * Every part is a generator: the same kind of wage (whole dollars, even cents, cents that give a three-decimal overtime
 * rate), the same hours (whole, half and quarter hours, h and min), the same rule (time and a half, double time, double
 * time and a half, the employer's own start for overtime, the Alberta 8/44 rule) and the same steps as the booklet
 * item, with new numbers (the booklet's own numbers are among the possible values; the wages and timesheets of the
 * lesson's worked examples are left out). Calculator allowed.
 * Money to the cent ("$12.49", "12.49", "12.490"; 12.4 or 12.488 for 12.49 get a nudge, no try used; rounding the wrong
 * way is wrong with a hint). Hours as decimals (8.75); "30 min" typed as .30 is caught.
 * Recognised mistakes get their own hint: adding $1.50 instead of × 1.5, using only the extra half, time and a half and
 * double time mixed up, the overtime rate given without × hours, every hour paid at the base wage or at the overtime
 * rate, regular hours not reduced by the overtime hours, 8/44: only the daily or only the weekly rule, adding the two,
 * the smaller one, 40 h instead of 44 h, unpaid break not subtracted, minutes written as decimals, rounding the
 * overtime rate too early, the boss's two-weeks-together way, working backwards without subtracting the regular pay…
 * Conversions: the rate table, the "hours over 8" timesheets, the 24-h and a.m./p.m. timesheets and the 8/44 worker table
 * → the table input (given cells shown, blanks as boxes; the worker table as one one-row table per worker);
 * "explain each mistake", "how many overtime hours? explain", "what did Owen do wrong?", "advantage and disadvantage of
 * overtime" → multiple choice whose options are reasons (one right); "which job pays more? by how much?" and "which
 * pays more per hour?" → a word box (A/B, raise/overtime) + money boxes.
 *
 * Shared kit for later Unit 2 lessons: HW.u2ot (the 8/44 rule, gross-pay-with-overtime mistakes and solution lines,
 * money / hours / labelled-box builders, timesheet tables with times). Exported below; load this file before them.
 * Outcome N2. Levels: LIM BEG EMG PRG ADV MAS (MAS: Question 12(c) and Extra 13(b)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit;
  if (!PK || !PK.money) throw new Error('u2l3 needs HW.pctKit: load js/lessons/u1l7.js before js/lessons/u2l3.js');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, M = PK.M, near = PK.near, find = PK.find, eqM = PK.eqM;

  /* ================= numbers, money and hours ================= */
  function q(x) { return Math.round(x * 1e6) / 1e6; }
  function sum(a) { return q(a.reduce(function (s, x) { return s + x; }, 0)); }
  function hT(x) { return dS(q(x)); }                                                     // 8.75 → "8.75"
  function mT(x) { return near(x, r2(x)) ? M(x) : '\\$' + dS(rnd(x, 6)); }             // $34.125 kept, $27.00
  function eqX(x) { return '=' + mT(x); }
  function sol(lines) { return lines.filter(Boolean).join('<br>'); }
  function cents(r, lo, hi, step) { return q((lo * 100 + step * r.int(0, Math.floor((hi - lo) * 100 / step))) / 100); }   // a wage on a cents step
  function mlt(m) { return m === 1.5 ? 'time and a half' : m === 2 ? 'double time' : m === 2.5 ? 'double time and a half' : '× ' + m; }
  /* the lesson's worked-example wages (left out of every generator) */
  var EXW = [15, 18.5, 21.2, 27.8, 17.6, 22.75, 16.2, 28.6, 18, 16.5, 19.2];
  function okW(w) { return !EXW.some(function (x) { return near(x, w); }); }
  function wage(r, lo, hi, step) { return find(function () { return cents(r, lo, hi, step); }, okW, q(lo + 0.4)); }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'], ['Devon', 'm'], ['Rosa', 'f'],
    ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Sofia', 'f'], ['Kenji', 'm'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f'], ['Owen', 'm'], ['Grace', 'f'], ['Lena', 'f'], ['Ravi', 'm'], ['Nadia', 'f'], ['Kiera', 'f'], ['Sam', 'm'], ['Zoe', 'f'], ['Eli', 'm']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', He: p[1] === 'f' ? 'She' : 'He', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him', His: p[1] === 'f' ? 'Her' : 'His' }; }
  function people(r, k) { var out = []; while (out.length < k) out.push(person(r, out.map(function (p) { return p.n; }))); return out; }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  /* ---- diagnosis lists: [value, code, hint] (values equal to the answer are dropped) ---- */
  function clean(list, ans, dp) {
    dp = dp == null ? 2 : dp; var seen = [rnd(ans, dp)];
    return (list || []).filter(function (x) {
      if (!x || x[0] == null || !isFinite(x[0])) return false;
      var v = rnd(x[0], dp); if (seen.some(function (s) { return near(s, v); })) return false;
      seen.push(v); return true;
    });
  }
  function dg(list, dp) {
    return function (v) {
      for (var i = 0; i < list.length; i++) { var x = list[i][0]; if (near(v, x) || near(v, r2(x)) || (dp != null && near(v, rnd(x, dp)))) return { code: list[i][1], hint: list[i][2] }; }
      return null;
    };
  }
  var EARLY = 'Close! You rounded the overtime rate first. Keep all its decimals (or do it in one line: hours × 1.5 × wage) and round only the final answer.';
  /* money to the cent; o.early: values you get by rounding the overtime rate too soon */
  function money(ans, list, o) {
    o = o || {}; var L = clean(list, ans, 2), base = PK.money(ans, dg(L), { nr: o.nr });
    var E = (o.early || []).filter(function (e) { return !near(r2(e), r2(ans)); });
    if (!E.length) return base;
    return function (resp) {
      var a = PK.readV(resp);
      if (a.ok && a.dec <= 2) for (var i = 0; i < E.length; i++) if (near(a.v, r2(E[i]))) return wrong('u2l3-early-round', o.earlyHint || EARLY);
      return base(resp);
    };
  }
  /* a plain number (hours, pieces): exact, or rounded to dp places */
  function numc(ans, dp, list, o) { var L = clean(list, ans, dp == null ? 6 : dp); return PK.num(ans, dp == null ? null : dp, dg(L, dp), o); }
  function badOf(list, ans, dp, fmt) { return clean(list, ans, dp).slice(0, 4).map(function (x) { return fmt(x[0]); }); }
  /* one money box */
  function mPart(prompt, ans, list, solution, hints, text, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', before: o.nr ? undefined : '$', after: o.after, nr: !!o.nr }, check: money(ans, list, o), key: m$(ans), answer: t(M(ans)) + (o.after ? ' ' + o.after : ''), solution: solution, hints: hints || [], text: text };
    p.bad = badOf(list, ans, 2, m$).concat((o.early || []).filter(function (e) { return !near(r2(e), r2(ans)); }).map(m$));
    return p;
  }
  /* one number box (hours by default) */
  function nPart(prompt, ans, dp, list, solution, hints, text, o) {
    o = o || {}; var after = o.after === undefined ? 'h' : o.after, key = dp == null ? hT(ans) : rnd(ans, dp).toFixed(dp);
    var p = { prompt: prompt, input: { type: 'number', after: o.nr ? undefined : after, before: o.before, nr: !!o.nr }, check: o.chk || numc(ans, dp, list, { nr: o.nr }), key: key, answer: t(key) + (after && !o.nr ? ' ' + after : ''), solution: solution, hints: hints || [], text: text };
    p.bad = badOf(list, ans, dp == null ? 6 : dp, function (v) { return dp == null ? hT(v) : rnd(v, dp).toFixed(dp); });
    return p;
  }
  /* a word answer (A / B, raise / overtime, hourly / contract): opts = [{ words: [...], right, code, hint }] */
  function choose(opts, nudge) {
    function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '').replace(/^(the|job|option|choice|way)+/, ''); }
    return function (resp) {
      var s = norm(resp);
      if (!s) return form('empty', 'Type your answer first.');
      for (var i = 0; i < opts.length; i++) {
        var o = opts[i], hit = o.words.some(function (w) { return s === w || (s.length >= 3 && w.length >= 3 && (w.indexOf(s) === 0 || s.indexOf(w) === 0)); });
        if (hit) return o.right ? ok() : wrong(o.code || 'value', o.hint || null);
      }
      return form('u2l3-which', nudge || 'Type one of the choices.');
    };
  }
  /* labelled boxes. rows: [{ label, name, kind: 'money' | 'hours' | 'num' | 'pct' | 'text', ans, list, dp, early, opts, key, nudge, after, before, placeholder }] */
  function fPart(prompt, rows, solution, hints, text) {
    var fields = rows.map(function (x) {
      return { label: x.label, name: x.name || String(x.label).replace(/:$/, ''), before: x.before !== undefined ? x.before : x.kind === 'money' ? '$' : undefined,
        after: x.after !== undefined ? x.after : x.kind === 'hours' ? 'h' : x.kind === 'pct' ? '%' : undefined, mode: x.kind === 'text' ? 'text' : undefined, placeholder: x.placeholder };
    });
    var keyOf = function (x) { return x.kind === 'text' ? x.key : x.kind === 'money' ? m$(x.ans) : x.dp == null ? hT(x.ans) : rnd(x.ans, x.dp).toFixed(x.dp); };
    var chks = rows.map(function (x) {
      if (x.kind === 'text') return choose(x.opts, x.nudge);
      if (x.kind === 'money') return money(x.ans, x.list, { early: x.early });
      if (x.kind === 'pct') return PK.pct(x.ans, x.dp, dg(clean(x.list, x.ans, x.dp), x.dp));
      return numc(x.ans, x.dp, x.list);
    });
    var keys = rows.map(keyOf);
    var ansOf = function (x, i) { return x.kind === 'text' ? '<b>' + x.show + '</b>' : x.kind === 'money' ? t(M(x.ans)) + (x.after ? ' ' + x.after : '') : t(keys[i]) + (fields[i].after ? ' ' + fields[i].after : ''); };
    var p = PK.fields(prompt, fields, chks, keys, rows.map(function (x, i) { return String(x.label).replace(/:$/, '') + ': ' + ansOf(x, i); }).join(', '), solution, hints, text);
    p.bad = [];
    rows.forEach(function (x, i) {
      if (x.kind === 'text') { var w = (x.opts || []).filter(function (o) { return !o.right; })[0]; if (w) { var b = keys.slice(); b[i] = w.words[0]; p.bad.push(b); } return; }
      var L = clean(x.list, x.ans, x.kind === 'money' ? 2 : x.dp == null ? 6 : x.dp);
      if (L.length) { var b2 = keys.slice(); b2[i] = x.kind === 'money' ? m$(L[0][0]) : x.dp == null ? hT(L[0][0]) : rnd(L[0][0], x.dp).toFixed(x.dp); p.bad.push(b2); }
    });
    return p;
  }

  /* ================= overtime ================= */
  /* the Alberta 8/44 rule for a list of daily hours */
  function rule(days) {
    var daily = sum(days.map(function (d) { return Math.max(0, d - 8); })), total = sum(days), weekly = q(Math.max(0, total - 44)), ot = Math.max(daily, weekly);
    return { days: days, daily: daily, total: total, weekly: weekly, ot: ot, reg: q(total - ot) };
  }
  function rateSol(w, m) { var r = q(w * m); return 'overtime rate ' + t('=' + M(w) + '\\times ' + dS(m) + '=' + mT(r)) + '/h' + (near(r, r2(r)) ? '' : ' (keep all the decimals)'); }
  /* gross pay lines: regular pay, overtime pay, gross */
  function grossSol(w, reg, ot, m) {
    m = m || 1.5; var rp = q(reg * w), rate = q(w * m), op = q(ot * rate), g = q(rp + op);
    return ['regular pay ' + t('=' + hT(reg) + '\\times ' + M(w) + eqX(rp)), rateSol(w, m) + '; &nbsp;overtime pay ' + t('=' + hT(ot) + '\\times ' + mT(rate) + eqX(op)), 'gross ' + t('=' + mT(rp) + '+' + mT(op) + eqM(g))];
  }
  function grossOf(w, reg, ot, m) { return q(reg * w + ot * w * (m || 1.5)); }
  function earlyOf(w, reg, ot, m) { return [q(reg * w + ot * r2(w * (m || 1.5)))]; }
  /* gross pay mistakes when the regular and overtime hours are given */
  function grossBasic(w, reg, ot, m) {
    m = m || 1.5; var L = [];
    L.push([q((reg + ot) * w), 'u2l3-no-ot', 'That pays every hour at the base wage. The ' + hT(ot) + ' overtime hours get ' + mlt(m) + ': ' + t(M(w) + '\\times ' + dS(m)) + '.']);
    L.push([q((reg + ot) * w * m), 'u2l3-all-ot', 'Only the ' + hT(ot) + ' overtime hours get the overtime rate. The ' + hT(reg) + ' regular hours get the base wage.']);
    if (m === 1.5) L.push([q(reg * w + ot * (w + 1.5)), 'u2l3-plus-150', 'Time and a half means ' + t('\\times 1.5') + ', not ' + t('+\\$1.50') + ': the overtime rate is ' + t(M(w) + '\\times 1.5=' + mT(w * 1.5)) + '/h.']);
    if (m === 1.5) L.push([q(reg * w + ot * w * 0.5), 'u2l3-half-only', 'You used only the extra half. Time and a half is the whole wage plus half: ' + t(M(w) + '\\times 1.5') + '.']);
    L.push([q(reg * w + w * m), 'u2l3-rate-only', 'You added the overtime rate for one hour. Multiply it by the ' + hT(ot) + ' overtime hours.']);
    L.push([q(reg * w), 'u2l3-reg-only', 'That’s only the regular pay. Add the overtime pay.']);
    L.push([q(ot * w * m), 'u2l3-ot-only', 'That’s only the overtime pay. Add the regular pay.']);
    return L;
  }
  /* gross pay mistakes with the 8/44 rule (R = rule(days)) */
  function grossList(w, R, m) {
    m = m || 1.5; var L = [];
    if (!near(R.weekly, R.ot)) L.push([grossOf(w, R.total - R.weekly, R.weekly, m), 'u2l3-weekly-only', 'That uses only the weekly overtime (' + hT(R.weekly) + ' h). Find the daily overtime too (' + hT(R.daily) + ' h) and use the bigger.']);
    if (!near(R.daily, R.ot)) L.push([grossOf(w, R.total - R.daily, R.daily, m), 'u2l3-daily-only', 'That uses only the daily overtime (' + hT(R.daily) + ' h). The weekly overtime is ' + hT(R.weekly) + ' h, which is bigger. Use the bigger one.']);
    if (R.daily > 0 && R.weekly > 0) L.push([grossOf(w, R.total - R.daily - R.weekly, R.daily + R.weekly, m), 'u2l3-added-both', 'Don’t add the daily and weekly overtime: they count the same extra hours twice. Use only the bigger one.']);
    L.push([q(R.total * w + R.ot * w * m), 'u2l3-reg-not-reduced', 'The overtime hours are not also regular hours. Regular hours ' + t('=' + hT(R.total) + '-' + hT(R.ot) + '=' + hT(R.reg)) + ' h.']);
    if (R.total > 40) L.push([grossOf(w, 40, R.total - 40, m), 'u2l3-40', 'That starts overtime after 40 hours. Use the Alberta 8/44 rule: daily overtime (hours over 8 each day) or weekly overtime (hours over 44), the bigger.']);
    return L.concat(grossBasic(w, R.reg, R.ot, m));
  }
  /* overtime hours mistakes with the 8/44 rule */
  function otList(R) {
    var L = [];
    if (!near(R.weekly, R.ot)) L.push([R.weekly, 'u2l3-weekly-only', 'That’s only the weekly overtime. The daily overtime (hours over 8 each day) is bigger. Use the bigger one.']);
    if (!near(R.daily, R.ot)) L.push([R.daily, 'u2l3-daily-only', 'That’s only the daily overtime. Check the week too: ' + t(hT(R.total) + '-44') + '. Use the bigger one.']);
    if (R.daily > 0 && R.weekly > 0) L.push([R.daily + R.weekly, 'u2l3-added-both', 'Don’t add the daily and weekly overtime. Pick the bigger one.']);
    if (R.total > 40) L.push([q(R.total - 40), 'u2l3-40', 'Weekly overtime in Alberta starts after <b>44</b> hours, not 40.']);
    L.push([R.total, 'u2l3-total', 'That’s the total for the week. Overtime is only the extra hours.']);
    L.push([R.reg, 'u2l3-reg-for-ot', 'That’s the regular hours. Overtime is the extra hours.']);
    L.push([R.days.filter(function (d) { return d > 8; }).length, 'u2l3-count-days', 'Count the <b>hours</b> over 8 on each day, not the number of long days.']);
    return L;
  }
  function ruleSol(R, dayNames) {
    var over = R.days.map(function (d) { return Math.max(0, q(d - 8)); });
    var dl = 'daily overtime ' + t('=' + over.map(hT).join('+') + '=' + hT(R.daily)) + ' h';
    var wl = R.total > 44 ? 'total ' + t('=' + hT(R.total)) + ' h; &nbsp;weekly overtime ' + t('=' + hT(R.total) + '-44=' + hT(R.weekly)) + ' h' : 'total ' + t('=' + hT(R.total)) + ' h, which is not over 44, so weekly overtime ' + t('=0') + ' h';
    var big = 'overtime ' + t('=' + hT(R.ot)) + ' h (the bigger)' + '; &nbsp;regular ' + t('=' + hT(R.total) + '-' + hT(R.ot) + '=' + hT(R.reg)) + ' h';
    return [dl, wl, big];
  }
  /* the usual overtime-pay mistakes (h hours at m × w) */
  function otPayList(h, w, m) {
    var L = [[q(h * w), 'u2l3-no-mult', 'That’s ' + hT(h) + ' h at the base wage. Overtime hours are paid at the overtime rate: first find ' + t(M(w) + '\\times ' + dS(m)) + '.'],
      [q(w * m), 'u2l3-rate-only', 'That’s the overtime rate for one hour. Multiply it by the ' + hT(h) + ' hours.'],
      [q(h + w * m), 'u2l3-added-hours', 'Multiply the hours by the rate; don’t add them.']];
    if (m === 1.5) { L.push([q(h * (w + 1.5)), 'u2l3-plus-150', 'Time and a half means ' + t('\\times 1.5') + ', not ' + t('+\\$1.50') + '.']); L.push([q(h * w * 0.5), 'u2l3-half-only', 'That’s only the extra half. Time and a half is ' + t(M(w) + '\\times 1.5') + '.']); L.push([q(h * w * 2), 'u2l3-dt-for-th', 'That’s double time (' + t('\\times 2') + '). This is time and a half: ' + t('\\times 1.5') + '.']); L.push([q(h * w * 15), 'u2l3-x15', 'Time and a half is ' + t('\\times 1.5') + ', not ' + t('\\times 15') + '.']); }
    if (m === 2) { L.push([q(h * w * 1.5), 'u2l3-th-for-dt', 'That’s time and a half. Double time is ' + t('\\times 2') + '.']); L.push([q(h * (w + 2)), 'u2l3-plus-2', 'Double time means ' + t('\\times 2') + ', not ' + t('+\\$2') + '.']); }
    if (m === 2.5) { L.push([q(h * w * 2), 'u2l3-th-for-dt', 'That’s double time. Double time and a half is ' + t('\\times 2.5') + '.']); L.push([q(h * (w + 2.5)), 'u2l3-plus-2', t('\\times 2.5') + ', not ' + t('+\\$2.50') + '.']); }
    return L;
  }
  function otPayPart(prompt, h, w, m, text) {
    var rate = q(w * m), pay = q(h * rate);
    return mPart(prompt, pay, otPayList(h, w, m), sol([rateSol(w, m), 'pay ' + t('=' + hT(h) + '\\times ' + mT(rate) + eqM(pay))]),
      ['Overtime rate = base wage × ' + dS(m) + '.', 'Overtime pay = overtime hours × overtime rate. Round at the end.'], text || 'OT pay', { early: [q(h * r2(rate))] });
  }

  /* ================= timesheets ================= */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function f24(min) { return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }
  function f12(min) { var h = Math.floor(min / 60), m = min % 60; return ((h + 11) % 12 + 1) + ':' + pad(m) + (h < 12 ? ' a.m.' : ' p.m.'); }
  function brkT(b) { return b === 0 ? 'none' : b === 60 ? '1 h' : b + ' min'; }
  function hmT(min) { var h = Math.floor(min / 60), m = min % 60; return m ? h + ' h ' + m + ' min' : h + ' h'; }
  /* hours mistakes on one timesheet row */
  function shiftList(sh) {
    var span = (sh.e - sh.s) / 60, L = [], md = function (min) { var h = Math.floor(min / 60), m = min % 60; return m ? q(h + m / 100) : null; };
    if (sh.b) { L.push([q(span), 'u2l3-break', 'Subtract the unpaid break (' + brkT(sh.b) + ').']); L.push([q(span + sh.b / 60), 'u2l3-break', 'The unpaid break is <b>subtracted</b>, not added.']); }
    var a = md(Math.round(sh.h * 60)); if (a != null) L.push([a, 'u2l3-min-dec', 'Write the minutes as part of an hour: 15 min ' + t('=0.25') + ' h, 30 min ' + t('=0.5') + ' h, 45 min ' + t('=0.75') + ' h.']);
    var b2 = md(sh.e - sh.s); if (sh.b && b2 != null) L.push([b2, 'u2l3-min-dec', 'Write minutes as part of an hour (30 min ' + t('=0.5') + ' h), and subtract the unpaid break.']);
    return L;
  }
  function over8List(h) {
    return h > 8 ? [[h, 'u2l3-over8-hours', 'This column is only the hours <b>past 8</b>: ' + t(hT(h) + '-8') + '.'], [q(h - 8 + 0.5), 'value', null]].slice(0, 1)
      : [[q(8 - h), 'u2l3-over8-under', 'A day of 8 hours or less has no hours over 8. Type ' + t('0') + '.'], [h, 'u2l3-over8-under', 'A day of 8 hours or less has no hours over 8. Type ' + t('0') + '.']];
  }
  /* a timesheet table. sheet: { days: [h], names, times: [{s, e, b}] | null, fmt: f24 | f12 } */
  function sheetPart(prompt, sheet, text) {
    var R = rule(sheet.days), withT = !!sheet.times, n = sheet.days.length;
    var rows = sheet.names.slice(0, n).map(function (d) { return '\\text{' + d + '}'; }).concat(['\\textbf{Total}']);
    var cols = (withT ? ['\\text{Start}', '\\text{End}', '\\text{Unpaid break}', '\\text{Hours worked}'] : ['\\text{Hours}']).concat(['\\text{Hours over 8}']);
    var hc = withT ? 3 : 0, oc = hc + 1, blanks = [], cells = [], keyCells = [];
    sheet.days.forEach(function (h, i) {
      var row = [], krow = [];
      if (withT) { var sh = sheet.times[i]; row = ['\\text{' + sheet.fmt(sh.s) + '}', '\\text{' + sheet.fmt(sh.e) + '}', '\\text{' + brkT(sh.b) + '}', null]; krow = row.slice(0, 3).concat([hT(h)]);
        blanks.push({ where: 'cell', i: i, j: hc, name: sheet.names[i] + ' hours', chk: numc(h, null, shiftList({ s: sh.s, e: sh.e, b: sh.b, h: h })) }); }
      else { row = [hT(h)]; krow = [hT(h)]; }
      row.push(null); krow.push(hT(Math.max(0, q(h - 8))));
      blanks.push({ where: 'cell', i: i, j: oc, name: sheet.names[i] + ' over 8', chk: numc(Math.max(0, q(h - 8)), null, over8List(h)) });
      cells.push(row); keyCells.push(krow);
    });
    var tot = withT ? ['', '', '', null, null] : [null, null];
    cells.push(tot); keyCells.push(withT ? ['', '', '', hT(R.total), hT(R.daily)] : [hT(R.total), hT(R.daily)]);
    blanks.push({ where: 'cell', i: n, j: hc, name: 'Total hours', chk: numc(R.total, null, [[R.total - sheet.days[n - 1], 'u2l3-total', 'Add the hours for <b>every</b> day.']]) });
    blanks.push({ where: 'cell', i: n, j: oc, name: 'Total over 8', chk: numc(R.daily, null, [[R.weekly, 'u2l3-col-weekly', 'This total adds up the <b>hours over 8</b> column (the daily overtime), not total − 44.'], [R.days.filter(function (d) { return d > 8; }).length, 'u2l3-count-days', 'Add the hours over 8, don’t count the days.']]) });
    var lines = [];
    if (withT) sheet.days.forEach(function (h, i) { var sh = sheet.times[i]; lines.push(sheet.names[i] + ': ' + sheet.fmt(sh.s) + ' to ' + sheet.fmt(sh.e) + ' is ' + hmT(sh.e - sh.s) + (sh.b ? '; minus ' + brkT(sh.b) + ' ' + t('=' + hT(h)) + ' h' : ' ' + t('=' + hT(h)) + ' h') + (h > 8 ? '; over 8: ' + t(hT(h) + '-8=' + hT(h - 8)) : '')); });
    else lines.push('Hours over 8: ' + sheet.days.map(function (h, i) { return sheet.names[i].slice(0, 3) + ' ' + (h > 8 ? t(hT(h) + '-8=' + hT(h - 8)) : t('0')); }).join(', ') + '.');
    lines.push('Total hours ' + t('=' + sheet.days.map(hT).join('+') + '=' + hT(R.total)) + '; &nbsp;total over 8 ' + t('=' + hT(R.daily)));
    var p = PK.tablePart(prompt, { rows: rows, cols: cols, cells: cells, corner: '\\text{Day}', keys: 'pctkit-money', help: 'Tap a box, then type the hours as a decimal (e.g. 8.75). Type 0 for a day with no hours over 8.' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells }, sol(lines),
      withT ? ['Hours worked = time from start to end − the unpaid break. Write minutes as part of an hour (15 min = 0.25 h).', 'Hours over 8: subtract 8 from a long day; a day of 8 h or less gets 0.'] : ['Hours over 8: subtract 8 from each long day. A day of 8 h or less gets 0.', 'Then add each column for the totals.'], text || 'timesheet');
    return p;
  }
  /* days for a timesheet with times: hours, breaks and start times */
  function timesFor(r, days, o) {
    o = o || {};
    return days.map(function (h, i) {
      var b = o.breaks && o.breaks[i] != null ? o.breaks[i] : h <= 5 ? 0 : r.pick([30, 30, 30, 45, 60]);
      var s = o.starts && o.starts[i] != null ? o.starts[i] : r.pick(o.startPool || [360, 390, 420, 420, 420, 450, 480]);
      return { s: s, e: s + Math.round(h * 60) + b, b: b };
    });
  }

  HW.u2ot = { q: q, sum: sum, hT: hT, mT: mT, eqX: eqX, sol: sol, cents: cents, wage: wage, okW: okW, person: person, people: people, DAYS: DAYS, clean: clean, dg: dg, money: money, numc: numc,
    mPart: mPart, nPart: nPart, fPart: fPart, choose: choose, rule: rule, rateSol: rateSol, grossSol: grossSol, grossOf: grossOf, earlyOf: earlyOf, grossBasic: grossBasic, grossList: grossList,
    otList: otList, ruleSol: ruleSol, otPayList: otPayList, otPayPart: otPayPart, f24: f24, f12: f12, brkT: brkT, hmT: hmT, sheetPart: sheetPart, timesFor: timesFor, shiftList: shiftList };

  HW.addCodes({
    'u2l3-plus-150': 'Time and a half: added $1.50 instead of × 1.5', 'u2l3-plus-2': 'Double time: added dollars instead of multiplying', 'u2l3-half-only': 'Used only the extra half (× 0.5)',
    'u2l3-dt-for-th': 'Used double time for time and a half', 'u2l3-th-for-dt': 'Used the wrong overtime multiplier (too small)', 'u2l3-x15': '× 15 instead of × 1.5', 'u2l3-no-mult': 'Overtime hours paid at the base wage',
    'u2l3-rate-only': 'Gave or added the overtime rate, not rate × hours', 'u2l3-added-hours': 'Added the hours to the rate', 'u2l3-early-round': 'Rounded the overtime rate too early', 'u2l3-no-ot': 'Paid every hour at the base wage',
    'u2l3-all-ot': 'Paid every hour at the overtime rate', 'u2l3-reg-only': 'Gave the regular pay only', 'u2l3-ot-only': 'Gave the overtime pay only', 'u2l3-reg-not-reduced': 'Regular hours not reduced by the overtime hours',
    'u2l3-weekly-only': '8/44: used only the weekly overtime', 'u2l3-daily-only': '8/44: used only the daily overtime', 'u2l3-added-both': '8/44: added daily and weekly overtime', 'u2l3-40': 'Used 40 h instead of 44 h (or the wrong start for overtime)',
    'u2l3-total': 'Gave the total hours instead of the overtime', 'u2l3-reg-for-ot': 'Gave the regular hours instead of the overtime', 'u2l3-count-days': 'Counted the long days instead of the hours over 8', 'u2l3-col-weekly': 'Hours-over-8 total: used total − 44',
    'u2l3-break': 'Unpaid break not subtracted', 'u2l3-min-dec': 'Minutes written as decimal hours (30 min as 0.30)', 'u2l3-over8-hours': 'Hours over 8: wrote the day’s hours', 'u2l3-over8-under': 'Hours over 8: a short day should be 0',
    'u2l3-which': 'Word answer unreadable', 'u2l3-wrong-job': 'Picked the one that pays less', 'u2l3-company-rule': 'Used the Alberta rule instead of the employer’s rule', 'u2l3-wk-zero': 'Weekly overtime under 44 h is 0',
    'u2l3-diff-total': 'Gave a total instead of the difference', 'u2l3-loss-full': 'Lost hours counted at the full overtime rate', 'u2l3-boss-way': 'Used the boss’s (two weeks together) way', 'u2l3-base-rate': 'Working backwards: divided by the base wage',
    'u2l3-no-sub': 'Working backwards: didn’t subtract the regular pay', 'u2l3-dollars': 'Gave dollars instead of hours', 'u2l3-tier-count': 'Counted the hours in a pay tier wrong', 'u2l3-per-week': 'Compared weekly pay instead of pay per hour',
    'u2l3-hours-44': 'Divided by 44 h instead of all the hours worked', 'u2l3-week-pay': 'Gave the weekly pay instead of pay per hour', 'u2l3-weekly-missed': 'Missed the weekly overtime'
  });
  HW.addPartial({
    'u2l3-plus-150': 'n', 'u2l3-plus-2': 'n', 'u2l3-half-only': 'b', 'u2l3-dt-for-th': 'b', 'u2l3-th-for-dt': 'b', 'u2l3-x15': 'b', 'u2l3-no-mult': 'b', 'u2l3-rate-only': 'b', 'u2l3-added-hours': 'n', 'u2l3-early-round': 's',
    'u2l3-no-ot': 'n', 'u2l3-all-ot': 'n', 'u2l3-reg-only': 's', 'u2l3-ot-only': 's', 'u2l3-reg-not-reduced': 'b', 'u2l3-weekly-only': 'b', 'u2l3-daily-only': 'b', 'u2l3-added-both': 'b', 'u2l3-40': 'b', 'u2l3-total': 'n',
    'u2l3-reg-for-ot': 'n', 'u2l3-count-days': 'n', 'u2l3-col-weekly': 'b', 'u2l3-break': 's', 'u2l3-min-dec': 'b', 'u2l3-over8-hours': 'n', 'u2l3-over8-under': 's', 'u2l3-wrong-job': 'n', 'u2l3-company-rule': 'b', 'u2l3-wk-zero': 's',
    'u2l3-diff-total': 's', 'u2l3-loss-full': 'b', 'u2l3-boss-way': 'b', 'u2l3-base-rate': 'b', 'u2l3-no-sub': 'n', 'u2l3-dollars': 'b', 'u2l3-tier-count': 's', 'u2l3-per-week': 'b', 'u2l3-hours-44': 'b', 'u2l3-week-pay': 's', 'u2l3-weekly-missed': 'b'
  });

  /* ================= Lesson 3 generators ================= */
  /* rate table (Question 1): rows time and a half / double time, one column per wage */
  function rateTable(r, wages) {
    var cols = wages.map(function (w) { return M(w) + '\\text{/h}'; }), blanks = [];
    wages.forEach(function (w, j) {
      blanks.push({ where: 'cell', i: 0, j: j, name: M(w).replace('\\', '') + ' × 1.5', chk: money(q(w * 1.5), [[q(w + 1.5), 'u2l3-plus-150', 'Time and a half means ' + t('\\times 1.5') + ', not ' + t('+\\$1.50') + '.'], [q(w * 0.5), 'u2l3-half-only', 'That’s only the half. Add it to the wage (or multiply by ' + t('1.5') + ').'], [q(w * 2), 'u2l3-dt-for-th', 'That’s double time. This row is ' + t('\\times 1.5') + '.'], [q(w * 15), 'u2l3-x15', t('\\times 1.5') + ', not ' + t('\\times 15') + '.']]) });
      blanks.push({ where: 'cell', i: 1, j: j, name: M(w).replace('\\', '') + ' × 2', chk: money(q(w * 2), [[q(w * 1.5), 'u2l3-th-for-dt', 'That’s time and a half. This row is double time: ' + t('\\times 2') + '.'], [q(w + 2), 'u2l3-plus-2', 'Double time means ' + t('\\times 2') + ', not ' + t('+\\$2') + '.'], [q(w * 3), 'u2l3-plus-2', 'Double time is the wage ' + t('\\times 2') + '.']]) });
    });
    var rows = ['\\text{Time and a half}', '\\text{Double time}'];
    return PK.tablePart('Complete the table.', { rows: rows, cols: cols, cells: [wages.map(function () { return null; }), wages.map(function () { return null; })], corner: '\\text{Base wage}', keys: 'pctkit-money', help: 'Tap a box, then type the rate in dollars per hour (no $ needed).' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: [wages.map(function (w) { return m$(w * 1.5); }), wages.map(function (w) { return m$(w * 2); })] },
      sol(['Multiply each wage by 1.5, then by 2.', wages.map(function (w) { return t(M(w) + '\\times 1.5=' + M(w * 1.5)); }).join('; '), wages.map(function (w) { return t(M(w) + '\\times 2=' + M(w * 2)); }).join('; ')]),
      ['Time and a half = base wage × 1.5.', 'Double time = base wage × 2.'], 'rate table ' + wages.join(','));
  }
  function rateFields(w) {
    return fPart('Base wage ' + t(M(w)) + '/h', [
      { label: 'Time and a half:', name: 'Time and a half', kind: 'money', after: '/h', ans: q(w * 1.5), list: [[q(w + 1.5), 'u2l3-plus-150', 'Time and a half means ' + t('\\times 1.5') + ', not ' + t('+\\$1.50') + '.'], [q(w * 0.5), 'u2l3-half-only', 'That’s only the half. Time and a half is ' + t(M(w) + '\\times 1.5') + '.'], [q(w * 2), 'u2l3-dt-for-th', 'That’s double time. Time and a half is ' + t('\\times 1.5') + '.']] },
      { label: 'Double time:', name: 'Double time', kind: 'money', after: '/h', ans: q(w * 2), list: [[q(w * 1.5), 'u2l3-th-for-dt', 'That’s time and a half. Double time is ' + t('\\times 2') + '.'], [q(w + 2), 'u2l3-plus-2', 'Double time means ' + t('\\times 2') + ', not ' + t('+\\$2') + '.']] }],
      sol([t('\\times 1.5') + ': ' + t(M(w) + '\\times 1.5=' + M(w * 1.5)) + '/h', t('\\times 2') + ': ' + t(M(w) + '\\times 2=' + M(w * 2)) + '/h']), ['Time and a half = base wage × 1.5. Double time = base wage × 2.'], 'rates ' + w);
  }
  /* daily hours for an 8/44 timesheet */
  var HPOOL = [6, 6.5, 7, 7.5, 8, 8, 8, 8.25, 8.5, 8.75, 9, 9.25, 9.5, 10, 10.5, 11, 12];
  function sameDays(a, b) { return a.length === b.length && a.every(function (x, i) { return near(x, b[i]); }); }
  var EXDAYS = [[10, 8, 9.5, 7, 8], [8, 8, 8.5, 8, 8, 7.5], [10, 8, 10, 7.5, 8.75]];   // Maya, Ethan, Tomás
  function notEx(days) { return !EXDAYS.some(function (e) { return sameDays(e, days); }); }
  function daysGen(r, n, pool, test, fb) { return find(function () { var d = []; for (var i = 0; i < n; i++) d.push(r.pick(pool)); return d; }, function (d) { return notEx(d) && test(rule(d), d); }, fb); }
  function dayList(days) { return days.map(hT).join(', '); }
  function dayLine(days, names) { return days.map(function (h, i) { return (names || DAYS)[i] + ' ' + hT(h); }).join(', '); }
  /* the 8/44 MC: options are a number of overtime hours with its reason (one right) */
  function otMC(r, prompt, R, text, extraSol) {
    var both = 'daily overtime ' + hT(R.daily) + ' h, weekly overtime ' + hT(R.weekly) + ' h';
    var opts = [{ v: R.ot, html: t(hT(R.ot)) + ' h: ' + both + '; use the bigger one.', right: true }];
    var add = function (v, html, why, code) { if (opts.some(function (o) { return near(o.v, v); }) || v < 0) return; opts.push({ v: v, html: html, why: why, code: code }); };
    if (R.daily > 0 && R.weekly > 0) add(q(R.daily + R.weekly), t(hT(R.daily + R.weekly)) + ' h: ' + both + '; add them.', 'Don’t add them: they count the same extra hours twice. Use the bigger one.', 'added');
    if (R.weekly === 0) add(0, t('0') + ' h: the total, ' + hT(R.total) + ' h, is not over 44 h, so there is no overtime.', 'Check each day too: hours past 8 in a day are daily overtime, even when the week is under 44 h.', 'weekly-only');
    else add(R.weekly, t(hT(R.weekly)) + ' h: the week is over 44 h, so only the weekly overtime (' + t(hT(R.total) + '-44') + ') counts.', 'That’s only the weekly overtime. Work out the daily overtime too and use the bigger.', 'weekly-only');
    if (!near(R.daily, R.ot)) add(R.daily, t(hT(R.daily)) + ' h: only the hours over 8 on each day count.', 'That’s only the daily overtime. The weekly overtime is bigger.', 'daily-only');
    if (R.total > 40) add(q(R.total - 40), t(hT(R.total - 40)) + ' h: every hour over 40 in the week is overtime.', 'In Alberta, weekly overtime starts after 44 hours, not 40.', 'forty');
    add(R.days.filter(function (d) { return d > 8; }).length, t(R.days.filter(function (d) { return d > 8; }).length) + ' h: one hour for each day over 8.', 'Count the hours past 8 on each day, not the number of long days.', 'count');
    var o4 = opts.slice(0, 4);
    return K.P.mc(r, prompt, o4.map(function (o) { return { html: o.html, right: o.right, why: o.why, code: o.code }; }), sol(ruleSol(R).concat(extraSol || [])), ['Daily overtime: add the hours over 8 on each day.', 'Weekly overtime: total − 44 (0 if the total is 44 or less). Use the bigger one.'], text);
  }
  /* "which job pays more, and by how much" boxes */
  function whichRows(name1, name2, v1, v2, words1, words2, nudge, list) {
    var more = v1 > v2, d = q(Math.abs(r2(v1) - r2(v2)));
    return [{ label: 'Pays more:', name: 'Which', kind: 'text', placeholder: nudge.ph, key: more ? words1[0] : words2[0], show: more ? name1 : name2, nudge: nudge.text,
      opts: [{ words: words1, right: more, code: 'u2l3-wrong-job', hint: 'Compare the two weekly pays again: ' + name1 + ' ' + t(M(v1)) + ', ' + name2 + ' ' + t(M(v2)) + '.' }, { words: words2, right: !more, code: 'u2l3-wrong-job', hint: 'Compare the two pays again: ' + name1 + ' ' + t(M(v1)) + ', ' + name2 + ' ' + t(M(v2)) + '.' }] },
      { label: 'by', name: 'How much', kind: 'money', ans: d, list: (list || []).concat([[r2(v1), 'u2l3-diff-total', 'That’s one of the pays. Subtract to find the difference.'], [r2(v2), 'u2l3-diff-total', 'That’s one of the pays. Subtract to find the difference.']]) }];
  }

  HW.defineLesson({
    id: 'u2l3', unit: 2, num: '3', title: 'Overtime: Time-and-a-Half and Double Time', outcome: 'N2',
    blurb: 'Time-and-a-half and double-time rates, gross pay with overtime, and Alberta’s 8-hours-a-day / 44-hours-a-week rule on real timesheets.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1', level: 'BEG', make: function (r) {
        var w = find(function () { return [wage(r, 14, 16, 100), wage(r, 16.2, 19.8, 20), wage(r, 20.2, 25.8, 20), wage(r, 26, 36, 100), wage(r, 12, 14, 100)]; }, function (a) { return a.every(function (x, i) { return a.indexOf(x) === i; }); }, [14, 17.4, 20.6, 32, 13]);
        return rateTable(r, w);
      } }] },
      { num: '2', stem: 'Find the overtime pay.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var h = r.int(2, 6), w = wage(r, 14, 24, 100); return otPayPart(t(h) + ' h at time and a half; base wage ' + t(M(w)) + '/h', h, w, 1.5, 'OT ' + h + '@' + w); } },
        { id: '2b', level: 'EMG', make: function (r) { var h = r.pick([2.5, 3.5, 4.5, 5.5, 6.5, 7.5]), w = wage(r, 18, 25, 10); return otPayPart(t(hT(h)) + ' h at time and a half; base wage ' + t(M(w)) + '/h', h, w, 1.5, 'OT ' + h + '@' + w); } },
        { id: '2c', level: 'BEG', make: function (r) { var h = r.int(3, 8), w = wage(r, 16, 22, 25); return otPayPart(t(h) + ' h at double time; base wage ' + t(M(w)) + '/h', h, w, 2, 'DT ' + h + '@' + w); } },
        { id: '2d', level: 'EMG', make: function (r) { var h = r.pick([1.25, 2.25, 3.25, 1.75, 2.75, 3.75, 4.25]), w = wage(r, 20, 28, 20); return otPayPart(t(hT(h)) + ' h at time and a half; base wage ' + t(M(w)) + '/h', h, w, 1.5, 'OT ' + h + '@' + w); } }] },
      { num: '3', stem: function (sh) { return sh.p.n + ' works at a ' + sh.job + ' for ' + t(M(sh.w)) + '/h. Last week ' + sh.p.he + ' worked 40 regular hours and ' + hT(sh.h) + ' overtime hours at time and a half.'; },
        shared: function (r) { return { p: person(r), w: wage(r, 15, 19.8, 20), h: r.pick([1.5, 2.5, 3.5, 4.5, 5.5, 3, 4, 5]), job: r.pick(['grocery store', 'hardware store', 'pet store', 'pharmacy', 'bakery']) }; },
        parts: [
          { id: '3a', level: 'LIM', make: function (r, sh) { var rp = q(40 * sh.w); return mPart('Find ' + sh.p.his + ' regular pay.', rp, [[q((40 + sh.h) * sh.w), 'u2l3-reg-not-reduced', 'Regular pay is for the 40 regular hours only.'], [q(40 * sh.w * 1.5), 'u2l3-all-ot', 'Regular hours are paid at the base wage, not the overtime rate.']], t('40\\times ' + M(sh.w) + '=' + M(rp)), ['Regular pay = regular hours × base wage.'], 'reg pay'); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { return otPayPart('Find ' + sh.p.his + ' overtime pay.', sh.h, sh.w, 1.5, 'OT pay'); } },
          { id: '3c', level: 'BEG', make: function (r, sh) { var g = grossOf(sh.w, 40, sh.h); return mPart('Find ' + sh.p.his + ' gross pay.', g, grossBasic(sh.w, 40, sh.h), sol(grossSol(sh.w, 40, sh.h).concat([sh.p.n + '’s gross pay is ' + t(M(g)) + '.'])), ['Gross pay = regular pay + overtime pay.'], 'gross', { early: earlyOf(sh.w, 40, sh.h) }); } }] },
      { num: '4', stem: '', parts: [{ id: '4', level: 'EMG', make: function (r) {
        var v = find(function () { var T = r.pick([37.5, 37.5, 40, 35, 36]), H = q(T + r.pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6])); return { T: T, H: H, w: wage(r, 16.2, 21.8, 20), p: person(r), biz: r.pick(['A call centre', 'A bank', 'An insurance office', 'A daycare', 'A dental office']) }; }, function (s) { return s.H <= 44 && !(s.T === 40 && near(s.H, 46.5)); }, { T: 37.5, H: 42, w: 18.8, p: person(r), biz: 'A call centre' });
        var ot = q(v.H - v.T), g = grossOf(v.w, v.T, ot), L = [[q(v.H * v.w), 'u2l3-company-rule', 'This employer pays overtime after ' + hT(v.T) + ' hours, sooner than the Alberta rule. Use the employer’s rule: overtime ' + t('=' + hT(v.H) + '-' + hT(v.T)) + ' h.']];
        if (v.T !== 40 && v.H > 40) L.push([grossOf(v.w, 40, v.H - 40), 'u2l3-40', 'Overtime here starts after ' + hT(v.T) + ' hours, not 40.']);
        return mPart(v.biz + ' pays time and a half for every hour over ' + hT(v.T) + ' in a week. ' + v.p.n + ' earns ' + t(M(v.w)) + '/h. This week ' + v.p.he + ' worked ' + hT(v.H) + ' hours. Find ' + v.p.his + ' gross pay.', g, L.concat(grossBasic(v.w, v.T, ot)),
          sol(['overtime hours ' + t('=' + hT(v.H) + '-' + hT(v.T) + '=' + hT(ot)) + ' h'].concat(grossSol(v.w, v.T, ot))), ['Overtime hours = hours worked − ' + hT(v.T) + '.', 'Regular pay (' + hT(v.T) + ' h) + overtime pay.'], 'company OT', { early: earlyOf(v.w, v.T, ot) });
      } }] },
      { num: '5', stem: function (sh) {
          var ben = 40 * sh.w + sh.k * (sh.w + 1.5), ch = (40 + sh.k) * sh.w * 1.5;
          return sh.p.n + ' earns ' + t(M(sh.w)) + '/h. One week ' + sh.p.he + ' worked 40 regular hours and ' + sh.k + ' overtime hours at time and a half. Two friends found ' + sh.p.his + ' gross pay. Each made a mistake.' +
            '<table class="vtab"><tr><th>' + sh.f[0].n + '</th><th>' + sh.f[1].n + '</th></tr><tr><td style="text-align:left">overtime rate ' + t('=' + M(sh.w) + '+\\$1.50=' + M(sh.w + 1.5)) + '<br>' + t('40\\times ' + M(sh.w) + '+' + sh.k + '\\times ' + M(sh.w + 1.5) + '=' + M(ben)) + '</td><td>' + t((40 + sh.k) + '\\times ' + M(sh.w * 1.5) + '=' + M(ch)) + '</td></tr></table>';
        },
        shared: function (r) { var p = person(r), f = people(r, 3).filter(function (x) { return x.n !== p.n; }).slice(0, 2); return { p: p, f: f.length === 2 ? f : [{ n: 'Ben' }, { n: 'Chloe' }], w: find(function () { return 2 * r.int(8, 13); }, okW, 20), k: r.int(3, 7) }; },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { var R = sh.w * 1.5;
            return K.P.mc(r, 'What mistake did ' + sh.f[0].n + ' make?', [
              { html: 'The overtime rate is wrong: time and a half means ' + t('\\times 1.5') + ', not ' + t('+\\$1.50') + '. The rate is ' + t(M(R)) + '/h.', right: true },
              { html: 'The overtime should be paid at double time.', why: 'The question says time and a half.', code: 'dt' },
              { html: 'The 40 regular hours should be paid at the overtime rate.', why: 'Regular hours get the base wage, ' + t(M(sh.w)) + '/h. That part of the work is right.', code: 'reg' },
              { html: 'The regular pay was left out.', why: 'Look again: ' + t('40\\times ' + M(sh.w)) + ' is there.', code: 'left' }],
              'The rate should be ' + t(M(sh.w) + '\\times 1.5=' + M(R)) + '/h, not ' + t(M(sh.w) + '+\\$1.50=' + M(sh.w + 1.5)) + '/h.', ['What does “time and a half” mean?'], 'Ben mistake');
          } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var R = sh.w * 1.5;
            return K.P.mc(r, 'What mistake did ' + sh.f[1].n + ' make?', [
              { html: 'All ' + (40 + sh.k) + ' hours were paid at the overtime rate. Only the ' + sh.k + ' overtime hours get ' + t(M(R)) + '/h.', right: true },
              { html: 'The overtime rate is wrong.', why: t(M(sh.w) + '\\times 1.5=' + M(R)) + ', so that rate is right.', code: 'rate' },
              { html: 'The overtime hours were left out.', why: t((40 + sh.k)) + ' hours includes the ' + sh.k + ' overtime hours.', code: 'left' },
              { html: 'The overtime rate should be ' + t(M(sh.w) + '+\\$1.50') + '.', why: 'No — time and a half means ' + t('\\times 1.5') + '.', code: 'plus' }],
              'Only the ' + sh.k + ' overtime hours get ' + t(M(R)) + '/h; the 40 regular hours get ' + t(M(sh.w)) + '/h.', ['Which hours get the overtime rate?'], 'Chloe mistake');
          } },
          { id: '5c', level: 'BEG', make: function (r, sh) { var g = grossOf(sh.w, 40, sh.k), ben = q(40 * sh.w + sh.k * (sh.w + 1.5)), ch = q((40 + sh.k) * sh.w * 1.5);
            return mPart('Find the correct gross pay.', g, [[ben, 'u2l3-plus-150', 'That’s ' + sh.f[0].n + '’s answer. The overtime rate is ' + t(M(sh.w) + '\\times 1.5') + '.'], [ch, 'u2l3-all-ot', 'That’s ' + sh.f[1].n + '’s answer. Only the overtime hours get the overtime rate.']].concat(grossBasic(sh.w, 40, sh.k)),
              sol(['Correct: ' + t('40\\times ' + M(sh.w) + '=' + M(40 * sh.w)) + '; ' + t(sh.k + '\\times ' + M(sh.w * 1.5) + '=' + M(sh.k * sh.w * 1.5)), 'gross ' + t('=' + M(40 * sh.w) + '+' + M(sh.k * sh.w * 1.5) + '=' + M(g))]), ['Regular pay for 40 h + overtime pay at ' + t('\\times 1.5') + ' for the extra hours.'], 'Hannah gross'); } }] },
      { num: '6', stem: function (sh) { return sh.p.n + ' is a ' + sh.job + '. ' + sh.p.He + ' earns ' + t(M(sh.w)) + '/h. ' + sh.p.His + ' union agreement pays double time on general holidays. ' + sh.p.He + ' works ' + (sh.h === 8 ? 'an' : 'a') + ' ' + hT(sh.h) + ' h shift on ' + sh.day + '.'; },
        shared: function (r) { var p = person(r); p.His = p.his.charAt(0).toUpperCase() + p.his.slice(1); return find(function () { return { p: p, w: wage(r, 17, 28, 50), h: r.pick([8, 7.5, 10, 12, 6, 8]), day: r.pick(['Christmas Day', 'New Year’s Day', 'Canada Day', 'Labour Day', 'Thanksgiving Day', 'Family Day']), job: r.pick(['health care aide', 'bus driver', 'hotel cook', 'grocery clerk', 'security guard']) }; }, function (s) { return !(near(s.w, 16.2) && s.h === 7.5); }, { p: p, w: 23.5, h: 8, day: 'Christmas Day', job: 'health care aide' }); },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) { return otPayPart('How much does ' + sh.p.he + ' earn for the shift?', sh.h, sh.w, 2, 'holiday DT'); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { var dt = q(sh.h * sh.w * 2), reg = q(sh.h * sh.w);
            return mPart('How much more is that than a regular ' + hT(sh.h) + ' h shift?', reg, [[dt, 'u2l3-diff-total', 'That’s the holiday pay. Subtract the pay for a regular shift.'], [q(sh.h * sh.w * 0.5), 'u2l3-th-for-dt', 'The holiday pay is double time (' + t('\\times 2') + '), not time and a half.'], [q(sh.w * 2 - sh.w), 'u2l3-rate-only', 'That’s the extra per hour. Multiply by the ' + hT(sh.h) + ' hours.']],
              sol(['regular shift ' + t('=' + hT(sh.h) + '\\times ' + M(sh.w) + '=' + M(reg)), t(M(dt) + '-' + M(reg) + '=' + M(reg)) + ' more', '(Double time is twice the pay, so the extra is a whole regular shift’s pay.)']), ['Find the pay for a regular shift, then subtract.'], 'holiday more'); } }] },
      { num: '7', stem: '', parts: [{ id: '7', level: 'PRG', make: function (r) {
        var v = find(function () { return { p: person(r), w: wage(r, 26, 36, 50), a: r.int(3, 8), b: r.int(1, 4), job: r.pick(['on a drilling rig', 'on a pipeline crew', 'at a gas plant', 'on a road crew']) }; }, function (s) { return !(near(s.w, 28.6) && s.a === 4 && s.b === 3); }, { p: person(r), w: 31, a: 6, b: 2, job: 'on a drilling rig' });
        var g = q(44 * v.w + v.a * v.w * 1.5 + v.b * v.w * 2);
        var L = [[q(44 * v.w + (v.a + v.b) * v.w * 1.5), 'u2l3-th-for-dt', 'The ' + v.b + ' hours after 12 in a day are double time (' + t('\\times 2') + ').'], [q(44 * v.w + (v.a + v.b) * v.w * 2), 'u2l3-dt-for-th', 'Only the ' + v.b + ' hours are double time. The ' + v.a + ' hours are time and a half.'],
          [q(44 * v.w + v.a * v.w * 1.5), 'u2l3-ot-only', 'Add the double-time pay too.'], [q(44 * v.w + v.b * v.w * 2), 'u2l3-ot-only', 'Add the time-and-a-half pay too.'], [q((44 + v.a + v.b) * v.w), 'u2l3-no-ot', 'The extra hours get overtime rates.'], [q(v.a * v.w * 1.5 + v.b * v.w * 2), 'u2l3-ot-only', 'Add the regular pay (44 h) too.']];
        return mPart(v.p.n + ' works ' + v.job + ' for ' + t(M(v.w)) + '/h. ' + v.p.His + ' contract pays time and a half after 8 hours in a day and double time after 12 hours in a day. One week ' + v.p.he + ' had 44 regular hours, ' + v.a + ' hours at time and a half and ' + v.b + ' hours at double time. Find ' + v.p.his + ' gross pay.', g, L,
          sol(['regular: ' + t('44\\times ' + M(v.w) + '=' + M(44 * v.w)), 'time and a half: ' + t(M(v.w) + '\\times 1.5=' + M(v.w * 1.5)) + '; ' + t(v.a + '\\times ' + M(v.w * 1.5) + '=' + M(v.a * v.w * 1.5)), 'double time: ' + t(M(v.w) + '\\times 2=' + M(v.w * 2)) + '; ' + t(v.b + '\\times ' + M(v.w * 2) + '=' + M(v.b * v.w * 2)), 'gross ' + t('=' + M(44 * v.w) + '+' + M(v.a * v.w * 1.5) + '+' + M(v.b * v.w * 2) + '=' + M(g))]),
          ['Find three amounts: regular pay, time-and-a-half pay, double-time pay.', 'Then add them.'], 'rig gross');
      } }] },
      { num: '8', stem: function (sh) { return sh.p.n + ' works at a ' + sh.job + ' in ' + sh.city + ' for ' + t(M(sh.w)) + '/h. Use the Alberta 8/44 rule.'; },
        shared: function (r) { return { p: person(r), w: wage(r, 15.2, 19.8, 20), job: r.pick(['vet clinic', 'garden centre', 'car dealership', 'pizza place', 'print shop']), city: r.pick(['Okotoks', 'Airdrie', 'Cochrane', 'Red Deer', 'Lethbridge']),
          days: daysGen(r, 5, HPOOL, function (R) { return R.daily >= 2 && R.total >= 38 && R.total <= 46 && R.daily > R.weekly + 0.5; }, [9, 8, 11, 6.5, 8.75]) }; },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { return sheetPart('Complete the table.', { days: sh.days, names: DAYS }, 'Nadia table'); } },
          { id: '8b', level: 'EMG', make: function (r, sh) { return otMC(r, 'How many overtime hours did ' + sh.p.he + ' work? Choose the answer with the right reason.', rule(sh.days), 'Nadia OT'); } },
          { id: '8c', level: 'PRG', make: function (r, sh) { var R = rule(sh.days), g = grossOf(sh.w, R.reg, R.ot);
            return mPart('Find ' + sh.p.his + ' gross pay.', g, grossList(sh.w, R), sol(ruleSol(R).concat(grossSol(sh.w, R.reg, R.ot))), ['Overtime hours: the bigger of the daily and the weekly overtime. Regular hours = total − overtime.', 'Gross = regular hours × wage + overtime hours × (wage × 1.5).'], 'Nadia gross', { early: earlyOf(sh.w, R.reg, R.ot) }); } }] },
      { num: '9', stem: '', parts: [{ id: '9', level: 'EMG', make: function (r) {
        var v = find(function () { return { p: person(r), w: wage(r, 15.2, 17.8, 20), d: r.pick([8, 8, 7.5, 7]), n: r.pick([6, 6, 7]), job: r.pick(['a car wash', 'a movie theatre', 'a coffee shop', 'a farm supply store']) }; }, function (s) { return s.d * s.n > 44 && s.d * s.n <= 52; }, { p: person(r), w: 15.6, d: 8, n: 6, job: 'a car wash' });
        var days = []; for (var i = 0; i < v.n; i++) days.push(v.d);
        var R = rule(days), g = grossOf(v.w, R.reg, R.ot);
        return fPart(v.p.n + ' works at ' + v.job + ' for ' + t(M(v.w)) + '/h. One week ' + v.p.he + ' worked ' + hT(v.d) + ' hours a day for ' + v.n + ' days. Use the Alberta 8/44 rule to find ' + v.p.his + ' overtime hours and ' + v.p.his + ' gross pay.', [
          { label: 'Overtime hours:', name: 'Overtime hours', kind: 'hours', ans: R.ot, list: [[0, 'u2l3-weekly-missed', 'No day is over 8 h, so daily overtime is 0, but check the week: total − 44.']].concat(otList(R)) },
          { label: 'Gross pay:', name: 'Gross pay', kind: 'money', ans: g, list: grossList(v.w, R), early: earlyOf(v.w, R.reg, R.ot) }],
          sol(['No day is over 8 h, so daily overtime ' + t('=0') + '. Total ' + t('=' + v.n + '\\times ' + hT(v.d) + '=' + hT(R.total)) + ' h; weekly overtime ' + t('=' + hT(R.total) + '-44=' + hT(R.weekly)) + ' h.', 'Overtime ' + t('=' + hT(R.ot)) + ' h; regular ' + t('=' + hT(R.reg)) + ' h.'].concat(grossSol(v.w, R.reg, R.ot))),
          ['Short days can still add up to more than 44 hours in a week.', 'Regular hours = total − overtime hours.'], 'Ravi');
      } }] },
      { num: '10', stem: 'Use the Alberta 8/44 rule to complete the table for each worker.', parts: [
        { id: '10a', level: 'EMG', make: function (r) { return workerRow(r, 'a', function (R) { return R.daily > R.weekly && R.weekly > 0; }, 6); } },
        { id: '10b', level: 'EMG', make: function (r) { return workerRow(r, 'b', function (R, d) { return R.daily === 0 && R.weekly > 0; }, 6, [6, 6.5, 7, 7.5, 8, 7.5, 8]); } },
        { id: '10c', level: 'EMG', make: function (r) { return workerRow(r, 'c', function (R) { return R.weekly === 0 && R.daily >= 5 && R.total >= 36; }, r.pick([4, 4, 5]), [4, 5, 6, 10, 10.5, 11, 12, 12, 12]); } },
        { id: '10d', level: 'PRG', make: function (r) { return workerRow(r, 'd', function (R) { return R.daily > 0 && R.weekly > 0 && Math.abs(R.daily - R.weekly) >= 1; }, 6, [3, 4, 8, 8, 8.5, 9, 9, 9, 9.5, 10]); } }] },
      { num: '11', stem: function (sh) { return sh.p.n + ' is an apprentice carpenter. ' + sh.p.He + ' earns ' + t(M(sh.w)) + '/h. ' + sh.p.His + ' timesheet uses the 24-hour clock.'; },
        shared: function (r) {
          var p = person(r); p.His = p.his.charAt(0).toUpperCase() + p.his.slice(1);
          var days = find(function () { var d = []; for (var i = 0; i < 5; i++) d.push(r.pick([6.5, 7, 7.5, 8, 8, 8.5, 8.75, 9, 9.25, 9.5, 10, 10.5, 11])); d.push(r.pick([3, 3.5, 4, 4.5, 5])); return d; },
            function (d) { var R = rule(d); return R.total >= 44.5 && R.total <= 52 && R.daily > 0 && R.weekly > 0 && Math.abs(R.daily - R.weekly) >= 0.5; }, [9.5, 8, 10.5, 6.5, 9, 4]);
          return { p: p, w: wage(r, 16.2, 20.8, 20), days: days, times: timesFor(r, days, { breaks: [null, null, null, null, null, 0], starts: [null, null, null, null, null, r.pick([480, 540, 420])] }) };
        },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) { return sheetPart('Complete the timesheet.', { days: sh.days, names: DAYS, times: sh.times, fmt: f24 }, 'Kiera sheet'); } },
          { id: '11b', level: 'EMG', make: function (r, sh) { var R = rule(sh.days); return nPart('Use the Alberta 8/44 rule to find ' + sh.p.his + ' overtime hours.', R.ot, null, otList(R), sol(ruleSol(R)), ['Daily overtime = the total of the hours-over-8 column. Weekly overtime = total − 44.', 'Use the bigger one.'], 'Kiera OT'); } },
          { id: '11c', level: 'PRG', make: function (r, sh) { var R = rule(sh.days), g = grossOf(sh.w, R.reg, R.ot);
            return mPart('Find ' + sh.p.his + ' gross pay.', g, grossList(sh.w, R), sol(grossSol(sh.w, R.reg, R.ot).concat([sh.p.n + '’s gross pay is ' + t(M(g)) + '.'])), ['Regular hours = total − overtime hours.', 'Gross = regular pay + overtime pay.'], 'Kiera gross', { early: earlyOf(sh.w, R.reg, R.ot) }); } }] },
      { num: '12', stem: function (sh) { return sh.p.n + ' is paid every two weeks (biweekly) at ' + t(M(sh.w)) + '/h. In week 1 ' + sh.p.he + ' worked ' + hT(sh.a) + ' hours. In week 2 ' + sh.p.he + ' worked ' + hT(sh.b) + ' hours. No day was longer than 8 hours. In Alberta, weekly overtime is counted for each week on its own.'; },
        shared: function (r) { return find(function () { return { p: person(r), w: find(function () { return r.pick([16, 17, 18, 19, 20, 16.5, 17.5, 15.5, 19.5]); }, okW, 17), a: r.pick([45, 46, 47, 48, 49, 50, 46.5, 47.5]), b: r.pick([36, 38, 39, 40, 41, 42, 43, 42.5, 40.5]) }; }, function (s) { return s.a + s.b > 88 && s.a + s.b - 88 < s.a - 44; }, { p: person(r), w: 17, a: 48, b: 42 }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) { var o1 = q(sh.a - 44);
            return fPart('Find ' + sh.p.his + ' overtime hours in each week.', [
              { label: 'Week 1:', name: 'Week 1', kind: 'hours', ans: o1, list: [[q(sh.a - 40), 'u2l3-40', 'Weekly overtime in Alberta starts after 44 hours.'], [sh.a, 'u2l3-total', 'Overtime is only the hours over 44.']] },
              { label: 'Week 2:', name: 'Week 2', kind: 'hours', ans: 0, list: [[q(sh.b - 44), 'u2l3-wk-zero', 'Week 2 is under 44 hours, so its weekly overtime is 0.'], [q(44 - sh.b), 'u2l3-wk-zero', 'Week 2 is under 44 hours, so it has no overtime: type 0.'], [q(sh.b - 40), 'u2l3-40', 'Weekly overtime starts after 44 hours, not 40. Week 2 is under 44, so 0.']] }],
              sol(['Week 1: ' + t(hT(sh.a) + '-44=' + hT(o1)) + ' h. &nbsp;Week 2: ' + hT(sh.b) + ' is under 44, so ' + t('0') + ' h.', 'Total overtime ' + t('=' + hT(o1)) + ' h.']), ['Each week on its own: hours over 44.'], 'Jun OT'); } },
          { id: '12b', level: 'PRG', make: function (r, sh) { var o1 = q(sh.a - 44), reg = q(44 + sh.b), g = grossOf(sh.w, reg, o1), boss = q(sh.a + sh.b - 88);
            return mPart('Find ' + sh.p.his + ' gross pay for the two weeks.', g, [[grossOf(sh.w, sh.a + sh.b - boss, boss), 'u2l3-boss-way', 'That adds the two weeks first. In Alberta each week is counted on its own: week 1 has ' + hT(o1) + ' h of overtime.'], [q((sh.a + sh.b) * sh.w), 'u2l3-no-ot', 'Week 1 has ' + hT(o1) + ' overtime hours at time and a half.'], [grossOf(sh.w, 44, o1), 'u2l3-reg-only', 'That’s only week 1. Add the pay for week 2.'], [q(sh.a * sh.w + sh.b * sh.w + o1 * sh.w * 1.5), 'u2l3-reg-not-reduced', 'The overtime hours are not also regular hours: regular ' + t('=44+' + hT(sh.b)) + ' h.']].concat(grossBasic(sh.w, reg, o1)),
              sol(['regular hours ' + t('=44+' + hT(sh.b) + '=' + hT(reg)) + '; ' + t(hT(reg) + '\\times ' + M(sh.w) + '=' + mT(reg * sh.w)), 'overtime: ' + t(M(sh.w) + '\\times 1.5=' + mT(sh.w * 1.5)) + '; ' + t(hT(o1) + '\\times ' + mT(sh.w * 1.5) + '=' + mT(o1 * sh.w * 1.5)), 'gross ' + t('=' + mT(reg * sh.w) + '+' + mT(o1 * sh.w * 1.5) + eqM(g))]), ['Regular hours: 44 from week 1 plus all of week 2.', 'Overtime: the week 1 hours over 44.'], 'Jun gross', { early: earlyOf(sh.w, reg, o1) }); } },
          { id: '12c', level: 'MAS', make: function (r, sh) { var o1 = q(sh.a - 44), boss = q(sh.a + sh.b - 88), lost = q(o1 - boss), loss = q(lost * sh.w * 0.5), g = grossOf(sh.w, 44 + sh.b, o1), bg = grossOf(sh.w, sh.a + sh.b - boss, boss);
            return mPart(sh.p.His + ' boss added the two weeks first: ' + t(hT(sh.a + sh.b) + '-88=' + hT(boss)) + ' overtime ' + (boss === 1 ? 'hour' : 'hours') + '. How much would ' + sh.p.n + ' lose with the boss’s way?', loss, [[bg, 'u2l3-diff-total', 'That’s the pay with the boss’s way. Find the difference from the correct pay.'], [g, 'u2l3-diff-total', 'That’s the correct pay. Find the difference from the boss’s way.'],
              [q(lost * sh.w * 1.5), 'u2l3-loss-full', 'Those ' + hT(lost) + ' hours are still paid, just at the base wage. ' + sh.p.He + ' loses only the difference: ' + t(mT(sh.w * 1.5) + '-' + M(sh.w)) + ' per hour.'], [q(lost * sh.w), 'u2l3-loss-full', sh.p.He + ' still gets the base wage for those hours. ' + sh.p.He + ' loses only the extra half: ' + t(mT(sh.w * 1.5) + '-' + M(sh.w) + '=' + mT(sh.w * 0.5)) + ' per hour.'], [q(o1 * sh.w * 0.5), 'u2l3-boss-way', 'The boss’s way still pays ' + hT(boss) + ' h of overtime. Only ' + hT(lost) + ' hours move from overtime to regular.'], [q(boss * sh.w * 0.5), 'u2l3-boss-way', 'Compare the overtime hours: ' + hT(o1) + ' h (correct) and ' + hT(boss) + ' h (boss).']],
              sol(['The boss’s way moves ' + t(hT(o1) + '-' + hT(boss) + '=' + hT(lost)) + ' hours from overtime to regular.', 'Each of those hours pays ' + t(mT(sh.w * 1.5) + '-' + M(sh.w) + '=' + mT(sh.w * 0.5)) + ' less.', t(hT(lost) + '\\times ' + mT(sh.w * 0.5) + eqM(loss)) + '. ' + sh.p.n + ' would lose ' + t(M(loss)) + '.', '(Check: ' + t(M(g) + '-' + M(bg) + '=' + M(r2(g) - r2(bg))) + ')']), ['How many hours does the boss’s way move from overtime to regular?', 'Each of those hours loses the extra half of the wage.'], 'Jun loss'); } }] },
      { num: '13', stem: function (sh) { return 'Two jobs at a ' + sh.place + '. Job A pays ' + t(M(sh.a)) + '/h. It is ' + hT(sh.d) + ' hours a day, ' + sh.n + ' days a week, with Alberta overtime. Job B pays ' + t(M(sh.b)) + '/h for 40 hours a week (8 hours a day, 5 days).'; },
        shared: function (r) { return find(function () { var a = r.pick([18, 19, 20, 21, 22, 17, 20.5, 19.5]), dn = r.pick([[8, 6], [8, 6], [9, 5], [10, 5]]); return { place: r.pick(['lumber yard', 'warehouse', 'feed mill', 'recycling plant']), a: a, d: dn[0], n: dn[1], b: q(a + r.pick([1, 1.5, 2, 2.5, 3, 3.5, 4, 5])) }; },
          function (s) { var days = []; for (var i = 0; i < s.n; i++) days.push(s.d); var R = rule(days), A = grossOf(s.a, R.reg, R.ot), B = 40 * s.b; return okW(s.a) && Math.abs(A - B) >= 15; }, { place: 'lumber yard', a: 20, d: 8, n: 6, b: 22.5 }); },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) { var days = []; for (var i = 0; i < sh.n; i++) days.push(sh.d); var R = rule(days), A = grossOf(sh.a, R.reg, R.ot), B = q(40 * sh.b);
            return fPart('Which job pays more per week? By how much?', whichRows('Job A', 'Job B', A, B, ['a'], ['b'], { ph: 'A or B', text: 'Type A or B.' }, [[q(Math.abs(R.total * sh.a - B)), 'u2l3-no-ot', 'Job A has Alberta overtime: ' + hT(R.ot) + ' h at time and a half.'], [q(Math.abs(grossOf(sh.a, R.total - R.weekly, R.weekly) - B)), 'u2l3-weekly-only', 'For Job A, check the daily overtime too and use the bigger.']]),
              sol(['A: ' + hT(R.total) + ' h; daily overtime ' + t('=' + hT(R.daily)) + ' h, weekly ' + t('=' + hT(R.weekly)) + ' h, so overtime ' + t('=' + hT(R.ot)) + ' h.', t(hT(R.reg) + '\\times ' + M(sh.a) + '=' + M(R.reg * sh.a)) + '; ' + t(hT(R.ot) + '\\times ' + M(sh.a * 1.5) + '=' + M(R.ot * sh.a * 1.5)) + '; total ' + t(M(A)), 'B: ' + t('40\\times ' + M(sh.b) + '=' + M(B)), 'Job ' + (A > B ? 'A' : 'B') + ' pays ' + t(M(Math.abs(A - B))) + ' more per week.']), ['Find Job A’s weekly pay with the 8/44 rule, and Job B’s weekly pay.', 'Then subtract.'], 'two jobs'); } },
          { id: '13b', level: 'BEG', make: function (r, sh) {
            return K.P.mc(r, 'Which gives one advantage and one disadvantage of working a lot of overtime?', [
              { html: '<b>Advantage:</b> more money for each extra hour, so you reach a savings goal sooner. <b>Disadvantage:</b> less time for family, school or rest; being tired can make work less safe.', right: true },
              { html: '<b>Advantage:</b> overtime hours are paid at the base wage. <b>Disadvantage:</b> you earn less money.', why: 'Overtime hours are paid <b>more</b> than the base wage.', code: 'base' },
              { html: '<b>Advantage:</b> you get more time off. <b>Disadvantage:</b> overtime pays less per hour.', why: 'Overtime means less time off, and it pays more per hour.', code: 'backwards' },
              { html: '<b>Advantage:</b> you are less tired. <b>Disadvantage:</b> your pay goes down.', why: 'Long hours usually make you <b>more</b> tired, and the pay goes up.', code: 'tired' }],
              'Sample: Advantage: more money each hour of overtime. Disadvantage: less time for family, school or rest; being tired can make work less safe.', ['Think about money, and about time and safety.'], 'OT pros and cons'); } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'ADV', make: function (r) {
        var v = find(function () { var w = r.pick([16, 17, 19, 20, 21, 22, 23, 24, 16.5, 17.5]), k = r.pick([2, 3, 4, 5, 6, 2.5, 3.5, 4.5]); return { p: person(r), w: w, k: k, T: q(44 * w + k * w * 1.5) }; }, function (s) { return okW(s.w) && near(s.T, Math.round(s.T)) && (Math.round(s.T) % 10 === 0 || Math.round(s.T) % 25 === 0); }, { p: person(r), w: 20, k: 4, T: 1000 });
        var rp = q(44 * v.w), need = q(v.T - rp), rate = q(v.w * 1.5);
        return nPart(v.p.n + ' earns ' + t(M(v.w)) + '/h. Every week ' + v.p.he + ' works 44 regular hours. How many hours of overtime at time and a half must ' + v.p.he + ' work to earn ' + t(M(v.T)) + ' in a week?', v.k, null, [
          [q(need / v.w), 'u2l3-base-rate', 'Overtime hours are paid at the overtime rate, ' + t(M(v.w) + '\\times 1.5=' + M(rate)) + '/h. Divide by that.'], [q(v.T / rate), 'u2l3-no-sub', 'First take off the regular pay (' + t('44\\times ' + M(v.w)) + '). Only the rest comes from overtime.'], [need, 'u2l3-dollars', 'That’s the money still needed. Divide it by the overtime rate to get hours.'],
          [q((v.T - 40 * v.w) / rate), 'u2l3-40', v.p.He + ' works 44 regular hours, not 40.'], [q(need / (v.w + 1.5)), 'u2l3-plus-150', 'The overtime rate is ' + t(M(v.w) + '\\times 1.5') + ', not ' + t('+\\$1.50') + '.'], [q(v.T / v.w - 44), 'u2l3-base-rate', 'Overtime hours earn the overtime rate, not the base wage.']],
          sol(['regular pay ' + t('=44\\times ' + M(v.w) + '=' + M(rp)), 'still needed ' + t('=' + M(v.T) + '-' + M(rp) + '=' + M(need)), 'overtime rate ' + t('=' + M(rate)) + '/h; &nbsp;' + t(M(need) + '\\div ' + M(rate) + '=' + hT(v.k)) + ' h', 'Check: ' + t(M(rp) + '+' + hT(v.k) + '\\times ' + M(rate) + '=' + M(v.T)) + ' ✓']),
          ['Find the regular pay first. How much more is needed?', 'Divide the money still needed by the overtime rate.'], 'Sam hours');
      } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'LIM', make: function (r) {
        var w = wage(r, 14, 30, 50);
        return K.P.mc(r, 'A worker’s base wage is ' + t(M(w)) + '/h. The time-and-a-half rate is', [
          { html: t(M(w / 2)) + '/h', why: 'That’s only the half. Add it to the wage: ' + t(M(w) + '\\times 1.5') + '.', code: 'half' },
          { html: t(M(w + 1.5)) + '/h', why: 'Time and a half means ' + t('\\times 1.5') + ', not ' + t('+\\$1.50') + '.', code: 'plus' },
          { html: t(M(w * 1.5)) + '/h', right: true },
          { html: t(M(w * 2)) + '/h', why: 'That’s double time (' + t('\\times 2') + ').', code: 'dt' }], t(M(w) + '\\times 1.5=' + M(w * 1.5)) + '/h.', ['Time and a half = wage × 1.5.'], 'MC TH rate', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = r.pick([[9, 5], [9.5, 5], [10, 5], [9, 6], [8.5, 6], [10.5, 5]]), p = person(r), days = []; for (var i = 0; i < v[1]; i++) days.push(v[0]);
        var R = rule(days), opts = [{ html: t('0') + ' h', why: 'Each day is over 8 h, so there is daily overtime.', code: 'zero' }, { html: t(hT(R.weekly)) + ' h', right: R.weekly > R.daily, why: 'That’s only the weekly overtime. The daily overtime is bigger.', code: 'weekly' },
          { html: t(hT(R.daily)) + ' h', right: R.daily > R.weekly, why: 'That’s only the daily overtime. The weekly overtime is bigger.', code: 'daily' }, { html: t(hT(R.daily + R.weekly)) + ' h', why: 'Don’t add the two: use the bigger one.', code: 'added' }];
        return K.P.mc(r, p.n + ' works ' + hT(v[0]) + ' hours a day, ' + (v[1] === 5 ? 'Monday to Friday' : 'Monday to Saturday') + '. Under the Alberta 8/44 rule, how many overtime hours does ' + p.he + ' work?', opts,
          sol(['daily ' + t('=' + v[1] + '\\times ' + hT(v[0] - 8) + '=' + hT(R.daily)) + ' h; weekly ' + t('=' + hT(R.total) + '-44=' + hT(R.weekly)) + ' h; use the bigger, ' + hT(R.ot) + ' h.']), ['Work out both the daily and the weekly overtime.'], 'MC 8/44', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'PRG', make: function (r) {
        var days = daysGen(r, 6, [6, 7, 7.5, 8, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12], function (R) { return R.daily > 0 && R.weekly > 0 && Math.abs(R.daily - R.weekly) >= 0.5 && R.total <= 56; }, [11, 7, 10.5, 8, 9, 6]), R = rule(days);
        return nPart('<b>Numerical response.</b> A worker in Alberta works these hours: ' + dayLine(days) + '. Using the 8/44 rule, the number of overtime hours is ________.', R.ot, null, otList(R), sol(ruleSol(R)), ['Find the daily overtime and the weekly overtime.', 'The answer is the bigger one.'], 'NR 8/44', { nr: true });
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var v = find(function () { return { p: person(r), w: wage(r, 15.2, 22.8, 10), h: r.pick([3.5, 4.5, 5.5, 6.5, 7.5, 2.5]) }; }, function (s) { var x = s.h * s.w * 1.5; return Math.abs(x - Math.round(x)) > 0.08 && Math.abs(x - Math.round(x)) < 0.45; }, { p: person(r), w: 17.4, h: 5.5 });
        var x = q(v.h * v.w * 1.5), L = clean(otPayList(v.h, v.w, 1.5), Math.round(x), 0);
        return nPart('<b>Numerical response.</b> ' + v.p.n + ' earns ' + t(M(v.w)) + '/h. ' + v.p.He + ' works ' + hT(v.h) + ' hours of overtime at time and a half. ' + v.p.His + ' overtime pay, to the nearest dollar, is ' + t('\\$') + '________.', x, 0, L,
          sol(['rate ' + t('=' + M(v.w) + '\\times 1.5=' + mT(v.w * 1.5)) + '/h; &nbsp;' + t(hT(v.h) + '\\times ' + mT(v.w * 1.5) + '=' + mT(x) + '\\approx\\$' + Math.round(x))]), ['Overtime pay = hours × (wage × 1.5). Round to the nearest dollar.'], 'NR OT pay', { nr: true });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the time-and-a-half rate and the double-time rate.', parts: [
        { id: 'e1a', level: 'LIM', make: function (r) { return rateFields(wage(r, 14, 24, 100)); } },
        { id: 'e1b', level: 'BEG', make: function (r) { return rateFields(wage(r, 17.2, 22.8, 20)); } },
        { id: 'e1c', level: 'BEG', make: function (r) { return rateFields(find(function () { return wage(r, 22.5, 29.5, 50); }, function (w) { return w % 1 !== 0; }, 26.5)); } },
        { id: 'e1d', level: 'BEG', make: function (r) { return rateFields(wage(r, 13.2, 15.8, 20)); } }] },
      { num: '2', stem: 'Find the overtime pay.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var h = r.int(3, 8), w = wage(r, 14.2, 17.8, 20); return otPayPart(t(h) + ' h at time and a half; base wage ' + t(M(w)) + '/h', h, w, 1.5, 'OT ' + h); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var h = r.pick([1.25, 2.25, 3.25, 4.25, 2.75, 1.75]), w = wage(r, 16, 24, 100); return otPayPart(t(hT(h)) + ' h at time and a half; base wage ' + t(M(w)) + '/h', h, w, 1.5, 'OT ' + h); } },
        { id: 'e2c', level: 'BEG', make: function (r) { var h = r.int(3, 7), w = wage(r, 15.05, 19.95, 5); return otPayPart(t(h) + ' h at double time; base wage ' + t(M(w)) + '/h', h, w, 2, 'DT ' + h); } }] },
      { num: '3', stem: '', parts: [{ id: 'e3', level: 'BEG', make: function (r) {
        var p = person(r), w = wage(r, 17, 24, 50), k = r.int(4, 9), g = grossOf(w, 44, k);
        return mPart(p.n + ' drives a ' + r.pick(['delivery van', 'tow truck', 'school bus', 'forklift']) + ' for ' + t(M(w)) + '/h. Last week ' + p.he + ' worked 44 regular hours and ' + k + ' overtime hours at time and a half. Find ' + p.his + ' gross pay.', g, grossBasic(w, 44, k), sol(grossSol(w, 44, k)), ['Regular pay + overtime pay.'], 'Bianca', { early: earlyOf(w, 44, k) });
      } }] },
      { num: '4', stem: 'Use the Alberta 8/44 rule.', shared: function (r) { return { days: daysGen(r, 5, HPOOL, function (R) { return R.weekly > 0 && R.daily > R.weekly + 1 && R.total <= 47; }, [8.5, 12, 7, 9.25, 8]) }; },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) { return sheetPart('Complete the table.', { days: sh.days, names: DAYS }, 'e4 table'); } },
          { id: 'e4b', level: 'BEG', make: function (r, sh) { var R = rule(sh.days); return nPart('Find the weekly overtime.', R.weekly, null, [[R.daily, 'u2l3-daily-only', 'That’s the daily overtime. Weekly overtime is total − 44.'], [q(R.total - 40), 'u2l3-40', 'Weekly overtime starts after 44 hours, not 40.'], [R.total, 'u2l3-total', 'Subtract 44 from the total.']], t(hT(R.total) + '-44=' + hT(R.weekly)) + ' h', ['Weekly overtime = total hours − 44.'], 'e4 weekly'); } },
          { id: 'e4c', level: 'EMG', make: function (r, sh) { var R = rule(sh.days); return nPart('How many overtime hours are paid?', R.ot, null, otList(R), 'The bigger of ' + hT(R.daily) + ' h (daily) and ' + hT(R.weekly) + ' h (weekly): ' + t(hT(R.ot)) + ' h.', ['Use the bigger of the daily and the weekly overtime.'], 'e4 OT'); } }] },
      { num: '5', stem: '', parts: [{ id: 'e5', level: 'EMG', make: function (r) {
        var v = r.pick([[7, 7], [7.5, 7], [8, 6], [7.5, 6], [6.5, 7], [8, 7]]), p = person(r), days = []; for (var i = 0; i < v[1]; i++) days.push(v[0]); var R = rule(days);
        return nPart(p.n + ' works ' + hT(v[0]) + ' hours a day, every day of the week (' + v[1] + ' days). How many overtime hours does ' + p.he + ' work under the Alberta 8/44 rule?', R.ot, null, [[0, 'u2l3-weekly-missed', 'No day is over 8 h, so there is no daily overtime. But check the week: total − 44.']].concat(otList(R)),
          sol(['No day is over 8 h, so daily overtime ' + t('=0') + '. Total ' + t('=' + v[1] + '\\times ' + hT(v[0]) + '=' + hT(R.total)) + ' h; weekly overtime ' + t('=' + hT(R.total) + '-44=' + hT(R.weekly)) + ' h.', p.n + ' works ' + hT(R.ot) + ' overtime hours. Short days can still add up to weekly overtime.']), ['Check the daily rule and the weekly rule.'], 'Dev');
      } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'PRG', make: function (r) {
        var v = find(function () { var T = r.pick([40, 40, 37.5]), hh = r.int(41, 45), mm = r.pick([15, 30, 45, 45]); return { T: T, hh: hh, mm: mm, H: q(hh + mm / 60), w: wage(r, 16.2, 20.8, 20), p: person(r), biz: r.pick(['A daycare', 'A clinic', 'A bakery', 'A flower shop']) }; }, function (s) { return s.H > s.T && s.H - s.T <= 7; }, { T: 40, hh: 43, mm: 45, H: 43.75, w: 18.6, p: person(r), biz: 'A daycare' });
        var ot = q(v.H - v.T), g = grossOf(v.w, v.T, ot), md = q(v.hh + v.mm / 100);
        return mPart(v.biz + ' pays time and a half for every hour over ' + hT(v.T) + ' in a week. ' + v.p.n + ' earns ' + t(M(v.w)) + '/h. This week ' + v.p.he + ' worked ' + v.hh + ' h ' + v.mm + ' min. Find ' + v.p.his + ' gross pay.', g,
          [[grossOf(v.w, v.T, md - v.T), 'u2l3-min-dec', v.mm + ' min is ' + t(dS(v.mm / 60)) + ' h, not ' + t('0.' + v.mm) + ' h.'], [q(v.H * v.w), 'u2l3-company-rule', 'This employer pays overtime after ' + hT(v.T) + ' hours. Use the employer’s rule.']].concat(grossBasic(v.w, v.T, ot)),
          sol([v.mm + ' min ' + t('=' + dS(v.mm / 60)) + ' h, so ' + t(hT(v.H)) + ' h. &nbsp;Overtime ' + t('=' + hT(v.H) + '-' + hT(v.T) + '=' + hT(ot)) + ' h'].concat(grossSol(v.w, v.T, ot))), ['Change the minutes to part of an hour first (15 min = 0.25 h).', 'Regular pay + overtime pay; round at the end.'], 'Rosa', { early: earlyOf(v.w, v.T, ot) });
      } }] },
      { num: '7', stem: function (sh) { return sh.p.n + ' works in a ' + sh.job + ' for ' + t(M(sh.w)) + '/h. Complete ' + sh.p.his + ' timesheet, then use the Alberta 8/44 rule to find ' + sh.p.his + ' gross pay.'; },
        shared: function (r) {
          var days = daysGen(r, 5, [5.5, 6, 7, 7.5, 8, 8, 8.5, 9, 9.5, 10, 10.5], function (R) { return R.weekly === 0 && R.daily >= 1.5 && R.total >= 38; }, [10, 8, 10, 8, 5.5]);
          return { p: person(r), w: wage(r, 16.2, 19.8, 20), job: r.pick(['print shop', 'sign shop', 'bike shop', 'framing shop']), days: days, times: timesFor(r, days, { startPool: [420, 450, 480, 480, 510] }) };
        },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) { return sheetPart('Complete the timesheet.', { days: sh.days, names: DAYS, times: sh.times, fmt: f12 }, 'Ian sheet'); } },
          { id: 'e7b', level: 'PRG', make: function (r, sh) { var R = rule(sh.days), g = grossOf(sh.w, R.reg, R.ot);
            return mPart('Find ' + sh.p.his + ' gross pay.', g, grossList(sh.w, R), sol(ruleSol(R).concat(grossSol(sh.w, R.reg, R.ot))), ['Overtime: the bigger of the daily and the weekly overtime.', 'Regular hours = total − overtime.'], 'Ian gross', { early: earlyOf(sh.w, R.reg, R.ot) }); } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'EMG', make: function (r) {
        var p = person(r), w = wage(r, 17.2, 23.8, 20), h = r.pick([7.5, 8, 6, 7, 8.5]), day = r.pick(['Labour Day', 'Canada Day', 'Victoria Day', 'Heritage Day', 'Remembrance Day']);
        return otPayPart(p.n + '’s union agreement pays “double time and a half” (2.5 times ' + p.his + ' base wage) for work on a general holiday. ' + p.He + ' earns ' + t(M(w)) + '/h and works ' + hT(h) + ' hours on ' + day + '. How much does ' + p.he + ' earn that day?', h, w, 2.5, 'Talia');
      } }] },
      { num: '9', stem: function (sh) { var w = sh.w, days = []; for (var i = 0; i < 5; i++) days.push(sh.d); var R = rule(days), wk = q(R.total - 44);
          return sh.p.n + ' earns ' + t(M(w)) + '/h in Alberta. ' + sh.p.He + ' worked ' + hT(sh.d) + ' hours a day, Monday to Friday. ' + sh.p.He + ' worked out ' + sh.p.his + ' pay like this: overtime ' + t('=' + hT(R.total) + '-44=' + hT(wk)) + ' h, so pay ' + t('=44\\times ' + M(w) + '+' + hT(wk) + '\\times ' + M(w * 1.5) + '=' + M(grossOf(w, 44, wk))) + '.'; },
        shared: function (r) { var p = person(r); p.He = p.he.charAt(0).toUpperCase() + p.he.slice(1); return { p: p, w: find(function () { return r.pick([15, 16, 17, 19, 20, 16.4, 17.2]); }, okW, 16), d: r.pick([9.5, 10, 10, 10.5, 11]) }; },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) { var days = [sh.d, sh.d, sh.d, sh.d, sh.d], R = rule(days);
            return K.P.mc(r, 'What did ' + sh.p.n + ' do wrong?', [
              { html: sh.p.He + ' used only the weekly rule. The daily overtime is ' + t('5\\times ' + hT(sh.d - 8) + '=' + hT(R.daily)) + ' h, which is bigger, so ' + sh.p.he + ' should use ' + hT(R.daily) + ' h.', right: true },
              { html: sh.p.He + ' should have added the daily and weekly overtime.', why: 'No — the two count the same extra hours. Use the bigger one.', code: 'add' },
              { html: sh.p.He + ' should have used 40 hours instead of 44.', why: 'Alberta’s weekly overtime starts after 44 hours.', code: 'forty' },
              { html: 'The overtime rate should be double time.', why: 'The 8/44 rule pays time and a half.', code: 'dt' }], sol(ruleSol(R)), ['Did ' + sh.p.he + ' check the hours over 8 each day?'], 'Owen wrong'); } },
          { id: 'e9b', level: 'PRG', make: function (r, sh) { var days = [sh.d, sh.d, sh.d, sh.d, sh.d], R = rule(days), g = grossOf(sh.w, R.reg, R.ot), his = grossOf(sh.w, 44, R.weekly);
            return fPart('Find ' + sh.p.his + ' correct gross pay. How much more is it?', [{ label: 'Gross pay:', name: 'Gross pay', kind: 'money', ans: g, list: grossList(sh.w, R) }, { label: 'More by:', name: 'How much more', kind: 'money', ans: q(r2(g) - r2(his)), list: [[g, 'u2l3-diff-total', 'That’s the correct pay. Subtract ' + sh.p.his + ' answer, ' + t(M(his)) + '.']] }],
              sol(['regular ' + t('=' + hT(R.total) + '-' + hT(R.ot) + '=' + hT(R.reg)) + ' h; ' + t(hT(R.reg) + '\\times ' + M(sh.w) + '=' + mT(R.reg * sh.w)) + '; ' + t(hT(R.ot) + '\\times ' + mT(sh.w * 1.5) + '=' + mT(R.ot * sh.w * 1.5)) + '; gross ' + t(eqM(g).slice(1)), t(M(g) + '-' + M(his) + '=' + M(r2(g) - r2(his))) + ' more.']), ['Use ' + hT(R.daily) + ' h of overtime.', 'Then subtract ' + sh.p.his + ' answer.'], 'Owen correct'); } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'BEG', make: function (r) {
        var w = find(function () { return r.pick([18, 20, 22, 24, 21, 23, 19]); }, okW, 22), k = r.int(2, 6), g = grossOf(w, 44, k);
        return K.P.mc(r, 'A worker earns ' + t(M(w)) + '/h. One week she has 44 regular hours and ' + k + ' overtime hours at time and a half. Her gross pay is', [
          { html: t(M(44 * w + w * 1.5)), why: 'That adds only one hour of overtime. Multiply the overtime rate by ' + k + '.', code: 'one' },
          { html: t(M((44 + k) * w)), why: 'That pays all the hours at ' + t(M(w)) + '. The overtime hours get ' + t(M(w * 1.5)) + '.', code: 'base' },
          { html: t(M(g)), right: true },
          { html: t(M((44 + k) * w * 1.5)), why: 'That pays all the hours at the overtime rate.', code: 'all' }], t('44\\times ' + M(w) + '=' + M(44 * w)) + '; ' + t(k + '\\times ' + M(w * 1.5) + '=' + M(k * w * 1.5)) + '; ' + t(M(44 * w) + '+' + M(k * w * 1.5) + '=' + M(g)) + '.', ['Regular pay + overtime pay.'], 'MC gross', true);
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return { p: person(r), w: wage(r, 15.3, 22.9, 10), h: r.pick([3.5, 4.5, 5.5, 6.5, 7.5, 2.5]) }; }, function (s) { var x = s.h * s.w * 1.5; return Math.abs(x - Math.round(x)) > 0.08 && Math.abs(x - Math.round(x)) < 0.45; }, { p: person(r), w: 18.9, h: 6.5 });
        var x = q(v.h * v.w * 1.5);
        return nPart('<b>Numerical response.</b> ' + v.p.n + ' earns ' + t(M(v.w)) + '/h. ' + v.p.He + ' works ' + hT(v.h) + ' hours of overtime at time and a half. ' + v.p.His + ' overtime pay, to the nearest dollar, is ' + t('\\$') + '________.', x, 0, clean(otPayList(v.h, v.w, 1.5), Math.round(x), 0),
          'rate ' + t('=' + M(v.w) + '\\times 1.5=' + mT(v.w * 1.5)) + '/h; &nbsp;' + t(hT(v.h) + '\\times ' + mT(v.w * 1.5) + '=' + mT(x) + '\\approx\\$' + Math.round(x)), ['Hours × (wage × 1.5), then round to the nearest dollar.'], 'NR Kofi', { nr: true });
      } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'ADV', make: function (r) {
        var v = find(function () { var w = r.pick([16, 17, 19, 20, 21, 22, 24, 15.5, 16.5]), k = r.pick([3, 4, 5, 6, 7, 2.5, 3.5]); return { p: person(r), w: w, k: k, G: q(44 * w + k * w * 1.5) }; }, function (s) { return okW(s.w) && near(s.G, r2(s.G)) && !(s.w === 20 && s.k === 4); }, { p: person(r), w: 20, k: 5, G: 1030 });
        var rp = q(44 * v.w), op = q(v.G - rp), rate = q(v.w * 1.5);
        return nPart(v.p.n + ' earns ' + t(M(v.w)) + '/h. One week ' + v.p.he + ' worked 44 regular hours plus some overtime at time and a half. ' + v.p.His + ' gross pay was ' + t(M(v.G)) + '. How many overtime hours did ' + v.p.he + ' work?', v.k, null, [
          [q(op / v.w), 'u2l3-base-rate', 'The overtime pay was earned at ' + t(M(rate)) + '/h. Divide by that.'], [q(v.G / rate), 'u2l3-no-sub', 'Take off the regular pay first.'], [op, 'u2l3-dollars', 'That’s the overtime pay in dollars. Divide by the overtime rate.'], [q(v.G / v.w - 44), 'u2l3-base-rate', 'Overtime hours earn the overtime rate, not the base wage.']],
          sol(['regular pay ' + t('=44\\times ' + M(v.w) + '=' + M(rp)), 'overtime pay ' + t('=' + M(v.G) + '-' + M(rp) + '=' + M(op)) + '; overtime rate ' + t('=' + M(rate)) + '/h', t(M(op) + '\\div ' + M(rate) + '=' + hT(v.k)) + ' h. &nbsp;Check: ' + t(M(rp) + '+' + hT(v.k) + '\\times ' + M(rate) + '=' + M(v.G)) + ' ✓']), ['How much of the pay came from overtime?', 'Divide that by the overtime rate.'], 'Lucia');
      } }] },
      { num: '13', stem: function (sh) { return sh.p.n + ' earns ' + t(M(sh.w)) + '/h and works 44 hours a week. ' + sh.p.His + ' boss offers ' + sh.p.him + ' a choice: a raise of ' + t(M(sh.raise)) + '/h, or ' + sh.k + ' extra hours of overtime every week at time and a half (and no raise).'; },
        shared: function (r) { return find(function () { var p = person(r); p.His = p.his.charAt(0).toUpperCase() + p.his.slice(1); return { p: p, w: r.pick([16, 17, 19, 20, 21, 22, 16.5, 17.5]), raise: r.pick([0.75, 1, 1, 1.25, 1.5]), k: r.pick([2, 3, 3, 4]) }; },
          function (s) { var A = 44 * (s.w + s.raise), B = 44 * s.w + s.k * s.w * 1.5, pa = s.w + s.raise, pb = B / (44 + s.k); return okW(s.w) && Math.abs(A - B) >= 5 && Math.abs(pa - pb) >= 0.1; }, { p: person(r), w: 17, raise: 1, k: 3 }); },
        parts: [
          { id: 'e13a', level: 'PRG', make: function (r, sh) { var A = q(44 * (sh.w + sh.raise)), B = grossOf(sh.w, 44, sh.k);
            return fPart('Find ' + sh.p.his + ' weekly gross pay for each choice.', [{ label: 'Raise:', name: 'Raise', kind: 'money', ans: A, list: [[q(44 * sh.w + sh.raise), 'u2l3-rate-only', 'The raise is for every hour: ' + t('44\\times ' + M(sh.w + sh.raise)) + '.'], [q(44 * sh.raise), 'u2l3-diff-total', 'That’s only the extra from the raise. Find the whole weekly pay.']] },
              { label: 'Overtime:', name: 'Overtime', kind: 'money', ans: B, list: grossBasic(sh.w, 44, sh.k) }],
              sol(['Raise: ' + t('44\\times ' + M(sh.w + sh.raise) + '=' + M(A)), 'Overtime: ' + t('44\\times ' + M(sh.w) + '+' + sh.k + '\\times ' + M(sh.w * 1.5) + '=' + M(44 * sh.w) + '+' + M(sh.k * sh.w * 1.5) + '=' + M(B))]), ['Raise: 44 h at the new wage.', 'Overtime: 44 h at the old wage plus the overtime hours at time and a half.'], 'Wes pay'); } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) { var A = q(44 * (sh.w + sh.raise)), B = grossOf(sh.w, 44, sh.k), pa = q(A / 44), pb = q(B / (44 + sh.k)), raiseWins = pa > pb;
            return fPart('Which choice pays more for <b>each hour</b> ' + sh.p.he + ' works? Find the pay per hour worked for each choice (to the nearest cent).', [
              { label: 'Raise:', name: 'Raise per hour', kind: 'money', after: '/h', ans: pa, list: [[A, 'u2l3-week-pay', 'That’s the weekly pay. Divide by the hours worked (44).']] },
              { label: 'Overtime:', name: 'Overtime per hour', kind: 'money', after: '/h', ans: pb, list: [[q(B / 44), 'u2l3-hours-44', 'With this choice ' + sh.p.he + ' works ' + (44 + sh.k) + ' hours, not 44. Divide by ' + (44 + sh.k) + '.'], [B, 'u2l3-week-pay', 'That’s the weekly pay. Divide by the hours he works.'], [q(sh.w * 1.5), 'u2l3-rate-only', 'That’s the overtime rate. Most of the hours are still at ' + t(M(sh.w)) + '. Divide the weekly pay by all the hours.']] },
              { label: 'More per hour:', name: 'Which', kind: 'text', placeholder: 'raise or overtime', key: raiseWins ? 'raise' : 'overtime', show: raiseWins ? 'the raise' : 'the overtime', nudge: 'Type raise or overtime.',
                opts: [{ words: ['raise', 'theraise'], right: raiseWins, code: 'u2l3-per-week', hint: 'Compare the pay <b>per hour worked</b>, not per week.' }, { words: ['overtime', 'ot', 'extrahours', 'hours'], right: !raiseWins, code: 'u2l3-per-week', hint: 'Compare the pay <b>per hour worked</b>, not per week.' }] }],
              sol(['Raise: ' + t(M(A) + '\\div 44' + eqM(pa)) + '/h', 'Overtime: ' + t(M(B) + '\\div ' + (44 + sh.k) + eqM(pb)) + '/h', 'The ' + (raiseWins ? 'raise' : 'overtime') + ' pays more for each hour worked.' + (B > A ? ' The overtime choice pays ' + t(M(B - A)) + ' more a week, but ' + (raiseWins ? 'the raise also leaves ' + sh.p.him + ' ' + sh.k + ' hours of free time.' : 'it also takes ' + sh.k + ' more hours.') : ' The raise also pays ' + t(M(A - B)) + ' more a week.')]),
              ['Pay per hour worked = weekly pay ÷ the hours worked that week.', 'With the overtime choice ' + sh.p.he + ' works ' + (44 + sh.k) + ' hours.'], 'Wes per hour'); } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'ADV', make: function (r) {
        var v = find(function () { return { p: person(r), w: wage(r, 22, 30, 50), H: r.pick([13, 13.5, 14, 14.5, 15, 16]) }; }, function (s) { return !(near(s.w, 24) && s.H === 14); }, { p: person(r), w: 26, H: 14 });
        var w = v.w, H = v.H, dt = q(H - 12), pay = q(8 * w + 4 * w * 1.5 + dt * w * 2);
        return mPart('A pipeline contract pays ' + t(M(w)) + '/h, time and a half for hours 9 to 12 in a day, and double time for every hour after 12. ' + v.p.n + ' works a ' + hT(H) + '-hour day. Find ' + v.p.his + ' pay for the day.', pay, [
          [q(8 * w + 3 * w * 1.5 + dt * w * 2), 'u2l3-tier-count', 'Hours 9 to 12 are hours 9, 10, 11 and 12: that’s <b>4</b> hours at time and a half.'], [q(8 * w + 3 * w * 1.5 + (H - 11) * w * 2), 'u2l3-tier-count', 'Hours 9 to 12 are 4 hours (9, 10, 11, 12). Double time starts after hour 12.'],
          [q(8 * w + (H - 8) * w * 1.5), 'u2l3-th-for-dt', 'The hours after 12 are double time.'], [q(8 * w + (H - 8) * w * 2), 'u2l3-dt-for-th', 'Only the hours after 12 are double time. Hours 9 to 12 are time and a half.'], [q(H * w), 'u2l3-no-ot', 'The hours after 8 get overtime rates.'], [q(12 * w + dt * w * 2), 'u2l3-ot-only', 'Hours 9 to 12 get time and a half, not the base wage.']],
          sol(['first 8 h: ' + t('8\\times ' + M(w) + '=' + M(8 * w)), 'hours 9 to 12 (4 h): ' + t('4\\times ' + M(w * 1.5) + '=' + M(4 * w * 1.5)), 'after 12 (' + hT(dt) + ' h): ' + t(hT(dt) + '\\times ' + M(w * 2) + '=' + M(dt * w * 2)), 'total ' + t('=' + M(8 * w) + '+' + M(4 * w * 1.5) + '+' + M(dt * w * 2) + '=' + M(pay))]), ['Split the day: the first 8 hours, hours 9 to 12, and the hours after 12.', 'Hours 9 to 12 is 4 hours.'], 'pipeline');
      } }] }
    ]
  });

  /* one worker's row of the 8/44 table (Question 10) */
  function workerRow(r, letter, test, n, pool) {
    var p = person(r), days = daysGen(r, n, pool || [4, 6, 8, 8, 9, 9.5, 10, 10, 11, 12], test, null);
    if (!days) days = { a: [10, 10, 9, 8, 6, 4], b: [7.5, 7.5, 7.5, 7.5, 7.5, 7.5], c: [12, 12, 12, 4], d: [9, 9, 9, 9, 9, 3] }[letter];
    var R = rule(days), cols = ['\\text{Total}', '\\text{Daily OT}', '\\text{Weekly OT}', '\\text{Overtime}', '\\text{Regular}'];
    var vals = [R.total, R.daily, R.weekly, R.ot, R.reg], names = ['Total hours', 'Daily overtime', 'Weekly overtime', 'Overtime hours', 'Regular hours'];
    var lists = [[], [[R.days.filter(function (d) { return d > 8; }).length, 'u2l3-count-days', 'Add the hours over 8 on each day, don’t count the days.'], [R.weekly, 'u2l3-col-weekly', 'Daily overtime is the hours over 8 on each day, added up.']],
      [[q(R.total - 40), 'u2l3-40', 'Weekly overtime starts after 44 hours, not 40.'], [q(R.total - 44), 'u2l3-wk-zero', 'The total is not over 44 h, so weekly overtime is 0.'], [q(44 - R.total), 'u2l3-wk-zero', 'The total is not over 44 h, so weekly overtime is 0.'], [R.daily, 'u2l3-daily-only', 'Weekly overtime is total − 44 (0 if the total is 44 or less).']],
      [[q(R.daily + R.weekly), 'u2l3-added-both', 'Don’t add the two. Use the bigger one.'], [Math.min(R.daily, R.weekly), 'u2l3-weekly-only', 'Use the <b>bigger</b> of the daily and the weekly overtime.']],
      [[R.total, 'u2l3-reg-not-reduced', 'Regular hours = total − overtime hours.'], [44, 'u2l3-reg-not-reduced', 'Regular hours = total − overtime hours (not always 44).'], [q(R.total - R.daily - R.weekly), 'u2l3-added-both', 'Take away only the overtime hours (the bigger of the two).'], [q(R.total - Math.min(R.daily, R.weekly)), 'u2l3-weekly-only', 'Take away the overtime hours: the bigger of the two.']]];
    var blanks = vals.map(function (v, j) { return { where: 'cell', i: 0, j: j, name: names[j], chk: numc(v, null, lists[j]) }; });
    var rows = ['\\text{' + p.n + '}'];
    return PK.tablePart('<b>' + p.n + '</b> worked these hours: ' + dayList(days) + '.<br><span class="small muted">Total = total hours; Daily OT = daily overtime; Weekly OT = weekly overtime; Overtime = overtime hours paid; Regular = regular hours.</span>', { rows: rows, cols: cols, cells: [[null, null, null, null, null]], corner: '\\text{Worker}', keys: 'pctkit-money', help: 'Tap a box, then type the hours. Type 0 if there are none.' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: [vals.map(hT)] }, sol(ruleSol(R)), ['Daily overtime: hours over 8 each day, added. Weekly overtime: total − 44 (or 0).', 'Overtime hours = the bigger one. Regular hours = total − overtime hours.'], 'worker ' + letter);
  }
})(window);
