/* Math 10-3 · Unit 6 · Lesson 5 — Similar Triangles (G3)
 * Assignment 5 (u6_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u6_ep05.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the booklet item's idea and difficulty with new numbers around the booklet's (the lesson's
 * worked-example numbers are left out). Calculator allowed. Lengths to the nearest tenth (HW.geo.lenChk: an unrounded or
 * over-rounded answer gets a nudge; a flipped proportion, × instead of ÷ k, adding the difference each get a hint), plus
 * this lesson's traps: the piece DB instead of the whole side AB (nested triangles), the whole side instead of the piece
 * (EC, DB), the whole leg instead of the part below X, and rounding k too early (a nudge: keep k unrounded).
 * Conversions (paper → digital):
 *   "missing angle / similar? yes or no" tables → the table in the stem, one row per part: two angle boxes + a yes / no box;
 *   "∠G = ∠__", "side HJ matches side __", "△RST ∼ △__" → letter boxes (any letter case, "∠", "△", "angle", "side" are fine;
 *   a side may be typed either way round, LM or ML); the ratio blanks → the equation with numbered boxes ①, ② and a box for
 *   each; "find k; enlargement or reduction?" → a k box (fraction or decimal) + a choice; the side table → boxes;
 *   "explain why similar / give two reasons" → multiple choice of reasons; "always, sometimes or never — explain" →
 *   multiple choice pairing the word with its reason; "find Jordan's mistake" → multiple choice of mistakes + the correct
 *   length; "name one more length" → a box that takes any of the three right sides; "Is Taylor right? Show your work" →
 *   the three side ratios in boxes + a choice; "sketch two right triangles with a 25° angle" → the third angle in a box.
 * Figures are drawn here (triangles with matching arcs, nested and crossing triangles, a slope with a post, ladders, an
 * A-shaped sign) and exported as HW.u6tri for Lesson 6.6. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P;

  /* ================= numbers ================= */
  var RAD = Math.PI / 180;
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp == null ? 1 : dp); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function find(gen, test, fb) { for (var i = 0; i < 600; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function pickR(r, a, b, s) { s = s || 1; return q(a + s * r.int(0, Math.round((b - a) / s))); }
  function dg(x) { return t(nS(x) + '^\\circ'); }
  /* "≈ 13.5" or "= 15" after a calculation */
  function eqR(x, dp) { dp = dp == null ? 1 : dp; return same(x, rd(x, dp)) ? '=' + N(rd(x, dp)) : '=' + nS(+x.toFixed(4)) + (same(x, rd(x, 4)) ? '' : '\\ldots') + '\\approx ' + rd(x, dp).toFixed(dp); }
  function U(x, u) { return t(N(x) + '\\text{ ' + u + '}'); }
  function fmtKey(x, dp) { return String(+rd(x, dp).toFixed(dp)); }

  /* ================= letters ================= */
  var TRIS = ['GHJ', 'KLM', 'PQR', 'XYZ', 'UVW', 'DEF', 'RST', 'JKL', 'LMN', 'STU', 'EFG', 'ABC', 'MNP', 'WXY', 'BCD', 'QRS'];
  var AVOID_PAIRS = ['ABC|DEF', 'ABC|RPQ', 'LMN|STU'];
  function twoTris(r, not) {
    return find(function () { return [r.pick(TRIS), r.pick(TRIS)]; }, function (p) {
      return p[0].split('').every(function (c) { return p[1].indexOf(c) < 0; }) && AVOID_PAIRS.indexOf(p[0] + '|' + p[1]) < 0 && (!not || not.indexOf(p[0] + '|' + p[1]) < 0);
    }, ['GHJ', 'KLM']).map(function (s) { return s.split(''); });
  }
  /* letters typed in a box: "∠K", "angle k", "△YZX", "side LM", "\overline{LM}" → "K", "YZX", "LM" */
  function letters(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:overline|text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\\(?:angle|triangle|bigtriangleup)/g, ' ');
    s = s.replace(/\b(?:angle|triangle|tri|side|segment|seg|line)\b/gi, ' ').replace(/[∠△▵Δ∆\s.,=:]/g, '');
    return s;
  }
  function slipL(s, n) {
    if (!s) return form('empty', 'Type your answer first.');
    if (!/^[A-Za-z]+$/.test(s)) return form('u6l5-letters', 'Type only letters' + (n === 1 ? ' (one capital letter, like K).' : n === 2 ? ' (two letters for a side, like LM).' : ' (three letters, like XYZ).'));
    if (s.length !== n) return form('u6l5-letters', n === 1 ? 'Type just one letter (the name of the angle).' : n === 2 ? 'A side is named by its two end letters, like ' + 'LM.' : 'A triangle is named by its three letters, like XYZ.');
    return null;
  }
  /* one vertex letter. T1, T2: the two names (arrays); want: the right letter (of T2); i: its position */
  function vertexChk(want, T1, T2, i) {
    return function (resp) {
      var s = letters(resp).toUpperCase(), sl = slipL(s, 1); if (sl) return sl;
      if (s === want) return ok();
      if (T1.indexOf(s) >= 0) return wrong('u6l5-letter-tri', 'The answer is a letter of the <b>other</b> triangle, △' + T2.join('') + '.');
      if (T2.indexOf(s) >= 0) return wrong('u6l5-letter-order', 'Match the letters in order: ' + T1[i] + ' is letter ' + (i + 1) + ' of △' + T1.join('') + ', so it matches letter ' + (i + 1) + ' of △' + T2.join('') + '.');
      return wrong('u6l5-letter-none', 'Use one of the letters ' + T2.join(', ') + '.');
    };
  }
  /* a side (two letters, either order). want 'LM'; T1, T2 names; mine: the side of the other triangle it matches ('HJ') */
  function sideChk(want, T1, T2, mine, o) {
    o = o || {};
    var W = want.split('').sort().join('');
    return function (resp) {
      var s = letters(resp).toUpperCase(), sl = slipL(s, 2); if (sl) return sl;
      var S = s.split('').sort().join('');
      if (S === W) return ok();
      if (s[0] === s[1]) return form('u6l5-letters', 'A side joins two <b>different</b> vertices, like LM.');
      var inT1 = s.split('').every(function (c) { return T1.indexOf(c) >= 0; }), inT2 = s.split('').every(function (c) { return T2.indexOf(c) >= 0; });
      if (o.alt && o.alt.some(function (a) { return a.split('').sort().join('') === S; })) return ok();
      if (o.known && o.known.some(function (a) { return a.split('').sort().join('') === S; })) return wrong('u6l5-known', o.knownHint || 'That length is already known.');
      if (inT1 && !inT2) return wrong('u6l5-letter-tri', 'Use the letters of △' + T2.join('') + ' (the other triangle).');
      if (inT2) {
        var pos = mine.split('').map(function (c) { return T1.indexOf(c) + 1; }).sort();
        return wrong('u6l5-side-pair', o.pairHint || ('Match letter by letter: ' + mine + ' uses letters ' + pos.join(' and ') + ' of △' + T1.join('') + ', so the matching side uses letters ' + pos.join(' and ') + ' of △' + T2.join('') + '.'));
      }
      return wrong('u6l5-letter-none', 'Use two letters of △' + T2.join('') + '.');
    };
  }
  /* a triangle name in matching order. T1 its partner, want (array) the answer, why(i) a hint for the first wrong position */
  function triChk(want, T1, why) {
    var W = want.join('');
    return function (resp) {
      var s = letters(resp).toUpperCase(), sl = slipL(s, 3); if (sl) return sl;
      if (s === W) return ok();
      if (s.split('').sort().join('') !== want.slice().sort().join('')) {
        if (s.split('').sort().join('') === T1.slice().sort().join('')) return wrong('u6l5-letter-tri', 'Use the three letters of the <b>other</b> triangle (' + want.slice().sort().join(', ') + ').');
        return form('u6l5-letters', 'Use each of the letters ' + want.slice().sort().join(', ') + ' once.');
      }
      for (var i = 0; i < 3; i++) if (s[i] !== W[i]) return wrong('u6l5-name-order', why(i));
      return wrong('value', null);
    };
  }
  var YES = ['yes', 'y', 'yep', 'yeah', 'similar'], NO = ['no', 'n', 'nope', 'not', 'notsimilar'];
  function yesNoChk(yes, whyWrong) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/[^a-z]/g, '');
      if (!s) return form('empty', 'Type yes or no.');
      var isY = YES.indexOf(s) >= 0, isN = NO.indexOf(s) >= 0;
      if (!isY && !isN) return form('u6l5-yesno', 'Type <b>yes</b> or <b>no</b>.');
      if (isY === yes) return ok();
      return wrong(yes ? 'u6l5-aa-no' : 'u6l5-aa-yes', whyWrong);
    };
  }

  /* ================= checkers for lengths ================= */
  function readV(resp) { var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/^\s*[A-Za-z]{1,3}\s*(?:=|≈|\\approx)\s*/, '').replace(/\s*(?:cm|mm|m|km|in|ft|yd)\.?\s*$/, ''); var p = HW.parse.number(s); return p.ok ? p.value : null; }
  /* lenChk + a nudge when the answer comes from a rounded k (o.kEarly: { len, num, den } → len × num ÷ den) */
  function lenC(v, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, base = G.lenChk(v, o), early = [];
    if (o.kEarly) { var e = o.kEarly, kk = e.num / e.den; [1, 2].forEach(function (d) { var kr = rd(kk, d); if (kr && !same(kr, kk)) early.push(e.len * kr); var ki = rd(e.den / e.num, d); if (ki && !same(ki, e.den / e.num)) early.push(e.len / ki); }); }
    return function (resp) {
      var res = base(resp);
      if (res.v !== 'wrong' || !early.length) return res;
      var x = readV(resp); if (x == null) return res;
      if (Math.abs(rd(x, dp) - rd(v, dp)) > 1e-9 && early.some(function (w) { return Math.abs(rd(x, dp) - rd(w, dp)) < 1e-9 || Math.abs(x - w) < 1e-6; }))
        return form('u6l5-round-k', 'Nearly! You rounded the scale factor too soon. Keep it unrounded: key in ' + t(N(o.kEarly.len) + '\\times ' + N(o.kEarly.num) + '\\div ' + N(o.kEarly.den)) + ' and round only the answer.');
      return res;
    };
  }
  /* a length part: GP.len with the lenC checker. o: lenChk options + unit, sol, hints, text, nr, kEarly */
  function lenP(prompt, v, o) { var p = GP.len(prompt, v, o), dp = o.dp == null ? 1 : o.dp; p.check = lenC(v, o); p.key = fmtKey(v, dp); p.answer = t(HW.fmt(p.key)) + (o.unit ? ' ' + o.unit : ''); return p; }
  /* a length box in a set of boxes */
  function lenF(label, v, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp;
    return { f: { label: label, after: o.unit, name: o.name || label.replace(/[:=\s]+$/, '') }, chk: lenC(v, o), key: fmtKey(v, dp), show: t(HW.fmt(fmtKey(v, dp)) + (o.unit ? '\\text{ ' + o.unit + '}' : '')) };
  }
  function angF(label, v, alts, name) {
    alts = (alts || []).filter(function (a) { return isFinite(a.v) && a.v > 0 && !same(a.v, v); });
    return { f: { label: label, after: '°', name: name || label }, chk: G.angleChk(v, { supplementTrap: false, alts: alts }), key: nS(v), show: dg(v) };
  }
  function wordF(label, chk, key, ph, name) { return { f: { label: label, mode: 'text', placeholder: ph, name: name || label }, chk: chk, key: key, show: '<b>' + key + '</b>' }; }
  function fieldsP(prompt, fl, sol, hints, text) { return P.fields(prompt, fl.map(function (x) { return x.f; }), fl.map(function (x) { return x.chk; }), fl.map(function (x) { return x.key; }), fl.map(function (x) { return x.f.label + ' ' + x.show; }).join(' &nbsp; '), sol, hints, text); }
  /* the length box in a set must not take another box's answer */
  function otherBox(v, others) { return others.filter(function (x) { return !same(rd(x[0]), rd(v)); }).map(function (x) { return { v: x[0], code: 'u6l5-other-box', hint: 'That is the answer for ' + x[1] + '. Check which box is which.' }; }); }

  /* ================= figures ================= */
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', RED = '#c93a33', GREEN = '#12805a', AMBER = '#c27a0e', BROWN = '#8a6f4d';
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function n360(a) { return ((a % 360) + 360) % 360; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function dirTo(V, Pt) { return n360(Math.atan2(-(Pt[1] - V[1]), Pt[0] - V[0]) / RAD); }
  function lerp(A, B, s) { return [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]; }
  function dist(A, B) { return Math.hypot(A[0] - B[0], A[1] - B[1]); }
  function cen(Ps) { var x = 0, y = 0; Ps.forEach(function (p) { x += p[0] / Ps.length; y += p[1] / Ps.length; }); return [x, y]; }
  function Fig() { this.s = ''; this.bb = [1e9, 1e9, -1e9, -1e9]; }
  Fig.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); return this; };
  Fig.prototype.line = function (A, B, o) {
    o = o || {};
    this.s += '<line x1="' + f1(A[0]) + '" y1="' + f1(A[1]) + '" x2="' + f1(B[0]) + '" y2="' + f1(B[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
    return this.grow(A[0], A[1]).grow(B[0], B[1]);
  };
  Fig.prototype.path = function (d, o, pts) {
    o = o || {}; var me = this;
    this.s += '<path d="' + d + '" fill="' + (o.fill || 'none') + '"' + (o.fillOpacity != null ? ' fill-opacity="' + o.fillOpacity + '"' : '') + ' stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linejoin="round" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
    (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); return this;
  };
  Fig.prototype.poly = function (pts, o) { return this.path('M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z', o, pts); };
  Fig.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 14, str = String(s), it = /^[A-Za-z]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '';
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it +
      ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + esc(str).replace(/-/g, '−') + '</text>';
    var w = str.length * size * 0.3 + 2;
    return this.grow(o.anchor === 'start' ? x + w : o.anchor === 'end' ? x - w : x, y, w, size * 0.62);
  };
  /* n arcs (1–3) in the angle at V between the arms to A and B; n = 'R' draws a right-angle square */
  Fig.prototype.arcs = function (V, A, B, n, o) {
    o = o || {}; if (!n) return this;
    var d1 = dirTo(V, A), d2 = dirTo(V, B), sp = n360(d2 - d1), st = d1; if (sp > 180) { st = d2; sp = 360 - sp; }
    if (n === 'R') { var s = 11, u = at([0, 0], st, 1), v = at([0, 0], st + 90, 1); return this.path('M' + f1(V[0] + u[0] * s) + ' ' + f1(V[1] + u[1] * s) + 'L' + f1(V[0] + (u[0] + v[0]) * s) + ' ' + f1(V[1] + (u[1] + v[1]) * s) + 'L' + f1(V[0] + v[0] * s) + ' ' + f1(V[1] + v[1] * s), { stroke: INK, width: 1.5 }); }
    var r0 = (o.r || 15) * (sp < 35 ? 1.5 : sp < 50 ? 1.2 : 1), d = '';
    for (var i = 0; i < n; i++) { var r = r0 + i * 4, a = at(V, st, r), b = at(V, st + sp, r); d += 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + f1(r) + ' ' + f1(r) + ' 0 0 0 ' + f1(b[0]) + ' ' + f1(b[1]); }
    this.path(d, { stroke: o.color || INK, width: 1.4 });
    if (o.label) { var m = at(V, st + sp / 2, r0 + (n - 1) * 4 + 13); this.text(m[0], m[1], o.label, { size: 13, weight: 600 }); }
    return this;
  };
  Fig.prototype.right = function (V, A, B) { return this.arcs(V, A, B, 'R'); };
  /* a ">" mark in the middle of AB pointing from A to B (parallel lines) */
  Fig.prototype.chev = function (A, B) { var d = dirTo(A, B), M = lerp(A, B, 0.5), c = at(M, d, 4), a = at(c, d + 180, 8), u = at([0, 0], d + 90, 5.5); return this.path('M' + f1(a[0] + u[0]) + ' ' + f1(a[1] + u[1]) + 'L' + f1(c[0]) + ' ' + f1(c[1]) + 'L' + f1(a[0] - u[0]) + ' ' + f1(a[1] - u[1]), { stroke: INK, width: 2 }); };
  /* a label beside segment AB, away from point C (o.inside: toward it) */
  Fig.prototype.seg = function (A, B, C, s, o) {
    o = o || {}; if (s == null || s === '') return this; var M = lerp(A, B, o.at == null ? 0.5 : o.at), n = at([0, 0], dirTo(A, B) + 90, 1);
    if ((C[0] - M[0]) * n[0] + (C[1] - M[1]) * n[1] > 0) n = [-n[0], -n[1]];
    if (o.inside) n = [-n[0], -n[1]];
    var size = o.size || 14, str = String(s), d = (o.gap || 6) + Math.abs(n[0]) * (str.length * size * 0.3 + 2) + Math.abs(n[1]) * size * 0.6;
    return this.text(M[0] + n[0] * d, M[1] + n[1] * d, str, { size: size, color: o.color || (str === '?' || /^[a-z]$/.test(str) ? RED : INK), weight: 700 });
  };
  /* a vertex name just outside the figure (away from C) */
  Fig.prototype.name = function (V, C, s, o) { o = o || {}; var p = at(V, dirTo(C, V), o.d || 13); return this.text(p[0], p[1], s, { size: 15, italic: false }); };
  /* a dimension line beside AB, off px to the left of A→B, with a label */
  Fig.prototype.dim = function (A, B, off, s, o) {
    o = o || {}; var th = dirTo(A, B), n = at([0, 0], th + 90, 1), a = [A[0] + n[0] * off, A[1] + n[1] * off], b = [B[0] + n[0] * off, B[1] + n[1] * off], col = o.color || '#3a4254';
    this.line(a, b, { color: col, width: 1.2 });
    [[a, th + 180], [b, th]].forEach(function (z) { var E = z[0], u = at([0, 0], z[1], 1), L = 7, w = 3.2; this.path('M' + f1(E[0]) + ' ' + f1(E[1]) + 'L' + f1(E[0] - L * u[0] + w * u[1]) + ' ' + f1(E[1] - L * u[1] - w * u[0]) + 'L' + f1(E[0] - L * u[0] - w * u[1]) + ' ' + f1(E[1] - L * u[1] + w * u[0]) + 'Z', { fill: col }); }, this);
    if (s != null && s !== '') { var sg = off < 0 ? -1 : 1, M = lerp(a, b, 0.5), str = String(s), ext = Math.abs(n[0]) * (str.length * 14 * 0.3 + 3) + Math.abs(n[1]) * 14 * 0.6 + 3; this.text(M[0] + n[0] * ext * sg, M[1] + n[1] * ext * sg, str, { size: 14, color: str === '?' || /^[a-z]$/.test(str) ? RED : col }); }
    return this;
  };
  Fig.prototype.ground = function (x0, x1, y) { this.line([x0, y], [x1, y], { color: BROWN, width: 2.4 }); var d = ''; for (var x = x0 + 4; x < x1; x += 11) d += 'M' + f1(x) + ' ' + f1(y + 1) + 'l-6 7'; return this.path(d, { stroke: BROWN, width: 1 }, [[x0, y + 8]]); };
  Fig.prototype.svg = function (o) {
    o = o || {}; var pad = o.pad == null ? 8 : o.pad, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>';
  };

  /* triangle shapes in math coordinates (y up): vertex 0 = left, 1 = right, 2 = top; side i joins vertex i and i + 1 */
  function triAA(base, aL, aR) { var aT = 180 - aL - aR, left = base * Math.sin(aR * RAD) / Math.sin(aT * RAD); return [[0, 0], [base, 0], [left * Math.cos(aL * RAD), left * Math.sin(aL * RAD)]]; }
  function triSSS(b, l, rr) { var x = (b * b + l * l - rr * rr) / (2 * b); return [[0, 0], [b, 0], [x, Math.sqrt(Math.max(1e-6, l * l - x * x))]]; }
  function angAt(Ps, i) { var V = Ps[i], A = Ps[(i + 1) % 3], B = Ps[(i + 2) % 3], a = Math.atan2(A[1] - V[1], A[0] - V[0]), b = Math.atan2(B[1] - V[1], B[0] - V[0]), d = Math.abs(a - b) / RAD; return d > 180 ? 360 - d : d; }
  /* math points → screen points: flip (mirror left–right), turn rot degrees, scale so the longest extent is size px */
  function place(Ps, size, rot, flip) {
    var c = Math.cos((rot || 0) * RAD), s = Math.sin((rot || 0) * RAD);
    var Q = Ps.map(function (p) { var x = flip ? -p[0] : p[0], y = p[1]; return [x * c - y * s, x * s + y * c]; });
    var xs = Q.map(function (p) { return p[0]; }), ys = Q.map(function (p) { return p[1]; }), w = Math.max.apply(null, xs) - Math.min.apply(null, xs), h = Math.max.apply(null, ys) - Math.min.apply(null, ys);
    var sc = size / Math.max(w, h * 1.15, 1e-6), x0 = Math.min.apply(null, xs), y1 = Math.max.apply(null, ys);
    return Q.map(function (p) { return [(p[0] - x0) * sc, (y1 - p[1]) * sc]; });
  }
  /* two (or more) triangles side by side. tris: [{ pts (math), size px, rot, flip, names [3], arcs [3] (0, 1–3, 'R'),
   *   angs [3] (labels in the arcs), sides [3] (labels; side i joins vertex i and i + 1) }] */
  function trisSVG(tris, o) {
    o = o || {}; var fg = new Fig(), x = 0, gap = o.gap == null ? 46 : o.gap, placed = [];
    tris.forEach(function (T) {
      var S = place(T.pts, T.size || 130, T.rot, T.flip), H = Math.max.apply(null, S.map(function (p) { return p[1]; }));
      var lw = Math.max.apply(null, (T.sides || []).map(function (s) { return s ? String(s).length * 8.4 : 0; }).concat([0]));
      S = S.map(function (p) { return [p[0] + x + (placed.length ? lw : 0), p[1] + (o.align === 'top' ? 0 : (o.H || 150) - H) / (o.align === 'bottom' ? 1 : 2)]; });
      placed.push(S); x = Math.max.apply(null, S.map(function (p) { return p[0]; })) + gap + lw;
      var C = cen(S);
      fg.poly(S, { fill: T.fill || '#eef1f6', stroke: INK, width: 2.4 });
      (T.arcs || []).forEach(function (n, i) { if (n) fg.arcs(S[i], S[(i + 1) % 3], S[(i + 2) % 3], n, { label: T.angs && T.angs[i] }); });
      if (!T.arcs && T.angs) T.angs.forEach(function (a, i) { if (a) fg.arcs(S[i], S[(i + 1) % 3], S[(i + 2) % 3], 1, { label: a }); });
      (T.sides || []).forEach(function (s, i) { if (s != null && s !== '') fg.seg(S[i], S[(i + 1) % 3], C, s); });
      (T.names || []).forEach(function (nm, i) { if (nm) fg.name(S[i], C, nm); });
    });
    return fg.svg({ width: o.width || 420, aria: o.aria || 'two triangles' });
  }
  /* △ABC with DE ∥ BC (D on AB, E on AC). nm: [A, B, C, D, E]; s = AD ÷ AB; lab: { AD, DB, AE, EC, DE, BC }; o.AB / o.AC: a dimension
   *   label for the whole side; o.apex: the top's x (0–1 of the base) */
  function nestedSVG(nm, s, lab, o) {
    o = o || {}; var fg = new Fig(), W = 240, Hh = 190, ax = (o.apex == null ? 0.38 : o.apex) * W, A = [ax, 0], B = [0, Hh], C = [W, Hh], D = lerp(A, B, s), E = lerp(A, C, s), G0 = cen([A, B, C]);
    if (o.fill) fg.poly([A, B, C], { fill: o.fill });
    fg.poly([A, B, C], { fill: o.fill ? 'none' : '#eef1f6', stroke: INK, width: 2.4 }).line(D, E, { width: 2.4, color: BLUE, dash: o.dashDE ? '7 5' : null }).chev(D, E).chev(B, C);
    [[A, D, 'AD'], [D, B, 'DB'], [A, E, 'AE'], [E, C, 'EC']].forEach(function (z) { if (lab[z[2]]) fg.seg(z[0], z[1], G0, lab[z[2]]); });
    if (lab.DE) fg.seg(D, E, A, lab.DE, { inside: true, gap: 4, at: 0.3 });
    if (lab.BC) fg.seg(B, C, A, lab.BC);
    var outOff = function (P1, P2, off) { var th = dirTo(P1, P2), n = at([0, 0], th + 90, 1), M = lerp(P1, P2, 0.5); return (G0[0] - M[0]) * n[0] + (G0[1] - M[1]) * n[1] > 0 ? -off : off; };
    if (o.AB) fg.dim(A, B, outOff(A, B, 34 + Math.max(String(lab.AD || '').length, String(lab.DB || '').length) * 6), o.AB);
    if (o.AC) fg.dim(C, A, outOff(C, A, 34 + Math.max(String(lab.AE || '').length, String(lab.EC || '').length) * 6), o.AC);
    fg.name(A, G0, nm[0]).name(B, G0, nm[1]).name(C, G0, nm[2]).name(D, E, nm[3]).name(E, D, nm[4]);
    return fg.svg({ width: o.width || 300, aria: o.aria || 'a triangle cut by a line parallel to one side' });
  }
  /* two segments crossing at X. Top: P1 (left) – P2 (right); bottom: Q1 (left) – Q2 (right), parallel; P1–X–Q2 and P2–X–Q1 are straight.
   *   s = top ÷ bottom. lab: { top, bottom, P1X, XQ2, P2X, XQ1 }; nm: [P1, P2, X, Q1, Q2] or o.xName; o.ground (a sawhorse), o.water (a pond above) */
  function crossSVG(nm, s, lab, o) {
    o = o || {}; var fg = new Fig(), big = 230, Wb = s >= 1 ? big / s : big, Hh = 190, Wt = Wb * s, yX = Hh * s / (1 + s), cx = big / 2;
    var P1 = [cx - Wt / 2, 0], P2 = [cx + Wt / 2, 0], Q1 = [cx - Wb / 2, Hh], Q2 = [cx + Wb / 2, Hh], X = [cx, yX];
    if (o.water) fg.path('M' + f1(P1[0]) + ' ' + f1(P1[1]) + 'C' + f1(P1[0] + 10) + ' ' + f1(-55) + ' ' + f1(P2[0] - 10) + ' ' + f1(-55) + ' ' + f1(P2[0]) + ' ' + f1(P2[1]) + 'C' + f1(P2[0] - 30) + ' 10 ' + f1(P1[0] + 30) + ' 10 ' + f1(P1[0]) + ' ' + f1(P1[1]) + 'Z', { fill: o.water, stroke: 'none' }, [[P1[0], -45]]);
    if (o.water) fg.text(cx, -22, o.waterName || 'pond', { size: 12, weight: 600, color: GREY });
    if (o.ground) { fg.ground(Q1[0] - 25, Q2[0] + 25, Hh); fg.line([P1[0] - 18, -5], [P2[0] + 18, -5], { color: '#8a909c', width: 6 }); }
    fg.poly([P1, P2, X], { fill: BLUE, fillOpacity: 0.08 }).poly([Q1, Q2, X], { fill: BLUE, fillOpacity: 0.08 });
    fg.line(P1, Q2).line(P2, Q1);
    if (!o.ground) { fg.line(P1, P2, { dash: o.dashTop ? '7 5' : null }).line(Q1, Q2).chev(P1, P2).chev(Q2, Q1); }
    fg.path('M' + f1(X[0]) + ' ' + f1(X[1]), {}, []); fg.s += '<circle cx="' + f1(X[0]) + '" cy="' + f1(X[1]) + '" r="3.2" fill="' + INK + '"/>';
    if (lab.top) fg.seg(P1, P2, X, lab.top, o.water ? { inside: true, at: 0.28 } : {}); if (lab.bottom) fg.seg(Q1, Q2, X, lab.bottom);
    if (lab.P1X) fg.seg(P1, X, P2, lab.P1X); if (lab.P2X) fg.seg(P2, X, P1, lab.P2X); if (lab.XQ2) fg.seg(X, Q2, Q1, lab.XQ2); if (lab.XQ1) fg.seg(X, Q1, Q2, lab.XQ1);
    if (nm) { fg.name(P1, [P1[0] + 20, P1[1] + 20], nm[0]).name(P2, [P2[0] - 20, P2[1] + 20], nm[1]).name(Q1, [Q1[0] + 20, Q1[1] - 20], nm[3]).name(Q2, [Q2[0] - 20, Q2[1] - 20], nm[4]); fg.text(X[0] + 18, X[1], nm[2], { size: 15, italic: false }); }
    else if (o.xName) fg.text(X[0] + 18, X[1], o.xName, { size: 15, italic: false });
    return fg.svg({ width: o.width || 300, aria: o.aria || 'two crossing triangles' });
  }
  /* a straight slope from A on the ground, a vertical post at d1 (height h1) and a vertical at d2 (height h2). lab: { d1, d2, h1, h2,
   *   A, top }; o.wall (a bin wall at d2), o.dashed (the tall height dashed), o.post2: { d, lab } (a second post), o.beyond (the slope
   *   runs on past the top: a door / belt) */
  function slopeSVG(o) {
    var lab = o.lab || {}, fg = new Fig(), sx = 300 / o.d2, H2 = Math.max(80, Math.min(150, o.h2 * sx * 1.6)), sy = H2 / o.h2, gy = 0;
    var X = function (x) { return x * sx; }, Y = function (y) { return gy - y * sy; };
    var A = [0, gy], D = [X(o.d1), gy], E = [X(o.d1), Y(o.h1)], B = [X(o.d2), gy], C = [X(o.d2), Y(o.h2)];
    if (o.wall) fg.poly([[B[0], Y(o.h2)], [B[0] + 45, Y(o.h2)], [B[0] + 45, gy], B], { fill: '#dde1e8', stroke: '#6a7182', width: 1.2 });
    fg.poly([A, B, C], { fill: AMBER, fillOpacity: 0.1 });
    fg.ground(-25, B[0] + (o.wall ? 55 : 30), gy);
    fg.line(A, o.beyond ? at(C, dirTo(A, C), 30) : C, { width: 4, color: '#3a4254' });
    fg.line(D, E, { width: 2.6 }); fg.line(B, C, { width: o.wall ? 2.6 : 2.2, dash: o.dashed ? '6 5' : null });
    fg.right(D, A, E).right(B, A, C);
    if (o.post2) { var D2 = [X(o.post2.d), gy], E2 = [X(o.post2.d), Y(o.h2 * o.post2.d / o.d2)]; fg.line(D2, E2, { width: 2.2, color: BLUE }); fg.right(D2, A, E2); if (o.post2.h) fg.text(D2[0] + 6, (D2[1] + E2[1]) / 2, o.post2.h, { size: 14, anchor: 'start', color: o.post2.h === '?' ? RED : BLUE }); if (o.post2.lab) fg.dim(A, D2, 18 + 26 * 2, o.post2.lab, { color: BLUE }); }
    fg.arcs(A, B, C, 1, { r: 26 });
    if (lab.A) fg.text(A[0] - 10, A[1] + 12, lab.A, { size: 15, italic: false });
    if (lab.top) fg.text(C[0] + (o.wall ? -10 : 0), C[1] - 14, lab.top, { size: 12, weight: 600, color: GREY });
    if (lab.h1) fg.text(D[0] + 6, (D[1] + E[1]) / 2, lab.h1, { size: 14, anchor: 'start', color: lab.h1 === '?' ? RED : INK });
    if (lab.h2) fg.text(C[0] + (o.wall ? -6 : 6), (B[1] + C[1]) / 2, lab.h2, { size: 14, anchor: o.wall ? 'end' : 'start', color: lab.h2 === '?' ? RED : INK });
    if (lab.d1) fg.dim(A, D, -18, lab.d1);
    if (lab.d2) fg.dim(A, B, -(lab.d1 ? 46 : 18), lab.d2);
    return fg.svg({ width: o.width || 380, aria: o.aria || 'a slope with a vertical post' });
  }
  /* two ladders against walls at the same angle: { L: [L1, L2], f: [f1, f2], h: [h1, h2] } labels (strings or null); ang the ground angle */
  function laddersSVG(o) {
    var fg = new Fig(), x = 0, ang = o.ang || 75, sz = [1, Math.max(0.75, Math.min(1.5, o.k || 1.4))];
    [0, 1].forEach(function (i) {
      var len = 150 * sz[i] / 1.3, ft = len * Math.cos(ang * RAD), ht = len * Math.sin(ang * RAD), base = 200, wall = x + ft + 40;
      var F = [wall - ft, base], T = [wall, base - ht], W0 = [wall, base];
      fg.poly([[wall, base - ht - 15], [wall + 14, base - ht - 15], [wall + 14, base], [wall, base]], { fill: '#dde1e8', stroke: '#6a7182', width: 1.2 });
      fg.ground(F[0] - 30, wall + 14, base); fg.line(F, T, { width: 4, color: '#8a5a2b' }); fg.right(W0, F, T); fg.arcs(F, W0, T, 1, { r: 18 });
      if (o.L[i]) fg.seg(F, T, W0, o.L[i]); if (o.f[i]) fg.dim(F, W0, -16, o.f[i]); if (o.h && o.h[i]) fg.text(wall + 20, base - ht / 2, o.h[i], { size: 14, anchor: 'start', color: o.h[i] === '?' ? RED : INK });
      fg.text((F[0] + wall) / 2 - 10, base - ht - 24, 'ladder ' + (i + 1), { size: 12, weight: 600, color: GREY });
      x = wall + 14 + (o.h && o.h[i] ? 60 : 30);
    });
    return fg.svg({ width: o.width || 380, aria: 'two ladders against walls' });
  }
  /* an A-shaped sign: legs from the hinge H to the floor, a chain parallel to the floor; s = chain distance ÷ leg; lab: { leg, down, chain, feet } */
  function aFrameSVG(s, lab, o) {
    o = o || {}; var fg = new Fig(), Hh = 200, W = 200, H = [W / 2, 0], L = [0, Hh], R = [W, Hh], CL = lerp(H, L, s), CR = lerp(H, R, s), G0 = cen([H, L, R]);
    fg.ground(-30, W + 30, Hh); fg.poly([H, CL, CR], { fill: BLUE, fillOpacity: 0.1 }); fg.poly([H, L, R], { fill: BLUE, fillOpacity: 0.05 });
    fg.line(L, H, { width: 4 }).line(H, R, { width: 4 }).line(CL, CR, { width: 2, dash: '5 4', color: GREY });
    fg.s += '<circle cx="' + f1(H[0]) + '" cy="' + f1(H[1]) + '" r="3.5" fill="' + INK + '"/>';
    if (lab.leg) fg.seg(L, H, G0, lab.leg); if (lab.down) fg.seg(H, CR, G0, lab.down); if (lab.chain) fg.seg(CL, CR, H, lab.chain, { inside: false, gap: 5 });
    if (lab.feet) fg.dim(L, R, -16, lab.feet);
    fg.text(H[0], H[1] - 14, 'hinge', { size: 12, weight: 600, color: GREY });
    return fg.svg({ width: o.width || 260, aria: 'an A-shaped sandwich-board sign' });
  }
  HW.u6tri = { Fig: Fig, triAA: triAA, triSSS: triSSS, place: place, trisSVG: trisSVG, nestedSVG: nestedSVG, crossSVG: crossSVG, slopeSVG: slopeSVG, laddersSVG: laddersSVG, aFrameSVG: aFrameSVG,
    letters: letters, vertexChk: vertexChk, sideChk: sideChk, triChk: triChk, yesNoChk: yesNoChk, lenC: lenC, lenP: lenP, lenF: lenF, angF: angF, wordF: wordF, fieldsP: fieldsP, at: at, dirTo: dirTo, lerp: lerp, cen: cen };

  HW.addCodes({
    'u6l5-one-angle': 'Subtracted only one angle from 180°', 'u6l5-sum': 'Gave the sum of the two angles', 'u6l5-360': 'Used 360° for a triangle', 'u6l5-aa-yes': 'Said similar when only one angle pair matches',
    'u6l5-aa-no': 'Said not similar when the angles match', 'u6l5-letters': 'Letter answer in the wrong form', 'u6l5-letter-tri': 'Used a letter from the wrong triangle', 'u6l5-letter-order': 'Matched letters out of order',
    'u6l5-letter-none': 'A letter that isn’t in the triangle', 'u6l5-side-pair': 'Named a side that doesn’t match', 'u6l5-name-order': 'Similar triangles named out of matching order', 'u6l5-known': 'Named a length already known',
    'u6l5-yesno': 'Not a yes / no answer', 'u6l5-piece': 'Used a piece instead of the whole side', 'u6l5-whole': 'Gave the whole side instead of the piece', 'u6l5-round-k': 'Rounded the scale factor too early',
    'u6l5-other-box': 'Answers in each other’s boxes', 'u6l5-wrong-pair': 'Used sides that don’t match', 'u6l5-base-angle': 'Isosceles base angle not halved', 'u6l5-k-sum': 'Added the scale factor'
  });
  HW.addPartial({ 'u6l5-one-angle': 'b', 'u6l5-sum': 'b', 'u6l5-360': 'b', 'u6l5-letter-order': 'b', 'u6l5-name-order': 'b', 'u6l5-piece': 'b', 'u6l5-whole': 's', 'u6l5-round-k': 's', 'u6l5-other-box': 's', 'u6l5-wrong-pair': 'n' });

  /* ================= Q1 / Extra 1: the AA test table ================= */
  var EX_SETS = ['47,65,68', '34,56,90', '32,58,90', '36,72,72', '36,36,108', '50,60,70'];
  function setKey(a) { return a.slice().sort(function (x, y) { return x - y; }).join(','); }
  function okSet(a) { return a.every(function (x) { return x >= 12; }) && EX_SETS.indexOf(setKey(a)) < 0; }
  /* one row: kind 'yes' | 'right' | 'no' | 'obtuse' | 'no-iso' → { t1: [a, b], m1, t2: [c, d], m2, sim, A1 (all three), A2 } */
  function aaRow(r, kind) {
    return find(function () {
      var a, b, c, d;
      if (kind === 'yes') { a = r.int(40, 78); b = r.int(40, 78); c = 180 - a - b; if (c < 30 || c > 85 || a === b || a === c || b === c) return null; return { t1: [a, b], t2: [c, a], sim: true }; }
      if (kind === 'right') { b = r.int(24, 66); if (b === 45) return null; return { t1: [90, b], t2: [90, 90 - b], sim: true }; }
      if (kind === 'obtuse') { a = r.int(96, 128); b = r.int(16, 42); c = 180 - a - b; if (c < 14 || c === b) return null; return { t1: [a, b], t2: [c, b], sim: true }; }
      if (kind === 'no') { a = r.int(55, 95); b = r.int(30, 60); c = 180 - a - b; d = b + r.pick([-7, -6, -5, -4, 4, 5, 6, 7]); var e = 180 - a - d; if (c < 20 || e < 20 || [b, c].indexOf(d) >= 0 || [b, c].indexOf(e) >= 0 || b === c) return null; return { t1: [a, b], t2: [a, d], sim: false }; }
      /* no-iso: triangle 1 is isosceles (a, b, b); triangle 2 shares b only */
      b = r.int(52, 74); a = 180 - 2 * b; d = r.int(50, 85); c = 180 - b - d; if ([a, b].indexOf(d) >= 0 || [a, b].indexOf(c) >= 0 || c < 20) return null; return { t1: [a, b], t2: [b, d], sim: false };
    }, function (v) { v.m1 = 180 - v.t1[0] - v.t1[1]; v.m2 = 180 - v.t2[0] - v.t2[1]; v.A1 = v.t1.concat([v.m1]); v.A2 = v.t2.concat([v.m2]); return okSet(v.A1) && okSet(v.A2) && (setKey(v.A1) === setKey(v.A2)) === v.sim; }, { t1: [52, 71], t2: [57, 52], sim: true, m1: 57, m2: 71, A1: [52, 71, 57], A2: [57, 52, 71] });
  }
  var TD = 'border:1px solid #c9b79c;padding:4px 10px;text-align:center';
  function aaTable(rows, labels) {
    var th = function (s) { return '<th style="' + TD + ';background:#f6efe2">' + s + '</th>'; }, td = function (s) { return '<td style="' + TD + '">' + s + '</td>'; }, two = function (x) { return dg(x[0]) + ' and ' + dg(x[1]); }, blank = '<span style="color:#c93a33;font-weight:700">?</span>';
    return '<div style="overflow-x:auto"><table style="border-collapse:collapse;margin:6px 0">' + '<tr>' + th('') + th('Triangle 1 has') + th('Missing angle') + th('Triangle 2 has') + th('Missing angle') + th('Similar?') + '</tr>' +
      rows.map(function (rw, i) { return '<tr>' + td(labels[i]) + td(two(rw.t1)) + td(blank) + td(two(rw.t2)) + td(blank) + td(blank) + '</tr>'; }).join('') + '</table></div>';
  }
  function angAlts(g) { var s = g[0] + g[1]; return [{ v: 180 - g[0], code: 'u6l5-one-angle', hint: 'Subtract <b>both</b> given angles: ' + t('180^\\circ-(' + g[0] + '^\\circ+' + g[1] + '^\\circ)') + '.' }, { v: 180 - g[1], code: 'u6l5-one-angle', hint: 'Subtract <b>both</b> given angles: ' + t('180^\\circ-(' + g[0] + '^\\circ+' + g[1] + '^\\circ)') + '.' }, { v: s, code: 'u6l5-sum', hint: 'That is the sum of the two given angles. Subtract it from 180°.' }, { v: 360 - s, code: 'u6l5-360', hint: 'The angles of a triangle add to <b>180°</b> (360° is for a four-sided shape).' }]; }
  function aaPart(rw, lab) {
    var shared = rw.A1.filter(function (x) { return rw.A2.indexOf(x) >= 0; });
    var why = rw.sim ? 'List all three angles of each triangle: ' + rw.A1.join('°, ') + '° and ' + rw.A2.join('°, ') + '°. They are the same three angles in a different order, so the triangles <b>are</b> similar (AA).'
      : 'List all three angles of each triangle. Only ' + (shared.length === 1 ? 'one angle (' + shared[0] + '°) matches' : 'some angles match') + '; AA needs <b>two</b> pairs of equal angles, so they are <b>not</b> similar.';
    var fl = [angF('Triangle 1, missing angle:', rw.m1, angAlts(rw.t1), 'Triangle 1'), angF('Triangle 2, missing angle:', rw.m2, angAlts(rw.t2), 'Triangle 2'), wordF('Similar?', yesNoChk(rw.sim, why), rw.sim ? 'yes' : 'no', 'yes/no', 'Similar?')];
    return fieldsP('Row ' + lab + ': find the missing angle of each triangle. Then type <b>yes</b> or <b>no</b>: are the two triangles similar?', fl,
      br(['Triangle 1: ' + t('180^\\circ-(' + rw.t1[0] + '^\\circ+' + rw.t1[1] + '^\\circ)=' + rw.m1 + '^\\circ'), 'Triangle 2: ' + t('180^\\circ-(' + rw.t2[0] + '^\\circ+' + rw.t2[1] + '^\\circ)=' + rw.m2 + '^\\circ'),
        'Angles: ' + t(rw.A1.join('^\\circ,\\ ') + '^\\circ') + ' and ' + t(rw.A2.join('^\\circ,\\ ') + '^\\circ') + '.', rw.sim ? 'All three match, so <b>yes</b>, they are similar (AA).' : 'Only one pair matches, so <b>no</b>, they are not similar.']),
      ['Missing angle = 180° − (the two given angles).', 'Similar only if two pairs of angles match (then the third matches too).'], 'AA table ' + lab);
  }

  /* ================= Q2 / Extra 2: blanks from the naming order ================= */
  function nameShared(r, not) { var nm = twoTris(r, not); return { T1: nm[0], T2: nm[1], ord: r.shuffle([[0, 1], [1, 2], [0, 2]]), blank: r.int(0, 1), side: r.pick([[0, 1], [1, 2], [0, 2]]), across: r.chance(0.5) }; }
  function sd(T, p) { return T[p[0]] + T[p[1]]; }
  function namePartABC(sh) {
    var T1 = sh.T1, T2 = sh.T2, fl = [0, 1, 2].map(function (i) { return wordF(t('\\angle ' + T1[i]) + ' = ∠', vertexChk(T2[i], T1, T2, i), T2[i], '', '∠' + T1[i]); });
    return fieldsP('Fill in the blanks: the angle of △' + T2.join('') + ' that is equal to each angle.', fl,
      'Match the letters in order: 1st with 1st, 2nd with 2nd, 3rd with 3rd.<br>' + [0, 1, 2].map(function (i) { return t('\\angle ' + T1[i] + '=\\angle ' + T2[i]); }).join(', '), ['Write the two names one above the other: ' + T1.join('') + ' over ' + T2.join('') + '. Letters in the same place match.'], 'angles from the name');
  }
  function namePartD(sh) {
    var T1 = sh.T1, T2 = sh.T2, o = sh.ord, b = sh.blank, f = function (top, bot) { return '\\dfrac{' + top + '}{' + bot + '}'; }, box = function (n) { return '\\boxed{\\,' + n + '\\,}'; };
    var r2 = b === 0 ? f(sd(T2, o[1]), box(1)) : f(box(1), sd(T1, o[1])), r3 = b === 0 ? f(box(2), sd(T1, o[2])) : f(sd(T2, o[2]), box(2));
    var w1 = b === 0 ? sd(T1, o[1]) : sd(T2, o[1]), w2 = b === 0 ? sd(T2, o[2]) : sd(T1, o[2]);
    var wrongTri = function (onTop) { return 'The ' + (onTop ? 'top' : 'bottom') + ' of each ratio is a side of △' + (onTop ? T2 : T1).join('') + ', like ' + (onTop ? sd(T2, o[0]) : sd(T1, o[0])) + ' in the first ratio.'; };
    var mk = function (want, onTop, partnerOf) { var mine = partnerOf, A = onTop ? T1 : T2, B = onTop ? T2 : T1; return sideChk(want, A, B, mine, { pairHint: 'Match letter by letter: ' + mine + ' and the box must use the <b>same positions</b> in the two names (' + T1.join('') + ' and ' + T2.join('') + ').' }); };
    var c1 = b === 0 ? mk(w1, false, sd(T2, o[1])) : mk(w1, true, sd(T1, o[1])), c2 = b === 0 ? mk(w2, true, sd(T1, o[2])) : mk(w2, false, sd(T2, o[2]));
    var wrap = function (c, onTop) { return function (resp) { var v = c(resp); if (v.code === 'u6l5-letter-tri') return wrong('u6l5-letter-tri', wrongTri(onTop)); return v; }; };
    var fl = [wordF('Box 1:', wrap(c1, b !== 0), w1, '', 'Box 1'), wordF('Box 2:', wrap(c2, b === 0), w2, '', 'Box 2')];
    return fieldsP('Complete the equal ratios.<div style="margin:8px 0">' + t(f(sd(T2, o[0]), sd(T1, o[0])) + '=' + r2 + '=' + r3) + '</div>', fl,
      'Each ratio is a side of △' + T2.join('') + ' over the matching side of △' + T1.join('') + ' (the same letter positions):<br>' + t(f(sd(T2, o[0]), sd(T1, o[0])) + '=' + f(sd(T2, o[1]), sd(T1, o[1])) + '=' + f(sd(T2, o[2]), sd(T1, o[2]))),
      ['The top of every ratio comes from △' + T2.join('') + ', the bottom from △' + T1.join('') + '.', 'Matching sides use the same letter positions: letters 1 and 2, 2 and 3, or 1 and 3.'], 'equal ratios');
  }
  function namePartE(sh) {
    var T1 = sh.T1, T2 = sh.T2, s = sh.side, mine = sd(T1, s), want = sd(T2, s), opp = [0, 1, 2].filter(function (i) { return s.indexOf(i) < 0; })[0];
    var pr = sh.across ? 'Side ' + t(mine) + ' is across from ' + t('\\angle ' + T1[opp]) + '. Which side of △' + T2.join('') + ' does it match?' : 'Side ' + t(mine) + ' matches which side of △' + T2.join('') + '?';
    return fieldsP(pr, [wordF('Side', sideChk(want, T1, T2, mine), want, '', 'Side')],
      t(mine) + ' uses letters ' + (s[0] + 1) + ' and ' + (s[1] + 1) + ' of ' + T1.join('') + ', so it matches letters ' + (s[0] + 1) + ' and ' + (s[1] + 1) + ' of ' + T2.join('') + ': side ' + t(want) + '.' + (sh.across ? '<br>(Check: ' + t(want) + ' is across from ' + t('\\angle ' + T2[opp]) + ', and ' + t('\\angle ' + T2[opp] + '=\\angle ' + T1[opp]) + '.)' : ''),
      ['Find the positions of ' + mine.split('').join(' and ') + ' in ' + T1.join('') + '. Take the letters in the same positions of ' + T2.join('') + '.'], 'matching side');
  }

  /* ================= Q3 / Extra 3: naming from matching arcs ================= */
  function arcsShared(r, not) {
    var nm = twoTris(r, not);
    return find(function () {
      var A = r.shuffle([r.int(36, 54), r.int(58, 72), r.int(76, 92)]), arcs = r.shuffle([1, 2, 3]), p1 = r.shuffle([0, 1, 2]), p2 = r.shuffle([0, 1, 2]);
      return { T1: nm[0], T2: nm[1], A: A, arcs: arcs, p1: p1, p2: p2, rot: r.pick([-80, -100, 150, 180, 200, 70, 110]), flip: r.chance(0.5), k: r.pick([0.8, 0.85, 1.15, 1.25]) };
    }, function (s) {
      if (Math.abs(180 - s.A[0] - s.A[1] - s.A[2]) > 0) { var d = 180 - s.A[0] - s.A[1]; if (d < 30 || d > 100 || Math.abs(d - s.A[0]) < 10 || Math.abs(d - s.A[1]) < 10) return false; s.A[2] = d; }
      if (s.p1.join() === s.p2.join()) return false;
      s.ans = s.p1.map(function (ai) { return s.T2[s.p2.indexOf(ai)]; });
      return s.ans.join('') !== s.T2.join('') && !(s.T1.join('') === 'ABC' && s.ans.join('') === 'RPQ');
    }, null) || { T1: ['R', 'S', 'T'], T2: ['Z', 'X', 'Y'], A: [65, 45, 70], arcs: [2, 1, 3], p1: [0, 1, 2], p2: [1, 2, 0], rot: -80, flip: false, k: 0.85, ans: ['Y', 'Z', 'X'] };
  }
  function arcsSVG(s) {
    var mk = function (p, T, size, rot, flip) { var aL = s.A[p[0]], aR = s.A[p[1]]; return { pts: triAA(1, aL, aR), size: size, rot: rot, flip: flip, names: T, arcs: p.map(function (ai) { return s.arcs[ai]; }) }; };
    return trisSVG([mk(s.p1, s.T1, 130, 0, false), mk(s.p2, s.T2, 130 * s.k, s.rot, s.flip)], { gap: 60, aria: 'two similar triangles with matching angle arcs' });
  }
  function arcWord(n) { return n === 1 ? 'one arc' : n === 2 ? 'two arcs' : 'three arcs'; }
  function arcsName(s) {
    var T1 = s.T1, T2 = s.T2, arcOf1 = function (i) { return s.arcs[s.p1[i]]; };
    return fieldsP('Name the second triangle so that its letters match △' + T1.join('') + ' in order.', [wordF('△' + T1.join('') + ' ∼ △', triChk(s.ans, T1, function (i) { return 'Check letter ' + (i + 1) + ': ' + T1[i] + ' has ' + arcWord(arcOf1(i)) + '. Put the vertex of the other triangle with ' + arcWord(arcOf1(i)) + ' in that place.'; }), s.ans.join(''), '', 'Name')],
      [0, 1, 2].map(function (i) { return cap1(arcWord(arcOf1(i))) + ': ' + T1[i] + ' and ' + s.ans[i]; }).join('. ') + '.<br>So ' + T1.map(function (x, i) { return x + ' → ' + s.ans[i]; }).join(', ') + ': ' + t('\\triangle ' + T1.join('') + '\\sim\\triangle ' + s.ans.join('')) + '.',
      ['Match the vertices by the number of arcs, not by where they are on the page.', 'Go through ' + T1.join(', ') + ' in order and write the matching letter each time.'], 'name from arcs');
  }
  function cap1(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
  function arcsSide(s, pr) {
    var T1 = s.T1, mine = sd(T1, pr), want = s.ans[pr[0]] + s.ans[pr[1]];
    return fieldsP('Which side matches ' + t(mine) + '?', [wordF('Side', sideChk(want, T1, s.T2, mine, { pairHint: 'Match each end by its arcs: ' + T1[pr[0]] + ' goes with the vertex that has the same number of arcs, and so does ' + T1[pr[1]] + '.' }), want, '', 'Side')],
      T1[pr[0]] + ' → ' + s.ans[pr[0]] + ' and ' + T1[pr[1]] + ' → ' + s.ans[pr[1]] + ', so ' + t(mine) + ' matches ' + t(want) + '.', ['Use your matching from (a): replace each letter of ' + mine + ' by its partner.'], 'side from arcs');
  }

  /* ================= Q4 / Extra 4: k and a side table ================= */
  function kShared(r, o) {
    o = o || {};
    return find(function () {
      var a = r.int(3, 9), b = r.int(4, 11), c = r.int(5, 13), k = o.k ? r.pick(o.k) : r.pick([2.5, 1.5, 3, 2, 1.25, 0.5, 0.75, 1.75, 0.4]);
      var s = [a, b, c].sort(function (x, y) { return x - y; }); if (o.order) s = r.chance(0.5) ? [s[0], s[1], s[2]] : [s[1], s[0], s[2]];
      return { o: s, k: k, n: s.map(function (x) { return q(x * k); }) };
    }, function (v) { var s = v.o.slice().sort(function (x, y) { return x - y; }); return s[0] + s[1] > s[2] + 1 && s[0] !== s[1] && s[1] !== s[2] && v.n.every(function (x) { return decs(x) <= 2; }) && decs(v.n[0]) <= 1 && !(v.o[0] === 6 && same(v.n[0], 10)) && !(v.o[0] === 4 && v.k === 2.5 && v.o[1] === 7 && v.o[2] === 9 && o.notBook); }, { o: [4, 7, 9], k: 2.5, n: [10, 17.5, 22.5] });
  }
  function sideTable(T1, T2, o, n, show) {
    var th = function (s) { return '<td style="' + TD + ';font-weight:700">' + s + '</td>'; }, td = function (s) { return '<td style="' + TD + '">' + s + '</td>'; }, S = [[0, 1], [1, 2], [0, 2]];
    return '<div style="overflow-x:auto"><table style="border-collapse:collapse;margin:6px 0"><tr>' + th('△' + T1.join('')) + S.map(function (p, i) { return td(t(sd(T1, p) + '=' + N(o[i]) + '\\text{ cm}')); }).join('') + '</tr><tr>' + th('△' + T2.join('')) +
      S.map(function (p, i) { return td(t(sd(T2, p) + '=' + (show[i] ? N(n[i]) + '\\text{ cm}' : '\\color{#c93a33}{?}'))); }).join('') + '</tr></table></div>';
  }
  function sideBoxes(sh, T1, T2, prompt, withK) {
    var S = [[0, 1], [1, 2], [0, 2]], k = sh.k, fl = [];
    if (withK) fl.push({ f: { label: 'Scale factor k =', name: 'k' }, chk: G.kChk(k, { from: { new: sh.n[0], orig: sh.o[0] } }), key: nS(k), show: t(N(k)) });
    [1, 2].forEach(function (i) {
      var other = 3 - i, alts = otherBox(sh.n[i], [[sh.n[other], sd(T2, S[other])]]);
      fl.push(lenF(t(sd(T2, S[i])) + ' =', sh.n[i], { dp: Math.max(1, decs(sh.n[i])), unit: 'cm', name: sd(T2, S[i]), scale: { len: sh.o[i], k: k, op: 'mul' }, alts: alts.concat([{ v: sh.o[i] + (sh.n[0] - sh.o[0]), code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by k; they don’t add the same amount to every side.' }]) }));
    });
    return fieldsP(prompt, fl, br([withK ? 'k = ' + t(sd(T2, S[0]) + '\\div ' + sd(T1, S[0]) + '=' + N(sh.n[0]) + '\\div ' + N(sh.o[0]) + '=' + N(k)) : null, [1, 2].map(function (i) { return t(sd(T2, S[i]) + '=' + N(sh.o[i]) + '\\times ' + N(k) + '=' + N(sh.n[i])) + ' cm'; }).join(' &nbsp; ')]),
      ['Multiply each side of △' + T1.join('') + ' by k to get the matching side of △' + T2.join('') + '.'], 'side table');
  }
  function typeMC(r, k, T2) {
    return P.mc(r, 'Is △' + T2.join('') + ' an enlargement or a reduction of the first triangle?', [
      { html: '<b>An enlargement</b>: k is greater than 1, so △' + T2.join('') + ' is bigger.', right: k > 1, why: k > 1 ? null : 'k = ' + N(k) + ' is less than 1, so the new triangle is smaller.', code: 'enl' },
      { html: '<b>A reduction</b>: k is less than 1, so △' + T2.join('') + ' is smaller.', right: k < 1, why: k < 1 ? null : 'k = ' + N(k) + ' is greater than 1, so the new triangle is bigger.', code: 'red' },
      { html: '<b>Neither</b>: similar triangles are always the same size.', why: 'Similar means the same <b>shape</b>; the size can change. Compare k with 1.', code: 'same' }],
      'k = ' + N(k) + (k > 1 ? ' > 1, so it is an <b>enlargement</b>.' : ' < 1, so it is a <b>reduction</b>.'), ['k > 1: enlargement. k < 1: reduction.'], 'enlargement or reduction', true);
  }

  /* ================= Q5 / Extra 5: a missing side of similar triangles (pictures) ================= */
  /* sides of the first triangle [base, right, left] (side 0 = L–R, 1 = R–T, 2 = T–L) and k */
  function simShared(r, o) {
    return find(function () {
      var b = pickR(r, o.b[0], o.b[1], o.b[2] || 0.5), s1 = q(b * r.int(110, 165) / 100), s2 = q(b * r.int(80, 135) / 100);
      var k = o.red ? r.int(33, 70) / 100 : r.int(160, 290) / 100, nb = pickR(r, rd(b * k, 1) - 0.3, rd(b * k, 1) + 0.3, 0.1);
      return { o: [b, rd(s1, 1), rd(s2, 1)], nb: nb };
    }, function (v) {
      v.k = v.nb / v.o[0]; v.n = v.o.map(function (x) { return x * v.k; });
      var srt = v.o.slice().sort(function (a, b) { return a - b; });
      if (srt[0] + srt[1] <= srt[2] * 1.15) return false;
      if ([v.o[0], v.nb].some(function (x) { return [6, 7.2, 9.5, 10, 11, 4.8].indexOf(x) >= 0; })) return false;
      return o.need.every(function (i) { return !same(rd(v.n[i], 1), v.n[i]) && !same(rd(v.n[i], 2), v.n[i]); }) && decs(v.nb) <= 1;
    }, { o: [3.5, 5.5, 4.4], nb: 8.6, k: 8.6 / 3.5, n: [8.6, 5.5 * 8.6 / 3.5, 4.4 * 8.6 / 3.5] });
  }
  function simFig(sh, labO, labN, o) {
    var P0 = triSSS(sh.o[0], sh.o[2], sh.o[1]), arcs = [1, 2, 0];
    return trisSVG([{ pts: P0, size: 120, sides: labO, arcs: arcs }, { pts: P0, size: 120 * Math.max(0.7, Math.min(1.45, sh.k)), sides: labN, arcs: arcs, rot: o.rot || 0, flip: !!o.flip }], { gap: 50, aria: 'two similar triangles' });
  }

  /* ================= nested triangles ================= */
  function nestShared(r, o) {
    o = o || {};
    return find(function () {
      var AD = o.AD ? pickR(r, o.AD[0], o.AD[1], o.AD[2] || 1) : r.int(3, 9), DB = o.DB ? pickR(r, o.DB[0], o.DB[1], o.DB[2] || 1) : r.int(2, 7), DE = o.DE ? pickR(r, o.DE[0], o.DE[1], o.DE[2] || 0.5) : pickR(r, 3, 12, 0.5), AE = pickR(r, Math.max(2, AD - 2), AD + 3, 0.5);
      return { AD: AD, DB: DB, DE: DE, AE: AE };
    }, function (v) {
      v.AB = q(v.AD + v.DB); v.k = v.AB / v.AD; v.BC = q(v.DE * v.k); v.AC = q(v.AE * v.k); v.EC = q(v.AC - v.AE);
      if (v.AD === 5 && v.DB === 3) return false;
      if (v.AD === v.DB || v.AE === v.AD || v.DE === v.AD) return false;
      return (o.test ? o.test(v) : true);
    }, null);
  }
  function nestNames(r) { return r.pick([['A', 'B', 'C', 'D', 'E'], ['P', 'Q', 'R', 'S', 'T'], ['J', 'K', 'L', 'M', 'N'], ['F', 'G', 'H', 'D', 'E']]); }
  function nestMC(r, n) {
    var tri = function (a) { return '△' + a.map(function (i) { return n[i]; }).join(''); }, ang = function (a) { return t('\\angle ' + a.map(function (i) { return n[i]; }).join('')); };
    return P.mc(r, 'Why is ' + tri([0, 3, 4]) + ' ∼ ' + tri([0, 1, 2]) + '?', [
      { html: 'They share ' + t('\\angle ' + n[0]) + ', and ' + ang([0, 3, 4]) + ' = ' + ang([0, 1, 2]) + ' (corresponding angles, because ' + t(n[3] + n[4]) + ' ∥ ' + t(n[1] + n[2]) + '). Two pairs of equal angles: AA.', right: true },
      { html: 'They share ' + t('\\angle ' + n[0]) + ' and the side ' + t(n[0] + n[3]) + '.', why: 'A shared side doesn’t make triangles similar. You need two pairs of <b>equal angles</b>: the shared angle and the corresponding angles from the parallel lines.', code: 'side' },
      { html: 'Every side of ' + tri([0, 3, 4]) + ' is shorter than the matching side of ' + tri([0, 1, 2]) + '.', why: 'Being smaller isn’t enough: a smaller triangle can have a different shape. Look for two pairs of equal angles.', code: 'smaller' },
      { html: ang([0, 3, 4]) + ' = ' + ang([0, 1, 2]) + ' because they are vertically opposite angles.', why: 'Vertically opposite angles are made by two lines that <b>cross</b>. These are <b>corresponding</b> angles (the parallel lines ' + t(n[3] + n[4]) + ' and ' + t(n[1] + n[2]) + ' cut by ' + t(n[0] + n[1]) + ').', code: 'vert' }],
      'Both triangles have ' + t('\\angle ' + n[0]) + '. ' + t(n[3] + n[4]) + ' ∥ ' + t(n[1] + n[2]) + ' with ' + t(n[0] + n[1]) + ' as the transversal, so ' + ang([0, 3, 4]) + ' = ' + ang([0, 1, 2]) + ' (corresponding angles). Two pairs of equal angles, so they are similar (AA).',
      ['Look for two pairs of equal angles. One is shared; the parallel lines give the other.'], 'why nested similar');
  }
  /* BC from AD, DB, DE */
  function nestBC(n, s, u, extra) {
    var piece = s.DE * s.DB / s.AD;
    return lenP((extra || '') + 'Find ' + t(n[1] + n[2]) + '.', s.BC, { unit: u, dp: Math.max(1, decs(s.BC)), prop: { given: s.DE, num: s.AB, den: s.AD }, kEarly: { len: s.DE, num: s.AB, den: s.AD },
      alts: [{ v: piece, code: 'u6l5-piece', hint: 'The big triangle’s side is the <b>whole</b> side: ' + t(n[0] + n[1] + '=' + N(s.AD) + '+' + N(s.DB) + '=' + N(s.AB)) + ', not just the piece ' + t(n[3] + n[1]) + '.' }, { v: s.DE + s.DB, code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by k = ' + t(n[0] + n[1] + '\\div ' + n[0] + n[3]) + '; don’t add.' }],
      sol: br([t(n[0] + n[1] + '=' + N(s.AD) + '+' + N(s.DB) + '=' + N(s.AB)) + ' ' + u + ', which matches ' + t(n[0] + n[3] + '=' + N(s.AD)) + ' ' + u + '.', t('\\dfrac{' + n[1] + n[2] + '}{' + N(s.DE) + '}=\\dfrac{' + N(s.AB) + '}{' + N(s.AD) + '}'), t(n[1] + n[2] + '=' + N(s.DE) + '\\times ' + N(s.AB) + '\\div ' + N(s.AD) + eqR(s.BC, Math.max(1, decs(s.BC)))) + ' ' + u]),
      hints: ['Draw the two triangles apart. The big one has the <b>whole</b> side ' + n[0] + n[1] + ' = ' + n[0] + n[3] + ' + ' + n[3] + n[1] + '.', t(n[1] + n[2]) + ' matches ' + t(n[3] + n[4]) + ', and ' + t(n[0] + n[1]) + ' matches ' + t(n[0] + n[3]) + '.'], text: 'nested BC' });
  }
  function nestEC(n, s, u) {
    return lenP('Find ' + t(n[4] + n[2]) + '.', s.EC, { unit: u, dp: Math.max(1, decs(s.EC)), prop: { given: s.AE, num: s.AB, den: s.AD },
      alts: [{ v: s.AC, code: 'u6l5-whole', hint: 'That is the whole side ' + t(n[0] + n[2]) + '. ' + t(n[4] + n[2]) + ' is only the bottom piece: subtract ' + t(n[0] + n[4]) + '.' }, { v: s.AE * s.AD / s.AB, code: 'prop-flip', hint: 'Big over small on both sides: ' + t('\\dfrac{' + n[0] + n[2] + '}{' + n[0] + n[4] + '}=\\dfrac{' + n[0] + n[1] + '}{' + n[0] + n[3] + '}') + '.' }],
      sol: br(['First the whole side: ' + t(n[0] + n[2] + '=' + N(s.AE) + '\\times ' + N(s.AB) + '\\div ' + N(s.AD) + '=' + N(s.AC)) + ' ' + u, 'Then ' + t(n[4] + n[2] + '=' + n[0] + n[2] + '-' + n[0] + n[4] + '=' + N(s.AC) + '-' + N(s.AE) + '=' + N(s.EC)) + ' ' + u]),
      hints: ['Find the whole side ' + n[0] + n[2] + ' first (it matches ' + n[0] + n[4] + ').', 'Then subtract ' + n[0] + n[4] + '.'], text: 'nested EC' });
  }

  /* ================= crossing triangles ================= */
  function crossMC(r, what, o) {
    o = o || {};
    return P.mc(r, what, [
      { html: 'The angles at ' + o.X + ' are vertically opposite, so they are equal. ' + o.par + ' are parallel, so ' + o.alt + ' are equal alternate interior angles. Two pairs: AA.', right: true },
      { html: 'They share the angle at ' + o.X + ', and the parallel lines make equal corresponding angles.', why: 'The triangles don’t <b>share</b> an angle: they meet point to point. The angles at ' + o.X + ' are vertically opposite, and the parallel lines make <b>alternate interior</b> angles.', code: 'nested' },
      { html: o.legs || 'The two lines through ' + o.X + ' are the same length.', why: 'Equal lengths don’t prove similarity. Look for two pairs of equal angles.', code: 'legs' },
      { html: 'Both triangles have a right angle at ' + o.X + '.', why: 'The lines don’t cross at a right angle. Use the vertically opposite angles at ' + o.X + ' and the alternate interior angles.', code: 'right' }],
      'The angles at ' + o.X + ' are vertically opposite (equal). ' + o.par + ' are parallel, so ' + o.alt + ' are equal (alternate interior angles). Two pairs of equal angles, so the triangles are similar (AA).', ['Where the two lines cross, which angles are equal? What do parallel lines give?'], 'why crossing similar');
  }

  /* ================= slopes with posts (conveyor, roof, auger) ================= */
  function slopeMC(r, who) {
    return P.mc(r, 'Why are the small and the large right triangles similar?', [
      { html: 'Both have a right angle, and they share the angle at ' + who + ' (AA).', right: true },
      { html: 'All right triangles are similar.', why: 'Not all right triangles are similar: their acute angles must match too. Here both have a right angle <b>and</b> they share the angle at ' + who + '.', code: 'all-right' },
      { html: 'The post is the same height as the tall side.', why: 'The post is shorter. Similar triangles have equal <b>angles</b>, not equal sides.', code: 'height' },
      { html: 'They share the slope, so all their sides are equal.', why: 'Similar triangles have equal angles and sides in the same <b>ratio</b>, not equal sides.', code: 'equal' }],
      'Each triangle has a right angle (the post and the tall side are vertical), and they share the angle at ' + who + '. Two pairs of equal angles, so they are similar (AA).', ['Count the pairs of equal angles: one from the vertical posts, one shared.'], 'why slope similar');
  }
  /* the tall height h2 = h1 × d2 ÷ d1 */
  function slopeH(prompt, s, u, o) {
    o = o || {};
    var ans = s.h1 * s.d2 / s.d1;
    return lenP(prompt, ans, { unit: u, prop: { given: s.h1, num: s.d2, den: s.d1 }, kEarly: { len: s.h1, num: s.d2, den: s.d1 },
      alts: [{ v: s.h1 * (s.d2 - s.d1) / s.d1, code: 'u6l5-piece', hint: 'Use the whole distance from ' + (o.A || 'the start') + ' (' + N(s.d2) + ' ' + u + '), not just the part past the post.' }, { v: s.h1 + (s.d2 - s.d1), code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by the same factor; don’t add the difference.' }],
      sol: br([t('\\dfrac{h}{' + N(s.h1) + '}=\\dfrac{' + N(s.d2) + '}{' + N(s.d1) + '}'), t('h=' + N(s.h1) + '\\times ' + N(s.d2) + '\\div ' + N(s.d1) + eqR(ans)) + ' ' + u, o.end || '']),
      hints: ['The tall side matches the post, and ' + N(s.d2) + ' ' + u + ' matches ' + N(s.d1) + ' ' + u + '.', 'Put the unknown on top: h ÷ ' + N(s.h1) + ' = ' + N(s.d2) + ' ÷ ' + N(s.d1) + '.'], text: o.text || 'slope height' });
  }

  /* ================= MC builders for Q15, Q16, Extra 11 ================= */
  function ratioMC(r, T1, T2) {
    var S = r.shuffle([[0, 1], [1, 2], [0, 2]]), a = S[0], b = S[1], c = S[2], f = function (x, y) { return t('\\dfrac{' + x + '}{' + y + '}'); };
    var opts = [{ html: f(sd(T1, b), sd(T2, b)), right: true },
      { html: f(sd(T1, b), sd(T2, c)), why: t(sd(T1, b)) + ' doesn’t match ' + t(sd(T2, c)) + ': matching sides use the same letter positions.', code: 'pair' },
      { html: f(sd(T1, c), sd(T2, b)), why: t(sd(T1, c)) + ' doesn’t match ' + t(sd(T2, b)) + ': matching sides use the same letter positions.', code: 'pair2' },
      { html: f(sd(T2, a), sd(T1, a)), why: 'That ratio is flipped over: ' + t(sd(T1, a)) + ' was on top, now it is on the bottom.', code: 'flip' }];
    return P.mc(r, '△' + T1.join('') + ' ∼ △' + T2.join('') + '. Which ratio is equal to ' + f(sd(T1, a), sd(T2, a)) + '?', opts,
      t(sd(T1, b)) + ' matches ' + t(sd(T2, b)) + ' (letters ' + (b[0] + 1) + ' and ' + (b[1] + 1) + ' of each name), and the first triangle is on top in both, so ' + f(sd(T1, b), sd(T2, b)) + ' is the same ratio.', ['Same letter positions, and the same triangle on top.'], 'equal ratio MC');
  }
  function angleMC(r) {
    var s = find(function () { var a = r.int(30, 55), b = r.int(60, 85); return { a: a, b: b, c: 180 - a - b, w: a + r.pick([-15, -10, 15, 20, 25]) }; },
      function (v) { var c = v.c; return c > 25 && [v.a, v.b].indexOf(c) < 0 && [v.a, v.b, c].indexOf(v.w) < 0 && v.w > 10 && v.a + v.w < 170 && 2 * v.a + v.b < 175 && [v.a, v.b, c].indexOf(180 - v.b) < 0 && !(v.a === 40 && v.b === 75) && Math.abs(v.b - c) > 3; }, { a: 40, b: 75, c: 65, w: 60 });
    var two = function (x, y) { return dg(x) + ' and ' + dg(y); };
    return P.mc(r, 'Two angles of a triangle are ' + two(s.a, s.b) + '. A second triangle <b>must</b> be similar to it if two of its angles are', [
      { html: two(s.b, s.c), right: true },
      { html: two(s.a, s.w), why: 'Only ' + dg(s.a) + ' matches. The third angle of the first triangle is ' + t('180^\\circ-' + s.a + '^\\circ-' + s.b + '^\\circ=' + s.c + '^\\circ') + '.', code: 'one' },
      { html: two(s.a, 180 - s.b), why: dg(180 - s.b) + ' is ' + t('180^\\circ-' + s.b + '^\\circ') + ', not an angle of the triangle. Find the third angle: ' + t(s.c + '^\\circ') + '.', code: 'supp' },
      { html: two(s.a + s.b, s.a), why: dg(s.a + s.b) + ' is ' + t(s.a + '^\\circ+' + s.b + '^\\circ') + ', not an angle of the triangle.', code: 'sum' }],
      'The third angle is ' + t('180^\\circ-' + s.a + '^\\circ-' + s.b + '^\\circ=' + s.c + '^\\circ') + '. So ' + two(s.b, s.c) + ' are two of its angles: AA.', ['Find the third angle of the first triangle first.'], 'AA MC');
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u6l5', unit: 6, num: '5', title: 'Similar Triangles', outcome: 'G3',
    blurb: 'The AA test, naming similar triangles in order, finding a missing side, right triangles that share an angle, and nested and crossing triangles.',
    questions: [
      { num: '1', stem: function (sh) { return 'Find the missing angle in each triangle. Then decide: are the two triangles similar?' + aaTable(sh, ['(a)', '(b)', '(c)', '(d)']); },
        shared: function (r) { return [aaRow(r, 'yes'), aaRow(r, 'right'), aaRow(r, 'no'), aaRow(r, 'obtuse')]; },
        parts: [
          { id: '1a', level: 'BEG', make: function (r, sh) { return aaPart(sh[0], '(a)'); } },
          { id: '1b', level: 'BEG', make: function (r, sh) { return aaPart(sh[1], '(b)'); } },
          { id: '1c', level: 'EMG', make: function (r, sh) { return aaPart(sh[2], '(c)'); } },
          { id: '1d', level: 'EMG', make: function (r, sh) { return aaPart(sh[3], '(d)'); } }] },
      { num: '2', stem: function (sh) { return t('\\triangle ' + sh.T1.join('') + '\\sim\\triangle ' + sh.T2.join('')) + '. Fill in the blanks.'; },
        shared: function (r) { return nameShared(r); },
        parts: [
          { id: '2abc', sub: 'a–c', level: 'BEG', make: function (r, sh) { return namePartABC(sh); } },
          { id: '2d', sub: 'd', level: 'EMG', make: function (r, sh) { return namePartD(sh); } },
          { id: '2e', sub: 'e', level: 'BEG', make: function (r, sh) { return namePartE({ T1: sh.T1, T2: sh.T2, side: sh.side, across: false }); } }] },
      { num: '3', stem: function (sh) { return 'The two triangles are similar. Matching angles have the same number of arcs.' + arcsSVG(sh); },
        shared: function (r) { return arcsShared(r); },
        parts: [
          { id: '3a', level: 'EMG', make: function (r, sh) { return arcsName(sh); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { return arcsSide(sh, [0, 1]); } },
          { id: '3c', level: 'BEG', make: function (r, sh) { return arcsSide(sh, [1, 2]); } }] },
      { num: '4', stem: function (sh) { return t('\\triangle ABC\\sim\\triangle DEF') + '. Matching sides are in the same column.' + sideTable(['A', 'B', 'C'], ['D', 'E', 'F'], sh.o, sh.n, [true, false, false]); },
        shared: function (r) { return kShared(r, { k: [2.5, 1.5, 3, 2, 1.25, 1.75, 0.5, 0.75, 0.4] }); },
        parts: [
          { id: '4ai', sub: 'a i', level: 'BEG', make: function (r, sh) { var g = 1; while (!same(sh.k * g, Math.round(sh.k * g)) && g < 100) g++; return GP.k('Find the scale factor ' + t('k') + ' from ' + t('\\triangle ABC') + ' to ' + t('\\triangle DEF') + '.', g > 1 && g < 100 ? [Math.round(sh.k * g), g] : sh.k, { from: { new: sh.n[0], orig: sh.o[0] }, sol: t('k=\\dfrac{DE}{AB}=\\dfrac{' + N(sh.n[0]) + '}{' + N(sh.o[0]) + '}=' + N(sh.k)), hints: ['k = new side ÷ matching original side: DE ÷ AB.'], text: 'k from table' }); } },
          { id: '4aii', sub: 'a ii', level: 'BEG', make: function (r, sh) { return typeMC(r, sh.k, ['D', 'E', 'F']); } },
          { id: '4b', sub: 'b', level: 'EMG', make: function (r, sh) { return sideBoxes(sh, ['A', 'B', 'C'], ['D', 'E', 'F'], 'Find ' + t('EF') + ' and ' + t('DF') + '.', false); } }] },
      { num: '5', stem: 'Each pair of triangles is similar. Find ' + t('x') + ' to the nearest tenth.',
        parts: [
          { id: '5a', level: 'EMG', make: function (r) {
            var s = simShared(r, { b: [2.5, 6, 0.5], need: [1] }), x = s.n[1];
            return lenP('(a)' + simFig(s, [N(s.o[0]) + ' in', N(s.o[1]) + ' in', ''], [N(s.nb) + ' in', 'x', ''], { flip: true }) + 'Find ' + t('x') + '.', x, { unit: 'in', prop: { given: s.o[1], num: s.nb, den: s.o[0] }, kEarly: { len: s.o[1], num: s.nb, den: s.o[0] }, alts: [{ v: s.o[1] + s.nb - s.o[0], code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by k; they don’t add the same amount.' }],
              sol: br([N(s.nb) + ' in matches ' + N(s.o[0]) + ' in; ' + t('x') + ' matches ' + N(s.o[1]) + ' in.', t('\\dfrac{x}{' + N(s.o[1]) + '}=\\dfrac{' + N(s.nb) + '}{' + N(s.o[0]) + '}'), t('x=' + N(s.o[1]) + '\\times ' + N(s.nb) + '\\div ' + N(s.o[0]) + eqR(x)) + ' in']),
              hints: ['The arcs show which angles match. The side between the one-arc and two-arc angles is the base in both.', 'Put x on top: x ÷ ' + N(s.o[1]) + ' = ' + N(s.nb) + ' ÷ ' + N(s.o[0]) + '.'], text: 'find x (in)' });
          } },
          { id: '5b', level: 'PRG', make: function (r) {
            var s = simShared(r, { b: [11, 16, 1], red: true, need: [2] }), x = s.n[2];
            return lenP('(b)' + simFig(s, [N(s.o[0]) + ' ft', '', N(s.o[2]) + ' ft'], [N(s.nb) + ' ft', '', 'x'], { rot: 180 }) + 'Find ' + t('x') + '.', x, { unit: 'ft', prop: { given: s.o[2], num: s.nb, den: s.o[0] }, kEarly: { len: s.o[2], num: s.nb, den: s.o[0] }, alts: [{ v: s.o[2] - (s.o[0] - s.nb), code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by k; they don’t subtract the same amount.' }],
              sol: br([N(s.nb) + ' ft matches ' + N(s.o[0]) + ' ft; ' + t('x') + ' matches ' + N(s.o[2]) + ' ft.', t('\\dfrac{x}{' + N(s.o[2]) + '}=\\dfrac{' + N(s.nb) + '}{' + N(s.o[0]) + '}'), t('x=' + N(s.o[2]) + '\\times ' + N(s.nb) + '\\div ' + N(s.o[0]) + eqR(x)) + ' ft', 'Check: the turned triangle is smaller, and ' + N(rd(x)) + ' < ' + N(s.o[2]) + ' ✓']),
              hints: ['The second triangle is turned upside down. Match the angles by their arcs.', 'The second triangle is smaller, so x must be less than ' + N(s.o[2]) + ' ft.'], text: 'find x (ft)' });
          } }] },
      { num: '6', stem: function (sh) { var T1 = sh.T1, T2 = sh.T2; return t('\\triangle ' + T1.join('') + '\\sim\\triangle ' + T2.join('')) + '. ' + sh.who + ' knows that ' + sh.known.map(function (k) { return t(k[0] + '=' + k[1] + '\\text{ cm}'); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; },
        shared: function (r) {
          var nm = twoTris(r), T1 = nm[0], T2 = nm[1], S = [[0, 1], [1, 2], [0, 2]], m = r.int(0, 2), other = S.filter(function (x, i) { return i !== m; });
          var vals = r.sample([6, 7, 8, 9, 10, 12, 14, 15], 3);
          return { T1: T1, T2: T2, who: r.pick(['Mia', 'Kai', 'Priya', 'Omar']), m: m, known: [[sd(T1, other[0]), vals[0]], [sd(T1, other[1]), vals[1]], [sd(T2, S[m]), vals[2]]], missing: [sd(T2, other[0]), sd(T2, other[1]), sd(T1, S[m])] };
        },
        parts: [
          { id: '6a', level: 'PRG', make: function (r, sh) {
            var T1 = sh.T1, T2 = sh.T2, kn = sh.known, w = sh.who;
            return P.mc(r, w + ' says nobody can find any of the missing sides from these three lengths. Is ' + w + ' right?', [
              { html: '<b>Yes.</b> ' + t(kn[0][0]) + ', ' + t(kn[1][0]) + ' and ' + t(sh.missing[2]) + ' match ' + t(sh.missing[0]) + ', ' + t(sh.missing[1]) + ' and ' + t(kn[2][0]) + '. No matching pair has both lengths known, so k can’t be found.', right: true },
              { html: '<b>No.</b> ' + t('k=' + kn[2][0] + '\\div ' + kn[1][0]) + ', and then every side can be found.', why: t(kn[2][0]) + ' doesn’t match ' + t(kn[1][0]) + '. A scale factor needs a <b>matching</b> pair (same letter positions).', code: 'u6l5-wrong-pair' },
              { html: '<b>No.</b> Three sides are known, and three sides are always enough.', why: 'The three lengths must include a matching pair. Check: which side does ' + t(kn[2][0]) + ' match?', code: 'three' },
              { html: '<b>Yes.</b> You need all three sides of both triangles before you can use similar triangles.', why: 'One matching pair is enough to find k. The trouble here is that there is <b>no</b> matching pair.', code: 'all' }],
              'Matching sides: ' + [0, 1].map(function (i) { return t(kn[i][0]) + ' ↔ ' + t(sh.missing[i]); }).join(', ') + ', ' + t(sh.missing[2]) + ' ↔ ' + t(kn[2][0]) + '.<br>' + w + ' doesn’t know both sides of any matching pair, so the scale factor can’t be found. ' + w + ' is right.', ['For each known side, find the side it matches. Is the partner known too?'], 'cannot find k');
          } },
          { id: '6b', level: 'EMG', make: function (r, sh) {
            var T1 = sh.T1, T2 = sh.T2, kn = sh.known.map(function (k) { return k[0]; });
            var chk = function (resp) {
              var s = letters(resp).toUpperCase(), sl = slipL(s, 2); if (sl) return sl;
              var S = s.split('').sort().join(''), is = function (a) { return a.split('').sort().join('') === S; };
              if (sh.missing.some(is)) return ok();
              if (kn.some(is)) return wrong('u6l5-known', 'That length is already known. Choose a side that would complete a <b>matching pair</b>.');
              var all = T1.concat(T2); if (!s.split('').every(function (c) { return all.indexOf(c) >= 0; })) return wrong('u6l5-letter-none', 'Use the letters of the two triangles.');
              return form('u6l5-letters', 'Both letters must be from the same triangle (a side joins two vertices of one triangle).');
            };
            var p = fieldsP('Name <b>one</b> more length that would let ' + sh.who + ' find all the missing sides.', [wordF('Side', chk, sh.missing[0], '', 'Side')],
              'Any one of ' + sh.missing.map(function (x) { return t(x); }).join(', ') + '. Each one completes a matching pair. For example, with ' + t(sh.missing[2]) + ' known: ' + t('k=' + sh.known[2][0] + '\\div ' + sh.missing[2]) + ', then multiply to get the others.', ['Pick a side whose partner is already known.'], 'one more length');
            p.answer = 'Any one of ' + sh.missing.map(function (x) { return t(x); }).join(', '); return p;
          } }] },
      { num: '7', stem: 'Choose <b>always</b>, <b>sometimes</b> or <b>never</b>, with the reason.',
        parts: [
          { id: '7a', level: 'EMG', make: function (r) {
            var v = r.pick([['Two equilateral triangles (all sides equal, all angles 60°) are similar.', 'All the angles are 60° in both, so the angles match (AA).'], ['Two right triangles that each have a 45° angle are similar.', 'Both have angles 90°, 45° and 45°, so the angles match (AA).']]);
            return P.mc(r, '(a) ' + v[0], [{ html: '<b>Always</b>. ' + v[1], right: true }, { html: '<b>Sometimes</b>. Only if their sides are the same length.', why: 'Equal sides would make them the same size. Similar only needs equal <b>angles</b> — and these always have equal angles.', code: 'some' },
              { html: '<b>Never</b>. They can be different sizes.', why: 'Similar figures <b>can</b> be different sizes. Check the angles.', code: 'never' }, { html: '<b>Sometimes</b>. Only if they are turned the same way.', why: 'Turning a triangle doesn’t change its angles.', code: 'turn' }],
              '<b>Always</b>. ' + v[1], ['Do the angles have to be the same in every pair?'], 'always (a)');
          } },
          { id: '7b', level: 'PRG', make: function (r) {
            var v = r.pick([['Two right triangles are similar.', 'Only if an acute angle matches too. Angles 90°, 45°, 45° and 90°, 30°, 60° are not similar.'], ['Two isosceles triangles are similar.', 'Only if the angles match. Angles 40°, 70°, 70° and 100°, 40°, 40° are not similar, but two 40°, 70°, 70° triangles are.'], ['Two triangles that each have a ' + r.pick([40, 50, 70, 80]) + '° angle are similar.', 'One equal angle is not enough: AA needs <b>two</b>. They are similar only if a second angle matches.']]);
            return P.mc(r, '(b) ' + v[0], [{ html: '<b>Sometimes</b>. ' + v[1], right: true }, { html: '<b>Always</b>. They have an angle in common, so they are the same shape.', why: 'One matching angle is not enough. AA needs <b>two</b> pairs of equal angles. Find an example that isn’t similar.', code: 'always' },
              { html: '<b>Never</b>. Two different triangles can’t be similar.', why: 'Some pairs are similar (an enlargement of a triangle, for example). So it is not "never".', code: 'never' }, { html: '<b>Always</b>. Every triangle’s angles add to 180°.', why: 'All triangles add to 180°, but that doesn’t make every pair similar.', code: '180' }],
              '<b>Sometimes</b>. ' + v[1], ['Can you find one pair that is similar and one pair that isn’t?'], 'sometimes (b)');
          } },
          { id: '7c', level: 'PRG', make: function (r) {
            if (r.chance(0.65)) {
              var x = r.pick([30, 40, 44, 50, 56, 60, 64, 70, 80, 84, 90, 100]), b = (180 - x) / 2;
              return P.mc(r, '(c) Two isosceles triangles with a ' + x + '° angle at the top (between the equal sides) are similar.', [{ html: '<b>Always</b>. Each base angle is ' + t('(180^\\circ-' + x + '^\\circ)\\div 2=' + nS(b) + '^\\circ') + ', so both have ' + x + '°, ' + nS(b) + '° and ' + nS(b) + '°.', right: true },
                { html: '<b>Sometimes</b>. The equal sides could be different lengths.', why: 'Different lengths only change the size. Work out the base angles: they are the same in both.', code: 'some' },
                { html: '<b>Sometimes</b>. The base angles could be different.', why: 'The base angles are equal and add to ' + t('180^\\circ-' + x + '^\\circ') + ', so each is ' + nS(b) + '° in both triangles.', code: 'base', },
                { html: '<b>Never</b>. Isosceles triangles are never similar.', why: 'Two isosceles triangles with the same top angle have the same base angles too.', code: 'never' }],
                '<b>Always</b>. The base angles are equal: ' + t('(180^\\circ-' + x + '^\\circ)\\div 2=' + nS(b) + '^\\circ') + '. Both triangles have ' + x + '°, ' + nS(b) + '°, ' + nS(b) + '°, so they are similar (AA).', ['Work out the two base angles. They are equal.'], 'always (c)');
            }
            return P.mc(r, '(c) A right triangle and a triangle with an obtuse angle (more than 90°) are similar.', [{ html: '<b>Never</b>. Similar triangles have the same angles, but a triangle can’t have both a 90° angle and an obtuse angle (they would add to more than 180°).', right: true },
              { html: '<b>Sometimes</b>. If their other angles match.', why: 'The right triangle would need an obtuse angle too, and 90° + more than 90° is more than 180°.', code: 'some' },
              { html: '<b>Always</b>. Both are triangles.', why: 'Being triangles is not enough. Their angles would have to match.', code: 'always' },
              { html: '<b>Sometimes</b>. If one is an enlargement of the other.', why: 'An enlargement keeps every angle, so a right triangle’s enlargement is still a right triangle, never obtuse.', code: 'enl' }],
              '<b>Never</b>. The angles would have to match, but no triangle has a right angle and an obtuse angle (that is already more than 180°).', ['Could one triangle have a 90° angle and an obtuse angle?'], 'never (c)');
          } }] },
      { num: '8', stem: function (sh) { return 'A conveyor belt rises steadily from point ' + t('P') + ' on the floor. A vertical support post is ' + U(sh.d1, 'm') + ' from ' + t('P') + ' along the floor, and it is ' + U(sh.h1, 'm') + ' tall. The top end of the belt is ' + U(sh.d2, 'm') + ' from ' + t('P') + ' along the floor.' + slopeSVG({ d1: sh.d1, h1: sh.h1, d2: sh.d2, h2: sh.h1 * sh.d2 / sh.d1, dashed: true, lab: { A: 'P', d1: N(sh.d1) + ' m', d2: N(sh.d2) + ' m', h1: N(sh.h1) + ' m', h2: '?' } }); },
        shared: function (r) { return find(function () { var d1 = pickR(r, 2.4, 4.2, 0.1), h1 = pickR(r, 0.8, 1.8, 0.1), d2 = pickR(r, 6.0, 9.5, 0.5); return { d1: d1, h1: h1, d2: d2 }; }, function (s) { return s.d2 / s.d1 > 1.8 && s.d2 / s.d1 < 3.4 && s.h1 * s.d2 / s.d1 < 6 && !(s.d1 === 2.16); }, { d1: 3.2, h1: 1.4, d2: 8 }); },
        parts: [
          { id: '8a', level: 'EMG', make: function (r) { return slopeMC(r, t('P')); } },
          { id: '8b', level: 'EMG', make: function (r, sh) { return slopeH('How high above the floor is the top end of the belt? Round to the nearest tenth of a metre.', sh, 'm', { A: 'P', end: 'The top end is about ' + N(rd(sh.h1 * sh.d2 / sh.d1)) + ' m high.', text: 'conveyor height' }); } }] },
      { num: '9', stem: function (sh) { return 'Two ladders lean against a wall at the <b>same angle</b> with the level ground. Ladder 1 is ' + U(sh.L1, 'm') + ' long, and its foot is ' + U(sh.f1, 'm') + ' from the wall. Ladder 2 is ' + U(sh.L2, 'm') + ' long.' + laddersSVG({ L: [N(sh.L1) + ' m', N(sh.L2) + ' m'], f: [N(sh.f1) + ' m', '?'], k: sh.k, ang: Math.acos(sh.f1 / sh.L1) / RAD }); },
        shared: function (r) { return find(function () { var L1 = r.pick([3, 3.5, 4.5, 5, 2.5]), k = r.pick([1.2, 1.4, 1.5, 1.6, 1.8, 2]), f1 = r.pick([0.5, 0.6, 0.8, 1, 1.2, 1.4, 1.5]); return { L1: L1, k: k, L2: q(L1 * k), f1: f1 }; }, function (s) { s.f2 = q(s.f1 * s.k); s.h1 = rd(Math.sqrt(s.L1 * s.L1 - s.f1 * s.f1), 1); s.h2 = s.h1 * s.k; return decs(s.L2) <= 1 && decs(s.f2) <= 1 && s.f1 / s.L1 < 0.32 && !same(rd(s.h2, 1), s.h2); }, { L1: 4, k: 1.6, L2: 6.4, f1: 1, f2: 1.6, h1: 3.9, h2: 6.24 }); },
        parts: [
          { id: '9a', level: 'BEG', make: function (r) { return P.mc(r, 'Why are the two right triangles similar?', [{ html: 'Both have a right angle at the wall, and both make the same angle with the ground (AA).', right: true },
            { html: 'Both ladders are leaning on a wall.', why: 'That’s not a reason by itself. Name the two pairs of equal angles.', code: 'wall' }, { html: 'Ladder 2 is longer than ladder 1.', why: 'A longer ladder alone doesn’t make the triangles similar. Look at the angles.', code: 'longer' },
            { html: 'All right triangles are similar.', why: 'Not all right triangles are similar. These are, because the ground angles are equal too.', code: 'all' }], 'Both triangles have a right angle (wall and ground) and the same angle with the ground. Two pairs of equal angles: AA.', ['Which two pairs of angles are equal?'], 'why ladders similar'); } },
          { id: '9b', level: 'EMG', make: function (r, sh) { return lenP('How far from the wall is the foot of ladder 2?', sh.f2, { unit: 'm', dp: Math.max(1, decs(sh.f2)), scale: { len: sh.f1, k: sh.k, op: 'mul' }, prop: { given: sh.f1, num: sh.L2, den: sh.L1 }, alts: [{ v: sh.f1 + sh.L2 - sh.L1, code: 'prop-add', hint: 'Multiply by k = ' + t(N(sh.L2) + '\\div ' + N(sh.L1)) + '; don’t add the difference.' }],
            sol: br(['The ladders match each other, and the ground distances match each other.', t('k=' + N(sh.L2) + '\\div ' + N(sh.L1) + '=' + N(sh.k)), 'foot distance ' + t('=' + N(sh.f1) + '\\times ' + N(sh.k) + '=' + N(sh.f2)) + ' m from the wall']), hints: ['k = ladder 2 ÷ ladder 1.', 'Multiply the foot distance of ladder 1 by k.'], text: 'ladder foot' }); } },
          { id: '9c', level: 'EMG', make: function (r, sh) { return lenP('Ladder 1 reaches ' + U(sh.h1, 'm') + ' up the wall. About how high does ladder 2 reach? Round to the nearest tenth of a metre.', sh.h2, { unit: 'm', scale: { len: sh.h1, k: sh.k, op: 'mul' }, prop: { given: sh.h1, num: sh.L2, den: sh.L1 }, alts: [{ v: sh.h1 + sh.L2 - sh.L1, code: 'prop-add', hint: 'Multiply by k; don’t add the difference.' }],
            sol: 'height ' + t('=' + N(sh.h1) + '\\times ' + N(sh.k) + eqR(sh.h2)) + ' m', hints: ['Use the same k as in (b).'], text: 'ladder height' }); } }] },
      { num: '10', stem: function (sh) { var n = sh.n, s = sh.s; return 'In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(n[3] + n[4] + '\\parallel ' + n[1] + n[2]) + '. ' + t(n[0] + n[3] + '=' + N(s.AD)) + ' cm, ' + t(n[3] + n[1] + '=' + N(s.DB)) + ' cm, ' + t(n[3] + n[4] + '=' + N(s.DE)) + ' cm and ' + t(n[0] + n[4] + '=' + N(s.AE)) + ' cm.' + nestedSVG(n, s.AD / s.AB, { AD: N(s.AD) + ' cm', DB: N(s.DB) + ' cm', AE: N(s.AE) + ' cm', DE: N(s.DE) + ' cm' }); },
        shared: function (r) { return { n: nestNames(r), s: nestShared(r, { AD: [4, 9], DB: [2, 6], DE: [6, 12, 0.5], test: function (v) { return decs(v.BC) <= 1 && decs(v.EC) <= 1 && decs(v.AC) <= 1 && !(v.AD === 6 && v.DB === 4 && v.DE === 9); } }) || { AD: 6, DB: 4, DE: 9, AE: 7.5, AB: 10, BC: 15, AC: 12.5, EC: 5, k: 10 / 6 } }; },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { return nestMC(r, sh.n); } },
          { id: '10b', level: 'PRG', make: function (r, sh) { return nestBC(sh.n, sh.s, 'cm'); } },
          { id: '10c', level: 'PRG', make: function (r, sh) { return nestEC(sh.n, sh.s, 'cm'); } }] },
      { num: '11', stem: '', parts: [
        { id: '11', level: 'ADV', make: function (r) {
          var s = find(function () { return { L: r.pick([80, 85, 90, 95, 100, 110, 120]), c: r.pick([25, 30, 35, 40, 45]), w: r.int(18, 34) }; }, function (v) { v.d = v.w * v.L / v.c; return !same(rd(v.d, 1), v.d) && v.c / v.L < 0.5; }, { L: 90, c: 35, w: 24, d: 24 * 90 / 35 });
          return lenP('A sandwich-board sign is shaped like the letter A. The two legs are each ' + s.L + ' cm long, from the hinge at the top to the floor. A chain joins the legs ' + s.c + ' cm down from the hinge, and it is pulled tight, parallel to the floor. The chain is ' + s.w + ' cm long.' + aFrameSVG(s.c / s.L, { leg: s.L + ' cm', down: s.c + ' cm', chain: s.w + ' cm', feet: '?' }) + 'How far apart are the feet of the sign, to the nearest tenth of a centimetre?', s.d,
            { unit: 'cm', prop: { given: s.w, num: s.L, den: s.c }, kEarly: { len: s.w, num: s.L, den: s.c }, alts: [{ v: s.w * (s.L - s.c) / s.c, code: 'u6l5-piece', hint: 'Use the <b>whole</b> leg (' + s.L + ' cm, hinge to floor) for the big triangle, not just the part below the chain.' }, { v: s.w + s.L - s.c, code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by the same factor; don’t add the difference.' }],
              sol: br(['The small triangle (hinge and chain) and the big triangle (hinge and feet) share the angle at the hinge, and the chain is parallel to the floor (corresponding angles), so they are similar.', t('\\dfrac{d}{' + s.w + '}=\\dfrac{' + s.L + '}{' + s.c + '}'), t('d=' + s.w + '\\times ' + s.L + '\\div ' + s.c + eqR(s.d)), 'The feet are about ' + N(rd(s.d)) + ' cm apart.']),
              hints: ['The chain is the base of a small triangle with the hinge at the top. The floor between the feet is the base of the big one.', 'Match: the whole leg (' + s.L + ' cm) with the ' + s.c + ' cm down to the chain.'], text: 'sandwich board' });
        } }] },
      { num: '12', stem: function (sh) { return 'The legs of a folding sawhorse cross at point ' + t('X') + '. The top bar is parallel to the floor. The tops of the legs are ' + sh.a + ' cm apart and the feet are ' + sh.b + ' cm apart. Each leg measures ' + sh.t + ' cm from its top to ' + t('X') + '.' + crossSVG(null, sh.a / sh.b, { top: sh.a + ' cm', bottom: sh.b + ' cm', P1X: sh.t + ' cm', XQ2: '?' }, { ground: true, xName: 'X', aria: 'sawhorse legs crossing' }); },
        shared: function (r) { return find(function () { return { a: r.pick([48, 52, 56, 60, 64, 68, 72]), b: r.pick([70, 75, 80, 84, 90, 96]), t: r.pick([30, 32, 36, 40, 42, 45]) }; }, function (s) { s.x = s.t * s.b / s.a; return s.b / s.a > 1.1 && s.b / s.a < 1.6 && decs(s.x) <= 1 && !(s.a === 64 && s.b === 80 && s.t === 40); }, { a: 64, b: 80, t: 40, x: 50 }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r) { return crossMC(r, 'Give two reasons why the top triangle and the bottom triangle are similar.', { X: t('X'), par: 'The top bar and the floor', alt: 'the angles that each leg makes with them', legs: 'The two legs are the same length.' }); } },
          { id: '12b', level: 'PRG', make: function (r, sh) { return lenP('How long is each leg from ' + t('X') + ' to the floor?', sh.x, { unit: 'cm', prop: { given: sh.t, num: sh.b, den: sh.a }, alts: [{ v: sh.t + sh.x, code: 'u6l5-whole', hint: 'That is the whole leg. The question asks for the part from X to the floor.' }, { v: sh.t + sh.b - sh.a, code: 'prop-add', hint: 'Multiply by k = ' + t(sh.b + '\\div ' + sh.a) + '; don’t add the difference.' }],
            sol: br(['The ' + sh.b + ' cm matches the ' + sh.a + ' cm. ' + t('k=' + sh.b + '\\div ' + sh.a + '=' + N(sh.b / sh.a, 4)), 'leg below ' + t('X') + ' ' + t('=' + sh.t + '\\times ' + sh.b + '\\div ' + sh.a + '=' + N(sh.x)) + ' cm']), hints: ['The bottom triangle is bigger: k = feet distance ÷ top distance.', 'The part below X matches the ' + sh.t + ' cm above X.'], text: 'sawhorse leg' }); } }] },
      { num: '13', stem: function (sh) { var n = sh.n, s = sh.s; return 'In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(n[3] + n[4] + '\\parallel ' + n[1] + n[2]) + ' (' + t(n[3]) + ' on ' + t(n[0] + n[1]) + ', ' + t(n[4]) + ' on ' + t(n[0] + n[2]) + '). ' + t(n[0] + n[3] + '=' + N(s.AD)) + ' cm, ' + t(n[3] + n[1] + '=' + N(s.DB)) + ' cm and ' + t(n[3] + n[4] + '=' + N(s.DE)) + ' cm. Here is ' + sh.who + '’s work to find ' + t(n[1] + n[2]) + ':' +
          '<div style="border:1px solid #888;padding:6px 12px;margin:6px 0;display:inline-block">' + t('\\dfrac{' + n[1] + n[2] + '}{' + N(s.DE) + '}=\\dfrac{' + N(s.DB) + '}{' + N(s.AD) + '}') + ' &nbsp; ' + t(n[1] + n[2] + '=' + N(s.DE) + '\\times ' + N(s.DB) + '\\div ' + N(s.AD) + '=' + N(s.DE * s.DB / s.AD)) + ' cm</div>'; },
        shared: function (r) { return { n: nestNames(r), who: r.pick(['Jordan', 'Kayla', 'Theo', 'Rosa']), s: nestShared(r, { AD: [6, 10], DB: [2, 5], DE: [6, 14, 1], test: function (v) { return decs(v.BC) <= 1 && decs(v.DE * v.DB / v.AD) <= 2 && v.DB < v.AD; } }) || { AD: 8, DB: 4, DE: 10, AE: 8, AB: 12, BC: 15, k: 1.5 } }; },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) { var n = sh.n, s = sh.s, w = sh.who;
            return P.mc(r, 'What is ' + w + '’s mistake?', [
              { html: 'The piece ' + t(n[3] + n[1] + '=' + N(s.DB)) + ' was used instead of the whole side ' + t(n[0] + n[1] + '=' + N(s.AD) + '+' + N(s.DB) + '=' + N(s.AB)) + '. (The answer is also too small: ' + t(n[1] + n[2]) + ' must be longer than ' + t(n[3] + n[4]) + '.)', right: true },
              { html: 'The ratio is upside down: it should be ' + t('\\dfrac{' + n[1] + n[2] + '}{' + N(s.DE) + '}=\\dfrac{' + N(s.AD) + '}{' + N(s.DB) + '}') + '.', why: 'That still uses the piece ' + t(n[3] + n[1]) + '. The big triangle’s side is the whole ' + t(n[0] + n[1]) + '.', code: 'flip' },
              { html: t(n[1] + n[2]) + ' should be ' + t(N(s.DE) + '+' + N(s.DB) + '=' + N(s.DE + s.DB)) + ' cm: add the extra length.', why: 'Similar triangles <b>multiply</b> by k; they don’t add.', code: 'add' },
              { html: 'There is no mistake.', why: t(n[1] + n[2]) + ' is a side of the big triangle, so it must be <b>longer</b> than ' + t(n[3] + n[4] + '=' + N(s.DE)) + ' cm.', code: 'none' }],
              w + ' used the piece ' + t(n[3] + n[1] + '=' + N(s.DB)) + ' cm instead of the whole side ' + t(n[0] + n[1] + '=' + N(s.AD) + '+' + N(s.DB) + '=' + N(s.AB)) + ' cm. (The answer ' + N(s.DE * s.DB / s.AD) + ' cm is too small: ' + t(n[1] + n[2]) + ' is in the big triangle, so it must be longer than ' + N(s.DE) + ' cm.)', ['Which side of the big triangle matches ' + n[0] + n[3] + '?'], 'find the mistake'); } },
          { id: '13b', level: 'PRG', make: function (r, sh) { return nestBC(sh.n, sh.s, 'cm', 'Now find the correct length. '); } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'MAS', make: function (r) {
          var n = nestNames(r), s = find(function () { var AB = r.int(8, 20), BC = pickR(r, 5, 12, 0.5), DE = pickR(r, 2.5, BC - 1.5, 0.5); return { AB: AB, BC: BC, DE: DE }; }, function (v) { v.AD = v.AB * v.DE / v.BC; v.DB = q(v.AB - v.AD); return decs(v.AD) <= 1 && !same(v.AD, Math.round(v.AD)) && v.DE / v.BC > 0.35 && v.DE / v.BC < 0.75 && !(v.AB === 12 && v.BC === 7.5); }, { AB: 12, BC: 7.5, DE: 4.5, AD: 7.2, DB: 4.8 });
          var fl = [lenF(t(n[0] + n[3]) + ' =', s.AD, { unit: 'm', name: n[0] + n[3], prop: { given: s.AB, num: s.DE, den: s.BC }, alts: otherBox(s.AD, [[s.DB, n[3] + n[1]]]).concat([{ v: s.AB - s.DE, code: 'prop-add', hint: 'Multiply by the ratio ' + t(n[3] + n[4] + '\\div ' + n[1] + n[2]) + '; don’t subtract.' }]) }),
            lenF(t(n[3] + n[1]) + ' =', s.DB, { unit: 'm', name: n[3] + n[1], alts: otherBox(s.DB, [[s.AD, n[0] + n[3]]]).concat([{ v: s.AB, code: 'u6l5-whole', hint: 'That is the whole side. ' + t(n[3] + n[1]) + ' = ' + t(n[0] + n[1] + '-' + n[0] + n[3]) + '.' }, { v: s.AB - s.AB * s.BC / s.DE, code: 'prop-flip', hint: 'Your ' + n[0] + n[3] + ' looks upside down: the small triangle’s side is on top on both sides.' }]) })];
          return fieldsP('In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(n[3] + n[4] + '\\parallel ' + n[1] + n[2]) + '. ' + t(n[3] + n[4] + '=' + N(s.DE)) + ' m, ' + t(n[1] + n[2] + '=' + N(s.BC)) + ' m and the whole side ' + t(n[0] + n[1] + '=' + N(s.AB)) + ' m. Find ' + t(n[0] + n[3]) + ' and ' + t(n[3] + n[1]) + '.' + nestedSVG(n, s.AD / s.AB, { DE: N(s.DE) + ' m', BC: N(s.BC) + ' m' }, { AB: N(s.AB) + ' m' }), fl,
            br([t('\\triangle ' + n[0] + n[3] + n[4] + '\\sim\\triangle ' + n[0] + n[1] + n[2]) + ', so ' + t(n[0] + n[3]) + ' matches ' + t(n[0] + n[1]) + ' and ' + t(n[3] + n[4]) + ' matches ' + t(n[1] + n[2]) + '.', t('\\dfrac{' + n[0] + n[3] + '}{' + N(s.AB) + '}=\\dfrac{' + N(s.DE) + '}{' + N(s.BC) + '}') + ' ⇒ ' + t(n[0] + n[3] + '=' + N(s.AB) + '\\times ' + N(s.DE) + '\\div ' + N(s.BC) + '=' + N(s.AD)) + ' m', t(n[3] + n[1] + '=' + n[0] + n[1] + '-' + n[0] + n[3] + '=' + N(s.AB) + '-' + N(s.AD) + '=' + N(s.DB)) + ' m']),
            ['The small triangle has the side ' + n[0] + n[3] + '; the big triangle has the whole side ' + n[0] + n[1] + '.', 'Find ' + n[0] + n[3] + ' first, then subtract it from ' + N(s.AB) + ' m.'], 'AD and DB');
        } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'EMG', make: function (r) { var nm = twoTris(r); return ratioMC(r, nm[0], nm[1]); } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) { return angleMC(r); } }] },
      { num: '17', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var n = nestNames(r), s = find(function () { return { AD: r.int(2, 6), DB: r.int(3, 9), DE: r.int(3, 8) }; }, function (v) { v.AB = v.AD + v.DB; v.BC = v.DE * v.AB / v.AD; v.w1 = v.DE * v.DB / v.AD; v.w2 = v.DE * v.AD / v.DB; v.w3 = v.DE + v.AD; var all = [v.BC, v.w1, v.w2, v.w3]; return Number.isInteger(v.BC) && all.every(function (x) { return decs(x) <= 1; }) && all.every(function (x, i) { return all.every(function (y, j) { return i === j || !same(x, y); }); }) && v.DB !== v.AD && !(v.AD === 3 && v.DB === 6 && v.DE === 4); }, { AD: 3, DB: 6, DE: 4, AB: 9, BC: 12, w1: 8, w2: 2, w3: 7 });
          var c = function (x) { return N(x) + ' cm'; };
          return P.mc(r, 'In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(n[3] + n[4] + '\\parallel ' + n[1] + n[2]) + ' with ' + t(n[3]) + ' on ' + t(n[0] + n[1]) + ' and ' + t(n[4]) + ' on ' + t(n[0] + n[2]) + '. ' + t(n[0] + n[3] + '=' + s.AD) + ' cm, ' + t(n[3] + n[1] + '=' + s.DB) + ' cm and ' + t(n[3] + n[4] + '=' + s.DE) + ' cm. What is the length of ' + t(n[1] + n[2]) + '?', [
            { html: c(s.BC), right: true }, { html: c(s.w1), why: 'That uses the piece ' + t(n[3] + n[1]) + '. The big triangle’s side is ' + t(n[0] + n[1] + '=' + s.AD + '+' + s.DB + '=' + s.AB) + '.', code: 'u6l5-piece' },
            { html: c(s.w2), why: 'That is smaller than ' + t(n[3] + n[4]) + ', but ' + t(n[1] + n[2]) + ' is in the bigger triangle. Use ' + t(n[0] + n[1] + '\\div ' + n[0] + n[3]) + '.', code: 'flip' }, { html: c(s.w3), why: 'Similar triangles <b>multiply</b> by k; they don’t add.', code: 'add' }],
            t(n[0] + n[1] + '=' + s.AD + '+' + s.DB + '=' + s.AB) + ' cm, so ' + t(n[1] + n[2] + '=' + s.DE + '\\times ' + s.AB + '\\div ' + s.AD + '=' + s.BC) + ' cm.', ['Use the whole side ' + n[0] + n[1] + '.'], 'nested MC');
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var nm = twoTris(r), T1 = nm[0], T2 = nm[1], s = find(function () { return { a: pickR(r, 4.5, 9.5, 0.5), b: r.pick([10, 11, 12, 13, 14, 15]), c: pickR(r, 3.2, 8.8, 0.1) }; }, function (v) { v.x = v.c * v.b / v.a; return !same(rd(v.x, 1), v.x) && v.x < 100 && !(v.a === 7.2 && v.b === 11); }, { a: 7.5, b: 12, c: 5.2, x: 8.32 });
          return lenP(t('\\triangle ' + T1.join('') + '\\sim\\triangle ' + T2.join('')) + '. ' + t(sd(T1, [0, 1]) + '=' + N(s.a)) + ' cm, ' + t(sd(T2, [0, 1]) + '=' + N(s.b)) + ' cm and ' + t(sd(T1, [1, 2]) + '=' + N(s.c)) + ' cm. The length of ' + t(sd(T2, [1, 2])) + ', to the nearest tenth of a centimetre, is ________ cm.', s.x,
            { unit: 'cm', nr: true, prop: { given: s.c, num: s.b, den: s.a }, kEarly: { len: s.c, num: s.b, den: s.a }, sol: t(sd(T2, [1, 2]) + '=' + N(s.c) + '\\times ' + N(s.b) + '\\div ' + N(s.a) + eqR(s.x)) + ' cm', hints: [t(sd(T2, [1, 2])) + ' matches ' + t(sd(T1, [1, 2])) + '; ' + t(sd(T2, [0, 1])) + ' matches ' + t(sd(T1, [0, 1])) + '.'], text: 'NR side' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Find the missing angle in each triangle. Are the two triangles similar?' + aaTable(sh, ['(a)', '(b)', '(c)']); },
        shared: function (r) { return [aaRow(r, 'right'), aaRow(r, 'no-iso'), aaRow(r, 'obtuse')]; },
        parts: [
          { id: 'e1a', level: 'BEG', make: function (r, sh) { return aaPart(sh[0], '(a)'); } },
          { id: 'e1b', level: 'EMG', make: function (r, sh) { return aaPart(sh[1], '(b)'); } },
          { id: 'e1c', level: 'EMG', make: function (r, sh) { return aaPart(sh[2], '(c)'); } }] },
      { num: '2', stem: function (sh) { return t('\\triangle ' + sh.T1.join('') + '\\sim\\triangle ' + sh.T2.join('')) + '. Fill in the blanks.'; },
        shared: function (r) { return nameShared(r); },
        parts: [
          { id: 'e2abc', sub: 'a–c', level: 'BEG', make: function (r, sh) { return namePartABC(sh); } },
          { id: 'e2d', sub: 'd', level: 'EMG', make: function (r, sh) { return namePartD({ T1: sh.T1, T2: sh.T2, ord: sh.ord, blank: 1 - sh.blank }); } },
          { id: 'e2e', sub: 'e', level: 'EMG', make: function (r, sh) { return namePartE({ T1: sh.T1, T2: sh.T2, side: sh.side, across: true }); } }] },
      { num: '3', stem: function (sh) { return 'The two triangles are similar.' + arcsSVG(sh); },
        shared: function (r) { return arcsShared(r); },
        parts: [
          { id: 'e3a', level: 'EMG', make: function (r, sh) { return arcsName(sh); } },
          { id: 'e3b', level: 'BEG', make: function (r, sh) { return arcsSide(sh, [1, 2]); } }] },
      { num: '4', stem: function (sh) { return t('\\triangle PQR\\sim\\triangle XYZ') + '. Matching sides are in the same column.' + sideTable(['P', 'Q', 'R'], ['X', 'Y', 'Z'], sh.o, sh.n, [true, false, false]); },
        shared: function (r) { return kShared(r, { k: [1.5, 2.5, 1.2, 1.4, 0.6, 0.8, 3] }); },
        parts: [{ id: 'e4', level: 'EMG', make: function (r, sh) { return sideBoxes(sh, ['P', 'Q', 'R'], ['X', 'Y', 'Z'], 'Find the scale factor, then complete the table.', true); } }] },
      { num: '5', stem: function (sh) { return 'The two triangles are similar. Round to the nearest tenth of a metre.' + simFig(sh, [N(sh.o[0]) + ' m', 'y', N(sh.o[2]) + ' m'], [N(sh.nb) + ' m', N(rd(sh.n[1])) + ' m', 'x'], { rot: 180 }); },
        shared: function (r) { var s = simShared(r, { b: [2.2, 4.8, 0.1], need: [2] }); s.nRight = rd(s.n[1], 1); return s; },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, sh) { var x = sh.n[2]; return lenP('(a) Find ' + t('x') + '.', x, { unit: 'm', prop: { given: sh.o[2], num: sh.nb, den: sh.o[0] }, kEarly: { len: sh.o[2], num: sh.nb, den: sh.o[0] }, sol: br([t('x') + ' matches ' + N(sh.o[2]) + ' m; ' + N(sh.nb) + ' m matches ' + N(sh.o[0]) + ' m.', t('\\dfrac{x}{' + N(sh.o[2]) + '}=\\dfrac{' + N(sh.nb) + '}{' + N(sh.o[0]) + '}'), t('x=' + N(sh.o[2]) + '\\times ' + N(sh.nb) + '\\div ' + N(sh.o[0]) + eqR(x)) + ' m']), hints: ['Match the angles by their arcs. The turned triangle is bigger.'], text: 'find x (m)' }); } },
          { id: 'e5b', level: 'PRG', make: function (r, sh) { var y = sh.nRight * sh.o[0] / sh.nb; return lenP('(b) Find ' + t('y') + '.', y, { unit: 'm', prop: { given: sh.nRight, num: sh.o[0], den: sh.nb }, kEarly: { len: sh.nRight, num: sh.o[0], den: sh.nb }, sol: br([t('y') + ' matches ' + N(sh.nRight) + ' m.', t('\\dfrac{y}{' + N(sh.nRight) + '}=\\dfrac{' + N(sh.o[0]) + '}{' + N(sh.nb) + '}'), t('y=' + N(sh.nRight) + '\\times ' + N(sh.o[0]) + '\\div ' + N(sh.nb) + eqR(y)) + ' m']), hints: ['y is in the smaller triangle, so it must be less than ' + N(sh.nRight) + ' m.', 'Put y on top: y ÷ ' + N(sh.nRight) + ' = ' + N(sh.o[0]) + ' ÷ ' + N(sh.nb) + '.'], text: 'find y (m)' }); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { var n = sh.n, s = sh.s; return 'In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(n[3] + n[4] + '\\parallel ' + n[1] + n[2]) + '. ' + t(n[0] + n[3] + '=' + N(s.AD)) + ' cm, ' + t(n[3] + n[1] + '=' + N(s.DB)) + ' cm and ' + t(n[3] + n[4] + '=' + N(s.DE)) + ' cm.' + nestedSVG(n, s.AD / s.AB, { AD: N(s.AD) + ' cm', DB: N(s.DB) + ' cm', DE: N(s.DE) + ' cm' }, { apex: 0.65 }); },
        shared: function (r) { return { n: nestNames(r), s: nestShared(r, { AD: [1.5, 4, 0.5], DB: [3, 8], DE: [2, 5, 0.5], test: function (v) { return decs(v.BC) <= 1 && v.DB > v.AD; } }) || { AD: 2.5, DB: 5, DE: 3, AE: 3, AB: 7.5, BC: 9, k: 3, AC: 9, EC: 6 } }; },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) { return nestMC(r, sh.n); } },
          { id: 'e6b', level: 'PRG', make: function (r, sh) { return nestBC(sh.n, sh.s, 'cm'); } }] },
      { num: '7', stem: '', parts: [
        { id: 'e7', level: 'EMG', make: function (r) {
          var s = find(function () { return { d1: pickR(r, 1.5, 3.0, 0.1), h1: pickR(r, 0.6, 1.2, 0.1), d2: pickR(r, 4.0, 7.0, 0.1) }; }, function (v) { v.h2 = v.h1 * v.d2 / v.d1; return decs(v.h2) <= 1 && v.d2 / v.d1 > 1.8 && v.d2 / v.d1 < 3.5 && !(v.d1 === 2.1 && v.d2 === 5.6); }, { d1: 2.1, h1: 0.9, d2: 5.6, h2: 2.4 });
          return slopeH('A roof rises steadily from the eave ' + t('E') + ' to the peak. A vertical brace inside the roof is ' + U(s.h1, 'm') + ' tall and stands ' + U(s.d1, 'm') + ' (measured level) from the eave. The peak is ' + U(s.d2, 'm') + ' from the eave, measured level.' + slopeSVG({ d1: s.d1, h1: s.h1, d2: s.d2, h2: s.h2, dashed: true, lab: { A: 'E', top: 'peak', d1: N(s.d1) + ' m', d2: N(s.d2) + ' m', h1: N(s.h1) + ' m', h2: '?' } }) + 'How tall is the roof at the peak?', s, 'm', { A: 'the eave', end: 'The roof is ' + N(rd(s.h2)) + ' m tall at the peak.', text: 'roof peak' });
        } }] },
      { num: '8', stem: function (sh) { return 'A rancher wants to know the distance ' + t('AB') + ' across a slough. He puts a stake at ' + t('C') + '. Points ' + t('A') + ', ' + t('C') + ', ' + t('D') + ' are in a line, and so are ' + t('B') + ', ' + t('C') + ', ' + t('E') + '. He sets ' + t('DE') + ' parallel to ' + t('AB') + ', then measures ' + t('AC=' + sh.AC) + ' m, ' + t('CD=' + sh.CD) + ' m and ' + t('DE=' + sh.DE) + ' m.' +
          crossSVG(['A', 'B', 'C', 'E', 'D'], sh.AB / sh.DE, { top: '?', P1X: sh.AC + ' m', XQ2: sh.CD + ' m', bottom: sh.DE + ' m' }, { water: '#d6ecd2', waterName: 'slough', dashTop: true, aria: 'a slough measured with crossing triangles' }); },
        shared: function (r) { return find(function () { return { AC: r.int(40, 90), CD: r.int(10, 25), DE: r.int(12, 30) }; }, function (s) { s.AB = s.DE * s.AC / s.CD; return decs(s.AB) <= 1 && s.AC / s.CD > 2.2 && s.AC / s.CD < 6 && !(s.AC === 65 && s.CD === 15) && !(s.AC === 38 && s.CD === 12); }, { AC: 65, CD: 15, DE: 18, AB: 78 }); },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r) { return crossMC(r, 'Give two reasons why ' + t('\\triangle ABC\\sim\\triangle DEC') + '.', { X: t('C'), par: t('AB') + ' and ' + t('DE'), alt: t('\\angle BAC') + ' and ' + t('\\angle EDC'), legs: t('AC') + ' and ' + t('BC') + ' are the same length.' }); } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) { return lenP('How far is it across the slough?', sh.AB, { unit: 'm', prop: { given: sh.DE, num: sh.AC, den: sh.CD }, kEarly: { len: sh.DE, num: sh.AC, den: sh.CD }, alts: [{ v: sh.DE + sh.AC - sh.CD, code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by k; don’t add the difference.' }, { v: sh.DE * (sh.AC + sh.CD) / sh.CD, code: 'u6l5-piece', hint: 'Use ' + t('AC') + ' (from A to the stake), not the whole line ' + t('AD') + '. ' + t('AC') + ' matches ' + t('DC') + '.' }],
            sol: br([t('AB') + ' matches ' + t('DE') + ', and ' + t('AC') + ' matches ' + t('DC') + '.', t('\\dfrac{AB}{' + sh.DE + '}=\\dfrac{' + sh.AC + '}{' + sh.CD + '}'), t('AB=' + sh.DE + '\\times ' + sh.AC + '\\div ' + sh.CD + eqR(sh.AB)) + ' m. It is about ' + N(rd(sh.AB)) + ' m across.']), hints: ['Match in order: A ↔ D, B ↔ E, C ↔ C.', 'Put AB on top: AB ÷ ' + sh.DE + ' = ' + sh.AC + ' ÷ ' + sh.CD + '.'], text: 'slough' }); } }] },
      { num: '9', stem: function (sh) { return 'Two wheelchair ramps are built at the <b>same angle</b> with the level ground. Ramp 1 is ' + U(sh.L1, 'm') + ' long (along its surface) and rises ' + t(sh.r1.toFixed(2) + '\\text{ m}') + '. Ramp 2 must rise ' + t(sh.r2.toFixed(2) + '\\text{ m}') + '.' +
          trisSVG([{ pts: triAA(1, 17, 90), size: 190, arcs: [1, 'R', 0], sides: ['', sh.r1.toFixed(2) + ' m', N(sh.L1) + ' m'] }, { pts: triAA(1, 17, 90), size: 190 * Math.min(1.5, sh.r2 / sh.r1), arcs: [1, 'R', 0], sides: ['', sh.r2.toFixed(2) + ' m', '?'] }], { gap: 40, align: 'bottom', H: 90, width: 560, aria: 'two ramps at the same angle' }); },
        shared: function (r) { return find(function () { return { L1: pickR(r, 2.4, 4.8, 0.1), r1: r.pick([0.2, 0.24, 0.25, 0.3, 0.32, 0.36, 0.4]), r2: r.pick([0.45, 0.48, 0.5, 0.54, 0.6, 0.64, 0.72]) }; }, function (s) { s.L2 = s.L1 * s.r2 / s.r1; return s.r2 / s.r1 > 1.3 && s.r2 / s.r1 < 2.6 && s.L1 / s.r1 > 9 && s.L1 / s.r1 < 16 && !(s.L1 === 3.6 && s.r1 === 0.3 && s.r2 === 0.45); }, { L1: 3.6, r1: 0.3, r2: 0.45, L2: 5.4 }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return lenP('How long must ramp 2 be? Round to the nearest tenth of a metre.', sh.L2, { unit: 'm', prop: { given: sh.L1, num: sh.r2, den: sh.r1 }, kEarly: { len: sh.L1, num: sh.r2, den: sh.r1 }, alts: [{ v: sh.L1 + sh.r2 - sh.r1, code: 'prop-add', hint: 'Multiply by k = ' + t(sh.r2.toFixed(2) + '\\div ' + sh.r1.toFixed(2)) + '; don’t add the difference.' }],
            sol: br([t('\\dfrac{L}{' + N(sh.L1) + '}=\\dfrac{' + sh.r2.toFixed(2) + '}{' + sh.r1.toFixed(2) + '}'), t('L=' + N(sh.L1) + '\\times ' + sh.r2.toFixed(2) + '\\div ' + sh.r1.toFixed(2) + eqR(sh.L2)) + ' m', 'Ramp 2 must be about ' + N(rd(sh.L2)) + ' m long.']), hints: ['The ramp lengths match each other, and the rises match each other.', 'Put L on top: L ÷ ' + N(sh.L1) + ' = ' + sh.r2.toFixed(2) + ' ÷ ' + sh.r1.toFixed(2) + '.'], text: 'ramp length' }); } },
          { id: 'e9b', level: 'EMG', make: function (r) { return P.mc(r, 'Why are the two ramp triangles similar?', [{ html: 'Each ramp makes a right triangle with the ground and its vertical rise. The right angles match and the ramp angles are equal (AA).', right: true },
            { html: 'Both ramps are wheelchair ramps.', why: 'Use the angles: a right angle in each, and the equal ramp angles.', code: 'use' }, { html: 'Ramp 2 rises more, so it is an enlargement.', why: 'A bigger rise alone doesn’t make it an enlargement. The equal <b>angles</b> do.', code: 'more' },
            { html: 'Their rises add to less than 1 m.', why: 'That has nothing to do with similarity. Look for two pairs of equal angles.', code: 'sum' }], 'Each ramp, the ground and the vertical rise make a right triangle. The right angles match and the ramp angles are equal, so the triangles are similar (AA).', ['Which two pairs of angles are equal?'], 'why ramps similar'); } }] },
      { num: '10', stem: function (sh) { return sh.who + ' has two triangles. Triangle 1 has sides ' + sh.t1.join(' cm, ').replace(/, (\d+(\.\d+)?)$/, ' and $1') + ' cm. Triangle 2 has sides ' + sh.t2.map(N).join(' cm, ').replace(/, ([\d.]+)$/, ' and $1') + ' cm. ' + sh.who + ' says, “Two of the sides ' + sh.word + ', so the triangles are similar.”'; },
        shared: function (r) {
          return find(function () { var s = r.pick([[3, 4, 5], [5, 6, 8], [4, 6, 7], [6, 8, 9], [5, 7, 9], [4, 5, 6]]), m = r.pick([2, 3, 1.5]), odd = r.int(0, 2), m2 = q(m + r.pick([-0.2, -0.3, 0.2, 0.25, 0.4, -0.25])); return { t1: s, m: m, odd: odd, m2: m2, t2: s.map(function (x, i) { return q(x * (i === odd ? m2 : m)); }), who: r.pick(['Taylor', 'Noor', 'Ben', 'Hana']), word: m === 2 ? 'doubled' : m === 3 ? 'tripled' : 'were multiplied by 1.5' }; },
            function (v) { var srt = v.t2.slice().sort(function (a, b) { return a - b; }); return v.t2.every(function (x) { return decs(x) <= 1; }) && srt.join() === v.t2.join() && v.t2[0] !== v.t2[1] && v.t2[1] !== v.t2[2] && decs(v.m2) <= 2 && !(v.t1.join() === '3,4,5' && v.t2.join() === '6,8,9'); }, { t1: [3, 4, 5], m: 2, odd: 2, m2: 1.8, t2: [6, 8, 9], who: 'Taylor', word: 'doubled' });
        },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, sh) {
            var L = ['shortest', 'middle', 'longest'], fl = [0, 1, 2].map(function (i) { var v = sh.t2[i] / sh.t1[i]; return { f: { label: L[i] + ': ' + t(N(sh.t2[i]) + '\\div ' + sh.t1[i]) + ' =', name: L[i] + ' sides' }, chk: G.lenChk(v, { dp: 2, alts: [{ v: sh.t1[i] / sh.t2[i], code: 'k-flip', hint: 'Divide Triangle 2’s side by Triangle 1’s side (big ÷ small).' }] }), key: fmtKey(v, 2), show: t(N(rd(v, 2))) }; });
            return fieldsP('Divide each side of Triangle 2 by the matching side of Triangle 1 (shortest with shortest, middle with middle, longest with longest).', fl, [0, 1, 2].map(function (i) { return t(N(sh.t2[i]) + '\\div ' + sh.t1[i] + '=' + N(rd(sh.t2[i] / sh.t1[i], 2))); }).join(', '), ['Pair the sides by size: shortest with shortest, and so on.'], 'side ratios');
          } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) {
            var ks = [0, 1, 2].map(function (i) { return N(rd(sh.t2[i] / sh.t1[i], 2)); });
            return P.mc(r, 'Is ' + sh.who + ' right?', [{ html: '<b>No.</b> The ratios are ' + ks.join(', ') + '. They are not all the same, and <b>all three</b> side ratios must be equal.', right: true },
              { html: '<b>Yes.</b> Two of the three ratios are equal, and that is enough.', why: 'For sides, all <b>three</b> ratios must be equal (two equal <b>angles</b> are enough, but these are sides).', code: 'two' },
              { html: '<b>Yes.</b> The sides are in the same order, from shortest to longest.', why: 'Being in the same order doesn’t make the ratios equal. Compare all three ratios.', code: 'order' },
              { html: '<b>No.</b> Similar triangles must have the same side lengths.', why: 'Same side lengths would make them the same size. Similar triangles can be different sizes; their side <b>ratios</b> must match.', code: 'same' }],
              'Ratios: ' + ks.join(', ') + '. They are not all equal, so the triangles are <b>not</b> similar. ' + sh.who + ' is wrong: all three side ratios must be equal.', ['Look at your three ratios from (a).'], 'is it similar');
          } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var nm = twoTris(r), T1 = nm[0], T2 = nm[1], s = find(function () { return { a: r.int(35, 70), b: r.int(40, 75), miss: r.int(0, 2) }; }, function (v) { v.c = 180 - v.a - v.b; return v.c > 25 && v.a !== v.b && v.c !== v.a && v.c !== v.b && v.a + v.b !== v.c && !(v.a === 52 && v.b === 61); }, { a: 52, b: 61, miss: 2, c: 67 });
          var giv = [0, 1, 2].filter(function (i) { return i !== s.miss; }), vals = {}; vals[giv[0]] = s.a; vals[giv[1]] = s.b; vals[s.miss] = s.c;
          return P.mc(r, t('\\triangle ' + T1.join('') + '\\sim\\triangle ' + T2.join('')) + '. ' + t('\\angle ' + T1[giv[0]] + '=' + s.a + '^\\circ') + ' and ' + t('\\angle ' + T1[giv[1]] + '=' + s.b + '^\\circ') + '. What is the size of ' + t('\\angle ' + T2[s.miss]) + '?', [
            { html: dg(s.c), right: true }, { html: dg(s.a), why: dg(s.a) + ' is ' + t('\\angle ' + T2[giv[0]]) + ' (it matches ' + t('\\angle ' + T1[giv[0]]) + ').', code: 'a' }, { html: dg(s.b), why: dg(s.b) + ' is ' + t('\\angle ' + T2[giv[1]]) + '.', code: 'b' }, { html: dg(s.a + s.b), why: 'That is the sum of the two angles. The third angle is 180° minus the sum.', code: 'sum' }],
            t('\\angle ' + T2[s.miss] + '=\\angle ' + T1[s.miss] + '=180^\\circ-' + s.a + '^\\circ-' + s.b + '^\\circ=' + s.c + '^\\circ'), [T2[s.miss] + ' matches ' + T1[s.miss] + ' (the same letter position).'], 'third angle MC');
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'PRG', make: function (r) {
          var n = nestNames(r), s = find(function () { return { AD: pickR(r, 3.0, 6.0, 0.1), AB: pickR(r, 7.5, 11.5, 0.5), BC: pickR(r, 5.0, 9.5, 0.5) }; }, function (v) { v.DE = v.BC * v.AD / v.AB; return !same(rd(v.DE, 1), v.DE) && v.AD / v.AB > 0.3 && v.AD / v.AB < 0.7 && !(v.AD === 4.4 && v.AB === 9); }, { AD: 4.4, AB: 9, BC: 6.5, DE: 6.5 * 4.4 / 9 });
          return lenP('A garden bed is the triangle ' + t(n[0] + n[1] + n[2]) + '. A straight path ' + t(n[3] + n[4]) + ' crosses it, parallel to side ' + t(n[1] + n[2]) + '. ' + t(n[0] + n[3] + '=' + N(s.AD)) + ' m, ' + t(n[0] + n[1] + '=' + N(s.AB)) + ' m and ' + t(n[1] + n[2] + '=' + N(s.BC)) + ' m.' + nestedSVG(n, s.AD / s.AB, {}, { fill: '#e3f1dc', dashDE: true, apex: 0.2 }) + 'The length of the path ' + t(n[3] + n[4]) + ', to the nearest tenth of a metre, is ________ m.', s.DE,
            { unit: 'm', nr: true, prop: { given: s.BC, num: s.AD, den: s.AB }, kEarly: { len: s.BC, num: s.AD, den: s.AB }, alts: [{ v: s.BC * (s.AB - s.AD) / s.AB, code: 'u6l5-piece', hint: t(n[3] + n[4]) + ' matches ' + t(n[1] + n[2]) + ', and ' + t(n[0] + n[3]) + ' matches the whole side ' + t(n[0] + n[1]) + '.' }],
              sol: br([t('\\triangle ' + n[0] + n[3] + n[4] + '\\sim\\triangle ' + n[0] + n[1] + n[2]), t(n[3] + n[4] + '=' + N(s.BC) + '\\times ' + N(s.AD) + '\\div ' + N(s.AB) + eqR(s.DE)) + ' m']), hints: ['The path is the base of the small triangle at ' + n[0] + '.', 'Small ÷ big: ' + n[3] + n[4] + ' ÷ ' + n[1] + n[2] + ' = ' + n[0] + n[3] + ' ÷ ' + n[0] + n[1] + '.'], text: 'garden path NR' });
        } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [
        { id: 'e13', level: 'MAS', make: function (r) {
          var n = nestNames(r), s = find(function () { return { AD: r.int(3, 8), DE: pickR(r, 3, 8, 0.5), k: r.pick([1.25, 1.5, 1.75, 2.25, 2.5, 1.6, 1.8, 1.4]) }; }, function (v) { v.BC = q(v.DE * v.k); v.AB = q(v.AD * v.k); v.DB = q(v.AB - v.AD); return decs(v.BC) <= 2 && decs(v.DB) <= 1 && !(v.AD === 4 && v.DE === 5); }, { AD: 4, DE: 5, k: 1.75, BC: 8.75, AB: 7, DB: 3 });
          return lenP('In ' + t('\\triangle ' + n[0] + n[1] + n[2]) + ', ' + t(n[3] + n[4] + '\\parallel ' + n[1] + n[2]) + ' (' + t(n[3]) + ' on ' + t(n[0] + n[1]) + ', ' + t(n[4]) + ' on ' + t(n[0] + n[2]) + '). ' + t(n[0] + n[3] + '=' + N(s.AD)) + ' cm, ' + t(n[3] + n[4] + '=' + N(s.DE)) + ' cm and ' + t(n[1] + n[2] + '=' + N(s.BC)) + ' cm. Find ' + t(n[3] + n[1]) + '.', s.DB,
            { unit: 'cm', alts: [{ v: s.AB, code: 'u6l5-whole', hint: 'That is the whole side ' + t(n[0] + n[1]) + '. Subtract ' + t(n[0] + n[3]) + ' to get ' + t(n[3] + n[1]) + '.' }, { v: s.AD * s.DE / s.BC, code: 'prop-flip', hint: t(n[0] + n[1]) + ' is in the big triangle, so it is longer than ' + t(n[0] + n[3]) + '. Use ' + t('\\dfrac{' + n[0] + n[1] + '}{' + n[0] + n[3] + '}=\\dfrac{' + n[1] + n[2] + '}{' + n[3] + n[4] + '}') + '.' }, { v: s.BC - s.DE, code: 'prop-add', hint: 'Find the whole side ' + t(n[0] + n[1]) + ' with the scale factor first, then subtract ' + t(n[0] + n[3]) + '.' }],
              sol: br([t('\\dfrac{' + n[0] + n[1] + '}{' + N(s.AD) + '}=\\dfrac{' + N(s.BC) + '}{' + N(s.DE) + '}') + ' ⇒ ' + t(n[0] + n[1] + '=' + N(s.AD) + '\\times ' + N(s.BC) + '\\div ' + N(s.DE) + '=' + N(s.AB)) + ' cm', t(n[3] + n[1] + '=' + n[0] + n[1] + '-' + n[0] + n[3] + '=' + N(s.AB) + '-' + N(s.AD) + '=' + N(s.DB)) + ' cm']),
              hints: ['Find the whole side ' + n[0] + n[1] + ' first: it matches ' + n[0] + n[3] + ', as ' + n[1] + n[2] + ' matches ' + n[3] + n[4] + '.', 'Then ' + n[3] + n[1] + ' = ' + n[0] + n[1] + ' − ' + n[0] + n[3] + '.'], text: 'find DB' });
        } }] },
      { num: '14', stem: function (sh) { return 'A straight grain auger runs from point ' + t('A') + ' on the ground up to the top of a bin wall that is ' + U(sh.h2, 'm') + ' high. A vertical support post under the auger is ' + U(sh.h1, 'm') + ' tall and stands ' + U(sh.d1, 'm') + ' from ' + t('A') + ' along the ground.' + slopeSVG({ d1: sh.d1, h1: sh.h1, d2: sh.d2, h2: sh.h2, wall: true, lab: { A: 'A', d1: N(sh.d1) + ' m', d2: '?', h1: N(sh.h1) + ' m', h2: N(sh.h2) + ' m' } }); },
        shared: function (r) { return find(function () { var d1 = pickR(r, 2.0, 4.0, 0.5), h1 = pickR(r, 1.6, 3.2, 0.2), k = r.pick([3, 3.5, 4, 4.5, 2.5]); return { d1: d1, h1: h1, k: k, h2: q(h1 * k), d2: q(d1 * k), x: pickR(r, d1 + 1.5, d1 * k - 2, 0.5) }; }, function (s) { s.hx = s.h1 * s.x / s.d1; return decs(s.h2) <= 1 && decs(s.d2) <= 2 && decs(s.hx) <= 2 && !(s.d1 === 3 && s.h1 === 2.4 && s.h2 === 9.6) && s.x < s.d2 - 1; }, { d1: 3, h1: 2.4, k: 4, h2: 9.6, d2: 12, x: 6.5, hx: 5.2 }); },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) { return lenP('How far from ' + t('A') + ' is the bin wall, along the ground?', sh.d2, { unit: 'm', dp: Math.max(1, decs(sh.d2)), prop: { given: sh.d1, num: sh.h2, den: sh.h1 }, alts: [{ v: sh.d1 + sh.h2 - sh.h1, code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by the same factor; don’t add the difference.' }, { v: sh.h1 * sh.h2 / sh.d1, code: 'u6l5-wrong-pair', hint: 'Match the sides: the ground distance ' + t('d') + ' matches the post’s ' + N(sh.d1) + ' m, and the wall matches the post.' }],
            sol: br([t('\\dfrac{d}{' + N(sh.d1) + '}=\\dfrac{' + N(sh.h2) + '}{' + N(sh.h1) + '}'), t('d=' + N(sh.d1) + '\\times ' + N(sh.h2) + '\\div ' + N(sh.h1) + '=' + N(sh.d2)) + ' m']), hints: ['The wall matches the post, and the distance to the wall matches the post’s distance from A.', 'Put d on top: d ÷ ' + N(sh.d1) + ' = ' + N(sh.h2) + ' ÷ ' + N(sh.h1) + '.'], text: 'auger distance' }); } },
          { id: 'e14b', level: 'ADV', make: function (r, sh) { return lenP('A second post will stand ' + U(sh.x, 'm') + ' from ' + t('A') + '. How tall must it be?', sh.hx, { unit: 'm', dp: Math.max(1, decs(sh.hx)), prop: { given: sh.h1, num: sh.x, den: sh.d1 }, alts: [{ v: sh.h1 + sh.x - sh.d1, code: 'prop-add', hint: 'Multiply by the same factor; don’t add the difference.' }, { v: sh.h2 * sh.d1 / sh.x, code: 'u6l5-wrong-pair', hint: 'The new post’s height over ' + N(sh.x) + ' m must equal the first post’s height over ' + N(sh.d1) + ' m.' }],
            sol: br([t('\\dfrac{h}{' + N(sh.h1) + '}=\\dfrac{' + N(sh.x) + '}{' + N(sh.d1) + '}'), t('h=' + N(sh.h1) + '\\times ' + N(sh.x) + '\\div ' + N(sh.d1) + '=' + N(sh.hx)) + ' m']), hints: ['The new post makes a third similar right triangle with the ground and the auger.'], text: 'second post' }); } }] },
      { num: '15', stem: function (sh) { return 'Two right triangles each have a ' + sh.a + '° angle. They are different sizes.'; },
        shared: function (r) { return { a: r.pick([18, 22, 25, 28, 35, 38, 40, 52, 62, 66, 70]) }; },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r, sh) { var a = sh.a;
            return P.mc(r, 'Why must <b>any</b> two right triangles that each have a ' + a + '° angle be similar?', [
              { html: 'Each has a 90° angle and a ' + a + '° angle: two pairs of equal angles (AA).', right: true },
              { html: 'All right triangles are similar.', why: 'Not all right triangles are similar (90°, 45°, 45° and 90°, 30°, 60° aren’t). These are because a second angle matches.', code: 'all' },
              { html: 'They have the same side lengths.', why: 'They are different sizes. Similarity is about equal <b>angles</b>.', code: 'sides' },
              { html: 'One equal angle is enough to make two triangles similar.', why: 'One equal angle is not enough; AA needs two. Here the right angles are the second pair.', code: 'one' }],
              'Each triangle has a 90° angle and a ' + a + '° angle, so two pairs of angles match and they are similar (AA).', ['Every right triangle already has one angle you know.'], 'any two right triangles'); } },
          { id: 'e15b', level: 'BEG', make: function (r, sh) { var a = sh.a, c = 90 - a; return fieldsP('Sketch the two triangles. What is the third angle in each?', [angF('Third angle =', c, [{ v: 180 - a, code: 'u6l5-one-angle', hint: 'Subtract both angles: ' + t('180^\\circ-90^\\circ-' + a + '^\\circ') + '.' }, { v: 90 + a, code: 'u6l5-sum', hint: 'That is the sum of the two angles. Subtract it from 180°.' }], 'Third angle')],
            'The third angle in both is ' + t('180^\\circ-90^\\circ-' + a + '^\\circ=' + c + '^\\circ') + '. Each sketch shows 90°, ' + a + '° and ' + c + '° (the ' + Math.min(a, c) + '° angle is across from the shortest side).', ['The angles of a triangle add to 180°.'], 'third angle'); } }] }
    ]
  });
})(window);
