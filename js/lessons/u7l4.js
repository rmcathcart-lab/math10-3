/* Math 10-3 · Unit 7 · Lesson 4 — Similar Right Triangles and the Tangent Ratio (G4; A1 when the unknown is on the bottom)
 * Assignment 4 (u7_l04.tex, Questions 1–18) and the Lesson 4 Extra Practice (u7_ep04.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the booklet situation with new numbers around the booklet's (the booklet's own numbers can
 * come up; the lesson's worked-example numbers — the 35° triangles 1.4/2.0, 2.1/3.0, 3.5/5.0, the tan table 10°–80°, the
 * 8-15-17 triangle, 27°/9.0, 58°/3.5, the 63°/45 m tower, 40°/6.3, 66°/12, the 4.8°/0.48 m ramp, 52°/8 m — are left out).
 * Calculator allowed, in DEG mode. Figures from the shared kit HW.geo (rightTriSVG, elevationSVG) and HW.fig.
 * Answers: lengths to the nearest tenth (hundredths where the booklet asks), tangents to 4 decimal places, opp ÷ adj in the
 * similar-triangle tables to 2 decimal places. The length checks are HW.geo.lenChk with the tan set-up: RAD mode, × instead
 * of ÷ (and back), tan θ ÷ side, sin or cos instead of tan, rounding tan θ too early (a nudge, no try used); each has its
 * own hint. Tangent values: RAD mode, the ratio upside down (adj ÷ opp), the hyp used. Similar-triangle tables: opp and
 * adj swapped in the turned triangle, adj ÷ opp.
 * Conversions:
 *   "write opp, adj or hyp beside each side" and the PQR naming table → a tap table (sides × opp / adj / hyp);
 *   "why are the triangles similar / why is the ratio the same / what is wrong / who is right" → multiple choice of reasons;
 *   the similar-triangle and tan tables → the fill-in table (HW.pctKit.tablePart); "write tan as a fraction and a decimal"
 *   → a fraction box and a decimal box each; "Write tan P and tan Q as ratios of sides" → multiple choice;
 *   "steeper or less steep? Explain using tangents" → the two tangents in boxes and a word box (steeper / less steep);
 *   "gentler or steeper than 1:12? Explain" → multiple choice of reasons.
 * Levels: LIM BEG EMG PRG ADV MAS. MAS: Q12(b) (the height kept from (a), then the new distance and how much farther back;
 * A1), Extra 12 (A-frame tent from half the base; G4).
 * Outcome G4; parts where the unknown is on the bottom of the ratio (x = side ÷ tan θ) are A1.
 * Exports HW.u7tan (side-from-tan part with worked lines and the 45° check, the opp/adj/hyp tap table, tan tables, ratio
 * fraction/decimal checkers) for later Unit 7 lessons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P, PK = HW.pctKit;
  if (!G || !G.lenChk || !PK || !PK.tablePart) throw new Error('u7l4 needs HW.geo (js/geokit.js) and HW.pctKit (u1l7.js) loaded first');
  var RADc = Math.PI / 180;

  /* ================= numbers and words ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b)); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function rawN(x, k) { var s = +x.toFixed(k || 3); return HW.fmt(String(s)) + (same(x, s) ? '' : '\\ldots'); }
  function toN(x, dp) { return same(x, rd(x, dp)) ? '=' + fx(x, dp) : '=' + rawN(x, dp >= 2 ? 4 : 3) + '\\approx ' + fx(x, dp); }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7l4: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, lo, hi, st) { return q(lo + st * r.int(0, Math.round((hi - lo) / st))); }
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function uT(u) { return u ? '\\text{ ' + u + '}' : ''; }
  function L(x, u) { return t(N(x) + uT(u)); }
  function Lf(x, dp, u) { return t(fx(x, dp) + uT(u)); }                    // a rounded length, trailing zeros kept
  function lab(x, u) { return nS(x) + (u ? ' ' + u : ''); }
  function dg(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dg(x)); }
  function TAN(d) { return Math.tan(d * RADc); }
  function fr(a, b) { return '\\dfrac{' + a + '}{' + b + '}'; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Priya', 'f'], ['Liam', 'm'], ['Hana', 'f'], ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'],
    ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Jaya', 'f'], ['Zoe', 'f'], ['Sam', 'm']];
  function person(r) { var p = r.pick(NAMES); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  /* worked-example (angle, side) pairs that are left out */
  var WORKED = [[27, 9], [58, 3.5], [63, 45], [40, 6.3], [66, 12], [4.8, 0.48], [52, 8], [35, 10]];
  function worked(deg, side) { return WORKED.some(function (w) { return same(w[0], deg) && same(w[1], side); }); }

  /* ================= reading answers ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1);
    s = s.replace(/\\approx|≈/g, ' ').replace(/\\[,;: !]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z°²³][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d*,\d{1,4}$/.test(s.replace(/\s/g, ''))) return { res: form('u7l4-comma', 'Use a decimal point (not a comma), like 0.4663.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  var RAD_HINT = G.RAD_HINT || 'Your calculator is in <b>RAD</b> mode. Press <b>DRG</b> until <b>DEG</b> shows on the screen.';
  /* tan θ (or any ratio) to 4 decimal places. alts: [{ v, code, hint }] */
  function tan4Chk(val, alts) { return K.near(val, 4, { alts: alts || [] }); }
  function tanAlts(deg) { return [{ v: Math.tan(deg), code: 'trig-rad', hint: RAD_HINT }, { v: Math.sin(deg * RADc), code: 'trig-wrong-ratio', hint: 'Press <b>tan</b>, not sin.' }, { v: Math.cos(deg * RADc), code: 'trig-wrong-ratio', hint: 'Press <b>tan</b>, not cos.' }, { v: 1 / TAN(deg), code: 'trig-upside', hint: 'Find tan θ itself: press <b>tan</b>, the angle, <b>)</b>, <b>ENTER</b>.' }]; }
  /* opp ÷ adj from a table, to 2 decimal places: any right rounding of the exact ratio with 2–4 decimals */
  function ratio2Chk(ex) {
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (same(v, ex) || (a.d >= 2 && a.d <= 4 && same(v, rd(ex, a.d)))) return ok();
      if (a.d > 4 && Math.abs(v - ex) < 1e-4) return form('round', 'Right — now round it to 2 decimal places.');
      if (Math.abs(v - 1 / ex) < 0.006) return wrong('trig-upside', 'Upside down: it is <b>opp ÷ adj</b> (the side across from the angle on top).');
      if (a.d < 2 && Math.abs(v - ex) < 0.06) return form('places', 'Round to 2 decimal places.');
      return wrong('value', null);
    };
  }
  /* a fraction box (opp over adj) */
  function fracChk(num, den, o) {
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim(); if (!s) return form('empty', 'Type your answer first.');
      var a = K.read(s); if (a.res) return a.res;
      var v = a.val, isFr = /\\[dt]?frac|\//.test(s);
      if (!isFinite(v)) return form('notnumber', 'Type a fraction, like 3/4.');
      if (same(v, num / den) || (!isFr && Math.abs(v - num / den) < 0.0006)) return isFr ? ok() : form('u7l4-as-fraction', 'Right value — now write it as a <b>fraction</b>: opp over adj.');
      if (same(v, den / num)) return wrong('trig-upside', 'Upside down: tan = <b>opp ÷ adj</b>. Put the side across from the angle on top.');
      if (o.hyp && (same(v, num / o.hyp) || same(v, den / o.hyp) || same(v, o.hyp / den) || same(v, o.hyp / num))) return wrong('u7l4-hyp', 'tan never uses the <b>hyp</b>: it is opp ÷ adj.');
      return wrong('value', null);
    };
  }
  /* a decimal box for opp ÷ adj, 4 places */
  function dec4Chk(num, den, o) {
    o = o || {};
    var alts = [{ v: den / num, code: 'trig-upside', hint: 'Upside down: tan = <b>opp ÷ adj</b>. Put the side across from the angle on top.' }];
    if (o.hyp) alts.push({ v: num / o.hyp, code: 'u7l4-hyp', hint: 'tan never uses the <b>hyp</b>: it is opp ÷ adj.' }, { v: den / o.hyp, code: 'u7l4-hyp', hint: 'tan never uses the <b>hyp</b>: it is opp ÷ adj.' });
    var near = K.near(num / den, 4, { alts: alts });
    return function (resp) { if (/\\[dt]?frac|\//.test(String(resp || ''))) return form('u7l4-as-decimal', 'Now as a <b>decimal</b>: divide, and round to 4 decimal places.'); return near(resp); };
  }
  function wordSteep(want) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var w = /^(less|not as|gentler|shallower|flatter|lower|less steep|not steeper|less steeper)/.test(s) ? 'less' : /^(steeper|more steep|more|steep|stepper)/.test(s) ? 'more' : null;
      if (!w) return form('u7l4-word', 'Type <b>steeper</b> or <b>less steep</b>.');
      return w === want ? ok() : wrong('u7l4-steep', 'The bigger tangent belongs to the bigger (steeper) angle. Compare the two tangents.');
    };
  }
  HW.addCodes({ 'u7l4-comma': 'Decimal comma', 'u7l4-as-fraction': 'Gave a decimal where a fraction was asked', 'u7l4-as-decimal': 'Gave a fraction where a decimal was asked', 'u7l4-hyp': 'Used the hypotenuse in tan',
    'u7l4-word': 'Answer not steeper/less steep', 'u7l4-steep': 'Compared the tangents the wrong way', 'u7l4-swap': 'Swapped opp and adj', 'u7l4-role': 'Mislabelled a side (opp/adj/hyp)', 'u7l4-full-base': 'Used the whole base instead of half',
    'u7l4-round-early': 'Rounded the height too early', 'u7l4-total': 'Gave the new distance instead of how much farther', 'u7l4-ratio-table': 'Used the table ratio' });

  /* ================= figures ================= */
  /* a right triangle with the angle θ (deg) at A: opp = a, adj = b (numbers for the shape), labels { opp, adj, hyp },
   * unknown 'a' | 'b' | 'c'. o: right ('bl' default), rot, flip, names, thetaLabel, width */
  function trigFig(deg, labs, o) {
    o = o || {}; var b = 4, a = b * TAN(deg); if (a > 7) { a = 7; b = a / TAN(deg); }
    var sides = {}; if (labs.opp != null) sides.a = labs.opp; if (labs.adj != null) sides.b = labs.adj; if (labs.hyp != null) sides.c = labs.hyp;
    return G.rightTriSVG({ a: a, b: b, right: o.right || 'bl', rot: o.rot || 0, flip: !!o.flip, names: o.names || false, theta: 'A', thetaLabel: o.thetaLabel || dg(deg).replace('^\\circ', '°'), sides: sides, unknown: o.unknown, width: o.width || 250, px: o.px || 170 });
  }
  function orient(r) { return { right: r.pick(['bl', 'br', 'tl', 'tr']), flip: r.chance(0.3), rot: r.chance(0.3) ? r.int(-30, 30) : 0 }; }

  /* ================= part builders ================= */
  var TAN_HINTS_MUL = ['Label opp and adj from the angle. Write tan θ = opp ÷ adj and put in what you know.', t('x') + ' on the <b>top</b>: multiply. Type it in one go: side × tan(angle).'];
  var TAN_HINTS_DIV = ['Label opp and adj from the angle. Write tan θ = opp ÷ adj and put in what you know.', t('x') + ' on the <b>bottom</b>: divide. Type it in one go: side ÷ tan(angle).'];
  /* a side from tan. op 'mul': x = side × tan θ (x is opp); 'div': x = side ÷ tan θ (x is adj). o: unit, dp, name, lead, end, check (45° line), text, nr, alts */
  function tanSol(deg, side, op, o) {
    o = o || {}; var nm = o.name || 'x', dp = o.dp == null ? 1 : o.dp, v = op === 'mul' ? side * TAN(deg) : side / TAN(deg), u = o.unit;
    var lines = [o.lead || ('From ' + D(deg) + ': ' + (op === 'mul' ? t(nm) + ' is opp, ' + L(side, u) + ' is adj.' : L(side, u) + ' is opp, ' + t(nm) + ' is adj.')),
      t('\\tan ' + dg(deg) + '=' + (op === 'mul' ? fr(nm, N(side)) : fr(N(side), nm))),
      op === 'mul' ? t(nm + '=' + N(side) + '\\times\\tan ' + dg(deg)) + ' &nbsp;(' + t(nm) + ' on top: multiply)' : t(nm + '=' + fr(N(side), '\\tan ' + dg(deg))) + ' &nbsp;(' + t(nm) + ' on the bottom: divide)',
      t(nm + toN(v, dp)) + (u ? ' ' + u : ''),
      o.end || null];
    if (o.check !== false && Math.abs(deg - 45) > 2) {
      var big = deg > 45; // opp longer than adj
      lines.push('Check: ' + D(deg) + (big ? ' > ' : ' < ') + t('45^\\circ') + ', so opp is ' + (big ? 'longer' : 'shorter') + ' than adj: ' + (op === 'mul' ? t(fx(v, dp) + (big ? '>' : '<') + N(side)) : t(N(side) + (big ? '>' : '<') + fx(v, dp))) + ' ✓');
    }
    return br(lines);
  }
  function tanPart(prompt, deg, side, op, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, v = op === 'mul' ? side * TAN(deg) : side / TAN(deg);
    var p = GP.len(prompt, v, { dp: dp, unit: o.unit, nr: o.nr, trig: { fn: 'tan', deg: deg, side: side, op: op }, alts: o.alts, sol: o.sol || tanSol(deg, side, op, o), hints: o.hints || (op === 'mul' ? TAN_HINTS_MUL : TAN_HINTS_DIV), text: o.text || ('tan ' + op) });
    if (!o.nr && o.before !== false) p.input.before = t((o.name || 'x') + '=');
    return p;
  }
  /* label each side opp / adj / hyp: a tap table. The triangle: θ at A, legs a (opp) and b (adj) drawn with lengths. */
  var ROLE_COLS = [{ id: 'opp', html: 'opp' }, { id: 'adj', html: 'adj' }, { id: 'hyp', html: 'hyp' }];
  function roleWhy(row, got, want) {
    if (want === 'hyp') return { code: 'u7l4-role', hint: 'The <b>hyp</b> is across from the right angle (the box). It is the longest side.' };
    if (got === 'hyp') return { code: 'u7l4-role', hint: 'Only the side across from the right angle is the hyp. The hyp touches θ too, but it is never called adj.' };
    if (want === 'opp') return { code: 'u7l4-swap', hint: 'The <b>opp</b> side is across from θ: it does not touch θ.' };
    return { code: 'u7l4-swap', hint: 'The <b>adj</b> side touches θ and is not the hyp.' };
  }
  function labelPart(r, prompt, legs, o) {
    o = o || {}; var a = legs[0], b = legs[1], c = rd(Math.sqrt(a * a + b * b), 1), u = o.unit || 'cm', deg = Math.atan2(a, b) / RADc;
    var fig = G.rightTriSVG({ a: a, b: b, right: o.right || 'bl', rot: o.rot || 0, flip: !!o.flip, names: false, theta: 'A', thetaLabel: 'θ', sides: { a: lab(a, u), b: lab(b, u), c: lab(c, u) }, width: 250, px: 170 });
    var rows = r.shuffle([{ id: 'a', html: 'the ' + lab(a, u) + ' side' }, { id: 'b', html: 'the ' + lab(b, u) + ' side' }, { id: 'c', html: 'the ' + lab(c, u) + ' side' }]);
    var want = { a: 'opp', b: 'adj', c: 'hyp' };
    return P.grid(prompt + fig, rows, ROLE_COLS, want, { why: roleWhy, rowHead: 'Side' },
      'The ' + lab(c, u) + ' side is across from the right angle: <b>hyp</b>.<br>The ' + lab(a, u) + ' side is across from θ: <b>opp</b>.<br>The ' + lab(b, u) + ' side touches θ and is not the hyp: <b>adj</b>.',
      ['Step 1: across from the right angle → hyp. Step 2: across from θ → opp. Step 3: the last side → adj.'], 'label sides');
  }
  /* the similar-triangle table: three triangles with the same angle (drawn in different turns), opp, adj and opp ÷ adj */
  function nicePair(deg) {   // a small fraction p/q with the same 2-place rounding as tan(deg)
    var T = TAN(deg), best = null;
    for (var qq = 2; qq <= 20; qq++) { var pp = Math.round(T * qq); if (pp < 1) continue; var v = pp / qq; if (rd(v, 2) === rd(T, 2) && (!best || qq < best[1])) best = [pp, qq]; }
    return best;
  }
  function simTable(r, deg, o) {
    o = o || {}; var pq = nicePair(deg), p = pq[0], qq = pq[1], ratio = p / qq;
    var scales = find(function () { return r.sample([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5], 3).sort(function (x, y) { return x - y; }); }, function (s) {
      return s.every(function (z) { var A = q(qq * z), O = q(p * z); return A >= 1.5 && O >= 1 && A <= 12 && O <= 12 && same(A * 10, Math.round(A * 10)) && same(O * 10, Math.round(O * 10)); }) && !(deg === 35);
    });
    var tris = scales.map(function (z) { return { opp: q(p * z), adj: q(qq * z) }; });
    return { deg: deg, p: p, q: qq, ratio: ratio, r2: rd(ratio, 2), tris: tris };
  }
  function simFigs(S, u) {
    var opts = [{ right: 'br', flip: false }, { right: 'bl', flip: false }, { right: 'tl', flip: true }];
    return '<div style="display:flex;flex-wrap:wrap;gap:8px 18px;align-items:flex-end;margin:6px 0">' + S.tris.map(function (tr, i) {
      var turn = i === 2 ? { right: 'bl', rot: 90 } : opts[i];
      var fig = G.rightTriSVG({ a: tr.opp, b: tr.adj, right: turn.right, rot: turn.rot || 0, flip: turn.flip, names: false, theta: 'A', thetaLabel: S.deg + '°', sides: { a: lab(tr.opp, u), b: lab(tr.adj, u) }, width: 200, px: 60 + 14 * Math.max(tr.opp, tr.adj) });
      return '<div style="text-align:center;flex:0 1 auto">' + fig + '<div style="font-weight:600">Triangle ' + (i + 1) + '</div></div>';
    }).join('') + '</div>';
  }
  function simTablePart(prompt, S, u) {
    var rows = ['\\text{opp (' + u + ')}', '\\text{adj (' + u + ')}', '\\text{opp}\\div\\text{adj}'], cols = ['\\text{Triangle 1}', '\\text{Triangle 2}', '\\text{Triangle 3}'];
    var blanks = [], cells = [[], [], []];
    S.tris.forEach(function (tr, j) {
      cells[0].push(nS(tr.opp)); cells[1].push(nS(tr.adj)); cells[2].push(S.r2.toFixed(2));
      var sw = 'In Triangle ' + (j + 1) + ', the opp side is across from the ' + S.deg + '° angle; the adj side touches it.';
      blanks.push({ where: 'cell', i: 0, j: j, name: 'Triangle ' + (j + 1) + ' opp', chk: function (resp) { var a = readNum(resp); if (a.res) return a.res; if (same(a.v, tr.opp)) return ok(); if (same(a.v, tr.adj)) return wrong('u7l4-swap', sw); return wrong('value', 'Read the length of the side across from the ' + S.deg + '° angle.'); } });
      blanks.push({ where: 'cell', i: 1, j: j, name: 'Triangle ' + (j + 1) + ' adj', chk: function (resp) { var a = readNum(resp); if (a.res) return a.res; if (same(a.v, tr.adj)) return ok(); if (same(a.v, tr.opp)) return wrong('u7l4-swap', sw); return wrong('value', 'Read the length of the leg that touches the ' + S.deg + '° angle.'); } });
      blanks.push({ where: 'cell', i: 2, j: j, name: 'Triangle ' + (j + 1) + ' opp ÷ adj', chk: ratio2Chk(S.ratio) });
    });
    return PK.tablePart(prompt, { rows: rows, cols: cols, cells: [[null, null, null], [null, null, null], [null, null, null]], corner: '\\phantom{x}', keys: 'pctkit-money', help: 'Tap a box, then type the number. Round opp ÷ adj to 2 decimal places.' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: cells },
      S.tris.map(function (tr, j) { return 'Triangle ' + (j + 1) + ': opp ' + lab(tr.opp, u) + ', adj ' + lab(tr.adj, u) + ', ' + t(N(tr.opp) + '\\div ' + N(tr.adj) + toN(S.ratio, 2)); }).join('<br>') + '<br>In Triangle 3 the triangle is turned: the opp side is still the one across from the ' + S.deg + '° angle.',
      ['opp is across from the ' + S.deg + '° angle; adj touches it (and is not the hyp).', 'opp ÷ adj: divide the opp length by the adj length.'], 'similar table');
  }
  /* a fill-in table of tan values to 4 decimal places */
  function tanTablePart(prompt, degs) {
    var rows = ['\\tan\\theta'], cols = degs.map(function (d) { return d + '^\\circ'; });
    var blanks = degs.map(function (d, j) { return { where: 'cell', i: 0, j: j, name: 'tan ' + d + '°', chk: tan4Chk(TAN(d), tanAlts(d)) }; });
    return PK.tablePart(prompt, { rows: rows, cols: cols, cells: [degs.map(function () { return null; })], corner: '\\theta', keys: 'pctkit-money', help: 'Tap a box, then type the value to 4 decimal places.' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: [degs.map(function (d) { return TAN(d).toFixed(4); })] },
      degs.map(function (d) { return t('\\tan ' + dg(d) + '=' + rawN(TAN(d), 6).replace('\\ldots', '') + '\\ldots\\approx ' + TAN(d).toFixed(4)); }).join('<br>'),
      ['Press <b>tan</b>, the angle, <b>)</b>, <b>ENTER</b>. Check the screen says DEG.', 'Round to 4 decimal places.'], 'tan table');
  }
  /* tan of each acute angle as a fraction and a decimal. names: [A, B, C] with the right angle at C; legs: BC = a (opp A), AC = b */
  function tanFracPart(prompt, nm, a, b, c) {
    var A = nm[0], B = nm[1], C = nm[2];
    return P.fields(prompt, [
      { label: t('\\tan ' + A + '='), mode: 'math', keys: 'fraction', name: 'tan ' + A + ' (fraction)' }, { label: t('\\tan ' + A + '\\approx'), name: 'tan ' + A + ' (decimal)' },
      { label: t('\\tan ' + B + '='), mode: 'math', keys: 'fraction', name: 'tan ' + B + ' (fraction)' }, { label: t('\\tan ' + B + '\\approx'), name: 'tan ' + B + ' (decimal)' }],
      [fracChk(a, b, { hyp: c }), dec4Chk(a, b, { hyp: c }), fracChk(b, a, { hyp: c }), dec4Chk(b, a, { hyp: c })],
      [fr(a, b), (a / b).toFixed(4), fr(b, a), (b / a).toFixed(4)],
      t('\\tan ' + A + '=' + fr(a, b) + '\\approx ' + (a / b).toFixed(4)) + ', &nbsp;' + t('\\tan ' + B + '=' + fr(b, a) + '\\approx ' + (b / a).toFixed(4)),
      br(['From ' + t('\\angle ' + A) + ': opp ' + t('=' + B + C + '=' + a) + ', adj ' + t('=' + A + C + '=' + b) + '. &nbsp;' + t('\\tan ' + A + '=' + fr(a, b) + '\\approx ' + (a / b).toFixed(4)),
        'From ' + t('\\angle ' + B) + ': opp ' + t('=' + A + C + '=' + b) + ', adj ' + t('=' + B + C + '=' + a) + '. &nbsp;' + t('\\tan ' + B + '=' + fr(b, a) + '\\approx ' + (b / a).toFixed(4)),
        '(The hyp, ' + t(A + B + '=' + c) + ', is not used.)']),
      ['tan = opp ÷ adj. From each angle, opp is the side across from it.', 'The two tangents are each other turned upside down.'], 'tan fractions');
  }

  /* kit for later Unit 7 lessons (7.5–7.9, the review): HW.u7tan */
  HW.u7tan = { readNum: readNum, tanPart: tanPart, tanSol: tanSol, trigFig: trigFig, labelPart: labelPart, roleWhy: roleWhy, ROLE_COLS: ROLE_COLS, tanTablePart: tanTablePart, tanFracPart: tanFracPart, fracChk: fracChk, dec4Chk: dec4Chk, tan4Chk: tan4Chk, tanAlts: tanAlts, ratio2Chk: ratio2Chk };

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u7l4', unit: 7, num: '4', title: 'Similar Right Triangles and the Tangent Ratio', outcome: 'G4',
    blurb: 'Naming opp, adj and hyp from an angle, why opp ÷ adj is the same in similar right triangles, the tan key, and finding a side with tan (multiply when x is on top, divide when x is on the bottom).',
    questions: [
      /* ---------- 1. label opp / adj / hyp ---------- */
      { num: '1', stem: 'Mark each side <b>opp</b>, <b>adj</b> or <b>hyp</b>. Use the angle marked θ.', parts: [['a', 'BEG', 'br', false, 0], ['b', 'BEG', 'tr', true, 0], ['c', 'EMG', 'bl', false, 1]].map(function (z) {
        return { id: '1' + z[0], level: z[1], make: function (r) {
          var legs = find(function () { return [r.int(3, 12), r.int(3, 12)]; }, function (s) { return Math.abs(s[0] - s[1]) >= 2; });
          return labelPart(r, '(' + z[0] + ')', legs, { right: z[2], flip: z[3], rot: z[4] ? r.pick([-150, -120, 140, 160, 35]) : 0 });
        } };
      }) },
      /* ---------- 2. PQR: name the sides ---------- */
      { num: '2', stem: function (sh) { var N3 = sh.n; return 'In ' + t('\\triangle ' + N3.join('')) + ', ' + t('\\angle ' + N3[2] + '=90^\\circ') + '. Name each side with two letters.' + G.rightTriSVG({ a: sh.a, b: sh.b, right: sh.right, flip: sh.flip, names: [N3[0], N3[1], N3[2]], width: 220, px: 150 }); },
        shared: function (r) {
          var sets = ['PQR', 'DEF', 'JKL', 'STU', 'XYZ', 'GHK', 'LMN', 'UVW'], s = r.pick(sets).split(''), ri = r.int(0, 2), R0 = s[ri], others = s.filter(function (c, i) { return i !== ri; });
          if (r.chance(0.5)) others.reverse();
          return { n: [others[0], others[1], R0], a: r.int(5, 9) / 2, b: r.int(5, 9) / 2, right: r.pick(['bl', 'br', 'tl']), flip: r.chance(0.3) };
        },
        parts: [0, 1].map(function (k) {
          return { id: '2' + 'ab'[k], level: k ? 'EMG' : 'BEG', make: function (r, sh) {
            var A = sh.n[0], B = sh.n[1], C = sh.n[2], V = k ? B : A, sd = function (x, y) { return [x, y].sort().join(''); };
            var BC = sd(B, C), AC = sd(A, C), AB = sd(A, B), opp = k ? AC : BC, adj = k ? BC : AC;
            var rows = r.shuffle([{ id: BC, html: t(BC) }, { id: AC, html: t(AC) }, { id: AB, html: t(AB) }]), want = {}; want[opp] = 'opp'; want[adj] = 'adj'; want[AB] = 'hyp';
            return P.grid('(' + 'ab'[k] + ') From ' + t('\\angle ' + V) + ', which side is the opp, the adj and the hyp?', rows, ROLE_COLS, want, { why: function (row, got, w) { var h = roleWhy(row, got, w); h.hint = h.hint.replace(/θ/g, t('\\angle ' + V)); return h; }, rowHead: 'Side' },
              'From ' + t('\\angle ' + V) + ': opp ' + t('=' + opp) + ' (across from ' + t(V) + '), adj ' + t('=' + adj) + ' (touches ' + t(V) + '), hyp ' + t('=' + AB) + ' (across from the right angle at ' + t(C) + ').',
              ['The side across from ' + t('\\angle ' + V) + ' does not have the letter ' + t(V) + ' in its name.'], 'name sides');
          } };
        }).concat([{ id: '2c', level: 'EMG', make: function (r, sh) {
          var A = sh.n[0], B = sh.n[1], C = sh.n[2], sd = function (x, y) { return [x, y].sort().join(''); }, BC = sd(B, C), AC = sd(A, C), AB = sd(A, B);
          var T = function (x, y) { return t(fr(x, y)); };
          return P.mc(r, '(c) Write ' + t('\\tan ' + A) + ' and ' + t('\\tan ' + B) + ' as ratios of sides.', [
            { html: t('\\tan ' + A + '=' + fr(BC, AC)) + ', &nbsp;' + t('\\tan ' + B + '=' + fr(AC, BC)), right: true },
            { html: t('\\tan ' + A + '=' + fr(AC, BC)) + ', &nbsp;' + t('\\tan ' + B + '=' + fr(BC, AC)), why: 'Upside down: tan = opp ÷ adj. From ' + t('\\angle ' + A) + ', the opp side is ' + t(BC) + '.', code: 'flip' },
            { html: t('\\tan ' + A + '=' + fr(BC, AB)) + ', &nbsp;' + t('\\tan ' + B + '=' + fr(AC, AB)), why: 'tan never uses the hyp ' + t(AB) + ': it is opp ÷ adj.', code: 'hyp' },
            { html: t('\\tan ' + A + '=' + fr(BC, AC)) + ', &nbsp;' + t('\\tan ' + B + '=' + fr(BC, AC)), why: 'From ' + t('\\angle ' + B) + ', opp and adj <b>swap</b>.', code: 'same' }],
            t('\\tan ' + A + '=' + fr('\\text{opp}', '\\text{adj}') + '=' + fr(BC, AC)) + ' &nbsp; ' + t('\\tan ' + B + '=' + fr(AC, BC)) + '<br>(One is the other turned upside down.)', ['tan = opp ÷ adj. Use your answers to (a) and (b).'], 'tan ratios');
        } }]) },
      /* ---------- 3. three similar triangles ---------- */
      { num: '3', stem: function (sh) { return 'These three right triangles each have a ' + D(sh.S.deg) + ' angle. (They are not drawn to scale.)' + simFigs(sh.S, 'cm'); },
        shared: function (r) { var deg = find(function () { return r.int(28, 64); }, function (d) { return d !== 35 && d !== 45 && !!nicePair(d) && nicePair(d)[1] <= 12; }); return { S: simTable(r, deg) }; },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) {
            var d = sh.S.deg;
            return P.mc(r, '(a) Why are the triangles similar?', [
              { html: 'Each has a 90° angle and a ' + d + '° angle (so the third angle is ' + (90 - d) + '° in each). The angles match.', right: true },
              { html: 'Their sides are the same lengths.', why: 'Look again: the sides are different lengths. Similar means the same <b>shape</b> (equal angles), not the same size.', code: 'same-size' },
              { html: 'They all have three sides.', why: 'Every triangle has three sides. Similar triangles have matching <b>angles</b>.', code: 'three' },
              { html: 'They are all drawn the same way round.', why: 'They are turned different ways. Similar triangles have matching angles, whichever way they face.', code: 'turn' }],
              'Each one has a ' + t('90^\\circ') + ' angle and a ' + D(d) + ' angle, so the third angle is ' + t('180^\\circ-90^\\circ-' + dg(d) + '=' + dg(90 - d)) + ' in each. Two pairs of equal angles: the triangles are similar.', ['What do similar triangles have to have the same?'], 'why similar');
          } },
          { id: '3b', level: 'EMG', make: function (r, sh) { return simTablePart('(b) Use the ' + D(sh.S.deg) + ' angle to complete the table. Careful: in Triangle 3, which side is opp?', sh.S, 'cm'); } },
          { id: '3c', level: 'BEG', make: function (r, sh) {
            var d = sh.S.deg, v = TAN(d), p = P.approx('(c) Find ' + t('\\tan ' + dg(d)) + ' with your calculator, to 4 decimal places. (Does it agree with the table?)', v, 4, {},
              t('\\tan ' + dg(d) + '=' + v.toFixed(6) + '\\ldots\\approx ' + v.toFixed(4)) + '<br>That rounds to ' + sh.S.r2.toFixed(2) + ', so it agrees with the table.', ['Press <b>tan</b> ' + d + ' <b>)</b> <b>ENTER</b> (DEG mode).'], 'tan value');
            p.check = tan4Chk(v, tanAlts(d)); p.input.before = t('\\tan ' + dg(d) + '\\approx'); return p;
          } },
          { id: '3d', level: 'EMG', make: function (r, sh) {
            var S = sh.S, adj = r.pick([10, 20, 15, 12]), viaT = rd(S.r2 * adj, 1), viaC = adj * TAN(S.deg);
            var p = GP.len('(d) Another right triangle with a ' + D(S.deg) + ' angle has adj ' + t('=' + adj + '\\text{ m}') + '. Use the table (or the tan key) to predict opp, to the nearest tenth.', viaC, { unit: 'm', trig: { fn: 'tan', deg: S.deg, side: adj, op: 'mul' }, early: false,
              sol: 'opp ÷ adj ' + t('\\approx ' + S.r2.toFixed(2)) + ', so opp ' + t('\\approx ' + S.r2.toFixed(2) + '\\times ' + adj + '=' + fx(S.r2 * adj, 1)) + ' m.<br>(With the tan key: ' + t(adj + '\\times\\tan ' + dg(S.deg) + toN(viaC, 1)) + ' m.)', hints: ['opp ÷ adj is the same for every right triangle with this angle. So opp = (opp ÷ adj) × adj.'], text: 'predict opp' });
            var base = p.check; p.check = function (resp) { var a = readNum(resp); if (!a.res && a.d <= 1 && (same(a.v, viaT) || same(a.v, rd(S.ratio * adj, 1)))) return ok(); return base(resp); };
            p.good = [viaT.toFixed(1)]; return p;
          } }] },
      /* ---------- 4. tan values; tan D and tan E ---------- */
      { num: '4', stem: '', parts: [
        { id: '4a', level: 'BEG', make: function (r) {
          var degs = find(function () { return [r.int(11, 19), r.int(36, 44), r.int(71, 79), r.int(86, 89)]; }, function (s) { return [10, 20, 35, 45, 60, 70, 80].indexOf(s[1]) < 0; });
          return tanTablePart('(a) Use your calculator in DEG mode. Round to 4 decimal places.', degs);
        } },
        { id: '4b', level: 'EMG', make: function (r) {
          var tr = r.pick([[20, 21, 29], [12, 35, 37], [28, 45, 53], [11, 60, 61], [33, 56, 65], [7, 24, 25], [9, 40, 41], [5, 12, 13]]), sw = r.chance(0.5), a = sw ? tr[1] : tr[0], b = sw ? tr[0] : tr[1], c = tr[2];
          var nm = r.pick([['D', 'E', 'F'], ['G', 'H', 'J'], ['R', 'S', 'T'], ['K', 'L', 'M']]);
          var fig = G.rightTriSVG({ a: a, b: b, right: 'br', names: nm, sides: { a: a + ' cm', b: b + ' cm', c: c + ' cm' }, width: 240, px: 160 });
          return tanFracPart('(b) In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + nm[2] + '=90^\\circ') + ', ' + t(nm[0] + nm[2] + '=' + b) + ' cm, ' + t(nm[1] + nm[2] + '=' + a) + ' cm and ' + t(nm[0] + nm[1] + '=' + c) + ' cm. Write ' + t('\\tan ' + nm[0]) + ' and ' + t('\\tan ' + nm[1]) + ' as fractions and as decimals (4 decimal places).' + fig, nm, a, b, c);
        } }] },
      /* ---------- 5. x opposite (multiply) ---------- */
      { num: '5', stem: 'Find ' + t('x') + ', to the nearest tenth.', parts: [['a', 'BEG', 'cm', [25, 40], [8, 20, 1]], ['b', 'EMG', 'm', [55, 72], [1.5, 4, 0.1]], ['c', 'EMG', 'ft', [12, 24], [30, 60, 1]]].map(function (z) {
        return { id: '5' + z[0], level: z[1], make: function (r) {
          var v = find(function () { return { d: r.int(z[3][0], z[3][1]), s: pickR(r, z[4][0], z[4][1], z[4][2]) }; }, function (o) { return safe(o.s * TAN(o.d), 1) && !worked(o.d, o.s); });
          var ori = z[0] === 'c' ? { right: 'tl', flip: true } : z[0] === 'b' ? { right: 'br', flip: true } : { right: 'br' };
          return tanPart('(' + z[0] + ')' + trigFig(v.d, { adj: lab(v.s, z[2]), opp: 'x' }, Object.assign({ unknown: 'a' }, ori)), v.d, v.s, 'mul', { unit: z[2] });
        } };
      }) },
      /* ---------- 6. x adjacent (divide) ---------- */
      { num: '6', stem: 'Find ' + t('x') + ', to the nearest tenth. Here ' + t('x') + ' is the <b>adjacent</b> side.', parts: [['a', 'EMG', 'cm', [30, 44], [5, 12, 0.5]], ['b', 'PRG', 'm', [62, 76], [15, 35, 1]], ['c', 'PRG', 'in', [8, 16], [2, 5, 0.1]]].map(function (z) {
        return { id: '6' + z[0], level: z[1], outcome: 'A1', make: function (r) {
          var v = find(function () { return { d: r.int(z[3][0], z[3][1]), s: pickR(r, z[4][0], z[4][1], z[4][2]) }; }, function (o) { return safe(o.s / TAN(o.d), 1) && !worked(o.d, o.s); });
          var ori = z[0] === 'a' ? { right: 'bl', flip: true } : z[0] === 'c' ? { right: 'br', rot: 20 } : { right: 'br' };
          return tanPart('(' + z[0] + ')' + trigFig(v.d, { adj: 'x', opp: lab(v.s, z[2]) }, Object.assign({ unknown: 'b' }, ori)), v.d, v.s, 'div', { unit: z[2] });
        } };
      }) },
      /* ---------- 7. shed roof ---------- */
      { num: '7', stem: '', parts: [{ id: '7', level: 'EMG', make: function (r) {
        var v = find(function () { return { d: r.int(15, 35), s: pickR(r, 1.8, 3.6, 0.2) }; }, function (o) { return safe(o.s * TAN(o.d), 2); });
        return tanPart('The roof of a garden shed slopes up at ' + D(v.d) + ' from the horizontal. It covers a horizontal distance (the run) of ' + L(v.s, 'm') + '. How much does the roof rise? Round to the nearest hundredth of a metre.' + trigFig(v.d, { adj: lab(v.s, 'm'), opp: 'rise' }, { right: 'br', unknown: 'a' }), v.d, v.s, 'mul',
          { unit: 'm', dp: 2, name: '\\text{rise}', lead: 'From ' + D(v.d) + ': the rise is opp, the run ' + L(v.s, 'm') + ' is adj.' });
      } }] },
      /* ---------- 8. slough ---------- */
      { num: '8', stem: '', parts: [{ id: '8', level: 'PRG', make: function (r) {
        var v = find(function () { return { d: r.int(28, 55), s: r.pick([40, 45, 50, 55, 60, 65, 70, 75, 80]), p: person(r) }; }, function (o) { return safe(o.s * TAN(o.d), 1) && Math.abs(o.d - 45) > 2; });
        var w = v.s * TAN(v.d), fig = HW.fig({ pts: { B: [v.s, 0], A: [0, 0], T: [0, w] }, segs: [['B', 'A', lab(v.s, 'm')], ['A', 'T', '?', { color: '#1f5bd6', width: 3 }], ['T', 'B']], right: [['A', 'B', 'T']], angles: [['B', 'A', 'T', v.d + '°']], names: true,
          extra: [{ type: 'text', at: [-0.3 * v.s, w * 0.62], text: 'slough', color: '#1f5bd6' }], width: 280, height: 230, aria: 'a slough' });
        return tanPart('Farmer ' + v.p.n + ' wants to know how wide a slough is, from point ' + t('A') + ' to a fence post ' + t('T') + ' on the other side. ' + cap(v.p.he) + ' walks ' + L(v.s, 'm') + ' along the shore from ' + t('A') + ' to ' + t('B') + ', at a right angle to ' + t('AT') + '. From ' + t('B') + ', the angle between ' + t('BA') + ' and the line to the post is ' + D(v.d) + '. How wide is the slough? Round to the nearest tenth.' + fig, v.d, v.s, 'mul',
          { unit: 'm', name: 'AT', lead: 'From the ' + D(v.d) + ' angle at ' + t('B') + ': ' + t('AT') + ' is opp, ' + t('AB=' + v.s) + ' m is adj.', end: 'The slough is about ' + Lf(w, 1, 'm') + ' wide.' });
      } }] },
      /* ---------- 9. photographer ---------- */
      { num: '9', stem: '', parts: [{ id: '9', level: 'PRG', outcome: 'A1', make: function (r) {
        var v = find(function () { return { d: r.int(28, 55), H: r.pick([18, 20, 22, 24, 26, 28, 30, 32, 36, 40]), p: person(r) }; }, function (o) { return safe(o.H / TAN(o.d), 1) && Math.abs(o.d - 45) > 2 && !(o.d === 40 && o.H === 6.3); });
        var fig = G.elevationSVG({ angle: v.d, dist: v.H / TAN(v.d), height: v.H, eye: 0, observer: 'none', target: 'building', labels: { angle: v.d + '°', dist: 'd', height: v.H + ' m' }, width: 300 });
        return tanPart('A photographer wants a photo of a ' + v.H + ' m tall office building. ' + cap(v.p.he) + ' wants the line from ' + v.p.his + ' camera on the ground to the top of the building to make a ' + D(v.d) + ' angle with the ground. How far from the building should ' + v.p.he + ' put the camera? Round to the nearest tenth.' + fig, v.d, v.H, 'div',
          { unit: 'm', name: 'd', lead: 'From ' + D(v.d) + ': the height ' + L(v.H, 'm') + ' is opp, the distance ' + t('d') + ' is adj.', end: cap(v.p.he) + ' should put the camera about ' + Lf(v.H / TAN(v.d), 1, 'm') + ' from the building.' });
      } }] },
      /* ---------- 10. loading-dock ramp ---------- */
      { num: '10', stem: function (sh) { return 'A ramp at a loading dock must rise ' + L(sh.h, 'm') + '. Its angle with the ground will be ' + D(sh.d) + '.'; },
        shared: function (r) { return find(function () { return { h: pickR(r, 0.25, 0.6, 0.05), d: r.pick([3.5, 4, 4.2, 4.5, 5, 5.2, 5.5, 6]) }; }, function (o) { var x = o.h / TAN(o.d); return safe(x, 1) && Math.abs(x - 12 * o.h) >= 0.1 && !(o.d === 4.5 && same(o.h, 0.35) && false); }); },
        parts: [
          { id: '10a', level: 'PRG', outcome: 'A1', make: function (r, sh) { return tanPart('(a) How far along the ground does the ramp reach? Round to the nearest tenth of a metre.', sh.d, sh.h, 'div', { unit: 'm', lead: 'From ' + D(sh.d) + ': the rise ' + L(sh.h, 'm') + ' is opp, the distance along the ground ' + t('x') + ' is adj.', check: false }); } },
          { id: '10b', level: 'PRG', make: function (r, sh) {
            var x = sh.h / TAN(sh.d), x1 = rd(x, 1), tw = q(12 * sh.h), gentle = x > tw;
            return P.mc(r, '(b) A ramp with a 1 : 12 slope reaches 12 times its rise along the ground. Is this ramp gentler or steeper than 1 : 12? Explain.', [
              { html: '<b>Gentler.</b> ' + t('12\\times ' + N(sh.h) + '=' + N(tw)) + ' m, and this ramp goes ' + fx(x1, 1) + ' m along the ground for the same rise.', right: gentle, why: gentle ? null : 'Compare: this ramp goes ' + fx(x1, 1) + ' m, which is <b>less</b> than ' + N(tw) + ' m for the same rise.', code: 'gentle' },
              { html: '<b>Steeper.</b> ' + t('12\\times ' + N(sh.h) + '=' + N(tw)) + ' m, and this ramp goes only ' + fx(x1, 1) + ' m along the ground for the same rise.', right: !gentle, why: gentle ? 'Compare: this ramp goes ' + fx(x1, 1) + ' m, which is <b>more</b> than ' + N(tw) + ' m. Longer for the same rise is gentler.' : null, code: 'steep' },
              { html: '<b>Gentler</b>, because ' + D(sh.d) + ' is less than 12°.', why: 'A 1 : 12 slope is not a 12° angle. Compare the distances along the ground.', code: 'deg12' },
              { html: '<b>Exactly 1 : 12</b>: every ramp at a dock is built to the guideline.', why: 'Work it out: compare ' + t('12\\times ' + N(sh.h)) + ' with your answer to (a).', code: 'exact' }],
              '1 : 12 would reach ' + t('12\\times ' + N(sh.h) + '=' + N(tw)) + ' m. This ramp reaches ' + fx(x1, 1) + ' m.<br>' + (gentle ? 'It is longer for the same rise, so it is a bit <b>gentler</b> than 1 : 12.' : 'It is shorter for the same rise, so it is <b>steeper</b> than 1 : 12.'), ['Work out 12 × the rise and compare it with your answer to (a).'], 'ramp 1:12', true);
          } }] },
      /* ---------- 11. Zoe ---------- */
      { num: '11', stem: function (sh) { return sh.p.n + ' wants the opposite side ' + t('x') + ' in this triangle. ' + cap(sh.p.he) + ' writes: &nbsp;' + t('x=' + N(sh.s) + '\\div\\tan ' + dg(sh.d) + '=' + fx(sh.s / TAN(sh.d), 1)) + ' cm' + trigFig(sh.d, { adj: lab(sh.s, 'cm'), opp: 'x' }, { right: 'br', unknown: 'a' }); },
        shared: function (r) { return find(function () { var d = r.chance(0.6) ? r.int(18, 38) : r.int(52, 70); return { d: d, s: pickR(r, 6, 12, 0.5), p: person(r) }; }, function (o) { return safe(o.s * TAN(o.d), 1) && !worked(o.d, o.s); }); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var small = sh.d < 45, w = fx(sh.s / TAN(sh.d), 1);
            return P.mc(r, '(a) Without a calculator, explain why ' + sh.p.his + ' answer can’t be right.', [
              { html: D(sh.d) + (small ? ' is less than ' : ' is more than ') + t('45^\\circ') + ', so opp must be ' + (small ? '<b>shorter</b>' : '<b>longer</b>') + ' than adj (' + L(sh.s, 'cm') + '). ' + w + ' cm is ' + (small ? 'longer.' : 'shorter.'), right: true },
              { html: 'The answer should be a whole number.', why: 'Lengths from tan are usually decimals. Use the 45° check: compare opp with adj.', code: 'whole' },
              { html: 'opp and adj are always the same length.', why: 'They are equal only at 45°. Compare ' + D(sh.d) + ' with 45°.', code: 'equal' },
              { html: 'tan ' + D(sh.d) + ' is ' + sh.d + ', so the answer should be ' + t(N(sh.s) + '\\div ' + sh.d) + '.', why: t('\\tan ' + dg(sh.d)) + ' is a number from the calculator, not ' + sh.d + '.', code: 'deg' }],
              D(sh.d) + (small ? ' < ' : ' > ') + t('45^\\circ') + ', so opp must be ' + (small ? 'shorter' : 'longer') + ' than adj (' + L(sh.s, 'cm') + '). ' + w + ' cm is ' + (small ? 'longer' : 'shorter') + ', so it can’t be right.', ['Use the 45° check: is θ less than or more than 45°?'], 'Zoe check');
          } },
          { id: '11b', level: 'EMG', make: function (r, sh) { return tanPart('(b) Find the correct value of ' + t('x') + ', to the nearest tenth.', sh.d, sh.s, 'mul', { unit: 'cm', lead: t('x') + ' is opp (on top): ' + t('\\tan ' + dg(sh.d) + '=' + fr('x', N(sh.s))) + ', so multiply.' }); } }] },
      /* ---------- 12. Malik's tree ---------- */
      { num: '12', stem: function (sh) { return 'Standing on the ground ' + L(sh.d1, 'm') + ' from a tree, ' + sh.p.n + ' measures a ' + D(sh.a1) + ' angle from the ground to the top of the tree.' + G.elevationSVG({ angle: sh.a1, dist: sh.d1, height: sh.h, eye: 0, observer: 'none', target: 'tree', labels: { angle: sh.a1 + '°', dist: sh.d1 + ' m', height: 'h' }, width: 280 }); },
        shared: function (r) {
          var need = r.chance(0.6);
          return find(function () { var d1 = r.pick([12, 15, 16, 18, 20, 22, 25, 30]), a1 = r.int(42, 62), a2 = r.int(24, a1 - 10), h = d1 * TAN(a1), d2 = h / TAN(a2), d2e = rd(h, 1) / TAN(a2); return { d1: d1, a1: a1, a2: a2, h: h, d2: d2, d2e: d2e, p: person(r) }; },
            function (o) { return safe(o.h, 1) && safe(o.d2, 1) && safe(o.d2 - o.d1, 1) && (rd(o.d2e, 1) !== rd(o.d2, 1)) === need && !(o.d1 === 20 && o.a1 === 50); });
        },
        parts: [
          { id: '12a', level: 'PRG', make: function (r, sh) { return tanPart('(a) How tall is the tree, to the nearest tenth of a metre? (Keep the full calculator value for (b).)', sh.a1, sh.d1, 'mul', { unit: 'm', name: 'h', lead: 'From ' + D(sh.a1) + ': the height ' + t('h') + ' is opp, the ' + L(sh.d1, 'm') + ' is adj.', end: 'The tree is about ' + Lf(sh.h, 1, 'm') + ' tall.' }); } },
          { id: '12b', level: 'MAS', outcome: 'A1', make: function (r, sh) {
            var far = sh.d2 - sh.d1, early = rd(sh.d2e, 1) !== rd(sh.d2, 1);
            var dChk = G.lenChk(sh.d2, { pyth: null, trig: { fn: 'tan', deg: sh.a2, side: sh.h, op: 'div' }, alts: [{ v: far, code: 'u7l4-total', hint: 'That is how much <b>farther back</b>. The first box is the whole distance from the tree.' }, { v: sh.d1 / TAN(sh.a2), code: 'u7l4-swap', hint: 'Use the tree’s <b>height</b> from (a) as opp, not the ' + sh.d1 + ' m.' }] });
            var d1Chk = function (resp) { var a = readNum(resp); if (early && !a.res && a.d <= 2 && same(rd(a.v, 1), rd(sh.d2e, 1))) return form('u7l4-round-early', 'Nearly! You used the <b>rounded</b> height (' + fx(sh.h, 1) + ' m). Use the full value from (a): ' + t(rawN(sh.h, 4)) + '.'); return dChk(resp); };
            var fChk = function (resp) {
              var a = readNum(resp); if (a.res) return a.res;
              var okv = [rd(far, 1), q(rd(sh.d2, 1) - sh.d1)];
              if (okv.some(function (x) { return same(a.v, x); })) return ok();
              if (a.d > 1 && okv.some(function (x) { return same(rd(a.v, 1), x); })) return form('round', 'Right — now round it to the nearest tenth.');
              if (same(rd(a.v, 1), rd(sh.d2, 1))) return wrong('u7l4-total', 'That is the whole distance. How much <b>farther back</b> is it than the ' + sh.d1 + ' m?');
              if (early && same(rd(a.v, 1), rd(sh.d2e - sh.d1, 1))) return form('u7l4-round-early', 'Nearly! Use the full value of the height from (a), not the rounded one.');
              return wrong('value', 'Subtract: new distance − ' + sh.d1 + ' m.');
            };
            return P.fields('(b) ' + sh.p.n + ' wants the angle to be only ' + D(sh.a2) + '. How far from the tree must ' + sh.p.he + ' stand? How much farther back is that? Round to the nearest tenth.',
              [{ label: 'Distance from the tree:', after: 'm', name: 'distance' }, { label: 'Farther back by:', after: 'm', name: 'farther back' }], [d1Chk, fChk], [fx(sh.d2, 1), fx(far, 1)],
              Lf(sh.d2, 1, 'm') + ' from the tree; ' + Lf(far, 1, 'm') + ' farther back',
              br(['Now the height is opp and the distance ' + t('d') + ' is adj:', t('d=' + fr(rawN(sh.h, 3), '\\tan ' + dg(sh.a2)) + toN(sh.d2, 1)) + ' m from the tree.', 'That is ' + t(fx(sh.d2, 1) + '-' + sh.d1 + '=' + fx(rd(sh.d2, 1) - sh.d1, 1)) + ' m farther back. (A smaller angle means standing farther away ✓)',
                early ? '(Using the rounded height ' + fx(sh.h, 1) + ' m gives ' + fx(sh.d2e, 1) + ' m, which is a little off.)' : null]),
              ['The tree’s height from (a) is now the opp side; the new distance is adj (on the bottom: divide).', 'Then subtract the first distance.'], 'tree farther');
          } }] },
      /* ---------- 13. roof pitch vs angle ---------- */
      { num: '13', stem: '', parts: [{ id: '13', level: 'ADV', make: function (r) {
        var v = find(function () { var p = r.int(3, 10), a = Math.round(Math.atan(p / 12) / RADc) + r.pick([-4, -3, -2, 2, 3, 4]); return { p: p, a: a }; }, function (o) { return Math.abs(o.p / 12 - TAN(o.a)) > 0.01 && o.a > 5; });
        return pitchPart('A roof with a pitch of ' + v.p + '/12 rises ' + v.p + ' units for every 12 units it runs across. Is a ' + v.p + '/12 roof steeper or less steep than a roof that slopes at ' + D(v.a) + '? Explain using tangents.', v.p, v.a);
      } }] },
      /* ---------- 14. which ratio is tan X ---------- */
      { num: '14', stem: '', parts: [{ id: '14', level: 'BEG', make: function (r) {
        var nm = r.pick([['X', 'Y', 'Z'], ['A', 'B', 'C'], ['M', 'N', 'P'], ['J', 'K', 'L'], ['R', 'S', 'T']]), X = nm[0], Y = nm[1], Z = nm[2], s2 = function (a, b) { return [a, b].sort().join(''); };
        var YZ = s2(Y, Z), XZ = s2(X, Z), XY = s2(X, Y), T = function (a, b) { return t(fr(a, b)); };
        var p = P.mc(r, 'In ' + t('\\triangle ' + X + Y + Z) + ', ' + t('\\angle ' + Z + '=90^\\circ') + '. Which ratio is ' + t('\\tan ' + X) + '?' + G.rightTriSVG({ a: 2, b: 3.4, right: 'br', names: [X, Y, Z], width: 200, px: 140 }), [
          { html: T(YZ, XZ), right: true }, { html: T(YZ, XY), why: 'That uses the hyp ' + t(XY) + '. tan never uses the hyp.', code: 'hyp1' },
          { html: T(XZ, XY), why: 'That uses the hyp ' + t(XY) + '. tan never uses the hyp.', code: 'hyp2' }, { html: T(XZ, YZ), why: 'That is ' + t('\\tan ' + Y) + ': from ' + t('\\angle ' + X) + ', opp is ' + t(YZ) + '.', code: 'flip' }],
          'From ' + t('\\angle ' + X) + ': opp ' + t('=' + YZ) + ' and adj ' + t('=' + XZ) + ', so ' + t('\\tan ' + X + '=' + fr(YZ, XZ)) + '.', ['opp is the side across from ' + t('\\angle ' + X) + '; adj touches it.'], 'which ratio', true);
        p.input.columns = 4; return p;
      } }] },
      /* ---------- 15. which equation gives x ---------- */
      { num: '15', stem: '', parts: [{ id: '15', level: 'EMG', outcome: 'A1', make: function (r) {
        var v = find(function () { return { d: r.int(25, 65), s: r.int(8, 30) }; }, function (o) { return !worked(o.d, o.s) && o.d !== 45; });
        var d = v.d, s = v.s, E = function (x) { return t('x=' + x); };
        var p = P.mc(r, 'Which equation gives ' + t('x') + '?' + trigFig(d, { adj: 'x', opp: lab(s, 'm') }, { right: 'bl', flip: true, unknown: 'b', width: 220 }), [
          { html: E(s + '\\times\\tan ' + dg(d)), why: 'That treats ' + t('x') + ' as the opp side. Here ' + t('x') + ' touches the angle: it is adj, on the bottom.', code: 'mul' },
          { html: E(fr(s, '\\tan ' + dg(d))), right: true },
          { html: E(fr('\\tan ' + dg(d), s)), why: 'Upside down: ' + t('\\tan ' + dg(d) + '=' + fr(s, 'x')) + ' gives ' + t('x=' + s + '\\div\\tan ' + dg(d)) + '.', code: 'upside' },
          { html: E(fr(s, d)), why: 'Use ' + t('\\tan ' + dg(d)) + ' (a number from the calculator), not ' + d + '.', code: 'deg' }],
          t('\\tan ' + dg(d) + '=' + fr(s, 'x')) + ', and ' + t('x') + ' is on the bottom, so divide: ' + t('x=' + s + '\\div\\tan ' + dg(d)) + '.', ['Label opp and adj from the angle. Is ' + t('x') + ' on the top or the bottom of opp ÷ adj?'], 'which equation', true);
        p.input.columns = 2; return p;
      } }] },
      /* ---------- 16. opposite side, about ---------- */
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { var d = r.int(55, 70), s = pickR(r, 3, 9, 0.5); return { d: d, s: s, vals: [s / TAN(d), s, s * TAN(d), s / Math.cos(d * RADc)].map(function (x) { return rd(x, 1); }) }; },
          function (o) { var u = o.vals.map(String); return u.filter(function (x, i) { return u.indexOf(x) === i; }).length === 4 && !worked(o.d, o.s); });
        var d = v.d, s = v.s, V = v.vals;
        var p = P.mc(r, 'A right triangle has a ' + D(d) + ' angle. The side adjacent to it is ' + t(fx(s, 1) + '\\text{ m}') + '. The side opposite the ' + D(d) + ' angle is about', [
          { html: fx(V[0], 1) + ' m', why: 'That divides by tan. opp is on <b>top</b>: multiply. (Also: ' + d + '° > 45°, so opp is longer than adj.)', code: 'div' },
          { html: fx(V[1], 1) + ' m', why: 'opp = adj only at 45°.', code: '45' },
          { html: fx(V[2], 1) + ' m', right: true },
          { html: fx(V[3], 1) + ' m', why: 'That is the length of the <b>hypotenuse</b>.', code: 'hyp' }],
          'opp ' + t('=' + fx(s, 1) + '\\times\\tan ' + dg(d) + toN(s * TAN(d), 1)) + ' m. It makes sense: ' + D(d) + ' > ' + t('45^\\circ') + ', so opp is longer than adj.', ['opp is on top of opp ÷ adj, so multiply: adj × tan θ.'], 'opp about', true);
        p.input.columns = 4; return p;
      } }] },
      /* ---------- 17. NR flagpole ---------- */
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var v = find(function () { return { d: r.int(25, 44), s: pickR(r, 5, 12, 0.5) }; }, function (o) { var h = o.s * TAN(o.d); return safe(h, 1) && h < 99; });
        return tanPart('<b>Numerical response.</b> A flagpole stands straight up on level ground. Its shadow is ' + L(v.s, 'm') + ' long when the sun’s rays make a ' + D(v.d) + ' angle with the ground. The height of the flagpole, to the nearest tenth of a metre, is ____ m.' + trigFig(v.d, { adj: 'shadow ' + lab(v.s, 'm'), opp: 'h' }, { right: 'br', unknown: 'a', width: 230 }), v.d, v.s, 'mul', { nr: true, name: 'h', lead: 'The height ' + t('h') + ' is opp; the shadow ' + L(v.s, 'm') + ' is adj.' });
      } }] },
      /* ---------- 18. NR kite ---------- */
      { num: '18', stem: '', parts: [{ id: '18', level: 'PRG', outcome: 'A1', make: function (r) {
        var v = find(function () { return { d: r.int(40, 70), h: r.int(12, 30), p: person(r) }; }, function (o) { var x = o.h / TAN(o.d); return safe(x, 1) && x < 99 && Math.abs(o.d - 45) > 2; });
        return tanPart('<b>Numerical response.</b> A kite is flying ' + v.h + ' m above the ground, straight above point ' + t('P') + '. From where ' + v.p.n + ' stands on the ground, the angle up to the kite is ' + D(v.d) + '. ' + v.p.n + '’s distance from ' + t('P') + ', to the nearest tenth of a metre, is ____ m.', v.d, v.h, 'div', { nr: true, name: 'd', lead: 'The height ' + L(v.h, 'm') + ' is opp and the distance ' + t('d') + ' is adj.' });
      } }] }
    ],
    extra: [
      /* ---------- A1 label sides ---------- */
      { num: '1', section: 'A. Skills', stem: 'Mark each side <b>opp</b>, <b>adj</b> or <b>hyp</b>. Use the angle marked θ.', parts: [['a', 'BEG', 'tl', false, 0], ['b', 'BEG', 'tr', false, 0], ['c', 'EMG', 'br', false, 1]].map(function (z) {
        return { id: 'e1' + z[0], level: z[1], make: function (r) {
          var legs = find(function () { return [r.int(3, 12), r.int(3, 12)]; }, function (s) { return Math.abs(s[0] - s[1]) >= 2; });
          return labelPart(r, '(' + z[0] + ')', legs, { right: z[2], flip: z[3], rot: z[4] ? r.pick([-140, 120, 150, -35]) : 0, unit: r.pick(['cm', 'm', 'in']) });
        } };
      }) },
      /* ---------- A2 tan table ---------- */
      { num: '2', section: 'A. Skills', stem: '', parts: [{ id: 'e2', level: 'BEG', make: function (r) {
        var degs = find(function () { return [r.int(3, 8), r.int(21, 29), r.int(48, 56), r.int(64, 69)]; }, function (s) { return [10, 20, 35, 45, 60, 70, 80].indexOf(s[1]) < 0; });
        return tanTablePart('Find each value to 4 decimal places.', degs);
      } }] },
      /* ---------- A3 tan K and tan L ---------- */
      { num: '3', section: 'A. Skills', stem: '', parts: [{ id: 'e3', level: 'EMG', make: function (r) {
        var tr = r.pick([[9, 40, 41], [11, 60, 61], [12, 35, 37], [20, 21, 29], [28, 45, 53], [7, 24, 25], [13, 84, 85]]), a = tr[0], b = tr[1], c = tr[2];
        var nm = r.pick([['K', 'L', 'M'], ['P', 'Q', 'R'], ['U', 'V', 'W'], ['A', 'B', 'C']]);
        var fig = G.rightTriSVG({ a: a, b: b, right: 'br', names: nm, sides: { a: a + ' cm', b: b + ' cm', c: c + ' cm' }, width: 240, px: 170 });
        return tanFracPart('In ' + t('\\triangle ' + nm.join('')) + ', ' + t('\\angle ' + nm[2] + '=90^\\circ') + ', ' + t(nm[0] + nm[2] + '=' + b) + ' cm, ' + t(nm[1] + nm[2] + '=' + a) + ' cm and ' + t(nm[0] + nm[1] + '=' + c) + ' cm. Write ' + t('\\tan ' + nm[0]) + ' and ' + t('\\tan ' + nm[1]) + ' as fractions and as decimals (4 decimal places).' + fig, nm, a, b, c);
      } }] },
      /* ---------- A4 x opposite ---------- */
      { num: '4', section: 'A. Skills', stem: 'Find ' + t('x') + '. Here ' + t('x') + ' is the <b>opposite</b> side.', parts: [['a', 'BEG', 'cm', [36, 48], [8, 15, 1], { right: 'br' }], ['b', 'EMG', 'm', [10, 22], [4, 9, 0.1], { right: 'tr', flip: true }]].map(function (z) {
        return { id: 'e4' + z[0], level: z[1], make: function (r) {
          var v = find(function () { return { d: r.int(z[3][0], z[3][1]), s: pickR(r, z[4][0], z[4][1], z[4][2]) }; }, function (o) { return safe(o.s * TAN(o.d), 1) && !worked(o.d, o.s) && o.d !== 45; });
          return tanPart('(' + z[0] + ')' + trigFig(v.d, { adj: lab(v.s, z[2]), opp: 'x' }, Object.assign({ unknown: 'a' }, z[5])), v.d, v.s, 'mul', { unit: z[2] });
        } };
      }) },
      /* ---------- A5 x adjacent ---------- */
      { num: '5', section: 'A. Skills', stem: 'Find ' + t('x') + '. Here ' + t('x') + ' is the <b>adjacent</b> side.', parts: [['a', 'EMG', 'cm', [24, 34], [4, 8, 0.5], { right: 'bl', flip: true }], ['b', 'PRG', 'ft', [70, 80], [30, 50, 1], { right: 'bl', rot: 0 }]].map(function (z) {
        return { id: 'e5' + z[0], level: z[1], outcome: 'A1', make: function (r) {
          var v = find(function () { return { d: r.int(z[3][0], z[3][1]), s: pickR(r, z[4][0], z[4][1], z[4][2]) }; }, function (o) { return safe(o.s / TAN(o.d), 1) && !worked(o.d, o.s); });
          return tanPart('(' + z[0] + ')' + trigFig(v.d, { adj: 'x', opp: lab(v.s, z[2]) }, Object.assign({ unknown: 'b' }, z[5])), v.d, v.s, 'div', { unit: z[2] });
        } };
      }) },
      /* ---------- B6 three triangles ---------- */
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'Three right triangles each have a ' + D(sh.S.deg) + ' angle.' + simFigs(sh.S, 'cm'); },
        shared: function (r) { var deg = find(function () { return r.int(18, 40); }, function (d) { return d !== 35 && d !== 20 && d !== 10 && !!nicePair(d) && nicePair(d)[1] <= 16; }); return { S: simTable(r, deg) }; },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) { return simTablePart('(a) Complete the table. Round opp ÷ adj to 2 decimal places.', sh.S, 'cm'); } },
          { id: 'e6b', level: 'PRG', make: function (r, sh) {
            var d = sh.S.deg;
            return P.mc(r, '(b) Why is the ratio the same in all three triangles?', [
              { html: 'They all have a 90° and a ' + d + '° angle, so they are similar: both legs are multiplied by the same scale factor, so opp ÷ adj does not change.', right: true },
              { html: 'Because all three triangles have the same hypotenuse.', why: 'The hypotenuses are different lengths. The triangles are <b>similar</b> (same angles), so both legs scale by the same factor.', code: 'hyp' },
              { html: 'Because the adj side is always twice the opp side.', why: 'That is only true for some angles. The reason is that the triangles are similar.', code: 'twice' },
              { html: 'It is a coincidence: the ratio changes with the size of the triangle.', why: 'It is no coincidence: in similar triangles both legs are multiplied by the same number, so the ratio stays the same.', code: 'luck' }],
              'They all have a ' + t('90^\\circ') + ' and a ' + D(d) + ' angle, so they are similar. Each is the others enlarged or reduced: both legs are multiplied by the same scale factor, so opp ÷ adj does not change. (' + t('\\tan ' + dg(d) + '\\approx ' + TAN(d).toFixed(4)) + '.)', ['What makes triangles similar, and what does a scale factor do to both legs?'], 'why same ratio');
          } },
          { id: 'e6c', level: 'EMG', make: function (r, sh) { var adj = r.pick([12, 15, 20, 25, 30]); return tanPart('(c) A right triangle with a ' + D(sh.S.deg) + ' angle has adj ' + t('=' + adj + '\\text{ m}') + '. Use ' + t('\\tan ' + dg(sh.S.deg)) + ' to find opp, to the nearest tenth.', sh.S.deg, adj, 'mul', { unit: 'm', name: '\\text{opp}', lead: 'opp ' + t('=\\text{adj}\\times\\tan\\theta') }); } }] },
      /* ---------- B7 auger ---------- */
      { num: '7', section: 'B. Applying', stem: '', parts: [{ id: 'e7', level: 'EMG', make: function (r) {
        var v = find(function () { return { d: r.int(25, 40), s: pickR(r, 6, 12, 0.5) }; }, function (o) { return safe(o.s * TAN(o.d), 1); });
        return tanPart('A grain auger leans against the wall of a grain bin. It makes a ' + D(v.d) + ' angle with the ground, and its bottom end is ' + L(v.s, 'm') + ' from the bin wall. How high up the wall does the auger reach, to the nearest tenth?' + trigFig(v.d, { adj: lab(v.s, 'm'), opp: 'h' }, { right: 'br', unknown: 'a' }), v.d, v.s, 'mul',
          { unit: 'm', name: 'h', lead: 'From ' + D(v.d) + ': the height ' + t('h') + ' is opp, the ' + L(v.s, 'm') + ' along the ground is adj.', end: 'The auger reaches about ' + Lf(v.s * TAN(v.d), 1, 'm') + ' up the wall.' });
      } }] },
      /* ---------- B8 ski run ---------- */
      { num: '8', section: 'B. Applying', stem: '', parts: [{ id: 'e8', level: 'PRG', outcome: 'A1', make: function (r) {
        var v = find(function () { return { d: r.int(12, 28), s: r.pick([80, 90, 100, 110, 120, 140, 150, 160, 180, 200]) }; }, function (o) { return safe(o.s / TAN(o.d), 1); });
        return tanPart('A ski run drops ' + v.s + ' m from top to bottom. The slope makes a ' + D(v.d) + ' angle with the horizontal. How far does the run go horizontally, to the nearest tenth?' + trigFig(v.d, { adj: 'd', opp: v.s + ' m' }, { right: 'bl', flip: true, unknown: 'b' }), v.d, v.s, 'div',
          { unit: 'm', name: 'd', lead: 'From ' + D(v.d) + ': the drop ' + L(v.s, 'm') + ' is opp, the horizontal distance ' + t('d') + ' is adj.' });
      } }] },
      /* ---------- B9 staircase ---------- */
      { num: '9', section: 'B. Applying', stem: '', parts: [{ id: 'e9', level: 'EMG', make: function (r) {
        var v = find(function () { return { d: r.int(30, 42), s: r.int(24, 30) }; }, function (o) { return safe(o.s * TAN(o.d), 1) && !(o.d === 37 && o.s === 27 && r.chance(0.5)); });
        var fig = trigFig(v.d, { adj: 'run ' + lab(v.s, 'cm'), opp: 'rise' }, { right: 'br', unknown: 'a' });
        return tanPart('A staircase rises at a ' + D(v.d) + ' angle. Each step has a run (depth) of ' + L(v.s, 'cm') + '. How tall is each step (the rise), to the nearest tenth?' + fig, v.d, v.s, 'mul',
          { unit: 'cm', name: '\\text{rise}', lead: 'One step makes a right triangle: the rise is opp and the run ' + L(v.s, 'cm') + ' is adj.' });
      } }] },
      /* ---------- B10 RAD mode ---------- */
      { num: '10', section: 'B. Applying', stem: '', parts: [{ id: 'e10', level: 'BEG', make: function (r) {
        var p = person(r);
        return P.mc(r, p.n + ' checks ' + p.his + ' calculator and gets ' + t('\\tan 45^\\circ=1.619775191') + '. What is wrong?', [
          { html: 'Nothing: ' + t('\\tan 45^\\circ') + ' is about 1.62.', why: 'At 45°, opp = adj, so ' + t('\\tan 45^\\circ') + ' must be exactly 1.', code: 'nothing' },
          { html: 'The calculator is not in DEG mode.', right: true },
          { html: cap(p.he) + ' should have pressed <b>2nd</b> before <b>tan</b>.', why: '<b>2nd tan</b> finds an <b>angle</b> from a ratio (Lesson 8), not a tangent.', code: '2nd' },
          { html: '45° is too big an angle for the tangent.', why: 'Every acute angle has a tangent.', code: 'big' }],
          t('\\tan 45^\\circ') + ' must be exactly 1 (at 45°, opp = adj). 1.6198 is the tangent of 45 <b>radians</b>: switch to DEG with <b>DRG</b>.', ['What should tan 45° be? (At 45°, opp and adj are equal.)'], 'RAD check', true);
      } }] },
      /* ---------- B11 NR ramp ---------- */
      { num: '11', section: 'B. Applying', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return { d: r.pick([3.5, 4, 4.5, 4.8, 5]), s: pickR(r, 6, 10, 0.5) }; }, function (o) { return safe(o.s * TAN(o.d), 2) && !worked(o.d, o.s); });
        return tanPart('<b>Numerical response.</b> A wheelchair ramp makes a ' + D(v.d) + ' angle with the ground. It reaches ' + L(v.s, 'm') + ' along the ground. The height it rises, to the nearest hundredth of a metre, is ____ m.', v.d, v.s, 'mul', { nr: true, dp: 2, name: '\\text{rise}', check: false, lead: 'The rise is opp, the ' + L(v.s, 'm') + ' along the ground is adj.', end: v.d === 4.8 ? '(Check: 1 : 12 gives ' + t(N(v.s) + '\\div 12=' + fx(v.s / 12, 2)) + ' m, very close.)' : null });
      } }] },
      /* ---------- C12 A-frame tent ---------- */
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'MAS', make: function (r) {
        var v = find(function () { return { d: r.int(50, 68), w: pickR(r, 2.4, 4.4, 0.2) }; }, function (o) { return safe(o.w / 2 * TAN(o.d), 1) && !(o.d === 58 && same(o.w, 3.2)); });
        var hw = q(v.w / 2), h = hw * TAN(v.d);
        var fig = HW.fig({ pts: { A: [0, 0], B: [v.w, 0], T: [hw, h], M: [hw, 0] }, segs: [['A', 'B', lab(v.w, 'm')], ['A', 'T'], ['B', 'T'], ['M', 'T', 'h', { dash: true }]], right: [['M', 'B', 'T']], angles: [['A', 'B', 'T', v.d + '°'], ['B', 'A', 'T', v.d + '°']], names: false, fill: [['A', 'B', 'T']], width: 290, height: 230, aria: 'an A-frame tent' });
        return tanPart('The front of an A-frame tent is an isosceles triangle. It is ' + L(v.w, 'm') + ' wide at the bottom, and each side makes a ' + D(v.d) + ' angle with the ground. How tall is the tent, to the nearest tenth? <i>Hint:</i> the height cuts the triangle into two right triangles.' + fig, v.d, hw, 'mul',
          { unit: 'm', name: 'h', lead: 'The height meets the ground in the middle, so each right triangle has adj ' + t('=' + N(v.w) + '\\div 2=' + N(hw)) + ' m.', end: 'The tent is about ' + Lf(h, 1, 'm') + ' tall.',
            alts: [{ v: v.w * TAN(v.d), code: 'u7l4-full-base', hint: 'The height meets the ground in the <b>middle</b>: each right triangle has adj = half the width (' + t(N(v.w) + '\\div 2') + ').' }],
            hints: ['The height cuts the base in half. Each right triangle has adj = half the width.', 'The height is opp: multiply by tan.'] });
      } }] },
      /* ---------- C13 pitch 7/12 vs 30° ---------- */
      { num: '13', section: 'C. Stretch', stem: '', parts: [{ id: 'e13', level: 'ADV', make: function (r) {
        var v = find(function () { var p = r.int(4, 10), a = Math.round(Math.atan(p / 12) / RADc) + r.pick([-1, 1]); return { p: p, a: a }; }, function (o) { return Math.abs(o.p / 12 - TAN(o.a)) > 0.004; });
        return pitchPart('A carpenter says a roof with a pitch of ' + v.p + '/12 (it rises ' + v.p + ' for every 12 across) slopes at “about ' + v.a + '°”. Use tangents to decide whether the roof is a little steeper or a little less steep than ' + D(v.a) + '.', v.p, v.a);
      } }] },
      /* ---------- C14 Sam ---------- */
      { num: '14', section: 'C. Stretch', stem: function (sh) { return sh.p.n + ' wants side ' + t('x') + ' in this triangle. ' + cap(sh.p.he) + ' writes: &nbsp;' + t('\\tan ' + dg(sh.d) + '=' + fr('x', N(sh.s))) + ', so ' + t('x=' + N(sh.s) + '\\times\\tan ' + dg(sh.d) + '=' + fx(sh.s * TAN(sh.d), 1)) + ' m.' + trigFig(sh.d, { adj: 'x', opp: lab(sh.s, 'm') }, { right: 'br', unknown: 'b' }); },
        shared: function (r) { return find(function () { var d = r.chance(0.7) ? r.int(25, 40) : r.int(50, 65); return { d: d, s: r.int(8, 20), p: person(r) }; }, function (o) { return safe(o.s / TAN(o.d), 1) && !worked(o.d, o.s) && !(o.d === 35 && o.s === 14); }); },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) {
            var small = sh.d < 45, w = fx(sh.s * TAN(sh.d), 1);
            return P.mc(r, '(a) What mistake did ' + sh.p.n + ' make? How could the 45° check have warned ' + sh.p.him + '?', [
              { html: 'From ' + D(sh.d) + ', the ' + sh.s + ' m side is opp and ' + t('x') + ' is adj, so ' + t('x') + ' belongs on the <b>bottom</b>. Check: ' + (small ? sh.d + '° < 45°, so adj must be <b>longer</b> than opp: ' + t('x') + ' must be more than ' + sh.s + ' m, not ' + w + ' m.' : sh.d + '° > 45°, so adj must be <b>shorter</b> than opp: ' + t('x') + ' must be less than ' + sh.s + ' m, not ' + w + ' m.'), right: true },
              { html: cap(sh.p.he) + ' should have used sin instead of tan.', why: 'Both sides are legs (opp and adj), so tan is right. The problem is where ' + t('x') + ' goes in the ratio.', code: 'sin' },
              { html: 'The calculator was in RAD mode.', why: 'In RAD mode the answer would be very different. ' + w + ' m really is ' + sh.s + ' × tan ' + sh.d + '°: the set-up is wrong.', code: 'rad' },
              { html: 'Nothing: ' + t('x') + ' is opp, so multiplying is right.', why: 'Look at the picture: ' + t('x') + ' <b>touches</b> the ' + sh.d + '° angle, so it is adj.', code: 'nothing' }],
              'From ' + D(sh.d) + ': the ' + sh.s + ' m side is opp and ' + t('x') + ' is adj, so ' + t('\\tan ' + dg(sh.d) + '=' + fr(sh.s, 'x')) + ' (' + t('x') + ' on the bottom).<br>Check: ' + (small ? D(sh.d) + ' < ' + t('45^\\circ') + ', so opp is shorter than adj: ' + t('x') + ' must be more than ' + sh.s + ' m.' : D(sh.d) + ' > ' + t('45^\\circ') + ', so opp is longer than adj: ' + t('x') + ' must be less than ' + sh.s + ' m.'), ['Label the sides from the angle. Which one is ' + t('x') + '?'], 'Sam mistake');
          } },
          { id: 'e14b', level: 'PRG', outcome: 'A1', make: function (r, sh) { return tanPart('(b) Find the correct value of ' + t('x') + ', to the nearest tenth.', sh.d, sh.s, 'div', { unit: 'm' }); } }] }
    ]
  });

  /* pitch p/12 against an angle a: tan of the roof, tan a, steeper / less steep */
  function pitchPart(prompt, p, a) {
    var tr = p / 12, ta = TAN(a), steeper = tr > ta;
    return P.fields(prompt, [{ label: 'tan of the roof angle ' + t('=' + fr(p, 12) + '\\approx'), name: 'tan of the roof' }, { label: t('\\tan ' + dg(a) + '\\approx'), name: 'tan ' + a + '°' }, { label: 'The roof is', mode: 'text', wide: true, placeholder: 'steeper / less steep', name: 'steeper or less steep' }],
      [tan4Chk(tr, [{ v: 12 / p, code: 'trig-upside', hint: 'Rise is opp and run is adj: tan = rise ÷ run = ' + t(fr(p, 12)) + '.' }]), tan4Chk(ta, tanAlts(a)), wordSteep(steeper ? 'more' : 'less')],
      [tr.toFixed(4), ta.toFixed(4), steeper ? 'steeper' : 'less steep'], t(fr(p, 12) + '\\approx ' + tr.toFixed(4)) + ', ' + t('\\tan ' + dg(a) + '\\approx ' + ta.toFixed(4)) + '; ' + (steeper ? 'steeper' : 'less steep'),
      br(['For the roof, rise is opp and run is adj: ' + t('\\tan\\theta=' + fr(p, 12) + '\\approx ' + tr.toFixed(4)) + '.', t('\\tan ' + dg(a) + '\\approx ' + ta.toFixed(4)) + '.', 'The bigger tangent belongs to the bigger (steeper) angle, so the ' + p + '/12 roof is <b>' + (steeper ? 'steeper' : 'less steep') + '</b> than ' + D(a) + '.']),
      ['A pitch of ' + p + '/12 means rise ÷ run = ' + p + ' ÷ 12: that is the tangent of the roof angle.', 'A bigger tangent means a steeper angle.'], 'pitch');
  }
})(window);
