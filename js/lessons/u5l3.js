/* Math 10-3 · Unit 5 · Lesson 3 — Measuring, Drawing and Classifying Angles (G6)
 * Assignment 3 (u5_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u5_ep03.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the booklet situation with new numbers around the booklet's (the worked-example angles are
 * left out). Figures come from the shared kit HW.geo (js/geokit.js) so they look like the booklet's \protractor pictures.
 * Conversions for answering on screen:
 *   "use your protractor" (full-size angles) → the angle drawn with a protractor laid on it, turned to any orientation;
 *     readings are accepted within ±1° (a single labelled box, so the reading tolerance doesn't clash with key+1 tests);
 *   "draw the angle on the arm given" → choose the picture where the new arm was drawn right (the protractor is in each
 *     picture: the other-scale mistake and a 10° miscount are the wrong pictures), plus "put the drawing steps in order";
 *   "name the angle in three ways" → a yes/no table of candidate names; "explain" items → multiple choice of reasons;
 *   type tables → a tap table (acute / right / obtuse / straight / reflex); the polygon table → labelled boxes per row;
 *   "explain why the tiles fit" → multiple choice of reasons with the tiling drawn.
 * Hints aimed at real mistakes: reading the other protractor scale (180° − x), giving the small angle for a reflex one,
 * subtracting from 180° instead of 360°, forgetting to subtract 2 from the number of sides (n × 180°), dividing the sum
 * by n − 2, using 360° ÷ n (the turn, not the inside angle), the number of triangles instead of the number of sides. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P;

  /* ================= small helpers ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function fd(x) { x = q(x); return Number.isInteger(x) ? String(x) : String(rd(x, 2)); }
  function dg(x) { return t(fd(x) + '^\\circ'); }                       // 47°
  function dgs(x) { return fd(x) + '°'; }                               // plain text (SVG labels)
  function ang(s) { return t('\\angle ' + s); }
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function intNot(r, a, b, not) { return find(function () { return r.int(a, b); }, function (v) { return (not || []).indexOf(v) < 0; }, a); }
  function pickNot(r, arr, not) { return find(function () { return r.pick(arr); }, function (v) { return (not || []).indexOf(v) < 0; }, arr[0]); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var KINDS = ['acute', 'right', 'obtuse', 'straight', 'reflex'];
  var KIND_RULE = { acute: 'less than 90°', right: 'exactly 90°', obtuse: 'between 90° and 180°', straight: 'exactly 180°', reflex: 'between 180° and 360°' };
  var kindOf = G.kindOf;
  var LETTERS = 'DEFGHJKLMNTUVWXYZ'.split('');
  function letters(r, n) { return r.sample(LETTERS, n); }
  function row(items, w) {   // pictures side by side, each with a caption
    return '<div style="display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end;justify-content:flex-start;margin:6px 0">' + items.map(function (it) {
      return '<div style="flex:0 1 ' + (w || 150) + 'px;min-width:' + Math.round((w || 150) * 0.7) + 'px;text-align:center">' + it[0] + (it[1] ? '<div style="font-weight:600;margin-top:2px">' + it[1] + '</div>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function n360(a) { return ((a % 360) + 360) % 360; }

  /* ---- a protractor reading: one box, ±1° (or o.tol) ---- */
  function readPart(prompt, deg, o) {
    o = o || {};
    var chk = G.angleChk(deg, { tol: o.tol == null ? 1 : o.tol, alts: o.alts, reflex: o.reflex, supplementTrap: o.supplementTrap });
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label || '', name: '', after: '°' }] }, check: K.fields([chk], { labels: [''] }),
      key: [fd(deg)], answer: dg(deg), solution: o.sol, hints: o.hints || ['Find the 0 that sits on one arm. Follow <b>that</b> scale round to the other arm.', 'Check: is the angle acute or obtuse? Pick the number that matches.'], text: o.text || 'protractor reading', tol: o.tol == null ? 1 : o.tol };
  }
  /* the arms of a protractor picture: scale 'inner' → one arm on the inner 0 (rot), 'outer' → on the outer 0 (rot + 180) */
  function arms(rot, angle, scale) { return scale === 'outer' ? [rot + 180, rot + 180 - angle] : [rot, rot + angle]; }
  function protSol(o) {
    var sc = o.scale, a = o.angle, k = kindOf(a), other = 180 - a;
    return G.protractorSVG({ angle: a, rot: o.rot, scale: sc, highlight: sc, width: 300, names: o.names }) +
      '<br>One arm sits on the 0 of the <b>' + (sc === 'outer' ? 'outer (black)' : 'inner (grey)') + '</b> scale. Follow that scale round to the other arm: ' + dg(a) + '.' +
      (k === 'right' ? '' : '<br>Check: the angle is ' + k + ', so it is ' + dg(a) + ', not ' + dg(other) + '.');
  }
  /* "the type" as a typed word (in a fields box) */
  function typeChk(kind) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[^a-z]/g, '');
      if (!s) return form('empty', 'Type the type of angle: acute, right, obtuse, straight or reflex.');
      var hit = null; KINDS.forEach(function (k) { if (s === k || s === k + 'angle' || (s.length >= 4 && k.indexOf(s) === 0) || (s.length >= 5 && lev1(s, k))) hit = k; });
      if (!hit) return form('u5l3-type-word', 'Use one of the five names: acute, right, obtuse, straight or reflex.');
      if (hit === kind) return ok();
      return wrong('u5l3-type', 'Compare your angle with 90° and 180°. ' + cap(hit) + ' means ' + KIND_RULE[hit] + '.');
    };
  }
  function lev1(a, b) {   // one typo apart
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, d = 0;
    while (i < a.length && j < b.length) { if (a[i] === b[j]) { i++; j++; continue; } if (++d > 1) return false; if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; } }
    return d + (a.length - i) + (b.length - j) <= 1;
  }
  /* a plain number in a box (degrees optional), with known wrong values: o.dp (round), o.alts [[v, code, hint]] */
  function numChk(ans, o) {
    o = o || {}; var dp = o.dp, exact = o.exact != null ? o.exact : ans;
    return function (resp) {
      var a = G.readDeg(resp);
      if (a.code === 'empty') return form('empty', 'Type your answer first.');
      if (a.code === 'comma') return form('geo-comma', 'Use a decimal <b>point</b>, not a comma.');
      if (a.code) return form('notnumber', 'Type a single number.');
      var v = a.v, dec = (a.s.split('.')[1] || '').length;
      if (same(v, ans) || same(v, exact) || (dp != null && dec >= dp && dec <= dp + 1 && same(v, rd(exact, dec)))) return ok();
      for (var i = 0; o.alts && i < o.alts.length; i++) { var al = o.alts[i]; if (same(v, al[0]) || (dp != null && dec >= 1 && same(v, rd(al[0], dec)))) return al[3] ? form(al[1], al[2]) : wrong(al[1], al[2]); }
      if (dp != null && dec > dp + 1 && Math.abs(v - exact) < Math.pow(10, -dp)) return form('round', 'Right — now round to the nearest ' + (dp === 1 ? 'tenth' : dp === 0 ? 'whole number' : 'hundredth') + '.');
      if (dp != null && dec === dp && Math.abs(v - exact) < Math.pow(10, -dp) && !same(v, rd(exact, dp))) return wrong('u5l3-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up.');
      return wrong('value', null);
    };
  }
  function numPart(prompt, ans, o) {
    o = o || {};
    var key = o.dp != null ? rd(ans, o.dp).toFixed(o.dp) : fd(ans);
    var p = { prompt: prompt, input: { type: 'number', after: o.after, nr: !!o.nr }, check: numChk(o.dp != null ? rd(ans, o.dp) : ans, { dp: o.dp, exact: ans, alts: o.alts }),
      key: key, answer: t(key + (o.afterTex || '')), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = (o.alts || []).filter(function (al) { return !al[3] && !same(al[0], ans) && (o.dp == null || !same(rd(al[0], o.dp), rd(ans, o.dp))); }).map(function (al) { return fd(al[0]); });
    return p;
  }
  /* an angle in a box (exact) with o.alts as [[v, code, hint]] */
  function angPart(prompt, deg, o) {
    o = o || {};
    var p = GP.angle(prompt, deg, { sol: o.sol, hints: o.hints, text: o.text, nr: o.nr, reflex: o.reflex, supplementTrap: o.trap == null ? false : o.trap,
      alts: (o.alts || []).filter(function (al) { return !same(al[0], deg); }).map(function (al) { return { v: al[0], code: al[1], hint: al[2] }; }) });
    p.bad = (o.alts || []).filter(function (al) { return !same(al[0], deg); }).map(function (al) { return fd(al[0]); });
    return p;
  }

  /* ================= polygons ================= */
  var PNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
  function S(n) { return (n - 2) * 180; }
  function sumWork(n) { return t('S=(' + n + '-2)\\times 180^\\circ=' + (n - 2) + '\\times 180^\\circ=' + S(n) + '^\\circ'); }
  function sumAlts(n) {
    return [[n * 180, 'u5l3-no-minus2', 'Subtract 2 from the number of sides <b>first</b>: ' + t('(n-2)\\times 180^\\circ') + '. (Use brackets on the calculator.)'],
      [(n - 1) * 180, 'u5l3-minus1', 'The number of triangles is the number of sides minus <b>2</b>, not minus 1.'],
      [n * 180 - 2, 'u5l3-brackets', 'Subtract 2 from the sides <b>before</b> multiplying: ' + t('(' + n + '-2)\\times 180') + '. Use brackets on the calculator.'],
      [n - 2, 'u5l3-triangles', 'That’s the number of triangles. Each triangle adds ' + dg(180) + ': multiply by 180°.']];
  }
  function eachAlts(n) {
    return [[n * 180 / n, 'u5l3-each-no-minus2', 'Find the sum first with ' + t('(n-2)\\times 180^\\circ') + ', then divide by ' + n + '.'], [360 / n, 'u5l3-turn', 'That’s ' + t('360^\\circ\\div ' + n) + ' (the turn at each corner). The angle <b>inside</b> is the sum ÷ ' + n + '.'],
      [S(n), 'u5l3-sum-not-each', 'That’s the sum of all ' + n + ' angles. Divide by ' + n + ' to get each one.'], [S(n) / (n - 2), 'u5l3-div-triangles', 'Divide the sum by the number of <b>angles</b> (' + n + '), not by the number of triangles.']];
  }
  /* a convex polygon with these interior angles (in order), sides kept similar; points in math coordinates (y up) */
  function polyPts(r, A) {
    var n = A.length;
    for (var tries = 0; tries < 300; tries++) {
      var d = [0]; for (var i = 1; i < n; i++) d.push(d[i - 1] + 180 - A[i]);
      var L = [], sx = 0, sy = 0, base = 100;
      for (var j = 0; j < n - 2; j++) { L.push(base * (0.75 + r.int(0, 60) / 100)); sx += L[j] * Math.cos(d[j] * Math.PI / 180); sy += L[j] * Math.sin(d[j] * Math.PI / 180); }
      var u = [Math.cos(d[n - 2] * Math.PI / 180), Math.sin(d[n - 2] * Math.PI / 180)], w = [Math.cos(d[n - 1] * Math.PI / 180), Math.sin(d[n - 1] * Math.PI / 180)];
      var det = u[0] * w[1] - u[1] * w[0]; if (Math.abs(det) < 1e-6) continue;
      var a = (-sx * w[1] + sy * w[0]) / det, b = (-u[0] * sy + u[1] * sx) / det;
      if (a < base * 0.6 || b < base * 0.6 || a > base * 1.8 || b > base * 1.8) continue;
      L.push(a, b);
      var pts = [[0, 0]]; for (var k = 0; k < n - 1; k++) { var p = pts[k]; pts.push([p[0] + L[k] * Math.cos(d[k] * Math.PI / 180), p[1] + L[k] * Math.sin(d[k] * Math.PI / 180)]); }
      return pts;
    }
    return null;
  }
  /* angles that add to `sum`, each in [lo, hi], whole degrees, not in `not` */
  function anglesFor(r, n, sum, lo, hi, not) {
    return find(function () { var a = []; for (var i = 0; i < n - 1; i++) a.push(r.int(lo, hi)); var last = sum - a.reduce(function (s, x) { return s + x; }, 0); a.push(last); return a; },
      function (a) { var last = a[a.length - 1]; return last >= lo && last <= hi && a.every(function (x) { return (not || []).indexOf(x) < 0; }); }, null);
  }
  /* regular polygons meeting at one point (the booklet's patio and tiles); list of side counts in order round the point */
  function tileSVG(list, o) {
    o = o || {}; var s = o.side || 46, th = o.start || 0, paths = '', bb = [0, 0, 0, 0], FILL = ['#e7ebf2', '#d5dbe6', '#c3ccdb', '#e7ebf2', '#d5dbe6', '#c3ccdb'];
    list.forEach(function (n, j) {
      var ext = 360 / n, pts = [[0, 0]], dir = th;
      for (var i = 0; i < n - 1; i++) { var p = pts[i]; pts.push([p[0] + s * Math.cos(dir * Math.PI / 180), p[1] - s * Math.sin(dir * Math.PI / 180)]); dir += ext; }
      pts.forEach(function (p) { bb[0] = Math.min(bb[0], p[0]); bb[1] = Math.min(bb[1], p[1]); bb[2] = Math.max(bb[2], p[0]); bb[3] = Math.max(bb[3], p[1]); });
      paths += '<path d="M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z" fill="' + (n === 4 && list.length === 3 ? '#b9c2d3' : FILL[j % FILL.length]) + '" stroke="#1d2633" stroke-width="2" stroke-linejoin="round"/>';
      th += 180 - ext;
    });
    paths += '<circle cx="0" cy="0" r="4" fill="#c93a33"/>';
    var pad = 8, W = bb[2] - bb[0] + 2 * pad, H = bb[3] - bb[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + (bb[0] - pad).toFixed(1) + ' ' + (bb[1] - pad).toFixed(1) + ' ' + W.toFixed(1) + ' ' + H.toFixed(1) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || 220, W * 1.3)) + 'px" role="img" aria-label="tiles meeting at a point">' + paths + '</svg>';
  }

  /* ================= multiple-choice builders ================= */
  /* "what type of angle is it?" with reasons; kind = right type, reason = the right reason */
  var GENERIC = { acute: 'Acute: it is less than 90°, sharper than a square corner.', right: 'Right: it is exactly 90°, a square corner.', obtuse: 'Obtuse: it is wider than a square corner but not flat.',
    straight: 'Straight: the two arms make one straight line, 180°.', reflex: 'Reflex: it is more than a half turn, over 180°.' };
  function typeMC(r, prompt, kind, reason, sol, hints, text, why) {
    var others = r.shuffle(KINDS.filter(function (k) { return k !== kind && k !== 'straight'; })).slice(0, 3);
    var opts = [{ html: '<b>' + cap(kind) + '</b>: ' + reason, right: true }].concat(others.map(function (k) { return { html: GENERIC[k].replace(/^(\w+):/, '<b>$1</b>:'), why: why || ('Picture it: compare the angle with a square corner (90°) and a straight line (180°). ' + cap(k) + ' means ' + KIND_RULE[k] + '.'), code: 'kind-' + k }; }));
    return P.mc(r, prompt, opts, sol, hints || ['Compare with a square corner (90°) and a straight line (180°).'], text);
  }
  function classifyGrid(prompt, list, sol, text) {
    var rows = list.map(function (x, i) { return { id: 'r' + i, html: dg(x), label: dgs(x) }; }), cols = KINDS.map(function (k) { return { id: k, html: k, label: k }; }), want = {};
    list.forEach(function (x, i) { want['r' + i] = kindOf(x); });
    return P.grid(prompt, rows, cols, want, { rowHead: 'Angle', why: function (rid, got) { var x = list[Number(rid.slice(1))]; return { code: 'u5l3-type', hint: 'Look again at ' + dg(x) + ': ' + (got ? cap(got) + ' means ' + KIND_RULE[got] + '. ' : '') + 'Compare it with 90° and 180°.' }; } },
      sol || list.map(function (x) { return dg(x) + ': ' + kindOf(x) + ' (' + KIND_RULE[kindOf(x)] + ')'; }).join('<br>'), ['acute < 90° · right = 90° · obtuse between 90° and 180° · straight = 180° · reflex > 180°'], text || 'angle types');
  }
  /* "which drawing is right?" — the protractor on the given arm in every picture; arm = direction of the given arm,
   * scale: which 0 is on it ('inner' when the arm runs out to the right end of the base line) */
  function drawMC(r, prompt, x, armDir, scale, o) {
    o = o || {}; var rot = scale === 'outer' ? armDir - 180 : armDir, sgn = scale === 'outer' ? -1 : 1;
    var cands = [[x, true, null, 'right']];
    if (Math.abs(180 - 2 * x) > 12) cands.push([180 - x, false, 'That arm is at ' + x + ' on the <b>other</b> scale. Start from the 0 that sits on the given arm and follow that scale.', 'u5l3-draw-other']);
    var d10 = [x + 10, x - 10].filter(function (v) { return v > 3 && v < 177 && Math.abs(v - (180 - x)) > 6; });
    d10.forEach(function (v) { cands.push([v, false, 'Count the marks again: that arm is at ' + dgs(v) + ', not ' + dgs(x) + '.', 'u5l3-draw-miscount']); });
    [x + 25, x - 25, x + 35, x - 35].forEach(function (v) { if (cands.length < 4 && v > 3 && v < 177 && cands.every(function (c) { return Math.abs(c[0] - v) >= 6; })) cands.push([v, false, 'Read where that arm crosses the scale that starts at 0 on the given arm: it isn’t ' + dgs(x) + '.', 'u5l3-draw-off']); });
    cands = cands.slice(0, 4);
    var opts = cands.map(function (c) { return { html: G.protractorSVG({ arms: [armDir, armDir + sgn * c[0]], rot: rot, width: 330, R: 190 }), right: c[1], why: c[2], code: c[3] }; });
    var part = P.mc(r, prompt, opts, o.sol || ('The 0 on the given arm is on the <b>' + (scale === 'outer' ? 'outer' : 'inner') + '</b> scale. Follow that scale to ' + x + ' and draw the arm through that mark.<br>' + G.protractorSVG({ arms: [armDir, armDir + sgn * x], rot: rot, highlight: scale, width: 260, R: 170 })),
      o.hints || ['Find the 0 that sits on the given arm. Follow <b>that</b> scale to ' + x + '.', 'Check: should the angle be acute or obtuse?'], o.text || 'draw ' + x);
    part.input.columns = 2;
    return part;
  }
  /* "draw a reflex angle of R°": choose the picture */
  function reflexDrawMC(r, prompt, R, o) {
    o = o || {}; var s = 360 - R, base = o.base == null ? 0 : o.base, W = 150;
    var pic = function (small, reflex) { return G.angleSVG({ a1: base, a2: base + small, reflex: reflex, width: W }); };
    var alt = s + (s <= 90 ? 35 : -35);
    var opts = [{ html: pic(s, true), right: true },
      { html: pic(s, false), why: 'That arc marks the <b>small</b> angle (' + dgs(s) + '). A reflex angle is marked the long way round.', code: 'u5l3-reflex-small-arc' },
      { html: pic(180 - s, true), why: 'That reflex angle is ' + t('360^\\circ-' + (180 - s) + '^\\circ=' + (180 + s) + '^\\circ') + '. First find the small angle: ' + t('360^\\circ-' + R + '^\\circ') + '.', code: 'u5l3-reflex-180' },
      { html: pic(alt, true), why: 'Estimate the small angle in that picture: it isn’t ' + t('360^\\circ-' + R + '^\\circ=' + s + '^\\circ') + '.', code: 'u5l3-reflex-off' }];
    var part = P.mc(r, prompt, opts, 'Small angle: ' + t('360^\\circ-' + R + '^\\circ=' + s + '^\\circ') + '. Draw ' + dg(s) + ', then mark the reflex angle with an arc going the long way round.<br>' + G.angleSVG({ a1: base, a2: base + s, reflex: true, label: dgs(R), width: 170 }),
      ['Reflex angle = 360° − the small angle. So the small angle is 360° − ' + R + '°.'], o.text || 'draw reflex ' + R);
    part.input.columns = 2;
    return part;
  }

  HW.addCodes({
    'u5l3-type': 'Wrong type of angle', 'u5l3-type-word': 'Not a type name', 'u5l3-round-dir': 'Rounded the wrong way', 'u5l3-no-minus2': 'Used n × 180° (forgot to subtract 2)', 'u5l3-minus1': 'Used (n − 1) × 180°',
    'u5l3-brackets': 'Did n × 180 − 2 (no brackets)', 'u5l3-triangles': 'Gave the number of triangles', 'u5l3-each-no-minus2': 'Each angle: forgot to subtract 2', 'u5l3-turn': 'Gave 360° ÷ n (the turn), not the inside angle',
    'u5l3-sum-not-each': 'Gave the sum, not each angle', 'u5l3-div-triangles': 'Divided the sum by n − 2', 'u5l3-draw-other': 'Drew the angle with the other scale', 'u5l3-draw-miscount': 'Drew the angle 10° off (miscounted marks)',
    'u5l3-draw-off': 'Drew the wrong angle', 'u5l3-reflex-small-arc': 'Marked the small angle instead of the reflex', 'u5l3-reflex-180': 'Reflex: used 180° instead of 360°', 'u5l3-reflex-off': 'Drew the wrong reflex angle',
    'u5l3-reflex-sub180': 'Reflex: subtracted from 180°', 'u5l3-reflex-add180': 'Reflex: added 180°', 'u5l3-reflex-90': 'Reflex: subtracted from 90°', 'u5l3-missing-sum': 'Missing angle: used the wrong angle sum',
    'u5l3-missing-known': 'Missing angle: gave the sum of the known angles', 'u5l3-sides-triangles': 'Gave the number of triangles, not sides', 'u5l3-mai': 'Gave the wrong-scale reading again', 'u5l3-name-vertex': 'Vertex not in the middle of the name',
    'u5l3-name-letter': 'Named the angle by a letter that isn’t the vertex', 'u5l3-not-zero': 'Read one arm instead of subtracting the readings', 'u5l3-turns': 'Gave the number of triangles', 'u5l3-sides-ext': 'Sides: used 360 ÷ the angle', 'u5l3-name-ok': 'Rejected a correct name'
  });
  HW.addPartial({ 'u5l3-round-dir': 's', 'u5l3-brackets': 'b', 'u5l3-no-minus2': 'b', 'u5l3-minus1': 'b', 'u5l3-each-no-minus2': 'b', 'u5l3-sum-not-each': 'b', 'u5l3-div-triangles': 'b', 'u5l3-missing-known': 'b', 'u5l3-triangles': 'b', 'u5l3-sides-triangles': 'b', 'u5l3-draw-miscount': 's' });

  /* ================= question builders ================= */
  /* Q1 / Extra 2: one angle with letter names and a number inside */
  function nameShared(r, notNum) {
    var L = letters(r, 3), n = pickNot(r, [3, 4, 5, 6, 7, 8, 9], notNum), a1 = r.int(0, 359), span = r.int(45, 110);
    return { L: L, n: n, a1: a1, span: span, svg: G.angleSVG({ a1: a1, a2: a1 + span, label: String(n), names: L, width: 230 }) };
  }
  function nameGrid(r, sh) {
    var A = sh.L[0], V = sh.L[1], C = sh.L[2], cands = [
      ['\\angle ' + A + V + C, true, null], ['\\angle ' + C + V + A, true, null], ['\\angle ' + V, true, null], ['\\angle ' + sh.n, true, null],
      ['\\angle ' + V + A + C, false, 'With three letters, the <b>vertex</b> (' + V + ') must be the middle letter.'], ['\\angle ' + A + C + V, false, 'With three letters, the <b>vertex</b> (' + V + ') must be the middle letter.'],
      ['\\angle ' + r.pick([A, C]), false, 'One letter alone names the angle by its <b>vertex</b>. The vertex is ' + V + '.']];
    var pick = r.shuffle(cands.slice(0, 4)).slice(0, 3).concat(r.shuffle(cands.slice(4)).slice(0, 2)), rows = r.shuffle(pick);
    var want = {}, rr = rows.map(function (c, i) { want['n' + i] = c[1] ? 'yes' : 'no'; return { id: 'n' + i, html: t(c[0]), label: c[0] }; });
    return P.grid('Which of these are correct names for the angle? (Choose yes or no for each.)', rr, [{ id: 'yes', html: 'Yes' }, { id: 'no', html: 'No' }], want,
      { rowHead: 'Name', why: function (rid) { var c = rows[Number(rid.slice(1))]; return { code: c[1] ? 'u5l3-name-ok' : (/must be the middle/.test(c[2]) ? 'u5l3-name-vertex' : 'u5l3-name-letter'), hint: c[1] ? t(c[0]) + ' is a correct name: ' + (c[0].length > 9 ? 'the vertex ' + V + ' is in the middle.' : /\d/.test(c[0]) ? 'the number inside the angle names it.' : 'there is only one angle at ' + V + '.') : c[2] }; } },
      'The three ways: ' + t('\\angle ' + sh.n) + ', ' + t('\\angle ' + A + V + C) + ' (or ' + t('\\angle ' + C + V + A) + '), and ' + t('\\angle ' + V) + '.<br>' + t('\\angle ' + V) + ' is fine here because there is only one angle at ' + V + '. With three letters the vertex goes in the middle.',
      ['With three letters, the vertex goes in the middle.', 'One letter alone must be the vertex.'], 'name the angle');
  }

  /* reading parts for Q5 / Extra 3 */
  function readQ(prompt, o) { return readPart(prompt, o.angle, { sol: protSol(o), text: o.text || 'read ' + o.scale + ' ' + o.angle }); }
  function protPrompt(o, lead) { return (lead || 'Read the protractor. Give the size of the angle.') + '<br>' + G.protractorSVG({ angle: o.angle, rot: o.rot, scale: o.scale, width: 360, names: o.names }); }

  /* Q7: measure a full-size angle (shown with the protractor on it) and give its type */
  function measureType(r, V, ang0, rot, scale) {
    var o = { angle: ang0, rot: rot, scale: scale, names: [null, V, null] }, kind = kindOf(ang0);
    var chk = [G.angleChk(ang0, { tol: 1 }), typeChk(kind)];
    return { prompt: 'Measure ' + ang(V) + ' and write its type.<br>' + G.protractorSVG({ angle: ang0, rot: rot, scale: scale, width: 340, names: o.names }),
      input: { type: 'fields', fields: [{ label: t('\\angle ' + V + '='), name: '∠' + V, after: '°' }, { label: 'Type:', name: 'Type', mode: 'text', wide: true, placeholder: 'acute, obtuse…' }] },
      check: K.fields(chk, { labels: ['∠' + V, 'Type'] }), key: [String(ang0), kind], answer: t('\\angle ' + V + '=' + ang0 + '^\\circ') + ', ' + kind,
      solution: protSol(o) + '<br>' + dg(ang0) + ' is ' + KIND_RULE[kind] + ', so ∠' + V + ' is <b>' + kind + '</b>.', hints: ['The protractor has been turned. Find the 0 that sits on one arm, and follow that scale.', 'Then compare the angle with 90° and 180° for its type.'], text: 'measure + type' };
  }

  /* reflex from a small angle (exact) */
  function reflexPart(prompt, s, o) {
    o = o || {};
    return angPart(prompt, 360 - s, { reflex: true, alts: [[180 - s, 'u5l3-reflex-sub180', 'A full turn is <b>360°</b>, not 180°. Reflex = 360° − the small angle.'], [180 + s, 'u5l3-reflex-add180', 'Reflex = <b>360°</b> − the small angle (not 180° + it).'], [90 - s, 'u5l3-reflex-90', 'Reflex = 360° − the small angle.']],
      sol: t('360^\\circ-' + s + '^\\circ=' + (360 - s) + '^\\circ') + '. The reflex angle is ' + dg(360 - s) + '.', hints: ['Reflex angle = 360° − the smaller angle.', 'Check: the answer must be between 180° and 360°.'], text: o.text || 'reflex of ' + s });
  }
  /* measure a marked reflex angle: the protractor sits on the small angle */
  function reflexMeasure(r, prompt, s, o) {
    o = o || {}; var rot = o.rot == null ? r.int(0, 359) : o.rot, sc = o.scale || r.pick(['inner', 'outer']), A = arms(rot, s, sc);
    var pics = row([[G.angleSVG({ a1: A[0], a2: A[1], reflex: true, width: 180 }), 'the marked angle'], [G.protractorSVG({ arms: A, rot: rot, width: 280, R: 170 }), 'the protractor on its arms']], 230);
    return readPart(prompt + pics, 360 - s, { reflex: true, alts: [{ v: 180 - s, code: 'u5l3-reflex-sub180', hint: 'A full turn is <b>360°</b>. Reflex = 360° − the small angle.' }, { v: 180 + s, code: 'u5l3-reflex-add180', hint: 'Reflex = 360° − the small angle, not 180° + it.' }],
      sol: 'Small angle (read the protractor): ' + dg(s) + '<br>Reflex: ' + t('360^\\circ-' + s + '^\\circ=' + (360 - s) + '^\\circ') + '<br>' + G.protractorSVG({ arms: A, rot: rot, highlight: sc, width: 260, R: 170 }),
      hints: ['A protractor only goes to 180°. Read the small angle first.', 'Then reflex = 360° − the small angle.'], text: o.text || 'measure reflex' });
  }

  /* a polygon table row: [sides?], sum, each (to the tenth) */
  function polyRow(label, n, askN) {
    var each = S(n) / n, eachKey = rd(each, 1), fields = [], chks = [], keys = [], ans = [];
    if (askN) { fields.push({ label: 'Sides ' + t('n') + ':', name: 'Sides' }); chks.push(numChk(n, { alts: [[n - 2, 'u5l3-sides-triangles', 'That’s the number of triangles. How many <b>sides</b> does a ' + PNAME[n] + ' have?']] })); keys.push(String(n)); ans.push(t('n=' + n)); }
    fields.push({ label: 'Sum:', name: 'Sum', after: '°' }); chks.push(numChk(S(n), { alts: sumAlts(n) })); keys.push(String(S(n))); ans.push('sum ' + dg(S(n)));
    fields.push({ label: 'Each angle (if regular):', name: 'Each angle', after: '°' }); chks.push(numChk(eachKey, { dp: 1, exact: each, alts: eachAlts(n) })); keys.push(Number.isInteger(each) ? String(each) : eachKey.toFixed(1)); ans.push('each ' + dg(eachKey));
    var p = P.fields(label, fields, chks, keys, ans.join(', '),
      (askN ? 'A ' + PNAME[n] + ' has ' + n + ' sides.<br>' : '') + sumWork(n) + '<br>Each: ' + t(S(n) + '^\\circ\\div ' + n + (Number.isInteger(each) ? '=' : '\\approx ') + fd(eachKey) + '^\\circ'),
      ['Sum = (n − 2) × 180°.', 'Each angle of a regular polygon = sum ÷ n.'], PNAME[n] + ' row');
    p.bad = [keys.map(function (k, i) { return i === keys.length - 1 ? String(rd(360 / n, 1)) : k; })];
    return p;
  }

  /* find x in a polygon drawn with its angles */
  function missingPart(r, n, o) {
    o = o || {}; var sum = S(n), A = null, pts = null;
    for (var g = 0; g < 60 && !pts; g++) { A = anglesFor(r, n, sum, o.lo, o.hi, o.not); if (A) pts = polyPts(r, A); }
    if (!pts) { A = o.fallback; pts = polyPts(r, A) || polyPts(HW.rng(7), A); }
    var xi = r.int(0, n - 1), x = A[xi], known = A.filter(function (v, i) { return i !== xi; }), ks = known.reduce(function (s, v) { return s + v; }, 0);
    var labels = A.map(function (v, i) { return i === xi ? 'x' : v; });
    var svg = G.polygonSVG({ pts: pts, angles: labels, width: o.width || 240 });
    var alts = [[ks, 'u5l3-missing-known', 'That’s the total of the angles you know. Subtract it from the sum of all ' + n + ' angles (' + dg(sum) + ').']];
    if (n > 3) alts.push([180 * (n - 1) - ks, 'u5l3-missing-sum', 'Find the angle sum with ' + t('(n-2)\\times 180^\\circ') + ': a ' + PNAME[n] + ' has ' + n + ' sides, so the sum is ' + dg(sum) + '.'], [n * 180 - ks, 'u5l3-missing-sum', 'Find the sum with ' + t('(' + n + '-2)\\times 180^\\circ=' + sum + '^\\circ') + ', not ' + t(n + '\\times 180^\\circ') + '.']);
    if (n === 4) alts.push([180 - ks, 'u5l3-missing-sum', 'A quadrilateral’s angles add to 360°, not 180°.']);
    if (n === 3) alts.push([360 - ks, 'u5l3-missing-sum', 'The angles in a triangle add to <b>180°</b>.']);
    return angPart((o.lead || 'Find the missing angle ' + t('x') + '.') + '<br>' + svg, x, { alts: alts,
      sol: (n === 3 ? 'Triangle: the angles add to ' + dg(180) : sumWork(n)) + '<br>Known angles: ' + t(known.join('+') + '=' + ks + '^\\circ') + '<br>' + t('x=' + sum + '^\\circ-' + ks + '^\\circ=' + x + '^\\circ'),
      hints: ['First find the sum of all the angles: (n − 2) × 180°.', 'Then subtract the angles you know.'], text: o.text || 'missing angle ' + PNAME[n] });
  }

  /* ================= lesson ================= */
  HW.u5angles = { readPart: readPart, typeChk: typeChk, protSol: protSol, arms: arms, polyPts: polyPts, tileSVG: tileSVG, drawMC: drawMC, classifyGrid: classifyGrid };

  HW.defineLesson({
    id: 'u5l3', unit: 5, num: '3', title: 'Measuring, Drawing and Classifying Angles', outcome: 'G6',
    blurb: 'Naming angles, sorting them by type, reading a protractor (even when it is turned), drawing angles, reflex angles, and the angle sum of a polygon.',
    questions: [
      { num: '1', stem: function (sh) { return 'Use the picture.' + row([[sh.svg, '']], 230); }, shared: function (r) { return nameShared(r, [1, 2]); }, parts: [
        { id: '1a', level: 'LIM', make: function (r, sh) { var V = sh.L[1]; return P.mc(r, 'Which point is the vertex?', sh.L.map(function (l) { return { html: '<b>' + l + '</b>', right: l === V, why: 'The vertex is the point where the two arms <b>start</b>.', code: 'vertex' }; }).concat([{ html: 'the number ' + sh.n, why: 'The number ' + sh.n + ' is just a name written inside the angle. The vertex is a point.', code: 'vertex-num' }]),
          'The vertex is <b>' + V + '</b>, the point where both arms start.', ['The vertex is the corner point where the two arms meet.'], 'vertex', true); } },
        { id: '1b', level: 'BEG', make: function (r, sh) { var A = sh.L[0], V = sh.L[1], C = sh.L[2]; return P.mc(r, 'Name the two arms.', [
          { html: t(V + A) + ' and ' + t(V + C), right: true }, { html: t(A + C) + ' and ' + t(V + C), why: 'Both arms start at the vertex ' + V + '. ' + t(A + C) + ' isn’t drawn.', code: 'arm-ac' },
          { html: t(A) + ' and ' + t(C), why: 'An arm is a ray from the vertex, so its name has two letters: the vertex and a point on the arm.', code: 'arm-letters' }, { html: t(A + V) + ' and ' + t(A + C), why: 'Both arms start at the vertex ' + V + '.', code: 'arm-wrong' }],
          'The arms are the two rays from the vertex: ' + t(V + A) + ' and ' + t(V + C) + '.', ['Each arm starts at the vertex.'], 'arms'); } },
        { id: '1c', level: 'EMG', make: function (r, sh) { return nameGrid(r, sh); } }] },
      { num: '2', stem: 'Write the type of each angle: acute, right, obtuse, straight or reflex.', parts: [
        { id: '2', level: 'BEG', make: function (r) {
          var list = [intNot(r, 10, 70, [47]), intNot(r, 71, 88, [89]), 90, intNot(r, 91, 120, [112]), intNot(r, 170, 179, [163]), 180, intNot(r, 182, 270, [181]), intNot(r, 330, 359, [300])];
          return classifyGrid('Choose the type of each angle.', r.shuffle(list));
        } }] },
      { num: '3', stem: 'Write the type of each marked angle.', parts: [
        { id: '3', level: 'BEG', make: function (r) {
          var kinds = r.shuffle(['acute', 'obtuse', 'right', 'reflex', 'straight']), labs = 'abcde'.split(''), sizes = [];
          var pics = kinds.map(function (k, i) {
            var a1 = r.int(0, 359), sp = k === 'acute' ? r.int(25, 70) : k === 'obtuse' ? r.int(110, 165) : k === 'right' ? 90 : k === 'straight' ? 180 : r.int(70, 150); sizes.push(k === 'reflex' ? 360 - sp : sp);
            return [G.angleSVG({ a1: a1, a2: a1 + sp, reflex: k === 'reflex', width: 130, len: 80 }), '(' + labs[i] + ')'];
          });
          var rows = labs.map(function (l) { return { id: l, html: '(' + l + ')' }; }), want = {}; labs.forEach(function (l, i) { want[l] = kinds[i]; });
          return P.grid(row(pics, 120), rows, KINDS.map(function (k) { return { id: k, html: k }; }), want,
            { rowHead: 'Picture', why: function (rid, got) { var k = kinds[labs.indexOf(rid)]; return { code: 'u5l3-type', hint: 'Look again at (' + rid + '): ' + (k === 'right' ? 'a small square marks a square corner.' : k === 'reflex' ? 'the arc goes the <b>long way round</b>.' : k === 'straight' ? 'the two arms make one straight line.' : 'compare the marked angle with a square corner.') }; } },
            labs.map(function (l, i) { return '(' + l + ') ' + kinds[i] + (kinds[i] === 'right' ? ': the square mark means 90°' : kinds[i] === 'reflex' ? ': the arc goes the long way round' : kinds[i] === 'straight' ? ': the arms make a straight line' : ''); }).join('<br>'),
            ['A small square means 90°. An arc the long way round means reflex.'], 'marked angle types');
        } }] },
      { num: '4', stem: 'What type of angle is each one? Choose the type and the reason.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var c = r.pick([['the angle between a wall and the floor', 'a wall meets the floor in a square corner.'], ['the corner of a page in your notebook', 'a page has square corners.'], ['the angle between a fence post standing straight up and the flat ground', 'straight up meets flat ground in a square corner.'], ['the angle between a shelf and the wall it is screwed to', 'a level shelf meets a straight wall in a square corner.']]);
          return typeMC(r, cap(c[0]) + '.', 'right', c[1], 'Right: ' + c[1], null, 'type: ' + c[0]); } },
        { id: '4b', level: 'EMG', make: function (r) { var n = r.pick([3, 4, 5, 6, 9, 10, 12]), a = 360 / n, k = kindOf(a);
          return typeMC(r, 'The point of a slice of pie, when the pie is cut into ' + n + ' equal slices.', k, t('360^\\circ\\div ' + n + '=' + a + '^\\circ') + (k === 'acute' ? ', less than 90°.' : k === 'right' ? ', a square corner.' : ', between 90° and 180°.'),
            'A full turn is 360°. ' + t('360^\\circ\\div ' + n + '=' + a + '^\\circ') + ', so the point of each slice is <b>' + k + '</b>.', ['The whole pie makes a full turn, 360°. Share it among the slices.'], 'pie ' + n, 'Work it out: the whole pie is 360°, shared equally among ' + n + ' slices.'); } },
        { id: '4c', level: 'EMG', make: function (r) { var c = r.pick([['the angle between a car seat and its seat back, when the seat back is leaning back a little', 'wider than a square corner, but not flat.'], ['the angle between the seat and the back of a reclining lawn chair', 'it leans back past a square corner, but it is not flat.'], ['the angle at the peak of a wide, low roof (between the two sides of the roof)', 'it is much wider than a square corner, but the roof is not flat.'], ['the angle between a door and its frame, when the door is swung open wider than a square corner', 'wider than a square corner, but not a straight line.']]);
          return typeMC(r, cap(c[0]) + '.', 'obtuse', c[1], 'Obtuse: ' + c[1], null, 'type obtuse'); } },
        { id: '4d', level: 'BEG', make: function (r) { var c = r.pick([['the angle between a skateboard ramp and the ground it sits on', 'the ramp is tilted only a little from the ground.'], ['the angle between a wheelchair ramp and the ground', 'the ramp rises only a little from the ground.'], ['the point of a sharpened pencil', 'it is a sharp point, much less than a square corner.'], ['the angle between the blades of scissors opened a little', 'the blades are only a little apart.']]);
          return typeMC(r, cap(c[0]) + '.', 'acute', c[1], 'Acute: ' + c[1], null, 'type acute'); } }] },
      { num: '5', stem: 'Read each protractor. Give the size of the angle.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var o = { angle: intNot(r, 15, 50, [35, 38, 40]), rot: 0, scale: 'inner' }; return readQ(protPrompt(o), o); } },
        { id: '5b', level: 'EMG', make: function (r) { var o = { angle: intNot(r, 100, 140, [108, 125, 127, 135]), rot: 0, scale: 'outer' }; return readQ(protPrompt(o), o); } },
        { id: '5c', level: 'EMG', make: function (r) { var o = { angle: intNot(r, 30, 80, [35, 38, 50, 64, 74]), rot: pickNot(r, [60, 70, 80, 90, 100, 120, 130, 150], []), scale: 'inner' }; return readQ(protPrompt(o, 'The protractor is turned. Read it and give the size of the angle.'), o); } },
        { id: '5d', level: 'PRG', make: function (r) { var o = { angle: intNot(r, 150, 172, [165]), rot: r.pick([-20, -30, -40, -50, 200, 210, 220]), scale: 'outer' }; return readQ(protPrompt(o, 'The protractor is turned. Read it and give the size of the angle.'), o); } }] },
      { num: '6', stem: function (sh) { return 'Mai measured this angle and wrote ' + dg(180 - sh.a) + '.<br>' + G.protractorSVG({ angle: sh.a, rot: 0, scale: sh.sc, width: 340 }); },
        shared: function (r) { var acute = r.chance(0.6); return { a: acute ? intNot(r, 20, 65, [35]) : intNot(r, 115, 160, [145, 135, 125]), sc: acute ? 'inner' : 'outer' }; }, parts: [
        { id: '6a', level: 'EMG', make: function (r, sh) { var side = sh.sc === 'inner' ? 'right' : 'left', scl = sh.sc === 'inner' ? 'inner (grey)' : 'outer (black)';
          return P.mc(r, 'What mistake did she make?', [
            { html: 'She read the wrong scale. Her 0 is on the ' + side + ' arm, so she must use the ' + scl + ' scale that starts at 0 on that arm.', right: true },
            { html: 'She didn’t put the centre mark on the vertex.', why: 'Look at the picture: the centre mark is right on the vertex.', code: 'centre' },
            { html: 'She measured the reflex angle.', why: 'A reflex angle is more than 180°. ' + dg(180 - sh.a) + ' is less than 180°.', code: 'reflex' },
            { html: 'She should have subtracted her reading from 360°.', why: 'That would give a reflex angle. Her problem is which <b>scale</b> she read.', code: '360' }],
            'Her 0 is on the ' + side + ' arm, so she should read the ' + scl + ' scale. She read the other scale.', ['Which 0 sits on an arm? Which scale starts there?'], 'Mai mistake'); } },
        { id: '6b', sub: 'b i', level: 'BEG', make: function (r, sh) { return readPart('What is the correct measure?', sh.a, { alts: [{ v: 180 - sh.a, code: 'u5l3-mai', hint: 'That’s Mai’s answer, from the other scale. Start at the 0 on the ' + (sh.sc === 'inner' ? 'right' : 'left') + ' arm.' }], supplementTrap: false, sol: protSol({ angle: sh.a, rot: 0, scale: sh.sc }), text: 'Mai correct' }); } },
        { id: '6c', sub: 'b ii', level: 'EMG', make: function (r, sh) { var k = kindOf(sh.a), wk = kindOf(180 - sh.a);
          return P.mc(r, 'How can she check her answer?', [
            { html: 'Look at the angle: it is ' + (k === 'acute' ? 'smaller' : 'wider') + ' than a square corner, so it is ' + k + '. ' + dg(180 - sh.a) + ' would be ' + wk + '.', right: true },
            { html: 'Check that her two readings add up to 360°.', why: 'The two scales at one mark add to <b>180°</b>, and that doesn’t say which one is right. Decide if the angle is acute or obtuse.', code: 'add360' },
            { html: 'Measure it again with longer arms.', why: 'Longer arms don’t change the size of an angle — or which scale to read.', code: 'longer' },
            { html: 'Turn the page upside down and read the same scale again.', why: 'She would read the same wrong scale. Decide first: acute or obtuse?', code: 'turn' }],
            'Estimate first. The angle is ' + k + ', so ' + dg(sh.a) + ' makes sense and ' + dg(180 - sh.a) + ' does not.', ['Is the angle smaller or bigger than a square corner?'], 'Mai check'); } }] },
      { num: '7', stem: 'Measure each angle with the protractor. Then write its type.', shared: function (r) { return { L: letters(r, 3) }; }, parts: [
        { id: '7a', level: 'EMG', make: function (r, sh) { return measureType(r, sh.L[0], intNot(r, 25, 48, [35, 38, 40]), r.pick([30, 45, 60, 75, 100, 120]), r.pick(['inner', 'outer'])); } },
        { id: '7b', level: 'PRG', make: function (r, sh) { return measureType(r, sh.L[1], intNot(r, 130, 160, [135, 145, 127]), r.pick([-25, -40, 160, 200, 215]), r.pick(['inner', 'outer'])); } },
        { id: '7c', level: 'PRG', make: function (r, sh) { return measureType(r, sh.L[2], intNot(r, 92, 118, [108, 115]), r.pick([-60, -75, 235, 250, 140]), r.pick(['inner', 'outer'])); } }] },
      { num: '8', stem: 'Drawing angles with a protractor and a ruler.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { var x = intNot(r, 25, 55, [35, 50]); return drawMC(r, 'Leo draws a ' + dg(x) + ' angle on an arm that points to the right, with the protractor’s base line on that arm. Which drawing is right?', x, 0, 'inner'); } },
        { id: '8b', level: 'EMG', make: function (r) { var x = intNot(r, 110, 145, [125, 135]); return drawMC(r, 'Leo draws a ' + dg(x) + ' angle on an arm that points to the left, with the protractor’s base line on that arm. Which drawing is right?', x, 180, 'outer'); } },
        { id: '8c', level: 'BEG', make: function (r) { var x = pickNot(r, [40, 65, 80, 115, 125, 140, 160], []);
          var items = [{ id: 's1', html: 'Use a ruler to draw one arm. Put a dot at one end for the vertex.' }, { id: 's2', html: 'Put the centre mark on the vertex and the base line along the arm.' },
            { id: 's3', html: 'Start at the 0 on your arm. Follow that scale to ' + x + ' and make a small dot.' }, { id: 's4', html: 'Take the protractor away. Join the vertex to the dot with a ruler. Label the angle ' + x + '°.' }];
          var p = P.order(r, 'Put the steps for drawing a ' + dg(x) + ' angle in order.', items, { first: 'first step', last: 'last step' }, items.map(function (s, i) { return (i + 1) + '. ' + s.html; }).join('<br>'), ['You can’t place the protractor until there is an arm to put it on.'], 'drawing steps');
          return p; } },
        { id: '8d', level: 'PRG', make: function (r) { var x = intNot(r, 150, 170, [155]), arm = r.pick([200, 210, 220, 30, 40]); return drawMC(r, 'Leo draws a ' + dg(x) + ' angle on a slanted arm (the protractor is turned so its base line is on that arm). Which drawing is right?', x, arm, arm > 90 ? 'outer' : 'inner'); } }] },
      { num: '9', stem: 'Reflex angles.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { var s = intNot(r, 10, 45, [30]); return reflexPart('The smaller angle is ' + dg(s) + '. Find the reflex angle that goes with it.', s); } },
        { id: '9b', level: 'BEG', make: function (r) { var s = intNot(r, 120, 165, [125, 145]); return reflexPart('The smaller angle is ' + dg(s) + '. Find the reflex angle that goes with it.', s); } },
        { id: '9c', level: 'BEG', make: function (r) { var s = r.pick([90, 60, 120, 80, 100]); return reflexPart('The smaller angle is ' + dg(s) + '. Find the reflex angle that goes with it.', s); } },
        { id: '9d', level: 'EMG', make: function (r) { var s = intNot(r, 170, 179, []); return reflexPart('The smaller angle is ' + dg(s) + '. Find the reflex angle that goes with it.', s); } },
        { id: '9e', level: 'PRG', make: function (r) { var s = intNot(r, 100, 140, [118, 64]); return reflexMeasure(r, 'Measure the marked reflex angle (the red arc).', s); } },
        { id: '9f', level: 'EMG', make: function (r) { var R = pickNot(r, [210, 225, 230, 290, 300, 310, 315, 320, 330], []); return reflexDrawMC(r, 'Which picture shows a reflex angle of ' + dg(R) + '?', R); } }] },
      { num: '10', stem: 'Complete the table for each polygon. Round to the nearest tenth of a degree if needed.', shared: function (r) {
          return { ns: [r.pick([5, 6]), 7].concat(r.shuffle([9, 10, 12]).slice(0, 2).sort(function (a, b) { return a - b; })) };
        }, parts: [0, 1, 2, 3].map(function (i) {
          return { id: '10' + 'abcd'[i], level: i === 1 ? 'PRG' : 'EMG', make: function (r, sh) { var n = sh.ns[i]; return polyRow('(' + 'abcd'[i] + ') ' + cap(PNAME[n]) + (i === 0 ? ', ' + t('n=' + n) : '') + (n === 7 ? ' (each angle: round to the nearest tenth)' : ''), n, i > 0); } };
        }) },
      { num: '11', stem: 'Find the missing angle ' + t('x') + ' in each shape.', parts: [
        { id: '11a', level: 'BEG', make: function (r) { return missingPart(r, 3, { lo: 35, hi: 85, not: [85], fallback: [47, 68, 65], width: 230 }); } },
        { id: '11b', level: 'EMG', make: function (r) { return missingPart(r, 4, { lo: 65, hi: 125, not: [85, 110, 72], fallback: [120, 75, 95, 70], width: 230 }); } },
        { id: '11c', level: 'PRG', make: function (r) { return missingPart(r, 5, { lo: 88, hi: 135, not: [125], fallback: [100, 125, 90, 140, 85], width: 240 }); } }] },
      { num: '12', stem: function (sh) { return 'A landscaper in Airdrie is building a patio from paving stones shaped like regular ' + PNAME[sh.n] + 's. ' + sh.k + ' stones meet at each point, as in the picture.' + row([[tileSVG(Array(sh.k).fill(sh.n), { start: sh.n === 6 ? 0 : sh.n === 4 ? 0 : 0 }), '']], 220); },
        shared: function (r) { var n = r.pick([6, 6, 4, 3]); return { n: n, a: S(n) / n, k: 360 / (S(n) / n) }; }, parts: [
        { id: '12a', level: 'EMG', make: function (r, sh) { return angPart('Find the size of each angle of one paving stone.', sh.a, { alts: eachAlts(sh.n).filter(function (al) { return !same(al[0], sh.a); }), sol: sumWork(sh.n) + '<br>' + t(S(sh.n) + '^\\circ\\div ' + sh.n + '=' + sh.a + '^\\circ'), hints: ['Sum = (n − 2) × 180°, then divide by the number of angles.'], text: 'paving angle' }); } },
        { id: '12b', level: 'PRG', make: function (r, sh) { return P.mc(r, 'Why do the stones fit around a point with no gaps?', [
          { html: t(sh.k + '\\times ' + sh.a + '^\\circ=360^\\circ') + ', a full turn. The angles fill all the way round the point.', right: true },
          { html: t(sh.k + '\\times ' + sh.a + '^\\circ=' + sh.k * sh.a + '^\\circ') + ', which is the sum of the angles of one stone.', why: 'Around a point the angles must make a <b>full turn</b>, 360°. That’s why they fit.', code: 'sum-one' },
          { html: 'All the sides of the stones are the same length.', why: 'Equal sides help the edges line up, but the angles decide if they fill the space round a point: they must add to 360°.', code: 'sides' },
          { html: 'A ' + PNAME[sh.n] + ' has ' + (sh.n % 2 ? 'an odd' : 'an even') + ' number of sides.', why: 'The number of sides alone doesn’t decide it. Add the angles that meet at the point.', code: 'even' }],
          t(sh.k + '\\times ' + sh.a + '^\\circ=360^\\circ') + ', a full turn. The ' + sh.k + ' angles fill all the way round the point, so there is no gap and no overlap.', ['What do the angles around a point add up to?'], 'why tiles fit'); } }] },
      { num: '13', stem: function (sh) { return 'Kai says the interior angles of a polygon with ' + sh.n + ' sides add up to ' + dg(sh.n * 180) + '.'; }, shared: function (r) { return { n: intNot(r, 11, 19, []) }; }, parts: [
        { id: '13a', level: 'EMG', make: function (r, sh) { return P.mc(r, 'What is his mistake?', [
          { html: 'He did ' + t(sh.n + '\\times 180^\\circ') + ' and forgot to subtract 2 from the number of sides.', right: true },
          { html: 'He forgot to divide by ' + sh.n + '.', why: 'Dividing by ' + sh.n + ' gives <b>each</b> angle of a regular polygon. The question is about the sum.', code: 'divide' },
          { html: 'He should have multiplied by 360° instead of 180°.', why: 'Each triangle adds 180°. The mistake is in the number of triangles.', code: '360' },
          { html: 'There is no mistake.', why: 'Check with a small polygon: a triangle (3 sides) has 180°, not ' + t('3\\times 180^\\circ') + '.', code: 'none' }],
          'Kai did ' + t(sh.n + '\\times 180^\\circ=' + sh.n * 180 + '^\\circ') + '. He forgot to subtract 2: a polygon with ' + sh.n + ' sides splits into ' + (sh.n - 2) + ' triangles.', ['How many triangles does the polygon split into?'], 'Kai mistake'); } },
        { id: '13b', level: 'EMG', make: function (r, sh) { return numPart('Give the correct sum.', S(sh.n), { after: '°', afterTex: '^\\circ', alts: sumAlts(sh.n), sol: sumWork(sh.n), hints: ['Sum = (n − 2) × 180°.'], text: 'Kai correct sum' }); } }] },
      { num: '14', stem: '', parts: [
        { id: '14', level: 'MAS', make: function (r) { var n = r.pick([9, 10, 12, 15, 18, 30, 36]), a = S(n) / n, ex = 180 - a, tr = [n - 2, n + 2].map(function (m) { return 'n = ' + m + ': ' + t('(' + m + '-2)\\times 180\\div ' + m + (Number.isInteger(S(m) / m) ? '=' : '\\approx ') + fd(rd(S(m) / m, 1)) + '^\\circ') + (m < n ? ' (too small)' : ' (too big)'); });
          return numPart('Each interior angle of a regular polygon is ' + dg(a) + '. How many sides does it have? (Try a few values of ' + t('n') + ' and make a table, or work backward.)', n, { after: 'sides',
            alts: [[n - 2, 'u5l3-turns', 'That’s the number of triangles. Check: ' + t('(' + (n - 2) + '-2)\\times 180\\div ' + (n - 2)) + ' isn’t ' + dg(a) + '.'], [rd(360 / a, 2), 'u5l3-sides-ext', 'Check your answer: ' + t('(n-2)\\times 180^\\circ\\div n') + ' must give ' + dg(a) + '.']],
            sol: 'Try values of ' + t('n') + ' and find the sum ÷ ' + t('n') + ':<br>' + tr.join('<br>') + '<br>n = ' + n + ': ' + t('(' + n + '-2)\\times 180=' + S(n) + ',\\ ' + S(n) + '\\div ' + n + '=' + a + '^\\circ') + ' ✓<br>(Backward: each turn is ' + t('180^\\circ-' + a + '^\\circ=' + ex + '^\\circ') + ', and ' + t('360^\\circ\\div ' + ex + '^\\circ=' + n) + '.)<br>The polygon has ' + n + ' sides.',
            hints: ['Try a value: for n = 10, each angle is (10 − 2) × 180 ÷ 10 = 144°. Too small? Try more sides.', 'More sides make each angle bigger (closer to 180°).'], text: 'sides from angle' }); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) { var want = r.pick(['obtuse', 'obtuse', 'reflex', 'acute']), vals = { acute: intNot(r, 80, 89, []), right: 90, obtuse: intNot(r, 120, 170, [163]), reflex: intNot(r, 190, 260, [241]) };
          return P.mc(r, 'Which angle is ' + want + '?', ['acute', 'right', 'obtuse', 'reflex'].map(function (k) { return { html: dg(vals[k]), right: k === want, why: dg(vals[k]) + ' is ' + k + ' (' + KIND_RULE[k] + '). ' + cap(want) + ' means ' + KIND_RULE[want] + '.', code: 'kind-' + k }; }),
            dg(vals[want]) + ' is ' + KIND_RULE[want] + ', so it is ' + want + '.', ['acute < 90° · right = 90° · obtuse between 90° and 180° · reflex > 180°'], 'which is ' + want, true); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) { var s = intNot(r, 20, 80, [64, 65, 30]); return P.mc(r, 'The smaller angle between two arms is ' + dg(s) + '. The reflex angle is', [
          { html: dg(90 - s), why: 'That’s ' + t('90^\\circ-' + s + '^\\circ') + '. A reflex angle is more than 180°.', code: 'u5l3-reflex-90' }, { html: dg(180 - s), why: 'That’s ' + t('180^\\circ-' + s + '^\\circ') + '. A full turn is 360°.', code: 'u5l3-reflex-sub180' },
          { html: dg(180 + s), why: 'That’s ' + t('180^\\circ+' + s + '^\\circ') + '. Reflex = 360° − the small angle.', code: 'u5l3-reflex-add180' }, { html: dg(360 - s), right: true }],
          t('360^\\circ-' + s + '^\\circ=' + (360 - s) + '^\\circ'), ['Reflex angle = 360° − the smaller angle.'], 'reflex MC', true); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'PRG', make: function (r) { var n = r.pick([18, 20, 30, 36, 40]), a = S(n) / n; return numPart('A regular polygon has ' + n + ' sides. Each of its interior angles is ____°.', a, { nr: true, alts: eachAlts(n).filter(function (al) { return String(rd(al[0], 2)).length <= 4; }), sol: sumWork(n) + '<br>' + t(S(n) + '^\\circ\\div ' + n + '=' + a + '^\\circ'), hints: ['Find the sum first, then divide by the number of angles.'], text: 'NR each angle ' + n }); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var n = intNot(r, 13, 21, [15]); return numPart('The sum of the interior angles of a polygon with ' + n + ' sides is ____°.', S(n), { nr: true, alts: sumAlts(n), sol: sumWork(n), hints: ['Sum = (n − 2) × 180°. Use brackets on the calculator.'], text: 'NR sum ' + n }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Write the type of each angle: acute, right, obtuse, straight or reflex.', parts: [
        { id: 'e1', level: 'BEG', make: function (r) { return classifyGrid('Choose the type of each angle.', r.shuffle([intNot(r, 3, 30, []), intNot(r, 31, 86, [47]), r.pick([90, 180]), intNot(r, 130, 175, [163]), r.pick([270, 186, 199, 225]), intNot(r, 300, 358, [300])])); } }] },
      { num: '2', stem: function (sh) { return 'Use the picture.' + row([[sh.svg, '']], 230); }, shared: function (r) { return nameShared(r, [1, 2, 3]); }, parts: [
        { id: 'e2a', level: 'BEG', make: function (r, sh) { var A = sh.L[0], V = sh.L[1], C = sh.L[2]; return P.mc(r, 'Name ' + ang(sh.n) + ' using three letters.', [
          { html: t('\\angle ' + A + V + C), right: true }, { html: t('\\angle ' + V + A + C), why: 'The vertex (' + V + ') goes in the <b>middle</b>.', code: 'u5l3-name-vertex' }, { html: t('\\angle ' + A + C + V), why: 'The vertex (' + V + ') goes in the <b>middle</b>.', code: 'u5l3-name-vertex' }, { html: t('\\angle ' + V + C + A), why: 'The vertex (' + V + ') goes in the <b>middle</b>.', code: 'u5l3-name-vertex' }],
          t('\\angle ' + A + V + C) + ' (or ' + t('\\angle ' + C + V + A) + '): the vertex ' + V + ' is in the middle.', ['Three letters: a point on one arm, the vertex, a point on the other arm.'], 'three letters'); } },
        { id: 'e2b', level: 'BEG', make: function (r, sh) { var A = sh.L[0], V = sh.L[1], C = sh.L[2]; return P.mc(r, 'Name its vertex and its arms.', [
          { html: 'vertex ' + V + '; arms ' + t(V + A) + ' and ' + t(V + C), right: true }, { html: 'vertex ' + A + '; arms ' + t(A + V) + ' and ' + t(A + C), why: 'The vertex is the point where both arms start.', code: 'vertex' },
          { html: 'vertex ' + V + '; arms ' + t(A + C) + ' and ' + t(V + C), why: 'Both arms start at the vertex. ' + t(A + C) + ' isn’t an arm.', code: 'arm-ac' }, { html: 'vertex ' + sh.n + '; arms ' + A + ' and ' + C, why: 'The number ' + sh.n + ' only names the angle. The vertex is a point.', code: 'vertex-num' }],
          'Vertex ' + V + '; arms ' + t(V + A) + ' and ' + t(V + C) + '.', ['The vertex is where the arms meet.'], 'vertex and arms'); } },
        { id: 'e2c', level: 'EMG', make: function (r, sh) { var V = sh.L[1]; return P.mc(r, 'Can this angle also be called ' + ang(V) + '?', [
          { html: '<b>Yes</b>: only one angle has its vertex at ' + V + ', so ' + ang(V) + ' is clear.', right: true }, { html: '<b>No</b>: an angle always needs three letters.', why: 'One letter is fine when there is only <b>one</b> angle at that vertex.', code: 'three' },
          { html: '<b>No</b>: it already has a number, so it can’t have another name.', why: 'An angle can have several names: a number, three letters, or the vertex letter.', code: 'number' }, { html: '<b>Yes</b>: any letter in the picture can name the angle.', why: 'One letter names the angle only if it is the <b>vertex</b>.', code: 'any' }],
          'Yes. Only one angle has its vertex at ' + V + ', so ' + ang(V) + ' is clear.', ['When is the vertex letter alone enough?'], 'one-letter name'); } }] },
      { num: '3', stem: 'Read each protractor. Give the size of the angle.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var o = { angle: intNot(r, 12, 40, [35, 28]), rot: 0, scale: 'outer' }; return readQ(protPrompt(o), o); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var o = { angle: intNot(r, 120, 150, [145, 135, 125]), rot: r.pick([45, 50, 60, 70]), scale: 'inner' }; return readQ(protPrompt(o, 'The protractor is turned. Read it and give the size of the angle.'), o); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var o = { angle: intNot(r, 45, 75, [64, 62, 74]), rot: r.pick([-90, -80, 260, 270]), scale: 'outer' }; return readQ(protPrompt(o, 'The protractor is turned. Read it and give the size of the angle.'), o); } }] },
      { num: '4', stem: 'Find the reflex angle that goes with each smaller angle.', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var s = intNot(r, 5, 25, []); return reflexPart('Smaller angle ' + dg(s) + '. Reflex angle:', s); } },
        { id: 'e4b', level: 'BEG', make: function (r) { var s = intNot(r, 95, 115, [112]); return reflexPart('Smaller angle ' + dg(s) + '. Reflex angle:', s); } },
        { id: 'e4c', level: 'BEG', make: function (r) { var s = intNot(r, 150, 168, [163]); return reflexPart('Smaller angle ' + dg(s) + '. Reflex angle:', s); } }] },
      { num: '5', stem: 'Find the sum of the interior angles of a polygon with', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var n = intNot(r, 9, 13, [10]); return numPart(n + ' sides', S(n), { after: '°', afterTex: '^\\circ', alts: sumAlts(n), sol: sumWork(n), hints: ['Sum = (n − 2) × 180°.'], text: 'sum ' + n }); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var n = intNot(r, 14, 22, [15, 17, 20]); return numPart(n + ' sides', S(n), { after: '°', afterTex: '^\\circ', alts: sumAlts(n), sol: sumWork(n), hints: ['Sum = (n − 2) × 180°.'], text: 'sum ' + n }); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { var A = arms(sh.rot, sh.s, sh.sc); return 'Use the protractor.' + row([[G.angleSVG({ a1: A[0], a2: A[1], reflex: true, width: 170 }), 'the marked angle'], [G.protractorSVG({ arms: A, rot: sh.rot, width: 280, R: 170 }), 'the protractor on its arms']], 230); },
        shared: function (r) { return { s: intNot(r, 45, 80, [64, 74, 62]), rot: r.int(0, 359), sc: r.pick(['inner', 'outer']) }; }, parts: [
        { id: 'e6a', level: 'EMG', make: function (r, sh) { return readPart('(a) Measure the smaller angle between the arms.', sh.s, { sol: protSol({ angle: sh.s, rot: sh.rot, scale: sh.sc }), text: 'small angle' }); } },
        { id: 'e6b', level: 'EMG', make: function (r, sh) { return readPart('(b) Find the marked reflex angle.', 360 - sh.s, { reflex: true, alts: [{ v: 180 - sh.s, code: 'u5l3-reflex-sub180', hint: 'A full turn is 360°. Reflex = 360° − the small angle.' }, { v: 180 + sh.s, code: 'u5l3-reflex-add180', hint: 'Reflex = 360° − the small angle.' }], sol: t('360^\\circ-' + sh.s + '^\\circ=' + (360 - sh.s) + '^\\circ'), hints: ['Reflex = 360° − the small angle you measured.'], text: 'marked reflex' }); } }] },
      { num: '7', stem: 'Drawing angles on the arm given.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { var x = intNot(r, 60, 85, [64, 70, 74]), arm = r.pick([200, 190, 210]); return drawMC(r, 'Ava draws a ' + dg(x) + ' angle on a slanted arm (the protractor is turned so its base line is on that arm). Which drawing is right?', x, arm, 'outer'); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var x = intNot(r, 145, 168, [163, 165]); return drawMC(r, 'Ava draws a ' + dg(x) + ' angle on an arm that points to the right. Which drawing is right?', x, 0, 'inner'); } }] },
      { num: '8', stem: function (sh) { return 'Jaxon looks at these two angles. He says ' + ang('P') + ' is bigger because its arms are longer.' + row([[G.protractorSVG({ angle: sh.p, rot: 0, scale: 'inner', len: 260, R: 150, names: [null, 'P', null], width: 300 }), ang('P')], [G.protractorSVG({ angle: sh.q, rot: 0, scale: 'inner', len: 160, R: 150, names: [null, 'Q', null], width: 230 }), ang('Q')]], 260); },
        shared: function (r) { var p = intNot(r, 25, 50, [35, 38]); return { p: p, q: p + r.int(18, 35) }; }, parts: [
        { id: 'e8a', level: 'EMG', make: function (r, sh) { var chk = [G.angleChk(sh.p, { tol: 1 }), G.angleChk(sh.q, { tol: 1 })];
          return { prompt: 'Read both protractors.', input: { type: 'fields', fields: [{ label: t('\\angle P='), name: '∠P', after: '°' }, { label: t('\\angle Q='), name: '∠Q', after: '°' }] }, check: K.fields(chk, { labels: ['∠P', '∠Q'] }), key: [String(sh.p), String(sh.q)],
            answer: t('\\angle P=' + sh.p + '^\\circ,\\ \\angle Q=' + sh.q + '^\\circ'), solution: 'Both use the inner scale (0 on the right arm): ' + t('\\angle P=' + sh.p + '^\\circ') + ', ' + t('\\angle Q=' + sh.q + '^\\circ') + '.', hints: ['Both angles have one arm on the inner 0.'], text: 'Jaxon readings', bad: [[String(sh.q), String(sh.p)]] }; } },
        { id: 'e8b', level: 'EMG', make: function (r, sh) { return P.mc(r, 'Is Jaxon right?', [
          { html: '<b>No</b>. ' + ang('Q') + ' is bigger (' + dg(sh.q) + ' vs ' + dg(sh.p) + '). The size of an angle is the turn between the arms; arm length doesn’t matter.', right: true },
          { html: '<b>Yes</b>. Longer arms make a bigger angle.', why: 'Measure them: ' + ang('P') + ' = ' + dg(sh.p) + ' and ' + ang('Q') + ' = ' + dg(sh.q) + '.', code: 'longer' },
          { html: '<b>No</b>. The two angles are the same size.', why: 'Compare your two readings.', code: 'same' },
          { html: '<b>Yes</b>. ' + ang('P') + ' is ' + dg(sh.q) + ' and ' + ang('Q') + ' is ' + dg(sh.p) + '.', why: 'Check which reading belongs to which angle.', code: 'swap' }],
          ang('P') + ' = ' + dg(sh.p) + ', ' + ang('Q') + ' = ' + dg(sh.q) + '. So ' + ang('Q') + ' is bigger. The length of the arms doesn’t change the size of an angle.', ['The size of an angle is the amount of turn between the arms.'], 'Jaxon right?'); } }] },
      { num: '9', stem: function (sh) { return 'A kitchen floor uses tiles shaped like regular ' + PNAME[sh.big] + 's, with ' + (sh.small === 4 ? 'small square tiles' : 'small triangle tiles (equilateral)') + ' in the gaps. At each point, two ' + PNAME[sh.big] + 's and one ' + (sh.small === 4 ? 'square' : 'triangle') + ' meet.' + row([[tileSVG([sh.big, sh.big, sh.small], { start: -90 + (S(sh.small) / sh.small) / 2 }), '']], 220); },
        shared: function (r) { var v = r.pick([[8, 4], [12, 3]]); return { big: v[0], small: v[1], A: S(v[0]) / v[0], a: S(v[1]) / v[1] }; }, parts: [
        { id: 'e9a', level: 'EMG', make: function (r, sh) { return angPart('(a) Find the size of each angle of a regular ' + PNAME[sh.big] + '.', sh.A, { alts: eachAlts(sh.big), sol: sumWork(sh.big) + '<br>' + t(S(sh.big) + '^\\circ\\div ' + sh.big + '=' + sh.A + '^\\circ'), hints: ['Sum = (n − 2) × 180°, then ÷ n.'], text: 'big tile angle' }); } },
        { id: 'e9b', level: 'PRG', make: function (r, sh) { var sm = sh.small === 4 ? 'square' : 'triangle'; return P.mc(r, '(b) Why do the tiles fit around a point with no gap?', [
          { html: t(sh.A + '^\\circ+' + sh.A + '^\\circ+' + sh.a + '^\\circ=360^\\circ') + ', a full turn.', right: true },
          { html: t(sh.A + '^\\circ+' + sh.A + '^\\circ=' + 2 * sh.A + '^\\circ') + ', and the ' + sm + ' fills the rest because its angles add to ' + dg(S(sh.small)) + '.', why: 'Only <b>one</b> corner of the ' + sm + ' (' + dg(sh.a) + ') is at the point, not all of its angles.', code: 'all-small' },
          { html: 'The tiles all have the same side length.', why: 'Equal sides help, but the angles at the point must add to 360°.', code: 'sides' },
          { html: t(sh.A + '^\\circ+' + sh.A + '^\\circ+' + sh.a + '^\\circ=180^\\circ') + ', a straight line.', why: 'Add them again: ' + t(sh.A + '+' + sh.A + '+' + sh.a + '=360') + '. Around a point the angles make a full turn.', code: '180' }],
          'At the point: ' + t(sh.A + '^\\circ+' + sh.A + '^\\circ+' + sh.a + '^\\circ=360^\\circ') + ', a full turn. So there is no gap.', ['Add the three angles that meet at the point.'], 'why tiles fit'); } }] },
      { num: '10', stem: 'Find the missing angle ' + t('x') + '.', parts: [
        { id: 'e10a', level: 'EMG', make: function (r) { var c = intNot(r, 60, 85, [72, 85]), x = 180 - c, pts = polyPts(r, [90, 90, c, x]) || [[0, 0], [100, 0], [100, 80], [0, 50]];
          var svg = G.polygonSVG({ pts: pts, angles: [90, 90, c, 'x'], width: 230 });
          return angPart('A building lot in Strathmore has two square corners and one corner of ' + dg(c) + '.<br>' + svg, x, { alts: [[180 + c, 'u5l3-missing-known', 'That’s the total of the angles you know. Subtract it from 360°.'], [360 - c, 'u5l3-missing-sum', 'Don’t forget the two square corners (90° each).'], [270 - c, 'u5l3-missing-sum', 'There are <b>two</b> square corners (90° each).']],
            sol: t('S=360^\\circ') + '<br>' + t('90+90+' + c + '=' + (180 + c)) + '<br>' + t('x=360^\\circ-' + (180 + c) + '^\\circ=' + x + '^\\circ'), hints: ['A quadrilateral’s angles add to 360°. The small squares are 90° each.'], text: 'lot corner' }); } },
        { id: 'e10b', level: 'PRG', make: function (r) { var A = anglesFor(r, 6, 720, 105, 135, [130, 118, 125, 112, 120]) || [128, 116, 124, 110, 122, 120], x = A[5], known = A.slice(0, 5), ks = 720 - x;
          return angPart('A hexagon has five angles of ' + known.map(dg).join(', ') + '. Find the sixth angle.', x, { alts: [[ks, 'u5l3-missing-known', 'That’s the total of the five angles. Subtract it from the hexagon’s angle sum.'], [1080 - ks, 'u5l3-missing-sum', 'Use ' + t('(6-2)\\times 180^\\circ=720^\\circ') + ', not ' + t('6\\times 180^\\circ') + '.'], [900 - ks, 'u5l3-missing-sum', 'The sum is ' + t('(6-2)\\times 180^\\circ=720^\\circ') + '.']],
            sol: sumWork(6) + '<br>' + t(known.join('+') + '=' + ks) + '<br>' + t('x=720^\\circ-' + ks + '^\\circ=' + x + '^\\circ'), hints: ['Find the hexagon’s angle sum first.'], text: 'hexagon sixth angle' }); } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e11', level: 'EMG', make: function (r) { var obt = r.chance(0.6), a = intNot(r, 22, 68, [35, 38, 40, 45, 64]), want = obt ? 180 - a : a, k = obt ? 'obtuse' : 'acute';
          return P.mc(r, 'Lena is measuring an angle that is clearly ' + k + '. Where the second arm crosses her protractor, the two scales show ' + a + ' and ' + (180 - a) + '. The angle is', [
            { html: dg(a), right: !obt, why: obt ? dg(a) + ' is acute, but her angle is obtuse.' : null, code: 'other' }, { html: dg(90 - a), why: 'That’s ' + t('90-' + a) + '. The angle is one of the two numbers on the scales.', code: '90' },
            { html: dg(180 - a), right: obt, why: obt ? null : dg(180 - a) + ' is obtuse, but her angle is acute.', code: 'other' }, { html: dg(180 + a), why: 'That’s more than 180° (reflex). The angle is one of the two numbers on the scales.', code: '180' }],
            'An ' + k + ' angle is ' + KIND_RULE[k] + ', so it is ' + dg(want) + '.', ['Which of the two numbers matches an ' + k + ' angle?'], 'Lena', true); } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'PRG', make: function (r) { var n = r.pick([24, 30, 36, 40, 45]), a = S(n) / n; return numPart('A regular polygon has ' + n + ' sides. Each of its interior angles is ____°.', a, { nr: true, alts: eachAlts(n).filter(function (al) { return String(rd(al[0], 2)).length <= 4; }), sol: sumWork(n) + '<br>' + t(S(n) + '^\\circ\\div ' + n + '=' + a + '^\\circ'), hints: ['Find the sum first, then divide by ' + n + '.'], text: 'NR each angle ' + n }); } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [
        { id: 'e13', level: 'MAS', make: function (r) { var n = intNot(r, 14, 24, [15, 17, 18, 20]), s = S(n); return numPart('The interior angles of a polygon add up to ' + dg(s) + '. How many sides does it have?', n, { after: 'sides',
          alts: [[n - 2, 'u5l3-turns', 'That’s the number of triangles (' + t(s + '\\div 180') + '). The polygon has 2 more sides than triangles.'], [s / 180 - 1, 'u5l3-minus1', 'The number of sides is the number of triangles plus <b>2</b>.'], [s / 360, 'value', 'Each triangle adds 180°, so first divide by 180.']],
          sol: 'Number of triangles: ' + t(s + '\\div 180=' + (n - 2)) + '<br>The polygon has 2 more sides than triangles: ' + t((n - 2) + '+2=' + n) + ' sides.<br>Check: ' + t('(' + n + '-2)\\times 180^\\circ=' + s + '^\\circ') + ' ✓', hints: ['How many triangles of 180° make ' + s + '°?', 'The number of sides is 2 more than the number of triangles.'], text: 'sides from sum' }); } }] },
      { num: '14', stem: function (sh) { return 'Neither arm of this angle is on a 0. Find the size of the angle anyway.<br>' + G.protractorSVG({ angle: sh.a, rot: 0, scale: 'none', offset: sh.off, width: 360 }); },
        shared: function (r) { return find(function () { return { off: r.int(10, 60), a: r.int(35, 95) }; }, function (s) { return s.off + s.a <= 168 && s.a !== 70 && s.off % 10 !== 0; }, { off: 25, a: 70 }); }, parts: [
        { id: 'e14', level: 'ADV', make: function (r, sh) { var lo = sh.off, hi = sh.off + sh.a;
          return readPart('The angle is', sh.a, { supplementTrap: false, alts: [{ v: hi, code: 'u5l3-not-zero', hint: 'That’s where one arm crosses the scale. Neither arm is on 0, so <b>subtract</b> the two readings.' }, { v: lo, code: 'u5l3-not-zero', hint: 'That’s where one arm crosses the scale. Subtract the two readings on the <b>same</b> scale.' }, { v: 180 - hi, code: 'u5l3-not-zero', hint: 'Read both arms on the <b>same</b> scale, then subtract.' }, { v: 180 - lo, code: 'u5l3-not-zero', hint: 'Read both arms on the <b>same</b> scale, then subtract.' }],
            sol: 'Use the inner scale for both arms: one arm is at ' + lo + ', the other at ' + hi + '.<br>' + t(hi + '-' + lo + '=' + sh.a) + ', so the angle is ' + dg(sh.a) + '.<br>(Outer scale: ' + t((180 - lo) + '-' + (180 - hi) + '=' + sh.a) + ', the same.)', hints: ['Read where each arm crosses the same scale.', 'Subtract the smaller reading from the bigger one.'], text: 'subtract readings' }); } }] },
      { num: '15', stem: function (sh) {
          var Hh = 330, a = Hh * Math.tan(sh.tip / 2 * Math.PI / 180), h = a * Math.tan((Math.atan2(Hh, a) * 180 / Math.PI - sh.w) * Math.PI / 180);
          return 'This arrowhead shape is a quadrilateral with a reflex angle. Its other angles are ' + dg(sh.tip) + ' at the tip and ' + dg(sh.w) + ' at each wing.<br>' + G.polygonSVG({ pts: [[0, Hh], [-a, 0], [0, h], [a, 0]], angles: [sh.tip, sh.w, 'x', sh.w], width: 240 }); },
        shared: function (r) { return find(function () { return { tip: r.int(7, 12) * 5, w: r.int(4, 8) * 5 }; }, function (s) { return 90 - s.tip / 2 - s.w > 12 && !(s.tip === 40 && s.w === 30); }, { tip: 50, w: 25 }); }, parts: [
        { id: 'e15a', level: 'MAS', make: function (r, sh) { var ks = sh.tip + 2 * sh.w, x = 360 - ks; return angPart('(a) The rule ' + t('(n-2)\\times 180^\\circ') + ' still works. Use it to find ' + t('x') + '.', x, { reflex: true,
          alts: [[ks, 'u5l3-missing-known', 'That’s the total of the three angles you know. Subtract it from 360°.'], [180 - ks, 'u5l3-missing-sum', 'A quadrilateral’s angles add to 360°, not 180°.']],
          sol: 'A line from the tip to the inside corner splits it into two triangles: ' + t('S=(4-2)\\times 180^\\circ=360^\\circ') + '<br>' + t(sh.tip + '+' + sh.w + '+' + sh.w + '=' + ks) + '<br>' + t('x=360^\\circ-' + ks + '^\\circ=' + x + '^\\circ'), hints: ['A quadrilateral’s angles add to 360°, even when one angle is reflex.'], text: 'arrowhead x' }); } },
        { id: 'e15b', level: 'EMG', make: function (r, sh) { var x = 360 - sh.tip - 2 * sh.w; return GP.classify(r, '(b) What type of angle is ' + t('x') + '?', x, { sol: t('x=' + x + '^\\circ') + ' is between 180° and 360°, so it is <b>reflex</b>.', hints: ['Compare your answer to (a) with 180°.'], text: 'arrowhead type' }); } }] }
    ]
  });
})(window);
