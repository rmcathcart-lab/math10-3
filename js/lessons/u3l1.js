/* Math 10-3 · Unit 3 · Lesson 1 — Fractions Refresher: Mixed Numbers (REV: refresher)
 * Assignment 1 (u3_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u3_ep01.tex: A Skills 1–6, B Applying 7–12,
 * C Stretch 13–14). Every part is a generator: the same kind of fraction (a denominator that is a multiple of the other,
 * denominators with no common factor, an answer that simplifies, a sum that needs regrouping, a subtraction that needs
 * borrowing, a whole number minus a mixed number, a product that comes out whole…) as the booklet item, new numbers
 * around the booklet's (the booklet's own numbers are among the possible values; the lesson's worked-example numbers
 * are left out). Calculator allowed (the TI-30XIIS A b/c key works fractions too).
 * Answers: mixed numbers and fractions are typed with the mixed-number keypad (n a/b and a/b keys; "2 3/4" typed on a
 * keyboard works too). A unit typed after the answer is ignored. "Simplest form" answers nudge an unsimplified
 * fraction, an improper fraction where a mixed number is asked (and the reverse), a fraction part that still needs
 * regrouping (8 11/8), "3 0/9", or a decimal of the right value (none of these use a try). Recognised mistakes get their
 * own hint: adding the denominators, adding without a common denominator, regrouping but dropping the new whole,
 * flipping the fractions instead of borrowing, not borrowing from a whole number, borrowing without taking 1 off the
 * whole number, multiplying the wholes and the fractions separately, multiplying only the whole part, the remainder
 * put over the quotient, the usual slips changing a mixed number to an improper fraction, losing the whole number
 * when simplifying, the digits of a fraction written as a decimal.
 * Conversions: bar and circle pictures are drawn (SVG); "shade the bars to show 1 5/8" → how many parts you shade; the
 * recipe table → the fill-in table (given column shown, the blanks as boxes); "deeper or shallower? by how much?" → a
 * choice plus a mixed-number box; "explain" / "use an estimate to show" / "is it enough?" → multiple choice whose
 * options are reasons (one right). Outcome REV (refresher). Levels: LIM BEG EMG PRG ADV MAS.
 *
 * Shared kit for later Unit 3 lessons: HW.u3len (exact fractions, the mixed-number reader/checker with the
 * simplest-form nudges, feet-and-inches in two boxes, worked steps and typical wrong values for + − ×, bar/circle
 * pictures, the 'u3mixed' keypad). See the comment at "HW.u3len" below. Needs HW.pctKit (u1l7.js) for the table part. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit;

  /* ================= the keypad ================= */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u3mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u3mixed = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u3mixed = ['Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then the top and bottom numbers. Fraction: type the top number, press <b><sup>a</sup>⁄<sub>b</sub></b>, then the bottom number. Press <b>▶</b> to move on.',
      'Type a mixed number as <code>2 3/4</code> (a space after the whole number) and a fraction as <code>11/4</code>.'];
  }

  /* ================= HW.u3len =================
   * Rationals are [p, q] in lowest terms with q > 0 (R(p, q) reduces). A whole number may be given as a number.
   *   gcd, lcm, R, Q(x) (number | [p,q] | {w,n,d} → [p,q]), mx(w, n, d), add, sub, mul, div, eq, lt, val, parts(fr) → {w,n,d}
   *   mT(fr) "2\frac{3}{4}" (mixed, simplest)   dmT(fr) the same with \dfrac (prompts)   fT / dfT improper ("\frac{11}{4}")
   *   rawT(w, n, d [, big]) exactly as written ("8\frac{11}{8}", "7\frac{5}{5}")   plainMix(fr) "2 3/4"
   *   readMix(resp) → { kind: 'int'|'frac'|'mixed'|'dec'|'expr', v: [p,q] (exact; expr: a number in .x), w, n, d, unit }
   *     or { code: 'empty'|'comma'|'notnumber' }   (MathLive forms \frac34, 2\frac{3}{4}, plain "2 3/4", "11/4", "3.75";
   *     a unit after the answer is noted in .unit and ignored)
   *   mixChk(fr, o)  o.want 'mixed' (default: a mixed or whole number in simplest form; a proper fraction when < 1) |
   *     'improper' | 'any' (any simplest form); o.lowest (default true); o.bad [[fr, code, hint]]; o.diag(v, a) → {code, hint};
   *     o.what ('mixed number' wording)
   *   decChk(x, o)  a decimal answer: exact (o.dp null: every digit, a rounded one gets a nudge) or o.dp places
   *     (K.approx nudges); a fraction of the right value gets a nudge; o.bad [[number, code, hint]]
   *   numChk(x, o)  a whole/plain number with o.bad [[number, code, hint]] (unit ignored)
   *   ftIn(fr) → { ft, inch: [p,q] };  ftInT(fr) "5\text{ ft }3\frac{1}{2}\text{ in}";  ftInChk(totalInches, o) for
   *     two boxes [feet, inches] (inches may be a mixed number; ≥ 12 in gets a regroup nudge; 10 in per foot gets a hint)
   *   part builders (each returns a part: {prompt, input, check, key, answer, solution, hints, text, bad, good}):
   *     mixPart(prompt, fr, o)  o: want, bad, diag, before, after, sol, hints, text
   *     decPart(prompt, x, o)   o: dp, bad, after, sol, hints, text, nr
   *     numPart(prompt, x, o)   o: bad, after, sol, hints, text, nr
   *     rowsPart(prompt, rows, sol, hints, text)  several boxes; a row is mixRow(label, fr, o) | numRow(label, x, o) | decRow(label, x, o)
   *     ftInPart(prompt, totalInches, o)  o: sol, hints, text, bad [[ft, inchFr, code, hint]]
   *     tablePart(prompt, I, blanks, key, sol, hints, text)  the pctKit fill-in table with the u3mixed keypad
   *     opPart('add'|'sub'|'mul', [a, b, (c)], o)  "work it out" with the worked steps and the typical wrong values;
   *       o: prompt, of (writes "of" for ×), after (unit), final(ansTeX) (last solution line), want, level-free
   *   steps: addSteps(xs), subSteps(a, b), mulSteps(a, b), toMixedSteps(p, q), toImpSteps(fr)  (arrays of HTML lines)
   *   mistakes: addBad(xs), subBad(a, b), mulBad(a, b), mixedBad(p, q) (improper → mixed), impBad(fr) (mixed → improper)
   *   decToFrac(ds) → { fr, lines } (a terminating decimal string to a mixed number, with steps)
   *   bars(wholes, parts, extra, o) / pies(wholes, parts, extra, o): SVG pictures (o.empty: nothing shaded)
   * Keypad (browser): 'u3mixed' (digits, n a/b, a/b, decimal point). */
  var U = HW.u3len = HW.u3len || {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function R(p, q) { if (q == null) q = 1; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function Q(x) { if (Array.isArray(x)) return R(x[0], x[1]); if (typeof x === 'number') return [x, 1]; return R(x.w * x.d + x.n, x.d); }
  function mx(w, n, d) { return R(w * d + n, d); }
  function add(a, b) { a = Q(a); b = Q(b); return R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function sub(a, b) { a = Q(a); b = Q(b); return R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function mul(a, b) { a = Q(a); b = Q(b); return R(a[0] * b[0], a[1] * b[1]); }
  function div(a, b) { a = Q(a); b = Q(b); return R(a[0] * b[1], a[1] * b[0]); }
  function eq(a, b) { a = Q(a); b = Q(b); return a[0] * b[1] === b[0] * a[1]; }
  function lt(a, b) { a = Q(a); b = Q(b); return a[0] * b[1] < b[0] * a[1]; }
  function val(a) { a = Q(a); return a[0] / a[1]; }
  function parts(fr) { fr = Q(fr); var p = Math.abs(fr[0]), q = fr[1]; return { w: Math.floor(p / q), n: p % q, d: q, neg: fr[0] < 0 }; }
  function sumR(list) { return list.reduce(function (s, x) { return add(s, x); }, [0, 1]); }
  function rawT(w, n, d, big) { var fr = big ? '\\dfrac' : '\\frac'; if (!n) return String(w); return (w ? w : '') + fr + '{' + n + '}{' + d + '}'; }
  function mT(x) { var a = parts(x); return (a.neg ? '-' : '') + rawT(a.w, a.n, a.d); }
  function dmT(x) { var a = parts(x); return (a.neg ? '-' : '') + rawT(a.w, a.n, a.d, true); }
  function fT(x) { x = Q(x); return x[1] === 1 ? String(x[0]) : '\\frac{' + x[0] + '}{' + x[1] + '}'; }
  function dfT(x) { x = Q(x); return x[1] === 1 ? String(x[0]) : '\\dfrac{' + x[0] + '}{' + x[1] + '}'; }
  function plainMix(x) { var a = parts(x); return !a.n ? String(a.w) : (a.w ? a.w + ' ' : '') + a.n + '/' + a.d; }
  function isWhole(x) { return Q(x)[1] === 1; }
  /* a terminating decimal as an exact string */
  function decS(x) { x = Q(x); var q = x[1], k = 0; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; if (q !== 1) return null; var v = x[0] / x[1]; for (k = 0; k < 12; k++) if (Math.abs(Math.round(v * Math.pow(10, k)) - v * Math.pow(10, k)) < 1e-9) break; return (Math.round(v * Math.pow(10, k)) / Math.pow(10, k)).toFixed(k); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  U.gcd = gcd; U.lcm = lcm; U.R = R; U.Q = Q; U.mx = mx; U.add = add; U.sub = sub; U.mul = mul; U.div = div; U.eq = eq; U.lt = lt; U.val = val; U.parts = parts; U.sumR = sumR;
  U.rawT = rawT; U.mT = mT; U.dmT = dmT; U.fT = fT; U.dfT = dfT; U.plainMix = plainMix; U.isWhole = isWhole; U.decS = decS;

  /* ---- reading a typed answer ---- */
  function plainOf(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '').replace(/\\(?:text|mathrm|textrm|operatorname|mathit)\{([^{}]*)\}/g, ' $1 ').replace(/\\left|\\right/g, '');
    s = s.replace(/\\[dt]?frac\s*(?:\{\s*(\d+)\s*\}|(\d))\s*(?:\{\s*(\d+)\s*\}|(\d))/g, function (m, a1, a2, b1, b2) { return ' ' + (a1 || a2) + '/' + (b1 || b2) + ' '; });
    s = s.replace(/\\[,;:! ]|\\quad|\\qquad|~| | | /g, ' ').replace(/[−–]/g, '-').replace(/\^\{?\\circ\}?|\\degree/g, '°').replace(/\\%/g, '%');
    return s.replace(/\s+/g, ' ').trim();
  }
  function readMix(resp) {
    var s = plainOf(resp); if (!s) return { code: 'empty' };
    var unit = null, um = /^(.*?[\d.])\s*([a-zA-Z"'°″′][a-zA-Z."'²³°″′\s]*)$/.exec(s);
    if (um) { unit = um[2].trim(); s = um[1].trim(); }
    s = s.replace(/\s*\/\s*/g, '/').replace(/^\+/, '');
    var m;
    if ((m = /^(\d+)\s+(\d+)\/(\d+)$/.exec(s))) {
      var w = +m[1], n = +m[2], d = +m[3]; if (!d) return { code: 'notnumber' };
      return { kind: 'mixed', v: R(w * d + n, d), w: w, n: n, d: d, unit: unit };
    }
    if ((m = /^(\d+)\/(\d+)$/.exec(s))) { if (!+m[2]) return { code: 'notnumber' }; return { kind: 'frac', v: R(+m[1], +m[2]), p: +m[1], q: +m[2], unit: unit }; }
    if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, '');
    if (/^\d+,\d{1,2}$/.test(s)) return { code: 'comma' };
    if ((m = /^(\d+)$/.exec(s))) return { kind: 'int', v: [+m[1], 1], unit: unit };
    if ((m = /^(\d*)\.(\d+)$/.exec(s)) || (m = /^(\d+)\.$/.exec(s))) { var ds = (m[1] || '0') + (m[2] ? '.' + m[2] : ''), k = m[2] ? m[2].length : 0; return { kind: 'dec', v: R(Math.round(Number(ds) * Math.pow(10, k)), Math.pow(10, k)), s: ds, places: k, unit: unit }; }
    var a = K.read(String(resp == null ? '' : resp));
    if (!a.res && isFinite(a.val)) return { kind: 'expr', x: a.val, unit: unit };
    return { code: 'notnumber' };
  }
  U.readMix = readMix; U.plainOf = plainOf;

  /* ---- a mixed number / fraction answer ---- */
  function mixChk(fr, o) {
    o = o || {}; fr = Q(fr);
    var want = o.want || 'mixed', lowest = o.lowest !== false, A = parts(fr), what = o.what || (want === 'improper' ? 'improper fraction' : A.w && A.n ? 'mixed number' : A.n ? 'fraction' : 'whole number');
    var ex1 = want === 'improper' ? t('\\frac{11}{4}') : t('2\\frac{3}{4}');
    return function (resp) {
      var a = readMix(resp);
      if (a.code === 'empty') return form('empty', 'Type your answer first.');
      if (a.code === 'comma') return form('u3-comma', 'Use a decimal <b>point</b>, not a comma.');
      if (a.code) return form('notnumber', 'Write one ' + (want === 'improper' ? 'fraction, like ' : 'mixed number, like ') + ex1 + ' (use the <b>n<sup>a</sup>⁄<sub>b</sub></b> key, or type <code>2 3/4</code>).');
      if (a.kind === 'expr') { if (Math.abs(a.x - val(fr)) < 1e-9) return form('u3-single', 'Right value — now work it out to a single ' + what + '.'); return wrong('value', null); }
      if (eq(a.v, fr)) {
        if (a.kind === 'dec') return A.n ? form('u3-as-fraction', 'Right value — now write it as a ' + (want === 'improper' ? 'fraction' : 'mixed number') + ' instead of a decimal.') : ok();
        if (a.kind === 'mixed') {
          if (want === 'improper') return form('u3-want-improper', 'Right value — now write it as an <b>improper fraction</b>: ' + t('\\frac{' + a.w + '\\times ' + a.d + '+' + a.n + '}{' + a.d + '}') + '.');
          if (a.n >= a.d) return form('u3-regroup', 'Right value — but the fraction part ' + t('\\frac{' + a.n + '}{' + a.d + '}') + ' is 1 or more. ' + (a.w ? 'Regroup: change it to a mixed number and add its whole to the ' + t(a.w) + '.' : 'Write it as a mixed number.'));
          if (!a.n) return form('u3-zero-part', 'Right value — the fraction part is zero, so just write the whole number ' + t(A.w) + '.');
          if (lowest && gcd(a.n, a.d) > 1) return form('lowest', 'Right value — now simplify the fraction part: divide its top and bottom by ' + t(gcd(a.n, a.d)) + '. (The whole number stays the same.)');
          if (!a.w) return form('u3-zero-whole', 'Leave out the 0: just write the fraction.');
          return ok();
        }
        if (a.kind === 'frac') {
          if (fr[1] === 1 && want !== 'improper') return form('u3-want-whole', 'Right value — ' + t('\\frac{' + a.p + '}{' + a.q + '}') + ' is a whole number. Write it as ' + t(fr[0]) + '.');
          if (lowest && gcd(a.p, a.q) > 1) return form('lowest', 'Right value — now write it in simplest form: divide the top and bottom by ' + t(gcd(a.p, a.q)) + '.');
          if (want === 'mixed' && a.p > a.q) return form('u3-want-mixed', 'Right value — now write it as a <b>mixed number</b>: ' + t(a.p + '\\div ' + a.q + '=' + A.w + '\\text{ R }' + (a.p % a.q)) + '.');
          return ok();
        }
        if (a.kind === 'int') return want === 'improper' && fr[1] !== 1 ? form('u3-want-improper', 'Write it as an improper fraction.') : ok();
      }
      if (a.kind === 'dec' && A.n && Math.abs(val(a.v) - val(fr)) < 0.006) return form('u3-rounded', 'That decimal is close but not exact. Give the exact answer as a ' + (want === 'improper' ? 'fraction' : 'mixed number') + '.');
      var bad = o.bad || [];
      for (var i = 0; i < bad.length; i++) if (eq(a.v, bad[i][0])) return wrong(bad[i][1], bad[i][2]);
      var h = o.diag ? o.diag(a.v, a) : null; if (h) return wrong(h.code || 'u3-diag', h.hint);
      if (A.w && A.n && eq(a.v, R(A.n, A.d))) return wrong('u3-lost-whole', 'Keep the whole number ' + t(A.w) + ': only the fraction part changes when you simplify or regroup.');
      if (fr[0] && !isWhole(fr) && eq(a.v, R(fr[1], fr[0]))) return wrong('flip', 'Your fraction is upside down — check which number goes on top.');
      return wrong('value', null);
    };
  }
  U.mixChk = mixChk;
  function cleanBadR(list, ans) {
    var seen = [ans], out = [];
    (list || []).forEach(function (b) { if (!b || !b[0]) return; var v = Q(b[0]); if (!isFinite(v[0]) || !isFinite(v[1]) || v[1] === 0 || v[0] <= 0) return; if (seen.some(function (x) { return eq(x, v); })) return; seen.push(v); out.push([v, b[1], b[2]]); });
    return out;
  }
  U.cleanBadR = cleanBadR;
  function mixPart(prompt, fr, o) {
    o = o || {}; fr = Q(fr);
    var want = o.want || 'mixed', bad = cleanBadR(o.bad, fr), key = want === 'improper' ? fT(fr) : mT(fr);
    var p = { prompt: prompt, input: { type: 'math', keys: 'u3mixed', before: o.before, after: o.after, placeholder: want === 'improper' ? 'e.g. 11/4' : 'e.g. 2 3/4' },
      check: mixChk(fr, { want: want, bad: bad, diag: o.diag, lowest: o.lowest, what: o.what }), key: key,
      answer: t((want === 'improper' ? dfT(fr) : dmT(fr)) + (o.after ? '\\text{ ' + o.after + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = bad.map(function (b) { return want === 'improper' ? fT(b[0]) : mT(b[0]); });
    p.good = [want === 'improper' ? fr[0] + '/' + fr[1] : plainMix(fr), (want === 'improper' ? dfT(fr) : dmT(fr))].filter(function (g) { return g !== key; });
    return p;
  }
  U.mixPart = mixPart;

  /* ---- decimals and plain numbers ---- */
  function decChk(x, o) {
    o = o || {}; var xv = typeof x === 'number' ? x : val(x), xs = typeof x === 'number' ? null : decS(x);
    var diag = function (v) { var b = (o.bad || []).filter(Boolean); for (var i = 0; i < b.length; i++) if (Math.abs(v - b[i][0]) < 1e-9) return { code: b[i][1], hint: b[i][2] }; return o.diag ? o.diag(v) : null; };
    return function (resp) {
      var a = readMix(resp);
      if (a.code === 'empty') return form('empty', 'Type your answer first.');
      if (a.code === 'comma') return form('u3-comma', 'Use a decimal <b>point</b>, not a comma.');
      if ((a.kind === 'mixed' || a.kind === 'frac') && Math.abs(val(a.v) - xv) < 1e-9) return form('u3-as-decimal', 'Right value — now write it as a <b>decimal</b> (divide the top by the bottom).');
      var s = a.kind === 'int' || a.kind === 'dec' ? (a.kind === 'int' ? String(a.v[0]) : a.s) : plainOf(resp);
      if (o.dp != null) return K.approx(xv, o.dp, { diag: diag, nr: o.nr })(s);
      if (a.kind === 'dec' || a.kind === 'int') {
        var v = val(a.v);
        if (Math.abs(v - xv) < 1e-9) { if (o.nr && s.length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return ok(); }
        var h = diag(v); if (h) return wrong(h.code || 'u3-diag', h.hint);
        if (xs && (xs.split('.')[1] || '').length > (a.places || 0) && Math.abs(v - xv) < Math.pow(10, -(a.places || 0))) return form('u3-all-digits', 'Don’t round: this decimal stops, so write all of its digits.');
        return wrong('value', null);
      }
      return K.number(xv, diag, { nr: o.nr })(s);
    };
  }
  function numChk(x, o) {
    o = o || {};
    var diag = function (v) { var b = (o.bad || []).filter(Boolean); for (var i = 0; i < b.length; i++) if (Math.abs(v - b[i][0]) < 1e-9) return { code: b[i][1], hint: b[i][2] }; return o.diag ? o.diag(v) : null; };
    return function (resp) {
      var a = readMix(resp);
      if (a.code === 'comma') return form('u3-comma', 'Use a decimal <b>point</b>, not a comma.');
      if ((a.kind === 'mixed' || a.kind === 'frac') && Math.abs(val(a.v) - x) < 1e-9) return x % 1 === 0 ? form('u3-want-whole', 'Right value — write it as a whole number: ' + t(x) + '.') : form('u3-as-decimal', 'Right value — now write it as a decimal.');
      var s = a.kind === 'int' || a.kind === 'dec' ? (a.kind === 'int' ? String(a.v[0]) : a.s) : String(resp == null ? '' : resp);
      return K.number(x, diag, { nr: o.nr })(s);
    };
  }
  U.decChk = decChk; U.numChk = numChk;
  function badStrs(list, x) { return (list || []).filter(function (b) { return b && Math.abs(b[0] - x) > 1e-9; }).map(function (b) { return String(Math.round(b[0] * 1e6) / 1e6); }); }
  function decPart(prompt, x, o) {
    o = o || {}; var xv = typeof x === 'number' ? x : val(x), key = o.dp != null ? K.roundTo(xv, o.dp).toFixed(Math.max(0, o.dp)) : (typeof x === 'number' ? String(Math.round(x * 1e9) / 1e9) : decS(x));
    var p = { prompt: prompt, input: { type: 'number', after: o.after, nr: !!o.nr }, check: decChk(x, o), key: key, answer: t(key + (o.after ? '\\text{ ' + o.after + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badStrs(o.bad, Number(key)).filter(function (s) { return o.dp == null || Math.abs(K.roundTo(Number(s), o.dp) - Number(key)) > 1e-9; });
    return p;
  }
  function numPart(prompt, x, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', after: o.after, nr: !!o.nr }, check: numChk(x, o), key: String(x), answer: t(HW.fmt(x) + (o.after ? '\\text{ ' + o.after + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badStrs(o.bad, x);
    return p;
  }
  U.decPart = decPart; U.numPart = numPart;

  /* ---- several boxes ---- */
  function mixRow(label, fr, o) { o = o || {}; fr = Q(fr); var bad = cleanBadR(o.bad, fr), want = o.want || 'mixed'; return { field: { label: label, mode: 'math', keys: 'u3mixed', after: o.after, name: o.name || label.replace(/:$/, ''), placeholder: want === 'improper' ? 'e.g. 11/4' : 'e.g. 2 3/4' }, chk: mixChk(fr, { want: want, bad: bad, diag: o.diag }), key: want === 'improper' ? fT(fr) : mT(fr), ans: (want === 'improper' ? dfT(fr) : dmT(fr)), bad: bad.map(function (b) { return want === 'improper' ? fT(b[0]) : mT(b[0]); }), after: o.after }; }
  function numRow(label, x, o) { o = o || {}; return { field: { label: label, after: o.after, name: o.name || label.replace(/:$/, '') }, chk: numChk(x, o), key: String(x), ans: HW.fmt(x), bad: badStrs(o.bad, x), after: o.after }; }
  function decRow(label, x, o) { o = o || {}; var xv = typeof x === 'number' ? x : val(x), key = o.dp != null ? K.roundTo(xv, o.dp).toFixed(o.dp) : (typeof x === 'number' ? String(Math.round(x * 1e9) / 1e9) : decS(x)); return { field: { label: label, after: o.after, name: o.name || label.replace(/:$/, '') }, chk: decChk(x, o), key: key, ans: key, bad: badStrs(o.bad, Number(key)), after: o.after }; }
  function rowsPart(prompt, rows, sol, hints, text) {
    var p = P.fields(prompt, rows.map(function (r) { return r.field; }), rows.map(function (r) { return r.chk; }), rows.map(function (r) { return r.key; }),
      rows.map(function (r) { return (r.field.label ? r.field.label + ' ' : '') + t(r.ans + (r.after ? '\\text{ ' + r.after + '}' : '')); }).join(' &nbsp; '), sol, hints, text);
    var bads = [];
    rows.forEach(function (r, i) { (r.bad || []).forEach(function (b) { var k = rows.map(function (x) { return x.key; }); k[i] = b; bads.push(k); }); });
    p.bad = bads;
    return p;
  }
  U.mixRow = mixRow; U.numRow = numRow; U.decRow = decRow; U.rowsPart = rowsPart;

  /* ---- feet and inches ---- */
  function ftIn(fr) { fr = Q(fr); var ft = Math.floor(val(fr) / 12 + 1e-9); return { ft: ft, inch: sub(fr, ft * 12) }; }
  function ftInT(fr) { var a = ftIn(fr); return (a.ft ? a.ft + '\\text{ ft }' : '') + (a.inch[0] || !a.ft ? mT(a.inch) + '\\text{ in}' : ''); }
  function ftInChk(total, o) {
    o = o || {}; total = Q(total); var A = ftIn(total);
    return function (resp) {
      resp = resp || [];
      var f = readMix(resp[0]), i = readMix(resp[1]);
      if (f.code === 'empty' && i.code === 'empty') return form('empty', 'Fill in the feet and the inches.');
      if (f.code === 'empty') return form('empty', '<b>Feet:</b> type the whole feet (type 0 if there are none).');
      if (i.code === 'empty') return form('empty', '<b>Inches:</b> type the inches left over (type 0 if there are none).');
      if (f.code || f.kind === 'expr') return form('notnumber', '<b>Feet:</b> type a whole number of feet.');
      if (i.code || i.kind === 'expr') return form('notnumber', '<b>Inches:</b> type the inches as a whole or mixed number, like ' + t('5\\frac{1}{2}') + '.');
      if (!isWhole(f.v)) return form('u3-ft-whole', '<b>Feet:</b> whole feet only — the part of a foot goes in the inches box (as inches).');
      var tot = add(mul(f.v, 12), i.v);
      if (eq(tot, total)) {
        if (!lt(i.v, 12)) return form('u3-regroup-in', 'Right length — but ' + t(mT(i.v)) + ' in is 12 in or more. Regroup: 12 in = 1 ft.');
        var r = mixChk(A.inch, { want: 'mixed' })(resp[1]); if (r.v !== 'correct') return { v: r.v, code: r.code, hint: '<b>Inches:</b> ' + r.hint };
        return ok();
      }
      var b = o.bad || [];
      for (var k = 0; k < b.length; k++) if (eq(f.v, b[k][0]) && eq(i.v, b[k][1])) return wrong(b[k][2], b[k][3]);
      if (eq(add(mul(f.v, 10), i.v), total) && lt(i.v, 10)) return wrong('u3-ft10', 'A foot is <b>12</b> inches, not 10.');
      if (eq(f.v, A.ft) && !eq(i.v, A.inch)) return wrong('value', '<b>Feet</b> are right — check the inches.');
      if (eq(i.v, A.inch) && !eq(f.v, A.ft)) return wrong('value', '<b>Inches</b> are right — check the feet.');
      return wrong('value', null);
    };
  }
  function ftInPart(prompt, total, o) {
    o = o || {}; total = Q(total); var A = ftIn(total);
    var p = P.fields(prompt, [{ label: '', after: 'ft', name: 'Feet' }, { label: '', mode: 'math', keys: 'u3mixed', after: 'in', name: 'Inches', placeholder: 'e.g. 5 1/2' }], [function () { return ok(); }, function () { return ok(); }], [String(A.ft), mT(A.inch)], t(ftInT(total)), o.sol, o.hints, o.text);
    p.check = ftInChk(total, o);
    p.bad = (o.bad || []).map(function (b) { return [String(Q(b[0])[0]), mT(b[1])]; }).concat([[String(A.ft), mT(add(A.inch, 1))], [String(Math.max(0, A.ft - 1)), mT(add(A.inch, 12))]].slice(0, 1));
    p.good = [[String(A.ft), plainMix(A.inch)]];
    return p;
  }
  U.ftIn = ftIn; U.ftInT = ftInT; U.ftInChk = ftInChk; U.ftInPart = ftInPart;

  /* ---- a fill-in table (pctKit's areabox table with the mixed-number keypad) ---- */
  function tablePart(prompt, I, blanks, key, sol, hints, text) {
    if (!PK) throw new Error('u3l1.js needs HW.pctKit (js/lessons/u1l7.js)');
    var p = PK.tablePart(prompt, { rows: I.rows, cols: I.cols, cells: I.cells, corner: I.corner || '', keys: 'u3mixed', help: I.help || 'Tap a box, then type the amount as a whole number, a fraction or a mixed number (use the n a/b key). Fill in every empty box.', tries: I.tries }, PK.tableChk(blanks), key, sol, hints, text);
    return p;
  }
  U.tablePart = tablePart;

  /* ---- worked steps ---- */
  function L(s) { return t(s); }
  function convLine(list, Ld) { var c = list.filter(function (a) { return a.n && a.d !== Ld; }).map(function (a) { return '\\frac{' + a.n + '}{' + a.d + '}=\\frac{' + a.n * Ld / a.d + '}{' + Ld + '}'; }).filter(function (x, i, arr) { return arr.indexOf(x) === i; }); return c.length ? L(c.join(',\\quad ')) : null; }
  function simpLine(w, n, d) { var g = gcd(n, d); return n && g > 1 ? L(rawT(w, n, d) + '=' + rawT(w, n / g, d / g)) : null; }
  function addSteps(xs) {
    var A = xs.map(parts), dens = A.filter(function (a) { return a.n; }).map(function (a) { return a.d; }), Ld = dens.reduce(lcm, 1), out = [];
    if (dens.length > 1 && dens.some(function (d) { return d !== Ld; })) out.push('Common denominator ' + Ld + ': ' + convLine(A, Ld));
    var Wh = 0, N = 0; A.forEach(function (a) { Wh += a.w; N += a.n ? a.n * Ld / a.d : 0; });
    out.push(L(A.map(function (a) { return rawT(a.w, a.n ? a.n * Ld / a.d : 0, Ld); }).join('+') + '=' + rawT(Wh, N, Ld)));
    var w2 = Wh, n2 = N;
    if (N >= Ld) { w2 = Wh + Math.floor(N / Ld); n2 = N % Ld; out.push('Regroup: ' + L('\\frac{' + N + '}{' + Ld + '}=' + rawT(Math.floor(N / Ld), n2, Ld)) + (Wh ? ', so ' + L(Wh + '+' + rawT(Math.floor(N / Ld), n2, Ld) + '=' + rawT(w2, n2, Ld)) : '')); }
    var s = simpLine(w2, n2, Ld); if (s) out.push('Simplify: ' + s);
    return out;
  }
  function subSteps(a0, b0) {
    var a = parts(a0), b = parts(b0), dens = [a, b].filter(function (x) { return x.n; }).map(function (x) { return x.d; }), Ld = dens.reduce(lcm, 1), out = [];
    if (dens.length > 1 && dens.some(function (d) { return d !== Ld; })) out.push('Common denominator ' + Ld + ': ' + convLine([a, b], Ld));
    var wa = a.w, na = a.n ? a.n * Ld / a.d : 0, nb = b.n ? b.n * Ld / b.d : 0;
    if (na < nb) { out.push((a.n ? L('\\frac{' + na + '}{' + Ld + '}') + ' is less than ' + L('\\frac{' + nb + '}{' + Ld + '}') + ', so regroup: ' : 'Regroup: ') + L(rawT(wa, na, Ld) + '=' + rawT(wa - 1, na + Ld, Ld))); wa -= 1; na += Ld; }
    out.push(L(rawT(wa, na, Ld) + '-' + rawT(b.w, nb, Ld) + '=' + rawT(wa - b.w, na - nb, Ld)));
    var s = simpLine(wa - b.w, na - nb, Ld); if (s) out.push('Simplify: ' + s);
    return out;
  }
  function impT(x) { var a = Q(x); return '\\frac{' + a[0] + '}{' + a[1] + '}'; }
  function toMixedSteps(p, q) {
    var w = Math.floor(p / q), r = p % q, out = [];
    if (!r) { out.push(L(p + '\\div ' + q + '=' + w) + ', so ' + L('\\frac{' + p + '}{' + q + '}=' + w)); return out; }
    if (p < q) { var g0 = gcd(p, q); if (g0 > 1) out.push(L('\\frac{' + p + '}{' + q + '}=' + fT(R(p, q))) + ' (divide the top and bottom by ' + g0 + ')'); return out; }
    out.push(L(p + '\\div ' + q + '=' + w) + ' R ' + r + ', so ' + L('\\frac{' + p + '}{' + q + '}=' + rawT(w, r, q)) + (gcd(r, q) > 1 ? L('=' + rawT(w, r / gcd(r, q), q / gcd(r, q))) : ''));
    return out;
  }
  function toImpSteps(fr) { var a = parts(fr); return [L(rawT(a.w, a.n, a.d) + '=\\frac{' + a.w + '\\times ' + a.d + '+' + a.n + '}{' + a.d + '}=\\frac{' + (a.w * a.d + a.n) + '}{' + a.d + '}')]; }
  function mulSteps(a0, b0) {
    var a = Q(a0), b = Q(b0), A = parts(a), B = parts(b), out = [], need = A.w || B.w;
    var ia = isWhole(a) ? '\\frac{' + a[0] + '}{1}' : impT(a), ib = isWhole(b) ? '\\frac{' + b[0] + '}{1}' : impT(b);
    if (need && !(isWhole(a) && isWhole(b))) out.push('Improper fractions: ' + L(dmT(a) + '\\times ' + dmT(b) + '=' + ia + '\\times ' + ib));
    var p = a[0] * b[0], q = a[1] * b[1];
    out.push(L(ia + '\\times ' + ib + '=\\frac{' + a[0] + '\\times ' + b[0] + '}{' + a[1] + '\\times ' + b[1] + '}=\\frac{' + p + '}{' + q + '}'));
    toMixedSteps(p, q).forEach(function (l) { out.push(l); });
    return out;
  }
  /* one line: a × b = improper × improper = p/q = answer */
  function mulShort(a0, b0) { var a = Q(a0), b = Q(b0), p = a[0] * b[0], q = a[1] * b[1], ans = R(p, q), ia = isWhole(a) ? String(a[0]) : impT(a), ib = isWhole(b) ? String(b[0]) : impT(b); return L(dmT(a) + '\\times ' + dmT(b) + ((parts(a).w && parts(a).n) || (parts(b).w && parts(b).n) ? '=' + ia + '\\times ' + ib : '') + '=\\frac{' + p + '}{' + q + '}' + ('\\frac{' + p + '}{' + q + '}' === mT(ans) ? '' : '=' + mT(ans))); }
  U.mulShort = mulShort; U.addSteps = addSteps; U.subSteps = subSteps; U.mulSteps = mulSteps; U.toMixedSteps = toMixedSteps; U.toImpSteps = toImpSteps;

  /* ---- typical wrong values: [[fr, code, hint]] ---- */
  function addBad(xs) {
    var A = xs.map(parts), F = A.filter(function (a) { return a.n; }), Wh = A.reduce(function (s, a) { return s + a.w; }, 0), out = [], ans = sumR(xs);
    var dens = F.map(function (a) { return a.d; }), Ld = dens.reduce(lcm, 1), N = F.reduce(function (s, a) { return s + a.n * Ld / a.d; }, 0);
    if (F.length > 1) {
      out.push([add(Wh, R(F.reduce(function (s, a) { return s + a.n; }, 0), F.reduce(function (s, a) { return s + a.d; }, 0))), 'u3-add-dens', 'Never add the denominators. Give the fractions a common denominator, then add only the tops (numerators).']);
      if (dens.some(function (d) { return d !== dens[0]; })) out.push([add(Wh, R(F.reduce(function (s, a) { return s + a.n; }, 0), Math.max.apply(null, dens))), 'u3-no-lcd', 'The pieces are different sizes. Rewrite the fractions with a common denominator (' + Ld + ') before you add the tops.']);
    }
    if (N >= Ld) out.push([sub(ans, 1), 'u3-regroup-carry', 'When you regroup, the fraction part makes a new whole: add it to the whole number.']);
    return out;
  }
  function subBad(a0, b0) {
    var a = parts(a0), b = parts(b0), dens = [a, b].filter(function (x) { return x.n; }).map(function (x) { return x.d; }), Ld = dens.reduce(lcm, 1), out = [], ans = sub(a0, b0);
    var na = a.n ? a.n * Ld / a.d : 0, nb = b.n ? b.n * Ld / b.d : 0;
    if (na < nb) {
      if (a.n) out.push([add(a.w - b.w, R(nb - na, Ld)), 'u3-flip', 'Don’t flip the fractions to make the subtraction easy. ' + t('\\frac{' + na + '}{' + Ld + '}') + ' is less than ' + t('\\frac{' + nb + '}{' + Ld + '}') + ', so regroup: take 1 whole from ' + t(a.w) + ' first.']);
      else out.push([add(a.w - b.w, R(b.n, b.d)), 'u3-whole-borrow', 'To take a fraction away from a whole number, regroup first: ' + t(a.w + '=' + rawT(a.w - 1, Ld, Ld)) + '.']);
      out.push([add(ans, 1), 'u3-borrow-whole', 'When you regroup, the 1 whole you change into fraction pieces comes off the whole number: ' + t(rawT(a.w, na, Ld) + '=' + rawT(a.w - 1, na + Ld, Ld)) + '.']);
      if (na) out.push([sub(ans, R(na, Ld)), 'u3-borrow-frac', 'When you regroup, add the ' + t('\\frac{' + Ld + '}{' + Ld + '}') + ' to the fraction you already have: ' + t(rawT(a.w, na, Ld) + '=' + rawT(a.w - 1, na + Ld, Ld)) + '.']);
    }
    out.push([add(a0, b0), 'u3-added', 'This one is a subtraction: take the second amount away.']);
    if (b.n && a.n && a.d !== b.d) out.push([add(a.w - b.w, R(Math.abs(a.n - b.n), Math.max(a.d, b.d))), 'u3-no-lcd', 'Rewrite the fractions with a common denominator (' + Ld + ') before you subtract.']);
    return out;
  }
  function mulBad(a0, b0) {
    var a = parts(a0), b = parts(b0), out = [];
    if (a.w && a.n && b.w && b.n) out.push([add(a.w * b.w, R(a.n * b.n, a.d * b.d)), 'u3-mul-split', 'You can’t multiply the whole numbers and the fractions separately — that leaves parts out. Change each mixed number to an improper fraction first.']);
    if (isWhole(a0) && b.w && b.n) out.push([add(a.w * b.w, R(b.n, b.d)), 'u3-mul-whole-only', 'Multiply the <b>whole</b> mixed number, not just its whole part. Change ' + t(dmT(b0)) + ' to an improper fraction first.']);
    if (isWhole(b0) && a.w && a.n) out.push([add(a.w * b.w, R(a.n, a.d)), 'u3-mul-whole-only', 'Multiply the <b>whole</b> mixed number, not just its whole part. Change ' + t(dmT(a0)) + ' to an improper fraction first.']);
    if (!isWhole(a0) && !isWhole(b0) && a.n && b.n) out.push([add(a.w * b.w, R(a.n + b.n, a.d + b.d)), 'u3-mul-add', 'To multiply fractions, multiply the tops and multiply the bottoms.']);
    out.push([add(a0, b0), 'u3-mul-added', 'This one is a multiplication: change to improper fractions and multiply.']);
    return out;
  }
  function mixedBad(p, q) {
    var w = Math.floor(p / q), r = p % q, out = [];
    if (r && w > r) out.push([add(w, R(r, w)), 'u3-rem-quot', 'The remainder goes over the <b>denominator</b> (' + q + '), not over the whole number.']);
    if (r) out.push([add(w + 1, R(r, q)), 'u3-division', 'Check the division: ' + t(q + '\\times ' + (w + 1) + '=' + q * (w + 1)) + ' is more than ' + p + '.']);
    if (r && w > 1) out.push([add(w - 1, R(r, q)), 'u3-division', 'Check the division: ' + t(q + '\\times ' + w + '=' + q * w) + ' still fits in ' + p + ', so the whole number is ' + w + '.']);
    if (r) out.push([add(w, R(q - r, q)), 'u3-remainder', 'Check the remainder: ' + t(p + '-' + q + '\\times ' + w + '=' + r) + '.']);
    return out;
  }
  function impBad(fr) {
    var a = parts(fr), out = [];
    out.push([R(a.w * a.n + a.d, a.d), 'u3-imp-order', 'Multiply the whole number by the <b>denominator</b> (' + a.w + ' × ' + a.d + '), then add the numerator.']);
    out.push([R(a.w + a.n, a.d), 'u3-imp-nomult', 'Each whole is ' + t('\\frac{' + a.d + '}{' + a.d + '}') + '. Multiply the whole number by ' + a.d + ' first, then add the ' + a.n + '.']);
    out.push([R(a.w * a.d, a.d), 'u3-imp-noadd', 'You changed the wholes to ' + a.d + 'ths — now add the ' + t('\\frac{' + a.n + '}{' + a.d + '}') + ' too.']);
    out.push([R(a.w * a.n, a.d), 'u3-imp-wn', 'Multiply the whole number by the denominator (' + a.w + ' × ' + a.d + '), then add the numerator.']);
    out.push([R(a.w * a.d - a.n, a.d), 'u3-imp-sub', 'Add the numerator (don’t subtract it): ' + t(a.w + '\\times ' + a.d + '+' + a.n) + '.']);
    return out;
  }
  U.addBad = addBad; U.subBad = subBad; U.mulBad = mulBad; U.mixedBad = mixedBad; U.impBad = impBad;

  var OPH = { add: ['Give the fractions a common denominator, then add the wholes and add the fractions.', 'If the fraction part is 1 or more, regroup. Then simplify.'],
    sub: ['Give the fractions a common denominator. If the first fraction is too small, regroup: take 1 from the whole number.', 'Subtract the wholes and the fractions, then simplify.'],
    mul: ['Change each mixed number (and whole number) to an improper fraction.', 'Multiply the tops, multiply the bottoms, then change back to a mixed number in simplest form.'] };
  function opPart(op, xs, o) {
    o = o || {};
    var ans = op === 'add' ? sumR(xs) : op === 'sub' ? sub(xs[0], xs[1]) : mul(xs[0], xs[1]);
    var sign = op === 'add' ? '+' : op === 'sub' ? '-' : o.of ? '\\text{ of }' : '\\times ';
    var prompt = o.prompt || t(xs.map(function (x) { return dmT(x); }).join(sign));
    var lines = op === 'add' ? addSteps(xs) : op === 'sub' ? subSteps(xs[0], xs[1]) : mulSteps(xs[0], xs[1]);
    if (o.final) lines.push(o.final(dmT(ans)));
    var bad = (op === 'add' ? addBad(xs) : op === 'sub' ? subBad(xs[0], xs[1]) : mulBad(xs[0], xs[1])).concat(o.bad || []);
    return mixPart(prompt, ans, { bad: bad, after: o.after, sol: lines.join('<br>'), hints: o.hints || OPH[op], text: o.text || op + ' ' + xs.map(plainMix).join(','), want: o.want, before: o.before });
  }
  U.opPart = opPart;

  /* ---- a terminating decimal → a mixed number ---- */
  function decToFrac(ds) {
    var s = String(ds), ip = Number(s.split('.')[0]), fp = s.split('.')[1] || '', k = fp.length, D = Math.pow(10, k), Nn = Number(fp || 0), f = R(Nn, D);
    var lines = [L('0.' + fp + '=\\frac{' + Nn + '}{' + D + '}' + (gcd(Nn, D) > 1 ? '=' + fT(f) : '')) + (gcd(Nn, D) > 1 ? ' (divide the top and bottom by ' + gcd(Nn, D) + ')' : ''),
      'So ' + L(s + '=' + rawT(ip, f[0], f[1])) + '. (Or on the calculator: ' + s + ' [ENTER] [2nd] [F◂▸D].)'];
    return { fr: add(ip, f), lines: lines };
  }
  U.decToFrac = decToFrac;

  /* ---- pictures ---- */
  var SH = '#9db4d6', LN = '#2b3340', TH = '#9aa3ad';
  function bars(wholes, nparts, extra, o) {
    o = o || {}; var nb = wholes + (extra > 0 || o.forceExtra ? 1 : 0), bw = o.w || Math.min(130, Math.floor(460 / nb) - 10), h = 24, gap = 12, Wd = nb * (bw + gap) - gap + 4, pw = bw / nparts, s = '';
    for (var b = 0; b < nb; b++) {
      var x0 = 2 + b * (bw + gap);
      for (var i = 0; i < nparts; i++) { var on = !o.empty && (b < wholes || i < extra); s += '<rect x="' + (x0 + i * pw).toFixed(2) + '" y="2" width="' + pw.toFixed(2) + '" height="' + h + '" fill="' + (on ? SH : '#ffffff') + '" stroke="' + TH + '" stroke-width="1"/>'; }
      s += '<rect x="' + x0 + '" y="2" width="' + bw + '" height="' + h + '" fill="none" stroke="' + LN + '" stroke-width="1.8"/>';
    }
    return '<svg class="u3l1-pic" width="' + Wd + '" height="' + (h + 4) + '" viewBox="0 0 ' + Wd + ' ' + (h + 4) + '" role="img" aria-label="' + (o.label || 'Bars cut into equal parts') + '">' + s + '</svg>';
  }
  function pies(wholes, nparts, extra, o) {
    o = o || {}; var nb = wholes + (extra > 0 ? 1 : 0), r = o.r || 28, gap = 12, Wd = nb * (2 * r + gap) - gap + 4, s = '';
    for (var b = 0; b < nb; b++) {
      var cx = 2 + r + b * (2 * r + gap), cy = 2 + r;
      for (var i = 0; i < nparts; i++) {
        var a1 = (90 - i * 360 / nparts) * Math.PI / 180, a2 = (90 - (i + 1) * 360 / nparts) * Math.PI / 180, on = !o.empty && (b < wholes || i < extra);
        var x1 = cx + r * Math.cos(a1), y1 = cy - r * Math.sin(a1), x2 = cx + r * Math.cos(a2), y2 = cy - r * Math.sin(a2);
        s += '<path d="M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z" fill="' + (on ? SH : '#ffffff') + '" stroke="' + TH + '" stroke-width="1"/>';
      }
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + LN + '" stroke-width="1.8"/>';
    }
    return '<svg class="u3l1-pic" width="' + Wd + '" height="' + (2 * r + 4) + '" viewBox="0 0 ' + Wd + ' ' + (2 * r + 4) + '" role="img" aria-label="' + (o.label || 'Circles cut into equal parts') + '">' + s + '</svg>';
  }
  U.bars = bars; U.pies = pies;

  HW.addCodes({
    'u3-add-dens': 'Added the denominators', 'u3-no-lcd': 'No common denominator before adding/subtracting', 'u3-regroup-carry': 'Regrouped but dropped the new whole',
    'u3-flip': 'Flipped the fractions instead of regrouping', 'u3-whole-borrow': 'Whole minus mixed number without regrouping', 'u3-borrow-whole': 'Regrouped without taking 1 off the whole number',
    'u3-borrow-frac': 'Regrouped but lost the fraction already there', 'u3-added': 'Added instead of subtracting', 'u3-mul-split': 'Multiplied wholes and fractions separately',
    'u3-mul-whole-only': 'Multiplied only the whole part of the mixed number', 'u3-mul-add': 'Added tops and bottoms instead of multiplying', 'u3-mul-added': 'Added instead of multiplying',
    'u3-rem-quot': 'Remainder over the quotient', 'u3-division': 'Division slip (whole number off by one)', 'u3-remainder': 'Wrong remainder', 'u3-imp-order': 'Mixed → improper: w × n + d',
    'u3-imp-nomult': 'Mixed → improper: didn’t multiply the whole number', 'u3-imp-noadd': 'Mixed → improper: forgot to add the numerator', 'u3-imp-wn': 'Mixed → improper: w × n',
    'u3-imp-sub': 'Mixed → improper: subtracted the numerator', 'u3-lost-whole': 'Lost the whole number', 'u3-regroup': 'Fraction part not regrouped (e.g. 8 11/8)', 'u3-want-mixed': 'Improper fraction instead of a mixed number',
    'u3-want-improper': 'Mixed number instead of an improper fraction', 'u3-want-whole': 'Whole number left as a fraction', 'u3-zero-part': 'Wrote a 0 fraction part', 'u3-zero-whole': 'Wrote a 0 whole part',
    'u3-as-fraction': 'Decimal where a fraction was asked', 'u3-as-decimal': 'Fraction where a decimal was asked', 'u3-rounded': 'Rounded decimal instead of the exact fraction', 'u3-all-digits': 'Rounded a decimal that stops',
    'u3-single': 'Not worked out to a single number', 'u3-comma': 'Decimal comma', 'u3-ft-whole': 'Part of a foot in the feet box', 'u3-regroup-in': '12 in or more not regrouped as feet', 'u3-ft10': 'Used 10 in per foot',
    'u3-digits': 'Wrote the fraction’s digits as a decimal', 'u3-div-way': 'Divided the bottom by the top', 'u3-pic-count': 'Miscounted the picture', 'u3-pic-all': 'Counted the unshaded parts too',
    'u3-scoop': 'Fraction size not used (counted in the wrong pieces)', 'u3-est-down': 'Rounded down a fraction of ½ or more', 'u3-rolls-down': 'Rounded the number of rolls down', 'u3-gaps': 'Wrong number of gaps',
    'u3-one-piece': 'Only part of the pieces', 'u3-kerf': 'Left out the saw cuts', 'u3-days': 'Left out a trip or a day'
  });
  HW.addPartial({ 'u3-regroup-carry': 's', 'u3-borrow-whole': 's', 'u3-borrow-frac': 's', 'u3-division': 's', 'u3-remainder': 's', 'u3-lost-whole': 'b', 'u3-ft10': 'b', 'u3-no-lcd': 'b', 'u3-add-dens': 'n', 'u3-flip': 'b', 'u3-whole-borrow': 'b', 'u3-mul-split': 'b', 'u3-mul-whole-only': 'b', 'u3-rem-quot': 'b', 'u3-imp-order': 'b', 'u3-imp-nomult': 'b', 'u3-imp-noadd': 'b', 'u3-imp-wn': 'b', 'u3-gaps': 's', 'u3-kerf': 'b', 'u3-days': 'b', 'u3-rolls-down': 's', 'u3-est-down': 's', 'u3-one-piece': 'b' });

  /* ================= lesson helpers ================= */
  function find(gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function key(x) { return Q(x).join('/'); }
  function notIn(x, list) { return list.indexOf(key(x)) < 0; }
  function D(x) { return t(dmT(x)); }                                    // a mixed number in a prompt
  function proper(r, d, o) { o = o || {}; var n; do { n = r.int(1, d - 1); } while (gcd(n, d) > 1 && !o.any); return n; }
  function mixOf(r, ds, w0, w1, o) { var d = r.pick(ds); return mx(r.int(w0, w1), proper(r, d, o), d); }
  function lines(a) { return a.filter(Boolean).join('<br>'); }
  function improperPart(r, p, q, excl) { // improper p/q (as written) → mixed number in simplest form
    var fr = R(p, q);
    return mixPart(t('\\dfrac{' + p + '}{' + q + '}'), fr, { bad: mixedBad(p, q), sol: lines(toMixedSteps(p, q)), hints: ['Divide the top by the bottom: the answer is the whole number, the remainder goes over the bottom.', 'Then simplify the fraction part.'], text: 'to mixed ' + p + '/' + q });
  }
  function improperFrom(fr) { return mixPart(D(fr), fr, { want: 'improper', bad: impBad(fr), sol: lines(toImpSteps(fr)), hints: ['Multiply the whole number by the denominator, then add the numerator.', 'Keep the same denominator.'], text: 'to improper ' + plainMix(fr) }); }
  var EX_IMP = ['23/4', '45/8', '19/3', '5/2', '17/5', '13/5', '11/6', '11/4', '11/3'];           // improper fractions worked in the lesson (reduced)
  var EX_MIX = ['29/8', '20/3', '47/10', '25/2', '14/3', '11/4', '13/5', '11/6', '17/5'];           // mixed numbers worked in the lesson

  /* improper p/q with a given denominator: o.reduce (fraction part reduces), o.whole (comes out whole) */
  function impGen(r, q, lo, hi, o) {
    o = o || {};
    return find(function () { var p = o.whole ? q * r.int(Math.max(2, Math.ceil(lo / q)), Math.floor(hi / q)) : r.int(lo, hi); return [p, q]; }, function (v) {
      var p = v[0], rem = p % q; if (p <= q) return false;
      if (o.whole) return rem === 0;
      if (!rem) return false;
      if (o.reduce ? gcd(rem, q) === 1 : gcd(rem, q) > 1) return false;
      return notIn(R(p, q), EX_IMP) && !(p === 38 && q === 6) && !(p === 30 && q === 12);
    }, o.whole ? [3 * q, q] : [q + 1, q]);
  }
  function mixGen(r, d, w0, w1) { return find(function () { return mx(r.int(w0, w1), proper(r, d), d); }, function (fr) { return notIn(fr, EX_MIX); }, mx(w0, 1, d)); }

  /* two mixed numbers (or fractions) for + and −. spec: { d: [d1, d2] choices, w: [lo, hi] (0 = proper), regroup: true|false|null,
   * reduce: true|false|null, whole1 (first is a whole number), excl: ['a+b'…] } */
  function pair(r, spec, op) {
    return find(function () {
      var dd = r.pick(spec.d), a = spec.whole1 ? r.int(spec.w1[0], spec.w1[1]) : mx(r.int(spec.w[0], spec.w[1]), proper(r, dd[0]), dd[0]), b = mx(r.int(spec.w2 ? spec.w2[0] : spec.w[0], spec.w2 ? spec.w2[1] : spec.w[1]), proper(r, dd[1]), dd[1]);
      return [Q(a), Q(b)];
    }, function (v) {
      var a = parts(v[0]), b = parts(v[1]), Ld = lcm(a.n ? a.d : 1, b.n ? b.d : 1), na = a.n * Ld / a.d, nb = b.n * Ld / b.d;
      var res = op === 'add' ? add(v[0], v[1]) : sub(v[0], v[1]), rp = parts(res);
      if (op === 'sub' && !lt(v[1], v[0])) return false;
      if (op === 'sub' && !spec.small && val(res) < 1) return false;
      var rg = op === 'add' ? na + nb >= Ld : na < nb;
      if (spec.regroup != null && rg !== spec.regroup) return false;
      var raw = op === 'add' ? (na + nb) % Ld : (rg ? na + Ld - nb : na - nb);
      if (spec.reduce != null && (raw !== 0 && gcd(raw, Ld) > 1) !== spec.reduce) return false;
      if (!raw && spec.noWhole) return false;
      if (spec.test && !spec.test(v, res)) return false;
      var k = key(v[0]) + (op === 'add' ? '+' : '-') + key(v[1]), k2 = key(v[1]) + '+' + key(v[0]);
      return (spec.excl || []).indexOf(k) < 0 && (op !== 'add' || (spec.excl || []).indexOf(k2) < 0);
    }, null);
  }
  var EX_ADD = ['3/8+1/8', '2/3+1/4', '13/6+7/2', '19/4+13/8', '1/2+1/2'], EX_SUB = ['55/8-19/8', '16/3-11/6', '9-53/16', '29/4-11/3', '21/4-11/4', '21/4-35/8', '63/8-7/3'];
  var EX_MUL = ['2/3*3/5', '4*19/8', '1/2*10/3', '7/4*12/5', '5/2*5/2', '2/3*4/5', '17/5*9/2', '3*189/8'];
  function mulPair(r, gen, test) { return find(function () { return gen(); }, function (v) { var k = key(v[0]) + '*' + key(v[1]), k2 = key(v[1]) + '*' + key(v[0]); return EX_MUL.indexOf(k) < 0 && EX_MUL.indexOf(k2) < 0 && (!test || test(v, mul(v[0], v[1]))); }, null); }

  /* a proper fraction × a mixed number that comes out whole: pick the answer k and the fraction, the mixed number is k ÷ fraction */
  function wholeOf(r, ks, fracs) { return mulPair(r, function () { var fr = r.pick(fracs), k = r.pick(ks); return [R(fr[0], fr[1]), R(k * fr[1], fr[0])]; }, function (v, p) { return !isWhole(v[1]) && val(v[1]) > 1 && val(v[1]) < 13; }); }
  /* a recipe table: amounts × multipliers */
  function recipeTable(r, sh) {
    var rows = sh.ing.map(function (g) { return '\\text{' + g[0] + '}'; }), cols = ['\\text{' + sh.base + ' ' + sh.what + '}'].concat(sh.mult.map(function (m) { return '\\text{' + m[1] + ' ' + sh.what + '}'; }));
    var cells = [], blanks = [], keyCells = [], sol = [];
    sh.ing.forEach(function (g, i) {
      var amt = g[1], u = g[2];
      cells.push([dmT(amt) + '\\text{ ' + u + '}'].concat(sh.mult.map(function () { return null; })));
      var kr = [dmT(amt) + '\\text{ ' + u + '}'];
      sh.mult.forEach(function (m, j) {
        var ans = mul(m[0], amt), pr = Q(m[0]), am = Q(amt);
        blanks.push({ where: 'cell', i: i, j: j + 1, name: g[0] + ', ' + m[1] + ' ' + sh.what, chk: mixChk(ans, { bad: cleanBadR(mulBad(m[0], amt).concat([[add(amt, m[0]), 'u3-mul-added', 'Multiply the amount by ' + t(dmT(m[0])) + ' (the number of batches).']]), ans) }) });
        kr.push(mT(ans));
        sol.push(g[0] + ', ' + m[1] + ': ' + t(fT(pr) + '\\times ' + impT(am) + '=\\frac{' + pr[0] * am[0] + '}{' + pr[1] * am[1] + '}' + ('\\frac{' + pr[0] * am[0] + '}{' + pr[1] * am[1] + '}' === mT(ans) ? '' : '=' + mT(ans))) + ' ' + u);
      });
      keyCells.push(kr);
    });
    return tablePart('Complete the table. Write each amount as a whole number, a fraction or a mixed number in simplest form.', { rows: rows, cols: cols, cells: cells, corner: '\\text{Ingredient}' }, blanks, { rows: rows, cols: cols, cells: keyCells }, sol.join('<br>'),
      ['Multiply each amount by the number of batches: ' + sh.mult.map(function (m) { return t(dmT(m[0])) + ' for ' + m[1]; }).join(', ') + '.', 'Change each mixed number to an improper fraction first.'], 'recipe table');
  }

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u3l1', unit: 3, num: '1', title: 'Fractions Refresher: Mixed Numbers', outcome: 'REV',
    blurb: 'Mixed numbers and improper fractions; adding, subtracting and multiplying them; estimating and checking with the calculator.',
    questions: [
      { num: '1', stem: 'Write each picture as a mixed number and as an improper fraction.', parts: [
        { id: '1a', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(1, 4), r.pick([2, 3, 4, 5, 6, 8]), 0]; }, function (v) { v[2] = r.int(1, v[1] - 1); return gcd(v[2], v[1]) === 1 && !(v[0] === 2 && v[1] === 5 && v[2] === 3) && !(v[0] === 2 && v[1] === 4 && v[2] === 3) && !(v[0] === 5 && v[1] === 4); }, [3, 3, 1]);
          var fr = mx(v[0], v[2], v[1]);
          return rowsPart('(a) ' + bars(v[0], v[1], v[2]), [mixRow('Mixed number:', fr, { bad: [[R(v[2], v[1]), 'u3-pic-count', 'Count the full bars too: each one is a whole.'], [mx(v[0] + 1, v[2], v[1]), 'u3-pic-count', 'Count only the <b>full</b> bars as wholes. The last bar is only partly shaded.']] }),
            mixRow('Improper fraction:', fr, { want: 'improper', bad: [[R((v[0] + 1) * v[1], v[1]), 'u3-pic-all', 'Count only the <b>shaded</b> parts.'], [R(v[0] + v[2], v[1]), 'u3-imp-nomult', 'Each full bar has ' + v[1] + ' parts. Count every shaded part.'], [R(v[0] * v[1] + v[2], (v[0] + 1) * v[1]), 'u3-pic-all', 'The bottom number is the number of parts in <b>one</b> bar (' + v[1] + ').']] })],
            lines(['Each bar is cut into ' + v[1] + ' parts. ' + v[0] + ' full bar' + (v[0] > 1 ? 's' : '') + ' and ' + v[2] + ' more part' + (v[2] > 1 ? 's' : '') + ': ' + t(rawT(v[0], v[2], v[1])), v[0] + ' wholes is ' + t(v[0] + '\\times ' + v[1] + '=' + v[0] * v[1]) + ' parts, plus ' + v[2] + ': ' + t('\\frac{' + (v[0] * v[1] + v[2]) + '}{' + v[1] + '}')]),
            ['Each full bar is one whole. The partly shaded bar gives the fraction part.', 'For the improper fraction, count every shaded part. The bottom number is the parts in one bar.'], 'bars ' + v.join(','));
        } },
        { id: '1b', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(1, 3), r.pick([3, 4, 6, 8]), 0]; }, function (v) { v[2] = r.int(1, v[1] - 1); return gcd(v[2], v[1]) === 1 && !(v[0] === 1 && v[1] === 6 && v[2] === 5); }, [2, 4, 3]);
          var fr = mx(v[0], v[2], v[1]);
          return rowsPart('(b) ' + pies(v[0], v[1], v[2]), [mixRow('Mixed number:', fr, { bad: [[R(v[2], v[1]), 'u3-pic-count', 'Count the full circles too: each one is a whole.']] }),
            mixRow('Improper fraction:', fr, { want: 'improper', bad: [[R((v[0] + 1) * v[1], v[1]), 'u3-pic-all', 'Count only the <b>shaded</b> parts.'], [R(v[0] + v[2], v[1]), 'u3-imp-nomult', 'Each full circle has ' + v[1] + ' parts. Count every shaded part.']] })],
            lines(['Each circle is cut into ' + v[1] + ' parts: ' + v[0] + ' full and ' + v[2] + ' more part' + (v[2] > 1 ? 's' : '') + ': ' + t(rawT(v[0], v[2], v[1])), t(v[0] + '\\times ' + v[1] + '+' + v[2] + '=' + (v[0] * v[1] + v[2])) + ' parts: ' + t('\\frac{' + (v[0] * v[1] + v[2]) + '}{' + v[1] + '}')]),
            ['Each full circle is one whole.', 'Count the shaded parts for the top of the improper fraction.'], 'pies ' + v.join(','));
        } },
        { id: '1c', level: 'BEG', make: function (r) {
          var v = find(function () { var d = r.pick([4, 5, 6, 8]); return [r.int(1, 2), d, proper(r, d)]; }, function (v) { return !(v[0] === 2 && v[1] === 4 && v[2] === 3); }, [1, 8, 5]), n = v[0] * v[1] + v[2];
          return numPart('(c) You want to shade the bars to show ' + t(rawT(v[0], v[2], v[1], true)) + '. Each bar is cut into ' + v[1] + ' equal parts.<br>' + bars(v[0], v[1], v[2], { empty: true }) + '<br>How many parts would you shade in all?', n,
            { after: 'parts', bad: [[v[2], 'u3-pic-count', 'Shade the whole bar' + (v[0] > 1 ? 's' : '') + ' too: ' + v[0] + ' whole' + (v[0] > 1 ? 's' : '') + ' is ' + v[0] * v[1] + ' parts.'], [v[0] + v[2], 'u3-imp-nomult', 'A whole bar is ' + v[1] + ' parts, not 1.'], [(v[0] + 1) * v[1], 'u3-pic-all', 'The last bar is only partly shaded: ' + v[2] + ' of its ' + v[1] + ' parts.']],
              sol: 'Shade all ' + v[1] + ' parts of ' + (v[0] > 1 ? 'the first ' + v[0] + ' bars' : 'the first bar') + ' and ' + v[2] + ' parts of the next bar.<br>' + t(v[0] + '\\times ' + v[1] + '+' + v[2] + '=' + n) + ' parts ' + t('\\left(\\frac{' + n + '}{' + v[1] + '}\\right)') + '.', hints: ['Each whole is a full bar of ' + v[1] + ' parts.'], text: 'shade ' + v.join(',') });
        } }] },
      { num: '2', stem: 'Write each improper fraction as a mixed number (or a whole number) in simplest form.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var v = impGen(r, 2, 5, 19); return improperPart(r, v[0], v[1]); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = impGen(r, 5, 11, 39); return improperPart(r, v[0], v[1]); } },
        { id: '2c', level: 'BEG', make: function (r) { var v = impGen(r, 6, 13, 47); return improperPart(r, v[0], v[1]); } },
        { id: '2d', level: 'EMG', make: function (r) { var v = impGen(r, 8, 18, 62, { reduce: true }); return improperPart(r, v[0], v[1]); } },
        { id: '2e', level: 'BEG', make: function (r) { var q = r.pick([3, 4, 6, 7, 9]), v = impGen(r, q, 2 * q, 8 * q, { whole: true }); return improperPart(r, v[0], v[1]); } },
        { id: '2f', level: 'EMG', make: function (r) { var v = impGen(r, 12, 26, 70, { reduce: true }); return improperPart(r, v[0], v[1]); } }] },
      { num: '3', stem: 'Write each mixed number as an improper fraction.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 4, 2, 5)); } },
        { id: '3b', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 5, 2, 6)); } },
        { id: '3c', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 8, 3, 7)); } },
        { id: '3d', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 6, 4, 9)); } },
        { id: '3e', level: 'EMG', make: function (r) { return improperFrom(mixGen(r, r.pick([3, 4]), 10, 12)); } },
        { id: '3f', level: 'EMG', make: function (r) { return improperFrom(mixGen(r, 16, 5, 9)); } }] },
      { num: '4', stem: function (sh) { return 'A pizza place cuts every pizza into ' + sh.s + ' slices.'; },
        shared: function (r) {
          var s = r.pick([8, 8, 6, 12]), fr = s === 8 ? r.pick([[1, 4], [3, 4], [1, 2]]) : s === 6 ? r.pick([[1, 3], [2, 3], [1, 2]]) : r.pick([[1, 4], [3, 4], [1, 3], [2, 3]]);
          var N = find(function () { return r.int(2 * s + 1, 5 * s - 1); }, function (n) { return n % s !== 0 && gcd(n % s, s) === 1; }, 2 * s + 1);
          return { s: s, N: N, w: r.int(2, 6), f: fr };
        },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) {
            var fr = R(sh.N, sh.s);
            return mixPart('(a) At a class party, students ate ' + sh.N + ' slices. How many pizzas is that, as a mixed number?', fr, { after: 'pizzas', bad: mixedBad(sh.N, sh.s).concat([[R(sh.s, sh.N), 'u3-div-way', 'Each pizza is ' + sh.s + ' slices: divide the ' + sh.N + ' slices by ' + sh.s + '.']]),
              sol: 'Each slice is ' + t('\\frac{1}{' + sh.s + '}') + ' of a pizza, so ' + sh.N + ' slices is ' + t('\\frac{' + sh.N + '}{' + sh.s + '}') + '.<br>' + lines(toMixedSteps(sh.N, sh.s)) + '<br>They ate ' + D(fr) + ' pizzas.', hints: ['Each slice is ' + t('\\frac{1}{' + sh.s + '}') + ' of a pizza.', 'Divide the slices by ' + sh.s + '.'], text: 'pizza slices ' + sh.N });
          } },
          { id: '4b', level: 'EMG', make: function (r, sh) {
            var m = mx(sh.w, sh.f[0], sh.f[1]), n = val(mul(m, sh.s)), fs = sh.f[0] * sh.s / sh.f[1];
            return numPart('(b) The hockey team ate ' + D(m) + ' pizzas. How many slices is that?', n, { after: 'slices', bad: [[sh.w * sh.s + sh.f[0], 'u3-scoop', 'The ' + t('\\frac{' + sh.f[0] + '}{' + sh.f[1] + '}') + ' pizza is not ' + sh.f[0] + ' slice' + (sh.f[0] > 1 ? 's' : '') + '. A pizza has ' + sh.s + ' slices: ' + t('\\frac{' + sh.f[0] + '}{' + sh.f[1] + '}=\\frac{' + fs + '}{' + sh.s + '}') + '.'], [sh.w * sh.f[1] + sh.f[0], 'u3-scoop', 'Count in slices (' + sh.s + 'ths), not in ' + (sh.f[1] === 2 ? 'halves' : sh.f[1] === 3 ? 'thirds' : 'quarters') + '.'], [sh.w * sh.s, 'u3-one-piece', 'Add the slices in the ' + t('\\frac{' + sh.f[0] + '}{' + sh.f[1] + '}') + ' pizza too.']],
              sol: t(rawT(sh.w, sh.f[0], sh.f[1]) + '=' + rawT(sh.w, fs, sh.s) + '=\\frac{' + sh.w + '\\times ' + sh.s + '+' + fs + '}{' + sh.s + '}=\\frac{' + n + '}{' + sh.s + '}') + ', so ' + n + ' slices.', hints: ['Write the fraction part in ' + sh.s + 'ths first.', 'Then change the mixed number to an improper fraction: the top is the number of slices.'], text: 'slices ' + plainMix(m) });
          } }] },
      { num: '5', stem: 'Add. Write each answer in simplest form.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var v = pair(r, { d: [[5, 5], [7, 7], [9, 9], [11, 11]], w: [0, 0], regroup: false, reduce: false, excl: EX_ADD }, 'add') || [[2, 5], [1, 5]]; return opPart('add', v); } },
        { id: '5b', level: 'EMG', make: function (r) { var v = pair(r, { d: [[2, 8], [2, 6], [3, 6], [4, 8], [2, 10], [3, 9], [4, 12]], w: [0, 0], regroup: false, excl: EX_ADD }, 'add') || [[1, 2], [3, 8]]; return opPart('add', v); } },
        { id: '5c', level: 'EMG', make: function (r) { var v = pair(r, { d: [[4, 4], [6, 6], [8, 8], [10, 10]], w: [1, 6], regroup: false, reduce: true, excl: EX_ADD }, 'add') || [[13, 4], [9, 4]]; return opPart('add', v); } },
        { id: '5d', level: 'EMG', make: function (r) { var v = pair(r, { d: [[3, 6], [2, 6], [4, 8], [5, 10], [3, 9], [2, 8]], w: [1, 6], regroup: false, reduce: false, excl: EX_ADD }, 'add') || [[5, 3], [25, 6]]; return opPart('add', v); } },
        { id: '5e', level: 'PRG', make: function (r) { var v = pair(r, { d: [[4, 8], [3, 6], [2, 8], [4, 16], [2, 6]], w: [1, 7], regroup: true, excl: EX_ADD }, 'add') || [[27, 4], [21, 8]]; return opPart('add', v); } },
        { id: '5f', level: 'PRG', make: function (r) { var v = pair(r, { d: [[5, 2], [3, 4], [4, 5], [3, 5], [2, 3], [4, 3]], w: [1, 6], regroup: true, excl: EX_ADD }, 'add') || [[19, 5], [5, 2]]; return opPart('add', v); } }] },
      { num: '6', stem: 'Subtract. Write each answer in simplest form.', parts: [
        { id: '6a', level: 'EMG', make: function (r) { var v = pair(r, { d: [[8, 8], [6, 6], [10, 10], [12, 12]], w: [2, 7], w2: [1, 3], regroup: false, reduce: true, noWhole: true, excl: EX_SUB }, 'sub') || [[47, 8], [11, 8]]; return opPart('sub', v); } },
        { id: '6b', level: 'EMG', make: function (r) { var v = pair(r, { d: [[6, 3], [8, 4], [10, 5], [8, 2], [12, 4], [6, 2]], w: [3, 7], w2: [1, 3], regroup: false, noWhole: true, excl: EX_SUB }, 'sub') || [[29, 6], [7, 3]]; return opPart('sub', v); } },
        { id: '6c', level: 'PRG', make: function (r) { var v = pair(r, { d: [[4, 4], [8, 8], [6, 6], [5, 5]], w: [4, 8], w2: [1, 3], regroup: true, excl: EX_SUB }, 'sub') || [[25, 4], [15, 4]]; return opPart('sub', v); } },
        { id: '6d', level: 'PRG', make: function (r) { var v = pair(r, { d: [[1, 5], [1, 3], [1, 8], [1, 4], [1, 16]], whole1: true, w1: [5, 12], w: [1, 4], regroup: true, excl: EX_SUB }, 'sub') || [[8, 1], [13, 5]]; return opPart('sub', v); } },
        { id: '6e', level: 'PRG', make: function (r) { var v = pair(r, { d: [[3, 4], [2, 5], [4, 5], [3, 5], [2, 3]], w: [5, 9], w2: [1, 4], regroup: true, excl: EX_SUB }, 'sub') || [[22, 3], [19, 4]]; return opPart('sub', v); } },
        { id: '6f', level: 'PRG', make: function (r) { var v = pair(r, { d: [[8, 2], [8, 4], [6, 3], [12, 4], [16, 8], [10, 2]], w: [6, 12], w2: [2, 6], regroup: true, excl: EX_SUB }, 'sub') || [[81, 8], [11, 2]]; return opPart('sub', v); } }] },
      { num: '7', stem: function (sh) { return 'A wall is framed with wood studs that are ' + D(sh.stud) + ' in thick. It has ' + D(sh.a) + ' in drywall on one side and ' + D(sh.b) + ' in drywall on the other side.'; },
        shared: function (r) {
          var stud = r.pick([[7, 2], [11, 2]]), dw = r.pick([[[1, 2], [5, 8]], [[5, 8], [5, 8]], [[1, 2], [1, 2]], [[3, 8], [5, 8]], [[1, 2], [3, 8]]]), tot = sumR([stud, dw[0], dw[1]]);
          var k = r.pick([1, 3, 2]) * (r.chance(0.6) ? -1 : 1), frame = add(tot, R(k, 16));
          return { stud: stud, a: dw[0], b: dw[1], tot: tot, k: k, frame: frame };
        },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return opPart('add', [sh.stud, sh.a, sh.b], { prompt: '(a) How thick is the finished wall?', after: 'in', final: function (a) { return 'The wall is ' + t(a) + ' in thick.'; }, text: 'wall thickness' }); } },
          { id: '7bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            var deeper = sh.k > 0;
            return P.mc(r, '(b) A door frame is ' + D(sh.frame) + ' in deep. Is it deeper or shallower than the wall?', [
              { html: '<b>Deeper</b> than the wall', right: deeper, why: deeper ? null : 'Write both in 16ths and compare: ' + t(dmT(sh.tot) + '=' + rawT(parts(sh.tot).w, parts(sh.tot).n * 16 / parts(sh.tot).d, 16, true)) + '.', code: 'deeper' },
              { html: '<b>Shallower</b> than the wall', right: !deeper, why: !deeper ? null : 'Write both in 16ths and compare: ' + t(dmT(sh.tot) + '=' + rawT(parts(sh.tot).w, parts(sh.tot).n * 16 / parts(sh.tot).d, 16, true)) + '.', code: 'shallower' },
              { html: 'The same depth as the wall', why: 'Write both with a denominator of 16 and compare the tops.', code: 'same' }],
              'Wall: ' + t(dmT(sh.tot) + '=' + rawT(parts(sh.tot).w, parts(sh.tot).n * 16 / parts(sh.tot).d, 16, true)) + ' in. Frame: ' + D(sh.frame) + ' in.<br>The frame is ' + (deeper ? 'deeper' : 'shallower') + '.', ['Write the wall thickness from (a) in 16ths.'], 'frame deeper', true);
          } },
          { id: '7bii', sub: 'b ii', level: 'PRG', make: function (r, sh) {
            var big = sh.k > 0 ? sh.frame : sh.tot, sm = sh.k > 0 ? sh.tot : sh.frame, ans = R(Math.abs(sh.k), 16);
            return opPart('sub', [big, sm], { prompt: '(b) By how much?', after: 'in', bad: [[add(sh.tot, sh.frame), 'u3-added', 'Subtract to find the difference.']], final: function (a) { return 'The frame is ' + t(a) + ' in ' + (sh.k > 0 ? 'deeper' : 'shallower') + ' than the wall.'; }, text: 'frame difference' });
          } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.pick([72, 96, 60, 84, 120]), mx(r.int(20, 31), r.pick([1, 3, 5, 7]), 8), mx(r.int(12, 19), r.pick([1, 3]), 4)]; }, function (v) { return val(add(v[1], v[2])) < v[0] - 4 && !(v[0] === 72 && eq(v[1], mx(29, 5, 8)) && eq(v[2], mx(17, 3, 4)) && false); }, [72, mx(29, 5, 8), mx(17, 3, 4)]);
          var used = add(v[1], v[2]), left = sub(v[0], used);
          var sol = ['Used: ' + addSteps([v[1], v[2]]).join(', ').replace(/<br>/g, ', '), 'Left: ' + subSteps(v[0], used).join(', '), t(dmT(left)) + ' in of the board is left.'];
          var who = r.pick([['Lucas', 'He'], ['Priya', 'She'], ['Nolan', 'He'], ['Ava', 'She']]);
          return mixPart(who[0] + ' has a ' + v[0] + ' in board. ' + who[1] + ' cuts off one piece ' + D(v[1]) + ' in long and another piece ' + D(v[2]) + ' in long. Ignoring the saw cuts, how much of the board is left?', left,
            { after: 'in', bad: [[sub(v[0], v[1]), 'u3-one-piece', 'Take away <b>both</b> pieces.'], [sub(v[0], v[2]), 'u3-one-piece', 'Take away <b>both</b> pieces.'], [used, 'u3-one-piece', 'That’s the length used. Subtract it from the ' + v[0] + ' in board.'], [add(v[0] - parts(used).w, R(parts(used).n, parts(used).d)), 'u3-whole-borrow', 'To take a mixed number from a whole number, regroup: ' + t(v[0] + '=' + rawT(v[0] - 1, parts(used).d, parts(used).d)) + '.']].concat(addBad([v[1], v[2]]).map(function (b) { return [sub(v[0], b[0]), b[1], b[2]]; })),
              sol: lines(sol), hints: ['Add the two pieces first.', 'Then subtract from the whole board. Regroup the whole number: ' + t('72=71\\frac{8}{8}') + '.'], text: 'board left' });
        } }] },
      { num: '9', stem: 'Multiply. Write each answer in simplest form.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { var v = mulPair(r, function () { var d2 = r.pick([3, 5, 6, 8, 9]); return [R(r.int(1, 3), r.pick([2, 3, 4, 5])), R(r.int(1, d2 - 1), d2)]; }, function (v, p) { var a = Q(v[0]), b = Q(v[1]); return a[0] < a[1] && b[0] < b[1] && gcd(a[0] * b[0], a[1] * b[1]) > 1; }) || [[3, 4], [2, 3]]; return opPart('mul', v); } },
        { id: '9b', level: 'EMG', make: function (r) { var v = mulPair(r, function () { var d = r.pick([2, 3, 4, 5]); return [[d * r.int(1, 2), 1], mx(r.int(1, 3), proper(r, d), d)]; }, function (v, p) { return isWhole(p) && val(v[0]) < 9; }) || [[3, 1], [5, 3]]; return opPart('mul', v); } },
        { id: '9c', level: 'EMG', make: function (r) { var v = mulPair(r, function () { var d = r.pick([4, 8, 6]); return [[r.pick([2, 4, 6, 3]), 1], mx(r.int(1, 4), proper(r, d), d)]; }, function (v, p) { return !isWhole(p) && gcd(Q(v[0])[0], Q(v[1])[1]) > 1; }) || [[6, 1], [11, 4]]; return opPart('mul', v); } },
        { id: '9d', level: 'EMG', make: function (r) { var v = mulPair(r, function () { var d = r.pick([4, 3, 8, 5]); return [[1, 2], mx(r.int(2, 6), proper(r, d), d)]; }, function (v, p) { return Q(p)[1] === 2 * Q(v[1])[1]; }) || [[1, 2], [21, 4]]; return opPart('mul', v); } },
        { id: '9e', level: 'PRG', make: function (r) { var v = wholeOf(r, [2, 3, 4, 5, 6], [[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [1, 3], [1, 4], [3, 8]]) || [[2, 3], [9, 2]]; return opPart('mul', v, { of: true }); } },
        { id: '9f', level: 'PRG', make: function (r) { var v = mulPair(r, function () { var d1 = r.pick([2, 3, 4]), d2 = r.pick([2, 3, 4, 5]); return [mx(r.int(1, 3), proper(r, d1), d1), mx(r.int(1, 3), proper(r, d2), d2)]; }, function (v, p) { return !isWhole(p) && parts(v[0]).d !== parts(v[1]).d && gcd(Q(v[0])[0] * Q(v[1])[0], Q(v[0])[1] * Q(v[1])[1]) > 1; }) || [[7, 3], [3, 2]]; return opPart('mul', v); } }] },
      { num: '10', stem: function (sh) { return 'Mia worked out ' + D(sh.a) + ' × ' + D(sh.b) + ' like this: ' + t(parts(sh.a).w + '\\times ' + parts(sh.b).w + '=' + parts(sh.a).w * parts(sh.b).w) + ' and ' + t('\\frac{' + parts(sh.a).n + '}{' + parts(sh.a).d + '}\\times\\frac{' + parts(sh.b).n + '}{' + parts(sh.b).d + '}=\\frac{' + parts(sh.a).n * parts(sh.b).n + '}{' + parts(sh.a).d * parts(sh.b).d + '}') + ', so the answer is ' + t(rawT(parts(sh.a).w * parts(sh.b).w, parts(sh.a).n * parts(sh.b).n, parts(sh.a).d * parts(sh.b).d, true)) + '.'; },
        shared: function (r) { return find(function () { return { a: mx(r.int(2, 5), 1, 2), b: mx(r.int(2, 4), r.pick([1, 3]), 4) }; }, function (s) { var A = parts(s.a), B = parts(s.b); return gcd(A.n * B.n, A.d * B.d) === 1 && !(A.w === 2 && B.w === 2) && !(A.w === 3 && B.w === 2 && B.n === 1); }, { a: mx(3, 1, 2), b: mx(2, 1, 4) }); },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) {
            var A = parts(sh.a), B = parts(sh.b), lo = mul(sh.a, B.w), mia = add(A.w * B.w, R(A.n * B.n, A.d * B.d));
            return P.mc(r, '(a) Which estimate shows that her answer is too small?', [
              { html: t(dmT(sh.a) + '\\times ' + B.w + '=' + dmT(lo)) + ' already, and ' + D(sh.b) + ' is more than ' + B.w + '. So the answer is more than ' + t(dmT(lo)) + '.', right: true },
              { html: t(A.w + '\\times ' + B.w + '=' + A.w * B.w) + ', so the answer should be exactly ' + (A.w * B.w) + '.', why: 'Both mixed numbers are <b>more</b> than their whole numbers, so the answer is more than ' + A.w * B.w + ' — and it isn’t a whole number.', code: 'exact' },
              { html: t((A.w + 1) + '\\times ' + (B.w + 1) + '=' + (A.w + 1) * (B.w + 1)) + ', so the answer should be about ' + (A.w + 1) * (B.w + 1) + '.', why: B.n === 1 ? t(dmT(sh.b)) + ' rounds <b>down</b> to ' + B.w + ', not up.' : 'That rounds both up a lot. Use a closer estimate: multiply ' + D(sh.a) + ' by ' + B.w + '.', code: 'up' },
              { html: 'Her answer is not too small: multiplying the parts separately always works.', why: 'It leaves out ' + t(A.w + '\\times\\frac{' + B.n + '}{' + B.d + '}') + ' and ' + t('\\frac{1}{2}\\times ' + B.w) + '.', code: 'fine' }],
              t(dmT(sh.a) + '\\times ' + B.w + '=' + dmT(lo)) + ' already, and ' + D(sh.b) + ' is more than ' + B.w + '. So the answer must be more than ' + t(dmT(lo)) + ', not ' + t(dmT(mia)) + '.', ['Multiply ' + D(sh.a) + ' by just the whole number ' + B.w + ' first.'], 'Mia estimate');
          } },
          { id: '10b', level: 'PRG', make: function (r, sh) { return opPart('mul', [sh.a, sh.b], { prompt: '(b) Find the correct answer.', text: 'Mia correct' }); } }] },
      { num: '11', stem: function (sh) { return 'A ' + sh.food + ' recipe makes ' + sh.base + ' ' + sh.what + '. Complete the table to make ' + sh.mult.map(function (m) { return m[1] + ' ' + sh.what + ' (' + t(dmT(m[0])) + ' batch' + (val(m[0]) > 1 ? 'es' : '') + ')'; }).join(' and ') + '.'; },
        shared: function (r) {
          var R0 = r.pick([{ food: 'muffin', what: 'muffins', base: 12, ing: [['Flour', mx(2, 1, 4), 'cups'], ['Brown sugar', R(2, 3), 'cup'], ['Milk', mx(1, 1, 4), 'cups'], ['Butter', R(1, 3), 'cup']] },
            { food: 'cookie', what: 'cookies', base: 24, ing: [['Flour', mx(2, 3, 4), 'cups'], ['Sugar', R(3, 4), 'cup'], ['Oats', mx(1, 1, 2), 'cups'], ['Butter', R(2, 3), 'cup']] },
            { food: 'bannock', what: 'pieces', base: 8, ing: [['Flour', mx(3, 1, 2), 'cups'], ['Water', mx(1, 1, 3), 'cups'], ['Baking powder', mx(1, 1, 2), 'tbsp'], ['Lard', R(1, 4), 'cup']] },
            { food: 'pancake', what: 'pancakes', base: 16, ing: [['Flour', mx(1, 1, 2), 'cups'], ['Milk', mx(1, 2, 3), 'cups'], ['Sugar', mx(2, 1, 4), 'tbsp'], ['Oil', R(1, 3), 'cup']] }]);
          var mult = r.pick([[[[3, 2], '1\\frac{1}{2}'], [[1, 2], '\\frac{1}{2}']], [[[2, 1], '2'], [[1, 2], '\\frac{1}{2}']], [[[5, 2], '2\\frac{1}{2}'], [[1, 2], '\\frac{1}{2}']]]);
          return { food: R0.food, what: R0.what, base: R0.base, ing: R0.ing, mult: mult.map(function (m) { return [m[0], R0.base * m[0][0] / m[0][1]]; }) };
        },
        parts: [{ id: '11', level: 'PRG', make: function (r, sh) { return recipeTable(r, sh); } }] },
      { num: '12', stem: function (sh) { return sh.who + ' is sewing ' + sh.n + ' cushion covers. Each cover needs ' + D(sh.each) + ' yd of fabric. She bought ' + sh.B + ' yd.'; },
        shared: function (r) { return find(function () { var each = mx(1, r.pick([1, 3, 5, 7]), 8), n = r.int(4, 7), need = mul(n, each); return { who: r.pick(['Grace', 'Sana', 'Leah', 'Maria']), each: each, n: n, need: need, B: Math.ceil(val(need)) + r.int(0, 1) }; }, function (s) { var left = sub(s.B, s.need); return !lt(left, R(1, 8)) && !isWhole(s.need) && !eq(left, s.each); }, { who: 'Grace', each: mx(1, 3, 8), n: 5, need: R(55, 8), B: 8 }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) { return opPart('mul', [sh.n, sh.each], { prompt: '(a) How much fabric does she need for the ' + sh.n + ' covers?', after: 'yd', bad: [[add(sh.n, sh.each), 'u3-mul-added', 'Multiply: ' + sh.n + ' covers × ' + D(sh.each) + ' yd each.']], text: 'covers fabric' }); } },
          { id: '12b', level: 'PRG', make: function (r, sh) { return opPart('sub', [sh.B, sh.need], { prompt: '(b) How much fabric will be left over?', after: 'yd', text: 'fabric left' }); } },
          { id: '12c', level: 'EMG', make: function (r, sh) {
            var left = sub(sh.B, sh.need), enough = !lt(left, sh.each), diff = enough ? sub(left, sh.each) : sub(sh.each, left);
            return P.mc(r, '(c) Is the leftover fabric enough for one more cover?', [
              { html: '<b>Yes.</b> ' + t(dmT(left)) + ' yd is more than the ' + D(sh.each) + ' yd a cover needs.', right: enough, why: enough ? null : 'Compare ' + t(dmT(left)) + ' with ' + D(sh.each) + ': write both in 8ths.', code: 'yes' },
              { html: '<b>No.</b> A cover needs ' + D(sh.each) + ' yd, and ' + t(dmT(left)) + ' yd is less than that.', right: !enough, why: !enough ? null : 'Compare ' + t(dmT(left)) + ' with ' + D(sh.each) + ': write both in 8ths.', code: 'no' },
              { html: '<b>Yes.</b> There is some fabric left over, so she can make another one.', why: 'Some fabric is not enough: a cover needs ' + D(sh.each) + ' yd. Compare.', code: 'any' }],
              (enough ? 'Yes: ' + t(dmT(left)) + ' yd is more than ' + D(sh.each) + ' yd, with ' + t(dmT(diff)) + ' yd to spare.' : 'No: a cover needs ' + D(sh.each) + ' yd, and ' + t(dmT(left)) + ' yd is ' + t(dmT(diff)) + ' yd short.'), ['Compare the leftover from (b) with the fabric one cover needs.'], 'one more cover');
          } }] },
      { num: '13', stem: function (sh) { return 'A landscaper puts plastic edging along three garden beds. The beds need ' + sh.L.map(function (x) { return D(x) + ' ft'; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' of edging.'; },
        shared: function (r) { return find(function () { return { L: [mx(r.int(8, 14), r.pick([1, 3]), 4), mx(r.int(6, 12), r.pick([1, 3, 5, 7]), 8), mx(r.int(10, 17), 1, 2)], roll: r.pick([20, 25, 50]) }; }, function (s) { var T = val(sumR(s.L)); return Math.ceil(T / s.roll) !== Math.floor(T / s.roll) && Math.ceil(T / s.roll) >= 2 && Math.ceil(T / s.roll) <= 4 && s.L.some(function (x) { return parts(x).n / parts(x).d < 0.5; }); }, { L: [mx(12, 3, 4), mx(9, 5, 8), mx(15, 1, 2)], roll: 20 }); },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, sh) {
            var rd = sh.L.map(function (x) { var a = parts(x); return a.w + (a.n / a.d >= 0.5 ? 1 : 0); }), e = rd.reduce(function (s, x) { return s + x; }, 0), dn = sh.L.reduce(function (s, x) { return s + parts(x).w; }, 0), up = sh.L.reduce(function (s, x) { return s + parts(x).w + 1; }, 0);
            return numPart('(a) Estimate the total length by rounding each one to the nearest foot.', e, { after: 'ft', bad: [[dn, 'u3-est-down', 'Round <b>up</b> when the fraction part is ' + t('\\frac{1}{2}') + ' or more.'], [up, 'u3-est-down', 'Round <b>down</b> when the fraction part is less than ' + t('\\frac{1}{2}') + '.']],
              sol: sh.L.map(function (x, i) { return t(dmT(x) + '\\approx ' + rd[i]); }).join(', ') + '<br>' + t(rd.join('+') + '=' + e) + ' ft', hints: ['A fraction part of ' + t('\\frac{1}{2}') + ' or more rounds up; less than ' + t('\\frac{1}{2}') + ' rounds down.'], text: 'edging estimate' });
          } },
          { id: '13b', level: 'PRG', make: function (r, sh) { return opPart('add', sh.L, { prompt: '(b) Find the exact total. Check it with your calculator.', after: 'ft', text: 'edging exact' }); } },
          { id: '13c', level: 'EMG', make: function (r, sh) {
            var T = sumR(sh.L), n = Math.ceil(val(T) / sh.roll);
            return numPart('(c) Edging is sold in ' + sh.roll + ' ft rolls. How many rolls does the landscaper need?', n, { after: 'rolls', bad: [[n - 1, 'u3-rolls-down', (n - 1) + ' roll' + (n > 2 ? 's' : '') + ' give' + (n > 2 ? '' : 's') + ' only ' + (n - 1) * sh.roll + ' ft, which is less than ' + t(dmT(T)) + ' ft. Round <b>up</b>.']],
              sol: (n - 1) + ' roll' + (n > 2 ? 's are ' : ' is ') + (n - 1) * sh.roll + ' ft (too short). ' + n + ' rolls are ' + n * sh.roll + ' ft, which is more than ' + t(dmT(T)) + ' ft.<br>The landscaper needs ' + n + ' rolls.', hints: ['Compare the total from (b) with 1 roll, 2 rolls, 3 rolls…', 'You can’t buy part of a roll.'], text: 'rolls' });
          } }] },
      { num: '14', stem: 'A shop drawing gives some lengths as decimals. Write each one as a mixed number of inches in simplest form, and write (d) as a decimal.', parts: [
        { id: '14a', level: 'EMG', make: function (r) { var ds = find(function () { return r.int(1, 12) + r.pick(['.25', '.75', '.5']); }, function (s) { return ['3.75'].indexOf(s) < 0; }, '2.75'), c = decToFrac(ds); return mixPart('(a) ' + ds + ' in', c.fr, { after: 'in', sol: lines(c.lines), hints: ['Write the decimal part as a fraction over 10, 100 or 1000, then simplify.'], text: 'dec to mixed ' + ds }); } },
        { id: '14b', level: 'EMG', make: function (r) { var ds = find(function () { return r.int(1, 12) + r.pick(['.125', '.375', '.625', '.875']); }, function (s) { return ['16.375', '4.625'].indexOf(s) < 0; }, '5.125'), c = decToFrac(ds); return mixPart('(b) ' + ds + ' in', c.fr, { after: 'in', sol: lines(c.lines), hints: ['Three decimal places: write the decimal part over 1000, then simplify.', 'Or use the calculator: [2nd] [F◂▸D].'], text: 'dec to mixed ' + ds }); } },
        { id: '14c', level: 'PRG', make: function (r) { var ds = r.int(1, 9) + r.pick(['.0625', '.1875', '.3125', '.4375', '.5625', '.6875', '.8125', '.9375']), c = decToFrac(ds); return mixPart('(c) ' + ds + ' in', c.fr, { after: 'in', sol: lines(c.lines), hints: ['Four decimal places: write the decimal part over 10 000, then simplify (it comes out in 16ths).', 'Or use the calculator: [2nd] [F◂▸D].'], text: 'dec to mixed ' + ds }); } },
        { id: '14d', level: 'EMG', make: function (r) {
          var fr = find(function () { return mx(r.int(2, 12), r.pick([1, 3, 5, 7]), 8); }, function (f) { return !eq(f, mx(16, 3, 8)) && !eq(f, mx(4, 5, 8)); }, mx(6, 3, 8)), a = parts(fr), x = val(fr);
          return decPart('(d) ' + D(fr) + ' in', fr, { after: 'in', bad: [[a.w + a.n / 10, 'u3-digits', 'A fraction doesn’t become a decimal by writing its digits. Divide: ' + t(a.n + '\\div ' + a.d) + '.'], [a.w + a.d / a.n, 'u3-div-way', 'Divide the <b>top</b> by the bottom: ' + t(a.n + '\\div ' + a.d) + '.'], [a.n / a.d, 'u3-lost-whole', 'Add the whole number ' + a.w + ' too.']],
            sol: t(a.n + '\\div ' + a.d + '=' + decS(R(a.n, a.d))) + ', so ' + D(fr) + ' in ' + t('=' + decS(fr)) + ' in', hints: ['Divide the top of the fraction by the bottom, then add the whole number.'], text: 'mixed to dec ' + plainMix(fr) });
        } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'ADV', make: function (r) {
          var v = find(function () { return { n: r.int(10, 16), w: r.pick([mx(5, 1, 2), mx(3, 1, 2), mx(7, 1, 4)]), g: r.pick([R(3, 4), R(1, 2), R(5, 8), R(1, 4)]), who: r.pick(['Ravi', 'Jordan', 'Mei', 'Owen']) }; }, function (v) { return !isWhole(add(mul(v.n, v.w), mul(v.n - 1, v.g))); }, { n: 14, w: mx(5, 1, 2), g: R(3, 4), who: 'Ravi' });
          var bd = mul(v.n, v.w), gp = mul(v.n - 1, v.g), ans = add(bd, gp);
          var sol = ['Boards: ' + mulShort(v.n, v.w) + ' in', v.n + ' boards have ' + (v.n - 1) + ' gaps between them: ' + mulShort(v.n - 1, v.g) + ' in', 'Total: ' + addSteps([bd, gp]).join(', '), 'The fence section is ' + t(dmT(ans)) + ' in long.'];
          return mixPart(v.who + ' is building a fence section from ' + v.n + ' boards. Each board is ' + D(v.w) + ' in wide. ' + (v.who === 'Mei' ? 'She' : 'He') + ' leaves a ' + D(v.g) + ' in gap between each pair of boards (there is no gap at the ends). How long is the fence section?', ans,
            { after: 'in', bad: [[add(bd, mul(v.n, v.g)), 'u3-gaps', v.n + ' boards in a row have only ' + (v.n - 1) + ' gaps between them (none at the ends).'], [add(bd, mul(v.n + 1, v.g)), 'u3-gaps', 'There are no gaps at the ends: ' + v.n + ' boards have ' + (v.n - 1) + ' gaps.'], [bd, 'u3-gaps', 'Add the gaps between the boards too.'], [add(mul(v.n, v.w), v.g), 'u3-gaps', 'There is a gap between <b>each pair</b> of boards: ' + (v.n - 1) + ' gaps.']],
              sol: lines(sol), hints: ['Find the width of all the boards, then the width of all the gaps.', 'Draw 3 boards: how many gaps are there? So ' + v.n + ' boards have how many gaps?'], text: 'fence' });
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'BEG', make: function (r) {
          var fr = find(function () { return mx(r.int(2, 5), r.int(1, 4), r.pick([5, 3, 4, 7])); }, function (f) { var a = parts(f); var vals = [a.w * a.d + a.n, a.w * a.n + a.d, a.w * a.d, a.w * a.n]; return gcd(a.n, a.d) === 1 && vals.every(function (x, i) { return vals.indexOf(x) === i; }) && notIn(f, EX_MIX); }, mx(2, 3, 5)), a = parts(fr);
          return P.mc(r, 'What is ' + D(fr) + ' as an improper fraction?', [
            { html: t('\\dfrac{' + (a.w * a.d + a.n) + '}{' + a.d + '}'), right: true },
            { html: t('\\dfrac{' + (a.w * a.n + a.d) + '}{' + a.d + '}'), why: 'Multiply the whole number by the <b>denominator</b> (' + a.w + ' × ' + a.d + '), then add the numerator.', code: 'u3-imp-order' },
            { html: t('\\dfrac{' + (a.w * a.d) + '}{' + a.d + '}'), why: 'You changed the wholes to ' + a.d + 'ths — now add the ' + a.n + ' too.', code: 'u3-imp-noadd' },
            { html: t('\\dfrac{' + (a.w * a.n) + '}{' + a.d + '}'), why: 'Multiply the whole number by the denominator, not the numerator.', code: 'u3-imp-wn' }],
            t('\\frac{' + a.w + '\\times ' + a.d + '+' + a.n + '}{' + a.d + '}=\\frac{' + (a.w * a.d + a.n) + '}{' + a.d + '}'), ['Multiply the whole number by the denominator, then add the numerator.'], 'MC improper');
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var v = find(function () { var d = r.pick([8, 6, 4, 10]); return [mx(r.int(4, 8), proper(r, d), d), mx(r.int(1, 3), proper(r, d), d)]; }, function (v) { var a = parts(v[0]), b = parts(v[1]); if (a.n >= b.n || a.w - b.w < 2) return false; var c = sub(v[0], v[1]), A1 = add(a.w - b.w, R(b.n - a.n, a.d)), B1 = sub(c, R(a.n, a.d)), C1 = add(c, 1); var all = [c, A1, B1, C1]; return all.every(function (x, i) { return all.slice(0, i).every(function (y) { return !eq(x, y); }); }) && !(eq(v[0], mx(5, 1, 4)) && eq(v[1], mx(2, 3, 4))); }, [mx(6, 3, 8), mx(2, 5, 8)]);
          var a = parts(v[0]), b = parts(v[1]), c = sub(v[0], v[1]);
          return P.mc(r, t(dmT(v[0]) + '-' + dmT(v[1]) + '=') + ' ?', [
            { html: D(c), right: true },
            { html: D(add(a.w - b.w, R(b.n - a.n, a.d))), why: 'Don’t flip the fractions. ' + t('\\frac{' + a.n + '}{' + a.d + '}') + ' is less than ' + t('\\frac{' + b.n + '}{' + b.d + '}') + ', so regroup first.', code: 'u3-flip' },
            { html: D(sub(c, R(a.n, a.d))), why: 'When you regroup, add the ' + t('\\frac{' + a.d + '}{' + a.d + '}') + ' to the ' + t('\\frac{' + a.n + '}{' + a.d + '}') + ' you already have.', code: 'u3-borrow-frac' },
            { html: D(add(c, 1)), why: 'When you regroup, take the 1 whole off the ' + a.w + '.', code: 'u3-borrow-whole' }],
            lines(subSteps(v[0], v[1])), ['The first fraction is smaller, so regroup: take 1 whole from ' + a.w + '.'], 'MC subtract');
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'PRG', make: function (r) {
          var v = find(function () { return { d: mx(r.int(1, 7), r.pick([1, 3, 1]), r.pick([4, 2])), days: 5, who: r.pick(['Chris', 'Amira', 'Tyler', 'Jas']) }; }, function (v) { var x = val(v.d) * 2 * v.days; return Q(v.d)[1] > 1 && String(x).length <= 4 && !eq(v.d, mx(3, 3, 4)); }, { d: mx(2, 1, 2), days: 5, who: 'Chris' });
          var day = mul(v.d, 2), wk = mul(day, v.days), x = val(wk);
          return decPart('<b>Numerical response.</b> ' + v.who + ' rides a bike ' + D(v.d) + ' km to school and the same distance home, ' + v.days + ' days a week. How many kilometres is that in a week? Write your answer as a decimal.', wk,
            { nr: true, after: 'km', bad: [[val(v.d) * v.days, 'u3-days', 'There are two trips each day: to school <b>and</b> home.'], [val(v.d) * 2, 'u3-days', 'That’s one day. Multiply by ' + v.days + ' days.']],
              sol: 'One day: ' + t('2\\times ' + dmT(v.d) + '=' + dmT(day)) + ' km<br>A week: ' + t(v.days + '\\times ' + dmT(day) + '=' + dmT(wk) + '=' + decS(wk)) + ' km', hints: ['Each day is two trips.', 'Then multiply by the number of days.'], text: 'NR bike' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Write each improper fraction as a mixed number in simplest form.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var v = impGen(r, 4, 9, 39); return improperPart(r, v[0], v[1]); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var v = impGen(r, 3, 7, 32); return improperPart(r, v[0], v[1]); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var v = impGen(r, 8, 18, 70, { reduce: true }); return improperPart(r, v[0], v[1]); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var v = impGen(r, 10, 15, 79, { reduce: true }); return improperPart(r, v[0], v[1]); } }] },
      { num: '2', stem: 'Write each mixed number as an improper fraction.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 8, 1, 4)); } },
        { id: 'e2b', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 10, 2, 6)); } },
        { id: 'e2c', level: 'BEG', make: function (r) { return improperFrom(mixGen(r, 3, 6, 11)); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return improperFrom(mixGen(r, 12, 3, 8)); } }] },
      { num: '3', stem: 'Add. Write each answer in simplest form.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var v = pair(r, { d: [[10, 10], [8, 8], [6, 6], [12, 12]], w: [1, 6], regroup: false, reduce: true, excl: EX_ADD }, 'add') || [[23, 10], [45, 10]]; return opPart('add', v); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var v = pair(r, { d: [[2, 3], [3, 4], [2, 5], [3, 5]], w: [1, 5], regroup: true, excl: EX_ADD }, 'add') || [[7, 2], [5, 3]]; return opPart('add', v); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var v = pair(r, { d: [[8, 16], [4, 16], [4, 8]], w: [2, 8], regroup: true, excl: EX_ADD }, 'add') || [[61, 8], [63, 16]]; return opPart('add', v); } }] },
      { num: '4', stem: 'Subtract. Write each answer in simplest form.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var v = pair(r, { d: [[6, 6], [8, 8], [10, 10]], w: [4, 9], w2: [1, 3], regroup: false, reduce: true, noWhole: true, excl: EX_SUB }, 'sub') || [[53, 6], [19, 6]]; return opPart('sub', v); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var v = pair(r, { d: [[5, 2], [3, 2], [5, 3], [4, 3]], w: [3, 7], w2: [1, 2], regroup: true, excl: EX_SUB }, 'sub') || [[21, 5], [3, 2]]; return opPart('sub', v); } },
        { id: 'e4c', level: 'PRG', make: function (r) { var v = pair(r, { d: [[1, 16], [1, 8], [1, 12]], whole1: true, w1: [8, 15], w: [3, 7], regroup: true, excl: EX_SUB }, 'sub') || [[12, 1], [119, 16]]; return opPart('sub', v); } }] },
      { num: '5', stem: 'Multiply. Write each answer in simplest form.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var v = mulPair(r, function () { var d = r.pick([4, 3, 8]); return [[r.int(3, 7), 1], mx(r.int(2, 5), proper(r, d), d)]; }, function (v, p) { return !isWhole(p) && gcd(Q(v[0])[0], parts(v[1]).d) === 1; }) || [[5, 1], [13, 4]]; return opPart('mul', v); } },
        { id: 'e5b', level: 'PRG', make: function (r) { var v = wholeOf(r, [2, 3, 4, 5, 6, 7], [[3, 4], [2, 3], [3, 5], [5, 6], [3, 8], [4, 9], [2, 7]]) || [[3, 4], [8, 3]]; return opPart('mul', v); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var v = mulPair(r, function () { var d1 = r.pick([2, 3, 4]), d2 = r.pick([5, 2, 3, 4]); return [mx(r.int(1, 3), proper(r, d1), d1), mx(r.int(1, 4), proper(r, d2), d2)]; }, function (v, p) { return isWhole(p) && parts(v[0]).d !== parts(v[1]).d; }) || [[5, 2], [16, 5]]; return opPart('mul', v); } },
        { id: 'e5d', level: 'PRG', make: function (r) { var v = mulPair(r, function () { var d1 = r.pick([3, 4]), d2 = r.pick([8, 6, 9]); return [mx(1, proper(r, d1), d1), mx(1, proper(r, d2), d2)]; }, function (v, p) { var A = Q(v[0]), B = Q(v[1]); return gcd(A[0] * B[0], A[1] * B[1]) > 1 && !isWhole(p); }) || [[4, 3], [9, 8]]; return opPart('mul', v); } }] },
      { num: '6', stem: 'Write (a) and (b) as mixed numbers in simplest form. Write (c) as a decimal.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var ds = r.int(1, 12) + r.pick(['.25', '.75', '.5']), c = decToFrac(ds); return mixPart('(a) ' + ds, c.fr, { sol: lines(c.lines), hints: ['Write the decimal part over 100 (or 10), then simplify.'], text: 'dec to mixed ' + ds }); } },
        { id: 'e6b', level: 'EMG', make: function (r) { var ds = r.int(1, 12) + r.pick(['.2', '.4', '.6', '.8']), c = decToFrac(ds); return mixPart('(b) ' + ds, c.fr, { bad: [[add(Math.floor(Number(ds)), R(Number(ds.split('.')[1]), 100)), 'u3-digits', 'One decimal place means <b>tenths</b>: ' + t('0.' + ds.split('.')[1] + '=\\frac{' + ds.split('.')[1] + '}{10}') + '.']], sol: lines(c.lines), hints: ['One decimal place: the decimal part is tenths. Write it over 10, then simplify.'], text: 'dec to mixed ' + ds }); } },
        { id: 'e6c', level: 'EMG', make: function (r) { var fr = mx(r.int(1, 9), r.pick([1, 3, 5, 7, 9, 11, 13, 15]), 16), a = parts(fr); return decPart('(c) ' + D(fr), fr, { bad: [[a.w + a.n / 100, 'u3-digits', 'Divide: ' + t(a.n + '\\div 16') + '.'], [a.n / a.d, 'u3-lost-whole', 'Add the whole number ' + a.w + ' too.']], sol: t(a.n + '\\div 16=' + decS(R(a.n, 16))) + ', so ' + D(fr) + t('=' + decS(fr)), hints: ['Divide the top by the bottom, then add the whole number.'], text: 'mixed to dec ' + plainMix(fr) }); } }] },
      { num: '7', section: 'B. Applying', stem: '', parts: [
        { id: 'e7', level: 'PRG', make: function (r) { var v = find(function () { return [mx(r.int(1, 4), r.pick([1, 3]), 4), mx(r.int(2, 5), r.pick([1, 3, 5, 7]), 8), mx(r.int(1, 3), 1, 2)]; }, function (v) { return parts(sumR(v)).n > 0; }, [mx(2, 1, 4), mx(3, 5, 8), mx(1, 1, 2)]);
          return opPart('add', v, { prompt: 'A quilter sews three strips of fabric side by side. The strips are ' + v.map(function (x) { return D(x) + ' in'; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' wide. How wide is the finished piece? (Ignore the seams.)', after: 'in', final: function (a) { return 'The piece is ' + t(a) + ' in wide.'; }, text: 'quilt' }); } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'PRG', make: function (r) { var v = find(function () { var a = mx(r.int(55, 64), r.pick([1, 3, 5, 7]), 8), b = mx(parts(a).w - r.int(1, 2), r.pick([1, 3]), 4); return [a, b]; }, function (v) { var A = parts(v[0]), B = parts(v[1]); return A.n * 1 / A.d < B.n / B.d && !(A.w === 64 && B.w === 62); }, [mx(64, 1, 8), mx(62, 3, 4)]), who = r.pick(['Maya', 'Liam', 'Zara', 'Eli']);
          return opPart('sub', v, { prompt: 'Last September, ' + who + ' was ' + D(v[1]) + ' in tall. This September ' + (who === 'Liam' || who === 'Eli' ? 'he' : 'she') + ' is ' + D(v[0]) + ' in tall. How much did ' + (who === 'Liam' || who === 'Eli' ? 'he' : 'she') + ' grow?', after: 'in', final: function (a) { return who + ' grew ' + t(a) + ' in.'; }, text: 'growth' }); } }] },
      { num: '9', stem: function (sh) { return 'A bannock recipe uses ' + D(sh.f) + ' cups of flour. ' + sh.who + ' is making ' + D(sh.b) + ' batches for a community supper.'; },
        shared: function (r) { return find(function () { return { f: mx(r.int(1, 3), r.pick([1, 2]), 3), b: mx(r.int(1, 3), 1, 2), who: r.pick(['Owen', 'Tanis', 'Cody', 'Raven']) }; }, function (s) { var p = mul(s.f, s.b); return !isWhole(p) && !(eq(s.f, mx(2, 2, 3)) && eq(s.b, mx(2, 1, 2)) && false); }, { f: mx(2, 2, 3), b: mx(2, 1, 2), who: 'Owen' }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return opPart('mul', [sh.f, sh.b], { prompt: '(a) How much flour does ' + sh.who + ' need?', after: 'cups', text: 'bannock flour' }); } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { var need = mul(sh.f, sh.b), has = parts(need).w; return opPart('sub', [need, has], { prompt: '(b) ' + sh.who + ' has ' + has + ' cups of flour. How much more does ' + (sh.who === 'Tanis' || sh.who === 'Raven' ? 'she' : 'he') + ' need?', after: 'cup' + (val(sub(need, has)) > 1 ? 's' : ''), text: 'bannock more' }); } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'PRG', make: function (r) {
          var v = find(function () { return { L: r.pick([10, 12, 16, 20]), n: r.int(3, 6), p: mx(r.int(1, 3), r.pick([1, 3, 5, 7]), 8) }; }, function (v) { var u = val(mul(v.n, v.p)); return u < v.L && u > v.L - 3 && !isWhole(mul(v.n, v.p)); }, { L: 10, n: 4, p: mx(2, 3, 8) });
          var used = mul(v.n, v.p), left = sub(v.L, used);
          return mixPart('A plumber has a ' + v.L + ' ft length of pipe. She cuts ' + v.n + ' pieces, each ' + D(v.p) + ' ft long. Ignoring the saw cuts, how much pipe is left?', left, { after: 'ft', bad: [[used, 'u3-one-piece', 'That’s the pipe used. Subtract it from ' + v.L + ' ft.'], [sub(v.L, v.p), 'u3-one-piece', 'She cuts ' + v.n + ' pieces: multiply first.']].concat(mulBad(v.n, v.p).map(function (b) { return [sub(v.L, b[0]), b[1], b[2]]; })),
            sol: lines(['Used: ' + mulShort(v.n, v.p) + ' ft', 'Left: ' + subSteps(v.L, used).join(', '), t(dmT(left)) + ' ft of pipe is left.']), hints: ['Find the length of the ' + v.n + ' pieces first.', 'Then subtract from ' + v.L + ' ft.'], text: 'pipe left' });
        } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var v = find(function () { return [mx(r.int(3, 7), r.pick([5, 7]), 8), mx(r.int(2, 5), 1, 4)]; }, function (v) { var A = parts(v[0]), B = parts(v[1]), e = (A.w + 1) * B.w, s = [e, A.w * B.w, (A.w + 1) * (B.w + 1), A.w + 1 + B.w]; return s.every(function (x, i) { return s.indexOf(x) === i; }) && !(A.w === 5 && A.n === 7 && B.w === 3); }, [mx(5, 7, 8), mx(3, 1, 4)]), A = parts(v[0]), B = parts(v[1]), e = (A.w + 1) * B.w, ex = mul(v[0], v[1]);
          return P.mc(r, 'Which is the best estimate of ' + D(v[0]) + ' × ' + D(v[1]) + '?', [
            { html: String(e), right: true }, { html: String(A.w * B.w), why: t(dmT(v[0])) + ' is close to ' + (A.w + 1) + ': round it <b>up</b>.', code: 'down' }, { html: String((A.w + 1) * (B.w + 1)), why: t(dmT(v[1])) + ' is close to ' + B.w + ': round it <b>down</b>.', code: 'up' }, { html: String(A.w + 1 + B.w), why: 'That adds the numbers. Estimate the <b>product</b>.', code: 'add' }],
            'Round to whole numbers: ' + t((A.w + 1) + '\\times ' + B.w + '=' + e) + '. (Exact: ' + t(fT(Q(v[0])) + '\\times ' + fT(Q(v[1])) + '=' + fT(ex) + '\\approx ' + (Math.round(val(ex) * 10) / 10)) + '.)', ['Round each mixed number to the nearest whole number, then multiply.'], 'MC estimate');
        } }] },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'EMG', make: function (r) {
          var v = find(function () { return { n: r.int(4, 12), th: r.pick([R(5, 8), R(3, 4), R(1, 2), R(3, 8)]) }; }, function (v) { var x = val(mul(v.n, v.th)); return String(x).length <= 4 && !isWhole(mul(v.n, v.th)) && !(v.n === 6 && eq(v.th, R(5, 8))); }, { n: 6, th: R(5, 8) }), h = mul(v.n, v.th);
          return decPart('<b>Numerical response.</b> A stack has ' + v.n + ' sheets of plywood. Each sheet is ' + D(v.th) + ' in thick. How tall is the stack, in inches? Write your answer as a decimal.', h,
            { nr: true, after: 'in', sol: t(v.n + '\\times ' + dfT(v.th) + '=\\frac{' + v.n * Q(v.th)[0] + '}{' + Q(v.th)[1] + '}=' + dmT(h) + '=' + decS(h)) + ' in', hints: ['Multiply the number of sheets by the thickness of one.', 'Change the answer to a decimal.'], text: 'NR plywood' });
        } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [
        { id: 'e13', level: 'MAS', make: function (r) {
          var v = find(function () { return { B: r.pick([96, 72, 120, 144]), p: mx(r.int(9, 17), r.pick([1, 3]), 4), k: R(1, 8), who: r.pick(['Thomas', 'Kira', 'Dev', 'Sam']) }; }, function (v) { var per = val(add(v.p, v.k)), nk = Math.floor(v.B / per + 1e-9), n0 = Math.floor(v.B / val(v.p) + 1e-9); return nk !== n0 && nk >= 4 && val(v.p) * (nk + 1) + val(v.k) * nk > v.B; }, { B: 96, p: mx(11, 3, 4), k: R(1, 8), who: 'Thomas' });
          var per = add(v.p, v.k), n = Math.floor(v.B / val(per) + 1e-9), n0 = Math.floor(v.B / val(v.p) + 1e-9);
          return numPart(v.who + ' cuts pieces that are each ' + D(v.p) + ' in long from a ' + v.B + ' in board. Each saw cut turns ' + D(v.k) + ' in of wood into sawdust. How many full pieces can ' + (v.who === 'Kira' ? 'she' : 'he') + ' cut?', n,
            { after: 'pieces', bad: [[n0, 'u3-kerf', 'Each piece also uses ' + D(v.k) + ' in for its saw cut: ' + t(dmT(v.p) + '+' + dmT(v.k) + '=' + dmT(per)) + ' in per piece.'], n0 === n + 1 ? null : [n + 1, 'u3-kerf', 'Check: ' + (n + 1) + ' pieces with their cuts need more than ' + v.B + ' in.']],
              sol: lines(['Each piece uses ' + t(dmT(v.p) + '+' + dmT(v.k) + '=' + dmT(per)) + ' in (the piece and its cut).', n + ' pieces: ' + t(n + '\\times ' + dmT(per) + '=' + dmT(mul(n, per))) + ' in. That fits in ' + v.B + ' in.', (n + 1) + ' pieces would need ' + t((n + 1) + '\\times ' + dmT(per) + '=' + dmT(mul(n + 1, per))) + ' in, which is too much.', (v.who === 'Kira' ? 'She' : 'He') + ' can cut ' + n + ' full pieces.']), hints: ['Each piece uses its own length plus one saw cut.', 'Try a number of pieces: does it fit in the board?'], text: 'kerf pieces' });
        } }] },
      { num: '14', stem: 'Find the missing number.', parts: [
        { id: 'e14a', level: 'ADV', make: function (r) {
          var v = find(function () { var a = mx(r.int(1, 4), r.pick([1, 3]), 4), b = mx(r.int(2, 5), r.pick([1, 3, 5, 7]), 8); return [a, b]; }, function (v) { var A = parts(v[0]), B = parts(v[1]); return A.n / A.d > B.n / B.d && !(eq(v[0], mx(2, 3, 4)) && eq(v[1], mx(3, 3, 8))); }, [mx(2, 3, 4), mx(3, 3, 8)]);
          var tot = add(v[0], v[1]);
          var p = opPart('sub', [tot, v[0]], { prompt: '(a) ' + t(dmT(v[0]) + '+\\square=' + dmT(tot)), text: 'missing addend' });
          p.solution = t('\\square=' + dmT(tot) + '-' + dmT(v[0])) + '<br>' + p.solution + '<br>Check: ' + t(dmT(v[0]) + '+' + dmT(v[1]) + '=' + dmT(tot));
          return p;
        } },
        { id: 'e14b', level: 'ADV', make: function (r) {
          var v = find(function () { return [r.pick([2, 3, 4, 5, 6, 8]), r.int(5, 23)]; }, function (v) { return v[1] % v[0] !== 0 && v[1] > v[0] && !(v[0] === 4 && v[1] === 9); }, [4, 9]), ans = R(v[1], v[0]);
          return mixPart('(b) ' + t(v[0] + '\\times\\square=' + v[1]) + ' (write it as a mixed number)', ans, { bad: [[R(v[0], v[1]), 'u3-div-way', 'Divide ' + v[1] + ' by ' + v[0] + ': ' + t('\\square=\\frac{' + v[1] + '}{' + v[0] + '}') + '.'], [v[1] - v[0], 'u3-added', 'Multiply, don’t add: ' + v[0] + ' times what is ' + v[1] + '?']].concat(mixedBad(v[1], v[0])),
            sol: t('\\square=' + v[1] + '\\div ' + v[0] + '=\\frac{' + v[1] + '}{' + v[0] + '}=' + dmT(ans)) + '<br>Check: ' + t(v[0] + '\\times\\frac{' + v[1] + '}{' + v[0] + '}=\\frac{' + v[0] * v[1] + '}{' + v[0] + '}=' + v[1]), hints: ['Undo the multiplication: divide ' + v[1] + ' by ' + v[0] + '.'], text: 'missing factor' });
        } }] }
    ]
  });
})(window);
