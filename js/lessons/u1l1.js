/* Math 10-3 · Unit 1 · Lesson 1 — Money Sense: Rounding, Estimating and Using Your Calculator (REV: refresher)
 * Assignment 1 (u1_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u1_ep01.tex: A Skills 1–5,
 * B Applying 1–7, C Stretch 1–4). Every part is a generator: the same kind of amount (a 9 that carries, a double-rounding
 * trap, a cash total ending in 1–9 cents, a share that is a cent off) as the booklet item, new numbers (the booklet's own
 * numbers are among the possible values; the lesson's worked-example numbers are left out). Calculator allowed.
 * All money is worked exactly, in whole cents or on digit strings (no floating-point rounding).
 * Money answers: "$12.49", "12.49" and "12.490" are accepted; an unrounded or too-short answer (12.488 or 12.5 for
 * 12.49) gets a nudge that uses no try; rounding the wrong way, rounding in two steps (17.2849 → 17.285 → 17.29) and a
 * 9 that doesn't carry ($6.97 → "$6.10") are wrong with their own hint; a comma for the decimal point is a nudge.
 * Conversions: rounding tables → one part per row (three boxes); "is it reasonable? if not, correct it" → multiple choice
 * (reasonable, or the correct answer); "write one calculation" → multiple choice of calculations; "what went wrong /
 * explain" → multiple choice of reasons; "list the coins" → the change plus one box per coin (fewest coins);
 * estimates → a whole number of dollars in a range around the booklet's estimate; calculator keys → multiple choice of
 * key sequences. Outcome REV (refresher: never counts toward a level).
 * Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= exact money and decimal strings ================= */
  function cs(c) { var n = c < 0; c = Math.abs(Math.round(c)); return (n ? '-' : '') + Math.floor(c / 100) + '.' + ('0' + c % 100).slice(-2); }
  function M(c) { return '$' + cs(c); }              // plain text, e.g. $12.49
  function MT(c) { return '\\$' + cs(c); }           // LaTeX
  function D(d) { return '$' + d; }                  // whole dollars, plain
  function DT(d) { return '\\$' + d; }               // whole dollars, LaTeX
  /* num/den (whole numbers) as a decimal string truncated to k places */
  function divStr(num, den, k) {
    var ip = Math.floor(num / den), rem = num % den, s = String(ip) + (k ? '.' : '');
    for (var i = 0; i < k; i++) { rem *= 10; s += Math.floor(rem / den); rem %= den; }
    return s;
  }
  function fracDigits(s) { return ((String(s).split('.')[1] || '') + '00000000000000000000'); }
  /* value × 10^k as an integer: rounded half up (rInt) or chopped (tInt). s is a non-negative decimal string */
  function tInt(s, k) { var ip = String(s).split('.')[0] || '0'; return Number(ip + fracDigits(s).slice(0, k)); }
  function rInt(s, k) { return tInt(s, k) + (Number(fracDigits(s).charAt(k)) >= 5 ? 1 : 0); }
  function intStr(v, k) { if (!k) return String(v); var s = String(v); while (s.length <= k) s = '0' + s; return s.slice(0, -k) + '.' + s.slice(-k); }
  function rStr(s, k) { return intStr(rInt(s, k), k); }
  function mStr(s, k) { return k === 1 ? rStr(s, 1) + '0' : rStr(s, k); } // money: ten cents written with two decimals ($7.40)
  function trimZ(s) { return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); }
  /* what the TI-30XIIS shows for num ÷ den: 10 digits (a leading 0 counts), last digit rounded, no trailing zeros */
  function calcShow(num, den) { var ip = String(Math.floor(num / den)), k = Math.max(0, 10 - ip.length); return trimZ(rStr(divStr(num, den, k + 2), k)); }
  function digitAt(s, k) { return Number(fracDigits(s).charAt(k)); } // k = 0 tenths, 1 hundredths, …
  function near(v, x) { return Math.abs(v - x) < 0.00501; }        // a wrong value the student may have rounded to the cent

  /* a calculator display and a calculator key */
  function lcd(s) { return '<span style="font-family:\'Courier New\',Courier,monospace;font-weight:700;letter-spacing:.02em;background:#e3e9d6;color:#1d2a12;border:1px solid #aab394;border-radius:4px;padding:1px 6px;white-space:nowrap">' + s + '</span>'; }
  function kc(s) { return '<span style="display:inline-block;min-width:1.5em;text-align:center;padding:0 5px;margin:0 2px;border:1px solid #6b7686;border-bottom-width:3px;border-radius:5px;background:#f4f6f9;color:#1d2633;font-weight:700;font-size:.9em;line-height:1.45;white-space:nowrap">' + s + '</span>'; }
  function keys(list) { return '<span style="white-space:nowrap">' + list.map(function (x) { return /^[\d.]+$/.test(x) ? x : kc(x); }).join(' ') + '</span>'; }
  /* a small table for a prompt (rows of cells; the first row is the header) */
  function tbl(rows, leftCol) {
    return '<table class="vtab">' + rows.map(function (r, i) { return '<tr>' + r.map(function (c, j) { var tag = i === 0 ? 'th' : 'td', st = leftCol && j === 0 ? ' style="text-align:left"' : ''; return '<' + tag + st + '>' + c + '</' + tag + '>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function find(gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function priceC(r, lo, hi, step) { step = step || 1; return lo + step * r.int(0, Math.floor((hi - lo) / step)); } // cents
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function rd(c) { return Math.floor((c + 50) / 100); }   // cents → nearest whole dollar (half up)

  /* ================= checking an amount =================
   * xs: the exact amount as a decimal string; dp: 0 dollar, 1 ten cents, 2 cent, 3 tenth of a cent.
   * o.diag(v, s) -> {code, hint, form?}; o.nr (numerical response: 4 characters); o.place / o.next / o.keep (names when it
   * isn't money, e.g. hours); o.placesHint (message for too few decimals, e.g. "keep all the digits"). */
  var PLACE = ['dollar', 'ten cents', 'cent', 'tenth of a cent'];
  var NEXT = ['tenths (dimes) digit', 'hundredths (cents) digit', 'thousandths digit', 'digit after the thousandths'];
  var KEEP = ['the dollars stay the same', 'the tenths digit stays the same', 'the hundredths digit stays the same', 'the thousandths digit stays the same'];
  function cleanNum(resp) { return String(resp == null ? '' : resp).replace(/\\\$|\$/g, '').replace(/\\[,;: !]|~|\s+/g, '').replace(/^\+/, ''); }
  function roundChk(xs, dp, o) {
    o = o || {};
    var want = rInt(xs, dp), fl = tInt(xs, dp), nd = digitAt(xs, dp), place = o.place || PLACE[dp], next = o.next || NEXT[dp], keep = o.keep || KEEP[dp];
    var twoStep = rInt(rStr(xs, dp + 1), dp);
    return function (resp) {
      var raw = cleanNum(resp);
      if (/^\d*,\d{1,2}$/.test(raw) || /^\d+,\d{4,}$/.test(raw)) return form('u1l1-comma', 'Use a decimal point (.) between the dollars and the cents, not a comma.');
      raw = raw.replace(/,(?=\d{3}(\D|$))/g, '');
      if (/^(\d+(\.\d*)?|\.\d+)(¢|c|cents?)$/i.test(raw)) return form('u1l1-cent-sign', 'Write the amount in <b>dollars</b> with a decimal point, without the ¢ sign.');
      if (!/^\d+(\.\d*)?$|^\.\d+$/.test(raw)) return K.number(Number(intStr(want, dp)), null, { nr: o.nr })(raw);
      var s = (raw.charAt(0) === '.' ? '0' + raw : raw).replace(/\.$/, ''), dec = (s.split('.')[1] || '').replace(/0+$/, '').length, v = Number(s);
      if (o.nr && raw.length > 4) return rInt(s, dp) === want ? form('round', 'Right — now round it to the nearest ' + place + '.') : form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      var si = dec <= dp ? rInt(s, dp) : null;
      if (si === want) return ok();
      if (dec > dp && rInt(s, dp) === want) return form('u1l1-round', 'Right — now round it to the nearest ' + place + '.');
      if (si != null && dec < dp && rInt(xs, dec) * Math.pow(10, dp - dec) === si) return form('u1l1-places', o.placesHint || (dp === 2 ? 'Give the amount to the <b>cent</b>: two decimal places (for example $4.50, not $4.5).' : 'Round to the nearest ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').'));
      var h = o.diag ? o.diag(v, s) : null;
      if (h) return h.form ? form(h.code, h.hint) : wrong(h.code || 'u1l1-diag', h.hint);
      if (si != null && twoStep !== want && si === twoStep) return wrong('u1l1-double-round', 'Round in <b>one</b> step. Look only at the ' + next + ': it is ' + nd + ', so ' + (nd >= 5 ? 'round up' : keep) + '. Don’t round the digits after it first.');
      if (si != null && want === fl + 1 && si === fl) return wrong('u1l1-round-dir', 'Look at the ' + next + ': it is ' + nd + ' (5 or more), so round <b>up</b>.');
      if (si != null && want === fl && si === fl + 1) return wrong('u1l1-round-dir', 'Look at the ' + next + ': it is ' + nd + ' (4 or less), so ' + keep + ' — don’t round up.');
      if (si != null && dp >= 1 && fl % 10 === 9 && want === fl + 1 && si === Math.floor(fl / 10) * 10 + 1) return wrong('u1l1-carry', 'When a 9 rounds up it becomes 10, so you <b>carry</b> 1 to the next place (like $6.97 → $7.00, not $6.10).');
      return wrong('value', null);
    };
  }
  /* a part whose answer is an amount: xs exact decimal string, dp the place to round to */
  function amtPart(prompt, xs, dp, o) {
    o = o || {};
    var money = o.money !== false, key = money ? mStr(xs, dp) : rStr(xs, dp);
    return { prompt: prompt, input: { type: 'number', before: o.nr ? undefined : (money ? '$' : o.before), after: o.after, nr: !!o.nr },
      check: roundChk(xs, dp, o), key: key, answer: money ? t('\\$' + key) : t(key + (o.unitTex ? '\\text{ ' + o.unitTex + '}' : '')),
      solution: o.solution, hints: o.hints || [], text: o.text, bad: (o.bad || []).filter(function (b) { return b !== key; }) };
  }
  /* an exact money amount in cents (no rounding asked) */
  function moneyPart(prompt, c, o) { return amtPart(prompt, cs(c), 2, o); }
  /* an estimate: a whole number of dollars from lo to hi (o.not: values that aren't accepted, o.exact: the exact total in cents) */
  function estChk(lo, hi, o) {
    o = o || {};
    return function (resp) {
      var raw = cleanNum(resp).replace(/,(?=\d{3}(\D|$))/g, '');
      if (!/^\d+(\.\d*)?$|^\.\d+$/.test(raw)) return K.number(lo)(raw);
      var v = Number(raw), vc = Math.round(v * 100);
      if (o.exact != null && vc === o.exact && o.exact % 100 !== 0) return form('u1l1-est-exact', 'That’s the exact amount. An estimate is a whole number of dollars that you can work out in your head.');
      if (vc % 100 !== 0) return form('u1l1-est-whole', 'Give your estimate as a whole number of dollars (no cents).');
      if (v >= lo && v <= hi && (o.not || []).indexOf(v) < 0) return ok();
      var h = o.diag ? o.diag(v) : null;
      if (h) return h.form ? form(h.code, h.hint) : wrong(h.code || 'u1l1-diag', h.hint);
      return wrong('u1l1-est-off', o.offHint || null);
    };
  }
  function estPart(prompt, lo, hi, key, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', before: '$', after: o.after }, check: estChk(lo, hi, o), key: String(key), answer: t(DT(key)) + (lo !== hi ? ' (any estimate from ' + D(lo) + ' to ' + D(hi) + ' is fine)' : ''),
      solution: o.solution, hints: o.hints || [], text: o.text, bad: o.bad || [] };
  }
  /* cash rounding to the nearest 5 cents (Canada has no pennies) */
  function cash(c) { var e = c % 10, b = c - e; return e <= 2 ? b : e <= 7 ? b + 5 : b + 10; }
  function cashWhy(c) { var e = c % 10; return 'The total ends in ' + e + ' cent' + (e === 1 ? '' : 's') + (e <= 2 ? ', so it rounds down to 0' : e <= 4 ? ', so it rounds up to 5' : e <= 7 ? ', so it rounds down to 5' : ', so it rounds up to the next 10') + ': ' + M(cash(c)) + '.'; }
  function cashChk(c) {
    var want = cash(c), base = roundChk(cs(want), 2);
    return function (resp) {
      var r0 = base(resp); if (r0.v !== 'wrong') return r0;
      var v = Number(cleanNum(resp)), vc = Math.round(v * 100), e = c % 10;
      if (vc === c) return wrong('u1l1-cash-none', 'Paying with cash, the total is rounded to the nearest <b>5 cents</b> (there are no pennies).');
      if (vc === Math.round(c / 10) * 10 && vc !== want) return wrong('u1l1-cash-10', 'Round to the nearest <b>5</b> cents, not the nearest 10 cents. ' + (e <= 2 ? 'Endings 1 and 2 round down to 0.' : e <= 4 ? 'Endings 3 and 4 round up to 5.' : e <= 7 ? 'Endings 6 and 7 round down to 5.' : 'Endings 8 and 9 round up to the next 10.'));
      if (Math.abs(vc - want) === 5) return wrong('u1l1-cash-dir', cashWhy(c).replace(/: \$.*$/, '.'));
      return r0;
    };
  }
  function cashPart(prompt, c, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'number', before: '$' }, check: cashChk(c), key: cs(cash(c)), answer: t(MT(cash(c))), solution: o.solution || cashWhy(c), hints: o.hints || ['Cash totals are rounded to the nearest 5 cents: 1, 2 → 0; 3, 4 → 5; 6, 7 → 5; 8, 9 → next 10.'], text: o.text, bad: [cs(c), cs(Math.round(c / 10) * 10)].filter(function (b) { return b !== cs(cash(c)); }) };
  }

  /* one rounding line for a worked solution */
  function roundLine(xs, dp, label) {
    var nd = digitAt(xs, dp), up = nd >= 5, k = mStr(xs, dp);
    return (label ? label + ': ' : '') + 'the ' + NEXT[dp] + ' is ' + nd + (up ? ' (5 or more), so round up' : ' (4 or less), so keep') + ': ' + t('\\$' + k) + '.';
  }
  function centLine(xs) {
    var nd = digitAt(xs, 2), fl = tInt(xs, 2), carry = nd >= 5 && fl % 10 === 9;
    return 'The thousandths digit is ' + nd + (nd >= 5 ? ' (5 or more), so round up' + (carry ? ' — the 9 cents become 10, so carry' : '') : ' (4 or less), so keep the cents digit') + ': ' + t('\\$' + rStr(xs, 2)) + '.';
  }
  var WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var COINS = [{ v: 200, n: 'toonie', p: 'toonies' }, { v: 100, n: 'loonie', p: 'loonies' }, { v: 25, n: 'quarter', p: 'quarters' }, { v: 10, n: 'dime', p: 'dimes' }, { v: 5, n: 'nickel', p: 'nickels' }];
  function coinsOf(c) { return COINS.map(function (k) { var n = Math.floor(c / k.v); c -= n * k.v; return n; }); }
  function plural(n, a, b) { return n + ' ' + (n === 1 ? a : b); }

  HW.addCodes({
    'u1l1-comma': 'Comma instead of a decimal point', 'u1l1-cent-sign': 'Wrote cents instead of dollars', 'u1l1-round': 'Didn’t round', 'u1l1-places': 'Too few decimal places',
    'u1l1-double-round': 'Rounded in two steps', 'u1l1-round-dir': 'Rounded the wrong way', 'u1l1-carry': 'A 9 that rounds up didn’t carry', 'u1l1-place-name': 'Wrong place value',
    'u1l1-digit-value': 'Gave the digit, not its value', 'u1l1-cents-dollars': 'Cents and dollars mixed up', 'u1l1-dec-place': 'Decimal point in the wrong place',
    'u1l1-est-exact': 'Gave the exact amount as the estimate', 'u1l1-est-whole': 'Estimate not a whole number of dollars', 'u1l1-est-off': 'Estimate too far off', 'u1l1-dollars-only': 'Left out the cents',
    'u1l1-chop': 'Dropped the cents instead of rounding', 'u1l1-half-down': 'Rounded a 5 down', 'u1l1-used-est': 'Used the estimate instead of the exact amount', 'u1l1-ltr': 'Worked left to right (not BEDMAS)',
    'u1l1-no-brackets': 'Ignored the brackets', 'u1l1-one-item': 'Counted one item instead of several', 'u1l1-wrong-op': 'Wrong operation', 'u1l1-div-way': 'Divided the wrong way',
    'u1l1-no-split': 'Didn’t divide the bill', 'u1l1-cash-none': 'Didn’t round the cash total', 'u1l1-cash-10': 'Rounded cash to 10 cents', 'u1l1-cash-dir': 'Rounded the cash total the wrong way',
    'u1l1-cash-change': 'Change from the unrounded total', 'u1l1-coins-sum': 'Coins don’t add up to the change', 'u1l1-coins-fewest': 'Not the fewest coins', 'u1l1-unfair': 'Shares more than a cent apart',
    'u1l1-shares-sum': 'Shares don’t add up to the bill', 'u1l1-round-down-hours': 'Rounded hours down (not enough pay)', 'u1l1-calc-rounded': 'Gave a rounded value, not the display', 'u1l1-change-total': 'Gave the total instead of the change'
  });
  HW.addPartial({
    'u1l1-double-round': 's', 'u1l1-round-dir': 's', 'u1l1-carry': 's', 'u1l1-place-name': 'n', 'u1l1-digit-value': 'b', 'u1l1-cents-dollars': 'b', 'u1l1-dec-place': 'b', 'u1l1-est-off': 'n',
    'u1l1-dollars-only': 'b', 'u1l1-chop': 's', 'u1l1-half-down': 's', 'u1l1-used-est': 'b', 'u1l1-ltr': 'n', 'u1l1-no-brackets': 'n', 'u1l1-one-item': 'b', 'u1l1-wrong-op': 'n', 'u1l1-div-way': 'n',
    'u1l1-no-split': 'b', 'u1l1-cash-none': 's', 'u1l1-cash-10': 's', 'u1l1-cash-dir': 's', 'u1l1-cash-change': 's', 'u1l1-coins-sum': 'b', 'u1l1-unfair': 's', 'u1l1-shares-sum': 'b',
    'u1l1-round-down-hours': 'b', 'u1l1-change-total': 'b'
  });

  /* ================= generators ================= */
  /* place value: the digit in a place, and its value */
  var PV = ['tenths', 'hundredths', 'thousandths'], PVN = ['tenths (dimes)', 'hundredths (cents)', 'thousandths (tenths of a cent)'];
  function digitPart(sh, k) {
    var d = sh.f[k], others = [];
    var p = P.number('Which digit is in the <b>' + PV[k] + '</b> place?', d, function (v) {
      for (var j = 0; j < 3; j++) if (j !== k && v === sh.f[j]) return { code: 'u1l1-place-name', hint: t(String(v)) + ' is in the <b>' + PV[j] + '</b> place. ' + (k === 0 ? 'The tenths digit is the <b>first</b> digit after the decimal point.' : k === 1 ? 'The hundredths digit is the <b>second</b> digit after the decimal point.' : 'The thousandths digit is the <b>third</b> digit after the decimal point.') };
      if (v === sh.T || v === sh.O) return { code: 'u1l1-place-name', hint: 'That digit is to the <b>left</b> of the decimal point: it counts whole dollars. Look to the right of the point.' };
      return null;
    }, 'In ' + sh.amt + ': tenths (dimes) ' + t(sh.f[0]) + ', hundredths (cents) ' + t(sh.f[1]) + ', thousandths ' + t(sh.f[2]) + '.<br>The ' + PV[k] + ' digit is <b>' + d + '</b>.',
    ['After the decimal point the places are tenths, hundredths, thousandths.'], 'digit in the ' + PV[k] + ' of ' + sh.amt, { before: '' });
    p.bad = [0, 1, 2].filter(function (j) { return j !== k; }).map(function (j) { return String(sh.f[j]); });
    return p;
  }
  /* a row of a rounding table: three boxes */
  function rowXs(r, w, a, b, c) { return w + '.' + r.int(a[0], a[1]) + r.int(b[0], b[1]) + r.int(c[0], c[1]); }
  var ROW_EXCLUDE = ['8.274', '15.639', '0.958', '29.996'];
  function roundRow(xs) {
    var labels = ['Nearest dollar', 'Nearest ten cents', 'Nearest cent'], keys = [rStr(xs, 0), mStr(xs, 1), rStr(xs, 2)];
    return P.fields('Round ' + t('\\$' + xs) + '.', labels.map(function (l) { return { name: l, label: l, before: '$' }; }), [roundChk(xs, 0), roundChk(xs, 1), roundChk(xs, 2)], keys,
      t('\\$' + keys[0]) + ' · ' + t('\\$' + keys[1]) + ' · ' + t('\\$' + keys[2]),
      [roundLine(xs, 0, 'Nearest dollar'), roundLine(xs, 1, 'Nearest ten cents'), roundLine(xs, 2, 'Nearest cent')].join('<br>'),
      ['Find the place you round to, then look at the digit just to its <b>right</b>: 5 or more rounds up, 4 or less stays.', 'A 9 that rounds up becomes 10: carry 1 to the next place.'], 'round ' + xs);
  }
  /* a calculator display rounded to the nearest cent */
  function dispPart(xs, shown) {
    return amtPart(lcd(shown || xs), xs, 2, { solution: centLine(xs), hints: ['Look at the thousandths digit (the third digit after the point) and nothing else.'], text: 'round display ' + (shown || xs) + ' to the cent' });
  }
  function dispFrac(r, list) { var f = r.pick(list); return { xs: divStr(f[0], f[1], 12), shown: calcShow(f[0], f[1]) }; }
  /* four prices whose cents are not round */
  var JORDAN = [649, 329, 187, 579, 499];
  function prices(r, ranges) { return ranges.map(function (g) { var c; do { c = priceC(r, g[0], g[1]); } while (c % 100 === 0 || c % 100 === 50 || JORDAN.indexOf(c) >= 0); return c; }); }
  function frontEnd(ps) { var Dd = sum(ps.map(function (c) { return Math.floor(c / 100); })), C = sum(ps.map(function (c) { return c % 100; })); return { D: Dd, C: C, F: Dd + Math.round(C / 100) }; }
  function frontPart(ps, who) {
    var fe = frontEnd(ps), T = sum(ps), lo = fe.F - 1, hi = fe.F + 1;
    var dollarsChk = K.number(fe.D, function (v) { if (near(v, T / 100)) return { code: 'u1l1-dollars-only', hint: 'Add only the <b>dollar</b> parts (the front digits) here.' }; return null; });
    var est = estChk(lo, hi, { not: [fe.D], exact: T, diag: function (v) { if (v === fe.D) return { code: 'u1l1-dollars-only', hint: 'That’s only the dollars. Now group the cents into amounts of about ' + D(1) + ' and add those dollars on.' }; return null; },
      offHint: 'The cents add to about ' + D(Math.round(fe.C / 100)) + '. Add that to the dollars.' });
    var p = P.fields('Find a <b>front-end estimate</b> of the total.', [{ name: 'Dollars', label: 'Add the dollar parts:', before: '$' }, { name: 'Estimate', label: 'Front-end estimate: about', before: '$' }], [dollarsChk, est], [String(fe.D), String(fe.F)],
      'Dollars ' + t(DT(fe.D)) + '; estimate about ' + t(DT(fe.F)),
      'Dollars: ' + t(ps.map(function (c) { return Math.floor(c / 100); }).join('+') + '=\\$' + fe.D) + '.<br>Cents: ' + ps.map(function (c) { return (c % 100) + '¢'; }).join(' + ') + ' = ' + fe.C + '¢, about ' + t(DT(Math.round(fe.C / 100))) + '.<br>Estimate: ' + t(DT(fe.D) + '+' + DT(Math.round(fe.C / 100)) + '=\\$' + fe.F) + '.',
      ['Add the dollar parts first.', 'Then group the cents into amounts of about ' + D(1) + ' (for example 79¢ + 29¢ is about ' + D(1) + ').'], 'front-end ' + ps.join('+'));
    return p;
  }
  function totalPart(ps, o) {
    o = o || {};
    var T = sum(ps), fe = frontEnd(ps);
    return moneyPart(o.prompt || 'Find the exact total.', T, { solution: t(ps.map(cs).join('+') + '=' + MT(T)) + (o.post || ''), hints: ['Add the prices on your calculator. Check it against your estimate.'], text: 'exact total',
      diag: function (v) { if (v === fe.D) return { code: 'u1l1-dollars-only', hint: 'That’s only the dollars. Add the full prices, cents and all.' }; if (Math.abs(v - fe.F) < 1e-9 || Math.abs(v - sum(ps.map(rd))) < 1e-9) return { code: 'u1l1-used-est', hint: 'That’s an estimate. Add the exact prices on your calculator.' }; return null; } });
  }
  /* BEDMAS by hand */
  function bedmas(prompt, val, ltr, noBr, sol, text) {
    var p = P.number(t(prompt), val, function (v) {
      if (ltr != null && v === ltr && ltr !== val) return { code: 'u1l1-ltr', hint: 'BEDMAS: do × and ÷ <b>before</b> + and −. Don’t just work left to right.' };
      if (noBr != null && v === noBr && noBr !== val) return { code: 'u1l1-no-brackets', hint: 'Brackets come first: work out the bracket, then the rest.' };
      return null;
    }, sol, ['Brackets first, then × and ÷, then + and −.'], text, { before: t('=') });
    p.bad = [ltr, noBr].filter(function (x) { return x != null && x !== val; }).map(String);
    return p;
  }
  /* is the calculator answer reasonable? (mills: thousandths of a dollar) */
  function millStr(m) { return m % 10 === 0 ? cs(m / 10) : intStr(m, 3); }
  function reasonPart(r, row) {
    var ex = row.exact * 10, dm = row.wrongDisp ? row.disp : ex, shown = trimZ(millStr(dm)), estT = row.estTex;
    var cands = [ex, ex * 10, ex % 100 === 0 ? ex / 10 : null, ex * 100].filter(function (v, i, a) { return v != null && v !== dm && a.indexOf(v) === i; });
    var others = cands.filter(function (v) { return v !== ex; }).slice(0, 2), list = row.wrongDisp ? [ex].concat(others.slice(0, 2)) : others.slice(0, 2);
    var opts = [{ html: 'Reasonable — it is close to my estimate.', right: !row.wrongDisp, code: 'said-ok', why: row.wrongDisp ? 'Estimate: ' + t(estT) + '. The calculator shows ' + lcd(shown) + ', which is not close to that.' : null }];
    list.forEach(function (v) { opts.push({ html: 'Not reasonable — it should be ' + t('\\$' + millStr(v)) + '.', right: row.wrongDisp && v === ex, code: v === ex ? 'said-fix' : 'said-x' + (v > ex ? 'big' : 'small'), why: row.wrongDisp && v === ex ? null : 'Estimate: ' + t(estT) + '. ' + (row.wrongDisp ? t('\\$' + millStr(v)) + ' isn’t close to that either.' : 'The calculator answer is close to that.') }); });
    var sol = 'Estimate: ' + t(estT) + '.<br>' + (row.wrongDisp ? 'The calculator shows ' + lcd(shown) + ', which is about ' + (dm > ex ? '10 times too big' : '10 times too small') + ' — <b>not reasonable</b>. ' + (row.why || '') + '<br>Correct: ' + t(row.calcTex + '=\\$' + millStr(ex)) + '.' : 'The calculator shows ' + lcd(shown) + ', close to the estimate — <b>reasonable</b>.');
    var p = P.mc(r, t(row.calcTex) + ' — the calculator shows ' + lcd(shown) + '.', opts, sol, ['Estimate first with easy numbers. Is the calculator answer close?'], 'reasonable ' + row.calcTex, true);
    return p;
  }

  HW.defineLesson({
    id: 'u1l1', unit: 1, num: '1', title: 'Money Sense: Rounding, Estimating and Using Your Calculator', outcome: 'REV',
    blurb: 'Reading and rounding money, estimating a bill, BEDMAS on the calculator, and making change.',
    questions: [
      { num: '1', stem: function (sh) { return 'Use the amount <b>' + sh.amt + '</b>.'; },
        shared: function (r) {
          var sh = find(function () { var d = r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 5); return { T: d[0], O: d[1], f: [d[2], d[3], d[4]] }; }, function (s) { var a = s.T + '' + s.O + '.' + s.f.join(''); return s.T > 0 && s.f[0] > 0 && a !== '23.586'; }, { T: 3, O: 1, f: [8, 5, 7] });
          sh.amt = '$' + sh.T + sh.O + '.' + sh.f.join(''); return sh;
        },
        parts: [
          { id: '1a', level: 'LIM', make: function (r, sh) { return digitPart(sh, 0); } },
          { id: '1b', level: 'LIM', make: function (r, sh) { return digitPart(sh, 1); } },
          { id: '1c', level: 'LIM', make: function (r, sh) { return digitPart(sh, 2); } },
          { id: '1d', level: 'BEG', make: function (r, sh) {
            var a = sh.f[0], xs = '0.' + a;
            return amtPart('What is the value of the ' + a + '? Write it in dollars.', xs, 2, { text: 'value of the tenths digit',
              solution: 'The ' + a + ' is in the tenths place (dimes): ' + a + ' tenths of a dollar = ' + t('\\$0.' + a + '0') + ' = ' + a + '0 cents.',
              hints: ['Which place is the ' + a + ' in? Each tenth of a dollar is a dime, ' + t('\\$0.10') + '.'],
              diag: function (v) {
                if (v === a) return { code: 'u1l1-digit-value', hint: 'That’s the digit. Its <b>value</b> depends on its place: the ' + a + ' is in the tenths place, so it is worth ' + a + ' dimes.' };
                if (near(v, a / 100)) return { code: 'u1l1-place-name', hint: 'That would be ' + a + ' <b>cents</b> (hundredths). The ' + a + ' is in the tenths place: ' + a + ' dimes.' };
                if (v === a * 10) return { form: true, code: 'u1l1-cents-dollars', hint: 'Yes, that many <b>cents</b> — now write it in dollars, with a decimal point.' };
                return null;
              }, bad: [String(a), cs(a)] });
          } }] },
      { num: '2', stem: 'Write each amount in dollars.', parts: [
        { id: '2a', level: 'LIM', make: function (r) {
          var v = find(function () { return [r.int(2, 19), r.int(1, 9)]; }, function (v) { return !(v[0] === 6 && v[1] === 4); }, [9, 6]), d = v[0], c = v[1];
          return moneyPart(WORDS[d] + ' dollars and ' + WORDS[c] + ' cent' + (c === 1 ? '' : 's'), d * 100 + c, { text: 'words to dollars',
            solution: WORDS[c] + ' cent' + (c === 1 ? '' : 's') + ' = ' + t('\\$0.0' + c) + ', so the amount is ' + t(MT(d * 100 + c)) + '.',
            hints: ['Cents take <b>two</b> places after the decimal point.'],
            diag: function (x) { if (near(x, d + c / 10)) return { code: 'u1l1-cents-dollars', hint: WORDS[c][0].toUpperCase() + WORDS[c].slice(1) + ' cent' + (c === 1 ? ' is' : 's are') + ' ' + c + ' hundredth' + (c === 1 ? '' : 's') + ' of a dollar, so ' + (c === 1 ? 'it goes' : 'they go') + ' in the <b>second</b> place after the point. (' + t('\\$' + d + '.' + c + '0') + ' would be ' + c + '0 cents.)' }; if (x === d * 100 + c) return { form: true, code: 'u1l1-cents-dollars', hint: 'Write it in dollars, with a decimal point between the dollars and the cents.' }; return null; },
            bad: [d + '.' + c] });
        } },
        { id: '2b', level: 'LIM', make: function (r) {
          var c = r.int(1, 9) * 10;
          return moneyPart(c + '¢', c, { text: 'cents to dollars', solution: 'Divide by ' + t('100') + ' (move the point 2 places left): ' + c + '¢ = ' + t(MT(c)) + '.', hints: ['To change cents to dollars, divide by 100.'],
            diag: function (x) { if (x === c) return { code: 'u1l1-cents-dollars', hint: t('\\$' + c) + ' would be ' + c + ' <b>dollars</b>. To change cents to dollars, divide by 100.' }; if (near(x, c / 1000) || x === c / 10) return { code: 'u1l1-dec-place', hint: 'Move the decimal point <b>2</b> places left (divide by 100).' }; return null; },
            bad: [String(c), String(c / 10)] });
        } },
        { id: '2c', level: 'LIM', make: function (r) {
          var c = r.int(1, 9);
          return moneyPart(c + '¢', c, { text: 'cents to dollars (one digit)', solution: c + ' cents is ' + c + ' hundredths of a dollar: ' + c + '¢ = ' + t('\\$0.0' + c) + '.', hints: ['Cents are hundredths: they take two places after the point.'],
            diag: function (x) { if (near(x, c / 10)) return { code: 'u1l1-dec-place', hint: t('\\$0.' + c + '0') + ' is ' + c + ' dimes (' + c + '0 cents). ' + c + ' cents is ' + t('\\$0.0' + c) + '.' }; if (x === c) return { code: 'u1l1-cents-dollars', hint: t('\\$' + c) + ' would be ' + c + ' dollars. Divide by 100.' }; return null; },
            bad: ['0.' + c, String(c)] });
        } },
        { id: '2d', level: 'BEG', make: function (r) {
          var g = find(function () { return r.int(118, 169) * 10 + r.pick([9, 9, 9, 4, 5, 7]); }, function (g) { return g !== 1399 && g !== 1499; }, 1529), xs = intStr(g, 3);
          var p = amtPart('gas at ' + intStr(g, 1) + '¢ per litre', xs, 3, { after: 'per litre', text: 'gas price to dollars', placesHint: 'Keep all the digits: gas prices go to the <b>tenth of a cent</b> (3 decimal places).',
            solution: 'Divide by ' + t('100') + ' (move the point 2 places left): ' + intStr(g, 1) + '¢ = ' + t('\\$' + xs) + ' per litre.', hints: ['Cents to dollars: divide by 100. Keep all the digits.'],
            diag: function (x) { if (near(x, g / 10)) return { code: 'u1l1-cents-dollars', hint: 'That’s still in cents. Divide by 100 to change it to dollars.' }; if (Math.abs(x - g / 100) < 1e-9) return { code: 'u1l1-dec-place', hint: 'Move the decimal point <b>2</b> places left, not 1.' }; return null; },
            bad: [intStr(g, 1), intStr(g, 2)] });
          return p;
        } },
        { id: '2e', level: 'BEG', make: function (r) {
          var w = r.int(1, 9), d = r.int(2, 9);
          var items = [{ id: 'a', html: '$' + w + '.0' + d, v: w * 100 + d }, { id: 'b', html: '$' + w + '.1' + d, v: w * 100 + 10 + d }, { id: 'c', html: '$' + w + '.' + d, v: w * 100 + 10 * d }, { id: 'd', html: '$' + w + '.' + d + '1', v: w * 100 + 10 * d + 1 }];
          return P.order(r, 'Put these prices in order from least to greatest.', items, { why: function () { return 'Write them all with two decimals first (' + t('\\$' + w + '.' + d + '=\\$' + w + '.' + d + '0') + '). Then compare the dimes digit, then the cents digit.'; } },
            'As two decimals: ' + items.map(function (x) { return t(MT(x.v)); }).join(', ') + '.<br>Order: ' + items.map(function (x) { return x.html; }).join(', ') + '.',
            ['Give every price two decimal places, then compare.'], 'order prices');
        } }] },
      { num: '3', stem: 'Round each amount to the nearest dollar, the nearest ten cents and the nearest cent.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return roundRow(find(function () { return rowXs(r, r.int(2, 9), [0, 4], [5, 8], [1, 4]); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '7.384')); } },
        { id: '3b', level: 'BEG', make: function (r) { return roundRow(find(function () { return rowXs(r, r.int(10, 19), [5, 8], [5, 8], [5, 9]); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '12.659')); } },
        { id: '3c', level: 'BEG', make: function (r) { return roundRow(find(function () { return rowXs(r, 0, [5, 8], [0, 4], [5, 9]); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '0.847')); } },
        { id: '3d', level: 'EMG', make: function (r) { return roundRow(find(function () { return (r.int(1, 8) * 10 + 9) + '.99' + r.int(5, 9); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '49.995')); } }] },
      { num: '4', stem: 'A calculator shows each answer below. Round it to the nearest cent and write it as money.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return dispPart(r.int(10, 99) + '.' + r.int(0, 9) + r.int(0, 8) + r.int(5, 9) + r.int(1, 9)); } },
        { id: '4b', level: 'BEG', make: function (r) { return dispPart(r.int(10, 99) + '.' + r.int(0, 9) + r.int(0, 8) + '4' + r.int(5, 9)); } },
        { id: '4c', level: 'EMG', make: function (r) { return dispPart(r.pick([r.int(100, 199), r.int(10, 99)]) + '.99' + r.int(5, 9)); } },
        { id: '4d', level: 'BEG', make: function (r) { var f = dispFrac(r, [[2, 3], [1, 3], [5, 6], [1, 6], [4, 9], [5, 9], [7, 9], [2, 9], [8, 9], [7, 12], [11, 12], [5, 12], [1, 12], [2, 7], [3, 7], [5, 7], [6, 7]]); return dispPart(f.xs, f.shown); } }] },
      { num: '5', stem: function (sh) { return 'Malik buys school supplies for ' + sh.ps.map(M).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; },
        shared: function (r) {
          return find(function () { var ps = prices(r, [[150, 495], [105, 295], [405, 795], [205, 395]]), T = sum(ps), enough = r.chance(0.6); var H = enough ? Math.ceil((T + 30) / 100) : Math.floor((T - 30) / 100); return { ps: ps, T: T, H: H, enough: enough }; },
            function (s) { var fe = frontEnd(s.ps); return fe.C >= 130 && (s.enough ? s.H * 100 > s.T : s.H * 100 < s.T && s.H > fe.D); }, { ps: [379, 129, 649, 285], T: 1442, H: 15, enough: true });
        },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) { return frontPart(sh.ps); } },
          { id: '5b', level: 'BEG', make: function (r, sh) { return totalPart(sh.ps); } },
          { id: '5c', level: 'BEG', make: function (r, sh) {
            var fe = frontEnd(sh.ps), T = sh.T, H = sh.H;
            var p = P.mc(r, 'Malik has ' + D(H) + '. Is that enough?', [
              { html: 'Yes — ' + M(T) + ' is less than ' + M(H * 100) + '.', right: sh.enough, code: 'said-yes', why: sh.enough ? null : 'Compare the exact total ' + M(T) + ' with ' + M(H * 100) + ': which is bigger?' },
              { html: 'No — ' + M(T) + ' is more than ' + M(H * 100) + '.', right: !sh.enough, code: 'said-no', why: sh.enough ? 'Compare the exact total ' + M(T) + ' with ' + M(H * 100) + ': which is bigger?' : null },
              { html: 'Yes — the dollar parts add to only ' + D(fe.D) + '.', right: false, code: 'u1l1-dollars-only', why: 'The dollar parts leave out all the cents. Compare the exact total with ' + M(H * 100) + '.' }],
              'The exact total is ' + M(T) + '. ' + (sh.enough ? M(T) + ' is less than ' + M(H * 100) + ', so <b>yes</b>, Malik has enough.' : M(T) + ' is more than ' + M(H * 100) + ', so <b>no</b>, Malik does not have enough.'), ['Compare the exact total from (b) with the money he has.'], 'enough money?', true);
            return p;
          } }] },
      { num: '6', stem: function (sh) { return 'Ali is making spaghetti for his family.' + tbl([['Item', 'Price']].concat(sh.items.map(function (x, i) { return [x, M(sh.ps[i])]; })), true); },
        shared: function (r) {
          var items = ['Spaghetti', 'Pasta sauce', 'Ground beef', 'Lettuce', 'Parmesan cheese', 'Garlic bread'];
          return find(function () {
            var ps = [[149, 349], [249, 499], [649, 1199], [149, 399], [399, 799], [250, 450]].map(function (g, i) { var c; do { c = priceC(r, g[0], g[1]); } while (c % 100 === 0 || c % 100 === 50); return c; });
            var k = r.int(0, 5); ps[k] = r.int(2, 6) * 100 + 50; // one price ends in 50¢: it rounds up
            var T = sum(ps), H = Math.ceil((T + 100) / 500) * 5;
            return { items: items, ps: ps, T: T, H: H, k: k };
          }, function (s) { return s.T % 5 === 0 && s.H * 100 - s.T <= 900; }, { items: items, ps: [229, 379, 864, 249, 619, 350], T: 2690, H: 30, k: 5 });
        },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) {
            var E = sum(sh.ps.map(rd)), chop = sum(sh.ps.map(function (c) { return Math.floor(c / 100); })), half = sh.ps[sh.k];
            return estPart('Round each price to the nearest dollar and estimate the total.', E, E, E, { exact: sh.T, text: 'rounding estimate',
              solution: t(sh.ps.map(function (c) { return DT(rd(c)); }).join('+') + '=\\$' + E) + '<br>(' + M(half) + ' rounds up to ' + D(rd(half)) + ', because the dimes digit is 5.)',
              hints: ['Round each price first, then add.', 'A dimes digit of 5 or more rounds up.'],
              diag: function (v) { if (v === chop) return { code: 'u1l1-chop', hint: 'Round each price, don’t just drop the cents: ' + M(sh.ps[2]) + ' rounds to ' + D(rd(sh.ps[2])) + '.' }; if (v === E - 1) return { code: 'u1l1-half-down', hint: M(half) + ' rounds <b>up</b> to ' + D(rd(half)) + ': the dimes digit is 5.' }; return null; },
              bad: [String(chop), String(E - 1)] });
          } },
          { id: '6b', level: 'BEG', make: function (r, sh) { return totalPart(sh.ps); } },
          { id: '6c', level: 'BEG', make: function (r, sh) {
            var E = sum(sh.ps.map(rd)), ch = sh.H * 100 - sh.T;
            return moneyPart('Ali pays with ' + D(sh.H) + ' in cash. How much change does he get?', ch, { text: 'change',
              solution: t(MT(sh.H * 100) + '-' + MT(sh.T) + '=' + MT(ch)), hints: ['Change = amount paid − exact total.'],
              diag: function (v) { if (near(v, sh.H - E)) return { code: 'u1l1-used-est', hint: 'That uses the estimate. Subtract the <b>exact</b> total from ' + M(sh.H * 100) + '.' }; if (near(v, sh.T / 100)) return { code: 'u1l1-change-total', hint: 'That’s the total. The change is ' + M(sh.H * 100) + ' minus the total.' }; return null; },
              bad: [cs(sh.H * 100 - E * 100)] });
          } }] },
      { num: '7', stem: 'For each calculation, estimate the answer. Then decide if the calculator answer is reasonable. If it is not, choose the correct answer.', parts: [
        { id: '7a', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(3, 9), priceC(r, 105, 495, 5)]; }, function (v) { return v[1] % 100 !== 0 && v[1] % 100 !== 50 && !(v[0] === 5 && v[1] === 389); }, [6, 215]), n = v[0], p = v[1], ex = n * p;
          var wd = r.chance(0.6);
          return reasonPart(r, { exact: ex, wrongDisp: wd, disp: ex * 100, calcTex: n + '\\times\\$' + cs(p), estTex: n + '\\times ' + rd(p) + '=\\$' + n * rd(p), why: 'The decimal point was probably left out of ' + t(cs(p)) + '.' });
        } },
        { id: '7b', level: 'BEG', make: function (r) {
          var n = r.int(3, 6), q = priceC(r, 805, 2495, 5), X = n * q, wd = r.chance(0.4);
          return reasonPart(r, { exact: q, wrongDisp: wd, disp: q * 100, calcTex: '\\$' + cs(X) + '\\div ' + n, estTex: (Math.round(X / 100 / n) * n) + '\\div ' + n + '=\\$' + Math.round(X / 100 / n), why: 'Check what was typed.' });
        } },
        { id: '7c', level: 'BEG', make: function (r) {
          var ps = [priceC(r, 1505, 2495, 5), priceC(r, 1805, 2995, 5), priceC(r, 505, 1295, 5)].map(function (c) { return c % 100 === 0 ? c + 15 : c; }), ex = sum(ps), wd = r.chance(0.4);
          return reasonPart(r, { exact: ex, wrongDisp: wd, disp: (ex + 9 * ps[2]) * 10, calcTex: ps.map(MT).join('+'), estTex: ps.map(rd).join('+') + '=\\$' + sum(ps.map(rd)), why: 'It looks like ' + t(cs(ps[2])) + ' was typed as ' + t(String(ps[2] / 10)) + '.' });
        } },
        { id: '7d', level: 'BEG', make: function (r) {
          var n = r.int(3, 6), p = priceC(r, 2005, 4995, 5), ex = n * p, wd = r.chance(0.6), p10 = Math.round(p / 1000) * 10;
          return reasonPart(r, { exact: ex, wrongDisp: wd, disp: ex, calcTex: n + '\\times\\$' + cs(p), estTex: n + '\\times ' + p10 + '=\\$' + n * p10, why: 'The price was probably typed as ' + t(intStr(p, 3)) + '.' });
        } }] },
      { num: '8', stem: 'Work out each by hand, using BEDMAS.', shared: function (r) {
          var v1 = find(function () { return [r.int(2, 9), r.int(2, 9), r.int(2, 6)]; }, function (v) { return !(v[0] === 4 && v[1] === 6 && v[2] === 2); }, [5, 3, 4]);
          var v2 = find(function () { var f = r.int(2, 6), e = f * r.int(2, 5), d = e + f * r.int(1, 4); return [d, e, f]; }, function (v) { return v[0] - v[1] / v[2] !== (v[0] - v[1]) / v[2]; }, [20, 12, 4]);
          return { a: v1[0], b: v1[1], c: v1[2], d: v2[0], e: v2[1], f: v2[2] };
        }, parts: [
        { id: '8a', level: 'LIM', make: function (r, s) { return bedmas(s.a + '+' + s.b + '\\times ' + s.c, s.a + s.b * s.c, (s.a + s.b) * s.c, null, 'Multiply first: ' + t(s.a + '+' + s.b * s.c + '=' + (s.a + s.b * s.c)), 'a+b×c'); } },
        { id: '8b', level: 'LIM', make: function (r, s) { return bedmas('(' + s.a + '+' + s.b + ')\\times ' + s.c, (s.a + s.b) * s.c, null, s.a + s.b * s.c, 'Brackets first: ' + t((s.a + s.b) + '\\times ' + s.c + '=' + (s.a + s.b) * s.c), '(a+b)×c'); } },
        { id: '8c', level: 'BEG', make: function (r, s) { return bedmas(s.d + '-' + s.e + '\\div ' + s.f, s.d - s.e / s.f, (s.d - s.e) / s.f, null, 'Divide first: ' + t(s.d + '-' + s.e / s.f + '=' + (s.d - s.e / s.f)), 'd-e÷f'); } },
        { id: '8d', level: 'BEG', make: function (r, s) { return bedmas('(' + s.d + '-' + s.e + ')\\div ' + s.f, (s.d - s.e) / s.f, null, s.d - s.e / s.f, 'Brackets first: ' + t((s.d - s.e) + '\\div ' + s.f + '=' + (s.d - s.e) / s.f), '(d-e)÷f'); } }] },
      { num: '9', stem: function (s) { return 'At the movies, Hana buys ' + s.n1 + ' popcorns at ' + M(s.p1) + ' each and ' + s.n2 + ' drinks at ' + M(s.p2) + ' each.'; },
        shared: function (r) {
          var good = function (c) { return c % 100 !== 0 && c % 100 !== 50; };
          return find(function () { return { n1: r.int(2, 4), p1: priceC(r, 625, 995, 5), n2: r.int(2, 5), p2: priceC(r, 325, 695, 5) }; }, function (s) { return good(s.p1) && good(s.p2) && s.n1 !== s.n2; }, { n1: 2, p1: 875, n2: 3, p2: 525 });
        },
        parts: [
          { id: '9a', level: 'BEG', make: function (r, s) {
            var a = cs(s.p1), b = cs(s.p2);
            return P.mc(r, 'Which is one calculation for the total cost?', [
              { html: t(s.n1 + '\\times ' + a + '+' + s.n2 + '\\times ' + b), right: true },
              { html: t('(' + s.n1 + '+' + s.n2 + ')\\times(' + a + '+' + b + ')'), why: 'That would buy ' + (s.n1 + s.n2) + ' popcorns <b>and</b> ' + (s.n1 + s.n2) + ' drinks.', code: 'u1l1-wrong-op' },
              { html: t(s.n1 + '+' + a + '\\times ' + s.n2 + '+' + b), why: 'BEDMAS would multiply ' + t(a + '\\times ' + s.n2) + ' first — that isn’t the cost of anything.', code: 'u1l1-ltr' },
              { html: t('(' + s.n1 + '\\times ' + a + '+' + s.n2 + ')\\times ' + b), why: 'Each price should be multiplied only by how many of <b>that</b> item she buys.', code: 'u1l1-no-brackets' }],
              'Cost of the popcorn + cost of the drinks: ' + t(s.n1 + '\\times ' + a + '+' + s.n2 + '\\times ' + b) + '. (The calculator multiplies before it adds, so no brackets are needed.)', ['(number of popcorns × price) + (number of drinks × price)'], 'one calculation');
          } },
          { id: '9b', level: 'BEG', make: function (r, s) {
            var T = s.n1 * s.p1 + s.n2 * s.p2;
            return moneyPart('Find the total with your calculator.', T, { text: 'movie total',
              solution: t(s.n1 + '\\times ' + cs(s.p1) + '+' + s.n2 + '\\times ' + cs(s.p2) + '=' + cs(s.n1 * s.p1) + '+' + cs(s.n2 * s.p2) + '=' + MT(T)), hints: ['Type the whole line: the calculator multiplies before it adds.'],
              diag: function (v) { if (near(v, (s.n1 + s.n2) * (s.p1 + s.p2) / 100)) return { code: 'u1l1-wrong-op', hint: 'Multiply each price only by how many of that item she buys.' }; if (near(v, (s.n1 * s.p1 + s.p2) / 100) || near(v, (s.p1 + s.n2 * s.p2) / 100)) return { code: 'u1l1-one-item', hint: 'She buys ' + s.n1 + ' popcorns <b>and</b> ' + s.n2 + ' drinks: multiply both prices.' }; if (near(v, ((s.n1 * s.p1 + s.n2) * s.p2) / 10000)) return { code: 'u1l1-ltr', hint: 'Type it as ' + t(s.n1 + '\\times ' + cs(s.p1) + '+' + s.n2 + '\\times ' + cs(s.p2)) + ' — no brackets needed.' }; return null; },
              bad: [cs((s.n1 + s.n2) * (s.p1 + s.p2)), cs(s.n1 * s.p1 + s.p2)] });
          } },
          { id: '9c', level: 'BEG', make: function (r, s) {
            var E = s.n1 * rd(s.p1) + s.n2 * rd(s.p2), T = s.n1 * s.p1 + s.n2 * s.p2;
            return estPart('Check your answer with an estimate: round each price to the nearest dollar. What is the estimate?', E, E, E, { exact: T, text: 'estimate check',
              solution: t(s.n1 + '\\times\\$' + rd(s.p1) + '+' + s.n2 + '\\times\\$' + rd(s.p2) + '=\\$' + s.n1 * rd(s.p1) + '+\\$' + s.n2 * rd(s.p2) + '=\\$' + E) + '. Close to ' + M(T) + ', so the answer is reasonable.',
              hints: ['Round ' + M(s.p1) + ' and ' + M(s.p2) + ' to the nearest dollar, then multiply and add.'],
              diag: function (v) { var ch = s.n1 * Math.floor(s.p1 / 100) + s.n2 * Math.floor(s.p2 / 100); if (v === ch && ch !== E) return { code: 'u1l1-chop', hint: 'Round each price to the nearest dollar, don’t just drop the cents.' }; return null; } });
          } }] },
      { num: '10', stem: function (s) { return WORDS[s.n][0].toUpperCase() + WORDS[s.n].slice(1) + ' friends order a pizza for ' + M(s.a) + ' and wings for ' + M(s.b) + '. They share the cost equally.'; },
        shared: function (r) { return find(function () { return { n: r.pick([3, 4, 4, 5]), a: priceC(r, 2499, 3999), b: priceC(r, 1249, 2299) }; }, function (s) { return (s.a + s.b) % s.n === 0 && s.a % 100 !== 0 && s.b % 100 !== 0 && s.b % s.n !== 0; }, { n: 4, a: 3297, b: 1847 }); },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, s) {
            var T = s.a + s.b, q = T / s.n;
            return moneyPart('Write one calculation with brackets, and find each person’s share.', q, { text: 'share with brackets',
              solution: t('(' + cs(s.a) + '+' + cs(s.b) + ')\\div ' + s.n + '=' + cs(T) + '\\div ' + s.n + '=' + cs(q)) + '<br>Each friend pays ' + M(q) + '.', hints: ['Add the two prices first (in brackets), then divide by the number of friends.'],
              diag: function (v) { if (near(v, s.a / 100 + s.b / 100 / s.n)) return { code: 'u1l1-no-brackets', hint: 'Without brackets the calculator divides only the wings. Put the adding in brackets: ' + t('(' + cs(s.a) + '+' + cs(s.b) + ')\\div ' + s.n) + '.' }; if (near(v, T / 100)) return { code: 'u1l1-no-split', hint: 'That’s the whole bill. Share it: divide by ' + s.n + '.' }; if (near(v, T * s.n / 100)) return { code: 'u1l1-wrong-op', hint: 'To share, <b>divide</b> by ' + s.n + '.' }; return null; },
              bad: [cs(T), rStr(divStr(s.a * s.n + s.b, s.n * 100, 6), 2)] });
          } },
          { id: '10b', level: 'BEG', make: function (r, s) {
            var shown = calcShow(s.a * s.n + s.b, s.n * 100), part = rStr(divStr(s.b, s.n * 100, 6), 4);
            return P.mc(r, 'Jaden types ' + keys([cs(s.a), '+', cs(s.b), '÷', String(s.n), '=']) + ' and gets ' + lcd(shown) + '. What went wrong?', [
              { html: 'The calculator divided only ' + M(s.b) + ' by ' + s.n + ', then added ' + M(s.a) + '. He needs brackets around the adding.', right: true },
              { html: 'Nothing — the calculator added first and then divided, so ' + lcd(shown) + ' is each share.', code: 'said-right', why: 'Each share must be <b>less</b> than the pizza alone (' + M(s.a) + '). The calculator follows BEDMAS: it divides before it adds.' },
              { html: 'He should have multiplied by ' + s.n + ' instead of dividing.', code: 'u1l1-wrong-op', why: 'Sharing means dividing. The problem is the <b>order</b>: BEDMAS divides before it adds.' },
              { html: 'He typed one of the prices wrong.', code: 'said-typo', why: 'The prices are typed correctly. Think about the order the calculator does the operations in.' }],
              'BEDMAS: the calculator divides first, ' + t(cs(s.b) + '\\div ' + s.n + '=' + trimZ(part)) + ', then adds ' + t(cs(s.a)) + ', giving ' + lcd(shown) + ' — almost the whole bill.<br>He needs brackets: ' + keys(['(', cs(s.a), '+', cs(s.b), ')', '÷', String(s.n), '=']) + '.', ['Which operation does the calculator do first?'], 'what went wrong');
          } }] },
      { num: '11', stem: function (s) { return 'Priya works at a grocery store for ' + M(s.w) + ' per hour.'; },
        shared: function (r) { return find(function () { return { w: priceC(r, 1520, 1990, 5), k: r.int(36, 61), T: r.pick([400, 450, 500, 550, 600]) }; }, function (s) { return s.w !== 1625 && s.w % 100 !== 0 && s.k !== 37 && (s.T * 10000) % s.w !== 0; }, { w: 1640, k: 45, T: 500 }); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, s) {
            var h = s.k / 2, xs = divStr(s.w * s.k, 200, 4), pay = rInt(xs, 2), E = rd(s.w) * Math.round(h), lo = Math.min(E, Math.floor(pay / 100 * 0.88)), hi = Math.max(E, Math.ceil(pay / 100 * 1.12));
            var exChk = roundChk(xs, 2, { diag: function (v) { if (near(v, s.w / 100 + h)) return { code: 'u1l1-wrong-op', hint: 'Pay = wage <b>×</b> hours.' }; if (near(v, s.w / 100 * Math.floor(h))) return { code: 'u1l1-one-item', hint: 'Use all ' + h + ' hours, including the half hour.' }; if (near(v, s.w / 100 / h) || near(v, h / (s.w / 100))) return { code: 'u1l1-wrong-op', hint: 'Pay = wage <b>×</b> hours.' }; return null; } });
            var estC = estChk(lo, hi, { exact: pay, offHint: 'Round to easy numbers, like ' + t(DT(rd(s.w)) + '\\times ' + Math.round(h)) + '.' });
            return P.fields('Last week she worked ' + h + ' hours. Estimate her pay, then find her exact pay.', [{ name: 'Estimate', label: 'Estimate: about', before: '$' }, { name: 'Exact pay', label: 'Exact pay:', before: '$' }], [estC, exChk], [String(E), intStr(pay, 2)],
              'Estimate about ' + t(DT(E)) + '; exact ' + t('\\$' + intStr(pay, 2)),
              'Estimate: ' + t(DT(rd(s.w)) + '\\times ' + Math.round(h) + '=\\$' + E) + '.<br>Exact: ' + t(cs(s.w) + '\\times ' + h + '=' + trimZ(xs)) + (trimZ(xs).split('.')[1] && trimZ(xs).split('.')[1].length > 2 ? ', which rounds to ' + t('\\$' + intStr(pay, 2)) : '') + '. Her pay is ' + t('\\$' + intStr(pay, 2)) + '.',
              ['Estimate with easy numbers: round the wage and the hours.', 'Exact pay = wage × hours.'], 'pay estimate + exact');
          } },
          { id: '11b', level: 'EMG', make: function (r, s) {
            var xs = divStr(s.T * 100, s.w, 6);
            return amtPart('How many hours does she need to work to earn ' + D(s.T) + '? Round to the nearest tenth of an hour.', xs, 1, { money: false, after: 'hours', unitTex: 'hours', place: 'tenth of an hour', next: 'hundredths digit', keep: 'the tenths digit stays the same', text: 'hours to earn',
              solution: t(s.T + '\\div ' + cs(s.w) + '=' + xs.slice(0, xs.indexOf('.') + 4) + '\\ldots\\approx ' + rStr(xs, 1)) + ' hours.<br>(Check: ' + t(rStr(xs, 1) + '\\times ' + cs(s.w) + '=\\$' + cs(Math.round(rInt(xs, 1) * s.w / 10))) + '.)',
              hints: ['Hours = money ÷ wage.'],
              diag: function (v) { if (near(v, s.w / 100 / s.T) || Math.abs(v - Math.round(s.w / s.T) / 100) < 0.01) return { code: 'u1l1-div-way', hint: 'Divide the money by the wage: ' + t(s.T + '\\div ' + cs(s.w)) + '.' }; if (Math.abs(v - s.T * s.w / 100) < 0.06) return { code: 'u1l1-wrong-op', hint: 'To find the hours, <b>divide</b> the money by the wage.' }; return null; } });
          } }] },
      { num: '12', stem: function (s) { return 'A ' + s.n + '-pack of pop costs ' + M(s.p) + '.'; },
        shared: function (r) { return find(function () { return { n: r.pick([6, 8, 12, 12, 15, 24]), p: priceC(r, 499, 1499) }; }, function (s) { return !(s.n === 24 && s.p === 599) && s.p % s.n !== 0 && (s.p * 10) % s.n !== 0 && s.p % 100 !== 0 && s.p > s.n * 40; }, { n: 12, p: 849 }); },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, s) {
            var xs = divStr(s.p, s.n * 100, 8);
            return amtPart('What does one can cost, to the nearest cent?', xs, 2, { text: 'unit price to the cent', solution: t(cs(s.p) + '\\div ' + s.n + '=' + trimZ(xs.slice(0, xs.indexOf('.') + 6)) + (trimZ(xs).length > xs.indexOf('.') + 6 ? '\\ldots' : '')) + '. ' + centLine(xs), hints: ['Price ÷ number of cans.'],
              diag: function (v) { if (near(v, s.n * 100 / s.p)) return { code: 'u1l1-div-way', hint: 'Divide the <b>price</b> by the number of cans: ' + t(cs(s.p) + '\\div ' + s.n) + '.' }; if (near(v, s.p * s.n / 100)) return { code: 'u1l1-wrong-op', hint: 'One can costs less than the pack: <b>divide</b>.' }; return null; } });
          } },
          { id: '12b', level: 'EMG', make: function (r, s) {
            var xs = divStr(s.p, s.n * 100, 8);
            return amtPart('What does one can cost, to the nearest <b>tenth of a cent</b>?', xs, 3, { text: 'unit price to the tenth of a cent', solution: t(cs(s.p) + '\\div ' + s.n + '=' + trimZ(xs.slice(0, xs.indexOf('.') + 6))) + '. ' + roundLine(xs, 3, 'The thousandths place') , hints: ['The tenth of a cent is the third place after the point. Look at the fourth digit.'],
              diag: function (v) { if (near(v, s.n * 100 / s.p)) return { code: 'u1l1-div-way', hint: 'Divide the price by the number of cans.' }; return null; } });
          } }] },
      { num: '13', stem: 'Making change.', shared: function (r) {
          var ends = r.shuffle([[1, 2], [3, 4], [6, 7], [8, 9]]).map(function (e) { return r.pick(e); });
          var tot = ends.map(function (e, i) { var c; do { c = (i === 0 ? r.int(10, 19) : r.int(2, 49)) * 100 + r.int(0, 9) * 10 + e; } while (c === 842); return c; });
          return { tot: tot };
        }, parts: [
        { id: '13a', level: 'BEG', make: function (r) {
          var p = find(function () { return priceC(r, 505, 995, 5); }, function (p) { return p % 100 !== 0; }, 735), ch = 1000 - p, want = coinsOf(ch);
          var labels = ['Change', 'Toonies', 'Loonies', 'Quarters', 'Dimes', 'Nickels'];
          var chChk = roundChk(cs(ch), 2, { diag: function (v) { if (near(v, p / 100)) return { code: 'u1l1-change-total', hint: 'That’s the price. Change = ' + M(1000) + ' − ' + M(p) + '.' }; return null; } });
          var check = function (resp) {
            resp = resp || [];
            var r0 = chChk(resp[0] == null ? '' : resp[0]); if (r0.v !== 'correct') return { v: r0.v, code: r0.code, hint: '<b>Change:</b> ' + (r0.hint || 'Check the change again.') };
            var n = [];
            for (var i = 1; i <= 5; i++) { var s = cleanNum(resp[i]); if (s === '') s = '0'; if (!/^\d+$/.test(s)) return form('u1l1-coin-count', '<b>' + labels[i] + ':</b> type how many (a whole number; leave it blank or 0 for none).'); n.push(Number(s)); }
            var tot = sum(n.map(function (x, i) { return x * COINS[i].v; }));
            if (tot !== ch) return wrong('u1l1-coins-sum', 'Your coins add up to ' + M(tot) + ', but the change is ' + M(ch) + '.');
            if (sum(n) > sum(want)) return form('u1l1-coins-fewest', 'Those coins do make ' + M(ch) + ' — but a cashier uses as few coins as possible. Use the biggest coins you can: toonies first, then loonies, quarters, dimes, nickels.');
            return ok();
          };
          var steps = [], at = p;
          for (var i = 4; i >= 0; i--) if (want[i]) { at += want[i] * COINS[i].v; steps.push(t('+') + ' ' + plural(want[i], COINS[i].n, COINS[i].p) + ' ' + t('=' + MT(at))); }
          var coinTxt = [0, 1, 2, 3, 4].filter(function (i) { return want[i]; }).map(function (i) { return plural(want[i], COINS[i].n, COINS[i].p); }).join(', ');
          return { prompt: 'A smoothie costs ' + M(p) + '. You pay with a ' + D(10) + ' bill. Count up to find your change. Which coins do you get (the fewest coins)?',
            input: { type: 'fields', fields: labels.map(function (l, i) { return i === 0 ? { name: l, label: l + ':', before: '$' } : { name: l, label: l + ' (' + (COINS[i - 1].v % 100 ? COINS[i - 1].v + '¢' : '$' + COINS[i - 1].v / 100) + '):' }; }) },
            check: check, key: [cs(ch)].concat(want.map(String)), answer: t(MT(ch)) + ': ' + coinTxt + '.',
            solution: 'Start at ' + t(MT(p)) + ':<br>' + steps.join('<br>') + '<br>Change: ' + t(MT(ch)) + ' (' + coinTxt + '). Check: ' + t('10.00-' + cs(p) + '=' + cs(ch)) + '.',
            hints: ['Count up from the price: small coins to a friendly amount (ending in 00, 25, 50 or 75¢), then to the next dollar, then to ' + D(10) + '.', 'Leave a box blank (or 0) if you get none of that coin.'], text: 'count up change' };
        } },
        { id: '13b', level: 'BEG', make: function (r) {
          var p = find(function () { return priceC(r, 2005, 4495, 5); }, function (p) { return p % 100 !== 0; }, 2680), ch = 5000 - p;
          return moneyPart('A pair of jeans costs ' + M(p) + '. You pay with a ' + D(50) + ' bill. What is your change?', ch, { text: 'change from 50', solution: t('50.00-' + cs(p) + '=' + MT(ch)), hints: ['Change = amount paid − price.'],
            diag: function (v) { if (near(v, p / 100)) return { code: 'u1l1-change-total', hint: 'That’s the price. Change = ' + M(5000) + ' − ' + M(p) + '.' }; if (near(v, (p - 5000) / 100)) return { code: 'u1l1-wrong-op', hint: 'Subtract the price from the money you paid.' }; return null; } });
        } },
        { id: '13c', level: 'BEG', make: function (r, s) {
          var labels = s.tot.map(function (c) { return 'Total ' + M(c) + ':'; });
          return P.fields('Write what you pay for each total if you pay with <b>cash</b>.', labels.map(function (l) { return { name: l.replace(':', ''), label: l, before: '$' }; }), s.tot.map(cashChk), s.tot.map(function (c) { return cs(cash(c)); }),
            s.tot.map(function (c) { return M(c) + ' → ' + M(cash(c)); }).join(' · '), s.tot.map(cashWhy).map(function (x, i) { return M(s.tot[i]) + ': ' + x.charAt(0).toLowerCase() + x.slice(1); }).join('<br>'),
            ['Cash totals are rounded to the nearest 5 cents.', 'Endings 1, 2 → 0; 3, 4 → 5; 6, 7 → 5; 8, 9 → next 10.'], 'cash prices');
        } },
        { id: '13d', level: 'EMG', make: function (r, s) {
          var c = s.tot[0], ch = 2000 - cash(c);
          return moneyPart('For the ' + M(c) + ' total, what is your change from a ' + D(20) + ' bill if you pay cash?', ch, { text: 'cash change',
            solution: 'You pay ' + M(cash(c)) + ' (cash rounding), so the change is ' + t('20.00-' + cs(cash(c)) + '=' + MT(ch)) + '.', hints: ['First round the total for cash, then subtract from ' + D(20) + '.'],
            diag: function (v) { if (near(v, (2000 - c) / 100)) return { code: 'u1l1-cash-change', hint: 'Paying cash, the total is rounded first: you pay ' + M(cash(c)) + '.' }; return null; },
            bad: [cs(2000 - c)] });
        } }] },
      { num: '14', stem: function (s) { return 'Three friends go out for supper. They order a burger for ' + M(s.b) + ', a pasta for ' + M(s.p) + ', a salad for ' + M(s.s) + ' and 3 drinks at ' + M(s.d) + ' each. Together they have ' + D(s.H) + '.'; },
        shared: function (r) {
          return find(function () { var o = { b: priceC(r, 1595, 1995, 5), p: priceC(r, 1650, 2150, 25), s: priceC(r, 1125, 1575, 25), d: priceC(r, 225, 395, 5) }; o.T = o.b + o.p + o.s + 3 * o.d; o.H = Math.floor(o.T / 1000) * 10; return o; },
            function (o) { var gap = o.T - o.H * 100, E = rd(o.b) + rd(o.p) + rd(o.s) + 3 * rd(o.d); return gap >= 30 && gap <= 350 && o.T % 3 !== 0 && E * 100 !== o.T && [o.b, o.p, o.s, o.d].every(function (c) { return c % 100 !== 0; }) && o.b + o.p + o.s + o.d < o.H * 100; },
            { b: 1795, p: 1950, s: 1425, d: 325, T: 6145, H: 60 });
        },
        parts: [
          { id: '14a', level: 'BEG', make: function (r, s) {
            var E = rd(s.b) + rd(s.p) + rd(s.s) + 3 * rd(s.d);
            return estPart('Round each price to the nearest dollar and estimate the bill.', E, E, E, { exact: s.T, text: 'supper estimate',
              solution: t(DT(rd(s.b)) + '+' + DT(rd(s.p)) + '+' + DT(rd(s.s)) + '+3\\times' + DT(rd(s.d)) + '=\\$' + E) + '. ' + (Math.abs(E - s.H) <= 3 ? 'That is very close to ' + D(s.H) + ', so they need the exact total to be sure.' : ''),
              hints: ['Round each price first. There are 3 drinks.'],
              diag: function (v) { if (v === rd(s.b) + rd(s.p) + rd(s.s) + rd(s.d)) return { code: 'u1l1-one-item', hint: 'There are <b>3</b> drinks.' }; return null; } });
          } },
          { id: '14b', level: 'EMG', make: function (r, s) {
            return moneyPart('Find the exact bill.', s.T, { text: 'supper exact bill',
              solution: t(cs(s.b) + '+' + cs(s.p) + '+' + cs(s.s) + '+3\\times ' + cs(s.d) + '=' + cs(s.b + s.p + s.s) + '+' + cs(3 * s.d) + '=' + MT(s.T)), hints: ['One calculation: the calculator multiplies the drinks before it adds.'],
              diag: function (v) { if (near(v, (s.b + s.p + s.s + s.d) / 100)) return { code: 'u1l1-one-item', hint: 'There are <b>3</b> drinks: ' + t('3\\times ' + cs(s.d)) + '.' }; if (near(v, (s.b + s.p + s.s + s.d) * 3 / 100)) return { code: 'u1l1-no-brackets', hint: 'Only the drinks are multiplied by 3.' }; return null; },
              bad: [cs(s.b + s.p + s.s + s.d)] });
          } },
          { id: '14c', level: 'BEG', make: function (r, s) {
            var E = rd(s.b) + rd(s.p) + rd(s.s) + 3 * rd(s.d), short = s.T - s.H * 100, one = s.H * 100 - (s.b + s.p + s.s + s.d);
            var opts = [{ html: 'No — they are ' + M(short) + ' short.', right: true },
              { html: 'Yes — the estimate is close to ' + D(s.H) + ', so it is enough.', code: 'u1l1-used-est', why: 'Close isn’t enough here. Compare the <b>exact</b> bill with ' + D(s.H) + '.' }];
            if (E > s.H && (E - s.H) * 100 !== short) opts.push({ html: 'No — they are ' + M((E - s.H) * 100) + ' short.', code: 'u1l1-used-est', why: 'That uses the estimate. Use the exact bill from (b).' });
            if (one > 0) opts.push({ html: 'Yes — they have ' + M(one) + ' left over.', code: 'u1l1-one-item', why: 'That counts only one drink. There are 3 drinks.' });
            return P.mc(r, 'Do they have enough money?', opts, t(cs(s.T) + '-' + s.H + '.00=' + cs(short)) + ': <b>no</b>, they are ' + M(short) + ' short.', ['Compare the exact bill from (b) with ' + D(s.H) + '.'], 'enough for supper');
          } },
          { id: '14d', level: 'PRG', make: function (r, s) {
            var R = rInt(divStr(s.T, 300, 6), 2), third = s.T - 2 * R;
            var check = function (resp) {
              resp = resp || [];
              var a = cleanNum(resp[0]), b = cleanNum(resp[1]);
              if (!a || !b) return form('empty', 'Fill in both boxes.');
              if (!/^\d+(\.\d*)?$|^\.\d+$/.test(a) || !/^\d+(\.\d*)?$|^\.\d+$/.test(b)) return form('notnumber', 'Type an amount of money in each box, like 20.48.');
              var A = Math.round(Number(a) * 100 * 1000) / 1000, B = Math.round(Number(b) * 100 * 1000) / 1000;
              if (A % 1 || B % 1) return form('u1l1-round', 'Round each share to the nearest cent.');
              if (A === R && B === third) return ok();
              if (2 * A + B !== s.T) return wrong('u1l1-shares-sum', 'Check: ' + t('2\\times ' + cs(A) + '+' + cs(B) + '=' + cs(2 * A + B)) + ', but the bill is ' + M(s.T) + '.' + (A === B ? ' When everyone pays the same rounded share, the total is a cent off.' : ''));
              return wrong('u1l1-unfair', 'That adds up, but it isn’t fair: keep the shares within 1 cent of each other. Start from ' + t(cs(s.T) + '\\div 3') + ' rounded to the nearest cent.');
            };
            return { prompt: 'A parent gives them money to make up the difference. Now they split the bill equally. How much does each friend pay?',
              input: { type: 'fields', fields: [{ name: 'Two friends', label: 'Two friends each pay', before: '$' }, { name: 'Third friend', label: 'The third friend pays', before: '$' }] },
              check: check, key: [cs(R), cs(third)], answer: 'Two pay ' + t(MT(R)) + ' and one pays ' + t(MT(third)),
              solution: t(cs(s.T) + '\\div 3=' + divStr(s.T, 300, 4) + '\\ldots\\approx ' + MT(R)) + '. But ' + t('3\\times ' + cs(R) + '=' + cs(3 * R)) + ', one cent ' + (3 * R > s.T ? 'too much' : 'short') + '.<br>Two friends pay ' + M(R) + ' and one pays ' + M(third) + '. (Check: ' + t(cs(R) + '+' + cs(R) + '+' + cs(third) + '=' + cs(s.T)) + '.)',
              hints: ['Divide the exact bill by 3 and round to the cent.', 'Multiply your share by 3: is it a cent off? Fix it with one friend’s share.'], text: 'split three ways', bad: [[cs(R), cs(R)]] };
          } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var w = r.int(10, 49), a = r.int(1, 8), c = r.int(5, 9), x = w + '.' + a + '4' + c;
          return P.mc(r, t('\\$' + x) + ' rounded to the nearest ten cents is', [
            { html: t('\\$' + w + '.' + a + '0'), right: true },
            { html: t('\\$' + w + '.' + a + '5'), why: 'That is the nearest <b>cent</b>. For ten cents, look at the hundredths digit.', code: 'u1l1-place-name' },
            { html: t('\\$' + w + '.' + (a + 1) + '0'), why: 'Round in one step: look only at the hundredths digit, 4. Don’t round the ' + c + ' first.', code: 'u1l1-double-round' },
            { html: t('\\$' + rInt(x, 0) + '.00'), why: 'That is the nearest <b>dollar</b>.', code: 'u1l1-place-name' }],
            'Ten cents: the tenths digit is ' + a + ' and the digit after it is 4 (4 or less), so keep the ' + a + ': ' + t('\\$' + w + '.' + a + '0') + '.', ['Look at the digit just to the right of the tenths place.'], 'MC round ten cents', true);
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) {
          var a = priceC(r, 2505, 6995, 5), b = priceC(r, 1505, 4995, 5), n = r.pick([2, 3, 3, 4]);
          return P.mc(r, WORDS[n][0].toUpperCase() + WORDS[n].slice(1) + ' people share two bills, ' + M(a) + ' and ' + M(b) + ', equally. Which keys give each person’s share?', [
            { html: keys([cs(a), '+', cs(b), '÷', String(n), '=']), why: 'With no brackets the calculator divides only ' + M(b) + '.', code: 'u1l1-no-brackets' },
            { html: keys(['(', cs(a), '+', cs(b), ')', '÷', String(n), '=']), right: true },
            { html: keys([cs(a), '÷', String(n), '+', cs(b), '=']), why: 'That divides only the first bill.', code: 'u1l1-no-brackets' },
            { html: keys(['(', cs(a), '+', cs(b), ')', '×', String(n), '=']), why: 'To share, <b>divide</b> by ' + n + '.', code: 'u1l1-wrong-op' }],
            'The brackets make the calculator add first, then divide: ' + t('(' + cs(a) + '+' + cs(b) + ')\\div ' + n + '=' + cs(a + b) + '\\div ' + n + '\\approx ' + MT(rInt(divStr(a + b, n * 100, 6), 2))) + '.', ['Add the bills first, then divide.'], 'MC keys share', true);
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          var v = find(function () { var n = r.pick([4, 6, 6, 8]); return { n: n, u: r.int(50, 160) * 10 + r.pick([5, 5, 2, 3, 7, 8]) }; }, function (v) { return (v.n * v.u) % 10 === 0 && v.u % 10 !== 0; }, { n: 6, u: 915 });
          var p = v.n * v.u / 10, xs = divStr(p, v.n * 100, 6);
          var o = amtPart('A ' + v.n + '-pack of yogurt costs ' + M(p) + '. The cost of one yogurt, to the nearest cent, is $________.', xs, 2, { nr: true, text: 'NR yogurt', solution: t(cs(p) + '\\div ' + v.n + '=' + trimZ(xs)) + '. ' + centLine(xs), hints: ['Price ÷ number in the pack, then round to the cent.'],
            diag: function (x) { if (near(x, v.n * 100 / p)) return { code: 'u1l1-div-way', hint: 'Divide the <b>price</b> by the number of yogurts.' }; return null; } });
          return o;
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var v = find(function () { return { n1: r.int(2, 3), p1: priceC(r, 195, 495, 5), n2: r.int(2, 5), p2: priceC(r, 65, 195, 5) }; }, function (v) { var T = v.n1 * v.p1 + v.n2 * v.p2; return T < 1900 && T > 1000 && v.n1 !== v.n2; }, { n1: 2, p1: 345, n2: 4, p2: 115 });
          var T = v.n1 * v.p1 + v.n2 * v.p2, ch = 2000 - T;
          return amtPart('Ava buys ' + v.n1 + ' notebooks at ' + M(v.p1) + ' each and ' + v.n2 + ' pens at ' + M(v.p2) + ' each. She pays with a ' + D(20) + ' bill. Her change, in dollars, is ________.', cs(ch), 2, { nr: true, text: 'NR change',
            solution: 'Total: ' + t(v.n1 + '\\times ' + cs(v.p1) + '+' + v.n2 + '\\times ' + cs(v.p2) + '=' + cs(v.n1 * v.p1) + '+' + cs(v.n2 * v.p2) + '=\\$' + cs(T)) + '.<br>Change: ' + t('20.00-' + cs(T) + '=\\$' + cs(ch)) + '.', hints: ['Find the total first, then subtract it from ' + D(20) + '.'],
            diag: function (x) { if (near(x, T / 100)) return { code: 'u1l1-change-total', hint: 'That’s the total. The question asks for her <b>change</b> from ' + D(20) + '.' }; if (near(x, 20 - (v.p1 + v.p2) / 100)) return { code: 'u1l1-one-item', hint: 'She buys ' + v.n1 + ' notebooks and ' + v.n2 + ' pens.' }; return null; },
            bad: [cs(T)] });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (s) { return 'Name the place of the ' + s.g + ' in each amount, and write its value in dollars.'; }, shared: function (r) { return { g: r.int(2, 9) }; }, parts: [0, 1, 2].map(function (k) {
        return { id: 'e1' + 'abc'.charAt(k), level: 'LIM', make: function (r, s) {
          var g = s.g, other = function () { var d; do { d = r.int(0, 9); } while (d === g); return d; };
          var amt = k === 0 ? r.int(1, 9) + '.' + g + other() : k === 1 ? r.pick(['0', String(r.int(1, 9))]) + '.' + (function () { var d; do { d = r.int(0, 9); } while (d === g); return d; })() + g : r.int(1, 9) + '.' + (function () { var d; do { d = r.int(0, 9); } while (d === g); return d; })() + other() + g;
          if (amt.split('.')[0] === String(g)) amt = (g === 1 ? 2 : 1) + amt.slice(amt.indexOf('.'));
          var vals = ['0.' + g + '0', '0.0' + g, '0.00' + g];
          var opts = [0, 1, 2].map(function (j) { return { html: '<b>' + PVN[j] + '</b>: ' + t('\\$' + vals[j]), right: j === k, code: 'place-' + j, why: j === k ? null : 'The ' + g + ' is the ' + ['first', 'second', 'third'][k] + ' digit after the decimal point.' }; });
          opts.push({ html: '<b>' + PVN[k] + '</b>: ' + t('\\$' + (k === 0 ? '0.0' + g : '0.' + g + '0')), code: 'u1l1-digit-value', why: 'The place is right, but check its value: ' + (k === 0 ? 'one tenth is ' + t('\\$0.10') : k === 1 ? 'one hundredth is ' + t('\\$0.01') : 'one thousandth is ' + t('\\$0.001')) + '.' });
          return P.mc(r, t('\\$' + amt), opts, 'The ' + g + ' is the ' + ['first', 'second', 'third'][k] + ' digit after the point: <b>' + PV[k] + '</b>. Its value is ' + t('\\$' + vals[k]) + '.', ['After the point: tenths, hundredths, thousandths.'], 'place of digit', true);
        } };
      }) },
      { num: '2', stem: 'Round each amount to the nearest dollar, the nearest ten cents and the nearest cent.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { return roundRow(find(function () { return rowXs(r, r.int(2, 9), [5, 8], [0, 4], [5, 9]); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '5.638')); } },
        { id: 'e2b', level: 'BEG', make: function (r) { return roundRow(find(function () { return rowXs(r, r.int(10, 29), [0, 4], [5, 8], [1, 4]); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '19.451')); } },
        { id: 'e2c', level: 'BEG', make: function (r) { return roundRow(find(function () { return rowXs(r, r.int(1, 9), [0, 4], [5, 9], [1, 4]); }, function (x) { return ROW_EXCLUDE.indexOf(x) < 0; }, '2.294')); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return roundRow(r.pick([9, 99, 99, 199]) + '.99' + r.int(5, 9)); } }] },
      { num: '3', stem: 'Work out each by hand, using BEDMAS.', shared: function (r) {
          var v1 = find(function () { return [r.int(10, 30), r.int(2, 5), r.int(2, 5)]; }, function (v) { return v[0] > v[1] * v[2] && v[0] - v[1] > 0; }, [12, 2, 5]);
          var v2 = find(function () { var e = r.pick([2, 4, 5, 8]), f = r.int(1, 6); return [(e + f) * r.int(2, 5), e, f]; }, function (v) { return v[0] % v[1] !== 0 && v[0] !== v[1]; }, [18, 4, 2]);
          return { a: v1[0], b: v1[1], c: v1[2], d: v2[0], e: v2[1], f: v2[2] };
        }, parts: [
        { id: 'e3a', level: 'LIM', make: function (r, s) { return bedmas(s.a + '-' + s.b + '\\times ' + s.c, s.a - s.b * s.c, (s.a - s.b) * s.c, null, 'Multiply first: ' + t(s.a + '-' + s.b * s.c + '=' + (s.a - s.b * s.c)), 'a-b×c'); } },
        { id: 'e3b', level: 'LIM', make: function (r, s) { return bedmas('(' + s.a + '-' + s.b + ')\\times ' + s.c, (s.a - s.b) * s.c, null, s.a - s.b * s.c, 'Brackets first: ' + t((s.a - s.b) + '\\times ' + s.c + '=' + (s.a - s.b) * s.c), '(a-b)×c'); } },
        { id: 'e3c', level: 'BEG', make: function (r, s) { return bedmas(s.d + '\\div(' + s.e + '+' + s.f + ')', s.d / (s.e + s.f), null, s.d / s.e + s.f, 'Brackets first: ' + t(s.d + '\\div ' + (s.e + s.f) + '=' + s.d / (s.e + s.f)), 'd÷(e+f)'); } },
        { id: 'e3d', level: 'BEG', make: function (r, s) { return bedmas(s.d + '\\div ' + s.e + '+' + s.f, s.d / s.e + s.f, s.d / (s.e + s.f), null, 'Divide first: ' + t(s.d / s.e + '+' + s.f + '=' + (s.d / s.e + s.f)), 'd÷e+f'); } }] },
      { num: '4', stem: 'Round each calculator display to the nearest cent and write it as money.', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { return dispPart(r.int(1, 9) + '.' + r.int(0, 9) + r.int(0, 8) + '4' + r.int(5, 9)); } },
        { id: 'e4b', level: 'BEG', make: function (r) { var f = find(function () { var q = r.pick([3, 6, 9]); return [r.int(10 * q, 60 * q), q]; }, function (f) { return f[0] % f[1] !== 0 && !(f[0] === 25 && f[1] === 3) && (f[0] * 100) % f[1] !== 0; }, [47, 3]); return dispPart(divStr(f[0], f[1], 12), calcShow(f[0], f[1])); } },
        { id: 'e4c', level: 'EMG', make: function (r) { return dispPart(r.int(1, 9) + '.' + r.int(0, 9) + r.int(0, 8) + '5'); } },
        { id: 'e4d', level: 'EMG', make: function (r) { return dispPart((r.int(1, 8) * 10 + 9) + '.995' + r.int(1, 9)); } }] },
      { num: '5', stem: 'Find the change.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) { var p = find(function () { return priceC(r, 305, 995, 5); }, function (p) { return p % 100 !== 0; }, 685); return moneyPart('A ' + M(p) + ' sandwich, paid with a ' + D(10) + ' bill', 1000 - p, { solution: t('10.00-' + cs(p) + '=' + MT(1000 - p)), hints: ['Change = amount paid − price.'], text: 'change from 10', diag: function (v) { if (near(v, p / 100)) return { code: 'u1l1-change-total', hint: 'That’s the price. Subtract it from ' + M(1000) + '.' }; return null; } }); } },
        { id: 'e5b', level: 'BEG', make: function (r) { var p = find(function () { return priceC(r, 4005, 8995, 5); }, function (p) { return p % 100 !== 0; }, 6325); return moneyPart('A ' + M(p) + ' grocery order, paid with a ' + D(100) + ' bill', 10000 - p, { solution: t('100.00-' + cs(p) + '=' + MT(10000 - p)), hints: ['Change = amount paid − price. Count up: to the next dollar, then to ' + D(100) + '.'], text: 'change from 100', diag: function (v) { if (near(v, p / 100)) return { code: 'u1l1-change-total', hint: 'That’s the price. Subtract it from ' + M(10000) + '.' }; return null; } }); } }] },
      { num: '6', section: 'B. Applying', stem: function (s) { return 'At the hardware store, Lena buys items for ' + s.ps.map(M).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; },
        shared: function (r) { return { ps: find(function () { return prices(r, [[1005, 1495], [205, 595], [505, 895], [105, 395]]); }, function (ps) { return frontEnd(ps).C >= 120; }, [1289, 435, 769, 219]) }; },
        parts: [
          { id: 'e6a', level: 'BEG', make: function (r, s) { return frontPart(s.ps); } },
          { id: 'e6b', level: 'BEG', make: function (r, s) { return totalPart(s.ps); } }] },
      { num: '7', stem: function (s) { return 'For back-to-school, Owen picks out jeans for ' + M(s.ps[0]) + ', a shirt for ' + M(s.ps[1]) + ', shoes for ' + M(s.ps[2]) + ' and socks for ' + M(s.ps[3]) + '. He has ' + D(s.H) + '.'; },
        shared: function (r) {
          return find(function () { var ps = prices(r, [[2999, 4999], [1249, 2499], [4995, 7995], [599, 1299]]), E = sum(ps.map(rd)), en = r.chance(0.6); return { ps: ps, E: E, en: en, H: en ? Math.ceil((E + 8) / 10) * 10 : Math.floor((E - 6) / 10) * 10 }; },
            function (s) { return s.H > 0 && (s.en ? s.H * 100 > sum(s.ps) : s.H * 100 < sum(s.ps)) && Math.abs(sum(s.ps.map(function (c) { return Math.floor(c / 100); })) - s.H) >= 3; }, { ps: [3999, 1849, 6495, 979], E: 133, en: true, H: 150 });
        },
        parts: [
          { id: 'e7a', level: 'BEG', make: function (r, s) {
            var Dd = sum(s.ps.map(function (c) { return Math.floor(c / 100); }));
            return P.mc(r, 'Use a rounding estimate to decide if he has enough money.', [
              { html: 'Yes — the estimate is about ' + D(s.E) + ', which is less than ' + D(s.H) + '.', right: s.en, code: 'said-yes', why: s.en ? null : 'Round each price to the nearest dollar and add: is it really less than ' + D(s.H) + '?' },
              { html: 'No — the estimate is about ' + D(s.E) + ', which is more than ' + D(s.H) + '.', right: !s.en, code: 'said-no', why: s.en ? 'Round each price to the nearest dollar and add: is it really more than ' + D(s.H) + '?' : null },
              { html: (Dd < s.H ? 'Yes' : 'No') + ' — the dollar parts add to ' + D(Dd) + '.', code: 'u1l1-dollars-only', why: 'The dollar parts leave out the cents. Round each price to the nearest dollar first.' }],
              'Rounding estimate: ' + t(s.ps.map(function (c) { return DT(rd(c)); }).join('+') + '=\\$' + s.E) + '. ' + (s.en ? 'That is less than ' + D(s.H) + ', so <b>yes</b>, he has enough.' : 'That is more than ' + D(s.H) + ', so <b>no</b>, he doesn’t have enough.'),
              ['Round each price to the nearest dollar, add, then compare with ' + D(s.H) + '.'], 'enough? estimate', true);
          } },
          { id: 'e7b', level: 'BEG', make: function (r, s) { return totalPart(s.ps); } }] },
      { num: '8', stem: function (s) { return 'At a café, Rosa orders ' + s.n1 + ' sandwiches at ' + M(s.p1) + ' each, ' + s.n2 + ' cookies at ' + M(s.p2) + ' each and a large juice for ' + M(s.p3) + '.'; },
        shared: function (r) { var g = function (c) { return c % 100 !== 0 && c % 100 !== 50; }; return find(function () { return { n1: r.int(2, 3), p1: priceC(r, 595, 895, 5), n2: r.int(2, 4), p2: priceC(r, 115, 195, 5), p3: priceC(r, 275, 495, 5) }; }, function (s) { return g(s.p1) && g(s.p2) && g(s.p3) && s.n1 !== s.n2; }, { n1: 2, p1: 745, n2: 3, p2: 165, p3: 395 }); },
        parts: [
          { id: 'e8a', level: 'BEG', make: function (r, s) {
            var T = s.n1 * s.p1 + s.n2 * s.p2 + s.p3;
            return moneyPart('Write one calculation for the total, and find it.', T, { text: 'café total', solution: t(s.n1 + '\\times ' + cs(s.p1) + '+' + s.n2 + '\\times ' + cs(s.p2) + '+' + cs(s.p3) + '=' + cs(s.n1 * s.p1) + '+' + cs(s.n2 * s.p2) + '+' + cs(s.p3) + '=' + MT(T)), hints: ['(number × price) for each item, then add. The calculator multiplies before it adds.'],
              diag: function (v) { if (near(v, (s.p1 + s.p2 + s.p3) / 100) || near(v, (s.n1 * s.p1 + s.p2 + s.p3) / 100) || near(v, (s.p1 + s.n2 * s.p2 + s.p3) / 100)) return { code: 'u1l1-one-item', hint: 'Multiply each price by how many she orders: ' + s.n1 + ' sandwiches and ' + s.n2 + ' cookies.' }; return null; } });
          } },
          { id: 'e8b', level: 'BEG', make: function (r, s) {
            var E = s.n1 * rd(s.p1) + s.n2 * rd(s.p2) + rd(s.p3), T = s.n1 * s.p1 + s.n2 * s.p2 + s.p3;
            return estPart('Check your answer with an estimate (round each price to the nearest dollar).', E, E, E, { exact: T, text: 'café estimate', solution: t(s.n1 + '\\times\\$' + rd(s.p1) + '+' + s.n2 + '\\times\\$' + rd(s.p2) + '+\\$' + rd(s.p3) + '=\\$' + E) + '. Close to ' + M(T) + ', so it is reasonable.', hints: ['Round each price to the nearest dollar first.'] });
          } }] },
      { num: '9', stem: function (s) { return 'Zoe babysits for ' + s.h + ' hours at ' + M(s.w) + ' per hour. Her friend’s calculator says she earned ' + M(s.w * s.k / 2 * 10) + '.'; },
        shared: function (r) { var k = r.pick([7, 9, 11, 13]); return { k: k, h: k / 2, w: r.pick([1250, 1350, 1450, 1550, 1650, 1300, 1400, 1500]) }; },
        parts: [
          { id: 'e9a', level: 'BEG', make: function (r, s) {
            var ex = s.w * s.k / 2, shown = ex * 10, E = Math.round(rd(s.w) * s.h);
            return P.mc(r, 'Estimate Zoe’s pay. Is ' + M(shown) + ' reasonable?', [
              { html: 'No — the estimate is about ' + D(E) + ', so ' + M(shown) + ' is about 10 times too big.', right: true },
              { html: 'Yes — it is close to the estimate.', code: 'said-ok', why: 'Estimate: ' + t(DT(rd(s.w)) + '\\times ' + s.h + '\\approx\\$' + E) + '. Is ' + M(shown) + ' close to that?' },
              { html: 'No — ' + M(shown) + ' is about 10 times too small.', code: 'said-small', why: 'Compare with the estimate ' + D(E) + ': is ' + M(shown) + ' bigger or smaller?' }],
              'Estimate: ' + t(DT(rd(s.w)) + '\\times ' + s.h + '\\approx\\$' + E) + '. ' + M(shown) + ' is about 10 times too big: <b>not reasonable</b>.', ['Round the wage to the nearest dollar and multiply by the hours.'], 'Zoe reasonable', true);
          } },
          { id: 'e9b', level: 'BEG', make: function (r, s) {
            var ex = s.w * s.k / 2;
            return moneyPart('Find Zoe’s exact pay.', ex, { text: 'Zoe exact pay', solution: t(cs(s.w) + '\\times ' + s.h + '=' + MT(ex)), hints: ['Pay = wage × hours.'],
              diag: function (v) { if (near(v, ex * 10 / 100)) return { code: 'u1l1-dec-place', hint: 'That’s the friend’s answer — 10 times too big. Check the decimal points as you type.' }; if (near(v, s.w / 100 + s.h)) return { code: 'u1l1-wrong-op', hint: 'Pay = wage <b>×</b> hours.' }; return null; },
              bad: [cs(ex * 10)] });
          } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var v = find(function () { return { L: r.int(350, 650), pm: r.int(1199, 1699) }; }, function (v) { return v.L % 10 !== 0 && !(v.L === 420 && v.pm === 1479); }, { L: 486, pm: 1429 });
          var xs = divStr(v.L * v.pm, 10000, 6), c = rInt(xs, 2), Lr = Math.round(v.L / 100) * 10, pr = Math.round(v.pm / 100) / 10, E = Math.round(Lr * pr), lo = Math.min(E, Math.floor(c / 100 * 0.88)), hi = Math.max(E, Math.ceil(c / 100 * 1.12));
          var exChk = roundChk(xs, 2, { diag: function (x) { if (near(x, v.L / 10 + v.pm / 1000)) return { code: 'u1l1-wrong-op', hint: 'Cost = litres <b>×</b> price per litre.' }; if (near(x, v.L / 10 / (v.pm / 1000))) return { code: 'u1l1-wrong-op', hint: 'Cost = litres <b>×</b> price per litre.' }; return null; } });
          return P.fields('Raj fills his truck with ' + intStr(v.L, 1) + ' L of gas at ' + t('\\$' + intStr(v.pm, 3)) + ' per litre. Estimate the cost, then find the exact cost to the nearest cent.', [{ name: 'Estimate', label: 'Estimate: about', before: '$' }, { name: 'Exact cost', label: 'Exact cost:', before: '$' }],
            [estChk(lo, hi, { exact: c, offHint: 'Use easy numbers: about ' + Lr + ' L at about ' + t('\\$' + pr.toFixed(2)) + '.' }), exChk], [String(E), intStr(c, 2)], 'Estimate about ' + t(DT(E)) + '; exact ' + t('\\$' + intStr(c, 2)),
            'Estimate: ' + t(Lr + '\\times\\$' + pr.toFixed(2) + '\\approx\\$' + E) + '.<br>Exact: ' + t(intStr(v.L, 1) + '\\times ' + intStr(v.pm, 3) + '=' + trimZ(xs)) + '. ' + centLine(xs),
            ['Estimate: round the litres to the nearest 10 and the price to the nearest 10 cents.', 'Exact: litres × price, then round to the cent.'], 'gas estimate + exact');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e11', level: 'BEG', make: function (r) {
          var n = r.int(3, 9), p = r.int(3, 8) * 100 + r.pick([79, 85, 89, 95, 99, 82, 88]), d = Math.floor(p / 100);
          return P.mc(r, 'Tessa buys ' + n + ' bags of dog treats at ' + M(p) + ' each. The best estimate of the total is', [
            { html: D(n * d), code: 'u1l1-chop', why: 'That drops the cents. ' + M(p) + ' is almost ' + D(d + 1) + '.' },
            { html: D(n * (d + 1)), right: true },
            { html: D(n * 10), code: 'u1l1-est-off', why: 'Rounding ' + M(p) + ' to ' + D(10) + ' is too rough. Round to the nearest dollar.' },
            { html: '$' + cs(n * (d + 1) * 10), code: 'u1l1-dec-place', why: 'Check the decimal point: ' + n + ' bags at about ' + D(d + 1) + ' each.' }],
            'Round ' + M(p) + ' to ' + D(d + 1) + ': ' + t(n + '\\times ' + (d + 1) + '=' + n * (d + 1)) + '. (Exact: ' + M(n * p) + '.)', ['Round the price to the nearest dollar.'], 'MC best estimate', true);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'EMG', make: function (r) {
          var n = r.pick([2, 4, 4, 6, 8]), k = r.int(0, 3), u = k * 1000 + 995, p = n * u / 10, xs = divStr(p, n * 100, 6);
          return amtPart('A ' + n + '-pack of AA batteries costs ' + M(p) + '. The cost of one battery, to the nearest cent, is $________.', xs, 2, { nr: true, text: 'NR batteries',
            solution: t(cs(p) + '\\div ' + n + '=' + trimZ(xs)) + '. The thousandths digit is 5, so round up; the 9 cents become 10, so carry: ' + t('\\$' + rStr(xs, 2)) + '.', hints: ['Price ÷ number in the pack, then round to the cent.', 'If a 9 rounds up, carry.'],
            diag: function (x) { if (near(x, n * 100 / p)) return { code: 'u1l1-div-way', hint: 'Divide the <b>price</b> by the number of batteries.' }; return null; } });
        } }] },
      { num: '13', section: 'C. Stretch', stem: function (s) { return 'Your total at the drugstore is ' + M(s.c) + '.'; },
        shared: function (r) { return { c: find(function () { return r.int(15, 38) * 100 + r.int(0, 9) * 10 + r.pick([1, 2, 3, 4, 6, 7, 8, 9]); }, function (c) { return c !== 842; }, 2762) }; },
        parts: [
          { id: 'e13a', level: 'BEG', make: function (r, s) { return cashPart('What do you pay if you use cash?', s.c, { text: 'cash price' }); } },
          { id: 'e13b', level: 'EMG', make: function (r, s) { var ch = 4000 - cash(s.c); return moneyPart('What is your change from two ' + D(20) + ' bills?', ch, { text: 'cash change from 40', solution: 'Cash: you pay ' + M(cash(s.c)) + '. ' + t('40.00-' + cs(cash(s.c)) + '=' + MT(ch)), hints: ['Two $20 bills is ' + D(40) + '. Use the cash price.'], diag: function (v) { if (near(v, (4000 - s.c) / 100)) return { code: 'u1l1-cash-change', hint: 'With cash you pay the rounded total, ' + M(cash(s.c)) + '.' }; if (near(v, (2000 - cash(s.c)) / 100)) return { code: 'u1l1-one-item', hint: 'Two ' + D(20) + ' bills is ' + D(40) + '.' }; return null; }, bad: [cs(4000 - s.c)] }); } },
          { id: 'e13c', level: 'LIM', make: function (r, s) { return moneyPart('What do you pay if you use debit?', s.c, { text: 'debit price', solution: 'Card and debit payments are <b>not</b> rounded: ' + M(s.c) + '.', hints: ['Only cash payments are rounded to the nearest 5 cents.'], diag: function (v) { if (Math.round(v * 100) === cash(s.c)) return { code: 'u1l1-cash-none', hint: 'Only <b>cash</b> is rounded to the nearest 5 cents. Debit pays the exact total.' }; return null; }, bad: [cs(cash(s.c))] }); } }] },
      { num: '14', stem: function (s) { return WORDS[s.n][0].toUpperCase() + WORDS[s.n].slice(1) + ' roommates share a ' + D(s.B) + ' internet bill equally.'; },
        shared: function (r) { return find(function () { return { B: r.pick([100, 100, 50, 80, 125, 200, 70, 140]), n: r.pick([3, 6, 7, 9, 11, 12]) }; }, function (s) { return (s.B * 100) % s.n !== 0 && !(s.B === 25 && s.n === 3); }, { B: 100, n: 6 }); },
        parts: [
          { id: 'e14a', level: 'LIM', make: function (r, s) {
            var shown = calcShow(s.B, s.n), R = rInt(divStr(s.B * 100, s.n, 6), 0);
            return P.mc(r, 'What does the calculator show for ' + t(s.B + '\\div ' + s.n) + '?', [
              { html: lcd(shown), right: true },
              { html: lcd(cs(R)), code: 'u1l1-calc-rounded', why: 'That is rounded to the cent. The calculator shows 10 digits.' },
              { html: lcd(trimZ(divStr(s.B, s.n, 1))), code: 'u1l1-calc-rounded', why: 'The calculator doesn’t stop after one decimal place.' },
              { html: lcd(calcShow(s.n, s.B)), code: 'u1l1-div-way', why: 'That is ' + t(s.n + '\\div ' + s.B) + ': the numbers are the wrong way round.' }],
              t(s.B + '\\div ' + s.n) + ' shows ' + lcd(shown) + ' (the calculator rounds its last digit).', ['Try it on the calculator.'], 'calc display share', false);
          } },
          { id: 'e14b', level: 'BEG', make: function (r, s) {
            var R = rInt(divStr(s.B * 100, s.n, 6), 0), col = s.n * R;
            return moneyPart('If every roommate pays ' + M(R) + ', how much is collected?', col, { text: 'collected', solution: t(s.n + '\\times ' + cs(R) + '=' + MT(col)) + ', ' + Math.abs(col - s.B * 100) + ' cent' + (Math.abs(col - s.B * 100) === 1 ? '' : 's') + ' too ' + (col > s.B * 100 ? 'much' : 'little') + '.', hints: ['Multiply the share by the number of roommates.'],
              diag: function (v) { if (Math.abs(v - s.B) < 1e-9) return { code: 'u1l1-round', hint: 'Multiply it out: ' + t(s.n + '\\times ' + cs(R)) + '. Because the share was rounded, the total isn’t exactly ' + D(s.B) + '.' }; return null; }, bad: [cs(s.B * 100)] });
          } },
          { id: 'e14c', level: 'PRG', make: function (r, s) {
            var R = rInt(divStr(s.B * 100, s.n, 6), 0), diff = s.n * R - s.B * 100, other = diff > 0 ? R - 1 : R + 1, k = Math.abs(diff), a = s.n - k;
            var check = function (resp) {
              resp = resp || [];
              var x = cleanNum(resp[0]), y = cleanNum(resp[1]);
              if (x === '' || y === '') return form('empty', 'Fill in both boxes.');
              if (!/^\d+$/.test(x) || !/^\d+$/.test(y)) return form('notnumber', 'Type how many roommates (whole numbers) in each box.');
              var X = Number(x), Y = Number(y);
              if (X + Y !== s.n) return wrong('u1l1-shares-sum', 'There are ' + s.n + ' roommates, so your two numbers must add to ' + s.n + '.');
              if (X * R + Y * other === s.B * 100) return ok();
              return wrong('u1l1-shares-sum', 'Check: ' + t(X + '\\times ' + cs(R) + '+' + Y + '\\times ' + cs(other) + '=' + cs(X * R + Y * other)) + ', not ' + t(cs(s.B * 100)) + '.');
            };
            return { prompt: 'Show a fair way to collect exactly ' + M(s.B * 100) + ': how many roommates pay ' + M(R) + ' and how many pay ' + M(other) + '?',
              input: { type: 'fields', fields: [{ name: 'Pay ' + M(R), label: 'Number who pay ' + M(R) + ':' }, { name: 'Pay ' + M(other), label: 'Number who pay ' + M(other) + ':' }] },
              check: check, key: [String(a), String(k)], answer: a + ' pay ' + M(R) + ' and ' + k + ' pay' + (k === 1 ? 's' : '') + ' ' + M(other),
              solution: 'Everyone paying ' + M(R) + ' collects ' + M(s.n * R) + ', ' + k + ' cent' + (k === 1 ? '' : 's') + ' too ' + (diff > 0 ? 'much' : 'little') + '. So ' + k + ' roommate' + (k === 1 ? ' pays' : 's pay') + ' ' + M(other) + ' instead:<br>' + t(a + '\\times ' + cs(R) + '+' + k + '\\times ' + cs(other) + '=' + cs(a * R) + '+' + cs(k * other) + '=' + MT(s.B * 100)) + '.',
              hints: ['Use your answer to (b): how many cents too much or too little?', 'Each roommate who pays the other amount fixes 1 cent.'], text: 'fair split', bad: [[String(k), String(a)]].filter(function (b) { return b[0] !== String(a); }) };
          } }] },
      { num: '15', stem: '', parts: [
        { id: 'e15', level: 'EMG', make: function (r) {
          var v = find(function () { return { p: priceC(r, 485, 995, 5), c: priceC(r, 800, 1999) }; }, function (v) { return v.p % 100 !== 0 && v.c % 100 !== 0; }, { p: 585, c: 1260 }), T = 2 * v.p + v.c;
          return moneyPart('A receipt has a total of ' + M(T) + ' for 2 phone chargers at ' + M(v.p) + ' each and one phone case. The price of the case is smudged. Write one calculation for the price of the case, and find it.', v.c, { text: 'smudged case price',
            solution: t(cs(T) + '-2\\times ' + cs(v.p) + '=' + cs(T) + '-' + cs(2 * v.p) + '=' + MT(v.c)) + '.<br>(BEDMAS: the calculator multiplies first, so no brackets are needed.)', hints: ['Take the cost of the 2 chargers away from the total.'],
            diag: function (x) { if (near(x, (T - v.p) / 100)) return { code: 'u1l1-one-item', hint: 'There are <b>2</b> chargers: take away ' + t('2\\times ' + cs(v.p)) + '.' }; if (near(x, (T / 100 - 2) * v.p / 100)) return { code: 'u1l1-ltr', hint: 'That works left to right. BEDMAS: multiply ' + t('2\\times ' + cs(v.p)) + ' first, then subtract.' }; if (near(x, (T + 2 * v.p) / 100)) return { code: 'u1l1-wrong-op', hint: 'Take the chargers <b>away</b> from the total.' }; return null; },
            bad: [cs(T - v.p)] });
        } }] },
      { num: '16', stem: function (s) { return 'Maya earns ' + M(s.w) + ' per hour and is paid only for whole hours. She wants to earn at least ' + D(s.T) + '.'; },
        shared: function (r) { return find(function () { return { w: priceC(r, 1450, 1975, 25), T: r.pick([300, 350, 400, 450, 500]) }; }, function (s) { var q = s.T * 100 / s.w, f = q - Math.floor(q); return s.w !== 1625 && f > 0.02 && f < 0.5; }, { w: 1650, T: 400 }); },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, s) {
            var q = divStr(s.T * 100, s.w, 4), N = Math.floor(s.T * 100 / s.w) + 1;
            var p = P.number('How many hours must she work?', N, function (v) {
              if (v === N - 1) return { code: 'u1l1-round-down-hours', hint: t((N - 1) + '\\times ' + cs(s.w) + '=\\$' + cs((N - 1) * s.w)) + ', which is less than ' + M(s.T * 100) + ' — not enough. Round <b>up</b>.' };
              if (Math.abs(v - s.T * 100 / s.w) < 0.01) return { code: 'u1l1-round', hint: 'She is paid only for <b>whole</b> hours. Give a whole number of hours.' };
              return null;
            }, t(s.T + '\\div ' + cs(s.w) + '=' + q + '\\ldots') + ' hours.<br>' + t(N - 1) + ' hours is not enough (' + t((N - 1) + '\\times ' + cs(s.w) + '=\\$' + cs((N - 1) * s.w)) + '), so round <b>up</b>: she must work <b>' + N + ' hours</b> (' + t(N + '\\times ' + cs(s.w) + '=\\$' + cs(N * s.w)) + ').',
              ['Hours = money ÷ wage.', 'Check your answer: does it earn at least ' + D(s.T) + '?'], 'whole hours', { after: 'hours' });
            p.bad = [String(N - 1)];
            return p;
          } },
          { id: 'e16b', level: 'EMG', make: function (r, s) {
            var N = Math.floor(s.T * 100 / s.w) + 1;
            return P.mc(r, 'Why do you round the way you do?', [
              { html: 'Round <b>up</b>: with ' + (N - 1) + ' hours she earns only ' + M((N - 1) * s.w) + ', which is less than ' + D(s.T) + '.', right: true },
              { html: 'Round <b>down</b>, because the decimal part is less than 0.5.', code: 'u1l1-round-down-hours', why: 'Normal rounding gives ' + (N - 1) + ' hours, but ' + (N - 1) + ' hours earns only ' + M((N - 1) * s.w) + ' — not enough.' },
              { html: 'Round <b>up</b>, because money is always rounded up.', code: 'said-always-up', why: 'Money isn’t always rounded up. Here she needs <b>at least</b> ' + D(s.T) + ', and one hour less is not enough.' },
              { html: 'Round to the nearest tenth of an hour.', code: 'said-tenth', why: 'She is paid only for <b>whole</b> hours.' }],
              'She needs <b>at least</b> ' + D(s.T) + '. ' + (N - 1) + ' hours gives ' + M((N - 1) * s.w) + ' (not enough), so round up to ' + N + ' hours.', ['What happens if she works one hour less?'], 'why round up');
          } }] }
    ]
  });
})(window);
