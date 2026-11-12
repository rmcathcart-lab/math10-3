/* Math 10-3 · Unit 5 · Lesson 5 — Copying and Bisecting Angles; Perpendicular Lines (G6 copy/bisect, G5 perpendicular/sorting)
 * Assignment 5 (u5_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u5_ep05.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the booklet item's idea and difficulty with new numbers (the lesson's worked-example numbers
 * are left out). Calculator allowed. Angles are typed with or without the ° sign (HW.geo.angleChk); protractor readings
 * accept ±1° (they are a one-box "fields" input, so the ±1 doesn't clash with the generator test).
 * Conversions (paper → digital):
 *   fill in the blank from a word list → a grid (one word per sentence);  bisect tables → labelled boxes, the table in the
 *   prompt;  "measure with a protractor" → a protractor laid on the angle (HW.geo.protractorSVG), read ±1°;
 *   "copy with a protractor" → choose the correct picture of the copy;  compass constructions (copy, bisect,
 *   perpendicular through a point, 45°) → order-the-steps, plus "what width / what will each half be?" multiple choice or
 *   boxes;  "construct the perpendicular bisector, measure" → boxes for CM, MD and the angle + a compass-width MC;
 *   "construct a perpendicular through K" → order the steps + choose the picture that is perpendicular through K;
 *   sort lines as parallel / perpendicular / neither (give a reason) → a grid over a drawn set of lines + a reason MC for
 *   the pair that only meets when extended;  "explain" / "is that enough?" / "find her mistake" → MC of reasons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, GP = G.P;

  /* ================= small helpers ================= */
  var RAD = Math.PI / 180, INK = '#1d2633', GREY = '#8a909c', BLUE = '#1f5bd6', RED = '#c93a33';
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function f1(v) { var r = Math.round(v * 10) / 10; return String(r); }
  function nS(v) { return String(q(v)); }
  function Dg(v) { return f1(v) + '°'; }                  // plain text 47°
  function T(v) { return t(f1(v) + '^\\circ'); }            // KaTeX 47°
  function find(gen, test, fb) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function range(a, b, s) { var o = []; for (var x = a; x <= b + 1e-9; x += (s || 1)) o.push(q(x)); return o; }
  function not(arr, bad) { return arr.filter(function (x) { return bad.indexOf(x) < 0; }); }
  var TD = 'border:1px solid #c9b79c;padding:4px 10px;text-align:center';
  function table(rows) {
    return '<table style="border-collapse:collapse;margin:6px 0">' + rows.map(function (r, i) {
      return '<tr>' + r.map(function (c, j) { var tag = i === 0 || j === 0 ? 'th' : 'td'; return '<' + tag + ' style="' + TD + (tag === 'th' ? ';background:#f6efe3' : '') + '">' + c + '</' + tag + '>'; }).join('') + '</tr>';
    }).join('') + '</table>';
  }
  function poly(n) { var sum = (n - 2) * 180, c = sum / n; return { sum: sum, corner: c, cut: c / 2, saw: 90 - c / 2 }; }
  var PNAME = { 3: 'equilateral triangle', 4: 'square', 5: 'regular pentagon', 8: 'regular octagon', 9: 'regular nonagon', 10: 'regular decagon', 12: 'regular dodecagon', 15: 'regular 15-gon', 18: 'regular 18-gon', 20: 'regular 20-gon' };

  /* an angle box checker (no protractor "other scale" message unless asked) */
  function ang(deg, o) { o = o || {}; return G.angleChk(deg, { tol: o.tol || 0, supplementTrap: o.trap == null ? false : o.trap, reflex: o.reflex, alts: cleanAlts(o.alts, deg, o.tol) }); }
  function cleanAlts(alts, deg, tol) {
    var seen = [];
    return (alts || []).filter(function (a) {
      if (!a || !isFinite(a.v) || Math.abs(a.v - deg) <= (tol || 0) + 1e-9 || seen.some(function (s) { return Math.abs(s - a.v) < 1e-9; })) return false;
      seen.push(a.v); return true;
    });
  }
  /* one angle answer (number box) */
  function angPart(prompt, deg, o) {
    o = o || {};
    var p = GP.angle(prompt, deg, { sol: o.sol, hints: o.hints, text: o.text, supplementTrap: o.trap == null ? false : o.trap, alts: cleanAlts(o.alts, deg, 0), nr: o.nr });
    p.bad = cleanAlts(o.alts, deg, 0).map(function (a) { return f1(a.v); });
    return p;
  }
  /* several angle boxes: rows [{label, name, deg, tol, alts, trap}] */
  function angBoxes(prompt, rows, sol, hints, text) {
    return P.fields(prompt, rows.map(function (rw) { return { label: rw.label, after: rw.after == null ? '°' : rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }),
      rows.map(function (rw) { return rw.check || ang(rw.deg, rw); }), rows.map(function (rw) { return rw.key || f1(rw.deg); }),
      rows.map(function (rw) { return rw.label + ' ' + (rw.ans || T(rw.deg)); }).join(' &nbsp; '), sol, hints, text);
  }
  /* a length in cm */
  function lenChk(v, alts) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').replace(/\s*(cm|centimet(re|er)s?)\.?\s*$/i, '').trim();
      if (!s) return form('empty', 'Type your answer first.');
      if (/^\d+,\d+$/.test(s)) return form('geo-comma', 'Use a decimal <b>point</b>, not a comma.');
      var p = HW.parse.number(s); if (!p.ok) return form('notnumber', 'Type the length as a number (cm is already written beside the box).');
      if (Math.abs(p.value - v) < 1e-9) return ok();
      for (var i = 0; alts && i < alts.length; i++) if (Math.abs(p.value - alts[i].v) < 1e-9) return wrong(alts[i].code, alts[i].hint);
      return wrong('value', null);
    };
  }

  /* ================= a tiny SVG canvas (screen coordinates; directions in math degrees) ================= */
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function Pic() { this.s = ''; this.bb = [1e9, 1e9, -1e9, -1e9]; }
  Pic.prototype.grow = function (p, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], p[0] - rx); b[1] = Math.min(b[1], p[1] - ry); b[2] = Math.max(b[2], p[0] + rx); b[3] = Math.max(b[3], p[1] + ry); };
  Pic.prototype.line = function (p, q2, o) { o = o || {}; this.s += '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q2[0].toFixed(1) + '" y2="' + q2[1].toFixed(1) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.w || 2.6) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; this.grow(p); this.grow(q2); };
  Pic.prototype.arc = function (C, r, a0, span, o) {
    o = o || {}; var a = at(C, a0, r), b = at(C, a0 + span, r);
    this.s += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'A' + r + ' ' + r + ' 0 ' + (Math.abs(span) > 180 ? 1 : 0) + ' ' + (span > 0 ? 0 : 1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" fill="none" stroke="' + (o.color || INK) + '" stroke-width="' + (o.w || 1.7) + '"/>';
    for (var i = 0; i <= 8; i++) this.grow(at(C, a0 + span * i / 8, r));
  };
  Pic.prototype.dot = function (p, o) { o = o || {}; this.s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (o.r || 3.4) + '" fill="' + (o.color || INK) + '"/>'; this.grow(p, 4); };
  Pic.prototype.text = function (p, s, o) {
    o = o || {}; var size = o.size || 16, it = /^[A-Za-z]$/.test(s) ? ' font-style="italic"' : '';
    this.s += '<text x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="' + size + '" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it + ' paint-order="stroke" stroke="#fff" stroke-width="3.5">' + String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>';
    this.grow(p, String(s).length * size * 0.32 + 2, size * 0.62);
  };
  Pic.prototype.rt = function (V, d, s, o) { s = s || 12; var a = at(V, d, s), c = at(a, d + 90, s), b = at(V, d + 90, s); this.s += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" fill="none" stroke="' + ((o && o.color) || INK) + '" stroke-width="1.6"/>'; };
  /* an angle mark with its label */
  Pic.prototype.mark = function (V, a0, span, label, o) {
    o = o || {}; var r = o.r || (span < 30 ? 40 : 28); this.arc(V, r, a0, span, { color: o.color });
    if (label) { var hw = label.length * 4.8 + 4, lr = Math.max(r + 14, (hw + 6) / Math.max(0.15, Math.sin(Math.min(span, 180) / 2 * RAD)) + 4); this.text(at(V, a0 + span / 2, Math.min(lr, 95)), label, { size: 15, color: o.color }); }
  };
  Pic.prototype.svg = function (maxW, aria) {
    var b = this.bb, pad = 8, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ' + W.toFixed(1) + ' ' + H.toFixed(1) + '" width="100%" style="max-width:' + Math.round(Math.min(maxW || W, W * 1.4)) + 'px" role="img" aria-label="' + (aria || 'figure') + '">' + this.s + '</svg>';
  };

  /* ∠(names[0] names[1] names[2]) at the left, a new ray from point nv at the right (as the booklet draws it) */
  function angleAndRay(x, rot, names, nv, endName) {
    var pc = new Pic(), V = [0, 0], L = 120;
    pc.line(V, at(V, rot, L)); pc.line(V, at(V, rot + x, L)); pc.dot(V);
    pc.text(at(V, rot, L + 15), names[2]); pc.text(at(V, rot + x, L + 15), names[0]); pc.text(at(V, rot + x / 2 + 180, 17), names[1]);
    var E = [Math.max(170, 60 + 120 * Math.max(0, Math.cos(rot * RAD), Math.cos((rot + x) * RAD))), 38];
    pc.line(E, [E[0] + 150, E[1]]); pc.dot(E); pc.text([E[0] - 6, E[1] + 17], nv); if (endName) pc.text([E[0] + 164, E[1]], endName);
    return pc.svg(440, 'an angle and a ray to copy it onto');
  }
  /* a candidate copy on ray UV: kind 'right' | 'other' (180 − x) | 'wrongEnd' (vertex at V) | 'offRay' (arms not on UV) */
  function copyPic(x, kind, nm) {
    var pc = new Pic(), U = [0, 0], Vp = [170, 0], L = 110, lab = Dg(kind === 'other' ? 180 - x : x);
    pc.line(U, Vp); pc.dot(U); pc.text([U[0] - 4, U[1] + 17], nm[0]); pc.text([Vp[0] + 14, Vp[1]], nm[1]);
    if (kind === 'right' || kind === 'other') { var a = kind === 'right' ? x : 180 - x; pc.line(U, at(U, a, L), { color: BLUE }); pc.mark(U, 0, a, lab, { color: BLUE }); }
    else if (kind === 'wrongEnd') { pc.dot(Vp); pc.line(Vp, at(Vp, 180 - x, L), { color: BLUE }); pc.mark(Vp, 180 - x, x, lab, { color: BLUE }); }
    else { var s = 25 + (x > 60 ? 0 : 15); pc.line(U, at(U, s, L), { color: BLUE }); pc.line(U, at(U, s + x, L), { color: BLUE }); pc.mark(U, s, x, lab, { color: BLUE }); }
    return pc.svg(230, 'a possible copy');
  }

  /* lines to sort (Q9, extra 5). lines: [{name, p: [x, y] (math units, y up), dir, len}] → svg */
  function linesSVG(lines) {
    var pc = new Pic(), S = 46;
    lines.forEach(function (l) { var A = [l.p[0] * S, -l.p[1] * S], B = at(A, l.dir, l.len * S); pc.line(A, B, { w: 2.4 }); pc.text(at(B, l.dir, 14), l.name); });
    return pc.svg(400, 'lines to sort');
  }
  function lineAngle(d1, d2) { var a = ((d1 - d2) % 180 + 180) % 180; return Math.min(a, 180 - a); }
  function sortOf(d1, d2) { var a = lineAngle(d1, d2); return a < 0.5 ? 'par' : Math.abs(a - 90) < 0.5 ? 'perp' : 'neither'; }
  function segHit(A, u, la, B, v, lb) {   // do segments A + s·u (0..la) and B + t·v (0..lb) cross? (math coords)
    var den = u[0] * v[1] - u[1] * v[0]; if (Math.abs(den) < 1e-9) return null;
    var dx = B[0] - A[0], dy = B[1] - A[1], s = (dx * v[1] - dy * v[0]) / den, tt = (dx * u[1] - dy * u[0]) / den;
    return { s: s, t: tt, inside: s >= 0 && s <= la && tt >= 0 && tt <= lb };
  }
  function uvec(d) { return [Math.cos(d * RAD), Math.sin(d * RAD)]; }
  var SORT_COLS = [{ id: 'par', html: 'parallel' }, { id: 'perp', html: 'perpendicular' }, { id: 'neither', html: 'neither' }];
  /* a sort question: lines + pairs [[i, j]], returns { svg, rows, want, why, sol } */
  function sortSetup(lines, pairs) {
    var rows = [], want = {}, info = {}, sol = [];
    pairs.forEach(function (pr) {
      var A = lines[pr[0]], B = lines[pr[1]], id = A.name + B.name, k = sortOf(A.dir, B.dir), ang0 = Math.round(lineAngle(A.dir, B.dir));
      var h = segHit(A.p, uvec(A.dir), A.len, B.p, uvec(B.dir), B.len), ext = k !== 'par' && h && !h.inside;
      rows.push({ id: id, html: t(A.name) + ' and ' + t(B.name) }); want[id] = k;
      var reason = k === 'par' ? 'they never meet; the gap between them stays the same' : (ext ? 'extend the lines with a ruler: they meet at ' : 'they meet at ') + (k === 'perp' ? '90°' : 'about ' + ang0 + '° (and ' + (180 - ang0) + '°), not 90°');
      info[id] = { k: k, reason: reason, ext: ext, ang: ang0 };
      sol.push(t(A.name) + ', ' + t(B.name) + ': <b>' + (k === 'par' ? 'parallel' : k === 'perp' ? 'perpendicular' : 'neither') + '</b> — ' + reason + '.');
    });
    return { rows: rows, want: want, info: info, sol: sol.join('<br>'), svg: linesSVG(lines),
      why: function (row, got) {
        var I = info[row]; if (!I) return null;
        if (I.k === 'par') return { code: 'u5l5-par', hint: rowName(row) + ': do they ever meet? Their gap stays the same, so they are parallel.' };
        if (got === 'par') return { code: 'u5l5-not-par', hint: rowName(row) + ': ' + (I.ext ? 'they don’t touch on the page, but a line goes on forever. Extend them with a ruler — do they meet?' : 'they cross, so they can’t be parallel.') };
        if (I.k === 'perp') return { code: 'u5l5-perp', hint: rowName(row) + ': ' + (I.ext ? 'extend the short line. ' : '') + 'Look at the corner where they meet: it is square (90°).' };
        return { code: 'u5l5-neither', hint: rowName(row) + ': ' + (I.ext ? 'extend the short line. ' : '') + 'They meet, but is the corner really square? It is about ' + I.ang + '°.' };
      } };
  }
  function rowName(id) { return t(id.charAt(0)) + ' and ' + t(id.charAt(1)); }

  /* ================= construction steps (order the steps) ================= */
  function orderPart(r, prompt, items, sol, hints, text) {
    var byId = {}; items.forEach(function (x) { byId[x.id] = x; });
    var p = P.order(r, prompt, items, { first: 'first step', last: 'last step', sep: '→', why: function (x, y) { return '<b>“' + byId[x].short + '”</b> has to come after <b>“' + byId[y].short + '”</b>. ' + (byId[x].why || ''); } }, sol, hints, text);
    return p;
  }
  function copySteps(V, nv) {   // copy ∠ at vertex V onto a ray from nv
    return [
      { id: 'c1', short: 'arc from ' + V, html: 'Put the compass point on ' + t(V) + '. Draw an arc that crosses both arms at ' + t('P') + ' and ' + t('Q') + '.', why: '' },
      { id: 'c2', short: 'same width, arc from ' + nv, html: 'Keep the <b>same</b> width. Put the point on ' + t(nv) + ' and draw a long arc that crosses the new ray at ' + t('R') + '.', why: 'It keeps the width from the first arc, so the first arc comes first.' },
      { id: 'c3', short: 'width QP, arc from R', html: 'Set the compass to the distance from ' + t('Q') + ' to ' + t('P') + '. Put the point on ' + t('R') + ' and draw an arc that crosses the long arc at ' + t('S') + '.', why: 'You need the crossings ' + t('P') + ', ' + t('Q') + ' and ' + t('R') + ' before you can do this.' },
      { id: 'c4', short: 'ray from ' + nv + ' through S', html: 'Draw the ray from ' + t(nv) + ' through ' + t('S') + '.', why: 'The ray goes through ' + t('S') + ', so ' + t('S') + ' must be made first.' }];
  }
  function bisectSteps(V) {
    return [
      { id: 'b1', short: 'arc from ' + V, html: 'Put the compass point on the vertex ' + t(V) + '. Draw an arc that crosses both arms at ' + t('P') + ' and ' + t('Q') + '.', why: '' },
      { id: 'b2', short: 'arc from Q', html: 'Put the compass point on ' + t('Q') + '. Draw an arc inside the angle.', why: 'You need the crossing ' + t('Q') + ' on the arm first.' },
      { id: 'b3', short: 'same width, arc from P', html: 'Keep the <b>same</b> width. Put the point on ' + t('P') + ' and draw an arc that crosses the last arc at ' + t('D') + '.', why: 'It crosses the arc from ' + t('Q') + ', so that arc comes first.' },
      { id: 'b4', short: 'ray from ' + V + ' through D', html: 'Draw the ray from ' + t(V) + ' through ' + t('D') + '.', why: 'The ray goes through ' + t('D') + ', so ' + t('D') + ' must be made first.' }];
  }
  function perpSteps(K0, ln) {
    return [
      { id: 'p1', short: 'arcs from ' + K0, html: 'Put the compass point on ' + t(K0) + '. Draw arcs that cross line ' + t(ln) + ' on both sides of ' + t(K0) + ', at ' + t('X') + ' and ' + t('Y') + '.', why: '' },
      { id: 'p2', short: 'wider, arc from X', html: 'Open the compass <b>wider</b>. Put the point on ' + t('X') + ' and draw an arc above ' + t(K0) + '.', why: 'You need the crossing ' + t('X') + ' on the line first.' },
      { id: 'p3', short: 'same width, arc from Y', html: 'Keep the same width. Put the point on ' + t('Y') + ' and draw an arc that crosses the last arc at ' + t('Q') + '.', why: 'It crosses the arc from ' + t('X') + ', so that arc comes first.' },
      { id: 'p4', short: 'line through ' + K0 + ' and Q', html: 'Draw the line through ' + t(K0) + ' and ' + t('Q') + '.', why: 'The line goes through ' + t('Q') + ', so ' + t('Q') + ' must be made first.' }];
  }

  /* ================= protractor parts ================= */
  function protShared(r, x, names) { return { x: x, rot: r.pick([-30, -20, -10, 0, 0, 10, 20, 30, 40]), scale: r.pick(['inner', 'outer']), names: names }; }
  function protSVG(s, hl) { return G.protractorSVG({ angle: s.x, rot: s.rot, scale: s.scale, names: [s.names[2], s.names[1], s.names[0]], highlight: hl, width: 440 }); }
  function readSol(s) {
    var A = s.names.join(''), arm0 = s.names[1] + s.names[2];
    return 'Centre on ' + t(s.names[1]) + ', 0 line on ' + t(arm0) + '. Read the scale that starts at 0 on ' + t(arm0) + ' (the ' + (s.scale === 'inner' ? 'inner' : 'outer') + ' scale): ' + t('\\angle ' + A + '=' + s.x + '^\\circ') + '.<br>Check: it is ' + (s.x < 90 ? 'acute, so less than 90°' : 'obtuse, so more than 90°') + ' ✓' + protSVG(s, s.scale);
  }
  function readBox(s) { return { label: t('\\angle ' + s.names.join('')) + ' =', name: 'angle ' + s.names.join(''), deg: s.x, tol: 1, trap: true }; }
  function halfBox(s) {
    return { label: 'Each half =', name: 'each half', deg: s.x / 2, tol: 0.5, alts: [{ v: s.x, code: 'u5l5-no-half', hint: 'That’s the whole angle. Bisecting cuts it into <b>two</b> equal parts: divide by 2.' }, { v: s.x * 2, code: 'u5l5-doubled', hint: 'Each half is <b>smaller</b> than the angle: divide by 2, don’t multiply.' }, { v: (180 - s.x) / 2, code: 'u5l5-half-other', hint: 'That’s half of ' + Dg(180 - s.x) + '. Read the protractor again (the scale that starts at 0 on an arm), then divide by 2.' }, { v: s.x / 4, code: 'u5l5-quarter', hint: 'Divide by 2 only once.' }] };
  }

  /* ================= hints and codes ================= */
  HW.addCodes({
    'u5l5-no-half': 'Didn’t divide by 2 (gave the whole angle)', 'u5l5-doubled': 'Doubled instead of halving', 'u5l5-halved': 'Halved instead of doubling (whole from a half)', 'u5l5-quarter': 'Divided by 4',
    'u5l5-supp': 'Gave 180° − the angle instead of half', 'u5l5-round-half': 'Rounded off the .5 of a half', 'u5l5-half-other': 'Halved the other protractor reading',
    'u5l5-no-mid': 'Gave the whole segment, not half (midpoint)', 'u5l5-mid-angle': 'Wrong angle at the midpoint', 'u5l5-par': 'Missed a parallel pair', 'u5l5-not-par': 'Called meeting lines parallel',
    'u5l5-perp': 'Missed a perpendicular pair', 'u5l5-neither': 'Called a non-90° crossing perpendicular', 'u5l5-word': 'Wrong word for a definition', 'u5l5-real': 'Wrong sort of a real-world pair',
    'u5l5-straight': 'Used 90° instead of the straight angle (180°)', 'u5l5-from180': 'Used 180° instead of 90°', 'u5l5-corner': 'Gave the corner, not the cut', 'u5l5-sum': 'Used the angle sum, not one corner',
    'u5l5-setting': 'Mixed up the cut angle and the saw setting', 'u5l5-back-once': 'Worked back only one bisection', 'u5l5-back-thrice': 'Worked back too many bisections', 'u5l5-half-of-sum': 'Took half of the total, not 2/3',
    'u5l5-third': 'Gave the half instead of the angle', 'u5l5-wrong-tri': 'Used 90° for a triangle corner', 'u5l5-step': 'Construction steps out of order'
  });
  HW.addPartial({ 'u5l5-round-half': 's', 'u5l5-half-other': 'b', 'u5l5-corner': 'b', 'u5l5-setting': 'b', 'u5l5-back-once': 'b', 'u5l5-back-thrice': 'b' });

  function halfAlts(w) {
    var a = [{ v: w * 2, code: 'u5l5-doubled', hint: 'Bisect means cut in half: <b>divide</b> by 2.' }, { v: w / 4, code: 'u5l5-quarter', hint: 'Divide by 2 only once.' }, { v: 180 - w, code: 'u5l5-supp', hint: 'That’s ' + t('180^\\circ-' + w + '^\\circ') + '. Bisecting means dividing the angle by 2.' }, { v: w, code: 'u5l5-no-half', hint: 'That’s the whole angle. Each half is the angle ÷ 2.' }];
    if (w % 2) { a.push({ v: Math.floor(w / 2), code: 'u5l5-round-half', hint: 'Don’t round: ' + t(w + '\\div 2=' + f1(w / 2)) + '. Keep the .5.' }); a.push({ v: Math.ceil(w / 2), code: 'u5l5-round-half', hint: 'Don’t round: ' + t(w + '\\div 2=' + f1(w / 2)) + '. Keep the .5.' }); }
    return a;
  }
  function wholeAlts(h) { return [{ v: h / 2, code: 'u5l5-halved', hint: 'You know <b>one half</b>, so the whole angle is bigger: half × 2.' }, { v: h + 2, code: 'u5l5-halved', hint: 'Whole angle = each half × 2.' }, { v: 180 - h, code: 'u5l5-supp', hint: 'That’s ' + t('180^\\circ-' + f1(h) + '^\\circ') + '. The whole is two halves: half × 2.' }]; }
  /* a bisect table: wholes → halves, halves → wholes */
  function bisectTable(sh) {
    var head = [''].concat(sh.cols), wh = ['<b>Whole angle</b>'].concat(sh.cells.map(function (c) { return c.whole != null ? Dg(c.whole) : '?'; })), hf = ['<b>Each half</b>'].concat(sh.cells.map(function (c) { return c.half != null ? Dg(c.half) : '?'; }));
    return table([head, wh, hf]);
  }
  function bisectShared(r, specs, cols, avoid) {
    var used = avoid.slice();
    var cells = specs.map(function (sp) {
      var v = find(function () { return r.pick(sp.pool); }, function (x) { return used.indexOf(x) < 0; }, sp.pool[0]); used.push(v);
      return sp.find === 'half' ? { whole: v, ans: v / 2 } : { half: v, ans: v * 2 };
    });
    return { cells: cells, cols: cols };
  }
  function bisectFields(sh, from, to, level) {
    var cells = sh.cells.slice(from, to), letters = sh.cols.slice(from, to);
    return angBoxes(cells[0].whole != null ? 'Find each half for ' + letters.join(', ') + '.' : 'Find the whole angle for ' + letters.join(' and ') + '.', cells.map(function (c, i) {
      return c.whole != null ? { label: letters[i] + ' each half:', name: letters[i], deg: c.ans, alts: halfAlts(c.whole) } : { label: letters[i] + ' whole angle:', name: letters[i], deg: c.ans, alts: wholeAlts(c.half) };
    }), cells.map(function (c, i) { return letters[i] + ' ' + (c.whole != null ? t(c.whole + '\\div 2=' + f1(c.ans) + '^\\circ') : t(f1(c.half) + '\\times 2=' + f1(c.ans) + '^\\circ')); }).join('<br>'),
    [cells[0].whole != null ? 'Each half = the whole angle ÷ 2.' : 'The whole angle = each half × 2.'], 'bisect table');
  }

  /* Q1 sentences */
  var WORDS = ['bisect', 'perpendicular', 'parallel', 'congruent', 'midpoint'];
  var SENT = {
    congruent: ['Two angles with the same size are ___.', 'Two segments with the same length are ___.', 'An angle and an exact copy of it are ___.'],
    perpendicular: ['Lines that meet at 90° are ___.', 'Lines that make a square corner where they cross are ___.', 'A wall stud that stands at exactly 90° to the floor is ___ to it.'],
    bisect: ['To cut an angle into two equal angles is to ___ it.', 'To cut a segment into two equal parts is to ___ it.', 'A mitre joint must ___ the corner angle, so the two cuts are equal.'],
    parallel: ['Lines on a flat surface that never meet are ___.', 'Lines that always stay the same distance apart are ___.', 'The two rails of a straight railway track are ___.'],
    midpoint: ['The point that cuts a segment into two equal parts is its ___.', 'The perpendicular bisector of a segment crosses it at its ___.', 'If ' + t('M') + ' is on segment ' + t('AB') + ' and ' + t('AM=MB') + ', then ' + t('M') + ' is the ___ of ' + t('AB') + '.']
  };
  var DEF = { congruent: '<b>Congruent</b> means the same size.', perpendicular: '<b>Perpendicular</b> lines meet at 90°.', bisect: '<b>Bisect</b> means cut into two equal parts.', parallel: '<b>Parallel</b> lines never meet.', midpoint: 'The <b>midpoint</b> is the point halfway along a segment.' };

  /* Q10 real-world pairs */
  var REAL = {
    par: [['the two rails of a straight railway track', 'they never meet'], ['two lines between angled parking stalls', 'they never meet'], ['two lines on a sheet of lined paper', 'they never meet'], ['two strings of a guitar', 'they never meet'], ['two stripes of a crosswalk', 'they never meet'], ['the top and bottom edges of a door', 'they never meet']],
    perp: [['the hands of a clock at 3:00', '3 hour marks = 3 × 30° = 90°'], ['the hands of a clock at 9:00', '3 hour marks = 3 × 30° = 90°'], ['the side edge of a door and the floor', 'a square corner (90°)'], ['two edges that meet at a corner of a sheet of paper', 'a square corner (90°)'], ['a wall stud and the floor plate it stands on (built square)', 'a square corner (90°)']],
    neither: [['the hands of a clock at 1:00', '1 hour mark = 30°, not 90°'], ['the hands of a clock at 2:00', '2 hour marks = 60°, not 90°'], ['the hands of a clock at 5:00', '5 hour marks = 150°, not 90°'], ['an angled parking line and the curb', 'they meet at an angle like 60°, not 90°'], ['a ladder leaning on a wall, and the floor', 'they meet, but not at 90°'], ['the two straight edges of a slice of pizza', 'they meet at a point, not at 90°']]
  };

  /* the booklet's line layout for Q9 (a ∥ c, b ⟂ a, d at δ to b, short e meets d at ε when extended) */
  function q9Lines(r) {
    return find(function () {
      var rot = r.pick([-20, -15, -10, -5, 0, 5, 10, 15]), dl = r.pick([40, 45, 50, 55]), ep = r.pick([50, 60, 70, 90, 90]);
      var b = 30 + rot, a = b - 90, d = b - dl, e = d + 180 - ep;
      var c0 = Math.cos(rot * RAD), s0 = Math.sin(rot * RAD), R = function (p) { return [p[0] * c0 - p[1] * s0, p[0] * s0 + p[1] * c0]; };
      return { rot: rot, dl: dl, ep: ep, lines: [{ name: 'a', p: R([0.3, 3.0]), dir: a, len: 3.6 }, { name: 'b', p: R([0, 0.9]), dir: b, len: 6.2 }, { name: 'c', p: R([3.6, 4.6]), dir: a, len: 4.4 }, { name: 'd', p: R([0.2, 4.0]), dir: d, len: 6.4 }, { name: 'e', p: R([5.2, 0.2]), dir: e, len: 1.8 }] };
    }, function (v) {
      var L = v.lines, d = L[3], e = L[4], h = segHit(d.p, uvec(d.dir), d.len, e.p, uvec(e.dir), e.len);
      // e must miss d on the page but reach it within 3 units when extended (either way), and the d line must cross b
      return h && !h.inside && h.t > e.len + 0.25 && h.t < e.len + 3 && h.s > 0.3 && h.s < d.len - 0.3;
    }, null) || { dl: 45, ep: 50, lines: [{ name: 'a', p: [0.3, 3.0], dir: -60, len: 3.6 }, { name: 'b', p: [0, 0.9], dir: 30, len: 6.2 }, { name: 'c', p: [3.6, 4.6], dir: -60, len: 4.4 }, { name: 'd', p: [0.2, 4.0], dir: -15, len: 6.4 }, { name: 'e', p: [5.2, 0.2], dir: 115, len: 1.8 }] };
  }
  /* extra 5: p ∥ q, r at about 75° to p, short s ⟂ p and q (extend it) */
  function e5Lines(r) {
    return find(function () {
      var rot = r.pick([-12, -8, -4, 0, 4, 8, 12]), pd = 8 + rot, rr = pd + r.pick([60, 65, 70, 75, 105, 110, 115]), sd = pd + 90;
      var c0 = Math.cos(rot * RAD), s0 = Math.sin(rot * RAD), R = function (p) { return [p[0] * c0 - p[1] * s0, p[0] * s0 + p[1] * c0]; };
      return { lines: [{ name: 'p', p: R([0, 0.3]), dir: pd, len: 6.2 }, { name: 'q', p: R([0, 1.5]), dir: pd, len: 6.2 }, { name: 'r', p: R([rr - pd > 90 ? 3.2 : 1.4, -0.2]), dir: rr, len: 3.6 }, { name: 's', p: R([4.6, 2.9]), dir: sd, len: 1.2 }] };
    }, function (v) { var L = v.lines, q0 = L[1], s = L[3], h = segHit(q0.p, uvec(q0.dir), q0.len, s.p, uvec(s.dir), s.len); return h && !h.inside; }, null);
  }

  /* Q13 Leah's mistake */
  var LEAH = {
    step2: { s2: 'she opened the compass <b>wider</b>, then drew a long arc from the new vertex ' + t('E') + ', crossing the ray at ' + t('R') + '.', s3: 'arc of width ' + t('QP') + ' from ' + t('R') + ', crossing the long arc at ' + t('S') + '.', s4: 'ray ' + t('ES') + '.' },
    step3: { s2: 'with the same width, a long arc from the new vertex ' + t('E') + ', crossing the ray at ' + t('R') + '.', s3: 'she <b>kept the same width</b> and drew an arc from ' + t('R') + ', crossing the long arc at ' + t('S') + '.', s4: 'ray ' + t('ES') + '.' },
    step4: { s2: 'with the same width, a long arc from the new vertex ' + t('E') + ', crossing the ray at ' + t('R') + '.', s3: 'arc of width ' + t('QP') + ' from ' + t('R') + ', crossing the long arc at ' + t('S') + '.', s4: 'she drew the ray from ' + t('R') + ' through ' + t('S') + '.' }
  };

  /* Q16 tools */
  function toolMC(r) {
    var kind = r.pick(['square', 'square', 'mira', 'bevel']), opts, prompt, sol;
    if (kind === 'square') {
      var n = r.pick([35, 48, 55, 62, 72, 80, 105, 120]);
      prompt = 'Which tool can copy a right angle but <b>cannot</b> copy a ' + n + '° angle?';
      opts = [{ html: 'a protractor', why: 'A protractor can measure and draw any angle, ' + n + '° too.' }, { html: 'a compass and straightedge', why: 'A compass and straightedge can copy any angle.' }, { html: 'a carpenter’s (framing) square', right: true }, { html: 'a sliding T-bevel', why: 'A T-bevel’s blade swings and locks at any angle.' }];
      sol = 'A carpenter’s (framing) square has only a 90° corner. The other three tools can copy any angle.';
    } else if (kind === 'mira') {
      prompt = 'Which tool is a see-through red plastic mirror that you can use to copy or bisect an angle?';
      opts = [{ html: 'a Mira', right: true }, { html: 'a speed square', why: 'A speed square is a metal or plastic triangle with a degree scale. It is not see-through.' }, { html: 'a sliding T-bevel', why: 'A T-bevel has a swinging blade; you don’t look through it.' }, { html: 'a protractor', why: 'A protractor measures with a degree scale; it doesn’t reflect.' }];
      sol = 'A <b>Mira</b>: you look through it and line up the reflection of the angle.';
    } else {
      prompt = 'Which carpenter’s tool has a blade that swings and locks, so it can copy any angle onto a board?';
      opts = [{ html: 'a sliding T-bevel', right: true }, { html: 'a carpenter’s (framing) square', why: 'A framing square is a fixed L shape: it only copies 90°.' }, { html: 'a Mira', why: 'A Mira is a see-through red mirror; it has no blade.' }, { html: 'a compass', why: 'A compass draws arcs and copies distances; it has no locking blade.' }];
      sol = 'A <b>sliding T-bevel</b>: set the blade along both arms, lock it, and move it to the board.';
    }
    var p = P.mc(r, prompt, opts, sol, ['Think about what each tool can do (the table at the start of the lesson).'], 'MC tool', kind === 'square'); p.input.columns = 2; return p;
  }

  /* reusable by later Unit 5 lessons (e.g. the review): line sorting, construction steps, a small SVG canvas */
  HW.u5construct = { Pic: Pic, at: at, linesSVG: linesSVG, sortSetup: sortSetup, SORT_COLS: SORT_COLS, orderPart: orderPart, copySteps: copySteps, bisectSteps: bisectSteps, perpSteps: perpSteps, copyPic: copyPic, lineKSVG: lineKSVG };

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u5l5', unit: 5, num: '5', title: 'Copying and Bisecting Angles; Perpendicular Lines', outcome: 'G6',
    blurb: 'Copying an angle with a protractor or a compass, bisecting angles, mitre cuts, perpendicular lines and bisectors, and sorting lines as parallel, perpendicular or neither.',
    questions: [
      { num: '1', stem: 'Words: <b>bisect, perpendicular, parallel, congruent, midpoint</b>.', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var rows = r.shuffle(WORDS).map(function (w) { return { id: w, html: r.pick(SENT[w]) }; }), want = {};
          rows.forEach(function (x) { want[x.id] = x.id; });
          return P.grid('Fill in each blank with a word from the list.', rows, WORDS.map(function (w) { return { id: w, html: w }; }), want,
            { colHead: 'word', why: function (row, got) { return { code: 'u5l5-word', hint: '“' + rows.filter(function (x) { return x.id === row; })[0].html.replace('___', '<b>___</b>') + '” — ' + DEF[row] + (got && DEF[got] ? ' (' + DEF[got] + ')' : '') }; } },
            rows.map(function (x) { return x.html.replace('___', '<b>' + x.id + '</b>'); }).join('<br>'), ['Same size → congruent. 90° → perpendicular. Two equal parts → bisect. Never meet → parallel. Halfway point → midpoint.'], 'vocab');
        } }] },
      { num: '2', stem: function (sh) { return 'Each angle is bisected. Complete the table.' + bisectTable(sh); },
        shared: function (r) {
          return bisectShared(r, [{ find: 'half', pool: [40, 50, 52, 56, 58, 60, 62, 66, 72, 76, 78] }, { find: 'half', pool: [100, 104, 106, 110, 112, 116, 118, 122, 124, 126] }, { find: 'half', pool: [27, 29, 31, 39, 41, 43, 45, 47, 49, 51, 53] }, { find: 'half', pool: [154, 158, 162, 166, 170, 172, 174, 176, 178] }, { find: 'half', pool: [21, 23, 25, 33, 35, 57, 59, 61, 65, 67] },
            { find: 'whole', pool: [14, 16, 18, 19, 21, 22, 23, 24, 26, 28] }, { find: 'whole', pool: [52.5, 55.5, 57.5, 62.5, 66.5, 67.5, 69.5, 72.5, 74.5, 77.5] }], ['(a)', '(b)', '(c)', '(d)', '(e)', '(f)', '(g)'], [90, 128, 75, 180, 68, 163, 45, 64, 37.5, 34, 81.5]);
        },
        parts: [
          { id: '2a', sub: 'a–e', level: 'BEG', make: function (r, sh) { return bisectFields(sh, 0, 5); } },
          { id: '2b', sub: 'f–g', level: 'EMG', make: function (r, sh) { return bisectFields(sh, 5, 7); } }] },
      { num: '3', stem: function (sh) { return 'Measure ' + t('\\angle PQR') + ' with a protractor. Then copy it onto ray ' + t('UV') + ', with its vertex at ' + t('U') + '.'; },
        shared: function (r) { return protShared(r, r.pick(not(range(35, 78), [64])), ['P', 'Q', 'R']); },
        parts: [
          { id: '3a', level: 'EMG', make: function (r, sh) {
            return angBoxes('The protractor is laid on ' + t('\\angle PQR') + '. What does ' + t('\\angle PQR') + ' measure? (Read it to the nearest degree.)' + protSVG(sh), [readBox(sh)], readSol(sh),
              ['Find the scale that starts at 0 on one arm of the angle.', 'Is the angle acute or obtuse? Check your reading makes sense.'], 'read PQR');
          } },
          { id: '3b', level: 'EMG', make: function (r, sh) {
            var nm = ['U', 'V'], kinds = [['right', null], ['other', 'That angle is ' + Dg(180 - sh.x) + ': the dot was marked on the <b>other scale</b>. The copy must measure ' + Dg(sh.x) + ' (your answer to (a)).'], ['wrongEnd', 'The vertex of the copy must be at ' + t('U') + ', not at ' + t('V') + '.'], ['offRay', 'One arm of the copy must lie <b>on</b> ray ' + t('UV') + '. Here neither arm is on the ray.']];
            var p = P.mc(r, 'Use your answer to (a). Which picture shows a correct copy of ' + t('\\angle PQR') + ' on ray ' + t('UV') + '?', kinds.map(function (k, i) { return { html: copyPic(sh.x, k[0], nm), right: !k[1], why: k[1], code: 'copy-' + k[0] }; }),
              'The copy has its vertex at ' + t('U') + ', one arm on ray ' + t('UV') + ', and measures ' + T(sh.x) + ' (the same as ' + t('\\angle PQR') + ').' + copyPic(sh.x, 'right', nm), ['Three things must be right: the vertex is at U, one arm lies on UV, and the angle is the same size.'], 'copy picture');
            p.input.columns = 2; return p;
          } }] },
      { num: '4', stem: 'Copy each angle onto the ray beside it using only a compass and a straightedge. Then measure both angles to check.', shared: function (r) { return { a: r.pick([32, 36, 38, 40, 42, 44, 46, 52]), b: r.pick([118, 122, 126, 133, 138, 142, 145]), ra: r.pick([0, 5, 10, 15]), rb: r.pick([0, 5, 10]) }; },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) {
            var it = copySteps('B', 'X');
            return orderPart(r, '(a) Put the steps for copying ' + t('\\angle ABC') + ' onto the ray from ' + t('X') + ' in order.' + angleAndRay(sh.a, sh.ra, ['A', 'B', 'C'], 'X'), it,
              it.map(function (s, i) { return '<b>Step ' + (i + 1) + '.</b> ' + s.html; }).join('<br>') + '<br>Check: both angles measure ' + T(sh.a) + '.', ['The first arc is drawn on the angle you are copying.', 'You can only measure the distance between P and Q after they are drawn.'], 'copy steps');
          } },
          { id: '4b', level: 'EMG', make: function (r, sh) {
            var p = P.mc(r, '(b) You copy ' + t('\\angle DEF') + ' onto the ray from ' + t('Y') + '. In the step where you draw the arc from ' + t('R') + ' (on the new ray), what is the compass set to?' + angleAndRay(sh.b, sh.rb, ['D', 'E', 'F'], 'Y'), [
              { html: 'The distance between the two points where the first arc crossed the arms of ' + t('\\angle DEF') + ' (from ' + t('Q') + ' to ' + t('P') + ')', right: true },
              { html: 'The same width as the first arc from ' + t('E') + '', why: 'That width is for the arcs from ' + t('E') + ' and ' + t('Y') + ' only. This step copies <b>how far apart the arms are</b>: the distance from ' + t('Q') + ' to ' + t('P') + '.', code: 'same-width' },
              { html: 'The length of arm ' + t('ED') + '', why: 'The arms can be any length. Copy the distance between the two crossings, ' + t('Q') + ' to ' + t('P') + '.', code: 'arm' },
              { html: 'Any width, as long as the arcs cross', why: 'A random width gives a random angle. It must be the distance from ' + t('Q') + ' to ' + t('P') + '.', code: 'any' }],
              'Set the compass to the distance from ' + t('Q') + ' to ' + t('P') + ' (the two crossings on ' + t('\\angle DEF') + '). That distance fixes how far apart the arms are, so the copy also measures ' + T(sh.b) + '.', ['Which distance on ∠DEF tells you how “open” the angle is?'], 'copy width');
            return p;
          } }] },
      { num: '5', stem: 'Bisect each angle with a compass and straightedge. Then measure each half to check. What should each half be?',
        shared: function (r) { return { a: protShared(r, r.pick(not(range(72, 88, 2), [84, 70])), ['G', 'H', 'I']), b: protShared(r, r.pick(not(range(130, 162, 2), [146, 128])), ['S', 'T', 'W']) }; },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { var s = sh.a; return angBoxes('(a) Read ' + t('\\angle GHI') + ' from the protractor. What should each half be after you bisect it?' + protSVG(s), [readBox(s), halfBox(s)], readSol(s) + '<br>Each half: ' + t(s.x + '\\div 2=' + f1(s.x / 2) + '^\\circ'), ['Read the scale that starts at 0 on an arm.', 'Each half = the angle ÷ 2.'], 'bisect GHI'); } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var s = sh.b; return angBoxes('(b) Read ' + t('\\angle STW') + ' from the protractor. What should each half be after you bisect it?' + protSVG(s), [readBox(s), halfBox(s)], readSol(s) + '<br>Each half: ' + t(s.x + '\\div 2=' + f1(s.x / 2) + '^\\circ'), ['This angle is obtuse: the reading must be more than 90°.', 'Each half = the angle ÷ 2.'], 'bisect STW'); } },
          { id: '5c', level: 'EMG', make: function (r, sh) {
            var it = bisectSteps('H');
            return orderPart(r, '(c) Put the compass-and-straightedge steps for bisecting ' + t('\\angle GHI') + ' in order.', it, it.map(function (s, i) { return '<b>Step ' + (i + 1) + '.</b> ' + s.html; }).join('<br>') + '<br>Ray ' + t('HD') + ' bisects the angle: each half is ' + T(sh.a.x / 2) + '.', ['Start at the vertex.', 'The two arcs inside the angle use the same width.'], 'bisect steps');
          } }] },
      { num: '6', stem: function (sh) { return sh.intro; },
        shared: function (r) { var k = r.pick(['sq', 'sq', 'sq', 'note', 'tri', 'hex']); var S = { sq: ['Take a square sheet of paper.', 90, 'a square'], note: ['Take a square sticky note.', 90, 'a square'], tri: ['Take a sheet of paper cut into an equilateral triangle (3 equal sides and 3 equal corners of 60°).', 60, 'an equilateral triangle'], hex: ['Take a paper coaster shaped like a regular hexagon (6 equal corners of 120°).', 120, 'a regular hexagon'] }[k]; return { intro: S[0], c: S[1], what: S[2] }; },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) { var h = sh.c / 2; return angPart('Fold one corner so that its two edges lie on top of each other. The crease bisects the corner. What is each angle at the corner now?', h, { alts: [{ v: sh.c, code: 'u5l5-no-half', hint: 'That’s the whole corner. The crease cuts it into two equal angles.' }, { v: 45, code: 'u5l5-wrong-tri', hint: 'A corner of ' + sh.what + ' is ' + Dg(sh.c) + ', not 90°. Halve ' + Dg(sh.c) + '.' }, { v: sh.c * 2, code: 'u5l5-doubled', hint: 'Each new angle is smaller than the corner: divide by 2.' }], sol: 'The corner is ' + T(sh.c) + '.<br>' + t(sh.c + '\\div 2=' + f1(h) + '^\\circ'), hints: ['What size is each corner of ' + sh.what + '?', 'Bisect = divide by 2.'], text: 'fold 1' }); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { var h = sh.c / 4; return angPart('Fold again to bisect one of those angles. What size is the new angle?', h, { alts: [{ v: sh.c / 2, code: 'u5l5-no-half', hint: 'That’s the angle after the first fold. Fold again: halve it once more.' }, { v: sh.c / 3, code: 'u5l5-quarter', hint: 'Each fold cuts the angle in half: ÷ 2 and then ÷ 2 again.' }, { v: 22.5, code: 'u5l5-wrong-tri', hint: 'Start from a corner of ' + sh.what + ': ' + Dg(sh.c) + '.' }], sol: t(sh.c + '\\div 2=' + f1(sh.c / 2) + '^\\circ') + '<br>' + t(f1(sh.c / 2) + '\\div 2=' + f1(h) + '^\\circ'), hints: ['Halve your answer to (a).'], text: 'fold 2' }); } }] },
      { num: '7', stem: function (sh) { return 'Construct the perpendicular bisector of segment ' + t('CD') + '. Label the midpoint ' + t('M') + '. Segment ' + t('CD') + ' is ' + f1(sh.L) + ' cm long.' + segSVG(sh.L); }, outcome: 'G5',
        shared: function (r) { return { L: r.pick([4, 4.5, 5, 5.5, 6.5, 7, 7.5, 8, 9, 9.5]) }; },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) {
            var h = sh.L / 2, la = [{ v: sh.L, code: 'u5l5-no-mid', hint: t('M') + ' is the <b>midpoint</b>: it cuts ' + t('CD') + ' into two equal parts. Divide by 2.' }, { v: sh.L * 2, code: 'u5l5-doubled', hint: 'Half of the segment: divide by 2.' }];
            return P.fields('What lengths should you measure for ' + t('CM') + ' and ' + t('MD') + ', and what angle is at ' + t('M') + '?', [{ label: t('CM') + ' =', after: 'cm', name: 'CM' }, { label: t('MD') + ' =', after: 'cm', name: 'MD' }, { label: 'angle at ' + t('M') + ' =', after: '°', name: 'angle at M' }],
              [lenChk(h, la), lenChk(h, la), ang(90, { alts: [{ v: 180, code: 'u5l5-mid-angle', hint: 'The bisector is <b>perpendicular</b>: it meets ' + t('CD') + ' at a right angle.' }, { v: 45, code: 'u5l5-mid-angle', hint: 'Perpendicular means a right angle: 90°.' }] })], [nS(h), nS(h), '90'],
              t('CM') + ' = ' + t('MD') + ' = ' + nS(h) + ' cm; the angle at ' + t('M') + ' is ' + T(90), 'The midpoint cuts ' + t('CD') + ' in half: ' + t(nS(sh.L) + '\\div 2=' + nS(h)) + ' cm, so ' + t('CM=MD=' + nS(h)) + ' cm.<br>The perpendicular bisector meets ' + t('CD') + ' at ' + T(90) + '.', ['M is halfway along CD.', 'Perpendicular means 90°.'], 'perp bisector');
          } },
          { id: '7b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'To construct the perpendicular bisector, you draw arcs from ' + t('C') + ' and from ' + t('D') + ' with the same compass width. How wide must the compass be?', [
              { html: 'More than half of ' + t('CD') + '', right: true },
              { html: 'Exactly half of ' + t('CD') + '', why: 'Then the arcs from ' + t('C') + ' and ' + t('D') + ' only touch at the midpoint. You need two crossing points (above and below) to draw the line.', code: 'half' },
              { html: 'Less than half of ' + t('CD') + '', why: 'Then the arcs from ' + t('C') + ' and ' + t('D') + ' don’t reach each other, so they never cross.', code: 'less' },
              { html: 'Any width, but change it between ' + t('C') + ' and ' + t('D') + '', why: 'The width must be the <b>same</b> from both ends, or the crossings won’t be halfway.', code: 'change' }],
              'Open the compass to <b>more than half</b> of ' + t('CD') + ' (more than ' + nS(sh.L / 2) + ' cm), and keep the same width for both ends. Then the arcs cross above and below ' + t('CD') + '.', ['Picture the arcs from C and D: will they reach each other?'], 'perp bisector width');
          } }] },
      { num: '8', stem: function (sh) { return 'Construct a line through ' + t('K') + ' that is perpendicular to line ' + t('m') + '.' + lineKSVG(sh.tilt); }, outcome: 'G5',
        shared: function (r) { return { tilt: r.pick([-28, -24, -20, 18, 22, 26]) }; },
        parts: [
          { id: '8a', sub: 'steps', level: 'EMG', make: function (r, sh) { var it = perpSteps('K', 'm'); return orderPart(r, 'Put the construction steps in order.', it, it.map(function (s, i) { return '<b>Step ' + (i + 1) + '.</b> ' + s.html; }).join('<br>'), ['Start at K.', 'The two arcs that cross at Q use the same (wider) width.'], 'perp steps'); } },
          { id: '8b', sub: 'picture', level: 'EMG', make: function (r, sh) {
            var kinds = [['right', null], ['vertical', 'That line goes straight up the page, but line ' + t('m') + ' is tilted. Perpendicular means 90° to <b>line m</b>.'], ['tilted', 'That line goes through ' + t('K') + ', but the corner it makes with ' + t('m') + ' isn’t square (90°).'], ['offK', 'That line is perpendicular to ' + t('m') + ', but it doesn’t go through ' + t('K') + '.']];
            var p = P.mc(r, 'Which picture shows the line through ' + t('K') + ' that is perpendicular to line ' + t('m') + '? (Check it with the corner of a sheet of paper if it helps.)', kinds.map(function (k) { return { html: lineKSVG(sh.tilt, k[0]), right: !k[1], why: k[1], code: 'perp-' + k[0] }; }),
              'The perpendicular goes through ' + t('K') + ' and makes a 90° corner with line ' + t('m') + ' (on both sides).' + lineKSVG(sh.tilt, 'right', true), ['Turn a sheet of paper so one edge lies along m. Its corner shows 90°.'], 'perp picture');
            p.input.columns = 2; return p;
          } }] },
      { num: '9', stem: function (sh) { return 'Use a ruler and a protractor. Sort each pair of lines as parallel, perpendicular or neither.' + sh.S.svg; }, outcome: 'G5',
        shared: function (r) { var L = q9Lines(r).lines; return { L: L, S: sortSetup(L, [[0, 2], [0, 1], [1, 2], [1, 3], [3, 4], [2, 3]]) }; },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) { var S = sh.S; return P.grid('Sort each pair.', S.rows, SORT_COLS, S.want, { rowHead: 'pair', why: S.why }, S.sol, ['Parallel lines never meet. Perpendicular lines meet at 90°. Lines that meet at any other angle are neither.', 'A line goes on forever: extend the short line before you decide.'], 'sort lines'); } },
          { id: '9b', level: 'EMG', make: function (r, sh) {
            var I = sh.S.info.de, kind = I.k === 'perp' ? 'perpendicular' : 'neither';
            return P.mc(r, 'Lines ' + t('d') + ' and ' + t('e') + ' don’t touch on the page. Which reason is right?', [
              { html: 'Extend ' + t('e') + ' with a ruler: it meets ' + t('d') + (I.k === 'perp' ? ' at 90°, so they are <b>perpendicular</b>.' : ' at about ' + I.ang + '°, so they are <b>neither</b>.'), right: true },
              { html: 'They don’t touch, so they are <b>parallel</b>.', why: 'A line goes on forever. Extend ' + t('e') + ': it meets ' + t('d') + ', so they are not parallel.', code: 'not-touch' },
              { html: 'They don’t touch, so you can’t sort them.', why: 'You can: extend ' + t('e') + ' with a ruler until it meets ' + t('d') + ', then measure the angle.', code: 'cant' },
              { html: 'Extend ' + t('e') + ': it meets ' + t('d') + (I.k === 'perp' ? ' at about 60°, so they are <b>neither</b>.' : ' at 90°, so they are <b>perpendicular</b>.'), why: 'Right idea — now look closely at the corner where they would meet' + (I.k === 'perp' ? ': it is square.' : ': it isn’t square.'), code: 'angle' }],
              'Extend ' + t('e') + ' (a line goes on forever). It meets ' + t('d') + ' at ' + (I.k === 'perp' ? '90°' : 'about ' + I.ang + '°') + ', so ' + t('d') + ' and ' + t('e') + ' are <b>' + kind + '</b>.', ['A line goes on forever.'], 'extend e');
          } }] },
      { num: '10', stem: 'Are these lines parallel, perpendicular or neither?', outcome: 'G5', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var pick = [].concat(r.sample(REAL.par, 2).map(function (x) { return [x, 'par']; }), r.sample(REAL.perp, 2).map(function (x) { return [x, 'perp']; }), r.sample(REAL.neither, 2).map(function (x) { return [x, 'neither']; }));
          pick = r.shuffle(pick); var rows = [], want = {}, info = {};
          pick.forEach(function (x, i) { var id = 'r' + i; rows.push({ id: id, html: '(' + 'abcdef'.charAt(i) + ') ' + x[0][0] }); want[id] = x[1]; info[id] = x; });
          return P.grid('Sort each pair of lines.', rows, SORT_COLS, want, { rowHead: '', why: function (row) { var x = info[row]; return { code: 'u5l5-real', hint: x[0][0].charAt(0).toUpperCase() + x[0][0].slice(1) + ': ' + x[0][1] + '.' }; } },
            pick.map(function (x, i) { return '(' + 'abcdef'.charAt(i) + ') <b>' + (x[1] === 'par' ? 'parallel' : x[1] === 'perp' ? 'perpendicular' : 'neither') + '</b>: ' + x[0][1] + '.'; }).join('<br>'), ['Do they never meet (parallel), meet at 90° (perpendicular), or meet at another angle (neither)?', 'Clock: each hour mark is 30°.'], 'real lines');
        } }] },
      { num: '11', stem: function (sh) { return 'A fence post makes an angle of ' + Dg(sh.x) + ' with the ground on its left side.'; }, outcome: 'G5',
        shared: function (r) { return { x: r.pick(not(range(80.5, 97.5, 0.5), [90, 92.5, 85, 95])), who: r.pick(['Kiran', 'Ava', 'Marcus', 'Leila', 'Owen']) }; },
        parts: [
          { id: '11a', level: 'BEG', make: function (r, sh) { var a = q(180 - sh.x); return angPart('What angle does it make with the ground on its right side?', a, { alts: [{ v: Math.abs(90 - sh.x), code: 'u5l5-from180', hint: 'The two angles at the foot of the post make a straight line: they add to <b>180°</b>.' }, { v: sh.x, code: 'u5l5-straight', hint: 'The post isn’t straight up, so the two sides are different. They add to 180°.' }, { v: 360 - sh.x, code: 'u5l5-straight', hint: 'The ground is a straight line: 180°, not 360°.' }], sol: 'The two angles make a straight angle:<br>' + t('180^\\circ-' + f1(sh.x) + '^\\circ=' + f1(a) + '^\\circ'), hints: ['The ground is a straight line (180°).'], text: 'post other side' }); } },
          { id: '11b', level: 'EMG', make: function (r, sh) { var a = q(Math.abs(90 - sh.x)); return angPart('By how many degrees must the post be straightened to be perpendicular to the ground?', a, { alts: [{ v: q(180 - sh.x), code: 'u5l5-from180', hint: 'Perpendicular means <b>90°</b>. How far is ' + Dg(sh.x) + ' from 90°?' }, { v: q(Math.abs(180 - 2 * sh.x)), code: 'u5l5-doubled', hint: 'Compare one side with 90°: ' + t('90^\\circ') + ' and ' + Dg(sh.x) + '.' }], sol: 'Perpendicular means 90°.<br>' + (sh.x < 90 ? t('90^\\circ-' + f1(sh.x) + '^\\circ=' + f1(a) + '^\\circ') : t(f1(sh.x) + '^\\circ-90^\\circ=' + f1(a) + '^\\circ')), hints: ['Compare the angle with 90°.'], text: 'post straighten' }); } },
          { id: '11c', level: 'EMG', make: function (r, sh) {
            return P.mc(r, sh.who + ' checks the post with a carpenter’s square from the front only. Is that enough?', [
              { html: '<b>No.</b> The ground is a flat surface. The post could be 90° from the front but still lean sideways, so check from the side too.', right: true },
              { html: '<b>Yes.</b> If it is 90° from the front, it is 90° from every direction.', why: 'A post can lean sideways and still look square from the front. Check two directions.', code: 'yes-all' },
              { html: '<b>Yes.</b> A carpenter’s square is always exact.', why: 'The square is exact, but it only checks one direction at a time.', code: 'yes-tool' },
              { html: '<b>No.</b> You can only check a post with a protractor.', why: 'A square (or a level) works — it just has to be used in <b>two</b> directions.', code: 'no-tool' }],
              'No. To be perpendicular to the flat ground, the post must be 90° front-to-back <b>and</b> side-to-side. Check from the side too.', ['The ground is a surface, not just one line.'], 'post front only');
          } }] },
      { num: '12', stem: 'A framer is making picture frames.', parts: [
        { id: '12a', level: 'BEG', make: function (r) { var what = r.pick(['a square frame', 'a rectangular frame', 'a square mirror frame', 'a rectangular window frame']); return angPart('What is the cut angle at each end of a piece for ' + what + '?', 45, { alts: [{ v: 90, code: 'u5l5-corner', hint: 'That’s the corner. The joint bisects the corner, so each cut is half of it.' }, { v: 22.5, code: 'u5l5-quarter', hint: 'Halve the 90° corner once.' }, { v: 180, code: 'u5l5-corner', hint: 'A corner of a rectangle is 90°. Each cut is half of the corner.' }], sol: 'Every corner of ' + what.replace(/^a /, 'a ') + ' is ' + T(90) + '.<br>' + t('90^\\circ\\div 2=45^\\circ') + ' for each cut.', hints: ['Mitre cut = corner ÷ 2.'], text: 'square frame' }); } },
        { id: '12b', level: 'MAS', make: function (r) {
          var n = r.pick([8, 9, 10, 12]), g = poly(n);
          return angBoxes('A frame is a ' + PNAME[n] + ' (' + n + ' equal sides and ' + n + ' equal corners). Find the corner angle, the cut angle and the mitre saw setting.', [
            { label: 'corner:', name: 'corner', deg: g.corner, alts: [{ v: g.sum, code: 'u5l5-sum', hint: 'That’s the sum of all ' + n + ' corners. Divide by ' + n + ' to get one corner.' }, { v: 360 / n, code: 'u5l5-sum', hint: 'Find the angle sum first: ' + t('(n-2)\\times 180^\\circ') + ', then divide by ' + n + '.' }] },
            { label: 'cut:', name: 'cut', deg: g.cut, alts: [{ v: g.corner, code: 'u5l5-corner', hint: 'The cut is <b>half</b> the corner (the joint bisects it).' }, { v: g.saw, code: 'u5l5-setting', hint: 'That’s the saw setting. The cut angle is the corner ÷ 2.' }, { v: g.sum / 2, code: 'u5l5-sum', hint: 'Halve <b>one corner</b>, not the angle sum.' }] },
            { label: 'saw setting:', name: 'saw setting', deg: g.saw, alts: [{ v: g.cut, code: 'u5l5-setting', hint: 'That’s the cut angle. The saw setting = 90° − the cut angle.' }, { v: 180 - g.cut, code: 'u5l5-setting', hint: 'The saw scale measures from a square cut: 90° − the cut angle.' }] }],
            'Sum ' + t('=(' + n + '-2)\\times 180^\\circ=' + g.sum + '^\\circ') + '; corner ' + t('=' + g.sum + '^\\circ\\div ' + n + '=' + f1(g.corner) + '^\\circ') + '<br>Cut ' + t('=' + f1(g.corner) + '^\\circ\\div 2=' + f1(g.cut) + '^\\circ') + '; saw setting ' + t('=90^\\circ-' + f1(g.cut) + '^\\circ=' + f1(g.saw) + '^\\circ'),
            ['Angle sum = (n − 2) × 180°. One corner = sum ÷ n.', 'Cut = corner ÷ 2. Saw setting = 90° − cut.'], 'polygon frame');
        } }] },
      { num: '13', stem: function (sh) { var L = LEAH[sh.m]; return sh.who + ' copies an angle with a compass. Here is what ' + sh.she + ' did:<br>&nbsp;&nbsp;Step 1: arc from the vertex ' + t('B') + ', crossing both arms at ' + t('P') + ' and ' + t('Q') + '.<br>&nbsp;&nbsp;Step 2: ' + L.s2 + '<br>&nbsp;&nbsp;Step 3: ' + L.s3 + '<br>&nbsp;&nbsp;Step 4: ' + L.s4 + '<br>' + (sh.she === 'she' ? 'Her' : 'His') + ' copy does not match the angle.'; },
        shared: function (r) { var w = r.pick([['Leah', 'she'], ['Tyler', 'he'], ['Priya', 'she'], ['Noah', 'he']]); return { m: r.pick(['step2', 'step2', 'step3', 'step4']), who: w[0], she: w[1] }; },
        parts: [
          { id: '13', level: 'PRG', make: function (r, sh) {
            var opts = [
              { k: 'step2', html: 'In Step 2 the width changed. The arc from ' + t('E') + ' must have the <b>same</b> width as the arc from ' + t('B') + '.' },
              { k: 'step3', html: 'In Step 3 the width should be the distance from ' + t('Q') + ' to ' + t('P') + ', not the Step 1 width.' },
              { k: 'step4', html: 'In Step 4 the new arm must start at the vertex: draw ray ' + t('ES') + ', not ' + t('RS') + '.' },
              { k: 'none', html: 'Nothing is wrong. Compass copies never match exactly.' }];
            var WHY = { step2: 'Step 2 is fine here: the arc from ' + t('E') + ' kept the same width as Step 1.', step3: 'Step 3 is fine here: the compass was set to the distance from ' + t('Q') + ' to ' + t('P') + '.', step4: 'Step 4 is fine here: the ray starts at the new vertex ' + t('E') + '.', none: 'Done carefully, a compass copy matches. One of the steps was done wrong.' };
            var right = opts.filter(function (o) { return o.k === sh.m; })[0];
            return P.mc(r, 'Find the mistake and how to fix it.', opts.map(function (o) { return { html: o.html, right: o.k === sh.m, why: o.k === sh.m ? null : WHY[o.k], code: 'leah-' + o.k }; }),
              right.html + '<br>(Steps 1 and 2 use the same width; only Step 3 changes it, to the distance from ' + t('Q') + ' to ' + t('P') + '. Step 4 is the ray from the new vertex ' + t('E') + ' through ' + t('S') + '.)', ['Compare each step with the copy steps in the lesson.'], 'Leah mistake', true);
          } }] },
      { num: '14', stem: 'Puzzles. Use guess and check if it helps.', parts: [
        { id: '14a', level: 'ADV', make: function (r) { var s = r.pick([11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28]), a = 4 * s; return angPart('An angle is bisected. Then one of the halves is bisected again. The smallest angle is ' + Dg(s) + '. What was the first angle?', a, { alts: [{ v: 2 * s, code: 'u5l5-back-once', hint: 'That undoes only the <b>second</b> bisection. It was bisected twice: double twice.' }, { v: 8 * s, code: 'u5l5-back-thrice', hint: 'Only two bisections: double twice, not three times.' }, { v: s / 4, code: 'u5l5-halved', hint: 'Work <b>backward</b>: the first angle is bigger. Double instead of halving.' }, { v: 3 * s, code: 'u5l5-back-once', hint: 'Undo each bisection by doubling: ' + t(s + '\\times 2') + ', then × 2 again.' }], sol: 'Work backward: ' + t(s + '^\\circ\\times 2=' + 2 * s + '^\\circ') + ', then ' + t(2 * s + '^\\circ\\times 2=' + a + '^\\circ') + '.<br>The first angle was ' + T(a) + '.', hints: ['Work backward: undo each bisection.', 'Undoing a bisection means × 2.'], text: 'double bisect' }); } },
        { id: '14b', level: 'MAS', make: function (r) { var S = r.pick([60, 75, 105, 120, 135, 150, 165]), a = S * 2 / 3; return angPart('An angle and one of its halves add up to ' + Dg(S) + '. What is the angle?', a, { alts: [{ v: S / 2, code: 'u5l5-half-of-sum', hint: 'Check: ' + t(f1(S / 2) + '+' + f1(S / 4) + '=' + f1(S * 3 / 4)) + ', not ' + S + '. The angle plus <b>half of itself</b> is ' + S + '°.' }, { v: S / 3, code: 'u5l5-third', hint: 'That’s the <b>half</b>. The angle is twice that.' }, { v: S, code: 'u5l5-half-of-sum', hint: 'Check: ' + S + ' + ' + f1(S / 2) + ' is more than ' + S + '. Try a smaller angle.' }], sol: 'Guess and check: the angle + its half = ' + Dg(S) + '.<br>Try ' + Dg(a - 10) + ': ' + t(f1(a - 10) + '+' + f1((a - 10) / 2) + '=' + f1((a - 10) * 1.5)) + ' (too small).<br>Try ' + Dg(a) + ': ' + t(f1(a) + '+' + f1(a / 2) + '=' + S) + ' ✓<br>The angle is ' + T(a) + '. (The angle is 2 halves, so 3 halves make ' + Dg(S) + ': one half is ' + t(S + '\\div 3=' + f1(S / 3)) + '.)', hints: ['Guess an angle, add half of it, and compare with ' + S + '°.', 'The angle is two halves, so the total is three halves.'], text: 'angle plus half' }); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var x = find(function () { return r.pick(range(100, 170, 2)); }, function (v) { var a = [v / 2, v / 4, 180 - v, 2 * v]; return v !== 128 && a.every(function (z, i) { return a.indexOf(z) === i; }); }, 136);
          var p = P.mc(r, 'An angle of ' + Dg(x) + ' is bisected. What is the size of each new angle?', [{ html: Dg(x / 4), why: 'That divides by 4. Bisect means two equal parts: ÷ 2.', code: 'quarter' }, { html: Dg(180 - x), why: 'That’s ' + t('180^\\circ-' + x + '^\\circ') + '. Bisecting means dividing by 2.', code: 'supp' }, { html: Dg(x / 2), right: true }, { html: Dg(2 * x), why: 'That doubles the angle. Each half is smaller: ÷ 2.', code: 'double' }].sort(function (a, b) { return parseFloat(a.html) - parseFloat(b.html); }),
            t(x + '\\div 2=' + f1(x / 2) + '^\\circ'), ['Bisect = cut into 2 equal parts.'], 'MC bisect', true);
          p.input.columns = 4; return p;
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '16', level: 'BEG', make: function (r) { return toolMC(r); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'PRG', make: function (r) { var n = r.pick([5, 5, 9, 10, 12, 15, 18, 20]), g = poly(n);
          return angPart('A frame is shaped like a ' + PNAME[n] + ' (' + n + ' sides). The cut angle at each end of a piece, in degrees, is ________.', g.cut, { nr: true, alts: [{ v: g.corner, code: 'u5l5-corner', hint: 'That’s one corner. The cut is half of the corner.' }, { v: g.saw, code: 'u5l5-setting', hint: 'That’s the saw setting (90° − the cut). The question asks for the cut angle.' }, { v: g.sum / 2, code: 'u5l5-sum', hint: 'Find <b>one</b> corner first: sum ÷ ' + n + '.' }, { v: 180 / n, code: 'u5l5-sum', hint: 'Angle sum = ' + t('(n-2)\\times 180^\\circ') + '; one corner = sum ÷ ' + n + '; cut = corner ÷ 2.' }],
            sol: 'Sum ' + t('=(' + n + '-2)\\times 180^\\circ=' + g.sum + '^\\circ') + '; corner ' + t('=' + g.sum + '^\\circ\\div ' + n + '=' + f1(g.corner) + '^\\circ') + '; cut ' + t('=' + f1(g.corner) + '^\\circ\\div 2=' + f1(g.cut) + '^\\circ'), hints: ['Find one corner first, then halve it.'], text: 'NR cut' }); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var h = r.pick(not(range(50.5, 86.5, 1), [81.5])), a = 2 * h;
          return angPart('An angle is bisected. Each half measures ' + Dg(h) + '. The size of the original angle, in degrees, is ________.', a, { nr: true, alts: [{ v: h / 2, code: 'u5l5-halved', hint: 'The original angle is <b>bigger</b> than each half: half × 2.' }, { v: 180 - h, code: 'u5l5-supp', hint: 'The original angle is two halves: ' + t(f1(h) + '\\times 2') + '.' }], sol: t(f1(h) + '^\\circ\\times 2=' + f1(a) + '^\\circ'), hints: ['Two halves make the whole angle.'], text: 'NR whole' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: function (sh) { return 'Each angle is bisected. Complete the table.' + bisectTable(sh); },
        shared: function (r) {
          return bisectShared(r, [{ find: 'half', pool: [44, 46, 48, 52, 54, 56, 62, 64] }, { find: 'half', pool: [102, 108, 114, 118, 132, 136] }, { find: 'half', pool: [15, 19, 25, 29, 35, 43, 55] }, { find: 'half', pool: [150, 156, 160, 164, 168, 170] },
            { find: 'whole', pool: [27, 31, 36, 38, 41, 44, 47] }, { find: 'whole', pool: [12.5, 18.5, 21.5, 26.5, 29.5, 33.5, 44.5] }], ['(a)', '(b)', '(c)', '(d)', '(e)', '(f)'], [90, 128, 75, 180, 68, 163, 45, 64, 37.5, 34, 81.5]);
        },
        parts: [
          { id: 'e1a', sub: 'a–d', level: 'BEG', make: function (r, sh) { return bisectFields(sh, 0, 4); } },
          { id: 'e1b', sub: 'e–f', level: 'EMG', make: function (r, sh) { return bisectFields(sh, 4, 6); } }] },
      { num: '2', stem: 'Measure ' + t('\\angle XYZ') + ' with a protractor. Then use the protractor to copy it onto ray ' + t('AB') + ', with its vertex at ' + t('A') + '.',
        shared: function (r) { return protShared(r, r.pick(not(range(40, 140, 1), [64, 90, 128, 112])), ['X', 'Y', 'Z']); },
        parts: [
          { id: 'e2a', level: 'EMG', make: function (r, sh) { return angBoxes('What does ' + t('\\angle XYZ') + ' measure? (Read it to the nearest degree.)' + protSVG(sh), [readBox(sh)], readSol(sh), ['Use the scale that starts at 0 on one arm.', 'Acute or obtuse? Check that your reading makes sense.'], 'read XYZ'); } },
          { id: 'e2b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'To copy it, you put the protractor’s centre on ' + t('A') + ' and its 0 line on ' + t('AB') + '. Where do you mark the dot for the new arm?', [
              { html: 'At ' + Dg(sh.x) + ' on the scale that starts at 0 on ' + t('AB'), right: true },
              { html: 'At ' + Dg(sh.x) + ' on the other scale', why: 'The other scale would give ' + Dg(180 - sh.x) + '. Use the scale that starts at 0 on ' + t('AB') + '.', code: 'other' },
              { html: 'At ' + Dg(180 - sh.x) + ' on the scale that starts at 0 on ' + t('AB'), why: 'The copy must be the <b>same size</b>: ' + Dg(sh.x) + ', not ' + Dg(180 - sh.x) + '.', code: 'supp' },
              { html: 'At 90° and then ' + Dg(Math.abs(sh.x - 90)) + ' more', why: 'No need for 90°: mark ' + Dg(sh.x) + ' directly on the scale that starts at 0 on ' + t('AB') + '.', code: 'ninety' }],
              'Mark a dot at ' + T(sh.x) + ' on the scale that starts at 0 on ' + t('AB') + ', then join ' + t('A') + ' to the dot.', ['The copy must be the same size, measured from AB.'], 'copy with protractor');
          } }] },
      { num: '3', stem: 'Bisect ' + t('\\angle MNO') + ' with a compass and straightedge. Measure each half. What should each half be?',
        shared: function (r) { return protShared(r, r.pick(not(range(96, 136, 2), [128, 112, 120])), ['M', 'N', 'O']); },
        parts: [
          { id: 'e3a', level: 'EMG', make: function (r, sh) { return angBoxes('Read ' + t('\\angle MNO') + ' from the protractor. What should each half be?' + protSVG(sh), [readBox(sh), halfBox(sh)], readSol(sh) + '<br>Each half: ' + t(sh.x + '\\div 2=' + f1(sh.x / 2) + '^\\circ'), ['Obtuse angle: the reading is more than 90°.', 'Each half = the angle ÷ 2.'], 'bisect MNO'); } },
          { id: 'e3b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'After the first arc from ' + t('N') + ' crosses the arms at ' + t('P') + ' and ' + t('Q') + ', you draw equal arcs from ' + t('P') + ' and ' + t('Q') + '. How wide must the compass be for those two arcs?', [
              { html: 'More than half the distance from ' + t('P') + ' to ' + t('Q') + ', the same for both arcs', right: true },
              { html: 'Less than half the distance from ' + t('P') + ' to ' + t('Q') + '', why: 'Then the two arcs won’t reach each other, so they never cross.', code: 'less' },
              { html: 'Any width, and it can change between the two arcs', why: 'The two arcs must use the <b>same</b> width, or their crossing isn’t on the bisector.', code: 'change' },
              { html: 'Exactly the width of the first arc from ' + t('N') + ', and no other', why: 'That width often works, but it isn’t required: any width more than half of ' + t('PQ') + ' works, as long as both arcs use it.', code: 'first' }],
              'Open the compass to <b>more than half</b> the distance from ' + t('P') + ' to ' + t('Q') + ', and don’t change it between the two arcs. Then they cross at a point on the bisector.', ['What happens if the arcs are too small?'], 'bisect width');
          } }] },
      { num: '4', stem: function (sh) { return 'Construct the perpendicular bisector of segment ' + t('EF') + '. Label the midpoint ' + t('M') + '. Segment ' + t('EF') + ' is ' + f1(sh.L) + ' cm long.' + segSVG(sh.L, ['E', 'F']); }, outcome: 'G5',
        shared: function (r) { return { L: r.pick([5.5, 6.5, 7, 7.5, 8.5, 9, 10, 11]) }; },
        parts: [
          { id: 'e4', level: 'BEG', make: function (r, sh) { var h = sh.L / 2; return P.fields('How long should ' + t('EM') + ' be?', [{ label: t('EM') + ' =', after: 'cm', name: 'EM' }], [lenChk(h, [{ v: sh.L, code: 'u5l5-no-mid', hint: t('M') + ' is the midpoint: halfway along ' + t('EF') + '. Divide by 2.' }, { v: 2 * sh.L, code: 'u5l5-doubled', hint: 'Divide by 2, don’t multiply.' }])], [nS(h)], t('EM') + ' = ' + nS(h) + ' cm', t(nS(sh.L) + '\\div 2=' + nS(h)) + ' cm. The bisector meets ' + t('EF') + ' at 90°.', ['The midpoint is halfway.'], 'EM'); } }] },
      { num: '5', stem: function (sh) { return 'Sort each pair of lines as parallel, perpendicular or neither.' + sh.S.svg; }, outcome: 'G5',
        shared: function (r) { var v = e5Lines(r) || { lines: [{ name: 'p', p: [0, 0.3], dir: 8, len: 6.2 }, { name: 'q', p: [0, 1.5], dir: 8, len: 6.2 }, { name: 'r', p: [1.4, -0.2], dir: 83, len: 3.6 }, { name: 's', p: [4.6, 2.9], dir: 98, len: 1.2 }] }; return { S: sortSetup(v.lines, [[0, 1], [0, 2], [1, 3], [0, 3]]) }; },
        parts: [
          { id: 'e5', level: 'PRG', make: function (r, sh) { var S = sh.S; return P.grid('Sort each pair.', S.rows, SORT_COLS, S.want, { rowHead: 'pair', why: S.why }, S.sol + '<br>Extend ' + t('s') + ' with a ruler: it crosses ' + t('q') + ' and then ' + t('p') + ' at right angles.', ['Parallel: never meet. Perpendicular: meet at 90°. Neither: meet at another angle.', 'Extend the short line.'], 'sort pqrs'); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A reflex angle of ' + Dg(sh.R) + ' is bisected.'; },
        shared: function (r) { return { R: r.pick(not(range(196, 348, 2), [250, 270, 300, 330])) }; },
        parts: [
          { id: 'e6a', level: 'BEG', make: function (r, sh) { var h = sh.R / 2; return angPart('What is the size of each half?', h, { alts: [{ v: 360 - sh.R, code: 'u5l5-supp', hint: 'That’s the small angle (' + t('360^\\circ-' + sh.R + '^\\circ') + '). Bisect the reflex angle: ' + t(sh.R + '\\div 2') + '.' }, { v: (360 - sh.R) / 2, code: 'u5l5-supp', hint: 'Bisect the <b>reflex</b> angle itself: ' + t(sh.R + '\\div 2') + '.' }, { v: 2 * sh.R, code: 'u5l5-doubled', hint: 'Divide by 2.' }], sol: t(sh.R + '^\\circ\\div 2=' + f1(h) + '^\\circ'), hints: ['Each half = angle ÷ 2.'], text: 'reflex half' }); } },
          { id: 'e6b', level: 'EMG', make: function (r, sh) { var h = sh.R / 2; return GP.classify(r, 'What type of angle is each half?', h, { sol: f1(h) + '° is between 90° and 180°, so each half is <b>' + G.kindOf(h) + '</b>.', hints: ['Compare your answer to (a) with 90° and 180°.'], text: 'reflex half type' }); } }] },
      { num: '7', stem: function (sh) { return 'A framer checks a wall stud. It makes an angle of ' + Dg(sh.x) + ' with the floor plate on one side.'; }, outcome: 'G5',
        shared: function (r) { return { x: r.pick([87.5, 88, 88.5, 89, 89.5, 90.5, 91, 91.5, 92, 93, 93.5]) }; },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Is the stud perpendicular to the floor plate?', [
              { html: '<b>No.</b> Perpendicular means exactly 90°, and ' + Dg(sh.x) + ' is not 90°.', right: true },
              { html: '<b>Yes.</b> ' + Dg(sh.x) + ' rounds to 90°.', why: 'Perpendicular means <b>exactly</b> 90°. Even ' + Dg(Math.abs(90 - sh.x)) + ' off makes a wall lean.', code: 'round' },
              { html: '<b>Yes.</b> The stud and the plate meet, so they are perpendicular.', why: 'Meeting isn’t enough: they must meet at exactly 90°.', code: 'meet' },
              { html: '<b>No.</b> A stud and a floor plate are parallel.', why: 'They meet, so they can’t be parallel. They are neither, because the angle isn’t 90°.', code: 'par' }],
              'No. Perpendicular means exactly 90°; ' + Dg(sh.x) + ' is not 90°.', ['What does perpendicular mean exactly?'], 'stud perp');
          } },
          { id: 'e7b', level: 'BEG', make: function (r, sh) { var a = q(180 - sh.x); return angPart('What angle does it make on the other side?', a, { alts: [{ v: Math.abs(90 - sh.x), code: 'u5l5-from180', hint: 'The two angles make a straight line: they add to 180°.' }, { v: sh.x, code: 'u5l5-straight', hint: 'The two sides add to 180°: ' + t('180^\\circ-' + f1(sh.x) + '^\\circ') + '.' }], sol: t('180^\\circ-' + f1(sh.x) + '^\\circ=' + f1(a) + '^\\circ'), hints: ['The floor plate is a straight line.'], text: 'stud other side' }); } },
          { id: 'e7c', level: 'EMG', make: function (r, sh) { var a = q(Math.abs(sh.x - 90)); return angPart('By how many degrees must the stud be moved?', a, { alts: [{ v: q(180 - sh.x), code: 'u5l5-from180', hint: 'Compare with 90°, not 180°.' }], sol: (sh.x > 90 ? t(f1(sh.x) + '^\\circ-90^\\circ=' + f1(a) + '^\\circ') : t('90^\\circ-' + f1(sh.x) + '^\\circ=' + f1(a) + '^\\circ')), hints: ['How far is it from 90°?'], text: 'stud move' }); } }] },
      { num: '8', stem: function (sh) { return 'Noor is making a frame shaped like ' + (sh.n === 3 ? 'an equilateral triangle (3 equal sides and 3 equal corners)' : 'a square (4 equal sides and 4 equal corners)') + '.'; },
        shared: function (r) { return { n: r.pick([3, 3, 3, 4]) }; },
        parts: [
          { id: 'e8a', level: 'BEG', make: function (r, sh) { var g = poly(sh.n); return angPart('Find the corner angle.', g.corner, { alts: [{ v: g.sum, code: 'u5l5-sum', hint: 'That’s the sum of all ' + sh.n + ' corners. Divide by ' + sh.n + '.' }, { v: 90, code: 'u5l5-wrong-tri', hint: 'A triangle’s angles add to 180°; three equal corners.' }], sol: 'Sum ' + t('=(' + sh.n + '-2)\\times 180^\\circ=' + g.sum + '^\\circ') + '; corner ' + t('=' + g.sum + '^\\circ\\div ' + sh.n + '=' + g.corner + '^\\circ'), hints: ['Angle sum = (n − 2) × 180°.'], text: 'triangle corner' }); } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) { var g = poly(sh.n); return angBoxes('Find the cut angle at each end of a piece, and the mitre saw setting.', [{ label: 'cut:', name: 'cut', deg: g.cut, alts: [{ v: g.corner, code: 'u5l5-corner', hint: 'The cut is half the corner.' }, { v: g.saw, code: 'u5l5-setting', hint: 'That’s the saw setting. Cut = corner ÷ 2.' }] }, { label: 'saw setting:', name: 'saw setting', deg: g.saw, alts: [{ v: g.cut, code: 'u5l5-setting', hint: 'Saw setting = 90° − the cut angle.' }] }], 'Cut ' + t('=' + g.corner + '^\\circ\\div 2=' + g.cut + '^\\circ') + '; saw setting ' + t('=90^\\circ-' + g.cut + '^\\circ=' + g.saw + '^\\circ'), ['Cut = corner ÷ 2.', 'Saw setting = 90° − cut.'], 'triangle cut'); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'EMG', make: function (r) { var c = r.pick(not(range(124, 172, 2), [128, 150, 120])), h = c / 2; return angPart('In a bay window, two walls meet at a corner of ' + Dg(c) + '. Two pieces of baseboard meet in this corner with a mitre joint that bisects the corner. What angle does each joint line make with its wall?', h, { alts: [{ v: 180 - c, code: 'u5l5-supp', hint: 'The joint <b>bisects</b> the corner: corner ÷ 2.' }, { v: 90 - h, code: 'u5l5-setting', hint: 'That’s a saw setting. The question asks for the angle with the wall: corner ÷ 2.' }, { v: c, code: 'u5l5-no-half', hint: 'Each piece gets half of the corner.' }], sol: t(c + '^\\circ\\div 2=' + f1(h) + '^\\circ') + ' for each piece.', hints: ['The joint line bisects the corner.'], text: 'bay window' }); } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'PRG', make: function (r) {
          var sq = r.chance(0.3), w = sq ? r.pick([1.2, 1.5]) : r.pick([1.5, 1.8, 2.0, 2.4]), h = sq ? w : r.pick([0.9, 1.0, 1.2]), who = r.pick(['Dev', 'Jess', 'Arjun', 'Mei']);
          var opts = sq ? [
            { html: '<b>Yes.</b> The gate is a square, so the corner-to-corner brace bisects the 90° corner: 45°.', right: true },
            { html: '<b>No.</b> A brace never bisects a corner.', why: 'In a <b>square</b> it does: fold the square along the brace and the sides land on each other.', code: 'never' },
            { html: '<b>No.</b> The brace makes 90° with the top rail.', why: 'The brace runs corner to corner, so it slants: it is not perpendicular to the rail.', code: 'ninety' },
            { html: '<b>Yes.</b> Every corner-to-corner brace makes 45°, whatever the gate’s shape.', why: 'Only in a square. In a long rectangle the brace is flatter.', code: 'always' }] : [
            { html: '<b>No.</b> A corner-to-corner brace bisects the corner only in a square. This gate is longer than it is high, so the two angles aren’t equal.', right: true },
            { html: '<b>Yes.</b> Every corner-to-corner brace bisects the 90° corner.', why: 'Fold the gate along the brace: the ' + f1(w) + ' m side and the ' + f1(h) + ' m side don’t land on each other, so the two angles aren’t equal.', code: 'always' },
            { html: '<b>Yes.</b> 90° ÷ 2 = 45°, so it has to be 45°.', why: 'That only works if the brace really bisects the corner — and in a rectangle that isn’t a square, it doesn’t.', code: 'calc' },
            { html: '<b>No.</b> The brace makes 90° with the top rail.', why: 'The brace slants from corner to corner; it is not perpendicular to the rail.', code: 'ninety' }];
          return P.mc(r, 'A gate is a ' + (sq ? 'square' : 'rectangle') + ' ' + f1(w) + ' m wide and ' + f1(h) + ' m high. A brace runs from one corner to the opposite corner. ' + who + ' says the brace makes 45° with the top rail, “because it bisects the corner.” Is ' + who + ' right?', opts,
            sq ? 'Yes. In a square the corner-to-corner brace bisects the 90° corners: ' + t('90^\\circ\\div 2=45^\\circ') + '.' : 'No. The brace bisects the corner only in a square. Fold the gate along the brace: the ' + f1(w) + ' m side and the ' + f1(h) + ' m side don’t land on each other, so the angles aren’t equal (a scale drawing shows the brace makes about ' + Math.round(Math.atan(h / w) / RAD) + '° with the top rail).', ['Does the brace cut the corner into two equal angles? Think about folding the gate along it.'], 'gate brace');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', outcome: 'G5', parts: [
        { id: 'e11', level: 'EMG', make: function (r) { var x = r.pick([85, 86, 87, 88, 89, 91, 92, 93, 94]);
          return P.mc(r, 'Two lines meet at an angle of ' + Dg(x) + '. Which statement is true?', [
            { html: 'They are parallel, because they are close to 90°.', why: 'Lines that meet can’t be parallel.', code: 'par' },
            { html: 'They are perpendicular, because ' + Dg(x) + ' rounds to 90°.', why: 'Perpendicular needs <b>exactly</b> 90°.', code: 'round' },
            { html: 'They are neither, because they meet but not at 90°.', right: true },
            { html: 'They are neither, because they never meet.', why: 'They do meet — at ' + Dg(x) + '.', code: 'never' }],
            'C. Perpendicular needs exactly 90°; lines that meet can’t be parallel; and these lines do meet. So they are <b>neither</b>.', ['Parallel: never meet. Perpendicular: exactly 90°.'], 'MC 88', true); } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'EMG', make: function (r) { var x = r.pick(not(range(101, 177, 2), [163, 75, 157])), h = x / 2;
          return angPart('An angle of ' + Dg(x) + ' is bisected. Each new angle, to the nearest tenth of a degree, is ________.', h, { nr: true, alts: [{ v: Math.floor(h), code: 'u5l5-round-half', hint: 'Keep the tenth: ' + t(x + '\\div 2=' + f1(h)) + '.' }, { v: Math.ceil(h), code: 'u5l5-round-half', hint: 'Keep the tenth: ' + t(x + '\\div 2=' + f1(h)) + '.' }, { v: 2 * x, code: 'u5l5-doubled', hint: 'Divide by 2.' }, { v: 180 - x, code: 'u5l5-supp', hint: 'Bisect means ÷ 2.' }], sol: t(x + '^\\circ\\div 2=' + f1(h) + '^\\circ'), hints: ['Each new angle = angle ÷ 2.'], text: 'NR half' }); } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A hockey player passes the puck off the boards to a teammate. The puck hits the boards at an angle of ' + Dg(sh.x) + ' and bounces off at ' + Dg(sh.x) + ' on the other side.' + puckSVG(sh.x); },
        shared: function (r) { return { x: r.pick(not(range(24, 52), [35, 32, 40, 27])) }; },
        parts: [
          { id: 'e13a', level: 'PRG', outcome: 'G5', make: function (r, sh) { var a = 180 - 2 * sh.x; return angPart('What is the angle between the path in and the path out?', a, { alts: [{ v: 180 - sh.x, code: 'u5l5-straight', hint: 'There are <b>two</b> ' + Dg(sh.x) + ' angles on the boards. Subtract both from 180°.' }, { v: 2 * sh.x, code: 'u5l5-straight', hint: 'That’s the two marked angles together. The angle between the paths is what’s left of 180°.' }, { v: 90 - sh.x, code: 'u5l5-from180', hint: 'The three angles along the straight boards add to 180°, not 90°.' }], sol: 'The three angles along the boards make 180°:<br>' + t('180^\\circ-' + sh.x + '^\\circ-' + sh.x + '^\\circ=' + a + '^\\circ'), hints: ['The boards are a straight line: 180°.'], text: 'puck between' }); } },
          { id: 'e13b', level: 'ADV', outcome: 'G5', make: function (r, sh) { var a = 90 - sh.x; return angPart('Draw a line perpendicular to the boards where the puck hits. What angle does it make with each path?', a, { alts: [{ v: sh.x, code: 'u5l5-from180', hint: 'That’s the angle with the boards. The perpendicular line is at 90° to the boards.' }, { v: 180 - 2 * sh.x, code: 'u5l5-no-half', hint: 'That’s the whole angle between the paths. The perpendicular splits it.' }, { v: 180 - sh.x, code: 'u5l5-from180', hint: 'Each path and the perpendicular fit inside a 90° corner with the ' + Dg(sh.x) + ' angle.' }], sol: 'The perpendicular makes 90° with the boards:<br>' + t('90^\\circ-' + sh.x + '^\\circ=' + (90 - sh.x) + '^\\circ') + ' with each path.', hints: ['The perpendicular and the boards make a 90° corner.'], text: 'puck perp' }); } },
          { id: 'e13c', level: 'PRG', make: function (r, sh) { var a = 180 - 2 * sh.x;
            return P.mc(r, 'What does the perpendicular line do to the angle in (a)?', [{ html: 'It <b>bisects</b> it: ' + t(a + '^\\circ\\div 2=' + (a / 2) + '^\\circ') + ' on each side.', right: true }, { html: 'It is parallel to both paths.', why: 'It meets both paths where the puck hits, so it can’t be parallel to them.', code: 'par' }, { html: 'It makes a right angle with each path.', why: 'It makes 90° with the <b>boards</b>, not with the paths: ' + Dg(90 - sh.x) + ' with each path.', code: 'perp' }, { html: 'It cuts it into ' + Dg(sh.x) + ' and ' + Dg(a - sh.x) + '.', why: 'Compare your answer to (b) on both sides: they are equal.', code: 'uneq' }],
              'It bisects it: the two halves are each ' + Dg(90 - sh.x) + ', and ' + t('2\\times ' + (90 - sh.x) + '^\\circ=' + a + '^\\circ') + '.', ['Compare (a) and (b).'], 'puck bisects'); } }] },
      { num: '14', stem: 'Use only a compass and a straightedge to construct a 45° angle with its vertex at ' + t('P') + ' on a line. (Hint: first make a 90° angle.)', parts: [
        { id: 'e14', level: 'ADV', make: function (r) {
          var it = [
            { id: 'q1', short: 'arcs from P', html: 'Put the compass point on ' + t('P') + ' and draw arcs that cross the line on both sides, at ' + t('X') + ' and ' + t('Y') + '.', why: '' },
            { id: 'q2', short: 'wider arcs from X and Y', html: 'Open the compass wider. Draw equal arcs from ' + t('X') + ' and from ' + t('Y') + ' that cross above ' + t('P') + ' at ' + t('Q') + '.', why: 'You need ' + t('X') + ' and ' + t('Y') + ' first.' },
            { id: 'q3', short: 'line PQ (90°)', html: 'Draw line ' + t('PQ') + '. It makes a 90° angle with the line.', why: 'The line goes through ' + t('Q') + ', so make ' + t('Q') + ' first.' },
            { id: 'q4', short: 'arc from P across the 90°', html: 'Put the compass point on ' + t('P') + ' and draw an arc that crosses both arms of the 90° angle.', why: 'You need the 90° angle (line PQ) before you can bisect it.' },
            { id: 'q5', short: 'equal arcs inside the 90°', html: 'From the two crossings, draw equal arcs inside the 90° angle that cross at ' + t('D') + '.', why: 'You need the crossings on the arms of the 90° angle first.' },
            { id: 'q6', short: 'ray PD (45°)', html: 'Draw the ray from ' + t('P') + ' through ' + t('D') + '. It makes a 45° angle with the line.', why: 'The ray goes through ' + t('D') + ', so make ' + t('D') + ' first.' }];
          return orderPart(r, 'Put the steps in order.', it, it.map(function (s, i) { return '<b>Step ' + (i + 1) + '.</b> ' + s.html; }).join('<br>') + '<br>Steps 1–3 make a 90° angle (the perpendicular at ' + t('P') + '); steps 4–6 bisect it: ' + t('90^\\circ\\div 2=45^\\circ') + '.', ['First make a 90° angle (the perpendicular at P).', 'Then bisect the 90° angle.'], '45 construction');
        } }] },
      { num: '15', stem: function (sh) { return 'A flagpole is checked with a level. From the ' + sh.ok + ' it makes 90° with the ground. From the ' + sh.off + ' it makes ' + Dg(sh.x) + ' with the ground.'; }, outcome: 'G5',
        shared: function (r) { var fr = r.chance(0.5); return { ok: fr ? 'front' : 'side', off: fr ? 'side' : 'front', x: r.pick([86, 86.5, 87, 87.5, 88, 92, 92.5, 93, 94]) }; },
        parts: [
          { id: 'e15a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Is the pole perpendicular to the ground?', [
              { html: '<b>No.</b> It must be 90° in every direction, and from the ' + sh.off + ' it is ' + Dg(sh.x) + '.', right: true },
              { html: '<b>Yes.</b> It is 90° from the ' + sh.ok + ', and that is enough.', why: 'The ground is a flat surface: the pole must be 90° in <b>both</b> directions.', code: 'one' },
              { html: '<b>Yes.</b> ' + Dg(sh.x) + ' is close enough to 90°.', why: 'Perpendicular means exactly 90°.', code: 'close' },
              { html: '<b>No.</b> A flagpole can never be perpendicular to the ground.', why: 'It can — when it is 90° from the front and from the side.', code: 'never' }],
              'No. To be perpendicular to a flat surface it must be 90° in every direction. From the ' + sh.off + ' it is ' + Dg(sh.x) + '.', ['Check both directions.'], 'flagpole perp');
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) { var d = q(Math.abs(90 - sh.x));
            return P.mc(r, 'How many degrees must it be moved, and in which direction of checking?', [
              { html: Dg(d) + ', ' + (sh.off === 'side' ? 'side to side' : 'front to back'), right: true },
              { html: Dg(d) + ', ' + (sh.off === 'side' ? 'front to back' : 'side to side'), why: 'From the ' + sh.ok + ' it is already 90°. Fix the direction that isn’t.', code: 'dir' },
              { html: Dg(q(180 - sh.x)) + ', ' + (sh.off === 'side' ? 'side to side' : 'front to back'), why: 'Compare ' + Dg(sh.x) + ' with 90°, not 180°.', code: 'from180' },
              { html: '90°, both ways', why: 'It only needs to move the difference between ' + Dg(sh.x) + ' and 90°.', code: 'ninety' }],
              t('|90^\\circ-' + f1(sh.x) + '^\\circ|=' + f1(d) + '^\\circ') + ', ' + (sh.off === 'side' ? 'side to side' : 'front to back') + ' (the direction that isn’t 90° yet).', ['How far is ' + Dg(sh.x) + ' from 90°?'], 'flagpole move');
          } }] }
    ]
  });

  /* ---- figures used above (hoisted function declarations) ---- */
  function segSVG(L, nm) {
    nm = nm || ['C', 'D']; var pc = new Pic(), S = 32, A = [0, 0], B = [L * S, 0];
    pc.line(A, B); pc.dot(A); pc.dot(B); pc.text([A[0] - 14, 0], nm[0]); pc.text([B[0] + 14, 0], nm[1]); pc.text([B[0] / 2, 16], f1(L) + ' cm', { size: 14 });
    return pc.svg(360, 'segment ' + nm.join(''));
  }
  /* line m through K at tilt; kind: null (just the line) | 'right' | 'vertical' | 'tilted' | 'offK' */
  function lineKSVG(tilt, kind, mark) {
    var pc = new Pic(), K0 = [0, 0], L = 130, d = tilt;
    pc.line(at(K0, d + 180, L), at(K0, d, L)); pc.text(at(K0, d, L + 14), 'm'); pc.dot(K0); pc.text(at(K0, d + 180 + (tilt > 0 ? 32 : -32), 21), 'K');
    if (kind) {
      var c = BLUE;
      if (kind === 'right') { pc.line(at(K0, d - 90, 40), at(K0, d + 90, 110), { color: c }); if (mark) pc.rt(K0, d, 12, { color: c }); }
      else if (kind === 'vertical') { pc.line(at(K0, 270, 40), at(K0, 90, 110), { color: c }); }
      else if (kind === 'tilted') { var dd = d + 90 + (tilt > 0 ? -28 : 28); pc.line(at(K0, dd + 180, 40), at(K0, dd, 110), { color: c }); }
      else { var F = at(K0, d, 70); pc.dot(F, { color: GREY, r: 2 }); pc.line(at(F, d - 90, 40), at(F, d + 90, 110), { color: c }); }
    }
    return pc.svg(kind && !mark ? 240 : 320, 'line m and point K');
  }
  function puckSVG(x) {
    var pc = new Pic(), O = [0, 0], L = 120;
    pc.s += '<rect x="-150" y="0" width="300" height="9" fill="#e3e6eb"/>'; pc.line([-150, 0], [150, 0]); pc.text([150, 18], 'boards', { size: 13 });
    pc.line(at(O, 180 - x, L), O, { color: BLUE }); pc.line(O, at(O, x, L), { color: BLUE });
    pc.mark(O, 180 - x, x, Dg(x), { r: 34 }); pc.mark(O, 0, x, Dg(x), { r: 34 });
    return pc.svg(340, 'puck path off the boards');
  }
})(window);
