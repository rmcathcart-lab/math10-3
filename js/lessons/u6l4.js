/* Math 10-3 · Unit 6 · Lesson 4 — Scale Diagrams: Maps and Floor Plans (G3)
 * Assignment 4 (u6_l04.tex, Questions 1–17) and the Lesson 4 Extra Practice (u6_ep04.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the same kind of scale, map, plan or model as the booklet item with new numbers around the
 * booklet's (the lesson's worked-example numbers are left out: the 1 : 500 / 1 : 300 000 / 1 : 96 / 20 : 1 / 1 : 250 /
 * 1 : 40 000 table, the 50 m park bar, the 1 cm : 1.5 m apartment, the 1 : 2 000 000 Lethbridge map, the 1 : 64 model car and
 * pickup, the 8 : 1 ant, the HO boxcar, the ¼ in : 1 ft garage, the 61 × 26 m rink, Maya's 1 cm : 0.5 m bedroom, the 200 m
 * town map). Calculator allowed.
 * Answers: lengths exactly, or to the nearest tenth where the booklet rounds; money to the cent ("$757.58", "757.58"); a
 * big number may be typed with spaces or commas (1 000 000); "1 : 400" typed in a ratio box is fine. A unit typed after the
 * number is fine when it is the box's unit. Recognised mistakes get their own hint: not changing the units before writing a
 * ratio (m → cm × 100, km → cm × 100 000, ft → in × 12, cm → mm × 10), 1000 for 100 (or the reverse), dividing instead
 * of multiplying (and back), the ratio upside down (the model ÷ real order), the block value used as "1 cm represents",
 * the plan area multiplied by the scale, the GST alone or 5 added, the trip one way only, decimal hours read as minutes,
 * a scale that does not fit (rounding down), a scale that is not an easy number.
 * Conversions: the scale table → boxes for the ratio (1 : ▢, or ▢ : 1) plus a table of choices for reduction /
 * enlargement; "write the ratio scale in words" → 1 cm represents ▢ m (or km); "use a ruler" → the bar scale is drawn
 * with a ruler under it to read the block length, and the plan and map lengths are printed on the drawing ("as measured");
 * the plan/real table → the table input; "choose an easy scale, show your work" → the metres per centimetre both ways and
 * the scale chosen, in boxes (any easy number that fits without being much too small is right); "draw the floor plan" →
 * the plan lengths in boxes (the drawing itself stays on paper); "how can you tell / explain / why" → multiple choice of
 * reasons; "a fraction of an inch" → a fraction box (the decimal gets a nudge); "feet and inches" → two boxes;
 * "hours and minutes" → two boxes (± 1 minute).
 * Outcome G3 throughout. Levels: LIM BEG EMG PRG ADV MAS. Uses HW.u6draw from u6l3.js (load u6l3.js first). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit, U = HW.u6draw;
  var q = U.q, rd = U.rd, same = U.same, nS = U.nS, decs = U.decs, find = U.find, cm = U.cm, T = U.T, steps = U.steps, an = U.an, table = U.table,
    readN = U.readN, numC = U.numC, num = U.num, fld = U.fld, fieldsPart = U.fieldsPart;

  /* ================= numbers ================= */
  function big(n) { return Math.abs(n) >= 10000 ? HW.fmt(nS(n), true) : nS(n); }         // plain text: 75 000
  function bigT(n) { return Math.abs(n) >= 10000 ? HW.fmt(nS(n)) : nS(n); }              // TeX: 75\,000
  function ok2(x, dp) { return same(x, rd(x, dp == null ? 2 : dp)); }
  function mixT(x) {   // 3.5 → 3\frac{1}{2} (eighths at most)
    var w = Math.floor(x + 1e-9), f = q(x - w); if (!f) return String(w);
    for (var d = 2; d <= 8; d *= 2) { var n = Math.round(f * d); if (same(n / d, f)) return (w ? w : '') + '\\frac{' + n + '}{' + d + '}'; }
    return nS(x);
  }
  function gcd(a, b) { while (b) { var x = a % b; a = b; b = x; } return a; }
  function fracOf(x) { for (var d = 1; d <= 16; d++) { var n = Math.round(x * d); if (same(n / d, x)) { var g = gcd(n, d); return [n / g, d / g]; } } return null; }
  function fracT(fr) { return fr[1] === 1 ? String(fr[0]) : '\\frac{' + fr[0] + '}{' + fr[1] + '}'; }
  function mixedT(fr) { return fr[0] > fr[1] && fr[1] !== 1 ? Math.floor(fr[0] / fr[1]) + '\\frac{' + fr[0] % fr[1] + '}{' + fr[1] + '}' : fracT(fr); }
  function moneyFld(label, exact, diag, name) { return { label: label, name: name || label.replace(/:$/, ''), before: '$', chk: PK.money(exact, diag), key: PK.m$(exact), show: t(PK.M(exact)), bad: [] }; }
  function diagList(list) { return function (v) { for (var i = 0; i < list.length; i++) if (isFinite(list[i][0]) && (same(v, list[i][0]) || same(v, rd(list[i][0], 2)))) return { code: list[i][1], hint: list[i][2] }; return null; }; }
  /* a box after "1 :" (or before ": 1"). Typing the whole ratio ("1:400") is fine. */
  function ratioC(n, alts, enl) {
    var c = numC(n, { alts: alts });
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var s = String(resp == null ? '' : resp).replace(/\\colon|\\text\{\s*:\s*\}/g, ':').trim(), m;
      if (!enl && (m = /^\s*1\s*:\s*(.+)$/.exec(s))) s = m[1];
      if (enl && (m = /^(.+?)\s*:\s*1\s*$/.exec(s))) s = m[1];
      if (/:/.test(s)) return form('u6l4-ratio-form', enl ? 'Type the first number of the ratio (the ": 1" is already there).' : 'Type the second number of the ratio (the "1 :" is already there).');
      return c(s);
    };
  }
  function rFld(label, n, alts, enl, name) {
    return { label: label + (enl ? '' : ' ' + t('1:')), after: enl ? ': 1' : undefined, name: name, chk: ratioC(n, alts, enl), key: nS(n), show: t(enl ? bigT(n) + ':1' : bigT(n)),
      bad: (alts || []).filter(function (a) { return !same(a.v, n); }).map(function (a) { return nS(rd(a.v, 4)); }) };
  }
  function al(v, code, hint) { return { v: v, code: code, hint: hint }; }

  HW.addCodes({
    'u6l4-no-conv': 'Didn’t change to the same unit before writing the ratio / answer', 'u6l4-conv': 'Wrong unit change (1000 for 100, …)', 'u6l4-ratio-form': 'Typed the whole ratio in one box',
    'u6l4-unit-box': 'Answer in a different unit from the box', 'u6l4-mul': 'Multiplied instead of dividing', 'u6l4-div': 'Divided instead of multiplying', 'u6l4-block': 'Used one block of the bar as 1 cm',
    'u6l4-flip': 'Scale ratio upside down', 'u6l4-area-scale': 'Multiplied the plan area by the scale', 'u6l4-perim': 'Perimeter instead of area', 'u6l4-gst-only': 'Gave the GST alone', 'u6l4-gst-5': 'Added 5 instead of 5%',
    'u6l4-plan-len': 'Gave the plan length, not the real length', 'u6l4-nofit': 'Chose a scale that doesn’t fit', 'u6l4-tiny': 'Chose a scale that makes the drawing too small', 'u6l4-easy': 'Scale not an easy number',
    'u6l4-one-way': 'Used the trip one way only', 'u6l4-dec-min': 'Read decimal hours as minutes', 'u6l4-type': 'Reduction / enlargement mixed up', 'u6l4-reason': 'Chose a reason that doesn’t hold',
    'u6l4-mm-cm': 'Gave mm for cm (or the reverse)', 'u6l4-ft-in': 'Feet and inches mixed up', 'u6l4-times': 'Wrong "how many times"', 'u6l4-mc': 'Wrong choice'
  });
  HW.addPartial({
    'u6l4-no-conv': 'b', 'u6l4-conv': 's', 'u6l4-unit-box': 's', 'u6l4-mul': 'n', 'u6l4-div': 'n', 'u6l4-block': 'b', 'u6l4-flip': 'b', 'u6l4-area-scale': 'b', 'u6l4-perim': 'n', 'u6l4-gst-only': 'b', 'u6l4-gst-5': 'b',
    'u6l4-plan-len': 'n', 'u6l4-nofit': 'b', 'u6l4-tiny': 's', 'u6l4-one-way': 'b', 'u6l4-dec-min': 's', 'u6l4-mm-cm': 's', 'u6l4-ft-in': 's', 'u6l4-times': 'b'
  });

  /* ================= pictures ================= */
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" ' + FONT + ' font-size="' + (o.size || 13) + '" font-weight="' + (o.weight || 600) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || '#1d2633') + '"' + (o.rot != null ? ' transform="rotate(' + o.rot + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3">' + String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'; }
  function svgWrap(s, w, h, maxW, aria) { return '<svg class="fig-svg" viewBox="0 0 ' + w.toFixed(1) + ' ' + h.toFixed(1) + '" width="100%" style="max-width:' + Math.round(maxW || w) + 'px" role="img" aria-label="' + (aria || 'figure') + '">' + s + '</svg>'; }
  /* a bar scale (blocks alternately dark and light) with a centimetre ruler under it, its 0 under the bar's left end */
  function barSVG(o) {
    var u = 38, n = o.blocks, b = o.bcm, x0 = 18, y0 = 14, h = 9, W = n * b * u, s = '';
    for (var i = 0; i < n; i++) s += '<rect x="' + (x0 + i * b * u).toFixed(1) + '" y="' + y0 + '" width="' + (b * u).toFixed(1) + '" height="' + h + '" fill="' + (i % 2 ? '#fff' : '#1d2633') + '" stroke="#1d2633" stroke-width="1.2"/>';
    for (var j = 0; j <= n; j++) s += txt(x0 + j * b * u, y0 + h + 11, nS(j * o.v), { size: 12 });
    s += txt(x0 + W + 10, y0 + h / 2, o.unit, { size: 12, anchor: 'start' });
    var H = y0 + h + 24;
    if (o.ruler !== false) {
      var rc = Math.ceil(n * b) + 1, ry = H + 6, rh = 36;
      s += '<rect x="' + (x0 - 10) + '" y="' + ry + '" width="' + (rc * u + 20).toFixed(1) + '" height="' + rh + '" rx="3" fill="#f6ecd2" stroke="#b39b62" stroke-width="1"/>';
      var d = '';
      for (var mm = 0; mm <= rc * 10; mm++) { var x = x0 + mm * u / 10, L = mm % 10 === 0 ? 13 : mm % 5 === 0 ? 9 : 5; d += 'M' + x.toFixed(1) + ' ' + ry + 'v' + L; }
      s += '<path d="' + d + '" stroke="#3a3324" stroke-width="0.9"/>';
      for (var c2 = 0; c2 <= rc; c2++) s += txt(x0 + c2 * u, ry + 24, String(c2), { size: 11, weight: 700 });
      s += txt(x0 + rc * u + 4, ry + 24, 'cm', { size: 10, anchor: 'start' });
      s += '<line x1="' + x0 + '" y1="' + (y0 + h) + '" x2="' + x0 + '" y2="' + ry + '" stroke="#c93a33" stroke-width="1" stroke-dasharray="3 2"/>';
      H = ry + rh + 6;
    }
    return svgWrap(s, Math.max(W + 60, (Math.ceil(n * b) + 1) * u + 50), H, 420, 'a bar scale with a ruler under it');
  }
  /* a rectangle plan: L × W (plan cm) with labels; o: { door: [x, w] on the bottom wall, name, scale, labels: { L, W, door } } */
  function planSVG(o) {
    var u = 30, L = o.L * u, Wd = o.W * u, x0 = 46, y0 = 26, s = '';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + L.toFixed(1) + '" height="' + Wd.toFixed(1) + '" fill="#f7f4ec" stroke="#1d2633" stroke-width="4"/>';
    if (o.door) { var dx = x0 + o.door[0] * u, dw = o.door[1] * u; s += '<rect x="' + dx.toFixed(1) + '" y="' + (y0 + Wd - 3).toFixed(1) + '" width="' + dw.toFixed(1) + '" height="6" fill="#fff"/><line x1="' + dx.toFixed(1) + '" y1="' + (y0 + Wd).toFixed(1) + '" x2="' + (dx + dw).toFixed(1) + '" y2="' + (y0 + Wd).toFixed(1) + '" stroke="#1d2633" stroke-width="1.4" stroke-dasharray="5 3"/>' + txt(dx + dw / 2, y0 + Wd + 14, o.labels.door, { size: 12 }); }
    (o.walls || []).forEach(function (w) { s += '<line x1="' + (x0 + w[0] * u).toFixed(1) + '" y1="' + (y0 + w[1] * u).toFixed(1) + '" x2="' + (x0 + w[2] * u).toFixed(1) + '" y2="' + (y0 + w[3] * u).toFixed(1) + '" stroke="#1d2633" stroke-width="2.4"/>'; });
    (o.dims || []).forEach(function (d) { s += txt(x0 + d[0] * u, y0 + d[1] * u, d[2], { size: 12, rot: d[3], color: '#1f5bd6', weight: 700 }); });
    (o.names || []).forEach(function (nm) { s += txt(x0 + nm[0] * u, y0 + nm[1] * u, nm[2], { size: 13, weight: 700 }); });
    return svgWrap(s, L + x0 + 30, Wd + y0 + 34, 380, 'a floor plan');
  }
  /* the trail map: pts (cm) T, A, B, C; segment labels; straight line T–C */
  function trailSVG(o) {
    var u = 34, P = o.pts, xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; }), mx = Math.max.apply(null, xs), my = Math.max.apply(null, ys);
    var X = function (p) { return 30 + p[0] * u; }, Y = function (p) { return 24 + (my - p[1]) * u; }, s = '';
    s += '<ellipse cx="' + (X(P[1]) - 30).toFixed(1) + '" cy="' + (Y(P[1]) - 8).toFixed(1) + '" rx="30" ry="14" fill="#dbe7fb"/>' + txt(X(P[1]) - 34, Y(P[1]) - 8, 'lake', { size: 10, color: '#3c5c99' });
    s += '<line x1="' + X(P[0]).toFixed(1) + '" y1="' + Y(P[0]).toFixed(1) + '" x2="' + X(P[3]).toFixed(1) + '" y2="' + Y(P[3]).toFixed(1) + '" stroke="#9aa3b2" stroke-width="1.2" stroke-dasharray="2 3"/>';
    s += '<path d="M' + P.map(function (p) { return X(p).toFixed(1) + ' ' + Y(p).toFixed(1); }).join('L') + '" fill="none" stroke="#1d2633" stroke-width="2.2" stroke-dasharray="7 4"/>';
    o.seg.forEach(function (lab, i) { var a = P[i], b = P[i + 1], mxp = (X(a) + X(b)) / 2, myp = (Y(a) + Y(b)) / 2, dx = X(b) - X(a), dy = Y(b) - Y(a), L = Math.hypot(dx, dy); s += txt(mxp - dy / L * 13, myp + dx / L * 13, lab, { size: 12, color: '#1f5bd6', weight: 700 }); });
    var ma = (X(P[0]) + X(P[3])) / 2, mb = (Y(P[0]) + Y(P[3])) / 2, ddx = X(P[3]) - X(P[0]), ddy = Y(P[3]) - Y(P[0]), LL = Math.hypot(ddx, ddy);
    s += txt(ma + ddy / LL * 12, mb - ddx / LL * 12, o.straight, { size: 11, color: '#6a7182' });
    ['T', 'A', 'B', 'C'].forEach(function (nm, i) { s += '<circle cx="' + X(P[i]).toFixed(1) + '" cy="' + Y(P[i]).toFixed(1) + '" r="3.4" fill="#1d2633"/>' + txt(X(P[i]) + (i === 0 ? -10 : 10), Y(P[i]) + (i === 0 ? 8 : -10), nm, { size: 14, weight: 800 }); });
    return svgWrap(s, mx * u + 70, my * u + 50, 400, 'a trail map');
  }

  /* ================= shared generators ================= */
  /* "scale in words → ratio" rows */
  function wordsRow(kind, x) {
    if (kind === 'm') return { words: '1 cm represents ' + nS(x) + ' m', n: x * 100, alts: [al(x, 'u6l4-no-conv', 'Change ' + nS(x) + ' m to centimetres first: 1 m = 100 cm.'), al(x * 1000, 'u6l4-conv', '1 m = <b>100</b> cm (not 1000).'), al(x * 10, 'u6l4-conv', '1 m = <b>100</b> cm.')], sol: t(nS(x) + '\\text{ m}=' + nS(x) + '\\times 100=' + bigT(x * 100) + '\\text{ cm}') };
    if (kind === 'km') return { words: '1 cm represents ' + nS(x) + ' km', n: x * 100000, alts: [al(x, 'u6l4-no-conv', 'Change ' + nS(x) + ' km to centimetres first: 1 km = 100 000 cm.'), al(x * 1000, 'u6l4-conv', 'That changes km to <b>m</b>. Both numbers must be in cm: 1 km = 100 000 cm.'), al(x * 10000, 'u6l4-conv', '1 km = 100 000 cm (five zeros).'), al(x * 1000000, 'u6l4-conv', '1 km = 100 000 cm (five zeros).')], sol: t(nS(x) + '\\text{ km}=' + nS(x) + '\\times 100\\,000=' + bigT(x * 100000) + '\\text{ cm}') };
    if (kind === 'cm') return { words: '1 cm represents ' + nS(x) + ' cm', n: x, alts: [al(x * 100, 'u6l4-conv', 'Both are already centimetres: nothing to change.'), al(x / 100, 'u6l4-conv', 'Both are already centimetres: nothing to change.')], sol: 'already the same unit' };
    if (kind === 'ft') return { words: '1 in represents ' + nS(x) + ' ft', n: x * 12, alts: [al(x, 'u6l4-no-conv', 'Change ' + nS(x) + ' ft to inches first: 1 ft = 12 in.'), al(x * 10, 'u6l4-conv', '1 ft = <b>12</b> in.'), al(x * 100, 'u6l4-conv', '1 ft = <b>12</b> in.')], sol: t(nS(x) + '\\text{ ft}=' + nS(x) + '\\times 12=' + nS(x * 12) + '\\text{ in}') };
    // enlargement: x cm represents 1 mm
    return { words: nS(x) + ' cm represents 1 mm', n: x * 10, enl: true, alts: [al(x, 'u6l4-no-conv', 'Change ' + nS(x) + ' cm to millimetres first: 1 cm = 10 mm.'), al(x * 100, 'u6l4-conv', '1 cm = <b>10</b> mm.'), al(1 / (x * 10), 'u6l4-flip', 'The diagram comes first: ' + nS(x * 10) + ' mm on the drawing for 1 mm real.')], sol: t(nS(x) + '\\text{ cm}=' + nS(x * 10) + '\\text{ mm}') + ', so ' + t(nS(x * 10) + ':1') + '; the drawing is bigger' };
  }
  function typeGrid2(prompt, items, cols, sol, text) {   // items: [{ label, want }]
    var rows = items.map(function (it, i) { return { id: 'r' + i, html: it.label, label: String(it.label).replace(/<[^>]+>|\\\(|\\\)/g, '') }; }), want = {};
    items.forEach(function (it, i) { want['r' + i] = it.want; });
    return P.grid(prompt, rows, cols, want, { why: function (rid) { var it = items[Number(rid.slice(1))]; return { code: 'u6l4-type', hint: it.why }; } }, sol, ['The diagram number comes first. If it is smaller than the real number, the drawing is smaller (a reduction).'], text);
  }
  var RE_COLS = [{ id: 'red', html: 'Reduction' }, { id: 'enl', html: 'Enlargement' }];
  /* map pairs (straight-line km, rough) */
  var PAIRS = [['Calgary', 'Banff', 105], ['Calgary', 'Drumheller', 110], ['Red Deer', 'Edmonton', 145], ['Calgary', 'Red Deer', 140], ['Edmonton', 'Athabasca', 130], ['Edmonton', 'Lloydminster', 230], ['Calgary', 'Medicine Hat', 260], ['Calgary', 'Lethbridge', 175], ['Grande Prairie', 'Edmonton', 390], ['Edmonton', 'Jasper', 285], ['Red Deer', 'Drumheller', 100]];
  /* easy numbers for "1 cm represents __ m" */
  var EASY = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50];
  function nextEasy(x) { for (var i = 0; i < EASY.length; i++) if (EASY[i] >= x - 1e-9) return EASY[i]; return 100; }
  function easyAfter(s) { var i = EASY.indexOf(s); return EASY[Math.min(i + 1, EASY.length - 1)]; }
  /* choosing a scale: yard (or gym) L × W m into a space Ls × Ws cm */
  function scaleShared(r, not) {
    return find(function () {
      var Ls = r.pick([12, 14, 15, 16, 18, 20]), Ws = r.pick([8, 10, 12]), s = r.pick([1, 2, 2.5, 5]), prev = { 1: 0.5, 2: 1, 2.5: 2, 5: 2.5 }[s];
      var L = Math.round(Ls * (prev + (s - prev) * (0.25 + 0.6 * r.next()))), W = Math.round(Ws * (0.5 + 0.9 * r.next()) * s * 0.8);
      var need = Math.max(L / Ls, W / Ws);
      return { L: L, W: W, Ls: Ls, Ws: Ws, s: s, need: need };
    }, function (x) { return x.W < x.L && x.W >= 4 && x.need > { 1: 0.5, 2: 1, 2.5: 2, 5: 2.5 }[x.s] + 0.04 && x.need < x.s - 0.04 && nextEasy(x.need) === x.s && ok2(x.L / x.s, 2) && ok2(x.W / x.s, 2) && (not || []).every(function (n) { return !(n[0] === x.L && n[1] === x.W); }); },
      { L: 24, W: 15, Ls: 14, Ws: 10, s: 2, need: 24 / 14 });
  }
  function easyC(x) {
    var s = x.s, s2 = easyAfter(s);
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var a = readN(resp); if (a.code) return numC(s, { unit: 'm' })(resp);
      var v = a.v;
      if (same(v, s) || same(v, s2)) return ok();
      if (v < x.need - 1e-9) { var useL = x.L / v > x.Ls + 1e-9; return wrong('u6l4-nofit', 'With 1 cm for ' + nS(v) + ' m the ' + (useL ? 'length' : 'width') + ' on the drawing is ' + t((useL ? x.L : x.W) + '\\div ' + nS(v) + (ok2((useL ? x.L : x.W) / v, 2) ? '=' : '\\approx ') + nS(rd((useL ? x.L : x.W) / v, 2))) + ' cm: too long for the ' + (useL ? x.Ls : x.Ws) + ' cm space. Round <b>up</b>, not down.'); }
      if (EASY.indexOf(q(v)) < 0 && v < s2) return form('u6l4-easy', 'That fits, but it isn’t an easy number to work with. Round <b>up</b> to an easy number such as 1, 2, 2.5, 5 or 10.');
      return wrong('u6l4-tiny', 'That fits, but the drawing would be tiny (' + nS(rd(x.L / v, 2)) + ' cm by ' + nS(rd(x.W / v, 2)) + ' cm). Choose the <b>smallest</b> easy number that fits.');
    };
  }
  function scaleFields(prompt, x, extraRatio) {
    var a = x.L / x.Ls, b = x.W / x.Ws, s2 = easyAfter(x.s);
    var flds = [fld('Length: m per cm', a, { dp: 2, name: 'Length (m per cm)', alts: [al(x.Ls / x.L, 'u6l4-flip', 'Divide the real length by the space: ' + t(x.L + '\\div ' + x.Ls) + '.')] }),
      fld('Width: m per cm', b, { dp: 2, name: 'Width (m per cm)', alts: [al(x.Ws / x.W, 'u6l4-flip', 'Divide the real width by the space: ' + t(x.W + '\\div ' + x.Ws) + '.')] }),
      { label: 'Scale: 1 cm represents', name: 'Scale', after: 'm', chk: easyC(x), key: nS(x.s), show: t(nS(x.s) + '\\text{ m}'), bad: [nS(rd(Math.max(a, b), 2)), nS(EASY[EASY.indexOf(x.s) - 1] || 0.25)] }];
    if (extraRatio) flds.push({ label: 'As a ratio: ' + t('1:'), name: 'Ratio', chk: (function () { var c1 = ratioC(x.s * 100, [al(x.s, 'u6l4-no-conv', 'Change the metres to centimetres: × 100.'), al(x.s * 1000, 'u6l4-conv', '1 m = <b>100</b> cm.')]), c2 = ratioC(s2 * 100, []); return function (resp) { var r1 = c1(resp); if (r1.v === 'correct') return r1; var r2 = c2(resp); return r2.v === 'correct' ? r2 : r1; }; })(), key: nS(x.s * 100), show: t('1:' + nS(x.s * 100)), bad: [nS(x.s)] });
    var big2 = a >= b ? 'length' : 'width';
    return fieldsPart(prompt, flds,
      steps(['Length: ' + t(x.L + '\\div ' + x.Ls + (ok2(a, 2) ? '=' : '\\approx ') + nS(rd(a, 2))) + ' m per cm. Width: ' + t(x.W + '\\div ' + x.Ws + (ok2(b, 2) ? '=' : '\\approx ') + nS(rd(b, 2))) + ' m per cm.', 'Use the bigger (the ' + big2 + '), ' + nS(rd(Math.max(a, b), 2)) + ', and round <b>up</b> to an easy number: 1 cm represents ' + nS(x.s) + ' m' + (extraRatio ? ' (' + t('1:' + nS(x.s * 100)) + ')' : '') + '.', '(1 cm represents ' + nS(s2) + ' m also fits; it makes a smaller drawing.)']),
      ['Divide: real length ÷ space, and real width ÷ space.', 'Use the bigger answer and round it UP to an easy number (0.5, 1, 2, 2.5, 5, 10…).'], 'choose a scale');
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u6l4', unit: 6, num: '4', title: 'Scale Diagrams: Maps and Floor Plans', outcome: 'G3',
    blurb: 'Scales in words, as ratios and as bar scales; real lengths from maps, plans and models and back; areas and costs from a plan; choosing a scale; route distances and travel times.',
    questions: [
      /* ---- Q1: words → ratio, reduction or enlargement ---- */
      { num: '1', stem: function (sh) { return 'Write each scale as a ratio. Then say if it is a reduction or an enlargement.' + table(['', 'Scale in words'], sh.rows.map(function (rw, i) { return ['(' + 'abcde'.charAt(i) + ')', rw.words]; })); },
        shared: function (r) {
          return { rows: [wordsRow('m', r.pick([4, 2, 3, 6, 8, 2.5])), wordsRow('km', r.pick([10, 2, 4, 5, 20, 25])), wordsRow('cm', r.pick([25, 20, 50, 40, 15])), wordsRow('ft', r.pick([2, 3, 4, 6])), wordsRow('mm', r.pick([5, 3, 4, 10]))] };
        },
        parts: [
          { id: '1a', sub: 'a–e i', level: 'EMG', make: function (r, sh) {
            return fieldsPart('Write each scale as a ratio (same units on both sides).', sh.rows.map(function (rw, i) { var L = '(' + 'abcde'.charAt(i) + ')'; return rFld(L, rw.n, rw.alts, rw.enl, L); }),
              sh.rows.map(function (rw, i) { return '(' + 'abcde'.charAt(i) + ') ' + rw.sol + ': ' + t(rw.enl ? nS(rw.n) + ':1' : '1:' + bigT(rw.n)); }).join('<br>'),
              ['Change the real length to the same unit as the diagram length (1 m = 100 cm, 1 km = 100 000 cm, 1 ft = 12 in, 1 cm = 10 mm).', 'Write diagram : real.'], 'words to ratio');
          } },
          { id: '1b', sub: 'a–e ii', level: 'BEG', make: function (r, sh) {
            return typeGrid2('Is each one a reduction or an enlargement?', sh.rows.map(function (rw, i) { return { label: '(' + 'abcde'.charAt(i) + ') ' + rw.words, want: rw.enl ? 'enl' : 'red', why: rw.enl ? 'Here the drawing length (' + rw.words.split(' represents')[0] + ') is bigger than the real length: an enlargement.' : 'The real length is bigger than 1 unit on the drawing, so the drawing is smaller: a reduction.' }; }), RE_COLS,
              'The diagram number comes first. (a)–(d): the real object is bigger, so they are reductions. (e): the drawing is bigger, an enlargement.', 'reduction or enlargement');
          } }] },

      /* ---- Q2: ratio → words ---- */
      { num: '2', stem: 'Write each ratio scale in words, using a sensible real unit.', shared: function (r) { return { a: r.pick([300, 200, 400, 600, 150, 800]), b: r.pick([75000, 25000, 20000, 80000, 60000, 30000]), bu: r.pick(['m', 'm', 'km']), c: r.pick([5000000, 2500000, 1000000, 3000000, 4000000, 1500000]) }; },
        parts: [{ id: '2a', sub: 'a–c', level: 'EMG', make: function (r, sh) {
          var mk = function (L, n, unit) {
            var v = unit === 'm' ? n / 100 : n / 100000, alts = unit === 'm' ? [al(n, 'u6l4-no-conv', 'That’s in centimetres. Change to metres: ÷ 100.'), al(n / 1000, 'u6l4-conv', '1 m = <b>100</b> cm: divide by 100.'), al(n / 100000, 'u6l4-unit-box', 'That’s in kilometres. This box is in metres.')] : [al(n, 'u6l4-no-conv', 'That’s in centimetres. Change to km: ÷ 100 000.'), al(n / 100, 'u6l4-unit-box', 'That’s in metres. This box is in km (÷ 1000 more).'), al(n / 1000, 'u6l4-conv', '1 km = 100 000 cm: move the decimal point 5 places left.'), al(n / 10000, 'u6l4-conv', '1 km = 100 000 cm: move the decimal point 5 places left.')];
            return fld(L + ' ' + t('1:' + bigT(n)) + ' → 1 cm represents', v, { unit: unit, alts: alts, name: L });
          };
          return fieldsPart('Fill in the real length that 1 cm represents.', [mk('(a)', sh.a, 'm'), mk('(b)', sh.b, sh.bu), mk('(c)', sh.c, 'km')],
            steps(['(a) ' + t(bigT(sh.a) + '\\text{ cm}=' + nS(sh.a / 100) + '\\text{ m}'), '(b) ' + t(bigT(sh.b) + '\\text{ cm}=' + nS(sh.b / 100) + '\\text{ m}=' + nS(sh.b / 100000) + '\\text{ km}'), '(c) ' + t(bigT(sh.c) + '\\text{ cm}=' + nS(sh.c / 100000) + '\\text{ km}') + ' (move the decimal point 5 places left)']),
            ['1 : n means 1 cm represents n cm.', 'cm → m: ÷ 100. cm → km: ÷ 100 000.'], 'ratio to words');
        } }] },

      /* ---- Q3: a bar scale ---- */
      { num: '3', stem: function (sh) { return 'A trail map has this bar scale. Use the ruler under it.' + barSVG({ blocks: 3, bcm: sh.b, v: sh.v, unit: 'km' }); },
        shared: function (r) { var c = r.pick([[2, 1], [2, 5], [2.5, 1], [2, 2], [1.5, 3], [2.5, 5]]); return { b: c[0], v: c[1], pc: q(c[1] / c[0]), d: r.pick([4.6, 3.8, 5.2, 4.4, 6.2, 3.4]) }; },
        parts: [
          { id: '3a', level: 'EMG', make: function (r, sh) {
            return fieldsPart('How long is one block? Write the scale in words.', [fld('One block:', sh.b, { unit: 'cm', name: 'Block', alts: [al(sh.v, 'u6l4-block', 'Measure the block with the ruler (in cm). ' + nS(sh.v) + ' km is what it represents.'), al(3 * sh.b, 'u6l4-block', 'That’s the whole bar. Measure <b>one</b> block.')] }),
              fld('1 cm represents', sh.pc, { unit: 'km', name: '1 cm represents', alts: [al(sh.v, 'u6l4-block', 'One <b>block</b> represents ' + nS(sh.v) + ' km, but a block is ' + nS(sh.b) + ' cm long. Divide to find what 1 cm represents.'), al(sh.v * sh.b, 'u6l4-div', 'Divide the block’s value by its length: ' + t(nS(sh.v) + '\\div ' + nS(sh.b)) + '.'), al(sh.b / sh.v, 'u6l4-flip', 'Divide the km by the cm: ' + t(nS(sh.v) + '\\div ' + nS(sh.b)) + '.')] })],
              'One block is ' + cm(sh.b) + ' and represents ' + nS(sh.v) + ' km.<br>So 1 cm represents ' + t(nS(sh.v) + '\\div ' + nS(sh.b) + '=' + nS(sh.pc)) + ' km.', ['Line the ruler’s 0 up with the start of the bar and read where the first block ends.', '1 cm represents (block value) ÷ (block length).'], 'bar scale');
          } },
          { id: '3b', level: 'PRG', make: function (r, sh) {
            return { prompt: 'Write the scale as a ratio.', input: { type: 'number', before: t('1:') }, check: ratioC(sh.pc * 100000, [al(sh.pc, 'u6l4-no-conv', 'Change ' + nS(sh.pc) + ' km to centimetres: × 100 000.'), al(sh.pc * 1000, 'u6l4-conv', 'That changes km to <b>m</b>. Change to cm: 1 km = 100 000 cm.'), al(sh.v * 100000, 'u6l4-block', 'That uses the block. Use what <b>1 cm</b> represents (from (a)).')]),
              key: nS(sh.pc * 100000), answer: t('1:' + bigT(sh.pc * 100000)), solution: t(nS(sh.pc) + '\\text{ km}=' + nS(sh.pc) + '\\times 100\\,000=' + bigT(sh.pc * 100000) + '\\text{ cm}') + ', so ' + t('1:' + bigT(sh.pc * 100000)) + '.', hints: ['Change what 1 cm represents to centimetres: 1 km = 100 000 cm.'], text: 'bar to ratio', bad: [nS(sh.pc * 1000), nS(sh.v * 100000)].filter(function (x) { return !same(Number(x), sh.pc * 100000); }) };
          } },
          { id: '3c', level: 'EMG', make: function (r, sh) {
            return num('A lake on this map is ' + cm(sh.d) + ' across. How wide is the real lake?', sh.d * sh.pc, { unit: 'km', alts: [al(sh.d * sh.v, 'u6l4-block', 'Use what <b>1 cm</b> represents (' + nS(sh.pc) + ' km), not one block.'), al(sh.d / sh.pc, 'u6l4-mul', 'Real = map length × (km for 1 cm): multiply.'), al(sh.d * sh.pc * 1000, 'u6l4-unit-box', 'That’s in metres. The box is in km.')],
              sol: t(nS(sh.d) + '\\times ' + nS(sh.pc) + '=' + nS(sh.d * sh.pc)) + '. The lake is ' + nS(sh.d * sh.pc) + ' km wide.', hints: ['Multiply the map length by what 1 cm represents.'], text: 'lake' });
          } }] },

      /* ---- Q4: plan / real table ---- */
      { num: '4', stem: function (sh) { return 'A cabin plan uses the scale 1 cm represents ' + nS(sh.s) + ' m. Complete the table.'; },
        shared: function (r) {
          return find(function () { var s = r.pick([2, 2.5, 3, 4, 0.5]); return { s: s, rows: [['Cabin length', r.pick([4.8, 4.2, 5.6, 3.6, 5.2]), true], ['Deck length', r.pick([2.25, 1.75, 2.5, 1.5]), true], ['Front door', r.pick([0.45, 0.4, 0.35, 0.3]), true], ['Cabin width', r.pick([2.75, 3.2, 2.5, 2.4]), false], ['Window', r.pick([0.6, 0.5, 0.8, 0.4]), false]] }; },
            function (x) { return x.rows.every(function (rw) { return decs(rw[1] * x.s) <= 2; }); }, null);
        },
        parts: [{ id: '4a', level: 'EMG', make: function (r, sh) {
          var s = sh.s, rows = sh.rows.map(function (rw) { return '\\text{' + rw[0] + '}'; }), cols = ['\\text{Plan (cm)}', '\\text{Real (m)}'], cells = [], key = [], blanks = [];
          sh.rows.forEach(function (rw, i) {
            var p = rw[1], R = q(p * s);
            if (rw[2]) { cells.push([nS(p), null]); key.push([nS(p), nS(R)]); blanks.push({ where: 'cell', i: i, j: 1, name: rw[0] + ' (real)', chk: numC(R, { unit: 'm', alts: [al(p / s, 'u6l4-div', 'Plan → real: <b>multiply</b> by ' + nS(s) + ' (the real room is bigger).'), al(p * s * 100, 'u6l4-unit-box', 'That’s in cm. The table wants metres.')] }) }); }
            else { cells.push([null, nS(R)]); key.push([nS(p), nS(R)]); blanks.push({ where: 'cell', i: i, j: 0, name: rw[0] + ' (plan)', chk: numC(p, { unit: 'cm', alts: [al(R * s, 'u6l4-mul', 'Real → plan: <b>divide</b> by ' + nS(s) + ' (the plan is smaller).')] }) }); }
          });
          var inp = { type: 'areabox', rows: rows, cols: cols, cells: cells, corner: '\\text{Part}', keys: 'u6-num', help: 'Tap a box, then type the number.' }, keyV = { rows: rows, cols: cols, cells: key };
          return { prompt: 'Fill in the empty boxes.', input: inp, check: PK.tableChk(blanks), key: keyV, answer: HW.draw.areaboxHtml(inp, keyV),
            solution: steps(sh.rows.map(function (rw) { var p = rw[1], R = q(p * s); return rw[0] + ': ' + (rw[2] ? t(nS(p) + '\\times ' + nS(s) + '=' + nS(R)) + ' m' : t(nS(R) + '\\div ' + nS(s) + '=' + nS(p)) + ' cm'); })),
            hints: ['Plan → real: multiply by ' + nS(s) + '.', 'Real → plan: divide by ' + nS(s) + '.'], text: 'plan table' };
        } }] },

      /* ---- Q5: workshop plan, area and cost ---- */
      { num: '5', stem: function (sh) { return 'This plan of a workshop is drawn to scale at ' + t('1:' + sh.n) + '. Ana measured it with a ruler (the plan lengths are shown).' + planSVG({ L: sh.L, W: sh.W, door: [(sh.L - sh.dr) / 2, sh.dr], labels: { door: 'overhead door ' + cm(sh.dr) }, dims: [[sh.L / 2, -0.45, cm(sh.L)], [-0.6, sh.W / 2, cm(sh.W), -90]], names: [[sh.L / 2, sh.W / 2 - 0.3, 'Workshop'], [sh.L / 2, sh.W / 2 + 0.35, 'Scale 1 : ' + sh.n]] }); },
        shared: function (r) { return find(function () { return { n: r.pick([100, 100, 50, 200]), L: r.pick([7.5, 8, 6.8, 7.2, 7]), W: r.pick([5.2, 4.8, 5.5, 4.4, 5]), dr: r.pick([2.7, 2.4, 3, 2.5]), rate: r.pick([18.5, 22.75, 15.25, 19.95, 24.5]) }; }, function (x) { return x.W < x.L - 1 && x.dr < x.L - 2 && !(x.n === 200 && x.L > 7.5); }, null); },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) { var m = sh.n / 100; return num('Write the scale in words: 1 cm represents ____ m.', m, { unit: 'm', alts: [al(sh.n, 'u6l4-no-conv', 'That’s in centimetres (' + t('1:' + sh.n) + ' means 1 cm represents ' + sh.n + ' cm). Change to metres: ÷ 100.'), al(sh.n / 1000, 'u6l4-conv', '1 m = <b>100</b> cm.')], sol: '1 cm represents ' + sh.n + ' cm, which is ' + nS(m) + ' m.', hints: [t('1:' + sh.n) + ' means 1 cm represents ' + sh.n + ' cm. Change that to metres.'], text: 'workshop scale' }); } },
          { id: '5b', level: 'EMG', make: function (r, sh) {
            var m = sh.n / 100, mk = function (lab, p) { return fld(lab, p * m, { unit: 'm', name: lab.replace(':', ''), alts: [al(p * sh.n, 'u6l4-unit-box', 'That’s in centimetres. Change to metres (÷ 100).'), al(p, 'u6l4-plan-len', 'That’s the plan length. Use the scale: 1 cm represents ' + nS(m) + ' m.'), al(p / m, 'u6l4-div', 'Plan → real: multiply by ' + nS(m) + '.')] }); };
            return fieldsPart('Find the real length and width of the workshop.', [mk('Length:', sh.L), mk('Width:', sh.W)], 'Plan: ' + cm(sh.L) + ' by ' + cm(sh.W) + '. 1 cm represents ' + nS(m) + ' m.<br>Real: ' + t(nS(sh.L) + '\\times ' + nS(m) + '=' + nS(sh.L * m)) + ' m by ' + t(nS(sh.W) + '\\times ' + nS(m) + '=' + nS(sh.W * m)) + ' m.', ['Multiply each plan length by what 1 cm represents.'], 'workshop size');
          } },
          { id: '5c', level: 'BEG', make: function (r, sh) { var m = sh.n / 100; return num('How wide is the real overhead door?', sh.dr * m, { unit: 'm', alts: [al(sh.dr * sh.n, 'u6l4-unit-box', 'That’s in centimetres. Change to metres (÷ 100).'), al(sh.dr, 'u6l4-plan-len', 'That’s the plan length. Use the scale.'), al(sh.dr / m, 'u6l4-div', 'Plan → real: multiply.')], sol: 'Plan ' + cm(sh.dr) + ', so the door is ' + t(nS(sh.dr) + '\\times ' + nS(m) + '=' + nS(sh.dr * m)) + ' m wide.', hints: ['Multiply the plan length by what 1 cm represents.'], text: 'door' }); } },
          { id: '5d', level: 'PRG', make: function (r, sh) {
            var m = sh.n / 100, Lr = sh.L * m, Wr = sh.W * m, A = q(Lr * Wr), cost = A * sh.rate, planA = sh.L * sh.W;
            var areaAlts = [al(2 * (Lr + Wr), 'u6l4-perim', 'That’s the perimeter (around the edge). Area = length × width.')];
            if (!same(m, 1)) areaAlts.push(al(planA * m, 'u6l4-area-scale', 'Change the <b>lengths</b> to real lengths first, then multiply them. The plan area × the scale is not the real area.'), al(planA, 'u6l4-plan-len', 'That’s the plan area in cm². Use the real lengths (from (b)).'));
            var dg = diagList([[2 * (Lr + Wr) * sh.rate, 'u6l4-perim', 'Use the <b>area</b> (length × width), not the perimeter.'], [planA * m * sh.rate, 'u6l4-area-scale', 'Use the real area: real length × real width.'], [planA * sh.rate, 'u6l4-plan-len', 'Use the real area, not the plan area.']].filter(function (x) { return !same(x[0], cost); }));
            return fieldsPart('The floor will get an epoxy coating that costs ' + PK.money$(sh.rate) + ' per square metre. Find the real floor area and the cost before tax.', [fld('Area:', A, { unit: 'm²', name: 'Area', alts: areaAlts }), moneyFld('Cost:', cost, dg, 'Cost')],
              steps([t('A=' + nS(Lr) + '\\times ' + nS(Wr) + '=' + nS(A) + '\\text{ m}^2'), 'Cost ' + t('=' + nS(A) + '\\times ' + PK.M(sh.rate) + PK.eqM(cost))]), ['Area = real length × real width.', 'Cost = area × price per m². Round to the cent.'], 'epoxy cost');
          } },
          { id: '5e', level: 'PRG', make: function (r, sh) {
            var m = sh.n / 100, cost = PK.r2(q(sh.L * m * sh.W * m) * sh.rate), tot = cost * 1.05;
            return PK.moneyPart('Find the total cost of the coating with 5% GST. (The cost before tax is ' + PK.money$(cost) + '.)', tot, diagList([[cost * 0.05, 'u6l4-gst-only', 'That’s the GST alone. Add it to the cost (or multiply by 1.05).'], [cost + 5, 'u6l4-gst-5', '5% is not $5: multiply by 1.05.'], [cost * 1.5, 'u6l4-gst-5', '5% as a decimal is 0.05, so multiply by 1.05 (not 1.5).']]),
              t(PK.M(cost) + '\\times 1.05' + PK.eqM(tot)), ['Total with 5% GST = cost × 1.05.', 'Round to the cent.'], 'with GST');
          } }] },

      /* ---- Q6: a road map ---- */
      { num: '6', stem: function (sh) { return 'A road map of Alberta has a scale of ' + t('1:' + bigT(sh.n)) + '.'; },
        shared: function (r) { var n = r.pick([1500000, 2500000, 1000000, 3000000, 1250000]), kpc = n / 100000, p1 = r.pick(PAIRS.filter(function (p) { return p[2] <= 200; })), p2 = find(function () { return r.pick(PAIRS); }, function (p) { return p !== p1 && !ok2(p[2] / kpc, 1); }, null) || PAIRS.filter(function (p) { return p !== p1; })[2]; return { n: n, kpc: kpc, p1: p1, d1: rd(p1[2] / kpc, 1), p2: p2 }; },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return num('How many kilometres does 1 cm on the map represent?', sh.kpc, { unit: 'km', alts: [al(sh.n / 1000, 'u6l4-conv', '1 km = 100 000 cm: move the decimal point <b>5</b> places left (not 3).'), al(sh.n / 100, 'u6l4-unit-box', 'That’s in metres. Change cm to km: ÷ 100 000.'), al(sh.n / 10000, 'u6l4-conv', '1 km = 100 000 cm: move the decimal point 5 places left.')], sol: t(bigT(sh.n) + '\\text{ cm}\\div 100\\,000=' + nS(sh.kpc) + '\\text{ km}'), hints: ['Change ' + big(sh.n) + ' cm to km: divide by 100 000.'], text: 'km per cm' }); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { var v = sh.d1 * sh.kpc; return num(sh.p1[0] + ' and ' + sh.p1[1] + ' are ' + cm(sh.d1) + ' apart on the map. About how far apart are they really (straight line)?', v, { unit: 'km', alts: [al(sh.d1 / sh.kpc, 'u6l4-mul', 'Real = map length × (km for 1 cm): multiply.'), al(sh.d1 * sh.n, 'u6l4-unit-box', 'That’s in centimetres. Use the km per cm from (a).'), al(sh.d1 * sh.n / 1000, 'u6l4-unit-box', 'That’s in metres. The box is in km.')], sol: t(nS(sh.d1) + '\\times ' + nS(sh.kpc) + '=' + nS(v)) + '. They are about ' + nS(v) + ' km apart.', hints: ['Multiply the map distance by the km for 1 cm.'], text: 'map to real' }); } },
          { id: '6c', level: 'PRG', make: function (r, sh) { var v = sh.p2[2] / sh.kpc; return num(sh.p2[0] + ' and ' + sh.p2[1] + ' are about ' + sh.p2[2] + ' km apart (straight line). How far apart are they on this map, to the nearest tenth of a centimetre?', v, { unit: 'cm', dp: 1, alts: [al(sh.p2[2] * sh.kpc, 'u6l4-mul', 'Real → map: <b>divide</b> by the km for 1 cm (the map is smaller).')],
            sol: t(sh.p2[2] + '\\div ' + nS(sh.kpc) + (ok2(v, 6) ? '=' : '=' + nS(rd(v, 3)) + '\\ldots\\approx ') + (ok2(v, 6) ? nS(v) : nS(rd(v, 1)))) + '. They are about ' + nS(rd(v, 1)) + ' cm apart on the map.', hints: ['Divide the real distance by the km for 1 cm.', 'Round to the nearest tenth.'], text: 'real to map' }); } }] },

      /* ---- Q7: an enlargement scale ---- */
      { num: '7', stem: function (sh) { return 'A repair manual shows a watch gear at a scale of ' + t(sh.n + ':1') + '.'; },
        shared: function (r) { return find(function () { return { n: r.pick([5, 4, 10, 3, 6]), D: r.pick([4.2, 3.6, 4.5, 6, 5.5, 4.8]), p: r.pick([3, 2, 4, 2.5, 1.5]) }; }, function (x) { return decs(x.D * 10 / x.n) <= 2; }, { n: 5, D: 4.2, p: 3 }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { return P.mc(r, 'Is the drawing bigger or smaller than the real gear?', [{ html: '<b>Bigger</b>: ' + sh.n + ' units on the drawing for each 1 unit of the real gear (an enlargement).', right: true }, { html: '<b>Smaller</b>: ' + sh.n + ' real units are shown as 1 unit (a reduction).', why: 'The <b>drawing</b> number comes first: ' + sh.n + ' on the drawing for 1 real. The drawing is bigger.', code: 'u6l4-flip' }, { html: '<b>The same size</b>: a ratio has no units.', why: 'The two numbers are different, so the sizes are different. The drawing number comes first.', code: 'u6l4-type' }], 'Bigger: it is an enlargement (' + sh.n + ' drawing units for each 1 real unit).', ['Scale = drawing : real.'], 'bigger or smaller', true); } },
          { id: '7b', level: 'PRG', make: function (r, sh) { var cmv = sh.D / sh.n, v = cmv * 10; return num('The gear in the drawing is ' + cm(sh.D) + ' across. How wide is the real gear, in millimetres?', v, { unit: 'mm', alts: [al(cmv, 'u6l4-mm-cm', 'That’s in centimetres. Change to millimetres (× 10).'), al(sh.D * sh.n * 10, 'u6l4-mul', 'The real gear is <b>smaller</b> than the drawing: divide by ' + sh.n + '.'), al(sh.D * sh.n, 'u6l4-mul', 'The real gear is smaller: divide by ' + sh.n + ', then change cm to mm.'), al(sh.D * 10, 'u6l4-plan-len', 'That’s the drawing’s width in mm. Divide by ' + sh.n + ' for the real gear.')],
            sol: t('\\dfrac{' + sh.n + '}{1}=\\dfrac{' + nS(sh.D) + '}{x}') + ', so ' + t(sh.n + 'x=' + nS(sh.D)) + ' and ' + t('x=' + nS(cmv)) + ' cm<br>' + t(nS(cmv) + '\\times 10=' + nS(v)) + ' mm', hints: ['Real = drawing ÷ ' + sh.n + ' (the real gear is smaller).', '1 cm = 10 mm.'], text: 'real gear' }); } },
          { id: '7c', level: 'EMG', make: function (r, sh) { var mm = sh.p * sh.n, v = mm / 10; return num('A real pin in the watch is ' + nS(sh.p) + ' mm long. How long should it be in the drawing, in centimetres?', v, { unit: 'cm', alts: [al(mm, 'u6l4-mm-cm', 'That’s in millimetres. Change to centimetres (÷ 10).'), al(sh.p / sh.n / 10, 'u6l4-div', 'The drawing is <b>bigger</b>: multiply by ' + sh.n + '.'), al(sh.p / sh.n, 'u6l4-div', 'The drawing is bigger: multiply by ' + sh.n + '.')], sol: t(nS(sh.p) + '\\times ' + sh.n + '=' + nS(mm)) + ' mm ' + t('=' + nS(v)) + ' cm', hints: ['Drawing = real × ' + sh.n + '.', '10 mm = 1 cm.'], text: 'pin in drawing' }); } }] },

      /* ---- Q8: inches and feet ---- */
      { num: '8', stem: function (sh) { return 'The plan for a backyard deck uses the scale 1 in represents ' + sh.s + ' ft.'; },
        shared: function (r) {
          var s = r.pick([4, 2, 8, 4]), STAIR = { 4: [3.5, 2.5, 1.5, 3], 2: [1.5, 2.5, 3.5], 8: [3, 5, 7, 6] }, mL = { 4: [4, 5, 6], 2: [6, 7, 8, 9], 8: [2, 3] }[s];
          var Lp = r.pick(mL), Wp = find(function () { return r.pick(mL.concat([Lp - 1, 3, 2])); }, function (w) { return w > 0 && w < Lp; }, Lp - 1);
          return { s: s, L: Lp * s, W: Wp * s, st: r.pick(STAIR[s]), rl: r.pick([2.75, 1.5, 3.25, 2.25, 1.75]) };
        },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) { var mk = function (lab, x) { return fld(lab, x / sh.s, { unit: 'in', name: lab.replace(':', ''), alts: [al(x * sh.s, 'u6l4-mul', 'Real → plan: <b>divide</b> by ' + sh.s + ' (the plan is smaller).'), al(x * 12, 'u6l4-ft-in', 'Use the scale: each inch on the plan is ' + sh.s + ' ft. Divide the feet by ' + sh.s + '.')] }); };
            return fieldsPart('The deck is ' + sh.L + ' ft long and ' + sh.W + ' ft wide. Find its length and width on the plan.', [mk('Length:', sh.L), mk('Width:', sh.W)], t(sh.L + '\\div ' + sh.s + '=' + nS(sh.L / sh.s)) + ' in &nbsp; ' + t(sh.W + '\\div ' + sh.s + '=' + nS(sh.W / sh.s)) + ' in', ['Divide each real length by ' + sh.s + '.'], 'deck plan'); } },
          { id: '8b', level: 'PRG', make: function (r, sh) {
            var v = sh.st / sh.s, fr = fracOf(v), keyT = mixedT(fr);
            var p = P.math('The stairs are ' + t(mixT(sh.st)) + ' ft wide. How wide are they on the plan, as a fraction of an inch?', PK.frac(fr, function (x) { if (same(x, sh.st * sh.s)) return { code: 'u6l4-mul', hint: 'Real → plan: divide by ' + sh.s + '.' }; if (same(x, sh.s / sh.st)) return { code: 'u6l4-flip', hint: 'Divide the stairs’ width by ' + sh.s + ', not ' + sh.s + ' by the width.' }; return null; }), keyT,
              t(mixT(sh.st) + '\\div ' + sh.s + '=' + nS(sh.st) + '\\div ' + sh.s + '=' + nS(v) + '=' + keyT) + ' in', ['Divide by ' + sh.s + '. A calculator gives a decimal: change it to a fraction (0.5 = ' + t('\\frac{1}{2}') + ', 0.25 = ' + t('\\frac{1}{4}') + ', 0.125 = ' + t('\\frac{1}{8}') + ').'], 'stairs fraction', { keys: 'fraction', after: 'in' });
            p.bad = [nS(sh.st * sh.s)];
            return p;
          } },
          { id: '8c', level: 'EMG', make: function (r, sh) { var v = sh.rl * sh.s; return num('A railing is ' + t(mixT(sh.rl)) + ' in long on the plan. How long is the real railing?', v, { unit: 'ft', alts: [al(sh.rl / sh.s, 'u6l4-div', 'Plan → real: <b>multiply</b> by ' + sh.s + '.'), al(Math.floor(sh.rl) * sh.s, 'u6l4-conv', 'Use the whole length: ' + t(mixT(sh.rl) + '=' + nS(sh.rl)) + '.')], sol: t(mixT(sh.rl) + '\\times ' + sh.s + '=' + nS(sh.rl) + '\\times ' + sh.s + '=' + nS(v)) + ' ft', hints: ['Change the mixed number to a decimal, then multiply by ' + sh.s + '.'], text: 'railing' }); } }] },

      /* ---- Q9: models ---- */
      { num: '9', stem: 'Models are built to scale.', shared: function (r) {
          var sc = r.pick([[87, 'HO-scale'], [48, 'O-scale'], [160, 'N-scale'], [87, 'HO-scale']]), bo = find(function () { return { ab: r.pick([[3, 100], [2, 75], [3, 50], [4, 75]]), R: r.pick([9, 7.5, 6, 12, 4.5]), Rm: r.pick([12, 10, 8, 15, 9]) }; }, function (x) { return decs(x.R * 100 * x.ab[0] / x.ab[1]) <= 1 && decs(x.Rm * 100 * x.ab[0] / x.ab[1]) <= 1; }, { ab: [3, 100], R: 9, Rm: 12 });
          return { n: sc[0], nm: sc[1], M: r.pick([24.5, 22, 18.5, 26, 15.5]), H: r.pick([25, 30, 22, 28, 18]), ab: bo.ab, R: bo.R, Rm: bo.Rm };
        },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) { var c = sh.M * sh.n, v = c / 100; return num('An ' + sh.nm + ' (' + t('1:' + sh.n) + ') model locomotive is ' + cm(sh.M) + ' long. How long is the real locomotive, to the nearest tenth of a metre?', v, { unit: 'm', dp: 1, alts: [al(c, 'u6l4-unit-box', 'That’s in centimetres. Change to metres (÷ 100).'), al(sh.M / sh.n, 'u6l4-div', 'The real locomotive is bigger: multiply by ' + sh.n + '.'), al(c / 1000, 'u6l4-conv', '1 m = <b>100</b> cm.')],
            sol: t(nS(sh.M) + '\\times ' + sh.n + '=' + nS(c)) + ' cm<br>' + t(nS(c) + '\\div 100=' + nS(v) + (ok2(v, 1) ? '' : '\\approx ' + nS(rd(v, 1)))) + ' m', hints: ['Multiply by ' + sh.n + ' (the answer is in cm).', 'Change cm to m and round to the nearest tenth.'], text: 'model to real' }); } },
          { id: '9b', level: 'PRG', make: function (r, sh) { var v = sh.H * 100 / sh.n; return num('An old prairie grain elevator is ' + sh.H + ' m tall. How tall is an ' + sh.nm.split('-')[0] + ' model of it, to the nearest tenth of a centimetre?', v, { unit: 'cm', dp: 1, alts: [al(sh.H / sh.n, 'u6l4-no-conv', 'Change ' + sh.H + ' m to centimetres first (× 100), then divide by ' + sh.n + '.'), al(sh.H * sh.n, 'u6l4-mul', 'The model is smaller: divide by ' + sh.n + '.')],
            sol: t(sh.H + '\\text{ m}=' + sh.H * 100 + '\\text{ cm}') + '; ' + t(sh.H * 100 + '\\div ' + sh.n + '=' + nS(rd(v, 3)) + '\\ldots\\approx ' + nS(rd(v, 1))) + ' cm', hints: ['Change to cm first.', 'Model = real ÷ ' + sh.n + '. Round to the nearest tenth.'], text: 'real to model' }); } },
          { id: '9c', level: 'ADV', make: function (r, sh) { var a = sh.ab[0], b = sh.ab[1], M = q(sh.R * 100 * a / b), c = M * b / a; return num('A model sailboat is built at a scale of ' + t(a + ':' + b) + '. The model is ' + cm(M) + ' long. How long is the real boat, in metres?', c / 100, { unit: 'm', alts: [al(c, 'u6l4-unit-box', 'That’s in centimetres. Change to metres (÷ 100).'), al(M * a / b / 100, 'u6l4-flip', 'Model ÷ real = ' + t('\\dfrac{' + a + '}{' + b + '}') + '. The real boat is the bigger one.'), al(M * b / 100, 'u6l4-flip', 'Use both numbers of the ratio: ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{' + nS(M) + '}{x}') + '.')],
            sol: t('\\dfrac{\\text{model}}{\\text{real}}:\\ \\dfrac{' + a + '}{' + b + '}=\\dfrac{' + nS(M) + '}{x}') + ', so ' + t(a + 'x=' + nS(M * b)) + ' and ' + t('x=' + nS(c)) + ' cm ' + t('=' + nS(c / 100)) + ' m', hints: ['Write a proportion: ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{\\text{model}}{\\text{real}}') + '.', 'Change cm to m at the end.'], text: 'boat real' }); } },
          { id: '9d', level: 'ADV', make: function (r, sh) { var a = sh.ab[0], b = sh.ab[1], v = sh.Rm * 100 * a / b; return num('The real mast of that boat is ' + sh.Rm + ' m tall. How tall is the model’s mast?', v, { unit: 'cm', alts: [al(sh.Rm * a / b, 'u6l4-no-conv', 'Change ' + sh.Rm + ' m to centimetres first.'), al(sh.Rm * 100 * b / a, 'u6l4-flip', 'The model is smaller: ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{x}{' + sh.Rm * 100 + '}') + '.'), al(sh.Rm * 100 / b, 'u6l4-flip', 'Use both numbers of the ratio: multiply by ' + a + ' and divide by ' + b + '.')],
            sol: t(sh.Rm + '\\text{ m}=' + sh.Rm * 100 + '\\text{ cm}') + '; ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{x}{' + sh.Rm * 100 + '}') + ', so ' + t(b + 'x=' + nS(a * sh.Rm * 100)) + ' and ' + t('x=' + nS(v)) + ' cm', hints: ['Change to cm first.', t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{\\text{model}}{\\text{real}}') + '.'], text: 'mast model' }); } }] },

      /* ---- Q10: choosing a scale ---- */
      { num: '10', stem: function (sh) { return 'Tomas wants to draw his backyard, ' + sh.L + ' m long and ' + sh.W + ' m wide, in a space ' + sh.Ls + ' cm long and ' + sh.Ws + ' cm wide.'; },
        shared: function (r) { return scaleShared(r, [[61, 26]]); },
        parts: [
          { id: '10a', level: 'MAS', make: function (r, sh) { return scaleFields('Choose an easy scale so the yard fits. Show your work: the metres for each centimetre, both ways, then the scale.', sh); } },
          { id: '10b', level: 'EMG', make: function (r, sh) { var mk = function (lab, x) { return fld(lab, x / sh.s, { unit: 'cm', name: lab.replace(':', ''), alts: [al(x * sh.s, 'u6l4-mul', 'Real → drawing: <b>divide</b> by ' + nS(sh.s) + '.')] }); };
            return fieldsPart('Use the scale 1 cm represents ' + nS(sh.s) + ' m. Find the length and width of the yard on his drawing.', [mk('Length:', sh.L), mk('Width:', sh.W)], t(sh.L + '\\div ' + nS(sh.s) + '=' + nS(sh.L / sh.s)) + ' cm &nbsp; ' + t(sh.W + '\\div ' + nS(sh.s) + '=' + nS(sh.W / sh.s)) + ' cm', ['Divide each real length by ' + nS(sh.s) + '.'], 'yard on paper'); } },
          { id: '10c', level: 'EMG', make: function (r, sh) {
            var small = find(function () { return r.pick([0.5, 1, 1.5, 2, 2.5, 4]); }, function (v) { return v < sh.need && (sh.L / v > sh.Ls || sh.W / v > sh.Ws); }, sh.s / 2), bigS = sh.s * 5, useL = sh.L / small > sh.Ls;
            return P.mc(r, 'Why would “1 cm represents ' + nS(small) + ' m” not work? Why is “1 cm represents ' + nS(bigS) + ' m” a poor choice?', [
              { html: 'With ' + nS(small) + ' m the ' + (useL ? 'length' : 'width') + ' is ' + nS(rd((useL ? sh.L : sh.W) / small, 2)) + ' cm, too long for the space. With ' + nS(bigS) + ' m the yard is only ' + nS(rd(sh.L / bigS, 2)) + ' cm by ' + nS(rd(sh.W / bigS, 2)) + ' cm: it fits, but it is too small to show details.', right: true },
              { html: nS(small) + ' m is not a whole number, and ' + nS(bigS) + ' m makes the drawing too big for the space.', why: 'Work out the drawing sizes: divide the real lengths by each scale. A bigger number of metres per cm makes the drawing <b>smaller</b>.', code: 'u6l4-reason' },
              { html: 'With ' + nS(small) + ' m the drawing is too small to see. With ' + nS(bigS) + ' m it is too big to fit.', why: 'It’s the other way round: fewer metres per cm makes a <b>bigger</b> drawing.', code: 'u6l4-reason' },
              { html: 'Both would work: any scale is fine as long as you write it on the drawing.', why: 'Check: ' + t((useL ? sh.L : sh.W) + '\\div ' + nS(small)) + ' is more than the space.', code: 'u6l4-reason' }],
              'With ' + nS(small) + ' m: ' + t((useL ? sh.L : sh.W) + '\\div ' + nS(small) + (ok2((useL ? sh.L : sh.W) / small, 2) ? '=' : '\\approx ') + nS(rd((useL ? sh.L : sh.W) / small, 2))) + ' cm, too long for the ' + (useL ? sh.Ls : sh.Ws) + ' cm space.<br>With ' + nS(bigS) + ' m: the yard is only ' + nS(rd(sh.L / bigS, 2)) + ' cm by ' + nS(rd(sh.W / bigS, 2)) + ' cm. It fits, but it is too small to show details.', ['Divide the real lengths by each scale and compare with the space.'], 'scale reasons');
          } }] },

      /* ---- Q11: the kitchen plan ---- */
      { num: '11', stem: function (sh) { return 'Draw a floor plan of a kitchen using the scale 1 cm represents ' + nS(sh.s) + ' m. The kitchen is ' + cm(sh.R[0], 'm') + ' long and ' + cm(sh.R[1], 'm') + ' wide. It has ' + an(sh.R[2]) + ' ' + cm(sh.R[2], 'm') + ' door near a corner of one long wall, a counter ' + cm(sh.R[3], 'm') + ' deep along the whole opposite long wall, and an island ' + cm(sh.R[4], 'm') + ' by ' + cm(sh.R[5], 'm') + ' in the middle.'; },
        shared: function (r) {
          return find(function () { var s = r.pick([0.4, 0.25, 0.2, 0.8, 0.4]), Pp = [r.int(9, 13), r.int(7, 9), r.pick([2, 2.5, 3]), r.pick([1.5, 2, 2.5, 3]), r.pick([4, 5, 6]), r.pick([2, 3, 2.5])]; if (s === 0.8) Pp = [r.int(5, 7), r.int(4, 5), 1, r.pick([0.75, 1]), r.pick([2, 2.5]), 1]; return { s: s, Pp: Pp, R: Pp.map(function (p) { return q(p * s); }) }; },
            function (x) { return x.Pp[1] < x.Pp[0] && x.R.every(function (v) { return decs(v) <= 2; }) && x.Pp[4] < x.Pp[0] - 2 && !(x.s === 0.4 && x.R[0] === 4 && x.R[1] === 3.2); }, null);
        },
        parts: [{ id: '11a', level: 'EMG', make: function (r, sh) {
          var labs = ['Length:', 'Width:', 'Door:', 'Counter depth:', 'Island length:', 'Island width:'];
          return fieldsPart('Fill in the plan lengths first (in cm). (Then draw the plan on grid paper.)', labs.map(function (lab, i) { return fld(lab, sh.Pp[i], { unit: 'cm', name: lab.replace(':', ''), alts: [al(sh.R[i] * sh.s, 'u6l4-mul', 'Real → plan: <b>divide</b> by ' + nS(sh.s) + '.'), al(sh.R[i] * 100, 'u6l4-no-conv', 'That’s the real length in cm. Use the scale: divide the metres by ' + nS(sh.s) + '.')] }); }),
            'Divide each real length by ' + nS(sh.s) + ':<br>' + labs.map(function (lab, i) { return lab.replace(':', '') + ': ' + t(nS(sh.R[i]) + '\\div ' + nS(sh.s) + '=' + nS(sh.Pp[i])) + ' cm'; }).join('<br>'), ['Plan length = real length ÷ ' + nS(sh.s) + '.'], 'kitchen plan');
        } }] },

      /* ---- Q12: Kai's unit slip ---- */
      { num: '12', stem: function (sh) { return 'On a ' + t('1:' + sh.n) + ' floor plan, a wall is ' + cm(sh.w) + ' long. Kai says, “The real wall is ' + t(nS(sh.w) + '\\times ' + sh.n + '=' + nS(sh.w * sh.n)) + ' m long.”'; },
        shared: function (r) { return find(function () { return { n: r.pick([150, 75, 200, 125, 250]), w: r.pick([6.4, 4.8, 5.2, 3.6, 4.4, 2.8]) }; }, function (x) { return decs(x.w * x.n / 100) <= 2 && x.w * x.n >= 300; }, { n: 150, w: 6.4 }); },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, sh) { var v = sh.w * sh.n; return P.mc(r, 'How can you tell right away that Kai’s answer is wrong?', [{ html: nS(v) + ' m is ' + (v >= 1000 ? 'more than' : 'almost') + ' a kilometre. No wall in a house is that long.', right: true }, { html: 'He should have divided by ' + sh.n + ', because a plan is smaller than the real wall.', why: 'Plan → real is right to multiply (the real wall is bigger). Look at the size of his answer instead.', code: 'u6l4-reason' }, { html: 'A ratio scale can’t be used with a calculator.', why: 'You can multiply by ' + sh.n + '. The problem is the <b>unit</b> of the answer.', code: 'u6l4-reason' }, { html: 'The wall on the plan is too short to measure.', why: 'The plan length is fine. Is ' + nS(v) + ' m a sensible length for a wall?', code: 'u6l4-reason' }], nS(v) + ' m is ' + (v >= 1000 ? 'more than' : 'almost') + ' a kilometre. No wall in a house is that long.', ['Picture ' + nS(v) + ' m. Is that a sensible length for a wall?'], 'Kai check'); } },
          { id: '12b', level: 'EMG', make: function (r, sh) { var c = sh.w * sh.n, v = c / 100; return num('Find his mistake: what is the correct length of the real wall?', v, { unit: 'm', alts: [al(c, 'u6l4-unit-box', 'That’s Kai’s number: it is in <b>cm</b>, not m. Change cm to m.'), al(c / 1000, 'u6l4-conv', '1 m = <b>100</b> cm.'), al(sh.w / sh.n, 'u6l4-div', 'Plan → real: multiply by ' + sh.n + ' (the answer is in cm), then change to m.')],
            sol: 'The ratio is in the same units, so ' + t(nS(sh.w) + '\\times ' + sh.n + '=' + nS(c)) + ' <b>cm</b>, not m.<br>' + t(nS(c) + '\\div 100=' + nS(v)) + ' m', hints: ['A ratio has the same unit on both sides: the plan is in cm, so the answer is in cm.', 'Change cm to m.'], text: 'Kai fix' }); } }] },

      /* ---- Q13: the trail map ---- */
      { num: '13', stem: function (sh) { return 'This trail map is drawn to scale. The trail goes from the trailhead T past a lake (A) and a bridge (B) to a waterfall (C). Measured with a ruler: the pieces of the trail are marked in blue, and the straight line from T to C in grey.' + trailSVG({ pts: sh.pts, seg: sh.seg.map(function (x) { return cm(x); }), straight: cm(sh.tc) }) + barSVG({ blocks: 4, bcm: sh.b, v: sh.v * sh.b, unit: 'km' }); },
        shared: function (r) {
          return find(function () {
            var a1 = r.int(18, 30) / 10, a2 = r.int(12, 22) / 10, b = r.int(25, 40) / 10, c1 = r.int(8, 16) / 10, c2 = r.int(10, 20) / 10;
            var pts = [[0, 0], [a1, a2], [q(a1 + b), a2], [q(a1 + b + c1), q(a2 + c2)]], seg = [rd(Math.hypot(a1, a2), 1), b, rd(Math.hypot(c1, c2), 1)], tc = rd(Math.hypot(pts[3][0], pts[3][1]), 1);
            var v = r.pick([0.25, 0.5, 0.2, 0.25]), bl = r.pick([1, 1, 2]), sp = r.pick([3, 4, 3.5, 2.5]), tot = q(seg[0] + seg[1] + seg[2]), real = q(tot * v), hrs = 2 * real / sp, H = Math.floor(hrs + 1e-9), Mn = Math.round((hrs - H) * 60);
            return { pts: pts, seg: seg, tc: tc, v: v, b: bl, sp: sp, tot: tot, real: real, hrs: hrs, H: H, Mn: Mn };
          }, function (x) { return x.Mn >= 3 && x.Mn <= 57 && x.H >= 1 && decs(x.real) <= 3 && Math.abs(x.hrs * 60 - Math.round(x.hrs * 60)) > 0.02; }, null);
        },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) { return num('Write the scale in words: 1 cm represents ____ km.', sh.v, { unit: 'km', alts: sh.b > 1 ? [al(sh.v * sh.b, 'u6l4-block', 'One block is ' + sh.b + ' cm long (use the ruler). Divide its value by ' + sh.b + '.')] : [al(sh.v * 1000, 'u6l4-unit-box', 'That’s in metres. The box is in km.')], sol: 'One block is ' + cm(sh.b) + ' and represents ' + nS(sh.v * sh.b) + ' km' + (sh.b > 1 ? ', so 1 cm represents ' + t(nS(sh.v * sh.b) + '\\div ' + sh.b + '=' + nS(sh.v)) + ' km' : '') + ' (' + nS(sh.v * 1000) + ' m).', hints: ['Read the length of one block with the ruler.'], text: 'trail scale' }); } },
          { id: '13b', level: 'EMG', make: function (r, sh) { return num('Find the real length of the trail from T to C.', sh.real, { unit: 'km', alts: [al(sh.tc * sh.v, 'u6l4-reason', 'That’s the straight line. Add the three pieces of the trail.'), al(sh.seg[0] * sh.v, 'u6l4-reason', 'Add all three pieces first.'), al(sh.tot / sh.v, 'u6l4-mul', 'Multiply the map length by what 1 cm represents.'), al(sh.tot, 'u6l4-plan-len', 'That’s the length on the map. Use the scale.')],
            sol: steps(['Map: ' + t(sh.seg.map(nS).join('+') + '=' + nS(sh.tot)) + ' cm', t(nS(sh.tot) + '\\times ' + nS(sh.v) + '=' + nS(sh.real)) + ' km']), hints: ['Add the three pieces on the map, then change the total to a real distance once.'], text: 'trail length' }); } },
          { id: '13c', sub: 'c i', level: 'EMG', make: function (r, sh) { return num('Find the real straight-line distance from T to C.', sh.tc * sh.v, { unit: 'km', alts: [al(sh.real, 'u6l4-reason', 'That’s the trail. Use the straight grey line.'), al(sh.tc / sh.v, 'u6l4-mul', 'Multiply by what 1 cm represents.'), al(sh.tc, 'u6l4-plan-len', 'That’s the map length. Use the scale.')], sol: t(nS(sh.tc) + '\\times ' + nS(sh.v) + '=' + nS(sh.tc * sh.v)) + ' km', hints: ['Multiply the straight line’s map length by what 1 cm represents.'], text: 'straight line' }); } },
          { id: '13c2', sub: 'c ii', level: 'BEG', make: function (r, sh) { return P.mc(r, 'Why is the straight line shorter than the trail?', [{ html: 'A straight line is the shortest path between two points; the trail bends.', right: true }, { html: 'The straight line uses a different scale.', why: 'Everything on the map uses the same scale.', code: 'u6l4-reason' }, { html: 'The trail is measured in km and the line in m.', why: 'Both are measured the same way. Think about the shape of the path.', code: 'u6l4-reason' }, { html: 'It isn’t: they are the same length.', why: 'Compare your answers to (b) and (c) i.', code: 'u6l4-reason' }], 'A straight line is the shortest path between two points; the trail bends.', [], 'why shorter'); } },
          { id: '13d', sub: 'd', level: 'MAS', make: function (r, sh) {
            var one = 2 * sh.real / sh.sp / 2, H1 = Math.floor(one + 1e-9), M1 = Math.round((one - H1) * 60), decMin = Math.round((sh.hrs - sh.H) * 100);
            var hAl = [al(H1, 'u6l4-one-way', 'He hikes there <b>and back</b>: double the trail length first.')], mAl = [al(M1, 'u6l4-one-way', 'He hikes there <b>and back</b>: double the trail length first.')];
            if (decMin !== sh.Mn && Math.abs(decMin - sh.Mn) > 1) mAl.push(al(decMin, 'u6l4-dec-min', 'The decimal part of the hours is not minutes: multiply it by 60.'));
            return fieldsPart('Rhys hikes from T to C and back along the trail at about ' + nS(sh.sp) + ' km/h. About how long does the hike take?', [fld('Hours:', sh.H, { unit: 'h', name: 'Hours', alts: hAl }), fld('Minutes:', sh.Mn, { unit: 'min', name: 'Minutes', also: [sh.Mn - 1, sh.Mn + 1], alts: mAl })],
              steps(['There and back: ' + t('2\\times ' + nS(sh.real) + '=' + nS(2 * sh.real)) + ' km', 'time = distance ÷ speed ' + t('=' + nS(2 * sh.real) + '\\div ' + nS(sh.sp) + '\\approx ' + nS(rd(sh.hrs, 3))) + ' h', t(nS(rd(sh.hrs - sh.H, 3)) + '\\times 60\\approx ' + sh.Mn) + ' min. About ' + sh.H + ' h ' + sh.Mn + ' min.']),
              ['There and back is twice the trail.', 'time = distance ÷ speed; then change the decimal part of the hours to minutes (× 60).'], 'hike time');
          } }] },

      /* ---- Q14–15: multiple choice ---- */
      { num: '14', stem: '', parts: [{ id: '14a', level: 'BEG', make: function (r) {
        var s = find(function () { return { n: r.pick([25000, 50000, 20000, 10000]), d: r.pick([4, 6, 8, 5, 3]) }; }, function (x) { var c = x.d * x.n; return ok2(c / 100000, 2) && [c / 10000, c / 1000, x.n / x.d].every(function (w) { return !same(w, c / 100000); }); }, { n: 25000, d: 4 });
        var c = s.d * s.n, km = c / 100000;
        return P.mc(r, 'On a map with a scale of ' + t('1:' + bigT(s.n)) + ', two lookouts are ' + cm(s.d) + ' apart. How far apart are they really?', [
          { html: nS(km) + ' km', right: true }, { html: nS(c / 10000) + ' km', why: '1 km = <b>100 000</b> cm: divide by 100 000.', code: 'u6l4-conv' },
          { html: nS(c / 1000) + ' m', why: '1 m = <b>100</b> cm: divide the centimetres by 100 to get metres.', code: 'u6l4-conv' }, { html: nS(rd(s.n / s.d, 2)) + ' m', why: 'Multiply the map distance by ' + big(s.n) + ' (don’t divide).', code: 'u6l4-div' }],
          t(s.d + '\\times ' + bigT(s.n) + '=' + bigT(c)) + ' cm ' + t('=' + nS(km)) + ' km', ['Multiply, then change cm to km (÷ 100 000).'], 'lookouts MC');
      } }] },
      { num: '15', stem: '', parts: [{ id: '15a', level: 'BEG', make: function (r) {
        var n = r.pick([24, 18, 32, 43, 25]), what = r.pick(['truck', 'tractor', 'fire truck', 'bus']);
        return P.mc(r, 'A model ' + what + ' is built at a scale of ' + t('1:' + n) + '. Which statement is true?', [
          { html: 'Every length on the model is ' + t('\\frac{1}{' + n + '}') + ' of the real length.', right: true },
          { html: 'Every real length is ' + t('\\frac{1}{' + n + '}') + ' of the model length.', why: 'The ratio is model : real. The real ' + what + ' is the bigger one.', code: 'u6l4-flip' },
          { html: 'The model is ' + n + ' cm long.', why: 'The scale compares lengths; it says nothing about the model’s total length.', code: 'u6l4-reason' },
          { html: 'Every angle on the model is ' + t('\\frac{1}{' + n + '}') + ' of the real angle.', why: 'A model is similar to the real thing, so its angles are the same.', code: 'u6l4-reason' }],
          'Every model length is ' + t('\\frac{1}{' + n + '}') + ' of the real length. The angles stay the same, and the scale says nothing about the total length.', [], 'model MC');
      } }] },

      /* ---- Q16–17: numerical response ---- */
      { num: '16', stem: '', parts: [{ id: '16a', level: 'EMG', make: function (r) {
        var s = find(function () { return { n: r.pick([75, 50, 125, 150, 250, 40]), d: r.pick([5.6, 4.8, 6.4, 3.2, 4.4, 7.2]) }; }, function (x) { var v = x.d * x.n / 100; return decs(v) <= 2 && nS(v).length <= 4; }, { n: 75, d: 5.6 });
        var c = s.d * s.n, v = c / 100;
        return num('<b>Numerical response.</b> On a ' + t('1:' + s.n) + ' floor plan, a room is ' + cm(s.d) + ' long. The real length of the room, in metres, is ____.', v, { nr: true, alts: [al(c, 'u6l4-unit-box', 'That’s in centimetres. Change to metres (÷ 100).'), al(s.d / s.n, 'u6l4-div', 'Plan → real: multiply.'), al(c / 1000, 'u6l4-conv', '1 m = <b>100</b> cm.')], sol: t(nS(s.d) + '\\times ' + s.n + '=' + nS(c)) + ' cm; ' + t(nS(c) + '\\div 100=' + nS(v)) + ' m', hints: ['Multiply by ' + s.n + ' (cm), then change to m.'], text: 'room NR' });
      } }] },
      { num: '17', stem: '', parts: [{ id: '17a', level: 'EMG', make: function (r) {
        var s = find(function () { return { k: r.pick([2.5, 4, 5, 1.5, 0.5, 2]), R: r.pick([17, 23, 14, 9, 31, 12, 6.5]) }; }, function (x) { var v = x.R / x.k; return decs(v) <= 2 && nS(v).length <= 4 && !same(v, x.R); }, { k: 2.5, R: 17 });
        var v = s.R / s.k;
        return num('<b>Numerical response.</b> On a map, 1 cm represents ' + nS(s.k) + ' km. A bike route is ' + nS(s.R) + ' km long. On the map, the route is ____ cm long.', v, { nr: true, alts: [al(s.R * s.k, 'u6l4-mul', 'Real → map: <b>divide</b> by ' + nS(s.k) + '.'), al(s.k / s.R, 'u6l4-flip', 'Divide the route by ' + nS(s.k) + ', not the other way.')], sol: t(nS(s.R) + '\\div ' + nS(s.k) + '=' + nS(v)) + ' cm', hints: ['Map length = real length ÷ (km for 1 cm).'], text: 'route NR' });
      } }] }
    ],

    extra: [
      /* ---- A. Skills ---- */
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Complete the table.' + table(['', 'Scale in words', 'As a ratio'], sh.rows.map(function (rw, i) { return ['(' + 'abcdef'.charAt(i) + ')', rw.wordsShown, rw.ratioShown]; })); },
        shared: function (r) {
          var a = wordsRow('m', r.pick([8, 6, 7, 9, 3])), b = wordsRow('km', r.pick([0.5, 0.25, 1.5, 0.2])), c = wordsRow('ft', r.pick([6, 3, 5, 10])), d = r.pick([40, 30, 60, 75]), e = r.pick([2500000, 1500000, 3500000, 500000]), f = r.pick([10, 5, 20, 50]);
          return { rows: [{ wordsShown: a.words, ratioShown: '?', fld: rFld('(a) ' + a.words + ':', a.n, a.alts, false, '(a)'), sol: '(a) ' + a.sol + ', so ' + t('1:' + bigT(a.n)), enl: false, words: a.words },
            { wordsShown: b.words, ratioShown: '?', fld: rFld('(b) ' + b.words + ':', b.n, b.alts, false, '(b)'), sol: '(b) ' + b.sol + ', so ' + t('1:' + bigT(b.n)), enl: false, words: b.words },
            { wordsShown: c.words, ratioShown: '?', fld: rFld('(c) ' + c.words + ':', c.n, c.alts, false, '(c)'), sol: '(c) ' + c.sol + ', so ' + t('1:' + c.n), enl: false, words: c.words },
            { wordsShown: '?', ratioShown: t('1:' + d), fld: fld('(d) ' + t('1:' + d) + ' → 1 cm represents', d, { unit: 'cm', name: '(d)', alts: [al(d / 100, 'u6l4-unit-box', 'This box is in cm: 1 : ' + d + ' means 1 cm represents ' + d + ' cm.')] }), sol: '(d) 1 cm represents ' + d + ' cm (already sensible)', enl: false, words: t('1:' + d) },
            { wordsShown: '?', ratioShown: t('1:' + bigT(e)), fld: fld('(e) ' + t('1:' + bigT(e)) + ' → 1 cm represents', e / 100000, { unit: 'km', name: '(e)', alts: [al(e / 100, 'u6l4-unit-box', 'That’s in metres. The box is in km.'), al(e / 1000, 'u6l4-conv', '1 km = 100 000 cm.'), al(e / 10000, 'u6l4-conv', '1 km = 100 000 cm.')] }), sol: '(e) ' + t(bigT(e) + '\\text{ cm}\\div 100\\,000=' + nS(e / 100000) + '\\text{ km}'), enl: false, words: t('1:' + bigT(e)) },
            { wordsShown: '?', ratioShown: t(f + ':1'), fld: fld('(f) ' + t(f + ':1') + ' → ', f, { unit: 'cm', name: '(f)', alts: [al(1 / f, 'u6l4-flip', 'The drawing number comes first: ' + f + ' cm on the drawing for 1 cm real.')] }), sol: '(f) ' + f + ' cm represents 1 cm (an enlargement)', enl: true, words: t(f + ':1') }] };
        },
        parts: [
          { id: 'e1a', sub: 'a–f i', level: 'EMG', make: function (r, sh) { var flds = sh.rows.map(function (rw) { return rw.fld; }); flds[5] = Object.assign({}, flds[5], { after: 'cm represents 1 cm' }); return fieldsPart('Fill in the missing ratio or words.', flds, sh.rows.map(function (rw) { return rw.sol; }).join('<br>'), ['Words → ratio: change the real length to the diagram’s unit.', 'Ratio → words: 1 : n means 1 cm represents n cm; change n cm to m or km.'], 'scale table'); } },
          { id: 'e1b', sub: 'a–f ii', level: 'BEG', make: function (r, sh) { return typeGrid2('Is each one a reduction or an enlargement?', sh.rows.map(function (rw, i) { return { label: '(' + 'abcdef'.charAt(i) + ') ' + rw.words, want: rw.enl ? 'enl' : 'red', why: rw.enl ? 'The drawing number comes first and it is bigger: an enlargement.' : 'The real length is bigger, so the drawing is smaller: a reduction.' }; }), RE_COLS, '(a)–(e) are reductions; (f) is an enlargement (the drawing is bigger).', 'reduction or enlargement'); } }] },
      { num: '2', stem: '', parts: [{ id: 'e2', level: 'BEG', make: function (r) {
        var s = r.pick([3, 2.5, 4, 2, 5]), ps = r.sample([4, 2.5, 0.6, 6.8, 3.2, 1.4, 5.5, 0.8], 4);
        return fieldsPart('A plan uses the scale 1 cm represents ' + nS(s) + ' m. Find each real length.', ps.map(function (p, i) { var L = '(' + 'abcd'.charAt(i) + ') ' + cm(p) + ' →'; return fld(L, p * s, { unit: 'm', name: '(' + 'abcd'.charAt(i) + ')', alts: [al(p / s, 'u6l4-div', 'Plan → real: <b>multiply</b> by ' + nS(s) + '.'), al(p + s, 'u6l4-div', 'Multiply by ' + nS(s) + '; don’t add.')] }); }),
          'Multiply each plan length by ' + nS(s) + ': ' + ps.map(function (p) { return t(nS(p) + '\\times ' + nS(s) + '=' + nS(p * s)); }).join(', '), ['Real = plan length × ' + nS(s) + '.'], 'plan to real');
      } }] },
      { num: '3', stem: '', parts: [{ id: 'e3', level: 'EMG', make: function (r) {
        var n = r.pick([250, 200, 500, 125, 400]), R = find(function () { return r.sample([10, 6.5, 1.5, 22, 8, 12.5, 3, 15], 4); }, function (a) { return a.every(function (x) { return decs(x * 100 / n) <= 2; }); }, [10, 6.5, 1.5, 22]);
        return fieldsPart('A plan has a scale of ' + t('1:' + n) + '. Find each plan length in centimetres.', R.map(function (x, i) { var L = '(' + 'abcd'.charAt(i) + ') ' + cm(x, 'm') + ' →'; return fld(L, x * 100 / n, { unit: 'cm', name: '(' + 'abcd'.charAt(i) + ')', alts: [al(x / n, 'u6l4-no-conv', 'Change ' + nS(x) + ' m to cm first (× 100), then divide by ' + n + '.'), al(x * n, 'u6l4-mul', 'Real → plan: divide.'), al(x * 100 * n, 'u6l4-mul', 'Real → plan: divide by ' + n + '.')] }); }),
          'Change to cm, then divide by ' + n + ':<br>' + R.map(function (x, i) { return '(' + 'abcd'.charAt(i) + ') ' + t(nS(x * 100) + '\\div ' + n + '=' + nS(x * 100 / n)); }).join(' &nbsp; ') + '<br>(Or: 1 cm represents ' + nS(n / 100) + ' m, so divide each length in metres by ' + nS(n / 100) + '.)', ['Change the metres to centimetres.', 'Divide by ' + n + '.'], 'real to plan');
      } }] },
      { num: '4', stem: function (sh) { return 'A highway map has this bar scale. Use the ruler under it.' + barSVG({ blocks: 4, bcm: 1, v: sh.v, unit: 'km' }); },
        shared: function (r) { return { v: r.pick([30, 20, 25, 50, 15, 40]), d: r.pick([3.5, 2.5, 4.5, 3.2, 2.8]) }; },
        parts: [
          { id: 'e4a', sub: 'a', level: 'BEG', make: function (r, sh) { return num('Write the scale in words: 1 cm represents ____ km.', sh.v, { unit: 'km', alts: [al(sh.v * 4, 'u6l4-block', 'That’s the whole bar. Each 1 cm block is ' + sh.v + ' km.')], sol: 'Each 1 cm block is ' + sh.v + ' km: 1 cm represents ' + sh.v + ' km.', hints: ['Measure one block with the ruler.'], text: 'bar words' }); } },
          { id: 'e4b', sub: 'b', level: 'EMG', make: function (r, sh) { return { prompt: 'Write the scale as a ratio.', input: { type: 'number', before: t('1:') }, check: ratioC(sh.v * 100000, [al(sh.v, 'u6l4-no-conv', 'Change ' + sh.v + ' km to cm: × 100 000.'), al(sh.v * 1000, 'u6l4-conv', 'That’s metres. 1 km = 100 000 cm.'), al(sh.v * 10000, 'u6l4-conv', '1 km = 100 000 cm (five zeros).')]), key: nS(sh.v * 100000), answer: t('1:' + bigT(sh.v * 100000)), solution: t(sh.v + '\\times 100\\,000=' + bigT(sh.v * 100000)) + ' cm, so ' + t('1:' + bigT(sh.v * 100000)) + '.', hints: ['1 km = 100 000 cm.'], text: 'bar ratio', bad: [String(sh.v * 1000)] }; } },
          { id: 'e4c', sub: 'c', level: 'BEG', make: function (r, sh) { return num('Two towns are ' + cm(sh.d) + ' apart on this map. How far apart are they?', sh.d * sh.v, { unit: 'km', alts: [al(sh.d / sh.v, 'u6l4-mul', 'Multiply the map length by ' + sh.v + '.')], sol: t(nS(sh.d) + '\\times ' + sh.v + '=' + nS(sh.d * sh.v)) + ' km', hints: ['Multiply by what 1 cm represents.'], text: 'towns' }); } }] },
      { num: '5', stem: '', parts: [{ id: 'e5', sub: 'a–d', level: 'BEG', make: function (r) {
        var a = r.pick([30, 20, 50, 12]), b = r.pick([4, 3, 10, 2]), d = r.pick([100000, 50000, 250000]);
        var items = r.shuffle([{ label: t('1:' + a), want: 'sm', why: 'The drawing number (1) is smaller than the real number (' + a + '): the drawing is smaller.' }, { label: t(b + ':1'), want: 'bg', why: 'The drawing number (' + b + ') is bigger than the real number (1): the drawing is bigger.' }, { label: t('1:1'), want: 'eq', why: '1 : 1 means the drawing is actual size.' }, { label: t('1:' + bigT(d)), want: 'sm', why: 'The drawing number comes first: 1 on the drawing for ' + big(d) + ' real. The drawing is smaller.' }])
          .map(function (it, i) { it.label = '(' + 'abcd'.charAt(i) + ') ' + it.label; return it; });
        var p = typeGrid2('For each scale, is the drawing smaller than, bigger than, or the same size as the real object?', items, [{ id: 'sm', html: 'Smaller' }, { id: 'bg', html: 'Bigger' }, { id: 'eq', html: 'Same size' }], 'The diagram number comes first. If it is smaller than the real number, the drawing is smaller. ' + t('1:1') + ' means the drawing is actual size.', 'smaller or bigger');
        return p;
      } }] },

      /* ---- B. Applying ---- */
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'This basement plan is drawn to scale at ' + t('1:' + sh.n) + '. The plan lengths (measured with a ruler) are shown.' + planSVG({ L: sh.X, W: sh.Y, walls: [[sh.Lr, 0, sh.Lr, sh.Y], [sh.Lr, sh.Y - sh.Hs, sh.X, sh.Y - sh.Hs]], dims: [[sh.Lr / 2, -0.45, cm(sh.Lr)], [-0.6, sh.Y / 2, cm(sh.Y), -90], [(sh.Lr + sh.X) / 2, -0.45, cm(sh.X - sh.Lr)], [sh.X + 0.6, (sh.Y - sh.Hs) / 2, cm(sh.Y - sh.Hs), 90]], names: [[sh.Lr / 2, sh.Y / 2, 'Rec room'], [(sh.Lr + sh.X) / 2, (sh.Y - sh.Hs) / 2, 'Bedroom'], [(sh.Lr + sh.X) / 2, sh.Y - sh.Hs / 2, 'Storage']] }); },
        shared: function (r) { return find(function () { var n = r.pick([100, 100, 50]), Lr = r.pick([6.6, 6, 7.2, 5.8]), Y = r.pick([4.4, 4.2, 4.8, 4]), bw = r.pick([3.4, 3.2, 3.6, 3]), Hs = r.pick([1.3, 1.2, 1.4]); return { n: n, Lr: Lr, Y: Y, X: q(Lr + bw), Hs: Hs, rate: r.pick([32.95, 28.5, 36.75, 24.99]) }; }, function (x) { return x.X <= 11; }, null); },
        parts: [
          { id: 'e6a', sub: 'a', level: 'EMG', make: function (r, sh) { var m = sh.n / 100, mk = function (lab, p) { return fld(lab, p * m, { unit: 'm', name: lab.replace(':', ''), alts: [al(p * sh.n, 'u6l4-unit-box', 'That’s in cm. Change to m (÷ 100).'), al(p / m, 'u6l4-div', 'Plan → real: multiply by ' + nS(m) + '.')].concat(same(m, 1) ? [] : [al(p, 'u6l4-plan-len', 'That’s the plan length. ' + t('1:' + sh.n) + ' means 1 cm represents ' + nS(m) + ' m.')]) }); };
            return fieldsPart('Find the real length and width of the rec room.', [mk('Length:', sh.Lr), mk('Width:', sh.Y)], 'Plan: ' + cm(sh.Lr) + ' by ' + cm(sh.Y) + '. ' + t('1:' + sh.n) + ' means 1 cm represents ' + nS(m) + ' m.<br>Real: ' + nS(sh.Lr * m) + ' m by ' + nS(sh.Y * m) + ' m.', ['1 : ' + sh.n + ' means 1 cm represents ' + sh.n + ' cm = ' + nS(m) + ' m.'], 'rec room'); } },
          { id: 'e6b', sub: 'b', level: 'EMG', make: function (r, sh) { var m = sh.n / 100, bl = q(sh.X - sh.Lr), bw = q(sh.Y - sh.Hs), mk = function (lab, p) { return fld(lab, p * m, { unit: 'm', name: lab.replace(':', ''), alts: [al(p * sh.n, 'u6l4-unit-box', 'That’s in cm. Change to m (÷ 100).'), al(p / m, 'u6l4-div', 'Plan → real: multiply by ' + nS(m) + '.')] }); };
            return fieldsPart('Find the real length and width of the bedroom.', [mk('Length:', bl), mk('Width:', bw)], 'Plan: ' + cm(bl) + ' by ' + cm(bw) + '. Real: ' + nS(bl * m) + ' m by ' + nS(bw * m) + ' m.', ['Multiply each plan length by what 1 cm represents.'], 'bedroom'); } },
          { id: 'e6c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var m = sh.n / 100, A = q(sh.Lr * m * sh.Y * m), cost = A * sh.rate;
            return fieldsPart('Carpet for the rec room costs ' + PK.money$(sh.rate) + ' per square metre. Find the area of the rec room floor and the cost of the carpet, before tax.', [fld('Area:', A, { unit: 'm²', name: 'Area', alts: [al(2 * (sh.Lr + sh.Y) * m, 'u6l4-perim', 'That’s the perimeter. Area = length × width.')].concat(same(m, 1) ? [] : [al(sh.Lr * sh.Y * m, 'u6l4-area-scale', 'Change the lengths to real lengths first, then multiply.')]) }),
              moneyFld('Cost:', cost, diagList([[2 * (sh.Lr + sh.Y) * m * sh.rate, 'u6l4-perim', 'Use the area, not the perimeter.']]), 'Cost')],
              steps([t('A=' + nS(sh.Lr * m) + '\\times ' + nS(sh.Y * m) + '=' + nS(A) + '\\text{ m}^2'), 'Cost ' + t('=' + nS(A) + '\\times ' + PK.M(sh.rate) + PK.eqM(cost))]), ['Area = real length × real width.', 'Cost = area × price per m², to the cent.'], 'carpet');
          } }] },
      { num: '7', stem: function (sh) { return 'A road map of Alberta has a scale of ' + t('1:' + bigT(sh.n)) + '.'; },
        shared: function (r) { var n = r.pick([2500000, 1500000, 3000000, 2500000]), kpc = n / 100000, p1 = r.pick(PAIRS.filter(function (p) { return p[2] >= 120; })), p2 = find(function () { return r.pick(PAIRS); }, function (p) { return p !== p1 && ok2(p[2] / kpc, 1); }, null) || PAIRS[8]; return { n: n, kpc: kpc, p1: p1, d1: rd(p1[2] / kpc, 1), p2: p2 }; },
        parts: [
          { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, sh) { var v = sh.d1 * sh.kpc; return num(sh.p1[0] + ' and ' + sh.p1[1] + ' are ' + cm(sh.d1) + ' apart on the map. About how far apart are they (straight line)?', v, { unit: 'km', alts: [al(sh.d1 * sh.n, 'u6l4-unit-box', 'That’s in cm. 1 cm represents ' + nS(sh.kpc) + ' km.'), al(sh.d1 * sh.n / 1000, 'u6l4-unit-box', 'That’s in m. The box is in km.'), al(sh.d1 / sh.kpc, 'u6l4-mul', 'Multiply by the km for 1 cm.')], sol: '1 cm represents ' + nS(sh.kpc) + ' km. ' + t(nS(sh.d1) + '\\times ' + nS(sh.kpc) + '=' + nS(v)) + ' km.', hints: ['Find what 1 cm represents in km (÷ 100 000).', 'Multiply.'], text: 'map km' }); } },
          { id: 'e7b', sub: 'b', level: 'EMG', make: function (r, sh) { var v = sh.p2[2] / sh.kpc; return num(sh.p2[0] + ' and ' + sh.p2[1] + ' are about ' + sh.p2[2] + ' km apart (straight line). How far apart are they on the map?', v, { unit: 'cm', dp: 1, alts: [al(sh.p2[2] * sh.kpc, 'u6l4-mul', 'Real → map: divide by ' + nS(sh.kpc) + '.')], sol: t(sh.p2[2] + '\\div ' + nS(sh.kpc) + '=' + nS(rd(v, 3))) + ' cm', hints: ['Divide the real distance by the km for 1 cm.'], text: 'map cm' }); } }] },
      { num: '8', stem: function (sh) { return 'A die-cast model motorcycle is built at a scale of ' + t('1:' + sh.n) + '.'; },
        shared: function (r) { return { n: r.pick([18, 24, 12, 18]), M: r.pick([12, 9.5, 11, 13]), H: r.pick([1.1, 1.2, 0.9, 1.3]) }; },
        parts: [
          { id: 'e8a', sub: 'a', level: 'PRG', make: function (r, sh) { var c = sh.M * sh.n, v = c / 100; return num('The model is ' + cm(sh.M) + ' long. How long is the real motorcycle, to the nearest tenth of a metre?', v, { unit: 'm', dp: 1, alts: [al(c, 'u6l4-unit-box', 'That’s in cm. Change to m (÷ 100).'), al(sh.M / sh.n, 'u6l4-div', 'The real motorcycle is bigger: multiply.')], sol: t(nS(sh.M) + '\\times ' + sh.n + '=' + nS(c)) + ' cm ' + t('=' + nS(v) + '\\text{ m}' + (ok2(v, 1) ? '' : '\\approx ' + nS(rd(v, 1)) + '\\text{ m}')), hints: ['Multiply by ' + sh.n + ', then change cm to m.'], text: 'motorcycle real' }); } },
          { id: 'e8b', sub: 'b', level: 'PRG', make: function (r, sh) { var v = sh.H * 100 / sh.n; return num('The real motorcycle is ' + nS(sh.H) + ' m tall. How tall is the model, to the nearest tenth of a centimetre?', v, { unit: 'cm', dp: 1, alts: [al(sh.H / sh.n, 'u6l4-no-conv', 'Change ' + nS(sh.H) + ' m to cm first.'), al(sh.H * 100 * sh.n, 'u6l4-mul', 'The model is smaller: divide by ' + sh.n + '.')], sol: t(nS(sh.H) + '\\text{ m}=' + nS(sh.H * 100) + '\\text{ cm}') + '; ' + t(nS(sh.H * 100) + '\\div ' + sh.n + '=' + nS(rd(v, 3)) + (ok2(v, 1) ? '' : '\\ldots\\approx ' + nS(rd(v, 1)))) + ' cm', hints: ['Change to cm, then divide by ' + sh.n + '.'], text: 'motorcycle model' }); } }] },
      { num: '9', stem: function (sh) { return 'Mr. Okafor wants to draw the school gym, ' + sh.L + ' m long and ' + sh.W + ' m wide, in a space ' + sh.Ls + ' cm long and ' + sh.Ws + ' cm wide.'; },
        shared: function (r) { return scaleShared(r, [[61, 26], [24, 15]]); },
        parts: [
          { id: 'e9a', sub: 'a', level: 'MAS', make: function (r, sh) { return scaleFields('Choose an easy scale so the gym fits. Write it in words and as a ratio.', sh, true); } },
          { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, sh) { var mk = function (lab, x) { return fld(lab, x / sh.s, { unit: 'cm', name: lab.replace(':', ''), alts: [al(x * sh.s, 'u6l4-mul', 'Real → drawing: divide by ' + nS(sh.s) + '.')] }); }; return fieldsPart('Use 1 cm represents ' + nS(sh.s) + ' m. Find the length and width of the gym on the drawing.', [mk('Length:', sh.L), mk('Width:', sh.W)], t(sh.L + '\\div ' + nS(sh.s) + '=' + nS(sh.L / sh.s)) + ' cm &nbsp; ' + t(sh.W + '\\div ' + nS(sh.s) + '=' + nS(sh.W / sh.s)) + ' cm', ['Divide each real length by ' + nS(sh.s) + '.'], 'gym drawing'); } }] },
      { num: '10', stem: function (sh) { return 'A plan for a garden shed uses the scale 1 in represents ' + sh.s + ' ft.'; },
        shared: function (r) { var s = r.pick([3, 2, 4]); return { s: s, L: s * r.pick([4, 5, 3]), W: s * r.pick([2, 3]), dr: r.pick([1.25, 1.75, 1.5, 0.75]) }; },
        parts: [
          { id: 'e10a', sub: 'a', level: 'EMG', make: function (r, sh) { var mk = function (lab, x) { return fld(lab, x / sh.s, { unit: 'in', name: lab.replace(':', ''), alts: [al(x * sh.s, 'u6l4-mul', 'Real → plan: divide by ' + sh.s + '.')] }); }; return fieldsPart('The shed is ' + sh.L + ' ft long and ' + sh.W + ' ft wide. Find its length and width on the plan.', [mk('Length:', sh.L), mk('Width:', sh.W)], t(sh.L + '\\div ' + sh.s + '=' + sh.L / sh.s) + ' in &nbsp; ' + t(sh.W + '\\div ' + sh.s + '=' + sh.W / sh.s) + ' in', ['Divide by ' + sh.s + '.'], 'shed plan'); } },
          { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, sh) { var ft = sh.dr * sh.s, F = Math.floor(ft + 1e-9), I = q((ft - F) * 12), decI = Math.round((ft - F) * 100);
            var fA = [al(ft, 'u6l4-ft-in', 'Write the whole feet here; the part of a foot goes in the inches box.')], iA = [al(decI, 'u6l4-ft-in', 'The decimal part of the feet is not inches: multiply it by 12.'), al(ft * 12, 'u6l4-ft-in', 'That’s the whole width in inches. Put the whole feet in the first box and the inches left over here.')];
            return fieldsPart('The door is ' + t(mixT(sh.dr)) + ' in wide on the plan. How wide is the real door, in feet and inches?', [fld('Feet:', F, { unit: 'ft', name: 'Feet', alts: fA }), fld('Inches:', I, { unit: 'in', name: 'Inches', alts: iA })],
              steps([t(mixT(sh.dr) + '\\times ' + sh.s + '=' + nS(sh.dr) + '\\times ' + sh.s + '=' + nS(ft)) + ' ft', t(nS(q(ft - F)) + '\\times 12=' + nS(I)) + ' in, so the door is ' + F + ' ft ' + nS(I) + ' in wide.']), ['Multiply by ' + sh.s + ' to get feet.', 'Change the part of a foot to inches: × 12.'], 'door ft in'); } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var R = r.pick([20, 12, 30, 15]), ns = r.pick([[50, 100, 200, 500], [25, 50, 100, 250], [20, 40, 100, 200]]), long = r.pick([true, true, false]), pick = long ? ns[0] : ns[3];
        return P.mc(r, 'A room is ' + R + ' m long. Which scale gives the <b>' + (long ? 'longest' : 'shortest') + '</b> drawing of the room?', ns.map(function (n) { return { html: t('1:' + n), right: n === pick, why: 'Work it out: ' + t(R * 100 + '\\div ' + n + '=' + nS(R * 100 / n)) + ' cm. The bigger the second number, the smaller the drawing.', code: 'u6l4-mc' }; }),
          ns.map(function (n) { return t('1:' + n) + ': ' + t(R * 100 + '\\div ' + n + '=' + nS(R * 100 / n)) + ' cm'; }).join('<br>') + '<br>The bigger the second number, the smaller the drawing.', ['Change ' + R + ' m to cm and divide by each scale number.'], 'longest drawing', true);
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'PRG', make: function (r) {
        var s = find(function () { return { n: r.pick([30000, 20000, 25000, 50000]), p: [r.pick([3.4, 2.6, 4.1, 1.8]), r.pick([2.8, 3.3, 1.9, 2.2]), r.pick([4.3, 3.7, 2.5, 1.6])] }; }, function (x) { var v = (x.p[0] + x.p[1] + x.p[2]) * x.n / 100000; return nS(q(v)).length <= 4; }, { n: 30000, p: [3.4, 2.8, 4.3] });
        var tot = q(s.p[0] + s.p[1] + s.p[2]), c = tot * s.n, v = c / 100000;
        return num('<b>Numerical response.</b> A map has a scale of ' + t('1:' + bigT(s.n)) + '. A bike route has three straight parts measuring ' + s.p.map(function (x) { return cm(x); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' on the map. The real length of the route, in kilometres, is ____.', v, { nr: true, alts: [al(c / 1000, 'u6l4-unit-box', 'That’s in metres. Change cm to km: ÷ 100 000.'), al(c / 10000, 'u6l4-conv', '1 km = 100 000 cm.'), al(s.p[0] * s.n / 100000, 'u6l4-reason', 'Add all three parts first.')], sol: steps([t(s.p.map(nS).join('+') + '=' + nS(tot)) + ' cm', t(nS(tot) + '\\times ' + bigT(s.n) + '=' + bigT(c)) + ' cm ' + t('=' + nS(v)) + ' km']), hints: ['Add the parts, multiply by ' + big(s.n) + ', then change cm to km.'], text: 'route NR' });
      } }] },

      /* ---- C. Stretch ---- */
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'Plan A of a house is drawn at ' + t('1:' + sh.a) + '. Plan B of the same house is drawn at ' + t('1:' + sh.b) + '. A living room is ' + sh.R + ' m long.'; },
        shared: function (r) { var pr = r.pick([[50, 200], [25, 100], [50, 250], [20, 100], [100, 400]]); return { a: pr[0], b: pr[1], R: r.pick([5, 4, 6, 8]) }; },
        parts: [
          { id: 'e13a', sub: 'a', level: 'EMG', make: function (r, sh) { var c = sh.R * 100; return fieldsPart('How long is the living room on each plan?', [fld('Plan A:', c / sh.a, { unit: 'cm', name: 'Plan A', alts: [al(sh.R / sh.a, 'u6l4-no-conv', 'Change ' + sh.R + ' m to cm first.'), al(c / sh.b, 'u6l4-reason', 'That’s Plan B. Plan A uses ' + t('1:' + sh.a) + '.')] }), fld('Plan B:', c / sh.b, { unit: 'cm', name: 'Plan B', alts: [al(sh.R / sh.b, 'u6l4-no-conv', 'Change ' + sh.R + ' m to cm first.'), al(c / sh.a, 'u6l4-reason', 'That’s Plan A. Plan B uses ' + t('1:' + sh.b) + '.')] })],
            t(sh.R + '\\text{ m}=' + c + '\\text{ cm}') + '. Plan A: ' + t(c + '\\div ' + sh.a + '=' + nS(c / sh.a)) + ' cm. Plan B: ' + t(c + '\\div ' + sh.b + '=' + nS(c / sh.b)) + ' cm.', ['Change to cm, then divide by each scale number.'], 'two plans'); } },
          { id: 'e13b', sub: 'b', level: 'PRG', make: function (r, sh) { var k = sh.b / sh.a; return num('How many times longer is every length on Plan A than on Plan B?', k, { alts: [al(sh.a / sh.b, 'u6l4-flip', 'Plan A is the bigger drawing: divide Plan A’s length by Plan B’s.'), al(sh.b - sh.a, 'u6l4-times', '“How many times” means divide.')], sol: t(nS(sh.R * 100 / sh.a) + '\\div ' + nS(sh.R * 100 / sh.b) + '=' + nS(k)) + ' times. Each real length is divided by ' + sh.a + ' on Plan A but by ' + sh.b + ' on Plan B, and ' + t(sh.b + '\\div ' + sh.a + '=' + nS(k)) + '.', hints: ['Divide your two answers from (a).'], text: 'times longer' }); } }] },
      { num: '14', stem: function (sh) { return 'On a ' + t('1:' + sh.n) + ' floor plan, a bedroom is ' + cm(sh.p) + ' by ' + cm(sh.w) + '.'; },
        shared: function (r) { return find(function () { return { n: r.pick([100, 100, 50]), p: r.pick([4, 4.5, 5, 3.6, 4.2]), w: r.pick([3.5, 3, 3.2, 2.8]) }; }, function (x) { return x.w < x.p && decs(x.p * x.w) <= 2; }, { n: 100, p: 4, w: 3.5 }); },
        parts: [
          { id: 'e14a', sub: 'a', level: 'EMG', make: function (r, sh) { var pa = q(sh.p * sh.w), meg = pa * sh.n; return P.mc(r, 'Meg finds the plan area, ' + t(nS(sh.p) + '\\times ' + nS(sh.w) + '=' + nS(pa) + '\\text{ cm}^2') + ', and multiplies by ' + sh.n + ' to get ' + t(nS(meg) + '\\text{ cm}^2') + ', or ' + t(nS(meg / 10000) + '\\text{ m}^2') + '. Why is her answer not reasonable?', [
              { html: nS(meg / 10000) + ' m² is smaller than a doormat. A bedroom is many square metres.', right: true }, { html: 'She should have divided by ' + sh.n + ' instead.', why: 'Dividing would make it even smaller. Think about how big a bedroom floor really is.', code: 'u6l4-reason' },
              { html: 'Areas can’t be found from a plan.', why: 'They can: change the lengths to real lengths first, then multiply.', code: 'u6l4-reason' }, { html: 'She should have added the two lengths.', why: 'Area is length × width. The problem is the size of her answer.', code: 'u6l4-reason' }],
              nS(meg / 10000) + ' m² is smaller than a doormat. A bedroom is many square metres.', ['Picture ' + nS(meg / 10000) + ' m². Could a bed fit?'], 'Meg check'); } },
          { id: 'e14b', sub: 'b', level: 'PRG', make: function (r, sh) { var m = sh.n / 100, A = q(sh.p * m * sh.w * m); return num('Find the real area correctly.', A, { unit: 'm²', alts: [al(sh.p * sh.w * sh.n / 10000, 'u6l4-area-scale', 'That’s Meg’s answer. Change the <b>lengths</b> to real lengths first, then multiply.'), al(sh.p * sh.w * m, 'u6l4-area-scale', 'Change both lengths to real lengths first, then multiply.'), al(2 * (sh.p + sh.w) * m, 'u6l4-perim', 'Area = length × width.')], sol: 'Real lengths first: ' + nS(sh.p * m) + ' m by ' + nS(sh.w * m) + ' m. ' + t('A=' + nS(sh.p * m) + '\\times ' + nS(sh.w * m) + '=' + nS(A) + '\\text{ m}^2') + '.', hints: [t('1:' + sh.n) + ': 1 cm represents ' + nS(m) + ' m. Change both lengths first.'], text: 'real area' }); } },
          { id: 'e14c', sub: 'c', level: 'ADV', make: function (r, sh) { var k = sh.n * sh.n; return num('The real area is how many times the plan area? (Hint: 1 m² = 10 000 cm².)', k, { alts: [al(sh.n, 'u6l4-area-scale', 'Areas don’t grow by the scale. Change the real area to cm² and divide by the plan area.'), al(2 * sh.n, 'u6l4-area-scale', 'It’s the length scale times <b>itself</b>.')], sol: t(nS(q(sh.p * sh.w * sh.n * sh.n / 10000)) + '\\text{ m}^2=' + bigT(q(sh.p * sh.w * sh.n * sh.n)) + '\\text{ cm}^2') + '; ' + t(bigT(q(sh.p * sh.w * sh.n * sh.n)) + '\\div ' + nS(q(sh.p * sh.w)) + '=' + bigT(k)) + ' times. That is ' + t(sh.n + '\\times ' + sh.n) + ': the length scale times itself.', hints: ['Change the real area from (b) to cm² (× 10 000).', 'Divide by the plan area.'], text: 'area times' }); } }] },
      { num: '15', stem: function (sh) { return 'Two maps show the same provincial park. Map A has a scale of ' + t('1:' + bigT(sh.a)) + '. Map B has a scale of ' + t('1:' + bigT(sh.b)) + '.'; },
        shared: function (r) { return find(function () { var pr = r.pick([[25000, 10000], [50000, 20000], [50000, 10000], [40000, 10000]]); return { a: pr[0], b: pr[1], d: r.pick([8, 6, 4, 5, 7]) }; }, function (x) { return ok2(x.d * x.a / 100000, 2); }, { a: 25000, b: 10000, d: 8 }); },
        parts: [
          { id: 'e15a', sub: 'a', level: 'EMG', make: function (r, sh) { var c = sh.d * sh.a, v = c / 100000; return num('A trail is ' + cm(sh.d) + ' long on Map A. How long is the real trail, in kilometres?', v, { unit: 'km', alts: [al(c / 1000, 'u6l4-unit-box', 'That’s in metres. Change cm to km (÷ 100 000).'), al(c / 10000, 'u6l4-conv', '1 km = 100 000 cm.')], sol: t(sh.d + '\\times ' + bigT(sh.a) + '=' + bigT(c)) + ' cm ' + t('=' + nS(v)) + ' km', hints: ['Multiply, then change cm to km.'], text: 'map A' }); } },
          { id: 'e15b', sub: 'b', level: 'PRG', make: function (r, sh) { var c = sh.d * sh.a, v = c / sh.b; return num('How long is the same trail on Map B?', v, { unit: 'cm', alts: [al(sh.d, 'u6l4-reason', 'Map B has a different scale, so the trail is a different length on it.'), al(c * sh.b / 100000 / 100000, 'u6l4-mul', 'Real → map: divide the real length (in cm) by ' + big(sh.b) + '.'), al(sh.d * sh.b / sh.a, 'u6l4-flip', 'Map B shows things <b>bigger</b> (1 cm for less ground). Find the real length in cm, then divide by ' + big(sh.b) + '.')], sol: t(bigT(c) + '\\div ' + bigT(sh.b) + '=' + nS(v)) + ' cm', hints: ['Use the real length in cm from (a), then divide by ' + big(sh.b) + '.'], text: 'map B' }); } },
          { id: 'e15c', sub: 'c', level: 'EMG', make: function (r, sh) { return P.mc(r, 'Which map would you use to find a campsite in a small area? Which would you use to plan a long drive?', [
              { html: 'Map B for the campsite (things are drawn bigger, so it shows more detail); Map A for the long drive (it fits a bigger area on one page).', right: true },
              { html: 'Map A for the campsite; Map B for the long drive.', why: 'Map B (' + t('1:' + bigT(sh.b)) + ') draws everything bigger: better for detail. Map A covers more ground.', code: 'u6l4-reason' },
              { html: 'Either map for both: they show the same park.', why: 'They show it at different sizes. Which one shows more detail?', code: 'u6l4-reason' },
              { html: 'Map A for both, because its scale number is bigger.', why: 'A bigger scale number means everything is drawn <b>smaller</b>: less detail.', code: 'u6l4-reason' }],
              'Map B for the campsite: everything is drawn bigger, so it shows more detail. Map A for a long drive: it fits a bigger area on one page.', ['Which map draws the trail longer?'], 'which map'); } }] }
    ]
  });
})(window);
