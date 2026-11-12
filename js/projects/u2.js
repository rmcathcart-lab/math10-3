/* Unit 2 project: Pick Your Job (Earning an Income, N2 and A1).
 * Three Alberta summer-job postings: a warehouse job (hourly wage, Alberta 8/44 overtime, a shift premium), a phone-store
 * sales job (salary + commission, a sales bonus) and tree planting (piecework, cents per seedling, a daily bonus, camp
 * costs). Students pick the job they'd apply for first (and a warehouse shift), fill two weeks of timesheets (decimal
 * hours, overtime), work out gross pay for all three jobs, make a pay stub (CPP, EI, income tax at example rates + one
 * other deduction), work backwards to a savings goal they choose, compare the jobs and write a recommendation, then
 * make a printable "My Job Offer" and hand it in. Each student's two weeks are different (from their seed and shift);
 * every answer is checked against their own numbers and choices.
 * Worked examples follow a different person: Leah, who compares a garden centre, a furniture store and a berry farm.
 * Engine: js/projects.js. Each checkpoint has solve(c), which fills in right answers (tests/projects_u2_test.js and the
 * Playwright run tests/projects_u2_e2e.py). Styles: assets/projects-u2.css (pj-u2-*), linked from here if the page
 * doesn't link it. */
(function (root) {
  'use strict';
  var HW = root.HW, PJ = HW.Projects, money = PJ.money, r2 = PJ.r2, esc = PJ.esc, pct = PJ.pct;
  var hasDoc = typeof document !== 'undefined';
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  if (hasDoc && PJ.site !== undefined && !document.querySelector('link[href*="projects-u2.css"]')) {
    var ln = document.createElement('link'); ln.rel = 'stylesheet'; ln.href = (PJ.site || '') + 'assets/projects-u2.css'; document.head.appendChild(ln);
  }

  /* ================= constants (Alberta, example rates) ================= */
  var CPP = 5.95, EI = 1.64, TAX = 15, KEEP = r2(100 - CPP - EI - TAX); // 77.41% kept
  var QUOTA = 18000, SBONUS = 150, TBONUS = 30, TLINE = 1600, CAMP = 25, TDAYS = 10, THRS = 9;
  var JOB = {
    w: { id: 'w', icon: '📦', title: 'Warehouse Associate', boss: 'Prairie Parcel Co.', place: 'Balzac, AB (just south of Airdrie)', kind: 'Hourly wage', short: 'Warehouse', color: '#2563eb', hr: 'Dana Whitford' },
    p: { id: 'p', icon: '📱', title: 'Sales Associate', boss: 'Signal Peak Mobile', place: 'Airdrie, AB', kind: 'Salary + commission', short: 'Phone store', color: '#7c3aed', hr: 'Priya Sandhu' },
    t: { id: 't', icon: '🌲', title: 'Tree Planter', boss: 'Boreal Green Reforestation', place: 'Camp near Whitecourt, AB', kind: 'Piecework', short: 'Tree planting', color: '#15803d', hr: 'Marc Gagnon' }
  };
  var JOBS = ['w', 'p', 't'];
  var REASONS = [['pay', 'I think it pays the most'], ['steady', 'Steady, predictable pay'], ['outside', 'I’d like to work outside'], ['people', 'I like working with people'], ['skills', 'I’d learn useful skills'], ['close', 'It’s close to home']];
  var GOALS = [
    { id: 'phone', icon: '📱', name: 'A new phone', price: 1149.99 },
    { id: 'ebike', icon: '🚲', name: 'An e-bike', price: 2299 },
    { id: 'pc', icon: '🎮', name: 'A gaming PC', price: 1799 },
    { id: 'trip', icon: '🏔️', name: 'A Banff trip with friends', price: 950 },
    { id: 'car', icon: '🚗', name: 'A used car', price: 5500 },
    { id: 'own', icon: '💡', name: 'My own goal', own: true }
  ];
  /* advantages and disadvantages (CP6): each belongs to one job */
  var ADV = [['w1', 'w', 'You know exactly what every hour pays'], ['w2', 'w', 'Extra hours pay time-and-a-half'], ['p1', 'p', 'The more you sell, the more you earn'], ['p2', 'p', 'The base salary comes even in a slow week'], ['t1', 't', 'Fast, hard workers can earn a lot'], ['t2', 't', 'Every tree you plant adds to your pay right away']];
  var DIS = [['w3', 'w', 'Working faster doesn’t raise your pay'], ['w4', 'w', 'Shifts can mean very early mornings or late nights'], ['p3', 'p', 'A slow week means a smaller cheque'], ['p4', 'p', 'You have to keep selling to earn more'], ['t3', 't', 'Rain or rough ground means fewer trees and less pay'], ['t4', 't', 'It only lasts a few months, and camp costs come off your pay']];
  var STYLES = [['classic', 'Classic'], ['modern', 'Modern'], ['bold', 'Bold']];
  var DAYN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  /* ================= the student's two weeks (from their seed and shift) ================= */
  function rnd(seed, k) { return (PJ.hash(seed + '|' + k) % 10000) / 10000; }
  function pick(seed, k, arr) { return arr[Math.floor(rnd(seed, k) * arr.length) % arr.length]; }
  function perm(seed, k, n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var j = n - 1; j > 0; j--) { var r = Math.floor(rnd(seed, k + j) * (j + 1)) % (j + 1), t = a[j]; a[j] = a[r]; a[r] = t; } return a; }
  function clock(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 && h < 24 ? 'pm' : 'am', h12 = h % 12 === 0 ? 12 : h % 12; return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap; }
  function hrs(row) { return (row.end - row.start - row.brk) / 60; }
  function fmtH(x) { var v = Math.round(x * 100) / 100; return String(v); }
  function dateOf(w, d) { var dt = new Date(2027, 6, 5 + w * 7 + d); return dt.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }); }
  var CACHE = {};
  function scen(c) {
    var seed = c.seed, sh = c.get('shift') === 'eve' ? 'eve' : 'day', key = seed + '|' + sh;
    if (CACHE[key]) return CACHE[key];
    var S = { shift: sh };
    // ---- warehouse ----
    var W = S.wage = pick(seed, 'wage', [16.25, 16.5, 16.75, 17, 17.25, 17.5]);
    S.dues = pick(seed, 'dues', [18.5, 21, 23.75]);
    S.prem = sh === 'eve' ? 1.75 : 1.25;
    var b0 = sh === 'eve' ? [840, 1350] : [360, 870], weeks = [[], []];
    for (var w = 0; w < 2; w++) for (var d = 0; d < 7; d++) weeks[w].push(d < 5 ? { w: w, d: d, start: b0[0], end: b0[1], brk: 30 } : { w: w, d: d, off: true });
    var p1 = perm(seed, sh + 'wk1', 5), L1 = pick(seed, sh + 'L1', [105, 120, 135, 150]), L2 = pick(seed, sh + 'L2', [30, 45, 60]), E3 = pick(seed, sh + 'E3', [15, 30]);
    var a = weeks[0][p1[0]], b = weeks[0][p1[1]], e = weeks[0][p1[2]];
    if (sh === 'eve') { a.start -= L1; } else { a.end += L1; } a.brk = 45; a.note = 'Big shipment';
    b.end += L2; e.start -= E3;
    var p2 = perm(seed, sh + 'wk2', 5), Sv = pick(seed, sh + 'Sv', [60, 90]), Lv = pick(seed, sh + 'Lv', [30, 45, 60]), Hs = pick(seed, sh + 'Hs', [390, 420, 450]);
    var s1 = weeks[1][p2[0]], s2 = weeks[1][p2[1]];
    if (sh === 'eve') s1.start += Sv; else s1.end -= Sv; s1.note = 'Appointment';
    s2.end += Lv;
    var sat = weeks[1][5], st = sh === 'eve' ? 780 : 420; sat.off = false; sat.start = st; sat.end = st + Hs + 30; sat.brk = 30; sat.sat = true; sat.note = 'Extra shift';
    S.weeks = weeks;
    S.shifts = []; weeks.forEach(function (wk) { wk.forEach(function (r) { if (!r.off) { r.h = hrs(r); r.k = 'h.' + r.w + '.' + r.d; S.shifts.push(r); } }); });
    S.tot = [0, 1].map(function (w) { return weeks[w].reduce(function (s, r) { return s + (r.off ? 0 : r.h); }, 0); });
    S.satH = sat.h;
    // ---- phone store ----
    S.rate = pick(seed, 'rate', [4, 5, 6]); S.base = { 4: 480, 5: 420, 6: 360 }[S.rate]; S.health = pick(seed, 'health', [12.4, 14.6, 16.8]);
    for (var t = 0; t < 30; t++) {
      var x1 = Math.round((5400 + rnd(seed, 's1' + t) * 6800) * 100) / 100, x2 = Math.round((5400 + rnd(seed, 's2' + t) * 6800) * 100) / 100;
      if (Math.abs(x1 + x2 - QUOTA) >= 450 || t === 29) { S.sales = [x1, x2]; break; }
    }
    S.pShifts = pick(seed, 'psh', [9, 10]); S.pHrs = S.pShifts * 7.5;
    // ---- tree planting ----
    S.r1 = pick(seed, 'r1', [0.12, 0.13, 0.14]); S.r2 = r2(S.r1 + pick(seed, 'r2', [0.03, 0.04, 0.05]));
    var rough = {}, pr = perm(seed, 'rough', TDAYS), nr = pick(seed, 'nr', [3, 4]);
    for (var q = 0; q < nr; q++) rough[pr[q]] = 1;
    S.days = []; var T0 = pick(seed, 't0', [760, 820, 880, 940, 1000]), TS = pick(seed, 'ts', [85, 100, 115, 130]);
    for (var i = 0; i < TDAYS; i++) {
      var n = T0 + i * TS + (rnd(seed, 'tn' + i) - 0.5) * 300; if (rough[i]) n *= 0.82;
      n = Math.max(650, Math.min(2300, Math.round(n / 5) * 5)); if (Math.abs(n - TLINE) < 15) n = TLINE + 25;
      S.days.push({ i: i, n: n, rough: !!rough[i] });
    }
    if (!S.days.some(function (d) { return d.n >= TLINE; })) { var top = S.days.filter(function (d) { return !d.rough; }).pop() || S.days[TDAYS - 1]; top.n = TLINE + 20 + Math.round(rnd(seed, 'tb') * 20) * 5; }
    S.tHrs = TDAYS * THRS;
    return (CACHE[key] = S);
  }
  function val(c, k, fb) { var x = c.num(k); return isNaN(x) ? fb : x; }
  PJ.u2 = { scen: scen, JOB: JOB, GOALS: GOALS };

  /* ---- expected values, each one built on the student's own earlier answers (falling back to the right value) ---- */
  // checkpoint 2: hours and overtime
  function shiftH(c, r) { return val(c, r.k, r.h); }
  function weekTot(c, S, w) { return S.weeks[w].reduce(function (s, r) { return s + (r.off ? 0 : shiftH(c, r)); }, 0); }
  function dailyOT(c, S, w) { return S.weeks[w].reduce(function (s, r) { return s + (r.off ? 0 : Math.max(0, shiftH(c, r) - 8)); }, 0); }
  function wTot(c, S, w) { return val(c, 'tot.' + w, weekTot(c, S, w)); }
  function weeklyOT(c, S, w) { return Math.max(0, wTot(c, S, w) - 44); }
  function otWeek(c, S, w) { return Math.max(val(c, 'dot.' + w, dailyOT(c, S, w)), val(c, 'wot.' + w, weeklyOT(c, S, w))); }
  function otW(c, S, w) { return val(c, 'ot.' + w, otWeek(c, S, w)); }
  function allHrs(c, S) { return wTot(c, S, 0) + wTot(c, S, 1); }
  function allOT(c, S) { return otW(c, S, 0) + otW(c, S, 1); }
  // checkpoint 3: gross pay
  function wParts(c, S) {
    var reg = val(c, 'w.reg', allHrs(c, S) - allOT(c, S)), ot = val(c, 'w.oth', allOT(c, S)), rate = val(c, 'w.otr', 1.5 * S.wage);
    var premH = S.shift === 'eve' ? allHrs(c, S) : val(c, S.weeks[1][5].k, S.satH);
    var o = { reg: reg, oth: ot, otr: rate, regPay: r2(reg * S.wage), otPay: r2(ot * rate), premH: premH, prem: r2(premH * S.prem) };
    o.rp = val(c, 'w.rp', o.regPay); o.op = val(c, 'w.op', o.otPay); o.pp = val(c, 'w.pp', o.prem); o.gross = r2(o.rp + o.op + o.pp);
    return o;
  }
  function pParts(c, S) {
    var sales = r2(S.sales[0] + S.sales[1]), st = val(c, 'p.sales', sales), com = r2(st * S.rate / 100), cm = val(c, 'p.com', com), bonus = sales > QUOTA ? SBONUS : 0, bn = val(c, 'p.bon', bonus);
    return { sales: sales, st: st, com: com, cm: cm, bonus: bonus, bn: bn, gross: r2(S.base + cm + bn) };
  }
  function tParts(c, S) {
    var easy = 0, rough = 0, nb = 0;
    S.days.forEach(function (d) { if (d.rough) rough += d.n; else easy += d.n; if (d.n >= TLINE) nb++; });
    var e = val(c, 't.easy', easy), r = val(c, 't.rough', rough), pe = r2(e * S.r1), prr = r2(r * S.r2);
    var o = { easy: easy, rough: rough, nb: nb, pe: pe, pr: prr, bonus: nb * TBONUS };
    o.ep = val(c, 't.ep', pe); o.rpay = val(c, 't.rp', prr); o.bp = val(c, 't.bon', o.bonus); o.gross = r2(o.ep + o.rpay + o.bp);
    return o;
  }
  function grossExp(c, j) { var S = scen(c); return j === 'w' ? wParts(c, S).gross : j === 'p' ? pParts(c, S).gross : tParts(c, S).gross; }
  function gross(c, j) { return val(c, j + '.gross', grossExp(c, j)); }
  // checkpoint 4: deductions
  function other(c, j) { var S = scen(c); return j === 'w' ? S.dues : j === 'p' ? S.health : CAMP * TDAYS; }
  function otherName(j) { return j === 'w' ? 'Union dues' : j === 'p' ? 'Health plan' : 'Camp costs'; }
  function otherNote(c, j) { var S = scen(c); return j === 'w' ? money(S.dues) + ' each pay' : j === 'p' ? money(S.health) + ' each pay' : money(CAMP) + ' × ' + TDAYS + ' planting days'; }
  function ded(c, j) {
    var g = gross(c, j), o = { g: g, cpp: r2(g * CPP / 100), ei: r2(g * EI / 100), tax: r2(g * TAX / 100), oth: other(c, j) };
    o.total = r2(o.cpp + o.ei + o.tax + o.oth);
    if (firstJob(c) === j) { o.tcpp = val(c, 'cpp.' + j, o.cpp); o.tei = val(c, 'ei.' + j, o.ei); o.ttax = val(c, 'tax.' + j, o.tax); o.toth = val(c, 'oth.' + j, o.oth); o.totalT = r2(o.tcpp + o.tei + o.ttax + o.toth); }
    else o.totalT = o.total;
    o.td = val(c, 'td.' + j, o.totalT); o.net = r2(g - o.td);
    return o;
  }
  function net(c, j) { return val(c, 'net.' + j, ded(c, j).net); }
  function firstJob(c) { var f = c.get('first'); return JOB[f] ? f : 'w'; }
  // checkpoint 5: the goal
  function goal(c) {
    var g = GOALS.filter(function (x) { return x.id === c.get('goal'); })[0]; if (!g) return null;
    if (g.own) { var p = c.num('goalPrice'); return { id: 'own', icon: g.icon, name: String(c.get('goalName') || 'My goal').trim() || 'My goal', price: isNaN(p) ? 0 : p, own: true }; }
    return g;
  }
  function hoursPer(c, j) { var S = scen(c); return j === 'w' ? allHrs(c, S) : j === 'p' ? S.pHrs : S.tHrs; }
  function takeJob(c) { var t = c.get('take'); return JOB[t] ? t : firstJob(c); }

  /* ================= small view helpers ================= */
  function part(box, letter, title, sub) { var h = el('div', 'pj-part', '<span class="pj-part-l">' + letter + '</span><div><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'); box.appendChild(h); return h; }
  function field(label, node, cls) { var f = el('div', 'pj-field' + (cls ? ' ' + cls : '')); f.appendChild(el('span', 'pj-fl', label)); f.appendChild(node); return f; }
  function needFirst(box, text) { box.appendChild(el('div', 'pj-empty', text)); }
  function jobHead(j, extra) { var J = JOB[j]; return '<div class="pj-ph pj-u2-jh" style="--jc:' + J.color + '"><span class="pj-pi">' + J.icon + '</span><b>' + J.title + '</b><span class="pj-u2-boss">' + J.boss + '</span>' + (extra || '') + '</div>'; }
  function eq(left, right, fmt, delay) { return '<div class="pj-xeq">' + left + ' = <b><span class="pj-count" data-to="' + right + '" data-fmt="' + (fmt || 'money') + '"' + (delay ? ' data-delay="' + delay + '"' : '') + '>' + (fmt === 'pct' ? pct(right) : fmt === 'num' ? fmtH(right) : money(right)) + '</span></b></div>'; }
  function cents(x) { return Math.round(x * 100) + '¢'; }
  function payRule(c, j) {
    var S = scen(c);
    if (j === 'w') return money(S.wage) + '/h · overtime 1.5× · ' + (S.shift === 'eve' ? 'evening premium +' + money(S.prem) + '/h' : 'Saturday premium +' + money(S.prem) + '/h');
    if (j === 'p') return money(S.base) + ' salary every 2 weeks + ' + S.rate + '% commission · ' + money(SBONUS) + ' bonus over ' + money(QUOTA).replace('.00', '') + ' in sales';
    return cents(S.r1) + ' per tree (easy ground) · ' + cents(S.r2) + ' (rough ground) · ' + money(TBONUS) + ' bonus for a ' + TLINE.toLocaleString('en-CA') + '-tree day';
  }

  /* ================= Checkpoint 1: the job board ================= */
  function posting(c, j) {
    var S = scen(c), J = JOB[j], body;
    if (j === 'w') body = '<div class="pj-u2-pay"><b>' + money(S.wage) + '</b> an hour</div><ul class="pj-u2-list"><li>Pick, pack and load parcels (training on the pallet jack)</li><li>Full-time all summer, Monday to Friday, some Saturdays</li><li>Overtime paid at <b>1.5×</b> (Alberta rules: over 8 h a day or 44 h a week)</li><li>Union job: dues of ' + money(S.dues) + ' each pay</li></ul>';
    else if (j === 'p') body = '<div class="pj-u2-pay"><b>' + money(S.base).replace('.00', '') + '</b> every 2 weeks <span>+ ' + S.rate + '% commission</span></div><ul class="pj-u2-list"><li>Help customers choose phones, plans and cases</li><li>' + S.pShifts + ' shifts of 7.5 h every two weeks, some evenings and weekends</li><li><b>' + S.rate + '%</b> of everything you sell, plus a <b>' + money(SBONUS).replace('.00', '') + ' bonus</b> when you sell over ' + money(QUOTA).replace('.00', '') + ' in a pay period</li><li>Health plan: ' + money(S.health) + ' each pay</li></ul>';
    else body = '<div class="pj-u2-pay"><b>' + cents(S.r1) + '</b> per tree <span>(' + cents(S.r2) + ' on rough ground)</span></div><ul class="pj-u2-list"><li>Plant spruce and pine seedlings in cut blocks</li><li>Camp life: 10 planting days every two weeks, about ' + THRS + ' h a day</li><li>A <b>' + money(TBONUS).replace('.00', '') + ' bonus</b> for every day you plant ' + TLINE.toLocaleString('en-CA') + ' trees or more</li><li>Camp costs (meals and camp): ' + money(CAMP) + ' a planting day, taken off your pay</li></ul>';
    return '<div class="pj-u2-post-h"><span class="pj-u2-pi">' + J.icon + '</span><div><div class="pj-u2-kind">' + J.kind + '</div><h4>' + J.title + '</h4><div class="pj-u2-boss">' + J.boss + ' · ' + J.place + '</div></div></div>' + body;
  }
  var cp1 = {
    id: 'board', title: 'Pick a job to apply for', needs: [], graded: false,
    goal: 'Read the <b>three job postings</b>, choose the one you’d apply for first, and make a guess: which one pays the most?',
    example: { title: 'Leah looks for a summer job', steps: [
      { cap: 'Meet <b>Leah</b>. She’s looking for a summer job near Cochrane, and three postings catch her eye. Each one pays in a different way.', html: '<div class="pj-u2-x-posts"><span style="--i:0">🌷 Garden centre<small>$16.00 an hour</small></span><span style="--i:1">🛋️ Furniture store<small>$400 + 3% commission</small></span><span style="--i:2">🍓 Berry farm<small>$3.50 per flat picked</small></span></div>' },
      { cap: 'Those are the three ways to earn: an <b>hourly wage</b> (paid for time), <b>commission</b> (paid for sales) and <b>piecework</b> (paid for each thing you finish).', html: '<div class="pj-u2-x-ways"><span>⏱️ <b>Wage</b> = hours × rate</span><span>💳 <b>Commission</b> = % of sales</span><span>🧺 <b>Piecework</b> = pieces × rate</span></div>' },
      { cap: 'Before she picks, she asks three questions about each job.', html: '<ol class="pj-u2-x-q"><li>How is the pay worked out?</li><li>Will I get about the same pay every time?</li><li>Are there extras, like overtime, a bonus or tips?</li></ol>' },
      { cap: 'She’ll apply to the garden centre first: she likes being outside, and every hour pays the same. But she’ll do the math on all three before she decides!', html: '<div class="pj-x-star">★ First choice: 🌷 Garden centre</div>' }] },
    render: function (box, c) {
      part(box, 'A', 'The job board', 'Three real-looking Alberta summer jobs. Read each posting carefully: your pay in this project comes from them.');
      var board = el('div', 'pj-u2-board'), f = c.get('first');
      JOBS.forEach(function (j) {
        var card = el('div', 'pj-u2-post' + (f === j ? ' is-first' : '')); card.style.setProperty('--jc', JOB[j].color);
        card.appendChild(el('div', 'pj-u2-post-in', posting(c, j)));
        if (j === 'w') {
          var sh = el('div', 'pj-u2-shift');
          sh.appendChild(el('div', 'pj-fl', 'Which crew would you join?'));
          sh.appendChild(c.choice('shift', [{ v: 'day', html: '🌅 <b>Day crew</b><small>6:00 am to 2:30 pm · +$1.25/h on Saturdays</small>' }, { v: 'eve', html: '🌙 <b>Evening crew</b><small>2:00 pm to 10:30 pm · +$1.75/h for every hour</small>' }], { cls: 'pj-u2-shiftc', aria: 'Warehouse crew', onPick: function () { c.redraw(); } }));
          card.appendChild(sh);
        }
        var fc = c.choice('first', [{ v: j, html: f === j ? '★ My first choice' : '☆ Apply here first' }], { cls: 'pj-u2-firstc', aria: 'Apply to ' + JOB[j].title + ' first', onPick: function () { c.redraw(); } });
        card.appendChild(fc);
        board.appendChild(card);
      });
      box.appendChild(board);
      part(box, 'B', 'Why that one?', 'Pick your main reason. There’s no wrong answer.');
      box.appendChild(c.select('why1', REASONS.map(function (x) { return { v: x[0], t: x[1] }; }), { aria: 'Main reason for your first choice' }));
      part(box, 'C', 'Make a guess', 'For the same two weeks of work, which job do you think will give you the <b>most money</b>? You’ll find out in Checkpoint 6.');
      box.appendChild(c.choice('guess', JOBS.map(function (j) { return { v: j, html: JOB[j].icon + ' ' + JOB[j].short }; }), { cls: 'pj-seg', aria: 'Your guess: which job pays the most' }));
    },
    check: function (c) {
      return [c.msg(!!JOB[c.get('first')], 'Choose the job you’d apply for first (the ☆ button on a posting).'), c.msg(!!c.get('shift'), 'Pick a crew for the warehouse job (day or evening).'),
        c.need('why1', { label: 'Your reason' }), c.need('guess', { label: 'Your guess' })];
    },
    solve: function (c) { if (!c.get('shift')) c.set('shift', 'day'); if (!c.get('first')) c.set('first', 'w'); c.set('why1', 'steady'); c.set('guess', 't'); }
  };

  /* ================= Checkpoint 2: timesheets and overtime ================= */
  function shiftChecks(c, r) {
    var len = (r.end - r.start) / 60, h = r.h, w = [{ v: len, hint: 'Take off the <b>unpaid break</b> (' + r.brk + ' min).' }];
    var fr = h % 1; if (fr > 0.01) w.push({ v: Math.floor(h) + Math.round(fr * 60) / 100, hint: Math.round(fr * 60) + ' minutes is ' + Math.round(fr * 60) + ' ÷ 60 = <b>' + fmtH(fr) + ' h</b>, not 0.' + Math.round(fr * 60) + '. Change minutes to hours by dividing by 60.' });
    w.push({ v: len - r.brk / 100, hint: 'A ' + r.brk + '-minute break is ' + r.brk + ' ÷ 60 = <b>' + fmtH(r.brk / 60) + ' h</b>, not 0.' + r.brk + '.' });
    if (r.start < 720 && r.end > 720) { var bad = Math.abs((r.end - 720) - r.start) / 60; w.push({ v: bad - r.brk / 60, hint: 'This shift goes past <b>noon</b>. Count from the start to 12:00, then add the time after 12:00.' }); w.push({ v: bad, hint: 'This shift goes past <b>noon</b>. Count from the start to 12:00, then add the time after 12:00.' }); }
    var lab = DAYN[r.d] + ' ' + dateOf(r.w, r.d);
    return c.number(r.k, h, { tol: 0.005, label: lab, wrong: w, hint: 'Hours = end − start − unpaid break, in decimal hours.', hint2: 'From ' + clock(r.start) + ' to ' + clock(r.end) + ' is ' + Math.floor((r.end - r.start) / 60) + ' h ' + ((r.end - r.start) % 60) + ' min. Take off ' + r.brk + ' min, then divide the minutes by 60.' });
  }
  var cp2 = {
    id: 'time', title: 'Timesheets and overtime', needs: ['u2l1', 'u2l3'],
    goal: 'Fill in your <b>warehouse timesheet</b> for two weeks: the hours for each shift (as a decimal), each week’s total, and your <b>overtime</b> using Alberta’s 8-or-44 rule.',
    example: { title: 'One long Tuesday at the garden centre', scene: '<div class="pj-u2-x-row"><b>Tue</b><span>In <b>7:45 am</b></span><span>Out <b>5:30 pm</b></span><span>Unpaid lunch <b>30 min</b></span></div>', steps: [
      { cap: 'The shift goes past noon, so count in two pieces. First, from 7:45 am up to 12:00 noon.', html: '<div class="pj-x-chip">7:45 am → 12:00 = <b>4 h 15 min</b></div>' },
      { cap: 'Then from 12:00 noon to 5:30 pm. Add the pieces: 4 h 15 min + 5 h 30 min = 9 h 45 min.', html: '<div class="pj-x-chip">12:00 → 5:30 pm = <b>5 h 30 min</b> · total <b>9 h 45 min</b></div>' },
      { cap: 'Her lunch is <b>unpaid</b>, so take it off: 9 h 45 min − 30 min = 9 h 15 min.', html: '<div class="pj-x-chip">9 h 45 min − 30 min = <b>9 h 15 min</b></div>' },
      { cap: 'Timesheets use <b>decimal hours</b>. Divide the minutes by 60: 15 ÷ 60 = 0.25. So she worked 9.25 h.', html: eq('15 min ÷ 60', 0.25, 'num') + eq('9 h + 0.25 h', 9.25, 'num', 900) },
      { cap: 'In Alberta, hours over <b>8 in a day</b> are overtime: 9.25 − 8 = 1.25 h. That was her only long day, so her <b>daily overtime</b> for the week is 1.25 h.', html: eq('9.25 − 8', 1.25, 'num') },
      { cap: 'Her week added up to 46.5 h. Hours over <b>44 in a week</b> are overtime too: 46.5 − 44 = 2.5 h. Alberta uses <b>whichever is bigger</b>, so she gets 2.5 h of overtime (not both added).', html: '<table class="pj-x-tbl"><tr><th>Daily overtime</th><th>Weekly overtime</th><th>Overtime hours</th></tr><tr><td>1.25 h</td><td>46.5 − 44 = 2.5 h</td><td class="win">2.5 h (the bigger one)</td></tr></table>' }] },
    render: function (box, c) {
      var S = scen(c);
      box.appendChild(el('p', 'pj-tip', '<b>Hours = end − start − unpaid break.</b> Write hours as decimals: 15 min = 0.25 h, 30 min = 0.5 h, 45 min = 0.75 h. You’re on the <b>' + (S.shift === 'eve' ? 'evening' : 'day') + ' crew</b> at ' + money(S.wage) + '/h.'));
      [0, 1].forEach(function (w) {
        var card = el('div', 'pj-prod pj-u2-tsbox');
        card.appendChild(el('div', 'pj-u2-ts-h', '<span class="pj-u2-ts-k">Prairie Parcel Co. · Timesheet</span><b>Week ' + (w + 1) + '</b><span>' + dateOf(w, 0) + ' to ' + dateOf(w, 6) + ', 2027</span>'));
        var tb = el('div', 'pj-u2-ts');
        tb.appendChild(el('div', 'pj-u2-ts-r pj-u2-ts-hd', '<span>Day</span><span>In</span><span>Out</span><span>Unpaid break</span><span>Hours worked</span><span></span>'));
        S.weeks[w].forEach(function (r) {
          var row = el('div', 'pj-u2-ts-r' + (r.off ? ' is-off' : ''));
          row.appendChild(el('span', 'pj-u2-ts-d', '<b>' + DAYN[r.d] + '</b> <small>' + dateOf(r.w, r.d) + '</small>'));
          if (r.off) { row.appendChild(el('span', 'pj-u2-ts-off', 'Day off')); tb.appendChild(row); return; }
          row.appendChild(el('span', 'pj-u2-ts-t', clock(r.start)));
          row.appendChild(el('span', 'pj-u2-ts-t', clock(r.end)));
          row.appendChild(el('span', 'pj-u2-ts-t', r.brk + ' min'));
          var bar = el('span', 'pj-u2-bar');
          function drawBar() { var v = c.num(r.k); bar.innerHTML = isNaN(v) || v <= 0 ? '' : '<i style="width:' + Math.min(100, v / 12 * 100).toFixed(1) + '%"></i>' + (v > 8 ? '<i class="ot" style="left:' + (8 / 12 * 100).toFixed(1) + '%;width:' + Math.min(100 - 8 / 12 * 100, (v - 8) / 12 * 100).toFixed(1) + '%"></i>' : '') + '<em style="left:' + (8 / 12 * 100).toFixed(1) + '%"></em>'; }
          row.appendChild(c.input(r.k, { kind: 'num', ph: 'h', aria: 'Hours worked ' + DAYN[r.d] + ' week ' + (w + 1), cls: 'pj-u2-hin', onInput: drawBar }));
          drawBar(); row.appendChild(bar);
          if (r.note) row.appendChild(el('span', 'pj-u2-ts-note', r.note));
          tb.appendChild(row);
        });
        var tr = el('div', 'pj-u2-ts-r pj-u2-ts-tot'); tr.appendChild(el('span', '', '<b>Total</b>')); tr.appendChild(el('span', 'pj-u2-ts-sp', 'Add up the hours for the week'));
        tr.appendChild(c.input('tot.' + w, { kind: 'num', ph: 'h', aria: 'Total hours week ' + (w + 1), cls: 'pj-u2-hin' })); tb.appendChild(tr);
        card.appendChild(tb);
        var ot = el('div', 'pj-u2-ot');
        ot.appendChild(el('div', 'pj-u2-ot-k', '⏱️ Overtime this week'));
        var g = el('div', 'pj-grid3');
        g.appendChild(field('Daily overtime <small>(over 8 h a day, added)</small>', c.input('dot.' + w, { kind: 'num', ph: 'h', aria: 'Daily overtime week ' + (w + 1) })));
        g.appendChild(field('Weekly overtime <small>(over 44 h)</small>', c.input('wot.' + w, { kind: 'num', ph: 'h', aria: 'Weekly overtime week ' + (w + 1) })));
        g.appendChild(field('<b>Overtime hours</b> <small>(the bigger one)</small>', c.input('ot.' + w, { kind: 'num', ph: 'h', aria: 'Overtime hours week ' + (w + 1) })));
        ot.appendChild(g); card.appendChild(ot);
        box.appendChild(card);
      });
    },
    check: function (c) {
      var S = scen(c), out = [c.msg(!!c.get('shift'), 'Go back to Checkpoint 1 and pick a warehouse crew.')];
      S.shifts.forEach(function (r) { out.push(shiftChecks(c, r)); });
      [0, 1].forEach(function (w) {
        var lab = 'Week ' + (w + 1), tot = weekTot(c, S, w), t = wTot(c, S, w), dot = dailyOT(c, S, w), wot = Math.max(0, t - 44), signed = S.weeks[w].reduce(function (s, r) { return s + (r.off ? 0 : shiftH(c, r) - 8); }, 0);
        out.push(c.number('tot.' + w, tot, { tol: 0.005, label: lab + ' total', hint: 'Add up the hours worked on every day of week ' + (w + 1) + '.', hint2: 'Add: ' + S.weeks[w].filter(function (r) { return !r.off; }).map(function (r) { return fmtH(shiftH(c, r)); }).join(' + ') + '.' }));
        out.push(c.number('dot.' + w, dot, { tol: 0.005, label: lab + ' daily overtime', wrong: [{ v: signed, hint: 'Only count days <b>over</b> 8 hours. A short day doesn’t take anything away: it just has 0 overtime.' }, { v: S.weeks[w].filter(function (r) { return !r.off && shiftH(c, r) > 8; }).length, hint: 'That’s how many days went over 8. Add up the <b>hours</b> over 8 on those days.' }],
          hint: 'For each day, hours over 8 = hours − 8 (or 0 if the day was 8 h or less). Add them up.', hint2: S.weeks[w].filter(function (r) { return !r.off && shiftH(c, r) > 8; }).map(function (r) { return DAYN[r.d] + ': ' + fmtH(shiftH(c, r)) + ' − 8'; }).join(', ') || 'No day was over 8 hours: type 0.' }));
        out.push(c.number('wot.' + w, wot, { tol: 0.005, label: lab + ' weekly overtime', wrong: [{ v: t - 40, hint: 'In Alberta the weekly limit is <b>44 hours</b>, not 40.' }, { v: t - 44, hint: 'This week is under 44 hours, so there’s <b>no</b> weekly overtime: type 0.' }],
          hint: 'Weekly overtime = total hours − 44 (or 0 if the total is 44 or less).', hint2: wot > 0 ? 'Try ' + fmtH(t) + ' − 44.' : fmtH(t) + ' is not more than 44: type 0.' }));
        var d1 = val(c, 'dot.' + w, dot), w1 = val(c, 'wot.' + w, wot);
        out.push(c.number('ot.' + w, Math.max(d1, w1), { tol: 0.005, label: lab + ' overtime hours', wrong: [{ v: d1 + w1, hint: 'Don’t add them. Alberta uses <b>whichever is bigger</b>: daily or weekly.' }, { v: Math.min(d1, w1), hint: 'Use the <b>bigger</b> one: it gives you more overtime.' }], hint: 'Overtime hours = the bigger of your daily and weekly overtime.' }));
      });
      return out;
    },
    solve: function (c) {
      var S = scen(c); S.shifts.forEach(function (r) { c.set(r.k, fmtH(r.h)); });
      [0, 1].forEach(function (w) { var t = weekTot(c, S, w), d = dailyOT(c, S, w), x = Math.max(0, t - 44); c.set('tot.' + w, fmtH(t)); c.set('dot.' + w, fmtH(d)); c.set('wot.' + w, fmtH(x)); c.set('ot.' + w, fmtH(Math.max(d, x))); });
    }
  };

  /* ================= Checkpoint 3: gross pay for each job ================= */
  var cp3 = {
    id: 'gross', title: 'Gross pay for each job', needs: ['u2l2', 'u2l3', 'u2l4', 'u2l5', 'u2l6'],
    goal: 'Work out your <b>gross pay</b> (before deductions) for the same two weeks at <b>all three jobs</b>: overtime, commission, piecework, and the extras each one pays.',
    example: { title: 'Leah’s two weeks at three jobs', steps: [
      { cap: '<b>Garden centre</b> ($16.00/h): she worked 82.5 h, and 2.5 h were overtime. Regular hours = 82.5 − 2.5 = 80 h. Regular pay = hours × wage.', html: eq('80 h × $16.00', 1280) },
      { cap: 'Overtime rate = 1.5 × wage = 1.5 × $16.00 = $24.00. Overtime pay = overtime hours × overtime rate.', html: eq('1.5 × $16.00', 24) + eq('2.5 h × $24.00', 60, 'money', 900) },
      { cap: 'Her extra: a <b>shift premium</b> of $1.00/h on her 8 Saturday hours. Gross pay = regular + overtime + premium.', html: eq('8 h × $1.00', 8) + eq('$1,280 + $60 + $8', 1348, 'money', 900) },
      { cap: '<b>Furniture store</b>: $400 salary + 3% commission. She sold $21,500, so commission = 0.03 × $21,500. She also sold over $20,000, so she gets the $50 bonus.', html: eq('0.03 × $21,500', 645) + eq('$400 + $645 + $50', 1095, 'money', 900) },
      { cap: '<b>Berry farm</b>: piecework at $3.50 per flat. She picked 310 flats. (If a rate is in cents, change it to dollars first: 35¢ = $0.35.)', html: eq('310 × $3.50', 1085) },
      { cap: 'For the same two weeks: garden centre $1,348, furniture store $1,095, berry farm $1,085. But that’s <b>before</b> deductions. That’s next!', html: '<table class="pj-x-tbl"><tr><th>Job</th><th>Gross pay</th></tr><tr><td>🌷 Garden centre</td><td class="win">$1,348.00</td></tr><tr><td>🛋️ Furniture store</td><td>$1,095.00</td></tr><tr><td>🍓 Berry farm</td><td>$1,085.00</td></tr></table>' }] },
    render: function (box, c) {
      var S = scen(c);
      box.appendChild(el('p', 'pj-tip', 'Gross pay is all the money you earn before anything is taken off. Round money to the nearest cent. Use the calculator at the top if you need it.'));
      // A: warehouse
      var a = el('div', 'pj-prod pj-u2-job'); a.style.setProperty('--jc', JOB.w.color);
      a.innerHTML = '<div class="pj-u2-jl">A</div>' + jobHead('w', '<span class="pj-cost">' + payRule(c, 'w') + '</span>');
      a.appendChild(el('div', 'pj-u2-facts', '<span>From your timesheets: <b>' + fmtH(allHrs(c, S)) + ' h</b> worked</span><span><b>' + fmtH(allOT(c, S)) + ' h</b> overtime</span>' + (S.shift === 'eve' ? '<span>🌙 Evening crew: premium on <b>every</b> hour</span>' : '<span>🌅 Day crew: premium on Saturday hours (<b>' + fmtH(val(c, S.weeks[1][5].k, S.satH)) + ' h</b>)</span>')));
      var g = el('div', 'pj-grid3');
      g.appendChild(field('Regular hours', c.input('w.reg', { kind: 'num', ph: 'h', aria: 'Warehouse regular hours' })));
      g.appendChild(field('Overtime hours', c.input('w.oth', { kind: 'num', ph: 'h', aria: 'Warehouse overtime hours' })));
      g.appendChild(field('Overtime rate ($/h)', c.input('w.otr', { aria: 'Warehouse overtime rate' })));
      a.appendChild(g);
      var g2 = el('div', 'pj-grid3');
      g2.appendChild(field('Regular pay', c.input('w.rp', { aria: 'Warehouse regular pay' })));
      g2.appendChild(field('Overtime pay', c.input('w.op', { aria: 'Warehouse overtime pay' })));
      g2.appendChild(field('Shift premium pay', c.input('w.pp', { aria: 'Warehouse shift premium pay' })));
      g2.appendChild(field('<b>Gross pay</b>', c.input('w.gross', { aria: 'Warehouse gross pay', cls: 'pj-u2-big' })));
      a.appendChild(g2); box.appendChild(a);
      // B: phone store
      var b = el('div', 'pj-prod pj-u2-job'); b.style.setProperty('--jc', JOB.p.color);
      b.innerHTML = '<div class="pj-u2-jl">B</div>' + jobHead('p', '<span class="pj-cost">' + payRule(c, 'p') + '</span>');
      var sales = r2(S.sales[0] + S.sales[1]);
      b.appendChild(el('div', 'pj-u2-sales', '<div class="pj-u2-sales-h">📈 Your sales report</div><div class="pj-u2-sales-r"><span>Week 1</span><b>' + money(S.sales[0]) + '</b></div><div class="pj-u2-sales-r"><span>Week 2</span><b>' + money(S.sales[1]) + '</b></div>' +
        '<div class="pj-u2-quota"><i style="width:' + Math.min(100, sales / 24000 * 100).toFixed(1) + '%"></i><em style="left:' + (QUOTA / 24000 * 100).toFixed(1) + '%"><span>Bonus line ' + money(QUOTA).replace('.00', '') + '</span></em></div>'));
      var g3 = el('div', 'pj-grid3');
      g3.appendChild(field('Total sales', c.input('p.sales', { aria: 'Total sales for two weeks' })));
      g3.appendChild(field('Commission (' + S.rate + '%)', c.input('p.com', { aria: 'Commission' })));
      g3.appendChild(field('Sales bonus <small>($' + SBONUS + ' or $0)</small>', c.input('p.bon', { aria: 'Sales bonus' })));
      g3.appendChild(field('<b>Gross pay</b>', c.input('p.gross', { aria: 'Phone store gross pay', cls: 'pj-u2-big' })));
      b.appendChild(g3); box.appendChild(b);
      // C: tree planting
      var t = el('div', 'pj-prod pj-u2-job'); t.style.setProperty('--jc', JOB.t.color);
      t.innerHTML = '<div class="pj-u2-jl">C</div>' + jobHead('t', '<span class="pj-cost">' + payRule(c, 't') + '</span>');
      var tal = el('div', 'pj-u2-tally');
      tal.appendChild(el('div', 'pj-u2-tally-h', '🌲 Your tree tally <small>(a ★ day is ' + TLINE.toLocaleString('en-CA') + ' trees or more)</small>'));
      var grid = el('div', 'pj-u2-tally-g');
      S.days.forEach(function (d) { grid.appendChild(el('div', 'pj-u2-tday' + (d.rough ? ' rough' : '') + (d.n >= TLINE ? ' star' : ''), '<span>Day ' + (d.i + 1) + '</span><b>' + d.n.toLocaleString('en-CA') + '</b><small>' + (d.rough ? '⛰️ rough' : '🌱 easy') + '</small>')); });
      tal.appendChild(grid); t.appendChild(tal);
      var g4 = el('div', 'pj-grid3');
      g4.appendChild(field('Trees on easy ground', c.input('t.easy', { kind: 'num', ph: 'trees', aria: 'Trees on easy ground' })));
      g4.appendChild(field('Pay for easy ground', c.input('t.ep', { aria: 'Pay for easy ground' })));
      g4.appendChild(field('Trees on rough ground', c.input('t.rough', { kind: 'num', ph: 'trees', aria: 'Trees on rough ground' })));
      g4.appendChild(field('Pay for rough ground', c.input('t.rp', { aria: 'Pay for rough ground' })));
      g4.appendChild(field('Daily bonuses', c.input('t.bon', { aria: 'Tree planting bonuses' })));
      g4.appendChild(field('<b>Gross pay</b>', c.input('t.gross', { aria: 'Tree planting gross pay', cls: 'pj-u2-big' })));
      t.appendChild(g4); box.appendChild(t);
    },
    check: function (c) {
      var S = scen(c), out = [], T = allHrs(c, S), OT = allOT(c, S), W = S.wage;
      // A
      var wp = wParts(c, S);
      out.push(c.number('w.reg', T - OT, { tol: 0.005, label: 'Regular hours', wrong: [{ v: T, hint: 'Regular hours = total hours − overtime hours. Take the overtime out.' }], hint: 'Regular hours = total hours (both weeks) − overtime hours (both weeks).', hint2: 'Try ' + fmtH(T) + ' − ' + fmtH(OT) + '.' }));
      out.push(c.number('w.oth', OT, { tol: 0.005, label: 'Overtime hours', hint: 'Add your overtime hours from week 1 and week 2.', hint2: 'Try ' + fmtH(otW(c, S, 0)) + ' + ' + fmtH(otW(c, S, 1)) + '.' }));
      out.push(c.money('w.otr', 1.5 * W, { label: 'Overtime rate', wrong: [{ v: W + 1.5, hint: 'Time-and-a-half means <b>1.5 × the wage</b>, not the wage + $1.50.' }, { v: 2 * W, hint: 'That’s double time. Alberta overtime is <b>1.5 ×</b> the wage.' }, { v: 0.5 * W, hint: 'That’s only the extra half. The overtime rate is the whole 1.5 × the wage.' }], hint: 'Overtime rate = 1.5 × wage.', hint2: 'Try 1.5 × ' + money(W) + '.' }));
      out.push(c.money('w.rp', wp.reg * W, { label: 'Regular pay', wrong: [{ v: T * W, hint: 'Use your <b>regular</b> hours only. The overtime hours get paid at the overtime rate.' }], hint: 'Regular pay = regular hours × wage.', hint2: 'Try ' + fmtH(wp.reg) + ' × ' + money(W) + '.' }));
      out.push(c.money('w.op', wp.oth * wp.otr, { label: 'Overtime pay', wrong: [{ v: wp.oth * W, hint: 'Overtime hours are paid at the <b>overtime rate</b> (1.5 × wage), not the regular wage.' }, { v: wp.oth * W * 0.5, hint: 'Overtime pay = overtime hours × the whole overtime rate.' }], hint: 'Overtime pay = overtime hours × overtime rate.', hint2: 'Try ' + fmtH(wp.oth) + ' × ' + money(wp.otr) + '.' }));
      var premW = S.shift === 'eve' ? [{ v: wp.reg * S.prem, hint: 'The evening premium is paid on <b>every</b> hour, overtime hours too.' }, { v: wp.oth * S.prem, hint: 'The evening premium is paid on <b>every</b> hour you worked.' }] : [{ v: T * S.prem, hint: 'Only your <b>Saturday</b> hours get the weekend premium.' }, { v: S.prem, hint: 'Multiply the premium by your Saturday hours.' }];
      out.push(c.money('w.pp', wp.premH * S.prem, { label: 'Shift premium', wrong: premW, hint: 'Shift premium pay = premium hours × ' + money(S.prem) + '.', hint2: 'Try ' + fmtH(wp.premH) + ' × ' + money(S.prem) + '.' }));
      out.push(c.money('w.gross', wp.rp + wp.op + wp.pp, { tol: 0.011, label: 'Warehouse gross pay', wrong: [{ v: wp.rp + wp.op, hint: 'Add the shift premium too.' }, { v: wp.rp + wp.pp, hint: 'Add the overtime pay too.' }], hint: 'Gross pay = regular pay + overtime pay + shift premium.', hint2: 'Add: ' + money(wp.rp) + ' + ' + money(wp.op) + ' + ' + money(wp.pp) + '.' }));
      // B
      var pp = pParts(c, S);
      out.push(c.money('p.sales', pp.sales, { label: 'Total sales', hint: 'Add the two weeks of sales.', hint2: 'Add: ' + money(S.sales[0]) + ' + ' + money(S.sales[1]) + '.' }));
      out.push(c.money('p.com', pp.st * S.rate / 100, { label: 'Commission', wrong: [{ v: pp.st * S.rate / 100 + S.base, hint: 'That includes the salary. The commission is just the ' + S.rate + '% part.' }, { v: pp.st / S.rate, tol: 1, hint: 'Don’t divide: ' + S.rate + '% of the sales = sales × ' + (S.rate / 100) + '.' }], hint: 'Commission = ' + S.rate + '% of sales = sales × ' + (S.rate / 100) + '.', hint2: 'Try ' + money(pp.st) + ' × ' + (S.rate / 100) + '.' }));
      out.push(c.money('p.bon', pp.bonus, { label: 'Sales bonus', wrong: pp.bonus ? [{ v: 0, hint: 'You sold more than ' + money(QUOTA).replace('.00', '') + ', so you earn the ' + money(SBONUS) + ' bonus.' }] : [{ v: SBONUS, hint: 'Your sales were <b>under</b> ' + money(QUOTA).replace('.00', '') + ', so there’s no bonus this time: type 0.' }], hint: 'The bonus is ' + money(SBONUS) + ' if total sales are over ' + money(QUOTA).replace('.00', '') + ', otherwise $0.' }));
      out.push(c.money('p.gross', S.base + pp.cm + pp.bn, { tol: 0.011, label: 'Phone store gross pay', wrong: [{ v: pp.cm + pp.bn, hint: 'Add the base salary (' + money(S.base) + ') too.' }, { v: S.base + pp.cm, hint: pp.bn ? 'Add the bonus too.' : 'Gross pay = salary + commission + bonus.' }], hint: 'Gross pay = salary + commission + bonus.', hint2: 'Add: ' + money(S.base) + ' + ' + money(pp.cm) + ' + ' + money(pp.bn) + '.' }));
      // C
      var tp = tParts(c, S);
      out.push(c.number('t.easy', tp.easy, { label: 'Trees on easy ground', wrong: [{ v: tp.easy + tp.rough, hint: 'That’s all the trees. Add only the 🌱 <b>easy</b> days.' }], hint: 'Add the trees from the 🌱 easy days only.' }));
      out.push(c.money('t.ep', val(c, 't.easy', tp.easy) * S.r1, { label: 'Pay for easy ground', wrong: [{ v: val(c, 't.easy', tp.easy) * S.r1 * 100, tol: 1, hint: 'The rate is in <b>cents</b>. Change it to dollars first: ' + cents(S.r1) + ' = ' + money(S.r1) + '.' }], hint: 'Pay = trees × rate per tree (' + money(S.r1) + ').', hint2: 'Try ' + val(c, 't.easy', tp.easy) + ' × ' + S.r1 + '.' }));
      out.push(c.number('t.rough', tp.rough, { label: 'Trees on rough ground', wrong: [{ v: tp.easy + tp.rough, hint: 'That’s all the trees. Add only the ⛰️ <b>rough</b> days.' }], hint: 'Add the trees from the ⛰️ rough days only.' }));
      out.push(c.money('t.rp', val(c, 't.rough', tp.rough) * S.r2, { label: 'Pay for rough ground', wrong: [{ v: val(c, 't.rough', tp.rough) * S.r2 * 100, tol: 1, hint: 'Change cents to dollars first: ' + cents(S.r2) + ' = ' + money(S.r2) + '.' }, { v: val(c, 't.rough', tp.rough) * S.r1, hint: 'Rough ground pays the higher rate: ' + cents(S.r2) + ' a tree.' }], hint: 'Pay = trees × rate per tree (' + money(S.r2) + ').', hint2: 'Try ' + val(c, 't.rough', tp.rough) + ' × ' + S.r2 + '.' }));
      out.push(c.money('t.bon', tp.bonus, { label: 'Daily bonuses', wrong: [{ v: (tp.nb + 1) * TBONUS, hint: 'Count the ★ days again: only days with ' + TLINE.toLocaleString('en-CA') + ' trees or more.' }, { v: Math.max(0, tp.nb - 1) * TBONUS, hint: 'Count the ★ days again: a day with exactly ' + TLINE.toLocaleString('en-CA') + ' or more counts.' }, { v: TBONUS, hint: 'That’s one bonus. Multiply by the number of ★ days.' }], hint: 'Bonuses = number of ★ days × ' + money(TBONUS) + '.', hint2: 'You had ' + tp.nb + ' ★ day' + (tp.nb === 1 ? '' : 's') + '.' }));
      out.push(c.money('t.gross', tp.ep + tp.rpay + tp.bp, { tol: 0.011, label: 'Tree planting gross pay', wrong: [{ v: tp.ep + tp.rpay, hint: 'Add the bonuses too.' }], hint: 'Gross pay = easy-ground pay + rough-ground pay + bonuses.', hint2: 'Add: ' + money(tp.ep) + ' + ' + money(tp.rpay) + ' + ' + money(tp.bp) + '.' }));
      return out;
    },
    solve: function (c) {
      var S = scen(c), T = allHrs(c, S), OT = allOT(c, S), W = S.wage;
      c.set('w.reg', fmtH(T - OT)); c.set('w.oth', fmtH(OT)); c.set('w.otr', (1.5 * W).toFixed(3).replace(/0$/, ''));
      var wp = wParts(c, S); c.set('w.rp', wp.regPay.toFixed(2)); c.set('w.op', wp.otPay.toFixed(2)); c.set('w.pp', wp.prem.toFixed(2)); c.set('w.gross', r2(wp.regPay + wp.otPay + wp.prem).toFixed(2));
      var pp = pParts(c, S); c.set('p.sales', pp.sales.toFixed(2)); c.set('p.com', pp.com.toFixed(2)); c.set('p.bon', pp.bonus.toFixed(2)); c.set('p.gross', r2(S.base + pp.com + pp.bonus).toFixed(2));
      var tp = tParts(c, S); c.set('t.easy', String(tp.easy)); c.set('t.ep', tp.pe.toFixed(2)); c.set('t.rough', String(tp.rough)); c.set('t.rp', tp.pr.toFixed(2)); c.set('t.bon', tp.bonus.toFixed(2)); c.set('t.gross', r2(tp.pe + tp.pr + tp.bonus).toFixed(2));
    }
  };

  /* ================= Checkpoint 4: deductions and a pay stub ================= */
  function stubBar(c, j) {
    var d = ded(c, j), g = d.g || 1, nv = c.num('net.' + j), tv = c.num('td.' + j);
    if (isNaN(nv) || isNaN(tv)) return '<div class="pj-u2-gbar"><i class="net" style="width:100%"></i><span>Gross ' + money(d.g) + '</span></div>';
    var np = Math.max(0, Math.min(100, nv / g * 100));
    return '<div class="pj-u2-gbar"><i class="net" style="width:' + np.toFixed(1) + '%"></i><i class="ded" style="width:' + (100 - np).toFixed(1) + '%"></i><span>You keep ' + money(nv) + '</span><span class="r">Deductions ' + money(tv) + '</span></div>';
  }
  function earnLines(c, j) {
    var S = scen(c);
    if (j === 'w') { var wp = wParts(c, S); return [['Regular pay', fmtH(wp.reg) + ' h × ' + money(S.wage), wp.rp], ['Overtime pay', fmtH(wp.oth) + ' h × ' + money(wp.otr), wp.op], [S.shift === 'eve' ? 'Evening premium' : 'Saturday premium', fmtH(wp.premH) + ' h × ' + money(S.prem), wp.pp]]; }
    if (j === 'p') { var pp = pParts(c, S); return [['Salary', '2 weeks', S.base], ['Commission', S.rate + '% of ' + money(pp.st), pp.cm], ['Sales bonus', pp.bn ? 'over ' + money(QUOTA).replace('.00', '') : 'not this time', pp.bn]]; }
    var tp = tParts(c, S); return [['Easy ground', val(c, 't.easy', tp.easy).toLocaleString('en-CA') + ' × ' + cents(S.r1), tp.ep], ['Rough ground', val(c, 't.rough', tp.rough).toLocaleString('en-CA') + ' × ' + cents(S.r2), tp.rpay], ['Daily bonuses', '★ days × ' + money(TBONUS), tp.bp]];
  }
  var cp4 = {
    id: 'stub', title: 'Deductions and your pay stub', needs: ['u2l7'],
    goal: 'Take off the <b>deductions</b> (CPP, EI, income tax and one more) to find your <b>net pay</b>: a full pay stub for your first-choice job, and the net pay for the other two.',
    example: { title: 'Leah’s garden centre pay stub', scene: '<div class="pj-x-cost">🌷 Gross pay <b>$1,348.00</b> · uniform $12.00 each pay</div>', steps: [
      { cap: '<b>Gross pay</b> is what you earn. <b>Net pay</b> is what you take home after <b>deductions</b>. We’ll use these example rates: CPP 5.95%, EI 1.64% and income tax 15%.', html: '<div class="pj-x-chip">5.95% → 0.0595 · 1.64% → 0.0164 · 15% → 0.15</div>' },
      { cap: '<b>CPP</b> (Canada Pension Plan) = 5.95% of gross. $80.206 rounds to $80.21.', html: eq('$1,348.00 × 0.0595', 80.21) },
      { cap: '<b>EI</b> (Employment Insurance) = 1.64% of gross.', html: eq('$1,348.00 × 0.0164', 22.11) },
      { cap: '<b>Income tax</b> (our example rate) = 15% of gross.', html: eq('$1,348.00 × 0.15', 202.2) },
      { cap: 'Add every deduction, including her $12.00 uniform.', html: eq('$80.21 + $22.11 + $202.20 + $12.00', 316.52) },
      { cap: 'Net pay = gross − total deductions. She takes home $1,031.48 ÷ $1,348.00 × 100 = 76.5% of what she earned.', html: eq('$1,348.00 − $316.52', 1031.48) + eq('$1,031.48 ÷ $1,348.00 × 100', 76.5, 'pct', 900) }] },
    render: function (box, c) {
      var f = firstJob(c), J = JOB[f], d = ded(c, f);
      box.appendChild(el('p', 'pj-tip', 'Example rates: <b>CPP 5.95%</b>, <b>EI 1.64%</b>, <b>income tax 15%</b> of gross pay. (Real pay stubs use the government’s tables, with yearly limits, so real numbers are a bit different.) Round each deduction to the nearest cent.'));
      part(box, 'A', 'Your pay stub: ' + J.icon + ' ' + J.short, 'Your first-choice job. The earnings come from your Checkpoint 3 answers.');
      var stub = el('div', 'pj-u2-stub'); stub.style.setProperty('--jc', J.color);
      stub.appendChild(el('div', 'pj-u2-stub-h', '<div><b>' + J.boss + '</b><span>' + J.place + '</span></div><div class="r"><b>PAY STATEMENT</b><span>Pay period: ' + dateOf(0, 0) + ' to ' + dateOf(1, 6) + ', 2027</span></div>'));
      var cols = el('div', 'pj-u2-stub-c');
      var earn = el('div', 'pj-u2-stub-e', '<div class="pj-u2-stub-k">Earnings</div>' + earnLines(c, f).map(function (x) { return '<div class="pj-u2-sl"><span>' + x[0] + '<small>' + x[1] + '</small></span><b>' + money(x[2]) + '</b></div>'; }).join('') + '<div class="pj-u2-sl tot"><span>Gross pay</span><b>' + money(d.g) + '</b></div>');
      cols.appendChild(earn);
      var dd = el('div', 'pj-u2-stub-d'); dd.appendChild(el('div', 'pj-u2-stub-k', 'Deductions'));
      var bar = el('div', 'pj-u2-gbarw', stubBar(c, f));
      function upd() { bar.innerHTML = stubBar(c, f); }
      [['cpp', 'CPP (5.95%)'], ['ei', 'EI (1.64%)'], ['tax', 'Income tax (15%)'], ['oth', otherName(f) + ' <small>' + otherNote(c, f) + '</small>']].forEach(function (x) {
        var r = el('div', 'pj-u2-sl in'); r.appendChild(el('span', '', x[1])); r.appendChild(c.input(x[0] + '.' + f, { aria: x[1].replace(/<[^>]+>/g, '') + ' for ' + J.short, onInput: upd })); dd.appendChild(r);
      });
      var rt = el('div', 'pj-u2-sl in tot'); rt.appendChild(el('span', '', 'Total deductions')); rt.appendChild(c.input('td.' + f, { aria: 'Total deductions for ' + J.short, onInput: upd })); dd.appendChild(rt);
      cols.appendChild(dd); stub.appendChild(cols);
      var nr = el('div', 'pj-u2-stub-n'); nr.appendChild(el('span', '', '<b>NET PAY</b> <small>gross − total deductions</small>')); nr.appendChild(c.input('net.' + f, { aria: 'Net pay for ' + J.short, cls: 'pj-u2-big', onInput: upd })); stub.appendChild(nr);
      stub.appendChild(bar);
      box.appendChild(stub);
      box.appendChild(field('What percent of your gross pay do you take home? <small>(net ÷ gross × 100)</small>', c.input('keep.' + f, { kind: 'pct', aria: 'Percent of gross you take home' }), 'pj-u2-narrow'));
      part(box, 'B', 'The other two jobs', 'Same rates. Work out each deduction on your calculator, then add them up.');
      var g = el('div', 'pj-u2-others');
      JOBS.filter(function (j) { return j !== f; }).forEach(function (j) {
        var dj = ded(c, j), card = el('div', 'pj-prod pj-u2-mini'); card.style.setProperty('--jc', JOB[j].color);
        card.innerHTML = jobHead(j) + '<div class="pj-u2-facts"><span>Gross pay <b>' + money(dj.g) + '</b></span><span>' + otherName(j) + ': <b>' + otherNote(c, j) + '</b></span></div>';
        var gg = el('div', 'pj-grid3');
        gg.appendChild(field('Total deductions', c.input('td.' + j, { aria: 'Total deductions for ' + JOB[j].short })));
        gg.appendChild(field('Net pay', c.input('net.' + j, { aria: 'Net pay for ' + JOB[j].short })));
        card.appendChild(gg); g.appendChild(card);
      });
      box.appendChild(g);
    },
    check: function (c) {
      var f = firstJob(c), out = [];
      JOBS.forEach(function (j) {
        var d = ded(c, j), g = d.g, lab = JOB[j].short;
        if (j === f) {
          out.push(c.money('cpp.' + j, g * CPP / 100, { label: 'CPP', wrong: [{ v: g * CPP, tol: 1, hint: 'Change 5.95% to a decimal first: <b>0.0595</b>.' }, { v: g * 0.595, tol: 0.1, hint: '5.95% is <b>0.0595</b>, not 0.595.' }, { v: g - g * CPP / 100, tol: 0.05, hint: 'That’s what’s left after CPP. CPP is just the 5.95% part: gross × 0.0595.' }], hint: 'CPP = gross × 0.0595.', hint2: 'Try ' + money(g) + ' × 0.0595.' }));
          out.push(c.money('ei.' + j, g * EI / 100, { label: 'EI', wrong: [{ v: g * 0.164, tol: 0.1, hint: '1.64% is <b>0.0164</b>, not 0.164.' }, { v: g * EI, tol: 1, hint: 'Change 1.64% to a decimal first: <b>0.0164</b>.' }], hint: 'EI = gross × 0.0164.', hint2: 'Try ' + money(g) + ' × 0.0164.' }));
          out.push(c.money('tax.' + j, g * TAX / 100, { label: 'Income tax', wrong: [{ v: g * 0.015, tol: 0.05, hint: '15% is <b>0.15</b>, not 0.015.' }, { v: g * 0.85, tol: 0.05, hint: 'That’s 85% of your pay. The tax is the 15% part: gross × 0.15.' }], hint: 'Income tax = gross × 0.15.', hint2: 'Try ' + money(g) + ' × 0.15.' }));
          out.push(c.money('oth.' + j, d.oth, { label: otherName(j), wrong: j === 't' ? [{ v: CAMP, hint: 'Camp costs are ' + money(CAMP) + ' for <b>each</b> of your ' + TDAYS + ' planting days.' }] : [], hint: otherName(j) + ': ' + otherNote(c, j) + '.' }));
          out.push(c.money('td.' + j, d.totalT, { tol: 0.011, label: 'Total deductions', wrong: [{ v: d.totalT - d.toth, hint: 'Add the ' + otherName(j).toLowerCase() + ' too.' }], hint: 'Total deductions = CPP + EI + income tax + ' + otherName(j).toLowerCase() + '.', hint2: 'Add: ' + money(d.tcpp) + ' + ' + money(d.tei) + ' + ' + money(d.ttax) + ' + ' + money(d.toth) + '.' }));
          out.push(c.money('net.' + j, g - d.td, { tol: 0.011, label: 'Net pay', wrong: [{ v: g + d.td, hint: 'Subtract the deductions from the gross: don’t add them.' }, { v: d.td, hint: 'That’s the deductions. Net pay = gross − deductions.' }], hint: 'Net pay = gross pay − total deductions.', hint2: 'Try ' + money(g) + ' − ' + money(d.td) + '.' }));
          var nv = val(c, 'net.' + j, g - d.td);
          out.push(c.pct('keep.' + j, g ? nv / g * 100 : 0, { label: 'Take-home percent', wrong: [{ v: g ? d.td / g * 100 : 0, tol: 0.2, hint: 'That’s the percent taken <b>off</b>. You want the part you keep: net ÷ gross × 100.' }, { v: g ? g / nv * 100 : 0, tol: 0.2, hint: 'Flip it: <b>net ÷ gross</b> × 100.' }], hint: 'Percent you keep = net pay ÷ gross pay × 100.', hint2: 'Try ' + money(nv) + ' ÷ ' + money(g) + ' × 100.' }));
        } else {
          out.push(c.money('td.' + j, d.total, { tol: 0.03, label: lab + ' total deductions', wrong: [{ v: d.total - d.oth, tol: 0.03, hint: 'Add the ' + otherName(j).toLowerCase() + ' (' + otherNote(c, j) + ') too.' }, { v: d.oth, hint: 'Add CPP, EI and income tax too.' }, { v: g * (CPP + EI + TAX), tol: 5, hint: 'Change the percents to decimals: 5.95% = 0.0595, 1.64% = 0.0164, 15% = 0.15.' }], hint: 'Total deductions = CPP + EI + income tax + ' + otherName(j).toLowerCase() + '.', hint2: 'CPP ' + money(d.cpp) + ' + EI ' + money(d.ei) + ' + tax ' + money(d.tax) + ' + ' + money(d.oth) + '.' }));
          out.push(c.money('net.' + j, g - d.td, { tol: 0.011, label: lab + ' net pay', wrong: [{ v: g + d.td, hint: 'Subtract the deductions: don’t add them.' }], hint: 'Net pay = gross pay − total deductions.', hint2: 'Try ' + money(g) + ' − ' + money(d.td) + '.' }));
        }
      });
      return out;
    },
    solve: function (c) {
      var f = firstJob(c);
      JOBS.forEach(function (j) {
        var d = ded(c, j);
        if (j === f) { c.set('cpp.' + j, d.cpp.toFixed(2)); c.set('ei.' + j, d.ei.toFixed(2)); c.set('tax.' + j, d.tax.toFixed(2)); c.set('oth.' + j, d.oth.toFixed(2)); }
        c.set('td.' + j, d.total.toFixed(2)); c.set('net.' + j, r2(d.g - d.total).toFixed(2));
        if (j === f) c.set('keep.' + j, (r2(d.g - d.total) / d.g * 100).toFixed(1));
      });
    }
  };

  /* ================= Checkpoint 5: working backwards to a goal ================= */
  function thermo(c, G) {
    var f = firstJob(c), n = net(c, f), p = G > 0 ? Math.min(100, n / G * 100) : 0;
    return '<div class="pj-u2-thermo"><div class="pj-u2-th-t"><i style="height:' + p.toFixed(1) + '%"></i></div><div><b>One pay at the ' + JOB[f].short.toLowerCase() + ' (' + money(n) + ' take-home)</b> gets you <b>' + Math.round(p) + '%</b> of the way to ' + money(G) + '.</div></div>';
  }
  var cp5 = {
    id: 'goal', title: 'Work backwards to a goal', needs: ['u2l8'],
    goal: 'Pick something to <b>save up for</b>, then work backwards: how much gross pay you need, and how many <b>hours</b>, <b>trees</b> or <b>sales</b> that takes at each job.',
    example: { title: 'Leah saves for a used dirt bike', scene: '<div class="pj-x-cost">🏍️ Used dirt bike · <b>$2,400.00</b></div>', steps: [
      { cap: 'After CPP, EI and tax, Leah keeps 100% − 5.95% − 1.64% − 15% of what she earns.', html: eq('100% − 5.95% − 1.64% − 15%', 77.41, 'pct') },
      { cap: 'So <b>net = gross × 0.7741</b>. To work backwards, do the opposite: <b>gross = net ÷ 0.7741</b>. She needs $2,400 take-home.', html: eq('$2,400 ÷ 0.7741', 3100.37) },
      { cap: 'Garden centre: gross = wage × hours, so <b>hours = gross ÷ wage</b>. That’s 193.77… h. Round <b>up</b>: with 193 h she’d be a little short.', html: eq('$3,100.37 ÷ $16.00', 193.77, 'num') + '<div class="pj-x-chip pj-x-nice" style="margin-left:8px">Round up: <b>194 h</b></div>' },
      { cap: 'Check it by putting the answer back in: 194 h × $16.00 × 0.7741 = $2,402.81. That’s at least $2,400 ✓', html: eq('194 × $16.00 × 0.7741', 2402.81) },
      { cap: 'Furniture store: commission = 0.03 × sales, so sales = commission ÷ 0.03. Berry farm: flats = pay ÷ $3.50 = 885.8…, so 886 flats.', html: eq('$3,100.37 ÷ 0.03', 103345.67) + eq('$3,100.37 ÷ $3.50', 885.82, 'num', 900) }] },
    render: function (box, c) {
      var S = scen(c);
      part(box, 'A', 'What are you saving for?', 'Pick one (prices include GST), or make up your own.');
      box.appendChild(c.choice('goal', GOALS.map(function (g) { return { v: g.id, html: '<span class="pj-ti">' + g.icon + '</span><b>' + esc(g.name) + '</b><small>' + (g.own ? 'You choose' : money(g.price)) + '</small>' }; }), { cls: 'pj-types pj-u2-goals', aria: 'Savings goal', onPick: function () { c.redraw(); } }));
      var G = goal(c); if (!G) return;
      if (G.own) {
        var og = el('div', 'pj-grid3');
        og.appendChild(field('What is it?', c.text('goalName', { ph: 'e.g. A snowboard and pass', max: 36, aria: 'Your own goal' })));
        og.appendChild(field('Price (with GST)', c.input('goalPrice', { aria: 'Price of your goal', onInput: function () { var t = box.querySelector('.pj-u2-thermo'); if (t) t.outerHTML = thermo(c, goal(c).price); } })));
        box.appendChild(og);
      }
      box.appendChild(el('div', 'pj-u2-thermow', thermo(c, G.price)));
      part(box, 'B', 'How much gross pay do you need?', 'Use the example rates: CPP 5.95%, EI 1.64%, income tax 15%. For this part, forget the other deductions.');
      var g1 = el('div', 'pj-grid3');
      g1.appendChild(field('Percent of gross you keep', c.input('keepPct', { kind: 'pct', aria: 'Percent of gross you keep' })));
      g1.appendChild(field('Gross pay needed <small>(net ÷ the decimal)</small>', c.input('gNeed', { aria: 'Gross pay needed' })));
      box.appendChild(g1);
      part(box, 'C', 'How much work is that?', 'Rearrange each pay formula. Round <b>up</b> so you have enough.');
      var cards = el('div', 'pj-u2-back');
      function card(j, rule, k, lab, kind, ph) { var cd = el('div', 'pj-prod pj-u2-mini'); cd.style.setProperty('--jc', JOB[j].color); cd.innerHTML = jobHead(j) + '<div class="pj-u2-rule">' + rule + '</div>'; cd.appendChild(field(lab, c.input(k, { kind: kind, ph: ph, aria: lab }))); cards.appendChild(cd); return cd; }
      var wc = card('w', 'pay = ' + money(S.wage) + ' × hours <span>→ hours = pay ÷ ' + money(S.wage) + '</span>', 'bk.w', 'Hours at the regular wage (whole hours)', 'num', 'hours');
      var chk = el('div', 'pj-u2-verify'); wc.appendChild(chk);
      function drawChk() { var h = c.num('bk.w'), G2 = goal(c); if (isNaN(h) || !G2 || !G2.price) { chk.innerHTML = 'Check it: hours × ' + money(S.wage) + ' × 0.7741 should be at least your goal.'; return; } var v = r2(h * S.wage * KEEP / 100); chk.innerHTML = 'Check: ' + fmtH(h) + ' × ' + money(S.wage) + ' × 0.7741 = <b>' + money(v) + '</b> ' + (v >= G2.price - 0.005 ? '<span class="ok">enough ✓</span>' : '<span class="no">not enough</span>'); }
      wc.querySelector('[data-f="bk.w"] input') && wc.querySelector('[data-f="bk.w"] input').addEventListener('input', drawChk); drawChk();
      card('t', 'pay = ' + money(S.r1) + ' × trees <span>(easy ground)</span>', 'bk.t', 'Trees on easy ground (whole trees)', 'num', 'trees');
      card('p', 'commission = ' + (S.rate / 100) + ' × sales <span>(save only your commission)</span>', 'bk.p', 'Sales needed (to the next dollar)', 'money');
      box.appendChild(cards);
      var f = firstJob(c);
      part(box, 'D', 'How long would it take?', 'At your first-choice job (' + JOB[f].icon + ' ' + JOB[f].short + '), if every pay were like your first one (' + money(net(c, f)) + ' take-home) and you saved all of it.');
      box.appendChild(field('Number of pay periods (whole number)', c.input('periods', { kind: 'num', ph: 'pays', aria: 'Number of pay periods' }), 'pj-u2-narrow'));
    },
    check: function (c) {
      var S = scen(c), G = goal(c), out = [c.msg(!!G, 'Pick something to save for (Part A).')]; if (!G) return out;
      if (G.own) { out.push(c.need('goalName', { min: 2, label: 'Your goal' })); var gp = c.num('goalPrice'); out.push(c.need('goalPrice', { label: 'Price' })); if (c.has('goalPrice')) out.push(c.msg(!isNaN(gp) && gp >= 100 && gp <= 25000, 'Type a price between $100 and $25,000 for your goal.')); if (isNaN(gp) || gp < 100 || gp > 25000) return out; }
      var P = G.price;
      out.push(c.pct('keepPct', KEEP, { label: 'Percent you keep', wrong: [{ v: CPP + EI + TAX, tol: 0.02, hint: 'That’s the part taken <b>off</b>. You keep 100% minus that.' }, { v: 100 - TAX, tol: 0.02, hint: 'Take off CPP and EI too, not just the tax.' }], hint: 'Percent you keep = 100% − 5.95% − 1.64% − 15%.' }));
      out.push(c.money('gNeed', P / (KEEP / 100), { tol: 0.011, label: 'Gross pay needed', wrong: [{ v: P * KEEP / 100, tol: 0.02, hint: 'You multiplied. You need <b>more</b> than your goal before deductions, so <b>divide</b> by 0.7741.' }, { v: P * (1 + (CPP + EI + TAX) / 100), tol: 0.02, hint: 'Adding 22.59% isn’t enough (22.59% of the bigger gross is more). Work backwards: gross = net ÷ 0.7741.' }, { v: P / KEEP, tol: 0.02, hint: 'Use the percent as a decimal: <b>0.7741</b>.' }], hint: 'net = gross × 0.7741, so gross = net ÷ 0.7741.', hint2: 'Try ' + money(P) + ' ÷ 0.7741.' }));
      var gn = val(c, 'gNeed', P / (KEEP / 100));
      var hx = gn / S.wage, hUp = Math.ceil(hx - 1e-9);
      out.push(c.number('bk.w', hUp, { label: 'Warehouse hours', wrong: [{ v: hx, tol: 0.01, hint: 'Round <b>up</b> to a whole number of hours.' }, { v: Math.floor(hx + 1e-9), hint: 'Round <b>up</b>, not down: with one hour less you’d be short.' }, { v: Math.ceil(P / S.wage - 1e-9), tol: 1, hint: 'Use the <b>gross</b> pay you need, not the goal: deductions come off first.' }, { v: gn * S.wage, tol: 1, hint: 'hours = pay ÷ wage. Divide, don’t multiply.' }], hint: 'hours = gross pay needed ÷ wage, rounded up.', hint2: 'Try ' + money(gn) + ' ÷ ' + money(S.wage) + ', then round up.' }));
      var tx = gn / S.r1, tUp = Math.ceil(tx - 1e-9);
      out.push(c.number('bk.t', tUp, { label: 'Trees', wrong: [{ v: tx, tol: 0.01, hint: 'Round <b>up</b> to a whole number of trees.' }, { v: Math.floor(tx + 1e-9), hint: 'Round <b>up</b>, not down.' }, { v: gn / (S.r1 * 100), tol: 1, hint: 'Change cents to dollars first: ' + cents(S.r1) + ' = ' + money(S.r1) + '.' }, { v: Math.ceil(P / S.r1 - 1e-9), tol: 1, hint: 'Use the <b>gross</b> pay you need, not the goal.' }], hint: 'trees = gross pay needed ÷ ' + money(S.r1) + ', rounded up.', hint2: 'Try ' + money(gn) + ' ÷ ' + S.r1 + ', then round up.' }));
      var sx = gn / (S.rate / 100);
      out.push(c.number('bk.p', sx + 0.495, { tol: 0.506, label: 'Sales needed', wrong: [{ v: gn / S.rate, tol: 1, hint: 'Use ' + S.rate + '% as a decimal: <b>' + (S.rate / 100) + '</b>.' }, { v: gn * S.rate / 100, tol: 0.6, hint: 'commission = ' + (S.rate / 100) + ' × sales, so sales = commission ÷ ' + (S.rate / 100) + '. Divide, don’t multiply.' }, { v: P / (S.rate / 100), tol: 1, hint: 'Use the <b>gross</b> pay you need, not the goal.' }, { v: Math.floor(sx), tol: 0.4, hint: 'Round <b>up</b> to the next dollar.' }], hint: 'sales = gross pay needed ÷ ' + (S.rate / 100) + ' (round up to the next dollar).', hint2: 'Try ' + money(gn) + ' ÷ ' + (S.rate / 100) + '.' }));
      var f = firstJob(c), n = net(c, f), px = P / n;
      out.push(c.number('periods', Math.ceil(px - 1e-9), { label: 'Pay periods', wrong: [{ v: Math.floor(px + 1e-9), hint: 'Round <b>up</b>: after that many pays you wouldn’t quite have enough.' }, { v: px, tol: 0.01, hint: 'Round up to a whole number of pay periods.' }, { v: Math.ceil(P / gross(c, f) - 1e-9), hint: 'Use your <b>net</b> pay (what you take home), not your gross.' }, { v: Math.ceil(gn / n - 1e-9), hint: 'Divide your goal (' + money(P) + ') by your net pay. The net pay already has the deductions taken off.' }], hint: 'pay periods = goal ÷ net pay per pay, rounded up.', hint2: 'Try ' + money(P) + ' ÷ ' + money(n) + ', then round up.' }));
      return out;
    },
    solve: function (c) {
      var S = scen(c); if (!c.get('goal')) c.set('goal', 'ebike'); var G = goal(c);
      if (G.own) { if (!c.get('goalName')) c.set('goalName', 'Snowboard'); if (!c.has('goalPrice')) c.set('goalPrice', '850'); G = goal(c); }
      c.set('keepPct', String(KEEP)); var gn = r2(G.price / (KEEP / 100)); c.set('gNeed', gn.toFixed(2));
      c.set('bk.w', String(Math.ceil(gn / S.wage - 1e-9))); c.set('bk.t', String(Math.ceil(gn / S.r1 - 1e-9))); c.set('bk.p', String(Math.ceil(gn / (S.rate / 100) - 1e-9)));
      c.set('periods', String(Math.ceil(G.price / net(c, firstJob(c)) - 1e-9)));
    }
  };

  /* ================= Checkpoint 6: compare and recommend ================= */
  function perHr(c, j) { return net(c, j) / hoursPer(c, j); }
  function best(list) { var m = Math.max.apply(null, list.map(function (x) { return x.v; })); return list.filter(function (x) { return Math.abs(x.v - m) < 0.005; }).map(function (x) { return x.j; }); }
  var cp6 = {
    id: 'compare', title: 'Compare the jobs', needs: ['u2l4', 'u2l5', 'u2l7'],
    onPass: function (c) { if (c.redraw) c.redraw(); },
    goal: 'Put the three jobs side by side: which pays the <b>most</b>, which pays the most <b>per hour</b>, which is <b>steadiest</b>, and the good and bad of each. Then <b>recommend</b> one.',
    example: { title: 'Leah lines up her three offers', steps: [
      { cap: 'Leah lists the <b>net pay</b> (take-home) from each job for the same two weeks, and the hours each one took.', html: '<table class="pj-x-tbl"><tr><th>Job</th><th>Net pay</th><th>Hours</th></tr><tr><td>🌷 Garden centre</td><td class="win">$1,031.48</td><td>82.5 h</td></tr><tr><td>🛋️ Furniture store</td><td>$847.64</td><td>64 h</td></tr><tr><td>🍓 Berry farm</td><td>$839.90</td><td>80 h</td></tr></table>' },
      { cap: 'Most money isn’t the whole story. <b>Net pay per hour</b> = net pay ÷ hours. The furniture store pays the most for each hour!', html: eq('$1,031.48 ÷ 82.5', 12.5) + eq('$847.64 ÷ 64', 13.24, 'money', 700) + eq('$839.90 ÷ 80', 10.5, 'money', 1100) },
      { cap: 'Which is <b>steadiest</b>? The garden centre: every hour pays the same. Commission and piecework go up and down.', html: '<div class="pj-x-star">⏱️ Steadiest: hourly wage</div>' },
      { cap: 'Her recommendation uses numbers from her work:', html: '<div class="pj-x-why"><span class="pj-type">“I’d take the garden centre: it paid the most ($1,031.48 take-home) and the pay is steady.”</span></div>' }] },
    render: function (box, c) {
      var tb = el('div', 'pj-u2-cmp');
      tb.appendChild(el('div', 'pj-u2-cmp-r pj-u2-cmp-h', '<span>Job</span><span>Gross pay</span><span>Net pay</span><span>Hours worked</span><span>Net pay per hour</span>'));
      JOBS.forEach(function (j) {
        var r = el('div', 'pj-u2-cmp-r'); r.style.setProperty('--jc', JOB[j].color);
        r.appendChild(el('span', 'pj-u2-cmp-j', JOB[j].icon + ' <b>' + JOB[j].short + '</b>'));
        r.appendChild(el('span', '', money(gross(c, j)))); r.appendChild(el('span', '', '<b>' + money(net(c, j)) + '</b>')); r.appendChild(el('span', '', fmtH(hoursPer(c, j)) + ' h'));
        r.appendChild(c.input('ph.' + j, { aria: 'Net pay per hour, ' + JOB[j].short }));
        tb.appendChild(r);
      });
      box.appendChild(el('p', 'pj-tip', 'Net pay per hour = net pay ÷ hours worked. Round to the cent. (Tree planting: ' + TDAYS + ' days × about ' + THRS + ' h. Phone store: ' + scen(c).pShifts + ' shifts × 7.5 h.)'));
      box.appendChild(tb);
      var opts = JOBS.map(function (j) { return { v: j, html: JOB[j].icon + ' ' + JOB[j].short }; });
      var q = el('div', 'pj-order');
      q.appendChild(field('Most take-home pay for these two weeks', c.choice('most', opts, { cls: 'pj-seg', aria: 'Most take-home pay' })));
      q.appendChild(field('Most take-home pay <b>per hour</b>', c.choice('mostHr', opts, { cls: 'pj-seg', aria: 'Most take-home pay per hour' })));
      q.appendChild(field('Steadiest pay (the same for the same work)', c.choice('steady', opts, { cls: 'pj-seg', aria: 'Steadiest pay' })));
      box.appendChild(q);
      var gs = c.get('guess');
      if (JOB[gs]) {
        var done = c.P.cps && c.P.cps.compare && c.P.cps.compare.ok, top = best(JOBS.map(function (j) { return { j: j, v: net(c, j) }; }));
        box.appendChild(el('div', 'pj-u2-guess' + (done ? (top.indexOf(gs) >= 0 ? ' right' : ' wrong') : ''), '🔮 In Checkpoint 1 you guessed <b>' + JOB[gs].icon + ' ' + JOB[gs].short + '</b> would pay the most. ' +
          (done ? (top.indexOf(gs) >= 0 ? '<b>You were right!</b>' : 'Not this time: it was <b>' + JOB[top[0]].icon + ' ' + JOB[top[0]].short + '</b>. Surprised?') : 'Pick your answers, then press <b>Check my work</b> to find out if you were right.')));
      }
      part(box, 'B', 'The good and the bad', 'For each job, pick the advantage and the disadvantage that fit it best.');
      var gg = el('div', 'pj-u2-ad');
      JOBS.forEach(function (j) {
        var cd = el('div', 'pj-prod pj-u2-mini'); cd.style.setProperty('--jc', JOB[j].color); cd.innerHTML = jobHead(j) + '<div class="pj-u2-kind2">' + JOB[j].kind + '</div>';
        cd.appendChild(field('👍 An advantage', c.select('adv.' + j, ADV.map(function (x) { return { v: x[0], t: x[2] }; }), { aria: 'Advantage of ' + JOB[j].short })));
        cd.appendChild(field('👎 A disadvantage', c.select('dis.' + j, DIS.map(function (x) { return { v: x[0], t: x[2] }; }), { aria: 'Disadvantage of ' + JOB[j].short })));
        gg.appendChild(cd);
      });
      box.appendChild(gg);
      part(box, 'C', 'Your recommendation', 'Which job would you take? Explain why, using at least one number from your work.');
      box.appendChild(field('I would take', c.choice('take', opts, { cls: 'pj-seg', aria: 'The job you would take' })));
      box.appendChild(field('Why?', c.text('why', { area: true, rows: 3, max: 500, ph: 'e.g. I’d take tree planting because it paid the most ($1,402.18 take-home), even though…', aria: 'Why you would take that job' }), 'pj-wide'));
    },
    check: function (c) {
      var out = [];
      JOBS.forEach(function (j) {
        var n = net(c, j), h = hoursPer(c, j);
        out.push(c.money('ph.' + j, n / h, { tol: 0.011, label: JOB[j].short + ' per hour', wrong: [{ v: h / n, tol: 0.02, hint: 'Flip it: net pay ÷ hours.' }, { v: gross(c, j) / h, tol: 0.011, hint: 'Use the <b>net</b> pay (take-home), not the gross.' }], hint: 'Net pay per hour = net pay ÷ hours worked.', hint2: 'Try ' + money(n) + ' ÷ ' + fmtH(h) + '.' }));
      });
      var mostOk = best(JOBS.map(function (j) { return { j: j, v: net(c, j) }; })), hrOk = best(JOBS.map(function (j) { return { j: j, v: r2(perHr(c, j)) }; }));
      var gs = c.get('guess'), gl = JOB[gs] ? ' (You guessed ' + JOB[gs].short.toLowerCase() + (mostOk.indexOf(gs) >= 0 ? '. You were right!' : '.') + ')' : '';
      out.push(c.equals('most', mostOk, { label: 'Most take-home', hint: 'Compare the <b>net pay</b> column: pick the biggest.' + gl }));
      out.push(c.equals('mostHr', hrOk, { label: 'Most per hour', hint: 'Compare your <b>net pay per hour</b> answers: pick the biggest.' }));
      out.push(c.equals('steady', 'w', { label: 'Steadiest', wrong: { p: 'The base salary is steady, but the commission goes up and down with sales.', t: 'Piecework changes with the ground, the weather and how fast you plant.' }, hint: 'Which job pays the same for the same hours?' }));
      JOBS.forEach(function (j) {
        var aw = {}, dw = {}; ADV.forEach(function (x) { if (x[1] !== j) aw[x[0]] = 'That one fits the ' + JOB[x[1]].short.toLowerCase() + ' job (' + JOB[x[1]].kind.toLowerCase() + ') better.'; }); DIS.forEach(function (x) { if (x[1] !== j) dw[x[0]] = 'That one fits the ' + JOB[x[1]].short.toLowerCase() + ' job (' + JOB[x[1]].kind.toLowerCase() + ') better.'; });
        out.push(c.equals('adv.' + j, ADV.filter(function (x) { return x[1] === j; }).map(function (x) { return x[0]; }), { label: JOB[j].short + ' advantage', wrong: aw, graded: false, hint: 'Think about how ' + JOB[j].kind.toLowerCase() + ' works.' }));
        out.push(c.equals('dis.' + j, DIS.filter(function (x) { return x[1] === j; }).map(function (x) { return x[0]; }), { label: JOB[j].short + ' disadvantage', wrong: dw, graded: false, hint: 'Think about how ' + JOB[j].kind.toLowerCase() + ' works.' }));
      });
      out.push(c.need('take', { label: 'The job you’d take' }));
      var w = c.need('why', { min: 30, label: 'Why', hint: 'Write a sentence or two: which job, and why?' });
      if (w.ok && !/\d/.test(String(c.get('why')))) { w.ok = false; w.hint = 'Use at least one <b>number</b> from your work (like a net pay or a pay per hour).'; }
      out.push(w);
      return out;
    },
    solve: function (c) {
      JOBS.forEach(function (j) { c.set('ph.' + j, r2(perHr(c, j)).toFixed(2)); });
      c.set('most', best(JOBS.map(function (j) { return { j: j, v: net(c, j) }; }))[0]); c.set('mostHr', best(JOBS.map(function (j) { return { j: j, v: r2(perHr(c, j)) }; }))[0]); c.set('steady', 'w');
      c.set('adv.w', 'w1'); c.set('dis.w', 'w3'); c.set('adv.p', 'p1'); c.set('dis.p', 'p3'); c.set('adv.t', 't1'); c.set('dis.t', 't3');
      c.set('take', 'w'); c.set('why', 'The warehouse is steady and I took home ' + money(net(c, 'w')) + ' in two weeks.');
    }
  };

  /* ================= Checkpoint 7: My Job Offer, a reflection, hand it in ================= */
  function stubLines(c, j) {
    var d = ded(c, j), first = firstJob(c) === j;
    return { earn: earnLines(c, j), g: d.g, ded: [['CPP (5.95%)', first ? d.tcpp : d.cpp], ['EI (1.64%)', first ? d.tei : d.ei], ['Income tax (15%)', first ? d.ttax : d.tax], [otherName(j), first ? d.toth : d.oth]], td: d.td, net: net(c, j) };
  }
  function offerHtml(c) {
    var j = takeJob(c), J = JOB[j], st = c.get('offerStyle') || 'classic', nm = String(c.get('myName') || '').trim(), L = stubLines(c, j), G = goal(c), sm = val(c, 'summer', r2(L.net * 4));
    var start = j === 't' ? 'Monday, May 3, 2027' : 'Monday, July 5, 2027';
    return '<div class="pj-u2-offer pj-u2-of-' + esc(st) + '" style="--jc:' + J.color + '">' +
      '<div class="pj-u2-of-top"><span class="pj-u2-of-logo">' + J.icon + '</span><div><b>' + J.boss + '</b><span>' + J.place + '</span></div><div class="pj-u2-of-stamp">JOB OFFER</div></div>' +
      '<div class="pj-u2-of-body"><p>Dear <b>' + (nm ? esc(nm) : '__________') + '</b>,</p><p>We are happy to offer you the job of <b>' + J.title + '</b>, starting ' + start + '.</p>' +
      '<div class="pj-u2-of-pay"><span>Your pay</span><b>' + payRule(c, j) + '</b></div>' +
      '<div class="pj-u2-of-stub"><div class="pj-u2-of-k">Your first pay stub (2 weeks)</div><table>' +
        L.earn.map(function (x) { return '<tr><td>' + x[0] + ' <small>' + x[1] + '</small></td><td>' + money(x[2]) + '</td></tr>'; }).join('') +
        '<tr class="g"><td>Gross pay</td><td>' + money(L.g) + '</td></tr>' +
        L.ded.map(function (x) { return '<tr class="d"><td>− ' + x[0] + '</td><td>' + money(x[1]) + '</td></tr>'; }).join('') +
        '<tr class="g"><td>Total deductions</td><td>' + money(L.td) + '</td></tr><tr class="n"><td>NET PAY</td><td>' + money(L.net) + '</td></tr></table></div>' +
      (G && G.price ? '<div class="pj-u2-of-goal"><span class="pj-u2-of-gi">' + G.icon + '</span><span>Summer plan: 4 pays × ' + money(L.net) + ' = <b>' + money(sm) + '</b> toward ' + esc(G.name.toLowerCase()) + ' (' + money(G.price) + ')</span></div>' : '') +
      '<div class="pj-u2-of-sign"><div><span class="pj-u2-of-sig">' + (nm ? esc(nm) : '') + '</span><small>Accepted by</small></div><div><span class="pj-u2-of-sig">' + J.hr + '</span><small>Hiring manager, ' + J.boss + '</small></div></div></div></div>';
  }
  var cp7 = {
    id: 'offer', title: 'My Job Offer — hand it in', needs: [], submit: true,
    goal: 'Make your printable <b>job offer</b> with your pay stub, plan your summer, write a short <b>reflection</b>, and <b>hand in</b> your project.',
    passMsg: 'Your project has been handed in. Mr. Cathcart will look at it and give you feedback.',
    example: { title: 'Leah’s summer at the garden centre', steps: [
      { cap: 'Leah takes the garden centre job. If every two-week pay is like her first one, a summer of <b>4 pay periods</b> gives her:', html: eq('4 × $1,031.48', 4125.92) },
      { cap: 'That’s more than the $2,400 dirt bike, so her goal works ✓. Her offer letter shows her pay rule and her pay stub.', html: '<div class="pj-x-mini"><b>🌷 Garden centre · Job offer</b><span>$16.00/h · overtime 1.5×</span><span>Gross $1,348.00 → net <b>$1,031.48</b></span><span>Summer: $4,125.92 ✓ dirt bike</span></div>' }] },
    render: function (box, c) {
      var j = takeJob(c), J = JOB[j], G = goal(c);
      if (!G) return needFirst(box, 'Finish the checkpoints before this one first.');
      part(box, 'A', 'Your job offer: ' + J.icon + ' ' + J.short, 'This is the job you picked in Checkpoint 6. Sign it and pick a style.');
      var prev = el('div', 'pj-u2-offerwrap', offerHtml(c));
      function upd() { prev.innerHTML = offerHtml(c); }
      var row = el('div', 'pj-order');
      row.appendChild(field('Your name (to sign it)', c.text('myName', { ph: 'First and last name', max: 40, aria: 'Your name', onInput: upd })));
      row.appendChild(field('Style', c.choice('offerStyle', STYLES.map(function (x) { return { v: x[0], html: x[1] }; }), { cls: 'pj-seg', aria: 'Offer style', onPick: upd })));
      box.appendChild(row);
      part(box, 'B', 'Your summer plan', 'Say every pay is like your first one. The summer has <b>4 pay periods</b> (8 weeks).');
      var g = el('div', 'pj-grid3');
      g.appendChild(field('Take-home for the summer', c.input('summer', { aria: 'Take-home for the summer', onInput: upd })));
      g.appendChild(field('Enough for ' + esc(G.name.toLowerCase()) + ' (' + money(G.price) + ')?', c.choice('enough', [{ v: 'yes', html: 'Yes' }, { v: 'no', html: 'No' }], { cls: 'pj-seg', aria: 'Enough for your goal' })));
      box.appendChild(g);
      box.appendChild(prev);
      var pr = el('button', 'btn pj-printbtn', '🖨️ Print my job offer'); pr.type = 'button';
      pr.addEventListener('click', function () { PJ.print('<link rel="stylesheet" href="' + (PJ.site || '') + 'assets/projects-u2.css"><div class="pj-printsheet">' + offerHtml(c) + '</div>', 'My Job Offer'); });
      if (!c.ro) box.appendChild(pr);
      part(box, 'C', 'Look back', 'A sentence or two for each.');
      box.appendChild(field('What surprised you about the difference between gross pay and net pay?', c.text('surprise', { area: true, rows: 2, max: 400, ph: 'e.g. I didn’t know almost a quarter of my pay would go to deductions…', aria: 'What surprised you' }), 'pj-wide'));
      box.appendChild(field('At the job you picked, what could you do to earn more next pay period?', c.text('more', { area: true, rows: 2, max: 400, ph: 'e.g. Pick up an extra Saturday shift, because…', aria: 'How to earn more' }), 'pj-wide'));
    },
    check: function (c) {
      var j = takeJob(c), G = goal(c), n = net(c, j), out = [c.msg(!!G, 'Finish Checkpoint 5 first.')]; if (!G) return out;
      out.push(c.need('myName', { min: 2, label: 'Your name' })); out.push(c.need('offerStyle', { label: 'Style' }));
      out.push(c.money('summer', 4 * n, { tol: 0.011, label: 'Summer take-home', wrong: [{ v: 4 * gross(c, j), tol: 0.05, hint: 'Use your <b>net</b> pay: that’s what you take home.' }, { v: 2 * n, tol: 0.02, hint: 'The summer has <b>4</b> pay periods (each one is 2 weeks).' }, { v: 8 * n, tol: 0.02, hint: '8 weeks is 4 pay periods, because you’re paid every 2 weeks.' }], hint: 'Summer take-home = 4 × your net pay.', hint2: 'Try 4 × ' + money(n) + '.' }));
      var sm = val(c, 'summer', 4 * n);
      out.push(c.equals('enough', sm >= G.price - 0.005 ? 'yes' : 'no', { label: 'Enough?', hint: 'Compare your summer take-home with the price of your goal (' + money(G.price) + ').' }));
      out.push(c.need('surprise', { min: 15, label: 'What surprised you', hint: 'Write a sentence or two.' }));
      out.push(c.need('more', { min: 15, label: 'How to earn more', hint: 'Write a sentence or two.' }));
      return out;
    },
    solve: function (c) {
      var j = takeJob(c), G = goal(c), n = net(c, j); c.set('myName', 'Sam Student'); c.set('offerStyle', 'modern'); c.set('summer', r2(4 * n).toFixed(2)); c.set('enough', r2(4 * n) >= G.price - 0.005 ? 'yes' : 'no');
      c.set('surprise', 'Almost a quarter of my pay goes to deductions.'); c.set('more', 'I could pick up an extra shift on Saturday.');
    }
  };

  var ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="15" width="38" height="26" rx="4" fill="#fff" stroke="currentColor" stroke-width="2.4"/><path d="M17 15v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M5 25h38" stroke="currentColor" stroke-width="2.4"/><rect x="20" y="22" width="8" height="7" rx="1.5" fill="currentColor"/><path d="M12 34h8M30 34h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" opacity=".55"/></svg>';
  HW.defineProject({
    id: 'u2', unit: 2, title: 'Pick Your Job', outcomes: ['N2', 'A1'], icon: ICON,
    tagline: 'Three Alberta summer jobs: fill your timesheets, work out your pay stub, save for a goal and pick the best offer.',
    intro: '<div class="pj-intro-art">' + ICON + '</div><div><b>Welcome to Pick Your Job!</b> Three employers want to hire you for the summer: a warehouse, a phone store and a tree-planting company. Each one pays in a different way. In 7 checkpoints you’ll use the math from Unit 2 to find out what each job really pays you, and which one you’d take. Your work saves as you go. It’s due on the Unit 2 test day.</div>',
    lessonNames: { u2l1: 'Time Math', u2l2: 'Wages and Salaries', u2l3: 'Overtime', u2l4: 'Piecework', u2l5: 'Commission', u2l6: 'Extra Earnings', u2l7: 'Deductions and Net Pay', u2l8: 'Working Backwards' },
    checkpoints: [cp1, cp2, cp3, cp4, cp5, cp6, cp7],
    flyer: offerHtml
  });
})(typeof window !== 'undefined' ? window : global);
