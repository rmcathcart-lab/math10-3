/* Unit 6 project: Scale It (Similarity and Scale: G3).
 * A client in an Alberta town hires the student to make a scale model and a plan for a real build: a tiny house, a
 * skate park or a food truck (each student gets their own sizes). Check which of 3 sign-shop versions of the client's
 * logo is similar to the original (angles AND every side ratio; why the others aren't), find the model's scale factor
 * k = model ÷ real and the model's other sizes (and back to real), draw an enlargement or reduction of a window, ramp or
 * sign by placing corners on a grid, choose a scale so the floor plan fits the page (1 cm represents … m, 1 : N), cut out
 * and place two pieces and read a real distance off the plan, measure a tree by its shadow and a light pole with a
 * mirror (eye height), then print a plan sheet and hand it in. Every answer is checked against the student's own build
 * and earlier answers (a later box uses the student's own earlier numbers, so one slip doesn't snowball).
 * Worked examples use a different builder: Maya at Prairie Scale Models in Pincher Creek (a heritage grain elevator).
 * Conventions follow the Unit 6 notes in m103book/common/BOOK_BRIEF.md: scale factor k = new ÷ original (k > 1
 * enlargement, k < 1 reduction); scales as "1 cm represents 2 m" and as a ratio 1 : 200 (same units on both sides);
 * similar = corresponding angles equal AND all corresponding sides in the same ratio; lengths to the nearest tenth.
 * Engine: js/projects.js. Each checkpoint has solve(c), which fills in right answers (tests/projects_u6_test.js and
 * tests/projects_u6_e2e.py). Styles: assets/projects-u6.css (added to the page by this file). Everything is pj-u6-. */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, esc = PJ.esc;
  var hasDoc = typeof document !== 'undefined';
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  if (hasDoc && PJ.site != null && !document.querySelector('link[data-pj-u6], link[href*="projects-u6.css"]')) {
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = PJ.site + 'assets/projects-u6.css'; lk.setAttribute('data-pj-u6', ''); document.head.appendChild(lk);
  }
  var D2R = Math.PI / 180, R2D = 180 / Math.PI, NS = 'http://www.w3.org/2000/svg';

  /* ================= small helpers ================= */
  function hv(c, k) { return PJ.hash(c.seed + '|' + k); }
  function fx(x, n) { return String(Number((+x).toFixed(n == null ? 2 : n))); }
  function r1(x) { return Math.round(x * 10 + (x >= 0 ? 1e-9 : -1e-9)) / 10; }
  function shuffled(arr, h) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; var j = h % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* a typed number: "36", "36 cm", "2.5 m", "1/25", "1:25" (→ 1/25), "×1.5" → number; anything else → NaN */
  function pn(s) {
    if (s == null) return NaN;
    var t = String(s).trim().replace(/^[×x*]\s*/i, '').replace(/\s*(cm|m|metres?|meters?|centimetres?|centimeters?|squares?|sq|°|º|deg(rees?)?)\.?\s*$/i, '').replace(/[⁄∕]/g, '/');
    var m = /^(-?\d*\.?\d+)\s*[\/:]\s*(\d*\.?\d+)$/.exec(t); if (m) return +m[2] ? +m[1] / +m[2] : NaN;
    return PJ.parse(t);
  }
  /* the N of a typed scale ratio "1 : N" ("1:200", "200", "1/200" → 200) */
  function pN(s) {
    if (s == null) return NaN; var t = String(s).trim();
    var m = /^1\s*[:\/]\s*(.+)$/.exec(t); if (m) return PJ.parse(m[1].trim());
    return PJ.parse(t);
  }
  function mine(c, k, fb) { var x = pn(c.get(k)); return isNaN(x) ? fb : x; } // the student's own number (or the right one)
  function decs(s) { var m = /\.(\d+)/.exec(String(s)); return m ? m[1].length : 0; }

  /* ================= result builders ================= */
  function R0(f, ok, x) { var r = { f: f, ok: !!ok, blank: false, graded: true }; if (x) for (var k in x) r[k] = x[k]; return r; }
  /* a number: right within o.tol (default 0.051: the nearest tenth is fine), or o.rel (a fraction of exp);
     o.wrong: [{ v, tol, hint }]; a value 100 times too big or small gets o.units (a cm ↔ m slip) */
  function numR(c, k, exp, o) {
    o = o || {}; var base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!c.has(k)) return R0(k, false, Object.assign(base, { blank: true }));
    var x = o.parse ? o.parse(c.get(k)) : pn(c.get(k));
    if (isNaN(x)) return R0(k, false, Object.assign(base, { form: true, hint: o.form || 'Type just a number, like 12.5.' }));
    var tol = o.rel != null ? Math.abs(exp) * o.rel : o.tol == null ? 0.051 : o.tol;
    if (Math.abs(x - exp) <= tol + 1e-9) return R0(k, true, base);
    var w = o.wrong || [];
    for (var i = 0; i < w.length; i++) {
      var wv = w[i].v, wt = w[i].tol != null ? w[i].tol : o.rel != null ? Math.abs(wv) * o.rel : tol;
      if (wv != null && isFinite(wv) && Math.abs(x - wv) <= wt + 1e-9 && Math.abs(wv - exp) > tol + 1e-9) return R0(k, false, Object.assign(base, { hint: w[i].hint }));
    }
    if (exp && o.units !== false && (Math.abs(x - exp * 100) <= tol * 100 + 1e-9 || Math.abs(x * 100 - exp) <= tol + 1e-9))
      return R0(k, false, Object.assign(base, { hint: o.units || 'Check your units: 1 m = 100 cm. Your answer is 100 times too ' + (x > exp ? 'big' : 'small') + '.' }));
    return R0(k, false, Object.assign(base, { hint: o.hint || 'Check this one again.' }));
  }
  /* a side ratio new ÷ original: right to 2 decimal places (or to 1 when that's how it rounds) */
  function ratioR(c, k, exp, o) {
    o = Object.assign({ tol: 0.0051 }, o || {});
    var x = pn(c.get(k));
    if (!isNaN(x) && decs(c.get(k)) <= 1 && Math.abs(x - exp) < 0.05 + 1e-9 && Math.abs(r1(exp) - x) < 1e-9) { var r = R0(k, true, { label: o.label, graded: true }); return r; }
    return numR(c, k, exp, o);
  }

  /* ================= the builds ================= */
  var TOWNS = ['Drumheller', 'Canmore', 'Lacombe', 'Brooks', 'Camrose', 'Hinton', 'Wetaskiwin', 'High River', 'Vegreville', 'Taber', 'Stettler', 'Athabasca'];
  var BUILDS = {
    tiny: { name: 'Tiny house', icon: '🏠', blurb: 'A tiny house on a trailer, ready to move', what: 'tiny house',
      client: 'Prairie Nest Tiny Homes', clientLine: 'builds tiny houses and wants a model for its show room', names: ['The Wanderer', 'Little Prairie', 'Chinook Cabin'],
      V: [{ L: 7.2, W: 2.6, H: 4.0, k: 0.05 }, { L: 7.8, W: 2.6, H: 3.9, k: 0.04 }, { L: 8.4, W: 2.6, H: 4.1, k: 0.025 }],
      dimN: { L: 'length', W: 'width', H: 'height (ground to roof)' },
      feat: { name: 'loft window', real: 1.2, what: 'wide' },
      logo: { kind: 'house', name: 'house-shaped logo', V: [{ w: 6, h: 4, r: 5 }, { w: 8, h: 5, r: 5 }, { w: 6, h: 3, r: 5 }], types: ['bottom', 'wall', 'roof'], tn: { bottom: 'Bottom edge', wall: 'Side walls', roof: 'Roof edges' } },
      draws: [{ name: 'gable window', pts: [[0, 0], [4, 0], [4, 4], [2, 6], [0, 4]], star: 3 }, { name: 'corner window', pts: [[0, 0], [6, 0], [6, 4], [2, 4], [0, 2]], star: 3 }],
      scales: [0.2, 0.25, 0.4, 0.5], inside: 'inside the house',
      items: [{ id: 'a', name: 'Kitchen counter', L: 2.4, W: 0.6, col: '#f59e0b' }, { id: 'b', name: 'Sofa bed', L: 2.0, W: 0.9, col: '#8b5cf6' }],
      site: { tree: 'spruce tree', pole: 'yard light', T: [6, 8, 9, 10, 12] } },
    skate: { name: 'Skate park', icon: '🛹', blurb: 'A concrete skate park with ramps and rails', what: 'skate park',
      client: 'the Parks and Recreation office', clientLine: 'is planning a new skate park and wants a model for the town council', names: ['Ollie Alley', 'The Drop Zone', 'Grind Ground'],
      V: [{ L: 32, W: 20, H: 2.4, k: 0.01 }, { L: 36, W: 24, H: 1.8, k: 0.005 }, { L: 40, W: 24, H: 2.0, k: 0.02 }],
      dimN: { L: 'length', W: 'width', H: 'height of the quarter pipe' },
      feat: { name: 'grind rail', real: 6, what: 'long' },
      logo: { kind: 'funbox', name: 'funbox logo', V: [{ b: 10, t: 4, l: 5 }, { b: 12, t: 4, l: 5 }, { b: 14, t: 8, l: 5 }], types: ['bottom', 'top', 'leg'], tn: { bottom: 'Bottom edge', top: 'Top edge', leg: 'Slanted sides' } },
      draws: [{ name: 'kicker ramp', pts: [[0, 0], [8, 0], [8, 4], [6, 4]], star: 3 }, { name: 'funbox side', pts: [[0, 0], [8, 0], [6, 2], [2, 2]], star: 2 }],
      scales: [1, 2, 2.5, 4], inside: 'inside the park',
      items: [{ id: 'a', name: 'Funbox', L: 6, W: 4, col: '#f59e0b' }, { id: 'b', name: 'Quarter pipe', L: 8, W: 3, col: '#8b5cf6' }],
      site: { tree: 'cottonwood tree', pole: 'light pole', T: [10, 12, 14, 16, 18] } },
    truck: { name: 'Food truck', icon: '🚚', blurb: 'A food truck with a serving window', what: 'food truck',
      client: 'Rolling Bannock Co.', clientLine: 'is building a food truck and wants a model and a kitchen plan', names: ['Bannock on Wheels', 'The Prairie Plate', 'Big Sky Bites'],
      V: [{ L: 5.6, W: 2.4, H: 3.0, k: 0.05 }, { L: 6.0, W: 2.4, H: 3.2, k: 0.04 }, { L: 6.4, W: 2.4, H: 3.4, k: 0.025 }],
      dimN: { L: 'length', W: 'width', H: 'height (ground to roof)' },
      feat: { name: 'serving window', real: 1.8, what: 'wide' },
      logo: { kind: 'banner', name: 'arrow-banner logo', V: [{ w: 4, h: 7, r: 2.5 }, { w: 4, h: 6, r: 2.5 }, { w: 6, h: 9, r: 5 }], types: ['bottom', 'wall', 'roof'], tn: { bottom: 'Short end', wall: 'Long sides', roof: 'Point edges' } },
      draws: [{ name: 'serving-window awning', pts: [[0, 0], [6, 0], [8, 2], [8, 4], [0, 4]], star: 2 }, { name: 'menu sign', pts: [[2, 0], [6, 0], [8, 2], [6, 4], [2, 4], [0, 2]], star: 2 }],
      scales: [0.2, 0.25, 0.3, 0.4], inside: 'inside the truck',
      items: [{ id: 'a', name: 'Grill', L: 1.2, W: 0.6, col: '#f59e0b' }, { id: 'b', name: 'Fridge', L: 0.8, W: 0.7, col: '#8b5cf6' }],
      site: { tree: 'poplar tree', pole: 'parking-lot light', T: [6, 7, 8, 9, 10] } }
  };
  var BUILD_IDS = ['tiny', 'skate', 'truck'];
  var COLORS = [['#2563eb', 'Blueprint blue'], ['#0f766e', 'Spruce green'], ['#c2410c', 'Prairie rust'], ['#7c3aed', 'Purple'], ['#be123c', 'Raspberry'], ['#a16207', 'Wheat gold']];
  function build(c) { return BUILDS[c.get('build')] || null; }
  function town(c) { return TOWNS[hv(c, 'town') % TOWNS.length]; }
  function color(c) { return c.get('color') || COLORS[0][0]; }
  function nameOf(c) { var b = build(c), n = String(c.get('bname') || '').trim(); return n || (b ? b.names[0] : 'My build'); }
  /* the student's real build: sizes in metres, the model's scale factor k */
  function job(c) {
    var b = build(c); if (!b) return null;
    var vi = hv(c, 'v' + c.get('build')) % b.V.length, V = b.V[vi];
    var J = { b: b, id: c.get('build'), vi: vi, L: V.L, W: V.W, H: V.H, k: V.k, town: town(c) };
    J.mL = r2(V.L * 100 * V.k); J.mW = r2(V.W * 100 * V.k); J.mH = r2(V.H * 100 * V.k); J.mF = r2(b.feat.real * 100 * V.k);
    return J;
  }
  function r2(x) { return Math.round(x * 100 + 1e-7) / 100; }

  /* ================= polygons (y up, counter-clockwise) ================= */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function rot(v, deg) { var c0 = Math.cos(deg * D2R), s0 = Math.sin(deg * D2R); return [v[0] * c0 - v[1] * s0, v[0] * s0 + v[1] * c0]; }
  function len(v) { return Math.hypot(v[0], v[1]); }
  function sides(P) { return P.map(function (p, i) { return len(sub(P[(i + 1) % P.length], p)); }); }
  function angles(P) {
    var n = P.length; return P.map(function (p, i) { var u = sub(P[(i + n - 1) % n], p), v = sub(P[(i + 1) % n], p); return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (len(u) * len(v))))) * R2D; });
  }
  function area2(P) { var s = 0; P.forEach(function (p, i) { var q = P[(i + 1) % P.length]; s += p[0] * q[1] - q[0] * p[1]; }); return s; }
  function convex(P) { var n = P.length; for (var i = 0; i < n; i++) { var a = P[i], b = P[(i + 1) % n], d = P[(i + 2) % n]; if ((b[0] - a[0]) * (d[1] - b[1]) - (b[1] - a[1]) * (d[0] - b[0]) <= 1e-9) return false; } return true; }
  function circInt(c1, r1_, c2, r2_) {
    var d = len(sub(c2, c1)); if (d > r1_ + r2_ || d < Math.abs(r1_ - r2_) || !d) return [];
    var a = (r1_ * r1_ - r2_ * r2_ + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1_ * r1_ - a * a)), ux = (c2[0] - c1[0]) / d, uy = (c2[1] - c1[1]) / d, mx = c1[0] + a * ux, my = c1[1] + a * uy;
    return [[mx - h * uy, my + h * ux], [mx + h * uy, my - h * ux]];
  }
  /* the logo shapes: side i goes from point i to point i + 1 */
  function houseP(w, h, r) { var a = Math.sqrt(r * r - w * w / 4); return [[0, 0], [w, 0], [w, h], [w / 2, h + a], [0, h]]; }
  function logoPts(kind, p) {
    if (kind === 'funbox') { var half = (p.b - p.t) / 2, ht = Math.sqrt(p.l * p.l - half * half); return [[0, 0], [p.b, 0], [p.b - half, ht], [half, ht]]; }
    var H = houseP(p.w, p.h, p.r);
    return kind === 'banner' ? H.map(function (q) { return [q[1], -q[0]]; }) : H; // the banner: the house turned a quarter clockwise (point to the right)
  }
  function logoTypes(kind) { return kind === 'funbox' ? ['bottom', 'leg', 'top', 'leg'] : ['bottom', 'wall', 'roof', 'roof', 'wall']; }
  function scaleP(p, k) { var o = {}; for (var q in p) o[q] = p[q] * k; return o; }
  /* same side lengths, different angles: turn the chain after side 0 by phi and close it up again (a "leaning" copy) */
  function flex(P, phi) {
    var n = P.length, L = sides(P), Q = [P[0], P[1]];
    for (var i = 1; i <= n - 3; i++) Q.push(add(Q[i], rot(sub(P[i + 1], P[i]), phi)));
    var cand = circInt(Q[n - 2], L[n - 2], P[0], L[n - 1]).map(function (x) { return Q.concat([x]); }).filter(function (R) { return area2(R) > 0 && convex(R); });
    return cand[0] || null;
  }
  /* the client's logo and the sign shop's 3 versions (one similar, one with equal angles but not every side in the same
     ratio, one with every side in the same ratio but different angles), lettered A–C in a seeded order */
  var KS = [1.5, 2, 2.5, 3];
  function logos(c) {
    var b = build(c); if (!b) return null;
    var LG = b.logo, p = LG.V[hv(c, 'logo' + c.get('build')) % LG.V.length], kind = LG.kind, types = logoTypes(kind);
    var ks = shuffled(KS, hv(c, 'ks')), kS = ks[0], kL = ks[1], kT = ks[2], mT = kT + (hv(c, 'mt') % 2 ? 0.5 : -0.5);
    var orig = mk(logoPts(kind, p), 'orig'), sim = mk(logoPts(kind, scaleP(p, kS)), 'sim');
    var sp = scaleP(p, kT); if (kind === 'funbox') { sp.b = (p.b + 2) * kT; sp.t = (p.t + 2) * kT; } else sp.h = p.h * mT;
    var str = mk(logoPts(kind, sp), 'stretch'), lean = null, phis = shuffled([-13, -10, 10, 13, -16, 16], hv(c, 'phi'));
    for (var i = 0; i < phis.length && !lean; i++) {
      var F = flex(logoPts(kind, scaleP(p, kL)), phis[i]); if (!F) continue;
      var dA = angles(F).map(function (a, j) { return Math.abs(a - orig.ang[j]); }), big = dA.filter(function (d) { return d >= 6; }).length;
      if (big >= 2) lean = mk(F, 'lean');
    }
    function mk(P, role) {
      var S = sides(P), A = angles(P), by = {};
      types.forEach(function (t, j) { if (by[t] == null) by[t] = r2(S[j]); });
      return { P: P, role: role, sides: S.map(r2), ang: A, angR: A.map(function (a) { return Math.round(a); }), by: by };
    }
    var order = shuffled(['sim', 'stretch', 'lean'], hv(c, 'order')), roles = { sim: sim, stretch: str, lean: lean }, vers = {};
    order.forEach(function (r, j) { var v = roles[r]; v.L = 'ABC'[j]; vers[v.L] = v; });
    LG.types.forEach(function (t) { ['A', 'B', 'C'].forEach(function (L) { vers[L].ratio = vers[L].ratio || {}; vers[L].ratio[t] = vers[L].by[t] / orig.by[t]; }); });
    return { kind: kind, LG: LG, p: p, orig: orig, vers: vers, order: order, letters: ['A', 'B', 'C'], kS: kS, kL: kL, kT: kT, mT: mT, simL: sim.L };
  }

  /* ================= drawings ================= */
  var UID = 0;
  function line(a, b, cls, extra) { return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"' + (cls ? ' class="' + cls + '"' : '') + (extra || '') + '/>'; }
  function txt(x, y, t, cls, extra) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" class="' + (cls || 'pj-u6-t') + '"' + (extra || '') + '>' + t + '</text>'; }
  function rect(x, y, w, h, cls, extra) { return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + Math.max(0, h).toFixed(1) + '"' + (cls ? ' class="' + cls + '"' : '') + (extra || '') + '/>'; }
  function polyStr(pts) { return pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  /* a dimension line between two screen points with its label (o: { off: px to the side, cls, vert }) */
  function dim(a, b, label, o) {
    o = o || {}; var off = o.off || 0, d = sub(b, a), L0 = len(d) || 1, n = [-d[1] / L0 * off, d[0] / L0 * off], A = add(a, n), B = add(b, n), u = [d[0] / L0, d[1] / L0], k = 7;
    var s = '<g class="pj-u6-dim' + (o.cls ? ' ' + o.cls : '') + '">';
    if (off) s += line(a, A, 'pj-u6-dimx') + line(b, B, 'pj-u6-dimx');
    s += line(A, B) + '<path d="M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + 'l' + (u[0] * k - u[1] * 4).toFixed(1) + ' ' + (u[1] * k + u[0] * 4).toFixed(1) + 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + 'l' + (u[0] * k + u[1] * 4).toFixed(1) + ' ' + (u[1] * k - u[0] * 4).toFixed(1) +
      'M' + B[0].toFixed(1) + ' ' + B[1].toFixed(1) + 'l' + (-u[0] * k - u[1] * 4).toFixed(1) + ' ' + (-u[1] * k + u[0] * 4).toFixed(1) + 'M' + B[0].toFixed(1) + ' ' + B[1].toFixed(1) + 'l' + (-u[0] * k + u[1] * 4).toFixed(1) + ' ' + (-u[1] * k - u[0] * 4).toFixed(1) + '"/>';
    var M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], vert = Math.abs(d[0]) < Math.abs(d[1]);
    if (vert) s += txt(M[0] + (o.left ? -6 : 6), M[1] + 4, label, 'pj-u6-dl', ' style="text-anchor:' + (o.left ? 'end' : 'start') + '"');
    else s += txt(M[0], M[1] + (o.below ? 16 : -6), label, 'pj-u6-dl');
    return s + '</g>';
  }
  function svgOpen(W, H, cls, aria) { return '<svg class="pj-u6-svg' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(H) + '" role="img" aria-label="' + esc(aria || '') + '">'; }
  function m(x) { return fx(x, 2) + ' m'; }
  function cm(x) { return fx(x, 2) + ' cm'; }

  /* ---- the real build, side view (and an end view) with its key sizes; o.model: sizes in cm on the model ---- */
  function buildSvg(J, o) {
    o = o || {}; var id = J.id, col = o.color || '#2563eb', L = J.L, W = J.W, H = J.H, lab = o.labels || { L: m(L), W: m(W), H: m(H) };
    if (id === 'skate') return skateSvg(J, o);
    var gx = 30, sc = Math.min(460 / L, 190 / H), base = 30 + H * sc, ew = W * sc, ex = gx + L * sc + 70, Wt = ex + ew + 60, Ht = base + 46;
    function X(x) { return gx + x * sc; } function Y(y) { return base - y * sc; }
    var s = svgOpen(Wt, Ht, 'pj-u6-build', o.aria || 'Your ' + J.b.what + ' with its real sizes');
    s += line([10, base], [Wt - 10, base], 'pj-u6-ground');
    if (id === 'tiny') {
      var deck = 0.6, eave = H - 0.55;
      s += rect(X(-0.1), Y(deck), L * sc + 0.2 * sc, 0.18 * sc, 'pj-u6-trailer');
      [L * 0.42, L * 0.58].forEach(function (x) { s += '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(0.33).toFixed(1) + '" r="' + (0.33 * sc).toFixed(1) + '" class="pj-u6-wheel"/>'; });
      s += line([X(-0.1), Y(deck - 0.05)], [X(-0.9), Y(0.35)], 'pj-u6-hitch');
      s += '<polygon points="' + polyStr([[X(0), Y(deck)], [X(L), Y(deck)], [X(L), Y(H)], [X(0), Y(eave)]]) + '" fill="' + esc(col) + '" class="pj-u6-body"/>';
      s += '<polygon points="' + polyStr([[X(-0.2), Y(eave - 0.04)], [X(L + 0.2), Y(H + 0.02)], [X(L + 0.2), Y(H - 0.18)], [X(-0.2), Y(eave - 0.24)]]) + '" class="pj-u6-roof"/>';
      s += rect(X(0.7), Y(deck + 2.0), 0.85 * sc, 2.0 * sc, 'pj-u6-door') + rect(X(L - 2.3), Y(deck + 2.1), 1.2 * sc, 1.0 * sc, 'pj-u6-win') + rect(X(L - 3.6), Y(H - 0.75), 1.2 * sc, 0.5 * sc, 'pj-u6-win');
      var s2 = '<polygon points="' + polyStr([[ex, Y(deck)], [ex + ew, Y(deck)], [ex + ew, Y(H)], [ex, Y(H)]]) + '" fill="' + esc(col) + '" class="pj-u6-body"/>' + rect(ex - 0.2 * sc, Y(H + 0.02), ew + 0.4 * sc, 0.2 * sc, 'pj-u6-roof');
      s += s2 + rect(ex + ew * 0.3, Y(deck + 1.9), ew * 0.4, 0.9 * sc, 'pj-u6-win') + rect(ex - 4, Y(deck), ew + 8, 0.16 * sc, 'pj-u6-trailer') + '<circle cx="' + (ex + ew / 2).toFixed(1) + '" cy="' + Y(0.33).toFixed(1) + '" r="' + (0.3 * sc).toFixed(1) + '" class="pj-u6-wheel"/>';
    } else { // truck
      var cab = 1.6, bodyL = L - cab, wh = 0.45;
      s += rect(X(0), Y(H), bodyL * sc, (H - wh) * sc, 'pj-u6-body', ' fill="' + esc(col) + '" rx="6"');
      s += '<path class="pj-u6-cab" d="M' + X(bodyL).toFixed(1) + ' ' + Y(wh).toFixed(1) + 'V' + Y(H * 0.72).toFixed(1) + 'H' + X(bodyL + cab * 0.55).toFixed(1) + 'L' + X(L).toFixed(1) + ' ' + Y(H * 0.42).toFixed(1) + 'V' + Y(wh).toFixed(1) + 'Z"/>';
      s += rect(X(bodyL + 0.15), Y(H * 0.68), cab * 0.45 * sc, H * 0.2 * sc, 'pj-u6-win');
      var wx = bodyL * 0.22; s += rect(X(wx), Y(wh + 2.2), J.b.feat.real * sc, 0.95 * sc, 'pj-u6-serve') + '<path class="pj-u6-awn" d="M' + X(wx - 0.1).toFixed(1) + ' ' + Y(wh + 2.35).toFixed(1) + 'h' + ((J.b.feat.real + 0.2) * sc).toFixed(1) + 'l' + (0.25 * sc).toFixed(1) + ' ' + (0.4 * sc).toFixed(1) + 'h' + (-(J.b.feat.real + 0.7) * sc).toFixed(1) + 'z"/>';
      [0.9, bodyL - 0.3, L - 0.8].forEach(function (x) { s += '<circle cx="' + X(x).toFixed(1) + '" cy="' + Y(0.42).toFixed(1) + '" r="' + (0.42 * sc).toFixed(1) + '" class="pj-u6-wheel"/>'; });
      s += rect(ex, Y(H), ew, (H - wh) * sc, 'pj-u6-body', ' fill="' + esc(col) + '" rx="6"') + rect(ex + ew * 0.18, Y(H * 0.72), ew * 0.64, H * 0.16 * sc, 'pj-u6-win');
      [ex + ew * 0.2, ex + ew * 0.8].forEach(function (x) { s += rect(x - 0.18 * sc, Y(wh), 0.36 * sc, wh * sc, 'pj-u6-tire'); });
    }
    if (o.dims !== false) {
      s += dim([X(0), base], [X(L), base], lab.L, { off: 22, below: true });
      s += dim([X(L) + 4, base], [X(L) + 4, Y(H)], lab.H, { off: 18 });
      s += dim([ex, base], [ex + ew, base], lab.W, { off: 22, below: true });
    }
    s += txt(gx + L * sc / 2, 18, 'SIDE VIEW', 'pj-u6-view') + txt(ex + ew / 2, 18, 'END VIEW', 'pj-u6-view');
    return s + '</svg>';
  }
  function skateSvg(J, o) {
    var L = J.L, W = J.W, H = J.H, col = o.color || '#2563eb', lab = o.labels || { L: m(L), W: m(W), H: m(H) }, sc = Math.min(430 / L, 230 / W), gx = 34, gy = 34;
    function X(x) { return gx + x * sc; } function Y(y) { return gy + y * sc; }
    var px = X(L) + 66, qs = 34, Wt = px + 3.4 * qs + 40, Ht = Math.max(Y(W) + 44, 170);
    var s = svgOpen(Wt, Ht, 'pj-u6-build', o.aria || 'Your skate park from above, with its real sizes');
    s += rect(X(0), Y(0), L * sc, W * sc, 'pj-u6-slab', ' rx="10"');
    s += rect(X(0), Y(0), 3 * sc, W * sc, 'pj-u6-qp', ' fill="' + esc(col) + '" rx="8"');
    s += rect(X(L * 0.42), Y(W * 0.32), 6 * sc, 4 * sc, 'pj-u6-fun', ' fill="' + esc(col) + '"') + rect(X(L * 0.42 + 1.4), Y(W * 0.32 + 1.2), 3.2 * sc, 1.6 * sc, 'pj-u6-funtop');
    s += line([X(L * 0.3), Y(W * 0.8)], [X(L * 0.3 + 6), Y(W * 0.8)], 'pj-u6-rail') + line([X(L * 0.62), Y(W * 0.12)], [X(L * 0.62 + 6), Y(W * 0.12)], 'pj-u6-rail');
    s += '<rect x="' + X(L * 0.72).toFixed(1) + '" y="' + Y(W * 0.48).toFixed(1) + '" width="' + (L * 0.22 * sc).toFixed(1) + '" height="' + (W * 0.38 * sc).toFixed(1) + '" rx="' + (W * 0.12 * sc).toFixed(1) + '" class="pj-u6-bowl"/>';
    if (o.dims !== false) { s += dim([X(0), Y(W)], [X(L), Y(W)], lab.L, { off: 18, below: true }); s += dim([X(L), Y(0)], [X(L), Y(W)], lab.W, { off: -16 }); }
    // the quarter pipe, side view
    var by = gy + 3.2 * qs, qx = px;
    s += txt(qx + 1.7 * qs, 18, 'QUARTER PIPE (SIDE)', 'pj-u6-view') + line([qx - 10, by], [qx + 3.4 * qs + 6, by], 'pj-u6-ground');
    s += '<path class="pj-u6-qpside" fill="' + esc(col) + '" d="M' + qx + ' ' + by + 'Q' + (qx + 2.2 * qs) + ' ' + by + ' ' + (qx + 2.4 * qs) + ' ' + (by - 2.4 * qs) + 'H' + (qx + 3 * qs) + 'V' + by + 'Z"/>';
    if (o.dims !== false) s += dim([qx + 3 * qs, by], [qx + 3 * qs, by - 2.4 * qs], lab.H, { off: 14 });
    s += txt(X(L / 2), 18, 'FROM ABOVE', 'pj-u6-view');
    return s + '</svg>';
  }
  /* Maya's grain elevator (the worked examples) */
  function elevatorSvg(o) {
    o = o || {}; var sc = 7, gx = 40, base = 196, s = svgOpen(330, 222, 'pj-u6-build pj-u6-exsvg', 'Maya’s grain elevator');
    function X(x) { return gx + x * sc; } function Y(y) { return base - y * sc; }
    s += line([10, base], [320, base], 'pj-u6-ground');
    s += rect(X(0), Y(20), 9 * sc, 20 * sc, 'pj-u6-elev') + '<path class="pj-u6-elevr" d="M' + X(-0.4) + ' ' + Y(20) + 'L' + X(4.5) + ' ' + Y(24) + 'L' + X(9.4) + ' ' + Y(20) + 'Z"/>';
    s += rect(X(9), Y(9), 10 * sc, 9 * sc, 'pj-u6-elev') + '<path class="pj-u6-elevr" d="M' + X(8.8) + ' ' + Y(9) + 'L' + X(19.4) + ' ' + Y(10.4) + 'V' + Y(9) + 'Z"/>';
    s += txt(X(4.5), Y(12), 'GRAIN', 'pj-u6-elevt') + rect(X(3.6), Y(2), 1.8 * sc, 2 * sc, 'pj-u6-door');
    if (o.dims !== false) { s += dim([X(0), base], [X(9), base], '9 m', { off: 16, below: true }); s += dim([X(0) - 4, base], [X(0) - 4, Y(24)], '24 m', { off: -16, left: true }); }
    return s + '</svg>';
  }

  /* ---- a labelled polygon (sides and angles). o: { w, h, pad, sides: labels | false, angles: labels | false, fill, cls, aria, star, names } ---- */
  function polySvg(P, o) {
    o = o || {}; var pad = o.pad == null ? 34 : o.pad, n = P.length;
    var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var sc = o.sc || Math.min(((o.w || 260) - 2 * pad) / (x1 - x0 || 1), ((o.h || 200) - 2 * pad) / (y1 - y0 || 1)), Wt = (x1 - x0) * sc + 2 * pad, Ht = (y1 - y0) * sc + 2 * pad;
    function S(p) { return [pad + (p[0] - x0) * sc, pad + (y1 - p[1]) * sc]; }
    var Q = P.map(S), s = svgOpen(Wt, Ht, 'pj-u6-poly' + (o.cls ? ' ' + o.cls : ''), o.aria || 'A polygon with its sides and angles');
    s += '<polygon points="' + polyStr(Q) + '" class="pj-u6-pf" fill="' + esc(o.fill || '#dbeafe') + '"/>';
    Q.forEach(function (q, i) {
      var pv = Q[(i + n - 1) % n], nx = Q[(i + 1) % n], u = sub(pv, q), v = sub(nx, q), lu = len(u), lv = len(v); u = [u[0] / lu, u[1] / lu]; v = [v[0] / lv, v[1] / lv];
      var bb = add(u, v), lb = len(bb) || 1; bb = [bb[0] / lb, bb[1] / lb];
      if (o.angles !== false) {
        var r = 13, a1 = Math.atan2(u[1], u[0]), a2 = Math.atan2(v[1], v[0]), st = add(q, [u[0] * r, u[1] * r]), en = add(q, [v[0] * r, v[1] * r]);
        var cr = u[0] * v[1] - u[1] * v[0]; void a1; void a2;
        var A = (o.angles || [])[i];
        if (A === 90 || A === '90°') s += '<path class="pj-u6-sq" d="M' + (q[0] + u[0] * 9).toFixed(1) + ' ' + (q[1] + u[1] * 9).toFixed(1) + 'l' + (v[0] * 9).toFixed(1) + ' ' + (v[1] * 9).toFixed(1) + 'l' + (-u[0] * 9).toFixed(1) + ' ' + (-u[1] * 9).toFixed(1) + '"/>';
        else if (A != null) s += '<path class="pj-u6-arc" d="M' + st[0].toFixed(1) + ' ' + st[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 0 ' + (cr > 0 ? 1 : 0) + ' ' + en[0].toFixed(1) + ' ' + en[1].toFixed(1) + '"/>';
        if (A != null) { var d0 = 27; s += txt(q[0] + bb[0] * d0, q[1] + bb[1] * d0 + 4, esc(String(A)) + (typeof A === 'number' ? '°' : ''), 'pj-u6-al'); }
      }
      if (o.star === i) s += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="5" class="pj-u6-star"/>';
      if (o.names) { var nn = o.names[i]; if (nn) s += txt(q[0] - bb[0] * 14, q[1] - bb[1] * 14 + 4, nn, 'pj-u6-vn'); }
      if (o.sides !== false && (o.sides || [])[i] != null) {
        var b2 = Q[(i + 1) % n], d = sub(b2, q), ld = len(d), nm = [-d[1] / ld, d[0] / ld], M = [(q[0] + b2[0]) / 2 + nm[0] * 8, (q[1] + b2[1]) / 2 + nm[1] * 8];
        var anc = nm[0] > 0.45 ? 'start' : nm[0] < -0.45 ? 'end' : 'middle';
        s += txt(M[0], M[1] + 4 + nm[1] * 8, esc(String(o.sides[i])), 'pj-u6-sl', ' style="text-anchor:' + anc + '"');
      }
    });
    return s + '</svg>';
  }
  function logoSvg(V, o) {
    o = o || {}; return polySvg(V.P, Object.assign({ sides: V.sides.map(function (x) { return fx(x, 2) + ' cm'; }), angles: V.angR, fill: o.fill }, o));
  }

  /* ---- the sun and the shadows; the mirror ---- */
  function shadowSvg(S0, o) {
    o = o || {}; var sc = o.sc || Math.min(330 / (S0.S + 4), 190 / S0.H), base = 34 + S0.H * sc, gx = 76, tx = gx;
    var psc = Math.max(sc, Math.min(90 / S0.p, 150 / S0.sp)), zoom = psc > sc * 1.3, px = tx + S0.S * sc + 80, Wt = px + S0.sp * psc + 60, Ht = base + 46;
    var lab = o.labels || {}, s = svgOpen(Wt, Ht, 'pj-u6-scene', o.aria || 'A tree and a pole with their shadows');
    s += '<circle cx="22" cy="22" r="13" class="pj-u6-sun"/>';
    s += rect(0, base, Wt, 46, 'pj-u6-grass');
    var ty = base - S0.H * sc;
    s += '<polygon points="' + polyStr([[tx, ty], [tx + S0.S * sc, base], [tx, base]]) + '" class="pj-u6-tri"/>';
    s += line([tx, base], [tx + S0.S * sc, base], 'pj-u6-shadow') + line([tx, ty], [tx + S0.S * sc, base], 'pj-u6-ray');
    s += rect(tx - 4, base - S0.H * sc * 0.35, 8, S0.H * sc * 0.35, 'pj-u6-trunk') + '<path class="pj-u6-crown" d="M' + tx + ' ' + ty.toFixed(1) + 'L' + (tx + S0.H * sc * 0.16).toFixed(1) + ' ' + (base - S0.H * sc * 0.3).toFixed(1) + 'H' + (tx - S0.H * sc * 0.16).toFixed(1) + 'Z"/>';
    var pt = base - S0.p * psc;
    s += '<polygon points="' + polyStr([[px, pt], [px + S0.sp * psc, base], [px, base]]) + '" class="pj-u6-tri"/>';
    s += line([px, base], [px + S0.sp * psc, base], 'pj-u6-shadow') + line([px, pt], [px + S0.sp * psc, base], 'pj-u6-ray') + line([px, base], [px, pt], 'pj-u6-pole');
    s += '<path class="pj-u6-sq" d="M' + (tx + 8) + ' ' + base + 'v-8h-8"/>' + '<path class="pj-u6-sq" d="M' + (px + 8) + ' ' + base + 'v-8h-8"/>';
    s += dim([tx, base], [tx + S0.S * sc, base], lab.S || m(S0.S), { off: 16, below: true }) + dim([px, base], [px + S0.sp * psc, base], lab.sp || m(S0.sp), { off: 16, below: true });
    s += dim([tx - 18, base], [tx - 18, ty], lab.H || '?', { left: true, cls: lab.H === '?' || !lab.H ? 'ask' : '' }) + dim([px - 8, base], [px - 8, pt], lab.p || m(S0.p), { left: true });
    if (zoom) s += txt(px + S0.sp * psc / 2, pt - 12, 'pole (drawn bigger)', 'pj-u6-small');
    s += txt(tx + S0.S * sc * 0.55 + 8, ty + (base - ty) * 0.42, 'sun ray', 'pj-u6-small', ' style="text-anchor:start"');
    return s + '</svg>';
  }
  function mirrorSvg(M0, o) {
    o = o || {}; var tot = M0.d1 + M0.d2, sc = Math.min(430 / (tot + 1), 210 / M0.P), base = 34 + M0.P * sc, gx = 110, Wt = gx + (tot + 1) * sc + 50, Ht = base + 66;
    var lab = o.labels || {}, s = svgOpen(Wt, Ht, 'pj-u6-scene', o.aria || 'You, a mirror on the ground and a light pole');
    function X(x) { return gx + x * sc; }
    s += rect(0, base, Wt, 66, 'pj-u6-grass');
    var ex = X(0), ey = base - M0.e * sc, mx = X(M0.d1), pxx = X(tot), py = base - M0.P * sc;
    s += '<polygon points="' + polyStr([[ex, ey], [mx, base], [ex, base]]) + '" class="pj-u6-tri"/><polygon points="' + polyStr([[pxx, py], [mx, base], [pxx, base]]) + '" class="pj-u6-tri"/>';
    s += line([pxx, py], [mx, base], 'pj-u6-ray') + line([mx, base], [ex, ey], 'pj-u6-ray');
    // the person
    var hh = (M0.F || M0.e + 0.12) * sc; s += '<g class="pj-u6-person"><circle cx="' + (ex - 2).toFixed(1) + '" cy="' + (base - hh + 7).toFixed(1) + '" r="7"/><path d="M' + (ex - 2).toFixed(1) + ' ' + (base - hh + 14).toFixed(1) + 'V' + (base - hh * 0.45).toFixed(1) + 'M' + (ex - 2).toFixed(1) + ' ' + (base - hh * 0.45).toFixed(1) + 'l-6 ' + (hh * 0.45).toFixed(1) + 'M' + (ex - 2).toFixed(1) + ' ' + (base - hh * 0.45).toFixed(1) + 'l5 ' + (hh * 0.45).toFixed(1) + 'M' + (ex - 2).toFixed(1) + ' ' + (base - hh * 0.75).toFixed(1) + 'l9 6"/></g>';
    s += '<circle cx="' + ex.toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="3" class="pj-u6-eye"/>';
    s += rect(mx - 10, base - 3, 20, 4, 'pj-u6-mirror');
    s += line([pxx, base], [pxx, py], 'pj-u6-lpole') + '<path class="pj-u6-lamp" d="M' + pxx + ' ' + py.toFixed(1) + 'h-16l-4 6h22z"/>';
    s += dim([ex, base], [mx, base], lab.d1 || m(M0.d1), { off: 18, below: true }) + dim([mx, base], [pxx, base], lab.d2 || m(M0.d2), { off: 18, below: true });
    s += dim([ex - 24, base], [ex - 24, ey], lab.e || 'eyes ' + m(M0.e), { left: true });
    s += dim([pxx + 8, base], [pxx + 8, py], lab.P || '?', { cls: !lab.P || lab.P === '?' ? 'ask' : '' });
    s += txt(mx, base + 56, 'mirror', 'pj-u6-small');
    return s + '</svg>';
  }

  /* ================= the drawing grid (checkpoint 4) ================= */
  var GW = 24, GH = 16;
  function shapeOf(c) { var b = build(c); if (!b) return null; var D = b.draws[hv(c, 'draw' + c.get('build')) % b.draws.length], P = D.pts; return { D: D, P: P, n: P.length, w: Math.max.apply(null, P.map(function (p) { return p[0]; })) - Math.min.apply(null, P.map(function (p) { return p[0]; })), h: Math.max.apply(null, P.map(function (p) { return p[1]; })) - Math.min.apply(null, P.map(function (p) { return p[1]; })), ang: angles(P).map(function (a) { return Math.round(a); }) }; }
  var DK = ['0.5', '1.5', '2', '2.5'];
  function drawPts(c) { var a = []; try { a = JSON.parse(c.get('draw') || '[]'); } catch (e) { a = []; } return Array.isArray(a) ? a.filter(function (p) { return Array.isArray(p) && p.length === 2 && isFinite(p[0]) && isFinite(p[1]); }) : []; }
  function moveTxt(v) { var o = []; if (v[0]) o.push((v[0] > 0 ? 'right ' : 'left ') + fx(Math.abs(v[0]), 1)); if (v[1]) o.push((v[1] > 0 ? 'up ' : 'down ') + fx(Math.abs(v[1]), 1)); return o.join(', ') || 'nowhere'; }
  /* does Q match P scaled by f (any starting corner, either direction)? → { shift, rev } | null */
  function matchScale(P, Q, f) {
    var n = P.length; if (Q.length !== n) return null;
    for (var rev = 0; rev < 2; rev++) for (var sh = 0; sh < n; sh++) {
      var R = []; for (var i = 0; i < n; i++) R.push(Q[rev ? (sh - i + 2 * n) % n : (sh + i) % n]);
      var ok = true; for (var j = 1; j < n && ok; j++) { var dp = sub(P[j], P[0]), dq = sub(R[j], R[0]); if (Math.abs(dq[0] - f * dp[0]) > 1e-6 || Math.abs(dq[1] - f * dp[1]) > 1e-6) ok = false; }
      if (ok) return { shift: sh, rev: rev, R: R };
    }
    return null;
  }
  function bbox(P) { var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; }); return { w: Math.max.apply(null, xs) - Math.min.apply(null, xs), h: Math.max.apply(null, ys) - Math.min.apply(null, ys) }; }
  /* the checker for the drawing: right when it is the original × k; otherwise a hint about the first thing that's off */
  function drawRes(c, Sh, k) {
    var Q = drawPts(c), P = Sh.P, n = P.length, base = { label: 'Your drawing', graded: true };
    if (!Q.length) return R0('draw', false, Object.assign(base, { blank: true }));
    if (Q.length < n) return R0('draw', false, Object.assign(base, { hint: 'Your shape needs <b>' + n + ' corners</b>, like the original. You have placed ' + Q.length + '.' }));
    if (matchScale(P, Q, k)) return R0('draw', true, base);
    var h = '', f = Sh.w ? bbox(Q).w / Sh.w : 0, bb = bbox(Q);
    if (matchScale(P, Q, 1 / k)) h = 'Your shape is similar, but with scale factor ' + fx(1 / k, 2) + ' — that’s k upside down. For k = ' + fx(k, 2) + ', every length is <b>' + fx(k, 2) + ' ×</b> the original' + (k > 1 ? ', so your drawing should be <b>bigger</b>.' : ', so your drawing should be <b>smaller</b>.');
    else if (matchScale(P, Q, 1)) h = 'That’s the same size as the original (k = 1). Multiply every length by <b>' + fx(k, 2) + '</b>.';
    else if (f > 0 && matchScale(P, Q, f)) h = 'Your shape is similar, but its scale factor is ' + fx(f, 2) + ', not ' + fx(k, 2) + '. Multiply every move by ' + fx(k, 2) + '.';
    else if (bb.w - Sh.w === bb.h - Sh.h && bb.w !== Sh.w && Math.abs(bb.w / Sh.w - k) > 1e-6) h = 'It looks like you <b>added</b> ' + (bb.w - Sh.w) + ' squares to the width and the height. Similar shapes <b>multiply</b> every length by k: the width should be ' + Sh.w + ' × ' + fx(k, 2) + ' = ' + fx(Sh.w * k, 1) + ' squares.';
    else if (matchScale(P, Q.map(function (q) { return [-q[0], q[1]]; }), k)) h = 'Right size — but your shape is <b>flipped</b> (a mirror image). Draw it the same way round as the original.';
    else {
      // line it up corner for corner (the way that matches most sides) and name the first side that's off
      var best = null; for (var rev = 0; rev < 2; rev++) for (var sh = 0; sh < n; sh++) {
        var R = []; for (var i = 0; i < n; i++) R.push(Q[rev ? (sh - i + 2 * n) % n : (sh + i) % n]);
        var good = 0, first = -1; for (var j = 0; j < n; j++) { var dp = sub(P[(j + 1) % n], P[j]), dq = sub(R[(j + 1) % n], R[j]); if (Math.abs(dq[0] - k * dp[0]) < 1e-6 && Math.abs(dq[1] - k * dp[1]) < 1e-6) good++; else if (first < 0) first = j; }
        if (!best || good > best.good) best = { good: good, first: first, R: R };
      }
      var j0 = best.first, dp0 = sub(P[(j0 + 1) % n], P[j0]), dq0 = sub(best.R[(j0 + 1) % n], best.R[j0]), NM = 'ABCDEFGH';
      h = 'Check side <b>' + NM[j0] + '′' + NM[(j0 + 1) % n] + '′</b>: on the original it goes ' + moveTxt(dp0) + ', so yours should go <b>' + moveTxt([dp0[0] * k, dp0[1] * k]) + '</b> (× ' + fx(k, 2) + '). Yours goes ' + moveTxt(dq0) + '.';
    }
    return R0('draw', false, Object.assign(base, { hint: h, hint2: 'Start at A′ and multiply every move by ' + fx(k, 2) + ': ' + P.map(function (p, i) { return NM2(i) + '→' + NM2((i + 1) % n) + ' ' + moveTxt([(P[(i + 1) % n][0] - p[0]) * k, (P[(i + 1) % n][1] - p[1]) * k]); }).join('; ') + '.' }));
  }
  function NM2(i) { return 'ABCDEFGH'[i] + '′'; }
  function gridSvg(cols, rows, S, o) {
    o = o || {}; var pad = o.pad == null ? 16 : o.pad, Wt = cols * S + 2 * pad, Ht = rows * S + 2 * pad, s = '';
    for (var i = 0; i <= cols; i++) s += line([pad + i * S, pad], [pad + i * S, pad + rows * S], 'pj-u6-gl' + (o.major && i % o.major === 0 ? ' mj' : ''));
    for (var j = 0; j <= rows; j++) s += line([pad, pad + j * S], [pad + cols * S, pad + j * S], 'pj-u6-gl' + (o.major && j % o.major === 0 ? ' mj' : ''));
    return { s: s, W: Wt, H: Ht, X: function (x) { return pad + x * S; }, Y: function (y) { return pad + (rows - y) * S; } };
  }
  /* the original shape on its own small grid (letters A, B, C …; the ★ corner shows its angle) */
  function origSvg(Sh, o) {
    o = o || {}; var S = o.S || 26, cols = Sh.w + 2, rows = Sh.h + 2, G = gridSvg(cols, rows, S, { pad: 18 });
    var mnx = Math.min.apply(null, Sh.P.map(function (p) { return p[0]; })), mny = Math.min.apply(null, Sh.P.map(function (p) { return p[1]; }));
    var Q = Sh.P.map(function (p) { return [G.X(p[0] - mnx + 1), G.Y(p[1] - mny + 1)]; }), s = svgOpen(G.W, G.H, 'pj-u6-orig', 'The original ' + Sh.D.name + ' on a grid') + G.s;
    s += '<polygon points="' + polyStr(Q) + '" class="pj-u6-shape"' + (o.fill ? ' style="fill:' + esc(o.fill) + '"' : '') + '/>';
    var n = Q.length;
    Q.forEach(function (q, i) {
      var pv = Q[(i + n - 1) % n], nx = Q[(i + 1) % n], u = sub(pv, q), v = sub(nx, q), lu = len(u), lv = len(v), bb = add([u[0] / lu, u[1] / lu], [v[0] / lv, v[1] / lv]), lb = len(bb) || 1; bb = [bb[0] / lb, bb[1] / lb];
      s += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="4" class="pj-u6-vx"/>' + txt(q[0] - bb[0] * 13, q[1] - bb[1] * 13 + 5, 'ABCDEFGH'[i], 'pj-u6-vn');
      if (o.star !== false && i === Sh.D.star) s += txt(q[0] + bb[0] * 24, q[1] + bb[1] * 24 + 5, Sh.ang[i] + '°', 'pj-u6-al');
    });
    return s + '</svg>';
  }
  /* the student's grid: tap grid points to place A′, B′, C′ … */
  function drawTool(c, Sh) {
    var S = 30, G = gridSvg(GW, GH, S, { pad: 18, major: 5 }), w = el('div', 'pj-u6-drawtool'); w.dataset.f = 'draw'; w.dataset.inline = '0';
    var board = el('div', 'pj-u6-board'), bar = el('div', 'pj-u6-dbar'), status = el('div', 'pj-u6-status');
    function draw() {
      var Q = drawPts(c), n = Sh.n, s = svgOpen(G.W, G.H, 'pj-u6-grid', 'Your drawing grid: tap a grid point to place the next corner') + '<rect class="pj-u6-paper" x="0" y="0" width="' + G.W + '" height="' + G.H + '"/>' + G.s;
      for (var i = 0; i <= GW; i += 5) s += txt(G.X(i), G.H - 3, String(i), 'pj-u6-axis');
      if (Q.length) {
        var pts = Q.map(function (p) { return [G.X(p[0]), G.Y(p[1])]; });
        if (Q.length >= n) s += '<polygon points="' + polyStr(pts) + '" class="pj-u6-shape mine" style="fill:' + esc(color(c)) + '55"/>';
        else s += '<polyline points="' + polyStr(pts) + '" class="pj-u6-open"/>';
        var cx0 = pts.reduce(function (a, q) { return a + q[0]; }, 0) / pts.length, cy0 = pts.reduce(function (a, q) { return a + q[1]; }, 0) / pts.length;
        pts.forEach(function (q, i) { var dx = q[0] - cx0, dy = q[1] - cy0, dl = Math.hypot(dx, dy) || 1; if (pts.length < 2) { dx = 1; dy = -1; dl = 1.4; } s += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="6" class="pj-u6-vx mine"/>' + txt(q[0] + dx / dl * 17, q[1] + dy / dl * 17 + 5, NM2(i), 'pj-u6-vn'); });
      }
      s += '<g class="pj-u6-hits">'; if (!c.ro && Q.length < n) for (var x = 0; x <= GW; x++) for (var y = 0; y <= GH; y++) s += '<circle class="pj-u6-hit" data-x="' + x + '" data-y="' + y + '" cx="' + G.X(x) + '" cy="' + G.Y(y) + '" r="' + (S * 0.45) + '"/>';
      s += '</g></svg>';
      board.innerHTML = s;
      status.className = 'pj-u6-status' + (Q.length >= n ? ' good' : '');
      status.innerHTML = Q.length >= n ? '✓ All ' + n + ' corners placed. Press <b>Check my work</b> — or Undo to move one.' : 'Tap the grid to place corner <b>' + NM2(Q.length) + '</b> (' + (n - Q.length) + ' to go).';
    }
    if (!c.ro) {
      board.addEventListener('click', function (e) {
        var t = e.target; if (!t || !t.getAttribute || t.getAttribute('data-x') == null) return;
        var Q = drawPts(c); if (Q.length >= Sh.n) return; var p = [Number(t.getAttribute('data-x')), Number(t.getAttribute('data-y'))];
        if (Q.some(function (q) { return q[0] === p[0] && q[1] === p[1]; })) { status.className = 'pj-u6-status miss'; status.textContent = 'There’s already a corner there.'; return; }
        Q.push(p); c.set('draw', JSON.stringify(Q)); draw();
      });
      var un = el('button', 'btn btn-ghost btn-small pj-u6-undo', '↶ Undo'); un.type = 'button'; un.addEventListener('click', function () { var Q = drawPts(c); Q.pop(); c.set('draw', Q.length ? JSON.stringify(Q) : ''); draw(); });
      var cl = el('button', 'btn btn-ghost btn-small pj-u6-clear', 'Clear'); cl.type = 'button'; cl.addEventListener('click', function () { c.set('draw', ''); draw(); });
      bar.appendChild(un); bar.appendChild(cl); bar.appendChild(el('span', 'pj-u6-dtip', '1 square = 1 unit · corners snap to grid points'));
    }
    draw(); w.appendChild(board); if (!c.ro) w.appendChild(bar); w.appendChild(status);
    return w;
  }

  /* ================= the floor plan (checkpoint 5) ================= */
  var PAGE = { W: 24, H: 16, M: 1 };
  function scaleTxt(s) { return '1 cm represents ' + (s < 1 ? fx(s * 100, 1) + ' cm' : fx(s, 2) + ' m'); }
  function scaleOf(c) { var x = Number(c.get('pscale')); return x > 0 ? x : null; }
  function fits(J, s) { return J.L / s <= PAGE.W - 2 * PAGE.M + 1e-9 && J.W / s <= PAGE.H - 2 * PAGE.M + 1e-9; }
  function pieceSize(c, it) { var a = pn(c.get('i' + it.id + 'L')), b = pn(c.get('i' + it.id + 'W')); return a > 0.1 && b > 0.1 && a < 30 && b < 20 ? [a, b] : null; }
  function placeOf(c) { var o = {}; try { o = JSON.parse(c.get('place') || '{}') || {}; } catch (e) { o = {}; } return o; }
  /* where the pieces are: centres in cm from the plan's top-left corner, and what's wrong with it */
  function placeState(c, J, s) {
    var P = placeOf(c), out = { list: [], bad: '' }, fl = { x: 0, y: 0, w: J.L / s, h: J.W / s };
    J.b.items.forEach(function (it) {
      var z = pieceSize(c, it), q = P[it.id];
      if (!z || !q) { out.list.push(null); return; }
      var r = { it: it, cx: q[0], cy: q[1], w: z[0], h: z[1], x0: q[0] - z[0] / 2, y0: q[1] - z[1] / 2 }; out.list.push(r);
      if (r.x0 < fl.x - 0.06 || r.y0 < fl.y - 0.06 || r.x0 + r.w > fl.w + 0.06 || r.y0 + r.h > fl.h + 0.06) out.bad = out.bad || 'out'; // (a typed size can be rounded)
    });
    var a = out.list[0], b = out.list[1];
    if (!a || !b) out.bad = 'missing';
    else if (a.x0 < b.x0 + b.w - 1e-6 && b.x0 < a.x0 + a.w - 1e-6 && a.y0 < b.y0 + b.h - 1e-6 && b.y0 < a.y0 + a.h - 1e-6) out.bad = out.bad || 'overlap';
    out.d = a && b ? Math.abs(a.cx - b.cx) : null;
    if (!out.bad && out.d < 0.999) out.bad = 'close';
    return out;
  }
  function planTool(c, J, s, opt) {
    opt = opt || {};
    var S = 30, pad = 22, Wt = PAGE.W * S + 2 * pad, tray = 3.6, Ht = (PAGE.H + tray) * S + 2 * pad + 10, ox = pad + PAGE.M * S, oy = pad + PAGE.M * S;
    var w = el('div', 'pj-u6-plantool'); w.dataset.f = 'place'; w.dataset.inline = '0';
    var board = el('div', 'pj-u6-board'), status = el('div', 'pj-u6-status'), drag = null, svg = null;
    function X(x) { return ox + x * S; } function Y(y) { return oy + y * S; }
    function draw() {
      var L = J.L / s, W = J.W / s, P = placeOf(c), st = placeState(c, J, s), html = svgOpen(Wt, Ht, 'pj-u6-plan', 'Your floor plan on cm grid paper: drag the pieces onto it');
      html += rect(pad, pad, PAGE.W * S, PAGE.H * S, 'pj-u6-page');
      for (var i = 0; i <= PAGE.W; i++) html += line([pad + i * S, pad], [pad + i * S, pad + PAGE.H * S], 'pj-u6-gl' + (i % 5 === 0 ? ' mj' : ''));
      for (var j = 0; j <= PAGE.H; j++) html += line([pad, pad + j * S], [pad + PAGE.W * S, pad + j * S], 'pj-u6-gl' + (j % 5 === 0 ? ' mj' : ''));
      for (var t = 0; t <= PAGE.W; t += 2) html += txt(pad + t * S, pad - 6, String(t), 'pj-u6-axis');
      html += txt(pad + PAGE.W * S, pad - 6, '  cm', 'pj-u6-axis', ' style="text-anchor:start"');
      html += '<rect x="' + X(0).toFixed(1) + '" y="' + Y(0).toFixed(1) + '" width="' + (L * S).toFixed(1) + '" height="' + (W * S).toFixed(1) + '" class="pj-u6-floor" style="stroke:' + esc(color(c)) + '"/>';
      html += txt(X(L / 2), Y(W) + 18, esc(nameOf(c)) + ' · ' + esc(scaleTxt(s)), 'pj-u6-plab');
      html += rect(pad, pad + PAGE.H * S + 10, PAGE.W * S, tray * S, 'pj-u6-tray', ' rx="10"') + txt(pad + 10, pad + PAGE.H * S + 28, 'PIECES (drag them onto the plan)', 'pj-u6-small', ' style="text-anchor:start"');
      J.b.items.forEach(function (it, n) {
        var z = pieceSize(c, it); if (!z) { html += txt(pad + 14 + n * 9 * S, pad + PAGE.H * S + 10 + tray * S * 0.62, esc(it.name) + ': type its plan size first', 'pj-u6-small', ' style="text-anchor:start"'); return; }
        var q = P[it.id], cx = q ? X(q[0]) : pad + 3 * S + n * 9 * S + z[0] * S / 2, cy = q ? Y(q[1]) : pad + PAGE.H * S + 10 + tray * S * 0.62;
        html += '<g class="pj-u6-piece' + (q ? ' on' : '') + '" data-id="' + it.id + '" tabindex="0" role="button" aria-label="' + esc(it.name) + ' piece. Drag it, or use the arrow keys."><rect x="' + (cx - z[0] * S / 2).toFixed(1) + '" y="' + (cy - z[1] * S / 2).toFixed(1) + '" width="' + (z[0] * S).toFixed(1) + '" height="' + (z[1] * S).toFixed(1) + '" rx="3" fill="' + it.col + '"/>' +
          line([cx, cy - z[1] * S / 2 - (q ? 5 : 0)], [cx, cy + z[1] * S / 2 + (q ? 5 : 0)], 'pj-u6-cline') + txt(cx, cy + 4, esc(it.name), 'pj-u6-pn') + '</g>';
      });
      if (st.list[0] && st.list[1] && !st.bad) { var a = st.list[0], b = st.list[1], yy = Y(Math.max(a.y0 + a.h, b.y0 + b.h)) + 14; void yy; }
      html += '</svg>';
      board.innerHTML = html; svg = board.querySelector('svg');
      var msg = { missing: 'Drag both pieces onto the plan.', out: 'Keep each piece <b>' + esc(J.b.inside) + '</b> (inside the outline).', overlap: 'The pieces overlap. Move one.', close: 'Leave at least 1 cm between the two dashed centre lines so you can measure it.' }[st.bad];
      status.className = 'pj-u6-status' + (st.bad ? (st.bad === 'missing' ? '' : ' miss') : ' good');
      status.innerHTML = st.bad ? msg : '✓ Both pieces are on the plan. Measure between the dashed centre lines.';
      if (opt.onDraw) opt.onDraw();
    }
    function pt(e) { var mm = svg.getScreenCTM(); if (!mm) return null; var q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; return q.matrixTransform(mm.inverse()); }
    function snap(v) { return Math.round(v * 2) / 2; }
    function put(id, x, y) { var P = placeOf(c); P[id] = [snap(x), snap(y)]; c.set('place', JSON.stringify(P)); }
    if (!c.ro && hasDoc) {
      board.addEventListener('pointerdown', function (e) {
        var g = e.target.closest && e.target.closest('.pj-u6-piece'); if (!g) return; var q = pt(e); if (!q) return; e.preventDefault();
        var r = g.querySelector('rect'), cx = Number(r.getAttribute('x')) + Number(r.getAttribute('width')) / 2, cy = Number(r.getAttribute('y')) + Number(r.getAttribute('height')) / 2;
        drag = { id: g.getAttribute('data-id'), g: g, dx: q.x - cx, dy: q.y - cy, sx: cx, sy: cy }; g.classList.add('drag');
        try { board.setPointerCapture(e.pointerId); } catch (x) {}
      });
      board.addEventListener('pointermove', function (e) {
        if (!drag) return; var q = pt(e); if (!q) return; e.preventDefault();
        var cx = (q.x - drag.dx - ox) / S, cy = (q.y - drag.dy - oy) / S, tx = (ox + snap(cx) * S) - drag.sx, ty = (oy + snap(cy) * S) - drag.sy;
        drag.g.setAttribute('transform', 'translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')'); drag.cx = snap(cx); drag.cy = snap(cy);
      });
      function end() { if (!drag) return; var d0 = drag; drag = null; if (d0.cx != null) { if (d0.cy > PAGE.H - PAGE.M) { var P = placeOf(c); delete P[d0.id]; c.set('place', Object.keys(P).length ? JSON.stringify(P) : ''); } else put(d0.id, d0.cx, d0.cy); } draw(); }
      board.addEventListener('pointerup', end); board.addEventListener('pointercancel', end);
      board.addEventListener('keydown', function (e) {
        var g = e.target.closest && e.target.closest('.pj-u6-piece'); if (!g) return; var id = g.getAttribute('data-id'), P = placeOf(c), q = P[id] || [J.L / s / 2, J.W / s / 2], d = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, -0.5], ArrowDown: [0, 0.5] }[e.key];
        if (!d) return; e.preventDefault(); put(id, q[0] + d[0], q[1] + d[1]); draw(); var g2 = board.querySelector('.pj-u6-piece[data-id="' + id + '"]'); if (g2) g2.focus();
      });
    }
    draw(); w.appendChild(board); w.appendChild(status);
    w.redraw = draw;
    return w;
  }
  /* a small read-only plan (for the card) */
  function miniPlan(c, J, s) {
    var L = J.L / s, W = J.W / s, S = Math.min(300 / L, 150 / W), pad = 12, P = placeOf(c), st = placeState(c, J, s);
    var h = svgOpen(L * S + 2 * pad, W * S + 2 * pad + 30, 'pj-u6-mini', 'The floor plan');
    h += '<rect x="' + pad + '" y="' + pad + '" width="' + (L * S).toFixed(1) + '" height="' + (W * S).toFixed(1) + '" class="pj-u6-floor" style="stroke:' + esc(color(c)) + '"/>';
    st.list.forEach(function (r) { if (r) h += rect(pad + r.x0 * S, pad + r.y0 * S, r.w * S, r.h * S, '', ' rx="2" fill="' + r.it.col + '"') + txt(pad + r.cx * S, pad + r.cy * S + 4, esc(r.it.name), 'pj-u6-pn sm'); });
    if (st.d != null && !st.bad) { var y = pad + W * S + 12, a = pad + st.list[0].cx * S, b = pad + st.list[1].cx * S; h += dim([Math.min(a, b), y], [Math.max(a, b), y], fx(mine(c, 'rd', st.d * s), 2) + ' m (real)', { below: true }); }
    void P;
    return h + '</svg>';
  }

  /* ================= checkpoint 6: shadows and the mirror ================= */
  var SHAD = [[2.0, 1.6, 14.4], [2.0, 1.6, 12.0], [1.5, 2.0, 20.0], [1.5, 2.0, 24.0], [1.2, 0.8, 14.0], [1.2, 0.8, 11.0], [2.0, 2.5, 20.0], [2.0, 2.5, 25.0], [1.5, 1.2, 16.0], [1.0, 0.8, 17.6]];
  var MIRR = [[1.5, 1.2, 6.0], [1.6, 2.0, 10.0], [1.6, 1.5, 7.5], [1.55, 1.0, 5.0], [1.65, 1.5, 6.0], [1.5, 2.0, 12.0], [1.6, 1.2, 6.0], [1.45, 1.0, 5.2]];
  function site(c) {
    var b = build(c); if (!b) return null;
    var sh = SHAD[hv(c, 'shad') % SHAD.length], mr = MIRR[hv(c, 'mirr') % MIRR.length];
    var S0 = { p: sh[0], sp: sh[1], S: sh[2], H: r2(sh[0] * sh[2] / sh[1]) }, M0 = { e: mr[0], F: r2(mr[0] + 0.12), d1: mr[1], d2: mr[2], P: r2(mr[0] * mr[2] / mr[1]) };
    return { S: S0, M: M0, T: b.site.T[hv(c, 'tdist') % b.site.T.length], b: b };
  }
  var WHY_SH = [{ v: 'aa', html: 'Both have a <b>right angle</b>, and the sun’s rays hit the ground at the <b>same angle</b>: two pairs of equal angles (AA)' }, { v: 'shadow', html: 'The two shadows are the same length' }, { v: 'any', html: 'All right triangles are similar' }, { v: 'tall', html: 'The tree and the pole are both standing up' }];
  var WHY_MI = [{ v: 'aa', html: '<b>Angle in = angle out</b> at the mirror, and both triangles have a <b>right angle</b> (AA)' }, { v: 'mid', html: 'The mirror is halfway between you and the pole' }, { v: 'same', html: 'You and the pole are the same height' }];
  var SETS = [{ v: 'ok', html: '<span class="pj-u6-frac"><i>tree</i><i>tree’s shadow</i></span> = <span class="pj-u6-frac"><i>pole</i><i>pole’s shadow</i></span>' }, { v: 'mix', html: '<span class="pj-u6-frac"><i>tree</i><i>pole’s shadow</i></span> = <span class="pj-u6-frac"><i>pole</i><i>tree’s shadow</i></span>' }, { v: 'flip', html: '<span class="pj-u6-frac"><i>tree</i><i>tree’s shadow</i></span> = <span class="pj-u6-frac"><i>pole’s shadow</i><i>pole</i></span>' }];

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub0) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub0 ? '<p>' + sub0 + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function inN(c, k, o) { o = o || {}; var w = c.input(k, { kind: 'num', ph: o.ph || '', aria: o.aria || k, cls: 'pj-u6-in' + (o.wide ? ' wide' : ''), onInput: o.onInput }); if (o.pre) w.insertBefore(el('span', 'pj-pre', o.pre), w.firstChild); if (o.unit) w.appendChild(el('span', 'pj-post', o.unit)); return w; }
  function grid(box, cls) { var g = el('div', 'pj-grid3 pj-u6-row' + (cls ? ' ' + cls : '')); box.appendChild(g); return g; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function chip(h) { return '<div class="pj-x-chip">' + h + '</div>'; }
  function eq(left, right, unit, o) { o = o || {}; return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="num"' + (o.delay ? ' data-delay="' + o.delay + '"' : '') + '>' + fx(right, 4) + '</span>' + (unit || '') + '</b></div>'; }
  function tip(h) { return el('p', 'pj-tip', h); }
  function draw0(html, cls) { return el('div', 'pj-u6-draw' + (cls ? ' ' + cls : ''), html); }
  function frac(a, b) { return '<span class="pj-u6-frac"><i>' + a + '</i><i>' + b + '</i></span>'; }

  /* the project's icon: a house and a similar, smaller copy sharing a corner (a projection line through both peaks) */
  var ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 44V24L24 8l18 16v20z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M6 44v-9l8.1-7.2 8.1 7.2v9z" fill="currentColor"/><path d="M6 44L24 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2.4 2.6" stroke-linecap="round"/><circle cx="6" cy="44" r="2.6" fill="currentColor"/></svg>';

  /* ================= Checkpoint 1: the job — pick the build, name it ================= */
  var cp1 = {
    id: 'job', title: 'Take the job', needs: [], graded: false,
    goal: 'Pick what you’ll build a <b>scale model</b> and <b>plan</b> of, give it a <b>name</b>, and choose your colour. Every builder gets their own sizes, so your numbers won’t match a friend’s.',
    example: { title: 'Maya takes a job at Prairie Scale Models', scene: '<div class="pj-u6-exwrap">' + elevatorSvg() + '</div>', steps: [
      { cap: 'Maya works at <b>Prairie Scale Models</b> in Pincher Creek. The town museum wants a model of its old <b>grain elevator</b>, plus a plan of the site.', html: '<div class="pj-x-types"><span>🏠 House</span><span class="on">🌾 Grain elevator</span><span>🚂 Train</span></div>' },
      { cap: 'She gives the job a <b>name</b> to put on her plan sheet.', html: chip('Job: <b><span class="pj-type">The Prairie Sentinel</span></b>') },
      { cap: 'The museum sends the <b>real sizes</b>: the elevator is <b>24 m tall</b> and <b>9 m wide</b>. Every model size will come from these, using a <b>scale factor</b>.', html: chip('Real: 24 m tall · 9 m wide') }] },
    render: function (box, c) {
      var tw = town(c);
      box.appendChild(el('div', 'pj-u6-brief', '<span class="pj-u6-bi">📐</span><div>You’ve been hired as a <b>scale-model maker</b> in <b>' + esc(tw) + '</b>! Your client needs a model and a plan they can show people before anything gets built.</div>'));
      part(box, 'A', 'Pick the build', 'You can change it later (but your numbers will change too).');
      box.appendChild(c.choice('build', BUILD_IDS.map(function (k) { var b = BUILDS[k]; return { v: k, html: '<span class="pj-ti">' + b.icon + '</span><b>' + b.name + '</b><small>' + b.blurb + '</small>' }; }), { cls: 'pj-types pj-u6-builds', aria: 'Build', onPick: function () { c.redraw(); } }));
      var b = build(c); if (!b) return;
      part(box, 'B', 'Name your ' + b.what, 'It goes on your plan sheet.');
      box.appendChild(c.text('bname', { ph: 'e.g. ' + b.names[0], max: 28, aria: 'Name', cls: 'pj-u6-name' }));
      var ideas = el('div', 'pj-ideas', '<span>Need an idea?</span>'); b.names.forEach(function (n) { var bt = el('button', 'pj-idea', esc(n)); bt.type = 'button'; if (c.ro) bt.disabled = true; bt.addEventListener('click', function () { c.set('bname', n); c.redraw(); }); ideas.appendChild(bt); }); box.appendChild(ideas);
      part(box, 'C', 'Your colour', 'For the model and the plan sheet.');
      box.appendChild(c.choice('color', COLORS.map(function (x) { return { v: x[0], html: '<i style="background:' + x[0] + '"></i>' + x[1], title: x[1] }; }), { cls: 'pj-swatches', aria: 'Colour', onPick: function () { c.redraw(); } }));
      var J = job(c);
      var w = el('div', 'pj-u6-sheet');
      w.appendChild(el('div', 'pj-u6-sheet-h', '<span>' + b.icon + '</span><div><small>Job sheet · ' + esc(tw) + '</small><b>' + esc(nameOf(c)) + '</b></div><em>Client: ' + esc(b.client.replace(/^the /, 'The ')) + (b.id === 'skate' ? ', Town of ' + esc(tw) : '') + '</em>'));
      w.appendChild(el('div', 'pj-u6-sheet-b', '<div class="pj-u6-draw flat">' + buildSvg(J, { color: color(c) }) + '</div><dl class="pj-u6-facts"><dt>Real ' + b.dimN.L + '</dt><dd>' + m(J.L) + '</dd><dt>Real ' + b.dimN.W + '</dt><dd>' + m(J.W) + '</dd><dt>Real ' + b.dimN.H + '</dt><dd>' + m(J.H) + '</dd></dl>'));
      w.appendChild(el('p', 'pj-u6-sheet-f', esc(b.client.replace(/^the /, 'The ')) + ' ' + esc(b.clientLine) + '. You’ll check their logo, build the model to scale, draw a plan and measure the site.'));
      box.appendChild(w);
    },
    check: function (c) {
      var out = [c.msg(!!build(c), 'Pick what you’ll build (Part A).')]; if (!build(c)) return out;
      out.push(c.need('bname', { min: 2, label: 'Name', hint: 'Give your build a name.' }));
      out.push(c.msg(!!c.get('color'), 'Pick a colour (Part C).'));
      return out;
    },
    solve: function (c) { if (!c.get('build')) c.set('build', 'tiny'); if (!c.get('color')) c.set('color', COLORS[0][0]); c.set('bname', build(c).names[0]); }
  };

  /* ================= Checkpoint 2: the logo check ================= */
  /* Maya's example logo: a pentagon (a flag shape), and two versions */
  var MAYA_LOGO = { o: [[0, 0], [6, 0], [6, 4], [3, 7], [0, 4]] };
  function mayaLogo(k, stretchWall) { var w = 6 * k, h = 4 * k + (stretchWall || 0), P = [[0, 0], [w, 0], [w, h], [w / 2, h + 3 * k], [0, h]], S = sides(P); return polySvg(P, { sides: S.map(function (x) { return fx(x, 2) + ' cm'; }), angles: angles(P).map(function (a) { return Math.round(a); }), w: 210, h: 190, pad: 40, fill: '#fde68a' }); }
  var VERD = [{ v: 'sim', html: '✓ Similar' }, { v: 'ang', html: 'Not similar: the angles don’t all match' }, { v: 'side', html: 'Not similar: the side ratios aren’t all the same' }, { v: 'size', html: 'Not similar: it’s a different size' }];
  var cp2 = {
    id: 'logo', title: 'Check the logo', needs: ['u6l1', 'u6l2'],
    goal: 'A sign shop made <b>3 big versions</b> of your client’s logo. Only one is <b>similar</b> to the original. Check the <b>angles</b> and <b>every side ratio</b> to find it — and say why the others aren’t.',
    example: { title: 'Maya checks the museum’s logo', scene: '<div class="pj-u6-exwrap pj-u6-ex3"><figure>' + mayaLogo(1) + '<figcaption>Original</figcaption></figure><figure>' + mayaLogo(1.5) + '<figcaption>Version 1</figcaption></figure><figure>' + mayaLogo(1.5, 2) + '<figcaption>Version 2</figcaption></figure></div>', steps: [
      { cap: '<b>Similar</b> means the same shape: <b>every pair of matching angles is equal</b> AND <b>every pair of matching sides has the same ratio</b>. Both tests!', html: chip('Similar = equal angles <b>and</b> proportional sides') },
      { cap: '<b>Angles first.</b> Both versions have 90°, 90°, 135°, 90°, 135° — the same as the original. So far so good.', html: chip('Angles: version 1 ✓ · version 2 ✓') },
      { cap: '<b>Side ratios:</b> divide <b>new ÷ original</b> for each pair. Version 1: bottom 9 ÷ 6, walls 6 ÷ 4, roof edges 6.36 ÷ 4.24.', html: eq('9 ÷ 6 = 6 ÷ 4 = 6.36 ÷ 4.24', 1.5) },
      { cap: 'Every ratio is 1.5, so version 1 is <b>similar</b> with scale factor <b>k = 1.5</b> (k > 1: an enlargement).', html: chip('Version 1: similar, k = 1.5') },
      { cap: 'Version 2: bottom 9 ÷ 6 = 1.5 … but walls 8 ÷ 4 = <b>2</b>. One ratio is different, so it is <b>not similar</b> — even though its angles match. Checking just one pair would have fooled her!', html: chip('Version 2: 1.5, <b>2</b>, 1.5 → not similar') },
      { cap: 'It works the other way too: a square and a rhombus have all sides in the same ratio, but different angles. <b>Not similar.</b> Always check both.', html: chip('Square vs rhombus: sides ✓ angles ✗') }] },
    render: function (box, c) {
      var Lg = logos(c); if (!Lg) return needFirst(box, 'Finish Checkpoint 1 first.');
      var b = build(c), col = color(c), tn = Lg.LG.tn, types = Lg.LG.types;
      part(box, 'A', 'The original and the 3 versions', 'The original is on ' + esc(b.client.replace(/^the /, 'the ')) + '’s business card. Sides are in cm; the angles are marked at each corner.');
      var row = el('div', 'pj-u6-logos');
      row.appendChild(el('figure', 'pj-u6-logo orig', logoSvg(Lg.orig, { w: 230, h: 190, fill: '#fff7d6', aria: 'The original logo' }) + '<figcaption>Original <small>(business card)</small></figcaption>'));
      Lg.letters.forEach(function (L) { row.appendChild(el('figure', 'pj-u6-logo', logoSvg(Lg.vers[L], { w: 230, h: 190, fill: col + '33', aria: 'Version ' + L }) + '<figcaption>Version ' + L + '</figcaption>')); });
      box.appendChild(row);
      part(box, 'B', 'Test 1: the angles', 'Compare each version’s angles with the original’s, corner for corner.');
      var g = grid(box);
      Lg.letters.forEach(function (L) { g.appendChild(field('Version ' + L + ': do all the angles match?', c.choice('ang.' + L, [{ v: 'yes', html: 'Yes' }, { v: 'no', html: 'No' }], { cls: 'pj-seg', aria: 'Version ' + L + ' angles match' }))); });
      part(box, 'C', 'Test 2: the side ratios', 'For each kind of side, divide <b>version ÷ original</b>. Round to 2 decimal places if it doesn’t come out even.');
      var tb = el('div', 'pj-u6-tbl pj-u6-rt');
      tb.appendChild(el('div', 'pj-u6-th', '<span>Side</span><span>Original</span>' + Lg.letters.map(function (L) { return '<span>Version ' + L + '</span>'; }).join('')));
      types.forEach(function (t) {
        var r = el('div', 'pj-u6-tr'); r.appendChild(el('div', 'pj-u6-tl', '<b>' + esc(tn[t]) + '</b>')); r.appendChild(el('div', 'pj-u6-tl', fx(Lg.orig.by[t], 2) + ' cm'));
        Lg.letters.forEach(function (L) { var f = el('div', 'pj-field'); f.appendChild(el('span', 'pj-u6-mini-l', fx(Lg.vers[L].by[t], 2) + ' ÷ ' + fx(Lg.orig.by[t], 2))); f.appendChild(inN(c, 'rat.' + L + '.' + t, { aria: 'Version ' + L + ' ' + tn[t] + ' ratio', ph: '×' })); r.appendChild(f); });
        tb.appendChild(r);
      });
      box.appendChild(tb);
      part(box, 'D', 'Which one is similar?', 'Give your verdict on each version.');
      var vt = el('div', 'pj-u6-verdicts');
      Lg.letters.forEach(function (L) { vt.appendChild(field('Version ' + L, c.choice('ver.' + L, VERD, { cls: 'pj-u6-verd', aria: 'Verdict on version ' + L }))); });
      box.appendChild(vt);
      box.appendChild(field('Explain to the client, in a sentence, why one of the other versions is <b>not</b> similar (use its numbers)', c.text('why', { area: true, rows: 2, max: 300, ph: 'e.g. Version … isn’t similar because …', aria: 'Explain why a version is not similar' }), 'pj-wide'));
    },
    check: function (c) {
      var Lg = logos(c); if (!Lg) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [], types = Lg.LG.types, tn = Lg.LG.tn;
      Lg.letters.forEach(function (L) {
        var V = Lg.vers[L], same = V.role !== 'lean';
        out.push(c.equals('ang.' + L, same ? 'yes' : 'no', { label: 'Version ' + L + ' angles', wrong: same ? { no: 'Look again, corner by corner: every angle of version ' + L + ' is the same as the matching angle on the original.' } : { yes: 'Compare them corner by corner: some of version ' + L + '’s angles are different (' + V.angR.filter(function (a, j) { return a !== Lg.orig.angR[j]; }).slice(0, 2).map(function (a) { return a + '°'; }).join(', ') + ' — the original doesn’t have those).' } }));
        types.forEach(function (t) {
          var nv = V.by[t], ov = Lg.orig.by[t], exp = nv / ov;
          out.push(ratioR(c, 'rat.' + L + '.' + t, exp, { label: 'Version ' + L + ', ' + tn[t].toLowerCase(), wrong: [{ v: ov / nv, tol: 0.006, hint: 'That’s <b>original ÷ version</b> — k upside down. Divide the <b>version</b> by the <b>original</b>: ' + fx(nv, 2) + ' ÷ ' + fx(ov, 2) + '. (The versions are bigger, so the ratio is more than 1.)' }, { v: nv - ov, tol: 0.006, hint: 'That’s the <b>difference</b> (you subtracted). A side ratio <b>divides</b>: ' + fx(nv, 2) + ' ÷ ' + fx(ov, 2) + '.' }], hint: 'Divide: ' + fx(nv, 2) + ' ÷ ' + fx(ov, 2) + '.', units: false }));
        });
        var rs = types.map(function (t) { return fx(V.by[t] / Lg.orig.by[t], 2); }), exp = V.role === 'sim' ? 'sim' : V.role === 'lean' ? 'ang' : 'side', wm = {};
        if (V.role === 'stretch') { wm.sim = 'Check <b>every</b> side ratio, not just one pair: version ' + L + '’s ratios are ' + rs.join(', ') + '. They have to all be the same.'; wm.ang = 'Version ' + L + '’s angles all match. Look at its side ratios: ' + rs.join(', ') + '.'; wm.size = 'Being a different size is fine — every version is bigger than the card! Look at its side ratios: ' + rs.join(', ') + '.'; }
        else if (V.role === 'lean') { wm.sim = 'All its side ratios are equal (' + rs[0] + ') — but similar needs the <b>angles</b> to match too. Like a square and a rhombus: same side ratios, different angles.'; wm.side = 'Its side ratios are all the same (' + rs[0] + '). What’s different about version ' + L + '?'; wm.size = 'Similar shapes can be different sizes. What’s different about version ' + L + '’s shape?'; }
        else { wm.ang = 'Version ' + L + '’s angles all match the original.'; wm.side = 'Version ' + L + '’s side ratios are all ' + rs[0] + '.'; wm.size = 'Similar shapes can be different sizes: that’s what the scale factor (here ' + rs[0] + ') tells you.'; }
        out.push(c.equals('ver.' + L, exp, { label: 'Version ' + L, wrong: wm }));
      });
      out.push(c.need('why', { min: 20, label: 'Your explanation', hint: 'Write a sentence: which version, and which test did it fail (angles or side ratios)? Use its numbers.' }));
      return out;
    },
    solve: function (c) {
      var Lg = logos(c);
      Lg.letters.forEach(function (L) { var V = Lg.vers[L]; c.set('ang.' + L, V.role === 'lean' ? 'no' : 'yes'); Lg.LG.types.forEach(function (t) { c.set('rat.' + L + '.' + t, fx(V.by[t] / Lg.orig.by[t], 2)); }); c.set('ver.' + L, V.role === 'sim' ? 'sim' : V.role === 'lean' ? 'ang' : 'side'); });
      var S = Lg.vers[Lg.order.indexOf('stretch') >= 0 ? 'ABC'[Lg.order.indexOf('stretch')] : 'A'];
      c.set('why', 'Version ' + S.L + ' is not similar: its angles match but its side ratios are not all the same.');
    }
  };

  /* ================= Checkpoint 3: the scale factor of the model ================= */
  var cp3 = {
    id: 'model', title: 'Find the scale factor', needs: ['u6l1'],
    goal: 'Your model’s <b>length</b> is already decided. Find the model’s <b>scale factor k</b>, then use k to find the model’s other sizes — and go back from the model to the real thing.',
    example: { title: 'Maya’s model grain elevator', scene: '<div class="pj-u6-exwrap">' + elevatorSvg() + '</div>', steps: [
      { cap: 'The real elevator is <b>24 m</b> tall. Maya’s model will be <b>48 cm</b> tall. First, make the <b>units match</b>: 24 m = 24 × 100 = 2400 cm.', html: eq('24 m', 2400, ' cm') },
      { cap: '<b>Scale factor k = new ÷ original</b>. The model is the new one, the real elevator is the original.', html: eq('k = 48 ÷ 2400', 0.02) },
      { cap: 'k is less than 1, so the model is a <b>reduction</b>. (k = 0.02 is the same as 1/50: the model is 50 times smaller.)', html: chip('k = 0.02 < 1 → reduction') },
      { cap: '<b>Model sizes:</b> multiply every real size by k. The 9 m width: 900 cm × 0.02.', html: eq('900 × 0.02', 18, ' cm') },
      { cap: '<b>Back to real:</b> the model door is 4 cm tall. To go from the model to the real thing, <b>divide by k</b>.', html: eq('4 ÷ 0.02', 200, ' cm') + chip('200 cm = <b>2 m</b> real door') }] },
    render: function (box, c) {
      var J = job(c); if (!J) return needFirst(box, 'Finish Checkpoint 1 first.');
      var b = J.b;
      part(box, 'A', 'The real ' + b.what + ' and your model', 'The client wants the model’s ' + b.dimN.L + ' to be <b>' + cm(J.mL) + '</b> so it fits the display table.');
      var wr = el('div', 'pj-u6-two');
      wr.appendChild(el('div', 'pj-u6-draw', '<div class="pj-u6-cap">Real</div>' + buildSvg(J, { color: color(c) })));
      wr.appendChild(el('div', 'pj-u6-draw', '<div class="pj-u6-cap">Model</div>' + buildSvg(J, { color: color(c), labels: { L: cm(J.mL), W: '? cm', H: '? cm' }, aria: 'Your model with its length' })));
      box.appendChild(wr);
      part(box, 'B', 'The scale factor', 'k = model ÷ real. Change the real size to cm first!');
      var g = grid(box);
      g.appendChild(field('Real ' + b.dimN.L + ' in cm', inN(c, 'Lcm', { aria: 'Real length in cm', unit: 'cm' })));
      g.appendChild(field('Scale factor k', inN(c, 'k', { aria: 'Scale factor', ph: 'k' })));
      g.appendChild(field('Is the model an enlargement or a reduction?', c.choice('kind', [{ v: 'enl', html: 'Enlargement' }, { v: 'red', html: 'Reduction' }], { cls: 'pj-seg', aria: 'Enlargement or reduction' })));
      part(box, 'C', 'The model’s other sizes', 'Multiply each real size (in cm) by k.');
      var g2 = grid(box);
      g2.appendChild(field('Model ' + b.dimN.W + ' (real ' + m(J.W) + ')', inN(c, 'mW', { aria: 'Model width', unit: 'cm' })));
      g2.appendChild(field('Model ' + b.dimN.H + ' (real ' + m(J.H) + ')', inN(c, 'mH', { aria: 'Model height', unit: 'cm' })));
      part(box, 'D', 'Back to real', 'On the model, the ' + b.feat.name + ' is <b>' + cm(J.mF) + '</b> ' + b.feat.what + '. How ' + b.feat.what + ' is the real one?');
      var g3 = grid(box);
      g3.appendChild(field('Real ' + b.feat.name, inN(c, 'rF', { aria: 'Real ' + b.feat.name, unit: 'm' })));
      box.appendChild(tip('Going from the model back to the real thing undoes the multiplying: <b>divide by k</b>. Then change cm to m.'));
    },
    check: function (c) {
      var J = job(c); if (!J) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var b = J.b, Lc = J.L * 100, out = [];
      out.push(numR(c, 'Lcm', Lc, { tol: 0.01, label: 'Real length in cm', wrong: [{ v: J.L * 10, hint: '1 m = <b>100</b> cm, so multiply by 100.' }, { v: J.L * 1000, hint: '1 m = 100 cm (1000 is for mm).' }], units: 'Multiply metres by 100 to get cm: ' + fx(J.L, 2) + ' × 100.', hint: fx(J.L, 2) + ' m × 100 = ? cm' }));
      out.push(numR(c, 'k', J.k, { rel: 0.011, label: 'Scale factor', form: 'Type k as a decimal (like 0.04) or a fraction (like 1/25).', wrong: [{ v: Lc / J.mL, hint: 'That’s <b>real ÷ model</b> — k upside down. k = <b>new ÷ original</b> = model ÷ real, so a small model gives a k less than 1.' }, { v: J.mL / J.L, hint: 'The units don’t match: the model is in <b>cm</b> but the real length is in <b>m</b>. Change ' + fx(J.L, 2) + ' m to cm first.' }, { v: J.L / J.mL, hint: 'Two slips: change the real length to cm, and divide model ÷ real.' }, { v: Lc - J.mL, hint: 'That’s the <b>difference</b>. A scale factor <b>divides</b>: model ÷ real.' }], hint: 'k = model ÷ real = ' + cm(J.mL) + ' ÷ ' + fx(Lc, 1) + ' cm.', units: false }));
      out.push(c.equals('kind', 'red', { label: 'Enlargement or reduction', wrong: { enl: 'k = ' + fx(J.k, 4) + ' is less than 1, and the model is smaller than the real ' + b.what + '. That’s a <b>reduction</b>.' } }));
      var kk = J.k;
      [['mW', J.W, J.mW, b.dimN.W], ['mH', J.H, J.mH, b.dimN.H]].forEach(function (q) {
        out.push(numR(c, q[0], q[2], { label: 'Model ' + q[3].split(' (')[0], wrong: [{ v: q[1] * kk, tol: 0.006, hint: 'That’s in <b>metres</b>. Use the real size in <b>cm</b> (× 100) so the model size comes out in cm.' }, { v: q[1] * 100 / kk, hint: 'You divided by k. Going from real to model, <b>multiply</b> by k (the model is smaller).' }, { v: q[1] * 100 - (J.L * 100 - J.mL), hint: 'You subtracted the same amount. Similar shapes <b>multiply</b> every length by k.' }], hint: fx(q[1] * 100, 1) + ' cm × ' + fx(kk, 4) + ' = ? cm', hint2: 'Real ' + fx(q[1], 2) + ' m = ' + fx(q[1] * 100, 1) + ' cm. Multiply by k = ' + fx(kk, 4) + '.' }));
      });
      out.push(numR(c, 'rF', b.feat.real, { label: 'Real ' + b.feat.name, wrong: [{ v: J.mF * kk, tol: 0.0006, hint: 'You multiplied by k again. Going from the <b>model back to real</b>, divide by k.' }, { v: J.mF * kk / 100, tol: 0.00006, hint: 'You multiplied by k. Going from the model back to real, <b>divide</b> by k (the real one is bigger).' }], units: 'Divide by k to get cm, then change cm to m (÷ 100).', hint: cm(J.mF) + ' ÷ ' + fx(kk, 4) + ' = ? cm, then ÷ 100 for metres.' }));
      return out;
    },
    solve: function (c) { var J = job(c); c.set('Lcm', fx(J.L * 100, 1)); c.set('k', fx(J.k, 4)); c.set('kind', 'red'); c.set('mW', fx(J.mW, 2)); c.set('mH', fx(J.mH, 2)); c.set('rF', fx(J.b.feat.real, 2)); }
  };

  /* ================= Checkpoint 4: draw an enlargement or a reduction ================= */
  var MAYA_WIN = { D: { name: 'barn window', star: 2 }, P: [[0, 0], [4, 0], [4, 2], [2, 4], [0, 2]], w: 4, h: 4, n: 5, ang: [90, 90, 135, 90, 135] };
  var cp4 = {
    id: 'draw', title: 'Draw it to scale', needs: ['u6l3'],
    goal: 'Draw the shape the builder needs at your own <b>scale factor</b> by placing its corners on a grid: multiply every move by k. The angles stay the same.',
    example: { title: 'Maya enlarges a barn window, k = 1.5', scene: '<div class="pj-u6-exwrap">' + origSvg(MAYA_WIN, { S: 22 }) + '</div>', steps: [
      { cap: 'The window starts at A and goes <b>right 4</b> to B, <b>up 2</b> to C, then left 2 and up 2 to D … Maya wants it <b>1.5 times</b> as big.', html: chip('k = 1.5 → multiply every move by 1.5') },
      { cap: 'A to B: right 4 × 1.5 = <b>right 6</b>. B to C: up 2 × 1.5 = <b>up 3</b>.', html: eq('4 × 1.5', 6, ' squares') },
      { cap: 'C to D: left 2, up 2 becomes <b>left 3, up 3</b>. D to E: left 3, down 3. E back to A: down 3.', html: chip('A′B′ right 6 · B′C′ up 3 · C′D′ left 3, up 3 · D′E′ left 3, down 3 · E′A′ down 3') },
      { cap: '<b>Don’t add!</b> Adding 2 squares to every side gives a fatter, different shape. Similar shapes <b>multiply</b>.', html: chip('right 4 + 2 = 6 ✓ … but up 2 + 2 = 4 ✗ (should be 3)') },
      { cap: 'The <b>angles don’t change</b>: the corner at C is still 135°. Only the lengths are multiplied.', html: chip('∠C′ = ∠C = 135°') }] },
    render: function (box, c) {
      var Sh = shapeOf(c); if (!Sh) return needFirst(box, 'Finish Checkpoint 1 first.');
      var b = build(c), k = Number(c.get('dk')) || null;
      part(box, 'A', 'The ' + Sh.D.name, 'The builder needs a drawing of the ' + esc(b.what) + '’s ' + esc(Sh.D.name) + '. Here’s the designer’s sketch (1 square = 1 unit). ★ marks one corner’s angle.');
      box.appendChild(draw0(origSvg(Sh, { fill: color(c) + '55' }), 'pj-u6-origbox'));
      part(box, 'B', 'Pick a scale factor', 'Pick how big the builder’s drawing should be. Your drawing is checked against your k.');
      box.appendChild(c.choice('dk', DK.map(function (x) { return { v: x, html: 'k = ' + x + '<small>' + (Number(x) < 1 ? 'reduction' : 'enlargement') + '</small>' }; }), { cls: 'pj-seg pj-u6-ks', aria: 'Scale factor for the drawing', onPick: function () { c.redraw(); } }));
      if (!k) return;
      part(box, 'C', 'Plan two lengths', 'Multiply by k = ' + fx(k, 2) + '.');
      var g = grid(box);
      g.appendChild(field('New width (original ' + Sh.w + ' squares)', inN(c, 'dW', { aria: 'New width in squares', unit: 'squares' })));
      g.appendChild(field('New height (original ' + Sh.h + ' squares)', inN(c, 'dH', { aria: 'New height in squares', unit: 'squares' })));
      part(box, 'D', 'Draw it', 'Tap grid points to place A′, B′, C′ … in order. Start A′ anywhere, then multiply every move from the sketch by ' + fx(k, 2) + '.');
      box.appendChild(drawTool(c, Sh));
      part(box, 'E', 'What stays the same?', '');
      var g2 = grid(box);
      g2.appendChild(field('The ★ corner in your drawing measures', inN(c, 'dA', { aria: 'Angle at the star corner in your drawing', unit: '°' })));
      g2.appendChild(field('Your drawing is', c.choice('dT', [{ v: 'enl', html: 'An enlargement' }, { v: 'red', html: 'A reduction' }], { cls: 'pj-seg', aria: 'Enlargement or reduction' })));
    },
    check: function (c) {
      var Sh = shapeOf(c); if (!Sh) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var k = Number(c.get('dk')); if (!k) return [c.msg(false, 'Pick a scale factor (Part B).')];
      var out = [];
      out.push(numR(c, 'dW', Sh.w * k, { tol: 0.001, label: 'New width', wrong: [{ v: Sh.w / k, hint: 'You divided. For k = ' + fx(k, 2) + ', <b>multiply</b>: ' + Sh.w + ' × ' + fx(k, 2) + '.' }, { v: Sh.w + k, hint: 'You <b>added</b> k. Similar shapes multiply: ' + Sh.w + ' × ' + fx(k, 2) + '.' }], hint: Sh.w + ' × ' + fx(k, 2) + ' = ?', units: false }));
      out.push(numR(c, 'dH', Sh.h * k, { tol: 0.001, label: 'New height', wrong: [{ v: Sh.h / k, hint: 'You divided. For k = ' + fx(k, 2) + ', <b>multiply</b>: ' + Sh.h + ' × ' + fx(k, 2) + '.' }, { v: Sh.h + k, hint: 'You <b>added</b> k. Similar shapes multiply: ' + Sh.h + ' × ' + fx(k, 2) + '.' }], hint: Sh.h + ' × ' + fx(k, 2) + ' = ?', units: false }));
      out.push(drawRes(c, Sh, k));
      var A = Sh.ang[Sh.D.star];
      out.push(numR(c, 'dA', A, { tol: 0.5, label: 'The ★ angle', wrong: [{ v: A * k, tol: 0.6, hint: 'Angles are <b>not</b> multiplied by k. In an enlargement or a reduction, every angle stays the same.' }, { v: A / k, tol: 0.6, hint: 'Angles don’t change in a similar shape — only lengths do.' }], hint: 'Similar shapes have equal angles. What is the ★ angle on the sketch?', units: false }));
      out.push(c.equals('dT', k > 1 ? 'enl' : 'red', { label: 'Enlargement or reduction', wrong: { enl: 'k = ' + fx(k, 2) + ' is less than 1, so the drawing is smaller: a <b>reduction</b>.', red: 'k = ' + fx(k, 2) + ' is more than 1, so the drawing is bigger: an <b>enlargement</b>.' } }));
      return out;
    },
    solve: function (c) {
      var Sh = shapeOf(c); if (!c.get('dk')) c.set('dk', '2'); var k = Number(c.get('dk'));
      c.set('dW', fx(Sh.w * k, 2)); c.set('dH', fx(Sh.h * k, 2)); c.set('dA', String(Sh.ang[Sh.D.star])); c.set('dT', k > 1 ? 'enl' : 'red');
      var mnx = Math.min.apply(null, Sh.P.map(function (p) { return p[0]; })), mny = Math.min.apply(null, Sh.P.map(function (p) { return p[1]; }));
      c.set('draw', JSON.stringify(Sh.P.map(function (p) { return [1 + (p[0] - mnx) * k, 1 + (p[1] - mny) * k]; })));
    }
  };
  /* where a student would place the corners (tests) */

  /* ================= Checkpoint 5: the floor plan ================= */
  var cp5 = {
    id: 'plan', title: 'Make the floor plan', needs: ['u6l4'],
    goal: 'Choose a <b>scale</b> so your plan fits on the page, write it as a ratio, change real sizes to plan sizes, place two pieces on the plan, and read a <b>real distance</b> off it.',
    example: { title: 'Maya’s plan of the museum’s cabin', scene: '<div class="pj-u6-exwrap">' + (function () { var s = svgOpen(330, 150, 'pj-u6-exsvg', 'Maya’s plan'), S = 12; for (var i = 0; i <= 24; i++) s += line([20 + i * S, 10], [20 + i * S, 10 + 11 * S], 'pj-u6-gl' + (i % 5 === 0 ? ' mj' : '')); for (var j = 0; j <= 11; j++) s += line([20, 10 + j * S], [20 + 24 * S, 10 + j * S], 'pj-u6-gl' + (j % 5 === 0 ? ' mj' : '')); s += rect(20 + S, 10 + S, 18 * S, 8 * S, 'pj-u6-floor', ' style="stroke:#c2410c"') + rect(20 + 3 * S, 10 + 3 * S, 3 * S, 1.6 * S, '', ' fill="#f59e0b" rx="2"') + rect(20 + 10 * S, 10 + 5 * S, 4 * S, 2 * S, '', ' fill="#8b5cf6" rx="2"') + line([20 + 4.5 * S, 10 + 2 * S], [20 + 4.5 * S, 10 + 8 * S], 'pj-u6-cline') + line([20 + 12 * S, 10 + 2 * S], [20 + 12 * S, 10 + 8 * S], 'pj-u6-cline'); return s + '</svg>'; })() + '</div>', steps: [
      { cap: 'The cabin is <b>9 m × 4 m</b>. Maya’s page is 24 cm wide. At <b>1 cm represents 0.25 m</b> the plan would be 9 ÷ 0.25 = 36 cm long. Too big!', html: eq('9 ÷ 0.25', 36, ' cm ✗') },
      { cap: 'At <b>1 cm represents 0.5 m</b>: 9 ÷ 0.5 = 18 cm long and 4 ÷ 0.5 = 8 cm wide. It fits!', html: eq('9 ÷ 0.5', 18, ' cm ✓') },
      { cap: 'As a ratio, both sides need the <b>same units</b>: 0.5 m = 50 cm, so the scale is <b>1 : 50</b> (not 1 : 0.5).', html: chip('1 cm : 0.5 m = 1 cm : 50 cm = <b>1 : 50</b>') },
      { cap: 'The table is 1.5 m long. On the plan: 1.5 ÷ 0.5 = <b>3 cm</b>. She cuts it out and places it.', html: eq('1.5 ÷ 0.5', 3, ' cm') },
      { cap: 'On the plan, the table’s centre is <b>7.5 cm</b> from the shelf’s centre (count the squares). Real distance: multiply by the scale.', html: eq('7.5 × 0.5', 3.75, ' m') }] },
    render: function (box, c) {
      var J = job(c); if (!J) return needFirst(box, 'Finish Checkpoint 1 first.');
      var b = J.b, s = scaleOf(c);
      part(box, 'A', 'Choose a scale', 'Your plan goes on cm grid paper, <b>' + PAGE.W + ' cm × ' + PAGE.H + ' cm</b>. Leave a 1 cm border all the way round. The real ' + b.what + ' is <b>' + m(J.L) + ' × ' + m(J.W) + '</b>.');
      box.appendChild(c.choice('pscale', b.scales.map(function (x) { return { v: String(x), html: scaleTxt(x) }; }), { cls: 'pj-u6-scales', aria: 'Scale', onPick: function () { c.redraw(); } }));
      if (!s) return;
      var g = grid(box);
      g.appendChild(field('Your scale as a ratio', inN(c, 'pN', { aria: 'Scale as a ratio 1 to N', pre: '1 :', ph: '' })));
      g.appendChild(field('Plan length of the ' + b.what, inN(c, 'pL', { aria: 'Plan length', unit: 'cm' })));
      g.appendChild(field('Plan width', inN(c, 'pW', { aria: 'Plan width', unit: 'cm' })));
      box.appendChild(tip('Real ÷ (metres per cm) = plan cm. If your plan doesn’t fit the page, pick a different scale.'));
      part(box, 'B', 'Cut out two pieces', 'Change each piece’s real size to its plan size at your scale.');
      var tb = el('div', 'pj-u6-tbl pj-u6-pt');
      tb.appendChild(el('div', 'pj-u6-th', '<span>Piece</span><span>Real size</span><span>Plan length</span><span>Plan width</span>'));
      b.items.forEach(function (it) {
        var r = el('div', 'pj-u6-tr'); r.appendChild(el('div', 'pj-u6-tl', '<i class="pj-u6-sw" style="background:' + it.col + '"></i><b>' + esc(it.name) + '</b>')); r.appendChild(el('div', 'pj-u6-tl', m(it.L) + ' × ' + m(it.W)));
        r.appendChild(inN(c, 'i' + it.id + 'L', { aria: it.name + ' plan length', unit: 'cm', onInput: function () { if (tool && tool.redraw) tool.redraw(); } })); r.appendChild(inN(c, 'i' + it.id + 'W', { aria: it.name + ' plan width', unit: 'cm', onInput: function () { if (tool && tool.redraw) tool.redraw(); } }));
        tb.appendChild(r);
      });
      box.appendChild(tb);
      part(box, 'C', 'Place them on your plan', 'Drag each piece ' + esc(b.inside) + '. Pieces snap to half-centimetres; the arrow keys nudge a piece.');
      var tool = planTool(c, J, s); box.appendChild(tool);
      part(box, 'D', 'Read a real distance off the plan', 'Measure along the plan’s length between the two <b>dashed centre lines</b> (count the cm squares).');
      var g2 = grid(box);
      g2.appendChild(field('Distance on the plan', inN(c, 'pd', { aria: 'Distance on the plan', unit: 'cm' })));
      g2.appendChild(field('Real distance', inN(c, 'rd', { aria: 'Real distance', unit: 'm' })));
    },
    check: function (c) {
      var J = job(c); if (!J) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var s = scaleOf(c); if (!s) return [c.msg(false, 'Choose a scale (Part A).')];
      var out = [], N = s * 100, b = J.b, fit = fits(J, s);
      out.push(R0('pscale', fit, { label: 'Your scale', choice: true, hint: fit ? '' : 'At this scale your plan would be ' + fx(J.L / s, 2) + ' cm × ' + fx(J.W / s, 2) + ' cm — it doesn’t fit on the page (' + (PAGE.W - 2) + ' cm × ' + (PAGE.H - 2) + ' cm inside the border). Pick a scale where 1 cm represents <b>more</b>.' }));
      out.push(numR(c, 'pN', N, { parse: pN, tol: 0.01, label: 'Ratio', form: 'Type the N in 1 : N, like 200.', wrong: [{ v: s, tol: 0.0001, hint: 'Both sides of a ratio need the <b>same units</b>. ' + fx(s, 2) + ' m = ' + fx(N, 1) + ' cm, so the ratio is 1 : ' + fx(N, 1) + '.' }, { v: s * 1000, hint: '1 m = 100 cm (not 1000).' }], hint: 'Change ' + fx(s, 2) + ' m to cm (× 100).', units: false }));
      [['pL', J.L], ['pW', J.W]].forEach(function (q) {
        out.push(numR(c, q[0], q[1] / s, { label: q[0] === 'pL' ? 'Plan length' : 'Plan width', wrong: [{ v: q[1] * s, hint: 'You multiplied. The plan is <b>smaller</b> than the real thing: real ÷ ' + fx(s, 2) + ' m per cm.' }, { v: q[1] / N, tol: 0.0006, hint: 'Units! You divided metres by ' + fx(N, 1) + '. Either divide the metres by ' + fx(s, 2) + ', or change ' + fx(q[1], 2) + ' m to cm first (× 100) and then divide by ' + fx(N, 1) + '.' }], hint: fx(q[1], 2) + ' m ÷ ' + fx(s, 2) + ' m per cm = ? cm' }));
      });
      b.items.forEach(function (it) {
        [['L', it.L], ['W', it.W]].forEach(function (q) {
          out.push(numR(c, 'i' + it.id + q[0], q[1] / s, { label: it.name + (q[0] === 'L' ? ' length' : ' width'), wrong: [{ v: q[1] * s, hint: 'You multiplied. Plan size = real ÷ ' + fx(s, 2) + ' (the plan is smaller).' }, { v: q[1] / N, tol: 0.0006, hint: 'Units! Change ' + m(q[1]) + ' to cm first (× 100), then divide by ' + fx(N, 1) + '.' }], hint: fx(q[1], 2) + ' ÷ ' + fx(s, 2) + ' = ? cm' }));
        });
      });
      var st = placeState(c, J, s);
      if (st.bad) {
        var why = { missing: 'Drag both pieces onto your plan (Part C).', out: 'Keep both pieces ' + esc(b.inside) + ' on your plan (Part C).', overlap: 'Your two pieces overlap on the plan (Part C). Move one.', close: 'Move the pieces so their dashed centre lines are at least 1 cm apart (Part C).' }[st.bad];
        if (st.bad === 'missing' && !b.items.every(function (it) { return pieceSize(c, it); })) why = 'Type both pieces’ plan sizes (Part B), then drag them onto your plan (Part C).';
        out.push(c.msg(false, why)); return out;
      }
      var d = st.d, pd = mine(c, 'pd', d);
      out.push(numR(c, 'pd', d, { tol: 0.06, label: 'Distance on the plan', wrong: (function () { var a = st.list[0], bb = st.list[1], gap = a.cx < bb.cx ? bb.x0 - (a.x0 + a.w) : a.x0 - (bb.x0 + bb.w); return gap > 0.05 ? [{ v: gap, tol: 0.06, hint: 'That’s the gap between the pieces’ edges. Measure from one <b>dashed centre line</b> to the other.' }] : []; })(), hint: 'Count the cm squares between the two dashed centre lines (each square is 1 cm).', units: false }));
      out.push(numR(c, 'rd', pd * s, { label: 'Real distance', wrong: [{ v: pd * N, hint: 'That’s the real distance in <b>cm</b>. Change it to metres (÷ 100).' }, { v: pd / s, hint: 'You divided. Real = plan × ' + fx(s, 2) + ' m per cm (the real distance is bigger).' }, { v: pd, tol: 0.001, hint: 'That’s the plan distance. Use your scale: each cm on the plan is ' + fx(s, 2) + ' m.' }], hint: fx(pd, 2) + ' cm × ' + fx(s, 2) + ' m per cm = ? m' }));
      return out;
    },
    solve: function (c) {
      var J = job(c), b = J.b, s = b.scales.filter(function (x) { return fits(J, x); })[0];
      if (!scaleOf(c) || !fits(J, scaleOf(c))) c.set('pscale', String(s)); s = scaleOf(c);
      c.set('pN', fx(s * 100, 1)); c.set('pL', fx(J.L / s, 2)); c.set('pW', fx(J.W / s, 2));
      b.items.forEach(function (it) { c.set('i' + it.id + 'L', fx(it.L / s, 2)); c.set('i' + it.id + 'W', fx(it.W / s, 2)); });
      var P = autoPlace(J, s, c); c.set('place', JSON.stringify(P));
      var st = placeState(c, J, s); c.set('pd', fx(st.d, 2)); c.set('rd', fx(st.d * s, 2));
    }
  };
  /* a good spot for both pieces (tests): side by side along the length, centres on half-cm points */
  function autoPlace(J, s, c) {
    var L = J.L / s, W = J.W / s, a = J.b.items[0], b = J.b.items[1], wa = a.L / s, wb = b.L / s, ha = a.W / s, hb = b.W / s, h = hv(c, 'auto') % 3;
    function up(x) { return Math.ceil(x * 2 - 1e-9) / 2; } function dn(x) { return Math.floor(x * 2 + 1e-9) / 2; }
    var ax = up(wa / 2) + 0.5 * h, bx = dn(L - wb / 2) - 0.5 * h; if (ax + wa / 2 > bx - wb / 2) { ax = up(wa / 2); bx = dn(L - wb / 2); }
    return { a: [ax, up(ha / 2)], b: [bx, Math.max(up(hb / 2), dn(W - hb / 2))] };
  }


  /* ================= Checkpoint 6: on site — shadows and a mirror ================= */
  var cp6 = {
    id: 'site', title: 'Measure the site', needs: ['u6l5', 'u6l6'],
    goal: 'Two tall things are on the site. Find the <b>tree’s height from its shadow</b> and the <b>light pole’s height with a mirror</b>, using similar triangles. Then put the tree on your plan.',
    example: { title: 'Maya measures the elevator and the museum flagpole', scene: '<div class="pj-u6-exwrap pj-u6-ex2">' + shadowSvg({ p: 1.5, sp: 2, S: 32, H: 24 }, { labels: { H: '?' }, sc: 3.4, aria: 'The elevator and a pole with their shadows' }) + mirrorSvg({ e: 1.5, F: 1.62, d1: 1.2, d2: 7.2, P: 9 }, { aria: 'Maya, a mirror and the flagpole' }) + '</div>', steps: [
      { cap: '<b>Shadows:</b> at the same time of day, the sun’s rays are parallel. The elevator and a 1.5 m pole both stand straight up (a right angle), and the rays hit at the same angle. Two equal angles (AA): the triangles are <b>similar</b>.', html: chip('right angle + same sun angle → similar (AA)') },
      { cap: 'Match the sides: <b>height on top, shadow on the bottom</b> — the same way in both ratios.', html: '<div class="pj-xeq">' + frac('elevator', '32 m') + ' = ' + frac('1.5 m', '2 m') + '</div>' },
      { cap: 'Multiply both sides by 32: elevator = 32 × 1.5 ÷ 2.', html: eq('32 × 1.5 ÷ 2', 24, ' m') },
      { cap: '<b>Mirror:</b> Maya puts a mirror on the ground and steps back until she sees the top of the flagpole in it. Angle in = angle out, and both triangles have a right angle: <b>similar</b>.', html: chip('angle in = angle out → similar (AA)') },
      { cap: 'Use her <b>eye height</b> (1.5 m), not her full height — the light goes into her eyes. Heights on top, ground distances on the bottom.', html: '<div class="pj-xeq">' + frac('pole', '7.2 m') + ' = ' + frac('1.5 m', '1.2 m') + '</div>' },
      { cap: 'Pole = 7.2 × 1.5 ÷ 1.2. Does it make sense? The pole is 6 times as far from the mirror as she is, so it’s 6 times her eye height. ✓', html: eq('7.2 × 1.5 ÷ 1.2', 9, ' m') }] },
    render: function (box, c) {
      var Z = site(c), J = job(c); if (!Z) return needFirst(box, 'Finish Checkpoint 1 first.');
      var b = Z.b, S0 = Z.S, M0 = Z.M, s = scaleOf(c);
      part(box, 'A', 'The ' + b.site.tree + ' (shadows)', 'At 2 p.m. you stand a <b>' + m(S0.p) + '</b> survey pole up straight. Its shadow is <b>' + m(S0.sp) + '</b>. The ' + b.site.tree + '’s shadow is <b>' + m(S0.S) + '</b>.');
      box.appendChild(draw0(shadowSvg(S0, { labels: { H: '?' }, aria: 'The ' + b.site.tree + ' and the pole with their shadows' })));
      box.appendChild(field('Why are the two triangles similar?', c.choice('sWhy', WHY_SH, { cls: 'pj-u6-why', aria: 'Why the shadow triangles are similar' }), 'pj-wide'));
      box.appendChild(field('Which proportion is set up right?', c.choice('sSet', SETS, { cls: 'pj-u6-sets', aria: 'The proportion' }), 'pj-wide'));
      var g = grid(box); g.appendChild(field('Height of the ' + b.site.tree, inN(c, 'tree', { aria: 'Tree height', unit: 'm' })));
      part(box, 'B', 'The ' + b.site.pole + ' (a mirror)', 'You put a mirror flat on the ground, <b>' + m(M0.d2) + '</b> from the ' + b.site.pole + '. You step back until you see the top of the pole in the mirror: you’re <b>' + m(M0.d1) + '</b> from the mirror. You are <b>' + m(M0.F) + '</b> tall and your eyes are <b>' + m(M0.e) + '</b> above the ground.');
      box.appendChild(draw0(mirrorSvg(M0, { aria: 'You, the mirror and the ' + b.site.pole })));
      box.appendChild(field('Why are these two triangles similar?', c.choice('mWhy', WHY_MI, { cls: 'pj-u6-why', aria: 'Why the mirror triangles are similar' }), 'pj-wide'));
      var g2 = grid(box); g2.appendChild(field('Height of the ' + b.site.pole, inN(c, 'pole', { aria: 'Pole height', unit: 'm' })));
      part(box, 'C', 'Put the tree on your plan', 'The ' + b.site.tree + ' is <b>' + m(Z.T) + '</b> from the corner of the ' + b.what + '. ' + (s ? 'Your plan’s scale: <b>' + esc(scaleTxt(s)) + '</b>.' : 'Choose your plan’s scale in Checkpoint 5 first.'));
      var g3 = grid(box); g3.appendChild(field('Distance on your plan', inN(c, 'tPlan', { aria: 'Tree distance on the plan', unit: 'cm' })));
      void J;
    },
    check: function (c) {
      var Z = site(c); if (!Z) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var S0 = Z.S, M0 = Z.M, out = [], wS = {}, wM = {}, b = Z.b;
      wS.shadow = 'The shadows aren’t the same length (' + m(S0.S) + ' and ' + m(S0.sp) + '). What about the <b>angles</b>?'; wS.any = 'Not all right triangles are similar — a skinny one and a flat one aren’t. These two also share the <b>sun’s angle</b>.'; wS.tall = 'Standing up gives each triangle a right angle. What other angle do they share?';
      out.push(c.equals('sWhy', 'aa', { label: 'Why similar (shadows)', wrong: wS }));
      out.push(c.equals('sSet', 'ok', { label: 'The proportion', wrong: { mix: 'Each ratio has to come from <b>one</b> triangle: the tree and the tree’s shadow, the pole and the pole’s shadow.', flip: 'Keep the sides in the <b>same order</b> in both ratios: if the height is on top in one, put the height on top in the other.' } }));
      var H = S0.H;
      out.push(numR(c, 'tree', H, { label: b.site.tree.replace(/^./, function (x) { return x.toUpperCase(); }), wrong: [{ v: S0.S * S0.sp / S0.p, hint: 'You mixed up which side goes on top: one ratio had the height on top and the other the shadow. Tree = tree’s shadow × pole ÷ pole’s shadow.' }, { v: S0.p * S0.sp / S0.S, tol: 0.01, hint: 'Set it up as tree ÷ tree’s shadow = pole ÷ pole’s shadow, then multiply both sides by the tree’s shadow.' }, { v: S0.S + (S0.p - S0.sp), hint: 'You <b>added</b> the difference. Similar triangles multiply: tree = ' + fx(S0.S, 2) + ' × ' + fx(S0.p, 2) + ' ÷ ' + fx(S0.sp, 2) + '.' }, { v: S0.S, tol: 0.001, hint: 'That’s the shadow. The tree is ' + (S0.p > S0.sp ? 'taller than' : 'shorter than') + ' its shadow, like the pole.' }], hint: 'tree = ' + fx(S0.S, 2) + ' × ' + fx(S0.p, 2) + ' ÷ ' + fx(S0.sp, 2) }));
      wM.mid = 'The mirror isn’t halfway (' + m(M0.d1) + ' and ' + m(M0.d2) + '). Think about how light bounces off a mirror.'; wM.same = 'You’re much shorter than the pole! Think about the angles at the mirror.';
      out.push(c.equals('mWhy', 'aa', { label: 'Why similar (mirror)', wrong: wM }));
      out.push(numR(c, 'pole', M0.P, { label: b.site.pole.replace(/^./, function (x) { return x.toUpperCase(); }), wrong: [{ v: M0.F * M0.d2 / M0.d1, hint: 'Use your <b>eye height</b> (' + m(M0.e) + '), not your full height: the light from the top of the pole goes into your <b>eyes</b>.' }, { v: M0.d2 / M0.d1, tol: 0.01, hint: 'You forgot the <b>eye height</b>. pole ÷ ' + m(M0.d2) + ' = eye height ÷ ' + m(M0.d1) + '.' }, { v: M0.e * M0.d1 / M0.d2, tol: 0.01, hint: 'You mixed up which triangle’s side goes on top. The pole is <b>far</b> from the mirror, so it’s taller than your eyes: pole = ' + fx(M0.d2, 2) + ' × ' + fx(M0.e, 2) + ' ÷ ' + fx(M0.d1, 2) + '.' }, { v: M0.e * M0.d2 / M0.d1 + M0.e, hint: 'Don’t add your eye height at the end — it’s already in the proportion.' }], hint: 'pole ÷ ' + m(M0.d2) + ' = ' + m(M0.e) + ' ÷ ' + m(M0.d1) + '.' }));
      var s = scaleOf(c); if (!s) { out.push(c.msg(false, 'Choose your plan’s scale in Checkpoint 5 first.')); return out; }
      out.push(numR(c, 'tPlan', Z.T / s, { label: 'Tree on the plan', wrong: [{ v: Z.T * s, hint: 'You multiplied. Real to plan: <b>divide</b> by ' + fx(s, 2) + ' m per cm.' }, { v: Z.T / (s * 100), tol: 0.0006, hint: 'Units! Your scale is 1 : ' + fx(s * 100, 1) + '. Change ' + m(Z.T) + ' to cm first (× 100), then divide.' }], hint: fx(Z.T, 2) + ' m ÷ ' + fx(s, 2) + ' m per cm = ? cm' }));
      return out;
    },
    solve: function (c) { var Z = site(c), s = scaleOf(c); c.set('sWhy', 'aa'); c.set('sSet', 'ok'); c.set('tree', fx(Z.S.H, 2)); c.set('mWhy', 'aa'); c.set('pole', fx(Z.M.P, 2)); if (s) c.set('tPlan', fx(Z.T / s, 2)); }
  };

  /* ================= Checkpoint 7: the plan sheet — hand it in ================= */
  function cardHtml(c) {
    var J = job(c); if (!J) return '';
    var b = J.b, col = color(c), Lg = logos(c), s = scaleOf(c), Z = site(c), Sh = shapeOf(c), k = mine(c, 'k', J.k);
    function row(a, v) { return '<div class="pj-u6-cr"><span>' + a + '</span><b>' + v + '</b></div>'; }
    function own(kk, unit, fb) { var x = pn(c.get(kk)); return isNaN(x) ? (fb == null ? '—' : fx(fb, 2) + unit) : fx(x, 2) + unit; }
    var d = new Date(), simV = Lg ? Lg.vers[Lg.simL] : null, dk = Number(c.get('dk')) || 0, Q = drawPts(c);
    var drawHtml = '', LOGOS;
    if (Sh && Q.length >= Sh.n) drawHtml = polySvg(Q, { sides: false, angles: false, w: 150, h: 110, pad: 8, fill: col + '55', aria: 'Your drawing' });
    LOGOS = '<div class="pj-u6-c-logos">' + (simV ? '<div>' + polySvg(simV.P, { sides: false, angles: false, w: 110, h: 80, pad: 6, fill: col + '44' }) + '<small>Logo: version ' + simV.L + ' is similar (k = ' + fx(Lg.kS, 2) + ')</small></div>' : '') +
      (drawHtml ? '<div>' + drawHtml + '<small>' + esc(cap(Sh.D.name)) + ' at k = ' + fx(dk, 2) + '</small></div>' : '') + '</div>';
    return '<div class="pj-u6-card" style="--cc:' + esc(col) + '">' +
      '<div class="pj-u6-c-top"><div class="pj-u6-c-logo">' + ICON + '</div><div class="pj-u6-c-id"><small>Plan sheet · ' + esc(J.town) + ', Alberta</small><b>' + esc(nameOf(c)) + '</b><span>' + b.icon + ' ' + esc(b.name) + ' for ' + esc(b.client.replace(/^the /, 'the ')) + '</span></div><div class="pj-u6-c-no"><b>SCALE</b><span class="n">' + (s ? '1 : ' + fx(s * 100, 1) : '—') + '</span><span>' + esc(d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })) + '</span></div></div>' +
      '<div class="pj-u6-c-body"><div class="pj-u6-c-plan">' + (s ? miniPlan(c, J, s) : '') + '<div class="pj-u6-c-cap">Floor plan · ' + (s ? esc(scaleTxt(s)) + ' (1 : ' + fx(s * 100, 1) + ')' : '') + '</div>' + LOGOS + '</div><div class="pj-u6-c-notes">' +
      '<h5>Real ' + esc(b.what) + '</h5>' + row(cap(b.dimN.L), m(J.L)) + row(cap(b.dimN.W), m(J.W)) + row(cap(b.dimN.H.split(' (')[0]), m(J.H)) +
      '<h5>Model (k = ' + fx(k, 4) + ')</h5>' + row('Length', cm(J.mL)) + row('Width', own('mW', ' cm')) + row('Height', own('mH', ' cm')) +
      '<h5>On site</h5>' + row(cap(b.site.tree) + ' (shadows)', own('tree', ' m')) + row(cap(b.site.pole) + ' (mirror)', own('pole', ' m')) + row('Model ' + b.site.tree, own('mTree', ' cm')) +
      '<div class="pj-u6-c-note">' + (c.get('note') ? esc(c.get('note')) : 'Every size on this sheet comes from the real ' + esc(b.what) + ' and one scale factor.') + '</div>' +
      '</div></div></div>';
  }
  function cap(s) { return String(s).replace(/^./, function (x) { return x.toUpperCase(); }); }
  var cp7 = {
    id: 'sheet', title: 'Plan sheet — and hand it in', needs: ['u6l1', 'u6l6'], submit: true,
    goal: 'Add the tree to your model, check your <b>plan sheet</b>, print it, write a short reflection and hand it in.',
    passMsg: 'Your plan sheet has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Maya finishes her plan sheet', steps: [
      { cap: 'The museum wants the <b>flagpole</b> in the model too. The real pole is 9 m. The model uses the same scale factor as everything else: k = 0.02.', html: chip('Same k for every part of the model') },
      { cap: 'Change to cm (9 m = 900 cm) and multiply by k.', html: eq('900 × 0.02', 18, ' cm') },
      { cap: 'Her plan sheet shows the scale both ways (<b>1 cm represents 0.5 m</b> and <b>1 : 50</b>), k for the model, the real and model sizes, and the heights she measured.', html: chip('Scale · k · sizes · heights') }] },
    render: function (box, c) {
      var J = job(c), Z = site(c); if (!J || !Z) return needFirst(box, 'Finish the checkpoints before this one first.');
      var b = J.b, H = mine(c, 'tree', Z.S.H), k = mine(c, 'k', J.k);
      part(box, 'A', 'Add the ' + b.site.tree + ' to the model', 'The client loves the idea. Use <b>your</b> numbers: the tree is <b>' + m(H) + '</b> (Checkpoint 6) and the model’s scale factor is <b>k = ' + fx(k, 4) + '</b> (Checkpoint 3).');
      var g = grid(box); g.appendChild(field('Model ' + b.site.tree + ' height', inN(c, 'mTree', { aria: 'Model tree height', unit: 'cm', onInput: function () { var q = box.querySelector('.pj-u6-cardwrap'); if (q) q.innerHTML = cardHtml(c); } })));
      part(box, 'B', 'Your plan sheet', 'Everything you worked out, on one sheet. Add a note for the client if you like, then print it.');
      box.appendChild(field('A note for the client (optional)', c.text('note', { ph: 'e.g. The model is a reduction, k = ' + fx(k, 4) + ', so 1 cm on the model is ' + fx(1 / k / 100, 2) + ' m real.', max: 110, aria: 'Note for the client', onInput: function () { var q = box.querySelector('.pj-u6-cardwrap'); if (q) q.innerHTML = cardHtml(c); } }), 'pj-wide'));
      box.appendChild(el('div', 'pj-u6-cardwrap', cardHtml(c)));
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my plan sheet'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<link rel="stylesheet" href="' + PJ.site + 'assets/projects-u6.css"><div class="pj-printsheet">' + cardHtml(c) + '</div>', nameOf(c) + ' plan sheet'); });
      if (!c.ro) box.appendChild(pr);
      part(box, 'C', 'Look back', '');
      box.appendChild(field('Where did you use a scale factor k, and where did you use a scale like 1 : N? How are they alike?', c.text('reflect', { area: true, rows: 3, max: 500, ph: 'e.g. I used k = … for the model. My plan used 1 : … . Both …', aria: 'Reflection' }), 'pj-wide'));
    },
    check: function (c) {
      var J = job(c), Z = site(c); if (!J || !Z) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var H = mine(c, 'tree', Z.S.H), k = mine(c, 'k', J.k), exp = H * 100 * k, out = [];
      out.push(numR(c, 'mTree', exp, { label: 'Model tree', wrong: [{ v: H * k, tol: 0.006, hint: 'That’s in <b>metres</b>. Change the tree to cm first (× 100), then multiply by k.' }, { v: H * 100 / k, hint: 'You divided by k. Real to model: <b>multiply</b> by k (the model is smaller).' }], hint: fx(H, 2) + ' m = ' + fx(H * 100, 1) + ' cm; × ' + fx(k, 4) + ' = ? cm' }));
      out.push(c.need('reflect', { min: 20, label: 'Look back', hint: 'Write a sentence or two: where you used k, where you used 1 : N, and how they’re alike.' }));
      return out;
    },
    solve: function (c) { var J = job(c), Z = site(c), H = mine(c, 'tree', Z.S.H), k = mine(c, 'k', J.k); c.set('mTree', fx(H * 100 * k, 2)); c.set('reflect', 'I used k for the model: every real size times k. The plan used 1 : N, which is the same idea: plan = real ÷ N.'); }
  };

  PJ.scale = { BUILDS: BUILDS, job: job, logos: logos, flex: flex, sides: sides, angles: angles, convex: convex, shapeOf: shapeOf, drawPts: drawPts, matchScale: matchScale, drawRes: drawRes,
    fits: fits, scaleOf: scaleOf, placeState: placeState, autoPlace: autoPlace, site: site, cardHtml: cardHtml, pn: pn, pN: pN, PAGE: PAGE, GW: GW, GH: GH, scaleTxt: scaleTxt, logoPts: logoPts };
  HW.defineProject({
    id: 'u6', unit: 6, title: 'Scale It', outcomes: ['G3'], icon: ICON,
    tagline: 'Make a scale model and a plan for a real build in an Alberta town: check a logo, find k, draw to scale, plan it and measure the site.',
    intro: '<div class="pj-intro-art">' + ICON + '</div><div><b>Welcome to Scale It!</b> A client has hired you to make a scale model and a plan of a real build. In 7 checkpoints you’ll use the similarity and scale from Unit 6 to check their logo, find your model’s scale factor, draw a part to scale, make a floor plan that fits the page and measure tall things on the site. Your work saves as you go. It’s due on the Unit 6 test day.</div>',
    lessonNames: { u6l1: 'Similar Polygons', u6l2: 'Are They Similar?', u6l3: 'Enlargements and Reductions', u6l4: 'Scale Diagrams', u6l5: 'Similar Triangles', u6l6: 'Shadows and Mirrors' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: cardHtml
  });
})(typeof window !== 'undefined' ? window : global);
