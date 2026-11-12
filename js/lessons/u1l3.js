/* Math 10-3 · Unit 1 · Lesson 3 — Ratios (N1)
 * Assignment 3 (u1_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u1_ep03.tex, Questions 1–15).
 * Every part is a generator: the same kind of ratio as the booklet item (part-to-part / part-to-whole, a GCF that is
 * easy or hard to spot, decimal terms, different units, a ratio table, three-term mixes, sharing a total, working
 * backwards from one share), new numbers around the booklet's (never the lesson's worked-example numbers).
 * Ratio answers are typed with a small ratio keypad (digits, ":" and a fraction key) and read by readRatio():
 * "3:5", "3 to 5" and a fraction 3/5 all count. "Simplest form" items nudge an unsimplified ratio or decimal terms
 * (no try used); a reversed ratio, a ratio with the wrong whole, or units not changed get their own hints.
 * Money answers to the cent ("$45", "45.00", "45.000" all fine; 45.4 for 45.38 is nudged).
 * Conversions: the "complete the table" of colon / words / fraction / part-to-part → ratio boxes + a part-to-part or
 * part-to-whole table of choices + a "which shows it in words and as a fraction" multiple choice; ratio tables → the
 * table shown in the prompt with lettered blanks and a box per letter; "circle all that are" → tap all that fit;
 * "explain" (paint shades, Jordan's mistake) → multiple choice whose options are reasons; yes/no lists → a table of
 * choices. Calculator allowed.
 *
 * Exports HW.u1ratio (the ratio kit: keypad, readRatio, ratioChk, moneyChk, numChk, multiChk, table helper, part
 * builders) for Lesson 1.4 — so this file must load before js/lessons/u1l4.js. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- the ratio keypad: digits, ":" and a fraction key ---------- */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u1ratio) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u1ratio = [
      [dk(7), dk(8), dk(9), { label: '<b>:</b>', tex: ':', plain: ':', title: 'Colon (between the terms of a ratio)' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of a fraction)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u1ratio = ['Type the first term, press <b>:</b>, then the next term, e.g. ' + HW.k('3:5') + '. A fraction ' + HW.k('\\frac{3}{5}') + ' works too (press <b><sup>a</sup>⁄<sub>b</sub></b>).',
      'Type a ratio with a colon, e.g. <code>3:5</code> (or <code>3/5</code>).'];
  }

  /* ================= numbers ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function gcdAll(a) { return a.reduce(function (g, x) { return gcd(g, x); }, 0); }
  function rnd(x, dp) { var f = Math.pow(10, dp == null ? 6 : dp); return Math.round(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f; }
  function nf(x) { return String(rnd(x, 6)); }                        // 1.5 → "1.5", 2 → "2"
  function nT(x) { return HW.fmt(nf(x)); }                            // LaTeX (thin-space thousands)
  function rT(a) { return a.map(nT).join(':'); }                      // a ratio in LaTeX
  function decPl(x) { return (nf(x).split('.')[1] || '').length; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function simp(a) { var w = toWhole(a).a, g = gcdAll(w) || 1; return w.map(function (x) { return x / g; }); }
  function toWhole(a) { var d = Math.max.apply(null, a.map(decPl)), f = Math.pow(10, d); return { f: f, a: a.map(function (x) { return Math.round(x * f); }) }; }
  function money(x) { return HW.fmt(rnd(x, 2).toFixed(2)); }         // "1\,050.00"
  function mT(x) { return '\\$' + money(x); }                          // LaTeX money
  function mP(x) { return isInt(x) ? '\\$' + Math.round(x) : mT(x); }    // money in a prompt: $40, $187.50
  function pl(n, w) { return Math.abs(n - 1) < 1e-9 ? w.replace(/s$/, '') : w; }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function same(a, b) { if (!a || !b || a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (!(a[i] > 0) || !(b[i] > 0) || Math.abs(a[i] * b[0] - a[0] * b[i]) > 1e-9 * Math.max(1, a[i] * b[0])) return false; return true; }
  function find(gen, test, fallback) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function cop(r, lo, hi, test) { return find(function () { return [r.int(lo, hi), r.int(lo, hi)]; }, function (v) { return v[0] !== v[1] && gcd(v[0], v[1]) === 1 && (!test || test(v)); }, [2, 3]); }
  function inList(v, list) { return list.some(function (x) { return x.length === v.length && x.every(function (y, i) { return Math.abs(y - v[i]) < 1e-9; }); }); }
  function br(lines) { return lines.filter(Boolean).join('<br>'); }
  function u(s) { return '\\text{ ' + s + '}'; }                        // a unit inside KaTeX

  /* ================= reading a ratio ================= */
  /* -> { terms:[…], kind:'colon'|'frac'|'single'|'mixed' } or { res: form result } */
  function readRatio(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\left|\\right/g, '').replace(/\\colon|\\ratio|∶|\\mathrel\{:\}|\\vdots/g, ':');
    s = s.replace(/\\(?:text|mathrm|operatorname)\{\s*to\s*\}/gi, ':').replace(/\bto\b/gi, ':');
    s = s.replace(/\\\$|\$/g, '');
    var p = HW.parse.plain(s).replace(/,(?=\d{3}(\D|$))/g, '');
    var mm = /^(\d+)(?:\s+|(?=\())\(?(\d+)\)?\s*\/\s*\(?(\d+)\)?$/.exec(p);
    if (mm) return { kind: 'mixed', terms: [Number(mm[1]) * Number(mm[3]) + Number(mm[2]), Number(mm[3])] };
    var q = p.replace(/\s+/g, '');
    if (!q) return { res: form('empty', 'Type your answer first.') };
    var N = '(\\d+(?:\\.\\d*)?|\\.\\d+)';
    var fr = new RegExp('^\\(?' + N + '\\)?\\/\\(?' + N + '\\)?$').exec(q);
    if (fr) return { kind: 'frac', terms: [Number(fr[1]), Number(fr[2])] };
    if (new RegExp('^' + N + '$').test(q)) return { kind: 'single', terms: [Number(q)] };
    if (/:/.test(q)) {
      var bits = q.split(':');
      if (bits.some(function (b) { return b === ''; })) return { res: form('u1l3-incomplete', 'Your ratio has an empty term. Put a number on both sides of every colon.') };
      if (bits.every(function (b) { return new RegExp('^' + N + '$').test(b); })) return { kind: 'colon', terms: bits.map(Number) };
    }
    if (/^\d+(\.\d+)?(,\d+(\.\d+)?)+$/.test(q)) return { res: form('u1l3-comma', 'Put a colon between the terms of a ratio (like ' + t('3:5') + '), not a comma.') };
    if (/[a-z]/i.test(q)) return { res: form('units', 'Leave the units out — just the numbers with a colon between them, like ' + t('3:5') + '.') };
    return { res: form('unreadable', 'Write the ratio with a colon between the terms, like ' + t('3:5') + '.') };
  }
  /* want: the answer's terms. o.simplest (default true) — must be whole numbers with no common factor;
   * o.colon / o.frac — insist on that form (nudge otherwise); o.wrongs [{r:[…], code, hint}] recognised wrong ratios;
   * o.orig — the ratio being simplified (spots "divided only one term"); o.rev — hint for the reversed ratio */
  function ratioChk(want, o) {
    o = o || {};
    var simplest = o.simplest !== false;
    var wrongs = (o.wrongs || []).filter(function (w) { return !same(w.r, want); });
    return function (resp) {
      var a = readRatio(resp); if (a.res) return a.res;
      var T = a.terms;
      if (a.kind === 'mixed') return form('u1l3-mixed', 'Don’t change a ratio into a mixed number. A ratio compares two numbers, so keep both terms (like ' + t('5:3') + ').');
      if (a.kind === 'single') {
        if (want.length === 2 && Math.abs(T[0] - want[0] / want[1]) < 0.01) return form('u1l3-single', 'That’s the ratio as one decimal. A ratio keeps both terms: write it with a colon, like ' + t('3:5') + '.');
        return form('u1l3-single', 'A ratio needs ' + (want.length === 3 ? 'three terms' : 'two terms') + ' with a colon between them, like ' + t(want.length === 3 ? '4:2:1' : '3:5') + '.');
      }
      if (T.some(function (x) { return !(x > 0); })) return wrong('u1l3-zero', 'Each term of this ratio is an amount bigger than ' + t('0') + '.');
      if (T.length !== want.length) {
        for (var j = 0; j < wrongs.length; j++) if (same(T, wrongs[j].r)) return wrong(wrongs[j].code, wrongs[j].hint);
        return wrong('u1l3-terms', 'This ratio compares ' + (want.length === 3 ? 'three' : 'two') + ' amounts, so it needs ' + (want.length === 3 ? 'three' : 'two') + ' terms.');
      }
      if (same(T, want)) {
        if (o.frac && a.kind !== 'frac') return form('u1l3-as-frac', 'Right ratio — now write it as a <b>fraction</b> (use the ' + t('\\frac{a}{b}') + ' key).');
        if (o.colon && a.kind === 'frac') return form('u1l3-as-colon', 'Right ratio — now write it with a <b>colon</b>, like ' + t('3:5') + '.');
        if (!simplest) return ok();
        if (T.some(function (x) { return !isInt(x); })) return form('u1l3-whole', 'Right ratio — but the terms of a simplified ratio are <b>whole numbers</b>. Multiply every term by ' + t(toWhole(T).f) + ', then simplify.');
        var g = gcdAll(T); if (g > 1) return form('u1l3-simplify', 'Right ratio — now simplify it: divide every term by ' + t(g) + ' (the greatest common factor).');
        return ok();
      }
      for (var i = 0; i < wrongs.length; i++) if (same(T, wrongs[i].r)) return wrong(wrongs[i].code, wrongs[i].hint);
      if (T.length === 2 && same(T, [want[1], want[0]])) return wrong('u1l3-reversed', o.rev || 'Order matters: the first amount named goes first. Your ratio is the wrong way round.');
      if (o.orig && T.length === 2 && ((Math.abs(T[0] - o.orig[0]) < 1e-9) !== (Math.abs(T[1] - o.orig[1]) < 1e-9))) return wrong('u1l3-one-term', 'Divide <b>both</b> terms by the same number. You changed only one of them.');
      return wrong('value', null);
    };
  }
  function ratioPart(prompt, want, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'math', keys: 'u1ratio', before: o.before, placeholder: 'e.g. 3:5' }, check: ratioChk(want, o), key: o.frac ? '\\frac{' + nT(want[0]) + '}{' + nT(want[1]) + '}' : rT(want),
      answer: t(o.frac ? '\\frac{' + nT(want[0]) + '}{' + nT(want[1]) + '}' : rT(want)), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = (o.wrongs || []).filter(function (w) { return !same(w.r, want); }).map(function (w) { return rT(w.r); });
    if (want.length === 2 && !o.frac && !o.colon) p.good = [nf(want[0]) + ' to ' + nf(want[1]), '\\frac{' + nf(want[0]) + '}{' + nf(want[1]) + '}'];
    if (want.length === 2 && !o.frac && want[0] !== want[1]) p.bad.push(rT([want[1], want[0]]));
    return p;
  }

  /* ================= numbers and money ================= */
  function matchW(v, wrongs, tol) { for (var i = 0; i < (wrongs || []).length; i++) if (Math.abs(v - wrongs[i].v) <= (tol || 1e-6 * Math.max(1, Math.abs(wrongs[i].v)))) return { code: wrongs[i].code, hint: wrongs[i].hint }; return null; }
  function cleanW(wrongs, x, tol) { return (wrongs || []).filter(function (w) { return w && isFinite(w.v) && w.v > 0 && Math.abs(w.v - x) > (tol || 1e-6 * Math.max(1, Math.abs(x))); }); }
  function commaNudge(raw) { return /^\d+,\d{1,2}$/.test(String(raw).replace(/\s/g, '')) ? form('u1l3-comma-dec', 'Use a decimal point, not a comma (for example ' + t('1.5') + ').') : null; }
  /* a number (no money). o.dp: the answer must be rounded to dp places (K.approx rules) */
  function numChk(x, wrongs, o) {
    o = o || {};
    var ws = cleanW(wrongs, o.dp != null ? rnd(x, o.dp) : x, o.dp != null ? Math.pow(10, -o.dp) / 2 : null);
    var dg = function (v) { return matchW(v, ws, o.dp != null ? Math.pow(10, -o.dp) / 2 + 1e-9 : null); };
    var base = o.dp != null ? K.approx(x, o.dp, { diag: dg, diagFirst: true }) : K.number(x, dg);
    return function (resp) {
      var raw = String(resp == null ? '' : resp).trim(), c = commaNudge(raw); if (c) return c;
      return base(raw.replace(/^\\\$|^\$/, ''));
    };
  }
  /* money to the cent: x is the exact amount */
  function moneyChk(x, wrongs) {
    var want = rnd(x, 2), ws = cleanW(wrongs, want, 0.004);
    return function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\\$|\$/g, '').replace(/\\[,;: ]|~/g, '').trim(), c = commaNudge(raw); if (c) return c;
      var pn = HW.parse.number(raw);
      if (!pn.ok) return K.number(want)(raw);
      var v = pn.value, dec = (HW.parse.plain(raw).replace(/\s/g, '').split('.')[1] || '').length;
      if (Math.abs(v - want) < 1e-9) return ok();
      var h = Math.abs(rnd(v, 2) - want) < 1e-9 ? null : matchW(rnd(v, 2), ws.map(function (w) { return { v: rnd(w.v, 2), code: w.code, hint: w.hint }; }), 1e-6); if (h) return wrong(h.code, h.hint);
      if (dec > 2 && Math.abs(rnd(v, 2) - want) < 1e-9) return form('u1l3-cent', 'Right — now round to the nearest cent (two decimal places).');
      if (!isInt(x * 100)) {
        var lo = Math.floor(x * 100 + 1e-9) / 100, hi = Math.ceil(x * 100 - 1e-9) / 100, other = Math.abs(lo - want) < 1e-9 ? hi : lo;
        if (Math.abs(v - other) < 1e-9) return wrong('u1l3-round-dir', 'Check your rounding to the cent: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      }
      if (dec < 2 && Math.abs(v - want) < 0.1 && !isInt(want * 10)) return form('u1l3-cent', 'Give the amount to the cent (two decimal places).');
      return wrong('value', null);
    };
  }
  function numPart(prompt, x, o) {
    o = o || {};
    var key = o.dp != null ? rnd(x, o.dp).toFixed(o.dp) : nf(x);
    var p = { prompt: prompt, input: { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: o.nr ? K.number(o.dp != null ? rnd(x, o.dp) : x, function (v) { return matchW(v, cleanW(o.wrongs, x)); }, { nr: true }) : numChk(x, o.wrongs, o),
      key: key, answer: t(HW.fmt(key) + (o.unit ? u(o.unit) : '')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = cleanW(o.wrongs, o.dp != null ? rnd(x, o.dp) : x, o.dp != null ? Math.pow(10, -o.dp) / 2 : null).map(function (w) { return nf(w.v); });
    return p;
  }
  function moneyPart(prompt, x, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', before: '$' }, check: moneyChk(x, o.wrongs), key: rnd(x, 2).toFixed(2), answer: t(mT(x)), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = cleanW(o.wrongs, rnd(x, 2), 0.004).map(function (w) { return rnd(w.v, 2).toFixed(2); });
    p.good = ['$' + rnd(x, 2).toFixed(2), rnd(x, 2).toFixed(2) + '0'];
    return p;
  }
  /* several boxes: checkers[i] for box i; vals (optional) = the numeric answers, to spot answers in each other's boxes */
  function numOf(s) { var p = HW.parse.number(String(s == null ? '' : s).replace(/\\\$|\$/g, '').replace(/\s*[a-zA-Z]{1,3}\s*$/, '').trim()); return p.ok ? p.value : NaN; }
  function multiChk(checkers, labels, vals) {
    return function (resp) {
      resp = resp || [];
      var res = checkers.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      if (res.every(function (r) { return r.v === 'correct'; })) return ok();
      if (resp.every(function (x) { return !String(x == null ? '' : x).trim(); })) return form('empty', 'Fill in the boxes first.');
      if (vals && vals.length > 1) {
        var got = resp.map(numOf);
        if (got.every(isFinite)) {
          var a = got.slice().sort(function (x, y) { return x - y; }), b = vals.map(function (v) { return rnd(v, 2); }).sort(function (x, y) { return x - y; });
          if (a.every(function (x, i) { return Math.abs(x - b[i]) < 1e-6; }) && got.some(function (x, i) { return Math.abs(x - rnd(vals[i], 2)) > 1e-6; })) return wrong('amt-swap', 'You have the right amounts, but in the wrong boxes. Check which one goes with which.');
        }
      }
      var firstForm = null, firstWrong = null;
      for (var i = 0; i < res.length; i++) {
        var r = res[i]; if (r.v === 'correct') continue;
        var out = { v: r.v, code: r.code, hint: '<b>' + labels[i] + ':</b> ' + (r.hint || 'Check this one again.') };
        if (r.v === 'form') { if (!firstForm) firstForm = out; } else if (!firstWrong) firstWrong = out;
      }
      return firstWrong || firstForm || ok();
    };
  }
  /* fields: [{label, name, before, after, mode, keys}] */
  function fieldsPart(prompt, fields, checkers, keys, answer, o) {
    o = o || {};
    var labels = fields.map(function (f) { return String(f.name || f.label || '').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: fields }, check: multiChk(checkers, labels, o.vals), key: keys, answer: answer, solution: o.sol, hints: o.hints || [], text: o.text };
    if (o.bad) p.bad = o.bad;
    return p;
  }
  function ratioField(label, name) { return { label: label, name: name || label, mode: 'math', keys: 'u1ratio', placeholder: 'e.g. 3:5' }; }

  /* a table for the prompt; a cell {b:'A'} is a lettered blank */
  function blank(L) { return '<span style="display:inline-block;min-width:1.7em;padding:0 5px;border:1.5px dashed #9a6a24;border-radius:6px;background:#fff8e8;font-weight:700;color:#6e4a1c">' + L + '</span>'; }
  function tbl(rows) {
    return '<table class="vtab">' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) {
      var h = c && typeof c === 'object' ? blank(c.b) : typeof c === 'number' ? t(nT(c)) : String(c);
      return i === 0 ? '<th style="text-align:left">' + h + '</th>' : '<td>' + h + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  /* worked simplification, one step per line */
  function simpLines(a) {
    var L = [], w = toWhole(a);
    if (w.f > 1) L.push('Multiply every term by ' + t(w.f) + ': ' + t(rT(a) + '\\to ' + rT(w.a)));
    var g = gcdAll(w.a);
    if (g > 1) L.push('Divide every term by the GCF, ' + t(g) + ': ' + t(rT(w.a) + '\\to ' + rT(w.a.map(function (x) { return x / g; }))));
    else if (w.f === 1) L.push(t(rT(w.a)) + ' is already in simplest form (no common factor except ' + t('1') + ').');
    return L;
  }
  function pron(n) { return /^(Priya|Jaya|Riya|Lena|Tara|Mia|Ava|Ellie|Nadia|Kayla|Sofia|Maya|Aisha|Grace|Hana|Zoe|Ella|Bea|Mai|Sasha)$/.test(n) ? 'she' : 'he'; }

  HW.addCodes({
    'u1l3-reversed': 'Ratio written the wrong way round', 'u1l3-simplify': 'Ratio not fully simplified', 'u1l3-whole': 'Decimal terms left in a simplified ratio',
    'u1l3-single': 'Gave one number instead of a ratio', 'u1l3-mixed': 'Wrote the ratio as a mixed number', 'u1l3-terms': 'Wrong number of terms', 'u1l3-one-term': 'Divided only one term',
    'u1l3-whole-wrong': 'Used the wrong whole (part-to-whole)', 'u1l3-not-whole': 'Part-to-part instead of part-to-whole', 'u1l3-no-convert': 'Did not change to the same unit', 'u1l3-wrong-factor': 'Wrong unit conversion factor',
    'u1l3-added': 'Added instead of multiplying (ratio table)', 'u1l3-one-term-div': 'Divided the total by one term instead of the total parts', 'u1l3-per-part': 'Gave one part instead of the share',
    'u1l3-total-parts': 'Multiplied by the total parts from the wrong share', 'u1l3-cent': 'Not rounded to the cent', 'u1l3-round-dir': 'Rounded the cents the wrong way', 'u1l3-comma-dec': 'Comma for a decimal point',
    'u1l3-sum-terms': 'Added the ratio terms instead of the amounts', 'u1l3-flip-rate': 'Divided the wrong way', 'u1l3-ml-l': 'Answer in the wrong unit (mL / L)', 'u1l3-diff-share': 'Used the difference as a share',
    'u1l3-fixed-wrong': 'Changed the amount that stays the same', 'u1l3-total-not-added': 'Gave the new total instead of the amount added', 'u1l3-no-match': 'Did not make the shared terms match',
    'u1l3-as-frac': 'Not written as a fraction', 'u1l3-as-colon': 'Not written with a colon', 'u1l3-incomplete': 'Ratio with an empty term', 'u1l3-comma': 'Comma between ratio terms'
  });
  HW.addPartial({
    'u1l3-reversed': 'n', 'u1l3-whole-wrong': 'b', 'u1l3-not-whole': 'n', 'u1l3-no-convert': 'n', 'u1l3-wrong-factor': 'b', 'u1l3-added': 'n', 'u1l3-one-term-div': 'n', 'u1l3-per-part': 'b',
    'u1l3-total-parts': 'b', 'u1l3-round-dir': 's', 'u1l3-sum-terms': 'b', 'u1l3-flip-rate': 'n', 'u1l3-ml-l': 's', 'u1l3-diff-share': 'n', 'u1l3-fixed-wrong': 'n', 'u1l3-total-not-added': 's', 'u1l3-no-match': 'n', 'u1l3-one-term': 'n'
  });

  /* ================= generators ================= */
  /* worked examples of the lesson (never generated) */
  var EX_SIMP = [[12, 18], [40, 15], [4, 12], [24, 24], [2.5, 4], [0.75, 1.5]];

  /* ---- simplify a:b (Q3, EP2). spec(r) -> [a, b] ---- */
  function simpPart(a, o) {
    o = o || {};
    var want = simp(a), w = toWhole(a).a, g = gcdAll(w);
    var wrongs = [];
    // divided by a different number for each term, or only partly — handled by ratioChk (form / one-term)
    return ratioPart(o.prompt || t(rT(a)), want, { orig: a, sol: br(o.pre ? [o.pre].concat(simpLines(a)) : simpLines(a)) + (o.post || ''), wrongs: (o.wrongs || []).concat(wrongs),
      hints: o.hints || (toWhole(a).f > 1 ? ['Multiply both terms by ' + t(toWhole(a).f) + ' to make them whole numbers.', 'Then divide both by their greatest common factor.'] : ['Find the greatest common factor of ' + t(nT(w[0])) + ' and ' + t(nT(w[1])) + '.', 'Divide both terms by it.']),
      text: o.text || 'simplify ' + a.join(':') });
  }
  function genSimp(r, gs, lo, hi, test) {
    return find(function () { var pq = cop(r, lo, hi, test), g = r.pick(gs); return [pq[0] * g, pq[1] * g]; }, function (v) { return !inList(v, EX_SIMP); }, [6, 9]);
  }
  /* ---- decimal terms: p:q scaled by s (one or two decimal places, not whole) ---- */
  function genDec(r, ss, lo, hi, test) {
    return find(function () { var pq = cop(r, lo, hi), s = r.pick(ss); return [rnd(pq[0] * s, 4), rnd(pq[1] * s, 4)]; }, function (v) { return !inList(v, EX_SIMP) && (!isInt(v[0]) || !isInt(v[1])) && (!test || test(v)); }, [1.5, 3.5]);
  }
  /* ---- units: X small : Y big ---- */
  var UN = { min_h: { s: 'min', b: 'h', f: 60, bad: 100, sName: 'minutes', bName: 'hour' }, s_min: { s: 's', b: 'min', f: 60, bad: 100, sName: 'seconds', bName: 'minute' },
    mL_L: { s: 'mL', b: 'L', f: 1000, bad: 100, sName: 'millilitres', bName: 'litre' }, cm_m: { s: 'cm', b: 'm', f: 100, bad: 1000, sName: 'centimetres', bName: 'metre' }, g_kg: { s: 'g', b: 'kg', f: 1000, bad: 100, sName: 'grams', bName: 'kilogram' } };
  function unitPart(r, key, Ys, Xs, ex) {
    var U = UN[key];
    var v = find(function () { var Y = r.pick(Ys), X = r.pick(Xs); return [X, Y]; }, function (v) {
      var X = v[0], Y = v[1], S = rnd(Y * U.f, 6); if (X >= S || !isInt(S)) return false;
      var s = simp([X, S]); if (s[0] > 20 || s[1] > 25 || gcd(X, S) === 1) return false;
      if (ex && inList(v, ex)) return false;
      return !same(simp([X, Y]), s);
    }, [Xs[0], Ys[0]]);
    var X = v[0], Y = v[1], S = rnd(Y * U.f, 6), want = simp([X, S]);
    var wrongs = [{ r: [X, Y], code: 'u1l3-no-convert', hint: 'Change both amounts to the <b>same unit</b> first: ' + t(nT(Y) + u(U.b) + '=' + nT(S) + u(U.s)) + '.' }];
    if (U.bad) wrongs.push({ r: [X, rnd(Y * U.bad, 6)], code: 'u1l3-wrong-factor', hint: 'Check the conversion: ' + t('1' + u(U.b) + '=' + U.f + u(U.s)) + '.' });
    return ratioPart(t(nT(X) + u(U.s) + ':' + nT(Y) + u(U.b)), want, { wrongs: wrongs,
      sol: br([t(nT(Y) + u(U.b) + '=' + nT(Y) + '\\times ' + U.f + '=' + nT(S) + u(U.s))].concat(['Ratio in ' + U.sName + ': ' + t(nT(X) + ':' + nT(S))]).concat(simpLines([X, S]))),
      hints: ['Change ' + t(nT(Y) + u(U.b)) + ' to ' + U.sName + ': ' + t('1' + u(U.b) + '=' + U.f + u(U.s)) + '.', 'Then drop the units and simplify.'], text: 'units ' + X + U.s + ':' + Y + U.b });
  }

  /* ---- a ratio table with lettered blanks ---- */
  function ratioTablePart(prompt, names, unit, base, cols) {
    // cols: [{k, top:true|false}] — top:true means the top value is shown, the bottom is the blank
    var a = base[0], b = base[1], letters = ['A', 'B', 'C', 'D', 'E'], row1 = [names[0]].concat([a]), row2 = [names[1]].concat([b]), fields = [], checks = [], keys = [], ans = [], sol = [], vals = [];
    cols.forEach(function (c, i) {
      var L = letters[i], top = rnd(a * c.k, 6), bot = rnd(b * c.k, 6), want = c.top ? bot : top, given = c.top ? top : bot;
      row1.push(c.top ? top : { b: L }); row2.push(c.top ? { b: L } : bot);
      var addV = c.top ? rnd(b + (top - a), 6) : rnd(a + (bot - b), 6);
      checks.push(numChk(want, [{ v: addV, code: 'u1l3-added', hint: 'In a ratio table you <b>multiply</b> (or divide) both terms by the same number — you don’t add the same amount. ' + t(nT(c.top ? a : b) + '\\times ' + nT(c.k) + '=' + nT(given)) + '.' },
        { v: c.top ? rnd(a * c.k * c.k, 6) : rnd(b * c.k * c.k, 6), code: 'value', hint: null }]));
      fields.push({ label: L, name: L, after: unit ? HW.esc(unit) : '' });
      keys.push(nf(want)); ans.push(L + ' = ' + t(nT(want))); vals.push(want);
      sol.push(L + ': ' + t(nT(c.top ? a : b) + (c.k >= 1 ? '\\times ' + nT(c.k) : '\\div ' + nT(rnd(1 / c.k, 6))) + '=' + nT(given)) + ', so ' + t(nT(c.top ? b : a) + (c.k >= 1 ? '\\times ' + nT(c.k) : '\\div ' + nT(rnd(1 / c.k, 6))) + '=' + nT(want)));
    });
    var p = fieldsPart(prompt + tbl([row1, row2]), fields, checks, keys, ans.join(', '), { sol: br(sol), hints: ['In each column, find what the known number was multiplied (or divided) by.', 'Do the same to the other term.'], text: 'ratio table ' + a + ':' + b });
    p.bad = [keys.map(function (k, i) { return i === 0 ? String(Number(k) + 1) : k; })];
    return p;
  }

  /* ---- share an amount in a:b (money or a quantity) ---- */
  function shareLines(total, parts, unitFmt, names) {
    var n = sum(parts), one = total / n;
    var L = ['Step 1: ' + t(parts.map(nT).join('+') + '=' + n) + ' parts', 'Step 2: one part ' + t('=' + unitFmt(total) + '\\div ' + n + '=' + unitFmt(one))];
    parts.forEach(function (p, i) { L.push((i ? '\\(\\phantom{Step 3:}\\)' : 'Step 3: ') + (names ? names[i] + ' ' : '') + t(nT(p) + '\\times ' + unitFmt(one) + '=' + unitFmt(p * one))); });
    L.push('Step 4: ' + t(parts.map(function (p) { return unitFmt(p * one); }).join('+') + '=' + unitFmt(total)) + ' ✓');
    return L;
  }
  function shareWrongs(total, parts, i, kind) {
    var n = sum(parts), W = [];
    parts.forEach(function (p) { W.push({ v: total / p, code: 'u1l3-one-term-div', hint: 'Don’t divide by ' + t(p) + ' alone. First add the terms: ' + t(parts.join('+') + '=' + n) + ' parts in all, then one part ' + t('=') + ' total ' + t('\\div ' + n) + '.' }); });
    W.push({ v: total / n, code: 'u1l3-per-part', hint: 'That’s <b>one part</b>. This share is ' + t(parts[i]) + ' part' + (parts[i] > 1 ? 's' : '') + ': multiply one part by ' + t(parts[i]) + '.' });
    if (parts.length === 2) W.push({ v: total * parts[i] / parts[1 - i], code: 'u1l3-one-term-div', hint: 'The fraction of the total is ' + t('\\frac{' + parts[i] + '}{' + n + '}') + ' (this share’s parts over the <b>total</b> number of parts), not ' + t('\\frac{' + parts[i] + '}{' + parts[1 - i] + '}') + '.' });
    return W;
  }

  var NAMES2 = [['Jaya', 'Owen'], ['Amir', 'Lena'], ['Riya', 'Matteo'], ['Kofi', 'Ellie'], ['Noah', 'Ella'], ['Maya', 'Liam'], ['Raj', 'Sofia'], ['Ava', 'Ben']];

  /* ================= Q1: three ways, part-to-part / part-to-whole ================= */
  var GROUPS = [
    { ctx: 'A parking lot has', it: ['trucks', 'cars', 'vans'], all: 'all vehicles' },
    { ctx: 'A box of pens has', it: ['blue pens', 'black pens', 'red pens'], all: 'all pens' },
    { ctx: 'A fruit bowl has', it: ['apples', 'oranges', 'pears'], all: 'all the fruit' },
    { ctx: 'A school band has', it: ['trumpets', 'clarinets', 'drums'], all: 'all the instruments' },
    { ctx: 'A pet store has', it: ['puppies', 'kittens', 'rabbits'], all: 'all the animals' }];
  function q1Shared(r) {
    var g = r.pick(GROUPS);
    var n = find(function () { return [r.int(3, 12), r.int(2, 9), r.int(2, 8)]; }, function (v) { return v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2] && !(v[0] === 5 && v[1] === 3 && v[2] === 4); }, [8, 5, 3]);
    var o = r.shuffle([0, 1, 2]), A = o[0], B = o[1], C = o[2], tot = sum(n);
    var rows = [
      { id: 'r1', html: g.it[A] + ' to ' + g.it[B], r: [n[A], n[B]], pw: false },
      { id: 'r2', html: g.it[B] + ' to ' + g.it[A], r: [n[B], n[A]], pw: false },
      { id: 'r3', html: g.it[C] + ' to ' + g.all, r: [n[C], tot], pw: true, other: [n[C], tot - n[C]] },
      { id: 'r4', html: g.it[B] + ' to ' + g.all, r: [n[B], tot], pw: true, other: [n[B], tot - n[B]] }];
    return { g: g, n: n, tot: tot, rows: rows };
  }
  function q1Stem(s) { return s.g.ctx + ' ' + t(s.n[0]) + ' ' + s.g.it[0] + ', ' + t(s.n[1]) + ' ' + s.g.it[1] + ' and ' + t(s.n[2]) + ' ' + s.g.it[2] + '.'; }

  /* ================= Q9: three-term recipe ================= */
  var MIXES = [
    { what: 'A granola recipe uses oats, nuts and raisins in the ratio', it: ['oats', 'nuts', 'raisins'], unit: 'cups', who: 'Sam', mix: 'granola' },
    { what: 'A potting mix uses soil, compost and sand in the ratio', it: ['soil', 'compost', 'sand'], unit: 'scoops', who: 'Hana', mix: 'potting mix' },
    { what: 'A smoothie recipe uses yogurt, berries and juice in the ratio', it: ['yogurt', 'berries', 'juice'], unit: 'cups', who: 'Liam', mix: 'smoothie' },
    { what: 'A snack mix uses cereal, pretzels and peanuts in the ratio', it: ['cereal', 'pretzels', 'peanuts'], unit: 'cups', who: 'Zoe', mix: 'snack mix' }];
  function q9Shared(r) {
    var m = r.pick(MIXES);
    var v = find(function () { var T = r.pick([[4, 2, 1], [6, 3, 1], [4, 3, 1], [6, 2, 1], [8, 4, 1], [5, 2, 1], [4, 1, 1], [6, 4, 1], [8, 2, 1]]); return { T: T, G: r.int(2, 14) }; }, function (v) {
      var k = v.G / v.T[0]; if (isInt(k)) return false;
      return v.T.every(function (x) { return decPl(rnd(x * k, 6)) <= 2; }) && rnd(v.T[2] * k, 6) >= 0.5;
    }, { T: [4, 2, 1], G: 6 });
    var k = v.G / v.T[0];
    return { m: m, T: v.T, G: v.G, k: rnd(k, 6), amts: v.T.map(function (x) { return rnd(x * k, 6); }) };
  }

  /* ================= Q10: paint shades ================= */
  var PAINT = [['Tara', 'Dev'], ['Mia', 'Jon'], ['Ava', 'Raj'], ['Grace', 'Omar']];
  function q10Shared(r) {
    var nm = r.pick(PAINT), col = r.pick(['blue', 'red', 'green']);
    var same = r.chance(0.25), a, b, c, d;
    if (same) { var pq = cop(r, 2, 7, function (v) { return v[0] > v[1]; }); var m = r.pick([2, 3]); a = pq[0]; b = pq[1]; c = a * m; d = b * m; if (r.chance(0.5)) { var x = a, y = b; a = c; b = d; c = x; d = y; } }
    else {
      var v = find(function () { var p1 = cop(r, 2, 9, function (v) { return v[0] > v[1]; }), p2 = cop(r, 2, 11, function (v) { return v[0] > v[1]; }); return p1.concat(p2); }, function (v) {
        var x = v[0] / v[1], y = v[2] / v[3]; return Math.abs(x - y) >= 0.08 && rnd(x, 2) !== rnd(y, 2) && !(v[0] === v[2] && v[1] === v[3]);
      }, [5, 2, 8, 3]);
      a = v[0]; b = v[1]; c = v[2]; d = v[3];
    }
    return { nm: nm, col: col, a: a, b: b, c: c, d: d, same: same || Math.abs(a / b - c / d) < 1e-9 };
  }

  /* ================= extra Q14: combine two ratios ================= */
  function e14Shared(r) {
    var v = find(function () { var p1 = cop(r, 2, 5), p2 = cop(r, 2, 5); return [p1[0], p1[1], p2[0], p2[1]]; }, function (v) { return v[1] !== v[2] && v[1] * v[2] / gcd(v[1], v[2]) <= 12; }, [3, 2, 4, 1]);
    var a = v[0], b = v[1], c = v[2], d = v[3], L = b * c / gcd(b, c), m1 = L / b, m2 = L / c;
    var tri = simp([a * m1, L, d * m2]);
    var W = rnd(tri[2] * r.pick([0.25, 0.5, 1, 1.5, 2]), 6);
    var drink = r.pick([{ it: ['juice', 'pop', 'sparkling water'], what: 'A punch recipe' }, { it: ['lemonade', 'iced tea', 'soda water'], what: 'A party drink' }]);
    return { a: a, b: b, c: c, d: d, L: L, m1: m1, m2: m2, tri: tri, W: W, dr: drink };
  }

  HW.u1ratio = { gcd: gcd, gcdAll: gcdAll, rnd: rnd, nf: nf, nT: nT, rT: rT, decPl: decPl, isInt: isInt, simp: simp, toWhole: toWhole, money: money, mT: mT, sum: sum, same: same, find: find, cop: cop, inList: inList, br: br, u: u,
    readRatio: readRatio, ratioChk: ratioChk, ratioPart: ratioPart, matchW: matchW, cleanW: cleanW, numChk: numChk, moneyChk: moneyChk, numPart: numPart, moneyPart: moneyPart, multiChk: multiChk, fieldsPart: fieldsPart,
    ratioField: ratioField, tbl: tbl, blank: blank, simpLines: simpLines, pron: pron, NAMES2: NAMES2 };

  HW.defineLesson({
    id: 'u1l3', unit: 1, num: '3', title: 'Ratios', outcome: 'N1',
    blurb: 'Writing ratios three ways, simplifying them (decimals and different units), ratio tables, and sharing an amount in a ratio.',
    questions: [
      /* ---------- Q1 ---------- */
      { num: '1', shared: q1Shared, stem: function (s) { return q1Stem(s); }, parts: [
        { id: '1a', level: 'BEG', make: function (r, s) {
          var fields = s.rows.map(function (x) { return ratioField(x.html); });
          var checks = s.rows.map(function (x) {
            var w = [{ r: [x.r[1], x.r[0]], code: 'u1l3-reversed', hint: 'Order matters: in “' + x.html + '”, the ' + x.html.split(' to ')[0] + ' come first.' }];
            if (x.pw) w.push({ r: x.other, code: 'u1l3-whole-wrong', hint: 'The whole group is ' + s.g.all + ': ' + t(s.n.join('+') + '=' + s.tot) + '.' });
            return ratioChk(x.r, { simplest: false, wrongs: w });
          });
          return fieldsPart('Write each ratio with a colon.', fields, checks, s.rows.map(function (x) { return rT(x.r); }), s.rows.map(function (x) { return x.html + ': ' + t(rT(x.r)); }).join('<br>'),
            { sol: br(['All: ' + t(s.n.join('+') + '=' + s.tot)].concat(s.rows.map(function (x) { return x.html + ': ' + t(rT(x.r)); }))), hints: ['The first amount named goes first.', 'For “' + s.g.all + '”, add all three groups.'], text: 'Q1 colon',
              bad: [s.rows.map(function (x) { return rT([x.r[1], x.r[0]]); })] });
        } },
        { id: '1b', level: 'BEG', make: function (r, s) {
          var want = {}; s.rows.forEach(function (x) { want[x.id] = x.pw ? 'pw' : 'pp'; });
          return P.grid('Is each ratio part-to-part or part-to-whole?', s.rows.map(function (x) { return { id: x.id, html: x.html + ' &nbsp;' + t(rT(x.r)) }; }), [{ id: 'pp', html: 'part-to-part' }, { id: 'pw', html: 'part-to-whole' }], want,
            { why: function (row) { var x = s.rows.filter(function (y) { return y.id === row; })[0]; return x.pw ? '“' + x.html + '” compares with the <b>whole</b> group (' + s.g.all + '), so it is part-to-whole.' : '“' + x.html + '” compares one part of the group with another part, so it is part-to-part.'; } },
            br(s.rows.map(function (x) { return x.html + ': ' + (x.pw ? 'part-to-whole (it uses the whole group, ' + s.g.all + ')' : 'part-to-part (two parts of the group)'); })), ['Does the ratio use “' + s.g.all + '”? Then it compares with the whole.'], 'Q1 type');
        } },
        { id: '1c', level: 'LIM', make: function (r, s) {
          var x = r.pick([s.rows[1], s.rows[2]]), a = x.r[0], b = x.r[1];
          var opts = [{ html: a + ' to ' + b + ' &nbsp;and&nbsp; ' + t('\\frac{' + a + '}{' + b + '}'), right: true },
            { html: b + ' to ' + a + ' &nbsp;and&nbsp; ' + t('\\frac{' + b + '}{' + a + '}'), why: 'Order matters: the first amount named goes first (and on top).' },
            { html: a + ' to ' + b + ' &nbsp;and&nbsp; ' + t('\\frac{' + b + '}{' + a + '}'), why: 'The words are right, but in the fraction the first amount goes on <b>top</b>.' },
            x.pw ? { html: a + ' to ' + (b - a) + ' &nbsp;and&nbsp; ' + t('\\frac{' + a + '}{' + (b - a) + '}'), why: 'The whole group is all of them: ' + t(s.n.join('+') + '=' + s.tot) + '.' }
              : { html: a + ' to ' + (a + b) + ' &nbsp;and&nbsp; ' + t('\\frac{' + a + '}{' + (a + b) + '}'), why: 'This compares two parts, not a part with a total.' }];
          return P.mc(r, 'Which shows the ratio <b>' + x.html + '</b> in words and as a fraction?', opts, 'In words: ' + a + ' to ' + b + '. As a fraction: ' + t('\\frac{' + a + '}{' + b + '}') + ' (the first amount named goes on top).', ['The first amount named goes first, and on top of the fraction.'], 'Q1 three ways');
        } }] },
      /* ---------- Q2 ---------- */
      { num: '2', shared: function (r) { var v = find(function () { return [r.int(10, 15), r.int(6, 9), r.int(2, 3)]; }, function (v) { var T = sum(v); return gcd(v[2], T) > 1; }, [13, 7, 2]); return { F: v[0], D: v[1], G: v[2], T: sum(v) }; },
        stem: function (s) { return 'A hockey team has ' + t(s.F) + ' forwards, ' + t(s.D) + ' defence players and ' + t(s.G) + ' goalies. Write each ratio in simplest form.'; }, parts: [
          { id: '2a', level: 'BEG', make: function (r, s) { return ratioPart('defence to forwards', simp([s.D, s.F]), { orig: [s.D, s.F], sol: br([t(s.D + ':' + s.F)].concat(simpLines([s.D, s.F]))), rev: 'Order matters: “defence to forwards” means defence first.', hints: ['Defence first, then forwards.'], text: 'Q2a' }); } },
          { id: '2b', level: 'EMG', make: function (r, s) {
            return ratioPart('goalies to the whole team', simp([s.G, s.T]), { orig: [s.G, s.T], wrongs: [{ r: [s.G, s.F + s.D], code: 'u1l3-whole-wrong', hint: 'The whole team includes the goalies: ' + t(s.F + '+' + s.D + '+' + s.G + '=' + s.T) + '.' }, { r: [s.G, s.F], code: 'u1l3-not-whole', hint: 'Compare the goalies with the <b>whole team</b>, not one group.' }],
              sol: br(['Team: ' + t(s.F + '+' + s.D + '+' + s.G + '=' + s.T), t(s.G + ':' + s.T)].concat(simpLines([s.G, s.T]))), hints: ['Add all three groups to get the whole team.', 'Then simplify.'], text: 'Q2b' });
          } },
          { id: '2c', level: 'EMG', make: function (r, s) {
            var N = s.D + s.G;
            return ratioPart('forwards to players who are not forwards', simp([s.F, N]), { orig: [s.F, N], wrongs: [{ r: [s.F, s.T], code: 'u1l3-whole-wrong', hint: 'Players who are <b>not</b> forwards are the defence and the goalies: ' + t(s.D + '+' + s.G + '=' + N) + '.' }, { r: [s.F, s.D], code: 'u1l3-whole-wrong', hint: 'Don’t forget the goalies: players who are not forwards ' + t('=' + s.D + '+' + s.G) + '.' }],
              sol: br(['Not forwards: ' + t(s.D + '+' + s.G + '=' + N), t(s.F + ':' + N)].concat(simpLines([s.F, N]))), hints: ['Who is not a forward? Add those groups.'], text: 'Q2c' });
          } }] },
      /* ---------- Q3 ---------- */
      { num: '3', stem: 'Write each ratio in simplest form.', parts: [
        { id: '3a', level: 'LIM', make: function (r) { return simpPart(genSimp(r, [2, 3], 2, 5)); } },
        { id: '3b', level: 'LIM', make: function (r) { var k = r.int(2, 7), g = r.int(3, 9); var v = inList([k * g, g], EX_SIMP) ? [20, 5] : [k * g, g]; return simpPart(v); } },
        { id: '3c', level: 'BEG', make: function (r) { return simpPart(genSimp(r, [6, 8, 9], 2, 5)); } },
        { id: '3d', level: 'LIM', make: function (r) { var n = find(function () { return r.int(6, 30); }, function (n) { return n !== 24; }, 18); return simpPart([n, n], { post: '<br>(Keep both 1s: ' + t('1:1') + '.)' }); } },
        { id: '3e', level: 'BEG', make: function (r) { return simpPart(genSimp(r, [6, 7, 8, 9], 2, 7, function (v) { return v[0] > v[1]; })); } },
        { id: '3f', level: 'BEG', make: function (r) { return simpPart(genSimp(r, [10, 11, 12, 13, 14, 15], 2, 7, function (v) { return v[0] < v[1]; })); } }] },
      /* ---------- Q4 ---------- */
      { num: '4', stem: 'Write each ratio in simplest form, using whole numbers.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { return simpPart(genDec(r, [0.5], 1, 9, function (v) { return !isInt(v[0]) && !isInt(v[1]); })); } },
        { id: '4b', level: 'EMG', make: function (r) { return simpPart(genDec(r, [0.2, 0.3, 0.4], 1, 6, function (v) { return v[0] < 1 && v[0] < v[1]; })); } },
        { id: '4c', level: 'PRG', make: function (r) { return simpPart(genDec(r, [0.25, 0.75, 0.15, 0.35, 0.45], 1, 5, function (v) { return Math.max(decPl(v[0]), decPl(v[1])) === 2; })); } },
        { id: '4d', level: 'EMG', make: function (r) { return simpPart(genDec(r, [1.2, 0.6, 0.8, 1.6, 0.9, 1.4], 2, 5, function (v) { return v[0] > 1 && v[1] > 1 && !isInt(v[0]) && !isInt(v[1]); })); } },
        { id: '4e', level: 'PRG', make: function (r) {
          var rate = r.pick([0.75, 0.8, 0.7, 0.72, 0.76, 0.74, 0.73]), want = simp([1, rate]);
          return simpPart([1, rate], { prompt: 'A bank’s board shows the example rate ' + t('1\\text{ CAD}=' + nf(rate) + '\\text{ USD}') + '. Write the ratio of Canadian dollars to US dollars in simplest form, using whole numbers.',
            post: '<br>(' + want[0] + ' Canadian dollars for every ' + want[1] + ' US dollars.)', text: 'CAD:USD ' + rate,
            hints: ['The ratio is ' + t('1:' + nf(rate)) + '. Multiply both terms by ' + t('100') + '.', 'Then simplify.'] });
        } }] },
      /* ---------- Q5 ---------- */
      { num: '5', stem: 'Change to the same unit, then write each ratio in simplest form.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { return unitPart(r, 'min_h', [1], [10, 12, 15, 20, 30, 40, 50, 36, 24, 48], []); } },
        { id: '5b', level: 'EMG', make: function (r) { return unitPart(r, 'mL_L', [1, 2, 3, 4, 1.5, 2.5], [100, 150, 200, 250, 300, 400, 500, 600, 750, 800, 900], []); } },
        { id: '5c', level: 'EMG', make: function (r) { return unitPart(r, 'cm_m', [1, 2, 3, 4, 5, 1.5], [15, 20, 25, 30, 40, 45, 50, 60, 75, 80, 90], []); } },
        { id: '5d', level: 'EMG', make: function (r) { return unitPart(r, 'g_kg', [1, 2, 3, 1.5, 2.5], [100, 150, 200, 250, 300, 400, 500, 600, 750, 800], [[250, 1.5]]); } },
        { id: '5e', level: 'EMG', make: function (r) { return unitPart(r, 's_min', [1, 2, 3, 4], [10, 12, 15, 20, 30, 40, 45, 50], []); } },
        { id: '5f', level: 'EMG', make: function (r) {
          var c = r.pick([{ X: 40, s: 'min', b: 'h', f: 60, bad: 100 }, { X: 20, s: 'min', b: 'h', f: 60, bad: 100 }, { X: 300, s: 'mL', b: 'L', f: 1000, bad: 100 }, { X: 250, s: 'g', b: 'kg', f: 1000, bad: 100 }, { X: 45, s: 's', b: 'min', f: 60, bad: 100 }, { X: 50, s: 'min', b: 'h', f: 60, bad: 100 }, { X: 25, s: 'cm', b: 'm', f: 100, bad: 1000 }]);
          var nm = r.pick(['Jordan', 'Kofi', 'Liam', 'Omar', 'Ben']), right = simp([c.X, c.f]), badS = simp([c.X, c.bad]);
          var opts = [{ html: 'He didn’t change ' + t('1' + u(c.b)) + ' to ' + t(c.f + u(c.s)) + '. The ratio is ' + t(c.X + ':' + c.f + '=' + rT(right)) + '.', right: true },
            { html: 'He used the wrong order. The ratio is ' + t('1:' + c.X) + '.', why: 'The order ' + t(c.X + u(c.s)) + ' first was right. The problem is the units.' },
            { html: 'He didn’t change to the same unit. The ratio is ' + t(c.X + ':' + c.bad + '=' + rT(badS)) + '.', why: 'Check the conversion: ' + t('1' + u(c.b) + '=' + c.f + u(c.s)) + ', not ' + t(c.bad) + '.' },
            { html: 'Nothing is wrong: ' + t(c.X + ':1') + ' is already in simplest form.', why: 'The two amounts are in different units, so the ratio can’t be ' + t(c.X + ':1') + '.' }];
          return P.mc(r, nm + ' says the ratio of ' + t(c.X + u(c.s)) + ' to ' + t('1' + u(c.b)) + ' is ' + t(c.X + ':1') + '. What is his mistake, and what is the correct ratio in simplest form?', opts,
            'He did not change to the same unit. ' + t('1' + u(c.b) + '=' + c.f + u(c.s)) + ', so the ratio is ' + t(c.X + ':' + c.f) + '.<br>' + br(simpLines([c.X, c.f])), ['Are both amounts in the same unit?'], 'Q5f mistake');
        } }] },
      /* ---------- Q6 ---------- */
      { num: '6', shared: function (r) {
        var v = find(function () { var T = r.pick([64, 128, 256]); return [T, r.pick([8, 16, 32]) * r.int(1, 15)]; }, function (v) { return v[1] > v[0] / 8 && v[1] < v[0] * 7 / 8 && v[1] !== v[0] / 2 && simp([v[1], v[0] - v[1]]).every(function (x) { return x <= 15; }) && simp([v[1], v[0]])[1] <= 16; }, [128, 48]);
        return { T: v[0], U: v[1], nm: r.pick(['Priya', 'Mateo', 'Aisha', 'Tyler', 'Grace']), dev: r.pick(['phone', 'tablet', 'laptop']) };
      }, stem: function (s) { return s.nm + '’s ' + s.dev + ' has ' + t(s.T + u('GB')) + ' of storage. ' + (pron(s.nm) === 'she' ? 'She' : 'He') + ' has used ' + t(s.U + u('GB')) + '.'; }, parts: [
        { id: '6a', level: 'EMG', make: function (r, s) { var F = s.T - s.U; return ratioPart('Write the ratio of used storage to free storage in simplest form.', simp([s.U, F]), { wrongs: [{ r: [s.U, s.T], code: 'u1l3-whole-wrong', hint: 'That compares used with <b>total</b>. Free storage ' + t('=' + s.T + '-' + s.U + '=' + F + u('GB')) + '.' }],
          sol: br(['Free: ' + t(s.T + '-' + s.U + '=' + F + u('GB')), t(s.U + ':' + F)].concat(simpLines([s.U, F]))), hints: ['Free storage = total − used.', 'Then simplify used : free.'], text: 'Q6a' }); } },
        { id: '6b', level: 'EMG', make: function (r, s) { var F = s.T - s.U; return ratioPart('Write the ratio of used storage to total storage in simplest form.', simp([s.U, s.T]), { wrongs: [{ r: [s.U, F], code: 'u1l3-not-whole', hint: 'That compares used with <b>free</b> storage. Compare used with the total, ' + t(s.T + u('GB')) + '.' }],
          sol: br([t(s.U + ':' + s.T)].concat(simpLines([s.U, s.T]))), hints: ['Total storage is ' + t(s.T + u('GB')) + '.'], text: 'Q6b' }); } }] },
      /* ---------- Q7 ---------- */
      { num: '7', stem: '', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var c = r.pick([{ w: 'A fruit punch recipe uses', n: ['Juice (L)', 'Ginger ale (L)'], a: 'L of juice', b: 'L of ginger ale' }, { w: 'A paint colour uses', n: ['Red paint (cans)', 'Yellow paint (cans)'], a: 'cans of red paint', b: 'cans of yellow paint' }, { w: 'A cookie recipe uses', n: ['Flour (cups)', 'Sugar (cups)'], a: 'cups of flour', b: 'cups of sugar' }]);
          var base = cop(r, 2, 5, function (v) { return !(v[0] === 1 && v[1] === 4); }), k1 = r.pick([2, 3]), k2 = r.pick([4, 5]), k3 = r.pick([5, 6, 7]); if (k3 <= k2) k3 = k2 + 1;
          var p = ratioTablePart(c.w + ' ' + t(base[0]) + ' ' + c.a + ' for every ' + t(base[1]) + ' ' + c.b + '. Complete the ratio table.', c.n, '', base, [{ k: k1, top: true }, { k: k2, top: false }, { k: k3, top: true }, { k: 0.5, top: false }]);
          p.text = 'Q7 ratio table'; return p;
        } }] },
      /* ---------- Q8 ---------- */
      { num: '8', stem: '', parts: [
        { id: '8', level: 'BEG', make: function (r) {
          var pq = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [1, 3], [3, 7]]), m = r.pick([2, 3]), base = [pq[0] * m, pq[1] * m];
          var us = r.sample([2, 4, 5, 6].filter(function (x) { return x !== m; }), 2);
          var items = [{ id: 's', r: pq, yes: true }, { id: 'u1', r: [pq[0] * us[0], pq[1] * us[0]], yes: true }, { id: 'rev', r: [base[1], base[0]], yes: false }, { id: 'u2', r: [pq[0] * us[1], pq[1] * us[1]], yes: true },
            { id: 'add', r: [base[0] + base[0], base[1] + base[0]], yes: false }];
          if (r.chance(0.4)) items[3] = { id: 'near', r: [pq[0] * us[1] + 1, pq[1] * us[1] + 1], yes: false };
          items = r.shuffle(items);
          var opts = items.map(function (x) { return { value: x.id, html: t(rT(x.r)) }; }), want = items.filter(function (x) { return x.yes; }).map(function (x) { return x.id; });
          var byId = {}; items.forEach(function (x) { byId[x.id] = x; });
          var p = { prompt: 'Which ratios are equivalent to ' + t(rT(base)) + '? Tap all that are.', input: { type: 'select', options: opts }, key: want, answer: want.map(function (id) { return t(rT(byId[id].r)); }).join(', '), text: 'Q8 equivalent to ' + base.join(':'),
            check: K.selectSet(want, function (extra, missing) {
              if (extra.indexOf('rev') >= 0) return { code: 'u1l3-reversed', hint: t(rT(byId.rev.r)) + ' has the terms the other way round. Order matters.' };
              if (extra.indexOf('add') >= 0) return { code: 'u1l3-added', hint: t(rT(byId.add.r)) + ' adds the same number to both terms. That doesn’t make an equal ratio — only multiplying or dividing does.' };
              if (extra.length) return { code: 'value', hint: 'Simplify each ratio you chose. Only the ones that simplify to ' + t(rT(pq)) + ' are equivalent.' };
              if (missing.length) return { code: 'u1l3-missed', hint: 'You missed ' + (missing.length === 1 ? 'one' : missing.length) + '. Simplify each ratio and compare it with ' + t(rT(pq)) + '.' };
              return null;
            }),
            solution: t(rT(base) + '=' + rT(pq)) + '.<br>' + br(items.map(function (x) { var s = simp(x.r); return t(same(x.r, s) && gcdAll(x.r) === 1 ? rT(x.r) : rT(x.r) + '=' + rT(s)) + ': ' + (x.yes ? '<b>yes</b>' : 'no' + (x.id === 'rev' ? ' (order is switched)' : '')); })),
            hints: ['Simplify ' + t(rT(base)) + ' first.', 'Then simplify each choice and compare.'] };
          p.bad = [want.slice(1), want.concat(['rev'])];
          return p;
        } }] },
      /* ---------- Q9 ---------- */
      { num: '9', shared: q9Shared, stem: function (s) { return s.m.what + ' ' + t(rT(s.T)) + ' (by ' + s.m.unit + ').'; }, parts: [
        { id: '9a', level: 'PRG', make: function (r, s) {
          var it = s.m.it, A = s.amts, k = s.k, mk = function (i) { return numChk(A[i], [{ v: rnd(s.T[i] + (s.G - s.T[0]), 6), code: 'u1l3-added', hint: 'Don’t add the same amount to every term. Find what ' + t(s.T[0]) + ' was <b>multiplied</b> by: ' + t(nT(s.G) + '\\div ' + s.T[0] + '=' + nT(k)) + '.' }, { v: rnd(s.T[i] / k, 6), code: 'u1l3-flip-rate', hint: 'Multiply each term by ' + t(nT(s.G) + '\\div ' + s.T[0] + '=' + nT(k)) + ' (not divide).' }]); };
          return fieldsPart(s.m.who + ' uses ' + t(nT(s.G)) + ' ' + pl(s.G, s.m.unit) + ' of ' + it[0] + '. How many ' + s.m.unit + ' of ' + it[1] + ' and ' + it[2] + ' does ' + pron(s.m.who) + ' need?', [{ label: it[1], name: it[1], after: s.m.unit }, { label: it[2], name: it[2], after: s.m.unit }], [mk(1), mk(2)], [nf(A[1]), nf(A[2])], it[1] + ': ' + t(nT(A[1])) + ' ' + pl(A[1], s.m.unit) + ', ' + it[2] + ': ' + t(nT(A[2])) + ' ' + pl(A[2], s.m.unit),
            { sol: br([t(nT(s.G) + '\\div ' + s.T[0] + '=' + nT(k)) + ', so multiply every term by ' + t(nT(k)) + ':', t(rT(s.T) + '=' + rT(A)), t(nT(A[1])) + ' ' + pl(A[1], s.m.unit) + ' of ' + it[1] + ' and ' + t(nT(A[2])) + ' ' + pl(A[2], s.m.unit) + ' of ' + it[2] + '.']), hints: ['What was ' + t(s.T[0]) + ' multiplied by to get ' + t(nT(s.G)) + '?', 'Multiply the other terms by the same number.'], text: 'Q9a', bad: [[nf(rnd(s.T[1] + s.G - s.T[0], 6)), nf(rnd(s.T[2] + s.G - s.T[0], 6))]] });
        } },
        { id: '9b', level: 'EMG', make: function (r, s) { var tot = sum(s.amts); return numPart('How many ' + s.m.unit + ' of ' + s.m.mix + ' does ' + s.m.who + ' make?', rnd(tot, 6), { after: s.m.unit, unit: s.m.unit, wrongs: [{ v: sum(s.T), code: 'u1l3-sum-terms', hint: 'That adds the ratio terms. Add the actual amounts: ' + t(s.amts.map(nT).join('+')) + '.' }],
          sol: t(s.amts.map(nT).join('+') + '=' + nT(tot)) + ' ' + s.m.unit, hints: ['Add the three amounts (from part (a)).'], text: 'Q9b' }); } },
        { id: '9c', level: 'EMG', make: function (r, s) { var W = sum(s.T); return ratioPart('Write the ratio of ' + s.m.it[2] + ' to the whole mix.', simp([s.T[2], W]), { wrongs: [{ r: [s.T[2], s.T[0] + s.T[1]], code: 'u1l3-whole-wrong', hint: 'The whole mix is all three parts: ' + t(s.T.join('+') + '=' + W) + '.' }],
          sol: br(['Whole: ' + t(s.T.join('+') + '=' + W) + ' parts', s.m.it[2] + ' : whole ' + t('=' + s.T[2] + ':' + W) + (gcd(s.T[2], W) > 1 ? t('=' + rT(simp([s.T[2], W]))) : '')]), hints: ['The whole is all the parts added together.'], text: 'Q9c' }); } }] },
      /* ---------- Q10 ---------- */
      { num: '10', shared: q10Shared, stem: function (s) { return s.nm[0] + ' mixes ' + t(s.a + u('L')) + ' of white paint with ' + t(s.b + u('L')) + ' of ' + s.col + ' paint. ' + s.nm[1] + ' mixes ' + t(s.c + u('L')) + ' of white paint with ' + t(s.d + u('L')) + ' of ' + s.col + ' paint.'; }, parts: [
        { id: '10a', level: 'EMG', make: function (r, s) {
          var x = s.a / s.b, y = s.c / s.d;
          var mk = function (v, w, b) { return numChk(v, [{ v: rnd(b / w, 2), code: 'u1l3-flip-rate', hint: 'Divide <b>white ÷ ' + s.col + '</b> to get the white for each litre of ' + s.col + '.' }], { dp: 2 }); };
          return fieldsPart('For each mix, how many litres of white paint are there for each litre of ' + s.col + '? Round to the nearest hundredth.', [{ label: s.nm[0], name: s.nm[0], after: 'L' }, { label: s.nm[1], name: s.nm[1], after: 'L' }], [mk(x, s.a, s.b), mk(y, s.c, s.d)], [rnd(x, 2).toFixed(2), rnd(y, 2).toFixed(2)],
            s.nm[0] + ': ' + t(rnd(x, 2).toFixed(2)) + ' L, ' + s.nm[1] + ': ' + t(rnd(y, 2).toFixed(2)) + ' L', { sol: br([s.nm[0] + ': ' + t(s.a + '\\div ' + s.b + (isInt(x * 100) ? '=' : '\\approx ') + rnd(x, 2).toFixed(2)) + ' L of white per litre of ' + s.col, s.nm[1] + ': ' + t(s.c + '\\div ' + s.d + (isInt(y * 100) ? '=' : '\\approx ') + rnd(y, 2).toFixed(2)) + ' L of white per litre of ' + s.col]),
              hints: ['Divide the white paint by the ' + s.col + ' paint.'], text: 'Q10a' });
        } },
        { id: '10b', level: 'PRG', make: function (r, s) {
          var x = s.a / s.b, y = s.c / s.d, nx = rnd(x, 2).toFixed(2), ny = rnd(y, 2).toFixed(2), lighter = s.same ? null : (x > y ? 0 : 1), los = lighter == null ? (s.a > s.c ? 0 : 1) : 1 - lighter, W0 = [s.a, s.c][los], W1 = [s.a, s.c][1 - los], B0 = [s.b, s.d][los], B1 = [s.b, s.d][1 - los], P0 = pron(s.nm[los]);
          var trap = W0 > W1 ? P0 + ' uses more white paint' : B0 < B1 ? P0 + ' uses less ' + s.col + ' paint' : W0 - B0 > W1 - B1 ? 'the difference between white and ' + s.col + ' is bigger' : (P0 === 'she' ? 'her' : 'his') + ' mix has more paint in total';
          var opts = [{ html: 'Yes, the same shade: ' + t(s.a + ':' + s.b) + ' and ' + t(s.c + ':' + s.d) + ' simplify to the same ratio.', right: s.same, why: 'Simplify both: ' + t(s.a + ':' + s.b + '=' + rT(simp([s.a, s.b]))) + ' and ' + t(s.c + ':' + s.d + '=' + rT(simp([s.c, s.d]))) + '. They are different.' },
            { html: 'No. ' + s.nm[0] + '’s is lighter: ' + t(nx + u('L')) + ' of white for each litre of ' + s.col + ', compared with ' + t(ny + u('L')) + '.', right: lighter === 0, why: s.same ? 'Both have the same amount of white for each litre of ' + s.col + '.' : 'Compare: ' + s.nm[0] + ' has ' + t(nx) + ' L and ' + s.nm[1] + ' has ' + t(ny) + ' L of white per litre of ' + s.col + '. More white per litre is lighter.' },
            { html: 'No. ' + s.nm[1] + '’s is lighter: ' + t(ny + u('L')) + ' of white for each litre of ' + s.col + ', compared with ' + t(nx + u('L')) + '.', right: lighter === 1, why: s.same ? 'Both have the same amount of white for each litre of ' + s.col + '.' : 'Compare: ' + s.nm[1] + ' has ' + t(ny) + ' L and ' + s.nm[0] + ' has ' + t(nx) + ' L of white per litre of ' + s.col + '. More white per litre is lighter.' },
            { html: 'No. ' + s.nm[los] + '’s is lighter, because ' + trap + '.', why: 'Totals and differences don’t decide the shade. Compare the white for <b>each litre</b> of ' + s.col + ' (white ÷ ' + s.col + ').' }];
          return P.mc(r, 'Do they get the same shade? If not, whose paint is lighter (more white for each litre of ' + s.col + ')?', opts,
            br([s.nm[0] + ': ' + t(s.a + ':' + s.b) + ', ' + t(s.a + '\\div ' + s.b + (isInt(x * 100) ? '=' : '\\approx ') + nx) + ' L of white per litre of ' + s.col, s.nm[1] + ': ' + t(s.c + ':' + s.d) + ', ' + t(s.c + '\\div ' + s.d + (isInt(y * 100) ? '=' : '\\approx ') + ny) + ' L of white per litre of ' + s.col,
              s.same ? 'The ratios are equivalent, so the shades are the <b>same</b>.' : 'The ratios are not equivalent, so the shades are different. ' + s.nm[lighter] + ' has more white per litre of ' + s.col + ', so ' + s.nm[lighter] + '’s is <b>lighter</b>.']),
            ['Find the white paint for each litre of ' + s.col + ' in each mix.'], 'Q10b');
        } }] },
      /* ---------- Q11 ---------- */
      { num: '11', stem: 'Share each amount in the given ratio.', parts: [0, 1].map(function (i) {
        return { id: '11' + 'ab'[i], level: 'EMG', make: function (r) {
          var v = find(function () { var pq = cop(r, 1, 7, function (v) { return v[0] < v[1]; }), one = i ? r.pick([10, 15, 20, 25, 30, 35, 40, 45, 50]) : r.int(3, 12); return [pq[0], pq[1], one]; }, function (v) { var T = (v[0] + v[1]) * v[2]; return (i ? T <= 450 && T >= 120 : T <= 100 && T >= 20) && !(T === 120 && v[0] === 3 && v[1] === 5); }, i ? [2, 5, 30] : [3, 5, 5]);
          var parts = [v[0], v[1]], one = v[2], T = sum(parts) * one, sh = parts.map(function (p) { return p * one; });
          var checks = parts.map(function (p, j) { return moneyChk(sh[j], shareWrongs(T, parts, j).map(function (w) { w.v = rnd(w.v, 2); return w; })); });
          return fieldsPart(t(mP(T)) + ' in the ratio ' + t(rT(parts)), [{ label: 'First share', name: 'First share', before: '$' }, { label: 'Second share', name: 'Second share', before: '$' }], checks, sh.map(function (x) { return x.toFixed(2); }), t(mT(sh[0])) + ' and ' + t(mT(sh[1])),
            { vals: sh, sol: br(shareLines(T, parts, mT)), hints: ['Add the terms to get the total number of parts.', 'Find one part, then multiply by each term.'], text: 'Q11 share ' + T + ' ' + parts.join(':'), bad: [[sh[1].toFixed(2), sh[0].toFixed(2)], [rnd(T / parts[0], 2).toFixed(2), rnd(T / parts[1], 2).toFixed(2)]] });
        } };
      }) },
      /* ---------- Q12 ---------- */
      { num: '12', stem: '', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var c = r.pick([{ w: 'A greenhouse worker mixes plant food and water', a: 'plant food', tank: 'watering tank' }, { w: 'A cleaner mixes floor cleaner and water', a: 'floor cleaner', tank: 'bucket' }, { w: 'A landscaper mixes weed spray concentrate and water', a: 'concentrate', tank: 'sprayer tank' }]);
          var v = find(function () { return [r.int(3, 9), r.pick([0.25, 0.5, 0.75, 1, 1.5, 2, 2.5])]; }, function (v) { var T = (v[0] + 1) * v[1]; return T >= 4 && T <= 20 && !(v[0] === 5 && Math.abs(T - 4.5) < 1e-9) && !isInt(T / v[0]); }, [7, 1.5]);
          var n = v[0], one = v[1], T = rnd((n + 1) * one, 6), A = one, Wt = rnd(n * one, 6);
          var wA = [{ v: T / n, code: 'u1l3-one-term-div', hint: 'Divide by the <b>total</b> number of parts: ' + t('1+' + n + '=' + (n + 1)) + ', not by ' + t(n) + '.' }, { v: T / (n + 1) * n, code: 'value', hint: null }];
          var wW = [{ v: n * T, code: 'u1l3-per-part', hint: 'First find one part: ' + t(nT(T) + '\\div ' + (n + 1)) + '. Then water is ' + t(n) + ' parts.' }, { v: T - T / n, code: 'u1l3-one-term-div', hint: 'Divide by the total number of parts, ' + t('1+' + n + '=' + (n + 1)) + '.' }, { v: T / n, code: 'u1l3-one-term-div', hint: 'Divide by the total number of parts, ' + t('1+' + n + '=' + (n + 1)) + '.' }];
          return fieldsPart(c.w + ' in the ratio ' + t('1:' + n) + '. ' + (c.w.indexOf('worker') >= 0 ? 'She' : 'They') + ' fill' + (c.w.indexOf('worker') >= 0 ? 's' : '') + ' a ' + t(nT(T) + u('L')) + ' ' + c.tank + '. How much ' + c.a + ' and how much water go in?', [{ label: c.a, name: c.a, after: 'L' }, { label: 'water', name: 'water', after: 'L' }],
            [numChk(A, wA), numChk(Wt, wW)], [nf(A), nf(Wt)], c.a + ': ' + t(nT(A)) + ' L, water: ' + t(nT(Wt)) + ' L', { vals: [A, Wt], sol: br(shareLines(T, [1, n], function (x) { return nT(rnd(x, 6)) + u('L'); }, [c.a, 'water'])), hints: ['How many parts are there in all?', 'One part = the full tank ÷ the number of parts.'], text: 'Q12' });
        } }] },
      /* ---------- Q13 ---------- */
      { num: '13', stem: '', parts: [
        { id: '13', level: 'ADV', make: function (r) {
          var nm = r.pick(NAMES2), item = r.pick(['game console', 'used e-bike', 'tent', 'gaming PC', 'snowboard']);
          var v = find(function () { var pq = cop(r, 1, 5, function (v) { return v[0] < v[1]; }); return [pq[0], pq[1], r.pick([20, 25, 30, 40, 45, 50, 60, 70, 75, 80, 90, 100])]; }, function (v) { var T = (v[0] + v[1]) * v[2]; return v[0] > 1 && T >= 200 && T <= 900; }, [2, 3, 90]);
          var p = v[0], q = v[1], one = v[2], S = p * one, T = (p + q) * one, L = q * one;
          var cT = moneyChk(T, [{ v: S * (p + q), code: 'u1l3-total-parts', hint: t(mT(S)) + ' is ' + t(p) + ' parts, not one part. One part ' + t('=' + mT(S) + '\\div ' + p + '=' + mT(one)) + '.' }, { v: S + S * q, code: 'u1l3-total-parts', hint: t(mT(S)) + ' is ' + t(p) + ' parts. Find one part first: ' + t(mT(S) + '\\div ' + p) + '.' }, { v: L, code: 'u1l3-answered-other', hint: 'That’s ' + nm[1] + '’s share. The cost is both shares together.' }]);
          var cL = moneyChk(L, [{ v: S * q, code: 'u1l3-total-parts', hint: t(mT(S)) + ' is ' + t(p) + ' parts. One part ' + t('=' + mT(S) + '\\div ' + p) + '; ' + nm[1] + ' pays ' + t(q) + ' parts.' }, { v: T, code: 'u1l3-answered-other', hint: 'That’s the whole cost. ' + nm[1] + ' pays ' + t(q) + ' parts.' }, { v: S * q / (p + q), code: 'value', hint: null }]);
          return fieldsPart(nm[0] + ' and ' + nm[1] + ' split the cost of a ' + item + ' in the ratio ' + t(p + ':' + q) + '. ' + nm[0] + ' pays the smaller share, ' + t(mP(S)) + '. What did the ' + item + ' cost? How much did ' + nm[1] + ' pay?', [{ label: 'Cost of the ' + item, name: 'Cost', before: '$' }, { label: nm[1] + ' paid', name: nm[1], before: '$' }],
            [cT, cL], [T.toFixed(2), L.toFixed(2)], 'Cost ' + t(mT(T)) + ', ' + nm[1] + ' ' + t(mT(L)), { vals: [T, L], sol: br([nm[0] + '’s ' + t(p) + ' parts ' + t('=' + mT(S)) + ', so one part ' + t('=' + mT(S) + '\\div ' + p + '=' + mT(one)), 'Cost ' + t('=' + (p + q) + '\\text{ parts}=' + (p + q) + '\\times ' + mT(one) + '=' + mT(T)), nm[1] + ' ' + t('=' + q + '\\times ' + mT(one) + '=' + mT(L)), 'Check: ' + t(mT(S) + '+' + mT(L) + '=' + mT(T)) + ' ✓']),
              hints: [nm[0] + '’s share is ' + t(p) + ' parts. What is one part?', 'The whole cost is ' + t(p + '+' + q + '=' + (p + q)) + ' parts.'], text: 'Q13' });
        } }] },
      /* ---------- Q14 ---------- */
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var c = r.pick([['apprentices', 'journeypersons', 'workers on the site', 'A job site has'], ['part-time staff', 'full-time staff', 'staff', 'A grocery store has'], ['Grade 10s', 'Grade 11s', 'students on the team', 'A volleyball team has']]);
          var v = find(function () { return [r.int(4, 18), r.int(4, 18)]; }, function (v) { var T = v[0] + v[1]; return v[0] !== v[1] && gcd(v[0], T) > 1 && simp([v[0], T])[1] <= 12 && !same(simp([v[0], v[1]]), simp([v[0], T])) && !same(simp([v[1], T]), simp([v[0], T])); }, [12, 15]);
          var A = v[0], J = v[1], T = A + J, R = simp([A, T]);
          var opts = [{ html: t(rT(simp([A, J]))), why: 'That compares ' + c[0] + ' with ' + c[1] + '. The question asks for ' + c[0] + ' to <b>all</b> ' + c[2] + ': ' + t(A + '+' + J + '=' + T) + '.' }, { html: t(rT(R)), right: true },
            { html: t(rT(simp([J, T]))), why: 'That is ' + c[1] + ' to all ' + c[2] + '.' }, { html: t(rT([R[1], R[0]])), why: 'That is the right numbers in the wrong order: ' + c[0] + ' come first.' }];
          return P.mc(r, c[3] + ' ' + t(A) + ' ' + c[0] + ' and ' + t(J) + ' ' + c[1] + '. The ratio of ' + c[0] + ' to <b>all</b> ' + c[2] + ', in simplest form, is', opts,
            'All: ' + t(A + '+' + J + '=' + T) + '<br>' + t(A + ':' + T + '=' + rT(R)), ['Find the total first.'], 'Q14 MC', true);
        } }] },
      /* ---------- Q15 ---------- */
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(1, 3), r.pick([10, 12, 15, 20, 30, 40, 45])]; }, function (v) { var M = 60 * v[0]; return v[1] < M && !same(simp([M, v[1]]), simp([v[0], v[1]])) && simp([M, v[1]])[0] <= 12; }, [1, 20]);
          var H = v[0], M = v[1], R = simp([60 * H, M]);
          var c = [{ html: t(H + ':' + M), why: 'Change to the same unit first: ' + t(H + u('h') + '=' + 60 * H + u('min')) + '.' }, { html: t(rT(R)), right: true }, { html: t(rT([R[1], R[0]])), why: 'The hours come first, so the bigger number goes first here.' }, { html: t(60 * H + ':' + M), why: 'Right units, but not in simplest form yet.' }];
          return P.mc(r, 'The ratio ' + t(H + u('h') + ':' + M + u('min')) + ' in simplest form is', c, t(H + u('h') + '=' + 60 * H + u('min')) + '<br>' + br(simpLines([60 * H, M])), ['Change the hours to minutes.'], 'Q15 MC', true);
        } }] },
      /* ---------- Q16 ---------- */
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var nm = r.pick(NAMES2);
          var v = find(function () { var pq = cop(r, 2, 6, function (v) { return v[0] < v[1]; }); return [pq[0], pq[1], r.int(5, 20)]; }, function (v) { var T = (v[0] + v[1]) * v[2], opts = [v[1] * v[2], v[0] * v[2], rnd(T / v[0], 2), rnd(T * v[0] / v[1], 2)]; return T <= 200 && opts.every(function (x, i) { return opts.indexOf(x) === i; }) && !(T === 120 && v[0] === 3); }, [3, 4, 12]);
          var p = v[0], q = v[1], one = v[2], T = (p + q) * one;
          var opts = [{ html: t(mT(rnd(T / p, 2))), why: 'Don’t divide by ' + t(p) + '. There are ' + t(p + '+' + q + '=' + (p + q)) + ' parts in all.' }, { html: t(mT(p * one)), why: 'That’s the <b>smaller</b> share.' }, { html: t(mT(q * one)), right: true }, { html: t(mT(rnd(T * p / q, 2))), why: 'That’s ' + t('\\frac{' + p + '}{' + q + '}') + ' of the total. Use the total number of parts, ' + t(p + q) + '.' }];
          return P.mc(r, nm[0] + ' and ' + nm[1] + ' share ' + t(mP(T)) + ' in the ratio ' + t(p + ':' + q) + '. The larger share is', opts.sort(function (a, b) { return Number(a.html.replace(/[^\d.]/g, '')) - Number(b.html.replace(/[^\d.]/g, '')); }),
            t(p + '+' + q + '=' + (p + q)) + ' parts; one part ' + t('=' + mT(T) + '\\div ' + (p + q) + '=' + mT(one)) + '<br>Larger share ' + t('=' + q + '\\times ' + mT(one) + '=' + mT(q * one)), ['Divide by the total number of parts.'], 'Q16 MC', true);
        } }] },
      /* ---------- Q17 ---------- */
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.pick([15, 20, 30, 45, 25, 40, 50, 18, 36]), r.pick([1.5, 2.5, 1.25, 3.5, 0.75, 4.5])]; }, function (v) { var M = rnd(v[1] * 60, 6), s = simp([v[0], M]); return isInt(M) && v[0] < M && s[1] <= 99 && s[0] > 1 && !(v[0] === 45 && v[1] === 2); }, [45, 2.5]);
          var X = v[0], H = v[1], M = rnd(H * 60, 6), s = simp([X, M]);
          return numPart('The ratio ' + t(X + u('min') + ':' + nT(H) + u('h')) + ' in simplest form is ' + t(s[0] + ':b') + '. The value of ' + t('b') + ' is ________.', s[1], { nr: true,
            wrongs: [{ v: M, code: 'u1l3-simplify', hint: 'Right minutes — now simplify ' + t(X + ':' + M) + ' so the first term is ' + t(s[0]) + ': divide both terms by ' + t(gcd(X, M)) + '.' }, { v: simp([X, H * 100])[0] === s[0] ? simp([X, H * 100])[1] : -1, code: 'u1l3-wrong-factor', hint: 'An hour has ' + t('60') + ' minutes, so ' + t(nT(H) + u('h') + '=' + nT(H) + '\\times 60') + '.' }, { v: M / X * s[0], code: 'value', hint: null }],
            sol: br([t(nT(H) + u('h') + '=' + nT(H) + '\\times 60=' + M + u('min')), t(X + ':' + M)].concat(simpLines([X, M])).concat(['so ' + t('b=' + s[1]) + '.'])), hints: ['Change the hours to minutes: multiply by ' + t('60') + '.'], text: 'Q17 NR' });
        } }] },
      /* ---------- Q18 ---------- */
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var c = r.pick([{ w: 'A bag of trail mix has peanuts, raisins and chocolate chips', it: ['peanuts', 'raisins', 'chocolate chips'], bag: 'bag' }, { w: 'A bag of snack mix has pretzels, cereal and nuts', it: ['pretzels', 'cereal', 'nuts'], bag: 'bag' }, { w: 'A jar of mixed nuts has cashews, almonds and pecans', it: ['cashews', 'almonds', 'pecans'], bag: 'jar' }]);
          var v = find(function () { return [r.int(2, 6), r.int(1, 5), r.int(1, 4), r.pick([500, 600, 750, 800, 900, 1000, 1200])]; }, function (v) { var n = v[0] + v[1] + v[2]; return v[0] > v[1] && v[1] !== v[2] && (v[3] / n) % 1 === 0 && v[3] / n * v[1] < 10000; }, [5, 3, 2, 800]);
          var T = [v[0], v[1], v[2]], M = v[3], n = sum(T), one = M / n, ans = T[1] * one;
          return numPart(c.w + ' in the ratio ' + t(rT(T)) + ' by mass. The ' + c.bag + ' holds ' + t(M + u('g')) + '. The mass of ' + c.it[1] + ', in grams, is ________.', ans, { nr: true,
            wrongs: [{ v: M / T[1], code: 'u1l3-one-term-div', hint: 'Divide by the total number of parts: ' + t(T.join('+') + '=' + n) + '.' }, { v: one, code: 'u1l3-per-part', hint: 'That is one part. The ' + c.it[1] + ' are ' + t(T[1]) + ' parts.' }],
            sol: br([t(T.join('+') + '=' + n) + ' parts', 'One part ' + t('=' + M + '\\div ' + n + '=' + nT(one) + u('g')), c.it[1] + ' ' + t('=' + T[1] + '\\times ' + nT(one) + '=' + nT(ans) + u('g'))]), hints: ['Add the terms to get the total number of parts.'], text: 'Q18 NR' });
        } }] }
    ],
    extra: [
      /* ---------- A. Skills ---------- */
      { num: '1', section: 'Extra practice A — Skills', shared: function (r) {
        var v = find(function () { return [r.int(3, 9) * 2, r.int(2, 6) * 2, r.int(1, 4) * 2]; }, function (v) { return v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2] && gcd(v[0], v[1]) > 1; }, [6, 4, 2]);
        var f = r.pick([['roses', 'lilies', 'daisies', 'flowers', 'bouquet'], ['tulips', 'irises', 'daisies', 'flowers', 'bouquet'], ['red balloons', 'white balloons', 'gold balloons', 'balloons', 'bunch of balloons']]);
        return { n: v, f: f, T: sum(v) };
      }, stem: function (s) { return 'A ' + s.f[4] + ' has ' + t(s.n[0]) + ' ' + s.f[0] + ', ' + t(s.n[1]) + ' ' + s.f[1] + ' and ' + t(s.n[2]) + ' ' + s.f[2] + '. Write each ratio as a fraction, then in simplest form.'; }, parts: [
        { id: 'e1a', level: 'BEG', make: function (r, s) {
          var a = s.n[0], b = s.n[1], S = simp([a, b]);
          return fieldsPart(s.f[0] + ' to ' + s.f[1], [ratioField('As a fraction', 'Fraction'), ratioField('Simplest form', 'Simplest form')], [ratioChk([a, b], { simplest: false, frac: true }), ratioChk(S, {})], ['\\frac{' + a + '}{' + b + '}', rT(S)],
            'As a fraction ' + t('\\frac{' + a + '}{' + b + '}') + ', simplest form ' + t(rT(S)), { sol: br(['Colon ' + t(a + ':' + b) + ', words: ' + a + ' to ' + b + ', fraction ' + t('\\frac{' + a + '}{' + b + '}')].concat(simpLines([a, b]))), hints: [s.f[0] + ' first (on top).'], text: 'EP1a' });
        } },
        { id: 'e1b', level: 'BEG', make: function (r, s) {
          var a = s.n[2], T = s.T, S = simp([a, T]);
          return fieldsPart(s.f[2] + ' to all ' + s.f[3], [ratioField('As a fraction', 'Fraction'), ratioField('Simplest form', 'Simplest form')],
            [ratioChk([a, T], { simplest: false, frac: true, wrongs: [{ r: [a, T - a], code: 'u1l3-whole-wrong', hint: 'All ' + s.f[3] + ': ' + t(s.n.join('+') + '=' + T) + '.' }] }), ratioChk(S, { wrongs: [{ r: [a, T - a], code: 'u1l3-whole-wrong', hint: 'All ' + s.f[3] + ': ' + t(s.n.join('+') + '=' + T) + '.' }] })], ['\\frac{' + a + '}{' + T + '}', rT(S)],
            'As a fraction ' + t('\\frac{' + a + '}{' + T + '}') + ', simplest form ' + t(rT(S)), { sol: br(['All ' + s.f[3] + ': ' + t(s.n.join('+') + '=' + T), 'Colon ' + t(a + ':' + T) + ', words: ' + a + ' to ' + T + ', fraction ' + t('\\frac{' + a + '}{' + T + '}')].concat(simpLines([a, T]))), hints: ['Add all three to get the total.'], text: 'EP1b' });
        } }] },
      { num: '2', stem: 'Write each ratio in simplest form.', parts: [
        { id: 'e2a', level: 'LIM', make: function (r) { return simpPart(genSimp(r, [5], 2, 6)); } },
        { id: 'e2b', level: 'LIM', make: function (r) { var k = r.int(3, 9), g = r.int(4, 9); return simpPart([k * g, g]); } },
        { id: 'e2c', level: 'BEG', make: function (r) { return simpPart(genSimp(r, [9, 7, 8], 2, 5)); } },
        { id: 'e2d', level: 'BEG', make: function (r) { return simpPart(genSimp(r, [25, 20, 15], 2, 6, function (v) { return v[0] < v[1]; })); } }] },
      { num: '3', stem: 'Write each ratio in simplest form, using whole numbers in the same unit.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9]), r.int(1, 6)]; }, function (v) { return !inList(v, EX_SIMP) && simp(v)[0] !== Math.round(v[0] * 10); }, [0.5, 2]); return simpPart(v); } },
        { id: 'e3b', level: 'EMG', make: function (r) { return simpPart(genDec(r, [1.6, 0.8, 1.2, 1.4], 2, 5, function (v) { return !isInt(v[0]) && !isInt(v[1]); })); } },
        { id: 'e3c', level: 'EMG', make: function (r) { return unitPart(r, 's_min', [2, 3, 4, 5], [30, 45, 60, 90, 120, 40, 80], []); } },
        { id: 'e3d', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([1.2, 1.5, 2, 2.4, 1.8, 3]), r.pick([20, 25, 30, 40, 50, 60, 75, 80])]; }, function (v) { var X = rnd(v[0] * 100, 6); return v[1] < X && simp([X, v[1]]).every(function (x) { return x <= 20; }) && !same(simp([X, v[1]]), simp([v[0], v[1]])); }, [1.2, 40]);
          var m = v[0], c = v[1], X = rnd(m * 100, 6), want = simp([X, c]);
          return ratioPart(t(nT(m) + u('m') + ':' + c + u('cm')), want, { wrongs: [{ r: [m, c], code: 'u1l3-no-convert', hint: 'Change the metres to centimetres first: ' + t(nT(m) + u('m') + '=' + X + u('cm')) + '.' }, { r: [rnd(m * 1000, 6), c], code: 'u1l3-wrong-factor', hint: 'Check the conversion: ' + t('1' + u('m') + '=100' + u('cm')) + '.' }],
            sol: br([t(nT(m) + u('m') + '=' + nT(m) + '\\times 100=' + X + u('cm')), t(X + ':' + c)].concat(simpLines([X, c]))), hints: ['Change the metres to centimetres: ' + t('1' + u('m') + '=100' + u('cm')) + '.'], text: 'EP3d' });
        } },
        { id: 'e3e', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([100, 200, 300, 400, 500, 600, 250, 750]), r.pick([1.2, 1.4, 1.5, 1.6, 1.8, 2.4, 3.5])]; }, function (v) { var S = rnd(v[1] * 1000, 6); return v[0] < S && simp([v[0], S]).every(function (x) { return x <= 20; }); }, [400, 1.4]);
          var X = v[0], L = v[1], S = rnd(L * 1000, 6), want = simp([X, S]);
          return ratioPart(t(X + u('mL') + ':' + nT(L) + u('L')), want, { wrongs: [{ r: [X, L], code: 'u1l3-no-convert', hint: 'Change the litres to millilitres first: ' + t(nT(L) + u('L') + '=' + HW.fmt(S) + u('mL')) + '.' }, { r: [X, rnd(L * 100, 6)], code: 'u1l3-wrong-factor', hint: 'Check the conversion: ' + t('1' + u('L') + '=1000' + u('mL')) + '.' }],
            sol: br([t(nT(L) + u('L') + '=' + nT(L) + '\\times 1000=' + HW.fmt(S) + u('mL')), t(X + ':' + HW.fmt(S))].concat(simpLines([X, S]))), hints: ['Change the litres to millilitres: ' + t('1' + u('L') + '=1000' + u('mL')) + '.'], text: 'EP3e' });
        } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4', level: 'EMG', make: function (r) {
          var base = cop(r, 2, 7, function (v) { return v[0] > v[1] && v[1] % 2 === 0 || v[0] > v[1] && v[1] === 3; }), k1 = 2, k2 = r.pick([3, 4]), k3 = r.pick([5, 6]);
          var p = ratioTablePart('Complete the ratio table for the ratio ' + t(rT(base)) + '.', ['First term', 'Second term'], '', base, [{ k: k1, top: true }, { k: k2, top: false }, { k: k3, top: true }, { k: 1.5, top: false }]);
          p.text = 'EP4 ratio table'; return p;
        } }] },
      { num: '5', stem: '', parts: [
        { id: 'e5', level: 'BEG', make: function (r) {
          var mk = [
            function () { var pq = cop(r, 2, 7), m = r.int(2, 4); return { a: pq, b: [pq[0] * m, pq[1] * m], yes: true, why: t(rT([pq[0] * m, pq[1] * m]) + '=' + rT(pq)) }; },
            function () { var pq = cop(r, 2, 7); return { a: pq, b: [pq[1], pq[0]], yes: false, why: 'order switched' }; },
            function () { var pq = cop(r, 2, 5), m = r.int(2, 3), n = r.int(4, 6); return { a: [pq[0] * m, pq[1] * m], b: [pq[0] * n, pq[1] * n], yes: true, why: 'both ' + t('=' + rT(pq)) }; },
            function () { var pq = cop(r, 2, 7, function (v) { return v[0] > v[1]; }), m = r.int(3, 4); return { a: pq, b: [pq[0] * m, pq[1] * (m - 1)], yes: false, why: '' }; }];
          var items = r.shuffle(mk.map(function (f, i) { var x = f(); x.id = 'p' + i; if (!x.yes) { if (same(x.a, x.b)) x.b = [x.b[0], x.b[1] + 1]; var sa = simp(x.a), sb = simp(x.b); x.why = x.why || ((gcdAll(x.a) > 1 ? t(rT(x.a) + '=' + rT(sa)) : t(rT(x.a))) + ' but ' + (gcdAll(x.b) > 1 ? t(rT(x.b) + '=' + rT(sb)) : t(rT(x.b)) + ' (already simplest)')); } return x; }));
          var want = {}; items.forEach(function (x) { want[x.id] = x.yes ? 'y' : 'n'; });
          return P.grid('Are the two ratios equivalent?', items.map(function (x) { return { id: x.id, html: t(rT(x.a)) + ' and ' + t(rT(x.b)) }; }), [{ id: 'y', html: 'Yes' }, { id: 'n', html: 'No' }], want,
            { why: function (row) { var x = items.filter(function (y) { return y.id === row; })[0]; return x.yes ? 'Simplify both: ' + t(rT(x.a) + '=' + rT(simp(x.a))) + ' and ' + t(rT(x.b) + '=' + rT(simp(x.b))) + '.' : 'Simplify both: ' + t(rT(x.a) + '=' + rT(simp(x.a))) + ' and ' + t(rT(x.b) + '=' + rT(simp(x.b))) + '. Order matters too.'; } },
            br(items.map(function (x) { return t(rT(x.a)) + ' and ' + t(rT(x.b)) + ': ' + (x.yes ? '<b>yes</b> (' + x.why + ')' : 'no (' + x.why + ')'); })), ['Simplify both ratios and compare them, in order.'], 'EP5');
        } }] },
      /* ---------- B. Applying ---------- */
      { num: '6', section: 'Extra practice B — Applying', stem: '', parts: [
        { id: 'e6', level: 'PRG', make: function (r) {
          var nm = r.pick(['Kofi', 'Ellie', 'Raj', 'Hana', 'Ben']), job = r.pick(['a movie theatre', 'a grocery store', 'a car wash', 'a pizza place']);
          var v = find(function () { return [r.int(2, 6), r.pick([15, 30, 45]), r.int(3, 8), r.pick([0, 0, 30])]; }, function (v) { var a = v[0] * 60 + v[1], b = v[2] * 60 + v[3]; return a !== b && simp([a, b]).every(function (x) { return x <= 16; }) && !(v[0] === 4 && v[1] === 30 && v[2] === 6 && v[3] === 0 && false); }, [4, 30, 6, 0]);
          var a = v[0] * 60 + v[1], b = v[2] * 60 + v[3], tA = v[0] + u('h') + '\\ ' + v[1] + u('min'), tB = v[2] + u('h') + (v[3] ? '\\ ' + v[3] + u('min') : ''), want = simp([a, b]);
          return ratioPart(nm + ' works ' + t(tA) + ' at ' + job + ' on Friday and ' + t(tB) + ' on Saturday. Write the ratio of ' + (pron(nm) === 'she' ? 'her' : 'his') + ' Friday time to ' + (pron(nm) === 'she' ? 'her' : 'his') + ' Saturday time in simplest form.', want, {
            wrongs: [{ r: [v[0] + v[1] / 100, v[2] + v[3] / 100], code: 'u1l3-no-convert', hint: 'Change both times to minutes: ' + t(v[0] + u('h') + '=' + v[0] * 60 + u('min')) + '.' }, { r: [v[0] * 100 + v[1], v[2] * 100 + v[3]], code: 'u1l3-wrong-factor', hint: 'An hour has ' + t('60') + ' minutes, not ' + t('100') + '.' }, { r: [v[0] + v[1] / 60, v[2] + v[3] / 60], code: 'value', hint: null }],
            sol: br(['Use minutes: ' + t(tA + '=' + v[0] + '\\times 60+' + v[1] + '=' + a + u('min')) + ' and ' + t(tB + '=' + b + u('min')), t(a + ':' + b)].concat(simpLines([a, b]))), hints: ['Change both times to minutes.'], text: 'EP6' });
        } }] },
      { num: '7', shared: function (r) { var v = find(function () { return [r.int(8, 24), r.pick([20, 24, 25, 30, 32, 36, 40])]; }, function (v) { return v[0] < v[1] && v[0] * 2 !== v[1] && gcd(v[0], v[1] - v[0]) > 1 && gcd(v[0], v[1]) > 1; }, [18, 30]); return { M: v[0], N: v[1], nm: r.pick(['Kayla', 'Jordan', 'Maya', 'Liam']), what: r.pick([['free throws', 'shots'], ['penalty shots', 'shots'], ['serves', 'serves']]) }; },
        stem: function (s) { return s.nm + ' made ' + t(s.M) + ' of ' + (pron(s.nm) === 'she' ? 'her' : 'his') + ' ' + t(s.N) + ' ' + s.what[0] + ' this season.'; }, parts: [
          { id: 'e7a', level: 'EMG', make: function (r, s) { var X = s.N - s.M; return ratioPart('Write the ratio of ' + s.what[1] + ' made to ' + s.what[1] + ' missed in simplest form.', simp([s.M, X]), { wrongs: [{ r: [s.M, s.N], code: 'u1l3-whole-wrong', hint: 'Missed ' + t('=' + s.N + '-' + s.M + '=' + X) + '. Compare made with missed.' }], sol: br(['Missed: ' + t(s.N + '-' + s.M + '=' + X), t(s.M + ':' + X)].concat(simpLines([s.M, X]))), hints: ['How many were missed?'], text: 'EP7a' }); } },
          { id: 'e7b', level: 'BEG', make: function (r, s) { return ratioPart('Write the ratio of ' + s.what[1] + ' made to ' + s.what[1] + ' taken in simplest form.', simp([s.M, s.N]), { wrongs: [{ r: [s.M, s.N - s.M], code: 'u1l3-not-whole', hint: 'That compares made with missed. Compare made with all ' + t(s.N) + ' taken.' }], sol: br([t(s.M + ':' + s.N)].concat(simpLines([s.M, s.N]))), hints: [s.what[1] + ' taken = all ' + t(s.N) + '.'], text: 'EP7b' }); } }] },
      { num: '8', shared: function (r) { return { n: r.pick([3, 4, 5, 7, 9]), V: r.pick([250, 400, 500, 600, 750, 800]), B: r.pick([1, 1.5, 2, 0.5]), c: r.pick([['A cleaning spray', 'vinegar', 'spray bottle'], ['A window cleaner', 'cleaner', 'spray bottle'], ['A plant mister', 'plant food', 'mister bottle']]) }; },
        stem: function (s) { return s.c[0] + ' is mixed ' + t('1') + ' part ' + s.c[1] + ' to ' + t(s.n) + ' parts water.'; }, parts: [
          { id: 'e8a', level: 'EMG', make: function (r, s) { var mL = s.V * s.n, L = mL / 1000; return numPart('How much water goes with ' + t(s.V + u('mL')) + ' of ' + s.c[1] + '? Give your answer in <b>litres</b>.', L, { after: 'L', unit: 'L',
            wrongs: [{ v: mL, code: 'u1l3-ml-l', hint: 'That is in millilitres. Change it to litres: divide by ' + t('1000') + '.' }, { v: s.V / s.n / 1000, code: 'u1l3-flip-rate', hint: 'Water is ' + t(s.n) + ' times the ' + s.c[1] + ': multiply.' }, { v: s.V / s.n, code: 'u1l3-flip-rate', hint: 'Water is ' + t(s.n) + ' times the ' + s.c[1] + ': multiply.' }],
            sol: br([t(s.V + '\\times ' + s.n + '=' + HW.fmt(mL) + u('mL')), t(HW.fmt(mL) + u('mL') + '\\div 1000=' + nT(L) + u('L')) + ' of water']), hints: ['Water is ' + t(s.n) + ' times the ' + s.c[1] + '.', 'Then change mL to L.'], text: 'EP8a' }); } },
          { id: 'e8b', level: 'PRG', make: function (r, s) { var mL = s.B * 1000, ans = mL / (s.n + 1); if (!isInt(ans * 10)) { s.B = 1; mL = 1000; ans = mL / (s.n + 1); }
            return numPart('How much ' + s.c[1] + ' is in a full ' + t(nT(s.B) + u('L')) + ' ' + s.c[2] + '? Give your answer in millilitres.', rnd(ans, 1), { after: 'mL', unit: 'mL', dp: isInt(ans) ? null : 1,
              wrongs: [{ v: rnd(mL / s.n, 1), code: 'u1l3-one-term-div', hint: 'Divide by the total number of parts: ' + t('1+' + s.n + '=' + (s.n + 1)) + '.' }, { v: rnd(ans / 1000, 4), code: 'u1l3-ml-l', hint: 'That is in litres. The box wants millilitres: ' + t('1' + u('L') + '=1000' + u('mL')) + '.' }, { v: rnd(ans * s.n, 1), code: 'u1l3-answered-other', hint: 'That is the water. The question asks for the ' + s.c[1] + '.' }],
              sol: br([t(nT(s.B) + u('L') + '=' + HW.fmt(mL) + u('mL')), t('1+' + s.n + '=' + (s.n + 1)) + ' parts', 'one part ' + t('=' + HW.fmt(mL) + '\\div ' + (s.n + 1) + (isInt(ans * 10) ? '=' : '\\approx ') + nT(rnd(ans, 1)) + u('mL')), 'There ' + (isInt(ans) ? 'are ' : 'are about ') + t(nT(rnd(ans, 1)) + u('mL')) + ' of ' + s.c[1] + '.']), hints: ['How many parts in all?', 'Work in millilitres.'], text: 'EP8b' }); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'EMG', make: function (r) {
          var nm = r.pick([['Two sisters', 'the older sister', 'the younger sister'], ['Two brothers', 'the older brother', 'the younger brother'], ['Two cousins', 'the first cousin', 'the second cousin']]), ev = r.pick(['a garage sale', 'a bottle drive', 'selling crafts']);
          var v = find(function () { var pq = cop(r, 2, 7, function (v) { return v[0] < v[1]; }); return [pq[0], pq[1], r.pick([10, 15, 20, 25, 30, 40, 50, 60])]; }, function (v) { var T = (v[0] + v[1]) * v[2]; return T >= 100 && T <= 600; }, [3, 4, 50]);
          var parts = [v[0], v[1]], one = v[2], T = sum(parts) * one, sh = parts.map(function (p) { return p * one; });
          return fieldsPart(nm[0] + ' share ' + t(mP(T)) + ' from ' + ev + ' in the ratio ' + t(rT(parts)) + '. How much does each get?', [{ label: 'First share', name: 'First share', before: '$' }, { label: 'Second share', name: 'Second share', before: '$' }],
            parts.map(function (p, j) { return moneyChk(sh[j], shareWrongs(T, parts, j)); }), sh.map(function (x) { return x.toFixed(2); }), t(mT(sh[0])) + ' and ' + t(mT(sh[1])), { vals: sh, sol: br(shareLines(T, parts, mT)), hints: ['Add the terms to get the total number of parts.'], text: 'EP9' });
        } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.int(2, 5), r.int(2, 6), r.int(1, 3), r.pick([0.8, 1, 1.2, 1.5, 1.6, 2, 2.4])]; }, function (v) { var n = v[0] + v[1] + v[2], G = rnd(v[3] * 1000, 6); return v[0] !== v[1] && isInt(G / n) && !(v[0] === 3 && v[1] === 4 && v[2] === 1 && v[3] === 1.2 && false); }, [3, 4, 1, 1.2]);
          var T = [v[0], v[1], v[2]], kg = v[3], G = rnd(kg * 1000, 6), n = sum(T), one = G / n, A = T.map(function (x) { return x * one; }), it = ['pretzels', 'cereal', 'nuts'];
          var ch = T.map(function (x, i) { return numChk(A[i], [{ v: x * kg / n, code: 'u1l3-ml-l', hint: 'Change ' + t(nT(kg) + u('kg')) + ' to grams first (' + t('\\times 1000') + ').' }, { v: G / x, code: 'u1l3-one-term-div', hint: 'Divide by the total number of parts, ' + t(T.join('+') + '=' + n) + '.' }]); });
          return fieldsPart('A ' + t(nT(kg) + u('kg')) + ' bag of snack mix has pretzels, cereal and nuts in the ratio ' + t(rT(T)) + ' by mass. How many grams of each are in the bag?', it.map(function (x) { return { label: x, name: x, after: 'g' }; }), ch, A.map(nf), it.map(function (x, i) { return x + ' ' + t(nT(A[i]) + u('g')); }).join(', '),
            { vals: A, sol: br([t(nT(kg) + u('kg') + '=' + HW.fmt(G) + u('g')), t(T.join('+') + '=' + n) + ' parts; one part ' + t('=' + HW.fmt(G) + '\\div ' + n + '=' + nT(one) + u('g')), it.map(function (x, i) { return x + ' ' + t(T[i] + '\\times ' + nT(one) + '=' + nT(A[i]) + u('g')); }).join(', '), 'Check: ' + t(A.map(nT).join('+') + '=' + HW.fmt(G)) + ' ✓']), hints: ['Change kilograms to grams first.', 'Then find one part.'], text: 'EP10' });
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e11', level: 'BEG', make: function (r) {
          var pq = cop(r, 2, 5, function (v) { return v[0] > v[1]; }), m = r.pick([3, 4, 5]), base = [pq[0] * m, pq[1] * m], k = r.pick([2, 3].filter(function (x) { return x !== m; }));
          var opts = [{ html: t(rT(pq)), why: t(rT(base) + '=' + rT(pq)) + ' (divide by ' + t(m) + '), so this one is equivalent.' }, { html: t(rT([pq[0] * k, pq[1] * k])), why: 'This simplifies to ' + t(rT(pq)) + ', so it is equivalent.' }, { html: t(rT([base[0] * 2, base[1] * 2])), why: 'This is ' + t(rT(base)) + ' doubled, so it is equivalent.' }, { html: t(rT([pq[1], pq[0]])), right: true }];
          return P.mc(r, 'Which ratio is <b>not</b> equivalent to ' + t(rT(base)) + '?', opts, t(rT(base) + '=' + rT(pq)) + ', and ' + t(rT([pq[1], pq[0]])) + ' has the terms in the wrong order. (The others all simplify to ' + t(rT(pq)) + '.)', ['Simplify each one.'], 'EP11 MC', true);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'EMG', make: function (r) {
          var v = find(function () { var pq = cop(r, 1, 9, function (v) { return v[0] < v[1]; }); return [pq[0], pq[1], r.pick([900, 1000, 1200, 1350, 1500, 1800, 2000, 2400, 750, 1100])]; }, function (v) { var L = v[2] * v[1] / (v[0] + v[1]); return Math.round(L) < 10000 && (v[0] + v[1]) > 3; }, [2, 7, 1350]);
          var p = v[0], q = v[1], T = v[2], L = T * q / (p + q), ans = Math.round(L);
          return numPart('A ' + t(mP(T)) + ' prize is shared in the ratio ' + t(p + ':' + q) + '. The larger share, to the nearest dollar, is $________.', ans, { nr: true,
            wrongs: [{ v: Math.round(T / q), code: 'u1l3-one-term-div', hint: 'Divide by the total number of parts, ' + t(p + '+' + q + '=' + (p + q)) + '.' }, { v: Math.round(T * p / (p + q)), code: 'u1l3-answered-other', hint: 'That is the smaller share.' }, { v: Math.round(T / (p + q)), code: 'u1l3-per-part', hint: 'That is one part. The larger share is ' + t(q) + ' parts.' }],
            sol: br([t(p + '+' + q + '=' + (p + q)) + ' parts; one part ' + t('=' + mT(T) + '\\div ' + (p + q) + (isInt(T / (p + q) * 100) ? '=' : '\\approx ') + mT(T / (p + q))), 'Larger share ' + t('=' + q + '\\times ' + mT(T / (p + q)) + (isInt(L * 100) ? '=' + mT(L) : '\\approx ' + mT(L))) + (isInt(L) ? '' : ', about ' + t('\\$' + HW.fmt(ans)))]), hints: ['Add the terms to get the total number of parts.'], text: 'EP12 NR' });
        } }] },
      /* ---------- C. Stretch ---------- */
      { num: '13', section: 'Extra practice C — Stretch', stem: '', parts: [
        { id: 'e13', level: 'MAS', make: function (r) {
          var nm = r.pick(NAMES2), gift = r.pick(['their coach', 'a teacher', 'their grandma', 'a friend']);
          var v = find(function () { var pq = cop(r, 1, 7, function (v) { return v[0] < v[1]; }); return [pq[0], pq[1], r.int(3, 15)]; }, function (v) { return v[1] - v[0] >= 2 && (v[0] + v[1]) * v[2] <= 150; }, [2, 5, 7]);
          var p = v[0], q = v[1], one = v[2], D = (q - p) * one, A = p * one, B = q * one, T = A + B;
          var wr = [{ v: D, code: 'u1l3-diff-share', hint: t(mT(D)) + ' is the <b>difference</b>, ' + t(q - p) + ' parts. One part ' + t('=' + mT(D) + '\\div ' + (q - p)) + '.' }, { v: D / p * 1, code: 'u1l3-diff-share', hint: 'The difference ' + t(mT(D)) + ' is ' + t(q + '-' + p + '=' + (q - p)) + ' parts.' }, { v: D * p, code: 'u1l3-diff-share', hint: 'The difference ' + t(mT(D)) + ' is ' + t(q - p) + ' parts, not one part.' }, { v: D * q, code: 'u1l3-diff-share', hint: 'The difference ' + t(mT(D)) + ' is ' + t(q - p) + ' parts, not one part.' }, { v: D * (p + q), code: 'u1l3-diff-share', hint: 'The difference ' + t(mT(D)) + ' is ' + t(q - p) + ' parts, not one part.' }];
          return fieldsPart(nm[0] + ' and ' + nm[1] + ' buy a gift for ' + gift + '. They pay in the ratio ' + t(p + ':' + q) + ', and ' + nm[1] + ' pays ' + t(mP(D)) + ' more than ' + nm[0] + '. How much does each pay, and what did the gift cost?', [{ label: nm[0] + ' pays', name: nm[0], before: '$' }, { label: nm[1] + ' pays', name: nm[1], before: '$' }, { label: 'The gift cost', name: 'Gift', before: '$' }],
            [moneyChk(A, wr), moneyChk(B, wr), moneyChk(T, wr)], [A, B, T].map(function (x) { return x.toFixed(2); }), nm[0] + ' ' + t(mT(A)) + ', ' + nm[1] + ' ' + t(mT(B)) + ', gift ' + t(mT(T)),
            { vals: [A, B, T], sol: br([nm[1] + ' has ' + t(q + '-' + p + '=' + (q - p)) + ' more parts than ' + nm[0] + ', and that difference is ' + t(mT(D)) + '.', 'One part ' + t('=' + mT(D) + '\\div ' + (q - p) + '=' + mT(one)), nm[0] + ' ' + t(p + '\\times ' + mT(one) + '=' + mT(A)) + ', ' + nm[1] + ' ' + t(q + '\\times ' + mT(one) + '=' + mT(B)), 'Gift ' + t('=' + mT(A) + '+' + mT(B) + '=' + mT(T)) + ' (Check: ' + t(mT(B) + '-' + mT(A) + '=' + mT(D)) + ' ✓)']),
              hints: ['How many more parts does ' + nm[1] + ' have than ' + nm[0] + '?', 'Those extra parts are worth ' + t(mT(D)) + '.'], text: 'EP13' });
        } }] },
      { num: '14', shared: e14Shared, stem: function (s) { return s.dr.what + ' uses ' + s.dr.it[0] + ' and ' + s.dr.it[1] + ' in the ratio ' + t(s.a + ':' + s.b) + ', and ' + s.dr.it[1] + ' and ' + s.dr.it[2] + ' in the ratio ' + t(s.c + ':' + s.d) + '.'; }, parts: [
        { id: 'e14a', level: 'ADV', make: function (r, s) {
          var it = s.dr.it;
          return ratioPart('Write the ratio ' + it[0] + ' : ' + it[1] + ' : ' + it[2] + '. (Hint: make the ' + it[1] + ' terms match.)', s.tri, { wrongs: [{ r: [s.a, s.b, s.d], code: 'u1l3-no-match', hint: 'You can’t just join the two ratios: the ' + it[1] + ' terms (' + t(s.b) + ' and ' + t(s.c) + ') must match first. Make both ' + t(s.L) + '.' }, { r: [s.a, s.c, s.d], code: 'u1l3-no-match', hint: 'The ' + it[1] + ' terms (' + t(s.b) + ' and ' + t(s.c) + ') must match first. Make both ' + t(s.L) + '.' }, { r: [s.a, s.b + s.c, s.d], code: 'u1l3-no-match', hint: 'Don’t add the ' + it[1] + ' terms. Scale each ratio so the ' + it[1] + ' terms are both ' + t(s.L) + '.' }],
            sol: br([s.m1 > 1 ? t(s.a + ':' + s.b + '=' + s.a * s.m1 + ':' + s.L) + ' (' + t('\\times ' + s.m1) + ')' : it[0] + ' : ' + it[1] + ' ' + t('=' + s.a + ':' + s.b), s.m2 > 1 ? t(s.c + ':' + s.d + '=' + s.L + ':' + s.d * s.m2) + ' (' + t('\\times ' + s.m2) + ')' : it[1] + ' : ' + it[2] + ' ' + t('=' + s.c + ':' + s.d), it[0] + ' : ' + it[1] + ' : ' + it[2] + ' ' + t('=' + (s.a * s.m1) + ':' + s.L + ':' + (s.d * s.m2)) + (gcdAll([s.a * s.m1, s.L, s.d * s.m2]) > 1 ? t('=' + rT(s.tri)) : '')]),
            hints: ['Find a number that both ' + it[1] + ' terms, ' + t(s.b) + ' and ' + t(s.c) + ', go into.', 'Scale each ratio so the ' + it[1] + ' terms are equal.'], text: 'EP14a' });
        } },
        { id: 'e14b', level: 'ADV', make: function (r, s) {
          var it = s.dr.it, k = s.W / s.tri[2], ans = rnd(s.tri[0] * k, 6);
          var wr = [{ v: rnd(s.a / s.d * s.W, 6), code: 'u1l3-no-match', hint: 'Use the combined ratio ' + t(rT(s.tri)) + ' from part (a).' }, { v: rnd(s.tri[1] * k, 6), code: 'u1l3-answered-other', hint: 'That is the ' + it[1] + '. The question asks for the ' + it[0] + '.' }, { v: rnd(s.W / s.tri[0] * s.tri[2], 6), code: 'u1l3-flip-rate', hint: 'Find what ' + t(s.tri[2]) + ' was multiplied by to get ' + t(nT(s.W)) + '.' }];
          return numPart('How much ' + it[0] + ' goes with ' + t(nT(s.W) + u('L')) + ' of ' + it[2] + '?', ans, { after: 'L', unit: 'L', wrongs: wr,
            sol: br([it[2] + ': ' + t(s.tri[2] + '\\times ' + nT(rnd(k, 6)) + '=' + nT(s.W)) + ', so multiply every term by ' + t(nT(rnd(k, 6))) + ':', t(rT(s.tri) + '=' + rT(s.tri.map(function (x) { return rnd(x * k, 6); }))), t(nT(ans) + u('L')) + ' of ' + it[0]]), hints: ['Use the three-term ratio from part (a).', 'What was the ' + it[2] + ' term multiplied by?'], text: 'EP14b' });
        } }] },
      { num: '15', stem: '', parts: [
        { id: 'e15', level: 'MAS', make: function (r) {
          var col = r.pick(['blue', 'green', 'red']);
          var v = find(function () { return [r.int(2, 9), r.int(1, 4), r.int(3, 6), 1]; }, function (v) { var need = v[2] * v[1] / v[3]; return need > v[0] && need - v[0] <= 12 && gcd(v[0], v[1]) >= 1 && !same([v[0], v[1]], [v[2], v[3]]); }, [6, 2, 4, 1]);
          var Wt = v[0], B = v[1], p = v[2], q = v[3], need = p * B / q, add = need - Wt;
          var cur = simp([Wt, B]);
          var wr = [{ v: need, code: 'u1l3-total-not-added', hint: t(nT(need) + u('L')) + ' is the white paint she needs <b>in all</b>. She already has ' + t(Wt + u('L')) + '. How much more?' }, { v: p - cur[0] > 0 ? p - cur[0] : -1, code: 'u1l3-fixed-wrong', hint: 'Work with the real amounts: the ' + col + ' stays at ' + t(B + u('L')) + ', so ' + t(p + ':' + q + '=' + nT(need) + ':' + B) + '.' }, { v: p - Wt > 0 ? p - Wt : -1, code: 'u1l3-fixed-wrong', hint: 'The ' + col + ' paint stays at ' + t(B + u('L')) + '. Scale ' + t(p + ':' + q) + ' so the ' + col + ' term is ' + t(B) + '.' }];
          return numPart('A painter has a mix of ' + t(Wt + u('L')) + ' of white paint and ' + t(B + u('L')) + ' of ' + col + ' paint. She wants the ratio of white to ' + col + ' to be ' + t(p + ':' + q) + '. How much white paint must she add?', add, { after: 'L', unit: 'L', wrongs: wr,
            sol: br(['Now: ' + t(Wt + ':' + B) + (gcd(Wt, B) > 1 ? t('=' + rT(cur)) : '') + '. The ' + col + ' stays at ' + t(B + u('L')) + '.', t(p + ':' + q + '=' + nT(need) + ':' + B) + ', so she needs ' + t(nT(need) + u('L')) + ' of white in all.', 'She must add ' + t(nT(need) + '-' + Wt + '=' + nT(add) + u('L')) + ' of white paint.']), hints: ['The ' + col + ' paint doesn’t change.', 'How much white goes with ' + t(B + u('L')) + ' of ' + col + ' in the ratio ' + t(p + ':' + q) + '?'], text: 'EP15' });
        } }] }
    ]
  });
})(window);
