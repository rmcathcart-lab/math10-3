/* Math 10-3 · Unit 6 · Lesson 6 — Indirect Measurement: Shadows and Mirrors (G3)
 * Assignment 6 (u6_l06.tex, Questions 1–19) and the Lesson 6 Extra Practice (u6_ep06.tex, A 1–4, B 5–11, C 12–14).
 * Every part is a generator: the booklet item's idea and difficulty with new numbers around the booklet's (the lesson's
 * worked-example numbers are left out). Calculator allowed. Lengths to the nearest tenth unless the booklet asks otherwise
 * (a ramp height to the hundredth, a distance to the metre). Checking: HW.u6tri.lenC (HW.geo.lenChk + a nudge when k was
 * rounded too early) with this lesson's traps: the stick's ratio flipped (shadow over height), the mirror ratio flipped,
 * the full height instead of the eye height, your distance to the object instead of the mirror's, 5 ft 3 in read as
 * 5.3 ft, forgetting to divide by the eye-to-ruler distance, the piece instead of the whole distance (street lamp), and
 * forgetting to add the eye height back (sighting over a pole).
 * Conversions (paper → digital):
 *   fill in the blanks → a grid (one word per sentence);  "explain why similar / why at the same time / why 27 m can't be
 *   right / which method on a cloudy day" → multiple choice of reasons;  shadow tables → the table in the stem, one row per
 *   part;  "estimate" → multiple choice of estimates;  "write the proportion" → multiple choice of proportions;  "what
 *   mistake did … make" → multiple choice of mistakes, then the correct value;  "explain why it is more reasonable" →
 *   multiple choice;  "plan how you would find the height of your school" → three parts: the measurements to take (choice),
 *   the height from sample measurements (number), and what could make the answer a little off (choice).
 * Figures: HW.geo.shadowSVG and HW.geo.mirrorSVG; the ruler, river stakes, sighting, street lamp and sloped tube are drawn
 * here with Lesson 6.5's HW.u6tri. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, X = HW.u6tri;

  /* ================= numbers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp == null ? 1 : dp); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function pickR(r, a, b, s) { s = s || 1; return q(a + s * r.int(0, Math.round((b - a) / s))); }
  function f2(x) { return (+x).toFixed(2); }
  function eqR(x, dp) { dp = dp == null ? 1 : dp; return same(x, rd(x, dp)) ? '=' + N(rd(x, dp)) : '=' + nS(+x.toFixed(4)) + (same(x, rd(x, 4)) ? '' : '\\ldots') + '\\approx ' + rd(x, dp).toFixed(dp); }
  function M(x) { return x < 10 && decs(x) === 0 ? (+x).toFixed(1) : N(x); }   // a measured length: 4 → 4.0 (as the booklet writes it)
  function U(x, u, dp) { return t((dp ? (+x).toFixed(dp) : M(x)) + '\\text{ ' + u + '}'); }
  function ftIn(ft, inch) { return ft + ' ft ' + inch + ' in'; }
  var EX = [1.6, 12.8, 1.62, 2.25, 63, 9, 52, 18.4, 2.4, 1.5, 1.7, 400, 18, 30, 10, 7.6, 21, 14.7, 2.1, 1.68];
  function notEx(a) { return a.filter(function (x) { return EX.indexOf(q(x)) >= 0; }).length < 2; }   // not two worked-example numbers together

  /* a proportion answer: X.lenP with prop and kEarly. o: unit, dp, given, num, den (answer = given × num ÷ den), alts, sol, hints, text, nr */
  function prop(prompt, o) {
    var v = o.given * o.num / o.den;
    var alts = (o.alts || []).slice(), fl = o.given * o.den / o.num;   // this lesson's own hints (no generic "new ÷ original" flip hint)
    if (!alts.some(function (x) { return same(x.v, fl); })) alts.push({ v: fl, code: 'prop-flip', hint: 'Keep the same order on both sides (height over distance, or height over shadow). Your ratio is upside down.' });
    alts.push({ v: o.given + o.num - o.den, code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by the same factor; don’t add the difference.' });
    return X.lenP(prompt, v, { unit: o.unit, dp: o.dp == null ? 1 : o.dp, nr: o.nr, kEarly: o.noEarly ? null : { len: o.given, num: o.num, den: o.den }, alts: alts, sol: o.sol, hints: o.hints, text: o.text });
  }
  /* "unknown/a = b/c ⇒ unknown = a × b ÷ c ≈ …" */
  function propSol(name, a, b, c, v, unit, dp, sent) {
    return br([t('\\dfrac{' + name + '}{' + N(a) + '}=\\dfrac{' + N(b) + '}{' + N(c) + '}'), t(N(c) + '\\times ' + name + '=' + N(a) + '\\times ' + N(b) + '=' + nS(+(a * b).toFixed(6))), t(name + '=' + nS(+(a * b).toFixed(6)) + '\\div ' + N(c) + eqR(v, dp)) + (unit ? ' ' + unit : ''), sent]);
  }

  /* ================= figures ================= */
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', RED = '#c93a33', GREEN = '#3f7535', BROWN = '#8a5a2b', SUN = '#e0a100';
  function tree(fg, x, gy, top, w) { w = w || (gy - top) * 0.32; fg.line([x, gy], [x, gy - (gy - top) * 0.45], { color: BROWN, width: 4 }); fg.s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + (top + (gy - top) * 0.33).toFixed(1) + '" rx="' + w.toFixed(1) + '" ry="' + ((gy - top) * 0.33).toFixed(1) + '" fill="#7fb36f" stroke="' + GREEN + '" stroke-width="1.2"/>'; fg.grow(x - w, top).grow(x + w, gy); }
  function eye(fg, P) { fg.s += '<ellipse cx="' + P[0].toFixed(1) + '" cy="' + P[1].toFixed(1) + '" rx="6" ry="3.6" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/><circle cx="' + P[0].toFixed(1) + '" cy="' + P[1].toFixed(1) + '" r="1.8" fill="' + INK + '"/>'; fg.grow(P[0], P[1], 7); }
  /* a ruler held at arm's length: eye height ey (px), eye-to-ruler and distance labels, the reading and the height labels */
  function rulerSVG(lab, o) {
    o = o || {}; var fg = new X.Fig(), gy = 160, E = [0, gy - 55], D = 330, Ht = o.tall ? 145 : 125, B = [D, gy], T = [D, gy - Ht], rx = 115;
    var y1 = E[1] + (B[1] - E[1]) * rx / D, y2 = E[1] + (T[1] - E[1]) * rx / D;
    fg.ground(-20, D + 30, gy);
    if (o.kind === 'turbine') { fg.line(B, T, { width: 4, color: '#6a7182' }); [90, 210, 330].forEach(function (a) { fg.line(T, X.at(T, a, 45), { width: 3, color: '#6a7182' }); }); }
    else if (o.kind === 'bin') { fg.poly([[D - 30, gy], [D - 30, gy - Ht * 0.8], [D, T[1]], [D + 30, gy - Ht * 0.8], [D + 30, gy]], { fill: '#dde1e8', stroke: '#6a7182', width: 1.3 }); }
    else { var d = ''; for (var i = 0; i < 5; i++) { var ya = gy - Ht * i / 5, yb = gy - Ht * (i + 1) / 5, wa = 14 * (1 - i / 5), wb = 14 * (1 - (i + 1) / 5); d += 'M' + (D - wa) + ' ' + ya + 'L' + (D + wb) + ' ' + yb + 'M' + (D + wa) + ' ' + ya + 'L' + (D - wb) + ' ' + yb; } fg.line([D - 14, gy], T, { width: 2, color: '#7b4fc4' }).line([D + 14, gy], T, { width: 2, color: '#7b4fc4' }); fg.path(d, { stroke: '#7b4fc4', width: 1.2 }); }
    fg.line(E, B, { color: SUN, width: 1.6, dash: '6 4' }).line(E, T, { color: SUN, width: 1.6, dash: '6 4' });
    fg.poly([[rx - 4, y2 - 6], [rx + 4, y2 - 6], [rx + 4, y1 + 6], [rx - 4, y1 + 6]], { fill: '#f4e3a1', stroke: '#9a7b2a', width: 1.2 });
    for (var k = 0; k <= 6; k++) { var yy = y1 + (y2 - y1) * k / 6; fg.line([rx - 4, yy], [rx, yy], { color: '#9a7b2a', width: 1 }); }
    eye(fg, E); fg.line([E[0], E[1] + 5], [E[0], gy], { color: '#9aa0ab', width: 1, dash: '3 3' });
    if (lab.e) fg.dim(E, [rx, E[1]], 26, lab.e);
    if (lab.r) fg.text(rx + 9, (y1 + y2) / 2, lab.r, { size: 14, anchor: 'start', color: lab.r === '?' ? RED : INK });
    if (lab.D) fg.dim([0, gy], B, -16, lab.D);
    if (lab.h) fg.text(D + 34, gy - Ht / 2, lab.h, { size: 14, anchor: 'start', color: lab.h === '?' || /^[a-z]$/.test(lab.h) ? RED : INK });
    return fg.svg({ width: 400, aria: 'a ruler held at arm’s length in front of the eye' });
  }
  /* the stake method across a river: T on the far bank, A straight across, B and C along the near bank, D away from the river */
  function riverSVG(ab, bc, cd, lab, o) {
    o = o || {}; var fg = new X.Fig(), ABd = 210, BCd = Math.max(75, Math.min(115, ABd * bc / ab)), rw = 85;   // not to scale: T, B, D stay in line
    var A = [0, rw], T = [0, 0], B = [ABd, rw], C = [ABd + BCd, rw], D = [C[0], rw + rw * BCd / ABd];
    fg.poly([[-30, -6], [C[0] + 40, -6], [C[0] + 40, rw - 4], [-30, rw - 4]], { fill: '#cfe3f7' });
    fg.line([-30, 0], [C[0] + 40, 0], { color: '#6f8fb3', width: 1.5 }).line([-30, rw], [C[0] + 40, rw], { color: '#6f8fb3', width: 1.5 });
    fg.text(ABd * 0.55, rw * 0.3, o.water || 'river', { size: 12, weight: 600, color: '#3d6a99' });
    tree(fg, T[0], T[1], T[1] - 34, 11);
    fg.line(T, A, { dash: '6 4', color: RED, width: 1.8 }).line(A, C, { width: 2 }).line(C, D, { width: 2 }).line(T, D, { color: SUN, width: 1.6 });
    fg.right(A, T, B).right(C, B, D);
    [[A, 'A', [8, 12]], [B, 'B', [0, -14]], [C, 'C', [12, -12]], [D, 'D', [12, 6]]].forEach(function (z) { fg.s += '<circle cx="' + z[0][0].toFixed(1) + '" cy="' + z[0][1].toFixed(1) + '" r="3" fill="' + INK + '"/>'; fg.text(z[0][0] + z[2][0], z[0][1] + z[2][1], z[1], { size: 15, italic: false }); });
    fg.text(T[0] - 18, T[1] - 8, 'T', { size: 15, italic: false });
    if (lab.w) fg.text(A[0] - 14, rw / 2, lab.w, { size: 15, anchor: 'end', color: lab.w === '?' || /^[a-z]$/.test(lab.w) ? RED : INK });
    if (lab.ab) fg.dim(A, B, -18, lab.ab); if (lab.bc) fg.dim(B, C, -18, lab.bc); if (lab.cd) fg.text(D[0] + 8, (C[1] + D[1]) / 2, lab.cd, { size: 14, anchor: 'start' });
    return fg.svg({ width: 400, aria: 'the stake method across a river' });
  }
  /* sighting from an eye at height ey (m) over a stake / pole to a tree or building. o: { ey, d1, h1, d2, h2, lab: { d1, d2, h1, h2, ey }, top: 'tree'|'building', eyeLevel } */
  function sightSVG(o) {
    var fg = new X.Fig(), lab = o.lab || {}, X2 = 330, X1 = Math.max(75, Math.min(150, X2 * o.d1 / (o.d1 + o.d2))), ey = o.ey || 0, gy = 0;   // not to scale across: eye, stake top and the top stay in line
    var sy = 165 / (ey + (o.h1 - ey) * X2 / X1), Y = function (y) { return gy - y * sy; };
    var E = [0, Y(ey)], S = [X1, Y(o.h1)], Tt = [X2, Y(ey + (o.h1 - ey) * X2 / X1)];
    fg.ground(-20, Tt[0] + 40, gy);
    if (o.top === 'building') fg.poly([[Tt[0], gy], [Tt[0], Tt[1]], [Tt[0] + 50, Tt[1]], [Tt[0] + 50, gy]], { fill: '#dde1e8', stroke: '#6a7182', width: 1.3 }); else tree(fg, Tt[0], gy, Tt[1]);
    fg.line([S[0], gy], S, { color: BROWN, width: 3.4 });
    if (o.ey) { fg.line([0, gy], [0, E[1] + 6], { color: '#3a4254', width: 2.4 }); }
    fg.line(E, Tt, { color: SUN, width: 1.7, dash: '6 4' });
    if (o.eyeLevel) fg.line(E, [Tt[0], E[1]], { color: '#9aa0ab', width: 1.2, dash: '3 3' });
    eye(fg, E); fg.right([S[0], gy], [0, gy], S); fg.right([Tt[0], gy], [0, gy], Tt);
    if (lab.h1) fg.text(S[0] + 6, (gy + S[1]) / 2, lab.h1, { size: 14, anchor: 'start' });
    if (lab.h2) fg.text(Tt[0] + (o.top === 'building' ? 56 : (gy - Tt[1]) * 0.32 + 8), (gy + Tt[1]) / 2, lab.h2, { size: 14, anchor: 'start', color: lab.h2 === '?' || /^[a-z]$/.test(lab.h2) ? RED : INK });
    if (lab.ey) fg.text(-8, (gy + E[1]) / 2, lab.ey, { size: 14, anchor: 'end' });
    if (lab.d1) fg.dim([0, gy], [S[0], gy], -16, lab.d1);
    if (lab.d2) fg.dim([S[0], gy], [Tt[0], gy], -16, lab.d2);
    if (lab.d12) fg.dim([0, gy], [Tt[0], gy], -44, lab.d12);
    return fg.svg({ width: 400, aria: o.aria || 'sighting over a stake to the top of a tree' });
  }
  /* a street lamp, a person and the person's shadow */
  function lampSVG(o) {
    var fg = new X.Fig(), lab = o.lab || {}, sx = 320 / (o.D + o.S), sy = Math.min(4, 170 / o.H) * sx / Math.min(4, sx) , gy = 0;
    sy = 160 / o.H; var L = [0, gy - o.H * sy], Pb = [o.D * sx, gy], Ph = [o.D * sx, gy - o.P * sy], Tip = [(o.D + o.S) * sx, gy];
    fg.ground(-20, Tip[0] + 25, gy);
    fg.poly([[0, gy], L, Tip], { fill: '#f6e7a6', fillOpacity: 0.35 });
    fg.line([0, gy], L, { color: '#3a4254', width: 3.4 }).line(L, [L[0] + 18, L[1]], { color: '#3a4254', width: 3 });
    fg.s += '<circle cx="' + (L[0] + 18) + '" cy="' + (L[1] + 4) + '" r="5" fill="#ffd54a" stroke="#9a7b2a"/>'; fg.grow(L[0] + 24, L[1] - 4);
    fg.line(L, Tip, { color: SUN, width: 1.6, dash: '6 4' });
    fg.line(Pb, Ph, { color: '#3a4254', width: 3 }); fg.s += '<circle cx="' + Ph[0].toFixed(1) + '" cy="' + (Ph[1] - 5).toFixed(1) + '" r="5" fill="#fff" stroke="#3a4254" stroke-width="1.6"/>';
    fg.line(Pb, Tip, { color: '#4b4f5a', width: 4.5 });
    fg.right([0, gy], Tip, L); fg.right(Pb, Tip, Ph);
    if (lab.H) fg.text(-8, gy - o.H * sy / 2, lab.H, { size: 14, anchor: 'end', color: lab.H === '?' ? RED : INK });
    if (lab.P) fg.text(Pb[0] + 8, (gy + Ph[1]) / 2, lab.P, { size: 14, anchor: 'start' });
    if (lab.D) fg.dim([0, gy], Pb, -16, lab.D); if (lab.S) fg.dim(Pb, Tip, -16, lab.S);
    return fg.svg({ width: 400, aria: 'a street lamp and a person’s shadow' });
  }
  /* a straight tube sloping up from the ground: a point p along it is hp high; the tube is L long */
  function tubeSVG(o) {
    var fg = new X.Fig(), lab = o.lab || {}, ang = 24, len = 330, gy = 0, A = [0, gy], Tp = X.at(A, ang, len), Pp = X.at(A, ang, len * o.p / o.L);
    fg.ground(-20, Tp[0] + 60, gy);
    fg.poly([[Tp[0] - 4, gy], [Tp[0] - 4, Tp[1] + 10], [Tp[0] + 54, Tp[1] + 10], [Tp[0] + 54, gy]], { fill: '#dde1e8', stroke: '#6a7182', width: 1.2 });
    fg.line(A, Tp, { color: '#3a4254', width: 6 });
    fg.line([Pp[0], gy], Pp, { color: BLUE, width: 1.6, dash: '5 4' }).line([Tp[0], gy], Tp, { color: RED, width: 1.6, dash: '5 4' });
    fg.right([Pp[0], gy], A, Pp).right([Tp[0], gy], A, Tp);
    if (lab.hp) fg.text(Pp[0] + 6, (gy + Pp[1]) / 2 + 4, lab.hp, { size: 14, anchor: 'start', color: BLUE });
    if (lab.H) fg.text(Tp[0] - 8, (gy + Tp[1]) / 2, lab.H, { size: 14, anchor: 'end', color: RED });
    if (lab.p) fg.dim(A, Pp, 16, lab.p); if (lab.L) fg.dim(A, Tp, 44, lab.L);
    return fg.svg({ width: 400, aria: 'a sloping auger tube' });
  }
  function shadowFig(sm, bg, o) { o = o || {}; return G.shadowSVG({ small: sm, big: bg, units: o.units || 'm', width: 420 }); }

  HW.addCodes({
    'u6l6-flip': 'Shadow method: the known ratio flipped (shadow over height)', 'u6l6-full-height': 'Mirror method: used full height, not eye height', 'u6l6-to-object': 'Mirror method: used your distance to the object, not the mirror’s',
    'u6l6-ftin': 'Read feet and inches as a decimal (5 ft 3 in → 5.3)', 'u6l6-no-eye-div': 'Ruler method: didn’t divide by the eye-to-ruler distance', 'u6l6-whole': 'Used a piece instead of the whole distance',
    'u6l6-no-eye-add': 'Forgot to add the eye height back', 'u6l6-full-pole': 'Used the whole pole, not the part above eye level', 'u6l6-ratio-flip': 'Gave the ratio upside down'
  });
  HW.addPartial({ 'u6l6-flip': 'b', 'u6l6-full-height': 's', 'u6l6-to-object': 'b', 'u6l6-ftin': 's', 'u6l6-no-eye-div': 'b', 'u6l6-whole': 'b', 'u6l6-no-eye-add': 's', 'u6l6-full-pole': 'b', 'u6l6-ratio-flip': 'b' });

  /* ================= shadow tables (Q3, Extra 1) ================= */
  /* spec: { a: [pool of known heights], b: [pool of known shadows] (or ratio), find: 'h'|'s', S: [min, max, step] (object shadow / height) } */
  function shadowRow(r, sp) {
    return find(function () { var a = r.pick(sp.a), b = r.pick(sp.b), Z = pickR(r, sp.Z[0], sp.Z[1], sp.Z[2] || 0.1); return sp.find === 'h' ? { a: a, b: b, S: Z, H: q(Z * a / b), find: 'h' } : { a: a, b: b, H: Z, S: q(Z * b / a), find: 's' }; },
      function (v) { return v.a !== v.b && decs(v.H) <= 1 && decs(v.S) <= 1 && v.H > v.a * 2 && notEx([v.a, v.b, v.S, v.H]) && (!sp.not || sp.not.indexOf(v.a + '/' + v.b + '/' + v.S) < 0); }, null) || { a: sp.a[0], b: sp.b[0], S: 6.4, H: q(6.4 * sp.a[0] / sp.b[0]), find: sp.find };
  }
  function shadowTable(rows, heads, names) {
    var TD = 'border:1px solid #c9b79c;padding:4px 10px;text-align:center', th = function (s) { return '<th style="' + TD + ';background:#f6efe2">' + s + '</th>'; }, td = function (s) { return '<td style="' + TD + '">' + s + '</td>'; }, Q = '<span style="color:#c93a33;font-weight:700">?</span>';
    return '<div style="overflow-x:auto"><table style="border-collapse:collapse;margin:6px 0"><tr>' + th('') + heads.map(th).join('') + '</tr>' + rows.map(function (rw, i) {
      var nm = names ? names[i] : ['', ''];
      return '<tr>' + td('(' + 'abcd'.charAt(i) + ')') + td(nm[0] + M(rw.a) + ' m') + td(M(rw.b) + ' m') + td(nm[1] + (rw.find === 'h' ? Q : M(rw.H) + ' m')) + td(rw.find === 's' ? Q : M(rw.S) + ' m') + '</tr>';
    }).join('') + '</table></div>';
  }
  function shadowRowPart(rw, lab, who) {
    who = who || ['stick', 'object'];
    if (rw.find === 'h') return prop('Row ' + lab + ': find the ' + who[1] + '’s height.', { unit: 'm', given: rw.S, num: rw.a, den: rw.b,
      alts: [{ v: rw.S * rw.b / rw.a, code: 'u6l6-flip', hint: 'Keep <b>height over shadow</b> on both sides: ' + t('\\dfrac{h}{' + N(rw.S) + '}=\\dfrac{' + N(rw.a) + '}{' + N(rw.b) + '}') + '.' }],
      sol: propSol('h', rw.S, rw.a, rw.b, rw.S * rw.a / rw.b, 'm', 1), hints: ['Height over shadow on both sides: h ÷ ' + N(rw.S) + ' = ' + N(rw.a) + ' ÷ ' + N(rw.b) + '.'], text: 'shadow row ' + lab });
    return prop('Row ' + lab + ': find the ' + who[1] + '’s shadow.', { unit: 'm', given: rw.H, num: rw.b, den: rw.a,
      alts: [{ v: rw.H * rw.a / rw.b, code: 'u6l6-flip', hint: 'Now the <b>shadow</b> is missing: ' + t('\\dfrac{' + N(rw.H) + '}{s}=\\dfrac{' + N(rw.a) + '}{' + N(rw.b) + '}') + ', so s = ' + N(rw.H) + ' × ' + N(rw.b) + ' ÷ ' + N(rw.a) + '.' }],
      sol: br([t('\\dfrac{' + N(rw.H) + '}{s}=\\dfrac{' + N(rw.a) + '}{' + N(rw.b) + '}'), t(N(rw.a) + '\\times s=' + N(rw.H) + '\\times ' + N(rw.b) + '=' + nS(+(rw.H * rw.b).toFixed(6))), t('s=' + nS(+(rw.H * rw.b).toFixed(6)) + '\\div ' + N(rw.a) + eqR(rw.S)) + ' m']),
      hints: ['The shadow is the unknown now. Keep height over shadow: ' + N(rw.H) + ' ÷ s = ' + N(rw.a) + ' ÷ ' + N(rw.b) + '.', 'Cross-multiply: ' + N(rw.a) + ' × s = ' + N(rw.H) + ' × ' + N(rw.b) + '.'], text: 'shadow row ' + lab });
  }

  /* ================= mirror helpers ================= */
  function mirrorFig(s, lab, kind) { return G.mirrorSVG({ eye: s.e, d1: s.d1, d2: s.d2, h: s.e * s.d2 / s.d1, kind: kind || 'building', labels: lab }); }
  function mirrorH(prompt, s, o) {
    o = o || {}; var v = s.e * s.d2 / s.d1, alts = [{ v: s.d2 * s.d1 / s.e, code: 'prop-flip', hint: 'Height over distance on both sides: ' + t('\\dfrac{h}{' + N(s.d2) + '}=\\dfrac{' + N(s.e) + '}{' + N(s.d1) + '}') + '.' }, { v: s.e * (s.d1 + s.d2) / s.d1, code: 'u6l6-to-object', hint: 'Use the distance from the <b>mirror</b> to the object (' + N(s.d2) + ' m), not your distance to it.' }];
    if (s.full) alts.push({ v: s.full * s.d2 / s.d1, code: 'u6l6-full-height', hint: 'Use the height of the <b>eyes</b> (' + f2(s.e) + ' m), not the full height: the light goes to the eyes.' });
    return prop(prompt, { unit: 'm', given: s.d2, num: s.e, den: s.d1, alts: alts, sol: propSol('h', s.d2, s.e, s.d1, v, 'm', 1, o.end), hints: ['Height over distance to the mirror, on both sides: h ÷ ' + N(s.d2) + ' = ' + f2(s.e) + ' ÷ ' + N(s.d1) + '.'], text: o.text || 'mirror height' });
  }
  /* how far from the mirror to stand: d = eye × d2 ÷ H */
  function mirrorD(prompt, s, o) {
    o = o || {}; var v = s.e * s.d2 / s.H;
    return prop(prompt, { unit: 'm', given: s.d2, num: s.e, den: s.H, alts: [{ v: s.d2 * s.H / s.e, code: 'prop-flip', hint: 'Height over distance on both sides: ' + t('\\dfrac{' + N(s.H) + '}{' + N(s.d2) + '}=\\dfrac{' + f2(s.e) + '}{d}') + '. Your eyes are lower than the ' + o.what + ', so you stand closer to the mirror.' }, { v: s.H * s.d2 / s.e, code: 'prop-flip', hint: 'Your eyes are lower than the ' + o.what + ', so you stand <b>closer</b> to the mirror than ' + N(s.d2) + ' m.' }],
      sol: br([t('\\dfrac{' + N(s.H) + '}{' + N(s.d2) + '}=\\dfrac{' + f2(s.e) + '}{d}'), t(N(s.H) + '\\times d=' + N(s.d2) + '\\times ' + f2(s.e) + '=' + nS(+(s.d2 * s.e).toFixed(6))), t('d=' + nS(+(s.d2 * s.e).toFixed(6)) + '\\div ' + N(s.H) + eqR(v)) + ' m', o.end]),
      hints: ['Height over distance to the mirror: ' + N(s.H) + ' ÷ ' + N(s.d2) + ' = ' + f2(s.e) + ' ÷ d.', 'Cross-multiply, then divide by ' + N(s.H) + '.'], text: o.text || 'mirror distance' });
  }
  function rulerH(prompt, s, o) {
    o = o || {}; var v = s.D * s.r / s.e;
    return prop(prompt, { unit: 'm', given: s.D, num: s.r, den: s.e, alts: [{ v: s.D * s.e / s.r, code: 'prop-flip', hint: 'Keep the same order on both sides: ' + t('\\dfrac{h}{' + N(s.D) + '}=\\dfrac{' + N(s.r) + '}{' + N(s.e) + '}') + ' (height over distance).' }, { v: s.D * s.r, code: 'u6l6-no-eye-div', hint: 'Divide by the eye-to-ruler distance (' + N(s.e) + ' cm) too: h = ' + N(s.D) + ' × ' + N(s.r) + ' ÷ ' + N(s.e) + '.' }, { v: s.D * s.r / s.e / 100, code: 'units', hint: 'No unit change is needed: ' + N(s.r) + ' cm ÷ ' + N(s.e) + ' cm has no unit, so the height comes out in metres.' }],
      sol: propSol('h', s.D, s.r, s.e, v, 'm', 1, o.end), hints: ['The ruler reading over the eye-to-ruler distance = the height over the distance to the object.', 'Both ruler numbers are in cm, so the height comes out in metres.'], text: o.text || 'ruler height' });
  }

  /* ================= MC builders ================= */
  function whySunMC(r, who, obj) {
    return P.mc(r, 'Explain why the triangle made by ' + who + ' and ' + (who === 'a person' ? 'her' : 'its') + ' shadow is similar to the triangle made by ' + obj + ' and its shadow, when both shadows are measured at the same time.', [
      { html: 'Both have a right angle where they meet the level ground, and the sun’s rays are parallel, so the angles at the tips of the shadows are equal (AA).', right: true },
      { html: 'Both shadows are on the same ground, so the shadows are the same length.', why: 'The shadows are <b>not</b> the same length: the taller object has the longer shadow. Look for two pairs of equal angles.', code: 'same' },
      { html: 'All right triangles are similar.', why: 'Not all right triangles are similar. These are, because the sun’s angle is the same for both.', code: 'all' },
      { html: 'Both objects are about the same height.', why: 'They are very different heights. Similarity is about equal <b>angles</b>: the right angles and the sun’s angle.', code: 'height' }],
      'Both triangles have a right angle where the object meets the level ground. The sun’s rays are parallel, so both have the same angle at the tip of the shadow. Two pairs of equal angles, so the triangles are similar (AA).', ['Which angle is 90° in each triangle? What do the sun’s rays have in common?'], 'why shadows similar');
  }
  function shadowEstMC(r, s) {
    var tr = s.S / s.b * s.a, R = Math.round(tr / 5) * 5, fl = s.S * s.b / s.a, ad = s.S + s.a - s.b;
    var opts = [{ html: 'About ' + R + ' m', right: true }], used = [R];
    [[Math.round(fl / 5) * 5, 'That uses shadow over height for the person. Estimate how many times longer the big shadow is, then multiply the height by that.', 'flip'], [Math.round(ad / 5) * 5, 'Similar triangles multiply; they don’t add the same amount.', 'add'], [Math.round(s.S / 5) * 5, 'The person’s height and shadow are different, so the ' + s.obj + ' isn’t the same height as its shadow.', 'same'], [R * 2, 'Too big: estimate the number of times longer, then multiply ' + N(s.a) + ' m by it.', 'double'], [Math.round(R / 2 / 5) * 5, 'Too small: estimate the number of times longer, then multiply ' + N(s.a) + ' m by it.', 'half']].forEach(function (w) {
      if (opts.length < 4 && w[0] > 0 && used.every(function (u) { return Math.abs(u - w[0]) >= 8; })) { used.push(w[0]); opts.push({ html: 'About ' + w[0] + ' m', why: w[1], code: w[2] }); }
    });
    var times = Math.round(s.S / s.b);
    return P.mc(r, 'Estimate the height of the ' + s.obj + '.', opts, 'The ' + s.obj + '’s shadow is about ' + t(N(rd(s.S, 0)) + '\\div ' + N(rd(s.b, 1)) + '\\approx ' + times) + ' times as long as ' + s.who + '’s. So the ' + s.obj + ' is about ' + t(times + '\\times ' + N(rd(s.a, 1)) + '\\approx ' + Math.round(times * s.a)) + ' m tall: about ' + R + ' m.', ['How many times as long is the big shadow? Multiply the height by about that many.'], 'shadow estimate');
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u6l6', unit: 6, num: '6', title: 'Indirect Measurement: Shadows and Mirrors', outcome: 'G3',
    blurb: 'Heights and distances you can’t reach: the shadow method, the mirror method, a ruler at arm’s length, and stakes across a river.',
    questions: [
      { num: '1', stem: 'Fill in the blanks.', parts: [
        { id: '1', sub: 'a–d', level: 'BEG', make: function (r) {
          var rows = [{ id: 'a', html: '(a) The sun’s rays are ____, so at the same moment they hit nearby objects at the same angle.' }, { id: 'b', html: '(b) A flagpole on level ground makes a ____ angle with its shadow.' }, { id: 'c', html: '(c) With a mirror, the angle in is ____ the angle out.' }, { id: 'd', html: '(d) In the mirror method, use your ____ height, not your full height.' }];
          var cols = [{ id: 'par', html: 'parallel' }, { id: 'right', html: 'right (90°)' }, { id: 'eq', html: 'equal to' }, { id: 'eye', html: 'eye' }, { id: 'perp', html: 'perpendicular' }, { id: 'double', html: 'double' }];
          var want = { a: 'par', b: 'right', c: 'eq', d: 'eye' };
          return P.grid('Choose the word for each blank.', rows, r.shuffle(cols), want, { why: function (row) { return { a: 'The sun is very far away, so its rays come down side by side, never meeting.', b: 'The pole stands straight up from level ground.', c: 'Light bounces off a mirror at the same angle it hits it.', d: 'The light goes to your eyes, not the top of your head.' }[row]; } },
            '(a) parallel &nbsp; (b) right (90°) &nbsp; (c) equal to &nbsp; (d) eye', ['Think of the key ideas: parallel rays, a right angle at the ground, angle in = angle out, eye height.'], 'fill in the blanks');
        } }] },
      { num: '2', stem: '', parts: [{ id: '2', level: 'EMG', make: function (r) { return whySunMC(r, r.pick(['a person', 'a fence post', 'a metre stick']), r.pick(['a tree', 'a flagpole', 'a grain bin', 'a light pole'])); } }] },
      { num: '3', stem: function (sh) { return 'In each row, the two shadows were measured at the same time. Find the missing length.' + shadowTable(sh, ['Stick height', 'Stick shadow', 'Object height', 'Object shadow']); },
        shared: function (r) { return [shadowRow(r, { a: [1], b: [0.8, 0.5, 1.25, 0.4], find: 'h', Z: [3, 9, 0.1] }), shadowRow(r, { a: [2, 1.5, 3], b: [3, 2.5, 4.5, 4], find: 'h', Z: [9, 20, 0.1] }), shadowRow(r, { a: [1.2, 1.6, 1.4, 0.8], b: [0.9, 0.6, 1.2, 0.5], find: 'h', Z: [8, 24, 0.1] }), shadowRow(r, { a: [1.5, 1.2, 2.5, 0.8], b: [2.5, 2, 3, 1.2], find: 's', Z: [4, 12, 0.1] })]; },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { return shadowRowPart(sh[0], '(a)'); } },
          { id: '3b', level: 'EMG', make: function (r, sh) { return shadowRowPart(sh[1], '(b)'); } },
          { id: '3c', level: 'EMG', make: function (r, sh) { return shadowRowPart(sh[2], '(c)'); } },
          { id: '3d', level: 'PRG', make: function (r, sh) { return shadowRowPart(sh[3], '(d)'); } }] },
      { num: '4', stem: function (sh) { return 'At noon in June, a ' + U(sh.a, 'm', 2) + ' tall child casts a shadow only ' + U(sh.b, 'm', 2) + ' long. At the same time, a light pole casts a shadow ' + U(sh.S, 'm') + ' long.'; },
        shared: function (r) { return find(function () { var k = r.pick([2, 2.5, 3, 4]), b = r.pick([0.4, 0.5, 0.6]); return { k: k, b: b, a: q(k * b), S: pickR(r, 1.8, 4.2, 0.1) }; }, function (s) { s.H = q(s.k * s.S); return decs(s.H) <= 1 && s.a >= 1.2 && s.a <= 1.8 && decs(s.H) <= 2 && !(s.a === 1.5 && s.b === 0.5 && s.S === 2.9); }, { k: 3, b: 0.5, a: 1.5, S: 2.9, H: 8.7 }); },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) { return X.lenP('How many times as long as her shadow is the child?', sh.k, { dp: 1, alts: [{ v: sh.b / sh.a, code: 'u6l6-ratio-flip', hint: 'Divide the child’s <b>height</b> by her shadow: ' + t(f2(sh.a) + '\\div ' + f2(sh.b)) + '.' }, { v: sh.a - sh.b, code: 'prop-add', hint: '“How many times as long” means divide: height ÷ shadow.' }], sol: t(f2(sh.a) + '\\div ' + f2(sh.b) + '=' + N(sh.k)) + ' times.', hints: ['How many times as long = height ÷ shadow.'], text: 'times as tall' }); } },
          { id: '4b', level: 'BEG', make: function (r, sh) { return X.lenP('Use your answer to (a) to find the height of the light pole.', sh.H, { unit: 'm', dp: Math.max(1, decs(sh.H)), alts: [{ v: sh.S / sh.k, code: 'k-mul-div', hint: 'Every object is ' + N(sh.k) + ' times as tall as its shadow right now, so <b>multiply</b> the pole’s shadow by ' + N(sh.k) + '.' }, { v: sh.S + sh.a - sh.b, code: 'prop-add', hint: 'Multiply by ' + N(sh.k) + '; don’t add the difference.' }], sol: 'Every object is ' + N(sh.k) + ' times as tall as its shadow: ' + t(N(sh.k) + '\\times ' + N(sh.S) + '=' + N(sh.H)) + ' m. The light pole is ' + N(sh.H) + ' m tall.', hints: ['Height = ' + N(sh.k) + ' × shadow.'], text: 'light pole' }); } }] },
      { num: '5', stem: function (sh) { return 'At a summer fair, ' + sh.who + ' is ' + U(sh.a, 'm', 2) + ' tall and casts a ' + U(sh.b, 'm', 2) + ' shadow. At the same moment, the ' + sh.obj + ' casts a shadow ' + U(sh.S, 'm') + ' long.' + shadowFig({ h: sh.a, shadow: sh.b, kind: 'person', label: { h: f2(sh.a) + ' m', s: f2(sh.b) + ' m' } }, { h: sh.a * sh.S / sh.b, shadow: sh.S, kind: sh.kind, label: { h: '?', s: M(sh.S) + ' m' } }); },
        shared: function (r) { var o = r.pick([['Ferris wheel', 'tower'], ['climbing tower', 'tower'], ['flagpole', 'flag']]); return find(function () { return { who: r.pick(['Brooke', 'Aisha', 'Mateo', 'Dani']), obj: o[0], kind: o[1], a: pickR(r, 1.55, 1.85, 0.01), b: pickR(r, 1.0, 1.4, 0.05), S: pickR(r, 18, 36, 0.5) }; }, function (s) { s.H = s.a * s.S / s.b; return !same(rd(s.H, 1), s.H) && s.b < s.a * 0.85 && Math.abs(s.H / 5 - Math.round(s.H / 5)) < 0.35 && !(s.a === 1.74 && s.b === 1.2); }, { who: 'Brooke', obj: 'Ferris wheel', kind: 'tower', a: 1.74, b: 1.2, S: 31.5, H: 45.675 }); },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { return shadowEstMC(r, sh); } },
          { id: '5b', level: 'EMG', make: function (r, sh) { return prop('Find the height of the ' + sh.obj + ' to the nearest tenth of a metre.', { unit: 'm', given: sh.S, num: sh.a, den: sh.b, alts: [{ v: sh.S * sh.b / sh.a, code: 'u6l6-flip', hint: 'Height over shadow on both sides: ' + t('\\dfrac{h}{' + N(sh.S) + '}=\\dfrac{' + f2(sh.a) + '}{' + f2(sh.b) + '}') + '.' }],
            sol: propSol('h', sh.S, sh.a, sh.b, sh.H, 'm', 1, 'The ' + sh.obj + ' is about ' + N(rd(sh.H)) + ' m tall, close to the estimate ✓'), hints: ['Height over shadow: h ÷ ' + N(sh.S) + ' = ' + f2(sh.a) + ' ÷ ' + f2(sh.b) + '.'], text: 'fair height' }); } }] },
      { num: '6', stem: '', parts: [
        { id: '6', level: 'PRG', make: function (r) {
          var s = find(function () { return { ft: r.int(4, 5), inch: r.pick([3, 6, 9]), sh: r.int(5, 9), S: r.int(20, 48), who: r.pick(['girl', 'boy']) }; }, function (v) { v.a = v.ft + v.inch / 12; v.H = v.S * v.a / v.sh; v.bad = v.S * (v.ft + v.inch / 10) / v.sh; return v.sh > v.a + 0.5 && !same(rd(v.bad, 1), rd(v.H, 1)) && decs(v.H) <= 3; }, { ft: 5, inch: 3, sh: 7, S: 36, who: 'girl', a: 5.25, H: 27, bad: 27.26 });
          return prop('A ' + s.who + ' who is ' + ftIn(s.ft, s.inch) + ' tall casts a shadow ' + s.sh + ' ft long. At the same time, a flagpole casts a shadow ' + s.S + ' ft long. How tall is the flagpole, to the nearest tenth of a foot? (Hint: change ' + ftIn(s.ft, s.inch) + ' to feet first.)', { unit: 'ft', given: s.S, num: s.a, den: s.sh,
            alts: [{ v: s.bad, code: 'u6l6-ftin', hint: s.inch + ' in is ' + t('\\tfrac{' + s.inch + '}{12}') + ' of a foot, not 0.' + s.inch + ' ft. So ' + ftIn(s.ft, s.inch) + ' = ' + N(s.a) + ' ft.' }, { v: s.S * s.sh / s.a, code: 'u6l6-flip', hint: 'Height over shadow on both sides.' }, { v: s.S * s.ft / s.sh, code: 'u6l6-ftin', hint: 'Don’t leave out the ' + s.inch + ' inches: ' + ftIn(s.ft, s.inch) + ' = ' + N(s.a) + ' ft.' }],
            sol: br([ftIn(s.ft, s.inch) + ' ' + t('=' + s.ft + '\\tfrac{' + s.inch + '}{12}\\text{ ft}=' + N(s.a) + '\\text{ ft}'), propSol('h', s.S, s.a, s.sh, s.H, 'ft', 1, 'The flagpole is about ' + N(rd(s.H)) + ' ft tall.')]), hints: ['12 in = 1 ft, so ' + s.inch + ' in = ' + s.inch + ' ÷ 12 ft.', 'Height over shadow: h ÷ ' + s.S + ' = height ÷ ' + s.sh + '.'], text: 'feet and inches' });
        } }] },
      { num: '7', stem: function (sh) { return sh.who + ' uses a mirror to find the height of the ' + sh.obj + '. Find the height ' + t('h') + ' to the nearest tenth of a metre.' + mirrorFig(sh, { eye: f2(sh.e) + ' m', d1: M(sh.d1) + ' m', d2: M(sh.d2) + ' m', h: 'h' }, sh.kind); },
        shared: function (r) { var o = r.pick([['gym wall', 'building'], ['flagpole', 'flag'], ['tree', 'tree']]); return find(function () { return { who: r.pick(['Hannah', 'Kenji', 'Sofia', 'Omar']), obj: o[0], kind: o[1], e: pickR(r, 1.4, 1.75, 0.05), d1: pickR(r, 1.5, 3, 0.1), d2: pickR(r, 6, 15, 0.5) }; }, function (s) { var h = s.e * s.d2 / s.d1; return h > 4 && h < 16 && s.d2 / s.d1 > 3 && notEx([s.e, s.d1, s.d2]) && !(s.e === 1.6 && s.d1 === 2 && s.d2 === 9.5); }, { who: 'Hannah', obj: 'gym wall', kind: 'building', e: 1.6, d1: 2, d2: 9.5 }); },
        parts: [{ id: '7', level: 'EMG', make: function (r, sh) { return mirrorH('Find ' + t('h') + '.', sh, { end: 'The ' + sh.obj + ' is about ' + N(rd(sh.e * sh.d2 / sh.d1)) + ' m tall.' }); } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var s = find(function () { return { H: 3.05, d2: pickR(r, 3.0, 6.0, 0.1), e: pickR(r, 1.3, 1.6, 0.05), who: r.pick(['Leo', 'Maya', 'Jaya', 'Liam']) }; }, function (v) { var d = v.e * v.d2 / v.H; return !same(rd(d, 1), d) && !(v.d2 === 4.2 && v.e === 1.45); }, { H: 3.05, d2: 4.2, e: 1.45, who: 'Leo' });
          return mirrorD('The rim of a basketball hoop is 3.05 m above the floor. ' + s.who + ' puts a mirror on the floor, ' + U(s.d2, 'm') + ' from the point straight below the rim. ' + (s.who === 'Maya' || s.who === 'Jaya' ? 'Her' : 'His') + ' eyes are ' + U(s.e, 'm', 2) + ' above the floor. How far from the mirror must ' + (s.who === 'Maya' || s.who === 'Jaya' ? 'she' : 'he') + ' stand to see the rim in the mirror? Round to the nearest tenth of a metre.' + G.mirrorSVG({ eye: s.e, d1: s.e * s.d2 / s.H, d2: s.d2, h: s.H, kind: 'pole', labels: { eye: f2(s.e) + ' m', d1: '?', d2: M(s.d2) + ' m', h: '3.05 m' } }), s, { what: 'rim', end: s.who + ' must stand about ' + N(rd(s.e * s.d2 / s.H)) + ' m from the mirror.', text: 'hoop mirror' });
        } }] },
      { num: '9', stem: function (sh) { return sh.who + '’s eyes are ' + U(sh.e, 'm', 2) + ' above the ground. She stands ' + U(sh.d1, 'm') + ' from a mirror, and the mirror is ' + U(sh.d2, 'm') + ' from a building. She writes:<div style="margin:6px 0 6px 18px">' + t('\\dfrac{h}{' + N(q(sh.d1 + sh.d2)) + '}=\\dfrac{' + f2(sh.e) + '}{' + N(sh.d1) + '}') + ', so ' + t('h=' + N(rd(sh.bad, 1))) + ' m.</div>'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Grace', 'Noor', 'Rosa', 'Hana']), e: pickR(r, 1.45, 1.7, 0.01), d1: pickR(r, 1.2, 2.2, 0.1), d2: pickR(r, 8, 16, 0.2) }; }, function (s) { s.h = s.e * s.d2 / s.d1; s.bad = s.e * (s.d1 + s.d2) / s.d1; return !same(rd(s.h, 1), s.h) && decs(s.d1 + s.d2) <= 1 && notEx([s.e, s.d1, s.d2]) && !(s.e === 1.54 && s.d1 === 1.4); }, { who: 'Grace', e: 1.54, d1: 1.4, d2: 12.6, h: 13.86, bad: 15.4 }); },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) { var w = sh.who, tot = N(q(sh.d1 + sh.d2));
            return P.mc(r, 'What mistake did ' + w + ' make?', [
              { html: 'She used ' + tot + ' m, the distance from <b>herself</b> to the building. The proportion needs the distance from the <b>mirror</b> to the building, ' + N(sh.d2) + ' m.', right: true },
              { html: 'She should have used her full height, not her eye height.', why: 'Eye height is right: the light goes to her eyes.', code: 'full' },
              { html: 'Her ratio is upside down: it should be ' + t('\\dfrac{h}{' + tot + '}=\\dfrac{' + N(sh.d1) + '}{' + f2(sh.e) + '}') + '.', why: 'Height over distance on both sides is the right order. Look at the ' + tot + ' m.', code: 'flip' },
              { html: 'She should have added her eye height to the answer.', why: 'The mirror is on the ground, so nothing is added. Look at which distance she used.', code: 'add' }],
              'She used ' + t(N(sh.d1) + '+' + N(sh.d2) + '=' + tot) + ' m, her own distance to the building. The building’s triangle runs from the <b>mirror</b> to the building: ' + N(sh.d2) + ' m.', ['Which two triangles meet at the mirror? Where does the building’s triangle start?'], 'mirror mistake'); } },
          { id: '9b', level: 'PRG', make: function (r, sh) { var s = { e: sh.e, d1: sh.d1, d2: sh.d2 }; var p = mirrorH('Find the correct height, to the nearest tenth of a metre.', s, { end: 'The building is about ' + N(rd(sh.h)) + ' m tall.', text: 'mirror corrected' }); return p; } }] },
      { num: '10', stem: '', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var s = find(function () { return { e: r.pick([50, 55, 60, 65, 70]), D: r.pick([150, 200, 250, 300, 350, 450, 500]), r: pickR(r, 4, 20, 0.5), who: r.pick(['Maddox', 'Kai', 'Sofia', 'Ben']), what: r.pick(['radio tower', 'water tower', 'grain elevator']) }; }, function (v) { v.h = v.D * v.r / v.e; return decs(v.h) <= 1 && v.h >= 15 && v.h <= 90 && !(v.e === 60 && v.D === 400) && !(v.e === 65 && v.D === 250 && v.r === 13); }, { e: 65, D: 250, r: 13, who: 'Maddox', what: 'radio tower', h: 50 });
          return rulerH(s.who + ' holds a ruler upright ' + s.e + ' cm from ' + (s.who === 'Sofia' ? 'her' : 'his') + ' eye. A ' + s.what + ' ' + s.D + ' m away covers ' + N(s.r) + ' cm of the ruler, from its base to its top. How tall is the ' + s.what + '?' + rulerSVG({ e: s.e + ' cm', D: s.D + ' m', r: N(s.r) + ' cm', h: 'h' }, { kind: s.what === 'grain elevator' ? 'bin' : 'tower' }), s, { end: 'The ' + s.what + ' is ' + N(rd(s.h)) + ' m tall. (Check: ' + t(N(s.r) + '\\div ' + s.e + (same(s.r / s.e, rd(s.r / s.e, 3)) ? '=' : '\\approx ') + N(rd(s.r / s.e, 3))) + ' of ' + s.D + ' m.)' });
        } }] },
      { num: '11', stem: function (sh) { return sh.who + ' lies on the ground with her eye at ground level. She pushes a ' + U(sh.h1, 'm') + ' stake into the ground ' + U(sh.d1, 'm') + ' from her eye. She moves until the top of the stake lines up with the top of a tree. Her eye is then ' + U(sh.D, 'm') + ' from the tree.' + sightSVG({ d1: sh.d1, h1: sh.h1, d2: sh.D - sh.d1, h2: sh.h1 * sh.D / sh.d1, lab: { h1: M(sh.h1) + ' m', h2: 'h', d1: M(sh.d1) + ' m', d12: M(sh.D) + ' m' } }); },
        shared: function (r) { return find(function () { return { who: r.pick(['Ella', 'Maya', 'Aisha', 'Kayla']), h1: pickR(r, 1.0, 2.0, 0.1), d1: pickR(r, 3.0, 5.0, 0.5), D: pickR(r, 15, 30, 0.2) }; }, function (s) { s.h = s.h1 * s.D / s.d1; return decs(s.h) <= 1 && s.h > 4 && s.h < 14 && !(s.h1 === 1.5 && s.d1 === 4 && s.D === 22.4); }, { who: 'Ella', h1: 1.5, d1: 4, D: 22.4, h: 8.4 }); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r) { return P.mc(r, 'Why are the two triangles similar?', [{ html: 'They share the angle at her eye, and both have a right angle at the ground (the stake and the tree are upright). AA.', right: true },
            { html: 'The stake and the tree are the same height.', why: 'They are very different heights. Use the angles: one shared, and the right angles.', code: 'height' }, { html: 'The sun’s rays are parallel.', why: 'This method uses a line of sight, not the sun. The triangles share the angle at her eye.', code: 'sun' },
            { html: 'Angle in = angle out at the stake.', why: 'That is the mirror method. Here the two triangles share the angle at her eye.', code: 'mirror' }], 'Both triangles share the angle at her eye, and both have a right angle at the ground (the stake and the tree stand straight up). Two pairs of equal angles: similar (AA).', ['Look at the eye: which angle do both triangles have?'], 'why sighting similar'); } },
          { id: '11b', level: 'EMG', make: function (r, sh) { return prop('How tall is the tree?', { unit: 'm', dp: Math.max(1, decs(sh.h)), given: sh.D, num: sh.h1, den: sh.d1, alts: [{ v: sh.D * sh.d1 / sh.h1, code: 'prop-flip', hint: 'Height over distance on both sides: ' + t('\\dfrac{h}{' + N(sh.D) + '}=\\dfrac{' + N(sh.h1) + '}{' + N(sh.d1) + '}') + '.' }, { v: sh.h1 * (sh.D - sh.d1) / sh.d1, code: 'u6l6-whole', hint: 'Use the whole distance from her eye to the tree (' + N(sh.D) + ' m), not the part past the stake.' }],
            sol: propSol('h', sh.D, sh.h1, sh.d1, sh.h, 'm', Math.max(1, decs(sh.h)), 'The tree is ' + N(sh.h) + ' m tall.'), hints: ['Height over distance from the eye: h ÷ ' + N(sh.D) + ' = ' + N(sh.h1) + ' ÷ ' + N(sh.d1) + '.'], text: 'tree by sighting' }); } }] },
      { num: '12', stem: function (sh) { return 'A creek runs through a coulee. To find its width ' + t('w') + ', ' + sh.who + ' sets up the stake method as shown: ' + t('AB=' + sh.ab) + ' m, ' + t('BC=' + sh.bc) + ' m and ' + t('CD=' + N(sh.cd)) + ' m.' + riverSVG(sh.ab, sh.bc, sh.cd, { w: 'w', ab: sh.ab + ' m', bc: sh.bc + ' m', cd: M(sh.cd) + ' m' }, { water: 'creek' }); },
        shared: function (r) { return find(function () { return { who: r.pick(['Marcus', 'Tyler', 'Priya', 'Omar']), ab: r.int(24, 48), bc: r.int(6, 15), cd: pickR(r, 3.5, 9.5, 0.5) }; }, function (s) { s.w = s.ab * s.cd / s.bc; return decs(s.w) <= 1 && s.ab / s.bc >= 2 && s.ab / s.bc <= 6 && !(s.ab === 36 && s.bc === 9 && s.cd === 5.5) && !(s.ab === 30 && s.bc === 10); }, { who: 'Marcus', ab: 36, bc: 9, cd: 5.5, w: 22 }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) { var f = function (a, b, c, d) { return t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{' + c + '}{' + d + '}'); };
            return P.mc(r, 'Which proportion is right?', [{ html: f('w', sh.ab, N(sh.cd), sh.bc), right: true }, { html: f('w', sh.ab, sh.bc, N(sh.cd)), why: 'The second ratio is flipped. ' + t('TA') + ' over ' + t('AB') + ' matches ' + t('DC') + ' over ' + t('CB') + '.', code: 'flip' },
              { html: f('w', sh.bc, N(sh.cd), sh.ab), why: t('TA') + ' (w) matches ' + t('DC') + ', and ' + t('AB') + ' matches ' + t('CB') + '. Keep the big triangle’s sides together on the left.', code: 'mixed' }, { html: f('w', sh.ab + sh.bc, N(sh.cd), sh.bc), why: 'The big triangle is ' + t('TAB') + ': its side along the bank is ' + t('AB') + ' only, not ' + t('AC') + '.', code: 'whole' }],
              t('\\triangle TAB\\sim\\triangle DCB') + ', so ' + t('\\dfrac{TA}{AB}=\\dfrac{DC}{CB}') + ': ' + f('w', sh.ab, N(sh.cd), sh.bc), ['T matches D, A matches C, and B matches B.'], 'creek proportion'); } },
          { id: '12b', level: 'EMG', make: function (r, sh) { return prop('How wide is the creek?', { unit: 'm', given: sh.ab, num: sh.cd, den: sh.bc, alts: [{ v: sh.ab * sh.bc / sh.cd, code: 'prop-flip', hint: 'Keep the order: ' + t('\\dfrac{w}{' + sh.ab + '}=\\dfrac{' + N(sh.cd) + '}{' + sh.bc + '}') + '.' }, { v: (sh.ab + sh.bc) * sh.cd / sh.bc, code: 'u6l6-whole', hint: 'Use ' + t('AB') + ' only (' + sh.ab + ' m), not ' + t('AB+BC') + '.' }],
            sol: propSol('w', sh.ab, sh.cd, sh.bc, sh.w, 'm', 1, 'The creek is ' + N(sh.w) + ' m wide.' + (Number.isInteger(sh.ab / sh.bc) ? ' (Check: ' + t('AB') + ' is ' + sh.ab / sh.bc + ' times ' + t('BC') + ', and ' + t(sh.ab / sh.bc + '\\times ' + N(sh.cd) + '=' + N(sh.w)) + ' ✓)' : '')), hints: ['w ÷ ' + sh.ab + ' = ' + N(sh.cd) + ' ÷ ' + sh.bc + '.'], text: 'creek width' }); } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'EMG', make: function (r) {
          var s = find(function () { return { d1: pickR(r, 1.8, 3.6, 0.2), h1: pickR(r, 0.15, 0.3, 0.01), d2: pickR(r, 5, 9, 0.2) }; }, function (v) { v.h = v.h1 * v.d2 / v.d1; return decs(v.h) <= 3 && v.d2 / v.d1 > 2 && v.d2 / v.d1 < 4.2 && !(v.d1 === 2.4 && v.h1 === 0.2 && v.d2 === 7.2); }, { d1: 2.4, h1: 0.2, d2: 7.2, h: 0.6 });
          return prop('A wheelchair ramp rises at a steady slope. A support post stands ' + U(s.d1, 'm') + ' along the ground from the bottom of the ramp, and it is ' + U(s.h1, 'm', 2) + ' tall. The top of the ramp is ' + U(s.d2, 'm') + ' along the ground from the bottom. How high is the top of the ramp? Round to the nearest hundredth of a metre.' + X.slopeSVG({ d1: s.d1, h1: s.h1, d2: s.d2, h2: s.h, dashed: true, beyond: true, lab: { d1: M(s.d1) + ' m', d2: M(s.d2) + ' m', h1: f2(s.h1) + ' m', h2: 'h' } }), { unit: 'm', dp: 2, given: s.d2, num: s.h1, den: s.d1,
            alts: [{ v: s.d2 * s.d1 / s.h1, code: 'prop-flip', hint: 'Height over distance on both sides: ' + t('\\dfrac{h}{' + N(s.d2) + '}=\\dfrac{' + f2(s.h1) + '}{' + N(s.d1) + '}') + '.' }, { v: s.h1 * (s.d2 - s.d1) / s.d1, code: 'u6l6-whole', hint: 'Use the whole distance from the bottom (' + N(s.d2) + ' m), not the part past the post.' }],
            sol: br(['The small and big triangles share the angle at the bottom and both have a right angle, so they are similar.', propSol('h', s.d2, s.h1, s.d1, s.h, 'm', 2, 'The top of the ramp is about ' + rd(s.h, 2).toFixed(2) + ' m high.')]), hints: ['h ÷ ' + N(s.d2) + ' = ' + f2(s.h1) + ' ÷ ' + N(s.d1) + '.'], text: 'ramp top' });
        } }] },
      { num: '14', stem: function (sh) { return sh.who + ' measured the shadow of a 1.0 m stick: ' + U(sh.b, 'm') + '. The school’s shadow at the same moment was ' + U(sh.S, 'm') + '. ' + sh.who + ' says the school is ' + N(rd(sh.bad, 1)) + ' m tall.'; },
        shared: function (r) { return find(function () { var b = r.pick([1.2, 1.25, 1.5, 1.6, 2, 0.5, 0.6, 0.8]); return { who: r.pick(['Sam', 'Theo', 'Malik', 'Jaya']), b: b, S: pickR(r, b > 1 ? 12 : 4, b > 1 ? 30 : 9, 0.5) }; }, function (s) { s.h = s.S / s.b; s.bad = s.S * s.b; return decs(s.h) <= 1 && decs(s.bad) <= 2 && s.h > 5 && s.h < 30 && !(s.b === 1.5 && s.S === 18); }, { who: 'Sam', b: 1.5, S: 18, h: 12, bad: 27 }); },
        parts: [
          { id: '14a', level: 'PRG', make: function (r, sh) { var long = sh.b > 1, w = sh.who;
            return P.mc(r, 'Without calculating, why can’t ' + N(rd(sh.bad, 1)) + ' m be right?', [
              { html: long ? 'The stick’s shadow is <b>longer</b> than the stick, so right now every shadow is longer than its object. The school must be <b>shorter</b> than its ' + N(sh.S) + ' m shadow.' : 'The stick’s shadow is <b>shorter</b> than the stick, so right now every object is taller than its shadow. The school must be <b>taller</b> than its ' + N(sh.S) + ' m shadow.', right: true },
              { html: 'Schools are never more than ' + N(rd(sh.bad, 1) - 1) + ' m tall.', why: 'That isn’t a reason from the measurements. Compare the stick with its shadow.', code: 'never' },
              { html: 'The school’s shadow should be the same length as the school.', why: 'Only if the stick’s shadow were the same length as the stick. Compare them.', code: 'same' },
              { html: 'The answer has too many decimal places.', why: 'Decimals aren’t the problem. Compare the stick with its shadow.', code: 'dec' }],
              (long ? 'The stick’s shadow (' + N(sh.b) + ' m) is longer than the stick (1.0 m), so every shadow is longer than its object right now. The school must be shorter than ' + N(sh.S) + ' m, so ' + N(rd(sh.bad, 1)) + ' m is too tall.' : 'The stick’s shadow (' + N(sh.b) + ' m) is shorter than the stick (1.0 m), so every object is taller than its shadow right now. The school must be taller than ' + N(sh.S) + ' m, so ' + N(rd(sh.bad, 1)) + ' m is too short.') + ' (' + w + ' flipped the stick’s ratio.)',
              ['Is the stick longer or shorter than its shadow? The school must be the same way.'], 'can’t be right'); } },
          { id: '14b', level: 'EMG', make: function (r, sh) { return prop('Find the correct height.', { unit: 'm', given: sh.S, num: 1, den: sh.b, noEarly: true, alts: [{ v: sh.bad, code: 'u6l6-flip', hint: 'That is ' + sh.who + '’s answer: the stick’s ratio is flipped. Height over shadow on both sides.' }],
            sol: br([t('\\dfrac{h}{' + N(sh.S) + '}=\\dfrac{1.0}{' + N(sh.b) + '}'), t(N(sh.b) + 'h=' + N(sh.S)) + ', ' + t('h=' + N(sh.S) + '\\div ' + N(sh.b) + '=' + N(sh.h)) + '. The school is ' + N(sh.h) + ' m tall.']), hints: ['h ÷ ' + N(sh.S) + ' = 1.0 ÷ ' + N(sh.b) + '.'], text: 'school height' }); } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'EMG', make: function (r) { var obj = r.pick(['a tree', 'the school', 'a flagpole']);
        return P.mc(r, 'It is a cloudy day and you want the height of ' + obj + '. Which method can’t you use, and which can you use?', [
          { html: 'You can’t use the shadow method: there are no shadows. You can use the mirror method (or a ruler or stakes): they only need you to see the top.', right: true },
          { html: 'You can’t use the mirror method: a mirror needs sunlight. Use the shadow method.', why: 'A mirror works in any daylight: you only need to see the top in it. With no sun there are <b>no shadows</b>.', code: 'mirror' },
          { html: 'You can use the shadow method; the shadows are just lighter.', why: 'On a cloudy day there are no clear shadows to measure.', code: 'shadow' },
          { html: 'You can’t use any of the methods on a cloudy day.', why: 'Only the shadow method needs the sun. The mirror, ruler and stake methods need you to <b>see</b> the top.', code: 'none' }],
          'No shadows on a cloudy day, so the shadow method won’t work. The mirror method (or the ruler or stake sighting method) works: it only needs you to see the top of ' + obj + '.', ['Which method needs the sun?'], 'cloudy day'); } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var s = find(function () { return { a: pickR(r, 1.5, 1.9, 0.1), b: pickR(r, 1.8, 3.2, 0.1), S: r.int(10, 22) }; }, function (v) { return v.b !== v.a && !(v.a === 1.7 && v.b === 2.4 && v.S === 14); }, { a: 1.7, b: 2.4, S: 14 });
        var f = function (a, b, c, d) { return t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{' + c + '}{' + d + '}'); };
        return P.mc(r, 'A person ' + M(s.a) + ' m tall casts a ' + M(s.b) + ' m shadow. At the same time, a tree casts a ' + s.S + ' m shadow. Which proportion gives the tree’s height ' + t('h') + '?', [
          { html: f('h', s.S, M(s.a), M(s.b)), right: true }, { html: f('h', s.S, M(s.b), M(s.a)), why: 'The person’s ratio is flipped: it must be height over shadow, like the tree’s.', code: 'flip' },
          { html: f('h', M(s.a), M(s.b), s.S), why: 'That mixes up which lengths match. Keep each triangle’s height over its own shadow.', code: 'mixed' }, { html: f('h', s.S + '+' + M(s.b), M(s.a), M(s.b)), why: 'Each shadow belongs to its own triangle: don’t add the shadows.', code: 'add' }],
          'Height over shadow on both sides: ' + f('h', s.S, M(s.a), M(s.b)) + '.', ['Height over shadow for the tree = height over shadow for the person.'], 'which proportion'); } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var s = find(function () { var F = pickR(r, 1.55, 1.8, 0.05); return { F: F, e: q(F - r.pick([0.1, 0.12, 0.15])), d1: pickR(r, 2, 4, 0.5), d2: pickR(r, 8, 16, 1), who: r.pick(['Rosa', 'Hana', 'Maya']) }; }, function (v) { v.h = v.e * v.d2 / v.d1; v.w = [v.d2 * v.d1 / v.e, v.F * v.d2 / v.d1, v.e * (v.d1 + v.d2) / v.d1]; var all = [v.h].concat(v.w).map(function (x) { return rd(x, 1); }); return all.every(function (x, i) { return all.indexOf(x) === i; }) && decs(v.h) <= 2 && notEx([v.F, v.e, v.d1, v.d2]) && !(v.F === 1.65 && v.d1 === 3 && v.d2 === 12); }, null) || { F: 1.65, e: 1.5, d1: 3, d2: 12, who: 'Rosa', h: 6, w: [24, 6.6, 7.5] };
        var m = function (x) { return N(rd(x, 1)) + ' m'; };
        return P.mc(r, s.who + ' is ' + f2(s.F) + ' m tall and her eyes are ' + f2(s.e) + ' m above the ground. She stands ' + U(s.d1, 'm') + ' from a mirror on the ground, and the mirror is ' + U(s.d2, 'm') + ' from a tree. How tall is the tree?', [
          { html: m(s.h), right: true }, { html: m(s.w[0]), why: 'The ratio is flipped. Height over distance: h ÷ ' + N(s.d2) + ' = ' + f2(s.e) + ' ÷ ' + N(s.d1) + '.', code: 'flip' }, { html: m(s.w[1]), why: 'That uses her full height. Use her <b>eye</b> height, ' + f2(s.e) + ' m.', code: 'full' }, { html: m(s.w[2]), why: 'That uses her distance to the tree. Use the <b>mirror’s</b> distance to the tree, ' + N(s.d2) + ' m.', code: 'dist' }],
          t('h=' + f2(s.e) + '\\times ' + N(s.d2) + '\\div ' + N(s.d1) + '=' + N(rd(s.h, 2))) + ' m.', ['Eye height, and the mirror’s distance to the tree.'], 'mirror MC'); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var s = find(function () { return { a: pickR(r, 1.5, 2.5, 0.1), b: pickR(r, 1.0, 2.0, 0.05), S: pickR(r, 12, 25, 0.5), what: r.pick(['church steeple', 'grain elevator', 'water tower']) }; }, function (v) { v.h = v.S * v.a / v.b; return v.h < 100 && v.a !== v.b && Math.abs(v.a - v.b) > 0.3 && !(v.a === 2.4 && v.b === 1.6 && v.S === 19); }, { a: 2.4, b: 1.6, S: 19, what: 'church steeple', h: 28.5 });
        return prop('A ' + f2(s.a) + ' m post casts a shadow ' + f2(s.b) + ' m long. At the same time, a ' + s.what + ' casts a shadow ' + U(s.S, 'm', 1) + ' long. The height of the ' + s.what + ', to the nearest tenth of a metre, is ________ m.', { unit: 'm', nr: true, given: s.S, num: s.a, den: s.b, alts: [{ v: s.S * s.b / s.a, code: 'u6l6-flip', hint: 'Height over shadow on both sides.' }], sol: propSol('h', s.S, s.a, s.b, s.h, 'm', 1), hints: ['h ÷ ' + N(s.S) + ' = ' + f2(s.a) + ' ÷ ' + f2(s.b) + '.'], text: 'NR steeple' }); } }] },
      { num: '19', stem: '<i>(Numerical Response)</i>', parts: [{ id: '19', level: 'PRG', make: function (r) {
        var s = find(function () { return { H: r.int(20, 60), e: r.pick([50, 55, 60, 65, 70]), r: pickR(r, 2.5, 9, 0.5), who: r.pick(['Tyler', 'Noor', 'Kenji']) }; }, function (v) { v.D = v.H * v.e / v.r; return v.D >= 100 && v.D <= 999 && !(v.H === 30 && v.e === 60 && v.r === 4.5); }, { H: 30, e: 60, r: 4.5, who: 'Tyler', D: 400 });
        return prop('A water tower is known to be ' + s.H + ' m tall. ' + s.who + ' holds a ruler upright ' + s.e + ' cm from ' + (s.who === 'Noor' ? 'her' : 'his') + ' eye, and the tower covers ' + N(s.r) + ' cm of the ruler. ' + (s.who === 'Noor' ? 'Her' : 'His') + ' distance from the tower, to the nearest metre, is ________ m.', { unit: 'm', nr: true, dp: 0, given: s.H, num: s.e, den: s.r,
          alts: [{ v: s.H * s.r / s.e, code: 'prop-flip', hint: 'The distance is on the bottom: ' + t('\\dfrac{' + s.H + '}{D}=\\dfrac{' + N(s.r) + '}{' + s.e + '}') + ', so D = ' + s.H + ' × ' + s.e + ' ÷ ' + N(s.r) + '.' }],
          sol: br([t('\\dfrac{' + s.H + '}{D}=\\dfrac{' + N(s.r) + '}{' + s.e + '}'), t(N(s.r) + 'D=' + s.H + '\\times ' + s.e + '=' + s.H * s.e), t('D=' + s.H * s.e + '\\div ' + N(s.r) + eqR(s.D, 0)) + ' m']), hints: ['Height over distance = ruler reading over eye-to-ruler distance, with D on the bottom.'], text: 'NR distance' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'In each row, the two shadows were measured at the same time. Find the missing length.' + shadowTable(sh.rows, ['Known object', 'Its shadow', 'Other object', 'Its shadow'], sh.names); },
        shared: function (r) { var nm = [r.pick([['stick: ', 'flagpole: '], ['stick: ', 'light pole: ']]), r.pick([['post: ', 'silo: '], ['post: ', 'grain bin: ']]), r.pick([['person: ', 'sign: '], ['person: ', 'fence: ']])];
          return { names: nm, rows: [shadowRow(r, { a: [1], b: [1.25, 1.5, 0.8, 2], find: 'h', Z: [5, 12, 0.1] }), shadowRow(r, { a: [0.9, 1.2, 0.6], b: [0.6, 0.8, 0.4, 0.5], find: 'h', Z: [8, 18, 0.1] }), shadowRow(r, { a: [1.8, 1.6, 1.5], b: [2.7, 2.4, 2.5, 2], find: 's', Z: [3, 8, 0.1] })] }; },
        parts: [
          { id: 'e1a', level: 'BEG', make: function (r, sh) { return shadowRowPart(sh.rows[0], '(a)', ['stick', sh.names[0][1].replace(': ', '')]); } },
          { id: 'e1b', level: 'EMG', make: function (r, sh) { return shadowRowPart(sh.rows[1], '(b)', ['post', sh.names[1][1].replace(': ', '')]); } },
          { id: 'e1c', level: 'PRG', make: function (r, sh) { return shadowRowPart(sh.rows[2], '(c)', ['person', sh.names[2][1].replace(': ', '')]); } }] },
      { num: '2', stem: function (sh) { return 'Use the mirror method to find the height ' + t('h') + ' of the light pole, to the nearest tenth of a metre.' + mirrorFig(sh, { eye: f2(sh.e) + ' m', d1: f2(sh.d1) + ' m', d2: M(sh.d2) + ' m', h: 'h' }, 'pole'); },
        shared: function (r) { return find(function () { return { e: pickR(r, 1.35, 1.7, 0.05), d1: pickR(r, 1.5, 2.5, 0.25), d2: pickR(r, 8, 14, 0.5) }; }, function (s) { var h = s.e * s.d2 / s.d1; return h > 4 && h < 12 && notEx([s.e, s.d1, s.d2]) && !(s.e === 1.4 && s.d1 === 1.75 && s.d2 === 10.5); }, { e: 1.4, d1: 1.75, d2: 10.5 }); },
        parts: [{ id: 'e2', level: 'EMG', make: function (r, sh) { return mirrorH('Find ' + t('h') + '.', sh, { end: 'The light pole is about ' + N(rd(sh.e * sh.d2 / sh.d1)) + ' m tall.' }); } }] },
      { num: '3', stem: '', parts: [{ id: 'e3', level: 'EMG', make: function (r) {
        return P.mc(r, 'Why must the two shadows in the shadow method be measured at the same time?', [
          { html: 'The sun’s angle changes during the day. At different times the angles at the shadow tips are different, so the triangles aren’t similar.', right: true },
          { html: 'The objects grow during the day.', why: 'The objects don’t change. The <b>sun’s angle</b> does.', code: 'grow' },
          { html: 'So that both shadows are the same length.', why: 'The shadows are different lengths even at the same time. What matters is the same <b>sun angle</b>.', code: 'same' },
          { html: 'It doesn’t matter, as long as both are measured on the same day.', why: 'It does matter: shadows are long in the morning and short at noon.', code: 'day' }],
          'The sun’s angle changes during the day. If the shadows are measured at different times, the angles at the shadow tips are different, so the triangles are not similar and the proportion is wrong.', ['Are shadows the same length at 9 a.m. and at noon?'], 'same time'); } }] },
      { num: '4', stem: '', parts: [{ id: 'e4', level: 'EMG', make: function (r) {
        var s = find(function () { return { e: r.pick([40, 45, 50, 55, 60]), D: r.pick([100, 120, 150, 180, 200, 240]), r: pickR(r, 4, 14, 0.5), who: r.pick(['Ali', 'Hana', 'Devon']) }; }, function (v) { v.h = v.D * v.r / v.e; return decs(v.h) <= 1 && v.h >= 10 && v.h <= 40 && !(v.e === 50 && v.D === 150 && v.r === 8); }, { e: 50, D: 150, r: 8, who: 'Ali', h: 24 });
        return rulerH(s.who + ' holds a ruler upright ' + s.e + ' cm from ' + (s.who === 'Hana' ? 'her' : 'his') + ' eye. A grain bin ' + s.D + ' m away covers ' + N(s.r) + ' cm of the ruler, from its base to its top. How tall is the grain bin?' + rulerSVG({ e: s.e + ' cm', D: s.D + ' m', r: N(s.r) + ' cm', h: 'h' }, { kind: 'bin' }), s, { end: 'The grain bin is ' + N(rd(s.h)) + ' m tall.', text: 'grain bin ruler' });
      } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
        var s = find(function () { return { st: 3, ft: r.int(1, 3), inch: r.pick([3, 6, 9]), S: r.int(18, 45) }; }, function (v) { v.b = v.ft + v.inch / 12; v.h = v.S * v.st / v.b; v.bad = v.S * v.st / (v.ft + v.inch / 10); return v.b !== v.st && !same(rd(v.bad, 1), rd(v.h, 1)) && v.h < 100 && !(v.ft === 2 && v.inch === 3 && v.S === 33); }, { st: 3, ft: 2, inch: 3, S: 33, b: 2.25, h: 44, bad: 43 });
        return prop('A yardstick (3 ft) stands upright and casts a shadow ' + ftIn(s.ft, s.inch) + ' long. At the same time, a tree casts a shadow ' + s.S + ' ft long. How tall is the tree, to the nearest tenth of a foot?', { unit: 'ft', given: s.S, num: 3, den: s.b,
          alts: [{ v: s.bad, code: 'u6l6-ftin', hint: s.inch + ' in is ' + t('\\tfrac{' + s.inch + '}{12}') + ' ft, not 0.' + s.inch + ' ft. So ' + ftIn(s.ft, s.inch) + ' = ' + N(s.b) + ' ft.' }, { v: s.S * s.b / 3, code: 'u6l6-flip', hint: 'Height over shadow on both sides.' }],
          sol: br([ftIn(s.ft, s.inch) + ' ' + t('=' + s.ft + '\\tfrac{' + s.inch + '}{12}\\text{ ft}=' + N(s.b) + '\\text{ ft}'), propSol('h', s.S, 3, s.b, s.h, 'ft', 1, 'The tree is about ' + N(rd(s.h)) + ' ft tall.')]), hints: ['Change the shadow to feet: ' + s.inch + ' in = ' + s.inch + ' ÷ 12 ft.'], text: 'yardstick' }); } }] },
      { num: '6', stem: '', parts: [{ id: 'e6', level: 'PRG', make: function (r) {
        var s = find(function () { return { H: pickR(r, 5, 9, 0.1), d2: pickR(r, 6, 12, 0.5), e: pickR(r, 1.5, 1.7, 0.02), who: r.pick(['Kayla', 'Aisha', 'Sofia']), what: r.pick([['scoreboard at a rodeo grounds', 'scoreboard'], ['billboard', 'billboard'], ['climbing wall', 'climbing wall']]) }; }, function (v) { var d = v.e * v.d2 / v.H; return !same(rd(d, 1), d) && !(v.H === 7.2 && v.d2 === 9); }, { H: 7.2, d2: 9, e: 1.62, who: 'Kayla', what: ['scoreboard at a rodeo grounds', 'scoreboard'] });
        return mirrorD('A ' + s.what[0] + ' is ' + U(s.H, 'm') + ' tall. ' + s.who + ' puts a mirror on the ground ' + U(s.d2, 'm') + ' from the bottom of the ' + s.what[1] + '. Her eyes are ' + U(s.e, 'm', 2) + ' above the ground. How far from the mirror must she stand to see the top? Round to the nearest tenth of a metre.', s, { what: s.what[1], end: s.who + ' must stand about ' + N(rd(s.e * s.d2 / s.H)) + ' m from the mirror.', text: 'mirror stand' }); } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
        var s = find(function () { return { p: pickR(r, 1.5, 3, 0.5), hp: pickR(r, 0.5, 1.2, 0.1), L: pickR(r, 8, 14, 0.5) }; }, function (v) { v.H = v.hp * v.L / v.p; return decs(v.H) <= 1 && v.H < v.L * 0.6 && !(v.p === 2 && v.hp === 0.9 && v.L === 12); }, { p: 2, hp: 0.9, L: 12, H: 5.4 });
        return prop('A grain auger is a long straight tube that slopes up from the ground to the top of a bin. Its bottom end is on the ground. At a point ' + U(s.p, 'm') + ' along the auger from the bottom end, the auger is ' + U(s.hp, 'm') + ' above the ground. The auger is ' + U(s.L, 'm') + ' long. How high is its top end?' + tubeSVG({ p: s.p, L: s.L, lab: { p: M(s.p) + ' m', L: M(s.L) + ' m', hp: M(s.hp) + ' m', H: 'h' } }), { unit: 'm', dp: Math.max(1, decs(s.H)), given: s.L, num: s.hp, den: s.p,
          alts: [{ v: s.L * s.p / s.hp, code: 'prop-flip', hint: 'Height over length along the auger, on both sides: ' + t('\\dfrac{h}{' + N(s.L) + '}=\\dfrac{' + N(s.hp) + '}{' + N(s.p) + '}') + '.' }, { v: s.hp * (s.L - s.p) / s.p, code: 'u6l6-whole', hint: 'Use the whole auger (' + N(s.L) + ' m), not the part past the point.' }],
          sol: br(['The small and big triangles share the angle at the bottom and both have a right angle, so they are similar.', propSol('h', s.L, s.hp, s.p, s.H, 'm', Math.max(1, decs(s.H)), 'The top end is ' + N(s.H) + ' m above the ground.')]), hints: ['The lengths along the auger match each other (they are the long sides).', 'h ÷ ' + N(s.L) + ' = ' + N(s.hp) + ' ÷ ' + N(s.p) + '.'], text: 'auger tube' }); } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
        var s = find(function () { return { who: r.pick(['Noah', 'Mateo', 'Kayla']), ab: r.int(30, 60), bc: r.int(10, 20), cd: pickR(r, 8, 16, 0.2) }; }, function (v) { v.w = v.ab * v.cd / v.bc; return decs(v.w) <= 1 && v.ab / v.bc >= 2 && v.ab / v.bc <= 5 && !(v.ab === 45 && v.bc === 15 && v.cd === 12.4) && !(v.ab === 30 && v.bc === 10); }, { who: 'Noah', ab: 45, bc: 15, cd: 12.4, w: 37.2 });
        return prop(s.who + ' uses the stake method to find the width ' + t('w') + ' of a slough (a prairie pond). ' + (s.who === 'Kayla' ? 'She' : 'He') + ' measures ' + t('AB=' + s.ab) + ' m, ' + t('BC=' + s.bc) + ' m and ' + t('CD=' + N(s.cd)) + ' m. How wide is the slough?' + riverSVG(s.ab, s.bc, s.cd, { w: 'w', ab: s.ab + ' m', bc: s.bc + ' m', cd: M(s.cd) + ' m' }, { water: 'slough' }), { unit: 'm', given: s.ab, num: s.cd, den: s.bc,
          alts: [{ v: s.ab * s.bc / s.cd, code: 'prop-flip', hint: 'Keep the order: ' + t('\\dfrac{w}{' + s.ab + '}=\\dfrac{' + N(s.cd) + '}{' + s.bc + '}') + '.' }, { v: (s.ab + s.bc) * s.cd / s.bc, code: 'u6l6-whole', hint: 'Use ' + t('AB') + ' only, not ' + t('AB+BC') + '.' }],
          sol: br([t('\\triangle TAB\\sim\\triangle DCB'), propSol('w', s.ab, s.cd, s.bc, s.w, 'm', 1, 'The slough is ' + N(s.w) + ' m wide.')]), hints: ['T ↔ D, A ↔ C, B ↔ B: w ÷ ' + s.ab + ' = ' + N(s.cd) + ' ÷ ' + s.bc + '.'], text: 'slough stakes' }); } }] },
      { num: '9', stem: function (sh) { return sh.who + '’s eyes are ' + U(sh.e, 'm') + ' above the ground. He stands ' + U(sh.d1, 'm') + ' from a mirror, and the mirror is ' + U(sh.d2, 'm') + ' from a building. He writes ' + t('h=' + N(sh.d1) + '\\times ' + N(sh.d2) + '\\div ' + N(sh.e) + '=' + N(rd(sh.bad, 1))) + ' m.'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Liam', 'Ben', 'Omar']), e: pickR(r, 1.4, 1.7, 0.1), d1: pickR(r, 2, 3.5, 0.5), d2: r.int(12, 24) }; }, function (s) { s.h = s.e * s.d2 / s.d1; s.bad = s.d1 * s.d2 / s.e; return decs(s.h) <= 1 && s.e < s.d1 && !(s.e === 1.5 && s.d1 === 2.5 && s.d2 === 20); }, { who: 'Liam', e: 1.5, d1: 2.5, d2: 20, h: 12, bad: 33.3 }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return P.mc(r, 'What did ' + sh.who + ' do wrong?', [
            { html: 'He flipped the ratio: he used you-to-mirror over eye height instead of eye height over you-to-mirror.', right: true },
            { html: 'He should have used his full height.', why: 'Eye height is right. Look at the order of his numbers.', code: 'full' },
            { html: 'He should have used his distance to the building.', why: 'The mirror’s distance to the building (' + N(sh.d2) + ' m) is right. Look at the ratio.', code: 'dist' },
            { html: 'He should have added ' + N(sh.d1) + ' and ' + N(sh.d2) + '.', why: 'Nothing is added in the mirror method. Look at which number is on the bottom.', code: 'add' }],
            'He flipped the ratio: ' + t('\\dfrac{\\text{you to mirror}}{\\text{eye height}}') + ' instead of ' + t('\\dfrac{\\text{eye height}}{\\text{you to mirror}}') + '.', ['Height over distance on both sides. Which of his numbers is a height?'], 'Liam mistake'); } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { return mirrorH('Find the correct height.', { e: sh.e, d1: sh.d1, d2: sh.d2 }, { end: 'The building is ' + N(rd(sh.h)) + ' m tall.', text: 'Liam corrected' }); } },
          { id: 'e9c', level: 'PRG', make: function (r, sh) { return P.mc(r, 'Why is the correct height more reasonable than ' + N(rd(sh.bad, 1)) + ' m?', [
            { html: 'His eye height (' + N(sh.e) + ' m) is less than his distance to the mirror (' + N(sh.d1) + ' m), so the building’s height must be less than its distance to the mirror (' + N(sh.d2) + ' m).', right: true },
            { html: 'Buildings are always about ' + N(rd(sh.h)) + ' m tall.', why: 'Buildings come in many heights. Compare the eye height with the distance to the mirror.', code: 'always' },
            { html: 'The smaller answer is always the right one.', why: 'Not always. Compare the eye height with the distance to the mirror.', code: 'smaller' },
            { html: 'The building must be taller than its distance to the mirror.', why: 'It is the other way: ' + N(sh.e) + ' m < ' + N(sh.d1) + ' m, so the building is <b>shorter</b> than ' + N(sh.d2) + ' m.', code: 'taller' }],
            'Eye height ' + N(sh.e) + ' m < distance to the mirror ' + N(sh.d1) + ' m, so the building’s height must be less than ' + N(sh.d2) + ' m. ' + N(rd(sh.h)) + ' m fits; ' + N(rd(sh.bad, 1)) + ' m does not.', ['Compare the height and the distance in his small triangle.'], 'more reasonable'); } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var s = r.pick([{ p: 2, s: 5, T: 10 }, { p: 2, s: 3, T: 12 }, { p: 1.5, s: 3, T: 9 }, { p: 4, s: 10, T: 8 }, { p: 2, s: 6, T: 6 }]), k = s.s / s.p;
        return P.mc(r, 'At ' + r.pick(['6:00 p.m.', '7:30 a.m.', '5:00 p.m.']) + ', a ' + M(s.p) + ' m post casts a shadow ' + M(s.s) + ' m long. Which statement is true at that moment?', [
          { html: 'Every shadow is ' + N(k) + ' times as long as its object.', right: true },
          { html: 'Every object is ' + N(k) + ' times as tall as its shadow.', why: 'That is flipped: the shadow is the longer one right now.', code: 'flip' },
          { html: 'A ' + s.T + ' m tree has a shadow ' + N(rd(s.T / k, 2)) + ' m long.', why: 'Shadows are longer than their objects now: ' + t(s.T + '\\times ' + N(k) + '=' + N(s.T * k)) + ' m, not ÷.', code: 'div' },
          { html: 'Every shadow is ' + N(s.s - s.p) + ' m longer than its object.', why: 'Similar triangles multiply; they don’t add the same amount.', code: 'add' }],
          t(N(s.s) + '\\div ' + N(s.p) + '=' + N(k)) + ', and similar triangles keep this ratio for every object: every shadow is ' + N(k) + ' times as long as its object.', ['Divide the shadow by the post.'], 'statement MC'); } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var s = find(function () { return { a: pickR(r, 0.8, 1.6, 0.05), b: pickR(r, 0.5, 1.2, 0.05), S: pickR(r, 9, 20, 0.5) }; }, function (v) { v.h = v.S * v.a / v.b; return v.h < 100 && v.a > v.b + 0.2 && !(v.a === 1.2 && v.b === 0.75 && v.S === 13.5); }, { a: 1.2, b: 0.75, S: 13.5, h: 21.6 });
        return prop('A ' + f2(s.a) + ' m stick casts a shadow ' + f2(s.b) + ' m long. At the same time, an apartment building casts a shadow ' + U(s.S, 'm', 1) + ' long. The height of the building, to the nearest tenth of a metre, is ________ m.', { unit: 'm', nr: true, given: s.S, num: s.a, den: s.b, alts: [{ v: s.S * s.b / s.a, code: 'u6l6-flip', hint: 'Height over shadow on both sides.' }], sol: propSol('h', s.S, s.a, s.b, s.h, 'm', 1), hints: ['h ÷ ' + N(s.S) + ' = ' + f2(s.a) + ' ÷ ' + f2(s.b) + '.'], text: 'NR building' }); } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'MAS', make: function (r) {
        var s = find(function () { return { who: r.pick(['Zoe', 'Hana', 'Maya']), P: pickR(r, 1.5, 1.8, 0.1), D: pickR(r, 4, 8, 0.5), S: pickR(r, 1.6, 3.2, 0.2) }; }, function (v) { v.H = v.P * (v.D + v.S) / v.S; return decs(v.H) <= 1 && v.H < 9 && !(v.P === 1.6 && v.D === 6 && v.S === 2.4); }, { who: 'Zoe', P: 1.6, D: 6, S: 2.4, H: 5.6 });
        return prop('At night, ' + s.who + ' (' + U(s.P, 'm') + ' tall) stands ' + U(s.D, 'm') + ' from a street lamp. The light from the lamp makes her shadow ' + U(s.S, 'm') + ' long. How high is the lamp? (Hint: the big triangle’s base is the whole distance from the lamp post to the tip of her shadow.)' + lampSVG({ H: s.H, P: s.P, D: s.D, S: s.S, lab: { H: '?', P: M(s.P) + ' m', D: M(s.D) + ' m', S: M(s.S) + ' m' } }), { unit: 'm', dp: Math.max(1, decs(s.H)), given: q(s.D + s.S), num: s.P, den: s.S, noEarly: true,
          alts: [{ v: s.P * s.D / s.S, code: 'u6l6-whole', hint: 'The big triangle’s base is the <b>whole</b> distance from the lamp post to the tip of the shadow: ' + t(N(s.D) + '+' + N(s.S) + '=' + N(q(s.D + s.S))) + ' m.' }, { v: (s.D + s.S) * s.S / s.P, code: 'prop-flip', hint: 'Height over base on both sides: ' + t('\\dfrac{h}{' + N(q(s.D + s.S)) + '}=\\dfrac{' + N(s.P) + '}{' + N(s.S) + '}') + '.' }, { v: s.P * s.D / s.S + s.P, code: 'u6l6-whole', hint: 'Use one proportion with the whole base (' + N(q(s.D + s.S)) + ' m); don’t add ' + s.who + '’s height.' }],
          sol: br(['Small triangle: ' + s.who + ' and her shadow. Big triangle: the lamp post and the distance to the tip of the shadow, ' + t(N(s.D) + '+' + N(s.S) + '=' + N(q(s.D + s.S))) + ' m. They share the angle at the tip of the shadow and both have a right angle: similar.', propSol('h', q(s.D + s.S), s.P, s.S, s.H, 'm', Math.max(1, decs(s.H)), 'The lamp is ' + N(s.H) + ' m high.')]),
          hints: ['Both triangles have their sharp corner at the tip of the shadow.', 'Big base = ' + N(s.D) + ' + ' + N(s.S) + '.'], text: 'street lamp' }); } }] },
      { num: '13', stem: '', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
        var s = find(function () { var e = pickR(r, 1.4, 1.7, 0.1); return { who: r.pick(['Owen', 'Kai', 'Malik']), e: e, pole: q(e + pickR(r, 0.4, 0.8, 0.1)), d1: pickR(r, 2, 4, 0.5), d2: r.int(15, 35) }; }, function (v) { v.up = q(v.pole - v.e); v.x = v.up * (v.d1 + v.d2) / v.d1; v.H = v.x + v.e; return decs(v.H) <= 2 && !(v.e === 1.5 && v.pole === 2 && v.d1 === 3 && v.d2 === 27); }, { who: 'Owen', e: 1.5, pole: 2, d1: 3, d2: 27, up: 0.5, x: 5, H: 6.5 });
        var tot = q(s.d1 + s.d2);
        return X.lenP(s.who + '’s eyes are ' + U(s.e, 'm') + ' above the ground. He stands ' + U(s.d1, 'm') + ' from a ' + U(s.pole, 'm') + ' pole, so that the top of the pole lines up with the top of a building. The pole is ' + U(s.d2, 'm') + ' from the building. How tall is the building?<br>(Hint: use only the parts <b>above</b> ' + s.who + '’s eye level, then add his eye height back on.)' +
          sightSVG({ ey: s.e, d1: s.d1, h1: s.pole, d2: s.d2, h2: s.H, top: 'building', eyeLevel: true, lab: { ey: M(s.e) + ' m', h1: M(s.pole) + ' m', h2: 'h', d1: M(s.d1) + ' m', d2: M(s.d2) + ' m' }, aria: 'sighting over a pole to the top of a building' }), s.H, { unit: 'm', dp: Math.max(1, decs(s.H)),
          alts: [{ v: s.x, code: 'u6l6-no-eye-add', hint: 'That is only the part <b>above</b> eye level. Add the eye height (' + N(s.e) + ' m) back on.' }, { v: s.pole * tot / s.d1, code: 'u6l6-full-pole', hint: 'Use only the part of the pole <b>above</b> eye level: ' + t(N(s.pole) + '-' + N(s.e) + '=' + N(s.up)) + ' m. The triangles start at the eye, not the ground.' }, { v: s.up * s.d2 / s.d1 + s.e, code: 'u6l6-whole', hint: 'The big triangle’s base is the <b>whole</b> distance from the eye to the building: ' + t(N(s.d1) + '+' + N(s.d2) + '=' + N(tot)) + ' m.' }, { v: s.up * s.d2 / s.d1, code: 'u6l6-whole', hint: 'Use the whole distance from the eye (' + N(tot) + ' m), then add the eye height back.' }],
          sol: br(['Above eye level, the pole sticks up ' + t(N(s.pole) + '-' + N(s.e) + '=' + N(s.up)) + ' m, at ' + N(s.d1) + ' m. The building sticks up ' + t('x') + ' above eye level, at ' + t(N(s.d1) + '+' + N(s.d2) + '=' + N(tot)) + ' m. These triangles share the angle at the eye: similar.', t('\\dfrac{x}{' + N(tot) + '}=\\dfrac{' + N(s.up) + '}{' + N(s.d1) + '}') + ', ' + t('x=' + N(tot) + '\\times ' + N(s.up) + '\\div ' + N(s.d1) + eqR(s.x, 2)), 'Building: ' + t('h=' + N(rd(s.x, 4)) + '+' + N(s.e) + '=' + N(rd(s.H, 2))) + ' m.']),
          hints: ['Draw a line across at eye level. The two triangles are above it.', 'Find the height above eye level, then add ' + N(s.e) + ' m.'], text: 'over a pole' });
      } }] },
      { num: '14', stem: 'Plan how you would find the height of your school with the mirror method.', parts: [
        { id: 'e14a', level: 'EMG', make: function (r) { return P.mc(r, 'Which measurements do you need?', [
          { html: 'Your eye height, your distance to the mirror, and the mirror’s distance to the wall.', right: true },
          { html: 'Your full height, your distance to the mirror, and the mirror’s distance to the wall.', why: 'Use your <b>eye</b> height: the light goes to your eyes.', code: 'full' },
          { html: 'Your eye height, your distance to the mirror, and your distance to the wall.', why: 'The school’s triangle runs from the <b>mirror</b> to the wall.', code: 'dist' },
          { html: 'Your height, your shadow, and the school’s shadow.', why: 'That is the shadow method. The mirror method uses your eye height and two distances to the mirror.', code: 'shadow' }],
          'Eye height, you to the mirror, and the mirror to the wall. (Tools: a small mirror, a measuring tape, a partner.)', ['Which lengths make the two triangles that meet at the mirror?'], 'plan: measurements'); } },
        { id: 'e14b', level: 'EMG', make: function (r) { var s = find(function () { return { e: pickR(r, 1.45, 1.65, 0.05), d1: pickR(r, 2, 3, 0.5), d2: pickR(r, 12, 18, 1) }; }, function (v) { return decs(v.e * v.d2 / v.d1) <= 2; }, { e: 1.55, d1: 2.5, d2: 15 });
          return mirrorH('Your measurements: eye height ' + U(s.e, 'm', 2) + ', you to the mirror ' + U(s.d1, 'm') + ', mirror to the wall ' + U(s.d2, 'm') + '. How tall is the school, to the nearest tenth of a metre?', s, { end: 'The school is about ' + N(rd(s.e * s.d2 / s.d1)) + ' m tall.', text: 'plan: height' }); } },
        { id: 'e14c', level: 'EMG', make: function (r) { var right = r.pick(['The ground between you and the wall is not level.', 'The mirror is not lying flat.', 'You measure to the edge of the mirror instead of its centre.']);
          return P.mc(r, 'Which could make your answer a little off?', [{ html: right, right: true },
            { html: 'It is a cloudy day.', why: 'The mirror method works on a cloudy day: you only need to see the top.', code: 'cloudy' },
            { html: 'You use a calculator.', why: 'A calculator doesn’t make it wrong. Think about the ground and the mirror.', code: 'calc' },
            { html: 'You measure in metres instead of feet.', why: 'Any unit works if you use the same unit for the distances.', code: 'units' }],
            right + ' (Others: the wall leans, or you use your full height instead of your eye height.)', ['What must be true for the two triangles to be similar?'], 'plan: error'); } }] }
    ]
  });
})(window);
