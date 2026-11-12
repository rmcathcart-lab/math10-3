/* Math 10-3 · Unit 7 · Lesson 7 — Angles of Elevation and Depression (G4)
 * Assignment 7 (u7_l07.tex, Questions 1–17) and the Lesson 7 Extra Practice (u7_ep07.tex, A 1–4, B 5–9, C 10–13).
 * Every part is a generator: the booklet's situation and difficulty with new numbers around the booklet's (the lesson's
 * worked-example numbers are left out: 38°, 41°, 64°/26°, clinometer tilts 25° and 40°, readings 72/58/113/134, Noor
 * 24 m/1.6 m/31°, Liam's kite 60 m/1.2 m/48°, Ava's cliff 45 m/17°, the 1800 m/4° plane). Calculator allowed (DEG mode).
 * Lengths to the nearest tenth (or as the booklet says), angles to the nearest degree. Values from 2-decimal intermediate
 * results (as in the booklet's solutions) are accepted; rounding the trig ratio or a 1-decimal intermediate too early gets
 * a nudge (no try used).
 * Checkers: HW.geo.lenChk (with its RAD, × vs ÷, wrong-ratio traps) for one-step parts; for the eye-height, roof, two-angle
 * and unit-change parts the same traps are built here as `alts` (each wrong method plus the eye height, forgetting or
 * subtracting the eye height, the angle difference, …) with u7l7- codes. HW.geo.angleChk for elevation/depression angles
 * (90° − x and 180° − x traps).
 * Conversions: "elevation, depression or neither?" pictures → multiple choice with a drawn scene (an angle from the
 * horizontal, or from the vertical for "neither"); the word list (EP A1) → a tap grid; clinometer pictures → a drawn
 * clinometer (HW.geo.protractorSVG turned upside down, with a straw and a weighted string) and two boxes (either scale
 * accepted, ±1°); clinometer tables → one box per reading; "sketch, label, write the ratio, solve" → a ratio multiple
 * choice + the value; "why does that make sense / explain / what did he forget" → multiple choice of reasons;
 * "fill in the blank … because ___" → the angle only (the reason is in the hint and solution). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.lenChk) throw new Error('u7l7.js needs HW.geo (js/geokit.js)');
  var RAD = Math.PI / 180;

  /* ================= numbers and words ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dg(x) { return N(x) + '^\\circ'; }
  function D(x) { return t(dg(x)); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function rawN(x, k) { var s = +x.toFixed(k || 2); return HW.fmt(String(s)) + (Math.abs(x - s) < 1e-9 ? '' : '\\ldots'); }
  function toN(x, dp) { return Math.abs(x - rd(x, dp)) < 1e-9 ? '=' + fx(x, dp) : '\\approx ' + fx(x, dp); }
  function L(x, u) { return t(N(x) + '\\text{ ' + (u || 'm') + '}'); }
  function lab(x, u) { return nS(x) + ' ' + (u || 'm'); }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u7l7: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function safe(v, dp) { var f = v * Math.pow(10, dp == null ? 1 : dp); return Math.abs(f - Math.floor(f) - 0.5) > 0.08; }
  function notIn(v, list) { return list.every(function (x) { return Math.abs(v - x) > 1e-9; }); }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Zoe', 'f'], ['Jordan', 'm'], ['Tessa', 'f'], ['Eli', 'm'], ['Kayla', 'f'], ['Nolan', 'm'], ['Aisha', 'f'], ['Devon', 'm'], ['Brooke', 'f'], ['Owen', 'm'], ['Mei', 'f'], ['Sam', 'm'], ['Leah', 'f']];
  function person(r) { var p = r.pick(NAMES); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his' }; }

  /* ================= trig ================= */
  var TRG = { sin: function (d) { return Math.sin(d * RAD); }, cos: function (d) { return Math.cos(d * RAD); }, tan: function (d) { return Math.tan(d * RAD); } };
  var TRR = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  var MN = { sin: 'SOH', cos: 'CAH', tan: 'TOA' }, PAIRS = { sin: 'opp and hyp', cos: 'adj and hyp', tan: 'opp and adj' };
  function tl(fn, deg, side, op, T) { var F = (T || TRG)[fn](deg); return op === 'div' ? side / F : side * F; }
  function fnT(fn, deg) { return '\\' + fn + ' ' + dg(deg); }

  /* ================= checking a length ================= */
  function plainNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/^\s*[A-Za-z]{1,3}\s*(?:=|≈)\s*/, '').replace(/\s*(?:m|km|cm|metres?|meters?)\.?\s*$/i, '').trim();
    var p = HW.parse.number(s); return p.ok ? p.value : null;
  }
  /* the wrong methods of a one-step trig length (side × or ÷ fn θ), each plus `add` (an eye, hand or roof height) */
  function stepAlts(c) {
    var add = c.add || 0, out = [], base = tl(c.fn, c.deg, c.side, c.op), sc = c.scale || 1;
    var push = function (v, code, hint) { if (isFinite(v) && v > 0) out.push({ v: v, code: code, hint: hint }); };
    push(tl(c.fn, c.deg, c.side, c.op, TRR) * sc + add, 'u7l7-rad', G.RAD_HINT);
    push(tl(c.fn, c.deg, c.side, c.op === 'div' ? 'mul' : 'div') * sc + add, 'u7l7-mul-div', c.op === 'div' ? 'The unknown is on the <b>bottom</b> of the ratio, so <b>divide</b>: side ÷ ' + c.fn + ' θ. (You multiplied.)' : 'The unknown is on <b>top</b> of the ratio, so <b>multiply</b>: side × ' + c.fn + ' θ. (You divided.)');
    ['sin', 'cos', 'tan'].forEach(function (g) { if (g !== c.fn) push(tl(g, c.deg, c.side, c.op) * sc + add, 'u7l7-ratio', 'Check the ratio: label opp, adj and hyp from the ' + c.deg + '° angle. With the ' + PAIRS[c.fn] + ' it is <b>' + c.fn + '</b> (' + MN[c.fn] + '), not ' + g + '.'); });
    if (add) {
      push(base * sc, 'u7l7-no-eye', 'That is only the part above ' + c.addWhat + '. Add the ' + L(add, c.unit) + '.');
      push(base * sc - add, 'u7l7-eye-sub', c.addWhat === 'the roof' ? 'The roof is part of the height, so <b>add</b> the ' + L(add, c.unit) + '.' : 'The triangle starts <b>above</b> the ground, so <b>add</b> the ' + L(add, c.unit) + ', don’t subtract it.');
    }
    return out;
  }
  function stepEarly(c) { var out = [], add = c.add || 0, sc = c.scale || 1; [1, 2].forEach(function (d) { var F = rd(TRG[c.fn](c.deg), d); if (F) out.push((c.op === 'div' ? c.side / F : c.side * F) * sc + add); }); return out; }
  /* a length part. o: dp 1, unit, trig (one step: lenChk's own traps) | c (stepAlts set-up), alts, okv (other right values),
   * early (values from rounding too soon → nudge), earlyHint, nr, sol, hints, text */
  function lenX(prompt, v, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp, alts = (o.c ? stepAlts(o.c) : []).concat(o.alts || []), early = (o.early || []).concat(o.c ? stepEarly(o.c) : []);
    var want = rd(v, dp), okv = (o.okv || []).map(function (x) { return rd(x, dp); });
    alts = alts.filter(function (a) { return Math.abs(rd(a.v, dp) - want) > 1e-9 && okv.every(function (x) { return Math.abs(rd(a.v, dp) - x) > 1e-9; }); });
    var base = G.lenChk(v, { dp: dp, unit: o.unit, trig: o.trig, alts: alts, radTrap: o.trig ? true : false, nr: o.nr });
    var chk = function (resp) {
      var p = plainNum(resp);
      if (p != null && Math.abs(rd(p, dp) - want) > 1e-9) {
        if (okv.some(function (x) { return Math.abs(p - x) < 1e-9; })) return ok();
        if (early.some(function (x) { return Math.abs(rd(x, dp) - rd(p, dp)) < 1e-9; }) && alts.every(function (a) { return Math.abs(rd(a.v, dp) - rd(p, dp)) > 1e-9; })) return form('u7l7-early', o.earlyHint || 'Nearly! Keep the <b>full</b> calculator values and round only the final answer.');
      }
      return base(resp);
    };
    var key = want.toFixed(dp), bad = [];
    alts.forEach(function (a) { var s = rd(a.v, dp).toFixed(dp); if (s !== key && bad.indexOf(s) < 0 && bad.length < 4) bad.push(s); });
    return { prompt: prompt, input: { type: 'number', after: o.unit === '' ? undefined : (o.unit || 'm'), nr: !!o.nr }, check: chk, key: key, answer: t(HW.fmt(key) + (o.unit === '' ? '' : '\\text{ ' + (o.unit || 'm') + '}')), solution: o.sol, hints: o.hints || [], text: o.text, bad: bad };
  }
  /* an elevation / depression angle (a whole number of degrees, given or from 90° − x) */
  function angX(prompt, deg, o) {
    o = o || {}; var p = G.P.angle(prompt, deg, { alts: o.alts || [], supplementTrap: o.supplementTrap == null ? false : o.supplementTrap, sol: o.sol, hints: o.hints, text: o.text });
    p.bad = (o.alts || []).map(function (a) { return nS(a.v); }).filter(function (s) { return s !== p.key; }); p.good = [p.key + '°']; return p;
  }

  HW.addCodes({
    'u7l7-no-eye': 'Forgot to add the eye (hand, instrument or roof) height', 'u7l7-eye-sub': 'Subtracted the eye height instead of adding it', 'u7l7-rad': 'Calculator in RAD mode',
    'u7l7-mul-div': 'Multiplied instead of dividing (or the reverse)', 'u7l7-ratio': 'Used the wrong trig ratio', 'u7l7-early': 'Rounded too early', 'u7l7-from-vert': 'Gave the angle from the vertical, not the horizontal',
    'u7l7-180': 'Subtracted from 180° instead of 90°', 'u7l7-90': 'Changed an equal angle (used 90° − θ)', 'u7l7-reading': 'Used the clinometer reading as the angle', 'u7l7-angle-as-reading': 'Gave the angle instead of the reading', 'u7l7-unit': 'Answer in the wrong unit (m, km, cm)',
    'u7l7-one-tri': 'Used only one of the two triangles', 'u7l7-angle-diff': 'Used the difference of the angles in one triangle', 'u7l7-sum-diff': 'Added instead of subtracting (or the reverse)',
    'mc-u7l7-up': 'Called looking down an angle of elevation (or up, depression)', 'mc-u7l7-hv': 'Called an angle from the vertical an angle of elevation/depression', 'mc-u7l7-neither': 'Said “neither” for an angle from the horizontal'
  });

  /* ================= drawings ================= */
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', RED = '#c93a33', AMBER = '#b26b00', GREEN = '#12805a';
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function n360(a) { return ((a % 360) + 360) % 360; }
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* a small SVG canvas that tracks its bounding box (directions in math degrees: 0 = right, counterclockwise; y down) */
  function Fig() { this.s = ''; this.bb = [1e9, 1e9, -1e9, -1e9]; }
  Fig.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); return this; };
  Fig.prototype.line = function (p, p2, o) {
    o = o || {};
    this.s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(p2[0]) + '" y2="' + f1(p2[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
    return this.grow(p[0], p[1]).grow(p2[0], p2[1]);
  };
  Fig.prototype.path = function (d, o, pts) {
    o = o || {}; var me = this;
    this.s += '<path d="' + d + '" fill="' + (o.fill || 'none') + '"' + (o.fillOpacity != null ? ' fill-opacity="' + o.fillOpacity + '"' : '') + ' stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); return this;
  };
  Fig.prototype.poly = function (pts, o) { return this.path('M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z', o, pts); };
  Fig.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-zθ]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '';
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it +
      (o.halo === false ? '' : ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"') + '>' + esc(str).replace(/-/g, '−') + '</text>';
    var w = str.length * size * 0.3 + 2, ax = o.anchor === 'start' ? x + w : o.anchor === 'end' ? x - w : x;
    return this.grow(ax, y, w, size * 0.62);
  };
  Fig.prototype.dot = function (p, o) { o = o || {}; this.s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (o.r || 3.2) + '" fill="' + (o.color || INK) + '"/>'; return this.grow(p[0], p[1], o.r || 3.2); };
  /* an angle mark at V from direction d1 counterclockwise to d2 (less than 180°), with a label */
  Fig.prototype.arc = function (V, d1, d2, o) {
    o = o || {}; var span = n360(d2 - d1), r0 = o.r || (span < 20 ? 52 : span < 35 ? 40 : 28), right = o.right != null ? o.right : Math.abs(span - 90) < 0.01, col = o.color || INK;
    if (right) { var s = 10, u = at([0, 0], d1, 1), v = at([0, 0], d1 + 90, 1); this.path('M' + f1(V[0] + u[0] * s) + ' ' + f1(V[1] + u[1] * s) + 'L' + f1(V[0] + (u[0] + v[0]) * s) + ' ' + f1(V[1] + (u[1] + v[1]) * s) + 'L' + f1(V[0] + v[0] * s) + ' ' + f1(V[1] + v[1] * s), { stroke: col, width: 1.5 }); }
    else { var a = at(V, d1, r0), b = at(V, d1 + span, r0); this.path('M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + r0 + ' ' + r0 + ' 0 ' + (span > 180 ? 1 : 0) + ' 0 ' + f1(b[0]) + ' ' + f1(b[1]), { stroke: col, width: 1.8 }, [a, b]); }
    if (o.label != null && o.label !== '') {
      var str = String(o.label), hw = str.length * 14 * 0.3 + 3, lr = o.labelR || Math.min(120, Math.max((right ? 14 : r0) + 13, (hw + 6) / Math.max(0.12, Math.sin(Math.min(span, 179) / 2 * RAD)) + 4));
      var p = at(V, d1 + span / 2, lr); this.text(p[0], p[1], str, { size: 14, color: o.labelColor || col });
    }
    return this;
  };
  Fig.prototype.svg = function (o) {
    o = o || {}; var pad = o.pad == null ? 8 : o.pad, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>';
  };
  /* a stick figure with its feet at F, about 40 px tall; returns the eye point */
  function stick(fg, F, h) {
    h = h || 40; var E = [F[0], F[1] - h * 0.88];
    fg.s += '<circle cx="' + f1(E[0]) + '" cy="' + f1(E[1]) + '" r="' + f1(h * 0.11) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.8"/>';
    fg.line([F[0], F[1] - h * 0.76], [F[0], F[1] - h * 0.4], { width: 1.8 }).line([F[0], F[1] - h * 0.4], [F[0] - h * 0.14, F[1]], { width: 1.8 }).line([F[0], F[1] - h * 0.4], [F[0] + h * 0.14, F[1]], { width: 1.8 });
    fg.line([F[0] - h * 0.17, F[1] - h * 0.5], [F[0], F[1] - h * 0.68], { width: 1.8 }).line([F[0], F[1] - h * 0.68], [F[0] + h * 0.17, F[1] - h * 0.5], { width: 1.8 });
    fg.grow(E[0], E[1], h * 0.12); return E;
  }
  function hatchGround(fg, x0, x1, y, water) {
    if (water) { var d = 'M' + f1(x0) + ' ' + f1(y); for (var x = x0; x < x1; x += 12) d += 'q3 -3 6 0t6 0'; fg.path(d, { stroke: BLUE, width: 1.6 }, [[x0, y - 3], [x1, y + 3]]); }
    else fg.line([x0, y], [x1, y], { width: 2.2, color: GREY });
  }
  /* "elevation, depression or neither?" scene. o: kind 'E' | 'D' | 'NU' (from the vertical, looking up) | 'ND' (from the vertical,
   *   looking down), ang (the sight line's angle from the horizontal), ctx { cap, word, pole, block, water } */
  function sceneSVG(o) {
    var fg = new Fig(), c = o.ctx, up = o.kind === 'E' || o.kind === 'NU', E, T, H = 120;
    if (up) {
      hatchGround(fg, -30, 250, 0, c.water);
      if (c.boat) { fg.poly([[-22, -8], [22, -8], [15, 2], [-15, 2]], { fill: '#9aa3b2' }); E = stick(fg, [0, -8], 36); } else E = stick(fg, [0, 0], 42);
      T = at(E, o.ang, 175);
      if (c.pole) fg.line([T[0], 0], T, { width: 4, color: '#6b5a44' });
    } else {
      fg.poly([[-34, 0], [-34, -H], [26, -H], [26, 0]], { fill: '#e6e9ef', stroke: INK, width: 2 });
      fg.text(-4, -H / 2, c.block, { size: 12, weight: 600, color: GREY });
      E = stick(fg, [0, -H], 38);
      var dx = (E[1] * -1) / Math.tan(o.ang * RAD); T = [E[0] + dx, -5]; hatchGround(fg, 26, Math.max(250, T[0] + 30), 0, c.water);
    }
    var big = Math.max(T[0], 120) + 28;
    if (o.kind === 'E' || o.kind === 'D') fg.line(E, [big, E[1]], { dash: '6 4', width: 1.6, color: GREY });
    else if (o.kind === 'NU') fg.line(E, [E[0], E[1] - 125], { dash: '6 4', width: 1.6, color: GREY });
    else fg.line(E, [E[0], 0], { dash: '6 4', width: 1.6, color: GREY });
    fg.line(E, T, { width: 2.4, color: AMBER });
    if (c.boat2) fg.poly([[T[0] - 14, T[1] - 2], [T[0] + 14, T[1] - 2], [T[0] + 9, 5], [T[0] - 9, 5]], { fill: '#9aa3b2' });
    else fg.dot(T, { r: 4.2, color: RED });
    fg.text(T[0] + (up ? 0 : 0), T[1] + (up ? -15 : 16), c.word, { size: 12.5, weight: 600, color: RED });
    var lb = { label: 'θ', color: INK, r: 34 };
    if (o.kind === 'E') fg.arc(E, 0, o.ang, lb); else if (o.kind === 'D') fg.arc(E, 360 - o.ang, 360, lb);
    else if (o.kind === 'NU') fg.arc(E, o.ang, 90, lb); else fg.arc(E, 270, 360 - o.ang, lb);
    fg.text(110, 26, c.cap, { size: 13, weight: 600, color: GREY });
    return fg.svg({ width: 300, aria: 'line of sight and a marked angle' });
  }
  /* a clinometer: a protractor with its curved side down, tilted up by tilt°, a straw on the straight edge and a weighted string */
  function clinoSVG(tilt) {
    var R = 200, svg = G.protractorSVG({ R: R, rot: 180 + tilt, arms: [270, 270], len: R * 1.12, width: 330 });
    var m = /viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(svg), bb = [+m[1], +m[2], +m[1] + +m[3], +m[2] + +m[4]];
    var nn = at([0, 0], tilt + 90, R * 0.08 + 6), S1 = at(nn, tilt, R + 16), S2 = at(nn, tilt + 180, R + 16), far = at(S1, tilt, 45), W = at([0, 0], 270, R * 1.12 + 9);
    var add = '<line x1="' + f1(S1[0]) + '" y1="' + f1(S1[1]) + '" x2="' + f1(S2[0]) + '" y2="' + f1(S2[1]) + '" stroke="#c96f1c" stroke-width="8" stroke-linecap="round"/>' +
      '<line x1="' + f1(S1[0]) + '" y1="' + f1(S1[1]) + '" x2="' + f1(far[0]) + '" y2="' + f1(far[1]) + '" stroke="' + GREY + '" stroke-width="1.6" stroke-dasharray="6 4"/>' +
      '<circle cx="' + f1(W[0]) + '" cy="' + f1(W[1]) + '" r="9" fill="#6b7280"/>';
    var lbl = function (p, s) { add += '<text x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" ' + FONT + ' font-size="15" font-weight="600" text-anchor="middle" dominant-baseline="central" fill="' + GREY + '">' + s + '</text>'; };
    var eyeP = at(S2, tilt + 180, 22), topP = at(far, tilt, 24); lbl(eyeP, 'eye'); lbl(topP, 'to the top'); lbl([W[0] + 40, W[1]], 'weight');
    [S1, S2, far, W, [eyeP[0] - 20, eyeP[1]], [topP[0] + 45, topP[1] - 10], [topP[0] - 45, topP[1] + 10], [W[0] + 75, W[1] + 12]].forEach(function (p) { bb[0] = Math.min(bb[0], p[0] - 12); bb[1] = Math.min(bb[1], p[1] - 12); bb[2] = Math.max(bb[2], p[0] + 12); bb[3] = Math.max(bb[3], p[1] + 12); });
    return svg.replace(/viewBox="[^"]*"/, 'viewBox="' + f1(bb[0]) + ' ' + f1(bb[1]) + ' ' + f1(bb[2] - bb[0]) + ' ' + f1(bb[3] - bb[1]) + '"').replace(/max-width:\d+px/, 'max-width:520px').replace(/<\/svg>$/, add + '</svg>');
  }
  /* a right triangle with the angle at the lower left (a sketch for a solution). sides: { opp, adj, hyp } labels; len: { opp, adj } */
  function triSketch(deg, len, sides, roles) {
    var sd = {}; if (sides.opp != null) sd.a = sides.opp; if (sides.adj != null) sd.b = sides.adj; if (sides.hyp != null) sd.c = sides.hyp;
    return G.rightTriSVG({ a: len.opp, b: len.adj, right: 'br', names: false, theta: 'A', thetaLabel: deg + '°', sides: sd, roles: roles || ['opp', 'adj', 'hyp'], width: 250 });
  }
  /* an elevation picture from the ground (no person) or from eye level */
  function elevPic(o) { return G.elevationSVG(Object.assign({ width: 330 }, o)); }
  /* a roof-to-tower picture: building of height R, a taller building d away, angle of elevation from the roof */
  function roofSVG(R, d, th, H) {
    var fg = new Fig(), sc = 230 / Math.max(d * 1.3, H * 1.05), X = d * sc, Rr = R * sc, Ht = H * sc, bw = Math.max(22, X * 0.25), tw = Math.max(16, X * 0.14);
    hatchGround(fg, -bw - 18, X + tw + 18, 0);
    fg.poly([[-bw, 0], [-bw, -Rr], [0, -Rr], [0, 0]], { fill: '#e6e9ef', stroke: INK, width: 2 });
    fg.poly([[X, 0], [X, -Ht], [X + tw, -Ht], [X + tw, 0]], { fill: '#dfe6f3', stroke: INK, width: 2 });
    fg.line([0, -Rr], [X, -Rr], { dash: '6 4', width: 1.6, color: GREY }).line([0, -Rr], [X, -Ht], { width: 2.2, color: AMBER }).dot([0, -Rr]);
    fg.arc([0, -Rr], 0, th, { label: th + '°', r: 32 });
    fg.text(X / 2, 16, d + ' m', { size: 14 }).text(-bw - 8, -Rr / 2, lab(R), { size: 14, anchor: 'end' }).text(X + tw + 8, -Ht / 2, '?', { size: 15, color: RED, anchor: 'start' });
    return fg.svg({ width: 320, aria: 'angle of elevation from a roof to a taller building' });
  }

  /* ================= Question 1 / EP A1: elevation, depression or neither ================= */
  var CTX = {
    E: [{ cap: 'a drone', word: 'drone' }, { cap: 'a bird', word: 'bird' }, { cap: 'the top of a flagpole', word: 'top', pole: true }, { cap: 'the top of a ski jump', word: 'top', pole: true }, { cap: 'a kite', word: 'kite' }, { cap: 'the top of a cliff, from a boat', word: 'top', pole: true, water: true, boat: true }],
    D: [{ cap: 'a boat, from a bridge', word: 'boat', block: 'bridge', water: true, boat2: true }, { cap: 'a house, from a hill', word: 'house', block: 'hill' }, { cap: 'a dog, from a roof', word: 'dog', block: 'roof' }, { cap: 'a canoe, from a cliff', word: 'canoe', block: 'cliff', water: true, boat2: true }, { cap: 'a car, from a balcony', word: 'car', block: 'building' }],
    NU: [{ cap: 'a hot-air balloon', word: 'balloon' }, { cap: 'a drone', word: 'drone' }, { cap: 'the top of a tower', word: 'top', pole: true }, { cap: 'a bird', word: 'bird' }],
    ND: [{ cap: 'a car, from a rooftop', word: 'car', block: 'roof' }, { cap: 'a boat, from a lighthouse', word: 'boat', block: 'lighthouse', water: true, boat2: true }, { cap: 'a bike, from a balcony', word: 'bike', block: 'building' }]
  };
  function kindPart(r, kind, lev) {
    var c = r.pick(CTX[kind]), ang = kind === 'E' || kind === 'NU' ? r.int(22, 58) : r.int(30, 52);
    var svg = sceneSVG({ kind: kind, ang: ang, ctx: c }), right = kind === 'NU' || kind === 'ND' ? 'N' : kind;
    var up = kind === 'E' || kind === 'NU';
    var opts = [
      { html: '<b>An angle of elevation</b>', right: right === 'E', code: right === 'N' ? 'u7l7-hv' : 'u7l7-up', why: right === 'N' ? 'θ is measured from the dashed <b>vertical</b> line, not from the horizontal. Angles of elevation and depression are always measured from the <b>horizontal</b>.' : 'The line of sight goes <b>down</b> from the horizontal: that is an angle of depression.' },
      { html: '<b>An angle of depression</b>', right: right === 'D', code: right === 'N' ? 'u7l7-hv' : 'u7l7-up', why: right === 'N' ? 'θ is measured from the dashed <b>vertical</b> line, not from the horizontal. Angles of elevation and depression are always measured from the <b>horizontal</b>.' : 'The line of sight goes <b>up</b> from the horizontal: that is an angle of elevation.' },
      { html: '<b>Neither</b>', right: right === 'N', code: 'u7l7-neither', why: 'θ is measured from the dashed <b>horizontal</b> (level) line, so it is an angle of elevation or depression. Is the person looking up or down?' }];
    var sol = right === 'N' ? 'θ is measured from the <b>vertical</b> (straight ' + (up ? 'up' : 'down the wall') + '), not from the horizontal, so it is <b>neither</b>.<br>The angle of ' + (up ? 'elevation' : 'depression') + ' would be ' + t('90^\\circ-\\theta') + '.'
      : 'θ is measured from the <b>horizontal</b>, and the person is looking <b>' + (up ? 'up' : 'down') + '</b>: an angle of <b>' + (up ? 'elevation' : 'depression') + '</b>.';
    return { id: null, level: lev, make: null, built: P.mc(r, 'Is the marked angle θ an angle of elevation, an angle of depression, or neither?' + svg, opts, sol, ['Find the line θ is measured from. Is it the horizontal (level) line?', 'Looking up from the horizontal: elevation. Looking down: depression.'], 'elevation / depression / neither ' + kind, true) };
  }
  function kindMake(kind) { return function (r) { var k = typeof kind === 'function' ? kind(r) : kind; return kindPart(r, k).built; }; }
  var UPS = ['A hockey fan looks up at the scoreboard.', 'A child at the bottom of a slide looks up at the top.', 'A farmer looks up at the top of a grain bin.', 'A camper looks up at an eagle in a tall pine.', 'A worker on the ground looks up at a crane.', 'A kayaker looks up at the top of a cliff.', 'A fan in the front row looks up at the top of the climbing wall.'];
  var DOWNS = ['A climber at the top of a rock wall looks down at her partner on the ground.', 'A pilot looks down at a lake.', 'A lifeguard in a tall chair looks down at a swimmer.', 'A window washer looks down at the street.', 'From a ski lift, a skier looks down at the run.', 'A crane operator looks down at a load on the ground.', 'From a hot-air balloon, a tourist looks down at a farm.'];

  /* ================= clinometer ================= */
  function clinoChk(t0, which) {
    // which 'reading': either scale (90 − t or 90 + t), ±1; 'angle': t, ±1
    var base = which === 'reading' ? G.angleChk(90 - t0, { tol: 1, supplementTrap: false, alts: [{ v: t0, code: 'u7l7-angle-as-reading', hint: 'That is the <b>angle</b>. The reading is the number where the string crosses the scale.' }] })
      : G.angleChk(t0, { tol: 1, supplementTrap: false, alts: [{ v: 90 - t0, code: 'u7l7-reading', hint: 'That is the <b>reading</b>. The angle of elevation is the difference between the reading and 90°.' }, { v: 90 + t0, code: 'u7l7-reading', hint: 'That is the <b>reading</b> on the other scale. The angle of elevation is the difference between the reading and 90°.' }] });
    return function (resp) { if (which === 'reading') { var a = G.readDeg(resp); if (!a.code && Math.abs(a.v - (90 + t0)) <= 1 + 1e-9) return ok(); } return base(resp); };
  }
  function readingAngleChk(rdg) {
    var want = Math.abs(rdg - 90), alts = [];
    if (rdg !== 90) alts.push({ v: rdg, code: 'u7l7-reading', hint: 'That is the reading. The angle is the <b>difference</b> between the reading and 90°: ' + (rdg < 90 ? t('90^\\circ-' + dg(rdg)) : t(dg(rdg) + '-90^\\circ')) + '.' });
    if (rdg !== 90 && Math.abs(180 - rdg - want) > 1e-9) alts.push({ v: 180 - rdg, code: 'u7l7-180', hint: 'Find the difference from <b>90°</b>, not 180°.' });
    if (rdg === 90) alts.push({ v: 90, code: 'u7l7-reading', hint: 'When the string crosses at 90°, the straw is <b>level</b>: the angle of elevation is 0°.' });
    return G.angleChk(want, { alts: alts, supplementTrap: false });
  }
  function readingTable(r, prompt, not, text) {
    var lo = [], hi = [];
    var vals = find(function () {
      lo = [r.int(46, 86), r.int(46, 86)]; hi = [r.int(94, 142), r.int(94, 142)];
      var mid = r.chance(0.5) ? 90 : r.int(94, 142);
      return [lo[0], lo[1], hi[0], mid, hi[1]];
    }, function (v) { return v.every(function (x, i) { return v.indexOf(x) === i && notIn(x, not); }) && Math.abs(v[0] - v[1]) > 6 && Math.abs(v[2] - v[4]) > 6; });
    var fields = vals.map(function (x) { return { label: 'Reading ' + x + '°:', name: x + '°', after: '°' }; });
    return P.fields(prompt, fields, vals.map(readingAngleChk), vals.map(function (x) { return String(Math.abs(x - 90)); }),
      vals.map(function (x) { return x + '° → ' + t(dg(Math.abs(x - 90))); }).join(' &nbsp; '),
      br(['Find the difference between the reading and 90°:'].concat(vals.map(function (x) { return x < 90 ? t('90^\\circ-' + dg(x) + '=' + dg(90 - x)) : x === 90 ? t('90^\\circ-90^\\circ=0^\\circ') + ' (the straw is level)' : t(dg(x) + '-90^\\circ=' + dg(x - 90)); }))),
      ['Reading less than 90°: angle = 90° − reading.', 'Reading more than 90°: angle = reading − 90°.'], text);
  }

  /* ================= eye-height problems ================= */
  /* a height = d × tan θ + eye (or the hyp × sin θ + hand). s: { fn, deg, side, add, addWhat } */
  function eyeSol(s, whatAbove, last) {
    var top = tl(s.fn, s.deg, s.side, 'mul'), h = top + s.add;
    return br([s.setup,
      t(s.fn === 'tan' ? '\\tan ' + dg(s.deg) + '=\\dfrac{h}{' + N(s.side) + '}' : '\\sin ' + dg(s.deg) + '=\\dfrac{h}{' + N(s.side) + '}'),
      t('h=' + N(s.side) + '\\times ' + fnT(s.fn, s.deg) + '\\approx ' + fx(top, 2) + '\\text{ m}') + ' (' + whatAbove + ')',
      'Add ' + s.addWord + ': ' + t(fx(top, 2) + '+' + N(s.add) + '=' + fx(top + s.add, 2) + '\\approx ' + fx(h, 1) + '\\text{ m}'), last.replace('#', fx(h, 1))]);
  }

  HW.defineLesson({
    id: 'u7l7', unit: 7, num: '7', title: 'Angles of Elevation and Depression', outcome: 'G4',
    blurb: 'Angles of elevation and depression, reading a clinometer, and using sin, cos and tan to find heights and distances (don’t forget your eye height).',
    questions: [
      { num: '1', stem: '', parts: [
        { id: '1a', level: 'LIM', make: kindMake('E') },
        { id: '1b', level: 'LIM', make: kindMake('D') },
        { id: '1c', level: 'BEG', make: kindMake(function (r) { return r.pick(['NU', 'ND']); }) },
        { id: '1d', level: 'BEG', make: kindMake(function (r) { return r.pick(['E', 'D', 'NU', 'ND']); }) }] },
      { num: '2', stem: 'Find each angle.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var a = find(function () { return r.int(12, 48); }, function (x) { return notIn(x, [38, 41, 45]); }), c = r.pick([['a bridge', 'a boat'], ['the roof of a barn', 'a truck'], ['a cliff', 'a kayak'], ['a fire tower', 'a deer']]);
          return angX('From ' + c[0] + ', the angle of depression to ' + c[1] + ' is ' + D(a) + '. What is the angle of elevation from ' + c[1] + ' to ' + c[0].replace(/^a /, 'the ') + '?', a, {
            alts: [{ v: 90 - a, code: 'u7l7-90', hint: 'The two angles are <b>equal</b>: they are alternate interior angles between two parallel horizontal lines (the Z shape). Don’t subtract from 90°.' }, { v: 180 - a, code: 'u7l7-180', hint: 'The two angles are <b>equal</b> (alternate interior angles), not supplementary.' }],
            sol: 'The angle of depression and the angle of elevation along the same line of sight are <b>equal</b> (alternate interior angles).<br>The angle of elevation is ' + D(a) + '.', hints: ['Both people look along the same line of sight, and the two horizontals are parallel.'], text: 'depression → elevation' });
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var a = find(function () { return r.int(14, 50); }, function (x) { return notIn(x, [38, 41, 45]); }), c = r.pick([['the bottom of a ski hill', 'the chalet at the top', 'the chalet', 'the bottom'], ['a soccer field', 'the top of the bleachers', 'the top of the bleachers', 'the field'], ['the base of a hill', 'a cabin at the top', 'the cabin', 'the base']]);
          return angX('From ' + c[0] + ', the angle of elevation to ' + c[1] + ' is ' + D(a) + '. What is the angle of depression from ' + c[2] + ' to ' + c[3] + '?', a, {
            alts: [{ v: 90 - a, code: 'u7l7-90', hint: 'The two angles are <b>equal</b> (alternate interior angles). Don’t subtract from 90°.' }, { v: 180 - a, code: 'u7l7-180', hint: 'The two angles are <b>equal</b> (alternate interior angles), not supplementary.' }],
            sol: 'Same line of sight, parallel horizontals: the angles are <b>equal</b>.<br>The angle of depression is ' + D(a) + '.', hints: ['The angle of elevation from the bottom equals the angle of depression from the top.'], text: 'elevation → depression' });
        } },
        { id: '2c', level: 'EMG', make: function (r) {
          var v = find(function () { return r.int(48, 80); }, function (x) { return notIn(x, [64, 45]); }), p = person(r), c = r.pick(['a balcony', 'the top of a parkade', 'a hotel window', 'the roof of the school']);
          return angX(p.n + ' looks down from ' + c + '. ' + cap(p.his) + ' line of sight makes an angle of ' + D(v) + ' with the wall of the building (the vertical). What is the angle of depression?', 90 - v, {
            alts: [{ v: v, code: 'u7l7-from-vert', hint: 'That angle is measured from the <b>vertical</b> (the wall). The angle of depression is measured from the <b>horizontal</b>. The vertical and the horizontal make 90°.' }, { v: 180 - v, code: 'u7l7-180', hint: 'The vertical and the horizontal make <b>90°</b>, so subtract from 90°, not 180°.' }, { v: 90 + v, code: 'u7l7-180', hint: 'Subtract from 90°: the vertical and the horizontal make 90°.' }],
            sol: 'The vertical (the wall) and the horizontal make ' + D(90) + '.<br>' + t('90^\\circ-' + dg(v) + '=' + dg(90 - v)) + '<br>The angle of depression is ' + D(90 - v) + ', because ' + t('90^\\circ-' + dg(v) + '=' + dg(90 - v)) + '.', hints: ['An angle of depression is measured from the horizontal, not from the wall.', 'The wall and the horizontal make a right angle.'], text: 'angle from the vertical' });
        } }] },
      { num: '3', stem: '', parts: [
        { id: '3a', level: 'BEG', make: function (r) {
          var t0 = r.pick([15, 20, 30, 35, 50, 55, 60]);
          return P.fields('Read the clinometer, then find the angle of elevation. (Either scale is fine.)' + clinoSVG(t0), [{ label: 'Reading:', name: 'Reading', after: '°' }, { label: 'Angle of elevation:', name: 'Angle', after: '°' }],
            [clinoChk(t0, 'reading'), clinoChk(t0, 'angle')], [String(90 - t0), String(t0)], 'Reading ' + t(dg(90 - t0)) + ' (or ' + t(dg(90 + t0)) + ') &nbsp; Angle ' + t(dg(t0)),
            br(['The string crosses the scale at ' + D(90 - t0) + ' on one scale (and ' + D(90 + t0) + ' on the other).', 'Angle of elevation = the difference from 90°:', t('90^\\circ-' + dg(90 - t0) + '=' + dg(t0)) + ' (or ' + t(dg(90 + t0) + '-90^\\circ=' + dg(t0)) + ')']),
            ['Follow the string to where it crosses the numbers.', 'The angle of elevation is how far the reading is from 90°.'], 'read a clinometer');
        } },
        { id: '3b', level: 'EMG', make: function (r) { return readingTable(r, 'Find the angle of elevation for each clinometer reading.', [72, 58, 113, 134], 'clinometer readings'); } }] },
      { num: '4', stem: 'For each situation, label the right triangle (opp, adj, hyp from the angle), choose the ratio, then solve. Round to the nearest tenth.',
        shared: function (r) {
          var a = find(function () { var d = r.int(18, 45), th = r.int(50, 66); return { d: d, th: th, h: d * TRG.tan(th) }; }, function (s) { return safe(s.h, 1) && s.d !== 24; });
          var b = find(function () { var Ls = 10 * r.int(25, 60), th = r.int(20, 40); return { L: Ls, th: th, h: Ls * TRG.sin(th) }; }, function (s) { return safe(s.h, 1) && s.th !== 17; });
          return { a: a, b: b };
        },
        parts: [
          { id: '4ai', sub: 'a i', level: 'BEG', make: function (r, sh) {
            var a = sh.a; return G.P.ratioMC(r, 'From a point ' + L(a.d) + ' from the base of a cell tower, the angle of elevation to the top is ' + D(a.th) + '. Which do you use to find the height h of the tower? (Measure from the ground.)' + elevPic({ angle: a.th, dist: a.d, eye: 0, observer: 'none', target: 'tower', labels: { angle: a.th + '°', dist: lab(a.d), height: 'h' } }), 'tan',
              { sol: 'From the ' + a.th + '° angle: h is <b>opp</b> and ' + L(a.d) + ' is <b>adj</b>. Opp and adj: <b>tan</b> (TOA).', hints: ['Label the sides from the angle: which side is across from it?'], text: 'tower: which ratio' });
          } },
          { id: '4aii', sub: 'a ii', level: 'EMG', make: function (r, sh) {
            var a = sh.a; return lenX('How tall is the tower, to the nearest tenth of a metre?', a.h, { trig: { fn: 'tan', deg: a.th, side: a.d, op: 'mul' },
              sol: br(['Opp = h, adj = ' + L(a.d) + ': use tan.', t('\\tan ' + dg(a.th) + '=\\dfrac{h}{' + a.d + '}'), t('h=' + a.d + '\\times\\tan ' + dg(a.th) + toN(a.h, 1) + '\\text{ m}'), 'Check: ' + D(a.th) + ' is more than 45°, so h is more than ' + L(a.d) + ' ✓', 'The tower is about ' + L(rd(a.h, 1)) + ' tall.']),
              hints: ['h is on top of the ratio, so multiply.'], text: 'tower height' });
          } },
          { id: '4bi', sub: 'b i', level: 'BEG', make: function (r, sh) {
            var b = sh.b; return G.P.ratioMC(r, 'From a hot-air balloon, the angle of depression to a landing field is ' + D(b.th) + '. The distance from the balloon to the field along the line of sight is ' + L(b.L) + '. Sketch it. Which do you use to find the height h of the balloon?', 'sin',
              { sol: triSketch(b.th, { opp: b.h, adj: b.L * TRG.cos(b.th) }, { opp: 'h', hyp: lab(b.L) }, ['opp', 'hyp']) + 'At the field, the angle of elevation is also ' + D(b.th) + ' (alternate interior angles).<br>From it: h is <b>opp</b> and the line of sight, ' + L(b.L) + ', is the <b>hyp</b>. Opp and hyp: <b>sin</b> (SOH).', hints: ['Move the angle of depression to the bottom: the angle of elevation at the field is equal.', 'The line of sight is the longest side.'], text: 'balloon: which ratio' });
          } },
          { id: '4bii', sub: 'b ii', level: 'EMG', make: function (r, sh) {
            var b = sh.b; return lenX('How high is the balloon, to the nearest tenth of a metre?', b.h, { trig: { fn: 'sin', deg: b.th, side: b.L, op: 'mul' },
              sol: br(['At the field the angle of elevation is ' + D(b.th) + '. Opp = h, hyp = ' + L(b.L) + ': use sin.', t('\\sin ' + dg(b.th) + '=\\dfrac{h}{' + b.L + '}'), t('h=' + b.L + '\\times\\sin ' + dg(b.th) + toN(b.h, 1) + '\\text{ m}'), 'The balloon is about ' + L(rd(b.h, 1)) + ' high.']),
              hints: ['h is on top of the ratio, so multiply.'], text: 'balloon height' });
          } }] },
      { num: '5', stem: '', parts: [
        { id: '5', level: 'PRG', make: function (r) {
          var s = find(function () { return { d: r.int(10, 28), e: pickR(r, [1.4, 1.8, 0.1]), th: r.int(38, 62) }; }, function (s) { s.h = s.d * TRG.tan(s.th) + s.e; return s.th !== 45 && s.d !== 24 && s.e !== 1.6 && safe(s.h, 1); }), p = person(r);
          var c = { fn: 'tan', deg: s.th, side: s.d, op: 'mul', add: s.e, addWhat: p.his + ' eyes', unit: 'm' };
          return lenX(p.n + ' stands ' + L(s.d) + ' from the base of a spruce tree. ' + cap(p.his) + ' eyes are ' + L(s.e) + ' above the ground. The angle of elevation to the top of the tree is ' + D(s.th) + '. How tall is the tree, to the nearest tenth of a metre?' + elevPic({ angle: s.th, dist: s.d, eye: s.e, target: 'tree', labels: { angle: s.th + '°', dist: lab(s.d), eye: lab(s.e), height: false } }), s.h, { c: c,
            sol: eyeSol({ fn: 'tan', deg: s.th, side: s.d, add: s.e, addWord: p.his + ' eye height', setup: 'From the angle at ' + p.his + ' eyes: the height above ' + p.his + ' eyes is <b>opp</b> and ' + L(s.d) + ' is <b>adj</b>: use tan.' }, 'above ' + p.his + ' eyes', 'The tree is about #\\text{ m} tall.'.replace('#\\text{ m}', '# m')),
            hints: ['The right triangle starts at eye level, not at the ground.', 'Find the opp with tan, then add the eye height.'], text: 'tree + eye height' });
        } }] },
      { num: '6', stem: function (sh) { return 'A zipline cable is ' + L(sh.L) + ' long. From the top tower, the cable goes down at an angle of depression of ' + D(sh.th) + '. Assume the cable is straight. Round to the nearest tenth.'; },
        shared: function (r) { return find(function () { var Ls = 5 * r.int(13, 26), th = r.int(8, 16); return { L: Ls, th: th, dr: Ls * TRG.sin(th), hz: Ls * TRG.cos(th) }; }, function (s) { return s.L !== 60 && safe(s.dr, 1) && safe(s.hz, 1); }); },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { return lenX('How much lower is the bottom end of the cable than the top end?', sh.dr, { trig: { fn: 'sin', deg: sh.th, side: sh.L, op: 'mul' },
            sol: triSketch(sh.th, { opp: sh.dr * 3, adj: sh.hz }, { opp: 'drop', adj: 'x', hyp: lab(sh.L) }) + br(['(Not to scale.) At the bottom the angle of elevation is ' + D(sh.th) + '. The cable is the <b>hyp</b>; the drop is <b>opp</b>: use sin.', t('\\text{drop}=' + sh.L + '\\times\\sin ' + dg(sh.th) + toN(sh.dr, 1) + '\\text{ m}'), 'The bottom end is about ' + L(rd(sh.dr, 1)) + ' lower.']),
            hints: ['Move the angle to the bottom of the cable: the angle of elevation there is equal.', 'You know the hyp and want the opp: SOH.'], text: 'zipline drop' }); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { return lenX('What is the horizontal distance between the two ends?', sh.hz, { trig: { fn: 'cos', deg: sh.th, side: sh.L, op: 'mul' },
            sol: br(['The horizontal distance is <b>adj</b> to the ' + sh.th + '° angle; the cable is the <b>hyp</b>: use cos.', t('x=' + sh.L + '\\times\\cos ' + dg(sh.th) + toN(sh.hz, 1) + '\\text{ m}'), 'They are about ' + L(rd(sh.hz, 1)) + ' apart horizontally.']),
            hints: ['You know the hyp and want the adj: CAH.'], text: 'zipline horizontal' }); } }] },
      { num: '7', stem: '', parts: [
        { id: '7', level: 'PRG', make: function (r) {
          var s = find(function () { return { h: r.int(14, 32), th: r.int(6, 14) }; }, function (s) { s.x = s.h / TRG.tan(s.th); return safe(s.x, 0) && !(s.h === 22 && s.th === 8); });
          return lenX('A ranger in a fire lookout tower in the foothills is ' + L(s.h) + ' above the ground. She sees a deer at an angle of depression of ' + D(s.th) + '. How far is the deer from the base of the tower, to the nearest metre?', s.x, { dp: 0, trig: { fn: 'tan', deg: s.th, side: s.h, op: 'div' },
            sol: triSketch(s.th, { opp: s.h * 4, adj: s.x }, { opp: lab(s.h), adj: 'x' }, ['opp', 'adj']) + br(['(Not to scale.)', 'At the deer, the angle of elevation is also ' + D(s.th) + ' (alternate interior angles).', 'Opp = ' + L(s.h) + ', adj = x: use tan.', t('\\tan ' + dg(s.th) + '=\\dfrac{' + s.h + '}{x}') + ': x is on the bottom, so divide.', t('x=\\dfrac{' + s.h + '}{\\tan ' + dg(s.th) + '}\\approx ' + fx(s.x, 1) + '\\text{ m}'), 'The deer is about ' + L(rd(s.x, 0)) + ' from the base of the tower.']),
            hints: ['Move the angle of depression down to the deer (alternate interior angles).', 'x is on the bottom of the tan ratio: divide.'], text: 'deer distance (÷ tan)' });
        } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var s = find(function () { return { L: 5 * r.int(10, 20), e: pickR(r, [0.9, 1.4, 0.1]), th: r.int(30, 56) }; }, function (s) { s.h = s.L * TRG.sin(s.th) + s.e; return s.L !== 60 && s.e !== 1.2 && s.th !== 48 && s.th !== 45 && safe(s.h, 1); }), p = person(r);
          var c = { fn: 'sin', deg: s.th, side: s.L, op: 'mul', add: s.e, addWhat: p.his + ' hand', unit: 'm' };
          return lenX(p.n + ' flies a kite on ' + L(s.L) + ' of string. ' + cap(p.he) + ' holds the string ' + L(s.e) + ' above the ground, and the string makes an angle of elevation of ' + D(s.th) + '. Assume the string is straight. How high is the kite above the ground, to the nearest tenth of a metre?', s.h, { c: c,
            sol: triSketch(s.th, { opp: s.L * TRG.sin(s.th), adj: s.L * TRG.cos(s.th) }, { opp: 'x', hyp: lab(s.L) }, ['opp', 'hyp']) + eyeSol({ fn: 'sin', deg: s.th, side: s.L, add: s.e, addWord: 'the hand height', setup: 'The string is the <b>hyp</b> (' + L(s.L) + '); the height above ' + p.his + ' hand is <b>opp</b>: use sin.' }, 'above ' + p.his + ' hand', 'The kite is about # m above the ground.'),
            hints: ['The string is the hypotenuse.', 'Find the height above the hand, then add the hand height.'], text: 'kite + hand height' });
        } }] },
      { num: '9', stem: function (sh) { return 'A small plane is ' + L(sh.h) + ' above the runway at Red Deer. It comes in to land in a straight line at an angle of depression of ' + D(sh.th) + '.'; },
        shared: function (r) { return find(function () { return { h: 50 * r.int(14, 30), th: r.int(5, 9) }; }, function (s) { s.d = s.h / TRG.sin(s.th); return safe(s.d / 1000, 1) && s.h !== 1800; }); },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) {
            var km = sh.d / 1000, hz = sh.h / TRG.tan(sh.th) / 1000;
            var alts = [{ v: sh.d, code: 'u7l7-unit', hint: 'That is in <b>metres</b>. Change it to kilometres: divide by 1000.' }];
            return lenX('How far does the plane fly along its path to touch down? Round to the nearest tenth of a <b>kilometre</b>.', km, { unit: 'km', trig: { fn: 'sin', deg: sh.th, side: sh.h / 1000, op: 'div' }, alts: Math.abs(rd(hz, 1) - rd(km, 1)) > 1e-9 ? alts.concat([{ v: hz, code: 'u7l7-ratio', hint: 'That is the <b>horizontal</b> distance (tan). The path is the <b>hyp</b>: use sin.' }]) : alts,
              sol: br(['At touchdown the angle of elevation is ' + D(sh.th) + '. Opp = ' + L(sh.h) + ', the path d is the <b>hyp</b>: use sin.', t('\\sin ' + dg(sh.th) + '=\\dfrac{' + sh.h + '}{d}') + ': d is on the bottom, so divide.', t('d=\\dfrac{' + sh.h + '}{\\sin ' + dg(sh.th) + '}\\approx ' + HW.fmt(String(Math.round(sh.d))) + '\\text{ m}\\approx ' + fx(km, 1) + '\\text{ km}'), 'The plane flies about ' + L(rd(km, 1), 'km') + '.']),
              hints: ['Opp and hyp: SOH. Is d on the top or the bottom?', '1 km = 1000 m.'], text: 'plane path (km)' });
          } },
          { id: '9b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Your answer is much longer than ' + L(sh.h) + '. Why does that make sense?', [
              { html: 'The path is the <b>hypotenuse</b>, the longest side. A ' + sh.th + '° angle is very shallow, so the plane must travel a long way to come down ' + L(sh.h) + '.', right: true },
              { html: 'Because the plane flies faster than it falls.', why: 'Speed has nothing to do with it: this is about the sides of the right triangle.', code: 'u7l7-speed' },
              { html: 'Because ' + L(sh.h) + ' is the hypotenuse, and the hypotenuse is always the shortest side.', why: L(sh.h) + ' is the height (opp). The hypotenuse is the <b>longest</b> side.', code: 'u7l7-hyp' },
              { html: 'It doesn’t make sense: the path should be shorter than the height.', why: 'The path is the hypotenuse, so it must be longer than the height.', code: 'u7l7-nosense' }],
              'The path is the hypotenuse, the longest side of the right triangle. A ' + sh.th + '° angle is very shallow, so the plane travels a long way to come down ' + L(sh.h) + '.', ['Which side of the right triangle is the path?'], 'why the path is long');
          } }] },
      { num: '10', stem: '', parts: [
        { id: '10', level: 'PRG', make: function (r) {
          var s = find(function () { return { R: r.int(8, 18), d: r.int(20, 40), th: r.int(26, 44) }; }, function (s) { s.top = s.d * TRG.tan(s.th); s.H = s.top + s.R; return safe(s.H, 1) && s.th !== 31 && s.top > 6; }), p = person(r);
          var c = { fn: 'tan', deg: s.th, side: s.d, op: 'mul', add: s.R, addWhat: 'the roof', unit: 'm' };
          return lenX(p.n + ' is on the roof of a ' + L(s.R) + ' apartment building. An office tower is ' + L(s.d) + ' away. From the roof, the angle of elevation to the top of the tower is ' + D(s.th) + '. How tall is the office tower, to the nearest tenth of a metre? (Measure from the roof; ignore ' + p.n + '’s height.)' + roofSVG(s.R, s.d, s.th, s.H), s.H, { c: c,
            sol: br(['Opp = the part of the tower above the roof, adj = ' + L(s.d) + ': use tan.', t('\\text{opp}=' + s.d + '\\times\\tan ' + dg(s.th) + '\\approx ' + fx(s.top, 2) + '\\text{ m}'), 'Add the roof height: ' + t(fx(s.top, 2) + '+' + s.R + '=' + fx(s.top + s.R, 2) + '\\approx ' + fx(s.H, 1) + '\\text{ m}'), 'The office tower is about ' + L(rd(s.H, 1)) + ' tall.']),
            hints: ['The triangle starts at the roof, not at the ground.', 'Find the part above the roof with tan, then add the roof height.'], text: 'roof to tower' });
        } }] },
      { num: '11', stem: function (sh) { return sh.p.n + ' stands ' + L(sh.d) + ' from a building. ' + cap(sh.p.his) + ' eyes are ' + L(sh.e) + ' above the ground. The angle of elevation to the roof is ' + D(sh.th) + '. Here is ' + sh.p.his + ' work:<br>&nbsp;&nbsp;&nbsp;' + t('h=' + sh.d + '\\times\\tan ' + dg(sh.th) + '=' + fx(sh.top, 1) + '\\text{ m}') + '. The building is ' + L(rd(sh.top, 1)) + ' tall.'; },
        shared: function (r) { return find(function () { return { p: person(r), d: r.int(14, 30), e: pickR(r, [1.5, 1.8, 0.1]), th: r.int(28, 44) }; }, function (s) { s.top = s.d * TRG.tan(s.th); s.h = s.top + s.e; return s.e !== 1.6 && s.th !== 31 && safe(s.h, 1) && safe(s.top, 1); }); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var p = sh.p; return P.mc(r, 'What did ' + p.n + ' forget?', [
              { html: 'To add ' + p.his + ' eye height (' + L(sh.e) + '). ' + L(rd(sh.top, 1)) + ' is only the part of the building above ' + p.his + ' eyes.', right: true },
              { html: 'To use sin instead of tan.', why: p.n + ' knows the <b>adj</b> (the distance along the ground) and wants the <b>opp</b>, so tan is right.', code: 'u7l7-ratio' },
              { html: 'To divide by ' + t('\\tan ' + dg(sh.th)) + ' instead of multiplying.', why: 'h is on top of ' + t('\\tan ' + dg(sh.th) + '=\\dfrac{h}{' + sh.d + '}') + ', so multiplying is right.', code: 'u7l7-mul-div' },
              { html: 'To subtract ' + p.his + ' eye height.', why: 'The triangle starts at ' + p.his + ' eyes, which are <b>above</b> the ground. The building is taller than ' + L(rd(sh.top, 1)) + ': add.', code: 'u7l7-eye-sub' }],
              'The angle is measured from ' + p.his + ' eyes, so ' + L(rd(sh.top, 1)) + ' is only the height <b>above ' + p.his + ' eyes</b>. ' + cap(p.he) + ' forgot to add ' + p.his + ' eye height.', ['Where does the right triangle start: at the ground or at eye level?'], 'what was forgotten');
          } },
          { id: '11b', level: 'PRG', make: function (r, sh) {
            var c = { fn: 'tan', deg: sh.th, side: sh.d, op: 'mul', add: sh.e, addWhat: sh.p.his + ' eyes', unit: 'm' };
            return lenX('Find the correct height of the building, to the nearest tenth of a metre.', sh.h, { c: c, okv: [rd(sh.top, 1) + sh.e],
              sol: br([t(sh.d + '\\times\\tan ' + dg(sh.th) + '\\approx ' + fx(sh.top, 2)), t(fx(sh.top, 2) + '+' + N(sh.e) + '=' + fx(sh.top + sh.e, 2) + '\\approx ' + fx(sh.h, 1) + '\\text{ m}'), 'The building is about ' + L(rd(sh.h, 1)) + ' tall.']),
              hints: ['Add the eye height to ' + sh.p.n + '’s answer.'], text: 'correct height' });
          } }] },
      { num: '12', stem: function (sh) { return sh.p.n + ' stands ' + L(sh.d) + ' from a grain elevator. The angle of elevation to the top is ' + D(sh.th) + '. ' + cap(sh.p.he) + ' says the top is ' + L(rd(sh.wrong, 1)) + ' above ' + sh.p.his + ' eyes.'; },
        shared: function (r) { return find(function () { return { p: person(r), d: 5 * r.int(6, 10), th: r.int(54, 70) }; }, function (s) { s.h = s.d * TRG.tan(s.th); s.wrong = s.d / TRG.tan(s.th); return safe(s.h, 1) && !(s.d === 40 && s.th === 60); }); },
        parts: [
          { id: '12a', level: 'PRG', make: function (r, sh) {
            var p = sh.p; return P.mc(r, 'Without a calculator, why can’t ' + p.his + ' answer be right?', [
              { html: D(sh.th) + ' is more than 45°, so the height above ' + p.his + ' eyes must be <b>more</b> than ' + p.his + ' distance, ' + L(sh.d) + '. But ' + L(rd(sh.wrong, 1)) + ' is less than ' + L(sh.d) + '.', right: true },
              { html: D(sh.th) + ' is more than 45°, so the height must be <b>less</b> than ' + L(sh.d) + '.', why: 'Backwards: at 45° the height equals the distance; a <b>steeper</b> angle gives a <b>taller</b> height.', code: 'u7l7-45-back' },
              { html: 'The height should be about ' + L(sh.th) + ', because the angle is ' + D(sh.th) + '.', why: 'An angle in degrees is not a length. Compare with the 45° rule.', code: 'u7l7-deg-len' },
              { html: 'A height can never be more than the distance along the ground.', why: 'It can: when the angle is more than 45°, the height above the eyes is more than the distance.', code: 'u7l7-never' }],
              'At 45°, the height above the eyes equals the distance. ' + D(sh.th) + ' is more than 45°, so the height must be more than ' + L(sh.d) + '.<br>' + L(rd(sh.wrong, 1)) + ' is less than ' + L(sh.d) + ', so it can’t be right. (' + cap(p.he) + ' divided, ' + t(sh.d + '\\div\\tan ' + dg(sh.th)) + ', instead of multiplying.)', ['Use the 45° idea: at 45° the height above the eyes equals the distance.'], '45° check');
          } },
          { id: '12b', level: 'EMG', make: function (r, sh) {
            return lenX('Find the correct height above ' + sh.p.his + ' eyes, to the nearest tenth of a metre.', sh.h, { trig: { fn: 'tan', deg: sh.th, side: sh.d, op: 'mul' },
              sol: br(['Opp = h, adj = ' + L(sh.d) + ': tan, and h is on top, so multiply.', t('h=' + sh.d + '\\times\\tan ' + dg(sh.th) + toN(sh.h, 1) + '\\text{ m}'), '(' + cap(sh.p.he) + ' divided, ' + t(sh.d + '\\div\\tan ' + dg(sh.th)) + ', instead of multiplying.)']),
              hints: ['h is on top of the tan ratio: multiply.'], text: '45° check: correct height' });
          } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'ADV', make: function (r) {
          var s = find(function () { var a = r.int(20, 38), up = r.chance(0.5); return { d: r.int(12, 26), a: a, rdg: up ? 90 + a : 90 - a, e: pickR(r, [1.4, 1.7, 0.1]) }; }, function (s) { s.top = s.d * TRG.tan(s.a); s.h = s.top + s.e; return notIn(s.a, [25, 40, 31]) && s.e !== 1.6 && safe(s.h, 1); }), p = person(r);
          var c = { fn: 'tan', deg: s.a, side: s.d, op: 'mul', add: s.e, addWhat: p.his + ' eyes', unit: 'm' };
          var alts = [{ v: s.d * TRG.tan(s.rdg) + s.e, code: 'u7l7-reading', hint: 'The clinometer reading is not the angle of elevation. The angle is the difference between the reading and 90°.' }, { v: s.d * TRG.tan(s.rdg), code: 'u7l7-reading', hint: 'Find the angle of elevation first (the difference between the reading and 90°), then add the eye height.' }, { v: s.d * TRG.tan(90 - s.a) + s.e, code: 'u7l7-reading', hint: 'The angle of elevation is the difference between the reading and 90°: ' + D(s.a) + '.' }];
          return lenX(p.n + ' stands ' + L(s.d) + ' from the wall of the school gym. ' + cap(p.he) + ' looks through ' + p.his + ' clinometer at the top of the wall, and the string crosses the scale at ' + D(s.rdg) + '. ' + cap(p.his) + ' eyes are ' + L(s.e) + ' above the ground. How tall is the wall, to the nearest tenth of a metre?', s.h, { c: c, alts: alts,
            sol: br(['Angle of elevation: ' + (s.rdg < 90 ? t('90^\\circ-' + dg(s.rdg) + '=' + dg(s.a)) : t(dg(s.rdg) + '-90^\\circ=' + dg(s.a))) + '.', 'Height above ' + p.his + ' eyes: ' + t(s.d + '\\times\\tan ' + dg(s.a) + '\\approx ' + fx(s.top, 2) + '\\text{ m}'), t(fx(s.top, 2) + '+' + N(s.e) + '=' + fx(s.top + s.e, 2) + '\\approx ' + fx(s.h, 1) + '\\text{ m}'), 'The wall is about ' + L(rd(s.h, 1)) + ' tall.']),
            hints: ['First change the clinometer reading to the angle of elevation.', 'Then use tan, and add the eye height.'], text: 'clinometer + eye height' });
        } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var e = find(function () { return r.int(12, 34); }, function (x) { return notIn(x, [17, 31]); });
          return P.mc(r, 'From a sailboat, the angle of elevation to the top of a lighthouse is ' + D(e) + '. What is the angle of depression from the top of the lighthouse to the sailboat?', [
            { html: D(90 - e), why: t(dg(90 - e)) + ' is measured from the <b>vertical</b>. The angle of depression equals the angle of elevation.', code: 'u7l7-90' },
            { html: D(e), right: true },
            { html: D(180 - e), why: 'The angles are alternate interior angles, so they are <b>equal</b>, not supplementary.', code: 'u7l7-180' },
            { html: D(90 + e), why: 'The angle of depression equals the angle of elevation (alternate interior angles).', code: 'u7l7-90' }],
            'The angle of elevation and the angle of depression along the same line of sight are <b>equal</b> (alternate interior angles): ' + D(e) + '.', ['The two horizontal lines are parallel; the line of sight is a transversal.'], 'MC equal angles', true);
        } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var H = 5 * r.int(8, 18), a = find(function () { return r.int(15, 35); }, function (x) { return x !== 17; });
          if (H === 45) H = 60;
          return P.mc(r, 'From the top of a ' + L(H) + ' cliff, the angle of depression to a boat is ' + D(a) + '. Which expression gives the distance from the boat to the base of the cliff?', [
            { html: t(H + '\\times\\tan ' + dg(a)), why: 'The distance is <b>adj</b> and on the bottom of ' + t('\\tan ' + dg(a) + '=\\dfrac{' + H + '}{x}') + ', so divide.', code: 'u7l7-mul-div' },
            { html: t('\\dfrac{' + H + '}{\\tan ' + dg(a) + '}'), right: true },
            { html: t(H + '\\times\\sin ' + dg(a)), why: 'The cliff (opp) and the distance (adj) go together in <b>tan</b>, and x is on the bottom.', code: 'u7l7-ratio' },
            { html: t('\\dfrac{' + H + '}{\\sin ' + dg(a) + '}'), why: 'That gives the <b>line of sight</b> (the hyp), not the distance along the water.', code: 'u7l7-ratio' }],
            'At the boat the angle of elevation is ' + D(a) + '. Opp = ' + L(H) + ', adj = x: ' + t('\\tan ' + dg(a) + '=\\dfrac{' + H + '}{x}') + ', so ' + t('x=\\dfrac{' + H + '}{\\tan ' + dg(a) + '}\\approx ' + fx(H / TRG.tan(a), 1) + '\\text{ m}') + '.', ['Move the angle down to the boat, then label opp and adj.'], 'MC which expression', true);
        } }] },
      { num: '16', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '16', level: 'PRG', make: function (r) {
          var s = find(function () { return { h: r.int(25, 50), th: r.int(55, 72) }; }, function (s) { s.w = s.h / TRG.sin(s.th); return safe(s.w, 1) && !(s.h === 40 && s.th === 63); });
          return lenX('A guy wire is attached to a radio tower ' + L(s.h) + ' above the ground. From its anchor on the ground, the angle of elevation of the wire is ' + D(s.th) + '. The length of the wire, to the nearest tenth of a metre, is ____ m.', s.w, { nr: true, trig: { fn: 'sin', deg: s.th, side: s.h, op: 'div' },
            sol: br(['Opp = ' + L(s.h) + ', the wire is the <b>hyp</b>: use sin.', t('\\sin ' + dg(s.th) + '=\\dfrac{' + s.h + '}{w}') + ': w is on the bottom, so divide.', t('w=\\dfrac{' + s.h + '}{\\sin ' + dg(s.th) + '}' + toN(s.w, 1) + '\\text{ m}')]),
            hints: ['The wire is the hypotenuse.', 'w is on the bottom: divide.'], text: 'NR guy wire' });
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'ADV', make: function (r) {
          var s = find(function () { return { L: pickR(r, [5, 9.5, 0.1]), th: pickR(r, [3.5, 4.8, 0.1]) }; }, function (s) { s.rise = s.L * TRG.sin(s.th) * 100; return safe(s.rise, 1) && !(s.L === 7.2 && s.th === 4.8); });
          var alts = [{ v: s.rise / 100, code: 'u7l7-unit', hint: 'That is in <b>metres</b>. The answer is in <b>centimetres</b>: multiply by 100.' }, { v: s.rise / 1000, code: 'u7l7-unit', hint: '1 m = 100 cm: multiply the metres by 100.' }, { v: s.rise * 10, code: 'u7l7-unit', hint: '1 m = <b>100</b> cm (not 1000).' }];
          return lenX('A wheelchair ramp is ' + L(s.L) + ' long. It rises at an angle of elevation of about ' + D(s.th) + '. How high does the ramp rise, to the nearest tenth of a <b>centimetre</b>? ____ cm', s.rise, { nr: true, unit: 'cm', c: { fn: 'sin', deg: s.th, side: s.L, op: 'mul', scale: 100 }, alts: alts,
            sol: br(['The ramp is the <b>hyp</b>; the rise is <b>opp</b>: use sin.', t('\\text{rise}=' + N(s.L) + '\\times\\sin ' + dg(s.th) + '\\approx ' + rawN(s.rise / 100, 5) + '\\text{ m}'), t(rawN(s.rise / 100, 5) + '\\times 100' + toN(s.rise, 1) + '\\text{ cm}')]),
            hints: ['Find the rise in metres with sin.', 'Then change metres to centimetres: × 100.'], text: 'NR ramp rise (cm)' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: '', parts: [
        { id: 'A1', level: 'LIM', make: function (r) {
          var s = find(function () { var u = r.int(1, 3); return r.shuffle(r.shuffle(UPS).slice(0, u).map(function (x) { return [x, 'E']; }).concat(r.shuffle(DOWNS).slice(0, 4 - u).map(function (x) { return [x, 'D']; }))); }, function () { return true; });
          var rows = s.map(function (x, i) { return { id: 'r' + i, html: '(' + 'abcd'[i] + ') ' + x[0] }; }), want = {}; s.forEach(function (x, i) { want['r' + i] = x[1]; });
          return P.grid('Is the angle in each situation an angle of <b>elevation</b> or an angle of <b>depression</b>? Tap one for each.', rows, [{ id: 'E', html: 'Elevation' }, { id: 'D', html: 'Depression' }], want, {},
            br(s.map(function (x, i) { return '(' + 'abcd'[i] + ') looking <b>' + (x[1] === 'E' ? 'up' : 'down') + '</b>: ' + (x[1] === 'E' ? 'elevation' : 'depression'); })), ['Looking up from the horizontal: elevation. Looking down: depression.'], 'elevation or depression (words)');
        } }] },
      { num: '2', stem: 'Find each angle.', parts: [
        { id: 'A2a', level: 'BEG', make: function (r) {
          var a = find(function () { return r.int(15, 50); }, function (x) { return notIn(x, [38, 41, 45]); }), c = r.pick([['a roof', 'a dog in the yard', 'the dog'], ['a balcony', 'a car in the lot', 'the car'], ['a tree stand', 'a deer', 'the deer']]);
          return angX('From ' + c[0] + ', the angle of depression to ' + c[1] + ' is ' + D(a) + '. The angle of elevation from ' + c[2] + ' to ' + c[0].replace(/^a /, 'the ') + ' is:', a, { alts: [{ v: 90 - a, code: 'u7l7-90', hint: 'They are <b>equal</b> (alternate interior angles).' }, { v: 180 - a, code: 'u7l7-180', hint: 'They are <b>equal</b> (alternate interior angles), not supplementary.' }],
            sol: 'Equal (alternate interior angles): ' + D(a) + '.', hints: ['Same line of sight, two parallel horizontals.'], text: 'EP depression → elevation' });
        } },
        { id: 'A2b', level: 'EMG', make: function (r) {
          var v = find(function () { return r.int(55, 84); }, function (x) { return x !== 64; }), p = person(r);
          return angX(p.n + ' looks down from a tower. ' + cap(p.his) + ' line of sight makes an angle of ' + D(v) + ' with the vertical. The angle of depression is:', 90 - v, { alts: [{ v: v, code: 'u7l7-from-vert', hint: 'That is the angle from the <b>vertical</b>. Subtract it from 90°.' }, { v: 180 - v, code: 'u7l7-180', hint: 'Subtract from <b>90°</b>, not 180°.' }],
            sol: t('90^\\circ-' + dg(v) + '=' + dg(90 - v)), hints: ['The vertical and the horizontal make 90°.'], text: 'EP from the vertical' });
        } },
        { id: 'A2c', level: 'BEG', make: function (r) {
          var a = find(function () { return r.int(20, 60); }, function (x) { return notIn(x, [38, 41, 45]); });
          return angX('From a boat, the angle of elevation to the top of a cliff is ' + D(a) + '. The angle of depression from the top of the cliff to the boat is:', a, { alts: [{ v: 90 - a, code: 'u7l7-90', hint: 'They are <b>equal</b> (alternate interior angles).' }, { v: 180 - a, code: 'u7l7-180', hint: 'They are <b>equal</b>, not supplementary.' }],
            sol: 'Equal (alternate interior angles): ' + D(a) + '.', hints: ['The angle of elevation from the bottom equals the angle of depression from the top.'], text: 'EP elevation → depression' });
        } }] },
      { num: '3', stem: '', parts: [
        { id: 'A3', level: 'EMG', make: function (r) { return readingTable(r, 'Find the angle of elevation for each clinometer reading.', [72, 58, 113, 134], 'EP clinometer readings'); } }] },
      { num: '4', stem: 'Each triangle has an angle of elevation at the lower left. Find x to the nearest tenth.', parts: [
        { id: 'A4a', sub: 'a', level: 'BEG', make: function (r) {
          var s = find(function () { return { th: r.int(30, 50), k: r.int(12, 26) }; }, function (s) { s.x = s.k * TRG.tan(s.th); return s.th !== 45 && s.th !== 31 && safe(s.x, 1); });
          return lenX('Find x.' + triSketch(s.th, { opp: s.x, adj: s.k }, { adj: lab(s.k), opp: 'x' }, []), s.x, { trig: { fn: 'tan', deg: s.th, side: s.k, op: 'mul' },
            sol: br(['Opp and adj: tan.', t('x=' + s.k + '\\times\\tan ' + dg(s.th) + toN(s.x, 1) + '\\text{ m}')]), hints: ['x is opp, the known side is adj: TOA.'], text: 'EP triangle tan' });
        } },
        { id: 'A4b', sub: 'b', level: 'BEG', make: function (r) {
          var s = find(function () { return { th: r.int(25, 45), k: r.int(15, 36) }; }, function (s) { s.x = s.k * TRG.sin(s.th); return s.th !== 45 && safe(s.x, 1); });
          return lenX('Find x.' + triSketch(s.th, { opp: s.x, adj: s.k * TRG.cos(s.th) }, { hyp: lab(s.k), opp: 'x' }, []), s.x, { trig: { fn: 'sin', deg: s.th, side: s.k, op: 'mul' },
            sol: br(['Opp and hyp: sin.', t('x=' + s.k + '\\times\\sin ' + dg(s.th) + toN(s.x, 1) + '\\text{ m}')]), hints: ['x is opp, the known side is the hyp: SOH.'], text: 'EP triangle sin' });
        } },
        { id: 'A4c', sub: 'c', level: 'EMG', make: function (r) {
          var s = find(function () { return { th: r.int(20, 40), k: r.int(10, 24) }; }, function (s) { s.x = s.k / TRG.cos(s.th); return safe(s.x, 1); });
          return lenX('Find x.' + triSketch(s.th, { opp: s.k * TRG.tan(s.th), adj: s.k }, { adj: lab(s.k), hyp: 'x' }, []), s.x, { trig: { fn: 'cos', deg: s.th, side: s.k, op: 'div' },
            sol: br(['Adj and hyp: cos.', t('\\cos ' + dg(s.th) + '=\\dfrac{' + s.k + '}{x}') + ': x is on the bottom, so divide.', t('x=\\dfrac{' + s.k + '}{\\cos ' + dg(s.th) + '}' + toN(s.x, 1) + '\\text{ m}')]), hints: ['x is the hyp, the known side is adj: CAH.', 'x is on the bottom: divide.'], text: 'EP triangle cos (÷)' });
        } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [
        { id: 'B5', level: 'PRG', make: function (r) {
          var s = find(function () { return { d: 5 * r.int(5, 10), e: pickR(r, [1.4, 1.8, 0.1]), th: r.int(28, 44) }; }, function (s) { s.h = s.d * TRG.tan(s.th) + s.e; return s.e !== 1.6 && s.th !== 31 && safe(s.h, 1); }), p = person(r);
          return lenX(p.n + ' stands ' + L(s.d) + ' from a grain elevator near Lethbridge. ' + cap(p.his) + ' eyes are ' + L(s.e) + ' above the ground. The angle of elevation to the top of the elevator is ' + D(s.th) + '. How tall is the grain elevator, to the nearest tenth of a metre?', s.h, { c: { fn: 'tan', deg: s.th, side: s.d, op: 'mul', add: s.e, addWhat: p.his + ' eyes', unit: 'm' },
            sol: eyeSol({ fn: 'tan', deg: s.th, side: s.d, add: s.e, addWord: p.his + ' eye height', setup: 'Opp = the height above ' + p.his + ' eyes, adj = ' + L(s.d) + ': tan.' }, 'above ' + p.his + ' eyes', 'The elevator is about # m tall.'),
            hints: ['Find the height above the eyes with tan.', 'Then add the eye height.'], text: 'EP elevator + eye height' });
        } }] },
      { num: '6', stem: '', parts: [
        { id: 'B6', level: 'PRG', make: function (r) {
          var s = find(function () { return { L: 10 * r.int(8, 16), e: pickR(r, [1, 1.5, 0.1]), th: r.int(20, 40) }; }, function (s) { s.h = s.L * TRG.sin(s.th) + s.e; return s.th !== 31 && safe(s.h, 1); }), p = person(r);
          return lenX(p.n + ' flies a drone. It is ' + L(s.L) + ' from ' + p.his + ' controller along ' + p.his + ' line of sight, at an angle of elevation of ' + D(s.th) + '. ' + cap(p.he) + ' holds the controller ' + L(s.e) + ' above the ground. How high is the drone above the ground, to the nearest tenth of a metre?', s.h, { c: { fn: 'sin', deg: s.th, side: s.L, op: 'mul', add: s.e, addWhat: 'the controller', unit: 'm' },
            sol: eyeSol({ fn: 'sin', deg: s.th, side: s.L, add: s.e, addWord: 'the controller height', setup: 'The line of sight is the <b>hyp</b> (' + L(s.L) + '); the height above the controller is <b>opp</b>: sin.' }, 'above the controller', 'The drone is about # m above the ground.'),
            hints: ['The line of sight is the hypotenuse.', 'Add the controller height at the end.'], text: 'EP drone + hand height' });
        } }] },
      { num: '7', stem: '', parts: [
        { id: 'B7', level: 'PRG', make: function (r) {
          var s = find(function () { return { h: r.int(12, 30), th: r.int(18, 34) }; }, function (s) { s.x = s.h / TRG.tan(s.th); return safe(s.x, 1) && !(s.h === 45 && s.th === 17); });
          return lenX('From a bridge deck ' + L(s.h) + ' above the Bow River, the angle of depression to a kayak is ' + D(s.th) + '. How far is the kayak from the point on the water right under the bridge, to the nearest tenth of a metre?', s.x, { trig: { fn: 'tan', deg: s.th, side: s.h, op: 'div' },
            sol: br(['At the kayak the angle of elevation is ' + D(s.th) + '. Opp = ' + L(s.h) + ', adj = x: tan.', t('x=\\dfrac{' + s.h + '}{\\tan ' + dg(s.th) + '}' + toN(s.x, 1) + '\\text{ m}'), 'The kayak is about ' + L(rd(s.x, 1)) + ' away.']),
            hints: ['Move the angle down to the kayak.', 'x is on the bottom of the tan ratio: divide.'], text: 'EP kayak (÷ tan)' });
        } }] },
      { num: '8', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'B8', level: 'EMG', make: function (r) {
          var s = find(function () { return { d: r.int(18, 32), th: r.int(15, 28), e: pickR(r, [1.4, 1.8, 0.1]) }; }, function (s) {
            s.v = [s.d * TRG.tan(s.th) + s.e, s.d * TRG.tan(s.th), s.d / TRG.tan(s.th) + s.e, s.d * TRG.sin(s.th) + s.e].map(function (x) { return rd(x, 1); });
            return s.e !== 1.6 && s.v.every(function (x, i) { return s.v.indexOf(x) === i; }) && safe(s.d * TRG.tan(s.th) + s.e, 1); });
          return P.mc(r, 'From a point ' + L(s.d) + ' from a light standard, the angle of elevation to its top is ' + D(s.th) + '. Your eyes are ' + L(s.e) + ' above the ground. How tall is the light standard?', [
            { html: L(s.v[1]), why: 'That is only the part above your eyes. Add the ' + L(s.e) + '.', code: 'u7l7-no-eye' },
            { html: L(s.v[0]), right: true },
            { html: L(s.v[2]), why: 'The height above the eyes is on <b>top</b> of the tan ratio: multiply, don’t divide.', code: 'u7l7-mul-div' },
            { html: L(s.v[3]), why: 'You know the adj (along the ground) and want the opp: tan, not sin.', code: 'u7l7-ratio' }],
            br([t(s.d + '\\times\\tan ' + dg(s.th) + '\\approx ' + fx(s.d * TRG.tan(s.th), 2)), t(fx(s.d * TRG.tan(s.th), 2) + '+' + N(s.e) + '\\approx ' + fx(s.v[0], 1) + '\\text{ m}')]), ['Use tan, then add the eye height.'], 'EP MC light standard');
        } }] },
      { num: '9', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'B9', level: 'EMG', make: function (r) {
          var s = find(function () { return { L: 50 * r.int(8, 18), th: r.int(10, 22) }; }, function (s) { s.x = s.L * TRG.sin(s.th); return safe(s.x, 0); });
          return lenX('A ski run goes down in a straight line at an angle of depression of ' + D(s.th) + ' from the top. A skier travels ' + L(s.L) + ' along the run. How many metres lower is she, to the nearest metre? ____ m', s.x, { dp: 0, nr: true, trig: { fn: 'sin', deg: s.th, side: s.L, op: 'mul' },
            sol: br(['The run is the <b>hyp</b>; the drop is <b>opp</b> (from the ' + s.th + '° angle at the bottom): sin.', t(s.L + '\\times\\sin ' + dg(s.th) + '\\approx ' + fx(s.x, 1)) + ', so ' + L(rd(s.x, 0)) + '.']),
            hints: ['The run is the hypotenuse.'], text: 'EP NR ski run' });
        } }] },
      { num: '10', section: 'C. Stretch', stem: '', parts: [
        { id: 'C10', level: 'MAS', make: function (r) {
          var s = find(function () { var d = 5 * r.int(6, 14), al = r.int(22, 38), be = al + r.int(4, 9); return { d: d, al: al, be: be, H1: d * TRG.tan(al), H2: d * TRG.tan(be) }; }, function (s) { s.x = s.H2 - s.H1; return safe(s.x, 1) && s.x > 2 && !(s.d === 50 && s.al === 30 && s.be === 36); });
          var two = rd(rd(s.H2, 2) - rd(s.H1, 2), 1), one = rd(rd(s.H2, 1) - rd(s.H1, 1), 1);
          var alts = [{ v: s.H2, code: 'u7l7-one-tri', hint: 'That is the height to the top of the flagpole (from the ground). Subtract the height of the building.' }, { v: s.H1, code: 'u7l7-one-tri', hint: 'That is the height of the building. Find the height to the top of the pole too, and subtract.' },
            { v: s.d * TRG.tan(s.be - s.al), code: 'u7l7-angle-diff', hint: 'The ' + (s.be - s.al) + '° angle is not in a right triangle with the pole. Find each height with its own angle, then subtract.' },
            { v: s.d * (Math.tan(s.be) - Math.tan(s.al)), code: 'u7l7-rad', hint: G.RAD_HINT }, { v: Math.abs(s.d / TRG.tan(s.al) - s.d / TRG.tan(s.be)), code: 'u7l7-mul-div', hint: 'The heights are on <b>top</b> of the tan ratio: multiply.' }, { v: s.H1 + s.H2, code: 'u7l7-sum-diff', hint: 'The two heights overlap: the pole is the <b>difference</b>.' }];
          var fg = new Fig(), sc = 250 / Math.max(s.d * 1.2, s.H2 * 1.1), X = s.d * sc, Y1 = -s.H1 * sc, Y2 = -s.H2 * sc, bw = Math.max(26, X * 0.2);
          hatchGround(fg, -16, X + bw + 14, 0); fg.poly([[X, 0], [X, Y1], [X + bw, Y1], [X + bw, 0]], { fill: '#e6e9ef', stroke: INK, width: 2 }); fg.line([X + 3, Y1], [X + 3, Y2], { width: 4, color: '#6b5a44' });
          fg.line([0, 0], [X, Y1], { width: 2 }).line([0, 0], [X + 3, Y2], { width: 2, color: AMBER }).dot([0, 0]);
          fg.arc([0, 0], 0, Math.atan2(s.H1, s.d) / RAD, { r: 44, label: s.al + '°', labelR: 66 }).arc([0, 0], 0, Math.atan2(s.H2, s.d) / RAD, { r: 92, label: s.be + '°', labelR: 110, color: AMBER });
          fg.text(X / 2, 16, s.d + ' m', { size: 14 }).text(X + 12, (Y1 + Y2) / 2, 'pole', { size: 13, color: RED, anchor: 'start' });
          return lenX('A flagpole stands on the roof of a building. From a point on the ground ' + L(s.d) + ' from the building, the angle of elevation to the bottom of the flagpole is ' + D(s.al) + ' and to the top of the flagpole is ' + D(s.be) + '. How long is the flagpole, to the nearest tenth of a metre?' + fg.svg({ width: 320, aria: 'two angles of elevation to a flagpole on a roof' }), s.x, { alts: alts, okv: [two], early: one !== rd(s.x, 1) && one !== two ? [one] : [], earlyHint: 'Nearly! Keep more decimals in the two heights (at least two), and round only the final answer.',
            sol: br(['Two right triangles share the ' + L(s.d) + ' side (adj in both): tan.', 'Top of the pole: ' + t(s.d + '\\times\\tan ' + dg(s.be) + '\\approx ' + fx(s.H2, 2) + '\\text{ m}'), 'Bottom of the pole (the roof): ' + t(s.d + '\\times\\tan ' + dg(s.al) + '\\approx ' + fx(s.H1, 2) + '\\text{ m}'), 'Flagpole: ' + t(fx(s.H2, 2) + '-' + fx(s.H1, 2) + '=' + fx(rd(s.H2, 2) - rd(s.H1, 2), 2) + '\\approx ' + fx(s.x, 1) + '\\text{ m}'), '(Not ' + t(s.d + '\\times\\tan ' + dg(s.be - s.al)) + ': the ' + (s.be - s.al) + '° angle is not in a right triangle with the pole.)']),
            hints: ['There are two right triangles. Both have the ' + s.d + ' m side as the adj.', 'Find both heights, then subtract.'], text: 'EP two angles: flagpole' });
        } }] },
      { num: '11', stem: function (sh) { return 'A plane is ' + L(sh.h) + ' above the runway. It comes in to land at an angle of depression of ' + D(sh.th) + '. Round to the nearest tenth of a kilometre.'; },
        shared: function (r) { return find(function () { return { h: 50 * r.int(14, 32), th: r.pick([2, 2.5, 3, 3.5]) }; }, function (s) { s.x = s.h / TRG.tan(s.th) / 1000; s.d = s.h / TRG.sin(s.th) / 1000; return safe(s.x, 1) && safe(s.d, 1) && s.h !== 1800; }); },
        parts: [
          { id: 'C11a', level: 'PRG', make: function (r, sh) { return lenX('Find the horizontal distance to the touchdown spot.', sh.x, { unit: 'km', trig: { fn: 'tan', deg: sh.th, side: sh.h / 1000, op: 'div' }, alts: [{ v: sh.x * 1000, code: 'u7l7-unit', hint: 'That is in metres. Divide by 1000 to get kilometres.' }],
            sol: br(['Opp = ' + L(sh.h) + ', adj = x: tan, x on the bottom.', t('x=\\dfrac{' + sh.h + '}{\\tan ' + dg(sh.th) + '}\\approx ' + HW.fmt(String(Math.round(sh.x * 1000))) + '\\text{ m}\\approx ' + fx(sh.x, 1) + '\\text{ km}')]), hints: ['Opp and adj: TOA. x is on the bottom.', '1 km = 1000 m.'], text: 'EP plane horizontal' }); } },
          { id: 'C11b', level: 'PRG', make: function (r, sh) { return lenX('Find the distance the plane flies along its path.', sh.d, { unit: 'km', trig: { fn: 'sin', deg: sh.th, side: sh.h / 1000, op: 'div' }, alts: [{ v: sh.d * 1000, code: 'u7l7-unit', hint: 'That is in metres. Divide by 1000 to get kilometres.' }],
            sol: br(['Opp = ' + L(sh.h) + ', the path d is the hyp: sin, d on the bottom.', t('d=\\dfrac{' + sh.h + '}{\\sin ' + dg(sh.th) + '}\\approx ' + HW.fmt(String(Math.round(sh.d * 1000))) + '\\text{ m}\\approx ' + fx(sh.d, 1) + '\\text{ km}')]), hints: ['Opp and hyp: SOH. d is on the bottom.'], text: 'EP plane path' }); } },
          { id: 'C11c', level: 'PRG', make: function (r, sh) {
            var gap = Math.round((sh.d - sh.x) * 1000);
            return P.mc(r, 'Your two answers are almost the same. Why does that make sense?', [
              { html: 'The angle is very small, so the path is almost flat: the hypotenuse is only a little longer than the horizontal side.', right: true },
              { html: 'Because sin and tan always give the same answer.', why: 'They don’t: try sin 40° and tan 40°. They are only close for <b>small</b> angles.', code: 'u7l7-same' },
              { html: 'Because the height is the hypotenuse.', why: 'The height is the opp. The path is the hypotenuse.', code: 'u7l7-hyp' },
              { html: 'It doesn’t make sense: the path should be much longer.', why: 'At a small angle the triangle is very flat, so the hypotenuse is only a little longer than the bottom side.', code: 'u7l7-nosense' }],
              'The angle is very small, so the triangle is very flat. The path (hyp) is only a little longer than the horizontal side, about ' + HW.fmt(String(gap)) + ' m longer here.', ['Picture a very flat right triangle.'], 'EP why almost the same');
          } }] },
      { num: '12', stem: function (sh) { return sh.p.n + ' stands ' + L(sh.d) + ' from an apartment building. ' + cap(sh.p.his) + ' eyes are ' + L(sh.e) + ' above the ground, and the angle of elevation to the roof is ' + D(sh.th) + '. ' + cap(sh.p.he) + ' says the roof is ' + L(rd(sh.w, 1)) + ' above ' + sh.p.his + ' eyes.'; },
        shared: function (r) { return find(function () { return { p: person(r), d: r.int(15, 28), e: pickR(r, [1.4, 1.8, 0.1]), th: r.int(48, 60) }; }, function (s) { s.w = s.d * TRG.sin(s.th); s.top = s.d * TRG.tan(s.th); s.h = s.top + s.e; return s.e !== 1.6 && safe(s.h, 1) && safe(s.w, 1); }); },
        parts: [
          { id: 'C12a', level: 'PRG', make: function (r, sh) {
            var p = sh.p; return P.mc(r, 'Use the 45° idea: why is ' + p.his + ' answer not reasonable?', [
              { html: D(sh.th) + ' is more than 45°, so the height above ' + p.his + ' eyes should be <b>more</b> than ' + L(sh.d) + '. ' + L(rd(sh.w, 1)) + ' is less.', right: true },
              { html: D(sh.th) + ' is more than 45°, so the height should be <b>less</b> than ' + L(sh.d) + '.', why: 'Backwards: a steeper angle than 45° gives a height <b>more</b> than the distance.', code: 'u7l7-45-back' },
              { html: 'The answer is reasonable: it is close to ' + L(sh.d) + '.', why: 'Check with 45°: at ' + D(sh.th) + ' the height must be more than ' + L(sh.d) + '.', code: 'u7l7-fine' },
              { html: 'A height above the eyes can never be more than the distance.', why: 'It can, when the angle is more than 45°.', code: 'u7l7-never' }],
              'At 45° the height above the eyes equals the distance. ' + D(sh.th) + ' is more than 45°, so the height should be more than ' + L(sh.d) + '; ' + L(rd(sh.w, 1)) + ' is less.', ['At 45°, the height above the eyes equals the distance.'], 'EP 45° check');
          } },
          { id: 'C12bi', sub: 'b i', level: 'PRG', make: function (r, sh) {
            var p = sh.p; return P.mc(r, 'What mistake did ' + p.n + ' make?', [
              { html: cap(p.he) + ' used sin, but ' + L(sh.d) + ' is the <b>adj</b> (not the hyp), so ' + p.he + ' should use tan.', right: true },
              { html: cap(p.he) + ' forgot to add ' + p.his + ' eye height.', why: cap(p.he) + ' said “above ' + p.his + ' eyes”, so no eye height is needed yet. Try ' + t(sh.d + '\\times\\sin ' + dg(sh.th)) + ' on your calculator.', code: 'u7l7-no-eye' },
              { html: cap(p.he) + ' divided by tan instead of multiplying.', why: t(sh.d + '\\div\\tan ' + dg(sh.th) + '\\approx ' + fx(sh.d / TRG.tan(sh.th), 1)) + ', not ' + fx(sh.w, 1) + '. Try ' + t(sh.d + '\\times\\sin ' + dg(sh.th)) + '.', code: 'u7l7-mul-div' },
              { html: cap(p.his) + ' calculator was in RAD mode.', why: 'In RAD mode the numbers would be very different. Try ' + t(sh.d + '\\times\\sin ' + dg(sh.th)) + ' in DEG mode.', code: 'u7l7-rad' }],
              t(sh.d + '\\times\\sin ' + dg(sh.th) + '\\approx ' + fx(sh.w, 1)) + ': ' + p.he + ' used sin. But ' + L(sh.d) + ' is along the ground (adj), so use tan.', ['Try a few calculations on your calculator to see which one gives ' + fx(sh.w, 1) + '.'], 'EP what mistake');
          } },
          { id: 'C12bii', sub: 'b ii', level: 'PRG', make: function (r, sh) {
            return lenX('Find the correct height of the building, to the nearest tenth of a metre.', sh.h, { c: { fn: 'tan', deg: sh.th, side: sh.d, op: 'mul', add: sh.e, addWhat: sh.p.his + ' eyes', unit: 'm' }, alts: [{ v: sh.w + sh.e, code: 'u7l7-ratio', hint: 'That still uses sin. The ' + sh.d + ' m distance is the adj: use tan.' }],
              sol: br([t(sh.d + '\\times\\tan ' + dg(sh.th) + '\\approx ' + fx(sh.top, 2)), t(fx(sh.top, 2) + '+' + N(sh.e) + '=' + fx(sh.top + sh.e, 2) + '\\approx ' + fx(sh.h, 1) + '\\text{ m}'), 'The building is about ' + L(rd(sh.h, 1)) + ' tall.']),
              hints: ['Use tan, then add the eye height.'], text: 'EP correct height' });
          } }] },
      { num: '13', stem: '', parts: [
        { id: 'C13', level: 'MAS', make: function (r) {
          var s = find(function () { var h = 5 * r.int(8, 16), a = r.int(16, 26), b = a + r.int(8, 18); return { h: h, a: a, b: b, d1: h / TRG.tan(a), d2: h / TRG.tan(b) }; }, function (s) { s.x = s.d1 + s.d2; return safe(s.x, 1) && !(s.h === 60 && s.a === 20 && s.b === 35); });
          var two = rd(rd(s.d1, 2) + rd(s.d2, 2), 1), one = rd(rd(s.d1, 1) + rd(s.d2, 1), 1);
          var alts = [{ v: s.d1 - s.d2, code: 'u7l7-sum-diff', hint: 'The trucks are on <b>opposite</b> sides of the tower, so <b>add</b> the two distances.' }, { v: s.d1, code: 'u7l7-one-tri', hint: 'That is only the distance to one truck. Find the other and add.' }, { v: s.d2, code: 'u7l7-one-tri', hint: 'That is only the distance to one truck. Find the other and add.' },
            { v: s.h * (TRG.tan(s.a) + TRG.tan(s.b)), code: 'u7l7-mul-div', hint: 'Each distance is on the <b>bottom</b> of its tan ratio: divide, ' + t(s.h + '\\div\\tan') + '.' }, { v: s.h / Math.tan(s.a) + s.h / Math.tan(s.b), code: 'u7l7-rad', hint: G.RAD_HINT }, { v: s.h * (1 / TRG.tan(90 - s.a) + 1 / TRG.tan(90 - s.b)), code: 'u7l7-from-vert', hint: 'Use the angles of depression themselves (they are measured from the horizontal), moved down to each truck.' }];
          var fg = new Fig(), sc = 300 / (s.d1 + s.d2), H = s.h * sc, T = [0, -H], xa = -s.d1 * sc, xb = s.d2 * sc;
          hatchGround(fg, xa - 18, xb + 18, 0); fg.line([0, 0], T, { width: 4, color: '#6b5a44' }).line(T, [xa, 0], { width: 2 }).line(T, [xb, 0], { width: 2, color: AMBER }).dot([xa, 0]).dot([xb, 0]);
          fg.line([xa * 0.55, -H], [xb * 0.75, -H], { dash: '6 4', width: 1.6, color: GREY });
          fg.arc(T, 180, 180 + Math.atan2(H, -xa) / RAD, { r: 46, label: s.a + '°', labelR: 66 }).arc(T, 360 - Math.atan2(H, xb) / RAD, 360, { r: 40, label: s.b + '°', labelR: 58, color: AMBER }).arc([0, 0], 0, 90, { right: true });
          fg.text(10, -H * 0.45, lab(s.h), { size: 14, anchor: 'start' }).text(xa, 15, 'truck', { size: 12, weight: 600, color: GREY }).text(xb, 15, 'truck', { size: 12, weight: 600, color: GREY });
          return lenX('From the top of a ' + L(s.h) + ' communication tower, a worker sees two trucks on opposite sides of the tower, on level ground. The angle of depression to one truck is ' + D(s.a) + ' and to the other is ' + D(s.b) + '. How far apart are the trucks, to the nearest tenth of a metre?' + fg.svg({ width: 340, aria: 'two angles of depression from a tower' }), s.x, { alts: alts, okv: [two], early: one !== rd(s.x, 1) && one !== two ? [one] : [], earlyHint: 'Nearly! Keep more decimals in the two distances (at least two), and round only the final answer.',
            sol: br(['Move each angle of depression down to its truck (alternate interior angles). In each triangle, ' + L(s.h) + ' is opp and the ground distance is adj: tan, with the distance on the bottom.', 'Truck 1: ' + t('\\dfrac{' + s.h + '}{\\tan ' + dg(s.a) + '}\\approx ' + fx(s.d1, 2) + '\\text{ m}'), 'Truck 2: ' + t('\\dfrac{' + s.h + '}{\\tan ' + dg(s.b) + '}\\approx ' + fx(s.d2, 2) + '\\text{ m}'), 'Opposite sides, so add: ' + t(fx(s.d1, 2) + '+' + fx(s.d2, 2) + '=' + fx(rd(s.d1, 2) + rd(s.d2, 2), 2) + '\\approx ' + fx(s.x, 1) + '\\text{ m}'), 'Check: the smaller angle (' + D(s.a) + ') belongs to the truck that is farther away ✓']),
            hints: ['There are two right triangles with the same opp side (the tower).', 'Find each ground distance with ÷ tan, then add.'], text: 'EP two trucks' });
        } }] }
    ]
  });
})(window);
