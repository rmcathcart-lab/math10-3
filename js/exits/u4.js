/* Math 10-3 · Unit 4 (Volume, Capacity, Mass and Temperature) — exit slips for Lessons 1–6 (u4l1x … u4l6x), written in
 * test mode. Calculator allowed (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core skill —
 * Beginning, Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student.
 * Outcomes per part, as on the test: M1 for SI-only parts, M2 for imperial or SI ↔ imperial parts (temperature is M2).
 *   4.1 the volume of a box (M1) · a triangular prism (M1) · a cylinder in inches or feet (M2) · gravel for a driveway in
 *       metres, ordered in whole cubic yards (1 m³ ≈ 1.31 yd³), and its cost (M2)
 *   4.2 L / mL / cm³ / m³ (M1) · the litres of water in a tank filled to below the top (M1) · US gallons ↔ litres, US fluid
 *       ounces ↔ millilitres, British gallons → litres (M2) · British gallons to US gallons through litres (M2)
 *   4.3 °C to °F · °F to °C · how far the quick estimate is from the exact value · which city is colder (°C against °F),
 *       and by how many Celsius degrees (all M2)
 *   4.4 mg / g / kg / t (M1) · bags of flour for a bake (M1) · ounces to pounds and ounces, or adding / subtracting pounds
 *       and ounces (M2) · the true cost per pound after the waste is cut off (M2)
 *   4.5 lb / kg / oz / g with a conversion fact · pounds and ounces to kilograms · a price per lb ↔ per kg · burger patties
 *       in pounds, bought in 1 kg packages (all M2)
 *   4.6 a mass from a volume with a factor (kg per L, t per m³; M1) · the most whole bushels under a truck's limit (M2) ·
 *       $/t ↔ $/bu (M2) · a grain truck box in metres → bushels → tonnes (M2)
 * No multiple choice. Shared helpers and the u4t- codes come from the Unit 4 test (HW.u4assess, js/lessons/u4test.js,
 * which loads first); several slips use the test's own generators (box, prism, cylinder, SI units, temperature,
 * conversion facts, pounds and ounces, $/t ↔ $/bu) with new numbers. Codes only the slips use are u4x-, with labels and
 * partial-credit decisions below. Constants exactly as the booklet (see the test's header). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t;
  var A = HW.u4assess;
  if (!A) throw new Error('js/exits/u4.js needs HW.u4assess from js/lessons/u4test.js: load it first');
  var rd = A.rd, r2 = A.r2, q = A.q, near = A.near, N = A.N, par = A.par, Mt = A.Mt, MM = A.MM, toM = A.toM, toN = A.toN, fx = A.fx, find = A.find, br = A.br, uT = A.uT, U = A.U, cap = A.cap,
    pickR = A.pickR, pickX = A.pickX, frac = A.frac, person = A.person, num = A.num, fld = A.fld, fieldsPart = A.fieldsPart, whichAmtPart = A.whichAmtPart, lbozPart = A.lbozPart, lo = A.lo, loT = A.loT;
  var PI = Math.PI;

  HW.addCodes({
    'u4x-no-131': 'Ordered cubic metres as cubic yards (no × 1.31)', 'u4x-131-way': 'Divided by 1.31 instead of multiplying', 'u4x-cm-m': 'Did not change centimetres to metres',
    'u4x-full': 'Used the full height of the tank, not the water level', 'u4x-gap': 'Used the empty space at the top instead of the water',
    'u4x-same-gal': 'Treated British and US gallons as the same', 'u4x-gal-flip': 'British → US gallons the wrong way round', 'u4x-gave-L': 'Gave the litres instead of the gallons', 'u4x-20pct': 'Used “about 20% bigger” instead of the litre values',
    'u4x-gave-est': 'Gave the estimate instead of the difference', 'u4x-gave-exact': 'Gave the exact value instead of the difference', 'u4x-no-conv': 'Compared °C and °F without converting', 'u4x-conv-err': 'Converted °F to °C without brackets',
    'u4x-gave-kg': 'Gave the kilograms of flour instead of the bags', 'u4x-true-price': 'Gave the price per pound before the waste', 'u4x-gave-paid': 'Gave the amount paid instead of the cost per pound', 'u4x-true-times': 'Multiplied by the usable pounds instead of dividing',
    'u4x-no-oz': 'Left out the ounces', 'u4x-part-pkg': 'Paid for part of a package', 'u4x-lb-as-kg': 'Counted pounds as kilograms', 'u4x-ml-L': 'Did not change mL to L',
    'u4x-275-way': 'Divided by 27.5 instead of multiplying', 'u4x-gave-bu': 'Gave the bushels instead of the tonnes'
  });
  HW.addPartial({
    'u4x-no-131': 'b', 'u4x-131-way': 'n', 'u4x-cm-m': 'b', 'u4x-full': 'b', 'u4x-gap': 'n', 'u4x-same-gal': 'n', 'u4x-gal-flip': 'n', 'u4x-gave-L': 'b', 'u4x-20pct': 's', 'u4x-gave-est': 'b', 'u4x-gave-exact': 'b',
    'u4x-no-conv': 'n', 'u4x-conv-err': 'b', 'u4x-gave-kg': 'b', 'u4x-true-price': 'b', 'u4x-gave-paid': 'b', 'u4x-true-times': 'n', 'u4x-no-oz': 'b', 'u4x-part-pkg': 'b', 'u4x-lb-as-kg': 'b', 'u4x-ml-L': 'b',
    'u4x-275-way': 'n', 'u4x-gave-bu': 'b'
  });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }

  /* =====================================================================================================
   * 4.1 Volume of prisms and cylinders
   * ===================================================================================================== */
  function l1q4(r) {
    var s = find(function () { var l = pickR(r, [10, 25, 0.5]), w = pickR(r, [2.5, 4.5, 0.5]), dcm = r.int(8, 20), pr = q(r.int(36, 55) + r.pick([0, 0.5])); var V = l * w * dcm / 100, yd = V * 1.31; return { l: l, w: w, dcm: dcm, pr: pr, V: q(V), yd: yd, n: Math.ceil(yd - 1e-9) }; },
      function (s) { return frac(s.yd) > 0.08 && frac(s.yd) < 0.92 && Math.ceil(s.V - 1e-9) !== s.n && !(s.l === 15 && s.w === 3.5 && s.dcm === 10) && s.yd > 2; });
    var what = r.pick(['A farm driveway', 'A gravel parking pad', 'A path to a cabin', 'A back lane']);
    var specs = [fld('Order:', s.n, { dp: 0, after: 'yd³', name: 'Order', diag: [{ v: Math.round(s.yd), code: 'u4t-order-down', hint: 'Always round an order <b>up</b>, or the job comes up short.' }, { v: Math.ceil(s.V - 1e-9), code: 'u4x-no-131', hint: 'That’s in cubic <b>metres</b>. The pit sells cubic yards: × 1.31.' },
        { v: Math.ceil(s.V / 1.31 - 1e-9), code: 'u4x-131-way', hint: 'A cubic yard is smaller than a cubic metre, so there are <b>more</b> cubic yards: multiply by 1.31.' }, { v: Math.ceil(s.l * s.w * s.dcm * 1.31 - 1e-9), code: 'u4x-cm-m', hint: 'Change the depth to metres first: ' + t(s.dcm + '\\text{ cm}=' + N(s.dcm / 100) + '\\text{ m}') + '.' }] }),
      fld('Cost:', s.n * s.pr, { money: true, name: 'Cost', diag: [{ v: s.yd * s.pr, code: 'u4t-exact-order', hint: 'Pay for the whole cubic yards you order, not the exact amount.' }, { v: Math.ceil(s.V - 1e-9) * s.pr, code: 'u4x-no-131', hint: 'Change the cubic metres to cubic yards first (× 1.31).' }] })];
    return fieldsPart(what + ' is ' + U(s.l, 'm') + ' long and ' + U(s.w, 'm') + ' wide. It needs a layer of gravel ' + U(s.dcm, 'cm') + ' deep. The gravel pit sells only whole cubic yards, at ' + MM(s.pr) + ' per yd³. Use ' + t('1\\text{ m}^3\\approx 1.31\\text{ yd}^3') + '. How many cubic yards should be ordered, and what will they cost?', specs,
      br([t(s.dcm + '\\text{ cm}=' + N(s.dcm / 100) + '\\text{ m}') + '; ' + t('V=' + N(s.l) + '\\times ' + N(s.w) + '\\times ' + N(s.dcm / 100) + '=' + N(s.V) + '\\text{ m}^3'), t(N(s.V) + '\\times 1.31' + toN(s.yd, 3) + '\\text{ yd}^3') + '; round <b>up</b>: order ' + t(s.n + '\\text{ yd}^3'),
        'Cost: ' + t(s.n + '\\times ' + Mt(s.pr) + '=' + Mt(s.n * s.pr))]), ['Change the depth to metres, find the volume, then × 1.31 for cubic yards.', 'Round up to whole cubic yards, then multiply by the price.'], 'gravel in cubic yards');
  }
  HW.defineExit({ lesson: 'u4l1', outcome: 'M1', calc: true, blurb: 'Volume: a box, a triangular prism, a cylinder in inches or feet, and ordering gravel in cubic yards.',
    questions: [Q(1, 'M1', 'BEG', function (r) { return A.boxPart(r); }, 'Volume of a box'), Q(2, 'M1', 'PRG', function (r) { return A.prismPart(r); }, 'Volume of a triangular prism'),
      Q(3, 'M2', 'PRG', function (r) { return A.cylPart(r, { sys: 'imp' }); }, 'Volume of a cylinder (in, ft)'), Q(4, 'M2', 'MAS', l1q4, 'Gravel: m³ → yd³, order and cost')] });

  /* =====================================================================================================
   * 4.2 Capacity: litres, gallons, US vs British
   * ===================================================================================================== */
  function l2q2(r) {
    var s = find(function () { var l = 10 * r.int(4, 12), w = 5 * r.int(5, 10), h = 5 * r.int(6, 12), k = r.pick([3, 4, 5, 6, 8, 10]); return { l: l, w: w, h: h, k: k }; }, function (s) { return s.l > s.w && s.h > s.k + 15 && !(s.l === 60 && s.w === 30 && s.h === 40); });
    var p = person(r), wl = s.h - s.k, V = s.l * s.w * wl, L = V / 1000;
    return num(p.n + '’s ' + r.pick(['fish tank', 'cooler', 'storage tub', 'aquarium']) + ' is a rectangular prism. Inside, it is ' + U(s.l, 'cm') + ' long, ' + U(s.w, 'cm') + ' wide and ' + U(s.h, 'cm') + ' high. ' + cap(p.he) + ' fills it with water to ' + U(s.k, 'cm') + ' below the top. How many litres of water is that?', L, { dp: 3, noPlaces: true, after: 'L',
      diag: [{ v: s.l * s.w * s.h / 1000, code: 'u4x-full', hint: 'The water is ' + s.k + ' cm below the top: its depth is ' + t(s.h + '-' + s.k + '=' + wl) + ' cm.' }, { v: V, code: 'u4t-no-1000', hint: 'That’s in cm³. ' + t('1\\text{ L}=1000\\text{ cm}^3') + ': divide by 1000.' },
        { v: s.l * s.w * s.k / 1000, code: 'u4x-gap', hint: 'That’s the empty space at the top. The water is ' + wl + ' cm deep.' }, { v: V / 100, code: 'u4t-si-100', hint: '1 L = 1000 cm³: divide by <b>1000</b>.' }],
      sol: br(['Water depth: ' + t(s.h + '-' + s.k + '=' + wl) + ' cm', t('V=' + s.l + '\\times ' + s.w + '\\times ' + wl + '=' + N(V) + '\\text{ cm}^3'), t(N(V) + '\\div 1000=' + N(L) + '\\text{ L}')]),
      hints: ['How deep is the water?', 'Volume in cm³, then ÷ 1000 for litres.'], text: 'water to below the top' });
  }
  function l2q3(r) {
    var k = r.int(0, 4), x, ans, dp, diag, sol, prompt, after;
    if (k === 0) { x = pickX(r, [4, 5, 8, 12, 15, 20, 2.5, 6], [10]); ans = x * 3.785; dp = 2; after = 'L'; prompt = 'A ' + r.pick(['water jug', 'gas can', 'fish tank', 'cooler']) + ' bought in the US holds ' + t(N(x)) + ' US gallons. How many litres is that, to the nearest hundredth? (' + t('1\\text{ US gal}\\approx 3.785\\text{ L}') + ')';
      diag = [{ v: x / 3.785, code: 'u4t-gal-way', hint: 'A gallon is bigger than a litre, so there are <b>more</b> litres: multiply.' }, { v: x * 4.546, code: 'u4t-british', hint: 'Use the <b>US</b> gallon, 3.785 L.' }, { v: x * 4, code: 'u4t-estimate', hint: '4 L is only an estimate: use 3.785.' }]; sol = t(N(x) + '\\times 3.785' + toN(ans, 2) + '\\text{ L}'); }
    else if (k === 1) { x = pickX(r, [45, 50, 65, 70, 80, 100, 120, 25], [60]); ans = x / 3.785; dp = 2; after = 'US gal'; prompt = 'A ' + r.pick(['car’s gas tank', 'rain barrel', 'water heater', 'hot-water tank']) + ' holds ' + U(x, 'L') + '. How many US gallons is that, to the nearest hundredth? (' + t('1\\text{ US gal}\\approx 3.785\\text{ L}') + ')';
      diag = [{ v: x * 3.785, code: 'u4t-gal-way', hint: 'A gallon is bigger than a litre, so there are <b>fewer</b> gallons: divide.' }, { v: x / 4.546, code: 'u4t-british', hint: 'Use the <b>US</b> gallon, 3.785 L.' }]; sol = t(N(x) + '\\div 3.785' + toN(ans, 2) + '\\text{ US gal}'); }
    else if (k === 2) { x = pickX(r, [8, 16, 20, 24, 32, 6.5, 10], [12]); ans = x * 29.57; dp = 1; after = 'mL'; prompt = 'A bottle of ' + r.pick(['juice', 'shampoo', 'sports drink', 'iced tea']) + ' from the US says ' + t(N(x)) + ' fl oz. How many millilitres is that, to the nearest tenth? (' + t('1\\text{ US fl oz}\\approx 29.57\\text{ mL}') + ')';
      diag = [{ v: x / 29.57, code: 'u4t-gal-way', hint: 'A fluid ounce is much bigger than a millilitre: multiply.' }, { v: x * 28.4, code: 'u4t-british', hint: 'That uses the British fluid ounce (28.4 mL). Use the US one, 29.57 mL.' }, { v: x * 30, code: 'u4t-estimate', hint: '30 mL is only the estimate: use 29.57.' }]; sol = t(N(x) + '\\times 29.57' + toN(ans, 1) + '\\text{ mL}'); }
    else if (k === 3) { x = pickX(r, [250, 355, 750, 1000, 1500, 200, 946], [500]); ans = x / 29.57; dp = 2; after = 'fl oz'; prompt = 'A ' + r.pick(['can of pop', 'bottle of water', 'carton of milk', 'jar of salsa']) + ' holds ' + U(x, 'mL') + '. How many US fluid ounces is that, to the nearest hundredth? (' + t('1\\text{ US fl oz}\\approx 29.57\\text{ mL}') + ')';
      diag = [{ v: x * 29.57, code: 'u4t-gal-way', hint: 'A fluid ounce is bigger than a millilitre, so there are <b>fewer</b> fluid ounces: divide.' }, { v: x / 28.4, code: 'u4t-british', hint: 'Use the <b>US</b> fluid ounce, 29.57 mL.' }]; sol = t(N(x) + '\\div 29.57' + toN(ans, 2) + '\\text{ fl oz}'); }
    else { x = pickX(r, [3, 5, 8, 12, 25, 40, 2.5], [5]); ans = x * 4.546; dp = 2; after = 'L'; prompt = 'An old Canadian ' + r.pick(['farm sprayer', 'boat fuel tank', 'milk can', 'water tank']) + ' is marked ' + t(N(x)) + ' British (imperial) gallons. How many litres is that, to the nearest hundredth? (' + t('1\\text{ British gal}\\approx 4.546\\text{ L}') + ')';
      diag = [{ v: x / 4.546, code: 'u4t-gal-way', hint: 'A gallon is bigger than a litre, so there are <b>more</b> litres: multiply.' }, { v: x * 3.785, code: 'u4t-british', hint: 'That uses the US gallon. A British gallon is 4.546 L.' }]; sol = t(N(x) + '\\times 4.546' + toN(ans, 2) + '\\text{ L}'); }
    return num(prompt, ans, { dp: dp, after: after, diag: diag, sol: sol, hints: ['Estimate first: is the answer a bigger or a smaller number?', 'Imperial unit → mL or L: multiply. mL or L → imperial unit: divide.'], text: 'capacity SI ↔ US/British' });
  }
  function l2q4(r) {
    var n = pickX(r, [5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75], [5]), L = n * 4.546, us = L / 3.785;
    var what = r.pick(['An old farm sprayer tank', 'A boat’s fuel tank (made in Canada in the 1960s)', 'An old water tank on a cattle farm', 'A heating-oil tank from the 1970s']);
    return num(what + ' holds ' + t(N(n)) + ' British (imperial) gallons. A US website lists tanks in US gallons. How many <b>US</b> gallons does it hold, to the nearest tenth? (' + t('1\\text{ British gal}\\approx 4.546\\text{ L}') + ', ' + t('1\\text{ US gal}\\approx 3.785\\text{ L}') + ')', us, { dp: 1, after: 'US gal',
      alts: [rd(L, 2) / 3.785], diag: [{ v: n, code: 'u4x-same-gal', hint: 'A British gallon is bigger than a US gallon, so the number of US gallons is bigger. Go through litres.' }, { v: n * 3.785 / 4.546, code: 'u4x-gal-flip', hint: 'Change the British gallons to litres (× 4.546), then the litres to US gallons (÷ 3.785).' },
        { v: L, code: 'u4x-gave-L', hint: 'That’s the litres. Now change them to US gallons: ÷ 3.785.' }],
      nudge: [{ v: n * 1.2, code: 'u4x-20pct', hint: 'Close — that uses “about 20% bigger”. Use the litre values to get the exact answer.' }],
      sol: br(['Litres: ' + t(N(n) + '\\times 4.546' + toN(L, 3) + '\\text{ L}'), 'US gallons: ' + t(N(rd(L, 3)) + '\\div 3.785' + toN(us, 1)) + ' US gal', 'More US gallons than British: a US gallon is smaller.']),
      hints: ['Change the British gallons to litres first.', 'Then change the litres to US gallons.'], text: 'British to US gallons' });
  }
  HW.defineExit({ lesson: 'u4l2', outcome: 'M2', calc: true, blurb: 'Capacity: litres, millilitres and cubic units, the water in a tank, US and British gallons and fluid ounces, and British to US gallons.',
    questions: [Q(1, 'M1', 'BEG', function (r) { return A.siPart(r, 'cap'); }, 'L, mL, cm³, m³'), Q(2, 'M1', 'PRG', l2q2, 'Water in a tank (litres)'), Q(3, 'M2', 'PRG', l2q3, 'US / British units ↔ L or mL'), Q(4, 'M2', 'MAS', l2q4, 'British gallons to US gallons')] });

  /* =====================================================================================================
   * 4.3 Temperature (M2)
   * ===================================================================================================== */
  function l3q3(r) {
    var C = pickX(r, [-20, -10, 30, 35, 40, 60, 180, 200, 220, 25, -30, 45, -25, 50, 15, 0, 5, -5, 160, 190, 230, 250], [10]), e = 2 * C + 30, F = q(1.8 * C + 32), d = Math.abs(e - F);
    return num('For ' + t(N(C) + uT('°C')) + ', find the quick estimate ' + t('F\\approx 2\\times C+30') + ' and the exact value ' + t('F=1.8\\times C+32') + '. By how many degrees is the estimate off?', d, { dp: 1, after: 'degrees',
      diag: [{ v: e, code: 'u4x-gave-est', hint: 'That’s the estimate. Find the exact value too, and subtract.' }, { v: F, code: 'u4x-gave-exact', hint: 'That’s the exact value. Find the estimate too, and subtract.' }, { v: Math.abs(e - 1.8 * C), code: 'u4t-no-32', hint: 'The exact formula adds 32: ' + t('1.8\\times ' + par(C) + '+32') + '.' }],
      sol: br(['Estimate: ' + t('2\\times ' + par(C) + '+30=' + N(e) + uT('°F')), 'Exact: ' + t('1.8\\times ' + par(C) + '+32=' + N(F) + uT('°F')), 'Off by ' + t(N(Math.max(e, F)) + '-' + par(Math.min(e, F)) + '=' + N(q(d))) + ' degrees. ' + (d <= 4 ? '(Close: good enough for the weather.)' : '(Far off: use the formula.)')]),
      hints: ['Work out both: the estimate and the exact value.', 'Subtract the smaller from the bigger.'], text: 'estimate vs exact' });
  }
  var COLD = [['Edmonton', 'Minneapolis'], ['Winnipeg', 'Fargo'], ['Regina', 'Bismarck'], ['Calgary', 'Great Falls'], ['Saskatoon', 'Duluth']];
  function l3q4(r) {
    var pr = r.pick(COLD), s = find(function () { var c = -r.int(12, 34), f = -r.int(2, 30); var fc = (f - 32) / 1.8; return { c: c, f: f, fc: fc }; }, function (s) { return Math.abs(s.c - s.fc) >= 0.6 && !(s.c === -25 && s.f === -15) && Math.abs(Math.abs(s.c - s.f) - Math.abs(s.c - s.fc)) > 0.3; });
    var usCold = s.fc < s.c, d = Math.abs(s.c - s.fc);
    return whichAmtPart('On the same morning it is ' + t(N(s.c) + uT('°C')) + ' in ' + pr[0] + ' and ' + t(N(s.f) + uT('°F')) + ' in ' + pr[1] + '. Which city is colder, and by how many Celsius degrees? Round to the nearest tenth.', { amt: d, money: false, dp: 1, after: 'Celsius degrees',
      alts: [Math.abs(s.c - rd(s.fc, 1))], whichLabel: 'Colder city:', amtLabel: 'By how many C°:', ph: pr[0] + ' or ' + pr[1], right: [(usCold ? pr[1] : pr[0]).toLowerCase()], wrongs: [(usCold ? pr[0] : pr[1]).toLowerCase()],
      rightKey: usCold ? pr[1] : pr[0], wrongKey: usCold ? pr[0] : pr[1], why: 'Change the °F reading to °C, then compare: the lower temperature is colder.', nudge: 'type ' + pr[0] + ' or ' + pr[1] + '.',
      diag: [{ v: Math.abs(s.c - s.f), code: 'u4x-no-conv', hint: 'The two readings are on different scales. Change ' + t(N(s.f) + uT('°F')) + ' to °C first.' }, { v: Math.abs(s.c - (s.f - 32 / 1.8)), code: 'u4x-conv-err', hint: 'Use brackets: ' + t('(' + N(s.f) + '-32)\\div 1.8') + '.' },
        { v: rd(s.fc, 1), code: 'u4t-gave-total', hint: 'That’s the ' + pr[1] + ' temperature in °C. Now find the difference.' }],
      sol: br([pr[1] + ': ' + t('C=(' + N(s.f) + '-32)\\div 1.8=' + N(s.f - 32) + '\\div 1.8' + toN(s.fc, 1) + uT('°C')), t(fx(Math.min(s.c, s.fc), 1)) + ' is lower than ' + t(fx(Math.max(s.c, s.fc), 1)) + ', so <b>' + (usCold ? pr[1] : pr[0]) + '</b> is colder, by ' + t(fx(d, 1)) + ' Celsius degrees.']),
      hints: ['Change the °F temperature to °C: C = (F − 32) ÷ 1.8.', 'The lower number is colder. Subtract to find by how much.'], text: 'which is colder' });
  }
  HW.defineExit({ lesson: 'u4l3', outcome: 'M2', calc: true, blurb: 'Temperature: °C to °F, °F to °C, how good the quick estimate is, and comparing a °C and a °F reading.',
    questions: [Q(1, 'M2', 'BEG', function (r) { return A.cToFPart(r, { list: [-30, -25, -20, -10, -5, 5, 15, 30, 35, 40, 12, 28, -12, 180, 200, 8, -8, 22, 18, 32, 45, -35, 160, 220] }); }, '°C to °F'),
      Q(2, 'M2', 'PRG', function (r) { return A.fToCPart(r, { list: [14, 23, 41, 59, 68, 77, 86, 95, -4, -22, 0, 5, 20, 45, 72, 80, 325, 350, 375, 400, 425, 102, 99, 62] }); }, '°F to °C'),
      Q(3, 'M2', 'PRG', l3q3, 'Quick estimate vs exact'), Q(4, 'M2', 'MAS', l3q4, 'Which city is colder')] });

  /* =====================================================================================================
   * 4.4 Mass: g, kg, oz, lb, tons
   * ===================================================================================================== */
  function l4q2(r) {
    var s = find(function () { var g = 25 * r.int(18, 32), n = r.int(4, 9), b = r.pick([1, 2, 2.5, 5]); return { g: g, n: n, b: b, kg: g * n / 1000, x: g * n / 1000 / b }; }, function (s) { return s.x > 1.1 && s.x < 9 && frac(s.x) > 0.05 && frac(s.x) < 0.95 && !(s.g === 650 && s.n === 6) && Math.ceil(s.x) !== Math.ceil(s.kg - 1e-9); });
    var p = person(r), n = Math.ceil(s.x - 1e-9), what = r.pick(['loaf of bread', 'batch of cookies', 'pizza crust', 'batch of bannock']);
    return num(p.n + ' is baking for a bake sale. Each ' + what + ' uses ' + U(s.g, 'g') + ' of flour, and ' + p.he + ' makes ' + s.n + '. Flour comes in ' + U(s.b, 'kg') + ' bags. How many bags must ' + p.he + ' buy?', n, { dp: 0, count: 'up', exact: s.x, why: 'you can’t buy part of a bag.', after: 'bags',
      diag: [{ v: s.kg, code: 'u4x-gave-kg', hint: 'That’s the kilograms of flour. How many ' + N(s.b) + ' kg bags is that?' }, { v: Math.ceil(s.g * s.n / 100 / s.b - 1e-9), code: 'u4t-si-100', hint: '1 kg = <b>1000</b> g.' }],
      sol: br(['Flour: ' + t(s.n + '\\times ' + s.g + '=' + N(s.g * s.n) + '\\text{ g}=' + N(s.kg) + '\\text{ kg}'), 'Bags: ' + t(N(s.kg) + '\\div ' + N(s.b) + toN(s.x, 2)) + ', so round <b>up</b>: ' + n + ' bags.']),
      hints: ['Find the total flour, then change grams to kilograms (÷ 1000).', 'Divide by the size of a bag and round up.'], text: 'bags of flour' });
  }
  function l4q3(r) {
    if (r.chance(0.5)) return A.lbOzArithPart(r, { text: 'lb oz arithmetic' });
    var tot = find(function () { return r.int(35, 150); }, function (x) { return x % 16 !== 0 && x !== 70 && x !== 74; }), L = Math.floor(tot / 16), O = tot - 16 * L, d = tot / 16, fr = d - L;
    var it = r.pick(['A bag of potatoes', 'A newborn baby', 'A turkey breast', 'A box of books', 'A bag of dog treats']);
    return lbozPart(it + ' has a mass of ' + U(tot, 'oz') + '. What is that in pounds and ounces?', tot, {
      diag: [{ lb: L, oz: Math.round(fr * 10), code: 'u4t-dec-as-oz', hint: 'The decimal part of a pound is not ounces: ' + t(N(rd(fr, 4)) + '\\text{ lb}=' + N(rd(fr, 4)) + '\\times 16=' + O + '\\text{ oz}') + '.' }, { lb: L, oz: Math.round(fr * 100), code: 'u4t-dec-as-oz', hint: 'The decimal part of a pound is not ounces: multiply it by 16.' },
        { lb: Math.floor(tot / 12), oz: tot % 12, code: 'u4t-oz-12', hint: 'There are <b>16</b> oz in a pound.' }, { lb: Math.floor(tot / 10), oz: tot % 10, code: 'u4t-oz-12', hint: 'There are <b>16</b> oz in a pound, not 10.' }],
      sol: br([t(tot + '\\div 16=' + N(rd(d, 4))) + ', so ' + L + ' lb', 'Ounces left: ' + t(tot + '-' + L + '\\times 16=' + O) + ' oz (or ' + t(N(rd(fr, 4)) + '\\times 16=' + O) + ')', 'So ' + lo(tot) + '. Check: ' + t(L + '\\times 16+' + O + '=' + tot) + '.']),
      hints: ['Divide by 16: the whole number is the pounds.', 'The ounces left over: the decimal part × 16.'], text: 'oz to lb oz' });
  }
  var TRUE = [['a watermelon', 'of fruit after the rind is cut off', [0.6, 1.2], [6, 14], [0.55, 0.65]], ['a turkey', 'of meat after the bones are taken out', [2.49, 3.99], [10, 18], [0.6, 0.7]], ['a pineapple', 'of fruit after the peel and core are cut off', [1.49, 2.49], [3, 5], [0.5, 0.6]],
    ['a bone-in ham', 'of meat after the bone is taken out', [2.99, 4.49], [6, 10], [0.7, 0.8]]];
  function l4q4(r) {
    var c = r.pick(TRUE), s = find(function () { var pr = q(r.int(Math.round(c[2][0] * 100), Math.round(c[2][1] * 100)) / 100), wl = r.int(c[3][0], c[3][1]), wo = r.int(1, 15), W = wl * 16 + wo, k = c[4][0] + (c[4][1] - c[4][0]) * r.int(0, 10) / 10, U0 = Math.round(W * k); return { pr: pr, W: W, U0: U0 }; },
      function (s) { return s.U0 % 16 !== 0 && s.W % 16 !== 0 && !(s.W === 148 && s.U0 === 89); });
    var Wl = s.W / 16, Ul = s.U0 / 16, paid = Wl * s.pr, tc = r2(paid) / Ul, p = person(r), wL = Math.floor(s.W / 16), uL = Math.floor(s.U0 / 16);
    var wDec = wL + (s.W - 16 * wL) / 10, uDec = uL + (s.U0 - 16 * uL) / 10;
    return num(p.n + ' buys ' + c[0] + ' that weighs ' + lo(s.W) + ', at ' + MM(s.pr) + ' per lb. ' + cap(p.he) + ' gets ' + lo(s.U0) + ' ' + c[1] + '. What is the true cost per pound of what ' + p.he + ' can use?', tc, { money: true, after: 'per lb', alts: [paid / Ul],
      diag: [{ v: s.pr, code: 'u4x-true-price', hint: 'That’s the price per pound of the whole thing. Some of it is thrown away: divide what was paid by the usable pounds.' }, { v: paid, code: 'u4x-gave-paid', hint: 'That’s what was paid. Divide it by the usable pounds.' },
        { v: r2(wDec * s.pr) / uDec, code: 'u4t-oz-tenths', hint: 'Ounces are sixteenths of a pound, not tenths: ' + lo(s.U0) + ' = ' + t(uL + '+' + (s.U0 - 16 * uL) + '\\div 16=' + N(Ul)) + ' lb.' }, { v: paid * Ul, code: 'u4x-true-times', hint: 'Cost per pound = total paid ÷ usable pounds.' }],
      sol: br(['Weight: ' + lo(s.W) + ' = ' + t(wL + '+' + (s.W - 16 * wL) + '\\div 16=' + N(Wl)) + ' lb; paid ' + t(N(Wl) + '\\times ' + Mt(s.pr) + toM(paid)), 'Usable: ' + lo(s.U0) + ' = ' + t(uL + '+' + (s.U0 - 16 * uL) + '\\div 16=' + N(Ul)) + ' lb',
        'True cost: ' + t(Mt(paid) + '\\div ' + N(Ul) + toM(tc)) + ' per lb']),
      hints: ['Change pounds and ounces to decimal pounds: ounces ÷ 16.', 'True cost per pound = total paid ÷ usable pounds.'], text: 'true cost per pound' });
  }
  HW.defineExit({ lesson: 'u4l4', outcome: 'M2', calc: true, blurb: 'Mass: SI units, bags of flour, pounds and ounces, and the true cost per pound.',
    questions: [Q(1, 'M1', 'BEG', function (r) { return A.siPart(r, 'mass'); }, 'mg, g, kg, t'), Q(2, 'M1', 'PRG', l4q2, 'Bags of flour (g → kg, round up)'), Q(3, 'M2', 'PRG', l4q3, 'Pounds and ounces'), Q(4, 'M2', 'MAS', l4q4, 'True cost per pound')] });

  /* =====================================================================================================
   * 4.5 Converting mass between SI and imperial (M2)
   * ===================================================================================================== */
  function l5q2(r) {
    var s = find(function () { return [r.int(5, 12), r.int(1, 15)]; }, function (s) { return !(s[0] === 7 && s[1] === 6) && s[1] !== 8 && rd((s[0] + s[1] / 16) * 0.454, 2) === rd((s[0] * 16 + s[1]) * 28.35 / 1000, 2); }, [6, 5]);
    var L = s[0], O = s[1], lb = L + O / 16, kg = lb * 0.454, kg2 = (L * 16 + O) * 28.35 / 1000, who = r.pick(['Baby ' + r.pick(['Amara', 'Leo', 'Nia', 'Owen', 'Ivy']) + ' was born at', 'A Thanksgiving turkey weighs', 'A bowling ball weighs', 'A puppy weighs']);
    return num(who + ' ' + t(loT(L, O)) + '. What is that in kilograms, to the nearest hundredth? (Use ' + t('1\\text{ lb}\\approx 0.454\\text{ kg}') + ' or ' + t('1\\text{ oz}\\approx 28.35\\text{ g}') + '.)', kg, { dp: 2, after: 'kg', alts: [kg2, lb / 2.2],
      diag: [{ v: (L + O / 10) * 0.454, code: 'u4t-oz-tenths', hint: t(loT(L, O)) + ' is not ' + t(N(L + O / 10)) + ' lb: ' + t(O + '\\text{ oz}=' + O + '\\div 16=' + N(O / 16)) + ' lb.' }, { v: lb / 0.454, code: 'u4t-fact-way', hint: 'A pound is smaller than a kilogram, so the number of kg is <b>smaller</b>: multiply by 0.454.' },
        { v: lb * 2.2, code: 'u4t-fact-way', hint: 'That changes kg to lb. To change lb to kg, multiply by 0.454.' }, { v: L * 0.454, code: 'u4x-no-oz', hint: 'Include the ' + O + ' oz: ' + t(O + '\\div 16=' + N(O / 16)) + ' lb.' }],
      sol: br([t(O + '\\text{ oz}=' + O + '\\div 16=' + N(O / 16)) + ' lb, so ' + t(N(lb)) + ' lb', t(N(lb) + '\\times 0.454' + toN(kg, 2) + '\\text{ kg}') + ' (or ' + t(L * 16 + O + '\\text{ oz}\\times 28.35=' + N(q((L * 16 + O) * 28.35)) + '\\text{ g}') + ')']),
      hints: ['Change it to one unit first: ounces ÷ 16 gives decimal pounds.', 'Then × 0.454 for kilograms.'], text: 'lb oz to kg' });
  }
  var MEAT = [['Ground beef', [4.49, 6.99]], ['Chicken breasts', [4.99, 7.49]], ['Pork tenderloin', [5.49, 7.99]], ['Bananas', [0.69, 0.99]], ['Sweet potatoes', [0.99, 1.69]], ['Salmon', [7.99, 11.49]]];
  function l5q3(r) {
    var m = r.pick(MEAT), toKg = r.chance(0.55), x, ans, alt;
    if (toKg) { x = q(r.int(Math.round(m[1][0] * 100), Math.round(m[1][1] * 100)) / 100); ans = x * 2.2; alt = x / 0.454; }
    else { x = q(r2(r.int(Math.round(m[1][0] * 100), Math.round(m[1][1] * 100)) / 100 * 2.2)); ans = x / 2.2; alt = x * 0.454; }
    return num(m[0] + (toKg ? ' costs ' + MM(x) + ' per lb in a flyer. What is that price per kilogram?' : ' cost ' + MM(x) + ' per kg at the till. What is that price per pound?') + ' (Use ' + t('1\\text{ kg}\\approx 2.2\\text{ lb}') + '.)', ans, { money: true, after: toKg ? 'per kg' : 'per lb', alts: [alt],
      diag: [{ v: toKg ? x / 2.2 : x * 2.2, code: 'u4t-price-way', hint: toKg ? 'A kilogram is more meat than a pound, so it costs <b>more</b>: × 2.2.' : 'A pound is less than a kilogram, so it costs <b>less</b>: ÷ 2.2.' }, { v: toKg ? x * 0.454 : x / 0.454, code: 'u4t-price-way', hint: 'Converting a <b>price</b> goes the opposite way to converting a mass.' }],
      sol: br([toKg ? '1 kg ≈ 2.2 lb, so 1 kg costs about 2.2 times as much: ' + t(Mt(x) + '\\times 2.2' + toM(ans)) + ' per kg' : '1 kg ≈ 2.2 lb, so 1 lb is less meat and costs less: ' + t(Mt(x) + '\\div 2.2' + toM(ans)) + ' per lb', 'Check: the price per kg is the bigger number.']),
      hints: ['price per kg = price per lb × 2.2.', 'price per lb = price per kg ÷ 2.2.'], text: toKg ? '$/lb to $/kg' : '$/kg to $/lb' });
  }
  function l5q4(r) {
    var s = find(function () { var n = r.int(16, 60), sz = r.pick([0.25, 0.25, 1 / 3, 0.5]), pr = q(r.int(10, 15) + r.pick([0, 0.49, 0.99])); var lb = n * sz, kg = lb * 0.454; return { n: n, sz: sz, pr: pr, lb: lb, kg: kg }; },
      function (s) { return (s.sz !== 1 / 3 || s.n % 3 === 0) && frac(s.kg) > 0.05 && frac(s.kg) < 0.95 && Math.ceil(s.lb - 1e-9) !== Math.ceil(s.kg - 1e-9) && Math.ceil(s.kg - 1e-9) === Math.ceil(s.lb / 2.2 - 1e-9) && !(s.n === 30 && s.sz === 0.25); });
    var pk = Math.ceil(s.kg - 1e-9), cost = pk * s.pr, nm = s.sz === 0.25 ? 'quarter-pound' : s.sz === 0.5 ? 'half-pound' : 'third-of-a-pound', fr = s.sz === 0.25 ? '\\tfrac{1}{4}' : s.sz === 0.5 ? '\\tfrac{1}{2}' : '\\tfrac{1}{3}';
    var team = r.pick(['The volleyball team', 'The grad committee', 'A soccer club', 'The drama club']);
    return num(team + ' is having a barbecue. They need ' + s.n + ' ' + nm + ' burger patties (each patty is ' + t(fr) + ' lb of ground beef). The store sells ground beef only in 1 kg packages, at ' + MM(s.pr) + ' per package. What will they pay for the beef? (Use ' + t('1\\text{ lb}\\approx 0.454\\text{ kg}') + '.)', cost, { money: true,
      diag: [{ v: s.kg * s.pr, code: 'u4x-part-pkg', hint: 'The store sells whole 1 kg packages: round the kilograms <b>up</b> first.' }, { v: Math.floor(s.kg) * s.pr, code: 'u4t-count-dir', hint: Math.floor(s.kg) + ' packages is only ' + Math.floor(s.kg) + ' kg, not enough: round <b>up</b>.' },
        { v: Math.ceil(s.lb - 1e-9) * s.pr, code: 'u4x-lb-as-kg', hint: 'The beef is in <b>pounds</b>. Change it to kilograms (× 0.454) before you count packages.' }, { v: Math.ceil(s.lb * 2.2 - 1e-9) * s.pr, code: 'u4t-fact-way', hint: 'Pounds → kilograms: × 0.454 (the number of kg is smaller).' }],
      sol: br(['Beef: ' + t(s.n + '\\times ' + fr + '=' + N(s.lb)) + ' lb', t(N(s.lb) + '\\times 0.454' + toN(s.kg, 3) + '\\text{ kg}') + ', so ' + pk + ' packages (' + (pk - 1) + ' kg is not enough)', 'Cost: ' + t(pk + '\\times ' + Mt(s.pr) + '=' + Mt(cost))]),
      hints: ['Find the pounds of beef, then change to kilograms.', 'Round up to whole packages, then multiply by the price.'], text: 'burger patties' });
  }
  HW.defineExit({ lesson: 'u4l5', outcome: 'M2', calc: true, blurb: 'Converting mass: a conversion fact, pounds and ounces to kilograms, prices per lb and per kg, and buying beef in kilogram packages.',
    questions: [Q(1, 'M2', 'BEG', function (r) { return A.factPart(r); }, 'lb ↔ kg, oz ↔ g'), Q(2, 'M2', 'PRG', l5q2, 'Pounds and ounces to kilograms'), Q(3, 'M2', 'PRG', l5q3, 'Price per lb ↔ per kg'), Q(4, 'M2', 'MAS', l5q4, 'Burger patties: lb → kg → packages')] });

  /* =====================================================================================================
   * 4.6 From volume to mass: bushels and tonnes
   * ===================================================================================================== */
  var FAC = [['milk', 1.03, 'kg per L', 'L', 'kg', [2, 4, 1], 'a jug of'], ['gasoline', 0.74, 'kg per L', 'L', 'kg', [40, 90, 5], 'a full tank of'], ['honey', 1.42, 'kg per L', 'L', 'kg', [1.5, 5, 0.5], 'a pail of'], ['maple syrup', 1.33, 'kg per L', 'L', 'kg', [0.5, 4, 0.5], 'a jug of'],
    ['diesel', 0.84, 'kg per L', 'L', 'kg', [400, 1500, 50], 'a farm tank of'], ['concrete', 2.4, 't per m³', 'm³', 't', [1.5, 6, 0.5], 'a load of'], ['gravel', 1.7, 't per m³', 'm³', 't', [3, 12, 0.5], 'a load of'], ['topsoil', 1.3, 't per m³', 'm³', 't', [2, 8, 0.5], 'a load of']];
  function l6q1(r) {
    var c = r.pick(FAC), V = find(function () { return pickR(r, c[5]); }, function (v) { return !(c[0] === 'milk' && v === 4) && !(c[0] === 'gasoline' && v === 60) && !(c[0] === 'concrete' && v === 3.5); }), ml = c[3] === 'L' && V <= 5 && r.chance(0.35), M = V * c[1];
    var shown = ml ? t(N(V * 1000) + '\\text{ mL}') : U(V, c[3]);
    var diag = [{ v: V / c[1], code: 'u4t-bu-way', hint: 'mass = volume × factor: multiply by ' + N(c[1]) + '.' }];
    if (ml) diag.push({ v: V * 1000 * c[1], code: 'u4x-ml-L', hint: 'The factor is per <b>litre</b>: change ' + N(V * 1000) + ' mL to litres first (÷ 1000).' });
    return num(cap(c[6]) + ' ' + c[0] + ' holds ' + shown + '. ' + cap(c[0]) + ' has a mass of about ' + t(N(c[1])) + ' ' + c[2] + '. What is the mass of the ' + c[0] + '? (Round to the nearest hundredth if needed.)', M, { dp: 2, after: c[4], diag: diag,
      sol: br([ml ? t(N(V * 1000) + '\\text{ mL}=' + N(V) + '\\text{ L}') : null, 'mass = volume × factor: ' + t(N(V) + '\\times ' + N(c[1]) + toN(M, 2) + '\\text{ ' + c[4] + '}')]), hints: ['mass = volume × (mass per unit of volume).', 'The units must match: the volume in ' + c[3] + '.'], text: 'mass from a factor' });
  }
  function l6q2(r) {
    var cr = A.cropPick(r, ['wheat', 'canola', 'barley', 'oats', 'flax']), s = find(function () { var L = r.pick([12, 13.5, 14, 14.5, 15, 16, 38, 40, 42]); return { L: L, x: L * cr.f }; }, function (s) { return frac(s.x) > 0.05 && frac(s.x) < 0.95 && !(s.L === 14.5 && cr.f === 36.7) && !(s.L === 42 && cr.f === 44.1); });
    var n = Math.floor(s.x + 1e-9), p = person(r), truck = s.L > 30 ? 'semi-trailer grain truck' : 'grain truck';
    return num(p.n + '’s ' + truck + ' may legally carry at most ' + U(s.L, 't') + '. What is the most ' + cr.c + ' (' + t(N(cr.f)) + ' bu/t) ' + p.he + ' can haul in one load, in whole bushels?', n, { dp: 0, count: 'down', exact: s.x, why: 'one more bushel would go over the limit.', after: 'bu',
      diag: [{ v: Math.floor(s.L / cr.f), code: 'u4t-bu-way', hint: 'A tonne is ' + N(cr.f) + ' bushels, so ' + N(s.L) + ' t is many more bushels: multiply.' }],
      sol: br(['tonnes × factor = bushels: ' + t(N(s.L) + '\\times ' + N(cr.f) + toN(s.x, 2)) + ' bu', 'Round <b>down</b> so the load stays legal: ' + t(N(n)) + ' bushels.']), hints: ['Tonnes → bushels: multiply by the factor.', 'The load must not go over the limit: round down.'], text: 'most bushels in a load' });
  }
  function l6q4(r) {
    var s = find(function () { var cr = A.cropPick(r, ['wheat', 'canola', 'barley', 'oats']), l = pickR(r, [5.5, 7.5, 0.1]), w = pickR(r, [2.3, 2.6, 0.1]), h = pickR(r, [1.2, 1.8, 0.1]); var V = q(l * w * h); return { cr: cr, l: l, w: w, h: h, V: V, bu: V * 27.5 }; },
      function (s) { var tt = s.bu / s.cr.f, t2 = rd(s.bu, 0) / s.cr.f; return rd(tt, 2) === rd(t2, 2) && !(s.l === 6.1 && s.w === 2.4 && s.h === 1.5); });
    var T = s.bu / s.cr.f;
    return num('A grain truck box is ' + U(s.l, 'm') + ' long and ' + U(s.w, 'm') + ' wide. It is filled level with ' + s.cr.c + ' to a depth of ' + U(s.h, 'm') + '. Use ' + t('1\\text{ m}^3\\approx 27.5\\text{ bu}') + ' and, for ' + s.cr.c + ', ' + t(N(s.cr.f)) + ' bu/t. What is the mass of the ' + s.cr.c + ', in tonnes, to two decimals?', T, { dp: 2, after: 't', alts: [rd(s.bu, 0) / s.cr.f],
      diag: [{ v: s.bu * s.cr.f, code: 'u4t-bu-way', hint: 'Bushels → tonnes: <b>divide</b> by the factor.' }, { v: s.V / 27.5 / s.cr.f, code: 'u4x-275-way', hint: 'There are about 27.5 bushels in each m³: multiply by 27.5.' }, { v: s.bu, code: 'u4x-gave-bu', hint: 'That’s the bushels. Now change them to tonnes: ÷ ' + N(s.cr.f) + '.' },
        { v: s.V * s.cr.f, code: 'u4t-bu-way', hint: 'Change the m³ to bushels first (× 27.5), then bushels to tonnes (÷ ' + N(s.cr.f) + ').' }],
      sol: br([t('V=' + N(s.l) + '\\times ' + N(s.w) + '\\times ' + N(s.h) + '=' + N(s.V) + '\\text{ m}^3'), 'Bushels: ' + t(N(s.V) + '\\times 27.5' + toN(s.bu, 0)) + ' bu', 'Tonnes: ' + t(N(rd(s.bu, 0)) + '\\div ' + N(s.cr.f) + toN(rd(s.bu, 0) / s.cr.f, 2) + '\\text{ t}')]),
      hints: ['volume → bushels → tonnes.', 'm³ × 27.5 = bushels; bushels ÷ factor = tonnes.'], text: 'truck box to tonnes' });
  }
  HW.defineExit({ lesson: 'u4l6', outcome: 'M2', calc: true, blurb: 'Volume to mass: a mass from a factor, the most bushels in a legal load, prices per tonne and per bushel, and a grain truck box in tonnes.',
    questions: [Q(1, 'M1', 'BEG', l6q1, 'Mass from a factor'), Q(2, 'M2', 'PRG', l6q2, 'Most bushels in a load'), Q(3, 'M2', 'PRG', function (r) { return A.buPricePart(r); }, '$/t ↔ $/bu'), Q(4, 'M2', 'MAS', l6q4, 'Truck box: m³ → bu → t')] });
})(window);
