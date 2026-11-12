/* Unit 4 project: Recipe Rescue (Volume, Capacity, Mass and Temperature; M1, M2).
 * The class is having a party / bake sale, and the recipe is American. Students pick one of 3 US recipes (chili, cookie
 * bars, lemonade + banana bread), scale it for the people they're feeding (ratio, Unit 1), check the pots/pans hold it
 * (volume of a cylinder or a prism, 1 mL = 1 cm³) with a British-pint twist, convert the oven and fridge/freezer
 * temperatures, convert every ingredient to metric and round it sensibly for the card, price the shopping list per lb
 * vs per kg, then make a printable metric recipe card + shopping list and hand it in. Every answer is checked against
 * the student's own choices. Worked examples use a different cook: Coach Daniels' pancake breakfast for the Prairie Pucks.
 * Constants are the booklet's (m103book/common/BOOK_BRIEF.md, Unit 4): 1 US cup ≈ 237 mL, 1 US fl oz ≈ 29.57 mL,
 * 1 lb ≈ 0.454 kg (1 kg ≈ 2.2 lb), 1 oz ≈ 28.35 g, 1 British pint ≈ 568 mL, °C = (°F − 32) ÷ 1.8, °F = 1.8 × °C + 32;
 * 1 tbsp = 15 mL and 1 tsp = 5 mL (given on the page). Engine: js/projects.js. Each checkpoint has solve(c), which fills
 * in right answers (tests/projects_u4_test.js and tests/projects_u4_e2e.py). */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, money = PJ.money, r2 = PJ.r2, esc = PJ.esc;
  var hasDoc = typeof document !== 'undefined';
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  /* this project's own styles (assets/projects-u4.css), on the student site and in the Teacher Ledger alike */
  var CSS = (PJ.site || '') + 'assets/projects-u4.css';
  if (hasDoc && !document.querySelector('link[data-pj-u4]')) { var ln = document.createElement('link'); ln.rel = 'stylesheet'; ln.href = CSS; ln.setAttribute('data-pj-u4', ''); document.head.appendChild(ln); }

  /* ================= units and constants ================= */
  var U = {
    cup: { s: 'cup', p: 'cups', kind: 'v', f: 237, fact: '1 US cup ≈ 237 mL' },
    floz: { s: 'fl oz', p: 'fl oz', kind: 'v', f: 29.57, fact: '1 US fl oz ≈ 29.57 mL' },
    tbsp: { s: 'tbsp', p: 'tbsp', kind: 'v', f: 15, fact: '1 tbsp = 15 mL' },
    tsp: { s: 'tsp', p: 'tsp', kind: 'v', f: 5, fact: '1 tsp = 5 mL' },
    lb: { s: 'lb', p: 'lb', kind: 'm', f: 454, fact: '1 lb ≈ 0.454 kg = 454 g' },
    oz: { s: 'oz', p: 'oz', kind: 'm', f: 28.35, fact: '1 oz ≈ 28.35 g' },
    ea: { s: '', p: '', kind: 'n', f: 0 }
  };
  var BPINT = 568, LBKG = 2.2046; // a British pint (mL); pounds in a kilogram (the page says 1 kg ≈ 2.2 lb; ÷ 0.454 is fine too)
  var STORE = { A: { name: 'Foothills Foods', per: 'lb', note: 'Weekly flyer · prices per pound' }, B: { name: 'Bow River Market', per: 'kg', note: 'Calgary · prices per kilogram' } };
  var COLORS = [['#16a34a', 'Green'], ['#dc2626', 'Red'], ['#ea580c', 'Orange'], ['#2563eb', 'Blue'], ['#7c3aed', 'Purple'], ['#0f766e', 'Teal']];
  var WHO = ['Just our class', 'Class + teachers', 'Class + guests', 'A big party'];

  function I(id, amt, u, name, x) { var o = { id: id, amt: amt, u: u, name: name }; if (x) for (var k in x) o[k] = x[k]; return o; }
  var RECIPES = {
    chili: { name: 'Big-Batch Chili', icon: '🌶️', from: 'Aunt Darlene', who: 'Aunt Darlene', place: 'Houston, Texas', blurb: 'A pot of chili for a class lunch', serves: 6, makes: 'Serves 6 · makes about 10 cups', people: [24, 27, 30, 36],
      ideas: ['Class Party Chili', 'Five-Alarm Chili', 'Prairie Fire Chili'], col: '#b4432a', light: '#e46c4c',
      ings: [I('beef', 1.5, 'lb', 'ground beef', { shop: { name: 'Lean ground beef', icon: '🥩', base: 12.1 } }), I('onion', 1, 'lb', 'onions, chopped', { shop: { name: 'Onions', icon: '🧅', base: 2.4 } }),
        I('tom', 28, 'oz', 'canned crushed tomatoes'), I('broth', 2, 'cup', 'beef broth'), I('spice', 2, 'tbsp', 'chili powder'), I('salt', 1, 'tsp', 'salt'),
        I('ched', 4, 'oz', 'shredded cheddar, for the top', { shop: { name: 'Cheddar cheese', icon: '🧀', base: 17.6 } })],
      steps: ['Brown the beef and onions in a big pot.', 'Add the tomatoes, broth, chili powder and salt. Simmer for 1 hour, until the beef reaches {hot}.', 'Top each bowl with cheddar.', 'Keep leftovers in the fridge ({fr} or colder) or freeze them ({fz}).'],
      yld: { cups: 10, what: 'chili' }, cw: ['pot', 'pots'],
      cont: [{ id: 'soup', name: 'Soup pot', shape: 'cyl', d: 20, H: 18, fill: 14 }, { id: 'stock', name: 'Stockpot', shape: 'cyl', d: 24, H: 22, fill: 17 }, { id: 'canner', name: 'Canning pot', shape: 'cyl', d: 32, H: 26, fill: 22 }],
      hot: { kind: 'meat', F: 160, text: 'Aunt Darlene says to cook the chili until the beef reaches <b>160 °F</b>. The foods-room meat thermometer reads in °C.' },
      cold: { fr: 'Leftover chili', fz: 'Extra chili' },
      twist: { ing: 'broth', who: 'Your pen pal Ollie in London', us: '2 cups of beef broth', usP: '1 US pint', br: '1 pint of beef stock', brP: 1 },
      sup: { name: 'Paper bowls and spoons (50)', icon: '🥣', price: 8.99 }, extra: 'broth' },
    bars: { name: 'Chocolate Chip Cookie Bars', icon: '🍪', from: 'Grandma Jo’s baking blog', who: 'Grandma Jo', place: 'Ohio', blurb: 'Bake-sale cookie bars in a pan', serves: 16, makes: 'Makes 16 bars', people: [24, 32, 40, 48],
      ideas: ['Bake Sale Bars', 'Chip Chip Hooray Bars', 'Monster Cookie Bars'], col: '#a0662b', light: '#d9a35f',
      ings: [I('butter', 0.5, 'lb', 'butter, melted', { shop: { name: 'Butter', icon: '🧈', base: 12.3 } }), I('bsugar', 1, 'cup', 'brown sugar, packed'), I('egg', 2, 'ea', 'eggs'),
        I('milk', 4, 'floz', 'milk'), I('van', 2, 'tsp', 'vanilla'), I('flour', 10, 'oz', 'flour', { shop: { name: 'Flour (bulk bin)', icon: '🌾', base: 2.2 } }),
        I('chips', 12, 'oz', 'chocolate chips', { shop: { name: 'Chocolate chips (bulk bin)', icon: '🍫', base: 15.4 } })],
      steps: ['Mix the melted butter, brown sugar, eggs, milk and vanilla.', 'Stir in the flour, then the chocolate chips.', 'Spread the batter about ¾ inch (2 cm) deep in the pan. Bake at {hot} for 25 minutes.', 'Keep the butter and milk in the fridge ({fr} or colder). Freeze extra bars ({fz}).'],
      yld: { cups: 6, what: 'batter' }, cw: ['pan', 'pans'],
      cont: [{ id: 'pan', name: '9 × 13 pan', shape: 'box', l: 33, w: 23, H: 5, fill: 2 }, { id: 'sheet', name: 'Half sheet pan', shape: 'box', l: 45, w: 33, H: 2.5, fill: 2 }, { id: 'square', name: '8 × 8 pan', shape: 'box', l: 20, w: 20, H: 5, fill: 2 }],
      hot: { kind: 'oven', F: 375, dial: [170, 180, 190, 200], text: 'Grandma Jo bakes her bars at <b>375 °F</b>. The foods-room ovens are set in °C, and the dial goes up by 10 degrees.' },
      cold: { fr: 'The butter and milk', fz: 'Extra bars' },
      twist: { ing: 'milk', who: 'Your friend Amara in Leeds', us: '4 fl oz of milk', usP: '¼ of a US pint', br: '¼ pint of milk', brP: 0.25 },
      sup: { name: 'Paper plates and napkins', icon: '🧻', price: 6.49 }, extra: 'bsugar' },
    lemon: { name: 'Lemonade & Banana Bread', icon: '🍋', from: 'Coach Mike’s family cookbook', who: 'Coach Mike', place: 'Portland, Oregon', blurb: 'Fresh lemonade and banana bread', serves: 8, makes: 'Serves 8 · 8 glasses and 8 slices', people: [24, 28, 32, 36],
      ideas: ['Sunny Lemonade & Banana Bread', 'Squeeze the Day', 'Top Banana Combo'], col: '#c08a00', light: '#fde047',
      ings: [I('lemon', 1.5, 'lb', 'lemons (about 6), juiced', { grp: 'Lemonade', shop: { name: 'Lemons', icon: '🍋', base: 4.8 } }), I('sugar', 1, 'cup', 'sugar', { grp: 'Lemonade' }), I('water', 6, 'cup', 'cold water', { grp: 'Lemonade' }),
        I('banana', 1, 'lb', 'ripe bananas (about 3)', { grp: 'Banana bread', shop: { name: 'Bananas', icon: '🍌', base: 1.7 } }), I('butter', 4, 'oz', 'butter, melted', { grp: 'Banana bread', shop: { name: 'Butter', icon: '🧈', base: 12.3 } }),
        I('egg', 2, 'ea', 'eggs', { grp: 'Banana bread' }), I('flour', 1.5, 'cup', 'flour', { grp: 'Banana bread' }), I('soda', 1, 'tsp', 'baking soda', { grp: 'Banana bread' })],
      steps: ['Lemonade: stir the lemon juice and sugar into the cold water. Keep it in the fridge ({fr} or colder).', 'Banana bread: mash the bananas and mix in the butter and eggs. Stir in the flour and baking soda.', 'Bake in loaf pans at {hot} for 1 hour. Freeze extra loaves ({fz}).'],
      yld: { cups: 8, what: 'lemonade' }, cw: ['container', 'containers'],
      cont: [{ id: 'pitcher', name: 'Pitcher', shape: 'cyl', d: 12, H: 22, fill: 18 }, { id: 'disp', name: 'Drink dispenser', shape: 'cyl', d: 20, H: 30, fill: 23 }, { id: 'cooler', name: 'Cooler jug', shape: 'cyl', d: 24, H: 34, fill: 28 }],
      hot: { kind: 'oven', F: 350, dial: [160, 170, 180, 190], text: 'Bake the banana bread at <b>350 °F</b>. The foods-room ovens are set in °C, and the dial goes up by 10 degrees.' },
      cold: { fr: 'The lemonade', fz: 'Extra banana bread' },
      twist: { ing: 'water', who: 'Your cousin Isla in Bristol', us: '6 cups of cold water', usP: '3 US pints', br: '3 pints of cold water', brP: 3 },
      sup: { name: 'Paper cups (pack of 50)', icon: '🥤', price: 5.99 }, extra: 'water' }
  };
  var KEYS = ['chili', 'bars', 'lemon'];

  /* ================= numbers ================= */
  var FR = { 0.125: '⅛', 0.25: '¼', 0.375: '⅜', 0.5: '½', 0.625: '⅝', 0.75: '¾', 0.875: '⅞' };
  var UF = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875, '⅓': 1 / 3, '⅔': 2 / 3 };
  /* 6.75 → "6¾" (eighths), anything else → a decimal */
  function frac(x) { var w = Math.floor(x + 1e-9), r = Math.round((x - w) * 8) / 8; if (r === 1) { w++; r = 0; } if (r && !FR[r]) return nf(x); return r ? (w ? w : '') + FR[r] : String(w); }
  function nf(x, d) { var v = Math.round(x * Math.pow(10, d == null ? 3 : d)) / Math.pow(10, d == null ? 3 : d); return String(v).replace('-', '−'); }
  function nfc(x, d) { var s = nf(x, d), p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return p.join('.'); }
  /* a typed amount: "3 3/4", "3-3/4", "15/4", "3¾", "3.75 cups" → 3.75 */
  function parseAmt(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s*(cups?|c|lbs?|pounds?|fl\.?\s*oz|oz|tbsp|tsp|eggs?|ml|l|g|kg)\.?\s*$/i, '').trim();
    var m = /^(\d+)?\s*([¼½¾⅛⅜⅝⅞⅓⅔])$/.exec(s); if (m) return (m[1] ? Number(m[1]) : 0) + UF[m[2]];
    m = /^(\d+)[\s-]+(\d+)\s*\/\s*(\d+)$/.exec(s); if (m) return Number(m[3]) ? Number(m[1]) + Number(m[2]) / Number(m[3]) : NaN;
    m = /^(\d+)\s*\/\s*(\d+)$/.exec(s); if (m) return Number(m[2]) ? Number(m[1]) / Number(m[2]) : NaN;
    return PJ.parse(s);
  }
  function amtText(x, u) { var t = U[u]; return frac(x) + (t.s ? ' ' + (x > 1 + 1e-9 ? t.p : t.s) : ''); }
  function ingText(g, x) { return amtText(x == null ? g.amt : x, g.u) + ' ' + g.name; }
  function short(g) { var n = g.name.split(/[,(]/)[0].trim(); return n.charAt(0).toUpperCase() + n.slice(1); }
  function toC(F) { return (F - 32) / 1.8; }
  function toF(C) { return 1.8 * C + 32; }
  function degC(x) { return nf(x, 1) + ' °C'; }

  /* ================= the student's recipe, from their choices ================= */
  function rnd(seed, k) { return (PJ.hash(seed + '|' + k) % 10000) / 10000; }
  function pick(c, arr, k) { return arr[PJ.hash(c.seed + '|' + k) % arr.length]; }
  function recipe(c) { return RECIPES[c.get('recipe')] || null; }
  function people(c) { var R = recipe(c), n = Number(c.get('people')); return R && R.people.indexOf(n) >= 0 ? n : 0; }
  function factor(c) { var R = recipe(c), n = people(c); return R && n ? n / R.serves : 0; }
  function ings(c) { var R = recipe(c); return R ? R.ings : []; }
  function ingById(R, id) { return R.ings.filter(function (g) { return g.id === id; })[0]; }
  function scaled(c, g) { return g.amt * factor(c); }
  function metricExact(c, g) { return scaled(c, g) * U[g.u].f; }
  function val(c, k, fb, amt) { var x = amt ? parseAmt(c.get(k)) : c.num(k); return isNaN(x) ? fb : x; }
  function dishName(c) { var R = recipe(c); return String(c.get('dish') || '').trim() || (R ? R.name : 'My recipe'); }
  function cont(c) { var R = recipe(c); if (!R) return null; var id = c.get('cont'); return R.cont.filter(function (k) { return k.id === id; })[0] || null; }
  function contVol(k) { return k.shape === 'cyl' ? Math.PI * (k.d / 2) * (k.d / 2) * k.fill : k.l * k.w * k.fill; }
  function yieldMl(c) { var R = recipe(c); return R ? R.yld.cups * factor(c) * 237 : 0; }
  function contCount(c) { var k = cont(c); return k ? Math.ceil(yieldMl(c) / contVol(k) - 1e-9) : 0; }
  /* temperatures on the foods-room thermometers (seeded, so classmates get different ones) */
  function meatReading(c) { return pick(c, [68, 70, 73, 76], 'meat'); }
  function frReading(c) { return pick(c, [2, 3, 5, 6], 'fr'); }
  function fzReading(c) { return pick(c, [-22, -20, -16, -14], 'fz'); }
  function roomC(c) { return pick(c, [19, 20, 21, 22, 23], 'room'); }
  function nearest(list, x) { return list.reduce(function (b, v) { return Math.abs(v - x) < Math.abs(b - x) ? v : b; }, list[0]); }
  /* the card: under 100 → nearest 5; 100 to 999 → nearest 10; 1000 or more → L or kg with one decimal */
  function cardTarget(x) { if (x < 100) return { v: Math.max(5, Math.round(x / 5) * 5), big: false }; if (x < 1000) return { v: Math.round(x / 10) * 10, big: false }; return { v: Math.round(x / 100) / 10, big: true }; }
  function unitNames(g) { return U[g.u].kind === 'm' ? ['g', 'kg'] : ['mL', 'L']; }
  function cardText(c, g) {
    if (g.u === 'ea') return frac(scaled(c, g)) + ' ' + g.name;
    var v = c.num('cv.' + g.id), u = c.get('cu.' + g.id), nm = unitNames(g);
    if (isNaN(v) || !u) { var t = cardTarget(metricExact(c, g)); v = t.v; u = t.big ? 'b' : 's'; }
    return (u === 'b' ? v.toFixed(1) : nf(v, 2)) + ' ' + nm[u === 'b' ? 1 : 0] + ' ' + g.name;
  }
  /* groceries: two stores, one prices per lb, the other per kg (seeded; never closer than 5%) */
  function niceP(x) { return x < 1 ? Math.max(0.19, Math.round(x * 20) / 20 - 0.01) : Math.round(x * 10) / 10 - 0.01; }
  function prices(c, g) {
    var b = g.shop.base, sg = PJ.hash(c.seed + '|sg|' + g.id) % 2 ? 1 : -1, out = null;
    for (var j = 0; j < 8; j++) {
      var m = 0.08 + 0.06 * rnd(c.seed, 'pm' + g.id + j), pB = r2(niceP(b * (1 + sg * m))), pA = r2(niceP(b * (1 - sg * m) / LBKG));
      out = { A: pA, B: pB, aKg: pA * LBKG }; out.cheap = out.aKg < pB ? 'A' : 'B';
      if (Math.abs(out.aKg - pB) / pB >= 0.05) return out;
    }
    return out;
  }
  function shopItems(c) { return ings(c).filter(function (g) { return g.shop; }); }
  function kgExact(c, g) { return metricExact(c, g) / 1000; }
  function costExact(c, g) { var p = prices(c, g); return r2(kgExact(c, g) * (p.cheap === 'A' ? p.aKg : p.B)); }
  function supNums(c) { var R = recipe(c), p = R.sup.price, g = r2(p * 0.05); return { price: p, gst: g, tot: r2(p + g) }; }
  function exactTotal(c) { return r2(shopItems(c).reduce(function (a, g) { return a + costExact(c, g); }, 0) + supNums(c).tot); }
  function budget(c) { // a round number clearly above or below the total (at least $3 and 8% away)
    var t = exactTotal(c), up = PJ.hash(c.seed + '|budget') % 2 === 1, b = 5 * Math.round(t * (up ? 1.16 : 0.86) / 5), gap = Math.max(3, 0.08 * t);
    while (up ? b - t < gap : t - b < gap) b += up ? 5 : -5;
    return b > 5 ? b : 5 * Math.ceil((t + gap) / 5);
  }
  function studentTotal(c) { return val(c, 'total', exactTotal(c)); }
  PJ.recipe = { RECIPES: RECIPES, U: U, factor: factor, scaled: scaled, metricExact: metricExact, cardTarget: cardTarget, prices: prices, cont: cont, contVol: contVol, contCount: contCount, yieldMl: yieldMl, exactTotal: exactTotal, budget: budget, parseAmt: parseAmt, frac: frac, toC: toC, toF: toF };

  /* ================= checking a number (own builder: fractions, relative tolerances, unit-aware hints) ================= */
  function R0(f, ok, x) { var r = { f: f, ok: !!ok, blank: false, graded: true }; for (var k in x) if (x[k] !== undefined) r[k] = x[k]; return r; }
  function tolOf(o, v) { return (o.tol || 0) + (o.rel || 0) * Math.abs(v); }
  /* o: { tol, rel, amt (fractions ok), oneDec (a whole number within 0.5 is fine too), wrong: [{ v, tol, rel, hint }], hint, hint2, label, graded } */
  function chk(c, k, exp, o) {
    o = o || {}; var base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!c.has(k)) return R0(k, false, Object.assign(base, { blank: true }));
    var x = o.amt ? parseAmt(c.get(k)) : c.num(k);
    if (isNaN(x)) return R0(k, false, Object.assign(base, { form: true, hint: o.amt ? 'Type just a number, like 3.75 or 3 3/4.' : 'Type just a number' + (o.unitEg ? ', like ' + o.unitEg : '') + '.' }));
    var tol = tolOf(o, exp);
    if (Math.abs(x - exp) <= tol + 1e-9 || (o.oneDec && Math.abs(x - Math.round(x)) < 1e-9 && Math.abs(x - exp) <= 0.5 + 1e-9)) return R0(k, true, base);
    var w = o.wrong || [], h = '';
    for (var i = 0; i < w.length && !h; i++) {
      if (w[i].v == null || !isFinite(w[i].v)) continue;
      var t = w[i].tol != null || w[i].rel != null ? tolOf(w[i], w[i].v) : Math.max(tol, tolOf(o, w[i].v));
      if (Math.abs(x - w[i].v) <= t + 1e-9 && Math.abs(w[i].v - exp) > tol + 1e-9) h = w[i].hint;
    }
    if (!h && exp && Math.abs(x - exp * 1000) <= tolOf(o, exp) * 1000 + 1e-9) h = 'Your answer is 1000 times too big. Check your units: 1 L = 1000 mL and 1 kg = 1000 g.';
    if (!h && exp && Math.abs(x * 1000 - exp) <= tol + 1e-9) h = 'Your answer is 1000 times too small. Check your units: 1 L = 1000 mL and 1 kg = 1000 g.';
    if (!h && exp && Math.abs(x - exp * 10) <= tol * 10 + 1e-9) h = 'Your answer is 10 times too big. Check where the decimal point goes.';
    if (!h && exp && Math.abs(x * 10 - exp) <= tol + 1e-9) h = 'Your answer is 10 times too small. Check where the decimal point goes.';
    if (!h && exp && Math.abs(x + exp) <= tol + 1e-9) h = exp < 0 ? 'Check the sign: this one is below zero, so it needs a minus sign (−).' : 'Check the sign: this one should be positive.';
    return R0(k, false, Object.assign(base, { hint: h || o.hint || 'Check this one again.' }));
  }
  /* °F → °C with the usual slips */
  function fcWrong(F) {
    return [{ v: F - 32 * 1.8, hint: 'Do the brackets first: (°F − 32), then ÷ 1.8.' }, { v: F / 1.8 - 32, hint: 'Subtract 32 <b>first</b>, then divide by 1.8.' },
      { v: F / 1.8, hint: 'Subtract 32 first: (°F − 32) ÷ 1.8.' }, { v: (F - 32) * 1.8, hint: 'Divide by 1.8 — don’t multiply.' }, { v: F - 32, hint: 'Now divide by 1.8.' },
      { v: (F - 30) / 2, hint: 'That’s the quick estimate. Use the exact formula: (°F − 32) ÷ 1.8.' }, { v: 1.8 * F + 32, hint: 'That formula changes °C to °F. To go from °F to °C: (°F − 32) ÷ 1.8.' }];
  }
  function fcHint(F) { return 'Try (' + nf(F) + ' − 32) ÷ 1.8 on the calculator. Use brackets!'; }

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function inBox(c, k, unit, o) { o = Object.assign({ kind: 'num' }, o || {}); var w = c.input(k, o); if (unit) w.appendChild(el('span', 'pj-post', unit)); return w; }
  function grid(box, cls) { var g = el('div', 'pj-grid3' + (cls ? ' ' + cls : '')); box.appendChild(g); return g; }
  function eq(left, right, unit, fmt, delay) { return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="' + (fmt || 'num') + '"' + (delay ? ' data-delay="' + delay + '"' : '') + '>' + (fmt === 'money' ? money(right) : nf(right, 2)) + '</span>' + (unit ? ' ' + unit : '') + '</b></div>'; }
  function chip(html, cls) { return '<div class="pj-x-chip' + (cls ? ' ' + cls : '') + '">' + html + '</div>'; }
  function us(s) { return '<mark class="pj-u4-us">' + s + '</mark>'; }
  /* the US recipe, on an old index card (US units highlighted) */
  function usCard(R, o) {
    o = o || {}; var grp = '';
    var list = R.ings.map(function (g) {
      var h = (g.grp && g.grp !== grp ? '<li class="pj-u4-grp">' + esc(g.grp) + '</li>' : ''); grp = g.grp || grp;
      return h + '<li>' + (g.u === 'ea' ? frac(g.amt) + ' ' + esc(g.name) : us(amtText(g.amt, g.u)) + ' ' + esc(g.name)) + '</li>';
    }).join('');
    var fill = { hot: us(R.hot.F + ' °F'), fr: us('40 °F'), fz: us('0 °F') };
    var steps = R.steps.map(function (s) { return '<li>' + s.replace(/\{(\w+)\}/g, function (_, k) { return fill[k]; }) + '</li>'; }).join('');
    return '<div class="pj-u4-card' + (o.cls ? ' ' + o.cls : '') + '"><div class="pj-u4-card-h"><span class="pj-u4-card-i">' + R.icon + '</span><div><div class="pj-u4-card-t">' + esc(R.name) + '</div><div class="pj-u4-card-f">From the kitchen of ' + esc(R.from) + ' · ' + esc(R.place) + '</div></div></div>' +
      '<div class="pj-u4-card-m">' + esc(R.makes) + '</div><ul class="pj-u4-card-l">' + list + '</ul><ol class="pj-u4-card-s">' + steps + '</ol></div>';
  }
  /* pots and pans, drawn from their measurements (o.big: with labels) */
  function contSvg(k, col, big, light, ref) {
    col = col || '#b4432a'; light = light || col; ref = ref || k; // ref: the biggest container, so thumbnails share one scale
    if (k.shape === 'cyl') {
      var W = big ? 300 : 130, Hm = big ? 210 : 92, s = Math.min((big ? 150 : 96) / ref.d, (Hm - (big ? 54 : 18)) / ref.H);
      var rx = k.d * s / 2, ry = Math.max(4, rx * 0.24), x0 = big ? 22 : (W - 2 * rx) / 2, ryR = Math.max(4, ref.d * s / 2 * 0.24), yT = big ? ry + 34 : 6 + ryR + (ref.H - k.H) * s, h = k.H * s, yB = yT + h, yF = yB - k.fill * s, x1 = x0 + 2 * rx, cx = x0 + rx, Ht = big ? yB + ry + 10 : 6 + ref.H * s + 2 * ryR + 4;
      var g = '<svg class="pj-u4-svg" viewBox="0 0 ' + W + ' ' + Ht.toFixed(0) + '" width="' + W + '" height="' + Ht.toFixed(0) + '" aria-hidden="true">';
      g += '<path d="M' + x0 + ',' + yT + ' V' + yB + ' A' + rx + ',' + ry + ' 0 0 0 ' + x1 + ',' + yB + ' V' + yT + '" fill="#eef1f4" stroke="#5b6472" stroke-width="2"/>';
      g += '<path d="M' + x0 + ',' + yF + ' V' + yB + ' A' + rx + ',' + ry + ' 0 0 0 ' + x1 + ',' + yB + ' V' + yF + ' Z" fill="' + col + '" opacity=".88"/>';
      g += '<ellipse cx="' + cx + '" cy="' + yF + '" rx="' + rx + '" ry="' + ry + '" fill="' + light + '" stroke="' + col + '" stroke-width="1.5"/>';
      g += '<ellipse cx="' + cx + '" cy="' + yT + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#5b6472" stroke-width="2"/>';
      if (big) {
        var yd = yT - ry - 14;
        g += '<path d="M' + x0 + ',' + (yd - 5) + ' v10 M' + x1 + ',' + (yd - 5) + ' v10 M' + x0 + ',' + yd + ' H' + x1 + '" stroke="#1c2230" stroke-width="1.6" fill="none"/>';
        g += '<text x="' + cx + '" y="' + (yd - 8) + '" text-anchor="middle" class="pj-u4-svgt">' + k.d + ' cm across</text>';
        var xa = x1 + 16;
        g += '<path d="M' + (xa - 5) + ',' + yB + ' h10 M' + (xa - 5) + ',' + yF + ' h10 M' + xa + ',' + yB + ' V' + yF + '" stroke="#1c2230" stroke-width="1.6" fill="none"/>';
        g += '<line x1="' + (x0 - 6) + '" y1="' + yF + '" x2="' + (xa - 6) + '" y2="' + yF + '" stroke="#1c2230" stroke-width="1.4" stroke-dasharray="5 4"/>';
        g += '<text x="' + (xa + 8) + '" y="' + ((yB + yF) / 2 - 2) + '" class="pj-u4-svgt">' + k.fill + ' cm</text><text x="' + (xa + 8) + '" y="' + ((yB + yF) / 2 + 15) + '" class="pj-u4-svgs">to the fill line</text>';
        g += '<text x="' + (xa + 8) + '" y="' + (yT + 4) + '" class="pj-u4-svgs">' + k.H + ' cm tall</text>';
      }
      return g + '</svg>';
    }
    var Wb = big ? 330 : 130, sb = (big ? 210 : 104) / (ref.l + ref.w * 0.55), dx = k.w * sb * 0.55, dy = k.w * sb * 0.3, vz = sb * 2.6, hv = k.H * vz, hf = k.fill * vz;
    var bx0 = big ? 14 : (Wb - k.l * sb - dx) / 2, dyR = ref.w * sb * 0.3, by0 = big ? dy + 16 : dyR + 8 + (ref.H - k.H) * vz, L = k.l * sb, yb = by0 + hv - hf, Hb = big ? by0 + hv + 44 : dyR + 16 + ref.H * vz;
    var p = function (pts) { return pts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); };
    var gb = '<svg class="pj-u4-svg" viewBox="0 0 ' + Wb + ' ' + Hb.toFixed(0) + '" width="' + Wb + '" height="' + Hb.toFixed(0) + '" aria-hidden="true">';
    gb += '<polygon points="' + p([[bx0 + dx, by0 - dy], [bx0 + L + dx, by0 - dy], [bx0 + L + dx, by0 - dy + hv], [bx0 + dx, by0 - dy + hv]]) + '" fill="#e3e7ec" stroke="#5b6472" stroke-width="1.5"/>';
    gb += '<polygon points="' + p([[bx0 + L, by0], [bx0 + L + dx, by0 - dy], [bx0 + L + dx, by0 - dy + hv], [bx0 + L, by0 + hv]]) + '" fill="#cfd5dc" stroke="#5b6472" stroke-width="1.5"/>';
    gb += '<polygon points="' + p([[bx0, yb], [bx0 + L, yb], [bx0 + L + dx, yb - dy], [bx0 + dx, yb - dy]]) + '" fill="' + light + '" stroke="' + col + '" stroke-width="1.2"/>';
    gb += '<rect x="' + bx0 + '" y="' + yb.toFixed(1) + '" width="' + L.toFixed(1) + '" height="' + hf.toFixed(1) + '" fill="' + col + '" opacity=".9"/>';
    gb += '<polygon points="' + p([[bx0, by0], [bx0 + L, by0], [bx0 + L, by0 + hv], [bx0, by0 + hv]]) + '" fill="none" stroke="#5b6472" stroke-width="2"/>';
    gb += '<polygon points="' + p([[bx0, by0], [bx0 + L, by0], [bx0 + L + dx, by0 - dy], [bx0 + dx, by0 - dy]]) + '" fill="none" stroke="#5b6472" stroke-width="1.5"/>';
    if (big) {
      var yl = by0 + hv + 16;
      gb += '<path d="M' + bx0 + ',' + (yl - 5) + ' v10 M' + (bx0 + L) + ',' + (yl - 5) + ' v10 M' + bx0 + ',' + yl + ' H' + (bx0 + L) + '" stroke="#1c2230" stroke-width="1.6" fill="none"/>';
      gb += '<text x="' + (bx0 + L / 2) + '" y="' + (yl + 18) + '" text-anchor="middle" class="pj-u4-svgt">' + k.l + ' cm long</text>';
      gb += '<text x="' + (bx0 + L + dx / 2 + 8) + '" y="' + (by0 - dy / 2 + hv + 18) + '" class="pj-u4-svgt">' + k.w + ' cm wide</text>';
      gb += '<text x="' + (bx0 + L + dx + 8) + '" y="' + (by0 - dy + 4) + '" class="pj-u4-svgs">batter: ' + k.fill + ' cm deep</text>';
    }
    return gb + '</svg>';
  }
  function maxCont(R) { var m = { d: 0, H: 0, l: 0, w: 0 }; R.cont.forEach(function (k) { ['d', 'H', 'l', 'w'].forEach(function (q) { if (k[q] > m[q]) m[q] = k[q]; }); }); return m; }
  function dims(k) { return k.shape === 'cyl' ? k.d + ' cm across · ' + k.H + ' cm tall · fill line ' + k.fill + ' cm' : k.l + ' cm × ' + k.w + ' cm · batter ' + k.fill + ' cm deep'; }

  /* ================= the worked example: Coach Daniels' pancake breakfast ================= */
  var EXR = { name: 'Grandma Ruth’s Pancakes', icon: '🥞', from: 'Grandma Ruth', place: 'Duluth, Minnesota', makes: 'Serves 4 · about 5 cups of batter',
    ings: [I('flour', 2, 'cup', 'flour'), I('milk', 1.5, 'cup', 'milk'), I('egg', 2, 'ea', 'eggs'), I('sugar', 2, 'tbsp', 'sugar'), I('van', 1, 'tsp', 'vanilla'), I('bacon', 0.5, 'lb', 'bacon, on the side')],
    steps: ['Whisk everything but the bacon. Rest the batter 10 minutes.', 'Cook on a griddle at {hot}. Keep extra batter in the fridge ({fr}) and bacon in the freezer ({fz}).'], hot: { F: 375 } };
  var EXCARD = usCard(EXR, { cls: 'pj-u4-card-sm' });
  var PITCHER = { shape: 'cyl', d: 14, H: 24, fill: 20 };

  /* ================= Checkpoint 1: pick a recipe ================= */
  var cp1 = {
    id: 'pick', title: 'Pick a recipe', needs: [], graded: false,
    goal: 'Choose the American recipe you’ll rescue, how many people you’re feeding, and a name for your dish.',
    example: { title: 'Coach Daniels’ pancake breakfast', steps: [
      { cap: 'The <b>Prairie Pucks</b> hockey team is having a pancake breakfast. Coach Daniels found his grandma’s recipe from Minnesota — but it’s written in <b>US units</b>.', html: '<div class="pj-u4-x-cardwrap">' + EXCARD + '</div>' },
      { cap: 'He circles everything that isn’t metric: <b>cups, tbsp, tsp, lb</b> and <b>°F</b>. His kitchen has mL measures, a scale in grams and a griddle in °C.', html: '<div class="pj-u4-x-swap"><span>' + us('cups') + ' → mL</span><span>' + us('tbsp, tsp') + ' → mL</span><span>' + us('lb, oz') + ' → g, kg</span><span>' + us('°F') + ' → °C</span></div>' },
      { cap: 'He’s feeding <b>20 people</b> (18 players and 2 coaches), but the recipe only serves 4. Here’s his plan — the same 7 checkpoints you’ll do.', html: '<div class="pj-u4-x-plan"><span style="--i:0">1 Pick</span><span style="--i:1">2 Scale it</span><span style="--i:2">3 Will it fit?</span><span style="--i:3">4 °F → °C</span><span style="--i:4">5 Go metric</span><span style="--i:5">6 Shop</span><span style="--i:6">7 Recipe card</span></div>' }] },
    render: function (box, c) {
      part(box, 'A', 'Pick a recipe', 'Each one is written in US units. You can change it later, but you’ll start the math over.');
      box.appendChild(c.choice('recipe', KEYS.map(function (k) { var R = RECIPES[k]; return { v: k, html: '<span class="pj-u4-ri">' + R.icon + '</span><b>' + esc(R.name) + '</b><small>' + esc(R.blurb) + '</small><span class="pj-u4-from">' + esc(R.makes) + '</span>' }; }),
        { cls: 'pj-u4-recipes', aria: 'Recipe', onPick: function () { c.set('people', ''); c.set('cont', ''); c.redraw(); } }));
      var R = recipe(c); if (!R) return;
      part(box, 'B', 'How many people are you feeding?', 'The recipe: <b>' + esc(R.makes) + '</b>. You’ll scale it up in Checkpoint 2.');
      box.appendChild(c.choice('people', R.people.map(function (n, i) { return { v: String(n), html: '<b>' + n + '</b> people<small>' + WHO[i] + '</small>' }; }), { cls: 'pj-u4-people', aria: 'Number of people', onPick: function () { c.redraw(); } }));
      part(box, 'C', 'Name your dish', 'It goes at the top of your recipe card.');
      box.appendChild(c.text('dish', { ph: 'e.g. ' + R.ideas[0], max: 34, aria: 'Dish name' }));
      var ideas = el('div', 'pj-ideas', '<span>Need an idea?</span>');
      R.ideas.forEach(function (n) { var b = el('button', 'pj-idea', esc(n)); b.type = 'button'; if (c.ro) b.disabled = true; b.addEventListener('click', function () { c.set('dish', n); c.redraw(); }); ideas.appendChild(b); });
      box.appendChild(ideas);
      var wrap = el('div', 'pj-u4-cardwrap', usCard(R) + '<div class="pj-u4-note"><b>Our kitchen is metric!</b>Measuring cups in mL · a scale in grams · ovens in °C · pans in cm' + (people(c) ? '<span>Feeding <b>' + people(c) + '</b> people</span>' : '') + '</div>');
      box.appendChild(wrap);
    },
    check: function (c) {
      var R = recipe(c), out = [c.msg(!!R, 'Pick a recipe first.')]; if (!R) return out;
      out.push(c.need('people', { label: 'People' })); out.push(c.need('dish', { min: 2, label: 'Dish name', hint: 'Give your dish a name.' }));
      return out;
    },
    solve: function (c) { if (!recipe(c)) c.set('recipe', 'chili'); var R = recipe(c); if (!people(c)) c.set('people', String(R.people[2])); c.set('dish', R.ideas[0]); }
  };

  /* ================= Checkpoint 2: scale it up ================= */
  var cp2 = {
    id: 'scale', title: 'Scale it up', needs: ['u1l3', 'u1l4'],
    goal: 'Find your <b>scale factor</b>, then multiply every ingredient by it so the recipe feeds everyone. (Still in US units for now.)',
    example: { title: 'Pancakes for 20', scene: '<div class="pj-x-cost">🥞 Grandma Ruth’s pancakes · serves <b>4</b> · Coach is feeding <b>20</b></div>', steps: [
      { cap: 'The <b>scale factor</b> tells how many times bigger the recipe needs to be: people you’re feeding ÷ people it serves.', html: eq('20 ÷ 4', 5, '') },
      { cap: 'Multiply <b>every</b> amount by 5. Mixed numbers are fine: 1½ = 1.5.', html: eq('1½ cups milk × 5', 7.5, 'cups') },
      { cap: 'Same for the bacon: ½ lb = 0.5 lb.', html: eq('½ lb × 5', 2.5, 'lb') },
      { cap: 'Eggs too: 2 × 5 = 10 eggs. Does it make sense? 5 batches × 4 people = 20 people ✓', html: eq('2 eggs × 5', 10, 'eggs') + '<div class="pj-x-star">★ Check: 5 × 4 = 20 people</div>' }] },
    render: function (box, c) {
      var R = recipe(c), n = people(c); if (!R || !n) return needFirst(box, 'Finish Checkpoint 1 first.');
      box.appendChild(el('p', 'pj-tip', 'Scale factor = people you’re feeding ÷ people the recipe serves. New amount = old amount × scale factor. Fractions are fine: type <b>3 3/4</b> or <b>3.75</b>.'));
      part(box, 'A', 'Your scale factor', 'You’re feeding <b>' + n + '</b> people. The recipe serves <b>' + R.serves + '</b>.');
      var g = grid(box); g.appendChild(field('Scale factor', inBox(c, 'f', '', { aria: 'Scale factor', ph: '' })));
      part(box, 'B', 'The new amounts', 'Keep the US units — you’ll change them to metric in Checkpoint 5.');
      var tb = el('div', 'pj-u4-tbl'); tb.appendChild(el('div', 'pj-u4-th', '<span>Ingredient</span><span>Recipe</span><span>For ' + n + ' people</span>'));
      R.ings.forEach(function (ig) {
        var r = el('div', 'pj-u4-tr');
        r.appendChild(el('div', 'pj-u4-tn', '<b>' + esc(short(ig)) + '</b>' + (ig.grp ? '<small>' + esc(ig.grp) + '</small>' : '')));
        r.appendChild(el('div', 'pj-u4-to', esc(ig.u === 'ea' ? frac(ig.amt) + ' eggs' : amtText(ig.amt, ig.u))));
        var f = el('div', 'pj-field'); f.appendChild(inBox(c, 'sc.' + ig.id, ig.u === 'ea' ? 'eggs' : U[ig.u].p, { aria: 'New amount of ' + ig.name, ph: '' })); r.appendChild(f);
        tb.appendChild(r);
      });
      box.appendChild(tb);
    },
    check: function (c) {
      var R = recipe(c), n = people(c); if (!R || !n) return [c.msg(false, 'Finish Checkpoint 1 first.')];
      var f = n / R.serves, out = [];
      out.push(chk(c, 'f', f, { tol: 0.01, label: 'Scale factor', wrong: [{ v: R.serves / n, tol: 0.01, hint: 'Flip it: people you’re feeding ÷ people the recipe serves.' }, { v: n - R.serves, tol: 0.01, hint: 'Divide, don’t subtract: the scale factor tells how many <b>times</b> bigger.' }, { v: n * R.serves, tol: 0.5, hint: 'Divide, don’t multiply.' }],
        hint: 'Scale factor = people you’re feeding ÷ people the recipe serves.', hint2: 'Try ' + n + ' ÷ ' + R.serves + ' on the calculator.' }));
      var sf = val(c, 'f', NaN);
      R.ings.forEach(function (g) {
        var w = [{ v: g.amt + f, hint: 'Multiply by the scale factor — don’t add it.' }, { v: g.amt * n, hint: 'Multiply by the <b>scale factor</b>, not by the number of people.' }, { v: g.amt / f, hint: 'Multiply by the scale factor — don’t divide.' }, { v: g.amt, hint: 'That’s the amount in the original recipe. Multiply it by your scale factor.' }];
        if (!isNaN(sf) && Math.abs(sf - f) > 0.01) w.unshift({ v: g.amt * sf, hint: 'That matches your scale factor, but the scale factor isn’t right yet. Fix it first.' });
        out.push(chk(c, 'sc.' + g.id, g.amt * f, { amt: true, tol: 0.01, label: esc(short(g)), wrong: w, hint: 'New amount = recipe amount × scale factor.', hint2: 'Try ' + nf(g.amt) + ' × ' + nf(f) + (frac(g.amt) !== nf(g.amt) ? ' (' + frac(g.amt) + ' = ' + nf(g.amt) + ')' : '') + '.' }));
      });
      return out;
    },
    solve: function (c) { var f = factor(c); c.set('f', nf(f)); ings(c).forEach(function (g) { c.set('sc.' + g.id, nf(g.amt * f)); }); }
  };

  /* ================= Checkpoint 3: will it fit? (+ a British twist) ================= */
  var cp3 = {
    id: 'fit', title: 'Will it fit?', needs: ['u4l1', 'u4l2'],
    goal: 'Find how much your recipe makes in <b>litres</b>, the <b>volume</b> of a pot or pan, and how many you need. Then a British twist: is a pint a pint?',
    example: { title: 'How many pitchers of batter?', scene: '<div class="pj-u4-x-row">' + contSvg(PITCHER, '#d9a35f', false, '#f3d9a8') + '<div class="pj-x-cost">🥞 1 batch ≈ <b>5 US cups</b> of batter · 5 batches · pitcher <b>14 cm</b> across, fill line <b>20 cm</b></div></div>', steps: [
      { cap: 'Five batches of 5 cups = 25 cups. To change US cups to mL, multiply by 237 (1 US cup ≈ 237 mL).', html: eq('25 × 237', 5925, 'mL') },
      { cap: '1000 mL = 1 L, so divide by 1000.', html: eq('5925 ÷ 1000', 5.925, 'L') },
      { cap: 'A pitcher is a <b>cylinder</b>: V = π × r² × h. The radius is half of 14 cm: 7 cm. Use the height up to the fill line: 20 cm.', html: eq('π × 7 × 7 × 20', 3078.76, 'cm³') },
      { cap: '1 cm³ = 1 mL, so one pitcher holds about 3079 mL = <b>3.08 L</b>.', html: chip('3078.76 cm³ = 3078.76 mL ≈ <b>3.08 L</b>') },
      { cap: 'How many? 5.925 ÷ 3.08 = 1.92… You can’t use part of a pitcher, so <b>round up</b>: 2 pitchers.', html: '<div class="pj-x-star">★ 2 pitchers</div>' },
      { cap: 'A twist: a friend from Manchester says “add a pint of milk.” But a British pint is bigger! A US pint (2 cups) is about 474 mL; a British pint is about 568 mL.', html: eq('568 − 474', 94, 'mL more') + eq('94 ÷ 474 × 100', 19.8, '%', 'num', 900) }] },
    render: function (box, c) {
      var R = recipe(c), f = factor(c), n = people(c); if (!R || !f) return needFirst(box, 'Finish Checkpoints 1 and 2 first.');
      var Y = R.yld;
      part(box, 'A', 'How much ' + Y.what + ' will you make?', 'One batch makes about <b>' + Y.cups + ' US cups</b> of ' + Y.what + '. 1 US cup ≈ 237 mL, and 1000 mL = 1 L.');
      var g = grid(box);
      g.appendChild(field('US cups for ' + n + ' people', inBox(c, 'yCups', 'cups', { aria: 'Cups of ' + Y.what })));
      g.appendChild(field('In millilitres', inBox(c, 'yMl', 'mL', { aria: 'Millilitres of ' + Y.what })));
      g.appendChild(field('In litres', inBox(c, 'yL', 'L', { aria: 'Litres of ' + Y.what })));
      part(box, 'B', 'Pick a ' + R.cw[0] + ' from the foods room', 'Any one is fine — you might just need more of them.');
      box.appendChild(c.choice('cont', R.cont.map(function (k) { return { v: k.id, html: contSvg(k, R.col, false, R.light, maxCont(R)) + '<b>' + esc(k.name) + '</b><small>' + esc(dims(k)) + '</small>' }; }), { cls: 'pj-u4-conts', aria: 'Container', onPick: function () { c.redraw(); } }));
      var k = cont(c);
      if (k) {
        var cyl = k.shape === 'cyl';
        part(box, 'C', 'How much does one ' + R.cw[0] + ' hold?', cyl ? 'A cylinder: <b>V = π × r² × h</b>. Use the height up to the <b>fill line</b>, so it doesn’t boil over. 1 cm³ = 1 mL.' : 'A rectangular prism: <b>V = l × w × h</b>. For h, use how deep the batter goes. 1 cm³ = 1 mL.');
        var row = el('div', 'pj-u4-fit'); row.appendChild(el('div', 'pj-u4-fitpic', contSvg(k, R.col, true, R.light)));
        var g2 = el('div', 'pj-u4-fitf');
        if (cyl) g2.appendChild(field('Radius', inBox(c, 'rad', 'cm', { aria: 'Radius' })));
        g2.appendChild(field('Volume of ' + (cyl ? 'one ' + R.cw[0] + ' (to the fill line)' : 'batter in one pan'), inBox(c, 'vol', 'cm³', { aria: 'Volume in cubic centimetres' })));
        g2.appendChild(field('One ' + R.cw[0] + ' holds', inBox(c, 'cap', 'L', { aria: 'Capacity in litres' })));
        row.appendChild(g2); box.appendChild(row);
        part(box, 'D', 'How many ' + R.cw[1] + '?', 'Litres you’ll make ÷ litres one holds. Then round <b>up</b> — you can’t use part of a ' + R.cw[0] + '!');
        grid(box).appendChild(field(cap1(R.cw[1]) + ' you need', inBox(c, 'nCont', R.cw[1], { aria: 'Number of ' + R.cw[1] })));
      }
      var T = R.twist;
      part(box, k ? 'E' : 'C', 'A British twist 🇬🇧', esc(T.who) + ' has a British cookbook with the same recipe. Where yours says <b>' + esc(T.us) + '</b> (' + esc(T.usP) + '), hers says <b>' + esc(T.br) + '</b>. Is that the same? Use <b>one batch</b> (not scaled).');
      box.appendChild(el('div', 'pj-u4-pints', '<span>🇺🇸 1 US pint = 2 US cups = 16 US fl oz</span><span>🇬🇧 1 British pint = 20 British fl oz <b>≈ 568 mL</b></span>'));
      var g3 = grid(box, 'pj-u4-tw');
      g3.appendChild(field('Yours (US), in mL', inBox(c, 'tw.us', 'mL', { aria: 'US amount in mL' })));
      g3.appendChild(field('Hers (British), in mL', inBox(c, 'tw.br', 'mL', { aria: 'British amount in mL' })));
      g3.appendChild(field('Difference', inBox(c, 'tw.diff', 'mL', { aria: 'Difference in mL' })));
      var g4 = grid(box, 'pj-u4-tw');
      g4.appendChild(field('Which has more?', c.choice('tw.more', [{ v: 'us', html: '🇺🇸 Mine' }, { v: 'br', html: '🇬🇧 Hers' }, { v: 'same', html: 'The same' }], { cls: 'pj-seg', aria: 'Which has more' })));
      g4.appendChild(field('How much more, as a percent of the smaller one?', c.input('tw.pct', { kind: 'pct', aria: 'Percent more' })));
    },
    check: function (c) {
      var R = recipe(c), f = factor(c); if (!R || !f) return [c.msg(false, 'Finish Checkpoints 1 and 2 first.')];
      var out = [], Y = R.yld, cups = Y.cups * f;
      out.push(chk(c, 'yCups', cups, { amt: true, tol: 0.01, label: 'Cups', wrong: [{ v: Y.cups, hint: 'That’s one batch. Multiply by your scale factor.' }, { v: Y.cups + f, hint: 'Multiply by the scale factor — don’t add.' }],
        hint: 'Cups = cups in one batch × scale factor.', hint2: 'Try ' + Y.cups + ' × ' + nf(f) + '.' }));
      var sc = val(c, 'yCups', cups, true);
      out.push(chk(c, 'yMl', sc * 237, { tol: 1, rel: 0.006, label: 'Millilitres', wrong: [{ v: sc * 250, rel: 0.004, hint: 'That’s a Canadian metric cup (250 mL). This recipe is American: 1 US cup ≈ 237 mL.' }, { v: sc / 237, tol: 0.05, hint: 'Cups → mL: <b>multiply</b> by 237.' }, { v: sc * 29.57, rel: 0.004, hint: '29.57 is for fluid ounces. For cups, use 1 US cup ≈ 237 mL.' }, { v: Y.cups * 237, rel: 0.004, hint: 'That’s one batch. Use your cups for everyone.' }],
        hint: 'mL = cups × 237.', hint2: 'Try ' + nf(sc) + ' × 237.' }));
      var sm = val(c, 'yMl', sc * 237);
      out.push(chk(c, 'yL', sm / 1000, { tol: 0.051, label: 'Litres', wrong: [{ v: sm / 100, rel: 0.01, hint: 'Divide by <b>1000</b> (not 100): 1 L = 1000 mL.' }], hint: 'L = mL ÷ 1000.', hint2: 'Try ' + nf(sm) + ' ÷ 1000.' }));
      out.push(c.need('cont', { label: 'Container' }));
      var k = cont(c);
      if (k) {
        var V = contVol(k), cyl = k.shape === 'cyl', r = cyl ? k.d / 2 : 0, w = [];
        if (cyl) {
          out.push(chk(c, 'rad', r, { tol: 0.01, label: 'Radius', wrong: [{ v: k.d, tol: 0.01, hint: 'That’s the diameter (all the way across). The radius is <b>half</b> of it.' }, { v: k.d * 2, tol: 0.01, hint: 'The radius is half the diameter — divide by 2.' }], hint: 'Radius = diameter ÷ 2.' }));
          w = [{ v: Math.PI * r * r * k.H, rel: 0.006, hint: 'Use the height up to the <b>fill line</b> (' + k.fill + ' cm), not the whole ' + R.cw[0] + ' (' + k.H + ' cm).' }, { v: Math.PI * k.d * k.d * k.fill, rel: 0.006, hint: 'You used the diameter. Use the <b>radius</b> (half of it): r = ' + nf(r) + ' cm.' },
            { v: 2 * Math.PI * r * k.fill, rel: 0.006, hint: 'That’s the area of the side. Volume = π × r × r × h.' }, { v: Math.PI * r * k.fill, rel: 0.006, hint: 'Square the radius: r² = r × r.' }, { v: Math.PI * r * r, rel: 0.006, hint: 'That’s the area of the bottom. Now multiply by the height (to the fill line).' }, { v: Math.PI * 2 * r * k.fill, rel: 0.006, hint: 'r² means r × r, not 2 × r.' }];
          out.push(chk(c, 'vol', V, { tol: 1, rel: 0.005, label: 'Volume', wrong: w, hint: 'V = π × r² × h, with h = the height to the fill line.', hint2: 'Try π × ' + nf(r) + ' × ' + nf(r) + ' × ' + k.fill + ' (use the π key).' }));
        } else {
          w = [{ v: k.l * k.w * k.H, rel: 0.006, hint: 'The pan is ' + k.H + ' cm tall, but the batter only goes <b>' + k.fill + ' cm</b> deep. Use that for h.' }, { v: k.l * k.w, rel: 0.006, hint: 'That’s the area of the bottom. Now multiply by how deep the batter is.' }, { v: 2 * (k.l + k.w) * k.fill, rel: 0.006, hint: 'Multiply all three: l × w × h.' }, { v: (k.l + k.w) * k.fill, rel: 0.006, hint: 'Multiply all three: l × w × h.' }];
          out.push(chk(c, 'vol', V, { tol: 1, rel: 0.005, label: 'Volume', wrong: w, hint: 'V = l × w × h, with h = how deep the batter goes.', hint2: 'Try ' + k.l + ' × ' + k.w + ' × ' + k.fill + '.' }));
        }
        var sv = val(c, 'vol', V);
        out.push(chk(c, 'cap', sv / 1000, { tol: 0.051, label: 'Holds', wrong: [{ v: sv / 100, rel: 0.01, hint: 'Divide by <b>1000</b>: 1 cm³ = 1 mL, and 1000 mL = 1 L.' }], hint: '1 cm³ = 1 mL, and 1000 mL = 1 L: divide by 1000.', hint2: 'Try ' + nf(sv) + ' ÷ 1000.' }));
        var sL = val(c, 'yL', cups * 0.237), sCap = val(c, 'cap', V / 1000), acc = [Math.ceil(cups * 237 / V - 1e-9)];
        if (sCap > 0 && sL > 0) acc.push(Math.ceil(sL / sCap - 1e-9));
        var key = 'nCont', base = { label: cap1(R.cw[1]), hint2: 'Try ' + nf(sL) + ' ÷ ' + nf(sCap) + ', then round up.' };
        if (!c.has(key)) out.push(R0(key, false, Object.assign(base, { blank: true })));
        else {
          var x = c.num(key), ratio = sL / (sCap || 1);
          if (isNaN(x)) out.push(R0(key, false, Object.assign(base, { form: true, hint: 'Type just a number.' })));
          else if (acc.indexOf(x) >= 0) out.push(R0(key, true, base));
          else out.push(R0(key, false, Object.assign(base, { hint: Math.abs(x - Math.round(x)) > 1e-9 ? 'Use a whole number of ' + R.cw[1] + ': round <b>up</b>.' : x === Math.floor(ratio) || x === Math.floor(cups * 237 / V) ? 'Round <b>up</b>: with only ' + x + ', some ' + Y.what + ' won’t fit.' : 'Number = litres you’ll make ÷ litres one holds, rounded up.' })));
        }
      }
      // the British twist (one batch)
      var T = R.twist, g = ingById(R, T.ing), uv = g.amt * U[g.u].f, bv = T.brP * BPINT;
      out.push(chk(c, 'tw.us', uv, { tol: 1, rel: 0.006, label: 'Yours (US)', wrong: [{ v: g.amt * (g.u === 'cup' ? 250 : 30), rel: 0.004, hint: g.u === 'cup' ? 'That’s a Canadian metric cup (250 mL). Use 1 US cup ≈ 237 mL.' : 'Use 1 US fl oz ≈ 29.57 mL.' }, { v: bv, rel: 0.004, hint: 'That’s the British amount. Yours is in US units.' }, { v: g.amt * f * U[g.u].f, rel: 0.006, hint: 'Use <b>one batch</b> (the recipe amount), not your scaled amount.' }],
        hint: 'Change your recipe’s amount to mL: ' + U[g.u].fact + '.', hint2: 'Try ' + nf(g.amt) + ' × ' + U[g.u].f + '.' }));
      out.push(chk(c, 'tw.br', bv, { tol: 1, rel: 0.003, label: 'Hers (British)', wrong: [{ v: T.brP * 473, rel: 0.006, hint: 'That’s a <b>US</b> pint. A British pint is bigger: about 568 mL.' }, { v: T.brP * 474, rel: 0.006, hint: 'That’s a <b>US</b> pint. A British pint is bigger: about 568 mL.' }, { v: BPINT, rel: 0.003, hint: 'Her recipe says ' + esc(T.br) + ', not 1 pint.' }],
        hint: '1 British pint ≈ 568 mL.', hint2: 'Try ' + nf(T.brP) + ' × 568.' }));
      var su = val(c, 'tw.us', uv), sb = val(c, 'tw.br', bv), d = Math.abs(sb - su);
      out.push(chk(c, 'tw.diff', d, { tol: 1.01, label: 'Difference', wrong: [{ v: su + sb, tol: 1.01, hint: 'Subtract to find the difference — don’t add.' }], hint: 'Difference = bigger − smaller.', hint2: 'Try ' + nf(Math.max(su, sb)) + ' − ' + nf(Math.min(su, sb)) + '.' }));
      out.push(c.equals('tw.more', 'br', { label: 'Which has more', hint: 'Compare your two amounts in mL. A British pint is bigger than a US pint.' }));
      var sd = val(c, 'tw.diff', d), small = Math.min(su, sb) || 1;
      out.push(c.pct('tw.pct', sd / small * 100, { label: 'Percent more', wrong: [{ v: sd / Math.max(su, sb) * 100, tol: 0.2, hint: 'Divide by the <b>smaller</b> amount (yours), the one you’re comparing to.' }, { v: sd / small, tol: 0.003, hint: 'Multiply by 100 to change the decimal to a percent.' }],
        hint: 'Percent more = difference ÷ smaller amount × 100.', hint2: 'Try ' + nf(sd) + ' ÷ ' + nf(small) + ' × 100.' }));
      return out;
    },
    solve: function (c) {
      var R = recipe(c), f = factor(c), cups = R.yld.cups * f, ml = Math.round(cups * 237); c.set('yCups', nf(cups)); c.set('yMl', String(ml)); c.set('yL', nf(ml / 1000, 2));
      if (!cont(c)) c.set('cont', R.cont[1].id); var k = cont(c), V = contVol(k);
      if (k.shape === 'cyl') c.set('rad', nf(k.d / 2)); c.set('vol', nf(V, 1)); c.set('cap', nf(V / 1000, 2)); c.set('nCont', String(Math.ceil(Number(nf(ml / 1000, 2)) / Number(nf(V / 1000, 2)) - 1e-9)));
      var T = R.twist, g = ingById(R, T.ing), uv = Math.round(g.amt * U[g.u].f), bv = Math.round(T.brP * BPINT); c.set('tw.us', String(uv)); c.set('tw.br', String(bv)); c.set('tw.diff', String(bv - uv)); c.set('tw.more', 'br'); c.set('tw.pct', nf((bv - uv) / uv * 100, 1));
    }
  };
  function cap1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ================= Checkpoint 4: oven, fridge and freezer ================= */
  var cp4 = {
    id: 'temp', title: 'Oven, fridge and freezer', needs: ['u4l3'],
    goal: 'Change the recipe’s <b>°F</b> temperatures to <b>°C</b>, check the foods-room fridge and freezer, and change one °C temperature back to °F.',
    example: { title: 'Pancake temperatures', scene: '<div class="pj-u4-formula"><span>°C = (°F − 32) ÷ 1.8</span><span>°F = 1.8 × °C + 32</span></div>', steps: [
      { cap: 'The griddle should be <b>375 °F</b>. Do the brackets first, then divide.', html: eq('(375 − 32) ÷ 1.8', 190.6, '°C') },
      { cap: 'The griddle dial goes up by 10, so Coach picks the closest setting: <b>190 °C</b>.', html: '<div class="pj-u4-x-dial"><span>170</span><span>180</span><span class="on">190</span><span>200</span></div>' },
      { cap: 'Extra batter goes in the fridge at <b>40 °F</b> or colder. The fridge thermometer says 3 °C. 3 is colder than 4.4, so it’s cold enough ✓', html: eq('(40 − 32) ÷ 1.8', 4.4, '°C') },
      { cap: 'Bacon goes in the freezer at <b>0 °F</b>. 0 − 32 = −32, so the answer is below zero. The freezer says −16 °C. −16 is <b>warmer</b> than −17.8 (closer to zero), so it’s NOT cold enough ✗', html: eq('(0 − 32) ÷ 1.8', -17.8, '°C') },
      { cap: 'The other way: °F = 1.8 × °C + 32. Grandma Ruth asks how warm the arena is. It’s 20 °C:', html: eq('1.8 × 20 + 32', 68, '°F') }] },
    render: function (box, c) {
      var R = recipe(c); if (!R || !factor(c)) return needFirst(box, 'Finish the checkpoints before this one first.');
      var H = R.hot;
      box.appendChild(el('div', 'pj-u4-formula', '<span>°C = (°F − 32) ÷ 1.8</span><span>°F = 1.8 × °C + 32</span><small>Round to one decimal place. Use brackets on the calculator!</small>'));
      part(box, 'A', H.kind === 'oven' ? 'The oven' : 'Is it cooked?', H.text);
      var g = grid(box); g.appendChild(field(H.F + ' °F in °C', inBox(c, 'hotC', '°C', { aria: H.F + ' degrees Fahrenheit in Celsius' })));
      if (H.kind === 'oven') g.appendChild(field('Set the oven to', c.choice('hotQ', H.dial.map(function (d) { return { v: String(d), html: '<b>' + d + '</b> °C' }; }), { cls: 'pj-seg pj-u4-dial', aria: 'Oven setting' })));
      else g.appendChild(field('The thermometer reads <b>' + meatReading(c) + ' °C</b>. Is it safe to serve?', c.choice('hotQ', [{ v: 'yes', html: 'Yes, it’s hot enough' }, { v: 'no', html: 'No, keep cooking' }], { cls: 'pj-seg', aria: 'Safe to serve' })));
      part(box, 'B', 'The fridge and the freezer', esc(R.cold.fr) + ' must stay at <b>40 °F</b> or colder. ' + esc(R.cold.fz) + ' must freeze at <b>0 °F</b> or colder.');
      var g2 = grid(box);
      g2.appendChild(field('40 °F in °C', inBox(c, 'frC', '°C', { aria: '40 degrees Fahrenheit in Celsius' })));
      g2.appendChild(field('The fridge reads <b>' + frReading(c) + ' °C</b>. Cold enough?', c.choice('frQ', [{ v: 'yes', html: 'Yes' }, { v: 'no', html: 'No' }], { cls: 'pj-seg', aria: 'Fridge cold enough' })));
      var g3 = grid(box);
      g3.appendChild(field('0 °F in °C', inBox(c, 'fzC', '°C', { aria: '0 degrees Fahrenheit in Celsius' })));
      g3.appendChild(field('The freezer reads <b>' + String(fzReading(c)).replace('-', '−') + ' °C</b>. Cold enough?', c.choice('fzQ', [{ v: 'yes', html: 'Yes' }, { v: 'no', html: 'No' }], { cls: 'pj-seg', aria: 'Freezer cold enough' })));
      part(box, 'C', 'And back to °F', esc(R.who) + ' asks how warm the foods room is. The thermostat says <b>' + roomC(c) + ' °C</b>.');
      grid(box).appendChild(field(roomC(c) + ' °C in °F', inBox(c, 'roomF', '°F', { aria: roomC(c) + ' degrees Celsius in Fahrenheit' })));
    },
    check: function (c) {
      var R = recipe(c); if (!R || !factor(c)) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var H = R.hot, eh = toC(H.F), out = [];
      out.push(chk(c, 'hotC', eh, { tol: 0.06, oneDec: true, label: H.F + ' °F', wrong: fcWrong(H.F), hint: '°C = (°F − 32) ÷ 1.8.', hint2: fcHint(H.F) }));
      if (H.kind === 'oven') out.push(c.equals('hotQ', String(nearest(H.dial, eh)), { label: 'Oven setting', hint: 'Pick the setting closest to your answer in °C.' }));
      else out.push(c.equals('hotQ', meatReading(c) >= eh ? 'yes' : 'no', { label: 'Safe to serve?', hint: 'Compare the reading with your answer. The chili is safe only when it’s <b>at least</b> that hot — rounding down isn’t safe!' }));
      var ef = toC(40), ez = toC(0);
      out.push(chk(c, 'frC', ef, { tol: 0.06, oneDec: true, label: '40 °F', wrong: fcWrong(40), hint: '°C = (°F − 32) ÷ 1.8.', hint2: fcHint(40) }));
      out.push(c.equals('frQ', frReading(c) <= ef ? 'yes' : 'no', { label: 'Fridge', hint: 'Cold enough means the fridge is at your answer <b>or colder</b> (a smaller number).' }));
      out.push(chk(c, 'fzC', ez, { tol: 0.06, oneDec: true, label: '0 °F', wrong: fcWrong(0).concat([{ v: 32 / 1.8, tol: 0.06, hint: 'Check the sign: 0 − 32 = −32, so the answer is below zero.' }]), hint: '°C = (°F − 32) ÷ 1.8.', hint2: fcHint(0) }));
      out.push(c.equals('fzQ', fzReading(c) <= ez ? 'yes' : 'no', { label: 'Freezer', hint: 'Below zero, colder means a <b>bigger</b> negative number: −20 °C is colder than −15 °C.' }));
      var rc = roomC(c);
      out.push(chk(c, 'roomF', toF(rc), { tol: 0.06, oneDec: true, label: rc + ' °C', wrong: [{ v: (rc + 32) * 1.8, hint: 'Multiply by 1.8 <b>first</b>, then add 32.' }, { v: rc * 1.8, hint: 'Now add 32.' }, { v: toC(rc), hint: 'That formula changes °F to °C. To go from °C to °F: 1.8 × °C + 32.' }, { v: 2 * rc + 30, tol: 0.06, hint: 'That’s the quick estimate. Use the exact formula: 1.8 × °C + 32.' }, { v: rc + 32, hint: 'Multiply by 1.8 first, then add 32.' }],
        hint: '°F = 1.8 × °C + 32.', hint2: 'Try 1.8 × ' + rc + ' + 32.' }));
      return out;
    },
    solve: function (c) {
      var R = recipe(c), H = R.hot, eh = toC(H.F); c.set('hotC', nf(eh, 1)); c.set('hotQ', H.kind === 'oven' ? String(nearest(H.dial, eh)) : meatReading(c) >= eh ? 'yes' : 'no');
      c.set('frC', nf(toC(40), 1)); c.set('frQ', frReading(c) <= toC(40) ? 'yes' : 'no'); c.set('fzC', (toC(0)).toFixed(1)); c.set('fzQ', fzReading(c) <= toC(0) ? 'yes' : 'no'); c.set('roomF', nf(toF(roomC(c)), 1));
    }
  };

  /* ================= Checkpoint 5: go metric ================= */
  function metricWrong(c, g) {
    var A = scaled(c, g), u = g.u, f = factor(c), w = [];
    if (Math.abs(f - 1) > 1e-9) w.push({ v: g.amt * U[u].f, rel: 0.006, tol: 1, hint: 'That’s the original recipe. Use your scaled amount from Checkpoint 2 (' + amtText(A, u) + ').' });
    if (u === 'cup') w.push({ v: A * 250, rel: 0.004, hint: 'That’s a Canadian metric cup (250 mL). This recipe is American: 1 US cup ≈ 237 mL.' }, { v: A / 237, tol: 0.05, hint: 'Cups → mL: <b>multiply</b> by 237.' }, { v: A * 29.57, rel: 0.004, hint: '29.57 is for fluid ounces. For cups, use 1 US cup ≈ 237 mL.' });
    if (u === 'floz') w.push({ v: A * 28.35, rel: 0.004, hint: '28.35 is for ounces of <b>mass</b> (grams). Fluid ounces are volume: 1 US fl oz ≈ 29.57 mL.' }, { v: A / 29.57, tol: 0.05, hint: 'fl oz → mL: <b>multiply</b> by 29.57.' }, { v: A * 237, rel: 0.004, hint: '237 is for cups. 1 US fl oz ≈ 29.57 mL.' }, { v: A * 30, rel: 0.003, hint: 'Use 29.57 mL for each fluid ounce, not 30.' });
    if (u === 'tbsp') w.push({ v: A * 5, tol: 0.5, hint: '5 mL is a <b>teaspoon</b>. A tablespoon is 15 mL.' }, { v: A / 15, tol: 0.05, hint: 'tbsp → mL: <b>multiply</b> by 15.' });
    if (u === 'tsp') w.push({ v: A * 15, tol: 0.5, hint: '15 mL is a <b>tablespoon</b>. A teaspoon is 5 mL.' }, { v: A / 5, tol: 0.05, hint: 'tsp → mL: <b>multiply</b> by 5.' });
    if (u === 'lb') w.push({ v: A * 0.454, rel: 0.01, tol: 0.006, hint: 'That’s in <b>kilograms</b>. The box wants grams: 1 kg = 1000 g (so 1 lb ≈ 454 g).' }, { v: A * 2.2, rel: 0.01, hint: 'A pound is <b>less</b> than a kilogram. Pounds → grams: multiply by 454.' }, { v: A / 0.454, rel: 0.01, hint: 'Multiply by 0.454 (or 454 for grams) — don’t divide.' }, { v: A * 2200, rel: 0.01, hint: 'A pound is less than a kilogram (1 kg ≈ 2.2 lb). Pounds → grams: multiply by 454.' }, { v: A * 28.35, rel: 0.004, hint: '28.35 is for ounces. For pounds: 1 lb ≈ 454 g.' }, { v: A * 16, tol: 0.5, hint: 'That’s the number of ounces (1 lb = 16 oz). Now change to grams, or use 1 lb ≈ 454 g.' });
    if (u === 'oz') w.push({ v: A * 29.57, rel: 0.004, hint: '29.57 is for <b>fluid</b> ounces (volume). These ounces are mass: 1 oz ≈ 28.35 g.' }, { v: A / 28.35, tol: 0.05, hint: 'oz → g: <b>multiply</b> by 28.35.' }, { v: A * 454, rel: 0.005, hint: '454 is for pounds. 1 oz ≈ 28.35 g.' }, { v: A * 0.02835, rel: 0.01, tol: 0.006, hint: 'That’s in kilograms. The box wants grams.' }, { v: A / 16, tol: 0.01, hint: 'That’s pounds. Change ounces to grams: × 28.35.' });
    return w;
  }
  function cardCheck(c, g) {
    var k = 'cv.' + g.id, e = metricExact(c, g), nm = unitNames(g), lab = esc(short(g)) + ' on the card', base = { label: lab, graded: true };
    if (!c.has(k)) return R0(k, false, Object.assign(base, { blank: true }));
    var x = c.num(k); if (isNaN(x)) return R0(k, false, Object.assign(base, { form: true, hint: 'Type just a number, like 1.8 or 250.' }));
    if (!c.has('cu.' + g.id)) return null; // the unit box reports itself
    var big = c.get('cu.' + g.id) === 'b', m = c.num('m.' + g.id), cands = [e, e * 0.995, e * 1.005];
    if (!isNaN(m) && Math.abs(m - e) <= 1 + 0.006 * e) cands.push(m);
    var ok = cands.some(function (y) { var t = cardTarget(y); return t.big ? big && Math.abs(x - t.v) < 1e-6 : big ? Math.abs(x * 1000 - t.v) < 0.5 : Math.abs(x - t.v) < 1e-6; });
    if (ok) return R0(k, true, base);
    var t = cardTarget(e), h, near = function (y) { return Math.abs(y - e) <= 1 + 0.01 * e; };
    if (t.big && !big && (near(x) || Math.abs(x - t.v * 1000) < 60)) h = '1000 or more: change it to <b>' + nm[1] + '</b> (÷ 1000) with one decimal place, like 1.8 ' + nm[1] + '.';
    else if (t.big && big && near(x * 1000)) h = 'Round to <b>one decimal place</b>, like 2.4 ' + nm[1] + '.';
    else if (t.big && big && near(x)) h = 'That’s still ' + nm[0] + '. Divide by 1000 to change it to ' + nm[1] + '.';
    else if (!t.big && !big && near(x)) h = 'Now round it for the card: ' + (e < 100 ? 'under 100 → nearest <b>5</b>' : '100 to 999 → nearest <b>10</b>') + '.';
    else if (!t.big && big) h = 'Check the unit: ' + nf(x, 2) + ' ' + nm[1] + ' is far too much! Under 1000, keep it in ' + nm[0] + '.';
    else h = 'Round your metric amount: under 100 → nearest 5; 100 to 999 → nearest 10; 1000 or more → ' + nm[1] + ' with one decimal.';
    return R0(k, false, Object.assign(base, { hint: h, hint2: 'Your metric amount is about ' + nf(e, 0) + ' ' + nm[0] + '. Use the rounding rule in the blue box.' }));
  }
  var cp5 = {
    id: 'metric', title: 'Go metric', needs: ['u4l2', 'u4l4', 'u4l5'],
    goal: 'Change every ingredient to <b>mL</b> or <b>g</b> with the conversion facts, then round it sensibly for your recipe card.',
    example: { title: 'Grandma Ruth’s pancakes, in metric', scene: '<div class="pj-u4-facts pj-u4-facts-sm"><span>1 US cup ≈ 237 mL</span><span>1 tbsp = 15 mL</span><span>1 tsp = 5 mL</span><span>1 lb ≈ 454 g</span></div>', steps: [
      { cap: 'Milk: 7½ US cups. Multiply by 237 — <b>not</b> 250. A 250 mL cup is a Canadian metric cup, and this recipe is American.', html: eq('7.5 × 237', 1777.5, 'mL') },
      { cap: 'Nobody measures 1777.5 mL! For the card, round sensibly: <b>1000 or more → change to L</b> with one decimal.', html: chip('1777.5 mL = 1.7775 L → on the card: <b>1.8 L</b>', 'pj-x-nice') },
      { cap: 'Bacon: 2½ lb. 1 lb ≈ 454 g. That’s over 1000 g, so the card says kilograms.', html: eq('2.5 × 454', 1135, 'g') + chip('On the card: <b>1.1 kg</b>', 'pj-x-nice') },
      { cap: 'Sugar: 10 tbsp × 15 mL = 150 mL. Between 100 and 999 → nearest 10: <b>150 mL</b>.', html: eq('10 × 15', 150, 'mL') },
      { cap: 'Vanilla: 5 tsp × 5 mL = 25 mL. Under 100 → nearest 5: <b>25 mL</b>. And eggs stay eggs: 10 eggs!', html: eq('5 × 5', 25, 'mL') + chip('🥚 10 eggs — no change!') }] },
    render: function (box, c) {
      var R = recipe(c), f = factor(c); if (!R || !f) return needFirst(box, 'Finish the checkpoints before this one first.');
      box.appendChild(el('div', 'pj-u4-facts', ['cup', 'floz', 'tbsp', 'tsp', 'lb', 'oz'].map(function (u) { return '<span>' + U[u].fact + '</span>'; }).join('')));
      box.appendChild(el('div', 'pj-tip pj-u4-rule', '<b>Rounding for the card:</b> under 100 → nearest 5 · 100 to 999 → nearest 10 · 1000 or more → change to L or kg with one decimal (1000 mL = 1 L, 1000 g = 1 kg).'));
      var tb = el('div', 'pj-u4-conv'); tb.appendChild(el('div', 'pj-u4-ch', '<span>Ingredient (for ' + people(c) + ')</span><span>Metric amount</span><span>On the card</span>'));
      R.ings.forEach(function (g) {
        var r = el('div', 'pj-u4-cr'), A = scaled(c, g);
        r.appendChild(el('div', 'pj-u4-tn', '<b>' + esc(short(g)) + '</b><small>' + (g.u === 'ea' ? '' : us(amtText(A, g.u))) + (g.grp ? ' · ' + esc(g.grp) : '') + '</small>'));
        if (g.u === 'ea') { r.appendChild(el('div', 'pj-u4-egg', '🥚 <b>' + frac(A) + ' eggs</b> — eggs don’t need converting!')); tb.appendChild(r); return; }
        var nm = unitNames(g), f1 = el('div', 'pj-field'); f1.appendChild(inBox(c, 'm.' + g.id, nm[0], { aria: 'Metric amount of ' + g.name + ' in ' + nm[0] })); r.appendChild(f1);
        var f2 = el('div', 'pj-field pj-u4-cardin'); f2.appendChild(inBox(c, 'cv.' + g.id, '', { aria: 'Card amount of ' + g.name }));
        f2.appendChild(c.choice('cu.' + g.id, [{ v: 's', html: nm[0] }, { v: 'b', html: nm[1] }], { cls: 'pj-seg pj-u4-unit', aria: 'Card unit for ' + g.name }));
        r.appendChild(f2); tb.appendChild(r);
      });
      box.appendChild(tb);
    },
    check: function (c) {
      var R = recipe(c), f = factor(c); if (!R || !f) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var out = [];
      R.ings.forEach(function (g) {
        if (g.u === 'ea') return;
        var A = scaled(c, g), nm = unitNames(g);
        out.push(chk(c, 'm.' + g.id, metricExact(c, g), { tol: 1, rel: 0.006, label: esc(short(g)), wrong: metricWrong(c, g), hint: nm[0] + ' = ' + U[g.u].p + ' × ' + U[g.u].f + ' (' + U[g.u].fact + ').', hint2: 'Try ' + nf(A) + ' × ' + U[g.u].f + ' on the calculator.' }));
        out.push(cardCheck(c, g));
        out.push(c.need('cu.' + g.id, { label: esc(short(g)) + ' unit' }));
      });
      return out;
    },
    solve: function (c) { ings(c).forEach(function (g) { if (g.u === 'ea') return; var e = metricExact(c, g), t = cardTarget(e); c.set('m.' + g.id, String(Math.round(e))); c.set('cv.' + g.id, t.big ? t.v.toFixed(1) : String(t.v)); c.set('cu.' + g.id, t.big ? 'b' : 's'); }); }
  };

  /* ================= Checkpoint 6: groceries ================= */
  function flyerSide(c, key) {
    var S = STORE[key], items = shopItems(c);
    return '<div class="pj-u4-store pj-u4-store-' + key + '"><div class="pj-u4-store-h"><b>' + S.name + '</b><small>' + S.note + '</small></div>' +
      items.map(function (g) { var p = prices(c, g); return '<div class="pj-u4-store-r"><span>' + g.shop.icon + ' ' + esc(g.shop.name) + '</span><b>' + money(p[key]) + '<small>/' + S.per + '</small></b></div>'; }).join('') + '</div>';
  }
  var cp6 = {
    id: 'shop', title: 'Go shopping', needs: ['u1l6', 'u4l5'],
    goal: 'Compare a flyer that prices <b>per pound</b> with a store that prices <b>per kilogram</b>, buy each item at the cheaper store, and find the total.',
    example: { title: 'Buying the bacon', scene: '<div class="pj-u4-x-stores"><div class="pj-u4-store pj-u4-store-A"><div class="pj-u4-store-h"><b>Foothills Foods</b><small>prices per pound</small></div><div class="pj-u4-store-r"><span>🥓 Bacon</span><b>$5.49<small>/lb</small></b></div></div><div class="pj-u4-store pj-u4-store-B"><div class="pj-u4-store-h"><b>Bow River Market</b><small>prices per kilogram</small></div><div class="pj-u4-store-r"><span>🥓 Bacon</span><b>$11.99<small>/kg</small></b></div></div></div>', steps: [
      { cap: 'You can’t compare $/lb with $/kg. 1 kg ≈ 2.2 lb, so a kilogram costs about <b>2.2 times</b> as much as a pound. (Dividing by 0.454 works too.)', html: eq('$5.49 × 2.2', 12.08, '/kg', 'money') },
      { cap: 'Bow River’s $11.99/kg is less than $12.08/kg, so Bow River is cheaper for bacon.', html: '<div class="pj-x-star">★ Cheaper: Bow River Market</div>' },
      { cap: 'Coach needs 1135 g of bacon. 1000 g = 1 kg, so that’s 1.135 kg. Cost = kg × price per kg.', html: eq('1.135 × $11.99', 13.61, '', 'money') },
      { cap: 'Basic groceries have <b>no GST</b> in Canada, but paper plates do: 5% GST.', html: eq('$7.99 × 0.05', 0.4, '', 'money') + eq('$7.99 + $0.40', 8.39, '', 'money', 900) },
      { cap: 'Add every line for the total, then compare it with the budget.', html: '<table class="pj-x-tbl"><tr><td>🥓 Bacon</td><td>$13.61</td></tr><tr><td>🥛 Milk, flour, eggs…</td><td>$23.20</td></tr><tr><td>🍽️ Plates + GST</td><td>$8.39</td></tr><tr><td><b>Total</b></td><td class="win">$45.20</td></tr></table>' }] },
    render: function (box, c) {
      var R = recipe(c), items = shopItems(c); if (!R || !factor(c)) return needFirst(box, 'Finish the checkpoints before this one first.');
      box.appendChild(el('p', 'pj-tip', 'Price per kg = price per lb × 2.2 (1 kg ≈ 2.2 lb). Amount in kg = grams ÷ 1000. Cost = kg × price per kg. Basic groceries have no GST; the paper supplies do (5%).'));
      box.appendChild(el('div', 'pj-u4-stores', flyerSide(c, 'A') + flyerSide(c, 'B')));
      part(box, 'A', 'Compare and buy', 'Use your metric amounts from Checkpoint 5. Both stores sell these by weight, so you can buy exactly what you need.');
      items.forEach(function (g) {
        var p = prices(c, g), card = el('div', 'pj-prod pj-u4-gi'), mg = val(c, 'm.' + g.id, Math.round(metricExact(c, g)));
        card.appendChild(el('div', 'pj-ph', '<span class="pj-pi">' + g.shop.icon + '</span><b>' + esc(g.shop.name) + '</b><span class="pj-cost">You need <b>' + nfc(mg, 1) + ' g</b></span>'));
        var gg = el('div', 'pj-grid3');
        gg.appendChild(field('Amount', inBox(c, 'g.' + g.id + '.kg', 'kg', { aria: g.shop.name + ' amount in kilograms' })));
        gg.appendChild(field('Foothills price per kg', c.input('g.' + g.id + '.pk', { aria: 'Foothills price per kilogram for ' + g.shop.name })));
        gg.appendChild(field('Cheaper store', c.choice('g.' + g.id + '.st', [{ v: 'A', html: 'Foothills' }, { v: 'B', html: 'Bow River' }], { cls: 'pj-seg', aria: 'Cheaper store for ' + g.shop.name })));
        gg.appendChild(field('Cost there', c.input('g.' + g.id + '.cost', { aria: 'Cost of ' + g.shop.name })));
        card.appendChild(gg); box.appendChild(card);
        void p;
      });
      var S = supNums(c);
      part(box, 'B', 'Party supplies', R.sup.icon + ' ' + esc(R.sup.name) + ': <b>' + money(S.price) + '</b> + 5% GST.');
      var g2 = grid(box); g2.appendChild(field('GST (5%)', c.input('sup.gst', { aria: 'GST on supplies' }))); g2.appendChild(field('Supplies total', c.input('sup.tot', { aria: 'Supplies total' })));
      part(box, 'C', 'The total', 'The student council gave you <b>' + money(budget(c)) + '</b> for groceries and supplies.');
      var g3 = grid(box); g3.appendChild(field('Total cost', c.input('total', { aria: 'Total cost' })));
      g3.appendChild(field('Is it under the budget?', c.choice('budget', [{ v: 'under', html: 'Yes, under budget' }, { v: 'over', html: 'No, over budget' }], { cls: 'pj-seg', aria: 'Under budget' })));
    },
    check: function (c) {
      var R = recipe(c); if (!R || !factor(c)) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var out = [], sum = 0;
      shopItems(c).forEach(function (g) {
        var p = prices(c, g), kE = kgExact(c, g), lab = esc(g.shop.name), pre = 'g.' + g.id + '.', lb = scaled(c, g) * (g.u === 'oz' ? 1 / 16 : 1);
        out.push(chk(c, pre + 'kg', kE, { tol: 0.006, rel: 0.003, label: lab + ' amount', wrong: [{ v: lb, rel: 0.003, tol: 0.006, hint: 'That’s pounds. Use your metric amount (grams) ÷ 1000.' }, { v: scaled(c, g), rel: 0.003, tol: 0.006, hint: 'That’s the US amount. Use your metric amount (grams) ÷ 1000.' }], hint: 'kg = grams ÷ 1000.', hint2: 'Try ' + nf(kE * 1000, 0) + ' ÷ 1000.' }));
        out.push(c.money(pre + 'pk', p.aKg, { tol: 0.011 + 0.004 * p.aKg, label: lab + ' per kg', wrong: [{ v: p.A / 2.2, tol: 0.03, hint: 'A kilogram is <b>more</b> than a pound (1 kg ≈ 2.2 lb), so the price per kg must be bigger. Multiply by 2.2.' }, { v: p.A * 0.454, tol: 0.03, hint: 'A kilogram is more than a pound, so the price per kg is bigger. Multiply by 2.2 (or divide by 0.454).' }, { v: p.A * 1000, tol: 5, hint: 'Multiply by 2.2: 1 kg ≈ 2.2 lb.' }],
          hint: 'Price per kg = price per lb × 2.2.', hint2: 'Try ' + money(p.A) + ' × 2.2.' }));
        var sk = val(c, pre + 'pk', p.aKg); if (Math.abs(sk - p.aKg) > 0.011 + 0.004 * p.aKg) sk = p.aKg;
        out.push(c.equals(pre + 'st', p.cheap, { label: lab + ' store', hint: 'Compare the two prices <b>per kg</b>. The smaller one is cheaper.' }));
        var st = c.get(pre + 'st') || p.cheap, kS = val(c, pre + 'kg', kE); if (Math.abs(kS - kE) > 0.006 + 0.003 * kE) kS = kE;
        var price = st === 'A' ? sk : p.B, other = st === 'A' ? p.B : sk, exp = kS * price, tol = 0.02 + 0.006 * exp, x = c.num(pre + 'cost');
        var lbOk = st === 'A' && !isNaN(x) && Math.abs(x - lb * p.A) <= tol; // pounds × price per pound is right too
        var rr = lbOk ? R0(pre + 'cost', true, { label: lab + ' cost' }) : c.money(pre + 'cost', exp, { tol: tol, label: lab + ' cost', wrong: [{ v: kS * other, tol: tol, hint: 'That’s the price at the other store. Use the store you picked.' }, { v: kS * p.A, tol: tol, hint: 'You multiplied kilograms by the price per <b>pound</b>. Use the price per kg.' }, { v: lb * p.B, tol: tol, hint: 'You multiplied pounds by the price per <b>kg</b>. Use kilograms.' }, { v: kS * 1000 * price, tol: tol * 1000, hint: 'Use kilograms, not grams: grams ÷ 1000.' }],
          hint: 'Cost = kg × price per kg.', hint2: 'Try ' + nf(kS) + ' × ' + money(price) + '.' });
        out.push(rr);
        sum += val(c, pre + 'cost', costExact(c, g));
      });
      var S = supNums(c);
      out.push(c.money('sup.gst', S.price * 0.05, { label: 'GST', wrong: [{ v: S.price * 5, tol: 0.05, hint: 'Use 5% as a decimal: <b>0.05</b>.' }, { v: S.price * 0.5, tol: 0.02, hint: '5% is <b>0.05</b>, not 0.5.' }, { v: S.price * 1.05, tol: 0.02, hint: 'That’s the total. The GST is just the 5% part.' }], hint: 'GST = price × 0.05.', hint2: 'Try ' + money(S.price) + ' × 0.05.' }));
      var sg = val(c, 'sup.gst', S.gst);
      out.push(c.money('sup.tot', S.price + sg, { tol: 0.011, label: 'Supplies total', wrong: [{ v: S.price - sg, hint: 'Add the GST — don’t subtract it.' }], hint: 'Total = price + GST.', hint2: 'Add: ' + money(S.price) + ' + ' + money(sg) + '.' }));
      sum += val(c, 'sup.tot', S.tot);
      var groc = shopItems(c).map(function (g) { return val(c, 'g.' + g.id + '.cost', costExact(c, g)); });
      out.push(c.money('total', sum, { tol: 0.021, label: 'Total', wrong: [{ v: sum - val(c, 'sup.tot', S.tot), tol: 0.021, hint: 'Include the party supplies too.' }], hint: 'Add up every cost: the groceries and the supplies total.', hint2: groc.map(money).join(' + ') + ' + ' + money(val(c, 'sup.tot', S.tot)) + '.' }));
      var tS = val(c, 'total', sum);
      out.push(c.equals('budget', tS <= budget(c) ? 'under' : 'over', { label: 'Budget', hint: 'Compare your total with the budget (' + money(budget(c)) + ').' }));
      return out;
    },
    solve: function (c) {
      var sum = 0;
      shopItems(c).forEach(function (g) { var p = prices(c, g), pre = 'g.' + g.id + '.', k = kgExact(c, g), cost = costExact(c, g); c.set(pre + 'kg', nf(k)); c.set(pre + 'pk', p.aKg.toFixed(2)); c.set(pre + 'st', p.cheap); c.set(pre + 'cost', cost.toFixed(2)); sum += cost; });
      var S = supNums(c); c.set('sup.gst', S.gst.toFixed(2)); c.set('sup.tot', S.tot.toFixed(2)); sum = r2(sum + S.tot); c.set('total', sum.toFixed(2)); c.set('budget', sum <= budget(c) ? 'under' : 'over');
    }
  };

  /* ================= Checkpoint 7: the recipe card, a look back, hand it in ================= */
  function tempText(c, key, F) { var x = c.num(key); return degC(isNaN(x) ? toC(F) : x); }
  function cardHtml(c) {
    var R = recipe(c); if (!R) return '';
    var col = c.get('cardColor') || COLORS[0][0], k = cont(c), n = people(c), H = R.hot, grp = '';
    var hot = H.kind === 'oven' ? (c.get('hotQ') || nearest(H.dial, toC(H.F))) + ' °C' : 'at least ' + tempText(c, 'hotC', H.F);
    var fill = { hot: '<b>' + hot + '</b>', fr: '<b>' + tempText(c, 'frC', 40) + '</b>', fz: '<b>' + tempText(c, 'fzC', 0) + '</b>' };
    var steps = R.steps.map(function (s) { return '<li>' + s.replace(/¾ inch \(2 cm\)/, '2 cm').replace(/\{(\w+)\}/g, function (_, q) { return fill[q]; }) + '</li>'; });
    if (k) { var nk = Number(c.get('nCont')) || contCount(c); steps.unshift('<li>You’ll need <b>' + nk + ' ' + esc(k.name.toLowerCase()) + (nk === 1 ? '' : 's') + '</b> (' + esc(dims(k)) + ').</li>'); }
    var list = R.ings.map(function (g) { var h = g.grp && g.grp !== grp ? '<li class="pj-u4-grp">' + esc(g.grp) + '</li>' : ''; grp = g.grp || grp; return h + '<li>' + esc(cardText(c, g)) + '</li>'; }).join('');
    var shop = shopItems(c).map(function (g) { var st = c.get('g.' + g.id + '.st') || prices(c, g).cheap, kg = val(c, 'g.' + g.id + '.kg', kgExact(c, g)), cost = val(c, 'g.' + g.id + '.cost', costExact(c, g)); return '<tr><td>' + g.shop.icon + ' ' + esc(g.shop.name) + '</td><td>' + nf(kg) + ' kg</td><td>' + esc(STORE[st].name) + '</td><td>' + money(cost) + '</td></tr>'; }).join('');
    var S = supNums(c), sup = val(c, 'sup.tot', S.tot), tot = studentTotal(c);
    return '<div class="pj-u4-rcard" style="--tc:' + esc(col) + '"><div class="pj-u4-rc-top"><span class="pj-u4-rc-i">' + R.icon + '</span><div><div class="pj-u4-rc-t">' + esc(dishName(c)) + '</div><div class="pj-u4-rc-s">Serves ' + n + ' · rescued from ' + esc(R.who) + '’s recipe · now in metric</div></div></div>' +
      '<div class="pj-u4-rc-body"><div><h4>Ingredients</h4><ul>' + list + '</ul></div><div><h4>Method</h4><ol>' + steps.join('') + '</ol>' + (c.get('tip') ? '<div class="pj-u4-rc-tip">💡 ' + esc(c.get('tip')) + '</div>' : '') + '</div></div>' +
      '<div class="pj-u4-rc-shop"><h4>Shopping list</h4><table><thead><tr><th>Item</th><th>Amount</th><th>Store</th><th>Cost</th></tr></thead><tbody>' + shop +
      '<tr><td>' + R.sup.icon + ' ' + esc(R.sup.name) + '</td><td>1</td><td>incl. GST</td><td>' + money(sup) + '</td></tr></tbody><tfoot><tr><td colspan="3">Total</td><td>' + money(tot) + '</td></tr></tfoot></table></div></div>';
  }
  var cp7 = {
    id: 'card', title: 'Your recipe card — and hand it in', needs: [], submit: true,
    goal: 'Style your <b>metric recipe card</b> and shopping list, look back at the cost per person, and <b>hand in</b> your project.',
    passMsg: 'Your project has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Coach Daniels’ card', steps: [
      { cap: 'The card is built from everything you did: metric amounts, °C, the pots and pans, and the shopping list.', html: '<div class="pj-x-mini"><b>Pucks’ Power Pancakes</b><span>1.1 kg bacon · 1.8 L milk · 150 mL sugar</span><span>Griddle at 190 °C · 2 pitchers</span><span>Shopping total: $45.20</span></div>' },
      { cap: '<b>Cost per person</b> = total ÷ number of people. That’s a unit rate, like in Unit 1!', html: eq('$45.20 ÷ 20', 2.26, '', 'money') },
      { cap: 'A look back: if Coach had used a 250 mL Canadian cup for 7½ cups of milk, he’d add 250 − 237 = 13 mL too much for every cup.', html: eq('7.5 × 13', 97.5, 'mL extra') }] },
    render: function (box, c) {
      var R = recipe(c); if (!R || !factor(c)) return needFirst(box, 'Finish the checkpoints before this one first.');
      part(box, 'A', 'Style your recipe card', 'Everything on it comes from your checkpoints. Print it for the foods room!');
      var prev = el('div', 'pj-u4-rcwrap', cardHtml(c));
      var row = el('div', 'pj-order');
      row.appendChild(field('Colour', c.choice('cardColor', COLORS.map(function (x) { return { v: x[0], html: '<i style="background:' + x[0] + '"></i>' + x[1], title: x[1] }; }), { cls: 'pj-swatches', aria: 'Card colour', onPick: function () { prev.innerHTML = cardHtml(c); } })));
      row.appendChild(field('Cook’s tip (optional)', c.text('tip', { ph: 'e.g. Make it the day before — it tastes even better!', max: 70, aria: 'Cook’s tip', onInput: function () { prev.innerHTML = cardHtml(c); } }), 'pj-u4-tipf'));
      box.appendChild(row); box.appendChild(prev);
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my recipe card'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<link rel="stylesheet" href="' + CSS + '"><div class="pj-printsheet pj-u4-print">' + cardHtml(c) + '</div>', dishName(c) + ' recipe card'); });
      if (!c.ro) box.appendChild(pr);
      var g = shopItems(c).length, ex = ingById(R, R.extra), cups = scaled(c, ex);
      part(box, 'B', 'Look back', 'Your shopping total was <b>' + money(studentTotal(c)) + '</b> for <b>' + people(c) + '</b> people.');
      var q = grid(box);
      q.appendChild(field('Cost per person', c.input('perServ', { aria: 'Cost per person' })));
      q.appendChild(field('Using a 250 mL cup for the ' + esc(short(ex).toLowerCase()) + ' (' + amtText(cups, ex.u) + '), how many mL too much?', inBox(c, 'extra', 'mL', { aria: 'Extra millilitres' }), 'pj-u4-wq'));
      box.appendChild(field('Which conversion would be the worst one to get wrong in a real kitchen? Why?', c.text('reflect', { area: true, rows: 3, max: 400, ph: 'e.g. The oven temperature, because 350 °C would burn the bars…', aria: 'Reflection' }), 'pj-wide'));
      void g;
    },
    check: function (c) {
      var R = recipe(c); if (!R || !factor(c)) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var out = [c.need('cardColor', { label: 'Card colour' })], n = people(c), t = studentTotal(c), ex = ingById(R, R.extra), cups = scaled(c, ex);
      out.push(c.money('perServ', t / n, { tol: 0.011, label: 'Cost per person', wrong: [{ v: n / t, tol: 0.02, hint: 'Flip it: total cost ÷ number of people.' }, { v: t / R.serves, tol: 0.011, hint: 'Divide by the number of people you’re feeding (' + n + '), not the original recipe.' }, { v: t * n, tol: 1, hint: 'Divide the total by the number of people.' }], hint: 'Cost per person = total ÷ people.', hint2: 'Try ' + money(t) + ' ÷ ' + n + '.' }));
      out.push(chk(c, 'extra', cups * 13, { tol: 0.6, rel: 0.01, label: 'Extra mL', wrong: [{ v: cups * 250, rel: 0.004, hint: 'That’s the whole amount with 250 mL cups. The extra is the <b>difference</b>: 250 − 237 = 13 mL for each cup.' }, { v: cups * 237, rel: 0.004, hint: 'That’s the right amount. How much <b>more</b> would a 250 mL cup give? 250 − 237 = 13 mL each cup.' }, { v: 13, tol: 0.1, hint: 'That’s for one cup. Multiply by the number of cups.' }, { v: ex.amt * 13, tol: 0.6, hint: 'Use your scaled amount (' + amtText(cups, ex.u) + ').' }],
        hint: 'Extra = number of cups × (250 − 237).', hint2: 'Try ' + nf(cups) + ' × 13.' }));
      out.push(c.need('reflect', { min: 15, label: 'Your answer', hint: 'Write a sentence or two: which conversion, and why?' }));
      return out;
    },
    solve: function (c) { var R = recipe(c), ex = ingById(R, R.extra); c.set('cardColor', COLORS[1][0]); c.set('perServ', r2(studentTotal(c) / people(c)).toFixed(2)); c.set('extra', nf(scaled(c, ex) * 13, 1)); c.set('reflect', 'The oven temperature, because 375 °C is way too hot and would burn everything.'); }
  };

  var ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 22c-4.4 0-7-3-7-6.6C6 11.6 9 9 12.6 9.4 14 6 17.6 4 21.4 4.6 24 2.4 28.4 2.4 31 4.6c3.8-.6 7.4 1.4 8.4 4.8C43 9 46 11.6 46 15.4c0 3.6-2.6 6.6-7 6.6z" fill="#fff" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 22h26v6H13z" fill="currentColor"/><path d="M15 28h22l-2 15a2 2 0 0 1-2 1.8H19a2 2 0 0 1-2-1.8z" fill="#fff" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M21 33v7M26 33v7M31 33v7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  HW.defineProject({
    id: 'u4', unit: 4, title: 'Recipe Rescue', outcomes: ['M1', 'M2'], icon: ICON,
    tagline: 'Rescue an American recipe for a class party: scale it up, fit it in the pots, go metric, and shop for it.',
    intro: '<div class="pj-intro-art">' + ICON + '</div><div><b>Welcome to Recipe Rescue!</b> Your class is having a party, and the recipe is American — cups, pounds and °F. Our kitchen is metric. In 7 checkpoints you’ll use the math from Unit 4 to rescue it and make a metric recipe card. Your work saves as you go. It’s due on the Unit 4 test day.</div>',
    lessonNames: { u1l3: 'Ratios', u1l4: 'Proportions', u1l6: 'Unit Price', u4l1: 'Volume', u4l2: 'Capacity', u4l3: 'Temperature', u4l4: 'Mass', u4l5: 'Converting Mass' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: cardHtml
  });
})(typeof window !== 'undefined' ? window : global);
