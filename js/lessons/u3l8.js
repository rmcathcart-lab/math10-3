/* Math 10-3 · Unit 3 · Lesson 8 — Area of 2-D Shapes (M4; area-unit conversions M1 for SI, M2 for imperial and SI↔imperial)
 * Assignment 8 (u3_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u3_ep08.tex: A Skills 1–5, B Applying 6–11,
 * C Stretch 12–14). Every part is a generator: the same shape, units and difficulty as the booklet item (a decimal side,
 * a half-inch mixed number, a diameter given instead of a radius, feet and inches, a job priced per square yard, tiles
 * in boxes…), new numbers around the booklet's (the booklet's own numbers can come up; the lesson's worked-example
 * numbers are left out). Calculator allowed (π key).
 * Answers: typed numbers (a unit typed after the number is ignored; 24000, 24 000 and 24,000 all work); rounding as the
 * booklet asks (too many or too few decimals gets a nudge, rounding the wrong way is wrong with a hint; π = 3.14 instead
 * of the π key gets a nudge when it changes the rounded answer); money to the cent; "how many boxes / bags / cans / tiles"
 * must be rounded up (rounding down is wrong with a hint, an unrounded answer gets a nudge). Half-inch answers with the
 * mixed-number keypad: a mixed number in simplest form or the exact decimal (24¾ or 24.75).
 * Recognised wrong values each get their own hint: the perimeter instead of the area, adding the sides, the slanted side
 * used as the height, forgetting the ½ of a triangle or trapezoid, r × 2 instead of r², the diameter used as the radius,
 * no π, the circumference, 12 / 3 / 100 (the length factor) instead of 144 / 9 / 10 000, multiplying instead of dividing
 * (or the reverse), 13 ft 6 in written as 13.6 ft, the cost without the GST or the GST alone, the price per square foot
 * used with square yards, the cost from the unrounded area, no 10 % extra, rounding the boxes down, …
 * Conversions: the counting grid is drawn (SVG) and each shape is a number box; the parallelograms are drawn; the circle
 * table and the area-unit tables → the table input with the given cells shown and the blanks as boxes (the "Work"
 * column is in the worked solution; the unit table is split into an imperial part (M2), an SI part (M1) and the
 * m² → ft² row (M2)); "is 1 L enough? explain", "find her mistake", "is Marco right? explain", "which has the largest
 * area" → multiple choice whose options give the reason; "area or perimeter?" → a matching grid; "how many boxes and
 * what do they cost" → two labelled boxes; numerical-response items → NR boxes.
 * NEEDS js/lessons/u3l7.js (HW.u3formula) and js/lessons/u1l7.js (HW.pctKit) loaded first.
 * Levels: LIM BEG EMG PRG ADV MAS (MAS: Q13(d) and Extra 13(b)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, UF = HW.u3formula;
  if (!UF || !HW.pctKit) throw new Error('u3l8.js needs HW.u3formula (u3l7.js) and HW.pctKit (u1l7.js) loaded first');
  var q = UF.q, rd = UF.rd, near = UF.near, nS = UF.nS, decs = UF.decs, N = UF.N, Np = UF.Np, raw = UF.raw, eqR = UF.eqR, uT = UF.uT, br = UF.br, find = UF.find, pickR = UF.pickR,
    M = UF.M, Mp = UF.Mp, L = UF.L, Lu = UF.Lu, fr = UF.fr, svg = UF.svg, poly = UF.poly, ln = UF.ln, tx = UF.tx, sqMark = UF.sqMark, INK = UF.INK, SHADE = UF.SHADE;
  var PI = Math.PI, M4 = 'M4', M1 = 'M1', M2 = 'M2';
  function u2(u) { return uT(u + '²'); }
  function f8(x) { return fr(x, 8); }

  /* ================= wrong values for each shape ================= */
  function rectBad(l, w, Lf) {
    Lf = Lf || N;
    return [[2 * (l + w), 'u3l8-perim', 'That’s the <b>perimeter</b> (the distance around). Area is the surface inside: ' + t('A=lw') + '.'], [l + w, 'u3l8-added', '<b>Multiply</b> the length and the width: ' + t('A=' + Lf(l) + '\\times ' + Lf(w)) + '.'], [l * w / 2, 'u3l8-half-rect', 'Only a triangle has the ½. A rectangle is ' + t('A=lw') + '.']];
  }
  function sqBad(s) { return [[4 * s, 'u3l8-perim', 'That’s the <b>perimeter</b> (4 sides). Area: ' + t('A=s\\times s') + '.'], [2 * s, 'u3l8-sq2', t('s^2') + ' means ' + t('s\\times s') + ', not ' + t('s\\times 2') + '.'], [s, 'u3l8-sq2', 'Multiply the side by itself: ' + t('s\\times s') + '.']]; }
  function paraBad(b, h, sl) {
    var o = [[b * h / 2, 'u3l8-half-para', 'Only a triangle has the ½. A parallelogram is ' + t('A=bh') + '.'], [b + h, 'u3l8-added', '<b>Multiply</b> the base and the height: ' + t('A=bh') + '.']];
    if (sl) o.unshift([b * sl, 'u3l8-slant', 'The height is measured <b>straight</b> across, at a right angle to the base (the dashed line), not along the slanted side.'], [2 * (b + sl), 'u3l8-perim', 'That’s the <b>perimeter</b>. Area: ' + t('A=bh') + ' (use the dashed height).']);
    return o;
  }
  function triBad(b, h) { return [[b * h, 'u3l8-no-half', 'Don’t forget the ½: ' + t('b\\times h') + ' is the whole parallelogram, which is <b>double</b> the triangle.'], [b + h, 'u3l8-added', '<b>Multiply</b> the base and the height, then divide by 2.'], [2 * b * h, 'u3l8-double', 'Divide by 2 (take half), don’t multiply by 2.'], [b * h / 4, 'u3l8-quarter', 'Divide by 2 only once: ' + t('A=b\\times h\\div 2') + '.']]; }
  function trapBad(a, b, h) {
    return [[(a + b) * h, 'u3l8-no-half', 'Don’t forget the ½: ' + t('(a+b)\\times h\\div 2') + '.'], [a * b * h / 2, 'u3l8-trap-mult', '<b>Add</b> the two parallel sides first: ' + t('(a+b)\\times h\\div 2') + '.'], [(a + b) / 2, 'u3l8-no-h', 'Multiply by the height too: ' + t('(a+b)\\times h\\div 2') + '.'],
      [a + b + h, 'u3l8-added', 'Add the parallel sides, then <b>multiply</b> by the height and divide by 2.'], [a + b * h / 2, 'u3l8-brackets', 'Use brackets so the adding is done first: ' + t('(a+b)\\times h\\div 2') + '.'], [Math.max(a, b) * h, 'u3l8-one-side', 'Use <b>both</b> parallel sides: ' + t('(a+b)\\times h\\div 2') + '.']];
  }
  /* a circle: r = radius; dGiven: the diameter was given; dp = rounding place */
  function circBad(r, dGiven, dp) {
    var o = [[2 * PI * r, 'u3l8-circ', 'That’s the <b>circumference</b> (the distance around). Area: ' + t('A=\\pi r^2') + '.'], [PI * r * 2, 'u3l8-r2', t('r^2') + ' means ' + t('r\\times r') + ', not ' + t('r\\times 2') + '. Use the ' + t('x^2') + ' key.'],
      [PI * r, 'u3l8-no-sq', 'Square the radius: ' + t('A=\\pi\\times r\\times r') + '.'], [r * r, 'u3l8-no-pi', 'Multiply by ' + t('\\pi') + ' too: ' + t('A=\\pi r^2') + '.'], [PI * PI * r * r, 'u3l8-pi-sq', 'Only the radius is squared: ' + t('\\pi\\times r^2') + ', not ' + t('(\\pi r)^2') + '.']];
    if (dGiven) o.unshift([PI * 4 * r * r, 'u3l8-diam', 'You used the <b>diameter</b>. Halve it first to get the radius: ' + t('r=' + N(2 * r) + '\\div 2=' + N(r)) + '.'], [PI * 2 * r * 2, 'u3l8-diam', 'Halve the diameter to get the radius, then square it: ' + t('r\\times r') + '.']);
    else o.push([PI * r * r / 4, 'u3l8-half-r', 'The ' + N(r) + ' is already the radius. Don’t halve it.']);
    o.push([3.14 * r * r, 'u3k-pi314', 'Use the ' + t('\\pi') + ' key on your calculator: 3.14 is a little off, and it changes the rounded answer.', 'form']);
    return o;
  }
  function circSol(r, dGiven, dp, u) { return (dGiven ? [t('r=' + L(2 * r) + '\\div 2=' + N(r) + uT(u))] : []).concat([t('A=\\pi r^2=\\pi\\times ' + N(r) + '^2=\\pi\\times ' + N(q(r * r))), t('A' + eqR(PI * r * r, dp) + u2(u))]); }
  /* area-unit conversion: x from → to by the factor f (mul = big → small). wrongF: [[factor, code, hint]] */
  var CONV = {
    ft2_in2: { f: 144, big: 'ft²', small: 'in²', wrongF: [[12, 'u3l8-12', 'A square foot is 12 in <b>by</b> 12 in: 1 ft² = 12 × 12 = 144 in², not 12 in².']] },
    yd2_ft2: { f: 9, big: 'yd²', small: 'ft²', wrongF: [[3, 'u3l8-3', 'A square yard is 3 ft <b>by</b> 3 ft: 1 yd² = 3 × 3 = 9 ft², not 3 ft².']] },
    m2_cm2: { f: 10000, big: 'm²', small: 'cm²', wrongF: [[100, 'u3l8-100', 'A square metre is 100 cm <b>by</b> 100 cm: 1 m² = 100 × 100 = 10 000 cm².'], [1000, 'u3l8-1000', '1 m² = 100 × 100 = 10 000 cm² (not 1000).']] },
    m2_ft2: { f: 10.76, big: 'm²', small: 'ft²', wrongF: [[3.28, 'u3l8-len-factor', '3.28 is the factor for <b>lengths</b> (1 m ≈ 3.28 ft). For areas use 1 m² ≈ 10.76 ft².']] }
  };
  function convBad(x, c, mul) {
    var b = [[mul ? x / c.f : x * c.f, 'u3l8-wrong-way', mul ? 'You divided. ' + c.big + ' is the <b>bigger</b> unit, so you need <b>more</b> ' + c.small + ': multiply by ' + Np(c.f) + '.' : 'You multiplied. ' + c.small + ' is the <b>smaller</b> unit, so you need <b>fewer</b> ' + c.big + ': divide by ' + Np(c.f) + '.']];
    c.wrongF.forEach(function (w) { b.push([mul ? x * w[0] : x / w[0], w[1], w[2]]); b.push([mul ? x / w[0] : x * w[0], w[1], w[2]]); });
    return b;
  }
  /* a conversion part: k = CONV key; mul = big → small */
  function convPart(prompt, x, k, mul, o) {
    o = o || {}; var c = CONV[k], ans = mul ? x * c.f : x / c.f, to = mul ? c.small : c.big;
    return UF.num(prompt, o.dp != null ? rd(ans, o.dp) : ans, { dp: o.dp, exact: ans, after: to, nr: o.nr, bad: convBad(x, c, mul).concat(o.bad || []),
      sol: [(mul ? 'Big unit → small unit: multiply.' : 'Small unit → big unit: divide.'), t(N(x) + (mul ? '\\times ' : '\\div ') + N(c.f) + eqR(ans, o.dp) + uT(to))],
      hints: ['1 ' + c.big + ' = ' + Np(c.f) + ' ' + c.small + '.', mul ? 'Big unit → small unit: multiply.' : 'Small unit → big unit: divide.'], text: o.text || k });
  }
  function convCell(x, k, mul, dp) { var c = CONV[k], ans = mul ? x * c.f : x / c.f; return UF.chk(dp != null ? rd(ans, dp) : ans, { dp: dp, exact: ans, bad: convBad(x, c, mul) }); }
  function convAns(x, k, mul) { var c = CONV[k]; return mul ? x * c.f : x / c.f; }

  /* a whole-job cost with GST: area × price × 1.05 */
  function gstBad(base) { return [[base, 'u3l8-no-gst', 'That’s the cost before tax. Add the 5% GST: multiply by 1.05.'], [base * 0.05, 'u3l8-gst-only', 'That’s only the GST. Add it to the cost (or multiply the cost by 1.05).'], [base * 1.5, 'u3l8-gst-15', '5% as a decimal is 0.05, so multiply by <b>1.05</b>, not 1.5.'], [base + 5, 'u3l8-gst-plus5', '5% GST is not $5. Multiply the cost by 1.05.']]; }

  HW.addCodes({
    'u3l8-perim': 'Found the perimeter instead of the area', 'u3l8-added': 'Added the lengths instead of multiplying', 'u3l8-half-rect': 'Took half of a rectangle', 'u3l8-sq2': 's² done as s × 2',
    'u3l8-half-para': 'Took half of a parallelogram', 'u3l8-slant': 'Used the slanted side as the height', 'u3l8-no-half': 'Forgot the ½', 'u3l8-double': 'Doubled instead of halving', 'u3l8-quarter': 'Halved twice',
    'u3l8-trap-mult': 'Multiplied the parallel sides instead of adding', 'u3l8-no-h': 'Left out the height', 'u3l8-brackets': 'No brackets: added after multiplying', 'u3l8-one-side': 'Used only one parallel side',
    'u3l8-circ': 'Found the circumference instead of the area', 'u3l8-r2': 'r² done as r × 2', 'u3l8-no-sq': 'Didn’t square the radius', 'u3l8-no-pi': 'Left out π', 'u3l8-pi-sq': 'Squared π too', 'u3l8-diam': 'Used the diameter as the radius', 'u3l8-half-r': 'Halved the radius',
    'u3l8-12': 'Used 12 instead of 144', 'u3l8-3': 'Used 3 instead of 9', 'u3l8-100': 'Used 100 instead of 10 000', 'u3l8-1000': 'Used 1000 instead of 10 000', 'u3l8-len-factor': 'Used a length factor for an area', 'u3l8-wrong-way': 'Multiplied instead of dividing (or the reverse)',
    'u3l8-no-gst': 'Left out the GST', 'u3l8-gst-only': 'Gave only the GST', 'u3l8-gst-15': 'Multiplied by 1.5 for 5%', 'u3l8-gst-plus5': 'Added $5 for 5% GST', 'u3l8-price-div': 'Divided by the price instead of multiplying',
    'u3l8-6in': '6 in written as 0.6 ft', 'u3l8-no-in': 'Left out the inches', 'u3l8-ft2-price': 'Used ft² with a price per yd²', 'u3l8-unrounded': 'Used the unrounded area', 'u3l8-cm2': 'Left the tile area in cm²',
    'u3l8-no-extra': 'Left out the 10% extra', 'u3l8-plus10': 'Added 10 instead of 10%', 'u3l8-per-tile': 'Priced tiles instead of boxes', 'u3l8-one-coat': 'Only one coat', 'u3l8-box': 'Counted the whole box around the shape',
    'u3l8-mistake': 'Chose the wrong mistake', 'u3l8-yd3': 'Divided by 3 instead of 9 for yd²', 'u3l8-yd-x9': 'Multiplied by 9 instead of dividing'
  });
  HW.addPartial({ 'u3l8-perim': 'n', 'u3l8-slant': 'b', 'u3l8-no-half': 'b', 'u3l8-r2': 'b', 'u3l8-diam': 'b', 'u3l8-12': 'b', 'u3l8-3': 'b', 'u3l8-100': 'b', 'u3l8-no-gst': 'b', 'u3l8-6in': 'b', 'u3l8-no-extra': 'b', 'u3l8-unrounded': 's', 'u3l8-ft2-price': 'b' });

  /* ================= part builders ================= */
  function areaNum(prompt, A, u, bad, sol, hints, text, o) { o = o || {}; return UF.num(prompt, o.dp != null ? rd(A, o.dp) : A, { dp: o.dp, exact: A, after: u + '²', nr: o.nr, bad: bad, sol: sol, hints: hints, text: text }); }
  function areaMix(prompt, A, u, bad, sol, hints, text) { return UF.mixPart(prompt, f8(A), { after: u + '²', bad: bad, sol: sol, hints: hints, text: text }); }
  function rectPart(prompt, l, w, u, o) {
    o = o || {}; var A = l * w;
    var sol = [t('A=lw=' + L(l) + '\\times ' + L(w) + '=' + (o.mix ? L(A) : N(q(A))) + u2(u))];
    return o.mix ? areaMix(prompt, A, u, rectBad(l, w, L), sol, ['Area of a rectangle = length × width.'], o.text || 'rect area') : areaNum(prompt, A, u, rectBad(l, w), sol, ['Area of a rectangle = length × width.'], o.text || 'rect area');
  }
  function paraPart(prompt, b, h, sl, u, o) {
    o = o || {}; var A = b * h, sol = [t('A=bh=' + L(b) + '\\times ' + L(h) + '=' + (o.mix ? L(A) : N(q(A))) + u2(u))].concat(sl ? ['(The slanted side, ' + N(sl) + ' ' + u + ', is not used.)'] : []);
    return o.mix ? areaMix(prompt, A, u, paraBad(b, h, sl), sol, ['Area of a parallelogram = base × height (the straight-across height).'], o.text || 'para area') : areaNum(prompt, A, u, paraBad(b, h, sl), sol, ['Area of a parallelogram = base × height. The height is at a right angle to the base.'], o.text || 'para area');
  }
  function triPart(prompt, b, h, u, o) {
    o = o || {}; var A = b * h / 2, sol = [t('A=\\tfrac12 bh'), t('A=' + L(b) + '\\times ' + L(h) + '\\div 2=' + (o.mix ? L(b * h) : N(q(b * h))) + '\\div 2=' + (o.mix ? L(A) : N(q(A))) + u2(u))];
    return o.mix ? areaMix(prompt, A, u, triBad(b, h), sol, ['Area of a triangle = base × height ÷ 2.'], o.text || 'tri area') : areaNum(prompt, A, u, triBad(b, h), sol, ['Area of a triangle = base × height ÷ 2.'], o.text || 'tri area');
  }
  function trapPart(prompt, a, b, h, u, o) {
    o = o || {}; var A = (a + b) * h / 2, Lf = o.mix ? L : N;
    var sol = [t('A=\\tfrac12(a+b)h'), t('A=(' + Lf(a) + '+' + Lf(b) + ')\\times ' + Lf(h) + '\\div 2'), t('=' + Lf(q(a + b)) + '\\times ' + Lf(h) + '\\div 2=' + Lf(q((a + b) * h)) + '\\div 2=' + Lf(q(A)) + u2(u))];
    return o.mix ? areaMix(prompt, A, u, trapBad(a, b, h), sol, ['Add the two parallel sides, multiply by the height, then divide by 2.'], o.text || 'trap area') : areaNum(prompt, A, u, trapBad(a, b, h), sol, ['Add the two parallel sides, multiply by the height, then divide by 2.'], o.text || 'trap area');
  }
  function circPart(prompt, r, dGiven, dp, u, o) {
    o = o || {}; var A = PI * r * r;
    return UF.num(prompt, rd(A, dp), { dp: dp, exact: A, after: u + '²', nr: o.nr, bad: circBad(r, dGiven, dp), sol: circSol(r, dGiven, dp, u).concat(o.solEnd || []),
      hints: (dGiven ? ['The diameter is given: halve it to get the radius.'] : []).concat(['Area of a circle = π × r × r. Use the π key and the ' + t('x^2') + ' key.', 'Round to ' + UF.placeWord(dp) + '.']), text: o.text || 'circle area' });
  }
  function moneyRow(label, x, bad) { return { label: label, name: label.replace(/:$/, ''), ans: rd(x, 2), exact: x, money: true, bad: bad }; }
  function costPart(prompt, x, bad, sol, hints, text) { return UF.num(prompt, rd(x, 2), { money: true, exact: x, bad: bad, sol: sol, hints: hints, text: text }); }

  /* ================= pictures ================= */
  /* three shapes on a 1 cm grid: rect [w, h], para [b, h, off], tri [b, h] */
  function gridPic(rc, pa, tr) {
    var s = 18, rows = 6, x1 = 1, x2 = x1 + rc[0] + 2, x3 = x2 + pa[0] + pa[2] + 2, cols = x3 + tr[0] + 1, top = 18, H = top + rows * s + 4, Wd = cols * s + 4;
    var X = function (u) { return 2 + u * s; }, Y = function (v) { return top + v * s; }, g = '';
    var base = 5;
    g += poly([[X(x1), Y(base)], [X(x1 + rc[0]), Y(base)], [X(x1 + rc[0]), Y(base - rc[1])], [X(x1), Y(base - rc[1])]], SHADE, { w: 0 });
    g += poly([[X(x2), Y(base)], [X(x2 + pa[0]), Y(base)], [X(x2 + pa[0] + pa[2]), Y(base - pa[1])], [X(x2 + pa[2]), Y(base - pa[1])]], SHADE, { w: 0 });
    g += poly([[X(x3), Y(base)], [X(x3 + tr[0]), Y(base)], [X(x3 + tr[0] / 2), Y(base - tr[1])]], SHADE, { w: 0 });
    for (var i = 0; i <= cols; i++) g += ln([X(i), Y(0)], [X(i), Y(rows)], { stroke: '#a9b2bd', w: 0.6 });
    for (var j = 0; j <= rows; j++) g += ln([X(0), Y(j)], [X(cols), Y(j)], { stroke: '#a9b2bd', w: 0.6 });
    g += poly([[X(x1), Y(base)], [X(x1 + rc[0]), Y(base)], [X(x1 + rc[0]), Y(base - rc[1])], [X(x1), Y(base - rc[1])]], 'none');
    g += poly([[X(x2), Y(base)], [X(x2 + pa[0]), Y(base)], [X(x2 + pa[0] + pa[2]), Y(base - pa[1])], [X(x2 + pa[2]), Y(base - pa[1])]], 'none');
    g += poly([[X(x3), Y(base)], [X(x3 + tr[0]), Y(base)], [X(x3 + tr[0] / 2), Y(base - tr[1])]], 'none');
    g += tx(X(x1 + rc[0] / 2), 13, '(a)', 'middle', { size: 13 }) + tx(X(x2 + (pa[0] + pa[2]) / 2), 13, '(b)', 'middle', { size: 13 }) + tx(X(x3 + tr[0] / 2), 13, '(c)', 'middle', { size: 13 });
    return svg(Wd, H, g, 'a rectangle, a parallelogram and a triangle on a centimetre grid', Math.min(540, Wd));
  }
  /* a parallelogram: base b (label), height h (label), slant label; lean: 'right' (top shifted right) or 'left' */
  function paraPic(bl, hl, sl, lean) {
    var s = 22, b = 8, off = 2, h = 3.5, X0 = 20, Y0 = 20 + h * s, g = '', pts;
    if (lean === 'left') pts = [[X0 + off * s, Y0], [X0 + (b + off) * s, Y0], [X0 + b * s, Y0 - h * s], [X0, Y0 - h * s]];
    else pts = [[X0, Y0], [X0 + b * s, Y0], [X0 + (b + off) * s, Y0 - h * s], [X0 + off * s, Y0 - h * s]];
    g += poly(pts, SHADE);
    var hx = lean === 'left' ? X0 + b * s : X0 + off * s;
    g += ln([hx, Y0 - h * s], [hx, Y0], { dash: '5 4' }) + sqMark([hx, Y0], [lean === 'left' ? -1 : 1, 0], [0, -1], 8);
    g += tx(X0 + (lean === 'left' ? off + b / 2 : b / 2) * s, Y0 + 17, bl) + tx(hx + (lean === 'left' ? -6 : 6), Y0 - h * s / 2 + 5, hl, lean === 'left' ? 'end' : 'start');
    if (sl) g += tx(X0 + (b + off / 2) * s + 8, Y0 - h * s / 2 + 5, sl, 'start');
    return svg((b + off) * s + 90, h * s + 48, g, 'a parallelogram with its base, height' + (sl ? ' and slanted side' : '') + ' labelled', 300);
  }

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u3l8', unit: 3, num: '8', title: 'Area of 2-D Shapes', outcome: M4,
    blurb: 'Area of rectangles, parallelograms, triangles, trapezoids and circles, changing between area units, and the cost of a job.',
    questions: [
      { num: '1', stem: function (sh) { return 'Each small square stands for 1 cm². Find the area of each shape by counting. For (b) and (c), check with a formula.' + gridPic(sh.rc, sh.pa, sh.tr); },
        shared: function (r) { return find(function () { return { rc: [r.int(4, 8), r.int(2, 4)], pa: [r.int(4, 6), r.int(2, 4), r.int(1, 2)], tr: [r.pick([4, 6, 8]), r.int(2, 4)] }; }, function (s) { return !(s.rc[0] === 6 && s.rc[1] === 4) && !(s.tr[0] === 4 && s.tr[1] === 4) && s.rc[0] + s.pa[0] + s.pa[2] + s.tr[0] <= 21; }); },
        parts: [
          { id: '1a', level: 'BEG', make: function (r, sh) { var w = sh.rc[0], h = sh.rc[1]; return UF.num('(a) The rectangle:', w * h, { after: 'cm²', bad: [[2 * (w + h), 'u3l8-perim', 'That counts the edges around the outside (the perimeter). Count the squares <b>inside</b>.'], [w + h, 'u3l8-added', 'Count every square inside: ' + h + ' rows of ' + w + '.']],
            sol: [h + ' rows of ' + w + ' squares: ' + t(h + '\\times ' + w + '=' + w * h) + ' squares, so ' + t(w * h + u2('cm')) + '.'], hints: ['Count the rows, and the squares in each row.'], text: 'grid rect' }); } },
          { id: '1b', level: 'EMG', make: function (r, sh) { var b = sh.pa[0], h = sh.pa[1], off = sh.pa[2]; return UF.num('(b) The parallelogram:', b * h, { after: 'cm²', bad: [[(b + off) * h, 'u3l8-box', 'That counts the whole box around the shape. The two corner triangles are not part of it: slide one onto the other.'], [b * h / 2, 'u3l8-half-para', 'Only a triangle has the ½. Slide the triangle on one end to the other end: you get a rectangle.']],
            sol: ['Slide the triangle on the left end to the right end: you get a ' + b + ' by ' + h + ' rectangle.', 'Check: ' + t('A=bh=' + b + '\\times ' + h + '=' + b * h + u2('cm'))], hints: ['Cut the triangle off one end and slide it to the other end.', 'Or use ' + t('A=bh') + ' with the base and the straight-up height.'], text: 'grid para' }); } },
          { id: '1c', level: 'EMG', make: function (r, sh) { var b = sh.tr[0], h = sh.tr[1], A = b * h / 2; return UF.num('(c) The triangle:', A, { after: 'cm²', bad: [[b * h, 'u3l8-no-half', 'That is the whole ' + b + ' by ' + h + ' rectangle around the triangle. The triangle is <b>half</b> of it.'], [b + h, 'u3l8-added', 'Count the full squares, then put the half squares together in pairs.']],
            sol: ['Count the full squares, then pair up the half squares (two halves make one square).', 'Check: ' + t('A=\\tfrac12 bh=' + b + '\\times ' + h + '\\div 2=' + A + u2('cm'))], hints: ['Two half squares make one full square.', 'Or: the triangle is half of a ' + b + ' by ' + h + ' rectangle.'], text: 'grid tri' }); } }] },
      { num: '2', stem: 'Find the area of each rectangle or square.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(5, 12), r.int(3, 9)]; }, function (v) { return v[1] < v[0]; }); return rectPart('(a) ' + v[0] + ' m by ' + v[1] + ' m', v[0], v[1], 'm'); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = find(function () { return [pickR(r, 4.2, 9.8, 0.2), pickR(r, 1.5, 3.5, 0.5)]; }, function (v) { return !(v[0] === 4.2 && v[1] === 3.6); }); return rectPart('(b) ' + N(v[0]) + ' cm by ' + N(v[1]) + ' cm', v[0], v[1], 'cm'); } },
        { id: '2c', level: 'BEG', make: function (r) { var s = r.int(6, 15); return areaNum('(c) a square with sides of ' + s + ' in', s * s, 'in', sqBad(s), [t('A=s\\times s=' + s + '\\times ' + s + '=' + s * s + u2('in'))], ['Area of a square = side × side.'], 'square'); } },
        { id: '2d', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(4, 9), r.int(3, 6) + 0.5]; }, function (v) { return true; }); return rectPart('(d) ' + v[0] + ' ft by ' + t(L(v[1])) + ' ft', v[0], v[1], 'ft', { mix: true }); } }] },
      { num: '3', stem: 'Find the area of each parallelogram.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(9, 15), r.int(4, 7), 0]; }, function (v) { return true; }); v[2] = v[1] + r.int(1, 2); return paraPart('(a)' + paraPic(v[0] + ' cm', v[1] + ' cm', v[2] + ' cm', 'right'), v[0], v[1], v[2], 'cm'); } },
        { id: '3b', level: 'EMG', make: function (r) { var v = find(function () { return [pickR(r, 5.5, 9.5, 0.5), pickR(r, 2.4, 5.8, 0.2)]; }, function (v) { return !(v[0] === 9.5 && v[1] === 5.2); }); return paraPart('(b)' + paraPic(N(v[0]) + ' m', N(v[1]) + ' m', null, 'left'), v[0], v[1], null, 'm'); } }] },
      { num: '4', stem: 'Find the area of each triangle.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(6, 14), r.int(3, 9)]; }, function (v) { return !(v[0] === 8 && v[1] === 5); }); return triPart('(a) base ' + v[0] + ' cm, height ' + v[1] + ' cm', v[0], v[1], 'cm'); } },
        { id: '4b', level: 'EMG', make: function (r) { var v = find(function () { return [pickR(r, 3.2, 6.8, 0.2), r.int(2, 6)]; }, function (v) { return !(v[0] === 6.4 && v[1] === 3.5); }); return triPart('(b) base ' + N(v[0]) + ' m, height ' + v[1] + ' m', v[0], v[1], 'm'); } },
        { id: '4c', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([5, 7, 9, 11, 13]), r.int(3, 8) + 0.5]; }, function (v) { return !(v[0] === 8 && v[1] === 3.5); }); return triPart('(c) base ' + v[0] + ' in, height ' + t(L(v[1])) + ' in', v[0], v[1], 'in', { mix: true }); } }] },
      { num: '5', stem: 'Find the area of each trapezoid.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(3, 8), r.int(6, 14), r.int(3, 8)]; }, function (v) { return v[1] > v[0] + 1 && ((v[0] + v[1]) * v[2]) % 2 === 0; }); return trapPart('(a) parallel sides ' + v[0] + ' cm and ' + v[1] + ' cm, height ' + v[2] + ' cm', v[0], v[1], v[2], 'cm'); } },
        { id: '5b', level: 'PRG', make: function (r) { var v = find(function () { return [r.int(1, 4) + 0.5, r.int(3, 7), r.int(2, 5)]; }, function (v) { return v[1] > v[0]; }); return trapPart('(b) parallel sides ' + t(L(v[0])) + ' ft and ' + v[1] + ' ft, height ' + v[2] + ' ft', v[0], v[1], v[2], 'ft', { mix: true }); } }] },
      { num: '6', stem: 'Complete the table. Round areas to the nearest tenth.', parts: [
        { id: '6ab', sub: 'a–b', level: 'EMG', make: function (r) {
          var ra = find(function () { return r.int(2, 9); }, function (x) { return [4, 5, 8].indexOf(x) < 0; }), db = find(function () { return 2 * r.int(3, 12); }, function (x) { return [8, 10, 16].indexOf(x) < 0 && x !== 2 * ra; }), rb = db / 2;
          return circTable([{ lab: '(a)', r: ra, give: 'r', u: 'cm' }, { lab: '(b)', r: rb, give: 'd', u: 'm' }], 'circle table ab');
        } },
        { id: '6cd', sub: 'c–d', level: 'PRG', make: function (r) {
          var rc = pickR(r, 1.5, 6.5, 1), dd = r.pick([1.5, 2.5, 3.5]);
          return circTable([{ lab: '(c)', r: rc, give: 'r', u: 'ft' }, { lab: '(d)', r: dd / 2, give: 'd', u: 'in' }], 'circle table cd');
        } }] },
      { num: '7', stem: function (sh) { return 'A painter is painting a wall that is ' + N(sh.L) + ' m long and ' + N(sh.H) + ' m high.'; },
        shared: function (r) { return find(function () { var Lw = pickR(r, 3.2, 6, 0.2), H = pickR(r, 2.3, 3, 0.1); return { L: Lw, H: H, A: q(Lw * H), cov: r.pick([10, 10, 12]) }; }, function (s) { return Math.abs(s.A - s.cov) >= 0.6; }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { return rectPart('(a) Find the area of the wall.', sh.L, sh.H, 'm'); } },
          { id: '7b', level: 'EMG', make: function (r, sh) { var enough = sh.A <= sh.cov, need = sh.A / sh.cov;
            return P.mc(r, '(b) One litre of paint covers about ' + sh.cov + ' m². Is 1 L enough for one coat?', [
              { html: enough ? '<b>Yes.</b> The wall is ' + N(sh.A) + ' m², which is less than ' + sh.cov + ' m².' : '<b>No.</b> The wall is ' + N(sh.A) + ' m², which is more than ' + sh.cov + ' m².', right: true },
              { html: enough ? '<b>No.</b> The wall is ' + N(sh.A) + ' m², which is more than ' + sh.cov + ' m².' : '<b>Yes.</b> The wall is ' + N(sh.A) + ' m², which is less than ' + sh.cov + ' m².', why: 'Compare the two numbers again: ' + N(sh.A) + ' is ' + (enough ? 'less' : 'more') + ' than ' + sh.cov + '.', code: 'compare' },
              enough ? { html: '<b>No.</b> The wall needs ' + N(sh.A) + ' L of paint.', why: '1 L covers ' + sh.cov + ' m², so the wall needs ' + t(N(sh.A) + '\\div ' + sh.cov + '\\approx ' + N(rd(need, 2))) + ' L, which is less than 1 L.', code: 'litres' }
                : { html: '<b>Yes.</b> The wall is only ' + N(sh.L) + ' m long, which is less than ' + sh.cov + ' m.', why: 'Paint covers an <b>area</b>. Compare the area of the wall with ' + sh.cov + ' m².', code: 'length' },
              { html: '<b>' + (enough ? 'No' : 'Yes') + '.</b> The perimeter of the wall is ' + N(q(2 * (sh.L + sh.H))) + ' m.', why: 'Paint covers the surface (area), not the edge.', code: 'u3l8-perim' }],
              br(['The wall is ' + N(sh.A) + ' m². ' + (enough ? 'That is less than ' + sh.cov + ' m², so 1 L is enough.' : 'That is more than ' + sh.cov + ' m², so 1 L is not enough (' + t(N(sh.A) + '\\div ' + sh.cov + '\\approx ' + N(rd(need, 2))) + ' L are needed).')]), ['Compare the area from (a) with what 1 L covers.'], 'paint enough'); } }] },
      { num: '8', stem: function (sh) { return 'A sailmaker in ' + sh.town + ' is making a triangular sail with a base of ' + N(sh.b) + ' m and a height of ' + N(sh.h) + ' m. The sail cloth costs ' + Mp(sh.pr) + ' per m².'; },
        shared: function (r) { return { town: r.pick(['Kelowna', 'Sylvan Lake', 'Canmore', 'Nanaimo']), b: pickR(r, 2.2, 3.6, 0.2), h: pickR(r, 3.5, 5.5, 0.5), pr: r.pick([14.5, 16.25, 18.75, 21.4, 19.95]) }; },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { return triPart('(a) Find the area of the sail.', sh.b, sh.h, 'm'); } },
          { id: '8b', level: 'EMG', make: function (r, sh) { var A = sh.b * sh.h / 2, c = A * sh.pr; return costPart('(b) Find the cost of the cloth, to the nearest cent.', c, [[sh.b * sh.h * sh.pr, 'u3l8-no-half', 'Use the area of the <b>triangle</b> (base × height ÷ 2), not the whole rectangle.'], [A / sh.pr, 'u3l8-price-div', 'Cost = area × price per m²: <b>multiply</b>.']],
            [t(N(q(A)) + '\\times ' + M(sh.pr) + HW.pctKit.eqM(c))], ['Cost = area × price per square metre.', 'Round to the nearest cent.'], 'sail cost'); } }] },
      { num: '9', stem: function (sh) { return 'A round ' + sh.what + ' has a diameter of ' + sh.d + ' in. A glass shop charges ' + Mp(sh.pr) + ' per square inch to cut a glass top for it.'; },
        shared: function (r) { return find(function () { return { what: r.pick(['coffee table', 'side table', 'patio table']), d: 2 * r.int(15, 24), pr: r.pick([0.25, 0.3, 0.35, 0.4]) }; }, function (s) { return Math.abs(PI * s.d * s.d / 4 % 1 - 0.5) > 0.05; }); },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { return circPart('(a) Find the area of the top, to the nearest square inch.', sh.d / 2, true, 0, 'in'); } },
          { id: '9b', level: 'EMG', make: function (r, sh) { var A = rd(PI * sh.d * sh.d / 4, 0), c = A * sh.pr, cu = PI * sh.d * sh.d / 4 * sh.pr;
            return costPart('(b) Use your rounded area to find the cost of the glass.', c, [[cu, 'u3l8-unrounded', 'Close! The question says to use your <b>rounded</b> area (' + A + ' in²).', 'form'], [PI * sh.d * sh.d * sh.pr, 'u3l8-diam', 'Use the area from (a): the radius is half the diameter.'], [A / sh.pr, 'u3l8-price-div', 'Cost = area × price per square inch: <b>multiply</b>.']],
              [t(A + '\\times ' + M(sh.pr) + '=' + M(c))], ['Cost = area × price per square inch.'], 'glass cost'); } }] },
      { num: '10', stem: 'Complete the table. Round to the nearest tenth if needed.', parts: [
        { id: '10abc', sub: 'a–c', level: 'EMG', outcome: M2, make: function (r) {
          var a = find(function () { return r.int(2, 9); }, function (x) { return x !== 5; }), b = find(function () { return 144 * r.int(3, 12); }, function (x) { return x !== 2880; }), c = r.int(2, 9);
          return convTable([{ lab: '(a) ' + a + ' ft² to in²', x: a, k: 'ft2_in2', mul: true }, { lab: '(b) ' + b + ' in² to ft²', x: b, k: 'ft2_in2', mul: false }, { lab: '(c) ' + c + ' yd² to ft²', x: c, k: 'yd2_ft2', mul: true }], 'imperial area table');
        } },
        { id: '10de', sub: 'd–e', level: 'EMG', outcome: M1, make: function (r) {
          var d = find(function () { return pickR(r, 1.2, 4.8, 0.1); }, function (x) { return x !== 3.5; }), e = 10000 * pickR(r, 1.5, 9.5, 0.5);
          return convTable([{ lab: '(d) ' + N(d) + ' m² to cm²', x: d, k: 'm2_cm2', mul: true }, { lab: '(e) ' + N(e) + ' cm² to m²', x: e, k: 'm2_cm2', mul: false }], 'SI area table');
        } },
        { id: '10f', sub: 'f', level: 'EMG', outcome: M2, make: function (r) { var x = find(function () { return r.int(8, 40); }, function (x) { return x !== 12 && Math.abs((x * 107.6) % 1 - 0.5) > 0.06; }); return convPart('(f) Change ' + x + ' m² to ft². (1 m² ≈ 10.76 ft²)', x, 'm2_ft2', true, { dp: 1 }); } }] },
      { num: '11', stem: function (sh) { return 'A landscaper is laying sod on a backyard in ' + sh.town + ' that is ' + N(sh.L) + ' m long and ' + N(sh.W) + ' m wide. Sod costs ' + Mp(sh.pr) + ' per m².'; },
        shared: function (r) { return find(function () { return { town: r.pick(['Cochrane', 'Airdrie', 'Chestermere', 'Strathmore']), L: pickR(r, 10.2, 15.8, 0.2), W: pickR(r, 6, 9.5, 0.5), pr: r.pick([3.25, 3.5, 3.85, 4.1, 2.95]) }; }, function (s) { return decs(q(s.L * s.W)) <= 2; }); },
        parts: [
          { id: '11a', level: 'BEG', make: function (r, sh) { return rectPart('(a) Find the area of the yard.', sh.L, sh.W, 'm'); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { var A = q(sh.L * sh.W), base = A * sh.pr, c = rd(base, 2) * 1.05;
            var p = costPart('(b) Find the cost of the sod with 5% GST.', c, gstBad(rd(base, 2)).concat([[2 * (sh.L + sh.W) * sh.pr * 1.05, 'u3l8-perim', 'Sod covers the <b>area</b> of the yard, not the perimeter.'], [A / sh.pr * 1.05, 'u3l8-price-div', 'Cost = area × price per m²: <b>multiply</b>.']]),
              [t(N(A) + '\\times ' + M(sh.pr) + HW.pctKit.eqM(base)), t(M(base) + '\\times 1.05' + HW.pctKit.eqM(c))], ['Cost before tax = area × price per m².', 'Then multiply by 1.05 to add the 5% GST.'], 'sod GST');
            if (!near(rd(base * 1.05, 2), rd(c, 2))) { p.check = UF.chk(rd(c, 2), { money: true, exact: c, alts: [rd(base * 1.05, 2)], bad: gstBad(rd(base, 2)) }); p.good = p.good.concat([rd(base * 1.05, 2).toFixed(2)]); }
            return p; } }] },
      { num: '12', stem: function (sh) { return 'Carpet is often priced by the square yard. A ' + sh.room + ' is ' + sh.L + ' ft long and ' + sh.n + ' ft 6 in wide. The carpet costs ' + Mp(sh.pr) + ' per yd².'; },
        shared: function (r) { return find(function () { return { room: r.pick(['living room', 'family room', 'rec room', 'bedroom']), L: r.pick([12, 14, 15, 16, 18, 20, 21, 24]), n: r.int(10, 14), pr: r.pick([24.95, 28.95, 32.5, 35.99, 26.75]) }; }, function (s) { return (s.L * (2 * s.n + 1)) % 18 === 0 && s.n + 0.5 < s.L; }); },
        parts: [
          { id: '12a', level: 'PRG', make: function (r, sh) { var W = sh.n + 0.5, A = sh.L * W, Y = A / 9;
            return UF.fields('(a) Find the area in ft², then in yd².', [
              { label: 'Area in ft²:', name: 'Square feet', ans: A, after: 'ft²', bad: [[sh.L * (sh.n + 0.6), 'u3l8-6in', '6 in is not 0.6 ft. There are 12 in in a foot: ' + t('6\\div 12=0.5') + ', so ' + sh.n + ' ft 6 in = ' + N(W) + ' ft.'], [sh.L * sh.n, 'u3l8-no-in', 'Include the 6 in: ' + sh.n + ' ft 6 in = ' + N(W) + ' ft.'], [2 * (sh.L + W), 'u3l8-perim', 'That’s the perimeter. Area = length × width.']] },
              { label: 'Area in yd²:', name: 'Square yards', ans: Y, after: 'yd²', bad: [[A / 3, 'u3l8-yd3', '1 yd² is 3 ft <b>by</b> 3 ft = 9 ft². Divide by 9, not 3.'], [A * 9, 'u3l8-yd-x9', 'Square yards are bigger, so there are <b>fewer</b> of them: divide by 9.'], [sh.L * (sh.n + 0.6) / 9, 'u3l8-6in', '6 in = 0.5 ft (not 0.6 ft).']] }],
              [sh.n + ' ft 6 in = ' + N(W) + ' ft (6 ÷ 12 = 0.5)', t(sh.L + '\\times ' + N(W) + '=' + N(A) + u2('ft')), t(N(A) + '\\div 9=' + N(Y) + u2('yd'))], ['Change 6 in to feet: 6 ÷ 12.', '1 yd² = 9 ft², so divide by 9.'], 'carpet area'); } },
          { id: '12b', level: 'EMG', make: function (r, sh) { var A = sh.L * (sh.n + 0.5), Y = A / 9, c = Y * sh.pr;
            return costPart('(b) Find the cost of the carpet before tax.', c, [[A * sh.pr, 'u3l8-ft2-price', 'The price is per <b>square yard</b>. Use the area in yd², not ft².'], [A / 3 * sh.pr, 'u3l8-yd3', 'Use the area in yd² (ft² ÷ 9).'], [c * 1.05, 'u3l8-gst-in', 'The question asks for the cost <b>before</b> tax.']],
              [t(N(Y) + '\\times ' + M(sh.pr) + '=' + M(c))], ['Cost = square yards × price per square yard.'], 'carpet cost'); } }] },
      { num: '13', stem: function (sh) { return sh.who + ' is tiling a kitchen floor that is ' + N(sh.L) + ' m by ' + N(sh.W) + ' m. Each tile is ' + sh.s + ' cm by ' + sh.s + ' cm. Tiles come in boxes of ' + sh.box + ' for ' + Mp(sh.pr) + ' a box.'; },
        shared: function (r) { return find(function () { var s = r.pick([30, 30, 40, 50]), k1 = r.int(6, 14), k2 = r.int(5, 10); return { who: r.pick(['Diego', 'Kenji', 'Malik', 'Priya']), s: s, L: q(s * k1 / 100), W: q(s * k2 / 100), n: k1 * k2, box: r.pick([10, 10, 12, 8]), pr: r.pick([32.49, 29.99, 36.75, 41.5]) }; },
          function (s) { var t2 = Math.ceil(s.n * 1.1 - 1e-9); return s.L >= 2.4 && s.L <= 5 && s.W >= 2 && s.W <= 4 && s.W < s.L && !near(s.n * 1.1, Math.round(s.n * 1.1)) && t2 % s.box !== 0 && decs(s.L) <= 1 && decs(s.W) <= 1; }); },
        parts: [
          { id: '13a', level: 'BEG', make: function (r, sh) { return rectPart('(a) Find the area of the floor in m².', sh.L, sh.W, 'm'); } },
          { id: '13b', level: 'EMG', make: function (r, sh) { var m = sh.s / 100, A = q(m * m);
            return UF.num('(b) Find the area of one tile in m². (Change ' + sh.s + ' cm to metres first.)', A, { after: 'm²', bad: [[sh.s * sh.s, 'u3l8-cm2', 'That’s the area in cm². Change ' + sh.s + ' cm to metres first (' + t(sh.s + '\\div 100=' + N(m)) + '), then multiply.'], [4 * m, 'u3l8-perim', 'That’s the perimeter of the tile. Area = side × side.'], [2 * m, 'u3l8-sq2', 'Multiply the side by itself: ' + t(N(m) + '\\times ' + N(m)) + '.'], [m, 'u3l8-sq2', 'That’s the side length. Area = side × side.'], [sh.s * sh.s / 100, 'u3l8-100', 'Change the side to metres first, then multiply: ' + t(N(m) + '\\times ' + N(m)) + '.']],
              sol: [t(sh.s + '\\text{ cm}=' + sh.s + '\\div 100=' + N(m) + '\\text{ m}'), t(N(m) + '\\times ' + N(m) + '=' + N(A) + u2('m'))], hints: ['1 m = 100 cm.', 'Area of a square = side × side.'], text: 'tile area' }); } },
          { id: '13c', level: 'PRG', make: function (r, sh) { var x = sh.n * 1.1, A = q(sh.L * sh.W), tA = q(sh.s * sh.s / 10000);
            return UF.upPart('(c) How many tiles cover the floor? Add 10% for broken and cut tiles. How many tiles is that?', x, { after: 'tiles', unit: 'tiles', bad: [[sh.n, 'u3l8-no-extra', 'That covers the floor exactly. Add 10% extra: multiply by 1.10.'], [sh.n + 10, 'u3l8-plus10', '10% is not 10 tiles. Multiply by 1.10.'], [A / (sh.s * sh.s), 'u3l8-cm2', 'Use the floor and the tile in the <b>same</b> unit (m²).'], [sh.n * 0.1, 'u3l8-no-extra', 'That’s only the extra. Add it to the ' + sh.n + ' tiles.']],
              sol: [t(N(A) + '\\div ' + N(tA) + '=' + sh.n) + ' tiles', t(sh.n + '\\times 1.10=' + N(q(x))) + ', so round up to ' + Math.ceil(x - 1e-9) + ' tiles'], hints: ['Floor area ÷ one tile’s area = tiles to cover the floor.', 'Multiply by 1.10, then round up (you can’t buy part of a tile).'] }); } },
          { id: '13d', level: 'MAS', make: function (r, sh) { var tiles = Math.ceil(sh.n * 1.1 - 1e-9), bx = tiles / sh.box, B = Math.ceil(bx - 1e-9), c = B * sh.pr;
            return UF.fields('(d) How many boxes must ' + sh.who + ' buy, and what do they cost before tax?', [
              { label: 'Boxes:', name: 'Boxes', up: bx, unit: 'boxes', after: 'boxes', bad: [[tiles, 'u3l8-per-tile', 'That’s the number of <b>tiles</b>. Each box holds ' + sh.box + ': divide by ' + sh.box + '.'], [Math.ceil(sh.n / sh.box - 1e-9), 'u3l8-no-extra', 'Use the number of tiles <b>with</b> the 10% extra (from (c)).']] },
              moneyRow('Cost:', c, [[tiles * sh.pr, 'u3l8-per-tile', 'Each <b>box</b> costs ' + Mp(sh.pr) + '. Multiply the number of boxes by ' + Mp(sh.pr) + '.'], [bx * sh.pr, 'u3k-round-down', 'You must buy whole boxes: round the boxes up first.'], [(B - 1) * sh.pr, 'u3k-round-down', 'Round the boxes <b>up</b>: ' + (B - 1) + ' boxes is not enough tiles.'], [c * 1.05, 'u3l8-gst-in', 'The question asks for the cost <b>before</b> tax.']])],
              [t(tiles + '\\div ' + sh.box + '=' + N(q(bx))) + ', so round up to ' + B + ' boxes', t(B + '\\times ' + M(sh.pr) + '=' + M(c))], ['Tiles from (c) ÷ ' + sh.box + ' per box, then round up.', 'Cost = boxes × price of a box.'], 'tile boxes'); } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'EMG', make: function (r) {
        var v = find(function () { var l = pickR(r, 2, 3.5, 0.5), w = pickR(r, 1.2, 2.6, 0.1); return [l, w, q(l * w)]; }, function (v) { return v[1] < v[0] && decs(v[2]) <= 2 && [7.5, 22.5, 132].indexOf(v[2]) < 0; });
        return UF.num('A rectangular rug has an area of ' + N(v[2]) + ' m². It is ' + N(v[0]) + ' m long. How wide is it? Check your answer.', v[1], { after: 'm', bad: [[v[2] * v[0], 'u3l8-times', 'To find a missing side, <b>divide</b> the area by the side you know: ' + t('w=A\\div l') + '.'], [v[2] - v[0], 'u3l8-sub', 'The sides are multiplied in ' + t('A=lw') + ', so divide: ' + t(N(v[2]) + '\\div ' + N(v[0])) + '.'], [v[0] / v[2], 'u3l8-upside', 'Divide the <b>area</b> by the length.'], [v[2] / 2 - v[0], 'u3l8-perim', 'This is area, not perimeter: ' + t('w=A\\div l') + '.']],
          sol: [t('A=lw') + ', so ' + t('w=A\\div l'), t('w=' + N(v[2]) + '\\div ' + N(v[0]) + '=' + N(v[1]) + uT('m')), 'Check: ' + t(N(v[0]) + '\\times ' + N(v[1]) + '=' + N(v[2])) + ' ✓', 'The rug is ' + N(v[1]) + ' m wide.'], hints: ['Divide the area by the length.'], text: 'rug width' });
      } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.int(6, 14), r.int(3, 9)]; }, function (v) { return v[0] !== v[1] && (v[0] * v[1]) % 2 === 0 && v[0] + v[1] !== v[0] * v[1] / 2; }), b = v[0], h = v[1];
        var o = [[b + h, 0, 'That adds the numbers. Area multiplies: ' + t('b\\times h\\div 2') + '.', 'u3l8-added'], [b * h / 2, 1], [b * h, 0, 'Don’t forget the ½: that is a whole rectangle, double the triangle.', 'u3l8-no-half'], [2 * b * h, 0, 'That doubles instead of halving.', 'u3l8-double']];
        o.sort(function (a, c) { return a[0] - c[0]; });
        return P.mc(r, 'A triangle has a base of ' + b + ' m and a height of ' + h + ' m. Its area is', o.map(function (x) { return { html: x[0] + ' m²', right: !!x[1], why: x[2], code: x[3] }; }), br([t(b + '\\times ' + h + '\\div 2=' + b * h / 2 + u2('m'))]), ['Area of a triangle = base × height ÷ 2.'], 'tri MC', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'BEG', outcome: M2, make: function (r) {
        var n = r.int(2, 6), o = [[12 * n, 0, 'A square foot is 12 in <b>by</b> 12 in = 144 in², not 12.', 'u3l8-12'], [144, 0, 'That is only 1 ft². Multiply by ' + n + '.', 'u3l8-one'], [144 * n, 1], [144 * n * n, 0, 'That squares the ' + n + ' as well: it is a ' + n + ' ft by ' + n + ' ft square, not ' + n + ' ft².', 'u3l8-sq-n']];
        return P.mc(r, 'How many square inches are in ' + n + ' ft²?', o.map(function (x) { return { html: Np(x[0]) + ' in²', right: !!x[1], why: x[2], code: x[3] }; }), br([t(n + '\\times 144=' + 144 * n + u2('in'))]), ['1 ft² = 12 in × 12 in = 144 in².'], 'ft2 MC', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var rr = find(function () { return pickR(r, 3, 5.4, 0.1); }, function (x) { return Math.abs((PI * x * x * 10) % 1 - 0.5) > 0.06 && decs(x) === 1; });
        return circPart('<b>Numerical response.</b> A round hot tub cover has a radius of ' + N(rr) + ' ft. Its area, to the nearest tenth of a square foot, is ___ ft².', rr, false, 1, 'ft', { nr: true });
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.int(12, 24), r.int(9, 18)]; }, function (v) { return v[1] < v[0] && (v[0] * v[1]) % 9 === 0; }), A = v[0] * v[1];
        return UF.num('<b>Numerical response.</b> A ' + r.pick(['bedroom', 'basement room', 'office']) + ' is ' + v[0] + ' ft long and ' + v[1] + ' ft wide. The number of square yards of carpet needed to cover the floor is ___ yd².', A / 9, { nr: true, after: 'yd²',
          bad: [[A / 3, 'u3l8-yd3', '1 yd² is 3 ft by 3 ft = 9 ft². Divide by 9, not 3.'], [A, 'u3l8-ft2', 'That’s the area in ft². Change it to yd²: divide by 9.'], [(v[0] / 3) + (v[1] / 3), 'u3l8-added', 'Find the area first (length × width), then divide by 9.']],
          sol: [t(v[0] + '\\times ' + v[1] + '=' + A + u2('ft')), t(A + '\\div 9=' + A / 9 + u2('yd'))], hints: ['Find the area in ft², then divide by 9 (1 yd² = 9 ft²).'], text: 'carpet yd2' });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: '', parts: [{ id: 'e1', level: 'BEG', make: function (r) {
        var per = ['putting a fence around a dog run', 'gluing trim around a window', 'nailing baseboard around a room', 'putting edging around a flower bed', 'hanging lights along the edge of a roof', 'sewing binding around a quilt'];
        var ar = ['painting a ceiling', 'laying carpet in a hallway', 'laying sod on a lawn', 'tiling a bathroom floor', 'covering a woodpile with a tarp', 'staining the top of a deck'];
        var rows = r.shuffle(r.sample(per, 2).map(function (s) { return { html: s, w: 'p' }; }).concat(r.sample(ar, 2).map(function (s) { return { html: s, w: 'a' }; }))), want = {};
        rows.forEach(function (x, i) { x.id = 'j' + i; want[x.id] = x.w; });
        return P.grid('Does each job need the <b>area</b> or the <b>perimeter</b>?', rows.map(function (x) { return { id: x.id, html: x.html }; }), [{ id: 'a', html: 'area' }, { id: 'p', html: 'perimeter' }], want,
          { why: function (row, got) { return { code: got === 'a' ? 'u3l8-perim' : 'u3l8-area', hint: got === 'a' ? 'Something that goes <b>around</b> the edge (fence, trim, edging) is a perimeter.' : 'Something that <b>covers</b> the surface (paint, carpet, sod) is an area.' }; } },
          rows.map(function (x) { return x.html + ': ' + (x.w === 'a' ? 'area (covers the surface)' : 'perimeter (goes around)'); }).join('<br>'), ['Around the edge → perimeter. Covering the surface → area.'], 'area or perimeter');
      } }] },
      { num: '2', stem: 'Find the area of each shape.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var v = [r.int(9, 18), pickR(r, 2.5, 6.5, 0.5)]; return rectPart('(a) rectangle: ' + v[0] + ' cm by ' + N(v[1]) + ' cm', v[0], v[1], 'cm'); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var v = [r.int(5, 12), r.int(2, 6) + 0.5]; return paraPart('(b) parallelogram: base ' + v[0] + ' ft, height ' + t(L(v[1])) + ' ft', v[0], v[1], null, 'ft', { mix: true }); } },
        { id: 'e2c', level: 'BEG', make: function (r) { var v = [r.int(8, 16), pickR(r, 3.5, 9.5, 0.5)]; return triPart('(c) triangle: base ' + v[0] + ' m, height ' + N(v[1]) + ' m', v[0], v[1], 'm'); } },
        { id: 'e2d', level: 'PRG', make: function (r) { var v = find(function () { return [r.int(2, 5), r.int(5, 10), r.int(1, 4) + 0.5]; }, function (v) { return v[1] > v[0] + 1; }); return trapPart('(d) trapezoid: parallel sides ' + v[0] + ' in and ' + v[1] + ' in, height ' + t(L(v[2])) + ' in', v[0], v[1], v[2], 'in', { mix: true }); } }] },
      { num: '3', stem: 'Find the area of each circle, to the nearest tenth.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var rr = find(function () { return r.int(3, 12); }, function (x) { return [4, 5, 8].indexOf(x) < 0; }); return circPart('(a) radius ' + rr + ' cm', rr, false, 1, 'cm'); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var d = r.pick([3, 5, 7, 9, 11]); return circPart('(b) diameter ' + d + ' ft', d / 2, true, 1, 'ft'); } }] },
      { num: '4', stem: 'Change each area. Round to the nearest tenth if needed.', parts: [
        { id: 'e4a', level: 'BEG', outcome: M2, make: function (r) { var x = r.int(2, 8); return convPart('(a) ' + x + ' yd² to ft²', x, 'yd2_ft2', true); } },
        { id: 'e4b', level: 'BEG', outcome: M2, make: function (r) { var x = 144 * r.int(3, 9); return convPart('(b) ' + x + ' in² to ft²', x, 'ft2_in2', false); } },
        { id: 'e4c', level: 'BEG', outcome: M1, make: function (r) { var x = pickR(r, 0.2, 0.9, 0.1); return convPart('(c) ' + N(x) + ' m² to cm²', x, 'm2_cm2', true); } },
        { id: 'e4d', level: 'EMG', outcome: M2, make: function (r) { var x = find(function () { return r.int(20, 90); }, function (x) { return Math.abs((x / 10.76 * 10) % 1 - 0.5) > 0.06; }); return convPart('(d) ' + x + ' ft² to m² (1 m² ≈ 10.76 ft²)', x, 'm2_ft2', false, { dp: 1 }); } }] },
      { num: '5', stem: function (sh) { return sh.who + ' found the area of this parallelogram. She wrote ' + t('A=' + sh.b + '\\times ' + sh.s + '=' + sh.b * sh.s + u2('cm')) + '.' + paraPic(sh.b + ' cm', sh.h + ' cm', sh.s + ' cm', 'right'); },
        shared: function (r) { var h = r.int(3, 7); return { who: r.pick(['Jen', 'Mia', 'Kayla', 'Hana']), b: r.int(8, 14), h: h, s: h + r.int(1, 2) }; },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, '(a) What was her mistake?', [
              { html: 'She used the slanted side (' + sh.s + ' cm) instead of the height (' + sh.h + ' cm). The height is at a right angle to the base.', right: true },
              { html: 'She forgot to divide by 2.', why: 'Only a triangle has the ½. A parallelogram is base × height.', code: 'u3l8-half-para' },
              { html: 'She should have added the sides.', why: 'Adding the sides gives (half) the perimeter. Area multiplies.', code: 'u3l8-added' },
              { html: 'She should have multiplied all three numbers.', why: 'Area of a parallelogram uses two numbers: the base and the height.', code: 'u3l8-mult3' }],
              br(['She used the slanted side, ' + sh.s + ' cm. The height must be at a right angle to the base (the dashed line): ' + sh.h + ' cm.']), ['Which length is at a right angle to the base?'], 'Jen mistake'); } },
          { id: 'e5b', level: 'BEG', make: function (r, sh) { return paraPart('(b) Find the correct area.', sh.b, sh.h, sh.s, 'cm'); } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var rr = find(function () { return pickR(r, 4.5, 10, 0.5); }, function (x) { return Math.abs((PI * x * x) % 1 - 0.5) > 0.05; });
        return circPart('A lawn sprinkler turns in a full circle and sprays water ' + N(rr) + ' m from where it sits. What area of lawn does it water, to the nearest square metre?', rr, false, 0, 'm');
      } }] },
      { num: '7', stem: function (sh) { return 'A triangular ' + sh.what + ' has a base of ' + sh.b + ' cm and a height of ' + sh.h + ' cm.'; },
        shared: function (r) { return find(function () { return { what: r.pick(['yield sign', 'warning sign', 'pennant']), b: r.int(6, 12) * 10, h: r.int(50, 100) }; }, function (s) { return s.h < s.b + 10; }); },
        parts: [
          { id: 'e7a', level: 'BEG', make: function (r, sh) { return triPart('(a) Find its area in cm².', sh.b, sh.h, 'cm'); } },
          { id: 'e7b', level: 'EMG', outcome: M1, make: function (r, sh) { return convPart('(b) Change the area to m².', sh.b * sh.h / 2, 'm2_cm2', false, { bad: [[sh.b * sh.h / 10000, 'u3l8-no-half', 'Use your area from (a) (with the ÷ 2).']] }); } }] },
      { num: '8', stem: function (sh) { return sh.who + ' is staining a rectangular deck that is ' + sh.L + ' ft by ' + sh.W + ' ft. He wants two coats. One can of stain covers ' + sh.cov + ' ft² and costs ' + Mp(sh.pr) + '.'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Ben', 'Liam', 'Omar', 'Theo']), L: r.int(12, 24), W: r.int(8, 16), cov: r.pick([200, 250, 300]), pr: r.pick([39.99, 49.99, 54.99, 44.97]) }; }, function (s) { var x = 2 * s.L * s.W / s.cov; return s.W < s.L && x > 1.1 && x < 4 && Math.abs(x - Math.round(x)) > 0.1 && Math.ceil(s.L * s.W / s.cov) !== Math.ceil(x); }); },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) { var A = sh.L * sh.W; return UF.num('(a) What area will the stain cover in all, for two coats?', 2 * A, { after: 'ft²', bad: [[A, 'u3l8-one-coat', 'That’s one coat. Two coats cover the deck twice.'], [4 * (sh.L + sh.W), 'u3l8-perim', 'Use the area (length × width), not the perimeter.']], sol: [t(sh.L + '\\times ' + sh.W + '=' + A + u2('ft')), 'Two coats: ' + t('2\\times ' + A + '=' + 2 * A + u2('ft'))], hints: ['Find the area of the deck, then double it for two coats.'], text: 'stain area' }); } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) { var x = 2 * sh.L * sh.W / sh.cov; return UF.upPart('(b) How many cans must he buy?', x, { after: 'cans', unit: 'cans', bad: [[Math.ceil(sh.L * sh.W / sh.cov), 'u3l8-one-coat', 'That’s enough for one coat. Use the area for <b>two</b> coats.']], sol: [t(2 * sh.L * sh.W + '\\div ' + sh.cov + '=' + N(rd(x, 3))) + ', so round up to ' + Math.ceil(x) + ' cans'], hints: ['Area for two coats ÷ area one can covers.', 'Round up: you can’t buy part of a can.'] }); } },
          { id: 'e8c', level: 'PRG', make: function (r, sh) { var n = Math.ceil(2 * sh.L * sh.W / sh.cov - 1e-9), base = n * sh.pr, c = base * 1.05; return costPart('(c) What do the cans cost with 5% GST?', c, gstBad(base).concat([[2 * sh.L * sh.W / sh.cov * sh.pr * 1.05, 'u3k-round-down', 'Use the whole number of cans from (b).']]), [t(n + '\\times ' + M(sh.pr) + '=' + M(base)), t(M(base) + '\\times 1.05' + HW.pctKit.eqM(c))], ['Cost of the cans × 1.05.'], 'stain cost'); } }] },
      { num: '9', stem: '', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
        var s = find(function () { return { a: pickR(r, 3.5, 5.5, 0.5), b: pickR(r, 1.5, 3, 0.5), h: pickR(r, 1.5, 3, 0.5), cov: r.pick([0.5, 0.75, 1, 1.5]), pr: r.pick([6.97, 5.49, 7.99, 8.47]) }; }, function (s) { var A = (s.a + s.b) * s.h / 2, x = A / s.cov; return s.b < s.a && Math.abs(x - Math.round(x)) > 0.1; });
        var A = (s.a + s.b) * s.h / 2, x = A / s.cov, B = Math.ceil(x - 1e-9), c = B * s.pr;
        return UF.fields('A flower bed is a trapezoid with parallel sides of ' + N(s.a) + ' m and ' + N(s.b) + ' m that are ' + N(s.h) + ' m apart. One bag of bark mulch covers ' + N(s.cov) + ' m² and costs ' + Mp(s.pr) + '. How many bags are needed, and what do they cost before tax?', [
          { label: 'Bags:', name: 'Bags', up: x, unit: 'bags', after: 'bags', bad: [[(s.a + s.b) * s.h / s.cov, 'u3l8-no-half', 'Find the trapezoid’s area with the ½: ' + t('(a+b)\\times h\\div 2') + '.'], [A * s.cov, 'u3l8-price-div', 'Divide the area by what one bag covers.']] },
          moneyRow('Cost:', c, [[x * s.pr, 'u3k-round-down', 'Buy whole bags: round the bags up first.'], [A * s.pr, 'u3l8-per-m2', 'The price is per <b>bag</b>, not per m². Multiply the number of bags by ' + Mp(s.pr) + '.'], [(B - 1) * s.pr, 'u3k-round-down', 'Round the bags <b>up</b>.']])],
          [t('A=(' + N(s.a) + '+' + N(s.b) + ')\\times ' + N(s.h) + '\\div 2=' + N(q(A)) + u2('m')), t(N(q(A)) + '\\div ' + N(s.cov) + '=' + N(rd(x, 3)) + (near(x, rd(x, 3)) ? '' : '\\ldots')) + ', so round up to ' + B + ' bags', t(B + '\\times ' + M(s.pr) + '=' + M(c))], ['Find the area of the trapezoid first.', 'Area ÷ area one bag covers, then round up.'], 'mulch');
      } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var s = find(function () { var sq = r.int(4, 7), a = r.int(6, 10), b = r.int(2, 5), rc = r.int(2, 4), tb = r.int(8, 12), th = r.int(4, 7); return { sq: sq, a: a, b: b, rc: rc, tb: tb, th: th, A: [sq * sq, a * b, PI * rc * rc, tb * th / 2] }; }, function (s) { var so = s.A.slice().sort(function (x, y) { return y - x; }); return so[0] - so[1] >= 1.5 && s.A.every(function (x) { return x > 8; }) && s.a !== s.b; });
        var nm = ['a square with sides of ' + s.sq + ' m', 'a rectangle ' + s.a + ' m by ' + s.b + ' m', 'a circle with a radius of ' + s.rc + ' m', 'a triangle with a base of ' + s.tb + ' m and a height of ' + s.th + ' m'], big = s.A.indexOf(Math.max.apply(null, s.A));
        var why = ['Work out each area. The square is ' + s.A[0] + ' m².', 'Work out each area. The rectangle is ' + s.A[1] + ' m².', 'Work out each area: the circle is ' + t('\\pi\\times ' + s.rc + '^2\\approx ' + N(rd(s.A[2], 1))) + ' m².', 'Work out each area. Don’t forget the ½: the triangle is ' + N(s.A[3]) + ' m².'];
        return P.mc(r, 'Which shape has the largest area?', nm.map(function (h, i) { return { html: h, right: i === big, why: i === big ? null : why[i], code: 'shape' + i }; }),
          br(['Square: ' + t(s.sq + '\\times ' + s.sq + '=' + s.A[0]) + ' m²', 'Rectangle: ' + t(s.a + '\\times ' + s.b + '=' + s.A[1]) + ' m²', 'Circle: ' + t('\\pi\\times ' + s.rc + '^2\\approx ' + N(rd(s.A[2], 1))) + ' m²', 'Triangle: ' + t(s.tb + '\\times ' + s.th + '\\div 2=' + N(s.A[3])) + ' m²', 'The largest is the ' + ['square', 'rectangle', 'circle', 'triangle'][big] + '.']), ['Find the area of each shape, then compare.'], 'largest', true);
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var d = r.pick([12, 14, 18, 20, 9, 11]);
        return circPart('<b>Numerical response.</b> The area of the top of a ' + d + ' in pizza (its diameter is ' + d + ' in), to the nearest square inch, is ___ in².', d / 2, true, 0, 'in', { nr: true });
      } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'ADV', make: function (r) {
        var k = r.chance(0.65) ? 2 : 3, s = r.int(2, 6), who = r.pick(['Marco', 'Devon', 'Kai']), A1 = s * s, A2 = k * s * k * s, word = k === 2 ? 'double' : 'triple';
        return P.mc(r, who + ' says, “If you ' + word + ' the side length of a square, you ' + word + ' its area.” Test the idea with a square that has sides of ' + s + ' ft. Is ' + who + ' right?', [
          { html: '<b>No.</b> A ' + s + ' ft square is ' + A1 + ' ft² and a ' + k * s + ' ft square is ' + A2 + ' ft², which is ' + k * k + ' times as big, because both the length and the width are ' + (k === 2 ? 'doubled' : 'tripled') + '.', right: true },
          { html: '<b>Yes.</b> A ' + s + ' ft square is ' + A1 + ' ft² and a ' + k * s + ' ft square is ' + k * A1 + ' ft².', why: 'Work out the bigger square: ' + t(k * s + '\\times ' + k * s + '=' + A2) + ', not ' + k * A1 + '.', code: 'yes' },
          { html: '<b>No.</b> The area becomes ' + (k + 1) + ' times as big.', why: 'Test it: ' + t(A2 + '\\div ' + A1 + '=' + k * k) + '.', code: 'k1' },
          { html: '<b>Yes.</b> The perimeter is ' + (k === 2 ? 'doubled' : 'tripled') + ', so the area is too.', why: 'The perimeter does get ' + (k === 2 ? 'doubled' : 'tripled') + ', but the area doesn’t. Work out both areas.', code: 'perim' }],
          br([s + ' ft square: ' + t(s + '\\times ' + s + '=' + A1 + u2('ft')), k * s + ' ft square: ' + t(k * s + '\\times ' + k * s + '=' + A2 + u2('ft')), t(A2 + '\\div ' + A1 + '=' + k * k) + '. ' + who + ' is not right: the area is ' + k * k + ' times as big, because both the length and the width are ' + (k === 2 ? 'doubled' : 'tripled') + '.']), ['Find the area of both squares and compare.'], 'Marco');
      } }] },
      { num: '13', stem: function (sh) { return 'A room is ' + N(sh.L) + ' m long and ' + N(sh.W) + ' m wide. The flooring ' + sh.who + ' likes is sold by the square foot, at ' + Mp(sh.pr) + ' per ft².'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Lena', 'Aisha', 'Sofia', 'Jaya']), L: pickR(r, 3.2, 5.4, 0.1), W: pickR(r, 2.5, 4, 0.5), pr: r.pick([2.99, 3.29, 3.79, 4.49]) }; }, function (s) { var A = q(s.L * s.W), F = A * 10.76; return s.W < s.L && decs(A) <= 2 && Math.abs((F * 10) % 1 - 0.5) > 0.06 && !near(rd(rd(F, 1) * s.pr, 2), rd(F * s.pr, 2)); }); },
        parts: [
          { id: 'e13a', level: 'ADV', outcome: M2, make: function (r, sh) { var A = q(sh.L * sh.W), F = A * 10.76;
            return UF.fields('(a) Find the area in m², then change it to ft² using 1 m² ≈ 10.76 ft². Round to the nearest tenth.', [
              { label: 'Area in m²:', name: 'Square metres', ans: A, after: 'm²', bad: [[2 * (sh.L + sh.W), 'u3l8-perim', 'That’s the perimeter. Area = length × width.']] },
              { label: 'Area in ft²:', name: 'Square feet', ans: rd(F, 1), dp: 1, exact: F, after: 'ft²', bad: convBad(A, CONV.m2_ft2, true) }],
              [t(N(sh.L) + '\\times ' + N(sh.W) + '=' + N(A) + u2('m')), t(N(A) + '\\times 10.76' + eqR(F, 1) + u2('ft'))], ['Area = length × width.', 'm² → ft²: multiply by 10.76.'], 'Lena area'); } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) { var A = q(sh.L * sh.W), F = A * 10.76, c = rd(F, 1) * sh.pr;
            var p = costPart('(b) Find the cost of the flooring before tax.', c, [[A * sh.pr, 'u3l8-ft2-price', 'The price is per <b>square foot</b>. Use the area in ft² from (a), not m².'], [A / 10.76 * sh.pr, 'u3l8-wrong-way', 'm² → ft² is multiplying by 10.76: there are more ft² than m².'], [c * 1.05, 'u3l8-gst-in', 'The question asks for the cost <b>before</b> tax.']],
              [t(N(rd(F, 1), 1) + '\\times ' + M(sh.pr) + HW.pctKit.eqM(c)), '(Using the unrounded ' + N(rd(F, 3)) + ' ft² gives ' + Mp(F * sh.pr) + ', which is also fine.)'], ['Cost = square feet × price per square foot.'], 'Lena cost');
            p.check = UF.chk(rd(c, 2), { money: true, exact: c, alts: [rd(F * sh.pr, 2)], bad: [[A * sh.pr, 'u3l8-ft2-price', 'The price is per <b>square foot</b>. Use the area in ft² from (a), not m².'], [A / 10.76 * sh.pr, 'u3l8-wrong-way', 'm² → ft² is multiplying by 10.76: there are more ft² than m².'], [c * 1.05, 'u3l8-gst-in', 'The question asks for the cost <b>before</b> tax.']] });
            p.good = (p.good || []).concat([rd(F * sh.pr, 2).toFixed(2)]);
            return p; } }] },
      { num: '14', stem: function (sh) { return 'A rectangular banner for a school event must have an area of ' + N(sh.A) + ' m². It is ' + N(sh.h) + ' m high.'; },
        shared: function (r) { return find(function () { var h = r.pick([0.8, 1.2, 1.5, 0.75]), l = pickR(r, 1.5, 4, 0.5); return { h: h, l: l, A: q(h * l), pr: r.pick([12.4, 9.95, 14.6, 11.25]) }; }, function (s) { return decs(s.A) <= 2 && s.l > s.h; }); },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) { return UF.num('(a) How long must the banner be? Check your answer.', sh.l, { after: 'm', bad: [[sh.A * sh.h, 'u3l8-times', 'To find a missing side, <b>divide</b> the area by the side you know.'], [sh.h / sh.A, 'u3l8-upside', 'Divide the <b>area</b> by the height.'], [sh.A - sh.h, 'u3l8-sub', 'Area = length × height, so divide.']],
            sol: [t('l=A\\div w=' + N(sh.A) + '\\div ' + N(sh.h) + '=' + N(sh.l) + uT('m')), 'Check: ' + t(N(sh.l) + '\\times ' + N(sh.h) + '=' + N(sh.A)) + ' ✓'], hints: ['Divide the area by the height.'], text: 'banner length' }); } },
          { id: 'e14b', level: 'ADV', make: function (r, sh) { var F = q(sh.A * 1.1), c = F * sh.pr; return costPart('(b) Fabric costs ' + Mp(sh.pr) + ' per m². The sign maker buys 10% extra for hems. What does the fabric cost?', c, [[sh.A * sh.pr, 'u3l8-no-extra', 'Add the 10% extra first: multiply the area by 1.10.'], [(sh.A + 10) * sh.pr, 'u3l8-plus10', '10% is not 10 m². Multiply by 1.10.'], [sh.A * 0.1 * sh.pr, 'u3l8-no-extra', 'That’s only the extra. Use the whole area × 1.10.'], [sh.A * sh.pr * 1.05, 'u3l8-gst-in', 'Add 10% extra fabric (× 1.10). There is no tax in this question.']],
            [t(N(sh.A) + '\\times 1.10=' + N(F) + u2('m')), t(N(F) + '\\times ' + M(sh.pr) + HW.pctKit.eqM(c))], ['Area × 1.10 for the extra, then × the price per m².'], 'banner cost'); } }] }
    ]
  });
  HW.addCodes({ 'u3l8-times': 'Multiplied instead of dividing', 'u3l8-sub': 'Subtracted instead of dividing', 'u3l8-upside': 'Divided the wrong way', 'u3l8-ft2': 'Gave ft² instead of yd²', 'u3l8-one': 'Gave 1 ft² only', 'u3l8-sq-n': 'Squared the number of ft² too',
    'u3l8-area': 'Chose area for something that goes around', 'u3l8-mult3': 'Multiplied all three lengths', 'u3l8-per-m2': 'Priced per m² instead of per bag', 'u3l8-gst-in': 'Added tax that wasn’t asked for' });

  /* ---- tables (defined after the lesson object, hoisted) ---- */
  /* rows: [{ lab, r, give: 'r' | 'd', u }] → Radius | Diameter | Area (to the tenth) */
  function circTable(rows, text) {
    var blanks = [], keyC = [], sol = [], cells = [];
    rows.forEach(function (x, i) {
      var A = PI * x.r * x.r, d = 2 * x.r;
      if (x.give === 'r') { cells.push([N(x.r) + uT(x.u), null, null]); blanks.push({ i: i, j: 1, name: x.lab + ' diameter', chk: UF.chk(d, { bad: [[x.r / 2, 'u3l7-half', 'The diameter is <b>twice</b> the radius.'], [x.r * x.r, 'u3l8-sq2', 'The diameter is 2 × the radius.']] }) }); }
      else { cells.push([null, L(d) + uT(x.u), null]); blanks.push({ i: i, j: 0, name: x.lab + ' radius', chk: UF.mixChk(fr(x.r, 4), { bad: [[2 * d, 'u3l7-times', 'The radius is <b>half</b> the diameter: divide by 2.']] }) }); }
      blanks.push({ i: i, j: 2, name: x.lab + ' area', chk: UF.chk(rd(A, 1), { dp: 1, exact: A, bad: circBad(x.r, x.give === 'd', 1) }) });
      keyC.push([N(x.r) + uT(x.u), (x.give === 'r' ? N(d) : L(d)) + uT(x.u), N(rd(A, 1), 1) + u2(x.u)]);
      sol.push(x.lab + ' ' + (x.give === 'r' ? t('d=2\\times ' + N(x.r) + '=' + N(d)) : t('r=' + L(d) + '\\div 2=' + N(x.r))) + '; ' + t('A=\\pi\\times ' + N(x.r) + '^2' + eqR(A, 1) + u2(x.u)));
    });
    return UF.table('Fill in the empty boxes. (Type the number only; the units are in the table.)', { rows: rows.map(function (x) { return '\\text{' + x.lab + '}'; }), cols: ['\\text{Radius}', '\\text{Diameter}', '\\text{Area}'], cells: cells }, blanks, keyC, sol,
      ['Radius = diameter ÷ 2, and diameter = 2 × radius.', 'Area = π × r × r. Round to the nearest tenth.'], text);
  }
  /* rows: [{ lab, x, k, mul }] → one Answer column */
  function convTable(rows, text) {
    var blanks = rows.map(function (x, i) { return { i: i, j: 0, name: x.lab.replace(/ .*/, ''), chk: convCell(x.x, x.k, x.mul) }; });
    var keyC = rows.map(function (x) { var c = CONV[x.k]; return [N(convAns(x.x, x.k, x.mul)) + uT(x.mul ? c.small : c.big)]; });
    var sol = rows.map(function (x) { var c = CONV[x.k], a = convAns(x.x, x.k, x.mul); return x.lab.replace(/ .*/, '') + ' ' + t(N(x.x) + (x.mul ? '\\times ' : '\\div ') + N(c.f) + '=' + N(a) + uT(x.mul ? c.small : c.big)); });
    return UF.table('Change each area. (Type the number only.)', { rows: rows.map(function (x) { return ('\\text{' + x.lab + '}').replace(/²/g, '}^2\\text{'); }), cols: ['\\text{Answer}'], cells: rows.map(function () { return [null]; }), corner: '\\text{Change}' }, blanks, keyC,
      sol, ['1 ft² = 144 in², 1 yd² = 9 ft², 1 m² = 10 000 cm².', 'Big unit → small unit: multiply. Small unit → big unit: divide.'], text);
  }
})(window);
