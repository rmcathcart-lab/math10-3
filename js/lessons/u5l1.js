/* Math 10-3 · Unit 5 · Lesson 1 — Spatial Puzzles: Tangrams and Pentominoes (G1)
 * Assignment 1 (u5_l01.tex, Questions 1–18) and the Lesson 1 Extra Practice (u5_ep01.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the same puzzle and difficulty as the booklet item with new shapes, pieces or numbers (the
 * lesson's worked examples are left out: the 3 by 3 grid, the 20 cm tangram, the L–T–Y rectangle, the X closed cube).
 * Calculator allowed.
 * Answers are all checked automatically: counts and areas are numbers; "is it a pentomino / same or different / does it
 * fold into an open box / could this set work" are yes/no tables with the shapes drawn; "which square is the bottom"
 * and "which squares could you add" use numbered squares; tilings ask which piece covers each numbered square (one
 * piece is placed so the answer is unique) or which piece fills the gap; "make this shape" becomes "which picture shows
 * it made from exactly these pieces"; "identify the error / describe your strategy / which tip" → multiple choice of
 * reasons (one right).
 * Recognised wrong values get their own hint: counting only the 1 by 1 squares, each piece as 1/7 of the tangram, the
 * side length divided by 16 instead of the area, a large triangle as 1/8 (or 2 small triangles), counting flipped
 * tetrominoes as new, adding n instead of n², a number of pieces given as an area, and so on.
 *
 * Shared kit for later Unit 5 lessons: HW.u5poly — polyomino tools (the 12 pentominoes and 5 tetrominoes as the booklet
 * draws them, turns and flips, "same shape?", folding into an open box or a cube, an exact rectangle-tiling solver) and
 * SVG pictures in the booklet's look (polyominoes with numbers or a grid, tiling boards, tangram pieces).
 * Outcome G1. Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ======================= polyomino kit (HW.u5poly) ======================= */
  var PK = HW.u5poly = HW.u5poly || {};
  var INK = '#1d2633', GRID = '#b4bac4', FILL = '#dfe3ea', HI = '#f2c14e', FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  var TINT = ['#cfe0f7', '#f9d9b0', '#cdeccb', '#ead7f7', '#f7d0d6'];
  function keyOf(c) { return c.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); }
  function ck(p) { return p[0] + ',' + p[1]; }
  function norm(c) {
    var mx = Infinity, my = Infinity; c.forEach(function (p) { mx = Math.min(mx, p[0]); my = Math.min(my, p[1]); });
    return c.map(function (p) { return [p[0] - mx, p[1] - my]; }).sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; });
  }
  /* the 8 turns and flips: 0–3 turns (counterclockwise quarter turns), 4–7 flips */
  function tf(p, k) { var x = p[0], y = p[1]; return [[x, y], [-y, x], [-x, -y], [y, -x], [-x, y], [y, x], [x, -y], [-y, -x]][k]; }
  function move(c, k) { return norm(c.map(function (p) { return tf(p, k); })); }
  function orients(c) { var seen = {}, out = []; for (var k = 0; k < 8; k++) { var n = move(c, k), kk = keyOf(n); if (!seen[kk]) { seen[kk] = 1; out.push(n); } } return out; }
  function turnsOnly(c) { var seen = {}, out = []; for (var k = 0; k < 4; k++) { var n = move(c, k), kk = keyOf(n); if (!seen[kk]) { seen[kk] = 1; out.push(n); } } return out; }
  function canon(c) { return orients(c).map(keyOf).sort()[0]; }
  function parse(s) { return norm(s.split(',').map(function (x) { return x.split('/').map(Number); })); }
  var PENT = { F: '1/0,1/1,1/2,0/1,2/2', I: '0/0,0/1,0/2,0/3,0/4', L: '0/0,0/1,0/2,0/3,1/0', N: '0/0,0/1,1/1,1/2,1/3', P: '0/0,0/1,0/2,1/1,1/2', T: '0/2,1/2,2/2,1/1,1/0',
    U: '0/0,1/0,2/0,0/1,2/1', V: '0/0,1/0,2/0,0/1,0/2', W: '0/0,1/0,1/1,2/1,2/2', X: '1/0,0/1,1/1,2/1,1/2', Y: '0/0,1/0,2/0,3/0,1/1', Z: '0/2,1/2,1/1,1/0,2/0' };
  var TETRO = { I: '0/0,1/0,2/0,3/0', L: '0/0,1/0,2/0,0/1', T: '0/0,1/0,2/0,1/1', O: '0/0,1/0,0/1,1/1', S: '0/0,1/0,1/1,2/1' };
  Object.keys(PENT).forEach(function (k) { PENT[k] = parse(PENT[k]); });
  Object.keys(TETRO).forEach(function (k) { TETRO[k] = parse(TETRO[k]); });
  var LETTERS = Object.keys(PENT), CANON = {}; LETTERS.forEach(function (L) { CANON[canon(PENT[L])] = L; });
  var CHIRAL = ['F', 'L', 'N', 'P', 'Y', 'Z'];
  PK.PENT = PENT; PK.TETRO = TETRO; PK.LETTERS = LETTERS; PK.CHIRAL = CHIRAL; PK.norm = norm; PK.move = move; PK.orients = orients; PK.canon = canon; PK.keyOf = keyOf;
  PK.letterOf = function (c) { return CANON[canon(c)] || null; };
  PK.sameShape = function (a, b) { return canon(a) === canon(b); };
  /* how b is got from a: 'same' (no move), 'turn', 'flip' (needs a flip), or null (different shapes) */
  PK.relation = function (a, b) {
    var kb = keyOf(norm(b));
    if (keyOf(norm(a)) === kb) return 'same';
    for (var k = 1; k < 4; k++) if (keyOf(move(a, k)) === kb) return 'turn';
    for (k = 4; k < 8; k++) if (keyOf(move(a, k)) === kb) return 'flip';
    return null;
  };
  function has(c, p) { for (var i = 0; i < c.length; i++) if (c[i][0] === p[0] && c[i][1] === p[1]) return true; return false; }
  var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  /* roll a cube over the squares (each square is the face the cube sits on). faces: B T N S E W = 0 1 2 3 4 5 */
  PK.fold = function (cells) {
    var faces = {}, used = {}, q = [[cells[0], [0, 1, 2, 3, 4, 5]]], good = true;
    faces[ck(cells[0])] = 0; used[0] = 1;
    while (q.length) {
      var cur = q.shift(), p = cur[0], s = cur[1];
      DIRS.forEach(function (d) {
        var np = [p[0] + d[0], p[1] + d[1]];
        if (!has(cells, np) || faces[ck(np)] != null) return;
        var B = s[0], T = s[1], N = s[2], S = s[3], E = s[4], W = s[5], ns;
        if (d[0] === 1) ns = [E, W, N, S, T, B]; else if (d[0] === -1) ns = [W, E, N, S, B, T]; else if (d[1] === 1) ns = [N, S, T, B, E, W]; else ns = [S, N, B, T, E, W];
        if (used[ns[0]]) good = false; used[ns[0]] = 1; faces[ck(np)] = ns[0]; q.push([np, ns]);
      });
    }
    var out = { ok: good, faces: faces };
    if (good && cells.length === 5) { var miss = [0, 1, 2, 3, 4, 5].filter(function (f) { return !used[f]; })[0], opp = miss ^ 1; out.bottom = Object.keys(faces).filter(function (k) { return faces[k] === opp; })[0]; }
    return out;
  };
  PK.foldsOpen = function (c) { return c.length === 5 && PK.fold(c).ok; };
  PK.foldsCube = function (c) { return c.length === 6 && PK.fold(c).ok; };
  PK.FOLDS = LETTERS.filter(function (L) { return PK.foldsOpen(PENT[L]); });          // F L N T W X Y Z
  PK.NOFOLD = LETTERS.filter(function (L) { return !PK.foldsOpen(PENT[L]); });        // I P U V
  /* every tiling of a W by H rectangle by n different pentominoes (letters: the ones allowed); cached */
  var TCACHE = {};
  PK.tilings = function (W, H, n, letters) {
    letters = letters || LETTERS; var key = W + 'x' + H + ':' + n + ':' + letters.join('');
    if (TCACHE[key]) return TCACHE[key];
    var all = [], board = {}, used = {}, OR = {};
    letters.forEach(function (L) { OR[L] = orients(PENT[L]); });
    function first() { for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (!board[x + ',' + y]) return [x, y]; return null; }
    (function rec(pl) {
      var f = first(); if (!f) { all.push(pl.slice()); return; }
      if (pl.length >= n) return;
      letters.forEach(function (L) {
        if (used[L]) return;
        OR[L].forEach(function (o) {
          var dx = f[0] - o[0][0], dy = f[1] - o[0][1], cells = o.map(function (p) { return [p[0] + dx, p[1] + dy]; });
          if (cells.some(function (p) { return p[0] < 0 || p[1] < 0 || p[0] >= W || p[1] >= H || board[ck(p)]; })) return;
          cells.forEach(function (p) { board[ck(p)] = L; }); used[L] = 1; pl.push({ L: L, cells: cells });
          rec(pl);
          pl.pop(); used[L] = 0; cells.forEach(function (p) { delete board[ck(p)]; });
        });
      });
    })([]);
    return (TCACHE[key] = all);
  };
  PK.setOf = function (tl) { return tl.map(function (p) { return p.L; }).sort().join(''); };
  PK.cellMap = function (tl) { var m = {}; tl.forEach(function (p) { p.cells.forEach(function (c) { m[ck(c)] = p.L; }); }); return m; };
  /* random free polyomino of n squares (grown one square at a time) */
  PK.randomPoly = function (r, n) {
    var c = [[0, 0]];
    while (c.length < n) { var p = r.pick(c), d = r.pick(DIRS), np = [p[0] + d[0], p[1] + d[1]]; if (!has(c, np)) c.push(np); }
    return norm(c);
  };
  PK.longestRow = function (c) {
    var best = 0; c.forEach(function (p) { [[1, 0], [0, 1]].forEach(function (d) { var k = 0; while (has(c, [p[0] + k * d[0], p[1] + k * d[1]])) k++; best = Math.max(best, k); }); }); return best;
  };

  /* ---------------- pictures ---------------- */
  function f1(v) { return String(Math.round(v * 10) / 10); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function svgOpen(W, H, label, maxW) {
    return '<svg class="u5-fig" viewBox="-3 -3 ' + f1(W + 6) + ' ' + f1(H + 6) + '" width="' + Math.round(Math.min(maxW || 9999, W + 6)) + '" style="max-width:100%;height:auto;vertical-align:middle;display:inline-block" role="img" aria-label="' + esc(label || 'shape') + '">';
  }
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + (o.size || 12) + '" font-weight="' + (o.weight || 700) + '" text-anchor="middle" dominant-baseline="central" fill="' + (o.color || INK) + '">' + esc(s) + '</text>'; }
  /* a polyomino. o: s (square size), fill, nums { 'x,y': label }, hi { 'x,y': colour }, grid [w, h] (light grid; cells
   * are then on that grid, not shifted), label */
  PK.polySVG = function (cells, o) {
    o = o || {}; var s = o.s || 18, mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
    cells.forEach(function (p) { mnx = Math.min(mnx, p[0]); mny = Math.min(mny, p[1]); mxx = Math.max(mxx, p[0] + 1); mxy = Math.max(mxy, p[1] + 1); });
    if (o.grid) { mnx = 0; mny = 0; mxx = Math.max(mxx, o.grid[0]); mxy = Math.max(mxy, o.grid[1]); }
    var W = (mxx - mnx) * s, H = (mxy - mny) * s, X = function (x) { return (x - mnx) * s; }, Y = function (y) { return (mxy - y) * s; };
    var h = svgOpen(W, H, o.label || 'a shape made of squares', o.maxW);
    if (o.grid) {
      var d = ''; for (var gx = 0; gx <= o.grid[0]; gx++) d += 'M' + X(gx) + ' ' + Y(0) + 'V' + Y(o.grid[1]); for (var gy = 0; gy <= o.grid[1]; gy++) d += 'M' + X(0) + ' ' + Y(gy) + 'H' + X(o.grid[0]);
      h += '<path d="' + d + '" stroke="' + GRID + '" stroke-width="0.8" fill="none"/>';
    }
    cells.forEach(function (p) { var k = ck(p), fl = (o.hi && o.hi[k]) || o.fill || FILL, gh = o.ghost && o.ghost[k]; h += '<rect x="' + f1(X(p[0]) + (gh ? 2 : 0)) + '" y="' + f1(Y(p[1] + 1) + (gh ? 2 : 0)) + '" width="' + (gh ? s - 4 : s) + '" height="' + (gh ? s - 4 : s) + '" fill="' + (gh ? '#ffffff' : fl) + '" stroke="' + (gh ? '#8a919d' : INK) + '" stroke-width="' + (gh ? 1.3 : 1.6) + '"' + (gh ? ' stroke-dasharray="4 3" rx="3"' : '') + '/>'; });
    Object.keys(o.nums || {}).forEach(function (k) { var p = k.split(',').map(Number); h += txt(X(p[0] + 0.5), Y(p[1] + 0.5), o.nums[k], { size: s * 0.6, color: o.numColor || INK }); });
    return h + '</svg>';
  };
  /* a W by H board: pieces [{ cells, letter (shown), fill }], nums { 'x,y': n } (circled numbers), thick outlines round pieces */
  PK.boardSVG = function (W, H, pieces, o) {
    o = o || {}; var s = o.s || 30, X = function (x) { return x * s; }, Y = function (y) { return (H - y) * s; }, owner = {};
    pieces.forEach(function (pc, i) { pc.cells.forEach(function (c) { owner[ck(c)] = i; }); });
    var h = svgOpen(W * s, H * s, o.label || 'a ' + W + ' by ' + H + ' rectangle', o.maxW);
    pieces.forEach(function (pc, i) { pc.cells.forEach(function (c) { h += '<rect x="' + X(c[0]) + '" y="' + Y(c[1] + 1) + '" width="' + s + '" height="' + s + '" fill="' + (pc.fill || TINT[i % TINT.length]) + '"/>'; }); });
    var d = ''; for (var gx = 0; gx <= W; gx++) d += 'M' + X(gx) + ' ' + Y(0) + 'V' + Y(H); for (var gy = 0; gy <= H; gy++) d += 'M' + X(0) + ' ' + Y(gy) + 'H' + X(W);
    h += '<path d="' + d + '" stroke="' + GRID + '" stroke-width="0.9" fill="none"/>';
    var e = '';
    pieces.forEach(function (pc, i) { pc.cells.forEach(function (c) {
      DIRS.forEach(function (dd) { var n = [c[0] + dd[0], c[1] + dd[1]]; if (owner[ck(n)] === i) return;
        if (dd[0] === 1) e += 'M' + X(c[0] + 1) + ' ' + Y(c[1]) + 'V' + Y(c[1] + 1); else if (dd[0] === -1) e += 'M' + X(c[0]) + ' ' + Y(c[1]) + 'V' + Y(c[1] + 1);
        else if (dd[1] === 1) e += 'M' + X(c[0]) + ' ' + Y(c[1] + 1) + 'H' + X(c[0] + 1); else e += 'M' + X(c[0]) + ' ' + Y(c[1]) + 'H' + X(c[0] + 1); });
    }); });
    h += '<path d="' + e + '" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="square" fill="none"/>';
    h += '<rect x="0" y="0" width="' + W * s + '" height="' + H * s + '" fill="none" stroke="' + INK + '" stroke-width="2.6"/>';
    pieces.forEach(function (pc) { if (!pc.letter) return; var m = pc.cells.slice().sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; }), best = m[0];
      m.forEach(function (c) { var nb = DIRS.filter(function (dd) { return has(pc.cells, [c[0] + dd[0], c[1] + dd[1]]); }).length, nbb = DIRS.filter(function (dd) { return has(pc.cells, [best[0] + dd[0], best[1] + dd[1]]); }).length; if (nb > nbb) best = c; });
      h += txt(X(best[0] + 0.5), Y(best[1] + 0.5), pc.letter, { size: s * 0.55 }); });
    Object.keys(o.nums || {}).forEach(function (k) { var p = k.split(',').map(Number), cx = X(p[0] + 0.5), cy = Y(p[1] + 0.5);
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (s * 0.33) + '" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/>' + txt(cx, cy, o.nums[k], { size: s * 0.42 }); });
    return h + '</svg>';
  };
  /* tangram pieces: [{ k: 'L'|'M'|'S'|'Q'|'P', pts: [[x, y], …] }] in small-triangle-leg units (y up) */
  var TCOL = { L: '#f7c58f', M: '#a9d8a4', S: '#9fc6f2', Q: '#f4e08c', P: '#d8b9f2' };
  var TNAME = { L: 'large triangle', M: 'medium triangle', S: 'small triangle', Q: 'square', P: 'parallelogram' };
  var TAREA = { L: 4, M: 2, S: 1, Q: 2, P: 2 };
  PK.TNAME = TNAME; PK.TAREA = TAREA; PK.TCOL = TCOL;
  PK.tanSVG = function (pieces, o) {
    o = o || {}; var s = o.s || 30, mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
    pieces.forEach(function (pc) { pc.pts.forEach(function (p) { mnx = Math.min(mnx, p[0]); mny = Math.min(mny, p[1]); mxx = Math.max(mxx, p[0]); mxy = Math.max(mxy, p[1]); }); });
    var X = function (x) { return (x - mnx) * s; }, Y = function (y) { return (mxy - y) * s; };
    var h = svgOpen((mxx - mnx) * s, (mxy - mny) * s, o.label || 'tangram pieces', o.maxW);
    pieces.forEach(function (pc) { h += '<polygon points="' + pc.pts.map(function (p) { return f1(X(p[0])) + ',' + f1(Y(p[1])); }).join(' ') + '" fill="' + (pc.fill || TCOL[pc.k]) + '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>';
      if (o.names) { var cx = 0, cy = 0; pc.pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pc.pts.length; cy /= pc.pts.length; h += txt(X(cx), Y(cy), o.names === 'short' ? { L: 'large', M: 'medium', S: 'small', Q: 'square', P: 'parallelogram' }[pc.k] : TNAME[pc.k], { size: o.nameSize || 10, weight: 600 }); } });
    return h + '</svg>';
  };
  /* turn (k quarter turns) and maybe flip a set of tangram pieces */
  PK.tanMove = function (pieces, k) { return pieces.map(function (pc) { return { k: pc.k, fill: pc.fill, pts: pc.pts.map(function (p) { return tf(p, k); }) }; }); };
  /* the whole tangram, as the booklet draws it (a 4 by 4 square in its own units) */
  PK.TANGRAM = [{ k: 'L', pts: [[0, 0], [0, 4], [2, 2]] }, { k: 'L', pts: [[0, 4], [4, 4], [2, 2]] }, { k: 'M', pts: [[2, 0], [4, 0], [4, 2]] }, { k: 'S', pts: [[0, 0], [2, 0], [1, 1]] },
    { k: 'Q', pts: [[1, 1], [2, 0], [3, 1], [2, 2]] }, { k: 'S', pts: [[2, 2], [3, 1], [3, 3]] }, { k: 'P', pts: [[3, 1], [4, 2], [4, 4], [3, 3]] }];
  PK.tangramSVG = function (o) {
    o = o || {}; var pic0 = PK.tanSVG(PK.TANGRAM, { s: o.s || 40, label: 'the seven tangram pieces', maxW: o.maxW });
    var key = ['L', 'M', 'S', 'Q', 'P'].map(function (k) { return '<span style="display:inline-flex;align-items:center;gap:5px;margin-right:12px;white-space:nowrap"><span style="display:inline-block;width:14px;height:14px;border:1.5px solid ' + INK + ';background:' + TCOL[k] + '"></span>' + TNAME[k] + (k === 'L' || k === 'S' ? ' (2)' : '') + '</span>'; }).join('');
    return '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin:4px 0">' + pic0 + '<div style="font-size:0.9em;line-height:1.9;max-width:300px">' + key + '</div></div>';
  };

  /* ======================= lesson helpers ======================= */
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function nf(x) { return String(Math.round(x * 1e6) / 1e6); }
  function gcd(a, b) { while (b) { var x = a % b; a = b; b = x; } return a; }
  function fracT(n, d) { var g = gcd(n, d); return d / g === 1 ? String(n / g) : '\\tfrac{' + n / g + '}{' + d / g + '}'; }
  function find(gen, test, fallback) { for (var i = 0; i < 300; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function numDiag(list) { return function (v) { for (var i = 0; i < list.length; i++) if (list[i] && Math.abs(v - list[i][0]) < 1e-9 && list[i][1]) return { code: list[i][2] || 'u5l1-diag', hint: list[i][1] }; return null; }; }
  /* a number part with hints for known wrong values: bad = [[value, hint, code]] */
  function numPart(prompt, ans, bad, sol, hints, text, inp) {
    bad = (bad || []).filter(function (b) { return b && isFinite(b[0]) && Math.abs(b[0] - ans) > 1e-9; });
    var p = P.number(prompt, ans, numDiag(bad), sol, hints, text, inp);
    p.key = nf(ans); p.answer = t(nf(ans) + (inp && inp.after ? '\\text{ ' + inp.after.replace(/\\text\{|\}|\^2/g, '') + '}' + (/\^2|²/.test(inp.after) ? '^2' : '') : ''));
    p.bad = bad.map(function (b) { return nf(b[0]); });
    return p;
  }
  function nrPart(prompt, ans, bad, sol, hints, text) {
    bad = (bad || []).filter(function (b) { return b && isFinite(b[0]) && Math.abs(b[0] - ans) > 1e-9; });
    var p = P.nr(prompt, ans, numDiag(bad), sol, hints, text); p.key = nf(ans); p.answer = t(nf(ans)); p.bad = bad.map(function (b) { return nf(b[0]); });
    return p;
  }
  /* several number boxes: rows [{ label, name, ans, bad, after }] */
  function fieldsPart(prompt, rows, sol, hints, text) {
    var ckrs = rows.map(function (rw) { var bad = (rw.bad || []).filter(function (b) { return b && isFinite(b[0]) && Math.abs(b[0] - rw.ans) > 1e-9; }); return K.number(rw.ans, numDiag(bad)); });
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, name: rw.name || rw.label.replace(/:$/, ''), after: rw.after }; }), ckrs, rows.map(function (rw) { return nf(rw.ans); }),
      rows.map(function (rw) { return rw.label + ' ' + t(nf(rw.ans)) + (rw.after ? ' ' + rw.after : ''); }).join(' &nbsp; '), sol, hints, text);
    return p;
  }
  /* tap every one that applies (select chips). opts [{ value, html }], want [values], diag(extra, missing) */
  function selectPart(prompt, opts, want, diag, answerHtml, sol, hints, text, help) {
    return { prompt: prompt, input: { type: 'select', options: opts, help: help }, check: K.selectSet(want, diag), key: want.slice(), answer: answerHtml, solution: sol, hints: hints || [], text: text };
  }
  function andList(a) { var b = a.map(function (x) { return '<b>' + x + '</b>'; }); return b.length < 2 ? b.join('') : b.slice(0, -1).join(', ') + ' and ' + b[b.length - 1]; }
  function mcCols(p, n) { p.input.columns = n; return p; }
  var CM2 = 'cm²';

  HW.addCodes({
    'u5l1-only-small': 'Counted only the 1 by 1 squares', 'u5l1-off-one': 'Counted the positions of a square one short (or over)', 'u5l1-sevenths': 'Took each tangram piece as 1/7',
    'u5l1-side': 'Divided the side length instead of the area', 'u5l1-large-eighth': 'Took a large triangle as 1/8 (2 small triangles)', 'u5l1-piece-units': 'Mixed up the piece areas',
    'u5l1-count-pieces': 'Counted pieces instead of area units', 'u5l1-flips-new': 'Counted flipped shapes as new', 'u5l1-add-n': 'Added n instead of n²', 'u5l1-units16': 'Gave units instead of a fraction of 16',
    'u5l1-wrong-pieces': 'Picture uses pieces that are not in the set', 'u5l1-wrong-shape': 'Picture is the wrong shape', 'u5l1-diag': 'A known wrong value', 'u5l1-bottom-end': 'Picked a square that becomes a side',
    'u5l1-cube-extra': 'A square that lands on a used face', 'u5l1-cube-missing': 'Missed a square that works', 'u5l1-grid-row': 'A row of the table wrong', 'u5l1-area-only': 'Thought the right area is enough',
    'u5l1-double-area': 'Doubling the sides doubles the area', 'u5l1-strategy': 'Picked the wrong strategy', 'u5l1-ten': 'Counted 9 or 11 dark squares on the board', 'u5l1-tile-why': 'Wrong reason about tiling'
  });
  HW.addPartial({ 'u5l1-off-one': 's', 'u5l1-units16': 's', 'u5l1-flips-new': 'b', 'u5l1-only-small': 'b', 'u5l1-sevenths': 'n', 'u5l1-side': 'n', 'u5l1-large-eighth': 'b', 'u5l1-add-n': 'b', 'u5l1-count-pieces': 'n' });

  /* ---------------- strategies (Q1, Extra 1) ---------------- */
  var STRAT = { model: 'draw or model', guess: 'guess and check', list: 'systematic list', pattern: 'look for a pattern', simplify: 'simplify the problem', elim: 'eliminate possibilities' };
  var PLANS = {
    model: ['Jess cuts a net out of paper and folds it to see if it makes a box.', 'Amir lays real tangram pieces on the silhouette and slides them around.', 'Before cutting the wood, Kim builds the shape out of sugar cubes.', 'Theo folds a paper copy of his net to test it before cutting the cardboard.', 'Zoe draws the rectangle on grid paper and sketches the pieces inside it.'],
    list: ['Raj lists every way to make $1 with quarters and dimes, in order.', 'Nadia sorts the pentominoes she finds by their longest row, so she never draws one twice.', 'Cole writes down every pair of pieces in order (AB, AC, AD, …) so none is missed.', 'Ivy counts the squares in a grid size by size: all the 1 by 1s, then the 2 by 2s, then the 3 by 3s.'],
    simplify: ['Before a 10-piece puzzle, Mei solves a 3-piece version of it.', 'Ana counts the squares in a 2 by 2 grid before she tries the 8 by 8 board.', 'Before tiling the big rectangle, Leo tiles a smaller one with only 2 pieces.'],
    elim: ['For a 9-unit shape, Ty crosses off every set of pieces whose areas do not add to 9.', 'Sara rules out every pentomino with a 2 by 2 block before she tests which ones fold.', 'Dev crosses out every piece that is too long to fit in the 3-square gap.'],
    guess: ['Lina puts a piece in a corner. It leaves a hole, so she moves it and tries again.', 'Max tries a piece, sees that it does not fit, flips it over and tries again.', 'Eli places the large triangle, sees the gap is the wrong shape, and turns the triangle.'],
    pattern: ['Ben counts the squares in 1 by 1, 2 by 2 and 3 by 3 grids to predict a 6 by 6 grid.', 'Kai sees the totals go 1, 5, 14, 30 and uses that to predict the next one.', 'Rosa notices that each answer is double the one before and predicts the next one.']
  };
  var STRAT_WHY = {
    model: 'Using real pieces, paper or a sketch to act it out is <b>draw or model</b>.', list: 'Listing every case in an order is a <b>systematic list</b>.', simplify: 'Solving a smaller or easier version first is <b>simplify the problem</b>.',
    elim: 'Crossing off the choices that cannot work is <b>eliminate possibilities</b>.', guess: 'Trying, seeing what happens, and changing it is <b>guess and check</b>.', pattern: 'Using small cases to predict the next one is <b>look for a pattern</b>.'
  };
  function stratPart(want, pool) {
    return { id: null, make: function (r) {
      var plan = r.pick(PLANS[want]), others = r.sample(pool.filter(function (s) { return s !== want; }), Math.min(3, pool.length - 1));
      var opts = [{ html: cap(STRAT[want]), right: true }].concat(others.map(function (s) { return { html: cap(STRAT[s]), why: 'Read the plan again. ' + STRAT_WHY[s] + ' Is that what this person does?', code: 'u5l1-strategy' }; }));
      return mcCols(P.mc(r, '<i>' + plan + '</i><br>Which strategy fits this plan best?', opts, STRAT_WHY[want], ['Ask: is the person acting it out, listing cases in order, trying a smaller version, crossing things off, trying and adjusting, or predicting from small cases?'], 'strategy ' + want), 2);
    } };
  }
  function stratQ(num, wants, pool, section, extra) {
    return { num: num, section: section, stem: 'Which strategy fits each plan best? Choose from: <i>' + pool.map(function (s) { return STRAT[s]; }).join(', ') + '</i>.', parts: wants.map(function (w, i) { var p = stratPart(w, pool); p.id = (extra ? 'e' : '') + num + String.fromCharCode(97 + i); p.level = 'BEG'; return p; }) };
  }

  /* ---------------- squares of any size in a grid (Q2, Q18, Extra 3) ---------------- */
  function sqCount(m, n) { var s = 0; for (var k = 1; k <= Math.min(m, n); k++) s += (m - k + 1) * (n - k + 1); return s; }
  function gridSVG(m, n, s) { s = s || 20; var h = svgOpen(n * s, m * s, 'a ' + m + ' by ' + n + ' grid', 260), d = ''; for (var x = 0; x <= n; x++) d += 'M' + x * s + ' 0V' + m * s; for (var y = 0; y <= m; y++) d += 'M0 ' + y * s + 'H' + n * s; return h + '<path d="' + d + '" stroke="' + INK + '" stroke-width="1.6" fill="none"/></svg>'; }
  function sqTable(prompt, m, n, text) {
    var rows = [], sol = [];
    for (var k = 1; k <= Math.min(m, n); k++) {
      var a = m - k + 1, b = n - k + 1, c = a * b;
      rows.push({ label: k + ' by ' + k + ':', name: k + ' by ' + k, ans: c, bad: [[m * n, k > 1 ? 'That’s the number of 1 by 1 squares. A ' + k + ' by ' + k + ' square can start in ' + b + ' places across and ' + a + ' places down.' : null, 'u5l1-only-small'], [(a - 1) * (b - 1), 'Count the starting places again: a ' + k + ' by ' + k + ' square can start in ' + b + ' places across (not ' + (b - 1) + ').', 'u5l1-off-one'], [a + b, 'Multiply the places across by the places down (' + b + ' × ' + a + '), don’t add them.', 'u5l1-diag']] });
      sol.push(k + ' by ' + k + ': ' + t(b + '\\times ' + a + '=' + c));
    }
    var tot = sqCount(m, n);
    rows.push({ label: 'Total:', name: 'Total', ans: tot, bad: [[m * n, 'That counts only the 1 by 1 squares. The bigger squares count too.', 'u5l1-only-small']] });
    sol.push('Total: ' + t(rows.slice(0, -1).map(function (rw) { return rw.ans; }).join('+') + '=' + tot));
    return fieldsPart(prompt, rows, steps(sol), ['A ' + 'k by k square can start in (across places) × (down places) spots.', 'Add up all the sizes for the total.'], text);
  }

  /* ---------------- pentomino pictures and tables ---------------- */
  function pic(c, s, o) { o = o || {}; o.s = s || 16; return PK.polySVG(c, o); }
  function randOrient(r, c) { return r.pick(orients(c)); }
  function refStrip(letters, s) {
    return '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin:6px 0">' + letters.map(function (L) { return '<div style="text-align:center">' + pic(PENT[L], s || 13) + '<div style="font-weight:700">' + L + '</div></div>'; }).join('') + '</div>';
  }
  /* is it a pentomino? kinds: 'yes', 'count', 'corner', 'half' */
  function notPentomino(r, kind) {
    if (kind === 'yes') return randOrient(r, PENT[r.pick(LETTERS)]);
    if (kind === 'count') { var n = r.pick([4, 6]); return find(function () { return PK.randomPoly(r, n); }, function (c) { return PK.longestRow(c) < n; }, PK.randomPoly(r, n)); }
    if (kind === 'corner') {
      return find(function () {
        var c = randOrient(r, TETRO[r.pick(['I', 'L', 'T', 'S', 'O'])]), p = r.pick(c), d = r.pick([[1, 1], [1, -1], [-1, 1], [-1, -1]]), np = [p[0] + d[0], p[1] + d[1]];
        if (has(c, np) || DIRS.some(function (dd) { return has(c, [np[0] + dd[0], np[1] + dd[1]]); })) return null;
        return c.concat([np]);
      }, function (c) { return !!c; }, [[0, 0], [1, 0], [2, 0], [3, 1], [0, 1]]);
    }
    var c2 = r.pick([[[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [r.pick([0.5, 1.5, 2.5]), 1]], [[0, 0], [1, 0], [-0.5, 1], [0.5, 1], [1.5, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [1.5, 1]]]);
    var k = r.int(0, 7); return c2.map(function (p) { return tf(p, k); });
  }
  var PENT_COLS = [{ id: 'yes', html: 'Yes' }, { id: 'count', html: 'No: not 5 squares' }, { id: 'corner', html: 'No: touch at corners only' }, { id: 'half', html: 'No: half sides' }];
  var PENT_WHY = { yes: 'it has 5 squares joined along full sides', count: 'it doesn’t have exactly 5 squares', corner: 'two squares touch only at a corner', half: 'some squares meet along only half a side' };
  function isPentoPart(r, n, text) {
    var kinds = find(function () { var k = []; for (var i = 0; i < n; i++) k.push(r.pick(['yes', 'yes', 'count', 'corner', 'half'])); return k; }, function (k) { return ['yes', 'count', 'corner', 'half'].every(function (x) { return k.indexOf(x) >= 0; }) || n < 4; }, ['yes', 'count', 'corner', 'half', 'yes', 'count'].slice(0, n));
    var rows = [], want = {}, sol = [];
    kinds.forEach(function (k, i) {
      var c = notPentomino(r, k), id = String.fromCharCode(97 + i), count = c.length;
      rows.push({ id: id, html: '(' + id + ') ' + pic(c, 19, { label: 'shape ' + id }), label: '(' + id + ')' }); want[id] = k;
      sol.push('(' + id + ') ' + (k === 'yes' ? 'Yes: ' : 'No: ') + (k === 'count' ? 'it has ' + count + ' squares.' : PENT_WHY[k] + '.'));
    });
    return P.grid('Is each shape a pentomino? If not, choose why.', rows, PENT_COLS, want, { colHead: '', why: function (row, got, w) {
      if (w === 'count') return { code: 'u5l1-grid-row', hint: 'Count the squares in (' + row + ') again.' };
      if (w === 'corner') return { code: 'u5l1-grid-row', hint: 'Look at how every square in (' + row + ') is joined to the others: along a full side, or only at a corner?' };
      if (w === 'half') return { code: 'u5l1-grid-row', hint: 'In (' + row + '), do the squares line up side to side, or do some sit across half a side?' };
      return { code: 'u5l1-grid-row', hint: '(' + row + ') has 5 squares, each joined to another along a full side. That is a pentomino.' };
    } }, steps(sol), ['A pentomino: exactly 5 squares, each joined to another along a <b>full side</b>.', 'Corners touching don’t count, and half sides don’t count.'], text);
  }
  /* same or different? */
  var REL_COLS = [{ id: 'turn', html: 'Same: turn it' }, { id: 'flip', html: 'Same: flip it over' }, { id: 'diff', html: 'Different' }];
  var LOOKALIKE = [['W', 'Z'], ['L', 'Y'], ['L', 'N'], ['N', 'Z'], ['P', 'U'], ['F', 'T'], ['Y', 'N'], ['V', 'L'], ['F', 'Z'], ['T', 'Y'], ['W', 'N'], ['P', 'F']];
  function pairPic(a, b, s) { return '<span style="display:inline-flex;gap:18px;align-items:center">' + pic(a, s || 18) + pic(b, s || 18) + '</span>'; }
  function relPair(r, kind) {
    if (kind === 'diff') { var pr = r.pick(LOOKALIKE); return { a: randOrient(r, PENT[pr[0]]), b: randOrient(r, PENT[pr[1]]), why: 'one is the ' + pr[0] + ' and the other is the ' + pr[1] + '; no turn or flip changes one into the other' }; }
    var L = r.pick(CHIRAL), a = randOrient(r, PENT[L]);
    if (kind === 'turn') { var k = r.int(1, 3); return { a: a, b: move(a, k), why: 'both are the ' + L + '; ' + (k === 2 ? 'a half turn' : 'a quarter turn') + ' makes the first fit on the second' }; }
    var b = move(a, r.int(4, 7)); return { a: a, b: b, why: 'both are the ' + L + '; one is the mirror image of the other, so you must flip it' };
  }
  function relPart(r, kinds, text) {
    var rows = [], want = {}, sol = [];
    kinds.forEach(function (k, i) { var pp = relPair(r, k), id = String.fromCharCode(97 + i); rows.push({ id: id, html: '(' + id + ') ' + pairPic(pp.a, pp.b), label: '(' + id + ')' }); want[id] = k; sol.push('(' + id + ') ' + (k === 'diff' ? 'Different: ' : k === 'turn' ? 'Same, turn: ' : 'Same, flip: ') + pp.why + '.'); });
    return P.grid('Is each pair the same pentomino or different? If they are the same, do you turn it or flip it over?', rows, REL_COLS, want, { why: function (row, got, w) {
      if (w === 'diff') return { code: 'u5l1-grid-row', hint: 'Look at pair (' + row + ') again: count the squares in the longest row of each, and where the bumps are. Could any turn or flip make them match?' };
      if (got === 'diff') return { code: 'u5l1-grid-row', hint: 'Pair (' + row + ') is the same pentomino. Turn the first one in your head, or imagine flipping it over like a pancake.' };
      if (w === 'flip') return { code: 'u5l1-grid-row', hint: 'In pair (' + row + '), turning alone never works: the second one is a mirror image. You have to flip it.' };
      return { code: 'u5l1-grid-row', hint: 'In pair (' + row + '), a turn is enough (no flip needed). Try turning the first one a quarter or half turn.' };
    } }, steps(sol), ['Turn the first shape in your head (a quarter turn, a half turn…). If no turn works, imagine flipping it over.', 'If no turn or flip makes them match, they are different.'], text);
  }
  /* does it fold into an open box? */
  function foldRows(r, n) {
    return find(function () { var a = []; for (var i = 0; i < n; i++) a.push(r.pick(LETTERS)); return a; }, function (a) { var y = a.filter(function (L) { return PK.FOLDS.indexOf(L) >= 0; }).length; return y >= 1 && y < n && a.filter(function (L, i) { return a.indexOf(L) === i; }).length === n; }, ['T', 'V', 'W', 'I'].slice(0, n));
  }
  var FOLD_WHY = { I: '5 in a row wraps all the way around, so the fifth square lands on the first', P: 'it has a 2 by 2 block, so two squares land on the same face', U: 'with the bottom in the middle of the long row, both tips land on the same side', V: 'with the corner as the bottom, both end squares land on the top' };
  function foldGrid(r, letters, text) {
    var rows = [], want = {}, sol = [];
    letters.forEach(function (L, i) { var id = String.fromCharCode(97 + i), c = randOrient(r, PENT[L]); rows.push({ id: id, html: '(' + id + ') ' + pic(c, 19, { label: 'pentomino ' + id }), label: '(' + id + ')' }); var y = PK.FOLDS.indexOf(L) >= 0; want[id] = y ? 'yes' : 'no';
      sol.push('(' + id + ') the ' + L + ': ' + (y ? 'yes. Fold up from the bottom square and the other 4 squares land on 4 different sides.' : 'no: ' + FOLD_WHY[L] + '.')); });
    return P.grid('Does each pentomino fold into an open box (a cube with no top)?', rows, [{ id: 'yes', html: 'Yes' }, { id: 'no', html: 'No' }], want, { why: function (row, got, w) {
      return { code: 'u5l1-grid-row', hint: w === 'no' ? 'Fold (' + row + ') in your head (or with your cut-out). Does it have a 2 by 2 block or 5 in a row? Do two squares land on the same face?' : '(' + row + ') does fold. Pick a square in the middle as the bottom and fold the others up: do they land on 4 different sides?' };
    } }, steps(sol), ['Quick eliminations: a 2 by 2 block never folds; 5 in a row overlaps.', 'Otherwise pick a bottom square and fold the squares that touch it straight up.'], text);
  }
  function bottomPart(r, pool, text) {
    var L = r.pick(pool), c = randOrient(r, PENT[L]), f = PK.fold(c), order = c.slice().sort(function (a, b) { return b[1] - a[1] || a[0] - b[0]; }), nums = {};
    order.forEach(function (p, i) { nums[ck(p)] = String(i + 1); });
    var bottom = Number(nums[f.bottom]), bad = order.map(function (p, i) { return i + 1; }).filter(function (k) { return k !== bottom; }).map(function (k) { return [k, 'If square ' + k + ' is the bottom, fold up the squares that touch it: two of them land on the same face (or one ends up on top). Try a square with more neighbours.', 'u5l1-bottom-end']; });
    var hi = {}; hi[f.bottom] = HI;
    return numPart('This pentomino (the ' + L + ') folds into an open box. Which numbered square becomes the <b>bottom</b>?<br>' + pic(c, 30, { nums: nums, label: 'the ' + L + ' pentomino with numbered squares' }), bottom, bad,
      'Square ' + bottom + ' is the bottom:<br>' + pic(c, 22, { nums: nums, hi: hi }) + '<br>The squares that touch it fold straight up as sides; the others fold up against the sides. All 4 sides are different, and the top is left open.',
      ['The bottom is the square that the other four can fold up around.', 'Try each square as the bottom and fold the squares that touch it straight up.'], text);
  }

  /* ---------------- tangram picture choices ---------------- */
  function T_(k, pts) { return { k: k, pts: pts }; }
  function shiftT(pcs, dx, dy) { return pcs.map(function (pc) { return { k: pc.k, pts: pc.pts.map(function (p) { return [p[0] + dx, p[1] + (dy || 0)]; }) }; }); }
  function splitL(pc) { // a large triangle → 2 medium triangles (wrong-piece pictures)
    var a = pc.pts, ri = 0;
    for (var i = 0; i < 3; i++) { var p = a[i], u = a[(i + 1) % 3], v = a[(i + 2) % 3]; if (Math.abs((u[0] - p[0]) * (v[0] - p[0]) + (u[1] - p[1]) * (v[1] - p[1])) < 1e-9) ri = i; }
    var R = a[ri], U = a[(ri + 1) % 3], V = a[(ri + 2) % 3], M = [(U[0] + V[0]) / 2, (U[1] + V[1]) / 2];
    return [T_('M', [R, U, M]), T_('M', [R, M, V])];
  }
  var SH3 = { // the two small triangles and the square (Q5)
    rect: [T_('Q', [[0, 0], [1, 0], [1, 1], [0, 1]]), T_('S', [[1, 0], [2, 0], [1, 1]]), T_('S', [[2, 0], [2, 1], [1, 1]])],
    tri: [T_('Q', [[0, 0], [1, 0], [1, 1], [0, 1]]), T_('S', [[1, 0], [2, 0], [1, 1]]), T_('S', [[0, 1], [1, 1], [0, 2]])],
    trap: [T_('S', [[0, 0], [1, 0], [1, 1]]), T_('Q', [[1, 0], [2, 0], [2, 1], [1, 1]]), T_('S', [[2, 0], [3, 0], [2, 1]])],
    para: [T_('S', [[0, 0], [1, 0], [1, 1]]), T_('Q', [[1, 0], [2, 0], [2, 1], [1, 1]]), T_('S', [[2, 0], [3, 1], [2, 1]])]
  };
  var SH3BAD = { rect: [T_('Q', [[0, 0], [1, 0], [1, 1], [0, 1]]), T_('Q', [[1, 0], [2, 0], [2, 1], [1, 1]])], tri: [T_('M', [[0, 0], [2, 0], [1, 1]]), T_('M', [[0, 0], [1, 1], [0, 2]])],
    trap: [T_('M', [[0, 0], [2, 0], [1, 1]]), T_('P', [[2, 0], [3, 0], [2, 1], [1, 1]])] };
  var SH3BADWHY = { rect: 'That uses two squares. The set has only one square (and no small triangles are in that picture).', tri: 'That uses two medium triangles. The set is two small triangles and the square.', trap: 'That uses the medium triangle and the parallelogram, not the two small triangles and the square.' };
  var SHNAME = { rect: 'rectangle', tri: 'triangle', trap: 'trapezoid', para: 'parallelogram', sq: 'square' };
  var LL = { sq: [T_('L', [[0, 0], [2, 0], [0, 2]]), T_('L', [[2, 0], [2, 2], [0, 2]])], tri: [T_('L', [[0, 0], [2, 0], [2, 2]]), T_('L', [[2, 0], [4, 0], [2, 2]])], para: [T_('L', [[0, 0], [2, 0], [2, 2]]), T_('L', [[2, 0], [4, 2], [2, 2]])] };
  function tanOpt(pcs, r) { return PK.tanSVG(PK.tanMove(pcs, r.int(0, 7)), { s: 36, maxW: 200, label: 'an arrangement of tangram pieces' }); }
  function pieceRow(list) { return '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:4px 0">' + list.map(function (pc) { return PK.tanSVG([pc], { s: 22, maxW: 70, label: TNAME[pc.k] }); }).join('') + '</div>'; }
  function shapeMC(r, setName, pieces, shapes, bad, badWhy, target, text) {
    var others = r.sample(Object.keys(shapes).filter(function (k) { return k !== target; }), 2);
    var opts = [{ html: tanOpt(shapes[target], r), right: true }, { html: tanOpt(bad[target], r), why: badWhy[target], code: 'u5l1-wrong-pieces' }].concat(others.map(function (k) { return { html: tanOpt(shapes[k], r), why: 'That is ' + (k === 'tri' ? 'a triangle' : k === 'sq' ? 'a square' : 'a ' + SHNAME[k]) + ', not ' + (target === 'tri' ? 'a triangle' : target === 'sq' ? 'a square' : 'a ' + SHNAME[target]) + '. Look at the outline.', code: 'u5l1-wrong-shape' }; }));
    var p = mcCols(P.mc(r, 'Which picture shows ' + (target === 'tri' ? 'a triangle' : target === 'sq' ? 'a square' : 'a ' + SHNAME[target]) + (target === 'trap' ? ' (one pair of parallel sides)' : '') + ' made from exactly ' + setName + '?', opts,
      PK.tanSVG(shapes[target], { s: 26, maxW: 160 }) + '<br>It uses exactly ' + setName + ' (check the pieces), and its outline is ' + (target === 'tri' ? 'a triangle' : target === 'sq' ? 'a square' : 'a ' + SHNAME[target]) + '.', ['Check two things: the outline is the right shape, and the pieces are exactly the ones in the set.'], text), 2);
    return p;
  }
  var FIVE = [T_('M', [[0, 0], [2, 0], [1, 1]]), T_('S', [[0, 0], [1, 1], [0, 1]]), T_('Q', [[0, 1], [1, 1], [1, 2], [0, 2]]), T_('P', [[1, 1], [2, 0], [2, 1], [1, 2]]), T_('S', [[2, 1], [2, 2], [1, 2]])];
  var MMMM = [T_('M', [[0, 0], [2, 0], [1, 1]]), T_('M', [[2, 0], [2, 2], [1, 1]]), T_('M', [[2, 2], [0, 2], [1, 1]]), T_('M', [[0, 2], [0, 0], [1, 1]])];
  function flipX(pcs, w) { return pcs.map(function (pc) { return { k: pc.k, pts: pc.pts.map(function (p) { return [w - p[0], p[1]]; }) }; }); }

  /* tangram areas */
  var SETS = [ // [description, keys]
    ['the 5 smaller pieces (all but the two large triangles)', ['S', 'S', 'M', 'Q', 'P']], ['both large triangles', ['L', 'L']], ['the square and the parallelogram', ['Q', 'P']],
    ['one large triangle and both small triangles', ['L', 'S', 'S']], ['the medium triangle, the square and one small triangle', ['M', 'Q', 'S']], ['all the pieces except one small triangle', ['L', 'L', 'M', 'S', 'Q', 'P']],
    ['one large triangle and the medium triangle', ['L', 'M']], ['both small triangles and the square', ['S', 'S', 'Q']]];
  function area(keys) { return keys.reduce(function (s, k) { return s + TAREA[k]; }, 0); }
  function areaWords(keys) { return keys.map(function (k) { return TAREA[k]; }).join(' + '); }
  /* tangram from an s by s square: whole, small, medium/square/parallelogram, large */
  function tanAreaFields(prompt, s, text) {
    var A = s * s, sm = A / 16, md = A / 8, lg = A / 4;
    return fieldsPart(prompt, [
      { label: 'Whole square:', name: 'Whole square', ans: A, after: CM2, bad: [[4 * s, 'That’s the perimeter (all 4 sides). Area = side × side.', 'u5l1-diag'], [2 * s, 'Area = side × side: ' + s + ' × ' + s + '.', 'u5l1-diag']] },
      { label: 'Small triangle:', name: 'Small triangle', ans: sm, after: CM2, bad: [[A / 7, 'The pieces are not all the same size, so they are not sevenths. A small triangle is 1 of the 16 units: divide by 16.', 'u5l1-sevenths'], [s / 16, 'Divide the <b>area</b> of the whole square by 16, not the side length.', 'u5l1-side'], [A / 8, 'That’s 2 units. A small triangle is 1 of the 16 units.', 'u5l1-piece-units']] },
      { label: 'Medium triangle, square, parallelogram:', name: 'Medium triangle, square, parallelogram', ans: md, after: CM2 + ' each', bad: [[A / 7, 'The pieces are not sevenths. Each of these is 2 small triangles: 2/16 = 1/8 of the square.', 'u5l1-sevenths'], [A / 16, 'That’s a small triangle. These pieces are 2 small triangles each.', 'u5l1-piece-units'], [A / 4, 'That’s a large triangle (4 units). These pieces are 2 units each.', 'u5l1-piece-units'], [s / 8, 'Use the area of the whole square, not its side.', 'u5l1-side']] },
      { label: 'Large triangle:', name: 'Large triangle', ans: lg, after: CM2, bad: [[A / 8, 'A large triangle is 4 small triangles (4/16 = 1/4 of the square), not 2.', 'u5l1-large-eighth'], [A / 7, 'The pieces are not sevenths. A large triangle is 1/4 of the square.', 'u5l1-sevenths'], [A / 2, 'Both large triangles together are half the square. One is a quarter.', 'u5l1-piece-units'], [s / 4, 'Use the area of the whole square, not its side.', 'u5l1-side']] }],
      steps(['Whole square: ' + t(s + '\\times ' + s + '=' + nf(A)) + ' cm²', 'Small triangle: ' + t(nf(A) + '\\div 16=' + nf(sm)) + ' cm²', 'Medium triangle, square, parallelogram: ' + t('2\\times ' + nf(sm) + '=' + nf(md)) + ' cm² each', 'Large triangle: ' + t('4\\times ' + nf(sm) + '=' + nf(lg)) + ' cm²',
        'Check: ' + t('2(' + nf(lg) + ')+3(' + nf(md) + ')+2(' + nf(sm) + ')=' + nf(A)) + ' ✓']),
      ['Whole square = side × side. A small triangle is 1/16 of it.', 'Medium triangle, square and parallelogram: 2 small triangles each. Large triangle: 4.'], text);
  }
  function pieceAreaChoice(r) { return r.pick([['parallelogram', 8], ['square', 8], ['medium triangle', 8], ['small triangle', 16], ['large triangle', 4]]); }

  /* tiling: which piece covers each numbered square (one piece placed so the answer is unique) */
  function uniqueGiven(all, tl, gi) {
    var g = tl[gi], gk = keyOf(norm(g.cells)) + '@' + keyOf(g.cells.slice().sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; })), want = JSON.stringify(PK.cellMap(tl)), n = 0;
    for (var i = 0; i < all.length; i++) { var t2 = all[i]; for (var j = 0; j < t2.length; j++) if (t2[j].L === g.L && keyOf(t2[j].cells.slice().sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; })) === gk.split('@')[1]) { if (JSON.stringify(PK.cellMap(t2)) !== want) return false; n++; } }
    return n >= 1;
  }
  function tilingGrid(r, W, H, n, sets, nMarks, text) {
    var all = PK.tilings(W, H, n), set = r.pick(sets), mine = all.filter(function (tl) { return PK.setOf(tl) === set; });
    var pick = find(function () { var tl = r.pick(mine), gi = r.int(0, n - 1); return uniqueGiven(mine, tl, gi) ? { tl: tl, gi: gi } : null; }, function (x) { return !!x; }, { tl: mine[0], gi: 0 });
    var tl = pick.tl, g = tl[pick.gi], rest = tl.filter(function (p, i) { return i !== pick.gi; }), map = PK.cellMap(tl);
    // marked squares: one from each other piece, then more at random, never two side by side
    var marks = [];
    rest.forEach(function (pc) { var c = find(function () { return r.pick(pc.cells); }, function (c) { return !marks.some(function (m) { return Math.abs(m[0] - c[0]) + Math.abs(m[1] - c[1]) <= 1; }); }, r.pick(pc.cells)); marks.push(c); });
    var free = []; rest.forEach(function (pc) { pc.cells.forEach(function (c) { free.push(c); }); });
    for (var guard = 0; marks.length < nMarks && guard < 200; guard++) { var c = r.pick(free); if (!marks.some(function (m) { return Math.abs(m[0] - c[0]) + Math.abs(m[1] - c[1]) <= 1; })) marks.push(c); }
    marks.sort(function (a, b) { return b[1] - a[1] || a[0] - b[0]; });
    var nums = {}, rows = [], want = {}, cols = rest.map(function (p) { return p.L; }).sort().map(function (L) { return { id: L, html: '<b>' + L + '</b>' }; });
    marks.forEach(function (m, i) { nums[ck(m)] = String(i + 1); rows.push({ id: 's' + (i + 1), html: 'Square ' + (i + 1), label: 'Square ' + (i + 1) }); want['s' + (i + 1)] = map[ck(m)]; });
    var letters = set.split(''), board = PK.boardSVG(W, H, [{ cells: g.cells, letter: g.L, fill: TINT[0] }], { s: 42, nums: nums, maxW: 360 });
    var solBoard = PK.boardSVG(W, H, tl.map(function (p, i) { return { cells: p.cells, letter: p.L, fill: TINT[i % TINT.length] }; }), { s: 26, nums: nums, maxW: 240 });
    return P.grid('Tile this ' + H + ' by ' + W + ' rectangle with the ' + andList(letters) + ' pentominoes (turns and flips allowed). The <b>' + g.L + '</b> is already placed. Which piece covers each numbered square?' +
      refStrip(letters, 15) + board, rows, cols, want, { why: function (row) { return { code: 'u5l1-grid-row', hint: 'Not all the numbered squares are right yet. Try fitting the pieces into the space that is left: start in a corner, and remember each gap must be 5 squares.' }; } },
      'The only way to finish it:<br>' + solBoard + '<br>' + rows.map(function (rw) { return rw.html + ': ' + want[rw.id]; }).join(' &nbsp; ') + '<br>Area check: ' + t(H + '\\times ' + W + '=' + H * W + '=' + n + '\\times 5') + ' ✓',
      ['Area check: ' + n + ' pentominoes cover ' + 5 * n + ' squares.', 'Fill a corner or an edge first. If a gap is left that is not 5 or 10 squares, that try can’t work.'], text);
  }
  function gapMC(r, sets, text) {
    var all = PK.tilings(5, 3, 3), set = r.pick(sets), tl = r.pick(all.filter(function (x) { return PK.setOf(x) === set; })), gi = r.int(0, 2), g = tl[gi];
    var shown = tl.filter(function (p, i) { return i !== gi; }).map(function (p, i) { return { cells: p.cells, letter: p.L, fill: TINT[i + 1] }; });
    var gapKey = keyOf(norm(g.cells)), others = r.sample(LETTERS.filter(function (L) { return set.indexOf(L) < 0; }), 3);
    var opts = [{ html: pic(find(function () { return randOrient(r, PENT[g.L]); }, function (c) { return keyOf(c) !== gapKey; }, PENT[g.L]), 15), right: true }].concat(others.map(function (L) { return { html: pic(randOrient(r, PENT[L]), 18), why: 'That’s the ' + L + '. Turn it and flip it in your head: does it fit the white gap exactly?', code: 'u5l1-tile-why' }; }));
    return mcCols(P.mc(r, 'Elena is tiling this 3 by 5 rectangle with the ' + andList(set.split('')) + ' pentominoes. Two are placed. Which pentomino fills the white gap? (It may be turned or flipped.)<br>' + PK.boardSVG(5, 3, shown, { s: 42, maxW: 330 }), opts,
      'The gap is the <b>' + g.L + '</b>:<br>' + PK.boardSVG(5, 3, tl.map(function (p, i) { return { cells: p.cells, letter: p.L, fill: TINT[i % TINT.length] }; }), { s: 26, maxW: 220 }), ['Count the squares in the gap (5), then look for the piece with the same shape, turned or flipped.'], text), 4);
  }

  /* tetrominoes for Q10 */
  function tetroDupMC(r, text) {
    var types = r.sample(['I', 'L', 'T', 'O', 'S'], 4), dupType = r.pick(types.filter(function (x) { return x !== 'O'; }));
    var shapes = types.map(function (T) { return { T: T, c: randOrient(r, TETRO[T]) } });
    var tw = shapes.filter(function (s) { return s.T === dupType; })[0], dup = { T: dupType, c: find(function () { return randOrient(r, TETRO[dupType]); }, function (c) { return keyOf(c) !== keyOf(tw.c); }, move(tw.c, 1)) };
    var all = r.shuffle(shapes.concat([dup])), idx = all.map(function (s, i) { return i; }).filter(function (i) { return all[i].T === dupType; });
    var pairs = [], seen = {}; pairs.push(idx); seen[idx.join()] = 1;
    while (pairs.length < 4) { var a = r.int(0, 4), b = r.int(0, 4); if (a === b) continue; var pr = [Math.min(a, b), Math.max(a, b)]; if (seen[pr.join()]) continue; seen[pr.join()] = 1; pairs.push(pr); }
    var how = PK.relation(tw.c, dup.c) === 'flip' ? 'a flip' : 'a turn';
    var opts = pairs.map(function (pr, i) { return { html: 'Shapes ' + (pr[0] + 1) + ' and ' + (pr[1] + 1), right: i === 0, why: i === 0 ? null : 'Shapes ' + (pr[0] + 1) + ' and ' + (pr[1] + 1) + ' are different: no turn or flip makes one fit on the other. Look for a pair where it does.', code: 'u5l1-flips-new' }; });
    var row = '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;margin:6px 0">' + all.map(function (s, i) { return '<div style="text-align:center">' + pic(s.c, 18) + '<div><b>' + (i + 1) + '</b></div></div>'; }).join('') + '</div>';
    return mcCols(P.mc(r, 'Ravi drew these 5 shapes as "all the tetrominoes", but two of them are really the same tetromino (one is a turn or a flip of the other). Which two?' + row, opts,
      'Shapes ' + (idx[0] + 1) + ' and ' + (idx[1] + 1) + ' are the same: ' + how + ' makes one fit on the other. So Ravi has only 4 different tetrominoes; he is missing one.', ['Turn each shape in your head. A flipped shape is <b>not</b> a new tetromino.'], text), 2);
  }

  /* closed cube: add one square to an open-box pentomino */
  function cubePart(r, text) {
    var L = r.pick(PK.FOLDS.filter(function (x) { return x !== 'X'; })), c = randOrient(r, PENT[L]).map(function (p) { return [p[0] + 1, p[1] + 1]; });
    var mx = 0, my = 0; c.forEach(function (p) { mx = Math.max(mx, p[0]); my = Math.max(my, p[1]); });
    var cand = []; for (var y = my + 1; y >= 0; y--) for (var x = 0; x <= mx + 1; x++) { var q = [x, y]; if (!has(c, q) && DIRS.some(function (d) { return has(c, [x + d[0], y + d[1]]); })) cand.push(q); }
    var nums = {}, want = [], opts = [];
    cand.forEach(function (q, i) { nums[ck(q)] = String(i + 1); opts.push({ value: String(i + 1), html: String(i + 1) }); if (PK.foldsCube(c.concat([q]))) want.push(String(i + 1)); });
    var hi = {}; cand.forEach(function (q, i) { if (want.indexOf(String(i + 1)) >= 0) hi[ck(q)] = HI; });
    var shownCells = cand.concat(c), ghost = {}; cand.forEach(function (q) { ghost[ck(q)] = 1; });
    var figure = PK.polySVG(shownCells, { s: 34, nums: nums, ghost: ghost, fill: '#b9c4d6', grid: [mx + 2, my + 2], numColor: '#5f6675', label: 'the ' + L + ' pentomino with numbered empty squares around it', maxW: 260 });
    var solFig = PK.polySVG(c.concat(cand.filter(function (q, i) { return want.indexOf(String(i + 1)) >= 0; })), { s: 22, hi: hi, fill: '#b9c4d6', grid: [mx + 2, my + 2], maxW: 200 });
    var bottom = PK.fold(c).bottom;
    return selectPart('A closed box (a cube) has 6 faces. The <b>' + L + '</b> pentomino (shaded) folds into an open box. Which numbered squares could you add to it to make a net of a <b>closed</b> cube? Tap <b>every</b> one that works.<br>' + figure, opts, want,
      function (extra, missing) { if (extra.length) return { code: 'u5l1-cube-extra', hint: 'Square ' + extra[0] + ' folds onto a side that is already used (two squares on one face). The new square must fold over the open top.' }; return { code: 'u5l1-cube-missing', hint: 'There ' + (missing.length === 1 ? 'is 1 more square' : 'are ' + missing.length + ' more squares') + ' that work. Fold the open box first: the new square must sit on an edge that ends up at the top of the box.' }; },
      'Squares ' + want.join(', '),
      'Squares ' + want.join(', ') + ' work (' + want.length + ' places):<br>' + solFig + '<br>Fold the ' + L + ' into an open box first (the bottom is the square that the others fold up around). The new square must fold over the open top, so it must sit on an edge that ends up at the top of a side. Anywhere else it lands on a side that is already used.',
      ['Fold the pentomino into an open box first. Which face is missing?', 'Test each numbered square: when you fold, does it land on the open top?'], text, 'Tap every square that works. Tap again to unselect.');
  }

  /* ======================= the lesson ======================= */
  HW.defineLesson({
    id: 'u5l1', unit: 5, num: '1', title: 'Spatial Puzzles: Tangrams and Pentominoes', outcome: 'G1',
    blurb: 'Choosing a strategy, tangram areas and shapes, finding and sorting pentominoes, folding open boxes, and tiling rectangles.',
    questions: [
      stratQ('1', ['model', 'list', 'simplify', 'elim'], ['model', 'guess', 'list', 'pattern', 'simplify', 'elim']),
      { num: '2', stem: function (sh) { return 'How many squares of any size are in a ' + sh.n + ' by ' + sh.n + ' grid?<br>' + gridSVG(sh.n, sh.n, 22); }, shared: function (r) { return { n: r.pick([4, 4, 5, 6]) }; }, parts: [
        { id: '2a', level: 'EMG', make: function (r, sh) { return sqTable('(a) Complete the systematic list: how many squares of each size?', sh.n, sh.n, 'squares in ' + sh.n + ' by ' + sh.n); } },
        { id: '2b', level: 'EMG', make: function (r, sh) {
          var n = sh.n, prev = sqCount(n - 1, n - 1), tot = sqCount(n, n);
          return P.mc(r, '(b) A ' + (n - 1) + ' by ' + (n - 1) + ' grid has ' + prev + ' squares. Which calculation checks your total with the pattern from Example 1?', [
            { html: t(prev + '+' + n + '^2=' + prev + '+' + n * n + '=' + tot), right: true },
            { html: t(prev + '+' + n + '=' + (prev + n)), why: 'Each bigger grid adds the next <b>square number</b> (' + t(n + '^2') + '), not ' + n + '.', code: 'u5l1-add-n' },
            { html: t(n + '^2+' + n + '^2=' + 2 * n * n), why: 'Start from the ' + (n - 1) + ' by ' + (n - 1) + ' total (' + prev + ') and add the next square number.', code: 'u5l1-diag' },
            { html: t('2\\times ' + prev + '=' + 2 * prev), why: 'The totals don’t double. Each one adds the next square number.', code: 'u5l1-diag' }],
            'Pattern: 1, 5, 14, 30, … each grid adds the next square number.<br>' + t(prev + '+' + n + '^2=' + prev + '+' + n * n + '=' + tot) + ' ✓', ['1 by 1: 1; 2 by 2: 1 + 4 = 5; 3 by 3: 5 + 9 = 14. What is added each time?'], 'pattern check');
        } }] },
      { num: '3', stem: 'Use the tangram pieces (small triangle = 1 unit of area) to answer.<br>' + PK.tangramSVG({ maxW: 200 }), parts: [
        { id: '3a', level: 'BEG', make: function (r) { var pc = r.pick([['parallelogram', 2], ['square', 2], ['medium triangle', 2], ['large triangle', 4]]);
          return numPart('(a) How many small triangles cover the ' + pc[0] + '?', pc[1], [[1, 'The ' + pc[0] + ' is bigger than a small triangle. Imagine cutting it into small triangles.', 'u5l1-piece-units'], [pc[1] === 2 ? 4 : 2, pc[1] === 2 ? 'That’s a large triangle. The ' + pc[0] + ' is covered by 2 small triangles.' : 'A large triangle is covered by 4 small triangles (cut it in half, then in half again).', 'u5l1-piece-units']],
            'The ' + pc[0] + ' is covered by ' + pc[1] + ' small triangles.', ['Imagine drawing small triangles on the piece.'], 'small in ' + pc[0]); } },
        { id: '3b', level: 'EMG', make: function (r) { var q = r.pick([['medium triangles', 'one large triangle', 2, '4 ÷ 2 = 2'], ['small triangles', 'both large triangles together', 8, '4 + 4 = 8'], ['medium triangles', 'the whole tangram square', 8, '16 ÷ 2 = 8'], ['small triangles', 'the medium triangle and the square together', 4, '2 + 2 = 4'], ['medium triangles', 'both large triangles together', 4, '8 ÷ 2 = 4']]);
          return numPart('(b) How many ' + q[0] + ' cover ' + q[1] + '?', q[2], [[q[2] * 2, q[0] === 'medium triangles' ? 'That’s the number of <b>small</b> triangles. A medium triangle is 2 small triangles.' : null, 'u5l1-piece-units'], [q[2] / 2, q[0] === 'small triangles' ? 'Count small triangles: a large triangle is 4 of them, a medium triangle or square is 2.' : null, 'u5l1-piece-units']],
            'In small triangles: large = 4, medium = 2, square = 2.<br>' + t(q[3].replace(/÷/g, '\\div ')) + ', so ' + q[2] + ' ' + q[0] + '.', ['Change everything to small triangles first (large 4, medium 2, square 2).'], q[0] + ' in ' + q[1]); } },
        { id: '3c', level: 'EMG', make: function (r) { var X = r.pick(['square', 'medium triangle', 'parallelogram']), all = ['large triangle', 'medium triangle', 'small triangle', 'square', 'parallelogram'].filter(function (n) { return n !== X; });
          var want = ['square', 'medium triangle', 'parallelogram'].filter(function (n) { return n !== X; });
          return selectPart('(c) Which pieces have the same area as the <b>' + X + '</b>? Tap every one.', r.shuffle(all).map(function (n) { return { value: n, html: n }; }), want,
            function (extra, missing) { if (extra.indexOf('small triangle') >= 0) return { code: 'u5l1-piece-units', hint: 'A small triangle is only 1 unit. The ' + X + ' is 2 units.' }; if (extra.indexOf('large triangle') >= 0) return { code: 'u5l1-piece-units', hint: 'A large triangle is 4 units. The ' + X + ' is 2 units.' }; return { code: 'u5l1-piece-units', hint: 'One more piece has an area of 2 small triangles. They look different but have the same area.' }; },
            want.join(' and '), 'The square, the medium triangle and the parallelogram are 2 small triangles each, so the ' + X + ' has the same area as the ' + want.join(' and the ') + '. (Two small triangles together also have that area.)', ['Same area does not mean same shape. Count small triangles.'], 'same area as ' + X); } },
        { id: '3d', level: 'PRG', make: function (r) { var s = r.pick(SETS), a = area(s[1]), g = gcd(a, 16);
          return P.fraction('(d) What fraction of the whole tangram is ' + s[0] + '?', [a, 16], { diag: function (v) { if (Math.abs(v - s[1].length / 7) < 1e-9) return { code: 'u5l1-sevenths', hint: 'The pieces are not all the same size, so they are not sevenths. Use areas: the whole square is 16 small triangles.' }; if (Math.abs(v - a) < 1e-9) return { code: 'u5l1-units16', hint: 'That’s the number of units. Write it as a fraction of the whole square (16 units).' }; if (Math.abs(v - s[1].length / 16) < 1e-9) return { code: 'u5l1-count-pieces', hint: 'Count the area of each piece in small triangles, not the number of pieces.' }; return null; } },
            t(areaWords(s[1]) + '=' + a) + ' of the 16 units.<br>' + t('\\frac{' + a + '}{16}' + (g > 1 ? '=' + fracT(a, 16) : '')), ['Add the areas in small triangles. The whole tangram is 16.', 'Write it over 16 and simplify.'], 'fraction ' + s[0]); } },
        { id: '3e', level: 'PRG', make: function (r) { var pc = r.pick([['large triangle', '\\tfrac14', '\\tfrac18'], ['small triangle', '\\tfrac1{16}', '\\tfrac18'], ['parallelogram', '\\tfrac18', '\\tfrac14'], ['square', '\\tfrac18', '\\tfrac1{16}'], ['medium triangle', '\\tfrac18', '\\tfrac14']]);
          return P.mc(r, '(e) Ava says, "There are 7 pieces, so each piece is ' + t('\\tfrac17') + ' of the tangram. The ' + pc[0] + ' is ' + t('\\tfrac17') + '." Which correction is right?', [
            { html: 'The pieces are not all the same size, so they are not sevenths. The ' + pc[0] + ' is ' + t(pc[1]) + ' of the square.', right: true },
            { html: 'Ava is right: 7 pieces means each piece is ' + t('\\tfrac17') + '.', why: 'Sevenths would only work if all 7 pieces had the same area. Do they?', code: 'u5l1-sevenths' },
            { html: 'Every piece is ' + t('\\tfrac1{16}') + ', because the square is 16 small triangles.', why: 'Only a small triangle is 1 unit. The others are 2 or 4 units.', code: 'u5l1-piece-units' },
            { html: 'The ' + pc[0] + ' is ' + t(pc[2]) + ' of the square.', why: 'Count the ' + pc[0] + ' in small triangles, then put it over 16.', code: 'u5l1-piece-units' }],
            'The pieces have different areas: large triangle 4 units (' + t('\\tfrac14') + '), medium triangle, square and parallelogram 2 units each (' + t('\\tfrac18') + '), small triangle 1 unit (' + t('\\tfrac1{16}') + ').<br>So the ' + pc[0] + ' is ' + t(pc[1]) + ', not ' + t('\\tfrac17') + '.', ['Sevenths only work if all 7 pieces are the same size.'], 'Ava ' + pc[0]); } }] },
      { num: '4', stem: function (sh) { return 'A large tangram for a classroom wall is cut from a square of foam board ' + sh.s + ' cm by ' + sh.s + ' cm. Find the area of each kind of piece.'; }, shared: function (r) { return { s: r.pick([30, 28, 32, 36, 40, 48]) }; }, parts: [
        { id: '4', level: 'PRG', make: function (r, sh) { return tanAreaFields('Fill in each area (in cm²).', sh.s, 'foam ' + sh.s); } }] },
      { num: '5', stem: 'Use the <b>two small triangles and the square</b>.' + pieceRow([T_('S', [[0, 0], [1, 0], [0, 1]]), T_('S', [[0, 0], [1, 0], [0, 1]]), T_('Q', [[0, 0], [1, 0], [1, 1], [0, 1]])]), parts: [
        { id: '5a', level: 'EMG', make: function (r) { return shapeMC(r, 'the two small triangles and the square', null, SH3, SH3BAD, SH3BADWHY, 'rect', 'rectangle'); } },
        { id: '5b', level: 'EMG', make: function (r) { return shapeMC(r, 'the two small triangles and the square', null, SH3, SH3BAD, SH3BADWHY, 'tri', 'triangle'); } },
        { id: '5c', level: 'EMG', make: function (r) { return shapeMC(r, 'the two small triangles and the square', null, SH3, SH3BAD, SH3BADWHY, 'trap', 'trapezoid'); } }] },
      { num: '6', stem: 'Make a rectangle (twice as long as it is wide) with <b>all 7</b> tangram pieces.<br>' + PK.tangramSVG({ maxW: 180 }), parts: [
        { id: '6a', level: 'PRG', make: function (r) {
          var mk = function (a, b) { var pcs = a.concat(shiftT(b, 2)); return r.chance(0.5) ? flipX(pcs, 4) : pcs; };
          var opts = [{ html: mk(LL.sq, FIVE), right: true }, { html: mk(LL.sq, MMMM), why: 'That picture uses 4 medium triangles. A tangram has only 1.', code: 'u5l1-wrong-pieces' },
            { html: mk(LL.sq, LL.sq), why: 'That picture uses 4 large triangles. A tangram has only 2.', code: 'u5l1-wrong-pieces' }, { html: mk(FIVE, FIVE), why: 'That picture uses 10 pieces (2 of each small piece). A tangram has 7.', code: 'u5l1-wrong-pieces' }]
            .map(function (o) { o.html = PK.tanSVG(PK.tanMove(o.html, r.pick([0, 2, 4, 6])), { s: 32, maxW: 260, label: 'a rectangle made of tangram pieces' }); return o; });
          return mcCols(P.mc(r, '(a) Which picture shows the rectangle made from exactly the 7 tangram pieces? (Count each kind of piece.)', opts,
            PK.tanSVG(LL.sq.concat(shiftT(FIVE, 2)), { s: 22, maxW: 190 }) + '<br>The rectangle is 2 squares side by side. The two large triangles make one square; the other 5 pieces make the second square (as in Example 4(a)).', ['A tangram has 2 large triangles, 1 medium triangle, 2 small triangles, 1 square and 1 parallelogram.'], 'rectangle 7'), 2); } },
        { id: '6b', level: 'PRG', make: function (r) {
          return P.mc(r, '(b) Which strategy makes this puzzle quick?', [
            { html: 'See the rectangle as 2 squares. Put the large triangles (the biggest pieces) together first; then reuse the 5-piece square you already solved.', right: true },
            { html: 'Start with the small triangles, because they fit in the most places.', why: 'Small pieces fit almost anywhere, so they give the most guesses. Place the <b>biggest</b> pieces first.', code: 'u5l1-strategy' },
            { html: 'Make a systematic list of every order of the 7 pieces and try them all.', why: 'That list would be huge (thousands of orders). Use the area and the biggest pieces to cut down the guesses.', code: 'u5l1-strategy' },
            { html: 'Overlap the pieces a little so there are no gaps.', why: 'Tangram pieces may touch, but they never overlap.', code: 'u5l1-strategy' }],
            'Place the biggest pieces first: the two large triangles make one square. The other 5 pieces make the second square, a puzzle already solved (simplify the problem).', ['Think about Example 4(a).'], 'rectangle strategy'); } }] },
      { num: '7', stem: function (sh) { return 'Jordan wants to fill a silhouette with an area of <b>' + sh.A + ' units</b> (small triangle = 1 unit). Use area to eliminate the sets of pieces that cannot work.<br>' + sh.rows.map(function (s, i) { return '(' + String.fromCharCode(97 + i) + ') ' + s[0]; }).join('<br>'); },
        shared: function (r) {
          var DESC = [['both large triangles and the medium triangle', ['L', 'L', 'M']], ['one large triangle, the square and both small triangles', ['L', 'Q', 'S', 'S']], ['the medium triangle, the square, the parallelogram and both small triangles', ['M', 'Q', 'P', 'S', 'S']],
            ['one large triangle, the square, the parallelogram and both small triangles', ['L', 'Q', 'P', 'S', 'S']], ['one large triangle and the parallelogram', ['L', 'P']], ['both large triangles', ['L', 'L']], ['the square, the parallelogram and one small triangle', ['Q', 'P', 'S']],
            ['one large triangle, the medium triangle and one small triangle', ['L', 'M', 'S']], ['both large triangles and both small triangles', ['L', 'L', 'S', 'S']], ['the medium triangle and both small triangles', ['M', 'S', 'S']], ['one large triangle, the medium triangle and the square', ['L', 'M', 'Q']],
            ['both large triangles, the square and the parallelogram', ['L', 'L', 'Q', 'P']]];
          return find(function () { var A = r.pick([6, 8, 10, 12]), rows = r.sample(DESC, 4), y = rows.filter(function (s) { return area(s[1]) === A; }).length; return { A: A, rows: rows, y: y }; }, function (s) { return s.y >= 1 && s.y <= 3 && s.rows.every(function (x) { return Math.abs(area(x[1]) - s.A) <= 4; }); }, { A: 10, rows: DESC.slice(0, 4), y: 2 });
        }, parts: [
        { id: '7tot', sub: 'totals', level: 'EMG', make: function (r, sh) { return fieldsPart('Find the total area of each set (in small triangles).', sh.rows.map(function (s, i) { var id = String.fromCharCode(97 + i); return { label: '(' + id + ')', name: '(' + id + ')', ans: area(s[1]), after: 'units', bad: [[s[1].length, 'That’s the number of pieces. Add their <b>areas</b> (large 4, medium 2, square 2, parallelogram 2, small 1).', 'u5l1-count-pieces']] }; }),
          steps(sh.rows.map(function (s, i) { return '(' + String.fromCharCode(97 + i) + ') ' + t(areaWords(s[1]) + '=' + area(s[1])); })), ['Large triangle 4, medium triangle 2, square 2, parallelogram 2, small triangle 1.'], 'set areas ' + sh.A); } },
        { id: '7yn', sub: 'could it work?', level: 'PRG', make: function (r, sh) { var want = {}, rows = sh.rows.map(function (s, i) { var id = String.fromCharCode(97 + i); want[id] = area(s[1]) === sh.A ? 'yes' : 'no'; return { id: id, html: '(' + id + ') ' + s[0], label: '(' + id + ')' }; });
          return P.grid('Could each set fill the ' + sh.A + '-unit silhouette?', rows, [{ id: 'yes', html: 'Could work' }, { id: 'no', html: 'Ruled out' }], want, { why: function (row, got, w) { return { code: 'u5l1-grid-row', hint: 'Compare the total area of set (' + row + ') with ' + sh.A + ' units. ' + (w === 'no' ? 'A wrong area rules the set out.' : 'The right area means it is still worth trying.') }; } },
            steps(sh.rows.map(function (s, i) { var a = area(s[1]); return '(' + String.fromCharCode(97 + i) + ') ' + a + ' units: ' + (a === sh.A ? 'could work' : 'ruled out (not ' + sh.A + ')'); }).concat(['(The right area does not promise the pieces fit, but the wrong area rules a set out.)'])), ['Find each total area first. Only a total of ' + sh.A + ' could work.'], 'eliminate ' + sh.A); } }] },
      { num: '8', stem: 'A pentomino is 5 squares joined along full sides.', parts: [{ id: '8', level: 'EMG', make: function (r) { return isPentoPart(r, 6, 'is it a pentomino'); } }] },
      { num: '9', stem: 'Sort these six shapes into three pairs that are the same pentomino, and give each its letter name.', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var three = r.sample(LETTERS.filter(function (L) { return L !== 'X' && L !== 'I'; }), 3), shapes = [];
          three.forEach(function (L) { var a = randOrient(r, PENT[L]), b = find(function () { return randOrient(r, PENT[L]); }, function (c) { return keyOf(c) !== keyOf(a); }, move(a, 1)); shapes.push({ L: L, c: a }); shapes.push({ L: L, c: b }); });
          shapes = r.shuffle(shapes);
          var extra = r.sample(LETTERS.filter(function (L) { return three.indexOf(L) < 0; }), 2), letters = three.concat(extra).sort();
          var rows = shapes.map(function (s, i) { return { id: 's' + (i + 1), html: '<b>' + (i + 1) + '</b> ' + pic(s.c, 17), label: 'Shape ' + (i + 1) }; }), want = {};
          shapes.forEach(function (s, i) { want['s' + (i + 1)] = s.L; });
          return P.grid('Which pentomino is each shape? (Shapes may be turned or flipped.) These are the letters to choose from:' + refStrip(letters, 11), rows, letters.map(function (L) { return { id: L, html: '<b>' + L + '</b>' }; }), want,
            { why: function (row) { return { code: 'u5l1-grid-row', hint: 'Look at ' + row.replace('s', 'shape ') + ' again. Count its longest row and find where the extra squares stick out, then turn or flip it to match a letter.' }; } },
            three.map(function (L) { var ids = shapes.map(function (s, i) { return s.L === L ? i + 1 : 0; }).filter(Boolean); return 'Shapes ' + ids.join(' and ') + ': the <b>' + L + '</b> (' + (PK.relation(shapes[ids[0] - 1].c, shapes[ids[1] - 1].c) === 'flip' ? 'a flip' : 'a turn') + ')'; }).join('<br>'),
            ['Each letter is used by exactly two shapes.', 'Sort by the longest straight row first, then look at the bumps.'], 'pairs ' + three.join('')); } }] },
      { num: '10', stem: 'A <b>tetromino</b> is made of 4 squares joined along full sides. Find all of them with a systematic list sorted by the longest row.', parts: [
        { id: '10a', level: 'EMG', make: function (r) { return fieldsPart('(a) How many different tetrominoes have each longest row? How many are there in all?', [
            { label: '4 in a row:', name: '4 in a row', ans: 1 }, { label: '3 in a row:', name: '3 in a row', ans: 2, bad: [[3, 'With 3 in a row, the extra square goes on the end (an L) or the middle (a T). An L with the square at the other end is just a flip.', 'u5l1-flips-new'], [4, 'The extra square on the other side or the other end is just a turn or flip of the L or T.', 'u5l1-flips-new']] },
            { label: '2 in a row:', name: '2 in a row', ans: 2, bad: [[3, 'With 2 in a row: a 2 by 2 square, and a zigzag. The zigzag the other way is a flip, not new.', 'u5l1-flips-new'], [1, 'Don’t forget the zigzag (2 in a row, then 2 in a row moved over one).', 'u5l1-diag']] },
            { label: 'Total:', name: 'Total', ans: 5, bad: [[7, 'You counted flipped shapes as new. A flipped L is still the L, and a flipped zigzag is still the zigzag.', 'u5l1-flips-new'], [6, 'Check for a flipped shape counted twice.', 'u5l1-flips-new']] }],
          steps(['4 in a row: the straight one (1)', '3 in a row: the L and the T (2)', '2 in a row: the square and the zigzag (2)', 'Total: ' + t('1+2+2=5') + ' (flipped L’s and zigzags are not new)', pic(TETRO.I, 12) + ' ' + pic(TETRO.L, 12) + ' ' + pic(TETRO.T, 12) + ' ' + pic(TETRO.O, 12) + ' ' + pic(TETRO.S, 12)]), ['Before you count a shape, check it is not a turn or flip of one you already have.'], 'tetromino count'); } },
        { id: '10b', level: 'PRG', make: function (r) { return tetroDupMC(r, 'tetromino duplicate'); } }] },
      { num: '11', stem: 'Will it fold into an open box? Use the steps: pick a bottom square, fold the squares that touch it straight up, then fold the rest.', parts: [
        { id: '11a', sub: 'a–d', level: 'EMG', make: function (r) { return foldGrid(r, foldRows(r, 4), 'fold yes/no'); } },
        { id: '11b', sub: 'bottom', level: 'PRG', make: function (r) { return bottomPart(r, ['T', 'W', 'F', 'N', 'Y', 'Z'], 'bottom square'); } }] },
      { num: '12', stem: 'Lee makes a claim about open boxes.', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var cl = r.pick([
            { claim: 'Every pentomino with 4 squares in a row folds into an open box.', right: 'I', fold: ['L', 'Y', 'N'], why: 'The I has 4 squares in a row (it has 5), but 5 in a row wraps around and overlaps. Correct: "Every pentomino with <b>exactly</b> 4 in a row folds" (the L and the Y).' },
            { claim: 'Every pentomino with exactly 3 squares in a row folds into an open box.', right: r.pick(['U', 'P', 'V']), fold: ['T', 'F', 'X', 'Z'], why: null },
            { claim: 'Every pentomino with no 2 by 2 block folds into an open box.', right: r.pick(['I', 'U', 'V']), fold: ['T', 'W', 'Z', 'F', 'N'], why: null }]);
          var opts = [{ html: pic(randOrient(r, PENT[cl.right]), 18), right: true }].concat(r.sample(cl.fold, 3).map(function (L) { return { html: pic(randOrient(r, PENT[L]), 18), why: 'That pentomino (the ' + L + ') does fold into an open box, so it agrees with Lee. Look for one that fits his rule but does <b>not</b> fold.', code: 'u5l1-diag' }; }));
          return mcCols(P.mc(r, 'Lee says, "' + cl.claim + '" Which pentomino shows that Lee is wrong?', opts,
            cl.why || ('The ' + cl.right + ' fits Lee’s rule but does not fold: ' + FOLD_WHY[cl.right] + '. One example that breaks a rule is enough to show it is wrong.'), ['Find a pentomino that fits the rule but does not fold into an open box.'], 'Lee ' + cl.right), 4); } }] },
      { num: '13', stem: '', parts: [
        { id: '13a', level: 'ADV', make: function (r) { return tilingGrid(r, 5, 3, 3, ['PUV', 'LPV', 'NPU', 'FPU', 'PUY', 'LNV'], 3, 'tile 3x5'); } },
        { id: '13b', level: 'PRG', make: function (r) {
          return P.mc(r, '(b) Which tip helps you tile a rectangle with pentominoes?', [
            { html: 'Fill a corner first. If a piece closes off a gap that is not 5, 10, 15, … squares, that try can’t work, so move it.', right: true },
            { html: 'Put the pieces in alphabetical order.', why: 'The order of the letters has nothing to do with where the pieces fit.', code: 'u5l1-tile-why' },
            { html: 'Never flip a piece.', why: 'Pieces may be turned <b>and</b> flipped. Flipping is often what makes it fit.', code: 'u5l1-tile-why' },
            { html: 'Start in the middle, where there is the most room.', why: 'The middle gives the most choices. Corners and edges, where pieces fit in fewer ways, cut down the guessing.', code: 'u5l1-tile-why' }],
            'Corners and edges are where pieces fit in the fewest ways. A gap that is not a multiple of 5 squares can never be filled, so undo the last piece (eliminate possibilities).', ['Think about the tiling tips.'], 'tiling tip'); } }] },
      { num: '14', stem: function (sh) { return 'Mia makes a new tangram puzzle from exactly 3 pieces: <b>' + sh.set[0] + '</b>.'; }, shared: function (r) {
          return { set: r.pick([['both small triangles and the medium triangle', ['S', 'S', 'M'], 'Start with the medium triangle; the two small triangles together are the same shape as it.'], ['both small triangles and the square', ['S', 'S', 'Q'], 'The two small triangles together make a square the same size as the square piece.'],
            ['both large triangles and the medium triangle', ['L', 'L', 'M'], 'Place the two large triangles first: the biggest pieces fit in the fewest places.'], ['one large triangle, the square and the parallelogram', ['L', 'Q', 'P'], 'Place the large triangle first: it is the biggest piece.'],
            ['the medium triangle, the square and the parallelogram', ['M', 'Q', 'P'], 'Check the area first: 2 + 2 + 2 = 6 units. All three pieces have the same area.']]) }; },
        parts: [
        { id: '14a', level: 'EMG', make: function (r, sh) { var a = area(sh.set[1]); return numPart('(a) What is the area of her silhouette, in small-triangle units?', a, [[3, 'That’s the number of pieces. Add their areas (large 4, medium 2, square 2, parallelogram 2, small 1).', 'u5l1-count-pieces']], t(areaWords(sh.set[1]) + '=' + a) + ' units.', ['Add the areas of the 3 pieces.'], 'area of 3', { after: 'units' }); } },
        { id: '14b', level: 'EMG', make: function (r, sh) { var a = area(sh.set[1]);
          return P.mc(r, '(b) Which tip would really help a partner solve Mia’s puzzle?', [{ html: sh.set[2], right: true },
            { html: 'Place the smallest piece first: it fits in the most places.', why: 'A piece that fits in many places gives many guesses. Place the biggest pieces first.', code: 'u5l1-strategy' },
            { html: 'The silhouette has an area of 3 units, one for each piece.', why: 'The area is the total of the pieces’ areas (' + a + ' units), not the number of pieces.', code: 'u5l1-count-pieces' },
            { html: 'The pieces may overlap a little at the corners.', why: 'Tangram pieces touch but never overlap.', code: 'u5l1-strategy' }],
            'A true, helpful tip: ' + sh.set[2], ['Which tip follows the tangram rules and tips?'], 'tip'); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) { var A = r.pick([32, 48, 64, 80, 96, 128, 144, 160]), pc = pieceAreaChoice(r), ans = A / pc[1];
          var opts = [16, 8, 4, 2].map(function (d) { return { html: nf(A / d) + ' cm²', right: d === pc[1], why: d === 16 ? 'That’s a small triangle (1/16 of the square).' : d === 8 ? 'That’s 1/8 of the square: the medium triangle, the square or the parallelogram.' : d === 4 ? 'That’s a large triangle (1/4 of the square).' : 'That’s half the square (both large triangles together).', code: 'u5l1-piece-units' }; });
          return P.mc(r, 'A tangram is cut from a square with an area of ' + A + ' cm². What is the area of the ' + pc[0] + '?', opts, 'The ' + pc[0] + ' is ' + t(fracT(16 / pc[1], 16)) + ' of the square: ' + t(A + '\\div ' + pc[1] + '=' + nf(ans)) + ' cm²', ['Small triangle 1/16, medium triangle / square / parallelogram 1/8, large triangle 1/4.'], 'area of ' + pc[0], true); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) { var y = r.pick(PK.FOLDS), ns = r.sample(PK.NOFOLD, 3);
          var opts = [{ html: pic(randOrient(r, PENT[y]), 18), right: true }].concat(ns.map(function (L) { return { html: pic(randOrient(r, PENT[L]), 18), why: 'That is the ' + L + ': ' + FOLD_WHY[L] + '.', code: 'u5l1-diag' }; }));
          return mcCols(P.mc(r, 'Which pentomino folds into an open box?', opts, 'The ' + y + ' folds: pick the right bottom square and the other four fold up as four different sides. (The others: ' + ns.map(function (L) { return L + ' — ' + FOLD_WHY[L]; }).join('; ') + '.)', ['Eliminate 5 in a row and any 2 by 2 block first.'], 'which folds'), 4); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) { var s = r.pick([8, 12, 14, 16, 18]), pc = r.pick(['medium triangle', 'square', 'parallelogram']), A = s * s, ans = A / 8;
          return nrPart(r.pick(['Kenji', 'Aria', 'Sam']) + ' cuts a tangram from a square of card ' + s + ' cm by ' + s + ' cm. The area of the ' + pc + ' is ____ cm².', ans, [[A / 7, 'The pieces are not sevenths. The ' + pc + ' is 2 of the 16 units.', 'u5l1-sevenths'], [A / 16, 'That’s a small triangle. The ' + pc + ' is 2 small triangles.', 'u5l1-piece-units'], [A / 4, 'That’s a large triangle. The ' + pc + ' is 1/8 of the square.', 'u5l1-piece-units'], [s / 8, 'Find the area of the whole square first (side × side).', 'u5l1-side'], [A, 'That’s the whole square. The ' + pc + ' is 1/8 of it.', 'u5l1-diag']],
            steps(['Whole square: ' + t(s + '\\times ' + s + '=' + A) + ' cm²', 'The ' + pc + ' is ' + t('\\tfrac18') + ' of it: ' + t(A + '\\div 8=' + nf(ans)) + ' cm²']), ['Whole square = side × side. The ' + pc + ' is 2 of the 16 small triangles.'], 'NR ' + s); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var n = r.pick([5, 5, 6, 7]), prev = sqCount(n - 1, n - 1), ans = sqCount(n, n);
          return nrPart('Use the pattern from Example 1 and Question 2 (1, 5, 14, 30, …). The number of squares of any size in a ' + n + ' by ' + n + ' grid is ____.', ans, [[n * n, 'That counts only the 1 by 1 squares. Use the pattern: add the next square number each time.', 'u5l1-only-small'], [prev + n, 'Add the next <b>square number</b> (' + t(n + '^2') + '), not ' + n + '.', 'u5l1-add-n'], [n === 6 ? 55 : n === 7 ? 91 : 30, 'That’s the total for a smaller grid. Keep going to ' + n + ' by ' + n + '.', 'u5l1-diag']],
            steps([[1, 5, 14, 30, 55, 91, 140].slice(0, n).join(', ') + ': each grid adds the next square number.', t(prev + '+' + n + '^2=' + prev + '+' + n * n + '=' + ans), '(Systematic list: ' + t(Array.apply(null, { length: n }).map(function (x, i) { return (n - i) * (n - i); }).join('+') + '=' + ans) + ' ✓)']), ['Each grid adds the next square number: 1, 1 + 4, 1 + 4 + 9, …'], 'NR squares ' + n); } }] }
    ],
    extra: [
      stratQ('1', ['list', 'pattern', 'guess', 'model'], ['model', 'guess', 'list', 'pattern'], 'A. Skills', true),
      { num: '2', stem: function (sh) { return 'A tangram is cut from a square of card ' + sh.s + ' cm by ' + sh.s + ' cm. Find the area of each kind of piece. Check that the 7 pieces add up to the whole square.'; }, shared: function (r) { return { s: r.pick([24, 16, 32, 28, 36, 44]) }; }, parts: [
        { id: 'e2', level: 'EMG', make: function (r, sh) { return tanAreaFields('Fill in each area (in cm²).', sh.s, 'card ' + sh.s); } }] },
      { num: '3', stem: function (sh) { return 'How many squares of any size are in this ' + sh.m + ' by ' + sh.n + ' rectangle? Make a systematic list.<br>' + gridSVG(sh.m, sh.n, 22); }, shared: function (r) { return find(function () { return { m: r.pick([2, 3]), n: r.int(4, 7) }; }, function (s) { return s.n > s.m + 1; }, { m: 2, n: 5 }); }, parts: [
        { id: 'e3', level: 'PRG', make: function (r, sh) { return sqTable('How many squares of each size are there, and how many in all?', sh.m, sh.n, 'rect ' + sh.m + 'x' + sh.n); } }] },
      { num: '4', stem: '', parts: [{ id: 'e4', level: 'EMG', make: function (r) { return relPart(r, r.shuffle(['turn', 'flip', 'diff']), 'same or different'); } }] },
      { num: '5', stem: 'Use only the <b>two large triangles</b>.' + pieceRow([T_('L', [[0, 0], [2, 0], [0, 2]]), T_('L', [[0, 0], [2, 0], [0, 2]])]), parts: ['sq', 'tri', 'para'].map(function (k, i) {
        return { id: 'e5' + 'abc'.charAt(i), level: 'EMG', make: function (r) { var bad = {}; Object.keys(LL).forEach(function (kk) { bad[kk] = LL[kk].map(splitL).reduce(function (a, b) { return a.concat(b); }, []); });
          return shapeMC(r, 'the two large triangles', null, LL, bad, { sq: 'That uses 4 medium triangles, not the two large triangles.', tri: 'That uses 4 medium triangles, not the two large triangles.', para: 'That uses 4 medium triangles, not the two large triangles.' }, k, 'two large ' + k); } }; }) },
      { num: '6', section: 'B. Applying', stem: 'Make a square with <b>4</b> pieces: one large triangle, the medium triangle and both small triangles.', parts: [
        { id: 'e6a', level: 'BEG', make: function (r) { return numPart('(a) What is the area of the square, in small-triangle units?', 8, [[4, 'That’s the number of pieces. Add their areas: 4 + 2 + 1 + 1.', 'u5l1-count-pieces'], [16, 'That’s the whole tangram. Add the areas of these 4 pieces only.', 'u5l1-diag']], t('4+2+1+1=8') + ' units: half of the whole tangram.', ['Large 4, medium 2, small 1 each.'], 'area 4 pieces', { after: 'units' }); } },
        { id: 'e6b', level: 'PRG', make: function (r) {
          var big = T_('L', [[0, 0], [2, 0], [0, 2]]), OK = [big, T_('M', [[2, 0], [2, 2], [1, 1]]), T_('S', [[0, 2], [1, 2], [1, 1]]), T_('S', [[1, 2], [2, 2], [1, 1]])];
          var MM = [big, T_('M', [[2, 0], [2, 2], [1, 1]]), T_('M', [[2, 2], [0, 2], [1, 1]])], LL2 = LL.sq, QS = [big, T_('Q', [[1, 1], [2, 1], [2, 2], [1, 2]]), T_('S', [[2, 0], [2, 1], [1, 1]]), T_('S', [[0, 2], [1, 2], [1, 1]])];
          var opts = [{ html: OK, right: true }, { html: MM, why: 'That uses two medium triangles. A tangram has only one.', code: 'u5l1-wrong-pieces' }, { html: LL2, why: 'That uses two large triangles, not the medium and small triangles.', code: 'u5l1-wrong-pieces' }, { html: QS, why: 'That uses the square instead of the medium triangle.', code: 'u5l1-wrong-pieces' }]
            .map(function (o) { o.html = tanOpt(o.html, r); return o; });
          return mcCols(P.mc(r, '(b) Which picture shows the square made from exactly these 4 pieces?' + pieceRow([big, T_('M', [[0, 0], [2, 0], [1, 1]]), T_('S', [[0, 0], [1, 0], [0, 1]]), T_('S', [[0, 0], [1, 0], [0, 1]])]), opts,
            PK.tanSVG(OK, { s: 26, maxW: 150 }) + '<br>The large triangle fills half of the square (cut along a diagonal). The medium triangle fills half of the other half, and the two small triangles fill the rest.', ['Count each kind of piece in the picture.'], '4-piece square'), 2); } }] },
      { num: '7', stem: 'Will it fold into an open box?', parts: [
        { id: 'e7a', sub: 'a–d', level: 'EMG', make: function (r) { return foldGrid(r, foldRows(r, 4), 'fold yes/no'); } },
        { id: 'e7b', sub: 'bottom', level: 'PRG', make: function (r) { return bottomPart(r, ['F', 'N', 'Z', 'Y', 'T', 'W'], 'bottom square'); } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', make: function (r) { return gapMC(r, ['LNV', 'PUV', 'LPV', 'NPU', 'FPU', 'PUY'], 'gap'); } }] },
      { num: '9', stem: 'Ben says, "Each side of a large triangle is twice as long as the matching side of a small triangle, so a large triangle has twice the area of a small one."', parts: [
        { id: 'e9', level: 'PRG', make: function (r) {
          return P.mc(r, 'Which correction is right?', [
            { html: 'Doubling the sides makes the shape twice as long <b>and</b> twice as wide, so the area is ' + t('2\\times 2=4') + ' times as big. A large triangle is 4 small triangles.', right: true },
            { html: 'Ben is right: twice the sides means twice the area.', why: 'Cover a large triangle with small triangles. How many does it take?', code: 'u5l1-double-area' },
            { html: 'The area is 3 times as big, because a triangle has 3 sides.', why: 'The number of sides doesn’t decide it. Doubling the length and the width gives 2 × 2.', code: 'u5l1-double-area' },
            { html: 'The area is 8 times as big, because ' + t('2^3=8') + '.', why: '2³ is for volume (length, width and height). Area has only length and width: 2 × 2.', code: 'u5l1-double-area' }],
            'Doubling every side doubles the length and the width: area ' + t('\\times 2\\times 2=\\times 4') + '.<br>A large triangle is covered by 4 small triangles (4 units, not 2).', ['Try it: how many small triangles cover a large triangle?'], 'Ben area'); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var tg = r.pick([[8, 'half'], [4, 'one quarter'], [6, 'three-eighths']]), POOL = [['one large triangle and the medium triangle', ['L', 'M']], ['both large triangles and one small triangle', ['L', 'L', 'S']], ['one large triangle, the square and the parallelogram', ['L', 'Q', 'P']], ['the square, the parallelogram, the medium triangle and one small triangle', ['Q', 'P', 'M', 'S']],
            ['both small triangles and the square', ['S', 'S', 'Q']], ['the medium triangle and the square', ['M', 'Q']], ['one large triangle and one small triangle', ['L', 'S']], ['one large triangle and both small triangles', ['L', 'S', 'S']], ['the square and one small triangle', ['Q', 'S']], ['both large triangles', ['L', 'L']], ['the square, the parallelogram and both small triangles', ['Q', 'P', 'S', 'S']]];
          var set = find(function () { var right = r.pick(POOL.filter(function (s) { return area(s[1]) === tg[0]; })), wr = r.sample(POOL.filter(function (s) { var a = area(s[1]); return a !== tg[0] && Math.abs(a - tg[0]) <= 3; }), 3); return wr.length === 3 ? [right, wr] : null; }, function (x) { return !!x; }, null);
          var opts = [{ html: set[0][0], right: true }].concat(set[1].map(function (s) { return { html: s[0], why: 'That set is ' + areaWords(s[1]) + ' = ' + area(s[1]) + ' units. You need ' + tg[0] + '.', code: 'u5l1-piece-units' }; }));
          return P.mc(r, 'Which set of tangram pieces covers exactly <b>' + tg[1] + '</b> of the whole tangram square?', opts, tg[1] + ' of 16 units is ' + tg[0] + ' units. ' + t(areaWords(set[0][1]) + '=' + tg[0]) + ' ✓', ['The whole tangram is 16 units. Find ' + tg[1] + ' of 16, then add each set’s areas.'], 'cover ' + tg[1]); } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'EMG', make: function (r) { var s = r.pick([10, 6, 14, 18, 22]), pc = r.pick(['parallelogram', 'square', 'medium triangle']), A = s * s, ans = A / 8;
          return nrPart('A tangram is cut from a ' + s + ' cm by ' + s + ' cm square. The area of its ' + pc + ' is ____ cm².', ans, [[A / 7, 'The pieces are not sevenths. The ' + pc + ' is 1/8 of the square.', 'u5l1-sevenths'], [A / 16, 'That’s a small triangle. The ' + pc + ' is 2 small triangles.', 'u5l1-piece-units'], [A / 4, 'That’s a large triangle.', 'u5l1-piece-units'], [s / 8, 'Find the area of the whole square first.', 'u5l1-side']],
            steps(['Whole square: ' + t(s + '\\times ' + s + '=' + A) + ' cm²', 'The ' + pc + ' is ' + t('\\tfrac18') + ' of it: ' + t(A + '\\div 8=' + nf(ans)) + ' cm²']), ['The ' + pc + ' is 2 of the 16 small triangles.'], 'NR card ' + s); } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'Can the 5 different tetrominoes tile a ' + sh.h + ' by ' + sh.w + ' rectangle? The rectangle is coloured like a checkerboard.<br>' + checkerSVG(sh.h, sh.w) + '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-top:6px">' + ['I', 'O', 'T', 'L', 'S'].map(function (T) { return pic(TETRO[T], 11); }).join('') + '</div>'; }, shared: function (r) { return r.pick([{ h: 4, w: 5 }, { h: 2, w: 10 }]); }, parts: [
        { id: 'e12a', level: 'EMG', make: function (r, sh) { return P.mc(r, '(a) Does the area rule it out?', [{ html: 'No: ' + t(sh.h + '\\times ' + sh.w + '=20') + ' squares, and 5 tetrominoes cover ' + t('5\\times 4=20') + '.', right: true }, { html: 'Yes: 20 is not a multiple of 5.', why: 'Tetrominoes have 4 squares each, not 5. Is 20 a multiple of 4?', code: 'u5l1-area-only' }, { html: 'Yes: the pieces cover 25 squares.', why: '5 pieces × 4 squares = 20.', code: 'u5l1-area-only' }], 'Area: ' + t(sh.h + '\\times ' + sh.w + '=20') + ' and ' + t('5\\times 4=20') + ', so the area does not rule it out.', ['Each tetromino covers 4 squares.'], 'area check'); } },
        { id: 'e12b', level: 'EMG', make: function (r, sh) { return fieldsPart('(b) How many dark squares and how many light squares are there?', [{ label: 'Dark:', name: 'Dark', ans: 10, bad: [[20, 'That’s every square. Count only the dark ones.', 'u5l1-diag']] }, { label: 'Light:', name: 'Light', ans: 10, bad: [[20, 'That’s every square. Count only the light ones.', 'u5l1-diag']] }], 'Each row of ' + sh.w + ' alternates dark and light' + (sh.w % 2 ? '' : ' (' + sh.w / 2 + ' of each)') + ': 10 dark, 10 light.', ['Count one row, then multiply.'], 'checker count'); } },
        { id: 'e12c', level: 'ADV', make: function (r, sh) { return fieldsPart('(c) The T tetromino always covers 3 squares of one colour and 1 of the other. Each of the other four always covers 2 dark and 2 light. How many dark squares can the 5 pieces cover in total? Give the smallest and the largest possible total.', [
            { label: 'Smallest:', name: 'Smallest', ans: 9, bad: [[10, 'The T covers 3 of one colour and 1 of the other, so it can’t add 2 dark squares.', 'u5l1-ten'], [8, 'Add the four pieces (2 + 2 + 2 + 2 = 8), then the T’s dark squares (1 or 3).', 'u5l1-diag']] },
            { label: 'Largest:', name: 'Largest', ans: 11, bad: [[10, 'The T covers 3 of one colour and 1 of the other, so it can’t add 2 dark squares.', 'u5l1-ten'], [12, 'The T covers at most 3 dark squares: 8 + 3.', 'u5l1-diag']] }],
          steps(['Four pieces: ' + t('2+2+2+2=8') + ' dark squares', 'The T: 1 or 3 dark squares', 'Total: ' + t('8+1=9') + ' or ' + t('8+3=11')]), ['Add the dark squares of the four pieces first.'], 'checker totals'); } },
        { id: 'e12d', level: 'PRG', make: function (r, sh) { return P.mc(r, '(d) So, can it be done?', [
            { html: 'No. The pieces always cover 9 or 11 dark squares, but the rectangle has exactly 10.', right: true },
            { html: 'Yes. The area matches, so there must be a way.', why: 'The right area doesn’t promise a tiling. Compare the dark squares: 9 or 11 against 10.', code: 'u5l1-area-only' },
            { html: 'Yes, if you flip the T over.', why: 'Flipping the T still covers 3 of one colour and 1 of the other.', code: 'u5l1-tile-why' },
            { html: 'No, because the T can’t fit in a corner.', why: 'The T can fit in a corner. The real reason is the count of dark squares.', code: 'u5l1-tile-why' }],
            'No. Wherever the pieces go, they cover 9 or 11 dark squares, never 10. The checkerboard eliminates every possible try.', ['Compare your answers to (b) and (c).'], 'checker conclusion'); } }] },
      { num: '13', stem: '', parts: [{ id: 'e13', level: 'MAS', make: function (r) { return cubePart(r, 'closed cube'); } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'MAS', make: function (r) { return tilingGrid(r, 5, 4, 4, ['NTVY', 'FLPU', 'FPUY', 'FLTY', 'LPYZ', 'LPTY', 'LPUY', 'NPUY', 'PUVZ'], 5, 'tile 4x5'); } }] }
    ]
  });
  function checkerSVG(h, w) { var s = 22, out = svgOpen(w * s, h * s, 'a ' + h + ' by ' + w + ' checkerboard', 260); for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) out += '<rect x="' + x * s + '" y="' + y * s + '" width="' + s + '" height="' + s + '" fill="' + ((x + y) % 2 ? '#ffffff' : '#9aa3b2') + '" stroke="' + INK + '" stroke-width="1"/>'; return out + '</svg>'; }
})(window);
