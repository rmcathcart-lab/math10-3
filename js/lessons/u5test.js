/* Math 10-3 · Unit 5 Test (G1, G5, G6) — Angles, Parallel Lines and Spatial Puzzles: tangrams and pentominoes, take-away
 * and race games, tic-tac-toe (win, block, fork), the tower puzzle and a hidden-ships grid (G1); measuring, classifying,
 * estimating, drawing, copying and bisecting angles, reflex angles, polygon angle sums and true bearings (G6); complementary,
 * supplementary and vertically opposite angles, perpendicular transversals, naming the angle pairs a transversal makes, and
 * the parallel-line rules (G5). Built the way the Unit 4 test was built (Beginning / Progressing / Mastery boxes, typed
 * answers, keys from the generated numbers, `bad` answers with u5t- codes, worked solutions and hints), with new items in the
 * style of the booklet's review lesson (u5_l09.tex) and Practice Test 2 (u5_ep09.tex). Calculator allowed; the protractor,
 * compass and ruler of the paper test become protractor-reading pictures (readings within 1° are right).
 * Outcomes per part: G1 for puzzles and games (Lessons 5.1–5.2); G6 for measuring, drawing, classifying, estimating, bearings,
 * copying, bisecting and polygon angles (5.3–5.5); G5 for perpendicular / parallel lines, angle partners and transversals
 * (5.5 sorting, 5.6–5.8). Angle pairs are numbered as in the booklet: 1–4 at the top crossing and 5–8 at the bottom one,
 * each clockwise from the upper left (HW.geo.transversalSVG).
 * 28 questions / 28 parts: Beginning 11 parts, Progressing 11, Mastery 6 — about 80 minutes (short_report.js:
 * 1.5 / 3 / 5 min a part). The short version (def.short) is about half of that and keeps every box of all three outcomes.
 *
 *   Beginning   — one-step skills: G6 read a protractor (±1°) and classify the angle; estimate an angle from a picture
 *                 (within 10°); bisect an angle (or find the whole from a half); a direction such as "30° west of south" as
 *                 a true bearing; the angle sum of a polygon. G5 the complement and supplement; name a pair of angles
 *                 (multiple choice); two crossing lines (vertically opposite or on a straight line). G1 the take-away game
 *                 (take 1, 2 or 3; how many to take); tic-tac-toe (the one square that wins or blocks); the area of a
 *                 tangram piece.
 *   Progressing — the typical assignment question: G6 a turned protractor — the angle and its reflex angle; a bearing on a
 *                 map (angle marked from north or south) and the bearing back; the missing angle of a polygon; copying an
 *                 angle with a protractor (which dot to join: multiple choice). G5 ℓ1 ∥ ℓ2 — find an angle and name the
 *                 pair that gives the reason; three lines through one point; are the lines parallel? (multiple choice of
 *                 verdict + reason); balusters and a handrail (perpendicular transversal, complementary). G1 a changed
 *                 take-away rule; the tower puzzle (2ⁿ − 1 moves) timed in minutes and seconds; hidden ships — how many
 *                 places the ship could still be.
 *   Mastery     — skills combined: G6 the angle between two legs of a walk from their bearings; a regular polygon's number
 *                 of sides (and angle sum) from one angle. G5 the angle at a bend between parallel lines; an angle written
 *                 (ax + b)° in a parallel-line pair — x, then another angle. G1 race to N: go first or second, and the
 *                 first square to land on; tic-tac-toe — the one square that makes a fork.
 * Conversions to online: "measure with your protractor" → a protractor picture to read (±1°); "estimate" → a typed estimate
 * accepted within 10°; "draw / copy the angle with a protractor" → multiple choice of dots on a protractor (the trap is the
 * other scale); "give a reason" → the name of the pair typed in a box (any reasonable spelling, HW.geo.pairOf) or, for "are
 * they parallel?", multiple choice of verdict + reason (Progressing only); "sketch the route" → the route is drawn; "list
 * the ship positions" → how many are left (a count); "what is your strategy / should you go first" → the move (a number)
 * and first / second (a word); "construct with a compass" is not asked (the steps can't be checked) — copying is done with
 * a protractor and bisecting by the numbers. Multiple choice only in the Beginning and Progressing boxes.
 * Partial credit: a recognized mistake that is one slip keeps 2/3 ('s'), a bigger but reasonable one keeps 1/3 ('b'), see
 * HW.addPartial below; in a set of 3+ boxes, one box wrong is a small mistake. Bearings use HW.geo.bearingChk (its codes
 * renamed to u5t- ones here so the partial credit is decided in this file); a direction written N30°W, or a pair-name the
 * checker can't read, gets a nudge but no credit if it is left.
 *
 * Also exports HW.u5assess, the assessment kit used by the Unit 5 exit slips (js/exits/u5.js loads after this file).
 * The test uses only the shared geometry kit HW.geo (js/geokit.js), no Unit 5 lesson kit, so tools that load only the test
 * files (tests/short_report.js) still work. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo;
  if (!G || !G.protractorSVG) throw new Error('js/lessons/u5test.js needs HW.geo from js/geokit.js: load it first');
  var A = HW.u5assess = {};

  /* ================= numbers and words ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function dg(x) { return N(x) + '^\\circ'; }                 // an angle, inside t()
  function D(x) { return t(dg(x)); }                           // an angle in TeX
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function find(gen, test, fb) { for (var i = 0; i < 1500; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u5 assessment: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function art(s) { return (/^[aeiou]/i.test(s) ? 'an ' : 'a ') + s; }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function pickX(r, list, not) { return find(function () { return r.pick(list); }, function (v) { return (not || []).indexOf(v) < 0; }, list[0]); }
  function n360(a) { return ((a % 360) + 360) % 360; }
  function n180(a) { a = n360(a); return a > 180 ? a - 360 : a; }
  function b3(b) { return G.bearingText(n360(b)); }
  function BT(b) { return t(b3(b) + '^\\circ'); }
  function kindOf(a) { return G.kindOf(a); }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  Object.assign(A, { rd: rd, q: q, near: near, nS: nS, N: N, dg: dg, D: D, toN: toN, find: find, br: br, cap: cap, pickR: pickR, pickX: pickX, n360: n360, n180: n180, b3: b3, BT: BT, kindOf: kindOf, person: person });

  /* ================= reading and checking a number ================= */
  /* a typed number: "57", "57°", "x = 57", "∠ABC = 57", "angle 6", "12 squares" are all read as the number */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm|operatorname)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    var eq = s.lastIndexOf('='); if (eq >= 0) s = s.slice(eq + 1);
    s = s.replace(/\\angle|∠/g, ' ').replace(/^\s*(angle|square|sq\.?|move)\s*/i, '');
    s = s.replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º|˚/g, ' °').replace(/\\[,;: !]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/°][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u5t-comma', 'Use a decimal point (not a comma), like 37.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d };
  }
  /* an answer rounded to dp places (default 0). o: { dp, exact, alts (other right values), tol (also right when this close:
   * a protractor reading ±1, an estimate ±10), diag [{v, code, hint}] (wrong), nudge [{v, code, hint}] (a format nudge, no
   * try used), word (the rounding place in words), noPlaces (no "round to …" nudge for too few decimals), miss } */
  function amtChk(ans, o) {
    o = o || {};
    var dp = o.dp == null ? 0 : o.dp, step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (dp === 0 ? 'a whole number' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc0 = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var isAcc = function (x) { return isAcc0(x) || (o.tol && Math.abs(x - ans) <= o.tol + 1e-9); };
    var keep = function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); };
    var dgs = (o.diag || []).filter(keep), ng = (o.nudge || []).filter(keep);
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc0(v) || (d <= dp && isAcc(v)) || (o.tol && Math.abs(v - ans) <= o.tol + 1e-9)) return ok();
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      for (var j = 0; j < ng.length; j++) if (near(v, ng[j].v, tol) || near(v, rd(ng[j].v, dp), tol)) return form(ng[j].code, ng[j].hint);
      for (var i = 0; i < dgs.length; i++) {
        var m = dgs[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
      }
      if (!o.noPlaces && dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u5t-places', 'Round to ' + word + '.');
      if (dp >= 1 && d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u5t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  function keyOf(ans, o) { o = o || {}; return nS(rd(ans, o.dp == null ? 0 : o.dp)); }
  function badOf(o, ans) {
    var dp = o.dp == null ? 0 : o.dp, acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    return (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }) && !(o.tol && Math.abs(rd(m.v, dp) - ans) <= o.tol + 1e-9); })
      .map(function (m) { return keyOf(m.v, o); });
  }
  function uT(u) { if (!u) return ''; if (u === '°') return '^\\circ'; var m = /^(.*?)([²³])$/.exec(u); return m ? '\\text{ ' + m[1] + '}^{' + (m[2] === '²' ? 2 : 3) + '}' : '\\text{ ' + u + '}'; }

  /* ================= words: a choice typed in a box ================= */
  var STOP = { the: 1, it: 1, is: 1, a: 1, an: 1, angle: 1, angles: 1, are: 1, they: 1, i: 1, go: 1, should: 1, would: 1, you: 1, lines: 1, line: 1, its: 1, to: 1, be: 1, player: 1, turn: 1 };
  function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/\\angle|∠/g, ' ').replace(/[.,'’!:;()?]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
  function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
  function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
  /* -> 'right' | 'wrong' | 'both' | 'none' | 'empty' */
  function whichOf(resp, right, wrongs) {
    var ws = words(resp); if (!ws.length) return 'empty';
    var a = hit(ws, right), b = hit(ws, wrongs);
    return a && b ? 'both' : a ? 'right' : b ? 'wrong' : 'none';
  }
  /* a word box. o: { right: [tokens], wrongs: [tokens], choices (text for the nudge), why (hint when wrong), code (default 'value') }
   * Anything that isn't one of the choices gets a nudge with code 'word' (no credit if it is left: TestCore.FORM_NO_CREDIT). */
  function wordChk(o) {
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var w = whichOf(resp, o.right, o.wrongs);
      if (w === 'empty') return form('empty', 'Type your answer first.');
      if (w === 'right') return ok();
      if (w === 'wrong') return wrong(o.code || 'value', typeof o.why === 'function' ? o.why(resp) : o.why || null);
      return form('word', 'Type just one of: ' + o.choices + '.');
    };
  }

  /* ================= part builders ================= */
  /* one number. o as amtChk, plus after (unit after the box: '°'), unit, sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {};
    var key = keyOf(ans, o), after = o.after, unit = o.unit !== undefined ? o.unit : after;
    var p = { prompt: prompt, input: { type: 'number', after: after }, check: amtChk(ans, o), key: key, answer: t(HW.fmt(key) + uT(unit)), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badOf(o, ans); p.good = [];
    if (after === '°') p.good.push(key + '°');
    return p;
  }
  /* a number box in a set of boxes */
  function fld(label, ans, o) {
    o = o || {}; var key = keyOf(ans, o);
    return { label: label, name: o.name, after: o.after, chk: amtChk(ans, o), key: key, show: t(HW.fmt(key) + uT(o.after)), bad: badOf(o, ans) };
  }
  /* a word box in a set of boxes. o: wordChk options + key (shown answer), ph, name, bad (wrong words) */
  function wfld(label, o) { return { label: label, name: o.name, mode: 'text', ph: o.ph, chk: wordChk(o), key: o.key, show: '<b>' + o.key + '</b>', bad: o.bad || [] }; }
  /* several boxes. Grading: all right → correct; one box wrong in a set of 3 or more with no recognized mistake →
   * 'u5t-one-box' (small), of 2 → 'u5t-half-box' (bigger); one recognized mistake → its own code; several wrong boxes
   * with the same recognized mistake → that code; otherwise 'u5t-many-box'. */
  function multiChk(checks, labels) {
    return function (resp) {
      resp = resp || [];
      var res = checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      var lab = function (i) { return labels.length > 1 ? '<b>' + labels[i] + ':</b> ' : ''; };
      var wi = [], fi = [];
      res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); });
      if (!wi.length && !fi.length) return ok();
      if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lab(fi[0]) + (f0.hint || 'Check this one again.')); }
      var w0 = res[wi[0]], hint = lab(wi[0]) + (w0.hint || 'Check this one again.');
      if (wi.length === 1) {
        if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
        if (res.length === 1) return wrong('value', w0.hint || null);
        return wrong(res.length >= 3 ? 'u5t-one-box' : 'u5t-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
      return wrong('u5t-many-box', hint);
    };
  }
  function fieldsPart(prompt, specs, sol, hints, text) {
    var labels = specs.map(function (s) { return String(s.name || s.label).replace(/:$/, '').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s) { return { label: s.label, name: s.name || String(s.label).replace(/:$/, '').replace(/<[^>]+>|\\\(|\\\)/g, ''), after: s.after, mode: s.mode, placeholder: s.ph, wide: s.mode === 'text' }; }) },
      check: multiChk(specs.map(function (s) { return s.chk; }), labels), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return s.label + ' ' + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    var b0 = (specs[0].bad || []).filter(function (x) { return x !== String(specs[0].key); })[0];
    p.bad = [specs.map(function (s, i) { return i === 0 ? (b0 || (s.mode === 'text' ? 'zzz' : '99999')) : String(s.key); })];
    return p;
  }
  /* a word box + a number box ("go first or second, and which square first?"). The number decides the credit: right number
   * but the wrong (or unclear) word → 'u5t-which' (bigger); a wrong number → its own code.
   * o: { amt, dp, after, alts, diag, whichLabel, amtLabel, ph, right, wrongs, rightKey, wrongKey, why, nudge, sol, hints, text } */
  function whichAmtPart(prompt, o) {
    var ao = { dp: o.dp, alts: o.alts, diag: o.diag }, amt = amtChk(o.amt, ao);
    var check = function (resp) {
      resp = resp || []; var w = whichOf(resp[0], o.right, o.wrongs), a = amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.whichLabel + '</b> Type your choice.');
      if (a.v === 'form') return form(a.code, '<b>' + o.amtLabel + '</b> ' + (a.hint || 'Check the format.'));
      if (w === 'right' && a.v === 'correct') return ok();
      if (w !== 'right' && a.v === 'correct') return w === 'both' || w === 'none' ? form('word', 'Type just one choice: ' + o.nudge) : wrong('u5t-which', o.why);
      return wrong(a.code || 'value', '<b>' + o.amtLabel + '</b> ' + (a.hint || 'Check this one again.'));
    };
    var key = [o.rightKey, keyOf(o.amt, ao)];
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.whichLabel, name: 'Choice', mode: 'text', placeholder: o.ph, wide: true }, { label: o.amtLabel, name: 'Number', after: o.after }] },
      check: check, key: key, answer: o.whichLabel + ' <b>' + o.rightKey + '</b><br>' + o.amtLabel + ' ' + t(HW.fmt(key[1]) + uT(o.after)), solution: o.sol, hints: o.hints || [], text: o.text,
      bad: [[o.wrongKey, key[1]]].concat(badOf(ao, o.amt).map(function (b) { return [o.rightKey, b]; })) };
  }
  /* minutes and seconds in two boxes. tot: the answer in seconds (whole). diag [{m, s, code, hint}] */
  function minSecChk(tot, diag) {
    var M0 = Math.floor(tot / 60), S0 = tot - 60 * M0;
    return function (resp) {
      resp = resp || [];
      var sM = String(resp[0] == null ? '' : resp[0]).trim(), sS = String(resp[1] == null ? '' : resp[1]).trim();
      if (!sM && !sS) return form('empty', 'Type the minutes and the seconds.');
      var a = sM ? readNum(sM) : { v: 0, d: 0 }, b = sS ? readNum(sS) : { v: 0, d: 0 };
      if (a.res) return form(a.res.code, '<b>min:</b> ' + a.res.hint); if (b.res) return form(b.res.code, '<b>s:</b> ' + b.res.hint);
      var M = a.v, S = b.v, T = M * 60 + S;
      if (near(M, M0) && near(S, S0)) return ok();
      if (!sS && near(M, tot)) return form('u5t-gave-sec', 'That is the time in <b>seconds</b>. Change it to minutes and seconds: ÷ 60.');
      if (!sS && !near(M, Math.round(M)) && near(T, tot, 1)) return form('u5t-dec-min', 'Right time in minutes. Now change the part after the decimal point to seconds: × 60.');
      if (near(T, tot, 1e-6)) return form('u5t-trade60', S >= 60 ? 'Right total, but ' + t(N(S)) + ' s is 60 s or more: trade 60 s for 1 min.' : 'Write it as whole minutes and fewer than 60 seconds.');
      for (var i = 0; i < (diag || []).length; i++) { var m = diag[i]; if (near(M, m.m) && near(S, m.s) && !(m.m === M0 && m.s === S0)) return wrong(m.code, m.hint); }
      return wrong('value', null);
    };
  }
  function minSecPart(prompt, tot, o) {
    o = o || {}; var M0 = Math.floor(tot / 60), S0 = tot - 60 * M0;
    var dgs = (o.diag || []).filter(function (m) { return !(m.m === M0 && m.s === S0) && m.s >= 0 && m.s < 100; });
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Minutes:', name: 'min', after: 'min' }, { label: 'Seconds:', name: 's', after: 's' }] },
      check: minSecChk(tot, dgs), key: [String(M0), String(S0)], answer: t(M0 + '\\text{ min }' + S0 + '\\text{ s}'), solution: o.sol, hints: o.hints || [], text: o.text,
      bad: dgs.map(function (m) { return [String(m.m), String(m.s)]; }), good: [[M0 + ' min', S0 + ' s']] };
  }
  function numMC(r, prompt, opts, fmt, sol, hints, text) { return P.mc(r, prompt, opts.map(function (o) { return { html: fmt(o.v), right: !!o.right, why: o.why }; }), sol, hints || [], text); }
  Object.assign(A, { readNum: readNum, amtChk: amtChk, keyOf: keyOf, badOf: badOf, uT: uT, whichOf: whichOf, wordChk: wordChk, num: num, fld: fld, wfld: wfld, multiChk: multiChk,
    fieldsPart: fieldsPart, whichAmtPart: whichAmtPart, minSecChk: minSecChk, minSecPart: minSecPart, numMC: numMC });

  /* ================= bearings and pair names (HW.geo checkers with this unit's codes) ================= */
  var BEAR_CODE = { 'geo-bearing-ccw': 'u5t-bear-ccw', 'geo-bearing-east': 'u5t-bear-east', 'geo-bearing-acute': 'u5t-bear-acute', 'geo-bearing-reverse': 'u5t-bear-reverse',
    'geo-back-add': 'u5t-back-add', 'geo-back-sub': 'u5t-back-sub', 'geo-back-same': 'u5t-back-same', 'geo-bearing-range': 'u5t-bear-range', 'geo-bearing-3digit': 'u5t-bear-3digit',
    'geo-bearing-360': 'u5t-bear-360', 'geo-comma': 'u5t-comma', 'geo-bearing-quadrant': 'word', 'geo-bearing-word': 'word' };
  /* o: HW.geo.bearingChk options (back: the bearing going there, alts: [{v, code, hint}]) */
  function bearChk(deg, o) {
    var c = G.bearingChk(deg, o || {});
    return function (resp) { if (Array.isArray(resp)) resp = resp[0]; var r = c(resp); return r && r.code && BEAR_CODE[r.code] ? { v: r.v, code: BEAR_CODE[r.code], hint: r.hint } : r; };
  }
  function bearFld(label, deg, o) { o = o || {}; return { label: label, name: o.name, after: '°', chk: bearChk(deg, o), key: b3(deg), show: BT(deg), bad: (o.alts || []).filter(function (a) { return n360(a.v) !== n360(deg); }).map(function (a) { return b3(a.v); }) }; }
  var PAIRS = G.PAIRS, PAIR_NAMES = G.PAIR_NAMES, PAIR_SHORT = G.PAIR_SHORT;
  var NAMED = ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same'];
  var EQUAL = { corresponding: 1, 'alt-int': 1, 'alt-ext': 1, 'vert-opp': 1 };
  var PAIR_LIST = 'corresponding, alternate interior, alternate exterior, interior on the same side, exterior on the same side, or vertically opposite';
  var LETTER_PAIR = { F: 'corresponding', Z: 'alt-int', C: 'int-same', U: 'int-same', X: 'vert-opp' };
  function pairWhy(target, got) {
    var side = { corresponding: 'same', 'alt-int': 'opp', 'alt-ext': 'opp', 'int-same': 'same', 'ext-same': 'same' }, where = { corresponding: 'mix', 'alt-int': 'in', 'alt-ext': 'out', 'int-same': 'in', 'ext-same': 'out' };
    if (target === 'vert-opp') return 'These two angles are at the <b>same crossing</b>, across from each other.';
    if (got === 'vert-opp') return 'Vertically opposite angles are at the <b>same</b> crossing. These are at <b>different</b> crossings.';
    if (target === 'corresponding') return 'These are in the <b>same position</b> at the two crossings (an F shape): one is between the lines and one is outside.';
    if (got === 'corresponding') return 'Corresponding angles are in the same position at each crossing. These are not: is each one between the lines or outside them?';
    if (side[got] && side[target] !== side[got]) return 'Same side of the transversal, or <b>opposite</b> sides? Look again (alternate = opposite sides).';
    if (where[got] && where[target] !== where[got]) return '<b>Interior</b> means between the two lines; <b>exterior</b> means outside them. Where are these angles?';
    return 'Ask three questions: the same crossing? Interior or exterior? The same side of the transversal or opposite sides?';
  }
  /* a typed pair name. inField: a wrong name gives code 'value' (so a set of boxes scores it as one box wrong) */
  function pairChk(target, inField) {
    return function (resp) {
      if (Array.isArray(resp)) resp = resp[0];
      var p = G.pairOf(resp), bad = function (id) { return wrong(inField ? 'value' : 'u5t-pair-wrong', pairWhy(target, id)); };
      if (p.empty) return form('empty', 'Type the name of the angle pair.');
      if (p.id) return p.id === target ? ok() : bad(p.id);
      if (p.ambiguous === 'alt') return /^alt-/.test(target) ? form('u5t-pair-part', '<b>Alternate interior</b> or <b>alternate exterior</b>? Say which.') : bad('alt');
      if (p.ambiguous === 'int') return target === 'alt-int' || target === 'int-same' ? form('u5t-pair-part', 'Interior <b>on the same side</b>, or <b>alternate</b> interior? Say which.') : bad('int');
      if (p.ambiguous === 'ext') return target === 'alt-ext' || target === 'ext-same' ? form('u5t-pair-part', 'Exterior <b>on the same side</b>, or <b>alternate</b> exterior? Say which.') : bad('ext');
      if (p.ambiguous === 'letter') { var id = LETTER_PAIR[String(p.letter).toUpperCase()]; return id === target ? form('u5t-pair-part', 'Good eye for the ' + String(p.letter).toUpperCase() + ' shape! Now write the <b>name</b> of the pair.') : bad(id); }
      if (p.id === undefined && (p.unknown || !p.ambiguous)) return form('u5t-pair-unreadable', 'Use one of the names: ' + PAIR_LIST + '.');
      return bad(null);
    };
  }
  var WRONG_NAME = { corresponding: 'alternate interior', 'alt-int': 'corresponding', 'alt-ext': 'alternate interior', 'int-same': 'alternate interior', 'ext-same': 'corresponding', 'vert-opp': 'corresponding' };
  function pairFld(label, target, o) { o = o || {}; return { label: label, name: o.name || 'Pair name', mode: 'text', ph: 'e.g. alternate exterior', chk: pairChk(target, o.inField !== false), key: PAIR_SHORT[target], show: '<b>' + PAIR_NAMES[target] + '</b>', bad: [WRONG_NAME[target]] }; }
  function pairPart(prompt, target, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Pair:', name: 'Pair name', mode: 'text', wide: true, placeholder: 'e.g. alternate exterior' }] },
      check: pairChk(target, false), key: [PAIR_SHORT[target]], answer: '<b>' + PAIR_NAMES[target] + '</b>', solution: o.sol, hints: o.hints || [], text: o.text, bad: [[WRONG_NAME[target]]] };
  }
  /* the numbered transversal: tilt = the size of ∠2 (and ∠4, and ∠6, ∠8 when parallel) */
  function tAngle(k, tilt) { return (k % 2 === 0) ? tilt : 180 - tilt; }
  function pairOfAngles(r, type) { var pr = r.pick(PAIRS[type]); return r.chance(0.5) ? [pr[0], pr[1]] : [pr[1], pr[0]]; }
  Object.assign(A, { bearChk: bearChk, bearFld: bearFld, pairChk: pairChk, pairFld: pairFld, pairPart: pairPart, pairWhy: pairWhy, tAngle: tAngle, pairOfAngles: pairOfAngles,
    PAIRS: PAIRS, PAIR_NAMES: PAIR_NAMES, PAIR_SHORT: PAIR_SHORT, NAMED: NAMED, EQUAL: EQUAL });

  /* ================= drawings ================= */
  var INK = '#1d2633', GREY = '#5f6675', BLUE = '#1f5bd6', RED = '#c93a33', GREEN = '#12805a', RAD = Math.PI / 180;
  var FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';
  function at(V, d, r) { return [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)]; }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* a small SVG canvas that tracks its bounding box (directions in math degrees: 0 = right, counterclockwise) */
  function Fig() { this.s = ''; this.bb = [1e9, 1e9, -1e9, -1e9]; }
  Fig.prototype.grow = function (x, y, rx, ry) { var b = this.bb; rx = rx || 0; ry = ry == null ? rx : ry; b[0] = Math.min(b[0], x - rx); b[1] = Math.min(b[1], y - ry); b[2] = Math.max(b[2], x + rx); b[3] = Math.max(b[3], y + ry); return this; };
  Fig.prototype.line = function (p, p2, o) {
    o = o || {};
    this.s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(p2[0]) + '" y2="' + f1(p2[1]) + '" stroke="' + (o.color || INK) + '" stroke-width="' + (o.width || 2.4) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
    return this.grow(p[0], p[1]).grow(p2[0], p2[1]);
  };
  Fig.prototype.path = function (d, o, pts) {
    o = o || {}; var me = this;
    this.s += '<path d="' + d + '" fill="' + (o.fill || 'none') + '"' + (o.fillOpacity != null ? ' fill-opacity="' + o.fillOpacity + '"' : '') + ' stroke="' + (o.stroke || 'none') + '" stroke-width="' + (o.width || 2) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    (pts || []).forEach(function (p) { me.grow(p[0], p[1]); }); return this;
  };
  Fig.prototype.poly = function (pts, o) { return this.path('M' + pts.map(function (p) { return f1(p[0]) + ' ' + f1(p[1]); }).join('L') + 'Z', o, pts); };
  Fig.prototype.text = function (x, y, s, o) {
    o = o || {}; var size = o.size || 15, str = String(s), it = /^[A-Za-z]$/.test(str) && o.italic !== false ? ' font-style="italic"' : '';
    this.s += '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + it +
      (o.halo === false ? '' : ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"') + '>' + esc(str).replace(/-/g, '−') + '</text>';
    return this.grow(x, y, str.length * size * 0.32 + 2, size * 0.62);
  };
  Fig.prototype.dot = function (p, o) { o = o || {}; this.s += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (o.r || 3.4) + '" fill="' + (o.color || INK) + '"/>'; return this.grow(p[0], p[1], o.r || 3.4); };
  /* an angle mark at V from direction d1 counterclockwise to d2 (less than 180°), with a label */
  Fig.prototype.arc = function (V, d1, d2, o) {
    o = o || {}; var span = n360(d2 - d1), r0 = o.r || (span < 30 ? 40 : span < 50 ? 32 : 24), right = o.right != null ? o.right : Math.abs(span - 90) < 0.01, col = o.color || INK;
    if (right) { var s = 12, u = at([0, 0], d1, 1), v = at([0, 0], d1 + 90, 1); this.path('M' + f1(V[0] + u[0] * s) + ' ' + f1(V[1] + u[1] * s) + 'L' + f1(V[0] + (u[0] + v[0]) * s) + ' ' + f1(V[1] + (u[1] + v[1]) * s) + 'L' + f1(V[0] + v[0] * s) + ' ' + f1(V[1] + v[1] * s), { stroke: col, width: 1.6 }); }
    else { var a = at(V, d1, r0), b = at(V, d1 + span, r0); this.path('M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + r0 + ' ' + r0 + ' 0 ' + (span > 180 ? 1 : 0) + ' 0 ' + f1(b[0]) + ' ' + f1(b[1]), { stroke: col, width: 1.7 }, [a, b]); }
    if (o.label != null && o.label !== '') {
      var str = String(o.label), hw = str.length * 15 * 0.3 + 3, lr = o.labelR || Math.min(95, Math.max((right ? 14 : r0) + 13, (hw + 6) / Math.max(0.15, Math.sin(Math.min(span, 179) / 2 * RAD)) + 4));
      var p = at(V, d1 + span / 2, lr); this.text(p[0], p[1], str, { size: 15, color: o.labelColor || col });
    }
    return this;
  };
  /* a ">" mark (parallel lines) at p on a line going in direction d */
  Fig.prototype.chev = function (p, d, n) { for (var i = 0; i < (n || 1); i++) { var c = at(p, d, i * 8), a = at(c, d + 180, 8), u = at([0, 0], d + 90, 6); this.path('M' + f1(a[0] + u[0]) + ' ' + f1(a[1] + u[1]) + 'L' + f1(c[0]) + ' ' + f1(c[1]) + 'L' + f1(a[0] - u[0]) + ' ' + f1(a[1] - u[1]), { stroke: INK, width: 2 }); } return this; };
  Fig.prototype.svg = function (o) {
    o = o || {}; var pad = o.pad == null ? 8 : o.pad, b = this.bb, x = b[0] - pad, y = b[1] - pad, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad;
    return '<svg class="fig-svg" viewBox="' + f1(x) + ' ' + f1(y) + ' ' + f1(W) + ' ' + f1(H) + '" width="100%" style="max-width:' + Math.round(Math.min(o.width || W, W * 1.5)) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(o.aria || 'figure') + '">' + this.s + '</svg>';
  };
  /* enlarge an SVG's viewBox to hold [x0, y0, x1, y1] and add extra elements at the end */
  function growSVG(svg, box, extra, maxW) {
    return svg.replace(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/, function (m, x, y, w, h) {
      x = +x; y = +y; w = +w; h = +h; var nx = Math.min(x, box[0]), ny = Math.min(y, box[1]), nx2 = Math.max(x + w, box[2]), ny2 = Math.max(y + h, box[3]);
      return 'viewBox="' + f1(nx) + ' ' + f1(ny) + ' ' + f1(nx2 - nx) + ' ' + f1(ny2 - ny) + '"';
    }).replace(/max-width:\d+px/, 'max-width:' + (maxW || 400) + 'px').replace(/<\/svg>$/, (extra || '') + '</svg>');
  }
  function wrapFig(s) { return '<div style="margin:6px 0">' + s + '</div>'; }
  Object.assign(A, { Fig: Fig, at: at, growSVG: growSVG, wrapFig: wrapFig, INK: INK, BLUE: BLUE, RED: RED, GREEN: GREEN, GREY: GREY });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u5t-comma': 'Comma instead of a decimal point', 'u5t-places': 'Not rounded to the place asked', 'u5t-round-dir': 'Rounded the wrong way', 'u5t-which': 'Right number, wrong (or unclear) choice',
    'u5t-one-box': 'One box of several wrong', 'u5t-half-box': 'One of the two boxes wrong', 'u5t-many-box': 'Several boxes wrong',
    'u5t-gave-sec': 'Gave the time in seconds only', 'u5t-dec-min': 'Decimal minutes instead of minutes and seconds', 'u5t-trade60': 'Seconds not traded (60 s or more)', 'u5t-dec-as-sec': 'Read the decimal part of the minutes as seconds',
    'u5t-take-max': 'Take-away: always took the most', 'u5t-take-rest': 'Take-away: took what was needed to reach the multiple above', 'u5t-gave-left': 'Take-away: gave the counters left, not taken',
    'u5t-take-gap': 'Take-away: used the wrong spacing (multiples of the biggest move)', 'u5t-take-rule': 'Take-away: used the strategy of the other version of the game',
    'u5t-race-gap': 'Race: used the biggest move as the spacing of the safe squares', 'u5t-race-top': 'Race: gave the safe square next to the end, not the first one',
    'u5t-ttt-block': 'Tic-tac-toe: blocked when there was a win', 'u5t-ttt-centre': 'Tic-tac-toe: took the centre without checking win / block', 'u5t-ttt-one': 'Tic-tac-toe: a move with one threat, not a fork',
    'u5t-hanoi-pow': 'Tower: used 2ⁿ instead of 2ⁿ − 1', 'u5t-hanoi-add2': 'Tower: added 2 moves per disc', 'u5t-hanoi-rate': 'Tower: gave the moves, not the time',
    'u5t-ships-no-elim': 'Ships: did not cross out the positions that use a miss', 'u5t-ships-one-dir': 'Ships: listed only one direction (across or up and down)',
    'u5t-tan-seventh': 'Tangram: treated every piece as 1/7 of the square', 'u5t-tan-piece': 'Tangram: used the area of a different piece', 'u5t-tan-side': 'Tangram: used the side length instead of the area',
    'u5t-other-scale': 'Read the other protractor scale (180° − the angle)', 'u5t-gave-small': 'Gave the small angle, not the reflex angle', 'u5t-reflex-180': 'Reflex angle: 180° + the angle instead of 360° − the angle',
    'u5t-est-supp': 'Estimate: obtuse for acute (or the reverse)', 'u5t-est-reflex': 'Estimate: gave the reflex angle', 'u5t-bis-way': 'Bisect: doubled instead of halving (or the reverse)',
    'u5t-bear-turn': 'Bearing: turned the wrong way from the main direction', 'u5t-bear-swap': 'Bearing: started from the other direction (“west of south” as “south of west”)',
    'u5t-bear-ccw': 'Bearing: measured counterclockwise', 'u5t-bear-east': 'Bearing: measured from east', 'u5t-bear-acute': 'Bearing: gave the angle from the N–S line', 'u5t-bear-reverse': 'Bearing: gave the opposite direction',
    'u5t-back-add': 'Back bearing: added 180° (over 360°)', 'u5t-back-sub': 'Back bearing: subtracted 180° (below 0°)', 'u5t-back-same': 'Back bearing: gave the bearing going there', 'u5t-bear-range': 'Bearing outside 000°–359°',
    'u5t-bear-3digit': 'Bearing not written with 3 digits', 'u5t-bear-360': 'Wrote 360° for north',
    'u5t-poly-n180': 'Polygon: n × 180° (did not subtract 2)', 'u5t-poly-brackets': 'Polygon: no brackets, n − 2 × 180', 'u5t-poly-n1': 'Polygon: used one side too few', 'u5t-poly-360': 'Polygon: used 360° for every polygon',
    'u5t-poly-gave-sum': 'Regular polygon: gave the angle sum, not one angle', 'u5t-poly-ext': 'Regular polygon: 360° ÷ n (the turn at a corner)', 'u5t-poly-tri': 'Regular polygon: gave the number of triangles (n − 2)',
    'u5t-route-noback': 'Route: used the first bearing, not the bearing back (180° − the angle)', 'u5t-route-reflex': 'Route: gave the reflex angle',
    'u5t-cs-swap': 'Mixed up complement (90°) and supplement (180°)', 'u5t-vo-supp': 'Vertically opposite and supplementary mixed up', 'u5t-point-360': 'Used 360° for angles on a straight line',
    'u5t-rule-swap': 'Parallel lines: equal and supplementary (180°) mixed up', 'u5t-perp-no90': 'Perpendicular: left out the 90°', 'u5t-bend-supp': 'Bend: 180° − the angle', 'u5t-bend-diff': 'Bend: subtracted the two angles',
    'u5t-bend-reflex': 'Bend: gave the reflex angle', 'u5t-alg-rule': 'Algebra: equal and add-to-180° rules mixed up', 'u5t-alg-sign': 'Algebra: undid the constant the wrong way', 'u5t-alg-div': 'Algebra: did not divide by the coefficient',
    'u5t-alg-order': 'Algebra: divided before undoing the constant', 'u5t-pair-wrong': 'Named the wrong angle pair', 'u5t-pair-part': 'Pair name not finished (alternate / interior / a letter)', 'u5t-pair-unreadable': 'Not a pair name'
  });
  HW.addPartial({
    'u5t-round-dir': 's', 'u5t-which': 'b', 'u5t-one-box': 's', 'u5t-half-box': 'b', 'u5t-many-box': 'n', 'u5t-dec-as-sec': 'b',
    'u5t-take-max': 'n', 'u5t-take-rest': 'n', 'u5t-gave-left': 'b', 'u5t-take-gap': 'n', 'u5t-take-rule': 'n', 'u5t-race-gap': 'n', 'u5t-race-top': 'b',
    'u5t-ttt-block': 'b', 'u5t-ttt-centre': 'n', 'u5t-ttt-one': 'n', 'u5t-hanoi-pow': 's', 'u5t-hanoi-add2': 'n', 'u5t-hanoi-rate': 'b', 'u5t-ships-no-elim': 'b', 'u5t-ships-one-dir': 'b',
    'u5t-tan-seventh': 'n', 'u5t-tan-piece': 'b', 'u5t-tan-side': 'n', 'u5t-other-scale': 'b', 'u5t-gave-small': 'b', 'u5t-reflex-180': 'n', 'u5t-est-supp': 'n', 'u5t-est-reflex': 'n', 'u5t-bis-way': 'n',
    'u5t-bear-turn': 'b', 'u5t-bear-swap': 'b', 'u5t-bear-ccw': 'b', 'u5t-bear-east': 'b', 'u5t-bear-acute': 'b', 'u5t-bear-reverse': 'b', 'u5t-back-add': 's', 'u5t-back-sub': 's', 'u5t-back-same': 'n', 'u5t-bear-range': 'n',
    'u5t-poly-n180': 'b', 'u5t-poly-brackets': 'b', 'u5t-poly-n1': 'b', 'u5t-poly-360': 'n', 'u5t-poly-gave-sum': 'b', 'u5t-poly-ext': 'n', 'u5t-poly-tri': 'b', 'u5t-route-noback': 'b', 'u5t-route-reflex': 's',
    'u5t-cs-swap': 'n', 'u5t-vo-supp': 'b', 'u5t-point-360': 'n', 'u5t-rule-swap': 'b', 'u5t-perp-no90': 'b', 'u5t-bend-supp': 'b', 'u5t-bend-diff': 'n', 'u5t-bend-reflex': 's',
    'u5t-alg-rule': 'b', 'u5t-alg-sign': 's', 'u5t-alg-div': 'b', 'u5t-alg-order': 'b', 'u5t-pair-wrong': 'n'
  });

  /* ======================================================================================================
   * G1 — puzzles and games
   * ====================================================================================================== */
  /* ---- tangram pieces (small triangle = 1 unit; the whole square = 16) ---- */
  var TAN = { small: { n: 'small triangle', u: 1 }, medium: { n: 'medium triangle', u: 2 }, square: { n: 'square', u: 2 }, para: { n: 'parallelogram', u: 2 }, large: { n: 'large triangle', u: 4 } };
  var TAN_PIECES = [['large', [[0, 0], [0, 4], [2, 2]]], ['large', [[0, 4], [4, 4], [2, 2]]], ['medium', [[2, 0], [4, 0], [4, 2]]], ['small', [[0, 0], [2, 0], [1, 1]]],
    ['square', [[1, 1], [2, 0], [3, 1], [2, 2]]], ['small', [[2, 2], [3, 1], [3, 3]]], ['para', [[3, 1], [4, 2], [4, 4], [3, 3]]]];
  /* the tangram square; the pieces of the kinds in `hl` (or the pieces numbered o.idx, in TAN_PIECES order) are shaded */
  function tanSVG(hl, o) {
    o = o || {}; var fg = new Fig(), s = o.s || 34;
    TAN_PIECES.forEach(function (p, i) { var on = o.idx ? o.idx.indexOf(i) >= 0 : (hl || []).indexOf(p[0]) >= 0; fg.poly(p[1].map(function (xy) { return [xy[0] * s, (4 - xy[1]) * s]; }), { fill: on ? '#f2c98a' : '#eef1f6', stroke: INK, width: 2 }); });
    return fg.svg({ width: o.width || 170, aria: 'tangram square' });
  }
  function tanPart(r, o) {
    o = o || {};
    var side = r.pick([8, 10, 12, 16, 18, 20, 24, 28, 30, 40]), W = side * side, giveSide = r.chance(0.5), pc = r.pick(['small', 'medium', 'square', 'para', 'large']), u = TAN[pc].u, ans = W * u / 16;
    var diag = [{ v: W / 7, code: 'u5t-tan-seventh', hint: 'The 7 pieces are not all the same size, so they are not sevenths. Use the small triangle as 1 unit: the whole square is 16 units.' }];
    [1, 2, 4].forEach(function (u2) { if (u2 !== u) diag.push({ v: W * u2 / 16, code: 'u5t-tan-piece', hint: 'How many small triangles cover one ' + TAN[pc].n + '? (small 1, medium / square / parallelogram 2, large 4)' }); });
    if (giveSide) diag.push({ v: side * u / 16, code: 'u5t-tan-side', hint: 'Find the area of the whole square first: ' + t(side + '\\times ' + side) + '.' });
    var stem = giveSide ? 'A tangram is cut from a square of card ' + t(side + '\\text{ cm}') + ' by ' + t(side + '\\text{ cm}') + '.' : 'A tangram set fills a square with an area of ' + t(HW.fmt(String(W)) + '\\text{ cm}^2') + '.';
    return num(stem + tanSVG([pc]) + 'What is the area of one <b>' + TAN[pc].n + '</b> (shaded)? (Round to the nearest hundredth if needed.)', ans, { dp: 2, noPlaces: true, after: 'cm²', unit: 'cm²', diag: diag,
      sol: br([giveSide ? 'Whole square: ' + t(side + '\\times ' + side + '=' + HW.fmt(String(W))) + ' cm²' : 'Whole square: ' + t(HW.fmt(String(W))) + ' cm² = 16 small triangles', 'One small triangle: ' + t(HW.fmt(String(W)) + '\\div 16' + toN(W / 16, 4)) + ' cm²',
        u > 1 ? 'A ' + TAN[pc].n + ' is ' + u + ' small triangles: ' + t(u + '\\times ' + N(W / 16) + '=' + N(ans)) + ' cm²' : null]),
      hints: ['Use the small triangle as 1 unit: the whole square is 16 units.', 'Small 1, medium / square / parallelogram 2, large 4.'], text: o.text || 'tangram piece area' });
  }
  /* ---- the take-away game (take 1, 2 or 3; the last counter wins) ---- */
  function takePart(r, o) {
    o = o || {};
    var n0 = find(function () { return r.int(13, 41); }, function (x) { return x % 4 !== 0 && [10, 15, 21].indexOf(x) < 0; }), ans = n0 % 4, left = n0 - ans, p = person(r);
    return num('<b>Take-away game.</b> ' + p.n + ' and a friend take turns removing <b>1, 2 or 3</b> counters from a pile. Whoever takes the <b>last</b> counter wins. It is ' + p.n + '’s turn and there are ' + t(n0) + ' counters. How many should ' + p.he + ' take to be sure to win?', ans, { dp: 0,
      diag: [{ v: 3, code: 'u5t-take-max', hint: 'Taking the most each time is not a strategy. Leave a <b>multiple of 4</b> for the other player.' }, { v: 4 - ans, code: 'u5t-take-rest', hint: 'Count <b>down</b> from ' + n0 + ' to the next multiple of 4 below it: that is how many to take.' },
        { v: left, code: 'u5t-gave-left', hint: 'That is how many are <b>left</b>. The question asks how many to take.' }, { v: n0 % 3, code: 'u5t-take-gap', hint: 'You and your friend together can always remove exactly 4 (1 + 3, 2 + 2, 3 + 1): leave a multiple of <b>4</b>.' }],
      sol: br(['Work backward: with 4 counters on your turn you lose (you leave 1, 2 or 3 and the other player takes them all). So leave a <b>multiple of 4</b>.', 'The next multiple of 4 below ' + n0 + ' is ' + left + ': take ' + t(n0 + '-' + left + '=' + ans) + '.', 'After that, if the friend takes 1, 2 or 3, take 3, 2 or 1.']),
      hints: ['Work backward from the end: which pile do you want to leave for the other player?', 'Leave a multiple of 4.'], text: o.text || 'take-away: how many to take' });
  }
  /* a changed rule: take 1 … k (last counter wins), or the last counter loses */
  function takeVarPart(r, o) {
    o = o || {};
    var loses = r.chance(0.45), k = loses ? r.pick([2, 3, 3]) : r.pick([2, 4, 4, 5]), g = k + 1;
    var n0 = find(function () { return r.int(14, 40); }, function (x) { return loses ? (x - 1) % g !== 0 && x % g !== 0 : x % g !== 0 && x % 4 !== (x % g); }), ans = loses ? (n0 - 1) % g : n0 % g;
    var moves = k === 2 ? '1 or 2' : k === 3 ? '1, 2 or 3' : k === 4 ? '1, 2, 3 or 4' : '1, 2, 3, 4 or 5';
    var leave = loses ? 'one more than a multiple of ' + g + ' (1, ' + (1 + g) + ', ' + (1 + 2 * g) + ', …)' : 'a multiple of ' + g + ' (' + g + ', ' + 2 * g + ', ' + 3 * g + ', …)';
    var target = n0 - ans, diag = [{ v: n0 - ans, code: 'u5t-gave-left', hint: 'That is how many are <b>left</b>. The question asks how many to take.' }];
    if (loses) diag.push({ v: n0 % g, code: 'u5t-take-rule', hint: 'In this version the player who takes the last counter <b>loses</b>, so you want the other player left with exactly 1.' });
    else diag.push({ v: n0 % 4, code: 'u5t-take-rule', hint: 'That is the strategy for taking 1, 2 or 3. Here you may take up to ' + k + ', so one round can always remove ' + g + '.' });
    if (n0 % k) diag.push({ v: n0 % k, code: 'u5t-take-gap', hint: 'Whatever the other player takes, you can make the round add up to ' + g + ' (not ' + k + ').' });
    return num('<b>A new take-away game.</b> On your turn you take <b>' + moves + '</b> counters. The player who takes the last counter <b>' + (loses ? 'loses' : 'wins') + '</b>. It is your turn and the pile has ' + t(n0) + ' counters. How many should you take to be sure to win?', ans, { dp: 0, diag: diag,
      sol: br([loses ? 'Work backward: with 1 counter on your turn you lose (you must take it). From 2 to ' + g + ' you can leave 1. With ' + (g + 1) + ' you cannot. So leave ' + leave + '.' : 'Work backward: with ' + g + ' counters on your turn you lose (whatever you take, the other player takes the rest). So leave ' + leave + '.',
        'From ' + n0 + ', leave ' + target + ': take ' + t(n0 + '-' + target + '=' + ans) + '.']),
      hints: ['Work backward: what do you want the other player to face on the last turn?', 'One round (their move + yours) can always remove ' + g + ' counters.'], text: o.text || 'take-away: new rule' });
  }
  /* ---- race to N (move 1 … k squares; landing on N wins) ---- */
  function racePart(r, o) {
    o = o || {};
    var s = find(function () { var k = r.int(2, 5), n0 = r.int(15, 40); return { k: k, n0: n0, g: k + 1 }; }, function (s) { return s.n0 % s.k !== s.n0 % s.g && !(s.n0 === 22 && s.k === 3) && !(s.n0 === 25 && s.k === 4); });
    var k = s.k, g = s.g, n0 = s.n0, s0 = n0 % g, second = s0 === 0, land = second ? g : s0, safe = [];
    for (var x = n0; x > 0; x -= g) safe.push(x);
    var moves = k === 2 ? '1 or 2' : k === 3 ? '1, 2 or 3' : k === 4 ? '1, 2, 3 or 4' : '1, 2, 3, 4 or 5';
    var diag = [{ v: n0 - g, code: 'u5t-race-top', hint: 'That is the safe square just before ' + n0 + '. Keep working backward to the <b>first</b> safe square you can reach.' }];
    if (n0 % k) diag.push({ v: n0 % k, code: 'u5t-race-gap', hint: 'From a safe square, the other player moves 1 to ' + k + ' and you can always make the round ' + g + ' squares, so safe squares are ' + g + ' apart.' });
    return whichAmtPart('<b>Race to ' + n0 + '.</b> A token starts off the board, before square 1 of a strip numbered 1 to ' + n0 + '. Two players take turns moving it forward ' + moves + ' squares. Whoever lands on square ' + n0 + ' wins. Should you go first or second? On which square should you land on your first turn?', {
      amt: land, dp: 0, diag: diag, whichLabel: 'First or second:', amtLabel: 'Your first square:', ph: 'first or second', right: second ? ['second', '2nd'] : ['first', '1st'], wrongs: second ? ['first', '1st'] : ['second', '2nd'],
      rightKey: second ? 'second' : 'first', wrongKey: second ? 'first' : 'second', nudge: 'type first or second.',
      why: second ? 'The first safe square is ' + g + ', which the first player cannot reach in one move (at most ' + k + '). So let the other player go first.' : 'You can reach the first safe square, ' + s0 + ', on your first move, so go first.',
      sol: br(['Work backward: if you land on ' + (n0 - g) + ', the other player can only reach ' + (n0 - g + 1) + ' to ' + (n0 - 1) + ', and you reach ' + n0 + '. Safe squares are ' + g + ' apart: ' + safe.join(', ') + '.',
        second ? 'The first safe square is ' + g + '. The first player can’t reach it (at most ' + k + '), so go <b>second</b> and land on <b>' + g + '</b>.' : 'The first safe square is ' + s0 + ', and you can reach it in one move: go <b>first</b> and land on <b>' + s0 + '</b>.',
        'After that, if the other player moves m squares, you move ' + g + ' − m.']),
      hints: ['Work backward from ' + n0 + ': which square do you want to land on just before it?', 'The safe squares are ' + g + ' apart.'], text: o.text || 'race to N' });
  }
  /* ---- tic-tac-toe ---- */
  var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  function threats(b, who) { var out = []; LINES.forEach(function (L) { var m = L.filter(function (i) { return b[i] === who; }).length, e = L.filter(function (i) { return !b[i]; }); if (m === 2 && e.length === 1 && out.indexOf(e[0]) < 0) out.push(e[0]); }); return out; }
  function won(b, who) { return LINES.some(function (L) { return L.every(function (i) { return b[i] === who; }); }); }
  var TTT = null;
  function tttLists() {
    if (TTT) return TTT; TTT = { win: [], block: [], fork: [] };
    for (var code = 0; code < 19683; code++) {
      var b = [], c = code, nx = 0, no = 0;
      for (var i = 0; i < 9; i++) { var d = c % 3; c = (c - d) / 3; b.push(d === 1 ? 'X' : d === 2 ? 'O' : ''); if (d === 1) nx++; if (d === 2) no++; }
      var me = nx === no ? 'X' : nx === no + 1 ? 'O' : null; if (!me || nx + no < 3 || nx + no > 7 || won(b, 'X') || won(b, 'O')) continue;
      var you = me === 'X' ? 'O' : 'X', mine = threats(b, me), yours = threats(b, you);
      if (mine.length === 1) TTT.win.push({ b: b, me: me, sq: mine[0], kind: 'win', other: yours });
      else if (!mine.length && yours.length === 1) TTT.block.push({ b: b, me: me, sq: yours[0], kind: 'block', other: [] });
      else if (!mine.length && !yours.length && me === 'X' && nx + no >= 4) {
        var forks = [], ones = [];
        for (var s = 0; s < 9; s++) if (!b[s]) { var b2 = b.slice(); b2[s] = me; var n = threats(b2, me).length; if (n >= 2) forks.push(s); else if (n === 1) ones.push(s); }
        if (forks.length === 1) TTT.fork.push({ b: b, me: me, sq: forks[0], ones: ones, kind: 'fork' });
      }
    }
    return TTT;
  }
  /* the board, squares numbered 1–9 (numbers shown in the empty squares) */
  function tttSVG(b, o) {
    o = o || {}; var cs = 46, s = '', P0 = 4;
    for (var i = 1; i < 3; i++) s += '<line x1="' + (P0 + i * cs) + '" y1="' + P0 + '" x2="' + (P0 + i * cs) + '" y2="' + (P0 + 3 * cs) + '" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/><line x1="' + P0 + '" y1="' + (P0 + i * cs) + '" x2="' + (P0 + 3 * cs) + '" y2="' + (P0 + i * cs) + '" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
    for (var k = 0; k < 9; k++) {
      var cx = P0 + (k % 3) * cs + cs / 2, cy = P0 + Math.floor(k / 3) * cs + cs / 2, mark = b[k], hl = o.hl === k;
      if (hl) s += '<rect x="' + (cx - cs / 2 + 3) + '" y="' + (cy - cs / 2 + 3) + '" width="' + (cs - 6) + '" height="' + (cs - 6) + '" fill="#fbe9cf"/>';
      if (mark === 'X' || (hl && o.me === 'X')) s += '<path d="M' + (cx - 12) + ' ' + (cy - 12) + 'L' + (cx + 12) + ' ' + (cy + 12) + 'M' + (cx - 12) + ' ' + (cy + 12) + 'L' + (cx + 12) + ' ' + (cy - 12) + '" stroke="' + (hl ? GREEN : BLUE) + '" stroke-width="3.2" stroke-linecap="round"/>';
      else if (mark === 'O' || (hl && o.me === 'O')) s += '<circle cx="' + cx + '" cy="' + cy + '" r="13" fill="none" stroke="' + (hl ? GREEN : RED) + '" stroke-width="3.2"/>';
      else s += '<text x="' + cx + '" y="' + cy + '" ' + FONT + ' font-size="13" text-anchor="middle" dominant-baseline="central" fill="#8a909c">' + (k + 1) + '</text>';
    }
    var W = 3 * cs + 2 * P0;
    return '<svg class="fig-svg" viewBox="0 0 ' + W + ' ' + W + '" width="100%" style="max-width:' + (o.width || 150) + 'px;display:block;margin:6px 0" role="img" aria-label="tic-tac-toe board">' + s + '</svg>';
  }
  function lineTxt(L) { return L.map(function (i) { return i + 1; }).join('-'); }
  function linesThrough(b, who, sq) { return LINES.filter(function (L) { return L.indexOf(sq) >= 0 && L.filter(function (i) { return b[i] === who; }).length === 2; }); }
  function tttPart(r, o) {
    o = o || {};
    var T = tttLists(), x = r.pick(r.chance(0.5) ? T.win : T.block), b = x.b, me = x.me, you = me === 'X' ? 'O' : 'X', ans = x.sq + 1, diag = [];
    if (x.kind === 'win' && x.other.length) diag.push({ v: x.other[0] + 1, code: 'u5t-ttt-block', hint: 'Blocking can wait: check step 1 first. Can ' + me + ' <b>win</b> right now?' });
    if (!b[4] && x.sq !== 4) diag.push({ v: 5, code: 'u5t-ttt-centre', hint: 'Take the centre only after the checklist: first look for a win, then for a block.' });
    var L = (x.kind === 'win' ? linesThrough(b, me, x.sq) : linesThrough(b, you, x.sq))[0];
    return num('<b>Tic-tac-toe.</b> It is <b>' + me + '</b>’s turn. The empty squares show their numbers.' + tttSVG(b) + 'Use the checklist (1. win, 2. block, 3. fork). Which square should ' + me + ' play?', ans, { dp: 0, diag: diag,
      sol: br([tttSVG(b, { hl: x.sq, me: me, width: 120 }), x.kind === 'win' ? 'Step 1: ' + me + ' has two in a row on ' + lineTxt(L) + ' with square ' + ans + ' empty. ' + me + ' plays <b>' + ans + '</b> and wins.' : 'Step 1: ' + me + ' cannot win yet. Step 2: ' + you + ' has two in a row on ' + lineTxt(L) + ', so ' + me + ' must block at <b>' + ans + '</b>.']),
      hints: ['Step 1: does ' + me + ' have two in a row with the third square empty?', 'Step 2: does ' + you + '?'], text: o.text || 'tic-tac-toe win or block' });
  }
  function forkPart(r, o) {
    o = o || {};
    var x = r.pick(tttLists().fork), b = x.b, ans = x.sq + 1, b2 = b.slice(); b2[x.sq] = 'X';
    var th = threats(b2, 'X').map(function (i) { return i + 1; }).sort(), diag = x.ones.map(function (s) { return { v: s + 1, code: 'u5t-ttt-one', hint: 'That makes only <b>one</b> threat, and O can block it. Find a square that makes <b>two</b> threats at once.' }; });
    return num('<b>Tic-tac-toe.</b> It is <b>X</b>’s turn. Neither player can win on this move, and there is nothing to block. The empty squares show their numbers.' + tttSVG(b) + 'Which square gives X a <b>fork</b> (two threats at once), so X is sure to win on the next turn?', ans, { dp: 0, diag: diag,
      sol: br([tttSVG(b2, { hl: x.sq, me: 'X', width: 120 }), 'X plays <b>' + ans + '</b>. Now X threatens to win at ' + th.join(' and ') + '.', 'O can block only one of them, so X wins with the other.']),
      hints: ['A fork is one move that makes two lines with two X’s and the third square empty.', 'Try each empty square: how many threats would it make?'], text: o.text || 'tic-tac-toe fork' });
  }
  /* ---- the tower puzzle: 2ⁿ − 1 moves ---- */
  function hanoiTimePart(r, o) {
    o = o || {};
    var s = find(function () { return { n: r.int(5, 10), sec: r.pick([1, 1, 2, 3]) }; }, function (s) { var T = (Math.pow(2, s.n) - 1) * s.sec; return T >= 60 && T < 3600 && T % 60 !== 0 && !(s.n === 8 && s.sec === 1); });
    var n = s.n, mv = Math.pow(2, n) - 1, T = mv * s.sec, M0 = Math.floor(T / 60), dec = T / 60 - M0;
    var ms = function (x) { return { m: Math.floor(x / 60), s: x - 60 * Math.floor(x / 60) }; };
    var d1 = ms(Math.pow(2, n) * s.sec), d2 = ms((2 * n - 1) * s.sec), diag = [Object.assign(d1, { code: 'u5t-hanoi-pow', hint: 'The fewest moves is ' + t('2^n-1') + ': one less than ' + t('2^{' + n + '}') + '.' }), Object.assign(d2, { code: 'u5t-hanoi-add2', hint: 'Each disc does not add 2 moves: the moves double and add 1 (1, 3, 7, 15, …).' })];
    diag.push({ m: M0, s: Math.round(dec * 100), code: 'u5t-dec-as-sec', hint: 'The decimal part of the minutes is not seconds: multiply it by 60.' });
    if (s.sec > 1) { var d3 = ms(mv); diag.push(Object.assign(d3, { code: 'u5t-hanoi-rate', hint: 'Each move takes ' + s.sec + ' seconds: multiply the moves by ' + s.sec + '.' })); }
    var who = r.pick(['A science centre has a tower puzzle', 'A puzzle app has a tower game', 'A museum has a giant tower puzzle']);
    return minSecPart('<b>The tower puzzle.</b> ' + who + ' with ' + n + ' discs. Move one disc at a time, and never put a disc on a smaller one. A player who never makes a mistake takes the fewest moves, and makes one move every ' + (s.sec === 1 ? 'second' : s.sec + ' seconds') + '. How long does it take? Give minutes and seconds.', T, { diag: diag,
      sol: br(['Fewest moves: ' + t('2^{' + n + '}-1=' + Math.pow(2, n) + '-1=' + mv), s.sec > 1 ? 'Time: ' + t(mv + '\\times ' + s.sec + '=' + HW.fmt(String(T))) + ' s' : 'Time: ' + mv + ' s', t(HW.fmt(String(T)) + '\\div 60=' + M0) + ' remainder ' + (T - 60 * M0) + ' (' + t(M0 + '\\times 60=' + HW.fmt(String(60 * M0))) + '), so ' + t(M0 + '\\text{ min }' + (T - 60 * M0) + '\\text{ s}') + '.']),
      hints: ['Fewest moves for n discs: 2ⁿ − 1 (1, 3, 7, 15, 31, …).', 'Seconds ÷ 60: the whole number is the minutes, the remainder is the seconds.'], text: o.text || 'tower puzzle time' });
  }
  /* ---- hidden ships: how many places can the ship still be? ---- */
  var COLS = 'ABCDEF';
  function cellName(c) { return COLS.charAt(c[0] - 1) + c[1]; }
  function shipsSVG(s) {
    var cs = 32, x0 = 26, y0 = 6, out = '', inG = function (c) { return [x0 + (c[0] - 1) * cs, y0 + (6 - c[1]) * cs]; };
    for (var i = 0; i <= 6; i++) out += '<line x1="' + (x0 + i * cs) + '" y1="' + y0 + '" x2="' + (x0 + i * cs) + '" y2="' + (y0 + 6 * cs) + '" stroke="#8a909c" stroke-width="1"/><line x1="' + x0 + '" y1="' + (y0 + i * cs) + '" x2="' + (x0 + 6 * cs) + '" y2="' + (y0 + i * cs) + '" stroke="#8a909c" stroke-width="1"/>';
    for (var j = 1; j <= 6; j++) out += '<text x="' + (x0 + (j - 0.5) * cs) + '" y="' + (y0 + 6 * cs + 13) + '" ' + FONT + ' font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="' + INK + '">' + COLS.charAt(j - 1) + '</text>' +
      '<text x="' + (x0 - 12) + '" y="' + (y0 + (6 - j + 0.5) * cs) + '" ' + FONT + ' font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="' + INK + '">' + j + '</text>';
    var hitAt = function (c) { var p = inG(c); return '<rect x="' + (p[0] + 1) + '" y="' + (p[1] + 1) + '" width="' + (cs - 2) + '" height="' + (cs - 2) + '" fill="#d6dae1"/><path d="M' + (p[0] + 8) + ' ' + (p[1] + 8) + 'L' + (p[0] + cs - 8) + ' ' + (p[1] + cs - 8) + 'M' + (p[0] + 8) + ' ' + (p[1] + cs - 8) + 'L' + (p[0] + cs - 8) + ' ' + (p[1] + 8) + '" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>'; };
    out += hitAt(s.H); s.sunk.forEach(function (c) { out += hitAt(c); });
    var a = inG(s.sunk[0]), b = inG(s.sunk[1]), lx = Math.min(a[0], b[0]), ly = Math.min(a[1], b[1]), rx = Math.max(a[0], b[0]) + cs, ry = Math.max(a[1], b[1]) + cs;
    out += '<rect x="' + (lx + 3) + '" y="' + (ly + 3) + '" width="' + (rx - lx - 6) + '" height="' + (ry - ly - 6) + '" rx="5" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    s.miss.forEach(function (c) { var p = inG(c); out += '<circle cx="' + (p[0] + cs / 2) + '" cy="' + (p[1] + cs / 2) + '" r="6" fill="none" stroke="' + INK + '" stroke-width="2"/>'; });
    var W = x0 + 6 * cs + 6, H = y0 + 6 * cs + 24;
    return '<svg class="fig-svg" viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:240px;display:block;margin:6px 0" role="img" aria-label="hidden ships grid">' + out + '</svg>';
  }
  function shipsPart(r, o) {
    o = o || {}; var k = 3;
    var s = find(function () {
      var H = [r.int(1, 6), r.int(1, 6)], key = function (c) { return c[0] + ',' + c[1]; }, inside = function (c) { return c[0] >= 1 && c[0] <= 6 && c[1] >= 1 && c[1] <= 6; };
      var sunk = null; for (var tries = 0; tries < 40 && !sunk; tries++) { var c0 = [r.int(1, 6), r.int(1, 6)], dir = r.chance(0.5) ? [1, 0] : [0, 1], c1 = [c0[0] + dir[0], c0[1] + dir[1]]; if (inside(c1) && key(c0) !== key(H) && key(c1) !== key(H)) sunk = [c0, c1]; }
      if (!sunk) return null;
      var used = {}; used[key(H)] = 1; used[key(sunk[0])] = 1; used[key(sunk[1])] = 1;
      var near0 = [], miss = []; [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2]].forEach(function (d) { var c = [H[0] + d[0], H[1] + d[1]]; if (inside(c) && !used[key(c)]) near0.push(c); });
      r.shuffle(near0).slice(0, r.int(1, 3)).forEach(function (c) { miss.push(c); used[key(c)] = 1; });
      for (var m = r.int(2, 4); m > 0; m--) { var c2 = [r.int(1, 6), r.int(1, 6)]; if (!used[key(c2)]) { miss.push(c2); used[key(c2)] = 1; } }
      var bad = {}; miss.concat(sunk).forEach(function (c) { bad[key(c)] = 1; });
      var list = [], base = 0, cnt = { h: 0, v: 0 };
      [[1, 0, 'h'], [0, 1, 'v']].forEach(function (d) {
        for (var off = 0; off < k; off++) {
          var cells = []; for (var i = 0; i < k; i++) cells.push([H[0] + (i - off) * d[0], H[1] + (i - off) * d[1]]);
          if (!cells.every(inside)) continue; base++;
          var blk = cells.filter(function (c) { return bad[key(c)]; });
          list.push({ cells: cells, blk: blk, d: d[2] }); if (!blk.length) cnt[d[2]]++;
        }
      });
      return { H: H, sunk: sunk, miss: miss, list: list, base: base, cnt: cnt.h + cnt.v, ch: cnt.h, cv: cnt.v };
    }, function (s) { return s.cnt >= 1 && s.cnt < s.base && s.ch !== s.cv && !(s.H[0] === 3 && s.H[1] === 3); });
    var diag = [{ v: s.base, code: 'u5t-ships-no-elim', hint: 'Cross out every position that uses a miss (or the sunk ship): no ship can be on those squares.' }];
    if (s.ch && s.ch !== s.cnt) diag.push({ v: s.ch, code: 'u5t-ships-one-dir', hint: 'A ship can also lie <b>up and down</b>. List those positions too.' });
    if (s.cv && s.cv !== s.cnt) diag.push({ v: s.cv, code: 'u5t-ships-one-dir', hint: 'A ship can also lie <b>across</b>. List those positions too.' });
    var nm = function (L) { return cellName(L.cells[0]) + '–' + cellName(L.cells[k - 1]); };
    return num('<b>Hidden ships.</b> On a 6 by 6 grid (columns A to F, rows 1 to 6) the other player has hidden a <b>3-ship</b> (3 squares in a line, across or up and down). Their 2-ship (outlined) is already sunk. You just hit the 3-ship at <b>' + cellName(s.H) + '</b> (X). The circles are misses.' + shipsSVG(s) +
      'Make a systematic list of every place the 3-ship could be, and cross out the ones that cannot work. How many places are left?', s.cnt, { dp: 0, diag: diag,
      sol: br(['Across: ' + s.list.filter(function (L) { return L.d === 'h'; }).map(function (L) { return L.blk.length ? '<s>' + nm(L) + '</s> (' + L.blk.map(cellName).join(', ') + ')' : '<b>' + nm(L) + '</b>'; }).join(', '),
        'Up and down: ' + s.list.filter(function (L) { return L.d === 'v'; }).map(function (L) { return L.blk.length ? '<s>' + nm(L) + '</s> (' + L.blk.map(cellName).join(', ') + ')' : '<b>' + nm(L) + '</b>'; }).join(', '), t(s.cnt) + ' place' + (s.cnt === 1 ? '' : 's') + ' left.']),
      hints: ['List the 3-ships that cover ' + cellName(s.H) + ': across, then up and down.', 'Cross out any that go off the grid or use a miss or the sunk ship.'], text: o.text || 'hidden ships count' });
  }
  Object.assign(A, { TAN: TAN, tanSVG: tanSVG, tanPart: tanPart, takePart: takePart, takeVarPart: takeVarPart, racePart: racePart, tttLists: tttLists, tttSVG: tttSVG, tttPart: tttPart, forkPart: forkPart,
    hanoiTimePart: hanoiTimePart, shipsPart: shipsPart, threats: threats });

  /* ======================================================================================================
   * G6 — measuring, classifying, estimating, drawing, copying, bisecting, polygons, bearings
   * ====================================================================================================== */
  var LETS = [['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['J', 'K', 'L'], ['G', 'H', 'I'], ['S', 'T', 'U'], ['M', 'N', 'P'], ['R', 'S', 'T'], ['U', 'V', 'W']];
  var KINDS = ['acute', 'right', 'obtuse', 'straight', 'reflex'];
  function kindFld(label, a) { var k = kindOf(a); return wfld(label, { name: 'Type', ph: 'acute, obtuse, …', right: [k], wrongs: KINDS.filter(function (x) { return x !== k; }), choices: 'acute, right, obtuse, straight or reflex', key: k, bad: [k === 'acute' ? 'obtuse' : 'acute'],
    why: 'Compare with 90° and 180°: acute is less than 90°, obtuse is between 90° and 180°, reflex is more than 180°.' }); }
  /* one protractor reading: { a, sc, rot, nm, svg, zero (the arm on 0), name } */
  function protShared(r, o) {
    o = o || {};
    var a = find(function () { return r.int(12, 168); }, function (a) { return (a < 82 || a > 98) && a % 10 !== 0 && a !== 45 && a !== 135; }), sc = r.chance(0.5) ? 'inner' : 'outer';
    var rot = o.rot ? r.pick([-50, -40, -35, -30, -25, 25, 30, 35, 40, 50]) : 0, nm = r.pick(o.lets || LETS);
    var svg = G.protractorSVG({ angle: a, scale: sc, rot: rot, names: nm, width: o.width || 400 });
    return { a: a, sc: sc, rot: rot, nm: nm, svg: svg, name: '\\angle ' + nm.join(''), zero: nm[1] + nm[0] };
  }
  function protSol(s) {
    return 'Arm ' + s.zero + ' lies on the 0 of the <b>' + s.sc + '</b> scale' + (s.rot ? ' (the protractor is turned, but that does not matter)' : '') + ', so read the ' + s.sc + ' scale: ' + t(s.name + '=' + dg(s.a)) + '. Check: the angle is ' + kindOf(s.a) + ', so it is not ' + D(180 - s.a) + '.';
  }
  function protFld(s) {
    return fld(t(s.name) + ' =', s.a, { tol: 1, after: '°', name: 'Angle', diag: [-1, 0, 1].map(function (e) { return { v: 180 - s.a + e, code: 'u5t-other-scale', hint: 'You read the <b>other scale</b>. Use the scale that has its 0 on arm ' + s.zero + ', and check: is the angle acute or obtuse?' }; }) });
  }
  function protPart(r, o) {
    o = o || {};
    var s = protShared(r, o), specs = [protFld(s)];
    if (o.classify) specs.push(kindFld('Type:', s.a));
    return fieldsPart('Read ' + t(s.name) + ' on the protractor.' + (o.classify ? ' Then classify it (acute, right, obtuse, straight or reflex).' : '') + s.svg, specs,
      br([protSol(s), o.classify ? t(dg(s.a)) + ' is ' + (s.a < 90 ? 'less than 90°: <b>acute</b>.' : 'between 90° and 180°: <b>obtuse</b>.') : null, G.protractorSVG({ angle: s.a, scale: s.sc, rot: s.rot, names: s.nm, highlight: s.sc, width: 280 })]),
      ['Find the 0 that sits on one arm. Read <b>that</b> scale.', 'Check: does the angle look acute or obtuse?'], o.text || (o.classify ? 'read a protractor and classify' : 'read a protractor'));
  }
  /* a turned protractor: the angle and its reflex angle */
  function protReflexPart(r, o) {
    o = o || {};
    var s = protShared(r, { rot: o.rot !== false }), R = 360 - s.a;
    var specs = [protFld(s), fld('Reflex ' + t(s.name) + ' =', R, { tol: 1, after: '°', name: 'Reflex angle', diag: [{ v: s.a, code: 'u5t-gave-small', hint: 'That is the small angle. The reflex angle goes the long way round: ' + t('360^\\circ-' + dg(s.a)) + '.' },
      { v: 180 + s.a, code: 'u5t-reflex-180', hint: 'A full turn is 360°: reflex angle = 360° − the small angle.' }, { v: 180 + (180 - s.a), code: 'u5t-other-scale', hint: 'Use the angle you read on the right scale, then 360° minus it.' }] })];
    return fieldsPart('Read ' + t(s.name) + ' on the protractor. Then find the <b>reflex</b> angle ' + t(s.name) + ' (the long way round).' + s.svg, specs,
      br([protSol(s), 'Reflex: ' + t('360^\\circ-' + dg(s.a) + '=' + dg(R)) + ' (between 180° and 360° ✓)']), ['Read the scale that starts at 0 on one arm.', 'Reflex angle = 360° − the small angle.'], o.text || 'turned protractor and reflex angle');
  }
  /* estimate an angle from a picture (within 10°) */
  var REFS = [0, 22.5, 30, 45, 60, 90, 120, 135, 150, 180];
  function estPart(r, o) {
    o = o || {};
    var a = find(function () { return r.int(14, 172); }, function (a) { return [22, 23, 30, 45, 60, 90, 120, 135, 150].indexOf(a) < 0; }), rot = r.int(0, 359);
    var lo = REFS.filter(function (x) { return x <= a; }).pop(), hi = REFS.filter(function (x) { return x > a; })[0], close = a - lo < hi - a ? lo : hi;
    var svg = G.angleSVG({ a1: rot, a2: rot + a, r: 28, width: 220, len: 105 }), diag = [{ v: 360 - a, code: 'u5t-est-reflex', hint: 'Estimate the marked angle (less than 180°), not the long way round.' }];
    if (Math.abs(180 - 2 * a) > 25) diag.push({ v: 180 - a, code: 'u5t-est-supp', hint: 'Step 1: decide the type. Is the angle less than or more than a right angle (90°)?' });
    return fieldsPart('Estimate the size of the marked angle. Do not measure: use referents (22.5°, 30°, 45°, 60°, 90°, 180°). An estimate within 10° is right.' + svg, [fld('About', a, { tol: 10, after: '°', name: 'Estimate', diag: diag })],
      br(['The angle is ' + kindOf(a) + ': between the referents ' + D(lo) + ' and ' + D(hi) + ', closer to ' + D(close) + '.', 'It measures ' + D(a) + ', so any estimate from ' + D(a - 10) + ' to ' + D(a + 10) + ' is right.']),
      ['Is it more or less than a right angle (an L)?', 'Which two referents is it between? Which is it closer to?'], o.text || 'estimate an angle');
  }
  /* bisect: half from the whole, or the whole from a half */
  function bisectPart(r, o) {
    o = o || {};
    var k = r.int(0, 3), w, h, ans, prompt, back = false;
    if (k === 0) { w = r.pick([12, 14, 16, 18, 22, 24, 26, 28, 30, 13, 17]); h = w / 2; ans = h; prompt = 'A goalie stands on the line that <b>bisects</b> the angle between the lines from the puck to the two goal posts. That angle is ' + D(w) + '. What angle does the goalie’s line make with each post line?'; }
    else if (k === 1) { w = r.pick([90, 100, 110, 120, 135, 140, 150, 105]); h = w / 2; ans = h; prompt = 'Two boards meet at a corner of ' + D(w) + '. A carpenter cuts the end of each board so the joint <b>bisects</b> the corner. What angle is each cut?'; }
    else if (k === 2) { var nm = r.pick(LETS); w = find(function () { return r.int(31, 177); }, function (x) { return x !== 90; }); h = w / 2; ans = h; prompt = 'Ray ' + nm[1] + 'D bisects ' + t('\\angle ' + nm.join('')) + '. If ' + t('\\angle ' + nm.join('') + '=' + dg(w)) + ', find ' + t('\\angle ' + nm[0] + nm[1] + 'D') + '.'; }
    else { var nm2 = r.pick(LETS); h = find(function () { return pickR(r, [12, 85, 0.5]); }, function (x) { return x !== 45; }); w = 2 * h; ans = w; back = true; prompt = 'Ray ' + nm2[1] + 'D bisects ' + t('\\angle ' + nm2.join('')) + '. If ' + t('\\angle ' + nm2[0] + nm2[1] + 'D=' + dg(h)) + ', find ' + t('\\angle ' + nm2.join('')) + '.'; }
    return num(prompt, ans, { dp: 1, noPlaces: true, after: '°', diag: [{ v: back ? h / 2 : w * 2, code: 'u5t-bis-way', hint: back ? 'The half is given. The whole angle is <b>twice</b> as big: × 2.' : 'Bisect means cut into two equal parts: divide by 2.' }],
      sol: back ? 'The bisector cuts the angle into two equal halves, so the whole angle is ' + t(dg(h) + '\\times 2=' + dg(w)) + '.' : 'Bisect: two equal angles, ' + t(dg(w) + '\\div 2=' + dg(h)) + ' each.',
      hints: ['Bisect means cut into two equal angles.', back ? 'Whole angle = half × 2.' : 'Each half = whole ÷ 2.'], text: o.text || 'bisect an angle' });
  }
  /* ---- bearings ---- */
  var DIRB = { N: 0, E: 90, S: 180, W: 270 }, DIRN = { N: 'north', E: 'east', S: 'south', W: 'west' }, CW = { N: 'E', E: 'S', S: 'W', W: 'N' };
  var POINTS16 = { NE: 45, SE: 135, SW: 225, NW: 315, NNE: 22.5, ENE: 67.5, ESE: 112.5, SSE: 157.5, SSW: 202.5, WSW: 247.5, WNW: 292.5, NNW: 337.5 };
  var P16NAME = { NE: 'northeast', SE: 'southeast', SW: 'southwest', NW: 'northwest', NNE: 'north-northeast', ENE: 'east-northeast', ESE: 'east-southeast', SSE: 'south-southeast',
    SSW: 'south-southwest', WSW: 'west-southwest', WNW: 'west-northwest', NNW: 'north-northwest' };
  /* "θ° west of south" (or a compass point) → a true bearing: { b, txt, alts, sol } */
  function bearWords(r) {
    if (r.chance(0.2)) { var pt = r.pick(Object.keys(POINTS16)), bb = POINTS16[pt]; return { b: bb, txt: P16NAME[pt] + ' (' + pt + ')', alts: [{ v: n360(360 - bb), code: 'u5t-bear-ccw', hint: 'Bearings turn <b>clockwise</b> from north.' }],
      sol: pt + ' is ' + (pt.length === 2 ? 'halfway between two main directions' : 'halfway between ' + pt.charAt(0) + ' and ' + pt.slice(1) + ' (the 16-point compass: 22.5° steps)') + ': ' + BT(bb) + ', measured clockwise from north.' }; }
    var base = r.pick(['N', 'E', 'S', 'W']), toward = r.chance(0.5) ? CW[base] : Object.keys(CW).filter(function (k) { return CW[k] === base; })[0], th = r.pick([10, 15, 20, 25, 30, 35, 40, 50, 55, 60, 65, 70, 75, 80]);
    var cw = CW[base] === toward, b = n360(DIRB[base] + (cw ? th : -th)), wrongTurn = n360(DIRB[base] + (cw ? -th : th)), swap = n360(DIRB[toward] + (CW[toward] === base ? th : -th));
    var alts = [{ v: wrongTurn, code: 'u5t-bear-turn', hint: 'Face ' + DIRN[base] + ', then turn ' + th + '° <b>toward ' + DIRN[toward] + '</b>. Sketch it: is that clockwise (add) or counterclockwise (subtract)?' },
      { v: swap, code: 'u5t-bear-swap', hint: '“' + th + '° ' + DIRN[toward] + ' of ' + DIRN[base] + '” starts from <b>' + DIRN[base] + '</b> and turns toward ' + DIRN[toward] + '.' }].filter(function (x) { return Math.abs(n180(x.v - b)) > 0.01; });
    var from = DIRB[base] === 0 && !cw ? '360' : b3(DIRB[base]);
    return { b: b, txt: th + '° ' + DIRN[toward] + ' of ' + DIRN[base], alts: alts, sol: 'Start at ' + DIRN[base] + ' (' + BT(DIRB[base]) + '). Turning toward ' + DIRN[toward] + ' is ' + (cw ? '<b>clockwise</b>: add' : '<b>counterclockwise</b>: subtract') + ', ' + t(from + '^\\circ' + (cw ? '+' : '-') + th + '^\\circ=' + b3(b) + '^\\circ') + '.' };
  }
  function bearWordsPart(r, o) {
    o = o || {};
    var w = bearWords(r), who = r.pick(['A hiker walks', 'A float plane flies', 'A boat sails', 'An orienteer runs', 'A snowmobile heads', 'A drone flies']);
    return { prompt: who + ' in the direction <b>' + w.txt + '</b>. Write this direction as a true bearing.', input: { type: 'number', after: '°' }, check: bearChk(w.b, { alts: w.alts }), key: b3(w.b), answer: BT(w.b),
      solution: br([w.sol, 'A true bearing has 3 digits and is measured clockwise from north.']), hints: ['Start at north (000°) and turn clockwise. N 000°, E 090°, S 180°, W 270°.', 'Make a quick sketch.'], text: o.text || 'direction to true bearing',
      bad: w.alts.map(function (a) { return b3(a.v); }) };
  }
  /* a bearing on a map (the angle marked from north or south) and the bearing back */
  var SPOTS = [['dock', 'D', 'fishing camp', 'F'], ['parking lot', 'P', 'lookout', 'L'], ['cabin', 'C', 'lake', 'K'], ['ranger station', 'R', 'fire tower', 'T'], ['base camp', 'B', 'waterfall', 'W'], ['airstrip', 'A', 'lodge', 'L']];
  function mapBearShared(r) {
    var v = r.int(0, 3), th = find(function () { return r.int(12, 78); }, function (x) { return [30, 45, 60].indexOf(x) < 0; }), b, arc, from;
    if (v === 0) { b = th; arc = { from: 0, to: th }; from = 'N'; } else if (v === 1) { b = 360 - th; arc = { from: b, to: 360 }; from = 'N'; }
    else if (v === 2) { b = 180 - th; arc = { from: b, to: 180 }; from = 'S'; } else { b = 180 + th; arc = { from: 180, to: b }; from = 'S'; }
    var sp = r.pick(SPOTS);
    var svg = G.compassSVG({ origin: sp[1], points: [{ name: sp[3], bearing: b, dist: 110 }], arcs: [Object.assign(arc, { label: th + '°', r: 44 })], bearings: from === 'S' ? [{ deg: 180, dash: '5 4', arrow: false, len: 85, color: GREY }] : [], width: 260 });
    return { v: v, th: th, b: b, from: from, sp: sp, svg: svg, back: n360(b + 180) };
  }
  function mapBearPart(r, o) {
    o = o || {};
    var s = mapBearShared(r), sp = s.sp, side = s.v === 0 || s.v === 2 ? 'east' : 'west';
    var how = s.from === 'N' ? (s.v === 0 ? 'The angle is on the east side of north: the bearing is ' + BT(s.b) + '.' : 'The angle is on the <b>west</b> side of north: ' + t('360^\\circ-' + dg(s.th) + '=' + dg(s.b)) + '.')
      : (s.v === 2 ? 'South is ' + BT(180) + '. The path is ' + D(s.th) + ' from south toward east (counterclockwise from south): ' + t('180^\\circ-' + dg(s.th) + '=' + b3(s.b) + '^\\circ') + '.' : 'South is ' + BT(180) + '. The path is ' + D(s.th) + ' past south going clockwise: ' + t('180^\\circ+' + dg(s.th) + '=' + dg(s.b)) + '.');
    var specs = [bearFld('Bearing from ' + sp[1] + ' to ' + sp[3] + ':', s.b, { name: 'Bearing', alts: s.from === 'S' ? [{ v: n360(180 + (s.v === 2 ? s.th : -s.th)), code: 'u5t-bear-turn', hint: 'Which way from south is the path: toward east (before 180°) or toward west (after 180°)? Bearings go clockwise.' }] : [] }),
      bearFld('Bearing back from ' + sp[3] + ' to ' + sp[1] + ':', s.back, { name: 'Bearing back', back: s.b })];
    return fieldsPart('The map shows ' + art(sp[0]) + ' (' + sp[1] + ') and ' + art(sp[2]) + ' (' + sp[3] + '). North is up. The marked angle is ' + D(s.th) + '.' + s.svg + 'Find the true bearing from ' + sp[1] + ' to ' + sp[3] + ', and the bearing back from ' + sp[3] + ' to ' + sp[1] + '.', specs,
      br([how, 'Bearing back: ' + (s.b < 180 ? b3(s.b) + '° is less than 180°: add, ' + t(b3(s.b) + '^\\circ+180^\\circ=' + b3(s.back) + '^\\circ') : b3(s.b) + '° is 180° or more: subtract, ' + t(b3(s.b) + '^\\circ-180^\\circ=' + b3(s.back) + '^\\circ')) + '.']),
      ['Bearings start at north and turn clockwise, all the way round (3 digits).', 'Bearing back: add 180° if the bearing is less than 180°; otherwise subtract 180°.'], o.text || 'map bearing and bearing back');
  }
  /* the angle at B between two legs of a walk, from their bearings */
  function routePart(r, o) {
    o = o || {};
    var s = find(function () { var p = 5 * r.int(4, 32), qq = 5 * r.int(2, 70); var ang = Math.abs(n180(p + 180 - qq)); return { p: p, q: n360(qq), ang: ang, nb: Math.abs(n180(p - qq)) }; },
      function (s) { return s.ang >= 35 && s.ang <= 150 && Math.abs(s.ang - 90) > 4 && Math.abs(s.nb - s.ang) > 8 && Math.abs(180 - 2 * s.ang) > 8 && Math.abs(n180(s.q - s.p)) > 30 && !(s.p === 40 && s.q === 160); });
    var p = s.p, qq = s.q, ang = s.ang, back = n360(p + 180), who = r.pick(['A search-and-rescue team walks', 'A survey crew walks', 'An orienteering team runs', 'A bush pilot flies', 'A sailboat sails']);
    var svg = G.compassSVG({ origin: 'A', points: [{ name: 'B', bearing: p, dist: 110 }, { name: 'C', from: 'B', bearing: qq, dist: 110 }], northAt: ['B'], width: 300 });
    var diag = [{ v: s.nb, code: 'u5t-route-noback', hint: 'At B, the direction <b>back to A</b> is the bearing back of ' + b3(p) + '°, not ' + b3(p) + '° itself.' }, { v: 360 - ang, code: 'u5t-route-reflex', hint: 'That is the reflex angle. Give the angle less than 180°.' }];
    return num(who + ' from A on a bearing of ' + BT(p) + ' to point B. At B it turns and goes on a bearing of ' + BT(qq) + ' to point C.' + svg + 'Find ' + t('\\angle ABC') + ', the angle between the two parts of the route at B.', ang, { dp: 0, after: '°', diag: diag,
      sol: br(['At B, draw a north line. The direction from B back to A is the bearing back: ' + t(b3(p) + '^\\circ+180^\\circ=' + b3(back) + '^\\circ') + '.', 'The direction from B to C is ' + BT(qq) + '.',
        'Both are measured clockwise from north at B, so the angle between them is ' + t(Math.max(back, qq) + '^\\circ-' + Math.min(back, qq) + '^\\circ=' + dg(Math.abs(back - qq))) + (Math.abs(back - qq) > 180 ? ', and the angle less than 180° is ' + t('360^\\circ-' + dg(Math.abs(back - qq)) + '=' + dg(ang)) : '') + '.', t('\\angle ABC=' + dg(ang))]),
      hints: ['At B, what is the bearing back to A?', 'Subtract the two bearings measured at B.'], text: o.text || 'route angle from bearings' });
  }
  /* ---- polygons: (n − 2) × 180° ---- */
  var PNAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
  function polyName(n) { return PNAMES[n] ? 'a ' + PNAMES[n] + ' (' + n + ' sides)' : 'a polygon with ' + n + ' sides'; }
  function polySumPart(r, o) {
    o = o || {};
    var n = r.int(5, 24), S = (n - 2) * 180;
    return num('What is the sum of the interior angles of ' + polyName(n) + '?', S, { dp: 0, after: '°',
      diag: [{ v: n * 180, code: 'u5t-poly-n180', hint: 'Split it into triangles from one corner: there are ' + t('n-2') + ' triangles, not n.' }, { v: n - 360, code: 'u5t-poly-brackets', hint: 'Use brackets so the calculator subtracts first: ' + t('(' + n + '-2)\\times 180') + '.' },
        { v: (n - 3) * 180, code: 'u5t-poly-n1', hint: 'Subtract 2 from the number of sides, not 3: ' + t('(' + n + '-2)\\times 180^\\circ') + '.' }, { v: 360, code: 'u5t-poly-360', hint: 'Only a quadrilateral’s angles add to 360°. Use ' + t('(n-2)\\times 180^\\circ') + '.' }],
      sol: t('S=(n-2)\\times 180^\\circ=(' + n + '-2)\\times 180^\\circ=' + (n - 2) + '\\times 180^\\circ=' + HW.fmt(String(S)) + '^\\circ'), hints: ['S = (n − 2) × 180°.', 'Use brackets on your calculator.'], text: o.text || 'polygon angle sum' });
  }
  var POLYS = { 4: ['A four-sided building lot', 'A kite (four-sided)', 'A four-sided garden bed'], 5: ['A five-sided patio', 'A five-sided garden', 'A five-sided park'], 6: ['A six-sided garden', 'A six-sided deck', 'A six-sided gazebo floor'], 7: ['A seven-sided window', 'A seven-sided sandbox'] };
  function polyMissPart(r, o) {
    o = o || {};
    var n = r.pick(o.ns || [5, 6, 7]), S = (n - 2) * 180;
    var s = find(function () { var a = []; for (var i = 0; i < n - 1; i++) a.push(Math.round(S / n) + r.int(-24, 24)); var m = S - a.reduce(function (x, y) { return x + y; }, 0); return { a: a, m: m }; },
      function (s) { return s.m >= 62 && s.m <= 172 && s.a.every(function (x) { return x >= 60 && x <= 175 && x !== 90; }) && s.m !== 90; });
    var sum = s.a.reduce(function (x, y) { return x + y; }, 0), what = r.pick(POLYS[n]);
    var diag = [{ v: n * 180 - sum, code: 'u5t-poly-n180', hint: 'The angle sum is ' + t('(n-2)\\times 180^\\circ') + ', not ' + t('n\\times 180^\\circ') + '.' }];
    if (n !== 4 && 360 - sum > 0) diag.push({ v: 360 - sum, code: 'u5t-poly-360', hint: 'Only a four-sided shape has an angle sum of 360°.' });
    if ((n - 3) * 180 - sum > 0) diag.push({ v: (n - 3) * 180 - sum, code: 'u5t-poly-n1', hint: 'Count the sides: ' + n + ' sides, so ' + t('(' + n + '-2)\\times 180^\\circ') + '.' });
    return num(what + ' has angles of ' + s.a.map(function (x) { return D(x); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. Find the ' + ['', '', '', '', 'fourth', 'fifth', 'sixth', 'seventh'][n] + ' angle.', s.m, { dp: 0, after: '°', diag: diag,
      sol: br(['Sum: ' + t('(' + n + '-2)\\times 180^\\circ=' + HW.fmt(String(S)) + '^\\circ'), 'Known: ' + t(s.a.join('+') + '=' + HW.fmt(String(sum))), 'Missing angle: ' + t(HW.fmt(String(S)) + '^\\circ-' + HW.fmt(String(sum)) + '^\\circ=' + dg(s.m))]),
      hints: ['First find the angle sum: (n − 2) × 180°.', 'Subtract the angles you know.'], text: o.text || 'missing angle of a polygon' });
  }
  /* a regular polygon: the number of sides (and the angle sum) from one angle */
  function polySidesPart(r, o) {
    o = o || {};
    var e = r.pick([108, 120, 135, 140, 144, 150, 156, 160, 162]), n = Math.round(360 / (180 - e)), S = (n - 2) * 180;
    var what = r.pick(['Each angle of a regular polygon is', 'A floor tile is a regular polygon. Each of its angles is', 'The roof of a gazebo is a regular polygon. Each angle is', 'A window is a regular polygon with each angle']);
    var specs = [fld('Number of sides:', n, { name: 'Sides', diag: [{ v: n - 2, code: 'u5t-poly-tri', hint: 'That is the number of triangles from one corner. The polygon has 2 more sides than that.' }] }),
      fld('Angle sum:', S, { after: '°', name: 'Angle sum', diag: [{ v: n * 180, code: 'u5t-poly-n180', hint: 'S = (n − 2) × 180°.' }] })];
    return fieldsPart(what + ' ' + D(e) + '. How many sides does it have? What is the sum of its angles? (Try a few values of n: each angle = (n − 2) × 180° ÷ n.)', specs,
      br(['Try n = ' + (n - 1) + ': ' + t('(' + (n - 1) + '-2)\\times 180\\div ' + (n - 1) + toN((n - 3) * 180 / (n - 1), 1)) + ' (too small).', 'Try n = ' + n + ': ' + t('(' + n + '-2)\\times 180=' + HW.fmt(String(S))) + '; ' + t(HW.fmt(String(S)) + '\\div ' + n + '=' + e) + ' ✓',
        'It has <b>' + n + '</b> sides, and its angles add to ' + t(HW.fmt(String(S)) + '^\\circ') + ' (check: ' + t(n + '\\times ' + dg(e) + '=' + HW.fmt(String(S)) + '^\\circ') + ').']),
      ['Guess a number of sides, find each angle, and adjust: more sides make bigger angles.', 'Angle sum = (n − 2) × 180° (or n × one angle).'], o.text || 'regular polygon: sides from an angle');
  }
  /* copy an angle with a protractor: which dot do you join to S? (multiple choice) */
  function dotsSVG(d0, dirs, letters) {
    var R = 190, base = G.protractorSVG({ arms: [d0, d0], width: 380 }), ex = '';
    dirs.forEach(function (d, i) { var p = at([0, 0], d, R * 1.06), l = at([0, 0], d, R * 1.16); ex += '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="5.5" fill="' + BLUE + '"/><text x="' + f1(l[0]) + '" y="' + f1(l[1]) + '" ' + FONT + ' font-size="17" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="' + BLUE + '">' + letters[i] + '</text>'; });
    var T = at([0, 0], d0, 236);
    ex += '<text x="' + f1(T[0]) + '" y="' + f1(T[1] - 14) + '" ' + FONT + ' font-size="17" font-weight="700" text-anchor="middle" font-style="italic" fill="' + INK + '">T</text><text x="0" y="22" ' + FONT + ' font-size="17" font-weight="700" text-anchor="middle" font-style="italic" fill="' + INK + '">S</text>';
    return growSVG(base, [-260, -250, 260, 34], ex, 380);
  }
  function copyMCPart(r, o) {
    o = o || {};
    var s = protShared(r, { width: 340, lets: LETS.filter(function (L) { return L.indexOf('S') < 0 && L.indexOf('T') < 0; }) }), a = s.a, d0 = r.chance(0.5) ? 0 : 180, right = d0 === 0 ? a : 180 - a, trap = 180 - right;
    var others = find(function () { var c = r.shuffle([right + 10, right - 10, right + 20, right - 20, right + 15, right - 15]); return c.slice(0, 2); }, function (c) { return c.every(function (d) { return d > 6 && d < 174 && Math.abs(d - trap) >= 8 && Math.abs(d - right) >= 8; }) && Math.abs(c[0] - c[1]) >= 8; });
    var dirs = [right, trap].concat(others).sort(function (x, y) { return y - x; }), L = ['A', 'B', 'C', 'D'], letter = L[dirs.indexOf(right)], tl = L[dirs.indexOf(trap)];
    var scale = d0 === 0 ? 'inner' : 'outer';
    var opts = dirs.map(function (d, i) {
      return { html: 'Dot ' + L[i], right: d === right, why: d === trap ? 'Dot ' + L[i] + ' is at ' + a + ' on the <b>other</b> scale. On ray ST, start from the 0 that sits on ST (the ' + scale + ' scale).' : 'Measure ' + t(s.name) + ' again, then count ' + t(dg(a)) + ' from the 0 on ray ST.' };
    });
    var p = P.mc(r, 'Use the protractor to <b>copy</b> ' + t(s.name) + ' onto ray ST, with its vertex at S.<br>First read ' + t(s.name) + ':' + s.svg + 'Now the protractor is on ray ST. Which dot should you join to S to draw the copy?' + dotsSVG(d0, dirs, L), opts,
      br([protSol(s), 'On ray ST, T is on the 0 of the <b>' + scale + '</b> scale. Count ' + t(dg(a)) + ' on that scale: <b>Dot ' + letter + '</b>. (Dot ' + tl + ' is ' + a + ' on the other scale.)']),
      ['Measure first. Then on the new ray, use the scale whose 0 is on ST.'], o.text || 'copy an angle with a protractor', true);
    p.input.columns = 4;
    return p;
  }
  Object.assign(A, { LETS: LETS, KINDS: KINDS, kindFld: kindFld, protShared: protShared, protSol: protSol, protFld: protFld, protPart: protPart, protReflexPart: protReflexPart, estPart: estPart, bisectPart: bisectPart,
    bearWords: bearWords, bearWordsPart: bearWordsPart, mapBearPart: mapBearPart, routePart: routePart, polyName: polyName, polySumPart: polySumPart, polyMissPart: polyMissPart, polySidesPart: polySidesPart, copyMCPart: copyMCPart });

  /* ======================================================================================================
   * G5 — angle partners, perpendicular and parallel lines, transversals
   * ====================================================================================================== */
  function compSuppPart(r, o) {
    o = o || {};
    var a = find(function () { return r.chance(0.2) ? pickR(r, [5.5, 84.5, 1]) : r.int(4, 86); }, function (x) { return x !== 45; }), c = 90 - a, s = 180 - a;
    var specs = [fld('Complement:', c, { dp: 1, noPlaces: true, after: '°', name: 'Complement', diag: [{ v: s, code: 'u5t-cs-swap', hint: '<b>C</b>omplementary goes with a <b>C</b>orner: 90°.' }] }),
      fld('Supplement:', s, { dp: 1, noPlaces: true, after: '°', name: 'Supplement', diag: [{ v: c, code: 'u5t-cs-swap', hint: '<b>S</b>upplementary goes with a <b>S</b>traight line: 180°.' }] })];
    return fieldsPart('An angle measures ' + D(a) + '. Find its complement and its supplement.', specs, br(['Complement: ' + t('90^\\circ-' + dg(a) + '=' + dg(c)), 'Supplement: ' + t('180^\\circ-' + dg(a) + '=' + dg(s))]),
      ['Complementary angles add to 90° (a corner).', 'Supplementary angles add to 180° (a straight line).'], o.text || 'complement and supplement');
  }
  /* two lines crossing: x vertically opposite or next to a given angle */
  function crossPart(r, o) {
    o = o || {};
    var v = find(function () { return r.int(24, 156); }, function (x) { return x < 84 || x > 96; }), d = r.int(0, 50), e = d + v, k = r.int(1, 3), ans = k === 2 ? v : 180 - v;
    var rays = [d, e, d + 180, e + 180], arcs = [{ a: d, b: e, label: v + '°' }, { a: rays[k], b: rays[(k + 1) % 4], label: 'x' }];
    var svg = G.angleSVG({ rays: rays.map(function (x) { return { dir: x, len: 100 }; }), arcs: arcs, width: 230 }), ctx = r.pick(['Two straight roads cross.', 'The two legs of a sawhorse cross like an X.', 'The blades of a pair of scissors cross.', 'Two straight fence rails cross.']);
    return num(ctx + ' Find ' + t('x') + '.' + svg, ans, { dp: 0, after: '°',
      diag: [{ v: k === 2 ? 180 - v : v, code: 'u5t-vo-supp', hint: k === 2 ? 'The angles are <b>across</b> from each other (vertically opposite): they are equal.' : 'The angles are <b>next to</b> each other on a straight line: they add to 180°.' }, { v: 360 - v, code: 'u5t-point-360', hint: 'Angles on a straight line add to 180°; only all the way round is 360°.' }],
      sol: k === 2 ? t('x=' + dg(v)) + ': vertically opposite angles are equal.' : t('x=180^\\circ-' + dg(v) + '=' + dg(ans)) + ': the two angles are on a straight line (supplementary).',
      hints: ['Is x across from the ' + v + '° angle, or next to it?', 'Vertically opposite angles are equal; angles on a straight line add to 180°.'], text: o.text || 'two crossing lines' });
  }
  /* three lines through one point: two angles given, find a, b, c */
  function threeLinesPart(r, o) {
    o = o || {};
    var s = find(function () { var p = r.int(25, 95), qq = r.int(25, 95); return { p: p, q: qq, rr: 180 - p - qq }; }, function (s) { return s.rr >= 25 && s.p !== s.q && s.p !== s.rr && s.q !== s.rr && s.p !== 90 && s.q !== 90 && s.rr !== 90; });
    var phi = r.int(0, 50), dirs = [phi, phi + s.p, phi + s.p + s.q, phi + 180, phi + 180 + s.p, phi + 180 + s.p + s.q];
    var arcs = [{ a: dirs[0], b: dirs[1], label: s.p + '°' }, { a: dirs[1], b: dirs[2], label: s.q + '°' }, { a: dirs[2], b: dirs[3], label: 'a' }, { a: dirs[3], b: dirs[4], label: 'b' }, { a: dirs[4], b: dirs[5], label: 'c' }];
    var svg = G.angleSVG({ rays: dirs.map(function (x) { return { dir: x, len: 100 }; }), arcs: arcs, width: 240 });
    var specs = [fld(t('a') + ' =', s.rr, { after: '°', name: 'a', diag: [{ v: 360 - s.p - s.q, code: 'u5t-point-360', hint: 'The angles ' + s.p + '°, ' + s.q + '° and a make a <b>straight line</b>: 180°.' }] }),
      fld(t('b') + ' =', s.p, { after: '°', name: 'b', diag: [{ v: 180 - s.p, code: 'u5t-vo-supp', hint: 'b is across from the ' + s.p + '° angle: vertically opposite angles are equal.' }] }),
      fld(t('c') + ' =', s.q, { after: '°', name: 'c', diag: [{ v: 180 - s.q, code: 'u5t-vo-supp', hint: 'c is across from the ' + s.q + '° angle: vertically opposite angles are equal.' }] })];
    return fieldsPart('Three straight lines cross at one point. Find ' + t('a') + ', ' + t('b') + ' and ' + t('c') + '.' + svg, specs,
      br([t('a=180^\\circ-' + dg(s.p) + '-' + dg(s.q) + '=' + dg(s.rr)) + ' (the three angles make a straight line)', t('b=' + dg(s.p)) + ' (vertically opposite the ' + s.p + '° angle)', t('c=' + dg(s.q)) + ' (vertically opposite the ' + s.q + '° angle)',
        'Check: ' + t(s.p + '+' + s.q + '+' + s.rr + '+' + s.p + '+' + s.q + '+' + s.rr + '=360') + ' ✓']),
      ['Which angles make a straight line with a?', 'Vertically opposite angles are equal.'], o.text || 'three lines through a point');
  }
  /* multiple choice of pair names: the right one and 4 others (K.mc has 5 letters, so one wrong name is left out) */
  var ALL_PAIRS = ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'];
  function pairMC(r, prompt, target, o) {
    o = o || {}; var drop = r.pick(ALL_PAIRS.filter(function (id) { return id !== target; })), ids = ALL_PAIRS.filter(function (id) { return id !== drop; });
    var opts = ids.map(function (id) { return { html: PAIR_SHORT[id], right: id === target, why: id === target ? null : pairWhy(target, id), code: 'pair-' + id }; });
    var p = P.mc(r, prompt, opts, o.sol, o.hints || [], o.text, true); p.input.columns = 2;
    return p;
  }
  /* name the pair of angles (multiple choice) */
  function pairMCPart(r, o) {
    o = o || {};
    var type = r.pick(['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp', 'corresponding', 'alt-int']), pr = pairOfAngles(r, type), par = r.chance(0.5), tilt = find(function () { return r.int(40, 140); }, function (x) { return x < 82 || x > 98; });
    var svg = G.transversalSVG({ parallel: par, tilt: tilt, skew: par ? 0 : r.pick([-14, -10, 10, 14]), numbers: true, width: 300 });
    return pairMC(r, 'Name the pair of angles ' + t('\\angle ' + pr[0]) + ' and ' + t('\\angle ' + pr[1]) + '. (Angles 1–4 are at the top crossing and 5–8 at the bottom, clockwise from the upper left.)' + svg, type,
      { sol: br(['∠' + pr[0] + ' and ∠' + pr[1] + ' are <b>' + PAIR_NAMES[type] + '</b>.', type === 'vert-opp' ? 'They are across from each other at the same crossing.' : 'Different crossings; ' + ({ corresponding: 'one interior and one exterior, on the same side of t (an F shape)', 'alt-int': 'both between the lines, on opposite sides of t (a Z shape)', 'alt-ext': 'both outside the lines, on opposite sides of t', 'int-same': 'both between the lines, on the same side of t (a C or U shape)', 'ext-same': 'both outside the lines, on the same side of t' })[type] + '.']),
        hints: ['Same crossing or different crossings?', 'Interior or exterior? Same side of t or opposite sides?'], text: o.text || 'name the angle pair' });
  }
  /* ℓ1 ∥ ℓ2: find an angle and name the pair that gives the reason */
  function parFindPart(r, o) {
    o = o || {};
    var type = r.pick(NAMED), pr = pairOfAngles(r, type), tilt = find(function () { return r.int(38, 142); }, function (x) { return x < 82 || x > 98; }), v = tAngle(pr[0], tilt), ans = tAngle(pr[1], tilt);
    var lab = {}; lab[pr[0]] = v;
    var svg = G.transversalSVG({ parallel: true, tilt: tilt, angles: lab, numbers: true, width: 300 });
    var specs = [fld(t('\\angle ' + pr[1]) + ' =', ans, { after: '°', name: 'Angle', diag: [{ v: 180 - ans, code: 'u5t-rule-swap', hint: EQUAL[type] ? 'These angles are ' + PAIR_SHORT[type] + ': with parallel lines they are <b>equal</b>.' : 'These are ' + PAIR_SHORT[type] + ' angles: with parallel lines they <b>add to 180°</b>.' }] }),
      pairFld('Reason (the pair ∠' + pr[0] + ', ∠' + pr[1] + '):', type, { name: 'Pair name' })];
    return fieldsPart(t('\\ell_1\\parallel\\ell_2') + ' and ' + t('\\angle ' + pr[0] + '=' + dg(v)) + '. Find ' + t('\\angle ' + pr[1]) + ', and name the pair of angles ∠' + pr[0] + ' and ∠' + pr[1] + ' (your reason).' + svg, specs,
      br(['∠' + pr[0] + ' and ∠' + pr[1] + ' are <b>' + PAIR_NAMES[type] + '</b>.', EQUAL[type] ? 'The lines are parallel, so they are equal: ' + t('\\angle ' + pr[1] + '=' + dg(ans)) + '.' : 'The lines are parallel, so they add to 180°: ' + t('\\angle ' + pr[1] + '=180^\\circ-' + dg(v) + '=' + dg(ans)) + '.']),
      ['Name the pair first: which crossing, interior or exterior, which side of t?', 'Corresponding and alternate angles are equal; same-side angles add to 180°.'], o.text || 'parallel lines: angle and reason');
  }
  /* are the lines parallel? (multiple choice: verdict + reason) */
  function parGeom(r, types) {
    var type = r.pick(types || ['corresponding', 'alt-int', 'int-same', 'corresponding', 'alt-ext', 'ext-same']), pr = pairOfAngles(r, type), top = pr[0] <= 4 ? pr[0] : pr[1], bot = pr[0] <= 4 ? pr[1] : pr[0];
    var par = r.chance(0.5), tilt = find(function () { return r.int(40, 140); }, function (x) { return x < 82 || x > 98; }), skew = par ? 0 : r.pick([-4, -3, -2, 2, 3, 4]);
    var g = G.transversalGeom({ parallel: par, tilt: tilt, skew: skew }), vT = g.measure(top), vB = g.measure(bot), lab = {}; lab[top] = vT; lab[bot] = vB;
    return { type: type, top: top, bot: bot, par: par, tilt: tilt, skew: skew, vT: vT, vB: vB, svg: G.transversalSVG({ parallel: par, tilt: tilt, skew: skew, marks: 0, angles: lab, numbers: false, width: 300 }) };
  }
  function parMCPart(r, o) {
    o = o || {};
    var s = parGeom(r, ['corresponding', 'alt-int', 'int-same', 'corresponding', 'alt-int', 'int-same', 'alt-ext', 'ext-same']), nm = PAIR_NAMES[s.type], eq = EQUAL[s.type], a = s.vT, b = s.vB, sum = a + b;
    var pairTxt = 'The ' + a + '° and ' + b + '° angles are ' + nm;
    var R, W;
    if (eq && s.par) { R = 'Yes. ' + pairTxt + ', and they are equal, so the lines are parallel.'; W = [['No. ' + pairTxt + ', so they would have to add to 180° for parallel lines.', 'That rule is for angles on the <b>same side</b>. ' + cap(nm) + ' angles are <b>equal</b> when the lines are parallel.'], ['No. Without arrow marks you can never tell if lines are parallel.', 'The rules work backwards: if ' + nm + ' angles are equal, the lines are parallel.'], ['Yes, because the lines look parallel in the picture.', 'Don’t judge from how a picture looks: use the angles.']]; }
    else if (eq) { R = 'No. ' + pairTxt + '. If the lines were parallel they would be equal, but ' + a + '° ≠ ' + b + '°.'; W = [['Yes. The angles are almost equal, so the lines are parallel.', 'Even ' + Math.abs(a - b) + '° off means the lines are <b>not</b> parallel: if you made them longer, they would meet.'], ['Yes. ' + cap(nm) + ' angles are always equal.', 'Only <b>vertically opposite</b> angles are always equal. ' + cap(nm) + ' angles are equal only when the lines are parallel.'], ['No. ' + pairTxt + ', and they do not add to 180°.', 'The verdict is right but the rule is wrong: ' + nm + ' angles are <b>equal</b> (not 180°) for parallel lines.']]; }
    else if (s.par) { R = 'Yes. ' + pairTxt + ', and they add to 180°, so the lines are parallel.'; W = [['No. ' + pairTxt + ', and they are not equal.', 'Same-side angles are not equal for parallel lines: they <b>add to 180°</b>.'], ['No. Without arrow marks you can never tell if lines are parallel.', 'The rules work backwards: if same-side angles add to 180°, the lines are parallel.'], ['Yes, because the lines look parallel in the picture.', 'Don’t judge from how a picture looks: use the angles.']]; }
    else { R = 'No. ' + pairTxt + '. If the lines were parallel they would add to 180°, but ' + a + '° + ' + b + '° = ' + sum + '°.'; W = [['Yes. They add to about 180°, so the lines are parallel.', 'Even ' + Math.abs(sum - 180) + '° off means the lines are <b>not</b> parallel.'], ['Yes. Angles on the same side of a transversal always add to 180°.', 'They add to 180° only when the lines are parallel.'], ['No. ' + pairTxt + ', and they are not equal.', 'The verdict is right but the rule is wrong: these angles <b>add to 180°</b> for parallel lines.']]; }
    var opts = [{ html: R, right: true }].concat(W.map(function (w) { return { html: w[0], why: w[1] }; }));
    return P.mc(r, 'Two lines are cut by a transversal. The picture has no arrow marks. Are the two lines parallel? Choose the answer with the right reason.' + s.svg, opts,
      br(['The angles are ' + nm + '. If the lines are parallel, these angles ' + (eq ? 'are equal' : 'add to 180°') + '.', eq ? a + '° and ' + b + '°: ' + (s.par ? 'equal, so the lines <b>are</b> parallel.' : 'not equal, so the lines are <b>not</b> parallel.') : t(a + '+' + b + '=' + sum) + ': ' + (s.par ? 'so the lines <b>are</b> parallel.' : 'not 180°, so the lines are <b>not</b> parallel.')]),
      ['Name the pair. What must be true about it if the lines are parallel?', 'Check the numbers exactly: 1° off is not parallel.'], o.text || 'are the lines parallel?');
  }
  /* balusters: a perpendicular transversal and a sloped handrail */
  function railSVG(th) {
    var fg = new Fig(), Pt = [70, -20 - 130 * Math.tan(th * RAD)], R0 = [-60, -20], E = at(Pt, th, 60);
    fg.line([-90, 0], [150, 0], { width: 2.6 }).text(150, 14, 'tread', { size: 12, weight: 600, color: GREY });
    fg.line([70, 0], Pt, { width: 2.6 }).line(R0, E, { width: 3, color: '#9a6a24' }).line(R0, [R0[0] + 80, R0[1]], { dash: '5 4', width: 1.6, color: GREY });
    fg.arc([70, 0], 90, 180, { right: true }).arc(R0, 0, th, { label: th + '°', r: 34 });
    fg.arc(Pt, 180 + th, 270, { label: 'b', r: 22 }).arc(Pt, 270, 360 + th, { label: 'c', r: 20 });
    fg.text(76, -40, 'baluster', { size: 12, weight: 600, color: GREY, anchor: 'start' }).text(E[0] - 4, E[1] - 14, 'handrail', { size: 12, weight: 600, color: '#9a6a24' });
    return fg.svg({ width: 280, aria: 'baluster and handrail' });
  }
  function railPart(r, o) {
    o = o || {};
    var th = find(function () { return r.int(22, 48); }, function (x) { return x !== 36 && x !== 30 && x !== 45; }), b = 90 - th, c = 90 + th;
    var specs = [fld(t('b') + ' =', b, { after: '°', name: 'b', diag: [{ v: th, code: 'u5t-perp-no90', hint: 'The baluster is perpendicular to the horizontal: b and the rail’s ' + th + '° make a right angle together (complementary).' }] }),
      fld(t('c') + ' =', c, { after: '°', name: 'c', diag: [{ v: 180 - th, code: 'u5t-perp-no90', hint: 'c and b make a straight line along the rail: ' + t('c=180^\\circ-b') + '.' }] })];
    return fieldsPart('A carpenter is putting the balusters (upright posts) on a staircase. The balusters are vertical, so they are parallel to each other and perpendicular to the level treads. The handrail rises at ' + D(th) + ' from the horizontal (dashed). Find ' + t('b') + ' and ' + t('c') + ', the angles where a baluster meets the handrail.' + railSVG(th), specs,
      br(['Draw a horizontal line through the top of the baluster. It is parallel to the dashed line, so the rail makes ' + D(th) + ' with it too (corresponding angles).', 'The baluster is perpendicular to that horizontal line: ' + t('b=90^\\circ-' + dg(th) + '=' + dg(b)) + ' (complementary).', t('c=180^\\circ-' + dg(b) + '=' + dg(c)) + ' (on a straight line with b).']),
      ['Picture a horizontal line through the top of the baluster: what angle does it make with the baluster?', 'Complementary angles add to 90°; angles on a straight line add to 180°.'], o.text || 'balusters and handrail');
  }
  /* the angle at a bend between two parallel lines (x = a + b) */
  function bendSVG(al, be, o) {
    o = o || {}; var fg = new Fig(), H = 150, Ax = 20, Cx = 20, L1 = H / (Math.sin(al * RAD) + Math.cos(al * RAD) * Math.tan(be * RAD)), B = [Ax + L1 * Math.cos(al * RAD), L1 * Math.sin(al * RAD)];
    var Av = [Ax, 0], Cv = [Cx, H];
    fg.line([-60, 0], [Math.max(260, B[0] + 70), 0], { width: 2.4 }).line([-60, H], [Math.max(260, B[0] + 70), H], { width: 2.4 }).chev([-30, 0], 0).chev([-30, H], 0);
    fg.text(Math.max(260, B[0] + 70) + 16, 0, 'ℓ₁', { size: 15, italic: false }).text(Math.max(260, B[0] + 70) + 16, H, 'ℓ₂', { size: 15, italic: false });
    fg.line(Av, B, { width: 2.4 }).line(Cv, B, { width: 2.4 }).dot(B).dot(Av).dot(Cv);
    fg.arc(Av, 360 - al, 360, { label: al + '°', r: 34 }).arc(Cv, 0, be, { label: be + '°', r: 34 });
    var dA = Math.atan2(-(Av[1] - B[1]), Av[0] - B[0]) / RAD, dC = Math.atan2(-(Cv[1] - B[1]), Cv[0] - B[0]) / RAD;
    fg.arc(B, n360(dA), n360(dC), { label: o.x || 'x', r: 26 });
    if (o.aux) fg.line([B[0] - 120, B[1]], [B[0] + 60, B[1]], { dash: '5 4', color: BLUE, width: 1.8 });
    fg.text(Av[0] - 2, -14, 'A', { size: 15 }).text(Cv[0] - 2, H + 15, 'C', { size: 15 }).text(B[0] + 14, B[1], 'B', { size: 15 });
    return fg.svg({ width: o.width || 300, aria: 'bend between parallel lines' });
  }
  function bendPart(r, o) {
    o = o || {};
    var s = find(function () { return { a: r.int(22, 68), b: r.int(22, 68) }; }, function (s) { return s.a + s.b >= 55 && s.a + s.b <= 125 && Math.abs(s.a - s.b) >= 6 && s.a + s.b !== 90 && !(s.a === 35 && s.b === 48); });
    var x = s.a + s.b;
    return num(t('\\ell_1\\parallel\\ell_2') + '. A path goes from A on ' + t('\\ell_1') + ' to B, then bends and goes to C on ' + t('\\ell_2') + '. Find ' + t('x') + ', the angle at the bend B. (Hint: picture a line through B parallel to ' + t('\\ell_1') + '.)' + bendSVG(s.a, s.b), x, { dp: 0, after: '°',
      diag: [{ v: 180 - x, code: 'u5t-bend-supp', hint: 'Draw the line through B parallel to ℓ₁: it splits x into two parts, each an alternate interior angle.' }, { v: Math.abs(s.a - s.b), code: 'u5t-bend-diff', hint: 'Both parts of x are on the same side of B: <b>add</b> them.' }, { v: 360 - x, code: 'u5t-bend-reflex', hint: 'That is the reflex angle at B. Give the angle marked x.' }],
      sol: br([bendSVG(s.a, s.b, { aux: true, width: 230 }), 'Draw a line through B parallel to ℓ₁ (and ℓ₂). It splits x into two parts.', 'Top part: ' + D(s.a) + ' (alternate interior with the angle at A). Bottom part: ' + D(s.b) + ' (alternate interior with the angle at C).', t('x=' + dg(s.a) + '+' + dg(s.b) + '=' + dg(x))]),
      hints: ['Draw a line through B parallel to the other two.', 'Look for two Z shapes (alternate interior angles).'], text: o.text || 'bend between parallel lines' });
  }
  /* an angle written (ax + b)° in a parallel-line pair: x, then another angle */
  function algShared(r) {
    return find(function () {
      var type = r.pick(['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'corresponding', 'alt-int']), pr = pairOfAngles(r, type), tilt = find(function () { return r.int(40, 140); }, function (x) { return x < 82 || x > 98; });
      var vE = tAngle(pr[0], tilt), vG = tAngle(pr[1], tilt), a = r.int(2, 5), x = r.int(6, 40), b = vE - a * x;
      return { type: type, e: pr[0], g: pr[1], tilt: tilt, vE: vE, vG: vG, a: a, x: x, b: b };
    }, function (s) { return s.b !== 0 && s.b >= -30 && s.b <= 45; });
  }
  function exprTxt(s, tex) { var bs = s.b > 0 ? ' + ' + s.b : ' − ' + Math.abs(s.b); return tex ? '(' + s.a + 'x' + (s.b > 0 ? '+' + s.b : '-' + Math.abs(s.b)) + ')^\\circ' : '(' + s.a + 'x' + bs + ')°'; }
  function algStem(s) {
    var lab = {}; lab[s.e] = exprTxt(s); lab[s.g] = s.vG + '°';
    return t('\\ell_1\\parallel\\ell_2') + '. A transversal makes the two angles shown: ' + t(exprTxt(s, true)) + ' and ' + D(s.vG) + '.' + G.transversalSVG({ parallel: true, tilt: s.tilt, angles: lab, numbers: true, width: 300 });
  }
  function algPart(r, o) {
    o = o || {};
    var s = algShared(r), E = EQUAL[s.type], rhs = E ? s.vG : 180 - s.vG, wrongR = E ? 180 - s.vG : s.vG, eqn = s.a + 'x' + (s.b > 0 ? '+' + s.b : '-' + Math.abs(s.b)) + '=' + rhs;
    var lin = PAIRS.linear.filter(function (p) { return p.indexOf(s.g) >= 0; }).map(function (p) { return p[0] === s.g ? p[1] : p[0]; }).filter(function (k) { return k !== s.e; }), m = lin[r.int(0, lin.length - 1)], other = 180 - s.vG;
    var diag = [{ v: (wrongR - s.b) / s.a, code: 'u5t-alg-rule', hint: 'These are ' + PAIR_SHORT[s.type] + ' angles: with parallel lines they ' + (E ? 'are <b>equal</b>' : '<b>add to 180°</b>') + '.' },
      { v: (rhs + s.b) / s.a, code: 'u5t-alg-sign', hint: 'Undo the ' + (s.b > 0 ? '+ ' + s.b + ' by subtracting ' + s.b : '− ' + Math.abs(s.b) + ' by adding ' + Math.abs(s.b)) + ' on both sides.' },
      { v: rhs - s.b, code: 'u5t-alg-div', hint: 'You found ' + s.a + 'x. Now divide by ' + s.a + '.' }, { v: rhs / s.a - s.b, code: 'u5t-alg-order', hint: 'Undo the ' + (s.b > 0 ? '+' : '−') + ' ' + Math.abs(s.b) + ' first, then divide by ' + s.a + '.' }];
    var specs = [fld(t('x') + ' =', s.x, { dp: 1, noPlaces: true, name: 'x', diag: diag }),
      fld(t('\\angle ' + m) + ' =', other, { after: '°', name: 'Angle ' + m, diag: [{ v: s.vG, code: 'u5t-vo-supp', hint: '∠' + m + ' and the ' + s.vG + '° angle are next to each other on a straight line: they add to 180°.' }] })];
    return fieldsPart(algStem(s) + 'Find ' + t('x') + '. Then find ' + t('\\angle ' + m) + '.', specs,
      br(['∠' + s.e + ' and ∠' + s.g + ' are ' + PAIR_NAMES[s.type] + ', so they ' + (E ? 'are equal' : 'add to 180°') + ': ' + t(E ? exprTxt(s, true).replace(/\^\\circ$/, '') + '=' + s.vG : exprTxt(s, true).replace(/\^\\circ$/, '') + '+' + s.vG + '=180') + (E ? '' : ', so ' + t(eqn)),
        t(s.a + 'x=' + (rhs - s.b)) + ', so ' + t('x=' + (rhs - s.b) + '\\div ' + s.a + '=' + s.x) + '. Check: ' + t(s.a + '(' + s.x + ')' + (s.b > 0 ? '+' + s.b : '-' + Math.abs(s.b)) + '=' + s.vE) + (E ? ' ✓' : ', and ' + t(s.vE + '+' + s.vG + '=180') + ' ✓'),
        t('\\angle ' + m + '=180^\\circ-' + dg(s.vG) + '=' + dg(other)) + ' (on a straight line with the ' + s.vG + '° angle, ∠' + s.g + ').']),
      ['Name the pair: equal, or add to 180°? Write an equation and solve it.', '∠' + m + ' is next to the ' + s.vG + '° angle at the same crossing.'], o.text || 'parallel lines with (ax + b)°');
  }
  Object.assign(A, { pairMC: pairMC, compSuppPart: compSuppPart, crossPart: crossPart, threeLinesPart: threeLinesPart, pairMCPart: pairMCPart, parFindPart: parFindPart, parGeom: parGeom, parMCPart: parMCPart,
    railSVG: railSVG, railPart: railPart, bendSVG: bendSVG, bendPart: bendPart, algShared: algShared, algStem: algStem, algPart: algPart, exprTxt: exprTxt });

  /* ======================= the questions (paper order; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function QS(num, outcome, level, shared, stem, makes, text) { return { num: String(num), outcome: outcome, text: text, shared: shared, stem: stem, parts: makes.map(function (mk, i) { return { id: num + String.fromCharCode(97 + i), outcome: outcome, level: level, make: mk }; }) }; }
  var QUESTIONS = [
    /* ---------- Beginning ---------- */
    Q(1, 'G6', 'BEG', function (r) { return protPart(r, { classify: true }); }, 'Read a protractor and classify the angle'),
    Q(2, 'G6', 'BEG', function (r) { return estPart(r); }, 'Estimate an angle with referents (within 10°)'),
    Q(3, 'G6', 'BEG', function (r) { return bisectPart(r); }, 'Bisect an angle'),
    Q(4, 'G6', 'BEG', function (r) { return bearWordsPart(r); }, 'A direction as a true bearing'),
    Q(5, 'G6', 'BEG', function (r) { return polySumPart(r); }, 'Angle sum of a polygon'),
    Q(6, 'G5', 'BEG', function (r) { return compSuppPart(r); }, 'Complement and supplement'),
    Q(7, 'G5', 'BEG', function (r) { return pairMCPart(r); }, 'Name a pair of angles (multiple choice)'),
    Q(8, 'G5', 'BEG', function (r) { return crossPart(r); }, 'Two crossing lines: vertically opposite or supplementary'),
    Q(9, 'G1', 'BEG', function (r) { return takePart(r); }, 'Take-away game: how many to take'),
    Q(10, 'G1', 'BEG', function (r) { return tttPart(r); }, 'Tic-tac-toe: win or block'),
    Q(11, 'G1', 'BEG', function (r) { return tanPart(r); }, 'Area of a tangram piece'),
    /* ---------- Progressing ---------- */
    Q(12, 'G6', 'PRG', function (r) { return protReflexPart(r); }, 'Turned protractor: the angle and its reflex angle'),
    Q(13, 'G6', 'PRG', function (r) { return mapBearPart(r); }, 'A bearing on a map and the bearing back'),
    Q(14, 'G6', 'PRG', function (r) { return polyMissPart(r); }, 'The missing angle of a polygon'),
    Q(15, 'G6', 'PRG', function (r) { return copyMCPart(r); }, 'Copy an angle with a protractor (multiple choice)'),
    Q(16, 'G5', 'PRG', function (r) { return parFindPart(r); }, 'Parallel lines: find an angle and name the pair'),
    Q(17, 'G5', 'PRG', function (r) { return threeLinesPart(r); }, 'Three lines through one point'),
    Q(18, 'G5', 'PRG', function (r) { return parMCPart(r); }, 'Are the lines parallel? (multiple choice with a reason)'),
    Q(19, 'G5', 'PRG', function (r) { return railPart(r); }, 'Balusters and a handrail (perpendicular transversal)'),
    Q(20, 'G1', 'PRG', function (r) { return takeVarPart(r); }, 'Take-away game with a changed rule'),
    Q(21, 'G1', 'PRG', function (r) { return hanoiTimePart(r); }, 'Tower puzzle: the time in minutes and seconds'),
    Q(22, 'G1', 'PRG', function (r) { return shipsPart(r); }, 'Hidden ships: how many places are left'),
    /* ---------- Mastery ---------- */
    Q(23, 'G6', 'MAS', function (r) { return routePart(r); }, 'The angle between two legs of a route, from bearings'),
    Q(24, 'G6', 'MAS', function (r) { return polySidesPart(r); }, 'Regular polygon: sides and angle sum from one angle'),
    Q(25, 'G5', 'MAS', function (r) { return bendPart(r); }, 'The angle at a bend between parallel lines'),
    Q(26, 'G5', 'MAS', function (r) { return algPart(r); }, 'Parallel lines with (ax + b)°: x, then another angle'),
    Q(27, 'G1', 'MAS', function (r) { return racePart(r); }, 'Race to N: first or second, and the first square'),
    Q(28, 'G1', 'MAS', function (r) { return forkPart(r); }, 'Tic-tac-toe: the fork')
  ];

  HW.defineTest({
    id: 'u5test', unit: 5, title: 'Unit 5 Test', outcome: 'G6', calc: true,
    blurb: 'The Unit 5 outcomes-based test (G1 puzzles and games, G6 angles, G5 parallel lines and angle pairs): measuring, classifying, estimating, copying and bisecting angles, polygons and true bearings; angle partners, transversals and the parallel-line rules; and spatial puzzles and games, in Beginning, Progressing and Mastery boxes.',
    // Short version (~50%): Beginning keeps G6 the protractor + classify and the true bearing, G5 complement / supplement and
    // naming a pair, G1 the take-away game and tic-tac-toe; Progressing keeps G6 the turned protractor and the map bearing,
    // G5 the parallel-line angle with its reason and "are they parallel?", G1 the changed take-away rule and the tower puzzle;
    // Mastery keeps G6 the route angle, G5 the (ax + b)° pair and G1 the race.
    short: ['1', '4', '6', '7', '9', '10', '12', '13', '16', '18', '20', '21', '23', '26', '27'],
    questions: QUESTIONS
  });
})(window);
