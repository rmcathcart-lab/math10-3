/* Math 10-3 · Unit 3 · Lesson 9 — Composite and Irregular Shapes (M4)
 * Assignment 9 (u3_l09.tex, Questions 1–17) and the Lesson 9 Extra Practice (u3_ep09.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the same kind of shape, units and difficulty as the booklet item, new numbers around the
 * booklet's (the lesson's worked-example numbers are left out: the 9 m × 7 m café, the 10 ft shed wall, the 36 in × 48 in
 * window, the 15 m × 12 m yard, Owen's 12 ft × 8 ft wall, the 40 m × 20 m oval). Calculator allowed (π key).
 * Answers: typed numbers; a unit typed after the number is ignored. Exact answers with quarters or halves may also be
 * typed as a mixed number (82 3/4); an unsimplified or improper fraction gets a nudge (no try used). Rounding as the
 * booklet asks; too many or too few decimals gets a nudge; rounding the wrong way is wrong with a hint; π = 3.14 instead
 * of the π key gets a nudge when it changes the rounded answer. Recognised wrong values each get their own hint: the
 * overlap counted twice, the whole rectangle without the cut-out, the cut-out added, the perimeter, the ½ of a triangle
 * or semicircle forgotten, the diameter used as the radius, r × 2 instead of r², half the circumference, ft-and-in read
 * as a decimal (4 ft 6 in → 4.6), one window or one coat only, rounding a count of sheets/cans/boxes down, part squares
 * counted as full or left out, the grid count not multiplied by the area of one square (or multiplied by its side).
 * Conversions: grid shapes are drawn in SVG (rectilinear shapes from the booklet's coordinates with new sizes; the
 * irregular ponds/gardens/leaves are generated so that every part square is clearly cut by the edge, and the counts
 * come from the drawing itself); squares can be tapped to mark them (once = full, twice = part) as a counting aid;
 * "count and check by splitting" → one number (the check is in the solution); the counting table → labelled boxes
 * (full, part, part ÷ 2, estimate); "draw the smallest rectangle around it" → its size in squares and the area it stands
 * for; "make a sketch and label it" → choose the correctly labelled sketch; "what mistake did Kayla / Sam make" →
 * multiple choice of reasons; "how many boxes and the cost" → two labelled boxes.
 *
 * Shared kit (for u3l10.js and later Unit 3 lessons): HW.u3area — an SVG figure builder in grid units (fig), arcs,
 * an irregular grid shape with exact full/part counts (blob) and its tappable grid picture (gridFig), the mixed-number
 * wrapper (mixWrap / unmix), number and multi-box parts on top of HW.u4conv (num, fields: rounding nudges, typed units
 * ignored, a hint for any other value), circle/semicircle wrong-value lists, ½ ¼ ¾ labels (fh).
 * It checks with HW.u4conv (js/lessons/u4l1.js) at question time, so u4l1.js must be on the page (anywhere). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  function C() { var c = HW.u4conv; if (!c) throw new Error('u3l9 needs HW.u4conv (js/lessons/u4l1.js)'); return c; }

  /* ======================= small helpers ======================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true).replace(/ /g, ' ') : s; }
  function eqR(x, dp) { return C().eqR(x, dp); }
  function uT(s) { return C().uT(s); }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 600; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u3l9: no numbers found'); return fb; }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function ceil(x) { return Math.ceil(q(x) - 1e-9); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function M(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Mp(x) { return '$' + rd(x, 2).toFixed(2); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* a mixed number of halves/quarters/thirds/eighths as TeX (4.5 → 4\tfrac{1}{2}) and as a plain label (4½) */
  var FR = [[0.125, '1', '8', '⅛'], [0.25, '1', '4', '¼'], [1 / 3, '1', '3', '⅓'], [0.375, '3', '8', '⅜'], [0.5, '1', '2', '½'], [0.625, '5', '8', '⅝'], [2 / 3, '2', '3', '⅔'], [0.75, '3', '4', '¾'], [0.875, '7', '8', '⅞']];
  function frOf(x) { var w = Math.floor(x + 1e-9), f = q(x - w); return { w: w, f: FR.filter(function (p) { return Math.abs(f - p[0]) < 1e-6; })[0] }; }
  function mixT(x) { var o = frOf(x); if (!o.f) return N(x); return (o.w ? o.w : '') + '\\tfrac{' + o.f[1] + '}{' + o.f[2] + '}'; }
  function fh(x) { var o = frOf(x); if (!o.f) return Np(x); return (o.w ? o.w : '') + o.f[3]; }
  /* "a ft b in" as text, and in feet */
  function ftin(f, i) { return f + ' ft' + (i ? ' ' + i + ' in' : ''); }
  var NAMES = ['Amara', 'Kai', 'Malik', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Hana', 'Devon', 'Rosa', 'Theo', 'Ben', 'Maya', 'Dani', 'Kenji', 'Sofia', 'Omar', 'Tyler', 'Jaya', 'Ezra'];

  var A = HW.u3area = HW.u3area || {};
  Object.assign(A, { q: q, rd: rd, nS: nS, N: N, Np: Np, br: br, find: find, pickR: pickR, ceil: ceil, isInt: isInt, M: M, Mp: Mp, mixT: mixT, fh: fh, NAMES: NAMES });

  /* ======================= mixed numbers ======================= */
  /* "82 3/4", "3/4", "82\frac{3}{4}" → a decimal string (the unit after it kept), with bad = 'simp' | 'improper' */
  function unmix(s) {
    var str = String(s == null ? '' : s).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\\[dt]?frac\{(\d+)\}\{(\d+)\}/g, ' $1/$2').replace(/\\[dt]?frac\{?(\d)\}?\{?(\d+)\}?/g, ' $1/$2').replace(/\s+/g, ' ').trim();
    var m = /^(\d+) (\d+) ?\/ ?(\d+)\s*([^\d\/][\s\S]*)?$/.exec(str), w = 0, n, d, rest;
    if (m) { w = +m[1]; n = +m[2]; d = +m[3]; rest = m[4]; }
    else if ((m = /^(\d+) ?\/ ?(\d+)\s*([^\d\/][\s\S]*)?$/.exec(str))) { n = +m[1]; d = +m[2]; rest = m[3]; }
    else return { s: s };
    if (!d) return { s: s };
    return { s: nS(w + n / d) + (rest ? ' ' + rest : ''), bad: gcd(n, d) > 1 ? 'simp' : n >= d ? 'improper' : null };
  }
  function mixWrap(p) {
    var raw = p.check, fieldsMode = p.input.type === 'fields';
    var nudge = function (b) { return b === 'simp' ? form('u3a-simplest', 'Write the fraction in simplest form (or type the answer as a decimal).') : form('u3a-improper', 'Write it as a mixed number, like 82 3/4, or as a decimal, like 82.75.'); };
    p.check = function (resp) {
      if (fieldsMode) {
        var bad = null, out = (resp || []).map(function (x) { var u = unmix(x); if (u.bad && !bad) bad = u.bad; return u.s; });
        var r = raw(out); if (r.v === 'correct' && bad) return nudge(bad); return r;
      }
      var u = unmix(resp), r1 = raw(u.s);
      if (u.bad && r1.v === 'correct') return nudge(u.bad);
      return r1;
    };
    return p;
  }
  A.unmix = unmix; A.mixWrap = mixWrap;

  /* ======================= number parts (on HW.u4conv) ======================= */
  /* o: dp, money, exact, exactOk, alts, bad [[v, code, hint, 'form'?]], after (unit), sol, hints, text, nr, miss, mixed (show a mixed-number key too) */
  A.num = function (prompt, ans, o) {
    o = o || {};
    var p = C().num(prompt, ans, { dp: o.dp, money: o.money, exact: o.exact, exactOk: o.exactOk, alts: o.alts, bad: o.bad, after: o.after, before: o.before, sol: o.sol, hints: o.hints, text: o.text, nr: o.nr });
    if (o.miss) { var c2 = C().chk(q(ans), { dp: o.dp, money: o.money, exact: o.exact, exactOk: o.exactOk, alts: o.alts, bad: o.bad, nr: o.nr, miss: o.miss }); p.check = c2; }
    if (o.ansTex) p.answer = t(o.ansTex);
    else if (o.dp == null && !o.money && frOf(ans).f && !isInt(ans)) p.answer = t(N(q(ans)) + uT(o.after)) + ' (or ' + t(mixT(ans) + uT(o.after)) + ')';
    if (!o.nr && o.dp == null && !o.money && frOf(ans).f && !isInt(ans)) { var fo = frOf(ans); p.good = (p.good || []).concat([fo.w + ' ' + fo.f[1] + '/' + fo.f[2]]); }
    return mixWrap(p);
  };
  /* several boxes. rows: [{ label, name, ans, dp, money, exact, exactOk, alts, bad, after, before, miss }] */
  A.fields = function (prompt, rows, sol, hints, text) {
    var chks = rows.map(function (rw, i) {
      var others = rows.filter(function (x, j) { return j !== i && Math.abs(q(x.ans) - q(rw.ans)) > 1e-9; }).map(function (x) { return [x.ans, 'amt-swap', 'That’s the answer for another box (' + (x.name || x.label.replace(/:$/, '')) + '). Check which box is which.']; });
      return C().chk(q(rw.ans), { dp: rw.dp, money: rw.money, exact: rw.exact, exactOk: rw.exactOk, alts: rw.alts, bad: (rw.bad || []).concat(others), miss: rw.miss });
    });
    var keys = chks.map(function (c) { return c.key; });
    var ans = rows.map(function (rw, i) { return rw.label + ' ' + t((rw.money ? '\\$' : '') + N(Number(keys[i]), chks[i].keyDp) + uT(rw.after)); }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: rw.money ? '$' : rw.before, after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }), chks, keys, ans, br(sol), hints, text);
    var b0 = []; rows.forEach(function (rw, i) { var bb = chks[i].bad.filter(function (b) { return b[3] !== 'form'; })[0]; if (bb) { var arr = keys.slice(); arr[i] = nS(rd(bb[0], 6)); b0.push(arr); } });
    p.bad = b0.slice(0, 3);
    return mixWrap(p);
  };
  /* typical circle / semicircle mistakes added to (sign +1) or taken from (sign −1) the rest R. half: a semicircle. dGiven: the diameter was given */
  A.circBad = function (R, r, sign, half, dGiven) {
    var h = half ? 0.5 : 1, b = [], pi = Math.PI, s = sign || 1;
    if (half) b.push([R + s * pi * r * r, 'u3a-semi-full', 'A semicircle is <b>half</b> a circle: ' + t('A=\\tfrac{1}{2}\\pi r^2') + '.']);
    if (dGiven !== false) b.push([R + s * h * pi * 4 * r * r, 'u3a-diam', 'Use the <b>radius</b>: it is half the diameter (' + t('r=' + N(2 * r) + '\\div 2=' + N(r)) + ').']);
    b.push([R + s * h * pi * r * 2, 'u3a-r-times-2', t('r^2') + ' means ' + t('r\\times r') + ', not ' + t('r\\times 2') + '. Use the ' + t('x^2') + ' key.']);
    b.push([R + s * h * pi * 2 * r, 'u3a-circumference', 'That uses the <b>circumference</b> (' + t('\\pi d') + '). For area use ' + t('\\pi r^2') + '.']);
    b.push([R + s * h * 2 * pi * 2 * r, 'u3a-circumference', 'That uses ' + t('\\pi\\times d') + ' (a length). For area use ' + t('\\pi r^2') + '.']);
    b.push([R + s * h * pi * r, 'u3a-no-square', 'Square the radius: ' + t('A=' + (half ? '\\tfrac{1}{2}' : '') + '\\pi r^2') + '.']);
    b.push([R + s * h * r * r, 'u3a-no-pi', 'Multiply by ' + t('\\pi') + ' too: ' + t('A=' + (half ? '\\tfrac{1}{2}' : '') + '\\pi r^2') + '.']);
    b.push([R + s * h * 3.14 * r * r, 'u3a-pi314', 'Use the ' + t('\\pi') + ' key on your calculator: 3.14 is a little off, and it changes the rounded answer.', 'form']);
    if (s < 0) b.push([R + h * pi * r * r, 'u3a-added-cut', 'The ' + (half ? 'semicircle' : 'circle') + ' is a <b>cut-out</b>: subtract it, don’t add it.']);
    return b;
  };

  /* ======================= SVG figures ======================= */
  var INK = '#2b3340', FILL = '#e6ecef', CUT = '#ffffff', WATER = '#d9e8f7', WATERL = '#2f5f8f', GRIDC = '#b8c0c8', ANS = '#9a6a24';
  A.COL = { INK: INK, FILL: FILL, CUT: CUT, WATER: WATER, WATERL: WATERL, GRIDC: GRIDC, ANS: ANS };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* a figure in grid units (y up). o: w, h (max px), pad, s (px per unit) */
  A.fig = function (x0, y0, x1, y1, o) {
    o = o || {}; var pad = o.pad == null ? 30 : o.pad, padL = o.padL == null ? pad : o.padL, padR = o.padR == null ? pad : o.padR, padT = o.padT == null ? pad : o.padT, padB = o.padB == null ? pad : o.padB;
    var mw = o.w || 280, mh = o.h || 210;
    var s = o.s || Math.min((mw - padL - padR) / Math.max(x1 - x0, 1e-9), (mh - padT - padB) / Math.max(y1 - y0, 1e-9));
    var W = (x1 - x0) * s + padL + padR, H = (y1 - y0) * s + padT + padB, b = '';
    function X(x) { return +(padL + (x - x0) * s).toFixed(1); }
    function Y(y) { return +(padT + (y1 - y) * s).toFixed(1); }
    function sty(st) { st = st || {}; return ' fill="' + (st.fill || 'none') + '" stroke="' + (st.stroke || INK) + '" stroke-width="' + (st.w == null ? 2 : st.w) + '"' + (st.dash ? ' stroke-dasharray="' + (st.dash === true ? '5 4' : st.dash) + '"' : '') + (st.op != null ? ' fill-opacity="' + st.op + '"' : '') + ' stroke-linejoin="round"' + (st.extra || ''); }
    var F = {
      s: s, X: X, Y: Y,
      poly: function (pts, st) { b += '<polygon points="' + pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '"' + sty(st) + '/>'; return F; },
      pline: function (pts, st) { b += '<polyline points="' + pts.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '"' + sty(st) + '/>'; return F; },
      line: function (a, c, st) { st = st || {}; b += '<line x1="' + X(a[0]) + '" y1="' + Y(a[1]) + '" x2="' + X(c[0]) + '" y2="' + Y(c[1]) + '"' + sty({ stroke: st.stroke, w: st.w == null ? 1.6 : st.w, dash: st.dash }) + ' stroke-linecap="round"/>'; return F; },
      rect: function (ax, ay, bx, by, st) { return F.poly([[ax, ay], [bx, ay], [bx, by], [ax, by]], st); },
      circle: function (cx, cy, r, st) { b += '<circle cx="' + X(cx) + '" cy="' + Y(cy) + '" r="' + (r * s).toFixed(1) + '"' + sty(st) + '/>'; return F; },
      dot: function (x, y, rpx, col) { b += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="' + (rpx || 2.5) + '" fill="' + (col || INK) + '"/>'; return F; },
      /* pos: 'above' | 'below' | 'left' | 'right' | 'c' (centred); o2: { size, col, dx, dy, italic, bold } */
      text: function (x, y, str, pos, o2) {
        o2 = o2 || {}; var dx = o2.dx || 0, dy = o2.dy || 0, anchor = 'middle', size = o2.size || 13;
        if (pos === 'above') dy -= 6; else if (pos === 'below') dy += size + 3; else if (pos === 'left') { dx -= 6; anchor = 'end'; dy += size * 0.35; } else if (pos === 'right') { dx += 6; anchor = 'start'; dy += size * 0.35; } else dy += size * 0.35;
        b += '<text x="' + (X(x) + dx).toFixed(1) + '" y="' + (Y(y) + dy).toFixed(1) + '" font-size="' + size + '" text-anchor="' + anchor + '" fill="' + (o2.col || INK) + '"' + (o2.italic ? ' font-style="italic"' : '') + (o2.bold ? ' font-weight="bold"' : '') + ' font-family="inherit"' + (o2.halo === false ? '' : ' stroke="#ffffff" stroke-width="3" stroke-linejoin="round" paint-order="stroke"') + '>' + esc(str) + '</text>';
        return F;
      },
      /* a right-angle mark at corner p, along unit directions u and v */
      ra: function (p, u, v, px) { var d = (px || 8) / s; return F.pline([[p[0] + u[0] * d, p[1] + u[1] * d], [p[0] + u[0] * d + v[0] * d, p[1] + u[1] * d + v[1] * d], [p[0] + v[0] * d, p[1] + v[1] * d]], { w: 1.2 }); },
      grid: function (gx0, gy0, gx1, gy1, st) { st = st || {}; for (var i = gx0; i <= gx1; i++) F.line([i, gy0], [i, gy1], { stroke: st.stroke || GRIDC, w: st.w || 0.8 }); for (var j = gy0; j <= gy1; j++) F.line([gx0, j], [gx1, j], { stroke: st.stroke || GRIDC, w: st.w || 0.8 }); return F; },
      raw: function (svg) { b += svg; return F; },
      svg: function (label, maxW) { return '<svg class="fig-svg" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" width="100%" style="max-width:' + Math.round(maxW || W) + 'px" role="img" aria-label="' + esc(label || 'figure') + '">' + b + '</svg>'; }
    };
    return F;
  };
  /* points on a circle arc, angles in degrees */
  A.arc = function (cx, cy, r, a0, a1, n) { n = n || 36; var out = []; for (var i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return out; };

  /* ======================= irregular shapes on a grid ======================= */
  function clipArea(pts, x0, y0, x1, y1) {
    function clip(Pp, inside, inter) { var out = []; for (var i = 0; i < Pp.length; i++) { var a = Pp[i], b = Pp[(i + 1) % Pp.length], ia = inside(a), ib = inside(b); if (ia) { out.push(a); if (!ib) out.push(inter(a, b)); } else if (ib) out.push(inter(a, b)); } return out; }
    var Pp = pts;
    Pp = clip(Pp, function (p) { return p[0] >= x0; }, function (a, b) { var k = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + k * (b[1] - a[1])]; }); if (!Pp.length) return 0;
    Pp = clip(Pp, function (p) { return p[0] <= x1; }, function (a, b) { var k = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + k * (b[1] - a[1])]; }); if (!Pp.length) return 0;
    Pp = clip(Pp, function (p) { return p[1] >= y0; }, function (a, b) { var k = (y0 - a[1]) / (b[1] - a[1]); return [a[0] + k * (b[0] - a[0]), y0]; }); if (!Pp.length) return 0;
    Pp = clip(Pp, function (p) { return p[1] <= y1; }, function (a, b) { var k = (y1 - a[1]) / (b[1] - a[1]); return [a[0] + k * (b[0] - a[0]), y1]; }); if (!Pp.length) return 0;
    var s2 = 0; for (var i = 0; i < Pp.length; i++) { var a = Pp[i], b = Pp[(i + 1) % Pp.length]; s2 += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s2) / 2;
  }
  /* A closed curve on a GW × GH grid. A blob of cells is chosen; the curve runs through the cells around it (each of them is
   * cut clearly: between 8% and 92% inside), so the full squares are the blob and the part squares are the ring. The counts
   * are then measured from the drawn curve itself. o: { full: [lo, hi], rx: [lo, hi], ry: [lo, hi], avoid: [[F, P]] } */
  var JIT = 0.24, SM = 0.2;
  A.blob = function (r, GW, GH, o) {
    o = o || {};
    var key = function (i, j) { return i + ',' + j; };
    function one() {
      var rx = o.rx ? o.rx[0] + r.next() * (o.rx[1] - o.rx[0]) : 1.6 + r.next() * 1.2, ry = o.ry ? o.ry[0] + r.next() * (o.ry[1] - o.ry[0]) : 1.3 + r.next() * 0.9;
      var cx = GW / 2 + (r.next() - 0.5), cy = GH / 2 + (r.next() - 0.5) * 0.8, a2 = r.next() * 0.15, p2 = r.next() * 6.28, a3 = r.next() * 0.12, p3 = r.next() * 6.28, R = {}, n = 0, i, j;
      for (i = 0; i < GW; i++) for (j = 0; j < GH; j++) { var x = i + 0.5 - cx, y = j + 0.5 - cy, th = Math.atan2(y, x), k = 1 + a2 * Math.cos(2 * th + p2) + a3 * Math.cos(3 * th + p3); if (x * x / (rx * rx) + y * y / (ry * ry) < k * k) { R[key(i, j)] = 1; n++; } }
      if (n < 4) return null;
      var ring = [], sx = 0, sy = 0;
      Object.keys(R).forEach(function (kk) { var pp = kk.split(','); sx += +pp[0] + 0.5; sy += +pp[1] + 0.5; }); sx /= n; sy /= n;
      for (i = 0; i < GW; i++) for (j = 0; j < GH; j++) {
        if (R[key(i, j)]) continue; var adj = false;
        for (var di = -1; di <= 1; di++) for (var dj = -1; dj <= 1; dj++) if (R[key(i + di, j + dj)]) adj = true;
        if (adj) { if (i === 0 || j === 0 || i === GW - 1 || j === GH - 1) return null; ring.push([i, j, Math.atan2(j + 0.5 - sy, i + 0.5 - sx)]); }
      }
      ring.sort(function (a, b) { return a[2] - b[2]; });
      for (var m = 0; m < ring.length; m++) { var a = ring[m], b = ring[(m + 1) % ring.length]; if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) !== 1) return null; }
      var c0 = ring.map(function (c) { return [c[0] + 0.5 + (r.next() - 0.5) * JIT, c[1] + 0.5 + (r.next() - 0.5) * JIT]; }), Nn = c0.length, pts = [];
      var cp = c0.map(function (c, k) { var a0 = c0[(k - 1 + Nn) % Nn], a1 = c0[(k + 1) % Nn]; return [SM * a0[0] + (1 - 2 * SM) * c[0] + SM * a1[0], SM * a0[1] + (1 - 2 * SM) * c[1] + SM * a1[1]]; });
      for (m = 0; m < Nn; m++) {
        var p0 = cp[(m - 1 + Nn) % Nn], p1 = cp[m], q2 = cp[(m + 1) % Nn], q3 = cp[(m + 2) % Nn];
        for (var st = 0; st < 6; st++) {
          var u = st / 6, u2 = u * u, u3 = u2 * u, cr = function (c) { return 0.5 * (2 * p1[c] + (-p0[c] + q2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * q2[c] - q3[c]) * u2 + (-p0[c] + 3 * p1[c] - 3 * q2[c] + q3[c]) * u3); };
          pts.push([cr(0), cr(1)]);
        }
      }
      var full = [], part = [], bad = false, i0 = 99, i1 = -1, j0 = 99, j1 = -1;
      for (i = 0; i < GW; i++) for (j = 0; j < GH; j++) {
        var ar = clipArea(pts, i, j, i + 1, j + 1);
        if (ar > 1 - 1e-9) full.push([i, j]); else if (ar > 1e-9) { if (ar < 0.08 || ar > 0.92) bad = true; part.push([i, j]); } else continue;
        i0 = Math.min(i0, i); i1 = Math.max(i1, i); j0 = Math.min(j0, j); j1 = Math.max(j1, j);
      }
      if (bad || full.length !== n || part.length !== ring.length) return null;
      var res = { pts: pts, full: full, part: part, F: full.length, P: part.length, box: { i0: i0, i1: i1 + 1, j0: j0, j1: j1 + 1, w: i1 + 1 - i0, h: j1 + 1 - j0 }, GW: GW, GH: GH };
      if (o.full && (res.F < o.full[0] || res.F > o.full[1])) return null;
      if (o.avoid && o.avoid.some(function (v) { return v[0] === res.F && v[1] === res.P; })) return null;
      if (o.test && !o.test(res)) return null;
      return res;
    }
    for (var tries = 0; tries < 400; tries++) { var b = one(); A.blobTries = tries + 1; if (b) return b; }
    throw new Error('u3l9: no blob');
  };
  /* the grid picture. o: { label, sol (mark full squares and dot part squares), box (draw the rectangle around), tap (tappable squares), px (square size), unitLab } */
  A.gridFig = function (b, o) {
    o = o || {}; var px = o.px || 26, GW = b.GW, GH = b.GH, F = A.fig(0, 0, GW, GH, { s: px, pad: 4, padB: 4 });
    F.poly(b.pts, { fill: o.fill || WATER, stroke: 'none', w: 0 });
    if (o.sol) { b.full.forEach(function (c) { F.rect(c[0], c[1], c[0] + 1, c[1] + 1, { fill: '#b8dfc0', stroke: 'none', w: 0, op: 0.85 }); }); }
    if (o.tap && !o.sol) {
      var cells = '';
      for (var i = 0; i < GW; i++) for (var j = 0; j < GH; j++) cells += '<rect x="' + F.X(i) + '" y="' + F.Y(j + 1) + '" width="' + px + '" height="' + px + '" fill="transparent" data-m="0" style="cursor:pointer" onclick="var m=((+this.getAttribute(\'data-m\')||0)+1)%3;this.setAttribute(\'data-m\',m);this.setAttribute(\'fill\',[\'transparent\',\'rgba(76,175,80,0.40)\',\'rgba(240,180,30,0.45)\'][m])"/>';
      F.raw(cells);
    }
    F.grid(0, 0, GW, GH);
    F.poly(b.pts, { fill: 'none', stroke: o.line || WATERL, w: 2.2, extra: ' pointer-events="none"' });
    if (o.sol) b.part.forEach(function (c) { F.dot(c[0] + 0.5, c[1] + 0.5, 3, ANS); });
    if (o.box) F.rect(b.box.i0, b.box.j0, b.box.i1, b.box.j1, { stroke: ANS, w: 2.4, dash: '6 4' });
    var svg = F.svg(o.label || 'shape on a grid');
    if (o.tap && !o.sol) svg += '<div class="muted" style="font-size:0.85em;margin-top:-4px">Tap a square to mark it while you count: once = full (green), twice = part (yellow), again = clear.</div>';
    return svg;
  };
  function cnt(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  /* ======================= lesson figures ======================= */
  var SH = { fill: FILL };
  function lab(F, x, y, s, pos, o2) { return F.text(x, y, s, pos, o2); }
  /* rectilinear shape on a 1 cm grid */
  function gridShape(pts, GW, GH, label) { var F = A.fig(0, 0, GW, GH, { s: 24, pad: 4 }); F.grid(0, 0, GW, GH); F.poly(pts, { fill: '#c9d3da', op: 0.75, w: 2.2 }); return F.svg(label || 'shape on a grid'); }
  /* an L with the corner cut out at the top right: bottom W, right height hr, top width tw, left height H (cut at top right) */
  function lShapeTR(W, H, tw, hr, labs, o) {
    o = o || {}; var F = A.fig(0, 0, W, H, { w: o.w || 230, h: o.h || 190, pad: 34 });
    F.poly([[0, 0], [W, 0], [W, hr], [tw, hr], [tw, H], [0, H]], SH);
    if (labs.b) lab(F, W / 2, 0, labs.b, 'below'); if (labs.r) lab(F, W, hr / 2, labs.r, 'right'); if (labs.it) lab(F, (tw + W) / 2, hr, labs.it, 'above');
    if (labs.iv) lab(F, tw, (hr + H) / 2, labs.iv, 'right'); if (labs.t) lab(F, tw / 2, H, labs.t, 'above'); if (labs.l) lab(F, 0, H / 2, labs.l, 'left');
    return F.svg(o.label || 'L-shaped floor plan');
  }
  /* an L with the corner cut out at the top LEFT: bottom W, right height H, top width tw (at the right), left height lh */
  function lShapeTL(W, H, tw, lh, labs, o) {
    o = o || {}; var F = A.fig(0, 0, W, H, { w: o.w || 230, h: o.h || 190, pad: 34 });
    F.poly([[0, 0], [W, 0], [W, H], [W - tw, H], [W - tw, lh], [0, lh]], SH);
    if (labs.b) lab(F, W / 2, 0, labs.b, 'below'); if (labs.r) lab(F, W, H / 2, labs.r, 'right'); if (labs.t) lab(F, W - tw / 2, H, labs.t, 'above');
    if (labs.l) lab(F, 0, lh / 2, labs.l, 'left'); if (labs.it) lab(F, (W - tw) / 2, lh, labs.it, 'above', { italic: labs.itI }); if (labs.iv) lab(F, W - tw, (lh + H) / 2, labs.iv, 'left', { italic: labs.ivI });
    return F.svg(o.label || 'L-shaped plan');
  }

  /* ======================= part builders ======================= */
  var SQ = { m: 'm²', cm: 'cm²', ft: 'ft²', in: 'in²', yd: 'yd²', km: 'km²' };
  function area(prompt, ans, u, o) { o = o || {}; o.after = SQ[u] || u; if (o.dp == null && !o.money) o.exactOk = true; return A.num(prompt, ans, o); }

  /* Q1: count the squares of a rectilinear shape */
  function countPart(kind, r) {
    var GW = 8, GH = 6, v, pts, A0, bb, per, split;
    if (kind === 'T') {
      v = find(function () { var W = r.int(4, 7), h1 = r.int(1, 2), sw = r.int(1, 3), hs = r.int(2, 3), bx = r.int(0, GW - W), y0 = r.int(0, GH - h1 - hs), sx = bx + r.int(1, Math.max(1, W - sw - 1)); return { W: W, h1: h1, sw: sw, hs: hs, bx: bx, y0: y0, sx: sx }; },
        function (v) { return v.sw < v.W - 1 && v.sx > v.bx && v.sx + v.sw < v.bx + v.W && v.y0 + v.hs + v.h1 <= GH; });
      var yT = v.y0 + v.hs + v.h1;
      pts = [[v.bx, yT], [v.bx + v.W, yT], [v.bx + v.W, yT - v.h1], [v.sx + v.sw, yT - v.h1], [v.sx + v.sw, v.y0], [v.sx, v.y0], [v.sx, yT - v.h1], [v.bx, yT - v.h1]];
      A0 = v.W * v.h1 + v.sw * v.hs; bb = v.W * (v.h1 + v.hs); per = 2 * (v.W + v.h1 + v.hs);
      split = 'Check: top ' + t(v.W + '\\times ' + v.h1 + '=' + v.W * v.h1) + ', stem ' + t(v.sw + '\\times ' + v.hs + '=' + v.sw * v.hs) + '; ' + t(v.W * v.h1 + '+' + v.sw * v.hs + '=' + A0 + uT('cm²'));
    } else {
      v = find(function () { var W = r.int(5, 7), hb = r.int(1, 2), pw = r.int(1, 2), ph = r.int(1, 3), bx = r.int(0, GW - W), y0 = r.int(0, GH - hb - ph); return { W: W, hb: hb, pw: pw, ph: ph, bx: bx, y0: y0 }; },
        function (v) { return v.W - 2 * v.pw >= 1 && v.y0 + v.hb + v.ph <= GH; });
      var yt = v.y0 + v.hb + v.ph, y1 = v.y0 + v.hb;
      pts = [[v.bx, v.y0], [v.bx + v.W, v.y0], [v.bx + v.W, yt], [v.bx + v.W - v.pw, yt], [v.bx + v.W - v.pw, y1], [v.bx + v.pw, y1], [v.bx + v.pw, yt], [v.bx, yt]];
      A0 = v.W * v.hb + 2 * v.pw * v.ph; bb = v.W * (v.hb + v.ph); per = 2 * (v.W + v.hb + v.ph) + 2 * v.ph;
      split = 'Check: bottom ' + t(v.W + '\\times ' + v.hb + '=' + v.W * v.hb) + ', two posts ' + t(v.pw + '\\times ' + v.ph + '=' + v.pw * v.ph) + ' each; ' + t(v.W * v.hb + '+' + v.pw * v.ph + '+' + v.pw * v.ph + '=' + A0 + uT('cm²'));
    }
    return area(gridShape(pts, GW, GH) + 'Find the area of the shape by counting squares.', A0, 'cm', {
      bad: [[per, 'u3l9-perimeter', 'That’s the <b>perimeter</b> (the distance around the edge). Area is the number of squares <b>inside</b> the shape.'], [bb, 'u3l9-box', 'That counts the empty squares in the gaps too. Count only the shaded squares.']],
      miss: 'Count again: tap or mark each shaded square once as you count it.',
      sol: ['Count: ' + A0 + ' squares, so ' + t(A0 + uT('cm²')), split], hints: ['Each square is 1 cm². Count the squares inside the shape.'], text: 'count ' + kind });
  }

  /* an L with all six sides labelled (Q2a): bottom W, right hb, inner top W−tw, inner side th, top tw, left hb+th */
  function lAllPart(r, u, o) {
    o = o || {};
    var v = find(function () { var W = r.int(5, 10), hb = r.int(2, 4), tw = r.int(2, W - 2), th = r.int(2, 5); return { W: W, hb: hb, tw: tw, th: th }; }, function (v) { return v.W - v.tw >= 2 && !(v.W === 9 && v.hb + v.th === 7); });
    var H = v.hb + v.th, ans = v.W * v.hb + v.tw * v.th;
    var fig = lShapeTR(v.W, H, v.tw, v.hb, { b: v.W + ' ' + u, r: v.hb + ' ' + u, it: (v.W - v.tw) + ' ' + u, iv: v.th + ' ' + u, t: v.tw + ' ' + u, l: H + ' ' + u });
    return area(fig + (o.prompt || ''), ans, u, {
      bad: [[v.W * H, 'u3l9-no-cut', 'That’s the area of the whole rectangle around the shape. The top-right corner is missing: split the shape into two rectangles and add them.'], [v.W * v.hb + v.tw * H, 'u3l9-overlap', 'Your two rectangles overlap: the ' + v.tw + ' by ' + v.hb + ' corner is counted twice. The top rectangle is only ' + v.th + ' ' + u + ' tall.'],
        [2 * (v.W + H), 'u3l9-perimeter', 'That’s the perimeter (adding the sides). Area: split into rectangles and multiply length × width.'], [v.W * v.hb, 'u3l9-one-part', 'That’s only the bottom rectangle. Add the top part too.']],
      sol: ['Bottom: ' + t(v.W + '\\times ' + v.hb + '=' + v.W * v.hb + uT(u + '²')), 'Top: ' + t(v.tw + '\\times ' + v.th + '=' + v.tw * v.th + uT(u + '²')), 'Total: ' + t(v.W * v.hb + '+' + v.tw * v.th + '=' + ans + uT(u + '²'))],
      hints: ['Draw a line to split the shape into two rectangles that don’t overlap.'], text: 'L all sides' });
  }

  /* rectangle + triangle (home plate / pointed sign), triangle below: width W, rectangle height a, triangle height b */
  function plateFig(W, a, b, u) {
    var F = A.fig(0, 0, W, a + b, { w: 210, h: 200, pad: 34 });
    F.poly([[0, a + b], [W, a + b], [W, b], [W / 2, 0], [0, b]], SH); F.line([0, b], [W, b], { dash: true, w: 1.2 }); F.line([W / 2, b], [W / 2, 0], { dash: true, w: 1.2 });
    F.ra([W / 2, b], [1, 0], [0, -1], 7);
    lab(F, W / 2, a + b, fh(W) + ' ' + u, 'above'); lab(F, 0, b + a / 2, fh(a) + ' ' + u, 'left'); lab(F, W / 2, b / 2, fh(b) + ' ' + u, 'right');
    return F.svg('rectangle with a triangle point');
  }
  function platePart(r) {
    var v = r.chance(0.3) ? { W: 17, a: 8.5, b: 8.5, plate: true } : find(function () { return { W: r.pick([12, 14, 15, 16, 18, 20]), a: pickR(r, 5, 10, 0.5), b: pickR(r, 4, 8, 0.5) }; }, function (v) { return !isInt(v.a) || !isInt(v.b) || v.W % 2; });
    var R1 = v.W * v.a, T1 = v.W * v.b / 2, ans = R1 + T1;
    return area((v.plate ? 'A baseball home plate.' : 'A wooden sign is a rectangle with a triangle point on the bottom.') + plateFig(v.W, v.a, v.b, 'in'), ans, 'in', {
      bad: [[R1 + v.W * v.b, 'u3l9-no-half', 'The triangle is half of a rectangle: its area is ' + t('\\tfrac{1}{2}\\times b\\times h') + '. Don’t forget the ' + t('\\tfrac{1}{2}') + '.'], [R1, 'u3l9-one-part', 'That’s only the rectangle. Add the triangle.'], [T1, 'u3l9-one-part', 'That’s only the triangle. Add the rectangle.'], [ans / 2, 'u3l9-half-all', 'Only the triangle gets the ' + t('\\tfrac{1}{2}') + '. The rectangle is length × width.']],
      sol: ['Rectangle: ' + t(N(v.W) + '\\times ' + N(v.a) + '=' + N(R1) + uT('in²')), 'Triangle: ' + t('\\tfrac{1}{2}\\times ' + N(v.W) + '\\times ' + N(v.b) + '=' + N(T1) + uT('in²')), 'Total: ' + t(N(R1) + '+' + N(T1) + '=' + N(ans) + uT('in²')) + (frOf(ans).f && !isInt(ans) ? ' (' + t(mixT(ans) + uT('in²')) + ')' : '')],
      hints: ['Split it into a rectangle and a triangle. Triangle: ' + t('A=\\tfrac{1}{2}bh') + '.', 'Change fractions to decimals first: ' + t('\\tfrac{1}{2}=0.5') + '.'], text: 'rect + triangle' });
  }

  /* L-deck with letters for the missing sides (Q3, EP A2). shared: W, H, tw, lh, x = W − tw, y = H − lh */
  function deckShared(r, rg, u, letters) {
    var v = find(function () { return { W: r.int(rg.W[0], rg.W[1]), H: r.int(rg.H[0], rg.H[1]), tw: r.int(rg.tw[0], rg.tw[1]), lh: r.int(rg.lh[0], rg.lh[1]) }; },
      function (v) { return v.W - v.tw >= 2 && v.H - v.lh >= 2 && !(v.W === 9 && v.H === 7) && !(v.W === 12 && v.H === 8); });
    v.x = v.W - v.tw; v.y = v.H - v.lh; v.u = u; v.L = letters;
    v.fig = lShapeTL(v.W, v.H, v.tw, v.lh, { b: v.W + ' ' + u, r: v.H + ' ' + u, t: v.tw + ' ' + u, l: v.lh + ' ' + u, it: letters[0], iv: letters[1], itI: true, ivI: true });
    return v;
  }
  function deckSides(sh) {
    var L = sh.L, u = sh.u;
    return A.fields('Find ' + t(L[0]) + ' and ' + t(L[1]) + '.', [
      { label: t(L[0] + '=') , name: L[0], ans: sh.x, after: u, bad: [[sh.W + sh.tw, 'u3l9-side-add', t(L[0]) + ' and the ' + sh.tw + ' ' + u + ' top together are as long as the ' + sh.W + ' ' + u + ' bottom. Subtract.'], [sh.tw, 'u3l9-side-copy', 'Look across the shape: ' + t(L[0]) + ' + ' + sh.tw + ' = ' + sh.W + '.']] },
      { label: t(L[1] + '='), name: L[1], ans: sh.y, after: u, bad: [[sh.H + sh.lh, 'u3l9-side-add', t(L[1]) + ' and the ' + sh.lh + ' ' + u + ' left side together are as tall as the ' + sh.H + ' ' + u + ' right side. Subtract.'], [sh.lh, 'u3l9-side-copy', 'Look across the shape: ' + t(L[1]) + ' + ' + sh.lh + ' = ' + sh.H + '.']] }],
      [t(L[0] + '=' + sh.W + '-' + sh.tw + '=' + sh.x + uT(u)) + ' &nbsp; ' + t(L[1] + '=' + sh.H + '-' + sh.lh + '=' + sh.y + uT(u))], ['The short sides on one side add up to the long side on the other side.'], 'missing sides');
  }
  function deckSplit(sh, prompt) {
    var u = sh.u, a1 = sh.W * sh.lh, a2 = sh.tw * sh.y, ans = a1 + a2;
    return area(prompt || 'Find the area by splitting and adding.', ans, u, {
      bad: [[sh.W * sh.H, 'u3l9-no-cut', 'That’s the whole rectangle around the shape. The top-left corner is missing.'], [a1 + sh.tw * sh.H, 'u3l9-overlap', 'Your rectangles overlap: the part above the bottom rectangle is only ' + t(sh.L[1] + '=' + sh.y) + ' ' + u + ' tall.'], [a1, 'u3l9-one-part', 'That’s only the bottom rectangle. Add the top part.'], [sh.x * sh.y, 'u3l9-cutout', 'That’s the empty corner (the cut-out), not the ' + (u === 'ft' ? 'floor' : 'shape') + '.'], [2 * (sh.W + sh.H), 'u3l9-perimeter', 'That’s the perimeter. Split into rectangles and multiply.']],
      sol: ['Bottom: ' + t(sh.W + '\\times ' + sh.lh + '=' + a1 + uT(u + '²')) + '; top right: ' + t(sh.tw + '\\times ' + sh.y + '=' + a2 + uT(u + '²')), 'Total: ' + t(a1 + '+' + a2 + '=' + ans + uT(u + '²'))],
      hints: ['Split with a horizontal line into a bottom rectangle (' + sh.W + ' by ' + sh.lh + ') and a top rectangle.'], text: 'split and add' });
  }
  function wholeMinus(prompt, whole, cut, u, solW, solC, o) {
    o = o || {}; var ans = whole - cut;
    return A.fields(prompt, [
      { label: 'Whole:', name: 'whole', ans: whole, after: SQ[u], exactOk: true, bad: o.badW || [] },
      { label: 'Cut-out:', name: 'cut-out', ans: cut, after: SQ[u], exactOk: true, bad: o.badC || [] },
      { label: 'Area:', name: 'area', ans: ans, after: SQ[u], exactOk: true, bad: [[whole + cut, 'u3l9-added-cut', 'Subtract the cut-out from the whole.']].concat(o.badA || []) }],
      ['Whole: ' + solW + ' &nbsp; cut-out: ' + solC, t(N(whole) + '-' + N(cut) + '=' + N(ans) + uT(SQ[u])) + (o.same ? ' (the same)' : '')], o.hints || ['Find the area of the whole rectangle, then subtract the missing corner.'], o.text || 'whole minus cut-out');
  }

  /* rectangle with a semicircle on one side. side: 'bottom' (front of a stage), 'right' (rug end), 'top' (arched door) */
  function semiFig(L, D, side, o) {
    o = o || {}; var r = (side === 'right' ? D : L) / 2, F;
    if (side === 'bottom') { F = A.fig(0, -r, L, D, { w: 220, h: 200, pad: 32 }); F.poly([[0, D], [L, D], [L, 0]].concat(A.arc(L / 2, 0, r, 0, -180, 40)).concat([[0, 0]]), SH); F.line([0, 0], [L, 0], { dash: true, w: 1.2 }); lab(F, L / 2, D, o.lw || L + ' m', 'above'); lab(F, 0, D / 2, o.ld || D + ' m', 'left'); if (o.front) lab(F, L / 2, -r * 0.55, o.front, 'c', { size: 12 }); }
    else if (side === 'right') { F = A.fig(0, 0, L + r, D, { w: 240, h: 170, pad: 32 }); F.poly([[0, 0], [L, 0]].concat(A.arc(L, D / 2, r, -90, 90, 40)).concat([[L, D], [0, D]]), SH); F.line([L, 0], [L, D], { dash: true, w: 1.2 }); lab(F, L / 2, 0, o.lw || L + ' m', 'below'); lab(F, 0, D / 2, o.ld || D + ' m', 'left'); }
    else { F = A.fig(0, 0, L, D + r, { w: 170, h: 220, pad: 34 }); F.poly([[0, 0], [L, 0], [L, D]].concat(A.arc(L / 2, D, r, 0, 180, 40)).concat([[0, D]]), SH); F.line([0, D], [L, D], { dash: true, w: 1.2 }); lab(F, L / 2, 0, o.lw || L + ' m', 'below'); lab(F, 0, D / 2, o.ld || D + ' m', 'left'); }
    return F.svg(o.label || 'rectangle with a semicircle');
  }
  /* area of a rectangle L × D with a semicircle of diameter d */
  function semiPart(prompt, L, D, d, u, dp, o) {
    o = o || {}; var R1 = L * D, rr = d / 2, S = 0.5 * Math.PI * rr * rr, ans = R1 + S;
    return area(prompt, ans, u, { dp: dp, exact: ans, nr: o.nr,
      bad: A.circBad(R1, rr, 1, true).concat([[S, 'u3l9-one-part', 'That’s only the semicircle. Add the rectangle.'], [R1, 'u3l9-one-part', 'That’s only the rectangle. Add the semicircle.']]),
      sol: ['Rectangle: ' + t(N(L) + '\\times ' + N(D) + '=' + N(R1) + uT(u + '²')), semiSol(S, rr, d, u), 'Total: ' + t(N(R1) + '+' + C().raw(S, 4) + eqR(ans, dp) + uT(u + '²'))],
      hints: ['Rectangle + semicircle. The radius is half of the ' + N(d) + ' ' + u + ' side.', 'Semicircle: ' + t('A=\\tfrac{1}{2}\\pi r^2') + '. Keep all the digits until the end, then round.'], text: o.text || 'rect + semicircle' });
  }
  function semiSol(S, rr, d, u) { return 'Semicircle: ' + t('r=' + N(d) + '\\div 2=' + N(rr)) + ', ' + t('\\tfrac{1}{2}\\times\\pi\\times ' + N(rr) + '^2=' + C().raw(S, 4) + uT(u + '²')); }

  /* rectangle with a round hole / pit cut out */
  function holePart(prompt, L, D, d, u, dp, o) {
    o = o || {}; var R1 = L * D, rr = d / 2, Ci = Math.PI * rr * rr, ans = R1 - Ci;
    return area(prompt, ans, u, { dp: dp, exact: ans,
      bad: A.circBad(R1, rr, -1, false).concat([[Ci, 'u3l9-cutout', 'That’s the area of the circle (the cut-out). Subtract it from the whole.'], [R1, 'u3l9-no-cut', 'That’s the whole rectangle. Subtract the circle.']]),
      sol: ['Whole: ' + t(N(L) + '\\times ' + N(D) + '=' + N(R1) + uT(u + '²')), o.circName + ': ' + t('r=' + N(d) + '\\div 2=' + N(rr) + uT(u)) + ', ' + t('\\pi\\times ' + N(rr) + '^2=' + C().raw(Ci, 4) + uT(u + '²')), (o.what || 'Left') + ': ' + t(N(R1) + '-' + C().raw(Ci, 4) + eqR(ans, dp) + uT(u + '²'))],
      hints: ['Whole minus cut-out. The radius is half of ' + N(d) + ' ' + u + '.'], text: o.text || 'rect - circle' });
  }
  /* how many (sheets, cans, boxes) — round up. need: amount, each: amount per item */
  function countUp(prompt, need, each, o) {
    o = o || {}; var n = ceil(need / each);
    return A.num(prompt, n, { dp: 0, after: o.unit,
      bad: [[Math.floor(q(need / each) + 1e-9), 'u3l9-round-down', 'You can’t buy part of ' + (o.one || 'one') + ', and fewer would not be enough. Round <b>up</b>.'], [need / each, 'u3l9-not-whole', 'Right division — now give a whole number. You can’t buy part of ' + (o.one || 'one') + ', so round <b>up</b>.', 'form']].concat(o.bad || []),
      sol: (o.pre || []).concat([t(N(need) + '\\div ' + N(each) + '=' + C().raw(need / each, 3)) + '. Round <b>up</b>: ' + n + ' ' + (o.unit || '') + '.']), hints: o.hints || ['Divide the area by the area one ' + (o.oneName || 'item') + ' covers, then round up.'], text: o.text || 'round up' });
  }

  /* grid estimate as boxes: full, part, (part ÷ 2), estimate */
  function gridTable(b, k, u, o) {
    o = o || {}; var sq = k * k, est = (b.F + b.P / 2) * sq, rows = [
      { label: 'Full squares:', name: 'full squares', ans: b.F, miss: 'Count again: a full square is completely inside the edge. Tap each one on the grid as you count it.' },
      { label: 'Part squares:', name: 'part squares', ans: b.P, bad: [[b.P + b.F, 'u3l9-all-squares', 'Count only the squares that the edge cuts through (not the full ones).']], miss: 'Count again: a part square is cut by the edge of the shape. Go around the edge and tap each one.' }];
    if (o.half) rows.push({ label: 'Part squares ÷ 2:', name: 'part ÷ 2', ans: b.P / 2, exactOk: true, bad: [[b.P * 2, 'u3l9-half-times', 'Divide the part squares by 2 (two part squares make about one full square).']] });
    rows.push({ label: o.estLab || 'Estimate of area:', name: 'estimate', ans: est, after: SQ[u], exactOk: true, bad: [
      [(b.F + b.P) * sq, 'u3l9-part-full', 'You counted every part square as a <b>full</b> square. Part squares count as about half: use part ÷ 2.'], [b.F * sq, 'u3l9-no-part', 'You left out the part squares. Add part ÷ 2.'],
      [b.F + b.P / 2, 'u3l9-no-unit', 'That’s the number of squares. Each square stands for ' + N(sq) + ' ' + SQ[u] + ', so multiply by ' + N(sq) + '.'], [(b.F + b.P / 2) * k, 'u3l9-side-not-area', 'Multiply by the <b>area</b> of one square (' + t(k + '\\times ' + k + '=' + sq) + '), not by its side.']].filter(function (x) { return sq !== 1 || x[1] === 'u3l9-part-full' || x[1] === 'u3l9-no-part'; }) });
    return A.fields(o.prompt || 'Complete the table.', rows,
      ['Full: ' + b.F + ' &nbsp; Part: ' + b.P + ' &nbsp; ' + t(b.P + '\\div 2=' + N(b.P / 2)), t(b.F + '+' + N(b.P / 2) + '=' + N(b.F + b.P / 2)) + ' squares' + (sq === 1 ? ', so about ' + t(N(est) + uT(SQ[u])) : ''), sq === 1 ? '' : t(N(b.F + b.P / 2) + '\\times ' + N(sq) + '=' + N(est) + uT(SQ[u])), A.gridFig(b, { sol: true, px: 16, label: 'counted squares' })],
      ['Area ≈ (full + part ÷ 2) × area of one square.', 'Tap the squares to mark them as you count, so you don’t count one twice.'], o.text || 'grid estimate');
  }

  /* ======================= the lesson ======================= */
  HW.defineLesson({
    id: 'u3l9', unit: 3, num: '9', title: 'Composite and Irregular Shapes', outcome: 'M4',
    blurb: 'Areas of shapes made of rectangles, triangles and half circles; whole minus cut-out; estimating irregular areas on a grid; checking a second way.',
    questions: [
      { num: '1', stem: 'Each square on the grid is 1 cm by 1 cm.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { return countPart('T', r); } },
        { id: '1b', level: 'BEG', make: function (r) { return countPart('U', r); } }] },
      { num: '2', stem: 'Find the area of each composite shape. All the corners that look square are square.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return lAllPart(r, 'm'); } },
        { id: '2b', level: 'PRG', make: function (r) { return platePart(r); } }] },
      { num: '3', stem: function (sh) { return 'The plan shows an L-shaped deck. All the corners are square.' + sh.fig; },
        shared: function (r) { return deckShared(r, { W: [9, 14], H: [7, 11], tw: [3, 5], lh: [3, 5] }, 'ft', ['x', 'y']); },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { return deckSides(sh); } },
          { id: '3b', level: 'EMG', make: function (r, sh) { return deckSplit(sh, 'Find the area of the deck by splitting and adding.'); } },
          { id: '3c', level: 'EMG', make: function (r, sh) { return wholeMinus('Check your answer using whole minus cut-out.', sh.W * sh.H, sh.x * sh.y, 'ft', t(sh.W + '\\times ' + sh.H + '=' + sh.W * sh.H), t('x\\times y=' + sh.x + '\\times ' + sh.y + '=' + sh.x * sh.y), { same: true, badC: [[sh.tw * sh.lh, 'u3l9-wrong-cut', 'The cut-out is the empty corner at the top left: it is ' + t('x') + ' by ' + t('y') + '.']], badW: [[2 * (sh.W + sh.H), 'u3l9-perimeter', 'Area of the whole rectangle: ' + sh.W + ' × ' + sh.H + '.']] }); } }] },
      { num: '4', parts: [
        { id: '4', level: 'PRG', make: function (r) {
          var v = find(function () { return { W: r.pick([6, 7, 8, 9, 10, 12]), D: r.int(3, 7) }; }, function (v) { return v.D < v.W; });
          return semiPart('The floor of a school stage is a rectangle ' + v.W + ' m wide and ' + v.D + ' m deep, with a semicircle across the front. Find the area of the stage floor, to the nearest tenth of a square metre.' + semiFig(v.W, v.D, 'bottom', { front: 'front' }), v.W, v.D, v.W, 'm', 1, { text: 'stage' });
        } }] },
      { num: '5', stem: function (sh) { return 'Diego is building the floor of a shed with a porch. The shed is a rectangle ' + sh.L + ' ft by ' + sh.D + ' ft. The porch is a trapezoid.' + sh.fig; },
        shared: function (r) {
          var v = find(function () { var L = r.pick([10, 12, 14, 16]); return { L: L, D: r.int(6, 10), b: r.int(L - 6, L - 3), h: r.int(3, 5) }; }, function (v) { v.Tp = (v.L + v.b) * v.h / 2; v.T = v.L * v.D + v.Tp; return !isInt(v.T / 32) && Math.floor(v.T / 32) >= 2 && isInt(v.Tp * 2); });
          var F = A.fig(0, -v.h, v.L, v.D, { w: 220, h: 210, pad: 32 });
          F.rect(0, 0, v.L, v.D, SH); lab(F, v.L / 2, v.D / 2, 'shed', 'c'); F.poly([[0, 0], [v.L, 0], [(v.L + v.b) / 2, -v.h], [(v.L - v.b) / 2, -v.h]], SH); lab(F, v.L / 2, -v.h * 0.4, 'porch', 'c', { size: 12 });
          F.line([(v.L + v.b) / 2, 0], [(v.L + v.b) / 2, -v.h], { dash: true, w: 1.2 });
          lab(F, v.L / 2, v.D, v.L + ' ft', 'above'); lab(F, 0, v.D / 2, v.D + ' ft', 'left'); lab(F, v.L / 2, -v.h, v.b + ' ft', 'below'); lab(F, (v.L + v.b) / 2, -v.h / 2, v.h + ' ft', 'right');
          v.fig = F.svg('shed and porch'); return v;
        },
        parts: [
          { id: '5a', level: 'PRG', make: function (r, sh) {
            var S = sh.L * sh.D;
            return area('Find the total floor area. (Trapezoid: ' + t('A=\\tfrac{1}{2}(a+b)h') + ')', sh.T, 'ft', {
              bad: [[S + (sh.L + sh.b) * sh.h, 'u3l9-no-half', 'The trapezoid area is ' + t('\\tfrac{1}{2}(a+b)h') + ': don’t forget the ' + t('\\tfrac{1}{2}') + '.'], [S, 'u3l9-one-part', 'That’s only the shed. Add the porch.'], [sh.Tp, 'u3l9-one-part', 'That’s only the porch. Add the shed.'], [S + sh.L * sh.h, 'u3l9-trap-rect', 'The porch is not a rectangle: its two parallel sides are ' + sh.L + ' ft and ' + sh.b + ' ft. Use ' + t('\\tfrac{1}{2}(a+b)h') + '.'], [S + sh.L * sh.h / 2, 'u3l9-trap-tri', 'The porch is a trapezoid, not a triangle: ' + t('\\tfrac{1}{2}(a+b)h') + '.']],
              sol: ['Shed: ' + t(sh.L + '\\times ' + sh.D + '=' + S + uT('ft²')), 'Porch: ' + t('\\tfrac{1}{2}\\times(' + sh.L + '+' + sh.b + ')\\times ' + sh.h + '=' + N(sh.Tp) + uT('ft²')), 'Total: ' + t(S + '+' + N(sh.Tp) + '=' + N(sh.T) + uT('ft²'))], hints: ['Shed (rectangle) + porch (trapezoid).'], text: 'shed + porch' });
          } },
          { id: '5b', level: 'PRG', make: function (r, sh) { return countUp('A sheet of plywood is 4 ft by 8 ft. How many sheets does Diego need? (Ignore waste.)', sh.T, 32, { unit: 'sheets', one: 'a sheet', oneName: 'sheet', pre: ['One sheet: ' + t('4\\times 8=32' + uT('ft²'))], bad: [[sh.T / 4, 'u3l9-sheet-side', 'One sheet covers ' + t('4\\times 8=32') + ' ft². Divide by 32.'], [sh.T / 8, 'u3l9-sheet-side', 'One sheet covers ' + t('4\\times 8=32') + ' ft². Divide by 32.'], [ceil(sh.T / 12), 'u3l9-sheet-side', 'One sheet covers ' + t('4\\times 8=32') + ' ft² (not 4 + 8). Divide by 32.']], hints: ['Find the area of one sheet, divide, then round up.'], text: 'plywood sheets' }); } }] },
      { num: '6', parts: [
        { id: '6', level: 'EMG', make: function (r) {
          var v = find(function () { var o = r.pick([[8, 10], [11, 14], [12, 16], [16, 20], [9, 12]]); return { A: o[0], B: o[1], a: pickR(r, o[0] - 4, o[0] - 2, 0.5), b: pickR(r, o[1] - 5, o[1] - 3, 0.5) }; }, function (v) { return (!isInt(v.a) || !isInt(v.b)) && v.a < v.b; });
          var W0 = v.A * v.B, I0 = v.a * v.b, ans = W0 - I0;
          var F = A.fig(0, 0, v.A, v.B, { w: 160, h: 190, pad: 30 }); F.rect(0, 0, v.A, v.B, SH); F.rect((v.A - v.a) / 2, (v.B - v.b) / 2, (v.A + v.a) / 2, (v.B + v.b) / 2, { fill: CUT }); lab(F, v.A / 2, v.B / 2, 'photo', 'c'); lab(F, v.A / 2, 0, v.A + ' in', 'below'); lab(F, 0, v.B / 2, v.B + ' in', 'left');
          return area('A picture mat is a rectangle ' + v.A + ' in by ' + v.B + ' in. A rectangle ' + t(mixT(v.a)) + ' in by ' + t(mixT(v.b)) + ' in is cut out of the middle for the photo. Find the area of the mat that is left.' + F.svg('picture mat'), ans, 'in', {
            bad: [[W0 + I0, 'u3l9-added-cut', 'The photo opening is cut <b>out</b>: subtract its area from the whole mat.'], [I0, 'u3l9-cutout', 'That’s the area of the opening. Subtract it from the whole mat.'], [W0, 'u3l9-no-cut', 'That’s the whole mat. Subtract the opening.'], [(v.A - v.a) * (v.B - v.b), 'u3l9-diff-mult', 'Subtract the <b>areas</b>, not the lengths: ' + t(v.A + '\\times ' + v.B) + ' minus ' + t(N(v.a) + '\\times ' + N(v.b)) + '.'], [W0 - v.A * v.b, 'u3l9-wrong-cut', 'The opening is ' + N(v.a) + ' in by ' + N(v.b) + ' in. Change the fractions to decimals.'], [W0 - Math.floor(v.a) * Math.floor(v.b), 'u3l9-frac-drop', 'Keep the fractions of an inch: ' + t(mixT(v.a) + '=' + N(v.a)) + ', ' + t(mixT(v.b) + '=' + N(v.b)) + '.']],
            sol: ['Whole: ' + t(v.A + '\\times ' + v.B + '=' + W0 + uT('in²')), 'Cut-out: ' + t(N(v.a) + '\\times ' + N(v.b) + '=' + N(I0) + uT('in²')), 'Mat: ' + t(W0 + '-' + N(I0) + '=' + N(ans) + uT('in²')) + (isInt(ans) ? '' : ' (' + t(mixT(ans) + uT('in²')) + ')')],
            hints: ['Whole minus cut-out. Change the fractions to decimals: ' + t('\\tfrac{1}{2}=0.5') + '.'], text: 'mat' });
        } }] },
      { num: '7', stem: function (sh) { return 'A square patio is ' + N(sh.s) + ' m by ' + N(sh.s) + ' m. A round fire pit ' + N(sh.d) + ' m across sits in the middle. The rest of the patio is covered with paving stones.'; },
        shared: function (r) { return find(function () { var v = { s: r.pick([4, 4.5, 5, 5.5, 6, 7, 8]), d: r.pick([0.8, 0.9, 1, 1.2, 1.4, 1.5, 1.6, 1.8]), c: r.pick([8, 10, 12, 15]) }; v.A = rd(v.s * v.s - Math.PI * v.d * v.d / 4, 2); return v; }, function (v) { return !isInt(v.A / v.c) && !(v.s === 6 && v.d === 1.2 && v.c === 10); }); },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return holePart('Find the area covered with paving stones, to the nearest hundredth of a square metre.', sh.s, sh.s, sh.d, 'm', 2, { circName: 'Fire pit', what: 'Paving stones', text: 'patio' }); } },
          { id: '7b', level: 'EMG', make: function (r, sh) { return countUp('One pallet of paving stones covers ' + sh.c + ' m². How many pallets are needed?', sh.A, sh.c, { unit: 'pallets', one: 'a pallet', oneName: 'pallet', text: 'pallets' }); } }] },
      { num: '8', stem: function (sh) { return 'Aisha is painting a feature wall ' + sh.L + ' ft long and ' + sh.H + ' ft high. The wall has two windows, each ' + sh.w + ' ft wide and ' + ftin(sh.hf, sh.hi) + ' high.'; },
        shared: function (r) { return find(function () { var v = { L: r.int(12, 18), H: r.int(8, 10), w: r.int(2, 4), hf: r.int(3, 5), hi: r.pick([3, 6, 9]), c: r.pick([80, 90, 100, 110]) }; v.hh = v.hf + v.hi / 12; v.A = v.L * v.H - 2 * v.w * v.hh; return v; }, function (v) { return 2 * v.w + 4 <= v.L && v.hh + 2 < v.H && !isInt(2 * v.A / v.c) && ceil(v.A / v.c) !== ceil(2 * v.A / v.c) && !(v.L === 12 && v.H === 8); }); },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) {
            var hl = ftin(sh.hf, sh.hi);
            function sk(L, H, ww, wh, two, labW, labH, labWW, labWH) {
              var F = A.fig(0, 0, L, H, { w: 250, h: 160, pad: 26, padL: 46, padR: 46 }); F.rect(0, 0, L, H, SH);
              var y0 = Math.max(0.5, (H - wh) * 0.3), xs = two ? [L * 0.25 - ww / 2, L * 0.75 - ww / 2] : [L / 2 - ww / 2];
              xs.forEach(function (x) { F.rect(x, y0, x + ww, y0 + wh, { fill: CUT, w: 1.6 }); });
              lab(F, L / 2, 0, labW, 'below', { size: 12 }); lab(F, 0, H / 2, labH, 'left', { size: 12 }); lab(F, xs[xs.length - 1] + ww / 2, y0 + wh, labWW, 'above', { size: 11 }); lab(F, xs[xs.length - 1] + ww, y0 + wh / 2, labWH, 'right', { size: 11 });
              return F.svg('sketch of the wall');
            }
            var good = sk(sh.L, sh.H, sh.w, sh.hh, true, sh.L + ' ft', sh.H + ' ft', sh.w + ' ft', hl);
            var p = P.mc(r, 'Which sketch shows the wall correctly labelled?', [
              { html: good, right: true },
              { html: sk(sh.L, sh.H, sh.hh, sh.w, true, sh.L + ' ft', sh.H + ' ft', hl, sh.w + ' ft'), why: 'Each window is ' + sh.w + ' ft <b>wide</b> (across) and ' + hl + ' <b>high</b> (up and down).', code: 'u3l9-sk-window' },
              { html: sk(sh.L, sh.H, sh.w, sh.hh, false, sh.L + ' ft', sh.H + ' ft', sh.w + ' ft', hl), why: 'The wall has <b>two</b> windows.', code: 'u3l9-sk-one' },
              { html: sk(sh.H, sh.L, sh.w, sh.hh, true, sh.H + ' ft', sh.L + ' ft', sh.w + ' ft', hl), why: 'The wall is ' + sh.L + ' ft <b>long</b> (across) and ' + sh.H + ' ft high.', code: 'u3l9-sk-wall' }],
              good + 'The wall is ' + sh.L + ' ft long and ' + sh.H + ' ft high, with two windows ' + sh.w + ' ft wide and ' + hl + ' high.', ['Long = across, high = up and down. Count the windows.'], 'sketch');
            p.input.columns = 2; return p;
          } },
          { id: '8b', level: 'PRG', make: function (r, sh) {
            var W0 = sh.L * sh.H, win = sh.w * sh.hh;
            return area('Find the area she will paint.', sh.A, 'ft', {
              bad: [[W0 - 2 * sh.w * (sh.hf + sh.hi / 10), 'u3l9-ftin-dec', ftin(sh.hf, sh.hi) + ' is not ' + sh.hf + '.' + sh.hi + ' ft. There are 12 inches in a foot: ' + t(sh.hi + '\\text{ in}=' + sh.hi + '\\div 12=' + N(sh.hi / 12) + '\\text{ ft}') + '.'], [W0 - win, 'u3l9-one-window', 'There are <b>two</b> windows. Subtract both.'], [W0, 'u3l9-no-cut', 'Subtract the two windows (she won’t paint them).'], [W0 + 2 * win, 'u3l9-added-cut', 'The windows are cut-outs: subtract them.'], [W0 - 2 * sh.w * sh.hf, 'u3l9-ftin-drop', 'Don’t drop the ' + sh.hi + ' in: ' + ftin(sh.hf, sh.hi) + ' = ' + N(sh.hh) + ' ft.']],
              sol: [ftin(sh.hf, sh.hi) + ' = ' + t(N(sh.hh)) + ' ft', 'Wall: ' + t(sh.L + '\\times ' + sh.H + '=' + W0 + uT('ft²')) + '; windows: ' + t('2\\times(' + sh.w + '\\times ' + N(sh.hh) + ')=' + N(2 * win) + uT('ft²')), 'Paint: ' + t(W0 + '-' + N(2 * win) + '=' + N(sh.A) + uT('ft²'))],
              hints: ['Change ' + ftin(sh.hf, sh.hi) + ' to feet first: ' + t(sh.hi + '\\div 12') + '.', 'Wall minus the two windows.'], text: 'wall paint' });
          } },
          { id: '8c', level: 'PRG', make: function (r, sh) { return countUp('She will paint two coats. One can covers about ' + sh.c + ' ft². How many cans does she need?', 2 * sh.A, sh.c, { unit: 'cans', one: 'a can', oneName: 'can', pre: ['Two coats: ' + t('2\\times ' + N(sh.A) + '=' + N(2 * sh.A) + uT('ft²'))], bad: [[ceil(sh.A / sh.c), 'u3l9-one-coat', 'She paints <b>two</b> coats: double the area first.']], hints: ['Double the area (two coats), divide by ' + sh.c + ', then round up.'], text: 'cans' }); } }] },
      { num: '9', stem: function (sh) { return 'The grid shows a flower garden in a park. Each square is 1 m by 1 m.' + A.gridFig(sh, { tap: true, fill: '#f6dfe9', line: '#9b3d6a', label: 'flower garden on a grid' }); },
        shared: function (r) { return A.blob(r, 9, 8, { avoid: [[12, 20], [16, 22]] }); },
        parts: [{ id: '9', level: 'EMG', make: function (r, sh) { return gridTable(sh, 1, 'm', { half: true, prompt: 'Estimate the area of the garden by completing the table.', text: 'garden grid' }); } }] },
      { num: '10', stem: function (sh) { return 'A golf course map shows a pond. Each square stands for ' + sh.k + ' m by ' + sh.k + ' m.' + A.gridFig(sh.b, { tap: true, label: 'pond on a grid' }); },
        shared: function (r) { return { b: A.blob(r, 11, 8, { rx: [2.2, 3.2], ry: [1.5, 2.2], avoid: [[12, 20], [16, 22]] }), k: r.pick([2, 3, 4, 5]) }; },
        parts: [
          { id: '10a', level: 'BEG', make: function (r, sh) { var k = sh.k; return area('What area does one square stand for?', k * k, 'm', { bad: [[2 * k, 'u3l9-side-add', 'Area of a square = side × side: ' + t(k + '\\times ' + k) + ', not ' + t(k + '+' + k) + '.'], [4 * k, 'u3l9-perimeter', 'That’s the perimeter of one square. Area = side × side.'], [k, 'u3l9-side', 'That’s the length of a side. The area is ' + t(k + '\\times ' + k) + '.']], sol: [t(k + '\\times ' + k + '=' + k * k + uT('m²'))], hints: ['Each square is a ' + k + ' m by ' + k + ' m square.'], text: 'one square' }); } },
          { id: '10b', level: 'PRG', make: function (r, sh) { return gridTable(sh.b, sh.k, 'm', { prompt: 'Estimate the area of the pond.', estLab: 'Area of the pond ≈', text: 'pond estimate' }); } },
          { id: '10c', level: 'PRG', make: function (r, sh) {
            var b = sh.b, sq = sh.k * sh.k, n = b.box.w * b.box.h, est = (b.F + b.P / 2) * sq;
            return A.fields('Picture the smallest rectangle (on grid lines) that goes all the way around the pond. How many squares are inside it, and what area does it stand for?', [
              { label: 'Squares in the rectangle:', name: 'squares', ans: n, bad: [[(b.box.w - 1) * (b.box.h - 1), 'u3l9-box-small', 'The rectangle goes <b>around</b> the pond: it must include every square the pond touches.'], [2 * (b.box.w + b.box.h), 'u3l9-perimeter', 'Count the squares <b>inside</b> the rectangle: across × up.']], miss: 'The rectangle is the number of squares across times the number of squares up. Include every square the pond touches.' },
              { label: 'Area it stands for:', name: 'area', ans: n * sq, after: 'm²', bad: [[n * sh.k, 'u3l9-side-not-area', 'Multiply by the <b>area</b> of one square (' + sq + ' m²), not its side.']] }],
              [A.gridFig(b, { sol: true, box: true, px: 16, label: 'rectangle around the pond' }), t(b.box.w + '\\times ' + b.box.h + '=' + n) + ' squares, so ' + t(n + '\\times ' + sq + '=' + N(n * sq) + uT('m²')), 'The estimate, ' + N(est) + ' m², is less than ' + N(n * sq) + ' m², so it is reasonable.'],
              ['Count the columns and the rows the pond touches.'], 'rectangle around');
          } }] },
      { num: '11', stem: function (sh) { return 'Kayla found the area of this L-shaped room. Here is her work:' + sh.fig + '<div style="border:1px solid #c9b79c;padding:6px 10px;display:inline-block;font-style:italic">Bottom part: ' + t(sh.W + '\\times ' + sh.hb + '=' + sh.W * sh.hb + uT('m²')) + '<br>Left part: ' + t(sh.tw + '\\times ' + sh.H + '=' + sh.tw * sh.H + uT('m²')) + '<br>Total: ' + t(sh.W * sh.hb + '+' + sh.tw * sh.H + '=' + sh.K + uT('m²')) + '</div>'; },
        shared: function (r) { var v = find(function () { return { W: r.int(8, 12), hb: r.int(2, 4), tw: r.int(3, 5), H: r.int(6, 9) }; }, function (v) { return v.H - v.hb >= 2 && v.W - v.tw >= 3 && !(v.W === 9 && v.H === 7); }); v.K = v.W * v.hb + v.tw * v.H; v.ans = v.W * v.hb + v.tw * (v.H - v.hb); v.fig = lShapeTR(v.W, v.H, v.tw, v.hb, { b: v.W + ' m', r: v.hb + ' m', t: v.tw + ' m', l: v.H + ' m' }, { label: 'L-shaped room' }); return v; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What mistake did Kayla make?', [
              { html: 'Her two rectangles overlap. The ' + sh.tw + ' m by ' + sh.hb + ' m corner at the bottom left is in both parts, so she counted it twice.', right: true },
              { html: 'She should have subtracted the left part instead of adding it.', why: 'Split and add is right, but the parts must not overlap. Look at the bottom-left corner.', code: 'u3l9-k-subtract' },
              { html: 'She found the perimeter instead of the area.', why: 'She did multiply length × width. Look at where her two rectangles are.', code: 'u3l9-k-perim' },
              { html: 'She should have multiplied the two areas instead of adding them.', why: 'The areas of the parts are added. The problem is where the parts are.', code: 'u3l9-k-mult' }],
              'The bottom part (' + sh.W + ' by ' + sh.hb + ') and the left part (' + sh.tw + ' by ' + sh.H + ') overlap in the ' + sh.tw + ' by ' + sh.hb + ' corner, so ' + t(sh.tw + '\\times ' + sh.hb + '=' + sh.tw * sh.hb + uT('m²')) + ' was counted twice.', ['Shade her two rectangles on the picture. Is any square shaded twice?'], 'Kayla mistake');
          } },
          { id: '11b', level: 'PRG', make: function (r, sh) {
            var up = sh.H - sh.hb;
            return area('Find the correct area.', sh.ans, 'm', { bad: [[sh.K, 'u3l9-kayla', 'That’s Kayla’s answer, with the corner counted twice.'], [sh.W * sh.H, 'u3l9-no-cut', 'That’s the whole rectangle around the room. The top-right corner is empty.'], [sh.K + sh.tw * sh.hb, 'u3l9-overlap', 'Take the overlap away (subtract), don’t add it.']],
              sol: ['Bottom: ' + t(sh.W + '\\times ' + sh.hb + '=' + sh.W * sh.hb + uT('m²')) + '; left part above it: ' + t(sh.tw + '\\times(' + sh.H + '-' + sh.hb + ')=' + sh.tw + '\\times ' + up + '=' + sh.tw * up + uT('m²')), 'Total: ' + t(sh.W * sh.hb + '+' + sh.tw * up + '=' + sh.ans + uT('m²')) + ' (or ' + t(sh.K + '-' + sh.tw * sh.hb + '=' + sh.ans) + ')'],
              hints: ['The left part above the bottom rectangle is only ' + t(sh.H + '-' + sh.hb) + ' m tall.'], text: 'Kayla fixed' });
          } },
          { id: '11c', level: 'PRG', make: function (r, sh) { var cw = sh.W - sh.tw, ch = sh.H - sh.hb; return wholeMinus('Check your answer using whole minus cut-out.', sh.W * sh.H, cw * ch, 'm', t(sh.W + '\\times ' + sh.H + '=' + sh.W * sh.H), t('(' + sh.W + '-' + sh.tw + ')\\times(' + sh.H + '-' + sh.hb + ')=' + cw + '\\times ' + ch + '=' + cw * ch), { same: true, badC: [[sh.tw * sh.hb, 'u3l9-wrong-cut', 'That’s Kayla’s overlap corner. The cut-out is the <b>empty</b> corner at the top right: ' + t('(' + sh.W + '-' + sh.tw + ')') + ' by ' + t('(' + sh.H + '-' + sh.hb + ')') + '.'], [cw * sh.H, 'u3l9-wrong-cut', 'The empty corner is only ' + t(sh.H + '-' + sh.hb + '=' + ch) + ' m tall.']] }); } }] },
      { num: '12', stem: function (sh) { return 'A bedroom is a rectangle ' + sh.L + ' ft by ' + sh.D + ' ft with a reading nook ' + sh.a + ' ft by ' + sh.b + ' ft on one side.' + sh.fig; },
        shared: function (r) {
          var v = find(function () { return { L: r.int(12, 16), D: r.int(10, 13), a: r.int(4, 7), b: r.int(3, 5), p: r.pick([28, 32, 34, 36.5, 39.99]) }; }, function (v) { v.A = v.L * v.D + v.a * v.b; return !isInt(v.A / 9) && v.a < v.L - 4 && (Math.round(v.A / 9) !== ceil(v.A / 9) || r.chance(0.3)); });
          var F = A.fig(0, 0, v.L, v.D + v.b, { w: 200, h: 220, pad: 32 }), x0 = Math.floor((v.L - v.a) / 2);
          F.poly([[0, 0], [v.L, 0], [v.L, v.D], [x0 + v.a, v.D], [x0 + v.a, v.D + v.b], [x0, v.D + v.b], [x0, v.D], [0, v.D]], SH);
          lab(F, v.L / 2, 0, v.L + ' ft', 'below'); lab(F, 0, v.D / 2, v.D + ' ft', 'left'); lab(F, x0 + v.a / 2, v.D + v.b, v.a + ' ft', 'above'); lab(F, x0 + v.a, v.D + v.b / 2, v.b + ' ft', 'right');
          v.fig = F.svg('bedroom with a nook'); return v;
        },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) { var R0 = sh.L * sh.D, n = sh.a * sh.b; return area('Find the area of the floor in square feet.', sh.A, 'ft', { bad: [[R0, 'u3l9-one-part', 'Add the nook too.'], [R0 - n, 'u3l9-added-cut', 'The nook is extra floor: add it, don’t subtract it.'], [2 * (sh.L + sh.D) + 2 * sh.b, 'u3l9-perimeter', 'That’s the distance around. Area = length × width for each part.']], sol: [t(sh.L + '\\times ' + sh.D + '=' + R0 + uT('ft²')) + '; nook: ' + t(sh.a + '\\times ' + sh.b + '=' + n + uT('ft²')), 'Total: ' + t(R0 + '+' + n + '=' + sh.A + uT('ft²'))], hints: ['Room + nook.'], text: 'bedroom area' }); } },
          { id: '12b', level: 'PRG', outcome: 'M2', make: function (r, sh) { return area('Carpet is sold by the square yard (1 yd² = 9 ft²). Change the area to square yards, to the nearest hundredth.', sh.A / 9, 'yd', { dp: 2, exact: sh.A / 9, exactOk: false, bad: [[sh.A * 9, 'u3l9-conv-way', 'A square yard is bigger than a square foot, so there are <b>fewer</b> square yards: divide by 9.'], [sh.A / 3, 'u3l9-conv-3', '1 yd = 3 ft, but 1 yd² = 3 × 3 = 9 ft². Divide by 9.'], [sh.A / 12, 'u3l9-conv-12', 'Use 1 yd² = 9 ft².']], sol: [t(sh.A + '\\div 9' + eqR(sh.A / 9, 2) + uT('yd²'))], hints: ['ft² → yd²: divide by 9.'], text: 'ft2 to yd2' }); } },
          { id: '12c', level: 'ADV', make: function (r, sh) { var y = ceil(sh.A / 9), ans = y * sh.p; return A.num('The store sells only whole square yards, at ' + Mp(sh.p) + ' per yd². What will the carpet cost (before tax)?', ans, { money: true, bad: [[sh.A / 9 * sh.p, 'u3l9-not-whole', 'The store sells only <b>whole</b> square yards. Round the square yards up first, then multiply.'], [rd(sh.A / 9, 2) * sh.p, 'u3l9-not-whole', 'Round the square yards <b>up</b> to a whole number first (' + y + ' yd²), then multiply.'], [Math.floor(sh.A / 9) * sh.p, 'u3l9-round-down', 'Round <b>up</b>: ' + Math.floor(sh.A / 9) + ' yd² would not be enough carpet.'], [sh.A * sh.p, 'u3l9-ft-price', 'The price is per square <b>yard</b>. Use the square yards, not square feet.']], sol: ['Round up: ' + t(N(rd(sh.A / 9, 2)) + uT('yd²')) + ' → ' + y + ' yd²', t(y + '\\times ' + M(sh.p) + '=' + M(ans))], hints: ['Round the square yards up to a whole number, then multiply by the price.'], text: 'carpet cost' }); } }] },
      { num: '13', parts: [
        { id: '13', level: 'MAS', make: function (r) {
          var v = find(function () { return { W: r.int(8, 12), h: r.int(4, 7), sw: r.int(3, 6), x: pickR(r, 2.5, 6, 0.5) }; }, function (v) { return v.sw <= v.W - 3 && !(v.W === 10 && v.h === 6 && v.sw === 5 && v.x === 4.5); });
          var big = v.W * v.h, T = big + v.sw * v.x, small = T - big;
          var F = A.fig(0, 0, v.W, v.h + v.x, { w: 200, h: 220, pad: 32 }); F.poly([[0, 0], [v.W, 0], [v.W, v.h], [v.sw, v.h], [v.sw, v.h + v.x], [0, v.h + v.x]], SH); F.line([0, v.h], [v.sw, v.h], { dash: true, w: 1.2 });
          lab(F, v.W / 2, 0, v.W + ' m', 'below'); lab(F, v.W, v.h / 2, v.h + ' m', 'right'); lab(F, v.sw / 2, v.h + v.x, v.sw + ' m', 'above'); lab(F, v.sw, v.h + v.x / 2, 'x', 'right', { italic: true });
          return A.num('A garden is made of a rectangle ' + v.W + ' m by ' + v.h + ' m and a rectangle ' + v.sw + ' m wide, joined as shown. The total area of the garden is ' + N(T) + ' m². Find the length ' + t('x') + '.' + F.svg('garden made of two rectangles'), v.x, { exactOk: true, after: 'm',
            bad: [[T / v.sw, 'u3l9-x-whole', 'Only the small rectangle is ' + v.sw + ' m wide. Subtract the big rectangle’s area first.'], [small, 'u3l9-x-area', 'That’s the <b>area</b> of the small rectangle. Its area is ' + v.sw + ' × ' + t('x') + ', so divide by ' + v.sw + '.'], [small / v.W, 'u3l9-x-wrongw', 'The small rectangle is ' + v.sw + ' m wide: divide its area by ' + v.sw + '.'], [T / v.W - v.h, 'u3l9-x-wrongw', 'Subtract the big rectangle (' + big + ' m²), then divide by the small rectangle’s width.'], [small / v.h, 'u3l9-x-wrongw', 'Divide the small rectangle’s area by its width (' + v.sw + ' m).'], [(T + big) / v.sw, 'u3l9-x-add', 'Subtract the big rectangle’s area from the total.']],
            sol: ['Big rectangle: ' + t(v.W + '\\times ' + v.h + '=' + big + uT('m²')), 'Small rectangle: ' + t(N(T) + '-' + big + '=' + N(small) + uT('m²')), 'Its area is ' + t(v.sw + '\\times x') + ', so ' + t(v.sw + 'x=' + N(small)) + ' and ' + t('x=' + N(small) + '\\div ' + v.sw + '=' + N(v.x)) + ' m', 'Check: ' + t(big + '+' + v.sw + '\\times ' + N(v.x) + '=' + big + '+' + N(small) + '=' + N(T)) + ' ✓'],
            hints: ['Total area = big rectangle + small rectangle. Find the small rectangle’s area first.', 'Small rectangle: ' + v.sw + ' × ' + t('x') + ' = its area. Divide.'], text: 'missing x' });
        } }] },
      { num: '14', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var d = r.pick([6, 8, 12, 14, 16]), rr = d / 2, o = function (v) { return N(rd(v, 2), 2) + ' cm²'; };
          return P.mc(r, 'The area of a semicircle with a diameter of ' + d + ' cm, to the nearest hundredth, is', [
            { html: o(0.5 * Math.PI * rr * rr), right: true }, { html: o(Math.PI * rr * rr), why: 'That’s a whole circle. A semicircle is half: ' + t('\\tfrac{1}{2}\\pi r^2') + '.', code: 'u3a-semi-full' },
            { html: o(0.5 * Math.PI * d * d), why: 'That uses the diameter as the radius. ' + t('r=' + d + '\\div 2=' + N(rr)) + '.', code: 'u3a-diam' }, { html: o(0.5 * Math.PI * d), why: 'That’s half the circumference (a length). Area uses ' + t('r^2') + '.', code: 'u3a-circumference' }],
            t('r=' + d + '\\div 2=' + N(rr)) + ', ' + t('\\tfrac{1}{2}\\times\\pi\\times ' + N(rr) + '^2\\approx ' + N(rd(0.5 * Math.PI * rr * rr, 2), 2) + uT('cm²')), ['Halve the diameter to get the radius. Semicircle: ' + t('\\tfrac{1}{2}\\pi r^2') + '.'], 'semicircle MC');
        } }] },
      { num: '15', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var v = find(function () { return { L: r.int(16, 30), W: r.int(10, 20), s: r.int(3, 6) }; }, function (v) { return v.W < v.L && !(v.L === 15 && v.W === 12); });
          return P.mc(r, 'A lawn is ' + v.L + ' m by ' + v.W + ' m. A square pool ' + v.s + ' m by ' + v.s + ' m is in the middle. Which calculation gives the area of the lawn?', [
            { html: t(v.L + '\\times ' + v.W + '-' + v.s + '\\times ' + v.s), right: true }, { html: t(v.L + '\\times ' + v.W + '+' + v.s + '\\times ' + v.s), why: 'The pool is not lawn: subtract it.', code: 'u3l9-added-cut' },
            { html: t('(' + v.L + '-' + v.s + ')\\times(' + v.W + '-' + v.s + ')'), why: 'That makes the whole yard smaller instead of cutting out the pool. Whole minus cut-out: subtract the pool’s <b>area</b>.', code: 'u3l9-diff-mult' }, { html: t('2(' + v.L + ')+2(' + v.W + ')-4(' + v.s + ')'), why: 'That works with perimeters (lengths around), not areas.', code: 'u3l9-perimeter' }],
            'Whole minus cut-out: ' + t(v.L + '\\times ' + v.W + '-' + v.s + '\\times ' + v.s + '=' + v.L * v.W + '-' + v.s * v.s + '=' + (v.L * v.W - v.s * v.s) + uT('m²')), ['Area of the lawn = area of the whole yard − area of the pool.'], 'lawn MC');
        } }] },
      { num: '16', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var v = find(function () { return { F: r.int(8, 16), P: 2 * r.int(4, 8), k: r.pick([4, 9, 25]) }; }, function (v) { return !(v.F === 12 && v.P === 10 && v.k === 4) || r.chance(0.2); });
          var e = v.F + v.P / 2, o = function (x) { return N(x) + ' m²'; };
          return P.mc(r, 'On a grid, a puddle covers ' + v.F + ' full squares and ' + v.P + ' part squares. Each square stands for ' + v.k + ' m². The best estimate of the puddle’s area is', [
            { html: o(e * v.k), right: true }, { html: o(v.F * v.k), why: 'That leaves out the part squares. Add part ÷ 2.', code: 'u3l9-no-part' },
            { html: o((v.F + v.P) * v.k), why: 'That counts every part square as full. Part squares count as about half.', code: 'u3l9-part-full' }, { html: o(e), why: 'That’s the number of squares. Multiply by ' + v.k + ' m² for each square.', code: 'u3l9-no-unit' }],
            t(v.F + '+' + v.P + '\\div 2=' + e) + ' squares; ' + t(e + '\\times ' + v.k + '=' + e * v.k + uT('m²')), ['Area ≈ (full + part ÷ 2) × area of one square.'], 'puddle MC');
        } }] },
      { num: '17', parts: [
        { id: '17', level: 'PRG', make: function (r) {
          var v = find(function () { return { L: pickR(r, 6, 9, 0.5), w: r.int(3, 5), h: pickR(r, 2, 4, 0.2) }; }, function (v) { var a = v.L * v.w + v.w * v.h / 2; return a < 100 && !isInt(a * 1) && !(v.L === 7.5 && v.w === 4 && v.h === 3.2); });
          var R1 = v.L * v.w, T1 = v.w * v.h / 2, ans = R1 + T1;
          var F = A.fig(0, 0, v.L + v.h, v.w, { w: 240, h: 150, pad: 30 }); F.poly([[0, 0], [v.L, 0], [v.L + v.h, v.w / 2], [v.L, v.w], [0, v.w]], SH); F.line([v.L, 0], [v.L, v.w], { dash: true, w: 1.2 }); F.line([v.L, v.w / 2], [v.L + v.h, v.w / 2], { dash: true, w: 1.2 });
          lab(F, v.L / 2, 0, N(v.L) + ' m', 'below'); lab(F, 0, v.w / 2, v.w + ' m', 'left'); lab(F, v.L + v.h / 2, v.w / 2, N(v.h) + ' m', 'below', { size: 11 });
          return area('<b>Numerical response.</b> A garden plot is a rectangle ' + N(v.L) + ' m by ' + v.w + ' m with a triangle on one ' + v.w + ' m end. The triangle has a base of ' + v.w + ' m and a height of ' + N(v.h) + ' m. The area of the garden plot, to the nearest tenth of a square metre, is ____ m².' + F.svg('rectangle with a triangle end'), ans, 'm', { dp: 1, exact: ans, nr: true,
            bad: [[R1 + v.w * v.h, 'u3l9-no-half', 'Triangle: ' + t('\\tfrac{1}{2}\\times b\\times h') + '. Don’t forget the ' + t('\\tfrac{1}{2}') + '.'], [R1, 'u3l9-one-part', 'Add the triangle too.'], [(v.L + v.h) * v.w, 'u3l9-no-cut', 'The triangle end is not a full rectangle: use ' + t('\\tfrac{1}{2}bh') + ' for it.']],
            sol: ['Rectangle: ' + t(N(v.L) + '\\times ' + v.w + '=' + N(R1) + uT('m²')) + '; triangle: ' + t('\\tfrac{1}{2}\\times ' + v.w + '\\times ' + N(v.h) + '=' + N(T1) + uT('m²')), 'Total: ' + t(N(R1) + '+' + N(T1) + eqR(ans, 1) + uT('m²'))], hints: ['Rectangle + triangle (' + t('\\tfrac{1}{2}bh') + ').'], text: 'NR garden plot' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the area of each composite shape. All the corners that look square are square.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) {
          var v = find(function () { return { Wt: r.int(7, 10), ht: r.int(2, 3), sw: r.int(2, 4), sh: r.int(3, 6) }; }, function (v) { return v.sw <= v.Wt - 4 && !(v.Wt === 9 && v.ht === 2 && v.sw === 3 && v.sh === 5); });
          var x0 = Math.round((v.Wt - v.sw) / 2), H = v.ht + v.sh, ans = v.Wt * v.ht + v.sw * v.sh;
          var F = A.fig(0, 0, v.Wt, H, { w: 220, h: 200, pad: 32 }); F.poly([[0, H], [v.Wt, H], [v.Wt, v.sh], [x0 + v.sw, v.sh], [x0 + v.sw, 0], [x0, 0], [x0, v.sh], [0, v.sh]], SH);
          lab(F, v.Wt / 2, H, v.Wt + ' cm', 'above'); lab(F, v.Wt, v.sh + v.ht / 2, v.ht + ' cm', 'right'); lab(F, x0 + v.sw / 2, 0, v.sw + ' cm', 'below'); lab(F, x0 + v.sw, v.sh / 2, v.sh + ' cm', 'right');
          return area(F.svg('T-shape'), ans, 'cm', { bad: [[v.Wt * v.ht + v.sw * H, 'u3l9-overlap', 'The stem is only ' + v.sh + ' cm tall (below the top bar). Don’t count the top bar twice.'], [v.Wt * H, 'u3l9-no-cut', 'That’s the rectangle around the T. Split it into the top bar and the stem.'], [v.Wt * v.ht, 'u3l9-one-part', 'Add the stem too.']], sol: ['Top bar: ' + t(v.Wt + '\\times ' + v.ht + '=' + v.Wt * v.ht + uT('cm²')), 'Stem: ' + t(v.sw + '\\times ' + v.sh + '=' + v.sw * v.sh + uT('cm²')), 'Total: ' + t(v.Wt * v.ht + '+' + v.sw * v.sh + '=' + ans + uT('cm²'))], hints: ['Split it into the top bar and the stem.'], text: 'T labelled' });
        } },
        { id: 'e1b', level: 'EMG', make: function (r) {
          var v = find(function () { return { a: r.int(4, 8), b: r.int(2, 5), h: r.int(3, 6) }; }, function (v) { return !(v.a === 6 && v.b === 3 && v.h === 4) && ((v.b * v.h) % 2 === 0 || r.chance(0.3)); });
          var R1 = v.a * v.h, T1 = v.b * v.h / 2, ans = R1 + T1;
          var F = A.fig(0, 0, v.a + v.b, v.h, { w: 230, h: 160, pad: 30 }); F.poly([[0, 0], [v.a + v.b, 0], [v.a, v.h], [0, v.h]], SH); F.line([v.a, 0], [v.a, v.h], { dash: true, w: 1.2 });
          lab(F, v.a / 2, 0, v.a + ' m', 'below'); lab(F, v.a + v.b / 2, 0, v.b + ' m', 'below'); lab(F, 0, v.h / 2, v.h + ' m', 'left');
          return area(F.svg('rectangle and triangle'), ans, 'm', { bad: [[R1 + v.b * v.h, 'u3l9-no-half', 'Triangle: ' + t('\\tfrac{1}{2}\\times b\\times h') + '. Don’t forget the ' + t('\\tfrac{1}{2}') + '.'], [(v.a + v.b) * v.h, 'u3l9-no-cut', 'The right part is a triangle, not a rectangle: use ' + t('\\tfrac{1}{2}bh') + '.'], [R1, 'u3l9-one-part', 'Add the triangle.']], sol: ['Rectangle: ' + t(v.a + '\\times ' + v.h + '=' + R1 + uT('m²')), 'Triangle: ' + t('\\tfrac{1}{2}\\times ' + v.b + '\\times ' + v.h + '=' + N(T1) + uT('m²')), 'Total: ' + t(R1 + '+' + N(T1) + '=' + N(ans) + uT('m²'))], hints: ['Rectangle + triangle (' + t('\\tfrac{1}{2}bh') + ').'], text: 'rect + right triangle' });
        } }] },
      { num: '2', stem: function (sh) { return 'The plan of a storage room is shown. All the corners are square.' + sh.fig; },
        shared: function (r) { return deckShared(r, { W: [6, 9], H: [7, 10], tw: [3, 4], lh: [4, 6] }, 'ft', ['a', 'b']); },
        parts: [
          { id: 'e2a', level: 'BEG', make: function (r, sh) { return deckSides(sh); } },
          { id: 'e2b', level: 'EMG', make: function (r, sh) { return deckSplit(sh, 'Find the area of the room.'); } },
          { id: 'e2c', level: 'EMG', make: function (r, sh) { return wholeMinus('Check with whole minus cut-out.', sh.W * sh.H, sh.x * sh.y, 'ft', t(sh.W + '\\times ' + sh.H + '=' + sh.W * sh.H), t(sh.x + '\\times ' + sh.y + '=' + sh.x * sh.y), { same: true, badC: [[sh.tw * sh.lh, 'u3l9-wrong-cut', 'The cut-out is the empty corner: ' + t('a') + ' by ' + t('b') + '.']] }); } }] },
      { num: '3', parts: [
        { id: 'e3', level: 'PRG', make: function (r) {
          var v = find(function () { return { L: r.pick([1.5, 1.8, 2, 2.2, 2.4, 2.5, 3]), W: r.pick([1, 1.2, 1.4, 1.5, 1.6, 1.8]) }; }, function (v) { return v.W < v.L && !(v.L === 2 && v.W === 1.5); });
          return semiPart('A rug is a rectangle ' + N(v.L) + ' m long and ' + N(v.W) + ' m wide, with a semicircle on one ' + N(v.W) + ' m end. Find the area of the rug, to the nearest hundredth of a square metre.' + semiFig(v.L, v.W, 'right', { lw: N(v.L) + ' m', ld: N(v.W) + ' m', label: 'rug' }), v.L, v.W, v.W, 'm', 2, { text: 'rug' });
        } }] },
      { num: '4', parts: [
        { id: 'e4', level: 'PRG', make: function (r) {
          var v = find(function () { return { L: r.int(14, 24), W: r.int(8, 14), d: r.pick([3, 4, 5, 6, 7, 8]) }; }, function (v) { return v.d < v.W - 3 && !(v.L === 20 && v.W === 12 && v.d === 6); });
          var F = A.fig(0, 0, v.L, v.W, { w: 220, h: 160, pad: 30 }); F.rect(0, 0, v.L, v.W, SH); F.circle(v.L / 2, v.W / 2, v.d / 2, { fill: CUT }); lab(F, v.L / 2, 0, v.L + ' cm', 'below'); lab(F, 0, v.W / 2, v.W + ' cm', 'left'); lab(F, v.L / 2, v.W / 2, v.d + ' cm', 'c', { size: 11 });
          return holePart('A metal plate is a rectangle ' + v.L + ' cm by ' + v.W + ' cm. A round hole ' + v.d + ' cm across is drilled through it. Find the area of the metal that is left, to the nearest hundredth of a square centimetre.' + F.svg('plate with a hole'), v.L, v.W, v.d, 'cm', 2, { circName: 'Hole', text: 'plate' });
        } }] },
      { num: '5', stem: function (sh) { return 'Nadia traced a leaf on centimetre grid paper. Each square is 1 cm².' + A.gridFig(sh, { tap: true, fill: '#dcefd6', line: '#3f7a35', label: 'leaf on a grid' }); },
        shared: function (r) { return A.blob(r, 9, 7, { rx: [1.6, 2.6], ry: [1.2, 1.9] }); },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, sh) { return gridTable(sh, 1, 'cm', { prompt: 'Estimate the area of the leaf.', text: 'leaf estimate' }); } },
          { id: 'e5b', level: 'EMG', make: function (r, sh) {
            var wrongA = sh.F + sh.P, est = sh.F + sh.P / 2;
            return P.mc(r, 'Sam says the leaf is about ' + wrongA + ' cm². What mistake did he make?', [
              { html: 'He counted every part square as a full square (' + t(sh.F + '+' + sh.P + '=' + wrongA) + '). Part squares should count as about half.', right: true },
              { html: 'He left out the part squares.', why: 'Leaving them out would give only ' + sh.F + ' cm². Sam’s answer is bigger than the estimate.', code: 'u3l9-no-part' },
              { html: 'He found the perimeter of the leaf instead of its area.', why: 'Compare Sam’s number with the full and part squares: ' + sh.F + ' + ' + sh.P + ' = ?', code: 'u3l9-perimeter' },
              { html: 'Nothing: ' + wrongA + ' cm² is the best estimate.', why: 'Part squares are only about half full. The best estimate is ' + t(sh.F + '+' + sh.P + '\\div 2=' + N(est)) + ' cm².', code: 'u3l9-fine' }],
              'Sam added ' + t(sh.F + '+' + sh.P + '=' + wrongA) + ', counting every part square as full. The estimate is ' + t(sh.F + '+' + sh.P + '\\div 2=' + N(est) + uT('cm²')) + '.', ['Compare ' + wrongA + ' with the numbers of full and part squares.'], 'Sam mistake');
          } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A swallowtail banner is cut from a rectangle of fabric ' + sh.L + ' cm long and ' + sh.W + ' cm wide. A triangle is cut out of one end. The triangle has a base of ' + sh.W + ' cm and a height of ' + sh.h + ' cm.' + sh.fig; },
        shared: function (r) {
          var v = find(function () { return { L: 10 * r.int(6, 12), W: 10 * r.int(4, 8), h: 5 * r.int(3, 6) }; }, function (v) { return v.h < v.L / 3 && v.W < v.L && !(v.L === 90 && v.W === 60 && v.h === 20); });
          v.A = v.L * v.W - v.W * v.h / 2;
          var F = A.fig(0, 0, v.L, v.W, { w: 220, h: 160, pad: 30 }); F.poly([[0, 0], [v.L, 0], [v.L - v.h, v.W / 2], [v.L, v.W], [0, v.W]], SH); F.line([v.L - v.h, v.W / 2], [v.L, v.W / 2], { dash: true, w: 1.2 }); F.line([v.L, 0], [v.L, v.W], { dash: true, w: 1.2 });
          lab(F, v.L / 2, 0, v.L + ' cm', 'below'); lab(F, 0, v.W / 2, v.W + ' cm', 'left'); lab(F, v.L - v.h / 2, v.W / 2, v.h + ' cm', 'above', { size: 11 });
          v.fig = F.svg('swallowtail banner'); return v;
        },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) { var W0 = sh.L * sh.W, T0 = sh.W * sh.h / 2; return area('Find the area of the banner in cm².', sh.A, 'cm', { bad: [[W0 - sh.W * sh.h, 'u3l9-no-half', 'The cut-out is a triangle: ' + t('\\tfrac{1}{2}\\times ' + sh.W + '\\times ' + sh.h) + '.'], [W0 + T0, 'u3l9-added-cut', 'The triangle is cut <b>out</b>: subtract it.'], [W0, 'u3l9-no-cut', 'Subtract the triangle that is cut out.'], [T0, 'u3l9-cutout', 'That’s the triangle that was cut out. Subtract it from the whole rectangle.']], sol: ['Whole: ' + t(sh.L + '\\times ' + sh.W + '=' + W0 + uT('cm²')) + '; cut-out: ' + t('\\tfrac{1}{2}\\times ' + sh.W + '\\times ' + sh.h + '=' + T0 + uT('cm²')), 'Banner: ' + t(W0 + '-' + T0 + '=' + N(sh.A) + uT('cm²'))], hints: ['Whole rectangle minus the triangle.'], text: 'banner' }); } },
          { id: 'e6b', level: 'PRG', outcome: 'M1', make: function (r, sh) { return area('Change the area to m². (1 m² = 10 000 cm²)', sh.A / 10000, 'm', { bad: [[sh.A / 100, 'u3l9-conv-100', '1 m = 100 cm, but 1 m² = 100 × 100 = 10 000 cm². Divide by 10 000.'], [sh.A / 1000, 'u3l9-conv-1000', 'Divide by 10 000 (1 m² = 10 000 cm²).'], [sh.A * 10000, 'u3l9-conv-way', 'A square metre is much bigger than a square centimetre, so the number gets <b>smaller</b>: divide.']], sol: [t(N(sh.A) + '\\div 10\\,000=' + N(sh.A / 10000) + uT('m²'))], hints: ['cm² → m²: divide by 10 000.'], text: 'cm2 to m2' }); } }] },
      { num: '7', stem: function (sh) { return 'A kitchen floor is a rectangle ' + ftin(sh.Lf, sh.Li) + ' by ' + sh.W + ' ft, plus a pantry ' + sh.pa + ' ft by ' + ftin(sh.pf, sh.pi) + '. Vinyl plank flooring comes in boxes that cover ' + sh.c + ' ft² each, for ' + Mp(sh.p) + ' a box.'; },
        shared: function (r) { return find(function () { var v = { Lf: r.int(11, 15), Li: r.pick([3, 6, 9]), W: r.int(9, 12), pa: r.int(3, 5), pf: r.int(3, 4), pi: r.pick([3, 6, 9]), c: r.pick([20, 22, 24]), p: r.pick([49.99, 54.99, 56.99, 62.99]) }; v.L = v.Lf + v.Li / 12; v.pb = v.pf + v.pi / 12; v.A = v.L * v.W + v.pa * v.pb; return v; }, function (v) { return !isInt(v.A / v.c) && !(v.Lf === 13 && v.Li === 6 && v.W === 10); }); },
        parts: [
          { id: 'e7a', level: 'PRG', make: function (r, sh) { var K0 = sh.L * sh.W, P0 = sh.pa * sh.pb; return area('Find the area of the floor.', sh.A, 'ft', { bad: [[(sh.Lf + sh.Li / 10) * sh.W + sh.pa * (sh.pf + sh.pi / 10), 'u3l9-ftin-dec', 'Inches are twelfths of a foot: ' + t(sh.Li + '\\text{ in}=' + sh.Li + '\\div 12=' + N(sh.Li / 12) + '\\text{ ft}') + ', not 0.' + sh.Li + ' ft.'], [K0, 'u3l9-one-part', 'Add the pantry.'], [sh.Lf * sh.W + sh.pa * sh.pf, 'u3l9-ftin-drop', 'Don’t drop the inches: change them to feet (÷ 12).']], sol: [ftin(sh.Lf, sh.Li) + ' = ' + N(sh.L) + ' ft, &nbsp; ' + ftin(sh.pf, sh.pi) + ' = ' + N(sh.pb) + ' ft', 'Kitchen: ' + t(N(sh.L) + '\\times ' + sh.W + '=' + N(K0) + uT('ft²')) + '; pantry: ' + t(sh.pa + '\\times ' + N(sh.pb) + '=' + N(P0) + uT('ft²')), 'Total: ' + t(N(K0) + '+' + N(P0) + '=' + N(sh.A) + uT('ft²'))], hints: ['Change ft-and-in to feet: inches ÷ 12.'], text: 'kitchen area' }); } },
          { id: 'e7b', level: 'PRG', make: function (r, sh) { var n = ceil(sh.A / sh.c), cost = n * sh.p; return A.fields('How many boxes are needed, and what do they cost (before tax)?', [{ label: 'Boxes:', name: 'boxes', ans: n, dp: 0, bad: [[Math.floor(sh.A / sh.c), 'u3l9-round-down', 'Round <b>up</b>: you can’t buy part of a box, and fewer would not cover the floor.']] }, { label: 'Cost:', name: 'cost', ans: cost, money: true, bad: [[sh.A / sh.c * sh.p, 'u3l9-not-whole', 'Use the whole number of boxes (' + n + '), not the decimal.'], [Math.floor(sh.A / sh.c) * sh.p, 'u3l9-round-down', 'Use ' + n + ' boxes (rounded up).']] }], [t(N(sh.A) + '\\div ' + sh.c + '=' + C().raw(sh.A / sh.c, 3)) + ', so round up: ' + n + ' boxes.', t(n + '\\times ' + M(sh.p) + '=' + M(cost))], ['Divide, round up, then multiply by the price of a box.'], 'flooring boxes'); } }] },
      { num: '8', stem: function (sh) { return 'A rectangular pool is ' + sh.L + ' m by ' + sh.W + ' m. A deck ' + N(sh.d) + ' m wide goes all the way around it.'; },
        shared: function (r) { return find(function () { var v = { L: r.int(6, 12), W: r.int(3, 6), d: r.pick([1, 1.5, 2, 2.5]), c: r.pick([15, 20, 25]) }; v.OL = v.L + 2 * v.d; v.OW = v.W + 2 * v.d; v.A = v.OL * v.OW - v.L * v.W; return v; }, function (v) { return v.W < v.L && !isInt(v.A / v.c) && !(v.L === 8 && v.W === 4 && v.d === 1.5); }); },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) { return A.fields('What are the length and width of the outside edge of the deck?', [{ label: 'Length:', name: 'length', ans: sh.OL, after: 'm', exactOk: true, bad: [[sh.L + sh.d, 'u3l9-deck-once', 'The deck adds ' + N(sh.d) + ' m on <b>both</b> ends.']] }, { label: 'Width:', name: 'width', ans: sh.OW, after: 'm', exactOk: true, bad: [[sh.W + sh.d, 'u3l9-deck-once', 'The deck adds ' + N(sh.d) + ' m on <b>both</b> sides.']] }], ['Length: ' + t(N(sh.d) + '+' + sh.L + '+' + N(sh.d) + '=' + N(sh.OL) + uT('m')) + '; width: ' + t(N(sh.d) + '+' + sh.W + '+' + N(sh.d) + '=' + N(sh.OW) + uT('m'))], ['Sketch it. The deck is on both sides of the pool.'], 'deck outside'); } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) { var O = sh.OL * sh.OW, Pl = sh.L * sh.W; return area('Find the area of the deck.', sh.A, 'm', { bad: [[(sh.L + sh.d) * (sh.W + sh.d) - Pl, 'u3l9-deck-once', 'The outside edge is ' + N(sh.OL) + ' m by ' + N(sh.OW) + ' m (the deck is on both sides).'], [O, 'u3l9-no-cut', 'Subtract the pool: it is not deck.'], [O + Pl, 'u3l9-added-cut', 'Subtract the pool.']], sol: [t(N(sh.OL) + '\\times ' + N(sh.OW) + '-' + sh.L + '\\times ' + sh.W + '=' + N(O) + '-' + Pl + '=' + N(sh.A) + uT('m²'))], hints: ['Whole (outside edge) minus the pool.'], text: 'deck area' }); } },
          { id: 'e8c', level: 'PRG', make: function (r, sh) { return countUp('One can of deck stain covers ' + sh.c + ' m². How many cans are needed for one coat?', sh.A, sh.c, { unit: 'cans', one: 'a can', oneName: 'can', text: 'stain cans' }); } }] },
      { num: '9', stem: function (sh) { return 'A park map shows a lake. Each square stands for ' + sh.k + ' m by ' + sh.k + ' m.' + A.gridFig(sh.b, { tap: true, label: 'lake on a grid' }); },
        shared: function (r) { return { b: A.blob(r, 11, 8, { rx: [2.2, 3.3], ry: [1.5, 2.3], avoid: [[16, 22]] }), k: r.pick([10, 20, 25, 50]) }; },
        parts: [
          { id: 'e9a', level: 'BEG', make: function (r, sh) { var k = sh.k; return area('What area does one square stand for?', k * k, 'm', { bad: [[2 * k, 'u3l9-side-add', 'Area = side × side.'], [4 * k, 'u3l9-perimeter', 'That’s the perimeter of one square.'], [k, 'u3l9-side', 'That’s a side. Area = ' + t(k + '\\times ' + k) + '.']], sol: [t(k + '\\times ' + k + '=' + N(k * k) + uT('m²'))], hints: ['side × side'], text: 'one square' }); } },
          { id: 'e9b', level: 'PRG', make: function (r, sh) { return gridTable(sh.b, sh.k, 'm', { prompt: 'Estimate the area of the lake.', estLab: 'Area of the lake ≈', text: 'lake estimate' }); } },
          { id: 'e9c', level: 'PRG', make: function (r, sh) {
            var b = sh.b, sq = sh.k * sh.k, n = b.box.w * b.box.h, est = (b.F + b.P / 2) * sq;
            return P.mc(r, 'Picture the smallest rectangle (on grid lines) around the lake. Is the estimate ' + Np(est) + ' m² reasonable?', [
              { html: 'Yes. The rectangle is ' + b.box.w + ' by ' + b.box.h + ' = ' + n + ' squares, or ' + Np(n * sq) + ' m², and the lake must be less than that.', right: true },
              { html: 'No. The lake should be more than ' + Np(n * sq) + ' m², the area of the rectangle around it.', why: 'The lake fits <b>inside</b> the rectangle, so it must be <b>less</b>.', code: 'u3l9-more' },
              { html: 'Yes. The rectangle is ' + b.box.w + ' by ' + b.box.h + ', so the lake is about ' + Np((b.box.w + b.box.h) * 2 * sq) + ' m².', why: 'Count the squares <b>inside</b> the rectangle (across × up), then multiply by ' + Np(sq) + ' m².', code: 'u3l9-perimeter' },
              { html: 'No. The rectangle has ' + n + ' squares, so the lake is ' + n + ' m².', why: 'Each square stands for ' + Np(sq) + ' m², not 1 m².', code: 'u3l9-no-unit' }],
              A.gridFig(b, { sol: true, box: true, px: 16, label: 'rectangle around the lake' }) + t(b.box.w + '\\times ' + b.box.h + '=' + n) + ' squares, ' + t(n + '\\times ' + N(sq) + '=' + N(n * sq) + uT('m²')) + '. Yes: ' + Np(est) + ' m² is less than ' + Np(n * sq) + ' m².', ['The lake fits inside the rectangle, so its area must be less.'], 'lake reasonable');
          } }] },
      { num: '10', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var v = find(function () { return { L: r.int(9, 14), H: r.pick([8, 9]), dw: r.pick([2.5, 3]), dh: r.pick([6.5, 7]) }; }, function (v) { var a = v.L * v.H, o = [a - v.dw * v.dh, a - (v.dw + v.dh), a + v.dw * v.dh, 2 * (v.L + v.H) - (v.dw + v.dh)]; return o.every(function (x, i) { return x > 0 && o.indexOf(x) === i; }) && !(v.L === 12 && v.H === 8); });
          var a = v.L * v.H, o = function (x) { return N(x) + ' ft²'; };
          return P.mc(r, 'A wall is ' + v.L + ' ft long and ' + v.H + ' ft high. It has a door ' + N(v.dw) + ' ft wide and ' + N(v.dh) + ' ft high. The area of the wall to be painted is', [
            { html: o(a - v.dw * v.dh), right: true }, { html: o(a - (v.dw + v.dh)), why: 'Subtract the door’s <b>area</b> (' + N(v.dw) + ' × ' + N(v.dh) + '), not its two sides added.', code: 'u3l9-sub-sides' },
            { html: o(a + v.dw * v.dh), why: 'The door is not painted: subtract it.', code: 'u3l9-added-cut' }, { html: o(2 * (v.L + v.H) - (v.dw + v.dh)), why: 'That works with perimeters. Use areas: length × height.', code: 'u3l9-perimeter' }],
            t(v.L + '\\times ' + v.H + '-' + N(v.dw) + '\\times ' + N(v.dh) + '=' + a + '-' + N(v.dw * v.dh) + '=' + N(a - v.dw * v.dh) + uT('ft²')), ['Wall area minus door area.'], 'wall MC');
        } }] },
      { num: '11', parts: [
        { id: 'e11', level: 'PRG', make: function (r) {
          var v = find(function () { return { w: r.pick([0.9, 1, 1.1, 1.2, 1.5]), h: r.pick([2, 2.1, 2.2, 2.4]) }; }, function (v) { return !(v.w === 1.2 && v.h === 2.4); });
          return semiPart('<b>Numerical response.</b> An arched doorway is a rectangle ' + N(v.w) + ' m wide and ' + N(v.h) + ' m high, with a semicircle on top. The area of the doorway, to the nearest hundredth of a square metre, is ____ m².' + semiFig(v.w, v.h, 'top', { lw: N(v.w) + ' m', ld: N(v.h) + ' m', label: 'arched doorway' }), v.w, v.h, v.w, 'm', 2, { nr: true, text: 'NR doorway' });
        } }] },
      { num: '12', section: 'C. Stretch', parts: [
        { id: 'e12', level: 'MAS', make: function (r) {
          var v = find(function () { return { L: r.int(10, 15), s: r.int(2, 4), W: r.int(6, 10) }; }, function (v) { return v.s < v.W - 2 && !(v.L === 12 && v.s === 3 && v.W === 8); });
          var sq = v.s * v.s, U = v.L * v.W - sq;
          return A.num('A rectangular garden is ' + v.L + ' m long. A shed ' + v.s + ' m by ' + v.s + ' m sits in one corner of it. The area of the garden <b>not</b> covered by the shed is ' + U + ' m². How wide is the garden?', v.W, { exactOk: true, after: 'm',
            bad: [[U / v.L, 'u3l9-w-noshed', 'The ' + U + ' m² leaves out the shed. Add the shed back first to get the whole garden.'], [(U - sq) / v.L, 'u3l9-w-sub', 'Whole garden − shed = ' + U + ', so the whole garden is ' + U + ' <b>+</b> ' + sq + '.'], [U + sq, 'u3l9-w-area', 'That’s the area of the whole garden. Divide by its length (' + v.L + ' m) to get the width.']],
            sol: ['Whole garden − shed = ' + U + ', so whole garden = ' + t(U + '+' + v.s + '\\times ' + v.s + '=' + U + '+' + sq + '=' + (U + sq) + uT('m²')), 'Width = ' + t((U + sq) + '\\div ' + v.L + '=' + v.W + uT('m')), 'Check: ' + t(v.L + '\\times ' + v.W + '-' + sq + '=' + (v.L * v.W) + '-' + sq + '=' + U) + ' ✓'],
            hints: ['Add the shed back on to get the area of the whole garden.', 'Width = area ÷ length.'], text: 'garden width' });
        } }] },
      { num: '13', stem: function (sh) { return 'A lawn is a rectangle ' + sh.L + ' m by ' + sh.W + ' m. A triangle with legs ' + sh.a + ' m and ' + sh.b + ' m is cut off one corner for a garden, and a semicircular patio ' + sh.d + ' m across sits along one side.' + sh.fig; },
        shared: function (r) {
          var v = find(function () { var v = { L: r.int(15, 20), W: r.int(8, 12), a: r.int(4, 6), b: r.int(3, 4), d: r.pick([3, 4, 5]), c: r.pick([40, 50]) }; v.A = rd(v.L * v.W - v.a * v.b / 2 - Math.PI * v.d * v.d / 8, 2); return v; }, function (v) { return !isInt(v.A / v.c) && !(v.L === 18 && v.W === 10 && v.a === 6); });
          var F = A.fig(0, 0, v.L, v.W, { w: 240, h: 170, pad: 30 }), x0 = 2, rr = v.d / 2;
          F.poly([[0, 0], [v.L, 0], [v.L, v.W - v.b], [v.L - v.a, v.W], [0, v.W]], SH); F.poly([[x0, 0]].concat(A.arc(x0 + rr, 0, rr, 180, 0, 30)), { fill: CUT }); F.pline([[v.L - v.a, v.W], [v.L, v.W], [v.L, v.W - v.b]], { dash: true, w: 1.2 });
          lab(F, (v.L + x0 + v.d) / 2 + 2, 0, v.L + ' m', 'below'); lab(F, 0, v.W / 2, v.W + ' m', 'left'); lab(F, v.L - v.a / 2, v.W, v.a + ' m', 'above', { size: 11 }); lab(F, v.L, v.W - v.b / 2, v.b + ' m', 'right', { size: 11 }); lab(F, x0 + rr, 0, v.d + ' m', 'below', { size: 11 }); lab(F, x0 + rr, rr * 0.4, 'patio', 'c', { size: 10 });
          v.fig = F.svg('lawn with a garden corner and a patio'); return v;
        },
        parts: [
          { id: 'e13a', level: 'ADV', make: function (r, sh) {
            var W0 = sh.L * sh.W, T0 = sh.a * sh.b / 2, rr = sh.d / 2, S = Math.PI * rr * rr / 2, ex = W0 - T0 - S;
            return area('Find the area of the lawn, to the nearest hundredth of a square metre.', ex, 'm', { dp: 2, exact: ex,
              bad: A.circBad(W0 - T0, rr, -1, true).concat([[W0 - sh.a * sh.b - S, 'u3l9-no-half', 'The garden corner is a triangle: ' + t('\\tfrac{1}{2}\\times ' + sh.a + '\\times ' + sh.b) + '.'], [W0 - T0, 'u3l9-one-cut', 'Subtract the patio too.'], [W0 - S, 'u3l9-one-cut', 'Subtract the triangle garden too.'], [W0 - T0 + S, 'u3l9-added-cut', 'The patio is not lawn: subtract it.']]),
              sol: ['Whole: ' + t(sh.L + '\\times ' + sh.W + '=' + W0 + uT('m²')), 'Triangle: ' + t('\\tfrac{1}{2}\\times ' + sh.a + '\\times ' + sh.b + '=' + N(T0) + uT('m²')), 'Patio: ' + t('\\tfrac{1}{2}\\times\\pi\\times ' + N(rr) + '^2=' + C().raw(S, 3) + uT('m²')), 'Lawn: ' + t(W0 + '-' + N(T0) + '-' + C().raw(S, 3) + eqR(ex, 2) + uT('m²'))],
              hints: ['Whole minus two cut-outs: a triangle and a semicircle.'], text: 'lawn two cuts' });
          } },
          { id: 'e13b', level: 'ADV', make: function (r, sh) { return countUp('One bag of fertilizer covers ' + sh.c + ' m². How many bags are needed?', sh.A, sh.c, { unit: 'bags', one: 'a bag', oneName: 'bag', text: 'fertilizer' }); } }] },
      { num: '14', stem: function (sh) { return 'An L-shaped countertop is ' + sh.d + ' ft deep. Its two outside edges are ' + ftin(sh.Af, sh.Ai) + ' and ' + ftin(sh.Bf, sh.Bi) + ' long, as shown.' + sh.fig; },
        shared: function (r) {
          var v = find(function () { var v = { d: 2, Af: r.int(7, 10), Ai: r.pick([3, 6, 9]), Bf: r.int(4, 6), Bi: r.pick([0, 3, 6, 9]), p: r.pick([65, 75, 85, 89.5]) }; v.Al = v.Af + v.Ai / 12; v.Bl = v.Bf + v.Bi / 12; return v; }, function (v) { return v.Bl - v.d >= 2 && !(v.Af === 8 && v.Ai === 6 && v.Bf === 5 && v.Bi === 3); });
          v.A = v.Al * v.d + (v.Bl - v.d) * v.d;
          var F = A.fig(0, 0, v.Al, v.Bl, { w: 230, h: 170, pad: 34 }); F.poly([[0, 0], [v.Al, 0], [v.Al, v.d], [v.d, v.d], [v.d, v.Bl], [0, v.Bl]], SH);
          lab(F, v.Al / 2, 0, ftin(v.Af, v.Ai), 'below'); lab(F, 0, v.Bl / 2, ftin(v.Bf, v.Bi), 'left'); lab(F, v.Al, v.d / 2, v.d + ' ft', 'right'); lab(F, v.d / 2, v.Bl, v.d + ' ft', 'above');
          v.fig = F.svg('L-shaped countertop'); return v;
        },
        parts: [
          { id: 'e14a', level: 'MAS', make: function (r, sh) {
            return area('Find the area of the countertop in ft². Be careful not to count the corner twice.', sh.A, 'ft', { bad: [[sh.Al * sh.d + sh.Bl * sh.d, 'u3l9-overlap', 'The ' + sh.d + ' ft by ' + sh.d + ' ft corner is in both pieces. The short piece starts above the corner: ' + t(N(sh.Bl) + '-' + sh.d) + '.'], [(sh.Af + sh.Ai / 10) * sh.d + (sh.Bf + sh.Bi / 10 - sh.d) * sh.d, 'u3l9-ftin-dec', 'Inches are twelfths of a foot: ' + t(sh.Ai + '\\text{ in}=' + sh.Ai + '\\div 12=' + N(sh.Ai / 12) + '\\text{ ft}') + '.'], [sh.Al * sh.Bl, 'u3l9-no-cut', 'That’s the whole rectangle around the counter. The counter is only ' + sh.d + ' ft deep.']],
              sol: [ftin(sh.Af, sh.Ai) + ' = ' + N(sh.Al) + ' ft, &nbsp; ' + ftin(sh.Bf, sh.Bi) + ' = ' + N(sh.Bl) + ' ft', 'Long piece: ' + t(N(sh.Al) + '\\times ' + sh.d + '=' + N(sh.Al * sh.d) + uT('ft²')), 'Short piece (above the corner): ' + t('(' + N(sh.Bl) + '-' + sh.d + ')\\times ' + sh.d + '=' + N(sh.Bl - sh.d) + '\\times ' + sh.d + '=' + N((sh.Bl - sh.d) * sh.d) + uT('ft²')), 'Total: ' + t(N(sh.Al * sh.d) + '+' + N((sh.Bl - sh.d) * sh.d) + '=' + N(sh.A) + uT('ft²'))],
              hints: ['Change the ft-and-in lengths to feet.', 'Split into a long piece and a short piece that don’t overlap.'], text: 'countertop' });
          } },
          { id: 'e14b', level: 'ADV', make: function (r, sh) {
            var p1 = sh.Bl * sh.d, p2 = (sh.Al - sh.d) * sh.d;
            return A.fields('Check your answer by splitting the other way: the piece along the ' + ftin(sh.Bf, sh.Bi) + ' edge (all the way up), then the rest of the long piece.', [
              { label: 'Piece along the ' + ftin(sh.Bf, sh.Bi) + ' edge:', name: 'first piece', ans: p1, after: 'ft²', exactOk: true, bad: [[(sh.Bl - sh.d) * sh.d, 'u3l9-split-same', 'Splitting the other way, this piece goes all the way up: ' + N(sh.Bl) + ' ft by ' + sh.d + ' ft.']] },
              { label: 'Rest of the long piece:', name: 'second piece', ans: p2, after: 'ft²', exactOk: true, bad: [[sh.Al * sh.d, 'u3l9-overlap', 'The corner is already in the first piece: the rest is ' + t(N(sh.Al) + '-' + sh.d) + ' ft long.']] }],
              [t(N(sh.Bl) + '\\times ' + sh.d + '=' + N(p1)) + '; ' + t('(' + N(sh.Al) + '-' + sh.d + ')\\times ' + sh.d + '=' + N(p2)), t(N(p1) + '+' + N(p2) + '=' + N(sh.A) + uT('ft²')) + ' (the same)'], ['This time the corner belongs to the piece along the short edge.'], 'countertop check');
          } },
          { id: 'e14c', level: 'ADV', make: function (r, sh) { var c = sh.A * sh.p; return A.num('Quartz costs ' + Mp(sh.p) + ' per ft², installed. What will the countertop cost?', c, { money: true, bad: [[(sh.Al * sh.d + sh.Bl * sh.d) * sh.p, 'u3l9-overlap', 'Use the area without counting the corner twice.']], sol: [t(N(sh.A) + '\\times ' + M(sh.p) + '=' + M(c))], hints: ['Area × price per ft².'], text: 'quartz cost' }); } }] }
    ]
  });
})(window);
