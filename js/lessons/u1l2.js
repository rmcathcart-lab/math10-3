/* Math 10-3 · Unit 1 · Lesson 2 — Fractions Refresher: Equivalent Fractions and Simplest Form (REV: refresher)
 * Assignment 2 (u1_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u1_ep02.tex: A Skills 1–7,
 * B Applying 8–13, C Stretch 14–16). Every part is a generator: the same kind of fraction (a bar, pie, grid or set of
 * counters; a jump that is not a whole number so you simplify first; a GCF of 12 or 16; a repeating decimal; a pair
 * that is equal; the bigger-numbers trap) as the booklet item, new numbers (the booklet's own numbers are among the
 * possible values; the lesson's worked-example numbers are left out). Calculator allowed.
 * Fractions are typed with the fraction keypad. "Simplest form" answers nudge an unreduced fraction (no try used);
 * "write the fraction shaded" accepts any equal fraction. Typical mistakes get their own hint: adding the same number to
 * the top and bottom, changing only the top or only the bottom, the part not shaded, dividing the wrong way (8 ÷ 3
 * for 3/8), the digits written as a decimal (3/4 → 0.34), a common factor that isn't the greatest, "of" done by
 * dividing only, a fraction of the wrong amount.
 * Conversions: pictures are drawn (SVG); "shade the bar" → how many parts you shade; "write three equivalent fractions"
 * → three fraction boxes (any three different equal fractions); the factor/GCF table → one part per row (two factor
 * lists, the GCF, the simplest form); the fraction/decimal table → one part per column; "<, > or =" → choose the sign;
 * "which is better / explain / does he have enough" → multiple choice whose options are reasons; "order these" → tap
 * in order; "find a fraction between" → any fraction strictly between is accepted. Outcome REV (refresher).
 * Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= numbers ================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function red(p, q) { var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function fT(p, q) { return q === 1 ? String(p) : '\\frac{' + p + '}{' + q + '}'; }
  function dT(p, q) { return q === 1 ? String(p) : '\\dfrac{' + p + '}{' + q + '}'; }
  function F(p, q) { return t(dT(p, q)); }               // shown in a prompt or sentence (full-size, like the booklet)
  function cs(c) { return Math.floor(c / 100) + '.' + ('0' + c % 100).slice(-2); }
  function M(c) { return '$' + cs(c); }
  function find(gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function proper(r, dens) { var q = r.pick(dens), p = r.int(1, q - 1); while (gcd(p, q) > 1) p = r.int(1, q - 1); return [p, q]; }
  function divisors(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* exact decimals (digit strings): num/den truncated to k places; rounding half up */
  function divStr(num, den, k) { var ip = Math.floor(num / den), rem = num % den, s = String(ip) + (k ? '.' : ''); for (var i = 0; i < k; i++) { rem *= 10; s += Math.floor(rem / den); rem %= den; } return s; }
  function fracDigits(s) { return (String(s).split('.')[1] || '') + '00000000000000000000'; }
  function tInt(s, k) { return Number((String(s).split('.')[0] || '0') + fracDigits(s).slice(0, k)); }
  function rInt(s, k) { return tInt(s, k) + (Number(fracDigits(s).charAt(k)) >= 5 ? 1 : 0); }
  function intStr(v, k) { if (!k) return String(v); var s = String(v); while (s.length <= k) s = '0' + s; return s.slice(0, -k) + '.' + s.slice(-k); }
  function rStr(s, k) { return intStr(rInt(s, k), k); }
  function trimZ(s) { return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); }
  function isTerm(q) { while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function decOf(p, q) { return isTerm(q) ? trimZ(divStr(p, q, 8)) : null; } // exact decimal, or null if it repeats
  function near(v, x) { return Math.abs(v - x) < 0.0051; }
  function cleanNum(resp) { return String(resp == null ? '' : resp).replace(/\\\$|\$/g, '').replace(/\\[,;: !]|~|\s+/g, '').replace(/^\+/, ''); }

  /* ================= checkers ================= */
  /* a fraction. T = [p, q]. o.lowest (default true): an unreduced fraction is nudged; o.any: any equal fraction is fine;
   * o.diag(v, pf) -> {code, hint, form?} (pf = [top, bottom] as typed, or null) */
  function fracChk(T, o) {
    o = o || {}; var Tv = T[0] / T[1];
    return function (resp) {
      var raw = String(resp == null ? '' : resp);
      if (/^\s*\d+\s*,\s*\d+\s*$/.test(raw)) return form('u1l2-comma', 'Write it as one fraction with the fraction key (top number, then bottom number).');
      var a = K.read(raw); if (a.res) return a.res;
      var pf = ex.plainFraction(a.ast), sh = ex.shape(a.ast), v = a.val;
      if (ex.eq(v, Tv)) {
        if (sh.decimals && !pf) return o.decimalOk ? ok() : form('u1l2-decimal', 'Right value — now write it as a fraction instead of a decimal.');
        if (!pf) return form('u1l2-one-fraction', 'That has the right value, but write it as a single fraction.');
        if (!o.any && o.lowest !== false && gcd(pf[0], pf[1]) > 1) return form('u1l2-not-lowest', 'Right value — but ' + t(fT(pf[0], pf[1])) + ' isn’t in simplest form yet: ' + t(pf[0]) + ' and ' + t(pf[1]) + ' still have the common factor ' + t(gcd(pf[0], pf[1])) + '. Keep dividing.');
        return ok();
      }
      var h = o.diag ? o.diag(v, pf) : null;
      if (h) return h.form ? form(h.code, h.hint) : wrong(h.code || 'u1l2-diag', h.hint);
      if (pf && T[0] && ex.eq(v, T[1] / T[0])) return wrong('u1l2-flip', 'Your fraction is upside down: the part goes on top, the whole on the bottom.');
      if (sh.decimals && Math.abs(v - Tv) < 0.01) return form('u1l2-decimal-rounded', 'That decimal is close but not exact. Give the answer as a fraction.');
      return wrong('value', null);
    };
  }
  function fracPart(prompt, T, o) {
    o = o || {};
    var lowT = red(T[0], T[1]), key = o.key || fT(lowT[0], lowT[1]);
    return { prompt: prompt, input: { type: 'math', keys: 'fraction', before: o.before, after: o.after }, check: fracChk(lowT, o), key: key, answer: t(key), solution: o.solution, hints: o.hints || [], text: o.text, bad: o.bad || [], good: o.good };
  }
  /* a decimal or money amount: xs exact decimal string, dp the place to round to. o.money ($ and cents), o.diag(v), o.nr, o.placesHint */
  function roundChk(xs, dp, o) {
    o = o || {};
    var want = rInt(xs, dp), place = o.money ? (dp === 2 ? 'cent' : dp === 0 ? 'dollar' : '') : (['whole number', 'tenth', 'hundredth', 'thousandth'][dp] || dp + ' decimal places');
    return function (resp) {
      var raw = cleanNum(resp);
      if (/^\d*,\d{1,2}$/.test(raw)) return form('u1l2-comma-point', 'Use a decimal point (.), not a comma.');
      if (!/^\d+(\.\d*)?$|^\.\d+$/.test(raw)) {
        var a = K.read(String(resp == null ? '' : resp));
        if (!a.res && ex.plainFraction(a.ast) && ex.eq(a.val, Number(xs))) return form('u1l2-as-decimal', 'Right value — now write it as a <b>decimal</b> (divide the top by the bottom).');
        return K.number(Number(intStr(want, dp)), null, { nr: o.nr })(raw);
      }
      var s = (raw.charAt(0) === '.' ? '0' + raw : raw).replace(/\.$/, ''), dec = (s.split('.')[1] || '').replace(/0+$/, '').length, v = Number(s);
      if (o.nr && raw.length > 4) return rInt(s, dp) === want ? form('round', 'Right — now round it to the nearest ' + place + '.') : form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      var si = dec <= dp ? rInt(s, dp) : null;
      if (si === want) return ok();
      if (dec > dp && rInt(s, dp) === want) return form('u1l2-round', 'Right — now round it to the nearest ' + place + '.');
      if (si != null && dec < dp && rInt(xs, dec) * Math.pow(10, dp - dec) === si) return form('u1l2-places', o.placesHint || 'Round to the nearest ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      var h = o.diag ? o.diag(v, s) : null;
      if (h) return h.form ? form(h.code, h.hint) : wrong(h.code || 'u1l2-diag', h.hint);
      var fl = tInt(xs, dp);
      if (si != null && want === fl + 1 && si === fl) return wrong('u1l2-round-dir', 'Look at the next digit: it is 5 or more, so round <b>up</b>.');
      if (si != null && want === fl && si === fl + 1) return wrong('u1l2-round-dir', 'Look at the next digit: it is 4 or less, so don’t round up.');
      return wrong('value', null);
    };
  }
  function decPart(prompt, xs, dp, o) {
    o = o || {};
    var key = o.money ? rStr(xs, dp) : trimZ(rStr(xs, dp)) || '0';
    return { prompt: prompt, input: { type: 'number', before: o.nr ? undefined : o.money ? '$' : o.before, after: o.after, nr: !!o.nr }, check: roundChk(xs, dp, o), key: key,
      answer: o.money ? t('\\$' + key) : t(key + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.solution, hints: o.hints || [], text: o.text, bad: (o.bad || []).filter(function (b) { return b !== key; }) };
  }
  /* a fraction → decimal (exact if it stops, else to the nearest thousandth) */
  function toDecPart(p, q, prompt) {
    var term = isTerm(q), xs = divStr(p, q, 12), dp = term ? trimZ(divStr(p, q, 8)).split('.')[1].length : 3, d = trimZ(rStr(xs, dp));
    return decPart(prompt || F(p, q), xs, dp, { text: 'to decimal ' + p + '/' + q, placesHint: term ? 'Don’t round: ' + t(p + '\\div ' + q) + ' comes out exactly. Write all of its digits.' : null,
      solution: 'Divide the top by the bottom: ' + t(p + '\\div ' + q + '=' + (term ? d : xs.slice(0, xs.indexOf('.') + 5) + '\\ldots\\approx ' + d)) + '.',
      hints: ['The fraction bar means divide: top ÷ bottom.', term ? 'This one stops — write every digit.' : 'It repeats: round to the nearest thousandth (3 decimal places).'],
      diag: function (v) {
        if (near(v, q / p) || Math.abs(v - Number(rStr(divStr(q, p, 8), 3))) < 1e-9) return { code: 'u1l2-div-way', hint: 'Divide the <b>top</b> by the bottom: ' + t(p + '\\div ' + q) + ', not ' + t(q + '\\div ' + p) + '. (A fraction less than 1 gives a decimal less than 1.)' };
        if (Math.abs(v - Number('0.' + p + q)) < 1e-9 || Math.abs(v - Number(p + '.' + q)) < 1e-9) return { code: 'u1l2-digits', hint: 'A fraction doesn’t become a decimal by writing its digits. Divide: ' + t(p + '\\div ' + q) + '.' };
        return null;
      }, bad: ['0.' + p + q, trimZ(rStr(divStr(q, p, 8), 3))] });
  }
  /* a decimal → fraction in simplest form */
  function toFracPart(ds) {
    var places = ds.split('.')[1].length, D = Math.pow(10, places), N = Math.round(Number(ds) * D), f = red(N, D);
    return fracPart(t(ds), f, { text: 'to fraction ' + ds,
      solution: 'The last digit is in the ' + ['tenths', 'hundredths', 'thousandths'][places - 1] + ' place: ' + t(ds + '=' + fT(N, D) + (gcd(N, D) > 1 ? '=' + fT(f[0], f[1]) : '')) + (gcd(N, D) > 1 ? ' (divide the top and bottom by ' + t(gcd(N, D)) + ')' : '') + '.',
      hints: ['Read the decimal: ' + ['tenths', 'hundredths', 'thousandths'][places - 1] + ' → a denominator of ' + t(D) + '.', 'Then write it in simplest form.'],
      diag: function (v) { if (ex.eq(v, N / (D === 10 ? 100 : 10))) return { code: 'u1l2-place-value', hint: 'Check the place value of the last digit: it gives a denominator of ' + t(D) + '.' }; return null; },
      bad: [fT(N, D === 10 ? 100 : 10)] });
  }
  /* the missing number in A/B = top/bottom: one of top/bottom is null (the box) */
  function missingPart(A, B, top, bot) {
    var askTop = top == null, ans = askTop ? A * bot / B : B * top / A, low = red(A, B), g = gcd(A, B);
    var known = askTop ? bot : top, mine = askTop ? B : A, steps;
    if (known % mine === 0) { var k = known / mine; steps = (askTop ? t(B + '\\times ' + k + '=' + bot) + ', so multiply the top by ' + t(k) + ' too: ' + t(A + '\\times ' + k + '=' + ans) : t(A + '\\times ' + k + '=' + top) + ', so multiply the bottom by ' + t(k) + ' too: ' + t(B + '\\times ' + k + '=' + ans)); }
    else if (mine % known === 0) { var dv = mine / known; steps = (askTop ? t(B + '\\div ' + dv + '=' + bot) + ', so divide the top by ' + t(dv) + ' too: ' + t(A + '\\div ' + dv + '=' + ans) : t(A + '\\div ' + dv + '=' + top) + ', so divide the bottom by ' + t(dv) + ' too: ' + t(B + '\\div ' + dv + '=' + ans)); }
    else { var k2 = askTop ? bot / low[1] : top / low[0]; steps = 'No whole number takes ' + t(mine) + ' to ' + t(known) + ', so simplify first: ' + t(fT(A, B) + '=' + fT(low[0], low[1])) + ' (divide by ' + t(g) + ').<br>' + (askTop ? t(low[1] + '\\times ' + k2 + '=' + bot) + ', so ' + t(low[0] + '\\times ' + k2 + '=' + ans) : t(low[0] + '\\times ' + k2 + '=' + top) + ', so ' + t(low[1] + '\\times ' + k2 + '=' + ans)); }
    var res = askTop ? fT(ans, bot) : fT(top, ans);
    var add = askTop ? A + (bot - B) : B + (top - A), mult = known > mine ? known / mine : mine / known;
    var p = P.number(t(dT(A, B) + '=' + (askTop ? '\\dfrac{\\square}{' + bot + '}' : '\\dfrac{' + top + '}{\\square}')), ans, function (v) {
      if (v === add && add !== ans) return { code: 'u1l2-added', hint: 'Adding (or subtracting) the same amount doesn’t keep fractions equal. Find what the ' + (askTop ? 'bottom' : 'top') + ' was <b>multiplied or divided</b> by, and do the same to the ' + (askTop ? 'top' : 'bottom') + '.' };
      if (v === mult && mult !== ans) return { code: 'u1l2-multiplier', hint: t(mult) + ' is what the ' + (askTop ? 'bottom' : 'top') + ' was ' + (known > mine ? 'multiplied' : 'divided') + ' by. Now do that to the ' + (askTop ? 'top' : 'bottom') + '.' };
      if (askTop && Math.abs(v - B * bot / A) < 1e-9) return { code: 'u1l2-swap', hint: 'Keep the tops matching the tops: the box is a <b>top</b> number.' };
      if (!askTop && Math.abs(v - A * top / B) < 1e-9) return { code: 'u1l2-swap', hint: 'Keep the bottoms matching the bottoms: the box is a <b>bottom</b> number.' };
      return null;
    }, steps + '.<br>' + t(fT(A, B) + '=' + res), ['What was the ' + (askTop ? 'bottom' : 'top') + ' multiplied or divided by?', 'Do the same to the ' + (askTop ? 'top' : 'bottom') + '. If it isn’t a whole number, simplify first.'], 'missing ' + A + '/' + B + (askTop ? '=?/' + bot : '=' + top + '/?'), { before: t('\\square=') });
    p.bad = [add, mult].filter(function (x) { return x !== ans && x > 0; }).map(String);
    return p;
  }
  /* simplify a fraction */
  function simpPart(A, B, o) {
    o = o || {};
    var g = gcd(A, B), f = red(A, B);
    return fracPart(o.prompt || F(A, B), f, { text: 'simplify ' + A + '/' + B,
      solution: (o.pre || '') + 'The GCF of ' + t(A) + ' and ' + t(B) + ' is ' + t(g) + ': ' + t('\\frac{' + A + '\\div ' + g + '}{' + B + '\\div ' + g + '}=' + fT(f[0], f[1])) + '.' + (o.post || ''),
      hints: ['Find the greatest common factor (GCF) of the top and the bottom.', 'Divide the top and the bottom by it. (Or divide by any common factor, then look again.)'],
      diag: function (v, pf) { if (ex.eq(v, f[0] / B) || ex.eq(v, A / f[1])) return { code: 'u1l2-half', hint: 'Divide the top <b>and</b> the bottom by the same number.' }; return o.diag ? o.diag(v, pf) : null; },
      bad: [fT(f[0], B), fT(A, f[1])] });
  }
  /* a fraction of an amount. money: answer in dollars to the cent */
  function ofPart(a, b, amt, o) {
    o = o || {};
    var money = !!o.money, num = amt * a, xs = money ? divStr(num * 100, b * 100, 6) : divStr(num, b, 6), exact = num % b === 0;
    var res = trimZ(xs), unit = o.unit;
    var sol = (o.pre || '') + (amt % b === 0 ? t(amt + '\\div ' + b + '=' + amt / b) + '<br>' + t(amt / b + '\\times ' + a + '=' + (money ? '\\$' + cs(Math.round(num * 100 / b)) : amt * a / b)) : t(amt + '\\times ' + a + '\\div ' + b + '=' + (exact || (isTerm(b) && (res.split('.')[1] || '').length <= 5) ? res : xs.slice(0, xs.indexOf('.') + 5) + '\\ldots') + (money && !exact && (res.split('.')[1] || '').length > 2 ? '\\approx\\$' + rStr(xs, 2) : money ? '=\\$' + rStr(xs, 2) : ''))) + (unit ? ' ' + unit : '') + (o.post || '');
    var diag = function (v) {
      if (near(v, amt / b) && a !== 1) return { code: 'u1l2-of-div-only', hint: 'That’s ' + t(fT(1, b)) + ' of ' + (money ? M(amt * 100) : t(amt)) + '. You need ' + t(fT(a, b)) + ': multiply by ' + t(a) + ' too.' };
      if (near(v, amt * b / a)) return { code: 'u1l2-of-flip', hint: 'Divide by the <b>bottom</b> (' + t(b) + ') and multiply by the <b>top</b> (' + t(a) + ').' };
      if (near(v, amt / a)) return { code: 'u1l2-of-flip', hint: 'Divide by the bottom number, ' + t(b) + ', not the top.' };
      if (near(v, amt * a)) return { code: 'u1l2-of-mult-only', hint: 'Multiply by ' + t(a) + ' <b>and</b> divide by ' + t(b) + '.' };
      return o.diag ? o.diag(v) : null;
    };
    return decPart(o.prompt || t(fT(a, b) + '\\text{ of }' + (money ? '\\$' + amt : amt)), xs, money ? 2 : Math.min(3, (res.split('.')[1] || '').length), { money: money, after: o.after, unit: o.unitTex, text: o.text || a + '/' + b + ' of ' + amt, solution: sol,
      hints: o.hints || ['Divide by the bottom number, then multiply by the top number.'], diag: diag, nr: o.nr, bad: [String(amt * a)].concat(a !== 1 ? [trimZ(divStr(amt, b, 6))] : []) });
  }

  /* ================= pictures (SVG) ================= */
  var FILL = '#d9b27a', LINE = '#3d3426';
  function svg(w, h, body) { return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:block;margin:6px 0 4px;max-width:100%" role="img" aria-label="fraction picture">' + body + '</svg>'; }
  function bar(parts, shaded, w) {
    w = w || 260; var pw = w / parts, s = '';
    for (var i = 0; i < parts; i++) s += '<rect x="' + (2 + i * pw).toFixed(1) + '" y="2" width="' + pw.toFixed(1) + '" height="34" fill="' + (i < shaded ? FILL : '#fff') + '" stroke="' + LINE + '" stroke-width="1.5"/>';
    return svg(w + 4, 40, s);
  }
  function pie(parts, shaded) {
    var r = 46, cx = 50, cy = 50, s = '';
    for (var i = 0; i < parts; i++) {
      var a0 = -Math.PI / 2 + i * 2 * Math.PI / parts, a1 = a0 + 2 * Math.PI / parts;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      s += '<path d="M' + cx + ',' + cy + ' L' + x0.toFixed(2) + ',' + y0.toFixed(2) + ' A' + r + ',' + r + ' 0 0 1 ' + x1.toFixed(2) + ',' + y1.toFixed(2) + ' Z" fill="' + (i < shaded ? FILL : '#fff') + '" stroke="' + LINE + '" stroke-width="1.5"/>';
    }
    return svg(100, 100, s);
  }
  function grid(cols, rows, shaded) {
    var c = 26, s = '';
    for (var rr = 0; rr < rows; rr++) for (var cc = 0; cc < cols; cc++) { var n = rr * cols + cc; s += '<rect x="' + (2 + cc * c) + '" y="' + (2 + rr * c) + '" width="' + c + '" height="' + c + '" fill="' + (n < shaded ? FILL : '#fff') + '" stroke="' + LINE + '" stroke-width="1.5"/>'; }
    return svg(cols * c + 4, rows * c + 4, s);
  }
  function counters(count, filled) {
    var s = '';
    for (var i = 0; i < count; i++) s += '<circle cx="' + (18 + i * 30) + '" cy="18" r="11" fill="' + (filled.indexOf(i) >= 0 ? '#8a6a3c' : '#fff') + '" stroke="' + LINE + '" stroke-width="1.6"/>';
    return svg(count * 30 + 6, 36, s);
  }
  /* "what fraction is shaded" from a picture */
  function shadedPart(pic, k, n, word, extra) {
    word = word || 'shaded';
    return fracPart(pic + (extra || '') + cap(word) + ':', [k, n], { any: true, key: fT(k, n), text: word + ' ' + k + '/' + n,
      solution: 'There are ' + t(n) + ' equal ' + (word === 'filled' ? 'counters' : 'parts') + ' in all, and ' + t(k) + ' ' + (k === 1 ? 'is' : 'are') + ' ' + word + ': ' + t(fT(k, n)) + (gcd(k, n) > 1 ? ' (or ' + t(fT(red(k, n)[0], red(k, n)[1])) + ')' : '') + '.',
      hints: ['Bottom: how many equal parts in all? Top: how many are ' + word + '?'],
      diag: function (v) {
        if (ex.eq(v, (n - k) / n)) return { code: 'u1l2-unshaded', hint: 'That’s the part that is <b>not</b> ' + word + '.' };
        if (n - k && ex.eq(v, k / (n - k))) return { code: 'u1l2-part-part', hint: 'The bottom number is <b>all</b> the parts (' + word + ' and not ' + word + ' together).' };
        return null;
      }, bad: (2 * k !== n ? [fT(n - k, n)] : []).concat(n - k ? [fT(k, n - k)] : []) });
  }
  /* three different fractions equal to p/q (boxes: o.labels; o.need: per box 'small' | 'big' | null) */
  function equivPart(p, q, o) {
    o = o || {};
    var labels = o.labels || ['First', 'Second', 'Third'], need = o.need || [null, null, null], keys = o.keys;
    var check = function (resp) {
      resp = resp || []; var seen = [], firstForm = null;
      for (var i = 0; i < labels.length; i++) {
        var lab = '<b>' + labels[i] + ':</b> ', raw = String(resp[i] == null ? '' : resp[i]).trim();
        if (!raw) return form('empty', lab + 'fill in every box.');
        var a = K.read(raw); if (a.res) return { v: a.res.v, code: a.res.code, hint: lab + a.res.hint };
        var pf = ex.plainFraction(a.ast);
        if (!pf) return form('u1l2-one-fraction', lab + 'write a fraction (top number, fraction key, bottom number).');
        if (!ex.eq(a.val, p / q)) {
          if (pf[0] - p === pf[1] - q && pf[0] !== p) return wrong('u1l2-added', lab + 'adding the same number to the top and bottom doesn’t keep the amount the same. <b>Multiply</b> (or divide) the top and bottom by the same number.');
          if (pf[0] === p || pf[1] === q) return wrong('u1l2-one-side', lab + t(fT(pf[0], pf[1])) + ' isn’t equal to ' + t(fT(p, q)) + ': change the top <b>and</b> the bottom by the same factor.');
          return wrong('u1l2-not-equiv', lab + t(fT(pf[0], pf[1])) + ' isn’t equal to ' + t(fT(p, q)) + '. Multiply or divide the top and bottom by the same number.');
        }
        if (pf[0] === p && pf[1] === q) { firstForm = firstForm || form('u1l2-same', lab + 'that’s the fraction you started with. Make a <b>new</b> one.'); continue; }
        if (seen.some(function (x) { return x[0] === pf[0] && x[1] === pf[1]; })) { firstForm = firstForm || form('u1l2-repeat', lab + 'you already used ' + t(fT(pf[0], pf[1])) + '. Give a different fraction.'); continue; }
        seen.push(pf);
        if (need[i] === 'small' && pf[1] >= q) { firstForm = firstForm || form('u1l2-need-small', lab + 'this one should have <b>smaller</b> numbers: divide the top and bottom by a common factor.'); continue; }
        if (need[i] === 'big' && pf[1] <= q) { firstForm = firstForm || form('u1l2-need-big', lab + 'this one should have <b>bigger</b> numbers: multiply the top and bottom by the same number.'); continue; }
      }
      return firstForm || ok();
    };
    return { prompt: F(p, q), input: { type: 'fields', fields: labels.map(function (l) { return { name: l, label: l + ':', mode: 'math', keys: 'fraction' }; }) },
      check: check, key: keys, answer: keys.map(function (k) { return t(k); }).join(', ') + ' (many answers)',
      solution: o.solution, hints: ['Multiply (or divide) the top and the bottom by the <b>same</b> number.'], text: 'three equivalent to ' + p + '/' + q, bad: [keys.map(function () { return fT(p + 1, q + 1); })] };
  }
  /* compare two fractions: choose <, > or = */
  function cmpPart(r, a, b, c, d, method) {
    var L = a * d, Rr = c * b, rel = L < Rr ? '<' : L > Rr ? '>' : '=';
    var opts = ['<', '>', '='].map(function (s) { return { html: t(dT(a, b) + '\\ ' + s + '\\ ' + dT(c, d)), right: s === rel, code: 'said' + ({ '<': 'lt', '>': 'gt', '=': 'eq' })[s],
      why: s === rel ? null : s === '=' ? 'Check: are they really the same amount? Compare with a common denominator or decimals.' : 'Check the direction: the point of the sign faces the <b>smaller</b> fraction. Compare with a common denominator or decimals.' }; });
    var D = lcm(b, d), sol;
    if (method === 'lcd') sol = 'Common denominator ' + t(D) + ': ' + t(fT(a, b) + '=' + fT(a * D / b, D)) + ' and ' + t(fT(c, d) + '=' + fT(c * D / d, D)) + '.<br>' + t(a * D / b + (rel === '=' ? '=' : rel === '<' ? '<' : '>') + c * D / d) + ', so ' + t(fT(a, b) + rel + fT(c, d)) + '.';
    else if (method === 'same') { var f = red(a, b); sol = 'Simplify both: ' + t(fT(a, b) + '=' + fT(f[0], f[1])) + ' and ' + t(fT(c, d) + '=' + fT(f[0], f[1])) + '. They are equal: ' + t(fT(a, b) + '=' + fT(c, d)) + '.'; }
    else { var x1 = trimZ(rStr(divStr(a, b, 8), 3)), x2 = trimZ(rStr(divStr(c, d, 8), 3)); sol = 'Decimals: ' + t(fT(a, b) + (isTerm(b) ? '=' : '\\approx ') + x1) + ' and ' + t(fT(c, d) + (isTerm(d) ? '=' : '\\approx ') + x2) + '.<br>' + t(x1 + rel + x2) + ', so ' + t(fT(a, b) + rel + fT(c, d)) + '.'; }
    var p = P.mc(r, t(dT(a, b) + '\\ \\square\\ ' + dT(c, d)) + ' &nbsp; Which sign goes in the box?', opts, sol, ['Use a common denominator, or change both to decimals.'], 'compare ' + a + '/' + b + ' ' + c + '/' + d, true);
    p.input.columns = 3;
    return p;
  }

  HW.addCodes({
    'u1l2-comma': 'Typed a fraction as two numbers', 'u1l2-decimal': 'Decimal instead of a fraction', 'u1l2-one-fraction': 'Not a single fraction', 'u1l2-not-lowest': 'Not in simplest form',
    'u1l2-flip': 'Fraction upside down', 'u1l2-decimal-rounded': 'Rounded decimal instead of a fraction', 'u1l2-comma-point': 'Comma instead of a decimal point', 'u1l2-as-decimal': 'Fraction instead of a decimal',
    'u1l2-round': 'Didn’t round', 'u1l2-places': 'Wrong number of decimal places', 'u1l2-round-dir': 'Rounded the wrong way', 'u1l2-div-way': 'Divided bottom ÷ top', 'u1l2-digits': 'Wrote the digits as a decimal',
    'u1l2-place-value': 'Wrong place value (denominator)', 'u1l2-added': 'Added the same number to top and bottom', 'u1l2-multiplier': 'Gave the multiplier', 'u1l2-swap': 'Mixed up tops and bottoms',
    'u1l2-half': 'Divided only the top or only the bottom', 'u1l2-of-div-only': '“Of”: divided but didn’t multiply', 'u1l2-of-flip': '“Of”: divided by the top', 'u1l2-of-mult-only': '“Of”: multiplied but didn’t divide',
    'u1l2-unshaded': 'Gave the part not shaded', 'u1l2-part-part': 'Part over part instead of part over whole', 'u1l2-one-side': 'Changed only the top or only the bottom', 'u1l2-not-equiv': 'Fraction not equivalent',
    'u1l2-same': 'Repeated the given fraction', 'u1l2-repeat': 'Same fraction twice', 'u1l2-need-small': 'Needed a fraction with smaller numbers', 'u1l2-need-big': 'Needed a fraction with bigger numbers',
    'u1l2-not-gcf': 'A common factor, not the greatest', 'u1l2-not-common': 'Not a factor of both', 'u1l2-factors': 'Factor list wrong', 'u1l2-parts': 'Shaded the wrong number of parts',
    'u1l2-more-made': 'Compared counts, not fractions', 'u1l2-wrong-whole': 'Fraction of the wrong amount', 'u1l2-spent': 'Gave the fraction spent, not left', 'u1l2-endpoint': 'Gave one of the two fractions',
    'u1l2-not-between': 'Fraction not between the two', 'u1l2-short-wrong': 'Wrong amount short / extra', 'u1l2-bigger-numbers': 'Thought bigger numbers mean a bigger fraction'
  });
  HW.addPartial({
    'u1l2-flip': 'n', 'u1l2-round-dir': 's', 'u1l2-div-way': 'n', 'u1l2-digits': 'n', 'u1l2-place-value': 'b', 'u1l2-added': 'n', 'u1l2-multiplier': 'b', 'u1l2-swap': 'n', 'u1l2-half': 'b',
    'u1l2-of-div-only': 'b', 'u1l2-of-flip': 'n', 'u1l2-of-mult-only': 'b', 'u1l2-unshaded': 'b', 'u1l2-part-part': 'n', 'u1l2-one-side': 'n', 'u1l2-not-equiv': 'n', 'u1l2-not-gcf': 'b', 'u1l2-not-common': 'n',
    'u1l2-factors': 's', 'u1l2-parts': 'n', 'u1l2-more-made': 'n', 'u1l2-wrong-whole': 'b', 'u1l2-spent': 'b', 'u1l2-endpoint': 'n', 'u1l2-not-between': 'n', 'u1l2-short-wrong': 's', 'u1l2-bigger-numbers': 'n'
  });

  /* ================= generators ================= */
  /* a fraction p/q × g (not in simplest form) */
  function scaled(r, dens, gs, test) { return find(function () { var f = proper(r, dens), g = r.pick(gs); return [f[0] * g, f[1] * g, f[0], f[1], g]; }, test || function () { return true; }, null); }
  var SIMP_EXCLUDE = ['24/40', '18/45', '35/56', '40/100', '27/36', '15/20', '20/32'];
  function notEx(v) { return SIMP_EXCLUDE.indexOf(v[0] + '/' + v[1]) < 0; }
  /* one row of the factor table */
  function listChk(n) {
    var base = K.factorList(n);
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim();
      if (!s) return form('empty', 'List the factors, separated by commas.');
      var pl = HW.parse.numberList(s);
      if (!pl.ok) return form('u1l2-list', 'Type the factors as whole numbers separated by commas, like 1, 2, 3, 6.');
      return base(pl.values);
    };
  }
  function tableRow(A, B) {
    var g = gcd(A, B), f = red(A, B), dA = divisors(A), dB = divisors(B);
    var gChk = K.number(g, function (v) {
      if (A % v === 0 && B % v === 0) return { code: 'u1l2-not-gcf', hint: t(v) + ' is a common factor, but not the <b>greatest</b> one. Look for a bigger number in both lists.' };
      return { code: 'u1l2-not-common', hint: t(v) + ' isn’t a factor of both numbers. The GCF is in <b>both</b> lists.' };
    });
    var fields = [{ name: 'Factors of the top', label: 'Factors of ' + A + ':', mode: 'text', wide: true, placeholder: '1, 2, …' }, { name: 'Factors of the bottom', label: 'Factors of ' + B + ':', mode: 'text', wide: true, placeholder: '1, 2, …' },
      { name: 'GCF', label: 'GCF:' }, { name: 'Simplest form', label: 'Simplest form:', mode: 'math', keys: 'fraction' }];
    return P.fields(F(A, B), fields, [listChk(A), listChk(B), gChk, fracChk(f)], [dA.join(', '), dB.join(', '), String(g), fT(f[0], f[1])],
      'Factors of ' + A + ': ' + dA.join(', ') + ' · factors of ' + B + ': ' + dB.join(', ') + ' · GCF ' + g + ' · ' + F(f[0], f[1]),
      'Factors of ' + t(A) + ': ' + dA.map(function (x) { return x === g ? '<b>' + x + '</b>' : x; }).join(', ') + '<br>Factors of ' + t(B) + ': ' + dB.map(function (x) { return x === g ? '<b>' + x + '</b>' : x; }).join(', ') + '<br>The GCF is ' + t(g) + ': ' + t('\\frac{' + A + '\\div ' + g + '}{' + B + '\\div ' + g + '}=' + fT(f[0], f[1])) + '.',
      ['Find factors in pairs that multiply to the number (1 × ' + A + ', 2 × …).', 'The GCF is the biggest number in both lists. Divide the top and bottom by it.'], 'factor table ' + A + '/' + B);
  }
  /* fractions between 1/2 and 3/4 for "which is largest" */
  HW.defineLesson({
    id: 'u1l2', unit: 1, num: '2', title: 'Fractions Refresher: Equivalent Fractions and Simplest Form', outcome: 'REV',
    blurb: 'What a fraction means, equivalent fractions, the GCF and simplest form, comparing, fractions and decimals, and a fraction of an amount.',
    questions: [
      { num: '1', stem: 'Write the fraction of each picture that is shaded.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { var v = find(function () { var n = r.int(3, 8); return [r.int(1, n - 1), n]; }, function (v) { return !(v[1] === 8 && v[0] === 3); }, [2, 5]); return shadedPart(bar(v[1], v[0]), v[0], v[1]); } },
        { id: '1b', level: 'LIM', make: function (r) { var v = find(function () { var n = r.pick([4, 5, 6, 8, 8, 10]); return [r.int(1, n - 1), n]; }, function (v) { return !(v[1] === 6 && v[0] === 4); }, [3, 8]); return shadedPart(pie(v[1], v[0]), v[0], v[1]); } },
        { id: '1c', level: 'LIM', make: function (r) { var v = find(function () { var c = r.int(3, 6), rw = r.int(2, 3); return [r.int(1, c * rw - 1), c, rw]; }, function (v) { return !(v[1] === 4 && v[2] === 3 && v[0] === 5); }, [7, 5, 2]); return shadedPart(grid(v[1], v[2], v[0]), v[0], v[1] * v[2]); } },
        { id: '1d', level: 'BEG', make: function (r) {
          var v = find(function () { var n = r.int(5, 10), k = r.int(2, n - 2); return [n, r.sample(Array.apply(null, Array(n)).map(function (x, i) { return i; }), k)]; }, function (v) { return !(v[0] === 7 && v[1].length === 3); }, [9, [1, 2, 4, 7]]);
          return shadedPart(counters(v[0], v[1]), v[1].length, v[0], 'filled', '<span class="muted">A set of counters.</span> ');
        } },
        { id: '1e', level: 'LIM', make: function (r) {
          var n = r.int(3, 6), k = r.int(1, n - 1);
          var p = P.number('Shade the bar to show ' + F(k, n) + '. How many parts would you shade?' + bar(n, 0), k, function (v) { if (v === n - k) return { code: 'u1l2-unshaded', hint: 'Shade the number of parts on <b>top</b> of the fraction.' }; if (v === n) return { code: 'u1l2-parts', hint: 'That’s all the parts. Shade ' + t(k) + ' of the ' + t(n) + ' parts.' }; return null; },
            'The bar has ' + t(n) + ' equal parts, so shade ' + t(k) + ' of them: ' + bar(n, k), ['The bottom number tells how many equal parts; the top number tells how many to shade.'], 'shade ' + k + '/' + n, { after: 'parts' });
          p.bad = 2 * k !== n ? [String(n - k)] : []; return p;
        } },
        { id: '1f', level: 'BEG', make: function (r) {
          var v = find(function () { var q = r.pick([2, 3, 4, 5]), m = r.pick([2, 3]); return [proper(r, [q]), m]; }, function (v) { return v[0][1] * v[1] <= 12; }, [[2, 3], 2]), f = v[0], m = v[1], n = f[1] * m, k = f[0] * m;
          var p = P.number('Shade the bar to show ' + F(f[0], f[1]) + '. How many parts would you shade?' + bar(n, 0), k, function (x) { if (x === f[0]) return { code: 'u1l2-parts', hint: 'This bar has ' + t(n) + ' parts, not ' + t(f[1]) + '. Write ' + t(fT(f[0], f[1])) + ' with a denominator of ' + t(n) + ' first.' }; if (x === n - k) return { code: 'u1l2-unshaded', hint: 'That’s the number of parts <b>not</b> shaded.' }; return null; },
            'The bar has ' + t(n) + ' parts, so write ' + t(fT(f[0], f[1])) + ' in ' + n + 'ths: ' + t(fT(f[0], f[1]) + '=\\frac{' + f[0] + '\\times ' + m + '}{' + f[1] + '\\times ' + m + '}=' + fT(k, n)) + '. Shade ' + t(k) + ' parts: ' + bar(n, k),
            ['Count the parts in the bar. Make an equivalent fraction with that denominator.'], 'shade ' + f.join('/') + ' on ' + n, { after: 'parts' });
          p.bad = [String(f[0])]; return p;
        } }] },
      { num: '2', stem: 'Write three fractions equivalent to each fraction.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var q = r.int(2, 6); return equivPart(1, q, { keys: [fT(2, 2 * q), fT(3, 3 * q), fT(5, 5 * q)], solution: 'Multiply the top and bottom by ' + t('2') + ', ' + t('3') + ' and ' + t('5') + ': ' + F(2, 2 * q) + ', ' + F(3, 3 * q) + ', ' + F(5, 5 * q) + '. (Many answers are possible.)' }); } },
        { id: '2b', level: 'BEG', make: function (r) { var f = find(function () { return proper(r, [3, 4, 5, 7, 8]); }, function (f) { return f[0] > 1 && !(f[0] === 3 && f[1] === 5); }, [2, 5]); return equivPart(f[0], f[1], { keys: [fT(2 * f[0], 2 * f[1]), fT(3 * f[0], 3 * f[1]), fT(10 * f[0], 10 * f[1])], solution: 'Multiply the top and bottom by the same number, for example by ' + t('2') + ', ' + t('3') + ' and ' + t('10') + ': ' + F(2 * f[0], 2 * f[1]) + ', ' + F(3 * f[0], 3 * f[1]) + ', ' + F(10 * f[0], 10 * f[1]) + '. (Many answers are possible.)' }); } },
        { id: '2c', level: 'EMG', make: function (r) {
          var v = find(function () { var f = proper(r, [3, 4, 5]), g = r.pick([4, 6, 6]); return [f[0] * g, f[1] * g, f[0], f[1], g]; }, function (v) { return v[1] <= 30 && notEx(v); }, [12, 18, 2, 3, 6]);
          var mid = v[4] / 2, s1 = fT(v[0] / mid, v[1] / mid);
          var p = equivPart(v[0], v[1], { labels: ['Smaller numbers', 'Bigger numbers', 'Any other'], need: ['small', 'big', null], keys: [fT(v[2], v[3]), fT(v[0] * 2, v[1] * 2), s1],
            solution: 'Divide: ' + t(fT(v[0], v[1]) + '=' + s1 + '=' + fT(v[2], v[3])) + ' (divide by ' + t(mid) + ', then by ' + t(2) + '); multiply: ' + F(v[0] * 2, v[1] * 2) + '. (Many answers are possible.)' });
          p.prompt = F(v[0], v[1]) + ' <span class="muted">(one with smaller numbers and one with bigger numbers)</span>';
          return p;
        } }] },
      { num: '3', stem: 'Find the missing number.', parts: [
        { id: '3a', level: 'LIM', make: function (r) { var f = find(function () { return proper(r, [3, 4, 5, 6, 7]); }, function (f) { return !(f[0] === 2 && f[1] === 3); }, [2, 5]), k = r.int(2, 5); return missingPart(f[0], f[1], null, f[1] * k); } },
        { id: '3b', level: 'BEG', make: function (r) { var f = proper(r, [6, 8, 9]), k = r.int(4, 6); return missingPart(f[0], f[1], null, f[1] * k); } },
        { id: '3c', level: 'BEG', make: function (r) { var v = find(function () { var f = proper(r, [3, 4, 5, 7]), g = r.int(3, 9); return [f[0] * g, f[1] * g, f[0]]; }, function (v) { return !(v[0] === 20 && v[1] === 32) && v[2] > 1; }, [21, 28, 3]); return missingPart(v[0], v[1], v[2], null); } },
        { id: '3d', level: 'BEG', make: function (r) { var f = find(function () { return proper(r, [5, 7, 9, 11]); }, function (f) { return f[0] > 1 && !(f[0] === 4 && f[1] === 7); }, [4, 9]), k = r.int(3, 9); return missingPart(f[0], f[1], f[0] * k, null); } },
        { id: '3e', level: 'BEG', make: function (r) { var v = find(function () { var f = proper(r, [3, 4, 5]), g = r.int(8, 15); return [f[0] * g, f[1] * g, f[1]]; }, notEx, [36, 48, 4]); return missingPart(v[0], v[1], null, v[2]); } },
        { id: '3f', level: 'EMG', make: function (r) {
          var v = find(function () { var f = proper(r, [3, 4, 5]), g = r.int(2, 6), k = r.int(2, 6); return [f[0] * g, f[1] * g, f[1] * k]; }, function (v) { return v[2] % v[1] !== 0 && v[1] % v[2] !== 0 && !(v[0] === 15 && v[1] === 20 && v[2] === 28); }, [10, 15, 12]);
          var p = missingPart(v[0], v[1], null, v[2]); p.prompt += ' <span class="muted">(simplify first)</span>'; return p;
        } }] },
      { num: '4', stem: 'Complete the table: list the factors of the top and of the bottom, find the GCF, and write the fraction in simplest form.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var v = scaled(r, [2, 3, 4, 5], [2, 3, 4, 6], function (v) { return v[1] <= 24 && v[0] >= 6 && v[4] >= 3 && notEx(v); }) || [12, 18]; return tableRow(v[0], v[1]); } },
        { id: '4b', level: 'BEG', make: function (r) { var v = scaled(r, [3, 7, 9], [10], function (v) { return v[1] <= 90 && notEx(v); }) || [30, 70]; return tableRow(v[0], v[1]); } },
        { id: '4c', level: 'BEG', make: function (r) { var v = scaled(r, [3, 5, 7], [8], function (v) { return v[1] <= 56 && notEx(v); }) || [16, 40]; return tableRow(v[0], v[1]); } },
        { id: '4d', level: 'EMG', make: function (r) { var v = scaled(r, [5, 7, 4], [9], function (v) { return v[1] <= 63 && notEx(v); }) || [27, 45]; return tableRow(v[0], v[1]); } }] },
      { num: '5', stem: 'Write each fraction in simplest form.', parts: [
        { id: '5a', level: 'LIM', make: function (r) { var v = scaled(r, [3, 4, 5, 7], [2], notEx); return simpPart(v[0], v[1]); } },
        { id: '5b', level: 'LIM', make: function (r) { var v = scaled(r, [4, 5, 7], [3], notEx); return simpPart(v[0], v[1]); } },
        { id: '5c', level: 'BEG', make: function (r) { var v = scaled(r, [3, 4, 5], [7], notEx); return simpPart(v[0], v[1]); } },
        { id: '5d', level: 'BEG', make: function (r) { var v = scaled(r, [7, 9, 5], [4], notEx); return simpPart(v[0], v[1]); } },
        { id: '5e', level: 'BEG', make: function (r) { var v = scaled(r, [6, 7, 8, 9], [5], function (v) { return v[1] === 50 || v[1] <= 45; }); return simpPart(v[0], v[1]); } },
        { id: '5f', level: 'EMG', make: function (r) { var v = scaled(r, [3, 4, 5], [12, 16], notEx); return simpPart(v[0], v[1]); } },
        { id: '5g', level: 'EMG', make: function (r) { var v = scaled(r, [3, 4, 5], [12, 15], notEx); return simpPart(v[0], v[1]); } },
        { id: '5h', level: 'BEG', make: function (r) { var x = find(function () { return r.pick([75, 25, 80, 60, 20, 35, 45, 65, 85, 12, 24, 36, 48, 64, 15, 55]); }, function (x) { return x !== 40; }, 75); return simpPart(x, 100); } }] },
      { num: '6', stem: function (s) { return 'Sofia was asked to write ' + F(s.A, s.B) + ' in simplest form. She wrote ' + t(fT(s.A, s.B) + '=' + fT(s.A / s.d, s.B / s.d)) + '.'; },
        shared: function (r) { return find(function () { var f = proper(r, [3, 4, 5, 7]), G = r.pick([4, 6, 8, 9, 10]), ds = divisors(G).filter(function (x) { return x > 1 && x < G; }); return { A: f[0] * G, B: f[1] * G, G: G, d: r.pick(ds), p: f[0], q: f[1] }; }, function (s) { return s.B <= 72 && !(s.A === 24 && s.B === 40); }, { A: 24, B: 40, G: 8, d: 2, p: 3, q: 5 }); },
        parts: [
          { id: '6a', level: 'LIM', make: function (r, s) { return P.tf(r, 'Is ' + F(s.A / s.d, s.B / s.d) + ' equal to ' + F(s.A, s.B) + '?', true, 'She divided the top <b>and</b> the bottom by ' + t(s.d) + ', so the amount is the same.', 'Yes: dividing the top and the bottom by ' + t(s.d) + ' keeps the amount the same.', ['Did she do the same thing to the top and the bottom?'], 'Sofia equal'); } },
          { id: '6b', level: 'BEG', make: function (r, s) {
            var a = s.A / s.d, b = s.B / s.d, left = s.G / s.d;
            return P.mc(r, 'Is ' + F(a, b) + ' in simplest form?', [
              { html: 'No — ' + t(a) + ' and ' + t(b) + ' still have a common factor, ' + t(left) + '. The simplest form is ' + F(s.p, s.q) + '.', right: true },
              { html: 'Yes — she divided the top and the bottom by ' + t(s.d) + '.', code: 'said-yes', why: 'She simplified, but not all the way: ' + t(a) + ' and ' + t(b) + ' still share a factor.' },
              { html: 'Yes — ' + F(a, b) + ' is equal to ' + F(s.A, s.B) + '.', code: 'said-yes-equal', why: 'Equal isn’t the same as simplest. Simplest form means the only common factor of the top and bottom is 1.' },
              { html: 'No — the simplest form is ' + F(s.p + 1, s.q + 1) + '.', code: 'u1l2-added', why: 'Check: ' + F(s.p + 1, s.q + 1) + ' isn’t equal to ' + F(s.A, s.B) + '. Divide ' + t(a) + ' and ' + t(b) + ' by their common factor.' }],
              'No. ' + t(a) + ' and ' + t(b) + ' still have the common factor ' + t(left) + ': ' + t('\\frac{' + a + '\\div ' + left + '}{' + b + '\\div ' + left + '}=' + fT(s.p, s.q)) + '.<br>Dividing by the GCF of ' + t(s.A) + ' and ' + t(s.B) + ' (which is ' + t(s.G) + ') gets there in one step.', ['Do ' + t(a) + ' and ' + t(b) + ' have a common factor other than 1?'], 'Sofia simplest');
          } }] },
      { num: '7', stem: function (s) { return 'A delivery driver made ' + s.N + ' deliveries on Friday. ' + s.k + ' of them were on time.'; },
        shared: function (r) { return find(function () { var N = r.int(20, 60), k = r.int(Math.ceil(N * 0.6), N - 2); return { N: N, k: k }; }, function (s) { return gcd(s.k, s.N) > 2 && !(s.N === 36 && s.k === 27); }, { N: 45, k: 36 }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, s) { return simpPart(s.k, s.N, { prompt: 'What fraction of the deliveries were on time? Write it in simplest form.', pre: F(s.k, s.N) + '. ', post: ' ' + F(red(s.k, s.N)[0], red(s.k, s.N)[1]) + ' were on time.', diag: function (v) { if (ex.eq(v, (s.N - s.k) / s.N)) return { code: 'u1l2-unshaded', hint: 'That’s the fraction that were <b>late</b>.' }; return null; } }); } },
          { id: '7b', level: 'BEG', make: function (r, s) { var L = s.N - s.k; return simpPart(L, s.N, { prompt: 'What fraction of the deliveries were late? Write it in simplest form.', pre: t(s.N + '-' + s.k + '=' + L) + ' late: ' + F(L, s.N) + '. ', diag: function (v) { if (ex.eq(v, s.k / s.N)) return { code: 'u1l2-unshaded', hint: 'That’s the fraction that were <b>on time</b>. How many were late?' }; if (ex.eq(v, L / s.k)) return { code: 'u1l2-part-part', hint: 'Compare the late deliveries with <b>all</b> ' + s.N + ' deliveries.' }; return null; } }); } }] },
      { num: '8', stem: 'Complete the table: change each fraction to a decimal, and each decimal to a fraction in simplest form. Round repeating decimals to the nearest thousandth.', parts: [
        { id: '8a', level: 'LIM', make: function (r) { var p = r.pick([1, 3]); return toDecPart(p, 4); } },
        { id: '8b', level: 'LIM', make: function (r) { return toDecPart(r.int(1, 4), 5); } },
        { id: '8c', level: 'BEG', make: function (r) { return toDecPart(r.pick([1, 5, 7]), 8); } },
        { id: '8d', level: 'BEG', make: function (r) { var f = r.pick([[1, 3], [2, 3], [1, 6], [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [1, 12], [5, 12], [7, 12], [11, 12]]); return toDecPart(f[0], f[1]); } },
        { id: '8e', level: 'BEG', make: function (r) { var p = find(function () { return r.pick([1, 3, 11, 13, 17, 19]); }, function () { return true; }, 7); return toFracPart(trimZ(divStr(p, 20, 4))); } },
        { id: '8f', level: 'LIM', make: function (r) { return toFracPart(r.pick(['0.2', '0.4', '0.8', '0.5', '0.4', '0.8'])); } },
        { id: '8g', level: 'BEG', make: function (r) { return toFracPart(r.pick(['0.875', '0.625', '0.875', '0.625'])); } }] },
      { num: '9', stem: 'Write <, > or = in each box. Show your method.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { var v = find(function () { var q = r.pick([2, 3, 4, 5]), m = r.pick([2, 3]); var f = proper(r, [q]), g = proper(r, [q * m]); return [f[0], f[1], g[0], g[1]]; }, function (v) { return v[0] * v[3] !== v[2] * v[1] && v[3] !== v[1] && Math.abs(v[0] / v[1] - v[2] / v[3]) < 0.2 && !(v[0] === 3 && v[1] === 4 && v[2] === 5 && v[3] === 6); }, [3, 4, 5, 8]); return cmpPart(r, v[0], v[1], v[2], v[3], 'lcd'); } },
        { id: '9b', level: 'BEG', make: function (r) { var v = find(function () { var f = proper(r, [3, 6, 7]), g = proper(r, [10, 5, 4]); return [f[0], f[1], g[0], g[1]]; }, function (v) { return Math.abs(v[0] / v[1] - v[2] / v[3]) < 0.12 && v[0] * v[3] !== v[2] * v[1]; }, [2, 3, 7, 10]); return cmpPart(r, v[0], v[1], v[2], v[3], 'dec'); } },
        { id: '9c', level: 'BEG', make: function (r) { var f = proper(r, [3, 4, 5]), g = r.shuffle([2, 3, 4, 5]).slice(0, 2); return cmpPart(r, f[0] * g[0], f[1] * g[0], f[0] * g[1], f[1] * g[1], 'same'); } },
        { id: '9d', level: 'EMG', make: function (r) { var v = find(function () { var f = proper(r, [7, 9, 11, 13]), g = proper(r, [8, 9, 11, 12, 13]); return [f[0], f[1], g[0], g[1]]; }, function (v) { var d = Math.abs(v[0] / v[1] - v[2] / v[3]); return d > 0.004 && d < 0.03 && v[1] !== v[3] && !(v[0] === 5 && v[1] === 8); }, [4, 9, 5, 11]); return cmpPart(r, v[0], v[1], v[2], v[3], 'dec'); } }] },
      { num: '10', stem: '', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var fs = find(function () { var a = [r.pick([1, 3]), 4], b = [r.pick([1, 3, 5, 7]), 8], c = [r.pick([1, 3, 5, 7, 9, 11, 13, 15]), 16], d = [r.pick([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]), 32]; return [a, b, c, d]; },
            function (fs) { var vals = fs.map(function (f) { return f[0] / f[1]; }), s = vals.slice().sort(); var dist = vals.every(function (v, i) { return vals.indexOf(v) === i; }); var sorted = fs.slice().sort(function (x, y) { return x[0] / x[1] - y[0] / y[1]; }); return dist && sorted[0][1] !== 4 && sorted[3][1] !== 32 && sorted.map(function (f) { return f[1]; }).join() !== '32,16,8,4' && !(fs[1][0] === 5 && fs[0][0] === 3 && fs[2][0] === 9); }, [[1, 4], [3, 8], [3, 16], [5, 32]]);
          var sorted = fs.slice().sort(function (x, y) { return x[0] / x[1] - y[0] / y[1]; });
          var items = sorted.map(function (f) { return { id: f[0] + '_' + f[1], tex: dT(f[0], f[1]) }; });
          return P.order(r, 'A carpenter has drill bits in these sizes (in inches). Put them in order from smallest to largest.', items, { first: 'smallest', last: 'largest', why: function () { return 'Write them all with the same denominator (32nds) and compare the tops.'; } },
            'Write them all in 32nds: ' + fs.map(function (f) { return t(fT(f[0], f[1]) + (f[1] === 32 ? '' : '=' + fT(f[0] * 32 / f[1], 32))); }).join(', ') + '.<br>Order: ' + sorted.map(function (f) { return F(f[0], f[1]); }).join(', ') + ' in.',
            ['Change them all to 32nds (or to decimals).', 'A bigger denominator does not mean a bigger size.'], 'order drill bits');
        } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var v = find(function () { var f1 = proper(r, [4, 5]), g1 = r.int(4, 8), f2 = proper(r, [5, 10, 3]), g2 = r.int(4, 10); return [f1[0] * g1, f1[1] * g1, f2[0] * g2, f2[1] * g2]; },
            function (v) { return v[0] < v[2] && v[0] / v[1] > v[2] / v[3] + 0.03 && v[1] < 35 && v[3] < 35 && !(v[0] === 13 && v[1] === 20); }, [18, 24, 21, 30]);
          var d1 = trimZ(rStr(divStr(v[0], v[1], 8), 3)), d2 = trimZ(rStr(divStr(v[2], v[3], 8), 3));
          return P.mc(r, 'In Ms. Okafor’s class, ' + v[0] + ' of ' + v[1] + ' students passed the first-aid test. In Mr. Lam’s class, ' + v[2] + ' of ' + v[3] + ' students passed. Which class had the greater fraction of students pass?', [
            { html: 'Ms. Okafor’s class: ' + F(v[0], v[1]) + ' = ' + d1 + ', which is more than ' + F(v[2], v[3]) + ' = ' + d2 + '.', right: true },
            { html: 'Mr. Lam’s class: more students passed (' + v[2] + ' is more than ' + v[0] + ').', code: 'u1l2-more-made', why: 'Mr. Lam’s class is also bigger. Compare the <b>fractions</b> that passed, not the numbers.' },
            { html: 'They are the same: both classes had most students pass.', code: 'said-same', why: 'Change both fractions to decimals and compare them.' }],
            'Ms. Okafor: ' + t(fT(v[0], v[1]) + '=' + fT(red(v[0], v[1])[0], red(v[0], v[1])[1]) + '=' + d1) + '. Mr. Lam: ' + t(fT(v[2], v[3]) + '=' + fT(red(v[2], v[3])[0], red(v[2], v[3])[1]) + '=' + d2) + '.<br>' + t(d1 + '>' + d2) + ', so <b>Ms. Okafor’s</b> class had the greater fraction pass, even though fewer students passed.', ['Write each class as a fraction (passed out of total) and compare.'], 'which class');
        } }] },
      { num: '12', stem: 'Find each amount. Round money to the nearest cent.', parts: [
        { id: '12a', level: 'BEG', make: function (r) { var v = find(function () { var q = r.pick([3, 4]), k = r.int(4, 12); return [r.int(1, q - 1), q, q * k]; }, function (v) { return gcd(v[0], v[1]) === 1 && !(v[1] === 3 && v[2] === 45 && v[0] === 2) && !(v[1] === 4 && v[2] === 24); }, [2, 3, 27]); return ofPart(v[0], v[1], v[2]); } },
        { id: '12b', level: 'BEG', make: function (r) { var v = find(function () { var q = r.pick([5, 6]), k = r.int(4, 12); return [r.int(2, q - 1), q, q * k]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [3, 5, 40]); return ofPart(v[0], v[1], v[2]); } },
        { id: '12c', level: 'BEG', make: function (r) { var v = find(function () { var q = r.pick([6, 8, 9]), k = r.int(5, 15); return [r.int(2, q - 1), q, q * k]; }, function (v) { return gcd(v[0], v[1]) === 1 && !(v[1] === 8 && v[2] === 64); }, [5, 6, 90]); return ofPart(v[0], v[1], v[2]); } },
        { id: '12d', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([3, 7, 9]), 10, r.int(25, 95)]; }, function (v) { return v[2] % 10 !== 0 && !(v[0] === 3 && v[2] === 85); }, [7, 10, 85]); return ofPart(v[0], v[1], v[2], { money: true }); } },
        { id: '12e', level: 'EMG', make: function (r) { var v = find(function () { var q = r.pick([8, 7, 6]); return [r.int(1, q - 1), q, r.int(25, 95)]; }, function (v) { var x = divStr(v[0] * v[2] * 100, v[1] * 100, 6); return gcd(v[0], v[1]) === 1 && (trimZ(x).split('.')[1] || '').length > 2 && !(v[0] === 2 && v[1] === 7 && v[2] === 50); }, [3, 8, 59]); return ofPart(v[0], v[1], v[2], { money: true }); } }] },
      { num: '13', stem: function (s) { return 'Amira earns $' + s.P + ' every two weeks at her part-time job. She puts ' + F(1, s.q1) + ' of her pay into savings and spends ' + F(s.a2, s.q2) + ' of her pay on her car.'; },
        shared: function (r) { return find(function () { var q1 = r.pick([3, 4, 5]), q2 = r.pick([8, 6, 10]), a2 = r.int(1, q2 - 1), P0 = lcm(q1, q2) * r.int(4, 30); return { q1: q1, q2: q2, a2: a2, P: P0 }; }, function (s) { return gcd(s.a2, s.q2) === 1 && 1 / s.q1 + s.a2 / s.q2 < 0.9 && s.P >= 200 && s.P <= 900 && s.q1 !== s.q2 && gcd(s.P - s.P / s.q1 - s.P * s.a2 / s.q2, s.P) > 1; }, { q1: 4, q2: 8, a2: 3, P: 480 }); },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, s) { return ofPart(1, s.q1, s.P, { money: true, prompt: 'How much does she put into savings?', text: 'savings' }); } },
          { id: '13b', level: 'BEG', make: function (r, s) { return ofPart(s.a2, s.q2, s.P, { money: true, prompt: 'How much does she spend on her car?', text: 'car' }); } },
          { id: '13c', level: 'EMG', make: function (r, s) {
            var sv = s.P / s.q1, car = s.P * s.a2 / s.q2, left = s.P - sv - car;
            return decPart('How much of her pay is left?', String(left), 2, { money: true, text: 'left',
              solution: t(s.P + '-' + sv + '-' + car + '=\\$' + left + '.00'), hints: ['Subtract both amounts from her pay.'],
              diag: function (v) { if (Math.abs(v - (s.P - sv)) < 1e-9 || Math.abs(v - (s.P - car)) < 1e-9) return { code: 'u1l2-wrong-whole', hint: 'Take away <b>both</b> the savings and the car money.' }; if (Math.abs(v - (sv + car)) < 1e-9) return { code: 'u1l2-spent', hint: 'That’s what she saves and spends. What is <b>left</b>?' }; return null; } });
          } },
          { id: '13d', level: 'EMG', make: function (r, s) {
            var sv = s.P / s.q1, car = s.P * s.a2 / s.q2, left = s.P - sv - car, f = red(left, s.P), used = red(sv + car, s.P);
            return simpPart(left, s.P, { prompt: 'What fraction of her pay is left? Write it in simplest form.', pre: F(left, s.P) + '. ',
              diag: function (v) { if (ex.eq(v, used[0] / used[1])) return { code: 'u1l2-spent', hint: 'That’s the fraction she saves and spends. What fraction is <b>left</b>?' }; return null; } });
          } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var v = find(function () { var C = r.pick([16, 20, 24, 30, 40, 18]), f1 = proper(r, [2, 3, 4, 5, 6]), f2 = proper(r, [3, 4, 5]); return { C: C, f1: f1, f2: f2 }; }, function (v) { var w = v.C * v.f1[0] / v.f1[1]; return w % 1 === 0 && (w * v.f2[0]) % v.f2[1] === 0 && v.f1[0] / v.f1[1] >= 0.5; }, { C: 20, f1: [3, 4], f2: [2, 5] });
          var w = v.C * v.f1[0] / v.f1[1], used = w * v.f2[0] / v.f2[1], left = w - used;
          var p = P.number('A ' + v.C + ' L water jug for a soccer team is ' + F(v.f1[0], v.f1[1]) + ' full before practice. During practice, the team drinks ' + F(v.f2[0], v.f2[1]) + ' of the water that was in the jug. How many litres of water are left in the jug?', left, function (x) {
            if (x === used) return { code: 'u1l2-spent', hint: 'That’s the water they drank. How much is <b>left</b>?' };
            if (Math.abs(x - (v.C - v.C * v.f2[0] / v.f2[1])) < 1e-9 || Math.abs(x - (w - v.C * v.f2[0] / v.f2[1])) < 1e-9) return { code: 'u1l2-wrong-whole', hint: 'They drink ' + t(fT(v.f2[0], v.f2[1])) + ' of the water that was <b>in the jug</b> (' + t(w) + ' L), not of ' + t(v.C) + ' L.' };
            if (x === w) return { code: 'u1l2-spent', hint: 'That’s the water at the start. Now take away what they drank.' };
            return null;
          }, 'Water at the start: ' + t(fT(v.f1[0], v.f1[1]) + '\\text{ of }' + v.C + '=' + v.C + '\\div ' + v.f1[1] + '\\times ' + v.f1[0] + '=' + w) + ' L.<br>Water used: ' + t(fT(v.f2[0], v.f2[1]) + '\\text{ of }' + w + '=' + w + '\\div ' + v.f2[1] + '\\times ' + v.f2[0] + '=' + used) + ' L.<br>Water left: ' + t(w + '-' + used + '=' + left) + ' L.',
            ['First find how much water is in the jug at the start.', 'They drink a fraction of <b>that</b> water.'], 'jug', { after: 'L' });
          p.bad = [String(used), String(w)]; return p;
        } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var f = proper(r, [3, 4, 5, 7]), ks = r.shuffle([2, 3, 4, 5, 10]).slice(0, 3), j = r.int(1, 3);
          var opts = ks.map(function (k) { return { html: F(f[0] * k, f[1] * k), code: 'equiv-' + k, why: F(f[0] * k, f[1] * k) + ' is ' + F(f[0], f[1]) + ' with the top and bottom multiplied by ' + t(k) + ', so it <b>is</b> equivalent.' }; });
          opts.push({ html: F(f[0] + j, f[1] + j), right: true });
          return P.mc(r, 'Which fraction is <b>not</b> equivalent to ' + F(f[0], f[1]) + '?', opts, F(f[0] + j, f[1] + j) + ' comes from <b>adding</b> ' + t(j) + ' to the top and the bottom, which does not keep the amount the same. The others are ' + F(f[0], f[1]) + ' multiplied by ' + ks.map(function (k) { return t(k); }).join(', ') + '.', ['Which one can’t you get by multiplying the top and bottom by the same number?'], 'MC not equivalent');
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var pool = [[5, 8], [3, 5], [7, 12], [2, 3], [4, 7], [5, 9], [7, 10], [3, 4], [5, 7], [9, 16], [11, 20], [7, 11], [8, 13], [11, 18], [13, 20]];
          var fs = find(function () { return r.sample(pool, 4); }, function (fs) { var vals = fs.map(function (f) { return f[0] / f[1]; }); var big = fs.reduce(function (m, f) { return f[1] > m[1] ? f : m; }); var mx = Math.max.apply(null, vals); return vals.every(function (v, i) { return vals.indexOf(v) === i; }) && big[0] / big[1] < mx && mx - Math.min.apply(null, vals) < 0.2 && !fs.some(function (f) { return f[0] === 7 && f[1] === 11; }); }, [[5, 8], [3, 5], [7, 12], [2, 3]]);
          var mx = fs.reduce(function (m, f) { return f[0] / f[1] > m[0] / m[1] ? f : m; }), big = fs.reduce(function (m, f) { return f[1] > m[1] ? f : m; });
          var opts = fs.map(function (f) { return { html: F(f[0], f[1]), right: f === mx, code: f === big ? 'u1l2-bigger-numbers' : 'not-largest', why: f === mx ? null : (f === big ? 'Bigger numbers don’t make a bigger fraction. ' : '') + 'Change each one to a decimal and compare.' }; });
          return P.mc(r, 'Which fraction is the largest?', opts, 'As decimals: ' + fs.map(function (f) { return t(fT(f[0], f[1]) + (isTerm(f[1]) ? '=' : '\\approx ') + trimZ(rStr(divStr(f[0], f[1], 8), 3))); }).join(', ') + '.<br>The largest is ' + F(mx[0], mx[1]) + '. (' + F(big[0], big[1]) + ' has the biggest numbers but is not the largest.)', ['Change each fraction to a decimal (top ÷ bottom).'], 'MC largest', true);
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          var v = find(function () { var q = r.pick([4, 8, 8, 5, 3]), C = q * r.int(2, 6); return [r.int(1, q - 1), q, C]; }, function (v) { return gcd(v[0], v[1]) === 1 && v[2] <= 50; }, [5, 8, 16]);
          return ofPart(v[0], v[1], v[2], { nr: true, prompt: 'Jordan’s phone plan has ' + v[2] + ' GB of data each month. He has used ' + F(v[0], v[1]) + ' of it. How many gigabytes has he used?', unit: 'GB', text: 'NR data used' });
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'BEG', make: function (r) {
          var f = find(function () { return proper(r, [16, 16, 32, 40, 7, 9, 11, 12]); }, function (f) { var x = divStr(f[0], f[1], 8); return (trimZ(x).split('.')[1] || '').length > 2; }, [9, 16]), xs = divStr(f[0], f[1], 10);
          return decPart('Write ' + F(f[0], f[1]) + ' as a decimal, rounded to the nearest hundredth.', xs, 2, { nr: true, text: 'NR fraction to decimal',
            solution: t(f[0] + '\\div ' + f[1] + '=' + trimZ(xs.slice(0, 7)) + (isTerm(f[1]) && trimZ(xs).length <= 7 ? '' : '\\ldots') + '\\approx ' + rStr(xs, 2)), hints: ['Top ÷ bottom, then round to 2 decimal places.'],
            diag: function (v) { if (near(v, f[1] / f[0])) return { code: 'u1l2-div-way', hint: 'Divide the <b>top</b> by the bottom.' }; return null; } });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Write the fraction of each picture that is shaded, and the fraction that is not shaded.', parts: [
        { id: 'e1a', level: 'LIM', make: function (r) { var n = r.pick([6, 8, 10, 10]), k = r.int(1, n - 1); return twoShaded(bar(n, k, 280), k, n); } },
        { id: 'e1b', level: 'LIM', make: function (r) { var n = r.pick([3, 5, 5, 6, 8]), k = r.int(1, n - 1); return twoShaded(pie(n, k), k, n); } }] },
      { num: '2', stem: 'Find the missing number.', parts: [
        { id: 'e2a', level: 'LIM', make: function (r) { var f = find(function () { return proper(r, [5, 7, 9]); }, function (f) { return f[0] > 1; }, [4, 7]); return missingPart(f[0], f[1], null, f[1] * r.int(2, 4)); } },
        { id: 'e2b', level: 'BEG', make: function (r) { var f = proper(r, [3, 4, 5]), g = r.int(2, 4); return missingPart(f[0] * g, f[1] * g, f[0], null); } },
        { id: 'e2c', level: 'BEG', make: function (r) { var f = find(function () { return proper(r, [12, 11, 9, 8]); }, function (f) { return f[0] > 1; }, [5, 12]), k = r.int(3, 6); return missingPart(f[0], f[1], f[0] * k, null); } },
        { id: 'e2d', level: 'BEG', make: function (r) { var f = proper(r, [4, 5, 6]), g = r.int(3, 6); return missingPart(f[0] * g, f[1] * g, null, f[1]); } }] },
      { num: '3', stem: 'Find the greatest common factor (GCF) of each pair of numbers.', parts: [0, 1, 2].map(function (k) {
        return { id: 'e3' + 'abc'.charAt(k), level: k ? 'BEG' : 'LIM', make: function (r) {
          var v = find(function () { var g = [r.pick([3, 5, 4]), r.pick([8, 6, 4]), r.pick([6, 7, 9])][k], a = r.int(2, 7), b = r.int(2, 7); return [g * a, g * b, g, a, b]; }, function (v) { return v[3] < v[4] && gcd(v[3], v[4]) === 1 && v[1] <= 64; }, [[15, 25, 5, 3, 5], [24, 32, 8, 3, 4], [18, 42, 6, 3, 7]][k]);
          var A = v[0], B = v[1], g = v[2], dA = divisors(A), dB = divisors(B);
          var p = P.number(t(A) + ' and ' + t(B), g, function (x) {
            if (A % x === 0 && B % x === 0) return { code: 'u1l2-not-gcf', hint: t(x) + ' is a common factor, but not the <b>greatest</b>. Is there a bigger number that divides both?' };
            if (x % A === 0 && x % B === 0) return { code: 'u1l2-not-common', hint: t(x) + ' is a multiple of both, not a factor. A factor divides <b>into</b> the number.' };
            if (A % x === 0 || B % x === 0) return { code: 'u1l2-not-common', hint: t(x) + ' is a factor of only one of the numbers. The GCF must divide <b>both</b>.' };
            return null;
          }, t(A) + ': ' + dA.map(function (x) { return x === g ? '<b>' + x + '</b>' : x; }).join(', ') + '<br>' + t(B) + ': ' + dB.map(function (x) { return x === g ? '<b>' + x + '</b>' : x; }).join(', ') + '<br>GCF ' + t('=' + g) + '.', ['List the factors of each number.', 'Find the biggest number that is in both lists.'], 'GCF ' + A + ',' + B, { before: 'GCF ' + t('=') });
          p.bad = divisors(g).filter(function (x) { return x !== g && x > 1; }).map(String).slice(-1).concat([String(lcm(A, B))]);
          return p;
        } };
      }) },
      { num: '4', stem: 'Write each fraction in simplest form.', parts: [
        { id: 'e4a', level: 'LIM', make: function (r) { var v = scaled(r, [5, 7, 3], [2], notEx); return simpPart(v[0], v[1]); } },
        { id: 'e4b', level: 'BEG', make: function (r) { var v = scaled(r, [3, 7, 8], [5], notEx); return simpPart(v[0], v[1]); } },
        { id: 'e4c', level: 'BEG', make: function (r) { var v = scaled(r, [3, 4, 5], [9], notEx); return simpPart(v[0], v[1]); } },
        { id: 'e4d', level: 'EMG', make: function (r) { var v = scaled(r, [3, 4, 5], [16, 12], notEx); return simpPart(v[0], v[1]); } },
        { id: 'e4e', level: 'EMG', make: function (r) { var v = scaled(r, [5, 4, 7], [15], notEx); return simpPart(v[0], v[1]); } },
        { id: 'e4f', level: 'BEG', make: function (r) { var x = find(function () { return r.int(2, 24) * 4; }, function (x) { return x < 100 && x % 5 !== 0; }, 44); return simpPart(x, 100); } }] },
      { num: '5', stem: 'Change each fraction to a decimal (round to the nearest thousandth if it repeats), and each decimal to a fraction in simplest form.', parts: [
        { id: 'e5a', level: 'LIM', make: function (r) { return toDecPart(r.pick([1, 7, 5]), 8); } },
        { id: 'e5b', level: 'LIM', make: function (r) { return toDecPart(r.pick([9, 11, 13, 17, 19, 3]), 20); } },
        { id: 'e5c', level: 'BEG', make: function (r) { var f = r.pick([[5, 6], [1, 6], [2, 3], [1, 3], [7, 9], [5, 12]]); return toDecPart(f[0], f[1]); } },
        { id: 'e5d', level: 'BEG', make: function (r) { return toFracPart(r.pick(['0.65', '0.15', '0.85', '0.55', '0.95', '0.05'])); } },
        { id: 'e5e', level: 'LIM', make: function (r) { return toFracPart(r.pick(['0.25', '0.75', '0.5', '0.2'])); } }] },
      { num: '6', stem: 'Write <, > or = in each box. Show your method.', parts: [
        { id: 'e6a', level: 'BEG', make: function (r) { var v = find(function () { var f = proper(r, [6, 4, 10]), g = proper(r, [9, 6, 15, 8]); return [f[0], f[1], g[0], g[1]]; }, function (v) { return v[1] !== v[3] && lcm(v[1], v[3]) <= 30 && v[0] * v[3] !== v[2] * v[1] && Math.abs(v[0] / v[1] - v[2] / v[3]) < 0.15; }, [5, 6, 7, 9]); return cmpPart(r, v[0], v[1], v[2], v[3], 'lcd'); } },
        { id: 'e6b', level: 'BEG', make: function (r) { var v = find(function () { var f = proper(r, [8, 4]), g = proper(r, [5, 10]); return [f[0], f[1], g[0], g[1]]; }, function (v) { return v[0] * v[3] !== v[2] * v[1] && Math.abs(v[0] / v[1] - v[2] / v[3]) < 0.1; }, [3, 8, 2, 5]); return cmpPart(r, v[0], v[1], v[2], v[3], 'dec'); } },
        { id: 'e6c', level: 'BEG', make: function (r) { var f = proper(r, [3, 4, 5, 8]), g = r.int(2, 3); return cmpPart(r, f[0] * g, f[1] * g, f[0], f[1], 'same'); } }] },
      { num: '7', stem: 'Find each amount.', parts: [
        { id: 'e7a', level: 'LIM', make: function (r) { var q = r.pick([3, 4]); return ofPart(q - 1, q, q * r.int(5, 20)); } },
        { id: 'e7b', level: 'BEG', make: function (r) { var v = find(function () { var q = r.pick([9, 7, 6]); return [r.int(2, q - 1), q, q * r.int(3, 9)]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [2, 9, 54]); return ofPart(v[0], v[1], v[2]); } },
        { id: 'e7c', level: 'BEG', make: function (r) { var v = find(function () { var q = r.pick([5, 4]); return [r.int(1, q - 1), q, q * r.int(4, 15)]; }, function (v) { return gcd(v[0], v[1]) === 1; }, [4, 5, 35]); return ofPart(v[0], v[1], v[2], { money: true }); } }] },
      { num: '8', section: 'B. Applying', stem: function (s) { return 'A community theatre has ' + s.N + ' seats. For Friday’s show, ' + s.k + ' tickets were sold.'; },
        shared: function (r) { return find(function () { var N = r.pick([120, 150, 180, 200, 240, 250, 300]), f = proper(r, [3, 4, 5, 6, 8, 10]); return { N: N, k: N * f[0] / f[1] }; }, function (s) { return s.k % 1 === 0 && s.k / s.N >= 0.5; }, { N: 240, k: 180 }); },
        parts: [
          { id: 'e8a', level: 'BEG', make: function (r, s) { return simpPart(s.k, s.N, { prompt: 'What fraction of the seats were sold? Write it in simplest form.', pre: F(s.k, s.N) + '. ', diag: function (v) { if (ex.eq(v, (s.N - s.k) / s.N)) return { code: 'u1l2-unshaded', hint: 'That’s the fraction that were <b>empty</b>.' }; return null; } }); } },
          { id: 'e8b', level: 'BEG', make: function (r, s) { var L = s.N - s.k; return simpPart(L, s.N, { prompt: 'What fraction of the seats were empty?', pre: t(s.N + '-' + s.k + '=' + L) + ' empty: ' + F(L, s.N) + '. ', diag: function (v) { if (ex.eq(v, s.k / s.N)) return { code: 'u1l2-unshaded', hint: 'That’s the fraction that were <b>sold</b>.' }; return null; } }); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'EMG', make: function (r) {
          var names = ['Hawks', 'Bears', 'Lynx'];
          var v = find(function () { return [0, 1, 2].map(function () { var f = proper(r, [5, 4, 3, 5]), g = r.int(3, 6); return [f[0] * g, f[1] * g]; }); }, function (v) {
            var vals = v.map(function (x) { return x[0] / x[1]; }), mx = Math.max.apply(null, vals), wins = v.map(function (x) { return x[0]; }), mostW = wins.indexOf(Math.max.apply(null, wins));
            var nBest = vals.filter(function (x) { return Math.abs(x - mx) < 1e-9; }).length;
            return nBest <= 2 && Math.abs(vals[mostW] - mx) > 1e-9 && wins[0] !== wins[1] && wins[1] !== wins[2] && wins[0] !== wins[2] && v.every(function (x) { return x[1] <= 30; });
          }, [[12, 20], [14, 25], [9, 15]]);
          var vals = v.map(function (x) { return x[0] / x[1]; }), mx = Math.max.apply(null, vals), best = [0, 1, 2].filter(function (i) { return Math.abs(vals[i] - mx) < 1e-9; });
          var wins = v.map(function (x) { return x[0]; }), mostW = wins.indexOf(Math.max.apply(null, wins));
          var rank = [0, 1, 2].slice().sort(function (a, b) { return vals[b] - vals[a]; }), pair = best.length === 2 ? best : [rank[0], rank[1]];
          var opts = [0, 1, 2].map(function (i) { return { html: 'The ' + names[i] + (i === mostW ? ' — they won the most games.' : ''), right: best.length === 1 && best[0] === i, code: i === mostW ? 'u1l2-more-made' : 'team-' + i, why: i === mostW ? 'They won the most games, but they also played more. Compare the <b>fraction</b> of games won.' : 'Change each record to a decimal and compare.' }; });
          opts.push({ html: 'The ' + names[pair[0]] + ' and the ' + names[pair[1]] + ' are tied for the best record.', right: best.length === 2, code: 'tie', why: best.length === 2 ? null : 'Check the decimals: are they really equal?' });
          var dec = v.map(function (x, i) { return names[i] + ': ' + t(fT(x[0], x[1]) + (isTerm(x[1]) ? '=' : '\\approx ') + trimZ(rStr(divStr(x[0], x[1], 8), 3))); });
          return P.mc(r, 'Three high school soccer teams finished the season with these records: the Hawks won ' + v[0][0] + ' of ' + v[0][1] + ' games, the Bears won ' + v[1][0] + ' of ' + v[1][1] + ' games, and the Lynx won ' + v[2][0] + ' of ' + v[2][1] + ' games. Which team had the best record?', opts,
            dec.join('; ') + '.<br>' + (best.length === 2 ? 'The ' + names[best[0]] + ' and the ' + names[best[1]] + ' are <b>tied</b> with the best record.' : 'The <b>' + names[best[0]] + '</b> have the best record.') + ' The ' + names[mostW] + ' won the most games but played more.', ['Write each record as a fraction (won out of played), then change it to a decimal.'], 'best record', true);
        } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var v = find(function () { return [proper(r, [3, 4, 5, 6, 8]), proper(r, [2, 3, 4, 6, 8])]; }, function (v) { var d = v[1][0] / v[1][1] - v[0][0] / v[0][1]; return v[0][1] !== v[1][1] && Math.abs(d) > 0.01 && Math.abs(d) < 0.2 && lcm(v[0][1], v[1][1]) <= 24 && v[0][0] / v[0][1] >= 0.5 && v[1][0] / v[1][1] >= 0.4; }, [[3, 4], [2, 3]]);
          var need = v[0], has = v[1], D = lcm(need[1], has[1]), n1 = need[0] * D / need[1], h1 = has[0] * D / has[1], diff = red(Math.abs(n1 - h1), D), enough = h1 >= n1;
          var across = red(Math.abs(need[0] - has[0]) || 1, Math.abs(need[1] - has[1]) || 1);
          var opts = [{ html: enough ? 'Yes — he has ' + F(diff[0], diff[1]) + ' cup extra.' : 'No — he is ' + F(diff[0], diff[1]) + ' cup short.', right: true },
            { html: enough ? 'No — he is ' + F(diff[0], diff[1]) + ' cup short.' : 'Yes — he has ' + F(diff[0], diff[1]) + ' cup extra.', code: 'said-' + (enough ? 'no' : 'yes'), why: 'Write both with the denominator ' + t(D) + ' and compare the tops.' },
            { html: (has[1] > need[1] ? 'No' : 'Yes') + ' — ' + F(has[0], has[1]) + (has[1] > need[1] ? ' has a bigger denominator, so it is less.' : ' has a smaller denominator, so it is more.'), code: 'u1l2-bigger-numbers', why: 'The denominator alone doesn’t decide it. Use a common denominator.' }];
          if (!(across[0] === diff[0] && across[1] === diff[1])) opts.push({ html: (enough ? 'Yes — he has ' : 'No — he is ') + F(across[0], across[1]) + ' cup ' + (enough ? 'extra.' : 'short.'), code: 'u1l2-short-wrong', why: 'You can’t subtract the tops and the bottoms straight across. Use a common denominator first.' });
          return P.mc(r, 'A muffin recipe needs ' + F(need[0], need[1]) + ' cup of sugar. Liam has ' + F(has[0], has[1]) + ' cup of sugar left. Does he have enough?', opts,
            'Common denominator ' + t(D) + ': ' + t(fT(need[0], need[1]) + '=' + fT(n1, D)) + ' and ' + t(fT(has[0], has[1]) + '=' + fT(h1, D)) + '. ' + t(fT(h1, D) + (enough ? '>' : '<') + fT(n1, D)) + '.<br>' + (enough ? 'Yes. He has ' + F(diff[0], diff[1]) + ' cup extra.' : 'No. He is ' + F(diff[0], diff[1]) + ' cup short.'), ['Write both fractions with a common denominator, then compare.'], 'enough sugar');
        } }] },
      { num: '11', stem: function (s) { return 'Hana’s phone plan has ' + s.C + ' GB of data a month. She has used ' + F(s.a, s.b) + ' of it.'; },
        shared: function (r) { return find(function () { var b = r.pick([8, 4, 5]); return { b: b, a: r.int(1, b - 1), C: r.pick([10, 12, 15, 6, 20, 25]) }; }, function (s) { var u = s.C * s.a / s.b; return gcd(s.a, s.b) === 1 && u % 1 !== 0 && (u * 100) % 1 === 0 && !(s.C === 16 && s.b === 8); }, { b: 8, a: 5, C: 12 }); },
        parts: [
          { id: 'e11a', level: 'BEG', make: function (r, s) { return ofPart(s.a, s.b, s.C, { prompt: 'How many gigabytes has she used?', after: 'GB', unitTex: 'GB', text: 'data used' }); } },
          { id: 'e11b', level: 'EMG', make: function (r, s) { var u = s.C * s.a / s.b, L = s.C - u; return decPart('How many gigabytes does she have left?', trimZ(String(Math.round(L * 1000) / 1000)), 3, { after: 'GB', unit: 'GB', text: 'data left', solution: t(s.C + '-' + u + '=' + L) + ' GB', hints: ['Subtract what she used from ' + s.C + ' GB.'], diag: function (x) { if (Math.abs(x - u) < 1e-9) return { code: 'u1l2-spent', hint: 'That’s what she has <b>used</b>. How much is left?' }; return null; } }); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e12', level: 'BEG', make: function (r) {
          var v = find(function () { var b = r.pick([5, 4, 3]), a = r.int(2, b - 1); return [a, b, r.int(3, 20) * a * b]; }, function (v) { return gcd(v[0], v[1]) === 1 && v[2] <= 150; }, [3, 5, 45]), a = v[0], b = v[1], Pr = v[2];
          return P.mc(r, 'A pair of runners costs $' + Pr + '. Mateo has saved ' + F(a, b) + ' of the price. How much has he saved?', [
            { html: M(Pr / b * a * 100), right: true },
            { html: M(Pr / a * b * 100), code: 'u1l2-of-flip', why: 'Divide by the <b>bottom</b> number (' + t(b) + ') and multiply by the top (' + t(a) + '). He saved less than the price.' },
            { html: M(Pr / a * 100), code: 'u1l2-of-flip', why: 'Divide by the bottom number, ' + t(b) + ', then multiply by ' + t(a) + '.' },
            { html: M(Pr / b * 100), code: 'u1l2-of-div-only', why: 'That’s ' + F(1, b) + ' of the price. Multiply by ' + t(a) + ' too.' }],
            t(Pr + '\\div ' + b + '\\times ' + a + '=\\$' + cs(Pr / b * a * 100)) + '.', ['Divide by the bottom, multiply by the top.'], 'MC fraction of price');
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e13', level: 'BEG', make: function (r) {
          var v = find(function () { var q = r.pick([4, 5, 20, 25, 10, 2]), p = r.int(1, q - 1), g = r.int(2, 8); return [p * g, q * g, p, q]; }, function (v) { return gcd(v[2], v[3]) === 1 && 100 % v[1] !== 0 && v[1] <= 40; }, [18, 24, 3, 4]);
          var ans = v[2] * 100 / v[3];
          var p = P.nr('Sienna got ' + v[0] + ' out of ' + v[1] + ' on a quiz. Her mark is equivalent to ' + t('\\frac{\\square}{100}') + '. What number goes in the box?', ans, function (x) {
            if (x === v[0] + (100 - v[1])) return { code: 'u1l2-added', hint: 'Adding the same number to the top and bottom doesn’t keep fractions equal. Simplify first, then multiply up to 100.' };
            if (Math.abs(x - v[0] / v[1]) < 0.01) return { code: 'u1l2-as-decimal', hint: 'That’s the decimal. The box is the <b>top</b> of a fraction out of 100.' };
            return null;
          }, t(fT(v[0], v[1]) + '=' + fT(v[2], v[3])) + ' (divide by ' + t(v[0] / v[2]) + '), and ' + t(fT(v[2], v[3]) + '=\\frac{' + v[2] + '\\times ' + 100 / v[3] + '}{' + v[3] + '\\times ' + 100 / v[3] + '}=' + fT(ans, 100)) + '.', ['Simplify first, then multiply the top and bottom to make 100.'], 'NR out of 100');
          p.bad = [String(v[0] + 100 - v[1])];
          return p;
        } }] },
      { num: '14', section: 'C. Stretch', stem: function (s) { return 'Marcus gets a paycheque of $' + s.P + '. He spends ' + F(s.a, s.b) + ' of it on groceries. Then he saves ' + F(1, s.c) + ' of what is left.'; },
        shared: function (r) { return find(function () { var b = r.pick([5, 4, 3]), a = r.int(1, b - 1), c = r.pick([3, 4, 2]); return { a: a, b: b, c: c, P: b * c * r.int(4, 30) }; }, function (s) { return gcd(s.a, s.b) === 1 && s.P >= 150 && s.P <= 800 && s.b !== s.c; }, { a: 2, b: 5, c: 3, P: 350 }); },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, s) {
            var gro = s.P / s.b * s.a, left = s.P - gro, sv = left / s.c;
            return decPart('How much does he save?', String(sv), 2, { money: true, text: 'Marcus saves', solution: 'Groceries: ' + t(s.P + '\\div ' + s.b + '\\times ' + s.a + '=\\$' + gro) + '. Left: ' + t(s.P + '-' + gro + '=\\$' + left) + '.<br>Saved: ' + t(left + '\\div ' + s.c + '=\\$' + cs(sv * 100)) + '.', hints: ['First find how much is left after groceries.', 'He saves ' + t(fT(1, s.c)) + ' of <b>what is left</b>.'],
              diag: function (v) { if (near(v, s.P / s.c)) return { code: 'u1l2-wrong-whole', hint: 'He saves ' + t(fT(1, s.c)) + ' of what is <b>left</b> after groceries, not of the whole paycheque.' }; if (near(v, left)) return { code: 'u1l2-spent', hint: 'That’s what is left after groceries. He saves ' + t(fT(1, s.c)) + ' of it.' }; if (near(v, gro)) return { code: 'u1l2-spent', hint: 'That’s the grocery money.' }; return null; } });
          } },
          { id: 'e14b', level: 'PRG', make: function (r, s) {
            var gro = s.P / s.b * s.a, sv = (s.P - gro) / s.c;
            return simpPart(sv, s.P, { prompt: 'What fraction of the whole paycheque does he save? Write it in simplest form.', pre: F(sv, s.P) + '. ', diag: function (v) { if (ex.eq(v, 1 / s.c)) return { code: 'u1l2-wrong-whole', hint: t(fT(1, s.c)) + ' is the fraction of what was <b>left</b>. Compare his savings with the <b>whole</b> paycheque.' }; return null; } });
          } }] },
      { num: '15', stem: '', parts: [
        { id: 'e15', level: 'PRG', make: function (r) {
          var v = find(function () { return [proper(r, [3, 4, 5, 6, 7]), proper(r, [3, 4, 5, 6, 7])]; }, function (v) { var D = lcm(v[0][1], v[1][1]); return v[0][1] !== v[1][1] && v[1][0] * D / v[1][1] - v[0][0] * D / v[0][1] === 1; }, [[3, 5], [2, 3]]);
          var a = v[0], b = v[1], D = lcm(a[1], b[1]), lo = a[0] / a[1], hi = b[0] / b[1], mid = [a[0] * 2 * D / a[1] + 1, 2 * D];
          return { prompt: 'Find a fraction that is between ' + F(a[0], a[1]) + ' and ' + F(b[0], b[1]) + '.', input: { type: 'math', keys: 'fraction' }, key: fT(mid[0], mid[1]), answer: t(fT(mid[0], mid[1])) + ' (other answers are possible)',
            check: function (resp) {
              var x = K.read(resp); if (x.res) return x.res;
              var pf = ex.plainFraction(x.ast); if (!pf) return form('u1l2-one-fraction', 'Write it as a fraction (top number, fraction key, bottom number).');
              var w = x.val;
              if (ex.eq(w, lo) || ex.eq(w, hi)) return wrong('u1l2-endpoint', 'That’s equal to one of the two fractions. Find one strictly <b>between</b> them.');
              if (w > lo && w < hi) return ok();
              return wrong('u1l2-not-between', t(fT(pf[0], pf[1])) + ' is ' + (w < lo ? 'less than ' + t(fT(a[0], a[1])) : 'more than ' + t(fT(b[0], b[1]))) + '. Use a common denominator: ' + t(fT(a[0] * D / a[1], D)) + ' and ' + t(fT(b[0] * D / b[1], D)) + '. If no whole number fits between the tops, double the top and bottom of both.');
            },
            solution: 'Common denominator ' + t(D) + ': ' + t(fT(a[0] * D / a[1], D)) + ' and ' + t(fT(b[0] * D / b[1], D)) + '. No whole number fits between ' + t(a[0] * D / a[1]) + ' and ' + t(b[0] * D / b[1]) + ', so double: ' + t(fT(a[0] * 2 * D / a[1], 2 * D)) + ' and ' + t(fT(b[0] * 2 * D / b[1], 2 * D)) + '.<br>' + t(fT(mid[0], mid[1])) + ' is between them. (Check: ' + t(trimZ(rStr(divStr(a[0], a[1], 8), 3)) + '<' + trimZ(rStr(divStr(mid[0], mid[1], 8), 3)) + '<' + trimZ(rStr(divStr(b[0], b[1], 8), 3))) + '.)',
            hints: ['Write both fractions with a common denominator.', 'If no whole number fits between the tops, double the top and bottom of both fractions.'], text: 'fraction between', bad: [fT(a[0], a[1]), fT(b[0], b[1])], good: [fT(mid[0], mid[1])] };
        } }] },
      { num: '16', stem: '', parts: [
        { id: 'e16', level: 'EMG', make: function (r) {
          var n = r.int(3, 11), A = [n, n + 1], B = [n + 1, n + 2];
          if (r.chance(0.5)) { var tmp = A; A = B; B = tmp; }
          var big = A[0] / A[1] > B[0] / B[1] ? A : B, small = big === A ? B : A;
          return P.mc(r, 'Without a calculator, decide which is bigger, ' + F(A[0], A[1]) + ' or ' + F(B[0], B[1]) + '. (Hint: how much is each one missing to make 1 whole?)', [
            { html: F(big[0], big[1]) + ' — it is missing only ' + F(1, big[1]) + ', a smaller piece than ' + F(1, small[1]) + '.', right: true },
            { html: F(small[0], small[1]) + ' — ' + ordinal(small[1]) + ' are bigger pieces than ' + ordinal(big[1]) + '.', code: 'said-small', why: 'Bigger pieces are missing from ' + F(small[0], small[1]) + ', so it is further from 1 whole.' },
            { html: 'They are equal — each is one piece short of a whole.', code: 'said-equal', why: 'Each is one piece short, but the pieces are different sizes: ' + F(1, small[1]) + ' is bigger than ' + F(1, big[1]) + '.' },
            { html: F(big[0], big[1]) + ' — its numbers are bigger.', code: 'u1l2-bigger-numbers', why: 'Right fraction, wrong reason: bigger numbers don’t always mean a bigger fraction. Look at the missing piece.' }],
            F(small[0], small[1]) + ' is missing ' + F(1, small[1]) + '; ' + F(big[0], big[1]) + ' is missing ' + F(1, big[1]) + '.<br>' + F(1, big[1]) + ' is a smaller piece than ' + F(1, small[1]) + ', so ' + F(big[0], big[1]) + ' is closer to 1: <b>' + F(big[0], big[1]) + ' is bigger</b>. (Check: ' + t(trimZ(rStr(divStr(small[0], small[1], 8), 3)) + '<' + trimZ(rStr(divStr(big[0], big[1], 8), 3))) + '.)', ['How much is each fraction missing to make 1 whole? Which missing piece is smaller?'], 'missing piece');
        } }] }
    ]
  });

  /* both the shaded and the not-shaded fraction */
  function twoShaded(pic, k, n) {
    var lab = ['Shaded', 'Not shaded'], T = [[k, n], [n - k, n]];
    var chks = T.map(function (f, i) { return fracChk(f, { any: true, diag: function (v) { if (ex.eq(v, T[1 - i][0] / n)) return { code: 'u1l2-unshaded', hint: 'Those are swapped: check which parts are shaded.' }; if (ex.eq(v, f[0] / T[1 - i][0])) return { code: 'u1l2-part-part', hint: 'The bottom number is <b>all</b> the parts.' }; return null; } }); });
    return P.fields(pic, lab.map(function (l) { return { name: l, label: l + ':', mode: 'math', keys: 'fraction' }; }), chks, [fT(k, n), fT(n - k, n)], 'Shaded ' + F(k, n) + ', not shaded ' + F(n - k, n),
      t(n) + ' equal parts: ' + t(k) + ' shaded, ' + t(n - k) + ' not shaded. ' + t(fT(k, n) + '+' + fT(n - k, n) + '=' + fT(n, n) + '=1') + ' whole.', ['Bottom: all the parts. Top: the parts you are counting.'], 'shaded and not ' + k + '/' + n);
  }
  function ordinal(n) { return ({ 2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths', 7: 'sevenths', 8: 'eighths', 9: 'ninths', 10: 'tenths', 11: 'elevenths', 12: 'twelfths', 13: 'thirteenths' })[n] || n + 'ths'; }
})(window);
