/* Math 10-3 · Unit 5 · Lesson 7 — Transversals: Naming the Angle Pairs (G5)
 * Assignment 7 (u5_l07.tex, Questions 1–16) and the Lesson 7 Extra Practice (u5_ep07.tex, A 1–3, B 4–8, C 9–12).
 * Every part is a generator: the same situation and difficulty as the booklet item with a new diagram (transversal tilt,
 * line slopes, rotation, letter names) and new numbers around the booklet's (the lesson's worked-example numbers are left out).
 * Numbered diagrams use the booklet numbering (HW.geo.transversalSVG: 1–4 clockwise from the upper left at the top crossing,
 * 5–8 at the bottom crossing). Lettered and real-world diagrams (rotated transversals, a gate, a triangle, parking stalls,
 * a stepladder, a # of four lines) are drawn with the line-figure kit below, which also works out every pair name from the
 * geometry (so a rotated or mirrored picture is always named right).
 * Conversions: "is t a transversal? give a reason" → multiple choice of yes/no with the reason; "list the angles" → tap the
 * angles (chips ∠1–∠8); "name the angle that is…" → angle-number boxes (a wrong angle gets a hint naming the pair it makes);
 * "name each pair" → multiple choice of the names (+ "next to each other on a line" and "no special name" where the booklet
 * has them) or the name typed (HW.geo.pairChk: spellings and synonyms accepted); "what are the two lines and the transversal?"
 * → multiple choice, or the line letters typed; "measure with a protractor" → read the protractor laid on the angle (±1°);
 * "explain / is she right?" → multiple choice of reasons; "make a systematic list" → boxes for the counts + tap the pairs.
 *
 * HW.u5tk (exported for Lessons 8 and 9): LF (line figures: intersections, angle labels, pair names, SVG), std (numbered
 * diagram), meas, the angle-number checker, pairPick (names MC), lineChk / twoLinesChk, setP (tap the angles), angP. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  var TK = HW.u5tk = HW.u5tk || {};
  var RAD = Math.PI / 180, INK = '#1d2633', GREY = '#8a909c';
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function n360(a) { return ((a % 360) + 360) % 360; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function deg(v) { return n360(Math.atan2(v[1], v[0]) / RAD); }
  function dirv(d) { return [Math.cos(d * RAD), Math.sin(d * RAD)]; }
  function A(k) { return t('\\angle ' + k); }
  function D(v) { return t(v + '^\\circ'); }
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 300; i++) { var v = gen(); if (test(v)) return v; } return fb; }
  TK.A = A; TK.D = D; TK.steps = steps; TK.find = find;

  /* ================= a small SVG canvas (screen px, y down) ================= */
  function Cv() { this.s = ''; this.bb = [Infinity, Infinity, -Infinity, -Infinity]; }
  Cv.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); };
  Cv.prototype.line = function (p, q, o) { o = o || {}; this.s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; this.grow(p[0], p[1]); this.grow(q[0], q[1]); };
  Cv.prototype.path = function (d, o, pts) { o = o || {}; this.s += '<path d="' + d + '" fill="' + (o.fill || 'none') + '"' + (o.fillOpacity != null ? ' fill-opacity="' + o.fillOpacity + '"' : '') + ' stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>'; var me = this; (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); };
  Cv.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-z]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '', w = str.length * size * 0.3 + 2;
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it + ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round">' + esc(str).replace(/-/g, '−') + '</text>';
    this.grow(o.anchor === 'start' ? x + w : o.anchor === 'end' ? x - w : x, y, o.anchor ? 0 : w, size * 0.62); if (o.anchor) this.grow(x, y, 0, size * 0.62);
  };
  Cv.prototype.svg = function (o) {
    o = o || {}; var pad = 8, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>';
  };

  /* ================= line figures =================
   * LF({ id: { p: [x, y], q: [x, y], name, nameAt: 'q'|'p', marks: 0|1|2, color, width } }, { scale })  (math coordinates, y up)
   * F.X(a, b) the crossing of two lines; F.ang(a, sa, b, sb) the angle at X(a, b) between the ray along a (sa = +1: towards q,
   * −1: towards p) and the ray along b; F.name(A1, A2) the pair name ('corresponding' | 'alt-int' | 'alt-ext' | 'int-same' |
   * 'ext-same' | 'none' at different crossings of a common transversal; 'vert-opp' | 'linear' at one crossing; null if the
   * two angles share no line); F.trans(A1, A2) the common line; F.svg({ labels: [{ ang, text, arc, color }], rights: [ang],
   * polys: [{ pts, fill }], segs: [{ p, q, color, width, dash }], texts: [{ at, s, size, anchor, color }], dots: [pt], width }). */
  function LF(lines, o) {
    o = o || {}; var S = o.scale || 46, L = {};
    Object.keys(lines).forEach(function (id) { var l = lines[id], dx = l.q[0] - l.p[0], dy = l.q[1] - l.p[1], n = Math.hypot(dx, dy); L[id] = Object.assign({ id: id, d: [dx / n, dy / n] }, l); });
    var F = { L: L, S: S };
    F.X = function (a, b) {
      var P1 = L[a], P2 = L[b], den = P1.d[0] * P2.d[1] - P1.d[1] * P2.d[0], w = [P2.p[0] - P1.p[0], P2.p[1] - P1.p[1]];
      if (Math.abs(den) < 1e-9) return null;
      var s = (w[0] * P2.d[1] - w[1] * P2.d[0]) / den; return [P1.p[0] + s * P1.d[0], P1.p[1] + s * P1.d[1]];
    };
    F.ang = function (a, sa, b, sb) { var V = F.X(a, b); return { a: a, sa: sa, b: b, sb: sb, V: V, d1: deg([L[a].d[0] * sa, L[a].d[1] * sa]), d2: deg([L[b].d[0] * sb, L[b].d[1] * sb]) }; };
    function sg(X, id) { return X.a === id ? X.sa : X.b === id ? X.sb : 0; }
    F.trans = function (X, Y) { var c = [X.a, X.b].filter(function (id) { return id === Y.a || id === Y.b; }); return c.length === 1 ? c[0] : null; };
    F.name = function (X, Y) {
      var c = [X.a, X.b].filter(function (id) { return id === Y.a || id === Y.b; });
      if (c.length === 2) { var diff = [X.a, X.b].filter(function (id) { return sg(X, id) !== sg(Y, id); }).length; return diff === 2 ? 'vert-opp' : diff === 1 ? 'linear' : 'same'; }
      if (c.length !== 1) return null;
      var T = L[c[0]];
      function info(U, W) {
        var oid = U.a === c[0] ? U.b : U.a, st = sg(U, c[0]), so = sg(U, oid), od = L[oid].d;
        var toward = (T.d[0] * st) * (W.V[0] - U.V[0]) + (T.d[1] * st) * (W.V[1] - U.V[1]) > 0;
        var side = T.d[0] * od[1] * so - T.d[1] * od[0] * so > 0 ? 1 : -1;
        return { int: toward, side: side };
      }
      var i1 = info(X, Y), i2 = info(Y, X);
      if (i1.int === i2.int) return i1.int ? (i1.side === i2.side ? 'int-same' : 'alt-int') : (i1.side === i2.side ? 'ext-same' : 'alt-ext');
      return i1.side === i2.side ? 'corresponding' : 'none';
    };
    F.isInt = function (X, Y) { var c = F.trans(X, Y); if (!c) return null; var st = sg(X, c); return (L[c].d[0] * st) * (Y.V[0] - X.V[0]) + (L[c].d[1] * st) * (Y.V[1] - X.V[1]) > 0; };
    function sp(p) { return [p[0] * S, -p[1] * S]; }
    F.sp = sp;
    F.svg = function (so) {
      so = so || {}; var cv = new Cv();
      (so.polys || []).forEach(function (pg) { var pts = pg.pts.map(sp); cv.path('M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z', { fill: pg.fill || '#eef3fb', stroke: pg.stroke || 'none', width: pg.width || 1 }, pts); });
      (so.segs || []).forEach(function (sg2) { cv.line(sp(sg2.p), sp(sg2.q), { color: sg2.color || GREY, width: sg2.width || 3, dash: sg2.dash }); });
      Object.keys(L).forEach(function (id) {
        var l = L[id]; if (l.hidden) return;
        var p = sp(l.p), q = sp(l.q); cv.line(p, q, { color: l.color, width: l.width || 2.4, dash: l.dash });
        var ds = [l.d[0], -l.d[1]];
        for (var m = 0; m < (l.marks || 0); m++) {   // ">" marks along the line
          var tpos = l.markAt == null ? 0.2 : l.markAt, c = [p[0] + (q[0] - p[0]) * tpos + ds[0] * m * 8, p[1] + (q[1] - p[1]) * tpos + ds[1] * m * 8], nx = [-ds[1], ds[0]];
          cv.path('M' + f1(c[0] - ds[0] * 7 + nx[0] * 6) + ' ' + f1(c[1] - ds[1] * 7 + nx[1] * 6) + 'L' + f1(c[0]) + ' ' + f1(c[1]) + 'L' + f1(c[0] - ds[0] * 7 - nx[0] * 6) + ' ' + f1(c[1] - ds[1] * 7 - nx[1] * 6), { stroke: l.color || INK, width: 2 }, [c]);
        }
        if (l.name) { var e = l.nameAt === 'p' ? p : q, sgn = l.nameAt === 'p' ? -1 : 1, off = 10 + String(l.name).length * (l.nameSize || 15) * 0.3, nm = [e[0] + ds[0] * sgn * off, e[1] + ds[1] * sgn * off]; cv.text(nm[0], nm[1], l.name, { size: l.nameSize || 15, color: l.nameColor || INK, weight: 700 }); }
      });
      (so.rights || []).forEach(function (X) {
        var V = sp(X.V), u = dirv(X.d1), v = dirv(X.d2), k = 11, a1 = [V[0] + u[0] * k, V[1] - u[1] * k], a2 = [V[0] + (u[0] + v[0]) * k, V[1] - (u[1] + v[1]) * k], a3 = [V[0] + v[0] * k, V[1] - v[1] * k];
        cv.path('M' + f1(a1[0]) + ' ' + f1(a1[1]) + 'L' + f1(a2[0]) + ' ' + f1(a2[1]) + 'L' + f1(a3[0]) + ' ' + f1(a3[1]), { stroke: INK, width: 1.5 });
      });
      (so.labels || []).forEach(function (lb) {
        var X = lb.ang, V = sp(X.V), u = dirv(X.d1), v = dirv(X.d2), bis = [u[0] + v[0], u[1] + v[1]], bn = Math.hypot(bis[0], bis[1]) || 1;
        var cosT = Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1])), half = Math.acos(cosT) / 2, str = String(lb.text), size = lb.size || 15, hw = str.length * size * 0.3 + 3;
        var r = Math.max(lb.min || 15, Math.min(70, (hw + 4) / Math.max(0.15, Math.sin(half))));
        if (lb.arc) {
          var ar = Math.max(16, r - hw - 6), s0 = X.d1, span = n360(X.d2 - X.d1); if (span > 180) { s0 = X.d2; span = 360 - span; }
          var pa = [V[0] + ar * Math.cos(s0 * RAD), V[1] - ar * Math.sin(s0 * RAD)], pb = [V[0] + ar * Math.cos((s0 + span) * RAD), V[1] - ar * Math.sin((s0 + span) * RAD)];
          cv.path('M' + f1(pa[0]) + ' ' + f1(pa[1]) + 'A' + f1(ar) + ' ' + f1(ar) + ' 0 0 0 ' + f1(pb[0]) + ' ' + f1(pb[1]), { stroke: lb.color || INK, width: 1.6 }, [pa, pb]);
        }
        cv.text(V[0] + bis[0] / bn * r, V[1] - bis[1] / bn * r, str, { size: size, color: lb.color || INK, weight: 700, italic: lb.italic });
      });
      (so.dots || []).forEach(function (d) { var p = sp(d); cv.s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="3.4" fill="' + INK + '"/>'; cv.grow(p[0], p[1], 3.4); });
      (so.texts || []).forEach(function (tx) { var p = sp(tx.at); cv.text(p[0], p[1], tx.s, { size: tx.size || 13, anchor: tx.anchor, color: tx.color || '#4b5260', weight: tx.weight || 600, italic: false }); });
      return cv.svg({ width: so.width || 330, aria: so.aria });
    };
    return F;
  }
  TK.LF = LF;
  /* rotate / mirror a set of LF line specs about the origin (degrees, counterclockwise) */
  function turnLines(lines, rot, mirror) {
    var c = Math.cos(rot * RAD), s = Math.sin(rot * RAD), out = {};
    function tp(p) { var x = mirror ? -p[0] : p[0], y = p[1]; return [x * c - y * s, x * s + y * c]; }
    Object.keys(lines).forEach(function (id) { var l = Object.assign({}, lines[id]); l.p = tp(l.p); l.q = tp(l.q); out[id] = l; });
    return out;
  }
  TK.turn = turnLines;
  function turnPt(p, rot, mirror) { var c = Math.cos(rot * RAD), s = Math.sin(rot * RAD), x = mirror ? -p[0] : p[0], y = p[1]; return [x * c - y * s, x * s + y * c]; }
  TK.turnPt = turnPt;

  /* ================= numbered diagrams ================= */
  TK.std = function (o) { return G.transversalSVG(Object.assign({ width: 330 }, o)); };
  /* the size of numbered angle k: tilt = ∠2, skew = the bottom line's slope (0 when parallel) */
  TK.meas = function (tilt, skew, k) { return Math.round(G.transversalGeom({ tilt: tilt, parallel: !skew, skew: skew || 0 }).measure(k) * 10) / 10; };
  TK.tilt = function (r, avoid) { avoid = avoid || []; return find(function () { return r.chance(0.5) ? r.int(48, 76) : r.int(104, 132); }, function (v) { return avoid.indexOf(v) < 0; }, 58); };
  var PN = G.PAIR_NAMES, PS = G.PAIR_SHORT, PAIRS = G.PAIRS;
  var NONE = [[1, 6], [2, 5], [3, 8], [4, 7]];
  TK.NONE = NONE;
  TK.pairsOf = function (id) { return id === 'none' ? NONE : PAIRS[id]; };
  TK.nameOf = function (a, b) { return G.pairName(a, b) || (a !== b ? 'none' : null); };
  var LONG = Object.assign({}, PN, { none: 'a pair with no special name', linear: 'next to each other on a straight line (they add to 180°)' });
  var SHORT = Object.assign({}, PS, { none: 'no special name', linear: 'next to each other on a straight line (180°)' });
  TK.LONG = LONG; TK.SHORT = SHORT;
  var WANT = { corresponding: 'in the <b>same position</b> at the other crossing (add or subtract 4)', 'vert-opp': '<b>across from it</b> at the same crossing',
    'alt-int': 'between the lines, on the <b>other side</b> of t, at the other crossing (a Z)', 'alt-ext': 'outside the lines, on the <b>other side</b> of t, at the other crossing',
    'int-same': 'between the lines, on the <b>same side</b> of t, at the other crossing (a C or U)', 'ext-same': 'outside the lines, on the <b>same side</b> of t, at the other crossing' };
  TK.WANT = WANT;
  var SOLW = { corresponding: function (k, g) { return A(k) + ' is in the same position as ' + A(g) + ', at the other crossing (corresponding).'; },
    'vert-opp': function (k, g) { return A(k) + ' is across from ' + A(g) + ' at the same crossing (vertically opposite).'; },
    'alt-int': function (k, g) { return A(k) + ' and ' + A(g) + ' are both between the lines, on opposite sides of t (a Z).'; },
    'alt-ext': function (k, g) { return A(k) + ' and ' + A(g) + ' are both outside the lines, on opposite sides of t.'; },
    'int-same': function (k, g) { return A(k) + ' and ' + A(g) + ' are both between the lines, on the same side of t (a C).'; },
    'ext-same': function (k, g) { return A(k) + ' and ' + A(g) + ' are both outside the lines, on the same side of t.'; } };
  /* "the angle that is <want> to ∠given": a typed angle number 1–8 */
  function readNo(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\angle|∠|angle|\\text\{([^}]*)\}/gi, '$1').replace(/[\s\\,{}]/g, '');
    if (!s) return { code: 'empty' }; if (!/^\d+$/.test(s)) return { code: 'nan' }; return { v: Number(s) };
  }
  TK.angNoChk = function (target, given, want) {
    return function (resp) {
      var a = readNo(resp);
      if (a.code === 'empty') return form('empty', 'Type the number of the angle (1 to 8).');
      if (a.code) return form('u5l7-angno', 'Type just the angle’s number, like 6.');
      var v = a.v; if (v < 1 || v > 8) return form('u5l7-angno', 'The angles are numbered 1 to 8.');
      if (v === target) return ok();
      if (v === given) return wrong('u5l7-same-angle', 'That’s the angle you started from. Find its partner.');
      var nm = TK.nameOf(given, v);
      return wrong('u5l7-gave-' + nm, A(given) + ' and ' + A(v) + ' are ' + LONG[nm] + '. You want the angle ' + WANT[want] + '.');
    };
  };
  TK.angNoP = function (prompt, given, want, o) {
    o = o || {}; var target = PAIRS[want].map(function (p) { return p[0] === given ? p[1] : p[1] === given ? p[0] : null; }).filter(function (x) { return x != null; })[0];
    return { prompt: prompt, input: { type: 'number', before: t('\\angle') }, check: TK.angNoChk(target, given, want), key: String(target), answer: A(target),
      solution: o.sol || SOLW[want](target, given), hints: o.hints || ['Find ' + A(given) + ' in the diagram first.'], text: o.text, bad: o.bad, _target: target };
  };
  /* tap the angles: want = [numbers] */
  TK.setP = function (prompt, want, o) {
    o = o || {}; var W = want.map(String);
    var opts = [1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return { value: String(k), html: A(k) }; });
    return { prompt: prompt, input: { type: 'select', options: opts, help: o.help || 'Tap every angle that fits. Tap again to unselect.' },
      check: function (resp) {
        resp = (resp || []).map(String);
        if (!resp.length) return form('empty', 'Tap the angles first.');
        var extra = resp.filter(function (x) { return W.indexOf(x) < 0; }), miss = W.filter(function (x) { return resp.indexOf(x) < 0; });
        if (!extra.length && !miss.length) return ok();
        var h = o.why ? o.why(extra.map(Number), miss.map(Number)) : null;
        return wrong(h && h.code || 'u5l7-set', (h && h.hint) || (extra.length ? A(extra[0]) + ' doesn’t belong. ' : 'You’re missing ' + (miss.length === 1 ? 'one angle' : miss.length + ' angles') + '. ') + (o.rule || ''));
      }, key: W.slice().sort(), answer: want.slice().sort().map(A).join(', '), solution: o.sol, hints: o.hints || [], text: o.text };
  };
  /* an angle size (number box, °); alts: [[value, hint]] for known wrong values */
  TK.angP = function (prompt, deg0, o) {
    o = o || {}; var alts = [], seen = [deg0];
    (o.alts || []).forEach(function (a) { if (a && isFinite(a[0]) && a[0] > 0 && seen.indexOf(a[0]) < 0) { seen.push(a[0]); alts.push({ v: a[0], code: a[2] || 'u5-angle-rule', hint: a[1] }); } });
    var p = G.P.angle(prompt, deg0, { alts: alts, supplementTrap: o.trap === undefined ? 'Check the rule: are these two angles <b>equal</b>, or do they <b>add to 180°</b>?' : o.trap, sol: o.sol, hints: o.hints, text: o.text, tol: o.tol, nr: o.nr });
    p.bad = alts.map(function (a) { return String(a.v); });
    if (o.nr) p.input.nr = true;
    return p;
  };
  /* names MC. ids default: the six names; o.linear / o.none add those choices */
  function pairWhy(target, got) {
    var same = { 'vert-opp': 1, linear: 1 };
    if (same[target]) { if (same[got]) return target === 'vert-opp' ? 'These two are <b>across from each other</b> (like the opposite parts of an X), not side by side.' : 'These two sit <b>side by side</b> on a straight line, not across from each other.'; return 'These two angles are at the <b>same crossing</b>. The other names are for angles at two different crossings.'; }
    if (target === 'none') return 'Look again: one angle is interior and one is exterior, and they are on <b>opposite</b> sides of the transversal. That mix has no special name.';
    if (got === 'none') return 'This pair does have a name. Ask: interior or exterior? Same side of the transversal, or opposite sides?';
    if (same[got]) return 'That name is for two angles at the <b>same</b> crossing. These two are at <b>different</b> crossings.';
    var h = G.pairChk(target)(PS[got]); return h && h.hint || 'Ask the three questions again: same crossing? interior or exterior? same side of the transversal?';
  }
  TK.pairWhy = pairWhy;
  TK.pairPick = function (r, prompt, target, o) {
    o = o || {}; var ids = (o.ids || ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp']).slice();
    if (o.linear && ids.indexOf('linear') < 0) ids.push('linear'); if (o.none && ids.indexOf('none') < 0) ids.push('none');
    if (ids.indexOf(target) < 0) ids.push(target);
    if (ids.length > 5) {   // multiple choice has at most 5 choices: the answer, the extra choices asked for, then others at random
      var keep = [target].concat(['linear', 'none'].filter(function (x) { return o[x] && x !== target; })), rest = r.shuffle(ids.filter(function (x) { return keep.indexOf(x) < 0; }));
      keep = keep.concat(rest.slice(0, 5 - keep.length)); ids = ids.filter(function (x) { return keep.indexOf(x) >= 0; });
    }
    var opts = ids.map(function (id) { return { html: SHORT[id], right: id === target, why: id === target ? null : pairWhy(target, id), code: 'pair-' + id }; });
    var p = P.mc(r, prompt, opts, o.sol, o.hints || ['Same crossing? Interior or exterior? Same side of the transversal or opposite sides?'], o.text, true);
    p.input.columns = 2; return p;
  };
  /* a typed line letter, and two typed line letters (any order, "and" / comma) */
  function letters(resp) { return String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}|\\ell_?\{?(\d)\}?/g, function (m, a, b) { return a != null ? a : 'l' + b; }).replace(/ℓ₁/g, 'l1').replace(/ℓ₂/g, 'l2').replace(/\b(line|lines|the|and|is|are|transversal)\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean); }
  TK.lineChk = function (id, o) {
    o = o || {};
    return function (resp) {
      var w = letters(resp); if (!w.length) return form('empty', 'Type the letter of the line.');
      if (w.length > 1) return form('u5l7-one-line', 'Type just one line letter.');
      if (w[0] === id) return ok();
      if ((o.all || []).indexOf(w[0]) >= 0) return wrong('u5l7-wrong-trans', o.hint || 'The transversal is the line that goes through the <b>vertices of both angles</b>.');
      return form('u5l7-line-letter', 'Use the letters on the diagram (' + (o.all || []).join(', ') + ').');
    };
  };
  TK.twoLinesChk = function (ids, o) {
    o = o || {};
    return function (resp) {
      var w = letters(resp); if (!w.length) return form('empty', 'Type the two line letters, like ' + ids.join(' and ') + '.');
      if (w.length !== 2) return form('u5l7-two-lines', 'Type <b>two</b> line letters, like a and b.');
      if ((w[0] === ids[0] && w[1] === ids[1]) || (w[0] === ids[1] && w[1] === ids[0])) return ok();
      if (w.every(function (x) { return (o.all || []).indexOf(x) >= 0; })) return wrong('u5l7-wrong-lines', o.hint || 'The two lines are the <b>other</b> lines at the two vertices (not the transversal).');
      return form('u5l7-line-letter', 'Use the letters on the diagram (' + (o.all || []).join(', ') + ').');
    };
  };
  function tf(r, prompt, truth, why, sol) { return P.tf(r, prompt, truth, why, sol, [], 'true/false'); }
  TK.tf = tf;

  HW.addCodes({
    'u5l7-angno': 'Not an angle number', 'u5l7-same-angle': 'Gave the angle it started from', 'u5l7-set': 'Wrong set of angles',
    'u5l7-gave-corresponding': 'Gave the corresponding angle', 'u5l7-gave-alt-int': 'Gave the alternate interior angle', 'u5l7-gave-alt-ext': 'Gave the alternate exterior angle',
    'u5l7-gave-int-same': 'Gave the interior angle on the same side', 'u5l7-gave-ext-same': 'Gave the exterior angle on the same side', 'u5l7-gave-vert-opp': 'Gave the vertically opposite angle',
    'u5l7-gave-linear': 'Gave the angle next to it on the line', 'u5l7-gave-none': 'Gave an angle with no special relation', 'u5l7-ext-for-int': 'Mixed up interior and exterior',
    'u5l7-side-mixup': 'Mixed up the left and right sides of the transversal', 'u5l7-one-line': 'More than one line letter', 'u5l7-two-lines': 'Not two line letters', 'u5l7-line-letter': 'Not a line on the diagram',
    'u5l7-wrong-trans': 'Wrong line as the transversal', 'u5l7-wrong-lines': 'Wrong two lines', 'u5-angle-rule': 'Used the wrong angle rule', 'u5l7-parallel-rule': 'Used a parallel-line rule on lines that are not parallel',
    'u5l7-count': 'Wrong count of pairs'
  });

  /* ================= lesson figures ================= */
  /* Q1-style mini pictures: kind 'three' (yes), 'two' (yes), 'parallel' (no), 'through' (no), 'perp' (yes) */
  function miniFig(r, kind) {
    var lines = {}, rights = [], tilt = r.int(60, 76) * (r.chance(0.5) ? 1 : -1), rot = 0;
    if (kind === 'three' || kind === 'two') {
      var n = kind === 'three' ? 3 : 2, names = kind === 'three' ? ['j', 'k', 'm'] : r.pick([['m', 'n'], ['a', 'b']]);
      for (var i = 0; i < n; i++) { var y = (n - 1 - i) * 1.15, sl = r.int(-6, 6) / 100; lines[names[i]] = { p: [-0.3, y - sl * 2], q: [3.6, y + sl * 2], name: names[i] }; }
      var tb = 1.7 + r.int(-3, 3) / 10, h = (n - 1) * 1.15 + 1.6, dx = h / Math.tan(Math.abs(tilt) * RAD) * (tilt > 0 ? 1 : -1);
      lines.t = { p: [tb - dx / 2, -0.8], q: [tb + dx / 2, h - 0.8], name: 't' };
    } else if (kind === 'parallel') {
      var pos = r.int(0, 2), ys = [2.2, 1.1, 0], nm = ['m', 'n'], k = 0;
      for (var j = 0; j < 3; j++) { if (j === pos) lines.t = { p: [-0.3, ys[j]], q: [3.6, ys[j]], name: 't', marks: 1, markAt: 0.45 }; else { lines[nm[k]] = { p: [-0.3, ys[j]], q: [3.6, ys[j]], name: nm[k], marks: 1, markAt: 0.45 }; k++; } }
    } else if (kind === 'through') {
      var a1 = r.int(14, 24), a2 = -r.int(14, 24), X = [1.7, 0.8];
      lines.m = { p: [X[0] - 1.9 * Math.cos(a1 * RAD), X[1] - 1.9 * Math.sin(a1 * RAD)], q: [X[0] + 1.9 * Math.cos(a1 * RAD), X[1] + 1.9 * Math.sin(a1 * RAD)], name: 'm' };
      lines.n = { p: [X[0] - 1.9 * Math.cos(a2 * RAD), X[1] - 1.9 * Math.sin(a2 * RAD)], q: [X[0] + 1.9 * Math.cos(a2 * RAD), X[1] + 1.9 * Math.sin(a2 * RAD)], name: 'n' };
      var at = 90 + r.int(-14, 14); lines.t = { p: [X[0] - 1.7 * Math.cos(at * RAD), X[1] - 1.7 * Math.sin(at * RAD)], q: [X[0] + 1.7 * Math.cos(at * RAD), X[1] + 1.7 * Math.sin(at * RAD)], name: 't' };
    } else {   // perp
      rot = r.pick([0, 0, 15, -15, 90]);
      lines.m = { p: [-0.3, 1.5], q: [3.6, 1.5], name: 'm', marks: 1, markAt: 0.12 }; lines.n = { p: [-0.3, 0], q: [3.6, 0], name: 'n', marks: 1, markAt: 0.12 };
      var xt = 1.4 + r.int(0, 6) / 10; lines.t = { p: [xt, -0.8], q: [xt, 2.4], name: 't' };
      lines = turnLines(lines, rot, false);
    }
    var F = LF(lines, { scale: 34 });
    if (kind === 'perp') { rights.push(F.ang('t', 1, 'm', 1)); rights.push(F.ang('t', 1, 'n', 1)); }
    return F.svg({ rights: rights, width: 210, aria: 'lines and a possible transversal' });
  }
  /* a parallel pair m ∥ n cut by t, turned any way, the 8 angles lettered */
  function paraFig(r, o) {
    o = o || {};
    var tdir = o.tdir != null ? o.tdir : r.pick([0, 0, 8, -8, 90, 82, 98, 172]), delta = o.delta || find(function () { return r.int(50, 130); }, function (v) { return Math.abs(v - 90) > 14; }, 68);
    var ldir = tdir + delta, g = 2.3, Mp = [0, 0], Np = [g * Math.cos(tdir * RAD), g * Math.sin(tdir * RAD)], hl = 1.75, ext = 1.1;
    var ln = o.lineNames || ['m', 'n', 't'];
    function seg(c, d, h) { return { p: [c[0] - h * Math.cos(d * RAD), c[1] - h * Math.sin(d * RAD)], q: [c[0] + h * Math.cos(d * RAD), c[1] + h * Math.sin(d * RAD)] }; }
    var lines = {};
    lines.m = Object.assign(seg(Mp, ldir, hl), { name: ln[0], marks: o.marks === 0 ? 0 : 1, markAt: 0.78 });
    lines.n = Object.assign(seg(Np, ldir, hl), { name: ln[1], marks: o.marks === 0 ? 0 : 1, markAt: 0.78 });
    lines.t = { p: [Mp[0] - ext * Math.cos(tdir * RAD), Mp[1] - ext * Math.sin(tdir * RAD)], q: [Np[0] + ext * Math.cos(tdir * RAD), Np[1] + ext * Math.sin(tdir * RAD)], name: ln[2] };
    // names at the upper/right end
    ['m', 'n'].forEach(function (id) { var l = lines[id]; if (l.q[1] < l.p[1] - 0.01 || (Math.abs(l.q[1] - l.p[1]) < 0.01 && l.q[0] < l.p[0])) { var tmp = l.p; l.p = l.q; l.q = tmp; } l.nameAt = 'q'; });
    var F = LF(lines, { scale: 44 }), angs = [];
    ['m', 'n'].forEach(function (id) { [1, -1].forEach(function (st) { [1, -1].forEach(function (sl) { angs.push(F.ang('t', st, id, sl)); }); }); });
    var lts = r.shuffle((o.letters || 'abcdefgh').split(''));
    angs.forEach(function (x, i) { x.letter = lts[i]; });
    return { F: F, angs: angs, svg: function (extra) { return F.svg(Object.assign({ labels: angs.map(function (x) { return { ang: x, text: x.letter }; }), width: 300 }, extra || {})); } };
  }
  /* all pairs of lettered angles with a given name */
  function pairsNamed(F, angs, name) { var out = []; for (var i = 0; i < angs.length; i++) for (var j = i + 1; j < angs.length; j++) if (F.name(angs[i], angs[j]) === name) out.push([angs[i], angs[j]]); return out; }
  TK.pairsNamed = pairsNamed; TK.paraFig = paraFig;
  function pickPairs(r, F, angs, types) {   // one pair per type, no pair used twice
    var used = {}, out = [];
    types.forEach(function (ty) {
      var c = r.shuffle(pairsNamed(F, angs, ty)), k = c.filter(function (p) { return !used[p[0].letter + p[1].letter]; })[0] || c[0];
      used[k[0].letter + k[1].letter] = 1; out.push(r.chance(0.5) ? k : [k[1], k[0]]);
    });
    return out;
  }
  function pp(pr) { return t('\\angle ' + pr[0].letter) + ' and ' + t('\\angle ' + pr[1].letter); }
  TK.pp = pp;

  /* the numbered pair pools (booklet worked-example pairs left out where another pair is possible) */
  function poolPick(r, id, avoid) {
    var pool = TK.pairsOf(id).filter(function (p) { return !(avoid || []).some(function (a) { return (a[0] === p[0] && a[1] === p[1]) || (a[0] === p[1] && a[1] === p[0]); }); });
    if (!pool.length) pool = TK.pairsOf(id);
    var p = r.pick(pool); return r.chance(0.5) ? [p[0], p[1]] : [p[1], p[0]];
  }
  TK.poolPick = poolPick;
  function why3(a, b) {   // the three questions, answered for a numbered pair (solution text)
    var I = function (k) { return [3, 4, 5, 6].indexOf(k) >= 0; }, Lf = function (k) { return [1, 4, 5, 8].indexOf(k) >= 0; }, top = function (k) { return k <= 4; };
    if (top(a) === top(b)) return A(a) + ' and ' + A(b) + ' are at the same crossing.';
    return A(a) + ' is ' + (I(a) ? 'interior' : 'exterior') + ', on the ' + (Lf(a) ? 'left' : 'right') + ' of t; ' + A(b) + ' is ' + (I(b) ? 'interior' : 'exterior') + ', on the ' + (Lf(b) ? 'left' : 'right') + ' of t.';
  }
  TK.why3 = why3;
  var INT = [3, 4, 5, 6], EXT = [1, 2, 7, 8], LEFT = [1, 4, 5, 8], RIGHT = [2, 3, 6, 7];
  TK.INT = INT; TK.EXT = EXT; TK.LEFT = LEFT; TK.RIGHT = RIGHT;
  function setWhy(want) {
    return function (extra, miss) {
      var e = extra[0];
      if (e != null) {
        if (want === 'int' && EXT.indexOf(e) >= 0) return { code: 'u5l7-ext-for-int', hint: A(e) + ' is <b>outside</b> the two lines. Interior angles are <b>between</b> ℓ₁ and ℓ₂.' };
        if (want === 'ext' && INT.indexOf(e) >= 0) return { code: 'u5l7-ext-for-int', hint: A(e) + ' is <b>between</b> the two lines. Exterior angles are <b>outside</b> ℓ₁ and ℓ₂.' };
        if ((want === 'L' && RIGHT.indexOf(e) >= 0) || (want === 'R' && LEFT.indexOf(e) >= 0)) return { code: 'u5l7-side-mixup', hint: A(e) + ' is on the other side of t. Put your finger on t: which angles are on its ' + (want === 'L' ? 'left' : 'right') + '?' };
        return { code: 'u5l7-set', hint: A(e) + ' doesn’t belong. Check each angle you tapped.' };
      }
      return { code: 'u5l7-set', hint: 'You’re missing ' + (miss.length === 1 ? 'one angle' : miss.length + ' angles') + '. There are four of each kind: two at each crossing.' };
    };
  }

  /* the angle-pair facts (true/false pools) */
  var TF_A = [   // part (a): false statements about transversals
    ['A transversal crosses two lines at the same point.', false, 'A transversal crosses the lines at two <b>different</b> points.'],
    ['A transversal must be perpendicular to the lines it crosses.', false, 'A transversal can cross at any angle (perpendicular is just one possibility).'],
    ['A line that is parallel to two other lines is a transversal of them.', false, 'A parallel line never crosses them, so it can’t be a transversal.']];
  var TF_B = [['Interior angles are between the two lines.', true, 'Interior means <b>between</b> the two lines: true.'], ['Exterior angles are outside the two lines.', true, 'Exterior means <b>outside</b> the two lines: true.'],
    ['Alternate angles are on opposite sides of the transversal.', true, '“Alternate” means one on each side of the transversal: true.']];
  var TF_C = [['Corresponding angles are at the same crossing.', false, 'Corresponding angles are at <b>different</b> crossings, in the same position.'], ['Vertically opposite angles are at different crossings.', false, 'Vertically opposite angles are across from each other at the <b>same</b> crossing.'],
    ['Alternate interior angles are on the same side of the transversal.', false, 'Alternate angles are on <b>opposite</b> sides of the transversal.']];
  var TF_D = [['When two lines are not parallel, their alternate interior angles are usually not equal.', true, 'The pairs are only equal when the lines are parallel: true.'], ['Vertically opposite angles are equal even when the lines are not parallel.', true, 'Vertically opposite angles are always equal: true.'],
    ['When two lines are not parallel, their corresponding angles are usually not equal.', true, 'Corresponding angles are only equal when the lines are parallel: true.']];

  /* not-parallel diagrams: integer tilt/skew so every angle is a whole number */
  function npGeom(r, o) {
    o = o || {};
    return find(function () { var tl = TK.tilt(r, o.avoidTilt), sk = (r.chance(0.5) ? 1 : -1) * r.int(o.skMin || 9, o.skMax || 20); return { tilt: tl, skew: sk }; },
      function (g) { var b6 = g.tilt - g.skew; return b6 > 25 && b6 < 155 && Math.abs(b6 - 90) > 6 && (!o.test || o.test(g)); }, { tilt: 55, skew: -15 });
  }
  TK.npGeom = npGeom;
  function allMeas(g) { var m = {}; for (var k = 1; k <= 8; k++) m[k] = TK.meas(g.tilt, g.skew, k); return m; }
  TK.allMeas = allMeas;

  /* ================= lesson ================= */
  var EX_TILT = [65, 60, 68, 55];   // the worked examples' diagrams
  HW.defineLesson({
    id: 'u5l7', unit: 5, num: '7', title: 'Transversals: Naming the Angle Pairs', outcome: 'G5',
    blurb: 'Transversals and the eight angles: interior and exterior, corresponding, alternate and same-side pairs, real pictures, and why the lines must be parallel before the pairs are equal.',
    questions: [
      { num: '1', stem: 'Is line <i>t</i> a transversal of the other lines? Choose yes or no, with the reason.', parts: [
        { id: '1a', level: 'BEG', make: function (r) {
          var kind = r.chance(0.7) ? 'three' : 'two';
          return P.mc(r, miniFig(r, kind), [
            { html: '<b>Yes</b>: <i>t</i> crosses the other lines at different points.', right: true },
            { html: '<b>No</b>: <i>t</i> is parallel to the lines, so it never crosses them.', why: 'Follow <i>t</i>: does it cross each of the other lines?', code: 'q1-par' },
            { html: '<b>No</b>: <i>t</i> crosses the lines at only one point.', why: 'Count the crossing points on <i>t</i>: they are all different.', code: 'q1-one' },
            { html: '<b>No</b>: a transversal can only cross two lines.', why: 'A transversal crosses two <b>or more</b> lines, each at a different point.', code: 'q1-two' }],
            '<i>t</i> crosses ' + (kind === 'three' ? 'all three lines' : 'both lines') + ' at different points, so it is a transversal' + (kind === 'three' ? ' of all three' : '') + '.', ['A transversal crosses two (or more) lines at <b>different</b> points.'], 'transversal yes');
        } },
        { id: '1b', level: 'BEG', make: function (r) {
          var kind = r.chance(0.65) ? 'parallel' : 'through', par = kind === 'parallel';
          return P.mc(r, miniFig(r, kind), [
            { html: '<b>No</b>: <i>t</i> is parallel to the lines, so it never crosses them.', right: par, why: par ? null : 'Look again: <i>t</i> does cross the lines, but where?', code: 'q1-par' },
            { html: '<b>No</b>: <i>t</i> meets the lines at only one point (where they cross).', right: !par, why: par ? '<i>t</i> doesn’t meet the lines at all. What do the arrow marks tell you?' : null, code: 'q1-one' },
            { html: '<b>Yes</b>: <i>t</i> crosses the other lines at different points.', why: par ? 'Does <i>t</i> ever cross <i>m</i> or <i>n</i>? The arrow marks say all three lines are parallel.' : 'All three lines pass through the <b>same</b> point. A transversal needs two different crossing points.', code: 'q1-yes' },
            { html: '<b>Yes</b>: <i>t</i> is drawn next to the other lines.', why: 'Being near the lines isn’t enough: a transversal must <b>cross</b> them at different points.', code: 'q1-near' }],
            par ? 'The arrow marks show <i>t</i> is parallel to <i>m</i> and <i>n</i>, so it never crosses them. Not a transversal.' : '<i>t</i> goes through the point where <i>m</i> and <i>n</i> cross. It meets them at only one point, so it is not a transversal.',
            ['A transversal crosses the lines at two <b>different</b> points.'], 'transversal no');
        } },
        { id: '1c', level: 'BEG', make: function (r) {
          return P.mc(r, miniFig(r, 'perp'), [
            { html: '<b>Yes</b>: <i>t</i> crosses both lines at different points.', right: true },
            { html: '<b>No</b>: a transversal can’t meet the lines at right angles.', why: 'A transversal can cross at any angle, including 90°.', code: 'q1-perp' },
            { html: '<b>No</b>: <i>m</i> and <i>n</i> are parallel, so they can’t have a transversal.', why: 'Parallel lines can have a transversal: it just has to cross both of them.', code: 'q1-parlines' },
            { html: '<b>No</b>: <i>t</i> crosses the lines at only one point.', why: 'Count the crossings on <i>t</i>: one with <i>m</i> and a different one with <i>n</i>.', code: 'q1-one' }],
            '<i>t</i> crosses <i>m</i> and <i>n</i> at two different points, so it is a transversal. (It is perpendicular to them: that’s allowed.)', ['The small squares show right angles. Does that stop <i>t</i> from being a transversal?'], 'transversal perp');
        } }] },
      { num: '2', stem: function (sh) { return 'Questions 2 to 4 use diagrams like this one. The angles are numbered the usual way: 1 to 4 clockwise from the upper left at the top crossing, 5 to 8 clockwise from the upper left at the bottom crossing.' + TK.std({ tilt: sh.tilt }); },
        shared: function (r) { return { tilt: TK.tilt(r, EX_TILT), side: r.pick(['L', 'R']), e: r.pick([['int', 'R'], ['int', 'L'], ['ext', 'R'], ['ext', 'L']]) }; },
        parts: [
          { id: '2a', level: 'BEG', make: function (r) {
            return P.mc(r, 'Which lines are parallel? How do you know?', [
              { html: 'ℓ₁ and ℓ₂: they have matching arrow marks (&gt;).', right: true },
              { html: 'ℓ₁ and ℓ₂: they look parallel.', why: 'They do look parallel, but looks can fool you. What marks on the diagram <b>tell</b> you?', code: 'q2-looks' },
              { html: 'ℓ₁ and <i>t</i>: they cross each other.', why: 'Parallel lines <b>never</b> cross.', code: 'q2-cross' },
              { html: 'None of the lines are parallel.', why: 'Look for the arrow marks (&gt;) on two of the lines.', code: 'q2-none' }],
              'ℓ₁ and ℓ₂ are parallel: they have matching arrow marks.', ['Parallel lines are marked with matching arrows.'], 'which parallel');
          } },
          { id: '2b', level: 'BEG', make: function () { return TK.setP('Tap all the <b>interior</b> angles.', INT, { why: setWhy('int'), sol: 'Interior angles are between ℓ₁ and ℓ₂: ' + INT.map(A).join(', ') + '.', hints: ['Interior means <b>between</b> the two lines.'], text: 'interior' }); } },
          { id: '2c', level: 'BEG', make: function () { return TK.setP('Tap all the <b>exterior</b> angles.', EXT, { why: setWhy('ext'), sol: 'Exterior angles are outside ℓ₁ and ℓ₂: ' + EXT.map(A).join(', ') + '.', hints: ['Exterior means <b>outside</b> the two lines.'], text: 'exterior' }); } },
          { id: '2d', level: 'EMG', make: function (r, sh) { var Lw = sh.side === 'L', w = Lw ? LEFT : RIGHT; return TK.setP('Tap the angles on the <b>' + (Lw ? 'left' : 'right') + '</b> side of <i>t</i>.', w, { why: setWhy(sh.side), sol: 'On the ' + (Lw ? 'left' : 'right') + ' of t: ' + w.map(A).join(', ') + ' (two at each crossing).', hints: ['Put your finger on t. Which angles are on its ' + (Lw ? 'left' : 'right') + '? There are two at each crossing.'], text: 'side of t' }); } },
          { id: '2e', level: 'EMG', make: function (r, sh) {
            var io = sh.e[0], sd = sh.e[1], w = (io === 'int' ? INT : EXT).filter(function (k) { return (sd === 'L' ? LEFT : RIGHT).indexOf(k) >= 0; });
            return TK.setP('Which <b>' + (io === 'int' ? 'interior' : 'exterior') + '</b> angles are on the <b>' + (sd === 'L' ? 'left' : 'right') + '</b> side of <i>t</i>? Tap them.', w, {
              why: function (ex) { var e = ex[0]; if (e == null) return { code: 'u5l7-set', hint: 'There is one at each crossing.' }; if ((io === 'int' ? EXT : INT).indexOf(e) >= 0) return { code: 'u5l7-ext-for-int', hint: A(e) + ' is ' + (io === 'int' ? 'outside' : 'between') + ' the lines.' }; return { code: 'u5l7-side-mixup', hint: A(e) + ' is on the other side of t.' }; },
              sol: (io === 'int' ? 'Interior' : 'Exterior') + ' angles: ' + (io === 'int' ? INT : EXT).map(A).join(', ') + '.<br>On the ' + (sd === 'L' ? 'left' : 'right') + ' of t: ' + w.map(A).join(' and ') + '.', hints: ['Find the ' + (io === 'int' ? 'interior' : 'exterior') + ' angles first, then keep the ones on the ' + (sd === 'L' ? 'left' : 'right') + '.'], text: 'int/ext and side' });
          } }] },
      { num: '3', stem: function (sh) { return 'Use the diagram. Name the angle that is:' + TK.std({ tilt: sh.tilt }); },
        shared: function (r) {
          // the given angle of each blank (the worked example's givens left out where possible); two blanks of a kind never share a pair
          var pick = function (id, avoidGiven, notPair) { return find(function () { return poolPick(r, id); }, function (p) { return p[0] !== avoidGiven && !(notPair && (notPair.indexOf(p[0]) >= 0 || notPair.indexOf(p[1]) >= 0)); }, poolPick(r, id)); };
          var c1 = pick('corresponding', 2), c2 = pick('corresponding', 8, c1), v1 = pick('vert-opp', 5), v2 = find(function () { return pick('vert-opp', 2, v1); }, function (p) { return (p[0] <= 4) !== (v1[0] <= 4); }, pick('vert-opp', 2, v1));
          return { tilt: TK.tilt(r, EX_TILT), c1: c1, c2: c2, v1: v1, v2: v2, ai: pick('alt-int', 4), ae: pick('alt-ext', 1), is: pick('int-same', 5), es: pick('ext-same', 7) };
        },
        parts: [
          { id: '3ab', sub: 'a–b', level: 'BEG', make: function (r, sh) { return twoNo('corresponding', sh.c1, 'corresponding', sh.c2); } },
          { id: '3cd', sub: 'c–d', level: 'BEG', make: function (r, sh) { return twoNo('vert-opp', sh.v1, 'vert-opp', sh.v2); } },
          { id: '3ef', sub: 'e–f', level: 'EMG', make: function (r, sh) { return twoNo('alt-int', sh.ai, 'alt-ext', sh.ae); } },
          { id: '3gh', sub: 'g–h', level: 'EMG', make: function (r, sh) { return twoNo('int-same', sh.is, 'ext-same', sh.es); } }] },
      { num: '4', stem: function (sh) { return 'Use the diagram. Name each pair of angles. If they are at the same crossing, say whether they are vertically opposite or make a straight line. If the pair has no special name, say so.' + TK.std({ tilt: sh.tilt }); },
        shared: function (r) {
          var av = [[3, 5], [2, 8], [3, 6], [1, 8], [1, 5], [2, 3], [1, 6]];
          return { tilt: TK.tilt(r, EX_TILT), p: ['corresponding', 'ext-same', 'alt-int', 'alt-ext', 'vert-opp', 'linear', 'none'].map(function (id) { return poolPick(r, id, av); }) };
        },
        parts: ['corresponding', 'ext-same', 'alt-int', 'alt-ext', 'vert-opp', 'linear', 'none'].map(function (id, i) {
          return { id: '4' + 'abcdefg'.charAt(i), level: ['EMG', 'EMG', 'EMG', 'EMG', 'BEG', 'BEG', 'PRG'][i], make: function (r, sh) {
            var pr = sh.p[i];
            return TK.pairPick(r, A(pr[0]) + ' and ' + A(pr[1]), id, { linear: true, none: true, sol: why3(pr[0], pr[1]) + '<br>' + (id === 'vert-opp' ? 'They are across from each other: <b>vertically opposite</b>.' : id === 'linear' ? 'They sit side by side and make a <b>straight line</b> (they add to 180°).' : 'So they are <b>' + LONG[id] + '</b>.'), text: 'name ' + id });
          } };
        }) },
      { num: '5', stem: function (sh) { return 'In this diagram the transversal <i>t</i> crosses the two parallel lines <i>m</i> and <i>n</i>. The angles are labelled with letters.' + sh.fig.svg(); },
        shared: function (r) {
          var fig = paraFig(r, { tdir: r.pick([0, 0, 6, -6, 180, 174]), delta: find(function () { return r.int(58, 122); }, function (v) { return Math.abs(v - 90) > 14; }, 72) });
          return { fig: fig, prs: pickPairs(r, fig.F, fig.angs, ['corresponding', 'alt-int', 'int-same', 'alt-ext', 'corresponding', 'ext-same']) };
        },
        parts: ['corresponding', 'alt-int', 'int-same', 'alt-ext', 'corresponding', 'ext-same'].map(function (id, i) {
          return { id: '5' + 'abcdef'.charAt(i), level: 'PRG', make: function (r, sh) {
            var pr = sh.prs[i], F = sh.fig.F;
            return TK.pairPick(r, 'Name the pair ' + pp(pr) + '.', id, { sol: 'Here “interior” means between <i>m</i> and <i>n</i>.<br>' + t('\\angle ' + pr[0].letter) + ' is ' + (F.isInt(pr[0], pr[1]) ? 'between' : 'outside') + ' the lines and ' + t('\\angle ' + pr[1].letter) + ' is ' + (F.isInt(pr[1], pr[0]) ? 'between' : 'outside') + ' them; they are on ' + (/alt/.test(id) ? 'opposite sides' : 'the same side') + ' of <i>t</i>.<br>So they are <b>' + LONG[id] + '</b>.', hints: ['Turn your head (or the page) so <i>t</i> goes up and down. Then ask the three questions.'], text: 'rotated ' + id });
          } };
        }) },
      { num: '6', stem: '', parts: [
        { id: '6', level: 'PRG', make: function (r) {
          var pr = poolPick(r, 'corresponding', [[1, 5]]), a = Math.min(pr[0], pr[1]), b = Math.max(pr[0], pr[1]), intOne = INT.indexOf(a) >= 0 ? a : b, extOne = intOne === a ? b : a;
          var claim = r.pick(['alt-ext', 'alt-int']), name = r.pick(['Mia', 'Owen', 'Priya', 'Luca']);
          var fig = TK.std({ tilt: TK.tilt(r, EX_TILT) });
          return P.mc(r, fig + name + ' says that ' + A(a) + ' and ' + A(b) + ' are ' + PN[claim] + ' “because they are at different crossings.” Is ' + name + ' right?', [
            { html: '<b>No.</b> ' + A(claim === 'alt-ext' ? intOne : extOne) + ' is ' + (claim === 'alt-ext' ? 'interior' : 'exterior') + ', and the two angles are on the <b>same side</b> of <i>t</i>. They are corresponding angles.', right: true },
            { html: '<b>Yes.</b> Any two angles at different crossings are ' + PS[claim] + ' angles.', why: 'Being at different crossings isn’t enough. Ask: interior or exterior? Same side of t or opposite sides?', code: 'q6-yes' },
            { html: '<b>No.</b> They are vertically opposite angles.', why: 'Vertically opposite angles are at the <b>same</b> crossing.', code: 'q6-vo' },
            { html: '<b>No.</b> They are interior angles on the same side of <i>t</i>.', why: 'Is ' + A(extOne) + ' between the lines?', code: 'q6-is' }],
            why3(a, b) + '<br>One is interior and one is exterior, on the same side of t: both are in the same position at their crossings, so they are <b>corresponding</b> angles. ' + name + ' is not right.', ['Where is each angle: between the lines or outside them? Which side of t?'], 'Mia claim');
        } }] },
      { num: '7', stem: function (sh) { return 'A farm gate has a top rail and a bottom rail that are parallel. A diagonal brace crosses between them.' + sh.svg; },
        shared: function (r) {
          var mir = r.chance(0.5), H = 2.2, x0 = 0.5 + r.int(-1, 2) / 10, x1 = 4.5 + r.int(-2, 1) / 10;
          var lines = { top: { p: [-0.4, H], q: [5.4, H], width: 3 }, bot: { p: [-0.4, 0], q: [5.4, 0], width: 3 }, br: { p: [x0, 0], q: [x1, H], width: 3 } };
          if (mir) lines = turnLines(lines, 0, true);
          var F = LF(lines, { scale: 44 }), lt = r.shuffle(['a', 'b', 'c', 'd']);
          var A1 = F.ang('br', -1, 'top', -1), A2 = F.ang('br', -1, 'top', 1), A3 = F.ang('br', 1, 'bot', -1), A4 = F.ang('br', 1, 'bot', 1), all = [A1, A2, A3, A4];
          all.forEach(function (x, i) { x.letter = lt[i]; });
          var ai = pairsNamed(F, all, 'alt-int'), is = pairsNamed(F, all, 'int-same');
          var tp = function (pt) { return mir ? [-pt[0], pt[1]] : pt; };
          var svg = F.svg({ labels: all.map(function (x) { return { ang: x, text: x.letter }; }), segs: [{ p: tp([0, -0.25]), q: tp([0, 2.45]) }, { p: tp([5, -0.25]), q: tp([5, 2.45]) }],
            texts: [{ at: tp([2.5, 2.55]), s: 'top rail' }, { at: tp([2.5, -0.35]), s: 'bottom rail' }], width: 360, aria: 'farm gate with a brace' });
          return { svg: svg, F: F, ai: r.shuffle(ai), is: r.pick(is) };
        },
        parts: [
          { id: '7a', level: 'EMG', make: function (r) {
            return P.mc(r, 'For these four angles, what are the two lines, and what is the transversal?', [
              { html: 'The two lines are the <b>top and bottom rails</b>; the <b>brace</b> is the transversal.', right: true },
              { html: 'The two lines are the <b>posts</b>; the <b>brace</b> is the transversal.', why: 'The four angles are where the brace meets the <b>rails</b>.', code: 'q7-posts' },
              { html: 'The two lines are the <b>brace and the bottom rail</b>; the <b>top rail</b> is the transversal.', why: 'The transversal goes through the vertices of <b>both</b> angles. Which piece touches all four vertices?', code: 'q7-rail' },
              { html: 'The two lines are the <b>rails</b>; a <b>post</b> is the transversal.', why: 'The posts don’t go through any of the four vertices.', code: 'q7-post' }],
              'All four vertices are on the brace, so the brace is the transversal. The two lines it crosses are the top rail and the bottom rail.', ['The transversal is the line that goes through the vertices of the angles.'], 'gate lines');
          } },
          { id: '7b', level: 'PRG', make: function (r, sh) {
            var pr = sh.ai[0];
            return P.mc(r, 'Name the pair ' + pp(pr) + '. What letter shape do they make?', [
              { html: 'Alternate interior angles: a <b>Z</b> shape', right: true },
              { html: 'Corresponding angles: an <b>F</b> shape', why: 'Corresponding angles have one angle outside the lines. Both of these are between the rails.', code: 'q7-F' },
              { html: 'Interior angles on the same side: a <b>C</b> shape', why: 'Are they on the same side of the brace, or on opposite sides?', code: 'q7-C' },
              { html: 'Vertically opposite angles: an <b>X</b> shape', why: 'Vertically opposite angles are at the same crossing. These are at different ends of the brace.', code: 'q7-X' }],
              'Both angles are between the rails, on opposite sides of the brace: <b>alternate interior</b> angles. They make a Z shape.', ['Between the rails or outside? Same side of the brace or opposite sides?'], 'gate Z');
          } },
          { id: '7c', level: 'PRG', make: function (r, sh) { return G.P.pair('Name the pair ' + pp(sh.is) + '.', 'int-same', { sol: 'Both are between the rails, on the same side of the brace: <b>interior angles on the same side of the transversal</b>.', hints: ['Both are between the rails. Same side of the brace or opposite sides?'], text: 'gate same side' }); } },
          { id: '7d', level: 'PRG', make: function (r, sh) { return G.P.pair('Name the pair ' + pp(sh.ai[1]) + '.', 'alt-int', { sol: 'Both are between the rails, on opposite sides of the brace: <b>alternate interior angles</b>.', hints: ['Both are between the rails. Same side of the brace or opposite sides?'], text: 'gate alt int' }); } }] },
      { num: '8', stem: function (sh) { return 'Three lines ' + sh.nm.map(function (x) { return '<i>' + x + '</i>'; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' cross each other and make a triangle.' + sh.svg; },
        shared: function (r) {
          var w = 5, cx = r.int(15, 26) / 10, h = r.int(26, 32) / 10, mir = r.chance(0.5), nm = r.pick([['p', 'q', 'r'], ['a', 'b', 'c'], ['j', 'k', 'm']]);
          var Ap = [0, 0], Bp = [w, 0], Cp = [cx, h];
          function ext(P1, P2, e1, e2) { var d = [P2[0] - P1[0], P2[1] - P1[1]], n = Math.hypot(d[0], d[1]); return { p: [P1[0] - d[0] / n * e1, P1[1] - d[1] / n * e1], q: [P2[0] + d[0] / n * e2, P2[1] + d[1] / n * e2] }; }
          var lines = { p: Object.assign({ p: [-1.2, 0], q: [6.2, 0] }, { name: nm[0] }), q: Object.assign(ext(Ap, Cp, 1.1, 1.2), { name: nm[1] }), r: Object.assign(ext(Bp, Cp, 1.1, 1.3), { name: nm[2] }) };
          if (mir) lines = turnLines(lines, 0, true);
          var F = LF(lines, { scale: 40 }), lt = r.pick([['x', 'y', 'u'], ['a', 'b', 'c'], ['e', 'f', 'g']].filter(function (L3) { return !L3.some(function (c) { return nm.indexOf(c) >= 0; }); }));
          // x at A inside the triangle, y at B inside, u at C: along q beyond C, and towards B along r
          var sq = function (Pf, Pt, id) { var d = F.L[id].d, v = [Pt[0] - Pf[0], Pt[1] - Pf[1]]; return d[0] * v[0] + d[1] * v[1] > 0 ? 1 : -1; };
          var AA = F.X('p', 'q'), BB = F.X('p', 'r'), CC = F.X('q', 'r');
          var X1 = F.ang('p', sq(AA, BB, 'p'), 'q', sq(AA, CC, 'q')), Y1 = F.ang('p', sq(BB, AA, 'p'), 'r', sq(BB, CC, 'r')), U1 = F.ang('q', sq(AA, CC, 'q'), 'r', sq(CC, BB, 'r'));
          X1.letter = lt[0]; Y1.letter = lt[1]; U1.letter = lt[2];
          var svg = F.svg({ labels: [X1, Y1, U1].map(function (x) { return { ang: x, text: x.letter }; }), width: 330, aria: 'three lines making a triangle' });
          return { svg: svg, F: F, X: X1, Y: Y1, U: U1, nm: nm };
        },
        parts: [
          { id: '8a', level: 'ADV', make: function (r, sh) { return triPart(sh, sh.X, sh.Y); } },
          { id: '8b', level: 'MAS', make: function (r, sh) { return triPart(sh, sh.X, sh.U); } }] },
      { num: '9', stem: function (sh) { return 'In this diagram, ℓ₁ and ℓ₂ are <b>not</b> parallel. The angles are numbered the usual way. A protractor was laid on two of the angles.' + TK.std({ parallel: false, tilt: sh.g.tilt, skew: sh.g.skew }); },
        shared: function (r) { var g = npGeom(r, { test: function (g) { return [68, 100, 112, 80].indexOf(TK.meas(g.tilt, g.skew, 7)) < 0; } }); return { g: g, m: allMeas(g), sc3: r.pick(['inner', 'outer']), sc7: r.pick(['inner', 'outer']) }; },
        parts: [
          { id: '9a', sub: 'a i', level: 'EMG', make: function (r, sh) { return protPart(sh.m[3], sh.sc3, 3, r); } },
          { id: '9b', sub: 'a ii', level: 'EMG', make: function (r, sh) { return protPart(sh.m[7], sh.sc7, 7, r); } },
          { id: '9c', sub: 'a iii', level: 'EMG', make: function (r, sh) {
            var m = sh.m;
            return P.fields('Use your readings: ' + A(3) + ' = ' + D(m[3]) + ' and ' + A(7) + ' = ' + D(m[7]) + '. Find ' + A(4) + ' and ' + A(6) + '.', [{ label: t('\\angle 4='), after: '°', name: '∠4' }, { label: t('\\angle 6='), after: '°', name: '∠6' }],
              [G.angleChk(m[4], { supplementTrap: false, alts: [{ v: m[3], hint: A(3) + ' and ' + A(4) + ' sit side by side on ℓ₁: they make a straight line, so they add to 180°.' }] }), G.angleChk(m[6], { supplementTrap: false, alts: [{ v: m[7], hint: A(6) + ' and ' + A(7) + ' sit side by side on ℓ₂: they add to 180°.' }, { v: m[4], hint: 'The lines are not parallel, so the top crossing doesn’t tell you about the bottom one. Use ' + A(7) + '.' }] })],
              [String(m[4]), String(m[6])], A(4) + ' = ' + D(m[4]) + ', ' + A(6) + ' = ' + D(m[6]),
              t('\\angle 4=180^\\circ-' + m[3] + '^\\circ=' + m[4] + '^\\circ') + ' (straight line with ' + A(3) + ')<br>' + t('\\angle 6=180^\\circ-' + m[7] + '^\\circ=' + m[6] + '^\\circ') + ' (straight line with ' + A(7) + ')', ['Two angles side by side on a straight line add to 180°.'], 'angles 4 and 6');
          } },
          { id: '9d', sub: 'b', level: 'PRG', make: function (r, sh) {
            var m = sh.m;
            return P.mc(r, 'Name the pairs ' + A(3) + ' &amp; ' + A(7) + ', and ' + A(4) + ' &amp; ' + A(6) + '. Are the angles in each pair equal?', [
              { html: 'Corresponding, and alternate interior. Neither pair is equal (' + D(m[3]) + ' ≠ ' + D(m[7]) + ', ' + D(m[4]) + ' ≠ ' + D(m[6]) + '), because the lines are not parallel.', right: true },
              { html: 'Corresponding, and alternate interior. Both pairs are equal, because these pairs are always equal.', why: 'Check your readings: are they equal? These pairs are only equal when the lines are parallel.', code: 'q9-always' },
              { html: 'Alternate exterior, and interior on the same side. Neither pair is equal.', why: A(3) + ' and ' + A(7) + ' are in the same position at their crossings.', code: 'q9-names' },
              { html: 'Corresponding, and alternate interior. They are not equal because I measured wrong.', why: 'The measurements are fine: the angles really are different. Why?', code: 'q9-measure' }],
              A(3) + ' and ' + A(7) + ' are corresponding; ' + A(4) + ' and ' + A(6) + ' are alternate interior.<br>' + D(m[3]) + ' ≠ ' + D(m[7]) + ' and ' + D(m[4]) + ' ≠ ' + D(m[6]) + ': neither pair is equal, because the lines are not parallel.', ['Compare your measurements. What would make these pairs equal?'], 'not parallel pairs');
          } }] },
      { num: '10', stem: function (sh) { return 'In this diagram, ℓ₁ and ℓ₂ are <b>not</b> parallel. ' + A(sh.a) + ' = ' + D(sh.m[sh.a]) + ' and ' + A(sh.b) + ' = ' + D(sh.m[sh.b]) + '.' + sh.fig; },
        shared: function (r) {
          var g = npGeom(r, { avoidTilt: [68, 112] }), m = allMeas(g), a = r.int(1, 4), b = r.int(5, 8);
          if (a === 2 && b === 7) a = 1;
          var lab = {}; lab[a] = m[a]; lab[b] = m[b];
          return { g: g, m: m, a: a, b: b, fig: TK.std({ parallel: false, tilt: g.tilt, skew: g.skew, angles: lab }) };
        },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) { return sixAngles(sh, 'Find the other six angles.'); } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var m = sh.m, s36 = Math.round((m[3] + m[6]) * 10) / 10;
            return P.mc(r, 'Are the alternate interior angles ' + A(3) + ' and ' + A(5) + ' equal? Do the interior angles on the same side, ' + A(3) + ' and ' + A(6) + ', add to 180°?', [
              { html: '<b>No</b> and <b>no</b>: ' + A(3) + ' = ' + D(m[3]) + ' but ' + A(5) + ' = ' + D(m[5]) + ', and ' + t(m[3] + '^\\circ+' + m[6] + '^\\circ=' + s36 + '^\\circ') + '. The lines are not parallel.', right: true },
              { html: '<b>Yes</b> and <b>yes</b>: those pairs always follow the rules.', why: 'Check with your numbers. The rules only work for parallel lines.', code: 'q10-always' },
              { html: '<b>Yes</b> and <b>no</b>: alternate interior angles are always equal.', why: 'Compare ' + A(3) + ' and ' + A(5) + ' from your answers.', code: 'q10-ai' },
              { html: '<b>No</b> and <b>yes</b>: interior angles on the same side always add to 180°.', why: 'Add ' + A(3) + ' and ' + A(6) + ' from your answers.', code: 'q10-is' }],
              t('\\angle 3=' + m[3] + '^\\circ') + ', ' + t('\\angle 5=' + m[5] + '^\\circ') + ': not equal.<br>' + t(m[3] + '^\\circ+' + m[6] + '^\\circ=' + s36 + '^\\circ') + ', not 180°.<br>The lines are not parallel, so the pairs don’t follow the parallel-line rules.', ['Use the sizes you found in (a).'], 'not parallel rules');
          } }] },
      { num: '11', stem: function (sh) { return 'A diagram has two lines and a transversal, numbered the usual way, with <b>no arrow marks</b>. ' + A(sh.k) + ' = ' + D(sh.v) + '. ' + sh.who + ' says, “' + A(sh.c) + ' = ' + D(sh.v) + ' because ' + PN[sh.rule] + ' are equal.”' + sh.fig; },
        shared: function (r) {
          var rule = r.pick(['alt-int', 'corresponding', 'alt-ext']), pr = poolPick(r, rule), v = find(function () { return r.int(52, 128); }, function (x) { return Math.abs(x - 90) > 8 && [65, 68, 100].indexOf(x) < 0; }, 63);
          var k = pr[0], top = k <= 4, tl = (top ? ([2, 4].indexOf(k) >= 0 ? v : 180 - v) : null), sk = r.pick([-7, -6, 6, 7]);
          if (tl == null) { var b = [6, 8].indexOf(k) >= 0 ? v : 180 - v; tl = b + sk; }
          var lab = {}; lab[k] = v;
          return { rule: rule, k: k, c: pr[1], v: v, who: r.pick(['Jordan', 'Ava', 'Noah', 'Sofia']), fig: TK.std({ parallel: false, tilt: Math.max(30, Math.min(150, tl)), skew: sk, marks: 0, angles: lab }) };
        },
        parts: [
          { id: '11a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Is ' + sh.who + ' right?', [
              { html: '<b>Not necessarily.</b> ' + PN[sh.rule].charAt(0).toUpperCase() + PN[sh.rule].slice(1) + ' are equal only when the lines are parallel, and nothing says these lines are parallel.', right: true },
              { html: '<b>Yes.</b> ' + PN[sh.rule].charAt(0).toUpperCase() + PN[sh.rule].slice(1) + ' are always equal.', why: 'Only when the lines are parallel. How do you know two lines are parallel?', code: 'q11-yes' },
              { html: '<b>Yes.</b> The lines look parallel.', why: 'Lines that only <b>look</b> parallel might not be. You need arrow marks, or the question has to say so.', code: 'q11-looks' },
              { html: '<b>No.</b> ' + A(sh.c) + ' = ' + t('180^\\circ-' + sh.v + '^\\circ') + '.', why: 'We can’t find ' + A(sh.c) + ' at all: it is at the other crossing, and the lines might not be parallel.', code: 'q11-supp' }],
              'Not necessarily. ' + PN[sh.rule].charAt(0).toUpperCase() + PN[sh.rule].slice(1) + ' are equal only when the lines are parallel. There are no arrow marks and nothing says the lines are parallel, so we can’t tell what ' + A(sh.c) + ' is.', ['What has to be true about the lines before the pair rules work?'], 'Jordan claim');
          } },
          { id: '11b', level: 'EMG', make: function (r, sh) {
            var vo = PAIRS['vert-opp'].map(function (p) { return p[0] === sh.k ? p[1] : p[1] === sh.k ? p[0] : null; }).filter(function (x) { return x; })[0];
            var p = TK.angNoP('Which other angle can you be <b>sure</b> is ' + D(sh.v) + '?', sh.k, 'vert-opp', { sol: A(vo) + ', because it is vertically opposite ' + A(sh.k) + ', and vertically opposite angles are always equal.', hints: ['Which rule works whether or not the lines are parallel?'], text: 'sure angle' });
            var base = p.check; p.check = function (resp) { var res = base(resp); if (res.v === 'wrong' && readNo(resp).v === sh.c) return wrong('u5l7-parallel-rule', 'That only works if the lines are parallel, and we don’t know that. Which angle is equal to ' + A(sh.k) + ' at the <b>same</b> crossing?'); return res; };
            p.bad = [String(sh.c)]; return p;
          } }] },
      { num: '12', stem: function (sh) { return 'In this diagram, ℓ₁ and ℓ₂ are <b>not</b> parallel. ' + A(sh.a) + ' = ' + D(sh.m[sh.a]) + ' and ' + A(sh.b) + ' = ' + D(sh.m[sh.b]) + '.' + sh.fig; },
        shared: function (r) {
          var g = npGeom(r, { avoidTilt: [68, 112, 55] }), m = allMeas(g), a = r.pick([1, 2]), b = r.pick([7, 8]), lab = {}; lab[a] = m[a]; lab[b] = m[b];
          return { m: m, a: a, b: b, fig: TK.std({ parallel: false, tilt: g.tilt, skew: g.skew, angles: lab }) };
        },
        parts: [
          { id: '12a', level: 'PRG', make: function (r, sh) {
            var m = sh.m, tot = 360;
            return TK.angP('Add the four interior angles: ' + t('\\angle 3+\\angle 4+\\angle 5+\\angle 6') + '.', tot, { trap: false,
              alts: [[180, 'That’s only the two interior angles at one crossing. Add all four.'], [Math.round((m[sh.a] + m[sh.b]) * 10) / 10, 'That’s the two angles you were given. Find the four <b>interior</b> angles (' + A(3) + ', ' + A(4) + ', ' + A(5) + ', ' + A(6) + ') first.']],
              sol: t('\\angle 3=' + m[3] + '^\\circ,\\ \\angle 4=' + m[4] + '^\\circ,\\ \\angle 5=' + m[5] + '^\\circ,\\ \\angle 6=' + m[6] + '^\\circ') + '<br>' + t(m[3] + '+' + m[4] + '+' + m[5] + '+' + m[6] + '=360') + '<br>The four interior angles add to ' + D(360) + '.', hints: ['Find each interior angle first (vertically opposite, or straight line).'], text: 'interior sum' });
          } },
          { id: '12b', level: 'PRG', make: function (r) {
            return P.mc(r, 'Why do the four interior angles add to the same total in <b>every</b> diagram, even when the lines are not parallel?', [
              { html: A(3) + ' and ' + A(4) + ' make a straight line on ℓ₁ (180°), and ' + A(5) + ' and ' + A(6) + ' make a straight line on ℓ₂ (180°): 180° + 180° = 360°.', right: true },
              { html: 'Because alternate interior angles are equal.', why: 'That’s only true for parallel lines, and this works for any lines.', code: 'q12-alt' },
              { html: 'Because the angles around a point add to 360°.', why: 'The four interior angles are at two different points. Look at each crossing separately.', code: 'q12-point' },
              { html: 'Because interior angles on the same side add to 180°.', why: 'Only when the lines are parallel. Which pairs make a straight line at each crossing?', code: 'q12-same' }],
              A(3) + ' and ' + A(4) + ' are next to each other on ℓ₁: 180°. ' + A(5) + ' and ' + A(6) + ' are next to each other on ℓ₂: 180°.<br>So the four interior angles always add to 180° + 180° = 360°.', ['Which interior angles sit side by side on the same line?'], 'why 360');
          } }] },
      { num: '13', stem: '', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var target = r.pick(['alt-ext', 'alt-int']), others = target === 'alt-ext' ? ['corresponding', 'alt-int', 'vert-opp'] : ['corresponding', 'alt-ext', 'vert-opp'];
          var opts = [target].concat(others).map(function (id) { var p = poolPick(r, id); return { html: A(p[0]) + ' and ' + A(p[1]), right: id === target, why: id === target ? null : 'Those are ' + PN[id] + '.', code: 'q13-' + id, _p: p, _id: id }; });
          var right = opts[0]._p;
          return P.mc(r, 'In the usual numbering, which pair are <b>' + PN[target] + '</b>?' + TK.std({ tilt: TK.tilt(r, EX_TILT), width: 260 }), opts,
            A(right[0]) + ' and ' + A(right[1]) + ': both are ' + (target === 'alt-ext' ? 'outside' : 'between') + ' the lines, on opposite sides of t.', ['Alternate means opposite sides of t. ' + (target === 'alt-ext' ? 'Exterior means outside the lines.' : 'Interior means between the lines.')], 'which pair');
        } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var target = r.pick(['int-same', 'ext-same', 'corresponding']), p = poolPick(r, target), ids = r.shuffle(['alt-int', 'corresponding', 'int-same', 'alt-ext', 'ext-same'].filter(function (x) { return x !== target; })).slice(0, 3).concat([target]);
          return P.mc(r, 'In the usual numbering, ' + A(p[0]) + ' and ' + A(p[1]) + ' are', ids.map(function (id) { return { html: PS[id], right: id === target, why: id === target ? null : pairWhy(target, id), code: 'q14-' + id }; }),
            why3(p[0], p[1]) + '<br>So they are <b>' + PN[target] + '</b>.', ['Interior or exterior? Same side of t or opposite sides?'], 'name pair');
        } }] },
      { num: '15', stem: '', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var vo = r.chance(0.6);
          return P.mc(r, 'Two lines are cut by a transversal. Which statement is true <b>whether or not</b> the lines are parallel?', [
            { html: 'Corresponding angles are equal.', why: 'Only when the lines are parallel.', code: 'q15-c' },
            { html: 'Alternate interior angles are equal.', why: 'Only when the lines are parallel.', code: 'q15-ai' },
            { html: 'Interior angles on the same side add to 180°.', why: 'Only when the lines are parallel.', code: 'q15-is' },
            vo ? { html: 'Vertically opposite angles are equal.', right: true } : { html: 'Two angles side by side on a straight line add to 180°.', right: true }],
            (vo ? 'Vertically opposite angles are always equal.' : 'Angles side by side on a straight line always add to 180°.') + ' The other three are true only when the lines are parallel.', ['Which rule stays at one crossing?'], 'always true');
        } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var k1 = r.int(5, 8), k2 = r.int(1, 4), v1 = find(function () { return r.int(100, 130); }, function (x) { return x !== 116; }, 118), v2 = find(function () { return r.int(50, 75); }, function (x) { return x !== 58 && x + v1 !== 180; }, v1 > 120 ? 62 : 72);
          var vo = function (k) { return PAIRS['vert-opp'].map(function (p) { return p[0] === k ? p[1] : p[1] === k ? p[0] : null; }).filter(function (x) { return x; })[0]; };
          var a1 = vo(k1), a2 = vo(k2), ans = v1 + v2;
          return TK.angP('<b>Numerical response.</b> Two lines are cut by a transversal, numbered the usual way. The lines are <b>not</b> parallel. ' + A(k1) + ' = ' + D(v1) + ' and ' + A(k2) + ' = ' + D(v2) + '. The value of ' + t('\\angle ' + a1 + '+\\angle ' + a2) + ', in degrees, is ____.', ans, { nr: true, trap: false,
            alts: [[360 - ans, 'Vertically opposite angles are <b>equal</b>; you don’t subtract.'], [180 - v1 + 180 - v2, A(a1) + ' is vertically opposite ' + A(k1) + ', so they are <b>equal</b> (not supplementary).'], [180 - v1 + v2, 'Both angles are vertically opposite a given angle, so each one is equal to it.'], [v1 + 180 - v2, 'Both angles are vertically opposite a given angle, so each one is equal to it.']],
            sol: t('\\angle ' + a1 + '=\\angle ' + k1 + '=' + v1 + '^\\circ') + ' (vertically opposite)<br>' + t('\\angle ' + a2 + '=\\angle ' + k2 + '=' + v2 + '^\\circ') + ' (vertically opposite)<br>' + t(v1 + '^\\circ+' + v2 + '^\\circ=' + ans + '^\\circ'), hints: ['Find each angle in the same crossing as the angle you know.'], text: 'NR sum' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Use this diagram. The lines ℓ₁ and ℓ₂ are not parallel.' + TK.std({ parallel: false, tilt: sh.tilt, skew: sh.sk }); },
        shared: function (r) { return { tilt: TK.tilt(r), sk: r.pick([-12, -9, 8, 11]) }; },
        parts: [
          { id: 'x1a', level: 'BEG', make: function (r) { return listPairs(r, 'corresponding', 'List all four pairs of <b>corresponding</b> angles.'); } },
          { id: 'x1b', level: 'BEG', make: function (r) { return listPairs(r, 'alt-int', 'List both pairs of <b>alternate interior</b> angles.'); } },
          { id: 'x1c', level: 'EMG', make: function (r) { return listPairs(r, 'alt-ext', 'List both pairs of <b>alternate exterior</b> angles.'); } },
          { id: 'x1d', level: 'EMG', make: function (r) { return listPairs(r, 'ext-same', 'List both pairs of <b>exterior angles on the same side</b> of <i>t</i>.'); } }] },
      { num: '2', stem: function (sh) { return 'Lines <i>m</i> and <i>n</i> are parallel, and <i>t</i> is a transversal. The angles are labelled with letters. Name each pair.' + sh.fig.svg(); },
        shared: function (r) {
          var fig = paraFig(r, { tdir: r.pick([115, 110, 95, 65, 75, 120]), delta: find(function () { return r.int(52, 128); }, function (v) { return Math.abs(v - 90) > 16; }, 70) });
          return { fig: fig, prs: pickPairs(r, fig.F, fig.angs, ['alt-int', 'int-same', 'alt-ext', 'corresponding', 'none']) };
        },
        parts: ['alt-int', 'int-same', 'alt-ext', 'corresponding', 'none'].map(function (id, i) {
          return { id: 'x2' + 'abcde'.charAt(i), level: 'EMG', make: function (r, sh) {
            var pr = sh.prs[i], F = sh.fig.F;
            return TK.pairPick(r, pp(pr), id, { none: true, sol: t('\\angle ' + pr[0].letter) + ' is ' + (F.isInt(pr[0], pr[1]) ? 'interior' : 'exterior') + ' and ' + t('\\angle ' + pr[1].letter) + ' is ' + (F.isInt(pr[1], pr[0]) ? 'interior' : 'exterior') + '; they are on ' + (id === 'corresponding' || id === 'int-same' || id === 'ext-same' ? 'the same side' : 'opposite sides') + ' of <i>t</i>.<br>So they are <b>' + LONG[id] + '</b>.', text: 'lettered ' + id });
          } };
        }) },
      { num: '3', stem: 'True or false?', parts: [
        { id: 'x3a', level: 'BEG', make: function (r) { var s = r.pick(TF_A); return tf(r, s[0], s[1], s[2], (s[1] ? 'True. ' : 'False. ') + s[2]); } },
        { id: 'x3b', level: 'BEG', make: function (r) { var s = r.pick(TF_B); return tf(r, s[0], s[1], 'It is true. ' + s[2], s[2]); } },
        { id: 'x3c', level: 'BEG', make: function (r) { var s = r.pick(TF_C); return tf(r, s[0], s[1], s[2], 'False. ' + s[2]); } },
        { id: 'x3d', level: 'BEG', make: function (r) { var s = r.pick(TF_D); return tf(r, s[0], s[1], s[2], s[2]); } }] },
      { num: '4', section: 'B. Applying', stem: function (sh) { return 'The painted lines of a row of angled parking stalls are parallel. They meet the edge of the driving lane.' + sh.svg; },
        shared: function (r) {
          var a = find(function () { return r.int(50, 72); }, function (v) { return v !== 62; }, 60), mir = r.chance(0.5), L2 = 2.1, xs = [0.4, 1.9, 3.4];
          var lines = { e: { p: [-0.6, 0], q: [5.4, 0], width: 3 } };
          xs.forEach(function (x, i) { lines['s' + i] = { p: [x, 0], q: [x + L2 * Math.cos(a * RAD), L2 * Math.sin(a * RAD)], marks: i < 2 ? 1 : 0, markAt: 0.62 }; });
          if (mir) lines = turnLines(lines, 0, true);
          var F = LF(lines, { scale: 44 }), lt = r.shuffle(['a', 'b', 'c', 'd']);
          var up = function (id) { return F.L[id].d[1] > 0 ? 1 : -1; };
          var S1 = F.X('e', 's0'), S2 = F.X('e', 's1'), ex = F.L.e.d[0] * (S1[0] - S2[0]) + F.L.e.d[1] * (S1[1] - S2[1]) > 0 ? 1 : -1;   // along the edge, away from stall 2
          var ax = [F.ang('e', ex, 's0', up('s0')), F.ang('e', -ex, 's0', up('s0')), F.ang('e', ex, 's1', up('s1')), F.ang('e', -ex, 's1', up('s1'))];
          ax.forEach(function (x, i) { x.letter = lt[i]; });
          var tp = function (pt) { return mir ? [-pt[0], pt[1]] : pt; };
          var svg = F.svg({ labels: ax.map(function (x) { return { ang: x, text: x.letter }; }), polys: [{ pts: [tp([-0.6, -0.9]), tp([5.4, -0.9]), tp([5.4, 0]), tp([-0.6, 0])], fill: '#ececec' }], texts: [{ at: tp([2.4, -0.5]), s: 'driving lane' }], width: 360, aria: 'parking stalls' });
          return { svg: svg, F: F, prs: pickPairs(r, F, ax, ['corresponding', 'int-same', 'ext-same']) };
        },
        parts: [
          { id: 'x4a', level: 'EMG', make: function (r) {
            return P.mc(r, 'For the four lettered angles, what are the two lines, and what is the transversal?', [
              { html: 'The two lines are the <b>first two stall lines</b>; the <b>edge of the driving lane</b> is the transversal.', right: true },
              { html: 'The two lines are the <b>edge of the lane</b> and a stall line; the other stall line is the transversal.', why: 'The transversal goes through the vertices of all four angles.', code: 'x4-edge' },
              { html: 'The two lines are the <b>first two stall lines</b>; the <b>third stall line</b> is the transversal.', why: 'The third stall line doesn’t go through any of the lettered vertices.', code: 'x4-third' },
              { html: 'There is no transversal: the stall lines are parallel.', why: 'Parallel lines can still be crossed by a transversal.', code: 'x4-none' }],
              'All four vertices are on the edge of the driving lane, so it is the transversal. The two lines are the first two stall lines.', ['Which line goes through all four vertices?'], 'stalls lines');
          } },
          { id: 'x4b', level: 'PRG', make: function (r, sh) {
            var ids = ['corresponding', 'int-same', 'ext-same'];
            return P.fields('Name each pair.', sh.prs.map(function (pr) { return { label: pp(pr) + ':', name: pr[0].letter + ' and ' + pr[1].letter, mode: 'text', wide: true, placeholder: 'pair name' }; }),
              ids.map(function (id) { return G.pairChk(id); }), ids.map(function (id) { return PS[id]; }), sh.prs.map(function (pr, i) { return pp(pr) + ': <b>' + PN[ids[i]] + '</b>'; }).join('<br>'),
              'The edge of the lane is the transversal. Angles between the two stall lines are interior; the stall lines are on the same side of the edge.<br>' + sh.prs.map(function (pr, i) { return pp(pr) + ': ' + PN[ids[i]]; }).join('<br>'), ['Same side of the edge? Between the two stall lines or outside them?'], 'stalls names');
          } }] },
      { num: '5', stem: function (sh) { return 'The two legs of a stepladder stand on a level floor. The legs meet at the top. Use the two legs as “the two lines” and the floor as the transversal.' + sh.svg; },
        shared: function (r) {
          var a = find(function () { return r.int(64, 80); }, function (v) { return v !== 72; }, 74), w = 2.2, h = w / 2 * Math.tan(a * RAD), Tp = [w / 2, h];
          var lines = { f: { p: [-1, 0], q: [3.2, 0], name: 'floor', nameSize: 13 }, l1: { p: [0, 0], q: Tp, width: 3.2 }, l2: { p: [w, 0], q: Tp, width: 3.2 } };
          var F = LF(lines, { scale: 46 }), lt = r.shuffle(['p', 'q', 'r', 's']);
          var ip = F.ang('f', 1, 'l1', 1), ep = F.ang('f', -1, 'l1', 1), ir = F.ang('f', -1, 'l2', 1), er = F.ang('f', 1, 'l2', 1);
          [ip, ep, ir, er].forEach(function (x, i) { x.letter = lt[i]; });
          var segs = [0.25, 0.5, 0.75].map(function (k) { return { p: [w / 2 * k, h * k], q: [w - w / 2 * k, h * k], color: '#8a909c', width: 1.6 }; });
          return { a: a, ip: ip, ep: ep, ir: ir, er: er, svg: F.svg({ labels: [ip, ep, ir, er].map(function (x) { return { ang: x, text: x.letter }; }), segs: segs, width: 240, aria: 'stepladder' }) };
        },
        parts: [
          { id: 'x5a', level: 'EMG', make: function (r, sh) { return TK.pairPick(r, 'Name the pair ' + pp([sh.ip, sh.ir]) + '.', 'int-same', { sol: 'Both are between the legs (interior), on the same side of the floor (above it): <b>interior angles on the same side</b>.', text: 'ladder int' }); } },
          { id: 'x5b', level: 'EMG', make: function (r, sh) { return TK.pairPick(r, 'Name the pair ' + pp([sh.ep, sh.er]) + '.', 'ext-same', { sol: 'Both are outside the legs (exterior), on the same side of the floor (above it): <b>exterior angles on the same side</b>.', text: 'ladder ext' }); } },
          { id: 'x5c', level: 'EMG', make: function (r, sh) {
            return TK.angP('Each leg makes a ' + D(sh.a) + ' angle with the floor on the inside, so ' + t('\\angle ' + sh.ip.letter + '=\\angle ' + sh.ir.letter + '=' + sh.a + '^\\circ') + '. Find ' + t('\\angle ' + sh.ip.letter + '+\\angle ' + sh.ir.letter) + '.', 2 * sh.a, { trap: false, alts: [[180, 'Add the two angles you are given: ' + t(sh.a + '^\\circ+' + sh.a + '^\\circ') + '.'], [sh.a, 'Add <b>both</b> angles.']], sol: t(sh.a + '^\\circ+' + sh.a + '^\\circ=' + 2 * sh.a + '^\\circ'), hints: ['Just add them.'], text: 'ladder sum' });
          } },
          { id: 'x5d', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Darnell says interior angles on the same side always add to 180°. Why is that not true here?', [
              { html: 'They add to 180° only when the two lines are parallel. The legs meet at the top, so they are not parallel.', right: true },
              { html: 'Because the floor is not straight.', why: 'The floor is level and straight. Look at the two legs.', code: 'x5-floor' },
              { html: 'Darnell is right: ' + t(sh.a + '^\\circ+' + sh.a + '^\\circ') + ' is 180°.', why: 'Work it out: ' + t(sh.a + '+' + sh.a + '=' + 2 * sh.a) + '.', code: 'x5-right' },
              { html: 'Because the angles are exterior, not interior.', why: 'Both angles are between the legs, so they are interior.', code: 'x5-ext' }],
              t(sh.a + '^\\circ+' + sh.a + '^\\circ=' + 2 * sh.a + '^\\circ') + ', not 180°.<br>Interior angles on the same side add to 180° only when the two lines are parallel. The legs meet at the top, so they are not parallel.', ['What do the two legs do at the top?'], 'ladder why');
          } }] },
      { num: '6', stem: '', parts: [
        { id: 'x6', level: 'BEG', make: function (r) {
          var D4 = { 'alt-int': 'Both are between the two lines, on opposite sides of the transversal.', 'alt-ext': 'Both are outside the two lines, on opposite sides of the transversal.', 'ext-same': 'Both are outside the two lines, on the same side of the transversal.', corresponding: 'They are in the same position at the two crossings.', 'int-same': 'Both are between the two lines, on the same side of the transversal.' };
          var target = r.pick(['alt-ext', 'alt-int', 'ext-same', 'int-same']), ids = r.shuffle(Object.keys(D4).filter(function (x) { return x !== target; })).slice(0, 3).concat([target]);
          return P.mc(r, 'Which sentence describes <b>' + PN[target] + '</b>?', ids.map(function (id) { return { html: D4[id], right: id === target, why: id === target ? null : 'That describes ' + PN[id] + '.', code: 'x6-' + id }; }),
            D4[target], ['Interior = between the lines; exterior = outside. Alternate = opposite sides of the transversal.'], 'describe');
        } }] },
      { num: '7', stem: '', parts: [
        { id: 'x7', level: 'EMG', make: function (r) {
          var k1 = r.int(1, 4), k2 = r.int(5, 8), v1 = find(function () { return r.int(110, 135); }, function (x) { return x !== 123; }, 121), v2 = find(function () { return r.int(55, 80); }, function (x) { return x !== 71 && x + v1 !== 180; }, v1 > 125 ? 61 : 75);
          var vo = function (k) { return PAIRS['vert-opp'].map(function (p) { return p[0] === k ? p[1] : p[1] === k ? p[0] : null; }).filter(function (x) { return x; })[0]; };
          var a1 = vo(k1), a2 = vo(k2), ans = v1 + v2;
          return TK.angP('<b>Numerical response.</b> Two lines are cut by a transversal and the angles are numbered the usual way. The lines are <b>not</b> parallel. ' + A(k1) + ' = ' + D(v1) + ' and ' + A(k2) + ' = ' + D(v2) + '. The value of ' + t('\\angle ' + a1 + '+\\angle ' + a2) + ', in degrees, is ____.', ans, { nr: true, trap: false,
            alts: [[360 - ans, 'Vertically opposite angles are <b>equal</b>.'], [360 - v1 - v2, 'Vertically opposite angles are <b>equal</b>, not supplementary.']],
            sol: t('\\angle ' + a1 + '=\\angle ' + k1 + '=' + v1 + '^\\circ') + ' (vertically opposite)<br>' + t('\\angle ' + a2 + '=\\angle ' + k2 + '=' + v2 + '^\\circ') + ' (vertically opposite)<br>' + t(v1 + '^\\circ+' + v2 + '^\\circ=' + ans + '^\\circ'), hints: ['Each angle you want is at the same crossing as one you know.'], text: 'NR sum' });
        } }] },
      { num: '8', stem: function (sh) { return 'In this diagram, ℓ₁ and ℓ₂ are <b>not</b> parallel. ' + A(sh.a) + ' = ' + D(sh.m[sh.a]) + ' and ' + A(sh.b) + ' = ' + D(sh.m[sh.b]) + '.' + sh.fig; },
        shared: function (r) {
          var g = npGeom(r, { avoidTilt: [62, 118] }), m = allMeas(g), a = r.pick([3, 4]), b = r.pick([5, 6]), lab = {}; lab[a] = m[a]; lab[b] = m[b];
          return { g: g, m: m, a: a, b: b, fig: TK.std({ parallel: false, tilt: g.tilt, skew: g.skew, angles: lab }) };
        },
        parts: [
          { id: 'x8a', level: 'PRG', make: function (r, sh) { return sixAngles(sh, 'Find the other six angles.'); } },
          { id: 'x8b', level: 'EMG', make: function (r, sh) {
            var m = sh.m;
            return P.mc(r, 'Name the pair ' + A(1) + ' and ' + A(5) + '. Are they equal?', [
              { html: 'Corresponding angles. <b>Not equal</b>: ' + D(m[1]) + ' and ' + D(m[5]) + ' (the lines are not parallel).', right: true },
              { html: 'Corresponding angles. <b>Equal</b>: corresponding angles are always equal.', why: 'Check your answers from (a). They are only equal when the lines are parallel.', code: 'x8-equal' },
              { html: 'Alternate exterior angles. <b>Not equal.</b>', why: A(1) + ' is exterior and ' + A(5) + ' is interior, both on the left: same position.', code: 'x8-ae' },
              { html: 'Vertically opposite angles. <b>Equal.</b>', why: 'Vertically opposite angles are at the same crossing.', code: 'x8-vo' }],
              'Both are in the upper-left position: <b>corresponding</b> angles.<br>' + t('\\angle 1=' + m[1] + '^\\circ') + ' and ' + t('\\angle 5=' + m[5] + '^\\circ') + ': not equal, because the lines are not parallel.', ['Use your answers from (a).'], 'corr not equal');
          } }] },
      { num: '9', section: 'C. Stretch', stem: function (sh) { return 'Four lines ' + sh.ln.map(function (x) { return '<i>' + x + '</i>'; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + ' make a # shape. None of them are parallel. For each pair, name the transversal, the two lines, and the pair.' + sh.svg; },
        shared: function (r) {
          var a = [r.int(2, 8), -r.int(2, 8), r.int(72, 82), r.int(96, 106)], rot = r.pick([0, 90, 180, 270]) + r.int(-6, 6), mir = r.chance(0.5);
          var ln = r.pick([['j', 'k', 'm', 'n'], ['a', 'b', 'c', 'd'], ['p', 'q', 'r', 's']]);
          function L0(P0, d) { return { p: [P0[0] - 1.6 * Math.cos(d * RAD), P0[1] - 1.6 * Math.sin(d * RAD)], q: [P0[0] + 4.6 * Math.cos(d * RAD), P0[1] + 4.6 * Math.sin(d * RAD)] }; }
          var lines = { j: L0([-0.6, 0], a[0]), k: L0([-0.6, 2.4], a[1]), m: L0([0.8, -0.9], a[2]), n: L0([3.6, -0.9], a[3]) };
          // trim: let each line run 1.1 beyond its outer crossings
          var F0 = LF(lines);
          var cr = { j: [F0.X('j', 'm'), F0.X('j', 'n')], k: [F0.X('k', 'm'), F0.X('k', 'n')], m: [F0.X('m', 'j'), F0.X('m', 'k')], n: [F0.X('n', 'j'), F0.X('n', 'k')] };
          Object.keys(cr).forEach(function (id) { var c = cr[id], d = F0.L[id].d, s0 = (c[0][0] - lines[id].p[0]) * d[0] + (c[0][1] - lines[id].p[1]) * d[1], s1 = (c[1][0] - lines[id].p[0]) * d[0] + (c[1][1] - lines[id].p[1]) * d[1], lo = Math.min(s0, s1) - 1.1, hi = Math.max(s0, s1) + 1.1, P0 = lines[id].p; lines[id] = { p: [P0[0] + d[0] * lo, P0[1] + d[1] * lo], q: [P0[0] + d[0] * hi, P0[1] + d[1] * hi] }; });
          lines = turnLines(lines, rot, mir);
          var names = { j: ln[0], k: ln[1], m: ln[2], n: ln[3] };
          Object.keys(lines).forEach(function (id) { lines[id].name = names[id]; var l = lines[id]; if (l.q[1] < l.p[1] - 0.3) { var tmp = l.p; l.p = l.q; l.q = tmp; } });
          var F = LF(lines, { scale: 40 });
          // booklet angles (directions along the original lines: +1 = towards q before the swap; recompute by geometry)
          function sgnTo(id, from, to) { var d = F.L[id].d; return (to[0] - from[0]) * d[0] + (to[1] - from[1]) * d[1] > 0 ? 1 : -1; }
          var P11 = F.X('j', 'm'), P12 = F.X('k', 'm'), P21 = F.X('j', 'n'), P22 = F.X('k', 'n');
          var mid = function (p1, p2, k) { return [p1[0] + (p2[0] - p1[0]) * k, p1[1] + (p2[1] - p1[1]) * k]; };
          var pA = F.ang('k', -sgnTo('k', P12, P22), 'm', sgnTo('m', P12, P11));     // p: at k∩m, away from n, towards j (between j and k)
          var qA = F.ang('j', sgnTo('j', P11, P21), 'm', sgnTo('m', P11, P12));      // q: at j∩m, towards n, towards k
          var rA = F.ang('k', sgnTo('k', P12, P22), 'm', -sgnTo('m', P12, P11));     // r: at k∩m, towards n, away from j
          var sA = F.ang('k', -sgnTo('k', P22, P12), 'n', -sgnTo('n', P22, P21));   // s: at k∩n, away from m, away from j
          var uA = F.ang('n', sgnTo('n', P21, P22), 'j', sgnTo('j', P21, P11));      // u: at j∩n, towards k, towards m
          var lt = r.pick([['p', 'q', 'r', 's', 'u'], ['a', 'b', 'c', 'd', 'e'], ['v', 'w', 'x', 'y', 'z']].filter(function (L5) { return !L5.some(function (c) { return ln.indexOf(c) >= 0; }); }));
          [pA, qA, rA, sA, uA].forEach(function (x, i) { x.letter = lt[i]; });
          var svg = F.svg({ labels: [pA, qA, rA, sA, uA].map(function (x) { return { ang: x, text: x.letter }; }), width: 320, aria: 'four lines in a # shape' });
          return { svg: svg, F: F, ln: ln, names: names, prs: r.shuffle([[pA, qA], [rA, sA], [qA, uA]]) };
        },
        parts: [0, 1, 2].map(function (i) {
          return { id: 'x9' + 'abc'.charAt(i), level: i === 2 ? 'MAS' : 'ADV', make: function (r, sh) { var pr = sh.prs[i]; return hashPart(sh, pr[0], pr[1]); } };
        }) },
      { num: '10', stem: function (sh) { return 'Kim says, “Alternate interior angles are always equal, because they make a Z.” In a diagram where ℓ₁ and ℓ₂ are <b>not</b> parallel, ' + A(4) + ' = ' + D(sh.m[4]) + ' and ' + A(5) + ' = ' + D(sh.m[5]) + '.' + sh.fig; },
        shared: function (r) { var g = npGeom(r, { avoidTilt: [62] }), m = allMeas(g), lab = { 4: m[4], 5: m[5] }; return { m: m, fig: TK.std({ parallel: false, tilt: g.tilt, skew: g.skew, angles: lab }) }; },
        parts: [
          { id: 'x10a', level: 'PRG', make: function (r, sh) {
            var m = sh.m;
            return P.mc(r, 'Which work shows that Kim is wrong?', [
              { html: A(6) + ' = ' + t('180^\\circ-' + m[5] + '^\\circ=' + m[6] + '^\\circ') + '. ' + A(4) + ' and ' + A(6) + ' are alternate interior angles (a Z), but ' + D(m[4]) + ' ≠ ' + D(m[6]) + '.', right: true },
              { html: A(2) + ' = ' + D(m[4]) + ' because it is vertically opposite ' + A(4) + '.', why: 'That’s true, but it doesn’t test Kim’s claim about alternate interior angles.', code: 'x10-vo' },
              { html: A(4) + ' and ' + A(5) + ' are alternate interior angles, and ' + D(m[4]) + ' ≠ ' + D(m[5]) + '.', why: A(4) + ' and ' + A(5) + ' are on the <b>same side</b> of t, so they are not alternate.', code: 'x10-wrongpair' },
              { html: A(4) + ' + ' + A(5) + ' = ' + D(Math.round((m[4] + m[5]) * 10) / 10) + ', not 180°.', why: 'That tests a different rule (interior angles on the same side), not Kim’s.', code: 'x10-other' }],
              t('\\angle 6=180^\\circ-' + m[5] + '^\\circ=' + m[6] + '^\\circ') + ' (straight line with ' + A(5) + ')<br>' + A(4) + ' and ' + A(6) + ' are alternate interior angles, but ' + D(m[4]) + ' ≠ ' + D(m[6]) + '. So Kim is wrong.', ['Find an alternate interior partner for ' + A(4) + '.'], 'Kim wrong');
          } },
          { id: 'x10b', level: 'PRG', make: function (r) {
            return P.mc(r, 'Which sentence fixes Kim’s statement so that it is true?', [
              { html: 'Alternate interior angles are equal <b>when the two lines are parallel</b>.', right: true },
              { html: 'Alternate interior angles always add to 180°.', why: 'With parallel lines they are equal, not supplementary.', code: 'x10-180' },
              { html: 'Alternate interior angles are equal <b>when they make a Z</b>.', why: 'Every alternate interior pair makes a Z, parallel or not. What has to be true about the lines?', code: 'x10-Z' },
              { html: 'Alternate interior angles are equal <b>when the transversal is perpendicular</b>.', why: 'A perpendicular transversal doesn’t make the lines parallel.', code: 'x10-perp' }],
              '“Alternate interior angles are equal <b>when the two lines are parallel</b>.”', ['What was different about the diagram in (a)?'], 'Kim fix');
          } }] },
      { num: '11', stem: function (sh) { return 'Pat named four pairs in a diagram numbered the usual way. <b>Two</b> of Pat’s answers are wrong.<br>' + sh.claims.map(function (c, i) { return '(' + ['i', 'ii', 'iii', 'iv'][i] + ') ' + A(c.p[0]) + ' and ' + A(c.p[1]) + ': ' + PS[c.said]; }).join('<br>') + TK.std({ tilt: sh.tilt, width: 260 }); },
        shared: function (r) {
          var types = r.sample(['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same'], 4), bad = r.sample([0, 1, 2, 3], 2);
          var CONF = { corresponding: ['ext-same', 'alt-ext', 'int-same'], 'alt-int': ['int-same', 'corresponding'], 'alt-ext': ['ext-same', 'corresponding'], 'int-same': ['alt-int', 'corresponding'], 'ext-same': ['alt-ext', 'corresponding'] };
          var claims = types.map(function (ty, i) { var p = poolPick(r, ty), said = bad.indexOf(i) >= 0 ? r.pick(CONF[ty]) : ty; return { p: p, real: ty, said: said }; });
          return { claims: claims, bad: bad.sort(), tilt: TK.tilt(r) };
        },
        parts: [
          { id: 'x11a', level: 'ADV', make: function (r, sh) {
            var R = ['i', 'ii', 'iii', 'iv'], want = sh.bad.map(function (i) { return R[i]; });
            return { prompt: 'Tap the two answers that are wrong.', input: { type: 'select', options: R.map(function (x) { return { value: x, html: '(' + x + ')' }; }), help: 'Tap two.' },
              check: function (resp) {
                resp = resp || []; if (!resp.length) return form('empty', 'Tap the wrong answers first.');
                var ex = resp.filter(function (x) { return want.indexOf(x) < 0; }), mi = want.filter(function (x) { return resp.indexOf(x) < 0; });
                if (!ex.length && !mi.length) return ok();
                if (ex.length) { var c = sh.claims[R.indexOf(ex[0])]; return wrong('u5l7-set', '(' + ex[0] + ') is right: ' + why3(c.p[0], c.p[1]).replace(/\.$/, '') + ', so they are ' + PN[c.real] + '.'); }
                return wrong('u5l7-set', 'Two of them are wrong. Check each one with the three questions.');
              }, key: want, answer: want.map(function (x) { return '(' + x + ')'; }).join(' and '),
              solution: sh.bad.map(function (i) { var c = sh.claims[i]; return '(' + R[i] + ') is wrong: ' + why3(c.p[0], c.p[1]) + ' They are <b>' + PN[c.real] + '</b>.'; }).join('<br>'), hints: ['Ask the three questions for each pair.'], text: 'Pat errors' };
          } },
          { id: 'x11b', level: 'PRG', make: function (r, sh) {
            var R = ['i', 'ii', 'iii', 'iv'];
            return P.fields('Write the correct name for each of Pat’s four pairs.', sh.claims.map(function (c, i) { return { label: '(' + R[i] + ') ' + A(c.p[0]) + ' &amp; ' + A(c.p[1]) + ':', name: '(' + R[i] + ')', mode: 'text', wide: true, placeholder: 'pair name' }; }),
              sh.claims.map(function (c) { return G.pairChk(c.real); }), sh.claims.map(function (c) { return PS[c.real]; }), sh.claims.map(function (c, i) { return '(' + R[i] + ') ' + PN[c.real]; }).join('<br>'),
              sh.claims.map(function (c, i) { return '(' + R[i] + ') ' + why3(c.p[0], c.p[1]) + ' → ' + PN[c.real]; }).join('<br>'), ['Ask the three questions for each pair.'], 'Pat fixed');
          } }] },
      { num: '12', stem: 'With 8 angles there are 28 different pairs. Make a systematic list.', shared: function (r) { return { ord: r.shuffle([2, 3, 4, 5, 6]), cand: r.shuffle(NONE.concat(r.sample([[1, 5], [3, 5], [2, 8], [4, 5], [2, 7], [2, 6], [4, 6], [1, 7]], 4))) }; },
        parts: [
          { id: 'x12a', level: 'ADV', make: function (r, sh) {
            var rows = [['vert-opp', 'vertically opposite', 4], ['linear', 'side by side on a straight line', 8], ['corresponding', 'corresponding', 4], ['alt-int', 'alternate interior', 2], ['alt-ext', 'alternate exterior', 2], ['int-same', 'interior on the same side', 2], ['ext-same', 'exterior on the same side', 2], ['none', 'no special name', 4]];
            var order = [0, 1].concat(sh.ord).concat([7]).map(function (i) { return rows[i]; });
            return P.fields('How many of the 28 pairs are:', order.map(function (rw) { return { label: rw[1] + ':', name: rw[1] }; }),
              order.map(function (rw) { return K.number(rw[2], function (v) { return v === rw[2] * 2 ? { code: 'u5l7-count', hint: 'Count each pair once: ' + t('\\angle 1') + ' &amp; ' + t('\\angle 5') + ' is the same pair as ' + t('\\angle 5') + ' &amp; ' + t('\\angle 1') + '.' } : null; }); }),
              order.map(function (rw) { return String(rw[2]); }), order.map(function (rw) { return rw[1] + ': ' + rw[2]; }).join('<br>'),
              'Same crossing: each crossing has 6 pairs, so 12. Vertically opposite: 4 (1 &amp; 3, 2 &amp; 4, 5 &amp; 7, 6 &amp; 8). Straight line: 8.<br>Different crossings: 4 × 4 = 16 pairs. Corresponding 4, alternate interior 2, alternate exterior 2, interior same side 2, exterior same side 2: that is 12.<br>No special name: 16 − 12 = 4. (Check: 12 + 12 + 4 = 28.)', ['Start with one crossing: how many pairs can you make from 4 angles?', 'At different crossings: 4 angles at the top × 4 at the bottom = 16 pairs.'], 'count pairs');
          } },
          { id: 'x12b', level: 'MAS', make: function (r, sh) {
            var want = NONE.map(function (p) { return p[0] + '-' + p[1]; });
            return { prompt: 'Which pairs have <b>no special name</b>? Tap all of them.', input: { type: 'select', options: sh.cand.map(function (p) { return { value: p[0] + '-' + p[1], html: A(p[0]) + ' &amp; ' + A(p[1]) }; }), help: 'Tap every pair with no special name.' },
              check: function (resp) {
                resp = resp || []; if (!resp.length) return form('empty', 'Tap the pairs first.');
                var ex = resp.filter(function (x) { return want.indexOf(x) < 0; }), mi = want.filter(function (x) { return resp.indexOf(x) < 0; });
                if (!ex.length && !mi.length) return ok();
                if (ex.length) { var p = ex[0].split('-').map(Number); return wrong('u5l7-set', A(p[0]) + ' and ' + A(p[1]) + ' are ' + PN[G.pairName(p[0], p[1])] + '.'); }
                return wrong('u5l7-set', 'There are 4 pairs with no special name. Look for one interior and one exterior angle on <b>opposite</b> sides of t.');
              }, key: want, answer: NONE.map(function (p) { return A(p[0]) + ' &amp; ' + A(p[1]); }).join(', '),
              solution: 'One interior and one exterior angle on opposite sides of t: ' + NONE.map(function (p) { return A(p[0]) + ' &amp; ' + A(p[1]); }).join(', ') + '.', hints: ['A pair with no name has one angle inside and one outside the lines, on opposite sides of t.'], text: 'no name pairs' };
          } }] }
    ]
  });

  /* ================= part builders used above ================= */
  function twoNo(w1, p1, w2, p2) {
    var lab = function (w, g) { return (w === 'vert-opp' ? 'vertically opposite' : w === 'corresponding' ? 'corresponding to' : w === 'alt-int' ? 'alternate interior to' : w === 'alt-ext' ? 'alternate exterior to' : w === 'int-same' ? 'interior on the same side as' : 'exterior on the same side as') + ' ' + A(g); };
    var a = TK.angNoP('', p1[0], w1), b = TK.angNoP('', p2[0], w2);
    return P.fields('Name the angle that is:', [{ label: lab(w1, p1[0]) + ':', before: t('\\angle'), name: lab(w1, p1[0]) }, { label: lab(w2, p2[0]) + ':', before: t('\\angle'), name: lab(w2, p2[0]) }],
      [a.check, b.check], [a.key, b.key], lab(w1, p1[0]) + ': ' + a.answer + '<br>' + lab(w2, p2[0]) + ': ' + b.answer,
      a.solution + '<br>' + b.solution, ['Find the given angle first. ' + (w1 === 'corresponding' ? 'Corresponding: add or subtract 4.' : w1 === 'vert-opp' ? 'Vertically opposite: across the same crossing.' : 'Alternate = other side of t; same side = same side of t.')], 'name the angle');
  }
  function listPairs(r, id, prompt) {
    var pairs = TK.pairsOf(id).map(function (p) { return r.chance(0.5) ? p : [p[1], p[0]]; }), rows = r.shuffle(pairs);
    return P.fields(prompt, rows.map(function (p) { return { label: A(p[0]) + ' and ', before: t('\\angle'), name: A(p[0]) + '’s partner' }; }),
      rows.map(function (p) { return TK.angNoChk(p[1], p[0], id); }), rows.map(function (p) { return String(p[1]); }), rows.map(function (p) { return A(p[0]) + ' &amp; ' + A(p[1]); }).join(', '),
      PN[id].charAt(0).toUpperCase() + PN[id].slice(1) + ': ' + TK.pairsOf(id).map(function (p) { return A(p[0]) + ' &amp; ' + A(p[1]); }).join(', ') + '.', [WANT[id] ? 'The partner is ' + WANT[id] + '.' : ''], 'list ' + id);
  }
  function protPart(v, sc, k, r) {
    var rot = r.pick([0, 0, 15, -15, 25]), svg = G.protractorSVG({ angle: v, rot: rot, scale: sc, width: 360 });
    // a one-box fields part: the reading is right within 1° (a plain number box would make the tests treat key + 1 as wrong)
    return P.fields('The protractor is laid on ' + A(k) + '. What does ' + A(k) + ' measure?' + svg, [{ label: t('\\angle ' + k + '='), after: '°', name: '∠' + k }], [G.angleChk(v, { tol: 1 })], [String(v)], D(v),
      'One arm is on the 0 of the <b>' + sc + '</b> scale, so read the ' + sc + ' scale: ' + D(v) + '.<br>(' + A(k) + ' is ' + (v < 90 ? 'acute, so it is less than 90°' : 'obtuse, so it is more than 90°') + '.)', ['Find the arm that sits on a 0. Read the scale that starts at that 0.', 'Is the angle acute or obtuse? Your answer should match.'], 'protractor ∠' + k);
  }
  TK.protPart = protPart;
  function sixAngles(sh, prompt) {
    var m = sh.m, ks = [1, 2, 3, 4, 5, 6, 7, 8].filter(function (k) { return k !== sh.a && k !== sh.b; });
    var chk = ks.map(function (k) {
      var alts = [];
      var par = TK.meas(sh.g.tilt, 0, k);   // what it would be if the top crossing were copied down (parallel-line thinking)
      if (k > 4 && Math.abs(par - m[k]) > 0.5) alts.push({ v: par, code: 'u5l7-parallel-rule', hint: 'The lines are not parallel, so you can’t copy angles from the top crossing to the bottom one. Use ' + A(sh.b) + '.' });
      if (k <= 4) { var pt = TK.meas(sh.g.tilt - sh.g.skew, 0, k); if (Math.abs(pt - m[k]) > 0.5) alts.push({ v: pt, code: 'u5l7-parallel-rule', hint: 'The lines are not parallel, so you can’t copy angles from the bottom crossing to the top one. Use ' + A(sh.a) + '.' }); }
      return G.angleChk(m[k], { supplementTrap: A(k) + ': check which rule you used. Vertically opposite angles are <b>equal</b>; angles side by side on a line <b>add to 180°</b>.', alts: alts });
    });
    var sol = ks.map(function (k) { var g = k <= 4 ? sh.a : sh.b, nm = G.pairName(k, g); return nm === 'vert-opp' ? t('\\angle ' + k + '=' + m[k] + '^\\circ') + ' (vertically opposite ' + A(g) + ')' : (nm === 'linear' ? t('\\angle ' + k + '=180^\\circ-' + m[g] + '^\\circ=' + m[k] + '^\\circ') + ' (straight line with ' + A(g) + ')' : null); });
    // the angle vertically opposite the straight-line one (needs the straight-line answer first)
    ks.forEach(function (k, i) { if (!sol[i]) { var g = k <= 4 ? sh.a : sh.b, lin = ks.filter(function (j) { return (j <= 4) === (k <= 4) && G.pairName(j, g) === 'linear' && G.pairName(j, k) === 'vert-opp'; })[0]; sol[i] = t('\\angle ' + k + '=' + m[k] + '^\\circ') + ' (vertically opposite ' + A(lin) + ')'; } });
    return P.fields(prompt, ks.map(function (k) { return { label: t('\\angle ' + k + '='), after: '°', name: '∠' + k }; }), chk, ks.map(function (k) { return String(m[k]); }), ks.map(function (k) { return A(k) + ' = ' + D(m[k]); }).join(', '),
      sol.join('<br>'), ['At each crossing use only <b>vertically opposite</b> (equal) and <b>straight line</b> (add to 180°).', 'The lines are not parallel, so the top crossing tells you nothing about the bottom crossing.'], 'six angles');
  }
  function triPart(sh, X, Y) {
    var F = sh.F, T = F.trans(X, Y), nmOf = function (id) { return F.L[id].name; }, all = ['p', 'q', 'r'].map(nmOf), others = ['p', 'q', 'r'].filter(function (id) { return id !== T; }).map(nmOf), name = F.name(X, Y);
    var where = function (U, W) { return F.isInt(U, W) ? 'between ' + others.map(function (x) { return '<i>' + x + '</i>'; }).join(' and ') : 'outside ' + others.map(function (x) { return '<i>' + x + '</i>'; }).join(' and '); };
    return P.fields('For ' + pp([X, Y]) + ': which line is the transversal, and which are the two lines? Name the pair.', [{ label: 'Transversal:', name: 'Transversal', mode: 'text', placeholder: 'letter' }, { label: 'Two lines:', name: 'Two lines', mode: 'text', wide: true, placeholder: 'two letters' }, { label: 'Pair:', name: 'Pair name', mode: 'text', wide: true, placeholder: 'pair name' }],
      [TK.lineChk(nmOf(T), { all: all }), TK.twoLinesChk(others, { all: all }), G.pairChk(name)], [nmOf(T), others.join(' and '), PS[name]],
      'Transversal <i>' + nmOf(T) + '</i>; lines <i>' + others[0] + '</i> and <i>' + others[1] + '</i>; <b>' + PN[name] + '</b>',
      'Both vertices are on <i>' + nmOf(T) + '</i>, so <i>' + nmOf(T) + '</i> is the transversal; ' + others.map(function (x) { return '<i>' + x + '</i>'; }).join(' and ') + ' are the two lines.<br>' + t('\\angle ' + X.letter) + ' is ' + where(X, Y) + '; ' + t('\\angle ' + Y.letter) + ' is ' + where(Y, X) + '.<br>So they are <b>' + PN[name] + '</b>.',
      ['The transversal is the line through the vertices of <b>both</b> angles.', 'Turn the page so the transversal goes up and down, then ask: interior or exterior? same side?'], 'triangle pair');
  }
  function hashPart(sh, X, Y) {
    var F = sh.F, T = F.trans(X, Y), nm = sh.names, all = ['j', 'k', 'm', 'n'].map(function (id) { return nm[id]; }), name = F.name(X, Y);
    var lines2 = [X.a, X.b, Y.a, Y.b].filter(function (id) { return id !== T; }).map(function (id) { return nm[id]; });
    return P.fields('For ' + pp([X, Y]) + ':', [{ label: 'Transversal:', name: 'Transversal', mode: 'text', placeholder: 'letter' }, { label: 'Two lines:', name: 'Two lines', mode: 'text', wide: true, placeholder: 'two letters' }, { label: 'Pair:', name: 'Pair name', mode: 'text', wide: true, placeholder: 'pair name' }],
      [TK.lineChk(nm[T], { all: all }), TK.twoLinesChk(lines2, { all: all }), G.pairChk(name)], [nm[T], lines2.join(' and '), PS[name]],
      'Transversal <i>' + nm[T] + '</i>; lines <i>' + lines2[0] + '</i> and <i>' + lines2[1] + '</i>; <b>' + PN[name] + '</b>',
      'The transversal is the line through both vertices: <i>' + nm[T] + '</i>. The two lines are <i>' + lines2[0] + '</i> and <i>' + lines2[1] + '</i>.<br>' + t('\\angle ' + X.letter) + ' is ' + (F.isInt(X, Y) ? 'between' : 'outside') + ' them; ' + t('\\angle ' + Y.letter) + ' is ' + (F.isInt(Y, X) ? 'between' : 'outside') + ' them.<br>So they are <b>' + PN[name] + '</b>.',
      ['The transversal goes through the vertices of both angles.', 'Turn the page so the transversal goes up and down.'], '# pair');
  }
})(window);
