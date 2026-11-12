/* Math 10-3 · Unit 2 · Lesson 1 — Time Math: Hours, Minutes and Timesheets (REV: refresher)
 * Assignment 1 (u2_l01.tex, Questions 1–19) and the Lesson 1 Extra Practice (u2_ep01.tex: A Skills 1–6, B Applying 7–13,
 * C Stretch 14–16). Every part is a generator: the same kind of time (benchmark minutes, minutes that give a repeating
 * decimal, more than 60 min, a time across noon or midnight, a split shift…) as the booklet item, new numbers around the
 * booklet's (the booklet's own numbers are among the possible values; the lesson's worked-example numbers are left out).
 * Calculator allowed.
 * Answers: decimal hours to 2 decimal places (7.5 and 7.50 both right; 5.833 gets a "round" nudge; rounding the wrong way
 * is wrong, with a hint); hours-and-minutes answers in two boxes (h, min), and "8 h 80 min" gets a "regroup" nudge that
 * doesn't use a try; clock times typed with the clock keypad (digits, ":", a.m., p.m.): 24-hour as "07:20" (a one-digit
 * hour or a missing colon gets a nudge), 12-hour with a.m./p.m.; mixed numbers and improper fractions with the fraction
 * keypad (an improper fraction where a mixed number is asked, or an unsimplified fraction, gets a nudge).
 * Recognised mistakes get their own hint: the digits after the decimal point read as minutes (7.30 h = 7 h 30 min),
 * dividing by 100 instead of 60, the whole hours left out, the minutes total given as hours, adding or subtracting clock
 * times like decimals (an hour of 100 min), not carrying or borrowing the hour, subtracting the smaller minutes from the
 * larger, a p.m. time without + 12, 12:xx a.m. written 12:xx, 24:15 instead of 00:15, counting backwards across
 * midnight, only half of a split shift, the unpaid break not taken off.
 * Conversions: fill-in tables (minutes → fraction/decimal, 12-hour ↔ 24-hour clocks, the weekly timesheet) → the table
 * input (draw2.js areabox) with the given cells shown and the blanks as boxes, split into shorter tables where the booklet
 * table is long; "what mistake did he make?" → multiple choice of explanations (and boxes for the correct answer);
 * "which schedule and by how much / give a reason" → multiple choice; numerical-response items → NR boxes.
 *
 * Shared kit for later Unit 2 lessons: HW.u2pay (time part; js/lessons/u2l2.js adds the pay part). See the comment
 * at "HW.u2pay" below. Uses HW.pctKit (u1l7.js). Outcome REV (refresher). Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit;
  if (!PK) throw new Error('u2l1.js needs HW.pctKit from js/lessons/u1l7.js');
  var rnd = PK.rnd, dS = PK.dS, near = PK.near, gcd = PK.gcd, red = PK.red, find = PK.find;

  /* ================= keypads ================= */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var DEL = { label: '⌫', fn: 'del', title: 'Delete' }, CLR = { label: 'clear', fn: 'clear' }, LF = { label: '◀', fn: 'left', title: 'Move left' },
      RT = { label: '▶', fn: 'right', title: 'Move right' }, ENT = { label: 'Check ↵', fn: 'enter', wide: true };
    W.KEYHELP = W.KEYHELP || {};
    if (!W.KEYSETS.u2clock) {
      W.KEYSETS.u2clock = [[dk(7), dk(8), dk(9), { label: '<b>:</b>', tex: ':', plain: ':', title: 'Colon' }, DEL],
        [dk(4), dk(5), dk(6), { label: 'a.m.', tex: '\\text{ a.m.}', plain: ' a.m.', title: 'a.m. (midnight to noon)' }, CLR],
        [dk(1), dk(2), dk(3), { label: 'p.m.', tex: '\\text{ p.m.}', plain: ' p.m.', title: 'p.m. (noon to midnight)' }, LF, RT], [dk(0), ENT]];
      W.KEYHELP.u2clock = ['Type the time with a colon, e.g. 14:30. On the 12-hour clock press <b>a.m.</b> or <b>p.m.</b> after it, e.g. 2:30 p.m.',
        'Type a time like <code>14:30</code> or <code>2:30 pm</code>.'];
    }
    if (!W.KEYSETS.u2hm) {
      W.KEYSETS.u2hm = [[dk(7), dk(8), dk(9), { label: 'h', tex: '\\text{ h }', plain: ' h ', title: 'hours' }, DEL],
        [dk(4), dk(5), dk(6), { label: 'min', tex: '\\text{ min}', plain: ' min', title: 'minutes' }, CLR],
        [dk(1), dk(2), dk(3), LF, RT], [dk(0), { label: '.', tex: '.', plain: '.' }, ENT]];
      W.KEYHELP.u2hm = ['Type the hours, press <b>h</b>, type the minutes, press <b>min</b>, e.g. 8 h 30 min.', 'Type a time like <code>8 h 30 min</code>.'];
    }
    if (!W.KEYSETS.u2mixed) {
      W.KEYSETS.u2mixed = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, DEL],
        [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, CLR],
        [dk(1), dk(2), dk(3), LF, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }], [dk(0), { label: '.', tex: '.', plain: '.' }, ENT]];
      W.KEYHELP.u2mixed = ['Fraction: type the top number, press <b><sup>a</sup>⁄<sub>b</sub></b>, then the bottom number. Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then the top and bottom numbers. Press <b>▶</b> to move on.',
        'Type a fraction as <code>9/4</code> and a mixed number as <code>2 1/4</code> (a space between the whole number and the fraction).'];
    }
  }

  /* ================= HW.u2pay: the time kit =================
   * Times of day are minutes after midnight (0–1439); durations are minutes.
   *   hm(min) -> [h, m];  hmS(min) "8 h 30 min" ("45 min", "6 h"; o.full: always both);  raw(h, m) "7 h 75 min"
   *   c12(min) "7:20 a.m.";  c24(min) "07:20";  c12T / c24T (LaTeX for table cells);  elapsed(a, b) (across midnight)
   *   dec(min) exact decimal hours;  decS(min) "4.17";  decSol(min) "50 ÷ 60 = 0.8333… ≈ 0.83" (LaTeX line)
   *   countUp(a, b, mode '12'|'24') -> { lines: [html], total } (jump to the hour, the whole hours, the minutes left)
   *   addSol([min…]) / subSol(a, b) -> html lines (add hours and minutes, regroup; borrow 1 h = 60 min)
   *   readClock(resp), readHM(resp)  (lenient readers for typed clock times and "8 h 30 min")
   *   clockChk(ans, want '24'|'12'|'either', o)  hmChk(ans, o) (two boxes [h, min])  hmCellChk(ans, o) (one table cell)
   *   decChk(exactHours, o)  (2 decimal places; o.min adds the time diagnoses; o.nr numerical response)
   *     o.bad: [[value, code, hint]] (durations: total minutes);  o.raw: [[h, m, code, hint]] (exactly as typed)
   *   timeBad(min) typical wrong decimal-hour values;  addRaw / subRaw (the "an hour has 100 min" results)
   *   part builders: hmPart(prompt, min, o), decPart(prompt, exactHours, o), clockPart(prompt, min, want, o),
   *     combo([{name, at, chk}]) (one check over several boxes), fieldsPart(prompt, fields, check, key, answer, sol, hints, text)
   * Keypads (browser): 'u2clock' (digits, :, a.m., p.m.), 'u2hm' (digits, h, min), 'u2mixed' (fraction + mixed number). */
  var U = HW.u2pay = HW.u2pay || {};
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function norm(min) { return ((Math.round(min) % 1440) + 1440) % 1440; }
  function hm(min) { min = Math.round(min); return [Math.floor(min / 60), min % 60]; }
  function hmS(min, o) { var a = hm(min); if (o && o.full) return a[0] + ' h ' + a[1] + ' min'; if (!a[0]) return a[1] + ' min'; if (!a[1]) return a[0] + ' h'; return a[0] + ' h ' + a[1] + ' min'; }
  function raw(h, m) { return h + ' h ' + m + ' min'; }
  function c24(min) { min = norm(min); return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }
  function c12(min) { min = norm(min); var h = Math.floor(min / 60), m = min % 60; return (h % 12 === 0 ? 12 : h % 12) + ':' + pad(m) + ' ' + (h < 12 ? 'a.m.' : 'p.m.'); }
  function c12T(min) { return '\\text{' + c12(min) + '}'; }
  function c24T(min) { return '\\text{' + c24(min) + '}'; }
  function c12key(min) { min = norm(min); var h = Math.floor(min / 60); return (h % 12 === 0 ? 12 : h % 12) + ':' + pad(min % 60) + '\\text{ ' + (h < 12 ? 'a.m.' : 'p.m.') + '}'; }
  function elapsed(a, b) { return ((b - a) % 1440 + 1440) % 1440; }
  function dec(min) { return min / 60; }
  function decS(min) { return dS(rnd(min / 60, 2)); }
  function decSol(m) { var x = m / 60; return near(x, rnd(x, 2)) ? m + '\\div 60=' + dS(x) : m + '\\div 60=' + dS(rnd(x, 4)) + '\\ldots\\approx ' + dS(rnd(x, 2)); }
  function decLine(min) { // "40 ÷ 60 = 0.666…, so about 4.67 h"
    var h = Math.floor(min / 60), m = min % 60, x = min / 60, exact = near(x, rnd(x, 2));
    if (!m) return min + ' min = ' + h + ' h';
    return t(m + '\\div 60=' + (near(m / 60, rnd(m / 60, 2)) ? dS(m / 60) : dS(rnd(m / 60, 4)) + '\\ldots')) + ', so ' + (exact ? '' : 'about ') + t(dS(rnd(x, 2)) + '\\text{ h}');
  }
  U.pad = pad; U.norm = norm; U.hm = hm; U.hmS = hmS; U.raw = raw; U.c24 = c24; U.c12 = c12; U.c12T = c12T; U.c24T = c24T; U.c12key = c12key;
  U.elapsed = elapsed; U.dec = dec; U.decS = decS; U.decSol = decSol; U.decLine = decLine;

  /* count up from a to b (b may be the next day) */
  function countUp(a, b, mode) {
    var f = mode === '24' ? c24 : c12, d = elapsed(a, b), end = a + d, parts = [], lines = [];
    var nextH = Math.ceil(a / 60) * 60, lastH = Math.floor(end / 60) * 60;
    if (nextH >= end || lastH <= a) { lines.push(f(a) + ' → ' + f(end) + ': ' + hmS(d)); return { lines: lines, total: d }; }
    if (nextH > a) { lines.push(f(a) + ' → ' + f(nextH) + ': ' + hmS(nextH - a)); parts.push(nextH - a); }
    if (lastH > nextH) {
      var note = nextH < 1440 && lastH > 1440 ? ' (' + hmS(1440 - nextH) + ' to midnight + ' + hmS(lastH - 1440) + ')' : '';
      lines.push(f(nextH) + ' → ' + f(lastH) + ': ' + hmS(lastH - nextH) + note); parts.push(lastH - nextH);
    }
    if (end > lastH) { lines.push(f(lastH) + ' → ' + f(end) + ': ' + hmS(end - lastH)); parts.push(end - lastH); }
    var H = 0, M = 0; parts.forEach(function (p) { H += Math.floor(p / 60); M += p % 60; });
    lines.push('Total: ' + parts.map(function (p) { return hmS(p); }).join(' + ') + ' = ' + (M >= 60 ? raw(H, M) + ' = ' : '') + hmS(d));
    return { lines: lines, total: d };
  }
  U.countUp = countUp;
  /* adding durations: "4 h 50 min + 3 h 40 min = 7 h 90 min" then "90 min = 1 h 30 min" */
  function addSol(list) {
    var H = 0, M = 0; list.forEach(function (x) { H += Math.floor(x / 60); M += x % 60; });
    var tot = H * 60 + M, out = [list.map(function (x) { return hmS(x); }).join(' + ') + ' = ' + raw(H, M)];
    if (M >= 60) out.push(M + ' min = ' + hmS(Math.floor(M / 60) * 60 + M % 60, { full: true }) + ', so the total is ' + hmS(tot) + '.');
    return out;
  }
  function subSol(a, b) {
    var A = hm(a), B = hm(b), d = a - b;
    if (A[1] >= B[1]) return [hmS(a, { full: B[1] > 0 }) + ' − ' + hmS(b) + ' = ' + hmS(d)];
    return ['Not enough minutes, so borrow 1 h (60 min): ' + raw(A[0] - 1, A[1] + 60) + ' − ' + raw(B[0], B[1]) + ' = ' + hmS(d)];
  }
  /* "an hour has 100 minutes" results: add / subtract the times as if they were decimals; returns [h, m] as written */
  function addRaw(list) { var s = 0; list.forEach(function (x) { var a = hm(x); s += a[0] * 100 + a[1]; }); return [Math.floor(s / 100), s % 100]; }
  function subRaw(a, b) { var A = hm(a), B = hm(b), s = (A[0] * 100 + A[1]) - (B[0] * 100 + B[1]); return s < 0 ? null : [Math.floor(s / 100), s % 100]; }
  U.addSol = addSol; U.subSol = subSol; U.addRaw = addRaw; U.subRaw = subRaw;

  /* ---- readers ---- */
  function plainOf(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\colon/g, ':').replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '').replace(/\\(?:text|mathrm|textrm|operatorname|mathit)\{([^{}]*)\}/g, ' $1 ');
    s = s.replace(/\\[,;:! ]|\\quad|\\qquad|~/g, ' ').replace(/[{}]/g, '').replace(/\\[a-zA-Z]+/g, ' ');
    return s.toLowerCase().replace(/\s+/g, ' ').trim();
  }
  /* a clock time: { h, m, ap: 'a'|'p'|null, two (2-digit hour), sep (':' or other) } or { code } */
  function readClock(resp) {
    var s = plainOf(resp); if (!s) return { code: 'empty' };
    var ap = null, mm = /\s*([ap])\s*\.?\s*m\s*\.?$/.exec(s) || /\s*([ap])\s*\.?$/.exec(s);
    if (mm && /\d/.test(s.slice(0, mm.index))) { ap = mm[1]; s = s.slice(0, mm.index).trim(); }
    var x = /^(\d{1,2})\s*([:.h ])\s*(\d{2})$/.exec(s), sep;
    if (x) sep = x[2]; else if ((x = /^(\d{1,2})(\d{2})$/.exec(s))) { x = [x[0], x[1], '', x[2]]; sep = ''; }
    else if (ap && (x = /^(\d{1,2})$/.exec(s))) { x = [x[0], x[1], ':', '00']; sep = ':'; }
    else return { code: 'notclock' };
    return { h: +x[1], m: +x[3], ap: ap, two: x[1].length === 2, sep: sep };
  }
  /* a duration in one cell: { h, m } or { dec } or { code } */
  function readHM(resp) {
    var s = plainOf(resp).replace(/minutes?|mins?/g, 'm').replace(/hours?|hrs?/g, 'h').replace(/\s+/g, '');
    if (!s) return { code: 'empty' };
    if (/^(none|no|-)$/.test(s)) return { h: 0, m: 0 };
    var x;
    if ((x = /^(\d+)h(?:(\d+)m?)?$/.exec(s))) return { h: +x[1], m: x[2] ? +x[2] : 0 };
    if ((x = /^(\d+)m$/.exec(s))) return { h: 0, m: +x[1] };
    if ((x = /^(\d+):(\d{1,2})$/.exec(s))) return { h: +x[1], m: +x[2] };
    if (/^\d+(\.\d+)?$|^\.\d+$/.test(s)) return { dec: Number(s), raw: s };
    return { code: 'notnumber' };
  }
  U.readClock = readClock; U.readHM = readHM; U.plainOf = plainOf;

  /* ---- checkers ---- */
  function hit(list, v) { for (var i = 0; list && i < list.length; i++) if (list[i][0] === v) return list[i]; return null; }
  function judgeHM(h, m, ans, o) {
    o = o || {};
    for (var i = 0; o.raw && i < o.raw.length; i++) { var rw = o.raw[i]; if (rw[0] === h && rw[1] === m && rw[0] * 60 + rw[1] !== ans) return wrong(rw[2], rw[3]); }
    var tot = h * 60 + m;
    if (tot === ans) return m >= 60 ? form('u2-regroup', 'Right amount of time — now regroup: trade each 60 min for 1 h, so there are fewer than 60 minutes.') : ok();
    var b = m < 60 ? hit(o.bad, tot) : null; if (b) return wrong(b[1], b[2]);
    if (m >= 60) return wrong('value', 'An hour has 60 minutes, so regroup the minutes (60 min = 1 h) — and check your total again.');
    var A = hm(ans);
    if (h === A[0] && m !== A[1]) return wrong('value', 'The hours are right. Check the minutes.');
    if (m === A[1] && h !== A[0]) return wrong('value', 'The minutes are right. Check the hours.');
    return wrong('value', null);
  }
  /* two boxes [h, min] */
  function hmChk(ans, o) {
    return function (resp) {
      resp = resp || []; var a = String(resp[0] == null ? '' : resp[0]).trim(), b = String(resp[1] == null ? '' : resp[1]).trim();
      if (!a && !b) return form('empty', 'Type your answer first.');
      var H = a ? PK.readV(a) : { ok: true, v: 0 }, M = b ? PK.readV(b) : { ok: true, v: 0 };
      if (!H.ok || !M.ok) return form(H.code === 'comma' || M.code === 'comma' ? 'u2-comma' : 'notnumber', 'Type a whole number in each box: the hours in the <b>h</b> box and the minutes in the <b>min</b> box.');
      if (H.v % 1 || M.v % 1) return form('u2-hm-dec', 'Type whole numbers: the whole hours in the <b>h</b> box and the minutes in the <b>min</b> box (no decimals).');
      if (H.v < 0 || M.v < 0) return wrong('sign', 'A time can’t be negative.');
      return judgeHM(H.v, M.v, ans, o);
    };
  }
  /* one table cell such as "8 h 30 min" */
  function hmCellChk(ans, o) {
    return function (resp) {
      var r = readHM(resp);
      if (r.code === 'empty') return form('empty', 'Type your answer first.');
      if (r.code) return form('u2-hm-form', 'Write it in hours and minutes, like 8 h 30 min (use the <b>h</b> and <b>min</b> keys).');
      if (r.dec != null) {
        if (near(r.dec * 60, ans)) return ans % 60 === 0 ? ok() : form('u2-hm-dec', 'Right amount, but in decimal hours. Here write hours and minutes, like 8 h 30 min.');
        var p = r.raw.split('.'); if (p[1] && p[1].length === 2 && +p[0] * 60 + +p[1] === ans) return form('u2-hm-form', 'Write it with the <b>h</b> and <b>min</b> keys, like 8 h 30 min. (A decimal like 8.30 would mean 8.3 hours.)');
        return wrong('value', 'Write the time in hours and minutes, like 8 h 30 min.');
      }
      return judgeHM(r.h, r.m, ans, o);
    };
  }
  /* decimal hours to 2 places */
  function timeBad(min) {
    var h = Math.floor(min / 60), m = min % 60, out = [];
    if (m) out.push([h + m / 100, 'u2-dot-min', 'The digits after the decimal point are not minutes. Change the ' + m + ' min to part of an hour: divide by 60.']);
    if (h && m) out.push([m / 60, 'u2-no-whole', 'You changed the minutes, but left out the ' + h + ' whole hour' + (h === 1 ? '' : 's') + '. Add them on.']);
    out.push([min, 'u2-total-min', 'That’s the number of minutes. Divide by 60 to change minutes to hours.']);
    out.push([min / 100, 'u2-div100', 'An hour has 60 minutes, not 100. Divide the minutes by 60.']);
    if (m) out.push([h + 60 / m, 'u2-flip', 'Divide the minutes by 60 (minutes ÷ 60), not 60 by the minutes.']);
    return out;
  }
  function cleanList(list, exact) {
    var seen = [];
    return (list || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || near(b[0], exact) || near(rnd(b[0], 2), rnd(exact, 2)) || Math.abs(b[0] - exact) < 0.006) return false;
      if (seen.some(function (x) { return Math.abs(x - b[0]) < 0.006; })) return false; seen.push(b[0]); return true;
    });
  }
  function decChk(exactH, o) {
    o = o || {};
    var list = cleanList((o.bad || []).concat(o.min != null ? timeBad(o.min) : []), exactH);
    var chk = PK.num(exactH, o.dp != null ? o.dp : 2, function (v) {
      for (var i = 0; i < list.length; i++) { var x = list[i][0]; if (near(v, x) || near(v, rnd(x, 2)) || near(v, rnd(x, 1))) return { code: list[i][1], hint: list[i][2] }; }
      return null;
    }, { nr: !!o.nr });
    chk.list = list;
    return chk;
  }
  /* a clock time. want: '24' | '12' | 'either'. o.bad: [[min, code, hint]] */
  function clockChk(ans, want, o) {
    o = o || {}; ans = norm(ans);
    var like = want === '12' ? 'like 2:30 p.m.' : want === '24' ? 'like 14:30' : 'like 14:30 or 2:30 p.m.';
    return function (resp) {
      var c = readClock(resp);
      if (c.code === 'empty') return form('empty', 'Type your answer first.');
      if (c.code) return form('u2-clock-form', 'Write a clock time, ' + like + '.');
      if (c.m > 59) return form('u2-clock-form', 'The minutes on a clock go from 00 to 59.');
      var v, ambiguous = false;
      if (c.ap) {
        if (c.h === 0) return wrong('u2-zero-hour', 'On the 12-hour clock the hour just after midnight is <b>12</b> (like 12:10 a.m.), not 0.');
        if (c.h > 12) return form('u2-clock-form', 'With a.m. or p.m. the hour goes from 1 to 12.' + (want !== '12' ? ' (Or leave out a.m./p.m. and use the 24-hour clock.)' : ''));
        v = (c.h % 12) * 60 + c.m + (c.ap === 'p' ? 720 : 0);
        if (want === '24' && v === ans) return form('u2-ampm-in-24', 'Right time — now write it on the <b>24-hour clock</b> (no a.m. or p.m.), ' + like + '.');
      } else {
        if (c.h === 24) { if (norm(c.m) === ans) return wrong('u2-24h', '24:00 is midnight, and then the 24-hour clock starts again at 00. So 24:' + pad(c.m) + ' is written 00:' + pad(c.m) + '.'); return form('u2-clock-form', 'The 24-hour clock goes from 00:00 to 23:59.'); }
        if (c.h > 24) return form('u2-clock-form', 'The 24-hour clock goes from 00:00 to 23:59.');
        v = c.h * 60 + c.m;
        if (want === '12') {
          if (v === ans) return form('u2-24-in-12', 'Right time — now write it on the <b>12-hour clock</b>, with a.m. or p.m.');
          if (c.h >= 1 && c.h <= 12 && !c.two && (v % 720) === (ans % 720)) return form('u2-need-ampm', 'Add <b>a.m.</b> or <b>p.m.</b> to your time.');
        }
        if (want === 'either' && c.h >= 1 && c.h <= 12 && !c.two && (v % 720) === (ans % 720)) ambiguous = true;
      }
      if (ambiguous && v !== ans) return form('u2-need-ampm', 'Add <b>a.m.</b> or <b>p.m.</b> (or write the time on the 24-hour clock).');
      if (v === ans) {
        if (c.sep !== ':') return form('u2-colon', 'Right time — write it with a colon between the hours and minutes, ' + like + '.');
        if (want === '24' && !c.two) return form('u2-two-digit', 'Right time — on the 24-hour clock the hour always has 2 digits (like 07:20).');
        if (ambiguous && c.h !== 12) return form('u2-need-ampm', 'Add <b>a.m.</b> or <b>p.m.</b> (or write the time on the 24-hour clock).');
        return ok();
      }
      var b = hit(o.bad, v) || (want === 'either' && !c.ap && !c.two && c.h >= 1 && c.h <= 12 ? hit(o.bad, norm(v + 720)) : null); if (b) return wrong(b[1], b[2]);
      if (norm(v + 720) === ans) {
        if (c.ap) return wrong('u2-ampm', ans >= 720 ? 'Check a.m. or p.m.: this time is after noon, so it is <b>p.m.</b>' : 'Check a.m. or p.m.: this time is before noon, so it is <b>a.m.</b>');
        if (ans >= 720) return wrong('u2-pm12', 'This time is after noon. On the 24-hour clock, <b>add 12</b> to a p.m. hour.');
        return wrong('u2-pm12', Math.floor(ans / 60) === 0 ? 'Just after midnight the 24-hour clock shows the hour as <b>00</b>, not 12.' : 'This time is before noon, so keep the hour as it is.');
      }
      return wrong('value', null);
    };
  }
  U.judgeHM = judgeHM; U.hmChk = hmChk; U.hmCellChk = hmCellChk; U.timeBad = timeBad; U.decChk = decChk; U.clockChk = clockChk;

  /* ---- part builders ---- */
  function combo(list) {
    return function (resp) {
      resp = resp || []; var firstForm = null, firstWrong = null;
      list.forEach(function (it) {
        var v = Array.isArray(it.at) ? it.at.map(function (i) { return resp[i] == null ? '' : resp[i]; }) : (resp[it.at] == null ? '' : resp[it.at]);
        var r = it.chk(v); if (r.v === 'correct') return;
        var out = { v: r.v, code: r.code, hint: (it.name ? '<b>' + it.name + ':</b> ' : '') + (r.hint || 'Check this one again.') };
        if (r.v === 'form') { if (!firstForm) firstForm = out; } else if (!firstWrong) firstWrong = out;
      });
      return firstWrong || firstForm || ok();
    };
  }
  function fieldsPart(prompt, fields, check, key, answer, sol, hints, text) {
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: key, answer: answer, solution: sol, hints: hints || [], text: text };
  }
  function hmFields(label) { return [{ label: label || '', after: 'h', name: 'Hours' }, { after: 'min', name: 'Minutes' }]; }
  function hmKey(min) { var a = hm(min); return [String(a[0]), String(a[1])]; }
  function hmPart(prompt, min, o) {
    o = o || {};
    var p = fieldsPart(prompt, hmFields(o.label), hmChk(min, o), hmKey(min), hmS(min), o.sol, o.hints, o.text);
    p.bad = (o.raw || []).filter(function (r) { return r[0] * 60 + r[1] !== min; }).map(function (r) { return [String(r[0]), String(r[1])]; });
    return p;
  }
  function decPart(prompt, exactH, o) {
    o = o || {};
    var chk = decChk(exactH, o), key = dS(rnd(exactH, o.dp != null ? o.dp : 2));
    var p = { prompt: prompt, input: { type: 'number', after: o.nr ? null : (o.after || 'h'), nr: !!o.nr, before: o.before }, check: chk, key: key, answer: t(key + (o.nr ? '' : '\\text{ h}')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = chk.list.map(function (b) { return dS(rnd(b[0], 2)); }).filter(function (s) { return !near(Number(s), rnd(exactH, 2)) && (!o.nr || s.length <= 4); });
    return p;
  }
  function clockPart(prompt, min, want, o) {
    o = o || {};
    var key = want === '12' ? c12key(min) : c24(min);
    var p = P.math(prompt, clockChk(min, want, o), key, o.sol, o.hints, o.text, { keys: 'u2clock', placeholder: want === '12' ? 'e.g. 2:30 pm' : want === '24' ? 'e.g. 14:30' : 'e.g. 14:30 or 2:30 pm' });
    p.answer = want === '12' ? c12(min) : want === 'either' ? c24(min) + ' (' + c12(min) + ')' : c24(min);
    if (want === 'either') p.good = [c12key(min)];
    return p;
  }
  /* h, min and decimal hours in three boxes */
  function hmDecPart(prompt, min, o) {
    o = o || {};
    var dchk = decChk(min / 60, { min: min, bad: o.decBad });
    var p = fieldsPart(prompt, hmFields(o.label || 'Hours and minutes:').concat([{ label: 'Decimal hours:', after: 'h', name: 'Decimal hours' }]),
      combo([{ name: 'Hours and minutes', at: [0, 1], chk: hmChk(min, o) }, { name: 'Decimal hours', at: 2, chk: dchk }]),
      hmKey(min).concat([decS(min)]), hmS(min) + ' = ' + decS(min) + ' h', o.sol, o.hints, o.text);
    p.bad = (o.raw || []).filter(function (r) { return r[0] * 60 + r[1] !== min; }).map(function (r) { return [String(r[0]), String(r[1]), decS(min)]; });
    return p;
  }
  U.combo = combo; U.fieldsPart = fieldsPart; U.hmFields = hmFields; U.hmKey = hmKey; U.hmPart = hmPart; U.decPart = decPart; U.clockPart = clockPart; U.hmDecPart = hmDecPart;

  /* mixed number / improper fraction checker. fr = [p, q] lowest terms; want 'mixed' | 'improper' */
  function fracChk(fr, want, diag) {
    var T = fr[0] / fr[1];
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'Type your answer first.');
      var a = PK.readFrac(s);
      if (!a || !isFinite(a.v)) return form('notnumber', want === 'mixed' ? 'Write a mixed number like ' + t('2\\frac{3}{4}') + '.' : 'Write a fraction like ' + t('\\frac{11}{4}') + '.');
      if (near(a.v, T)) {
        if (a.mixed) {
          if (want === 'improper') return form('u2-want-improper', 'Right value — now write it as an <b>improper fraction</b> (the top bigger than the bottom).');
          if (a.n != null && a.n >= a.d) return form('u2-mixed-improper', 'In a mixed number the fraction part must be less than 1.');
          if (a.n != null && gcd(a.n, a.d) > 1) return form('lowest', 'Right value — now simplify the fraction part (divide its top and bottom by ' + t(gcd(a.n, a.d)) + ').');
          return ok();
        }
        if (a.pf) {
          if (gcd(a.pf[0], a.pf[1]) > 1) return form('lowest', 'Right value — now write it in simplest form: divide the top and bottom by ' + t(gcd(a.pf[0], a.pf[1])) + '.');
          if (want === 'mixed' && a.pf[0] > a.pf[1] && a.pf[1] !== 1) return form('u2-want-mixed', 'Right value — now write it as a <b>mixed number</b> (a whole number and a fraction).');
          return ok();
        }
        if (a.decimals) return form('decimal', 'Right value — now write it as a ' + (want === 'mixed' ? 'mixed number' : 'fraction') + '.');
        if (fr[1] === 1) return ok();
        return form('simplify', 'Write it as a single ' + (want === 'mixed' ? 'mixed number' : 'fraction') + '.');
      }
      if (a.decimals && Math.abs(a.v - T) < 0.006) return form('decimal', 'That’s a rounded decimal. Write it as a ' + (want === 'mixed' ? 'mixed number' : 'fraction') + ' instead.');
      var h = diag ? diag(a.v, a) : null; if (h) return wrong(h.code, h.hint);
      return wrong('value', null);
    };
  }
  function mixT(fr) { var w = Math.floor(fr[0] / fr[1]), n = fr[0] % fr[1]; return n ? (w ? w : '') + '\\frac{' + n + '}{' + fr[1] + '}' : String(w); }
  function frT(fr) { return fr[1] === 1 ? String(fr[0]) : '\\frac{' + fr[0] + '}{' + fr[1] + '}'; }
  function dfrT(fr) { return fr[1] === 1 ? String(fr[0]) : '\\dfrac{' + fr[0] + '}{' + fr[1] + '}'; }
  function dmixT(fr) { var w = Math.floor(fr[0] / fr[1]), n = fr[0] % fr[1]; return n ? (w ? w : '') + '\\dfrac{' + n + '}{' + fr[1] + '}' : String(w); }
  U.fracChk = fracChk; U.mixT = mixT; U.frT = frT;

  HW.addCodes({
    'u2-regroup': 'Didn’t regroup 60 min as 1 h', 'u2-dot-min': 'Read the digits after the decimal point as minutes', 'u2-no-whole': 'Left out the whole hours',
    'u2-total-min': 'Gave the minutes, not hours', 'u2-div100': 'Divided by 100 instead of 60', 'u2-flip': 'Divided 60 by the minutes', 'u2-hm-dec': 'Decimal hours where hours and minutes were asked',
    'u2-hm-form': 'Time not written in h and min', 'u2-comma': 'Decimal comma', 'u2-clock-form': 'Not a clock time', 'u2-zero-hour': 'Wrote hour 0 on the 12-hour clock',
    'u2-ampm-in-24': 'Used a.m./p.m. on the 24-hour clock', 'u2-24-in-12': 'Gave the 24-hour time instead of the 12-hour time', 'u2-need-ampm': 'Left out a.m./p.m.',
    'u2-24h': 'Wrote 24:xx instead of 00:xx', 'u2-colon': 'No colon in the clock time', 'u2-two-digit': '24-hour time with a one-digit hour', 'u2-ampm': 'Wrong a.m./p.m.',
    'u2-pm12': '12-hour ↔ 24-hour: didn’t add/subtract 12 (or mixed up 00 and 12)', 'u2-want-improper': 'Mixed number instead of an improper fraction', 'u2-want-mixed': 'Improper fraction instead of a mixed number',
    'u2-mixed-improper': 'Mixed number with an improper fraction part',
    'u2-dec-add': 'Added times like decimals (100 min in an hour)', 'u2-dec-sub': 'Subtracted times like decimals (100 min in an hour)', 'u2-no-carry': 'Took 60 min off but didn’t add 1 h',
    'u2-sub-flip': 'Subtracted the smaller minutes from the larger instead of borrowing', 'u2-borrow-hour': 'Borrowed 60 min but didn’t take 1 h off the hours',
    'u2-noon': 'Didn’t count past noon (p.m. hour without + 12)', 'u2-backwards': 'Counted backwards (start − end) across midnight', 'u2-half-night': 'Only the part before or after midnight',
    'u2-count-hours': 'Miscounted the whole hours', 'u2-break': 'Didn’t take off the unpaid break', 'u2-break-twice': 'Took off the break twice', 'u2-one-block': 'Only one block of a split shift',
    'u2-no-break-end': 'Forgot to add the break to the shift length', 'u2-start-only': 'Gave the time still needed, not the end time'
  });
  HW.addPartial({
    'u2-dot-min': 'n', 'u2-no-whole': 'b', 'u2-total-min': 'b', 'u2-div100': 'n', 'u2-flip': 'n', 'u2-zero-hour': 's', 'u2-24h': 's', 'u2-ampm': 's', 'u2-pm12': 'b',
    'u2-dec-add': 'n', 'u2-dec-sub': 'n', 'u2-no-carry': 'b', 'u2-sub-flip': 'n', 'u2-borrow-hour': 'b', 'u2-noon': 'b', 'u2-backwards': 'n', 'u2-half-night': 'b',
    'u2-count-hours': 's', 'u2-break': 'b', 'u2-break-twice': 'b', 'u2-one-block': 'b', 'u2-no-break-end': 'b', 'u2-start-only': 'b'
  });

  /* ================= Lesson 1 helpers ================= */
  function sol(a) { return a.filter(Boolean).join('<br>'); }
  var MREP = [10, 20, 40, 50], MTERM = [6, 12, 18, 24, 36, 42, 48, 54], MFIVE = [5, 25, 35, 55];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  function hmName(h, m) { return h + ' h ' + m + ' min'; }
  /* typical add/subtract mistakes for the two-box answers */
  function addRawList(list) {
    var A = addRaw(list), H = 0, M = 0; list.forEach(function (x) { H += Math.floor(x / 60); M += x % 60; });
    var out = [[A[0], A[1], 'u2-dec-add', 'Don’t add times like decimals — an hour has 60 minutes, not 100. Add the hours, add the minutes, then trade 60 min for 1 h.']];
    if (M >= 60) out.push([H, M - 60, 'u2-no-carry', 'You took 60 min off the minutes — add that 1 h to the hours too.']);
    if (M >= 120) out.push([H + 1, M - 120, 'u2-no-carry', 'You took 120 min off the minutes — that is 2 h to add to the hours.']);
    return out;
  }
  function subRawList(a, b) {
    var A = hm(a), B = hm(b), out = [], R = subRaw(a, b);
    if (R) out.push([R[0], R[1], 'u2-dec-sub', 'Don’t subtract times like decimals — an hour has 60 minutes, not 100. Borrow 1 h as <b>60</b> min.']);
    if (A[1] < B[1]) {
      out.push([A[0] - B[0], B[1] - A[1], 'u2-sub-flip', 'You can’t take ' + B[1] + ' min from ' + A[1] + ' min, so don’t flip them. Borrow 1 h (60 min) first.']);
      out.push([A[0] - B[0], A[1] + 60 - B[1], 'u2-borrow-hour', 'When you borrow 1 h as 60 min, the hours go down by 1.']);
    }
    return out;
  }
  function elapsedRaw(a, b) { // the end clock minus the start clock "like decimals" (24-hour), when the end is later the same day
    if (b < a) return [];
    var R = subRaw(b, a); if (!R) return [];
    return [[R[0], R[1], 'u2-dec-sub', 'You can’t subtract clock times like decimals (an hour has 60 minutes, not 100). Count up from the start time instead.']];
  }
  function minsFrom(r, list, not) { return find(function () { return r.pick(list); }, function (m) { return (not || []).indexOf(m) < 0; }, list[0]); }

  /* ---- minutes → fraction and decimal table ---- */
  function fracTablePart(r, mins, prompt) {
    var rows = mins.map(function (m) { return m + '\\text{ min}'; }), cols = ['\\text{Fraction of an hour}', '\\text{Decimal hours}'], blanks = [], keyC = [];
    mins.forEach(function (m, i) {
      var fr = red(m, 60), fT = frT(fr), base = PK.frac(fr, function (v) { if (near(v, m / 100)) return { code: 'u2-div100', hint: 'An hour has 60 minutes, so write the minutes over <b>60</b>, then simplify.' }; return null; });
      var fChk = function (resp) { var a = PK.readFrac(resp); if (a && a.decimals && Math.abs(a.v - m / 60) < 0.006) return form('decimal', 'That’s the decimal. In this box write a fraction: the minutes over 60, simplified.'); return base(resp); };
      var dChk = PK.dec(m / 60, 2, function (v) {
        if (near(v, m / 100)) return { code: 'u2-div100', hint: 'An hour has 60 minutes, not 100. Divide the minutes by 60.' };
        if (near(v, rnd(60 / m, 2)) || near(v, 60 / m)) return { code: 'u2-flip', hint: 'Divide the minutes by 60, not 60 by the minutes.' };
        return null;
      });
      blanks.push({ where: 'cell', i: i, j: 0, name: m + ' min, fraction', chk: fChk });
      blanks.push({ where: 'cell', i: i, j: 1, name: m + ' min, decimal', chk: dChk });
      keyC.push([fT, dS(rnd(m / 60, 2))]);
    });
    var lines = mins.map(function (m) { var fr = red(m, 60); return m + ' min: ' + t('\\frac{' + m + '}{60}' + (fr[1] !== 60 ? '=' + frT(fr) : '')) + ', ' + t(decSol(m)); });
    return PK.tablePart(prompt || 'Complete the table. Write fractions in simplest form. Round decimals to 2 places.',
      { rows: rows, cols: cols, cells: mins.map(function () { return [null, null]; }), corner: '\\text{Minutes}', keys: 'fraction', help: 'Tap a box, then type. Use the fraction key for a fraction, e.g. 3/4.' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyC }, sol(lines),
      ['Fraction: write the minutes over 60, then simplify (divide the top and bottom by the same number).', 'Decimal: divide the minutes by 60. Round to 2 decimal places.'], 'min table');
  }

  /* ---- h m → decimal hours ---- */
  function toDecPart(h, m, o) {
    o = o || {}; var min = h * 60 + m;
    var q = o.q || (h ? h + ' h ' + m + ' min' : min + ' min');
    var s = h && m < 60 ? [t(decSol(m)), t(h + '+' + (near(m / 60, rnd(m / 60, 2)) ? dS(m / 60) : dS(rnd(m / 60, 4)) + '\\ldots') + (near(min / 60, rnd(min / 60, 2)) ? '=' : '\\approx ') + decS(min)) + ' h']
      : [t(decSol(min)) + ' h' + (min >= 60 ? ' (' + min + ' min = ' + hmS(min) + ')' : '')];
    return decPart(o.prompt || q + ' = ? (decimal hours)', min / 60, { min: min, sol: sol(s), hints: ['Divide the minutes by 60, then add the whole hours.', 'Round to 2 decimal places if needed.'], text: q + ' to decimal' });
  }
  /* decimal hours → h m */
  function toHMPart(x, o) {
    o = o || {}; var h = Math.floor(x + 1e-9), f = rnd(x - h, 2), m = Math.round(f * 60), min = h * 60 + m, fs = dS(f), digits = fs.split('.')[1] || '';
    var rawL = [[h, Number(digits), 'u2-dot-min', 'The digits after the decimal point are not minutes. Multiply only the decimal part (' + fs + ') by 60.']];
    if (digits.length === 1) rawL.push([h, Number(digits) * 10, 'u2-dot-min', 'The digits after the decimal point are not minutes: ' + fs + ' h is not ' + Number(digits) * 10 + ' min. Multiply only the decimal part (' + fs + ') by 60.']);
    rawL.push([h, Math.round(f * 100), 'u2-div100', 'An hour has 60 minutes, not 100. Multiply the decimal part by 60.']);
    return hmPart(o.prompt || dS(x) + ' h = ? h ? min', min, { raw: rawL,
      sol: sol([t(fs + '\\times 60=' + m) + ' min', (h ? h + ' h ' : '') + m + ' min']), hints: ['Keep the whole hours. Multiply only the decimal part by 60 to get the minutes.'], text: dS(x) + ' h to h min' });
  }
  /* time → mixed number of hours */
  function toMixedPart(h, m, o) {
    o = o || {}; var fr = red(h * 60 + m, 60), part = red(m, 60);
    var chk = fracChk(fr, 'mixed', function (v) { if (near(v, h + m / 100)) return { code: 'u2-div100', hint: 'The fraction part is the minutes over <b>60</b>, simplified.' }; return null; });
    var p = fieldsPart(o.prompt || h + ' h ' + m + ' min = ? (a mixed number of hours)', [{ label: '', mode: 'math', keys: 'u2mixed', placeholder: 'e.g. 2 1/4', after: 'h', name: 'Mixed number' }], K.fields([chk], { labels: [null] }), [mixT(fr)], t(dmixT(fr)) + ' h',
      sol([t('\\frac{' + m + '}{60}=' + frT(part)) + ', so ' + t(mixT(fr)) + ' h']), ['The fraction part is the minutes over 60. Simplify it.'], 'mixed ' + h + ' ' + m);
    p.bad = [[h + '\\frac{' + m + '}{100}']];
    return p;
  }
  /* improper fraction → mixed number and h min */
  function improperPart(fr, o) {
    o = o || {}; var w = Math.floor(fr[0] / fr[1]), rem = fr[0] % fr[1], min = Math.round(fr[0] / fr[1] * 60), m = min - w * 60;
    var fchk = fracChk(fr, 'mixed', function (v) { if (near(v, fr[1] / fr[0])) return { code: 'flip', hint: 'Divide the top by the bottom: ' + fr[0] + ' ÷ ' + fr[1] + '.' }; return null; });
    return fieldsPart(o.prompt || 'Write ' + t(dfrT(fr)) + ' h as a mixed number, then in hours and minutes.',
      [{ label: 'Mixed number:', mode: 'math', keys: 'u2mixed', placeholder: 'e.g. 2 1/4', after: 'h', name: 'Mixed number' }, { label: 'Hours and minutes:', after: 'h', name: 'Hours' }, { after: 'min', name: 'Minutes' }],
      combo([{ name: 'Mixed number', at: 0, chk: fchk }, { name: 'Hours and minutes', at: [1, 2], chk: hmChk(min, { raw: [[w, rem, 'u2-frac-min', 'The remainder is not the minutes. ' + t('\\frac{' + rem + '}{' + fr[1] + '}') + ' of an hour = ' + t(rem + '\\div ' + fr[1] + '\\times 60') + ' min.']] }) }]),
      [mixT(fr), String(w), String(m)], t(dmixT(fr)) + ' h = ' + hmS(min),
      sol([t(fr[0] + '\\div ' + fr[1] + '=' + w) + ' R ' + rem + ', so ' + t(frT(fr) + '=' + mixT(fr)) + ' h', t('\\frac{' + rem + '}{' + fr[1] + '}') + ' h = ' + t('\\frac{' + rem + '}{' + fr[1] + '}\\times 60=' + m) + ' min, so ' + hmS(min)]),
      ['Divide the top by the bottom: the answer is the whole number and the remainder goes over the bottom.', 'Then change the fraction of an hour to minutes (× 60).'], 'improper ' + fr.join('/'));
  }

  /* ---- add / subtract durations ---- */
  function addPart(list, o) {
    o = o || {}; var tot = list.reduce(function (s, x) { return s + x; }, 0);
    return hmPart(o.prompt || list.map(function (x) { return hmS(x, { full: true }); }).join(' + '), tot, { raw: addRawList(list), sol: sol(addSol(list)), hints: ['Add the hours. Add the minutes.', 'If there are 60 min or more, trade 60 min for 1 h.'], text: o.text || 'add times' });
  }
  function subPart(a, b, o) {
    o = o || {};
    return hmPart(o.prompt || (a % 60 ? hmS(a, { full: true }) : hmS(a)) + ' − ' + hmS(b, { full: true }), a - b, { raw: subRawList(a, b), sol: sol(subSol(a, b)), hints: ['Subtract the hours and the minutes.', 'Not enough minutes on top? Borrow 1 h and add 60 min.'], text: o.text || 'subtract times' });
  }

  /* ---- elapsed time ---- */
  function elapsedPart(a, b, mode, o) {
    o = o || {}; var d = elapsed(a, b), f = mode === '24' ? c24 : c12, cu = countUp(a, b, mode), bad = [], rawL = elapsedRaw(a, b);
    if (b < a) { // across midnight
      bad.push([elapsed(b, a), 'u2-backwards', 'That’s the time from ' + f(b) + ' to ' + f(a) + ' — going backwards. Count up from the start, through midnight, to the end.']);
      bad.push([1440 - a, 'u2-half-night', 'That’s only the time up to midnight. Add the time after midnight.']);
      bad.push([b, 'u2-half-night', 'That’s only the time after midnight. Add the time from the start up to midnight.']);
      var R = subRaw(a, b); if (R) rawL.push([R[0], R[1], 'u2-backwards', 'You subtracted the end from the start, which goes backwards in time. Count up from the start through midnight.']);
    }
    if (mode !== '24' && a < 720 && b >= 780 && b > a) { var noon = a - (b - 720); if (noon > 0) bad.push([noon, 'u2-noon', 'Count up past noon: from ' + f(a) + ' to 12:00 p.m., then on to ' + f(b) + '. (Or change the p.m. time to the 24-hour clock: add 12.)']); }
    [d - 60, d + 60].forEach(function (x) { if (x > 0) bad.push([x, 'u2-count-hours', 'Count the whole hours again — you are 1 h off.']); });
    var s = cu.lines.slice();
    if (o.both && b > a) { var R2 = hm(b), A2 = hm(a); s.push('Or 24-hour: ' + c24(b) + ' − ' + c24(a) + (R2[1] < A2[1] ? ' → borrow 1 h: ' + pad(R2[0] - 1) + ':' + (R2[1] + 60) + ' − ' + c24(a) : '') + ' = ' + hmS(d)); }
    if (mode === '24' && b > a && !o.both) { var B = hm(b), A = hm(a); s = [c24(b) + ' − ' + c24(a) + (B[1] < A[1] ? ' → borrow 1 h: ' + pad(B[0] - 1) + ':' + (B[1] + 60) + ' − ' + c24(a) : '') + ' = ' + hmS(d), '(Or count up: ' + cu.lines.slice(0, -1).map(function (l) { return l.replace(/^.*: /, ''); }).join(' + ') + ')'].filter(function (x) { return !/\(Or count up: \)/.test(x); }); }
    var p = o.dec ? hmDecPart(o.prompt || 'From ' + f(a) + ' to ' + f(b), d, { raw: rawL, bad: bad, sol: sol(s.concat([decLine(d)])), hints: ['Count up: jump to the next whole hour, then the whole hours, then the minutes left.'], text: o.text })
      : hmPart(o.prompt || 'From ' + f(a) + ' to ' + f(b), d, { raw: rawL, bad: bad, sol: sol(s), hints: ['Count up: jump to the next whole hour, then the whole hours, then the minutes left. Add the jumps.'], text: o.text || 'elapsed' });
    return p;
  }
  function clockMin(h, m) { return h * 60 + m; }

  /* ---- a timesheet (one row per day) ---- */
  function sheetDays(r, o) {
    // o: { n, mode '12'|'24', starts: [[lo, hi] in quarter hours], len: [lo, hi] in 5-min steps, breaks }
    return find(function () {
      var rows = [];
      for (var i = 0; i < o.n; i++) {
        var win = o.starts[i % o.starts.length], st = r.int(win[0], win[1]) * 15, len = r.int(o.len[0], o.len[1]) * 5, brk = o.breaks ? o.breaks[i] : (len > 300 ? r.pick([30, 30, 45]) : r.pick([0, 30]));
        rows.push({ day: o.days[i], in: st, out: st + len, len: len, brk: brk, worked: len - brk });
      }
      return rows;
    }, function (rows) {
      var mins = rows.reduce(function (s, x) { return s + x.worked % 60; }, 0), tot = rows.reduce(function (s, x) { return s + x.worked; }, 0);
      return mins >= 60 && tot % 30 !== 0 && rows.every(function (x) { return x.out < 1440 && x.len % 60 !== 0 && (x.brk || x.len <= 300); }) && rows.some(function (x) { return x.out % 60 < x.in % 60; });
    }, null);
  }
  function sheetTable(rows, mode, prompt) {
    var f = mode === '24' ? c24T : c12T, cols = ['\\text{In}', '\\text{Out}', '\\text{Time in to out}', '\\text{Unpaid break}', '\\text{Hours worked}'];
    var Rr = rows.map(function (x) { return '\\text{' + x.day + '}'; }), blanks = [], keyC = [];
    rows.forEach(function (x, i) {
      var rw = elapsedRaw(x.in, x.out);
      blanks.push({ where: 'cell', i: i, j: 2, name: x.day + ', time in to out', chk: hmCellChk(x.len, { raw: rw, bad: [[x.len - 60, 'u2-count-hours', 'Count the whole hours again — you are 1 h off.'], [x.len + 60, 'u2-count-hours', 'Count the whole hours again — you are 1 h off.']] }) });
      blanks.push({ where: 'cell', i: i, j: 4, name: x.day + ', hours worked', chk: hmCellChk(x.worked, { bad: x.brk ? [[x.len, 'u2-break', 'Take off the unpaid break (' + x.brk + ' min).'], [x.len - 2 * x.brk, 'u2-break-twice', 'Take off the break only once.']] : [] }) });
      keyC.push([f(x.in), f(x.out), hmKeyT(x.len), x.brk ? '\\text{' + x.brk + ' min}' : '\\text{none}', hmKeyT(x.worked)]);
    });
    var cells = rows.map(function (x) { return [f(x.in), f(x.out), null, x.brk ? '\\text{' + x.brk + ' min}' : '\\text{none}', null]; });
    var s = rows.map(function (x) { return x.day + ': ' + (mode === '24' ? c24(x.in) : c12(x.in)) + ' → ' + (mode === '24' ? c24(x.out) : c12(x.out)) + ' is ' + hmS(x.len) + (x.brk ? '; − ' + x.brk + ' min = ' + hmS(x.worked, { full: true }) : ' (no break)'); });
    return PK.tablePart(prompt, { rows: Rr, cols: cols, cells: cells, corner: '\\text{Day}', keys: 'u2hm', help: 'Tap a box, then type the time with the <b>h</b> and <b>min</b> keys, e.g. 8 h 30 min.' },
      PK.tableChk(blanks), { rows: Rr, cols: cols, cells: keyC }, sol(s),
      ['Time in to out: count up from the In time to the Out time (or subtract on the 24-hour clock, borrowing 1 h as 60 min).', 'Hours worked = time in to out − unpaid break.'], 'timesheet');
  }
  function hmKeyT(min) { var a = hm(min); return a[0] + '\\text{ h }' + a[1] + '\\text{ min}'; }
  function sheetTotals(rows, prompt) {
    var tot = rows.reduce(function (s, x) { return s + x.worked; }, 0), H = 0, M = 0; rows.forEach(function (x) { H += Math.floor(x.worked / 60); M += x.worked % 60; });
    var noBreak = rows.reduce(function (s, x) { return s + x.len; }, 0);
    return hmDecPart(prompt, tot, { bad: [[noBreak, 'u2-break', 'Use the <b>Hours worked</b> column (after the breaks), not the time in to out.']], raw: addRawList(rows.map(function (x) { return x.worked; })),
      decBad: [[noBreak / 60, 'u2-break', 'Use the hours worked (after the breaks).']], label: 'Total hours:',
      sol: sol(['Hours: ' + rows.map(function (x) { return Math.floor(x.worked / 60); }).join(' + ') + ' = ' + H + ' h; minutes: ' + rows.map(function (x) { return x.worked % 60; }).join(' + ') + ' = ' + M + ' min' + (M >= 60 ? ' = ' + hmS(M, { full: true }) : ''),
        'Total: ' + hmS(tot), decLine(tot)]), hints: ['Add the hours worked: the hours, then the minutes. Regroup 60 min as 1 h.', 'Change the total to decimal hours at the end.'], text: 'timesheet total' });
  }
  function sheetShow(rows, mode) {
    var TD = 'border:1px solid #c9b79c;padding:3px 9px;text-align:center', f = mode === '24' ? c24 : c12;
    return '<table style="border-collapse:collapse;margin:4px 0"><tr>' + ['Day', 'In', 'Out', 'Unpaid break'].map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (x) { return '<tr><td style="' + TD + '">' + x.day + '</td><td style="' + TD + '">' + f(x.in) + '</td><td style="' + TD + '">' + f(x.out) + '</td><td style="' + TD + '">' + (x.brk ? x.brk + ' min' : 'none') + '</td></tr>'; }).join('') + '</table>';
  }

  /* ---- 12 ↔ 24 hour tables ---- */
  function clockTable(times, from, prompt) {
    var to = from === '12' ? '24' : '12', Rr = times.map(function (x) { return from === '12' ? c12T(x) : c24T(x); }), cols = [to === '24' ? '\\text{24-hour clock}' : '\\text{12-hour clock}'];
    var blanks = times.map(function (x, i) { return { where: 'cell', i: i, j: 0, name: from === '12' ? c12(x) : c24(x), chk: clockChk(x, to) }; });
    var keyC = times.map(function (x) { return [to === '24' ? c24(x) : c12key(x)]; });
    var s = times.map(function (x) {
      var h = Math.floor(x / 60);
      if (from === '12') return c12(x) + ' → ' + c24(x) + (h === 0 ? ' (just after midnight)' : h === 12 ? ' (just after noon)' : h > 12 ? ' (p.m.: ' + (h - 12) + ' + 12 = ' + h + ')' : ' (a.m.: keep the hour, 2 digits)');
      return c24(x) + ' → ' + c12(x) + (h === 0 ? ' (00 is just after midnight: 12 a.m.)' : h === 12 ? ' (hour 12 is p.m.)' : h > 12 ? ' (' + h + ' − 12 = ' + (h - 12) + ', p.m.)' : ' (a.m.)');
    });
    return PK.tablePart(prompt, { rows: Rr, cols: cols, cells: times.map(function () { return [null]; }), corner: from === '12' ? '\\text{12-hour clock}' : '\\text{24-hour clock}', keys: 'u2clock',
      help: to === '24' ? 'Tap a box, then type the 24-hour time with a colon, e.g. 14:30.' : 'Tap a box, then type the time and press <b>a.m.</b> or <b>p.m.</b>, e.g. 2:30 p.m.' },
      PK.tableChk(blanks), { rows: Rr, cols: cols, cells: keyC }, sol(s),
      to === '24' ? ['a.m.: keep the hour (2 digits). p.m.: add 12 to the hour.', '12:xx a.m. is just after midnight (00:xx); 12:xx p.m. is just after noon (12:xx).'] : ['Hours 13 to 23: subtract 12, p.m. Hour 12: p.m. Hour 00: write 12, a.m. Hours 01 to 11: a.m.'], 'clock table');
  }

  /* ---- MC helpers ---- */
  function mcTimes(r, prompt, rightMin, wrongs, s, hints, text) { // wrongs: [[min, why, code]]
    var seen = [rightMin], opts = [{ html: hmS(rightMin), right: true }];
    wrongs.forEach(function (w) { if (w[0] > 0 && seen.indexOf(w[0]) < 0 && opts.length < 4) { seen.push(w[0]); opts.push({ html: hmS(w[0]), why: w[1], code: w[2] }); } });
    return P.mc(r, prompt, opts, s, hints, text);
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u2l1', unit: 2, num: '1', title: 'Time Math: Hours, Minutes and Timesheets', outcome: 'REV',
    blurb: 'Minutes as part of an hour (fractions and decimals), adding and subtracting times, the 12- and 24-hour clocks, elapsed time and timesheets.',
    questions: [
      { num: '1', stem: 'Complete the table. Write fractions in simplest form. Round decimals to 2 places.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return fracTablePart(r, r.shuffle([30, 15, 45]), 'Benchmarks: complete the table.'); } },
        { id: '1b', level: 'EMG', make: function (r) { var a = r.pick([20, 40, 50, 10]), b = r.pick([12, 24, 36, 48, 6, 18]), c = minsFrom(r, [50, 40, 25, 35, 55, 5, 42, 54, 3, 9], [a]); return fracTablePart(r, [a, b, c]); } }] },
      { num: '2', stem: 'Change to decimal hours. Round to 2 decimal places if needed.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return toDecPart(r.int(2, 9), 30); } },
        { id: '2b', level: 'BEG', make: function (r) { return toDecPart(r.int(2, 10), 45); } },
        { id: '2c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(1, 9), r.pick(MREP)]; }, function (v) { return !(v[0] === 5 && v[1] === 50); }, [2, 10]); return toDecPart(v[0], v[1]); } },
        { id: '2d', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 10), r.pick(MTERM)]; }, function (v) { return !(v[0] === 8 && v[1] === 36); }, [7, 24]); return toDecPart(v[0], v[1]); } },
        { id: '2e', level: 'EMG', make: function (r) { return toDecPart(r.int(2, 11), r.pick(MFIVE)); } },
        { id: '2f', level: 'PRG', make: function (r) { var n = r.pick([75, 105, 135, 165, 195, 80, 100, 110, 140, 150, 170, 200, 210, 225, 130]); return toDecPart(0, n, { q: n + ' min' }); } }] },
      { num: '3', stem: 'Change to hours and minutes.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return toHMPart(r.int(1, 9) + 0.25); } },
        { id: '3b', level: 'BEG', make: function (r) { return toHMPart(find(function () { return r.int(2, 10) + 0.5; }, function (x) { return x !== 6.5; }, 5.5)); } },
        { id: '3c', level: 'EMG', make: function (r) { return toHMPart(find(function () { return rnd(r.int(1, 9) + r.pick([0.2, 0.4, 0.6, 0.8]), 1); }, function (x) { return x !== 2.4; }, 1.8)); } },
        { id: '3d', level: 'EMG', make: function (r) { return toHMPart(rnd(r.int(2, 10) + r.pick([0.1, 0.3, 0.7, 0.9]), 1)); } },
        { id: '3e', level: 'EMG', make: function (r) { return toHMPart(r.pick([0.6, 0.4, 0.8, 0.3, 0.7, 0.9, 0.2])); } },
        { id: '3f', level: 'PRG', make: function (r) { return toHMPart(find(function () { return rnd(r.int(1, 9) + r.pick([0.05, 0.15, 0.35, 0.45, 0.55, 0.65, 0.85, 0.95]), 2); }, function (x) { return x !== 1.35; }, 8.95)); } }] },
      { num: '4', stem: function (sh) { return sh.who + '’s work app says he worked ' + dS(sh.x) + ' h on Saturday. He writes “' + sh.h + ' h ' + sh.d * 10 + ' min” on his timesheet.'; },
        shared: function (r) { var h = r.int(4, 9), d = r.pick([1, 2, 3, 4, 6, 7, 8, 9]); return { who: r.pick(['Kai', 'Tomas', 'Arjun', 'Liam']), h: h, d: d, x: rnd(h + d / 10, 1) }; },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) { var x = dS(sh.x), fd = '0.' + sh.d;
            return P.mc(r, 'What mistake did he make?', [
              { html: 'He read the ' + sh.d + ' after the decimal point as ' + sh.d * 10 + ' minutes. But ' + fd + ' h is ' + t(fd + '\\times 60=' + sh.d * 6) + ' min.', right: true },
              { html: 'There is no mistake: ' + x + ' h and ' + sh.h + ' h ' + sh.d * 10 + ' min are the same.', why: sh.h + ' h ' + sh.d * 10 + ' min would be ' + dS(rnd(sh.h + sh.d / 6, 2)) + ' h. The digits after the decimal point are not minutes.', code: 'u2-dot-min' },
              { html: 'He should have divided ' + fd + ' by 60 to get the minutes.', why: 'To change part of an hour to minutes, <b>multiply</b> by 60 (there are 60 minutes in an hour).', code: 'u2-flip' },
              { html: 'He should have multiplied all of ' + x + ' by 100.', why: 'An hour has 60 minutes, not 100. Multiply only the decimal part by 60.', code: 'u2-div100' }],
              sol(['He read the ' + sh.d + ' after the decimal point as ' + sh.d * 10 + ' minutes.', 'But ' + t(fd + '\\times 60=' + sh.d * 6) + ' min, so ' + x + ' h = ' + sh.h + ' h ' + sh.d * 6 + ' min.']), ['How many minutes is ' + fd + ' of an hour? Multiply by 60.'], 'Kai mistake'); } },
          { id: '4b', level: 'EMG', make: function (r, sh) { var x = rnd(sh.h + sh.d / 10, 1); return toHMPart(x, { prompt: 'What should he write on his timesheet?' }); } }] },
      { num: '5', stem: '', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(2, 9), r.pick([15, 30, 45])]; }, function (v) { return !(v[0] === 2 && v[1] === 45); }, [3, 15]); return toMixedPart(v[0], v[1]); } },
        { id: '5b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(1, 9), r.pick([20, 40, 10, 50, 12, 24, 36, 48])]; }, function (v) { return !(v[0] === 1 && v[1] === 20); }, [5, 20]); return toMixedPart(v[0], v[1]); } },
        { id: '5c', level: 'EMG', make: function (r) { return improperPart([r.pick([5, 7, 9, 11, 13, 15]), 2]); } },
        { id: '5d', level: 'EMG', make: function (r) { var fr = find(function () { var q = r.pick([3, 4, 6]), p = r.int(q + 1, 5 * q); return red(p, q); }, function (f) { return f[1] > 1 && f[0] > f[1] && !(f[0] === 11 && f[1] === 4); }, [10, 3]); return improperPart(fr); } },
        { id: '5e', level: 'EMG', make: function (r) {
          var w = r.int(1, 6), q = r.pick([1, 3]), fr = [w * 4 + q, 4], what = r.pick([['A rink rents ice time by the quarter hour. A hockey team books', 'quarter hours'], ['A music studio rents rooms by the quarter hour. A band books', 'quarter hours']]);
          var fchk = fracChk(fr, 'improper', function (v) { if (near(v, (w * 4 + q) / 4)) return null; if (near(v, (w + q) / 4)) return { code: 'u2-mixed-add', hint: 'Multiply the whole number by the bottom, then add the top: ' + t(w + '\\times 4+' + q) + '.' }; return null; });
          var nchk = PK.num(w * 4 + q, 0, function (v) { if (v === w + q) return { code: 'u2-mixed-add', hint: 'Each hour has 4 quarter hours: multiply ' + w + ' by 4, then add ' + q + '.' }; if (v === w * 4) return { code: 'u2-no-whole', hint: 'Add the ' + q + ' extra quarter hour' + (q > 1 ? 's' : '') + ' too.' }; return null; });
          return fieldsPart(what[0] + ' ' + t(w + '\\dfrac{' + q + '}{4}') + ' h. Write ' + t(w + '\\dfrac{' + q + '}{4}') + ' as an improper fraction. How many quarter hours is that?',
            [{ label: 'Improper fraction:', mode: 'math', keys: 'u2mixed', placeholder: 'e.g. 9/4', name: 'Improper fraction' }, { label: 'Quarter hours:', name: 'Quarter hours' }],
            combo([{ name: 'Improper fraction', at: 0, chk: fchk }, { name: 'Quarter hours', at: 1, chk: nchk }]), ['\\frac{' + fr[0] + '}{4}', String(fr[0])], t('\\dfrac{' + fr[0] + '}{4}') + ' h, so ' + fr[0] + ' quarter hours',
            sol([t(w + '\\frac{' + q + '}{4}=\\frac{' + w + '\\times 4+' + q + '}{4}=\\frac{' + fr[0] + '}{4}'), 'So the booking is ' + fr[0] + ' quarter hours.']), ['Mixed number to improper fraction: multiply the whole number by the bottom, add the top, keep the bottom.'], 'quarter hours'); } }] },
      { num: '6', stem: 'Add or subtract. Regroup so the minutes are less than 60.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var v = find(function () { return [clockMin(r.int(2, 7), r.int(1, 9) * 5), clockMin(r.int(1, 5), r.int(1, 9) * 5)]; }, function (v) { return v[0] % 60 + v[1] % 60 < 60; }, [320, 205]); return addPart(v); } },
        { id: '6b', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(2, 8), r.int(5, 11) * 5), clockMin(r.int(1, 5), r.int(5, 11) * 5)]; }, function (v) { var s = v[0] % 60 + v[1] % 60; return s > 60 && !(v[0] === 265 && v[1] === 230); }, [405, 155]); return addPart(v); } },
        { id: '6c', level: 'PRG', make: function (r) { var v = find(function () { return [clockMin(r.int(1, 5), r.int(7, 11) * 5), clockMin(r.int(1, 4), r.int(7, 11) * 5), clockMin(r.int(1, 3), r.int(7, 11) * 5)]; }, function (v) { var s = v[0] % 60 + v[1] % 60 + v[2] % 60; return s > 120 && !(v[0] === 160 && v[1] === 95); }, [290, 220, 115]); return addPart(v); } },
        { id: '6d', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(6, 11), r.int(1, 5) * 5), clockMin(r.int(2, 5), r.int(6, 11) * 5)]; }, function (v) { return v[0] % 60 < v[1] % 60 && !(v[0] === 555 && v[1] === 220); }, [550, 275]); return subPart(v[0], v[1]); } },
        { id: '6e', level: 'EMG', make: function (r) { var H = r.pick([8, 10, 11, 12]), b = clockMin(r.int(3, H - 3), r.int(1, 11) * 5); return subPart(H * 60, b); } }] },
      { num: '7', stem: function (sh) { return 'A mechanic records the time for each job on a car: ' + sh.jobs.map(function (j) { return j[0] + ' ' + hmS(j[1]); }).join(', ') + '.'; },
        shared: function (r) { return find(function () { var j = r.shuffle([['oil change', r.int(6, 11) * 5], ['brake job', clockMin(r.int(1, 3), r.int(1, 11) * 5)], ['tire swap', clockMin(1, r.int(1, 9) * 5)], ['wheel alignment', clockMin(1, r.int(1, 11) * 5)]]).slice(0, 3); return { jobs: j, tot: j[0][1] + j[1][1] + j[2][1] }; }, function (s) { var m = s.jobs.reduce(function (a, j) { return a + j[1] % 60; }, 0); return m > 60 && s.tot % 15 !== 0; }, { jobs: [['oil change', 45], ['brake job', 140], ['tire swap', 65]], tot: 250 }); },
        parts: [
          { id: '7a', level: 'EMG', make: function (r, sh) { var list = sh.jobs.map(function (j) { return j[1]; }); var p = addPart(list, { prompt: 'What is the total time in hours and minutes?', text: 'mechanic total' }); return p; } },
          { id: '7b', level: 'EMG', make: function (r, sh) { return decPart('The shop bills in decimal hours. Write the total in decimal hours, to 2 decimal places.', sh.tot / 60, { min: sh.tot, sol: sol(['Total: ' + hmS(sh.tot), decLine(sh.tot)]), hints: ['Use your total from (a). Divide the minutes by 60 and add the whole hours.'], text: 'mechanic decimal' }); } }] },
      { num: '8', stem: 'Complete the table.', parts: [
        { id: '8a', level: 'EMG', make: function (r) {
          var am = find(function () { return clockMin(r.int(1, 11), r.pick([5, 10, 20, 25, 35, 40, 50, 55])); }, function (v) { return v !== 375 && v !== 510; }, 440);
          var pm = find(function () { return clockMin(r.int(13, 22), r.pick([5, 15, 25, 35, 45, 50])); }, function (v) { return v !== 940 && v !== 1030; }, 885);
          var mid = r.pick([5, 10, 15, 25, 30, 35, 40, 50]), late = clockMin(23, r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45])), noon = clockMin(12, r.pick([10, 15, 25, 30, 35, 40, 45, 50, 55]));
          return clockTable([am, pm, mid, late, noon], '12', 'Change each time to the 24-hour clock.'); } },
        { id: '8b', level: 'EMG', make: function (r) {
          var early = find(function () { return clockMin(r.int(1, 9), r.pick([5, 10, 15, 20, 25, 35, 40, 50])); }, function (v) { return v !== 510; }, 365);
          var aft = find(function () { return clockMin(r.int(13, 17), r.pick([5, 15, 20, 25, 35, 40, 45, 55])); }, function (v) { return v !== 1030; }, 815);
          var midn = r.pick([5, 10, 15, 20, 25, 30, 35, 50]), hour = clockMin(r.pick([18, 19, 20]), 0), eve = clockMin(r.int(20, 23), r.pick([10, 20, 25, 35, 40, 50]));
          if (eve === hour) eve += 10;
          return clockTable([early, aft, midn, hour, eve], '24', 'Change each time to the 12-hour clock.'); } }] },
      { num: '9', stem: 'Find the elapsed time.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { var v = find(function () { var a = clockMin(r.int(7, 9), r.int(1, 8) * 5); return [a, a + r.int(2, 3) * 60 + r.int(1, 6) * 5]; }, function (v) { return v[1] % 60 > v[0] % 60 && v[1] < 720 && !(v[0] === 530 && v[1] === 680); }, [560, 710]); return elapsedPart(v[0], v[1], '12'); } },
        { id: '9b', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(7, 9), r.int(7, 11) * 5), clockMin(r.int(13, 14), r.int(1, 6) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60 && !(v[0] === 520 && v[1] === 805); }, [465, 795]); return elapsedPart(v[0], v[1], '12'); } },
        { id: '9c', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(10, 11), r.int(5, 11) * 5), clockMin(r.int(15, 17), r.int(1, 4) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60 && !(v[0] === 635 && v[1] === 910); }, [685, 965]); return elapsedPart(v[0], v[1], '12'); } },
        { id: '9d', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(6, 9), r.int(7, 11) * 5), clockMin(r.int(14, 17), r.int(1, 6) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60 && !(v[0] === 520 && v[1] === 805); }, [520, 985]); return elapsedPart(v[0], v[1], '24'); } },
        { id: '9e', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(12, 15), r.int(7, 11) * 5), clockMin(r.int(19, 22), r.int(1, 5) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60; }, [835, 1270]); return elapsedPart(v[0], v[1], '24'); } }] },
      { num: '10', stem: 'These times go past midnight. Find the elapsed time.', parts: [
        { id: '10a', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(20, 22), r.int(1, 11) * 5), clockMin(r.int(1, 4), r.int(1, 11) * 5)]; }, function (v) { return v[0] % 60 !== v[1] % 60 && !(v[0] === 1365 && v[1] === 435) && !(v[0] === 1300 && v[1] === 370); }, [1290, 135]); return elapsedPart(v[0], v[1], '12'); } },
        { id: '10b', level: 'PRG', make: function (r) { var v = find(function () { return [clockMin(r.int(22, 23), r.int(1, 11) * 5), clockMin(r.int(4, 7), r.int(1, 11) * 5)]; }, function (v) { return v[1] % 60 + (60 - v[0] % 60) >= 60 && v[0] % 60 !== 0; }, [1390, 400]); return elapsedPart(v[0], v[1], '24'); } },
        { id: '10c', level: 'PRG', make: function (r) { var a = clockMin(r.pick([18, 19, 20]), r.pick([0, 30])), b = clockMin(r.int(6, 8), r.pick([0, 15, 30, 45])); if (elapsed(a, b) % 60 === 0) b += 30;
          var who = r.pick(['A nurse at the Foothills hospital', 'A care aide at a seniors’ home in Red Deer', 'A security guard at a Calgary warehouse']);
          return elapsedPart(a, b, '24', { dec: true, prompt: who + ' works a night shift from ' + c24(a) + ' to ' + c24(b) + ' the next morning. How long is the shift, in hours and minutes and in decimal hours?', text: 'night shift' }); } }] },
      { num: '11', stem: 'Find the end time.', parts: [
        { id: '11a', level: 'EMG', make: function (r) {
          var v = find(function () { return [clockMin(r.int(10, 11), r.int(5, 11) * 5), clockMin(r.int(2, 4), r.int(5, 11) * 5)]; }, function (v) { return v[0] % 60 + v[1] % 60 >= 60 && v[0] + v[1] >= 780; }, [700, 225]), end = v[0] + v[1];
          var what = r.pick([['A turkey goes into the oven at', 'It needs', 'to cook. When will it be done?'], ['A roast goes into the oven at', 'It needs', 'to cook. When will it be ready?'], ['A painting crew starts a job at', 'The job takes', '. When will it be finished?']]);
          var A = hm(v[0]), B = hm(v[1]), H = A[0] + B[0], M = A[1] + B[1];
          return clockPart(what[0] + ' ' + c12(v[0]) + ' ' + what[1] + ' ' + hmS(v[1]) + (what[2].charAt(0) === '.' ? '' : ' ') + what[2], end, 'either', {
            bad: [[norm(A[0] * 60 + A[1] + B[0] * 100 + B[1]), 'u2-dec-add', 'Add the hours and the minutes separately and regroup at 60 min, not 100.'], [norm(v[0] + v[1] - 60), 'u2-no-carry', 'You regrouped the minutes, but forgot to add the 1 h to the hours.']],
            sol: sol([raw(A[0], A[1]) + ' + ' + raw(B[0], B[1]) + ' = ' + raw(H, M) + ' = ' + raw(H + 1, M - 60), 'That is ' + c24(end) + ', or ' + c12(end)]), hints: ['Add the hours and add the minutes. Regroup 60 min as 1 h.', 'Hours past 12 are p.m.: subtract 12 for the 12-hour clock.'], text: 'end time' }); } },
        { id: '11b', level: 'PRG', make: function (r) {
          var v = find(function () { return [clockMin(r.int(14, 16), r.pick([15, 30, 45])), clockMin(8, r.int(5, 11) * 5)]; }, function (v) { return v[0] + v[1] > 1440 && v[0] + v[1] < 1500 && v[0] % 60 + v[1] % 60 >= 60; }, [930, 525]), end = norm(v[0] + v[1]);
          var A = hm(v[0]), B = hm(v[1]), H = A[0] + B[0], M = A[1] + B[1];
          var c24c = clockChk(end, '24'), c12c = clockChk(end, '12', { bad: [[end + 720, 'u2-ampm', 'Just after midnight is <b>a.m.</b> (12:xx a.m.).']] });
          return fieldsPart('A warehouse shift starts at ' + c24(v[0]) + ' and lasts ' + hmS(v[1]) + '. When does it end? Give the time in both clocks.',
            [{ label: '24-hour clock:', mode: 'math', keys: 'u2clock', placeholder: 'e.g. 14:30 or 2:30 pm', name: '24-hour clock', wide: true }, { label: '12-hour clock:', mode: 'math', keys: 'u2clock', placeholder: 'e.g. 14:30 or 2:30 pm', name: '12-hour clock', wide: true }],
            combo([{ name: '24-hour clock', at: 0, chk: c24c }, { name: '12-hour clock', at: 1, chk: c12c }]), [c24(end), c12key(end)], c24(end) + ', which is ' + c12(end),
            sol([raw(A[0], A[1]) + ' + ' + raw(B[0], B[1]) + ' = ' + raw(H, M) + ' = ' + raw(H + 1, M - 60), '24:00 is midnight, so the shift ends at ' + c24(end) + ', which is ' + c12(end)]),
            ['Add the hours and the minutes; regroup 60 min as 1 h.', 'Past 24:00 the clock starts again at 00:00 (midnight).'], 'shift end'); } }] },
      { num: '12', stem: 'Find the hours worked. Give each answer in hours and minutes and in decimal hours (to 2 decimal places).', parts: [
        { id: '12a', level: 'EMG', make: function (r) {
          var v = find(function () { return [clockMin(r.int(7, 9), r.pick([15, 30, 45])), clockMin(r.int(16, 17), r.pick([0, 15, 30]))]; }, function (v) { return !(v[0] === 510 && v[1] === 1035) && (v[1] - v[0] - 30) % 60 !== 0 && (v[1] - v[0]) > 450; }, [525, 1020]);
          var who = r.pick([['Leo', 'a hardware store'], ['Maya', 'a garden centre'], ['Ravi', 'a lumber yard']]), len = v[1] - v[0], w = len - 30, cu = countUp(v[0], v[1], '12');
          return hmDecPart(who[0] + ' works at ' + who[1] + ' from ' + c12(v[0]) + ' to ' + c12(v[1]) + ', with a 30 min unpaid lunch.', w, { bad: [[len, 'u2-break', 'Take off the 30 min unpaid lunch.']], decBad: [[len / 60, 'u2-break', 'Take off the 30 min unpaid lunch first.']],
            sol: sol(cu.lines.concat(['Take off the lunch: ' + hmS(len) + ' − 30 min = ' + hmS(w), decLine(w)])), hints: ['Count up from the start to the end, then take off the unpaid lunch.'], text: 'hours worked' }); } },
        { id: '12b', level: 'PRG', make: function (r) {
          var v = find(function () { var a = clockMin(r.int(10, 11), r.pick([0, 30])), b = clockMin(r.int(13, 14), r.pick([15, 45, 30])), c = clockMin(r.int(16, 17), r.pick([0, 30])), d = clockMin(r.int(20, 21), r.pick([10, 20, 40, 50])); return [a, b, c, d]; },
            function (v) { var t1 = v[1] - v[0], t2 = v[3] - v[2]; return t1 % 60 + t2 % 60 < 60 + 50 && (t1 + t2) % 30 !== 0 && v[2] > v[1]; }, [660, 855, 1020, 1300]);
          var b1 = v[1] - v[0], b2 = v[3] - v[2], tot = b1 + b2;
          return hmDecPart('A server works a split shift: ' + c12(v[0]) + ' to ' + c12(v[1]) + ', and ' + c12(v[2]) + ' to ' + c12(v[3]), tot, {
            bad: [[b1, 'u2-one-block', 'That’s only the first block. Add the second block too.'], [b2, 'u2-one-block', 'That’s only the second block. Add the first block too.'], [v[3] - v[0], 'u2-one-block', 'That counts the time off in the middle. Find each block, then add them.']],
            decBad: [[(v[3] - v[0]) / 60, 'u2-one-block', 'Don’t count the time off between the blocks.']], raw: addRawList([b1, b2]),
            sol: sol(['First block: ' + countUp(v[0], v[1], '12').lines.slice(-1)[0].replace('Total: ', ''), 'Second block: ' + countUp(v[2], v[3], '12').lines.slice(-1)[0].replace('Total: ', '')].concat(addSol([b1, b2])).concat([decLine(tot)])),
            hints: ['Find the time for each block, then add.', 'Change to decimal hours at the end.'], text: 'split shift' }); } }] },
      { num: '13', stem: function (sh) { return sh.who + ' is an apprentice ' + sh.trade + '. Her timesheet uses the 24-hour clock.'; },
        shared: function (r) {
          var rows = sheetDays(r, { n: 5, mode: '24', days: DAYS.slice(0, 5), starts: [[24, 30], [24, 30], [26, 32], [48, 52], [52, 56]], len: [66, 105], breaks: null });
          if (!rows) rows = [{ day: 'Monday', in: 390, out: 900 }, { day: 'Tuesday', in: 390, out: 885 }, { day: 'Wednesday', in: 435, out: 950 }, { day: 'Thursday', in: 720, out: 1220 }, { day: 'Friday', in: 820, out: 1145 }].map(function (x, i) { x.len = x.out - x.in; x.brk = i === 2 ? 45 : 30; x.worked = x.len - x.brk; return x; });
          return { who: r.pick(['Mei', 'Ana', 'Jasmine', 'Priya']), trade: r.pick(['electrician', 'plumber', 'welder', 'carpenter']), rows: rows };
        },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) { return sheetTable(sh.rows, '24', 'Complete the timesheet: the time in to out and the hours worked each day.'); } },
          { id: '13b', level: 'PRG', make: function (r, sh) { return sheetTotals(sh.rows, 'Find the total hours for the week, in hours and minutes and in decimal hours (2 places).' + sheetShow(sh.rows, '24')); } }] },
      { num: '14', stem: function (sh) { return sh.who + ' worked from ' + c12(sh.a) + ' to ' + c12(sh.b) + ' with no break. Here is her work:<br>&nbsp;&nbsp;' + c12(sh.b) + ' = ' + c24(sh.b) + ' &nbsp;&nbsp; ' + t(sh.dB + '-' + sh.dA + '=' + sh.dR) + ' &nbsp;&nbsp; “I worked ' + sh.dR + ' h.”'; },
        shared: function (r) { var v = find(function () { return [clockMin(r.int(8, 10), r.int(7, 11) * 5), clockMin(r.int(15, 17), r.int(1, 6) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60 && !(v[0] === 590 && v[1] === 980); }, [590, 980]);
          var A = hm(v[0]), B = hm(v[1]), dA = A[0] + '.' + pad(A[1]), dB = B[0] + '.' + pad(B[1]); return { who: r.pick(['Ana', 'Rosa', 'Leah', 'Nia']), a: v[0], b: v[1], dA: dA, dB: dB, dR: (Number(dB) - Number(dA)).toFixed(2) }; },
        parts: [
          { id: '14a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What is her mistake?', [
              { html: 'She subtracted the times like decimals, as if an hour had 100 minutes.', right: true },
              { html: 'She should have added the times instead of subtracting.', why: 'To find the time worked you do subtract (or count up) — the problem is how she subtracted.', code: 'u2-added' },
              { html: 'She changed ' + c12(sh.b) + ' to ' + c24(sh.b) + ', but it should be ' + pad(Math.floor(sh.b / 60) - 12) + ':' + pad(sh.b % 60) + '.', why: 'For p.m. you do add 12, so ' + c24(sh.b) + ' is right. Look at the subtraction.', code: 'u2-pm12' },
              { html: 'There is no mistake: ' + sh.dR + ' h is right.', why: 'Check the minutes: ' + sh.dR + ' would mean there are ' + sh.dR.split('.')[1] + ' “minutes”, more than in an hour. An hour has 60 minutes, not 100.', code: 'u2-dec-sub' }],
              'She subtracted the clock times like decimals, as if an hour had 100 minutes. Clock minutes go up to 60.', ['Can a time have ' + sh.dR.split('.')[1] + ' minutes in it?'], 'Ana mistake'); } },
          { id: '14b', level: 'PRG', make: function (r, sh) { var d = sh.b - sh.a, B = hm(sh.b);
            return hmDecPart('Find the correct time worked, in hours and minutes and in decimal hours.', d, { raw: elapsedRaw(sh.a, sh.b), decBad: [[Number(sh.dR), 'u2-dec-sub', 'That’s her answer. Subtract the hours and minutes with 60 minutes in an hour.']],
              sol: sol([c24(sh.b) + ' − ' + c24(sh.a) + ' → borrow 1 h: ' + pad(B[0] - 1) + ':' + (B[1] + 60) + ' − ' + c24(sh.a) + ' = ' + hmS(d), '(Count up: ' + countUp(sh.a, sh.b, '12').lines.slice(-1)[0].replace('Total: ', '') + '.)', decLine(d)]), hints: ['Count up from the start time, or borrow 1 h as 60 min.'], text: 'Ana correct' }); } }] },
      { num: '15', stem: function (sh) { return sh.who + ' wants to work exactly ' + sh.T + ' h this week. So far he has worked ' + hmS(sh.d[0]) + ' on Monday, ' + hmS(sh.d[1]) + ' on Tuesday and ' + hmS(sh.d[2]) + ' on Thursday. His Saturday shift starts at ' + c12(sh.st) + ' and will include a ' + sh.brk + ' min unpaid break.'; },
        shared: function (r) { return find(function () { var d = [clockMin(r.int(3, 5), r.int(5, 11) * 5), clockMin(r.int(3, 5), r.int(1, 11) * 5), clockMin(r.int(4, 6), r.int(1, 11) * 5)], T = r.pick([20, 22, 24, 25]), so = d[0] + d[1] + d[2]; return { who: r.pick(['Jesse', 'Marcus', 'Diego', 'Owen']), d: d, T: T, so: so, need: T * 60 - so, st: clockMin(r.int(8, 11), r.pick([0, 15, 30, 45])), brk: r.pick([30, 30, 45]) }; },
          function (s) { return s.need >= 300 && s.need <= 480 && (s.d[0] % 60 + s.d[1] % 60 + s.d[2] % 60) >= 60 && s.need % 60 !== 0; }, { who: 'Jesse', d: [225, 260, 330], T: 20, so: 815, need: 385, st: 615, brk: 30 }); },
        parts: [
          { id: '15', level: 'ADV', make: function (r, sh) {
            var end = sh.st + sh.need + sh.brk;
            var hc = hmChk(sh.need, { bad: [[sh.so, 'u2-start-only', 'That’s what he has worked so far. Subtract it from ' + sh.T + ' h.'], [sh.need + sh.brk, 'u2-break', 'That includes the break. How much <b>work</b> does he still need?']], raw: subRawList(sh.T * 60, sh.so) });
            var cc = clockChk(end, 'either', { bad: [[norm(sh.st + sh.need), 'u2-no-break-end', 'The unpaid break is part of his shift too. Add it on before finding the end time.'], [norm(sh.st + sh.so), 'u2-start-only', 'Add the time he still <b>needs</b>, not the time he has already worked.']] });
            var S = hm(sh.st), L = hm(sh.need + sh.brk);
            return fieldsPart('How much more work does he need, and what time should his Saturday shift end?',
              hmFields('Work still needed:').concat([{ label: 'Shift ends at:', mode: 'math', keys: 'u2clock', placeholder: 'e.g. 14:30 or 2:30 pm', name: 'End time', wide: true }]),
              combo([{ name: 'Work still needed', at: [0, 1], chk: hc }, { name: 'End time', at: 2, chk: cc }]), hmKey(sh.need).concat([c12key(end)]), hmS(sh.need) + '; the shift ends at ' + c12(end) + ' (' + c24(end) + ')',
              sol(['So far: ' + addSol(sh.d).join('; '), 'Still needed: ' + subSol(sh.T * 60, sh.so).join(' ') + ' of work', 'Add the break: ' + hmS(sh.need) + ' + ' + sh.brk + ' min = ' + hmS(sh.need + sh.brk) + ' from start to end',
                c24(sh.st) + ' + ' + hmS(sh.need + sh.brk) + ' = ' + raw(S[0] + L[0], S[1] + L[1]) + (S[1] + L[1] >= 60 ? ' = ' + c24(end) : '') + '. His shift should end at ' + c12(end)]),
              ['Add what he has worked so far, then subtract from ' + sh.T + ' h.', 'His shift is the work still needed <b>plus</b> the break. Add that to the start time.'], 'Jesse end'); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) { var h = r.int(2, 9), m = r.pick([15, 45, 30, 12, 24, 36, 48]), min = h * 60 + m;
          return P.mc(r, h + ' h ' + m + ' min written in decimal hours is', [{ html: dS(rnd(min / 60, 2)) + ' h', right: true }, { html: h + '.' + pad(m) + ' h', why: 'The minutes are not the digits after the decimal point. Divide ' + m + ' by 60.', code: 'u2-dot-min' },
            { html: dS(rnd(m / 60, 2)) + ' h', why: 'That is only the ' + m + ' min. Add the ' + h + ' whole hours.', code: 'u2-no-whole' }, { html: min + ' h', why: 'That is the number of <b>minutes</b> (' + min + ' min), not hours.', code: 'u2-total-min' }],
            t(m + '\\div 60=' + dS(m / 60)) + ', so ' + dS(min / 60) + ' h.', ['Divide the minutes by 60.'], 'MC decimal'); } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var v = find(function () { return [clockMin(r.int(20, 22), r.int(3, 11) * 5), clockMin(r.int(5, 7), r.int(1, 6) * 5)]; }, function (v) { var d = elapsed(v[0], v[1]); return v[0] % 60 > v[1] % 60 && !(v[0] === 1365 && v[1] === 435) && [d, d + 60, (v[0] - 720) - v[1], v[0] - v[1]].filter(function (x, i, a) { return a.indexOf(x) === i; }).length === 4; }, [1300, 370]);
          var d = elapsed(v[0], v[1]), cu = countUp(v[0], v[1], '12');
          return mcTimes(r, 'A shift from ' + c12(v[0]) + ' to ' + c12(v[1]) + ' lasts', d, [[(v[0] - 720) - v[1], 'That subtracts ' + c12(v[1]).replace(/ a\.m\./, '') + ' from ' + c12(v[0]).replace(/ p\.m\./, '') + '. Count up from the start, through midnight.', 'u2-backwards'],
            [d + 60, 'Count the whole hours again — from ' + c12(Math.ceil(v[0] / 60) * 60) + ' to ' + c12(Math.floor(v[1] / 60) * 60), 'u2-count-hours'], [v[0] - v[1], 'That subtracts ' + c24(v[1]) + ' from ' + c24(v[0]), 'u2-backwards']],
            sol(cu.lines), ['Count up: to the next hour, the whole hours through midnight, then the minutes left.'], 'MC night shift'); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var h = r.int(2, 9), m = r.pick([6, 12, 18, 24, 36, 42, 48, 54]);
          return decPart(h + ' h ' + m + ' min written in decimal hours is ____ h.', h + m / 60, { nr: true, min: h * 60 + m, sol: t(m + '\\div 60=' + dS(m / 60)) + ', so ' + dS(h + m / 60) + ' h', hints: ['Divide the minutes by 60, then add the whole hours.'], text: 'NR decimal' }); } }] },
      { num: '19', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '19', level: 'PRG', make: function (r) {
          var v = find(function () { var a = clockMin(r.int(6, 8), r.pick([0, 30])), b = a + clockMin(r.int(7, 8), r.pick([15, 45, 0, 30])); return [a, b]; }, function (v) { return (v[1] - v[0] - 30) % 60 !== 0 && !(v[0] === 420 && v[1] === 915); }, [420, 915]);
          var who = r.pick(['Dana', 'Sasha', 'Mira']), day = v[1] - v[0] - 30, tot = 2 * day;
          return decPart(who + ' works Saturday and Sunday, from ' + c12(v[0]) + ' to ' + c12(v[1]) + ' each day, with a 30 min unpaid break each day. Her total for the weekend, in decimal hours, is ____ h.', tot / 60,
            { nr: true, min: tot, bad: [[day / 60, 'u2-one-day', 'That is one day. She works two days.'], [2 * (v[1] - v[0]) / 60, 'u2-break', 'Take off the 30 min break each day.'], [(2 * (v[1] - v[0]) - 30) / 60, 'u2-break', 'There is a 30 min break <b>each</b> day.']],
              sol: sol(['Each day: ' + hmS(v[1] - v[0]) + ' − 30 min = ' + hmS(day), 'Two days: ' + addSol([day, day]).join('; '), dS(tot / 60) + ' h']), hints: ['Find one day (minus the break), then double it.'], text: 'NR weekend' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Change to decimal hours. Round to 2 decimal places if needed.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { return toDecPart(r.int(1, 9), 15); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(1, 9), r.pick([40, 20, 10, 50])]; }, function (v) { return !(v[0] === 5 && v[1] === 50); }, [3, 40]); return toDecPart(v[0], v[1]); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 11), r.pick([48, 12, 24, 42, 54, 18])]; }, function (v) { return !(v[0] === 8 && v[1] === 36); }, [10, 48]); return toDecPart(v[0], v[1]); } },
        { id: 'e1d', level: 'PRG', make: function (r) { var n = r.pick([75, 90, 105, 120, 135, 150, 80, 100, 160]); return toDecPart(0, n, { q: n + ' min' }); } }] },
      { num: '2', stem: 'Change to hours and minutes.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { return toHMPart(find(function () { return r.int(1, 9) + 0.75; }, function (x) { return x !== 4.75; }, 2.75)); } },
        { id: 'e2b', level: 'EMG', make: function (r) { return toHMPart(find(function () { return rnd(r.int(2, 9) + r.pick([0.2, 0.4, 0.6, 0.8]), 1); }, function (x) { return x !== 2.4; }, 4.2)); } },
        { id: 'e2c', level: 'EMG', make: function (r) { return toHMPart(r.pick([0.45, 0.15, 0.35, 0.55, 0.65, 0.85, 0.05])); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return toHMPart(rnd(r.int(9, 12) + r.pick([0.3, 0.1, 0.7, 0.9]), 1)); } }] },
      { num: '3', stem: '', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var h = r.int(2, 9); return toMixedPart(h, 30, { prompt: 'Write ' + h + ' h 30 min as a mixed number of hours.' }); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var fr = find(function () { var q = r.pick([4, 3]), p = r.int(q + 1, 3 * q); return red(p, q); }, function (f) { return f[1] > 1 && f[0] > f[1] && !(f[0] === 11 && f[1] === 4) && !(f[0] === 9 && f[1] === 4); }, [7, 4]); return improperPart(fr, { prompt: 'Write ' + t(dfrT(fr)) + ' h as a mixed number, then in hours and minutes.' }); } },
        { id: 'e3c', level: 'PRG', make: function (r) {
          var n = find(function () { return r.int(5, 9) * 60 + r.pick([10, 20, 40, 50, 15, 45]); }, function (x) { return x !== 250; }, 400), h = Math.floor(n / 60), m = n % 60, fr = red(n, 60), part = red(m, 60);
          var fchk = fracChk(fr, 'mixed', function (v) { if (near(v, n / 100)) return { code: 'u2-div100', hint: 'There are 60 minutes in an hour, not 100.' }; return null; });
          return fieldsPart('Write ' + n + ' min in hours and minutes, and as a mixed number of hours.', hmFields('Hours and minutes:').concat([{ label: 'Mixed number:', mode: 'math', keys: 'u2mixed', placeholder: 'e.g. 2 1/4', after: 'h', name: 'Mixed number' }]),
            combo([{ name: 'Hours and minutes', at: [0, 1], chk: hmChk(n, { raw: [[Math.floor(n / 100), n % 100, 'u2-div100', 'An hour has 60 minutes, not 100. Divide ' + n + ' by 60.']] }) }, { name: 'Mixed number', at: 2, chk: fchk }]),
            hmKey(n).concat([mixT(fr)]), hmS(n) + ' = ' + t(dmixT(fr)) + ' h',
            sol([t(n + '\\div 60=' + h) + ' R ' + m + ' (' + t(h + '\\times 60=' + h * 60) + ', ' + t(n + '-' + h * 60 + '=' + m) + ')', hmS(n) + ' = ' + t(h + '\\frac{' + m + '}{60}=' + mixT(fr)) + ' h']),
            ['Divide the minutes by 60: the answer is the hours and the remainder is the minutes.', 'The fraction part is the minutes over 60, simplified.'], 'min to mixed'); } }] },
      { num: '4', stem: 'Add or subtract.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(1, 6), r.int(5, 11) * 5), clockMin(r.int(2, 6), r.int(5, 11) * 5)]; }, function (v) { return v[0] % 60 + v[1] % 60 > 60 && !(v[0] === 265 && v[1] === 230); }, [155, 290]); return addPart(v); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(7, 11), r.int(0, 3) * 5), clockMin(r.int(2, 6), r.int(5, 11) * 5)]; }, function (v) { return v[0] % 60 < v[1] % 60 && !(v[0] === 555 && v[1] === 220); }, [605, 390]); return subPart(v[0], v[1]); } }] },
      { num: '5', stem: 'Change to the other clock.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) { var x = find(function () { return clockMin(r.int(13, 21), r.pick([5, 10, 25, 35, 40, 50])); }, function (v) { return v !== 940; }, 985); return clockPart(c12(x), x, '24', { sol: c12(x) + ' is p.m., so add 12: ' + c24(x), hints: ['p.m.: add 12 to the hour.'], text: 'pm to 24' }); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var x = r.pick([5, 15, 25, 35, 40, 50]); return clockPart(c12(x), x, '24', { sol: c12(x) + ' is just after midnight, so the hour is 00: ' + c24(x), hints: ['12:xx a.m. is just after midnight.'], text: '12am to 24' }); } },
        { id: 'e5c', level: 'BEG', make: function (r) { var x = find(function () { return clockMin(r.int(1, 9), r.pick([5, 10, 25, 35, 45, 55])); }, function (v) { return v !== 375; }, 545); return clockPart(c12(x), x, '24', { sol: c12(x) + ' is a.m.: keep the hour, with 2 digits: ' + c24(x), hints: ['a.m.: keep the hour, and write it with 2 digits.'], text: 'am to 24' }); } },
        { id: 'e5d', level: 'BEG', make: function (r) { var x = find(function () { return clockMin(r.int(13, 22), r.pick([5, 15, 20, 35, 45, 50])); }, function (v) { return v !== 1030 && v !== 1260; }, 1215); return clockPart(c24(x), x, '12', { sol: Math.floor(x / 60) + ' − 12 = ' + (Math.floor(x / 60) - 12) + ', so ' + c12(x), hints: ['Hours 13 to 23: subtract 12, and it is p.m.'], text: '24 to pm' }); } },
        { id: 'e5e', level: 'EMG', make: function (r) { var x = find(function () { return r.pick([5, 15, 20, 30, 35, 55, 50]); }, function (v) { return v !== 45; }, 55); return clockPart(c24(x), x, '12', { bad: [[x + 720, 'u2-ampm', 'Hour 00 is just after <b>midnight</b>, so it is a.m.']], sol: c24(x) + ' is just after midnight: ' + c12(x), hints: ['Hour 00: write 12, and it is a.m.'], text: '00 to 12am' }); } },
        { id: 'e5f', level: 'EMG', make: function (r) { var x = clockMin(12, r.pick([10, 15, 20, 35, 40, 45, 55])); return clockPart(c24(x), x, '12', { sol: 'Hour 12 is just after noon, so ' + c12(x), hints: ['Hour 12 on the 24-hour clock is p.m. (just after noon).'], text: '12 to pm' }); } }] },
      { num: '6', stem: 'Find the elapsed time.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(7, 9), r.int(7, 11) * 5), clockMin(12, r.int(1, 6) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60 && !(v[0] === 520); }, [470, 740]); return elapsedPart(v[0], v[1], '12'); } },
        { id: 'e6b', level: 'EMG', make: function (r) { var v = find(function () { return [clockMin(r.int(13, 15), r.int(7, 11) * 5), clockMin(r.int(20, 22), r.int(0, 5) * 5)]; }, function (v) { return v[1] % 60 < v[0] % 60; }, [875, 1325]); return elapsedPart(v[0], v[1], '24'); } }] },
      { num: '7', section: 'B. Applying', stem: '', parts: [
        { id: 'e7', level: 'EMG', make: function (r) { var d = find(function () { return [clockMin(r.int(2, 5), r.int(5, 11) * 5), clockMin(r.int(3, 6), r.int(5, 11) * 5), clockMin(r.int(1, 4), r.int(5, 11) * 5)]; }, function (d) { var s = d[0] % 60 + d[1] % 60 + d[2] % 60; return s > 120 && (d[0] + d[1] + d[2]) % 15 !== 0; }, [220, 355, 150]), tot = d[0] + d[1] + d[2];
          var who = r.pick(['A painter', 'A drywaller', 'A tiler']);
          return hmDecPart(who + ' keeps a log of her time on one house: ' + hmS(d[0]) + ' on Monday, ' + hmS(d[1]) + ' on Tuesday and ' + hmS(d[2]) + ' on Wednesday. Find her total time in hours and minutes and in decimal hours (2 places).', tot,
            { raw: addRawList(d), label: 'Total:', sol: sol(addSol(d).concat([decLine(tot)])), hints: ['Add the hours, add the minutes, regroup 60 min as 1 h.', 'Then change to decimal hours.'], text: 'painter log' }); } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'PRG', make: function (r) { var a = clockMin(r.pick([22, 23]), r.pick([0, 15, 30, 45])), b = clockMin(r.int(6, 8), r.pick([0, 15, 30])), brk = r.pick([30, 45]), len = elapsed(a, b);
          if ((len - brk) % 60 === 0 && r.chance(0.5)) b += 15; len = elapsed(a, b);
          var cu = countUp(a, b, '24'), w = len - brk;
          return hmPart('A warehouse worker works from ' + c24(a) + ' to ' + c24(b) + ' the next morning, with a ' + brk + ' min unpaid break. How many hours does he work?', w,
            { bad: [[len, 'u2-break', 'Take off the ' + brk + ' min unpaid break.'], [elapsed(b, a) - brk, 'u2-backwards', 'Count forward from ' + c24(a) + ' through midnight to ' + c24(b) + '.']], sol: sol(cu.lines.concat(['− ' + brk + ' min break = ' + hmS(w)])), hints: ['Find the time up to midnight, then add the time after midnight.', 'Take off the break.'], text: 'overnight' }); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'PRG', make: function (r) { var v = find(function () { var a = clockMin(r.int(5, 6), r.pick([0, 30])), b = a + clockMin(2, r.pick([15, 30, 45])), c = clockMin(r.int(16, 17), r.pick([0, 15, 30])), d = c + clockMin(r.int(2, 3), r.pick([15, 30, 45])); return [a, b, c, d]; }, function (v) { return ((v[1] - v[0]) + (v[3] - v[2])) % 60 !== 0 && !(v[0] === 360 && v[1] === 525); }, [360, 525, 990, 1155]);
          var b1 = v[1] - v[0], b2 = v[3] - v[2], tot = b1 + b2;
          return decPart('A lifeguard works a split shift: ' + c12(v[0]) + ' to ' + c12(v[1]) + ', and ' + c12(v[2]) + ' to ' + c12(v[3]) + ' How many hours does she work, in decimal hours?', tot / 60,
            { min: tot, bad: [[b1 / 60, 'u2-one-block', 'That’s only the morning. Add the evening block.'], [b2 / 60, 'u2-one-block', 'That’s only the evening. Add the morning block.'], [(v[3] - v[0]) / 60, 'u2-one-block', 'Don’t count the time off between the blocks.']],
              sol: sol(['Morning: ' + hmS(b1) + '. Evening: ' + hmS(b2) + '.'].concat(addSol([b1, b2])).concat([decLine(tot)])), hints: ['Find each block in hours and minutes, add them, then change to decimal hours.'], text: 'lifeguard' }); } }] },
      { num: '10', stem: function (sh) { return sh.who + ' works part-time at a movie theatre. Complete his timesheet.'; },
        shared: function (r) {
          var rows = sheetDays(r, { n: 4, mode: '12', days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], starts: [[63, 66], [64, 68], [69, 72], [40, 44]], len: [52, 92], breaks: [30, 0, 30, 45] });
          if (rows) rows.forEach(function (x) { if (!x.brk && x.len > 300) { x.len = 260; x.out = x.in + 260; x.worked = 260; } });
          if (!rows || rows.some(function (x) { return x.out >= 1440; })) rows = [{ day: 'Monday', in: 945, out: 1275, brk: 30 }, { day: 'Wednesday', in: 960, out: 1220, brk: 0 }, { day: 'Friday', in: 1035, out: 1430, brk: 30 }, { day: 'Saturday', in: 630, out: 1080, brk: 45 }].map(function (x) { x.len = x.out - x.in; x.worked = x.len - x.brk; return x; });
          return { who: r.pick(['Owen', 'Caleb', 'Ethan']), rows: rows };
        },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) { return sheetTable(sh.rows, '12', 'Complete the timesheet: the time in to out and the hours worked each day.'); } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) { return sheetTotals(sh.rows, 'Find the total hours, in hours and minutes and in decimal hours (2 places).' + sheetShow(sh.rows, '12')); } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'PRG', make: function (r) { var rise = clockMin(1, r.int(5, 11) * 5), bake = r.int(6, 11) * 5, st = find(function () { return clockMin(r.int(9, 11), r.int(5, 11) * 5); }, function (s) { return (s % 60) + ((rise + bake) % 60) >= 60; }, 645), tot = rise + bake, end = st + tot;
          var who = r.pick(['Zoe', 'Ines', 'Kenji']);
          return clockPart('Bread dough must rise for ' + hmS(rise) + ' and then bake for ' + bake + ' min. ' + who + ' starts the rise at ' + c12(st) + ' When will the bread be done?', end, 'either',
            { bad: [[norm(st + rise), 'u2-one-block', 'That’s when the rise ends. Add the baking time too.'], [norm(st + bake), 'u2-one-block', 'Add the rising time too.']], sol: sol(['Total time: ' + addSol([rise, bake]).join('; '), addSol([st, tot])[0].replace(/^.*= /, hmS(st, { full: true }) + ' + ' + hmS(tot, { full: true }) + ' = ') + (st % 60 + tot % 60 >= 60 ? ' = ' + c24(end) : ''), 'The bread is done at ' + c12(end)]),
              hints: ['Add the rising time and the baking time.', 'Add that to the start time; regroup 60 min as 1 h.'], text: 'bread' }); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e12', level: 'EMG', make: function (r) { var h = r.int(3, 9), d = r.pick([2, 4, 7, 1, 3, 8, 9]), x = rnd(h + d / 10, 1);
          return P.mc(r, dS(x) + ' h is the same as', [{ html: h + ' h ' + d * 6 + ' min', right: true }, { html: h + ' h ' + d * 10 + ' min', why: 'The ' + d + ' after the decimal point is not ' + d * 10 + ' min. Multiply ' + t('0.' + d + '\\times 60') + '.', code: 'u2-dot-min' },
            { html: h + ' h ' + d + ' min', why: 'The ' + d + ' after the decimal point is tenths of an hour, not minutes. Multiply ' + t('0.' + d + '\\times 60') + '.', code: 'u2-dot-min' }, { html: Math.round(x * 100) + ' min', why: 'Moving the decimal point doesn’t change hours to minutes. Multiply by 60: ' + dS(x) + ' h is ' + Math.round(x * 60) + ' min.', code: 'u2-div100' }],
            t('0.' + d + '\\times 60=' + d * 6) + ' min, so ' + h + ' h ' + d * 6 + ' min.', ['Multiply only the decimal part by 60.'], 'MC h to min'); } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e13', level: 'EMG', make: function (r) { var a = find(function () { return clockMin(r.int(18, 20), r.int(5, 11) * 5); }, function (x) { return true; }, 1175), len = clockMin(r.int(1, 2), r.pick([15, 30, 45])), b = a + len;
          return decPart('A movie starts at ' + c12(a) + ' and ends at ' + c12(b) + ' Its length in decimal hours is ____ h.', len / 60, { nr: true, min: len, sol: sol(countUp(a, b, '12').lines.concat([decLine(len)])), hints: ['Count up from the start to the end, then change to decimal hours.'], text: 'NR movie' }); } }] },
      { num: '14', section: 'C. Stretch', stem: function (sh) { return 'A trucking company lets its drivers drive at most ' + sh.max + ' h a day. Today ' + sh.who + ' drove from ' + c12(sh.v[0]) + ' to ' + c12(sh.v[1]) + ', then from ' + c12(sh.v[2]) + ' to ' + c12(sh.v[3]); },
        shared: function (r) { var v = find(function () { var a = clockMin(r.int(5, 7), r.int(1, 11) * 5), b = a + clockMin(r.int(3, 4), r.int(1, 11) * 5), c = b + r.int(6, 12) * 5, d = c + clockMin(r.int(3, 4), r.int(1, 11) * 5); return [a, b, c, d]; },
          function (v) { var dr = (v[1] - v[0]) + (v[3] - v[2]); return dr < 11 * 60 - 60 && dr > 7 * 60 && dr % 60 && ((v[1] - v[0]) % 60 + (v[3] - v[2]) % 60) >= 60; }, [370, 635, 680, 905]);
          return { v: v, max: 11, who: r.pick(['Ingrid', 'Harpreet', 'Colleen']), dr: (v[1] - v[0]) + (v[3] - v[2]), rest: r.int(8, 12) * 5 }; },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) { var b1 = sh.v[1] - sh.v[0], b2 = sh.v[3] - sh.v[2], left = sh.max * 60 - sh.dr;
            return hmPart('How much longer can she drive today?', left, { bad: [[sh.dr, 'u2-start-only', 'That’s how long she has driven. Subtract it from ' + sh.max + ' h.'], [sh.max * 60 - b1, 'u2-one-block', 'Count both driving blocks.'], [sh.max * 60 - b2, 'u2-one-block', 'Count both driving blocks.'], [sh.max * 60 - (sh.v[3] - sh.v[0]), 'u2-one-block', 'The break between the blocks isn’t driving. Find each block.']], raw: subRawList(sh.max * 60, sh.dr),
              sol: sol(['First block: ' + hmS(b1) + '. Second block: ' + hmS(b2) + '.', 'Driven: ' + addSol([b1, b2]).join('; '), 'Left: ' + subSol(sh.max * 60, sh.dr).join(' ')]), hints: ['Find each driving block, add them, then subtract from ' + sh.max + ' h.'], text: 'driving left' }); } },
          { id: 'e14b', level: 'ADV', make: function (r, sh) { var left = sh.max * 60 - sh.dr, st = sh.v[3] + sh.rest, end = st + left, S = hm(st), L = hm(left);
            return clockPart('She starts driving again at ' + c12(st) + ' What is the latest time she can stop?', end, 'either', { bad: [[norm(st + sh.dr), 'u2-start-only', 'Add the time she has <b>left</b>, from (a).'], [norm(sh.v[3] + left), 'u2-start-only', 'Start from ' + c12(st) + ', when she starts driving again.']],
              sol: sol([raw(S[0], S[1]) + ' + ' + raw(L[0], L[1]) + ' = ' + raw(S[0] + L[0], S[1] + L[1]) + (S[1] + L[1] >= 60 ? ' = ' + c24(end) : ''), 'She can drive until ' + c12(end)]), hints: ['Add the time left from (a) to ' + c12(st)], text: 'latest stop' }); } }] },
      { num: '15', stem: function (sh) { return 'A factory offers two schedules. <b>Schedule A:</b> ' + sh.a.days + ' days a week, ' + c12(sh.a.st) + ' to ' + c12(sh.a.en) + ', with a ' + sh.a.brk + ' min unpaid break. <b>Schedule B:</b> ' + sh.b.days + ' days a week, ' + c12(sh.b.st) + ' to ' + c12(sh.b.en) + ', with a ' + sh.b.brk + ' min unpaid break.'; },
        shared: function (r) { return find(function () { var a = { days: r.pick([4, 5]), st: clockMin(r.int(6, 8), r.pick([0, 30])), brk: 30 }; a.en = a.st + r.pick([8, 8.5, 9]) * 60 - (r.chance(0.5) ? 0 : 30); var b = { days: a.days - 1, st: clockMin(r.int(5, 6), r.pick([0, 30])), brk: 45 }; b.en = b.st + r.int(10, 12) * 60 + r.pick([0, 15, 30, 45]);
          a.day = a.en - a.st - a.brk; b.day = b.en - b.st - b.brk; a.wk = a.days * a.day; b.wk = b.days * b.day; return { a: a, b: b }; }, function (s) { return s.a.wk !== s.b.wk && Math.abs(s.a.wk - s.b.wk) <= 360 && s.a.wk % 30 === 0 && s.b.wk % 30 === 0; },
          { a: { days: 4, st: 420, en: 930, brk: 30, day: 480, wk: 1920 }, b: { days: 3, st: 360, en: 1005, brk: 45, day: 600, wk: 1800 } }); },
        parts: [
          { id: 'e15ai', sub: 'a i', level: 'PRG', make: function (r, sh) { var A = sh.a, B = sh.b;
            var ca = decChk(A.wk / 60, { bad: [[A.day / 60, 'u2-one-day', 'That is one day. Multiply by ' + A.days + ' days.'], [A.days * (A.day + A.brk) / 60, 'u2-break', 'Take off the break each day.']] }), cb = decChk(B.wk / 60, { bad: [[B.day / 60, 'u2-one-day', 'That is one day. Multiply by ' + B.days + ' days.'], [B.days * (B.day + B.brk) / 60, 'u2-break', 'Take off the break each day.']] });
            return fieldsPart('How many hours does each schedule have each week?', [{ label: 'Schedule A:', after: 'h a week', name: 'Schedule A' }, { label: 'Schedule B:', after: 'h a week', name: 'Schedule B' }],
              combo([{ name: 'Schedule A', at: 0, chk: ca }, { name: 'Schedule B', at: 1, chk: cb }]), [dS(A.wk / 60), dS(B.wk / 60)], 'A: ' + dS(A.wk / 60) + ' h, B: ' + dS(B.wk / 60) + ' h',
              sol(['A: ' + hmS(A.en - A.st) + ' − ' + A.brk + ' min = ' + hmS(A.day) + ' a day; ' + t(A.days + '\\times ' + dS(A.day / 60) + '=' + dS(A.wk / 60)) + ' h', 'B: ' + hmS(B.en - B.st) + ' − ' + B.brk + ' min = ' + hmS(B.day) + ' a day; ' + t(B.days + '\\times ' + dS(B.day / 60) + '=' + dS(B.wk / 60)) + ' h']),
              ['Find the hours for one day (minus the break), then multiply by the number of days.'], 'schedules'); } },
          { id: 'e15aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var A = sh.a, B = sh.b, more = A.wk > B.wk ? 'A' : 'B', less = more === 'A' ? 'B' : 'A', diff = Math.abs(A.wk - B.wk) / 60, dayDiff = Math.abs(A.day - B.day) / 60;
            var opts = [{ html: 'Schedule ' + more + ', by ' + dS(diff) + ' h a week', right: true }, { html: 'Schedule ' + less + ', by ' + dS(diff) + ' h a week', why: 'Compare the weekly hours from (a i): which is bigger?', code: 'u2-compare' }];
            if (!near(dayDiff, diff)) opts.push({ html: 'Schedule ' + (A.day > B.day ? 'A' : 'B') + ', by ' + dS(dayDiff) + ' h a week', why: 'That compares one day of each. Compare the hours for the whole <b>week</b>.', code: 'u2-one-day' });
            opts.push({ html: 'They have the same hours each week.', why: 'Multiply the hours each day by the number of days, then compare.', code: 'u2-compare' });
            return P.mc(r, 'Which schedule has more hours each week, and by how much?', opts, 'A: ' + dS(A.wk / 60) + ' h; B: ' + dS(B.wk / 60) + ' h.<br>Schedule ' + more + ' has ' + dS(diff) + ' h more each week.', ['Use your weekly totals from (a i).'], 'which schedule'); } },
          { id: 'e15b', level: 'EMG', make: function (r, sh) { var A = sh.a, B = sh.b;
            return P.mc(r, 'Which is a good reason a worker might choose Schedule B anyway?', [
              { html: 'Schedule B has ' + (7 - B.days) + ' days off a week instead of ' + (7 - A.days) + ', so there is one less day of travelling to work.', right: true },
              { html: 'Schedule B always pays more, because the days are longer.', why: 'Longer days don’t mean more hours in the week. Compare the weekly hours.', code: 'u2-reason' },
              { html: 'Schedule B has shorter shifts.', why: 'B’s shifts are longer (' + hmS(B.en - B.st) + ' vs ' + hmS(A.en - A.st) + ').', code: 'u2-reason' },
              { html: 'Schedule B has a shorter unpaid break.', why: 'B’s break is ' + B.brk + ' min, longer than A’s ' + A.brk + ' min.', code: 'u2-reason' }],
              'For example: B has more days off (' + (7 - B.days) + ' instead of ' + (7 - A.days) + '), so less travel to work and more free time.', ['Think about days off and travel, not just hours.'], 'schedule reason'); } }] },
      { num: '16', stem: function (sh) { return 'A parking lot charges ' + PK.money$(sh.rate) + ' for each quarter hour or part of a quarter hour. ' + sh.who + ' parks from ' + c12(sh.a) + ' to ' + c12(sh.b); },
        shared: function (r) { var v = find(function () { var a = clockMin(r.int(8, 10), r.int(7, 11) * 5); return [a, a + clockMin(r.int(2, 4), 0) + r.pick([15, 30, 45])]; }, function (v) { return (v[1] - v[0]) % 15 === 0 && (v[1] - v[0]) % 60 !== 0 && v[1] % 60 < v[0] % 60 && v[1] % 60 <= 55 && !(v[0] === 590 && v[1] === 815); }, [590, 815]);
          return { a: v[0], b: v[1], d: v[1] - v[0], rate: r.pick([1.25, 1.5, 1.75, 2]), who: r.pick(['Sam', 'Noor', 'Theo']), extra: r.pick([5, 10]) }; },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, sh) { var fr = red(sh.d, 60);
            var p = fieldsPart('How long does ' + sh.who + ' park, as a mixed number of hours?', [{ label: '', mode: 'math', keys: 'u2mixed', placeholder: 'e.g. 2 1/4', after: 'h', name: 'Mixed number' }], K.fields([fracChk(fr, 'mixed', function (v) { if (near(v, elapsed(sh.b, sh.a) / 60)) return { code: 'u2-backwards', hint: 'Count up from ' + c12(sh.a) + ' to ' + c12(sh.b) }; return null; })], { labels: [null] }),
              [mixT(fr)], t(dmixT(fr)) + ' h', sol(countUp(sh.a, sh.b, '12').lines.concat([hmS(sh.d) + ' = ' + t(mixT(fr)) + ' h'])), ['Count up from the start to the end. Then write the minutes as a fraction of an hour.'], 'park mixed'); return p; } },
          { id: 'e16b', level: 'ADV', make: function (r, sh) { var n = sh.d / 15, pay = n * sh.rate, fr = red(sh.d, 60);
            var nchk = PK.num(n, 0, function (v) { if (v === Math.floor(sh.d / 60) * 4 + (sh.d % 60)) return { code: 'u2-mixed-add', hint: 'Each hour is 4 quarter hours. Write the time as an improper fraction with quarters.' }; if (v === sh.d / 60) return { code: 'u2-total-min', hint: 'That’s hours. How many <b>quarter</b> hours?' }; return null; });
            var mchk = PK.money(pay, function (v) { if (near(v, sh.rate * sh.d / 60)) return { code: 'u2-per-hour', hint: 'The rate is per <b>quarter</b> hour. Multiply by the number of quarter hours.' }; return null; });
            return fieldsPart('How many quarter hours is that, and what does ' + sh.who + ' pay?', [{ label: 'Quarter hours:', name: 'Quarter hours' }, { label: 'Pay:', before: '$', name: 'Pay' }],
              combo([{ name: 'Quarter hours', at: 0, chk: nchk }, { name: 'Pay', at: 1, chk: mchk }]), [String(n), PK.m$(pay)], n + ' quarter hours; ' + PK.money$(pay),
              sol([t(mixT(fr) + '=\\frac{' + n + '}{4}') + ', so ' + n + ' quarter hours.', t(n + '\\times ' + PK.M(sh.rate) + '=' + PK.M(pay))]), ['Change the mixed number to quarters (an improper fraction with 4 on the bottom).', 'Multiply the number of quarter hours by the rate.'], 'park pay'); } },
          { id: 'e16c', level: 'PRG', make: function (r, sh) { var n = sh.d / 15, lv = sh.b + sh.extra;
            return P.mc(r, 'If ' + sh.who + ' leaves at ' + c12(lv) + ' instead, how much more does ' + (sh.who === 'Noor' ? 'she' : 'he') + ' pay?', [
              { html: PK.money$(sh.rate) + ' more: the extra ' + sh.extra + ' min is part of another quarter hour, so it is ' + (n + 1) + ' quarter hours.', right: true },
              { html: 'Nothing more: ' + sh.extra + ' min is less than a quarter hour.', why: 'The lot charges for each quarter hour <b>or part</b> of a quarter hour.', code: 'u2-part-qh' },
              { html: PK.money$(rnd(sh.rate * sh.extra / 15, 2)) + ' more: ' + sh.extra + ' min is ' + t('\\frac{' + sh.extra + '}{15}') + ' of a quarter hour.', why: 'The lot doesn’t charge part of a rate — any part of a quarter hour is charged as a full quarter hour.', code: 'u2-part-qh' },
              { html: PK.money$(4 * sh.rate) + ' more: it starts a new hour.', why: 'The charge is per quarter hour, not per hour.', code: 'u2-per-hour' }],
              hmS(sh.d + sh.extra) + ' is ' + n + ' quarter hours and ' + sh.extra + ' min more. The ' + sh.extra + ' min is part of quarter hour number ' + (n + 1) + ', so the cost is ' + t((n + 1) + '\\times ' + PK.M(sh.rate) + '=' + PK.M((n + 1) * sh.rate)) + ', which is ' + PK.money$(sh.rate) + ' more.', ['Read the sign again: “or part of a quarter hour”.'], 'park extra'); } }] }
    ]
  });
  HW.addCodes({ 'u2-frac-min': 'Wrote the remainder as minutes', 'u2-mixed-add': 'Mixed → improper: added instead of multiplying', 'u2-added': 'Added instead of subtracting', 'u2-one-day': 'Gave one day instead of all the days',
    'u2-compare': 'Compared the wrong way', 'u2-reason': 'Reason with a wrong fact', 'u2-part-qh': 'Ignored “or part of a quarter hour”', 'u2-per-hour': 'Used the rate per hour, not per quarter hour' });
  HW.addPartial({ 'u2-frac-min': 'n', 'u2-mixed-add': 'n', 'u2-one-day': 'b', 'u2-per-hour': 'b' });
})(window);
