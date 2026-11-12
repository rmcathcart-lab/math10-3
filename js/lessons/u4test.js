/* Math 10-3 · Unit 4 Test (M1, M2) — Volume, Capacity, Mass and Temperature: volume of prisms and cylinders, cubic units,
 * ordering concrete, capacity in SI and US / British units, Celsius and Fahrenheit (and temperature changes), mass in SI
 * and imperial units (pounds and ounces), converting mass between the systems, prices per lb and per kg, and changing
 * volume to mass (gravel, water, Canadian bushels and tonnes). Built the way the Unit 1 test was built (Beginning /
 * Progressing / Mastery boxes, typed answers, keys from the generated numbers, `bad` answers with u4t- codes, worked
 * solutions and hints), with new items in the style of the booklet's review lesson (u4_l07.tex) and Practice Test 2
 * (u4_ep07.tex). Calculator allowed (π key).
 * Outcomes per part: M1 for SI-only parts (cm³ / m³ / L / g / kg / t, water and gravel), M2 for imperial or
 * SI ↔ imperial parts (in³ / ft³ / yd³, US and British gallons, °F, lb / oz / tons, bushels).
 * Constants exactly as the booklet gives them: 1 ft³ = 1728 in³, 1 yd³ = 27 ft³, 1 m³ = 1 000 000 cm³; 1 mL = 1 cm³,
 * 1 L = 1000 mL, 1 m³ = 1000 L; 1 US gal = 4 qt = 8 pt = 16 cups = 128 fl oz, 1 US gal ≈ 3.785 L, 1 British gal ≈ 4.546 L;
 * F = 1.8 × C + 32, C = (F − 32) ÷ 1.8, quick estimates F ≈ 2C + 30, C ≈ (F − 30) ÷ 2, a change of 1 C° = 1.8 F°;
 * 1 t = 1000 kg, 1 kg = 1000 g, 1 g = 1000 mg, 1 ton = 2000 lb, 1 lb = 16 oz; 1 lb ≈ 0.454 kg, 1 kg ≈ 2.2 lb,
 * 1 oz ≈ 28.35 g; water 1 L ≈ 1 kg, gravel 1.7 t/m³, topsoil 1.3 t/m³, concrete 2.4 t/m³; the Canadian (imperial)
 * bushel: 1 bu ≈ 1.28 ft³, 1 m³ ≈ 27.5 bu; crops in bu/t: wheat and field peas 36.7, flax 39.4, canola 44.1, barley 45.9,
 * oats 64.8. Factors that change systems are printed in each question; the exact relations inside a system and the
 * temperature formulas are not (as on the booklet's practice tests).
 * 26 questions / 28 parts: Beginning 11 parts, Progressing 11, Mastery 6 — about 80 minutes (short_report.js:
 * 1.5 / 3 / 5 min a part). The short version (def.short) is about half of that and keeps every box of both outcomes.
 *
 *   Beginning   — one-step skills: M1 the volume of a box; the volume of a cylinder; L / mL / cm³ / m³; g / kg / t / mg.
 *                 M2 ft³ ↔ in³ and yd³ ↔ ft³; US gallons, quarts, pints, cups and fluid ounces; °C to °F; °F to °C;
 *                 lb / kg / oz / g with a conversion fact; bushels ↔ tonnes; a quick temperature estimate (multiple choice).
 *   Progressing — the typical assignment question: M1 a triangular prism; a cylinder's capacity in litres; loads of
 *                 gravel (volume → mass → loads); the most pallets under a bridge limit. M2 a concrete slab in feet and
 *                 inches — the ft³, then the order in half cubic yards and its cost; filling a tank in litres at a price
 *                 per US gallon; a temperature change on the other scale; adding / subtracting pounds and ounces; $/lb
 *                 against $/kg (which store, by how much per kg); $/t ↔ $/bu.
 *   Mastery     — skills combined: M2 a grain bin (cylinder in feet → bushels → what the grain is worth at $/t); gas in
 *                 Montana against Calgary ($ USD per US gallon → $ CAD per litre) — where it is cheaper and how much a
 *                 full tank saves; the greatest number of items in a parcel (oz and g against a kg limit). M1 how many
 *                 adults a deck under a hot tub can hold (m and cm → L → kg); the thickness of a slab from the concrete
 *                 left over (working backwards, m³ → cm).
 * Conversions to online: "which is cheaper and by how much" → a word box + an amount box (whichAmtPart); "how much should
 * be ordered, and what will it cost" → two labelled boxes; pounds and ounces → two boxes (lb, oz); "estimate" → multiple
 * choice of estimates (Beginning only); "is the load legal / can it cross" → the greatest number that fits (a number).
 * Partial credit: a recognized mistake that is one slip keeps 2/3 ('s'), a bigger but reasonable one keeps 1/3 ('b'),
 * see HW.addPartial below; in a set of 3+ boxes, one box wrong is a small mistake. A count rounded the wrong way (bags
 * down, a limit up) is a small mistake; the right count typed unrounded gets a nudge (no try used).
 *
 * Also exports HW.u4assess, the assessment kit used by the Unit 4 exit slips (js/exits/u4.js loads after this file).
 * The test uses no lesson kit (HW.u4conv, HW.u4kit, HW.u4lboz, HW.u4mass, HW.u4bu), so tools that load only the test
 * files (tests/short_report.js) still work. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u4assess = {};
  var PI = Math.PI;

  /* ================= numbers, money and units ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function r2(x) { return rd(x, 2); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }
  function N(x) { return HW.fmt(nS(x)); }
  function par(x) { return x < 0 ? '(' + N(x) + ')' : N(x); }
  function c2(x) { return HW.fmt(r2(x).toFixed(2)); }
  function Mt(x) { return '\\$' + c2(x); }
  function MM(x) { return t(Mt(x)); }
  function raw5(x) { var s = +x.toFixed(5); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toM(x) { return near(x, r2(x), 1e-7) ? '=\\$' + c2(x) : '=' + raw5(x) + '\\approx\\$' + c2(x); }
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '=' + raw5(x) + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function fx(x, dp) { return HW.fmt(rd(x, dp).toFixed(dp)); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u4 assessment: no valid numbers'); return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  /* a unit in TeX: 'cm³' → \text{ cm}^{3}, '°C' → ^\circ\text{C} */
  function uT(s) {
    if (!s) return '';
    if (s === '°C' || s === '°F') return '^\\circ\\text{' + s.charAt(1) + '}';
    var m = /^(.*?)([³²])$/.exec(s); if (m) return '\\text{ ' + m[1] + '}^{' + (m[2] === '³' ? 3 : 2) + '}';
    return '\\text{ ' + s + '}';
  }
  function U(x, u) { return t(N(x) + uT(u)); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pickR(r, a) { var s = a[2] || 1; return q(a[0] + s * r.int(0, Math.round((a[1] - a[0]) / s))); }
  function pickX(r, list, not) { return find(function () { return r.pick(list); }, function (v) { return (not || []).indexOf(v) < 0; }, list[0]); }
  function frac(x) { return x - Math.floor(x); }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm'], ['Tyler', 'm'], ['Jaya', 'f']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || not.indexOf(x[0]) < 0; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his', him: p[1] === 'f' ? 'her' : 'him' }; }
  /* the booklet's crop factors (bushels per tonne) */
  var CROPS = { wheat: 36.7, 'field peas': 36.7, flax: 39.4, canola: 44.1, barley: 45.9, oats: 64.8 };
  var PRICE_T = { wheat: [255, 320], 'field peas': [280, 360], flax: [560, 680], canola: [620, 720], barley: [220, 280], oats: [260, 320] };
  var TOWNS = ['Vegreville', 'Lethbridge', 'Red Deer', 'Olds', 'Vulcan', 'Camrose', 'Brooks', 'Lacombe', 'Taber', 'Drumheller', 'Three Hills', 'Wetaskiwin'];
  Object.assign(A, { rd: rd, r2: r2, q: q, near: near, nS: nS, N: N, par: par, c2: c2, Mt: Mt, MM: MM, raw5: raw5, toM: toM, toN: toN, fx: fx, find: find, br: br, uT: uT, U: U, cap: cap,
    pickR: pickR, pickX: pickX, frac: frac, person: person, CROPS: CROPS, PRICE_T: PRICE_T, TOWNS: TOWNS });

  /* ================= reading and checking a number ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/[−–]/g, '-');
    s = s.replace(/\^\{?\\circ\}?|\\circ|\\degree|°|º/g, ' °');
    var pct = /%/.test(s);
    s = s.replace(/\\\$|\$/g, '').replace(/\\%|%/g, '').replace(/\\[,;: ]|~/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^°][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^-?\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u4t-comma', 'Use a decimal point (not a comma), like 12.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, pct: pct };
  }
  /* an answer rounded to dp places. o: { dp, money, exact, alts (other right values), tol (also right when this close),
   * diag [{v, code, hint}] (wrong), nudge [{v, code, hint}] (a format nudge, no try used), word (the rounding place in
   * words), noPlaces (an exact answer: no "round to …" nudge for too few decimals), count ('up' | 'down': a whole number
   * rounded that way from o.exact, with o.why), miss (hint for any other value) } */
  function amtChk(ans, o) {
    o = o || {};
    var money = !!o.money, dp = money ? 2 : (o.dp == null ? 2 : o.dp), step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (money ? 'the cent (2 decimal places)' : dp === 0 ? 'a whole number' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp === 2 ? 'the nearest hundredth (2 decimal places)' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc0 = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var isAcc = function (x) { return isAcc0(x) || (o.tol && Math.abs(x - ans) <= o.tol + 1e-9); };
    var keep = function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); };
    var dg = (o.diag || []).filter(keep), ng = (o.nudge || []).filter(keep);
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc0(v) || (d <= dp && isAcc(v))) { if (money && a.pct) return form('u4t-pct-sign', 'This answer is an amount of money, not a percent. Leave the % sign out.'); return ok(); }
      if (o.count && d > 0 && Math.abs(v - exact) < Math.pow(10, -d) * 0.51) return form('u4t-count-whole', 'Now make it a whole number: round <b>' + o.count + '</b>, because ' + (o.why || (o.count === 'up' ? 'a part is not enough.' : 'the next one would go over the limit.')));
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      if (o.count) {
        if (d > 0 && Math.abs(v - exact) < Math.pow(10, -d) * 0.51) return form('u4t-count-whole', 'Now make it a whole number: round <b>' + o.count + '</b>, because ' + (o.why || (o.count === 'up' ? 'a part is not enough.' : 'the next one would go over the limit.')));
        var other = o.count === 'up' ? Math.floor(exact + 1e-9) : Math.ceil(exact - 1e-9);
        if (d === 0 && near(v, other, 1e-9) && !isAcc(other)) return wrong('u4t-count-dir', 'Check which way to round: ' + (o.count === 'up' ? t(N(other)) + ' is not enough, so round <b>up</b>.' : t(N(other)) + ' goes over the limit, so round <b>down</b>.'));
      }
      for (var j = 0; j < ng.length; j++) if (near(v, ng[j].v, tol) || near(v, rd(ng[j].v, dp), tol)) return form(ng[j].code, ng[j].hint);
      for (var i = 0; i < dg.length; i++) {
        var m = dg[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
        if (dp >= 2 && d === dp - 1 && near(v, rd(m.v, d), 1e-9) && !acc.some(function (y) { return near(rd(y, d), v, 1e-9); })) return wrong(m.code, m.hint);
      }
      if (!o.noPlaces && dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u4t-places', money ? 'Give money to the cent (2 decimal places), like $12.49.' : 'Round to ' + word + '.');
      if (!o.count && d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u4t-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  function keyOf(ans, o) { o = o || {}; var dp = o.money ? 2 : (o.dp == null ? 2 : o.dp); return o.money ? r2(ans).toFixed(2) : nS(rd(ans, dp)); }
  function badOf(o, ans) {
    var dp = o.money ? 2 : (o.dp == null ? 2 : o.dp), acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    return (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }) && !(o.tol && Math.abs(rd(m.v, dp) - ans) <= o.tol + 1e-9); })
      .map(function (m) { return keyOf(m.v, o); });
  }
  /* a word answer (A or B, Montana or Calgary): the first 3 letters are enough */
  var STOP = { the: 1, store: 1, buy: 1, buying: 1, 'in': 1, at: 1, from: 1, is: 1, cheaper: 1, colder: 1, it: 1, city: 1, gas: 1 };
  function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[.,'’!:;()]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
  function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
  function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
  function whichOf(resp, right, wrongs) {
    var ws = words(resp); if (!ws.length) return 'empty';
    var a = hit(ws, right), b = hit(ws, wrongs);
    return a && b ? 'both' : a ? 'right' : b ? 'wrong' : 'none';
  }

  /* ================= part builders ================= */
  /* one number. o as amtChk, plus before, after (a unit shown after the box), unit (for the answer), sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {};
    var key = keyOf(ans, o), before = o.before !== undefined ? o.before : o.money ? '$' : undefined, after = o.after;
    var unit = o.unit !== undefined ? o.unit : after;
    var ansT = (o.money ? '\\$' : '') + HW.fmt(key) + (unit && !o.money ? uT(unit) : '');
    var p = { prompt: prompt, input: { type: 'number', before: before, after: after }, check: amtChk(ans, o), key: key, answer: t(ansT) + (o.money && unit ? ' ' + unit : ''), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badOf(o, ans);
    p.good = [];
    if (o.money) p.good.push('$' + key, key + '0');
    if (after && /^[a-zA-Z°]/.test(after)) p.good.push(key + ' ' + after);
    return p;
  }
  /* a box in a set of boxes */
  function fld(label, ans, o) {
    o = o || {}; var key = keyOf(ans, o);
    return { label: label, name: o.name, before: o.before !== undefined ? o.before : o.money ? '$' : undefined, after: o.after, chk: amtChk(ans, o), key: key,
      show: t((o.money ? '\\$' : '') + HW.fmt(key) + (o.after && !o.money ? uT(o.after) : '')), bad: badOf(o, ans) };
  }
  /* several boxes. Grading: all right → correct; one box wrong in a set of 3 or more with no recognized mistake →
   * 'u4t-one-box' (small), of 2 → 'u4t-half-box' (bigger); one recognized mistake → its own code; several wrong boxes
   * with the same recognized mistake → that code; otherwise 'u4t-many-box'. */
  function multiChk(checks, labels) {
    return function (resp) {
      resp = resp || [];
      var res = checks.map(function (c, i) { return c(resp[i] == null ? '' : resp[i]); });
      var lab = function (i) { return '<b>' + labels[i] + ':</b> '; };
      var wi = [], fi = [];
      res.forEach(function (x, i) { if (x.v === 'wrong') wi.push(i); else if (x.v === 'form') fi.push(i); });
      if (!wi.length && !fi.length) return ok();
      if (!wi.length) { var f0 = res[fi[0]]; return form(f0.code, lab(fi[0]) + (f0.hint || 'Check this one again.')); }
      var w0 = res[wi[0]], hint = lab(wi[0]) + (w0.hint || 'Check this one again.');
      if (wi.length === 1) {
        if (w0.code && w0.code !== 'value') return wrong(w0.code, hint);
        return wrong(res.length >= 3 ? 'u4t-one-box' : 'u4t-half-box', hint);
      }
      var codes = wi.map(function (i) { return res[i].code; });
      if (codes.every(function (c) { return c && c !== 'value' && c === codes[0]; })) return wrong(codes[0], hint);
      return wrong('u4t-many-box', hint);
    };
  }
  function fieldsPart(prompt, specs, sol, hints, text) {
    var labels = specs.map(function (s) { return String(s.name || s.label).replace(/:$/, '').replace(/<[^>]+>/g, ''); });
    var p = { prompt: prompt, input: { type: 'fields', fields: specs.map(function (s) { return { label: s.label, name: s.name || s.label.replace(/:$/, ''), before: s.before, after: s.after, mode: s.mode, placeholder: s.ph, wide: s.mode === 'text' }; }) },
      check: multiChk(specs.map(function (s) { return s.chk; }), labels), key: specs.map(function (s) { return String(s.key); }),
      answer: specs.map(function (s) { return s.label + ' ' + s.show; }).join('<br>'), solution: sol, hints: hints || [], text: text };
    var b0 = (specs[0].bad || []).filter(function (x) { return x !== String(specs[0].key); })[0];
    p.bad = [specs.map(function (s, i) { return i === 0 ? (b0 || '99999') : String(s.key); })];
    return p;
  }
  /* "Which is cheaper (colder…), and by how much?": a word box + an amount box. The amount decides the credit: right
   * amount but the wrong (or unclear) choice → 'u4t-which' (bigger); a wrong amount → its own code.
   * o: { amt, money (default true), dp, after, alts, tol, diag, whichLabel, amtLabel, ph, right, wrongs, rightKey, wrongKey, why, nudge, sol, hints, text } */
  function whichAmtPart(prompt, o) {
    var money = o.money !== false, ao = { money: money, dp: o.dp, alts: o.alts, tol: o.tol, diag: o.diag }, amt = amtChk(o.amt, ao), amtLabel = o.amtLabel || 'By how much:';
    var check = function (resp) {
      resp = resp || []; var w = whichOf(resp[0], o.right, o.wrongs), a = amt(resp[1] == null ? '' : resp[1]);
      if (w === 'empty') return form('empty', '<b>' + o.whichLabel + '</b> Type your choice.');
      if (a.v === 'form') return form(a.code, '<b>' + amtLabel + '</b> ' + (a.hint || 'Check the format.'));
      if (w === 'right' && a.v === 'correct') return ok();
      if (w !== 'right' && a.v === 'correct') return wrong('u4t-which', w === 'both' || w === 'none' ? 'Type just one choice: ' + o.nudge : o.why);
      return wrong(a.code || 'value', '<b>' + amtLabel + '</b> ' + (a.hint || 'Find each amount, then subtract.'));
    };
    var key = [o.rightKey, keyOf(o.amt, ao)], show = money ? MM(o.amt) : t(HW.fmt(key[1]) + uT(o.after));
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: o.whichLabel, name: 'Choice', mode: 'text', placeholder: o.ph, wide: true }, { label: amtLabel, name: 'By how much', before: money ? '$' : undefined, after: o.after }] },
      check: check, key: key, answer: o.whichLabel + ' <b>' + o.rightKey + '</b><br>' + amtLabel + ' ' + show, solution: o.sol, hints: o.hints || [], text: o.text,
      bad: [[o.wrongKey, key[1]]].concat(badOf(ao, o.amt).map(function (b) { return [o.rightKey, b]; })),
      good: [['the ' + o.rightKey, (money ? '$' : '') + key[1]]] };
  }
  /* pounds and ounces in two boxes (lb, oz). tot: the answer in ounces (whole). diag [{lb, oz, code, hint}].
   * The right mass with 16 oz or more → a "trade 16 oz for 1 lb" nudge; decimal pounds in the lb box (oz empty) → a nudge. */
  function lbozChk(tot, diag) {
    var L0 = Math.floor(tot / 16), O0 = tot - 16 * L0;
    return function (resp) {
      resp = resp || [];
      var sL = String(resp[0] == null ? '' : resp[0]).trim(), sO = String(resp[1] == null ? '' : resp[1]).trim();
      if (!sL && !sO) return form('empty', 'Type the pounds and the ounces.');
      var a = sL ? readNum(sL) : { v: 0, d: 0 }, b = sO ? readNum(sO) : { v: 0, d: 0 };
      if (a.res) return form(a.res.code, '<b>lb:</b> ' + a.res.hint); if (b.res) return form(b.res.code, '<b>oz:</b> ' + b.res.hint);
      var L = a.v, O = b.v, T = L * 16 + O;
      if (near(L, L0) && near(O, O0)) return ok();
      if (!sO && !near(L, Math.round(L)) && near(T, tot, 1e-6)) return form('u4t-dec-lb', 'Right mass in pounds. Now write the part after the decimal point as ounces: ' + t(N(rd(L - Math.floor(L), 4)) + '\\times 16') + '.');
      if (near(T, tot, 1e-6) && O >= 16) return form('u4t-trade16', 'Right total, but ' + t(N(O)) + ' oz is 16 oz or more: trade 16 oz for 1 lb.');
      if (near(T, tot, 1e-6) && near(L, Math.round(L)) && near(O, Math.round(O))) return form('u4t-trade16', 'Write it with fewer than 16 oz.');
      for (var i = 0; i < (diag || []).length; i++) { var m = diag[i]; if (near(L, m.lb) && near(O, m.oz) && !(m.lb === L0 && m.oz === O0)) return wrong(m.code, m.hint); }
      return wrong('value', null);
    };
  }
  function lbozPart(prompt, tot, o) {
    o = o || {}; var L0 = Math.floor(tot / 16), O0 = tot - 16 * L0;
    var dg = (o.diag || []).filter(function (m) { return !(m.lb === L0 && m.oz === O0) && m.oz >= 0; });
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Pounds:', name: 'lb', after: 'lb' }, { label: 'Ounces:', name: 'oz', after: 'oz' }] },
      check: lbozChk(tot, dg), key: [String(L0), String(O0)], answer: t(L0 + '\\text{ lb }' + O0 + '\\text{ oz}'), solution: o.sol, hints: o.hints || [], text: o.text,
      bad: dg.map(function (m) { return [String(m.lb), String(m.oz)]; }), good: [[L0 + ' lb', O0 + ' oz']] };
  }
  function lo(tot) { var L = Math.floor(tot / 16); return t(L + '\\text{ lb }' + (tot - 16 * L) + '\\text{ oz}'); }
  function loT(L, O) { return L + '\\text{ lb }' + O + '\\text{ oz}'; }
  /* an MC of numbers: opts [{v, right, why}] (values must differ) */
  function numMC(r, prompt, opts, fmt, sol, hints, text) { return P.mc(r, prompt, opts.map(function (o) { return { html: fmt(o.v), right: !!o.right, why: o.why }; }), sol, hints || [], text); }
  function table(head, rows) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em"><tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  Object.assign(A, { readNum: readNum, amtChk: amtChk, keyOf: keyOf, whichOf: whichOf, num: num, fld: fld, multiChk: multiChk, fieldsPart: fieldsPart, whichAmtPart: whichAmtPart,
    lbozChk: lbozChk, lbozPart: lbozPart, lo: lo, loT: loT, numMC: numMC, table: table });

  /* ================= wrong-answer codes (shared by the test and the exit slips) ================= */
  HW.addCodes({
    'u4t-comma': 'Comma instead of a decimal point', 'u4t-places': 'Not rounded to the place asked', 'u4t-round-dir': 'Rounded the wrong way', 'u4t-pct-sign': 'Money written with a % sign',
    'u4t-count-whole': 'Right count, not yet a whole number', 'u4t-count-dir': 'Rounded a count the wrong way (up / down)', 'u4t-which': 'Right amount, wrong (or unclear) choice',
    'u4t-one-box': 'One box of several wrong', 'u4t-half-box': 'One of the two boxes wrong', 'u4t-many-box': 'Several boxes wrong',
    'u4t-dec-lb': 'Decimal pounds instead of pounds and ounces', 'u4t-trade16': 'Pounds and ounces not traded (16 oz or more)',
    'u4t-add-lengths': 'Added the lengths', 'u4t-area-only': 'Found an area (one layer) instead of the volume', 'u4t-surface': 'Found the surface area',
    'u4t-diam': 'Mixed up the radius and the diameter', 'u4t-r-times-2': 'Used r × 2 instead of r²', 'u4t-no-pi': 'Left out π', 'u4t-no-sq': 'Did not square the radius', 'u4t-pi-314': 'Used 3.14 for π',
    'u4t-no-half': 'Triangle: forgot the ½', 'u4t-cube-len': 'Cubic units: used the length factor (12, 3, 100)', 'u4t-cube-area': 'Cubic units: used the area factor (144, 9)', 'u4t-cube-way': 'Cubic units: multiplied instead of dividing (or the reverse)',
    'u4t-si-100': 'Used 100 or 10 instead of 1000', 'u4t-si-way': 'SI units: multiplied instead of dividing (or the reverse)', 'u4t-m3-cm3': 'Used 1 000 000 for m³ ↔ L',
    'u4t-no-1000': 'Did not change cm³ to L (÷ 1000) or m³ to L (× 1000)', 'u4t-chain-step': 'US units: used only one step of the chain', 'u4t-cap-way': 'US units: multiplied instead of dividing (or the reverse)',
    'u4t-british': 'Used the British unit instead of the US one (or the reverse)', 'u4t-no-32': 'Temperature: left out the 32', 'u4t-order': 'Temperature: added 32 before multiplying',
    'u4t-formula': 'Temperature: used the other formula', 'u4t-estimate': 'Temperature: gave the quick estimate, not the exact value', 'u4t-neg': 'Temperature: lost the negative sign',
    'u4t-brackets': 'Temperature: no brackets (divided before subtracting 32)', 'u4t-no-18': 'Temperature: did not divide by 1.8', 'u4t-times18': 'Temperature: multiplied by 1.8 instead of dividing',
    'u4t-plus32': 'Temperature: added 32 instead of subtracting', 'u4t-change-c': 'Change: gave the change on the first scale (not converted)', 'u4t-change-32': 'Change: added or subtracted 32',
    'u4t-change-sign': 'Change: subtracted across zero wrongly', 'u4t-change-way': 'Change: × 1.8 and ÷ 1.8 mixed up',
    'u4t-fact-way': 'Mass: used the conversion fact the wrong way', 'u4t-est-30': 'Used 30 g for an ounce (the estimate)', 'u4t-oz-tenths': 'Read ounces as tenths of a pound',
    'u4t-dec-as-oz': 'Read the decimal part of a pound as ounces', 'u4t-oz-12': 'Used 12 (or 10) oz in a pound', 'u4t-trade-10': 'Traded 10 oz for a pound instead of 16', 'u4t-borrow-10': 'Borrowed 10 oz instead of 16',
    'u4t-no-borrow': 'Subtracted the smaller ounces from the bigger (no borrowing)', 'u4t-bu-way': 'Bushels and tonnes: multiplied instead of dividing (or the reverse)', 'u4t-bu-flip': 'Bushels: divided the factor by the amount',
    'u4t-in-ft': 'Did not change inches to feet', 'u4t-in-10': 'Changed inches to feet with ÷ 10', 'u4t-gave-yd': 'Gave cubic yards instead of cubic feet',
    'u4t-order-down': 'Order rounded to the nearest half yard (not up)', 'u4t-whole-yd': 'Order rounded up to whole yards, not half yards', 'u4t-exact-order': 'Did not round the order up', 'u4t-per-ft': 'Priced cubic feet as cubic yards',
    'u4t-gal-way': 'Gallons: multiplied by 3.785 instead of dividing (or the reverse)', 'u4t-no-conv': 'Did not convert the units', 'u4t-gave-gal': 'Gave the gallons instead of the cost',
    'u4t-price-way': 'Price per lb / per kg: converted the price like a mass', 'u4t-gave-total': 'Gave a total instead of the difference', 'u4t-gave-mass': 'Gave the mass instead of the number of loads',
    'u4t-no-factor': 'Did not change the volume to a mass', 'u4t-no-truck': 'Left out the mass of the empty truck', 'u4t-bu-ft-way': 'Bushels: multiplied by 1.28 instead of dividing',
    'u4t-gave-vol': 'Gave the volume instead of the bushels', 'u4t-gave-tonnes': 'Gave the tonnes instead of the value (or bushels)', 'u4t-no-tonnes': 'Priced the bushels at the price per tonne',
    'u4t-no-water': 'Left out the mass of the water', 'u4t-no-rate': 'Left out the exchange rate', 'u4t-one-litre': 'Gave the saving on one litre, not the tank', 'u4t-rate-way': 'Divided by the exchange rate instead of multiplying',
    'u4t-no-pack': 'Left out the box and packing', 'u4t-gave-m': 'Gave the thickness in metres, not centimetres', 'u4t-times-back': 'Working backwards: multiplied instead of dividing', 'u4t-cm-1000': 'Changed m to cm with × 1000'
  });
  HW.addPartial({
    'u4t-round-dir': 's', 'u4t-count-dir': 's', 'u4t-which': 'b', 'u4t-one-box': 's', 'u4t-half-box': 'b', 'u4t-many-box': 'n',
    'u4t-add-lengths': 'n', 'u4t-area-only': 'b', 'u4t-surface': 'n', 'u4t-diam': 'b', 'u4t-r-times-2': 'b', 'u4t-no-pi': 'b', 'u4t-no-sq': 'b', 'u4t-no-half': 'b',
    'u4t-cube-len': 'b', 'u4t-cube-area': 'b', 'u4t-cube-way': 'n', 'u4t-si-100': 'b', 'u4t-si-way': 'n', 'u4t-m3-cm3': 'b', 'u4t-no-1000': 'b', 'u4t-chain-step': 'b', 'u4t-cap-way': 'n', 'u4t-british': 'b',
    'u4t-no-32': 'b', 'u4t-order': 'b', 'u4t-formula': 'n', 'u4t-estimate': 'b', 'u4t-neg': 'b', 'u4t-brackets': 'b', 'u4t-no-18': 'b', 'u4t-times18': 'b', 'u4t-plus32': 'b',
    'u4t-change-c': 'b', 'u4t-change-32': 'b', 'u4t-change-sign': 'b', 'u4t-change-way': 'b', 'u4t-fact-way': 'n', 'u4t-est-30': 'b', 'u4t-oz-tenths': 'b', 'u4t-dec-as-oz': 'b', 'u4t-oz-12': 'b',
    'u4t-trade-10': 'b', 'u4t-borrow-10': 'b', 'u4t-no-borrow': 'b', 'u4t-bu-way': 'n', 'u4t-bu-flip': 'n', 'u4t-in-ft': 'b', 'u4t-in-10': 'b', 'u4t-gave-yd': 's',
    'u4t-order-down': 'b', 'u4t-whole-yd': 's', 'u4t-exact-order': 'b', 'u4t-per-ft': 'n', 'u4t-gal-way': 'n', 'u4t-no-conv': 'n', 'u4t-gave-gal': 'b', 'u4t-price-way': 'n', 'u4t-gave-total': 'b',
    'u4t-gave-mass': 'b', 'u4t-no-factor': 'b', 'u4t-no-truck': 'b', 'u4t-bu-ft-way': 'n', 'u4t-gave-vol': 'b', 'u4t-gave-tonnes': 'b', 'u4t-no-tonnes': 'b', 'u4t-no-water': 'b',
    'u4t-no-rate': 'b', 'u4t-one-litre': 'b', 'u4t-rate-way': 'b', 'u4t-no-pack': 'b', 'u4t-gave-m': 's', 'u4t-times-back': 'n', 'u4t-cm-1000': 'b'
  });

  /* ================= shared generators (the test and the exit slips) ================= */
  /* ---- volume of a box ---- */
  var BOXES = [{ n: 'A shipping box', u: 'cm', l: [30, 60, 1], w: [20, 40, 1], h: [15, 35, 1] }, { n: 'A cereal box', u: 'cm', l: [18, 28, 1], w: [5, 9, 1], h: [25, 33, 1] },
    { n: 'The cargo space of a moving truck', u: 'm', l: [3.5, 6.5, 0.1], w: [1.8, 2.4, 0.1], h: [1.9, 2.5, 0.1] }, { n: 'A raised garden bed', u: 'm', l: [1.8, 3.6, 0.1], w: [0.8, 1.4, 0.1], h: [0.25, 0.45, 0.05] },
    { n: 'A storage bin', u: 'm', l: [1.2, 2.4, 0.1], w: [0.6, 1.2, 0.1], h: [0.5, 1.1, 0.1] }];
  function boxPart(r, o) {
    o = o || {};
    var b = r.pick(o.list || BOXES), v = find(function () { return [pickR(r, b.l), pickR(r, b.w), pickR(r, b.h)]; }, function (v) { return v[0] > v[1] && !(v[0] === 19 && v[1] === 7); });
    var l = v[0], w = v[1], h = v[2], V = q(l * w * h), u = b.u;
    return num(b.n + ' is ' + U(l, u) + ' long, ' + U(w, u) + ' wide and ' + U(h, u) + ' high. What is its volume? (Round to the nearest hundredth if needed.)', V, { dp: 2, after: u + '³',
      diag: [{ v: l + w + h, code: 'u4t-add-lengths', hint: 'Volume multiplies the three lengths: ' + t('V=l\\times w\\times h') + '.' }, { v: l * w, code: 'u4t-area-only', hint: 'That’s the area of the bottom (one layer). Multiply by the height too.' },
        { v: 2 * (l * w + l * h + w * h), code: 'u4t-surface', hint: 'That’s the surface area (the six faces). Volume is ' + t('l\\times w\\times h') + '.' }],
      sol: t('V=l\\times w\\times h=' + N(l) + '\\times ' + N(w) + '\\times ' + N(h) + toN(V, 2) + uT(u + '³')), hints: ['V = length × width × height.', 'The answer is in cubic units (' + u + '³).'], text: o.text || 'box volume ' + u });
  }
  /* ---- volume of a cylinder (sys: 'SI' or 'imp') ---- */
  var CYL = { SI: [{ n: 'A soup can', u: 'cm', d: [6.4, 10.6, 0.2], h: [8, 14, 0.2] }, { n: 'A pillar candle', u: 'cm', d: [5.6, 9.6, 0.2], h: [10, 20, 1] }, { n: 'A water tank', u: 'm', d: [0.8, 2.4, 0.1], h: [1, 2.5, 0.1] },
    { n: 'A round planter', u: 'cm', d: [30, 60, 2], h: [25, 50, 1] }],
    imp: [{ n: 'A round hay bale (lying on its side)', u: 'ft', d: [4, 6, 0.5], h: [4, 5, 0.5], tall: 'wide' }, { n: 'A paint pail', u: 'in', d: [6, 12, 0.5], h: [7, 14, 0.5] }, { n: 'A round water trough', u: 'ft', d: [3, 8, 0.5], h: [1.5, 3, 0.5] },
      { n: 'A coffee can', u: 'in', d: [4, 6.5, 0.5], h: [5, 8, 0.5] }] };
  function cylLines(r0, h, u, V, dp, give) { return [give === 'd' ? t('r=' + N(2 * r0) + '\\div 2=' + N(r0)) + ' ' + u : null, t('V=\\pi r^2h=\\pi\\times ' + N(r0) + '^2\\times ' + N(h) + toN(V, dp) + uT(u + '³'))]; }
  function cylPart(r, o) {
    o = o || {};
    var c = r.pick(CYL[o.sys || 'SI']), v = find(function () { return [pickR(r, c.d), pickR(r, c.h)]; }, function (v) { return !(v[0] === 7.4 && v[1] === 10.2) && !(v[0] === 5 && v[1] === 4); });
    var d = v[0], h = v[1], r0 = d / 2, giveR = r.chance(0.3), u = c.u, V = PI * r0 * r0 * h;
    var size = giveR ? 'has a radius of ' + U(r0, u) : 'is ' + U(d, u) + ' across (diameter)';
    return num(c.n + ' ' + size + ' and is ' + U(h, u) + ' ' + (c.tall || 'tall') + '. What is its volume, to the nearest tenth?', V, { dp: 1, after: u + '³',
      diag: [giveR ? { v: PI * r0 * r0 / 4 * h, code: 'u4t-diam', hint: 'The ' + t(N(r0)) + ' ' + u + ' is already the radius: do not halve it.' } : { v: PI * d * d * h, code: 'u4t-diam', hint: 'Use the <b>radius</b> (half the diameter): ' + t('r=' + N(d) + '\\div 2=' + N(r0)) + '.' },
        { v: PI * 2 * r0 * h, code: 'u4t-r-times-2', hint: t('r^2') + ' means ' + t('r\\times r') + ', not ' + t('r\\times 2') + '.' }, { v: r0 * r0 * h, code: 'u4t-no-pi', hint: 'The base is a circle: its area is ' + t('\\pi r^2') + '. Use the π key.' },
        { v: PI * r0 * h, code: 'u4t-no-sq', hint: 'Square the radius: ' + t('\\pi r^2 h') + '.' }],
      nudge: [{ v: 3.14 * r0 * r0 * h, code: 'u4t-pi-314', hint: 'Close — use the π key on your calculator, not 3.14.' }],
      sol: br(cylLines(r0, h, u, V, 1, giveR ? 'r' : 'd')), hints: ['V = π r² h (area of the circle base × height).', giveR ? 'The radius is given.' : 'Halve the diameter to get the radius.'], text: o.text || 'cylinder ' + u });
  }
  /* ---- SI unit changes (kind 'cap' or 'mass') ---- */
  var SI = { cap: [['L', 'mL', 1000, [1.5, 3.2, 0.8, 1.25, 4.5, 0.6, 2.4, 0.35]], ['mL', 'L', 0.001, [450, 250, 600, 125, 850, 2500, 1750, 75]], ['cm³', 'L', 0.001, [1250, 2400, 500, 750, 3600, 900]],
      ['m³', 'L', 1000, [4.5, 1.2, 3, 0.8, 6.5, 2.25, 0.25]], ['L', 'm³', 0.001, [600, 2500, 750, 4200, 3000, 1500, 85]], ['L', 'cm³', 1000, [0.75, 1.5, 2, 0.25, 3.5, 1.2]]],
    mass: [['kg', 'g', 1000, [2.4, 0.75, 3.6, 1.25, 0.08, 5.5, 0.065]], ['g', 'kg', 0.001, [750, 2500, 45, 1250, 380, 65, 5600]], ['t', 'kg', 1000, [0.6, 4.2, 2.75, 0.8, 1.05, 12.5]],
      ['kg', 't', 0.001, [3500, 12950, 800, 4600, 250, 5600]], ['mg', 'g', 0.001, [250, 1250, 750, 500, 80]], ['g', 'mg', 1000, [1.2, 0.5, 2.5, 0.75, 0.08]]] };
  var UNAME = { L: 'litres', mL: 'millilitres', 'cm³': 'cubic centimetres', 'm³': 'cubic metres', kg: 'kilograms', g: 'grams', t: 'tonnes', mg: 'milligrams' };
  function siPart(r, kind, o) {
    o = o || {};
    var k = r.pick(SI[kind]), x = pickX(r, k[3], o.not), f = k[2], ans = q(x * f), mul = f > 1, m3 = k[0] === 'm³' || k[1] === 'm³';
    var diag = [{ v: mul ? x * 100 : x / 100, code: 'u4t-si-100', hint: 'These units are <b>1000</b> apart: ' + (mul ? '× 1000' : '÷ 1000') + ' (move the decimal point 3 places).' },
      { v: mul ? x * 10 : x / 10, code: 'u4t-si-100', hint: 'Move the decimal point <b>3</b> places: ' + (mul ? '× 1000' : '÷ 1000') + '.' },
      { v: mul ? x / 1000 : x * 1000, code: 'u4t-si-way', hint: mul ? 'You are changing to a <b>smaller</b> unit, so you need more of them: multiply by 1000.' : 'You are changing to a <b>bigger</b> unit, so you need fewer of them: divide by 1000.' }];
    if (m3) diag.push({ v: mul ? x * 1e6 : x / 1e6, code: 'u4t-m3-cm3', hint: t('1\\text{ m}^3=1000\\text{ L}') + ' (1 000 000 is the number of cm³ in a m³).' });
    var rel = { 'L|mL': '1 L = 1000 mL', 'mL|L': '1 L = 1000 mL', 'cm³|L': '1 L = 1000 cm³', 'L|cm³': '1 L = 1000 cm³', 'm³|L': '1 m³ = 1000 L', 'L|m³': '1 m³ = 1000 L', 'kg|g': '1 kg = 1000 g', 'g|kg': '1 kg = 1000 g',
      't|kg': '1 t = 1000 kg', 'kg|t': '1 t = 1000 kg', 'mg|g': '1 g = 1000 mg', 'g|mg': '1 g = 1000 mg' }[k[0] + '|' + k[1]];
    return num('Change ' + U(x, k[0]) + ' to ' + UNAME[k[1]] + '.', ans, { dp: 6, noPlaces: true, word: 'the exact value', after: k[1], diag: diag,
      sol: br([rel + '. ' + (mul ? 'Bigger unit → smaller unit: multiply.' : 'Smaller unit → bigger unit: divide.'), t(N(x) + (mul ? '\\times ' : '\\div ') + '1000=' + N(ans) + uT(k[1]))]),
      hints: [rel + '.', mul ? 'To a smaller unit: multiply.' : 'To a bigger unit: divide.'], text: o.text || kind + ' ' + k[0] + ' to ' + k[1] });
  }
  /* ---- cubic units inside imperial ---- */
  function cubicImpPart(r, o) {
    o = o || {};
    var k = r.int(0, 3), big = k < 2 ? 'ft³' : 'yd³', small = k < 2 ? 'in³' : 'ft³', F3 = k < 2 ? 1728 : 27, F1 = k < 2 ? 12 : 3, F2 = k < 2 ? 144 : 9, toSmall = k % 2 === 0;
    var x, ans;
    if (toSmall) { x = k < 2 ? pickX(r, [1.5, 2, 2.5, 4, 0.75, 1.25, 5, 6], [3.5]) : pickX(r, [2, 3, 5, 6, 7, 2.5, 1.5, 8, 10], [4]); ans = x * F3; }
    else { ans = k < 2 ? pickX(r, [2, 4, 5, 6, 8, 1.5, 2.5, 10], [3, 7]) : pickX(r, [2, 4, 6, 7, 8, 1.5, 2.5, 12], [3, 5]); x = q(ans * F3); }
    var nm = { 'ft³': 'cubic feet', 'in³': 'cubic inches', 'yd³': 'cubic yards' }, lenRel = k < 2 ? '1 ft = 12 in' : '1 yd = 3 ft';
    return num('Change ' + U(x, toSmall ? big : small) + ' to ' + nm[toSmall ? small : big] + '.', ans, { dp: 2, after: toSmall ? small : big,
      diag: [{ v: toSmall ? x * F1 : x / F1, code: 'u4t-cube-len', hint: lenRel + ', but a cube has three edges: ' + t('1' + uT(big) + '=' + F1 + '\\times ' + F1 + '\\times ' + F1 + '=' + HW.fmt(String(F3)) + uT(small)) + '.' },
        { v: toSmall ? x * F2 : x / F2, code: 'u4t-cube-area', hint: 'That uses ' + F2 + ' (a square). A cube is ' + t(F1 + '\\times ' + F1 + '\\times ' + F1 + '=' + HW.fmt(String(F3))) + '.' },
        { v: toSmall ? x / F3 : x * F3, code: 'u4t-cube-way', hint: toSmall ? 'You need <b>more</b> of the smaller unit: multiply by ' + F3 + '.' : 'You need <b>fewer</b> of the bigger unit: divide by ' + F3 + '.' }],
      sol: br([t('1' + uT(big) + '=' + F1 + '\\times ' + F1 + '\\times ' + F1 + '=' + HW.fmt(String(F3)) + uT(small)), t(N(x) + (toSmall ? '\\times ' : '\\div ') + HW.fmt(String(F3)) + '=' + N(ans) + uT(toSmall ? small : big))]),
      hints: ['How many ' + nm[small] + ' are in one ' + nm[big].replace(/s$/, '').replace(/feet$/, 'foot') + '? Use the length three times.', toSmall ? 'Big unit → small unit: multiply.' : 'Small unit → big unit: divide.'], text: o.text || 'cubic ' + big + ' ' + small });
  }
  /* ---- US capacity units ---- */
  var USU = [['gallon', 'gallons', 'gal', 128], ['quart', 'quarts', 'qt', 32], ['pint', 'pints', 'pt', 16], ['cup', 'cups', 'cups', 8], ['fluid ounce', 'fluid ounces', 'fl oz', 1]];
  var BRIT = { gal: 160, qt: 40, pt: 20 };
  function usCapPart(r, o) {
    o = o || {};
    var s = find(function () { var i = r.int(0, 3), j = r.int(i + 1, 4); return [i, j]; }, function (s) { return USU[s[0]][3] / USU[s[1]][3] <= 32; });
    var B = USU[s[0]], S = USU[s[1]], f = B[3] / S[3], down = r.chance(0.6), x, ans;
    if (down) { x = r.pick([2, 3, 5, 6, 1.5, 2.5, 4, 7]); ans = x * f; } else { ans = r.pick([1.5, 2, 2.5, 3, 4, 5, 6, 0.5]); x = q(ans * f); }
    var from = down ? B : S, to = down ? S : B;
    var chain = USU.slice(s[0], s[1] + 1), steps = chain.slice(0, -1).map(function (u, i) { return '1 ' + u[2] + ' = ' + (u[3] / chain[i + 1][3]) + ' ' + chain[i + 1][2]; }).join(', ');
    var diag = [{ v: down ? x / f : x * f, code: 'u4t-cap-way', hint: down ? 'A ' + B[0] + ' is bigger than a ' + S[0] + ', so you need <b>more</b> ' + S[1] + ': multiply.' : 'A ' + B[0] + ' is bigger, so you need <b>fewer</b> ' + B[1] + ': divide.' }];
    if (s[1] - s[0] > 1) { var f1 = B[3] / USU[s[0] + 1][3]; diag.push({ v: down ? x * f1 : x / f1, code: 'u4t-chain-step', hint: 'Go all the way down the chain: ' + steps + '. That is ' + f + ' ' + S[1] + ' in a ' + B[0] + '.' }); }
    if (S[2] === 'fl oz' && BRIT[B[2]]) diag.push({ v: down ? x * BRIT[B[2]] : x / BRIT[B[2]], code: 'u4t-british', hint: 'That uses the British pint (20 fl oz). A <b>US</b> pint is 16 fl oz.' });
    return num('Change ' + t(N(x)) + ' US ' + (x === 1 ? from[0] : from[1]) + ' to ' + to[1] + '.', ans, { dp: 2, after: to[2], diag: diag,
      sol: br(['US units: ' + steps + '. So 1 ' + B[2] + ' = ' + f + ' ' + S[2] + '.', t(N(x) + (down ? '\\times ' : '\\div ') + f + '=' + N(ans)) + ' ' + to[1]]),
      hints: ['1 gal = 4 qt, 1 qt = 2 pt, 1 pt = 2 cups, 1 cup = 8 fl oz.', down ? 'Bigger unit → smaller unit: multiply.' : 'Smaller unit → bigger unit: divide.'], text: o.text || 'US ' + from[2] + ' to ' + to[2] });
  }
  /* ---- temperature ---- */
  function cToFPart(r, o) {
    o = o || {};
    var C = pickX(r, o.list || [-30, -25, -20, -10, -5, 5, 15, 22, 18, 12, -12, -18, 35, 40, 160, 180, 200, 220, 8, -8, 28], [25, -15]), F = q(1.8 * C + 32);
    var diag = [{ v: 1.8 * C, code: 'u4t-no-32', hint: 'You multiplied by 1.8. Now add 32: ' + t('F=1.8\\times C+32') + '.' }, { v: (C + 32) * 1.8, code: 'u4t-order', hint: 'Multiply by 1.8 <b>first</b>, then add 32.' },
      { v: (C - 32) / 1.8, code: 'u4t-formula', hint: 'That is the °F → °C formula. To change °C to °F: ' + t('F=1.8\\times C+32') + '.' }, { v: 2 * C + 30, code: 'u4t-estimate', hint: 'That is the quick estimate. The exact formula is ' + t('F=1.8\\times C+32') + '.' }];
    if (F < 0) diag.push({ v: -F, code: 'u4t-neg', hint: 'The answer is below zero: keep the negative sign.' });
    if (C < 0) diag.push({ v: 1.8 * -C + 32, code: 'u4t-neg', hint: t(N(C)) + ' is below zero: use the negative key, ' + t('1.8\\times(' + N(C) + ')=' + N(1.8 * C)) + '.' });
    return num((o.ctx ? o.ctx(C) : 'Change ' + t(N(C) + uT('°C')) + ' to degrees Fahrenheit.') + ' (Round to the nearest tenth if needed.)', F, { dp: 1, after: '°F', diag: diag,
      sol: t('F=1.8\\times ' + par(C) + '+32=' + N(q(1.8 * C)) + '+32=' + N(F) + uT('°F')), hints: ['F = 1.8 × C + 32.', 'Multiply first, then add 32.'], text: o.text || 'C to F' });
  }
  function fToCPart(r, o) {
    o = o || {};
    var F = pickX(r, o.list || [14, 23, 41, 59, 68, 77, 86, 95, -4, -22, 0, 5, 20, 45, 72, 80, 100, 325, 350, 375, 400, 425, 102, 99, 62, 48], [98.6, 54, 450, 38, 104]), C = (F - 32) / 1.8;
    var diag = [{ v: F - 32 / 1.8, code: 'u4t-brackets', hint: 'Subtract 32 <b>first</b>: use brackets, ' + t('(' + N(F) + '-32)\\div 1.8') + '.' }, { v: F - 32, code: 'u4t-no-18', hint: 'You subtracted 32. Now divide by 1.8.' },
      { v: F / 1.8, code: 'u4t-no-32', hint: 'Subtract 32 before you divide: ' + t('C=(F-32)\\div 1.8') + '.' }, { v: 1.8 * F + 32, code: 'u4t-formula', hint: 'That is the °C → °F formula. To change °F to °C: ' + t('C=(F-32)\\div 1.8') + '.' },
      { v: (F - 32) * 1.8, code: 'u4t-times18', hint: 'Divide by 1.8 (the Celsius degrees are bigger, so there are fewer of them).' }, { v: (F - 30) / 2, code: 'u4t-estimate', hint: 'That is the quick estimate. The exact formula is ' + t('C=(F-32)\\div 1.8') + '.' },
      { v: (F + 32) / 1.8, code: 'u4t-plus32', hint: 'Subtract 32 (do not add it): ' + t('C=(F-32)\\div 1.8') + '.' }];
    if (C < 0) diag.push({ v: -C, code: 'u4t-neg', hint: t(N(F) + uT('°F')) + ' is below freezing, so the answer is below zero: keep the negative sign.' });
    return num((o.ctx ? o.ctx(F) : 'Change ' + t(N(F) + uT('°F')) + ' to degrees Celsius.') + ' Round to the nearest tenth of a degree.', C, { dp: 1, after: '°C', diag: diag,
      sol: t('C=(' + N(F) + '-32)\\div 1.8=' + N(F - 32) + '\\div 1.8' + toN(C, 1) + uT('°C')), hints: ['C = (F − 32) ÷ 1.8.', 'Use brackets so the calculator subtracts first.'], text: o.text || 'F to C' });
  }
  function estMCPart(r) {
    if (r.chance(0.5)) {
      var C = pickX(r, [10, 15, 25, 30, -10, 5, -5, 35, 40, 12, 18], [20]), e = 2 * C + 30;
      var opts = [{ v: e, right: true }, { v: C + 32, why: 'Double first, then add 30: ' + t('2\\times ' + par(C) + '+30') + '.' }, { v: 2 * C, why: 'After doubling, add 30.' }, { v: Math.round((C - 30) / 2), why: 'That rule goes from °F to °C. From °C to °F: double, then add 30.' }];
      var seen = {}; opts = opts.filter(function (x) { if (seen[x.v]) return false; seen[x.v] = 1; return true; }); while (opts.length < 4) { var z = e + 10 * opts.length + 5; if (!seen[z]) { seen[z] = 1; opts.push({ v: z, why: 'Double, then add 30.' }); } }
      return numMC(r, 'A friend in Toronto says it is ' + t(N(C) + uT('°C')) + '. Use the quick estimate (no calculator). About what is that in °F?', opts, function (v) { return 'about ' + t(N(v) + uT('°F')); },
        br(['Quick estimate: ' + t('F\\approx 2\\times C+30=2\\times ' + par(C) + '+30=' + N(e)) + ' °F.', '(Exact: ' + t('1.8\\times ' + par(C) + '+32=' + N(q(1.8 * C + 32))) + ' °F.)']), ['Quick estimate: double, then add 30.'], 'quick estimate C to F');
    }
    var F = pickX(r, [50, 60, 80, 90, 40, 100, 110, 20, 10, 120], [86, 70]), ec = (F - 30) / 2;
    var o2 = [{ v: ec, right: true }, { v: F - 30, why: 'After subtracting 30, halve it.' }, { v: F / 2, why: 'Subtract 30 first, then halve.' }, { v: 2 * F + 30, why: 'That rule goes from °C to °F. From °F to °C: subtract 30, then halve.' }];
    var sn = {}; o2 = o2.filter(function (x) { if (sn[x.v]) return false; sn[x.v] = 1; return true; }); while (o2.length < 4) { var z2 = ec + 7 * o2.length; if (!sn[z2]) { sn[z2] = 1; o2.push({ v: z2, why: 'Subtract 30, then halve.' }); } }
    return numMC(r, 'A US weather app shows ' + t(N(F) + uT('°F')) + '. Use the quick estimate (no calculator). About what is that in °C?', o2, function (v) { return 'about ' + t(N(v) + uT('°C')); },
      br(['Quick estimate: ' + t('C\\approx (F-30)\\div 2=(' + N(F) + '-30)\\div 2=' + N(ec)) + ' °C.', '(Exact: ' + t('(' + N(F) + '-32)\\div 1.8') + ' ≈ ' + t(fx((F - 32) / 1.8, 1)) + ' °C.)']), ['Quick estimate: subtract 30, then halve.'], 'quick estimate F to C');
  }
  /* ---- mass with a conversion fact ---- */
  function factPart(r, o) {
    o = o || {};
    var k = r.int(0, 3), x, ans, alt, fact, from, to, diag, sol, ctx;
    if (k === 0) { x = pickX(r, [12, 18, 30, 45, 48, 64, 75, 110, 140, 8.5, 37, 160], [25, 53]); ans = x * 0.454; alt = x / 2.2; fact = '1 lb ≈ 0.454 kg'; from = 'lb'; to = 'kg';
      ctx = r.pick(['A suitcase weighs ' + U(x, 'lb') + ' on a bathroom scale.', 'A bag of dog food is ' + U(x, 'lb') + '.', 'Jacob weighs ' + U(x, 'lb') + '.']);
      diag = [{ v: x * 2.2, code: 'u4t-fact-way', hint: 'A pound is <b>smaller</b> than a kilogram, so the number of kg is smaller: ' + t(N(x) + '\\times 0.454') + '.' }, { v: x / 0.454, code: 'u4t-fact-way', hint: 'Multiply by 0.454: the unit you want (kg) goes on top of the unit factor.' }];
      sol = t(N(x) + '\\text{ lb}\\times\\dfrac{0.454\\text{ kg}}{1\\text{ lb}}' + toN(ans, 1) + '\\text{ kg}'); }
    else if (k === 1) { x = pickX(r, [3.5, 9, 14, 23, 32, 46, 75, 4.2, 18, 27], [68]); ans = x * 2.2; alt = x / 0.454; fact = '1 kg ≈ 2.2 lb'; from = 'kg'; to = 'lb';
      ctx = r.pick(['An airline allows a checked bag of ' + U(x, 'kg') + '.', 'A bag of potting soil is ' + U(x, 'kg') + '.', 'A dumbbell set is ' + U(x, 'kg') + '.']);
      diag = [{ v: x / 2.2, code: 'u4t-fact-way', hint: 'A kilogram is <b>bigger</b> than a pound, so you need more pounds: ' + t(N(x) + '\\times 2.2') + '.' }, { v: x * 0.454, code: 'u4t-fact-way', hint: 'You are changing kg to lb: multiply by 2.2.' }];
      sol = t(N(x) + '\\text{ kg}\\times\\dfrac{2.2\\text{ lb}}{1\\text{ kg}}' + toN(ans, 1) + '\\text{ lb}'); }
    else if (k === 2) { x = pickX(r, [4, 6, 8, 10, 14, 16, 5.5, 3.5, 7], [12]); ans = x * 28.35; fact = '1 oz ≈ 28.35 g'; from = 'oz'; to = 'g';
      ctx = r.pick(['A steak is ' + U(x, 'oz') + '.', 'A bag of chips is labelled ' + U(x, 'oz') + '.', 'A block of cheese is ' + U(x, 'oz') + '.']);
      diag = [{ v: x * 30, code: 'u4t-est-30', hint: '30 g is only the quick estimate. Use ' + t('1\\text{ oz}\\approx 28.35\\text{ g}') + '.' }, { v: x / 28.35, code: 'u4t-fact-way', hint: 'A gram is tiny, so the number of grams is much <b>bigger</b>: multiply.' }];
      sol = t(N(x) + '\\times 28.35' + toN(ans, 1) + '\\text{ g}'); }
    else { x = pickX(r, [200, 250, 350, 454, 750, 1000, 125, 300, 600], [500]); ans = x / 28.35; fact = '1 oz ≈ 28.35 g'; from = 'g'; to = 'oz';
      ctx = r.pick(['A jar of peanut butter holds ' + U(x, 'g') + '.', 'A bag of coffee is ' + U(x, 'g') + '.', 'A box of crackers is ' + U(x, 'g') + '.']);
      diag = [{ v: x * 28.35, code: 'u4t-fact-way', hint: 'An ounce is much <b>bigger</b> than a gram, so the number of ounces is smaller: divide.' }, { v: x / 30, code: 'u4t-est-30', hint: '30 g is only the quick estimate. Divide by 28.35.' }];
      sol = t(N(x) + '\\times\\dfrac{1\\text{ oz}}{28.35\\text{ g}}=' + N(x) + '\\div 28.35' + toN(ans, 1) + '\\text{ oz}'); }
    return num(ctx + ' What is that in ' + ({ kg: 'kilograms', lb: 'pounds', g: 'grams', oz: 'ounces' })[to] + ', to the nearest tenth? (Use ' + fact + '.)', ans, { dp: 1, after: to, alts: alt != null ? [alt] : [], diag: diag,
      sol: sol, hints: ['Use the unit factor with ' + to + ' on top and ' + from + ' on the bottom.', 'Check: should the number get bigger or smaller?'], text: o.text || 'mass ' + from + ' to ' + to });
  }
  /* ---- bushels and tonnes ---- */
  function cropPick(r, list) { var c = r.pick(list || ['wheat', 'canola', 'barley', 'oats', 'flax', 'field peas']); return { c: c, f: CROPS[c] }; }
  function buTPart(r, o) {
    o = o || {};
    var cr = cropPick(r), f = cr.f, toBu = r.chance(0.5), town = r.pick(TOWNS), x, ans;
    if (toBu) { x = find(function () { return pickR(r, [5, 40, 0.5]); }, function (x) { var b = x * f; return Math.abs(frac(b) - 0.5) > 0.05 && !(x === 12 && f === 36.7); }); ans = x * f; }
    else { x = find(function () { return pickR(r, [300, 3000, 10]); }, function (x) { return !(x === 850 && f === 44.1); }); ans = x / f; }
    return num(toBu ? 'A farm near ' + town + ' has ' + U(x, 't') + ' of ' + cr.c + ' in its bins. For ' + cr.c + ', use ' + t(N(f)) + ' bu/t. How many bushels is that, to the nearest bushel?'
      : 'A farm near ' + town + ' harvests ' + t(N(x)) + ' bushels of ' + cr.c + '. For ' + cr.c + ', use ' + t(N(f)) + ' bu/t. How many tonnes is that, to two decimals?', ans, { dp: toBu ? 0 : 2, after: toBu ? 'bu' : 't',
      diag: [{ v: toBu ? x / f : x * f, code: 'u4t-bu-way', hint: toBu ? 'A tonne is many bushels, so the number of bushels is <b>bigger</b>: multiply by ' + N(f) + '.' : 'A tonne is many bushels, so the number of tonnes is <b>smaller</b>: divide by ' + N(f) + '.' },
        { v: f / x, code: 'u4t-bu-flip', hint: 'Divide the bushels by the factor: ' + t(N(x) + '\\div ' + N(f)) + '.' }],
      sol: toBu ? t(N(x) + '\\text{ t}\\times\\dfrac{' + N(f) + '\\text{ bu}}{1\\text{ t}}' + toN(ans, 0) + '\\text{ bu}') : t(N(x) + '\\text{ bu}\\div ' + N(f) + toN(ans, 2) + '\\text{ t}'),
      hints: ['The factor is the number of bushels in 1 tonne.', toBu ? 'Tonnes → bushels: multiply.' : 'Bushels → tonnes: divide.'], text: o.text || (toBu ? 't to bu' : 'bu to t') });
  }
  /* ---- triangular prism (SI) ---- */
  var PRISMS = [{ s: function (b, h, l) { return 'A camping tent is shaped like a triangular prism. The triangle at the front is ' + U(b, 'm') + ' wide at the bottom and ' + U(h, 'm') + ' high, and the tent is ' + U(l, 'm') + ' long. What is the volume of air inside the tent?'; }, u: 'm', b: [1.6, 2.6, 0.1], h: [1, 1.6, 0.1], l: [1.8, 3, 0.1] },
    { s: function (b, h, l) { return 'A chocolate bar comes in a box shaped like a triangular prism. Each triangle end has a base of ' + U(b, 'cm') + ' and a height of ' + U(h, 'cm') + '. The box is ' + U(l, 'cm') + ' long. What is the volume of the box?'; }, u: 'cm', b: [3, 7, 0.5], h: [2.5, 6, 0.5], l: [12, 25, 1] },
    { s: function (b, h, l) { return 'A concrete wheelchair ramp is a triangular prism lying on its side. The triangle at the side is ' + U(b, 'm') + ' along the ground and ' + U(h, 'm') + ' high. The ramp is ' + U(l, 'm') + ' wide. How much concrete is in the ramp?'; }, u: 'm', b: [2.4, 4.8, 0.2], h: [0.2, 0.5, 0.05], l: [1, 1.5, 0.1] },
    { s: function (b, h, l) { return 'The attic of a shed is a triangular prism. The triangle at each end is ' + U(b, 'm') + ' wide and ' + U(h, 'm') + ' high, and the shed is ' + U(l, 'm') + ' long. What is the volume of the attic?'; }, u: 'm', b: [2.4, 3.6, 0.2], h: [0.8, 1.4, 0.1], l: [2.4, 4.2, 0.2] }];
  function prismPart(r, o) {
    o = o || {};
    var c = r.pick(PRISMS), v = find(function () { return [pickR(r, c.b), pickR(r, c.h), pickR(r, c.l)]; }, function (v) { return !(v[0] === 6 && v[1] === 4) && !(v[0] === 2.4 && v[1] === 1.5); });
    var b = v[0], h = v[1], l = v[2], Ab = b * h / 2, V = Ab * l, u = c.u;
    return num(c.s(b, h, l) + ' (Round to the nearest hundredth if needed.)', V, { dp: 2, after: u + '³',
      diag: [{ v: b * h * l, code: 'u4t-no-half', hint: 'The area of a triangle is ' + t('\\tfrac{1}{2}bh') + ': you found the volume of a box.' }, { v: Ab, code: 'u4t-area-only', hint: 'That’s the area of the triangle. Multiply by the length of the prism.' },
        { v: (b + h) * l, code: 'u4t-add-lengths', hint: 'Find the triangle’s area first: ' + t('\\tfrac{1}{2}\\times ' + N(b) + '\\times ' + N(h)) + '.' }],
      sol: br(['Area of the base (triangle): ' + t('\\tfrac{1}{2}\\times ' + N(b) + '\\times ' + N(h) + '=' + N(q(Ab)) + uT(u + '²')), t('V=' + N(q(Ab)) + '\\times ' + N(l) + toN(V, 2) + uT(u + '³'))]),
      hints: ['V = (area of base) × length of the prism.', 'The base is the triangle: ½ × base × height.'], text: o.text || 'triangular prism' });
  }
  /* ---- a cylinder's capacity in litres ---- */
  var CYLCAP = [{ n: 'A rain barrel', u: 'cm', d: [50, 70, 2], h: [80, 100, 2] }, { n: 'A paint can', u: 'cm', d: [15, 18, 0.5], h: [17, 21, 0.5] }, { n: 'A stock pot', u: 'cm', d: [24, 34, 1], h: [18, 30, 1] },
    { n: 'A water tank', u: 'm', d: [0.8, 1.6, 0.1], h: [1, 2, 0.1] }];
  function cylCapPart(r, o) {
    o = o || {};
    var c = r.pick(CYLCAP), v = find(function () { return [pickR(r, c.d), pickR(r, c.h)]; }, function (v) { return !(v[0] === 60 && v[1] === 90) && !(v[0] === 1.2 && v[1] === 1.5); });
    var d = v[0], h = v[1], r0 = d / 2, V = PI * r0 * r0 * h, cm = c.u === 'cm', Lt = cm ? V / 1000 : V * 1000, dp = cm ? 1 : 0;
    return num(c.n + ' is a cylinder ' + U(d, c.u) + ' across (diameter) and ' + U(h, c.u) + ' tall. How many litres does it hold, to the nearest ' + (cm ? 'tenth of a litre' : 'litre') + '?', Lt, { dp: dp, after: 'L',
      diag: [{ v: V, code: 'u4t-no-1000', hint: cm ? 'That’s the volume in cm³. ' + t('1\\text{ L}=1000\\text{ cm}^3') + ': divide by 1000.' : 'That’s the volume in m³. ' + t('1\\text{ m}^3=1000\\text{ L}') + ': multiply by 1000.' },
        { v: cm ? V / 100 : V * 100, code: 'u4t-si-100', hint: cm ? '1 L = 1000 cm³: divide by <b>1000</b>.' : '1 m³ = 1000 L: multiply by <b>1000</b>.' }, cm ? null : { v: V * 1e6, code: 'u4t-m3-cm3', hint: '1 m³ = 1000 L (1 000 000 is the cm³ in a m³).' },
        { v: (cm ? PI * d * d * h / 1000 : PI * d * d * h * 1000), code: 'u4t-diam', hint: 'Use the <b>radius</b>: ' + t('r=' + N(d) + '\\div 2=' + N(r0)) + '.' }, { v: (cm ? PI * 2 * r0 * h / 1000 : PI * 2 * r0 * h * 1000), code: 'u4t-r-times-2', hint: t('r^2=r\\times r') + ', not ' + t('r\\times 2') + '.' }].filter(Boolean),
      sol: br(cylLines(r0, h, c.u, V, cm ? 1 : 4, 'd').concat([cm ? t(N(rd(V, 1)) + '\\text{ cm}^3\\div 1000' + toN(Lt, 1) + '\\text{ L}') : t(N(rd(V, 4)) + '\\text{ m}^3\\times 1000' + toN(Lt, 0) + '\\text{ L}')])),
      hints: ['Find the volume with V = π r² h (use the radius).', cm ? '1 L = 1000 cm³.' : '1 m³ = 1000 L.'], text: o.text || 'cylinder litres ' + c.u });
  }
  /* ---- a concrete slab in feet and inches ---- */
  var SLABS = ['a concrete patio', 'a concrete pad for a shed', 'a concrete garage floor', 'a concrete pad for a hot tub', 'a concrete sidewalk'];
  function slabShared(r) {
    return find(function () {
      var what = r.pick(SLABS), side = what === 'a concrete sidewalk', L = side ? pickR(r, [24, 40, 2]) : pickR(r, [8, 20, 1]), W = side ? pickR(r, [3, 5, 1]) : pickR(r, [6, 14, 1]), th = r.pick([3, 4, 5, 6]);
      if (what === 'a concrete garage floor') { L = pickR(r, [20, 24, 1]); W = pickR(r, [18, 22, 1]); th = r.pick([4, 5, 6]); }
      var V = L * W * th / 12, yd = V / 27, ord = Math.ceil(yd * 2 - 1e-9) / 2, pr = q(r.int(199, 249) + r.pick([0, 0, 0.5]));
      return { what: what, L: L, W: W, th: th, V: V, yd: yd, ord: ord, pr: pr, p: person(r) };
    }, function (s) { var z = s.yd * 2; return s.L >= s.W && frac(z) > 0.08 && frac(z) < 0.92 && !(s.L === 12 && s.W === 10 && s.th === 4) && !(s.L === 10 && s.W === 12); });
  }
  function slabStem(s) { return s.p.n + ' is pouring ' + s.what + ' ' + t(N(s.L) + '\\text{ ft}') + ' long and ' + t(N(s.W) + '\\text{ ft}') + ' wide. The slab will be ' + t(s.th + '\\text{ in}') + ' thick. Concrete is sold in half cubic yards (1, 1.5, 2, …) and costs ' + MM(s.pr) + ' per yd³. (' + t('1\\text{ yd}^3=27\\text{ ft}^3') + ')'; }
  function slabVolPart(r, s) {
    return num('Find the volume of the slab in cubic feet, to the nearest hundredth.', s.V, { dp: 2, after: 'ft³',
      diag: [{ v: s.L * s.W * s.th, code: 'u4t-in-ft', hint: 'Change the thickness to feet first: ' + t(s.th + '\\text{ in}=' + s.th + '\\div 12\\text{ ft}') + '.' }, { v: s.L * s.W * s.th / 10, code: 'u4t-in-10', hint: 'There are <b>12</b> inches in a foot: ' + t(s.th + '\\div 12') + '.' },
        { v: s.yd, code: 'u4t-gave-yd', hint: 'That’s in cubic yards. The question asks for cubic feet first.' }, { v: s.L * s.W, code: 'u4t-area-only', hint: 'That’s the area. Multiply by the thickness (in feet).' }],
      sol: br([t(s.th + '\\text{ in}=' + s.th + '\\div 12\\text{ ft}'), t('V=' + N(s.L) + '\\times ' + N(s.W) + '\\times ' + s.th + '\\div 12' + toN(s.V, 2) + '\\text{ ft}^3')]),
      hints: ['Write every length in feet: inches ÷ 12.', 'V = l × w × h.'], text: 'slab volume ft³' });
  }
  function slabOrderPart(r, s) {
    var half = Math.round(s.yd * 2) / 2, whole = Math.ceil(s.yd - 1e-9);
    var specs = [fld('Order:', s.ord, { dp: 1, after: 'yd³', name: 'Order', diag: [{ v: half, code: 'u4t-order-down', hint: 'Always round an order <b>up</b>, or the job comes up short.' }, { v: whole, code: 'u4t-whole-yd', hint: 'The plant sells half cubic yards: round up to the next <b>half</b> yard.' },
        { v: rd(s.yd, 2), code: 'u4t-exact-order', hint: 'Concrete is sold in half cubic yards: round up to the next half yard.' }, { v: Math.ceil(s.V / 9 * 2 - 1e-9) / 2, code: 'u4t-cube-area', hint: t('1\\text{ yd}^3=3\\times 3\\times 3=27\\text{ ft}^3') + '.' }] }),
      fld('Cost:', s.ord * s.pr, { money: true, name: 'Cost', diag: [{ v: s.yd * s.pr, code: 'u4t-exact-order', hint: 'Pay for the amount you order (rounded up), not the exact volume.' }, { v: whole * s.pr, code: 'u4t-whole-yd', hint: 'Use the half-yard order.' },
        { v: s.V * s.pr, code: 'u4t-per-ft', hint: 'The price is per cubic <b>yard</b>: use the order in yd³.' }] })];
    return fieldsPart('Change the volume to cubic yards. How much concrete should be ordered, and what will it cost (before tax)?', specs,
      br([t(N(rd(s.V, 4)) + '\\div 27' + toN(s.yd, 2) + '\\text{ yd}^3'), 'Round <b>up</b> to the next half yard: order ' + t(N(s.ord) + '\\text{ yd}^3') + '.', 'Cost: ' + t(N(s.ord) + '\\times ' + Mt(s.pr) + '=' + Mt(s.ord * s.pr))]),
      ['ft³ ÷ 27 = yd³.', 'Round up to an amount you can buy, then multiply by the price.'], 'slab order and cost');
  }
  /* ---- filling a tank at a price per US gallon ---- */
  function fillGasPart(r, o) {
    o = o || {};
    var T = pickX(r, [45, 48, 55, 58, 60, 64, 68, 72, 75, 80, 85, 90, 95, 98], [52]), p = find(function () { return pickR(r, [3.09, 3.89, 0.01]); }, function (x) { return x !== 3.29; }), pl = r.pick(['Montana', 'Idaho', 'North Dakota', 'Washington']), ps = person(r);
    var g = T / 3.785, C = g * p;
    return num(ps.n + '’s ' + r.pick(['car', 'pickup', 'SUV', 'van']) + ' has a ' + U(T, 'L') + ' gas tank. In ' + pl + ', gas costs ' + MM(p) + ' USD per US gallon. How much will it cost to fill the empty tank, in US dollars? (' + t('1\\text{ US gal}\\approx 3.785\\text{ L}') + ')', C, { money: true, after: 'USD', unit: 'USD',
      alts: [r2(g) * p, rd(g, 1) * p], diag: [{ v: T * 3.785 * p, code: 'u4t-gal-way', hint: 'A gallon is <b>bigger</b> than a litre, so there are fewer gallons than litres: divide by 3.785.' }, { v: T * p, code: 'u4t-no-conv', hint: 'The price is per <b>gallon</b>, but the tank is in litres. Change the litres to US gallons first.' },
        { v: T / 4.546 * p, code: 'u4t-british', hint: 'US gas pumps use the <b>US</b> gallon (3.785 L), not the British gallon.' }, { v: g, code: 'u4t-gave-gal', hint: 'That’s the number of US gallons. Multiply by the price per gallon.' }],
      sol: br(['US gallons: ' + t(N(T) + '\\div 3.785' + toN(g, 2)), 'Cost: ' + t(fx(g, 2) + '\\times ' + Mt(p) + toM(r2(g) * p)) + ' USD']), hints: ['Change the litres to US gallons (÷ 3.785).', 'Then multiply by the price per gallon.'], text: o.text || 'fill a tank in US gallons' });
  }
  /* ---- a temperature change on the other scale ---- */
  function changePart(r, o) {
    o = o || {};
    if (r.chance(0.55)) {
      var a = -r.int(5, 28), b = r.int(2, 16), dC = b - a, dF = 1.8 * dC;
      if (a === -21 && b === 7) b = 9, dC = b - a, dF = 1.8 * dC;
      return num('A chinook blows into ' + r.pick(['Calgary', 'Pincher Creek', 'Lethbridge', 'Medicine Hat']) + '. In the morning it is ' + t(N(a) + uT('°C')) + '. By the afternoon it is ' + t(N(b) + uT('°C')) + '. By how many <b>Fahrenheit</b> degrees did the temperature rise?', dF, { dp: 1, after: 'Fahrenheit degrees',
        diag: [{ v: dC, code: 'u4t-change-c', hint: 'That’s the rise in Celsius degrees. Each Celsius degree is 1.8 Fahrenheit degrees.' }, { v: dF + 32, code: 'u4t-change-32', hint: 'A <b>change</b> does not use the 32: only multiply by 1.8.' },
          { v: 1.8 * Math.abs(b + a), code: 'u4t-change-sign', hint: 'From ' + t(N(a)) + ' up to ' + t(N(b)) + ': count up to 0, then past it: ' + t(N(-a) + '+' + N(b) + '=' + N(dC)) + '.' }, { v: dC / 1.8, code: 'u4t-change-way', hint: 'A Fahrenheit degree is smaller, so there are <b>more</b> of them: multiply by 1.8.' }],
        sol: br(['Rise in °C: ' + t(N(b) + '-(' + N(a) + ')=' + N(b) + '+' + N(-a) + '=' + N(dC)) + ' Celsius degrees', 'In °F: ' + t('1.8\\times ' + N(dC) + '=' + N(q(dF))) + ' Fahrenheit degrees (no + 32: this is a change).']),
        hints: ['Find the rise in Celsius degrees first.', 'A change of 1 C° is a change of 1.8 F°. Do not add 32 to a change.'], text: o.text || 'change C to F' });
    }
    var fa = r.int(-10, 30), fb = r.int(42, 78), d = fb - fa, dc = d / 1.8;
    return num('A forecast for ' + r.pick(['Great Falls, Montana', 'Fargo, North Dakota', 'Billings, Montana', 'Spokane, Washington']) + ' says the temperature will rise from ' + t(N(fa) + uT('°F')) + ' in the morning to ' + t(N(fb) + uT('°F')) + ' in the afternoon. By how many <b>Celsius</b> degrees will it rise? Round to the nearest tenth.', dc, { dp: 1, after: 'Celsius degrees',
      diag: [{ v: d, code: 'u4t-change-c', hint: 'That’s the rise in Fahrenheit degrees. Divide by 1.8 to get Celsius degrees.' }, { v: (d - 32) / 1.8, code: 'u4t-change-32', hint: 'A <b>change</b> does not use the 32: only divide by 1.8.' }, { v: d * 1.8, code: 'u4t-change-way', hint: 'A Celsius degree is bigger, so there are <b>fewer</b> of them: divide by 1.8.' },
        fa < 0 ? { v: (fb + fa) / 1.8, code: 'u4t-change-sign', hint: 'From ' + t(N(fa)) + ' up to ' + t(N(fb)) + ' is ' + t(N(fb) + '+' + N(-fa) + '=' + N(d)) + ' degrees.' } : null].filter(Boolean),
      sol: br(['Rise in °F: ' + t(N(fb) + '-' + par(fa) + '=' + N(d)) + ' Fahrenheit degrees', 'In °C: ' + t(N(d) + '\\div 1.8' + toN(dc, 1)) + ' Celsius degrees (no − 32: this is a change).']),
      hints: ['Find the rise in Fahrenheit degrees first.', 'Change in °C = change in °F ÷ 1.8 (no 32).'], text: o.text || 'change F to C' });
  }
  /* ---- adding and subtracting pounds and ounces ---- */
  var PACK = [['a tent', 'a sleeping bag', 'a stove kit'], ['a roast', 'a second roast', 'a third roast'], ['a bag of flour', 'a bag of sugar', 'a bag of rice'], ['a laptop', 'a charger and cables', 'a binder of notes']];
  function lbOzArithPart(r, o) {
    o = o || {};
    if (r.chance(0.5)) {
      var its = r.pick(PACK), s = find(function () { return [0, 1, 2].map(function () { return [r.int(1, 5), r.int(3, 15)]; }); }, function (s) { var oz = s[0][1] + s[1][1] + s[2][1]; return oz >= 18 && oz % 16 !== 0 && oz % 10 !== 0; });
      var Ls = s[0][0] + s[1][0] + s[2][0], Os = s[0][1] + s[1][1] + s[2][1], tot = Ls * 16 + Os;
      var who = person(r), what = its[0] === 'a tent' ? 'packs for a hike: ' : its[0] === 'a roast' ? 'is a butcher. She cuts three roasts: ' : its[0] === 'a laptop' ? 'packs a school bag: ' : 'buys groceries: ';
      if (its[0] === 'a roast') who = { n: r.pick(['Rosa', 'Aisha', 'Maya']), he: 'she' };
      return lbozPart(who.n + ' ' + what + its.map(function (it, i) { return it + ' of ' + t(loT(s[i][0], s[i][1])); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. What is the total, in pounds and ounces?', tot, {
        diag: [{ lb: Ls + Math.floor(Os / 10), oz: Os % 10, code: 'u4t-trade-10', hint: 'There are <b>16</b> oz in a pound, not 10: trade 16 oz for 1 lb.' }],
        sol: br(['Pounds: ' + t(s.map(function (x) { return x[0]; }).join('+') + '=' + Ls) + ' lb', 'Ounces: ' + t(s.map(function (x) { return x[1]; }).join('+') + '=' + Os) + ' oz' + (Os >= 16 ? ' = ' + lo(Os) : ''), 'Total: ' + lo(tot)]),
        hints: ['Add the pounds, then add the ounces.', 'Trade every 16 oz for 1 lb.'], text: o.text || 'add lb oz' });
    }
    var v = find(function () { var a = r.int(7, 15), ao = r.int(0, 9), b = r.int(2, a - 2), bo = r.int(ao + 2, 15); return [a, ao, b, bo]; }, function (v) { return v[3] > v[1]; });
    var a1 = v[0], o1 = v[1], b1 = v[2], o2 = v[3], tot2 = (a1 * 16 + o1) - (b1 * 16 + o2);
    var c = r.pick([['A puppy named ' + r.pick(['Bear', 'Moose', 'Scout', 'Juno']) + ' weighed ', ' at 8 weeks old. At 12 weeks he weighed ', '. How much did he gain?', true], ['Baby ' + r.pick(['Amira', 'Leo', 'Nia', 'Owen']) + ' weighed ', ' at birth and ', ' at two months. How much weight was gained?', true],
      ['A butcher has ', ' of ground beef. She sells ', '. How much is left?', false]]);
    var first = c[3] ? [b1, o2] : [a1, o1], second = c[3] ? [a1, o1] : [b1, o2];
    return lbozPart(c[0] + t(loT(first[0], first[1])) + c[1] + t(loT(second[0], second[1])) + c[2] + ' Give the answer in pounds and ounces.', tot2, {
      diag: [{ lb: a1 - 1 - b1, oz: o1 + 10 - o2, code: 'u4t-borrow-10', hint: 'When you borrow 1 lb, it becomes <b>16</b> oz, not 10.' }, { lb: a1 - b1, oz: o2 - o1, code: 'u4t-no-borrow', hint: t(o1 + '\\text{ oz}') + ' is less than ' + t(o2 + '\\text{ oz}') + ': borrow 1 lb (16 oz) first.' }],
      sol: br([t(o1 + '\\text{ oz}') + ' is less than ' + t(o2 + '\\text{ oz}') + ', so borrow 1 lb: ' + t(loT(a1, o1) + '=' + loT(a1 - 1, o1 + 16)), t(loT(a1 - 1, o1 + 16) + '-' + loT(b1, o2) + '=' + loT(a1 - 1 - b1, o1 + 16 - o2))]),
      hints: ['Subtract the bigger mass minus the smaller one.', 'Not enough ounces? Borrow 1 lb and turn it into 16 oz.'], text: o.text || 'subtract lb oz' });
  }
  /* ---- $/lb against $/kg ---- */
  var MEATS = [['Ground beef', [4.49, 6.99]], ['Chicken thighs', [3.49, 5.29]], ['Pork chops', [3.29, 5.49]], ['Strip loin steak', [8.99, 12.99]], ['Salmon fillets', [7.99, 11.49]], ['Cheddar cheese', [5.49, 8.99]]];
  function priceCmpPart(r, o) {
    o = o || {};
    var m = r.pick(MEATS), s = find(function () { var a = pickR(r, [m[1][0], m[1][1], 0.1]) - 0.01, b = q(r2(a * 2.2) + (r.chance(0.5) ? 1 : -1) * r.int(15, 120) / 100); return [q(a), b]; },
      function (s) { var k1 = s[0] * 2.2 - s[1], k2 = s[0] / 0.454 - s[1]; return Math.abs(k1) >= 0.15 && k1 * k2 > 0 && Math.abs(k2) >= 0.1; });
    var a = s[0], b = s[1], aKg = a * 2.2, Acheap = aKg < b, diff = Math.abs(r2(aKg) - b);
    return whichAmtPart(m[0] + ' costs ' + MM(a) + '/lb at Store A and ' + MM(b) + '/kg at Store B. Which store has the better price, and by how much per kilogram? (Use ' + t('1\\text{ kg}\\approx 2.2\\text{ lb}') + '.)', { amt: diff,
      alts: [Math.abs(aKg - b), Math.abs(a / 0.454 - b), Math.abs(r2(a / 0.454) - b)], whichLabel: 'Better price (A or B):', amtLabel: 'By how much per kg:', ph: 'A or B', right: [Acheap ? 'a' : 'b'], wrongs: [Acheap ? 'b' : 'a'],
      rightKey: 'Store ' + (Acheap ? 'A' : 'B'), wrongKey: 'Store ' + (Acheap ? 'B' : 'A'), why: 'Compare both prices per kilogram: the lower one is the better price.', nudge: 'type A or B.',
      diag: [{ v: Math.abs(a / 2.2 - b), code: 'u4t-price-way', hint: 'A kilogram is more meat than a pound, so it costs <b>more</b>: price per kg = price per lb × 2.2.' }, { v: Math.abs(a - b), code: 'u4t-no-conv', hint: 'Change Store A’s price to a price per kilogram before you compare.' },
        { v: Math.abs(a * 0.454 - b), code: 'u4t-price-way', hint: 'Converting a <b>price</b> goes the other way: price per kg = price per lb × 2.2.' }, { v: Math.min(aKg, b), code: 'u4t-gave-total', hint: 'That’s the better price. Subtract the two prices per kg.' }],
      sol: br(['Store A per kg: ' + t(Mt(a) + '\\times 2.2' + toM(aKg)), 'Store B: ' + MM(b) + ' per kg', t(Mt(Math.max(r2(aKg), b)) + '-' + Mt(Math.min(r2(aKg), b)) + '=' + Mt(diff)), '<b>Store ' + (Acheap ? 'A' : 'B') + '</b> is better by ' + MM(diff) + ' per kg.']),
      hints: ['Change the price per lb to a price per kg: × 2.2 (a kilogram is more meat).', 'Compare, then subtract.'], text: o.text || 'price per lb vs per kg' });
  }
  /* ---- loads of gravel (volume → mass → loads) ---- */
  var MATS = [['gravel', 1.7, [5, 14, 0.5], [6, 8, 10], 'dump truck'], ['topsoil', 1.3, [3, 9, 0.5], [2, 3], 'trailer'], ['concrete', 2.4, [3, 10, 0.5], [8, 10, 12], 'mixer truck']];
  function loadsPart(r, o) {
    o = o || {};
    var s = find(function () { var m = r.pick(MATS), V = pickR(r, m[2]), Lm = r.pick(m[3]); return { m: m, V: V, Lm: Lm, M: q(V * m[1]) }; }, function (s) { var n = s.M / s.Lm; return frac(n) > 0.08 && frac(n) < 0.92 && n > 1.3 && Math.ceil(s.V / s.Lm - 1e-9) !== Math.ceil(n - 1e-9) && !(s.V === 8 && s.m[1] === 1.7 && s.Lm === 6); });
    var n = s.M / s.Lm, ans = Math.ceil(n - 1e-9), p = person(r);
    return num(p.n + ' needs ' + U(s.V, 'm³') + ' of ' + s.m[0] + '. ' + cap(s.m[0]) + ' has a mass of about ' + t(N(s.m[1]) + '\\text{ t}') + ' per m³. The ' + s.m[4] + ' can carry at most ' + U(s.Lm, 't') + '. How many loads are needed?', ans, { dp: 0, count: 'up', exact: n, why: 'every bit has to be moved.', after: 'loads',
      diag: [{ v: s.M, code: 'u4t-gave-mass', hint: 'That’s the mass of the ' + s.m[0] + '. Divide by the ' + N(s.Lm) + ' t one load can carry.' }, { v: Math.ceil(s.V / s.Lm - 1e-9), code: 'u4t-no-factor', hint: 'The limit is a <b>mass</b> (t). Change the volume to a mass first: ' + t(N(s.V) + '\\times ' + N(s.m[1])) + '.' },
        { v: Math.ceil(s.V / s.m[1] / s.Lm - 1e-9), code: 'u4t-no-factor', hint: 'mass = volume × factor (multiply by ' + N(s.m[1]) + ').' }],
      sol: br(['mass = volume × factor: ' + t(N(s.V) + '\\times ' + N(s.m[1]) + '=' + N(s.M)) + ' t', 'Loads: ' + t(N(s.M) + '\\div ' + N(s.Lm) + toN(n, 2)) + ', so round <b>up</b>: ' + t(ans) + ' loads. (' + (ans - 1) + (ans === 2 ? ' load carries' : ' loads carry') + ' only ' + t(N(q((ans - 1) * s.Lm))) + ' t.)']),
      hints: ['mass = volume × (mass per m³).', 'Divide by the mass of one load and round up.'], text: o.text || 'loads' });
  }
  /* ---- $/t ↔ $/bu ---- */
  var PRICE_BU = { wheat: [6.8, 8.6], 'field peas': [7.6, 9.6], flax: [14, 17], canola: [14, 16.5], barley: [4.6, 6], oats: [3.8, 5] };
  function buPricePart(r, o) {
    o = o || {};
    var cr = cropPick(r), f = cr.f, perBu = r.chance(0.5), x, ans;
    if (perBu) { var pt = PRICE_T[cr.c]; x = q(r.int(pt[0], pt[1]) + r.pick([0, 0, 0.5])); ans = x / f; }
    else { var pb = PRICE_BU[cr.c]; x = q(r.int(Math.round(pb[0] * 100), Math.round(pb[1] * 100)) / 100); ans = x * f; }
    return num(perBu ? 'An elevator pays ' + MM(x) + ' per tonne for ' + cr.c + ' (' + t(N(f)) + ' bu/t). What is that price per bushel?' : 'A buyer offers ' + MM(x) + ' per bushel for ' + cr.c + ' (' + t(N(f)) + ' bu/t). What is that price per tonne?', ans, { money: true, after: perBu ? '/bu' : '/t',
      diag: [{ v: perBu ? x * f : x / f, code: 'u4t-bu-way', hint: perBu ? 'One tonne is ' + N(f) + ' bushels, so one bushel costs much <b>less</b> than a tonne: divide.' : 'One tonne is ' + N(f) + ' bushels, so a tonne costs much <b>more</b> than a bushel: multiply.' }, { v: f / x, code: 'u4t-bu-flip', hint: 'Divide the price by the factor.' }],
      sol: perBu ? t(Mt(x) + '\\div ' + N(f) + toM(ans)) + ' per bushel' : t(Mt(x) + '\\times ' + N(f) + toM(ans)) + ' per tonne', hints: ['$ per bushel = $ per tonne ÷ factor.', 'The price per tonne is always the bigger number.'], text: o.text || (perBu ? '$/t to $/bu' : '$/bu to $/t') });
  }
  /* ---- the most pallets under a bridge limit ---- */
  function palletPart(r, o) {
    o = o || {};
    var s = find(function () { var E = pickR(r, [4.2, 6.8, 0.1]), p = pickR(r, [650, 1150, 25]), L = pickR(r, [15, 24, 1]); return { E: E, p: p, L: L, x: (L - E) * 1000 / p }; },
      function (s) { return s.x >= 6 && s.x <= 20 && frac(s.x) > 0.05 && frac(s.x) < 0.95 && Math.floor(s.L * 1000 / s.p) !== Math.floor(s.x); });
    var n = Math.floor(s.x + 1e-9), goods = r.pick(['patio stones', 'bricks', 'bags of cement', 'paving blocks']);
    return num('An empty flatbed truck has a mass of ' + U(s.E, 't') + '. It is loaded with pallets of ' + goods + ', ' + U(s.p, 'kg') + ' each. A sign on a bridge says the limit is ' + U(s.L, 't') + '. What is the greatest number of pallets the truck can carry and still cross the bridge?', n, { dp: 0, count: 'down', exact: s.x, why: 'one more pallet would go over the limit.', after: 'pallets',
      diag: [{ v: Math.floor(s.L * 1000 / s.p), code: 'u4t-no-truck', hint: 'The truck itself counts: only ' + t(N(s.L) + '-' + N(s.E) + '=' + N(q(s.L - s.E))) + ' t is left for the pallets.' }],
      sol: br(['Room for pallets: ' + t(N(s.L) + '-' + N(s.E) + '=' + N(q(s.L - s.E))) + ' t = ' + t(N(q((s.L - s.E) * 1000))) + ' kg', t(N(q((s.L - s.E) * 1000)) + '\\div ' + N(s.p) + toN(s.x, 2)) + ', so round <b>down</b>: ' + t(n) + ' pallets.', 'Check: ' + t(N(s.E) + '+' + n + '\\times ' + N(s.p / 1000) + '=' + N(q(s.E + n * s.p / 1000))) + ' t, under ' + t(N(s.L)) + ' t.']),
      hints: ['Use the same unit: change t to kg (or kg to t).', 'Take off the truck’s own mass, divide, and round down.'], text: o.text || 'pallets under a limit' });
  }
  /* ---- a grain bin ---- */
  function binShared(r) {
    return find(function () { var cr = cropPick(r, ['wheat', 'barley', 'canola', 'oats']), d = r.int(14, 30), h = r.int(10, 20), pt = PRICE_T[cr.c], P0 = q(r.int(pt[0], pt[1]) + r.pick([0, 0.5])); var V = PI * d * d / 4 * h; return { cr: cr, d: d, h: h, P: P0, V: V, bu: V / 1.28, town: r.pick(TOWNS) }; },
      function (s) { var b0 = rd(s.bu, 0); return [18, 21].indexOf(s.d) < 0 && Math.abs(frac(s.bu) - 0.5) > 0.06 && rd(rd(s.V, 0) / 1.28, 0) === b0 && rd(rd(s.V, 1) / 1.28, 0) === b0 && binAlts(s).every(function (a) { var g = Math.abs(r2(a) - r2(b0 / s.cr.f * s.P)); return g < 0.85 || g > 1.15; }); });
  }
  /* other right values for the worth: the exact chain, and the tonnes rounded to two decimals (the booklet's rule) */
  function binAlts(s) { var f = s.cr.f, buR = rd(s.bu, 0); return [s.bu / f * s.P, rd(buR / f, 2) * s.P, rd(s.bu / f, 2) * s.P]; }
  function binStem(s) { return 'A round grain bin on a farm near ' + s.town + ' is ' + t(N(s.d) + '\\text{ ft}') + ' across. It holds ' + s.cr.c + ', level and ' + t(N(s.h) + '\\text{ ft}') + ' deep. Use ' + t('1\\text{ bu}\\approx 1.28\\text{ ft}^3') + ', and for ' + s.cr.c + ' ' + t(N(s.cr.f)) + ' bu/t.'; }
  function binBuPart(r, s) {
    return num('How many bushels of ' + s.cr.c + ' are in the bin, to the nearest bushel?', s.bu, { dp: 0, after: 'bu', alts: [rd(s.V, 0) / 1.28, rd(s.V, 1) / 1.28],
      diag: [{ v: s.V * 1.28, code: 'u4t-bu-ft-way', hint: 'A bushel is <b>bigger</b> than a cubic foot (1.28 ft³), so there are fewer bushels: divide by 1.28.' }, { v: PI * s.d * s.d * s.h / 1.28, code: 'u4t-diam', hint: 'Use the <b>radius</b>: ' + t(N(s.d) + '\\div 2=' + N(s.d / 2)) + ' ft.' },
        { v: s.V, code: 'u4t-gave-vol', hint: 'That’s the volume in ft³. Change it to bushels: ÷ 1.28.' }, { v: s.bu / s.cr.f, code: 'u4t-gave-tonnes', hint: 'That’s the mass in tonnes. The question asks for bushels.' }],
      sol: br(['Radius: ' + t(N(s.d) + '\\div 2=' + N(s.d / 2)) + ' ft', t('V=\\pi\\times ' + N(s.d / 2) + '^2\\times ' + N(s.h) + toN(s.V, 0) + '\\text{ ft}^3'), 'Bushels: ' + t(N(rd(s.V, 0)) + '\\div 1.28' + toN(rd(s.V, 0) / 1.28, 0)) + ' bu']),
      hints: ['The grain is a cylinder: V = π r² h.', 'ft³ → bushels: divide by 1.28.'], text: 'bin bushels' });
  }
  function binWorthPart(r, s) {
    var buR = rd(s.bu, 0), f = s.cr.f, T = s.bu / f, W = buR / f * s.P;
    return num('The elevator pays ' + MM(s.P) + ' per tonne for ' + s.cr.c + '. What is the grain in the bin worth?', W, { money: true,
      alts: binAlts(s), tol: 0.02,
      diag: [{ v: s.bu * s.P, code: 'u4t-no-tonnes', hint: 'The price is per <b>tonne</b>. Change the bushels to tonnes first: ÷ ' + N(f) + '.' }, { v: s.bu * f * s.P, code: 'u4t-bu-way', hint: 'Bushels → tonnes: <b>divide</b> by the factor.' },
        { v: T, code: 'u4t-gave-tonnes', hint: 'That’s the mass in tonnes. Multiply by the price per tonne.' }],
      sol: br(['Tonnes: ' + t(N(buR) + '\\div ' + N(f) + toN(buR / f, 2)) + ' t', 'Worth: ' + t(N(rd(buR / f, 4)) + '\\ldots\\times ' + Mt(s.P) + toM(buR / f * s.P)) + ' (keep the decimals in the calculator)']),
      hints: ['Bushels → tonnes: divide by the factor.', 'Then multiply by the price per tonne.'], text: 'bin worth' });
  }
  /* ---- a hot tub on a deck ---- */
  function hotTubPart(r, o) {
    o = o || {};
    var s = find(function () { var l = pickR(r, [1.8, 2.6, 0.1]), w = r.chance(0.5) ? l : pickR(r, [1.8, 2.4, 0.1]), d = r.pick([70, 75, 80, 85, 90, 95]), lim = 250 * r.int(16, 26), a = r.pick([75, 80, 85, 90]); var W = l * w * d / 100 * 1000; return { l: l, w: w, d: d, lim: lim, a: a, W: q(W), x: (lim - W) / a }; },
      function (s) { return s.x >= 2 && s.x <= 10 && frac(s.x) > 0.05 && frac(s.x) < 0.95 && !(s.l === 2.2 && s.w === 2.2 && s.d === 85) && Math.floor(s.lim / s.a) !== Math.floor(s.x) && Math.floor((s.lim - s.W / 10) / s.a) !== Math.floor(s.x); });
    var n = Math.floor(s.x + 1e-9), sq = s.l === s.w;
    return num('The inside of a ' + (sq ? 'square' : 'rectangular') + ' hot tub is ' + U(s.l, 'm') + ' by ' + U(s.w, 'm') + ', and the water is ' + U(s.d, 'cm') + ' deep. The deck under it is built to hold ' + t(HW.fmt(String(s.lim)) + '\\text{ kg}') + '. One litre of water has a mass of about 1 kg. What is the greatest number of adults, about ' + U(s.a, 'kg') + ' each, who can be in the hot tub? (Ignore the tub itself.)', n, {
      dp: 0, count: 'down', exact: s.x, why: 'one more person would go over the limit.', after: 'adults',
      diag: [{ v: Math.floor(s.lim / s.a), code: 'u4t-no-water', hint: 'The water is heavy: find its mass first and take it off the ' + HW.fmt(String(s.lim)) + ' kg.' }, { v: Math.floor((s.lim - s.W / 10) / s.a), code: 'u4t-si-100', hint: t('1\\text{ m}^3=1000\\text{ L}') + ', not 100 L.' }],
      sol: br([t(s.d + '\\text{ cm}=' + N(s.d / 100) + '\\text{ m}') + '; ' + t('V=' + N(s.l) + '\\times ' + N(s.w) + '\\times ' + N(s.d / 100) + '=' + N(q(s.W / 1000)) + '\\text{ m}^3=' + N(s.W) + '\\text{ L}'), 'Water: about ' + t(N(s.W) + '\\text{ kg}'),
        'Left for people: ' + t(HW.fmt(String(s.lim)) + '-' + N(s.W) + '=' + N(q(s.lim - s.W))) + ' kg', t(N(q(s.lim - s.W)) + '\\div ' + s.a + toN(s.x, 2)) + ', so round <b>down</b>: ' + t(n) + ' adults.']),
      hints: ['Change the depth to metres, find the volume in m³, then litres (× 1000) and kilograms.', 'Take the water off the limit, divide by the mass of one adult, and round down.'], text: o.text || 'hot tub on a deck' });
  }
  /* ---- gas in the US against Calgary ---- */
  function gasCmpPart(r, o) {
    o = o || {};
    var s = find(function () { var T = r.int(60, 110), p = pickR(r, [3.09, 4.19, 0.01]), R = pickR(r, [1.35, 1.42, 0.01]), c = pickR(r, [1.29, 1.69, 0.01]); var uL = p / 3.785 * R; return { T: T, p: p, R: R, c: c, uL: uL }; },
      function (s) { var a3 = rd(rd(s.p / 3.785, 3) * s.R, 3), a2 = rd(s.uL, 2); return Math.abs(s.c - s.uL) >= 0.04 && (s.c - s.uL) * (s.c - a2) > 0 && (s.c - s.uL) * (s.c - a3) > 0 && (s.c - s.uL) * (s.c - s.p / 3.785) > 0 && !(s.T === 98 && s.p === 3.49); });
    var pl = r.pick(['Montana', 'Idaho', 'North Dakota']), us = s.uL < s.c, amt = s.T * Math.abs(s.c - s.uL), ps = person(r);
    var rt = us ? ['montana', 'idaho', 'north', 'dakota', 'us', 'usa', 'america', 'american', 'states'] : ['calgary', 'alberta', 'canada', 'home'];
    var wg = us ? ['calgary', 'alberta', 'canada', 'home'] : ['montana', 'idaho', 'north', 'dakota', 'us', 'usa', 'america', 'american', 'states'];
    return whichAmtPart(ps.n + '’s pickup has a ' + U(s.T, 'L') + ' gas tank. In Calgary, gas costs ' + MM(s.c) + ' per litre. In ' + pl + ', gas costs ' + MM(s.p) + ' USD per US gallon. Use ' + t('1\\text{ US gal}\\approx 3.785\\text{ L}') + ' and ' + t('1\\text{ USD}=' + s.R.toFixed(2) + '\\text{ CAD}') + '. Where is gas cheaper, and about how much (in CAD) does ' + ps.n + ' save by filling an empty tank there?', {
      amt: amt, alts: [s.T * Math.abs(s.c - rd(rd(s.p / 3.785, 3) * s.R, 3)), s.T * Math.abs(s.c - rd(s.uL, 2)), s.T * Math.abs(s.c - rd(rd(s.p / 3.785, 3) * s.R, 2)), Math.abs(r2(s.T * s.c) - r2(s.T * s.uL))], tol: 0.06,
      whichLabel: 'Cheaper (' + pl + ' or Calgary):', amtLabel: 'Saving (CAD):', ph: pl + ' or Calgary', right: rt, wrongs: wg, rightKey: us ? pl : 'Calgary', wrongKey: us ? 'Calgary' : pl,
      why: 'Compare both prices in Canadian dollars per litre: the lower one is cheaper.', nudge: 'type ' + pl + ' or Calgary.',
      diag: [{ v: s.T * Math.abs(s.c - s.p / 3.785), code: 'u4t-no-rate', hint: 'The ' + pl + ' price is in US dollars: multiply by ' + s.R.toFixed(2) + ' to get Canadian dollars.' }, { v: Math.abs(s.c - s.uL), code: 'u4t-one-litre', hint: 'That’s the saving on one litre. The tank holds ' + s.T + ' L.' },
        { v: s.T * Math.abs(s.c - s.p / 3.785 / s.R), code: 'u4t-rate-way', hint: '1 USD = ' + s.R.toFixed(2) + ' CAD: US dollars → Canadian dollars, <b>multiply</b>.' }, { v: Math.min(s.T * s.c, s.T * s.uL), code: 'u4t-gave-total', hint: 'That’s the cost of a tank. Subtract the two tank costs.' },
        { v: s.T * Math.abs(s.c - s.p * s.R / 4.546), code: 'u4t-british', hint: 'US pumps sell the <b>US</b> gallon (3.785 L).' }],
      sol: br([pl + ' per litre: ' + t(Mt(s.p) + '\\div 3.785' + '\\approx\\$' + rd(s.p / 3.785, 3).toFixed(3)) + ' USD; ' + t(rd(s.p / 3.785, 3).toFixed(3) + '\\times ' + s.R.toFixed(2) + '\\approx\\$' + rd(s.uL, 3).toFixed(3)) + ' CAD per litre',
        'Calgary: ' + MM(s.c) + ' per litre, so <b>' + (us ? pl : 'Calgary') + '</b> is cheaper.', 'Saving: ' + t(s.T + '\\times(' + (us ? Mt(s.c) + '-\\$' + rd(s.uL, 3).toFixed(3) : '\\$' + rd(s.uL, 3).toFixed(3) + '-' + Mt(s.c)) + ')' + toM(amt)) + ' (about)']),
      hints: ['Find the ' + pl + ' price per litre in US dollars (÷ 3.785), then in Canadian dollars (× ' + s.R.toFixed(2) + ').', 'Saving = litres × the difference in price per litre.'], text: o.text || 'gas: US vs Calgary' });
  }
  /* ---- the most items in a parcel ---- */
  var SHIP = [['candles', 'candle', [10, 16]], ['jars of honey', 'jar', [12, 18]], ['mugs', 'mug', [10, 15]], ['bars of soap', 'bar', [4, 6]]];
  function shipPart(r, o) {
    o = o || {};
    var s = find(function () { var it = r.pick(SHIP), oz = r.int(it[2][0], it[2][1]), box = 10 * r.int(15, 30), pk = 10 * r.int(12, 24), lim = r.pick([2, 2.5, 3, 5]); var x = (lim * 1000 - box - pk) / (oz * 28.35); return { it: it, oz: oz, box: box, pk: pk, lim: lim, x: x }; },
      function (s) { var y = (s.lim * 1000 - s.box - s.pk) / (s.oz * 30), z = (s.lim * 2.2 * 16 - (s.box + s.pk) / 28.35) / s.oz; return s.x >= 3 && s.x <= 14 && frac(s.x) > 0.06 && frac(s.x) < 0.94 && Math.floor(z) === Math.floor(s.x) && Math.floor(y) !== Math.floor(s.x) && Math.floor(s.lim * 1000 / (s.oz * 28.35)) !== Math.floor(s.x) && !(s.oz === 14 && s.box === 250 && s.pk === 180); });
    var n = Math.floor(s.x + 1e-9), it = s.it, p = person(r), one = s.oz * 28.35, room = s.lim * 1000 - s.box - s.pk;
    return num(p.n + ' ships ' + it[0] + ' from an online shop. Each ' + it[1] + ' has a mass of ' + U(s.oz, 'oz') + '. A parcel also holds a ' + U(s.box, 'g') + ' gift box and ' + U(s.pk, 'g') + ' of box and packing. The courier charges more for a parcel over ' + U(s.lim, 'kg') + '. What is the greatest number of ' + it[0] + ' that fit in one parcel without going over ' + U(s.lim, 'kg') + '? (' + t('1\\text{ oz}\\approx 28.35\\text{ g}') + ')', n, {
      dp: 0, count: 'down', exact: s.x, why: 'one more would go over the limit.', after: it[0].split(' ')[0],
      diag: [{ v: Math.floor(s.lim * 1000 / one), code: 'u4t-no-pack', hint: 'The gift box and the packing count too: take them off the ' + N(s.lim) + ' kg first.' }, { v: Math.floor(room / (s.oz * 30)), code: 'u4t-est-30', hint: 'Use ' + t('1\\text{ oz}\\approx 28.35\\text{ g}') + ' (30 g is only the quick estimate).' }],
      sol: br(['One ' + it[1] + ': ' + t(s.oz + '\\times 28.35=' + N(q(one))) + ' g', 'Room: ' + t(N(s.lim * 1000) + '-' + s.box + '-' + s.pk + '=' + N(room)) + ' g', t(N(room) + '\\div ' + N(q(one)) + toN(s.x, 2)) + ', so round <b>down</b>: ' + t(n) + ' ' + it[0] + '.',
        'Check: ' + t(n + '\\times ' + N(q(one)) + '+' + (s.box + s.pk) + '=' + N(q(n * one + s.box + s.pk))) + ' g, not over ' + t(N(s.lim * 1000)) + ' g.']),
      hints: ['Work in grams: change the ounces and the kilograms to grams.', 'Take the box and packing off the limit, divide by one item, and round down.'], text: o.text || 'parcel limit' });
  }
  /* ---- working backwards: the thickness of a slab ---- */
  function backSlabPart(r, o) {
    o = o || {};
    var s = find(function () { var V = pickR(r, [0.4, 1.6, 0.05]), l = pickR(r, [2, 4.5, 0.5]), w = pickR(r, [1.5, 3, 0.5]); return { V: V, l: l, w: w, h: V / (l * w) * 100 }; },
      function (s) { return s.l >= s.w && s.h >= 6 && s.h <= 20 && !(s.V === 0.9 && s.l === 3 && s.w === 2.5); });
    var p = person(r), A0 = s.l * s.w;
    return num(p.n + ' has ' + U(s.V, 'm³') + ' of concrete left in the truck. ' + cap(p.he) + ' uses all of it to pour a slab for a ' + r.pick(['shed', 'garden box', 'barbecue', 'water tank']) + ', ' + U(s.l, 'm') + ' by ' + U(s.w, 'm') + '. How thick will the slab be, in <b>centimetres</b>? Round to the nearest tenth.', s.h, { dp: 1, after: 'cm',
      diag: [{ v: s.h / 100, code: 'u4t-gave-m', hint: 'That’s the thickness in metres. ' + t('1\\text{ m}=100\\text{ cm}') + '.' }, { v: s.V * A0, code: 'u4t-times-back', hint: 'Work backwards: ' + t('h=V\\div(l\\times w)') + '.' }, { v: s.h * 10, code: 'u4t-cm-1000', hint: t('1\\text{ m}=100\\text{ cm}') + ', not 1000.' },
        { v: s.V / (s.l + s.w) * 100, code: 'u4t-add-lengths', hint: 'The base is a rectangle: its area is ' + t('l\\times w') + '.' }],
      sol: br(['Area of the base: ' + t(N(s.l) + '\\times ' + N(s.w) + '=' + N(q(A0))) + ' m²', t('h=' + N(s.V) + '\\div ' + N(q(A0)) + toN(s.h / 100, 4) + '\\text{ m}') + ' = ' + t(fx(s.h, 1) + '\\text{ cm}'), 'Check: ' + t(N(s.l) + '\\times ' + N(s.w) + '\\times ' + N(rd(s.h / 100, 4)) + '\\approx ' + N(s.V)) + ' m³']),
      hints: ['V = (area of base) × h, so h = V ÷ (area of base).', 'Change metres to centimetres: × 100.'], text: o.text || 'slab thickness backwards' });
  }
  Object.assign(A, { boxPart: boxPart, cylPart: cylPart, siPart: siPart, cubicImpPart: cubicImpPart, usCapPart: usCapPart, cToFPart: cToFPart, fToCPart: fToCPart, estMCPart: estMCPart, factPart: factPart,
    cropPick: cropPick, buTPart: buTPart, prismPart: prismPart, cylCapPart: cylCapPart, fillGasPart: fillGasPart, changePart: changePart, lbOzArithPart: lbOzArithPart, priceCmpPart: priceCmpPart,
    loadsPart: loadsPart, buPricePart: buPricePart, palletPart: palletPart, hotTubPart: hotTubPart, gasCmpPart: gasCmpPart, shipPart: shipPart, backSlabPart: backSlabPart, PRICE_BU: PRICE_BU, MATS: MATS });

  /* ======================= the questions (paper order; defineTest orders them Beginning → Progressing → Mastery) ======================= */
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function QS(num, outcome, level, shared, stem, makes, text) { return { num: String(num), outcome: outcome, text: text, shared: shared, stem: stem, parts: makes.map(function (mk, i) { return { id: num + String.fromCharCode(97 + i), outcome: outcome, level: level, make: mk }; }) }; }
  var QUESTIONS = [
    /* ---------- Beginning ---------- */
    Q(1, 'M1', 'BEG', function (r) { return boxPart(r); }, 'Volume of a box (SI)'),
    Q(2, 'M1', 'BEG', function (r) { return cylPart(r); }, 'Volume of a cylinder (SI)'),
    Q(3, 'M2', 'BEG', function (r) { return cubicImpPart(r); }, 'Cubic units: ft³ ↔ in³, yd³ ↔ ft³'),
    Q(4, 'M1', 'BEG', function (r) { return siPart(r, 'cap'); }, 'Capacity: L, mL, cm³, m³'),
    Q(5, 'M2', 'BEG', function (r) { return usCapPart(r); }, 'US gallons, quarts, pints, cups, fluid ounces'),
    Q(6, 'M2', 'BEG', function (r) { return cToFPart(r); }, '°C to °F'),
    Q(7, 'M2', 'BEG', function (r) { return fToCPart(r); }, '°F to °C'),
    Q(8, 'M1', 'BEG', function (r) { return siPart(r, 'mass'); }, 'Mass: mg, g, kg, t'),
    Q(9, 'M2', 'BEG', function (r) { return factPart(r); }, 'lb ↔ kg, oz ↔ g with a conversion fact'),
    Q(10, 'M2', 'BEG', function (r) { return buTPart(r); }, 'Bushels ↔ tonnes'),
    Q(11, 'M2', 'BEG', estMCPart, 'Quick temperature estimate (multiple choice)'),
    /* ---------- Progressing ---------- */
    Q(12, 'M1', 'PRG', function (r) { return prismPart(r); }, 'Volume of a triangular prism'),
    Q(13, 'M1', 'PRG', function (r) { return cylCapPart(r); }, 'Capacity of a cylinder in litres'),
    QS(14, 'M2', 'PRG', slabShared, slabStem, [slabVolPart, slabOrderPart], 'Concrete slab: ft³, then the order in half yards and the cost'),
    Q(15, 'M2', 'PRG', function (r) { return fillGasPart(r); }, 'Fill a tank in litres at a price per US gallon'),
    Q(16, 'M2', 'PRG', function (r) { return changePart(r); }, 'A temperature change on the other scale'),
    Q(17, 'M2', 'PRG', function (r) { return lbOzArithPart(r); }, 'Add or subtract pounds and ounces'),
    Q(18, 'M2', 'PRG', function (r) { return priceCmpPart(r); }, '$/lb vs $/kg: which store, by how much per kg'),
    Q(19, 'M1', 'PRG', function (r) { return loadsPart(r); }, 'Volume → mass → loads'),
    Q(20, 'M2', 'PRG', function (r) { return buPricePart(r); }, 'Price per tonne ↔ price per bushel'),
    Q(21, 'M1', 'PRG', function (r) { return palletPart(r); }, 'Most pallets under a bridge limit'),
    /* ---------- Mastery ---------- */
    QS(22, 'M2', 'MAS', binShared, binStem, [binBuPart, binWorthPart], 'Grain bin: bushels, then what it is worth'),
    Q(23, 'M1', 'MAS', function (r) { return hotTubPart(r); }, 'Hot tub on a deck: how many adults'),
    Q(24, 'M2', 'MAS', function (r) { return gasCmpPart(r); }, 'Gas in the US vs Calgary: where cheaper, saving on a tank'),
    Q(25, 'M2', 'MAS', function (r) { return shipPart(r); }, 'Most items in a parcel under a kg limit'),
    Q(26, 'M1', 'MAS', function (r) { return backSlabPart(r); }, 'Working backwards: the thickness of a slab')
  ];

  HW.defineTest({
    id: 'u4test', unit: 4, title: 'Unit 4 Test', outcome: 'M1', calc: true,
    blurb: 'The Unit 4 outcomes-based test (M1 SI, M2 imperial): volume of prisms and cylinders, cubic units and ordering concrete, capacity in litres and US / British gallons, Celsius and Fahrenheit, mass in SI and imperial units, converting between them, and bushels and tonnes, in Beginning, Progressing and Mastery boxes.',
    // Short version (~50%): Beginning keeps M1 cylinder and SI mass, M2 °F to °C, lb ↔ kg and bushels ↔ tonnes;
    // Progressing keeps M1 cylinder capacity and loads, M2 filling a tank in US gallons, pounds and ounces, $/lb vs $/kg;
    // Mastery keeps M2 the grain bin (both parts) and M1 the slab thickness worked backwards.
    short: ['2', '7', '8', '9', '10', '13', '15', '17', '18', '19', '22', '26'],
    questions: QUESTIONS
  });
})(window);
