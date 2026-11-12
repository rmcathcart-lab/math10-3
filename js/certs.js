/* Outcome certification cards: a wallet-sized trade certification card (a "ticket") for each outcome, in seven levels.
 *   Not yet issued (Not meeting) · Trainee (Limited) · Apprentice I (Beginning) · Apprentice II (Emerging) ·
 *   Journeyperson (Progressing) · Master (Advancing) · Master Certified (Mastery)
 * Each outcome has its own header colour and trade-style icon (DESIGNS: a price tag, a pay stub, a wrench, a metric tape,
 * an imperial rule, a level, floor tiles, a pentomino, a carpenter's square, a blueprint, a clinometer, rail tracks, a
 * protractor). The level is the card stock (TIERS): a dashed outline before it's issued, plain paper, white laminate, a
 * bronze edge, then brushed silver and gold with a holographic foil stripe, and Master Certified is black and gold with a
 * turning holographic seal. Six diamonds in the header count the level.
 * The front is plain SVG (no WebGL), with a simple layout under 120 px wide (the row beside "Hi, …") and the full card
 * (holder's name, card number, barcode, "Issued by Mr. Cathcart") above it. The back (in the viewer) is HTML: the outcome's
 * official wording (HW.OUTCOME_TEXT) and what each level means.
 *
 *   HW.Certs.row(list)          → an element with one small card per item ({ o: 'N1', tier: 4, src: 'from practice' }); tap opens the viewer
 *   HW.Certs.open(list, i, opt) → the viewer: the card big (tilt it, tap to flip it), its level, the outcome, and the seven levels for it
 *   HW.Certs.tierOf('PRG')      → 4   (NM 0 … MAS 6)
 *   HW.Certs.svg(o, tier, size) → the card's SVG markup (size = width in px; an optional 4th argument is the holder's name)
 * HW.Medals and HW.Badges are the same object (the home page code was written for the Math 10C medals and Math 15 badges);
 * the class names badge-row / badge-btn / badge-pop are kept beside cert-* because js/app.js looks for them. */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  var COND = "'Barlow Condensed','Arial Narrow','Roboto Condensed',sans-serif", SANS = "system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif",
    MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  var ISSUER = 'Mr. Cathcart';

  /* the levels: the card stock. body = fill (or a gradient key), edge/ew = the edge, ink/mu = text and small labels,
     lc = the level name's colour, rule = the line under the header, foil = holographic stripe, seal = the turning seal */
  var TIERS = [
    { name: 'Not yet issued', short: 'Not yet', lv: 'NM', level: 'Not meeting', mean: 'no evidence yet: practise to be issued a card' },
    { name: 'Trainee', short: 'Trainee', lv: 'LIM', level: 'Limited', stock: 'Plain card', mean: 'some of it, with a lot of help',
      body: '#efe6d0', edge: '#c3b28a', ew: 1, ink: '#3b3226', mu: '#86775a', lc: '#5c4a2c', rule: 'rgba(60,45,20,.25)' },
    { name: 'Apprentice I', short: 'Appr. I', lv: 'BEG', level: 'Beginning', stock: 'White laminate', mean: 'the basic, direct questions',
      body: '#ffffff', edge: '#aebdcb', ew: 1.3, ink: '#1f2430', mu: '#717b8b', lc: '#2a5a8a', rule: 'rgba(30,40,60,.18)', gloss: 1 },
    { name: 'Apprentice II', short: 'Appr. II', lv: 'EMG', level: 'Emerging', stock: 'Bronze edge', mean: 'the basics well; starting the everyday ones',
      body: '#fffdf8', edge: 'bronze', ew: 3.4, ink: '#2a211a', mu: '#7d6a58', lc: '#8a4f22', rule: '#b8794a', gloss: 1 },
    { name: 'Journeyperson', short: 'Journey\u00adperson', lv: 'PRG', level: 'Progressing', stock: 'Silver, foil stripe', mean: 'the everyday questions on your own',
      body: 'silver', edge: '#7c8692', ew: 1.6, ink: '#1c232d', mu: '#525c69', lc: '#36404c', rule: '#8e98a4', gloss: 1, foil: 1, brush: 1 },
    { name: 'Master', short: 'Master', lv: 'ADV', level: 'Advancing', stock: 'Gold, foil stripe', mean: 'harder, multi-step questions',
      body: 'gold', edge: '#8a5d06', ew: 1.6, ink: '#33240a', mu: '#6b521d', lc: '#5e3c00', rule: '#a87814', gloss: 1, foil: 1, brush: 1 },
    { name: 'Master Certified', short: 'Master Cert.', lv: 'MAS', level: 'Mastery', stock: 'Black and gold, holographic seal', mean: 'the hardest, unfamiliar problems, explained',
      body: '#15120d', edge: 'goldg', ew: 2.6, ink: 'goldg', mu: '#b59b5c', lc: 'goldg', rule: '#c99a2e', foil: 1, seal: 1, dark: 1 }
  ];
  var TIER_OF = { NM: 0, LIM: 1, BEG: 2, EMG: 3, PRG: 4, ADV: 5, MAS: 6 };

  /* each outcome: header colour c (and its text colour t), icon accent a, icon, and the short label (one or two lines).
     Every outcome has its own colour, so no unit repeats one. */
  var DESIGNS = {
    N1: { c: '#1e7a46', t: '#fff', a: '#f6d36b', i: 'tag', l: ['UNIT PRICING &', 'CURRENCY EXCHANGE'] },
    N2: { c: '#2f5fc4', t: '#fff', a: '#7fcf8e', i: 'paystub', l: ['INCOME:', 'GROSS & NET PAY'] },
    A1: { c: '#c4471d', t: '#fff', a: '#2a241b', i: 'wrench', l: ['WORKING WITH', 'FORMULAS'] },
    M1: { c: '#e5a50a', t: '#2a1e00', a: '#fbe58a', i: 'tape', l: ['THE SI (METRIC)', 'SYSTEM'] },
    M2: { c: '#7a3fa8', t: '#fff', a: '#f4e3a6', i: 'rule', l: ['THE IMPERIAL', 'SYSTEM'] },
    M3: { c: '#0b8183', t: '#fff', a: '#f4e3a6', i: 'level', l: ['LINEAR', 'MEASUREMENT'] },
    M4: { c: '#9b5130', t: '#fff', a: '#e9c9a5', i: 'tiles', l: ['AREA &', 'SURFACE AREA'] },
    G1: { c: '#c62f72', t: '#fff', a: '#ffd0e3', i: 'pento', l: ['SPATIAL PUZZLES', '& GAMES'] },
    G2: { c: '#4a5868', t: '#fff', a: '#cfd6de', i: 'square', l: ['THE PYTHAGOREAN', 'THEOREM'] },
    G3: { c: '#174a86', t: '#fff', a: '#ffd23f', i: 'blueprint', l: ['SIMILARITY', '& SCALE'] },
    G4: { c: '#5f8a1a', t: '#fff', a: '#e3c27a', i: 'clino', l: ['PRIMARY TRIG', 'RATIOS'] },
    G5: { c: '#8e2b2b', t: '#fff', a: '#a87a4f', i: 'rails', l: ['PARALLEL LINES &', 'TRANSVERSALS'] },
    G6: { c: '#1683a8', t: '#fff', a: '#d6f0f8', i: 'protractor', l: ['ANGLES: DRAW,', 'COPY & BISECT'] }
  };
  var STRAND = { N: 'NUMBER', A: 'ALGEBRA', M: 'MEASUREMENT', G: 'GEOMETRY' };
  function design(o) { return DESIGNS[o] || { c: '#475569', t: '#fff', a: '#e2e8f0', i: '', l: [String(o || '').toUpperCase()] }; }

  function mix(a, b, t) { var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), out = '#'; [16, 8, 0].forEach(function (s) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); out += ('0' + v.toString(16)).slice(-2); }); return out; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hash(s) { var h = 2166136261; s = String(s); for (var k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var x = seed || 1; return function () { x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 8) / 16777216; }; }
  function holderName(h) { if (h != null) return String(h); try { var s = HW.App && HW.App.session && HW.App.session(); return (s && s.name) || ''; } catch (e) { return ''; } }
  function cardNo(o, holder) { return o + '-' + ('000' + (hash(String(holder || '').toLowerCase() + '|' + o) % 10000)).slice(-4); }
  function f2(n) { return (Math.round(n * 100) / 100).toString(); }

  /* ---------------- the icons: drawn in a 40 × 40 box. p: m = outcome colour, d = ink, a = accent, w = white, l = light tint ---------------- */
  var ICONS = {
    tag: function (p) {
      return '<g transform="translate(20 20) scale(.86) rotate(-24) translate(-20 -20)"><path d="M11 20C7 13 5 9 5 4" fill="none" stroke="' + p.d + '" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M3.5 20L12.5 10.5H34.5a2 2 0 0 1 2 2V27.5a2 2 0 0 1-2 2H12.5Z" fill="' + p.a + '" stroke="' + p.d + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<circle cx="11.5" cy="20" r="2.2" fill="' + p.w + '" stroke="' + p.d + '" stroke-width="1.1"/>' +
        '<text x="25" y="25.6" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="15" fill="' + p.m + '">$</text>' +
        '<path d="M17.5 13.5h14" stroke="' + p.d + '" stroke-width=".8" stroke-dasharray="1.2 1.2" opacity=".5"/></g>';
    },
    paystub: function (p) {
      var zig = 'M9 4H31V35.5'; for (var k = 0; k < 8; k++) zig += 'l-2.75 ' + (k % 2 ? 1.8 : -1.8);
      return '<path d="' + zig + 'Z" fill="' + p.w + '" stroke="' + p.d + '" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<rect x="12" y="7" width="16" height="4.2" rx="1" fill="' + p.m + '"/>' +
        '<path d="M12 15h9M12 18.5h11M12 22h7.5" stroke="' + p.d + '" stroke-width="1.3" opacity=".5"/>' +
        '<path d="M25 15h3M26 18.5h2M25 22h3" stroke="' + p.d + '" stroke-width="1.3" opacity=".75"/>' +
        '<path d="M9 25.5H31" stroke="' + p.d + '" stroke-width="1" stroke-dasharray="1.5 1.3"/>' +
        '<rect x="18.5" y="27.5" width="10" height="4.6" rx="1" fill="' + p.a + '" stroke="' + p.d + '" stroke-width=".9"/>' +
        '<path d="M12 29.8h4" stroke="' + p.d + '" stroke-width="1.3" opacity=".6"/>';
    },
    wrench: function (p) {
      return '<text x="2.5" y="13.5" font-family="' + COND + '" font-weight="800" font-size="12" fill="' + p.d + '">x=</text>' +
        '<text x="26" y="37" font-family="' + COND + '" font-weight="800" font-size="9" fill="' + p.m + '" opacity=".9">a·b</text>' +
        '<g transform="rotate(45 20 20)"><path d="M17.6 2.42A7 7 0 1 0 22.4 2.42V8H17.6Z M17.6 14.5H22.4V35a2.4 2.4 0 0 1-4.8 0Z" fill="' + p.m + '" stroke="' + p.d + '" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<circle cx="20" cy="32.6" r="1.1" fill="' + p.w + '"/><path d="M20 17.5V28" stroke="' + p.w + '" stroke-width="1" opacity=".55" stroke-linecap="round"/></g>';
    },
    tape: function (p) {
      var t = '';
      for (var k = 0; k <= 13; k++) { var x = 22.2 + k * 1.1; t += 'M' + f2(x) + ' 24.6v' + (k % 5 === 0 ? 3.4 : 1.8); }
      return '<rect x="20" y="24" width="16.5" height="6.4" fill="' + p.a + '" stroke="' + p.d + '" stroke-width=".9"/>' +
        '<path d="' + t + '" stroke="' + p.d + '" stroke-width=".55"/><path d="M36.5 22.6v9.2" stroke="' + p.d + '" stroke-width="1.8" stroke-linecap="round"/>' +
        '<text x="29.5" y="20.5" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="8" fill="' + p.d + '">cm</text>' +
        '<rect x="3" y="10" width="20" height="21" rx="5" fill="' + p.m + '" stroke="' + p.d + '" stroke-width="1.4"/>' +
        '<circle cx="13" cy="20.5" r="5.6" fill="' + p.d + '" opacity=".85"/><circle cx="13" cy="20.5" r="2" fill="' + p.m + '"/>' +
        '<rect x="5.5" y="27.5" width="9" height="1.6" rx=".8" fill="' + p.d + '" opacity=".5"/>';
    },
    rule: function (p) {
      var t = '';
      for (var k = 0; k <= 32; k++) { var L = k % 16 === 0 ? 9 : k % 8 === 0 ? 6.6 : k % 4 === 0 ? 4.8 : k % 2 === 0 ? 3.4 : 2.2; t += 'M' + (4 + k) + ' 8.6v' + L; }
      return '<rect x="2.5" y="8" width="35" height="12" rx="1.3" fill="' + p.a + '" stroke="' + p.d + '" stroke-width="1.2"/>' +
        '<path d="' + t + '" stroke="' + p.d + '" stroke-width=".6"/>' +
        '<text x="12.5" y="29" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="8.5" fill="' + p.m + '">3</text>' +
        '<path d="M9.3 30.6h6.4" stroke="' + p.m + '" stroke-width="1.3" stroke-linecap="round"/>' +
        '<text x="12.5" y="38" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="8.5" fill="' + p.m + '">4</text>' +
        '<text x="27.5" y="34.6" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="11" fill="' + p.d + '">in.</text>';
    },
    level: function (p) {
      var t = ''; for (var k = 0; k <= 16; k++) t += 'M' + (4.5 + k * 1.9) + ' 29.6v' + (k % 4 === 0 ? 3.2 : 1.8);
      return '<rect x="3.5" y="29" width="33" height="6.4" fill="' + p.a + '" stroke="' + p.d + '" stroke-width=".9"/><path d="' + t + '" stroke="' + p.d + '" stroke-width=".6"/>' +
        '<rect x="2" y="13" width="36" height="12" rx="2" fill="' + p.m + '" stroke="' + p.d + '" stroke-width="1.3"/>' +
        '<path d="M2 15a2 2 0 0 1 2-2h2.6v12H4a2 2 0 0 1-2-2ZM38 15a2 2 0 0 0-2-2h-2.6v12H36a2 2 0 0 0 2-2Z" fill="' + p.d + '"/>' +
        '<rect x="13.5" y="15.6" width="13" height="6.8" rx="3.4" fill="#dff3a8" stroke="' + p.d + '" stroke-width="1"/>' +
        '<path d="M17.4 15.8v6.4M22.6 15.8v6.4" stroke="' + p.d + '" stroke-width=".8"/><ellipse cx="20" cy="18.6" rx="2.2" ry="1.6" fill="' + p.w + '"/>' +
        '<path d="M5 7.5h30M5 5.5v4M35 5.5v4" stroke="' + p.d + '" stroke-width="1" stroke-linecap="round"/><path d="M8 7.5l2.2-1.5v3ZM32 7.5l-2.2-1.5v3Z" fill="' + p.d + '"/>';
    },
    tiles: function (p) {
      var t = '';
      for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) t += '<rect x="' + (c * 8) + '" y="' + (r * 8) + '" width="8" height="8" fill="' + ((r + c) % 2 ? p.w : p.m) + '" stroke="' + p.d + '" stroke-width=".7" vector-effect="non-scaling-stroke"/>';
      return '<text x="20" y="10.5" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="10.5" fill="' + p.d + '">m²</text>' +
        '<g transform="translate(20 25.5) scale(1 .56) rotate(45) translate(-12 -12)">' + t + '<rect width="24" height="24" fill="none" stroke="' + p.d + '" stroke-width="1.4" vector-effect="non-scaling-stroke"/></g>' +
        '<path d="M3.2 25.5v4.4L20 39.4l16.8-9.5v-4.4" fill="none" stroke="' + p.d + '" stroke-width=".9" opacity=".45"/>';
    },
    pento: function (p) {
      var cells = [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], s = 9.4, ox = 5.9, oy = 5.9, h = '';
      cells.forEach(function (q) { var x = ox + q[0] * s, y = oy + q[1] * s; h += '<rect x="' + f2(x) + '" y="' + f2(y) + '" width="' + s + '" height="' + s + '" rx="1" fill="' + p.m + '" stroke="' + p.d + '" stroke-width="1.2"/><path d="M' + f2(x + 1.6) + ' ' + f2(y + s - 1.8) + 'V' + f2(y + 1.6) + 'H' + f2(x + s - 1.8) + '" fill="none" stroke="' + p.w + '" stroke-width=".9" opacity=".55"/>'; });
      return h + '<rect x="' + f2(ox + 2 * s + 2.4) + '" y="' + f2(oy + 2 * s + 2.4) + '" width="' + (s - 1) + '" height="' + (s - 1) + '" rx="1" fill="none" stroke="' + p.d + '" stroke-width="1" stroke-dasharray="1.6 1.3"/>';
    },
    square: function (p) {
      var t = ''; for (var k = 0; k < 9; k++) { t += 'M12 ' + (6.5 + k * 2.4) + 'h-' + (k % 2 ? 2 : 3.4); t += 'M' + (14.5 + k * 2.4) + ' 29v' + (k % 2 ? 2 : 3.4); }
      return '<path d="M5 3.5H12V29H37V36H5Z" fill="' + p.a + '" stroke="' + p.d + '" stroke-width="1.3" stroke-linejoin="round"/><path d="' + t + '" stroke="' + p.d + '" stroke-width=".7"/>' +
        '<path d="M14.5 8.5L34 26.5" stroke="' + p.m + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="2.6 2"/><path d="M12 24.6h4.4V29" fill="none" stroke="' + p.m + '" stroke-width="1.3"/>' +
        '<text x="26.5" y="15" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="9" fill="' + p.m + '">c</text>';
    },
    blueprint: function (p) {
      var g = ''; for (var k = 1; k < 8; k++) g += 'M' + (3 + k * 4.25) + ' 5v27'; for (var k2 = 1; k2 < 6; k2++) g += 'M3 ' + (5 + k2 * 4.5) + 'h34';
      return '<rect x="3" y="5" width="34" height="27" rx="1.5" fill="' + p.m + '" stroke="' + p.d + '" stroke-width="1.2"/><path d="' + g + '" stroke="#fff" stroke-width=".4" opacity=".22"/>' +
        '<path d="M9.5 27V17.5l8.5-6.5 8.5 6.5V27ZM15.5 27v-5.5h5V27" fill="none" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M31 11.5V27M29.6 11.5h2.8M29.6 27h2.8" stroke="' + p.a + '" stroke-width="1"/>' +
        '<rect x="4" y="34.6" width="6" height="2.8" fill="' + p.d + '"/><rect x="10" y="34.6" width="6" height="2.8" fill="#fff" stroke="' + p.d + '" stroke-width=".6"/><rect x="16" y="34.6" width="6" height="2.8" fill="' + p.d + '"/>' +
        '<text x="31" y="38" text-anchor="middle" font-family="' + COND + '" font-weight="800" font-size="7" fill="' + p.d + '">1:50</text>';
    },
    clino: function (p) {
      var t = ''; for (var k = 1; k < 18; k++) { var a = k * 10 * Math.PI / 180, r1 = k % 3 === 0 ? 10.4 : 12; t += 'M' + f2(20 - 13.6 * Math.cos(a)) + ' ' + f2(15 + 13.6 * Math.sin(a)) + 'L' + f2(20 - r1 * Math.cos(a)) + ' ' + f2(15 + r1 * Math.sin(a)); }
      return '<path d="M30 5.5L39 1.5" stroke="' + p.d + '" stroke-width=".9" stroke-dasharray="1.5 1.3"/><path d="M37.8 0.4l.6 1.6 1.6.3-1.3 1 .3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1 1.6-.3Z" fill="' + p.m + '"/>' +
        '<g transform="rotate(-24 20 20)"><path d="M5.5 15H34.5A14.5 14.5 0 0 1 5.5 15Z" fill="' + p.a + '" stroke="' + p.d + '" stroke-width="1.2"/><path d="' + t + '" stroke="' + p.d + '" stroke-width=".55"/>' +
        '<rect x="2.5" y="11.4" width="35" height="3.8" rx="1.9" fill="' + p.m + '" stroke="' + p.d + '" stroke-width="1.1"/></g>' +
        '<path d="M17.97 15.43V31" stroke="' + p.d + '" stroke-width=".9"/><path d="M17.97 30.4l2.2 3.2-2.2 3.2-2.2-3.2Z" fill="' + p.m + '" stroke="' + p.d + '" stroke-width=".8"/>' +
        '<circle cx="17.97" cy="15.43" r="1.2" fill="' + p.d + '"/>';
    },
    rails: function (p) {
      var ties = ''; for (var k = 0; k < 8; k++) ties += '<rect x="' + (2.6 + k * 4.7) + '" y="10.4" width="2.3" height="17.2" rx=".4" fill="' + p.a + '" stroke="' + p.d + '" stroke-width=".5"/>';
      var dx = 0.577, dy = -0.817, arc = function (x, y) { return 'M' + f2(x + 4.2) + ' ' + y + 'A4.2 4.2 0 0 0 ' + f2(x + 4.2 * dx) + ' ' + f2(y + 4.2 * dy); };
      return ties + '<path d="M1.5 13H38.5M1.5 25H38.5" stroke="' + p.d + '" stroke-width="2.3" stroke-linecap="round"/>' +
        '<path d="M8 37.5L32 2.5" stroke="' + p.m + '" stroke-width="2.6" stroke-linecap="round"/>' +
        '<path d="' + arc(24.6, 13) + arc(16.37, 25) + '" fill="none" stroke="' + p.m + '" stroke-width="1.5"/>';
    },
    protractor: function (p) {
      var t = ''; for (var k = 1; k < 18; k++) { var a = k * 10 * Math.PI / 180, r1 = k % 3 === 0 ? 12.6 : 14.6; t += 'M' + f2(20 + 17 * Math.cos(a)) + ' ' + f2(32 - 17 * Math.sin(a)) + 'L' + f2(20 + r1 * Math.cos(a)) + ' ' + f2(32 - r1 * Math.sin(a)); }
      var A = 55 * Math.PI / 180;
      return '<path d="M3 32A17 17 0 0 1 37 32Z" fill="' + p.a + '" stroke="' + p.d + '" stroke-width="1.3" stroke-linejoin="round"/><path d="M14 32A6 6 0 0 1 26 32" fill="none" stroke="' + p.d + '" stroke-width=".8"/>' +
        '<path d="' + t + '" stroke="' + p.d + '" stroke-width=".6"/>' +
        '<path d="M20 32L' + f2(20 + 21 * Math.cos(A)) + ' ' + f2(32 - 21 * Math.sin(A)) + 'M20 32H39" stroke="' + p.m + '" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M28.5 32A8.5 8.5 0 0 0 ' + f2(20 + 8.5 * Math.cos(A)) + ' ' + f2(32 - 8.5 * Math.sin(A)) + '" fill="none" stroke="' + p.m + '" stroke-width="1.5"/><circle cx="20" cy="32" r="1.3" fill="' + p.d + '"/>';
    }
  };
  function icon(o, d, ghost) {
    var f = ICONS[d.i]; if (!f) return '';
    var p = ghost ? { m: '#b3a88f', d: '#a69a80', a: '#ece5d4', w: '#f6f2e8', l: '#f1ece0' } : { m: d.c, d: '#2a241b', a: d.a, w: '#ffffff', l: mix(d.c, '#ffffff', 0.86) };
    if (!ghost && d.i === 'wrench') p.a = '#2a241b';
    return f(p);
  }

  /* ---------------- little patterns: a barcode, a QR-like square, the seal ---------------- */
  function barcode(seed, x, y, w, h, col) {
    var r = rng(seed), d = '', cx = x;
    while (cx < x + w - 0.6) { var bw = [0.55, 0.55, 0.9, 1.4][Math.floor(r() * 4)]; if (cx + bw > x + w) break; d += 'M' + f2(cx) + ' ' + y + 'h' + bw + 'v' + h + 'h-' + bw + 'Z'; cx += bw + [0.55, 0.9, 1.3][Math.floor(r() * 3)]; }
    return '<path d="' + d + '" fill="' + col + '"/>';
  }
  function qrlike(seed, x, y, s, col, bg) {
    var N = 13, m = s / N, r = rng(seed), d = '';
    function finder(i, j) { d += 'M' + f2(x + i * m) + ' ' + f2(y + j * m) + 'h' + f2(4 * m) + 'v' + f2(4 * m) + 'h-' + f2(4 * m) + 'Z'; }
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var inF = (i < 5 && j < 5) || (i > 7 && j < 5) || (i < 5 && j > 7); if (inF) continue;
      if (r() < 0.48) d += 'M' + f2(x + i * m) + ' ' + f2(y + j * m) + 'h' + f2(m) + 'v' + f2(m) + 'h-' + f2(m) + 'Z';
    }
    var h = '<rect x="' + f2(x - m) + '" y="' + f2(y - m) + '" width="' + f2(s + 2 * m) + '" height="' + f2(s + 2 * m) + '" fill="' + bg + '"/>';
    [[0, 0], [9, 0], [0, 9]].forEach(function (q) { h += '<rect x="' + f2(x + q[0] * m + m * .5) + '" y="' + f2(y + q[1] * m + m * .5) + '" width="' + f2(3 * m) + '" height="' + f2(3 * m) + '" fill="none" stroke="' + col + '" stroke-width="' + f2(m) + '"/><rect x="' + f2(x + q[0] * m + m * 1.5) + '" y="' + f2(y + q[1] * m + m * 1.5) + '" width="' + f2(m) + '" height="' + f2(m) + '" fill="' + col + '"/>'; });
    return h + '<path d="' + d + '" fill="' + col + '"/>';
  }
  function rosette(cx, cy, R, r, n) { var p = ''; for (var k = 0; k < 2 * n; k++) { var a = (k * 180 / n - 90) * Math.PI / 180, rr = k % 2 ? r : R; p += (k ? 'L' : 'M') + f2(cx + rr * Math.cos(a)) + ' ' + f2(cy + rr * Math.sin(a)); } return p + 'Z'; }
  function diamond(cx, cy, r) { return 'M' + f2(cx) + ' ' + f2(cy - r) + 'L' + f2(cx + r) + ' ' + f2(cy) + 'L' + f2(cx) + ' ' + f2(cy + r) + 'L' + f2(cx - r) + ' ' + f2(cy) + 'Z'; }
  // a font size that keeps a text inside a width (an estimate: a little narrow fonts' average glyph width)
  function fit(text, size, avail, k) { var est = String(text).length * size * (k || 0.56); return est > avail ? Math.max(size * 0.55, size * avail / est) : size; }

  /* ---------------- one card as SVG (172 × 108: credit-card proportions) ---------------- */
  var W = 172, H = 108, R = 7, uid = 0;
  function svg(o, tier, size, holder) {
    var d = design(o), T = TIERS[tier] || TIERS[0], id = 'crt' + (++uid), nm = tier === 0, mini = (size || 62) < 120;
    var w = size || 62, hh = Math.round(w * H / W * 10) / 10;
    holder = holderName(holder);
    var h = '<svg class="cert-svg' + (mini ? ' is-mini' : '') + '" viewBox="0 0 ' + W + ' ' + H + '" width="' + w + '" height="' + hh + '" aria-hidden="true" focusable="false">';
    // ---- defs: the stock's gradients and textures
    h += '<defs><clipPath id="' + id + 'cl"><rect width="' + W + '" height="' + H + '" rx="' + R + '"/></clipPath>';
    h += '<linearGradient id="' + id + 'si" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6f8fa"/><stop offset=".3" stop-color="#cfd6dd"/><stop offset=".55" stop-color="#f2f4f7"/><stop offset=".8" stop-color="#b9c2cc"/><stop offset="1" stop-color="#e4e8ec"/></linearGradient>';
    h += '<linearGradient id="' + id + 'go" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c2"/><stop offset=".3" stop-color="#e8c25e"/><stop offset=".55" stop-color="#fbe7a2"/><stop offset=".8" stop-color="#c99a30"/><stop offset="1" stop-color="#efd27e"/></linearGradient>';
    h += '<linearGradient id="' + id + 'gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".35" stop-color="#e2ac2a"/><stop offset=".6" stop-color="#fff0a0"/><stop offset="1" stop-color="#b07c10"/></linearGradient>';
    h += '<linearGradient id="' + id + 'br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0a46e"/><stop offset=".4" stop-color="#8f5428"/><stop offset=".7" stop-color="#d39a62"/><stop offset="1" stop-color="#7a4520"/></linearGradient>';
    h += '<linearGradient id="' + id + 'gl" x1="0" y1="0" x2="1" y2="1"><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity="' + (T.lv === 'BEG' || T.lv === 'EMG' ? 0.6 : 0.4) + '"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>';
    if (T.foil || T.seal) {
      h += '<linearGradient id="' + id + 'ho" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="26" y2="26" spreadMethod="reflect"><stop offset="0" stop-color="#ff9ad5"/><stop offset=".2" stop-color="#ffe48a"/><stop offset=".4" stop-color="#9effc8"/><stop offset=".6" stop-color="#8fd8ff"/><stop offset=".8" stop-color="#c9a2ff"/><stop offset="1" stop-color="#ffb3e1"/>' +
        '<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="52 52" dur="5s" repeatCount="indefinite"/></linearGradient>';
      h += '<pattern id="' + id + 'df" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="2.4" height=".7" fill="#fff" opacity=".35"/></pattern>';
    }
    if (T.brush) h += '<pattern id="' + id + 'bh" width="6" height="1.3" patternUnits="userSpaceOnUse"><rect width="6" height=".45" fill="#fff" opacity=".22"/><rect y=".8" width="4" height=".3" fill="#000" opacity=".05"/></pattern>';
    if (tier === 1) h += '<filter id="' + id + 'pp" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .34  0 0 0 0 .2  0 0 0 .32 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>';
    h += '</defs>';
    function paint(k) { return k === 'silver' ? 'url(#' + id + 'si)' : k === 'gold' ? 'url(#' + id + 'go)' : k === 'goldg' ? 'url(#' + id + 'gg)' : k === 'bronze' ? 'url(#' + id + 'br)' : k; }
    var ink = nm ? '#a69a80' : paint(T.ink), mu = nm ? '#b8ad95' : T.mu, codeCol = nm ? '#a69a80' : T.dark ? paint('goldg') : mix(d.c, '#000000', d.t === '#fff' ? 0.12 : 0.45);
    var seed = hash(holder.toLowerCase() + '|' + o), no = nm ? o + '-····' : cardNo(o, holder);

    // ---- the card body
    if (nm) h += '<rect x=".8" y=".8" width="' + (W - 1.6) + '" height="' + (H - 1.6) + '" rx="' + (R - .5) + '" fill="rgba(255,255,255,.45)" stroke="#a89c83" stroke-width="' + (mini ? 2.6 : 1.4) + '" stroke-dasharray="' + (mini ? '8 5' : '5 3.4') + '"/>';
    else h += '<rect width="' + W + '" height="' + H + '" rx="' + R + '" fill="' + paint(T.body) + '"/>';
    h += '<g clip-path="url(#' + id + 'cl)">';
    if (tier === 1) h += '<rect width="' + W + '" height="' + H + '" fill="#fff" filter="url(#' + id + 'pp)"/>';
    if (T.brush) h += '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'bh)"/>';
    if (T.dark) { // a fine guilloche in gold, like the background of a certificate
      var gq = ''; for (var k = 0; k < 9; k++) { gq += 'M-4 ' + f2(14 + k * 11); for (var x = 0; x <= W + 8; x += 4) gq += 'L' + x + ' ' + f2(14 + k * 11 + 4.5 * Math.sin(x / 10 + k * 0.8)); }
      h += '<path d="' + gq + '" fill="none" stroke="#d9a93a" stroke-width=".35" opacity=".28"/>';
    }
    // header band
    var HB = mini ? 30 : 21;
    if (nm) h += '<path d="M8 ' + HB + 'H' + (W - 8) + '" stroke="#b8ad95" stroke-width="' + (mini ? 2 : 1) + '" stroke-dasharray="3 2.4"/>';
    else {
      h += '<rect width="' + W + '" height="' + HB + '" fill="' + d.c + '"/>';
      h += '<rect width="' + W + '" height="' + HB + '" fill="url(#' + id + 'gl)" opacity=".35"/>';
      h += '<path d="M0 ' + HB + 'H' + W + '" stroke="' + T.rule + '" stroke-width="' + (T.foil ? 1.4 : 0.9) + '"/>';
    }
    var ht = nm ? '#a69a80' : d.t;
    // the holographic foil stripe (Journeyperson and up)
    var SX = mini ? 147 : 149;
    if (T.foil) {
      h += '<rect x="' + SX + '" y="' + HB + '" width="13" height="' + (H - HB) + '" fill="url(#' + id + 'ho)"/><rect x="' + SX + '" y="' + HB + '" width="13" height="' + (H - HB) + '" fill="url(#' + id + 'df)"/>';
      h += '<path d="M' + SX + ' ' + HB + 'V' + H + 'M' + (SX + 13) + ' ' + HB + 'V' + H + '" stroke="rgba(255,255,255,.7)" stroke-width=".6"/>';
      if (!mini) h += '<text transform="translate(' + (SX + 8.8) + ' ' + (HB + 4) + ') rotate(90)" font-family="' + COND + '" font-weight="800" font-size="5.6" letter-spacing="1.6" fill="#fff" opacity=".7">MATH 10-3 ✦ CERTIFIED ✦ MATH 10-3</text>';
    }

    if (mini) {
      // ---- the small card: the code in the header, a big icon, and the level as pips
      h += '<text x="10" y="24.5" font-family="' + COND + '" font-weight="800" font-size="25" letter-spacing=".5" fill="' + ht + '">' + esc(o) + '</text>';
      h += '<rect x="9" y="37" width="63" height="63" rx="7" fill="' + (nm ? 'none' : T.dark ? '#f4ecd6' : mix(d.c, '#ffffff', 0.86)) + '"' + (nm ? ' stroke="#c4b99f" stroke-width="1.6" stroke-dasharray="4 3"' : ' stroke="' + (T.dark ? '#d4a73a' : 'rgba(0,0,0,.12)') + '" stroke-width="1.4"') + '/>';
      h += '<g transform="translate(10.5 38.5) scale(1.5)"' + (nm ? ' opacity=".8"' : '') + '>' + icon(o, d, nm) + '</g>';
      if (!nm) for (var j = 0; j < 6; j++) {
        var px = 93 + (j % 3) * 19, py = 55 + Math.floor(j / 3) * 25, on = j < tier;
        h += '<circle cx="' + px + '" cy="' + py + '" r="7" fill="' + (on ? (T.dark ? paint('goldg') : d.c) : 'none') + '" stroke="' + (on ? (T.dark ? '#7a5508' : 'rgba(0,0,0,.35)') : (T.dark ? '#7d6a3e' : 'rgba(0,0,0,.2)')) + '" stroke-width="1.6"' + (on ? '' : ' stroke-dasharray="2.4 2"') + '/>';
      }
    } else {
      // ---- the full card
      h += '<text x="10" y="14.3" data-fit="104" font-family="' + COND + '" font-weight="800" font-size="8.8" letter-spacing="1.1" fill="' + ht + '">MATH 10-3 · CERTIFIED</text>';
      for (var j2 = 0; j2 < 6; j2++) { var on2 = !nm && j2 < tier; h += '<path d="' + diamond(W - 12 - (5 - j2) * 7.4, 10.5, 2.8) + '" fill="' + (on2 ? ht : 'none') + '" stroke="' + ht + '" stroke-width=".8" opacity="' + (on2 ? 0.95 : 0.45) + '"/>'; }
      // icon tile
      h += '<rect x="10" y="28" width="42" height="42" rx="5" fill="' + (nm ? 'none' : T.dark ? '#f4ecd6' : mix(d.c, '#ffffff', 0.86)) + '"' + (nm ? ' stroke="#c4b99f" stroke-width="1" stroke-dasharray="3 2.4"' : ' stroke="' + (T.dark ? '#d4a73a' : 'rgba(0,0,0,.12)') + '" stroke-width="' + (T.dark ? 1.2 : 0.8) + '"') + '/>';
      h += '<g transform="translate(11 29) scale(1)"' + (nm ? ' opacity=".8"' : '') + '>' + icon(o, d, nm) + '</g>';
      // strand, code and label
      var X = 60, avail = (T.seal ? SX - 11 : T.foil ? SX - 4 : W - 10) - X;
      h += '<text x="' + X + '" y="33.5" data-fit="' + avail + '" font-family="' + SANS + '" font-weight="700" font-size="4.6" letter-spacing=".9" fill="' + mu + '">' + (STRAND[o.charAt(0)] || 'OUTCOME') + ' · OUTCOME</text>';
      h += '<text x="' + X + '" y="51" data-fit="22" font-family="' + COND + '" font-weight="800" font-size="20" fill="' + codeCol + '">' + esc(o) + '</text>';
      var lines = d.l || [], lsz = Math.min.apply(null, lines.map(function (ln) { return fit(ln, 7, avail - 24, 0.47); }).concat([7]));
      lines.forEach(function (ln, k3) { h += '<text x="' + (X + 24) + '" y="' + f2((lines.length > 1 ? 42.6 : 46.5) + k3 * (lsz + 1.3)) + '" data-fit="' + (avail - 24) + '" font-family="' + COND + '" font-weight="700" font-size="' + f2(lsz) + '" letter-spacing=".3" fill="' + ink + '">' + esc(ln) + '</text>'; });
      // holder
      h += '<text x="' + X + '" y="61.5" font-family="' + SANS + '" font-weight="700" font-size="4.4" letter-spacing=".9" fill="' + mu + '">HOLDER</text>';
      var hn = nm ? '' : (holder || '—'), hsz = fit(hn, 9, avail, 0.6);
      if (hn) h += '<text x="' + X + '" y="70" data-fit="' + avail + '" font-family="' + SANS + '" font-weight="700" font-size="' + f2(hsz) + '" fill="' + ink + '">' + esc(hn) + '</text>';
      else h += '<path d="M' + X + ' 70H' + (X + Math.min(avail, 70)) + '" stroke="#c4b99f" stroke-width=".8" stroke-dasharray="2 1.6"/>';
      // the bottom row: level, card number, barcode; issued by
      var BX = T.foil ? SX - 5 : W - 10;
      h += '<path d="M10 77.5H' + BX + '" stroke="' + (nm ? '#cfc5ad' : T.dark ? '#5d4a22' : 'rgba(0,0,0,.14)') + '" stroke-width=".7"/>';
      h += '<text x="10" y="84.5" font-family="' + SANS + '" font-weight="700" font-size="4.4" letter-spacing=".9" fill="' + mu + '">LEVEL</text>';
      var lname = T.name.toUpperCase();
      h += '<text x="10" y="94" data-fit="70" font-family="' + COND + '" font-weight="800" font-size="' + f2(fit(lname, 10.5, 70, 0.5)) + '" letter-spacing=".5" fill="' + (nm ? '#a69a80' : paint(T.lc)) + '">' + esc(lname) + '</text>';
      h += '<text x="10" y="102.2" data-fit="100" font-family="' + SANS + '" font-style="italic" font-size="4.6" fill="' + mu + '">' + (nm ? 'Practise ' + esc(o) + ' to be issued this card' : 'Issued by ' + ISSUER) + '</text>';
      h += '<text x="84" y="84.5" font-family="' + SANS + '" font-weight="700" font-size="4.4" letter-spacing=".9" fill="' + mu + '">CARD NO.</text>';
      h += '<text x="84" y="93.2" data-fit="27" font-family="' + MONO + '" font-weight="700" font-size="7" fill="' + ink + '">' + esc(no) + '</text>';
      var bx0 = 113, bw0 = BX - bx0 - (T.seal ? 0 : 0);
      if (!nm) h += barcode(seed, bx0, 82, bw0, 13, T.dark ? '#d9b65a' : '#1d1b18');
      else h += '<rect x="' + bx0 + '" y="82" width="' + bw0 + '" height="13" fill="none" stroke="#cfc5ad" stroke-width=".7" stroke-dasharray="2 1.6"/>';
      if (!nm) h += '<text x="' + f2(bx0 + bw0 / 2) + '" y="100.6" text-anchor="middle" font-family="' + MONO + '" font-size="3.6" letter-spacing=".6" fill="' + mu + '">' + (seed % 1000000000 + 1000000000).toString().slice(1) + '</text>';
      if (T.lv === 'BEG' || T.lv === 'EMG' || T.lv === 'LIM') { // a hole punched for a lanyard clip on the cheaper stock
        h += '<rect x="' + (W - 19) + '" y="' + 28 + '" width="10" height="3.2" rx="1.6" fill="' + (tier === 1 ? '#d9cdb0' : '#e7ebef') + '" stroke="rgba(0,0,0,.18)" stroke-width=".5"/>';
      }
    }
    // the holographic seal (Master Certified)
    if (T.seal) {
      var cx = SX + 6.5, cy = mini ? 48 : 58, Rr = mini ? 11 : 12.5;
      h += '<path d="' + rosette(cx, cy, Rr, Rr * 0.84, 18) + '" fill="url(#' + id + 'ho)" stroke="#8a6410" stroke-width=".6"/>';
      h += '<path d="' + rosette(cx, cy, Rr, Rr * 0.84, 18) + '" fill="url(#' + id + 'df)"/>';
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + f2(Rr * 0.6) + '" fill="url(#' + id + 'gg)" stroke="#7a5508" stroke-width=".5"/>';
      h += '<path d="M' + f2(cx - Rr * .27) + ' ' + f2(cy) + 'l' + f2(Rr * .2) + ' ' + f2(Rr * .2) + 'l' + f2(Rr * .36) + ' -' + f2(Rr * .4) + '" fill="none" stroke="#5a3d00" stroke-width="' + (mini ? 1.6 : 1.3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
      h += '<g><animateTransform attributeName="transform" type="rotate" from="0 ' + cx + ' ' + cy + '" to="360 ' + cx + ' ' + cy + '" dur="14s" repeatCount="indefinite"/><path d="' + rosette(cx, cy, Rr * 1.01, Rr * 0.84, 18) + '" fill="none" stroke="#fff" stroke-width=".5" opacity=".55" stroke-dasharray="1 3"/></g>';
    }
    // laminate gloss over everything, and the edge
    if (T.gloss) h += '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'gl)" opacity="' + (T.lv === 'BEG' ? 0.6 : 0.4) + '"/>';
    h += '</g>';
    if (!nm) {
      var ew = T.ew * (mini ? 1.7 : 1);
      h += '<rect x="' + f2(ew / 2) + '" y="' + f2(ew / 2) + '" width="' + f2(W - ew) + '" height="' + f2(H - ew) + '" rx="' + f2(R - ew / 2) + '" fill="none" stroke="' + paint(T.edge) + '" stroke-width="' + f2(ew) + '"/>';
      if (T.lv === 'BEG') h += '<rect x="2.4" y="2.4" width="' + (W - 4.8) + '" height="' + (H - 4.8) + '" rx="' + (R - 2) + '" fill="none" stroke="#fff" stroke-width=".7" opacity=".9"/>';
    }
    return h + '</svg>';
  }

  /* the text that has to fit (data-fit = the width it may take, in card units): measured once the card is in the page, and
     made smaller if the font is wider than planned (e.g. before Barlow Condensed has loaded, or without it) */
  function fitIn(el) {
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('text[data-fit]').forEach(function (t) {
      var fs0 = Number(t.getAttribute('data-fs') || t.getAttribute('font-size')), m = Number(t.getAttribute('data-fit')), w = 0;
      t.setAttribute('data-fs', fs0); t.setAttribute('font-size', fs0);
      try { w = t.getComputedTextLength(); } catch (e) { w = 0; }
      if (w > m) t.setAttribute('font-size', f2(fs0 * m / w * 0.985));
    });
  }
  function fitLater(el) {
    var n = 0;
    (function go() {
      if (el.isConnected) { fitIn(el); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitIn(el); }); }
      else if (n++ < 120) (root.requestAnimationFrame || setTimeout)(go, 16);
    })();
  }

  /* ---------------- the back of the card (HTML, in the viewer) ---------------- */
  function backHTML(o, tier, holder) {
    var d = design(o), ot = HW.OUTCOME_TEXT && HW.OUTCOME_TEXT[o], seed = hash(String(holder || '').toLowerCase() + '|' + o);
    var text = ot ? esc(ot.text) + (ot.list ? ' ' + ot.list.map(esc).join('; ') + (ot.after ? ' ' + esc(ot.after) : '') : '') : esc((HW.OUTCOMES && HW.OUTCOMES[o]) || '');
    var lv = TIERS.map(function (t, k) {
      var cls = k === tier ? ' here' : k < tier ? ' got' : '';
      return '<li class="cb-lv' + cls + '"><i class="cb-chip cb-chip' + k + '" aria-hidden="true"></i><b>' + esc(t.name) + '</b><span><em>' + esc(t.level) + '</em> · ' + esc(t.mean) + '</span></li>';
    }).join('');
    return '<div class="cb-stripe"></div>' +
      '<div class="cb-body">' +
      '<div class="cb-h"><b style="color:' + mix(d.c, '#000000', d.t === '#fff' ? 0.05 : 0.45) + '">' + esc(o) + '</b> · ' + esc(ot ? ot.strand : '') + ' · Specific outcome ' + esc(o.replace(/\D/g, '')) + '</div>' +
      '<div class="cb-text">' + text + '</div>' +
      '<ol class="cb-levels">' + lv + '</ol>' +
      '<div class="cb-foot"><div class="cb-sig"><span>' + esc(ISSUER) + '</span><small>Issued by · Math 10-3</small></div>' +
      '<div class="cb-no">' + (tier ? esc(cardNo(o, holder)) : esc(o) + '-····') + '</div>' +
      '<svg class="cb-qr" viewBox="-1.5 -1.5 33 33" aria-hidden="true">' + qrlike(seed, 0, 0, 30, '#1d1b18', '#fff') + '</svg></div>' +
      '</div>';
  }

  /* ---------------- the row beside "Hi, …" ---------------- */
  function label(it) { var t = TIERS[it.tier] || TIERS[0]; return it.o + ' · ' + t.name + ' · ' + t.level; }
  function row(list) {
    css();
    var box = document.createElement('div'); box.className = 'badge-row cert-row';
    list.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'badge-btn cert-btn' + (it.tier === 0 ? ' is-blank' : ''); b.title = label(it); b.setAttribute('aria-label', label(it) + ' card');
      b.innerHTML = svg(it.o, it.tier, 62); if (it.fresh) b.classList.add('is-new');
      b.addEventListener('click', function () { open(list, i); });
      box.appendChild(b);
    });
    fitLater(box);
    return box;
  }

  /* ---------------- the viewer: the card on a workshop pegboard ---------------- */
  var reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function open(list, i, opt) {
    opt = opt || {}; close(); css();
    var holder = holderName(opt.holder);
    var ov = document.createElement('div'); ov.className = 'badge-pop cert-pop'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Outcome certification card');
    var box = document.createElement('div'); box.className = 'cert-box'; ov.appendChild(box);
    var x = document.createElement('button'); x.type = 'button'; x.className = 'cert-x'; x.setAttribute('aria-label', 'Close'); x.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'; x.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var flip = null;
    function show(k) {
      i = (k + list.length) % list.length; var it = list[i];
      box.innerHTML = ''; box.appendChild(x);
      if (opt.title) box.appendChild(h('div', 'cert-new', esc(String(opt.title).replace(/medal|badge/gi, 'card'))));
      var heroWrap = h('div', 'cert-stage', ''), name = h('div', 'cert-name', ''), level = h('div', 'cert-level', '');
      box.appendChild(heroWrap);
      var fb = h('button', 'btn btn-ghost cert-flipbtn', ''); fb.type = 'button'; box.appendChild(fb);
      box.appendChild(name); box.appendChild(level);
      if (HW.OUTCOMES && HW.OUTCOMES[it.o]) box.appendChild(h('div', 'cert-out', esc(it.o) + ' · ' + esc(HW.OUTCOMES[it.o])));
      // the seven levels, in a tray: every one reached can be tapped to see it big
      var lad = h('div', 'cert-ladder', ''), rungs = [];
      TIERS.forEach(function (tt, k2) {
        var got = k2 <= it.tier, cell = h(got ? 'button' : 'div', 'cert-rung' + (got ? ' got' : ''), svg(it.o, k2, 64, holder) + '<div class="cert-rung-m">' + esc(tt.name) + '</div><div class="cert-rung-s">' + esc(tt.short) + '</div><div class="cert-rung-l">' + esc(tt.level) + '</div>');
        cell.title = tt.name + ' · ' + tt.level + (got ? (k2 < it.tier ? ' (tap to see it)' : '') : ' (not yet)');
        if (got) { cell.type = 'button'; cell.addEventListener('click', function () { pick(k2); }); }
        lad.appendChild(cell); rungs.push(cell);
      });
      box.appendChild(lad);
      var flipped = false;
      flip = function () { flipped = !flipped; var f = heroWrap.querySelector('.cert-flip'); if (f) f.classList.toggle('is-flipped', flipped); fb.innerHTML = flipLabel(flipped); fb.setAttribute('aria-pressed', String(flipped)); };
      fb.addEventListener('click', flip);
      function pick(tk) {
        var tt = TIERS[tk];
        heroWrap.innerHTML = '<div class="cert-tilt" role="img" aria-label="' + esc(label({ o: it.o, tier: tk })) + ' card"><div class="cert-flip' + (flipped ? ' is-flipped' : '') + '">' +
          '<div class="cert-face cert-front t' + tk + '">' + svg(it.o, tk, 520, holder) + '<i class="cert-glare"></i>' + (TIERS[tk].foil ? '<i class="cert-holo' + (TIERS[tk].seal ? ' is-mas' : '') + '"></i>' : '') + '</div>' +
          '<div class="cert-face cert-back t' + tk + '">' + backHTML(it.o, tk, holder) + '</div></div></div>';
        fitLater(heroWrap); tilt(heroWrap.firstChild, function () { flip(); });
        name.textContent = tt.name;
        level.innerHTML = '<b>' + esc(tt.level) + '</b> on ' + esc(it.o) + (tk === it.tier ? (it.src ? ' <span class="cert-src">· ' + esc(it.src) + '</span>' : '') : ' <span class="cert-src">· a level you’ve passed</span>');
        rungs.forEach(function (c, k2) { c.classList.toggle('here', k2 === tk); if (c.tagName === 'BUTTON') c.setAttribute('aria-pressed', String(k2 === tk)); });
      }
      fb.innerHTML = flipLabel(false); fb.setAttribute('aria-pressed', 'false');
      pick(it.tier);
      box.appendChild(h('div', 'cert-hint', (reduced ? 'Tap the card to flip it over. ' : 'Tilt the card with your finger or mouse; tap it to flip it over. ') + 'Each level is a new card: Trainee, Apprentice I and II, Journeyperson, Master, then Master Certified.' + (list.length > 1 ? ' ' + (i + 1) + ' of ' + list.length + '.' : '')));
      if (list.length > 1) {
        var nav = h('div', 'cert-nav', '');
        var pv = h('button', 'btn btn-ghost cert-prev', '‹ Previous'), nx = h('button', 'btn btn-ghost cert-next', 'Next ›'); pv.type = nx.type = 'button';
        pv.addEventListener('click', function () { show(i - 1); }); nx.addEventListener('click', function () { show(i + 1); });
        nav.appendChild(pv); nav.appendChild(nx); box.appendChild(nav);
      }
    }
    function flipLabel(f) { return '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' + (f ? 'See the front' : 'Flip it over'); }
    function h(tag, cls, html) { var e = document.createElement(tag); e.className = cls; e.innerHTML = html; return e; }
    document.body.appendChild(ov); document.body.classList.add('badge-on', 'cert-on');
    show(i || 0);
    setTimeout(function () { try { x.focus(); } catch (e) {} }, 30);
    ov._key = function (e) { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' && list.length > 1) show(i + 1); else if (e.key === 'ArrowLeft' && list.length > 1) show(i - 1); else if ((e.key === 'f' || e.key === 'F') && flip) flip(); };
    document.addEventListener('keydown', ov._key);
    if (opt.onclose) ov._onclose = opt.onclose;
  }
  /* the big card leans toward the pointer and the light slides over it; a tap (not a drag) flips it.
     Reduced motion: no tilt, the card still flips. */
  function tilt(el, onTap) {
    if (!el) return;
    var down = null;
    el.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; if (!reduced) move(e); });
    el.addEventListener('click', function (e) { if (down && Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 10) { down = null; return; } down = null; if (onTap) onTap(); });
    if (reduced) return;
    el.classList.add('is-in');
    var move = function (e) {
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', (-py * 16).toFixed(1) + 'deg'); el.style.setProperty('--ry', (px * 22).toFixed(1) + 'deg');
      el.style.setProperty('--sx', (50 + px * 80).toFixed(0) + '%'); el.style.setProperty('--sy', (50 + py * 80).toFixed(0) + '%'); el.style.setProperty('--hp', (50 + px * 60 + py * 30).toFixed(0) + '%');
    };
    var leave = function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--sx', '30%'); el.style.setProperty('--sy', '20%'); el.style.setProperty('--hp', '50%'); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); el.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') leave(); });
    el.style.touchAction = 'none';
  }
  function close() {
    var ov = document.querySelector('.cert-pop'); if (!ov) return;
    document.removeEventListener('keydown', ov._key); ov.remove(); document.body.classList.remove('badge-on', 'cert-on');
    if (ov._onclose) ov._onclose();
  }
  /* the stylesheet (assets/certs.css), added once if the page doesn't link it */
  var BASE = (document.currentScript && document.currentScript.src) || '';
  function css() {
    if (!BASE || document.querySelector('link[href*="certs.css"]')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL('../assets/certs.css', BASE).href; document.head.appendChild(l);
  }

  HW.Certs = { TIERS: TIERS, DESIGNS: DESIGNS, tierOf: function (lv) { return TIER_OF[lv] == null ? -1 : TIER_OF[lv]; }, row: row, open: open, close: close, svg: svg, _icons: ICONS, _cardNo: cardNo, _back: backHTML, fit: fitIn };
  HW.Medals = HW.Badges = HW.Certs;
})(window);
