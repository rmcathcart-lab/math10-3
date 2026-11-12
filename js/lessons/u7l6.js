/* Math 10-3 · Unit 7 · Lesson 6 — The Cosine Ratio (G4; finding the hypotenuse, the unknown on the bottom: A1)
 * Assignment 6 (u7_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u7_ep06.tex, A 1–5, B 6–10, C 11–13).
 * Every part is a generator: the booklet item's situation and difficulty with new numbers around the booklet's (the
 * lesson's worked-example numbers are left out: the 25° table (2.7/3, 4.5/5, 6.3/7), the 9-40-41 triangle, the cosine table
 * angles 10°, 25°, 40°, 55°, 70°, 85° and cos 20°/sin 70°, 28°/15 cm, the 24 ft ladder at 75°, 41°/8.5 m, the 7.2 m garage
 * at 26°, the four "choose the ratio" triangles (40°/12, 25°/8, 62°/5, 33°/7) and the 16 m auger at 32°).
 * Calculator allowed, in DEG mode. Lengths to the nearest tenth, cosine values to 4 decimal places.
 * Uses HW.u7trig, the sine/cosine kit from js/lessons/u7l5.js (loaded just before this file): figures, the opp/adj/hyp
 * labelling table, the fraction + decimal boxes, sides with the unknown on top (× cos θ) or on the bottom (÷ cos θ, A1)
 * with HW.geo.lenChk (RAD mode, × vs ÷, the wrong ratio, the cosine rounded too early), calculator values, RAD-mode MC.
 * Local checkers: typed side names (opp/adj/hyp) and ratio names (sin/cos/tan) for "know / want / use", the tent floor
 * (half only, sine, rounding the half), the ski trail (no cosines, one slope only, rounding each slope first), the ramp
 * rise (sine, cosine, ÷ tan; the hypotenuse × sin θ is accepted), sin E from cos D (1 − cos, the other leg).
 * Conversions: labelling → a table of choices; "write cos as a fraction and a decimal" → a fraction box + a decimal box;
 * "why are the answers the same / which is bigger, explain / how can you tell / what was the mistake / will it fit /
 * is it reasonable / explain why it can't be true / what do you notice" → multiple choice of reasons (with the numbers);
 * "know / want / use" → three typed-word boxes (opp, adj, hyp / sin, cos, tan); "choose sin, cos or tan, then find x" →
 * a word box + a number box; "which is θ closer to" → multiple choice; "sketch the triangle" → the sketch is in the
 * worked solution; the stretch "cos 50° ≈ 0.6428, find sin 40° without a calculator" → cos D given, find sin E (no
 * angles, so a calculator cannot shortcut it). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, G = HW.geo, T = HW.u7trig;
  if (!T) throw new Error('js/lessons/u7l6.js needs HW.u7trig from js/lessons/u7l5.js: load it first');
  var TR = T.TR, TRR = T.TRR, N = T.N, NT = T.NT, f1 = T.f1, f2 = T.f2, f4 = T.f4, fd = T.fd, dots = T.dots, deg = T.deg, steps = T.steps, find = T.find, clean = T.clean;
  var oneDec = T.oneDec, half = T.half, excluded = T.excluded, same = T.same, rd = T.rd, q = T.q, readPlain = T.readPlain, decsOf = T.decsOf, badList = T.badList;
  var RAD = Math.PI / 180;

  HW.addCodes({
    'u7l6-word': 'Typed something other than opp/adj/hyp or sin/cos/tan', 'u7l6-know': 'Named the known side wrongly', 'u7l6-want': 'Named the wanted side wrongly', 'u7l6-use': 'Chose the wrong ratio',
    'u7l6-sim': 'Thought the ratio changes with the size of the triangle', 'u7l6-closer': 'Compared the cosines the wrong way', 'u7l6-bigger-cos': 'Thought a bigger angle has a bigger cosine',
    'u7l6-neg': 'Did not see that a cosine can’t be negative', 'u7l6-half-only': 'Found only half of the width (forgot to double)', 'u7l6-step-round': 'Rounded a first step too early',
    'u7l6-no-cos': 'Added the slope lengths without using cosine', 'u7l6-one-slope': 'Used only one slope', 'u7l6-sin': 'Used sine instead of cosine', 'u7l6-frame': 'Left out (or half-counted) the frame',
    'u7l6-compare': 'Compared the numbers the wrong way', 'u7l6-diag': 'Compared the diagonal instead of the width', 'u7l6-pads': 'Compared one pad instead of all of them',
    'u7l6-one-minus': 'Thought sine and cosine add to 1', 'u7l6-other-leg': 'Used the other leg (sin D / cos E)', 'u7l6-cosA': 'Gave cos A instead of cos B', 'u7l6-tan': 'Gave a tangent', 'u7l6-equal': 'Said sine and cosine are always equal',
    'u7l6-same-side': 'Thought the same side is adjacent to both angles', 'u7l6-ratio-lt1': 'Reason: the angle, not the sides', 'u7l6-measure': 'Blamed measuring, not the sides', 'u7l6-1to12': 'Misread the 1 : 12 check'
  });

  /* ================= small builders ================= */
  var LETTERS = T.LETTERS;
  /* a triangle with named vertices (no θ mark): nm = [at A, at B, at C (right angle)], sides { a: BC, b: AC, c: AB } (numbers or text) */
  function namedFig(r, nm, sd, o) {
    o = o || {}; var or = r.pick(T.ORIENT[o.orient || 'std']), th = Math.max(22, Math.min(68, Math.atan2(sd.a, sd.b) / RAD));
    return G.rightTriSVG({ c: 1, A: th, right: or.right, rot: or.rot || 0, flip: !!or.flip, names: nm, sides: { a: o.lab ? o.lab.a : N(sd.a), b: o.lab ? o.lab.b : N(sd.b), c: o.lab ? o.lab.c : N(sd.c) }, width: o.width || 250 });
  }
  /* cos (or sin) of a named angle: a fraction box + a decimal box */
  function vfracPart(prompt, fn, V, s, figure, text) {
    var top = s[T.TOP[fn]], val = top / s.hyp, fr = '\\dfrac{' + NT(top) + '}{' + NT(s.hyp) + '}', fx = '\\' + fn + ' ' + V;
    var p = P.fields(prompt + '<br>' + figure, [{ label: t(fx + '='), name: 'Fraction', mode: 'math', keys: 'fraction' }, { label: t(fx + '\\approx'), name: 'Decimal' }],
      [T.fracChk(fn, s), T.decChk(fn, s)], ['\\frac{' + NT(top) + '}{' + NT(s.hyp) + '}', f4(val)], t(fx + '=' + fr + '\\approx ' + f4(val)),
      steps(['The leg ' + (T.TOP[fn] === 'adj' ? 'touching' : 'across from') + ' ' + t('\\angle ' + V) + ' is ' + N(top) + '; the hyp (across from the right angle) is ' + N(s.hyp) + '.', t(fx + '=' + fr + '\\approx ' + f4(val))]),
      ['The hyp is across from the right angle. The adj is the leg that touches ' + t('\\angle ' + V) + '.', 'CAH: cos = adj ÷ hyp. Round the decimal to 4 places.'], text || 'cos of a named angle');
    p.bad = [['\\frac{' + NT(s[T.TOP[fn] === 'adj' ? 'opp' : 'adj']) + '}{' + NT(s.hyp) + '}', f4(val)], ['\\frac{' + NT(top) + '}{' + NT(s.hyp) + '}', f4(s[T.TOP[fn] === 'adj' ? 'opp' : 'adj'] / s.hyp)]];
    return p;
  }
  /* typed words: kind 'side' (opp/adj/hyp) or 'fn' (sin/cos/tan) */
  var WORDS = { side: { opp: /^(opp|opposite|o)$/, adj: /^(adj|adjacent|a)$/, hyp: /^(hyp|hypotenuse|hypot|h)$/ }, fn: { sin: /^(sin|sine|soh|sin ?θ|sin ?theta|sin ?x)$/, cos: /^(cos|cosine|cah|cos ?θ|cos ?theta|cos ?x)$/, tan: /^(tan|tangent|toa|tan ?θ|tan ?theta|tan ?x)$/ } };
  function wordOf(kind, resp) { var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').trim().toLowerCase().replace(/[.\s]+$/, '').replace(/\s+/g, ' '); if (!s) return { empty: true }; var tb = WORDS[kind]; for (var k in tb) if (tb[k].test(s)) return { w: k }; return { unknown: true }; }
  function wordChk(kind, want, code, hintFor) {
    return function (resp) {
      var g = wordOf(kind, resp);
      if (g.empty) return form('empty', kind === 'side' ? 'Type opp, adj or hyp.' : 'Type sin, cos or tan.');
      if (g.unknown) return form('u7l6-word', kind === 'side' ? 'Type one of the side names: <b>opp</b>, <b>adj</b> or <b>hyp</b>.' : 'Type one of the ratios: <b>sin</b>, <b>cos</b> or <b>tan</b>.');
      return g.w === want ? ok() : wrong(code, hintFor(g.w));
    };
  }
  var FN_OF = { 'opp-hyp': 'sin', 'hyp-opp': 'sin', 'adj-hyp': 'cos', 'hyp-adj': 'cos', 'opp-adj': 'tan', 'adj-opp': 'tan' };
  var PAIR_TXT = { sin: 'opp and hyp (SOH)', cos: 'adj and hyp (CAH)', tan: 'opp and adj (TOA)' };
  var WHERE = { opp: 'is across from the angle (it does not touch it): the <b>opp</b>', adj: 'touches the angle and is not the hyp: the <b>adj</b>', hyp: 'is across from the right angle: the <b>hyp</b>' };
  function useHint(know, want) { return function () { return 'You know the <b>' + know + '</b> and want the <b>' + want + '</b>. Which ratio uses both? SOH CAH TOA: it is ' + PAIR_TXT[FN_OF[know + '-' + want]].replace(/ \(.*/, '') + ' → <b>' + FN_OF[know + '-' + want] + '</b>.'; }; }
  /* the figure for "know / want": the angle, one numbered side and x */
  function kwFig(r, th, know, want, val, o) { var lab = {}; lab[know] = String(val); lab[want] = 'x'; return T.fig(r, { th: th, lab: lab, ang: N(th) + '°', orient: (o && o.orient) || 'std', width: 230 }).svg; }
  /* x from a ratio: { fn, op, v } for a known side (role) and a wanted side (role) */
  function solveFor(th, know, want, val) {
    var fn = FN_OF[know + '-' + want], top = fn === 'tan' ? 'opp' : fn === 'sin' ? 'opp' : 'adj', bot = fn === 'tan' ? 'adj' : 'hyp';
    var onTop = want === top, F = TR[fn](th), v = onTop ? val * F : val / F;
    return { fn: fn, op: onTop ? 'mul' : 'div', v: v, top: top, bot: bot, onTop: onTop };
  }
  function solveSol(th, know, want, val, unit) {
    var s = solveFor(th, know, want, val), fx = '\\' + s.fn + ' ' + deg(th), u = unit ? '\\text{ ' + unit + '}' : '';
    return steps(['Know the ' + know + ' (' + N(val) + '), want the ' + want + ' (' + t('x') + '): <b>' + s.fn + '</b>.',
      t(fx + '=' + (s.onTop ? '\\dfrac{x}{' + NT(val) + '}' : '\\dfrac{' + NT(val) + '}{x}')),
      t('x=' + (s.onTop ? NT(val) + '\\times' + fx : '\\dfrac{' + NT(val) + '}{' + fx + '}') + '=' + dots(s.v) + '\\approx ' + f1(s.v) + u)]);
  }

  /* ================= lesson data ================= */
  var EX_ADJ = [[28, 15], [75, 24], [32, 16], [25, null], [40, 12]];
  var EX_HYP = [[41, 8.5], [26, 3.6], [62, 5]];
  var EX_ANG = [10, 25, 40, 55, 70, 85, 20];
  function adjNums(r, lo, hi, sideGen) { return find(function () { var th = r.int(lo, hi), s = sideGen(); return { th: th, s: s, v: s * TR.cos(th) }; }, function (z) { return !excluded(EX_ADJ, z.th, z.s) && clean(z.v); }, { th: 34, s: 10, v: 10 * TR.cos(34) }); }
  function hypNums(r, lo, hi, sideGen, max) { return find(function () { var th = r.int(lo, hi), s = sideGen(); return { th: th, s: s, v: s / TR.cos(th) }; }, function (z) { return !excluded(EX_HYP, z.th, z.s) && clean(z.v) && (!max || z.v < max); }, { th: 47, s: 14.2, v: 14.2 / TR.cos(47) }); }
  function angPick(r, lo, hi) { return find(function () { return r.int(lo, hi); }, function (d) { return EX_ANG.indexOf(d) < 0; }, lo + 1); }

  HW.defineLesson({
    id: 'u7l6', unit: 7, num: '6', title: 'The Cosine Ratio', outcome: 'G4',
    blurb: 'Cosine = adj ÷ hyp: labelling sides, cosine values on the calculator, finding the adjacent side (multiply) and the hypotenuse (divide), and choosing sin, cos or tan.',
    questions: [
      { num: '1', stem: 'Label the sides of each triangle hyp, opp and adj from the angle θ.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return T.labelPart(r, { orient: 'std', th: r.int(28, 42), prompt: '' }); } },
        { id: '1b', level: 'BEG', make: function (r) { return T.labelPart(r, { orient: 'turn', th: r.int(42, 56), prompt: '' }); } },
        { id: '1c', level: 'EMG', make: function (r) { return T.labelPart(r, { orient: 'any', th: r.int(30, 62), prompt: '' }); } }] },
      { num: '2', stem: function (sh) { return 'In ' + t('\\triangle ' + sh.nm.join('')) + ', ' + t('\\angle ' + sh.nm[2] + '=90^\\circ') + '.'; },
        shared: function (r) { var s3 = T.pickTri(r, 'int', [[9, 40, 41]]), sw = r.chance(0.5); return { nm: r.shuffle(r.pick(LETTERS)), a: sw ? s3[1] : s3[0], b: sw ? s3[0] : s3[1], c: s3[2], seed: r.int(1, 1e6) }; },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) { var fg = namedFig(HW.rng(sh.seed), sh.nm, sh); return vfracPart('Write ' + t('\\cos ' + sh.nm[0]) + ' as a fraction and as a decimal to 4 places.', 'cos', sh.nm[0], { opp: sh.a, adj: sh.b, hyp: sh.c }, fg, 'cos of one angle'); } },
          { id: '2b', level: 'EMG', make: function (r, sh) { var fg = namedFig(HW.rng(sh.seed), sh.nm, sh); return vfracPart('Write ' + t('\\cos ' + sh.nm[1]) + ' as a fraction and as a decimal to 4 places.', 'cos', sh.nm[1], { opp: sh.b, adj: sh.a, hyp: sh.c }, fg, 'cos of the other angle'); } }] },
      { num: '3', stem: function (sh) {
          var svg = function (k) { return G.rightTriSVG({ c: 1, A: sh.th, right: 'br', names: false, theta: 'A', thetaLabel: 'θ', sides: { a: N(q(k * sh.o)), b: N(q(k * sh.a)), c: N(q(k * sh.h)) }, width: 150 + 40 * k }); };
          return 'The two right triangles below both have the angle θ.<div style="display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap">' + svg(1) + svg(sh.k) + '</div>';
        },
        shared: function (r) {
          return find(function () { var s3 = T.pickTri(r, r.pick(['int', 'scaled']), [[9, 40, 41]]), sw = r.chance(0.5), o = sw ? s3[1] : s3[0], a = sw ? s3[0] : s3[1]; return { o: o, a: a, h: s3[2], k: r.pick([1.5, 2, 2.5, 3]), th: Math.atan2(o, a) / RAD }; },
            function (z) { var fr = z.th - Math.floor(z.th); return z.h <= 41 && Math.abs(fr - 0.5) > 0.15 && z.th > 12 && z.th < 78; }, { o: 5, a: 12, h: 13, k: 2.5, th: Math.atan2(5, 12) / RAD });
        },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) {
            var rat = sh.a / sh.h, chk = function () { return K.near(rat, 4, { alts: [{ v: sh.o / sh.h, code: 'u7l5-dec-cos', hint: 'That is opp ÷ hyp. Use the side that <b>touches</b> θ (adj) over the hyp.' }, { v: sh.h / sh.a, code: 'u7l5-dec-upside', hint: 'Divide the adj by the hyp (the hyp goes on the bottom).' }, { v: sh.o / sh.a, code: 'u7l5-dec-tan', hint: 'That is opp ÷ adj. Use adj ÷ hyp.' }] }); };
            return P.fields('Find ' + t('\\dfrac{\\text{adj}}{\\text{hyp}}') + ' for each triangle, to 4 decimal places.', [{ label: 'Small triangle:', name: 'Small' }, { label: 'Large triangle:', name: 'Large' }], [chk(), chk()], [f4(rat), f4(rat)],
              'Small: ' + f4(rat) + ', &nbsp; Large: ' + f4(rat), steps([t(NT(sh.a) + '\\div ' + NT(sh.h) + '\\approx ' + f4(rat)), t(NT(q(sh.k * sh.a)) + '\\div ' + NT(q(sh.k * sh.h)) + '\\approx ' + f4(rat))]),
              ['The adj touches θ; the hyp is across from the right angle (the longest side).'], 'adj over hyp');
          } },
          { id: '3b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Why are the two answers the same?', [
              { html: 'The triangles share the angle θ, so they are similar (each side is ' + N(sh.k) + ' times as long). Similar triangles have the same ratios.', right: true },
              { html: 'Both triangles are right triangles, and every right triangle has the same cosine.', why: 'Right triangles with different angles have different cosines. These two have the <b>same angle</b> θ.', code: 'u7l6-sim' },
              { html: 'The bigger triangle has longer sides, so its ratio is a little bigger; the rounding hides it.', why: 'The ratio does not depend on the size: each side is multiplied by the same ' + N(sh.k) + '.', code: 'u7l6-sim' },
              { html: 'The hypotenuses are the same length.', why: 'Look again: the hypotenuses are ' + N(sh.h) + ' and ' + N(q(sh.k * sh.h)) + '. The angle is what is the same.', code: 'u7l6-same-side' }],
              'Each side of the large triangle is ' + N(sh.k) + ' times the small one (' + t(NT(q(sh.k * sh.a)) + '=' + NT(sh.k) + '\\times ' + NT(sh.a)) + '), so the triangles are similar and adj ÷ hyp is the same. It depends only on θ.', ['What do the two triangles have in common?'], 'why the same');
          } },
          { id: '3c', level: 'PRG', make: function (r, sh) {
            var d1 = Math.floor(sh.th), d2 = d1 + 1, rat = sh.a / sh.h, c1 = TR.cos(d1), c2 = TR.cos(d2), near2 = Math.abs(c2 - rat) < Math.abs(c1 - rat), dn = near2 ? d2 : d1, df = near2 ? d1 : d2;
            return P.mc(r, 'Find ' + t('\\cos ' + deg(d1)) + ' and ' + t('\\cos ' + deg(d2)) + '. Is θ closer to ' + d1 + '° or to ' + d2 + '°?', [
              { html: 'Closer to <b>' + dn + '°</b>: ' + t('\\cos ' + deg(dn)) + ' is closer to ' + f4(rat) + ' than ' + t('\\cos ' + deg(df)) + ' is.', right: true },
              { html: 'Closer to <b>' + df + '°</b>: ' + t('\\cos ' + deg(df)) + ' is closer to ' + f4(rat) + ' than ' + t('\\cos ' + deg(dn)) + ' is.', why: 'Find both cosines to 4 decimal places and subtract each from ' + f4(rat) + '. Which difference is smaller?', code: 'u7l6-closer' },
              { html: 'Closer to <b>' + d2 + '°</b>: a bigger cosine means a bigger angle.', why: 'It is the other way round: as the angle gets bigger, the cosine gets <b>smaller</b>.', code: 'u7l6-bigger-cos' },
              { html: 'Neither: θ must be exactly ' + d1 + '° or ' + d2 + '° for the cosine to work.', why: 'θ can be any size. Compare ' + f4(rat) + ' with the two cosines.', code: 'u7l6-closer' }],
              steps([t('\\cos ' + deg(d1) + '\\approx ' + f4(c1)) + ', &nbsp; ' + t('\\cos ' + deg(d2) + '\\approx ' + f4(c2)) + ', &nbsp; adj ÷ hyp ' + t('\\approx ' + f4(rat)), f4(rat) + ' is closer to ' + f4(near2 ? c2 : c1) + ', so θ is closer to <b>' + dn + '°</b>.']),
              ['Find both cosines. Which one is closer to your answer from (a)?'], 'closer angle');
          } }] },
      { num: '4', stem: 'Use your calculator in DEG mode.',
        shared: function (r) { return { a: [angPick(r, 6, 18), angPick(r, 42, 52), angPick(r, 60, 68), angPick(r, 76, 84)], e: find(function () { return [angPick(r, 15, 35), angPick(r, 45, 65)]; }, function (p) { return p[1] - p[0] >= 15; }, [26, 52]) }; },
        parts: [
          { id: '4a', sub: 'a–d', level: 'BEG', make: function (r, sh) { return T.valuesPart('cos', sh.a, { prompt: 'Find each value to 4 decimal places.' }); } },
          { id: '4e', sub: 'e', level: 'EMG', make: function (r, sh) {
            var a = sh.e[0], b = sh.e[1];
            return P.mc(r, 'Without a calculator, which is bigger, ' + t('\\cos ' + deg(a)) + ' or ' + t('\\cos ' + deg(b)) + '? Why?', [
              { html: t('\\cos ' + deg(a)) + ': as the angle gets bigger, the cosine gets smaller.', right: true },
              { html: t('\\cos ' + deg(b)) + ': as the angle gets bigger, the cosine gets bigger.', why: 'That is true for sine, not cosine. With a bigger angle the adjacent side gets <b>shorter</b>, so adj ÷ hyp gets smaller.', code: 'u7l6-bigger-cos' },
              { html: 'They are equal: every cosine is between 0 and 1.', why: 'Both are between 0 and 1, but they are not equal. Think about how the adj changes as the angle grows.', code: 'u7l6-equal' },
              { html: t('\\cos ' + deg(b)) + ': ' + b + '° is closer to 90°, and cos 90° is the biggest.', why: t('\\cos 90^\\circ=0') + ': the cosine is smallest near 90°. A small angle has an adj almost as long as the hyp.', code: 'u7l6-bigger-cos' }],
              t('\\cos ' + deg(a)) + ' is bigger. As the angle gets bigger, the cosine gets smaller. (Check: ' + t('\\cos ' + deg(a) + '\\approx ' + f4(TR.cos(a))) + ', ' + t('\\cos ' + deg(b) + '\\approx ' + f4(TR.cos(b))) + '.)', ['Picture a small angle: the adj is almost as long as the hyp. What happens as the angle grows?'], 'which is bigger');
          } }] },
      { num: '5', stem: function (sh) { return sh.who + ' presses cos ' + sh.d + ' ) ENTER and gets ' + t(fd(Math.cos(sh.d), 6)) + '.'; },
        shared: function (r) { var d = find(function () { return r.int(15, 80); }, function (x) { return Math.cos(x) < -0.2 && EX_ANG.indexOf(x) < 0; }, 60); return { d: d, who: r.pick(['Riley', 'Jordan', 'Casey', 'Avery']) }; },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'How do you know this is wrong without doing any math?', [
              { html: 'The cosine of an acute angle is always between 0 and 1. It can’t be negative.', right: true },
              { html: 'A cosine must be bigger than 1.', why: 'adj ÷ hyp: the adj is shorter than the hyp, so a cosine is <b>less</b> than 1.', code: 'u7l6-neg' },
              { html: 'The answer should be ' + sh.d + ', the same as the angle.', why: 'cos ' + sh.d + '° is a ratio of two sides, not the angle itself.', code: 'u7l6-neg' },
              { html: 'It has too many decimal places.', why: 'Calculators often show many decimals. The problem is the minus sign.', code: 'u7l6-neg' }],
              'cos θ = adj ÷ hyp, two lengths, so it is between 0 and 1 for an acute angle. A negative value must be wrong.', ['cos θ = adj ÷ hyp. Can a length be negative?'], 'negative cosine');
          } },
          { id: '5b', level: 'BEG', make: function (r, sh) { return T.radMC(r, 'cos', sh.d, sh.who, 'what to fix', 'What is the most likely reason, and what should ' + sh.who + ' fix?'); } }] },
      { num: '6', stem: 'Find x. Round to the nearest tenth.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var z = adjNums(r, 20, 40, function () { return r.int(8, 25); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'adj', { unit: 'cm', orient: 'std', text: 'adj from hyp' }); } },
        { id: '6b', level: 'BEG', make: function (r) { var z = adjNums(r, 42, 60, function () { return oneDec(r, 4.2, 9.8); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'adj', { unit: 'm', orient: 'turn', text: 'adj from hyp' }); } },
        { id: '6c', level: 'EMG', make: function (r) { var z = adjNums(r, 62, 78, function () { return r.int(30, 60); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'adj', { unit: 'in', orient: 'any', text: 'adj from hyp' }); } }] },
      { num: '7', outcome: 'A1', stem: 'Find x. Round to the nearest tenth.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var z = hypNums(r, 22, 38, function () { return r.int(4, 12); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'hyp', { unit: 'cm', orient: 'std', text: 'hyp from adj' }); } },
        { id: '7b', level: 'EMG', make: function (r) { var z = hypNums(r, 40, 55, function () { return oneDec(r, 6.5, 16.5); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'hyp', { unit: 'm', orient: 'turn', text: 'hyp from adj' }); } },
        { id: '7c', level: 'PRG', make: function (r) { var z = hypNums(r, 60, 72, function () { return oneDec(r, 2.2, 5.2); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'hyp', { unit: 'ft', orient: 'any', text: 'hyp from adj' }); } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'EMG', make: function (r) {
          var z = find(function () { var L = r.int(18, 40), th = r.int(52, 70); return { L: L, th: th, v: L * TR.cos(th) }; }, function (z) { return clean(z.v) && !(z.L === 25 && z.th === 62); }, { L: 25, th: 62, v: 25 * TR.cos(62) });
          var fg = T.fig(r, { th: z.th, at: 'A', lab: { hyp: z.L + ' m', adj: 'd' }, ang: z.th + '°', orient: 'std', width: 210 }).svg;
          return T.sidePart('cos', z.th, z.L, 'adj', { unit: 'm', x: 'd', figure: fg, prompt: 'A guy wire runs from the top of a radio tower to an anchor in the ground. The wire is ' + z.L + ' m long and makes a ' + z.th + '° angle with the ground. How far is the anchor from the base of the tower? Round to the nearest tenth of a metre.',
            sol0: ['The wire is the hyp; ' + t('d') + ' touches the ' + z.th + '° angle, so it is the adj.'], words: 'The anchor is about # from the base of the tower.', text: 'guy wire' });
        } }] },
      { num: '9', outcome: 'A1', stem: '', parts: [
        { id: '9', level: 'PRG', make: function (r) {
          var z = find(function () { var d = r.int(20, 50), th = r.int(38, 62); return { d: d, th: th, v: d / TR.cos(th) }; }, function (z) { return clean(z.v) && !(z.d === 35 && z.th === 48); }, { d: 35, th: 48, v: 35 / TR.cos(48) });
          var who = r.pick(['Mila', 'Sofia', 'Hana', 'Grace']);
          var sk = T.fig(r, { th: z.th, at: 'A', lab: { adj: z.d + ' m (ground)', hyp: 's (string)' }, ang: z.th + '°', orient: 'std', width: 230 }).svg;
          return T.sidePart('cos', z.th, z.d, 'hyp', { unit: 'm', x: 's', prompt: who + ' flies a kite on a straight string. The string makes a ' + z.th + '° angle with the ground. The kite is right above a fence post that is ' + z.d + ' m from ' + who + ' (measured along the ground). Find the length of the string to the nearest tenth of a metre. (Treat ' + who + '’s hand as being at ground level.)',
            sol0: [sk, 'Sketch: the right angle is at the fence post. ' + z.d + ' m touches the ' + z.th + '° angle (adj); the string ' + t('s') + ' is the hyp.'], words: 'The string is about # long.', text: 'kite string' });
        } }] },
      { num: '10', stem: function (sh) { return 'A TV is sold as a ' + sh.D + '-inch TV: its diagonal is ' + sh.D + ' in. The diagonal makes a ' + sh.th + '° angle with the bottom edge of the screen.' + T.fig(HW.rng(sh.seed), { th: sh.th, at: 'A', lab: { hyp: sh.D + ' in', adj: 'w' }, ang: sh.th + '°', orient: 'std', width: 230 }).svg; },
        shared: function (r) {
          return find(function () {
            var D = r.pick([43, 50, 55, 58, 65, 70, 75, 85]), th = r.pick([28, 29, 30, 31]), w = D * TR.cos(th), W = Math.round(rd(w, 1) + 1 + r.pick([-0.7, -0.4, 0.3, 0.6]));
            return { D: D, th: th, w: w, W: W, seed: r.int(1, 1e6) };
          }, function (z) { var tot = rd(z.w, 1) + 1; return clean(z.w) && Math.abs(tot - z.W) >= 0.2 && !(z.D === 65 && z.th === 29 && z.W === 58); }, { D: 65, th: 29, w: 65 * TR.cos(29), W: 58, seed: 7 });
        },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { return T.sidePart('cos', sh.th, sh.D, 'adj', { unit: 'in', x: 'w', prompt: 'How wide is the screen, to the nearest tenth of an inch?', words: 'The screen is about # wide.', text: 'TV width' }); } },
          { id: '10b', level: 'PRG', make: function (r, sh) {
            var w = rd(sh.w, 1), tot = q(w + 1), fits = tot < sh.W, half = q(w + 0.5);
            return P.mc(r, 'Will the TV fit in a cabinet opening that is ' + sh.W + ' in wide? (The frame adds about half an inch on each side.)', [
              { html: (fits ? '<b>Yes</b>: ' : '<b>No</b>: ') + t(fd(w, 1) + '+0.5+0.5=' + fd(tot, 1)) + ' in, which is ' + (fits ? 'less' : 'more') + ' than ' + sh.W + ' in.', right: true },
              { html: (fits ? '<b>No</b>: ' : '<b>Yes</b>: ') + t(fd(w, 1) + '+0.5+0.5=' + fd(tot, 1)) + ' in, which is ' + (fits ? 'less' : 'more') + ' than ' + sh.W + ' in.', why: 'Compare again: the TV with its frame is ' + fd(tot, 1) + ' in wide and the opening is ' + sh.W + ' in.', code: 'u7l6-compare' },
              { html: (half < sh.W ? '<b>Yes</b>: ' : '<b>No</b>: ') + t(fd(w, 1) + '+0.5=' + fd(half, 1)) + ' in.', why: 'The frame is on <b>both</b> sides: add half an inch twice.', code: 'u7l6-frame' },
              { html: '<b>No</b>: the TV is ' + sh.D + ' in, which is more than ' + sh.W + ' in.', why: sh.D + ' in is the <b>diagonal</b>. The width is the adjacent side, ' + fd(w, 1) + ' in.', code: 'u7l6-diag' }],
              steps(['Width with the frame: ' + t(fd(w, 1) + '+0.5+0.5=' + fd(tot, 1)) + ' in.', fd(tot, 1) + ' in ' + (fits ? '&lt;' : '&gt;') + ' ' + sh.W + ' in, so ' + (fits ? 'yes, it fits.' : 'no, it does not fit.')]),
              ['Add the frame on both sides to your width from (a). Compare with the opening.'], 'TV fits');
          } }] },
      { num: '11', outcome: 'A1', stem: '', parts: [
        { id: '11', level: 'PRG', make: function (r) {
          var z = find(function () { var d = 50 * r.int(16, 30), th = r.int(15, 30); return { d: d, th: th, v: d / TR.cos(th) }; }, function (z) { return clean(z.v, 0) && !(z.d === 1150 && z.th === 22); }, { d: 1150, th: 22, v: 1150 / TR.cos(22) });
          var key = fd(z.v, 0), sk = T.fig(r, { th: z.th, at: 'A', lab: { adj: N(z.d) + ' m (map)', hyp: 'L (cable)' }, ang: z.th + '°', orient: 'std', width: 240 }).svg;
          var p = G.P.len('A chairlift cable runs in a straight line up a ski hill at ' + z.th + '° to the horizontal. On a map, the horizontal distance from the bottom station to the top station is ' + N(z.d) + ' m. Find the length of the cable to the nearest metre.', z.v,
            { dp: 0, unit: 'm', trig: { fn: 'cos', deg: z.th, side: z.d, op: 'div' }, sol: steps([sk, 'The horizontal distance touches the ' + z.th + '° angle (adj); the cable ' + t('L') + ' is the hyp.', t('\\cos ' + deg(z.th) + '=\\dfrac{' + NT(z.d) + '}{L}'), t('L=\\dfrac{' + NT(z.d) + '}{\\cos ' + deg(z.th) + '}=' + dots(z.v, 1)), 'The cable is about ' + N(+key) + ' m long. Check: a little longer than ' + N(z.d) + ' m ✓']),
              hints: ['Sketch it: the map distance is horizontal (adj), the cable is the hyp.', 'The unknown hyp is on the bottom: divide by cos ' + z.th + '°. Round to the nearest metre.'], text: 'chairlift cable' });
          p.bad = badList(key, [z.d * TR.cos(z.th), z.d / TR.sin(z.th)], 0);
          return p;
        } }] },
      { num: '12', stem: function (sh) { return 'The front of an A-frame tent is a triangle. Each sloping side is ' + N(sh.s) + ' m long and makes a ' + sh.th + '° angle with the ground.' + tentSVG(sh); },
        shared: function (r) {
          return find(function () { var s = oneDec(r, 1.6, 2.6), th = r.int(50, 64), n = r.pick([2, 3]), p = r.pick([0.55, 0.6, 0.65, 0.7, 0.75]); return { s: s, th: th, n: n, p: p, w: 2 * s * TR.cos(th) }; },
            function (z) { return clean(z.w) && !(same(z.s, 2.1) && z.th === 55) && Math.abs(z.n * z.p - rd(z.w, 1)) >= 0.1 && !same(rd(2 * rd(z.s * TR.cos(z.th), 1), 1), rd(z.w, 1)); }, { s: 2.1, th: 56, n: 2, p: 0.65, w: 4.2 * TR.cos(56) });
        },
        parts: [
          { id: '12a', level: 'ADV', make: function (r, sh) {
            var h = sh.s * TR.cos(sh.th), v = 2 * h, key = f1(v), early = 2 * rd(h, 1);
            var c = G.lenChk(v, { unit: 'm', radTrap: false, early: false, alts: [{ v: h, code: 'u7l6-half-only', hint: 'That is <b>half</b> the floor (one right triangle). The floor is twice as wide.' },
              { v: 2 * sh.s * TR.sin(sh.th), code: 'u7l6-sin', hint: 'The floor touches the ' + sh.th + '° angle, so it is the adj: use <b>cos</b>, not sin.' }, { v: sh.s * TR.sin(sh.th), code: 'u7l6-sin', hint: 'Use cos (the floor is next to the angle), and remember the floor is two halves.' },
              { v: 2 * sh.s / TR.cos(sh.th), code: 'trig-mul-div', hint: 'The half floor (adj) is on top of ' + t('\\cos\\theta=\\dfrac{\\text{adj}}{\\text{hyp}}') + ': multiply, don’t divide.' }, { v: 2 * sh.s * Math.cos(sh.th), code: 'trig-rad', hint: G.RAD_HINT }] });
            var check = function (resp) { var r0 = c(resp); if (r0.v === 'correct') return r0; var pv = HW.parse.number(readPlain(resp)); if (pv.ok && same(rd(pv.value, 1), rd(early, 1))) return form('u7l6-step-round', 'Nearly! You rounded the half floor to ' + f1(h) + ' before doubling. Double the full value (' + t(dots(h)) + '), then round.'); return r0; };
            return { prompt: 'How wide is the tent floor, to the nearest tenth of a metre?', input: { type: 'number', after: 'm' }, check: check, key: key, answer: t(key) + ' m',
              solution: steps(['A line straight down from the peak makes two right triangles. Half the floor is the adj; ' + N(sh.s) + ' m is the hyp.', 'Half: ' + t(NT(sh.s) + '\\times\\cos ' + deg(sh.th) + '=' + dots(h)) + ' m', 'Floor: ' + t('2\\times ' + dots(h) + '=' + dots(v) + '\\approx ' + key) + ' m']),
              hints: ['Draw a line from the peak straight down to the floor: two right triangles.', 'Half the floor = side × cos ' + sh.th + '°. Then double it.'], text: 'tent floor', bad: badList(key, [h, 2 * sh.s * TR.sin(sh.th)]) };
          } },
          { id: '12b', level: 'PRG', make: function (r, sh) {
            var w = rd(sh.w, 1), need = q(sh.n * sh.p), fits = need <= w, nw = ['', '', 'two', 'three'][sh.n];
            return P.mc(r, 'Can ' + nw + ' sleeping pads that are each ' + N(sh.p) + ' m wide lie side by side on the floor?', [
              { html: (fits ? '<b>Yes</b>: ' : '<b>No</b>: ') + t(sh.n + '\\times ' + NT(sh.p) + '=' + NT(need)) + ' m, which is ' + (fits ? 'less' : 'more') + ' than the ' + fd(w, 1) + ' m floor.', right: true },
              { html: (fits ? '<b>No</b>: ' : '<b>Yes</b>: ') + t(sh.n + '\\times ' + NT(sh.p) + '=' + NT(need)) + ' m, which is ' + (fits ? 'less' : 'more') + ' than the ' + fd(w, 1) + ' m floor.', why: 'Compare again: the pads need ' + N(need) + ' m and the floor is ' + fd(w, 1) + ' m.', code: 'u7l6-compare' },
              { html: '<b>Yes</b>: each pad is only ' + N(sh.p) + ' m wide.', why: 'The pads lie side by side, so add their widths: ' + sh.n + ' × ' + N(sh.p) + '.', code: 'u7l6-pads' },
              { html: (sh.s * TR.cos(sh.th) >= need ? '<b>Yes</b>: ' : '<b>No</b>: ') + 'compare ' + N(need) + ' m with half the floor, ' + f1(sh.s * TR.cos(sh.th)) + ' m.', why: 'The pads go across the <b>whole</b> floor, ' + fd(w, 1) + ' m, not half of it.', code: 'u7l6-half-only' }],
              steps(['Pads: ' + t(sh.n + '\\times ' + NT(sh.p) + '=' + NT(need)) + ' m. Floor: ' + fd(w, 1) + ' m (from (a)).', N(need) + ' m ' + (fits ? '&lt;' : '&gt;') + ' ' + fd(w, 1) + ' m, so ' + (fits ? 'yes.' : 'no.')]),
              ['Add up the widths of the pads and compare with the floor width from (a).'], 'pads fit');
          } }] },
      { num: '13', stem: 'For each triangle, name the side you know and the side you want (x). Then choose sin, cos or tan. Do not solve.', parts: [
        { id: '13a', level: 'BEG', make: function (r) { return kwPart(r, r.pick([['opp', 'adj'], ['adj', 'opp']]), { orient: 'std' }); } },
        { id: '13b', level: 'BEG', make: function (r) { return kwPart(r, ['hyp', 'adj'], { orient: 'turn' }); } },
        { id: '13c', level: 'EMG', make: function (r) { return kwPart(r, ['adj', 'hyp'], { orient: 'turn' }); } },
        { id: '13d', level: 'EMG', make: function (r) { return kwPart(r, r.pick([['opp', 'hyp'], ['hyp', 'opp']]), { orient: 'any' }); } }] },
      { num: '14', stem: function (sh) { return sh.who + ' has to find x in this triangle. Here is the work:<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">' + T.fig(HW.rng(sh.seed), { th: sh.th, at: 'A', lab: { adj: N(sh.a) + ' m', hyp: 'x' }, ang: sh.th + '°', orient: 'std', width: 220 }).svg + '<div>' + t('\\cos ' + deg(sh.th) + '=\\dfrac{' + NT(sh.a) + '}{x}') + '<br>' + t('x=' + NT(sh.a) + '\\times\\cos ' + deg(sh.th)) + '<br>' + t('x\\approx ' + f1(sh.a * TR.cos(sh.th))) + ' m</div></div>'; },
        shared: function (r) { return find(function () { return { a: r.int(6, 14), th: r.int(30, 55), who: r.pick(['Kai', 'Noah', 'Eli', 'Ari']), seed: r.int(1, 1e6) }; }, function (z) { return clean(z.a / TR.cos(z.th)) && !(z.a === 9 && z.th === 40) && z.th !== 41; }, { a: 9, th: 40, who: 'Kai', seed: 3 }); },
        parts: [
          { id: '14a', level: 'EMG', make: function (r, sh) {
            var w = f1(sh.a * TR.cos(sh.th));
            return P.mc(r, 'How can you tell that the answer is wrong without redoing the question?', [
              { html: t('x') + ' is the hypotenuse, so it must be longer than ' + N(sh.a) + ' m. The answer, ' + w + ' m, is shorter.', right: true },
              { html: 'A cosine is always less than 1, so ' + t('x') + ' must be less than 1 m.', why: 'The <b>ratio</b> is less than 1, not the side. The hyp is the longest side.', code: 'u7l6-ratio-lt1' },
              { html: t('x') + ' is the adjacent side, so it must be shorter than ' + N(sh.a) + ' m.', why: t('x') + ' is across from the right angle: it is the <b>hyp</b>, the longest side.', code: 'u7l5-label-hyp' },
              { html: 'The answer has a decimal, and the side ' + N(sh.a) + ' m does not.', why: 'Lengths often have decimals. Compare the hyp with the other side instead.', code: 'u7l5-decimal' }],
              t('x') + ' is across from the right angle, so it is the hyp, the longest side. It must be longer than ' + N(sh.a) + ' m, but the answer is ' + w + ' m.', ['Which side is x? Which side is always the longest?'], 'tell it is wrong');
          } },
          { id: '14bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What was the mistake?', [
              { html: t('x') + ' is on the <b>bottom</b> of the fraction, so ' + sh.who + ' should divide, not multiply.', right: true },
              { html: sh.who + ' should have used sin instead of cos.', why: 'The ' + N(sh.a) + ' m side touches the angle (adj) and x is the hyp: CAH, so cosine is right. The problem is the ×.', code: 'trig-wrong-ratio' },
              { html: 'The ratio should be ' + t('\\cos ' + deg(sh.th) + '=\\dfrac{x}{' + NT(sh.a) + '}') + '.', why: 'Cos is adj over hyp: the ' + N(sh.a) + ' m adj goes on top and x (the hyp) on the bottom. The first line is right.', code: 'trig-upside' },
              { html: 'The calculator was in RAD mode.', why: 'In DEG mode ' + t(NT(sh.a) + '\\times\\cos ' + deg(sh.th)) + ' really is ' + f1(sh.a * TR.cos(sh.th)) + '. The set-up after the first line is the problem.', code: 'trig-rad' }],
              t('\\cos ' + deg(sh.th) + '=\\dfrac{' + NT(sh.a) + '}{x}') + ': x is on the bottom, so ' + t('x=\\dfrac{' + NT(sh.a) + '}{\\cos ' + deg(sh.th) + '}') + '. Multiplying was the mistake.', ['Look at the first line. Where is x in the fraction?'], 'what went wrong');
          } },
          { id: '14bii', sub: 'b ii', outcome: 'A1', level: 'EMG', make: function (r, sh) { return T.sidePart('cos', sh.th, sh.a, 'hyp', { unit: 'm', prompt: 'Find the correct value of x.', text: 'fix the answer' }); } }] },
      { num: '15', stem: function (sh) { return 'Canadian accessibility guides suggest that a wheelchair ramp should slope at about 4.8° or less (a slope of about 1 : 12). A ramp at 4.8° has a horizontal run of ' + fd(sh.R, 1) + ' m.'; },
        shared: function (r) { return find(function () { return { R: oneDec(r, 6.0, 12.0) }; }, function (z) { return !same(z.R, 9) && clean(z.R / TR.cos(4.8)) && clean(z.R * TR.tan(4.8), 2); }, { R: 7.5 }); },
        parts: [
          { id: '15a', outcome: 'A1', level: 'EMG', make: function (r, sh) {
            return T.sidePart('cos', 4.8, sh.R, 'hyp', { unit: 'm', x: 'L', prompt: 'How long is the ramp surface, to the nearest tenth of a metre?', sol0: ['The run is the adj; the ramp surface ' + t('L') + ' is the hyp.'], check: false,
              words: 'The ramp is about # long. (For a small angle, the hyp is almost the same as the adj.)', text: 'ramp surface' });
          } },
          { id: '15b', level: 'ADV', make: function (r, sh) {
            var v = sh.R * TR.tan(4.8), key = f2(v);
            var p = G.P.len('How high does the ramp rise? Choose the right ratio. Round to the nearest <b>hundredth</b> of a metre.', v, { dp: 2, unit: 'm', trig: { fn: 'tan', deg: 4.8, side: sh.R, op: 'mul' },
              alts: [{ v: sh.R * TR.sin(4.8), code: 'trig-wrong-ratio', hint: 'You know the run (' + fd(sh.R, 1) + ' m, the <b>adj</b>), not the hyp. With opp and adj it is <b>tan</b> (TOA). (Or use the full ramp length from (a) with sine.)' }],
              sol: steps(['Know the adj (' + fd(sh.R, 1) + ' m), want the opp: <b>tan</b>.', t('h=' + fd(sh.R, 1) + '\\times\\tan 4.8^\\circ=' + dots(v, 4) + '\\approx ' + key) + ' m', '(Using the full ramp length from (a) with sine gives the same: ' + t('\\dfrac{' + fd(sh.R, 1) + '}{\\cos 4.8^\\circ}\\times\\sin 4.8^\\circ') + '.)']),
              hints: ['Label from the 4.8° angle: the run is the adj, the rise is the opp.', 'Opp and adj → tan. Round to 2 decimal places.'], text: 'ramp rise' });
            p.bad = badList(key, [sh.R / TR.tan(4.8), sh.R * TR.cos(4.8)], 2);
            return p;
          } },
          { id: '15c', level: 'PRG', make: function (r, sh) {
            var v = rd(sh.R * TR.tan(4.8), 2), e = sh.R / 12;
            return P.mc(r, 'Check (b): a 1 : 12 slope rises 1 m for every 12 m of run. Is your answer reasonable?', [
              { html: '<b>Yes</b>: ' + t(fd(sh.R, 1) + '\\div 12\\approx ' + f2(e)) + ' m, very close to ' + f2(v) + ' m.', right: true },
              { html: '<b>No</b>: ' + t(fd(sh.R, 1) + '\\times 12=' + fd(sh.R * 12, 1)) + ' m, much more than ' + f2(v) + ' m.', why: '1 m of rise for every 12 m of run: the rise is the run <b>divided</b> by 12.', code: 'u7l6-1to12' },
              { html: '<b>No</b>: the rise should be 1 m, because the slope is 1 : 12.', why: 'The ramp rises 1 m for each 12 m of run. This run is ' + fd(sh.R, 1) + ' m, not 12 m.', code: 'u7l6-1to12' },
              { html: '<b>Yes</b>: ' + t(fd(sh.R, 1) + '-12') + ' is close to the rise.', why: 'A slope of 1 : 12 means divide the run by 12.', code: 'u7l6-1to12' }],
              t(fd(sh.R, 1) + '\\div 12\\approx ' + f2(e)) + ' m. That is very close to ' + f2(v) + ' m, so the answer is reasonable.', ['1 m up for every 12 m along: divide the run by 12.'], '1 in 12 check');
          } }] },
      { num: '16', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var s3 = T.pickTri(r, 'int', [[9, 40, 41]]), sw = r.chance(0.5), a = sw ? s3[1] : s3[0], b = sw ? s3[0] : s3[1], c = s3[2], wantB = r.chance(0.7), V = wantB ? 'B' : 'A';
          var adj = wantB ? a : b, opp = wantB ? b : a, fr = function (x, y) { return t('\\dfrac{' + NT(x) + '}{' + NT(y) + '}'); };
          return P.mc(r, 'In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('a=' + a) + ', ' + t('b=' + b) + ' and ' + t('c=' + c) + '. What is ' + t('\\cos ' + V) + '?', [
            { html: fr(adj, c), right: true },
            { html: fr(opp, c), why: 'That is the cosine of the <b>other</b> angle. Side ' + t(V === 'B' ? 'a' : 'b') + ' (' + N(adj) + ') is the leg that touches ' + t('\\angle ' + V) + ' (side ' + t(V === 'B' ? 'a' : 'b') + ' is ' + (V === 'B' ? 'BC' : 'AC') + ').', code: 'u7l6-cosA' },
            { html: fr(opp, adj), why: 'That is a tangent (opp ÷ adj). Cosine is adj ÷ <b>hyp</b>, and the hyp is ' + t('c=' + c) + '.', code: 'u7l6-tan' },
            { html: fr(adj, opp), why: 'That is a tangent of the other angle. Cosine is adj ÷ hyp.', code: 'u7l6-tan' }],
            steps(['Side ' + t('a') + ' is ' + t('BC') + ' (across from ' + t('\\angle A') + '), side ' + t('b') + ' is ' + t('AC') + ', side ' + t('c') + ' is the hyp.', 'The leg touching ' + t('\\angle ' + V) + ' is ' + t(V === 'B' ? 'a=' + a : 'b=' + b) + ', so ' + t('\\cos ' + V + '=\\dfrac{' + NT(adj) + '}{' + NT(c) + '}') + '.']),
            ['Side a is across from ∠A, b across from ∠B, c across from the right angle. Which leg touches ∠' + V + '?'], 'cos from a, b, c');
        } }] },
      { num: '17', outcome: 'A1', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var z = find(function () { return { a: r.int(8, 20), th: r.int(25, 60) }; }, function (z) { return !(z.a === 14 && z.th === 35) && !excluded(EX_HYP, z.th, z.a) && z.th !== 45; }, { a: 14, th: 35 });
          var fg = T.sideFig(r, 'cos', z.th, z.a, 'hyp', { unit: 'cm', orient: 'turn' }), fx = '\\cos ' + deg(z.th), v = z.a / TR.cos(z.th);
          return P.mc(r, 'Which expression gives x?<br>' + fg, [
            { html: t(NT(z.a) + '\\div' + fx), right: true },
            { html: t(NT(z.a) + '\\times' + fx), why: 'That gives ' + f1(z.a * TR.cos(z.th)) + ' cm, shorter than ' + z.a + ' cm: impossible for a hyp. x is on the bottom, so divide.', code: 'trig-mul-div' },
            { html: t(fx + '\\div ' + NT(z.a)), why: 'Upside down: the side goes first, then ÷ cos.', code: 'trig-upside' },
            { html: t(NT(z.a) + '\\times\\sin ' + deg(z.th)), why: 'Sine uses the opposite side. The ' + z.a + ' cm side touches the angle (adj), and x is the hyp: cos.', code: 'trig-wrong-ratio' }],
            t(fx + '=\\dfrac{' + NT(z.a) + '}{x}') + ', and x is on the bottom, so ' + t('x=' + NT(z.a) + '\\div' + fx + '\\approx ' + f1(v)) + ' cm.', ['Write cos θ = adj ÷ hyp with the numbers. Is x on top or on the bottom?'], 'which expression');
        } }] },
      { num: '18', stem: '', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var z = find(function () { var L = oneDec(r, 2.4, 4.2), th = r.int(14, 26); return { L: L, th: th, v: L * TR.cos(th) }; }, function (z) { return clean(z.v) && !(same(z.L, 3.2) && z.th === 18); }, { L: 3.2, th: 18, v: 3.2 * TR.cos(18) });
          return T.sidePart('cos', z.th, z.L, 'adj', { unit: 'm', nr: true, x: 'd', prompt: '<b>Numerical response.</b> A moving truck’s loading ramp is ' + N(z.L) + ' m long and makes a ' + z.th + '° angle with the ground. The bottom of the ramp touches the ground ____ m from the back of the truck, to the nearest tenth of a metre.',
            sol0: ['The ramp is the hyp; the distance along the ground is the adj.'], words: 'The bottom of the ramp is about # from the truck.', text: 'NR truck ramp' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Write cos θ as a fraction. Then write it as a decimal to 4 decimal places.', parts: [
        { id: 'x1a', sub: 'a', level: 'BEG', make: function (r) { return T.fracPart(r, 'cos', { kind: 'int', orient: 'std', prompt: '', avoid: [[9, 40, 41]] }); } },
        { id: 'x1b', sub: 'b', level: 'EMG', make: function (r) { return T.fracPart(r, 'cos', { kind: r.pick(['scaled', 'dec']), unit: r.pick(['cm', 'm']), orient: 'turn', prompt: '', avoid: [[9, 40, 41]] }); } }] },
      { num: '2', section: 'A. Skills', stem: 'Use your calculator. Round to 4 decimal places.',
        shared: function (r) { return { a: [angPick(r, 2, 8), angPick(r, 32, 44), angPick(r, 72, 80)] }; },
        parts: [
          { id: 'x2a', sub: 'a–d', level: 'BEG', make: function (r, sh) {
            var a = sh.a, s = 90 - a[1], items = [['cos', a[0]], ['cos', a[1]], ['cos', a[2]], ['sin', s]];
            return P.fields('Find each value.', items.map(function (x) { return { label: t('\\' + x[0] + ' ' + deg(x[1]) + '='), name: x[0] + ' ' + x[1] + '°' }; }), items.map(function (x) { return T.valChk(x[0], x[1]); }), items.map(function (x) { return f4(TR[x[0]](x[1])); }),
              items.map(function (x) { return t('\\' + x[0] + ' ' + deg(x[1]) + '\\approx ' + f4(TR[x[0]](x[1]))); }).join(', &nbsp; '), steps(items.map(function (x) { return x[0] + ' ' + x[1] + ' ) ENTER → ' + t(dots(TR[x[0]](x[1]), 6) + '\\approx ' + f4(TR[x[0]](x[1]))); })),
              ['Check that the screen shows DEG. Watch which key each one needs: the last one is <b>sin</b>.'], 'cos values');
          } },
          { id: 'x2e', sub: 'e', level: 'EMG', make: function (r, sh) {
            var b = sh.a[1], s = 90 - b;
            return P.mc(r, 'Why are ' + t('\\cos ' + deg(b)) + ' and ' + t('\\sin ' + deg(s)) + ' the same?', [
              { html: t(b + '^\\circ+' + s + '^\\circ=90^\\circ') + ': they are the two acute angles of one right triangle. The side adjacent to the ' + b + '° angle is opposite the ' + s + '° angle.', right: true },
              { html: 'Sine and cosine are always equal.', why: 'Not for the same angle: ' + t('\\sin ' + deg(b) + '\\approx ' + f4(TR.sin(b))) + ' but ' + t('\\cos ' + deg(b) + '\\approx ' + f4(TR.cos(b))) + '. Look at how ' + b + ' and ' + s + ' are related.', code: 'u7l6-equal' },
              { html: 'Both angles are less than 45°.', why: s + '° is more than 45°. Add the two angles.', code: 'u7l6-equal' },
              { html: 'It is a coincidence of rounding.', why: 'They are exactly equal. Add the two angles: what do you get?', code: 'u7l6-equal' }],
              b + '° + ' + s + '° = 90°, so they are the two acute angles of the same right triangle. The leg adjacent to the ' + b + '° angle is opposite the ' + s + '° angle, so ' + t('\\cos ' + deg(b) + '=\\sin ' + deg(s)) + '.', ['Add the two angles.'], 'cos = sin of the complement');
          } }] },
      { num: '3', section: 'A. Skills', stem: 'Find x. Round to the nearest tenth.', parts: [
        { id: 'x3a', sub: 'a', level: 'BEG', make: function (r) { var z = adjNums(r, 15, 35, function () { return r.int(10, 30); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'adj', { unit: 'cm', orient: 'std', text: 'adj from hyp' }); } },
        { id: 'x3b', sub: 'b', level: 'BEG', make: function (r) { var z = adjNums(r, 50, 66, function () { return oneDec(r, 3.2, 8.4); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'adj', { unit: 'm', orient: 'turn', text: 'adj from hyp' }); } }] },
      { num: '4', section: 'A. Skills', outcome: 'A1', stem: 'Find x. Round to the nearest tenth.', parts: [
        { id: 'x4a', sub: 'a', level: 'EMG', make: function (r) { var z = hypNums(r, 28, 44, function () { return r.int(6, 16); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'hyp', { unit: 'in', orient: 'turn', text: 'hyp from adj' }); } },
        { id: 'x4b', sub: 'b', level: 'EMG', make: function (r) { var z = hypNums(r, 64, 76, function () { return oneDec(r, 0.6, 1.8); }); return T.sideFigPart(r, 'cos', z.th, z.s, 'hyp', { unit: 'm', orient: 'std', text: 'hyp from adj' }); } }] },
      { num: '5', section: 'A. Skills', stem: 'For each triangle, choose sin, cos or tan to find x. Then find x to the nearest tenth.', parts: [
        { id: 'x5a', sub: 'a', outcome: 'A1', level: 'EMG', make: function (r) { return chooseSolve(r, 'adj', 'hyp', r.int(22, 36), r.int(6, 15), 'std'); } },
        { id: 'x5b', sub: 'b', outcome: 'A1', level: 'PRG', make: function (r) { return chooseSolve(r, 'opp', 'adj', r.int(56, 70), r.int(3, 9), 'turn'); } },
        { id: 'x5c', sub: 'c', level: 'EMG', make: function (r) { return chooseSolve(r, 'hyp', 'opp', r.int(28, 42), r.int(12, 25), 'turn'); } }] },
      { num: '6', section: 'B. Applying', outcome: 'A1', stem: '', parts: [
        { id: 'x6', level: 'PRG', make: function (r) {
          var z = find(function () { var d = oneDec(r, 2.4, 4.2), th = r.int(30, 42); return { d: d, th: th, v: d / TR.cos(th) }; }, function (z) { return clean(z.v) && !(same(z.d, 3.3) && z.th === 37); }, { d: 3.3, th: 37, v: 3.3 / TR.cos(37) });
          var fg = T.fig(r, { th: z.th, at: 'A', lab: { adj: N(z.d) + ' m', hyp: 'stringer' }, ang: z.th + '°', orient: 'std', width: 220 }).svg;
          return T.sidePart('cos', z.th, z.d, 'hyp', { unit: 'm', x: 's', figure: fg, prompt: 'A carpenter is building stairs. The stringer (the sloping board that holds the steps) makes a ' + z.th + '° angle with the floor and covers a horizontal run of ' + N(z.d) + ' m. How long is the stringer, to the nearest tenth of a metre?',
            sol0: ['The run touches the ' + z.th + '° angle (adj); the stringer ' + t('s') + ' is the hyp.'], words: 'The stringer is about # long.', text: 'stair stringer' });
        } }] },
      { num: '7', section: 'B. Applying', outcome: 'A1', stem: '', parts: [
        { id: 'x7', level: 'PRG', make: function (r) {
          var z = find(function () { var w = oneDec(r, 1.2, 2.4), th = r.int(28, 45); return { w: w, th: th, v: w / TR.cos(th) }; }, function (z) { return clean(z.v) && !(same(z.w, 1.5) && z.th === 38); }, { w: 1.5, th: 38, v: 1.5 / TR.cos(38) });
          var fg = T.fig(r, { th: z.th, at: 'A', lab: { adj: N(z.w) + ' m', hyp: 'b' }, ang: z.th + '°', orient: 'std', width: 220 }).svg;
          return T.sidePart('cos', z.th, z.w, 'hyp', { unit: 'm', x: 'b', figure: fg, prompt: 'A wooden gate is a rectangle ' + N(z.w) + ' m wide. A diagonal brace ' + t('b') + ' goes from one bottom corner to the opposite top corner. It makes a ' + z.th + '° angle with the bottom rail. How long is the brace, to the nearest tenth of a metre?',
            sol0: ['The bottom rail touches the ' + z.th + '° angle (adj); the brace ' + t('b') + ' is the hyp.'], words: 'The brace is about # long.', text: 'gate brace' });
        } }] },
      { num: '8', section: 'B. Applying', stem: '', parts: [
        { id: 'x8', level: 'EMG', make: function (r) {
          var z = find(function () { var L = 10 * r.int(15, 35), th = r.int(6, 14); return { L: L, th: th, v: L * TR.cos(th) }; }, function (z) { return clean(z.v) && !(z.L === 260 && z.th === 9); }, { L: 260, th: 9, v: 260 * TR.cos(9) });
          var sk = T.fig(r, { th: z.th, at: 'A', lab: { hyp: z.L + ' m (path)', adj: 'd' }, ang: z.th + '°', orient: 'std', draw: 22, note: 'Not drawn to scale.', width: 240 }).svg;
          return T.sidePart('cos', z.th, z.L, 'adj', { unit: 'm', x: 'd', prompt: 'A drone flies ' + z.L + ' m in a straight line, climbing at ' + z.th + '° to the horizontal. How far does it travel horizontally, to the nearest tenth of a metre?',
            sol0: [sk, 'The flight path is the hyp (' + z.L + ' m); the horizontal distance touches the ' + z.th + '° angle (adj).'], words: 'It travels about # horizontally. (A small angle, so the adj is almost as long as the hyp ✓)', check: false, text: 'drone horizontal' });
        } }] },
      { num: '9', section: 'B. Applying', outcome: 'A1', stem: '', parts: [
        { id: 'x9', level: 'EMG', make: function (r) {
          var z = find(function () { return { d: oneDec(r, 1.0, 2.2), th: r.pick([70, 72, 74, 75, 76]) }; }, function (z) { var v = [z.d / TR.cos(z.th), z.d * TR.cos(z.th), z.d / Math.cos(z.th), z.d * TR.sin(z.th)].map(f1); return v.every(function (x, i) { return v.indexOf(x) === i; }) && !(same(z.d, 1.5) && z.th === 75); }, { d: 1.4, th: 75 });
          var v = z.d / TR.cos(z.th);
          return P.mc(r, 'The bottom of a ladder is ' + N(z.d) + ' m from a wall. The ladder makes a ' + z.th + '° angle with the ground. Which is the length of the ladder?', [
            { html: f1(v) + ' m', right: true },
            { html: f1(z.d * TR.cos(z.th)) + ' m', why: 'That multiplies. The ladder is the hyp (on the bottom): divide, ' + N(z.d) + ' ÷ cos ' + z.th + '°. A ladder can’t be shorter than ' + N(z.d) + ' m.', code: 'trig-mul-div' },
            { html: f1(z.d / Math.cos(z.th)) + ' m', why: G.RAD_HINT, code: 'trig-rad' },
            { html: f1(z.d * TR.sin(z.th)) + ' m', why: 'That uses sine. ' + N(z.d) + ' m touches the angle (adj) and the ladder is the hyp: cos, and divide.', code: 'trig-wrong-ratio' }],
            N(z.d) + ' m is the adj and the ladder is the hyp: ' + t('L=\\dfrac{' + NT(z.d) + '}{\\cos ' + deg(z.th) + '}=' + dots(v) + '\\approx ' + f1(v)) + ' m', ['cos θ = adj ÷ hyp. The unknown hyp is on the bottom.'], 'ladder MC');
        } }] },
      { num: '10', section: 'B. Applying', stem: '', parts: [
        { id: 'x10', level: 'EMG', make: function (r) {
          var z = find(function () { var L = r.int(15, 32), th = r.int(14, 28); return { L: L, th: th, v: L * TR.cos(th) }; }, function (z) { return clean(z.v) && !(z.L === 24 && z.th === 21); }, { L: 24, th: 21, v: 24 * TR.cos(21) });
          return T.sidePart('cos', z.th, z.L, 'adj', { unit: 'm', nr: true, x: 'd', prompt: '<b>Numerical response.</b> A conveyor belt at a gravel pit is ' + z.L + ' m long and slopes up at ' + z.th + '° to the ground. The horizontal distance it covers is ____ m, to the nearest tenth of a metre.', text: 'NR conveyor' });
        } }] },
      { num: '11', section: 'C. Stretch', stem: '', parts: [
        { id: 'x11', level: 'MAS', make: function (r) {
          var z = find(function () { return { U: 10 * r.int(50, 80), a: r.int(6, 12), D: 10 * r.int(30, 50), b: r.int(10, 18) }; }, function (z) { return clean(z.U * TR.cos(z.a) + z.D * TR.cos(z.b), 0) && !(z.U === 650 && z.a === 9); }, { U: 650, a: 9, D: 420, b: 14 });
          var u = z.U * TR.cos(z.a), d = z.D * TR.cos(z.b), tot = u + d, key = fd(tot, 0), each = Math.round(u) + Math.round(d);
          var near = K.near(tot, 0, { unit: 'm', alts: [{ v: z.U + z.D, code: 'u7l6-no-cos', hint: 'That is the length along the snow. The horizontal distance is shorter: use cos for each slope.' },
            { v: z.U * TR.sin(z.a) + z.D * TR.sin(z.b), code: 'u7l6-sin', hint: 'That uses sine (the height climbed). The horizontal distance touches each angle: <b>cos</b>.' },
            { v: u, code: 'u7l6-one-slope', hint: 'That is only the uphill part. Add the horizontal distance of the downhill part too.' }, { v: d, code: 'u7l6-one-slope', hint: 'That is only the downhill part. Add the uphill part too.' },
            { v: z.U / TR.cos(z.a) + z.D / TR.cos(z.b), code: 'trig-mul-div', hint: 'The horizontal distance (adj) is on top of cos θ = adj ÷ hyp: multiply.' }, { v: z.U * Math.cos(z.a) + z.D * Math.cos(z.b), code: 'trig-rad', hint: G.RAD_HINT }] });
          var check = function (resp) { var pv = HW.parse.number(readPlain(resp).replace(/[\s,](?=\d{3}\b)/g, '')); if (pv.ok && each !== Math.round(tot) && Math.abs(pv.value - each) < 1e-9) return form('u7l6-step-round', 'Nearly! You rounded each part before adding. Add the full values (' + t(dots(u, 2)) + ' and ' + t(dots(d, 2)) + '), then round.'); return near(resp); };
          return { prompt: 'A cross-country ski trail climbs a straight slope at ' + z.a + '° for ' + z.U + ' m (measured along the snow). Then it goes down the other side at ' + z.b + '° for ' + z.D + ' m. What horizontal distance does the trail cover? Round to the nearest metre.' + skiSVG(z),
            input: { type: 'number', after: 'm' }, check: check, key: key, answer: t(HW.fmt(key)) + ' m',
            solution: steps(['Uphill part: ' + t(z.U + '\\times\\cos ' + deg(z.a) + '=' + dots(u, 2)) + ' m', 'Downhill part: ' + t(z.D + '\\times\\cos ' + deg(z.b) + '=' + dots(d, 2)) + ' m', 'Total: ' + t(dots(u, 2) + '+' + dots(d, 2) + '=' + dots(tot, 1) + '\\approx ' + HW.fmt(key)) + ' m',
              '(Check: a bit less than ' + t(z.U + '+' + z.D + '=' + HW.fmt(z.U + z.D)) + ' m ✓)']),
            hints: ['Each slope is the hyp of its own right triangle. The horizontal part is the adj: length × cos angle.', 'Find both horizontal parts, add them, then round.'], text: 'ski trail',
            bad: badList(key, [z.U + z.D, u, d, z.U * TR.sin(z.a) + z.D * TR.sin(z.b)], 0) };
        } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [
        { id: 'x12', level: 'PRG', make: function (r) {
          var z = find(function () { var H = r.int(3, 9), A = H + r.int(1, 3); return { H: H, A: A, who: r.pick(['Jordan', 'Taylor', 'Morgan', 'Quinn']) }; }, function (z) { return !(z.H === 4 && z.A === 5); }, { H: 6, A: 7, who: 'Jordan' });
          return P.mc(r, z.who + ' says, “My triangle has an adjacent side of ' + z.A + ' cm and a hypotenuse of ' + z.H + ' cm, so ' + t('\\cos\\theta' + (same(rd(z.A / z.H, 2), z.A / z.H) ? '=' : '\\approx ') + fd(z.A / z.H, 2).replace(/0$/, '').replace(/\.$/, '')) + '.” Why can this not be true?', [
            { html: 'The hypotenuse is always the longest side, so the adjacent side can’t be longer than it. That is why cos θ is always less than 1.', right: true },
            { html: 'The cosine should be ' + t('\\dfrac{' + z.H + '}{' + z.A + '}') + ': the bigger number always goes on the bottom.', why: 'Cos is always adj ÷ hyp. The real problem is that the adj can’t be longer than the hyp.', code: 'u7l6-ratio-lt1' },
            { html: 'Cos θ can’t have decimals.', why: 'Cosines are usually decimals (cos 25° ≈ 0.9063). Look at which side is the longest.', code: 'u7l6-ratio-lt1' },
            { html: 'The angle θ is not given, so you can’t find cos θ.', why: 'cos θ = adj ÷ hyp can be found from the sides. The problem is the sides themselves.', code: 'u7l6-measure' }],
            'The hypotenuse is across from the right angle and is always the longest side. An adjacent side of ' + z.A + ' cm can’t go with a hypotenuse of ' + z.H + ' cm, so adj ÷ hyp can never be more than 1. ' + z.who + ' mixed up the sides or measured wrong.', ['Which side of a right triangle is always the longest?'], 'cos > 1');
        } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'In ' + t('\\triangle ABC') + ', ' + t('\\angle C=90^\\circ') + ', ' + t('a=' + sh.a) + ', ' + t('b=' + sh.b) + ' and ' + t('c=' + sh.c) + '.'; },
        shared: function (r) { var s3 = T.pickTri(r, r.pick(['int', 'scaled']), [[9, 40, 41]]), sw = r.chance(0.5); return { a: sw ? s3[1] : s3[0], b: sw ? s3[0] : s3[1], c: s3[2], v: r.pick([0.6, 0.28, 0.8, 0.96, 0.6428, 0.3846, 0.4, 0.25]), nm: r.pick([['D', 'E', 'F'], ['P', 'Q', 'R'], ['K', 'L', 'M']]), ask: r.pick(['cos-sin', 'sin-cos']) }; },
        parts: [
          { id: 'x13a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var sA = { opp: sh.a, adj: sh.b, hyp: sh.c }, sB = { opp: sh.b, adj: sh.a, hyp: sh.c }, k = '\\frac{' + sh.b + '}{' + sh.c + '}';
            var p = P.fields('Write ' + t('\\cos A') + ' and ' + t('\\sin B') + ' as fractions.', [{ label: t('\\cos A='), name: 'cos A', mode: 'math', keys: 'fraction' }, { label: t('\\sin B='), name: 'sin B', mode: 'math', keys: 'fraction' }],
              [T.fracChk('cos', sA, { noDec: true }), T.fracChk('sin', sB, { noDec: true })], [k, k], t('\\cos A=\\dfrac{' + sh.b + '}{' + sh.c + '}') + ', &nbsp; ' + t('\\sin B=\\dfrac{' + sh.b + '}{' + sh.c + '}'),
              steps(['Side ' + t('b') + ' (' + t('AC') + ') touches ' + t('\\angle A') + ' and is across from ' + t('\\angle B') + '. The hyp is ' + t('c=' + sh.c) + '.', t('\\cos A=\\dfrac{b}{c}=\\dfrac{' + sh.b + '}{' + sh.c + '}') + ', &nbsp; ' + t('\\sin B=\\dfrac{b}{c}=\\dfrac{' + sh.b + '}{' + sh.c + '}') + ': they are equal.']),
              ['Side a is across from ∠A, b is across from ∠B, c is the hyp.', 'cos A uses the leg touching ∠A; sin B uses the leg across from ∠B.'], 'cos A and sin B');
            p.bad = [['\\frac{' + sh.a + '}{' + sh.c + '}', k], [k, '\\frac{' + sh.a + '}{' + sh.c + '}']];
            return p;
          } },
          { id: 'x13ai', sub: 'notice', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What do you notice about ' + t('\\cos A') + ' and ' + t('\\sin B') + '? Why?', [
              { html: 'They are equal: side ' + t('b') + ' is adjacent to ' + t('\\angle A') + ' and opposite ' + t('\\angle B') + '.', right: true },
              { html: 'They add up to 1.', why: t('\\dfrac{' + sh.b + '}{' + sh.c + '}+\\dfrac{' + sh.b + '}{' + sh.c + '}') + ' is not 1. Compare the two fractions.', code: 'u7l6-one-minus' },
              { html: 'They are equal, because sine and cosine of any two angles are equal.', why: 'Only for the two acute angles of the same right triangle (they add to 90°).', code: 'u7l6-equal' },
              { html: 'cos A is bigger, because ∠A is smaller.', why: 'Compare your two fractions: they are the same.', code: 'u7l6-equal' }],
              'Both are ' + t('\\dfrac{' + sh.b + '}{' + sh.c + '}') + '. The leg ' + t('b') + ' touches ' + t('\\angle A') + ' (adj) and is across from ' + t('\\angle B') + ' (opp), and both use the same hyp.', ['Compare your two fractions from (a).'], 'notice');
          } },
          { id: 'x13b', sub: 'b', level: 'MAS', make: function (r, sh) {
            var n = sh.nm, cs = sh.ask === 'cos-sin', give = cs ? '\\cos ' + n[0] : '\\sin ' + n[1], want = cs ? '\\sin ' + n[1] : '\\cos ' + n[0], v = sh.v, other = Math.sqrt(1 - v * v), key = String(v);
            var c = K.near(v, String(v).split('.')[1].length, { alts: [{ v: 1 - v, code: 'u7l6-one-minus', hint: 'Sine and cosine do not add up to 1. Think about which side each one uses.' },
              { v: other, code: 'u7l6-other-leg', hint: 'That would use the <b>other</b> leg. The leg adjacent to ' + t('\\angle ' + n[0]) + ' is the leg opposite ' + t('\\angle ' + n[1]) + '.' }, { v: v / 2, code: 'u7l6-equal', hint: 'Think about the sides: ' + t(give) + ' and ' + t(want) + ' use the same leg and the same hyp.' }] });
            return { prompt: 'In right triangle ' + t(n.join('')) + ', ' + t('\\angle ' + n[2] + '=90^\\circ') + ' and ' + t(give + '=' + v) + '. Without a calculator, what is ' + t(want) + '? (Hint: sketch the triangle.)', input: { type: 'number', before: t(want + '=') }, check: c, key: key, answer: t(want + '=' + v),
              solution: steps([t('\\angle ' + n[0]) + ' and ' + t('\\angle ' + n[1]) + ' are the two acute angles of the same right triangle.', 'The leg adjacent to ' + t('\\angle ' + n[0]) + ' is the leg opposite ' + t('\\angle ' + n[1]) + ', and both ratios use the same hyp.',
                'So ' + t('\\sin ' + n[1] + '=\\cos ' + n[0]) + ': ' + t(want + '=' + v) + '.']),
              hints: ['Sketch ' + t('\\triangle ' + n.join('')) + ' with the right angle at ' + n[2] + '. Label the sides from ' + t('\\angle ' + n[0]) + ', then from ' + t('\\angle ' + n[1]) + '.', 'Which leg touches ' + t('\\angle ' + n[0]) + '? Is it across from ' + t('\\angle ' + n[1]) + '?'], text: 'sin from cos',
              bad: badList(key, [1 - v, other], String(v).split('.')[1].length) };
          } }] }
    ]
  });

  /* ---------------- know / want / use (three typed words) ---------------- */
  function kwPart(r, kw, o) {
    o = o || {}; var know = kw[0], want = kw[1], fn = FN_OF[know + '-' + want];
    var z = find(function () { return { th: r.int(18, 70), val: r.int(4, 30) }; }, function (z) { return ![[40, 12], [25, 8], [62, 5], [33, 7]].some(function (e) { return e[0] === z.th && e[1] === z.val; }); }, { th: 50, val: 6 });
    var fg = kwFig(r, z.th, know, want, z.val, o);
    var ck = [wordChk('side', know, 'u7l6-know', function (g) { return 'The side marked ' + z.val + ' ' + WHERE[know] + '. (You wrote ' + g + '.)'; }),
      wordChk('side', want, 'u7l6-want', function (g) { return 'The side marked x ' + WHERE[want] + '. (You wrote ' + g + '.)'; }),
      wordChk('fn', fn, 'u7l6-use', useHint(know, want))];
    var p = P.fields(fg, [{ label: 'Know:', name: 'Know', mode: 'text', wide: true, placeholder: 'opp, adj or hyp' }, { label: 'Want:', name: 'Want', mode: 'text', wide: true, placeholder: 'opp, adj or hyp' }, { label: 'Use:', name: 'Use', mode: 'text', wide: true, placeholder: 'sin, cos or tan' }],
      ck, [know, want, fn], 'Know: ' + know + ', &nbsp; Want: ' + want + ', &nbsp; Use: <b>' + fn + '</b>',
      steps(['The side marked ' + z.val + ' ' + WHERE[know] + '.', 'The side marked x ' + WHERE[want] + '.', PAIR_TXT[fn].replace(/^./, function (c) { return c.toUpperCase(); }) + ' → use <b>' + fn + '</b>.']),
      ['Label the sides from the ' + z.th + '° angle first: hyp across from the right angle, opp across from the angle, adj touching it.', 'SOH CAH TOA: pick the ratio that has both the side you know and the side you want.'], 'know want use');
    p.bad = [[want, know, fn], [know, want, fn === 'sin' ? 'cos' : 'sin']];
    return p;
  }
  /* ---------------- choose the ratio, then solve ---------------- */
  function chooseSolve(r, know, want, th, val, orient) {
    var s = solveFor(th, know, want, val), key = f1(s.v), fg = kwFig(r, th, know, want, val, { orient: orient });
    var lc = G.lenChk(s.v, { trig: { fn: s.fn, deg: th, side: val, op: s.op } });
    var p = P.fields(fg, [{ label: 'Use:', name: 'Ratio', mode: 'text', wide: true, placeholder: 'sin, cos or tan' }, { label: t('x='), name: 'x' }], [wordChk('fn', s.fn, 'u7l6-use', useHint(know, want)), lc], [s.fn, key],
      'Use <b>' + s.fn + '</b>, &nbsp; ' + t('x\\approx ' + key), solveSol(th, know, want, val),
      ['Label the sides from the ' + th + '° angle. Which ratio has the side you know and the side you want?', 'Unknown on top: multiply. Unknown on the bottom: divide.'], 'choose and solve');
    p.bad = [[s.fn, f1(s.onTop ? val / TR[s.fn](th) : val * TR[s.fn](th))], [s.fn === 'cos' ? 'sin' : 'cos', key]];
    return p;
  }
  /* ---------------- pictures ---------------- */
  function tentSVG(sh) {
    var W = 2 * sh.s * Math.cos(sh.th * RAD), H = sh.s * Math.sin(sh.th * RAD), k = 190 / Math.max(W, H * 1.4), w = W * k, h = H * k, x0 = 56, y0 = 16 + h;
    var pk = [x0 + w / 2, y0 - h], ink = '#1d2633', hb = sh.th / 2 * RAD, F = 'font-family="system-ui, sans-serif"';
    return '<svg class="fig-svg" viewBox="0 0 ' + Math.round(w + 80) + ' ' + Math.round(h + 44) + '" width="100%" style="max-width:' + Math.round(w + 80) + 'px" role="img" aria-label="A-frame tent">' +
      '<polygon points="' + x0 + ',' + y0 + ' ' + pk[0] + ',' + pk[1] + ' ' + (x0 + w) + ',' + y0 + '" fill="#f6f2ea" stroke="' + ink + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<line x1="' + pk[0] + '" y1="' + pk[1] + '" x2="' + pk[0] + '" y2="' + y0 + '" stroke="' + ink + '" stroke-width="1.4" stroke-dasharray="5 4"/>' +
      '<path d="M' + (pk[0] - 9) + ' ' + y0 + 'V' + (y0 - 9) + 'H' + pk[0] + '" fill="none" stroke="' + ink + '" stroke-width="1.4"/>' +
      '<path d="M' + (x0 + 24) + ' ' + y0 + 'A24 24 0 0 0 ' + (x0 + 24 * Math.cos(sh.th * RAD)).toFixed(1) + ' ' + (y0 - 24 * Math.sin(sh.th * RAD)).toFixed(1) + '" fill="none" stroke="#c27a0e" stroke-width="1.7"/>' +
      '<text x="' + (x0 + 36 * Math.cos(hb)).toFixed(1) + '" y="' + (y0 - 36 * Math.sin(hb) + 5).toFixed(1) + '" font-size="14" font-weight="700" fill="#c27a0e" ' + F + '>' + sh.th + '°</text>' +
      '<text x="' + (x0 + w / 4 - 10).toFixed(1) + '" y="' + (y0 - h / 2 - 4).toFixed(1) + '" font-size="15" font-weight="600" fill="' + ink + '" text-anchor="end" ' + F + '>' + N(sh.s) + ' m</text>' +
      '<text x="' + (x0 + w / 2) + '" y="' + (y0 + 20) + '" font-size="14" font-weight="600" fill="#5f6675" text-anchor="middle" ' + F + '>floor</text></svg>';
  }
  function skiSVG(z) {
    var sc = 0.22, ex = 3, ux = z.U * Math.cos(z.a * RAD) * sc, uy = z.U * Math.sin(z.a * RAD) * sc * ex, dx = z.D * Math.cos(z.b * RAD) * sc, dy = z.D * Math.sin(z.b * RAD) * sc * ex;   // drawn steeper so the angles show
    var x0 = 16, y0 = 20 + Math.max(uy, dy), top = [x0 + ux, y0 - uy], end = [top[0] + dx, top[1] + dy], ink = '#1d2633', W = end[0] + 30, AC = '#c27a0e';
    var pa = Math.atan2(uy, ux), pb = Math.atan2(dy, dx), R = 30;
    function tx(x, y, s2, c, a) { return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="13" font-weight="700" fill="' + (c || ink) + '" text-anchor="' + (a || 'middle') + '" font-family="system-ui, sans-serif">' + s2 + '</text>'; }
    function arc(cx, cy, a1, a2, sweep) { return '<path d="M' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy - R * Math.sin(a1)).toFixed(1) + 'A' + R + ' ' + R + ' 0 0 ' + sweep + ' ' + (cx + R * Math.cos(a2)).toFixed(1) + ' ' + (cy - R * Math.sin(a2)).toFixed(1) + '" fill="none" stroke="' + AC + '" stroke-width="1.7"/>'; }
    return '<br><svg class="fig-svg" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(y0 + 26) + '" width="100%" style="max-width:' + Math.round(W * 1.1) + 'px" role="img" aria-label="ski trail">' +
      '<polyline points="' + x0 + ',' + y0 + ' ' + top[0].toFixed(1) + ',' + top[1].toFixed(1) + ' ' + end[0].toFixed(1) + ',' + end[1].toFixed(1) + '" fill="none" stroke="#1f5bd6" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + top[0].toFixed(1) + '" y2="' + y0 + '" stroke="' + ink + '" stroke-width="1.3" stroke-dasharray="5 4"/>' +
      '<line x1="' + top[0].toFixed(1) + '" y1="' + top[1].toFixed(1) + '" x2="' + top[0].toFixed(1) + '" y2="' + y0 + '" stroke="' + ink + '" stroke-width="1.3" stroke-dasharray="5 4"/>' +
      '<line x1="' + top[0].toFixed(1) + '" y1="' + end[1].toFixed(1) + '" x2="' + end[0].toFixed(1) + '" y2="' + end[1].toFixed(1) + '" stroke="' + ink + '" stroke-width="1.3" stroke-dasharray="5 4"/>' +
      arc(x0, y0, 0, pa, 0) + arc(end[0], end[1], Math.PI, Math.PI - pb, 1) +
      tx(x0 + 44 * Math.cos(pa / 2), y0 - 44 * Math.sin(pa / 2) + 5, z.a + '°', AC, 'start') + tx(end[0] - 44 * Math.cos(pb / 2), end[1] - 44 * Math.sin(pb / 2) + 5, z.b + '°', AC, 'end') +
      tx((x0 + top[0]) / 2 - 8, (y0 + top[1]) / 2 - 8, z.U + ' m', ink, 'end') + tx((top[0] + end[0]) / 2 + 10, (top[1] + end[1]) / 2 - 8, z.D + ' m', ink, 'start') +
      tx(W / 2, y0 + 18, '(not to scale: steepness exaggerated)', '#6a6f7a') + '</svg>';
  }
})(window);
