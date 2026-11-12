/* Unit 3 project: Reno Crew (Length, Area and Surface Area: M1, M2, M3, M4, A1).
 * The student's crew gets a job to redo a basement room: pick one of 3 floor plans (each crew gets its own sizes),
 * read the door width off a tape measure, change feet-and-inches to inches and decimal feet, convert a metric window,
 * buy baseboard (perimeter − doors, whole boards), find missing sides on the client's smudged plans (rearranging
 * formulas), lay flooring (composite area + 10% waste, whole boxes, a metric underlay), paint the walls (perimeter ×
 * height − door − window, 2 coats, whole cans), build a round table top or a half-moon window (circumference and
 * area), then write the client a printable quote with GST and hand it in. Every answer is checked against the
 * student's own room and choices (a later box uses the student's own earlier numbers, so one slip doesn't snowball).
 * Worked examples use a different crew: Chinook Carpentry. Engine: js/projects.js. Each checkpoint also has solve(c),
 * which fills in right answers (tests/projects_u3_test.js and tests/projects_u3_e2e.py).
 * Styles: assets/projects-u3.css (added to the page by this file if the page doesn't link it). */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, money = PJ.money, esc = PJ.esc;
  var hasDoc = typeof document !== 'undefined';
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  if (hasDoc && PJ.site != null && !document.querySelector('link[href*="projects-u3.css"]')) {
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = PJ.site + 'assets/projects-u3.css'; document.head.appendChild(lk);
  }
  var PI = Math.PI, GST = 0.05, M2FT = 10.76, CMFT = 30.48, DOOR_H = 80;

  /* ================= numbers and lengths ================= */
  /* a typed length: "172.5", "172 1/2", "172-1/2", "7/16", "$12" → number (NaN if it isn't one) */
  function pm(s) {
    if (s == null) return NaN;
    var t = String(s).trim().replace(/[⁄∕]/g, '/').replace(/\s*(in|inches|ft|feet|ft²|ft2|m²|m2|sq\.? ?ft|")\s*$/i, '');
    var m = /^(\d+)\s*[- ]\s*(\d+)\s*\/\s*(\d+)$/.exec(t); if (m) return +m[3] ? +m[1] + m[2] / m[3] : NaN;
    m = /^(\d+)\s*\/\s*(\d+)$/.exec(t); if (m) return +m[2] ? m[1] / m[2] : NaN;
    return PJ.parse(t);
  }
  function mine(c, k, fb) { var x = pm(c.get(k)); return isNaN(x) ? fb : x; } // the student's own number (or the right one)
  function fx(x, n) { return String(Number((+x).toFixed(n == null ? 2 : n))); }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function inStr(i) { var w = Math.floor(i + 1e-9), half = i - w > 0.25; return (w === 0 && half ? '' : String(w)) + (half ? '½' : ''); }
  function ftin(x) { var f = Math.floor(x / 12 + 1e-9), i = x - 12 * f; return f + ' ft' + (i > 0.01 ? ' ' + inStr(i) + ' in' : ''); }
  function frH(n, d) { return '<span class="pj-u3-fr"><sup>' + n + '</sup>&frasl;<sub>' + d + '</sub></span>'; }
  function tapeTxt(T) { var g = gcd(T.k, 16); return T.w + ' ' + (T.k / g) + '/' + (16 / g) + ' in'; }
  function tapeH(T) { var g = gcd(T.k, 16); return T.w + ' ' + frH(T.k / g, 16 / g) + ' in'; }
  function hv(c, k) { return PJ.hash(c.seed + '|' + k); }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }

  /* ================= the rooms (all lengths in inches; every wall is a multiple of 1½ in, so decimal feet stop at 3 places) ================= */
  var ROOMS = {
    rec: { name: 'L-shaped rec room', icon: '🎱', blurb: 'A big basement rec room that wraps around the stairs', h: 94.5, hours: 22,
      V: [{ L: 294, W: 216, a: 124.5, b: 85.5 }, { L: 273, W: 208.5, a: 108, b: 79.5 }, { L: 301.5, W: 201, a: 138, b: 88.5 }],
      WIN: [[120, 60], [100, 60], [150, 60]],
      build: function (p, tape) {
        var L = p.L, W = p.W, a = p.a, b = p.b;
        return { pts: [[0, 0], [L - a, 0], [L - a, b], [L, b], [L, W], [0, W]], L: L, W: W, lt: { 1: 0.5 },
          parts: { split: [{ n: 'A', x: 0, y: b, w: L, h: W - b, s: 1 }, { n: 'B', x: 0, y: 0, w: L - a, h: b, s: 1 }],
            cut: [{ n: 'A', x: 0, y: 0, w: L, h: W, s: 1, whole: 1 }, { n: 'B', x: L - a, y: 0, w: a, h: b, s: -1 }] },
          out: { x: L - a, y: 0, w: a, h: b, label: 'Stairs' },
          doors: [{ side: 5, t: 0.27, w: tape, tape: 1 }, { side: 2, t: 0.5, w: 36, kind: 'open', label: '3 ft opening (stairs)' }],
          win: { side: 4, t: 0.24 } };
      } },
    bed: { name: 'Bedroom with a closet', icon: '🛏️', blurb: 'A basement bedroom with a walk-in closet nook', h: 96, hours: 14,
      V: [{ L: 148.5, W: 135, cw: 73.5, cd: 25.5, off: 25.5 }, { L: 157.5, W: 130.5, cw: 84, cd: 24, off: 27 }, { L: 141, W: 139.5, cw: 67.5, cd: 27, off: 24 }],
      WIN: [[120, 90], [100, 100], [120, 120]],
      build: function (p, tape) {
        var L = p.L, W = p.W, cw = p.cw, cd = p.cd, off = p.off, r = L - off - cw;
        return { pts: [[0, cd], [off, cd], [off, 0], [off + cw, 0], [off + cw, cd], [L, cd], [L, cd + W], [0, cd + W]], L: L, W: W, lt: { 1: 0.8, 3: 0.2 },
          parts: { split: [{ n: 'A', x: 0, y: cd, w: L, h: W, s: 1 }, { n: 'B', x: off, y: 0, w: cw, h: cd, s: 1 }],
            cut: [{ n: 'A', x: 0, y: 0, w: L, h: W + cd, s: 1, whole: 1, lx: 0.5, ly: 0.72 }, { n: 'B', x: 0, y: 0, w: off, h: cd, s: -1 }, { n: 'C', x: off + cw, y: 0, w: r, h: cd, s: -1 }] },
          inside: { x: off, y: 0, w: cw, h: cd, label: 'Closet' },
          doors: [{ side: 6, t: 0.22, w: tape, tape: 1 }],
          win: { side: 7, t: 0.5 } };
      } },
    suite: { name: 'Basement suite living room', icon: '🛋️', blurb: 'A suite living room with a walk-out patio door', h: 97.5, hours: 20,
      V: [{ L: 234, W: 172.5, nw: 61.5, nd: 54, off: 87 }, { L: 243, W: 166.5, nw: 57, nd: 46.5, off: 96 }, { L: 226.5, W: 180, nw: 72, nd: 49.5, off: 76.5 }],
      WIN: [[150, 90], [120, 90], [180, 90]],
      build: function (p, tape) {
        var L = p.L, W = p.W, nw = p.nw, nd = p.nd, off = p.off, r = L - off - nw;
        return { pts: [[0, 0], [L, 0], [L, W], [off + nw, W], [off + nw, W - nd], [off, W - nd], [off, W], [0, W]], L: L, W: W, lt: { 3: 0.5, 5: 0.25 }, flip: { 3: 1, 4: 1, 5: 1 },
          parts: { split: [{ n: 'A', x: 0, y: 0, w: off, h: W, s: 1 }, { n: 'B', x: off, y: 0, w: nw, h: W - nd, s: 1 }, { n: 'C', x: off + nw, y: 0, w: r, h: W, s: 1 }],
            cut: [{ n: 'A', x: 0, y: 0, w: L, h: W, s: 1, whole: 1 }, { n: 'B', x: off, y: W - nd, w: nw, h: nd, s: -1 }] },
          out: { x: off, y: W - nd, w: nw, h: nd, label: 'Mech.', ly: 0.55 },
          doors: [{ side: 6, t: 0.68, w: tape, tape: 1 }, { side: 0, t: 0.28, w: 72, kind: 'slide', label: '6 ft patio door' }],
          win: { side: 1, t: 0.3 } };
      } }
  };
  var ROOM_IDS = ['rec', 'bed', 'suite'];
  var TAPE_K = [3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14];
  /* the door the crew measures: 30–34 in plus some 16ths */
  function tapeOf(c) { var w = 30 + hv(c, 'tw') % 5, k = TAPE_K[hv(c, 'tk') % TAPE_K.length]; return { w: w, k: k, v: w + k / 16 }; }
  function mkGeo(g) {
    g.sides = g.pts.map(function (p, i) { var q = g.pts[(i + 1) % g.pts.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
    g.doorsIn = sum((g.doors || []).map(function (d) { return d.w; }));
    return g;
  }
  function geo(c, id) {
    id = id || c.get('room'); var R = ROOMS[id]; if (!R) return null;
    var T = tapeOf(c), vi = hv(c, 'v') % 3, g = mkGeo(R.build(R.V[vi], T.v));
    g.id = id; g.R = R; g.h = R.h; g.hours = R.hours; g.tape = T; g.winCm = R.WIN[hv(c, 'win') % 3];
    return g;
  }
  var CLIENTS = ['the Martins', 'the Okafors', 'the Larsens', 'the Singhs', 'the Tremblays', 'the Wongs', 'the Kowalskis', 'the Haddads'];
  var STREETS = ['Prairie Lane', 'Willow Way', 'Aspen Drive', 'Chinook Crescent', 'Fescue Road', 'Poplar Place'];
  var TOWNS = ['Airdrie', 'Cochrane', 'Chestermere', 'Crossfield', 'Okotoks', 'Red Deer'];
  function job(c) { return { client: CLIENTS[hv(c, 'cl') % CLIENTS.length], address: (110 + hv(c, 'no') % 880) + ' ' + STREETS[hv(c, 'st') % STREETS.length] + ', ' + TOWNS[hv(c, 'tn') % TOWNS.length] + ', AB', no: 2000 + hv(c, 'q') % 7000 }; }

  /* ================= what the crew can buy ================= */
  var TRIMS = { mdf: { name: 'Primed MDF, 3¼ in', p8: 11.48, p12: 16.98, look: 'Smooth, ready to paint' }, pine: { name: 'Primed pine, 4¼ in', p8: 17.98, p12: 26.48, look: 'Tall and sturdy' }, oak: { name: 'Red oak, 3½ in', p8: 34.97, p12: 51.98, look: 'Real wood, stained' } };
  var TRIM_IDS = ['mdf', 'pine', 'oak'];
  var FLOORS = { lvp: { name: 'Vinyl plank', cov: 23.64, price: 64.99, look: 'Waterproof, wood look', fill: '#e8d3ad' }, lam: { name: 'Laminate', cov: 19.63, price: 41.99, look: 'Oak look, click-together', fill: '#d6b07c' }, cpt: { name: 'Carpet tiles', cov: 53.82, price: 119.99, look: 'Soft, easy to replace', fill: '#aab6c4' } };
  var FLOOR_IDS = ['lvp', 'lam', 'cpt'];
  var UNDERLAY = { name: 'Underlay (moisture barrier)', m2: 10, price: 49.98 };
  var PAINTS = { basic: { name: 'Basic eggshell', cov: 350, price: 39.98, look: 'Good value' }, pro: { name: 'Pro matte', cov: 400, price: 62.98, look: 'Hides marks well' }, prem: { name: 'Premium scrubbable', cov: 425, price: 79.98, look: 'Wipes clean' } };
  var PAINT_IDS = ['basic', 'pro', 'prem'];
  var PCOLS = [['#b9cba5', 'Sage'], ['#bcd3e6', 'Sky'], ['#ecd9b0', 'Wheat'], ['#d9c3df', 'Lilac'], ['#cfcac3', 'Greige'], ['#efb9a6', 'Coral']];
  var FEATS = {
    table: { name: 'Round table top', icon: '🍽️', D: [36, 42, 48], trim: { name: 'Edge banding', price: 1.49 }, mat: { name: 'Maple plywood top', price: 7.25 },
      blurb: 'A round games table. Edge banding goes all the way around the edge.' },
    moon: { name: 'Half-moon window', icon: '🌗', D: [30, 36, 42], trim: { name: 'Window trim', price: 3.95 }, mat: { name: 'Glass', price: 21.5 },
      blurb: 'A half-circle window for the new door. Trim goes around the curve <b>and</b> the straight bottom edge.' }
  };
  var RATES = [45, 55, 65, 75];
  var COLORS = [['#2563eb', 'Blue'], ['#dc2626', 'Red'], ['#16a34a', 'Green'], ['#ea580c', 'Orange'], ['#7c3aed', 'Purple'], ['#0f766e', 'Teal']];
  var CREW_IDEAS = ['Measure Twice Renos', 'Level Best Crew', 'Stud Finders', 'Square Deal Renos', 'Nail It Interiors'];
  function featOf(c) { var id = c.get('feat'), F = FEATS[id]; if (!F) return null; return { id: id, F: F, d: F.D[hv(c, 'fd' + id) % 3] }; }

  /* ================= result builders ================= */
  function R0(f, ok, x) { var r = { f: f, ok: !!ok, blank: false, graded: true }; if (x) for (var k in x) r[k] = x[k]; return r; }
  /* a number (mixed numbers like 172 1/2 are fine) within o.tol of exp; o.wrong: [{ v, tol, hint }] */
  function numR(c, k, exp, o) {
    o = o || {}; var base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!c.has(k)) return R0(k, false, Object.assign(base, { blank: true }));
    var x = pm(c.get(k)), tol = o.tol == null ? 0.011 : o.tol;
    if (isNaN(x)) return R0(k, false, Object.assign(base, { form: true, hint: 'Type just a number, like 12.5.' }));
    if (Math.abs(x - exp) <= tol + 1e-9) return R0(k, true, base);
    var w = o.wrong || [];
    for (var i = 0; i < w.length; i++) { var wt = w[i].tol == null ? tol : w[i].tol; if (w[i].v != null && isFinite(w[i].v) && Math.abs(x - w[i].v) <= wt + 1e-9 && Math.abs(w[i].v - exp) > tol) return R0(k, false, Object.assign(base, { hint: w[i].hint })); }
    if (exp && Math.abs(x - exp * 12) <= tol * 12 + 0.02) return R0(k, false, Object.assign(base, { hint: o.unit === 'ft' ? 'That looks like inches. Divide by 12 to get feet.' : 'Your answer is 12 times too big. Check your units.' }));
    return R0(k, false, Object.assign(base, { hint: o.hint || 'Check this one again.' }));
  }
  /* how many to buy: raw amount ÷ what one covers, rounded UP */
  function countR(c, k, raw, o) {
    o = o || {}; var exp = Math.ceil(raw - 1e-9), x = pm(c.get(k)), noun = o.noun || 'box', plural = o.plural || noun + (noun === 'box' ? 'es' : 's');
    var wrong = (o.wrong || []).concat([{ v: Math.floor(raw + 1e-9), tol: 0, hint: 'You can’t buy part of a ' + noun + '. Round <b>up</b> — even a little extra means one more ' + noun + '.' }]);
    if (c.has(k) && !isNaN(x) && Math.abs(x - Math.round(x)) > 1e-9) return R0(k, false, { label: o.label, hint2: o.hint2, hint: 'Stores sell whole ' + plural + '. ' + fx(raw, 2) + ' rounds <b>up</b> to ' + exp + '.' });
    return numR(c, k, exp, { tol: 0, label: o.label, wrong: wrong, hint: o.hint || 'Divide, then round up to a whole number.', hint2: o.hint2 });
  }
  /* π answers: 3.14 or the π key are both fine */
  function piTol(x) { return 0.02 + Math.abs(x) * 0.0006; }

  /* ================= drawings ================= */
  var UID = 0;
  /* a floor plan. o: { small, parts: 'split'|'cut', paint: colour, floor: id, tapeKnown, hideLabels, maxW, maxH } */
  function planSvg(G, o) {
    o = o || {}; var id = 'u3p' + (++UID), small = !!o.small;
    var xs = G.pts.map(function (p) { return p[0]; }), ys = G.pts.map(function (p) { return p[1]; });
    var bw = Math.max.apply(null, xs), bh = Math.max.apply(null, ys);
    var px = small ? 6 : 96, py = small ? 6 : 34, maxW = small ? 150 : (o.maxW || 540), maxH = small ? 96 : (o.maxH || 360);
    var s = Math.min(maxW / bw, maxH / bh), W = bw * s + 2 * px, H = bh * s + 2 * py, wall = small ? 3 : 7;
    function X(x) { return +(px + x * s).toFixed(1); } function Y(y) { return +(py + y * s).toFixed(1); }
    function P(p) { return X(p[0]) + ',' + Y(p[1]); }
    function txt(x, y, t, a, cls) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (a || 'middle') + '" class="' + (cls || 'pj-u3-lab') + '">' + t + '</text>'; }
    var poly = G.pts.map(P).join(' '), F = FLOORS[o.floor];
    var svg = '<svg class="pj-u3-svg' + (small ? ' sm' : '') + '" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" role="img" aria-label="' + esc(o.aria || 'Floor plan of the ' + (G.R ? G.R.name.toLowerCase() : 'room')) + '">' +
      '<defs><pattern id="' + id + 'h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#eef0f3"/><line x1="0" y1="0" x2="0" y2="8" stroke="#b7bec9" stroke-width="2.4"/></pattern>' +
      '<pattern id="' + id + 'x" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="7" height="7" fill="rgba(220,38,38,.12)"/><line x1="0" y1="0" x2="0" y2="7" stroke="rgba(220,38,38,.55)" stroke-width="2"/></pattern>' +
      (F ? '<pattern id="' + id + 'f" width="' + (o.floor === 'cpt' ? 22 : 60) + '" height="' + (o.floor === 'cpt' ? 22 : 14) + '" patternUnits="userSpaceOnUse"><rect width="60" height="22" fill="' + F.fill + '"/>' + (o.floor === 'cpt' ? '<rect x=".5" y=".5" width="21" height="21" fill="none" stroke="rgba(0,0,0,.12)"/>' : '<line x1="0" y1="13.5" x2="60" y2="13.5" stroke="rgba(0,0,0,.14)"/><line x1="38" y1="0" x2="38" y2="14" stroke="rgba(0,0,0,.12)"/>') + '</pattern>' : '') + '</defs>';
    svg += '<polygon points="' + poly + '" fill="' + (F ? 'url(#' + id + 'f)' : '#fbf8f1') + '"/>';
    if (G.out) svg += '<rect x="' + X(G.out.x) + '" y="' + Y(G.out.y) + '" width="' + (G.out.w * s).toFixed(1) + '" height="' + (G.out.h * s).toFixed(1) + '" fill="url(#' + id + 'h)"/>' + (small || o.parts ? '' : txt(X(G.out.x + G.out.w / 2), Y(G.out.y + G.out.h * (G.out.ly || 0.3)), G.out.label, 'middle', 'pj-u3-room'));
    if (G.inside) svg += '<line x1="' + X(G.inside.x) + '" y1="' + Y(G.inside.y + G.inside.h) + '" x2="' + X(G.inside.x + G.inside.w) + '" y2="' + Y(G.inside.y + G.inside.h) + '" stroke="#94a3b8" stroke-width="' + (small ? 1 : 2) + '" stroke-dasharray="6 5"/>' + (small || o.parts ? '' : txt(X(G.inside.x + G.inside.w / 2), Y(G.inside.y + G.inside.h / 2) + 4, G.inside.label, 'middle', 'pj-u3-room'));
    // the parts of the floor (flooring checkpoint)
    var PCOL = ['rgba(37,99,235,.22)', 'rgba(22,163,74,.24)', 'rgba(234,88,12,.24)'], PST = ['#2563eb', '#16a34a', '#ea580c'];
    var parts = o.parts && G.parts ? G.parts[o.parts] : null;
    if (parts) parts.forEach(function (q, i) {
      var r = '<rect x="' + X(q.x) + '" y="' + Y(q.y) + '" width="' + (q.w * s).toFixed(1) + '" height="' + (q.h * s).toFixed(1) + '"';
      if (q.whole) svg += r + ' fill="rgba(37,99,235,.10)" stroke="#2563eb" stroke-width="2" stroke-dasharray="7 5"/>';
      else if (q.s < 0) svg += r + ' fill="url(#' + id + 'x)" stroke="#dc2626" stroke-width="2"/>';
      else svg += r + ' fill="' + PCOL[i % 3] + '" stroke="' + PST[i % 3] + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
    });
    // walls
    if (o.paint) svg += '<polygon points="' + poly + '" fill="none" stroke="#334155" stroke-width="' + (wall + 4) + '" stroke-linejoin="miter"/><polygon points="' + poly + '" fill="none" stroke="' + esc(o.paint) + '" stroke-width="' + (wall) + '" stroke-linejoin="miter"/>';
    else svg += '<polygon points="' + poly + '" fill="none" stroke="#334155" stroke-width="' + wall + '" stroke-linejoin="miter"/>';
    // doors, openings, the window
    function along(si, t, wIn) {
      var a = G.pts[si], b = G.pts[(si + 1) % G.pts.length], len = G.sides[si], ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
      var cx = a[0] + ux * len * t, cy = a[1] + uy * len * t;
      return { p1: [cx - ux * wIn / 2, cy - uy * wIn / 2], p2: [cx + ux * wIn / 2, cy + uy * wIn / 2], c: [cx, cy], u: [ux, uy], n: [-uy, ux] }; // n: into the room
    }
    function seg(A, B, st, sw, extra) { return '<line x1="' + X(A[0]) + '" y1="' + Y(A[1]) + '" x2="' + X(B[0]) + '" y2="' + Y(B[1]) + '" stroke="' + st + '" stroke-width="' + sw + '"' + (extra || '') + '/>'; }
    var labs = '';
    (G.doors || []).forEach(function (d) {
      var g = along(d.side, d.t, d.w);
      svg += seg(g.p1, g.p2, F ? '#fbf8f1' : '#fff', wall + 2);
      if (d.kind === 'open') svg += seg(g.p1, g.p2, '#94a3b8', small ? 1 : 1.6, ' stroke-dasharray="4 4"');
      else if (d.kind === 'slide') { var o1 = [g.n[0] * 2.5, g.n[1] * 2.5]; svg += seg([g.p1[0] + o1[0], g.p1[1] + o1[1]], [g.c[0] + g.u[0] * 4 + o1[0], g.c[1] + g.u[1] * 4 + o1[1]], '#64748b', small ? 1.2 : 2.2) + seg([g.c[0] - g.u[0] * 4 - o1[0], g.c[1] - g.u[1] * 4 - o1[1]], [g.p2[0] - o1[0], g.p2[1] - o1[1]], '#64748b', small ? 1.2 : 2.2); }
      else {
        var tip = [g.p1[0] + g.n[0] * d.w, g.p1[1] + g.n[1] * d.w], cr = g.n[0] * g.u[1] - g.n[1] * g.u[0];
        svg += seg(g.p1, tip, '#475569', small ? 1.2 : 2.2) + '<path d="M' + P(tip) + ' A' + (d.w * s).toFixed(1) + ' ' + (d.w * s).toFixed(1) + ' 0 0 ' + (cr > 0 ? 1 : 0) + ' ' + P(g.p2) + '" fill="none" stroke="#94a3b8" stroke-width="' + (small ? 0.8 : 1.4) + '" stroke-dasharray="3 3"/>';
      }
      if (!small && !o.hideLabels) {
        var side = Math.abs(g.n[0]) > 0.5, off = side ? 14 : d.kind ? 16 : 24, anchor = side ? (g.n[0] > 0 ? 'start' : 'end') : 'middle';
        var lx = X(g.c[0]) + g.n[0] * off, ly = Y(g.c[1]) + g.n[1] * off + (g.n[1] > 0.5 ? 9 : 2);
        var t = d.tape ? (o.tapeKnown ? 'door ' + tapeTxt(G.tape) : 'door: measure it!') : d.label;
        labs += txt(lx, ly, esc(t), anchor, d.tape && !o.tapeKnown ? 'pj-u3-lab pj-u3-ask' : 'pj-u3-lab pj-u3-dl');
      }
    });
    if (G.win) {
      var wIn = G.win.wIn || (G.winCm ? G.winCm[0] / 2.54 : 36), g2 = along(G.win.side, G.win.t, wIn);
      svg += seg(g2.p1, g2.p2, '#e0f2fe', wall) + seg(g2.p1, g2.p2, '#0284c7', small ? 0.8 : 1.4);
      if (!small && !o.hideLabels) {
        var wl = G.win.label || ('window ' + G.winCm[0] + ' × ' + G.winCm[1] + ' cm'), an = Math.abs(g2.n[0]) > 0.5 ? (g2.n[0] > 0 ? 'start' : 'end') : 'middle';
        labs += txt(X(g2.c[0]) + g2.n[0] * 14, Y(g2.c[1]) + g2.n[1] * 18 + 4, esc(wl), an, 'pj-u3-lab pj-u3-wl');
      }
    }
    // part letters
    if (parts) parts.forEach(function (q, i) {
      var cx = X(q.x + q.w / 2), cy = Y(q.y + q.h / 2), col = q.whole ? '#2563eb' : q.s < 0 ? '#dc2626' : PST[i % 3];
      if (q.whole) { cx = X(q.x + q.w * (q.lx || 0.3)); cy = Y(q.y + q.h * (q.ly || 0.62)); }
      else if (q.s < 0 && q.h * s < 90 && !small) cy = q.y === 0 ? Y(0) - 16 : Y(q.y + q.h * 0.3); // a small cut-out: keep its letter clear of the wall labels (above the plan if it's on the top edge)
      labs += '<g class="pj-u3-pl"><circle cx="' + cx + '" cy="' + cy + '" r="' + (small ? 7 : 13) + '" fill="#fff" stroke="' + col + '" stroke-width="2"/>' + '<text x="' + cx + '" y="' + (cy + (small ? 3 : 5)) + '" text-anchor="middle" fill="' + col + '" font-weight="800" font-size="' + (small ? 9 : 15) + '">' + (q.s < 0 ? '−' : '') + q.n + '</text></g>';
    });
    // wall lengths
    if (!small && !o.hideLabels) G.pts.forEach(function (a, i) {
      var b = G.pts[(i + 1) % G.pts.length], len = G.sides[i], t = (G.lt && G.lt[i] != null) ? G.lt[i] : 0.5;
      var fl = G.flip && G.flip[i] ? -1 : 1, dx = (b[0] - a[0]) / len, dy = (b[1] - a[1]) / len, nx = dy * fl, ny = -dx * fl; // outward (or into the room for a flipped label)
      var mx = X(a[0] + (b[0] - a[0]) * t), my = Y(a[1] + (b[1] - a[1]) * t), anchor = 'middle', lx = mx + nx * 13, ly = my + ny * 13;
      if (Math.abs(nx) > 0.5) { anchor = nx > 0 ? 'start' : 'end'; ly = my + 4.5; } else if (ny > 0) ly = my + 13 + 11; else ly = my - 11;
      labs += txt(lx, ly, esc(ftin(len)), anchor, 'pj-u3-lab pj-u3-wall');
    });
    return svg + labs + '</svg>';
  }
  /* a tape measure, zoomed in on one spot: v = where the marker is (inches); o.start = the first inch shown */
  function tapeSvg(v, o) {
    o = o || {}; var n = 4, start = o.start != null ? o.start : Math.floor(v) - 1, ppi = 150, x0 = 26, W = n * ppi + 2 * x0, H = 140, id = 'u3t' + (++UID);
    var s = '<svg class="pj-u3-tape" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.aria || 'A tape measure, zoomed in. Each small tick is one sixteenth of an inch.') + '">' +
      '<defs><linearGradient id="' + id + 'l"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="' + id + 'r"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>' +
      '<rect x="0" y="20" width="' + W + '" height="84" fill="#facc15"/><line x1="0" y1="20.5" x2="' + W + '" y2="20.5" stroke="#a16207"/><line x1="0" y1="103.5" x2="' + W + '" y2="103.5" stroke="#a16207"/>';
    for (var j = -6; j <= n * 16 + 6; j++) {
      var x = x0 + j * ppi / 16, len = j % 16 === 0 ? 44 : j % 8 === 0 ? 33 : j % 4 === 0 ? 25 : j % 2 === 0 ? 18 : 12, sw = j % 16 === 0 ? 2.6 : j % 8 === 0 ? 1.9 : 1.3;
      if (x < 0 || x > W) continue;
      s += '<line x1="' + x.toFixed(2) + '" y1="21" x2="' + x.toFixed(2) + '" y2="' + (21 + len) + '" stroke="#111" stroke-width="' + sw + '"/>';
    }
    for (var i = 0; i <= n; i++) {
      var inch = start + i, xx = x0 + i * ppi, stud = inch % 16 === 0;
      if (stud) s += '<rect x="' + (xx - 17) + '" y="70" width="34" height="24" rx="3" fill="#dc2626"/>';
      s += '<text x="' + xx + '" y="89" text-anchor="middle" font-size="21" font-weight="800" fill="' + (stud ? '#fff' : '#111') + '">' + inch + '</text>';
      if (inch % 12 === 0) s += '<text x="' + (xx + 22) + '" y="62" font-size="12" font-weight="800" fill="#dc2626">' + (inch / 12) + 'F</text>';
    }
    if (o.marker !== false) {
      var mx = x0 + (v - start) * ppi;
      s += '<rect x="' + mx.toFixed(2) + '" y="4" width="' + (W - mx).toFixed(2) + '" height="114" fill="rgba(71,85,105,.32)"/>' +
        '<line x1="' + mx.toFixed(2) + '" y1="4" x2="' + mx.toFixed(2) + '" y2="118" stroke="#dc2626" stroke-width="2.6"/>' +
        '<path d="M' + (mx - 7).toFixed(2) + ' 2 L' + (mx + 7).toFixed(2) + ' 2 L' + mx.toFixed(2) + ' 12 Z" fill="#dc2626"/>' +
        '<text x="' + (mx + 10).toFixed(2) + '" y="133" font-size="13" font-weight="700" fill="#334155">door frame →</text>';
    }
    s += '<rect x="0" y="0" width="34" height="' + H + '" fill="url(#' + id + 'l)"/><rect x="' + (W - 34) + '" y="0" width="34" height="' + H + '" fill="url(#' + id + 'r)"/>';
    return s + '</svg>';
  }
  /* the crew hooking the tape across the door opening (the zoom shows the far end) */
  function doorTapePic() {
    return '<svg class="pj-u3-dt" viewBox="0 0 640 74" aria-hidden="true"><rect x="10" y="6" width="22" height="62" fill="#94a3b8"/><rect x="606" y="6" width="22" height="62" fill="#94a3b8"/>' +
      '<rect x="32" y="30" width="574" height="13" fill="#facc15" stroke="#ca8a04"/><rect x="28" y="27" width="8" height="19" fill="#64748b"/>' +
      Array.apply(null, Array(36)).map(function (_, i) { return '<line x1="' + (40 + i * 16) + '" y1="30" x2="' + (40 + i * 16) + '" y2="' + (i % 2 ? 35 : 38) + '" stroke="#111"/>'; }).join('') +
      '<circle cx="606" cy="37" r="24" fill="none" stroke="#dc2626" stroke-width="2.5"/><text x="44" y="63" font-size="12" fill="#334155" font-weight="700">hook at 0</text><text x="440" y="63" font-size="12" fill="#dc2626" font-weight="700">zoom in here ↓</text>' +
      '<text x="320" y="20" font-size="13" text-anchor="middle" fill="#334155" font-weight="700">the door opening</text></svg>';
  }
  function tableSvg(kind, dIn, o) {
    o = o || {}; var r = 70, cx = 110, cy = 92;
    if (kind === 'moon') return '<svg class="pj-u3-feat" viewBox="0 0 220 130" aria-hidden="true"><path d="M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + ' Z" fill="#dbeafe" stroke="#7c4a1e" stroke-width="7" stroke-linejoin="round"/>' +
      [-60, -30, 0, 30, 60].map(function (a) { var t = (a - 90) * PI / 180; return '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(t) * r).toFixed(1) + '" y2="' + (cy + Math.sin(t) * r).toFixed(1) + '" stroke="#7c4a1e" stroke-width="2.5"/>'; }).join('') +
      '<line x1="' + (cx - r) + '" y1="' + (cy + 18) + '" x2="' + (cx + r) + '" y2="' + (cy + 18) + '" stroke="#334155" stroke-width="1.5" /><text x="' + cx + '" y="' + (cy + 33) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#334155">d = ' + esc(ftin(dIn)) + '</text></svg>';
    return '<svg class="pj-u3-feat" viewBox="0 0 220 186" aria-hidden="true"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#f3d9a8" stroke="#8a5a2b" stroke-width="7"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 16) + '" fill="none" stroke="rgba(138,90,43,.25)" stroke-width="2"/>' +
      '<line x1="' + (cx - r) + '" y1="' + cy + '" x2="' + (cx + r) + '" y2="' + cy + '" stroke="#334155" stroke-width="1.8" stroke-dasharray="5 4"/><text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#334155">d = ' + esc(ftin(dIn)) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + r + 22) + '" text-anchor="middle" font-size="12" fill="#8a5a2b" font-weight="700">edge banding all around</text></svg>';
  }

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function inU(c, k, unit, o) { o = o || {}; var w = c.input(k, { kind: 'num', ph: o.ph || '', aria: o.aria || k, cls: 'pj-u3-in' }); if (unit) w.appendChild(el('span', 'pj-post', unit)); return w; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function grid(box) { var g = el('div', 'pj-grid3 pj-u3-row'); box.appendChild(g); return g; }
  function eq(left, right, unit, fmt, delay) { return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="' + (fmt || 'num') + '"' + (delay ? ' data-delay="' + delay + '"' : '') + '>' + (fmt === 'money' ? money(right) : fx(right, 2)) + '</span>' + (unit ? ' ' + unit : '') + '</b></div>'; }
  function chip(h) { return '<div class="pj-x-chip">' + h + '</div>'; }
  function cards(c, k, ids, MAP, fn, o) { return c.choice(k, ids.map(function (id) { return { v: id, html: fn(MAP[id], id) }; }), Object.assign({ cls: 'pj-types pj-u3-cards' }, o || {})); }
  function crewName(c) { return String(c.get('crew') || 'My crew').trim() || 'My crew'; }
  /* the job sheet: the plan beside the facts */
  function jobCard(c, G, o) {
    o = o || {}; var J = job(c), w = el('div', 'pj-u3-job');
    w.appendChild(el('div', 'pj-u3-plan', planSvg(G, o)));
    var facts = '<div class="pj-u3-facts"><div class="pj-u3-fk">Job sheet · ' + esc(crewName(c)) + '</div><h4>' + G.R.icon + ' ' + esc(G.R.name) + '</h4><dl>' +
      '<dt>Client</dt><dd>' + esc(J.client) + '</dd><dt>Address</dt><dd>' + esc(J.address) + '</dd>' +
      '<dt>Ceiling height</dt><dd>' + esc(ftin(G.h)) + '</dd><dt>Doors</dt><dd>' + G.doors.length + ' (all 6 ft 8 in tall)</dd>' +
      '<dt>Window</dt><dd>' + G.winCm[0] + ' cm wide × ' + G.winCm[1] + ' cm tall</dd>' + (o.extra || '') + '</dl></div>';
    w.appendChild(el('div', '', facts));
    return w;
  }
  function wrongNaive(D) { var a = Math.floor(D / 12 + 1e-9), b = D - 12 * a; return a + b / 10; } // 14 ft 6 in → 14.6 (a common slip)
  function nInches(b) { return inStr(b) + ' in'; }

  /* ================= Checkpoint 1: take the job — read the plan and the tape ================= */
  var EX_TAPE = 27.625;
  var cp1 = {
    id: 'job', title: 'Take the job: read the plan and the tape', needs: ['u3l1', 'u3l3', 'u3l4', 'u3l5'],
    goal: 'Name your crew and pick a room. Then read the tape to the nearest <b>1/16 in</b>, change feet and inches to <b>inches</b> and <b>decimal feet</b>, and change the metric window to feet.',
    example: { title: 'Chinook Carpentry measures a sunroom', scene: '<div class="pj-u3-exwrap">' + tapeSvg(EX_TAPE, { start: 26, aria: 'A tape measure: the door frame starts between 27 and 28 inches' }) + '</div>', steps: [
      { cap: 'Priya’s crew, <b>Chinook Carpentry</b>, hooks the tape on one side of a door and reads it at the other side. First the <b>whole inches</b>: the last number before the frame is <b>27</b>.', html: chip('Whole inches: <b>27</b>') },
      { cap: 'Now count the <b>little ticks</b> after 27. Each one is <b>1/16 in</b>. There are 10 of them: 10/16 in.', html: chip('10 ticks → ' + frH(10, 16) + ' in') },
      { cap: 'Simplify: 10/16 = 5/8 (divide the top and bottom by 2). The door is <b>27 5/8 in</b> wide.', html: chip('<b>27 ' + frH(5, 8) + ' in</b>') },
      { cap: 'A wall on the plan says <b>9 ft 4½ in</b>. To change it to inches: <b>feet × 12</b>, then add the inches.', html: eq('9 × 12 + 4.5', 112.5, 'in') },
      { cap: 'To change it to <b>decimal feet</b>, change just the inches: 4.5 ÷ 12 = 0.375. So 9 ft 4½ in = <b>9.375 ft</b>. (It is <b>not</b> 9.45 — inches aren’t tenths of a foot!)', html: eq('9 + 4.5 ÷ 12', 9.375, 'ft') },
      { cap: 'The window maker uses <b>cm</b>. There are 30.48 cm in 1 ft, so <b>divide</b> by 30.48.', html: eq('90 cm ÷ 30.48', 2.95, 'ft') }] },
    render: function (box, c) {
      part(box, 'A', 'Name your crew', 'Every reno company needs a name (and a colour for its trucks).');
      var row = el('div', 'pj-order pj-u3-crewrow');
      row.appendChild(field('Crew name', c.text('crew', { ph: 'e.g. ' + CREW_IDEAS[0], max: 28, aria: 'Crew name' })));
      row.appendChild(field('Crew colour', c.choice('crewColor', COLORS.map(function (x) { return { v: x[0], html: '<i style="background:' + x[0] + '"></i>' + x[1], title: x[1] }; }), { cls: 'pj-swatches', aria: 'Crew colour' })));
      box.appendChild(row);
      var ideas = el('div', 'pj-ideas', '<span>Need an idea?</span>'); CREW_IDEAS.forEach(function (n) { var b = el('button', 'pj-idea', esc(n)); b.type = 'button'; if (c.ro) b.disabled = true; b.addEventListener('click', function () { c.set('crew', n); c.redraw(); }); ideas.appendChild(b); }); box.appendChild(ideas);
      part(box, 'B', 'Choose your job', 'Pick a room. Every crew gets its own sizes, so your numbers won’t match a friend’s.');
      box.appendChild(c.choice('room', ROOM_IDS.map(function (id) { var g = geo(c, id); return { v: id, html: '<span class="pj-u3-thumb">' + planSvg(g, { small: true }) + '</span><b>' + g.R.icon + ' ' + esc(g.R.name) + '</b><small>' + esc(g.R.blurb) + '</small>' }; }), { cls: 'pj-types pj-u3-rooms', aria: 'Room to renovate', onPick: function () { c.redraw(); } }));
      var G = geo(c); if (!G) return;
      box.appendChild(jobCard(c, G));
      part(box, 'C', 'Measure the door', 'Your crew hooks the tape on one side of the door opening. Read it where the door frame starts, to the nearest 1/16 in.');
      var tp = el('div', 'pj-u3-tapebox');
      tp.appendChild(el('div', '', doorTapePic()));
      tp.appendChild(el('div', 'pj-u3-zoom', tapeSvg(G.tape.v, { start: G.tape.w - 1 - hv(c, 'ts') % 2 })));
      var rd = el('div', 'pj-u3-read'); rd.appendChild(el('span', 'pj-fl', 'The door is'));
      var mx = el('div', 'pj-u3-mixed');
      mx.appendChild(inU(c, 'tape.w', '', { aria: 'Door width: whole inches' }));
      var fr = el('div', 'pj-u3-frac'); fr.appendChild(inU(c, 'tape.n', '', { aria: 'Door width: fraction top' })); fr.appendChild(el('i', 'pj-u3-bar')); fr.appendChild(inU(c, 'tape.d', '', { aria: 'Door width: fraction bottom' }));
      mx.appendChild(fr); mx.appendChild(el('span', 'pj-u3-unit', 'in wide')); rd.appendChild(mx);
      rd.appendChild(el('span', 'pj-u3-tip', 'Whole inches in the big box, the fraction in the small ones. Simplify the fraction.'));
      tp.appendChild(rd); box.appendChild(tp);
      part(box, 'D', 'Feet and inches → inches → decimal feet', 'Inches = feet × 12 + inches. Decimal feet = feet + inches ÷ 12. Keep 3 decimal places for feet.');
      var tb = el('div', 'pj-u3-cv');
      tb.appendChild(el('div', 'pj-u3-cv-h', '<span>On the plan</span><span>In inches</span><span>In feet (decimal)</span>'));
      [['L', 'Length', G.L], ['W', 'Width', G.W]].forEach(function (x) {
        var r = el('div', 'pj-u3-cv-r'); r.appendChild(el('div', 'pj-u3-cv-l', '<small>' + x[1] + '</small><b>' + esc(ftin(x[2])) + '</b>'));
        r.appendChild(inU(c, 'cv.' + x[0] + 'in', 'in', { aria: x[1] + ' in inches' })); r.appendChild(inU(c, 'cv.' + x[0] + 'ft', 'ft', { aria: x[1] + ' in feet' }));
        tb.appendChild(r);
      });
      box.appendChild(tb);
      part(box, 'E', 'The window is metric', 'The window is ' + G.winCm[0] + ' cm wide and ' + G.winCm[1] + ' cm tall. 1 ft = 30.48 cm. Round to 2 decimal places.');
      var g = grid(box);
      g.appendChild(field('Window width (ft)', inU(c, 'win.w', 'ft', { aria: 'Window width in feet' })));
      g.appendChild(field('Window height (ft)', inU(c, 'win.h', 'ft', { aria: 'Window height in feet' })));
    },
    check: function (c) {
      var G = geo(c), out = [c.msg(!!G, 'Choose a room to renovate (Part B).')]; if (!G) return out;
      out.push(c.need('crew', { min: 2, label: 'Crew name', hint: 'Give your crew a name.' }));
      out.push(c.msg(!!c.get('crewColor'), 'Pick a colour for your crew (Part A).'));
      var T = G.tape;
      out.push(numR(c, 'tape.w', T.w, { tol: 0, label: 'Door, whole inches', wrong: [{ v: T.w + 1, tol: 0, hint: 'The frame starts <b>before</b> ' + (T.w + 1) + '. Use the inch number just to the <b>left</b> of the red line.' }, { v: T.v, tol: 0.01, hint: 'Put just the <b>whole</b> inches in the big box, and the fraction in the small boxes.' }],
        hint: 'Whole inches: the last inch number before the red line.' }));
      out.push(fracRes(c, T));
      [['L', 'Length', G.L], ['W', 'Width', G.W]].forEach(function (x) {
        var D = x[2], a = Math.floor(D / 12 + 1e-9), b = D - 12 * a;
        out.push(numR(c, 'cv.' + x[0] + 'in', D, { tol: 0.01, label: x[1] + ' in inches', wrong: [{ v: a * 12, hint: 'Don’t forget the extra ' + nInches(b) + ': add them on.' }, { v: a + b, hint: 'Multiply the feet by <b>12</b> first (1 ft = 12 in), then add the inches.' }, { v: a * 10 + b, hint: 'There are <b>12</b> inches in a foot, not 10.' }],
          hint: 'Inches = feet × 12 + inches.', hint2: 'Try ' + a + ' × 12 + ' + fx(b, 1) + '.' }));
        out.push(numR(c, 'cv.' + x[0] + 'ft', D / 12, { tol: 0.006, unit: 'ft', label: x[1] + ' in feet', wrong: [{ v: wrongNaive(D), tol: 0.004, hint: 'Inches aren’t tenths of a foot. Change the inches to feet: ' + fx(b, 1) + ' ÷ 12.' }, { v: a + b / 100, tol: 0.004, hint: 'Inches aren’t hundredths of a foot. Change the inches to feet: ' + fx(b, 1) + ' ÷ 12.' }, { v: D * 12, tol: 1, hint: 'To go from inches to feet, <b>divide</b> by 12.' }],
          hint: 'Feet = inches ÷ 12. Keep 3 decimal places.', hint2: 'Try ' + fx(D, 1) + ' ÷ 12, or ' + a + ' + ' + fx(b, 1) + ' ÷ 12.' }));
      });
      [['w', 'width', G.winCm[0]], ['h', 'height', G.winCm[1]]].forEach(function (x) {
        var cm = x[2];
        out.push(numR(c, 'win.' + x[0], cm / CMFT, { tol: 0.011, unit: 'ft', label: 'Window ' + x[1], wrong: [{ v: cm / 2.54, tol: 0.06, hint: 'That’s inches (÷ 2.54). Divide by 12 to get feet — or divide the cm by 30.48 in one step.' }, { v: cm * CMFT, tol: 1, hint: 'Going from cm to feet, <b>divide</b> by 30.48 (there are 30.48 cm in 1 ft).' }, { v: cm / 100, tol: 0.006, hint: 'That’s metres. 1 ft = 30.48 cm, so divide the cm by 30.48.' }, { v: cm / 12, tol: 0.02, hint: 'Centimetres aren’t inches. Divide by 30.48 to go from cm to feet.' }],
          hint: 'Feet = cm ÷ 30.48.', hint2: 'Try ' + cm + ' ÷ 30.48, then round to 2 decimal places.' }));
      });
      return out;
    },
    solve: function (c) {
      if (!c.get('room')) c.set('room', 'rec'); if (!c.get('crew')) c.set('crew', CREW_IDEAS[0]); if (!c.get('crewColor')) c.set('crewColor', COLORS[0][0]);
      var G = geo(c), T = G.tape, g = gcd(T.k, 16);
      c.set('tape.w', String(T.w)); c.set('tape.n', String(T.k / g)); c.set('tape.d', String(16 / g));
      c.set('cv.Lin', fx(G.L, 1)); c.set('cv.Lft', fx(G.L / 12, 3)); c.set('cv.Win', fx(G.W, 1)); c.set('cv.Wft', fx(G.W / 12, 3));
      c.set('win.w', (G.winCm[0] / CMFT).toFixed(2)); c.set('win.h', (G.winCm[1] / CMFT).toFixed(2));
    }
  };
  /* the fraction part of the tape reading (two boxes: top and bottom) */
  function fracRes(c, T) {
    var lab = { label: 'Door, fraction' }, hn = c.has('tape.n'), hd = c.has('tape.d');
    if (!hn || !hd) return [R0('tape.n', false, Object.assign({ blank: !hn }, lab, !hn ? {} : { hint: 'Fill in the bottom of the fraction too.', form: true })), R0('tape.d', false, Object.assign({ blank: !hd, graded: false }, lab, !hd ? {} : { hint: 'Fill in the top of the fraction too.', form: true }))];
    var n = pm(c.get('tape.n')), d = pm(c.get('tape.d')), g = gcd(T.k, 16), sn = T.k / g, sd = 16 / g;
    var both = function (ok, x) { return [R0('tape.n', ok, Object.assign({}, lab, x)), R0('tape.d', ok, Object.assign({ graded: false }, lab, x))]; };
    if (isNaN(n) || isNaN(d) || !d || n % 1 || d % 1) return both(false, { form: true, hint: 'Type whole numbers in the fraction boxes, like 7 over 16.' });
    var val = n / d, hint2 = 'There are ' + T.k + ' little ticks after ' + T.w + '. That’s ' + T.k + '/16 in — simplify it.';
    if (Math.abs(val - T.k / 16) < 1e-9) {
      if (n !== sn || d !== sd) return both(false, { form: true, hint: 'Right length! Write it in lowest terms: ' + n + '/' + d + ' = <b>' + sn + '/' + sd + '</b>.' });
      return both(true, {});
    }
    var h = 'Count the little ticks after the last inch number. Each one is 1/16 in. Then simplify.';
    if (n >= d) h = 'The fraction should be less than 1 — the whole inches go in the big box.';
    else if (Math.abs(val - (16 - T.k) / 16) < 1e-9) h = 'You counted back from the inch on the <b>right</b>. Count the ticks after the inch number on the <b>left</b> of the red line.';
    else if (d === 8 && n === T.k) h = 'Each little tick is <b>1/16</b> in, not 1/8 in.';
    else if (Math.abs(val * 16 - T.k) <= 1.0001) h = 'So close! Count the little ticks again — each one is 1/16 in.';
    return both(false, { hint: h, hint2: hint2 });
  }

  /* ================= Checkpoint 2: baseboard trim ================= */
  function exSun() { return mkGeo({ pts: [[0, 0], [126, 0], [126, 108], [0, 108]], doors: [{ side: 2, t: 0.5, w: 32, kind: '', label: '32 in door' }], win: { side: 0, t: 0.5, wIn: 48, label: 'window 4 ft × 3 ft' }, R: { name: 'sunroom' }, tape: { w: 32, k: 0, v: 32 } }); }
  function e2(c) {
    var G = geo(c); if (!G) return { G: null };
    var T = TRIMS[c.get('trimStyle')], len = Number(c.get('trimLen')) || 0, P = sum(G.sides) / 12, D = G.doorsIn / 12;
    var P1 = mine(c, 'perim', P), D1 = mine(c, 'doorFt', D), need = P1 - D1, need1 = mine(c, 'trimNeed', need);
    var boards = len ? Math.ceil(need1 / len - 1e-9) : 0, b1 = mine(c, 'boards', boards), price = T && len ? T['p' + len] : 0;
    return { G: G, T: T, len: len, P: P, D: D, need: need, need1: need1, boardsRaw: len ? need1 / len : 0, boards: boards, b1: b1, price: price, cost: b1 * price };
  }
  var cp2 = {
    id: 'trim', title: 'Baseboard trim', needs: ['u3l4', 'u3l6'],
    goal: 'Find the room’s <b>perimeter</b>, take away the door openings, and work out how many boards of baseboard to buy (whole boards!) and what they cost.',
    example: { title: 'Baseboard for a sunroom', scene: '<div class="pj-u3-exwrap pj-u3-explan">' + (function () { return planSvg(exSun(), { maxW: 300, maxH: 200 }); })() + '</div>', steps: [
      { cap: 'Chinook Carpentry is trimming a sunroom: <b>10 ft 6 in</b> by <b>9 ft</b>. In decimal feet that’s 10.5 ft by 9 ft. The <b>perimeter</b> is the distance all the way around.', html: eq('10.5 + 9 + 10.5 + 9', 39, 'ft') },
      { cap: 'No baseboard goes across the door. The door is 32 in: 32 ÷ 12 = 2.67 ft. Take it away.', html: eq('39 − 2.67', 36.33, 'ft') },
      { cap: 'Baseboard comes in <b>8 ft</b> boards. How many boards? Divide.', html: eq('36.33 ÷ 8', 4.54, 'boards') },
      { cap: 'You can’t buy 4.54 boards. <b>Round up</b>: 4 boards would be too short, so they buy <b>5</b>.', html: chip('4.54 → <b>5 boards</b>') },
      { cap: 'Each board is $12.98. Cost = boards × price.', html: eq('5 × $12.98', 64.9, '', 'money') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'Pick your baseboard', 'Choose a style and the length of the boards you’ll buy.');
      box.appendChild(cards(c, 'trimStyle', TRIM_IDS, TRIMS, function (T) { return '<b>' + esc(T.name) + '</b><small>' + esc(T.look) + '</small><span class="pj-u3-price">8 ft: ' + money(T.p8) + ' · 12 ft: ' + money(T.p12) + '</span>'; }, { aria: 'Baseboard style', onPick: function () { c.redraw(); } }));
      box.appendChild(field('Board length', c.choice('trimLen', [{ v: '8', html: '8 ft boards' }, { v: '12', html: '12 ft boards' }], { cls: 'pj-seg', aria: 'Board length', onPick: function () { c.redraw(); } })));
      part(box, 'B', 'Measure around the room', 'Baseboard runs along <b>every</b> wall — but not across a door or an opening. Use decimal feet (3 places).');
      box.appendChild(jobCard(c, G, { tapeKnown: true }));
      var g = grid(box);
      g.appendChild(field('Perimeter of the room (ft)', inU(c, 'perim', 'ft', { aria: 'Perimeter in feet' })));
      g.appendChild(field('Door openings (ft)', inU(c, 'doorFt', 'ft', { aria: 'Door openings in feet' })));
      g.appendChild(field('Baseboard needed (ft)', inU(c, 'trimNeed', 'ft', { aria: 'Baseboard needed in feet' })));
      part(box, 'C', 'Buy whole boards', '');
      var e = e2(c), g2 = grid(box);
      g2.appendChild(field('Number of ' + (e.len ? e.len + ' ft ' : '') + 'boards', inU(c, 'boards', 'boards', { aria: 'Number of boards' })));
      g2.appendChild(field('Cost of the baseboard', c.input('trimCost', { aria: 'Cost of the baseboard' })));
      if (e.T && e.len) box.appendChild(el('p', 'pj-tip', esc(e.T.name) + ' · ' + e.len + ' ft boards cost <b>' + money(e.price) + '</b> each.'));
    },
    check: function (c) {
      var e = e2(c), G = e.G; if (!G) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [c.msg(!!e.T, 'Pick a baseboard style (Part A).'), c.msg(!!e.len, 'Pick a board length (Part A).')];
      var n = G.sides.length, isRect = G.id === 'rec', naive = sum(G.sides.map(wrongNaive));
      var pw = [{ v: sum(G.sides), tol: 0.4, hint: 'That’s in inches. Divide by 12 to get feet.' }, { v: naive, tol: 0.05, hint: 'Inches aren’t tenths of a foot (6 in = 0.5 ft, not 0.6). Change each wall to decimal feet first.' }, { v: G.L * G.W / 144, tol: 1, hint: 'That’s the area. The perimeter is the distance <b>around</b>: add up the walls.' }];
      if (!isRect) pw.push({ v: 2 * (G.L + G.W) / 12, tol: 0.03, hint: 'This room isn’t a plain rectangle. Add <b>every</b> wall on the plan — there are ' + n + ' of them.' });
      G.sides.forEach(function (s) { pw.push({ v: e.P - s / 12, tol: 0.03, hint: 'Did you add every wall? Count them on the plan: there are ' + n + '.' }); });
      out.push(numR(c, 'perim', e.P, { tol: 0.03, unit: 'ft', label: 'Perimeter', wrong: pw, hint: 'Perimeter = all the walls added up, in decimal feet.', hint2: 'The walls are ' + G.sides.map(function (s) { return fx(s / 12, 3); }).join(' + ') + ' ft.' }));
      var dw = [{ v: G.doorsIn, tol: 0.1, hint: 'That’s in inches. Divide by 12 to get feet.' }];
      if (G.doors.length > 1) G.doors.forEach(function (d) { dw.push({ v: d.w / 12, tol: 0.011, hint: 'Add up <b>all</b> the openings: this room has ' + G.doors.length + '.' }); });
      out.push(numR(c, 'doorFt', e.D, { tol: 0.011, unit: 'ft', label: 'Door openings', wrong: dw, hint: 'Add the widths of the door openings, then ÷ 12 for feet.', hint2: G.doors.map(function (d) { return d.tape ? tapeTxt(G.tape) : fx(d.w, 1) + ' in'; }).join(' + ') + ', then ÷ 12.' }));
      var P1 = mine(c, 'perim', e.P), D1 = mine(c, 'doorFt', e.D);
      out.push(numR(c, 'trimNeed', e.need, { tol: 0.011, unit: 'ft', label: 'Baseboard needed', wrong: [{ v: P1 + D1, hint: '<b>Subtract</b> the doors — no baseboard goes across a doorway.' }], hint: 'Baseboard needed = perimeter − door openings.', hint2: 'Try ' + fx(P1, 3) + ' − ' + fx(D1, 3) + '.' }));
      if (!e.len || !e.T) return out;
      var other = e.len === 8 ? 12 : 8;
      out.push(countR(c, 'boards', e.boardsRaw, { noun: 'board', label: 'Number of boards', wrong: [{ v: Math.ceil(e.need1 / other - 1e-9), tol: 0, hint: 'You picked <b>' + e.len + ' ft</b> boards: divide by ' + e.len + '.' }], hint: 'Boards = baseboard needed ÷ ' + e.len + ' ft, rounded <b>up</b>.', hint2: 'Try ' + fx(e.need1, 2) + ' ÷ ' + e.len + ', then round up.' }));
      out.push(c.money('trimCost', e.cost, { label: 'Baseboard cost', wrong: [{ v: e.b1 * e.T['p' + other], hint: 'Use the price for the <b>' + e.len + ' ft</b> board: ' + money(e.price) + '.' }, { v: e.need1 * e.price, tol: 0.5, hint: 'Multiply the number of <b>boards</b> by the price of one board.' }], hint: 'Cost = number of boards × price per board.', hint2: 'Try ' + fx(e.b1, 0) + ' × ' + money(e.price) + '.' }));
      return out;
    },
    solve: function (c) {
      if (!c.get('trimStyle')) c.set('trimStyle', 'mdf'); if (!c.get('trimLen')) c.set('trimLen', '8');
      c.set('perim', fx(e2(c).P, 3)); c.set('doorFt', e2(c).D.toFixed(2)); c.set('trimNeed', e2(c).need.toFixed(2)); c.set('boards', String(e2(c).boards)); c.set('trimCost', e2(c).cost.toFixed(2));
    }
  };

  /* ================= Checkpoint 3: smudged plans (rearranging formulas) ================= */
  var ST_P = [[12, 8.5], [10.5, 8], [9, 7.5], [11, 9.5], [13.5, 6]], LA_P = [[9.5, 7], [8, 6.5], [10, 5.5], [7.5, 6], [11, 4.5]], RUG_D = [5, 6, 7, 8];
  function e3(c) {
    var s = ST_P[hv(c, 's3') % ST_P.length], l = LA_P[hv(c, 'l3') % LA_P.length], d = RUG_D[hv(c, 'r3') % RUG_D.length];
    var C = Math.round(PI * d * 100) / 100;
    return { sl: s[0], sw: s[1], A: s[0] * s[1], ll: l[0], lw: l[1], P: 2 * (l[0] + l[1]), d: d, C: C, dExp: C / PI };
  }
  var F1 = [['a', 'w = A × l'], ['b', 'w = A ÷ l'], ['c', 'w = l ÷ A'], ['d', 'w = A − l']];
  var F2 = [['a', 'w = P − 2l'], ['b', 'w = P ÷ 2l'], ['c', 'w = (P − l) ÷ 2'], ['d', 'w = (P − 2l) ÷ 2']];
  var F3 = [['a', 'd = C × π'], ['b', 'd = C ÷ π'], ['c', 'd = π ÷ C'], ['d', 'd = C − π']];
  function smudge(kind, e) {
    if (kind === 'rug') return '<svg class="pj-u3-sm" viewBox="0 0 170 120" aria-hidden="true"><circle cx="85" cy="58" r="46" fill="#fde7c7" stroke="#b45309" stroke-width="4"/><circle cx="85" cy="58" r="32" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 5"/><line x1="39" y1="58" x2="131" y2="58" stroke="#334155" stroke-width="1.6" stroke-dasharray="4 3"/><ellipse cx="85" cy="50" rx="18" ry="10" fill="#94a3b8" opacity=".75"/><text x="85" y="55" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">d = ?</text><text x="85" y="117" text-anchor="middle" font-size="12.5" font-weight="700" fill="#334155">C = ' + fx(e.C, 2) + ' ft</text></svg>';
    var w = 120, h = 74, x = 25, y = 18;
    return '<svg class="pj-u3-sm" viewBox="0 0 170 120" aria-hidden="true"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#f8fafc" stroke="#334155" stroke-width="4"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h + 18) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#334155">l = ' + fx(kind === 'st' ? e.sl : e.ll, 1) + ' ft</text>' +
      '<ellipse cx="' + (x + w + 13) + '" cy="' + (y + h / 2) + '" rx="14" ry="20" fill="#94a3b8" opacity=".8"/><text x="' + (x + w + 13) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">?</text>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="13.5" font-weight="800" fill="#2563eb">' + (kind === 'st' ? 'A = ' + fx(e.A, 2) + ' ft²' : 'P = ' + fx(e.P, 1) + ' ft') + '</text></svg>';
  }
  var cp3 = {
    id: 'smudge', title: 'Smudged plans: find the missing side', needs: ['u3l7'],
    goal: 'The client wants prices for two more rooms and a round rug next year, but the old plans are smudged. <b>Rearrange each formula</b> to find what’s missing.',
    example: { title: 'Undoing a formula', steps: [
      { cap: 'Priya’s client has a closet with area <b>A = 120 ft²</b> and one side <b>l = 12 ft</b>. The formula is A = l × w. To get w alone, <b>undo the × l</b> by dividing both sides by l.', html: chip('A = l × w &nbsp;→&nbsp; <b>w = A ÷ l</b>') },
      { cap: 'Now put in the numbers.', html: eq('120 ÷ 12', 10, 'ft') },
      { cap: 'A hall has perimeter <b>P = 36 ft</b> and length <b>l = 10 ft</b>. P = 2l + 2w. Undo in reverse order: first <b>subtract 2l</b>, then <b>divide by 2</b>.', html: chip('P = 2l + 2w &nbsp;→&nbsp; P − 2l = 2w &nbsp;→&nbsp; <b>w = (P − 2l) ÷ 2</b>') },
      { cap: 'Put in the numbers: (36 − 20) ÷ 2.', html: eq('(36 − 2 × 10) ÷ 2', 8, 'ft') },
      { cap: 'Check it: 2(10) + 2(8) = 36 ✓. A circle: C = π × d, so <b>d = C ÷ π</b>.', html: chip('C = π d &nbsp;→&nbsp; <b>d = C ÷ π</b>') }] },
    render: function (box, c) {
      if (!geo(c)) return needFirst(box, 'Finish Checkpoint 1 first.');
      var e = e3(c), J = job(c);
      box.appendChild(el('p', 'pj-tip', esc(J.client.replace(/^the /, 'The ')) + ' found their old plans — but coffee got spilled on them! Pick the formula that gives the missing measurement, then use it. Round to 2 decimal places.'));
      [['st', 'A storage room', 'The area and one side are known. A = l × w.', 'f1', 'w1', F1, 'Width w (ft)'], ['la', 'A laundry room', 'The perimeter and one side are known. P = 2l + 2w.', 'f2', 'w2', F2, 'Width w (ft)'], ['rug', 'A round rug', 'The distance around (circumference) is known. C = π × d.', 'f3', 'd3', F3, 'Diameter d (ft)']].forEach(function (t, i) {
        var card = el('div', 'pj-prod pj-u3-smc');
        card.appendChild(el('div', 'pj-u3-smpic', smudge(t[0], e)));
        var main = el('div', 'pj-u3-smm');
        main.appendChild(el('div', 'pj-sale-k', (i + 1) + '. ' + t[1]));
        main.appendChild(el('p', 'pj-u3-smt', t[2]));
        main.appendChild(field('Which formula finds it?', c.choice(t[3], t[5].map(function (f) { return { v: f[0], html: f[1] }; }), { cls: 'pj-seg pj-u3-forms', aria: 'Formula for ' + t[1] })));
        main.appendChild(field(t[6], inU(c, t[4], 'ft', { aria: t[6] + ', ' + t[1] })));
        card.appendChild(main); box.appendChild(card);
      });
    },
    check: function (c) {
      if (!geo(c)) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var e = e3(c), out = [];
      out.push(c.equals('f1', 'b', { label: 'Storage room formula', wrong: { a: 'A = l × w: to get w alone, <b>undo</b> the “× l”. The opposite of × is ÷.', c: 'Careful with the order: w = <b>A</b> ÷ l (area divided by the side).', d: 'Area is <b>l × w</b>, not l + w — so undo it with ÷, not −.' } }));
      out.push(numR(c, 'w1', e.sw, { tol: 0.011, label: 'Storage room width', wrong: [{ v: e.A * e.sl, tol: 0.5, hint: 'You multiplied. Divide the area by the side: A ÷ l.' }, { v: e.sl / e.A, tol: 0.01, hint: 'Flip it: w = A ÷ l (the area goes first).' }, { v: e.A - e.sl, hint: 'Undo × with ÷: w = A ÷ l.' }], hint: 'w = A ÷ l.', hint2: 'Try ' + fx(e.A, 2) + ' ÷ ' + fx(e.sl, 1) + '.' }));
      out.push(c.equals('f2', 'd', { label: 'Laundry room formula', wrong: { a: 'Close! After you subtract 2l you still have <b>2w</b>. Divide by 2 too.', b: 'Undo the + 2l <b>first</b> (subtract), then divide by 2.', c: 'There are <b>two</b> lengths in the perimeter, so subtract 2l, not l.' } }));
      out.push(numR(c, 'w2', e.lw, { tol: 0.011, label: 'Laundry room width', wrong: [{ v: e.P - 2 * e.ll, hint: 'That’s 2w (both widths). Divide by 2.' }, { v: (e.P - e.ll) / 2, hint: 'Subtract <b>both</b> lengths (2l) before dividing by 2.' }, { v: e.P / 2, hint: 'P ÷ 2 is one length + one width. Take away the length too.' }], hint: 'w = (P − 2l) ÷ 2.', hint2: 'Try (' + fx(e.P, 1) + ' − 2 × ' + fx(e.ll, 1) + ') ÷ 2.' }));
      out.push(c.equals('f3', 'b', { label: 'Rug formula', wrong: { a: 'C = π × d: to get d alone, undo the × π by <b>dividing</b> by π.', c: 'Careful with the order: d = <b>C</b> ÷ π.', d: 'π is <b>multiplied</b> by d, so undo it with ÷, not −.' } }));
      out.push(numR(c, 'd3', e.dExp, { tol: 0.011, label: 'Rug diameter', wrong: [{ v: e.C * PI, tol: 0.1, hint: 'You multiplied by π. Divide instead: d = C ÷ π.' }, { v: e.C / PI / 2, tol: 0.011, hint: 'That’s the radius. The diameter is C ÷ π.' }, { v: e.C - PI, tol: 0.011, hint: 'Undo × π with ÷ π.' }], hint: 'd = C ÷ π.', hint2: 'Try ' + fx(e.C, 2) + ' ÷ π.' }));
      return out;
    },
    solve: function (c) { var e = e3(c); c.set('f1', 'b'); c.set('w1', fx(e.sw, 2)); c.set('f2', 'd'); c.set('w2', fx(e.lw, 2)); c.set('f3', 'b'); c.set('d3', e.dExp.toFixed(2)); }
  };

  /* ================= Checkpoint 4: flooring ================= */
  function exMud() { var L = 144, W = 120, a = 48, b = 36; return mkGeo({ pts: [[0, 0], [L - a, 0], [L - a, b], [L, b], [L, W], [0, W]], L: L, W: W, R: { name: 'mudroom' }, parts: { split: [{ n: 'A', x: 0, y: b, w: L, h: W - b, s: 1 }, { n: 'B', x: 0, y: 0, w: L - a, h: b, s: 1 }], cut: [{ n: 'A', x: 0, y: 0, w: L, h: W, s: 1, whole: 1 }, { n: 'B', x: L - a, y: 0, w: a, h: b, s: -1 }] }, out: { x: L - a, y: 0, w: a, h: b, label: '' }, doors: [] }); }
  function floorExact(G) { return sum(G.parts.cut.map(function (q) { return q.s * q.w * q.h / 144; })); }
  function parts4(c, G) { var m = c.get('method'); return m && G.parts[m] ? G.parts[m] : null; }
  function e4(c) {
    var G = geo(c); if (!G) return { G: null, ps: [] };
    var F = FLOORS[c.get('floor')], ps = parts4(c, G) || [];
    var exact = sum(ps.map(function (q) { return q.s * q.w * q.h / 144; })), mineA = sum(ps.map(function (q, i) { return q.s * Math.abs(mine(c, 'part.' + (i + 1), q.w * q.h / 144)); }));
    var area1 = mine(c, 'area', mineA), buy = area1 * 1.1, buy1 = mine(c, 'buy', buy), boxesRaw = F ? buy1 / F.cov : 0, boxes1 = mine(c, 'boxes', Math.ceil(boxesRaw - 1e-9));
    var m2 = buy1 / M2FT, m21 = mine(c, 'm2', m2), rollsRaw = m21 / UNDERLAY.m2, rolls1 = mine(c, 'rolls', Math.ceil(rollsRaw - 1e-9));
    return { G: G, F: F, ps: ps, exact: exact, mineA: mineA, area1: area1, buy: buy, buy1: buy1, boxesRaw: boxesRaw, boxes1: boxes1, cost: F ? boxes1 * F.price : 0, m2: m2, rollsRaw: rollsRaw, rolls1: rolls1, ulCost: rolls1 * UNDERLAY.price };
  }
  var cp4 = {
    id: 'floor', title: 'New flooring', needs: ['u3l5', 'u3l8', 'u3l9'],
    goal: 'Find the <b>floor area</b> (split it into rectangles, or take a cut-out away from a big one), add <b>10% for waste</b>, buy whole boxes, and work out the <b>metric</b> underlay.',
    example: { title: 'Flooring an L-shaped mudroom', scene: '<div class="pj-u3-exwrap pj-u3-explan pj-u3-ex2">' + (function () { var g = exMud(); return planSvg(g, { maxW: 220, maxH: 170, parts: 'cut', aria: 'Mudroom: whole minus cut-out' }) + planSvg(g, { maxW: 220, maxH: 170, parts: 'split', aria: 'Mudroom split into two rectangles' }); })() + '</div>', steps: [
      { cap: 'The mudroom is an L: 12 ft by 10 ft with a 4 ft by 3 ft corner missing. <b>Way 1: whole − cut-out.</b> The big rectangle A, take away the corner B.', html: eq('12 × 10 − 4 × 3', 108, 'ft²') },
      { cap: '<b>Way 2: split it.</b> Rectangle A is 12 ft by 7 ft (10 − 3 = 7). Rectangle B is 8 ft by 3 ft (12 − 4 = 8). Add them. Same answer!', html: eq('12 × 7 + 8 × 3', 108, 'ft²') },
      { cap: 'Some flooring gets cut off at the walls, so crews buy <b>10% extra</b>. Multiply by 1.10.', html: eq('108 × 1.10', 118.8, 'ft²') },
      { cap: 'One box covers 20 ft². 118.8 ÷ 20 = 5.94 → round <b>up</b> to <b>6 boxes</b>.', html: eq('118.8 ÷ 20', 5.94, 'boxes') + chip('→ <b>6 boxes</b>') },
      { cap: 'The underlay is sold in <b>m²</b>. 1 m² ≈ 10.76 ft², so <b>divide</b> by 10.76. Each roll covers 10 m²: 11.04 ÷ 10 = 1.1 → <b>2 rolls</b>.', html: eq('118.8 ÷ 10.76', 11.04, 'm²') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'Pick the flooring', 'Each box covers a set area.');
      box.appendChild(cards(c, 'floor', FLOOR_IDS, FLOORS, function (F) { return '<span class="pj-u3-sw" style="background:' + F.fill + '"></span><b>' + esc(F.name) + '</b><small>' + esc(F.look) + '</small><span class="pj-u3-price">' + money(F.price) + ' a box · covers ' + fx(F.cov, 2) + ' ft²</span>'; }, { aria: 'Flooring', onPick: function () { c.redraw(); } }));
      part(box, 'B', 'Find the floor area', 'Pick a way to break up the floor. Use decimal feet, and round areas to 2 decimal places.');
      box.appendChild(field('My way', c.choice('method', [{ v: 'split', html: '<span class="pj-u3-mth">' + planSvg(G, { small: true, parts: 'split' }) + '</span> Split it into rectangles' }, { v: 'cut', html: '<span class="pj-u3-mth">' + planSvg(G, { small: true, parts: 'cut' }) + '</span> Whole rectangle − cut-out' }], { cls: 'pj-seg pj-u3-methods', aria: 'How to find the area', onPick: function () { ['part.1', 'part.2', 'part.3'].forEach(function (k) { c.set(k, ''); }); c.redraw(); } })));
      var ps = parts4(c, G);
      box.appendChild(jobCard(c, G, { tapeKnown: true, parts: ps ? c.get('method') : null, floor: c.get('floor') }));
      if (ps) {
        var g = grid(box);
        ps.forEach(function (q, i) { g.appendChild(field('Area of ' + q.n + (q.whole ? ' (whole)' : q.s < 0 ? ' (cut-out)' : '') + ' (ft²)', inU(c, 'part.' + (i + 1), 'ft²', { aria: 'Area of part ' + q.n }))); });
        g.appendChild(field('Floor area (ft²)', inU(c, 'area', 'ft²', { aria: 'Floor area' })));
      }
      part(box, 'C', 'Add 10% for waste and buy whole boxes', '');
      var e = e4(c), g2 = grid(box);
      g2.appendChild(field('Area to buy, with 10% (ft²)', inU(c, 'buy', 'ft²', { aria: 'Area to buy with waste' })));
      g2.appendChild(field('Boxes of ' + (e.F ? esc(e.F.name.toLowerCase()) : 'flooring'), inU(c, 'boxes', 'boxes', { aria: 'Number of boxes' })));
      g2.appendChild(field('Cost of the flooring', c.input('floorCost', { aria: 'Cost of the flooring' })));
      part(box, 'D', 'The underlay is metric', esc(UNDERLAY.name) + ': one roll covers <b>10 m²</b> and costs <b>' + money(UNDERLAY.price) + '</b>. 1 m² ≈ 10.76 ft². Use your area with waste.');
      var g3 = grid(box);
      g3.appendChild(field('Area to buy (m²)', inU(c, 'm2', 'm²', { aria: 'Area to buy in square metres' })));
      g3.appendChild(field('Rolls of underlay', inU(c, 'rolls', 'rolls', { aria: 'Rolls of underlay' })));
      g3.appendChild(field('Cost of the underlay', c.input('ulCost', { aria: 'Cost of the underlay' })));
    },
    check: function (c) {
      var e = e4(c), G = e.G; if (!G) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [c.msg(!!e.F, 'Pick a flooring (Part A).'), c.msg(!!e.ps.length, 'Pick a way to find the area (Part B).')];
      if (!e.ps.length) return out;
      e.ps.forEach(function (q, i) {
        var a = q.w * q.h / 144, k = 'part.' + (i + 1);
        out.push(numR(c, k, a, { tol: 0.3, label: 'Area of ' + q.n, wrong: [{ v: -a, tol: 0.3, hint: 'Type the area of the cut-out as a positive number — you’ll subtract it in the floor area.' }, { v: q.w * q.h, tol: 2, hint: 'That’s in square <b>inches</b>. Change the sides to decimal feet first, then multiply.' }, { v: 2 * (q.w + q.h) / 12, tol: 0.05, hint: 'That’s the distance around ' + q.n + '. Area = length × width.' }, { v: wrongNaive(q.w) * wrongNaive(q.h), tol: 0.05, hint: 'Inches aren’t tenths of a foot (6 in = 0.5 ft). Change each side to decimal feet first.' }],
          hint: 'Area = length × width (in feet). Find the sides of ' + q.n + ' on the plan — you may need to add or subtract walls.', hint2: q.n + ' is ' + ftin(q.w) + ' by ' + ftin(q.h) + ' (' + fx(q.w / 12, 3) + ' ft × ' + fx(q.h / 12, 3) + ' ft).' }));
      });
      var allAdd = sum(e.ps.map(function (q, i) { return Math.abs(mine(c, 'part.' + (i + 1), q.w * q.h / 144)); }));
      out.push(numR(c, 'area', e.mineA, { tol: 0.05, label: 'Floor area', wrong: [{ v: allAdd, tol: 0.05, hint: '<b>Subtract</b> the cut-out — it isn’t part of the floor.' }], hint: c.get('method') === 'cut' ? 'Floor area = whole − cut-out' + (e.ps.length > 2 ? 's' : '') + '.' : 'Floor area = add up the parts.', hint2: e.ps.map(function (q, i) { return (i ? (q.s < 0 ? ' − ' : ' + ') : '') + fx(Math.abs(mine(c, 'part.' + (i + 1), q.w * q.h / 144)), 2); }).join('') }));
      var A1 = e.area1;
      out.push(numR(c, 'buy', e.buy, { tol: 0.06, label: 'Area with waste', wrong: [{ v: A1 * 0.1, tol: 0.06, hint: 'That’s just the extra 10%. Add it to the area — or multiply by 1.10.' }, { v: A1 + 10, tol: 0.06, hint: '10% isn’t 10 ft². Multiply the area by 1.10.' }, { v: A1 * 1.01, tol: 0.06, hint: '10% as a decimal is 0.10, so multiply by <b>1.10</b>.' }, { v: A1, tol: 0.02, hint: 'Add 10% for waste: area × 1.10.' }], hint: 'Area to buy = floor area × 1.10.', hint2: 'Try ' + fx(A1, 2) + ' × 1.10.' }));
      if (!e.F) return out;
      out.push(countR(c, 'boxes', e.boxesRaw, { noun: 'box', label: 'Boxes', wrong: [{ v: Math.ceil(A1 / e.F.cov - 1e-9), tol: 0, hint: 'Use the area <b>with</b> waste (and round up).' }], hint: 'Boxes = area to buy ÷ ' + fx(e.F.cov, 2) + ' ft², rounded up.', hint2: 'Try ' + fx(e.buy1, 2) + ' ÷ ' + fx(e.F.cov, 2) + ', then round up.' }));
      out.push(c.money('floorCost', e.cost, { label: 'Flooring cost', wrong: [{ v: e.buy1 * e.F.price, tol: 1, hint: 'Multiply the number of <b>boxes</b> by the price of one box.' }], hint: 'Cost = boxes × price per box.', hint2: 'Try ' + fx(e.boxes1, 0) + ' × ' + money(e.F.price) + '.' }));
      var B1 = e.buy1;
      out.push(numR(c, 'm2', e.m2, { tol: 0.03 + e.m2 * 0.0006, label: 'Area in m²', wrong: [{ v: B1 * M2FT, tol: 2, hint: 'From ft² to m², <b>divide</b> by 10.76 (a square metre is bigger than a square foot).' }, { v: B1 * 0.3048, tol: 0.1, hint: 'For <b>area</b> use 1 m² ≈ 10.76 ft² (0.3048 is for length). Divide by 10.76.' }, { v: B1 / 3.28, tol: 0.1, hint: 'For <b>area</b> use 1 m² ≈ 10.76 ft² (3.28 is for length). Divide by 10.76.' }, { v: e.area1 / M2FT, tol: 0.03, hint: 'Use the area <b>with</b> waste.' }], hint: 'm² = ft² ÷ 10.76.', hint2: 'Try ' + fx(B1, 2) + ' ÷ 10.76.' }));
      out.push(countR(c, 'rolls', e.rollsRaw, { noun: 'roll', label: 'Rolls', hint: 'Rolls = m² ÷ 10, rounded up.', hint2: 'Try ' + fx(mine(c, 'm2', e.m2), 2) + ' ÷ 10, then round up.' }));
      out.push(c.money('ulCost', e.ulCost, { label: 'Underlay cost', hint: 'Cost = rolls × ' + money(UNDERLAY.price) + '.', hint2: 'Try ' + fx(e.rolls1, 0) + ' × ' + money(UNDERLAY.price) + '.' }));
      return out;
    },
    solve: function (c) {
      if (!c.get('floor')) c.set('floor', 'lvp'); if (!c.get('method')) c.set('method', 'cut');
      var e = e4(c); e.ps.forEach(function (q, i) { c.set('part.' + (i + 1), (q.w * q.h / 144).toFixed(2)); });
      c.set('area', e4(c).mineA.toFixed(2)); c.set('buy', e4(c).buy.toFixed(2)); c.set('boxes', String(Math.ceil(e4(c).boxesRaw - 1e-9))); c.set('floorCost', e4(c).cost.toFixed(2));
      c.set('m2', e4(c).m2.toFixed(2)); c.set('rolls', String(Math.ceil(e4(c).rollsRaw - 1e-9))); c.set('ulCost', e4(c).ulCost.toFixed(2));
    }
  };

  /* ================= Checkpoint 5: paint the walls ================= */
  function e5(c) {
    var G = geo(c); if (!G) return { G: null };
    var Pt = PAINTS[c.get('paint')], P = mine(c, 'perim', sum(G.sides) / 12), h = G.h / 12, h1 = mine(c, 'hft', h);
    var gross = P * h1, doors = sum(G.doors.map(function (d) { return d.w * DOOR_H / 144; })), ww = mine(c, 'win.w', G.winCm[0] / CMFT), wh = mine(c, 'win.h', G.winCm[1] / CMFT), win = ww * wh;
    var g1 = mine(c, 'gross', gross), d1 = mine(c, 'doorA', doors), w1 = mine(c, 'winA', win), net = g1 - d1 - w1, n1 = mine(c, 'net', net), coats = n1 * 2, co1 = mine(c, 'coats', coats);
    var cansRaw = Pt ? co1 / Pt.cov : 0, cans1 = mine(c, 'cans', Math.ceil(cansRaw - 1e-9));
    return { G: G, Pt: Pt, P: P, h: h, h1: h1, gross: gross, doors: doors, ww: ww, wh: wh, win: win, g1: g1, d1: d1, w1: w1, net: net, n1: n1, coats: coats, co1: co1, cansRaw: cansRaw, cans1: cans1, cost: Pt ? cans1 * Pt.price : 0 };
  }
  var cp5 = {
    id: 'paint', title: 'Paint the walls', needs: ['u3l6', 'u3l8', 'u3l10'],
    goal: 'Find the <b>wall area</b> (perimeter × height), take away the doors and the window, plan <b>2 coats</b>, and buy whole cans of paint.',
    example: { title: 'Painting the sunroom', scene: '<div class="pj-u3-exwrap pj-u3-explan">' + (function () { return planSvg(exSun(), { maxW: 260, maxH: 170, paint: '#bcd3e6', hideLabels: false }); })() + '</div>', steps: [
      { cap: 'Unroll the walls and they make one long rectangle: as long as the <b>perimeter</b> (39 ft) and as tall as the ceiling (8 ft). That’s the surface area of the walls.', html: '<div class="pj-u3-unroll"><span style="flex:10.5">10.5 ft</span><span style="flex:9">9 ft</span><span style="flex:10.5">10.5 ft</span><span style="flex:9">9 ft</span></div>' + eq('39 × 8', 312, 'ft²') },
      { cap: 'You don’t paint the door. It’s 32 in by 80 in: 2.67 ft × 6.67 ft.', html: eq('2.67 × 6.67', 17.78, 'ft²') },
      { cap: 'Or the window: 4 ft × 3 ft = 12 ft². Take both away.', html: eq('312 − 17.78 − 12', 282.22, 'ft²') },
      { cap: 'Two coats means painting it all <b>twice</b>.', html: eq('282.22 × 2', 564.44, 'ft²') },
      { cap: 'One can covers 400 ft². 564.44 ÷ 400 = 1.41 → round <b>up</b>: <b>2 cans</b>.', html: eq('564.44 ÷ 400', 1.41, 'cans') + chip('→ <b>2 cans</b>') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'Pick the paint and a colour', 'Every can is 3.78 L. The label says how much wall one coat covers.');
      box.appendChild(cards(c, 'paint', PAINT_IDS, PAINTS, function (P) { return '<b>' + esc(P.name) + '</b><small>' + esc(P.look) + '</small><span class="pj-u3-price">' + money(P.price) + ' a can · covers ' + P.cov + ' ft²</span>'; }, { aria: 'Paint', onPick: function () { c.redraw(); } }));
      box.appendChild(field('Colour', c.choice('paintColor', PCOLS.map(function (x) { return { v: x[0], html: '<i style="background:' + x[0] + '"></i>' + x[1], title: x[1] }; }), { cls: 'pj-swatches', aria: 'Paint colour', onPick: function () { c.redraw(); } })));
      var e = e5(c);
      part(box, 'B', 'Find the area to paint', 'Wall area = perimeter × height. Doors are 6 ft 8 in (80 in) tall. Round areas to 2 decimal places.');
      box.appendChild(jobCard(c, G, { tapeKnown: true, paint: c.get('paintColor') || '#cbd5e1', floor: c.get('floor'), extra: '<dt>Perimeter</dt><dd>' + fx(e.P, 3) + ' ft (yours, from Checkpoint 2)</dd><dt>Window in ft</dt><dd>' + fx(e.ww, 2) + ' ft × ' + fx(e.wh, 2) + ' ft (yours, from Checkpoint 1)</dd>' }));
      var g = grid(box);
      g.appendChild(field('Ceiling height (ft)', inU(c, 'hft', 'ft', { aria: 'Ceiling height in feet' })));
      g.appendChild(field('Wall area (ft²)', inU(c, 'gross', 'ft²', { aria: 'Wall area' })));
      g.appendChild(field('Door' + (G.doors.length > 1 ? 's' : '') + ' (ft²)', inU(c, 'doorA', 'ft²', { aria: 'Door area' })));
      g.appendChild(field('Window (ft²)', inU(c, 'winA', 'ft²', { aria: 'Window area' })));
      g.appendChild(field('Area to paint (ft²)', inU(c, 'net', 'ft²', { aria: 'Area to paint' })));
      part(box, 'C', 'Two coats, whole cans', '');
      var g2 = grid(box);
      g2.appendChild(field('Area for 2 coats (ft²)', inU(c, 'coats', 'ft²', { aria: 'Area for two coats' })));
      g2.appendChild(field('Cans of paint', inU(c, 'cans', 'cans', { aria: 'Cans of paint' })));
      g2.appendChild(field('Cost of the paint', c.input('paintCost', { aria: 'Cost of the paint' })));
    },
    check: function (c) {
      var e = e5(c), G = e.G; if (!G) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [c.msg(!!e.Pt, 'Pick a paint (Part A).'), c.msg(!!c.get('paintColor'), 'Pick a paint colour (Part A).')];
      out.push(numR(c, 'hft', e.h, { tol: 0.006, unit: 'ft', label: 'Ceiling height', wrong: [{ v: wrongNaive(G.h), tol: 0.004, hint: 'Inches aren’t tenths of a foot. Change the inches to feet: ÷ 12.' }, { v: G.h, tol: 0.01, hint: 'That’s in inches. Divide by 12 to get feet.' }], hint: 'Feet = feet + inches ÷ 12.', hint2: ftin(G.h) + ' = ' + Math.floor(G.h / 12) + ' + ' + fx(G.h % 12, 1) + ' ÷ 12.' }));
      out.push(numR(c, 'gross', e.gross, { tol: 0.06, label: 'Wall area', wrong: [{ v: e.P * G.h, tol: 1, hint: 'Use the height in <b>feet</b>.' }, { v: floorExact(G), tol: 1, hint: 'That’s the <b>floor</b> area. Walls: perimeter × height (unroll the walls into one long rectangle).' }, { v: 2 * (e.P + e.h1), tol: 0.06, hint: 'Multiply the perimeter by the height: wall area = P × h.' }], hint: 'Wall area = perimeter × height.', hint2: 'Try ' + fx(e.P, 3) + ' × ' + fx(e.h1, 3) + '.' }));
      var dw = [{ v: G.doorsIn * DOOR_H, tol: 5, hint: 'That’s in square inches. Change to feet first (÷ 12), then multiply.' }, { v: G.doorsIn / 12 * 6.8, tol: 0.15, hint: 'Doors are 6 ft <b>8 in</b> tall = 6.67 ft (8 in ÷ 12), not 6.8 ft.' }];
      if (G.doors.length > 1) G.doors.forEach(function (d) { dw.push({ v: d.w * DOOR_H / 144, tol: 0.12, hint: 'Include every door and opening: this room has ' + G.doors.length + '.' }); });
      out.push(numR(c, 'doorA', e.doors, { tol: 0.12, label: 'Door area', wrong: dw, hint: 'Door area = width × height, in feet. Doors are 80 in (6.67 ft) tall.', hint2: G.doors.map(function (d) { return fx(d.w / 12, 2) + ' × 6.67'; }).join(' + ') }));
      out.push(numR(c, 'winA', e.win, { tol: 0.03, label: 'Window area', wrong: [{ v: G.winCm[0] * G.winCm[1], tol: 5, hint: 'That’s in cm². Use the window size in <b>feet</b> from Checkpoint 1.' }, { v: 2 * (e.ww + e.wh), tol: 0.03, hint: 'That’s the distance around. Area = width × height.' }], hint: 'Window area = width × height (in feet).', hint2: 'Try ' + fx(e.ww, 2) + ' × ' + fx(e.wh, 2) + '.' }));
      out.push(numR(c, 'net', e.net, { tol: 0.05, label: 'Area to paint', wrong: [{ v: e.g1 + e.d1 + e.w1, hint: '<b>Subtract</b> the doors and window — you don’t paint them.' }, { v: e.g1 - e.d1, hint: 'Take away the window too.' }, { v: e.g1 - e.w1, hint: 'Take away the door' + (G.doors.length > 1 ? 's' : '') + ' too.' }], hint: 'Area to paint = wall area − doors − window.', hint2: 'Try ' + fx(e.g1, 2) + ' − ' + fx(e.d1, 2) + ' − ' + fx(e.w1, 2) + '.' }));
      out.push(numR(c, 'coats', e.coats, { tol: 0.05, label: '2 coats', wrong: [{ v: e.n1, hint: 'Two coats: multiply by 2.' }, { v: e.n1 + 2, hint: 'Two coats means painting the whole area <b>twice</b>: × 2.' }], hint: 'Area for 2 coats = area to paint × 2.' }));
      if (!e.Pt) return out;
      out.push(countR(c, 'cans', e.cansRaw, { noun: 'can', label: 'Cans', wrong: [{ v: Math.ceil(e.n1 / e.Pt.cov - 1e-9), tol: 0, hint: 'Use the area for <b>2 coats</b> (and round up).' }], hint: 'Cans = area for 2 coats ÷ ' + e.Pt.cov + ' ft², rounded up.', hint2: 'Try ' + fx(e.co1, 2) + ' ÷ ' + e.Pt.cov + ', then round up.' }));
      out.push(c.money('paintCost', e.cost, { label: 'Paint cost', hint: 'Cost = cans × price per can.', hint2: 'Try ' + fx(e.cans1, 0) + ' × ' + money(e.Pt.price) + '.' }));
      return out;
    },
    solve: function (c) {
      if (!c.get('paint')) c.set('paint', 'pro'); if (!c.get('paintColor')) c.set('paintColor', PCOLS[1][0]);
      c.set('hft', fx(e5(c).h, 3)); c.set('gross', e5(c).gross.toFixed(2)); c.set('doorA', e5(c).doors.toFixed(2)); c.set('winA', e5(c).win.toFixed(2)); c.set('net', e5(c).net.toFixed(2)); c.set('coats', e5(c).coats.toFixed(2));
      c.set('cans', String(Math.ceil(e5(c).cansRaw - 1e-9))); c.set('paintCost', e5(c).cost.toFixed(2));
    }
  };

  /* ================= Checkpoint 6: the finishing touch (circles) ================= */
  function e6(c) {
    var f = featOf(c); if (!f) return null;
    var dft = f.d / 12, r = dft / 2, r1 = mine(c, 'r', r), moon = f.id === 'moon';
    var trimL = moon ? PI * dft / 2 + dft : PI * dft, t1 = mine(c, 'trimL', trimL), buy1 = mine(c, 'trimBuy', Math.ceil(t1 - 1e-9));
    var area = moon ? PI * r1 * r1 / 2 : PI * r1 * r1, a1 = mine(c, 'fArea', area);
    return { f: f, F: f.F, moon: moon, dft: dft, r: r, r1: r1, trimL: trimL, t1: t1, buy1: buy1, trimCost: buy1 * f.F.trim.price, area: area, a1: a1, matCost: a1 * f.F.mat.price };
  }
  var cp6 = {
    id: 'feature', title: 'The finishing touch', needs: ['u3l6', 'u3l8'],
    goal: 'The client wants one special piece: a <b>round table top</b> or a <b>half-moon window</b>. Find the <b>circumference</b> for the trim and the <b>area</b> for the top or the glass.',
    example: { title: 'A round coffee table', scene: '<div class="pj-u3-exwrap">' + tableSvg('table', 42) + '</div>', steps: [
      { cap: 'Chinook Carpentry is building a round table <b>3 ft 6 in</b> across. That’s the <b>diameter</b>: d = 3.5 ft. The <b>radius</b> is half of it.', html: eq('3.5 ÷ 2', 1.75, 'ft') },
      { cap: 'Edge banding goes all the way around: the <b>circumference</b>. C = π × d.', html: eq('π × 3.5', 11, 'ft') },
      { cap: 'Banding is sold by the foot. 11.00 ft → buy <b>11 ft</b> (round up if it isn’t a whole number). At $1.49 a foot:', html: eq('11 × $1.49', 16.39, '', 'money') },
      { cap: 'The top needs plywood for the <b>area</b>: A = π × r². Use the radius, not the diameter!', html: eq('π × 1.75 × 1.75', 9.62, 'ft²') },
      { cap: 'For <b>half</b> a circle (like a half-moon window), halve the area, and halve the curve: then add the straight edge along the bottom (the diameter).', html: chip('half-circle trim = π × d ÷ 2 + d &nbsp; · &nbsp; area = π × r² ÷ 2') }] },
    render: function (box, c) {
      if (!geo(c)) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'Pick the finishing touch', 'Each crew gets its own size.');
      box.appendChild(c.choice('feat', ['table', 'moon'].map(function (id) { var F = FEATS[id], d = F.D[hv(c, 'fd' + id) % 3]; return { v: id, html: '<span class="pj-u3-fpic">' + tableSvg(id, d) + '</span><b>' + esc(F.name) + '</b><small>' + F.blurb + '</small><span class="pj-u3-price">' + esc(F.trim.name) + ' ' + money(F.trim.price) + '/ft · ' + esc(F.mat.name) + ' ' + money(F.mat.price) + '/ft²</span>' }; }), { cls: 'pj-types pj-u3-cards pj-u3-feats', aria: 'Finishing touch', onPick: function () { c.redraw(); } }));
      var e = e6(c); if (!e) return;
      part(box, 'B', 'Trim around the edge', (e.moon ? 'The trim goes around the curve <b>and</b> along the straight bottom. ' : 'The banding goes all the way around. ') + 'The diameter is <b>' + esc(ftin(e.f.d)) + '</b>. Use π (or 3.14) and round to 2 decimal places.');
      var g = grid(box);
      g.appendChild(field('Radius (ft)', inU(c, 'r', 'ft', { aria: 'Radius in feet' })));
      g.appendChild(field(e.moon ? 'Trim length: curve + bottom (ft)' : 'Circumference (ft)', inU(c, 'trimL', 'ft', { aria: 'Trim length in feet' })));
      g.appendChild(field(esc(e.F.trim.name) + ' to buy (whole ft)', inU(c, 'trimBuy', 'ft', { aria: 'Trim to buy in whole feet' })));
      g.appendChild(field('Cost of the ' + esc(e.F.trim.name.toLowerCase()), c.input('ftCost', { aria: 'Cost of the trim' })));
      part(box, 'C', e.moon ? 'Glass for the window' : 'Plywood for the top', esc(e.F.mat.name) + ' costs <b>' + money(e.F.mat.price) + '</b> per ft². Use your radius.');
      var g2 = grid(box);
      g2.appendChild(field('Area (ft²)', inU(c, 'fArea', 'ft²', { aria: 'Area in square feet' })));
      g2.appendChild(field('Cost of the ' + esc(e.F.mat.name.toLowerCase()), c.input('fCost', { aria: 'Cost of the material' })));
    },
    check: function (c) {
      if (!geo(c)) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var e = e6(c); if (!e) return [c.msg(false, 'Pick the finishing touch (Part A).')];
      var out = [], d = e.dft, r1 = e.r1;
      out.push(numR(c, 'r', e.r, { tol: 0.006, unit: 'ft', label: 'Radius', wrong: [{ v: d, tol: 0.006, hint: 'That’s the diameter. The radius is <b>half</b>: d ÷ 2.' }, { v: e.f.d / 2, tol: 0.01, hint: 'That’s in inches. Change it to feet (÷ 12).' }, { v: wrongNaive(e.f.d) / 2, tol: 0.006, hint: 'Inches aren’t tenths of a foot (6 in = 0.5 ft). Change the diameter to decimal feet first.' }], hint: 'Radius = diameter ÷ 2, in feet.', hint2: ftin(e.f.d) + ' = ' + fx(d, 3) + ' ft. Half of that is the radius.' }));
      var tw = e.moon ? [{ v: PI * d, hint: 'It’s <b>half</b> a circle: halve the circumference (π × d ÷ 2) — then add the straight bottom.' }, { v: PI * d / 2, hint: 'Don’t forget the straight bottom edge: add the diameter.' }, { v: PI * d / 2 + r1, hint: 'The straight bottom edge is the whole <b>diameter</b>, not the radius.' }, { v: PI * r1 * r1 / 2, hint: 'That’s the area. The trim is a length: π × d ÷ 2 + d.' }]
        : [{ v: 2 * PI * d, hint: 'C = π × d (or 2 × π × r) — not 2 × π × d.' }, { v: PI * r1, hint: 'Use the <b>diameter</b>: C = π × d (or 2 × π × r).' }, { v: PI * r1 * r1, hint: 'That’s the area. Circumference = π × d.' }];
      tw.forEach(function (w) { w.tol = piTol(w.v); });
      out.push(numR(c, 'trimL', e.trimL, { tol: piTol(e.trimL), label: e.moon ? 'Trim length' : 'Circumference', wrong: tw, hint: e.moon ? 'Trim = π × d ÷ 2 + d.' : 'C = π × d.', hint2: e.moon ? 'Try π × ' + fx(d, 3) + ' ÷ 2 + ' + fx(d, 3) + '.' : 'Try π × ' + fx(d, 3) + '.' }));
      out.push(countR(c, 'trimBuy', e.t1, { noun: 'foot', plural: 'feet', label: 'Trim to buy', hint: 'Trim is sold by the whole foot: round <b>up</b>.' }));
      out.push(c.money('ftCost', e.trimCost, { label: 'Trim cost', hint: 'Cost = feet × ' + money(e.F.trim.price) + '.', hint2: 'Try ' + fx(e.buy1, 0) + ' × ' + money(e.F.trim.price) + '.' }));
      var aw = [{ v: PI * d * d, hint: 'Use the <b>radius</b> in A = π × r², not the diameter.' }, { v: 2 * PI * r1, hint: 'That’s the circumference. Area = π × r × r.' }, { v: PI * r1 * 2, hint: 'r² means r × r, not r × 2.' }];
      if (e.moon) aw.push({ v: PI * r1 * r1, hint: 'It’s <b>half</b> a circle: divide the area by 2.' }, { v: PI * d * d / 2, hint: 'Use the <b>radius</b>: A = π × r² ÷ 2.' });
      aw.forEach(function (w) { w.tol = piTol(w.v); });
      out.push(numR(c, 'fArea', e.area, { tol: piTol(e.area), label: 'Area', wrong: aw, hint: e.moon ? 'Half-circle area = π × r² ÷ 2.' : 'A = π × r².', hint2: 'Try π × ' + fx(r1, 3) + ' × ' + fx(r1, 3) + (e.moon ? ' ÷ 2' : '') + '.' }));
      out.push(c.money('fCost', e.matCost, { tol: 0.02, label: 'Material cost', hint: 'Cost = area × ' + money(e.F.mat.price) + ' per ft².', hint2: 'Try ' + fx(e.a1, 2) + ' × ' + money(e.F.mat.price) + '.' }));
      return out;
    },
    solve: function (c) {
      if (!c.get('feat')) c.set('feat', 'table');
      c.set('r', fx(e6(c).r, 3)); c.set('trimL', e6(c).trimL.toFixed(2)); c.set('trimBuy', String(Math.ceil(e6(c).t1 - 1e-9))); c.set('ftCost', e6(c).trimCost.toFixed(2)); c.set('fArea', e6(c).area.toFixed(2)); c.set('fCost', e6(c).matCost.toFixed(2));
    }
  };

  /* ================= Checkpoint 7: the quote, a reflection, hand it in ================= */
  function quoteLines(c) {
    if (!geo(c)) return [];
    var t2 = e2(c), t4 = e4(c), t5 = e5(c), t6 = e6(c), out = [];
    function L(item, q, u, k, fb) { out.push({ t: item, q: q, u: u, k: k, amt: mine(c, k, fb) }); }
    if (t2.T && t2.len) L(t2.T.name + ' baseboard, ' + t2.len + ' ft', fx(t2.b1, 0) + ' boards', money(t2.price), 'trimCost', t2.cost);
    if (t4.F) L(t4.F.name + ' flooring', fx(t4.boxes1, 0) + ' boxes', money(t4.F.price), 'floorCost', t4.cost);
    L(UNDERLAY.name, fx(t4.rolls1, 0) + ' rolls', money(UNDERLAY.price), 'ulCost', t4.ulCost);
    if (t5.Pt) L(t5.Pt.name + ' paint' + (c.get('paintColor') ? ' (' + (PCOLS.filter(function (x) { return x[0] === c.get('paintColor'); })[0] || ['', ''])[1] + ')' : ''), fx(t5.cans1, 0) + ' cans', money(t5.Pt.price), 'paintCost', t5.cost);
    if (t6) { L(t6.F.trim.name + ' (' + t6.F.name.toLowerCase() + ')', fx(t6.buy1, 0) + ' ft', money(t6.F.trim.price) + '/ft', 'ftCost', t6.trimCost); L(t6.F.mat.name, fx(t6.a1, 2) + ' ft²', money(t6.F.mat.price) + '/ft²', 'fCost', t6.matCost); }
    return out;
  }
  function e7(c) {
    var G = geo(c), lines = quoteLines(c), mat = sum(lines.map(function (l) { return l.amt; })), rate = Number(c.get('rate')) || 0, labour = G ? G.hours * rate : 0;
    var mat1 = mine(c, 'mat', mat), lab1 = mine(c, 'labour', labour), sub = mat1 + lab1, sub1 = mine(c, 'sub', sub), gst = sub1 * GST, gst1 = mine(c, 'gst', Math.round(gst * 100) / 100);
    return { G: G, lines: lines, mat: mat, rate: rate, labour: labour, mat1: mat1, lab1: lab1, sub: sub, sub1: sub1, gst: gst, gst1: gst1, total: sub1 + gst1 };
  }
  var HAMMER = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40 26 22" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M20 10l10-4 12 12-4 10-6-6-4 4-8-8 4-4z" fill="currentColor"/><path d="M6 44h36" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".4"/></svg>';
  function quoteHtml(c) {
    var G = geo(c); if (!G) return '';
    var J = job(c), e = e7(c), col = c.get('crewColor') || COLORS[0][0], f = featOf(c), shown = function (k) { var x = pm(c.get(k)); return isNaN(x) ? '—' : money(x); };
    var rows = e.lines.map(function (l) { return '<tr><td>' + esc(l.t) + '</td><td>' + esc(l.q) + '</td><td>' + esc(l.u) + '</td><td class="r">' + (isNaN(pm(c.get(l.k))) ? '—' : money(l.amt)) + '</td></tr>'; }).join('');
    var d = new Date();
    return '<div class="pj-u3-quote" style="--qc:' + esc(col) + '">' +
      '<div class="pj-u3-q-top"><div class="pj-u3-q-logo">' + HAMMER + '</div><div class="pj-u3-q-id"><div class="pj-u3-q-crew">' + esc(crewName(c)) + '</div><div class="pj-u3-q-sub">Renovations · Alberta</div></div><div class="pj-u3-q-no"><b>QUOTE</b><span>#' + J.no + '</span><span>' + esc(d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })) + '</span></div></div>' +
      '<div class="pj-u3-q-to"><div><small>Prepared for</small><b>' + esc(J.client.replace(/^the /, 'The ')) + '</b><span>' + esc(J.address) + '</span></div><div><small>The job</small><b>' + esc(G.R.name) + '</b><span>New floor, baseboard and paint' + (f ? ', plus a ' + esc(f.F.name.toLowerCase()) : '') + '</span></div></div>' +
      '<table class="pj-u3-q-tbl"><thead><tr><th>Materials</th><th>Qty</th><th>Price</th><th class="r">Amount</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="pj-u3-q-sums"><div><span>Materials</span><b>' + shown('mat') + '</b></div><div><span>Labour: ' + G.hours + ' h × ' + (e.rate ? money(e.rate) + '/h' : '—') + '</span><b>' + shown('labour') + '</b></div><div class="sub"><span>Subtotal</span><b>' + shown('sub') + '</b></div><div><span>GST (5%)</span><b>' + shown('gst') + '</b></div><div class="tot"><span>Total</span><b>' + shown('total') + '</b></div></div>' +
      (c.get('qnote') ? '<div class="pj-u3-q-note">' + esc(c.get('qnote')) + '</div>' : '') +
      '<div class="pj-u3-q-foot"><span>Prices in Canadian dollars. This quote is good for 30 days.</span><span class="pj-u3-q-sign">Client signature ____________________</span></div></div>';
  }
  var cp7 = {
    id: 'quote', title: 'The quote — and hand it in', needs: [], submit: true,
    goal: 'Put it all together: a <b>quote</b> for the client with the materials, your labour, <b>GST (5%)</b> and the total. Then look back and <b>hand in</b> your project.',
    passMsg: 'Your project has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Chinook Carpentry’s quote for the sunroom', steps: [
      { cap: 'Add up the materials from every part of the job.', html: '<table class="pj-x-tbl"><tr><td>Baseboard</td><td>$64.90</td></tr><tr><td>Flooring</td><td>$257.94</td></tr><tr><td>Paint</td><td>$125.96</td></tr></table>' + eq('64.90 + 257.94 + 125.96', 448.8, '', 'money', 500) },
      { cap: '<b>Labour</b>: the crew charges by the hour. 9 hours at $60 an hour.', html: eq('9 × $60', 540, '', 'money') },
      { cap: 'Subtotal = materials + labour.', html: eq('$448.80 + $540', 988.8, '', 'money') },
      { cap: 'In Alberta, <b>GST is 5%</b> on renovations: × 0.05.', html: eq('$988.80 × 0.05', 49.44, '', 'money') },
      { cap: 'Total = subtotal + GST. That’s the number the client signs for!', html: eq('$988.80 + $49.44', 1038.24, '', 'money') }] },
    render: function (box, c) {
      var G = geo(c); if (!G) return needFirst(box, 'Finish the checkpoints before this one first.');
      var e = e7(c);
      part(box, 'A', 'Your labour rate', 'Your crew thinks this job will take <b>' + G.hours + ' hours</b>. Pick what you charge per hour.');
      box.appendChild(field('Labour rate', c.choice('rate', RATES.map(function (r) { return { v: String(r), html: money(r) + '/h' }; }), { cls: 'pj-seg', aria: 'Labour rate', onPick: function () { c.redraw(); } })));
      part(box, 'B', 'Add it up', 'Use the amounts on your quote below. Round money to the nearest cent.');
      var g = grid(box), upd = function () { var q = box.querySelector('.pj-u3-qwrap'); if (q) q.innerHTML = quoteHtml(c); };
      [['mat', 'Materials (add up the list)'], ['labour', 'Labour (' + G.hours + ' h × rate)'], ['sub', 'Subtotal'], ['gst', 'GST (5%)'], ['total', 'Total']].forEach(function (x) { g.appendChild(field(x[1], c.input(x[0], { aria: x[1], onInput: upd }))); });
      box.appendChild(field('A note for the client (optional)', c.text('qnote', { ph: 'e.g. Thanks for choosing us! We can start Monday.', max: 90, aria: 'Note for the client', onInput: upd }), 'pj-wide'));
      box.appendChild(el('div', 'pj-u3-qwrap', quoteHtml(c)));
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my quote'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<link rel="stylesheet" href="' + PJ.site + 'assets/projects-u3.css"><div class="pj-printsheet">' + quoteHtml(c) + '</div>', crewName(c) + ' quote'); });
      if (!c.ro) box.appendChild(pr);
      part(box, 'C', 'Look back', '');
      box.appendChild(field('Your crew bought more than the exact amount of flooring, paint and trim. Why? Use one example from your job.', c.text('reflect', { area: true, rows: 3, max: 500, ph: 'e.g. I needed 17.08 boxes of flooring, but you can’t buy part of a box, so…', aria: 'Reflection' }), 'pj-wide'));
      void e;
    },
    check: function (c) {
      var e = e7(c); if (!e.G) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var out = [c.need('rate', { label: 'Labour rate' })];
      out.push(c.money('mat', e.mat, { tol: 0.011, label: 'Materials', wrong: [{ v: e.mat - (e.lines[e.lines.length - 1] || { amt: 0 }).amt, hint: 'Add <b>every</b> line on the quote (there are ' + e.lines.length + ').' }], hint: 'Materials = add up every amount on the quote.', hint2: e.lines.map(function (l) { return money(l.amt); }).join(' + ') }));
      out.push(c.money('labour', e.labour, { label: 'Labour', wrong: [{ v: e.rate, hint: 'That’s one hour. Multiply by ' + e.G.hours + ' hours.' }, { v: e.G.hours + e.rate, hint: 'Multiply the hours by the rate.' }], hint: 'Labour = hours × rate.', hint2: 'Try ' + e.G.hours + ' × ' + money(e.rate) + '.' }));
      out.push(c.money('sub', e.sub, { tol: 0.011, label: 'Subtotal', hint: 'Subtotal = materials + labour.', hint2: 'Add: ' + money(e.mat1) + ' + ' + money(e.lab1) + '.' }));
      out.push(c.money('gst', e.gst, { label: 'GST', wrong: [{ v: e.sub1 * 5, tol: 0.5, hint: 'Use 5% as a decimal: <b>0.05</b>.' }, { v: e.sub1 * 0.5, tol: 0.05, hint: '5% is <b>0.05</b>, not 0.5.' }, { v: e.sub1 * 1.05, tol: 0.05, hint: 'That’s the total. GST is just the 5% part: subtotal × 0.05.' }, { v: e.mat1 * 0.05, tol: 0.011, hint: 'GST goes on the <b>subtotal</b> (materials and labour).' }], hint: 'GST = subtotal × 0.05.', hint2: 'Try ' + money(e.sub1) + ' × 0.05.' }));
      out.push(c.money('total', e.total, { tol: 0.011, label: 'Total', wrong: [{ v: e.sub1 - e.gst1, hint: 'Add the GST — don’t subtract it.' }], hint: 'Total = subtotal + GST.', hint2: 'Add: ' + money(e.sub1) + ' + ' + money(e.gst1) + '.' }));
      out.push(c.need('reflect', { min: 20, label: 'Look back', hint: 'Write a sentence or two: why buy extra? Give one example from your job.' }));
      return out;
    },
    solve: function (c) {
      if (!c.get('rate')) c.set('rate', '55');
      c.set('mat', e7(c).mat.toFixed(2)); c.set('labour', e7(c).labour.toFixed(2)); c.set('sub', e7(c).sub.toFixed(2)); c.set('gst', e7(c).gst.toFixed(2)); c.set('total', e7(c).total.toFixed(2));
      c.set('reflect', 'You can’t buy part of a box, so I rounded 17.08 boxes up to 18, and some flooring gets cut off at the walls.');
    }
  };

  PJ.reno = { ROOMS: ROOMS, geo: geo, tapeOf: tapeOf, e2: e2, e3: e3, e4: e4, e5: e5, e6: e6, e7: e7, pm: pm, quoteLines: quoteLines, quoteHtml: quoteHtml, planSvg: planSvg, tapeSvg: tapeSvg, ftin: ftin };
  HW.defineProject({
    id: 'u3', unit: 3, title: 'Reno Crew', outcomes: ['M1', 'M2', 'M3', 'M4', 'A1'], icon: HAMMER,
    tagline: 'Run a renovation crew: measure a room, buy the trim, flooring and paint, and quote the job.',
    intro: '<div class="pj-intro-art pj-u3-art">' + HAMMER + '</div><div><b>Welcome to Reno Crew!</b> A client wants a basement room redone: new floor, new baseboard, fresh paint and one special piece. In 7 checkpoints you’ll use the math from Unit 3 to measure, buy the right amount of everything, and write the client a real quote. Your work saves as you go. It’s due on the Unit 3 test day.</div>',
    lessonNames: { u3l1: 'Mixed Numbers', u3l3: 'Tape Measure', u3l4: 'Converting Length', u3l5: 'SI and Imperial', u3l6: 'Perimeter', u3l7: 'Rearranging Formulas', u3l8: 'Area', u3l9: 'Composite Shapes', u3l10: 'Surface Area' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: quoteHtml
  });
})(typeof window !== 'undefined' ? window : global);
