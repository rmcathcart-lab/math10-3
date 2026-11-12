/* Unit 5 project: Mini-Golf Designer (Angles, Parallel Lines and Spatial Puzzles: G1, G5, G6).
 * A town's summer fair is building a mini-golf course, and the student designs one hole: pick a theme, a name and one of
 * 3 hole shapes (each student gets their own angles), measure every corner with a protractor on the page (acute, right,
 * obtuse, reflex = 360° − the outside reading; the angle-sum rule (n − 2) × 180°), estimate then aim a bank shot off a
 * wall (angle in = angle out; complementary and supplementary partners), find the true bearing from the clubhouse to the
 * hole and back (3 digits, clockwise from north, ± 180°), name and find the angles where a ramp brace crosses the
 * parallel side rails (and test a crooked rail), cut the border boards (bisect the corners), copy a windmill blade's
 * angle and brace a perpendicular post, tile a pentomino obstacle pad (G1: strategy and error spotting), then print a
 * hole design card and hand it in. Every answer is checked against the student's own hole and earlier answers.
 * Worked examples use a different designer: Dev at Moose Meadows Mini-Golf in Sylvan Lake.
 * Conventions follow the Unit 5 booklet (m103book/common/BOOK_BRIEF.md): 180° protractor with the outer scale 0 on the
 * left and the inner scale 0 on the right; true bearings clockwise from north, always 3 digits; the 8-angle transversal
 * diagram (1–4 at the top crossing clockwise from upper-left, 5–8 at the bottom crossing); the indicator pair names.
 * Engine: js/projects.js. Each checkpoint has solve(c), which fills in right answers (tests/projects_u5_test.js and
 * tests/projects_u5_e2e.py). Styles: assets/projects-u5.css (added to the page by this file). */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, esc = PJ.esc;
  var hasDoc = typeof document !== 'undefined';
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  if (hasDoc && PJ.site != null && !document.querySelector('link[data-pj-u5], link[href*="projects-u5.css"]')) {
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = PJ.site + 'assets/projects-u5.css'; lk.setAttribute('data-pj-u5', ''); document.head.appendChild(lk);
  }
  var D2R = Math.PI / 180, R2D = 180 / Math.PI, NS = 'http://www.w3.org/2000/svg';

  /* ================= small helpers ================= */
  function hv(c, k) { return PJ.hash(c.seed + '|' + k); }
  function norm(a) { a %= 360; return a < 0 ? a + 360 : a; }
  function adiff(a, b) { var d = Math.abs(norm(a) - norm(b)); return d > 180 ? 360 - d : d; }
  function fx(x, n) { return String(Number((+x).toFixed(n == null ? 1 : n))); }
  function dg(x) { return fx(x, 1) + '°'; }
  function b3(x) { var v = Math.round(norm(x)); return (v < 10 ? '00' : v < 100 ? '0' : '') + v; } // a true bearing, 3 digits
  /* a typed angle: "35", "35°", "35 deg", "∠ 35" → number; anything else → NaN */
  function pa(s) { if (s == null) return NaN; var t = String(s).trim().replace(/^∠\s*/, '').replace(/\s*(°|º|˚|deg(rees?)?)\s*$/i, ''); return PJ.parse(t); }
  function mine(c, k, fb) { var x = pa(c.get(k)); return isNaN(x) ? fb : x; } // the student's own number (or the right one)
  function typeOf(a) { return a < 90 - 1e-9 ? 'acute' : Math.abs(a - 90) < 1e-9 ? 'right' : a < 180 - 1e-9 ? 'obtuse' : Math.abs(a - 180) < 1e-9 ? 'straight' : 'reflex'; }
  var TYPES = [{ v: 'acute', t: 'Acute (less than 90°)' }, { v: 'right', t: 'Right (90°)' }, { v: 'obtuse', t: 'Obtuse (90° to 180°)' }, { v: 'straight', t: 'Straight (180°)' }, { v: 'reflex', t: 'Reflex (more than 180°)' }];

  /* ================= result builders ================= */
  function R0(f, ok, x) { var r = { f: f, ok: !!ok, blank: false, graded: true }; if (x) for (var k in x) r[k] = x[k]; return r; }
  /* an angle within o.tol of exp; o.wrong: [{ v, tol, hint }] */
  function angR(c, k, exp, o) {
    o = o || {}; var base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!c.has(k)) return R0(k, false, Object.assign(base, { blank: true }));
    var x = pa(c.get(k)), tol = o.tol == null ? 0 : o.tol;
    if (isNaN(x)) return R0(k, false, Object.assign(base, { form: true, hint: 'Type just the number of degrees, like 35.' }));
    if (Math.abs(x - exp) <= tol + 1e-9) return R0(k, true, base);
    var w = o.wrong || [];
    for (var i = 0; i < w.length; i++) { var wt = w[i].tol == null ? tol : w[i].tol; if (w[i].v != null && isFinite(w[i].v) && Math.abs(x - w[i].v) <= wt + 1e-9 && Math.abs(w[i].v - exp) > tol + 1e-9) return R0(k, false, Object.assign(base, { hint: w[i].hint })); }
    return R0(k, false, Object.assign(base, { hint: o.hint || 'Check this one again.' }));
  }
  /* a true bearing: like angR, but it must be written with 3 digits (057, not 57) */
  function brgR(c, k, exp, o) {
    var r = angR(c, k, exp, o); if (!r.ok) return r;
    var raw = String(c.get(k)).trim().replace(/\s*(°|º|˚|deg(rees?)?)\s*$/i, ''), x = pa(c.get(k)), whole = raw.split('.')[0].replace(/^[+]/, '');
    if (x < 100 && whole.length < 3) return R0(k, false, { label: o.label, hint2: o.hint2, graded: true, hint: 'Right direction! A bearing always has <b>3 digits</b>: write <b>' + b3(x) + '°</b>, not ' + fx(x, 1) + '°.' });
    return r;
  }

  /* ================= the course: themes, towns, colours ================= */
  var THEMES = {
    farm: { name: 'Prairie Farm', icon: '🚜', blurb: 'Hay bales, a red barn and a windmill', obst: 'hay bale', ob: '#e2b33c', names: ['Hay Bale Hop', 'The Tractor Turn', 'Barnyard Bounce'] },
    peaks: { name: 'Rocky Mountains', icon: '🏔️', blurb: 'Boulders, pine trees and a mountain creek', obst: 'boulder', ob: '#9aa3ad', names: ['Avalanche Alley', 'Bighorn Bend', 'Summit Shot'] },
    dino: { name: 'Badlands Dinos', icon: '🦖', blurb: 'Hoodoos and dinosaur eggs, like Drumheller', obst: 'dino egg', ob: '#e9dcc0', names: ['T. Rex Trouble', 'Hoodoo Hollow', 'Fossil Fairway'] },
    hockey: { name: 'Hockey Night', icon: '🏒', blurb: 'Boards, nets and a Zamboni-free zone', obst: 'hockey net', ob: '#dc2626', names: ['Top Shelf', 'The Slapshot', 'Hat Trick Hole'] },
    lake: { name: 'Lake Country', icon: '🛶', blurb: 'Canoes, loons and a dock', obst: 'canoe', ob: '#c2410c', names: ['Loon Lagoon', 'Paddle Pass', 'Dockside Dash'] },
    midway: { name: 'Fair Midway', icon: '🎡', blurb: 'Ferris wheel, popcorn and mini donuts', obst: 'popcorn cart', ob: '#f59e0b', names: ['Ferris Wheel Whirl', 'Mini Donut Drop', 'Midway Madness'] }
  };
  var THEME_IDS = ['farm', 'peaks', 'dino', 'hockey', 'lake', 'midway'];
  var CARPETS = [['#3f9b4f', 'Classic green'], ['#2f7fc1', 'Lake blue'], ['#c0504d', 'Fair red'], ['#8e6bbf', 'Purple'], ['#c98a1f', 'Prairie gold'], ['#2a9d8f', 'Teal']];
  var TOWNS = ['Airdrie', 'Cochrane', 'Okotoks', 'Strathmore', 'Olds', 'Didsbury', 'Crossfield', 'Chestermere'];
  function course(c) { return { town: TOWNS[hv(c, 'town') % TOWNS.length], hole: 1 + hv(c, 'hole') % 9 }; }
  function theme(c) { return THEMES[c.get('theme')] || null; }
  function carpet(c) { return c.get('carpet') || CARPETS[0][0]; }
  function holeName(c) { var t = theme(c), n = String(c.get('holeName') || '').trim(); return n || (t ? t.names[0] : 'My hole'); }

  /* ================= pentominoes (G1) ================= */
  var PENT = { F: [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]], I: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], L: [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1]], N: [[0, 1], [1, 1], [2, 0], [2, 1], [3, 0]],
    P: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0]], T: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]], U: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]], V: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    W: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]], X: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], Y: [[0, 1], [1, 0], [1, 1], [2, 1], [3, 1]], Z: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]] };
  var PIDS = 'FILNPTUVWXYZ'.split('');
  var PCOL = { F: '#ef4444', I: '#f59e0b', L: '#84cc16', N: '#10b981', P: '#06b6d4', T: '#3b82f6', U: '#8b5cf6', V: '#d946ef', W: '#f43f5e', X: '#0ea5e9', Y: '#a3a33a', Z: '#fb923c' };
  function normCells(cs) {
    var mr = Math.min.apply(null, cs.map(function (q) { return q[0]; })), mc = Math.min.apply(null, cs.map(function (q) { return q[1]; }));
    return cs.map(function (q) { return [q[0] - mr, q[1] - mc]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  }
  /* orientation k (0–7): flip first (k ≥ 4), then turn a quarter clockwise k % 4 times */
  function orient(p, k) {
    var cs = PENT[p].map(function (q) { return [q[0], k >= 4 ? -q[1] : q[1]]; });
    for (var i = 0; i < k % 4; i++) cs = cs.map(function (q) { return [q[1], -q[0]]; });
    return normCells(cs);
  }
  function ckey(cs) { return cs.map(function (q) { return q[0] + ',' + q[1]; }).join(';'); }
  var ORI = {}; PIDS.forEach(function (p) { var seen = {}; ORI[p] = []; for (var k = 0; k < 8; k++) { var cs = orient(p, k), kk = ckey(cs); if (!seen[kk]) { seen[kk] = 1; ORI[p].push({ k: k, cs: cs }); } } });
  function shapeOf(cells) { var kk = ckey(normCells(cells)), hit = null; PIDS.forEach(function (p) { ORI[p].forEach(function (o) { if (ckey(o.cs) === kk) hit = p; }); }); return hit; }
  /* the cell of a piece nearest the middle of its box: where it is "held" when it is placed */
  function grabCell(cs) {
    var mr = Math.max.apply(null, cs.map(function (q) { return q[0]; })) / 2, mc = Math.max.apply(null, cs.map(function (q) { return q[1]; })) / 2, best = cs[0], bd = 1e9;
    cs.forEach(function (q) { var d = (q[0] - mr) * (q[0] - mr) + (q[1] - mc) * (q[1] - mc); if (d < bd - 1e-9) { bd = d; best = q; } });
    return best;
  }
  /* tile a rows × cols pad with pentominoes (each piece once, unless o.twice names one that may be used twice and must be) */
  function tilePad(rows, cols, order, o) {
    o = o || {}; var grid = [], used = {}, out = [], r, cc;
    for (r = 0; r < rows; r++) { grid.push([]); for (cc = 0; cc < cols; cc++) grid[r].push(0); }
    function first() { for (var i = 0; i < rows; i++) for (var j = 0; j < cols; j++) if (!grid[i][j]) return [i, j]; return null; }
    function go() {
      var f = first(); if (!f) return !o.twice || used[o.twice] === 2;
      for (var a = 0; a < order.length; a++) {
        var p = order[a], lim = p === o.twice ? 2 : 1; if ((used[p] || 0) >= lim) continue;
        for (var b = 0; b < ORI[p].length; b++) {
          var cs = ORI[p][b].cs, dr = f[0] - cs[0][0], dc = f[1] - cs[0][1], cells = cs.map(function (q) { return [q[0] + dr, q[1] + dc]; });
          if (!cells.every(function (q) { return q[0] >= 0 && q[1] >= 0 && q[0] < rows && q[1] < cols && !grid[q[0]][q[1]]; })) continue;
          cells.forEach(function (q) { grid[q[0]][q[1]] = 1; }); used[p] = (used[p] || 0) + 1; out.push({ p: p, cells: cells });
          if (go()) return true;
          cells.forEach(function (q) { grid[q[0]][q[1]] = 0; }); used[p]--; out.pop();
        }
      }
      return false;
    }
    return go() ? out : null;
  }
  function seededOrder(c, k) { var a = PIDS.slice(), h = hv(c, k); for (var i = a.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; var j = h % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var PADS = [[3, 5], [4, 5], [5, 4], [3, 5]];
  function padOf(c) { var p = PADS[hv(c, 'pad') % PADS.length]; return { rows: p[0], cols: p[1], n: p[0] * p[1] / 5 }; }
  /* the student's placed pieces: [{ p, cells }] → what's covered, and what's wrong */
  function tileState(c, pad) {
    var list = []; try { list = JSON.parse(c.get('tile') || '[]'); } catch (e) { list = []; } if (!Array.isArray(list)) list = [];
    var grid = {}, seen = {}, bad = '';
    list = list.filter(function (t) { return t && PENT[t.p] && Array.isArray(t.cells) && t.cells.length === 5; });
    list.forEach(function (t) {
      if (shapeOf(t.cells) !== t.p) bad = bad || 'shape';
      if (seen[t.p]) bad = bad || 'twice'; seen[t.p] = 1;
      t.cells.forEach(function (q) { if (q[0] < 0 || q[1] < 0 || q[0] >= pad.rows || q[1] >= pad.cols) bad = bad || 'out'; var kk = q[0] + ',' + q[1]; if (grid[kk]) bad = bad || 'overlap'; grid[kk] = t.p; });
    });
    return { list: list, grid: grid, covered: Object.keys(grid).length, bad: bad, full: !bad && Object.keys(grid).length === pad.rows * pad.cols };
  }
  /* Jordan's attempt (the error-spotting item): a tiling of the student's pad with one mistake */
  var ERRS = ['twice', 'six', 'off'];
  function errTiling(c) {
    var kind = ERRS[hv(c, 'errk') % ERRS.length];
    for (var k = 0; k < 16; k++) { var e = errTry(c, kind, seededOrder(c, 'errorder' + (k || ''))); if (e) return e; }
    return null;
  }
  function errTry(c, kind, order) {
    var pad = padOf(c), t = null;
    if (kind === 'twice') { for (var i = 0; i < order.length && !t; i++) t = tilePad(pad.rows, pad.cols, order, { twice: order[i] }); return t ? { kind: kind, list: t, pad: pad } : null; }
    var base = tilePad(pad.rows, pad.cols, order); if (!base) return null;
    var own = {}; base.forEach(function (pc, i) { pc.cells.forEach(function (q) { own[q[0] + ',' + q[1]] = i; }); });
    function connected(cells) { if (!cells.length) return false; var left = cells.map(function (q) { return q[0] + ',' + q[1]; }), st = [left.shift()]; while (st.length) { var k = st.pop().split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var j = left.indexOf((k[0] + d[0]) + ',' + (k[1] + d[1])); if (j >= 0) st.push(left.splice(j, 1)[0]); }); } return !left.length; }
    if (kind === 'six') { // move one square from one piece to its neighbour: one piece of 6 and one of 4
      for (var a = 0; a < base.length; a++) for (var q = 0; q < 5; q++) {
        var cell = base[a].cells[q], rest = base[a].cells.filter(function (_, j) { return j !== q; });
        if (!connected(rest)) continue;
        var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(function (d) { return own[(cell[0] + d[0]) + ',' + (cell[1] + d[1])]; }).filter(function (x) { return x != null && x !== a; });
        if (!nb.length) continue;
        var list = base.map(function (pc) { return { p: pc.p, cells: pc.cells.slice() }; }); list[a].cells = rest; list[nb[0]].cells.push(cell); list[a].p = '?'; list[nb[0]].p = '?';
        return { kind: kind, list: list, pad: pad };
      }
      return null;
    }
    // 'off': slide one edge piece one square off the pad, leaving squares empty (and no overlap)
    var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (var b = 0; b < base.length; b++) for (var d = 0; d < 4; d++) {
      var mv = base[b].cells.map(function (q2) { return [q2[0] + dirs[d][0], q2[1] + dirs[d][1]]; });
      var outside = mv.filter(function (q2) { return q2[0] < 0 || q2[1] < 0 || q2[0] >= pad.rows || q2[1] >= pad.cols; }).length;
      var clash = mv.some(function (q2) { var o2 = own[q2[0] + ',' + q2[1]]; return o2 != null && o2 !== b; });
      if (outside >= 1 && outside <= 2 && !clash) { var l2 = base.map(function (pc) { return { p: pc.p, cells: pc.cells.slice() }; }); l2[b].cells = mv; return { kind: kind, list: l2, pad: pad }; }
    }
    return null;
  }

  /* ================= the hole: three shapes, each student gets one of 3 versions of each ================= */
  /* walk around the hole clockwise (on the screen) with the given inside angles; the last two sides close it up */
  function build(A, L) {
    var n = A.length, H = [0], P = [[0, 0]], i;
    for (i = 1; i < n; i++) H[i] = H[i - 1] + (180 - A[i]);
    for (i = 0; i < n - 2; i++) P.push([P[i][0] + L[i] * Math.cos(H[i] * D2R), P[i][1] + L[i] * Math.sin(H[i] * D2R)]);
    var d1 = [Math.cos(H[n - 2] * D2R), Math.sin(H[n - 2] * D2R)], d2 = [Math.cos(H[n - 1] * D2R), Math.sin(H[n - 1] * D2R)], q = P[n - 2], rx = -q[0], ry = -q[1];
    var det = d1[0] * d2[1] - d1[1] * d2[0], a = (rx * d2[1] - ry * d2[0]) / det;
    P.push([q[0] + a * d1[0], q[1] + a * d1[1]]);
    return P;
  }
  var SHAPES = {
    dogleg: { name: 'The Dogleg', blurb: 'A long fairway that bends near the cup', n: 6,
      V: [{ t: 50, f: 15, L: [12, 7, 4, 5] }, { t: 44, f: 21, L: [11.5, 7.5, 4.2, 5.6] }, { t: 56, f: 12, L: [12.5, 6.5, 4.2, 4.4] }],
      A: function (p) { return [90, 180 - p.t, 90 + p.f, 90 - p.f, 180 + p.t, 90]; }, tee: 5, cup: 2 },
    fish: { name: 'The Fishtail', blurb: 'A straight run to a cup tucked into a V-shaped notch', n: 5,
      V: [{ s: 10, a: 60, b: 65, L: [16, 5, 4] }, { s: 14, a: 55, b: 71, L: [15, 5.4, 4.6] }, { s: 7, a: 63, b: 57, L: [16.5, 4.6, 5] }],
      A: function (p) { return [90 + p.s, p.a, 360 - p.a - p.b, p.b, 90 - p.s]; }, tee: 4, cup: -2 },
    boom: { name: 'The Boomerang', blurb: 'Out along one arm, around the tip and back down the other', n: 6,
      V: [{ t: 68, f: 12, L: [15, 13, 4.2, 6.6] }, { t: 74, f: 16, L: [15.5, 13, 4.2, 6.8] }, { t: 62, f: 9, L: [14.5, 13.5, 4.4, 7.4] }],
      A: function (p) { return [90, p.t, 90 + p.f, 90 - p.f, 360 - p.t, 90]; }, tee: 5, cup: 2 }
  };
  var SHAPE_IDS = ['dogleg', 'fish', 'boom'];
  var LET = 'ABCDEFGH';
  function geoFrom(A, L) {
    var pts = build(A, L), n = pts.length;
    var mx = Math.min.apply(null, pts.map(function (p) { return p[0]; })), my = Math.min.apply(null, pts.map(function (p) { return p[1]; }));
    pts = pts.map(function (p) { return [p[0] - mx, p[1] - my]; });
    var cs = pts.map(function (v, i) {
      var nx = pts[(i + 1) % n], pv = pts[(i + n - 1) % n];
      return { L: LET[i], i: i, x: v[0], y: v[1], A: A[i], type: typeOf(A[i]), dn: Math.atan2(nx[1] - v[1], nx[0] - v[0]) * R2D, dp: Math.atan2(pv[1] - v[1], pv[0] - v[0]) * R2D };
    });
    return { pts: pts, n: n, A: A, corners: cs, W: Math.max.apply(null, pts.map(function (p) { return p[0]; })), H: Math.max.apply(null, pts.map(function (p) { return p[1]; })) };
  }
  function inward(G, side, d) { var a = G.pts[side], b = G.pts[(side + 1) % G.n], len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len; return [(a[0] + b[0]) / 2 - uy * d, (a[1] + b[1]) / 2 + ux * d]; }
  function bis(cn) { var x = Math.cos(cn.dn * D2R) + Math.cos(cn.dp * D2R), y = Math.sin(cn.dn * D2R) + Math.sin(cn.dp * D2R), l = Math.hypot(x, y) || 1; return [x / l, y / l]; } // points into the smaller angle
  function geo(c, id) {
    id = id || c.get('shape'); var S = SHAPES[id]; if (!S) return null;
    var vi = hv(c, 'v' + id) % S.V.length, p = S.V[vi], G = geoFrom(S.A(p), p.L);
    G.id = id; G.S = S; G.vi = vi;
    G.tee = inward(G, S.tee, 1.5);
    if (S.cup >= 0) G.cup = inward(G, S.cup, 1.8); else { var cn = G.corners[-S.cup], b = bis(cn); G.cup = [cn.x - b[0] * 2.6, cn.y - b[1] * 2.6]; }
    G.reflex = G.corners.filter(function (k) { return k.type === 'reflex'; })[0];
    G.gap = G.pts[G.n - 1][1] - G.pts[0][1]; // the tee stretch: top rail (side 0) and bottom rail (side n − 2) are parallel
    return G;
  }

  /* ================= drawings ================= */
  var UID = 0;
  function arcD(cx, cy, r, a1, a2) { var sw = norm(a2 - a1); if (sw < 0.01) return ''; var s = [cx + r * Math.cos(a1 * D2R), cy + r * Math.sin(a1 * D2R)], e = [cx + r * Math.cos(a2 * D2R), cy + r * Math.sin(a2 * D2R)]; return 'M' + s[0].toFixed(1) + ' ' + s[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (sw > 180 ? 1 : 0) + ' 1 ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1); }
  function line(a, b, cls, extra) { return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"' + (cls ? ' class="' + cls + '"' : '') + (extra || '') + '/>'; }
  function txt(x, y, t, cls, extra) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"' + (cls === '' ? '' : ' class="' + (cls || 'pj-u5-t') + '"') + (extra || '') + '>' + t + '</text>'; }
  function flagSvg(x, y, s, col) { return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (0.3 * s).toFixed(1) + '" fill="#111" stroke="#fff" stroke-width="1.5"/>' + line([x, y], [x, y - 1.25 * s], '', ' stroke="#334155" stroke-width="2"') + '<path d="M' + x.toFixed(1) + ' ' + (y - 1.25 * s).toFixed(1) + ' l' + (0.75 * s).toFixed(1) + ' ' + (0.22 * s).toFixed(1) + ' l' + (-0.75 * s).toFixed(1) + ' ' + (0.22 * s).toFixed(1) + 'z" fill="' + (col || '#dc2626') + '"/>'; }
  /* the hole on a grid. o: { S: px per ft, pad, color, labels: 'letters' | 'angles' | 'none', vals: { A: '90°' }, arcs, small, extra(X, Y, S) } */
  function holeSvg(G, o) {
    o = o || {}; var S = o.S || 38, pad = o.pad == null ? 58 : o.pad, Wp = G.W * S + 2 * pad, Hp = G.H * S + 2 * pad, id = 'u5h' + (++UID), small = !!o.small;
    function X(x) { return pad + x * S; } function Y(y) { return pad + y * S; }
    var col = o.color || CARPETS[0][0], poly = G.pts.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ');
    var s = '<svg class="pj-u5-svg pj-u5-hole' + (small ? ' sm' : '') + (o.cls ? ' ' + o.cls : '') + '" viewBox="0 0 ' + Wp.toFixed(0) + ' ' + Hp.toFixed(0) + '" role="img" aria-label="' + esc(o.aria || 'Your mini-golf hole drawn on a grid') + '">';
    if (!small && o.grid !== false) s += '<defs><pattern id="' + id + 'g" width="' + S + '" height="' + S + '" patternUnits="userSpaceOnUse" x="' + pad + '" y="' + pad + '"><path d="M' + S + ' 0H0V' + S + '" fill="none" stroke="#dbe4ee" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#' + id + 'g)"/>';
    s += '<polygon points="' + poly + '" fill="' + esc(col) + '"/>';
    if (!small) s += '<polygon points="' + poly + '" fill="url(#u5turf)" opacity=".22"/>';
    s += '<polygon points="' + poly + '" fill="none" stroke="#8a5a2b" stroke-width="' + (small ? 2.5 : Math.max(5, 0.24 * S)).toFixed(1) + '" stroke-linejoin="miter" stroke-miterlimit="20"/>';
    if (!small && o.arcs !== false) G.corners.forEach(function (cn) { var r = (cn.type === 'reflex' ? 0.62 : 0.78) * S; s += '<path d="' + arcD(X(cn.x), Y(cn.y), r, cn.dn, cn.dp) + '" class="pj-u5-arc' + (cn.type === 'reflex' ? ' rfx' : '') + '"/>'; if (cn.type === 'right') { var u = [Math.cos(cn.dn * D2R), Math.sin(cn.dn * D2R)], v = [Math.cos(cn.dp * D2R), Math.sin(cn.dp * D2R)], q = 0.42 * S; s += '<path d="M' + (X(cn.x) + u[0] * q).toFixed(1) + ' ' + (Y(cn.y) + u[1] * q).toFixed(1) + ' l' + (v[0] * q).toFixed(1) + ' ' + (v[1] * q).toFixed(1) + ' l' + (-u[0] * q).toFixed(1) + ' ' + (-u[1] * q).toFixed(1) + '" class="pj-u5-sq"/>'; } });
    // tee mat and the cup
    var tx = X(G.tee[0]), ty = Y(G.tee[1]);
    s += '<rect x="' + (tx - 0.75 * S).toFixed(1) + '" y="' + (ty - 0.55 * S).toFixed(1) + '" width="' + (1.5 * S).toFixed(1) + '" height="' + (1.1 * S).toFixed(1) + '" rx="' + (0.18 * S).toFixed(1) + '" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.85)" stroke-width="' + (small ? 1 : 2) + '"/>';
    if (!small) s += txt(tx, ty + 4, 'TEE', 'pj-u5-tee');
    s += flagSvg(X(G.cup[0]), Y(G.cup[1]), small ? S * 1.2 : S, o.flag);
    if (o.extra) s += o.extra(X, Y, S);
    if (!small && o.labels !== 'none') G.corners.forEach(function (cn) {
      var b = bis(cn), out = cn.type === 'reflex' ? 1 : -1, d = (o.labels === 'angles' ? 1.05 : 0.78) * S + 6, lx = X(cn.x) + out * b[0] * d, ly = Y(cn.y) + out * b[1] * d;
      if (o.labels === 'angles') { var v = (o.vals || {})[cn.L]; s += '<g class="pj-u5-cl ang"><rect x="' + (lx - 33).toFixed(1) + '" y="' + (ly - 13).toFixed(1) + '" width="66" height="25" rx="12"/>' + txt(lx, ly + 5, '<tspan class="l">' + cn.L + '</tspan> ' + esc(v || '?'), '') + '</g>'; }
      else s += '<g class="pj-u5-cl"><circle cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="13"/>' + txt(lx, ly + 5, cn.L, '') + '</g>';
    });
    return { svg: s + '</svg>', X: X, Y: Y, S: S, W: Wp, H: Hp };
  }
  /* shared defs (a turf texture) — one hidden svg per page */
  function ensureDefs() {
    if (!hasDoc || document.getElementById('u5-defs')) return;
    var d = document.createElement('div'); d.id = 'u5-defs'; d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0" aria-hidden="true"><defs><pattern id="u5turf" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M2 3l1 -2M7 8l1 -2M5 5l-1 -2" stroke="#fff" stroke-width="1"/></pattern></defs></svg>';
    document.body.appendChild(d);
  }

  /* ---- the protractor (180°, school style: outer scale 0 on the left, inner grey scale 0 on the right) ---- */
  var PR = 160;
  function protStr(R, o) {
    o = o || {}; R = R || PR;
    var s = '<path class="pj-u5-pbody" d="M' + (-R) + ' 0 A' + R + ' ' + R + ' 0 0 1 ' + R + ' 0 Z"/><path class="pj-u5-pwin" d="M' + (-(R - 62)) + ' 0 A' + (R - 62) + ' ' + (R - 62) + ' 0 0 1 ' + (R - 62) + ' 0"/>';
    var tk = '';
    for (var d = 0; d <= 180; d++) { var len = d % 10 === 0 ? 15 : d % 5 === 0 ? 10 : 6, c1 = Math.cos(d * D2R), s1 = -Math.sin(d * D2R); tk += 'M' + (R * c1).toFixed(1) + ' ' + (R * s1).toFixed(1) + 'L' + ((R - len) * c1).toFixed(1) + ' ' + ((R - len) * s1).toFixed(1); }
    s += '<path class="pj-u5-ptick" d="' + tk + '"/>';
    for (var e = 0; e <= 180; e += 10) {
      var c2 = Math.cos(e * D2R), s2 = -Math.sin(e * D2R), rot = 90 - e;
      s += '<text class="pj-u5-pout' + (o.hi === 'out' ? ' hi' : '') + '" transform="translate(' + ((R - 27) * c2).toFixed(1) + ' ' + ((R - 27) * s2).toFixed(1) + ') rotate(' + rot + ')">' + (180 - e) + '</text>';
      s += '<text class="pj-u5-pinr' + (o.hi === 'in' ? ' hi' : '') + '" transform="translate(' + ((R - 45) * c2).toFixed(1) + ' ' + ((R - 45) * s2).toFixed(1) + ') rotate(' + rot + ')">' + e + '</text>';
    }
    s += '<path class="pj-u5-pbase" d="M' + (-R) + ' 0H' + R + 'M0 0V-18"/><circle class="pj-u5-pc" r="3.5"/>';
    return s;
  }
  function protAt(x, y, rot, o) { return '<g class="pj-u5-prot static" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot.toFixed(1) + ')">' + protStr(o && o.R, o) + '</g>'; }
  var PROT = {};
  /* a protractor you can drag onto the drawing and turn. o: { pts: [{ x, y, dirs }], start: { x, y, rot }, R } */
  function attachProt(svg, key, o) {
    if (!svg || !svg.getScreenCTM) return null;
    var R = o.R || PR, st = PROT[key] || (PROT[key] = { x: o.start.x, y: o.start.y, rot: o.start.rot || 0 });
    var vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { width: 800, height: 600 };
    function pl() { return typeof o.pts === 'function' ? o.pts() : (o.pts || []); }
    var ext = document.createElementNS(NS, 'g'); ext.setAttribute('class', 'pj-u5-ext'); svg.appendChild(ext);
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pj-u5-prot'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'application');
    g.setAttribute('aria-label', 'Protractor. Drag it to move it; drag the round handle to turn it. Arrow keys move it, [ and ] turn it.');
    var KN = '<circle r="15"/><path d="M-6 -4a7 7 0 1 1 1 9" /><path d="M-9 -6l3 3 3 -4" />';
    g.innerHTML = protStr(R) + '<g class="pj-u5-knob r" transform="translate(' + (R + 18) + ' 0)">' + KN + '</g><g class="pj-u5-knob l" transform="translate(' + (-R - 18) + ' 0) rotate(180)">' + KN + '</g>';
    svg.appendChild(g);
    function at() { var hit = null; pl().forEach(function (p) { if (Math.abs(p.x - st.x) < 0.6 && Math.abs(p.y - st.y) < 0.6) hit = p; }); return hit; }
    function draw() {
      g.setAttribute('transform', 'translate(' + st.x.toFixed(1) + ' ' + st.y.toFixed(1) + ') rotate(' + st.rot.toFixed(1) + ')');
      var p = at(), h = '';
      if (p) (p.dirs || []).forEach(function (d) { h += line([p.x, p.y], [p.x + Math.cos(d * D2R) * (R + 40), p.y + Math.sin(d * D2R) * (R + 40)]); });
      ext.innerHTML = h; g.classList.toggle('on', !!p); svg.classList.toggle('pj-u5-hasp', !!p);
    }
    function snapMove(x, y) {
      var best = null, bd = 22; pl().forEach(function (p) { var d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } });
      st.x = best ? best.x : Math.max(0, Math.min(vb.width, x)); st.y = best ? best.y : Math.max(0, Math.min(vb.height, y));
    }
    function snapRot(r) {
      var p = at(), out = Math.round(norm(r));
      if (p) (p.dirs || []).forEach(function (d) { [d, d + 180].forEach(function (cd) { if (adiff(r, cd) < 5) out = norm(cd); }); });
      st.rot = out;
    }
    function pt(e) { var m = svg.getScreenCTM(); if (!m) return null; var q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); }
    var mode = null, off = null, side = 0;
    g.addEventListener('pointerdown', function (e) { var q = pt(e); if (!q) return; e.preventDefault(); var kn = e.target.closest && e.target.closest('.pj-u5-knob'); mode = kn ? 'rot' : 'move'; side = kn && kn.classList.contains('l') ? 180 : 0; off = { x: q.x - st.x, y: q.y - st.y }; try { g.setPointerCapture(e.pointerId); } catch (x) {} g.classList.add('drag'); });
    g.addEventListener('pointermove', function (e) {
      if (!mode) return; var q = pt(e); if (!q) return; e.preventDefault();
      if (mode === 'move') snapMove(q.x - off.x, q.y - off.y); else snapRot(Math.atan2(q.y - st.y, q.x - st.x) * R2D + side);
      draw();
    });
    function end() { mode = null; g.classList.remove('drag'); }
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end); g.addEventListener('lostpointercapture', end);
    g.addEventListener('keydown', function (e) {
      var k = e.key, big = e.shiftKey ? 10 : 2, used = true;
      if (k === 'ArrowLeft') snapMove(st.x - big, st.y); else if (k === 'ArrowRight') snapMove(st.x + big, st.y); else if (k === 'ArrowUp') snapMove(st.x, st.y - big); else if (k === 'ArrowDown') snapMove(st.x, st.y + big);
      else if (k === ']' || k === '}') st.rot = norm(st.rot + (e.shiftKey || k === '}' ? 15 : 1)); else if (k === '[' || k === '{') st.rot = norm(st.rot - (e.shiftKey || k === '{' ? 15 : 1)); else used = false;
      if (used) { e.preventDefault(); draw(); }
    });
    draw();
    var bar = el('div', 'pj-u5-ptools');
    bar.appendChild(el('span', 'pj-u5-ptip', '<b>Protractor:</b> drag it by its body · drag a round handle to turn it'));
    [['↺ 15°', -15], ['↺ 1°', -1], ['↻ 1°', 1], ['↻ 15°', 15], ['Turn over (180°)', 180]].forEach(function (b) {
      var bt = el('button', 'btn btn-ghost btn-small', b[0]); bt.type = 'button'; bt.addEventListener('click', function () { st.rot = norm(st.rot + b[1]); draw(); }); bar.appendChild(bt);
    });
    var rs = el('button', 'btn btn-ghost btn-small', 'Put it back'); rs.type = 'button'; rs.addEventListener('click', function () { st.x = o.start.x; st.y = o.start.y; st.rot = o.start.rot || 0; draw(); }); bar.appendChild(rs);
    return { bar: bar, state: st, draw: draw };
  }
  /* a drawing with a protractor: html → a box; pts in the drawing's own units */
  function protBox(c, key, svgHtml, o) {
    var w = el('div', 'pj-u5-draw' + (o && o.cls ? ' ' + o.cls : ''), svgHtml);
    if (!c.ro && hasDoc) { ensureDefs(); var svg = w.querySelector('svg'); setTimeout(function () { if (!svg.isConnected) return; var P = attachProt(svg, key, o); if (P) w.appendChild(P.bar); }, 0); }
    return w;
  }

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function inA(c, k, o) { o = o || {}; var w = c.input(k, { kind: 'num', ph: o.ph || '', aria: o.aria || k, cls: 'pj-u5-in' }); w.appendChild(el('span', 'pj-post', o.unit == null ? '°' : o.unit)); return w; }
  function grid(box, cls) { var g = el('div', 'pj-grid3 pj-u5-row' + (cls ? ' ' + cls : '')); box.appendChild(g); return g; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function chip(h) { return '<div class="pj-x-chip">' + h + '</div>'; }
  function eq(left, right, unit, delay) { return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="num"' + (delay ? ' data-delay="' + delay + '"' : '') + '>' + fx(right, 1) + '</span>' + (unit == null ? '°' : unit) + '</b></div>'; }
  function tip(h) { return el('p', 'pj-tip', h); }

  PJ.golf = { THEMES: THEMES, SHAPES: SHAPES, PENT: PENT, ORI: ORI, orient: orient, shapeOf: shapeOf, grabCell: grabCell, tilePad: tilePad, padOf: padOf, tileState: tileState, errTiling: errTiling, build: build, geoFrom: geoFrom, geo: geo, pa: pa, b3: b3, typeOf: typeOf, norm: norm, PROT: PROT };
  /* ================= Dev's hole (the worked examples): Moose Meadows Mini-Golf, Sylvan Lake ================= */
  var DEV = geoFrom([90, 115, 65, 205, 65], [14, 5, 6]);
  DEV.tee = inward(DEV, 4, 1.4); DEV.cup = (function () { var cn = DEV.corners[3], b = bis(cn); return [cn.x - b[0] * 2.4, cn.y - b[1] * 2.4]; })();
  function devSvg(o) { return holeSvg(DEV, Object.assign({ S: 30, pad: 46, color: '#2a9d8f', aria: 'Dev’s hole, The Aurora Arc, on a grid' }, o || {})); }

  /* ================= Checkpoint 1: your hole — theme, name and shape ================= */
  var cp1 = {
    id: 'hole', title: 'Design your hole', needs: [], graded: false,
    goal: 'Pick a <b>theme</b>, give your hole a <b>name</b>, and choose its <b>shape</b>. Every designer gets their own corners, so your angles won’t match a friend’s.',
    example: { title: 'Dev designs a hole at Moose Meadows', scene: '<div class="pj-u5-exwrap">' + devSvg().svg + '</div>', steps: [
      { cap: 'Dev is designing Hole 4 for the new <b>Moose Meadows Mini-Golf</b> in Sylvan Lake. First, a <b>theme</b>: he picks Northern Lights.', html: '<div class="pj-x-types"><span>🚜 Farm</span><span class="on">🌌 Northern Lights</span><span>🦖 Dinos</span></div>' },
      { cap: 'Next, a <b>name</b> players will remember.', html: chip('Hole 4: <b><span class="pj-type">The Aurora Arc</span></b>') },
      { cap: 'Last, the <b>shape</b>. Dev’s hole has <b>5 corners</b>, lettered A to E. The border boards meet at each corner — and every corner is an <b>angle</b> to measure. That’s Checkpoint 2.', html: chip('5 corners: A, B, C, D, E') }] },
    render: function (box, c) {
      var C0 = course(c);
      box.appendChild(el('div', 'pj-u5-brief', '<span class="pj-u5-bi">⛳</span><div><b>The ' + esc(C0.town) + ' Summer Fair</b> is building a 9-hole mini-golf course, and you’re designing <b>Hole ' + C0.hole + '</b>. Fair-goers will play it all summer!</div>'));
      part(box, 'A', 'Pick a theme', 'It decides your obstacles. You can change it later.');
      box.appendChild(c.choice('theme', THEME_IDS.map(function (k) { var t = THEMES[k]; return { v: k, html: '<span class="pj-ti">' + t.icon + '</span><b>' + t.name + '</b><small>' + t.blurb + '</small>' }; }), { cls: 'pj-types pj-u5-themes', aria: 'Theme', onPick: function () { c.redraw(); } }));
      var t = theme(c); if (!t) return;
      part(box, 'B', 'Name your hole', 'Make it fun to say.');
      box.appendChild(c.text('holeName', { ph: 'e.g. ' + t.names[0], max: 28, aria: 'Hole name', cls: 'pj-u5-name' }));
      var ideas = el('div', 'pj-ideas', '<span>Need an idea?</span>'); t.names.forEach(function (n) { var b = el('button', 'pj-idea', esc(n)); b.type = 'button'; if (c.ro) b.disabled = true; b.addEventListener('click', function () { c.set('holeName', n); c.redraw(); }); ideas.appendChild(b); }); box.appendChild(ideas);
      part(box, 'C', 'Pick a shape', 'Each shape has a different set of corners.');
      box.appendChild(c.choice('shape', SHAPE_IDS.map(function (id) { var G = geo(c, id); return { v: id, html: '<span class="pj-u5-thumb">' + holeSvg(G, { small: true, S: 9, pad: 6, color: carpet(c) }).svg + '</span><b>' + esc(G.S.name) + '</b><small>' + esc(G.S.blurb) + ' · ' + G.n + ' corners</small>' }; }), { cls: 'pj-types pj-u5-shapes', aria: 'Hole shape', onPick: function () { c.redraw(); } }));
      part(box, 'D', 'Carpet colour', '');
      box.appendChild(c.choice('carpet', CARPETS.map(function (x) { return { v: x[0], html: '<i style="background:' + x[0] + '"></i>' + x[1], title: x[1] }; }), { cls: 'pj-swatches', aria: 'Carpet colour', onPick: function () { c.redraw(); } }));
      var G = geo(c); if (!G) return;
      var w = el('div', 'pj-u5-plan');
      w.appendChild(el('div', 'pj-u5-plan-h', '<span>' + t.icon + '</span><div><small>Hole ' + C0.hole + ' · ' + esc(C0.town) + ' Summer Fair</small><b>' + esc(holeName(c)) + '</b></div><em>' + esc(G.S.name) + ' · ' + G.n + ' corners · 1 square = 1 ft</em>'));
      w.appendChild(el('div', 'pj-u5-draw', holeSvg(G, { color: carpet(c), flag: t.ob }).svg));
      box.appendChild(w);
    },
    check: function (c) {
      var out = [c.msg(!!theme(c), 'Pick a theme (Part A).')]; if (!theme(c)) return out;
      out.push(c.need('holeName', { min: 2, label: 'Hole name', hint: 'Give your hole a name.' }));
      out.push(c.msg(!!geo(c), 'Pick a shape for your hole (Part C).'));
      out.push(c.msg(!!c.get('carpet'), 'Pick a carpet colour (Part D).'));
      return out;
    },
    solve: function (c) { if (!c.get('theme')) c.set('theme', 'farm'); if (!c.get('shape')) c.set('shape', 'dogleg'); if (!c.get('carpet')) c.set('carpet', CARPETS[0][0]); c.set('holeName', theme(c).names[0]); }
  };

  /* ================= Checkpoint 2: measure the corners ================= */
  function cornerPts(G, H) { return G.corners.map(function (cn) { return { x: H.X(cn.x), y: H.Y(cn.y), dirs: [cn.dn, cn.dp] }; }); }
  var TYPE_HINT = {
    acute: 'Acute angles are <b>less than 90°</b> — sharper than the corner of a sheet of paper.',
    right: 'A right angle is <b>exactly 90°</b>, a square corner.',
    obtuse: 'Obtuse angles are <b>between 90° and 180°</b> — wider than a square corner.',
    straight: 'A straight angle is <b>180°</b>, a flat line. That isn’t really a corner!',
    reflex: 'Reflex angles are <b>more than 180°</b>: the inside of the hole bends <b>in</b> at that corner.'
  };
  var cp2 = {
    id: 'corners', title: 'Measure the corners', needs: ['u5l3'],
    goal: 'Measure every corner of your hole with the protractor, <b>classify</b> it (acute, right, obtuse, reflex), and check your work with the angle-sum rule.',
    example: { title: 'Dev measures the corners of The Aurora Arc', scene: '<div class="pj-u5-exwrap">' + (function () { var H = devSvg(), B = DEV.corners[1]; return H.svg.replace('</svg>', protAt(H.X(B.x), H.Y(B.y), B.dp, { R: 150, hi: 'in' }) + '</svg>'); })() + '</div>', steps: [
      { cap: '<b>Step 1:</b> put the protractor’s centre (the little dot) right on the corner’s <b>vertex</b>. Dev starts with corner <b>B</b>.', html: chip('Centre on the vertex B') },
      { cap: '<b>Step 2:</b> turn the protractor so its <b>0 line</b> lies along one arm (here, the board from B to A).', html: chip('0 line on arm BA') },
      { cap: '<b>Step 3:</b> read the scale that <b>starts at 0 on that arm</b> — the inner scale here. It reads 115°.', html: eq('∠B', 115) },
      { cap: '<b>Check:</b> B is wider than a square corner, so it must be <b>obtuse</b>. 115° makes sense; the other scale’s 65° would be acute. Wrong!', html: chip('115° → <b>obtuse</b> (90° to 180°)') },
      { cap: 'Corner D bends <b>in</b>. A protractor only reads up to 180°, so Dev measures the <b>outside</b>: 155°. The inside is a <b>reflex</b> angle: 360° − 155°.', html: eq('∠D = 360° − 155°', 205) },
      { cap: '<b>Angle-sum check:</b> a shape with n corners splits into n − 2 triangles, so its angles add to (n − 2) × 180°. Dev’s 5 corners: (5 − 2) × 180° = 540°. And 90 + 115 + 65 + 205 + 65 = 540 ✓', html: eq('(5 − 2) × 180°', 540) }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'Measure with the protractor', 'Drag the protractor onto a corner — it clicks onto the vertex. Turn it so the 0 line sits on one board, then read the scale that starts at 0 on that board.');
      var H = holeSvg(G, { color: carpet(c), flag: (theme(c) || {}).ob });
      box.appendChild(protBox(c, 'cp2|' + G.id + G.vi, H.svg, { pts: cornerPts(G, H), start: { x: H.W / 2, y: H.H - 6, rot: 0 } }));
      part(box, 'B', 'Every corner', 'The inside angle of each corner (the arc shows which angle), and its type.');
      var tb = el('div', 'pj-u5-tbl');
      tb.appendChild(el('div', 'pj-u5-th', '<span>Corner</span><span>Inside angle</span><span>Type</span>'));
      G.corners.forEach(function (cn) {
        var r = el('div', 'pj-u5-tr'); r.appendChild(el('div', 'pj-u5-tl', '<span class="pj-u5-dot">' + cn.L + '</span>'));
        r.appendChild(inA(c, 'ang.' + cn.L, { aria: 'Angle ' + cn.L })); r.appendChild(c.select('typ.' + cn.L, TYPES, { aria: 'Type of angle ' + cn.L, ph: 'Choose a type…' }));
        tb.appendChild(r);
      });
      box.appendChild(tb);
      part(box, 'C', 'The reflex corner', 'One corner of your hole bends in. A protractor can’t read more than 180°, so measure the <b>outside</b> of that corner and subtract from 360°.');
      var g = grid(box);
      g.appendChild(field('Which corner is reflex?', c.choice('rfx.which', G.corners.map(function (cn) { return { v: cn.L, html: cn.L }; }), { cls: 'pj-seg pj-seg-sm', aria: 'Reflex corner' })));
      g.appendChild(field('The protractor reads (outside)', inA(c, 'rfx.read', { aria: 'Outside angle of the reflex corner' })));
      part(box, 'D', 'Check with the angle-sum rule', 'Your hole has <b>' + G.n + ' corners</b>.');
      var g2 = grid(box);
      g2.appendChild(field('Add up your ' + G.n + ' angles from Part B', inA(c, 'sum', { aria: 'Sum of your angles' })));
      g2.appendChild(field('(n − 2) × 180° for n = ' + G.n, inA(c, 'rule', { aria: 'Angle-sum rule' })));
      box.appendChild(tip('If your sum and the rule are more than a few degrees apart, one of your corners is off. Measure again!'));
    },
    check: function (c) {
      var G = geo(c); if (!G) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [];
      G.corners.forEach(function (cn) {
        var A = cn.A, w = [];
        if (cn.type === 'reflex') w.push({ v: 360 - A, tol: 2, hint: 'That’s the <b>outside</b> of corner ' + cn.L + '. The inside bends past a straight line: 360° − ' + fx(360 - A, 0) + '°.' }, { v: A - 180, tol: 2, hint: 'Corner ' + cn.L + ' bends <b>in</b>: it’s more than 180°. Measure the outside, then subtract from 360°.' });
        else if (Math.abs(180 - 2 * A) > 4) w.push({ v: 180 - A, tol: 2, hint: 'You read the <b>other scale</b>. Use the scale that starts at 0 on the arm your 0 line sits on. Check: corner ' + cn.L + ' looks ' + (A < 90 ? 'sharper' : 'wider') + ' than a square corner.' });
        out.push(angR(c, 'ang.' + cn.L, A, { tol: 2, label: 'Corner ' + cn.L, wrong: w, hint: 'Centre on vertex ' + cn.L + ', 0 line on one board, and read the scale that starts at 0 on that board.', hint2: 'Corner ' + cn.L + ' is ' + (cn.type === 'reflex' ? 'reflex (more than 180°)' : cn.type === 'right' ? 'a right angle' : cn.type + ' (' + (cn.type === 'acute' ? 'less than 90°' : 'between 90° and 180°') + ')') + '. Measure it again carefully.' }));
        var x = mine(c, 'ang.' + cn.L, NaN), wm = {};
        TYPES.forEach(function (T) { if (T.v !== cn.type) wm[T.v] = (!isNaN(x) && typeOf(x) === cn.type ? 'You measured ' + fx(x, 1) + '°. ' : '') + TYPE_HINT[T.v] + ' Is corner ' + cn.L + ' like that?'; });
        out.push(c.equals('typ.' + cn.L, cn.type, { label: 'Type of ' + cn.L, wrong: wm }));
      });
      var R = G.reflex, wr = {}; G.corners.forEach(function (cn) { if (cn !== R) wr[cn.L] = 'At a reflex corner the boards bend <b>into</b> the hole, and the inside angle is more than a straight line. Corner ' + cn.L + ' doesn’t do that.'; });
      out.push(c.equals('rfx.which', R.L, { label: 'Reflex corner', wrong: wr }));
      out.push(angR(c, 'rfx.read', 360 - R.A, { tol: 2, label: 'Outside angle', wrong: [{ v: R.A, tol: 2, hint: 'A protractor can’t read more than 180°. Put it on the <b>outside</b> of corner ' + R.L + ' and read that angle.' }, { v: R.A - 180, tol: 2, hint: 'You read the other scale. Start at 0 on the board your 0 line sits on.' }], hint: 'Centre on ' + R.L + ', 0 line along one board, and measure the angle <b>outside</b> the hole.' }));
      var own = G.corners.map(function (cn) { return mine(c, 'ang.' + cn.L, cn.A); }), sum = own.reduce(function (a, b) { return a + b; }, 0), n = G.n;
      out.push(angR(c, 'sum', sum, { tol: 0.6, label: 'Your sum', hint: 'Add the ' + n + ' inside angles from Part B.', hint2: own.map(function (x) { return fx(x, 1); }).join(' + ') }));
      out.push(angR(c, 'rule', (n - 2) * 180, { label: 'Angle-sum rule', wrong: [{ v: n * 180, hint: 'From one corner, a shape with ' + n + ' corners splits into <b>' + (n - 2) + '</b> triangles, not ' + n + '. Use (n − 2) × 180°.' }, { v: (n - 1) * 180, hint: 'Use (n − 2) × 180°: ' + n + ' − 2 = ' + (n - 2) + ' triangles.' }, { v: 360, hint: '360° is the sum for 4 corners. Your hole has ' + n + '.' }], hint: 'Angle sum = (n − 2) × 180°, with n = ' + n + '.' }));
      return out;
    },
    solve: function (c) {
      var G = geo(c), s = 0;
      G.corners.forEach(function (cn) { c.set('ang.' + cn.L, String(cn.A)); c.set('typ.' + cn.L, cn.type); s += cn.A; });
      c.set('rfx.which', G.reflex.L); c.set('rfx.read', String(360 - G.reflex.A)); c.set('sum', String(s)); c.set('rule', String((G.n - 2) * 180));
    }
  };

  /* ================= Checkpoint 3: estimate, then aim a bank shot ================= */
  var BANK = [[20, 2, 2.5], [24, 2.5, 3], [28, 3, 3], [31, 3, 3.5], [33, 3.5, 3], [42, 4, 4.5], [44, 4.5, 4], [47, 5, 4.5]];
  var REFS = [22.5, 30, 45, 60, 90], BALL = 0.17;
  function nearRef(a) { var b = REFS[0]; REFS.forEach(function (r) { if (Math.abs(r - a) < Math.abs(b - a)) b = r; }); return b; }
  function dseg(p, a, b) { var vx = b[0] - a[0], vy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - a[0] - t * vx, p[1] - a[1] - t * vy); }
  /* the wall is the top rail (y = 0); the ball and the cup are below it; the angle with the wall is a */
  function bankOf(a, yb, yc) {
    var ct = 1 / Math.tan(a * D2R), xb = 2.2, bx = xb + yb * ct, xc = bx + yc * ct, M = [(xb + xc) / 2, (yb + yc) / 2];
    var clear = Math.min(dseg(M, [xb, yb], [bx, 0]), dseg(M, [bx, 0], [xc, yc]));
    return { a: a, yb: yb, yc: yc, xb: xb, bx: bx, xc: xc, W: xc + 2.4, H: Math.max(yb, yc) + 1.6, M: M, r: Math.max(0.45, Math.min(1.3, clear - 0.55)), clear: clear };
  }
  function bank(c) { var b = BANK[hv(c, 'bank') % BANK.length]; return bankOf(b[0], b[1], b[2]); }
  function hitCircle(p, q, C, r) {
    var dx = q[0] - p[0], dy = q[1] - p[1], fx0 = p[0] - C[0], fy0 = p[1] - C[1], A = dx * dx + dy * dy, B2 = 2 * (fx0 * dx + fy0 * dy), C2 = fx0 * fx0 + fy0 * fy0 - r * r, disc = B2 * B2 - 4 * A * C2;
    if (disc < 0 || !A) return null; var t = (-B2 - Math.sqrt(disc)) / (2 * A); return t >= 0 && t <= 1 ? t : null;
  }
  /* where a putt at angle al (with the wall) goes: { pts, sunk, kind: cup | obstacle | end | steep | flat } */
  function aimPath(B, al) {
    var s = Math.sin(al * D2R), co = Math.cos(al * D2R), ball = [B.xb, B.yb], R = B.r + BALL, out = { pts: [ball], sunk: false, kind: '' };
    var hitX = B.xb + B.yb * co / s, p1 = [hitX, 0];
    if (hitX > B.W - BALL) p1 = [B.W - BALL, Math.max(0, B.yb - (B.W - BALL - B.xb) * s / co)];
    var t = hitCircle(ball, p1, B.M, R);
    if (t != null) { out.pts.push([ball[0] + (p1[0] - ball[0]) * t, ball[1] + (p1[1] - ball[1]) * t]); out.kind = 'obstacle'; return out; }
    out.pts.push(p1); if (p1[1] > 0.001) { out.kind = 'end'; return out; }
    out.hit = p1;
    if (al === B.a) { out.pts.push([B.xc, B.yc]); out.sunk = true; out.kind = 'cup'; return out; }
    var x2 = hitX + B.yc * co / s, tt = Math.min((B.W - BALL - hitX) / co, (B.H - BALL) / s), p2 = [hitX + co * tt, s * tt], t2 = hitCircle(p1, p2, B.M, R);
    if (t2 != null) { p2 = [p1[0] + (p2[0] - p1[0]) * t2, p1[1] + (p2[1] - p1[1]) * t2]; out.kind = 'obstacle'; } else out.kind = x2 < B.xc ? 'steep' : 'flat';
    out.pts.push(p2); return out;
  }
  function bankSvg(B, o) {
    o = o || {}; var S = o.S || 40, pad = 24, top = pad + B.yc * S + 20, Wp = B.W * S + 2 * pad, Hp = top + B.H * S + pad, th = o.theme || THEMES.farm;
    function X(x) { return pad + x * S; } function Y(y) { return top + y * S; }
    var s = '<svg class="pj-u5-svg pj-u5-bank" viewBox="0 0 ' + Wp.toFixed(0) + ' ' + Hp.toFixed(0) + '" role="img" aria-label="' + esc(o.aria || 'A bank shot: the ball, the wall, an obstacle and the cup') + '">';
    s += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + (B.W * S).toFixed(1) + '" height="' + (B.H * S).toFixed(1) + '" fill="' + esc(o.color || CARPETS[0][0]) + '"/><rect x="' + X(0) + '" y="' + Y(0) + '" width="' + (B.W * S).toFixed(1) + '" height="' + (B.H * S).toFixed(1) + '" fill="url(#u5turf)" opacity=".2"/>';
    s += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + (B.W * S).toFixed(1) + '" height="' + (B.H * S).toFixed(1) + '" fill="none" stroke="#8a5a2b" stroke-width="9"/>';
    s += line([X(0) - 4, Y(0)], [X(B.W) + 4, Y(0)], 'pj-u5-wall') + txt(X(0.4), Y(0) - 10, 'THE WALL', 'pj-u5-wl', ' text-anchor="start"');
    if (o.mirror !== false) s += '<circle cx="' + X(B.xc).toFixed(1) + '" cy="' + Y(-B.yc).toFixed(1) + '" r="' + (0.3 * S).toFixed(1) + '" class="pj-u5-ghost"/>' + txt(X(B.xc) + 0.45 * S, Y(-B.yc) + 4, 'mirror cup', 'pj-u5-gl', ' text-anchor="start"');
    s += '<circle cx="' + X(B.M[0]).toFixed(1) + '" cy="' + Y(B.M[1]).toFixed(1) + '" r="' + (B.r * S).toFixed(1) + '" fill="' + th.ob + '" stroke="rgba(0,0,0,.35)" stroke-width="2"/>' + txt(X(B.M[0]), Y(B.M[1]) + B.r * S * 0.36, th.icon, 'pj-u5-emo', ' font-size="' + (B.r * S * 1.05).toFixed(0) + '"');
    s += flagSvg(X(B.xc), Y(B.yc), S, th.ob);
    s += '<g class="pj-u5-trace"></g><g class="pj-u5-aimg"></g>';
    if (o.ball !== false) s += '<circle class="pj-u5-ball" cx="' + X(B.xb).toFixed(1) + '" cy="' + Y(B.yb).toFixed(1) + '" r="' + (BALL * S + 2).toFixed(1) + '"/>';
    return { svg: s + '</svg>', X: X, Y: Y, S: S, W: Wp, H: Hp };
  }
  function polyD(H, pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + H.X(p[0]).toFixed(1) + ' ' + H.Y(p[1]).toFixed(1); }).join(' '); }
  /* the aiming tool: an arrow from the ball you turn (drag its tip or use the buttons), then Putt! */
  function aimTool(c, B, th) {
    var H = bankSvg(B, { color: carpet(c), theme: th }), w = el('div', 'pj-u5-draw pj-u5-aimbox', H.svg), svg = w.querySelector('svg');
    var tr = svg.querySelector('.pj-u5-trace'), ag = svg.querySelector('.pj-u5-aimg'), ball = svg.querySelector('.pj-u5-ball');
    var al = Math.round(Number(c.get('aim')) || 60), status = el('div', 'pj-u5-status'), busy = false;
    function sunkNow() { return c.get('sunk') !== '' && Number(c.get('sunk')) === al && al === B.a; }
    function draw() {
      var P = aimPath(B, al), s = Math.sin(al * D2R), co = Math.cos(al * D2R), bx = H.X(B.xb), by = H.Y(B.yb), L = 1.7 * H.S, tip = [bx + co * L, by - s * L];
      var pv = [P.pts[0], P.pts[1]]; if (P.hit) pv.push([P.hit[0] + co * 1.3, 1.3 * s]);
      ag.innerHTML = (c.ro ? '' : '<path class="pj-u5-pre" d="' + polyD(H, pv) + '"/>') + '<line class="pj-u5-arrow" x1="' + bx.toFixed(1) + '" y1="' + by.toFixed(1) + '" x2="' + tip[0].toFixed(1) + '" y2="' + tip[1].toFixed(1) + '"/>' +
        '<path class="pj-u5-ahead" d="M' + tip[0].toFixed(1) + ' ' + tip[1].toFixed(1) + ' l' + (-co * 14 - s * 7).toFixed(1) + ' ' + (s * 14 - co * 7).toFixed(1) + ' l' + (s * 14).toFixed(1) + ' ' + (co * 14).toFixed(1) + 'z"/>' + (c.ro ? '' : '<circle class="pj-u5-handle" cx="' + tip[0].toFixed(1) + '" cy="' + tip[1].toFixed(1) + '" r="13"/>');
      tr.innerHTML = sunkNow() || c.ro ? '<path class="pj-u5-trc' + (sunkNow() ? ' in' : '') + '" d="' + polyD(H, P.pts) + '"/>' : '';
      if (sunkNow()) { ball.setAttribute('cx', H.X(B.xc).toFixed(1)); ball.setAttribute('cy', H.Y(B.yc).toFixed(1)); status.className = 'pj-u5-status good'; status.innerHTML = '⛳ <b>In the hole!</b> Now measure the angle it hit the wall at (Part C).'; }
      else { ball.setAttribute('cx', bx.toFixed(1)); ball.setAttribute('cy', by.toFixed(1)); }
    }
    function setAim(v) { al = Math.max(5, Math.min(85, Math.round(v))); c.set('aim', String(al)); if (status.classList.contains('good') || status.classList.contains('miss')) { status.className = 'pj-u5-status'; status.innerHTML = 'Aim, then press <b>Putt!</b>'; } draw(); }
    function putt() {
      if (busy) return; var P = aimPath(B, al), pts = P.pts.map(function (p) { return [H.X(p[0]), H.Y(p[1])]; });
      var lens = [], tot = 0; for (var i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(d); tot += d; }
      function finish() {
        busy = false; tr.innerHTML = '<path class="pj-u5-trc' + (P.sunk ? ' in' : '') + '" d="' + polyD(H, P.pts) + '"/>';
        if (P.sunk) { c.set('sunk', String(al)); c.redraw(); return; }
        if (c.get('sunk')) c.set('sunk', '');
        status.className = 'pj-u5-status miss';
        status.innerHTML = P.kind === 'obstacle' ? '💥 <b>Bonk!</b> It hit the ' + esc(th.obst) + '. Bank it off the wall instead.' : P.kind === 'steep' ? 'It came down <b>before</b> the cup — too steep. Try a <b>smaller</b> angle with the wall.' : P.kind === 'end' ? 'It missed the wall and hit the end rail. Try a <b>bigger</b> angle with the wall.' : 'It went <b>past</b> the cup — too flat. Try a <b>bigger</b> angle with the wall.';
      }
      var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !root.requestAnimationFrame) { var e0 = pts[pts.length - 1]; ball.setAttribute('cx', e0[0].toFixed(1)); ball.setAttribute('cy', e0[1].toFixed(1)); finish(); return; }
      busy = true; var t0 = 0, dur = 450 + tot * 1.1;
      (function step(ts) {
        if (!t0) t0 = ts; var f = Math.min(1, (ts - t0) / dur), d = tot * (1 - Math.pow(1 - f, 2)), k = 0;
        while (k < lens.length - 1 && d > lens[k]) { d -= lens[k]; k++; }
        var u = lens[k] ? Math.min(1, d / lens[k]) : 1, p = [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u];
        ball.setAttribute('cx', p[0].toFixed(1)); ball.setAttribute('cy', p[1].toFixed(1));
        if (f < 1 && ball.isConnected) requestAnimationFrame(step); else finish();
      })(0);
      requestAnimationFrame(function (ts) { t0 = ts; });
    }
    draw();
    if (!c.ro) {
      var mode = false, pt = function (e) { var m = svg.getScreenCTM(); if (!m) return null; var q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); };
      ag.addEventListener('pointerdown', function (e) { if (!e.target.classList.contains('pj-u5-handle')) return; e.preventDefault(); mode = true; try { ag.setPointerCapture(e.pointerId); } catch (x) {} });
      ag.addEventListener('pointermove', function (e) { if (!mode) return; var q = pt(e); if (!q) return; e.preventDefault(); var v = Math.atan2(H.Y(B.yb) - q.y, q.x - H.X(B.xb)) * R2D; if (v > 0) setAim(v); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { ag.addEventListener(ev, function () { mode = false; }); });
      var bar = el('div', 'pj-u5-aimbar');
      [['Flatter −5°', -5], ['−1°', -1], ['+1°', 1], ['Steeper +5°', 5]].forEach(function (b) { var bt = el('button', 'btn btn-ghost btn-small pj-u5-aim', b[0]); bt.type = 'button'; bt.dataset.d = b[1]; bt.addEventListener('click', function () { setAim(al + b[1]); }); bar.appendChild(bt); });
      var go = el('button', 'btn btn-primary pj-u5-putt', 'Putt! ⛳'); go.type = 'button'; go.addEventListener('click', putt); bar.appendChild(go);
      w.appendChild(bar);
      if (!status.innerHTML) status.innerHTML = 'Drag the arrow’s tip (or use the buttons) to aim, then press <b>Putt!</b> The dashed line shows where the ball will hit the wall.';
      w.appendChild(status);
    }
    w.svg = svg; w.H = H; w.al = function () { return al; };
    return w;
  }
  /* the bounce, zoomed in: the angle in, and its partners p, q, r, s */
  function partnerSvg(a) {
    var cx = 230, cy = 46, L = 175, s = '<svg class="pj-u5-svg pj-u5-zoom" viewBox="0 0 460 230" role="img" aria-label="The bounce point, zoomed in, with the angles p, q, r and s">';
    function P(d, r) { return [cx + Math.cos(d * D2R) * r, cy + Math.sin(d * D2R) * r]; }
    s += '<rect x="20" y="' + (cy - 14) + '" width="420" height="14" fill="#8a5a2b" rx="3"/>' + line([20, cy], [440, cy], 'pj-u5-wall2');
    s += line([cx, cy], P(90, 165), 'pj-u5-norm') + line([cx, cy], P(180 - a, L), 'pj-u5-pin2') + line([cx, cy], P(a, L), 'pj-u5-pout2');
    s += '<circle cx="' + P(180 - a, L)[0].toFixed(1) + '" cy="' + P(180 - a, L)[1].toFixed(1) + '" r="7" class="pj-u5-ball"/>' + txt(P(180 - a, L)[0] - 6, P(180 - a, L)[1] + 24, 'from the ball', 'pj-u5-sm', ' text-anchor="middle"') + txt(P(a, L)[0] + 6, P(a, L)[1] + 24, 'to the cup', 'pj-u5-sm', ' text-anchor="middle"');
    var arcs = [['in', 180 - a, 180, 44, '#0f172a', 'in'], ['p', 0, a, 44, '#2563eb', 'p'], ['q', 90, 180 - a, 74, '#16a34a', 'q'], ['r', a, 180 - a, 104, '#db2777', 'r'], ['s', 0, 180 - a, 134, '#ea580c', 's']];
    arcs.forEach(function (k) { var m = k[1] + norm(k[2] - k[1]) / 2, lp = P(m, k[3] + 13); s += '<path d="' + arcD(cx, cy, k[3], k[1], k[2]) + '" fill="none" stroke="' + k[4] + '" stroke-width="2.6"/>' + txt(lp[0], lp[1] + 5, k[5] === 'in' ? fx(a, 0) + '°' : k[5], 'pj-u5-al', ' fill="' + k[4] + '"'); });
    s += txt(cx + 8, 222, 'dashed line ⊥ wall', 'pj-u5-sm', ' text-anchor="start"');
    return s + '</svg>';
  }
  var cp3 = {
    id: 'bank', title: 'Estimate, then aim a bank shot', needs: ['u5l4', 'u5l6'],
    goal: 'An obstacle blocks the straight shot. <b>Estimate</b> the angle with referents, <b>aim</b> the ball off the wall until it drops in, then measure the angle and find its <b>complementary</b> and <b>supplementary</b> partners.',
    example: { title: 'Dev’s bank shot around the moose', scene: '<div class="pj-u5-exwrap pj-u5-exsm">' + (function () { var B = bankOf(35, 3, 3), H = bankSvg(B, { color: '#2a9d8f', theme: { ob: '#7c5c3b', icon: '🫎' } }); return H.svg.replace('<g class="pj-u5-trace"></g>', '<path class="pj-u5-trc in" d="' + polyD(H, [[B.xb, B.yb], [B.bx, 0], [B.xc, B.yc]]) + '"/><path class="pj-u5-pre" d="' + polyD(H, [[B.xb, B.yb], [B.xc, -B.yc]]) + '"/>'); })() + '</div>', steps: [
      { cap: 'A moose statue blocks Dev’s straight shot, so the ball must bounce off the <b>wall</b>. A ball leaves a wall at the <b>same angle</b> it hits it: angle in = angle out.', html: chip('angle in = angle out') },
      { cap: '<b>The mirror trick:</b> imagine the cup reflected across the wall. Aim straight at the <b>mirror cup</b> and the bounce does the rest.', html: chip('Aim at the mirror cup') },
      { cap: '<b>Estimate first</b> with referent angles: 30° is one hour on a clock face; 45° is half a square corner. Dev’s line looks a bit more than 30°. He guesses <b>35°</b>.', html: chip('Closest referent: <b>30°</b> · estimate: 35°') },
      { cap: 'He putts, and it drops! He measures the angle in with a protractor: <b>35°</b>. The angle out is 35° too.', html: eq('angle out', 35) },
      { cap: 'The dashed line is <b>perpendicular</b> to the wall (90°). The path in and the dashed line make the <b>complement</b> of 35°: they add to 90°.', html: eq('90° − 35°', 55) },
      { cap: 'Along the wall, angle in + the angle between the paths + angle out make a straight line: 180°.', html: eq('180° − 35° − 35°', 110) },
      { cap: 'The path in and the wall on the <b>cup’s side</b> make the <b>supplement</b> of 35°: they add to 180°.', html: eq('180° − 35°', 145) }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      var B = bank(c), th = theme(c) || THEMES.farm;
      part(box, 'A', 'Estimate first', 'A ' + esc(th.obst) + ' blocks the straight shot. The ball has to bounce off <b>the wall</b>. Look at the <b>mirror cup</b>: about what angle will the ball’s path make with the wall?');
      var g = grid(box);
      g.appendChild(field('Closest referent angle', c.choice('ref', REFS.map(function (r) { return { v: String(r), html: fx(r, 1) + '°' }; }), { cls: 'pj-seg pj-seg-sm', aria: 'Closest referent angle' })));
      g.appendChild(field('Your estimate', inA(c, 'est', { aria: 'Your estimate' })));
      part(box, 'B', 'Aim and putt', 'Turn the arrow, then press <b>Putt!</b> Keep trying until the ball drops in.');
      var tool = aimTool(c, B, th);
      box.appendChild(tool);
      var al = Number(c.get('aim')) || 60, ok = c.get('sunk') !== '' && Number(c.get('sunk')) === al && al === B.a;
      if (!c.ro && hasDoc) { ensureDefs(); setTimeout(function () { if (!tool.svg.isConnected) return; var H = tool.H; var P = attachProt(tool.svg, 'cp3|' + B.a, { pts: function () { var a2 = tool.al(), pth = aimPath(B, a2), out = [{ x: H.X(B.xb), y: H.Y(B.yb), dirs: [0, 180, -a2] }]; if (pth.hit) out.push({ x: H.X(pth.hit[0]), y: H.Y(0), dirs: [0, 180, 180 - a2, a2, 90] }); return out; }, start: { x: H.W - PR - 30, y: H.H - 8, rot: 0 } }); if (P) tool.appendChild(P.bar); }, 0); }
      part(box, 'C', 'Measure it', ok ? 'Put the protractor on the bounce point, 0 line along the wall, and measure the angle between the wall and the ball’s path <b>in</b>.' : 'Sink your putt first (Part B). Then you’ll measure it here.');
      box.appendChild(field('Angle in (between the wall and the path in)', inA(c, 'in', { aria: 'Angle in' }), 'pj-u5-one'));
      part(box, 'D', 'Angle partners', 'The bounce, zoomed in. Use <b>your</b> angle in to find p, q, r and s.');
      var a1 = Math.round(mine(c, 'in', ok ? al : 35)), z = el('div', 'pj-u5-zoomrow');
      z.appendChild(el('div', 'pj-u5-draw pj-u5-zd', partnerSvg(Math.max(5, Math.min(85, a1)))));
      var g3 = el('div', 'pj-u5-pq');
      [['p', 'p: angle out (the path to the cup and the wall)'], ['q', 'q: the path in and the dashed line (⊥ to the wall)'], ['r', 'r: between the path in and the path out'], ['s', 's: the path in and the wall on the cup’s side']].forEach(function (x) { g3.appendChild(field(x[1], inA(c, 'pt.' + x[0], { aria: x[1] }))); });
      z.appendChild(g3); box.appendChild(z);
      part(box, 'E', 'How close was your estimate?', '');
      box.appendChild(field('Difference between your estimate and your angle in', inA(c, 'off', { aria: 'Difference' }), 'pj-u5-one'));
    },
    check: function (c) {
      if (!geo(c)) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var B = bank(c), out = [], nr = nearRef(B.a), wm = {};
      REFS.forEach(function (r) { if (r !== nr) wm[String(r)] = r > nr ? 'Picture the straight line from the ball to the <b>mirror cup</b>. Is it really as steep as ' + fx(r, 1) + '°? Compare: 30° is one hour on a clock, 45° is half a square corner.' : 'Picture the straight line from the ball to the <b>mirror cup</b>. Is it really as flat as ' + fx(r, 1) + '°? Compare: 22.5° is half of 45°, 45° is half a square corner.'; });
      out.push(c.equals('ref', String(nr), { label: 'Referent', wrong: wm }));
      out.push(angR(c, 'est', B.a, { tol: 10, label: 'Your estimate', hint: 'Picture a straight line from the ball to the mirror cup. Start from your referent and adjust a little.', hint2: 'The closest referent is ' + fx(nr, 1) + '°. Is the line a bit more or a bit less steep than that?' }));
      var al = Number(c.get('aim')), sunk = c.get('sunk') !== '' && Number(c.get('sunk')) === al && al === B.a;
      out.push(c.msg(sunk, 'Aim and putt until your ball drops into the cup (Part B).'));
      if (!sunk) al = B.a;
      out.push(angR(c, 'in', al, { tol: 2, label: 'Angle in', wrong: [{ v: 180 - al, tol: 2, hint: 'You read the <b>other scale</b>. The angle in is small (it’s acute): start at 0 on the wall.' }, { v: 90 - al, tol: 2, hint: 'That’s the angle with the dashed line. Measure between the path and the <b>wall</b>.' }], hint: 'Centre the protractor on the bounce point, 0 line along the wall, and read where the path in crosses the scale.' }));
      var a1 = mine(c, 'in', al);
      out.push(angR(c, 'pt.p', a1, { tol: 0.01, label: 'p', wrong: [{ v: 180 - a1, hint: 'That’s the supplement. A ball bounces off at the <b>same</b> angle: angle out = angle in.' }, { v: 90 - a1, hint: 'That’s the complement. Angle out = angle in.' }], hint: 'Angle out = angle in.' }));
      out.push(angR(c, 'pt.q', 90 - a1, { tol: 0.01, label: 'q', wrong: [{ v: 180 - a1, hint: 'That’s the <b>supplement</b> (adds to 180°). The dashed line is perpendicular to the wall, so q and your angle in make 90°: they’re <b>complementary</b>.' }, { v: a1, hint: 'q isn’t the angle in. Together they make the 90° between the wall and the dashed line.' }], hint: 'q and the angle in are complementary: q = 90° − angle in.', hint2: 'Try 90 − ' + fx(a1, 1) + '.' }));
      out.push(angR(c, 'pt.r', 180 - 2 * a1, { tol: 0.01, label: 'r', wrong: [{ v: 180 - a1, hint: 'Three angles sit along the wall: angle in + r + angle out = 180°. Take away <b>both</b>.' }, { v: 2 * a1, hint: 'Along the wall, in + r + out = 180°. Subtract from 180°.' }, { v: 90 - a1, hint: 'That’s q, only half of r.' }], hint: 'in + r + out = 180° (a straight line).', hint2: 'Try 180 − ' + fx(a1, 1) + ' − ' + fx(a1, 1) + '.' }));
      out.push(angR(c, 'pt.s', 180 - a1, { tol: 0.01, label: 's', wrong: [{ v: 90 - a1, hint: 'That’s the <b>complement</b> (adds to 90°). Your angle in and s together make a straight line along the wall: they’re <b>supplementary</b> (180°).' }, { v: a1, hint: 's is on the other side of the path. s + angle in = 180°.' }], hint: 's and the angle in are supplementary: s = 180° − angle in.' }));
      var e1 = mine(c, 'est', B.a);
      out.push(angR(c, 'off', Math.abs(e1 - a1), { tol: 0.01, label: 'Difference', wrong: [{ v: e1 - a1, hint: 'Take the smaller from the bigger: the difference is never negative.' }], hint: 'Difference = the bigger one − the smaller one.', hint2: 'Your estimate ' + fx(e1, 1) + '° and your angle in ' + fx(a1, 1) + '°.' }));
      return out;
    },
    solve: function (c) {
      var B = bank(c); c.set('ref', String(nearRef(B.a))); c.set('est', String(B.a + 4)); c.set('aim', String(B.a)); c.set('sunk', String(B.a)); c.set('in', String(B.a));
      c.set('pt.p', String(B.a)); c.set('pt.q', String(90 - B.a)); c.set('pt.r', String(180 - 2 * B.a)); c.set('pt.s', String(180 - B.a)); c.set('off', '4');
    }
  };

  /* ================= Checkpoint 4: the park map (true bearings) ================= */
  var HB = [35, 48, 57, 68, 116, 124, 143, 152, 207, 213, 226, 238, 293, 304, 317, 331];
  var TB = [300, 230, 125, 55, 320, 210, 140, 40, 255, 105, 335, 25];
  var TENTS = ['first-aid tent', 'lost-and-found tent', 'lemonade stand', 'face-painting tent', 'pie-eating contest'];
  function mapGeo(c) {
    var b = HB[hv(c, 'brg') % HB.length], club = [11, 8], T = null, ds = null, o = hv(c, 'tb');
    for (var sep = 26; sep >= 14 && T == null; sep -= 4) for (var i = 0; i < TB.length && T == null; i++) {
      var t = TB[(o + i) % TB.length], d4 = [t, norm(360 - t), norm(t + 180), norm(t + 90)], all = d4.concat([b]);
      if (all.every(function (x, j) { return all.every(function (y, k) { return k === j || adiff(x, y) >= sep; }); })) { T = t; ds = d4; }
    }
    function pos(br, d) { return [club[0] + d * Math.sin(br * D2R), club[1] - d * Math.cos(br * D2R)]; }
    var kinds = ['right', 'ccw', 'back', 'east'], dist = [5.6, 6.5, 4.9, 6.1], perm = [0, 1, 2, 3], h = hv(c, 'tl');
    for (var j = 3; j > 0; j--) { h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0; var k2 = h % (j + 1), tt = perm[j]; perm[j] = perm[k2]; perm[k2] = tt; }
    var tents = ds.map(function (br, n) { var p = pos(br, dist[n]); return { L: 'ABCD'[perm[n]], brg: br, kind: kinds[n], x: p[0], y: p[1] }; });
    return { b: b, club: club, hole: pos(b, 6.3), T: T, tents: tents, tent: TENTS[hv(c, 'tn') % TENTS.length], pos: pos };
  }
  function mapSvg(c, M, o) {
    o = o || {}; var S = 30, W = 22 * S, Hh = 16 * S, C0 = course(c);
    function X(x) { return x * S; } function Y(y) { return y * S; }
    var s = '<svg class="pj-u5-svg pj-u5-map" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="A map of the fairgrounds with the clubhouse, your hole and four tents">';
    s += '<rect width="' + W + '" height="' + Hh + '" fill="#e3f0d6"/><path d="M0 ' + Y(13.2) + ' C' + X(6) + ' ' + Y(12.4) + ' ' + X(9) + ' ' + Y(14.6) + ' ' + X(22) + ' ' + Y(13.6) + '" stroke="#efe2c4" stroke-width="22" fill="none"/>';
    s += '<ellipse cx="' + X(19.2) + '" cy="' + Y(2.4) + '" rx="' + X(2.1) + '" ry="' + Y(1.1) + '" fill="#bfdcf5"/>' + txt(X(19.2), Y(2.5) + 4, 'pond', 'pj-u5-sm');
    var h = hv(c, 'trees');
    for (var i = 0; i < 18; i++) {
      h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; var tx = 0.8 + (h % 2040) / 100, ty = 0.8 + ((h >>> 11) % 1440) / 100;
      var near = [M.club, M.hole].concat(M.tents.map(function (t) { return [t.x, t.y]; })).some(function (p) { return Math.hypot(p[0] - tx, p[1] - ty) < 2.1; }) || dseg([tx, ty], M.club, M.hole) < 1 || dseg([tx, ty], M.club, [M.club[0], M.club[1] - 7]) < 1 || (tx < 3.4 && ty < 4);
      if (!near) s += '<circle cx="' + X(tx).toFixed(1) + '" cy="' + Y(ty).toFixed(1) + '" r="9" fill="#8cc084" stroke="#5e9a57" stroke-width="1.5"/>';
    }
    // north arrow
    s += '<g class="pj-u5-narrow" transform="translate(' + X(1.6) + ' ' + Y(2.6) + ')"><path d="M0 -34 L11 2 L0 -6 L-11 2 Z"/><text y="22">N</text></g>';
    // the north line and the line to the hole
    s += line([X(M.club[0]), Y(M.club[1])], [X(M.club[0]), Y(M.club[1] - 7)], 'pj-u5-nline') + txt(X(M.club[0]) + 8, Y(M.club[1] - 7) + 12, 'north', 'pj-u5-sm', ' text-anchor="start"');
    s += line([X(M.club[0]), Y(M.club[1])], [X(M.hole[0]), Y(M.hole[1])], 'pj-u5-hline');
    // tents
    M.tents.forEach(function (t) { var x = X(t.x), y = Y(t.y); s += '<g class="pj-u5-tent"><path d="M' + (x - 13) + ' ' + (y + 9) + ' L' + x + ' ' + (y - 13) + ' L' + (x + 13) + ' ' + (y + 9) + ' Z"/><circle cx="' + x + '" cy="' + (y + 22) + '" r="10"/>' + txt(x, y + 26.5, t.L, '') + '</g>'; });
    // the hole and the clubhouse
    s += flagSvg(X(M.hole[0]), Y(M.hole[1]), 20, (theme(c) || THEMES.farm).ob) + txt(X(M.hole[0]), Y(M.hole[1]) + 22, 'Hole ' + C0.hole, 'pj-u5-ml');
    var cx = X(M.club[0]), cy = Y(M.club[1]);
    s += '<g class="pj-u5-club"><rect x="' + (cx - 15) + '" y="' + (cy - 4) + '" width="30" height="20" rx="2"/><path d="M' + (cx - 19) + ' ' + (cy - 3) + ' L' + cx + ' ' + (cy - 19) + ' L' + (cx + 19) + ' ' + (cy - 3) + ' Z"/></g><circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="#0f172a"/>' + txt(cx, cy + 32, 'Clubhouse', 'pj-u5-ml');
    return { svg: s + '</svg>', X: X, Y: Y, S: S, W: W, H: Hh };
  }
  var cp4 = {
    id: 'map', title: 'Put it on the park map', needs: ['u5l4'],
    goal: 'Find the <b>true bearing</b> from the clubhouse to your hole (clockwise from north, 3 digits) and the bearing back. Then use a bearing to find a tent.',
    example: { title: 'Bearings at Moose Meadows', scene: '<div class="pj-u5-exwrap pj-u5-exsm">' + (function () {
      var s = '<svg class="pj-u5-svg pj-u5-map" viewBox="0 0 420 300"><rect width="420" height="300" fill="#e3f0d6"/>', cx = 210, cy = 160, P = function (b, d) { return [cx + d * Math.sin(b * D2R), cy - d * Math.cos(b * D2R)]; };
      s += line([cx, cy], [cx, 24], 'pj-u5-nline') + line([cx, cy], P(62, 120), 'pj-u5-hline') + line([cx, cy], P(245, 120), 'pj-u5-hline');
      s += '<path d="' + arcD(cx, cy, 38, -90, -28) + '" fill="none" stroke="#2563eb" stroke-width="3"/>' + txt(cx + 26, cy - 46, '62°', 'pj-u5-al', ' fill="#2563eb"');
      s += '<path d="' + arcD(cx, cy, 52, 155, 270) + '" fill="none" stroke="#db2777" stroke-width="3" stroke-dasharray="6 4"/>' + txt(cx - 70, cy - 36, '115°', 'pj-u5-al', ' fill="#db2777"');
      s += flagSvg(P(62, 120)[0], P(62, 120)[1], 18, '#2a9d8f') + txt(P(62, 120)[0] + 8, P(62, 120)[1] + 22, 'Hole 4', 'pj-u5-ml') + '<g class="pj-u5-tent"><path d="M' + (P(245, 120)[0] - 12) + ' ' + (P(245, 120)[1] + 8) + ' l12 -21 l12 21z"/></g>' + txt(P(245, 120)[0], P(245, 120)[1] + 26, 'Beach', 'pj-u5-ml');
      s += '<g class="pj-u5-club"><rect x="' + (cx - 13) + '" y="' + (cy - 3) + '" width="26" height="17"/><path d="M' + (cx - 16) + ' ' + (cy - 2) + ' L' + cx + ' ' + (cy - 16) + ' L' + (cx + 16) + ' ' + (cy - 2) + ' Z"/></g>' + txt(cx, cy + 32, 'Clubhouse', 'pj-u5-ml');
      return s + '<g class="pj-u5-narrow" transform="translate(40 60)"><path d="M0 -30 L10 2 L0 -5 L-10 2 Z"/><text y="20">N</text></g></svg>'; })() + '</div>', steps: [
      { cap: 'A <b>true bearing</b> starts at <b>north</b> and turns <b>clockwise</b>, like a clock’s hands. Dev draws a north line at the clubhouse and measures to Hole 4: <b>62°</b>.', html: chip('Clockwise from north') },
      { cap: 'Bearings always have <b>3 digits</b>, so 62° is written <b>062°</b>.', html: chip('62° → <b>062°</b>') },
      { cap: 'The beach is past south. His protractor measures 115° on the <b>west</b> side of north (counter-clockwise). Clockwise, that’s 360° − 115°.', html: eq('360° − 115°', 245) },
      { cap: 'The <b>bearing back</b> points the opposite way: add 180° if the bearing is less than 180°…', html: eq('062° + 180°', 242) },
      { cap: '…and subtract 180° if it’s 180° or more. (A bearing is never 360° or more.)', html: eq('245° − 180°', 65) + chip('Write it as <b>065°</b>') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      var M = mapGeo(c), H = mapSvg(c, M), C0 = course(c);
      part(box, 'A', 'The bearing to your hole', 'The fair’s map shows where Hole ' + C0.hole + ' goes. Measure the angle <b>clockwise from north</b> at the clubhouse. For more than 180°, measure on the west side and subtract from 360°.');
      var pts = [{ x: H.X(M.club[0]), y: H.Y(M.club[1]), dirs: [-90, M.b - 90].concat(M.tents.map(function (t) { return t.brg - 90; })) }, { x: H.X(M.hole[0]), y: H.Y(M.hole[1]), dirs: [-90, M.b + 90] }];
      box.appendChild(protBox(c, 'cp4|' + M.b, H.svg, { pts: pts, start: { x: H.W - PR - 20, y: H.H - 10, rot: 0 }, cls: 'pj-u5-mapbox' }));
      var g = grid(box);
      g.appendChild(field('Bearing from the clubhouse to Hole ' + C0.hole, inA(c, 'brg', { aria: 'Bearing to the hole', ph: '000' })));
      g.appendChild(field('Bearing back, from Hole ' + C0.hole + ' to the clubhouse', inA(c, 'back', { aria: 'Bearing back to the clubhouse', ph: '000' })));
      part(box, 'B', 'Find the tent', 'The <b>' + esc(M.tent) + '</b> is on a bearing of <b>' + b3(M.T) + '°</b> from the clubhouse. Which tent is it?');
      box.appendChild(c.choice('tent', ['A', 'B', 'C', 'D'].map(function (L) { return { v: L, html: '⛺ Tent ' + L }; }), { cls: 'pj-seg', aria: 'Which tent' }));
    },
    check: function (c) {
      if (!geo(c)) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var M = mapGeo(c), b = M.b, out = [], w = [{ v: norm(360 - b), tol: 2, hint: 'You measured <b>counter-clockwise</b>. Bearings turn <b>clockwise</b> from north, like a clock’s hands.' }, { v: norm(b - 90), tol: 2, hint: 'Start at <b>north</b> (straight up the map), not east.' }, { v: norm(b + 180), tol: 2, hint: 'That’s the way <b>back</b> (from the hole to the clubhouse). Stand at the clubhouse and look toward the hole.' }];
      if (b < 180) w.push({ v: 180 - b, tol: 2, hint: 'You read the <b>other scale</b>. Put 0 on the north line and count from there.' });
      out.push(brgR(c, 'brg', b, { tol: 2, label: 'Bearing to the hole', wrong: w, hint: 'Centre the protractor on the clubhouse with 0 on the north line, and measure clockwise to the line to your hole.', hint2: b > 180 ? 'Your hole is on the west side. Measure the angle from north counter-clockwise, then subtract it from 360°.' : 'Your hole is on the east side: measure clockwise from north.' }));
      var b1 = mine(c, 'brg', b), back = norm(b1 + 180), wb = [{ v: b1 + 180, hint: 'A bearing is less than 360°. When the bearing is 180° or more, <b>subtract</b> 180°.' }, { v: b1 - 180, hint: 'A bearing can’t be negative. When the bearing is less than 180°, <b>add</b> 180°.' }, { v: 180 - b1, hint: 'The bearing back is your bearing <b>± 180°</b>, not 180° − your bearing.' }, { v: 360 - b1, hint: 'The way back is the <b>opposite direction</b>: your bearing ± 180°.' }, { v: b1, hint: 'Going back, you face the opposite way: ± 180°.' }];
      out.push(brgR(c, 'back', back, { tol: 0.6, label: 'Bearing back', wrong: wb, hint: 'Bearing back = your bearing + 180° (if it’s less than 180°) or − 180° (if it’s 180° or more).', hint2: 'Your bearing is ' + b3(b1) + '°: ' + (b1 < 180 ? 'add' : 'subtract') + ' 180°.' }));
      var wt = {}, right = M.tents.filter(function (t) { return t.kind === 'right'; })[0];
      M.tents.forEach(function (t) { if (t.kind === 'ccw') wt[t.L] = 'Tent ' + t.L + ' is ' + b3(M.T) + '° <b>counter-clockwise</b> from north. Bearings go clockwise.'; else if (t.kind === 'back') wt[t.L] = 'Tent ' + t.L + ' is in the <b>opposite</b> direction (' + b3(t.brg) + '°). Start at north and turn clockwise ' + b3(M.T) + '°.'; else if (t.kind === 'east') wt[t.L] = 'Tent ' + t.L + ' is ' + b3(M.T) + '° clockwise from <b>east</b>. Start at north.'; });
      out.push(c.equals('tent', right.L, { label: 'The ' + M.tent, wrong: wt }));
      return out;
    },
    solve: function (c) { var M = mapGeo(c); c.set('brg', b3(M.b)); c.set('back', b3(M.b + 180)); c.set('tent', M.tents.filter(function (t) { return t.kind === 'right'; })[0].L); }
  };

  /* ================= Checkpoint 5: rails and a ramp (parallel lines and a transversal) ================= */
  var REL = { vert: 'Vertically opposite', line: 'On a straight line (supplementary)', corr: 'Corresponding', altI: 'Alternate interior', altE: 'Alternate exterior', sameI: 'Interior angles on the same side of the transversal', sameE: 'Exterior angles on the same side of the transversal' };
  var PAIR_IDS = ['corr', 'altI', 'altE', 'sameI', 'sameE', 'vert'], REL_IDS = ['vert', 'line', 'corr', 'altI', 'altE', 'sameI', 'sameE'];
  var PAIRS = { corr: [[1, 5], [2, 6], [3, 7], [4, 8]], altI: [[3, 5], [4, 6]], altE: [[1, 7], [2, 8]], sameI: [[3, 6], [4, 5]], sameE: [[1, 8], [2, 7]], vert: [[1, 3], [2, 4], [5, 7], [6, 8]] };
  var SPOT = ['upper left', 'upper right', 'lower right', 'lower left'];
  function spot(k) { return '∠' + k + ' is at the ' + (k <= 4 ? 'top' : 'bottom') + ' crossing, ' + SPOT[(k - 1) % 4]; }
  function rel(i, j) {
    var ti = i <= 4, tj = j <= 4; if (ti === tj) return Math.abs((i - 1) % 4 - (j - 1) % 4) === 2 ? 'vert' : 'line';
    if (!ti) { var x = i; i = j; j = x; }
    var p = (i - 1) % 4, q = (j - 1) % 4; if (p === q) return 'corr';
    var inT = p === 2 || p === 3, inB = q === 0 || q === 1;
    if (inT && inB) return (p === 3 && q === 1) || (p === 2 && q === 0) ? 'altI' : 'sameI';
    if (!inT && !inB) return (p === 0 && q === 2) || (p === 1 && q === 3) ? 'altE' : 'sameE';
    return null;
  }
  var RELHINT = {
    corr: 'Corresponding angles sit in the <b>same spot</b> at the two crossings (an F shape).',
    altI: 'Alternate interior angles are <b>between</b> the rails, on <b>opposite sides</b> of the brace (a Z shape).',
    altE: 'Alternate exterior angles are <b>outside</b> the rails, on <b>opposite sides</b> of the brace.',
    sameI: 'Interior angles on the same side are <b>between</b> the rails, on the <b>same side</b> of the brace (a C shape).',
    sameE: 'Exterior angles on the same side are <b>outside</b> the rails, on the <b>same side</b> of the brace.',
    vert: 'Vertically opposite angles are at the <b>same crossing</b>, across from each other (an X).',
    line: 'Angles on a straight line are <b>side by side</b> at the same crossing.'
  };
  var RT = [48, 52, 55, 58, 62, 64, 67, 71, 74];
  function railGeo(c) {
    var t = RT[hv(c, 'rt') % RT.length], lean = hv(c, 'rl') % 2, g = 1 + hv(c, 'rg') % 8, u = lean ? -(180 - t) : -t;
    function ang(k) { var p = (k - 1) % 4; return p === 0 ? adiff(180, u) : p === 1 ? adiff(0, u) : p === 2 ? adiff(0, u + 180) : adiff(180, u + 180); }
    var cats = PAIR_IDS.slice(), h = hv(c, 'pairs'); for (var i = cats.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; var j = h % (i + 1), x = cats[i]; cats[i] = cats[j]; cats[j] = x; }
    var pairs = cats.slice(0, 3).map(function (cat, n) { var L = PAIRS[cat], pr = L[hv(c, 'pp' + n) % L.length]; return { cat: cat, a: hv(c, 'po' + n) % 2 ? pr[1] : pr[0], b: hv(c, 'po' + n) % 2 ? pr[0] : pr[1] }; });
    // the 5 angles to find from ∠g: one of each relation
    var others = [1, 2, 3, 4, 5, 6, 7, 8].filter(function (k) { return k !== g && rel(g, k); }), byRel = {};
    others.forEach(function (k) { var r = rel(g, k); (byRel[r.replace(/[IE]$/, '')] = byRel[r.replace(/[IE]$/, '')] || []).push(k); });
    var targets = ['vert', 'line', 'corr', 'alt', 'same'].map(function (r) { var L = byRel[r]; return L[hv(c, 'tg' + r) % L.length]; });
    for (var a = targets.length - 1; a > 0; a--) { h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0; var b2 = h % (a + 1), y = targets[a]; targets[a] = targets[b2]; targets[b2] = y; }
    return { t: t, lean: lean, u: u, g: g, ang: ang, pairs: pairs, targets: targets };
  }
  /* two rails cut by a brace. o: { tilt (deg, the bottom rail), nums: true, hi: angle number, given: { k: text } } */
  function railSvg(R, o) {
    o = o || {}; var S = 34, W = 17 * S + 40, Hh = 9.2 * S, y1 = 2.3 * S, gap = 4.6 * S, y2 = y1 + gap, cxT = W / 2 + (R.lean ? -1 : 1) * gap / Math.tan(R.t * D2R) / 2, ux = Math.cos(R.u * D2R), uy = Math.sin(R.u * D2R);
    var cxB = cxT - ux * gap / -uy, tilt = o.tilt || 0, s = '<svg class="pj-u5-svg pj-u5-rails" viewBox="0 0 ' + W + ' ' + Hh.toFixed(0) + '" role="img" aria-label="' + esc(o.aria || 'Two rails cut by a brace, with angles numbered 1 to 8') + '">';
    var tx = Math.cos(tilt * D2R), ty = Math.sin(tilt * D2R), half = W / 2 - 20;
    s += '<rect x="0" y="0" width="' + W + '" height="' + Hh.toFixed(0) + '" fill="' + esc(o.bg || '#eaf5e4') + '" rx="12"/>';
    s += '<line x1="20" y1="' + y1 + '" x2="' + (W - 20) + '" y2="' + y1 + '" class="pj-u5-rail"/>';
    s += '<line x1="' + (cxB - tx * (cxB - 20)).toFixed(1) + '" y1="' + (y2 - ty * (cxB - 20)).toFixed(1) + '" x2="' + (cxB + tx * (W - 20 - cxB)).toFixed(1) + '" y2="' + (y2 + ty * (W - 20 - cxB)).toFixed(1) + '" class="pj-u5-rail"/>';
    void half;
    if (!tilt && !o.noArrows) [y1, y2].forEach(function (y) { s += '<path class="pj-u5-par" d="M' + 70 + ' ' + (y - 7) + ' l9 7 l-9 7 M' + 82 + ' ' + (y - 7) + ' l9 7 l-9 7"/>'; });
    var ext = 1.9 * S; s += line([cxT + ux * ext, y1 + uy * ext], [cxB - ux * ext, y2 - uy * ext], 'pj-u5-brace');
    var labs = '';
    function quad(cx, cy, k, east) {
      var p = (k - 1) % 4, up = R.u, rays = [[180, up], [east, up], [east, up + 180], [180 + east, up + 180]][p], m = rays[0] + norm(rays[1] - rays[0]) / 2;
      if (norm(rays[1] - rays[0]) > 180) m += 180;
      var lx = cx + Math.cos(m * D2R) * 35, ly = cy + Math.sin(m * D2R) * 35, hi = o.hi === k, gv = o.given && o.given[k];
      if (hi || gv) { var a1 = rays[0], a2 = rays[1]; if (norm(a2 - a1) > 180) { var tt = a1; a1 = a2; a2 = tt; } s += '<path d="M' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' L' + arcD(cx, cy, 21, a1, a2).slice(1) + ' Z" class="pj-u5-harc"/>'; }
      if (o.nums !== false) labs += '<g class="pj-u5-an' + (hi ? ' hi' : '') + '"><circle cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="11"/>' + txt(lx, ly + 4.5, String(k), '') + '</g>';
      if (gv) { var gx = cx + Math.cos(m * D2R) * 66, gy = cy + Math.sin(m * D2R) * 66; labs += '<g class="pj-u5-gv"><rect x="' + (gx - 25).toFixed(1) + '" y="' + (gy - 12).toFixed(1) + '" width="50" height="23" rx="11"/>' + txt(gx, gy + 5, esc(gv), '') + '</g>'; }
    }
    [1, 2, 3, 4].forEach(function (k) { quad(cxT, y1, k, 0); });
    [5, 6, 7, 8].forEach(function (k) { quad(cxB, y2, k, tilt); });
    s += '<circle cx="' + cxT.toFixed(1) + '" cy="' + y1 + '" r="3.5" fill="#0f172a"/><circle cx="' + cxB.toFixed(1) + '" cy="' + y2 + '" r="3.5" fill="#0f172a"/>';
    s += txt(W - 26, y1 - 12, 'rail', 'pj-u5-sm', ' text-anchor="end"') + txt(W - 26, y2 + ty * (W - 20 - cxB) - 12, 'rail', 'pj-u5-sm', ' text-anchor="end"') + txt(cxB - ux * ext + (R.lean ? 10 : -10), y2 - uy * ext + 6, 'brace', 'pj-u5-sm', ' text-anchor="' + (R.lean ? 'start' : 'end') + '"');
    return { svg: s + labs + '</svg>', top: [cxT, y1], bot: [cxB, y2], W: W, H: Hh };
  }
  var CROOK = [0, 3, -4, 5, 0, -3, 4, -5], CT = [58, 63, 66, 69, 72, 76], CPAIR = ['corr', 'altI', 'sameI'];
  function crook(c) {
    var d = CROOK[hv(c, 'cd') % CROOK.length], t = CT[hv(c, 'ct') % CT.length], pt = CPAIR[hv(c, 'cp') % CPAIR.length];
    var k = pt === 'corr' ? 2 : pt === 'altI' ? 4 : 3, top = pt === 'sameI' ? 180 - t : t;
    return { d: d, t: t, pair: pt, k: k, top: top, six: t + d, par: d === 0 };
  }
  var cp5 = {
    id: 'rails', title: 'Rails and a ramp', needs: ['u5l7', 'u5l8'],
    goal: 'A ramp’s brace crosses the two <b>parallel</b> side rails of your hole. Measure one angle, <b>name</b> the angle pairs, find the missing angles with reasons, and test a crooked rail.',
    example: { title: 'Dev’s ramp crosses two rails', scene: '<div class="pj-u5-exwrap pj-u5-exsm">' + railSvg({ t: 64, lean: 0, u: -64 }, { hi: 1, given: { 1: '116°' } }).svg + '</div>', steps: [
      { cap: 'Two <b>parallel</b> rails (the arrow marks mean parallel) are crossed by a brace, a <b>transversal</b>. The 8 angles are numbered 1–4 at the top crossing and 5–8 at the bottom, clockwise from the upper left.', html: chip('∠1 = 116° (measured)') },
      { cap: '<b>Vertically opposite</b> angles are equal: ∠3 is across from ∠1. And ∠2 sits beside ∠1 <b>on a straight line</b>: they add to 180°.', html: eq('∠3 = ∠1', 116) + eq('∠2 = 180° − 116°', 64, '°', 500) },
      { cap: '<b>Corresponding</b> angles (same spot at each crossing, an F shape) are equal when the lines are parallel: ∠5 = ∠1.', html: eq('∠5', 116) },
      { cap: '<b>Alternate interior</b> angles (between the rails, opposite sides, a Z shape) are equal: ∠4 = ∠6. <b>Alternate exterior</b> too: ∠1 = ∠7.', html: eq('∠7 = ∠1', 116) },
      { cap: '<b>Interior angles on the same side</b> (a C shape) add to 180°: ∠4 + ∠5 = 180°. So ∠4 = 180° − 116°.', html: eq('∠4', 64) },
      { cap: 'These rules only work when the rails are <b>parallel</b>. If corresponding angles aren’t equal, the rails aren’t parallel!', html: chip('equal corresponding angles ⇔ parallel rails') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      var R = railGeo(c), H = railSvg(R, { hi: R.g });
      part(box, 'A', 'Measure one angle', 'This is the straight stretch by your tee: the top and bottom rails are <b>parallel</b>. Measure <b>∠' + R.g + '</b> with the protractor.');
      var dirs = [0, 180, R.u, R.u + 180];
      box.appendChild(protBox(c, 'cp5|' + R.t + R.lean, H.svg, { pts: [{ x: H.top[0], y: H.top[1], dirs: dirs }, { x: H.bot[0], y: H.bot[1], dirs: dirs }], start: { x: H.W - PR - 26, y: H.H - 8, rot: 0 } }));
      box.appendChild(field('∠' + R.g, inA(c, 'meas', { aria: 'Angle ' + R.g }), 'pj-u5-one'));
      part(box, 'B', 'Name the pairs', 'Pick the name of each pair of angles.');
      var g = el('div', 'pj-u5-pairs');
      R.pairs.forEach(function (p, n) { g.appendChild(field('∠' + p.a + ' and ∠' + p.b + ' are…', c.select('pair.' + (n + 1), PAIR_IDS.map(function (id) { return { v: id, t: REL[id] }; }), { aria: 'Angles ' + p.a + ' and ' + p.b, ph: 'Choose a name…' }))); });
      box.appendChild(g);
      part(box, 'C', 'Find the missing angles', 'Use <b>your</b> ∠' + R.g + '. For each angle, give the reason: how is it related to ∠' + R.g + '?');
      var tb = el('div', 'pj-u5-tbl pj-u5-find');
      tb.appendChild(el('div', 'pj-u5-th', '<span>Angle</span><span>Size</span><span>Reason (related to ∠' + R.g + ')</span>'));
      R.targets.forEach(function (k) {
        var r = el('div', 'pj-u5-tr'); r.appendChild(el('div', 'pj-u5-tl', '<b>∠' + k + '</b>'));
        r.appendChild(inA(c, 'fa.' + k, { aria: 'Angle ' + k })); r.appendChild(c.select('fr.' + k, REL_IDS.map(function (id) { return { v: id, t: REL[id] }; }), { aria: 'Reason for angle ' + k, ph: 'Choose a reason…' }));
        tb.appendChild(r);
      });
      box.appendChild(tb);
      var K = crook(c), given = {}; given[K.k] = fx(K.top, 0) + '°'; given[6] = fx(K.six, 0) + '°';
      part(box, 'D', 'A crooked rail?', 'On another stretch, a crew member measured these two angles. Are the rails parallel?');
      box.appendChild(el('div', 'pj-u5-draw', railSvg({ t: K.t, lean: 0, u: -K.t }, { tilt: K.d, given: given, bg: '#f4efe4', aria: 'Two rails cut by a brace: ∠' + K.k + ' = ' + K.top + '° and ∠6 = ' + K.six + '°' }).svg));
      var g4 = grid(box);
      g4.appendChild(field('Are these rails parallel?', c.choice('par', [{ v: 'yes', html: 'Yes, parallel' }, { v: 'no', html: 'No, not parallel' }], { cls: 'pj-seg', aria: 'Are the rails parallel' })));
      g4.appendChild(field('For parallel rails, ∠6 should be', inA(c, 'fix', { aria: 'What angle 6 should be' })));
    },
    check: function (c) {
      if (!geo(c)) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var R = railGeo(c), out = [], m = R.ang(R.g);
      out.push(angR(c, 'meas', m, { tol: 2, label: '∠' + R.g, wrong: [{ v: 180 - m, tol: 2, hint: 'You read the <b>other scale</b>. ∠' + R.g + ' is ' + (m < 90 ? 'acute (sharper than a square corner)' : 'obtuse (wider than a square corner)') + '.' }], hint: 'Centre the protractor where the brace crosses the rail, 0 line along the rail, and read ∠' + R.g + '.' }));
      R.pairs.forEach(function (p, n) {
        var wm = {}; PAIR_IDS.forEach(function (id) { if (id !== p.cat) wm[id] = spot(p.a) + '; ' + spot(p.b).replace('∠', '∠') + '. ' + RELHINT[id] + ' Is that these two?'; });
        if ((p.cat === 'altI' || p.cat === 'altE')) wm.corr = 'Not corresponding: ' + spot(p.a) + ', but ' + spot(p.b) + '. They’re on <b>opposite sides</b> of the brace. ' + RELHINT.corr;
        if (p.cat === 'corr') { wm.altI = wm.altE = 'Not alternate: ' + spot(p.a) + ' and ' + spot(p.b) + ' — the <b>same spot</b> at each crossing.'; }
        out.push(c.equals('pair.' + (n + 1), p.cat, { label: '∠' + p.a + ' and ∠' + p.b, wrong: wm }));
      });
      var m1 = mine(c, 'meas', m);
      R.targets.forEach(function (k) {
        var r = rel(R.g, k), eqv = (k % 2) === (R.g % 2), exp = eqv ? m1 : 180 - m1;
        var w = eqv ? [{ v: 180 - m1, hint: 'These two angles are <b>equal</b> (' + REL[r].toLowerCase() + (r === 'vert' ? '' : ', with parallel rails') + '), not supplementary.' }, { v: 90 - m1, hint: 'Nothing here makes 90°. Are these two angles equal or supplementary?' }]
          : [{ v: m1, hint: r === 'line' ? 'They sit side by side on a straight line, so they add to <b>180°</b>.' : (r === 'sameI' ? 'Interior' : 'Exterior') + ' angles on the same side aren’t equal: with parallel rails they add to <b>180°</b>.' }, { v: 90 - m1, hint: 'Supplementary means adding to <b>180°</b>, not 90°.' }];
        out.push(angR(c, 'fa.' + k, exp, { tol: 0.01, label: '∠' + k, wrong: w, hint: 'Is ∠' + k + ' equal to ∠' + R.g + ', or do they add to 180°?', hint2: spot(k) + '; ' + spot(R.g) + '.' }));
        var wm = {}; REL_IDS.forEach(function (id) { if (id !== r) wm[id] = spot(k) + '. ' + RELHINT[id] + ' Is that ∠' + k + ' and ∠' + R.g + '?'; });
        if (r === 'altI' || r === 'altE') wm.corr = 'Not corresponding: ∠' + k + ' and ∠' + R.g + ' are on <b>opposite sides</b> of the brace. ' + RELHINT.corr;
        out.push(c.equals('fr.' + k, r, { label: 'Reason for ∠' + k, wrong: wm }));
      });
      var K = crook(c), rule = K.pair === 'sameI' ? '∠3 + ∠6 = ' + fx(K.top + K.six, 0) + '°. For parallel rails, interior angles on the same side add to <b>180°</b>.' : '∠' + K.k + ' = ' + K.top + '° and ∠6 = ' + K.six + '°. For parallel rails, ' + (K.pair === 'corr' ? 'corresponding' : 'alternate interior') + ' angles are <b>equal</b>.';
      out.push(c.equals('par', K.par ? 'yes' : 'no', { label: 'Parallel?', wrong: { yes: rule + ' Is that true here? They can look parallel and not be!', no: rule + ' Check the numbers again.' } }));
      out.push(angR(c, 'fix', K.t, { tol: 0.01, label: '∠6 for parallel rails', wrong: K.pair === 'sameI' ? [{ v: K.top, hint: 'Interior angles on the same side aren’t equal: they add to 180°. ∠6 = 180° − ∠3.' }] : [{ v: 180 - K.top, hint: (K.pair === 'corr' ? 'Corresponding' : 'Alternate interior') + ' angles are <b>equal</b> when the rails are parallel, not supplementary.' }], hint: K.pair === 'sameI' ? 'For parallel rails: ∠3 + ∠6 = 180°.' : 'For parallel rails: ∠6 = ∠' + K.k + '.' }));
      return out;
    },
    solve: function (c) {
      var R = railGeo(c), m = R.ang(R.g); c.set('meas', String(m));
      R.pairs.forEach(function (p, n) { c.set('pair.' + (n + 1), p.cat); });
      R.targets.forEach(function (k) { c.set('fa.' + k, String((k % 2) === (R.g % 2) ? m : 180 - m)); c.set('fr.' + k, rel(R.g, k)); });
      var K = crook(c); c.set('par', K.par ? 'yes' : 'no'); c.set('fix', String(K.t));
    }
  };

  /* ================= Checkpoint 6: border boards, a windmill and a post ================= */
  function mitreCorners(G) { var ob = G.corners.filter(function (k) { return k.type === 'obtuse'; })[0], ac = G.corners.filter(function (k) { return k.type === 'acute'; })[0]; return [ob, ac]; }
  /* two border boards meeting at angle A, with the cut line (the bisector) */
  function cornerSvg(A, lab) {
    var cx = 70, cy = 128, L = 120, w = 15, s = '<svg class="pj-u5-svg pj-u5-corner" viewBox="0 0 210 150" role="img" aria-label="Two border boards meeting at ' + esc(lab) + '">';
    var h = -A / 2, e1 = [Math.cos(0), Math.sin(0)], e2 = [Math.cos(-A * D2R), Math.sin(-A * D2R)], n1 = [0, -1], n2 = [Math.cos((-A + 90) * D2R), Math.sin((-A + 90) * D2R)];
    var m = 1 / Math.sin(A / 2 * D2R) * w, mid = [Math.cos(h * D2R) * m, Math.sin(h * D2R) * m];
    function P(p) { return (cx + p[0]).toFixed(1) + ',' + (cy + p[1]).toFixed(1); }
    s += '<polygon points="' + P([0, 0]) + ' ' + P([L, 0]) + ' ' + P([L + n1[0] * w, n1[1] * w]) + ' ' + P(mid) + '" class="pj-u5-bd"/>';
    s += '<polygon points="' + P([0, 0]) + ' ' + P([e2[0] * L, e2[1] * L]) + ' ' + P([e2[0] * L + n2[0] * w, e2[1] * L + n2[1] * w]) + ' ' + P(mid) + '" class="pj-u5-bd b2"/>';
    s += line([cx - Math.cos(h * D2R) * 10, cy - Math.sin(h * D2R) * 10], [cx + mid[0] * 1.9, cy + mid[1] * 1.9], 'pj-u5-cutl');
    s += '<path d="' + arcD(cx, cy, 34, -A, 0) + '" fill="none" stroke="#0f172a" stroke-width="2"/>' + txt(cx + Math.cos(h * D2R) * 52 + (A > 120 ? 4 : 0), cy + Math.sin(h * D2R) * 52 + 4, esc(lab), 'pj-u5-al');
    void e1;
    return s + '</svg>';
  }
  var BLADE = [26, 28, 32, 34, 37, 38, 41, 43], BETA = [33, 36, 38, 41, 47, 52, 56], LEAN = [83, 84, 86, 87, 93, 94, 96, 97];
  function mill(c) { return { th: BLADE[hv(c, 'bl') % BLADE.length], d1: -100, beta: BETA[hv(c, 'be') % BETA.length], lam: LEAN[hv(c, 'la') % LEAN.length] }; }
  function millSvg(Mi, copy, o) {
    o = o || {}; var cx = 220, cy = 182, L = 150, s = '<svg class="pj-u5-svg pj-u5-mill" viewBox="0 0 640 400" role="img" aria-label="A windmill: blade 1 is finished; blade 2 is being copied">';
    function P(d, r) { return [cx + Math.cos(d * D2R) * r, cy + Math.sin(d * D2R) * r]; }
    s += '<path d="M' + (cx - 40) + ' 396 L' + (cx - 16) + ' ' + (cy + 8) + ' L' + (cx + 16) + ' ' + (cy + 8) + ' L' + (cx + 40) + ' 396 Z" fill="#c2410c" stroke="#7c2d12" stroke-width="2"/><rect x="' + (cx - 10) + '" y="360" width="20" height="36" fill="#7c2d12"/>';
    function blade(d, th, cls, lab) { var a = P(d - th / 2, L), b = P(d + th / 2, L); return '<path d="M' + cx + ' ' + cy + ' L' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + ' Z" class="' + cls + '"/>' + (lab ? txt(P(d, L * 0.72)[0], P(d, L * 0.72)[1] + 5, lab, 'pj-u5-bl') : ''); }
    s += blade(Mi.d1 + 180, Mi.th, 'pj-u5-blade todo') + blade(Mi.d1 + 270, Mi.th, 'pj-u5-blade todo');
    s += blade(Mi.d1, Mi.th, 'pj-u5-blade', '1');
    var e1 = Mi.d1 + 90 - Mi.th / 2, e2 = e1 + copy, a2 = P(e1, L), b2 = P(e2, L);
    s += '<path d="M' + cx + ' ' + cy + ' L' + a2[0].toFixed(1) + ' ' + a2[1].toFixed(1) + ' L' + b2[0].toFixed(1) + ' ' + b2[1].toFixed(1) + ' Z" class="pj-u5-blade copy"/>' + txt(P(e1 + copy / 2, L * 0.72)[0], P(e1 + copy / 2, L * 0.72)[1] + 5, '2', 'pj-u5-bl');
    s += line([cx, cy], a2, 'pj-u5-edge') + '<g class="pj-u5-cedge">' + line([cx, cy], b2, 'pj-u5-edge mv') + (o.ro ? '' : '<circle class="pj-u5-handle" cx="' + b2[0].toFixed(1) + '" cy="' + b2[1].toFixed(1) + '" r="13"/>') + '</g>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#475569"/><circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="#0f172a"/>';
    return { svg: s + '</svg>', cx: cx, cy: cy, e1: e1, e2: e2, W: 640, H: 400 };
  }
  function millTool(c, Mi) {
    var cp = Math.round(Number(c.get('copy')) || 60), H = millSvg(Mi, cp, { ro: c.ro }), w = el('div', 'pj-u5-draw pj-u5-millbox', H.svg);
    w.dataset.f = 'copy'; w.dataset.inline = '0';
    var svg = w.querySelector('svg');
    function redraw() { var H2 = millSvg(Mi, cp, { ro: c.ro }), tmp = el('div', '', H2.svg), ns = tmp.querySelector('svg'); svg.innerHTML = ns.innerHTML; if (w.prot) w.prot.reattach(); }
    function setCopy(v) { cp = Math.max(10, Math.min(80, Math.round(v))); c.set('copy', String(cp)); redraw(); }
    if (!c.ro) {
      var drag = false, pt = function (e) { var m = svg.getScreenCTM(); if (!m) return null; var q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(m.inverse()); };
      svg.addEventListener('pointerdown', function (e) { if (!e.target.classList || !e.target.classList.contains('pj-u5-handle')) return; e.preventDefault(); drag = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {} });
      svg.addEventListener('pointermove', function (e) { if (!drag) return; var q = pt(e); if (!q) return; e.preventDefault(); setCopy(norm(Math.atan2(q.y - H.cy, q.x - H.cx) * R2D - H.e1)); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { svg.addEventListener(ev, function () { drag = false; }); });
      var bar = el('div', 'pj-u5-aimbar');
      bar.appendChild(el('span', 'pj-u5-ptip', '<b>Blade 2:</b> drag the round handle, or'));
      [['−5°', -5], ['−1°', -1], ['+1°', 1], ['+5°', 5]].forEach(function (b) { var bt = el('button', 'btn btn-ghost btn-small pj-u5-cp', b[0]); bt.type = 'button'; bt.dataset.d = b[1]; bt.addEventListener('click', function () { setCopy(cp + b[1]); }); bar.appendChild(bt); });
      w.appendChild(bar);
    }
    w.svg = svg; w.H = H; w.cp = function () { return cp; };
    return w;
  }
  function postSvg(Mi) {
    var s = '<svg class="pj-u5-svg pj-u5-post" viewBox="0 0 520 230" role="img" aria-label="A post perpendicular to the rail with a brace, and a second post that leans">', y = 196, px = 120, top = 46;
    s += '<rect x="10" y="' + y + '" width="500" height="12" rx="3" fill="#8a5a2b"/>' + line([10, y], [510, y], 'pj-u5-wall2');
    s += '<rect x="' + (px - 6) + '" y="' + top + '" width="12" height="' + (y - top) + '" fill="#64748b"/>' + '<path d="M' + (px + 6) + ' ' + (y - 14) + ' h14 v14" class="pj-u5-sq2"/>';
    var bh = 112, bx = px + bh / Math.tan(Mi.beta * D2R);
    s += line([px + 6, y - bh], [bx, y], 'pj-u5-bracel');
    s += '<path d="' + arcD(bx, y, 34, 180, 180 + Mi.beta) + '" fill="none" stroke="#0f172a" stroke-width="2"/>' + txt(bx - 50, y - 10, Mi.beta + '°', 'pj-u5-al');
    s += '<path d="' + arcD(px + 6, y - bh, 26, 90 - 0.01, 90 - (90 - Mi.beta)) + '" fill="none" stroke="#db2777" stroke-width="2.4"/>';
    s += '<path d="' + arcD(px + 6, y - bh, 26, Mi.beta, 90) + '" fill="none" stroke="#db2777" stroke-width="2.4"/>' + txt(px + 26, y - bh + 40, 'x', 'pj-u5-al', ' fill="#db2777"');
    var qx = 390, len = 150, d = -Mi.lam, tp = [qx + Math.cos(d * D2R) * len, y + Math.sin(d * D2R) * len];
    s += line([qx, y], tp, 'pj-u5-postl');
    s += '<path d="' + arcD(qx, y, 36, d, 0) + '" fill="none" stroke="#0f172a" stroke-width="2"/>' + txt(qx + 48, y - 14, Mi.lam + '°', 'pj-u5-al');
    s += '<path d="' + arcD(qx, y, 36, 180, 360 + d) + '" fill="none" stroke="#2563eb" stroke-width="2.4"/>' + txt(qx - 50, y - 14, 'y', 'pj-u5-al', ' fill="#2563eb"');
    s += txt(px, 34, 'post 1', 'pj-u5-sm') + txt(tp[0], tp[1] - 10, 'post 2', 'pj-u5-sm') + txt(470, y + 30, 'rail', 'pj-u5-sm');
    return s + '</svg>';
  }
  var cp6 = {
    id: 'cuts', title: 'Boards, a windmill and a post', needs: ['u5l5', 'u5l6'],
    goal: '<b>Bisect</b> corner angles to cut the border boards, <b>copy</b> an angle to make a second windmill blade, and check a <b>perpendicular</b> post.',
    example: { title: 'Dev builds the borders and a windmill', scene: '<div class="pj-u5-exwrap pj-u5-ex3">' + cornerSvg(90, '90°') + cornerSvg(115, '115°') + '</div>', steps: [
      { cap: 'Two border boards meet at a corner. Each board’s end is cut at <b>half</b> the corner angle: the cut line <b>bisects</b> the angle. A 90° picture-frame corner needs two 45° cuts.', html: eq('90° ÷ 2', 45) },
      { cap: 'Corner B of Dev’s hole is 115°. Each board gets half.', html: eq('115° ÷ 2', 57.5) },
      { cap: 'To bisect without a protractor: put the compass on the vertex and draw an arc across both arms. From those two points, draw two arcs that cross. A line from the vertex through the crossing splits the angle in half.', html: chip('compass: arc · two arcs · draw the line') },
      { cap: '<b>Copying an angle</b>: Dev’s windmill blades must match. He can trace blade 1 (tracing paper or a Mira), or copy it with a compass and straightedge: the same arcs on a new ray.', html: chip('trace it, or compass + straightedge') },
      { cap: 'A windmill post must be <b>perpendicular</b> to the rail (90°). A brace makes 35° with the rail, so in the triangle the brace and the post make the <b>complement</b>:', html: eq('90° − 35°', 55) }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      var MC = mitreCorners(G);
      part(box, 'A', 'Cut the border boards', 'The boards meet at each corner, and each board’s end is cut at <b>half</b> the corner angle. Use <b>your</b> corner angles from Checkpoint 2.');
      var row = el('div', 'pj-u5-cuts');
      [['tee', 90, 'Tee box corner (90°)'], [MC[0].L, mine(c, 'ang.' + MC[0].L, MC[0].A), 'Corner ' + MC[0].L], [MC[1].L, mine(c, 'ang.' + MC[1].L, MC[1].A), 'Corner ' + MC[1].L]].forEach(function (x) {
        var cell = el('div', 'pj-u5-cut'); cell.appendChild(el('div', 'pj-u5-cutpic', cornerSvg(Math.max(20, Math.min(170, x[1])), fx(x[1], 1) + '°')));
        cell.appendChild(field(x[2] + ': each board is cut at', inA(c, 'mitre.' + x[0], { aria: 'Cut angle for ' + x[2] }))); row.appendChild(cell);
      });
      box.appendChild(row);
      var Mi = mill(c);
      part(box, 'B', 'Copy a windmill blade', 'Blade 1 is finished. Measure its angle at the hub, then turn the second edge of blade 2 so it’s an exact <b>copy</b>.');
      var mt = millTool(c, Mi); box.appendChild(mt);
      if (!c.ro && hasDoc) { ensureDefs(); setTimeout(function () { if (!mt.svg.isConnected) return; var pts = function () { var e1 = mt.H.e1, e2 = e1 + mt.cp(); return [{ x: mt.H.cx, y: mt.H.cy, dirs: [Mi.d1 - Mi.th / 2, Mi.d1 + Mi.th / 2, e1, e2] }]; }; var key = 'cp6|' + Mi.th; mt.prot = { reattach: function () { var P2 = attachProt(mt.svg, key, { pts: pts, start: { x: 468, y: 394, rot: 0 } }); if (P2 && mt.pbar) mt.pbar.replaceWith(P2.bar); if (P2) mt.pbar = P2.bar; } }; mt.prot.reattach(); if (mt.pbar) mt.appendChild(mt.pbar); }, 0); }
      var g = grid(box);
      g.appendChild(field('Blade 1’s angle at the hub', inA(c, 'blade', { aria: 'Blade 1 angle' })));
      g.appendChild(field('Which of these copy an angle <b>without</b> measuring it?', c.choice('how', [{ v: 'compass', html: 'Compass and straightedge' }, { v: 'trace', html: 'Tracing paper or a Mira' }, { v: 'both', html: 'Both of these' }, { v: 'refs', html: 'Estimating with referents' }], { cls: 'pj-seg pj-u5-how', aria: 'How to copy an angle' })));
      part(box, 'C', 'Posts and braces', 'Post 1 is <b>perpendicular</b> to the rail. A brace runs from post 1 to the rail. Post 2 leans.');
      box.appendChild(el('div', 'pj-u5-draw pj-u5-postbox', postSvg(Mi)));
      var g2 = grid(box);
      g2.appendChild(field('x: between the brace and post 1', inA(c, 'post.x', { aria: 'Angle x' })));
      g2.appendChild(field('y: post 2 and the rail, on the other side', inA(c, 'post.y', { aria: 'Angle y' })));
      g2.appendChild(field('Is post 2 perpendicular to the rail?', c.choice('post.perp', [{ v: 'yes', html: 'Yes' }, { v: 'no', html: 'No' }], { cls: 'pj-seg', aria: 'Is post 2 perpendicular' })));
    },
    check: function (c) {
      var G = geo(c); if (!G) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [], MC = mitreCorners(G);
      out.push(angR(c, 'mitre.tee', 45, { label: 'Tee box cut', wrong: [{ v: 90, hint: 'A 90° cut is a square end. Two boards make the corner, so each is cut at <b>half</b> of 90°.' }, { v: 22.5, hint: 'That’s half of 45°. Bisect the 90° corner just once.' }], hint: 'Each board is cut at half the corner: 90° ÷ 2.' }));
      MC.forEach(function (cn) {
        var A1 = mine(c, 'ang.' + cn.L, cn.A);
        out.push(angR(c, 'mitre.' + cn.L, A1 / 2, { tol: 0.51, label: 'Corner ' + cn.L + ' cut', wrong: [{ v: A1, tol: 0.5, hint: 'That’s the whole corner. The cut <b>bisects</b> it: each board gets half.' }, { v: 180 - A1 / 2, tol: 0.5, hint: 'Half of the corner: ' + fx(A1, 1) + '° ÷ 2.' }, { v: 180 - A1, tol: 0.5, hint: 'That’s the supplement of the corner. Each board is cut at half the corner: ÷ 2.' }, { v: 90 - A1 / 2, tol: 0.5, hint: 'Each board is cut at half the corner angle itself: ' + fx(A1, 1) + '° ÷ 2.' }], hint: 'Cut = corner ÷ 2.', hint2: 'Try ' + fx(A1, 1) + ' ÷ 2.' }));
      });
      var Mi = mill(c), cp = Number(c.get('copy'));
      out.push(angR(c, 'blade', Mi.th, { tol: 2, label: 'Blade 1', wrong: [{ v: 180 - Mi.th, tol: 2, hint: 'You read the <b>other scale</b>. A blade is a sharp (acute) angle.' }], hint: 'Centre the protractor on the hub, 0 line along one edge of blade 1.' }));
      if (!c.has('copy')) out.push(R0('copy', false, { blank: true, label: 'Blade 2' }));
      else out.push(R0('copy', Math.abs(cp - Mi.th) <= 1, { label: 'Blade 2', hint: Math.abs(cp - Mi.th) <= 1 ? '' : 'Blade 2 is ' + (cp > Mi.th ? 'wider' : 'narrower') + ' than blade 1. Measure both with the protractor and turn the edge until they match.' }));
      out.push(c.equals('how', 'both', { label: 'Copying an angle', wrong: { compass: 'Yes, that works! Is it the <b>only</b> way in the list?', trace: 'Yes, that works! Is it the <b>only</b> way in the list?', refs: 'Estimating gets close, but it isn’t an exact copy.' } }));
      out.push(angR(c, 'post.x', 90 - Mi.beta, { label: 'x', wrong: [{ v: 180 - Mi.beta, hint: 'That’s the <b>supplement</b> (adds to 180°). The post and the rail make 90°, so in the triangle x + ' + Mi.beta + '° = 90°: <b>complementary</b>.' }, { v: Mi.beta, hint: 'x isn’t equal to the brace angle. x + ' + Mi.beta + '° = 90°.' }], hint: 'The post is perpendicular (90°), so x and ' + Mi.beta + '° are complementary.' }));
      out.push(angR(c, 'post.y', 180 - Mi.lam, { label: 'y', wrong: [{ v: 90 - Mi.lam, hint: 'That’s the <b>complement</b>. y and ' + Mi.lam + '° sit on a straight line (the rail): they’re <b>supplementary</b>, 180°.' }, { v: Mi.lam, hint: 'They’re not equal: y + ' + Mi.lam + '° = 180° (a straight line).' }, { v: 360 - Mi.lam, hint: 'y and ' + Mi.lam + '° make a straight line: 180°, not 360°.' }], hint: 'y + ' + Mi.lam + '° = 180°.' }));
      out.push(c.equals('post.perp', 'no', { label: 'Post 2', wrong: { yes: 'Perpendicular means exactly <b>90°</b> on both sides. Post 2 makes ' + Mi.lam + '°.' } }));
      return out;
    },
    solve: function (c) {
      var G = geo(c), MC = mitreCorners(G), Mi = mill(c); c.set('mitre.tee', '45');
      MC.forEach(function (cn) { c.set('mitre.' + cn.L, fx(mine(c, 'ang.' + cn.L, cn.A) / 2, 1)); });
      c.set('copy', String(Mi.th)); c.set('blade', String(Mi.th)); c.set('how', 'both'); c.set('post.x', String(90 - Mi.beta)); c.set('post.y', String(180 - Mi.lam)); c.set('post.perp', 'no');
    }
  };

  /* ================= Checkpoint 7: the puzzle obstacle, the hole design card, hand it in ================= */
  function pieceSvg(cs, col, cell) {
    cell = cell || 12; var R = Math.max.apply(null, cs.map(function (q) { return q[0]; })) + 1, C = Math.max.apply(null, cs.map(function (q) { return q[1]; })) + 1;
    return '<svg class="pj-u5-pcs" viewBox="-1 -1 ' + (C * cell + 2) + ' ' + (R * cell + 2) + '" width="' + (C * cell + 2) + '" height="' + (R * cell + 2) + '" aria-hidden="true">' + cs.map(function (q) { return '<rect x="' + q[1] * cell + '" y="' + q[0] * cell + '" width="' + cell + '" height="' + cell + '" fill="' + col + '" stroke="#fff" stroke-width="1.2" rx="1.5"/>'; }).join('') + '</svg>';
  }
  /* a pad drawing: list of { p, cells } (p '?' = no name), o: { cell, letters, preview: { cells, ok } } */
  function padSvg(pad, list, o) {
    o = o || {}; var S = o.cell || 44, m = o.margin == null ? 6 : o.margin, W = pad.cols * S + 2 * m, Hh = pad.rows * S + 2 * m, s = '';
    var minR = 0, minC = 0, maxR = pad.rows, maxC = pad.cols;
    list.forEach(function (t) { t.cells.forEach(function (q) { minR = Math.min(minR, q[0]); minC = Math.min(minC, q[1]); maxR = Math.max(maxR, q[0] + 1); maxC = Math.max(maxC, q[1] + 1); }); });
    var ox = m - minC * S, oy = m - minR * S; W = (maxC - minC) * S + 2 * m; Hh = (maxR - minR) * S + 2 * m;
    s += '<svg class="pj-u5-svg pj-u5-pad" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="' + esc(o.aria || 'The obstacle pad, ' + pad.rows + ' by ' + pad.cols + ' squares') + '">';
    for (var r = 0; r < pad.rows; r++) for (var cc = 0; cc < pad.cols; cc++) s += '<rect class="pj-u5-cell" data-r="' + r + '" data-c="' + cc + '" x="' + (ox + cc * S) + '" y="' + (oy + r * S) + '" width="' + S + '" height="' + S + '"/>';
    list.forEach(function (t, i) {
      var col = t.p === '?' ? ['#60a5fa', '#f472b6', '#facc15', '#4ade80', '#a78bfa'][i % 5] : PCOL[t.p] || '#94a3b8';
      t.cells.forEach(function (q) { s += '<rect class="pj-u5-pcell" data-i="' + i + '" x="' + (ox + q[1] * S + 2) + '" y="' + (oy + q[0] * S + 2) + '" width="' + (S - 4) + '" height="' + (S - 4) + '" rx="5" fill="' + col + '"/>'; });
      if (o.letters !== false && t.p !== '?') { var g = grabCell(normCells(t.cells)), b0 = normCells(t.cells), dr = t.cells.reduce(function (a, q) { return Math.min(a, q[0]); }, 99), dc = t.cells.reduce(function (a, q) { return Math.min(a, q[1]); }, 99); void b0; s += txt(ox + (g[1] + dc) * S + S / 2, oy + (g[0] + dr) * S + S / 2 + 6, t.p, 'pj-u5-pl'); }
    });
    if (o.preview) o.preview.cells.forEach(function (q) { s += '<rect class="pj-u5-prev' + (o.preview.ok ? '' : ' no') + '" x="' + (ox + q[1] * S + 3) + '" y="' + (oy + q[0] * S + 3) + '" width="' + (S - 6) + '" height="' + (S - 6) + '" rx="5"/>'; });
    s += '<rect x="' + ox + '" y="' + oy + '" width="' + pad.cols * S + '" height="' + pad.rows * S + '" fill="none" stroke="#8a5a2b" stroke-width="4" rx="3"/>';
    return s + '</svg>';
  }
  var TSEL = {};
  function placeAt(p, k, r, cc) { var cs = orient(p, k), g = grabCell(cs); return cs.map(function (q) { return [q[0] - g[0] + r, q[1] - g[1] + cc]; }); }
  function tileTool(c, pad, key, onTile) {
    var w = el('div', 'pj-u5-tiler'); w.dataset.f = 'tile'; w.dataset.inline = '0';
    var st = TSEL[key] || (TSEL[key] = { p: null, k: 0 }), hover = null, msg = el('div', 'pj-u5-status');
    function L() { return tileState(c, pad).list; }
    function fits(cells, list) { var used = {}; list.forEach(function (t) { t.cells.forEach(function (q) { used[q[0] + ',' + q[1]] = 1; }); }); return cells.every(function (q) { return q[0] >= 0 && q[1] >= 0 && q[0] < pad.rows && q[1] < pad.cols && !used[q[0] + ',' + q[1]]; }); }
    var pal = el('div', 'pj-u5-pal'), side = el('div', 'pj-u5-tside'), board = el('div', 'pj-u5-board');
    function draw() {
      if (onTile) onTile();
      var list = L(), usedP = {}; list.forEach(function (t) { usedP[t.p] = 1; });
      pal.innerHTML = '';
      PIDS.forEach(function (p) {
        var b = el('button', 'pj-u5-pp' + (usedP[p] ? ' used' : '') + (st.p === p ? ' on' : ''), pieceSvg(ORI[p][0].cs, PCOL[p], 9) + '<span>' + p + '</span>'); b.type = 'button'; b.dataset.p = p;
        b.setAttribute('aria-pressed', st.p === p ? 'true' : 'false'); b.title = usedP[p] ? 'Already on the pad (tap it there to pick it up)' : 'Pick the ' + p + ' piece';
        if (c.ro || usedP[p]) b.disabled = true;
        b.addEventListener('click', function () { st.p = st.p === p ? null : p; st.k = 0; hover = null; draw(); });
        pal.appendChild(b);
      });
      side.innerHTML = '';
      if (st.p && !c.ro) {
        side.appendChild(el('div', 'pj-u5-sel', '<small>Your piece</small><div class="pj-u5-selp" data-k="' + st.k + '">' + pieceSvg(orient(st.p, st.k), PCOL[st.p], 16) + '</div>'));
        var row = el('div', 'pj-u5-selb');
        var tb = el('button', 'btn btn-ghost btn-small pj-u5-turn', 'Turn ↻'); tb.type = 'button'; tb.addEventListener('click', function () { st.k = (st.k >= 4 ? 4 : 0) + ((st.k % 4) + 1) % 4; draw(); }); row.appendChild(tb);
        var fb = el('button', 'btn btn-ghost btn-small pj-u5-flip', 'Flip ⇋'); fb.type = 'button'; fb.addEventListener('click', function () { st.k = (st.k + 4) % 8; draw(); }); row.appendChild(fb);
        side.appendChild(row);
        side.appendChild(el('p', 'pj-u5-tiptxt', 'Tap a square on the pad to put the piece’s <b>middle</b> there.'));
      } else if (!c.ro) side.appendChild(el('p', 'pj-u5-tiptxt', 'Pick a piece above. Tap a piece on the pad to pick it back up.'));
      if (!c.ro && list.length) { var cl = el('button', 'btn btn-ghost btn-small pj-u5-clear', 'Clear the pad'); cl.type = 'button'; cl.addEventListener('click', function () { c.set('tile', ''); draw(); }); side.appendChild(cl); }
      var prev = null; if (hover && st.p) { var cells = placeAt(st.p, st.k, hover[0], hover[1]); prev = { cells: cells.filter(function (q) { return q[0] >= 0 && q[1] >= 0 && q[0] < pad.rows && q[1] < pad.cols; }), ok: fits(cells, list) }; }
      board.innerHTML = padSvg(pad, list, { preview: prev, margin: 6 });
      var ts = tileState(c, pad); msg.className = 'pj-u5-status' + (ts.full ? ' good' : '');
      msg.innerHTML = ts.full ? '✓ The pad is covered: ' + list.length + ' pieces, no gaps, no overlaps.' : '<b>' + ts.covered + '</b> of ' + pad.rows * pad.cols + ' squares covered.';
    }
    function cellOf(e) { var t = e.target; if (!t || !t.getAttribute) return null; if (t.getAttribute('data-r') != null) return [Number(t.getAttribute('data-r')), Number(t.getAttribute('data-c'))]; return null; }
    if (!c.ro) {
      board.addEventListener('click', function (e) {
        var t = e.target, list = L();
        if (t && t.getAttribute && t.getAttribute('data-i') != null) { var i = Number(t.getAttribute('data-i')), pc = list[i]; list.splice(i, 1); c.set('tile', list.length ? JSON.stringify(list) : ''); if (pc && !st.p) { st.p = pc.p; st.k = 0; } draw(); return; }
        var rc = cellOf(e); if (!rc || !st.p) return;
        var cells = placeAt(st.p, st.k, rc[0], rc[1]);
        if (!fits(cells, list)) { msg.className = 'pj-u5-status miss'; msg.innerHTML = 'That doesn’t fit there: it would ' + (cells.some(function (q) { return q[0] < 0 || q[1] < 0 || q[0] >= pad.rows || q[1] >= pad.cols; }) ? 'hang off the pad' : 'overlap another piece') + '. Try another spot, or turn it.'; return; }
        list.push({ p: st.p, cells: cells }); c.set('tile', JSON.stringify(list)); st.p = null; hover = null; draw();
      });
      board.addEventListener('pointermove', function (e) { var rc = cellOf(e); if (!st.p || e.pointerType === 'touch') return; if (rc && (!hover || hover[0] !== rc[0] || hover[1] !== rc[1])) { hover = rc; draw(); } });
      board.addEventListener('pointerleave', function () { if (hover) { hover = null; draw(); } });
    }
    draw();
    w.appendChild(pal); var main = el('div', 'pj-u5-tmain'); main.appendChild(board); main.appendChild(side); w.appendChild(main); w.appendChild(msg);
    return w;
  }
  var STRATS = ['Start with the hardest piece or the corners', 'Guess and check', 'Eliminate possibilities', 'Draw or model it', 'Make a systematic list', 'Work backward', 'Look for a pattern'];
  var ERR_OPTS = [{ v: 'twice', html: 'It uses the same piece twice' }, { v: 'six', html: 'Two pieces aren’t pentominoes (6 and 4 squares)' }, { v: 'off', html: 'A piece hangs off the pad and leaves squares empty' }, { v: 'none', html: 'Nothing — it’s a good tiling' }];

  /* ---- the hole design card (printable; shown in the Teacher Ledger) ---- */
  var FLAG = '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="41" rx="17" ry="5" fill="currentColor" opacity=".25"/><ellipse cx="24" cy="40" rx="5" ry="1.8" fill="currentColor"/><path d="M24 40V6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M25 6l16 6-16 6z" fill="currentColor"/><circle cx="12" cy="36" r="3.2" fill="#fff" stroke="currentColor" stroke-width="2"/></svg>';
  function cardHtml(c) {
    var G = geo(c); if (!G) return '';
    var t = theme(c) || THEMES.farm, C0 = course(c), R = railGeo(c), Mi = mill(c), MC = mitreCorners(G), pad = padOf(c), col = carpet(c);
    var vals = {}, own = function (k, fb) { var x = pa(c.get(k)); return isNaN(x) ? fb : x; };
    G.corners.forEach(function (cn) { var x = own('ang.' + cn.L, null); vals[cn.L] = x == null ? '?' : fx(x, 1) + '°'; });
    var mr = own('meas', null), bx = Math.min(G.pts[0][0] + G.pts[1][0], G.pts[G.n - 2][0] + G.pts[G.n - 1][0]) / 2 * 0.55 + 1.2;
    var ext = function (X, Y, S) {
      var y1 = G.pts[0][1], y2 = G.pts[G.n - 1][1], ct = 1 / Math.tan(R.t * D2R), off = (y2 - y1) * ct * (R.lean ? 1 : -1), xb = bx + off;
      return line([X(bx), Y(y1)], [X(xb), Y(y2)], 'pj-u5-cbrace') + txt((X(bx) + X(xb)) / 2 + 10, (Y(y1) + Y(y2)) / 2 + 4, 'ramp', 'pj-u5-sm', ' text-anchor="start" fill="#334155"') + '<circle cx="' + X(bx).toFixed(1) + '" cy="' + Y(y1).toFixed(1) + '" r="3" fill="#0f172a"/>';
    };
    var H = holeSvg(G, { color: col, labels: 'angles', vals: vals, flag: t.ob, S: 30, pad: 54, extra: ext, aria: 'Hole design: every corner with its angle' });
    var ts = tileState(c, pad), sum = G.corners.reduce(function (a, cn) { return a + own('ang.' + cn.L, cn.A); }, 0), a1 = own('in', null), b1 = own('brg', null), bk = own('back', null);
    function row(k, v) { return '<div class="pj-u5-cr"><span>' + k + '</span><b>' + v + '</b></div>'; }
    var d = new Date();
    return '<div class="pj-u5-card" style="--cc:' + esc(col) + '">' +
      '<div class="pj-u5-c-top"><div class="pj-u5-c-logo">' + FLAG + '</div><div class="pj-u5-c-id"><small>' + esc(C0.town) + ' Summer Fair Mini-Golf · Hole ' + C0.hole + '</small><b>' + esc(holeName(c)) + '</b><span>' + t.icon + ' ' + esc(t.name) + ' · ' + esc(G.S.name) + '</span></div><div class="pj-u5-c-no"><b>HOLE</b><span class="n">' + C0.hole + '</span><span>' + esc(d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })) + '</span></div></div>' +
      '<div class="pj-u5-c-body"><div class="pj-u5-c-plan">' + H.svg + '</div><div class="pj-u5-c-notes">' +
      '<h5>Corners</h5>' + G.corners.map(function (cn) { var x = own('ang.' + cn.L, null), ty = c.get('typ.' + cn.L); return row('∠' + cn.L, x == null ? '—' : fx(x, 1) + '° <i>' + esc(ty || typeOf(x)) + '</i>'); }).join('') + row('Sum', fx(sum, 1) + '° = (' + G.n + ' − 2) × 180°') +
      '<h5>Bank shot</h5>' + row('Angle in = angle out', a1 == null ? '—' : fx(a1, 1) + '°') +
      '<h5>Park map</h5>' + row('Clubhouse → hole', b1 == null ? '—' : b3(b1) + '°') + row('Hole → clubhouse', bk == null ? '—' : b3(bk) + '°') +
      '<h5>Ramp across the parallel rails</h5>' + row('Brace angles', mr == null ? '—' : fx(mr, 1) + '° and ' + fx(180 - mr, 1) + '°') +
      '<h5>Building it</h5>' + row('Mitre cuts', [own('mitre.tee', 45)].concat(MC.map(function (cn) { return own('mitre.' + cn.L, null); })).map(function (x) { return x == null ? '—' : fx(x, 1) + '°'; }).join(', ')) + row('Windmill blades', fx(own('blade', Mi.th), 1) + '° each') + row('Windmill post', '⊥ rail (90°)') +
      '</div></div>' +
      '<div class="pj-u5-c-foot"><div class="pj-u5-c-pad"><small>Puzzle obstacle: ' + pad.rows + ' × ' + pad.cols + ' pad, ' + ts.list.length + ' pentominoes</small>' + padSvg(pad, ts.list, { cell: 18, margin: 2 }) + '</div>' +
      '<div class="pj-u5-c-tip">' + (c.get('tipNote') ? esc(c.get('tipNote')) : 'Designer’s tip: bank it off the wall at ' + (a1 == null ? '—' : fx(a1, 1) + '°') + ' to get around the ' + esc(t.obst) + '!') + '</div></div>' +
      '</div>';
  }
  var cp7 = {
    id: 'card', title: 'Puzzle obstacle — and hand it in', needs: ['u5l1', 'u5l2'], submit: true,
    goal: 'Fill your <b>obstacle pad</b> with pentominoes (and explain your strategy), spot the mistake in someone else’s tiling, then print your <b>hole design card</b> and hand it in.',
    passMsg: 'Your hole has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Dev’s pentomino pad', scene: '<div class="pj-u5-exwrap pj-u5-expad">' + padSvg({ rows: 3, cols: 5 }, [{ p: 'U', cells: [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]] }], { cell: 34 }) + padSvg({ rows: 3, cols: 5 }, [{ p: 'U', cells: [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]] }, { p: 'X', cells: [[1, 1], [0, 2], [1, 2], [2, 2], [1, 3]] }, { p: 'U', cells: [[0, 3], [2, 3], [0, 4], [1, 4], [2, 4]] }], { cell: 34 }) + '</div>', steps: [
      { cap: 'Dev’s pad is 3 × 5 = 15 squares. Each pentomino covers 5 squares, so it takes 15 ÷ 5 pieces.', html: eq('15 ÷ 5', 3, ' pieces') },
      { cap: '<b>Strategy:</b> fill the <b>corners</b> and edges first — they’re the hardest to reach. He tries the U in the left corner…', html: chip('Start with the corners') },
      { cap: '…then an X fits the U’s notch, and another U fills the right end. The pad is full!', html: chip('U + X + U = 15 squares ✓') },
      { cap: '<b>But there’s a mistake!</b> A pentomino set has only <b>one</b> of each piece, and he used the U twice. (A flipped or turned piece is still the same piece.)', html: chip('❌ same piece twice') },
      { cap: 'Fix it by <b>eliminating</b> the X: in this 3 × 5 pad an X always needs a U on each side. Dev tries other pieces until the pad works with each piece used once.', html: chip('Eliminate the X → try L, T, Y …') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish the checkpoints before this one first.');
      var pad = padOf(c), t = theme(c) || THEMES.farm;
      part(box, 'A', 'The obstacle pad', 'Your hole gets a raised puzzle pad, <b>' + pad.rows + ' × ' + pad.cols + '</b> squares (1 square = 1 ft). It must be covered exactly with pentominoes, each piece used <b>once</b>.');
      box.appendChild(field('How many pentominoes will cover the pad?', inA(c, 'pieces', { aria: 'Number of pentominoes', unit: 'pieces' }), 'pj-u5-one'));
      part(box, 'B', 'Tile it', 'Pick a piece, turn or flip it, and tap the pad.');
      box.appendChild(tileTool(c, pad, 'cp7|' + pad.rows + 'x' + pad.cols, function () { var q = box.querySelector('.pj-u5-cardwrap'); if (q) q.innerHTML = cardHtml(c); }));
      part(box, 'C', 'Your strategy', '');
      box.appendChild(field('Which strategy helped most?', c.select('strat', STRATS.map(function (s) { return { v: s, t: s }; }), { aria: 'Strategy', ph: 'Choose a strategy…' }), 'pj-u5-one'));
      box.appendChild(field('Explain how you used it (which pieces did you try first, and why?)', c.text('stratWhy', { area: true, rows: 2, max: 300, ph: 'e.g. I put the I piece along the long edge first because…', aria: 'Explain your strategy' }), 'pj-wide'));
      var E = errTiling(c);
      part(box, 'D', 'Spot the mistake', 'Jordan says this tiling of the same pad works. What’s wrong with it?');
      if (E) box.appendChild(el('div', 'pj-u5-draw pj-u5-errpad', padSvg(E.pad, E.list, { cell: 40, letters: false, aria: 'Jordan’s tiling' })));
      box.appendChild(c.choice('err', ERR_OPTS, { cls: 'pj-u5-errs', aria: 'What is wrong' }));
      part(box, 'E', 'Your hole design card', 'Everything you worked out, on one card. Add a tip for players if you like, then print it.');
      box.appendChild(field('Designer’s tip for players (optional)', c.text('tipNote', { ph: 'e.g. Bank it off the wall at 33° to get around the ' + t.obst + '!', max: 90, aria: 'Tip for players', onInput: function () { var q = box.querySelector('.pj-u5-cardwrap'); if (q) q.innerHTML = cardHtml(c); } }), 'pj-wide'));
      box.appendChild(el('div', 'pj-u5-cardwrap', cardHtml(c)));
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my design card'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<link rel="stylesheet" href="' + PJ.site + 'assets/projects-u5.css"><div class="pj-printsheet">' + cardHtml(c) + '</div>', holeName(c) + ' design card'); });
      if (!c.ro) box.appendChild(pr);
      part(box, 'F', 'Look back', '');
      box.appendChild(field('Which angle fact helped your design the most? Say where you used it.', c.text('reflect', { area: true, rows: 3, max: 500, ph: 'e.g. Angle in = angle out, because I aimed my bank shot at…', aria: 'Reflection' }), 'pj-wide'));
    },
    check: function (c) {
      var G = geo(c); if (!G) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var pad = padOf(c), out = [], A = pad.rows * pad.cols;
      out.push(angR(c, 'pieces', pad.n, { label: 'Pieces', wrong: [{ v: A, hint: 'That’s the number of <b>squares</b>. Each pentomino covers 5 squares: divide by 5.' }, { v: 5, hint: 'Each piece covers 5 squares. How many pieces for ' + A + ' squares?' }, { v: pad.rows + pad.cols, hint: 'Count the squares first: ' + pad.rows + ' × ' + pad.cols + '. Then ÷ 5.' }], hint: 'Squares ÷ 5.' }));
      var ts = tileState(c, pad);
      if (!ts.list.length) out.push(R0('tile', false, { blank: true, label: 'The pad' }));
      else out.push(R0('tile', ts.full, { label: 'The pad', hint: ts.full ? '' : ts.covered + ' of ' + A + ' squares are covered. ' + (pad.n - ts.list.length > 0 ? 'You need ' + (pad.n - ts.list.length) + ' more piece' + (pad.n - ts.list.length === 1 ? '' : 's') + '. If a gap is the wrong shape, pick a piece back up and try another.' : 'Something doesn’t fit.'), hint2: 'Fill the corners first. Long thin pieces (I, L) fit along the edges.' }));
      out.push(c.need('strat', { label: 'Strategy' }));
      out.push(c.need('stratWhy', { min: 20, label: 'Your strategy', hint: 'Write a sentence or two about how you found your tiling.' }));
      var E = errTiling(c), wm = {};
      var desc = { twice: 'Look at the pieces’ <b>shapes</b>: is any shape there twice (turned or flipped counts as the same)?', six: 'Count the squares in <b>each</b> piece. A pentomino has exactly 5.', off: 'Look at the edges of the pad: does every piece stay on it? Is every square covered?', none: 'Check it carefully: count each piece’s squares, compare their shapes, and look at the edges.' };
      ERR_OPTS.forEach(function (o) { if (!E || o.v !== E.kind) wm[o.v] = (o.v === 'none' ? 'There is a mistake. ' : 'Not that one. ') + desc[E ? E.kind : 'none']; });
      out.push(c.equals('err', E ? E.kind : 'none', { label: 'Jordan’s mistake', wrong: wm }));
      out.push(c.need('reflect', { min: 20, label: 'Look back', hint: 'Write a sentence or two: which angle fact, and where did you use it?' }));
      return out;
    },
    solve: function (c) {
      var pad = padOf(c), E = errTiling(c); c.set('pieces', String(pad.n));
      c.set('tile', JSON.stringify(tilePad(pad.rows, pad.cols, seededOrder(c, 'solve'))));
      c.set('strat', STRATS[0]); c.set('stratWhy', 'I filled the corners first with the L and the U, then tried pieces in the gap until one fit.');
      c.set('err', E ? E.kind : 'none'); c.set('reflect', 'Angle in = angle out. I aimed my bank shot at the mirror cup so it bounced off the wall into the cup.');
    }
  };

  PJ.golf.bank = bank; PJ.golf.bankOf = bankOf; PJ.golf.aimPath = aimPath; PJ.golf.nearRef = nearRef; PJ.golf.mapGeo = mapGeo; PJ.golf.railGeo = railGeo; PJ.golf.rel = rel; PJ.golf.crook = crook;
  PJ.golf.mill = mill; PJ.golf.mitreCorners = mitreCorners; PJ.golf.cardHtml = cardHtml; PJ.golf.placeAt = placeAt; PJ.golf.seededOrder = seededOrder; PJ.golf.holeSvg = holeSvg;
  HW.defineProject({
    id: 'u5', unit: 5, title: 'Mini-Golf Designer', outcomes: ['G1', 'G5', 'G6'], icon: FLAG,
    tagline: 'Design a hole for the summer fair’s mini-golf course: measure its corners, bank a shot, map it, build it and add a puzzle.',
    intro: '<div class="pj-intro-art">' + FLAG + '</div><div><b>Welcome to Mini-Golf Designer!</b> A summer fair is building a mini-golf course, and you’re designing one hole. In 7 checkpoints you’ll use the angles, bearings, parallel lines and puzzles from Unit 5 to measure it, aim a bank shot, put it on the map, build it, and print a design card. Your work saves as you go. It’s due on the Unit 5 test day.</div>',
    lessonNames: { u5l1: 'Tangrams and Pentominoes', u5l2: 'Spatial Games', u5l3: 'Measuring Angles', u5l4: 'Referents and Bearings', u5l5: 'Copying and Bisecting', u5l6: 'Angle Partners', u5l7: 'Transversals', u5l8: 'Parallel Lines' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: cardHtml
  });
})(typeof window !== 'undefined' ? window : global);
