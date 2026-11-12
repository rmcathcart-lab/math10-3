/* Math 10-3 · Unit 6 · Lesson 7 — Unit 6 Review (G3 throughout)
 * Assignment 7 (u6_l07.tex: Part A Written Response 1–14, Part B Multiple Choice 15–22, Part C Numerical Response 23–26) and
 * the Lesson 7 Extra Practice (u6_ep07.tex, Practice Test 2: A Skills 1–5, B Applying 6–12, C Stretch 13–15). Set up like
 * the unit test. Every part is a generator: the same situation and difficulty as the booklet item with new numbers around the
 * booklet's (the lesson's worked-example numbers are left out).
 * Uses only the shared geometry kit HW.geo (similarSVG, gridSVG, shadowSVG, mirrorSVG, polygonSVG, lenChk, kChk, P.len, P.k);
 * the floor plan, the coulee and the ramp pictures and the word / name checkers are built here.
 * Conversions: the k / type tables → number boxes for k (or the missing length) + a table of choices for the type; "fill in
 * the blanks" → labelled boxes; "which side / angle matches" and "list the corresponding sides" → typed side names (KL or LK)
 * and angle letters; "name the triangles in matching order" → the three letters typed (△ABC ∼ △___); "are they similar? show
 * your work" → the two side ratios + yes / no typed; "is Rae right? explain", "why are they similar", "why the same time of
 * day", "explain Jae's mistake", "find Ken's mistake" → multiple choice of reasons; "draw the reduction / enlargement on the
 * grid" → the copy's side lengths in squares and the move along the slanted side (across and up); the scales table → boxes
 * (1 : n typed with or without "1 :", and "1 cm represents ___ m"); "which scale fits best? explain" → multiple choice whose
 * options give the sizes and a reason; "can the tree reach the shed?" → multiple choice; numerical response → one box
 * (4 characters). Lengths are exact unless the booklet says to round (shadows, mirrors: nearest tenth; minutes: whole). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.lenChk || !G.kChk || !G.similarSVG) throw new Error('js/lessons/u6l7.js needs HW.geo (js/geokit.js)');

  /* ================= numbers ================= */
  function q9(x) { return Math.round(x * 1e9) / 1e9; }
  function nS(x) { return String(q9(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function U(x, u) { return t(N(x) + (u ? '\\text{ ' + u + '}' : '')); }
  function D(x) { return t(N(x) + '^\\circ'); }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function places(x) { for (var i = 0; i < 7; i++) if (Math.abs(x * Math.pow(10, i) - Math.round(x * Math.pow(10, i))) < 1e-7) return i; return 9; }
  function nice(x, dp) { return places(x) <= dp; }
  function find(gen, test, fb) { for (var i = 0; i < 3000; i++) { var v = gen(); if (v != null && test(v)) return v; } if (fb === undefined) throw new Error('u6l7: no numbers found'); return fb; }
  function step(r, a, b, s) { return q9(a + s * r.int(0, Math.round((b - a) / s))); }
  function toR(x, dp) { return Math.abs(x - rd(x, dp)) < 1e-9 ? '=' + N(rd(x, dp)) : '=' + N(rd(x, 4)) + (places(x) > 4 ? '\\ldots' : '') + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function br(a) { return a.filter(Boolean).join('<br>'); }

  /* ================= checkers ================= */
  /* a length (or any number found from similar figures): exact unless dp is given. o: lenChk options */
  function lenC(v, o) { o = o || {}; return G.lenChk(v, Object.assign({ radTrap: false, early: false }, o, { dp: o.dp == null ? Math.max(1, Math.min(3, places(v))) : o.dp })); }
  function lenP(prompt, v, o) {
    o = o || {}; var dp = o.dp == null ? Math.max(1, Math.min(3, places(v))) : o.dp, p = G.P.len(prompt, v, Object.assign({ radTrap: false, early: false }, o, { dp: dp }));
    p.key = nS(rd(v, dp)); p.answer = t(HW.fmt(p.key)) + (o.unit && !o.nr ? ' ' + o.unit : '');   // 3, not 3.0 (both are accepted)
    return p;
  }
  function lenKey(v, dp) { return nS(rd(v, dp == null ? Math.max(1, Math.min(3, places(v))) : dp)); }
  function kC(k, o) { return G.kChk(k, o || {}); }
  function kKey(k) { return places(k) <= 4 ? nS(k) : nS(rd(k, 2)); }
  /* one number with targeted hints: diag = [[value, code, hint]] */
  function numC(ans, diag) { return K.number(ans, function (v) { for (var i = 0; i < (diag || []).length; i++) if (Math.abs(v - diag[i][0]) < 1e-9) return { code: diag[i][1], hint: diag[i][2] }; return null; }); }
  function words(resp) { return String(resp == null ? '' : resp).toLowerCase().replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/[’']/g, '').replace(/[^a-z]+/g, ' ').trim(); }
  /* yes / no typed */
  function yesNoC(want, why) {
    return function (resp) {
      var s = words(resp); if (!s) return form('empty', 'Type <b>yes</b> or <b>no</b>.');
      var no = /\b(no|not|nope|nah|isnt|arent|n)\b/.test(s), yes = !no && /\b(yes|yep|yeah|yup|similar|y)\b/.test(s);
      if (!no && !yes) return form('u6l7-yesno', 'Type <b>yes</b> or <b>no</b>.');
      if (yes === want) return ok();
      return wrong(want ? 'u6l7-said-no' : 'u6l7-said-yes', why || null);
    };
  }
  /* enlargement / reduction / congruent typed */
  var TYPES = { enlargement: ['enlargement', 'enlarge', 'enlarged', 'enlarging', 'bigger', 'larger'], reduction: ['reduction', 'reduce', 'reduced', 'reducing', 'smaller'], congruent: ['congruent', 'same size', 'same', 'neither', 'equal'] };
  var TYPE_WHY = { enlargement: 'k > 1', reduction: 'k < 1', congruent: 'k = 1' };
  function typeOf(resp) {
    var s = words(resp).replace(/^(it is|its|it s|an|a)\s+/, ''); if (!s) return null;
    var hit = null;
    Object.keys(TYPES).forEach(function (k) { if (!hit && TYPES[k].some(function (w) { return s === w || s.indexOf(w) === 0 || (s.length >= 3 && w.indexOf(s) === 0); })) hit = k; });
    return hit || 'other';
  }
  function kindOfK(k) { return Math.abs(k - 1) < 1e-9 ? 'congruent' : k > 1 ? 'enlargement' : 'reduction'; }
  function typeC(k) {
    var want = kindOfK(k);
    return function (resp) {
      var got = typeOf(resp); if (!got) return form('empty', 'Type enlargement, reduction or congruent.');
      if (got === 'other') return form('u6l7-type', 'Use one of the words: enlargement, reduction or congruent.');
      if (got === want) return ok();
      return wrong('u6l7-type-' + got, 'k = ' + N(k) + ', and ' + TYPE_WHY[want] + ' means ' + (want === 'congruent' ? 'the same size (congruent)' : (want === 'enlargement' ? 'an enlargement (the copy is bigger)' : 'a reduction (the copy is smaller)')) + '.');
    };
  }
  /* a side name like KL (LK is fine too) */
  function segC(want, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toUpperCase().replace(/\\(?:TEXT|MATHRM|OVERLINE)\{([^}]*)\}/g, '$1').replace(/[^A-Z]/g, '');
      if (!s) return form('empty', 'Type the side, like AB.');
      if (s.length !== 2) return form('u6l7-seg', 'Type the two letters of the side, like AB.');
      if (s === want || s === want.charAt(1) + want.charAt(0)) return ok();
      return wrong('u6l7-match', hint || 'Match the letters by their <b>position</b> in the names.');
    };
  }
  /* an angle name like M (or ∠M, angle M, LMJ) */
  function angNameC(want, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toUpperCase().replace(/\\(?:TEXT|MATHRM)\{([^}]*)\}/g, '$1').replace(/\\?ANGLE|∠/g, '').replace(/[^A-Z]/g, '');
      if (!s) return form('empty', 'Type the letter of the angle, like M.');
      if (s.length === 3) s = s.charAt(1);
      if (s.length !== 1) return form('u6l7-angname', 'Type the one letter at the vertex of the angle, like M.');
      if (s === want) return ok();
      return wrong('u6l7-match', hint || 'Match the letters by their <b>position</b> in the names.');
    };
  }
  /* three vertex letters in matching order */
  function triC(want, hint) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).toUpperCase().replace(/\\(?:TEXT|MATHRM)\{([^}]*)\}/g, '$1').replace(/\\TRIANGLE|△|TRIANGLE/g, '').replace(/[^A-Z]/g, '');
      if (!s) return form('empty', 'Type the three letters, like ' + want.split('').sort().join('') + '.');
      if (s.length !== 3) return form('u6l7-tri', 'Type the three letters of the triangle.');
      if (s === want) return ok();
      if (s.split('').sort().join('') === want.split('').sort().join('')) return wrong('u6l7-order', hint || 'Right letters, wrong order: the letters must match by their <b>equal angles</b>.');
      return wrong('u6l7-tri-letters', 'Use the letters of the second triangle, in the order that matches the equal angles.');
    };
  }
  /* a scale as a ratio 1 : n ("1:500", "1 : 500" or "500") */
  function ratioC(n, diag) {
    var inner = numC(n, diag);
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/\\[,;: !]|~|\s/g, '');
      if (!s) return form('empty', 'Type the ratio, like 1 : 500.');
      var m = /^1(?::|\\colon|to)(.+)$/.exec(s); if (m) s = m[1];
      if (/:/.test(s)) return form('u6l7-ratio', 'Write the ratio as 1 : a number, like 1 : 500.');
      if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, '');
      if (/[a-z]/i.test(s)) return form('u6l7-ratio-unit', 'A ratio scale has <b>no units</b>: both sides are in the same unit. Type just the number.');
      return inner(s);
    };
  }
  /* an angle that does not change (k × angle and angle ÷ k are traps) */
  function angC(deg, k) {
    var alts = [];
    if (k) { alts.push({ v: deg * k, code: 'u6l7-angle-k', hint: 'Angles do <b>not</b> change in an enlargement or reduction: only lengths are multiplied by k.' }); alts.push({ v: deg / k, code: 'u6l7-angle-k', hint: 'Angles do <b>not</b> change: only lengths are multiplied by k.' }); }
    return G.angleChk(deg, { supplementTrap: false, alts: alts });
  }

  HW.addCodes({
    'u6l7-yesno': 'Not yes or no', 'u6l7-said-no': 'Said not similar (they are)', 'u6l7-said-yes': 'Said similar (they are not)', 'u6l7-type': 'Not enlargement / reduction / congruent',
    'u6l7-type-enlargement': 'Called it an enlargement', 'u6l7-type-reduction': 'Called it a reduction', 'u6l7-type-congruent': 'Called it congruent',
    'u6l7-seg': 'Not a side name', 'u6l7-angname': 'Not an angle letter', 'u6l7-match': 'Matched the wrong letters', 'u6l7-tri': 'Not three letters', 'u6l7-order': 'Triangle letters in the wrong order', 'u6l7-tri-letters': 'Wrong triangle letters',
    'u6l7-ratio': 'Ratio not written as 1 : n', 'u6l7-ratio-unit': 'Put units in a ratio scale', 'u6l7-angle-k': 'Multiplied an angle by k', 'u6l7-no-convert': 'Did not change to the same units', 'u6l7-convert': 'Wrong unit change',
    'u6l7-add': 'Added instead of multiplying', 'u6l7-area-k': 'Area grows by k, not k²', 'u6l7-hours': 'Gave hours, not minutes', 'u6l7-time-flip': 'Divided speed by distance', 'u6l7-sum': 'Used only one part of the route',
    'u6l7-third': 'Wrong third angle', 'u6l7-ft': 'Mixed feet and inches', 'u6l7-flip': 'Proportion upside down', 'u6l7-grid': 'Wrong length on the grid', 'u6l7-km': 'Wrong unit change to km', 'u6l7-perim': 'Found the perimeter, not the area'
  });

  /* ================= pictures ================= */
  var INK = '#1d2633', FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" ' + FONT + ' font-size="' + (o.size || 14) + '" font-weight="' + (o.w || 700) + '" text-anchor="' + (o.a || 'middle') + '" dominant-baseline="central" fill="' + (o.c || INK) + '"' + (o.it ? ' font-style="italic"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + HW.esc(s) + '</text>'; }
  function ln(a, b, o) { o = o || {}; return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + (o.c || INK) + '" stroke-width="' + (o.w || 2.2) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function svg(x0, y0, w, h, inner, maxW, aria) { return '<svg class="fig-svg" viewBox="' + x0 + ' ' + y0 + ' ' + w + ' ' + h + '" width="100%" style="max-width:' + maxW + 'px" role="img" aria-label="' + (aria || 'figure') + '">' + inner + '</svg>'; }
  function rightSq(V, u, v, s) { s = s || 9; return '<path d="M' + (V[0] + u[0] * s).toFixed(1) + ' ' + (V[1] + u[1] * s).toFixed(1) + 'L' + (V[0] + (u[0] + v[0]) * s).toFixed(1) + ' ' + (V[1] + (u[1] + v[1]) * s).toFixed(1) + 'L' + (V[0] + v[0] * s).toFixed(1) + ' ' + (V[1] + v[1] * s).toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-width="1.4"/>'; }
  /* a cabin floor plan: L × W on the plan (cm), the right part (width bw) split into a bathroom (top, h1) and a bedroom (bottom, h2) */
  function cabinSVG(L, W, bw, h1, h2) {
    var s = 300 / L, X = function (x) { return x * s; }, Y = function (y) { return (W - y) * s; }, o = '';
    o += '<rect x="0" y="0" width="' + X(L).toFixed(1) + '" height="' + Y(0).toFixed(1) + '" fill="#f7f4ec" stroke="' + INK + '" stroke-width="3.2"/>';
    o += ln([X(L - bw), Y(0)], [X(L - bw), Y(W)], { w: 2 }) + ln([X(L - bw), Y(h2)], [X(L), Y(h2)], { w: 2 });
    o += tx(X((L - bw) / 2), Y(W / 2) - 9, 'living', { size: 14, w: 600 }) + tx(X((L - bw) / 2), Y(W / 2) + 9, 'room', { size: 14, w: 600 });
    o += tx(X(L - bw / 2), Y(h2 + h1 / 2), 'bathroom', { size: 13, w: 600 }) + tx(X(L - bw / 2), Y(h2 / 2), 'bedroom', { size: 13, w: 600 });
    o += tx(X(L / 2), -12, N(L) + ' cm') + tx(-8, Y(W / 2), N(W) + ' cm', { a: 'end' }) + tx(X(L - bw / 2), Y(0) + 14, N(bw) + ' cm');
    o += tx(X(L) + 8, Y(h2 + h1 / 2), N(h1) + ' cm', { a: 'start' }) + tx(X(L) + 8, Y(h2 / 2), N(h2) + ' cm', { a: 'start' });
    return svg(-62, -26, X(L) + 128, Y(0) + 48, o, 440, 'floor plan of a cabin');
  }
  /* the coulee: A and B across the top, lines A→D and B→E crossing at C */
  function couleeSVG(ca, cd, de) {
    var A = [20, 30], B = [240, 30], C = [130, 160], kk = cd / ca, Dp = [C[0] + (C[0] - A[0]) * kk, C[1] + (C[1] - A[1]) * kk], Ep = [C[0] + (C[0] - B[0]) * kk, C[1] + (C[1] - B[1]) * kk];
    if (kk < 0.18) { var f = 0.18 / kk; Dp = [C[0] + (Dp[0] - C[0]) * f, C[1] + (Dp[1] - C[1]) * f]; Ep = [C[0] + (Ep[0] - C[0]) * f, C[1] + (Ep[1] - C[1]) * f]; }
    if (kk > 0.5) { var g = 0.5 / kk; Dp = [C[0] + (Dp[0] - C[0]) * g, C[1] + (Dp[1] - C[1]) * g]; Ep = [C[0] + (Ep[0] - C[0]) * g, C[1] + (Ep[1] - C[1]) * g]; }
    var o = '<ellipse cx="130" cy="14" rx="125" ry="20" fill="#e8d6bb"/>' + tx(130, 8, 'coulee', { size: 13, w: 600, c: '#7a5a33' });
    o += ln(A, B, { w: 2.4 }) + ln(A, Dp) + ln(B, Ep) + ln(Dp, Ep);
    o += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="3.2" fill="' + INK + '"/>';
    o += tx(A[0] - 10, A[1], 'A', { it: true }) + tx(B[0] + 10, B[1], 'B', { it: true }) + tx(C[0] + 13, C[1] - 2, 'C', { it: true }) + tx(Dp[0] + 11, Dp[1] + 6, 'D', { it: true }) + tx(Ep[0] - 11, Ep[1] + 6, 'E', { it: true });
    var m1 = [(A[0] + C[0]) / 2 - 22, (A[1] + C[1]) / 2], m2 = [(C[0] + Dp[0]) / 2 + 28, (C[1] + Dp[1]) / 2], m3 = [(Dp[0] + Ep[0]) / 2, Dp[1] + 15];
    o += tx(m1[0], m1[1], N(ca) + ' m', { size: 13 }) + tx(m2[0], m2[1], N(cd) + ' m', { size: 13 }) + tx(m3[0], m3[1], N(de) + ' m', { size: 13 });
    return svg(-10, -10, 280, Math.max(Dp[1], Ep[1]) + 36, o, 300, 'crossing triangles at a coulee');
  }
  /* the ramp: A on the ground, B above C, a post DE at D */
  function rampSVG(ad, de, ac) {
    var s = 300 / ac, h = de * ac / ad, H = Math.max(h * s, 50), sy = H / (h * s), Y0 = H + 20;
    var A = [10, Y0], C = [10 + ac * s, Y0], B = [C[0], Y0 - h * s * sy], Dp = [10 + ad * s, Y0], Ep = [Dp[0], Y0 - de * s * sy];
    var o = ln([0, Y0], [C[0] + 18, Y0], { c: '#8a6f4d', w: 2.4 }) + ln(A, B, { w: 2.6 }) + ln(C, B) + ln(Dp, Ep);
    o += rightSq(Dp, [1, 0], [0, -1], 8) + rightSq(C, [-1, 0], [0, -1], 8);
    o += tx(A[0], Y0 + 14, 'A', { it: true }) + tx(Dp[0], Y0 + 14, 'D', { it: true }) + tx(C[0], Y0 + 14, 'C', { it: true }) + tx(Ep[0] - 9, Ep[1] - 9, 'E', { it: true }) + tx(B[0] + 4, B[1] - 12, 'B', { it: true });
    o += tx(Dp[0] + 14, (Dp[1] + Ep[1]) / 2 - 6, N(de) + ' m', { a: 'start', size: 13 });
    o += ln([A[0], Y0 + 30], [Dp[0], Y0 + 30], { w: 1.2, c: '#3a4254' }) + tx((A[0] + Dp[0]) / 2, Y0 + 42, N(ad) + ' m', { size: 13 });
    o += ln([A[0], Y0 + 56], [C[0], Y0 + 56], { w: 1.2, c: '#3a4254' }) + tx((A[0] + C[0]) / 2, Y0 + 68, N(ac) + ' m', { size: 13 });
    return svg(-8, -8, C[0] + 40, Y0 + 86, o, 380, 'a loading ramp with a support post');
  }
  /* two house fronts (rectangle + 45° roof): bottom w, walls h */
  function housesSVG(w1, w2, h) {
    var u = 160 / (w1 + w2), out = '';
    [[w1, 'House 1'], [w2, 'House 2']].forEach(function (hh) {
      var w = hh[0], pts = [[0, 0], [w, 0], [w, h], [w / 2, h + w / 2], [0, h]].map(function (p) { return [p[0] * u * 1.6, p[1] * u * 1.6]; });
      var sides = [N(w) + ' m', '', '', '', N(h) + ' m'];
      out += '<div style="display:inline-block;vertical-align:bottom;margin:0 14px 6px 0;text-align:center">' + G.polygonSVG({ pts: pts, sides: sides, arcs: false, width: Math.round(w * u * 1.6 + 70) }) + '<div style="font-weight:700">' + hh[1] + '</div></div>';
    });
    return '<div>' + out + '</div>';
  }
  function tableHtml(head, rows) {
    var TD = 'border:1px solid #9aa3ad;padding:4px 10px;text-align:center';
    return '<table style="border-collapse:collapse;margin:6px 0"><tr>' + head.map(function (h) { return '<th style="' + TD + ';background:#eef1f6">' + h + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ================= shared builders ================= */
  /* the k / type table rows: [{ o, n, k, u, ask: 'k' | 'new' | 'orig' }] */
  function kTableStem(rows) {
    return tableHtml(['Original length', 'New length', t('k'), 'Type'], rows.map(function (rw, i) {
      return [rw.ask === 'orig' ? '(' + 'abcd'.charAt(i) + ') ?' : U(rw.o, rw.u), rw.ask === 'new' ? '(' + 'abcd'.charAt(i) + ') ?' : U(rw.n, rw.u), rw.ask === 'k' ? '(' + 'abcd'.charAt(i) + ') ?' : N(rw.k), '?'];
    }));
  }
  function kTableNums(rows, level, text) {
    var fields = [], chks = [], keys = [], sol = [];
    rows.forEach(function (rw, i) {
      var L = '(' + 'abcd'.charAt(i) + ')';
      if (rw.ask === 'k') {
        fields.push({ label: L + ' ' + t('k='), name: L + ' k' }); chks.push(kC(rw.k, { from: { new: rw.n, orig: rw.o } })); keys.push(kKey(rw.k));
        sol.push(L + ' ' + t('k=' + N(rw.n) + '\\div ' + N(rw.o) + '=' + N(rw.k)));
      } else if (rw.ask === 'new') {
        fields.push({ label: L + ' New length =', after: rw.u, name: L + ' new' }); chks.push(lenC(rw.n, { scale: { len: rw.o, k: rw.k, op: 'mul' } })); keys.push(lenKey(rw.n));
        sol.push(L + ' New ' + t('=k\\times\\text{original}=' + N(rw.k) + '\\times ' + N(rw.o) + '=' + N(rw.n)) + ' ' + rw.u);
      } else {
        fields.push({ label: L + ' Original length =', after: rw.u, name: L + ' original' }); chks.push(lenC(rw.o, { scale: { len: rw.n, k: rw.k, op: 'div' } })); keys.push(lenKey(rw.o));
        sol.push(L + ' Original ' + t('=\\text{new}\\div k=' + N(rw.n) + '\\div ' + N(rw.k) + '=' + N(rw.o)) + ' ' + rw.u);
      }
    });
    var p = P.fields('Fill in the missing number in each row.', fields, chks, keys, keys.map(function (k, i) { return fields[i].label + ' ' + k + (fields[i].after ? ' ' + fields[i].after : ''); }).join('<br>'), br(sol),
      ['k = new length ÷ original length.', 'New = k × original; original = new ÷ k.'], text);
    p.level = level; return p;
  }
  function kTableTypes(rows, text) {
    var cols = ['enlargement', 'reduction', 'congruent'].map(function (k) { return { id: k, html: k }; }), want = {};
    var rws = rows.map(function (rw, i) { want['r' + i] = kindOfK(rw.k); return { id: 'r' + i, html: '(' + 'abcd'.charAt(i) + ') ' + U(rw.o, rw.u) + ' → ' + U(rw.n, rw.u) }; });
    return P.grid('Choose the type for each row.', rws, cols, want, { why: function (row, got, w) { var rw = rows[Number(row.slice(1))]; return { code: 'u6l7-type-' + got, hint: 'In row (' + 'abcd'.charAt(Number(row.slice(1))) + ') k = ' + N(rw.k) + ': ' + TYPE_WHY[w] + ' means ' + w + '.' }; } },
      rows.map(function (rw, i) { return '(' + 'abcd'.charAt(i) + ') ' + t('k=' + N(rw.k)) + ': ' + kindOfK(rw.k); }).join('<br>') + '<br>k > 1: enlargement; k < 1: reduction; k = 1: congruent.', ['Compare k with 1.'], text);
  }
  /* a side ratio: exact, or rounded to 2+ decimal places */
  function ratC(x) { var base = kC(x, { dp: 2 }); return function (resp) { var s = String(resp == null ? '' : resp).trim(), p = HW.parse.number(s), dec = (s.split('.')[1] || '').length; if (p.ok && dec >= 2 && Math.abs(p.value - x) < 0.0051) return ok(); return base(resp); }; }
  function ratKey(x) { return places(x) <= 3 ? nS(x) : nS(rd(x, 2)); }
  /* "are they similar?" with two ratios (short ÷ short, long ÷ long) and yes / no */
  function simPart(prompt, a, b, sol, o) {
    o = o || {}; var r1 = a[1] / a[0], r2 = b[1] / b[0], same = Math.abs(r1 - r2) < 1e-9;
    var chk1 = ratC(r1), chk2 = ratC(r2);
    var wrap = function (c, conv) { return function (resp) { var res = c(resp); if (res.v === 'wrong' && conv) { var v = HW.parse.number(String(resp).trim()); if (v.ok && Math.abs(v.value - conv) < 0.006) return wrong('u6l7-no-convert', o.convHint); } return res; }; };
    return P.fields(prompt, [{ label: o.l1 || 'Short sides:', name: 'short ratio' }, { label: o.l2 || 'Long sides:', name: 'long ratio' }, { label: 'Similar?', mode: 'text', name: 'Similar', placeholder: 'yes/no' }],
      [wrap(chk1, o.conv1), wrap(chk2, o.conv2), yesNoC(same, same ? 'The angles all match and the two ratios are equal, so both tests pass.' : 'The ratios are <b>different</b>, so the sides are not in proportion: not similar.')],
      [ratKey(r1), ratKey(r2), same ? 'yes' : 'no'], N(rd(r1, 2)) + ', ' + N(rd(r2, 2)) + '; ' + (same ? 'similar' : 'not similar'), sol, ['Divide matching sides: short ÷ short and long ÷ long, the same figure on top each time.', 'Similar needs the <b>same</b> ratio for every pair of sides (and equal angles).'], o.text);
  }

  /* ================= the lesson ================= */
  var QUADS = ['PQRS', 'JKLM', 'ABCD', 'EFGH', 'WXYZ', 'KLMN', 'RSTU'];

  HW.defineLesson({
    id: 'u6l7', unit: 6, num: '7', title: 'Unit 6 Review', outcome: 'G3',
    blurb: 'The whole unit, set up like the unit test: scale factors, similar polygons, enlargements and reductions, maps and floor plans, similar triangles, shadows and mirrors.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A: Written Response', stem: function (sh) { return '(a) Find the scale factor <i>k</i> (new ÷ original). Then choose enlargement, reduction or congruent.' + kTableStem(sh.rows); },
        shared: function (r) {
          var u1 = r.pick(['cm', 'mm', 'in']), a1 = r.pick([3, 4, 5, 6, 7, 8]), k1 = find(function () { return r.pick([2, 3, 4, 5]); }, function (k) { return !(a1 === 4 && k === 2.5); }, 3);
          var red = find(function () { var o = r.pick([8, 10, 12, 16, 20, 15]), k = r.pick([0.75, 0.6, 0.8, 0.4, 0.25, 0.5]); return { o: o, k: k, n: q9(o * k) }; }, function (x) { return nice(x.n, 1) && x.n !== x.o; }, { o: 12, k: 0.75, n: 9 });
          var cg = r.pick([6, 7, 8, 9, 11]), cu = r.pick(['m', 'cm', 'ft']);
          var e2 = find(function () { var o = r.pick([2.5, 1.5, 3.5, 4.5, 2]), k = r.pick([2.4, 1.6, 2.6, 1.8, 3.2, 1.4]); return { o: o, k: k, n: q9(o * k) }; }, function (x) { return nice(x.n, 2); }, { o: 2.5, k: 2.4, n: 6 });
          var rows = r.shuffle([{ o: a1, n: a1 * k1, k: k1, u: u1, ask: 'k' }, { o: red.o, n: red.n, k: red.k, u: r.pick(['cm', 'm']), ask: 'k' }, { o: cg, n: cg, k: 1, u: cu, ask: 'k' }, { o: e2.o, n: e2.n, k: e2.k, u: 'in', ask: 'k' }]);
          var b1 = find(function () { return { k: r.pick([3, 4, 5, 6]), o: step(r, 1.5, 6.5, 0.5) }; }, function (x) { return !(x.k === 2 && x.o === 4); }, { k: 4, o: 3.5 });
          var b2 = find(function () { return { k: r.pick([0.6, 0.4, 0.8, 0.3, 0.7]), o: r.pick([25, 35, 45, 55, 65, 15]) }; }, function (x) { return nice(x.k * x.o, 1); }, { k: 0.6, o: 45 });
          var b3 = find(function () { return { k: r.pick([2.5, 1.5, 4, 1.25, 0.5]), o: r.pick([6, 8, 12, 14, 16, 4]) }; }, function (x) { return !(x.k === 2.5 && (x.o === 2 || x.o === 4 || x.o === 6)) && nice(x.k * x.o, 1); }, { k: 2.5, o: 8 });
          return { rows: rows, b1: b1, b2: b2, b3: b3 };
        },
        parts: [
          { id: '1a', sub: 'a·k', level: 'BEG', make: function (r, sh) { return kTableNums(sh.rows, 'BEG', 'k table'); } },
          { id: '1a2', sub: 'a·type', level: 'BEG', make: function (r, sh) { return kTableTypes(sh.rows, 'k types'); } },
          { id: '1b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var b1 = sh.b1, b2 = sh.b2, b3 = sh.b3, n1 = q9(b1.k * b1.o), n2 = q9(b2.k * b2.o), n3 = q9(b3.k * b3.o);
            return P.fields('(b) Fill in the blanks.', [
              { label: t('k=' + N(b1.k)) + ', original ' + U(b1.o, 'cm') + ', new =', after: 'cm', name: 'first new' },
              { label: t('k=' + N(b2.k)) + ', original ' + U(b2.o, 'cm') + ', new =', after: 'cm', name: 'second new' },
              { label: t('k=' + N(b3.k)) + ', new ' + U(n3, 'cm') + ', original =', after: 'cm', name: 'original' }],
              [lenC(n1, { scale: { len: b1.o, k: b1.k, op: 'mul' } }), lenC(n2, { scale: { len: b2.o, k: b2.k, op: 'mul' } }), lenC(b3.o, { scale: { len: n3, k: b3.k, op: 'div' } })],
              [lenKey(n1), lenKey(n2), lenKey(b3.o)], U(n1, 'cm') + ', ' + U(n2, 'cm') + ', ' + U(b3.o, 'cm'),
              br(['New ' + t('=k\\times\\text{original}=' + N(b1.k) + '\\times ' + N(b1.o) + '=' + N(n1)) + ' cm', 'New ' + t('=' + N(b2.k) + '\\times ' + N(b2.o) + '=' + N(n2)) + ' cm', 'Original ' + t('=\\text{new}\\div k=' + N(n3) + '\\div ' + N(b3.k) + '=' + N(b3.o)) + ' cm']),
              ['New = k × original.', 'Going back to the original: divide by k.'], 'blanks');
          } }] },
      { num: '2', stem: function (sh) { return t(sh.nm[0] + '\\sim ' + sh.nm[1]) + '. (The diagram is not to scale.)' + sh.svg; },
        shared: function (r) {
          var v = find(function () { return { a: r.pick([4, 5, 6, 8, 10]), b: r.pick([2, 2.5, 3, 4]), c: r.pick([3, 3.5, 4, 5]), k: r.pick([1.5, 1.6, 1.4, 1.8, 2.5, 1.2]), th: r.int(95, 112) }; },
            function (x) { if (x.k === 1.5 && (x.a === 6 || x.a === 4)) return false; if (!nice(x.k * x.a, 1) || !nice(x.k * x.b, 2) || !nice(x.k * x.c, 1)) return false;
              var Q = [x.a, 0], dr = [Math.cos((180 - x.th) * Math.PI / 180), Math.sin((180 - x.th) * Math.PI / 180)], R = [Q[0] + x.b * dr[0], Q[1] + x.b * dr[1]], d2 = [-dr[1], dr[0]], S = [R[0] + x.c * d2[0], R[1] + x.c * d2[1]];
              x.pts = [[0, 0], Q, R, S]; var aP = Math.atan2(S[1], S[0]) * 180 / Math.PI; return S[0] > 0.4 && aP > 50 && aP < 115 && x.th !== 100; }, null);
          if (!v) v = { a: 5, b: 3, c: 4, k: 1.6, th: 104, pts: [[0, 0], [5, 0], [5.73, 2.91], [1.85, 3.88]] };
          var nm = find(function () { var a = r.pick(QUADS), b = r.pick(QUADS); return [a, b]; }, function (p) { return p[0].split('').every(function (ch) { return p[1].indexOf(ch) < 0; }); }, ['PQRS', 'JKLM']);
          v.nm = nm; var A = nm[0], B = nm[1];
          v.svg = G.similarSVG({ pts: v.pts, k: v.k, drawK: Math.min(v.k, 1.7), names: [A, B], labels: [[N(v.a) + ' cm', N(v.b) + ' cm', '', ''], [N(q9(v.k * v.a)) + ' cm', '', N(q9(v.k * v.c)) + ' cm', '']], angles: [['', v.th + '°', ' ', ''], ['', '', '', '']], width: 440 });
          return v;
        },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) {
            var A = sh.nm[0], B = sh.nm[1], side = A.charAt(1) + A.charAt(2), want = B.charAt(1) + B.charAt(2);
            return P.fields('Which side of ' + B + ' matches ' + side + '? Which angle matches ∠' + A.charAt(3) + '?', [{ label: side + ' matches', mode: 'text', name: 'side', placeholder: 'side' }, { label: '∠' + A.charAt(3) + ' matches ∠', mode: 'text', name: 'angle', placeholder: 'letter' }],
              [segC(want, A.charAt(1) + ' is the 2nd letter and ' + A.charAt(2) + ' is the 3rd letter of ' + A + ': use the 2nd and 3rd letters of ' + B + '.'), angNameC(B.charAt(3), A.charAt(3) + ' is the 4th letter of ' + A + ': use the 4th letter of ' + B + '.')],
              [want, B.charAt(3)], side + ' ↔ ' + want + '; ∠' + A.charAt(3) + ' ↔ ∠' + B.charAt(3), 'Match the letters in order: ' + A.split('').map(function (c, i) { return c + ' ↔ ' + B.charAt(i); }).join(', ') + '.<br>So ' + side + ' ↔ ' + want + ' and ∠' + A.charAt(3) + ' ↔ ∠' + B.charAt(3) + '.', ['The 1st letter matches the 1st letter, the 2nd matches the 2nd, and so on.'], 'match names');
          } },
          { id: '2b', level: 'BEG', make: function (r, sh) {
            var A = sh.nm[0], B = sh.nm[1], s1 = A.slice(0, 2), s2 = B.slice(0, 2);
            return G.P.k('Find the scale factor from ' + A + ' to ' + B + '.', sh.k, { from: { new: q9(sh.k * sh.a), orig: sh.a }, sol: t('k=' + s2 + '\\div ' + s1 + '=' + N(q9(sh.k * sh.a)) + '\\div ' + N(sh.a) + '=' + N(sh.k)), hints: ['Use a pair of matching sides where both lengths are known: new ÷ original.'], text: 'k quad' });
          } },
          { id: '2c', level: 'EMG', make: function (r, sh) {
            var B = sh.nm[1], s = B.charAt(1) + B.charAt(2), v = q9(sh.k * sh.b);
            return lenP('Find ' + s + '.', v, { unit: 'cm', scale: { len: sh.b, k: sh.k, op: 'mul' }, sol: s + ' ' + t('=k\\times ' + sh.nm[0].charAt(1) + sh.nm[0].charAt(2) + '=' + N(sh.k) + '\\times ' + N(sh.b) + '=' + N(v)) + ' cm', hints: ['New = k × original.'], text: 'new side' });
          } },
          { id: '2d', level: 'PRG', make: function (r, sh) {
            var A = sh.nm[0], B = sh.nm[1], s = A.charAt(2) + A.charAt(3), s2 = B.charAt(2) + B.charAt(3), given = q9(sh.k * sh.c);
            return lenP('Find ' + s + '.', sh.c, { unit: 'cm', scale: { len: given, k: sh.k, op: 'div' }, sol: s + ' is on the original, so divide:<br>' + s + ' ' + t('=' + s2 + '\\div k=' + N(given) + '\\div ' + N(sh.k) + '=' + N(sh.c)) + ' cm<br>Check: ' + t(N(sh.k) + '\\times ' + N(sh.c) + '=' + N(given)) + ' ✓', hints: [s + ' is on the <b>original</b> figure: original = new ÷ k.'], text: 'original side' });
          } },
          { id: '2e', level: 'EMG', make: function (r, sh) {
            var A = sh.nm[0], B = sh.nm[1];
            return P.fields('Find ∠' + B.charAt(1) + ' and ∠' + B.charAt(2) + '.', [{ label: '∠' + B.charAt(1) + ' =', after: '°', name: '∠' + B.charAt(1) }, { label: '∠' + B.charAt(2) + ' =', after: '°', name: '∠' + B.charAt(2) }],
              [angC(sh.th, sh.k), angC(90, sh.k)], [String(sh.th), '90'], '∠' + B.charAt(1) + ' = ' + sh.th + '°, ∠' + B.charAt(2) + ' = 90°',
              'Angles stay the same in similar figures:<br>∠' + B.charAt(1) + ' = ∠' + A.charAt(1) + ' = ' + D(sh.th) + '<br>∠' + B.charAt(2) + ' = ∠' + A.charAt(2) + ' = ' + D(90) + ' (the right angle)', ['Matching angles are <b>equal</b>. Only the lengths change.'], 'angles same');
          } }] },
      { num: '3', stem: function (sh) { return 'Canada’s flag is twice as long as it is wide. A school has three flags or banners: flag A is ' + U(sh.aw, 'cm') + ' by ' + U(sh.al, 'cm') + ', flag B is ' + U(sh.bw, 'm') + ' by ' + U(sh.bl, 'm') + ', and banner C is ' + U(sh.cw, 'cm') + ' by ' + U(sh.cl, 'cm') + '. All the corners are right angles.'; },
        shared: function (r) {
          var aw = r.pick([60, 75, 80, 90, 100, 45, 50]), kB = find(function () { return r.pick([2, 2.4, 1.6, 1.2, 2.5, 3, 1.8]); }, function (k) { return nice(aw * k / 100, 2); }, 2);
          var C = find(function () { return { w: r.pick([40, 50, 60, 30, 45]), l: r.pick([60, 75, 90, 80, 100, 120]) }; }, function (c) { return c.l > c.w && Math.abs(c.l / c.w - 2) > 0.05 && c.w < aw && c.l < 2 * aw; }, { w: 50, l: 75 });
          return { aw: aw, al: 2 * aw, kB: kB, bw: q9(aw * kB / 100), bl: q9(2 * aw * kB / 100), cw: C.w, cl: C.l };
        },
        parts: [
          { id: '3a', level: 'PRG', make: function (r, sh) {
            var bw = q9(sh.bw * 100), bl = q9(sh.bl * 100);
            return simPart('Are flag A and flag B similar? Find each ratio (flag B ÷ flag A), then answer yes or no.', [sh.aw, bw], [sh.al, bl],
              br(['Same units: flag B is ' + U(bw, 'cm') + ' by ' + U(bl, 'cm') + '.', 'Short sides: ' + t(N(bw) + '\\div ' + N(sh.aw) + '=' + N(sh.kB)), 'Long sides: ' + t(N(bl) + '\\div ' + N(sh.al) + '=' + N(sh.kB)), 'The angles are all 90° and the ratios are equal, so A and B are similar.']),
              { l1: 'Short sides (B ÷ A):', l2: 'Long sides (B ÷ A):', conv1: sh.bw / sh.aw, conv2: sh.bl / sh.al, convHint: 'Change flag B to <b>centimetres</b> first (1 m = 100 cm), so both flags are in the same unit.', text: 'flags A B' });
          } },
          { id: '3b', level: 'EMG', make: function (r, sh) {
            var r1 = sh.cw / sh.aw, r2 = sh.cl / sh.al;
            return simPart('Are flag A and banner C similar? Find each ratio (banner C ÷ flag A), then answer yes or no. (Round a ratio to 2 decimal places if it doesn’t end.)', [sh.aw, sh.cw], [sh.al, sh.cl],
              br(['Short sides: ' + t(N(sh.cw) + '\\div ' + N(sh.aw) + toR(r1, 2)), 'Long sides: ' + t(N(sh.cl) + '\\div ' + N(sh.al) + toR(r2, 2)), 'The ratios are different, so they are <b>not</b> similar.']),
              { l1: 'Short sides (C ÷ A):', l2: 'Long sides (C ÷ A):', text: 'flags A C' });
          } }] },
      { num: '4', stem: function (sh) { return 'Rae says, “These two houses are similar, because every angle in house 1 matches an angle in house 2.” Both houses have angles of 90°, 135°, 90°, 135° and 90°.' + housesSVG(sh.w1, sh.w2, sh.h); },
        shared: function (r) { var w1 = r.pick([4, 5, 6, 3]), m = r.pick([2, 1.5, 3]), h = r.pick([2, 2.5, 3]); if (w1 * m > 12) m = 2; return { w1: w1, w2: q9(w1 * m), m: m, h: h }; },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) {
            return P.fields('Find each ratio (house 2 ÷ house 1).', [{ label: 'Bottoms:', name: 'bottoms' }, { label: 'Walls:', name: 'walls' }], [kC(sh.m), kC(1)], [kKey(sh.m), '1'], N(sh.m) + ' and 1',
              'Bottoms: ' + t(N(sh.w2) + '\\div ' + N(sh.w1) + '=' + N(sh.m)) + '<br>Walls: ' + t(N(sh.h) + '\\div ' + N(sh.h) + '=1'), ['Divide matching sides: house 2 ÷ house 1.'], 'house ratios');
          } },
          { id: '4b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Is Rae right?', [
              { html: '<b>No.</b> The angles match, but the side ratios are different (' + N(sh.m) + ' and 1), so the houses are not similar.', right: true },
              { html: '<b>Yes.</b> If all the angles match, the figures are similar.', why: 'Equal angles are only <b>one</b> of the two tests. The sides must also be in the same ratio.', code: 'r4-angles' },
              { html: '<b>Yes.</b> Both houses have the same wall height.', why: 'Similar figures have every side multiplied by the <b>same</b> k. House 2 is wider but not taller.', code: 'r4-walls' },
              { html: '<b>No.</b> The angles in house 2 are bigger.', why: 'The angles are the same (90° and 135°). It’s the sides that fail the test.', code: 'r4-bigger' }],
              'No. Both tests are needed. Bottoms: ' + t(N(sh.w2) + '\\div ' + N(sh.w1) + '=' + N(sh.m)) + '; walls: ' + t(N(sh.h) + '\\div ' + N(sh.h) + '=1') + '. The ratios are different, so the houses are not similar.', ['Similar needs equal angles <b>and</b> sides in the same ratio.'], 'Rae');
          } }] },
      { num: '5', stem: function (sh) { return 'Draw a reduction of the shape with a scale factor of ' + t('\\frac{1}{2}') + '. (Each square is 1 unit.) Instead of drawing it, give the lengths of the copy.' + sh.svg; },
        shared: function (r) {
          var c = r.pick([[6, 2, 4], [8, 4, 4], [10, 2, 4], [8, 4, 6], [6, 2, 6], [10, 6, 4], [12, 4, 6]]), B = c[0], T = c[1], H = c[2], o = (B - T) / 2;
          var pts = [[0, 0], [B, 0], [B - o, H], [o, H]];
          return { B: B, T: T, H: H, o: o, svg: G.gridSVG({ cols: B + 2, rows: H + 2, cell: 22, pts: pts, at: [1, 1], image: false, width: 300 }) };
        },
        parts: [{ id: '5', level: 'EMG', make: function (r, sh) {
          var w = [sh.B / 2, sh.T / 2, sh.H / 2, sh.o / 2, sh.H / 2];
          var g = function (v, orig, what) { return numC(v, [[orig, 'u6l7-grid', 'That’s the original ' + what + '. Multiply by ' + t('\\frac{1}{2}') + ' (halve it).'], [orig * 2, 'u6l7-grid', 'A reduction makes the copy <b>smaller</b>: halve the length, don’t double it.'], [orig - 2, 'u6l7-grid', 'Don’t subtract: multiply the length by ' + t('\\frac{1}{2}') + '.']]); };
          return P.fields('The copy (squares):', [{ label: 'Bottom:', after: 'squares', name: 'bottom' }, { label: 'Top:', after: 'squares', name: 'top' }, { label: 'Height:', after: 'squares', name: 'height' }, { label: 'Each slanted side goes across', after: 'squares', name: 'across' }, { label: '… and up', after: 'squares', name: 'up' }],
            [g(w[0], sh.B, 'bottom'), g(w[1], sh.T, 'top'), g(w[2], sh.H, 'height'), g(w[3], sh.o, 'move across'), g(w[4], sh.H, 'move up')], w.map(nS),
            'bottom ' + w[0] + ', top ' + w[1] + ', height ' + w[2] + '; slanted sides ' + w[3] + ' across and ' + w[4] + ' up',
            'Halve every length: bottom ' + t(sh.B + '\\to ' + w[0]) + ', top ' + t(sh.T + '\\to ' + w[1]) + ', height ' + t(sh.H + '\\to ' + w[2]) + ' squares.<br>Each slanted side goes ' + sh.o + ' across and ' + sh.H + ' up, so in the copy it goes ' + w[3] + ' across and ' + w[4] + ' up. The angles stay the same.', ['Count each length in squares, then multiply by ½.'], 'grid half');
        } }] },
      { num: '6', stem: function (sh) { return 'A sign maker enlarges a logo that is ' + U(sh.L, 'cm') + ' by ' + U(sh.W, 'cm') + ', using ' + t('k=' + sh.k) + '. Jae says the new logo is ' + U(sh.k * sh.L, 'cm') + ' by ' + U(sh.W + (sh.k - 1) * sh.L, 'cm') + '. “I made the long side ' + N((sh.k - 1) * sh.L) + ' cm bigger, so I made the short side ' + N((sh.k - 1) * sh.L) + ' cm bigger too.”'; },
        shared: function (r) { return find(function () { return { L: r.pick([30, 40, 50, 60, 36, 45]), W: r.pick([15, 20, 25, 18, 24, 30]), k: r.pick([2, 3, 4]) }; }, function (x) { return x.W < x.L; }, { L: 40, W: 25, k: 3 }); },
        parts: [
          { id: '6a', sub: 'a·why', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'What is Jae’s mistake?', [
              { html: 'An enlargement <b>multiplies</b> every length by k. Jae added the same amount to both sides instead.', right: true },
              { html: 'Jae should have added ' + sh.k + ' cm to each side.', why: 'A scale factor multiplies; it never adds.', code: 'j6-addk' },
              { html: 'Jae should have multiplied only the long side.', why: '<b>Every</b> length is multiplied by k, or the shape changes.', code: 'j6-one' },
              { html: 'There is no mistake: both sides grew by the same amount.', why: 'Growing by the same amount changes the shape. Check: ' + t(N(sh.W + (sh.k - 1) * sh.L) + '\\div ' + sh.W) + ' is not ' + sh.k + '.', code: 'j6-none' }],
              'Similar figures multiply every length by k; they do not add the same amount to each side.', ['What does a scale factor do to each length?'], 'Jae why');
          } },
          { id: '6a2', sub: 'a·size', level: 'EMG', make: function (r, sh) {
            var L2 = sh.k * sh.L, W2 = sh.k * sh.W;
            return P.fields('Find the correct size of the new logo.', [{ label: 'Long side:', after: 'cm', name: 'long side' }, { label: 'Short side:', after: 'cm', name: 'short side' }],
              [lenC(L2, { scale: { len: sh.L, k: sh.k, op: 'mul' } }), lenC(W2, { scale: { len: sh.W, k: sh.k, op: 'mul' }, alts: [{ v: sh.W + (sh.k - 1) * sh.L, code: 'u6l7-add', hint: 'That’s Jae’s answer. Multiply the short side by k too.' }] })],
              [nS(L2), nS(W2)], U(L2, 'cm') + ' by ' + U(W2, 'cm'), t(sh.k + '\\times ' + sh.L + '=' + L2) + ' cm and ' + t(sh.k + '\\times ' + sh.W + '=' + W2) + ' cm.<br>The logo should be ' + U(L2, 'cm') + ' by ' + U(W2, 'cm') + '.', ['Multiply each side by k.'], 'logo size');
          } },
          { id: '6b', sub: 'b', level: 'BEG', make: function (r, sh) {
            return G.P.angle('The corners of the small logo are right angles. What are the corners of the big logo?', 90, { supplementTrap: false, alts: [{ v: 90 * sh.k, code: 'u6l7-angle-k', hint: 'Angles do not change in an enlargement. Only lengths are multiplied by k.' }], sol: 'Still ' + D(90) + ': angles do not change in an enlargement.', hints: ['What happens to angles when a figure is enlarged?'], text: 'logo corners' });
          } },
          { id: '6c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var A1 = sh.L * sh.W, A2 = sh.k * sh.k * A1, kk = sh.k * sh.k;
            return P.fields('How many times as much paint will the big logo need as the small one? Compare the areas.', [{ label: 'Small area:', after: t('\\text{cm}^2'), name: 'small area' }, { label: 'Big area:', after: t('\\text{cm}^2'), name: 'big area' }, { label: 'Times as much paint:', name: 'times' }],
              [numC(A1, [[2 * (sh.L + sh.W), 'u6l7-perim', 'That’s the perimeter. Area = length × width.']]), numC(A2, [[sh.k * A1, 'u6l7-area-k', 'Find the big logo’s area from its <b>new</b> sides: ' + t(sh.k * sh.L + '\\times ' + sh.k * sh.W) + '.'], [sh.k * sh.L * (sh.W + (sh.k - 1) * sh.L), 'u6l7-add', 'Use the <b>correct</b> big logo, not Jae’s.']]),
                numC(kk, [[sh.k, 'u6l7-area-k', 'The lengths are ' + sh.k + ' times as long, but the <b>area</b> is ' + t(sh.k + '\\times ' + sh.k) + ' times as big. Divide the areas.']])],
              [String(A1), String(A2), String(kk)], N(A1) + ' cm², ' + N(A2) + ' cm², ' + kk + ' times',
              'Small: ' + t(sh.L + '\\times ' + sh.W + '=' + N(A1)) + ' cm²<br>Big: ' + t(sh.k * sh.L + '\\times ' + sh.k * sh.W + '=' + N(A2)) + ' cm²<br>' + t(N(A2) + '\\div ' + N(A1) + '=' + kk) + ' times as much (' + t(sh.k + '\\times ' + sh.k) + ', not ' + sh.k + ').', ['Area = length × width. Then divide big area ÷ small area.'], 'paint area');
          } }] },
      { num: '7', stem: 'Fill in the table. Each row shows the same scale in words and as a ratio.', shared: function (r) {
          return { m1: find(function () { return r.pick([2, 4, 10, 20, 25, 8]); }, function (x) { return x !== 5; }, 4), m2: r.pick([250, 750, 400, 1500, 600]), k3: r.pick([2, 3, 5, 1.5, 4]) };
        },
        parts: [{ id: '7', level: 'EMG', make: function (r, sh) {
          var n1 = sh.m1 * 100, n2 = sh.m2 * 100, n3 = sh.k3 * 100000;
          var stem = tableHtml(['In words', 'As a ratio'], [['1 cm represents ' + U(sh.m1, 'm'), '(a) ?'], ['(b) 1 cm represents ? m', t('1:' + N(n2))], ['1 cm represents ' + U(sh.k3, 'km'), '(c) ?']]);
          return P.fields(stem, [{ label: '(a) 1 :', name: '(a)' }, { label: '(b) 1 cm represents', after: 'm', name: '(b)' }, { label: '(c) 1 :', name: '(c)' }],
            [ratioC(n1, [[sh.m1, 'u6l7-no-convert', 'Same units on both sides: change ' + sh.m1 + ' m to centimetres (× 100).'], [sh.m1 * 1000, 'u6l7-convert', '1 m = <b>100</b> cm, not 1000.'], [sh.m1 * 10, 'u6l7-convert', '1 m = <b>100</b> cm.']]),
              numC(sh.m2, [[n2, 'u6l7-no-convert', 'The ratio is in centimetres. Change ' + N(n2) + ' cm to metres (÷ 100).'], [n2 / 1000, 'u6l7-convert', '100 cm = 1 m: divide by <b>100</b>, not 1000.'], [n2 / 10, 'u6l7-convert', 'Divide by 100 to change cm to m.']]),
              ratioC(n3, [[sh.k3, 'u6l7-no-convert', 'Same units on both sides: change ' + N(sh.k3) + ' km to centimetres.'], [sh.k3 * 1000, 'u6l7-convert', 'That’s ' + N(sh.k3) + ' km in <b>metres</b>. Change to centimetres too: × 100 more.'], [sh.k3 * 10000, 'u6l7-convert', '1 km = 1000 m = 100 000 cm.'], [sh.k3 * 1000000, 'u6l7-convert', '1 km = 100 000 cm.']])],
            [String(n1), String(sh.m2), String(n3)], '(a) ' + t('1:' + N(n1)) + '; (b) ' + U(sh.m2, 'm') + '; (c) ' + t('1:' + N(n3)),
            br(['(a) ' + t(sh.m1 + '\\text{ m}=' + N(n1) + '\\text{ cm}') + ', so ' + t('1:' + N(n1)), '(b) ' + t(N(n2) + '\\text{ cm}=' + N(sh.m2) + '\\text{ m}') + ', so 1 cm represents ' + U(sh.m2, 'm'), '(c) ' + t(N(sh.k3) + '\\text{ km}=' + N(sh.k3 * 1000) + '\\text{ m}=' + N(n3) + '\\text{ cm}') + ', so ' + t('1:' + N(n3))]),
            ['A ratio scale has the same unit on both sides (cm : cm).', '1 m = 100 cm; 1 km = 1000 m = 100 000 cm.'], 'scale table');
        } }] },
      { num: '8', stem: function (sh) { return 'Here is a floor plan of a small cabin, drawn at a scale of ' + t('1:' + sh.s) + '. The measurements are the lengths on the plan.' + cabinSVG(sh.L, sh.W, sh.bw, sh.h1, sh.h2); },
        shared: function (r) {
          return find(function () { var s = r.pick([40, 20, 25, 60, 80]), W = step(r, 7, 10, 0.5), h2 = step(r, 3.5, 5.5, 0.5); return { s: s, L: step(r, 12, 16, 0.5), W: W, bw: step(r, 4.5, 6.5, 0.5), h2: h2, h1: q9(W - h2), c: r.pick([1.6, 1.8, 2, 2.2, 2.4]) }; },
            function (x) { var f = x.s / 100; return x.h1 >= 3 && x.h1 !== x.h2 && [x.L, x.W, x.bw, x.h2].every(function (v) { return nice(v * f, 2); }) && nice(x.c / f, 1) && x.c / f < x.L * 0.6; }, { s: 40, L: 15.5, W: 9, bw: 6, h2: 5, h1: 4, c: 1.8 });
        },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) {
            var f = sh.s / 100;
            return P.fields('Write the scale in words, using metres.', [{ label: '1 cm represents', after: 'm', name: 'metres' }], [numC(f, [[sh.s, 'u6l7-no-convert', 'That’s ' + sh.s + ' <b>cm</b>. Change it to metres: ÷ 100.'], [sh.s / 1000, 'u6l7-convert', '100 cm = 1 m: divide by 100.'], [sh.s / 10, 'u6l7-convert', 'Divide by 100 to change cm to m.']])], [nS(f)], '1 cm represents ' + U(f, 'm'),
              t('1:' + sh.s) + ' means 1 cm represents ' + sh.s + ' cm. ' + t(sh.s + '\\text{ cm}=' + N(f) + '\\text{ m}') + ', so 1 cm represents ' + U(f, 'm') + '.', ['Same units: 1 cm represents ' + sh.s + ' cm. Then change cm to m.'], 'scale words');
          } },
          { id: '8b', level: 'EMG', make: function (r, sh) {
            var f = sh.s / 100, a = q9(sh.bw * f), b = q9(sh.h2 * f), ch = function (v, plan) { return lenC(v, { alts: [{ v: plan * sh.s, code: 'u6l7-no-convert', hint: 'That’s in <b>centimetres</b>. The box is in metres: × ' + N(f) + ' m per cm.' }, { v: plan / f, code: 'u6l7-flip', hint: 'Real = plan × ' + N(f) + ' m. You divided.' }] }); };
            return P.fields('Find the real length and width of the bedroom.', [{ label: 'Length:', after: 'm', name: 'length' }, { label: 'Width:', after: 'm', name: 'width' }], [ch(a, sh.bw), ch(b, sh.h2)], [lenKey(a), lenKey(b)], U(a, 'm') + ' by ' + U(b, 'm'),
              t(N(sh.bw) + '\\times ' + N(f) + '=' + N(a)) + ' m; ' + t(N(sh.h2) + '\\times ' + N(f) + '=' + N(b)) + ' m. The bedroom is ' + U(a, 'm') + ' by ' + U(b, 'm') + '.', ['Real = plan length × ' + N(f) + ' m.'], 'bedroom');
          } },
          { id: '8c', level: 'EMG', make: function (r, sh) {
            var f = sh.s / 100, a = q9(sh.L * f), b = q9(sh.W * f), ch = function (v, plan) { return lenC(v, { alts: [{ v: plan * sh.s, code: 'u6l7-no-convert', hint: 'That’s in <b>centimetres</b>. Give metres.' }, { v: plan / f, code: 'u6l7-flip', hint: 'Real = plan × ' + N(f) + ' m. You divided.' }] }); };
            return P.fields('Find the real length and width of the whole cabin.', [{ label: 'Length:', after: 'm', name: 'length' }, { label: 'Width:', after: 'm', name: 'width' }], [ch(a, sh.L), ch(b, sh.W)], [lenKey(a), lenKey(b)], U(a, 'm') + ' by ' + U(b, 'm'),
              t(N(sh.L) + '\\times ' + N(f) + '=' + N(a)) + ' m; ' + t(N(sh.W) + '\\times ' + N(f) + '=' + N(b)) + ' m', ['Real = plan length × ' + N(f) + ' m.'], 'cabin');
          } },
          { id: '8d', level: 'PRG', make: function (r, sh) {
            var f = sh.s / 100, v = q9(sh.c / f);
            return lenP('A couch is ' + U(sh.c, 'm') + ' long. How long should it be on the plan?', v, { unit: 'cm', alts: [{ v: sh.c * f, code: 'u6l7-flip', hint: 'Going from real to plan: <b>divide</b> by ' + N(f) + ' m per cm.' }, { v: sh.c / sh.s, code: 'u6l7-no-convert', hint: 'Change ' + N(sh.c) + ' m to centimetres first (' + N(sh.c * 100) + ' cm), then divide by ' + sh.s + '.' }, { v: sh.c * 100 * sh.s, code: 'u6l7-flip', hint: 'Diagram = real ÷ scale number.' }],
              sol: 'Diagram = real ÷ ' + N(f) + ': ' + t(N(sh.c) + '\\div ' + N(f) + '=' + N(v)) + ' cm<br>(or ' + t(N(sh.c * 100) + '\\text{ cm}\\div ' + sh.s + '=' + N(v)) + ' cm)', hints: ['Plan = real ÷ ' + N(f) + ' m.'], text: 'couch' });
          } }] },
      { num: '9', stem: function (sh) { return 'On a road map with a scale of ' + t('1:' + N(sh.n)) + ', the drive from a farm to the nearest town measures ' + U(sh.m1, 'cm') + ' along one road and then ' + U(sh.m2, 'cm') + ' along another.'; },
        shared: function (r) {
          return find(function () { return { n: r.pick([250000, 500000, 200000, 400000, 1000000]), m1: step(r, 2, 6, 0.1), m2: step(r, 2, 6, 0.1), v: r.pick([60, 80, 90, 100]) }; },
            function (x) { var d = x.n / 100000, tot = q9((x.m1 + x.m2) * d); return x.m1 !== x.m2 && nice(tot, 1) && Math.abs(tot / x.v * 60 - Math.round(tot / x.v * 60)) > 0.08 && Math.abs(tot / x.v * 60 - Math.round(tot / x.v * 60)) < 0.42; }, { n: 500000, m1: 4.2, m2: 3.6, v: 90 });
        },
        parts: [
          { id: '9a', level: 'BEG', make: function (r, sh) {
            var d = sh.n / 100000;
            return P.fields('What does 1 cm on the map represent, in kilometres?', [{ label: '1 cm represents', after: 'km', name: 'km' }], [numC(d, [[sh.n / 1000, 'u6l7-km', 'That’s in <b>metres</b>. Divide by 1000 more to get km.'], [sh.n / 10000, 'u6l7-km', '1 km = 100 000 cm: divide by 100 000.'], [sh.n / 1000000, 'u6l7-km', '1 km = 100 000 cm (not 1 000 000).'], [sh.n / 100, 'u6l7-km', 'That’s in metres... check: cm ÷ 100 = m, then m ÷ 1000 = km.']])], [nS(d)], U(d, 'km'),
              t(N(sh.n) + '\\text{ cm}=' + N(sh.n / 100) + '\\text{ m}=' + N(d) + '\\text{ km}') + ', so 1 cm represents ' + U(d, 'km') + '.', ['cm ÷ 100 = m; m ÷ 1000 = km.'], 'road km');
          } },
          { id: '9b', level: 'EMG', make: function (r, sh) {
            var d = sh.n / 100000, tot = q9(sh.m1 + sh.m2), km = q9(tot * d);
            return lenP('How long is the drive?', km, { unit: 'km', alts: [{ v: sh.m1 * d, code: 'u6l7-sum', hint: 'Add <b>both</b> parts of the route first.' }, { v: sh.m2 * d, code: 'u6l7-sum', hint: 'Add both parts of the route first.' }, { v: tot * sh.n / 100, code: 'u6l7-km', hint: 'That’s in metres. Give kilometres.' }], sol: 'Map: ' + t(N(sh.m1) + '+' + N(sh.m2) + '=' + N(tot)) + ' cm<br>Real: ' + t(N(tot) + '\\times ' + N(d) + '=' + N(km)) + ' km', hints: ['Add the two map lengths, then use 1 cm → ' + N(d) + ' km.'], text: 'drive' });
          } },
          { id: '9c', level: 'PRG', make: function (r, sh) {
            var d = sh.n / 100000, km = q9((sh.m1 + sh.m2) * d), h = km / sh.v, mins = h * 60;
            return lenP('At an average of ' + sh.v + ' km/h, how many minutes does the drive take? (Round to the nearest minute.)', mins, { dp: 0, unit: 'minutes', alts: [{ v: h, code: 'u6l7-hours', hint: 'That’s the time in <b>hours</b>. Multiply by 60 for minutes.' }, { v: sh.v / km * 60, code: 'u6l7-time-flip', hint: 'Time = distance ÷ speed: ' + t(N(km) + '\\div ' + sh.v) + '.' }, { v: sh.v / km, code: 'u6l7-time-flip', hint: 'Time = distance ÷ speed.' }, { v: km / sh.v * 100, code: 'u6l7-hours', hint: 'An hour has <b>60</b> minutes, not 100.' }],
              sol: 'Time ' + t('=' + N(km) + '\\div ' + sh.v + toR(h, 3)) + ' h<br>' + t(N(rd(h, 4)) + '\\ldots\\times 60' + toR(mins, 0)) + ' minutes', hints: ['Time = distance ÷ speed (in hours). Then × 60 for minutes.'], text: 'minutes' });
          } }] },
      { num: '10', stem: 'Decide if each pair of triangles is similar.', shared: function (r) {
          var a = find(function () { return { A: r.int(35, 70), B: r.int(40, 75) }; }, function (x) { var C = 180 - x.A - x.B; return C >= 35 && x.A !== x.B && C !== x.A && C !== x.B && [x.A, x.B, C].indexOf(47) < 0 && [x.A, x.B, C].indexOf(68) < 0; }, { A: 52, B: 61 });
          a.C = 180 - a.A - a.B;
          var perm = r.pick([[1, 2, 0], [2, 0, 1], [1, 0, 2], [2, 1, 0], [0, 2, 1]]);   // DEF get the angles of A/B/C in this order
          var g = find(function () { return { G: r.int(40, 65), H: r.int(55, 80), d: r.pick([2, 3, 4, -2, -3]) }; }, function (x) { return 180 - x.G - x.H >= 40 && x.G !== x.H; }, { G: 48, H: 70, d: 2 });
          return { a: a, perm: perm, g: g, th: find(function () { return r.int(22, 68); }, function (x) { return x !== 45; }, 35) };
        },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) {
            var v = [sh.a.A, sh.a.B, sh.a.C], DEF = 'DEF', dv = sh.perm.map(function (i) { return v[i]; }), F = dv[2];
            var want = [0, 1, 2].map(function (i) { return DEF.charAt(sh.perm.indexOf(i)); }).join('');
            return P.fields('△<i>ABC</i>: ∠<i>A</i> = ' + D(v[0]) + ', ∠<i>B</i> = ' + D(v[1]) + '. △<i>DEF</i>: ∠<i>D</i> = ' + D(dv[0]) + ', ∠<i>E</i> = ' + D(dv[1]) + '. Find the third angles. They are similar: name them in matching order.',
              [{ label: '∠<i>C</i> =', after: '°', name: '∠C' }, { label: '∠<i>F</i> =', after: '°', name: '∠F' }, { label: '△<i>ABC</i> ∼ △', mode: 'text', name: 'name', placeholder: 'letters' }],
              [G.angleChk(v[2], { supplementTrap: false, alts: [{ v: 180 - v[0], code: 'u6l7-third', hint: 'Subtract <b>both</b> known angles from 180°.' }, { v: 180 - v[1], code: 'u6l7-third', hint: 'Subtract both known angles from 180°.' }, { v: 360 - v[0] - v[1], code: 'u6l7-third', hint: 'A triangle’s angles add to <b>180°</b>.' }] }),
                G.angleChk(F, { supplementTrap: false, alts: [{ v: 180 - dv[0], code: 'u6l7-third', hint: 'Subtract both known angles from 180°.' }, { v: 360 - dv[0] - dv[1], code: 'u6l7-third', hint: 'A triangle’s angles add to <b>180°</b>.' }] }),
                triC(want, 'Match each letter with the letter that has the <b>same angle</b>: ' + want.split('').map(function (c, i) { return 'ABC'.charAt(i) + ' (' + v[i] + '°) ↔ ?'; }).join(', ') + '.')],
              [String(v[2]), String(F), want], '∠C = ' + v[2] + '°, ∠F = ' + F + '°, △ABC ∼ △' + want,
              '∠<i>C</i> ' + t('=180^\\circ-' + v[0] + '^\\circ-' + v[1] + '^\\circ=' + v[2] + '^\\circ') + '; ∠<i>F</i> ' + t('=180^\\circ-' + dv[0] + '^\\circ-' + dv[1] + '^\\circ=' + F + '^\\circ') + '<br>Match equal angles: ' + [0, 1, 2].map(function (i) { return 'ABC'.charAt(i) + ' ↔ ' + want.charAt(i) + ' (' + v[i] + '°)'; }).join(', ') + '<br>△<i>ABC</i> ∼ △<i>' + want + '</i>', ['Angles in a triangle add to 180°.', 'Write the second triangle’s letters in the order of the matching angles.'], 'name AA');
          } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var g = sh.g, I = 180 - g.G - g.H, K2 = g.H + g.d, L = 180 - g.G - K2;
            return P.fields('△<i>GHI</i>: ∠<i>G</i> = ' + D(g.G) + ', ∠<i>H</i> = ' + D(g.H) + '. △<i>JKL</i>: ∠<i>J</i> = ' + D(g.G) + ', ∠<i>K</i> = ' + D(K2) + '. Find the third angles. Are the triangles similar?',
              [{ label: '∠<i>I</i> =', after: '°', name: '∠I' }, { label: '∠<i>L</i> =', after: '°', name: '∠L' }, { label: 'Similar?', mode: 'text', name: 'Similar', placeholder: 'yes/no' }],
              [G.angleChk(I, { supplementTrap: false, alts: [{ v: 360 - g.G - g.H, code: 'u6l7-third', hint: 'A triangle’s angles add to 180°.' }] }), G.angleChk(L, { supplementTrap: false, alts: [{ v: 360 - g.G - K2, code: 'u6l7-third', hint: 'A triangle’s angles add to 180°.' }] }), yesNoC(false, 'Only <b>one</b> pair of angles matches (' + g.G + '°). The others are ' + g.H + '° vs ' + K2 + '° and ' + I + '° vs ' + L + '°.')],
              [String(I), String(L), 'no'], '∠I = ' + I + '°, ∠L = ' + L + '°, not similar',
              '∠<i>I</i> = ' + D(I) + ' and ∠<i>L</i> = ' + D(L) + '.<br>The angles are ' + g.G + '°, ' + g.H + '°, ' + I + '° and ' + g.G + '°, ' + K2 + '°, ' + L + '°: only one pair matches, so they are <b>not</b> similar.', ['Similar triangles need all three angles to match.'], 'not AA');
          } },
          { id: '10c', level: 'EMG', make: function (r, sh) {
            var th = sh.th, o = 90 - th;
            return P.mc(r, 'Two right triangles each have a ' + D(th) + ' angle. Why must they be similar?', [
              { html: 'Each has a 90° angle and a ' + th + '° angle, so the third angle is ' + t('180^\\circ-90^\\circ-' + th + '^\\circ=' + o + '^\\circ') + ' in both. All the angles match (AA).', right: true },
              { html: 'All right triangles are similar.', why: 'Not true: a right triangle with a 30° angle is not similar to one with a 45° angle.', code: 't10-all' },
              { html: 'Their sides must be the same length.', why: 'Similar figures don’t need equal sides; equal angles (AA) are enough for triangles.', code: 't10-sides' },
              { html: 'Their hypotenuses are both the longest side.', why: 'That’s true of every right triangle, and it says nothing about the angles.', code: 't10-hyp' }],
              'The third angle is ' + t('180^\\circ-90^\\circ-' + th + '^\\circ=' + o + '^\\circ') + ' in both, so all three angles match: similar (AA).', ['Find the third angle in each triangle.'], 'right AA');
          } }] },
      { num: '11', stem: function (sh) { return '△<i>ABC</i> ∼ △<i>DEF</i>. Find <i>x</i> and <i>y</i>. Lengths are in centimetres. (Not to scale.)' + sh.svg; },
        shared: function (r) {
          var v = find(function () { return { a: r.pick([4, 5, 6, 8]), b: r.pick([6, 7, 9, 10]), c: r.pick([8, 9, 10, 12, 11]), k: r.pick([1.5, 2.5, 1.2, 1.4, 3, 0.5, 1.6]) }; },
            function (x) { if (x.a === 5 && x.b === 7 && x.c === 9 && x.k === 1.5) return false; if (!(x.c > x.b && x.a + x.b > x.c + 1.5)) return false; return nice(x.k * x.a, 1) && nice(x.k * x.b, 1) && nice(x.k * x.c, 1); }, { a: 6, b: 8, c: 10, k: 2.5 });
          var bx = (v.a * v.a + v.c * v.c - v.b * v.b) / (2 * v.c), by = Math.sqrt(v.a * v.a - bx * bx);
          v.svg = G.similarSVG({ pts: [[0, 0], [bx, by], [v.c, 0]], k: v.k, drawK: Math.max(1.3, Math.min(v.k, 1.6)), flip: true, names: ['ABC', 'DEF'], labels: [[N(v.a), N(v.b), 'y'], [N(q9(v.k * v.a)), 'x', N(q9(v.k * v.c))]], width: 440 });
          return v;
        },
        parts: [
          { id: '11a', sub: 'x', level: 'EMG', make: function (r, sh) {
            var x = q9(sh.k * sh.b), de = q9(sh.k * sh.a);
            return lenP('Find <i>x</i> (side <i>EF</i>).', x, { unit: 'cm', scale: { len: sh.b, k: sh.k, op: 'mul' }, prop: { given: sh.b, num: de, den: sh.a }, sol: 'Matching sides: <i>AB</i> ↔ <i>DE</i>, <i>BC</i> ↔ <i>EF</i>, <i>AC</i> ↔ <i>DF</i>.<br>' + t('k=DE\\div AB=' + N(de) + '\\div ' + N(sh.a) + '=' + N(sh.k)) + '<br>' + t('x=EF=' + N(sh.k) + '\\times ' + N(sh.b) + '=' + N(x)) + ' cm', hints: ['Find k from the pair of matching sides you know both of: DE and AB.', 'EF matches BC.'], text: 'x tri' });
          } },
          { id: '11b', sub: 'y', level: 'PRG', make: function (r, sh) {
            var df = q9(sh.k * sh.c);
            return lenP('Find <i>y</i> (side <i>AC</i>).', sh.c, { unit: 'cm', scale: { len: df, k: sh.k, op: 'div' }, sol: t('k=' + N(sh.k)) + '. <i>AC</i> is on the original, so divide:<br>' + t('y=AC=DF\\div k=' + N(df) + '\\div ' + N(sh.k) + '=' + N(sh.c)) + ' cm', hints: ['AC matches DF. AC is on the original triangle: original = new ÷ k.'], text: 'y tri' });
          } }] },
      { num: '12', stem: function (sh) { return 'To find the distance <i>AB</i> across a coulee near Drumheller, Kiran puts stakes at <i>C</i>, <i>D</i> and <i>E</i> so that <i>A</i>, <i>C</i>, <i>D</i> are in a line, <i>B</i>, <i>C</i>, <i>E</i> are in a line, and <i>DE</i> ∥ <i>AB</i>. She measures <i>CA</i> = ' + U(sh.ca, 'm') + ', <i>CD</i> = ' + U(sh.cd, 'm') + ' and <i>DE</i> = ' + U(sh.de, 'm') + '.' + couleeSVG(sh.ca, sh.cd, sh.de); },
        shared: function (r) { return find(function () { var k = r.pick([3, 4, 5, 2.5, 6]), cd = r.pick([8, 10, 12, 6, 15]); return { k: k, cd: cd, ca: q9(k * cd), de: r.pick([5, 6, 7.5, 8, 4.5, 9]) }; }, function (x) { return x.ca <= 75 && !(x.k === 4 && x.cd === 10 && x.de === 7.5); }, { k: 4, cd: 12, ca: 48, de: 6 }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r) {
            return P.mc(r, 'Why is △<i>CAB</i> ∼ △<i>CDE</i>?', [
              { html: '∠<i>ACB</i> = ∠<i>DCE</i> (vertically opposite), and ∠<i>CAB</i> = ∠<i>CDE</i> (alternate angles, because <i>AB</i> ∥ <i>DE</i>). Two pairs of equal angles (AA).', right: true },
              { html: 'The sides <i>CA</i> and <i>CD</i> are on the same line.', why: 'Being on one line doesn’t make the triangles similar. Look for two pairs of equal angles.', code: 'c12-line' },
              { html: 'Both triangles have a right angle.', why: 'There is no right angle marked here. Use the crossing lines and the parallel lines.', code: 'c12-right' },
              { html: '<i>CA</i> is longer than <i>CD</i>.', why: 'Lengths don’t prove similarity. Look for equal angles.', code: 'c12-long' }],
              'At <i>C</i> the angles are vertically opposite, so they are equal. <i>AB</i> ∥ <i>DE</i>, so ∠<i>CAB</i> = ∠<i>CDE</i> (alternate angles). Two pairs of equal angles: similar.', ['Look at the angles at C, and use the parallel lines.'], 'coulee why');
          } },
          { id: '12b', level: 'PRG', make: function (r, sh) {
            var ab = q9(sh.k * sh.de);
            return lenP('Find the distance across the coulee, <i>AB</i>.', ab, { unit: 'm', scale: { len: sh.de, k: sh.k, op: 'mul' }, prop: { given: sh.de, num: sh.ca, den: sh.cd }, sol: t('k=CA\\div CD=' + N(sh.ca) + '\\div ' + N(sh.cd) + '=' + N(sh.k)) + '<br>' + t('AB=' + N(sh.k) + '\\times ' + N(sh.de) + '=' + N(ab)) + ' m. It is ' + U(ab, 'm') + ' across the coulee.', hints: ['AB matches DE. Find k = CA ÷ CD first.'], text: 'coulee' });
          } }] },
      { num: '13', stem: function (sh) { return 'At noon, a fence post ' + U(sh.h, 'm') + ' tall casts a shadow ' + U(sh.s, 'm') + ' long. At the same time, a church steeple casts a shadow ' + U(sh.S, 'm') + ' long.' + G.shadowSVG({ small: { h: sh.h, shadow: sh.s, kind: 'post' }, big: { h: sh.h / sh.s * sh.S, shadow: sh.S, kind: 'tower', label: { h: 'h' } }, width: 400 }); },
        shared: function (r) { return find(function () { return { h: r.pick([1.2, 1.5, 1.8, 2, 1.4]), s: r.pick([0.8, 1.2, 1.5, 1.6, 1, 2.4, 0.9]), S: r.int(14, 32) }; }, function (x) { return x.h !== x.s && !(x.h === 1.6) && x.h / x.s * x.S < 45; }, { h: 1.5, s: 1.2, S: 22 }); },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) {
            var H = sh.h / sh.s * sh.S;
            return lenP('How tall is the steeple? Round to the nearest tenth of a metre if needed.', H, { dp: 1, unit: 'm', prop: { given: sh.S, num: sh.h, den: sh.s }, alts: [{ v: sh.S + sh.h - sh.s, code: 'prop-add', hint: 'Similar triangles <b>multiply</b> by the same factor; don’t add.' }], sol: t('\\dfrac{h}{' + N(sh.S) + '}=\\dfrac{' + N(sh.h) + '}{' + N(sh.s) + '}') + '<br>' + t('h=' + N(sh.h) + '\\div ' + N(sh.s) + '\\times ' + N(sh.S) + toR(H, 1)) + ' m', hints: ['Height ÷ shadow is the same for both: h ÷ ' + N(sh.S) + ' = ' + N(sh.h) + ' ÷ ' + N(sh.s) + '.'], text: 'steeple' });
          } },
          { id: '13b', level: 'BEG', make: function (r) {
            return P.mc(r, 'Why must both shadows be measured at the same time of day?', [
              { html: 'The sun’s angle changes during the day. At the same moment, the sun’s rays hit both objects at the same angle, so the triangles are similar.', right: true },
              { html: 'So the person measuring doesn’t get tired.', why: 'Think about the sun: does a shadow stay the same length all day?', code: 's13-tired' },
              { html: 'Shadows are always the same length as the object at noon.', why: 'Not true: a shadow can be longer or shorter than the object.', code: 's13-noon' },
              { html: 'Because the objects grow during the day.', why: 'The objects don’t change. What does change during the day?', code: 's13-grow' }],
              'The sun’s angle changes during the day, so the shadows change length. Measured at the same moment, the sun’s rays make the same angle with both objects, so the triangles are similar.', ['What changes during the day?'], 'same time');
          } }] },
      { num: '14', stem: function (sh) { return 'To find the height of a climbing wall in a gym, Lee puts a mirror on the floor ' + U(sh.d2, 'm') + ' from the wall. She stands ' + U(sh.d1, 'm') + ' from the mirror and sees the top of the wall in it. Her eyes are ' + U(sh.e, 'm') + ' above the floor.' + G.mirrorSVG({ eye: sh.e, d1: sh.d1, d2: sh.d2, kind: 'building', labels: { h: 'h' }, width: 400 }); },
        shared: function (r) { return find(function () { return { e: r.pick([1.5, 1.6, 1.7, 1.8, 1.55]), d1: r.pick([1.2, 1.5, 2, 1.6, 1.25, 2.4]), d2: step(r, 4, 9, 0.5) }; }, function (x) { return !(x.e === 1.4) && x.e / x.d1 * x.d2 < 14 && x.e / x.d1 * x.d2 > 3; }, { e: 1.7, d1: 1.2, d2: 6 }); },
        parts: [{ id: '14', level: 'PRG', make: function (r, sh) {
          var h = sh.e / sh.d1 * sh.d2;
          return lenP('How tall is the wall? Round to the nearest tenth of a metre if needed.', h, { dp: 1, unit: 'm', prop: { given: sh.d2, num: sh.e, den: sh.d1 }, alts: [{ v: sh.e * sh.d2 * sh.d1, code: 'u6l7-flip', hint: 'Divide by Lee’s distance to the mirror: h = ' + N(sh.e) + ' ÷ ' + N(sh.d1) + ' × ' + N(sh.d2) + '.' }], sol: t('\\dfrac{h}{' + N(sh.d2) + '}=\\dfrac{' + N(sh.e) + '}{' + N(sh.d1) + '}') + '<br>' + t('h=' + N(sh.e) + '\\div ' + N(sh.d1) + '\\times ' + N(sh.d2) + toR(h, 1)) + ' m. The climbing wall is about ' + U(rd(h, 1), 'm') + ' tall.', hints: ['Eye height ÷ (you to mirror) = wall height ÷ (mirror to wall).'], text: 'mirror wall' });
        } }] },
      /* ---------------- Part B ---------------- */
      { num: '15', section: 'Part B: Multiple Choice', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var v = find(function () { return { w: r.pick([20, 25, 30, 40, 50, 15, 60]), k: r.pick([0.4, 0.8, 0.2, 0.25]) }; }, function (x) { return nice(x.w * x.k, 1) && Math.abs(x.w - x.w * x.k - x.w * x.k) > 1e-9; }, { w: 20, k: 0.4 }), n = q9(v.w * v.k);
        return P.mc(r, 'A photo ' + U(v.w, 'cm') + ' wide is reduced to ' + U(n, 'cm') + ' wide. The scale factor is', [{ html: N(1 / v.k), why: 'Upside down: k = new ÷ original = ' + N(n) + ' ÷ ' + N(v.w) + '.', code: 'p15-flip' }, { html: N(v.k), right: true }, { html: N(q9(v.w - n)), why: 'That’s the difference. A scale factor is a division.', code: 'p15-diff' }, { html: N(q9(1 - v.k)), why: 'That’s the difference ÷ the original. Use new ÷ original.', code: 'p15-frac' }],
          t('k=\\text{new}\\div\\text{original}=' + N(n) + '\\div ' + N(v.w) + '=' + N(v.k)), ['k = new ÷ original.'], 'MC k', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'BEG', make: function (r) {
        var right = r.pick([['two regular hexagons', 'Regular hexagons all have 120° angles and equal sides, so every side ratio is the same.'], ['two squares', 'Squares all have 90° angles and equal sides, so every side ratio is the same.'], ['two equilateral triangles', 'Equilateral triangles all have 60° angles and equal sides.'], ['two regular octagons', 'Regular octagons all have 135° angles and equal sides.']]);
        var wr = r.shuffle([['two rectangles', 'Rectangles can have different side ratios (a long thin one and a square-ish one).'], ['two rhombuses', 'Rhombuses can have different angles.'], ['two isosceles triangles', 'Isosceles triangles can have different angles.'], ['two parallelograms', 'Parallelograms can have different angles and side ratios.'], ['two right triangles', 'Right triangles can have different acute angles.'], ['two trapezoids', 'Trapezoids can have very different shapes.']]).slice(0, 3);
        return P.mc(r, 'Which pair of figures is <b>always</b> similar?', [{ html: right[0], right: true }].concat(wr.map(function (w, i) { return { html: w[0], why: w[1], code: 'a16-' + i }; })), right[1], ['Which shapes always have the same angles and the same side ratios?'], 'always similar');
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'BEG', make: function (r) {
        var nm = find(function () { return [r.pick(QUADS), r.pick(QUADS)]; }, function (p) { return p[0].split('').every(function (ch) { return p[1].indexOf(ch) < 0; }); }, ['ABCD', 'EFGH']), A = nm[0], B = nm[1], i = r.int(0, 3);
        var side = function (s, j) { return s.charAt(j) + s.charAt((j + 1) % 4); }, ORD = ['1st and 2nd', '2nd and 3rd', '3rd and 4th', '4th and 1st'];
        return P.mc(r, t(A + '\\sim ' + B) + '. The side that matches ' + side(A, i) + ' is', [0, 1, 2, 3].map(function (j) { return { html: side(B, j), right: j === i, why: j === i ? null : side(A, i) + ' uses the ' + ORD[i] + ' letters, so use the ' + ORD[i] + ' letters of ' + B + '.', code: 'm17-' + j }; }),
          side(A, i) + ' uses the ' + ORD[i] + ' letters of ' + A + ', so it matches ' + side(B, i) + '.', ['Match the letters by position.'], 'MC match', true);
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var n = r.pick([250000, 50000, 2000000, 150000, 400000, 75000, 1500000]), m = n / 100;
        var fmt = function (mm) { return mm >= 1000 ? U(q9(mm / 1000), 'km') : U(q9(mm), 'm'); };
        var opts = [{ html: fmt(m), right: true }, { html: fmt(m / 10), why: 'cm → m is ÷ 100. Check your unit change.', code: 'g18-10' }, { html: fmt(m * 10), why: 'cm → m is ÷ 100 and m → km is ÷ 1000.', code: 'g18-x10' }, { html: fmt(m * 100), why: 'That’s 100 times too big. ' + t(N(n) + '\\text{ cm}\\div 100') + ' gives metres.', code: 'g18-x100' }];
        return P.mc(r, 'A map scale of ' + t('1:' + N(n)) + ' means that 1 cm on the map represents', opts, t(N(n) + '\\text{ cm}=' + N(m) + '\\text{ m}') + (m >= 1000 ? t('=' + N(m / 1000) + '\\text{ km}') : '') + '.', ['cm ÷ 100 = m; m ÷ 1000 = km.'], 'MC scale', true);
      } }] },
      { num: '19', stem: '', parts: [{ id: '19', level: 'BEG', make: function (r) {
        var th = find(function () { return r.int(35, 125); }, function (x) { return x !== 70 && x % 2 === 0; }, 64), k = r.pick([2, 3, 0.5, 4]);
        var opts = [{ html: D(th * k), why: 'Angles are not multiplied by k: only lengths are.', code: 'e19-k' }, { html: D(q9(th / k)), why: 'Angles don’t change in an enlargement or reduction.', code: 'e19-div' }, { html: D(th + k), why: 'Angles don’t change at all.', code: 'e19-add' }, { html: D(th), right: true }];
        return P.mc(r, 'A design is ' + (k > 1 ? 'enlarged' : 'reduced') + ' with ' + t('k=' + N(k)) + '. An angle of ' + D(th) + ' in the design becomes', opts, 'Lengths are multiplied by k, but angles stay the same: ' + D(th) + '.', ['What happens to angles in similar figures?'], 'MC angle', true);
      } }] },
      { num: '20', stem: '', parts: [{ id: '20', level: 'EMG', make: function (r) {
        var a = find(function () { return r.int(24, 66); }, function (x) { return x !== 45 && Math.abs(x - 45) > 3 && x !== 38; }, 38), o = 90 - a, w1 = o + r.pick([10, -10, 6]);
        if (w1 === a) w1 = o + 12;
        return P.mc(r, 'In △<i>PQR</i>, ∠<i>P</i> = ' + D(a) + ' and ∠<i>Q</i> = ' + D(90) + '. Which triangle <b>must</b> be similar to △<i>PQR</i>?', [
          { html: 'a right triangle with a ' + D(w1) + ' angle', why: 'Its angles are 90°, ' + w1 + '° and ' + (90 - w1) + '°, but △PQR has 90°, ' + a + '° and ' + o + '°.', code: 'q20-near' },
          { html: 'a triangle with angles of ' + D(a) + ' and ' + D(100), why: 'It has no right angle, so its angles don’t match.', code: 'q20-100' },
          { html: 'a right triangle with a ' + D(o) + ' angle', right: true },
          { html: 'a right triangle with two equal acute angles', why: 'Its acute angles are 45° each, not ' + a + '° and ' + o + '°.', code: 'q20-45' }],
          '∠<i>R</i> ' + t('=180^\\circ-90^\\circ-' + a + '^\\circ=' + o + '^\\circ') + ', so a right triangle with a ' + D(o) + ' angle has angles 90°, ' + o + '°, ' + a + '°: AA.', ['Find ∠R first.'], 'MC AA', true);
      } }] },
      { num: '21', stem: '', parts: [{ id: '21', level: 'EMG', make: function (r) {
        var v = find(function () { return { h: r.pick([1.2, 1.4, 1.5, 1.8, 1.6]), s: r.pick([1.5, 2, 2.5, 3, 1.2, 0.9]), S: r.int(8, 20) }; }, function (x) { var H = x.h / x.s * x.S, F = x.s / x.h * x.S; return !(x.h === 1.6 && (x.s === 2 || x.s === 2.4)) && nice(H, 1) && nice(F, 1) && Math.abs(H - F) > 0.5 && Math.abs(H - (x.S - x.h)) > 0.3 && Math.abs(H - (x.S + x.h)) > 0.3 && Math.abs(F - (x.S + x.h)) > 0.3 && Math.abs(F - (x.S - x.h)) > 0.3; }, { h: 1.5, s: 2, S: 12 });
        var H = q9(v.h / v.s * v.S), F = q9(v.s / v.h * v.S);
        return P.mc(r, 'A child ' + U(v.h, 'm') + ' tall casts a ' + U(v.s, 'm') + ' shadow. At the same time, a tree casts a ' + U(v.S, 'm') + ' shadow. The tree is', [
          { html: U(F, 'm'), why: 'Upside down: height ÷ shadow is the same for both, so h = ' + N(v.h) + ' ÷ ' + N(v.s) + ' × ' + v.S + '.', code: 'h21-flip' }, { html: U(H, 'm'), right: true }, { html: U(q9(v.S + v.h), 'm'), why: 'Don’t add: use the ratio height ÷ shadow.', code: 'h21-add' }, { html: U(q9(v.S - v.h), 'm'), why: 'Don’t subtract: use the ratio height ÷ shadow.', code: 'h21-sub' }],
          t('h=' + N(v.h) + '\\div ' + N(v.s) + '\\times ' + v.S + '=' + N(H)) + ' m', ['Height ÷ shadow is the same for the child and the tree.'], 'MC shadow', true);
      } }] },
      { num: '22', stem: '', parts: [{ id: '22', level: 'EMG', make: function (r) {
        var v = find(function () { return { n: r.pick([25, 20, 40, 100]), L: r.pick([2, 3, 4, 2.5, 3.5, 5, 6]) }; }, function (x) { var a = x.L * 100 / x.n; return nice(a, 1) && nice(x.L / x.n, 3) && [a, x.L / x.n, x.L * x.n / 100].every(function (y, i, arr) { return arr.indexOf(y) === i; }); }, { n: 25, L: 3 }), a = q9(v.L * 100 / v.n);
        return P.mc(r, 'On a floor plan with a scale of ' + t('1:' + v.n) + ', a wall ' + U(v.L, 'm') + ' long is drawn', [{ html: U(q9(v.L / v.n), 'cm'), why: 'Change ' + N(v.L) + ' m to centimetres first.', code: 'w22-conv' }, { html: U(q9(v.L * v.n / 100), 'cm'), why: 'Diagram = real ÷ scale number: ' + t(N(v.L * 100) + '\\div ' + v.n) + '.', code: 'w22-mul' }, { html: U(a, 'cm'), right: true }, { html: U(q9(v.L * v.n), 'm'), why: 'Real → plan is a <b>division</b>, and the plan is in cm.', code: 'w22-x' }],
          t(N(v.L) + '\\text{ m}=' + N(v.L * 100) + '\\text{ cm}') + ', and ' + t(N(v.L * 100) + '\\div ' + v.n + '=' + N(a)) + ' cm.', ['Same units first, then diagram = real ÷ scale number.'], 'MC plan', true);
      } }] },
      /* ---------------- Part C ---------------- */
      { num: '23', section: 'Part C: Numerical Response', stem: '', parts: [{ id: '23', level: 'EMG', make: function (r) {
        var v = find(function () { return { a: r.pick([4, 5, 6, 8]), b: r.pick([7, 9, 10, 12, 11]), k: r.pick([1.5, 2.5, 3, 1.2, 3.5]) }; }, function (x) { return x.b > x.a && nice(x.k * x.a, 1) && nice(x.k * x.b, 1) && String(q9(x.k * x.b)).length <= 4; }, { a: 6, b: 9, k: 2.5 });
        var s = q9(v.k * v.a), L = q9(v.k * v.b);
        return lenP('<b>Numerical response.</b> ' + (v.a === 8 ? 'An ' : 'A ') + N(v.a) + ' cm by ' + N(v.b) + ' cm rectangle is enlarged so that its short side is ' + U(s, 'cm') + '. The long side of the enlargement is ____ cm.', L, { nr: true, scale: { len: v.b, k: v.k, op: 'mul' }, alts: [{ v: s + v.b - v.a, code: 'u6l7-add', hint: 'Similar figures multiply, they don’t add: find k = ' + N(s) + ' ÷ ' + v.a + ' first.' }, { v: v.b / v.k, code: 'k-mul-div', hint: 'An enlargement makes the long side <b>longer</b>: multiply by k.' }], sol: t('k=' + N(s) + '\\div ' + v.a + '=' + N(v.k)) + '; long side ' + t('=' + N(v.k) + '\\times ' + v.b + '=' + N(L)) + ' cm', hints: ['Find k from the short sides first.'], text: 'NR long' });
      } }] },
      { num: '24', stem: '', parts: [{ id: '24', level: 'BEG', make: function (r) {
        var v = find(function () { return { d: r.pick([1.5, 2, 2.5, 0.5, 1.2, 0.8, 4]), m: step(r, 3, 9.9, 0.1) }; }, function (x) { return !(x.d === 1.5 && x.m === 8.4) && String(q9(x.d * x.m)).length <= 4 && !nice(x.m, 0); }, { d: 1.5, m: 8.4 }), km = q9(v.d * v.m);
        return lenP('<b>Numerical response.</b> On a map, 1 cm represents ' + U(v.d, 'km') + '. Two towns are ' + U(v.m, 'cm') + ' apart on the map. The real distance is ____ km.', km, { nr: true, alts: [{ v: v.m / v.d, code: 'u6l7-flip', hint: 'Real = map length × ' + N(v.d) + ' km. You divided.' }, { v: v.m + v.d, code: 'u6l7-add', hint: 'Each cm stands for ' + N(v.d) + ' km: multiply.' }], sol: t(N(v.m) + '\\times ' + N(v.d) + '=' + N(km)) + ' km', hints: ['Real = map length × ' + N(v.d) + ' km.'], text: 'NR map' });
      } }] },
      { num: '25', stem: '', parts: [{ id: '25', level: 'EMG', make: function (r) {
        var v = find(function () { return { e: r.pick([1.5, 1.6, 1.7, 1.8]), d1: r.pick([2, 2.5, 1.6, 3, 1.5]), d2: r.int(12, 30) }; }, function (x) { return !(x.e === 1.6 && x.d1 === 2.5 && x.d2 === 20) && x.e / x.d1 * x.d2 < 40; }, { e: 1.6, d1: 2.5, d2: 20 }), h = v.e / v.d1 * v.d2;
        return lenP('<b>Numerical response.</b> Sam’s eyes are ' + U(v.e, 'm') + ' above the ground. He sees the top of a building in a mirror on the ground. He is ' + U(v.d1, 'm') + ' from the mirror, and the mirror is ' + U(v.d2, 'm') + ' from the building. The building is ____ m tall (to the nearest tenth).', h, { nr: true, dp: 1, prop: { given: v.d2, num: v.e, den: v.d1 }, sol: t('h=' + N(v.e) + '\\div ' + N(v.d1) + '\\times ' + v.d2 + toR(h, 1)) + ' m', hints: ['Eye height ÷ (Sam to mirror) = height ÷ (mirror to building).'], text: 'NR mirror' });
      } }] },
      { num: '26', stem: '', parts: [{ id: '26', level: 'PRG', make: function (r) {
        var v = find(function () { return { w: r.pick([4, 5, 6, 8, 3]), k: r.int(10, 30) }; }, function (x) { var tot = x.w * x.k; return tot % 12 !== 0 && tot >= 48 && tot <= 140 && !(x.w === 5 && x.k === 18); }, { w: 5, k: 18 });
        var tot = v.w * v.k, F = Math.floor(tot / 12), I = tot - 12 * F, ftDec = q9(F + I / 12);
        return { prompt: '<b>Numerical response.</b> A picture ' + N(v.w) + ' in wide is projected onto a wall, where it is ' + F + ' ft ' + I + ' in wide. The scale factor of the projection is ____.', input: { type: 'number', nr: true },
          check: (function () { var base = G.kChk(v.k, {}); return function (resp) { var p = HW.parse.number(String(resp).trim()); if (p.ok) { var x = p.value; if (Math.abs(x - (F + I / 10) / v.w) < 0.006 || Math.abs(x - ftDec / v.w) < 0.006 || Math.abs(x - F / v.w) < 0.006) return wrong('u6l7-ft', 'Change ' + F + ' ft ' + I + ' in to <b>inches</b> first: 1 ft = 12 in.'); if (Math.abs(x - (10 * F + I) / v.w) < 0.006) return wrong('u6l7-ft', F + ' ft ' + I + ' in is not ' + (10 * F + I) + ' in: 1 ft = <b>12</b> in, so it is ' + t(F + '\\times 12+' + I) + ' in.'); if (String(resp).replace(/\s/g, '').length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes.'); } return base(resp); }; })(),
          key: String(v.k), answer: t(String(v.k)), solution: 'Same units: ' + F + ' ft ' + I + ' in ' + t('=' + F + '\\times 12+' + I + '=' + tot) + ' in.<br>' + t('k=' + tot + '\\div ' + v.w + '=' + v.k), hints: ['Change the wall width to inches (1 ft = 12 in), then k = new ÷ original.'], text: 'NR ft in',
          bad: [String(q9(rd(ftDec / v.w, 2))), String(q9(rd(1 / v.k, 3)))] };
      } }] }
    ],
    extra: [
      /* ---------------- A. Skills ---------------- */
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Fill in the table. (' + t('k=') + ' new length ÷ original length.)' + kTableStem(sh.rows); },
        shared: function (r) {
          var r1 = find(function () { return { o: r.pick([5, 6, 8, 10, 12]), k: r.pick([0.7, 0.6, 0.4, 0.3, 0.9]) }; }, function (x) { return nice(x.o * x.k, 1); }, { o: 6, k: 0.7 });
          var r2 = { o: step(r, 1.2, 2.8, 0.2), k: r.pick([3, 2, 4, 5]) };
          var r3 = { o: step(r, 2.5, 6.5, 0.5), k: r.pick([2, 3, 1.5, 4]) };
          var r4 = find(function () { return { n: r.pick([3, 4, 5, 6, 2]), k: r.pick([0.25, 0.5, 0.2, 0.75]) }; }, function (x) { return nice(x.n / x.k, 1); }, { n: 4, k: 0.25 });
          return { rows: [{ o: r1.o, n: q9(r1.o * r1.k), k: r1.k, u: 'cm', ask: 'k' }, { o: r2.o, n: q9(r2.o * r2.k), k: r2.k, u: 'm', ask: 'k' }, { o: r3.o, n: q9(r3.o * r3.k), k: r3.k, u: 'cm', ask: 'new' }, { o: q9(r4.n / r4.k), n: r4.n, k: r4.k, u: 'cm', ask: 'orig' }] };
        },
        parts: [
          { id: 'e1a', sub: 'numbers', level: 'EMG', make: function (r, sh) { return kTableNums(sh.rows, 'EMG', 'E k table'); } },
          { id: 'e1b', sub: 'types', level: 'BEG', make: function (r, sh) { return kTableTypes(sh.rows, 'E k types'); } }] },
      { num: '2', stem: function (sh) { return t('\\triangle RST\\sim\\triangle UVW') + '. In △<i>RST</i>, <i>RS</i> = ' + U(sh.rs, 'cm') + ' and <i>ST</i> = ' + U(sh.st, 'cm') + '. In △<i>UVW</i>, <i>UV</i> = ' + U(sh.uv, 'cm') + ' and <i>UW</i> = ' + U(sh.uw, 'cm') + '.'; },
        shared: function (r) { return find(function () { var k = r.pick([0.75, 0.5, 1.5, 0.6, 2.5, 1.25]), rs = r.pick([4, 6, 8, 10, 12]), st = r.pick([6, 10, 14, 16, 12]), rt = r.pick([8, 12, 16, 20, 18]); return { k: k, rs: rs, st: st, rt: rt, uv: q9(k * rs), uw: q9(k * rt), vw: q9(k * st) }; }, function (x) { return x.rs !== x.st && x.st !== x.rt && x.rs !== x.rt && x.rs + x.st > x.rt && x.rs + x.rt > x.st && x.st + x.rt > x.rs && nice(x.uv, 1) && nice(x.uw, 1) && nice(x.vw, 2); }, { k: 0.75, rs: 8, st: 10, rt: 12, uv: 6, uw: 9, vw: 7.5 }); },
        parts: [
          { id: 'e2a', level: 'BEG', make: function () {
            return P.fields('List the three pairs of corresponding sides.', [{ label: '<i>RS</i> ↔', mode: 'text', name: 'RS', placeholder: 'side' }, { label: '<i>ST</i> ↔', mode: 'text', name: 'ST', placeholder: 'side' }, { label: '<i>RT</i> ↔', mode: 'text', name: 'RT', placeholder: 'side' }],
              [segC('UV'), segC('VW'), segC('UW')], ['UV', 'VW', 'UW'], 'RS ↔ UV, ST ↔ VW, RT ↔ UW', 'Match the letters in order: R ↔ U, S ↔ V, T ↔ W.<br><i>RS</i> ↔ <i>UV</i>, <i>ST</i> ↔ <i>VW</i>, <i>RT</i> ↔ <i>UW</i>', ['The 1st letters match, the 2nd letters match, the 3rd letters match.'], 'E corr sides');
          } },
          { id: 'e2b', level: 'EMG', make: function (r, sh) {
            return P.fields('Find the scale factor from △<i>RST</i> to △<i>UVW</i>. Is it an enlargement or a reduction?', [{ label: t('k='), name: 'k' }, { label: 'Type:', mode: 'text', name: 'type', placeholder: 'type' }], [kC(sh.k, { from: { new: sh.uv, orig: sh.rs } }), typeC(sh.k)], [kKey(sh.k), kindOfK(sh.k)], t('k=' + N(sh.k)) + ', ' + kindOfK(sh.k),
              t('k=UV\\div RS=' + N(sh.uv) + '\\div ' + N(sh.rs) + '=' + N(sh.k)) + ', ' + (sh.k < 1 ? 'less than 1: a reduction.' : 'more than 1: an enlargement.'), ['UV and RS are a matching pair you know both of.'], 'E k type');
          } },
          { id: 'e2c', level: 'PRG', make: function (r, sh) {
            return P.fields('Find <i>VW</i> and <i>RT</i>.', [{ label: '<i>VW</i> =', after: 'cm', name: 'VW' }, { label: '<i>RT</i> =', after: 'cm', name: 'RT' }], [lenC(sh.vw, { scale: { len: sh.st, k: sh.k, op: 'mul' } }), lenC(sh.rt, { scale: { len: sh.uw, k: sh.k, op: 'div' } })], [lenKey(sh.vw), lenKey(sh.rt)], U(sh.vw, 'cm') + ', ' + U(sh.rt, 'cm'),
              t('VW=' + N(sh.k) + '\\times ' + N(sh.st) + '=' + N(sh.vw)) + ' cm<br>' + t('RT=UW\\div k=' + N(sh.uw) + '\\div ' + N(sh.k) + '=' + N(sh.rt)) + ' cm', ['VW is on the new triangle: × k. RT is on the original: ÷ k.'], 'E VW RT');
          } }] },
      { num: '3', stem: function (sh) { return 'Three parallelograms are described in the table.' + tableHtml(['Parallelogram', 'Sides', 'Angles'], [['P', U(sh.a, 'cm') + ' and ' + U(sh.b, 'cm'), D(sh.th) + ' and ' + D(180 - sh.th)], ['Q', U(sh.k * sh.a, 'cm') + ' and ' + U(sh.k * sh.b, 'cm'), D(sh.th) + ' and ' + D(180 - sh.th)], ['R', U(sh.k * sh.a, 'cm') + ' and ' + U(sh.k * sh.b, 'cm'), D(sh.th2) + ' and ' + D(180 - sh.th2)]]); },
        shared: function (r) { return find(function () { return { a: r.pick([4, 5, 6, 8]), b: r.pick([6, 7, 9, 10, 12]), k: r.pick([1.5, 2, 2.5, 0.5, 1.25]), th: r.int(55, 80), d: r.pick([4, 5, 6, -4, -5]) }; }, function (x) { x.th2 = x.th + x.d; return x.b > x.a && nice(x.k * x.a, 2) && nice(x.k * x.b, 2) && x.th2 < 89; }, { a: 4, b: 6, k: 1.5, th: 65, d: 5, th2: 70 }); },
        parts: [
          { id: 'e3a', level: 'EMG', make: function (r, sh) {
            return simPart('Is P similar to Q? The angles are the same. Find the side ratios (Q ÷ P), then answer yes or no.', [sh.a, q9(sh.k * sh.a)], [sh.b, q9(sh.k * sh.b)], br(['Angles: the same (' + sh.th + '° and ' + (180 - sh.th) + '°).', 'Sides: ' + t(N(sh.k * sh.a) + '\\div ' + sh.a + '=' + N(sh.k)) + ' and ' + t(N(sh.k * sh.b) + '\\div ' + sh.b + '=' + N(sh.k)) + ', the same ratio.', 'Both tests pass: P and Q are similar (' + t('k=' + N(sh.k)) + ').']), { text: 'E P Q' });
          } },
          { id: 'e3b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Is P similar to R?', [
              { html: '<b>No.</b> The side ratios are both ' + N(sh.k) + ', but the angles are different (' + sh.th + '° vs ' + sh.th2 + '°).', right: true },
              { html: '<b>Yes.</b> The side ratios are the same.', why: 'Equal side ratios are only one test. The angles must match too.', code: 'e3-sides' },
              { html: '<b>Yes.</b> All parallelograms are similar.', why: 'Parallelograms can have different angles and side ratios.', code: 'e3-all' },
              { html: '<b>No.</b> R has different side lengths from P.', why: 'Similar figures can have different side lengths, as long as the ratios are equal. Check the angles.', code: 'e3-len' }],
              'The side ratios pass (both ' + N(sh.k) + '), but the angles fail (' + sh.th + '° vs ' + sh.th2 + '°). Not similar.', ['Check both tests: angles and side ratios.'], 'E P R');
          } },
          { id: 'e3c', level: 'BEG', make: function (r) {
            return P.mc(r, 'Are any two stop signs (regular octagons) similar?', [
              { html: '<b>Yes.</b> Every regular octagon has eight 135° angles and equal sides, so all the side ratios are the same.', right: true },
              { html: '<b>No.</b> Stop signs come in different sizes.', why: 'Different sizes are fine: similar figures can be bigger or smaller.', code: 'e3c-size' },
              { html: '<b>Only if</b> they are the same size.', why: 'Same size would be congruent. Similar allows different sizes.', code: 'e3c-same' },
              { html: '<b>No.</b> Octagons have too many sides to compare.', why: 'Regular polygons with the same number of sides are always similar.', code: 'e3c-many' }],
              'Yes. Regular octagons all have 135° angles and equal sides, so every side ratio is the same.', ['Regular polygons with the same number of sides…'], 'E octagon');
          } }] },
      { num: '4', stem: function (sh) { return 'A park map has a scale of ' + t('1:' + N(sh.n)) + '.'; },
        shared: function (r) { return find(function () { var n = r.pick([30000, 20000, 40000, 25000, 50000, 15000]); return { n: n, p: step(r, 2, 6, 0.5), km: step(r, 1.2, 3, 0.3) }; }, function (x) { return nice(x.km * 1000 / (x.n / 100), 1) && !(x.n === 20000); }, { n: 30000, p: 3.5, km: 1.8 }); },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) {
            var m = sh.n / 100;
            return P.fields('Write the scale in words, using metres.', [{ label: '1 cm represents', after: 'm', name: 'metres' }], [numC(m, [[sh.n, 'u6l7-no-convert', 'That’s in centimetres. Change to metres: ÷ 100.'], [sh.n / 1000, 'u6l7-convert', '100 cm = 1 m: divide by 100.'], [sh.n / 100000, 'u6l7-convert', 'That’s kilometres. The question asks for metres.']])], [String(m)], '1 cm represents ' + U(m, 'm'),
              t(N(sh.n) + '\\text{ cm}=' + N(m) + '\\text{ m}') + ', so 1 cm represents ' + U(m, 'm') + '.', ['cm ÷ 100 = m.'], 'E park words');
          } },
          { id: 'e4b', level: 'EMG', make: function (r, sh) {
            var m = sh.n / 100, v = q9(sh.p * m);
            return lenP('A bike path is ' + U(sh.p, 'cm') + ' long on the map. How long is it really?', v, { unit: 'm', alts: [{ v: sh.p * sh.n, code: 'u6l7-no-convert', hint: 'That’s in centimetres. Give metres.' }, { v: sh.p / m, code: 'u6l7-flip', hint: 'Real = map × ' + N(m) + ' m.' }], sol: t(N(sh.p) + '\\times ' + N(m) + '=' + N(v)) + ' m (' + N(v / 1000) + ' km)', hints: ['Each cm on the map is ' + N(m) + ' m.'], text: 'E bike' });
          } },
          { id: 'e4c', level: 'PRG', make: function (r, sh) {
            var m = sh.n / 100, v = q9(sh.km * 1000 / m);
            return lenP('A pond is really ' + U(sh.km, 'km') + ' long. How long is it on the map?', v, { unit: 'cm', alts: [{ v: sh.km / m, code: 'u6l7-no-convert', hint: 'Change ' + N(sh.km) + ' km to metres first (' + N(sh.km * 1000) + ' m).' }, { v: sh.km * 1000 * m, code: 'u6l7-flip', hint: 'Real → map: <b>divide</b> by ' + N(m) + '.' }, { v: sh.km * 100 / m, code: 'u6l7-convert', hint: '1 km = <b>1000</b> m.' }], sol: t(N(sh.km) + '\\text{ km}=' + N(sh.km * 1000) + '\\text{ m}') + '; ' + t(N(sh.km * 1000) + '\\div ' + N(m) + '=' + N(v)) + ' cm', hints: ['Change km to m, then divide by ' + N(m) + '.'], text: 'E pond' });
          } }] },
      { num: '5', stem: function (sh) { return 'In △<i>ABC</i>, ∠<i>A</i> = ' + D(sh.A) + ' and ∠<i>B</i> = ' + D(sh.B) + '. In △<i>DEF</i>, ∠<i>D</i> = ' + D(sh.dv[0]) + ' and ∠<i>E</i> = ' + D(sh.dv[1]) + '.'; },
        shared: function (r) {
          var a = find(function () { return { A: r.int(28, 60), B: r.int(50, 80) }; }, function (x) { var C = 180 - x.A - x.B; return C >= 30 && x.A !== x.B && C !== x.A && C !== x.B; }, { A: 34, B: 71 });
          a.C = 180 - a.A - a.B; var perm = r.pick([[2, 1, 0], [1, 2, 0], [2, 0, 1], [0, 2, 1]]), v = [a.A, a.B, a.C];
          a.perm = perm; a.dv = perm.map(function (i) { return v[i]; }); a.v = v; return a;
        },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, sh) {
            var F = sh.dv[2];
            return P.fields('Find ∠<i>C</i> and ∠<i>F</i>. Are the triangles similar?', [{ label: '∠<i>C</i> =', after: '°', name: '∠C' }, { label: '∠<i>F</i> =', after: '°', name: '∠F' }, { label: 'Similar?', mode: 'text', name: 'Similar', placeholder: 'yes/no' }],
              [G.angleChk(sh.C, { supplementTrap: false, alts: [{ v: 360 - sh.A - sh.B, code: 'u6l7-third', hint: 'A triangle’s angles add to 180°.' }] }), G.angleChk(F, { supplementTrap: false, alts: [{ v: 360 - sh.dv[0] - sh.dv[1], code: 'u6l7-third', hint: 'A triangle’s angles add to 180°.' }] }), yesNoC(true, 'Compare all three angles of each triangle: ' + sh.v.join('°, ') + '° and ' + sh.dv.join('°, ') + '°.')],
              [String(sh.C), String(F), 'yes'], '∠C = ' + sh.C + '°, ∠F = ' + F + '°, similar',
              '∠<i>C</i> ' + t('=180^\\circ-' + sh.A + '^\\circ-' + sh.B + '^\\circ=' + sh.C + '^\\circ') + ' and ∠<i>F</i> ' + t('=180^\\circ-' + sh.dv[0] + '^\\circ-' + sh.dv[1] + '^\\circ=' + F + '^\\circ') + '.<br>All the angles match, so yes, they are similar (AA).', ['Angles in a triangle add to 180°.'], 'E AA yes');
          } },
          { id: 'e5b', level: 'PRG', make: function (r, sh) {
            var want = [0, 1, 2].map(function (i) { return 'DEF'.charAt(sh.perm.indexOf(i)); }).join('');
            return P.fields('Name them in matching order.', [{ label: '△<i>ABC</i> ∼ △', mode: 'text', name: 'name', placeholder: 'letters' }], [triC(want)], [want], '△ABC ∼ △' + want,
              [0, 1, 2].map(function (i) { return 'ABC'.charAt(i) + ' ↔ ' + want.charAt(i) + ' (' + sh.v[i] + '°)'; }).join(', ') + '<br>△<i>ABC</i> ∼ △<i>' + want + '</i>', ['Find ∠C and ∠F first. Then match each angle of △ABC with the equal angle of △DEF.'], 'E name');
          } }] },
      /* ---------------- B. Applying ---------------- */
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'Enlarge the shape with a scale factor of ' + N(sh.k) + '. (Each square is 1 unit.) Instead of drawing it, give the lengths of the copy.' + sh.svg; },
        shared: function (r) {
          var c = r.pick([[4, 4, 2, 2], [6, 4, 2, 2], [4, 6, 2, 2], [6, 6, 2, 2], [6, 4, 2, 4], [4, 6, 4, 2]]), k = r.pick([1.5, 1.5, 2]);
          var B = c[0], Lh = c[1], R = c[2], T = c[3], dx = B - T, dy = Lh - R;   // bottom, left side, right side, top; slant dx across, dy up
          var pts = [[0, 0], [B, 0], [B, R], [T, Lh], [0, Lh]];
          return { B: B, Lh: Lh, R: R, T: T, dx: dx, dy: dy, k: k, svg: G.gridSVG({ cols: B + 2, rows: Lh + 2, cell: 22, pts: pts, at: [1, 1], image: false, width: 260 }) };
        },
        parts: [{ id: 'e6', level: 'EMG', make: function (r, sh) {
          var k = sh.k, vals = [sh.B, sh.Lh, sh.R, sh.T, sh.dx, sh.dy], names = ['Bottom', 'Left side', 'Right side', 'Top', 'Slanted side: across', '… and up'], w = vals.map(function (x) { return q9(k * x); });
          var g = function (i) { return numC(w[i], [[vals[i], 'u6l7-grid', 'That’s the original length. Multiply by ' + N(k) + '.'], [vals[i] + k, 'u6l7-add', 'Don’t add k: multiply by it.'], [vals[i] + 2, 'u6l7-add', 'Multiply by ' + N(k) + ', don’t add.']]); };
          return P.fields('The copy (squares):', names.map(function (n) { return { label: n + ':', after: 'squares', name: n }; }), [0, 1, 2, 3, 4, 5].map(g), w.map(nS), names.map(function (n, i) { return n + ' ' + w[i]; }).join(', '),
            'Multiply every length by ' + N(k) + ': ' + names.slice(0, 4).map(function (n, i) { return n.toLowerCase() + ' ' + t(vals[i] + '\\to ' + N(w[i])); }).join(', ') + '.<br>The slanted side goes ' + sh.dx + ' across and ' + sh.dy + ' up, so it becomes ' + N(w[4]) + ' across and ' + N(w[5]) + ' up. The angles stay the same.', ['Count each side in squares, then multiply by ' + N(k) + '.'], 'E grid');
        } }] },
      { num: '7', stem: function (sh) { return 'A school banner is ' + U(sh.w, 'm') + ' by ' + U(sh.l, 'm') + '. The team wants a small copy for each player, using a scale factor of ' + N(sh.k) + '.'; },
        shared: function (r) { return find(function () { return { w: r.pick([1.2, 1, 0.8, 1.5]), l: r.pick([2, 1.8, 2.4, 3]), k: r.pick([0.35, 0.25, 0.3, 0.2, 0.15]) }; }, function (x) { return x.l > x.w && nice(x.k * x.w * 100, 1) && nice(x.k * x.l * 100, 1) && !(x.w === 1.2 && x.l === 2 && x.k === 0.35); }, { w: 1.2, l: 2, k: 0.25 }); },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) {
            var a = q9(sh.k * sh.w * 100), b = q9(sh.k * sh.l * 100), ch = function (v, m) { return lenC(v, { alts: [{ v: sh.k * m, code: 'u6l7-no-convert', hint: 'That’s in <b>metres</b>. Change to centimetres (× 100).' }, { v: m * 100 / sh.k, code: 'k-mul-div', hint: 'A copy with k < 1 is smaller: multiply by k.' }] }); };
            return P.fields('Find the size of the small copy in centimetres.', [{ label: 'Width:', after: 'cm', name: 'width' }, { label: 'Length:', after: 'cm', name: 'length' }], [ch(a, sh.w), ch(b, sh.l)], [lenKey(a), lenKey(b)], U(a, 'cm') + ' by ' + U(b, 'cm'),
              'Same units: ' + U(sh.w * 100, 'cm') + ' by ' + U(sh.l * 100, 'cm') + '.<br>' + t(N(sh.k) + '\\times ' + N(sh.w * 100) + '=' + N(a)) + ' cm; ' + t(N(sh.k) + '\\times ' + N(sh.l * 100) + '=' + N(b)) + ' cm', ['Change metres to centimetres, then multiply by k.'], 'E banner');
          } },
          { id: 'e7b', level: 'BEG', make: function (r, sh) {
            var a = q9(sh.k * sh.w * 100), b = q9(sh.k * sh.l * 100);
            return P.mc(r, 'Which check shows that the copy is similar to the banner?', [
              { html: 'All the corners are 90°, and ' + t(N(a) + '\\div ' + N(sh.w * 100) + '=' + N(sh.k)) + ' and ' + t(N(b) + '\\div ' + N(sh.l * 100) + '=' + N(sh.k)) + ': the same ratio.', right: true },
              { html: 'The copy is smaller than the banner.', why: 'Being smaller doesn’t make it similar: the side ratios must be equal.', code: 'e7-small' },
              { html: 'Both are rectangles, so they are similar.', why: 'Rectangles aren’t always similar. Check the side ratios.', code: 'e7-rect' },
              { html: t(N(sh.l * 100) + '-' + N(b) + '=' + N(sh.l * 100 - b)) + ' and ' + t(N(sh.w * 100) + '-' + N(a) + '=' + N(sh.w * 100 - a)) + '.', why: 'Similar figures have equal <b>ratios</b>, not equal differences.', code: 'e7-diff' }],
              'All corners are 90°, and both side ratios are ' + N(sh.k) + ' ✓', ['Similar: equal angles and equal side ratios.'], 'E banner check');
          } }] },
      { num: '8', stem: function (sh) { return 'Dana is drawing a plan of a deck that is ' + U(sh.L, 'm') + ' long and ' + U(sh.W, 'm') + ' wide. The space on her page is ' + U(sh.pw, 'cm') + ' by ' + U(sh.ph, 'cm') + '.'; },
        shared: function (r) {
          return find(function () { var S = r.pick([[40, 50, 100], [20, 25, 50], [25, 50, 100], [40, 50, 80]]); return { S: S, L: step(r, 3, 6.4, 0.2), W: step(r, 2.4, 4.4, 0.2), pw: r.pick([10, 12, 15, 9, 8]), ph: r.pick([8, 6, 10, 7]) }; },
            function (x) { if (x.W >= x.L || x.ph >= x.pw) return false; var fits = x.S.map(function (s) { return x.L * 100 / s <= x.pw && x.W * 100 / s <= x.ph; }); x.fits = fits; x.best = fits.indexOf(true); return !fits[0] && x.best >= 1 && !(x.L === 4.8 && x.W === 3.6) && x.S.every(function (s) { return nice(x.L * 100 / s, 2) && nice(x.W * 100 / s, 2); }); }, null) || { S: [40, 50, 100], L: 4.8, W: 3.6, pw: 10, ph: 8, fits: [false, true, true], best: 1 };
        },
        parts: [
          { id: 'e8a', level: 'PRG', make: function (r, sh) {
            var sz = sh.S.map(function (s) { return [q9(sh.L * 100 / s), q9(sh.W * 100 / s)]; }), b = sh.best;
            var opts = sh.S.map(function (s, i) {
              var d = t('1:' + s) + ' (' + N(sz[i][0]) + ' cm by ' + N(sz[i][1]) + ' cm)';
              if (i === b) return { html: d + ': it fits and it is the biggest drawing that fits.', right: true };
              if (!sh.fits[i]) return { html: d + (i === 0 ? ': it makes the biggest drawing.' : ': it makes a bigger drawing than ' + t('1:' + sh.S[b]) + '.'), why: 'At ' + t('1:' + s) + ' the drawing is ' + N(sz[i][0]) + ' cm by ' + N(sz[i][1]) + ' cm: too big for the ' + sh.pw + ' cm by ' + sh.ph + ' cm space.', code: 'd8-big' };
              return { html: d + ': it fits.', why: 'It fits, but it is smaller than the drawing at ' + t('1:' + sh.S[b]) + ', which also fits.', code: 'd8-small' };
            });
            opts.push({ html: 'Any of them: the scale doesn’t change the drawing size.', why: 'A bigger scale number makes a smaller drawing. Work out each size.', code: 'd8-any' });
            return P.mc(r, 'Which scale fits best? (Change to centimetres and work out the drawing size at each scale.)', opts,
              'Deck: ' + U(sh.L * 100, 'cm') + ' by ' + U(sh.W * 100, 'cm') + '.<br>' + sh.S.map(function (s, i) { return t('1:' + s) + ': ' + N(sz[i][0]) + ' cm by ' + N(sz[i][1]) + ' cm (' + (sh.fits[i] ? (i === b ? 'fits' : 'fits, but small') : 'too big') + ')'; }).join('<br>') + '<br>' + t('1:' + sh.S[b]) + ' is the biggest drawing that fits.', ['Drawing = real ÷ scale number. Check each one against the space on the page.'], 'E deck scale', true);
          } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) {
            var s = sh.S[sh.best], st = r.pick([1.2, 1, 1.5, 0.9, 1.6]), v = q9(st * 100 / s);
            return lenP('Dana uses the scale ' + t('1:' + s) + '. The stairs are ' + U(st, 'm') + ' wide. How wide are they on her plan?', v, { unit: 'cm', dp: Math.max(1, places(v)), alts: [{ v: st / s, code: 'u6l7-no-convert', hint: 'Change ' + N(st) + ' m to centimetres first.' }, { v: st * s, code: 'u6l7-flip', hint: 'Real → plan: divide by ' + s + '.' }], sol: t(N(st * 100) + '\\div ' + s + '=' + N(v)) + ' cm', hints: ['Plan = real (in cm) ÷ ' + s + '.'], text: 'E stairs' });
          } }] },
      { num: '9', stem: function (sh) { return 'Before cutting down a dead tree, a worker wants to know if it could hit a shed ' + U(sh.d, 'm') + ' away. The worker is ' + U(sh.h, 'm') + ' tall and casts a ' + U(sh.s, 'm') + ' shadow. At the same time, the tree casts a ' + U(sh.S, 'm') + ' shadow.'; },
        shared: function (r) { return find(function () { var h = r.pick([1.75, 1.6, 1.8, 1.5, 1.7]), s = r.pick([1.25, 1, 2, 1.2, 1.5, 0.8]), S = r.int(6, 14); return { h: h, s: s, S: S, H: q9(h / s * S), d: 0 }; }, function (x) { if (!nice(x.H, 2) || x.H < 7 || x.H > 22 || (x.h === 1.75 && x.s === 1.25 && x.S === 10)) return false; x.d = Math.ceil(x.H) + (x.H % 1 < 0.3 ? 1 : 0); return x.d - x.H >= 0.5 && x.d - x.H <= 1.6; }, { h: 1.75, s: 1.25, S: 10, H: 14, d: 15 }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) {
            return lenP('How tall is the tree?', sh.H, { unit: 'm', prop: { given: sh.S, num: sh.h, den: sh.s }, sol: t('\\dfrac{h}{' + sh.S + '}=\\dfrac{' + N(sh.h) + '}{' + N(sh.s) + '}') + '<br>' + t('h=' + N(sh.h) + '\\div ' + N(sh.s) + '\\times ' + sh.S + '=' + N(sh.H)) + ' m', hints: ['Height ÷ shadow is the same for the worker and the tree.'], text: 'E tree' });
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) {
            var gap = q9(sh.d - sh.H);
            return P.mc(r, 'The tree is ' + U(sh.H, 'm') + ' tall. Can it reach the shed if it falls toward it?', [
              { html: '<b>No</b>, ' + N(sh.H) + ' m is less than ' + sh.d + ' m. But there is only ' + N(gap) + ' m to spare and the measurements are not exact, so it is safer to fall it in another direction.', right: true },
              { html: '<b>Yes</b>, a tree always reaches farther than its height.', why: 'A falling tree reaches about its height. Compare ' + N(sh.H) + ' m with ' + sh.d + ' m.', code: 't9-yes' },
              { html: '<b>No</b>, so there is nothing to worry about.', why: 'With only ' + N(gap) + ' m to spare, small measuring errors (or the tree sliding) could matter.', code: 't9-safe' },
              { html: '<b>Yes</b>, because the tree’s shadow is longer than the worker’s.', why: 'Use the tree’s height, not its shadow.', code: 't9-shadow' }],
              N(sh.H) + ' m < ' + sh.d + ' m, so it shouldn’t reach. But there is only ' + N(gap) + ' m to spare, so the worker might still want more room.', ['Compare the tree’s height with the distance to the shed.'], 'E shed');
          } }] },
      { num: '10', stem: function (sh) { return 'A loading ramp for a lawn tractor rises from the ground at <i>A</i> to a trailer deck at <i>B</i>. A support post <i>DE</i> stands straight up, ' + U(sh.ad, 'm') + ' from <i>A</i>, and is ' + U(sh.de, 'm') + ' tall. Point <i>C</i> is on the ground right below <i>B</i>, ' + U(sh.ac, 'm') + ' from <i>A</i>.' + rampSVG(sh.ad, sh.de, sh.ac); },
        shared: function (r) { return find(function () { var ad = r.pick([1.2, 1.6, 1.5, 2, 0.8]), k = r.pick([3, 2.5, 4, 2]); return { ad: ad, k: k, ac: q9(ad * k), de: r.pick([0.2, 0.25, 0.3, 0.15, 0.24]) }; }, function (x) { return nice(x.k * x.de, 2) && x.ac <= 6 && !(x.ad === 1.6 && x.de === 0.2 && x.k === 3); }, { ad: 1.2, k: 3, ac: 3.6, de: 0.25 }); },
        parts: [
          { id: 'e10a', level: 'BEG', make: function (r) {
            return P.mc(r, 'Why is △<i>ADE</i> ∼ △<i>ACB</i>?', [
              { html: 'Both have a right angle (at <i>D</i> and at <i>C</i>), and they share ∠<i>A</i>. Two pairs of equal angles (AA).', right: true },
              { html: 'They are both on the ground.', why: 'Look for two pairs of equal angles.', code: 'r10-ground' },
              { html: 'The post is shorter than the ramp.', why: 'Lengths don’t prove similarity: look at the angles.', code: 'r10-short' },
              { html: '<i>AD</i> is part of <i>AC</i>.', why: 'True, but the reason they are similar is the angles: a right angle and the shared ∠A.', code: 'r10-part' }],
              'Both triangles have a right angle (<i>D</i> and <i>C</i>) and they share ∠<i>A</i>: similar (AA).', ['Which angles do the two triangles share?'], 'E ramp why');
          } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) {
            var bc = q9(sh.k * sh.de);
            return lenP('How high is the trailer deck, <i>BC</i>?', bc, { unit: 'm', dp: Math.max(1, places(bc)), scale: { len: sh.de, k: sh.k, op: 'mul' }, prop: { given: sh.de, num: sh.ac, den: sh.ad }, sol: t('k=AC\\div AD=' + N(sh.ac) + '\\div ' + N(sh.ad) + '=' + N(sh.k)) + '<br>' + t('BC=' + N(sh.k) + '\\times ' + N(sh.de) + '=' + N(bc)) + ' m', hints: ['BC matches DE. Find k = AC ÷ AD.'], text: 'E deck' });
          } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return { a: r.pick([4, 5, 6, 8]), b: r.pick([6, 8, 10, 12]), k: r.pick([6, 4, 8, 3, 9]) }; }, function (x) { return x.b > x.a && (x.k * x.a) % 6 === 0 && (x.k * x.b) % 6 === 0 && !(x.a === 5 && x.b === 8 && x.k === 6) && x.k * x.a - x.a !== x.k; }, { a: 4, b: 6, k: 6 });
        var A = v.k * v.a, B = v.k * v.b, fa = q9(A / 12), fb = q9(B / 12);
        return P.mc(r, (v.a === 8 ? 'An ' : 'A ') + v.a + ' in by ' + v.b + ' in photo is enlarged to a poster ' + N(fa) + ' ft by ' + N(fb) + ' ft. The scale factor is', [
          { html: N(q9(fa / v.a)), why: 'Change feet to inches first (1 ft = 12 in).', code: 'f11-ft' }, { html: t('\\frac{1}{' + v.k + '}'), why: 'Upside down: k = new ÷ original.', code: 'f11-flip' }, { html: String(v.k), right: true }, { html: String(A - v.a), why: 'That’s a difference. k is a division.', code: 'f11-diff' }],
          'Same units: ' + N(fa) + ' ft = ' + A + ' in and ' + N(fb) + ' ft = ' + B + ' in.<br>' + t(A + '\\div ' + v.a + '=' + v.k) + ' and ' + t(B + '\\div ' + v.b + '=' + v.k), ['1 ft = 12 in.'], 'E ft k', true);
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'EMG', make: function (r) {
        var v = find(function () { return { n: r.pick([24, 18, 25, 20, 32, 16]), m: step(r, 3.2, 5.2, 0.04) }; }, function (x) { var a = x.m * 100 / x.n; return nice(a, 1) && String(q9(a)).length <= 4 && !(x.n === 24 && Math.abs(x.m - 4.56) < 1e-9); }, { n: 24, m: 4.8 }), a = q9(v.m * 100 / v.n);
        return lenP('<b>Numerical response.</b> A model car is built at a scale of ' + t('1:' + v.n) + '. The real car is ' + U(v.m, 'm') + ' long. The model is ____ cm long.', a, { nr: true, alts: [{ v: v.m / v.n, code: 'u6l7-no-convert', hint: 'Change ' + N(v.m) + ' m to centimetres first.' }, { v: v.m * v.n, code: 'u6l7-flip', hint: 'The model is smaller: divide by ' + v.n + '.' }], sol: t(N(v.m) + '\\text{ m}=' + N(v.m * 100) + '\\text{ cm}') + '; ' + t(N(v.m * 100) + '\\div ' + v.n + '=' + N(a)) + ' cm', hints: ['Same units first: m → cm.'], text: 'E model' });
      } }] },
      /* ---------------- C. Stretch ---------------- */
      { num: '13', section: 'C. Stretch', stem: '', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
        var v = find(function () { return { H: r.pick([18, 15, 20, 12, 24]), D: r.pick([24, 20, 30, 16, 25]), e: r.pick([1.65, 1.5, 1.8, 1.6, 1.75]) }; }, function (x) { var d = x.e / x.H * x.D; return d > 1 && d < 4 && !(x.H === 18 && x.D === 24 && x.e === 1.65); }, { H: 15, D: 20, e: 1.5 }), d = v.e / v.H * v.D;
        return lenP('A building is ' + U(v.H, 'm') + ' tall. Erin puts a mirror on the ground ' + U(v.D, 'm') + ' from the building. Her eyes are ' + U(v.e, 'm') + ' above the ground. How far from the mirror must she stand to see the top of the building in it? (Nearest tenth of a metre.)', d, { dp: 1, unit: 'm', prop: { given: v.D, num: v.e, den: v.H }, alts: [{ v: v.H / v.e * v.D, code: 'u6l7-flip', hint: 'She must stand much closer than the building is. Eye height ÷ her distance = building ÷ its distance, so d = ' + N(v.e) + ' ÷ ' + v.H + ' × ' + v.D + '.' }, { v: v.e * v.H / v.D, code: 'u6l7-flip', hint: 'Set it up as (you to mirror) ÷ (mirror to building) = eye height ÷ building height.' }],
          sol: t('\\dfrac{d}{' + v.D + '}=\\dfrac{' + N(v.e) + '}{' + v.H + '}') + '<br>' + t('d=' + N(v.e) + '\\div ' + v.H + '\\times ' + v.D + toR(d, 1)) + ' m<br>Check: ' + t(N(v.e) + '\\div ' + N(rd(d, 1)) + '\\approx ' + N(rd(v.e / rd(d, 1), 2))) + ' and ' + t(v.H + '\\div ' + v.D + '\\approx ' + N(rd(v.H / v.D, 2))) + ' ✓', hints: ['The small triangle (Erin) and the big one (the building) are similar: her distance ÷ ' + v.D + ' = ' + N(v.e) + ' ÷ ' + v.H + '.'], text: 'E mirror back' });
      } }] },
      { num: '14', stem: function (sh) { return 'A floor plan has a scale of ' + t('1:' + sh.n) + '. A bedroom is ' + U(sh.a, 'cm') + ' by ' + U(sh.b, 'cm') + ' on the plan.'; },
        shared: function (r) { return find(function () { return { n: r.pick([80, 60, 40, 50, 75]), a: r.pick([5, 6, 7, 8, 4.5]), b: r.pick([4, 5, 3.5, 6]) }; }, function (x) { return x.a > x.b && nice(x.a * x.n / 100 * x.b * x.n / 100, 2) && !(x.n === 80 && x.a === 5 && x.b === 4); }, { n: 60, a: 6, b: 5 }); },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) {
            var L = q9(sh.a * sh.n / 100), W = q9(sh.b * sh.n / 100), A = q9(L * W);
            return P.fields('Find the real length and width of the room, and its real area in square metres.', [{ label: 'Length:', after: 'm', name: 'length' }, { label: 'Width:', after: 'm', name: 'width' }, { label: 'Area:', after: t('\\text{m}^2'), name: 'area' }],
              [lenC(L, { alts: [{ v: sh.a * sh.n, code: 'u6l7-no-convert', hint: 'That’s in cm. Change to metres.' }] }), lenC(W, { alts: [{ v: sh.b * sh.n, code: 'u6l7-no-convert', hint: 'That’s in cm. Change to metres.' }] }), lenC(A, { alts: [{ v: sh.a * sh.b * sh.n, code: 'u6l7-area-k', hint: 'Find the real length and width first, then multiply them.' }, { v: 2 * (L + W), code: 'u6l7-perim', hint: 'That’s the perimeter. Area = length × width.' }, { v: sh.a * sh.b * sh.n * sh.n, code: 'u6l7-no-convert', hint: 'That’s in cm². Give m².' }] })],
              [lenKey(L), lenKey(W), lenKey(A)], U(L, 'm') + ' by ' + U(W, 'm') + ', ' + t(N(A) + '\\text{ m}^2'),
              t(sh.a + '\\times ' + sh.n + '=' + N(sh.a * sh.n) + '\\text{ cm}=' + N(L) + '\\text{ m}') + '; ' + t(sh.b + '\\times ' + sh.n + '=' + N(sh.b * sh.n) + '\\text{ cm}=' + N(W) + '\\text{ m}') + '<br>Area: ' + t(N(L) + '\\times ' + N(W) + '=' + N(A) + '\\text{ m}^2'), ['Real length = plan × ' + sh.n + ' (in cm), then change to metres.'], 'E real area');
          } },
          { id: 'e14b', level: 'MAS', make: function (r, sh) {
            var Acm = sh.a * sh.b * sh.n * sh.n, Ap = sh.a * sh.b, kk = sh.n * sh.n, Am = q9(Acm / 10000);
            return P.fields('The area on the plan is ' + t(sh.a + '\\times ' + sh.b + '=' + N(Ap)) + ' cm². How many times bigger is the real area? (Change the real area to cm² first: 1 m² = 10 000 cm².)', [{ label: 'Real area:', after: t('\\text{cm}^2'), name: 'real area' }, { label: 'Times bigger:', name: 'times' }],
              [numC(Acm, [[Am, 'u6l7-no-convert', 'That’s in m². Change to cm²: × 10 000.'], [Am * 100, 'u6l7-convert', '1 m² = 100 cm × 100 cm = <b>10 000</b> cm².']]), numC(kk, [[sh.n, 'u6l7-area-k', 'The lengths grow by ' + sh.n + ', but the area grows by ' + t(sh.n + '\\times ' + sh.n) + '.'], [q9(Am / Ap), 'u6l7-no-convert', 'Use the same units: the real area in <b>cm²</b> ÷ the plan area in cm².'], [Am * 100 / Ap, 'u6l7-convert', '1 m² = 10 000 cm².']])],
              [String(Acm), String(kk)], HW.fmt(String(Acm)) + ' cm²; ' + HW.fmt(String(kk)) + ' times',
              t(N(Am) + '\\text{ m}^2=' + N(Am) + '\\times 10\\,000=' + N(Acm) + '\\text{ cm}^2') + '<br>' + t(N(Acm) + '\\div ' + N(Ap) + '=' + N(kk)) + '<br>' + t(sh.n + '\\times ' + sh.n + '=' + N(kk)) + ': the area grows by ' + t('k\\times k') + ', not by k.', ['Real area in cm² ÷ plan area in cm².'], 'E area k²');
          } }] },
      { num: '15', stem: function (sh) { return 'Ken is ' + U(sh.h, 'm') + ' tall and casts a ' + U(sh.s, 'm') + ' shadow. A flagpole’s shadow is ' + U(sh.S, 'm') + '. Ken writes ' + t('\\dfrac{h}{' + N(sh.h) + '}=\\dfrac{' + N(sh.s) + '}{' + N(sh.S) + '}') + ' and gets ' + t('h=' + N(rd(sh.h * sh.s / sh.S, 2))) + ' m.'; },
        shared: function (r) { return find(function () { return { h: r.pick([1.8, 1.6, 1.5, 1.7]), s: r.pick([1.2, 0.8, 1, 1.5, 2]), S: r.pick([6, 8, 9, 10, 12, 7.5]) }; }, function (x) { return x.S > x.s * 3 && nice(x.h * x.S / x.s, 1) && nice(x.h * x.s / x.S, 2) && !(x.h === 1.8 && x.s === 1.2 && x.S === 6); }, { h: 1.6, s: 0.8, S: 6 }); },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r) {
            return P.mc(r, 'What did Ken do wrong?', [
              { html: 'He mixed up the ratios: he put the flagpole’s height over his height, but his shadow over the flagpole’s shadow. The answer can’t be right: a flagpole isn’t shorter than Ken.', right: true },
              { html: 'He should have added the shadows instead of dividing.', why: 'Similar triangles use a proportion, not a sum.', code: 'k15-add' },
              { html: 'Nothing: his proportion is right, he just rounded wrongly.', why: 'Check the answer: is a flagpole really shorter than Ken? The proportion is upside down on one side.', code: 'k15-round' },
              { html: 'He should have used the flagpole’s shadow as its height.', why: 'Height and shadow aren’t equal. Keep each ratio in the same order.', code: 'k15-shadow' }],
              'One side is flagpole ÷ Ken, the other is Ken ÷ flagpole. Keep the same order on both sides: ' + t('\\dfrac{h}{\\text{Ken}}=\\dfrac{\\text{pole shadow}}{\\text{Ken’s shadow}}') + '.', ['Is the answer reasonable? Check the order in each ratio.'], 'E Ken why');
          } },
          { id: 'e15b', level: 'MAS', make: function (r, sh) {
            var H = q9(sh.h * sh.S / sh.s);
            return lenP('Fix Ken’s proportion. How tall is the flagpole?', H, { unit: 'm', prop: { given: sh.S, num: sh.h, den: sh.s }, alts: [{ v: sh.h * sh.s / sh.S, code: 'u6l7-flip', hint: 'That’s Ken’s answer. Put the flagpole’s shadow over Ken’s shadow.' }], sol: 'Correct: ' + t('\\dfrac{h}{' + N(sh.h) + '}=\\dfrac{' + N(sh.S) + '}{' + N(sh.s) + '}') + '<br>' + t('h=' + N(sh.h) + '\\times ' + N(sh.S) + '\\div ' + N(sh.s) + '=' + N(H)) + ' m. The flagpole is ' + U(H, 'm') + ' tall.', hints: ['Flagpole ÷ Ken = flagpole’s shadow ÷ Ken’s shadow.'], text: 'E Ken fix' });
          } }] }
    ]
  });
})(window);
