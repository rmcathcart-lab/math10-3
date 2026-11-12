/* Math 10-3 · Unit 7 · Lesson 8 — Finding Angles with Inverse Trig Ratios (G4)
 * Assignment 8 (u7_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u7_ep08.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the booklet's situation and difficulty with new numbers around the booklet's (the lesson's
 * worked-example numbers are left out: ratios 0.5, 0.2, 0.7002, 0.6157, 0.3420, 0.4663, 0.95, 0.875, 2.5; fractions 5/8,
 * 4/11, 12/7; triangles 9 & 5, 7 & 12, 8.5 & 11, 8-15-17, 14.5 & 6.2, legs 6 & 11, 9.6 & 15; the 6 m / 1.5 m ladder, the
 * 8 m / 0.6 m ramp, the 5/12 pitch, the drone 90 m / 140 m). Calculator allowed (DEG mode).
 * Angles to the nearest degree (or tenth where the booklet says), lengths to the nearest tenth. Checkers: HW.geo.angleRatioChk
 * (RAD mode, no inverse, the wrong inverse, the ratio upside down via `alts`, the other acute angle) plus local traps:
 * 1 ÷ ratio (reading the −1 as a power), a unit not changed (km vs m), half the width (truss), forgetting to double; rounding
 * a fraction to a short decimal before the inverse gets a nudge (no try used). 90° minus the rounded angle is accepted
 * wherever the booklet subtracts.
 * Conversions: "label the sides, name the ratio, find θ" → the angle with a drawn triangle (no role tags in the prompt;
 * a wrong ratio gets a hint naming the right one; the labelled triangle is in the solution); "check with a ratio" → a
 * multiple choice of ratios (5c) or a second angle box (6b, EP 5b); "less than, equal to or more than 45°" → a tap grid;
 * "what did he do wrong / is it safe / is she right / explain" → multiple choice of reasons; ramp verdicts → "which ramp
 * meets the guideline?" multiple choice; the pitch table and the staircase pair → one box per angle. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.angleRatioChk) throw new Error('u7l8.js needs HW.geo (js/geokit.js)');
  var RAD = Math.PI / 180;

  /* ================= numbers and words ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dg(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dg(x)); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function dots(x, k) { var f = Math.pow(10, k || 2), tr = Math.floor(x * f + 1e-9) / f; return HW.fmt(tr.toFixed(k || 2)) + (Math.abs(x - tr) < 1e-9 ? '' : '\\ldots'); }
  function L(x, u) { return t(N(x) + '\\text{ ' + (u || 'm') + '}'); }
  function lab(x, u) { return nS(x) + ' ' + (u || 'm'); }
  function find(gen, test, fb) { for (var i = 0; i < 4000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7l8: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 0 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function notIn(v, list) { return list.every(function (x) { return Math.abs(v - x) > 1e-9; }); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Zoe', 'f'], ['Jordan', 'm'], ['Tessa', 'f'], ['Eli', 'm'], ['Kayla', 'f'], ['Nolan', 'm'], ['Aisha', 'f'], ['Devon', 'm'], ['Brooke', 'f'], ['Owen', 'm'], ['Mei', 'f'], ['Sam', 'm'], ['Leah', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his' }; }

  /* ================= trig ================= */
  var TRG = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var INV = { sin: function (v) { return Math.asin(v) / RAD; }, cos: function (v) { return Math.acos(v) / RAD; }, tan: function (v) { return Math.atan(v) / RAD; } };
  var MN = { sin: 'SOH', cos: 'CAH', tan: 'TOA' }, PAIRS = { sin: 'opp and hyp', cos: 'adj and hyp', tan: 'opp and adj' };
  var FN_OF = { 'hyp,opp': 'sin', 'adj,hyp': 'cos', 'adj,opp': 'tan' };
  function fnOf(r1, r2) { return FN_OF[[r1, r2].sort().join(',')]; }
  function inT(fn, num, den) { return '\\' + fn + '^{-1}\\!\\left(' + (den == null ? N(num) : '\\frac{' + N(num) + '}{' + N(den) + '}') + '\\right)'; }
  function ratioT(fn) { return { sin: '\\dfrac{\\text{opp}}{\\text{hyp}}', cos: '\\dfrac{\\text{adj}}{\\text{hyp}}', tan: '\\dfrac{\\text{opp}}{\\text{adj}}' }[fn]; }

  /* ================= an angle from a ratio ================= */
  function plainNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\\theta|θ/g, 't').replace(/^\s*(?:\\angle\s*)?[A-Za-z]{1,3}\s*(?:=|≈)\s*/, '').replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º/g, '').replace(/\s*deg(?:rees?)?\.?\s*$/i, '').trim();
    var p = HW.parse.number(s); return p.ok ? p.value : null;
  }
  /* o: ratio { fn, num, den } | null, dp 0, alts [{v, code, hint}], okv [other right values], early true (round the ratio to 1–2
   * decimals → nudge), upside true (the ratio flipped, when it can be computed), recip true (1 ÷ ratio), complementTrap, nr, sol, hints, text */
  function angP(prompt, deg, o) {
    o = o || {}; var dp = o.dp == null ? 0 : o.dp, r = o.ratio, alts = (o.alts || []).slice(), early = [], want = rd(deg, dp);
    var push = function (v, code, hint) { if (isFinite(v) && Math.abs(rd(v, dp) - want) > 1e-9 && alts.every(function (a) { return Math.abs(rd(a.v, dp) - rd(v, dp)) > 1e-9; })) alts.push({ v: v, code: code, hint: hint }); };
    if (r) {
      var qv = r.num / r.den;
      if (o.upside !== false && r.fn === 'tan' && r.num !== r.den) push(INV.tan(r.den / r.num), 'u7l8-upside', 'Your ratio is upside down: ' + t('\\tan\\theta=' + ratioT('tan')) + ' — the side <b>opposite</b> θ goes on top.');
      if (o.recip !== false) push(1 / qv, 'u7l8-recip', 'The −1 is <b>not</b> a power: ' + t('\\' + r.fn + '^{-1}') + ' does not mean 1 ÷ the ratio. Press <b>2nd</b> then <b>' + r.fn + '</b> to get the angle.');
      if (o.early !== false && r.den !== 1) [1, 2].forEach(function (d) { var rr = rd(qv, d); if (rr > 0 && (r.fn === 'tan' || rr <= 1)) early.push(INV[r.fn](rr)); });
    }
    var base = G.angleRatioChk(deg, { dp: dp, ratio: r, alts: alts, complementTrap: o.complementTrap });
    var okv = (o.okv || []).map(function (x) { return rd(x, dp); });
    var chk = function (resp) {
      var p = plainNum(resp);
      if (p != null && Math.abs(rd(p, dp) - want) > 1e-9) {
        if (okv.some(function (x) { return Math.abs(p - x) < 1e-9; })) return ok();
        if (early.some(function (x) { return Math.abs(rd(x, dp) - p) < 1e-9; }) && alts.every(function (a) { return Math.abs(rd(a.v, dp) - p) > 1e-9; }))
          return form('u7l8-early', 'Nearly! Don’t round the fraction to a short decimal first. Type the whole fraction inside the bracket: 2nd ' + r.fn + ' ' + N(r.num) + ' ÷ ' + N(r.den) + ' ) ENTER.');
      }
      return base(resp);
    };
    var key = want.toFixed(dp), bad = [];
    alts.forEach(function (a) { var s = rd(a.v, dp).toFixed(dp); if (s !== key && bad.indexOf(s) < 0 && bad.length < 4 && Math.abs(+s - want) >= 1) bad.push(s); });
    return { prompt: prompt, input: { type: 'number', after: '°', nr: !!o.nr }, check: chk, key: key, answer: t(HW.fmt(key) + '^\\circ'), solution: o.sol, hints: o.hints || [], text: o.text, bad: bad, good: [key + '°'] };
  }
  /* the other acute angle / a subtraction from 90°. o: alts, okv */
  function angX(prompt, deg, o) {
    o = o || {}; var p = G.P.angle(prompt, deg, { alts: o.alts || [], supplementTrap: false, sol: o.sol, hints: o.hints, text: o.text });
    if (o.okv) { var base = p.check, okv = o.okv; p.check = function (resp) { var a = G.readDeg(resp); if (!a.code && okv.some(function (x) { return Math.abs(a.v - x) < 1e-9; })) return ok(); return base(resp); }; }
    p.bad = (o.alts || []).map(function (a) { return nS(a.v); }).filter(function (s) { return s !== p.key; }); p.good = [p.key + '°']; return p;
  }
  function otherAlts(th) { return [{ v: 180 - th, code: 'u7l8-180', hint: 'The two acute angles of a right triangle add to <b>90°</b> (the right angle takes the other 90°). Subtract from 90°, not 180°.' }, { v: th, code: 'u7l8-same', hint: 'That is the angle you started with. The other acute angle is ' + t('90^\\circ-' + dg(th)) + '.' }, { v: 360 - th, code: 'u7l8-180', hint: 'Subtract from <b>90°</b>.' }]; }
  /* a length (nearest tenth unless dp) */
  function lenP(prompt, v, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, p = G.P.len(prompt, v, { dp: dp, unit: o.unit, trig: o.trig, alts: o.alts, sol: o.sol, hints: o.hints, text: o.text });
    var key = rd(v, dp); p.key = key.toFixed(dp); p.answer = t(HW.fmt(p.key) + '\\text{ ' + (o.unit || 'm') + '}');
    p.bad = (o.alts || []).map(function (a) { return rd(a.v, dp).toFixed(dp); }).filter(function (s) { return s !== p.key; }).slice(0, 3); return p;
  }

  HW.addCodes({
    'u7l8-upside': 'Ratio upside down', 'u7l8-recip': 'Read the −1 as a power (1 ÷ ratio)', 'u7l8-early': 'Rounded the ratio before the inverse', 'u7l8-180': 'Subtracted from 180° instead of 90°',
    'u7l8-same': 'Gave the same angle instead of the other one', 'u7l8-unit': 'Lengths in different units (m and km)', 'u7l8-half': 'Did not halve the width', 'u7l8-double': 'Did not double the half angle',
    'u7l8-ratio-mc': 'Chose the wrong ratio', 'u7l8-45': 'Wrong benchmark comparison with 45°'
  });

  /* ================= drawings ================= */
  var INK = '#1d2633', GREY = '#5f6675', RED = '#c93a33', AMBER = '#b26b00';
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* a small SVG canvas with a bounding box (y down) */
  function Fig() { this.s = ''; this.bb = [1e9, 1e9, -1e9, -1e9]; }
  Fig.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); return this; };
  Fig.prototype.line = function (p, p2, o) { o = o || {}; this.s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(p2[0]) + '" y2="' + f1(p2[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; return this.grow(p[0], p[1]).grow(p2[0], p2[1]); };
  Fig.prototype.path = function (d, o, pts) { o = o || {}; var me = this; this.s += '<path d="' + d + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linejoin="round" stroke-linecap="round"/>'; (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); return this; };
  Fig.prototype.poly = function (pts, o) { return this.path('M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z', o, pts); };
  Fig.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-zθ]$/.test(str) ? ' font-style="italic"' : '';
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it + ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + esc(str) + '</text>';
    var w = str.length * size * 0.3 + 2, ax = o.anchor === 'start' ? x + w : o.anchor === 'end' ? x - w : x; return this.grow(ax, y, w, size * 0.62);
  };
  Fig.prototype.arc = function (V, d1, d2, o) {
    o = o || {}; var span = ((d2 - d1) % 360 + 360) % 360, r0 = o.r || 26, a = at(V, d1, r0), b = at(V, d1 + span, r0);
    this.path('M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + f1(b[0]) + ' ' + f1(b[1]), { stroke: o.color || INK, width: 1.8 }, [a, b]);
    if (o.label) { var p = at(V, d1 + span / 2, o.labelR || r0 + 14); this.text(p[0], p[1], o.label, { size: 14, color: o.color || INK }); }
    return this;
  };
  Fig.prototype.rightSq = function (V, d, s) { s = s || 10; var u = at([0, 0], d, s), v = at([0, 0], d + 90, s); return this.path('M' + f1(V[0] + u[0]) + ' ' + f1(V[1] + u[1]) + 'L' + f1(V[0] + u[0] + v[0]) + ' ' + f1(V[1] + u[1] + v[1]) + 'L' + f1(V[0] + v[0]) + ' ' + f1(V[1] + v[1]), { stroke: INK, width: 1.5 }); };
  Fig.prototype.svg = function (o) { o = o || {}; var pad = 8, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad; return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>'; };

  /* a right triangle with θ at A (right angle at C). len { opp, adj } numbers; labels { opp, adj, hyp } text; roles shown (solutions) */
  var CORNERS = ['br', 'bl', 'tr', 'tl'];
  function triFig(r, len, labels, o) {
    o = o || {}; var sd = {}; if (labels.opp != null) sd.a = labels.opp; if (labels.adj != null) sd.b = labels.adj; if (labels.hyp != null) sd.c = labels.hyp;
    return G.rightTriSVG({ a: len.opp, b: len.adj, right: o.right || (r ? r.pick(CORNERS) : 'br'), flip: o.flip, names: o.names || false, theta: 'A', thetaLabel: o.thetaLabel || 'θ', sides: sd, roles: o.roles || [], unknown: o.unknown, width: o.width || 240 });
  }
  /* the sides of a right triangle from two known ones: { opp, adj, hyp } */
  function third(k) { var s = { opp: k.opp, adj: k.adj, hyp: k.hyp }; if (s.hyp == null) s.hyp = Math.sqrt(s.opp * s.opp + s.adj * s.adj); else if (s.opp == null) s.opp = Math.sqrt(s.hyp * s.hyp - s.adj * s.adj); else if (s.adj == null) s.adj = Math.sqrt(s.hyp * s.hyp - s.opp * s.opp); return s; }

  /* ================= part makers ================= */
  /* θ from a decimal ratio: fn, ratio range [lo, hi], decimals, excluded ratios */
  function decRatioPart(fn, lo, hi, dec, lev) {
    return function (r) {
      var f = Math.pow(10, dec), v = find(function () { return r.int(Math.round(lo * f), Math.round(hi * f)) / f; }, function (x) { return notIn(x, [0.5, 0.2, 0.7002, 0.6157, 0.342, 0.4663, 0.95, 0.875, 2.5, 1]) && safe(INV[fn](x), 0) && Math.abs(INV[fn](x) - 45) > 0.6; });
      var th = INV[fn](v);
      return angP(t('\\' + fn + '\\theta=' + N(v)), th, { ratio: { fn: fn, num: v, den: 1 },
        sol: br([t('\\theta=' + inT(fn, v)), t('\\theta=' + dots(th, 2) + '\\approx ' + dg(rd(th, 0)))]), hints: ['Use the inverse key: 2nd then ' + fn + ' (' + fn + '⁻¹).', 'Round to the nearest degree.'], text: fn + '⁻¹ of a decimal' });
    };
  }
  /* θ from a fraction: fn, letter, numerator/denominator ranges; big (tan > 1) */
  var FR_EX = ['5/8', '4/11', '12/7', '1/2'];
  function fracPart(fn, letter, o) {
    return function (r) {
      var s = find(function () { var den = r.int(o.den[0], o.den[1]), num = o.big ? r.int(den + 1, Math.min(o.num || 20, den * 4)) : r.int(1, den - 1); return { num: num, den: den }; },
        function (s) { var th = INV[fn](s.num / s.den); return gcd(s.num, s.den) === 1 && FR_EX.indexOf(s.num + '/' + s.den) < 0 && safe(th, 0) && Math.abs(th - 45) > 1 && Math.abs(rd(INV[fn](rd(s.num / s.den, 1)), 0) - rd(th, 0)) >= 0 && (o.mid ? th > 12 && th < 78 : true); });
      var th = INV[fn](s.num / s.den);
      return angP(t('\\' + fn + ' ' + letter + '=\\dfrac{' + s.num + '}{' + s.den + '}') + '. Find ' + t('\\angle ' + letter) + '.', th, { ratio: { fn: fn, num: s.num, den: s.den },
        sol: br([t('\\angle ' + letter + '=' + inT(fn, s.num, s.den)), t('\\angle ' + letter + '=' + dots(th, 2) + '\\approx ' + dg(rd(th, 0)))]),
        hints: ['Type the whole fraction inside the bracket: 2nd ' + fn + ' ' + s.num + ' ÷ ' + s.den + ' ) ENTER.'], text: fn + '⁻¹ of a fraction' });
    };
  }
  /* θ from two labelled sides of a drawn triangle. kind: 'tan' | 'cos' | 'sin'; o: { u, gen(r) → { opp?, adj?, hyp? }, not: [[x, y]] } */
  function sideAnglePart(kind, o) {
    return function (r) {
      var u = o.u || 'cm', k = find(function () { return o.gen(r); }, function (k) {
        var s = third(k), th = INV.tan(s.opp / s.adj);
        return isFinite(th) && safe(th, 0) && Math.abs(th - 45) > 1.5 && th > 8 && th < 82 && (o.not || []).every(function (p) { var v = [k.opp, k.adj, k.hyp].filter(function (x) { return x != null; }).sort(function (a, b) { return a - b; }); return !(v[0] === Math.min(p[0], p[1]) && v[1] === Math.max(p[0], p[1])); }) && (!o.test || o.test(k, th));
      });
      var s = third(k), th = INV.tan(s.opp / s.adj), roles = ['opp', 'adj', 'hyp'].filter(function (x) { return k[x] != null; }), fn = fnOf(roles[0], roles[1]);
      var num = fn === 'cos' ? k.adj : k.opp, den = fn === 'tan' ? k.adj : k.hyp, labels = {}; roles.forEach(function (x) { labels[x] = lab(k[x], u); });
      var right = r.pick(CORNERS), flip = r.chance(0.5);
      var fig = triFig(null, s, labels, { right: right, flip: flip }), solFig = triFig(null, s, labels, { right: right, flip: flip, roles: roles, width: 220 });
      return angP((o.prompt || 'Find θ to the nearest degree.') + fig, th, { ratio: { fn: fn, num: num, den: den },
        sol: solFig + br([cap(PAIRS[fn]) + ', so use <b>' + fn + '</b> (' + MN[fn] + ').', t('\\' + fn + '\\theta=\\dfrac{' + N(num) + '}{' + N(den) + '}'), t('\\theta=' + inT(fn, num, den) + '=' + dots(th, 2) + '\\approx ' + dg(rd(th, 0)))]),
        hints: ['Label the two given sides from θ: opp is across from θ, hyp is across from the right angle.', 'Opp and adj → tan; opp and hyp → sin; adj and hyp → cos.'], text: 'θ from two sides (' + fn + ')' });
    };
  }
  /* less than / equal to / more than 45° (a tap grid) */
  function benchGrid(r, sh) {
    var rows = sh.rows.map(function (x, i) { return { id: 'r' + i, html: '(' + 'abcd'[i] + ') ' + x.html }; }), want = {}; sh.rows.forEach(function (x, i) { want['r' + i] = x.want; });
    return P.grid('Without a calculator, decide whether θ is less than, equal to, or more than 45°.', rows, [{ id: 'L', html: 'Less than 45°' }, { id: 'E', html: 'Equal to 45°' }, { id: 'M', html: 'More than 45°' }], want, {},
      br(sh.rows.map(function (x, i) { return '(' + 'abcd'[i] + ') ' + x.why; })), ['Compare opp with adj: equal legs give 45°.', 'If opp is half the hyp, θ = 30°; if adj is half the hyp, θ = 60°.'], 'less / equal / more than 45°');
  }
  function benchShared(r) {
    var a = find(function () { return { p: r.int(2, 13), q: r.int(2, 13) }; }, function (s) { return s.p !== s.q && gcd(s.p, s.q) === 1 && Math.abs(s.p - s.q) <= 4 && !(s.p === 7 && s.q === 5); });
    var b = find(function () { return { o: pickR(r, [2.5, 6.5, 0.1]), d: r.int(-6, 6) / 10 }; }, function (s) { return Math.abs(s.d) >= 0.2 && s.o + s.d > 1; }); b.a = q(b.o + b.d);
    var c = pickR(r, [3.5, 9.5, 0.5]), dH = r.int(3, 9) * 2, dOpp = r.chance(0.5);
    var rows = [
      { html: t('\\tan\\theta=\\dfrac{' + a.p + '}{' + a.q + '}'), want: a.p > a.q ? 'M' : 'L', why: (a.p > a.q ? 'More' : 'Less') + ' than 45°: opp (' + a.p + ') is ' + (a.p > a.q ? 'longer' : 'shorter') + ' than adj (' + a.q + ').' },
      { html: 'opp = ' + L(b.o) + ' and adj = ' + L(b.a), want: b.o > b.a ? 'M' : 'L', why: (b.o > b.a ? 'More' : 'Less') + ' than 45°: opp is ' + (b.o > b.a ? 'longer' : 'shorter') + ' than adj.' },
      { html: 'Both legs are ' + L(c, 'cm') + '.', want: 'E', why: 'Equal to 45°: the legs are equal.' },
      { html: (dOpp ? 'opp' : 'adj') + ' = ' + L(dH / 2, 'cm') + ' and hyp = ' + L(dH, 'cm'), want: dOpp ? 'L' : 'M', why: dOpp ? 'Less: opp is half the hyp, so θ = 30° exactly.' : 'More: adj is half the hyp, so θ = 60° exactly.' }];
    return { a: a, b: b, rows: rows };
  }
  /* a "which meets the guideline" MC for two ramps */
  function rampMC(r, sh) {
    var mA = rd(sh.A.th, 1) <= 4.8, mB = rd(sh.B.th, 1) <= 4.8, right = mA && mB ? 'both' : mA ? 'A' : mB ? 'B' : 'none';
    var txt = { A: 'Only ramp A', B: 'Only ramp B', both: 'Both ramps', none: 'Neither ramp' };
    return P.mc(r, 'Which ramp meets the guideline of about ' + D(4.8) + ' or less?', ['A', 'B', 'both', 'none'].map(function (k) { return { html: txt[k], right: k === right, why: 'Compare each angle with 4.8°: ramp A is ' + D(rd(sh.A.th, 1)) + ' and ramp B is ' + D(rd(sh.B.th, 1)) + '. An angle of 4.8° or less meets the guideline.', code: 'u7l8-ramp' }; }),
      'Ramp A: ' + D(rd(sh.A.th, 1)) + (mA ? ' ≤ 4.8°: meets the guideline.' : ' > 4.8°: too steep.') + '<br>Ramp B: ' + D(rd(sh.B.th, 1)) + (mB ? ' ≤ 4.8°: meets the guideline.' : ' > 4.8°: too steep.'), ['A smaller angle is a gentler ramp.'], 'which ramp meets the guideline', true);
  }
  /* ladder: is it safe, what should change (MC) */
  function ladderMC(r, th, u) {
    var low = rd(th, 0) < 75;
    return P.mc(r, 'Is this close to the safe angle of about ' + D(75) + '? What should change?', [
      { html: 'A little too <b>flat</b> (less than 75°): move the foot <b>closer</b> to the wall.', right: low, why: low ? null : D(rd(th, 0)) + ' is <b>more</b> than 75°: the ladder is a little too steep.', code: 'u7l8-ladder' },
      { html: 'A little too <b>steep</b> (more than 75°): move the foot <b>farther</b> from the wall.', right: !low, why: !low ? null : D(rd(th, 0)) + ' is <b>less</b> than 75°: the ladder is a little too flat.', code: 'u7l8-ladder' },
      { html: 'A little too flat: move the foot <b>farther</b> from the wall.', why: 'Moving the foot farther out makes the ladder <b>flatter</b>, not steeper.', code: 'u7l8-ladder-dir' },
      { html: 'A little too steep: move the foot <b>closer</b> to the wall.', why: 'Moving the foot closer makes the ladder <b>steeper</b>.', code: 'u7l8-ladder-dir' }],
      D(rd(th, 0)) + ' is ' + (low ? 'a little less than 75°, so the ladder is a little too flat. Moving the foot <b>closer</b> to the wall makes it steeper.' : 'a little more than 75°, so the ladder is a little too steep. Moving the foot <b>farther</b> from the wall makes it flatter.'), ['Picture the ladder: what happens to the angle if the foot slides toward the wall?'], 'ladder safety', true);
  }

  HW.defineLesson({
    id: 'u7l8', unit: 7, num: '8', title: 'Finding Angles with Inverse Trig Ratios', outcome: 'G4',
    blurb: 'Using sin⁻¹, cos⁻¹ and tan⁻¹ to find an angle from two sides, the other acute angle, quick checks, and angles on the job (ladders, ramps, roofs).',
    questions: [
      { num: '1', stem: 'Find each angle θ to the nearest degree.', parts: [
        { id: '1a', level: 'BEG', make: decRatioPart('sin', 0.12, 0.88, 2) },
        { id: '1b', level: 'BEG', make: decRatioPart('cos', 0.12, 0.88, 2) },
        { id: '1c', level: 'BEG', make: decRatioPart('tan', 0.3, 1.6, 2) },
        { id: '1d', level: 'BEG', make: decRatioPart('sin', 0.9, 0.99, 3) },
        { id: '1e', level: 'BEG', make: decRatioPart('cos', 0.05, 0.3, 3) },
        { id: '1f', level: 'BEG', make: decRatioPart('tan', 2.6, 7.5, 2) }] },
      { num: '2', stem: 'Find each angle to the nearest degree. Type the whole fraction.', parts: [
        { id: '2a', level: 'BEG', make: fracPart('sin', 'A', { den: [5, 13], mid: true }) },
        { id: '2b', level: 'BEG', make: fracPart('cos', 'B', { den: [7, 20], mid: true }) },
        { id: '2c', level: 'BEG', make: fracPart('tan', 'C', { den: [3, 9], big: true, num: 20 }) },
        { id: '2d', level: 'BEG', make: fracPart('tan', 'D', { den: [7, 15] }) }] },
      { num: '3', stem: 'For each triangle, label the two given sides opp, adj or hyp from θ, choose the ratio, and find θ to the nearest degree.', parts: [
        { id: '3a', level: 'EMG', make: sideAnglePart('tan', { u: 'cm', gen: function (r) { var a = r.int(5, 12); return { adj: a, opp: r.int(2, a - 1) }; }, not: [[9, 5]] }) },
        { id: '3b', level: 'EMG', make: sideAnglePart('cos', { u: 'm', gen: function (r) { var h = pickR(r, [8, 16, 0.5]); return { hyp: h, adj: pickR(r, [Math.ceil(h * 0.55), h - 1, 0.5]) }; }, not: [[8.5, 11]] }) },
        { id: '3c', level: 'EMG', make: sideAnglePart('sin', { u: 'cm', gen: function (r) { var h = pickR(r, [6, 12, 0.1]); return { hyp: h, opp: pickR(r, [Math.ceil(h * 0.3), h - 1, 0.1]) }; }, not: [[7, 12]] }) },
        { id: '3d', level: 'EMG', make: sideAnglePart('tan', { u: 'ft', gen: function (r) { var a = r.int(6, 14); return { adj: a, opp: r.int(a + 2, a + 9) }; }, not: [[6, 11]] }) }] },
      { num: '4', stem: 'One acute angle of a right triangle is given. Find the other acute angle.', parts: [
        { id: '4a', level: 'LIM', make: function (r) { var a = find(function () { return r.int(15, 44); }, function (x) { return x !== 28; }); return angX(D(a), 90 - a, { alts: otherAlts(a), sol: t('90^\\circ-' + dg(a) + '=' + dg(90 - a)), hints: ['The two acute angles add to 90°.'], text: 'other acute angle' }); } },
        { id: '4b', level: 'LIM', make: function (r) { var a = find(function () { return r.int(52, 84); }, function (x) { return x !== 62; }); return angX(D(a), 90 - a, { alts: otherAlts(a), sol: t('90^\\circ-' + dg(a) + '=' + dg(90 - a)), hints: ['The two acute angles add to 90°.'], text: 'other acute angle' }); } },
        { id: '4c', level: 'BEG', make: function (r) { var a = q(r.int(10, 40) + 0.5); return angX(D(a), q(90 - a), { alts: otherAlts(a), sol: t('90^\\circ-' + dg(a) + '=' + dg(q(90 - a))), hints: ['Subtract from 90°. Keep the decimal.'], text: 'other acute angle (decimal)' }); } }] },
      { num: '5', stem: function (sh) { return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('a=' + N(sh.a)) + ' cm and the hypotenuse ' + t('c=' + N(sh.c)) + ' cm.' + triFig(null, { opp: sh.a, adj: Math.sqrt(sh.c * sh.c - sh.a * sh.a) }, { opp: 'a = ' + lab(sh.a, 'cm'), hyp: 'c = ' + lab(sh.c, 'cm') }, { names: ['A', 'B', 'C'], thetaLabel: ' ', width: 230 }); },
        shared: function (r) { return find(function () { var c = r.int(8, 16); return { c: c, a: pickR(r, [Math.ceil(c * 0.4), c - 1, 0.5]) }; }, function (s) { s.A = INV.sin(s.a / s.c); s.B = 90 - s.A; return safe(s.A, 0) && Math.abs(s.A - 45) > 1.5 && Math.abs(s.a / s.c - 0.5) > 1e-9 && !(s.a === 6.2 && s.c === 14.5); }); },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { return angP('Find ' + t('\\angle A') + '.', sh.A, { ratio: { fn: 'sin', num: sh.a, den: sh.c },
            sol: br(['From A: a is <b>opp</b> and c is <b>hyp</b>: sin.', t('\\angle A=' + inT('sin', sh.a, sh.c) + '=' + dots(sh.A, 2) + '\\approx ' + dg(rd(sh.A, 0)))]), hints: ['Which side is across from ∠A? Which is the hypotenuse?'], text: '∠A from a and c' }); } },
          { id: '5b', level: 'BEG', make: function (r, sh) { return angX('Find ' + t('\\angle B') + ' by subtracting.', rd(sh.B, 0), { okv: [90 - rd(sh.A, 0)], alts: otherAlts(rd(sh.A, 0)),
            sol: t('\\angle B=90^\\circ-' + fx(sh.A, 2) + '^\\circ=' + fx(sh.B, 2) + '^\\circ\\approx ' + dg(rd(sh.B, 0))), hints: ['The two acute angles add to 90°.'], text: '∠B by subtracting' }); } },
          { id: '5c', level: 'EMG', make: function (r, sh) {
            var fr = '\\dfrac{' + N(sh.a) + '}{' + N(sh.c) + '}', frU = '\\dfrac{' + N(sh.c) + '}{' + N(sh.a) + '}';
            return P.mc(r, 'Which ratio checks ' + t('\\angle B') + ' from B’s point of view?', [
              { html: t('\\angle B=\\cos^{-1}\\!\\left(' + fr + '\\right)'), right: true },
              { html: t('\\angle B=\\sin^{-1}\\!\\left(' + fr + '\\right)'), why: 'That is ∠A again. From B, side a <b>touches</b> B: it is the <b>adj</b>, so use cos.', code: 'u7l8-ratio-mc' },
              { html: t('\\angle B=\\tan^{-1}\\!\\left(' + fr + '\\right)'), why: 'c is the hypotenuse, so tan (opp ÷ adj) does not use it.', code: 'u7l8-ratio-mc' },
              { html: t('\\angle B=\\cos^{-1}\\!\\left(' + frU + '\\right)'), why: 'The hypotenuse goes on the <b>bottom</b> (that one gives ERROR).', code: 'u7l8-ratio-mc' }],
              'From B: a is <b>adj</b> (it touches B) and c is <b>hyp</b>: cos.<br>' + t('\\angle B=\\cos^{-1}\\!\\left(' + fr + '\\right)=' + dots(INV.cos(sh.a / sh.c), 2) + '\\approx ' + dg(rd(sh.B, 0))) + ' ✓', ['When you move to the other angle, opp and adj swap.'], 'check ∠B with a ratio');
          } }] },
      { num: '6', stem: function (sh) { return 'A right triangle has sides ' + L(sh.t[0], 'cm') + ', ' + L(sh.t[1], 'cm') + ' and ' + L(sh.t[2], 'cm') + '. Let θ be the angle across from the ' + L(sh.t[0], 'cm') + ' side.'; },
        shared: function (r) { var T = r.pick([[9, 40, 41], [20, 21, 29], [12, 35, 37], [11, 60, 61], [5, 12, 13], [28, 45, 53], [33, 56, 65], [13, 84, 85], [7, 24, 25], [36, 77, 85]]); var k = r.chance(0.3) ? [T[1], T[0], T[2]] : T; return { t: k, th: INV.tan(k[0] / k[1]) }; },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return angP('Find θ with the tangent ratio.', sh.th, { ratio: { fn: 'tan', num: sh.t[0], den: sh.t[1] },
            sol: br(['opp = ' + sh.t[0] + ', adj = ' + sh.t[1] + ' (the hypotenuse is the longest side, ' + sh.t[2] + ').', t('\\theta=' + inT('tan', sh.t[0], sh.t[1]) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0)))]), hints: ['The longest side is the hypotenuse. The side across from θ is opp.'], text: 'θ with tan' }); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { return angP('Find θ again with the sine ratio. (You should get the same angle.)', sh.th, { ratio: { fn: 'sin', num: sh.t[0], den: sh.t[2] },
            sol: br(['opp = ' + sh.t[0] + ', hyp = ' + sh.t[2] + '.', t('\\theta=' + inT('sin', sh.t[0], sh.t[2]) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0))), 'Yes, the same angle ✓']), hints: ['sin θ = opp ÷ hyp.'], text: 'θ with sin (check)' }); } },
          { id: '6c', level: 'BEG', make: function (r, sh) { return angX('Find the third angle of the triangle (not the right angle).', rd(90 - sh.th, 0), { okv: [90 - rd(sh.th, 0)], alts: otherAlts(rd(sh.th, 0)),
            sol: t('90^\\circ-' + fx(sh.th, 2) + '^\\circ=' + fx(90 - sh.th, 2) + '^\\circ\\approx ' + dg(rd(90 - sh.th, 0))) + ' (the other angle is the 90° angle).', hints: ['The two acute angles add to 90°.'], text: 'third angle' }); } }] },
      { num: '7', stem: '', shared: benchShared, parts: [
        { id: '7abcd', sub: 'a–d', level: 'EMG', make: benchGrid },
        { id: '7ca', sub: 'check a', level: 'BEG', make: function (r, sh) { var th = INV.tan(sh.a.p / sh.a.q); return angP('Check (a) with a calculator: ' + t('\\tan\\theta=\\dfrac{' + sh.a.p + '}{' + sh.a.q + '}') + '. Find θ to the nearest degree.', th, { ratio: { fn: 'tan', num: sh.a.p, den: sh.a.q }, sol: t('\\theta=' + inT('tan', sh.a.p, sh.a.q) + '=' + dots(th, 2) + '\\approx ' + dg(rd(th, 0))), hints: ['2nd tan ' + sh.a.p + ' ÷ ' + sh.a.q + ' ) ENTER'], text: 'check (a)' }); } },
        { id: '7cb', sub: 'check b', level: 'BEG', make: function (r, sh) { var th = INV.tan(sh.b.o / sh.b.a); return angP('Check (b) with a calculator: opp = ' + L(sh.b.o) + ', adj = ' + L(sh.b.a) + '. Find θ to the nearest degree.', th, { ratio: { fn: 'tan', num: sh.b.o, den: sh.b.a }, sol: t('\\theta=' + inT('tan', sh.b.o, sh.b.a) + '=' + dots(th, 2) + '\\approx ' + dg(rd(th, 0))), hints: ['Opp and adj: tan.'], text: 'check (b)' }); } }] },
      { num: '8', stem: function (sh) { return 'A right triangle has opp = ' + L(sh.o) + ' and hyp = ' + L(sh.h) + ' from angle θ.'; },
        shared: function (r) { return find(function () { var o = r.int(5, 13); return { o: o, h: r.int(o + 3, o + 9) }; }, function (s) { s.th = INV.sin(s.o / s.h); return safe(s.th, 0) && Math.abs(s.th - 30) > 1 && s.th < 65; }); },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) {
            var p = person(r);
            return P.mc(r, p.n + ' pressed 2nd sin ' + sh.h + ' ÷ ' + sh.o + ' ) ENTER and got ERROR. What did ' + p.he + ' do wrong?', [
              { html: cap(p.he) + ' put the hypotenuse on top. ' + t(sh.h + '\\div ' + sh.o) + ' is more than 1, and no angle has a sine more than 1.', right: true },
              { html: cap(p.his) + ' calculator is in RAD mode.', why: 'RAD mode gives a small number, not ERROR. Look at the fraction: which side is on top?', code: 'u7l8-err-rad' },
              { html: cap(p.he) + ' should have used cos.', why: 'Opp and hyp go with sin. The problem is the order of the two numbers.', code: 'u7l8-err-ratio' },
              { html: cap(p.he) + ' forgot to press 2nd.', why: cap(p.he) + ' did press 2nd. Check the fraction: ' + t(sh.h + '\\div ' + sh.o) + ' is more than 1.', code: 'u7l8-err-2nd' }],
              cap(p.he) + ' put the hyp on top. ' + t(sh.h + '\\div ' + sh.o + '>1') + ', and a sine is never more than 1 (the hypotenuse is the longest side), so the calculator shows ERROR.', ['Is ' + sh.h + ' ÷ ' + sh.o + ' more or less than 1?'], 'ERROR: hyp on top', true);
          } },
          { id: '8b', level: 'EMG', make: function (r, sh) {
            var p = person(r), radv = Math.asin(sh.o / sh.h);
            return P.mc(r, p.n + ' typed the correct keys but got ' + radv.toFixed(4) + '. What is wrong?', [
              { html: cap(p.his) + ' calculator is in RAD mode. (' + radv.toFixed(1) + ' is far too small for an angle in this triangle.)', right: true },
              { html: cap(p.he) + ' put the hypotenuse on top.', why: 'That gives ERROR, not a small number.', code: 'u7l8-rad-hyp' },
              { html: 'Nothing: the angle is about ' + D(rd(radv, 1)) + '.', why: 'Opp is ' + Math.round(sh.o / sh.h * 100) + '% of the hyp, so the angle can’t be that tiny. Check the mode.', code: 'u7l8-rad-fine' },
              { html: cap(p.he) + ' should have used tan.', why: 'Opp and hyp go with sin, and tan would not give a number that small. Check the mode.', code: 'u7l8-rad-ratio' }],
              'The calculator is in <b>RAD</b> mode. Press DRG, choose DEG, and press ENTER.', ['Could an angle in this triangle really be less than 1°?'], 'RAD mode', true);
          } },
          { id: '8c', level: 'BEG', make: function (r, sh) { return angP('Find θ correctly, to the nearest degree.', sh.th, { ratio: { fn: 'sin', num: sh.o, den: sh.h }, sol: t('\\theta=' + inT('sin', sh.o, sh.h) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0))), hints: ['Opp on top, hyp on the bottom, in DEG mode.'], text: 'θ with sin' }); } }] },
      { num: '9', stem: function (sh) { return sh.p.n + ' leans a ' + L(sh.L) + ' ladder against a house. The foot of the ladder is ' + L(sh.d) + ' from the wall.'; },
        shared: function (r) { return find(function () { return { p: person(r), L: pickR(r, [5, 9, 0.1]), d: pickR(r, [1.1, 2.6, 0.1]) }; }, function (s) { s.th = INV.cos(s.d / s.L); s.x = s.L * TRG.cos(75); return safe(s.th, 0) && Math.abs(rd(s.th, 0) - 75) >= 2 && Math.abs(s.th - 75) < 9 && safe(s.x, 1) && !(s.L === 6 && s.d === 1.5); }); },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { return angP('What angle does the ladder make with the ground, to the nearest degree?', sh.th, { ratio: { fn: 'cos', num: sh.d, den: sh.L },
            sol: triFig(null, { opp: Math.sqrt(sh.L * sh.L - sh.d * sh.d), adj: sh.d }, { adj: lab(sh.d), hyp: lab(sh.L) }, { right: 'br', roles: ['adj', 'hyp'], width: 160 }) + br([N(sh.d) + ' m is <b>adj</b> (along the ground), the ladder ' + N(sh.L) + ' m is the <b>hyp</b>: cos.', t('\\theta=' + inT('cos', sh.d, sh.L) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0)))]),
            hints: ['The ladder is the hypotenuse; the ground distance touches the angle.'], text: 'ladder angle' }); } },
          { id: '9b', level: 'PRG', make: function (r, sh) { return ladderMC(r, sh.th); } },
          { id: '9c', level: 'ADV', make: function (r, sh) { return lenP('<b>Challenge:</b> How far from the wall should the foot be for an angle of exactly ' + D(75) + '? Round to the nearest tenth of a metre.', sh.x, { trig: { fn: 'cos', deg: 75, side: sh.L, op: 'mul' },
            sol: br([t('\\cos 75^\\circ=\\dfrac{x}{' + N(sh.L) + '}'), t('x=' + N(sh.L) + '\\times\\cos 75^\\circ=' + dots(sh.x, 3) + '\\approx ' + fx(sh.x, 1) + '\\text{ m}')]), hints: ['Now you know the angle (75°) and the hyp. Which ratio gives the adj?', 'x is on top: multiply.'], text: 'ladder foot for 75°' }); } }] },
      { num: '10', stem: 'Two wheelchair ramps are being checked. Find each angle to the nearest tenth of a degree.',
        shared: function (r) {
          var A = find(function () { return { h: pickR(r, [0.3, 0.6, 0.05]), d: pickR(r, [3.5, 8, 0.1]) }; }, function (s) { s.th = INV.tan(s.h / s.d); return safe(s.th, 1) && s.th > 3.2 && s.th < 6.5 && Math.abs(rd(s.th, 1) - 4.8) >= 0.2; });
          var B = find(function () { return { h: pickR(r, [0.3, 0.6, 0.05]), L: pickR(r, [3.5, 8, 0.1]) }; }, function (s) { s.th = INV.sin(s.h / s.L); return safe(s.th, 1) && s.th > 3.2 && s.th < 6.5 && Math.abs(rd(s.th, 1) - 4.8) >= 0.2 && !(s.h === 0.6 && s.L === 8); });
          return { A: A, B: B };
        },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { var A = sh.A; return angP('Ramp A rises ' + L(A.h) + ' over a <b>horizontal</b> distance of ' + L(A.d) + '.', A.th, { dp: 1, ratio: { fn: 'tan', num: A.h, den: A.d }, complementTrap: false,
            sol: br(['opp = ' + N(A.h) + ', adj = ' + N(A.d) + ' (along the ground): tan.', t(inT('tan', A.h, A.d) + '=' + dots(A.th, 2) + '\\approx ' + fx(A.th, 1) + '^\\circ')]), hints: ['The horizontal distance is a leg (adj), not the ramp surface.', 'Round to the nearest tenth of a degree.'], text: 'ramp A (tan)' }); } },
          { id: '10b', level: 'EMG', make: function (r, sh) { var B = sh.B; return angP('Ramp B rises ' + L(B.h) + ', and the ramp <b>surface</b> is ' + L(B.L) + ' long.', B.th, { dp: 1, ratio: { fn: 'sin', num: B.h, den: B.L }, complementTrap: false,
            sol: br(['opp = ' + N(B.h) + ', hyp = ' + N(B.L) + ' (the sloping surface): sin.', t(inT('sin', B.h, B.L) + '=' + dots(B.th, 2) + '\\approx ' + fx(B.th, 1) + '^\\circ')]), hints: ['The ramp surface is the hypotenuse.', 'Round to the nearest tenth of a degree.'], text: 'ramp B (sin)' }); } },
          { id: '10c', level: 'BEG', make: rampMC }] },
      { num: '11', stem: 'A roofer uses pitch to describe how steep a roof is. A pitch of rise/12 means the roof rises that many inches for every 12 inches across.',
        shared: function (r) { return find(function () { var a = r.pick([2, 3, 4]), d = a * r.pick([3, 4]), b = r.int(a + 1, d - 2), c = r.int(b + 1, d - 1); return [a, b, c, d]; }, function (v) { return v[3] <= 16 && v.every(function (x, i) { var g = INV.tan(x / 12); return v.indexOf(x) === i && x !== 5 && Math.abs(g - Math.floor(g) - 0.5) > 0.02; }); }, [3, 6, 9, 12]); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var degs = sh.map(function (x) { return INV.tan(x / 12); });
            return P.fields('Complete the table: find the angle each roof makes with the horizontal, to the nearest degree.', sh.map(function (x) { return { label: x + '/12:', name: x + '/12', after: '°' }; }),
              sh.map(function (x, i) { return angP('', degs[i], { ratio: { fn: 'tan', num: x, den: 12 }, early: false }).check; }), degs.map(function (d) { return String(rd(d, 0)); }),
              sh.map(function (x, i) { return x + '/12 → ' + D(rd(degs[i], 0)); }).join(' &nbsp; '),
              br(['The pitch is opp ÷ adj (rise ÷ run): tan.'].concat(sh.map(function (x, i) { return t(inT('tan', x, 12) + (x === 12 ? '=45^\\circ' : '=' + dots(degs[i], 2) + '\\approx ' + dg(rd(degs[i], 0)))); }))), ['Rise is opp, 12 is adj: θ = tan⁻¹(rise ÷ 12).'], 'pitch table');
          } },
          { id: '11b', level: 'PRG', make: function (r, sh) {
            var a = sh[0], d = sh[3], k = d / a, A = rd(INV.tan(a / 12), 0), B = rd(INV.tan(d / 12), 0), p = person(r);
            return P.mc(r, p.n + ' says, “A ' + d + '/12 roof is ' + k + ' times as steep as a ' + a + '/12 roof, so its angle is ' + k + ' times as big.” Is ' + p.he + ' right? Use the table.', [
              { html: 'No. ' + t(k + '\\times ' + dg(A) + '=' + dg(k * A)) + ', but a ' + d + '/12 roof is only ' + D(B) + '. The angle does not grow at the same rate as the pitch.', right: true },
              { html: 'Yes. The rise is ' + k + ' times as big, so the angle is ' + k + ' times as big.', why: 'Check the table: ' + k + ' × ' + A + '° = ' + (k * A) + '°, but the table says ' + B + '°.', code: 'u7l8-pitch-yes' },
              { html: 'No. The angle is exactly half of ' + k + ' times as big.', why: 'There is no simple rule: compare ' + B + '° with ' + A + '° in the table.', code: 'u7l8-pitch-half' },
              { html: 'Yes, but only for roofs steeper than 45°.', why: 'Check the table: the angles do not multiply like the rises.', code: 'u7l8-pitch-45' }],
              t(k + '\\times ' + dg(A) + '=' + dg(k * A)) + ', but the table shows ' + D(B) + ' for ' + d + '/12. So ' + p.he + ' is wrong: the angle does not grow at the same rate as the pitch.', ['Multiply the small angle by ' + k + ' and compare with the table.'], 'pitch is not proportional to angle');
          } }] },
      { num: '12', stem: 'Find each angle of depression to the nearest degree. Sketch it first.', parts: [
        { id: '12a', level: 'PRG', make: function (r) {
          var s = find(function () { return { L: 10 * r.int(8, 20), h: r.int(10, 40) }; }, function (s) { s.th = INV.sin(s.h / s.L); return safe(s.th, 0) && s.th > 4 && s.th < 25; });
          return angP('A zipline cable is ' + L(s.L) + ' long. The bottom end is ' + L(s.h) + ' lower than the top end. Find the angle of depression of the cable at the top.', s.th, { ratio: { fn: 'sin', num: s.h, den: s.L },
            sol: triFig(null, { opp: s.h, adj: Math.sqrt(s.L * s.L - s.h * s.h) }, { opp: lab(s.h), hyp: lab(s.L) }, { right: 'br', roles: ['opp', 'hyp'], width: 260 }) + br(['The angle of depression at the top equals the angle of elevation at the bottom.', N(s.h) + ' m is <b>opp</b>, the cable ' + N(s.L) + ' m is the <b>hyp</b>: sin.', t(inT('sin', s.h, s.L) + '=' + dots(s.th, 2) + '\\approx ' + dg(rd(s.th, 0)))]),
            hints: ['The cable is the hypotenuse; the drop is opposite the angle at the bottom.'], text: 'zipline angle of depression' });
        } },
        { id: '12b', level: 'PRG', make: function (r) {
          var s = find(function () { return { h: r.int(25, 60), d: 10 * r.int(15, 50) }; }, function (s) { s.th = INV.tan(s.h / s.d); return safe(s.th, 0) && !(s.h === 90 && s.d === 140); });
          return angP('A lighthouse keeper’s window is ' + L(s.h) + ' above the water. She sees a boat that is ' + L(s.d) + ' from the base of the lighthouse. Find the angle of depression to the boat.', s.th, { ratio: { fn: 'tan', num: s.h, den: s.d },
            sol: br(['Angle of depression = angle of elevation from the boat (alternate interior angles).', 'opp = ' + N(s.h) + ', adj = ' + N(s.d) + ': tan.', t(inT('tan', s.h, s.d) + '=' + dots(s.th, 2) + '\\approx ' + dg(rd(s.th, 0)))]),
            hints: ['Move the angle down to the boat.', 'Height and ground distance: opp and adj.'], text: 'lighthouse angle of depression' });
        } }] },
      { num: '13', stem: function (sh) { return 'A guy wire is attached to a radio tower ' + L(sh.h) + ' above the ground. It is anchored to the ground ' + L(sh.d) + ' from the base of the tower.'; },
        shared: function (r) { return find(function () { return { h: r.int(18, 45), d: r.int(8, 22) }; }, function (s) { s.th = INV.tan(s.h / s.d); return safe(s.th, 0) && s.th > 50 && s.th < 80; }); },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) { return angP('Find the angle between the wire and the ground.', sh.th, { ratio: { fn: 'tan', num: sh.h, den: sh.d },
            sol: br(['opp = ' + sh.h + ' (the tower), adj = ' + sh.d + ' (the ground): tan.', t(inT('tan', sh.h, sh.d) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0)))]), hints: ['From the anchor: the tower height is opp, the ground distance is adj.'], text: 'guy wire with the ground' }); } },
          { id: '13b', level: 'BEG', make: function (r, sh) { return angX('Find the angle between the wire and the tower.', rd(90 - sh.th, 0), { okv: [90 - rd(sh.th, 0)], alts: otherAlts(rd(sh.th, 0)),
            sol: t('90^\\circ-' + fx(sh.th, 2) + '^\\circ=' + fx(90 - sh.th, 2) + '^\\circ\\approx ' + dg(rd(90 - sh.th, 0))), hints: ['The tower, the ground and the wire make a right triangle: the two acute angles add to 90°.'], text: 'guy wire with the tower' }); } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var s = find(function () { return { km: pickR(r, [0.8, 2.5, 0.1]), h: 10 * r.int(15, 60) }; }, function (s) { s.th = INV.sin(s.h / (s.km * 1000)); return safe(s.th, 0) && s.th > 6 && s.th < 35; });
          return angP('A ski run at a hill near Calgary is ' + L(s.km, 'km') + ' long, measured along the slope. From top to bottom, it drops ' + L(s.h) + '. Find the angle of the slope to the nearest degree. <b>Hint:</b> use the same units for both lengths.', s.th, { ratio: { fn: 'sin', num: s.h, den: s.km * 1000 },
            alts: [{ v: INV.sin(s.h / (s.km * 100)), code: 'u7l8-unit', hint: '1 km = <b>1000</b> m (not 100).' }, { v: INV.tan(s.h / (s.km * 1000)), code: 'trig-wrong-ratio', hint: 'The run is measured along the slope: it is the <b>hyp</b>. Use sin.' }],
            sol: br([N(s.km) + ' km = ' + N(s.km * 1000) + ' m.', 'The drop ' + N(s.h) + ' m is <b>opp</b>, the run ' + N(s.km * 1000) + ' m is the <b>hyp</b>: sin.', t('\\theta=' + inT('sin', s.h, s.km * 1000) + '=' + dots(s.th, 2) + '\\approx ' + dg(rd(s.th, 0)))]),
            hints: ['Change km to m first (× 1000).', 'Along the slope = the hypotenuse.'], text: 'ski run (km and m)' });
        } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var s = find(function () { return { o: r.int(2, 9), a: r.int(4, 14) }; }, function (s) { s.v = [INV.tan(s.o / s.a), INV.tan(s.a / s.o), INV.sin(s.o / s.a), INV.cos(s.o / s.a)].map(function (x) { return rd(x, 0); }); return s.o < s.a && gcd(s.o, s.a) === 1 && s.v.every(function (x, i) { return s.v.indexOf(x) === i; }) && safe(INV.tan(s.o / s.a), 0) && !(s.o === 6 && s.a === 11); });
          return P.mc(r, 'In a right triangle, the leg opposite θ is ' + L(s.o, 'cm') + ' and the leg adjacent to θ is ' + L(s.a, 'cm') + '. To the nearest degree, θ is', [
            { html: D(s.v[0]), right: true }, { html: D(s.v[1]), why: 'That is ' + t(inT('tan', s.a, s.o)) + ': upside down. Opp goes on top.', code: 'u7l8-upside' },
            { html: D(s.v[2]), why: 'That uses sin, but ' + s.a + ' cm is a leg, not the hypotenuse.', code: 'u7l8-ratio-mc' }, { html: D(s.v[3]), why: 'That uses cos, but ' + s.a + ' cm is a leg, not the hypotenuse.', code: 'u7l8-ratio-mc' }],
            'Two legs (opp and adj): tan. ' + t('\\theta=' + inT('tan', s.o, s.a) + '=' + dots(INV.tan(s.o / s.a), 2) + '\\approx ' + dg(s.v[0])), ['Two legs → tan.'], 'MC θ from two legs');
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var v = pickR(r, [1.1, 1.9, 0.1]), fn = r.pick(['cos', 'sin']), p = person(r), side = fn === 'cos' ? 'adjacent side' : 'opposite side';
          return P.mc(r, p.n + ' tries to find an angle and types 2nd ' + fn + ' ' + N(v) + ' ) ENTER. The calculator shows ERROR. The most likely mistake is that ' + p.he, [
            { html: 'has ' + p.his + ' calculator in RAD mode', why: 'RAD mode does not cause an ERROR here. Look at the number: ' + N(v) + ' is more than 1.', code: 'u7l8-err-rad' },
            { html: 'divided the hypotenuse by the ' + side + ' instead of the ' + side + ' by the hypotenuse', right: true },
            { html: 'should have pressed 2nd tan instead', why: 'The real problem is the number ' + N(v) + ': a ' + (fn === 'cos' ? 'cosine' : 'sine') + ' is never more than 1.', code: 'u7l8-err-ratio' },
            { html: 'is looking for an angle bigger than 90°', why: 'In a right triangle the acute angles are less than 90°. The problem is the ratio: it is more than 1.', code: 'u7l8-err-90' }],
            'A ' + (fn === 'cos' ? 'cosine (adj ÷ hyp)' : 'sine (opp ÷ hyp)') + ' is always less than 1, because the hypotenuse is the longest side. ' + N(v) + ' means ' + p.he + ' divided hyp ÷ ' + (fn === 'cos' ? 'adj' : 'opp') + '.', ['Can a ' + (fn === 'cos' ? 'cosine' : 'sine') + ' be more than 1?'], 'MC ERROR', true);
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'PRG', make: function (r) {
          var s = find(function () { return { L: pickR(r, [2.2, 4.5, 0.1]), h: pickR(r, [0.15, 0.4, 0.05]) }; }, function (s) { s.th = INV.sin(s.h / s.L); return safe(s.th, 1) && s.th > 2.5 && s.th < 8; });
          return angP('A ramp into a moving truck is ' + L(s.L) + ' long and rises ' + L(s.h) + '. The angle between the ramp and the ground, to the nearest tenth of a degree, is ____°.', s.th, { dp: 1, nr: true, ratio: { fn: 'sin', num: s.h, den: s.L }, complementTrap: false,
            sol: br([N(s.h) + ' is <b>opp</b>, ' + N(s.L) + ' (the ramp) is the <b>hyp</b>: sin.', t(inT('sin', s.h, s.L) + '=' + dots(s.th, 2) + '\\approx ' + fx(s.th, 1) + '^\\circ')]), hints: ['The ramp itself is the hypotenuse.'], text: 'NR truck ramp' });
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'PRG', make: function (r) {
          var s = find(function () { return { L: r.int(35, 90), d: r.int(15, 60) }; }, function (s) { s.th = INV.cos(s.d / s.L); return s.d < s.L * 0.85 && safe(s.th, 0) && s.th > 25; }), p = person(r);
          return angP(p.n + ' flies a kite on a ' + L(s.L) + ' string. The kite is directly above a point on the ground ' + L(s.d) + ' away from ' + (p.he === 'she' ? 'her' : 'him') + '. The angle between the string and the ground, to the nearest degree, is ____°.', s.th, { nr: true, ratio: { fn: 'cos', num: s.d, den: s.L },
            sol: br([N(s.d) + ' is <b>adj</b>, the string ' + N(s.L) + ' is the <b>hyp</b>: cos.', t(inT('cos', s.d, s.L) + '=' + dots(s.th, 2) + '\\approx ' + dg(rd(s.th, 0)))]), hints: ['The string is the hypotenuse; the ground distance touches the angle.'], text: 'NR kite angle' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find each angle θ to the nearest degree.', parts: [
        { id: 'A1a', level: 'BEG', make: decRatioPart('sin', 0.1, 0.4, 2) },
        { id: 'A1b', level: 'BEG', make: decRatioPart('cos', 0.4, 0.8, 2) },
        { id: 'A1c', level: 'BEG', make: decRatioPart('tan', 1.2, 3.5, 2) },
        { id: 'A1d', level: 'BEG', make: decRatioPart('cos', 0.9, 0.985, 3) }] },
      { num: '2', stem: 'Find each angle to the nearest degree.', parts: [
        { id: 'A2a', level: 'BEG', make: fracPart('sin', 'E', { den: [7, 15], mid: true }) },
        { id: 'A2b', level: 'BEG', make: fracPart('cos', 'F', { den: [9, 25], mid: true }) },
        { id: 'A2c', level: 'BEG', make: fracPart('tan', 'G', { den: [3, 8], big: true, num: 24 }) }] },
      { num: '3', stem: 'Label the two given sides opp, adj or hyp from θ. Then find θ to the nearest degree.', parts: [
        { id: 'A3a', level: 'EMG', make: sideAnglePart('sin', { u: 'm', gen: function (r) { var h = r.int(10, 24); return { hyp: h, opp: r.int(Math.ceil(h * 0.3), h - 2) }; }, not: [[7, 12]] }) },
        { id: 'A3b', level: 'EMG', make: sideAnglePart('tan', { u: 'cm', gen: function (r) { var a = pickR(r, [3, 8, 0.5]); return { adj: a, opp: pickR(r, [a + 1, a + 5, 0.5]) }; }, not: [[9, 5]] }) },
        { id: 'A3c', level: 'EMG', make: sideAnglePart('cos', { u: 'ft', gen: function (r) { var h = r.int(15, 32); return { hyp: h, adj: r.int(Math.ceil(h * 0.45), h - 2) }; }, not: [[8.5, 11]] }) }] },
      { num: '4', stem: 'One acute angle of a right triangle is given. Find the other acute angle.', parts: [
        { id: 'A4a', level: 'LIM', make: function (r) { var a = find(function () { return r.int(14, 76); }, function (x) { return notIn(x, [28, 62, 45]); }); return angX(D(a), 90 - a, { alts: otherAlts(a), sol: t('90^\\circ-' + dg(a) + '=' + dg(90 - a)), hints: ['The two acute angles add to 90°.'], text: 'EP other acute angle' }); } },
        { id: 'A4b', level: 'BEG', make: function (r) { var a = q(r.int(300, 800) / 10); if (Math.abs(a - Math.round(a)) < 1e-9) a = q(a + 0.3); return angX(D(a), q(90 - a), { alts: otherAlts(a), sol: t('90^\\circ-' + dg(a) + '=' + dg(q(90 - a))), hints: ['Subtract from 90°. Keep the decimal.'], text: 'EP other acute angle (decimal)' }); } }] },
      { num: '5', stem: function (sh) { return 'In ' + t('\\triangle DEF') + ', ' + t('\\angle F=90^\\circ') + ', ' + t('DF=' + sh.t[1]) + ' cm, ' + t('EF=' + sh.t[0]) + ' cm and ' + t('DE=' + sh.t[2]) + ' cm.'; },
        shared: function (r) { var T = r.pick([[20, 21, 29], [21, 20, 29], [9, 12, 15], [12, 9, 15], [24, 32, 40], [33, 56, 65], [56, 33, 65], [12, 16, 20], [16, 12, 20]]); return { t: T, D: INV.tan(T[0] / T[1]) }; },
        parts: [
          { id: 'A5a', level: 'EMG', make: function (r, sh) { return angP('Find ' + t('\\angle D') + ' with the tangent ratio.', sh.D, { ratio: { fn: 'tan', num: sh.t[0], den: sh.t[1] },
            sol: br(['From D: opp = EF = ' + sh.t[0] + ', adj = DF = ' + sh.t[1] + '.', t('\\angle D=' + inT('tan', sh.t[0], sh.t[1]) + '=' + dots(sh.D, 2) + '\\approx ' + dg(rd(sh.D, 0)))]), hints: ['EF does not touch D: it is opp. DF touches D: it is adj.'], text: 'EP ∠D with tan' }); } },
          { id: 'A5b', level: 'EMG', make: function (r, sh) { return angP('Check ' + t('\\angle D') + ' with the sine ratio.', sh.D, { ratio: { fn: 'sin', num: sh.t[0], den: sh.t[2] },
            sol: br(['opp = ' + sh.t[0] + ', hyp = DE = ' + sh.t[2] + '.', t('\\angle D=' + inT('sin', sh.t[0], sh.t[2]) + '=' + dots(sh.D, 2) + '\\approx ' + dg(rd(sh.D, 0))) + ' ✓']), hints: ['DE is across from the right angle: the hyp.'], text: 'EP ∠D with sin' }); } },
          { id: 'A5c', level: 'BEG', make: function (r, sh) { return angX('Find ' + t('\\angle E') + '.', rd(90 - sh.D, 0), { okv: [90 - rd(sh.D, 0)], alts: otherAlts(rd(sh.D, 0)),
            sol: t('\\angle E=90^\\circ-' + fx(sh.D, 2) + '^\\circ=' + fx(90 - sh.D, 2) + '^\\circ\\approx ' + dg(rd(90 - sh.D, 0))), hints: ['∠D + ∠E = 90°.'], text: 'EP ∠E' }); } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [
        { id: 'B6', level: 'EMG', make: function (r) {
          var s = find(function () { return { L: r.int(30, 60), h: r.int(12, 30) }; }, function (s) { s.th = INV.sin(s.h / s.L); return s.h < s.L * 0.8 && safe(s.th, 0); });
          return angP('A grain auger is ' + L(s.L, 'ft') + ' long. Its top end rests on the edge of a bin ' + L(s.h, 'ft') + ' above the ground. What angle does the auger make with the ground?', s.th, { ratio: { fn: 'sin', num: s.h, den: s.L },
            sol: br([N(s.h) + ' is <b>opp</b>, the auger ' + N(s.L) + ' is the <b>hyp</b>: sin.', t('\\theta=' + inT('sin', s.h, s.L) + '=' + dots(s.th, 2) + '\\approx ' + dg(rd(s.th, 0)))]), hints: ['The auger is the hypotenuse.'], text: 'EP auger' });
        } }] },
      { num: '7', stem: function (sh) { return 'A ' + L(sh.L, 'ft') + ' ladder leans against a barn. Its foot is ' + L(sh.d, 'ft') + ' from the wall.'; },
        shared: function (r) { return find(function () { return { L: r.int(12, 28), d: pickR(r, [2.5, 8, 0.5]) }; }, function (s) { s.th = INV.cos(s.d / s.L); return safe(s.th, 0) && Math.abs(rd(s.th, 0) - 75) >= 2 && Math.abs(s.th - 75) < 9; }); },
        parts: [
          { id: 'B7a', level: 'EMG', make: function (r, sh) { return angP('Find the angle between the ladder and the ground.', sh.th, { ratio: { fn: 'cos', num: sh.d, den: sh.L },
            sol: br([N(sh.d) + ' is <b>adj</b>, ' + N(sh.L) + ' is the <b>hyp</b>: cos.', t('\\theta=' + inT('cos', sh.d, sh.L) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0)))]), hints: ['The ladder is the hypotenuse.'], text: 'EP barn ladder' }); } },
          { id: 'B7b', level: 'PRG', make: function (r, sh) { return ladderMC(r, sh.th); } }] },
      { num: '8', stem: function (sh) { return 'Two staircases are being compared. Stair A: each step rises ' + L(sh.a[0], 'cm') + ' and goes ' + L(sh.a[1], 'cm') + ' forward. Stair B: each step rises ' + L(sh.b[0], 'cm') + ' and goes ' + L(sh.b[1], 'cm') + ' forward.'; },
        shared: function (r) { return find(function () { return { a: [r.int(15, 21), r.int(22, 32)], b: [r.int(15, 21), r.int(22, 32)] }; }, function (s) { s.A = INV.tan(s.a[0] / s.a[1]); s.B = INV.tan(s.b[0] / s.b[1]); return safe(s.A, 0) && safe(s.B, 0) && Math.abs(rd(s.A, 0) - rd(s.B, 0)) >= 3; }); },
        parts: [
          { id: 'B8a', level: 'EMG', make: function (r, sh) {
            var ca = angP('', sh.A, { ratio: { fn: 'tan', num: sh.a[0], den: sh.a[1] } }), cb = angP('', sh.B, { ratio: { fn: 'tan', num: sh.b[0], den: sh.b[1] } });
            return P.fields('Find the angle of each staircase with the floor, to the nearest degree.', [{ label: 'Stair A:', name: 'Stair A', after: '°' }, { label: 'Stair B:', name: 'Stair B', after: '°' }], [ca.check, cb.check], [ca.key, cb.key], 'A ' + D(rd(sh.A, 0)) + ' &nbsp; B ' + D(rd(sh.B, 0)),
              br(['Rise is opp, forward is adj: tan.', 'A: ' + t(inT('tan', sh.a[0], sh.a[1]) + '=' + dots(sh.A, 2) + '\\approx ' + dg(rd(sh.A, 0))), 'B: ' + t(inT('tan', sh.b[0], sh.b[1]) + '=' + dots(sh.B, 2) + '\\approx ' + dg(rd(sh.B, 0)))]), ['Each step is a small right triangle: rise and run are the legs.'], 'EP stair angles');
          } },
          { id: 'B8b', level: 'BEG', make: function (r, sh) { var A = sh.A > sh.B; return P.mc(r, 'Which staircase is steeper?', [{ html: 'Stair A', right: A, why: A ? null : 'The steeper stair has the <b>bigger</b> angle.', code: 'u7l8-steeper' }, { html: 'Stair B', right: !A, why: !A ? null : 'The steeper stair has the <b>bigger</b> angle.', code: 'u7l8-steeper' }],
            'Stair ' + (A ? 'A' : 'B') + ' has the bigger angle (' + D(rd(Math.max(sh.A, sh.B), 0)) + '), so it is steeper.', ['Compare the two angles.'], 'EP steeper stair', true); } }] },
      { num: '9', stem: '', parts: [
        { id: 'B9', level: 'EMG', make: function (r) {
          var s = find(function () { return { L: pickR(r, [2.4, 4.8, 0.1]), h: pickR(r, [1, 2.4, 0.1]) }; }, function (s) { s.th = INV.sin(s.h / s.L); return s.h < s.L * 0.75 && safe(s.th, 0) && s.th > 18; });
          return angP('A playground slide is ' + L(s.L) + ' long. The top of the slide is ' + L(s.h) + ' above the ground. What angle does the slide make with the ground?', s.th, { ratio: { fn: 'sin', num: s.h, den: s.L },
            sol: br([N(s.h) + ' is <b>opp</b>, ' + N(s.L) + ' is the <b>hyp</b>: sin.', t('\\theta=' + inT('sin', s.h, s.L) + '=' + dots(s.th, 2) + '\\approx ' + dg(rd(s.th, 0)))]), hints: ['The slide is the hypotenuse.'], text: 'EP slide' });
        } }] },
      { num: '10', stem: '', parts: [
        { id: 'B10', level: 'PRG', make: function (r) {
          var s = find(function () { return { h: 10 * r.int(8, 25), km: pickR(r, [1.5, 4.5, 0.1]) }; }, function (s) { s.th = INV.tan(s.h / (s.km * 1000)); return safe(s.th, 1) && s.th > 2 && s.th < 5; });
          return angP('A plane is landing at Calgary’s airport. It is ' + L(s.h) + ' above the ground and ' + L(s.km, 'km') + ' (measured along the ground) from the point where it will touch down. Find the angle of descent (the angle of depression from the plane to that point), to the nearest tenth of a degree.', s.th, { dp: 1, complementTrap: false, ratio: { fn: 'tan', num: s.h, den: s.km * 1000 },
            alts: [{ v: INV.tan(s.h / (s.km * 100)), code: 'u7l8-unit', hint: '1 km = <b>1000</b> m.' }],
            sol: br([N(s.km) + ' km = ' + N(s.km * 1000) + ' m. opp = ' + N(s.h) + ', adj = ' + N(s.km * 1000) + ': tan.', t('\\theta=' + inT('tan', s.h, s.km * 1000) + '=' + dots(s.th, 2) + '\\approx ' + fx(s.th, 1) + '^\\circ')]), hints: ['Use the same units: change km to m.', 'Height and ground distance: opp and adj.'], text: 'EP plane descent' });
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'B11', level: 'EMG', make: function (r) {
          var s = find(function () { return { L: pickR(r, [3.5, 7, 0.1]), h: pickR(r, [1, 2.8, 0.1]) }; }, function (s) { s.v = [INV.sin(s.h / s.L), INV.tan(s.h / s.L), INV.cos(s.h / s.L), INV.tan(s.L / s.h)].map(function (x) { return rd(x, 0); }); return s.h < s.L * 0.6 && s.v.every(function (x, i) { return s.v.indexOf(x) === i; }) && safe(INV.sin(s.h / s.L), 0); });
          return P.mc(r, 'A rafter is ' + L(s.L) + ' long and rises ' + L(s.h) + ' from the wall to the peak. To the nearest degree, the angle between the rafter and the horizontal is', [
            { html: D(s.v[1]), why: 'That uses tan, but the rafter (' + N(s.L) + ' m) is the hypotenuse, not a leg.', code: 'u7l8-ratio-mc' }, { html: D(s.v[0]), right: true },
            { html: D(s.v[2]), why: 'That uses cos: the rise is <b>opp</b> to the angle, not adj.', code: 'u7l8-ratio-mc' }, { html: D(s.v[3]), why: 'Upside down, and the rafter is not a leg.', code: 'u7l8-upside' }],
            'The rafter is the hyp, the rise is opp: sin. ' + t(inT('sin', s.h, s.L) + '=' + dots(INV.sin(s.h / s.L), 2) + '\\approx ' + dg(s.v[0])), ['The rafter is the sloping side: the hypotenuse.'], 'EP MC rafter', true);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'B12', level: 'PRG', make: function (r) {
          var s = find(function () { return { h: pickR(r, [0.25, 0.6, 0.05]), d: pickR(r, [3, 8, 0.5]) }; }, function (s) { s.th = INV.tan(s.h / s.d); return safe(s.th, 1) && s.th > 2.5 && s.th < 7; });
          return angP('A wheelchair ramp rises ' + L(s.h) + ' over a horizontal distance of ' + L(s.d) + '. The angle of the ramp, to the nearest tenth of a degree, is ____°.', s.th, { dp: 1, nr: true, complementTrap: false, ratio: { fn: 'tan', num: s.h, den: s.d },
            sol: br(['opp = ' + N(s.h) + ', adj = ' + N(s.d) + ': tan.', t(inT('tan', s.h, s.d) + '=' + dots(s.th, 2) + '\\approx ' + fx(s.th, 1) + '^\\circ') + (rd(s.th, 1) <= 4.8 ? ' (within the guideline of about 4.8°).' : ' (steeper than the guideline of about 4.8°).')]), hints: ['The horizontal distance is a leg: tan.'], text: 'EP NR ramp' });
        } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A homeowner wants a roof that makes an angle of about ' + D(sh.a) + ' with the horizontal. Roofers describe pitch as “rise/12”.'; },
        shared: function (r) { return find(function () { return { a: r.int(18, 42) }; }, function (s) { s.x = 12 * TRG.tan(s.a); s.k = Math.round(s.x); s.chk = INV.tan(s.k / 12); return safe(s.x, 0) && safe(s.chk, 0) && s.k !== 5; }); },
        parts: [
          { id: 'C13a', level: 'MAS', make: function (r, sh) { return lenP('What rise (to the nearest whole inch) gives about ' + D(sh.a) + '?', sh.x, { dp: 0, unit: 'in', trig: { fn: 'tan', deg: sh.a, side: 12, op: 'mul' },
            sol: br([t('\\tan ' + dg(sh.a) + '=\\dfrac{x}{12}'), t('x=12\\times\\tan ' + dg(sh.a) + '=' + dots(sh.x, 2) + '\\approx ' + sh.k), 'A rise of about ' + sh.k + ' inches: a ' + sh.k + '/12 pitch.']), hints: ['The run is 12 (adj) and the rise is opp: tan.', 'x is on top: multiply.'], text: 'EP rise for an angle' }); } },
          { id: 'C13b', level: 'PRG', make: function (r, sh) { return angP('Check your pitch (' + sh.k + '/12) with an inverse trig ratio. What angle does it give, to the nearest degree?', sh.chk, { ratio: { fn: 'tan', num: sh.k, den: 12 },
            sol: t(inT('tan', sh.k, 12) + '=' + dots(sh.chk, 2) + '\\approx ' + dg(rd(sh.chk, 0))) + (rd(sh.chk, 0) === sh.a ? ' ✓' : ' (close to ' + sh.a + '°: the rise was rounded to a whole inch).'), hints: ['θ = tan⁻¹(rise ÷ 12).'], text: 'EP check pitch' }); } }] },
      { num: '14', stem: function (sh) {
          var fg = new Fig(), sc = 260 / sh.W, Wp = sh.W * sc, Hp = sh.H * sc, A = [0, 0], B = [Wp, 0], T = [Wp / 2, -Hp];
          fg.poly([A, B, T], { fill: '#f3ead9', stroke: INK, width: 2.2 }); fg.line(T, [Wp / 2, 0], { dash: '5 4', width: 1.6, color: GREY }); fg.rightSq([Wp / 2, 0], 0, 9);
          fg.arc(A, 0, Math.atan2(Hp, Wp / 2) / RAD, { r: 30, label: 'b', labelR: 44 }).arc(T, 270 - (90 - Math.atan2(Hp, Wp / 2) / RAD), 270 + (90 - Math.atan2(Hp, Wp / 2) / RAD), { r: 20 }); fg.text(Wp / 2 - 13, -Hp + 34, 'p', { size: 14 });
          fg.text(Wp / 2, 16, lab(sh.W), { size: 14 }).text(Wp / 2 + 8, -Hp * 0.3, lab(sh.H), { size: 14, anchor: 'start' });
          return 'A roof truss is an isosceles triangle. It is ' + L(sh.W) + ' wide at the bottom and its peak is ' + L(sh.H) + ' above the bottom, in the middle.' + fg.svg({ width: 340, aria: 'roof truss' });
        },
        shared: function (r) { return find(function () { return { W: r.int(8, 14), H: pickR(r, [1.8, 4, 0.1]) }; }, function (s) { s.b = INV.tan(s.H / (s.W / 2)); s.p = 180 - 2 * s.b; return safe(s.b, 0) && safe(s.p, 0) && s.b > 15 && s.b < 40 && Math.abs(rd(s.p, 0) - (180 - 2 * rd(s.b, 0))) < 1e-9; }); },
        parts: [
          { id: 'C14a', level: 'PRG', make: function (r, sh) { return angP('Find the base angle b, to the nearest degree.', sh.b, { ratio: { fn: 'tan', num: sh.H, den: sh.W / 2 },
            alts: [{ v: INV.tan(sh.H / sh.W), code: 'u7l8-half', hint: 'The post splits the truss into two right triangles: the adj is <b>half</b> the width, ' + N(sh.W / 2) + ' m.' }],
            sol: br(['The centre post splits the truss into two right triangles with adj = ' + t(N(sh.W) + '\\div 2=' + N(sh.W / 2)) + ' m and opp = ' + N(sh.H) + ' m.', t('b=' + inT('tan', sh.H, sh.W / 2) + '=' + dots(sh.b, 2) + '\\approx ' + dg(rd(sh.b, 0)))]), hints: ['Use one half of the truss: a right triangle.', 'Its bottom side is half the width.'], text: 'EP truss base angle' }); } },
          { id: 'C14b', level: 'MAS', make: function (r, sh) { var half = 90 - sh.b; return angX('Find the angle p at the peak, to the nearest degree.', rd(sh.p, 0), { okv: [180 - 2 * rd(sh.b, 0)],
            alts: [{ v: rd(half, 0), code: 'u7l8-double', hint: 'That is <b>half</b> the peak angle (one right triangle). The peak angle is made of two of them.' }, { v: 180 - rd(sh.b, 0), code: 'u7l8-180', hint: 'A triangle’s angles add to 180°, and there are <b>two</b> base angles.' }, { v: 2 * rd(sh.b, 0), code: 'u7l8-double', hint: 'Double the <b>half peak angle</b> (90° − b), not the base angle.' }],
            sol: br(['Each half of the peak angle: ' + t('90^\\circ-' + fx(sh.b, 2) + '^\\circ=' + fx(half, 2) + '^\\circ'), t('p=2\\times ' + fx(half, 2) + '^\\circ=' + fx(2 * half, 2) + '^\\circ\\approx ' + dg(rd(sh.p, 0))), '(Check: ' + t(fx(sh.b, 2) + '+' + fx(sh.b, 2) + '+' + fx(sh.p, 2) + '=180') + ')']),
            hints: ['The post splits the peak angle into two equal parts.', 'Each part is the other acute angle of a right triangle.'], text: 'EP truss peak angle' }); } }] },
      { num: '15', stem: function (sh) { return sh.p.n + ' says: “If I make both legs of a right triangle twice as long, the angles will double too.” Test the claim with legs ' + L(sh.a, 'cm') + ' and ' + L(sh.b, 'cm') + ', then legs ' + L(2 * sh.a, 'cm') + ' and ' + L(2 * sh.b, 'cm') + '.'; },
        shared: function (r) { return find(function () { return { p: person(r), a: r.int(3, 9), b: r.int(4, 12) }; }, function (s) { s.th = INV.tan(s.a / s.b); return s.a < s.b && gcd(s.a, s.b) === 1 && safe(s.th, 0) && !(s.a === 5 && s.b === 7); }); },
        parts: [
          { id: 'C15a', level: 'EMG', make: function (r, sh) {
            var c1 = angP('', sh.th, { ratio: { fn: 'tan', num: sh.a, den: sh.b } }), c2 = angP('', sh.th, { ratio: { fn: 'tan', num: 2 * sh.a, den: 2 * sh.b }, alts: [{ v: 2 * sh.th, code: 'u7l8-double', hint: 'Work it out: ' + t(inT('tan', 2 * sh.a, 2 * sh.b)) + '. Don’t just double the angle.' }] });
            return P.fields('Find the smaller acute angle of each triangle, to the nearest degree.', [{ label: 'Legs ' + sh.a + ' and ' + sh.b + ':', name: 'Small triangle', after: '°' }, { label: 'Legs ' + 2 * sh.a + ' and ' + 2 * sh.b + ':', name: 'Big triangle', after: '°' }], [c1.check, c2.check], [c1.key, c2.key], D(rd(sh.th, 0)) + ' and ' + D(rd(sh.th, 0)),
              br([t(inT('tan', sh.a, sh.b) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0))), t(inT('tan', 2 * sh.a, 2 * sh.b) + '=' + dots(sh.th, 2) + '\\approx ' + dg(rd(sh.th, 0)))]), ['The smaller angle is across from the shorter leg: tan⁻¹(short ÷ long).'], 'EP doubling the legs');
          } },
          { id: 'C15b', level: 'PRG', make: function (r, sh) { var p = sh.p; return P.mc(r, 'Is ' + p.n + ' right? Why?', [
            { html: 'No. ' + t('\\dfrac{' + 2 * sh.a + '}{' + 2 * sh.b + '}=\\dfrac{' + sh.a + '}{' + sh.b + '}') + ', so the ratio and the angle do not change. The bigger triangle is similar to the smaller one (same shape).', right: true },
            { html: 'Yes. Bigger sides always make bigger angles.', why: 'Your two angles in (a) are the same. The ratio of the legs did not change.', code: 'u7l8-noah-yes' },
            { html: 'No. The angles get smaller when the triangle gets bigger.', why: 'Look at (a): the angles are the same, not smaller.', code: 'u7l8-noah-smaller' },
            { html: 'Yes, but only the right angle doubles.', why: 'The right angle is always 90°. And the acute angles stay the same.', code: 'u7l8-noah-right' }],
            'The ratio ' + t('\\dfrac{' + 2 * sh.a + '}{' + 2 * sh.b + '}=\\dfrac{' + sh.a + '}{' + sh.b + '}') + ' does not change, so the angle does not change (' + D(rd(sh.th, 0)) + ' both times). The bigger triangle is similar to the smaller one.', ['Compare the two answers in (a).'], 'EP similar triangles same angles'); } }] }
    ]
  });
})(window);
