/* Unit 1 project: Pop-Up Shop (Unit Pricing and Currency Exchange, N1).
 * Students open their own pop-up shop: pick products, find the best supplier deals (unit price), set prices (markup),
 * make price tags with GST, run a Black Friday sale, take an order from the US and buy from a US supplier (exchange
 * rates), then make a flyer and hand it in. Every answer is checked against the student's own choices.
 * Worked examples use a different shop: Maple Leaf Treats. Engine: js/projects.js. Each checkpoint also has
 * solve(c), which fills in right answers (used by tests/projects_test.js and the Playwright run). */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, money = PJ.money, r2 = PJ.r2, esc = PJ.esc, pct = PJ.pct;
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }

  /* ================= the shops ================= */
  function pk(id, label, n, price, note) { return { id: id, label: label, n: n, price: price, note: note || '' }; }
  var SHOPS = {
    snack: { name: 'Snack stand', icon: '🍿', blurb: 'Snacks and drinks for hungry students', markup: [40, 120], names: ['The Snack Shack', 'Crunch Time', 'Recess Eats'],
      products: [
        { id: 'granola', name: 'Granola bars', icon: '🌾', packs: [pk('a', 'Box of 12', 12, 7.80, 'Best before: 6 months'), pk('b', 'Case of 48', 48, 26.88, 'Best before: 6 months'), pk('c', 'Club pack of 120', 120, 62.40, 'Takes a whole shelf')] },
        { id: 'water', name: 'Bottled water', icon: '💧', packs: [pk('a', '24-pack', 24, 7.99, 'Easy to carry'), pk('b', 'Stack of 120', 120, 36.00, 'Needs a cart to move it')] },
        { id: 'chips', name: 'Chips (snack bags)', icon: '🥔', packs: [pk('a', 'Box of 24', 24, 16.80, 'Best before: 3 months'), pk('b', 'Box of 64', 64, 41.99, 'Bags crush easily')] },
        { id: 'fruit', name: 'Fruit snacks', icon: '🍓', packs: [pk('a', 'Box of 40', 40, 11.60, 'Best before: 1 year'), pk('b', 'Case of 120', 120, 31.80, 'Best before: 1 year')] },
        { id: 'juice', name: 'Juice boxes', icon: '🧃', packs: [pk('a', '8-pack', 8, 3.99, 'On sale this week'), pk('b', 'Case of 40', 40, 20.40, 'Keep cool')] },
        { id: 'choco', name: 'Chocolate bars', icon: '🍫', packs: [pk('a', 'Box of 24', 24, 22.80, 'Melts in a hot car'), pk('b', 'Box of 48', 48, 43.99, 'Melts in a hot car')] },
        { id: 'popcorn', name: 'Popcorn bags', icon: '🍿', packs: [pk('a', 'Box of 30', 30, 13.50, 'Light but bulky'), pk('b', 'Box of 90', 90, 37.99, 'Very bulky')] },
        { id: 'cookie', name: 'Cookies (wrapped)', icon: '🍪', packs: [pk('a', 'Tray of 36', 36, 16.92, 'Fresh for 3 weeks'), pk('b', 'Case of 144', 144, 61.92, 'Fresh for 3 weeks')] }
      ] },
    phone: { name: 'Phone accessories', icon: '📱', blurb: 'Cables, cases and chargers', markup: [50, 150], names: ['Charged Up', 'Case Closed', 'Plug & Play'],
      products: [
        { id: 'cable', name: 'Charging cables', icon: '🔌', packs: [pk('a', 'Pack of 5', 5, 24.95, 'Top brand'), pk('b', 'Pack of 20', 20, 83.80, 'Top brand'), pk('c', 'Pack of 50', 50, 187.50, 'No-name brand')] },
        { id: 'case', name: 'Phone cases', icon: '📱', packs: [pk('a', 'Pack of 10', 10, 61.90, 'Fits 6 phone models'), pk('b', 'Pack of 25', 25, 136.49, 'Fits only 3 phone models')] },
        { id: 'screen', name: 'Screen protectors', icon: '🛡️', packs: [pk('a', 'Pack of 10', 10, 21.50, 'Glass'), pk('b', 'Pack of 50', 50, 82.99, 'Plastic film')] },
        { id: 'buds', name: 'Earbuds', icon: '🎧', packs: [pk('a', 'Pack of 4', 4, 51.96, 'Store brand'), pk('b', 'Pack of 12', 12, 159.48, 'Top brand')] },
        { id: 'grip', name: 'Phone grips', icon: '🔘', packs: [pk('a', 'Pack of 12', 12, 26.40, 'Plain colours'), pk('b', 'Pack of 36', 36, 70.20, 'Plain colours')] },
        { id: 'charger', name: 'Wall chargers', icon: '⚡', packs: [pk('a', 'Pack of 6', 6, 44.70, 'Fast charging'), pk('b', 'Pack of 24', 24, 154.80, 'Fast charging')] },
        { id: 'mount', name: 'Car phone mounts', icon: '🚗', packs: [pk('a', 'Pack of 5', 5, 37.45, 'Clips to the vent'), pk('b', 'Pack of 15', 15, 98.85, 'Clips to the vent')] },
        { id: 'battery', name: 'Power banks', icon: '🔋', packs: [pk('a', 'Pack of 3', 3, 62.97, 'Small boxes'), pk('b', 'Pack of 10', 10, 179.90, 'Takes a lot of storage')] }
      ] },
    hockey: { name: 'Hockey gear', icon: '🏒', blurb: 'Everything for the rink', markup: [30, 100], names: ['Top Shelf Gear', 'Five Hole Supply', 'Blue Line Shop'],
      products: [
        { id: 'tape', name: 'Hockey tape', icon: '🏒', packs: [pk('a', 'Pack of 6', 6, 17.94, 'Black and white'), pk('b', 'Pack of 30', 30, 76.50, 'Black and white'), pk('c', 'Box of 100', 100, 229.00, 'Only white')] },
        { id: 'puck', name: 'Pucks', icon: '⚫', packs: [pk('a', 'Bucket of 10', 10, 16.50, 'Official size'), pk('b', 'Case of 50', 50, 67.50, 'Official size')] },
        { id: 'mouth', name: 'Mouthguards', icon: '😁', packs: [pk('a', 'Pack of 6', 6, 32.94, 'Youth and adult'), pk('b', 'Pack of 24', 24, 107.76, 'Adult size only')] },
        { id: 'laces', name: 'Skate laces', icon: '👟', packs: [pk('a', '10 pairs', 10, 41.90, 'Waxed'), pk('b', '40 pairs', 40, 131.99, 'Waxed')] },
        { id: 'socks', name: 'Hockey socks', icon: '🧦', packs: [pk('a', '6 pairs', 6, 56.94, 'Oilers colours'), pk('b', '24 pairs', 24, 231.36, 'Only 2 sizes')] },
        { id: 'bottle', name: 'Water bottles', icon: '🥤', packs: [pk('a', 'Pack of 6', 6, 25.14, 'Squeeze top'), pk('b', 'Pack of 24', 24, 83.76, 'Squeeze top')] },
        { id: 'guards', name: 'Skate guards', icon: '⛸️', packs: [pk('a', '5 pairs', 5, 52.45, 'Fits most skates'), pk('b', '20 pairs', 20, 179.80, 'Fits most skates')] },
        { id: 'wax', name: 'Stick wax', icon: '🕯️', packs: [pk('a', 'Pack of 12', 12, 22.68, 'Small and light'), pk('b', 'Pack of 48', 48, 71.52, 'Small and light')] }
      ] },
    craft: { name: 'Craft supplies', icon: '🎨', blurb: 'Art and craft supplies for makers', markup: [40, 120], names: ['The Craft Corner', 'Make It Pop', 'Brush & Bead'],
      products: [
        { id: 'markers', name: 'Marker sets', icon: '🖍️', packs: [pk('a', '6 sets', 6, 37.14, '12 colours each'), pk('b', '24 sets', 24, 125.76, '12 colours each')] },
        { id: 'sketch', name: 'Sketchbooks', icon: '📓', packs: [pk('a', 'Pack of 5', 5, 31.25, 'Thick paper'), pk('b', 'Pack of 20', 20, 127.00, 'Thick paper')] },
        { id: 'yarn', name: 'Yarn balls', icon: '🧶', packs: [pk('a', 'Bag of 10', 10, 36.90, 'Mixed colours'), pk('b', 'Bag of 40', 40, 123.99, 'Mixed colours')] },
        { id: 'glue', name: 'Glue sticks', icon: '🧴', packs: [pk('a', 'Pack of 30', 30, 26.70, 'Dries out after 2 years'), pk('b', 'Pack of 120', 120, 86.99, 'Dries out after 1 year')] },
        { id: 'beads', name: 'Bead kits', icon: '📿', packs: [pk('a', 'Pack of 8', 8, 33.52, 'Gift boxes'), pk('b', 'Pack of 30', 30, 104.70, 'Plain bags')] },
        { id: 'brush', name: 'Paint brush sets', icon: '🖌️', packs: [pk('a', 'Pack of 10', 10, 15.90, '5 brushes per set'), pk('b', 'Pack of 50', 50, 64.50, '5 brushes per set')] },
        { id: 'paint', name: 'Acrylic paint tubes', icon: '🎨', packs: [pk('a', 'Pack of 12', 12, 24.84, 'Bright colours'), pk('b', 'Pack of 48', 48, 84.96, 'Bright colours')] },
        { id: 'sticker', name: 'Sticker sheets', icon: '⭐', packs: [pk('a', 'Pack of 25', 25, 19.75, 'Shiny'), pk('b', 'Pack of 100', 100, 64.99, 'Shiny')] }
      ] },
    own: { name: 'My own idea', icon: '💡', blurb: 'Make up your own kind of shop', markup: [30, 150], names: [], own: true }
  };
  var TYPES = ['snack', 'phone', 'hockey', 'craft', 'own'];
  var BANDS = { cheap: { t: 'Under $2 each', lo: 0.45, hi: 1.85, n: [24, 100] }, mid: { t: '$2 to $10 each', lo: 2.2, hi: 8.9, n: [10, 40] }, big: { t: 'Over $10 each', lo: 10.5, hi: 29, n: [4, 12] } };
  var REASONS = [['spoil', 'It won’t go bad (or out of style) before I sell it'], ['space', 'It fits in my storage space'], ['quality', 'Better quality or brand'], ['upfront', 'It costs less money up front'], ['sell', 'I can sell that many']];
  /* example exchange rates: Canadian dollars for 1 unit of the foreign currency */
  var RATES = [{ c: 'US dollar (USD)', buy: 1.3610, sell: 1.4220, us: true }, { c: 'Euro (EUR)', buy: 1.5450, sell: 1.6380 }, { c: 'British pound (GBP)', buy: 1.7850, sell: 1.8920 }, { c: 'Mexican peso (MXN)', buy: 0.0712, sell: 0.0815 }];
  var USD = RATES[0];
  var COLORS = [['#2563eb', 'Blue'], ['#db2777', 'Pink'], ['#16a34a', 'Green'], ['#ea580c', 'Orange'], ['#7c3aed', 'Purple'], ['#0f766e', 'Teal']];
  var THEMES = [['bold', 'Bold'], ['fresh', 'Fresh'], ['night', 'Night market']];

  /* ================= the student's shop, from their choices ================= */
  function rnd(seed, k) { return (PJ.hash(seed + '|' + k) % 10000) / 10000; }
  function shopType(c) { return SHOPS[c.get('shop')] || null; }
  function ownProduct(c, i) {
    var band = BANDS[c.get('own.b' + i)] || BANDS.mid, base = band.lo + (band.hi - band.lo) * rnd(c.seed, 'own' + i);
    var p1 = Math.round(base * band.n[0] * 10) / 10 - 0.01, p2 = Math.round(base * 0.86 * band.n[1] * 10) / 10 - 0.01;
    return { id: 'o' + i, name: String(c.get('own.n' + i) || 'Product ' + i).trim() || 'Product ' + i, icon: ['🎁', '🛍️', '📦', '🏷️', '✨'][i - 1], packs: [pk('a', 'Pack of ' + band.n[0], band.n[0], r2(p1), 'Small order'), pk('b', 'Pack of ' + band.n[1], band.n[1], r2(p2), 'Big order')] };
  }
  function catalog(c) { var t = shopType(c); if (!t) return []; if (t.own) return [1, 2, 3, 4, 5].map(function (i) { return ownProduct(c, i); }); return t.products; }
  function products(c) {
    var t = shopType(c); if (!t) return [];
    if (t.own) return catalog(c);
    var by = {}; t.products.forEach(function (p) { by[p.id] = p; });
    return (c.get('picks', []) || []).map(function (id) { return by[id]; }).filter(Boolean);
  }
  function unitOf(pack) { return pack.price / pack.n; }
  function bestPack(p) { return p.packs.reduce(function (b, k) { return !b || unitOf(k) < unitOf(b) ? k : b; }, null); }
  function orderPack(c, p) { var id = c.get('order.' + p.id); return p.packs.filter(function (k) { return k.id === id; })[0] || bestPack(p); }
  function cost(c, p) { return r2(unitOf(orderPack(c, p))); }
  function val(c, k, fallback) { var x = c.num(k); return isNaN(x) ? fallback : x; }
  function markupPct(c, p) { return Number(c.get('mk.' + p.id)) || 0; }
  function retailExp(c, p) { var cs = cost(c, p); return r2(cs + r2(cs * markupPct(c, p) / 100)); }
  /* the price the student sells at: their nice price if they rounded, else their selling price (their own typed values) */
  function price(c, p) { return c.get('nice.' + p.id) === '1' ? val(c, 'np.' + p.id, retailExp(c, p)) : val(c, 'rt.' + p.id, retailExp(c, p)); }
  function shopName(c) { return String(c.get('shopName') || 'My shop').trim() || 'My shop'; }
  function promo(c, k) { return c.get('promo.' + k); }
  function saleProd(c, k) { var id = c.get('sale.' + k); return products(c).filter(function (p) { return p.id === id; })[0] || null; }
  function promoLabel(type, amt) { return type === 'pct' ? amt + '% off' : type === 'off' ? money(Number(amt)) + ' off' : type === 'bogo' ? 'Buy one, get one half price' : ''; }
  /* what 1 and 2 items cost with a deal */
  function dealCost(type, amt, sp) {
    if (type === 'pct') { var one = r2(sp - r2(sp * amt / 100)); return { one: one, two: r2(2 * one) }; }
    if (type === 'off') return { one: r2(sp - amt), two: r2(2 * (sp - amt)) };
    if (type === 'bogo') return { one: r2(sp), two: r2(sp + sp / 2) };
    return { one: 0, two: 0 };
  }
  function otherDeal(c) { return promo(c, 1) === 'bogo' ? { type: 'pct', amt: 25 } : { type: 'bogo', amt: 0 }; }
  function usOrder(c) { var ps = products(c), q = [[2, 1, 3], [1, 3, 2], [3, 2, 1]][c.seed % 3]; return [0, 2, 4].map(function (i, j) { return ps[i] ? { p: ps[i], q: q[j] } : null; }).filter(Boolean); }
  /* the US supplier's offer for the student's 2nd product: sometimes cheaper than their Canadian pack, sometimes not */
  function usDeal(c) {
    var p = products(c)[1]; if (!p) return null;
    var cs = cost(c, p), f = [0.78, 1.18, 0.84, 1.26][c.seed % 4], n = cs < 2 ? 100 : cs < 10 ? 30 : 8;
    var ship = cs < 2 ? 9.5 : cs < 10 ? 14 : 18, total = cs * f * n / USD.sell, pr = Math.max(4.99, Math.round(total - ship) - 0.01);
    return { p: p, n: n, price: r2(pr), ship: ship, cadEach: cs };
  }
  function usNums(d) { var tot = r2(d.price + d.ship), cad = r2(tot * USD.sell); return { tot: tot, cad: cad, each: r2(cad / d.n) }; }
  function profitList(c) { return products(c).map(function (p) { return { p: p, profit: r2(price(c, p) - cost(c, p)) }; }); }
  PJ.popup = { SHOPS: SHOPS, products: products, cost: cost, price: price, usDeal: usDeal, usOrder: usOrder, dealCost: dealCost, RATES: RATES };

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function prodHead(p, extra) { return '<div class="pj-ph"><span class="pj-pi">' + p.icon + '</span><b>' + esc(p.name) + '</b>' + (extra || '') + '</div>'; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function tagHtml(o) {
    return '<div class="pj-tag" style="--tc:' + o.color + '"><span class="pj-tag-hole"></span><div class="pj-tag-shop">' + esc(o.shop) + '</div><div class="pj-tag-i">' + o.icon + '</div><div class="pj-tag-n">' + esc(o.name) + '</div>' +
      '<div class="pj-tag-p">' + (o.price != null ? money(o.price) : '$—') + '</div>' +
      '<div class="pj-tag-g"><span>+ GST (5%)</span><b>' + (o.gst != null ? money(o.gst) : '—') + '</b></div><div class="pj-tag-t"><span>Total</span><b>' + (o.total != null ? money(o.total) : '—') + '</b></div>' +
      (o.line ? '<div class="pj-tag-l">' + esc(o.line) + '</div>' : '') + '</div>';
  }
  function eq(left, right, fmt, delay) { return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="' + (fmt || 'money') + '"' + (delay ? ' data-delay="' + delay + '"' : '') + '>' + (fmt === 'pct' ? pct(right) : fmt === 'usd' ? money(right, 'US$') : money(right)) + '</span></b></div>'; }

  /* ================= Checkpoint 1: open your shop ================= */
  var cp1 = {
    id: 'open', title: 'Open your shop', needs: [], graded: false,
    goal: 'Choose what kind of shop you’ll run, give it a name, and pick <b>5 products</b> to sell.',
    example: { title: 'Maple Leaf Treats opens for business', steps: [
      { cap: 'Meet <b>Maple Leaf Treats</b>, a pop-up stand at the school winter market. First, the owner picks a <b>type of shop</b>: treats!', html: '<div class="pj-x-types"><span>🍿 Snacks</span><span class="on">🍁 Treats</span><span>🏒 Hockey</span><span>🎨 Crafts</span></div>' },
      { cap: 'Next, a <b>shop name</b> that’s easy to remember.', html: '<div class="pj-x-store"><div class="pj-awning" style="--tc:#c2410c"></div><div class="pj-x-sign"><span class="pj-type">Maple Leaf Treats</span></div></div>' },
      { cap: 'Last, <b>5 products</b> to sell. Each product comes from a supplier in different pack sizes — that’s Checkpoint 2.', html: '<div class="pj-x-prods"><span style="--i:0">🍬 Maple fudge</span><span style="--i:1">🍪 Maple cookies</span><span style="--i:2">🍭 Maple lollipops</span><span style="--i:3">🍯 Maple syrup</span><span style="--i:4">🍁 Maple candy</span></div>' }] },
    render: function (box, c) {
      part(box, 'A', 'What kind of shop?', 'Pick one. You can change it later, but you’ll pick new products.');
      box.appendChild(c.choice('shop', TYPES.map(function (k) { var t = SHOPS[k]; return { v: k, html: '<span class="pj-ti">' + t.icon + '</span><b>' + t.name + '</b><small>' + t.blurb + '</small>' }; }), { cls: 'pj-types', aria: 'Type of shop',
        onPick: function () { c.set('picks', []); c.redraw(); } }));
      var t = shopType(c); if (!t) return;
      part(box, 'B', 'Name your shop', 'Make it short and catchy.');
      var nm = c.text('shopName', { ph: t.own ? 'Your shop’s name' : 'e.g. ' + t.names[0], max: 28, aria: 'Shop name', onInput: function () { var s = box.querySelector('.pj-x-sign span'); if (s) s.textContent = shopName(c); } });
      box.appendChild(nm);
      if (t.names.length) { var ideas = el('div', 'pj-ideas', '<span>Need an idea?</span>'); t.names.forEach(function (n) { var b = el('button', 'pj-idea', esc(n)); b.type = 'button'; if (c.ro) b.disabled = true; b.addEventListener('click', function () { c.set('shopName', n); c.redraw(); }); ideas.appendChild(b); }); box.appendChild(ideas); }
      if (t.own) {
        part(box, 'C', 'Your shop and its 5 products', 'Name each product and pick how much one usually costs. Your supplier’s prices will match.');
        box.appendChild(field('What do you sell?', c.text('own.kind', { ph: 'e.g. Bubble tea, dog treats, nail polish…', max: 30, aria: 'Kind of shop' })));
        var g = el('div', 'pj-own');
        [1, 2, 3, 4, 5].forEach(function (i) {
          var r = el('div', 'pj-own-r'); r.appendChild(el('span', 'pj-own-n', String(i)));
          r.appendChild(c.text('own.n' + i, { ph: 'Product ' + i, max: 28, aria: 'Product ' + i + ' name' }));
          r.appendChild(c.choice('own.b' + i, Object.keys(BANDS).map(function (k) { return { v: k, html: BANDS[k].t }; }), { cls: 'pj-bands', aria: 'Product ' + i + ' price range' }));
          g.appendChild(r);
        });
        box.appendChild(g);
      } else {
        var picks = c.get('picks', []) || [];
        part(box, 'C', 'Pick 5 products', '<span class="pj-count-pill">' + picks.length + ' of 5 picked</span>');
        var grid = el('div', 'pj-picks'); grid.dataset.f = 'picks';
        t.products.forEach(function (p) {
          var on = picks.indexOf(p.id) >= 0, b = el('button', 'pj-pick' + (on ? ' on' : ''), '<span class="pj-pi">' + p.icon + '</span><b>' + esc(p.name) + '</b><small>' + p.packs.length + ' pack sizes</small>');
          b.type = 'button'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); if (c.ro) b.disabled = true;
          b.addEventListener('click', function () { var cur = (c.get('picks', []) || []).slice(), i = cur.indexOf(p.id); if (i >= 0) cur.splice(i, 1); else if (cur.length < 5) cur.push(p.id); else return; c.set('picks', cur); c.redraw(); });
          grid.appendChild(b);
        });
        box.appendChild(grid);
      }
      // the storefront, live
      var ps = products(c), store = el('div', 'pj-store');
      store.innerHTML = '<div class="pj-awning" style="--tc:' + esc(c.get('tagColor') || '#2563eb') + '"></div><div class="pj-x-sign"><span>' + esc(shopName(c)) + '</span></div><div class="pj-store-shelf">' + (ps.length ? ps.map(function (p) { return '<span title="' + esc(p.name) + '">' + p.icon + '</span>'; }).join('') : '<em>Your products go here</em>') + '</div>';
      box.appendChild(store);
    },
    check: function (c) {
      var t = shopType(c), out = [c.msg(!!t, 'Pick a type of shop first.')]; if (!t) return out;
      out.push(c.need('shopName', { min: 2, hint: 'Give your shop a name.' }));
      if (t.own) { out.push(c.need('own.kind', { min: 3 })); [1, 2, 3, 4, 5].forEach(function (i) { out.push(c.need('own.n' + i, { min: 2 })); out.push(c.need('own.b' + i)); }); }
      else { var n = (c.get('picks', []) || []).length; out.push(c.msg(n === 5, 'Pick <b>5 products</b> (you have ' + n + ').')); }
      return out;
    },
    solve: function (c) { if (!c.get('shop')) c.set('shop', 'snack'); var t = shopType(c); c.set('shopName', t.own ? 'My Shop' : t.names[0]); if (t.own) { c.set('own.kind', 'Gifts'); [1, 2, 3, 4, 5].forEach(function (i) { c.set('own.n' + i, 'Thing ' + i); c.set('own.b' + i, ['cheap', 'mid', 'big', 'mid', 'cheap'][i - 1]); }); } else c.set('picks', t.products.slice(0, 5).map(function (p) { return p.id; })); }
  };

  /* ================= Checkpoint 2: the best supplier deal ================= */
  var cp2 = {
    id: 'deal', title: 'Find the best supplier deal', needs: ['u1l3', 'u1l4', 'u1l5', 'u1l6'],
    goal: 'Find the <b>unit price</b> of every pack, star the best buy, and choose the pack you’ll order — with one reason besides price.',
    example: { title: 'Which fudge pack is the better buy?', scene: '<div class="pj-x-packs"><div class="pj-x-pack"><b>Box of 12</b><span>$18.00</span><small>Maple fudge</small></div><div class="pj-x-pack pj-x-p2"><b>Case of 40</b><span>$54.00</span><small>Fresh for 4 weeks</small></div></div>', steps: [
      { cap: 'To compare packs, find the <b>unit price</b>: the price for <b>one</b> item. Divide the price by the number of items.', html: eq('$18.00 ÷ 12', 1.5) },
      { cap: 'Do the same for the case.', html: eq('$54.00 ÷ 40', 1.35) },
      { cap: 'The case has the <b>lowest unit price</b> ($1.35 &lt; $1.50), so it’s the <b>best buy</b>.', html: '<div class="pj-x-star">★ Best buy: Case of 40 at $1.35 each</div>' },
      { cap: 'Price isn’t everything. Fudge stays fresh for 4 weeks and she sells about 15 a week, so she can sell 40 in time. She orders the case.', html: '<div class="pj-x-why"><span>Reason:</span> “It won’t go bad before I sell it.”</div>' }] },
    render: function (box, c) {
      var ps = products(c); if (!ps.length) return needFirst(box, 'Finish Checkpoint 1 first.');
      box.appendChild(el('p', 'pj-tip', 'Unit price = price ÷ number of items. Round to the nearest cent. Use the calculator at the top if you need it.'));
      ps.forEach(function (p) {
        var card = el('div', 'pj-prod'); card.innerHTML = prodHead(p);
        var tb = el('div', 'pj-packs');
        tb.appendChild(el('div', 'pj-packs-h', '<span>Pack</span><span>Price</span><span>Unit price</span><span>Best buy?</span>'));
        p.packs.forEach(function (k) {
          var r = el('div', 'pj-pack-r');
          r.appendChild(el('div', 'pj-pack-l', '<b>' + esc(k.label) + '</b><small>' + esc(k.note) + '</small>'));
          r.appendChild(el('div', 'pj-pack-p', money(k.price)));
          r.appendChild(c.input('unit.' + p.id + '.' + k.id, { aria: 'Unit price of ' + p.name + ', ' + k.label }));
          var star = c.choice('best.' + p.id, [{ v: k.id, html: '★', title: 'Best buy' }], { cls: 'pj-star', aria: 'Best buy: ' + k.label, onPick: function () { c.redraw(); } });
          star.dataset.inline = '0';
          r.appendChild(star); tb.appendChild(r);
        });
        card.appendChild(tb);
        var row = el('div', 'pj-order');
        row.appendChild(field('Pack I’ll order', c.choice('order.' + p.id, p.packs.map(function (k) { return { v: k.id, html: esc(k.label) }; }), { cls: 'pj-seg', aria: 'Pack to order for ' + p.name })));
        row.appendChild(field('Why? (one reason besides price)', c.select('why.' + p.id, REASONS.map(function (x) { return { v: x[0], t: x[1] }; }), { aria: 'Reason for ' + p.name })));
        card.appendChild(row);
        box.appendChild(card);
      });
    },
    check: function (c) {
      var out = [];
      products(c).forEach(function (p) {
        p.packs.forEach(function (k) {
          var u = unitOf(k);
          out.push(c.money('unit.' + p.id + '.' + k.id, u, { tol: 0.006, label: esc(p.name) + ', ' + esc(k.label),
            wrong: [{ v: k.n / k.price, tol: 0.02, hint: 'You divided the number of items by the price. Flip it: unit price = <b>price ÷ number of items</b>.' }, { v: k.price * k.n, tol: 1, hint: 'You multiplied. To find the price of one item, <b>divide</b>: price ÷ number of items.' }],
            hint: 'Unit price = price ÷ number of items.', hint2: 'Type ' + money(k.price) + ' ÷ ' + k.n + ' into the calculator, then round to the nearest cent.' }));
        });
        out.push(c.equals('best.' + p.id, bestPack(p).id, { label: esc(p.name), hint: 'Star the pack with the <b>lowest unit price</b> (the cheapest price for one item) — it isn’t always the biggest pack!' }));
        out.push(c.need('order.' + p.id, { label: esc(p.name) }));
        out.push(c.need('why.' + p.id, { label: esc(p.name) }));
      });
      return out;
    },
    solve: function (c) { products(c).forEach(function (p) { p.packs.forEach(function (k) { c.set('unit.' + p.id + '.' + k.id, r2(unitOf(k)).toFixed(2)); }); var b = bestPack(p); c.set('best.' + p.id, b.id); c.set('order.' + p.id, b.id); c.set('why.' + p.id, 'space'); }); }
  };

  /* ================= Checkpoint 3: set your prices ================= */
  var cp3 = {
    id: 'price', title: 'Set your prices', needs: ['u1l7', 'u1l8'],
    goal: 'Choose a <b>markup</b> for each product, then work out the markup in dollars and your <b>selling price</b>. Round to a “nice” price if you like.',
    example: { title: 'Pricing a bottle of maple syrup', scene: '<div class="pj-x-cost">🍯 Maple syrup · unit cost <b>$6.40</b></div>', steps: [
      { cap: 'A <b>markup</b> is the percent you add to your cost to make a profit. She picks <b>50%</b>. As a decimal, 50% = 0.50.', html: '<div class="pj-x-chip">Markup: 50% → 0.50</div>' },
      { cap: 'Markup in dollars = cost × markup.', html: eq('$6.40 × 0.50', 3.2) },
      { cap: 'Selling price = cost + markup.', html: eq('$6.40 + $3.20', 9.6) },
      { cap: '$9.60 is fine, but stores like prices that end in <b>.99</b>. She rounds up to <b>$9.99</b>.', html: '<div class="pj-x-chip pj-x-nice">Nice price: <b>$9.99</b></div>' },
      { cap: 'Rounding changes the markup. Real markup = (nice price − cost) ÷ cost × 100.', html: eq('($9.99 − $6.40) ÷ $6.40 × 100', 56.1, 'pct') }] },
    render: function (box, c) {
      var ps = products(c), t = shopType(c); if (!ps.length || !t) return needFirst(box, 'Finish Checkpoints 1 and 2 first.');
      box.appendChild(el('p', 'pj-tip', 'Shops like yours usually mark up between <b>' + t.markup[0] + '% and ' + t.markup[1] + '%</b>. Round money to the nearest cent.'));
      ps.forEach(function (p) {
        var cs = cost(c, p), card = el('div', 'pj-prod pj-prod-row');
        card.innerHTML = prodHead(p, '<span class="pj-cost">Unit cost <b>' + money(cs) + '</b></span>');
        var g = el('div', 'pj-grid3');
        // markup % slider
        var mk = el('div', 'pj-field pj-mk'); mk.dataset.f = 'mk.' + p.id;
        var cur = c.get('mk.' + p.id, ''), out = el('output', 'pj-mk-v', cur ? cur + '%' : 'Pick');
        var sl = el('input'); sl.type = 'range'; sl.min = t.markup[0]; sl.max = t.markup[1]; sl.step = 5; sl.value = cur || Math.round((t.markup[0] + t.markup[1]) / 10) * 5; sl.setAttribute('aria-label', 'Markup percent for ' + p.name); if (c.ro) sl.disabled = true;
        if (!cur) mk.classList.add('unset');
        var pickMk = function () { if (c.get('mk.' + p.id) === sl.value) return; c.set('mk.' + p.id, sl.value); out.textContent = sl.value + '%'; mk.classList.remove('unset', 'ok', 'bad'); };
        sl.addEventListener('input', pickMk); sl.addEventListener('change', pickMk); sl.addEventListener('pointerup', pickMk); sl.addEventListener('keyup', pickMk);
        mk.appendChild(el('span', 'pj-fl', 'Markup %')); var sw = el('div', 'pj-mk-row'); sw.appendChild(sl); sw.appendChild(out); mk.appendChild(sw);
        g.appendChild(mk);
        g.appendChild(field('Markup ($)', c.input('mkd.' + p.id, { aria: 'Markup in dollars for ' + p.name })));
        g.appendChild(field('Selling price', c.input('rt.' + p.id, { aria: 'Selling price for ' + p.name })));
        card.appendChild(g);
        var nice = el('div', 'pj-nice');
        nice.appendChild(c.choice('nice.' + p.id, [{ v: '1', html: '<span class="pj-cb"></span> Round to a nice price ending in .99' }], { cls: 'pj-toggle', toggle: true, onPick: function () { c.redraw(); } }));
        if (c.get('nice.' + p.id) === '1') {
          nice.appendChild(field('Nice price', c.input('np.' + p.id, { aria: 'Nice price for ' + p.name, ph: '0.99' })));
          nice.appendChild(field('Real markup %', c.input('rm.' + p.id, { kind: 'pct', aria: 'Real markup percent for ' + p.name })));
        }
        card.appendChild(nice);
        box.appendChild(card);
      });
    },
    check: function (c) {
      var out = [], t = shopType(c);
      products(c).forEach(function (p) {
        var cs = cost(c, p), m = markupPct(c, p), lab = esc(p.name);
        out.push(c.need('mk.' + p.id, { label: lab }));
        if (!m) return;
        var md = r2(cs * m / 100), rt = r2(cs + md);
        out.push(c.money('mkd.' + p.id, cs * m / 100, { label: lab + ' markup', wrong: [{ v: cs * m, hint: 'Change the percent to a decimal first: ' + m + '% = ' + (m / 100) + '.' }, { v: rt, hint: 'That’s the selling price. The markup is just the extra part: cost × markup %.' }],
          hint: 'Markup ($) = cost × markup %.', hint2: 'Try ' + money(cs) + ' × ' + (m / 100) + ' on the calculator.' }));
        out.push(c.money('rt.' + p.id, rt, { tol: 0.011, label: lab + ' selling price', wrong: [{ v: md, hint: 'That’s the markup. Selling price = <b>cost + markup</b>.' }],
          hint: 'Selling price = cost + markup.', hint2: 'Add: ' + money(cs) + ' + ' + money(md) + '.' }));
        if (c.get('nice.' + p.id) === '1') {
          var np = c.num('np.' + p.id), lo = Math.floor(rt) - 0.01, hi = Math.floor(rt) + 0.99;
          if (!c.has('np.' + p.id)) out.push({ f: 'np.' + p.id, ok: false, blank: true, graded: true });
          else {
            var ends = !isNaN(np) && Math.round(np * 100) % 100 === 99, ok = ends && (Math.abs(np - lo) < 0.001 || Math.abs(np - hi) < 0.001) && np > cs;
            out.push({ f: 'np.' + p.id, ok: ok, blank: false, graded: true, label: lab + ' nice price', form: isNaN(np),
              hint: isNaN(np) ? 'Type just a number, like 4.99.' : !ends ? 'A nice price ends in <b>.99</b>, like $3.99.' : np <= cs ? 'That’s not more than your cost — you’d lose money on every sale!' : 'Pick the .99 price just above or just below your selling price (' + money(rt) + ').' });
            if (ok) {
              var rm = (np - cs) / cs * 100;
              out.push(c.pct('rm.' + p.id, rm, { label: lab + ' real markup', wrong: [{ v: (np - cs) / np * 100, tol: 0.06, hint: 'Divide by the <b>cost</b>, not the nice price.' }, { v: np / cs * 100, tol: 0.06, hint: 'Subtract the cost first: (nice price − cost) ÷ cost × 100.' }, { v: (np - cs) / cs, tol: 0.002, hint: 'Multiply by 100 to change the decimal to a percent.' }],
                hint: 'Real markup % = (nice price − cost) ÷ cost × 100.', hint2: 'Try (' + money(np) + ' − ' + money(cs) + ') ÷ ' + money(cs) + ' × 100.' }));
            }
          }
        }
        if (t && m && (m < t.markup[0] || m > t.markup[1])) out.push(c.msg(false, 'Keep each markup between ' + t.markup[0] + '% and ' + t.markup[1] + '%.'));
      });
      return out;
    },
    solve: function (c) {
      var t = shopType(c);
      products(c).forEach(function (p, i) {
        var cs = cost(c, p), m = Math.round((t.markup[0] + (t.markup[1] - t.markup[0]) * (i / 4)) / 5) * 5; c.set('mk.' + p.id, String(m));
        var md = r2(cs * m / 100), rt = r2(cs + md); c.set('mkd.' + p.id, md.toFixed(2)); c.set('rt.' + p.id, rt.toFixed(2));
        if (i % 2 === 0) { var np = Math.floor(rt) + 0.99; c.set('nice.' + p.id, '1'); c.set('np.' + p.id, np.toFixed(2)); c.set('rm.' + p.id, ((np - cs) / cs * 100).toFixed(1)); } else c.set('nice.' + p.id, '');
      });
    }
  };

  /* ================= Checkpoint 4: price tags with GST ================= */
  function tagFor(c, p) { var sp = price(c, p), g = c.num('gst.' + p.id), t = c.num('tot.' + p.id); return { shop: shopName(c), icon: p.icon, name: p.name, price: sp, gst: isNaN(g) ? null : g, total: isNaN(t) ? null : t, color: c.get('tagColor') || COLORS[0][0], line: c.get('line.' + p.id) }; }
  var cp4 = {
    id: 'tags', title: 'Price tags with GST', needs: ['u1l8'],
    goal: 'Make a price tag for each product: the price, the <b>GST (5%)</b> and the <b>total</b> a customer pays.',
    example: { title: 'A price tag for maple syrup', scene: '<div class="pj-x-cost">🍯 Maple syrup · price <b>$9.99</b></div>', steps: [
      { cap: 'In Alberta the only sales tax is <b>GST</b>, which is <b>5%</b>. As a decimal, 5% = 0.05.', html: '<div class="pj-x-chip">GST: 5% → 0.05</div>' },
      { cap: 'GST = price × 0.05. $9.99 × 0.05 = $0.4995, which rounds to <b>$0.50</b>.', html: eq('$9.99 × 0.05', 0.5) },
      { cap: 'Total = price + GST.', html: eq('$9.99 + $0.50', 10.49) },
      { cap: 'Now it all goes on the tag, so customers know what they’ll really pay.', html: '<div class="pj-x-tagwrap"><div class="pj-tag" style="--tc:#c2410c"><span class="pj-tag-hole"></span><div class="pj-tag-shop">Maple Leaf Treats</div><div class="pj-tag-i">🍯</div><div class="pj-tag-n">Maple syrup</div><div class="pj-tag-p">$9.99</div><div class="pj-tag-g"><span>+ GST (5%)</span><b>$0.50</b></div><div class="pj-tag-t"><span>Total</span><b>$10.49</b></div><div class="pj-tag-l">Straight from Quebec!</div></div></div>' }] },
    render: function (box, c) {
      var ps = products(c); if (!ps.length) return needFirst(box, 'Finish the checkpoints before this one first.');
      part(box, 'A', 'Pick a colour for your tags', '');
      box.appendChild(c.choice('tagColor', COLORS.map(function (x) { return { v: x[0], html: '<i style="background:' + x[0] + '"></i>' + x[1], title: x[1] }; }), { cls: 'pj-swatches', aria: 'Tag colour', onPick: function () { c.redraw(); } }));
      part(box, 'B', 'Work out the GST and total for each tag', 'GST = price × 0.05. Total = price + GST. Round to the nearest cent.');
      var grid = el('div', 'pj-tags');
      ps.forEach(function (p) {
        var cell = el('div', 'pj-tagcell'), prev = el('div', 'pj-tagprev', tagHtml(tagFor(c, p)));
        cell.appendChild(prev);
        var f = el('div', 'pj-tagform');
        f.appendChild(el('div', 'pj-tagprice', prodHead(p) + '<span>Price <b>' + money(price(c, p)) + '</b></span>'));
        function upd() { prev.innerHTML = tagHtml(tagFor(c, p)); }
        f.appendChild(field('GST (5%)', c.input('gst.' + p.id, { aria: 'GST for ' + p.name, onInput: upd })));
        f.appendChild(field('Total', c.input('tot.' + p.id, { aria: 'Total with GST for ' + p.name, onInput: upd })));
        f.appendChild(field('Tag line (optional)', c.text('line.' + p.id, { ph: 'e.g. Best seller!', max: 22, aria: 'Tag line for ' + p.name, onInput: upd })));
        cell.appendChild(f); grid.appendChild(cell);
      });
      box.appendChild(grid);
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my price tags'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<div class="pj-printsheet"><h1>' + esc(shopName(c)) + ' — price tags</h1><div class="pj-tags-print">' + products(c).map(function (p) { return tagHtml(tagFor(c, p)); }).join('') + '</div></div>', shopName(c) + ' price tags'); });
      if (!c.ro) box.appendChild(pr);
    },
    check: function (c) {
      var out = [c.msg(!!c.get('tagColor'), 'Pick a colour for your tags (Part A).')];
      products(c).forEach(function (p) {
        var sp = price(c, p), g = r2(sp * 0.05), lab = esc(p.name);
        out.push(c.money('gst.' + p.id, sp * 0.05, { label: lab + ' GST', wrong: [{ v: sp * 5, tol: 0.05, hint: 'Use 5% as a decimal: <b>0.05</b>, not 5.' }, { v: sp * 0.5, tol: 0.02, hint: '5% is <b>0.05</b>, not 0.5.' }, { v: sp * 1.05, tol: 0.02, hint: 'That’s the total. The GST is just the 5% part: price × 0.05.' }],
          hint: 'GST = price × 0.05.', hint2: 'Try ' + money(sp) + ' × 0.05, then round to the cent.' }));
        out.push(c.money('tot.' + p.id, sp + g, { tol: 0.011, label: lab + ' total', wrong: [{ v: sp + 5, tol: 0.02, hint: 'Add the GST in <b>dollars</b>, not 5.' }, { v: g, hint: 'That’s the GST. Total = price + GST.' }, { v: sp - g, hint: 'Add the GST — don’t subtract it.' }],
          hint: 'Total = price + GST.', hint2: 'Add: ' + money(sp) + ' + ' + money(g) + '.' }));
      });
      return out;
    },
    solve: function (c) { c.set('tagColor', COLORS[1][0]); products(c).forEach(function (p) { var sp = price(c, p), g = r2(sp * 0.05); c.set('gst.' + p.id, g.toFixed(2)); c.set('tot.' + p.id, r2(sp + g).toFixed(2)); }); }
  };

  /* ================= Checkpoint 5: Black Friday sale ================= */
  var PCTS = [10, 15, 20, 25, 30, 40, 50], OFFS = [0.1, 0.25, 0.5, 1, 2, 3, 5, 10, 20];
  var cp5 = {
    id: 'sale', title: 'Black Friday sale', needs: ['u1l7', 'u1l9'],
    goal: 'Put <b>2 products</b> on sale, work out the sale prices and the <b>percent decrease</b>, and find which deal is better for a customer buying one or two.',
    example: { title: 'Maple fudge goes on sale', scene: '<div class="pj-x-cost">🍬 Maple fudge · regular price <b>$2.50</b></div>', steps: [
      { cap: '<b>20% off</b>: the discount is 20% of the price. 20% = 0.20.', html: eq('$2.50 × 0.20', 0.5) },
      { cap: 'Sale price = price − discount.', html: eq('$2.50 − $0.50', 2) },
      { cap: 'Percent decrease = discount ÷ <b>original</b> price × 100. For a percent-off sale it’s the same as the percent off.', html: eq('$0.50 ÷ $2.50 × 100', 20, 'pct') },
      { cap: 'Another deal: <b>buy one, get one half price</b>. One fudge still costs $2.50. Two cost $2.50 + $1.25.', html: eq('$2.50 + $1.25', 3.75) },
      { cap: 'Compare: buying <b>one</b>, 20% off is better. Buying <b>two</b>, buy-one-get-one-half wins!', html: '<table class="pj-x-tbl"><tr><th></th><th>1 fudge</th><th>2 fudge</th></tr><tr><td>20% off</td><td class="win">$2.00</td><td>$4.00</td></tr><tr><td>Buy 1, get 1 half price</td><td>$2.50</td><td class="win">$3.75</td></tr></table>' }] },
    render: function (box, c) {
      var ps = products(c); if (!ps.length) return needFirst(box, 'Finish the checkpoints before this one first.');
      part(box, 'A', 'Choose 2 products and a deal for each', 'Use the selling prices from your tags (before GST).');
      [1, 2].forEach(function (k) {
        var card = el('div', 'pj-prod pj-sale');
        card.appendChild(el('div', 'pj-sale-k', 'Sale product ' + k));
        card.appendChild(field('Product', c.select('sale.' + k, ps.map(function (p) { return { v: p.id, t: p.name + ' (' + money(price(c, p)) + ')' }; }), { aria: 'Sale product ' + k, onPick: function () { c.redraw(); } })));
        var p = saleProd(c, k);
        if (p) {
          var sp = price(c, p);
          card.appendChild(field('Deal', c.choice('promo.' + k, [{ v: 'pct', html: '% off' }, { v: 'off', html: '$ off' }, { v: 'bogo', html: 'Buy 1, get 1 half price' }], { cls: 'pj-seg', aria: 'Deal for sale product ' + k, onPick: function () { c.set('amt.' + k, ''); c.redraw(); } })));
          var ty = promo(c, k);
          if (ty === 'pct') card.appendChild(field('How much off?', c.choice('amt.' + k, PCTS.map(function (x) { return { v: String(x), html: x + '%' }; }), { cls: 'pj-seg pj-seg-sm', aria: 'Percent off', onPick: function () { c.redraw(); } })));
          if (ty === 'off') card.appendChild(field('How much off?', c.choice('amt.' + k, OFFS.filter(function (x) { return x < sp; }).map(function (x) { return { v: String(x), html: money(x) }; }), { cls: 'pj-seg pj-seg-sm', aria: 'Dollars off', onPick: function () { c.redraw(); } })));
          var amt = c.get('amt.' + k);
          if (ty && (ty === 'bogo' || amt)) {
            card.appendChild(el('div', 'pj-sale-ban', '<span class="pj-burst">' + esc(ty === 'bogo' ? 'BOGO ½' : ty === 'pct' ? amt + '% OFF' : money(Number(amt)) + ' OFF') + '</span> ' + p.icon + ' <b>' + esc(p.name) + '</b> · regular ' + money(sp)));
            var g = el('div', 'pj-grid3');
            if (ty === 'pct') { g.appendChild(field('Discount ($)', c.input('dsc.' + k, { aria: 'Discount for sale product ' + k }))); g.appendChild(field('Sale price', c.input('sp.' + k, { aria: 'Sale price for sale product ' + k }))); }
            if (ty === 'off') g.appendChild(field('Sale price', c.input('sp.' + k, { aria: 'Sale price for sale product ' + k })));
            if (ty === 'bogo') { g.appendChild(field('2 at regular price', c.input('reg2.' + k, { aria: 'Two at regular price, sale product ' + k }))); g.appendChild(field('2 on the deal', c.input('sale2.' + k, { aria: 'Two on the deal, sale product ' + k }))); }
            g.appendChild(field('Percent decrease' + (ty === 'bogo' ? ' (for 2)' : ''), c.input('pd.' + k, { kind: 'pct', aria: 'Percent decrease, sale product ' + k })));
            card.appendChild(g);
          }
        }
        box.appendChild(card);
      });
      var p1 = saleProd(c, 1), t1 = promo(c, 1);
      if (!p1 || !t1 || (t1 !== 'bogo' && !c.get('amt.1'))) return;
      var sp1 = price(c, p1), A = { type: t1, amt: Number(c.get('amt.1')) || 0 }, B = otherDeal(c);
      part(box, 'B', 'Which deal is better for the customer?', 'Compare your deal on ' + esc(p1.name) + ' with <b>' + esc(promoLabel(B.type, B.amt)) + '</b>. What does a customer pay for 1 item? For 2 items?');
      var tb = el('div', 'pj-cmp');
      tb.appendChild(el('div', 'pj-cmp-h', '<span></span><span>Pay for 1</span><span>Pay for 2</span>'));
      [['A', A], ['B', B]].forEach(function (x) {
        var r = el('div', 'pj-cmp-r'); r.appendChild(el('div', 'pj-cmp-l', '<b>' + (x[0] === 'A' ? 'Your deal' : 'Other deal') + '</b><small>' + esc(promoLabel(x[1].type, x[1].amt)) + '</small>'));
        r.appendChild(c.input('c1' + x[0], { aria: 'Cost of 1 with ' + (x[0] === 'A' ? 'your deal' : 'the other deal') }));
        r.appendChild(c.input('c2' + x[0], { aria: 'Cost of 2 with ' + (x[0] === 'A' ? 'your deal' : 'the other deal') }));
        tb.appendChild(r);
      });
      box.appendChild(tb);
      var opts = [{ v: 'A', html: 'Your deal' }, { v: 'B', html: 'Other deal' }, { v: 'same', html: 'Same price' }];
      var q = el('div', 'pj-order');
      q.appendChild(field('Better for someone buying <b>one</b>', c.choice('best1', opts, { cls: 'pj-seg', aria: 'Better deal for one' })));
      q.appendChild(field('Better for someone buying <b>two</b>', c.choice('best2', opts, { cls: 'pj-seg', aria: 'Better deal for two' })));
      box.appendChild(q);
      void sp1;
    },
    check: function (c) {
      var out = [], p1 = saleProd(c, 1), p2 = saleProd(c, 2);
      out.push(c.msg(!!(p1 && p2), 'Choose 2 products for the sale.'));
      if (p1 && p2) out.push(c.msg(p1.id !== p2.id, 'Pick 2 <b>different</b> products.'));
      [1, 2].forEach(function (k) {
        var p = saleProd(c, k); if (!p) return;
        var ty = promo(c, k), sp = price(c, p), lab = 'Sale product ' + k, amt = Number(c.get('amt.' + k));
        out.push(c.need('promo.' + k, { label: lab }));
        if (!ty) return;
        if (ty !== 'bogo') { out.push(c.need('amt.' + k, { label: lab })); if (!c.has('amt.' + k)) return; if (!amt || (ty === 'pct' ? PCTS.indexOf(amt) < 0 : OFFS.indexOf(amt) < 0 || amt >= sp)) { out.push(c.msg(false, 'Pick how much off for ' + esc(p.name) + ' again.')); return; } }
        if (ty === 'pct') {
          var d = r2(sp * amt / 100);
          out.push(c.money('dsc.' + k, sp * amt / 100, { label: lab + ' discount', wrong: [{ v: sp * amt, tol: 0.5, hint: 'Change ' + amt + '% to a decimal first: ' + amt / 100 + '.' }, { v: sp - sp * amt / 100, hint: 'That’s the sale price. The discount is just the part taken off: price × ' + amt / 100 + '.' }], hint: 'Discount = price × percent off.', hint2: 'Try ' + money(sp) + ' × ' + amt / 100 + '.' }));
          out.push(c.money('sp.' + k, sp - d, { tol: 0.011, label: lab + ' sale price', wrong: [{ v: d, hint: 'That’s the discount. Sale price = price − discount.' }, { v: sp + d, hint: 'Subtract the discount — don’t add it.' }], hint: 'Sale price = price − discount.', hint2: 'Subtract: ' + money(sp) + ' − ' + money(d) + '.' }));
          out.push(c.pct('pd.' + k, amt, { label: lab + ' percent decrease', wrong: [{ v: d / (sp - d) * 100, tol: 0.2, hint: 'Divide by the <b>original</b> price, not the sale price.' }], hint: 'Percent decrease = discount ÷ original price × 100.', hint2: 'Try ' + money(d) + ' ÷ ' + money(sp) + ' × 100.' }));
        } else if (ty === 'off') {
          out.push(c.money('sp.' + k, sp - amt, { label: lab + ' sale price', wrong: [{ v: sp + amt, hint: 'Subtract the dollars off — don’t add them.' }], hint: 'Sale price = price − dollars off.', hint2: 'Subtract: ' + money(sp) + ' − ' + money(amt) + '.' }));
          out.push(c.pct('pd.' + k, amt / sp * 100, { label: lab + ' percent decrease', wrong: [{ v: amt / (sp - amt) * 100, tol: 0.2, hint: 'Divide by the <b>original</b> price, not the sale price.' }, { v: amt / sp, tol: 0.002, hint: 'Multiply by 100 to change the decimal to a percent.' }, { v: (sp - amt) / sp * 100, tol: 0.2, hint: 'That’s the sale price as a percent of the original. The decrease is the dollars off ÷ original price × 100.' }], hint: 'Percent decrease = dollars off ÷ original price × 100.', hint2: 'Try ' + money(amt) + ' ÷ ' + money(sp) + ' × 100.' }));
        } else {
          out.push(c.money('reg2.' + k, 2 * sp, { label: lab + ', 2 at regular price', hint: 'Two at the regular price = 2 × price.', hint2: 'Try 2 × ' + money(sp) + '.' }));
          out.push(c.money('sale2.' + k, sp + sp / 2, { tol: 0.011, label: lab + ', 2 on the deal', wrong: [{ v: sp / 2, hint: 'That’s just the second item. Add the first one at full price too.' }, { v: sp, hint: 'That’s only one item. Add the second one at half price.' }], hint: 'The first is full price, the second is half price: price + price ÷ 2.', hint2: 'Add: ' + money(sp) + ' + ' + money(sp / 2) + '.' }));
          out.push(c.pct('pd.' + k, 25, { label: lab + ' percent decrease', wrong: [{ v: 50, hint: 'Only one of the two items is half price, so the decrease for both together is less than 50%.' }, { v: (sp / 2) / (1.5 * sp) * 100, tol: 0.2, hint: 'Divide by the <b>original</b> cost of 2 (at regular price).' }], hint: 'Percent decrease = (regular − deal) ÷ regular × 100, for 2 items.', hint2: 'Try (' + money(2 * sp) + ' − ' + money(1.5 * sp) + ') ÷ ' + money(2 * sp) + ' × 100.' }));
        }
      });
      var t1 = promo(c, 1);
      if (p1 && t1 && (t1 === 'bogo' || Number(c.get('amt.1')))) {
        var sp1 = price(c, p1), A = dealCost(t1, Number(c.get('amt.1')) || 0, sp1), B0 = otherDeal(c), B = dealCost(B0.type, B0.amt, sp1);
        var hintFor = function (d) { return d.type === 'bogo' ? 'Buy one, get one half price: 1 item costs the full price; 2 items cost price + half price.' : d.type === 'pct' ? d.amt + '% off each: 1 item costs the sale price; 2 items cost 2 × the sale price.' : money(d.amt) + ' off each: 1 item costs price − ' + money(d.amt) + '; 2 items cost twice that.'; };
        out.push(c.money('c1A', A.one, { tol: 0.011, label: 'Your deal, 1 item', hint: hintFor({ type: t1, amt: Number(c.get('amt.1')) }) }));
        out.push(c.money('c2A', A.two, { tol: 0.021, label: 'Your deal, 2 items', hint: hintFor({ type: t1, amt: Number(c.get('amt.1')) }) }));
        out.push(c.money('c1B', B.one, { tol: 0.011, label: 'Other deal, 1 item', hint: hintFor(B0) }));
        out.push(c.money('c2B', B.two, { tol: 0.021, label: 'Other deal, 2 items', hint: hintFor(B0) }));
        // a tie after rounding to the cent: "Same price" is right, and so is the deal that's cheaper by the student's own amounts
        var w = function (a, b, ka, kb) { if (Math.abs(a - b) >= 0.015) return a < b ? 'A' : 'B'; var x = c.num(ka), y = c.num(kb); return isNaN(x) || isNaN(y) || Math.abs(x - y) < 0.005 ? 'same' : ['same', x < y ? 'A' : 'B']; };
        out.push(c.equals('best1', w(A.one, B.one, 'c1A', 'c1B'), { label: 'Buying one', hint: 'The better deal is the one where the customer pays <b>less</b>. Compare your two “Pay for 1” amounts.' }));
        out.push(c.equals('best2', w(A.two, B.two, 'c2A', 'c2B'), { label: 'Buying two', hint: 'Compare your two “Pay for 2” amounts. If they’re equal, pick “Same price”.' }));
      }
      return out;
    },
    solve: function (c) {
      var ps = products(c); c.set('sale.1', ps[0].id); c.set('sale.2', ps[1].id); c.set('promo.1', 'pct'); c.set('amt.1', '25'); c.set('promo.2', 'off');
      var sp2 = price(c, ps[1]), off = OFFS.filter(function (x) { return x < sp2 / 2; }); c.set('amt.2', String(off[Math.max(0, off.length - 2)]));
      var sp1 = price(c, ps[0]), d = r2(sp1 * 0.25); c.set('dsc.1', d.toFixed(2)); c.set('sp.1', r2(sp1 - d).toFixed(2)); c.set('pd.1', '25');
      var a2 = Number(c.get('amt.2')); c.set('sp.2', r2(sp2 - a2).toFixed(2)); c.set('pd.2', (a2 / sp2 * 100).toFixed(1));
      var A = dealCost('pct', 25, sp1), B = dealCost('bogo', 0, sp1); c.set('c1A', A.one.toFixed(2)); c.set('c2A', A.two.toFixed(2)); c.set('c1B', B.one.toFixed(2)); c.set('c2B', B.two.toFixed(2));
      var w = function (a, b) { return Math.abs(a - b) < 0.015 ? 'same' : a < b ? 'A' : 'B'; }; c.set('best1', w(A.one, B.one)); c.set('best2', w(A.two, B.two));
    }
  };

  /* ================= Checkpoint 6: an order from the US ================= */
  function ratesTable(hl) {
    return '<div class="pj-rates"><div class="pj-rates-h">Example exchange rates <small>Canadian dollars for 1 unit of each currency</small></div><table><thead><tr><th>Currency</th><th>Bank buys</th><th>Bank sells</th></tr></thead><tbody>' +
      RATES.map(function (r) { return '<tr' + (r.us ? ' class="us"' : '') + '><td>' + r.c + '</td><td' + (r.us && hl === 'buy' ? ' class="hl"' : '') + '>' + r.buy.toFixed(4) + '</td><td' + (r.us && hl === 'sell' ? ' class="hl"' : '') + '>' + r.sell.toFixed(4) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  var cp6 = {
    id: 'us', title: 'An order from the US', needs: ['u1l10'],
    goal: 'A customer in the US orders from you, and a US supplier offers you a deal. Use the <b>exchange rates</b> to convert between Canadian and US dollars.',
    example: { title: 'Maple Leaf Treats goes international', scene: ratesTable(), steps: [
      { cap: 'The table shows how many <b>Canadian dollars</b> one US dollar is worth. The bank <b>buys</b> US dollars from you at $1.3610 and <b>sells</b> them to you at $1.4220.', html: '<div class="pj-x-chip">1 US$ → bank buys: $1.3610 · bank sells: $1.4220</div>' },
      { cap: 'A US customer orders 4 bottles of syrup at $9.99 (no GST on orders shipped outside Canada). They pay in US dollars, and she <b>sells</b> those to the bank — so she uses the bank’s <b>buy</b> rate.', html: eq('4 × $9.99', 39.96) },
      { cap: 'Canadian to US: <b>divide</b> by the rate. She charges the customer US$29.36.', html: eq('$39.96 ÷ 1.3610', 29.36, 'usd') },
      { cap: 'A US supplier sells 24 maple candies for US$30.00 + US$6.00 shipping = US$36.00. To pay, she <b>buys</b> US dollars from the bank — so she uses the bank’s <b>sell</b> rate.', html: '<div class="pj-x-chip">US$30.00 + US$6.00 = <b>US$36.00</b></div>' },
      { cap: 'US to Canadian: <b>multiply</b> by the rate. Then divide by 24 for the unit price: $2.13 each. Her Canadian supplier charges $1.95, so she stays in Canada.', html: eq('US$36.00 × 1.4220', 51.19) + eq('$51.19 ÷ 24', 2.13, 'money', 900) }] },
    render: function (box, c) {
      var ord = usOrder(c), deal = usDeal(c); if (ord.length < 3 || !deal) return needFirst(box, 'Finish the checkpoints before this one first.');
      box.appendChild(el('div', 'pj-ratesbox', ratesTable()));
      part(box, 'A', 'An order from Seattle, Washington', 'Orders shipped outside Canada don’t pay GST. Use your selling prices.');
      var inv = el('div', 'pj-invoice');
      inv.innerHTML = '<div class="pj-inv-h"><b>Order #' + (1000 + c.seed % 9000) + '</b><span>Ship to: Jordan P., Seattle, WA, USA</span></div>' +
        ord.map(function (o) { return '<div class="pj-inv-r"><span>' + o.p.icon + ' ' + esc(o.p.name) + '</span><span>' + o.q + ' × ' + money(price(c, o.p)) + '</span></div>'; }).join('');
      box.appendChild(inv);
      var g = el('div', 'pj-grid3');
      g.appendChild(field('Order total (CAD)', c.input('usSub', { aria: 'Order total in Canadian dollars' })));
      g.appendChild(field('Which rate?', c.choice('usRate', [{ v: 'buy', html: 'Bank buys' }, { v: 'sell', html: 'Bank sells' }], { cls: 'pj-seg', aria: 'Which rate for the order' })));
      g.appendChild(field('Charge the customer (USD)', c.input('usUsd', { kind: 'usd', aria: 'Order total in US dollars' })));
      box.appendChild(g);
      var d = deal;
      part(box, 'B', 'A deal from a US supplier', 'A supplier in the US sells <b>' + esc(d.p.name) + '</b> too. Is it cheaper than your Canadian pack (' + money(d.cadEach) + ' each)?');
      box.appendChild(el('div', 'pj-offer', '<span class="pj-pi">' + d.p.icon + '</span><div><b>' + d.n + ' ' + esc(d.p.name.toLowerCase()) + '</b> for <b>' + money(d.price, 'US$') + '</b><small>+ shipping ' + money(d.ship, 'US$') + '</small></div><span class="pj-flag">🇺🇸</span>'));
      var g2 = el('div', 'pj-grid3');
      g2.appendChild(field('Total with shipping (USD)', c.input('bTot', { kind: 'usd', aria: 'US supplier total in US dollars' })));
      g2.appendChild(field('Which rate?', c.choice('bRate', [{ v: 'buy', html: 'Bank buys' }, { v: 'sell', html: 'Bank sells' }], { cls: 'pj-seg', aria: 'Which rate for the supplier' })));
      g2.appendChild(field('Cost in CAD', c.input('bCad', { aria: 'US supplier cost in Canadian dollars' })));
      g2.appendChild(field('Cost for 1 (CAD)', c.input('bEach', { aria: 'US supplier unit price in Canadian dollars' })));
      box.appendChild(g2);
      var q = el('div', 'pj-order');
      q.appendChild(field('Which is cheaper for one?', c.choice('bCheaper', [{ v: 'us', html: '🇺🇸 US supplier' }, { v: 'ca', html: '🇨🇦 My Canadian pack' }], { cls: 'pj-seg', aria: 'Which supplier is cheaper' })));
      q.appendChild(field('Will you switch to the US supplier?', c.choice('bBuy', [{ v: 'yes', html: 'Yes' }, { v: 'no', html: 'No' }], { cls: 'pj-seg', aria: 'Switch suppliers' })));
      box.appendChild(q);
    },
    check: function (c) {
      var out = [], ord = usOrder(c), d = usDeal(c); if (ord.length < 3 || !d) return [c.msg(false, 'Finish the checkpoints before this one first.')];
      var sub = ord.reduce(function (a, o) { return a + o.q * price(c, o.p); }, 0);
      out.push(c.money('usSub', sub, { tol: 0.011, label: 'Order total', wrong: [{ v: sub * 1.05, tol: 0.05, hint: 'No GST on orders shipped outside Canada.' }, { v: ord.reduce(function (a, o) { return a + price(c, o.p); }, 0), hint: 'Multiply each price by how many they ordered, then add.' }], hint: 'Order total = (number × price) for each line, added up.', hint2: ord.map(function (o) { return o.q + ' × ' + money(price(c, o.p)); }).join(' + ') }));
      out.push(c.equals('usRate', 'buy', { label: 'Which rate (order)', hint: 'Your customer pays you in US dollars. You <b>sell</b> them to the bank, so the bank is <b>buying</b>: use the buy rate.' }));
      var subT = isNaN(c.num('usSub')) ? sub : c.num('usSub');
      out.push(c.money('usUsd', subT / USD.buy, { tol: 0.011, label: 'Charge in USD', wrong: [{ v: subT * USD.buy, tol: 0.05, hint: 'Canadian → US: <b>divide</b> by the rate (the rate is Canadian dollars for 1 US dollar).' }, { v: subT / USD.sell, tol: 0.011, hint: 'You used the sell rate. The bank is <b>buying</b> your customer’s US dollars.' }, { v: subT * USD.sell, tol: 0.05, hint: 'Use the buy rate, and <b>divide</b> to go from Canadian to US dollars.' }], hint: 'US dollars = Canadian dollars ÷ the rate.', hint2: 'Try ' + money(subT) + ' ÷ ' + USD.buy.toFixed(4) + '.' }));
      var n = usNums(d);
      out.push(c.money('bTot', n.tot, { label: 'US total', hint: 'Add the price and the shipping.', hint2: 'Add: ' + money(d.price, 'US$') + ' + ' + money(d.ship, 'US$') + '.' }));
      out.push(c.equals('bRate', 'sell', { label: 'Which rate (supplier)', hint: 'You need US dollars to pay the supplier, so the bank <b>sells</b> them to you: use the sell rate.' }));
      var totT = isNaN(c.num('bTot')) ? n.tot : c.num('bTot');
      out.push(c.money('bCad', totT * USD.sell, { tol: 0.011, label: 'Cost in CAD', wrong: [{ v: totT / USD.sell, tol: 0.05, hint: 'US → Canadian: <b>multiply</b> by the rate.' }, { v: totT * USD.buy, tol: 0.011, hint: 'You used the buy rate. The bank is <b>selling</b> you US dollars.' }, { v: totT / USD.buy, tol: 0.05, hint: 'Use the sell rate, and <b>multiply</b> to go from US to Canadian dollars.' }], hint: 'Canadian dollars = US dollars × the rate.', hint2: 'Try ' + money(totT, 'US$') + ' × ' + USD.sell.toFixed(4) + '.' }));
      var cadT = isNaN(c.num('bCad')) ? n.cad : c.num('bCad');
      out.push(c.money('bEach', cadT / d.n, { tol: 0.011, label: 'Cost for 1', wrong: [{ v: d.n / cadT, tol: 0.05, hint: 'Flip it: cost ÷ number of items.' }], hint: 'Unit price = total cost ÷ number of items.', hint2: 'Try ' + money(cadT) + ' ÷ ' + d.n + '.' }));
      out.push(c.equals('bCheaper', n.each < d.cadEach ? 'us' : 'ca', { label: 'Which is cheaper', hint: 'Compare your “cost for 1” with your Canadian unit cost (' + money(d.cadEach) + '). The smaller one is cheaper.' }));
      out.push(c.need('bBuy', { label: 'Switch?' }));
      return out;
    },
    solve: function (c) {
      var ord = usOrder(c), d = usDeal(c), sub = r2(ord.reduce(function (a, o) { return a + o.q * price(c, o.p); }, 0)), n = usNums(d);
      c.set('usSub', sub.toFixed(2)); c.set('usRate', 'buy'); c.set('usUsd', r2(sub / USD.buy).toFixed(2));
      c.set('bTot', n.tot.toFixed(2)); c.set('bRate', 'sell'); c.set('bCad', n.cad.toFixed(2)); c.set('bEach', n.each.toFixed(2)); c.set('bCheaper', n.each < d.cadEach ? 'us' : 'ca'); c.set('bBuy', 'no');
    }
  };

  /* ================= Checkpoint 7: the flyer, a reflection, hand it in ================= */
  function flyerHtml(c) {
    var ps = products(c), th = c.get('flyTheme') || 'bold', col = c.get('tagColor') || COLORS[0][0], t = shopType(c), sale = {};
    [1, 2].forEach(function (k) {
      var p = saleProd(c, k), ty = promo(c, k), a = c.get('amt.' + k); if (!p || !ty || (ty !== 'bogo' && !a)) return;
      sale[p.id] = { t: ty === 'bogo' ? 'Buy 1, get 1 ½ price' : ty === 'pct' ? a + '% off' : money(Number(a)) + ' off', now: ty === 'bogo' ? null : val(c, 'sp.' + k, dealCost(ty, Number(a), price(c, p)).one) };
    });
    var kind = t ? (t.own ? c.get('own.kind') || 'Pop-up shop' : t.name) : 'Pop-up shop';
    return '<div class="pj-flyer pj-fly-' + esc(th) + '" style="--tc:' + esc(col) + '"><div class="pj-fly-top"><div class="pj-awning"></div><div class="pj-fly-name">' + esc(shopName(c)) + '</div><div class="pj-fly-kind">' + esc(kind) + ' · Pop-up shop</div>' +
      (c.get('slogan') ? '<div class="pj-fly-slogan">“' + esc(c.get('slogan')) + '”</div>' : '') + '</div>' +
      (Object.keys(sale).length ? '<div class="pj-fly-bf">BLACK FRIDAY DEALS</div>' : '') +
      '<div class="pj-fly-list">' + ps.map(function (p) { var s = sale[p.id]; return '<div class="pj-fly-item' + (s && s.now != null ? ' on-sale' : '') + '"><span class="pj-fly-i">' + p.icon + '</span><span class="pj-fly-n">' + esc(p.name) + '</span><span class="pj-fly-p">' + (s && s.now != null ? '<s>' + money(price(c, p)) + '</s> ' + money(s.now) : money(price(c, p))) + '</span>' + (s ? '<span class="pj-fly-s">' + esc(s.t) + '</span>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="pj-fly-foot"><span>Prices plus 5% GST</span><span>🇺🇸 We ship to the USA!</span></div></div>';
  }
  var cp7 = {
    id: 'flyer', title: 'Your flyer — and hand it in', needs: [], submit: true,
    goal: 'Style your shop’s <b>flyer</b>, look back at your profits, and <b>hand in</b> your project.',
    passMsg: 'Your project has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Profit per item at Maple Leaf Treats', steps: [
      { cap: 'Your flyer is built from everything you’ve done: your name, products, prices and the sale.', html: '<div class="pj-x-mini"><b>Maple Leaf Treats</b><span>🍯 Maple syrup · $9.99</span><span>🍬 Maple fudge · $2.50 <i>20% off</i></span><span>🍪 Maple cookies · $1.49</span></div>' },
      { cap: '<b>Profit per item</b> = selling price − unit cost. Syrup: $9.99 − $6.40.', html: eq('$9.99 − $6.40', 3.59) },
      { cap: 'Fudge: $2.50 − $1.35 = $1.15. Cookies: $1.49 − $0.80 = $0.69. So <b>maple syrup</b> makes the most profit on each one she sells.', html: '<div class="pj-x-star">★ Most profit per item: maple syrup ($3.59)</div>' }] },
    render: function (box, c) {
      var ps = products(c); if (!ps.length) return needFirst(box, 'Finish the checkpoints before this one first.');
      part(box, 'A', 'Style your flyer', '');
      var row = el('div', 'pj-order');
      var prev = el('div', 'pj-flyerwrap', flyerHtml(c));
      row.appendChild(field('Style', c.choice('flyTheme', THEMES.map(function (x) { return { v: x[0], html: x[1] }; }), { cls: 'pj-seg', aria: 'Flyer style', onPick: function () { prev.innerHTML = flyerHtml(c); } })));
      row.appendChild(field('Slogan', c.text('slogan', { ph: 'e.g. Snacks that make the bell worth waiting for', max: 50, aria: 'Slogan', onInput: function () { prev.innerHTML = flyerHtml(c); } })));
      box.appendChild(row); box.appendChild(prev);
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my flyer'); pr.type = 'button'; pr.addEventListener('click', function () { PJ.print('<div class="pj-printsheet">' + flyerHtml(c) + '</div>', shopName(c) + ' flyer'); });
      if (!c.ro) box.appendChild(pr);
      part(box, 'B', 'Look back', 'Profit per item = selling price − unit cost. Use your regular prices (not the sale).');
      var tb = el('div', 'pj-profits');
      ps.forEach(function (p) { tb.appendChild(el('div', 'pj-profit-r', '<span>' + p.icon + ' ' + esc(p.name) + '</span><span>sells for <b>' + money(price(c, p)) + '</b></span><span>costs you <b>' + money(cost(c, p)) + '</b></span>')); });
      box.appendChild(tb);
      var q = el('div', 'pj-order');
      q.appendChild(field('Which product makes the most profit per item?', c.select('bestProfit', ps.map(function (p) { return { v: p.id, t: p.name }; }), { aria: 'Most profitable product' })));
      q.appendChild(field('Its profit per item', c.input('profitAmt', { aria: 'Profit per item' })));
      box.appendChild(q);
      box.appendChild(field('One thing you’d change about your shop, and why', c.text('change', { area: true, rows: 3, max: 400, ph: 'e.g. I’d order the smaller pack of chips because the big box takes too much space…', aria: 'One thing you would change' }), 'pj-wide'));
    },
    check: function (c) {
      var out = [c.need('flyTheme', { label: 'Flyer style' }), c.need('slogan', { min: 3, label: 'Slogan' })], pl = profitList(c);
      if (!pl.length) return out;
      var best = pl.reduce(function (b, x) { return !b || x.profit > b.profit ? x : b; }, null), ties = pl.filter(function (x) { return Math.abs(x.profit - best.profit) < 0.005; }).map(function (x) { return x.p.id; });
      out.push(c.equals('bestProfit', ties, { label: 'Most profit', hint: 'Work out selling price − cost for each product. Pick the biggest.' }));
      var pick = pl.filter(function (x) { return x.p.id === c.get('bestProfit'); })[0] || best;
      out.push(c.money('profitAmt', pick.profit, { label: 'Profit per item', wrong: [{ v: price(c, pick.p) + cost(c, pick.p), hint: 'Subtract the cost from the selling price — don’t add.' }], hint: 'Profit per item = selling price − unit cost.', hint2: 'Subtract: ' + money(price(c, pick.p)) + ' − ' + money(cost(c, pick.p)) + '.' }));
      out.push(c.need('change', { min: 15, label: 'What you’d change', hint: 'Write a sentence or two: what would you change, and why?' }));
      return out;
    },
    solve: function (c) {
      c.set('flyTheme', 'bold'); c.set('slogan', 'Best deals in the school');
      var pl = profitList(c), best = pl.reduce(function (b, x) { return !b || x.profit > b.profit ? x : b; }, null);
      c.set('bestProfit', best.p.id); c.set('profitAmt', best.profit.toFixed(2)); c.set('change', 'I would buy smaller packs so I do not need so much storage space.');
    }
  };

  HW.defineProject({
    id: 'u1', unit: 1, title: 'Pop-Up Shop', outcomes: ['N1'],
    tagline: 'Open your own shop: find the best deals, set your prices, run a sale and ship to the USA.',
    intro: '<div class="pj-intro-art">' + PJ.ICON + '</div><div><b>Welcome to your Pop-Up Shop!</b> You’re opening a shop for one day at the school market. In 7 checkpoints you’ll use the math from Unit 1 to run it like a real business. Your work saves as you go, so you can do a checkpoint whenever you finish your practice early. It’s due on the Unit 1 test day.</div>',
    lessonNames: { u1l3: 'Ratios', u1l4: 'Proportions', u1l5: 'Rates', u1l6: 'Unit Price', u1l7: 'Percents', u1l8: 'Markup and Sales Tax', u1l9: 'Discounts', u1l10: 'Currency Exchange' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: flyerHtml
  });
})(typeof window !== 'undefined' ? window : global);
