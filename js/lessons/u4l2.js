/* Math 10-3 · Unit 4 · Lesson 2 — Capacity: Litres, Gallons, and US vs British Units (M1 for SI parts, M2 for imperial or SI↔imperial parts)
 * Assignment 2 (u4_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u4_ep02.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the same container, units and difficulty as the booklet item, new numbers around the
 * booklet's (the lesson's worked-example numbers are left out). Calculator allowed. Constants exactly as the booklet:
 * 1 L = 1000 mL = 1000 cm³, 1 m³ = 1000 L; 1 US gal = 4 qt = 8 pt = 16 cups = 128 fl oz; US gal ≈ 3.785 L, British
 * gal ≈ 4.546 L, US fl oz ≈ 29.57 mL, British fl oz ≈ 28.4 mL, US pint ≈ 473 mL, US cup ≈ 237 mL; tsp 5 mL, tbsp 15 mL,
 * metric cup 250 mL.
 * Answers: typed numbers (a unit typed after the number is ignored), rounded as the booklet asks; recognised mistakes get
 * their own hint: ×100 or ×10 for L ↔ mL, mL left as litres, m³ ↔ L with 1 000 000, multiplying instead of dividing,
 * a missing step in the US chain (gal → qt only), British instead of US gallons (or fluid ounces), the metric cup (250)
 * instead of the US cup (237), 0.33 for ⅓, rounding a "how many full …" up (or an order down), and so on.
 * Conversions: "choose the best unit" → a tap grid (mL / L / m³); "finish each sentence with US or British" → a tap grid;
 * "estimate, then convert" → two boxes (an estimate box that accepts any sensible estimate, then the answer); "is it
 * enough / is the label fair / explain / can both be right / why are these sizes used" → multiple choice whose options
 * are reasons (one right); the recipe table → one labelled box per ingredient, the table in the prompt; hours and minutes
 * → two boxes. Uses HW.u4conv from u4l1.js (load u4l1.js first). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t;
  var C = HW.u4conv;
  var q = C.q, rd = C.rd, near = C.near, nS = C.nS, decs = C.decs, N = C.N, Np = C.Np, raw = C.raw, eqR = C.eqR, uT = C.uT, find = C.find, pickR = C.pickR, roundUp = C.roundUp, M = C.M, Mp = C.Mp, mixT = C.mixT;
  var num = C.num, fields = C.fields, F = C.F;
  function pick(r, a, ex) { return find(function () { return r.pick(a); }, function (v) { return (ex || []).indexOf(v) < 0; }); }
  function he(n) { return /^(Joel|Owen|Diego|Ravi|Marco|Wes|Arjun|Kenji|Omar|Liam|Ben|Theo|Malik|Kai|Mateo|Tyler)$/.test(n) ? 'he' : 'she'; }

  HW.addCodes({
    'u4l2-100': 'Used 100 for L ↔ mL', 'u4l2-10': 'Used 10 for L ↔ mL', 'u4l2-ml-not-l': 'Left the answer in mL / cm³', 'u4l2-m3-1e6': 'Used 1 000 000 for m³ ↔ L', 'u4l2-chain': 'Missed a step of the US chain',
    'u4l2-british': 'Used the British gallon (or fl oz) instead of the US one', 'u4l2-us': 'Used the US gallon instead of the British one', 'u4l2-metric-cup': 'Used the metric cup (250 mL) instead of the US cup', 'u4l2-third': 'Used 0.33 for ⅓ (rounded too early)',
    'u4l2-tsp-tbsp': 'Mixed up teaspoons and tablespoons', 'u4l2-round-up': 'Rounded up a count of full containers', 'u4l2-round-down': 'Rounded down an amount that must be covered', 'u4l2-no-1000': 'Didn’t change cm³ to litres', 'u4l2-per100': 'Forgot the rate is per 100 km',
    'u4l2-no-convert': 'Didn’t change the units first', 'u4l2-diff-sum': 'Added instead of subtracting', 'u4l2-minutes': 'Gave minutes instead of hours and minutes', 'u4l2-unit-word': 'Answer in the wrong unit', 'u4l2-one-coat': 'Forgot the second coat', 'u4l2-best-unit': 'Chose an unsuitable unit', 'u4l2-estimate': 'Gave the estimate, not the conversion', 'u4l2-one-gal': 'Found the difference for one gallon only', 'u4l2-one-cup': 'Found the difference for one cup only'
  });
  HW.addPartial({ 'u4l2-100': 'b', 'u4l2-10': 'b', 'u4l2-ml-not-l': 'b', 'u4l2-m3-1e6': 'b', 'u4l2-chain': 'b', 'u4l2-british': 's', 'u4l2-us': 's', 'u4l2-metric-cup': 'b', 'u4l2-third': 's', 'u4l2-tsp-tbsp': 'b', 'u4l2-round-up': 's', 'u4l2-round-down': 's', 'u4l2-per100': 'b', 'u4l2-one-coat': 'b' });

  /* ---- SI capacity conversions ---- */
  var LML = [[100, 'u4l2-100', '1 L = <b>1000</b> mL (milli means one thousandth).'], [10, 'u4l2-10', '1 L = <b>1000</b> mL.']];
  var SI = {
    Lml: function (x) { return C.conv(N(x) + ' L = ____ mL', x, 1000, true, { from: 'L', to: 'mL', wrongF: LML, text: 'L to mL' }); },
    mlL: function (x) { return C.conv(Np(x) + ' mL = ____ L', x, 1000, false, { from: 'mL', to: 'L', wrongF: LML, text: 'mL to L' }); },
    cm3ml: function (x) { return num(Np(x) + ' cm³ = ____ mL', x, { after: 'mL', bad: [[x / 1000, 'u4l2-unit-word', '1 cm³ holds exactly 1 mL, so the number stays the same.'], [x * 1000, 'u4k-wrong-way', '1 cm³ = 1 mL: the number stays the same.']], sol: '1 cm³ = 1 mL, so ' + t(N(x) + uT('cm³') + '=' + N(x) + uT('mL')), hints: ['A 1 cm cube holds exactly 1 mL.'], text: 'cm3 to mL' }); },
    cm3L: function (x) { return C.conv(Np(x) + ' cm³ = ____ L', x, 1000, false, { from: 'cm³', to: 'L', wrongF: LML, bad: [[x, 'u4l2-ml-not-l', 'That’s the number of <b>mL</b> (1 cm³ = 1 mL). Now divide by 1000 to get litres.']], sol: t(N(x) + uT('cm³') + '=' + N(x) + uT('mL')) + '; ' + t(N(x) + '\\div 1000=' + N(x / 1000) + uT('L')), text: 'cm3 to L' }); },
    Lcm3: function (x) { return C.conv(N(x) + ' L = ____ cm³', x, 1000, true, { from: 'L', to: 'cm³', wrongF: LML, sol: '1 L = 1000 mL = 1000 cm³; ' + t(N(x) + '\\times 1000=' + N(x * 1000) + uT('cm³')), text: 'L to cm3' }); },
    m3L: function (x) { return C.conv(N(x) + ' m³ = ____ L', x, 1000, true, { from: 'm³', to: 'L', wrongF: [[1000000, 'u4l2-m3-1e6', '1 000 000 changes m³ to <b>cm³</b>. For litres: 1 m³ = 1000 L.'], [100, 'u4l2-100', '1 m³ = 1000 L.']], text: 'm3 to L' }); },
    Lm3: function (x) { return C.conv(Np(x) + ' L = ____ m³', x, 1000, false, { from: 'L', to: 'm³', wrongF: [[1000000, 'u4l2-m3-1e6', '1 m³ = 1000 L, so divide by 1000.'], [100, 'u4l2-100', '1 m³ = 1000 L.']], text: 'L to m3' }); }
  };
  function lab(p, l) { p.prompt = '(' + l + ') ' + p.prompt; return p; }

  /* ---- US conversions along gal → qt → pt → cup → fl oz ---- */
  var CH = ['gal', 'qt', 'pt', 'cup', 'floz'], STEP = [4, 2, 2, 8], NM = C.USNAME, ONE = { gal: 'gal', qt: 'qt', pt: 'pt', cup: 'cup', floz: 'fl oz' };
  function usPart(prompt, x, from, to, o) {
    o = o || {};
    var i = CH.indexOf(from), j = CH.indexOf(to), lo = Math.min(i, j), hi = Math.max(i, j), f = C.US[CH[lo]] / C.US[CH[hi]], mul = i < j, wrongF = [], k, pr;
    for (k = lo + 1, pr = 1; k < hi; k++) { pr *= STEP[k - 1]; wrongF.push([pr, 'u4l2-chain', '1 ' + ONE[CH[lo]] + ' = ' + f + ' ' + NM[CH[hi]] + ': go through every step (' + CH.slice(lo, hi + 1).map(function (c) { return NM[c]; }).join(' → ') + ') and multiply the steps.']); }
    for (k = hi - 1, pr = 1; k > lo; k--) { pr *= STEP[k]; wrongF.push([pr, 'u4l2-chain', '1 ' + ONE[CH[lo]] + ' = ' + f + ' ' + NM[CH[hi]] + ': use every step of the chain.']); }
    var chain = hi - lo > 1 ? '1 ' + ONE[CH[lo]] + ' = ' + CH.slice(lo + 1, hi + 1).map(function (c, n) { return t(STEP.slice(lo, lo + n + 1).reduce(function (a, b) { return a * b; }, 1) + '') + ' ' + NM[c]; }).join(' = ') + '; ' : '';
    return C.conv(prompt, x, f, mul, { from: NM[from], to: NM[to], wrongF: wrongF, dp: o.dp, exactOk: true,
      sol: chain + t(N(x) + (mul ? '\\times ' : '\\div ') + f + '=' + N(q(mul ? x * f : x / f))) + ' ' + NM[to], hints: ['1 gal = 4 qt, 1 qt = 2 pt, 1 pt = 2 cups, 1 cup = 8 fl oz.', (mul ? 'Bigger unit → smaller unit: multiply' : 'Smaller unit → bigger unit: divide') + ' by ' + t(f + '') + '.'], text: o.text || (from + ' to ' + to) });
  }
  function usQ(r, from, to, ex) {
    var i = CH.indexOf(from), j = CH.indexOf(to), f = C.US[CH[Math.min(i, j)]] / C.US[CH[Math.max(i, j)]], x;
    if (i < j) x = pick(r, [1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10].filter(function (v) { return Number.isInteger(v * f); }), ex);
    else x = pick(r, [2, 3, 4, 5, 6, 8].map(function (k) { return k * f; }), ex);
    return usPart(N(x) + ' ' + NM[from] + ' = ____ ' + NM[to], x, from, to);
  }

  /* ---- estimate + convert (two boxes) ---- */
  function estConv(prompt, x, kind) {
    var K2 = {
      galL: { f: 3.785, mul: true, ef: 4, from: 'US gal', to: 'L', dp: 2, show: N(x) + ' US gal' },
      Lgal: { f: 3.785, mul: false, ef: 4, from: 'L', to: 'US gal', dp: 2, show: N(x) + ' L' },
      ozml: { f: 29.57, mul: true, ef: 30, from: 'US fl oz', to: 'mL', dp: 1, show: N(x) + ' US fl oz' },
      mloz: { f: 29.57, mul: false, ef: 30, from: 'mL', to: 'US fl oz', dp: 2, show: Np(x) + ' mL' }
    }[kind];
    var ex = K2.mul ? x * K2.f : x / K2.f, est = K2.mul ? x * K2.ef : x / K2.ef, wrongV = K2.mul ? x / K2.f : x * K2.f;
    var wayHint = K2.mul ? 'Going to ' + K2.to + ' you <b>multiply</b> (each ' + K2.from.replace(/^US /, 'US ') + ' is about ' + K2.ef + ' ' + K2.to + ').' : 'Going from ' + K2.from + ' to ' + K2.to + ' you <b>divide</b> (each ' + K2.to + ' is about ' + K2.ef + ' ' + K2.from + ').';
    var bad = [[wrongV, 'u4k-wrong-way', wayHint]];
    if (kind === 'galL' || kind === 'Lgal') bad.push([K2.mul ? x * 4.546 : x / 4.546, 'u4l2-british', '4.546 L is a <b>British</b> gallon. A US gallon is about 3.785 L.']);
    if (kind === 'ozml' || kind === 'mloz') bad.push([K2.mul ? x * 28.4 : x / 28.4, 'u4l2-british', '28.4 mL is a <b>British</b> fluid ounce. A US fl oz is about 29.57 mL.']);
    return fields(prompt, [
      { label: 'Estimate:', name: 'Estimate', ans: est, after: K2.to, est: { tol: 0.15, dp: 0, bad: [[K2.mul ? x / K2.ef : x * K2.ef, 'u4k-wrong-way', wayHint]], friendly: '(' + K2.ef + ')' } },
      { label: 'Answer:', name: 'Answer', ans: ex, dp: K2.dp, exact: ex, after: K2.to, bad: bad }],
      ['Estimate: ' + t(N(x) + (K2.mul ? '\\times ' : '\\div ') + K2.ef + (near(est, rd(est, 0)) ? '=' : '\\approx ') + N(rd(est, 0))) + ' ' + K2.to, t(N(x) + (K2.mul ? '\\times ' : '\\div ') + N(K2.f) + eqR(ex, K2.dp)) + ' ' + K2.to],
      ['Estimate with friendly numbers: 1 US gal ≈ 4 L, 1 US fl oz ≈ 30 mL.', (K2.mul ? 'Multiply' : 'Divide') + ' by ' + t(N(K2.f)) + '.'], 'estimate ' + kind);
  }

  /* ---- a "how many full containers" count (rounded down) ---- */
  function fullCount(prompt, total, each, o) {
    o = o || {}; var ex = total / each, n = Math.floor(ex + 1e-9);
    return num(prompt, n, { after: o.after, bad: [[Math.ceil(ex - 1e-9), 'u4l2-round-up', 'The last one would not be full. Count only the <b>full</b> ones: round down.'], [rd(ex, 2), 'u4l2-round-up', 'Give a whole number of full ones (round down).'], [each / total, 'u4k-wrong-way', 'Divide the total by the size of one.']].concat(o.bad || []),
      sol: (o.pre || []).concat([t((o.totT || N(total)) + '\\div ' + N(each) + eqR(ex, 2)) + (Number.isInteger(q(ex)) ? '' : ', so ' + n + ' full ' + (o.what || 'ones') + ' (round down)')]), hints: o.hints || ['Divide, then round <b>down</b>: only full ones count.'], text: o.text });
  }

  HW.defineLesson({
    id: 'u4l2', unit: 4, num: '2', title: 'Capacity: Litres, Gallons, and US vs British Units', outcome: 'M1',
    blurb: 'Millilitres, litres and cubic units; the capacity of tanks and barrels; US gallons, quarts, pints, cups and fluid ounces; US vs British gallons; converting between SI and imperial capacity.',
    questions: [
      { num: '1', stem: 'Convert each measurement.', parts: [
        { id: '1a', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.Lml(pick(r, [1.5, 3.2, 0.8, 1.25, 4.5, 0.6, 2.4, 5.5], [2.5])), 'a'); } },
        { id: '1b', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.mlL(pick(r, [450, 250, 600, 125, 850, 2500, 1750, 300], [750])), 'b'); } },
        { id: '1c', level: 'EMG', outcome: 'M1', make: function (r) { return lab(SI.cm3L(pick(r, [1250, 2400, 500, 750, 3600, 1500, 900], [340])), 'c'); } },
        { id: '1d', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.Lcm3(pick(r, [0.75, 1.5, 2, 0.25, 3.5, 1.2], [4.2])), 'd'); } },
        { id: '1e', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.m3L(pick(r, [4.5, 1.2, 3, 0.8, 6.5, 2.25], [2.6])), 'e'); } },
        { id: '1f', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.Lm3(pick(r, [600, 2500, 750, 4200, 3000, 1500], [1800])), 'f'); } }] },
      { num: '2', parts: [
        { id: '2', level: 'BEG', outcome: 'M1', make: function (r) {
          var POOL = { mL: ['one dose of cough syrup', 'a juice box', 'a can of pop', 'a bottle of eye drops', 'a teaspoon of vanilla', 'a small cup of yogurt', 'a bottle of nail polish'],
            L: ['a can of house paint', 'a car’s gas tank', 'a bathtub', 'a big jug of milk', 'a kitchen sink', 'a bucket of water', 'a water cooler jug'],
            m3: ['the water in a town’s water tower', 'an Olympic swimming pool', 'the water behind a dam', 'the oil in a tanker ship', 'a city water reservoir'] };
          var kinds = r.shuffle(['mL', 'L', 'm3', r.pick(['mL', 'L', 'm3'])]), used = {}, rows = [], want = {};
          kinds.forEach(function (k, i) { var it = find(function () { return r.pick(POOL[k]); }, function (x) { return !used[x]; }); used[it] = 1; rows.push({ id: 'r' + i, html: '(' + 'abcd'[i] + ') ' + it }); want['r' + i] = k; });
          var WHY = { mL: 'a small amount: a few millilitres up to a few hundred', L: 'a medium amount: one or more litres', m3: 'a huge amount: thousands of litres, so cubic metres' };
          return P.grid('Choose the best unit for each capacity: mL, L or m³.', rows, [{ id: 'mL', html: 'mL' }, { id: 'L', html: 'L' }, { id: 'm3', html: 'm³' }], want,
            { why: function (row, got, w) { return { code: 'u4l2-best-unit', hint: rows.filter(function (x) { return x.id === row; })[0].html.replace(/^\(.\) /, '') + ' is ' + WHY[w] + '.' }; } },
            rows.map(function (x) { return x.html + ': ' + (want[x.id] === 'm3' ? 'm³' : want[x.id]); }).join('<br>'), ['mL for small amounts (a spoon, a can), L for jugs and tanks, m³ for huge amounts (a pool, a water tower).'], 'best unit');
        } }] },
      { num: '3', stem: function (sh) { return 'A juice box is a rectangular prism ' + N(sh.l) + ' cm long, ' + N(sh.w) + ' cm wide and ' + N(sh.h) + ' cm high.'; },
        shared: function (r) { return find(function () { var s = { l: r.pick([5, 6, 7]), w: r.pick([3.5, 4, 4.5]), h: r.pick([8, 9, 10, 10.5, 11, 12]) }; s.V = q(s.l * s.w * s.h); s.fits = r.chance(0.6); s.lab = s.fits ? Math.floor(s.V / 10) * 10 : Math.ceil(s.V / 10) * 10 + (s.V % 10 > 7 ? 10 : 0); return s; }, function (s) { return decs(s.V) <= 1 && s.V > 150 && s.V < 400 && s.lab !== s.V && s.l > s.w; }); },
        parts: [
          { id: '3a', level: 'BEG', outcome: 'M1', make: function (r, sh) { return num('(a) Find its volume in cm³.', sh.V, { after: 'cm³', cubic: true, bad: C.boxBad(sh.l, sh.w, sh.h), sol: C.boxSol(sh.l, sh.w, sh.h, 'cm'), hints: ['V = l × w × h.'], text: 'juice box volume' }); } },
          { id: '3b', level: 'BEG', outcome: 'M1', make: function (r, sh) { return num('(b) What is its capacity in mL?', sh.V, { after: 'mL', bad: [[sh.V / 1000, 'u4l2-unit-word', 'That’s in litres. 1 cm³ = 1 mL, so the number of mL is the number of cm³.'], [sh.V * 1000, 'u4k-wrong-way', '1 cm³ = 1 mL: the number stays the same.']], sol: t(N(sh.V) + uT('cm³') + '=' + N(sh.V) + uT('mL')), hints: ['1 cm³ = 1 mL.'], text: 'juice box mL' }); } },
          { id: '3c', level: 'BEG', outcome: 'M1', make: function (r, sh) { var d = q(Math.abs(sh.V - sh.lab));
            return P.mc(r, '(c) Can it hold ' + sh.lab + ' mL of juice?', [
              { html: 'Yes. It holds ' + N(sh.V) + ' mL, which is ' + N(d) + ' mL more than ' + sh.lab + ' mL.', right: sh.fits, why: sh.fits ? null : 'Compare: ' + N(sh.V) + ' mL is <b>less</b> than ' + sh.lab + ' mL.', code: 'yes' },
              { html: 'No. It holds only ' + N(sh.V) + ' mL, which is ' + N(d) + ' mL less than ' + sh.lab + ' mL.', right: !sh.fits, why: !sh.fits ? null : 'Compare: ' + N(sh.V) + ' mL is <b>more</b> than ' + sh.lab + ' mL.', code: 'no' },
              { html: 'You can’t tell: cm³ and mL measure different things.', why: '1 cm³ = 1 mL, so you can compare them directly.', code: 'cant' }],
              N(sh.V) + ' cm³ = ' + N(sh.V) + ' mL. ' + (sh.fits ? 'Yes, it can hold ' + sh.lab + ' mL (with ' + N(d) + ' mL to spare).' : 'No: it is ' + N(d) + ' mL short.'), ['Compare your capacity from (b) with ' + sh.lab + ' mL.'], 'juice box fits', true); } }] },
      { num: '4', stem: function (sh) { return 'A landscaper carries a box-shaped water tank in her truck to water new trees. Inside, the tank is ' + N(sh.l) + ' m long, ' + N(sh.w) + ' m wide and ' + N(sh.h) + ' m high.'; },
        shared: function (r) { return find(function () { var s = { l: r.pick([1, 1.2, 1.5, 1.6, 2]), w: r.pick([0.6, 0.75, 0.8, 1]), h: r.pick([0.4, 0.5, 0.6]), rate: r.pick([8, 10, 12, 15, 16, 20, 24]) }; s.V = q(s.l * s.w * s.h); s.L = q(s.V * 1000); s.min = s.L / s.rate; return s; }, function (s) { return Number.isInteger(q(s.min)) && s.min >= 15 && s.min <= 90 && decs(s.V) <= 3 && s.L % 1 === 0; }, { l: 1.2, w: 0.8, h: 0.5, rate: 12, V: 0.48, L: 480, min: 40 }); },
        parts: [
          { id: '4a', level: 'BEG', outcome: 'M1', make: function (r, sh) { return num('(a) Find the volume of the tank in m³.', sh.V, { after: 'm³', cubic: true, bad: C.boxBad(sh.l, sh.w, sh.h), sol: C.boxSol(sh.l, sh.w, sh.h, 'm'), hints: ['V = l × w × h.'], text: 'tank m3' }); } },
          { id: '4b', level: 'BEG', outcome: 'M1', make: function (r, sh) { return num('(b) How many litres does the tank hold?', sh.L, { after: 'L', bad: [[sh.V * 1000000, 'u4l2-m3-1e6', '1 000 000 gives cm³. 1 m³ = 1000 L.'], [sh.V * 100, 'u4l2-100', '1 m³ = 1000 L.'], [sh.V / 1000, 'u4k-wrong-way', 'A cubic metre holds 1000 L, so multiply by 1000.']], sol: t(N(sh.V) + '\\times 1000=' + N(sh.L) + uT('L')), hints: ['1 m³ = 1000 L.'], text: 'tank litres' }); } },
          { id: '4c', level: 'EMG', outcome: 'M1', make: function (r, sh) { return num('(c) Her pump uses ' + sh.rate + ' L of water per minute. How long does it take to empty a full tank?', sh.min, { after: 'minutes', bad: [[sh.L * sh.rate, 'u4k-wrong-way', 'Divide the litres in the tank by the litres used each minute.'], [sh.V / sh.rate, 'u4l2-no-convert', 'Use the capacity in <b>litres</b> from (b), since the pump rate is in litres.'], [sh.rate / sh.L, 'u4k-wrong-way', 'Minutes = litres ÷ litres per minute.']], sol: t(N(sh.L) + '\\div ' + sh.rate + '=' + N(sh.min)) + ' minutes', hints: ['Time = total litres ÷ litres per minute.'], text: 'pump time' }); } }] },
      { num: '5', stem: function (sh) { return 'A rain barrel is a cylinder with a diameter of ' + sh.d + ' cm and a height of ' + sh.h + ' cm.'; },
        shared: function (r) { return find(function () { var s = { d: r.pick([50, 52, 54, 56, 58, 60]), h: r.int(80, 95), can: r.pick([8, 9, 10, 12]), who: r.pick(['Joel', 'Mia', 'Ravi', 'Ana']) }; s.cm3 = C.cylV(s.d / 2, s.h); s.L = s.cm3 / 1000; return s; }, function (s) { var f = s.L / s.can % 1; return f > 0.1 && f < 0.9 && Math.abs(rd(s.L, 1) - s.L) > 0.004; }); },
        parts: [
          { id: '5a', level: 'PRG', outcome: 'M1', make: function (r, sh) { var rr = sh.d / 2;
            return num('(a) How many litres does the barrel hold? Round to the nearest tenth of a litre.', sh.L, { dp: 1, exact: sh.L, after: 'L',
              bad: [[sh.cm3, 'u4l2-no-1000', 'That’s in cm³ (= mL). Divide by 1000 for litres.'], [sh.cm3 * 1000, 'u4k-wrong-way', 'cm³ → L: divide by 1000.']].concat(C.cylBad(rr, sh.h, { d: true }).map(function (b) { return [b[0] / 1000, b[1], b[2], b[3]]; })),
              sol: [t('r=' + sh.d + '\\div 2=' + rr) + ' cm', t('V=\\pi\\times ' + rr + '^2\\times ' + sh.h + '=' + raw(sh.cm3, 1) + uT('cm³')), t(raw(sh.cm3, 1) + '\\div 1000' + eqR(sh.L, 1) + uT('L'))], hints: ['Find the volume in cm³ with ' + t('V=\\pi r^2h') + ' (radius = diameter ÷ 2).', 'cm³ = mL; divide by 1000 for litres.'], text: 'barrel litres' }); } },
          { id: '5b', level: 'EMG', outcome: 'M1', make: function (r, sh) { return fullCount('(b) ' + sh.who + ' fills ' + (sh.can === 8 ? 'an ' : 'a ') + sh.can + ' L watering can from the full barrel. How many full watering cans can ' + he(sh.who) + ' get?', sh.L, sh.can, { after: 'cans', totT: N(rd(sh.L, 2)), what: 'cans', text: 'watering cans' }); } }] },
      { num: '6', stem: 'Convert each US measurement.', parts: [
        { id: '6a', level: 'BEG', outcome: 'M2', make: function (r) { return lab(usQ(r, 'gal', 'qt', [3]), 'a'); } },
        { id: '6b', level: 'BEG', outcome: 'M2', make: function (r) { return lab(usQ(r, 'qt', 'pt'), 'b'); } },
        { id: '6c', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [10, 12, 20, 6, 4, 36, 28]); return lab(usPart(x + ' pt = ____ gal', x, 'pt', 'gal'), 'c'); } },
        { id: '6d', level: 'BEG', outcome: 'M2', make: function (r) { return lab(usQ(r, 'cup', 'floz'), 'd'); } },
        { id: '6e', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [64, 96, 48, 80, 160, 128]); return lab(usPart(x + ' fl oz = ____ qt', x, 'floz', 'qt'), 'e'); } },
        { id: '6f', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [2.5, 1.5, 3, 4, 0.5, 5]); return lab(usPart(N(x) + ' gal = ____ cups', x, 'gal', 'cup'), 'f'); } }] },
      { num: '7', stem: function (sh) { return 'At a hockey tournament in ' + sh.st + ', the team’s water cooler holds ' + sh.G + ' US gallons. Each player’s bottle holds ' + sh.b + ' US fl oz.'; },
        shared: function (r) { return find(function () { var s = { st: r.pick(['North Dakota', 'Montana', 'Minnesota', 'Idaho']), G: r.pick([3, 4, 5, 6]), b: r.pick([16, 20, 24, 32]), p: r.int(14, 20), k: r.pick([2, 3]) }; s.oz = s.G * 128; s.n = Math.floor(s.oz / s.b + 1e-9); s.need = s.p * s.k; return s; }, function (s) { return s.n >= 12 && s.n !== s.need && Math.abs(s.n - s.need) <= 12 && !(s.G === 3 && s.b === 12); }); },
        parts: [
          { id: '7a', level: 'EMG', outcome: 'M2', make: function (r, sh) { return fullCount('(a) How many bottles can be filled from a full cooler?', sh.oz, sh.b, { after: 'bottles', totT: N(sh.oz), what: 'bottles', pre: [t(sh.G + '\\times 128=' + sh.oz) + ' US fl oz'],
            bad: [[sh.G / sh.b, 'u4l2-no-convert', 'Change the gallons to fluid ounces first: 1 US gal = 128 fl oz.'], [Math.floor(sh.G * 160 / sh.b), 'u4l2-british', 'A <b>US</b> gallon is 128 US fl oz (160 is the British gallon).'], [Math.floor(sh.G * 8 / sh.b * 1e9) / 1e9, 'u4l2-chain', '1 US gal = 128 fl oz (4 qt × 2 pt × 2 cups × 8 fl oz).']], hints: ['1 US gal = 128 fl oz.', 'Fluid ounces in the cooler ÷ fluid ounces in a bottle.'], text: 'cooler bottles' }); } },
          { id: '7b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var ok2 = sh.n >= sh.need, d = Math.abs(sh.n - sh.need);
            return P.mc(r, '(b) The team has ' + sh.p + ' players, and each player fills a bottle ' + (sh.k === 2 ? 'twice' : 'three times') + ' in a game. Is one full cooler enough?', [
              { html: 'No. ' + t(sh.p + '\\times ' + sh.k + '=' + sh.need) + ' bottles are needed, but the cooler fills only ' + sh.n + ': it is ' + d + ' bottles short.', right: !ok2, why: !ok2 ? null : 'Compare ' + sh.need + ' bottles needed with the ' + sh.n + ' the cooler fills.', code: 'no' },
              { html: 'Yes. ' + t(sh.p + '\\times ' + sh.k + '=' + sh.need) + ' bottles are needed, and the cooler fills ' + sh.n + ', with ' + d + ' to spare.', right: ok2, why: ok2 ? null : 'Compare ' + sh.need + ' bottles needed with the ' + sh.n + ' the cooler fills.', code: 'yes' },
              { html: 'Yes. ' + sh.n + ' bottles is more than ' + sh.p + ' players.', why: 'Each player fills a bottle ' + (sh.k === 2 ? 'twice' : 'three times') + ': ' + sh.p + ' × ' + sh.k + ' bottles.', code: 'players' },
              { html: 'No. ' + sh.G + ' gallons is less than ' + sh.p + ' players.', why: 'Compare bottles with bottles: change the cooler to bottles (part a).', code: 'units' }],
              t(sh.p + '\\times ' + sh.k + '=' + sh.need) + ' bottles are needed; the cooler fills ' + sh.n + '. ' + (ok2 ? 'Yes, it is enough (' + d + ' to spare).' : 'No, it is ' + d + ' bottles short.'), ['How many bottles are needed in one game?'], 'cooler enough', true); } }] },
      { num: '8', stem: function (sh) { return 'Use 1 US gal ≈ 3.785 L and 1 British gal ≈ 4.546 L.'; },
        shared: function (r) { var x = pick(r, [2, 3, 4, 6, 7, 8, 9], [5]); return { x: x, us: x * 3.785, br: x * 4.546 }; },
        parts: [
          { id: '8a', level: 'EMG', outcome: 'M2', make: function (r, sh) { return fields('(a) How many litres are in ' + sh.x + ' US gallons? In ' + sh.x + ' British gallons? Round to the nearest hundredth.', [
            { label: sh.x + ' US gal:', name: 'US gallons', ans: sh.us, dp: 2, exact: sh.us, after: 'L', bad: [[sh.x / 3.785, 'u4k-wrong-way', 'Gallons → litres: multiply (a gallon is bigger than a litre).'], [sh.x * 4, 'u4l2-estimate', 'That’s an estimate. Multiply by 3.785.']] },
            { label: sh.x + ' British gal:', name: 'British gallons', ans: sh.br, dp: 2, exact: sh.br, after: 'L', bad: [[sh.x / 4.546, 'u4k-wrong-way', 'Gallons → litres: multiply.']] }],
            ['US: ' + t(sh.x + '\\times 3.785' + eqR(sh.us, 2) + uT('L')), 'British: ' + t(sh.x + '\\times 4.546' + eqR(sh.br, 2) + uT('L'))], ['US gal → L: × 3.785. British gal → L: × 4.546.'], 'US vs British L'); } },
          { id: '8b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var d = sh.br - sh.us, alt = rd(sh.br, 2) - rd(sh.us, 2);
            return num('(b) How many more litres are in ' + sh.x + ' British gallons than in ' + sh.x + ' US gallons? Round to the nearest hundredth.', d, { dp: 2, exact: d, alts: [alt], after: 'L', bad: [[sh.br + sh.us, 'u4l2-diff-sum', 'Subtract to find how many <b>more</b>.'], [4.546 - 3.785, 'u4l2-one-gal', 'That’s the difference for <b>one</b> gallon. Multiply by ' + sh.x + ' (or subtract your two answers).']],
              sol: t(N(q(sh.br)) + '-' + N(q(sh.us)) + eqR(d, 2) + uT('L')) + ' more', hints: ['British litres − US litres.'], text: 'US British diff' }); } },
          { id: '8c', level: 'BEG', outcome: 'M2', make: function (r) {
            var S = [['The ____ pint holds 20 fluid ounces.', 'br'], ['The ____ gallon is about 3.785 L.', 'us'], ['Gas stations in the United States sell gas by the ____ gallon.', 'us'], ['The ____ gallon is about 4.546 L.', 'br'], ['The ____ pint holds 16 fluid ounces.', 'us'],
              ['Old Canadian farm equipment made before metric is labelled in ____ gallons.', 'br'], ['The ____ fluid ounce is about 29.57 mL.', 'us'], ['The ____ gallon is also called the imperial gallon.', 'br'], ['The ____ gallon holds 128 fluid ounces.', 'us'], ['The ____ gallon is the bigger gallon.', 'br']];
            var ch = find(function () { return r.sample(S, 3); }, function (a) { var k = a.map(function (x) { return x[1]; }); return k.indexOf('us') >= 0 && k.indexOf('br') >= 0; }), want = {};
            var rows = ch.map(function (x, i) { want['s' + i] = x[1]; return { id: 's' + i, html: x[0] }; });
            return P.grid('(c) Finish each sentence with “US” or “British”.', rows, [{ id: 'us', html: 'US' }, { id: 'br', html: 'British' }], want, {},
              ch.map(function (x) { return x[0].replace('____', '<b>' + (x[1] === 'us' ? 'US' : 'British') + '</b>'); }).join('<br>'), ['The British (imperial) units are about 20% bigger than the US ones.'], 'US or British');
          } }] },
      { num: '9', stem: function (sh) { return sh.who + '’s grandfather farms near ' + sh.town + '. His old sprayer tank is labelled “' + sh.G + ' gallons”. It was made in Canada before metric, so these are British gallons.'; },
        shared: function (r) { var s = { who: r.pick(['Hannah', 'Logan', 'Priya', 'Cole']), town: r.pick(['Swift Current', 'Brooks', 'Lethbridge', 'Vegreville', 'Olds']), G: r.pick([100, 150, 200, 250, 300, 400, 500]) }; s.L = q(s.G * 4.546); s.us = s.L / 3.785; return s; },
        parts: [
          { id: '9a', level: 'EMG', outcome: 'M2', make: function (r, sh) { return num('(a) How many litres does the tank hold?', sh.L, { after: 'L', bad: [[sh.G * 3.785, 'u4l2-us', 'These are <b>British</b> gallons: 1 British gal ≈ 4.546 L.'], [sh.G / 4.546, 'u4k-wrong-way', 'Gallons → litres: multiply.']], sol: t(sh.G + '\\times 4.546=' + N(sh.L) + uT('L')), hints: ['British gal → L: × 4.546.'], text: 'sprayer litres' }); } },
          { id: '9b', level: 'PRG', outcome: 'M2', make: function (r, sh) { return num('(b) How many US gallons is that? Round to the nearest tenth.', sh.us, { dp: 1, exact: sh.us, after: 'US gal', bad: [[sh.L * 3.785, 'u4k-wrong-way', 'Litres → US gallons: divide by 3.785.'], [sh.G, 'u4l2-us', 'A US gallon is smaller than a British gallon, so the same tank holds <b>more</b> US gallons. Divide the litres by 3.785.'], [sh.L / 4.546, 'u4l2-british', 'Divide by the <b>US</b> gallon, 3.785 L.'], [sh.G * 3.785, 'u4l2-us', 'Use the litres from (a), then divide by 3.785.']], sol: t(N(sh.L) + '\\div 3.785' + eqR(sh.us, 1)) + ' US gallons', hints: ['L → US gal: ÷ 3.785.'], text: 'sprayer US gal' }); } },
          { id: '9c', level: 'EMG', outcome: 'M2', make: function (r, sh) { var u = rd(sh.us, 0);
            return P.mc(r, '(c) Why can the same tank be called “' + sh.G + ' gallons” and “' + u + ' gallons”?', [
              { html: 'A British gallon is bigger than a US gallon (about 4.5 L vs 3.8 L), so it takes more of the smaller US gallons to fill the same tank.', right: true },
              { html: 'A US gallon is bigger than a British gallon, so the number of US gallons is bigger.', why: 'If a US gallon were bigger, it would take <b>fewer</b> of them. Compare 3.785 L and 4.546 L.', code: 'us-bigger' },
              { html: 'The tank got bigger when it was measured again in the US.', why: 'The tank is the same size: only the unit changed.', code: 'bigger' },
              { html: 'One of the labels is a mistake: a gallon is a gallon.', why: 'There are two different gallons: US (3.785 L) and British (4.546 L).', code: 'mistake' }],
              'A British gallon (4.546 L) is bigger than a US gallon (3.785 L). It takes more of the smaller US gallons to fill the same tank.', ['Which gallon is bigger?'], 'two gallons');
          } }] },
      { num: '10', stem: 'Estimate, then convert. Round to the nearest hundredth (nearest tenth for mL).', parts: [
        { id: '10a', level: 'BEG', outcome: 'M2', make: function (r) { var x = pick(r, [6, 7, 8, 9, 12, 15, 20], [10]); return estConv('(a) ' + x + ' US gallons to litres', x, 'galL'); } },
        { id: '10b', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [30, 40, 45, 50, 55, 75, 80], [60]); return estConv('(b) ' + x + ' L to US gallons', x, 'Lgal'); } },
        { id: '10c', level: 'BEG', outcome: 'M2', make: function (r) { var x = pick(r, [8, 16, 20, 24, 32, 6], [12]); return estConv('(c) a ' + x + ' US fl oz bottle of pop to mL', x, 'ozml'); } },
        { id: '10d', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [1, 1.5, 2, 0.75, 1.25], []), mL = x * 1000; var p = estConv('(d) a ' + N(x) + ' L bottle of water to US fl oz (change to mL first)', mL, 'mloz'); p.solution = t(N(x) + uT('L') + '=' + N(mL) + uT('mL')) + '<br>' + p.solution; return p; } }] },
      { num: '11', stem: function (sh) { return sh.who + '’s car uses ' + N(sh.rate) + ' L of gas per 100 km. ' + C.cap(he(sh.who)) + ' plans a ' + sh.km + ' km trip in ' + sh.st + ', where gas costs ' + Mp(sh.pr) + ' USD per US gallon.'; },
        shared: function (r) { return find(function () { var s = { who: r.pick(['Diego', 'Kayla', 'Omar', 'Rosa']), rate: pickR(r, 6.4, 9.8, 0.2), km: r.int(16, 34) * 20, pr: r.int(305, 359) / 100, st: r.pick(['Idaho', 'Montana', 'Washington', 'Oregon']) }; s.L = q(s.km / 100 * s.rate); s.gal = s.L / 3.785; s.galR = rd(s.gal, 2); return s; }, function (s) { return decs(s.L) <= 2 && !(s.pr === 3.29); }); },
        parts: [
          { id: '11a', level: 'EMG', outcome: 'M1', make: function (r, sh) { return num('(a) How many litres of gas will the trip use?', sh.L, { after: 'L', bad: [[sh.km * sh.rate, 'u4l2-per100', 'The rate is per <b>100</b> km: ' + t(sh.km + '\\div 100=' + N(sh.km / 100)) + ' hundreds of km.'], [sh.km / sh.rate, 'u4k-wrong-way', 'Multiply the hundreds of km by the litres per 100 km.'], [sh.km / 100 / sh.rate, 'u4k-wrong-way', 'Multiply ' + N(sh.km / 100) + ' by ' + N(sh.rate) + '.']],
            sol: t(sh.km + '\\div 100=' + N(sh.km / 100)) + ' hundreds of km; ' + t(N(sh.km / 100) + '\\times ' + N(sh.rate) + '=' + N(sh.L) + uT('L')), hints: ['How many hundreds of km is the trip?', 'Multiply by the litres used per 100 km.'], text: 'trip litres' }); } },
          { id: '11b', level: 'EMG', outcome: 'M2', make: function (r, sh) { return num('(b) How many US gallons is that? Round to the nearest hundredth.', sh.gal, { dp: 2, exact: sh.gal, after: 'US gal', bad: [[sh.L * 3.785, 'u4k-wrong-way', 'Litres → US gallons: divide by 3.785 (a gallon is bigger than a litre).'], [sh.L / 4.546, 'u4l2-british', 'Gas in the US is sold by the <b>US</b> gallon: ÷ 3.785.']], sol: t(N(sh.L) + '\\div 3.785' + eqR(sh.gal, 2)) + ' US gal', hints: ['L → US gal: ÷ 3.785.'], text: 'trip gallons' }); } },
          { id: '11c', level: 'PRG', outcome: 'M2', make: function (r, sh) { var c1 = sh.galR * sh.pr, c2 = sh.gal * sh.pr;
            return num('(c) What will the gas cost, in US dollars?', c1, { money: true, exact: c1, alts: [c2], bad: [[sh.L * sh.pr, 'u4l2-no-convert', 'The price is per US <b>gallon</b>: use the gallons from (b), not the litres.'], [sh.galR / sh.pr, 'u4k-wrong-way', 'Cost = gallons × price per gallon.']], sol: t(N(sh.galR) + '\\times ' + M(sh.pr) + eqR(c1, 2).replace(/=/, '=\\$').replace(/\\approx /, '\\approx \\$')) + ' USD', hints: ['Cost = US gallons × price per gallon.'], text: 'trip cost' }); } }] },
      { num: '12', stem: function (sh) { return sh.who + ' is making muffins from an American recipe. Use 1 US cup ≈ 237 mL, 1 tbsp = 15 mL and 1 tsp = 5 mL. Round the cup amounts to the nearest millilitre.' + C.table(['Ingredient', 'mL'], sh.items.map(function (it) { return [it.show, '?']; })); },
        shared: function (r) {
          var milk = r.pick([1.25, 1.75, 2.25, 2.5, 2.75, 4 / 3, 5 / 3]), oil = r.pick([0.25, 1 / 3, 0.5, 2 / 3]), tb = r.int(1, 3), ts = r.pick([1, 3, 4]);
          var mn = r.pick(['milk', 'buttermilk']), on = r.pick(['oil', 'melted butter']), tn = r.pick(['maple syrup', 'honey']), sn = r.pick(['salt', 'baking soda', 'cinnamon']);
          var items = [{ name: mn, show: t(mixT(milk)) + ' US cups of ' + mn, cups: milk, ml: milk * 237, kind: 'cup' }, { name: on, show: t(mixT(oil)) + ' US cup of ' + on, cups: oil, ml: oil * 237, kind: 'cup' },
            { name: tn, show: tb + ' tbsp of ' + tn, n: tb, ml: tb * 15, kind: 'tbsp' }, { name: sn, show: ts + ' tsp of ' + sn, n: ts, ml: ts * 5, kind: 'tsp' }];
          return { who: r.pick(['Ellie', 'Marco', 'Jaya', 'Ben']), items: items, milk: milk };
        },
        parts: [
          { id: '12a', sub: 'a–d', level: 'EMG', outcome: 'M2', make: function (r, sh) {
            var rows = sh.items.map(function (it, i) {
              var bad = [];
              if (it.kind === 'cup') { bad.push([it.cups * 250, 'u4l2-metric-cup', 'This is an <b>American</b> recipe: 1 US cup ≈ 237 mL (250 mL is the metric cup).'], [it.cups * 8, 'u4l2-unit-word', 'That’s US fluid ounces. Use 1 US cup ≈ 237 mL.'], [237 / it.cups, 'u4k-wrong-way', 'Multiply the cups by 237.']);
                [0.33, 0.67, 0.66].forEach(function (d) { var w = Math.floor(it.cups) + d; if (Math.abs(it.cups - w) < 0.01) bad.push([w * 237, 'u4l2-third', 'Don’t round the fraction first: ' + t(mixT(it.cups) + '\\times 237') + ' (for thirds, use 237 ÷ 3).']); }); }
              if (it.kind === 'tbsp') bad.push([it.n * 5, 'u4l2-tsp-tbsp', 'tbsp is a <b>tablespoon</b> = 15 mL (a teaspoon is 5 mL).'], [it.n * 3, 'u4l2-tsp-tbsp', '1 tbsp = 15 mL.']);
              if (it.kind === 'tsp') bad.push([it.n * 15, 'u4l2-tsp-tbsp', 'tsp is a <b>teaspoon</b> = 5 mL (a tablespoon is 15 mL).']);
              return { label: '(' + 'abcd'[i] + ') ' + it.name + ':', name: it.name, ans: it.ml, dp: 0, exact: it.ml, after: 'mL', bad: bad };
            });
            var work = sh.items.map(function (it) { return it.kind === 'cup' ? t(mixT(it.cups) + '\\times 237' + eqR(it.ml, 0)) + ' mL' : t(it.n + '\\times ' + (it.kind === 'tbsp' ? 15 : 5) + '=' + it.ml) + ' mL'; });
            return fields('(a–d) Convert each amount to millilitres.', rows, sh.items.map(function (it, i) { return it.show + ': ' + work[i]; }), ['US cups × 237 mL. Change a fraction to a decimal (or divide by 3 for thirds).', 'tbsp × 15 mL, tsp × 5 mL.'], 'muffin table');
          } },
          { id: '12e', sub: 'e', level: 'PRG', outcome: 'M2', make: function (r, sh) { var m = sh.milk, ex = m * 250 - m * 237;
            return num('(e) If ' + sh.who + ' uses ' + (he(sh.who) === 'he' ? 'his' : 'her') + ' Canadian 250 mL cup for the ' + sh.items[0].name + ' (' + t(mixT(m)) + ' metric cups), how much extra is that? Round to the nearest millilitre.', ex, { dp: 0, exact: ex, after: 'mL',
              bad: [[m * 250, 'u4l2-diff-sum', 'That’s the amount with metric cups. Subtract the amount with US cups (from (a)).'], [13, 'u4l2-one-cup', 'That’s the extra for <b>one</b> cup. Multiply by ' + t(mixT(m)) + ' (or subtract the two amounts).'], [m * 250 + m * 237, 'u4l2-diff-sum', 'Subtract the two amounts.']],
              sol: ['Metric cups: ' + t(mixT(m) + '\\times 250' + eqR(m * 250, 2)) + ' mL; US cups: ' + t(mixT(m) + '\\times 237' + eqR(m * 237, 2)) + ' mL', t(nS(rd(m * 250, 2)) + '-' + nS(rd(m * 237, 2)) + eqR(ex, 0)) + ' mL extra'], hints: ['Find the amount with the 250 mL cup, then subtract the US amount from (a).'], text: 'metric cup extra' }); } }] },
      { num: '13', stem: function (sh) { return 'A coffee shop makes ' + sh.n + ' lattes each morning. Each latte uses ' + sh.oz + ' US fl oz of milk. Milk comes in ' + sh.jug + ' L jugs.'; },
        shared: function (r) { return find(function () { var s = { n: r.int(8, 18) * 5, oz: r.pick([6, 8, 10, 12]), jug: r.pick([2, 4]) }; s.tot = s.n * s.oz; s.mL = s.tot * 29.57; s.L = s.mL / 1000; s.jugs = Math.ceil(s.L / s.jug - 1e-9); return s; }, function (s) { var f = s.L / s.jug % 1; return f > 0.08 && f < 0.92 && s.jugs <= 12 && Math.abs(rd(s.L, 1) - s.L) > 0.004 && Math.ceil(rd(s.L, 1) / s.jug - 1e-9) === s.jugs; }); },
        parts: [
          { id: '13a', level: 'BEG', outcome: 'M2', make: function (r, sh) { return num('(a) How many US fl oz of milk are used each morning?', sh.tot, { after: 'US fl oz', bad: [[sh.n + sh.oz, 'u4k-added', 'Multiply: lattes × fl oz in each.']], sol: t(sh.n + '\\times ' + sh.oz + '=' + sh.tot) + ' US fl oz', hints: ['Lattes × fluid ounces per latte.'], text: 'latte oz' }); } },
          { id: '13b', level: 'EMG', outcome: 'M2', make: function (r, sh) { return num('(b) Change this amount to litres. Round to the nearest tenth.', sh.L, { dp: 1, exact: sh.L, after: 'L', bad: [[sh.mL, 'u4l2-no-1000', 'That’s in mL. Divide by 1000 for litres.'], [sh.tot / 29.57, 'u4k-wrong-way', 'fl oz → mL: multiply by 29.57.'], [sh.tot * 28.4 / 1000, 'u4l2-british', 'Use the <b>US</b> fluid ounce, 29.57 mL.'], [sh.tot * 29.57 / 100, 'u4l2-100', '1 L = 1000 mL.']],
            sol: t(N(sh.tot) + '\\times 29.57=' + N(q(sh.mL)) + uT('mL')) + '; ' + t(N(q(sh.mL)) + '\\div 1000' + eqR(sh.L, 1) + uT('L')), hints: ['US fl oz → mL: × 29.57.', 'mL → L: ÷ 1000.'], text: 'latte litres' }); } },
          { id: '13c', level: 'PRG', outcome: 'M2', make: function (r, sh) { var ex = sh.L / sh.jug;
            return num('(c) How many jugs must the shop open each morning?', sh.jugs, { after: 'jugs', bad: [[Math.floor(ex), 'u4l2-round-down', Math.floor(ex) + ' jugs are not enough milk. Round <b>up</b>.'], [rd(ex, 1), 'u4l2-round-down', 'Give a whole number of jugs, rounded <b>up</b>.'], [Math.ceil(sh.tot / sh.jug), 'u4l2-no-convert', 'Use the litres from (b): litres ÷ ' + sh.jug + ' L per jug.']],
              sol: t(N(rd(sh.L, 3)) + '\\div ' + sh.jug + eqR(ex, 1)) + '. ' + Math.floor(ex) + ' jugs are not enough, so the shop must open ' + sh.jugs + ' jugs (round up).', hints: ['Litres ÷ litres in a jug, then round <b>up</b>.'], text: 'latte jugs' }); } }] },
      { num: '14', stem: function (sh) { return 'A pet store sells an aquarium labelled “' + sh.G + ' gallons (US)”. Inside, it measures ' + sh.l + ' cm long, ' + sh.w + ' cm wide and ' + sh.h + ' cm high.'; },
        shared: function (r) { var fair = r.chance(0.7);
          return find(function () { var G = r.pick([10, 15, 20, 29, 40]), tgt = G * 3.785 * 1000 * (fair ? 1 + r.int(-3, 2) / 100 : 1 - r.int(10, 16) / 100), l = r.int(Math.round(Math.cbrt(tgt) * 1.3), Math.round(Math.cbrt(tgt) * 1.8)), w = r.int(25, 45), h = Math.round(tgt / (l * w));
            var s = { G: G, l: l, w: w, h: h, fair: fair }; s.L = q(l * w * h / 1000); s.gL = q(G * 3.785); s.dev = (s.gL - s.L) / s.gL; return s; },
            function (s) { return s.h > 20 && s.h < 60 && (s.fair ? Math.abs(s.dev) < 0.03 && Math.abs(s.dev) > 0.002 : s.dev > 0.09) && !(s.G === 20 && s.l === 61); }); },
        parts: [
          { id: '14a', level: 'EMG', outcome: 'M1', make: function (r, sh) { var cm3 = sh.l * sh.w * sh.h;
            return num('(a) Find its capacity in litres, to the nearest hundredth.', sh.L, { dp: 2, exact: sh.L, after: 'L', bad: [[cm3, 'u4l2-no-1000', 'That’s in cm³ (= mL). Divide by 1000 for litres.'], [cm3 / 100, 'u4l2-100', '1 L = 1000 cm³.']].concat(C.boxBad(sh.l, sh.w, sh.h).map(function (b) { return [b[0] / 1000, b[1], b[2]]; })),
              sol: t(sh.l + '\\times ' + sh.w + '\\times ' + sh.h + '=' + N(cm3) + uT('cm³')) + '; ' + t(N(cm3) + '\\div 1000=' + N(sh.L) + uT('L')), hints: ['Volume in cm³ (l × w × h), then ÷ 1000 for litres.'], text: 'aquarium L' }); } },
          { id: '14b', level: 'BEG', outcome: 'M2', make: function (r, sh) { return num('(b) How many litres are in ' + sh.G + ' US gallons?', sh.gL, { dp: 2, exactOk: true, after: 'L', bad: [[sh.G * 4.546, 'u4l2-british', 'The label says <b>US</b> gallons: × 3.785.'], [sh.G / 3.785, 'u4k-wrong-way', 'Gallons → litres: multiply.']], sol: t(sh.G + '\\times 3.785=' + N(sh.gL) + uT('L')), hints: ['US gal → L: × 3.785.'], text: 'label litres' }); } },
          { id: '14c', level: 'PRG', outcome: 'M2', make: function (r, sh) { var d = q(Math.abs(sh.gL - sh.L)), pc = rd(Math.abs(sh.dev) * 100, 1);
            return P.mc(r, '(c) Is the label fair?', [
              { html: 'Yes. The two amounts are close (about ' + N(rd(d, 2)) + ' L apart, ' + (pc < 1 ? 'less than 1%' : 'about ' + Math.round(pc) + '%') + '). Labels round to a whole number of gallons.', right: sh.fair, why: sh.fair ? null : 'Compare (a) and (b): the tank holds about ' + Math.round(pc) + '% less than the label says.', code: 'fair' },
              { html: 'No. The tank holds about ' + N(rd(d, 2)) + ' L less than ' + sh.G + ' US gallons (about ' + Math.round(pc) + '% less), which is too much to round away.', right: !sh.fair, why: !sh.fair ? null : 'Compare (a) and (b): a difference this small is fair rounding.', code: 'unfair' },
              { html: 'No. ' + N(sh.L) + ' is much more than ' + sh.G + ', so the tank is bigger than the label says.', why: 'Compare in the same unit: change the gallons to litres (part b).', code: 'units' },
              { html: 'Yes, but only if the label means British gallons.', why: sh.G + ' British gallons would be ' + N(q(sh.G * 4.546)) + ' L, far more than the tank holds.', code: 'british' }],
              'Tank: ' + N(sh.L) + ' L; label: ' + t(sh.G + '\\times 3.785=' + N(sh.gL)) + ' L. ' + (sh.fair ? 'They differ by about ' + N(rd(d, 2)) + ' L, so the label is fair.' : 'The tank holds ' + N(rd(d, 2)) + ' L less (about ' + Math.round(pc) + '%), so the label is not fair.'), ['Compare your answers to (a) and (b).'], 'label fair', true); } }] },
      { num: '15', parts: [
        { id: '15', level: 'EMG', outcome: 'M2', make: function (r) {
          var s = find(function () {
            var k = r.pick([1, 2]), opts = [{ html: k + ' US gallon' + (k > 1 ? 's' : ''), L: k * 3.785, why: 'In litres: ' + N(k * 3.785) + ' L.' }, { html: k + ' British gallon' + (k > 1 ? 's' : ''), L: k * 4.546, why: 'In litres: ' + N(q(k * 4.546)) + ' L.' }];
            var Lv = q(k * r.pick([3.9, 4, 4.2, 4.4, 4.6])); opts.push({ html: N(Lv) + ' L', L: Lv, why: N(Lv) + ' L.' });
            var pt = k * r.pick([8.5, 9, 9.5]), useQt = r.chance(0.3); if (useQt) { var qt = k * 4.5; opts.push({ html: N(qt) + ' US quarts', L: qt * 0.946, why: 'In litres: ' + t(N(qt) + '\\times 0.946\\approx ' + N(rd(qt * 0.946, 2))) + ' L.' }); }
            else opts.push({ html: N(pt) + ' US pints', L: pt * 0.473, why: 'In litres: ' + t(N(pt) + '\\times 473') + ' mL ≈ ' + N(rd(pt * 0.473, 2)) + ' L.' });
            return opts; },
            function (o) { var a = o.map(function (x) { return x.L; }).sort(function (x, y) { return y - x; }); return a[0] - a[1] >= 0.1 && a[1] - a[2] >= 0.03; });
          var mx = s.reduce(function (b, x, i) { return x.L > s[b].L ? i : b; }, 0);
          return P.mc(r, 'Which container holds the most?', s.map(function (x, i) { return { html: x.html, right: i === mx, why: i === mx ? null : x.why + ' Change each one to litres and compare.', code: 'o' + i }; }),
            'In litres: ' + s.map(function (x) { return / L$/.test(x.html) ? x.html : x.html + ' ≈ ' + N(rd(x.L, 2)) + ' L'; }).join('; ') + '.<br>The most is <b>' + s[mx].html + '</b>.', ['Change each one to litres: US gal × 3.785, British gal × 4.546, US pint ≈ 473 mL, US quart ≈ 946 mL.'], 'holds most');
        } }] },
      { num: '16', parts: [
        { id: '16', level: 'EMG', outcome: 'M2', make: function (r) {
          var s = find(function () { return { x: r.pick([750, 946, 1000, 1500, 2000, 355, 650]), what: r.pick(['bottle of salad dressing', 'bottle of olive oil', 'carton of juice', 'bottle of shampoo']) }; }, function (s) { return rd(s.x / 29.57, 1) !== rd(s.x / 28.4, 1); }), x = s.x;
          var opts = [{ html: Np(Math.round(x * 29.57)) + ' fl oz', why: 'That multiplies. mL → fl oz: divide (a fluid ounce is about 30 mL).', code: 'mult' }, { html: N(rd(x / 29.57, 1), 1) + ' fl oz', right: true },
            { html: N(rd(x / 28.4, 1), 1) + ' fl oz', why: 'That uses the <b>British</b> fluid ounce (28.4 mL). Use 29.57 mL.', code: 'brit' }, { html: N(rd(x / 250, 1), 1) + ' fl oz', why: 'That’s ' + t(x + '\\div 250') + ', the number of metric cups.', code: 'cups' }];
          return P.mc(r, 'A ' + s.what + ' holds ' + x + ' mL. About how many US fluid ounces is that? (1 US fl oz ≈ 29.57 mL)', opts,
            t(x + '\\div 29.57' + eqR(x / 29.57, 1)) + ' US fl oz.', ['mL → US fl oz: divide by 29.57.'], 'mL to oz mc', true);
        } }] },
      { num: '17', parts: [
        { id: '17', level: 'EMG', outcome: 'M1', make: function (r) {
          var s = find(function () { return { l: r.int(35, 60), w: r.int(24, 34), h: r.int(25, 35), what: r.pick(['picnic cooler', 'storage bin', 'fish tank']) }; }, function (s) { var L = s.l * s.w * s.h / 1000; return nS(rd(L, 1)).length <= 4 && !(s.l === 60 && s.w === 30 && s.h === 40) && Math.abs(rd(L, 1) - L) > 0.004 || decs(L) <= 1 && nS(L).length <= 4; }), cm3 = s.l * s.w * s.h, L = cm3 / 1000;
          return num('<b>Numerical response.</b> A box-shaped ' + s.what + ' is ' + s.l + ' cm long, ' + s.w + ' cm wide and ' + s.h + ' cm high inside. Its capacity, in litres to the nearest tenth, is ____ L.', L, { dp: 1, exact: L, nr: true, bad: [[cm3 / 100, 'u4l2-100', '1 L = 1000 cm³.']],
            sol: t(s.l + '\\times ' + s.w + '\\times ' + s.h + '=' + N(cm3) + uT('cm³')) + '; ' + t(N(cm3) + '\\div 1000' + eqR(L, 1) + uT('L')), hints: ['Volume in cm³, then ÷ 1000.'], text: 'NR cooler' });
        } }] },
      { num: '18', parts: [
        { id: '18', level: 'BEG', outcome: 'M2', make: function (r) {
          var G = find(function () { return r.int(5, 25); }, function (g) { return nS(rd(g * 3.785, 1)).length <= 4 && g !== 10; }), L = G * 3.785;
          return num('<b>Numerical response.</b> A farmer buys ' + G + ' US gallons of ' + r.pick(['hydraulic oil', 'motor oil', 'windshield washer fluid', 'antifreeze']) + '. In litres, to the nearest tenth, this is ____ L.', L, { dp: 1, exact: L, nr: true, bad: [[G * 4.546, 'u4l2-british', 'These are <b>US</b> gallons: × 3.785.']],
            sol: t(G + '\\times 3.785' + eqR(L, 1) + uT('L')), hints: ['US gal → L: × 3.785.'], text: 'NR oil' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Convert each measurement.', parts: [
        { id: 'e1a', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.Lml(pick(r, [0.6, 0.4, 1.8, 3.75, 0.25], [2.5])), 'a'); } },
        { id: 'e1b', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.mlL(pick(r, [2750, 1250, 350, 4500, 80], [750])), 'b'); } },
        { id: 'e1c', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.cm3ml(pick(r, [85, 125, 600, 1500, 45], [340])), 'c'); } },
        { id: 'e1d', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.m3L(pick(r, [3.4, 0.5, 1.75, 5, 2.2], [2.6])), 'd'); } },
        { id: 'e1e', level: 'BEG', outcome: 'M1', make: function (r) { return lab(SI.Lm3(pick(r, [250, 500, 1200, 3400, 80], [1800])), 'e'); } }] },
      { num: '2', stem: 'Convert each US measurement.', parts: [
        { id: 'e2a', level: 'BEG', outcome: 'M2', make: function (r) { return lab(usQ(r, 'gal', 'qt', [3]), 'a'); } },
        { id: 'e2b', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [12, 8, 20, 6, 10, 16]); return lab(usPart(x + ' cups = ____ qt', x, 'cup', 'qt'), 'b'); } },
        { id: 'e2c', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [3, 2, 4, 5, 1.5]); return lab(usPart(N(x) + ' pt = ____ fl oz', x, 'pt', 'floz'), 'c'); } },
        { id: 'e2d', level: 'BEG', outcome: 'M2', make: function (r) { var x = pick(r, [1.5, 2, 3, 2.5, 5]); return lab(usPart(N(x) + ' qt = ____ cups', x, 'qt', 'cup'), 'd'); } }] },
      { num: '3', stem: function (sh) { return 'A milk carton is a rectangular prism ' + N(sh.a) + ' cm by ' + N(sh.a) + ' cm by ' + N(sh.h) + ' cm.'; },
        shared: function (r) { return find(function () { var s = { a: r.pick([6.5, 7, 7.5]), h: pickR(r, 16.5, 22, 0.5) }; s.V = q(s.a * s.a * s.h); return s; }, function (s) { return Math.abs(s.V - 946) > 3 && Math.abs(s.V - 946) < 80 && decs(s.V) <= 3; }); },
        parts: [
          { id: 'e3a', level: 'EMG', outcome: 'M1', make: function (r, sh) { return num('(a) Find its capacity in mL.', sh.V, { after: 'mL', bad: C.boxBad(sh.a, sh.a, sh.h).concat([[sh.V / 1000, 'u4l2-unit-word', 'That’s in litres. 1 cm³ = 1 mL.']]), sol: C.boxSol(sh.a, sh.a, sh.h, 'cm') + ' ' + t('=' + N(sh.V) + uT('mL')), hints: ['V = l × w × h in cm³, and 1 cm³ = 1 mL.'], text: 'E carton' }); } },
          { id: 'e3b', level: 'EMG', outcome: 'M1', make: function (r, sh) { var ok2 = sh.V >= 946, d = q(Math.abs(sh.V - 946));
            return P.mc(r, '(b) Is it big enough to hold 946 mL (one US quart) of milk?', [
              { html: 'Yes. ' + N(sh.V) + ' mL is more than 946 mL, with ' + N(d) + ' mL of room at the top.', right: ok2, why: ok2 ? null : 'Compare: ' + N(sh.V) + ' mL is <b>less</b> than 946 mL.', code: 'yes' },
              { html: 'No. ' + N(sh.V) + ' mL is less than 946 mL, so it is ' + N(d) + ' mL too small.', right: !ok2, why: !ok2 ? null : 'Compare: ' + N(sh.V) + ' mL is <b>more</b> than 946 mL.', code: 'no' },
              { html: 'You can’t tell: a quart is an imperial unit.', why: 'The quart is given in mL (946 mL), so you can compare.', code: 'cant' }],
              N(sh.V) + ' cm³ = ' + N(sh.V) + ' mL. ' + (ok2 ? 'Yes, it holds a US quart with ' + N(d) + ' mL to spare.' : 'No, it is ' + N(d) + ' mL too small.'), ['Compare your capacity from (a) with 946 mL.'], 'E carton quart', true); } }] },
      { num: '4', parts: [
        { id: 'e4', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [4, 6, 8, 12, 2.5], [5]), us = x * 3.785, br = x * 4.546;
          return fields('How many litres are in ' + N(x) + ' US gallons? In ' + N(x) + ' British gallons? Round to the nearest hundredth.', [
            { label: 'US:', name: 'US gallons', ans: us, dp: 2, exact: us, after: 'L', bad: [[x / 3.785, 'u4k-wrong-way', 'Gallons → litres: multiply.']] }, { label: 'British:', name: 'British gallons', ans: br, dp: 2, exact: br, after: 'L', bad: [[x / 4.546, 'u4k-wrong-way', 'Gallons → litres: multiply.']] }],
            ['US: ' + t(N(x) + '\\times 3.785' + eqR(us, 2) + uT('L')), 'British: ' + t(N(x) + '\\times 4.546' + eqR(br, 2) + uT('L'))], ['US × 3.785; British × 4.546.'], 'E US British'); } }] },
      { num: '5', stem: 'Estimate, then convert. Round to the nearest hundredth (nearest tenth for mL).', parts: [
        { id: 'e5a', level: 'BEG', outcome: 'M2', make: function (r) { var x = pick(r, [3, 4, 6, 11], [10]); return estConv('(a) ' + x + ' US gal to litres', x, 'galL'); } },
        { id: 'e5b', level: 'EMG', outcome: 'M2', make: function (r) { var x = pick(r, [2, 3, 4, 1.75], []); var p = estConv('(b) a ' + N(x) + ' L bottle to US fl oz', x * 1000, 'mloz'); p.solution = t(N(x) + uT('L') + '=' + N(x * 1000) + uT('mL')) + '<br>' + p.solution; return p; } },
        { id: 'e5c', level: 'BEG', outcome: 'M2', make: function (r) { var x = pick(r, [16, 10, 64, 40], [12]); return estConv('(c) ' + x + ' US fl oz to mL', x, 'ozml'); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A round hot tub has an inside diameter of ' + N(sh.d) + ' m. It is filled with water to a depth of ' + N(sh.h) + ' m.'; },
        shared: function (r) { return find(function () { var s = { d: r.pick([1.8, 2, 2.2, 2.4]), h: r.pick([0.7, 0.8, 0.9, 1]), rate: r.pick([15, 20, 25, 30]) }; s.L = C.cylV(s.d / 2, s.h) * 1000; s.Lr = rd(s.L, 0); s.min = Math.round(s.Lr / s.rate); return s; }, function (s) { return !(s.d === 2.4 && s.h === 0.6) && s.min > 60 && s.min % 60 !== 0 && Math.abs(s.Lr / s.rate - Math.round(s.Lr / s.rate)) < 0.45; }); },
        parts: [
          { id: 'e6a', level: 'PRG', outcome: 'M1', make: function (r, sh) { var rr = sh.d / 2, m3 = sh.L / 1000;
            return num('(a) How many litres of water are in the hot tub? Round to the nearest litre.', sh.L, { dp: 0, exact: sh.L, after: 'L', bad: [[m3, 'u4l2-no-1000', 'That’s in m³. 1 m³ = 1000 L: multiply by 1000.'], [m3 * 1000000, 'u4l2-m3-1e6', '1 m³ = 1000 L (1 000 000 is for cm³).']].concat(C.cylBad(rr, sh.h, { d: true }).map(function (b) { return [b[0] * 1000, b[1], b[2], b[3]]; })),
              sol: [t('r=' + N(sh.d) + '\\div 2=' + N(rr)) + ' m; ' + t('V=\\pi\\times ' + N(rr) + '^2\\times ' + N(sh.h) + '=' + raw(m3, 4) + uT('m³')), t(raw(m3, 4) + '\\times 1000' + eqR(sh.L, 0) + uT('L'))], hints: [t('V=\\pi r^2h') + ' in m³ (radius = diameter ÷ 2).', 'm³ → L: × 1000.'], text: 'E hot tub L' }); } },
          { id: 'e6b', level: 'EMG', outcome: 'M1', make: function (r, sh) { var h = Math.floor(sh.min / 60), m = sh.min % 60;
            var p = fields('(b) A garden hose fills it at ' + sh.rate + ' L per minute. About how long does it take to fill, in hours and minutes?', [{ label: 'Time:', name: 'Hours', ans: h, after: 'h', bad: [[sh.min, 'u4l2-minutes', 'That’s the time in minutes. Change it to hours and minutes (60 min = 1 h).'], [rd(sh.min / 60, 2), 'u4l2-minutes', 'Write the whole hours here, and the minutes left over in the next box.']] }, { label: '', name: 'Minutes', ans: m, after: 'min', bad: [[sh.min, 'u4l2-minutes', 'Take away the full hours: ' + t(sh.min + '-' + 60 * h + '=' + m) + ' min.']] }],
              [t(N(sh.Lr) + '\\div ' + sh.rate + '\\approx ' + sh.min) + ' minutes', t(sh.min + '=' + 60 * h + '+' + m) + ', so about ' + h + ' h ' + m + ' min.'], ['Minutes = litres ÷ litres per minute.', 'Every 60 minutes is 1 hour.'], 'E fill time');
            var cks = p.check; p.check = function (resp) { var a = C.readNum(resp && resp[0]), b = C.readNum(resp && resp[1]); if (!a.res && !b.res && b.v >= 0 && b.v < 60 && Math.abs(a.v * 60 + b.v - sh.min) === 1) return K.ok(); return cks(resp); }; return p; } }] },
      { num: '7', stem: function (sh) { return 'Chainsaw fuel is gas mixed with 2-stroke oil in the ratio ' + t(sh.k + ':1') + '. ' + sh.who + ' is mixing ' + N(sh.G) + ' US gallon' + (sh.G === 1 ? '' : 's') + ' of gas.'; },
        shared: function (r) { return { k: r.pick([40, 50]), G: r.pick([1, 2, 0.5]), who: r.pick(['Owen', 'Kayla', 'Theo', 'Noor']) }; },
        parts: [
          { id: 'e7a', level: 'EMG', outcome: 'M2', make: function (r, sh) { var oz = sh.G * 128 / sh.k;
            return num('(a) How many US fl oz of oil ' + (he(sh.who) === 'he' ? 'does he' : 'does she') + ' need?', oz, { dp: 2, exactOk: true, after: 'US fl oz', bad: [[sh.G / sh.k, 'u4l2-no-convert', 'Change the gas to fluid ounces first: 1 US gal = 128 fl oz.'], [sh.G * 128 * sh.k, 'u4k-wrong-way', 'There is 1 part oil for every ' + sh.k + ' parts gas: divide by ' + sh.k + '.'], [sh.G * 160 / sh.k, 'u4l2-british', '1 US gal = 128 US fl oz.']],
              sol: t(N(sh.G) + '\\times 128=' + N(sh.G * 128)) + ' fl oz; ' + t(N(sh.G * 128) + '\\div ' + sh.k + '=' + N(oz)) + ' US fl oz', hints: ['1 US gal = 128 fl oz.', 'Oil = gas ÷ ' + sh.k + '.'], text: 'E oil oz' }); } },
          { id: 'e7b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var oz = sh.G * 128 / sh.k, mL = oz * 29.57;
            return num('(b) ' + (he(sh.who) === 'he' ? 'His' : 'Her') + ' measuring cup is in millilitres. How many mL of oil is that, to the nearest tenth?', mL, { dp: 1, exact: mL, after: 'mL', bad: [[oz / 29.57, 'u4k-wrong-way', 'fl oz → mL: multiply by 29.57.'], [oz * 28.4, 'u4l2-british', 'Use the <b>US</b> fluid ounce: 29.57 mL.']], sol: t(N(oz) + '\\times 29.57' + eqR(mL, 1) + uT('mL')), hints: ['US fl oz → mL: × 29.57.'], text: 'E oil mL' }); } }] },
      { num: '8', parts: [
        { id: 'e8', level: 'PRG', outcome: 'M2', make: function (r) { var L = find(function () { return r.pick([2, 2.5, 3, 4, 5, 6]); }, function (x) { var f = x * 1000 / 237 % 1; return f > 0.1 && f < 0.95; }), what = r.pick(['punch', 'lemonade', 'iced tea', 'hot chocolate']);
          return fullCount('A ' + what + ' recipe makes ' + N(L) + ' L. How many full 1-cup servings (US cups, 237 mL each) can be poured?', L * 1000, 237, { after: 'servings', pre: [t(N(L) + uT('L') + '=' + N(L * 1000) + uT('mL'))], totT: N(L * 1000), what: 'servings', bad: [[Math.floor(L * 1000 / 250), 'u4l2-metric-cup', 'These are <b>US</b> cups: 237 mL each.'], [L / 237, 'u4l2-no-convert', 'Change the litres to millilitres first.']], text: 'E servings' }); } }] },
      { num: '9', stem: function (sh) { return 'A British car magazine says a car’s gas tank holds ' + sh.b + ' gallons. An American magazine says the same car’s tank holds ' + N(sh.u) + ' gallons.'; },
        shared: function (r) { var b = r.int(10, 16); return { b: b, u: rd(b * 4.546 / 3.785, 1) }; },
        parts: [
          { id: 'e9a', level: 'PRG', outcome: 'M2', make: function (r, sh) { var L1 = sh.b * 4.546, L2 = sh.u * 3.785;
            return fields('(a) Change both to litres. Round to the nearest hundredth.', [{ label: 'British magazine:', name: 'British', ans: L1, dp: 2, exact: L1, after: 'L', bad: [[sh.b * 3.785, 'u4l2-us', 'The British magazine uses <b>British</b> gallons: × 4.546.']] }, { label: 'American magazine:', name: 'American', ans: L2, dp: 2, exact: L2, after: 'L', bad: [[sh.u * 4.546, 'u4l2-british', 'The American magazine uses <b>US</b> gallons: × 3.785.']] }],
              ['British: ' + t(sh.b + '\\times 4.546' + eqR(L1, 2) + uT('L')), 'US: ' + t(N(sh.u) + '\\times 3.785' + eqR(L2, 2) + uT('L'))], ['Each magazine uses its own country’s gallon.'], 'E magazines L'); } },
          { id: 'e9b', level: 'EMG', outcome: 'M2', make: function (r, sh) {
            return P.mc(r, '(b) Can both magazines be right?', [
              { html: 'Yes. Both are about ' + N(rd(sh.b * 4.546, 1)) + ' L: the British magazine uses British gallons and the American one uses US gallons.', right: true },
              { html: 'No. A car can’t have two different tank sizes.', why: 'Change both to litres: they are the same amount in two different gallons.', code: 'no' },
              { html: 'No. The American number is bigger, so it must be wrong.', why: 'The US gallon is smaller, so it takes <b>more</b> of them. Compare in litres.', code: 'bigger' },
              { html: 'Yes, because a gallon is the same size everywhere.', why: 'The two gallons are different: 4.546 L (British) and 3.785 L (US).', code: 'same' }],
              'In litres both are about ' + N(rd(sh.b * 4.546, 1)) + ' L, so both are right: one uses British gallons, the other US gallons.', ['Compare your two answers from (a).'], 'E magazines'); } }] },
      { num: '10', parts: [
        { id: 'e10', level: 'EMG', outcome: 'M2', make: function (r) {
          var T = [['4 qt'], ['8 pt'], ['16 cups'], ['128 fl oz'], ['about 3.785 L']], Fz = [['160 fl oz', 'That’s a <b>British</b> gallon (8 British pints × 20 fl oz). A US gallon is 128 fl oz.'], ['about 4.546 L', 'That’s a <b>British</b> gallon. A US gallon is about 3.785 L.'], ['10 pt', '1 US gallon = 8 pints.'], ['12 cups', '1 US gallon = 16 cups (4 qt × 4 cups).'], ['2 qt', '1 US gallon = 4 quarts.']];
          var tr = r.sample(T, 3), fz = r.pick(Fz);
          var opts = tr.map(function (x) { return { html: x[0], why: 'That one <b>is</b> equal to 1 US gallon. The question asks for the one that is not.', code: 'true' }; }).concat([{ html: fz[0], right: true }]);
          return P.mc(r, 'Which of these is <b>not</b> equal to 1 US gallon?', opts, fz[0] + ' is not equal to 1 US gallon. ' + fz[1].replace(/That’s a/, 'It is a'), ['1 US gal = 4 qt = 8 pt = 16 cups = 128 fl oz ≈ 3.785 L.'], 'E not a gallon');
        } }] },
      { num: '11', parts: [
        { id: 'e11', level: 'EMG', outcome: 'M2', make: function (r) { var c = pick(r, [1.75, 1.25, 2.25, 2.5, 0.75, 4 / 3]), what = r.pick(['broth', 'milk', 'water', 'tomato sauce']), mL = c * 237;
          return num('<b>Numerical response.</b> A soup recipe needs ' + t(mixT(c)) + ' US cups of ' + what + ' (1 US cup ≈ 237 mL). To the nearest millilitre, this is ____ mL.', mL, { dp: 0, exact: mL, nr: true, bad: [[c * 250, 'u4l2-metric-cup', 'Use the US cup: 237 mL.']], sol: t(N(rd(c, 4)) + '\\times 237' + eqR(mL, 0) + uT('mL')).replace(N(rd(c, 4)), mixT(c)), hints: ['US cups × 237.'], text: 'E NR broth' }); } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'An American website says a car gets ' + sh.mpg + ' miles per US gallon (' + sh.mpg + ' mpg). Use 1 mi ≈ 1.609 km.'; },
        shared: function (r) { var s = { mpg: r.int(24, 45) }; s.km = q(s.mpg * 1.609); s.L100 = 3.785 / s.km * 100; return s; },
        parts: [
          { id: 'e12a', level: 'EMG', outcome: 'M2', make: function (r, sh) { return num('(a) How many kilometres does the car go on one US gallon?', sh.km, { dp: 2, exactOk: true, after: 'km', bad: [[sh.mpg / 1.609, 'u4k-wrong-way', 'A mile is longer than a kilometre, so there are more km: multiply by 1.609.']], sol: t(sh.mpg + '\\times 1.609=' + N(sh.km)) + ' km', hints: ['mi → km: × 1.609.'], text: 'E mpg km' }); } },
          { id: 'e12b', level: 'MAS', outcome: 'M2', make: function (r, sh) { return num('(b) Find its fuel use in L/100 km (the Canadian way). Round to the nearest tenth.', sh.L100, { dp: 1, exact: sh.L100, after: 'L/100 km', bad: [[sh.km / 3.785, 'u4k-wrong-way', 'That’s km per litre. Find litres per 100 km: ' + t('3.785\\div ' + N(sh.km) + '\\times 100') + '.'], [3.785 / sh.km, 'u4l2-per100', 'That’s litres per <b>1</b> km. Multiply by 100.'], [4.546 / sh.km * 100, 'u4l2-british', 'It is a <b>US</b> gallon: 3.785 L.'], [3.785 / sh.mpg * 100, 'u4l2-no-convert', 'Use kilometres (from (a)), not miles.'], [100 / sh.km, 'u4l2-no-convert', 'The car uses 3.785 L (one gallon) for ' + N(sh.km) + ' km.']],
            sol: ['It uses 3.785 L for ' + N(sh.km) + ' km.', t('3.785\\div ' + N(sh.km) + '\\times 100' + eqR(sh.L100, 1)) + ' L/100 km'], hints: ['One US gallon (3.785 L) takes the car ' + N(sh.km) + ' km.', 'Litres per 100 km = litres ÷ km × 100.'], text: 'E L/100km' }); } },
          { id: 'e12c', level: 'PRG', outcome: 'M2', make: function (r, sh) { var bm = Math.round(sh.mpg * 4.546 / 3.785);
            return P.mc(r, '(c) A British website lists the same car at about ' + bm + ' miles per gallon. Why is the number bigger?', [
              { html: 'A British gallon holds more gas (4.546 L, not 3.785 L), so the car goes farther on one British gallon.', right: true },
              { html: 'British cars are more fuel-efficient.', why: 'It is the same car. Only the gallon is different.', code: 'car' },
              { html: 'A British mile is longer than an American mile.', why: 'A mile is the same in both countries. The <b>gallon</b> is different.', code: 'mile' },
              { html: 'The British website made a mistake.', why: 'Check: ' + t(sh.mpg + '\\times 4.546\\div 3.785\\approx ' + bm) + '.', code: 'mistake' }],
              'A British gallon holds more (4.546 L vs 3.785 L), so the car goes farther on it: ' + t(sh.mpg + '\\times 4.546\\div 3.785\\approx ' + bm) + ' mi.', ['Which gallon is bigger?'], 'E British mpg'); } }] },
      { num: '13', parts: [
        { id: 'e13', level: 'MAS', outcome: 'M2', make: function (r) {
          var s = find(function () { var s = { l: r.pick([2, 2.4, 2.5, 3]), w: r.pick([0.5, 0.6, 0.8]), d: r.pick([0.4, 0.5, 0.6]), g: r.pick([10, 12, 14, 15]) }; s.L = q(s.l * s.w * s.d * 1000); s.cow = q(s.g * 3.785); s.ex = s.L / s.cow; s.n = Math.floor(s.ex + 1e-9); return s; }, function (s) { var f = s.ex % 1; return f > 0.1 && f < 0.95 && s.n >= 6 && decs(s.L) === 0; });
          return num('A water trough for cattle is a rectangular prism ' + N(s.l) + ' m long, ' + N(s.w) + ' m wide and ' + N(s.d) + ' m deep inside. A cow drinks about ' + s.g + ' US gallons of water a day. How many cows can one full trough water for a day?', s.n, { after: 'cows',
            bad: [[Math.ceil(s.ex - 1e-9), 'u4l2-round-up', Math.ceil(s.ex) + ' cows would need more water than the trough holds. Round <b>down</b>.'], [rd(s.ex, 1), 'u4l2-round-up', 'Give a whole number of cows (round down).'], [Math.floor(s.L / (s.g * 4.546)), 'u4l2-british', 'Use the <b>US</b> gallon: 3.785 L.'], [Math.floor(s.l * s.w * s.d / s.cow * 1e6) / 1e6, 'u4l2-no-1000', 'Change the trough’s m³ to litres first (× 1000).'], [Math.floor(s.L / s.g), 'u4l2-no-convert', 'Change the cow’s gallons to litres first (× 3.785).']],
            sol: ['Trough: ' + t(N(s.l) + '\\times ' + N(s.w) + '\\times ' + N(s.d) + '=' + N(q(s.L / 1000)) + uT('m³') + '=' + N(s.L) + uT('L')), 'One cow: ' + t(s.g + '\\times 3.785=' + N(s.cow)) + ' L per day', t(N(s.L) + '\\div ' + N(s.cow) + eqR(s.ex, 1)) + ', so one full trough waters ' + s.n + ' cows for a day (round down: ' + (s.n + 1) + ' cows would need more than ' + N(s.L) + ' L).'],
            hints: ['Find the trough’s capacity in litres (m³ × 1000).', 'Change one cow’s water to litres (US gal × 3.785).', 'Divide, then round down.'], text: 'E cows' });
        } }] },
      { num: '14', stem: 'Paint in Canada is sold in 3.78 L cans and 946 mL cans.', parts: [
        { id: 'e14a', level: 'EMG', outcome: 'M2', make: function (r) { return num('(a) A 3.78 L can is about 1 US gallon (1 US gal ≈ 3.785 L). A US quart is ' + t('\\tfrac{1}{4}') + ' of a US gallon. How many millilitres is 1 US quart, to the nearest millilitre?', 946.25, { dp: 0, exact: 946.25, after: 'mL', bad: [[3.785 / 4, 'u4l2-ml-not-l', 'That’s in litres. Change 3.785 L to 3785 mL first.'], [3785 / 2, 'u4l2-chain', '1 gal = <b>4</b> quarts: divide by 4.'], [3785 * 4, 'u4k-wrong-way', 'A quart is smaller than a gallon: divide by 4.']], sol: t('3.785\\text{ L}=3785\\text{ mL}') + '; ' + t('3785\\div 4=946.25\\approx 946') + ' mL, so a 946 mL can is about 1 US quart.', hints: ['Change 3.785 L to mL, then divide by 4.'], text: 'E quart mL' }); } },
        { id: 'e14b', level: 'EMG', outcome: 'M2', make: function (r) {
          return P.mc(r, '(b) Why might a paint company use these sizes?', [
            { html: 'The same cans can be sold in the US (labelled 1 gallon and 1 quart) and in Canada (labelled in litres).', right: true },
            { html: 'Litres and gallons are exactly the same size.', why: '1 US gallon is about 3.785 L, not 1 L.', code: 'same' },
            { html: 'Canadian law says paint must come in British gallons.', why: 'These cans match <b>US</b> gallons and quarts, not British ones.', code: 'law' },
            { html: 'Paint takes up less space in metric cans.', why: 'The size of the can, not the unit on the label, decides how much it holds.', code: 'space' }],
            'The cans match US units (1 gallon and 1 quart), so the same cans can be sold in the US and in Canada (with litre labels).', ['Think about selling the same can in two countries.'], 'E paint sizes');
        } },
        { id: 'e14c', level: 'PRG', outcome: 'M1', make: function (r) {
          var s = find(function () { return { c: r.pick([30, 35, 40]), A: r.int(5, 12) * 10, who: r.pick(['Ravi', 'Sofia', 'Malik', 'Hana']) }; }, function (s) { var f = 2 * s.A / s.c % 1; return f > 0.1 && f < 0.9 && !(s.A === 80 && s.c === 35); });
          var ex = 2 * s.A / s.c, n = Math.ceil(ex - 1e-9);
          return num('(c) One 3.78 L can covers about ' + s.c + ' m². ' + s.who + ' needs to paint ' + s.A + ' m² of wall with two coats. How many cans should ' + he(s.who) + ' buy?', n, { after: 'cans', bad: [[Math.ceil(s.A / s.c - 1e-9), 'u4l2-one-coat', 'Two coats means painting the wall twice: ' + t('2\\times ' + s.A + '=' + 2 * s.A) + ' m².'], [Math.floor(ex), 'u4l2-round-down', 'That won’t be enough paint. Round <b>up</b>.'], [rd(ex, 1), 'u4l2-round-down', 'You buy whole cans: round <b>up</b>.']],
            sol: 'Two coats: ' + t('2\\times ' + s.A + '=' + 2 * s.A) + ' m²; ' + t(2 * s.A + '\\div ' + s.c + eqR(ex, 1)) + ', so ' + he(s.who) + ' should buy ' + n + ' cans (round up).', hints: ['Two coats: double the area.', 'Area ÷ area one can covers, then round up.'], text: 'E paint cans' });
        } }] }
    ]
  });
})(window);
