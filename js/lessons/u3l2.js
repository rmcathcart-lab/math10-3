/* Math 10-3 · Unit 3 · Lesson 2 — The SI System: Units, Prefixes and Referents (M1)
 * Assignment 2 (u3_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u3_ep02.tex: A Skills 1–5, B Applying 6–12,
 * C Stretch 13–15). Every part is a generator: the same kind of item, unit change and difficulty as the booklet item
 * (a prefix two steps away, three steps away, a zero placeholder like 0.006 m, a digit trap like 2.4 kg vs 2040 g…),
 * new numbers and objects around the booklet's (the booklet's own numbers are among the possible values; the lesson's
 * worked-example numbers and objects are left out). Calculator allowed.
 * Answers: typed numbers; a unit typed after the number is ignored; thousands may be written 4500, 4 500 or 4,500; a
 * decimal comma or a fraction of the right value gets a nudge (no try used). Unit symbols are typed (mL with a capital
 * L, km with a small k: a case slip or an added "s" gets a nudge); unit names accept metre/meter, litre/liter.
 * Recognised mistakes get their own hint: moving the decimal point the wrong way, the wrong number of places (m to mm
 * is 3 steps, not 2), leaving the number unchanged, reading the end of the ruler instead of subtracting the start,
 * reading the next centimetre, counting the millimetres wrong, rounding a count of full glasses/bows up, forgetting to
 * change units before dividing, one trip instead of two.
 * Conversions: "what is measured / which SI unit / most sensible unit / prefix symbol" tables → tap-a-column grids;
 * "circle the most reasonable measurement" → multiple choice; "complete the table" / "fill in the blanks" → labelled
 * boxes; rulers and tapes are drawn (SVG) with the arrows and objects; "draw an arrow on the tape" → choose the right
 * arrow; "<, > or =" → a grid of the three signs; "put in order" → tap in order; "explain / how can you tell / what
 * did he do wrong / name a referent" → multiple choice whose options are reasons (one right).
 * Outcome M1 (every part). Levels: LIM BEG EMG PRG ADV MAS.
 *
 * Shared kit for later Unit 3 lessons (3.4 converting within SI): HW.u3si — see the comment at "HW.u3si" below. Uses
 * HW.u3len (u3l1.js) for its number boxes. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, U = HW.u3len;
  if (!U) throw new Error('u3l2.js needs HW.u3len from js/lessons/u3l1.js');

  /* ================= HW.u3si =================
   *   UNITS[sym] = [base 'm'|'g'|'L', power of ten, name];  STEPS: k h da (base) d c m
   *   shift(x, k) exact decimal string of x × 10^k;  conv(x, from, to) → number;  convS(x, from, to) → string
   *   nS(x) number → plain string (no exponent);  nT(x) LaTeX with a thin space in numbers of 5+ digits (12\,500)
   *   q(x, unit) LaTeX "5.2\text{ m}";  path(from, to) "m → dm → cm → mm";  stepInfo(from, to) {k, n, down, factor}
   *   convWhy(from, to) "m to mm is 3 steps down, so × 1000 (the decimal point moves 3 places right)"
   *   convBad(x, from, to) [[number, code, hint]] (wrong way, wrong number of steps, unchanged)
   *   convSol(x, from, to) one-line worked solution;  convPart(prompt, x, from, to, o) a number part (o: bad, sol, hints, text, nr, after)
   *   convRow(label, x, from, to, o) a row for HW.u3len.rowsPart
   *   ruler(o) SVG ruler/tape: o.start, o.n (cm), o.ppc (px per cm), o.ptrs [{at, label}], o.objs [{a, b, label}]
   *   symChk(sym) a typed unit symbol (case nudges);  nameChk(sym) a typed unit name */
  var S = HW.u3si = HW.u3si || {};
  var UNITS = { km: ['m', 3, 'kilometre'], hm: ['m', 2, 'hectometre'], dam: ['m', 1, 'decametre'], m: ['m', 0, 'metre'], dm: ['m', -1, 'decimetre'], cm: ['m', -2, 'centimetre'], mm: ['m', -3, 'millimetre'],
    kg: ['g', 3, 'kilogram'], hg: ['g', 2, 'hectogram'], dag: ['g', 1, 'decagram'], g: ['g', 0, 'gram'], dg: ['g', -1, 'decigram'], cg: ['g', -2, 'centigram'], mg: ['g', -3, 'milligram'], t: ['g', 6, 'tonne'],
    kL: ['L', 3, 'kilolitre'], hL: ['L', 2, 'hectolitre'], daL: ['L', 1, 'decalitre'], L: ['L', 0, 'litre'], dL: ['L', -1, 'decilitre'], cL: ['L', -2, 'centilitre'], mL: ['L', -3, 'millilitre'] };
  var PRE = [['k', 'kilo', 1000], ['h', 'hecto', 100], ['da', 'deca', 10], ['', '', 1], ['d', 'deci', 0.1], ['c', 'centi', 0.01], ['m', 'milli', 0.001]];
  function nS(x) { if (typeof x === 'string') return x; var s = String(x); if (/e/i.test(s)) s = x.toFixed(12); if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s; }
  function shift(x, k) {
    var s = nS(x), neg = s.charAt(0) === '-'; if (neg) s = s.slice(1);
    var ip = s.split('.')[0], fp = s.split('.')[1] || '', dg = ip + fp, pos = ip.length + k;
    while (pos > dg.length) dg += '0'; while (pos < 0) { dg = '0' + dg; pos++; }
    var a = dg.slice(0, pos).replace(/^0+(?=\d)/, '') || '0', b = dg.slice(pos).replace(/0+$/, '');
    return (neg ? '-' : '') + a + (b ? '.' + b : '');
  }
  function stepInfo(from, to) { var k = UNITS[from][1] - UNITS[to][1]; return { k: k, n: Math.abs(k), down: k > 0, factor: shift(1, Math.abs(k)) }; }
  function conv(x, from, to) { return Number(shift(x, stepInfo(from, to).k)); }
  function convS(x, from, to) { return shift(x, stepInfo(from, to).k); }
  function nT(x) { var s = nS(x), ip = s.split('.')[0], fp = s.split('.')[1]; if (ip.replace('-', '').length >= 5) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'); return ip + (fp ? '.' + fp : ''); }
  function q(x, u) { return nT(x) + '\\text{ ' + u + '}'; }
  function symOf(base, e) { if (base === 'g' && e === 6) return 't'; var p = PRE[3 - e]; return p ? p[0] + base : null; }
  function path(from, to) {
    var b = UNITS[from][0], e1 = UNITS[from][1], e2 = UNITS[to][1];
    if (from === 't' || to === 't') return from + ' → ' + to;
    var out = [], st = e1 > e2 ? -1 : 1; for (var e = e1; st < 0 ? e >= e2 : e <= e2; e += st) out.push(symOf(b, e));
    return out.join(' → ');
  }
  function convWhy(from, to) {
    var s = stepInfo(from, to);
    if (from === 't' || to === 't') return '1 t = 1000 kg, so ' + (s.down ? 'multiply' : 'divide') + ' by ' + (from === 'kg' || to === 'kg' ? '1000' : s.factor) + '.';
    return from + ' to ' + to + ' is ' + s.n + ' step' + (s.n > 1 ? 's' : '') + ' ' + (s.down ? 'down' : 'up') + ' (' + path(from, to) + '), so ' + (s.down ? '× ' : '÷ ') + s.factor + ' (the decimal point moves ' + s.n + ' place' + (s.n > 1 ? 's' : '') + ' ' + (s.down ? 'right' : 'left') + ').';
  }
  function convBad(x, from, to) {
    var s = stepInfo(from, to), out = [], seen = {}, ans = conv(x, from, to);
    function add(v, code, hint) { var key = nS(v); if (seen[key] || Math.abs(v - ans) < 1e-12 * Math.max(1, ans)) return; seen[key] = 1; out.push([v, code, hint]); }
    add(Number(shift(x, -s.k)), 'u3-si-way', 'Check the direction. A ' + UNITS[to][2] + ' is ' + (s.down ? 'smaller' : 'bigger') + ' than a ' + UNITS[from][2] + ', so the number of ' + UNITS[to][2] + 's must be ' + (s.down ? '<b>bigger</b>: multiply' : '<b>smaller</b>: divide') + '.');
    [s.k - 1, s.k + 1, s.k - 2, s.k + 2].forEach(function (d) { if (d && d !== s.k && d * s.k > 0) add(Number(shift(x, d)), 'u3-si-steps', 'Count every step on the staircase: ' + convWhy(from, to)); });
    add(Number(nS(x)), 'u3-si-same', 'The unit changes, so the number changes too: ' + convWhy(from, to));
    return out;
  }
  function convSol(x, from, to) { var s = stepInfo(from, to), a = convS(x, from, to); return convWhy(from, to) + '<br>' + t(nT(x) + (s.down ? '\\times ' : '\\div ') + s.factor + '=' + nT(a)) + ', so ' + t(q(x, from) + '=' + q(a, to)) + '.'; }
  function convPart(prompt, x, from, to, o) {
    o = o || {}; var a = conv(x, from, to);
    var p = U.decPart(prompt, a, { after: o.after === undefined ? to : o.after, nr: o.nr, bad: convBad(x, from, to).concat(o.bad || []), sol: o.sol || convSol(x, from, to), hints: o.hints || ['Find ' + from + ' and ' + to + ' on the staircase and count the steps between them.', 'Down (to a smaller unit): multiply. Up (to a bigger unit): divide.'], text: o.text || from + '→' + to + ' ' + nS(x) });
    p.key = convS(x, from, to); p.answer = t(q(p.key, to));
    return p;
  }
  function convRow(label, x, from, to, o) { o = o || {}; var r = U.decRow(label, conv(x, from, to), { after: o.after === undefined ? to : o.after, name: o.name, bad: convBad(x, from, to).concat(o.bad || []) }); r.key = convS(x, from, to); r.ans = nT(r.key); return r; }
  S.UNITS = UNITS; S.PRE = PRE; S.nS = nS; S.shift = shift; S.stepInfo = stepInfo; S.conv = conv; S.convS = convS; S.nT = nT; S.q = q; S.path = path; S.convWhy = convWhy; S.convBad = convBad; S.convSol = convSol; S.convPart = convPart; S.convRow = convRow;

  /* ---- unit symbols and names typed as text ---- */
  function symChk(sym) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, '$1$2').replace(/[\s.]/g, '');
      if (!s) return form('empty', 'Type the symbol first.');
      if (s === sym) return ok();
      if (s === sym + 's' || s.toLowerCase() === (sym + 's').toLowerCase() && s.slice(0, -1) === sym) return form('u3-sym-s', 'Never add an “s” to a symbol: just ' + sym + '.');
      if (s.toLowerCase() === sym.toLowerCase()) {
        if (/L/.test(sym)) return form('u3-sym-case', 'Right letters — but litre is written with a <b>capital L</b>.');
        return form('u3-sym-case', 'Right letters — but check the capitals: SI symbols like ' + sym.replace(/L/, '') + ' use small letters' + (sym === 'kg' || sym === 'km' ? ' (a small k)' : '') + '.');
      }
      if (s.toLowerCase() === UNITS[sym][2] || s.toLowerCase() === UNITS[sym][2].replace(/re$/, 'er')) return form('u3-sym-name', 'That’s the name. Write the short <b>symbol</b>, like km for kilometre.');
      var t0 = UNITS[sym], low = s.replace(/s$/, '');
      var other = Object.keys(UNITS).filter(function (k) { return k === low || k.toLowerCase() === low.toLowerCase(); })[0];
      if (other && UNITS[other][0] === t0[0]) return wrong('u3-sym-prefix', 'Check the prefix: ' + other + ' is a ' + UNITS[other][2] + '.');
      if (other) return wrong('u3-sym-base', 'Check the base unit: ' + t0[2].replace(/^(kilo|hecto|deca|deci|centi|milli)/, '') + 's use the symbol ' + (t0[0] === 'm' ? 'm' : t0[0]) + '.');
      return wrong('value', null);
    };
  }
  function normName(s) { return String(s == null ? '' : s).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[\s\-.]/g, '').replace(/meters?$/, 'metre').replace(/liters?$/, 'litre').replace(/tons?$/, 'tonne').replace(/(metre|litre|gram|tonne)s$/, '$1').replace(/dekа|deka/, 'deca'); }
  function nameChk(sym) {
    var want = UNITS[sym][2];
    return function (resp) {
      var s = normName(resp);
      if (!s) return form('empty', 'Type the name first.');
      if (s === want) return ok();
      if (s.replace(/s$/, '') === sym.toLowerCase()) return form('u3-name-sym', 'Write the full <b>name</b> (for example, km is “kilometre”).');
      var base = want.replace(/^(kilo|hecto|deca|deci|centi|milli)/, ''), pre = want.slice(0, want.length - base.length);
      if (s.slice(-base.length) === base) return wrong('u3-name-prefix', 'The base unit is right. Check the prefix: ' + (sym.slice(0, sym.length - UNITS[sym][0].length) || 'no letter') + ' means ' + (pre || '(none)') + '.');
      if (pre && s.indexOf(pre) === 0) return wrong('u3-name-base', 'The prefix is right. Check the base unit: the last letter' + (UNITS[sym][0].length > 1 ? 's' : '') + ' ' + UNITS[sym][0] + ' mean' + (UNITS[sym][0].length > 1 ? '' : 's') + ' ' + base + '.');
      return wrong('value', null);
    };
  }
  S.symChk = symChk; S.nameChk = nameChk;

  /* ---- a metric ruler / tape (SVG) ---- */
  function ruler(o) {
    o = o || {}; var n = o.n || 10, ppc = o.ppc || 40, pad = (o.start || 0) >= 100 ? 20 : 14, top = o.top == null ? 38 : o.top, h = 46, Wd = n * ppc + 2 * pad, Ht = top + h + 2, s = '';
    var X = function (c) { return pad + (c - (o.start || 0)) * ppc; };
    s += '<rect x="' + (pad - 8) + '" y="' + top + '" width="' + (n * ppc + 16) + '" height="' + h + '" fill="#fbf3cf" stroke="#2b3340" stroke-width="1.4"/>';
    for (var i = 0; i <= 10 * n; i++) { var x = pad + i * ppc / 10, L = i % 10 === 0 ? 17 : i % 5 === 0 ? 12 : 7; s += '<line x1="' + x.toFixed(2) + '" y1="' + top + '" x2="' + x.toFixed(2) + '" y2="' + (top + L) + '" stroke="#2b3340" stroke-width="' + (i % 10 === 0 ? 1.3 : 0.8) + '"/>'; }
    for (var c = 0; c <= n; c++) s += '<text x="' + (pad + c * ppc) + '" y="' + (top + 34) + '" font-size="12" text-anchor="middle" fill="#2b3340" font-family="sans-serif">' + ((o.start || 0) + c) + '</text>';
    s += '<text x="' + (Wd - 9) + '" y="' + (top + h - 4) + '" font-size="10" text-anchor="end" fill="#2b3340" font-family="sans-serif">cm</text>';
    (o.objs || []).forEach(function (b) { s += '<rect x="' + X(b.a).toFixed(2) + '" y="' + (top - 16) + '" width="' + ((b.b - b.a) * ppc).toFixed(2) + '" height="15" fill="#b9c2cc" stroke="#2b3340" stroke-width="1"/><text x="' + ((X(b.a) + X(b.b)) / 2).toFixed(2) + '" y="' + (top - 5) + '" font-size="11" text-anchor="middle" fill="#2b3340" font-family="sans-serif">' + (b.label || '') + '</text>'; });
    (o.ptrs || []).forEach(function (p) { var x = X(p.at).toFixed(2); s += '<line x1="' + x + '" y1="' + (top - 22) + '" x2="' + x + '" y2="' + (top - 4) + '" stroke="#c4532a" stroke-width="2"/><path d="M' + (x - 4) + ' ' + (top - 9) + ' L' + x + ' ' + (top - 1) + ' L' + (+x + 4) + ' ' + (top - 9) + ' Z" fill="#c4532a"/>' + (p.label ? '<text x="' + x + '" y="' + (top - 25) + '" font-size="13" font-weight="bold" text-anchor="middle" fill="#2b3340" font-family="sans-serif">' + p.label + '</text>' : ''); });
    return '<svg class="u3l2-ruler" width="' + Wd + '" height="' + Ht + '" viewBox="0 0 ' + Wd + ' ' + Ht + '" style="max-width:100%;height:auto" role="img" aria-label="' + (o.label || 'A metric ruler') + '">' + s + '</svg>';
  }
  S.ruler = ruler;

  HW.addCodes({ 'u3-si-way': 'Moved the decimal point the wrong way', 'u3-si-steps': 'Wrong number of steps (×100 instead of ×1000…)', 'u3-si-same': 'Number left unchanged when the unit changed',
    'u3-sym-s': 'Added an “s” to a unit symbol', 'u3-sym-case': 'Wrong capital letter in a unit symbol', 'u3-sym-name': 'Name instead of symbol', 'u3-sym-prefix': 'Wrong prefix in a symbol', 'u3-sym-base': 'Wrong base unit in a symbol',
    'u3-name-sym': 'Symbol instead of name', 'u3-name-prefix': 'Wrong prefix in a unit name', 'u3-name-base': 'Wrong base unit in a unit name', 'u3-kind': 'Wrong kind of measurement', 'u3-unit-size': 'Unit too big or too small to be sensible',
    'u3-ruler-end': 'Read the end of the object without subtracting the start', 'u3-ruler-next': 'Read the next centimetre', 'u3-ruler-mm': 'Miscounted the millimetre marks', 'u3-ruler-units': 'Wrote the reading in the other unit',
    'u3-round-up': 'Rounded a count of full ones up', 'u3-round-down': 'Rounded a count needed down', 'u3-no-convert': 'Divided before changing to the same unit', 'u3-left-total': 'Gave the amount used, not the amount left', 'u3-ref': 'Referent count not multiplied by the referent', 'u3-one-way': 'One trip instead of there and back', 'u3-worth': 'Wrong value for a prefix', 'u3-compare': 'Compared without changing to the same unit', 'u3-order': 'Ordered by the numbers without changing units' });
  HW.addPartial({ 'u3-si-steps': 'b', 'u3-si-way': 'n', 'u3-ruler-mm': 's', 'u3-ruler-next': 'b', 'u3-ruler-end': 'b', 'u3-round-up': 's', 'u3-round-down': 's', 'u3-one-way': 'b', 'u3-no-convert': 'n', 'u3-left-total': 'b' });

  /* ================= lesson helpers ================= */
  function find(gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function r1(r, lo, hi, dp) { var f = Math.pow(10, dp || 1); return Number((r.int(Math.round(lo * f), Math.round(hi * f)) / f).toFixed(dp || 1)); }
  function lines(a) { return a.filter(Boolean).join('<br>'); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function qq(x, u) { return t(q(x, u)); }
  var numPart = U.numPart, decPart = U.decPart, rowsPart = U.rowsPart, numRow = U.numRow, decRow = U.decRow;

  /* what is measured, and the SI unit (Q1). [item, kind, unit] — the lesson's example items are left out */
  var KINDS = [{ id: 'len', html: 'length' }, { id: 'mass', html: 'mass' }, { id: 'cap', html: 'capacity' }, { id: 'temp', html: 'temperature' }, { id: 'area', html: 'area' }];
  var ITEMS1 = [['the length of a swimming pool', 'len', 'm'], ['how much milk a jug holds', 'cap', 'L'], ['how heavy a backpack is', 'mass', 'kg'], ['how cold it is inside a fridge', 'temp', '°C'],
    ['the lawn to be covered with sod', 'area', 'm²'], ['the height of a tree', 'len', 'm'], ['the distance from Edmonton to Red Deer', 'len', 'km'], ['how much water a bathtub holds', 'cap', 'L'],
    ['how heavy a bag of flour is', 'mass', 'kg'], ['how warm the water in a hot tub is', 'temp', '°C'], ['the paint needed to cover a wall', 'area', 'm²'], ['the width of a classroom', 'len', 'm'],
    ['how heavy a person is', 'mass', 'kg'], ['how much gas a lawnmower tank holds', 'cap', 'L'], ['the floor space of a gym', 'area', 'm²'], ['how hot an oven gets', 'temp', '°C'],
    ['how far it is to drive from Lethbridge to Calgary', 'len', 'km'], ['how much water a rain barrel holds', 'cap', 'L']];
  var UCOLS = ['m', 'km', 'L', 'kg', '°C', 'm²'];
  var UNAME = { m: 'metre (m)', km: 'kilometre (km)', L: 'litre (L)', kg: 'kilogram (kg)', '°C': 'degree Celsius (°C)', 'm²': 'square metre (m²)', mm: 'millimetre (mm)', cm: 'centimetre (cm)', mL: 'millilitre (mL)', g: 'gram (g)', mg: 'milligram (mg)', t: 'tonne (t)' };
  function uT(u) { return u === '°C' ? t('^\\circ\\text{C}') : u === 'm²' ? t('\\text{m}^2') : u; }

  /* most sensible unit (Q4, E2). [item, unit] */
  var SENS = { len: [['the length of your foot', 'cm'], ['the distance of a marathon', 'km'], ['the thickness of a window pane', 'mm'], ['the height of a house', 'm'], ['the length of a city bus', 'm'], ['the width of a grain of rice', 'mm'],
      ['the drive from Medicine Hat to Lethbridge', 'km'], ['the length of a smartphone', 'cm'], ['the thickness of a credit card', 'mm'], ['the width of a classroom', 'm'], ['the length of a shoelace', 'cm'], ['a bike ride across town', 'km']],
    mass: [['the mass of a loaded gravel truck', 't'], ['the medicine in one pill', 'mg'], ['the mass of a bag of dog food', 'kg'], ['the mass of a pencil', 'g'], ['the mass of a hockey puck', 'g'], ['the vitamin C in one gummy', 'mg'],
      ['the mass of a moose', 'kg'], ['the mass of a grown man', 'kg'], ['the load on a train car', 't'], ['the mass of a chocolate bar', 'g'], ['the caffeine in a cup of tea', 'mg']],
    cap: [['the water in a swimming pool', 'L'], ['the soy sauce in a recipe', 'mL'], ['the water in a bathtub', 'L'], ['the vanilla in a cookie recipe', 'mL'], ['a dose of cough syrup', 'mL'], ['the paint in a big pail', 'L'], ['the water in a fish tank', 'L'], ['the eye drops in one dose', 'mL']] };
  var SCOLS = ['mm', 'cm', 'm', 'km', 'mg', 'g', 'kg', 't', 'mL', 'L'];
  function sensGrid(r, prompt, list, cols, text, off) {
    var rows = list.map(function (x, i) { return { id: 'r' + i, html: '(' + String.fromCharCode(97 + (off || 0) + i) + ') ' + x[0] }; }), want = {}; list.forEach(function (x, i) { want['r' + i] = x[1]; });
    return P.grid(prompt, rows, cols.map(function (c) { return { id: c, html: c }; }), want, {
      why: function (rid, got) {
        var it = list[+rid.slice(1)], w = it[1], kindOf = function (u) { return /^(mm|cm|m|km)$/.test(u) ? 'length' : /^(mg|g|kg|t)$/.test(u) ? 'mass' : 'capacity'; };
        if (got && kindOf(got) !== kindOf(w)) return { code: 'u3-kind', hint: '“' + it[0] + '”: that is a <b>' + kindOf(w) + '</b>, so use a ' + kindOf(w) + ' unit.' };
        return { code: 'u3-unit-size', hint: '“' + it[0] + '”: pick the unit that gives an easy number, not a huge one or a tiny one.' };
      } }, list.map(function (x) { return x[0] + ': ' + x[1]; }).join('<br>'), ['Length: mm for very small things, cm for things you hold, m for rooms and buildings, km between places.', 'Mass: mg for medicine, g for small things, kg for people and big bags, t for trucks. Capacity: mL for small amounts, L for big containers.'], text);
  }
  function pickSens(r, n, used, noT) {
    var out = [], kinds = r.shuffle(['len', 'mass', 'cap']).concat(r.shuffle(['len', 'mass', 'len', 'cap', 'mass']));
    for (var i = 0; out.length < n && i < 40; i++) { var k = kinds[i % kinds.length], c = r.pick(SENS[k]); if (used.indexOf(c[0]) < 0 && !(noT && c[1] === 't')) { used.push(c[0]); out.push(c); } }
    return out;
  }

  /* circle the most reasonable (Q5): [prompt, right index, options] */
  var REASON = {
    a: [['the length of a canoe', 2, ['5 mm', '5 cm', '5 m', '5 km']], ['the length of a school bus', 2, ['12 mm', '12 cm', '12 m', '12 km']], ['the length of a hockey stick', 2, ['1.5 mm', '1.5 cm', '1.5 m', '1.5 km']], ['the length of a soccer field', 2, ['100 mm', '100 cm', '100 m', '100 km']], ['the length of a new pencil', 1, ['19 mm', '19 cm', '19 m', '19 km']]],
    b: [['the mass of a newborn baby', 2, ['3.5 mg', '3.5 g', '3.5 kg', '3.5 t']], ['the mass of a small car', 3, ['1.4 mg', '1.4 g', '1.4 kg', '1.4 t']], ['the mass of a laptop', 2, ['2 mg', '2 g', '2 kg', '2 t']], ['the mass of a hockey puck', 1, ['170 mg', '170 g', '170 kg', '170 t']], ['the mass of a grape', 1, ['5 mg', '5 g', '5 kg', '5 t']]],
    c: [['a can of pop holds', 0, ['355 mL', '35.5 L', '355 L', '3.55 mL']], ['a large water jug holds', 2, ['4 mL', '40 mL', '4 L', '400 L']], ['a teaspoon holds', 1, ['0.5 mL', '5 mL', '5 L', '50 L']], ['a kitchen pot holds', 2, ['6 mL', '60 mL', '6 L', '600 L']], ['a bottle of cough syrup holds', 0, ['250 mL', '25 L', '250 L', '2.5 mL']]],
    d: [['a warm summer day in Calgary', 1, ['2 °C', '25 °C', '60 °C', '100 °C']], ['a hot cup of coffee', 1, ['7 °C', '70 °C', '170 °C', '700 °C']], ['the inside of a fridge', 0, ['4 °C', '40 °C', '74 °C', '140 °C']], ['a cold winter night in Edmonton', 0, ['−25 °C', '5 °C', '25 °C', '50 °C']], ['the water in a swimming pool', 1, ['2 °C', '27 °C', '67 °C', '97 °C']]],
    e: [['the height of a classroom ceiling', 1, ['30 cm', '3 m', '30 m', '3 km']], ['the height of a kitchen counter', 1, ['90 mm', '90 cm', '90 m', '9 km']], ['the height of a two-storey house', 2, ['8 mm', '8 cm', '8 m', '8 km']], ['the width of your smallest fingernail', 1, ['1 mm', '1 cm', '1 m', '1 km']], ['the height of a stop sign pole', 2, ['2.5 mm', '2.5 cm', '2.5 m', '2.5 km']]] };
  function degT(s) { return s.replace(/°C/, '<span style="white-space:nowrap">°C</span>'); }
  function reasonMC(r, key) {
    var it = r.pick(REASON[key]);
    return P.mc(r, 'Choose the most reasonable measurement: <b>' + it[0] + '</b>.', it[2].map(function (o, i) { return { html: degT(o), right: i === it[1], why: i === it[1] ? null : (i < it[1] ? 'That is far too small. Picture it with a referent.' : 'That is far too big. Picture it with a referent.'), code: i < it[1] ? 'small' : 'big' }; }),
      'The most reasonable is <b>' + it[2][it[1]] + '</b>.', ['Picture each choice with a referent: a dime is 1 mm thick, a fingernail 1 cm wide, a long step 1 m; a paper clip is 1 g, a 1 L carton 1 kg; 0 °C freezes, 20 °C is a room, 37 °C is your body.'], 'reasonable ' + it[0], true);
  }

  /* conversions with a value range: [from, to, generator] */
  function conv1(r, from, to, gen, test, excl) { var x = find(gen, function (v) { return (excl || []).indexOf(nS(v)) < 0 && (!test || test(v)); }, gen()); return { x: x, from: from, to: to }; }
  var EX_CONV = { 'm>cm': ['3.45'], 'km>m': ['2.6'], 'mm>cm': ['85'], 'cm>m': ['640'], 'g>kg': ['1250'], 'L>mL': ['0.75', '1.5', '4'], 'mm>m': ['4'], 'cm>mm': ['2.5'], 'm>km': ['1200'], 'mL>L': ['12500'] };
  function convQ(r, label, from, to, gen, test) { var c = conv1(r, from, to, gen, test, EX_CONV[from + '>' + to]); return S.convPart('(' + label + ') ' + qq(c.x, from) + ' = ?', c.x, from, to); }

  /* compare (<, >, =): a row [a, ua, b, ub] */
  function cmpRow(r, ua, ub, kind) {
    var k = UNITS[ua][1] - UNITS[ub][1];
    return find(function () {
      var a, b, rel = r.pick(['<', '>', '=']);
      if (ua === 'km' || ua === 'kg' || ua === 'L') a = r1(r, 0.3, 4.8, r.pick([1, 2])); else if (ua === 'm') a = r1(r, 0.2, 1.9, r.pick([1, 2])); else if (ua === 'cm') a = r.pick([r.int(12, 95), r1(r, 1.2, 9.8)]); else if (ua === 'g') a = r.int(11, 99) * 10; else a = r.int(15, 95);
      var A = Number(S.shift(a, k));
      if (rel === '=') b = A;
      else if (kind === 'trap' && a >= 1 && rel === '>' && A >= 1000) { var dg = nS(a).replace('.', '0'); while (dg.length < String(Math.round(A)).length) dg += '0'; b = Number(dg); }
      else { var d = r.pick([1, 2, 3, 5]) * Math.pow(10, Math.floor(Math.log10(A) + 1e-9) - 1); b = rel === '>' ? A - d : A + d; }
      b = Number(nS(Math.round(b * 1e6) / 1e6));
      return { a: a, ua: ua, b: b, ub: ub, A: A, rel: A > b + 1e-9 ? '>' : A < b - 1e-9 ? '<' : '=' };
    }, function (x) { return x.b > 0 && !(x.ua === 'm' && x.a === 0.8 && x.b === 75); }, { a: 0.6, ua: 'm', b: 58, ub: 'cm', A: 60, rel: '>' });
  }
  var SIGNS = [{ id: '<', html: t('<') }, { id: '>', html: t('>') }, { id: '=', html: t('=') }];
  function cmpGrid(r, prompt, rowsIn, text) {
    var rows = rowsIn.map(function (x, i) { return { id: 'c' + i, html: '(' + String.fromCharCode(97 + (x.off || 0) + i) + ') ' + qq(x.a, x.ua) + ' &nbsp;?&nbsp; ' + qq(x.b, x.ub) }; }), want = {};
    rowsIn.forEach(function (x, i) { want['c' + i] = x.rel; });
    var sol = rowsIn.map(function (x, i) { return '(' + String.fromCharCode(97 + (x.off || 0) + i) + ') ' + qq(x.a, x.ua) + ' = ' + qq(x.A, x.ub) + ', so ' + t(q(x.a, x.ua) + x.rel + q(x.b, x.ub)); }).join('<br>');
    return P.grid(prompt, rows, SIGNS, want, { colHead: '', why: function (rid) { var x = rowsIn[+rid.slice(1)]; return { code: 'u3-compare', hint: 'Change to the same unit first: ' + qq(x.a, x.ua) + ' = ' + qq(x.A, x.ub) + '. Now compare with ' + qq(x.b, x.ub) + '.' }; } }, sol, ['Change the first measurement to the unit of the second.', 'Then compare the numbers.'], text);
  }

  /* reading a ruler: positions in cm (one decimal) */
  function readRows(ptrs, unit) {
    return ptrs.map(function (p) {
      var cm = p.at, mm = Math.round(cm * 10), val = unit === 'cm' ? cm : mm;
      var bad = unit === 'cm' ? [[mm, 'u3-ruler-units', 'This box is in <b>centimetres</b>: ' + mm + ' mm = ' + nS(cm) + ' cm.'], [Number((cm + 1).toFixed(1)), 'u3-ruler-next', 'Read the last <b>full</b> centimetre before the arrow, then count the small marks past it.'], [Number((cm + 0.1).toFixed(1)), 'u3-ruler-mm', 'Count the small marks again: each one is 1 mm.'], [Number((cm - 0.1).toFixed(1)), 'u3-ruler-mm', 'Count the small marks again: each one is 1 mm.']]
        : [[cm, 'u3-ruler-units', 'This box is in <b>millimetres</b>: 1 cm = 10 mm, so ' + nS(cm) + ' cm = ' + mm + ' mm.'], [mm + 10, 'u3-ruler-next', 'Read the last <b>full</b> centimetre before the arrow.'], [mm + 1, 'u3-ruler-mm', 'Count the small marks again: each one is 1 mm.'], [mm - 1, 'u3-ruler-mm', 'Count the small marks again: each one is 1 mm.']];
      return decRow(p.label + ':', val, { after: unit, name: p.label, bad: bad.filter(function (b) { return b[0] > 0; }) });
    });
  }
  function ptrGen(r, letters, n, excl) {
    return find(function () { var a = []; for (var i = 0; i < letters.length; i++) a.push(Number((r.int(3, 10 * n - 3) / 10).toFixed(1))); a.sort(function (x, y) { return x - y; }); return a; },
      function (a) { for (var i = 1; i < a.length; i++) if (a[i] - a[i - 1] < 1.5) return false; return a.every(function (x) { return (excl || []).indexOf(x) < 0; }) && a.some(function (x) { return Math.round(x * 10) % 10 !== 0 && Math.round(x * 10) % 10 !== 5; }); }, null);
  }

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u3l2', unit: 3, num: '2', title: 'The SI System: Units, Prefixes and Referents', outcome: 'M1',
    blurb: 'SI units for length, mass and capacity, what the prefixes mean, referents, measuring to the millimetre, and changing units by moving the decimal point.',
    questions: [
      { num: '1', stem: 'For each item, decide what is being measured and the SI unit you would use.',
        shared: function (r) { return find(function () { return r.sample(ITEMS1, 6); }, function (a) { var k = {}; a.forEach(function (x) { k[x[1]] = 1; }); return Object.keys(k).length >= 4; }, ITEMS1.slice(0, 6)); },
        parts: [
          { id: '1a', level: 'LIM', make: function (r, sh) {
            var rows = sh.map(function (x, i) { return { id: 'i' + i, html: '(' + String.fromCharCode(97 + i) + ') ' + x[0] }; }), want = {}; sh.forEach(function (x, i) { want['i' + i] = x[1]; });
            return P.grid('What is being measured?', rows, KINDS, want, { why: function (rid) { var x = sh[+rid.slice(1)]; return { code: 'u3-kind', hint: '“' + x[0] + '”: ' + (x[1] === 'len' ? 'how long, wide, tall or far → length.' : x[1] === 'mass' ? 'how heavy → mass.' : x[1] === 'cap' ? 'how much a container holds → capacity.' : x[1] === 'temp' ? 'how hot or cold → temperature.' : 'how much flat surface is covered → area.') }; } },
              sh.map(function (x, i) { return '(' + String.fromCharCode(97 + i) + ') ' + KINDS.filter(function (k) { return k.id === x[1]; })[0].html; }).join('<br>'), ['Length: how long or far. Mass: how heavy. Capacity: how much a container holds. Temperature: how hot or cold. Area: how much flat surface.'], 'what measured');
          } },
          { id: '1b', level: 'BEG', make: function (r, sh) {
            var rows = sh.map(function (x, i) { return { id: 'i' + i, html: '(' + String.fromCharCode(97 + i) + ') ' + x[0] }; }), want = {}; sh.forEach(function (x, i) { want['i' + i] = x[2]; });
            return P.grid('Which SI unit would you use?', rows, UCOLS.map(function (u) { return { id: u, html: uT(u) }; }), want, { why: function (rid, got) { var x = sh[+rid.slice(1)]; return { code: 'u3-kind', hint: '“' + x[0] + '”: ' + (got === 'm' && x[2] === 'km' ? 'that is a distance between places, so use a bigger unit.' : got === 'km' && x[2] === 'm' ? 'kilometres are for distances between places.' : 'think about what is being measured first (part (a)).') }; } },
              sh.map(function (x, i) { return '(' + String.fromCharCode(97 + i) + ') ' + UNAME[x[2]]; }).join('<br>'), ['Use your answers to (a): length → m or km, mass → kg, capacity → L, temperature → °C, area → m².'], 'SI unit');
          } }] },
      { num: '2', stem: '', parts: [
        { id: '2ai', sub: 'a i', level: 'BEG', make: function (r) {
          var pre = r.shuffle(PRE.filter(function (p, i) { return i > 0 && i !== 3; })), rows = pre.map(function (p) { return { id: p[1], html: p[1] }; }), want = {}; pre.forEach(function (p) { want[p[1]] = p[0]; });
          return P.grid('(a) Complete the table: choose the symbol for each prefix. (kilo is k.)', rows, ['k', 'h', 'da', 'd', 'c', 'm'].map(function (s) { return { id: s, html: '<b>' + s + '</b>' }; }), want, { rowHead: 'Prefix', why: function (rid) { return { code: 'u3-sym-prefix', hint: 'Check ' + rid + '. Two of them start with d: <b>deca</b> is da and <b>deci</b> is d.' }; } },
            pre.map(function (p) { return p[1] + ': ' + p[0]; }).join(', '), ['The symbol is usually the first letter. deca is da (so it is not mixed up with deci, d).'], 'prefix symbols');
        } },
        { id: '2aii', sub: 'a ii', level: 'EMG', make: function (r) {
          var pre = r.shuffle(PRE.filter(function (p, i) { return i > 0 && i !== 3; }));
          return rowsPart('(a) How much is each prefix worth? (kilo is worth 1000.)', pre.map(function (p) { return numRow(p[1] + ':', p[2], { name: p[1], bad: PRE.filter(function (x) { return x[2] !== p[2] && x[1]; }).map(function (x) { return [x[2], 'u3-worth', 'That is what <b>' + x[1] + '</b> is worth. ' + cap(p[1]) + ' is ' + (p[2] > 1 ? 'bigger than the base unit (' + p[2] + ')' : 'smaller than the base unit, so it is worth less than 1') + '.']; }) }); }),
            'kilo 1000, hecto 100, deca 10, (base 1), deci 0.1, centi 0.01, milli 0.001', ['King Henry Died By Drinking Chocolate Milk: kilo, hecto, deca, Base, deci, centi, milli.', 'Each step is 10 times the next one.'], 'prefix worth');
        } },
        { id: '2b', sub: 'b', level: 'EMG', make: function (r) {
          var syms = r.sample(['km', 'mg', 'cL', 'dam', 'hm', 'kL', 'dg', 'cg', 'daL', 'dL', 'hg'], 4);
          return U.rowsPart('(b) Write the full name of each unit.', syms.map(function (s) { return { field: { label: s + ':', mode: 'text', name: s, placeholder: 'e.g. kilometre' }, chk: nameChk(s), key: UNITS[s][2], ans: '\\text{' + UNITS[s][2] + '}', bad: [] }; }),
            syms.map(function (s) { return s + ': ' + UNITS[s][2]; }).join(', '), ['The first letter(s) are the prefix (k kilo, h hecto, da deca, d deci, c centi, m milli). The last letter is the base unit: m metre, g gram, L litre.'], 'unit names');
        } },
        { id: '2c', sub: 'c', level: 'BEG', make: function (r) {
          var syms = r.sample(['mm', 'kg', 'mL', 'cm', 'km', 'mg', 'cL', 'dm', 'kL'], 4);
          return U.rowsPart('(c) Write the symbol for each unit.', syms.map(function (s) { return { field: { label: UNITS[s][2] + ':', mode: 'text', name: UNITS[s][2], placeholder: 'e.g. km' }, chk: symChk(s), key: s, ans: '\\text{' + s + '}', bad: [] }; }),
            syms.map(function (s) { return UNITS[s][2] + ': ' + s; }).join(', '), ['Prefix letter + base letter: kilo k, centi c, milli m; metre m, gram g, litre L (a capital L).'], 'unit symbols');
        } }] },
      { num: '3', stem: 'Complete each statement.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var f = r.shuffle([['m', 'cm'], ['km', 'm'], ['cm', 'mm'], ['m', 'mm']]); return rowsPart('(a)–(d)', f.map(function (p, i) { return S.convRow('(' + String.fromCharCode(97 + i) + ') 1 ' + p[0] + ' =', 1, p[0], p[1], { name: '1 ' + p[0] }); }), f.map(function (p) { return '1 ' + p[0] + ' = ' + S.convS(1, p[0], p[1]) + ' ' + p[1] + ' (' + S.stepInfo(p[0], p[1]).n + ' step' + (S.stepInfo(p[0], p[1]).n > 1 ? 's' : '') + ')'; }).join('<br>'), ['Count the steps on the staircase: each step is × 10.', 'm → dm → cm → mm is 3 steps.'], 'facts length'); } },
        { id: '3b', level: 'BEG', make: function (r) { var f = r.shuffle([['kg', 'g'], ['L', 'mL'], ['g', 'mg'], ['t', 'kg']]); return rowsPart('(e)–(h)', f.map(function (p, i) { return S.convRow('(' + String.fromCharCode(101 + i) + ') 1 ' + p[0] + ' =', 1, p[0], p[1], { name: '1 ' + p[0], bad: p[0] === 't' ? [[100, 'u3-si-steps', '1 t = 1000 kg (a small car).'], [1000000, 'u3-si-steps', '1 t = 1000 kg (a small car).']] : [] }); }), f.map(function (p) { return '1 ' + p[0] + ' = ' + S.convS(1, p[0], p[1]) + ' ' + p[1]; }).join('<br>'), ['Kilo means 1000 and milli means one thousandth: 1 kg = 1000 g, 1 g = 1000 mg.', '1 t = 1000 kg.'], 'facts mass cap'); } }] },
      { num: '4', stem: 'Choose the most sensible unit.', shared: function (r) { var used = []; return { a: pickSens(r, 5, used), b: pickSens(r, 5, used) }; },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) { return sensGrid(r, '(a)–(e)', sh.a, SCOLS, 'sensible a'); } },
          { id: '4b', level: 'BEG', make: function (r, sh) { return sensGrid(r, '(f)–(j)', sh.b, SCOLS, 'sensible b', 5); } }] },
      { num: '5', stem: 'Choose the most reasonable measurement.', parts: ['a', 'b', 'c', 'd', 'e'].map(function (k) { return { id: '5' + k, level: k === 'c' || k === 'e' ? 'EMG' : 'BEG', make: function (r) { return reasonMC(r, k); } }; }) },
      { num: '6', stem: 'Use a referent to estimate.', parts: [
        { id: '6a', level: 'BEG', make: function (r) {
          var who = r.pick(['Kenji', 'Aria', 'Malik', 'Sofia']), n = r.int(25, 70), what = r.pick(['a parking lot', 'the school gym', 'a hockey rink', 'the playground']);
          return numPart('(a) ' + who + '’s long step is about 1 m. ' + (who === 'Aria' || who === 'Sofia' ? 'She' : 'He') + ' crosses ' + what + ' in ' + n + ' steps. About how wide is it?', n, { after: 'm', sol: t(n + '\\times 1\\text{ m}=' + n + '\\text{ m}') + '. It is about ' + n + ' m wide.', hints: ['Each step is about 1 m.'], text: 'steps' });
        } },
        { id: '6b', level: 'BEG', make: function (r) {
          var k = r.pick([3, 5, 6, 7, 9]), what = r.pick(['A flagpole', 'A tree', 'An apartment building', 'A climbing wall']);
          return numPart('(b) A door is about 2 m tall. ' + what + ' is about ' + k + ' doors tall. About how tall is it?', 2 * k, { after: 'm', bad: [[k, 'u3-ref', 'Each door is about <b>2</b> m: multiply ' + k + ' by 2.']], sol: t(k + '\\times 2\\text{ m}=' + 2 * k + '\\text{ m}') + '. It is about ' + 2 * k + ' m tall.', hints: ['Multiply the number of doors by the height of one door.'], text: 'doors' });
        } },
        { id: '6c', level: 'BEG', make: function (r) {
          var k = r.int(2, 8), what = r.pick(['vanilla', 'lemon juice', 'cough syrup', 'maple syrup']);
          return numPart('(c) A teaspoon holds about 5 mL. A recipe needs ' + k + ' teaspoons of ' + what + '. About how many millilitres is that?', 5 * k, { after: 'mL', bad: [[k, 'u3-ref', 'Each teaspoon is about <b>5</b> mL: multiply ' + k + ' by 5.']], sol: t(k + '\\times 5\\text{ mL}=' + 5 * k + '\\text{ mL}') + ' of ' + what + '.', hints: ['Multiply the number of teaspoons by 5 mL.'], text: 'teaspoons' });
        } },
        { id: '6d', level: 'BEG', make: function (r) {
          var kg = r.pick(['a 1 L carton of milk', 'a 1 L bottle of water', 'a bag of sugar labelled 1 kg']), L = r.pick(['a carton of milk', 'a large water bottle', 'a juice carton labelled 1 L']);
          return P.mc(r, '(d) Which gives a good referent for 1 kg and for 1 L?', [
            { html: '1 kg: ' + kg + ' · 1 L: ' + L, right: true },
            { html: '1 kg: a paper clip · 1 L: a teaspoon', why: 'A paper clip is about 1 <b>g</b> and a teaspoon about 5 <b>mL</b> — much too small.', code: 'small' },
            { html: '1 kg: a small car · 1 L: a bathtub', why: 'A small car is about 1 <b>t</b> (1000 kg) and a bathtub holds about 150 L — much too big.', code: 'big' },
            { html: '1 kg: a dime · 1 L: a drop of water', why: 'A dime is about 1 mm thick (a length!) and a drop is a tiny part of 1 mL.', code: 'tiny' }],
            'For example: 1 kg is ' + kg + '; 1 L is ' + L + '. (1 L of water has a mass of about 1 kg.)', ['1 L of water has a mass of about 1 kg.'], 'referent kg L');
        } }] },
      { num: '7', stem: function (sh) { return 'Read the ruler at A, B, C and D.<br>' + ruler({ n: 10, ptrs: sh.map(function (x, i) { return { at: x, label: 'ABCD'.charAt(i) }; }) }); },
        shared: function (r) { return ptrGen(r, 'ABCD', 10, [2.4, 5.5, 8.9]) || [0.8, 3.5, 6.2, 9.7]; },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { var pts = sh.map(function (x, i) { return { at: x, label: 'ABCD'.charAt(i) }; }); return rowsPart('(a) Write each reading in centimetres.', readRows(pts, 'cm'), pts.map(function (p) { return p.label + ': ' + Math.floor(p.at + 1e-9) + ' cm and ' + Math.round((p.at - Math.floor(p.at + 1e-9)) * 10) + ' mm = ' + nS(p.at) + ' cm'; }).join('<br>'), ['Read the last full centimetre before the arrow, then count the small marks (millimetres) past it.', 'Each small mark is 0.1 cm.'], 'ruler cm'); } },
          { id: '7b', level: 'BEG', make: function (r, sh) { var pts = sh.map(function (x, i) { return { at: x, label: 'ABCD'.charAt(i) }; }); return rowsPart('(b) Write each reading in millimetres.', readRows(pts, 'mm'), pts.map(function (p) { return p.label + ': ' + qq(p.at, 'cm') + ' = ' + qq(Math.round(p.at * 10), 'mm'); }).join('<br>'), ['1 cm = 10 mm: multiply the centimetre reading by 10.'], 'ruler mm'); } }] },
      { num: '8', stem: '', parts: [
        { id: '8a', level: 'EMG', make: function (r) {
          var v = find(function () { var a = r.int(1, 3), len = r.int(25, 55) / 10; return [a, Number((a + len).toFixed(1)), r.pick(['eraser', 'key', 'crayon', 'bolt'])]; }, function (v) { return v[1] <= 7.6 && Math.round(v[1] * 10) % 10 !== 0 && !(v[0] === 1 && v[1] === 6.3); }, [2, 6.5, 'eraser']);
          var L = Number((v[1] - v[0]).toFixed(1));
          return rowsPart('(a) How long is the ' + v[2] + '? Give your answer in cm and in mm.<br>' + ruler({ n: 8, ppc: 44, top: 22, objs: [{ a: v[0], b: v[1], label: v[2] }] }), [
            decRow('Length:', L, { after: 'cm', name: 'cm', bad: [[v[1], 'u3-ruler-end', 'The ' + v[2] + ' does not start at 0. Length = end reading − start reading.'], [Number((v[1] + v[0]).toFixed(1)), 'u3-ruler-end', 'Subtract the start reading from the end reading.'], [Math.round(L * 10), 'u3-ruler-units', 'This box is in centimetres.']] }),
            numRow('Length:', Math.round(L * 10), { after: 'mm', name: 'mm', bad: [[Math.round(v[1] * 10), 'u3-ruler-end', 'Subtract the start reading first.'], [L, 'u3-ruler-units', 'This box is in millimetres: 1 cm = 10 mm.']] })],
            'It does not start at 0: end − start = ' + t(nS(v[1]) + '-' + nS(v[0]) + '.0=' + nS(L)) + ' cm<br>The ' + v[2] + ' is ' + nS(L) + ' cm (' + Math.round(L * 10) + ' mm) long.', ['Length = end reading − start reading.'], 'object length');
        } },
        { id: '8b', level: 'PRG', make: function (r) {
          var v = find(function () { return [r.pick([60, 70, 80, 90, 110, 140]), r.int(11, 89) / 10]; }, function (v) { return Math.round(v[1] * 10) % 10 !== 0 && !(v[0] === 120 && same(v[1], 6.8)); }, [80, 4.6]);
          var cm = Number((v[0] + v[1]).toFixed(1)), who = r.pick(['Liam', 'Hana', 'Jayden', 'Noor']), what = r.pick(['a shelf', 'a window', 'a desk', 'a doorway']);
          return rowsPart('(b) ' + who + ' measures ' + what + ' with a tape measure. The end is at the arrow. Write the length in cm, in mm and in m.<br>' + ruler({ start: v[0], n: 10, ppc: 50, ptrs: [{ at: cm }] }), [
            decRow('Length:', cm, { after: 'cm', name: 'cm', bad: [[Number((cm + 1).toFixed(1)), 'u3-ruler-next', 'Read the last full centimetre <b>before</b> the arrow.'], [Number((cm + 0.1).toFixed(1)), 'u3-ruler-mm', 'Count the small marks again.'], [Number((cm - 0.1).toFixed(1)), 'u3-ruler-mm', 'Count the small marks again.']] }),
            S.convRow('Length:', cm, 'cm', 'mm', { name: 'mm' }), S.convRow('Length:', cm, 'cm', 'm', { name: 'm' })],
            'The arrow is ' + Math.round(v[1] * 10) % 10 + ' small marks past ' + Math.floor(cm) + ', so ' + nS(cm) + ' cm.<br>' + t(q(cm, 'cm') + '=' + q(S.convS(cm, 'cm', 'mm'), 'mm') + '=' + q(S.convS(cm, 'cm', 'm'), 'm')) + ' (cm to mm: × 10; cm to m: ÷ 100).', ['Read the last numbered mark before the arrow, then count the small marks.', 'cm → mm: × 10. cm → m: ÷ 100.'], 'tape reading');
        } }] },
      { num: '9', stem: 'Change each measurement.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { return convQ(r, 'a', 'm', 'cm', function () { return r1(r, 1.2, 9.8); }); } },
        { id: '9b', level: 'BEG', make: function (r) { return convQ(r, 'b', 'mm', 'cm', function () { return r.int(11, 99); }, function (x) { return x % 10 !== 0; }); } },
        { id: '9c', level: 'EMG', make: function (r) { return convQ(r, 'c', 'km', 'm', function () { return r1(r, 1.2, 9.8); }); } },
        { id: '9d', level: 'EMG', make: function (r) { return convQ(r, 'd', 'cm', 'm', function () { return r.int(11, 99) * 10; }); } },
        { id: '9e', level: 'EMG', make: function (r) { return convQ(r, 'e', 'm', 'mm', function () { return r.int(2, 9) / 10; }); } },
        { id: '9f', level: 'EMG', make: function (r) { return convQ(r, 'f', 'm', 'km', function () { return r.int(11, 99) * 100; }); } },
        { id: '9g', level: 'BEG', make: function (r) { return convQ(r, 'g', 'kg', 'g', function () { return r1(r, 1.2, 9.8); }); } },
        { id: '9h', level: 'EMG', make: function (r) { return convQ(r, 'h', 'g', 'kg', function () { return r.int(11, 99) * 10; }); } },
        { id: '9i', level: 'EMG', make: function (r) { return convQ(r, 'i', 'L', 'mL', function () { return r1(r, 1.05, 2.95, 2); }, function (x) { return Math.round(x * 100) % 10 !== 0; }); } },
        { id: '9j', level: 'EMG', make: function (r) { return convQ(r, 'j', 'mL', 'L', function () { return r.int(1, 9) * 100; }); } },
        { id: '9k', level: 'BEG', make: function (r) { return convQ(r, 'k', 'g', 'mg', function () { return r.int(2, 9); }); } },
        { id: '9l', level: 'PRG', make: function (r) { return convQ(r, 'l', 'mm', 'm', function () { return r.int(2, 9); }); } }] },
      { num: '10', stem: function (sh) { return sh.who + ' changed ' + qq(sh.x, 'm') + ' to centimetres. ' + (sh.he ? 'He' : 'She') + ' wrote: ' + t(q(sh.x, 'm') + '=' + q(sh.w, 'cm')) + '.'; },
        shared: function (r) { var x = find(function () { return r1(r, 1.2, 9.8); }, function (v) { return v !== 3.45; }, 4.6), who = r.pick([['Jun', 1], ['Talia', 0], ['Marco', 1], ['Priya', 0]]); return { x: x, w: Number(S.shift(x, -2)), who: who[0], he: who[1] }; },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, '(a) Without calculating, how can you tell the answer is wrong?', [
              { html: 'A centimetre is smaller than a metre, so the number of centimetres must be <b>bigger</b> than ' + nS(sh.x) + '. The answer is smaller.', right: true },
              { html: 'A centimetre is bigger than a metre, so the number should be smaller.', why: 'A centimetre is <b>smaller</b> than a metre (100 cm = 1 m).', code: 'size' },
              { html: 'The answer has too many decimal places to be a length.', why: 'Lengths can have many decimal places. Think about whether the number should be bigger or smaller.', code: 'places' },
              { html: 'You can’t tell without a calculator.', why: 'Think about the size of the units: smaller unit → bigger number.', code: 'cant' }],
              'A centimetre is smaller than a metre, so it takes <b>more</b> centimetres: the number must be bigger than ' + nS(sh.x) + '. ' + nS(sh.w) + ' is smaller.', ['Smaller unit → bigger number.'], 'tell wrong');
          } },
          { id: '10bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            return P.mc(r, '(b) What did ' + sh.who + ' do wrong?', [
              { html: (sh.he ? 'He' : 'She') + ' divided by 100 (moved the decimal point left). m to cm is 2 steps <b>down</b>, so multiply by 100.', right: true },
              { html: (sh.he ? 'He' : 'She') + ' multiplied by 100 instead of 1000.', why: t(nS(sh.x) + '\\times 100') + ' would give a bigger number, not ' + nS(sh.w) + '.', code: 'mult' },
              { html: (sh.he ? 'He' : 'She') + ' should have divided by 1000.', why: 'Going down the staircase (to a smaller unit) means multiply.', code: 'div1000' },
              { html: 'Nothing: ' + nS(sh.w) + ' cm is right.', why: 'Smaller unit → bigger number. Check again.', code: 'fine' }],
              (sh.he ? 'He' : 'She') + ' divided by 100. m to cm is 2 steps down, so multiply by 100.', ['Which way did the decimal point move? Which way should it move?'], 'what wrong');
          } },
          { id: '10bii', sub: 'b ii', level: 'BEG', make: function (r, sh) { return S.convPart('(b) Find the correct answer: ' + qq(sh.x, 'm') + ' = ?', sh.x, 'm', 'cm', { text: 'correct m→cm' }); } }] },
      { num: '11', stem: 'Choose &lt;, &gt; or = for each pair. Change to the same unit first.', shared: function (r) {
          return [cmpRow(r, 'm', 'cm'), cmpRow(r, 'km', 'm'), cmpRow(r, 'mm', 'cm'), cmpRow(r, 'kg', 'g', 'trap'), cmpRow(r, 'L', 'mL'), cmpRow(r, 'cm', 'mm')]; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) { return cmpGrid(r, '(a)–(c)', sh.slice(0, 3), 'compare a-c'); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { return cmpGrid(r, '(d)–(f)', sh.slice(3).map(function (x) { var y = {}; Object.keys(x).forEach(function (k) { y[k] = x[k]; }); y.off = 3; return y; }), 'compare d-f'); } }] },
      { num: '12', stem: '', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var hs = find(function () { return [r.int(150, 180) * 10, r.int(150, 180) * 10, r.int(300, 360) * 5, r.int(150, 179) * 10 + 5]; }, function (a) { for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) if (Math.abs(a[i] - a[j]) < 5) return false; return Math.max.apply(null, a) - Math.min.apply(null, a) <= 120; }, [1620, 1580, 1655, 1605]);
          var names = r.shuffle(['Ava', 'Ben', 'Cole', 'Dana', 'Eli', 'Fatima', 'Gus', 'Hira']).slice(0, 4), us = ['m', 'cm', 'mm', 'cm'];
          var it = hs.map(function (mm, i) { return { n: names[i], mm: mm, cm: mm / 10, s: S.convS(mm, 'mm', us[i]), u: us[i] }; });
          var sorted = it.slice().sort(function (a, b) { return a.mm - b.mm; });
          return P.order(r, 'The heights of four basketball players are ' + it.map(function (x) { return x.n + ' ' + qq(x.s, x.u); }).join(', ') + '. Put them in order from shortest to tallest.', sorted.map(function (x) { return { id: x.n, html: x.n + ' (' + qq(x.s, x.u) + ')' }; }),
            { first: 'shortest', last: 'tallest', why: function (a, b) { var A = it.filter(function (x) { return x.n === a; })[0], B = it.filter(function (x) { return x.n === b; })[0]; return 'Change both to cm: ' + A.n + ' is ' + qq(A.cm, 'cm') + ' and ' + B.n + ' is ' + qq(B.cm, 'cm') + '.'; } },
            'In cm: ' + it.map(function (x) { return x.n + ' ' + (x.u === 'cm' ? qq(x.cm, 'cm') : qq(x.s, x.u) + ' = ' + qq(x.cm, 'cm')); }).join(', ') + '<br>Shortest to tallest: ' + sorted.map(function (x) { return x.n; }).join(', ') + '.', ['Change all four heights to the same unit (cm) first.'], 'order heights');
        } }] },
      { num: '13', stem: function (sh) { return 'A ' + nS(sh.V) + ' L jug of juice is poured into glasses that each hold ' + sh.g + ' mL.'; },
        shared: function (r) { return find(function () { return { V: r1(r, 1.2, 2.95, 2), g: r.pick([250, 200, 300, 350]) }; }, function (s) { var m = Math.round(s.V * 1000); return m % s.g >= 40 && Math.floor(m / s.g) >= 4 && !(s.V === 1.5); }, { V: 1.89, g: 250 }); },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, sh) { return S.convPart('(a) Change ' + qq(sh.V, 'L') + ' to millilitres.', sh.V, 'L', 'mL'); } },
          { id: '13b', level: 'EMG', make: function (r, sh) { var m = Math.round(sh.V * 1000), n = Math.floor(m / sh.g); return numPart('(b) How many glasses can be filled to the top?', n, { after: 'glasses', bad: [[n + 1, 'u3-round-up', 'Only ' + n + ' glasses are <b>full</b>; the last one is only partly filled. Round down.'], [Math.round(sh.V * 100) / 100 / sh.g, 'u3-no-convert', 'Change ' + nS(sh.V) + ' L to mL first.']], sol: t(nT(m) + '\\div ' + sh.g + '=' + nS(Math.round(m / sh.g * 100) / 100)) + ', so ' + n + ' full glasses.', hints: ['Divide the millilitres by the size of one glass.', 'Only full glasses count: round down.'], text: 'full glasses' }); } },
          { id: '13c', level: 'PRG', make: function (r, sh) { var m = Math.round(sh.V * 1000), n = Math.floor(m / sh.g), left = m - n * sh.g; return numPart('(c) How much juice is left over?', left, { after: 'mL', bad: [[n * sh.g, 'u3-left-total', 'That is the juice in the full glasses. Subtract it from ' + m + ' mL.'], [(n + 1) * sh.g - m, 'u3-left-total', 'That is how much more you would need to fill another glass. Find what is <b>left</b>: ' + m + ' − ' + n * sh.g + '.']], sol: t(n + '\\times ' + sh.g + '=' + n * sh.g) + ' mL; ' + t(nT(m) + '-' + nT(n * sh.g) + '=' + left) + ' mL left.', hints: ['Find the juice in the full glasses, then subtract.'], text: 'juice left' }); } }] },
      { num: '14', stem: function (sh) { return 'A spool holds ' + sh.S + ' m of ribbon. Each gift bow uses ' + sh.b + ' cm of ribbon.'; },
        shared: function (r) { return find(function () { return { S: r.pick([3, 4, 5, 6, 8]), b: r.pick([30, 35, 40, 45, 55, 65, 70]) }; }, function (s) { return (s.S * 100) % s.b >= 5; }, { S: 5, b: 35 }); },
        parts: [
          { id: '14a', level: 'PRG', make: function (r, sh) { var c = sh.S * 100, n = Math.floor(c / sh.b); return numPart('(a) How many bows can be made?', n, { after: 'bows', bad: [[n + 1, 'u3-round-up', 'Only ' + n + ' bows are complete — there isn’t enough ribbon for one more. Round down.'], [Math.floor(sh.S / sh.b * 1000) / 1000, 'u3-no-convert', 'Change ' + sh.S + ' m to cm first.']], sol: sh.S + ' m = ' + t(sh.S + '\\times 100=' + c) + ' cm<br>' + t(c + '\\div ' + sh.b + '=' + nS(Math.floor(c / sh.b * 100) / 100) + '\\ldots') + ', so ' + n + ' bows.', hints: ['Change the metres to centimetres first.', 'Only complete bows count.'], text: 'bows' }); } },
          { id: '14b', level: 'ADV', make: function (r, sh) { var c = sh.S * 100, n = Math.floor(c / sh.b), left = c - n * sh.b; return numPart('(b) How much ribbon is left?', left, { after: 'cm', bad: [[n * sh.b, 'u3-left-total', 'That is the ribbon used. Subtract it from ' + c + ' cm.'], [left / 100, 'u3-ruler-units', 'This box is in centimetres.']], sol: t(n + '\\times ' + sh.b + '=' + n * sh.b) + ' cm; ' + t(c + '-' + n * sh.b + '=' + left) + ' cm left.', hints: ['Find the ribbon used by the bows, then subtract from the whole spool (in cm).'], text: 'ribbon left' }); } }] },
      { num: '15', stem: function (sh) { return 'A vet says ' + sh.pet + ' needs ' + sh.D + ' mg of a medicine each day. Each tablet has ' + nS(sh.T) + ' g of the medicine.'; },
        shared: function (r) { return find(function () { var T = r.pick([0.25, 0.125, 0.5, 0.2, 0.3, 0.15]), n = r.int(2, 4); return { T: T, D: Math.round(T * 1000 * n), n: n, pet: r.pick(['Rex the dog', 'Luna the cat', 'Duke the horse', 'Bella the dog']) }; }, function (s) { return !(s.T === 0.25 && s.n === 3); }, { T: 0.25, D: 500, n: 2, pet: 'Rex the dog' }); },
        parts: [
          { id: '15a', level: 'EMG', make: function (r, sh) { return S.convPart('(a) How many milligrams are in one tablet?', sh.T, 'g', 'mg'); } },
          { id: '15b', level: 'PRG', make: function (r, sh) { var mg = Math.round(sh.T * 1000); return numPart('(b) How many tablets are needed each day?', sh.n, { after: 'tablets', bad: [[sh.D / sh.T, 'u3-no-convert', 'Change the tablet to mg first (part (a)): the units must match before you divide.'], [Math.round(sh.D * sh.T * 1000) / 1000, 'u3-no-convert', 'Divide the daily dose by the medicine in one tablet (both in mg).']], sol: t(sh.D + '\\div ' + mg + '=' + sh.n) + ' tablets', hints: ['Use your answer to (a): both amounts must be in mg.'], text: 'tablets' }); } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'BEG', make: function (r) {
          var x = find(function () { return r1(r, 1.05, 8.95, 2); }, function (v) { return Math.round(v * 100) % 10 !== 0 && v !== 3.45; }, 3.45);
          return P.mc(r, qq(x, 'km') + ' is the same as', [{ html: qq(S.convS(x, 'km', 'm'), 'm'), right: true }, { html: qq(S.shift(x, 2), 'm'), why: 'km to m is <b>3</b> steps down (km → hm → dam → m): × 1000.', code: 'u3-si-steps' }, { html: qq(S.shift(x, 4), 'm'), why: 'Count the steps: km → hm → dam → m is 3 steps, so × 1000.', code: 'u3-si-steps' }, { html: qq(S.shift(x, -3), 'm'), why: 'A metre is smaller than a kilometre, so the number gets <b>bigger</b>: multiply.', code: 'u3-si-way' }],
            'km to m is 3 steps down, so ' + t(nS(x) + '\\times 1000=' + S.convS(x, 'km', 'm')) + ' m.', ['km to m: 3 steps down.'], 'MC km to m', true);
        } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          var it = r.pick([['a loaf of bread', '675', 1], ['a large apple', '220', 1], ['a bag of potatoes', '4.5', 2], ['a box of cereal', '500', 1], ['a bicycle', '12', 2]]);
          var opts = it[2] === 1 ? [it[1] + ' mg', it[1] + ' g', it[1] + ' kg', nS(Number(it[1]) / 100) + ' t'] : [it[1] + ' mg', it[1] + ' g', it[1] + ' kg', it[1] + ' t'];
          return P.mc(r, 'The most reasonable mass for ' + it[0] + ' is', opts.map(function (o, i) { return { html: o, right: i === it[2], why: i < it[2] ? 'Much too light — a paper clip is about 1 g.' : 'Much too heavy — a person is about 70 kg and a small car about 1 t.', code: i < it[2] ? 'light' : 'heavy' }; }),
            '<b>' + opts[it[2]] + '</b>. ' + (it[2] === 1 ? 'It is lighter than a 1 L carton of milk (about 1 kg) but much heavier than a paper clip (1 g).' : 'A 1 L carton of milk is about 1 kg, so this is about ' + it[1] + ' cartons.'), ['Compare with referents: a paper clip is 1 g, a 1 L carton of milk is 1 kg, a small car is 1 t.'], 'MC mass', true);
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var x = find(function () { return r1(r, 1.05, 4.95, 2); }, function (v) { return Math.round(v * 100) % 10 !== 0 && v !== 3.45; }, 2.75), what = r.pick(['A hallway', 'A garage door', 'A kitchen', 'A hockey bench']);
          return S.convPart('<b>Numerical response.</b> ' + what + ' is ' + qq(x, 'm') + ' wide. Its width in centimetres is ________ cm.', x, 'm', 'cm', { nr: true, text: 'NR m to cm' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Complete each statement.', parts: [
        { id: 'e1', level: 'EMG', make: function (r) {
          var f = r.shuffle([['dam', 'm'], ['hm', 'm'], ['dm', 'm'], ['cL', 'L'], ['mg', 'g'], ['kL', 'L'], ['dg', 'g'], ['hL', 'L']]).slice(0, 6);
          return rowsPart('Fill in each blank.', f.map(function (p, i) { return S.convRow('(' + String.fromCharCode(97 + i) + ') 1 ' + p[0] + ' =', 1, p[0], p[1], { name: '1 ' + p[0] }); }), f.map(function (p) { return '1 ' + p[0] + ' = ' + S.convS(1, p[0], p[1]) + ' ' + p[1]; }).join('<br>'), ['kilo 1000, hecto 100, deca 10, deci 0.1, centi 0.01, milli 0.001.'], 'prefix facts');
        } }] },
      { num: '2', stem: 'Choose the most sensible unit.', shared: function (r) { var used = []; return { a: pickSens(r, 4, used, true), b: pickSens(r, 4, used, true) }; },
        parts: [
          { id: 'e2a', level: 'BEG', make: function (r, sh) { return sensGrid(r, '(a)–(d)', sh.a, SCOLS.filter(function (c) { return c !== 't'; }), 'sensible e a'); } },
          { id: 'e2b', level: 'BEG', make: function (r, sh) { return sensGrid(r, '(e)–(h)', sh.b, SCOLS.filter(function (c) { return c !== 't'; }), 'sensible e b', 4); } }] },
      { num: '3', stem: '', parts: [
        { id: 'e3', level: 'BEG', make: function (r) {
          var a = find(function () { var x = ptrGen(r, 'PQ', 8, []); return x ? x.concat([r.int(Math.ceil(x[1] + 1.5), 7)]) : null; }, function (x) { return x && x[2] > x[1] + 1.4 && x[2] <= 7.9; }, [1.3, 4.8, 7]);
          var pts = a.map(function (x, i) { return { at: x, label: 'PQR'.charAt(i) }; });
          var rows = []; readRows(pts, 'cm').forEach(function (rw, i) { rows.push(rw); rows.push(readRows([pts[i]], 'mm')[0]); });
          rows.forEach(function (rw, i) { rw.field.name = pts[Math.floor(i / 2)].label + (i % 2 ? ' (mm)' : ' (cm)'); });
          return rowsPart('Read the ruler at P, Q and R. Write each reading in centimetres and in millimetres.<br>' + ruler({ n: 8, ptrs: pts }), rows, pts.map(function (p) { return p.label + ': ' + qq(p.at, 'cm') + ' = ' + qq(Math.round(p.at * 10), 'mm'); }).join('<br>'), ['Read the last full centimetre, then count the small marks.', '1 cm = 10 mm.'], 'ruler PQR');
        } }] },
      { num: '4', stem: 'Change each measurement.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) {
          var a = r1(r, 1.2, 9.8), b = r.int(105, 990), c = r.int(5, 95) / 100, d = r.int(11, 99);
          return rowsPart('(a)–(d)', [S.convRow('(a) ' + nS(a) + ' m =', a, 'm', 'cm'), S.convRow('(b) ' + nS(b) + ' mm =', b, 'mm', 'm'), S.convRow('(c) ' + nS(c) + ' km =', c, 'km', 'm'), S.convRow('(d) ' + d + ' cm =', d, 'cm', 'mm')],
            ['(a) ' + S.convWhy('m', 'cm'), '(b) ' + S.convWhy('mm', 'm'), '(c) ' + S.convWhy('km', 'm'), '(d) ' + S.convWhy('cm', 'mm')].join('<br>'), ['Count the steps on the staircase for each one.'], 'conv a-d');
        } },
        { id: 'e4b', level: 'PRG', make: function (r) {
          var e = r.int(11, 99) * 100, f = r.int(1, 9) / 100, g = r.int(11, 49), h = r1(r, 1.5, 8.5);
          return rowsPart('(e)–(h)', [S.convRow('(e) ' + e + ' g =', e, 'g', 'kg'), S.convRow('(f) ' + nS(f) + ' L =', f, 'L', 'mL'), S.convRow('(g) ' + g + ' cm =', g, 'cm', 'm'), S.convRow('(h) ' + nS(h) + ' g =', h, 'g', 'mg')],
            ['(e) ' + S.convWhy('g', 'kg'), '(f) ' + S.convWhy('L', 'mL'), '(g) ' + S.convWhy('cm', 'm'), '(h) ' + S.convWhy('g', 'mg')].join('<br>'), ['Count the steps on the staircase for each one.'], 'conv e-h');
        } }] },
      { num: '5', stem: 'Choose &lt;, &gt; or = for each pair.', parts: [
        { id: 'e5', level: 'EMG', make: function (r) { return cmpGrid(r, '(a)–(d)', [cmpRow(r, 'cm', 'mm'), cmpRow(r, 'km', 'm'), cmpRow(r, 'm', 'cm'), cmpRow(r, 'g', 'kg')], 'compare e'); } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [
        { id: 'e6', level: 'PRG', make: function (r) {
          var g = find(function () { var b = r.int(900, 1300); return [b, b + r.int(-180, 180), b + r.int(-180, 180), b + r.int(-180, 180)].map(function (x) { return Math.round(x / 5) * 5; }); }, function (a) { for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) if (Math.abs(a[i] - a[j]) < 20) return false; return a.every(function (x) { return x > 800 && x < 1500; }); }, [1200, 1150, 980, 1025]);
          var it = g.map(function (x, i) { var kg = i % 2 === 0; return { id: 'p' + i, g: x, html: kg ? qq(S.convS(x, 'g', 'kg'), 'kg') : qq(x, 'g'), u: kg ? 'kg' : 'g' }; });
          var sorted = it.slice().sort(function (a, b) { return a.g - b.g; });
          return P.order(r, 'A courier has four parcels: ' + it.map(function (x) { return x.html; }).join(', ') + '. Put them in order from lightest to heaviest.', sorted.map(function (x) { return { id: x.id, html: x.html }; }), { first: 'lightest', last: 'heaviest', why: function (a, b) { var A = it.filter(function (x) { return x.id === a; })[0], B = it.filter(function (x) { return x.id === b; })[0]; return 'Change both to grams: ' + A.html + ' = ' + qq(A.g, 'g') + ' and ' + B.html + ' = ' + qq(B.g, 'g') + '.'; } },
            'In grams: ' + it.map(function (x) { return x.u === 'kg' ? x.html + ' = ' + qq(x.g, 'g') : x.html; }).join(', ') + '<br>Lightest to heaviest: ' + sorted.map(function (x) { return x.html; }).join(', ') + '.', ['Change them all to grams first.'], 'order parcels');
        } }] },
      { num: '7', stem: function (sh) { return 'A ' + sh.coin + ' has a mass of about ' + nS(sh.m) + ' g. A bank roll holds ' + sh.n + ' ' + sh.coin + 's.'; },
        shared: function (r) { return r.pick([{ coin: 'nickel', m: 4, n: 40, b: 25 }, { coin: 'dime', m: 1.75, n: 50, b: 40 }, { coin: 'quarter', m: 4.4, n: 40, b: 25 }, { coin: 'nickel', m: 4, n: 40, b: 50 }, { coin: 'loonie', m: 6.25, n: 25, b: 40 }]); },
        parts: [
          { id: 'e7a', level: 'BEG', make: function (r, sh) { var g = Math.round(sh.m * sh.n * 100) / 100; return decPart('(a) What is the mass of one roll, in grams?', g, { after: 'g', sol: t(sh.n + '\\times ' + nS(sh.m) + '=' + nS(g)) + ' g', hints: ['Multiply the number of coins by the mass of one.'], text: 'roll mass' }); } },
          { id: 'e7b', level: 'PRG', make: function (r, sh) { var g = Math.round(sh.m * sh.n * sh.b * 100) / 100, kg = Number(S.convS(g, 'g', 'kg')); return decPart('(b) A bag holds ' + sh.b + ' rolls. What is the mass of the bag of coins, in kilograms?', kg, { after: 'kg', bad: [[g, 'u3-si-same', 'That is in grams. Change it to kilograms: ÷ 1000.'], [g / 100, 'u3-si-steps', 'g to kg is 3 steps up: ÷ 1000.']], sol: t(sh.b + '\\times ' + nS(Math.round(sh.m * sh.n * 100) / 100) + '=' + nT(g)) + ' g; ' + t(nT(g) + '\\div 1000=' + nS(kg)) + ' kg', hints: ['Find the mass of the bag in grams first.', 'Then change grams to kilograms.'], text: 'bag mass' }); } }] },
      { num: '8', stem: '', parts: [
        { id: 'e8', level: 'PRG', make: function (r) {
          var v = find(function () { return { L: r1(r, 1.8, 3.6), s: r.pick([35, 40, 45, 50, 55, 60]) }; }, function (v) { var c = Math.round(v.L * 100); return c % v.s >= 5 && !(v.L === 2.4 && v.s === 45); }, { L: 2.4, s: 45 });
          var c = Math.round(v.L * 100), n = Math.floor(c / v.s), left = c - n * v.s;
          return rowsPart('A carpenter has a board that is ' + qq(v.L, 'm') + ' long. She cuts shelves that are each ' + v.s + ' cm long. How many shelves can she cut? How much of the board is left? (Ignore the width of the saw cuts.)',
            [numRow('Shelves:', n, { after: 'shelves', bad: [[n + 1, 'u3-round-up', 'Only complete shelves count. Round down.']] }), numRow('Left over:', left, { after: 'cm', bad: [[n * v.s, 'u3-left-total', 'That is the wood used. Subtract it from ' + c + ' cm.']] })],
            qq(v.L, 'm') + ' = ' + c + ' cm; ' + t(c + '\\div ' + v.s + '=' + nS(Math.floor(c / v.s * 100) / 100) + '\\ldots') + ', so ' + n + ' shelves.<br>' + t(n + '\\times ' + v.s + '=' + n * v.s) + ' cm; ' + t(c + '-' + n * v.s + '=' + left) + ' cm left.', ['Change the board length to cm first.'], 'shelves');
        } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'ADV', make: function (r) {
          var v = find(function () { return { L: r1(r, 2, 5), b: r.pick([500, 600, 750, 946]) }; }, function (v) { var m = Math.round(v.L * 1000); return m % v.b > 0 && !(v.L === 3.5 && v.b === 750); }, { L: 3.5, b: 750 }), who = r.pick(['Noor', 'Ethan', 'Kai', 'Lucy']);
          var m = Math.round(v.L * 1000), n = Math.ceil(m / v.b);
          return numPart(who + ' is going on a day hike and wants to carry ' + qq(v.L, 'L') + ' of water. The bottles each hold ' + v.b + ' mL. How many bottles need to be filled?', n, { after: 'bottles', bad: [[n - 1, 'u3-round-down', (n - 1) + ' bottles hold only ' + (n - 1) * v.b + ' mL, which is not enough. Round up.']], sol: qq(v.L, 'L') + ' = ' + m + ' mL; ' + t(m + '\\div ' + v.b + '\\approx ' + nS(Math.round(m / v.b * 100) / 100)) + '<br>' + (n - 1) + ' bottles hold only ' + (n - 1) * v.b + ' mL, so ' + n + ' bottles.', hints: ['Change litres to millilitres, then divide.', 'Every drop has to fit: round up.'], text: 'bottles' });
        } }] },
      { num: '10', stem: function (sh) { return 'A building plan says a cabinet is ' + sh.mm + ' mm wide. ' + sh.who + '’s tape measure is numbered in centimetres.'; },
        shared: function (r) { return find(function () { var s = r.pick([80, 85, 90, 60, 70]), c = s + r.int(12, 88) / 10; return { s: s, cm: Number(c.toFixed(1)), mm: Math.round(c * 10), who: r.pick(['Ravi', 'Mila', 'Sam', 'Dina']) }; }, function (x) { return x.mm % 10 !== 0 && x.cm - x.s >= 1.5 && x.cm - x.s <= 8.5; }, { s: 85, cm: 91.5, mm: 915, who: 'Ravi' }); },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, sh) { return S.convPart('(a) What reading on the tape should ' + sh.who + ' look for?', sh.mm, 'mm', 'cm'); } },
          { id: 'e10b', level: 'EMG', make: function (r, sh) {
            var pos = r.shuffle([sh.cm, Number((sh.cm + 1).toFixed(1)), Number((sh.cm - 1).toFixed(1)), Number((sh.cm + r.pick([0.5, -0.5, 0.3])).toFixed(1))].filter(function (x, i, a) { return a.indexOf(x) === i && x > sh.s + 0.2 && x < sh.s + 9.8; })).slice(0, 4);
            if (pos.indexOf(sh.cm) < 0) pos[0] = sh.cm;
            var letters = 'ABCD', sortedPos = pos.slice().sort(function (a, b) { return a - b; });
            return P.mc(r, '(b) Which arrow is at that reading?<br>' + ruler({ start: sh.s, n: 10, ppc: 50, ptrs: sortedPos.map(function (x, i) { return { at: x, label: letters.charAt(i) }; }) }), sortedPos.map(function (x, i) { return { html: 'Arrow ' + letters.charAt(i), right: same(x, sh.cm), why: same(x, sh.cm) ? null : 'Arrow ' + letters.charAt(i) + ' is at ' + nS(x) + ' cm. Find ' + Math.floor(sh.cm) + ', then count ' + Math.round((sh.cm % 1) * 10) + ' small marks past it.', code: 'arrow' }; }),
              'Arrow ' + letters.charAt(sortedPos.indexOf(sh.cm)) + ': ' + Math.round((sh.cm % 1) * 10) + ' small marks past ' + Math.floor(sh.cm) + ' is ' + nS(sh.cm) + ' cm.', ['Find the numbered mark ' + Math.floor(sh.cm) + ', then count the small marks (mm) past it.'], 'arrow pick', true);
          } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'BEG', make: function (r) {
          var it = r.pick([['a kitchen sink', 1, ['20 mL', '20 L', '2000 L', '0.2 L']], ['a bucket', 1, ['10 mL', '10 L', '1000 L', '0.1 L']], ['a coffee mug', 0, ['300 mL', '30 L', '300 L', '3 mL']], ['a car’s gas tank', 1, ['60 mL', '60 L', '6000 L', '0.6 L']]]);
          return P.mc(r, 'The most reasonable capacity for ' + it[0] + ' is', it[2].map(function (o, i) { return { html: o, right: i === it[1], why: i === it[1] ? null : 'Picture it: a cup is 250 mL, a milk carton is 1 L, a bathtub holds about 150 L.', code: 'c' + i }; }), '<b>' + it[2][it[1]] + '</b>.', ['Compare with referents: a teaspoon 5 mL, a cup 250 mL, a carton of milk 1 L.'], 'MC capacity', true);
        } }] },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'EMG', make: function (r) {
          var v = find(function () { return { k: r.pick([2, 3, 4, 5, 6, 10]), s: r.pick([100, 200, 250, 400, 500]) }; }, function (v) { return (v.k * 1000) % v.s === 0 && v.k * 1000 / v.s <= 60 && v.k * 1000 / v.s >= 6; }, { k: 5, s: 250 }), n = v.k * 1000 / v.s;
          return numPart('<b>Numerical response.</b> A ' + v.k + ' km fun run is split into sections that are each ' + v.s + ' m long. The number of sections is ________.', n, { nr: true, bad: [[v.k / v.s, 'u3-no-convert', 'Change ' + v.k + ' km to metres first.']], sol: v.k + ' km = ' + v.k * 1000 + ' m; ' + t(v.k * 1000 + '\\div ' + v.s + '=' + n) + ' sections', hints: ['Change km to m, then divide.'], text: 'NR sections' });
        } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return sh.who + '’s bike ride to school is ' + sh.km + ' km ' + sh.m + ' m.'; },
        shared: function (r) { return find(function () { return { km: r.int(1, 4), m: r.int(1, 19) * 50, who: r.pick(['Kai', 'Zoe', 'Arjun', 'Maya']) }; }, function (s) { return s.m % 100 !== 0 && !(s.km === 2 && s.m === 350); }, { km: 2, m: 350, who: 'Kai' }); },
        parts: [
          { id: 'e13a', level: 'PRG', make: function (r, sh) { var tot = sh.km * 1000 + sh.m, k = Number(S.convS(tot, 'm', 'km')); return rowsPart('(a) Write the distance in metres, and in kilometres.', [numRow('In metres:', tot, { after: 'm', bad: [[sh.km + sh.m, 'u3-si-same', 'Change ' + sh.km + ' km to metres first (× 1000), then add the ' + sh.m + ' m.'], [sh.km * 100 + sh.m, 'u3-si-steps', '1 km = <b>1000</b> m.']] }), decRow('In kilometres:', k, { after: 'km', bad: [[sh.km + sh.m / 100, 'u3-si-steps', sh.m + ' m is ' + t(sh.m + '\\div 1000') + ' km.'], [Number(sh.km + '.' + sh.m), 'u3-si-steps', 'Change the whole distance in metres to km: ÷ 1000.']] })], sh.km + ' km = ' + sh.km * 1000 + ' m, so ' + tot + ' m; ' + t(tot + '\\div 1000=' + nS(k)) + ' km', ['1 km = 1000 m.'], 'km m'); } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) { var k = (sh.km * 1000 + sh.m) / 1000, d = Math.round(k * 2 * 1000) / 1000, w = Math.round(d * 5 * 1000) / 1000; return decPart('(b) ' + sh.who + ' rides to school and back home 5 days a week. How far is that in a week, in kilometres?', w, { after: 'km', bad: [[Math.round(k * 5 * 1000) / 1000, 'u3-one-way', 'There and back is <b>two</b> trips each day.'], [d, 'u3-one-way', 'That is one day. Multiply by 5 days.'], [w * 1000, 'u3-si-same', 'Give the answer in kilometres.']], sol: t('2\\times ' + nS(k) + '=' + nS(d)) + ' km a day; ' + t('5\\times ' + nS(d) + '=' + nS(w)) + ' km a week', hints: ['Use the distance in km from (a).', 'Two trips a day, 5 days a week.'], text: 'bike week' }); } }] },
      { num: '14', stem: function (sh) { return 'A bottle of plant food says: mix ' + sh.p + ' mL of plant food with each 1 L of water.'; },
        shared: function (r) { return find(function () { return { p: r.pick([5, 2, 4, 10]), c: r1(r, 2.5, 9.5), b: r.pick([250, 500, 750, 600]) }; }, function (s) { return !(s.p === 5 && s.c === 4.5 && s.b === 750); }, { p: 5, c: 4.5, b: 750 }); },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) { var a = Math.round(sh.c * sh.p * 1000) / 1000; return decPart('(a) How much plant food goes in a ' + nS(sh.c) + ' L watering can?', a, { after: 'mL', bad: [[sh.p, 'u3-ref', 'That is for 1 L. Multiply by ' + nS(sh.c) + ' L.']], sol: t(nS(sh.c) + '\\times ' + sh.p + '=' + nS(a)) + ' mL', hints: ['Each litre of water gets ' + sh.p + ' mL.'], text: 'plant can' }); } },
          { id: 'e14b', level: 'MAS', make: function (r, sh) { var L = sh.b / 1000, a = Math.round(L * sh.p * 10000) / 10000; return decPart('(b) How much plant food goes in a ' + sh.b + ' mL spray bottle?', a, { after: 'mL', bad: [[sh.b * sh.p, 'u3-no-convert', 'The rule is per <b>litre</b>. Change ' + sh.b + ' mL to litres first.'], [sh.p, 'u3-ref', 'That is for a whole litre. The bottle holds less than 1 L.'], [Math.round(sh.b / 100 * sh.p * 1000) / 1000, 'u3-si-steps', 'mL to L is ÷ 1000.']], sol: sh.b + ' mL = ' + t(sh.b + '\\div 1000=' + nS(L)) + ' L; ' + t(nS(L) + '\\times ' + sh.p + '=' + nS(a)) + ' mL', hints: ['Change the bottle size to litres first.', 'Then multiply by ' + sh.p + ' mL per litre.'], text: 'plant bottle' }); } }] },
      { num: '15', stem: function (sh) { return sh.who + ' says, “To change metres to millimetres, multiply by 100, because milli is two steps below the base unit.”'; },
        shared: function (r) { return { who: r.pick(['Maya', 'Leo', 'Ines', 'Theo']), x: find(function () { return r1(r, 0.6, 4.8); }, function (v) { return v !== 1.2; }, 1.2) }; },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, '(a) What is the mistake?', [
              { html: 'Milli is <b>three</b> steps below the base unit (m → dm → cm → mm). The step for deci was forgotten, so multiply by 1000.', right: true },
              { html: 'You should divide, because a millimetre is smaller than a metre.', why: 'A smaller unit means a <b>bigger</b> number, so multiply.', code: 'div' },
              { html: 'Milli is one step below the base unit, so multiply by 10.', why: 'Count the steps: m → dm → cm → mm.', code: 'one' },
              { html: 'There is no mistake: 1 m = 100 mm.', why: '1 m = 100 <b>cm</b>, but 1000 mm.', code: 'none' }],
              'Milli is three steps below the base unit (m → dm → cm → mm): the deci step was forgotten. So multiply by 1000.', ['Write out the staircase between m and mm.'], 'Maya mistake');
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) { return S.convPart('(b) Change ' + qq(sh.x, 'm') + ' to millimetres.', sh.x, 'm', 'mm'); } }] }
    ]
  });

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
})(window);
