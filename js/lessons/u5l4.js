/* Math 10-3 · Unit 5 · Lesson 4 — Estimating Angles with Referents, and True Bearings (G6)
 * Assignment 4 (u5_l04.tex, Questions 1–19) and the Lesson 4 Extra Practice (u5_ep04.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the booklet situation with new numbers around the booklet's (the worked-example angles,
 * times and bearings are left out). Figures and checkers come from the shared kit HW.geo (js/geokit.js).
 * Conversions for answering on screen:
 *   "estimate the angle" → multiple choice of estimates (each wrong one is far off, the other-scale or the long-way-round
 *     angle); "estimate, then measure with a protractor" → the estimate as multiple choice, the reading as a box (±1°);
 *   "build the angle from referents, then name its type" → multiple choice of build + type;
 *   "sketch the angle" / "draw a line in the direction of the bearing" → choose the right picture;
 *   "use a protractor" on a map → the map shows the angle from each north line (on the east or west side), and the
 *     student turns it into a bearing; "make a scale drawing" → choose the right drawing, then estimate the way back
 *     and the distance from the drawn (gridded) map;
 *   compass-point tables → labelled boxes (direction → bearing) and multiple choice (bearing → direction);
 *   "what is wrong / explain" → multiple choice of reasons.
 * Bearings: 045, 045° and 45° are right but 45 gets a "write 3 digits" nudge (no try used); counterclockwise readings
 * (360° − x), measuring from east, compass words (N45°E, NE), and back bearings added/subtracted the wrong way get their
 * own hints (HW.geo.bearingChk). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P;

  /* ================= small helpers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function fd(x) { x = q(x); return Number.isInteger(x) ? String(x) : String(rd(x, 2)); }
  function dg(x) { return t(fd(x) + '^\\circ'); }
  function dgs(x) { return fd(x) + '°'; }
  function bt(b) { return G.bearingText(b); }                 // "045"
  function bd(b) { return t(bt(b) + '^\\circ'); }             // 045°
  function n360(a) { return ((a % 360) + 360) % 360; }
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function intNot(r, a, b, not) { return find(function () { return r.int(a, b); }, function (v) { return (not || []).indexOf(v) < 0; }, a); }
  function pickNot(r, arr, not) { return find(function () { return r.pick(arr); }, function (v) { return (not || []).indexOf(v) < 0; }, arr[0]); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function apart(list, gap) { for (var i = 0; i < list.length; i++) for (var j = i + 1; j < list.length; j++) if (Math.abs(list[i] - list[j]) < gap) return false; return true; }
  function cdist(a, b) { var d = Math.abs(n360(a) - n360(b)); return Math.min(d, 360 - d); }
  var kindOf = G.kindOf, KIND_RULE = { acute: 'less than 90°', right: 'exactly 90°', obtuse: 'between 90° and 180°', straight: 'exactly 180°', reflex: 'between 180° and 360°' };
  function row(items, w) {
    return '<div style="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;margin:6px 0">' + items.map(function (it) {
      return '<div style="flex:0 1 ' + (w || 150) + 'px;min-width:' + Math.round((w || 150) * 0.7) + 'px;text-align:center">' + it[0] + (it[1] ? '<div style="font-weight:600;margin-top:2px">' + it[1] + '</div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  var PTS16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  function bOf(name) { return PTS16.indexOf(name) * 22.5; }
  function nameOf(b) { var i = Math.round(n360(b) / 22.5) % 16; return Math.abs(n360(b) - i * 22.5) < 1e-6 || Math.abs(n360(b) - 360) < 1e-6 ? PTS16[i] : null; }
  var WORDNAME = { N: 'north', E: 'east', S: 'south', W: 'west' };

  /* ---- a reading box (±1°) ---- */
  function readPart(prompt, deg, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label || '', name: '', after: '°' }] }, check: K.fields([G.angleChk(deg, { tol: 1, alts: o.alts })], { labels: [''] }),
      key: [fd(deg)], answer: dg(deg), solution: o.sol, hints: o.hints || ['Estimate first: acute or obtuse?', 'The arm crosses two numbers. Pick the one that matches your estimate.'], text: o.text || 'protractor reading' };
  }
  function protSol(o) {
    var sc = o.scale, a = o.angle, k = kindOf(a);
    return G.protractorSVG({ angle: a, rot: o.rot, scale: sc, highlight: sc, width: 300 }) + '<br>The arm crosses ' + a + ' and ' + (180 - a) + '. The angle is ' + k + ', so it is ' + dg(a) + '.' +
      ' (One arm is on the ' + (sc === 'outer' ? 'outer' : 'inner') + ' 0.)';
  }
  /* an exact angle in a box, o.alts [[v, code, hint]] */
  function angPart(prompt, deg, o) {
    o = o || {};
    var al = (o.alts || []).filter(function (a) { return !same(a[0], deg) && a[0] >= 0; });
    var p = GP.angle(prompt, deg, { sol: o.sol, hints: o.hints, text: o.text, nr: o.nr, reflex: o.reflex, supplementTrap: o.trap == null ? false : o.trap, alts: al.map(function (a) { return { v: a[0], code: a[1], hint: a[2] }; }) });
    p.bad = al.map(function (a) { return fd(a[0]); });
    return p;
  }
  /* a bearing in a box: o.alts [[v, code, hint]], o.back */
  function brgPart(prompt, b, o) {
    o = o || {};
    var al = (o.alts || []).filter(function (a) { return cdist(a[0], b) > 1e-6; });
    var p = GP.bearing(prompt, b, { sol: o.sol, hints: o.hints || [], text: o.text, back: o.back, alts: al.map(function (a) { return { v: n360(a[0]), code: a[1], hint: a[2] }; }) });
    if (o.nr) p.input.nr = true;
    p.bad = al.map(function (a) { return bt(n360(a[0])); });
    p.good = [bt(b) + '°'];
    return p;
  }
  function compassFig(b, o) { o = o || {}; return G.compassSVG({ origin: o.origin || 'P', bearings: [{ deg: b, arc: true, label: o.label === false ? null : true, color: o.color }], width: o.width || 170, grid: false }); }

  /* ================= pictures ================= */
  function clockSVG(hourCd, minCd, o) {
    o = o || {}; var R = 58, s = '', f = function (v) { return v.toFixed(1); };
    var P = function (cd, r) { var a = (90 - cd) * Math.PI / 180; return [r * Math.cos(a), -r * Math.sin(a)]; };
    s += '<circle cx="0" cy="0" r="' + R + '" fill="#fff" stroke="#1d2633" stroke-width="2.4"/>';
    for (var h = 1; h <= 12; h++) { var a = P(h * 30, R), b = P(h * 30, R - 7), c = P(h * 30, R - 17); s += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" stroke="#1d2633" stroke-width="2"/><text x="' + f(c[0]) + '" y="' + f(c[1]) + '" font-size="11" font-weight="600" text-anchor="middle" dominant-baseline="central" fill="#1d2633" font-family="system-ui, sans-serif">' + h + '</text>'; }
    var hh = P(hourCd, R * 0.5), mm = P(minCd, R * 0.78);
    s += '<line x1="0" y1="0" x2="' + f(hh[0]) + '" y2="' + f(hh[1]) + '" stroke="#1d2633" stroke-width="4.5" stroke-linecap="round"/><line x1="0" y1="0" x2="' + f(mm[0]) + '" y2="' + f(mm[1]) + '" stroke="#1f5bd6" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="0" r="3.5" fill="#1d2633"/>';
    return '<svg class="fig-svg" viewBox="-64 -64 128 128" width="100%" style="max-width:' + (o.width || 130) + 'px" role="img" aria-label="clock">' + s + '</svg>';
  }
  function wrapSVG(inner, box, w, label) { return '<svg class="fig-svg" viewBox="' + box.join(' ') + '" width="100%" style="max-width:' + w + 'px" role="img" aria-label="' + (label || 'picture') + '">' + inner + '</svg>'; }
  function arcPath(r, a1, a2) { var p = function (a) { return [r * Math.cos(a * Math.PI / 180), -r * Math.sin(a * Math.PI / 180)]; }, A = p(a1), B = p(a2); return '<path d="M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 0 0 ' + B[0].toFixed(1) + ' ' + B[1].toFixed(1) + '" fill="none" stroke="#c93a33" stroke-width="1.8"/>'; }
  function laptopSVG(th) {
    var e = [110 * Math.cos(th * Math.PI / 180), -110 * Math.sin(th * Math.PI / 180)];
    return wrapSVG('<line x1="0" y1="0" x2="140" y2="0" stroke="#3a4254" stroke-width="7" stroke-linecap="round"/><line x1="0" y1="0" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="#3a4254" stroke-width="7" stroke-linecap="round"/>' + arcPath(28, 0, th), [-60, -120, 215, 135], 190, 'open laptop');
  }
  function rampSVG(th) {
    var h = 150 * Math.tan(th * Math.PI / 180);
    return wrapSVG('<line x1="-15" y1="0" x2="175" y2="0" stroke="#1d2633" stroke-width="2.4"/><path d="M0 0L150 0L150 ' + (-h).toFixed(1) + 'Z" fill="#d5dbe6" stroke="#1d2633" stroke-width="2.4" stroke-linejoin="round"/>' + arcPath(48, 0, th), [-20, -h - 12, 200, h + 22], 200, 'skateboard ramp');
  }
  function scissorsSVG(th) {
    var b = function (a, L) { return [L * Math.cos(a * Math.PI / 180), -L * Math.sin(a * Math.PI / 180)]; }, A = b(th / 2, 120), B = b(-th / 2, 120), H1 = b(180 - 22, 30), H2 = b(180 + 22, 30);
    var s = '<line x1="0" y1="0" x2="' + A[0].toFixed(1) + '" y2="' + A[1].toFixed(1) + '" stroke="#3a4254" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="0" x2="' + B[0].toFixed(1) + '" y2="' + B[1].toFixed(1) + '" stroke="#3a4254" stroke-width="4" stroke-linecap="round"/>';
    [H1, H2].forEach(function (H) { s += '<line x1="0" y1="0" x2="' + (H[0] * 0.55).toFixed(1) + '" y2="' + (H[1] * 0.55).toFixed(1) + '" stroke="#3a4254" stroke-width="4"/><circle cx="' + H[0].toFixed(1) + '" cy="' + H[1].toFixed(1) + '" r="14" fill="none" stroke="#3a4254" stroke-width="3.5"/>'; });
    s += arcPath(45, -th / 2, th / 2) + '<circle cx="0" cy="0" r="3" fill="#1d2633"/>';
    var y = Math.max(Math.abs(A[1]), 34) + 8; return wrapSVG(s, [-55, -y, 185, 2 * y], 200, 'open scissors');
  }
  function angPic(v, rot, w) { var r = rot || 0; return v > 180 ? G.angleSVG({ a1: r, a2: r + 360 - v, reflex: true, width: w || 150 }) : G.angleSVG({ a1: r, a2: r + v, width: w || 150 }); }

  /* ================= multiple-choice builders ================= */
  /* best estimate: T the true size; o.cands: distractor values to try first */
  function estMC(r, prompt, T, o) {
    o = o || {}; var k = kindOf(T), shown = find(function () { return Math.round((T + r.pick([-5, 0, 0, 5])) / 5) * 5; }, function (v) { return kindOf(v) === k && v > 3 && v < 357; }, T);
    var tries = (o.cands || []).concat([180 - T, 360 - T, T + 45, T - 45, T + 70, T - 70, T + 100, T - 100]).filter(function (v) { return v >= 5 && v <= 355 && v !== 180 && v !== 90; });
    var vals = [shown];
    tries.forEach(function (v) { v = Math.round(v / 5) * 5; if (vals.length < 4 && vals.every(function (w) { return Math.abs(w - v) >= 25; }) && Math.abs(v - T) >= 25) vals.push(v); });
    var opts = vals.map(function (v, i) {
      var why = null;
      if (i) why = Math.abs(v - (360 - T)) < 13 ? 'That’s the angle the <b>long way round</b>. Which way does the arc go?' : kindOf(v) !== k ? 'First decide the type: the angle is ' + k + ' (' + KIND_RULE[k] + ').' : (v > T ? 'Too big. ' : 'Too small. ') + 'Compare with the referents (22.5°, 30°, 45°, 60°, 90°, 180°).';
      return { html: 'about ' + dg(v), right: i === 0, why: why, code: i ? (kindOf(v) !== k ? 'est-type' : 'est-far') : 'est' };
    });
    return P.mc(r, prompt, opts, o.sol || ('The angle is ' + k + '. ' + (o.ref || refText(T)) + ' A good estimate is about ' + dg(shown) + ' (it measures ' + dg(T) + ').'), o.hints || ['Step 1: acute, obtuse or reflex? Step 2: which two referents is it between?'], o.text || 'estimate ' + T);
  }
  function refText(T) {
    var R = [0, 22.5, 30, 45, 60, 90, 135, 150, 180, 270, 360], lo = 0, hi = 360;
    R.forEach(function (x) { if (x <= T) lo = x; }); for (var i = R.length - 1; i >= 0; i--) if (R[i] >= T) hi = R[i];
    if (lo === hi) return 'It is a referent angle itself.';
    return 'It is between ' + dg(lo) + ' and ' + dg(hi) + ', closer to ' + dg(T - lo <= hi - T ? lo : hi) + '.';
  }
  /* build from referents + type */
  var REF = [15, 22.5, 30, 45, 60, 90, 180, 360];
  function builds() { var out = []; REF.forEach(function (a) { REF.forEach(function (b) { if (a >= b && a + b < 360 && a !== 360) out.push({ a: a, b: b, op: '+', v: a + b }); if (a > b && a - b > 0 && a !== b * 2) out.push({ a: a, b: b, op: '-', v: a - b }); }); }); return out; }
  var BUILDS = builds();
  function bTex(x) { return t(fd(x.a) + '^\\circ' + (x.op === '+' ? '+' : '-') + fd(x.b) + '^\\circ'); }
  function buildMC(r, T, o) {
    o = o || {}; var k = kindOf(T), rights = BUILDS.filter(function (x) { return same(x.v, T) && (x.a !== 15 || x.op === '-'); });
    if (!rights.length) rights = BUILDS.filter(function (x) { return same(x.v, T); });
    var good = r.pick(rights.filter(function (x) { return x.b !== 15; }).length ? rights.filter(function (x) { return x.b !== 15; }) : rights);
    var wrongs = r.shuffle(BUILDS.filter(function (x) { return Math.abs(x.v - T) >= 7.5 && Math.abs(x.v - T) <= 45 && x.v > 0; })), picked = [];
    wrongs.forEach(function (x) { if (picked.length < 2 && picked.every(function (y) { return !same(y.v, x.v); })) picked.push(x); });
    var wk = r.pick(['acute', 'obtuse', 'reflex'].filter(function (z) { return z !== k; }));
    var opts = [{ html: bTex(good) + '; ' + k, right: true }].concat(picked.map(function (x) { return { html: bTex(x) + '; ' + k, why: t(fd(x.a) + (x.op === '+' ? '+' : '-') + fd(x.b) + '=' + fd(x.v)) + ', not ' + fd(T) + '.', code: 'build-sum' }; }),
      [{ html: bTex(good) + '; ' + wk, why: 'The build is right, but ' + dg(T) + ' is ' + KIND_RULE[k] + ', so it is <b>' + k + '</b>.', code: 'build-type' }]);
    var others = rights.filter(function (x) { return x !== good; }).slice(0, 2).map(bTex);
    return P.mc(r, 'Build ' + dg(T) + ' from referents. Then name its type.', opts, bTex(good) + ' = ' + dg(T) + '; ' + k + ' (' + KIND_RULE[k] + ').' + (others.length ? '<br>Other builds work too, e.g. ' + others.join(' or ') + '.' : ''),
      ['Referents: 22.5°, 30°, 45°, 60°, 90°, 180°, 360° (and 15°, half of 30°).', 'Add or subtract two of them.'], o.text || 'build ' + T);
  }
  /* "which sketch is about X°?" */
  function sketchMC(r, X, o) {
    o = o || {}; var cands = X > 180 ? [360 - X, X - 50, X + 40, X - 90] : [180 - X, X + 40, X - 40, X + 70, X - 70, X + 100];
    var vals = [X]; cands.forEach(function (v) { if (vals.length < 4 && v > 8 && v < 352 && v !== 180 && vals.every(function (w) { return Math.abs(w - v) >= 25; })) vals.push(v); });
    var rot = r.pick([0, 0, 15, 30, -20]);
    var opts = vals.map(function (v, i) { return { html: angPic(v, rot, 140), right: !i, why: i ? (X > 180 && same(v, 360 - X) ? 'That arc marks the small angle (about ' + dgs(v) + '). A reflex angle is marked the long way round.' : 'That angle is about ' + dgs(v) + '. Picture the referents: 90° is an L, 45° is half of that, 180° is a straight line.') : null, code: 'sketch' }; });
    var part = P.mc(r, 'Which sketch shows an angle of about ' + dg(X) + '?', opts, angPic(X, 0, 150) + '<br>' + (o.ref || refText(X)), ['Build it from referents first: 90° is an L, 45° is half of that, 180° is a straight line.'], o.text || 'sketch ' + X);
    part.input.columns = 2;
    return part;
  }
  /* "which picture shows a bearing of b?" */
  function bearingPicMC(r, b) {
    var cands = [[360 - b, 'That line is at ' + bd(360 - b) + ': measured <b>counterclockwise</b>. Bearings turn clockwise from north.'], [n360(90 - b), 'That line was measured from <b>east</b>. Start at north (000°).'], [n360(b + 180), 'That line points the <b>opposite</b> way.'], [b + 40, 'Too far round.'], [b - 40, 'Not far enough round.']];
    var vals = [[b, null]]; cands.forEach(function (c) { var v = n360(c[0]); if (vals.length < 4 && vals.every(function (w) { return cdist(w[0], v) >= 20; })) vals.push([v, c[1]]); });
    var opts = vals.map(function (v, i) { return { html: G.compassSVG({ origin: 'P', bearings: [{ deg: v[0], arc: true }], width: 150, grid: false }), right: !i, why: v[1], code: i ? 'brg-pic' : 'ok' }; });
    var east = b < 180, part = P.mc(r, 'Which picture shows a line from P on a bearing of ' + bd(b) + '?', opts,
      (east ? 'East side: turn ' + dg(b) + ' clockwise from north.' : 'West side: ' + t('360^\\circ-' + fd(b) + '^\\circ=' + fd(360 - b) + '^\\circ') + ', so mark ' + dg(360 - b) + ' on the west side of north.') + '<br>' + compassFig(b, { origin: 'P' }),
      ['Start at north and turn <b>clockwise</b>.', b >= 180 ? 'More than 180°: the line is on the west (left) side.' : 'Less than 180°: the line is on the east (right) side.'], 'bearing picture ' + b);
    part.input.columns = 2;
    return part;
  }
  /* a typed bearing for a compass point */
  function dirBearingFields(prompt, names) {
    var chks = names.map(function (n) { return G.bearingChk(bOf(n)); });
    var keys = names.map(function (n) { return bt(bOf(n)); });
    var p = P.fields(prompt, names.map(function (n) { return { label: '<b>' + n + '</b>:', name: n, after: '°' }; }), chks, keys, names.map(function (n) { return n + ' ' + bd(bOf(n)); }).join(', '),
      names.map(function (n) { return n + ' = ' + bd(bOf(n)) + dirWhy(n); }).join('<br>'), ['N = 000°, E = 090°, S = 180°, W = 270°. Each 16-point step is 22.5°.', 'Write 3 digits.'], 'compass to bearing');
    p.bad = [keys.map(function (k, i) { return bt(360 - bOf(names[i])); })].filter(function (b) { return b.join() !== keys.join(); });
    return p;
  }
  function dirWhy(n) {
    if (n.length < 2) return '';
    var b = bOf(n), st = n.length === 2 ? 45 : 22.5, lo = b - st;
    return ' (halfway between ' + nameOf(lo) + ' and ' + nameOf(b + st) + ': ' + t(fd(lo) + '^\\circ+' + fd(st) + '^\\circ=' + fd(b) + '^\\circ') + ')';
  }
  function bearingDirMC(r, b) {
    var right = nameOf(b), cands = [n360(360 - b), n360(b + 22.5), n360(b - 22.5), n360(b + 180), n360(b + 45)], names = [right];
    cands.forEach(function (v) { var nm = nameOf(v); if (names.length < 4 && names.indexOf(nm) < 0) names.push(nm); });
    var opts = names.map(function (nm, i) { var v = bOf(nm); return { html: '<b>' + nm + '</b>', right: !i, why: i ? (cdist(v, 360 - b) < 1e-6 ? nm + ' is ' + bd(v) + ': that’s counterclockwise from north. Bearings turn clockwise.' : nm + ' is ' + bd(v) + '.') : null, code: 'dir' }; });
    return P.mc(r, 'Which compass direction is a true bearing of ' + bd(b) + '?', opts, bd(b) + ' is <b>' + right + '</b>' + dirWhy(right) + '.', ['N = 000°, E = 090°, S = 180°, W = 270°; each 16-point step is 22.5°.'], 'bearing to direction');
  }
  /* "θ° east of north" etc. */
  var PHRASES = {
    EN: { txt: 'east of north', b: function (a) { return a; }, alt: function (a) { return [360 - a, 'geo-bearing-turn', 'You turned toward <b>west</b>. East of north: start at north and turn ' + a + '° toward east (clockwise).']; }, how: function (a) { return 'From N (000°) turn clockwise toward E: ' + t('000^\\circ+' + a + '^\\circ=' + bt(a) + '^\\circ'); } },
    SE: { txt: 'south of east', b: function (a) { return 90 + a; }, alt: function (a) { return [90 - a, 'geo-bearing-turn', 'You turned toward <b>north</b>. South of east: face east (090°), then turn toward south (clockwise): add.']; }, how: function (a) { return 'From E (090°) turn clockwise toward S: ' + t('090^\\circ+' + a + '^\\circ=' + bt(90 + a) + '^\\circ'); } },
    WS: { txt: 'west of south', b: function (a) { return 180 + a; }, alt: function (a) { return [180 - a, 'geo-bearing-turn', 'You turned toward <b>east</b>. West of south: face south (180°), then turn toward west (clockwise): add.']; }, how: function (a) { return 'From S (180°) turn clockwise toward W: ' + t('180^\\circ+' + a + '^\\circ=' + bt(180 + a) + '^\\circ'); } },
    NW: { txt: 'north of west', b: function (a) { return 270 + a; }, alt: function (a) { return [270 - a, 'geo-bearing-turn', 'You turned toward <b>south</b>. North of west: face west (270°), then turn toward north (clockwise): add.']; }, how: function (a) { return 'From W (270°) turn clockwise toward N: ' + t('270^\\circ+' + a + '^\\circ=' + bt(270 + a) + '^\\circ'); } },
    WN: { txt: 'west of north', b: function (a) { return 360 - a; }, alt: function (a) { return [a, 'geo-bearing-turn', 'That’s ' + a + '° <b>east</b> of north. West of north: turn counterclockwise from north, so subtract from 360°.']; }, how: function (a) { return 'From N turn counterclockwise toward W: ' + t('360^\\circ-' + a + '^\\circ=' + bt(360 - a) + '^\\circ'); } },
    ES: { txt: 'east of south', b: function (a) { return 180 - a; }, alt: function (a) { return [180 + a, 'geo-bearing-turn', 'You turned toward <b>west</b>. East of south: face south (180°), then turn toward east (counterclockwise): subtract.']; }, how: function (a) { return 'From S (180°) turn counterclockwise toward E: ' + t('180^\\circ-' + a + '^\\circ=' + bt(180 - a) + '^\\circ'); } },
    SW: { txt: 'south of west', b: function (a) { return 270 - a; }, alt: function (a) { return [270 + a, 'geo-bearing-turn', 'You turned toward <b>north</b>. South of west: face west (270°), then turn toward south (counterclockwise): subtract.']; }, how: function (a) { return 'From W (270°) turn counterclockwise toward S: ' + t('270^\\circ-' + a + '^\\circ=' + bt(270 - a) + '^\\circ'); } }
  };
  function phrasePart(lead, key, a, o) {
    o = o || {}; var ph = PHRASES[key], b = ph.b(a);
    return brgPart((lead || '') + dg(a) + ' ' + ph.txt, b, { alts: [ph.alt(a)], sol: ph.how(a) + '<br>' + compassFig(b, { width: 160 }), hints: ['Make a quick sketch. Face the second direction (e.g. east = 090°), then turn toward the first.', 'Turning clockwise: add. Counterclockwise: subtract.'], text: 'phrase ' + key + ' ' + a });
  }
  /* a map with the angle from each north line marked; legs: [{from, to, b, dist}] (bearings from point to point) */
  function mapSVG(o, legs, back) {
    var pts = [], arcs = [], northAt = [];
    legs.forEach(function (L) {
      pts.push({ name: L.to, from: L.from, bearing: L.b, dist: L.dist, dash: '6 4', color: '#6a7182' });
      if (northAt.indexOf(L.from) < 0 && L.from !== o.origin) northAt.push(L.from);
      arcs.push(L.b < 180 ? { at: L.from, from: 0, to: L.b, label: fd(L.b) + '°', r: 26 } : { at: L.from, from: L.b, to: 360, label: fd(360 - L.b) + '°', r: 26 });
    });
    legs.forEach(function (L) { if (northAt.indexOf(L.to) < 0 && L.to !== o.origin) northAt.push(L.to); });
    var bear = [];
    if (back) { if (northAt.indexOf(back.from) < 0) northAt.push(back.from); bear.push({ from: back.from, deg: back.b, len: back.dist, dash: '3 4', color: '#c93a33', arrow: false }); arcs.push(back.b < 180 ? { at: back.from, from: 0, to: back.b, label: fd(back.b) + '°', r: 26, color: '#7b4fc4' } : { at: back.from, from: back.b, to: 360, label: fd(360 - back.b) + '°', r: 26, color: '#7b4fc4' }); }
    return G.compassSVG({ origin: o.origin, points: pts, arcs: arcs, northAt: northAt, bearings: bear, width: o.width || 380, grid: o.grid !== false, gridSize: o.gridSize, originLabelDir: o.originLabelDir });
  }
  function legPos(legs) { var p = { }; p[legs[0].from] = [0, 0]; legs.forEach(function (L) { var a = p[L.from]; p[L.to] = [a[0] + L.dist * Math.sin(L.b * Math.PI / 180), a[1] + L.dist * Math.cos(L.b * Math.PI / 180)]; }); return p; }
  function bearingTo(A, B) { return n360(Math.atan2(B[0] - A[0], B[1] - A[1]) * 180 / Math.PI); }
  function mapBearingPart(prompt, b, o) {
    o = o || {}; var east = b < 180;
    return brgPart(prompt, b, { alts: east ? [] : [[360 - b, 'u5l4-west-raw', 'That’s the angle on the <b>west</b> side of the north line. Bearing = 360° − that angle.']],
      sol: east ? 'The path is on the east side of the north line: the bearing is the angle, ' + bd(b) + '.' : 'The path is on the west side of the north line: ' + t('360^\\circ-' + fd(360 - b) + '^\\circ=' + bt(b) + '^\\circ') + '.',
      hints: ['Find the north line at the point you start from.', 'East (right) side: bearing = the angle. West (left) side: bearing = 360° − the angle.'], text: o.text || 'map bearing' });
  }
  function backPart(prompt, b, o) {
    o = o || {}; var k = b < 180 ? n360(b + 180) : b - 180;
    return brgPart(prompt, k, { back: b, nr: o.nr, sol: (b < 180 ? bd(b) + ' is less than 180°, so add: ' + t(bt(b) + '^\\circ+180^\\circ=' + bt(k) + '^\\circ') : bd(b) + ' is 180° or more, so subtract: ' + t(bt(b) + '^\\circ-180^\\circ=' + bt(k) + '^\\circ')) + (o.solTail || ''),
      hints: ['The way back is the opposite direction: 180° different.', 'Less than 180°: add 180°. 180° or more: subtract 180°.'], text: o.text || 'back bearing ' + b });
  }
  function backFields(prompt, list) {
    var keys = list.map(function (b) { return bt(b < 180 ? b + 180 : b - 180); });
    var p = P.fields(prompt, list.map(function (b) { return { label: bd(b) + ' → ', name: bt(b) + '°', after: '°' }; }), list.map(function (b) { return G.bearingChk(b < 180 ? b + 180 : b - 180, { back: b }); }), keys,
      list.map(function (b, i) { return bd(b) + ' → ' + t(keys[i] + '^\\circ'); }).join(', '), list.map(function (b, i) { return b < 180 ? t(bt(b) + '+180=' + keys[i]) : t(bt(b) + '-180=' + keys[i]); }).join('; '),
      ['Less than 180°: add 180°. 180° or more: subtract 180°.', 'Check: every answer is between 000° and 359°.'], 'bearing back table');
    p.bad = [list.map(function (b) { return bt(b); })];
    return p;
  }

  HW.addCodes({ 'u5l4-west-raw': 'Gave the west-side angle, not 360° − it', 'geo-bearing-turn': 'Turned the wrong way for "x° … of …"', 'u5l4-clock-long': 'Clock: gave the angle the long way round', 'u5l4-clock-min': 'Clock: used 5° per hour mark',
    'u5l4-clock-half': 'Clock: forgot the hour hand moves between numbers', 'u5l4-minute-30': 'Minute hand: used 30° per minute', 'u5l4-minutes': 'Minute hand: gave the minutes, not degrees', 'u5l4-fold': 'Paper folds: halved the wrong angle',
    'u5l4-scale': 'Read the other protractor scale', 'u5l4-between-sum': 'Angle between bearings: added them', 'u5l4-between-360': 'Angle between bearings: gave 360° − it', 'u5l4-turn-ccw': 'Turn: measured the other way round', 'u5l4-turn-start': 'Turn: gave a bearing instead of the turn',
    'u5l4-liam': 'Gave Liam’s bearing again', 'u5l4-apart-one': 'Angle apart: counted one side only', 'u5l4-16pt': 'Halfway: used a 16-point step, not half of it', 'u5l4-reflex-add': 'Reflex: added 180° instead of 360° − x' });
  HW.addPartial({ 'u5l4-west-raw': 'b', 'u5l4-clock-half': 'b', 'u5l4-apart-one': 'b' });

  /* ================= question pieces ================= */
  function clockPart(h, lev) {
    var a = Math.min(h, 12 - h) * 30, long = 360 - a, alts = [[long, 'u5l4-clock-long', 'That’s the angle the <b>long way round</b>. Count the hour marks the <b>short</b> way.'], [Math.min(h, 12 - h) * 5, 'u5l4-clock-min', 'Each hour mark is ' + t('360^\\circ\\div 12=30^\\circ') + ', not 5°.']];
    return { id: '1' + 'abcd'.charAt(lev[1]), level: lev[0], make: function () {
      return angPart(h + ':00' + row([[clockSVG(h * 30, 0), '']], 120), a, { alts: alts, sol: 'Count hour marks the short way: ' + Math.min(h, 12 - h) + '. ' + t(Math.min(h, 12 - h) + '\\times 30^\\circ=' + a + '^\\circ'), hints: ['Each hour mark is 30°.', 'Count the marks between the hands the short way.'], text: 'clock ' + h + ':00' });
    } };
  }
  function scaleEst(r, o, lab) {
    var a = o.angle, k = kindOf(a), sh = find(function () { return Math.round((a + r.pick([-5, 0, 5])) / 5) * 5; }, function (v) { return kindOf(v) === k; }, a), ok2 = 180 - sh;
    var opts = [{ html: k + ', about ' + dg(sh), right: true }, { html: kindOf(ok2) + ', about ' + dg(ok2), why: 'Look at the opening between the arms: is it smaller or bigger than a square corner?', code: 'est-other' },
      { html: 'a right angle, 90°', why: 'Compare with a square corner: it isn’t one.', code: 'est-right' }, { html: k + ', about ' + dg(k === 'acute' ? Math.max(5, sh - 25) : Math.min(175, sh + 25)), why: 'Right type, but compare with the referents again: that’s too far off.', code: 'est-far' }];
    return P.mc(r, '(' + lab + ') Estimate first: look at the angle before you read the numbers.' + protPic(o) + 'The angle is', opts, 'It is ' + k + ' (' + KIND_RULE[k] + '). ' + refText(a), ['Is the angle smaller or bigger than a square corner?'], 'estimate before reading');
  }
  function protPic(o) { return G.protractorSVG({ angle: o.angle, rot: o.rot, scale: o.scale, width: 340 }); }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u5l4', unit: 5, num: '4', title: 'Estimating Angles with Referents, and True Bearings', outcome: 'G6',
    blurb: 'Referent angles (paper folds, clock hours), estimating and sketching angles, true bearings from north, bearings on a map and the bearing back.',
    questions: [
      { num: '1', stem: 'Find the smaller angle between the hands of a clock at each time.', shared: function (r) { return { hs: r.shuffle([5, 7, 9, 10, 11]).slice(0, 4) }; },
        parts: [['BEG', 0], ['BEG', 1], ['EMG', 2], ['BEG', 3]].map(function (lv, i) { return { id: '1' + 'abcd'[i], level: lv[0], make: function (r, sh) { return clockPart(sh.hs[i], lv).make(r); } }; }) },
      { num: '2', stem: 'Rosa folds a square sheet of paper to make referent angles.', parts: [
        { id: '2a', sub: 'a–c', level: 'LIM', make: function () {
          var c3 = G.angleChk(22.5, { alts: [{ v: 45, code: 'u5l4-fold', hint: 'Fold the 45° corner in half <b>again</b>: half of 45°.' }, { v: 22, code: 'u5l4-fold', hint: 'Half of 45° is exactly 22.5°.', form: true }, { v: 23, code: 'u5l4-fold', hint: 'Half of 45° is exactly 22.5°.', form: true }] });
          return P.fields('Fill in the blanks.', [{ label: '(a) The corner of the sheet:', name: '(a)', after: '°' }, { label: '(b) Fold the corner in half:', name: '(b)', after: '°' }, { label: '(c) Fold that in half again:', name: '(c)', after: '°' }],
            [G.angleChk(90), G.angleChk(45, { alts: [{ v: 22.5, code: 'u5l4-fold', hint: 'Only one fold: half of the 90° corner.' }, { v: 180, code: 'u5l4-fold', hint: 'Folding makes the corner <b>smaller</b>: half of 90°.' }] }), c3], ['90', '45', '22.5'],
            '(a) ' + dg(90) + ', (b) ' + dg(45) + ', (c) ' + dg(22.5), '(a) A sheet of paper has square corners: 90°.<br>(b) Half of 90° is 45°.<br>(c) Half of 45° is 22.5°.', ['Each fold cuts the angle in half.'], 'paper folds');
        } },
        { id: '2d', sub: 'd', level: 'BEG', make: function (r) { return P.mc(r, 'She folds a straight edge of the paper onto itself, so the fold crosses the edge. Each angle at the fold is', [
          { html: dg(90) + ', because half of 180° is 90°.', right: true }, { html: dg(45) + ', because half of 90° is 45°.', why: 'The edge is a <b>straight line</b> (180°), not a square corner.', code: 'fold45' },
          { html: dg(180) + ', because the edge is straight.', why: 'The fold splits the straight 180° into two equal angles.', code: 'fold180' }, { html: dg(90) + ', because the paper is square.', why: 'Right size, but the reason is the straight edge: the fold cuts 180° in half.', code: 'fold-reason' }],
          'The straight edge makes 180°. The fold cuts it in half: ' + t('180^\\circ\\div 2=90^\\circ') + '.', ['A straight edge is a straight angle, 180°.'], 'fold an edge'); } }] },
      { num: '3', stem: 'Build each angle from referents. Then name its type.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return buildMC(r, r.pick([75, 52.5, 82.5])); } },
        { id: '3b', level: 'EMG', make: function (r) { return buildMC(r, r.pick([105, 165])); } },
        { id: '3c', level: 'EMG', make: function (r) { return buildMC(r, r.pick([210, 225, 240])); } },
        { id: '3d', level: 'PRG', make: function (r) { return buildMC(r, r.pick([300, 315, 337.5])); } },
        { id: '3e', level: 'PRG', make: function (r) { return buildMC(r, r.pick([157.5, 202.5])); } },
        { id: '3f', level: 'EMG', make: function (r) { return buildMC(r, r.pick([120, 120, 195])); } }] },
      { num: '4', stem: 'Estimate each angle using referents.', shared: function (r) { return { A: intNot(r, 36, 58, [45]), B: intNot(r, 95, 110, [100]), C: intNot(r, 165, 176, [170]), D: intNot(r, 21, 28, [25]), E: intNot(r, 212, 235, [230]), rot: [0, 1, 2, 3, 4].map(function () { return r.int(0, 359); }) }; }, parts: [
        { id: '4A', sub: 'A', level: 'BEG', make: function (r, sh) { return estMC(r, 'Angle A. Which is the best estimate?' + row([[angPic(sh.A, sh.rot[0], 170), 'A']], 170), sh.A); } },
        { id: '4B', sub: 'B', level: 'BEG', make: function (r, sh) { return estMC(r, 'Angle B. Which is the best estimate?' + row([[angPic(sh.B, sh.rot[1], 170), 'B']], 170), sh.B); } },
        { id: '4C', sub: 'C', level: 'EMG', make: function (r, sh) { return estMC(r, 'Angle C. Which is the best estimate?' + row([[angPic(sh.C, sh.rot[2], 170), 'C']], 170), sh.C, { cands: [sh.C - 50, 180 - sh.C + 20, 360 - sh.C] }); } },
        { id: '4D', sub: 'D', level: 'EMG', make: function (r, sh) { return estMC(r, 'Angle D. Which is the best estimate?' + row([[angPic(sh.D, sh.rot[3], 170), 'D']], 170), sh.D, { cands: [sh.D + 40, 180 - sh.D, sh.D + 75] }); } },
        { id: '4E', sub: 'E', level: 'EMG', make: function (r, sh) { return estMC(r, 'Angle E (marked the long way round). Which is the best estimate?' + row([[angPic(sh.E, sh.rot[4], 170), 'E']], 170), sh.E, { cands: [360 - sh.E, sh.E - 60, sh.E + 60] }); } },
        { id: '4m', sub: 'E measure', level: 'PRG', make: function (r, sh) { var s = 360 - sh.E, rot = sh.rot[4], sc = r.pick(['inner', 'outer']), A = sc === 'outer' ? [rot + 180, rot + 180 - s] : [rot, rot + s];
          return readPart('Now measure angle E. The protractor is on the <b>small</b> angle between its arms.' + G.protractorSVG({ arms: A, rot: rot, width: 300, R: 170 }), sh.E, { alts: [{ v: s, code: 'geo-reflex-small', hint: 'That’s the small angle. E is the reflex angle: 360° − the small angle.' }, { v: 180 + s, code: 'u5l4-reflex-add', hint: 'Reflex = 360° − the small angle.' }],
            sol: 'Small angle: ' + dg(s) + '. Reflex: ' + t('360^\\circ-' + s + '^\\circ=' + sh.E + '^\\circ') + '.', hints: ['A protractor reads the small angle. E is reflex: 360° − the small angle.'], text: 'measure reflex E' }); } }] },
      { num: '5', stem: 'Estimate each angle. Then read the protractor and write the angle.', shared: function (r) { return { a: { angle: intNot(r, 22, 42, [35, 38]), rot: 0, scale: 'inner' }, b: { angle: intNot(r, 112, 135, [115, 125, 140]), rot: r.pick([-15, -20, 15, 25]), scale: 'outer' } }; }, parts: [
        { id: '5a1', sub: 'a estimate', level: 'BEG', make: function (r, sh) { return scaleEst(r, sh.a, 'a'); } },
        { id: '5a2', sub: 'a angle', level: 'EMG', make: function (r, sh) { return readPart('(a) Read the protractor.' + protPic(sh.a), sh.a.angle, { sol: protSol(sh.a), text: 'read (a)' }); } },
        { id: '5b1', sub: 'b estimate', level: 'BEG', make: function (r, sh) { return scaleEst(r, sh.b, 'b'); } },
        { id: '5b2', sub: 'b angle', level: 'PRG', make: function (r, sh) { return readPart('(b) Read the protractor.' + protPic(sh.b), sh.b.angle, { sol: protSol(sh.b), text: 'read (b)' }); } }] },
      { num: '6', stem: function (sh) { return 'Jordan measures an angle that is clearly a little ' + (sh.less ? 'less' : 'more') + ' than a right angle. He writes ' + dg(sh.w) + '.'; },
        shared: function (r) { var less = r.chance(0.65); return { less: less, w: less ? intNot(r, 95, 112, [100]) : intNot(r, 70, 85, [80]) }; }, parts: [
        { id: '6a', level: 'EMG', make: function (r, sh) { var k = sh.less ? 'acute' : 'obtuse', wk = kindOf(sh.w);
          return P.mc(r, 'How do you know his answer is wrong without measuring?', [
            { html: 'A little ' + (sh.less ? 'less' : 'more') + ' than a right angle is ' + k + ' (' + KIND_RULE[k] + '), but ' + dg(sh.w) + ' is ' + wk + '.', right: true },
            { html: 'Angles are always written as multiples of 5°.', why: 'Angles can have any size. Compare ' + dg(sh.w) + ' with 90°.', code: 'mult5' },
            { html: dg(sh.w) + ' is too small to be any angle.', why: 'Compare ' + dg(sh.w) + ' with a right angle, 90°.', code: 'small' },
            { html: 'A right angle is 100°.', why: 'A right angle is exactly 90°.', code: 'right100' }],
            'A little ' + (sh.less ? 'less' : 'more') + ' than 90° is ' + k + '. ' + dg(sh.w) + ' is ' + wk + ', so it can’t be right.', ['Is ' + sh.w + '° more or less than 90°?'], 'Jordan wrong'); } },
        { id: '6b', level: 'EMG', make: function (r, sh) { var a = 180 - sh.w; return angPart('He read the wrong scale. What is the correct angle?', a, { alts: [[sh.w, 'u5l4-scale', 'That’s Jordan’s answer. The two numbers on the scales add to 180°.'], [Math.abs(sh.w - 90), 'value', 'The two scale numbers at a mark add to <b>180°</b>.'], [360 - sh.w, 'value', 'The two scale numbers add to 180°, not 360°.']],
          sol: 'He read the wrong scale. The two numbers add to 180°: ' + t('180^\\circ-' + sh.w + '^\\circ=' + a + '^\\circ') + '.', hints: ['At every mark, the two scale numbers add to 180°.'], text: 'Jordan correct' }); } }] },
      { num: '7', stem: 'Estimate the marked angle in each picture.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var a = intNot(r, 100, 125, [115]); return estMC(r, '(a) An open laptop' + row([[laptopSVG(a), '']], 190), a, { text: 'laptop' }); } },
        { id: '7b', level: 'BEG', make: function (r) { var a = intNot(r, 12, 30, [20]); return estMC(r, '(b) A skateboard ramp' + row([[rampSVG(a), '']], 200), a, { cands: [a + 45, 90 - a, a + 70], text: 'ramp' }); } },
        { id: '7c', level: 'EMG', make: function (r) { var a = intNot(r, 22, 48, [30, 45]); return estMC(r, '(c) Open scissors' + row([[scissorsSVG(a), '']], 200), a, { cands: [a + 45, 180 - a, a + 75], text: 'scissors' }); } }] },
      { num: '8', stem: 'Sketching angles without a protractor.', parts: [
        { id: '8a', level: 'BEG', make: function (r) { var x = r.pick([30, 60]); return sketchMC(r, x, { ref: x === 30 ? 'One hour mark on a clock.' : 'Two hour marks on a clock.' }); } },
        { id: '8b', level: 'EMG', make: function (r) { var x = r.pick([135, 120, 105]); return sketchMC(r, x, { ref: x === 135 ? t('90^\\circ+45^\\circ') : x === 120 ? t('90^\\circ+30^\\circ') : t('90^\\circ+15^\\circ') }); } },
        { id: '8c', level: 'EMG', make: function (r) { var x = r.pick([100, 80, 110]); return sketchMC(r, x, { ref: 'A bit ' + (x > 90 ? 'more' : 'less') + ' than 90°.' }); } },
        { id: '8d', level: 'PRG', make: function (r) { var x = r.pick([290, 300, 210, 315]); return sketchMC(r, x, { ref: t('360^\\circ-' + (360 - x) + '^\\circ') + ': draw the small angle ' + dg(360 - x) + ' and mark the long way round.' }); } }] },
      { num: '9', stem: 'Compass directions and true bearings.', shared: function (r) { var pool = r.shuffle(['SSW', 'ESE', 'WNW', 'NNW', 'ENE', 'SSE']); return { names: r.shuffle([r.pick(['N', 'SE']), r.pick(['NW', 'SW', 'NE'])].concat(pool.slice(0, 2))), back: r.pick(pool.slice(2)) }; }, parts: [
        { id: '9a', level: 'EMG', make: function (r, sh) { return dirBearingFields('Write the true bearing of each direction.', sh.names); } },
        { id: '9b', level: 'EMG', make: function (r, sh) { return bearingDirMC(r, bOf(sh.back)); } }] },
      { num: '10', stem: 'Write each direction as a true bearing.', shared: function (r) { var ks = ['EN', 'SE', 'WS', 'NW', 'WN', 'ES'], used = { EN: [30], SE: [20], WS: [40], WN: [15] }, a = {}; ks.forEach(function (k) { a[k] = pickNot(r, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70], used[k] || []); }); return a; },
        parts: ['EN', 'SE', 'WS', 'NW', 'WN', 'ES'].map(function (k, i) { return { id: '10' + 'abcdef'[i], level: ['BEG', 'EMG', 'EMG', 'PRG', 'PRG', 'PRG'][i], make: function (r, sh) { return phrasePart('', k, sh[k]); } }; }) },
      { num: '11', stem: 'Draw a line from P in the direction of the bearing: which picture is right?', parts: [
        { id: '11a', level: 'BEG', make: function (r) { return bearingPicMC(r, pickNot(r, [20, 30, 40, 50, 70, 80], [60])); } },
        { id: '11b', level: 'EMG', make: function (r) { return bearingPicMC(r, pickNot(r, [100, 110, 120, 150, 160], [135])); } },
        { id: '11c', level: 'EMG', make: function (r) { return bearingPicMC(r, pickNot(r, [190, 200, 210, 220, 240], [250])); } },
        { id: '11d', level: 'PRG', make: function (r) { return bearingPicMC(r, pickNot(r, [280, 290, 300, 330, 340], [320])); } }] },
      { num: '12', stem: function (sh) { return 'An orienteering course starts at S and visits checkpoints 1, 2 and 3. Each marked angle is measured from the north line at that point.' + row([[mapSVG({ origin: 'S', width: 400 }, sh.legs, sh.backLeg), '']], 400); },
        shared: function (r) {
          return find(function () {
            var legs = [{ from: 'S', to: '1', b: pickNot(r, [10, 15, 20, 25, 30, 35, 40], [50]), dist: r.int(95, 120) }, { from: '1', to: '2', b: pickNot(r, [80, 90, 95, 100, 105, 110], [135]), dist: r.int(115, 150) }, { from: '2', to: '3', b: pickNot(r, [195, 200, 205, 210, 215, 225, 230], [255]), dist: r.int(75, 105) }];
            var p = legPos(legs), b4 = Math.round(bearingTo(p['3'], p.S)), d4 = Math.hypot(p['3'][0], p['3'][1]);
            return { legs: legs, b4: b4, backLeg: { from: '3', b: b4, dist: d4 } };
          }, function (s) { return s.b4 > 230 && s.b4 < 340 && s.b4 !== 350; }, null) || { legs: [{ from: 'S', to: '1', b: 20, dist: 110 }, { from: '1', to: '2', b: 100, dist: 140 }, { from: '2', to: '3', b: 210, dist: 90 }], b4: 271, backLeg: { from: '3', b: 271, dist: 140 } };
        }, parts: [
        { id: '12a', level: 'BEG', make: function (r, sh) { return mapBearingPart('(a) Bearing from S to checkpoint 1', sh.legs[0].b); } },
        { id: '12b', level: 'EMG', make: function (r, sh) { return mapBearingPart('(b) Bearing from 1 to 2', sh.legs[1].b); } },
        { id: '12c', level: 'PRG', make: function (r, sh) { return mapBearingPart('(c) Bearing from 2 to 3', sh.legs[2].b); } },
        { id: '12d', level: 'PRG', make: function (r, sh) { return mapBearingPart('(d) Bearing from 3 straight back to S (the red dashed line)', sh.b4); } },
        { id: '12e', level: 'EMG', make: function (r, sh) { return backPart('(e) A runner at checkpoint 2 wants to go back to checkpoint 1. On what bearing should she run? Use the rule, not the map.', sh.legs[1].b, { text: 'back 2 to 1' }); } }] },
      { num: '13', stem: 'Find the bearing back for each bearing.', parts: [
        { id: '13', level: 'EMG', make: function (r) { var list = [pickNot(r, [10, 20, 30, 40, 50, 60, 80], [70]), pickNot(r, [110, 120, 150, 160, 165, 170], [145]), pickNot(r, [190, 210, 220, 240, 260], [200]), pickNot(r, [280, 290, 300, 305, 330, 340], [315]), r.pick([5, 15, 25, 35, 45, 55, 65, 75, 85])];
          return backFields('Type each bearing back.', r.shuffle(list)); } }] },
      { num: '14', stem: function (sh) { return 'Mila paddles her canoe from the dock at Sylvan Lake to an island on a bearing of ' + bd(sh.b) + '. Later her friend Tyrell says, “To get back, paddle on ' + t(bt(sh.b) + '^\\circ-180^\\circ') + ', so on ' + dg(sh.b - 180) + '.”'; },
        shared: function (r) { return { b: pickNot(r, [105, 110, 115, 120, 125, 130, 140, 150, 155, 160], [145]) }; }, parts: [
        { id: '14a', level: 'EMG', make: function (r, sh) { return P.mc(r, 'What is wrong with Tyrell’s answer?', [
          { html: 'A bearing can’t be negative. ' + bd(sh.b) + ' is less than 180°, so he should <b>add</b> 180°, not subtract.', right: true },
          { html: 'He should have used ' + t('180^\\circ-' + bt(sh.b) + '^\\circ') + '.', why: 'That gives ' + dg(180 - sh.b) + ', which isn’t the opposite direction. Less than 180°: add 180°.', code: 'flip' },
          { html: 'Nothing: ' + dg(sh.b - 180) + ' means ' + dg(180 - sh.b) + ' counterclockwise, which is fine.', why: 'True bearings are always 000° to 359°, measured clockwise. A negative bearing isn’t allowed.', code: 'neg-ok' },
          { html: 'To get back she paddles on the same bearing, ' + bd(sh.b) + '.', why: 'The same bearing takes her further away. The way back is the opposite direction.', code: 'same' }],
          'Bearings go from 000° to 359°. ' + bd(sh.b) + ' is less than 180°, so add 180°.', ['Can a bearing be negative?'], 'Tyrell'); } },
        { id: '14b', level: 'EMG', make: function (r, sh) { return backPart('On what bearing should Mila paddle back to the dock?', sh.b, { text: 'Mila back' }); } }] },
      { num: '15', stem: function (sh) { return 'A surveyor stands at a corner of a city lot in Airdrie. She sights a power pole on a bearing of ' + bd(sh.b1) + ' and a fire hydrant on a bearing of ' + bd(sh.b2) + '.'; },
        shared: function (r) { return find(function () { var b1 = r.int(1, 8) * 10, d = r.int(4, 13) * 10 + r.pick([0, 5]); return { b1: b1, b2: b1 + d, d: d }; }, function (s) { return s.b2 < 180 && s.d !== 90 && !(s.b1 === 40 && s.b2 === 115); }, { b1: 30, b2: 140, d: 110 }); }, parts: [
        { id: '15a', level: 'EMG', make: function (r, sh) { return angPart('What is the angle between her two sightings?', sh.d, { alts: [[sh.b1 + sh.b2, 'u5l4-between-sum', 'Both bearings start from north. The angle between them is the <b>difference</b>.'], [360 - sh.d, 'u5l4-between-360', 'That’s the angle the long way round. Give the smaller angle between the sightings.']],
          sol: 'Both are on the east side of north, so subtract: ' + t(sh.b2 + '^\\circ-' + sh.b1 + '^\\circ=' + sh.d + '^\\circ') + '.' + row([[G.compassSVG({ origin: 'C', bearings: [{ deg: sh.b1, label: true }, { deg: sh.b2, label: true }], arcs: [{ from: sh.b1, to: sh.b2, label: dgs(sh.d) }], width: 190, grid: false }), '']], 190), hints: ['Both bearings are measured from north. Subtract.'], text: 'angle between sightings' }); } },
        { id: '15b', level: 'BEG', make: function (r, sh) { return GP.classify(r, 'What type of angle is the angle between the sightings?', sh.d, { sol: dg(sh.d) + ' is ' + KIND_RULE[kindOf(sh.d)] + ', so it is <b>' + kindOf(sh.d) + '</b>.', hints: ['Compare with 90° and 180°.'], text: 'sighting type' }); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) { var nm = r.pick(['SE', 'SW', 'NW', 'NE']), b = bOf(nm), what = { SE: 'southeast', SW: 'southwest', NW: 'northwest', NE: 'northeast' };
          return P.mc(r, 'A boat is heading ' + what[nm] + '. What is its true bearing?', [45, 135, 225, 315].map(function (v) { var w = nameOf(v); return { html: bd(v), right: v === b, why: v === b ? null : (cdist(v, 360 - b) < 1e-6 ? 'That’s ' + nm + ' measured <b>counterclockwise</b> (it is ' + w + '). Bearings turn clockwise from north.' : 'That’s ' + w + '.'), code: 'dir-' + w }; }),
            nm + ' is ' + bd(b) + dirWhy(nm) + '.', ['N = 000°, E = 090°, S = 180°, W = 270°.'], 'SE bearing', true); } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) { var a = intNot(r, 100, 150, [115, 125, 135, 140, 150]), rot = r.pick([0, 10, 15, 20]);
          var vals = [Math.round(a / 5) * 5, Math.round((180 - a - 10) / 5) * 5, Math.min(178, a + 50) > 172 ? 175 : Math.round((a + 50) / 5) * 5, 360 - Math.round(a / 5) * 5];
          if (!apart(vals, 20)) vals = [Math.round(a / 5) * 5, 35, 175, 360 - Math.round(a / 5) * 5];
          var why = ['', 'That’s acute (less than 90°). This angle is wider than a square corner.', 'That’s almost a straight line.', 'That’s a reflex angle, the long way round.'];
          return P.mc(r, 'Which is the best estimate of this angle?' + row([[G.angleSVG({ a1: rot, a2: rot + a, width: 150 }), '']], 150), vals.map(function (v, i) { return { html: dg(v), right: !i, why: why[i] || null, code: 'est' + i }; }),
            'The angle is obtuse. ' + refText(a) + ' So about ' + dg(vals[0]) + '.', ['Step 1: acute, obtuse or reflex?'], 'best estimate', true); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var b = intNot(r, 281, 355, [312]); return backPart('A bush plane flies from Yellowknife to a mining camp on a bearing of ' + bd(b) + '. The bearing it must fly to return to Yellowknife is ____°.', b, { nr: true, text: 'NR back bearing' }); } }] },
      { num: '19', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '19', level: 'PRG', make: function (r) {
          var pr = find(function () { var s = r.pick(PTS16.filter(function (n) { return n !== 'NNE'; })), e = r.pick(PTS16.filter(function (n) { return n.length === 1 || n.length === 2; })); return [s, e, n360(bOf(e) - bOf(s))]; },
            function (p) { var d = p[2]; return d >= 22.5 && d <= 157.5 && String(fd(d)).length <= 4 && !(p[0] === 'NNE' && p[1] === 'E'); }, ['ENE', 'S', 112.5]);
          var d = pr[2], wrongWay = 360 - d;
          var sb = bOf(pr[0]), eb = bOf(pr[1]), e2 = eb <= sb ? eb + 360 : eb;
          return numPart19('A boat is heading ' + pr[0] + '. The captain turns the boat clockwise until it is heading ' + (pr[1].length === 1 ? 'due ' + WORDNAME[pr[1]] : pr[1]) + '. The angle the boat turns, in degrees, is ____.', d,
            [[wrongWay, 'u5l4-turn-ccw', 'That’s the turn the other way round (counterclockwise). The captain turns <b>clockwise</b>.'], [bOf(pr[1]), 'u5l4-turn-start', 'That’s the bearing of ' + pr[1] + '. The turn is the difference between the two bearings.'], [bOf(pr[0]), 'u5l4-turn-start', 'That’s the bearing of ' + pr[0] + '. The turn is the difference between the two bearings.']],
            pr[0] + ' = ' + bd(sb) + ', ' + pr[1] + ' = ' + bd(eb) + (e2 > 360 || eb === 0 ? ' (passing north, think of it as ' + dg(e2) + ')' : '') + '.<br>Clockwise turn: ' + t(fd(e2) + '^\\circ-' + fd(sb) + '^\\circ=' + fd(d) + '^\\circ') + '.');
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'The minute hand of a clock turns as time passes. How many degrees does it turn in each time?', shared: function (r) { return { m: r.shuffle([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]).slice(0, 6).sort(function (a, b) { return a - b; }) }; },
        parts: [0, 1].map(function (h) { return { id: 'e1' + (h ? 'b' : 'a'), sub: h ? 'd–f' : 'a–c', level: h ? 'EMG' : 'BEG', make: function (r, sh) { var ms = sh.m.slice(h * 3, h * 3 + 3);
          return P.fields('How many degrees does the minute hand turn?', ms.map(function (m, i) { return { label: '(' + 'abcdef'[h * 3 + i] + ') ' + m + ' min:', name: m + ' min', after: '°' }; }),
            ms.map(function (m) { return G.angleChk(6 * m, { supplementTrap: false, alts: [{ v: 30 * m, code: 'u5l4-minute-30', hint: 'Each <b>5 minutes</b> is one hour mark, 30°. So ' + m + ' min is ' + (m / 5) + ' hour marks.' }, { v: m, code: 'u5l4-minutes', hint: 'Change minutes to degrees: every 5 minutes the hand moves 30°.' }] }); }), ms.map(function (m) { return String(6 * m); }),
            ms.map(function (m) { return m + ' min: ' + dg(6 * m); }).join(', '), ms.map(function (m) { return m + ' min = ' + (m / 5) + ' hour marks: ' + t((m / 5) + '\\times 30^\\circ=' + 6 * m + '^\\circ'); }).join('<br>'), ['Every 5 minutes the minute hand moves one hour mark, 30°.'], 'minute hand'); } }; }) },
      { num: '2', stem: 'Build each angle from referents. Then name its type.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { return buildMC(r, r.pick([52.5, 37.5])); } },
        { id: 'e2b', level: 'EMG', make: function (r) { return buildMC(r, r.pick([165, 105])); } },
        { id: 'e2c', level: 'EMG', make: function (r) { return buildMC(r, r.pick([240, 225])); } },
        { id: 'e2d', level: 'PRG', make: function (r) { return buildMC(r, r.pick([315, 337.5])); } }] },
      { num: '3', stem: 'Estimate each angle.', shared: function (r) { return { A: intNot(r, 74, 86, [75]), B: intNot(r, 10, 18, [15]), C: intNot(r, 136, 156, [140, 150]), D: intNot(r, 250, 275, [270]), rot: [0, 1, 2, 3].map(function () { return r.int(0, 359); }) }; }, parts: [
        { id: 'e3A', sub: 'A', level: 'BEG', make: function (r, sh) { return estMC(r, 'Angle A. Which is the best estimate?' + row([[angPic(sh.A, sh.rot[0], 170), 'A']], 170), sh.A, { cands: [180 - sh.A, sh.A - 45, sh.A + 45] }); } },
        { id: 'e3B', sub: 'B', level: 'BEG', make: function (r, sh) { return estMC(r, 'Angle B. Which is the best estimate?' + row([[angPic(sh.B, sh.rot[1], 170), 'B']], 170), sh.B, { cands: [sh.B + 30, sh.B + 60, 180 - sh.B] }); } },
        { id: 'e3C', sub: 'C', level: 'EMG', make: function (r, sh) { return estMC(r, 'Angle C. Which is the best estimate?' + row([[angPic(sh.C, sh.rot[2], 170), 'C']], 170), sh.C); } },
        { id: 'e3D', sub: 'D', level: 'EMG', make: function (r, sh) { return estMC(r, 'Angle D (marked the long way round). Which is the best estimate?' + row([[angPic(sh.D, sh.rot[3], 170), 'D']], 170), sh.D, { cands: [360 - sh.D, sh.D - 70, sh.D + 50] }); } }] },
      { num: '4', stem: 'Compass directions and true bearings.', shared: function (r) { return { names: r.shuffle(['S', r.pick(['NE', 'SW']), r.pick(['WNW', 'NNW']), r.pick(['ESE', 'SSE'])]), back: r.pick(['ENE', 'WSW', 'NNE', 'SSW']) }; }, parts: [
        { id: 'e4a', level: 'EMG', make: function (r, sh) { return dirBearingFields('Write the true bearing of each direction.', sh.names); } },
        { id: 'e4b', level: 'EMG', make: function (r, sh) { return bearingDirMC(r, bOf(sh.back)); } }] },
      { num: '5', stem: 'Find the bearing back for each bearing.', parts: [
        { id: 'e5', level: 'EMG', make: function (r) { return backFields('Type each bearing back.', r.shuffle([pickNot(r, [15, 25, 35, 40, 60], []), pickNot(r, [85, 95, 105, 130], []), 180, intNot(r, 241, 289, [250, 255]), intNot(r, 321, 355, [335])])); } }] },
      { num: '6', section: 'B. Applying', stem: 'Estimate each angle. Then read the protractor and write the angle.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var o = { angle: intNot(r, 62, 85, [65, 70]), rot: r.pick([25, 30, 35]), scale: 'outer' }; return readPart('(a) Read the protractor.' + protPic(o), o.angle, { sol: protSol(o), text: 'read e6a' }); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var o = { angle: intNot(r, 145, 168, [150, 160]), rot: r.pick([-10, -15, 10]), scale: 'inner' }; return readPart('(b) Read the protractor.' + protPic(o), o.angle, { sol: protSol(o), text: 'read e6b' }); } }] },
      { num: '7', stem: 'Write each direction as a true bearing.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { return phrasePart('A drone flies ', 'SW', pickNot(r, [20, 25, 30, 35, 40, 45, 50], [])); } },
        { id: 'e7b', level: 'EMG', make: function (r) { return phrasePart('A hunter walks ', 'ES', pickNot(r, [10, 15, 20, 25, 35], [])); } },
        { id: 'e7c', level: 'BEG', make: function (r) { return phrasePart('A ferry sails ', 'EN', pickNot(r, [55, 60, 65, 70, 75, 80], [])); } }] },
      { num: '8', stem: function (sh) { return 'A bush pilot based in a northern Alberta town (T) flies supplies to two lakes, A and B. Each marked angle is measured from the north line at that point.' + row([[mapSVG({ origin: 'T', width: 330, originLabelDir: 0 }, sh.legs, sh.backLeg), '']], 330); },
        shared: function (r) {
          return find(function () {
            var legs = [{ from: 'T', to: 'A', b: pickNot(r, [285, 290, 295, 300, 305, 310, 315], []), dist: r.int(110, 140) }, { from: 'A', to: 'B', b: pickNot(r, [15, 20, 25, 30, 35, 40], []), dist: r.int(110, 140) }];
            var p = legPos(legs), b3 = Math.round(bearingTo(p.B, p.T));
            return { legs: legs, b3: b3, backLeg: { from: 'B', b: b3, dist: Math.hypot(p.B[0], p.B[1]) } };
          }, function (s) { return s.b3 > 110 && s.b3 < 175; }, null) || { legs: [{ from: 'T', to: 'A', b: 300, dist: 120 }, { from: 'A', to: 'B', b: 30, dist: 120 }], b3: 165, backLeg: { from: 'B', b: 165, dist: 170 } };
        }, parts: [
        { id: 'e8a', level: 'PRG', make: function (r, sh) { return mapBearingPart('(a) Bearing from T to A', sh.legs[0].b); } },
        { id: 'e8b', level: 'EMG', make: function (r, sh) { return mapBearingPart('(b) Bearing from A to B', sh.legs[1].b); } },
        { id: 'e8c', level: 'EMG', make: function (r, sh) { return mapBearingPart('(c) Bearing from B straight home to T (the red dashed line)', sh.b3); } },
        { id: 'e8d', level: 'EMG', make: function (r, sh) { return backPart('(d) Another day the pilot flies only to A. On what bearing does she fly home from A? Use the rule.', sh.legs[0].b, { text: 'home from A' }); } }] },
      { num: '9', stem: function (sh) { return 'Noor leaves a dock and paddles ' + sh.a + ' km on a bearing of ' + bd(sh.b1) + '. Then she paddles ' + sh.b + ' km on a bearing of ' + bd(sh.b2) + '. (Scale: 1 square = 1 km.)'; },
        shared: function (r) {
          return find(function () { var b1 = r.int(5, 16) * 5, turn = r.pick([80, 85, 90, 90, 95, 100]), b2 = b1 + turn, a = r.int(2, 4), b = r.int(2, 5);
            var p = legPos([{ from: 'D', to: 'E', b: b1, dist: a }, { from: 'E', to: 'F', b: b2, dist: b }]), back = bearingTo(p.F, p.D), d = Math.hypot(p.F[0], p.F[1]);
            return { b1: b1, b2: b2, a: a, b: b, back: back, d: d }; }, function (s) { return s.back > 200 && s.back < 340 && s.a !== s.b && !(s.b1 === 70 && s.b2 === 160); }, { b1: 60, b2: 150, a: 2, b: 4, back: 0, d: 4.5 });
        }, parts: [
        { id: 'e9a', level: 'EMG', make: function (r, sh) { var sc = 34;
          var pic = function (b1, b2, a, b) { return G.compassSVG({ origin: 'D', points: [{ name: 'E', bearing: b1, dist: a * sc, label: ' ' }, { name: 'F', from: 'E', bearing: b2, dist: b * sc, label: ' ' }], northAt: ['E'], width: 190, gridSize: sc, originLabelDir: 200 }); };
          var cands = [[sh.b1, sh.b2, sh.a, sh.b, true, null], [360 - sh.b1, 360 - sh.b2, sh.a, sh.b, false, 'Those legs were measured <b>counterclockwise</b>. Bearings turn clockwise from north.'], [sh.b2, sh.b1, sh.b, sh.a, false, 'That drawing does the legs in the wrong <b>order</b>.'], [n360(90 - sh.b1), n360(90 - sh.b2), sh.a, sh.b, false, 'Those legs were measured from <b>east</b>. Start at north.']];
          var part = P.mc(r, 'Which scale drawing shows her trip?', cands.map(function (c) { return { html: pic(c[0], c[1], c[2], c[3]), right: c[4], why: c[5], code: 'drawing' }; }),
            'First leg: ' + sh.a + ' squares on ' + bd(sh.b1) + '; then a new north line, and ' + sh.b + ' squares on ' + bd(sh.b2) + '.<br>' + pic(sh.b1, sh.b2, sh.a, sh.b), ['Check the first leg: ' + bd(sh.b1) + ' is on the east side, ' + sh.a + ' km long.'], 'Noor drawing');
          part.input.columns = 2; return part; } },
        { id: 'e9b', level: 'PRG', make: function (r, sh) { var sc = 34, B = Math.round(sh.back), shown = Math.round(sh.back / 5) * 5;
          var vals = [shown], cands = [shown - 180, 360 - shown, shown + 45, shown - 45, shown + 70]; cands.forEach(function (v) { v = n360(v); if (vals.length < 4 && vals.every(function (w) { return cdist(w, v) >= 25; })) vals.push(v); });
          var fig = G.compassSVG({ origin: 'D', points: [{ name: 'E', bearing: sh.b1, dist: sh.a * sc, label: ' ' }, { name: 'F', from: 'E', bearing: sh.b2, dist: sh.b * sc, label: 'end' }], bearings: [{ from: 'F', deg: sh.back, len: sh.d * sc, dash: '4 4', color: '#c93a33', arrow: true }], northAt: ['E', 'F'], width: 240, gridSize: sc, originLabelDir: 200 });
          return P.mc(r, 'She paddles straight back to the dock (red dashed line). The bearing of the way back is closest to' + row([[fig, '']], 240), vals.map(function (v, i) { return { html: 'about ' + bd(v), right: !i, why: i ? (cdist(v, shown - 180) < 13 ? 'That’s the bearing from the dock <b>to</b> the end point. She is going the other way.' : cdist(v, 360 - shown) < 13 ? 'That’s measured counterclockwise. Turn clockwise from north at the end point.' : 'Use the north line at the end point: the way back is on the west side, so 360° − the angle you see.') : null, code: 'noor-back' }; }),
            'At the end point the line back is on the west side of north. The angle from north is about ' + dg(360 - B) + ', so the bearing is about ' + t('360^\\circ-' + (360 - B) + '^\\circ=' + bt(B) + '^\\circ') + '.', ['Put a north line at the end point. Is the dock to the west (left) of it?'], 'Noor back bearing', false); } },
        { id: 'e9c', level: 'PRG', make: function (r, sh) { var d = rd(sh.d, 1), vals = [d], cands = [sh.a + sh.b, Math.abs(sh.b - sh.a), d + 1.5, d - 1.5, d + 2.5, d - 2.5, d + 3.5]; cands.forEach(function (v) { v = rd(v, 1); if (vals.length < 4 && v > 0.4 && vals.every(function (w) { return Math.abs(w - v) >= 0.8; })) vals.push(v); });
          return P.mc(r, 'About how far is the dock from where she ends? (Count the squares: 1 square = 1 km.)', vals.map(function (v, i) { return { html: 'about ' + v.toFixed(1) + ' km', right: !i, why: i ? (same(v, sh.a + sh.b) ? 'That’s the whole trip (' + sh.a + ' + ' + sh.b + '). The straight line back is shorter.' : same(v, Math.abs(sh.b - sh.a)) ? 'Subtracting the legs doesn’t give the straight-line distance. Measure the red line with the squares.' : 'Measure the red line against the grid squares.') : null, code: 'noor-dist' }; }),
            'The red line is about ' + d.toFixed(1) + ' squares long, so about ' + d.toFixed(1) + ' km.', ['Lay a ruler (or your finger) along the red line and compare with the squares.'], 'Noor distance', false); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'EMG', make: function (r) { var M = r.pick(['N', 'E', 'S', 'W']), s = r.pick([1, -1]), off = r.int(2, 5) * 5, b = n360(bOf(M) + s * off);
          if (M === 'W' && s === 1 && off === 20) off = 25, b = n360(bOf(M) + off);
          var CW = { N: 'E', E: 'S', S: 'W', W: 'N' }, CCW = { N: 'W', E: 'N', S: 'E', W: 'S' }, tow = s > 0 ? CW[M] : CCW[M], oth = s > 0 ? CCW[M] : CW[M], opp = CW[CW[M]];
          var dsc = function (a, m) { return 'a little ' + WORDNAME[a] + ' of ' + WORDNAME[m]; };
          return P.mc(r, 'A hiker walks on a bearing of ' + bd(b) + '. Which describes her direction?', [
            { html: dsc(tow, M), right: true }, { html: dsc(oth, M), why: 'Which way does it lean from ' + WORDNAME[M] + ' (' + bd(bOf(M)) + ')? Turning clockwise from ' + WORDNAME[M] + ' leads toward ' + WORDNAME[CW[M]] + '.', code: 'side' },
            { html: dsc(tow, opp), why: 'That’s near ' + WORDNAME[opp] + ', the opposite way. Start from N = 000°, E = 090°, S = 180°, W = 270°.', code: 'opp' }, { html: dsc(M, tow), why: 'That’s near ' + WORDNAME[tow] + '. ' + bd(b) + ' is close to ' + WORDNAME[M] + ' (' + bd(bOf(M)) + ').', code: 'swap' }],
            bd(b) + ' is ' + off + '° ' + (s > 0 ? 'past' : 'before') + ' ' + WORDNAME[M] + ' (' + bd(bOf(M)) + '), turning ' + (s > 0 ? 'clockwise' : 'counterclockwise') + ' toward ' + WORDNAME[tow] + ': ' + dsc(tow, M) + '.', ['Which main direction is it closest to? Which way does it lean?'], 'describe bearing'); } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'PRG', make: function (r) {
          var pr = find(function () { var s = r.int(1, 71) * 5, e = r.pick(PTS16.filter(function (n) { return n.length === 3; })); return [s, e, n360(bOf(e) - s)]; }, function (p) { return p[2] >= 15 && p[2] < 100 && !(p[0] === 250 && p[1] === 'WNW') && p[0] % 90 !== 0; }, [200, 'WSW', 47.5]);
          var d = pr[2];
          return numPart19('A sailboat on Lake Minnewanka is heading on a bearing of ' + bd(pr[0]) + '. The skipper turns clockwise until the boat heads ' + pr[1] + '. The angle the boat turns, in degrees, is ____.', d,
            [[360 - d, 'u5l4-turn-ccw', 'That’s the turn the other way round. The skipper turns <b>clockwise</b>.'], [bOf(pr[1]), 'u5l4-turn-start', 'That’s the bearing of ' + pr[1] + '. The turn is the difference.']],
            pr[1] + ' = ' + bd(bOf(pr[1])) + '.<br>Clockwise turn: ' + t(fd(bOf(pr[1]) < pr[0] ? bOf(pr[1]) + 360 : bOf(pr[1])) + '^\\circ-' + pr[0] + '^\\circ=' + fd(d) + '^\\circ') + '.');
        } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'Liam is told to walk “' + dg(sh.a) + ' west of north”. He writes the bearing ' + bd(sh.a) + '.'; }, shared: function (r) { return { a: pickNot(r, [20, 25, 30, 35, 40, 50], [15]) }; }, parts: [
        { id: 'e12a', level: 'EMG', make: function (r, sh) { return P.mc(r, 'What is his mistake?', [
          { html: bd(sh.a) + ' is ' + dg(sh.a) + ' <b>east</b> of north. West of north means turning counterclockwise from north, toward west.', right: true },
          { html: 'He forgot to write 3 digits.', why: 'He did write 3 digits (' + bt(sh.a) + '). Look at which <b>way</b> he turned.', code: 'digits' },
          { html: 'He should have measured from west, not north.', why: '“West of north” means start at north and turn toward west.', code: 'from-west' },
          { html: 'There is no mistake.', why: 'Sketch it: ' + bd(sh.a) + ' is on the east side of north.', code: 'none' }],
          bd(sh.a) + ' is east of north. West of north turns counterclockwise from north.', ['Make a sketch: which side of the north line is ' + bt(sh.a) + '°?'], 'Liam mistake'); } },
        { id: 'e12b', sub: 'b i', level: 'PRG', make: function (r, sh) { return brgPart('What is the correct bearing?', 360 - sh.a, { alts: [[sh.a, 'u5l4-liam', 'That’s Liam’s bearing (east of north).'], [270 + sh.a, 'geo-bearing-turn', 'Start at <b>north</b> and turn ' + sh.a + '° toward west: ' + t('360^\\circ-' + sh.a + '^\\circ') + '.']], sol: t('360^\\circ-' + sh.a + '^\\circ=' + bt(360 - sh.a) + '^\\circ') + compassFig(360 - sh.a, { width: 150 }), hints: ['West of north: counterclockwise from north. Subtract from 360°.'], text: 'Liam correct' }); } },
        { id: 'e12c', sub: 'b ii', level: 'ADV', make: function (r, sh) { return angPart('How many degrees apart are his direction and the correct one?', 2 * sh.a, { alts: [[sh.a, 'u5l4-apart-one', 'That’s only the part on one side of north. His line is ' + sh.a + '° east of north and the right one is ' + sh.a + '° west of north.'], [360 - 2 * sh.a, 'u5l4-between-360', 'That’s the long way round. Give the smaller angle between the two directions.']],
          sol: t(sh.a + '^\\circ+' + sh.a + '^\\circ=' + 2 * sh.a + '^\\circ') + ' (one each side of north).' + row([[G.compassSVG({ origin: 'L', bearings: [{ deg: sh.a, label: true }, { deg: 360 - sh.a, label: true, color: '#12805a' }], width: 170, grid: false }), '']], 170), hints: ['Sketch both lines. How far is each from north?'], text: 'angle apart' }); } }] },
      { num: '13', stem: 'The 16-point compass has N, NNE, NE, ENE, E, and so on, all around.', shared: function (r) { var i = r.int(0, 15), j = find(function () { return r.int(0, 15); }, function (v) { var d = (v - i + 16) % 16; return d >= 3 && d <= 7; }, (i + 4) % 16); return { i: i, j: j }; }, parts: [
        { id: 'e13a', level: 'EMG', make: function (r) { return P.mc(r, 'Why are the points 22.5° apart?', [
          { html: 'There are 16 equal parts of a full turn: ' + t('360^\\circ\\div 16=22.5^\\circ') + '.', right: true }, { html: t('90^\\circ\\div 4=22.5^\\circ') + ', because there are 4 main directions.', why: 'There are 4 main directions, but each quarter turn is split into 4 parts, not the 90° itself shared by 4 directions. Count all 16 points round the full turn.', code: 'quarter' },
          { html: t('180^\\circ\\div 8=22.5^\\circ') + ', because a compass is a half circle.', why: 'A compass goes all the way round: 360°.', code: 'half' }, { html: 'Because 22.5° is half of 45°, the angle of a folded corner.', why: 'True, but that isn’t why. The 16 points share the full turn equally.', code: 'fold' }],
          '16 equal parts of a full turn: ' + t('360^\\circ\\div 16=22.5^\\circ') + '.', ['How many points share the full turn of 360°?'], 'why 22.5'); } },
        { id: 'e13b', level: 'MAS', make: function (r, sh) { var a = PTS16[sh.i], b = PTS16[(sh.i + 1) % 16], v = sh.i * 22.5 + 11.25;
          return half16Part('What bearing is exactly halfway between ' + a + ' and ' + b + '?', v, a, b); } },
        { id: 'e13c', level: 'ADV', make: function (r, sh) { var a = PTS16[sh.i], b = PTS16[sh.j], d = ((sh.j - sh.i + 16) % 16) * 22.5, k = kindOf(d);
          var chk = [G.angleChk(d, { supplementTrap: false, alts: [{ v: 360 - d, code: 'u5l4-turn-ccw', hint: 'That’s the turn the other way round. Turn <b>clockwise</b> from ' + a + ' to ' + b + '.' }, { v: ((sh.j - sh.i + 16) % 16), code: 'value', hint: 'That’s the number of 16-point steps. Each step is 22.5°.' }] }), typeChk(k)];
          return { prompt: 'How many degrees is it clockwise from ' + a + ' to ' + b + '? What type of angle is that?', input: { type: 'fields', fields: [{ label: 'Angle:', name: 'Angle', after: '°' }, { label: 'Type:', name: 'Type', mode: 'text', wide: true, placeholder: 'acute, right…' }] },
            check: K.fields(chk, { labels: ['Angle', 'Type'] }), key: [fd(d), k], answer: dg(d) + ', ' + k, solution: a + ' = ' + bd(sh.i * 22.5) + ', ' + b + ' = ' + bd(sh.j * 22.5) + '.<br>' + ((sh.j - sh.i + 16) % 16) + ' steps of 22.5°: ' + t(((sh.j - sh.i + 16) % 16) + '\\times 22.5^\\circ=' + fd(d) + '^\\circ') + ', ' + (k === 'right' ? 'a' : 'an') + ' ' + k + ' angle.',
            hints: ['Count the 16-point steps clockwise from ' + a + ' to ' + b + '.', 'Each step is 22.5°.'], text: '16-point turn' }; } }] },
      { num: '14', stem: function (sh) { return 'Ava says the angle between the hands of a clock at ' + sh.h1 + ':30 is ' + dg(Math.abs(6 - sh.h1) * 30) + ', because the hour hand still points at the ' + sh.h1 + ' and the minute hand points at the 6.'; },
        shared: function (r) { return { h1: pickNot(r, [1, 2, 3, 4, 5], []), h2: pickNot(r, [7, 8, 9, 10, 11], []) }; }, parts: [
        { id: 'e14a', level: 'EMG', make: function (r, sh) { var h = sh.h1; return P.mc(r, 'Where is the hour hand at ' + h + ':30, really?' + row([[clockSVG(h * 30 + 15, 180), h + ':30']], 130), [
          { html: 'Halfway between the ' + h + ' and the ' + (h + 1) + '. It moves 30° in an hour, so 15° in half an hour.', right: true }, { html: 'Exactly on the ' + h + '.', why: 'Look at the clock: the hour hand moves a little all the time, not just on the hour.', code: 'on' },
          { html: 'On the 6, with the minute hand.', why: 'Only the minute hand is on the 6 at half past.', code: 'six' }, { html: 'Halfway between the ' + (h - 1 || 12) + ' and the ' + h + '.', why: 'The hour hand moves clockwise, toward the next number.', code: 'back' }],
          'Halfway between the ' + h + ' and the ' + (h + 1) + ': it has moved 15° past the ' + h + '.', ['In one hour the hour hand moves one hour mark, 30°.'], 'hour hand at :30'); } },
        { id: 'e14b', level: 'MAS', make: function (r, sh) { return clock30(sh.h1); } },
        { id: 'e14c', level: 'MAS', make: function (r, sh) { return clock30(sh.h2, true); } }] }
    ]
  });

  /* ---- helpers used above (hoisted function declarations) ---- */
  function typeChk(kind) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '').replace(/angle$/, '');
      if (!s) return form('empty', 'Type the type of angle: acute, right, obtuse, straight or reflex.');
      var hit = null; ['acute', 'right', 'obtuse', 'straight', 'reflex'].forEach(function (k) { if (s === k || (s.length >= 4 && k.indexOf(s) === 0)) hit = k; });
      if (!hit) return form('u5l3-type-word', 'Use one of the five names: acute, right, obtuse, straight or reflex.');
      return hit === kind ? ok() : wrong('u5l3-type', 'Compare the angle with 90° and 180°. ' + cap(hit) + ' means ' + KIND_RULE[hit] + '.');
    };
  }
  function numPart19(prompt, ans, alts, sol) {
    var al = alts.filter(function (a) { return !same(a[0], ans) && String(fd(a[0])).length <= 4; });
    var chk = G.angleChk(ans, { supplementTrap: false, alts: al.map(function (a) { return { v: a[0], code: a[1], hint: a[2] }; }) });
    return { prompt: prompt, input: { type: 'number', nr: true }, check: function (resp) { if (String(resp == null ? '' : resp).replace(/\s|°/g, '').length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return chk(resp); },
      key: fd(ans), answer: t(fd(ans)), solution: sol, hints: ['Write both directions as bearings.', 'The clockwise turn is the difference (add 360° if you pass north).'], text: 'NR turn', bad: al.map(function (a) { return fd(a[0]); }) };
  }
  function half16Part(prompt, v, a, b) {
    var key = ('00' + Math.floor(v)).slice(-3) + '.' + String(rd(v - Math.floor(v), 2)).split('.')[1];
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/\^\{?\\circ\}?|\\circ|°/g, '').trim();
      var x = G.readDeg(s); if (x.code === 'empty') return form('empty', 'Type your answer first.'); if (x.code) return form('notnumber', 'Type the bearing as a number, like 011.25.');
      if (Math.abs(x.v - v) < 1e-6) return x.intLen < 3 ? form('geo-bearing-3digit', 'Right direction! A true bearing has <b>3 digits</b> before the decimal point: write ' + key + '°.') : ok();
      if (Math.abs(x.v - rd(v, 1)) < 1e-6 || Math.abs(x.v - Math.round(v)) < 1e-6) return form('round', 'Very close — halfway is exactly ' + fd(v - 11.25) + '° + 11.25°. Don’t round.');
      if (Math.abs(x.v - (v - 11.25)) < 1e-6 || Math.abs(x.v - (v + 11.25)) < 1e-6) return wrong('u5l4-16pt', 'That’s ' + (Math.abs(x.v - (v - 11.25)) < 1e-6 ? a : b) + ' itself. Halfway is half of 22.5° past ' + a + '.');
      if (Math.abs(x.v - (v - 11.25 + 22.5 / 4)) < 1e-6) return wrong('u5l4-16pt', 'Half of 22.5° is 11.25°, not 5.625°.');
      if (Math.abs(x.v - (360 - v)) < 1e-6) return wrong('geo-bearing-ccw', 'Bearings turn <b>clockwise</b> from north.');
      return wrong('value', null);
    };
    return { prompt: prompt, input: { type: 'number', after: '°' }, check: chk, key: key, answer: t(key + '^\\circ'), solution: a + ' = ' + bd(v - 11.25) + ', ' + b + ' = ' + bd(n360(v + 11.25)) + '.<br>Halfway: half of 22.5° is 11.25°, so ' + t(fd(v - 11.25) + '^\\circ+11.25^\\circ=' + key + '^\\circ') + '.',
      hints: ['The two points are 22.5° apart. Halfway is half of that.', 'Write the bearing with 3 digits before the decimal point.'], text: 'halfway 16-point', bad: [fd(v - 11.25), fd(n360(v + 11.25))].map(function (x) { return x === '0' ? '360' : x; }), good: [String(v), key + '°'].filter(function (g) { return G.readDeg(g).intLen >= 3; }) };
  }
  function clock30(h, late) {
    var hr = h * 30 + 15, d = Math.abs(hr - 180), a = Math.min(d, 360 - d), naive = Math.min(Math.abs(h * 30 - 180), 360 - Math.abs(h * 30 - 180));
    return angPart('Find the angle between the hands at ' + h + ':30.' + row([[clockSVG(hr, 180), h + ':30']], 130), a, { alts: [[naive, 'u5l4-clock-half', 'At ' + h + ':30 the hour hand isn’t on the ' + h + ': it has moved 15° on, halfway to the ' + (h % 12 + 1) + '.'], [360 - a, 'u5l4-clock-long', 'That’s the angle the long way round. Give the smaller angle.'], [a === naive - 15 ? naive + 15 : naive - 15, 'u5l4-clock-half', 'The hour hand moves <b>toward</b> the next number (clockwise). Check which way that changes the angle.']],
      sol: 'Measure from the 12: hour hand at ' + t(h + '\\times 30^\\circ+15^\\circ=' + hr + '^\\circ') + '; minute hand at the 6, ' + dg(180) + '.<br>Angle ' + t('=' + (hr > 180 ? hr + '^\\circ-180^\\circ' : '180^\\circ-' + hr + '^\\circ') + '=' + a + '^\\circ') + '.', hints: ['Where is the hour hand at half past? It has moved halfway to the next number.', 'Find each hand’s angle from the 12, then subtract.'], text: 'clock ' + h + ':30' });
  }
})(window);
