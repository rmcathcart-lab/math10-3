/* Unit 7 project: Ramp It Up (Right Triangles and Trigonometry: G2, G4, A1).
 * A community building (a curling rink, a library or a small-town hall) needs an accessible ramp, new entry stairs and a
 * light pole, and the student's crew designs them: pick the building and a crew name (each crew gets its own building
 * sizes), square the landing's corner with 3-4-5 (or a multiple) and test a measured triangle with a² + b² = c², check
 * the slab by its diagonal; find the run for an about-1 : 12 slope and the ramp's length (Pythagoras), and the old ramp's
 * run (a leg); the ramp's angle (tan⁻¹, checked with sin⁻¹) against the about-4.8° guideline, and the old, too-steep
 * ramp's angle; the stair stringer (length and angle) and the handrail (sine: multiply; cosine: divide); the light pole's
 * height from an angle of elevation (+ eye height), its guy wire (length, angle, a second anchor: divide) and a roof
 * camera's angle of depression to the ramp's foot; then a reasonableness check, a printable build card and hand-in.
 * Every answer is checked against the student's own building and earlier answers (a later box accepts the student's own
 * rounded numbers, so one slip doesn't snowball). Targeted hints: subtracting instead of adding squares (or the reverse),
 * forgetting the square root, a leg used as the hypotenuse, opp/adj swapped, a calculator in RAD mode (compared with the
 * radian value), forgetting the eye height, multiplying instead of dividing when the unknown is on the bottom.
 * Worked examples use a different crew: the Aspen Ramp Crew at the seniors' centre in Vulcan.
 * Conventions follow the Unit 7 booklet (m103book/common/BOOK_BRIEF.md): right angle at C, opp/adj/hyp relative to θ,
 * SOH CAH TOA, DEG mode, angles to the nearest degree, 3-4-5 squaring. Builders measure to the centimetre, so lengths in
 * metres are to 2 decimal places (the pole and guy wire, measured from far away, to the nearest tenth); the ramp angle
 * is to the nearest tenth of a degree so it can be compared with the about-4.8° guideline.
 * Engine: js/projects.js. Each checkpoint has solve(c), which fills in right answers (tests/projects_u7_test.js and
 * tests/projects_u7_e2e.py). Styles: assets/projects-u7.css (added to the page by this file). */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, esc = PJ.esc;
  var hasDoc = typeof document !== 'undefined';
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  if (hasDoc && PJ.site != null && !document.querySelector('link[data-pj-u7], link[href*="projects-u7.css"]')) {
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = PJ.site + 'assets/projects-u7.css'; lk.setAttribute('data-pj-u7', ''); document.head.appendChild(lk);
  }
  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  var OPP = '#ea580c', ADJ = '#2563eb', HYP = '#15803d', TH = '#7c3aed';

  /* ================= numbers ================= */
  function hv(c, k) { return PJ.hash(c.seed + '|' + k); }
  function pick(c, k, a) { return a[hv(c, k) % a.length]; }
  function rnd(x, n) { var p = Math.pow(10, n); return Math.round(x * p + (x >= 0 ? 1e-9 : -1e-9)) / p; }
  function fx(x, n) { return rnd(x, n == null ? 2 : n).toFixed(n == null ? 2 : n); }     // 8.67 → "8.67", 2 → "2.00"
  function sq(x) { return x * x; }
  function hyp(a, b) { return Math.sqrt(a * a + b * b); }
  function leg(c2, a) { return Math.sqrt(Math.max(0, c2 * c2 - a * a)); }
  function atanD(x) { return Math.atan(x) * R2D; }
  function asinD(x) { return Math.asin(Math.max(-1, Math.min(1, x))) * R2D; }
  function tanD(a) { return Math.tan(a * D2R); } function sinD(a) { return Math.sin(a * D2R); } function cosD(a) { return Math.cos(a * D2R); }
  /* a typed length or angle: "8.67", "8.67 m", "867 cm"? (no: just metres), "35°", "35 deg" → number; anything else → NaN */
  function pl(s) {
    if (s == null) return NaN;
    var t = String(s).trim().replace(/^[θ∠]\s*=?\s*/, '').replace(/\s*(°|º|˚|deg(rees?)?|m²|m2|sq\.? ?m|metres?|meters?|m)\s*$/i, '');
    return PJ.parse(t);
  }
  function decs(s) { var m = /\.(\d+)/.exec(String(s)); return m ? m[1].length : 0; }
  function mine(c, k, fb) { var x = pl(c.get(k)); return isNaN(x) ? fb : x; } // the student's own number (or the right one)
  function within(x, lo, hi, tol) { return x >= lo - tol - 1e-9 && x <= hi + tol + 1e-9; }
  function lohi(a) { a = [].concat(a).filter(function (v) { return v != null && isFinite(v); }); return a.length ? [Math.min.apply(null, a), Math.max.apply(null, a)] : null; }

  /* ================= result builders ================= */
  function R0(f, ok, x) { var r = { f: f, ok: !!ok, blank: false, graded: true }; if (x) for (var k in x) r[k] = x[k]; return r; }
  var ROUND = { m: ['to the nearest metre', 'to the nearest tenth of a metre (1 decimal place, like 10.9)', 'to the nearest centimetre: 2 decimal places, like 8.67'],
    '°': ['to the nearest degree', 'to the nearest tenth of a degree (1 decimal place, like 4.8)'], 'm²': ['', '', 'to 2 decimal places, like 2.37'], '': ['', 'to 1 decimal place', 'to 2 decimal places'] };
  /* a length or an angle. exp: the right answer, or a list of right answers (worked from exact values and from the
     student's own rounded ones): anything that rounds right is fine, and more decimals are fine too.
     o: { dp (2), unit 'm' | '°' | 'm²', inv (an angle from an inverse trig key: a RAD-mode answer gets its own hint),
          wrong: [{ v (a number or a list of numbers, each a way to make that mistake), hint }], hint, hint2, label } */
  function numR(c, k, exp, o) {
    o = o || {}; var dp = o.dp == null ? 2 : o.dp, unit = o.unit || 'm', ang = unit === '°', half = 0.5 * Math.pow(10, -dp);
    var base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!c.has(k)) return R0(k, false, Object.assign(base, { blank: true }));
    var raw = c.get(k), x = pl(raw);
    if (isNaN(x)) return R0(k, false, Object.assign(base, { form: true, hint: ang ? 'Type just the number of degrees, like 35.' : 'Type just a number, like ' + (dp === 1 ? '10.9' : '2.45') + '.' }));
    var E = lohi(exp); if (!E) return R0(k, false, Object.assign(base, { hint: o.hint || 'Check this one again.' }));
    var lo = E[0], hi = E[1];
    if (within(x, lo, hi, half)) return R0(k, true, base);
    var nd = decs(raw), tolT = 0.5 * Math.pow(10, -Math.min(nd, dp)), w = o.wrong || [];
    /* a typical mistake: each of its values on its own (not one that is also right) */
    function slip(tol) {
      for (var i = 0; i < w.length; i++) {
        var vs = [].concat(w[i].v).filter(function (v) { return v != null && isFinite(v) && (v + half < lo - half || v - half > hi + half); });
        for (var j = 0; j < vs.length; j++) if (Math.abs(x - vs[j]) <= tol + 1e-9) return w[i].hint;
      }
      return '';
    }
    var hs = slip(half); if (hs) return R0(k, false, Object.assign(base, { hint: hs }));
    if (nd < dp && within(x, lo, hi, tolT)) return R0(k, false, Object.assign(base, { form: true, hint: 'Right idea! Now round ' + ((ROUND[unit] || ROUND[''])[dp] || 'as asked') + '.' }));
    hs = slip(Math.max(half, tolT)); if (hs) return R0(k, false, Object.assign(base, { hint: hs }));
    if (o.inv && ang && x >= 0 && lo > 2) {
      if (within(x, lo * D2R, hi * D2R, Math.max(0.006, tolT))) return R0(k, false, Object.assign(base, { hint: 'That’s the angle in <b>radians</b>: your calculator is in <b>RAD</b> mode. Press <b>DRG</b> and choose <b>DEG</b>, then do it again.' + (lo < 10 ? ' (Or did you skip the inverse key? Use 2nd, then tan.)' : '') }));
      if (x < 1.6) return R0(k, false, Object.assign(base, { hint: 'That’s far too small for this angle. Use the <b>inverse</b> key (<b>2nd</b>, then tan, sin or cos) on the ratio, with the calculator in <b>DEG</b> mode.' }));
    }
    if (within(x, lo, hi, (ang ? 3 : 4) * half)) return R0(k, false, Object.assign(base, { hint: 'Close! Keep every calculator digit until the last step, then round ' + ((ROUND[unit] || ROUND[''])[dp] || '') + '.' }));
    return R0(k, false, Object.assign(base, { hint: o.hint || 'Check this one again.' }));
  }
  var RADH = function (what) { return 'Your calculator is in <b>RAD</b> mode, so ' + (what || 'the trig key') + ' gave the wrong number. Press <b>DRG</b> and choose <b>DEG</b>, then do it again.'; };

  /* ================= the buildings (each crew gets one of 3 versions; lengths in metres) ================= */
  /* h: how high the entrance is above the ground; n steps (each rises h/n) with treads t deep; Lold: the old ramp's sloped
     length; W × D: the landing slab (W along the building); roof: the height of the roof edge */
  var BLD = {
    curl: { name: 'Curling rink', icon: '🥌', blurb: 'Curlers, fans and a busy bonspiel weekend', sign: 'CURLING CLUB', who: 'curlers and their fans',
      V: [{ h: 0.72, n: 4, t: 0.28, Lold: 3.67, W: 2.4, D: 1.8, roof: 5.6 }, { h: 0.90, n: 5, t: 0.28, Lold: 4.33, W: 2.2, D: 1.6, roof: 6.1 }, { h: 0.76, n: 4, t: 0.27, Lold: 3.86, W: 2.5, D: 1.7, roof: 5.8 }] },
    lib: { name: 'Public library', icon: '📚', blurb: 'Story time, study space and a big book sale', sign: 'PUBLIC LIBRARY', who: 'families, students and seniors',
      V: [{ h: 0.54, n: 3, t: 0.28, Lold: 2.95, W: 2.0, D: 1.6, roof: 6.8 }, { h: 0.85, n: 5, t: 0.29, Lold: 4.48, W: 2.3, D: 1.8, roof: 7.2 }, { h: 0.68, n: 4, t: 0.28, Lold: 3.25, W: 2.1, D: 1.5, roof: 6.5 }] },
    hall: { name: 'Town hall', icon: '🏛️', blurb: 'Council meetings, the farmers’ market and voting day', sign: 'TOWN HALL', who: 'everyone in town',
      V: [{ h: 0.57, n: 3, t: 0.27, Lold: 3.05, W: 2.2, D: 1.7, roof: 7.6 }, { h: 0.95, n: 5, t: 0.28, Lold: 4.71, W: 2.6, D: 1.9, roof: 8.3 }, { h: 0.80, n: 4, t: 0.26, Lold: 4.05, W: 2.4, D: 1.6, roof: 7.9 }] }
  };
  var BLD_IDS = ['curl', 'lib', 'hall'];
  var TOWNS = ['Stettler', 'Ponoka', 'Three Hills', 'Lacombe', 'Wainwright', 'Vegreville', 'Pincher Creek', 'Claresholm', 'Hanna', 'Drumheller'];
  var CREWS = ['Ramp Rangers', 'Slope Squad', 'The Right Angles', 'Level Up Builders', 'Hypotenuse Heroes'];
  var KS = ['0.3', '0.4', '0.5'];
  /* everything about one crew's job, from the building they picked and their seed */
  function site(c) {
    var id = c.get('bld'), B = BLD[id]; if (!B) return null;
    var vi = hv(c, 'v' + id) % B.V.length, v = B.V[vi], o = { id: id, B: B, vi: vi };
    for (var k in v) o[k] = v[k];
    o.r = o.h / o.n; o.R = o.n * o.t;
    o.run = 12 * o.h; o.len = hyp(o.run, o.h); o.orun = leg(o.Lold, o.h);
    o.ang = atanD(o.h / o.run); o.oang = atanD(o.h / o.orun);
    o.diag = hyp(o.W, o.D);
    o.town = TOWNS[hv(c, 'town') % TOWNS.length];
    o.delta = pick(c, 'dl', [0, 0.04, -0.03, 0.05, -0.04, 0.03]);           // the measured 3-4-5 diagonal is off by this much
    o.off = pick(c, 'off', [0, 0.04, 0, -0.03]);                             // the slab's second diagonal is off by this much
    o.d1 = rnd(o.diag, 2); o.d2 = rnd(o.diag + o.off, 2);
    o.Lr = pick(c, 'rail', [1.8, 2.1, 2.4, 2.7]);                             // the pre-cut handrail
    o.sang = atanD(o.h / o.R); o.str = hyp(o.R, o.h);
    o.need = (o.R + o.t) / cosD(o.sang);
    o.d = pick(c, 'pd', [10, 12, 14, 16]); o.te = pick(c, 'pt', [28, 31, 34, 37]); o.e = pick(c, 'pe', [1.5, 1.6, 1.7]);
    o.H = o.d * tanD(o.te) + o.e;
    o.a = pick(c, 'ga', [4.5, 5, 5.5]); o.b = pick(c, 'gb', [2.5, 3, 3.5]); o.f2 = pick(c, 'gf', [50, 55, 60, 65]);
    o.wire = hyp(o.a, o.b); o.wang = atanD(o.a / o.b); o.b2 = o.a / tanD(o.f2);
    o.dep = atanD(o.roof / o.run);
    o.slip = pick(c, 'slip', ['ramp', 'angle', 'stairs', 'wire']);
    return o;
  }
  function kOf(c) { var k = Number(c.get('k')); return KS.indexOf(String(c.get('k'))) >= 0 ? k : 0; }
  function crewName(c) { var n = String(c.get('crew') || '').trim(); return n || 'Your crew'; }

  /* ================= SVG helpers (screen units) ================= */
  function P(x) { return (+x).toFixed(1); }
  function ln(a, b, cls, ex) { return '<line x1="' + P(a[0]) + '" y1="' + P(a[1]) + '" x2="' + P(b[0]) + '" y2="' + P(b[1]) + '"' + (cls ? ' class="' + cls + '"' : '') + (ex || '') + '/>'; }
  function tx(x, y, t, cls, ex) { return '<text x="' + P(x) + '" y="' + P(y) + '"' + (cls ? ' class="' + cls + '"' : '') + (ex || '') + '>' + t + '</text>'; }
  function poly(pts, cls, ex) { return '<polygon points="' + pts.map(function (p) { return P(p[0]) + ',' + P(p[1]); }).join(' ') + '"' + (cls ? ' class="' + cls + '"' : '') + (ex || '') + '/>'; }
  function tw(t, fs) { return String(t).replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, 'x').length * (fs || 13) * 0.6; }
  /* a label in a rounded box, centred on (x, y) */
  function tag(x, y, t, cls, ex) { var w = tw(t) + 16; return '<g class="pj-u7-tg' + (cls ? ' ' + cls : '') + '"' + (ex || '') + '><rect x="' + P(x - w / 2) + '" y="' + P(y - 12) + '" width="' + P(w) + '" height="24" rx="12"/><text x="' + P(x) + '" y="' + P(y + 4.5) + '">' + t + '</text></g>'; }
  /* an arc on the screen for math angles a1 → a2 (degrees, counterclockwise, 0 = right) */
  function arcD(cx, cy, r, a1, a2) {
    var s = [cx + r * Math.cos(a1 * D2R), cy - r * Math.sin(a1 * D2R)], e = [cx + r * Math.cos(a2 * D2R), cy - r * Math.sin(a2 * D2R)];
    return 'M' + P(s[0]) + ' ' + P(s[1]) + ' A' + P(r) + ' ' + P(r) + ' 0 ' + (a2 - a1 > 180 ? 1 : 0) + ' 0 ' + P(e[0]) + ' ' + P(e[1]);
  }
  /* a dimension line with end ticks */
  function dim(a, b, cls) {
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * 6, ny = dx / L * 6;
    return '<g class="pj-u7-dim' + (cls ? ' ' + cls : '') + '">' + ln(a, b) + ln([a[0] - nx, a[1] - ny], [a[0] + nx, a[1] + ny]) + ln([b[0] - nx, b[1] - ny], [b[0] + nx, b[1] + ny]) + '</g>';
  }
  /* the right-angle mark at C, legs along u and v (unit screen vectors) */
  function sqMark(C, u, v, s) { s = s || 11; return '<path class="pj-u7-sq" d="M' + P(C[0] + u[0] * s) + ' ' + P(C[1] + u[1] * s) + ' L' + P(C[0] + u[0] * s + v[0] * s) + ' ' + P(C[1] + u[1] * s + v[1] * s) + ' L' + P(C[0] + v[0] * s) + ' ' + P(C[1] + v[1] * s) + '"/>'; }
  function svgOpen(W, H, cls, aria) { return '<svg class="pj-u7-svg' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(H) + '" style="max-width:' + Math.round(W) + 'px" role="img" aria-label="' + esc(aria || '') + '">'; }
  function frame(x0, x1, y0, y1, Wpx, pad, maxS) {
    var S = Math.min(maxS || 1e9, (Wpx - 2 * pad) / (x1 - x0));
    return { S: S, W: (x1 - x0) * S + 2 * pad, H: (y1 - y0) * S + 2 * pad, X: function (x) { return pad + (x - x0) * S; }, Y: function (y) { return pad + (y1 - y) * S; } };
  }
  function ground(F, x0, x1) { return '<rect class="pj-u7-gnd" x="' + P(F.X(x0)) + '" y="' + P(F.Y(0)) + '" width="' + P((x1 - x0) * F.S) + '" height="' + P(Math.max(6, F.H - F.Y(0))) + '"/>' + ln([F.X(x0), F.Y(0)], [F.X(x1), F.Y(0)], 'pj-u7-gl'); }
  /* a value for a label: the student's own number (as typed) with its unit, or "?" */
  function shown(c, k) { var x = pl(c.get(k)); return isNaN(x) ? null : esc(String(c.get(k)).trim().replace(/^[θ∠]\s*=?\s*/, '').replace(/\s*(°|º|˚|deg(rees?)?|m²|m2|metres?|meters?|m)\s*$/i, '')); }
  function vv(c, k, unit) { var x = shown(c, k); return x == null ? '?' : x + (unit == null ? ' m' : unit); }

  /* ---- the ramp, side view, true scale: the landing (with a bit of the door) at the left, the ramp down to the right.
     Right angle at C (under the top of the ramp), θ at A (the foot), B at the top.
     o: { h, run, S, Wpx, labels: { rise, run, len }, tags (opp/adj/hyp colours), th (label at A), top (label at B), old, rail } */
  function rampSvg(o) {
    var h = o.h, run = o.run, F = frame(-2.0, run + 0.7, -0.75, h + 1.45, o.Wpx || 720, 14, o.maxS || 95);
    var X = F.X, Y = F.Y, A = [X(run), Y(0)], B = [X(0), Y(h)], C = [X(0), Y(0)], old = !!o.old;
    var s = svgOpen(F.W, F.H, 'pj-u7-ramp' + (old ? ' old' : ''), o.aria || 'A side view of the ramp: a right triangle');
    s += ground(F, -2.0, run + 0.7);
    // the wall and door, the landing
    s += '<rect class="pj-u7-wall" x="' + P(X(-2.0)) + '" y="' + P(Y(h + 1.45)) + '" width="' + P(1.35 * F.S) + '" height="' + P((h + 1.45) * F.S) + '"/>';
    s += '<rect class="pj-u7-door" x="' + P(X(-1.75)) + '" y="' + P(Y(h + 1.45)) + '" width="' + P(0.9 * F.S) + '" height="' + P(1.45 * F.S) + '"/>';
    s += '<rect class="pj-u7-land" x="' + P(X(-2.0)) + '" y="' + P(Y(h)) + '" width="' + P(2.0 * F.S) + '" height="' + P(h * F.S) + '"/>';
    // the ramp
    s += poly([B, A, C], 'pj-u7-rampf');
    if (o.rail && !old) { var pr = function (x) { return [X(x), Y(h * (1 - x / run) + 0.9)]; }; s += ln(pr(0), pr(run), 'pj-u7-rail'); for (var q = 0; q <= 4; q++) { var xq = run * q / 4; s += ln([X(xq), Y(h * (1 - xq / run))], pr(xq), 'pj-u7-post'); } }
    s += ln(B, A, 'pj-u7-surf' + (o.tags ? ' hypc' : ''));
    s += sqMark(C, [1, 0], [0, -1], 9);
    var L = o.labels || {}, yd = Y(-0.42);
    // run: below the ground
    s += dim([C[0], yd], [A[0], yd], o.tags ? 'adjc' : '') + tag((C[0] + A[0]) / 2, yd, L.run || 'run', o.tags ? 'adj' : '');
    // rise: on the landing's face
    s += dim([X(-0.18), Y(0)], [X(-0.18), Y(h)], o.tags ? 'oppc' : '') + tag(X(-1.05), Y(h / 2), L.rise || 'rise', o.tags ? 'opp' : '');
    // the sloped length: above the ramp
    s += tag(X(run * (o.th ? 0.36 : 0.48)), Y(h * (o.th ? 0.64 : 0.52) + (o.rail && !old ? 0.9 : 0)) - 22, L.len || 'ramp length', o.tags ? 'hyp' : '');
    // vertices
    s += tx(A[0] + 9, A[1] + 4, 'A', 'pj-u7-vx', ' text-anchor="start"') + tx(B[0] + 7, B[1] - 6, 'B', 'pj-u7-vx', ' text-anchor="start"') + tx(C[0] + 6, C[1] + 16, 'C', 'pj-u7-vx', ' text-anchor="start"');
    if (o.th) { var r = Math.min(150, run * F.S * 0.42), ta = Math.max(o.thA || 5, 1), dx = r + tw(o.th) / 2 + 12; s += '<path class="pj-u7-arc" d="' + arcD(A[0], A[1], r, 180 - ta, 180) + '"/>' + tag(A[0] - dx, A[1] - dx * Math.tan(ta * D2R) - 22, o.th, 'th'); }
    if (o.top) s += '<path class="pj-u7-arc" d="' + arcD(B[0], B[1], 26, 270, 270 + (90 - (o.thA || 5))) + '"/>' + tag(B[0] + 30 + tw(o.top) / 2, B[1] + 22, o.top, 'th');
    if (o.note) s += tx(X(run + 0.6), Y(h + 1.1), o.note, 'pj-u7-note', ' text-anchor="end"');
    return s + '</svg>';
  }

  /* ---- the landing slab from above (plan view), with the 3-4-5 triangle at the corner by the wall ----
     o: { W, D, k, labels: { l4, l3, d5, diag, d1, d2 }, diag2, tri } */
  function slabSvg(o) {
    var W = o.W, D = o.D, F = frame(-0.55, W + 0.55, -D - 0.75, 0.7, o.Wpx || 560, 10, 150), X = F.X, Y = F.Y;
    var s = svgOpen(F.W, F.H, 'pj-u7-slab', o.aria || 'The landing slab from above, with a 3-4-5 triangle at the corner');
    s += '<defs><pattern id="u7hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" stroke="#94a3b8" stroke-width="2"/></pattern></defs>';
    s += '<rect x="' + P(X(-0.55)) + '" y="' + P(Y(0.7)) + '" width="' + P((W + 1.1) * F.S) + '" height="' + P(0.7 * F.S) + '" fill="url(#u7hatch)" class="pj-u7-bwall"/>' + tx(X(W / 2), Y(0.3), 'BUILDING WALL', 'pj-u7-wl');
    s += '<rect class="pj-u7-slabf" x="' + P(X(0)) + '" y="' + P(Y(0)) + '" width="' + P(W * F.S) + '" height="' + P(D * F.S) + '"/>';
    s += '<rect class="pj-u7-door2" x="' + P(X(W / 2 - 0.45)) + '" y="' + P(Y(0) - 5) + '" width="' + P(0.9 * F.S) + '" height="7"/>';
    var L = o.labels || {}, C = [X(0), Y(0)];
    s += dim([X(0), Y(-D - 0.42)], [X(W), Y(-D - 0.42)]) + tag(X(W / 2), Y(-D - 0.42), L.W || W.toFixed(1) + ' m');
    s += dim([X(W + 0.3), Y(0)], [X(W + 0.3), Y(-D)]) + tag(X(W + 0.3), Y(-D / 2), L.D || D.toFixed(1) + ' m', '', '');
    if (o.diag2) s += ln([X(W), Y(0)], [X(0), Y(-D)], 'pj-u7-dg2') + tag(X(W * 0.28), Y(-D * 0.72), L.d2 || '', 'm2');
    if (o.diag) s += ln([X(0), Y(0)], [X(W), Y(-D)], 'pj-u7-dg') + tag(X(W * 0.72), Y(-D * 0.72), L.diag || 'diagonal = ?', o.diag2 ? 'm1' : 'hyp');
    if (o.k) {
      var k = o.k, p4 = [X(4 * k), Y(0)], p3 = [X(0), Y(-3 * k)];
      s += '<g class="pj-u7-tri">' + poly([C, p4, p3], 'pj-u7-trif') + ln(C, p4, 'pj-u7-t4') + ln(C, p3, 'pj-u7-t3') + ln(p4, p3, 'pj-u7-t5') + '</g>';
      s += '<circle class="pj-u7-mk" cx="' + P(p4[0]) + '" cy="' + P(p4[1]) + '" r="5"/><circle class="pj-u7-mk" cx="' + P(p3[0]) + '" cy="' + P(p3[1]) + '" r="5"/>';
      s += tag((C[0] + p4[0]) / 2, C[1] + 16, L.l4 || (4 * k).toFixed(1) + ' m', 'adj') + tag(C[0] + tw(L.l3 || '0.00 m') / 2 + 16, (C[1] + p3[1]) / 2, L.l3 || (3 * k).toFixed(1) + ' m', 'opp');
      s += tag((p4[0] + p3[0]) / 2 + 22, (p4[1] + p3[1]) / 2 + 8, L.d5 || 'diagonal', 'hyp');
      s += sqMark(C, [1, 0], [0, 1], 12);
    }
    return s + '</svg>';
  }

  /* ---- the stairs, side view: n steps up to the landing at the right; the stringer is the hypotenuse; a handrail above.
     o: { n, r, t, labels: { R, rise, str, th, need }, th, rail } */
  function stairsSvg(o) {
    var n = o.n, r = o.r, t = o.t, R = n * t, h = n * r, F = frame(-t - 0.45, R + 0.95, -0.42, h + 1.25, o.Wpx || 560, 12, 230), X = F.X, Y = F.Y;
    var s = svgOpen(F.W, F.H, 'pj-u7-stairs', o.aria || 'A side view of the stairs and the handrail');
    s += ground(F, -t - 0.45, R + 0.95);
    s += '<rect class="pj-u7-land" x="' + P(X(R)) + '" y="' + P(Y(h)) + '" width="' + P(0.95 * F.S) + '" height="' + P(h * F.S) + '"/>';
    var pts = [[X(0), Y(0)]];
    for (var i = 0; i < n; i++) { pts.push([X(i * t), Y((i + 1) * r)]); pts.push([X((i + 1) * t), Y((i + 1) * r)]); }
    pts.push([X(R), Y(0)]);
    s += poly(pts, 'pj-u7-stepf');
    var A = [X(0), Y(0)], B = [X(R), Y(h)], C = [X(R), Y(0)], L = o.labels || {};
    s += ln(A, B, 'pj-u7-strg') + sqMark(C, [-1, 0], [0, -1], 10);
    s += dim([A[0], Y(-0.22)], [C[0], Y(-0.22)], 'adjc') + tag((A[0] + C[0]) / 2, Y(-0.22), L.R || 'total run', 'adj');
    s += dim([X(R + 0.2), Y(0)], [X(R + 0.2), Y(h)], 'oppc') + tag(X(R + 0.58), Y(h / 2), L.rise || 'rise', 'opp');
    s += tag(X(R * 0.64), Y(h * 0.28), L.str || 'stringer', 'hyp');
    var th = atanD(h / R), rr = Math.min(70, R * F.S * 0.32);
    s += '<path class="pj-u7-arc" d="' + arcD(A[0], A[1], rr, 0, th) + '"/>' + tx(A[0] + rr + 6, A[1] - 6, L.th || 'θ', 'pj-u7-thl', ' text-anchor="start"');
    if (o.rail) {
      var y0 = -t * h / R + 0.9, p1 = [X(-t), Y(y0)], p2 = [X(R), Y(h + 0.9)];
      s += ln(p1, p2, 'pj-u7-rail2') + ln(p2, [X(R + 0.3), Y(h + 0.9)], 'pj-u7-rail2');
      s += ln([X(-t), Y(0)], p1, 'pj-u7-post') + ln([X(R), Y(h)], p2, 'pj-u7-post');
      s += dim([X(-t), Y(y0 + 0.16)], [X(0), Y(y0 + 0.16)]) + tx(X(-t / 2), Y(y0 + 0.26), '1 tread', 'pj-u7-note');
      s += tag((p1[0] + p2[0]) / 2 - 18, (p1[1] + p2[1]) / 2 - 22, L.need || 'sloped rail', 'hyp');
    }
    return s + '</svg>';
  }

  /* ---- the light pole: a crew member sights the top with a clinometer; two guy wires ----
     o: { d, te, e, H, a, b, b2, f2, labels: { d, e, te, H, a, b, wire, wang, b2, f2 }, wires, wire2 } */
  function poleSvg(o) {
    var x1 = o.d + Math.max(o.b, 0) + 1.2, F = frame(-2.6, x1, -1.25, o.H + 1.1, o.Wpx || 720, 12, 46), X = F.X, Y = F.Y, L = o.labels || {};
    var s = svgOpen(F.W, F.H, 'pj-u7-pole', o.aria || 'Measuring the light pole with a clinometer, and its guy wires');
    s += ground(F, -2.6, x1);
    // the person (eyes at e)
    var ex = X(0), ey = Y(o.e), hs = F.S;
    s += '<g class="pj-u7-man"><circle cx="' + P(ex) + '" cy="' + P(Y(o.e + 0.12)) + '" r="' + P(0.16 * hs) + '"/>' + ln([ex, Y(o.e - 0.05)], [ex, Y(0.85)]) + ln([ex, Y(0.85)], [ex - 0.22 * hs, Y(0)]) + ln([ex, Y(0.85)], [ex + 0.22 * hs, Y(0)]) + ln([ex, Y(o.e - 0.3)], [ex + 0.3 * hs, Y(o.e - 0.05)]) + '</g>';
    // the pole and its lamp
    var px = X(o.d);
    s += ln([px, Y(0)], [px, Y(o.H)], 'pj-u7-polel') + ln([px, Y(o.H)], [px - 0.9 * hs, Y(o.H)], 'pj-u7-arm') + '<path class="pj-u7-lamp" d="M' + P(px - 1.25 * hs) + ' ' + P(Y(o.H) - 1) + 'h' + P(0.55 * hs) + 'l-' + P(0.08 * hs) + ' ' + P(0.22 * hs) + 'h-' + P(0.4 * hs) + 'z"/>';
    // the sight line, the horizontal, the angle of elevation
    s += ln([ex, ey], [px, ey], 'pj-u7-hz') + ln([ex, ey], [px, Y(o.H)], 'pj-u7-sight');
    s += '<path class="pj-u7-arc" d="' + arcD(ex, ey, 46, 0, o.te) + '"/>' + tag(ex + 66 + tw(L.te || '') / 2, ey - 14, L.te || '', 'th');
    s += dim([X(0), Y(0) + 46], [px, Y(0) + 46], 'adjc') + tag((ex + px) / 2, Y(0) + 46, L.d || '', 'adj');
    s += dim([X(-0.55), Y(0)], [X(-0.55), ey]) + tag(X(-0.55) - 12 - tw(L.e || '') / 2, Y(o.e / 2), L.e || '', 'sm');
    s += dim([px + 12, ey], [px + 12, Y(o.H)], 'oppc') + tag(px + 18 + tw(L.opp || '') / 2, Y((o.e + o.H) / 2), L.opp || '', 'opp');
    if (L.H) s += tag(px + 18 + tw(L.H) / 2, Y(o.H) - 2, L.H, 'hyp');
    if (o.wires) {
      var at = [px, Y(o.a)], an = [X(o.d + o.b), Y(0)], wang = atanD(o.a / o.b);
      s += ln(at, an, 'pj-u7-wire') + '<circle class="pj-u7-anc" cx="' + P(an[0]) + '" cy="' + P(an[1]) + '" r="4"/>';
      s += '<path class="pj-u7-arc" d="' + arcD(an[0], an[1], 28, 180 - wang, 180) + '"/>' + (L.wang ? tag(an[0] - 34 - tw(L.wang) / 2, an[1] - 13, L.wang, 'th') : '');
      s += tag((at[0] + an[0]) / 2 + 14 + tw(L.wire || '') / 2, (at[1] + an[1]) / 2 - 8, L.wire || 'wire', 'hyp');
      s += tag(px - 10 - tw(L.a || '') / 2, Y(o.a * 0.55), L.a || '', 'opp');
      s += tag((px + an[0]) / 2, Y(0) + 15, L.b || '', 'adj');
      if (o.wire2) {
        var a2 = [X(o.d - o.b2), Y(0)];
        s += ln(at, a2, 'pj-u7-wire w2') + '<circle class="pj-u7-anc" cx="' + P(a2[0]) + '" cy="' + P(a2[1]) + '" r="4"/>';
        s += '<path class="pj-u7-arc" d="' + arcD(a2[0], a2[1], 28, 0, o.f2) + '"/>' + tag(a2[0] + 36 + tw(L.f2 || '') / 2, a2[1] - 13, L.f2 || '', 'th');
        s += tag((a2[0] + px) / 2, Y(0) + 15, L.b2 || '?', 'adj');
      }
    }
    return s + '</svg>';
  }

  /* ---- the roof camera: it looks down at the foot of the ramp. o: { roof, h, run, labels: { roof, run, dep, elev } } */
  function camSvg(o) {
    var F = frame(-1.3, o.run + 0.8, -0.8, o.roof + 0.9, o.Wpx || 640, 12, 62), X = F.X, Y = F.Y, L = o.labels || {};
    var s = svgOpen(F.W, F.H, 'pj-u7-cam', o.aria || 'A camera on the roof edge looks down at the foot of the ramp');
    s += ground(F, -1.3, o.run + 0.8);
    s += '<rect class="pj-u7-wall" x="' + P(X(-1.3)) + '" y="' + P(Y(o.roof)) + '" width="' + P(1.3 * F.S) + '" height="' + P(o.roof * F.S) + '"/>';
    s += poly([[X(0), Y(o.h)], [X(o.run), Y(0)], [X(0), Y(0)]], 'pj-u7-rampf') + ln([X(0), Y(o.h)], [X(o.run), Y(0)], 'pj-u7-surf');
    var Cm = [X(0), Y(o.roof)], Ft = [X(o.run), Y(0)], dep = atanD(o.roof / o.run);
    s += '<rect class="pj-u7-camb" x="' + P(Cm[0] - 4) + '" y="' + P(Cm[1] - 9) + '" width="20" height="12" rx="3" transform="rotate(' + P(dep * 0.6) + ' ' + P(Cm[0]) + ' ' + P(Cm[1]) + ')"/>';
    s += ln(Cm, [X(o.run + 0.6), Cm[1]], 'pj-u7-hz') + tx(X(o.run + 0.55), Cm[1] - 7, 'horizontal', 'pj-u7-note', ' text-anchor="end"');
    s += ln(Cm, Ft, 'pj-u7-sight') + ln(Ft, [X(o.run + 0.6), Y(0)], 'pj-u7-hz');
    s += '<path class="pj-u7-arc" d="' + arcD(Cm[0], Cm[1], 64, -dep, 0) + '"/>' + tag(Cm[0] + 96 + tw(L.dep || '') / 2, Cm[1] + 14 + 0.6 * 64 * Math.sin(dep * D2R), L.dep || 'depression', 'th');
    s += '<path class="pj-u7-arc" d="' + arcD(Ft[0], Ft[1], 54, 180 - dep, 180) + '"/>' + tag(Ft[0] - 70 - tw(L.elev || '') / 2, Ft[1] - 38, L.elev || 'elevation', 'th');
    s += dim([X(-0.65), Y(0)], [X(-0.65), Y(o.roof)], 'oppc') + tag(X(-0.65), Y(o.roof / 2), L.roof || '', 'opp');
    s += dim([X(0), Y(-0.45)], [Ft[0], Y(-0.45)], 'adjc') + tag((X(0) + Ft[0]) / 2, Y(-0.45), L.run || '', 'adj');
    return s + '</svg>';
  }

  /* ---- the whole site, front view: the building, the landing and stairs, the old ramp (left), the new ramp (right),
     the light pole, the roof camera. o: { s (a site-like object), mode 'intro' | 'card', L (labels) } */
  var STYLE = { curl: { fill: '#d5e4ef', trim: '#5b7c99' }, lib: { fill: '#c97a5d', trim: '#7a3b26' }, hall: { fill: '#ebdfc4', trim: '#8a6d3b' }, ex: { fill: '#d6e6cf', trim: '#4d7a46' } };
  function sceneSvg(S, o) {
    o = o || {}; var card = o.mode === 'card', L = o.L || {}, st = STYLE[S.style] || STYLE.curl;
    var xl = -(S.W / 2 + S.orun + 2.4), xr = S.W / 2 + Math.max(5.5, S.run * 0.55), xp = S.W / 2 + S.run + 2.2;
    var x0 = xl - 0.4, x1 = Math.max(xr + 0.4, xp + S.b + 1.2), top = Math.max(S.roof + (S.style === 'hall' ? 1.6 : S.style === 'curl' ? 1.3 : 0.6), S.H) + 0.9;
    var F = frame(x0, x1, -0.9, top, o.Wpx || 760, 8, 60), X = F.X, Y = F.Y, hs = F.S;
    var s = svgOpen(F.W, F.H, 'pj-u7-scene' + (card ? ' card' : ''), o.aria || 'The building, its entrance, the ramps and the light pole');
    s += '<rect class="pj-u7-sky" x="0" y="0" width="' + P(F.W) + '" height="' + P(Y(0)) + '"/>';
    s += ground(F, x0, x1);
    // the building
    var bx = X(xl), bw = (xr - xl) * hs, by = Y(S.roof), bh = S.roof * hs;
    if (S.style === 'curl') s += '<path class="pj-u7-roof" d="M' + P(bx - 4) + ' ' + P(by) + ' Q' + P(bx + bw / 2) + ' ' + P(by - 2.6 * hs) + ' ' + P(bx + bw + 4) + ' ' + P(by) + 'Z" fill="' + st.trim + '"/>';
    if (S.style === 'hall') s += poly([[X(-3.2), by], [X(0), by - 1.5 * hs], [X(3.2), by]], 'pj-u7-roof', ' fill="' + st.trim + '"') + '<circle cx="' + P(X(0)) + '" cy="' + P(by - 0.62 * hs) + '" r="' + P(0.42 * hs) + '" fill="#fff" stroke="' + st.trim + '" stroke-width="2"/>' + ln([X(0), by - 0.62 * hs], [X(0), by - 0.92 * hs], '', ' stroke="#334155" stroke-width="2"') + ln([X(0), by - 0.62 * hs], [X(0.2), by - 0.62 * hs], '', ' stroke="#334155" stroke-width="2"');
    s += '<rect x="' + P(bx) + '" y="' + P(by) + '" width="' + P(bw) + '" height="' + P(bh) + '" fill="' + st.fill + '" stroke="' + st.trim + '" stroke-width="2"/>';
    if (S.style === 'curl') for (var cx = xl + 0.6; cx < xr; cx += 0.7) s += ln([X(cx), by + 2], [X(cx), Y(0)], '', ' stroke="' + st.trim + '" stroke-opacity=".18" stroke-width="1.5"');
    if (S.style === 'lib') for (var cy = 0.3; cy < S.roof; cy += 0.3) s += ln([bx, Y(cy)], [bx + bw, Y(cy)], '', ' stroke="#fff" stroke-opacity=".22" stroke-width="1"');
    s += '<rect x="' + P(bx) + '" y="' + P(by) + '" width="' + P(bw) + '" height="' + P(0.28 * hs) + '" fill="' + st.trim + '"/>';
    // windows (away from the door)
    [xl + 1.2, xl + 3.6, S.W / 2 + 1.6, S.W / 2 + 4.0].forEach(function (wx) { if (wx + 1.6 > xr - 0.4 || (wx > -S.W / 2 - 1.8 && wx < S.W / 2 + 0.6)) return; s += '<rect class="pj-u7-win" x="' + P(X(wx)) + '" y="' + P(Y(S.h + 2.7)) + '" width="' + P(1.5 * hs) + '" height="' + P(1.3 * hs) + '" stroke="' + st.trim + '"/>'; });
    // the sign
    var sw = Math.max(tw(S.sign, 14) + 24, 3.4 * hs);
    s += '<rect class="pj-u7-sign" x="' + P(X(0) - sw / 2) + '" y="' + P(Y(S.h + 3.0)) + '" width="' + P(sw) + '" height="' + P(0.62 * hs) + '" rx="4" fill="' + st.trim + '"/>' + tx(X(0), Y(S.h + 3.0) + 0.31 * hs + 5, esc(S.sign), 'pj-u7-signt');
    // door, landing, stairs (front view: the risers)
    s += '<rect class="pj-u7-door" x="' + P(X(-0.5)) + '" y="' + P(Y(S.h + 2.1)) + '" width="' + P(1.0 * hs) + '" height="' + P(2.1 * hs) + '"/>' + ln([X(0), Y(S.h + 2.1)], [X(0), Y(S.h)], '', ' stroke="#fff" stroke-opacity=".6" stroke-width="1.5"');
    s += '<rect class="pj-u7-land" x="' + P(X(-S.W / 2)) + '" y="' + P(Y(S.h)) + '" width="' + P(S.W * hs) + '" height="' + P(S.h * hs) + '"/>';
    for (var i = 1; i < S.n; i++) s += ln([X(-S.W / 2 + 0.25), Y(i * S.h / S.n)], [X(S.W / 2 - 0.25), Y(i * S.h / S.n)], 'pj-u7-riser');
    // the old ramp (left): too steep
    var OA = [X(-S.W / 2 - S.orun), Y(0)], OB = [X(-S.W / 2), Y(S.h)], OC = [X(-S.W / 2), Y(0)];
    s += poly([OB, OA, OC], card ? 'pj-u7-oldf gone' : 'pj-u7-oldf') + ln(OB, OA, card ? 'pj-u7-olds gone' : 'pj-u7-olds');
    // the new ramp (right)
    var NA = [X(S.W / 2 + S.run), Y(0)], NB = [X(S.W / 2), Y(S.h)], NC = [X(S.W / 2), Y(0)];
    s += poly([NB, NA, NC], card ? 'pj-u7-rampf' : 'pj-u7-ghost') + ln(NB, NA, card ? 'pj-u7-surf' : 'pj-u7-ghostl');
    if (card) { s += ln([NB[0], Y(S.h + 0.9)], [NA[0], Y(0.9)], 'pj-u7-rail'); for (var q = 0; q <= 5; q++) { var xq = S.W / 2 + S.run * q / 5, yq = S.h * (1 - q / 5); s += ln([X(xq), Y(yq)], [X(xq), Y(yq + 0.9)], 'pj-u7-post'); } }
    // the light pole and its guy wire, the lamp's light
    var px = X(xp);
    s += '<path class="pj-u7-glow" d="M' + P(px - 1.2 * hs) + ' ' + P(Y(S.H) + 0.2 * hs) + ' L' + P(X(S.W / 2 + S.run * 0.35)) + ' ' + P(Y(0)) + ' L' + P(px - 0.1 * hs) + ' ' + P(Y(0)) + ' Z"/>';
    s += ln([px, Y(0)], [px, Y(S.H)], 'pj-u7-polel') + ln([px, Y(S.H)], [px - 0.9 * hs, Y(S.H)], 'pj-u7-arm') + '<path class="pj-u7-lamp" d="M' + P(px - 1.3 * hs) + ' ' + P(Y(S.H) - 1) + 'h' + P(0.6 * hs) + 'l-' + P(0.1 * hs) + ' ' + P(0.25 * hs) + 'h-' + P(0.4 * hs) + 'z"/>';
    s += ln([px, Y(S.a)], [X(xp + S.b), Y(0)], 'pj-u7-wire') + '<circle class="pj-u7-anc" cx="' + P(X(xp + S.b)) + '" cy="' + P(Y(0)) + '" r="3"/>';
    if (card) { s += '<rect class="pj-u7-camb" x="' + P(NB[0] - 4) + '" y="' + P(by - 4) + '" width="16" height="10" rx="3"/>' + ln([NB[0], by], NA, 'pj-u7-sight'); }
    // labels
    if (card) {
      if (L.len) s += tag(X(S.W / 2 + S.run * 0.5), Y(S.h * 0.5 + 1.5), L.len, 'hyp');
      if (L.ang) s += tag(NA[0] - 54, NA[1] + 15, L.ang, 'th');
      if (L.H) s += tag(px + tw(L.H) / 2 + 10, Y(S.H) + 2, L.H, 'opp');
      if (L.wire) s += tag(X(xp + S.b * 0.5) + tw(L.wire) / 2 + 12, Y(S.a * 0.62), L.wire, 'hyp');
      if (L.dep) s += tag(NB[0] + tw(L.dep) / 2 + 14, by + 26, L.dep, 'th');
      if (L.stairs) s += tag(X(0), Y(-0.45), L.stairs, 'adj');
      s += tx(OA[0] + 4, Y(0) - 6, 'old ramp removed', 'pj-u7-note', ' text-anchor="start"');
    } else {
      s += tag(X(-S.W / 2 - S.orun / 2) - 10, Y(S.h + 1.0), 'old ramp: too steep!', 'bad');
      s += tag(X(S.W / 2 + S.run / 2), Y(S.h + 0.9), 'new ramp goes here', 'hyp');
      s += tag(X(0), Y(-0.45), 'entrance ' + S.h.toFixed(2) + ' m up · ' + S.n + ' steps', 'adj');
      s += tag(px + 52, Y(S.H) + 16, 'light pole', 'sm');
    }
    return s + '</svg>';
  }
  function siteFor(c, S) { return { style: S.id, sign: S.B.sign, W: S.W, h: S.h, n: S.n, orun: S.orun, run: S.run, roof: S.roof, H: S.H, a: S.a, b: S.b }; }

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function grid(box, cls) { var g = el('div', 'pj-grid3 pj-u7-row' + (cls ? ' ' + cls : '')); box.appendChild(g); return g; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function tip(h) { return el('p', 'pj-tip', h); }
  function chip(h) { return '<div class="pj-x-chip">' + h + '</div>'; }
  function eq(left, right, unit, n, delay) { return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="num"' + (delay ? ' data-delay="' + delay + '"' : '') + '>' + fx(right, n == null ? 2 : n) + '</span>' + (unit == null ? ' m' : unit) + '</b></div>'; }
  /* live drawings: redrawn whenever the student types */
  function live(c, cls, fn) { var w = el('div', 'pj-u7-draw' + (cls ? ' ' + cls : ''), fn()); (c._u7lv = c._u7lv || []).push(function () { if (w.isConnected || c.ro) w.innerHTML = fn(); }); return w; }
  function upd(c) { return function () { (c._u7lv || []).forEach(function (f) { try { f(); } catch (e) {} }); }; }
  /* a number box with its unit after it */
  function inN(c, k, o) { o = o || {}; var dp = o.dp == null ? 2 : o.dp, unit = o.unit == null ? 'm' : o.unit; var w = c.input(k, { kind: 'num', ph: o.ph != null ? o.ph : (dp ? '0.' + '0000'.slice(0, dp) : '0'), aria: o.aria || k, cls: 'pj-u7-in', onInput: upd(c) }); if (unit) w.appendChild(el('span', 'pj-post', unit)); return w; }
  /* the formula and the student's own numbers, as a little working line under a box */
  function work(h) { return el('div', 'pj-u7-work', h); }
  var RATIOS = [{ v: 'sin', html: '<b>sin</b> = opp ÷ hyp' }, { v: 'cos', html: '<b>cos</b> = adj ÷ hyp' }, { v: 'tan', html: '<b>tan</b> = opp ÷ adj' }];
  var SIDES = [{ v: 'opp', t: 'opposite (opp)' }, { v: 'adj', t: 'adjacent (adj)' }, { v: 'hyp', t: 'hypotenuse (hyp)' }];
  function yn(c, k, yes, no, o) { return c.choice(k, [{ v: 'yes', html: yes }, { v: 'no', html: no }], Object.assign({ cls: 'pj-seg pj-u7-yn' }, o || {})); }

  /* ================= the worked examples: the Aspen Ramp Crew at the seniors' centre in Vulcan ================= */
  var EX = { style: 'ex', sign: 'SENIORS’ CENTRE', W: 2.0, h: 0.63, n: 3, orun: 3.00, run: 7.56, roof: 4.8, H: 10.97, a: 5.0, b: 3.0 };
  var EXS = { n: 3, r: 0.21, t: 0.27 };

  /* ================= Checkpoint 1: the job — pick the building and name the crew ================= */
  var cp1 = {
    id: 'job', title: 'Pick the building and your crew', needs: [], graded: false,
    goal: 'Choose the <b>building</b> your crew will fix up and give your crew a <b>name</b>. Every crew gets its own building sizes, so your numbers won’t match a friend’s.',
    example: { title: 'The Aspen Ramp Crew takes a job in Vulcan', scene: '<div class="pj-u7-exwrap">' + sceneSvg(EX, { aria: 'The seniors’ centre in Vulcan' }) + '</div>', steps: [
      { cap: 'The <b>seniors’ centre in Vulcan</b> has 3 steps up to its door and an old ramp that is <b>far too steep</b> for a wheelchair or a walker.', html: chip('Entrance: <b>0.63 m</b> above the ground') },
      { cap: 'The town hires the <b>Aspen Ramp Crew</b>. Their job: a new <b>accessible ramp</b>, new <b>entry stairs</b> with a handrail, and a <b>light pole</b> so the ramp is safe at night.', html: chip('Crew: <b><span class="pj-type">Aspen Ramp Crew</span></b>') },
      { cap: 'Every part of this job is a <b>right triangle</b>: the ramp, the stairs, the pole and its wire. That’s Unit 7!', html: chip('ramp · stairs · light pole = right triangles') }] },
    render: function (box, c) {
      c._u7lv = [];
      var S0 = site(c);
      box.appendChild(el('div', 'pj-u7-brief', '<span class="pj-u7-bi">♿</span><div>A building in town needs to be <b>accessible</b>: a ramp anyone can use, new stairs with a handrail, and a light pole for the dark winter evenings. Your crew is in charge of the design. Every number on your plans has to be right before anything is built!</div>'));
      part(box, 'A', 'Pick the building', 'You can change it later, but then you’ll redo the checkpoints.');
      box.appendChild(c.choice('bld', BLD_IDS.map(function (k) { var B = BLD[k]; return { v: k, html: '<span class="pj-ti">' + B.icon + '</span><b>' + B.name + '</b><small>' + B.blurb + '</small>' }; }), { cls: 'pj-types pj-u7-blds', aria: 'Building', onPick: function () { c.redraw(); } }));
      if (!S0) return;
      part(box, 'B', 'Name your crew', 'It goes on your build card.');
      box.appendChild(c.text('crew', { ph: 'e.g. ' + CREWS[0], max: 30, aria: 'Crew name', cls: 'pj-u7-name', onInput: upd(c) }));
      var ideas = el('div', 'pj-ideas', '<span>Need an idea?</span>'); CREWS.forEach(function (n) { var b = el('button', 'pj-idea', esc(n)); b.type = 'button'; if (c.ro) b.disabled = true; b.addEventListener('click', function () { c.set('crew', n); c.redraw(); }); ideas.appendChild(b); }); box.appendChild(ideas);
      var w = el('div', 'pj-u7-plan');
      var head = live(c, 'pj-u7-plan-h', function () { return '<span>' + S0.B.icon + '</span><div><small>' + esc(S0.town) + ' · ' + esc(S0.B.name) + '</small><b>' + esc(crewName(c)) + '</b></div><em>Your job: a ramp, stairs and a light pole</em>'; });
      w.appendChild(head);
      w.appendChild(el('div', 'pj-u7-draw', sceneSvg(siteFor(c, S0), { aria: 'Your building: the entrance, the old ramp, where the new ramp goes, and the light pole' })));
      w.appendChild(el('div', 'pj-u7-facts', '<span>Entrance height <b>' + fx(S0.h) + ' m</b></span><span>Stairs <b>' + S0.n + ' steps</b></span><span>Landing <b>' + S0.W.toFixed(1) + ' m × ' + S0.D.toFixed(1) + ' m</b></span><span>Roof edge <b>' + S0.roof.toFixed(1) + ' m</b> up</span>'));
      box.appendChild(w);
      box.appendChild(tip('Lengths are in <b>metres</b>. Builders measure to the <b>centimetre</b>, so most answers are rounded to <b>2 decimal places</b> (8.67 m). Angles go to the nearest degree. Set your calculator to <b>DEG</b> mode now!'));
    },
    check: function (c) {
      var out = [c.msg(!!site(c), 'Pick a building (Part A).')]; if (!site(c)) return out;
      out.push(c.need('crew', { min: 2, label: 'Crew name', hint: 'Give your crew a name.' }));
      return out;
    },
    solve: function (c) { if (!c.get('bld')) c.set('bld', 'curl'); c.set('crew', CREWS[hv(c, 'crewn') % CREWS.length]); }
  };

  /* ================= Checkpoint 2: square the landing (3-4-5; is it a right triangle? the diagonal) ================= */
  var VERD = [{ v: 'right', html: '<b>Square</b> — exactly 90°' }, { v: 'wide', html: '<b>Too open</b> — more than 90°' }, { v: 'narrow', html: '<b>Too closed</b> — less than 90°' }];
  var BIG = [{ v: 'acc', html: 'A small measuring mistake matters <b>less</b> on a bigger triangle' }, { v: 'easy', html: 'The numbers are easier to multiply' }, { v: 'same', html: 'It doesn’t matter at all' }];
  function verdict(S, k) { var a = 25 * k * k, m = 5 * k + S.delta, d = m * m - a; return Math.abs(d) < 1e-9 ? 'right' : d > 0 ? 'wide' : 'narrow'; }
  var cp2 = {
    id: 'landing', title: 'Square the landing', needs: ['u7l2', 'u7l3'],
    goal: 'The concrete <b>landing</b> at the door must have <b>square</b> (90°) corners. Use the <b>3-4-5 method</b> to square a corner, test a measured triangle with <b>a² + b² = c²</b>, and check the slab by its <b>diagonals</b>.',
    example: { title: 'The Aspen Ramp Crew squares their landing', scene: '<div class="pj-u7-exwrap pj-u7-exsm">' + slabSvg({ W: 2.5, D: 1.9, k: 0.6, diag: true, labels: { l4: '2.4 m', l3: '1.8 m', d5: '3.0 m?', diag: '3.14 m', W: '2.5 m', D: '1.9 m' }, Wpx: 460 }).replace('BUILDING WALL', 'WALL') + '</div>', steps: [
      { cap: 'A triangle with sides <b>3, 4 and 5</b> always has a right angle, because 3² + 4² = 9 + 16 = 25 = 5². Builders use this to make a <b>square corner</b>.', html: eq('3² + 4²', 25, ' = 5²', 0) },
      { cap: 'A <b>bigger</b> triangle is more accurate. The crew multiplies by 0.6: they mark <b>1.8 m</b> along one form board and <b>2.4 m</b> along the other.', html: chip('3 × 0.6 = 1.8 · 4 × 0.6 = 2.4 · 5 × 0.6 = <b>3.0</b>') },
      { cap: 'They measure between the two marks: <b>3.04 m</b>, not 3.0 m. Is the corner square? Test it: is a² + b² equal to c²?', html: eq('1.8² + 2.4² = 3.24 + 5.76', 9, ' m²', 2) },
      { cap: 'Square the measured diagonal: 3.04² = 9.2416 ≈ <b>9.24</b>. That’s <b>more</b> than 9.00, so the corner is a bit <b>more than 90°</b> (too open). They push the boards in until the diagonal is 3.0 m.', html: eq('c² = 3.04²', 9.24, ' m²', 2) },
      { cap: 'Last, the whole slab: 2.5 m by 1.9 m. Its diagonal is the hypotenuse: c = √(2.5² + 1.9²) = √9.86. If <b>both</b> diagonals measure the same, all four corners are square.', html: eq('√(2.5² + 1.9²)', 3.14) }] },
    render: function (box, c) {
      c._u7lv = []; var S = site(c); if (!S) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'Make a 3-4-5 triangle', 'Your landing is <b>' + S.W.toFixed(1) + ' m</b> along the wall and <b>' + S.D.toFixed(1) + ' m</b> out. Pick a size for your 3-4-5 triangle, then work out its sides.');
      box.appendChild(field('Multiply 3, 4 and 5 by', c.choice('k', KS.map(function (k) { return { v: k, html: '× ' + k }; }), { cls: 'pj-seg pj-seg-sm', aria: 'Size of the 3-4-5 triangle', onPick: function () { c.redraw(); } }), 'pj-u7-one'));
      var k = kOf(c);
      box.appendChild(live(c, '', function () { return slabSvg({ W: S.W, D: S.D, k: k || null, diag: true, labels: { l4: vv(c, 'leg4'), l3: vv(c, 'leg3'), d5: vv(c, 'd5'), diag: 'diagonal = ' + vv(c, 'diag') }, aria: 'Your landing from above' }); }));
      if (!k) return;
      var g = grid(box);
      g.appendChild(field('Mark along the wall (4 × ' + k + ')', inN(c, 'leg4', { aria: 'Mark along the wall' })));
      g.appendChild(field('Mark along the side (3 × ' + k + ')', inN(c, 'leg3', { aria: 'Mark along the side' })));
      g.appendChild(field('The diagonal should be (5 × ' + k + ')', inN(c, 'd5', { aria: 'Diagonal of the 3-4-5 triangle' })));
      box.appendChild(field('Why is a bigger 3-4-5 triangle better?', c.choice('big', BIG, { cls: 'pj-u7-opts', aria: 'Why bigger is better' }), 'pj-wide'));
      var m = 5 * k + S.delta, a = 3 * k, b = 4 * k;
      part(box, 'B', 'Is it a right triangle?', 'Your crew marks <b>' + fx(a) + ' m</b> and <b>' + fx(b) + ' m</b>, then measures between the marks: <b>' + fx(m) + ' m</b>. Test it with the Pythagorean theorem.');
      var g2 = grid(box);
      g2.appendChild(field('a² + b² = ' + fx(a) + '² + ' + fx(b) + '²', inN(c, 'sumsq', { unit: 'm²', aria: 'a squared plus b squared' })));
      g2.appendChild(field('c² = ' + fx(m) + '²  (2 decimal places)', inN(c, 'csq', { unit: 'm²', aria: 'c squared' })));
      box.appendChild(field('So the corner is…', c.choice('verdict', VERD, { cls: 'pj-u7-opts', aria: 'Is the corner square?' }), 'pj-wide'));
      part(box, 'C', 'Check the whole slab', 'The slab’s <b>diagonal</b> is the hypotenuse of a right triangle with legs ' + S.W.toFixed(1) + ' m and ' + S.D.toFixed(1) + ' m.');
      box.appendChild(field('Diagonal = √(' + S.W.toFixed(1) + '² + ' + S.D.toFixed(1) + '²)', inN(c, 'diag', { aria: 'Diagonal of the slab' }), 'pj-u7-one'));
      box.appendChild(el('div', 'pj-u7-draw pj-u7-sm', slabSvg({ W: S.W, D: S.D, diag: true, diag2: true, labels: { diag: fx(S.d1) + ' m', d2: fx(S.d2) + ' m' }, Wpx: 420, aria: 'The two diagonals your crew measured' })));
      box.appendChild(field('The crew measures both diagonals of the forms: <b>' + fx(S.d1) + ' m</b> and <b>' + fx(S.d2) + ' m</b>. Are all the corners square?', yn(c, 'square', 'Yes — square', 'No — not yet', { aria: 'Are the corners square?' }), 'pj-wide'));
    },
    check: function (c) {
      var S = site(c); if (!S) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var k = kOf(c), out = [c.msg(!!k, 'Pick a size for your 3-4-5 triangle (Part A).')]; if (!k) return out;
      var mult = 'Multiply by your size: ';
      out.push(numR(c, 'leg4', 4 * k, { label: 'Along the wall', wrong: [{ v: 4, hint: mult + '4 × ' + k + '.' }, { v: 4 + k, hint: 'Multiply, don’t add: 4 × ' + k + '.' }], hint: '4 × ' + k + '.' }));
      out.push(numR(c, 'leg3', 3 * k, { label: 'Along the side', wrong: [{ v: 3, hint: mult + '3 × ' + k + '.' }, { v: 3 + k, hint: 'Multiply, don’t add: 3 × ' + k + '.' }], hint: '3 × ' + k + '.' }));
      out.push(numR(c, 'd5', 5 * k, { label: '3-4-5 diagonal', wrong: [{ v: 7 * k, hint: 'You added the two marks. The diagonal of a 3-4-5 triangle is the <b>5</b> side: 5 × ' + k + '.' }, { v: 5, hint: mult + '5 × ' + k + '.' }, { v: 25 * k * k, hint: 'That’s c², not c. The diagonal is just 5 × ' + k + '.' }], hint: 'The diagonal is the 5 side: 5 × ' + k + '.' }));
      out.push(c.equals('big', 'acc', { label: 'Why bigger', wrong: { easy: 'Think about measuring: if your tape is off by 1 cm, does that matter more on a tiny triangle or a big one?', same: 'It does matter. A 1 cm slip on a tiny triangle throws the angle off much more than on a big one.' } }));
      var a = 3 * k, b = 4 * k, m = 5 * k + S.delta;
      out.push(numR(c, 'sumsq', a * a + b * b, { unit: 'm²', label: 'a² + b²', wrong: [{ v: a + b, hint: 'Square each leg <b>first</b>, then add: ' + fx(a) + '² + ' + fx(b) + '².' }, { v: sq(a + b), hint: 'Square each leg first, <b>then</b> add. (' + fx(a) + ' + ' + fx(b) + ')² is not the same as ' + fx(a) + '² + ' + fx(b) + '².' }, { v: 2 * a + 2 * b, hint: 'Squaring means a number times <b>itself</b> (' + fx(a) + ' × ' + fx(a) + '), not times 2.' }], hint: fx(a) + ' × ' + fx(a) + ' + ' + fx(b) + ' × ' + fx(b) + '.' }));
      var wc = [{ v: m, hint: 'Square the measured diagonal: ' + fx(m) + ' × ' + fx(m) + '.' }, { v: 2 * m, hint: 'Squaring means times <b>itself</b>, not times 2: ' + fx(m) + ' × ' + fx(m) + '.' }];
      if (S.delta) wc.push({ v: a * a + b * b, hint: 'That’s a² + b². Now square the diagonal you <b>measured</b>, ' + fx(m) + ' m.' });
      out.push(numR(c, 'csq', m * m, { unit: 'm²', label: 'c²', wrong: wc, hint: fx(m) + ' × ' + fx(m) + ', rounded to 2 decimal places.' }));
      var v = verdict(S, k), vw = {};
      VERD.forEach(function (o) { if (o.v === v) return; vw[o.v] = o.v === 'right' ? 'For a right angle, c² must <b>equal</b> a² + b². Compare your two numbers.' : v === 'right' ? 'Your two numbers are equal, so the Pythagorean theorem works: it’s a right angle.' : 'Compare: c² is ' + (v === 'wide' ? '<b>bigger</b>' : '<b>smaller</b>') + ' than a² + b². A diagonal that is too ' + (v === 'wide' ? 'long means the corner is opened up past' : 'short means the corner is squeezed in under') + ' 90°.'; });
      out.push(c.equals('verdict', v, { label: 'The corner', wrong: vw }));
      var W = S.W, D = S.D;
      out.push(numR(c, 'diag', S.diag, { label: 'Slab diagonal', wrong: [{ v: W * W + D * D, hint: 'Don’t forget the <b>square root</b>: √ is 2nd, then x² on the TI-30XIIS.' }, { v: W + D, hint: 'Square each side first: c² = ' + W.toFixed(1) + '² + ' + D.toFixed(1) + '², then take the square root.' }, { v: leg(W, D), hint: 'You <b>subtracted</b> the squares. For the hypotenuse, <b>add</b>: c² = a² + b².' }, { v: W, hint: 'The diagonal is the <b>hypotenuse</b>, the longest side: it must be longer than ' + W.toFixed(1) + ' m.' }], hint: 'c = √(' + W.toFixed(1) + '² + ' + D.toFixed(1) + '²).' }));
      out.push(c.equals('square', S.off ? 'no' : 'yes', { label: 'Square?', wrong: S.off ? { yes: 'In a rectangle with square corners, the two diagonals are <b>equal</b>. Are ' + fx(S.d1) + ' and ' + fx(S.d2) + ' equal?' } : { no: 'Both diagonals are the same length (and they match your calculation), so the corners are square.' } }));
      return out;
    },
    solve: function (c) {
      var S = site(c); if (!c.get('k')) c.set('k', KS[hv(c, 'ksolve') % 3]); var k = kOf(c), m = 5 * k + S.delta;
      c.set('leg4', fx(4 * k)); c.set('leg3', fx(3 * k)); c.set('d5', fx(5 * k)); c.set('big', 'acc');
      c.set('sumsq', fx(25 * k * k)); c.set('csq', fx(m * m)); c.set('verdict', verdict(S, k)); c.set('diag', fx(S.diag)); c.set('square', S.off ? 'no' : 'yes');
    }
  };

  /* ================= Checkpoint 3: how long is the ramp? (run for 1 : 12, Pythagoras; the old ramp's run: a leg) ================= */
  function ownRun(c, S) { return mine(c, 'run', S.run); }
  function ownOrun(c, S) { return mine(c, 'oldrun', S.orun); }
  var cp3 = {
    id: 'length', title: 'How long is the ramp?', needs: ['u7l2', 'u7l3'],
    goal: 'A ramp guideline used in many places is a slope of <b>about 1 : 12</b>: 1 m up for every 12 m along (always <b>check local codes</b>). Find the <b>run</b> your ramp needs, then its sloped <b>length</b> with the Pythagorean theorem, and the <b>run</b> of the old ramp.',
    example: { title: 'How long is the Aspen crew’s ramp?', scene: '<div class="pj-u7-exwrap">' + rampSvg({ h: 0.63, run: 7.56, rail: true, labels: { rise: 'rise 0.63 m', run: 'run 7.56 m', len: 'ramp = 7.59 m' }, aria: 'The Aspen crew’s ramp' }) + '</div>', steps: [
      { cap: 'The door is <b>0.63 m</b> up. At about 1 : 12, every 1 m of rise needs 12 m of run, so the run is <b>12 times</b> the rise.', html: eq('run = 12 × 0.63', 7.56) },
      { cap: 'The ramp, the ground and the landing make a <b>right triangle</b> (the right angle is at C). The sloped ramp is the <b>hypotenuse</b>: c² = a² + b².', html: eq('c² = 7.56² + 0.63² = 57.1536 + 0.3969', 57.5505, ' m²', 4) },
      { cap: 'Take the <b>square root</b> (2nd, x²). Keep every digit until the end, then round to the centimetre.', html: eq('c = √57.5505', 7.59) },
      { cap: '<b>Does it make sense?</b> The hypotenuse is the <b>longest</b> side, so it must be a little longer than 7.56 m. ✓', html: chip('7.59 m &gt; 7.56 m ✓') },
      { cap: 'The old ramp’s sloped length is <b>3.07 m</b> and it rises 0.63 m. Its run is a <b>leg</b>, so this time <b>subtract</b>: b² = c² − a².', html: eq('b = √(3.07² − 0.63²) = √9.028', 3.00) }] },
    render: function (box, c) {
      c._u7lv = []; var S = site(c); if (!S) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'The run for a 1 : 12 slope', 'Your entrance is <b>' + fx(S.h) + ' m</b> above the ground. That’s the ramp’s <b>rise</b>.');
      box.appendChild(field('Run = 12 × rise', inN(c, 'run', { aria: 'Run of the ramp' }), 'pj-u7-one'));
      box.appendChild(live(c, '', function () { return rampSvg({ h: S.h, run: ownRun(c, S) > 0.5 && ownRun(c, S) < 30 ? ownRun(c, S) : S.run, rail: true, labels: { rise: 'rise ' + fx(S.h) + ' m', run: 'run = ' + vv(c, 'run'), len: 'ramp = ' + vv(c, 'len') }, aria: 'Your new ramp: a right triangle' }); }));
      part(box, 'B', 'The ramp’s length', 'The sloped ramp is the <b>hypotenuse</b>. Round to the nearest centimetre (2 decimal places).');
      box.appendChild(field('Ramp length = √(run² + rise²)', inN(c, 'len', { aria: 'Length of the ramp' }), 'pj-u7-one'));
      box.appendChild(tip('A ramp this long usually needs a flat <b>rest landing</b> partway along, and handrails on both sides. Codes differ from place to place, so a real crew always checks the local building code.'));
      part(box, 'C', 'The old ramp', 'The old ramp is <b>' + fx(S.Lold) + ' m</b> long (along its slope) and also rises <b>' + fx(S.h) + ' m</b>. How far out from the landing does it reach?');
      box.appendChild(live(c, 'pj-u7-sm', function () { return rampSvg({ h: S.h, run: S.orun, old: true, Wpx: 460, labels: { rise: 'rise ' + fx(S.h) + ' m', run: 'run = ' + vv(c, 'oldrun'), len: fx(S.Lold) + ' m' }, aria: 'The old ramp: a right triangle' }); }));
      box.appendChild(field('Old run = √(' + fx(S.Lold) + '² − ' + fx(S.h) + '²)', inN(c, 'oldrun', { aria: 'Run of the old ramp' }), 'pj-u7-one'));
    },
    check: function (c) {
      var S = site(c); if (!S) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var h = S.h, out = [];
      out.push(numR(c, 'run', S.run, { label: 'Run', wrong: [{ v: h / 12, hint: 'The run is much <b>longer</b> than the rise: 12 m along for every 1 m up. <b>Multiply</b> the rise by 12.' }, { v: h + 12, hint: 'Multiply, don’t add: 12 × ' + fx(h) + '.' }, { v: 12 / h, hint: 'Multiply the rise by 12: 12 × ' + fx(h) + '.' }], hint: 'Run = 12 × ' + fx(h) + '.' }));
      var r = ownRun(c, S), L = [hyp(r, h), S.len];
      out.push(numR(c, 'len', L, { label: 'Ramp length', wrong: [{ v: r * r + h * h, hint: 'That’s c². Don’t forget the <b>square root</b> (2nd, then x²).' }, { v: leg(r, h), hint: 'You <b>subtracted</b>. The ramp is the hypotenuse, so <b>add</b> the squares: c² = run² + rise².' }, { v: r, hint: 'That’s the run, a <b>leg</b>. The sloped ramp is the hypotenuse: it’s a little <b>longer</b> than the run.' }, { v: r + h, hint: 'Square first: c² = ' + fx(r) + '² + ' + fx(h) + '², then take the square root.' }], hint: 'c = √(' + fx(r) + '² + ' + fx(h) + '²).', hint2: 'On the calculator: ' + fx(r) + ' x² + ' + fx(h) + ' x² ENTER, then 2nd x² (√) of the answer.' }));
      var Lo = S.Lold;
      out.push(numR(c, 'oldrun', S.orun, { label: 'Old run', wrong: [{ v: hyp(Lo, h), hint: 'The run is a <b>leg</b>, not the hypotenuse. For a leg, <b>subtract</b>: b² = c² − a².' }, { v: Lo * Lo - h * h, hint: 'That’s b². Take the <b>square root</b>.' }, { v: Lo, hint: 'That’s the sloped length (the hypotenuse). The run is a leg, so it is <b>shorter</b>.' }, { v: Lo - h, hint: 'Square first: b² = ' + fx(Lo) + '² − ' + fx(h) + '², then take the square root.' }], hint: 'b = √(' + fx(Lo) + '² − ' + fx(h) + '²).' }));
      return out;
    },
    solve: function (c) { var S = site(c); c.set('run', fx(S.run)); c.set('len', fx(hyp(ownRun(c, S), S.h))); c.set('oldrun', fx(S.orun)); }
  };

  /* ================= Checkpoint 4: the ramp's angle (tan⁻¹, sin⁻¹ check; the old ramp) ================= */
  var STEEP = [{ v: 'steep', html: '<b>Too steep</b> — much more than about 4.8°' }, { v: 'ok', html: '<b>About right</b> — close to 4.8°' }];
  var cp4 = {
    id: 'angle', title: 'How steep is the ramp?', needs: ['u7l4', 'u7l8'],
    goal: 'Label the ramp’s sides <b>opp, adj, hyp</b> from the angle θ at its foot, find θ with <b>tan⁻¹</b> and check it with <b>sin⁻¹</b>. A 1 : 12 slope is <b>about 4.8°</b>. Then find out how steep the old ramp really is.',
    example: { title: 'The angle of the Aspen crew’s ramp', scene: '<div class="pj-u7-exwrap">' + rampSvg({ h: 0.63, run: 7.56, tags: true, th: 'θ', thA: 4.76, top: '∠B', labels: { rise: 'opp 0.63 m', run: 'adj 7.56 m', len: 'hyp 7.59 m' }, aria: 'The Aspen crew’s ramp with its sides labelled' }) + '</div>', steps: [
      { cap: 'Stand at the angle <b>θ</b> at the foot of the ramp (A). The rise is <b>opposite</b> θ, the run is <b>adjacent</b> (next to it), and the ramp is the <b>hypotenuse</b>.', html: chip('<span class="pj-u7-c opp">opp</span> rise · <span class="pj-u7-c adj">adj</span> run · <span class="pj-u7-c hyp">hyp</span> ramp') },
      { cap: 'We know opp and adj: that’s <b>TOA</b>, tan θ = opp ÷ adj. To find the <b>angle</b>, use the inverse: θ = tan⁻¹(opp ÷ adj). Calculator in <b>DEG</b> mode!', html: eq('θ = tan⁻¹(0.63 ÷ 7.56)', 4.8, '°', 1) },
      { cap: '<b>Check with another ratio:</b> SOH, sin θ = opp ÷ hyp. θ = sin⁻¹(0.63 ÷ 7.59). Same angle ✓', html: eq('θ = sin⁻¹(0.63 ÷ 7.59)', 4.8, '°', 1) },
      { cap: 'The angles in a triangle add to 180°, and C is 90°, so the angle at the top is 90° − θ.', html: eq('∠B = 90° − 4.8°', 85.2, '°', 1) },
      { cap: 'The <b>old</b> ramp: rise 0.63 m over a run of 3.00 m. That’s about <b>12°</b>, much more than 4.8°: far too steep for a wheelchair.', html: eq('tan⁻¹(0.63 ÷ 3.00)', 12, '°', 0) },
      { cap: 'Its slope: 3.00 ÷ 0.63 ≈ 4.8, so the old ramp is about <b>1 : 4.8</b> instead of 1 : 12.', html: eq('3.00 ÷ 0.63', 4.8, '', 1) }] },
    render: function (box, c) {
      c._u7lv = []; var S = site(c); if (!S) return needFirst(box, 'Finish Checkpoint 1 first.');
      var r = ownRun(c, S), L = mine(c, 'len', S.len), ro = ownOrun(c, S);
      part(box, 'A', 'Label the sides from θ', 'θ is the angle at the <b>foot</b> of the ramp (A). Use your numbers from Checkpoint 3.');
      var g = grid(box);
      [['rise', 'The rise (' + fx(S.h) + ' m) is the…'], ['run', 'The run (' + fx(r) + ' m) is the…'], ['len', 'The ramp (' + fx(L) + ' m) is the…']].forEach(function (x) { g.appendChild(field(x[1], c.select('lab.' + x[0], SIDES, { aria: x[1], ph: 'Choose…', onPick: upd(c) }))); });
      box.appendChild(live(c, '', function () {
        var lab = function (k, v) { var s = c.get('lab.' + k); return (s ? s + ' ' : '') + v; }, th = pl(c.get('ang'));
        return rampSvg({ h: S.h, run: S.run, tags: true, th: 'θ = ' + vv(c, 'ang', '°'), thA: isNaN(th) || th <= 0 || th > 40 ? S.ang : th, top: '∠B = ' + vv(c, 'top', '°'), labels: { rise: lab('rise', fx(S.h) + ' m'), run: lab('run', fx(r) + ' m'), len: lab('len', fx(L) + ' m') }, aria: 'Your ramp, with θ at its foot' });
      }));
      part(box, 'B', 'Find θ', 'Which ratio uses the rise and the run? Then use its <b>inverse</b> key. Round to the nearest <b>tenth</b> of a degree.');
      box.appendChild(field('Rise and run are opp and adj, so use…', c.choice('ratio', RATIOS, { cls: 'pj-seg pj-u7-ratios', aria: 'Which ratio' }), 'pj-wide'));
      var g2 = grid(box);
      g2.appendChild(field('θ = tan⁻¹(' + fx(S.h) + ' ÷ ' + fx(r) + ')', inN(c, 'ang', { unit: '°', dp: 1, aria: 'Angle of the ramp' })));
      g2.appendChild(field('Check: θ = sin⁻¹(' + fx(S.h) + ' ÷ ' + fx(L) + ')', inN(c, 'angS', { unit: '°', dp: 1, aria: 'Angle of the ramp, checked with sine' })));
      g2.appendChild(field('The angle at the top, ∠B', inN(c, 'top', { unit: '°', dp: 1, aria: 'Angle at the top of the ramp' })));
      part(box, 'C', 'The old ramp', 'It rises <b>' + fx(S.h) + ' m</b> over your run of <b>' + fx(ro) + ' m</b> (Checkpoint 3). Round its angle to the nearest degree.');
      var g3 = grid(box);
      g3.appendChild(field('Old ramp’s angle', inN(c, 'oldang', { unit: '°', dp: 0, aria: 'Angle of the old ramp' })));
      g3.appendChild(field('Its slope is 1 : ?  (run ÷ rise)', inN(c, 'oldratio', { unit: '', dp: 1, ph: '0.0', aria: 'Slope of the old ramp' })));
      box.appendChild(field('Compared with the about-4.8° guideline, the old ramp is…', c.choice('steep', STEEP, { cls: 'pj-u7-opts', aria: 'Is the old ramp too steep?' }), 'pj-wide'));
    },
    check: function (c) {
      var S = site(c); if (!S) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [], h = S.h, r = ownRun(c, S), L = mine(c, 'len', S.len), ro = ownOrun(c, S);
      var why = { opp: 'Stand at θ (the foot of the ramp). The <b>opposite</b> side is across from θ: it doesn’t touch θ.', adj: 'The <b>adjacent</b> side touches θ and is not the hypotenuse.', hyp: 'The <b>hypotenuse</b> is the longest side, across from the right angle.' };
      [['rise', 'opp'], ['run', 'adj'], ['len', 'hyp']].forEach(function (x) { var w = {}; SIDES.forEach(function (s) { if (s.v !== x[1]) w[s.v] = why[x[1]]; }); out.push(c.equals('lab.' + x[0], x[1], { label: 'The ' + (x[0] === 'len' ? 'ramp' : x[0]), wrong: w })); });
      out.push(c.equals('ratio', 'tan', { label: 'Ratio', wrong: { sin: 'Sine uses opp and <b>hyp</b>. You want the one with opp and <b>adj</b>: TOA.', cos: 'Cosine uses adj and <b>hyp</b>. The rise is opp, the run is adj: TOA.' } }));
      var A = [atanD(h / r), S.ang];
      out.push(numR(c, 'ang', A, { unit: '°', dp: 1, inv: true, label: 'θ', wrong: [{ v: atanD(r / h), hint: 'Your ratio is <b>upside down</b>. tan θ = opp ÷ adj = rise ÷ run: ' + fx(h) + ' ÷ ' + fx(r) + '. (Check: a ramp angle must be small!)' }], hint: 'θ = tan⁻¹(' + fx(h) + ' ÷ ' + fx(r) + '): 2nd, tan, then the ratio.', hint2: 'Press 2nd tan ( ' + fx(h) + ' ÷ ' + fx(r) + ' ) ENTER. In DEG mode you get about 4.8.' }));
      var As = [asinD(h / L), asinD(h / S.len)];
      out.push(numR(c, 'angS', As, { unit: '°', dp: 1, inv: true, label: 'Sine check', wrong: [{ v: 90 - asinD(h / L), hint: 'That’s cos⁻¹, the angle at the <b>top</b>. Sine uses <b>opp</b> ÷ hyp: sin⁻¹(' + fx(h) + ' ÷ ' + fx(L) + ').' }], hint: 'θ = sin⁻¹(' + fx(h) + ' ÷ ' + fx(L) + '): 2nd, sin, then the ratio.' }));
      var th = mine(c, 'ang', S.ang);
      out.push(numR(c, 'top', [90 - th, 90 - S.ang], { unit: '°', dp: 1, label: '∠B', wrong: [{ v: 180 - th, hint: 'The three angles add to 180°, and one of them is the 90° at C: 180° − 90° − θ.' }, { v: 90 + th, hint: '∠B and θ add to 90° (the right angle takes the other 90°). Subtract.' }, { v: th, hint: '∠B is the other acute angle, at the top of the ramp: 90° − θ.' }], hint: '∠B = 90° − θ.' }));
      var Ao = [atanD(h / ro), S.oang, asinD(h / S.Lold)];
      out.push(numR(c, 'oldang', Ao, { unit: '°', dp: 0, inv: true, label: 'Old angle', wrong: [{ v: atanD(ro / h), hint: 'Your ratio is upside down: tan θ = rise ÷ run = ' + fx(h) + ' ÷ ' + fx(ro) + '.' }], hint: 'tan⁻¹(' + fx(h) + ' ÷ ' + fx(ro) + ').' }));
      out.push(numR(c, 'oldratio', [ro / h, S.orun / h], { unit: '', dp: 1, label: 'Old slope', wrong: [{ v: h / ro, hint: 'Run ÷ rise (the bigger number on top): ' + fx(ro) + ' ÷ ' + fx(h) + '. Compare it with the 12 of 1 : 12.' }], hint: 'Run ÷ rise: ' + fx(ro) + ' ÷ ' + fx(h) + '.' }));
      out.push(c.equals('steep', 'steep', { label: 'Old ramp', wrong: { ok: 'Compare your old-ramp angle with 4.8°: it’s more than twice as steep.' } }));
      return out;
    },
    solve: function (c) {
      var S = site(c), r = ownRun(c, S), L = mine(c, 'len', S.len), ro = ownOrun(c, S);
      c.set('lab.rise', 'opp'); c.set('lab.run', 'adj'); c.set('lab.len', 'hyp'); c.set('ratio', 'tan');
      c.set('ang', fx(atanD(S.h / r), 1)); c.set('angS', fx(asinD(S.h / L), 1)); c.set('top', fx(90 - mine(c, 'ang', S.ang), 1));
      c.set('oldang', fx(atanD(S.h / ro), 0)); c.set('oldratio', fx(ro / S.h, 1)); c.set('steep', 'steep');
    }
  };

  /* ================= Checkpoint 5: stairs and handrail (stringer, stair angle; sin: multiply, cos: divide) ================= */
  function ownR(c, S) { return mine(c, 'R', S.R); }
  function ownSang(c, S) { return mine(c, 'sang', S.sang); }
  var cp5 = {
    id: 'stairs', title: 'Stairs and a handrail', needs: ['u7l5', 'u7l6', 'u7l9'],
    goal: 'Find the length and angle of the stairs’ <b>stringer</b> (the sloped board under the steps), then use <b>sine</b> and <b>cosine</b> to fit the <b>handrail</b>. Pick the ratio from what you know and what you want.',
    example: { title: 'The Aspen crew’s stairs', scene: '<div class="pj-u7-exwrap pj-u7-exsm">' + stairsSvg({ n: 3, r: 0.21, t: 0.27, rail: true, labels: { R: 'run 0.81 m', rise: 'rise 0.63 m', str: '1.03 m', th: '38°', need: 'rail 1.37 m' }, Wpx: 470, aria: 'The Aspen crew’s stairs' }) + '</div>', steps: [
      { cap: '3 steps, each <b>0.21 m</b> up and <b>0.27 m</b> deep (the tread). In total the stairs rise 0.63 m and run 3 × 0.27 m.', html: eq('total run = 3 × 0.27', 0.81) },
      { cap: 'The <b>stringer</b> is the hypotenuse: √(0.81² + 0.63²).', html: eq('√(0.81² + 0.63²)', 1.03) },
      { cap: 'The stair angle: opp (rise) and adj (run), so <b>TOA</b>.', html: eq('θ = tan⁻¹(0.63 ÷ 0.81)', 38, '°', 0) },
      { cap: 'Their pre-cut handrail is <b>1.80 m</b> long. How much does it rise? We know the <b>hyp</b> and want the <b>opp</b>: <b>SOH</b>. The unknown is on <b>top</b> (opp = hyp × sin θ), so <b>multiply</b>.', html: eq('rise = 1.80 × sin 38°', 1.11) },
      { cap: 'The sloped rail should reach one extra tread past the bottom step, so it covers a run of 0.81 + 0.27 = 1.08 m. We know the <b>adj</b> and want the <b>hyp</b>: <b>CAH</b>. Now the unknown is on the <b>bottom</b> (cos θ = adj ÷ hyp), so <b>divide</b>.', html: eq('hyp = 1.08 ÷ cos 38°', 1.37) },
      { cap: '1.80 m is more than 1.37 m, so the pre-cut rail is long enough (they trim the extra).', html: chip('1.80 m ≥ 1.37 m ✓ long enough') }] },
    render: function (box, c) {
      c._u7lv = []; var S = site(c); if (!S) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'The stringer', 'Your stairs have <b>' + S.n + ' steps</b>. Each one rises <b>' + fx(S.r) + ' m</b> and has a tread <b>' + fx(S.t) + ' m</b> deep. In total they rise <b>' + fx(S.h) + ' m</b>.');
      var g = grid(box);
      g.appendChild(field('Total run = ' + S.n + ' × ' + fx(S.t), inN(c, 'R', { aria: 'Total run of the stairs' })));
      g.appendChild(field('Stringer = √(run² + rise²)', inN(c, 'str', { aria: 'Length of the stringer' })));
      g.appendChild(field('Stair angle θ (nearest degree)', inN(c, 'sang', { unit: '°', dp: 0, aria: 'Angle of the stairs' })));
      box.appendChild(live(c, '', function () { return stairsSvg({ n: S.n, r: S.r, t: S.t, rail: true, labels: { R: 'run = ' + vv(c, 'R'), rise: 'rise ' + fx(S.h) + ' m', str: vv(c, 'str'), th: 'θ = ' + vv(c, 'sang', '°'), need: 'rail = ' + vv(c, 'need') }, aria: 'Your stairs and handrail' }); }));
      var th = ownSang(c, S);
      part(box, 'B', 'The pre-cut handrail', 'The supplier has a pre-cut sloped rail <b>' + fx(S.Lr) + ' m</b> long. Set at your stair angle (' + fx(th, 0) + '°), how much does it <b>rise</b>?');
      box.appendChild(field('We know the hyp and want the opp, so use…', c.choice('ratio.rise', RATIOS, { cls: 'pj-seg pj-u7-ratios', aria: 'Ratio for the rail’s rise' }), 'pj-wide'));
      box.appendChild(field('Rise of the rail', inN(c, 'rrise', { aria: 'Rise of the pre-cut rail' }), 'pj-u7-one'));
      part(box, 'C', 'How long must the rail be?', 'The sloped rail should reach <b>one extra tread</b> past the bottom step, so it covers a run of (your total run + ' + fx(S.t) + ' m).');
      box.appendChild(field('We know the adj and want the hyp, so use…', c.choice('ratio.need', RATIOS, { cls: 'pj-seg pj-u7-ratios', aria: 'Ratio for the rail’s length' }), 'pj-wide'));
      var g3 = grid(box);
      g3.appendChild(field('Rail length needed', inN(c, 'need', { aria: 'Length of rail needed' })));
      g3.appendChild(field('Is the ' + fx(S.Lr) + ' m pre-cut rail long enough?', yn(c, 'enough', 'Yes', 'No — too short', { aria: 'Is the rail long enough?' })));
      box.appendChild(tip('Unknown on <b>top</b> of the ratio → <b>multiply</b>. Unknown on the <b>bottom</b> → <b>divide</b>.'));
    },
    check: function (c) {
      var S = site(c); if (!S) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [], h = S.h, n = S.n, t = S.t;
      out.push(numR(c, 'R', S.R, { label: 'Total run', wrong: [{ v: t, hint: 'That’s one tread. The stairs have ' + n + ' of them: ' + n + ' × ' + fx(t) + '.' }, { v: n + t, hint: 'Multiply: ' + n + ' × ' + fx(t) + '.' }, { v: n * S.r, hint: 'That’s the total <b>rise</b>. The run uses the tread depth: ' + n + ' × ' + fx(t) + '.' }], hint: n + ' × ' + fx(t) + '.' }));
      var R = ownR(c, S);
      out.push(numR(c, 'str', [hyp(R, h), S.str], { label: 'Stringer', wrong: [{ v: R * R + h * h, hint: 'That’s c². Take the <b>square root</b>.' }, { v: leg(R, h), hint: 'You subtracted. The stringer is the <b>hypotenuse</b>: add the squares.' }, { v: leg(h, R), hint: 'You subtracted. The stringer is the <b>hypotenuse</b>: add the squares.' }, { v: R, hint: 'That’s the run (a leg). The stringer is the hypotenuse, the <b>longest</b> side.' }, { v: R + h, hint: 'Square first, then add, then take the square root.' }], hint: '√(' + fx(R) + '² + ' + fx(h) + '²).' }));
      out.push(numR(c, 'sang', [atanD(h / R), S.sang], { unit: '°', dp: 0, inv: true, label: 'Stair angle', wrong: [{ v: atanD(R / h), hint: 'Upside down: tan θ = opp ÷ adj = rise ÷ run = ' + fx(h) + ' ÷ ' + fx(R) + '.' }], hint: 'θ = tan⁻¹(' + fx(h) + ' ÷ ' + fx(R) + ').' }));
      out.push(c.equals('ratio.rise', 'sin', { label: 'Ratio (rise)', wrong: { tan: 'Tangent uses opp and adj, but you know the <b>hyp</b> (the rail). SOH.', cos: 'Cosine gives the <b>adj</b> (the run). The rise is <b>opp</b>: SOH.' } }));
      var th = [ownSang(c, S), S.sang], Lr = S.Lr, mk = function (f) { return th.map(f); };
      out.push(numR(c, 'rrise', mk(function (a) { return Lr * sinD(a); }), { label: 'Rail rise', wrong: [{ v: mk(function (a) { return Lr * cosD(a); }), hint: 'That’s the <b>run</b> the rail covers (cos, adj). The rise is opp: use <b>sin</b>.' }, { v: mk(function (a) { return Lr / sinD(a); }), hint: 'sin θ = opp ÷ hyp, and the unknown (opp) is on <b>top</b>: <b>multiply</b>, opp = ' + fx(Lr) + ' × sin θ.' }, { v: mk(function (a) { return Lr * Math.sin(a); }), hint: RADH('sin') }, { v: mk(function (a) { return Lr * tanD(a); }), hint: 'You know the hyp, so it’s <b>sin</b>, not tan.' }], hint: 'rise = ' + fx(Lr) + ' × sin ' + fx(th[0], 0) + '°.' }));
      out.push(c.equals('ratio.need', 'cos', { label: 'Ratio (length)', wrong: { tan: 'Tangent doesn’t use the hyp. You know the <b>adj</b> (the run) and want the <b>hyp</b>: CAH.', sin: 'Sine uses the opp. The run is <b>adj</b>: CAH.' } }));
      var run2 = [R + t, S.R + t], need = []; run2.forEach(function (x) { th.forEach(function (a) { need.push(x / cosD(a)); }); });
      var mkN = function (f) { var o = []; run2.forEach(function (x) { th.forEach(function (a) { o.push(f(x, a)); }); }); return o; };
      out.push(numR(c, 'need', need, { label: 'Rail needed', wrong: [{ v: mkN(function (x, a) { return x * cosD(a); }), hint: 'cos θ = adj ÷ hyp, and the unknown (hyp) is on the <b>bottom</b>: <b>divide</b>, hyp = run ÷ cos θ. (The rail must be <b>longer</b> than its run!)' }, { v: mkN(function (x, a) { return x / sinD(a); }), hint: 'The run is <b>adj</b>: use cos, not sin.' }, { v: [R / cosD(th[0]), S.R / cosD(S.sang)], hint: 'Add the extra tread first: run = ' + fx(R) + ' + ' + fx(t) + '.' }, { v: mkN(function (x, a) { return x / Math.cos(a); }), hint: RADH('cos') }], hint: 'hyp = (' + fx(R) + ' + ' + fx(t) + ') ÷ cos ' + fx(th[0], 0) + '°.' }));
      var needOwn = mine(c, 'need', S.need), ok = S.Lr >= S.need;
      out.push(c.equals('enough', ok ? 'yes' : 'no', { label: 'Long enough?', wrong: ok ? { no: 'Compare: the pre-cut rail is ' + fx(S.Lr) + ' m and you need ' + fx(needOwn) + ' m. Is it at least that long?' } : { yes: 'Compare: the pre-cut rail is ' + fx(S.Lr) + ' m but you need ' + fx(needOwn) + ' m.' } }));
      return out;
    },
    solve: function (c) {
      var S = site(c); c.set('R', fx(S.R)); var R = ownR(c, S); c.set('str', fx(hyp(R, S.h))); c.set('sang', fx(atanD(S.h / R), 0));
      var th = ownSang(c, S); c.set('ratio.rise', 'sin'); c.set('rrise', fx(S.Lr * sinD(th))); c.set('ratio.need', 'cos'); c.set('need', fx((R + S.t) / cosD(th))); c.set('enough', S.Lr >= S.need ? 'yes' : 'no');
    }
  };

  /* ================= Checkpoint 6: the light pole, its guy wires, and the roof camera ================= */
  var cp6 = {
    id: 'pole', title: 'Light pole and guy wire', needs: ['u7l7', 'u7l9'],
    goal: 'Find the light pole’s <b>height</b> from an <b>angle of elevation</b> (don’t forget your eye height!), design its <b>guy wires</b>, and aim a roof camera at the foot of the ramp with an <b>angle of depression</b>.',
    example: { title: 'The Aspen crew measures their light pole', scene: '<div class="pj-u7-exwrap">' + poleSvg({ d: 15, te: 32, e: 1.6, H: 10.97, a: 5, b: 3, b2: 3.5, f2: 55, wires: true, labels: { d: '15 m', e: '1.6 m', te: '32°', opp: 'opp', H: '11.0 m', a: '5.0 m', b: '3.0 m', wire: '5.8 m', wang: '59°' }, Wpx: 680, aria: 'The Aspen crew’s light pole' }) + '</div>', steps: [
      { cap: 'Mia stands <b>15 m</b> from the pole. Her clinometer reads <b>32°</b> up to the top: the <b>angle of elevation</b>, measured up from the horizontal at her eyes.', html: chip('adj = 15 m · θ = 32° · want opp') },
      { cap: 'opp and adj: <b>TOA</b>. The unknown is on top, so multiply: opp = 15 × tan 32°.', html: eq('15 × tan 32°', 9.37) },
      { cap: 'That’s the height <b>above her eyes</b>. Her eyes are 1.6 m above the ground, so <b>add the eye height</b>.', html: eq('9.37 + 1.6', 11.0, ' m', 1) },
      { cap: 'A guy wire goes from <b>5.0 m</b> up the pole to an anchor <b>3.0 m</b> out. Its length is the hypotenuse; its angle with the ground uses tan.', html: eq('√(5.0² + 3.0²)', 5.8, ' m', 1) + eq('tan⁻¹(5.0 ÷ 3.0)', 59, '°', 0, 700) },
      { cap: 'A second wire on the other side must make <b>55°</b> with the ground. Where does its anchor go? tan 55° = 5.0 ÷ adj: the unknown is on the <b>bottom</b>, so <b>divide</b>.', html: eq('adj = 5.0 ÷ tan 55°', 3.5, ' m', 1) },
      { cap: 'A camera on the roof edge (4.8 m up) looks down at the foot of the ramp, 7.56 m away. The <b>angle of depression</b> is measured <b>down from the horizontal</b>. It equals the angle of elevation from the foot (alternate angles).', html: eq('tan⁻¹(4.8 ÷ 7.56)', 32, '°', 0) }] },
    render: function (box, c) {
      c._u7lv = []; var S = site(c); if (!S) return needFirst(box, 'Finish Checkpoint 1 first.');
      part(box, 'A', 'How tall is the light pole?', 'You stand <b>' + S.d + ' m</b> from the pole. Your clinometer reads <b>' + S.te + '°</b> up to the top, and your eyes are <b>' + S.e.toFixed(1) + ' m</b> above the ground. Round to the nearest <b>tenth</b> of a metre.');
      box.appendChild(live(c, '', function () { return poleSvg({ d: S.d, te: S.te, e: S.e, H: S.H, a: S.a, b: S.b, b2: S.b2, f2: S.f2, wires: true, wire2: true, labels: { d: S.d + ' m', e: 'eyes ' + S.e.toFixed(1) + ' m', te: S.te + '°', opp: 'opp', H: 'pole = ' + vv(c, 'pole'), a: S.a.toFixed(1) + ' m', b: S.b.toFixed(1) + ' m', wire: 'wire = ' + vv(c, 'wire'), wang: vv(c, 'wang', '°'), f2: S.f2 + '°', b2: vv(c, 'b2') }, aria: 'Your light pole, the clinometer sighting and the guy wires' }); }));
      box.appendChild(field('Height of the pole', inN(c, 'pole', { dp: 1, ph: '0.0', aria: 'Height of the light pole' }), 'pj-u7-one'));
      part(box, 'B', 'The guy wires', 'Wire 1 goes from <b>' + S.a.toFixed(1) + ' m</b> up the pole to an anchor <b>' + S.b.toFixed(1) + ' m</b> from its base. Wire 2, on the other side, must make <b>' + S.f2 + '°</b> with the ground. Round lengths to the nearest tenth.');
      var g = grid(box);
      g.appendChild(field('Length of wire 1', inN(c, 'wire', { dp: 1, ph: '0.0', aria: 'Length of wire 1' })));
      g.appendChild(field('Wire 1’s angle with the ground', inN(c, 'wang', { unit: '°', dp: 0, aria: 'Angle of wire 1' })));
      g.appendChild(field('Wire 2’s anchor: how far from the pole?', inN(c, 'b2', { dp: 1, ph: '0.0', aria: 'Distance to the anchor of wire 2' })));
      part(box, 'C', 'The roof camera', 'A security camera on the roof edge, <b>' + S.roof.toFixed(1) + ' m</b> up and right above the top of the ramp, must point at the <b>foot</b> of the ramp: your run of ' + fx(ownRun(c, S)) + ' m away.');
      box.appendChild(live(c, 'pj-u7-sm', function () { return camSvg({ roof: S.roof, h: S.h, run: S.run, Wpx: 560, labels: { roof: S.roof.toFixed(1) + ' m', run: fx(ownRun(c, S)) + ' m', dep: 'depression ' + vv(c, 'dep', '°'), elev: 'elevation ' + vv(c, 'elev', '°') } }); }));
      var g2 = grid(box);
      g2.appendChild(field('Angle of depression (camera → foot)', inN(c, 'dep', { unit: '°', dp: 0, aria: 'Angle of depression' })));
      g2.appendChild(field('Angle of elevation (foot → camera)', inN(c, 'elev', { unit: '°', dp: 0, aria: 'Angle of elevation' })));
    },
    check: function (c) {
      var S = site(c); if (!S) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var out = [], d = S.d, te = S.te, e = S.e;
      out.push(numR(c, 'pole', S.H, { dp: 1, label: 'Pole height', wrong: [{ v: d * tanD(te), hint: 'That’s the height <b>above your eyes</b>. Add your eye height, ' + e.toFixed(1) + ' m.' }, { v: [d * Math.tan(te) + e, d * Math.tan(te)], hint: RADH('tan') }, { v: [d / tanD(te) + e, d / tanD(te)], hint: 'tan θ = opp ÷ adj, and the unknown (opp) is on <b>top</b>: <b>multiply</b>, opp = ' + d + ' × tan ' + te + '°.' }, { v: [d * sinD(te) + e, d * sinD(te)], hint: 'You know the <b>adj</b> (' + d + ' m) and want the <b>opp</b>: that’s tan, not sin.' }, { v: [d * cosD(te) + e, d * cosD(te)], hint: 'You know the adj and want the opp: TOA, use tan.' }, { v: d * tanD(te) - e, hint: '<b>Add</b> the eye height: the pole goes down to the ground, below your eyes.' }], hint: 'opp = ' + d + ' × tan ' + te + '°, then + ' + e.toFixed(1) + '.' }));
      var a = S.a, b = S.b;
      out.push(numR(c, 'wire', S.wire, { dp: 1, label: 'Wire 1', wrong: [{ v: a * a + b * b, hint: 'That’s c². Take the <b>square root</b>.' }, { v: leg(a, b), hint: 'You subtracted. The wire is the <b>hypotenuse</b>: add the squares.' }, { v: a + b, hint: 'Square first: √(' + a.toFixed(1) + '² + ' + b.toFixed(1) + '²).' }, { v: a, hint: 'The wire is the hypotenuse, so it’s longer than ' + a.toFixed(1) + ' m.' }], hint: '√(' + a.toFixed(1) + '² + ' + b.toFixed(1) + '²).' }));
      out.push(numR(c, 'wang', S.wang, { unit: '°', dp: 0, inv: true, label: 'Wire 1 angle', wrong: [{ v: atanD(b / a), hint: 'That’s the angle at the <b>pole</b>. At the ground, the pole height is opp and the anchor distance is adj: tan⁻¹(' + a.toFixed(1) + ' ÷ ' + b.toFixed(1) + ').' }], hint: 'tan⁻¹(' + a.toFixed(1) + ' ÷ ' + b.toFixed(1) + ').' }));
      var f = S.f2;
      out.push(numR(c, 'b2', S.b2, { dp: 1, label: 'Wire 2 anchor', wrong: [{ v: a * tanD(f), hint: 'tan ' + f + '° = ' + a.toFixed(1) + ' ÷ adj. The unknown is on the <b>bottom</b>, so <b>divide</b>: adj = ' + a.toFixed(1) + ' ÷ tan ' + f + '°.' }, { v: a / sinD(f), hint: 'That’s the <b>length</b> of wire 2 (the hyp). The anchor distance is <b>adj</b>: use tan.' }, { v: a * cosD(f), hint: 'Use tan (you know the opp, ' + a.toFixed(1) + ' m, and want the adj), and divide.' }, { v: a / Math.tan(f), hint: RADH('tan') }], hint: 'adj = ' + a.toFixed(1) + ' ÷ tan ' + f + '°.' }));
      var r = ownRun(c, S), Dp = [atanD(S.roof / r), S.dep];
      out.push(numR(c, 'dep', Dp, { unit: '°', dp: 0, inv: true, label: 'Depression', wrong: [{ v: [atanD(r / S.roof), 90 - S.dep], hint: 'That angle is measured from the <b>vertical</b> wall. The angle of depression is measured <b>down from the horizontal</b>: tan⁻¹(' + S.roof.toFixed(1) + ' ÷ ' + fx(r) + ').' }, { v: atanD((S.roof - S.h) / r), hint: 'The camera looks at the <b>foot</b> of the ramp, on the ground: the drop is the whole ' + S.roof.toFixed(1) + ' m.' }], hint: 'tan⁻¹(' + S.roof.toFixed(1) + ' ÷ ' + fx(r) + ').' }));
      var dp = mine(c, 'dep', S.dep);
      out.push(numR(c, 'elev', [dp, S.dep], { unit: '°', dp: 0, label: 'Elevation', wrong: [{ v: 90 - dp, hint: 'The horizontal at the camera and the ground are parallel, so the angle of elevation <b>equals</b> the angle of depression (alternate interior angles).' }], hint: 'Angle of elevation = angle of depression.' }));
      return out;
    },
    solve: function (c) {
      var S = site(c); c.set('pole', fx(S.H, 1)); c.set('wire', fx(S.wire, 1)); c.set('wang', fx(S.wang, 0)); c.set('b2', fx(S.b2, 1));
      c.set('dep', fx(atanD(S.roof / ownRun(c, S)), 0)); c.set('elev', String(c.get('dep')));
    }
  };

  /* ================= Checkpoint 7: is it reasonable? the build card, hand in ================= */
  var SLIPS = {
    ramp: { L: 'A', good: 'Ramp: rise 0.66 m, run 7.92 m, length <b>7.95 m</b>', bad: 'Ramp: rise 0.66 m, run 7.92 m, length <b>7.89 m</b>', why: 'hyp' },
    angle: { L: 'B', good: 'Ramp angle: tan⁻¹(0.66 ÷ 7.92) = <b>4.8°</b>', bad: 'Ramp angle: tan⁻¹(0.66 ÷ 7.92) = <b>0.08°</b>', why: 'rad' },
    stairs: { L: 'C', good: 'Stairs: rise 0.66 m, run 1.08 m, angle <b>31°</b>', bad: 'Stairs: rise 0.66 m, run 1.08 m, angle <b>59°</b>', why: 'flip' },
    wire: { L: 'D', good: 'Guy wire: 6.0 m up, 3.5 m out, wire <b>6.9 m</b> long', bad: 'Guy wire: 6.0 m up, 3.5 m out, wire <b>5.2 m</b> long', why: 'hyp' }
  };
  var SLIP_IDS = ['ramp', 'angle', 'stairs', 'wire'];
  var WHYS = [{ v: 'hyp', html: 'The hypotenuse must be the <b>longest</b> side' }, { v: 'rad', html: 'A <b>RAD</b>-mode answer (not in degrees)' }, { v: 'flip', html: 'The ratio is <b>upside down</b> (opp and adj swapped)' }, { v: 'eye', html: 'They forgot to add the <b>eye height</b>' }];
  var SLIP_FINE = { ramp: 'The ramp’s sloped length is a little longer than its run, as a hypotenuse should be. That line is fine.', angle: 'A 1 : 12 ramp is about 4.8°. That line is fine.', stairs: 'The rise is less than the run, so the angle is less than 45°. 31° makes sense: that line is fine.', wire: 'The wire (the hypotenuse) is longer than both 6.0 m and 3.5 m. That line is fine.' };
  var SLIP_WHY = { hyp: 'Look at the hypotenuse in that line: is it the longest side?', rad: 'Is that angle in degrees? A 1 : 12 ramp is about 4.8°.', flip: 'A bigger angle faces a longer side. The rise is <b>shorter</b> than the run, so the stair angle must be less than 45°.' };
  function slipCard(kind) {
    return '<div class="pj-u7-slip"><div class="pj-u7-slip-h">🧾 The Coulee Crew’s build card <small>(another crew, another building)</small></div>' + SLIP_IDS.map(function (id) { var x = SLIPS[id]; return '<div class="pj-u7-slip-r"><span class="pj-u7-slip-l">' + x.L + '</span><span>' + (id === kind ? x.bad : x.good) + '</span></div>'; }).join('') + '</div>';
  }
  var BOLT = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 41h40" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M5 41 30 31v10z" fill="currentColor" opacity=".3"/><path d="M5 41 30 31" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M26 41v-4h4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="30" y="31" width="13" height="10" fill="currentColor"/><rect x="33" y="13" width="8" height="18" rx="1.2" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M13 41A8 8 0 0 0 12.5 38.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 41V9h7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M14.5 9h6l-1 3h-4z" fill="currentColor"/></svg>';
  /* the printable build card (also shown in the Teacher Ledger) */
  function cardHtml(c) {
    var S = site(c); if (!S) return '';
    var g = function (k, unit) { var x = shown(c, k); return x == null ? '—' : x + (unit == null ? ' m' : unit); };
    var L = { len: 'ramp ' + g('len'), ang: 'θ ' + g('ang', '°'), H: 'pole ' + g('pole'), wire: 'wire ' + g('wire'), dep: 'camera ' + g('dep', '°') + ' down', stairs: S.n + ' steps · stringer ' + g('str') + ' at ' + g('sang', '°') };
    var site2 = siteFor(c, S);
    function row(k, v) { return '<div class="pj-u7-cr"><span>' + k + '</span><b>' + v + '</b></div>'; }
    var k = kOf(c), d = new Date();
    return '<div class="pj-u7-card">' +
      '<div class="pj-u7-c-top"><div class="pj-u7-c-logo">' + BOLT + '</div><div class="pj-u7-c-id"><small>' + esc(S.town) + ' · ' + esc(S.B.name) + ' · accessible entrance</small><b>' + esc(crewName(c)) + '</b><span>Build card</span></div><div class="pj-u7-c-date">' + esc(d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })) + '</div></div>' +
      '<div class="pj-u7-c-draw">' + sceneSvg(site2, { mode: 'card', L: L, Wpx: 760, aria: 'The finished entrance with every length and angle' }) + '</div>' +
      '<div class="pj-u7-c-grid">' +
      '<div><h5>Landing</h5>' + row('Slab', S.W.toFixed(1) + ' m × ' + S.D.toFixed(1) + ' m') + row('3-4-5 check', k ? g('leg3') + ', ' + g('leg4') + ', ' + g('d5') : '—') + row('Diagonal', g('diag')) +
      '<h5>New ramp</h5>' + row('Rise', fx(S.h) + ' m') + row('Run (about 1 : 12)', g('run')) + row('Length', g('len')) + row('Angle', g('ang', '°') + ' (guideline about 4.8°)') + '</div>' +
      '<div><h5>Old ramp (removed)</h5>' + row('Run', g('oldrun')) + row('Angle', g('oldang', '°') + ' · 1 : ' + g('oldratio', '')) +
      '<h5>Stairs</h5>' + row('Steps', S.n + ' × ' + fx(S.r) + ' m up, ' + fx(S.t) + ' m treads') + row('Stringer', g('str') + ' at ' + g('sang', '°')) + row('Handrail', g('need') + ' needed · pre-cut ' + fx(S.Lr) + ' m ' + (c.get('enough') === 'yes' ? '✓' : c.get('enough') === 'no' ? '✗ order longer' : '')) + '</div>' +
      '<div><h5>Light pole</h5>' + row('Height', g('pole')) + row('Wire 1', g('wire') + ' at ' + g('wang', '°')) + row('Wire 2 anchor', g('b2') + ' out (' + S.f2 + '°)') +
      '<h5>Roof camera</h5>' + row('Angle of depression', g('dep', '°')) + '</div>' +
      '</div>' +
      '<div class="pj-u7-c-foot">' + (c.get('note') ? esc(c.get('note')) : 'Built to a slope of about 1 : 12. Always check the local building code before you build.') + '</div>' +
      '</div>';
  }
  var cp7 = {
    id: 'card', title: 'Check it, print it, hand it in', needs: ['u7l9'], submit: true,
    goal: 'Make sure answers are <b>reasonable</b> by spotting another crew’s slip, then print your <b>build card</b> with every length and angle and hand in your design.',
    passMsg: 'Your design has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Is it reasonable?', scene: '<div class="pj-u7-exwrap pj-u7-exsm">' + rampSvg({ h: 0.63, run: 7.56, tags: true, labels: { rise: 'opp 0.63 m', run: 'adj 7.56 m', len: 'hyp 7.59 m' }, Wpx: 520, aria: 'A ramp triangle' }) + '</div>', steps: [
      { cap: 'Before anything is built, the Aspen crew checks every number on their card. Three quick tests catch most slips.', html: chip('Is it reasonable?') },
      { cap: '<b>1. The hypotenuse is the longest side.</b> A ramp shorter than its run, or a wire shorter than the height it reaches, is wrong.', html: chip('hyp 7.59 m &gt; adj 7.56 m ✓') },
      { cap: '<b>2. A bigger angle faces a longer side.</b> If the rise is less than the run, the angle at the foot is less than 45°.', html: chip('0.63 &lt; 7.56 → θ &lt; 45° ✓') },
      { cap: '<b>3. Degrees, not radians.</b> An angle like 0.08° or a pole that’s negative means the calculator was in RAD mode, or the inverse key was skipped.', html: chip('DEG on the screen ✓') }] },
    render: function (box, c) {
      c._u7lv = []; var S = site(c); if (!S) return needFirst(box, 'Finish the checkpoints before this one first.');
      part(box, 'A', 'Spot the slip', 'The Coulee Crew built a ramp for another building. One line on their card is <b>not reasonable</b>. Which one?');
      box.appendChild(el('div', '', slipCard(S.slip)));
      box.appendChild(field('The line that can’t be right', c.choice('slip', SLIP_IDS.map(function (id) { return { v: SLIPS[id].L, html: SLIPS[id].L }; }), { cls: 'pj-seg pj-seg-sm', aria: 'Which line is wrong' }), 'pj-u7-one'));
      box.appendChild(field('How can you tell?', c.choice('why', WHYS, { cls: 'pj-u7-opts', aria: 'Why it is wrong' }), 'pj-wide'));
      part(box, 'B', 'Your build card', 'Every length and angle you worked out, on one card. Add a note for the town if you like, then print it.');
      box.appendChild(field('A note for the town (optional)', c.text('note', { ph: 'e.g. The new ramp is about 1 : 12, much gentler than the old one!', max: 110, aria: 'Note for the town', onInput: upd(c) }), 'pj-wide'));
      box.appendChild(live(c, 'pj-u7-cardwrap', function () { return cardHtml(c); }));
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my build card'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<link rel="stylesheet" href="' + PJ.site + 'assets/projects-u7.css"><div class="pj-printsheet">' + cardHtml(c) + '</div>', crewName(c) + ' build card'); });
      if (!c.ro) box.appendChild(pr);
      part(box, 'C', 'Look back', '');
      box.appendChild(field('Which part of the job needed trigonometry, and which only needed the Pythagorean theorem? How did you decide?', c.text('reflect', { area: true, rows: 3, max: 500, ph: 'e.g. The ramp’s length only needed Pythagoras because I knew two sides, but for the pole I knew an angle, so…', aria: 'Reflection' }), 'pj-wide'));
    },
    check: function (c) {
      var S = site(c); if (!S) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var out = [], kind = S.slip, right = SLIPS[kind], wl = {};
      SLIP_IDS.forEach(function (id) { if (id !== kind) wl[SLIPS[id].L] = SLIP_FINE[id] + ' ' + SLIP_WHY[right.why]; });
      out.push(c.equals('slip', right.L, { label: 'The slip', wrong: wl }));
      var ww = {}; WHYS.forEach(function (w) { if (w.v !== right.why) ww[w.v] = w.v === 'eye' ? 'No eye height in that line. ' + SLIP_WHY[right.why] : SLIP_WHY[right.why]; });
      out.push(c.equals('why', right.why, { label: 'How you can tell', wrong: ww }));
      out.push(c.need('reflect', { min: 20, label: 'Look back', hint: 'Write a sentence or two: where did you use trig, and where only Pythagoras?' }));
      return out;
    },
    solve: function (c) { var S = site(c); c.set('slip', SLIPS[S.slip].L); c.set('why', SLIPS[S.slip].why); c.set('reflect', 'The ramp length and the stringer only needed Pythagoras because I knew two sides. The pole and the angles needed trig because an angle was involved.'); }
  };

  PJ.ramp = { BLD: BLD, site: site, pl: pl, numR: numR, verdict: verdict, cardHtml: cardHtml, SLIPS: SLIPS, sceneSvg: sceneSvg, rampSvg: rampSvg, stairsSvg: stairsSvg, poleSvg: poleSvg, camSvg: camSvg, slabSvg: slabSvg, fx: fx };
  HW.defineProject({
    id: 'u7', unit: 7, title: 'Ramp It Up', outcomes: ['G2', 'G4', 'A1'], icon: BOLT,
    tagline: 'Design an accessible ramp, new stairs and a light pole for a building in town, with right triangles and trig.',
    intro: '<div class="pj-intro-art">' + BOLT + '</div><div><b>Welcome to Ramp It Up!</b> A building in town needs a ramp that anyone can use, new stairs and a light pole, and your crew is designing them. In 7 checkpoints you’ll use the Pythagorean theorem and sine, cosine and tangent from Unit 7 to square the landing, size the ramp, check its angle, fit the stairs and handrail, measure the pole, and print a build card. Your work saves as you go. It’s due on the Unit 7 test day.</div>',
    lessonNames: { u7l1: 'Squares and Roots', u7l2: 'Pythagoras: Hypotenuse', u7l3: 'Pythagoras: Legs, Squaring', u7l4: 'Tangent', u7l5: 'Sine', u7l6: 'Cosine', u7l7: 'Elevation and Depression', u7l8: 'Inverse Trig', u7l9: 'Choosing the Ratio' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: cardHtml
  });
})(typeof window !== 'undefined' ? window : global);
