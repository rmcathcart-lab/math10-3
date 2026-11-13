/* Math 10-3 · Unit 5 · Lesson 2 — Spatial Games and Strategies.
 * Explainers (Class view unless marked Full): working backward to fill the W/L table (Example 1), the rule-change
 * versions and Jordan's mistake (Example 3), playing Example 2 with the counters in groups of 4, why the pattern repeats
 * every 4 (Full: hops on a number line), the tic-tac-toe checklist (Examples 4 and 5), dots and boxes (Example 6),
 * the tower solving itself move by move (Examples 7 and 8(c)), the doubling pattern 2^n − 1 (Example 8),
 * why the checkerboard hunt works (Full) and eliminating ship positions (Example 9).
 * Five small games against the computer (take-away, tic-tac-toe, dots and boxes, the tower puzzle, hidden ships),
 * the static figures, the Math History box (Lucas's Tower of Hanoi legend) and the Stand Up Break.
 * Built locally (geo.js has no game pieces): coins, tic-tac-toe boards, dot grids, towers and ship grids. */
import { h, add, box, svgEl, tween, stamp, stampIn, mountExplainers, tex } from '../blocks.js';
import { standup } from '../standup.js';

const INK = '#1c2230', SLATE = '#3a4254', GREY = '#9aa0ab', RED = '#c93a33', GRN = '#12805a', BLU = '#1f5bd6',
  AMB = '#c27a0e', GOLD = '#e2a63a', BRN = '#6e4a1c';
const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (c, el, ms = 300) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms);
const fade = (c, el, to, ms = 300) => c.anim(el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l2-svg' }), 0, 0);
/** an HTML label of size w × hh centred on (cx, cy) */
const lab = (host, html, cx, cy, w = 80, hh = 40, cls = '') => add(host, box(h('div', 'u5l2-fl ' + cls, `<span>${html}</span>`), w, hh), cx - w / 2, cy - hh / 2);
const txt = (parent, x, y, s, a = {}) => { const t = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: INK }, a), parent); t.textContent = s; return t; };
const rnd = (n) => Math.floor(Math.random() * n);
const pickR = (arr) => arr[rnd(arr.length)];
const listOr = (a) => (a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]);
const listAnd = (a) => (a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
const NS = 'http://www.w3.org/2000/svg';
function svgFig(host, w, hh, cls = '') { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `0 0 ${w} ${hh}`); s.setAttribute('width', w); s.setAttribute('height', hh); if (cls) s.setAttribute('class', cls); host.appendChild(s); return s; }

/* ---------------- a coin (counter) ---------------- */
function coin(parent, cx, cy, r = 16, fill = '#e9c46a') {
  const g = svgEl('g', { class: 'u5l2-coin' }, parent);
  svgEl('circle', { cx, cy, r, fill, stroke: '#8a5a0a', 'stroke-width': 2 }, g);
  svgEl('circle', { cx, cy, r: r * 0.62, fill: 'none', stroke: '#b8860b', 'stroke-width': 1.4, opacity: 0.8 }, g);
  g.cx = cx; g.cy = cy; return g;
}
const tint = (g, fill) => { g.firstChild.setAttribute('fill', fill); };
/** take coins away: tint them, then fade them out */
async function takeAway(c, coins, color, to = 0.08) {
  coins.forEach((g) => tint(g, color));
  await c.sleep(220);
  await Promise.all(coins.map((g, i) => c.anim(g, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: to, transform: 'translateY(-14px)' }], 420, { delay: i * 70 })));
}

/* ======================================================================================
 * W / L tables (take-away game): lose[n] for n = 0..N. lose[0] is true when the last counter wins.
 * ====================================================================================== */
function loseTable(N, m, lastWins) {
  const L = [lastWins];
  for (let n = 1; n <= N; n++) { let all = true; for (let k = 1; k <= Math.min(m, n); k++) if (L[n - k]) { all = false; break; } L.push(all); }
  return L;
}
/** draw the booklet table: numbers / Win or lose? / Take, with hop arcs above. → helpers */
function wlBoard(stage, svg, W, o) {
  const { N, m, lastWins } = o, L = loseTable(N, m, lastWins);
  const hw = 190, cw = Math.min(62, (W - 60 - hw) / N), x0 = (W - hw - cw * N) / 2, tY = o.tY || 176, rh = 46;
  const X = (n) => x0 + hw + (n - 0.5) * cw;
  const rows = ['Counters on your turn', 'Win or lose?', 'Take'];
  rows.forEach((r, i) => {
    svgEl('rect', { x: x0, y: tY + i * rh, width: hw, height: rh, fill: '#f5ecdf', stroke: '#b9ad97', 'stroke-width': 2 }, svg);
    txt(svg, x0 + 10, tY + i * rh + 29, r, { 'text-anchor': 'start', 'font-size': 16, 'font-weight': 800 });
    for (let n = 1; n <= N; n++) svgEl('rect', { x: x0 + hw + (n - 1) * cw, y: tY + i * rh, width: cw, height: rh, fill: '#fff', stroke: '#b9ad97', 'stroke-width': 2 }, svg);
  });
  const nums = {}, wl = {}, tk = {}, shade = {};
  for (let n = 1; n <= N; n++) {
    nums[n] = txt(svg, X(n), tY + 30, n, { 'font-size': 19, 'font-weight': 800 });
    shade[n] = hide(svgEl('rect', { x: x0 + hw + (n - 1) * cw + 2, y: tY + rh + 2, width: cw - 4, height: rh * 2 - 4, fill: L[n] ? '#fde9e7' : '#e9f6ef' }, svg));
    wl[n] = hide(txt(svg, X(n), tY + rh + 31, L[n] ? 'L' : 'W', { 'font-size': 22, 'font-weight': 900, fill: L[n] ? RED : GRN }));
    let take = '–';
    if (!L[n]) { for (let k = 1; k <= Math.min(m, n); k++) if (L[n - k]) { take = k; break; } }
    tk[n] = hide(txt(svg, X(n), tY + 2 * rh + 31, take, { 'font-size': 21, 'font-weight': 800, fill: L[n] ? GREY : INK }));
  }
  const arcs = svgEl('g', {}, svg);
  /** a hop arc from n down to n − k (green: lands on L = a good move; red: lands on W) */
  const hop = (n, k) => {
    const a = X(n), b = X(n - k), y = tY - 2, top = y - 26 - 22 * k, good = L[n - k], colr = good ? GRN : RED;
    const g = svgEl('g', {}, arcs);
    svgEl('path', { d: `M${a} ${y} Q${(a + b) / 2} ${top} ${b + 4} ${y - 6}`, fill: 'none', stroke: colr, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    svgEl('path', { d: `M${b - 3} ${y - 12} L${b + 4} ${y - 4} L${b + 9} ${y - 14} Z`, fill: colr }, g);
    txt(g, (a + b) / 2, top + 22 - 2 * k, '−' + k, { 'font-size': 15, 'font-weight': 800, fill: colr });
    g.style.opacity = 0; return g;
  };
  const fill = async (c, n) => { await show(c, shade[n], 200); await c.pop(wl[n], 300); await show(c, tk[n], 200); };
  return { L, X, hop, fill, arcs, nums, tY, rh, cw };
}
/** the steps that work backward through a W/L board */
function workBackSteps(stage, svg, W, o) {
  const B = wlBoard(stage, svg, W, o), { N, m, lastWins } = o, L = B.L, steps = [];
  let old = [];
  const clearOld = (c) => Promise.all(old.map((g) => fade(c, g, 0.12, 250)));
  let n = 1;
  while (n <= N) {
    if (L[n]) {
      const nn = n, ks = range(1, Math.min(m, n)).filter((k) => n - k >= 1);
      let cap;
      if (!lastWins && n === 1) cap = '<b>1</b> counter: you must take it, and the last counter <b>loses</b>. You lose: <b>L</b>.';
      else cap = `<b>${n}</b> counters: you can leave ${listOr(ks.map((k) => n - k))}. ${ks.length > 1 ? 'All are' : 'That is'} <b>W</b> for the other player. You lose: <b>L</b>.`;
      steps.push({ cap, run: async (c) => { await clearOld(c); const gs = ks.map((k) => B.hop(nn, k)); old = gs; for (const g of gs) await show(c, g, 260); await B.fill(c, nn); } });
      n++;
    } else {
      let e = n; while (e + 1 <= N && !L[e + 1]) e++;
      const grp = range(n, e), target = grp.map((q) => { for (let k = 1; k <= Math.min(m, q); k++) if (L[q - k]) return q - k; return 0; });
      const tgt = target[0];
      let cap;
      if (lastWins && tgt === 0) cap = `<b>${listOr(grp)}</b> counters: take them all and win: <b>W</b>.`;
      else cap = `<b>${listOr(grp)}</b> counters: take ${listOr(grp.map((q, i) => q - target[i]))} to <b>leave ${tgt}</b> for the other player. You win: <b>W</b>.`;
      steps.push({ cap, run: async (c) => { await clearOld(c); const gs = []; grp.forEach((q, i) => { if (target[i] > 0) gs.push(B.hop(q, q - target[i])); }); old = gs; for (const g of gs) await show(c, g, 220); for (const q of grp) await B.fill(c, q); } });
      n = e + 1;
    }
  }
  const Ls = range(1, N).filter((q) => L[q]);
  const res = hide(add(stage, box(h('div', 'u5l2-res u5l2-c', `<div>${o.sumBox}</div>`), Math.min(W - 80, 760), 50), (W - Math.min(W - 80, 760)) / 2, 14));
  steps.push({ cap: o.sumCap(Ls), run: async (c) => { await clearOld(c); for (const q of Ls) c.anim(B.nums[q], [{ fill: INK }, { fill: RED }], 300); await c.pop(res); } });
  return steps;
}
const WB = {
  c: { N: 12, m: 3, lastWins: true, ask: 'Example 1(c) <b>Work backward.</b> For each number of counters on your turn: can you win (W) or will you lose (L)?',
    sumBox: 'Losing numbers: 4, 8, 12, 16, … the <b>multiples of 4</b>', sumCap: () => 'The losing numbers are <b>4, 8, 12, 16, …</b>, the <b>multiples of 4</b>. The pattern repeats every 4.' },
  a: { N: 15, m: 4, lastWins: true, ask: 'Example 3(a) Take 1, 2, 3 <b>or 4</b>; last counter wins. Which numbers should you leave? How many do you take from 23?',
    sumBox: 'Leave <b>multiples of 5</b>. From 23: leave 20, so take <b>3</b>', sumCap: () => 'Leave <b>multiples of 5</b> (5, 10, 15, 20, …). From 23, the next multiple of 5 below is 20: take <b>3</b>.' },
  b: { N: 15, m: 3, lastWins: false, ask: 'Example 3(b) Take 1, 2 or 3, but the last counter <b>loses</b>. Which numbers should you leave? How many do you take from 15?',
    sumBox: 'Leave <b>1, 5, 9, 13, …</b> From 15: leave 13, so take <b>2</b>', sumCap: () => 'Leave <b>1, 5, 9, 13, …</b> (one more than a multiple of 4). From 15, leave 13: take <b>2</b>.' }
};
/** coin rows: "Ben takes 1, Ana takes 3" and the like. rows = [{ label, n, moves: [[who, k, colour]…], verdict, ok }] */
function coinRowSteps(stage, svg, W, top, rows) {
  const out = [];
  const ox = (W - 900) / 2;
  rows.forEach((r, i) => {
    const y = top + i * 94;
    const g = svgEl('g', {}, svg); g.style.opacity = 0;
    const lb = hide(lab(stage, r.label, ox + 130, y, 250, 60, 'u5l2-rl'));
    const coins = range(0, r.n - 1).map((q) => coin(g, ox + 300 + q * 50, y, 18));
    const vd = hide(lab(stage, r.verdict, ox + 300 + r.n * 50 + 150, y, 300, 60, 'u5l2-rv ' + (r.ok ? 'u5l2-good' : 'u5l2-bad')));
    out.push({ g, lb, coins, vd, r });
  });
  return out;
}
async function playRow(c, R) {
  await show(c, R.lb); await show(c, R.g);
  let used = 0;
  for (const [, k, colr] of R.r.moves) { await takeAway(c, R.coins.slice(R.coins.length - used - k, R.coins.length - used), colr, 0.55); used += k; await c.sleep(150); }
  await c.pop(R.vd);
}
const workBack = {
  title: 'Work backward: can you win from here?',
  height: 360, minW: 940,
  choices: [{ sep: 'Example 1 check:' }, { v: 'b', label: '(b) Ben has 4' }, { v: 'c', label: '(c) Fill the table' }],
  ask: (v) => (v === 'b' ? 'Example 1(b) Ben has <b>4 counters</b> in front of him. Show that he can’t win, whatever he takes.' : WB.c.ask),
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 360);
    if (v === 'c') return workBackSteps(stage, svg, W, WB.c);
    const rows = coinRowSteps(stage, svg, W, 70, [1, 2, 3].map((k) => ({ label: `Ben takes <b>${k}</b>`, n: 4, moves: [['Ben', k, '#7fa8f0'], ['Ana', 4 - k, '#f08a80']], verdict: `Ana takes the last <b>${4 - k}</b>`, ok: false })));
    const st = hide(stamp(stage, 'Ben loses', { ok: false, x: W / 2 + 300, y: 320, rotate: -6 }));
    return [
      { cap: 'If Ben takes <b>1</b>, 3 are left. Ana takes all 3 and wins.', run: (c) => playRow(c, rows[0]) },
      { cap: 'If Ben takes <b>2</b>, Ana takes the last 2.', run: (c) => playRow(c, rows[1]) },
      { cap: 'If Ben takes <b>3</b>, Ana takes the last 1.', run: (c) => playRow(c, rows[2]) },
      { cap: 'Every choice leaves <b>1, 2 or 3</b> for Ana, so she wins. From 4, Ben can’t win.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};
const variations = {
  title: 'Change a rule, and fix a strategy',
  height: 360, minW: 940,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a) Take 1 to 4' }, { v: 'b', label: '(b) Last counter loses' }, { v: 'j', label: '(c) Jordan: always take 3' }],
  ask: (v) => (v === 'j' ? 'Example 3(c) Jordan always takes 3. Show that this can lose with <b>6 counters</b> on his turn. What should he do?' : WB[v].ask),
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 360);
    if (v !== 'j') return workBackSteps(stage, svg, W, WB[v]);
    const rows = coinRowSteps(stage, svg, W, 90, [
      { label: 'Jordan: <b>take 3</b>', n: 6, moves: [['J', 3, '#7fa8f0'], ['O', 3, '#f08a80']], verdict: 'The other player takes the last 3 and <b>wins</b>', ok: false },
      { label: 'Leave a <b>multiple of 4</b>', n: 6, moves: [['J', 2, '#7fa8f0'], ['O', 1, '#f08a80'], ['J', 3, '#7fa8f0']], verdict: 'Jordan takes the last counter and <b>wins</b>', ok: true }]);
    const n4 = hide(lab(stage, 'Whatever they take (1, 2 or 3), Jordan takes the rest of 4.', W / 2, 292, 640, 34, 'u5l2-note'));
    return [
      { cap: 'Jordan has <b>6</b>. He takes 3 and leaves 3. The other player takes all 3 and <b>wins</b>.', run: (c) => playRow(c, rows[0]) },
      { cap: 'Instead, take <b>2</b> and leave <b>4</b>, a multiple of 4. Say the other player takes 1; Jordan takes the last 3.', run: (c) => playRow(c, rows[1]) },
      { cap: 'From 4, the other player is stuck. Jordan should <b>leave a multiple of 4</b>, not always take 3.', run: (c) => c.fadeIn(n4) }
    ];
  }
};

/* ======================================================================================
 * Example 2: play it with the counters in groups of 4
 * ====================================================================================== */
const PG = {
  a: { n: 21, moves: [['You', 1], ['Friend', 3], ['You', 1], ['Friend', 2], ['You', 2], ['Friend', 1], ['You', 3], ['Friend', 2], ['You', 2], ['Friend', 1], ['You', 3]], tableCols: 7 },
  c: { n: 24, moves: [['Friend', 3], ['You', 1], ['Friend', 2], ['You', 2], ['Friend', 1], ['You', 3], ['Friend', 3], ['You', 1], ['Friend', 2], ['You', 2], ['Friend', 1], ['You', 3]], tableCols: 4 }
};
const pileGame = {
  title: 'Play it with the counters in groups of 4',
  height: 400, minW: 940,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a) and (b): 21 counters' }, { v: 'c', label: '(c) 24 counters' }],
  ask: (v) => (v === 'a' ? 'Example 2 The pile has <b>21 counters</b> and you go first. Use the strategy: leave a multiple of 4.' : 'Example 2(c) A new game starts with <b>24 counters</b>. Should you go first or second?'),
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), d = PG[v], ox = (W - 940) / 2;
    const gw = 92, gap = 16, ng = Math.ceil(d.n / 4), gx0 = ox + (940 - ng * gw - (ng - 1) * gap) / 2, gy = 30, r = 17;
    const boxes = [], coins = [];
    for (let g = 0; g < ng; g++) boxes.push(hide(svgEl('rect', { x: gx0 + g * (gw + gap), y: gy, width: gw, height: gw, rx: 12, fill: '#fff8ea', stroke: '#d9b77a', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, svg)));
    for (let i = 0; i < d.n; i++) { const g = Math.floor(i / 4), q = i % 4; coins.push(coin(svg, gx0 + g * (gw + gap) + 25 + (q % 2) * 42, gy + 25 + Math.floor(q / 2) * 42, r)); }
    const extra = d.n % 4;
    const extraTag = extra ? hide(lab(stage, `<b>${extra} extra</b>`, gx0 + (ng - 1) * (gw + gap) + gw / 2, gy + gw + 20, 120, 28, 'u5l2-tag u5l2-amb')) : null;
    // the table: Who / Takes / Left
    const tcols = d.tableCols, hw = 100, cw = 112, tx = ox + (940 - hw - cw * tcols) / 2, ty = 176, rh = 42;
    ['Who', 'Takes', 'Left'].forEach((rname, i) => {
      svgEl('rect', { x: tx, y: ty + i * rh, width: hw, height: rh, fill: '#f5ecdf', stroke: '#b9ad97', 'stroke-width': 2 }, svg);
      txt(svg, tx + hw / 2, ty + i * rh + 28, rname, { 'font-size': 17, 'font-weight': 800 });
      for (let k = 0; k < tcols; k++) svgEl('rect', { x: tx + hw + k * cw, y: ty + i * rh, width: cw, height: rh, fill: '#fff', stroke: '#b9ad97', 'stroke-width': 2 }, svg);
    });
    let left = d.n; const cells = [];
    d.moves.forEach(([who, k], i) => {
      left -= k;
      if (i < tcols) {
        const cx = tx + hw + (i + 0.5) * cw, colr = who === 'You' ? BLU : RED;
        cells.push([hide(txt(svg, cx, ty + 28, who, { 'font-size': 17, fill: colr })), hide(txt(svg, cx, ty + rh + 28, k, { 'font-size': 20, 'font-weight': 800, fill: colr })), hide(txt(svg, cx, ty + 2 * rh + 28, left, { 'font-size': 20, 'font-weight': 800 }))]);
      }
    });
    const counter = lab(stage, `<b>${d.n}</b> left`, ox + 830, 330, 160, 40, 'u5l2-cnt');
    const roundTag = hide(lab(stage, '', W / 2, 330, 420, 40, 'u5l2-note'));
    const st = hide(stamp(stage, 'You win!', { ok: true, x: ox + 160, y: 330, rotate: -7 }));
    let removed = 0, moveI = 0;
    const doMove = async (c) => {
      const [who, k] = d.moves[moveI];
      const cs = coins.slice(d.n - removed - k, d.n - removed);
      await takeAway(c, cs, who === 'You' ? '#7fa8f0' : '#f08a80');
      removed += k;
      counter.innerHTML = `<span><b>${d.n - removed}</b> left</span>`;
      const empty = Math.floor((d.n - removed + 3) / 4);
      boxes.forEach((b, g) => { if (g >= empty && b.style.opacity !== '0') c.anim(b, [{ opacity: 0.15 }], 300); });
      if (moveI < cells.length) for (const e of cells[moveI]) await show(c, e, 160);
      moveI++;
    };
    const moves = (n) => async (c) => { for (let i = 0; i < n; i++) await doMove(c); };
    if (v === 'a') return [
      { cap: '21 counters. Make <b>groups of 4</b>: 5 groups, and <b>1 extra</b>.', run: async (c) => { for (const b of boxes) await show(c, b, 120); coins[20] && tint(coins[20], '#f6b73c'); await c.fadeIn(extraTag); } },
      { cap: 'You take the extra <b>1</b>. That leaves <b>20</b>, a multiple of 4.', run: async (c) => { await fade(c, extraTag, 0, 200); await moves(1)(c); } },
      { cap: 'Your friend takes 3: 17 left.', run: moves(1) },
      { cap: 'You take <b>1</b>, the rest of that group (3 + 1 = 4). <b>16</b> left.', run: moves(1) },
      { cap: 'Your friend takes 2. You take <b>2</b> (2 + 2 = 4). <b>12</b> left.', run: moves(2) },
      { cap: 'Your friend takes 1: <b>11</b> left. (b) How many do you take now?', run: moves(1) },
      { cap: '(b) Take <b>3</b> to leave <b>8</b>, a multiple of 4.', run: moves(1) },
      { cap: 'Whatever your friend takes, you take the rest of 4. Each round removes a whole group: <b>8, 4, 0</b>.', run: async (c) => { roundTag.innerHTML = '<span>Friend + you = 4 every round</span>'; await c.fadeIn(roundTag); await moves(4)(c); } },
      { cap: 'You take the <b>last counter</b>. You win!', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
    ];
    return [
      { cap: '24 counters: <b>6 groups of 4</b> and <b>no extra</b>. The first player can’t leave a multiple of 4.', run: async (c) => { for (const b of boxes) await show(c, b, 120); } },
      { cap: 'So go <b>second</b>. Your friend takes 3. You take <b>1</b>, the rest of the group: <b>20</b> left.', run: moves(2) },
      { cap: 'Your friend takes 2. You take <b>2</b>: <b>16</b> left. Each round, a whole group disappears.', run: moves(2) },
      { cap: 'Keep leaving a multiple of 4: 12, 8, 4, 0.', run: async (c) => { roundTag.innerHTML = '<span>Friend + you = 4 every round</span>'; await c.fadeIn(roundTag); await moves(8)(c); } },
      { cap: 'You take the <b>last counter</b>. Going second wins when the pile is a multiple of 4.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * Full notes: why the pattern repeats every 4 (hops on a number line)
 * ====================================================================================== */
const hops4 = {
  title: 'Hops on a number line',
  height: 330, minW: 940, ask: 'Take 1, 2 or 3; the last counter wins. Which pile sizes are <b>L</b> (lose) for the player whose turn it is?',
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 330), N = 16, x0 = (W - 16 * 54) / 2, y = 190, X = (n) => x0 + n * 54;
    svgEl('line', { x1: X(0) - 20, x2: X(N) + 20, y1: y, y2: y, stroke: SLATE, 'stroke-width': 3 }, svg);
    const dots = {}, tags = {};
    for (let n = 0; n <= N; n++) {
      svgEl('line', { x1: X(n), x2: X(n), y1: y - 8, y2: y + 8, stroke: SLATE, 'stroke-width': 2.5 }, svg);
      txt(svg, X(n), y + 34, n, { 'font-size': 19, 'font-weight': 800 });
      const L = n % 4 === 0;
      dots[n] = hide(svgEl('circle', { cx: X(n), cy: y, r: 12, fill: L ? RED : GRN, stroke: '#fff', 'stroke-width': 2 }, svg));
      tags[n] = hide(txt(svg, X(n), y + 64, L ? 'L' : 'W', { 'font-size': 20, 'font-weight': 900, fill: L ? RED : GRN }));
    }
    const arcs = svgEl('g', {}, svg);
    const hop = (n, k) => { const a = X(n), b = X(n - k), top = y - 30 - 26 * k, good = (n - k) % 4 === 0, colr = good ? GRN : RED, g = svgEl('g', {}, arcs);
      svgEl('path', { d: `M${a} ${y - 12} Q${(a + b) / 2} ${top} ${b + 3} ${y - 16}`, fill: 'none', stroke: colr, 'stroke-width': 3 }, g);
      svgEl('path', { d: `M${b - 4} ${y - 22} L${b + 3} ${y - 13} L${b + 9} ${y - 24} Z`, fill: colr }, g); g.style.opacity = 0; return g; };
    let old = [];
    const mark = async (c, ns) => { for (const n of ns) { await c.pop(dots[n], 260); await show(c, tags[n], 150); } };
    const hopsShow = async (c, list) => { await Promise.all(old.map((g) => fade(c, g, 0.1, 200))); old = list.map(([n, k]) => hop(n, k)); for (const g of old) await show(c, g, 200); };
    const pairs = hide(lab(stage, 'Other player + you: &nbsp;<b>1 + 3</b> &nbsp;·&nbsp; <b>2 + 2</b> &nbsp;·&nbsp; <b>3 + 1</b> &nbsp;= 4 every round', W / 2, 296, 700, 42, 'u5l2-res'));
    return [
      { cap: '<b>0</b> counters on your turn: the other player took the last one. You lost, so <b>0 is L</b>.', run: (c) => mark(c, [0]) },
      { cap: 'From <b>1, 2 or 3</b>, one hop lands on 0: take them all. <b>W</b>.', run: async (c) => { await hopsShow(c, [[1, 1], [2, 2], [3, 3]]); await mark(c, [1, 2, 3]); } },
      { cap: 'From <b>4</b>, every hop (1, 2 or 3) lands on a W for the other player. <b>4 is L</b>.', run: async (c) => { await hopsShow(c, [[4, 1], [4, 2], [4, 3]]); await mark(c, [4]); } },
      { cap: 'From <b>5, 6 or 7</b>, one hop lands on 4. <b>W</b>.', run: async (c) => { await hopsShow(c, [[5, 1], [6, 2], [7, 3]]); await mark(c, [5, 6, 7]); } },
      { cap: '<b>8</b> is just like 4: every hop lands on a W. The picture <b>repeats every 4</b>: 12 and 16 are L too.', run: async (c) => { await hopsShow(c, [[8, 1], [8, 2], [8, 3]]); await mark(c, range(8, 16)); } },
      { cap: 'Why 4? Whatever the other player takes, you take the rest of 4. Each round goes down <b>exactly 4</b>, from one L to the next.', run: async (c) => { await hopsShow(c, [[16, 4], [12, 4], [8, 4], [4, 4]]); await c.pop(pairs); } }
    ];
  }
};

/* ======================================================================================
 * Tic-tac-toe: logic shared by the explainer, the figures and the game
 * ====================================================================================== */
const LINES = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
const other = (p) => (p === 'X' ? 'O' : 'X');
const newBoard = () => Array(10).fill('');
const empties = (b) => range(1, 9).filter((s) => !b[s]);
function winner(b) { for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { p: b[l[0]], line: l }; return null; }
/** squares that complete a line for p: [{ sq, line }] */
function winMoves(b, p) { const out = []; for (const l of LINES) { const e = l.filter((s) => !b[s]); if (e.length === 1 && l.filter((s) => b[s] === p).length === 2) out.push({ sq: e[0], line: l }); } return out; }
function threatsAfter(b, p, s) { const nb = b.slice(); nb[s] = p; const seen = new Set(); return winMoves(nb, p).filter((t) => (seen.has(t.sq) ? false : seen.add(t.sq))); }
function forkMoves(b, p) { return empties(b).filter((s) => threatsAfter(b, p, s).length >= 2); }
/** the booklet's checklist for player p → { step, sq, line?, kind } */
function checklist(b, p, random = false) {
  const pk = (a) => (random ? pickR(a) : a[0]);
  const w = winMoves(b, p); if (w.length) return { step: 1, sq: w[0].sq, line: w[0].line };
  const bl = winMoves(b, other(p)); if (bl.length) return { step: 2, sq: bl[0].sq, line: bl[0].line };
  const f = forkMoves(b, p); if (f.length) return { step: 3, sq: pk(f) };
  if (!b[5]) return { step: 4, sq: 5, kind: 'centre' };
  const cs = [1, 3, 7, 9].filter((s) => !b[s]); if (cs.length) return { step: 4, sq: pk(cs), kind: 'corner' };
  return { step: 4, sq: pk(empties(b)), kind: 'edge' };
}
function mm(b, turn, me, depth) {
  const w = winner(b); if (w) return w.p === me ? 10 - depth : depth - 10;
  const e = empties(b); if (!e.length) return 0;
  let best = turn === me ? -99 : 99;
  for (const s of e) { b[s] = turn; const v = mm(b, other(turn), me, depth + 1); b[s] = ''; best = turn === me ? Math.max(best, v) : Math.min(best, v); }
  return best;
}
function perfectMove(b, p) {
  let best = -99, moves = [];
  for (const s of empties(b)) { b[s] = p; const v = mm(b, other(p), p, 1); b[s] = ''; if (v > best) { best = v; moves = [s]; } else if (v === best) moves.push(s); }
  return pickR(moves);
}
/** an SVG tic-tac-toe board at (x, y), size S. → { cen(s), mark(s, p, colour), line(l, colour), g } */
function xoBoard(parent, x, y, S, o = {}) {
  const g = svgEl('g', {}, parent), u = S / 3;
  if (o.bg !== false) svgEl('rect', { x, y, width: S, height: S, fill: '#fff', rx: 6 }, g);
  for (let i = 1; i < 3; i++) {
    svgEl('line', { x1: x + i * u, x2: x + i * u, y1: y + 4, y2: y + S - 4, stroke: INK, 'stroke-width': o.w || 3.5, 'stroke-linecap': 'round' }, g);
    svgEl('line', { y1: y + i * u, y2: y + i * u, x1: x + 4, x2: x + S - 4, stroke: INK, 'stroke-width': o.w || 3.5, 'stroke-linecap': 'round' }, g);
  }
  const cen = (s) => [x + ((s - 1) % 3 + 0.5) * u, y + (Math.floor((s - 1) / 3) + 0.5) * u];
  if (o.nums !== false) for (let s = 1; s <= 9; s++) { const [cx, cy] = cen(s); txt(g, cx - u * 0.36, cy - u * 0.24, s, { 'font-size': Math.max(12, u * 0.16), 'font-weight': 600, fill: '#9a9fa8' }); }
  if (o.big) for (let s = 1; s <= 9; s++) { const [cx, cy] = cen(s); txt(g, cx, cy + u * 0.16, s, { 'font-size': u * 0.42, 'font-weight': 800, fill: SLATE }); }
  const mark = (s, p, colr = INK, parentG = g) => {
    const [cx, cy] = cen(s), r = u * 0.27, m = svgEl('g', {}, parentG);
    if (p === 'X') svgEl('path', { d: `M${cx - r} ${cy - r} L${cx + r} ${cy + r} M${cx - r} ${cy + r} L${cx + r} ${cy - r}`, stroke: colr, 'stroke-width': Math.max(3, u * 0.07), 'stroke-linecap': 'round' }, m);
    else svgEl('circle', { cx, cy, r: r * 1.05, fill: 'none', stroke: colr, 'stroke-width': Math.max(3, u * 0.07) }, m);
    return m;
  };
  const line = (l, colr = GRN, dash = false) => { const [a, b] = [cen(l[0]), cen(l[2])], dx = (b[0] - a[0]) * 0.18, dy = (b[1] - a[1]) * 0.18;
    return svgEl('line', { x1: a[0] - dx, y1: a[1] - dy, x2: b[0] + dx, y2: b[1] + dy, stroke: colr, 'stroke-width': u * 0.08, 'stroke-linecap': 'round', opacity: 0.75, 'stroke-dasharray': dash ? `${u * 0.12} ${u * 0.12}` : 'none' }, g); };
  return { g, cen, mark, line, u };
}
const lineTxt = (l) => l.join('-');

const TTT = {
  a: { x: [4, 5], o: [1, 9], p: 'X', q: '(a) X to play.' },
  b: { x: [1, 3], o: [5], p: 'O', q: '(b) O to play.' },
  c: { x: [1, 9], o: [3, 5], p: 'X', q: '(c) X to play.' }
};
const CHECK = ['<b>1. Win</b> two of yours and an empty square?', '<b>2. Block</b> two of theirs and an empty square?', '<b>3. Fork</b> one move, two threats?', '<b>4. Otherwise</b> centre, then a corner'];
const ttt = {
  title: 'The checklist, step by step',
  height: 400, minW: 940,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { sep: 'Example 5 check:' }, { v: 'e5', label: 'Mateo and Sofia' }],
  ask: (v) => (v === 'e5' ? 'Example 5 Mateo (X) plays the centre. Sofia (O) answers on an edge, square 2. Mateo plays 1. Why must Sofia play 9? Why does Mateo win?' : `Example 4${TTT[v].q} Use the checklist: which square, and why?`),
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), ox = (W - 940) / 2, S = 300;
    const B = xoBoard(svg, ox + 40, 40, S), marks = svgEl('g', {}, svg);
    const rows = CHECK.map((t, i) => add(stage, box(h('div', 'u5l2-ck', `<span>${t}</span>`), 470, 54), ox + 410, 34 + i * 66));
    const res = hide(add(stage, box(h('div', 'u5l2-res u5l2-c', ''), 470, 52), ox + 410, 312));
    const lite = async (c, i, state) => { rows.forEach((r, k) => r.classList.toggle('on', k === i)); if (state) rows[i].dataset.v = state; rows[i].classList.add(state === 'no' ? 'u5l2-cno' : 'u5l2-cyes'); await c.anim(rows[i], [{ transform: 'scale(1.03)' }, { transform: 'scale(1)' }], 260); };
    const b = newBoard();
    if (v !== 'e5') {
      const d = TTT[v], p = d.p, q = other(p);
      d.x.forEach((s) => { b[s] = 'X'; B.mark(s, 'X', INK, marks); }); d.o.forEach((s) => { b[s] = 'O'; B.mark(s, 'O', INK, marks); });
      const mine = (p === 'X' ? d.x : d.o), theirs = (p === 'X' ? d.o : d.x);
      const w = winMoves(b, p), bl = winMoves(b, q), ck = checklist(b, p);
      const steps = [];
      const newMark = hide(B.mark(ck.sq, p, RED, marks));
      const answer = async (c, html) => { res.innerHTML = `<div>${html}</div>`; await c.anim(newMark, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], 380); await c.pop(res); };
      if (w.length) {
        const ln = hide(B.line(w[0].line, GRN, true));
        steps.push({ cap: `<b>Step 1, Win.</b> ${p} has ${listAnd(w[0].line.filter((s) => b[s] === p))}, and ${w[0].sq} is empty (${lineTxt(w[0].line)}).`, run: async (c) => { await lite(c, 0, 'yes'); await show(c, ln); } });
        steps.push({ cap: `Take square <b>${ck.sq}</b>: three in a row. ${p} wins!`, run: async (c) => { await answer(c, `Square <b>${ck.sq}</b>: win`); await fade(c, ln, 0, 150); const L2 = B.line(w[0].line, GRN); await show(c, L2); } });
        return steps;
      }
      steps.push({ cap: mine.length < 2 ? `<b>Step 1, Win.</b> ${p} has only one mark. No win yet.` : `<b>Step 1, Win.</b> No line has two ${p}’s and an empty square. No win yet.`, run: (c) => lite(c, 0, 'no') });
      if (bl.length) {
        const ln = hide(B.line(bl[0].line, RED, true));
        steps.push({ cap: `<b>Step 2, Block.</b> ${q} has ${listAnd(bl[0].line.filter((s) => b[s] === q))}, and ${bl[0].sq} is empty (${lineTxt(bl[0].line)}).`, run: async (c) => { await lite(c, 1, 'yes'); await show(c, ln); } });
        steps.push({ cap: `${p} must block at <b>${ck.sq}</b>.`, run: (c) => answer(c, `Square <b>${ck.sq}</b>: block`) });
        const th = threatsAfter(b, p, ck.sq).sort((u, w) => u.sq - w.sq);
        if (th.length >= 2) {
          const ls = th.map((t) => hide(B.line(t.line, BLU, true)));
          steps.push({ cap: `Look again: ${ck.sq} also makes <b>two threats</b>, at ${th[0].sq} (${lineTxt(th[0].line)}) and ${th[1].sq} (${lineTxt(th[1].line)}). A <b>fork</b>! ${q} can stop only one.`, run: async (c) => { await lite(c, 2, 'yes'); for (const l of ls) await show(c, l); res.innerHTML = `<div>Square <b>${ck.sq}</b>: block <b>and</b> fork</div>`; await c.pop(res); } });
        }
        void theirs;
        return steps;
      }
      return steps;
    }
    // Example 5: Mateo and Sofia, then a tie game
    const put = (s, p, colr = INK) => { b[s] = p; return B.mark(s, p, colr, marks); };
    put(5, 'X'); put(2, 'O'); put(1, 'X');
    const t9 = hide(B.line([1, 5, 9], RED, true)), o9 = hide(B.mark(9, 'O', RED, marks)), x7 = hide(B.mark(7, 'X', RED, marks));
    const f1 = hide(B.line([1, 4, 7], BLU, true)), f2 = hide(B.line([3, 5, 7], BLU, true));
    const o4 = hide(B.mark(4, 'O', INK, marks)), x3 = hide(B.mark(3, 'X', RED, marks)), wl = hide(B.line([3, 5, 7], GRN));
    const st = hide(stamp(stage, 'X wins', { ok: false, x: ox + 190, y: 370, rotate: -6, size: 'sm' }));
    const tieG = svgEl('g', {}, svg); tieG.style.opacity = 0;
    svgEl('rect', { x: ox + 30, y: 30, width: S + 20, height: S + 20, fill: '#fbfaf6' }, tieG);
    const B2 = xoBoard(tieG, ox + 40, 40, S), tie = [[5, 'X'], [1, 'O'], [3, 'X'], [7, 'O'], [4, 'X'], [6, 'O'], [2, 'X'], [8, 'O'], [9, 'X']];
    const tieMarks = tie.map(([s, p]) => hide(B2.mark(s, p, INK)));
    const st2 = hide(stamp(stage, 'Tie', { ok: null, x: ox + 190, y: 370, rotate: -6, size: 'sm' }));
    return [
      { cap: '(a) Mateo has <b>1 and 5</b>. He threatens to win at 9 (1-5-9). <b>Step 2:</b> Sofia must block at <b>9</b>.', run: async (c) => { await lite(c, 1, 'yes'); await show(c, t9); await c.pop(o9); } },
      { cap: '(b) Mateo plays <b>7</b>.', run: async (c) => { await fade(c, t9, 0, 150); await c.pop(x7); } },
      { cap: 'Now X threatens <b>4</b> (1-4-7) and <b>3</b> (3-5-7): a <b>fork</b>. Sofia has no threat of her own.', run: async (c) => { await lite(c, 2, 'yes'); await show(c, f1); await show(c, f2); } },
      { cap: 'Sofia can block only one, say 4. Mateo wins with <b>3</b>.', run: async (c) => { await c.pop(o4); await fade(c, f1, 0, 150); await fade(c, f2, 0, 150); await c.pop(x3); await show(c, wl); st.style.opacity = 1; await stampIn(c, st); } },
      { cap: '(c) Sofia’s edge was the mistake. Answer the centre with a <b>corner</b>, and both use the checklist…', run: async (c) => { await fade(c, st, 0, 150); rows.forEach((r) => r.classList.remove('on')); await show(c, tieG); for (const m of tieMarks) await c.anim(m, [{ opacity: 0 }, { opacity: 1 }], 260); } },
      { cap: '…every threat gets blocked: a <b>tie</b>. Taking the centre wins only if the other player makes a mistake.', run: async (c) => { st2.style.opacity = 1; await stampIn(c, st2); } }
    ];
  }
};

/* ======================================================================================
 * Dots and boxes: logic shared by the figures, the explainer and the game
 * ====================================================================================== */
const DLINES = []; for (let j = 0; j <= 3; j++) for (let i = 0; i <= 2; i++) DLINES.push(`h${i}${j}`); for (let j = 0; j <= 2; j++) for (let i = 0; i <= 3; i++) DLINES.push(`v${i}${j}`);
const BOXES = []; for (let b = 2; b >= 0; b--) for (let a = 0; a <= 2; a++) BOXES.push([a, b]);   // A..I: top row first
const BOXNAME = (a, b) => 'ABCDEFGHI'[(2 - b) * 3 + a];
const sidesOf = (a, b) => [`h${a}${b}`, `h${a}${b + 1}`, `v${a}${b}`, `v${a + 1}${b}`];
function boxesOfLine(id) { const k = id[0], i = +id[1], j = +id[2], out = [];
  if (k === 'h') { if (j > 0) out.push([i, j - 1]); if (j < 3) out.push([i, j]); } else { if (i > 0) out.push([i - 1, j]); if (i < 3) out.push([i, j]); }
  return out; }
const countSides = (drawn, a, b) => sidesOf(a, b).filter((s) => drawn.has(s)).length;
/** a dots grid: (0,0) is the bottom-left dot; sp px between dots */
function dotGrid(parent, x, y, sp, o = {}) {
  const g = svgEl('g', {}, parent), P = (i, j) => [x + i * sp, y + (3 - j) * sp];
  const seg = (id) => { const k = id[0], i = +id[1], j = +id[2]; const a = P(i, j), b = k === 'h' ? P(i + 1, j) : P(i, j + 1); return [a, b]; };
  const lines = svgEl('g', {}, g), labels = svgEl('g', {}, g), top = svgEl('g', {}, g);
  if (o.letters !== false) BOXES.forEach(([a, b]) => { const [cx, cy] = P(a + 0.5, b + 0.5); txt(labels, cx, cy + 7, BOXNAME(a, b), { 'font-size': sp * 0.2, 'font-weight': 700, fill: '#b5b0a5' }); });
  const draw = (id, colr = INK, w = 4.5, dash) => { const [a, b] = seg(id); return svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: colr, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': dash || 'none' }, lines); };
  const dotsG = svgEl('g', {}, g);
  for (let i = 0; i <= 3; i++) for (let j = 0; j <= 3; j++) { const [cx, cy] = P(i, j); svgEl('circle', { cx, cy, r: o.r || 6, fill: INK }, dotsG); }
  return { g, P, seg, draw, lines, labels, top, dotsG };
}
const EX6 = { H: ['h11', 'h12', 'h03', 'h00', 'h20'], V: ['v11', 'v02', 'v32', 'v30', 'v31'], q: 'h02', r: 'h23', s: 'h21', take: 'v21' };
const dots = {
  title: 'Count the sides before you draw',
  height: 380, minW: 940,
  choices: [{ sep: 'Example 6 check:' }, { v: 'ab', label: '(a) and (b)' }, { v: 'c', label: '(c) Leo’s strategy' }],
  ask: (v) => (v === 'ab' ? `Example 6 Which box can you take? Then: is ${T('q')}, ${T('r')} or ${T('s')} safe?` : 'Example 6(c) Leo likes to draw a side on a box that already has <b>two</b> sides. What is wrong with that?'),
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 380), ox = (W - 940) / 2;
    if (v === 'c') {
      const g = svgEl('g', {}, svg), x = ox + 120, y = 90, s = 150;
      const sideL = (x1, y1, x2, y2, colr, w = 6) => svgEl('line', { x1, y1, x2, y2, stroke: colr, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
      sideL(x, y, x + s, y, INK); sideL(x, y, x, y + s, INK);
      const third = hide(sideL(x + s, y, x + s, y + s, '#e0841a')), fourth = hide(sideL(x, y + s, x + s, y + s, BLU));
      [[x, y], [x + s, y], [x, y + s], [x + s, y + s]].forEach(([cx, cy]) => svgEl('circle', { cx, cy, r: 8, fill: INK }, g));
      const n2 = lab(stage, '2 sides', x + s / 2, y + s / 2, 120, 40, 'u5l2-cnt');
      const fillB = hide(svgEl('rect', { x: x + 6, y: y + 6, width: s - 12, height: s - 12, fill: '#dbe7fb' }, g)); g.insertBefore(fillB, g.firstChild);
      const l1 = hide(lab(stage, 'Leo draws the <b>third</b> side', x + s + 210, y + 40, 330, 40, 'u5l2-note'));
      const l2 = hide(lab(stage, 'The other player draws the 4th side, takes the box <b>and moves again</b>', x + s + 230, y + 110, 380, 60, 'u5l2-note'));
      const l3 = hide(lab(stage, 'Draw on boxes with <b>0 or 1</b> sides instead', W / 2, 330, 520, 40, 'u5l2-res'));
      const st = hide(stamp(stage, '✗', { ok: false, x: x - 50, y: y + s / 2, rotate: -8 }));
      return [
        { cap: 'This box has <b>2 sides</b>. Leo draws a third side, to get “closer”.', run: async (c) => { await show(c, third); n2.innerHTML = '<span>3 sides</span>'; await c.fadeIn(l1); } },
        { cap: 'Now the other player draws the <b>fourth</b> side, takes the box, and gets <b>another turn</b>.', run: async (c) => { await show(c, fourth); await show(c, fillB); n2.innerHTML = '<span><b>Theirs!</b></span>'; await c.fadeIn(l2); st.style.opacity = 1; await stampIn(c, st); } },
        { cap: 'Leo’s line was the box’s <b>third</b> side. He should draw sides on boxes with <b>0 or 1</b> sides instead.', run: (c) => c.pop(l3) }
      ];
    }
    const sp = 100, G = dotGrid(svg, ox + 70, 35, sp);
    EX6.H.concat(EX6.V).forEach((id) => G.draw(id));
    const dsh = {}; ['q', 'r', 's'].forEach((k) => { dsh[k] = G.draw(EX6[k], '#8b8f99', 4, '9 7'); const [a, b] = G.seg(EX6[k]); const t = txt(G.top, (a[0] + b[0]) / 2, a[1] - 12, k, { 'font-size': 22, 'font-style': 'italic', 'font-family': 'Georgia, serif', fill: SLATE }); t.setAttribute('font-weight', 700); });
    const drawn = new Set(EX6.H.concat(EX6.V));
    const nums = {}, fills = {};
    BOXES.forEach(([a, b]) => { const [cx, cy] = G.P(a + 0.5, b + 0.5), nm = BOXNAME(a, b);
      fills[nm] = hide(svgEl('rect', { x: cx - sp / 2 + 5, y: cy - sp / 2 + 5, width: sp - 10, height: sp - 10, rx: 6, fill: '#fde9e7' }, G.g)); G.g.insertBefore(fills[nm], G.g.firstChild);
      nums[nm] = hide(txt(G.top, cx + 30, cy - 18, countSides(drawn, a, b), { 'font-size': 20, 'font-weight': 900, fill: AMB })); });
    const takeL = hide(G.draw(EX6.take, RED, 5.5)), me = hide(txt(G.top, ...G.P(1.5, 1.5).map((q, i) => q + (i ? 7 : 0)), 'Me', { 'font-size': 24, 'font-weight': 900, fill: RED }));
    const ox2 = ox + 450, notes = ['q', 'r', 's'].map((k, i) => hide(add(stage, box(h('div', 'u5l2-ck u5l2-ckw', ''), 460, 56), ox2, 70 + i * 70)));
    const NOTE = { q: '<i>q</i>: 3rd side of <b>A</b>: gives away A', r: '<i>r</i>: C goes to 2 sides: <b>safe</b>', s: '<i>s</i>: 3rd side of <b>F and I</b>: gives away both' };
    const rStroke = hide(G.draw(EX6.r, GRN, 5.5));
    const st = hide(stamp(stage, 'Draw r', { ok: true, x: ox2 + 300, y: 320, rotate: -6 }));
    const setNum = (nm, v2, colr) => { nums[nm].textContent = v2; if (colr) nums[nm].setAttribute('fill', colr); };
    return [
      { cap: 'Count the sides of every box (the small numbers).', run: async (c) => { for (const k of 'ABCDEFGHI') await c.pop(nums[k], 220); } },
      { cap: '(a) Box <b>E</b> has 3 sides. Draw its fourth side, the line between E and F, and take E.', run: async (c) => { await c.anim(nums.E, [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], 400); await show(c, takeL); setNum('E', 4); nums.E.style.opacity = 0; await c.pop(me); setNum('F', 2, RED); await c.pop(nums.F); } },
      { cap: 'You get <b>another turn</b>. (b) Test each line. <b>q</b> would be the 3rd side of <b>A</b>: it gives away A.', run: async (c) => { notes[0].innerHTML = `<span>${NOTE.q}</span>`; notes[0].classList.add('u5l2-cno'); await c.anim(dsh.q, [{ stroke: RED }], 250); await show(c, fills.A); await c.fadeIn(notes[0]); } },
      { cap: '<b>r</b>: box C goes from 1 side to 2. <b>Safe.</b>', run: async (c) => { notes[1].innerHTML = `<span>${NOTE.r}</span>`; notes[1].classList.add('u5l2-cyes'); await c.anim(dsh.r, [{ stroke: GRN }], 250); await c.fadeIn(notes[1]); } },
      { cap: '<b>s</b>: F and I each have 2 sides now, so <b>s</b> is the 3rd side of both. It gives away F <b>and</b> I.', run: async (c) => { notes[2].innerHTML = `<span>${NOTE.s}</span>`; notes[2].classList.add('u5l2-cno'); await c.anim(dsh.s, [{ stroke: RED }], 250); await show(c, fills.F); await show(c, fills.I); await c.fadeIn(notes[2]); } },
      { cap: 'Draw <b>r</b>, the only safe line.', run: async (c) => { await show(c, rStroke); setNum('C', 2, GRN); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * The tower puzzle
 * ====================================================================================== */
const DISC_COL = ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#8d6cc9'];
const discName = (n, k) => (n === 1 ? 'disc' : n === 2 ? ['S', 'L'][k - 1] : n === 3 ? ['S', 'M', 'L'][k - 1] : String(k));
const discLabel = (n, k) => (n === 1 ? '' : discName(n, k));
/** moves for n discs from → to (k = disc size, 1 smallest) */
function hanoi(n, from, to, via, out = []) { if (!n) return out; hanoi(n - 1, from, via, to, out); out.push([n, from, to]); hanoi(n - 1, via, to, from, out); return out; }
/** next-pegs-only moves (pegs 0, 1, 2 in a row) */
function hanoiAdj(n, from, to, out = []) {
  if (!n) return out;
  if (Math.abs(from - to) === 1) { const o = 3 - from - to; hanoiAdj(n - 1, from, o, out); out.push([n, from, to]); hanoiAdj(n - 1, o, to, out); }
  else { hanoiAdj(n - 1, from, to, out); out.push([n, from, 1]); hanoiAdj(n - 1, to, from, out); out.push([n, 1, to]); hanoiAdj(n - 1, from, to, out); }
  return out;
}
const PEG = 'ABC';
/** a tower drawing in an SVG: pegs at px[0..2], base y. discs as groups positioned by transform. */
function towerRig(parent, o) {
  const { px, base, ph, dh, wmin, wstep, label = true } = o, g = svgEl('g', {}, parent);
  const half = (wmin + wstep * ((o.maxN || 4) - 1)) / 2 + 18;
  svgEl('rect', { x: px[0] - half, y: base, width: px[2] - px[0] + 2 * half, height: 14, rx: 4, fill: '#c9a46a', stroke: '#7a5124', 'stroke-width': 2 }, g);
  px.forEach((x, i) => { svgEl('rect', { x: x - 6, y: base - ph, width: 12, height: ph, rx: 5, fill: '#8a6a44' }, g); if (label) txt(g, x, base + 40, PEG[i], { 'font-size': 22, 'font-weight': 900, fill: BRN }); });
  const dg = svgEl('g', {}, g), discs = {}, stacks = [[], [], []];
  const posY = (h) => base - (h + 1) * dh;
  const make = (n) => { dg.innerHTML = ''; stacks[0] = []; stacks[1] = []; stacks[2] = [];
    for (let k = n; k >= 1; k--) { const w = wmin + wstep * (k - 1), d = svgEl('g', {}, dg);
      svgEl('rect', { x: -w / 2, y: 0, width: w, height: dh - 3, rx: dh / 2.6, fill: DISC_COL[(k - 1) % 6], stroke: 'rgba(0,0,0,.45)', 'stroke-width': 2 }, d);
      if (o.names) txt(d, 0, dh * 0.72, o.names(n, k), { 'font-size': Math.min(20, dh * 0.62), 'font-weight': 900, fill: '#fff', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 0.6 });
      discs[k] = d; stacks[0].push(k); d.setAttribute('transform', `translate(${px[0]} ${posY(stacks[0].length - 1)})`); } };
  /** animate one move (disc k from peg f to peg t); c optional */
  const move = async (c, f, t, ms = 600) => {
    const k = stacks[f].pop(), d = discs[k], hf = stacks[f].length, ht = stacks[t].length; stacks[t].push(k);
    const x0 = px[f], y0 = posY(hf), x1 = px[t], y1 = posY(ht), yt = base - ph - dh - 8;
    const P = (s) => { // lift, slide, drop along a 3-part path
      if (s < 0.3) { const u = s / 0.3; return [x0, y0 + (yt - y0) * u]; }
      if (s < 0.7) { const u = (s - 0.3) / 0.4; return [x0 + (x1 - x0) * u, yt]; }
      const u = (s - 0.7) / 0.3; return [x1, yt + (y1 - yt) * u]; };
    if (!c) { d.setAttribute('transform', `translate(${x1} ${y1})`); return k; }
    await tween(c, ms, (s) => { const [x, y] = P(s); d.setAttribute('transform', `translate(${x} ${y})`); }, (s) => s);
    return k;
  };
  return { g, make, move, stacks, discs, posY };
}
const tower = {
  title: 'The tower solves itself, move by move',
  height: 400, minW: 940,
  choices: [{ sep: 'Example 7 check:' }, { v: 1, label: '1 disc' }, { v: 2, label: '2 discs' }, { v: 3, label: '3 discs' }, { v: 4, label: '4 discs: 7 + 1 + 7' }, { sep: 'Example 8(c) check:' }, { v: 'adj', label: 'Next pegs only' }],
  ask: (v) => (v === 'adj' ? 'Example 8(c) A disc may move only to a peg <b>next to</b> its peg. How many moves for 1 disc and 2 discs?'
    : v === 4 ? 'Example 7(c) For 4 discs: move the top 3 off, move the largest, move the 3 back on. How many moves?' : `Example 7 What is the fewest number of moves for <b>${v} disc${v > 1 ? 's' : ''}</b>?`),
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), ox = (W - 940) / 2;
    const n0 = v === 'adj' ? 1 : v, rig = towerRig(svg, { px: [ox + 120, ox + 345, ox + 570], base: 320, ph: 210, dh: 34, wmin: 64, wstep: 34, names: discLabel });
    rig.make(n0);
    const listBox = add(stage, box(h('div', 'u5l2-mlist' + (v === 4 ? ' u5l2-two' : ''), ''), 230, 300), ox + 700, 20);
    const cnt = lab(stage, 'Moves: <b>0</b>', ox + 345, 30, 200, 40, 'u5l2-cnt');
    let mv = 0, nNow = n0;
    const logMove = (k, f, t) => { mv++; cnt.innerHTML = `<span>Moves: <b>${mv}</b></span>`; const row = h('div', 'u5l2-mrow', `<span>${mv}</span><b>${discName(nNow, k)}</b> ${PEG[f]} → ${PEG[t]}`); listBox.appendChild(row); listBox.scrollTop = 9999; };
    const go = (f, t, ms = 650) => async (c) => { const k = await rig.move(c, f, t, ms); logMove(k, f, t); };
    const seq = (moves, ms) => async (c) => { for (const [, f, t] of moves) await go(f, t, ms)(c); };
    if (v === 'adj') {
      const rule = svgEl('g', {}, svg);
      [[0, 1], [1, 2]].forEach(([a, b]) => { const x1 = ox + 120 + 225 * a + 30, x2 = ox + 120 + 225 * b - 30; svgEl('path', { d: `M${x1} 372 L${x2} 372`, stroke: GRN, 'stroke-width': 4 }, rule); svgEl('path', { d: `M${x1 + 10} 364 L${x1} 372 L${x1 + 10} 380 M${x2 - 10} 364 L${x2} 372 L${x2 - 10} 380`, stroke: GRN, 'stroke-width': 4, fill: 'none' }, rule); });
      rule.style.opacity = 0;
      const m2 = hanoiAdj(2, 0, 2), res = hide(add(stage, box(h('div', 'u5l2-res u5l2-c', '<div>1 disc: <b>2</b> · 2 discs: <b>8</b>. Not 1 and 3!</div>'), 470, 46), ox + 110, 56));
      return [
        { cap: 'New rule: a disc moves only to a peg <b>next to</b> it: A↔B and B↔C, never straight between A and C.', run: (c) => show(c, rule) },
        { cap: '<b>1 disc:</b> A → B, then B → C. That is <b>2 moves</b>.', run: seq(hanoiAdj(1, 0, 2), 650) },
        { cap: '<b>2 discs:</b> start again. S A → B, S B → C, L A → B.', run: async (c) => { rig.make(2); nNow = 2; mv = 0; listBox.innerHTML = ''; cnt.innerHTML = '<span>Moves: <b>0</b></span>'; await seq(m2.slice(0, 3), 600)(c); } },
        { cap: 'S C → B, S B → A (S gets out of L’s way), L B → C.', run: seq(m2.slice(3, 6), 600) },
        { cap: 'S A → B, S B → C. That is <b>8 moves</b>.', run: seq(m2.slice(6), 600) },
        { cap: `${T('2^1-1=1')} and ${T('2^2-1=3')}, but the counts are 2 and 8. <b>Changing a rule changes the pattern.</b>`, run: async (c) => { await fade(c, rule, 0, 200); await c.pop(res); } }
      ];
    }
    const M = hanoi(v, 0, 2, 1);
    if (v === 1) return [{ cap: '1 disc: move it from A to C. That is <b>1 move</b>.', run: seq(M, 700) }];
    if (v === 2) return [
      { cap: 'Move 1: <b>S</b> from A to B, out of the way.', run: seq(M.slice(0, 1), 700) },
      { cap: 'Move 2: <b>L</b> from A to C.', run: seq(M.slice(1, 2), 700) },
      { cap: 'Move 3: <b>S</b> from B to C, on top of L. That is <b>3 moves</b>.', run: seq(M.slice(2), 700) }
    ];
    if (v === 3) {
      const notes = { 3: ' Moves 1–3 moved the top <b>2</b> discs out of the way, onto B.', 4: ' The <b>largest</b> disc moves just once.', 7: ' Moves 5–7 put the 2 discs back on top: <b>7 moves</b>.' };
      return M.map(([k, f, t], i) => ({ cap: `Move ${i + 1}: <b>${discName(3, k)}</b> from ${PEG[f]} to ${PEG[t]}.${notes[i + 1] || ''}`, run: seq([M[i]], 700) }));
    }
    // 4 discs: 7 + 1 + 7
    const br = (a, b, y, t, colr) => { const g = svgEl('g', {}, svg); g.style.opacity = 0; svgEl('path', { d: `M${a} ${y} v-10 H${b} v10`, fill: 'none', stroke: colr, 'stroke-width': 3 }, g); txt(g, (a + b) / 2, y - 18, t, { 'font-size': 19, 'font-weight': 800, fill: colr }); return g; };
    const tot = hide(add(stage, box(h('div', 'u5l2-res u5l2-c', '<div><b>7 + 1 + 7 = 15</b> moves</div>'), 230, 50), ox + 700, 334));
    const b1 = br(ox + 120, ox + 345, 82, 'top 3 to B: 7 moves', BLU), b2 = br(ox + 470, ox + 670, 82, 'then 7 more', BLU);
    return [
      { cap: 'Moves 1–7: move the top <b>3</b> discs to B. That is the 3-disc puzzle: <b>7 moves</b>.', run: async (c) => { await show(c, b1); await seq(M.slice(0, 7), 320)(c); } },
      { cap: 'Move 8: the <b>largest</b> disc goes from A to C, just once.', run: seq(M.slice(7, 8), 700) },
      { cap: 'Moves 9–15: move the 3 discs from B back on top: <b>7 more</b>.', run: async (c) => { await show(c, b2); await seq(M.slice(8), 320)(c); } },
      { cap: '<b>7 + 1 + 7 = 15</b> moves for 4 discs.', run: (c) => c.pop(tot) }
    ];
  }
};

/* ======================================================================================
 * The doubling pattern 2^n − 1, and the Example 8 checks
 * ====================================================================================== */
const towerPattern = {
  title: 'Look for a pattern',
  height: 380, minW: 940,
  choices: [{ v: 'p', label: 'The pattern' }, { sep: 'Example 8 check:' }, { v: 'a', label: '(a) 8 discs, 1 move per second' }, { v: 'b', label: '(b) Kai’s error' }],
  ask: (v) => (v === 'p' ? 'Example 7(c) Complete the table: the fewest moves for 1 to 6 discs. What is the pattern?' : v === 'a' ? 'Example 8(a) <b>8 discs</b>, 1 move every second, no mistakes. How long? Give minutes and seconds.' : 'Example 8(b) Kai says each disc adds 2 moves, so 5 discs take 9 moves. Find his error.'),
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 380), ox = (W - 940) / 2;
    const tbl = (rows, y0, nc = 6, cw = 110, hw = 190) => {
      const x0 = ox + (940 - hw - cw * nc) / 2, cells = [];
      rows.forEach((r, i) => { svgEl('rect', { x: x0, y: y0 + i * 50, width: hw, height: 50, fill: '#f5ecdf', stroke: '#b9ad97', 'stroke-width': 2 }, svg); txt(svg, x0 + hw / 2, y0 + i * 50 + 32, r, { 'font-size': 18, 'font-weight': 800 });
        cells.push(range(1, nc).map((k) => { svgEl('rect', { x: x0 + hw + (k - 1) * cw, y: y0 + i * 50, width: cw, height: 50, fill: '#fff', stroke: '#b9ad97', 'stroke-width': 2 }, svg); return x0 + hw + (k - 0.5) * cw; })); });
      return { x0, cw, hw, X: (k) => x0 + hw + (k - 0.5) * cw };
    };
    if (v === 'p') {
      const t = tbl(['Discs', 'Fewest moves'], 140), mv = [1, 3, 7, 15, 31, 63];
      range(1, 6).forEach((k) => txt(svg, t.X(k), 172, k, { 'font-size': 21, 'font-weight': 800 }));
      const vals = mv.map((m, i) => { const e = txt(svg, t.X(i + 1), 222, m, { 'font-size': 23, 'font-weight': 900, fill: i < 3 ? INK : RED }); if (i >= 3) e.style.opacity = 0; return e; });
      const sub = hide(lab(stage, '7 + 1 + 7', t.X(4), 258, 100, 28, 'u5l2-small'));
      const arcs = range(1, 5).map((k) => { const a = t.X(k), b = t.X(k + 1), g = svgEl('g', {}, svg); svgEl('path', { d: `M${a + 8} 132 Q${(a + b) / 2} 88 ${b - 8} 132`, fill: 'none', stroke: BLU, 'stroke-width': 3 }, g); svgEl('path', { d: `M${b - 18} 126 L${b - 7} 133 L${b - 6} 120`, fill: 'none', stroke: BLU, 'stroke-width': 3 }, g); txt(g, (a + b) / 2, 96, '×2 +1', { 'font-size': 16, 'font-weight': 800, fill: BLU }); g.style.opacity = 0; return g; });
      const p2 = range(1, 6).map((k) => hide(lab(stage, `${mv[k - 1]} + 1 = <b>${mv[k - 1] + 1}</b>`, t.X(k), 290, 108, 30, 'u5l2-small')));
      const pw = range(1, 6).map((k) => hide(lab(stage, T(`2^{${k}}`), t.X(k), 322, 100, 30, 'u5l2-pw')));
      const res = hide(add(stage, box(h('div', 'u5l2-res u5l2-c', `<div>fewest moves for ${T('n')} discs ${T('=2^n-1')}</div>`), 520, 52), ox + 210, 20));
      return [
        { cap: 'From Example 7: 1 disc takes 1 move, 2 discs take 3, 3 discs take 7.', run: async (c) => { for (const e of vals.slice(0, 3)) await c.pop(e, 260); } },
        { cap: '4 discs: move the top 3 off (7), the largest (1), the 3 back on (7): <b>7 + 1 + 7 = 15</b>.', run: async (c) => { await c.pop(vals[3]); await c.fadeIn(sub); } },
        { cap: 'Each new number is <b>double the one before, plus 1</b>: 2 × 15 + 1 = 31, and 2 × 31 + 1 = 63.', run: async (c) => { for (const g of arcs) await show(c, g, 220); await c.pop(vals[4]); await c.pop(vals[5]); } },
        { cap: 'Add 1 to each: <b>2, 4, 8, 16, 32, 64</b>. Those are <b>powers of 2</b>!', run: async (c) => { for (const e of p2) await c.fadeIn(e, 220); for (const e of pw) await c.pop(e, 220); } },
        { cap: `So the fewest moves for ${T('n')} discs is ${T('2^n-1')}. Check: ${T('2^6-1=64-1=63')}.`, run: (c) => c.pop(res) }
      ];
    }
    if (v === 'a') {
      const big = hide(lab(stage, `${T('2^8-1=256-1=255')} moves`, W / 2, 50, 520, 50, 'u5l2-big'));
      const sec = hide(lab(stage, '1 move per second: <b>255 seconds</b>', W / 2, 106, 460, 36, 'u5l2-note'));
      const ps = 2.6, x0 = ox + (940 - 255 * ps) / 2, y = 170, bars = [];
      for (let m = 0; m < 4; m++) { const g = svgEl('g', {}, svg); svgEl('rect', { x: x0 + m * 60 * ps, y, width: 60 * ps - 4, height: 60, rx: 8, fill: '#dbe7fb', stroke: BLU, 'stroke-width': 2.5 }, g); txt(g, x0 + m * 60 * ps + 30 * ps, y + 38, '60 s', { 'font-size': 20, 'font-weight': 800, fill: '#1f3f8a' }); g.style.opacity = 0; bars.push(g); }
      const rest = svgEl('g', {}, svg); svgEl('rect', { x: x0 + 240 * ps, y, width: 15 * ps, height: 60, rx: 6, fill: '#fde2c0', stroke: AMB, 'stroke-width': 2.5 }, rest); txt(rest, x0 + 240 * ps + 7.5 * ps, y + 90, '15 s', { 'font-size': 18, 'font-weight': 800, fill: AMB }); rest.style.opacity = 0;
      const div = hide(lab(stage, `${T('255\\div60=4')} remainder 15 &nbsp; (${T('4\\times60=240')})`, W / 2, 290, 560, 40, 'u5l2-note'));
      const st = hide(stamp(stage, '4 min 15 s', { ok: true, x: W / 2, y: 345, rotate: -5 }));
      return [
        { cap: `8 discs: ${T('2^8-1=256-1=255')} moves. At 1 move per second, that is <b>255 seconds</b>.`, run: async (c) => { await c.pop(big); await c.fadeIn(sec); } },
        { cap: 'How many whole minutes? Fill 60 seconds at a time: 4 minutes is 240 s, and <b>15 s</b> are left.', run: async (c) => { for (const g of bars) await show(c, g, 280); await show(c, rest); await c.fadeIn(div); } },
        { cap: 'It takes <b>4 min 15 s</b>.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    const t = tbl(['Discs', 'Kai: add 2', 'Real: ×2 + 1'], 110, 5), kai = [1, 3, 5, 7, 9], real = [1, 3, 7, 15, 31];
    range(1, 6).forEach((k) => { if (k <= 5) txt(svg, t.X(k), 142, k, { 'font-size': 21, 'font-weight': 800 }); });
    const kv = kai.map((m, i) => hide(txt(svg, t.X(i + 1), 192, m, { 'font-size': 22, 'font-weight': 900, fill: '#e0841a' })));
    const rv = real.map((m, i) => hide(txt(svg, t.X(i + 1), 242, m, { 'font-size': 22, 'font-weight': 900, fill: GRN })));
    const st = hide(stamp(stage, '5 ≠ 7', { ok: false, x: t.X(3) + 10, y: 300, rotate: -6, size: 'sm' }));
    const res = hide(add(stage, box(h('div', 'u5l2-res u5l2-c', '<div>5 discs take <b>31</b> moves, not 9</div>'), 420, 50), ox + 260, 320));
    return [
      { cap: 'Kai looked at only <b>two</b> cases (1 and 3) and guessed “add 2”: 1, 3, 5, 7, 9.', run: async (c) => { for (const e of kv) await show(c, e, 160); } },
      { cap: 'Check a third case: 3 discs take <b>7</b> moves (Example 7), not 5. “Add 2” is wrong.', run: async (c) => { for (const e of rv.slice(0, 3)) await c.pop(e, 260); st.style.opacity = 1; await stampIn(c, st); } },
      { cap: 'The moves <b>double and add 1</b>: 1, 3, 7, 15, 31. 5 discs take <b>31</b> moves.', run: async (c) => { await fade(c, st, 0, 150); for (const e of rv.slice(3)) await c.pop(e, 260); await c.pop(res); } }
    ];
  }
};

/* ======================================================================================
 * Hidden ships: grid helper, Full-notes checkerboard explainer, Example 9
 * ====================================================================================== */
/** a 6 by 6 grid: columns A–F (1–6) across, rows 1–6 up. → { R(col,row) → [x,y] top-left, cs } */
function seaGrid(parent, x, y, cs, o = {}) {
  const g = svgEl('g', {}, parent), R = (c, r) => [x + (c - 1) * cs, y + (6 - r) * cs];
  const cellsG = svgEl('g', {}, g), shade = svgEl('g', {}, g);
  for (let c = 1; c <= 6; c++) for (let r = 1; r <= 6; r++) { const [px, py] = R(c, r); svgEl('rect', { x: px, y: py, width: cs, height: cs, fill: '#fff', stroke: '#8d929c', 'stroke-width': 1.5 }, cellsG); }
  for (let c = 1; c <= 6; c++) txt(g, x + (c - 0.5) * cs, y + 6 * cs + cs * 0.42, 'ABCDEF'[c - 1], { 'font-size': Math.max(14, cs * 0.34), 'font-weight': 800, fill: SLATE });
  for (let r = 1; r <= 6; r++) txt(g, x - cs * 0.32, y + (6 - r + 0.5) * cs + 6, r, { 'font-size': Math.max(14, cs * 0.34), 'font-weight': 800, fill: SLATE });
  const top = svgEl('g', {}, g);
  const hit = (c, r) => { const [px, py] = R(c, r), m = svgEl('g', {}, top), p = cs * 0.24; svgEl('rect', { x: px + 2, y: py + 2, width: cs - 4, height: cs - 4, fill: '#d5d8de' }, m); svgEl('path', { d: `M${px + p} ${py + p} L${px + cs - p} ${py + cs - p} M${px + p} ${py + cs - p} L${px + cs - p} ${py + p}`, stroke: INK, 'stroke-width': Math.max(3, cs * 0.07), 'stroke-linecap': 'round' }, m); return m; };
  const miss = (c, r) => { const [px, py] = R(c, r); return svgEl('circle', { cx: px + cs / 2, cy: py + cs / 2, r: cs * 0.17, fill: 'none', stroke: INK, 'stroke-width': Math.max(2, cs * 0.045) }, top); };
  const outline = (c1, r1, c2, r2, colr = INK, w = 3, dash) => { const [ax, ay] = R(Math.min(c1, c2), Math.max(r1, r2)), wd = (Math.abs(c2 - c1) + 1) * cs, ht = (Math.abs(r2 - r1) + 1) * cs; return svgEl('rect', { x: ax + 5, y: ay + 5, width: wd - 10, height: ht - 10, rx: 8, fill: 'none', stroke: colr, 'stroke-width': w, 'stroke-dasharray': dash || 'none' }, top); };
  const checker = (on = true) => { shade.innerHTML = ''; if (!on) return; for (let c = 1; c <= 6; c++) for (let r = 1; r <= 6; r++) if ((c + r) % 2 === 0) { const [px, py] = R(c, r); svgEl('rect', { x: px + 1, y: py + 1, width: cs - 2, height: cs - 2, fill: '#cfd9ec' }, shade); } };
  return { g, R, cs, hit, miss, outline, checker, top, shade };
}
const EX9 = { hits: [[5, 5], [5, 6], [3, 3]], misses: [[3, 4], [4, 3], [1, 6], [2, 5], [6, 1]] };
const SHIPS9 = [
  { n: 'A3–C3', c1: 1, r1: 3, c2: 3, r2: 3, ok: true },
  { n: 'B3–D3', c1: 2, r1: 3, c2: 4, r2: 3, ok: false, why: 'D3' },
  { n: 'C3–E3', c1: 3, r1: 3, c2: 5, r2: 3, ok: false, why: 'D3' },
  { n: 'C1–C3', c1: 3, r1: 1, c2: 3, r2: 3, ok: true },
  { n: 'C2–C4', c1: 3, r1: 2, c2: 3, r2: 4, ok: false, why: 'C4' },
  { n: 'C3–C5', c1: 3, r1: 3, c2: 3, r2: 5, ok: false, why: 'C4' }
];
function drawEx9(G) {
  EX9.hits.forEach(([c, r]) => G.hit(c, r)); EX9.misses.forEach(([c, r]) => G.miss(c, r));
  G.outline(5, 5, 5, 6, INK, 2.5);
}
const ships = {
  title: 'Make a systematic list, then eliminate',
  height: 380, minW: 940,
  ask: 'Example 9 You hit the 3-ship at C3. C4 and D3 were misses. Where could the 3-ship be?',
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 380), ox = (W - 940) / 2, cs = 50, G = seaGrid(svg, ox + 60, 14, cs);
    drawEx9(G);
    const outs = SHIPS9.map((s) => hide(G.outline(s.c1, s.r1, s.c2, s.r2, s.ok ? GRN : RED, 4.5, s.ok ? 'none' : '10 6')));
    const missRing = (c, r) => { const [px, py] = G.R(c, r); return hide(svgEl('circle', { cx: px + cs / 2, cy: py + cs / 2, r: cs * 0.4, fill: 'none', stroke: RED, 'stroke-width': 4 }, G.top)); };
    const rD3 = missRing(4, 3), rC4 = missRing(3, 4);
    const lx = ox + 450, heads = [hide(lab(stage, '<b>Across</b>', lx + 60, 30, 120, 30, 'u5l2-tag')), hide(lab(stage, '<b>Up and down</b>', lx + 300, 30, 160, 30, 'u5l2-tag'))];
    const rowsE = SHIPS9.map((s, i) => hide(add(stage, box(h('div', 'u5l2-ship ' + (s.ok ? 'u5l2-cyes' : 'u5l2-cno'), `${s.ok ? s.n : `<s>${s.n}</s>`} <small>${s.ok ? 'possible' : s.why + ' miss'}</small>`), 220, 44), lx + (i < 3 ? 0 : 230), 56 + (i % 3) * 54)));
    const call = (() => { const [px, py] = G.R(2, 3); const g = svgEl('g', {}, G.top); svgEl('rect', { x: px + 3, y: py + 3, width: cs - 6, height: cs - 6, rx: 6, fill: '#fff4dd', stroke: AMB, 'stroke-width': 4 }, g); txt(g, px + cs / 2, py + cs / 2 + 8, '?', { 'font-size': 26, 'font-weight': 900, fill: AMB }); g.style.opacity = 0; return g; })();
    const branch = hide(add(stage, box(h('div', 'u5l2-branch', '<div><b>B3 hit</b> → A3–C3: call <b>A3</b> to sink it.</div><div><b>B3 miss</b> → C1–C3: call <b>C2</b> and <b>C1</b>.</div>'), 460, 96), lx, 230));
    const st = (i) => async (c) => { const s = SHIPS9[i]; await show(c, outs[i]); if (!s.ok) { await show(c, s.why === 'D3' ? rD3 : rC4, 200); } await c.fadeIn(rowsE[i]); if (!s.ok) await fade(c, outs[i], 0.18, 400); };
    return [
      { cap: '(a) <b>Across</b> first. <b>A3–C3</b> uses no miss. It could be here.', run: async (c) => { await c.fadeIn(heads[0]); await st(0)(c); } },
      { cap: '<b>B3–D3</b> uses D3, a miss. Cross it out.', run: st(1) },
      { cap: '<b>C3–E3</b> uses D3 too. Out.', run: st(2) },
      { cap: 'Now <b>up and down</b>. <b>C1–C3</b> uses no miss. Possible.', run: async (c) => { await c.fadeIn(heads[1]); await st(3)(c); } },
      { cap: '<b>C2–C4</b> uses C4, a miss. Out.', run: st(4) },
      { cap: '<b>C3–C5</b> uses C4 too. Out. Only <b>A3–C3</b> and <b>C1–C3</b> are left.', run: st(5) },
      { cap: '(b) Call <b>B3</b> (or C2). Either answer tells you exactly where the ship is.', run: async (c) => { await c.pop(call); await c.fadeIn(branch); } },
      { cap: '(c) Mia’s ship, C3–E3, uses D3. D3 was a miss, so no ship can cover it: <b>eliminated</b>.', run: async (c) => { await c.anim(rowsE[2], [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 500); await c.anim(outs[2], [{ opacity: 0.18 }, { opacity: 1 }, { opacity: 0.18 }], 900); } }
    ];
  }
};
const checker = {
  title: 'Every ship covers a shaded square',
  height: 380, minW: 940, ask: 'Why does calling only the shaded squares of a checkerboard always find every ship?',
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 380), ox = (W - 940) / 2, cs = 52, G = seaGrid(svg, ox + 70, 12, cs);
    const shadeG = svgEl('g', {}, svg), cells = [];
    for (let c = 1; c <= 6; c++) for (let r = 1; r <= 6; r++) if ((c + r) % 2 === 0) { const [px, py] = G.R(c, r); const e = svgEl('rect', { x: px + 2, y: py + 2, width: cs - 4, height: cs - 4, fill: '#9fb6e0', opacity: 0.75 }, shadeG); e.style.opacity = 0; cells.push(e); }
    const ship = svgEl('g', {}, svg); ship.style.opacity = 0;
    const body = svgEl('rect', { x: 0, y: 0, width: cs * 2 - 12, height: cs - 12, rx: (cs - 12) / 2, fill: 'rgba(110,74,28,.35)', stroke: BRN, 'stroke-width': 4 }, ship);
    const rings = svgEl('g', {}, svg);
    const place = (c, r, len, vert) => { const [px, py] = G.R(c, vert ? r + len - 1 : r); body.setAttribute('width', vert ? cs - 12 : cs * len - 12); body.setAttribute('height', vert ? cs * len - 12 : cs - 12); ship.setAttribute('transform', `translate(${px + 6} ${py + 6})`); };
    const ringCells = (c, r, len, vert) => { rings.innerHTML = ''; let k = 0; for (let i = 0; i < len; i++) { const cc = c + (vert ? 0 : i), rr = r + (vert ? i : 0); if ((cc + rr) % 2 === 0) { k++; const [px, py] = G.R(cc, rr); svgEl('circle', { cx: px + cs / 2, cy: py + cs / 2, r: cs * 0.36, fill: 'none', stroke: RED, 'stroke-width': 4 }, rings); } } return k; };
    const info = add(stage, box(h('div', 'u5l2-res u5l2-c', '<div>&nbsp;</div>'), 400, 52), ox + 490, 60);
    const note = hide(add(stage, box(h('div', 'u5l2-note2', ''), 400, 140), ox + 490, 140));
    const tour = (list) => async (c) => { for (const [cc, rr, len, vert] of list) { place(cc, rr, len, vert); const k = ringCells(cc, rr, len, vert); info.innerHTML = `<div>${len}-ship covers <b>${k}</b> shaded square${k > 1 ? 's' : ''}</div>`; await c.anim(ship, [{ opacity: 0.2 }, { opacity: 1 }], 300); await c.sleep(650); } };
    return [
      { cap: 'Shade the squares like a checkerboard: <b>18</b> of the 36 squares.', run: async (c) => { for (const e of cells) await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 50); info.innerHTML = '<div><b>18</b> shaded squares</div>'; } },
      { cap: 'Two squares side by side (across or up and down) always have <b>different colours</b>.', run: async (c) => { note.innerHTML = 'Across: shaded, white, shaded, …<br>Up and down: the same.<br>Every neighbour has the other colour.'; await c.fadeIn(note); } },
      { cap: 'So a <b>2-ship</b> always covers exactly <b>1</b> shaded square, wherever it hides.', run: async (c) => { await show(c, ship); await tour([[1, 1, 2, false], [4, 2, 2, false], [6, 3, 2, true], [2, 5, 2, true]])(c); } },
      { cap: 'A <b>3-ship</b> covers <b>1 or 2</b> shaded squares, never 0.', run: tour([[1, 3, 3, false], [2, 3, 3, false], [5, 2, 3, true], [4, 4, 3, true]]) },
      { cap: 'So if you call all 18 shaded squares, you <b>must</b> hit every ship: at most half the calls.', run: async (c) => { rings.innerHTML = ''; await fade(c, ship, 0, 200); info.innerHTML = '<div>18 calls find <b>every</b> ship</div>'; await c.pop(info); } }
    ];
  }
};

mountExplainers({ workBack, variations, pileGame, hops4, ttt, dots, tower, towerPattern, checker, ships });

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
function figures() {
  // a little pile of counters next to the rules
  const pa = document.getElementById('u5l2-pileart');
  if (pa) { const s = svgFig(pa, 170, 110); [[30, 82], [64, 86], [98, 82], [132, 86], [46, 56], [80, 58], [114, 56], [62, 30], [97, 30]].forEach(([x, y]) => coin(s, x, y, 17)); }
  // tic-tac-toe boards
  document.querySelectorAll('.u5l2-xo').forEach((el) => {
    const d = JSON.parse(el.dataset.xo || '{}'), S = d.size || 210, s = svgFig(el, S + 8, S + 8);
    const B = xoBoard(s, 4, 4, S, { nums: !d.nums, big: !!d.nums });
    (d.x || []).forEach((q) => B.mark(q, 'X')); (d.o || []).forEach((q) => B.mark(q, 'O'));
    const fa = svgEl('g', { class: 'u5l2-fa' }, s);
    if (d.ax) B.mark(d.ax, 'X', RED, fa); if (d.ao) B.mark(d.ao, 'O', RED, fa);
  });
  // Example 6 dots
  const e6 = document.getElementById('u5l2-ex6fig');
  if (e6) {
    const s = svgFig(e6, 330, 330), G = dotGrid(s, 30, 22, 90);
    EX6.H.concat(EX6.V).forEach((id) => G.draw(id));
    ['q', 'r', 's'].forEach((k) => { G.draw(EX6[k], '#8b8f99', 3.5, '8 6'); const [a, b] = G.seg(EX6[k]); txt(G.top, (a[0] + b[0]) / 2, a[1] - 9, k, { 'font-size': 21, 'font-style': 'italic', 'font-family': 'Georgia, serif', fill: SLATE }); });
    const fa = svgEl('g', { class: 'u5l2-fa' }, s); const [a, b] = G.seg(EX6.take);
    svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: RED, 'stroke-width': 5, 'stroke-linecap': 'round' }, fa);
    const [cx, cy] = G.P(1.5, 1.5); txt(fa, cx, cy + 26, 'Me', { 'font-size': 18, 'font-weight': 900, fill: RED });
  }
  // the tower with 3 discs
  const tf = document.getElementById('u5l2-towerfig');
  if (tf) { const s = svgFig(tf, 470, 220); const rig = towerRig(s, { px: [85, 235, 385], base: 160, ph: 130, dh: 28, wmin: 48, wstep: 30, names: discLabel, maxN: 3 }); rig.make(3); }
  // Example 9 sea
  const e9 = document.getElementById('u5l2-ex9fig');
  if (e9) {
    const s = svgFig(e9, 330, 330), G = seaGrid(s, 34, 6, 48); drawEx9(G);
    const fa = svgEl('g', { class: 'u5l2-fa' }, s);
    [[1, 3, 3, 3], [3, 1, 3, 3]].forEach(([c1, r1, c2, r2]) => { const [ax, ay] = G.R(Math.min(c1, c2), Math.max(r1, r2)); svgEl('rect', { x: ax + 5, y: ay + 5, width: (c2 - c1 + 1) * 48 - 10, height: (r2 - r1 + 1) * 48 - 10, rx: 8, fill: 'none', stroke: RED, 'stroke-width': 3 }, fa); });
  }
}
figures();
/* the Example 9 and Example 6 answer pictures show with either part's Answer (the figure sits beside the parts) */
document.querySelectorAll('.u5l2-dfig, .u5l2-sfig, .u5l2-ex5 > .u5l2-xo').forEach((el) => {
  const card = el.closest('.card'), sync = () => el.classList.toggle('u5l2-shown', !!card.querySelector('.u5l2-col .part.shown'));
  new MutationObserver(sync).observe(card, { subtree: true, attributes: true, attributeFilter: ['class'] });
});

/* ======================================================================================
 * Little UI helpers for the games
 * ====================================================================================== */
function seg(label, opts, val, onPick) {
  const w = h('div', 'u5l2-seg'); if (label) w.appendChild(h('span', 'u5l2-segl', label));
  const btns = opts.map(([v, t]) => { const b = h('button', '', t); b.type = 'button'; b.setAttribute('aria-pressed', String(v === val)); b.onclick = () => { btns.forEach((x) => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); onPick(v); }; w.appendChild(b); return b; });
  return w;
}
const pill = (t, fn, cls = '') => { const b = h('button', 'pill ' + cls, t); b.type = 'button'; b.onclick = fn; return b; };
function toggle(t, on, fn) { const b = pill(t, () => { on = !on; b.setAttribute('aria-pressed', String(on)); fn(on); }, 'u5l2-tog'); b.setAttribute('aria-pressed', String(on)); return b; }

/* ======================================================================================
 * Game 1: the take-away game against the computer
 * ====================================================================================== */
function gameTakeAway(host) {
  if (!host) return;
  const S = { m: 3, lastWins: true, start: 21, youFirst: true, showWL: false };
  let n, turn, gid = 0, over, left = new Set(), lose, coins = [], score = [0, 0];
  const bar = h('div', 'u5l2-gbar'); host.appendChild(bar);
  bar.append(seg('Take', [[3, '1 to 3'], [4, '1 to 4']], 3, (v) => { S.m = v; reset(); }),
    seg('Last counter', [[true, 'wins'], [false, 'loses']], true, (v) => { S.lastWins = v; reset(); }));
  const startW = h('div', 'u5l2-seg'); startW.appendChild(h('span', 'u5l2-segl', 'Pile'));
  const sv = h('span', 'u5l2-num', String(S.start));
  startW.append(pill('−', () => { S.start = Math.max(5, S.start - 1); sv.textContent = S.start; reset(); }, 'u5l2-pm'), sv, pill('+', () => { S.start = Math.min(30, S.start + 1); sv.textContent = S.start; reset(); }, 'u5l2-pm'));
  bar.append(startW, seg('First', [[true, 'You'], [false, 'Computer']], true, (v) => { S.youFirst = v; reset(); }));
  const strip = h('div', 'u5l2-strip'); host.appendChild(strip);
  const pile = h('div', 'u5l2-pile'); host.appendChild(pile);
  const ctl = h('div', 'u5l2-gctl'); host.appendChild(ctl);
  const takeBtns = h('div', 'u5l2-takes'); ctl.appendChild(takeBtns);
  const status = h('div', 'u5l2-status'); ctl.appendChild(status);
  const right = h('div', 'u5l2-gright'); ctl.appendChild(right);
  right.append(toggle('Show W / L', false, (on) => { S.showWL = on; render(); }), pill('New game', () => reset(), 'dark'));
  const log = h('div', 'u5l2-log'); host.appendChild(log);
  const scoreEl = h('div', 'u5l2-score'); host.appendChild(scoreEl);
  const setScore = () => { scoreEl.innerHTML = `Games: <b>You ${score[0]}</b> · <b>Computer ${score[1]}</b>`; };
  function reset() {
    gid++; n = S.start; over = false; left = new Set(); log.innerHTML = '';
    lose = loseTable(30, S.m, S.lastWins);
    takeBtns.innerHTML = '';
    range(1, S.m).forEach((k) => { const b = pill(`Take ${k}`, () => human(k), 'u5l2-take'); b.dataset.k = k; takeBtns.appendChild(b); });
    buildPile(); turn = S.youFirst ? 'you' : 'cpu'; render();
    if (turn === 'cpu') cpuSoon();
  }
  function buildPile() {
    pile.innerHTML = ''; coins = [];
    const gsz = S.m + 1; let grp = null;
    for (let i = 0; i < S.start; i++) {
      const gi = S.lastWins ? Math.floor(i / gsz) : i === 0 ? -1 : Math.floor((i - 1) / gsz);
      if (!grp || grp.gi !== gi) { grp = h('div', 'u5l2-grp' + (gi < 0 ? ' u5l2-g1st' : '')); grp.gi = gi; pile.appendChild(grp); }
      const cn = h('span', 'u5l2-cn'); grp.appendChild(cn); coins.push(cn);
    }
  }
  function render() {
    pile.classList.toggle('u5l2-grouped', S.showWL);
    coins.forEach((cn, i) => cn.classList.toggle('u5l2-gone', i >= n));
    // the extra counters (beyond the last full group) are amber when the strategy is shown
    const target = !lose[n] ? (() => { for (let k = 1; k <= S.m; k++) if (n - k >= 0 && lose[n - k]) return n - k; return -1; })() : -1;
    coins.forEach((cn, i) => cn.classList.toggle('u5l2-extra', S.showWL && target >= 0 && i >= target && i < n));
    strip.innerHTML = '';
    for (let q = 0; q <= S.start; q++) {
      const cell = h('span', 'u5l2-sc', String(q));
      if (S.showWL) cell.classList.add(lose[q] ? 'u5l2-sL' : 'u5l2-sW');
      if (left.has(q)) cell.classList.add('u5l2-ring');
      if (q === n) cell.classList.add('u5l2-cur');
      strip.appendChild(cell);
    }
    const yours = turn === 'you' && !over;
    takeBtns.querySelectorAll('button').forEach((b) => { b.disabled = !yours || +b.dataset.k > n; });
    if (!over) status.innerHTML = turn === 'you' ? `<b>Your turn.</b> ${n} counter${n === 1 ? '' : 's'}. Take ${listOr(range(1, Math.min(S.m, n)))}.` : `<b>Computer’s turn…</b> ${n} left.`;
    setScore();
  }
  function addLog(who, k) { log.appendChild(h('span', who === 'you' ? 'u5l2-ly' : 'u5l2-lc', `${who === 'you' ? 'You' : 'Computer'} ${k} → <b>${n}</b>`)); }
  function finish(lastBy) {
    over = true;
    const youWin = S.lastWins ? lastBy === 'you' : lastBy === 'cpu';
    score[youWin ? 0 : 1]++;
    const how = S.lastWins ? (lastBy === 'you' ? 'You took the last counter.' : 'The computer took the last counter.') : (lastBy === 'you' ? 'You had to take the last counter.' : 'The computer had to take the last counter.');
    status.innerHTML = `${how} <b class="${youWin ? 'u5l2-win' : 'u5l2-lose'}">${youWin ? 'You win!' : 'The computer wins.'}</b>`;
    render();
  }
  function human(k) { if (over || turn !== 'you' || k > n) return; n -= k; addLog('you', k); if (n === 0) return finish('you'); turn = 'cpu'; render(); cpuSoon(); }
  function cpuSoon() { const g = gid; setTimeout(() => { if (g !== gid || over) return; cpu(); }, 950); }
  function cpu() {
    let k = 0; for (let q = 1; q <= Math.min(S.m, n); q++) if (lose[n - q]) { k = q; break; }
    if (!k) k = 1;    // stuck: take 1 and hope (the booklet's advice)
    n -= k; addLog('cpu', k); left.add(n);
    if (n === 0) return finish('cpu');
    turn = 'you'; render();
  }
  reset();
}

/* ======================================================================================
 * Game 2: tic-tac-toe against the computer
 * ====================================================================================== */
function gameTTT(host) {
  if (!host) return;
  const S = { human: 'X', level: 'check' };
  let b, turn, over, gid = 0, score = [0, 0, 0], hintOn = null;
  const wrap = h('div', 'u5l2-tttwrap'); host.appendChild(wrap);
  const grid = h('div', 'u5l2-tgrid'); wrap.appendChild(grid);
  const cells = range(1, 9).map((s) => { const bt = h('button', 'u5l2-tc', `<small>${s}</small><i></i><em></em>`); bt.type = 'button'; bt.onclick = () => human(s); grid.appendChild(bt); return bt; });
  const side = h('div', 'u5l2-tside'); wrap.appendChild(side);
  side.append(seg('You are', [['X', 'X (first)'], ['O', 'O (second)']], 'X', (v) => { S.human = v; reset(); }),
    seg('Computer', [['check', 'Checklist'], ['perfect', 'Perfect']], 'check', (v) => { S.level = v; reset(); }));
  const btns = h('div', 'u5l2-trow'); side.appendChild(btns);
  btns.append(pill('Hint', () => hint()), pill('New game', () => reset(), 'dark'));
  const status = h('div', 'u5l2-status u5l2-tstat'); side.appendChild(status);
  const scoreEl = h('div', 'u5l2-score'); side.appendChild(scoreEl);
  const cpuP = () => other(S.human);
  function reset() { gid++; b = newBoard(); turn = 'X'; over = false; hintOn = null; render(); if (turn !== S.human) cpuSoon(); else status.innerHTML = '<b>Your turn</b> (X). Tap a square.'; }
  function render() {
    const w = winner(b);
    cells.forEach((bt, i) => { const s = i + 1; bt.querySelector('i').textContent = b[s]; bt.className = 'u5l2-tc' + (b[s] ? ' u5l2-t' + b[s] : '') + (w && w.line.includes(s) ? ' u5l2-twin' : '');
      const em = bt.querySelector('em'); em.textContent = hintOn && hintOn.sq === s ? hintOn.tag : ''; bt.disabled = over || !!b[s] || turn !== S.human; });
    scoreEl.innerHTML = `You <b>${score[0]}</b> · Computer <b>${score[1]}</b> · Ties <b>${score[2]}</b>`;
  }
  function end() {
    const w = winner(b);
    if (w) { over = true; const you = w.p === S.human; score[you ? 0 : 1]++; status.innerHTML = you ? `<b class="u5l2-win">You win</b> with ${lineTxt(w.line)}!` : `<b class="u5l2-lose">The computer wins</b> with ${lineTxt(w.line)}.`; return true; }
    if (!empties(b).length) { over = true; score[2]++; status.innerHTML = '<b>A tie.</b> Nobody made a mistake.'; return true; }
    return false;
  }
  function human(s) { if (over || b[s] || turn !== S.human) return; b[s] = S.human; hintOn = null; turn = cpuP(); if (!end()) { status.innerHTML = '<b>Computer’s turn…</b>'; cpuSoon(); } render(); }
  function cpuSoon() { status.innerHTML = '<b>Computer’s turn…</b>'; const g = gid; render(); setTimeout(() => { if (g !== gid || over) return; cpu(); }, 650); }
  function cpu() {
    const p = cpuP(), s = S.level === 'perfect' ? perfectMove(b, p) : checklist(b, p, true).sq;
    b[s] = p; turn = S.human;
    if (!end()) status.innerHTML = `Computer played <b>${s}</b>. <b>Your turn</b> (${S.human}).`;
    render();
  }
  function hint() {
    if (over || turn !== S.human) return;
    const ck = checklist(b, S.human), why = { 1: `Step 1, <b>Win</b>: ${lineTxt(ck.line || [])}`, 2: `Step 2, <b>Block</b>: ${lineTxt(ck.line || [])}`, 3: 'Step 3, <b>Fork</b>: two threats at once', 4: `Step 4: take the <b>${ck.kind}</b>` }[ck.step];
    hintOn = { sq: ck.sq, tag: ['', 'Win', 'Block', 'Fork', ck.kind === 'centre' ? 'Centre' : ck.kind === 'corner' ? 'Corner' : 'Edge'][ck.step] };
    status.innerHTML = `Hint: square <b>${ck.sq}</b>. ${why}.`; render();
  }
  reset();
}

/* ======================================================================================
 * Game 3: dots and boxes against the computer (3 by 3 boxes)
 * ====================================================================================== */
function gameDots(host) {
  if (!host) return;
  const S = { youFirst: true, counts: false };
  let drawn, owner, turn, over, gid = 0, score;
  const wrap = h('div', 'u5l2-dwrap'); host.appendChild(wrap);
  const sp = 104, pad = 34, size = pad * 2 + sp * 3;
  const s = svgFig(wrap, size, size, 'u5l2-dsvg');
  const P = (i, j) => [pad + i * sp, pad + (3 - j) * sp];
  const fillG = svgEl('g', {}, s), lineG = svgEl('g', {}, s), numG = svgEl('g', {}, s), dotG = svgEl('g', {}, s), hitG = svgEl('g', {}, s);
  const segP = (id) => { const k = id[0], i = +id[1], j = +id[2]; return [P(i, j), k === 'h' ? P(i + 1, j) : P(i, j + 1)]; };
  const lineEl = {}, hitEl = {};
  DLINES.forEach((id) => {
    const [a, b2] = segP(id);
    svgEl('line', { x1: a[0], y1: a[1], x2: b2[0], y2: b2[1], stroke: '#e3dfd6', 'stroke-width': 4, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, lineG);
    lineEl[id] = svgEl('line', { x1: a[0], y1: a[1], x2: b2[0], y2: b2[1], stroke: 'transparent', 'stroke-width': 7, 'stroke-linecap': 'round' }, lineG);
    const hx = svgEl('line', { x1: a[0] + (b2[0] - a[0]) * 0.12, y1: a[1] + (b2[1] - a[1]) * 0.12, x2: b2[0] - (b2[0] - a[0]) * 0.12, y2: b2[1] - (b2[1] - a[1]) * 0.12, stroke: 'transparent', 'stroke-width': 40, class: 'u5l2-dhit' }, hitG);
    hx.addEventListener('click', () => human(id)); hitEl[id] = hx;
  });
  for (let i = 0; i <= 3; i++) for (let j = 0; j <= 3; j++) { const [cx, cy] = P(i, j); svgEl('circle', { cx, cy, r: 8, fill: INK }, dotG); }
  const boxFill = {}, boxTxt = {}, boxNum = {};
  BOXES.forEach(([a, b2]) => { const [x, y] = P(a, b2 + 1), nm = BOXNAME(a, b2);
    boxFill[nm] = svgEl('rect', { x: x + 6, y: y + 6, width: sp - 12, height: sp - 12, rx: 8, fill: 'transparent' }, fillG);
    boxTxt[nm] = txt(fillG, x + sp / 2, y + sp / 2 + 9, '', { 'font-size': 26, 'font-weight': 900 });
    boxNum[nm] = txt(numG, x + sp / 2, y + sp / 2 + 10, '', { 'font-size': 28, 'font-weight': 900, fill: '#c9a46a' }); });
  const side = h('div', 'u5l2-dside'); wrap.appendChild(side);
  side.append(seg('First', [[true, 'You'], [false, 'Computer']], true, (v) => { S.youFirst = v; reset(); }));
  const r2 = h('div', 'u5l2-trow'); side.appendChild(r2);
  r2.append(toggle('Count the sides', false, (on) => { S.counts = on; render(); }), pill('New game', () => reset(), 'dark'));
  const status = h('div', 'u5l2-status u5l2-tstat'); side.appendChild(status);
  const scoreEl = h('div', 'u5l2-dscore'); side.appendChild(scoreEl);
  function reset() { gid++; drawn = new Map(); owner = {}; over = false; score = [0, 0]; turn = S.youFirst ? 'you' : 'cpu'; render(); if (turn === 'cpu') cpuSoon(); else status.innerHTML = '<b>Your turn.</b> Tap between two dots.'; }
  function render() {
    DLINES.forEach((id) => { const who = drawn.get(id); lineEl[id].setAttribute('stroke', who === 'you' ? BLU : who === 'cpu' ? RED : 'transparent'); hitEl[id].style.cursor = who || over ? 'default' : 'pointer'; });
    const set = new Set(drawn.keys());
    BOXES.forEach(([a, b2]) => { const nm = BOXNAME(a, b2), ow = owner[nm];
      boxFill[nm].setAttribute('fill', ow === 'you' ? '#dbe7fb' : ow === 'cpu' ? '#fde2df' : 'transparent');
      boxTxt[nm].textContent = ow === 'you' ? 'You' : ow === 'cpu' ? 'CPU' : ''; boxTxt[nm].setAttribute('fill', ow === 'you' ? BLU : RED);
      const k = countSides(set, a, b2); boxNum[nm].textContent = S.counts && !ow ? k : ''; boxNum[nm].setAttribute('fill', k === 3 ? RED : k === 2 ? AMB : '#c9a46a'); });
    scoreEl.innerHTML = `<span class="u5l2-cy">You <b>${score[0]}</b></span> <span class="u5l2-cc">Computer <b>${score[1]}</b></span>`;
  }
  /** draw a line for who; returns how many boxes it finished */
  function play(id, who) {
    drawn.set(id, who); let made = 0; const set = new Set(drawn.keys());
    boxesOfLine(id).forEach(([a, b2]) => { if (countSides(set, a, b2) === 4) { owner[BOXNAME(a, b2)] = who; made++; } });
    score[who === 'you' ? 0 : 1] += made; return made;
  }
  function checkEnd() { if (drawn.size < DLINES.length) return false; over = true; status.innerHTML = score[0] > score[1] ? `<b class="u5l2-win">You win, ${score[0]} to ${score[1]}!</b>` : `<b class="u5l2-lose">The computer wins, ${score[1]} to ${score[0]}.</b>`; return true; }
  function human(id) {
    if (over || turn !== 'you' || drawn.has(id)) return;
    const made = play(id, 'you'); render();
    if (checkEnd()) return render();
    if (made) { status.innerHTML = `You took ${made === 1 ? 'a box' : made + ' boxes'}! <b>Go again.</b>`; return; }
    turn = 'cpu'; cpuSoon();
  }
  function cpuSoon() { status.innerHTML = '<b>Computer’s turn…</b>'; const g = gid; setTimeout(() => { if (g !== gid || over) return; cpu(); }, 700); }
  /** how many boxes the other player could then take in a row (greedy) */
  function giveaway(id) {
    const set = new Set(drawn.keys()); set.add(id); let n = 0, again = true;
    while (again) { again = false; for (const [a, b2] of BOXES) { if (countSides(set, a, b2) === 3) { const miss = sidesOf(a, b2).find((x) => !set.has(x)); set.add(miss); n++; again = true; } } }
    return n;
  }
  function cpu() {
    const free = DLINES.filter((id) => !drawn.has(id)), set = new Set(drawn.keys());
    let id = null;
    for (const [a, b2] of BOXES) if (countSides(set, a, b2) === 3) { id = sidesOf(a, b2).find((x) => !set.has(x)); break; }       // 1. take a box
    if (!id) { const safe = free.filter((x) => boxesOfLine(x).every(([a, b2]) => countSides(set, a, b2) < 2)); if (safe.length) id = pickR(safe); }   // 2. no third sides
    if (!id) { let best = 99, list = []; free.forEach((x) => { const g = giveaway(x); if (g < best) { best = g; list = [x]; } else if (g === best) list.push(x); }); id = pickR(list); }   // 3. smallest group
    const made = play(id, 'cpu'); render();
    if (checkEnd()) return render();
    if (made) { status.innerHTML = `The computer took ${made === 1 ? 'a box' : made + ' boxes'} and goes again…`; cpuSoon(); return; }
    turn = 'you'; status.innerHTML = '<b>Your turn.</b>';
  }
  reset();
}

/* ======================================================================================
 * Game 4: the tower puzzle (tap a peg to lift, tap a peg to drop; or let it solve itself)
 * ====================================================================================== */
function gameTower(host) {
  if (!host) return;
  let n = 3, moves = 0, sel = null, token = 0, isSolving = false, done = false;
  const bar = h('div', 'u5l2-gbar'); host.appendChild(bar);
  bar.append(seg('Discs', range(1, 6).map((k) => [k, String(k)]), 3, (v) => { n = v; reset(); }));
  const right = h('div', 'u5l2-trow'); bar.appendChild(right);
  const solveB = pill('Solve it for me', () => solve()), stopB = pill('Stop', () => { token++; isSolving = false; stopB.hidden = true; solveB.hidden = false; status.innerHTML = 'Stopped. Tap <b>Start over</b> to try again.'; });
  stopB.hidden = true;
  right.append(solveB, stopB, pill('Start over', () => reset(), 'dark'));
  const W = 900, H = 300, s = svgFig(host, W, H, 'u5l2-tsvg');
  const px = [170, 450, 730], rig = towerRig(s, { px, base: 240, ph: 190, dh: 26, wmin: 56, wstep: 34, names: discLabel, maxN: 6 });
  const hits = px.map((x, i) => { const r = svgEl('rect', { x: x - 135, y: 20, width: 270, height: 260, fill: 'transparent', class: 'u5l2-dhit' }, s); r.addEventListener('click', () => tap(i)); return r; });
  const info = h('div', 'u5l2-gctl'); host.appendChild(info);
  const cnt = h('div', 'u5l2-cntbig', ''); const status = h('div', 'u5l2-status', ''); info.append(cnt, status);
  const LIFT = 240 - 190 - 26 - 6;
  const setCnt = () => { cnt.innerHTML = `Moves: <b>${moves}</b>`; };
  function reset() { token++; isSolving = false; stopB.hidden = true; solveB.hidden = false; rig.make(n); moves = 0; sel = null; done = false; setCnt(); status.innerHTML = `Move all ${n} disc${n > 1 ? 's' : ''} from peg <b>A</b> to peg <b>C</b>. Tap a peg to pick up its top disc.`; }
  function liftTo(i) { const k = rig.stacks[i][rig.stacks[i].length - 1]; rig.discs[k].setAttribute('transform', `translate(${px[i]} ${LIFT})`); }
  function dropAt(i) { const st = rig.stacks[i], k = st[st.length - 1]; rig.discs[k].setAttribute('transform', `translate(${px[i]} ${rig.posY(st.length - 1)})`); }
  function tap(i) {
    if (isSolving || done) return;
    if (sel == null) { if (!rig.stacks[i].length) { status.innerHTML = 'That peg is empty. Tap a peg with a disc on it.'; return; } sel = i; liftTo(i); status.innerHTML = `Now tap the peg to put it on.`; return; }
    if (sel === i) { dropAt(i); sel = null; status.innerHTML = 'Put back. Tap a peg to pick up its top disc.'; return; }
    const from = rig.stacks[sel], to = rig.stacks[i], k = from[from.length - 1];
    if (to.length && to[to.length - 1] < k) {
      status.innerHTML = '<b class="u5l2-lose">Not allowed:</b> a disc can’t go on a smaller disc.';
      host.querySelector('.u5l2-tsvg').animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], 300);
      return;
    }
    from.pop(); to.push(k); dropAt(i); sel = null; moves++; setCnt();
    if (rig.stacks[2].length === n) finish(); else status.innerHTML = 'Tap a peg to pick up its top disc.';
  }
  function finish() {
    done = true; const best = 2 ** n - 1;
    status.innerHTML = moves === best ? `<b class="u5l2-win">Done in ${moves} moves: the fewest possible!</b>` : `<b>Done in ${moves} moves.</b> The fewest possible is ${best}. Try again?`;
  }
  async function solve() {
    reset(); const id = token; isSolving = true; solveB.hidden = true; stopB.hidden = false;
    const M = hanoi(n, 0, 2, 1), ms = n <= 3 ? 700 : n === 4 ? 450 : n === 5 ? 280 : 180;
    const c = { fast: false, check() { if (token !== id) throw new Error('stop'); } };
    try {
      for (let i = 0; i < M.length; i++) {
        const [k, f, t] = M[i];
        await rig.move(c, f, t, ms); moves++; setCnt();
        status.innerHTML = `Move ${i + 1}: disc <b>${discName(n, k)}</b> from ${PEG[f]} to ${PEG[t]}.`;
      }
      done = true; isSolving = false; stopB.hidden = true; solveB.hidden = false;
      status.innerHTML = `<b class="u5l2-win">${M.length} moves</b>: the fewest for ${n} disc${n > 1 ? 's' : ''}.`;
    } catch (e) { /* stopped */ }
  }
  reset(); void hits;
}

/* ======================================================================================
 * Game 5: find the computer's hidden ships
 * ====================================================================================== */
function gameShips(host) {
  if (!host) return;
  let ships, called, calls, gid = 0, over, checkOn = false, hintSq = [];
  const wrap = h('div', 'u5l2-swrap'); host.appendChild(wrap);
  const gridBox = h('div', 'u5l2-sgrid'); wrap.appendChild(gridBox);
  const cells = {};
  for (let r = 6; r >= 1; r--) {
    gridBox.appendChild(h('span', 'u5l2-sax', String(r)));
    for (let c = 1; c <= 6; c++) { const id = 'ABCDEF'[c - 1] + r, b = h('button', 'u5l2-scell', ''); b.type = 'button'; b.setAttribute('aria-label', id); b.onclick = () => call(c, r); gridBox.appendChild(b); cells[id] = b; b.dataset.c = c; b.dataset.r = r; }
  }
  gridBox.appendChild(h('span', ''));
  for (let c = 1; c <= 6; c++) gridBox.appendChild(h('span', 'u5l2-sax', 'ABCDEF'[c - 1]));
  const side = h('div', 'u5l2-dside'); wrap.appendChild(side);
  const r1 = h('div', 'u5l2-trow'); side.appendChild(r1);
  r1.append(toggle('Checkerboard', false, (on) => { checkOn = on; render(); }), pill('Hint', () => hint()));
  const r2 = h('div', 'u5l2-trow'); side.appendChild(r2);
  r2.append(pill('Show the ships', () => { over = true; render(true); status.innerHTML = 'Here they were. Tap <b>New game</b> to play again.'; }), pill('New game', () => reset(), 'dark'));
  const status = h('div', 'u5l2-status u5l2-tstat'); side.appendChild(status);
  const stats = h('div', 'u5l2-score u5l2-sstat'); side.appendChild(stats);
  const key = (c, r) => 'ABCDEF'[c - 1] + r;
  function place() {
    for (;;) {
      const out = [];
      for (const len of [3, 2]) {
        let ok = false;
        for (let t = 0; t < 200 && !ok; t++) {
          const vert = Math.random() < 0.5, c = 1 + rnd(vert ? 6 : 7 - len), r = 1 + rnd(vert ? 7 - len : 6);
          const sq = range(0, len - 1).map((i) => key(c + (vert ? 0 : i), r + (vert ? i : 0)));
          if (sq.some((q) => out.some((sh) => sh.sq.includes(q)))) continue;
          out.push({ len, sq, hits: new Set() }); ok = true;
        }
        if (!ok) break;
      }
      if (out.length === 2) return out;
    }
  }
  function reset() { gid++; ships = place(); called = new Map(); calls = 0; over = false; hintSq = []; render(); status.innerHTML = 'Tap a square to call it.'; }
  function shipAt(id) { return ships.find((sh) => sh.sq.includes(id)); }
  function render(reveal = false) {
    Object.entries(cells).forEach(([id, b]) => {
      const c = +b.dataset.c, r = +b.dataset.r, st = called.get(id), sh = shipAt(id);
      b.className = 'u5l2-scell' + (checkOn && (c + r) % 2 === 0 ? ' u5l2-sshade' : '') + (st === 'hit' ? ' u5l2-shit' : st === 'miss' ? ' u5l2-smiss' : '') +
        (sh && sh.hits.size === sh.len ? ' u5l2-ssunk' : '') + (reveal && sh && !st ? ' u5l2-sreveal' : '') + (hintSq.includes(id) ? ' u5l2-shint' : '');
      b.disabled = over || !!st;
    });
    const sunk = ships.filter((sh) => sh.hits.size === sh.len).length;
    stats.innerHTML = `Calls: <b>${calls}</b> · Ships sunk: <b>${sunk}</b> of 2`;
  }
  function call(c, r) {
    const id = key(c, r); if (over || called.has(id)) return;
    calls++; hintSq = [];
    const sh = shipAt(id);
    if (!sh) { called.set(id, 'miss'); status.innerHTML = `${id}: <b>miss</b>.`; }
    else {
      called.set(id, 'hit'); sh.hits.add(id);
      if (sh.hits.size === sh.len) {
        const all = ships.every((x) => x.hits.size === x.len);
        status.innerHTML = all ? `<b class="u5l2-win">${id}: sunk! You found both ships in ${calls} calls.</b>` : `${id}: <b>hit… sunk!</b> You sank the ${sh.len}-ship.`;
        if (all) over = true;
      } else status.innerHTML = `${id}: <b>hit!</b> Now target the squares next to it.`;
    }
    render();
  }
  function hint() {
    if (over) return;
    const open = ships.flatMap((sh) => (sh.hits.size && sh.hits.size < sh.len ? [...sh.hits] : []));
    const free = (c, r) => c >= 1 && c <= 6 && r >= 1 && r <= 6 && !called.has(key(c, r));
    const pos = (id) => [' ABCDEF'.indexOf(id[0]), +id.slice(1)];
    if (open.length) {
      let list = [];
      const ps = open.map(pos), sameCol = ps.length > 1 && ps.every((p) => p[0] === ps[0][0]), sameRow = ps.length > 1 && ps.every((p) => p[1] === ps[0][1]);
      if (sameCol) { const rs = ps.map((p) => p[1]); list = [[ps[0][0], Math.min(...rs) - 1], [ps[0][0], Math.max(...rs) + 1]]; }
      else if (sameRow) { const cs2 = ps.map((p) => p[0]); list = [[Math.min(...cs2) - 1, ps[0][1]], [Math.max(...cs2) + 1, ps[0][1]]]; }
      else ps.forEach(([c, r]) => list.push([c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]));
      hintSq = list.filter(([c, r]) => free(c, r)).map(([c, r]) => key(c, r));
      status.innerHTML = hintSq.length ? `<b>Target:</b> try ${listOr(hintSq)}.` : '<b>Target:</b> look along the line of your hits.';
    } else {
      hintSq = []; for (let c = 1; c <= 6; c++) for (let r = 1; r <= 6; r++) if ((c + r) % 2 === 0 && free(c, r)) hintSq.push(key(c, r));
      status.innerHTML = '<b>Hunt:</b> call only the shaded squares of the checkerboard.';
    }
    render();
  }
  reset();
}

gameTakeAway(document.getElementById('u5l2-g1'));
gameTTT(document.getElementById('u5l2-g2'));
gameDots(document.getElementById('u5l2-g3'));
gameTower(document.getElementById('u5l2-g4'));
gameShips(document.getElementById('u5l2-g5'));

/* ======================================================================================
 * Math History: Lucas's tower of 64 gold discs (the top 3 move in 7 moves; the count of moves left ticks down)
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u5l2-hist'); if (!svg) return;
  const E = (tag, a, p = svg) => svgEl(tag, a, p);
  E('rect', { x: 0, y: 0, width: 600, height: 300, fill: '#fffaf1' });
  E('rect', { x: 40, y: 254, width: 520, height: 14, rx: 4, fill: '#b07a12', opacity: 0.55 });
  const px = [150, 300, 450];
  px.forEach((x) => { E('path', { d: `M${x - 4} 254 L${x} 60 L${x + 4} 254 Z`, fill: '#cfe6f2', stroke: '#7aa7c0', 'stroke-width': 1.5 }); });
  const N = 64, dh = 2.9, base = 254, discs = [];
  for (let k = N; k >= 1; k--) { const w = 26 + (k - 1) * 2.05; discs[k] = E('rect', { x: -w / 2, y: -dh, width: w, height: dh - 0.4, rx: 1, fill: k % 2 ? '#e2b13c' : '#c9951f' }); }
  const stacks = [range(1, N).reverse(), [], []];
  const place = () => stacks.forEach((st, p) => st.forEach((k, i) => discs[k].setAttribute('transform', `translate(${px[p]} ${base - i * dh})`)));
  [1, 2, 3].forEach((k) => { discs[k].setAttribute('fill', '#ffcf3f'); discs[k].setAttribute('stroke', '#7a4a26'); discs[k].setAttribute('stroke-width', 0.8); });
  const t1 = E('text', { x: 300, y: 30, 'text-anchor': 'middle', 'font-size': 17, 'font-family': 'Georgia, serif', fill: '#4a2c14' }); t1.textContent = 'Moves left for the priests:';
  const t2 = E('text', { x: 300, y: 54, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, 'font-family': 'Georgia, serif', fill: '#b07a12' });
  const t3 = E('text', { x: 300, y: 290, 'text-anchor': 'middle', 'font-size': 15, 'font-family': 'Georgia, serif', fill: '#7a4a26', 'font-style': 'italic' });
  const TOTAL = 18446744073709551615n, fmtBig = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const M = hanoi(3, 0, 2, 1);
  const show = (s) => {   // s in seconds, 0 → 11
    stacks[0] = range(1, N).reverse(); stacks[1] = []; stacks[2] = [];
    const done = Math.max(0, Math.min(7, Math.floor((s - 1) / 1.2)));
    for (let i = 0; i < done; i++) { const [, f, t] = M[i]; stacks[t].push(stacks[f].pop()); }
    place();
    t2.textContent = fmtBig(TOTAL - BigInt(done));
    t3.textContent = done === 7 ? '7 moves done… only 18 quintillion to go!' : 'one move per second…';
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { show(11); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; show(Math.min(s, 11)); if (s < 11) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  show(11);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ============ Stand Up Break! — take-away piles, rule changes, big towers ============ */
standup('u5l2', {
  intro: 'Show your thinking: which numbers you leave, why, and how many you take. For towers, show the moves and the time.',
  levels: {
    BEG: (r) => {
      let n; do { n = r.int(10, 45); } while ([18, 19, 26, 28, 30].includes(n));
      const text = `Take-away game: take <b>1, 2 or 3</b>; the last counter wins. The pile has <b>${n}</b> counters on your turn. How many should you take?`;
      if (n % 4 === 0) return { text, q: '', a: [`${n}=4\\times${n / 4}\\text{, a multiple of 4}`, '\\text{You are stuck: take 1 and hope.}'] };
      const L = n - (n % 4);
      return { text, q: '', a: [`\\text{next multiple of 4 below }${n}\\text{: }${L}`, `${n}-${L}=${n % 4}`, `\\text{take }${n % 4}\\text{, leave }${L}`] };
    },
    PRG: (r) => r.pick([
      () => {
        let n; do { n = r.int(16, 49); } while (n === 38 || n % 5 === 0);
        const L = n - (n % 5);
        return { text: `Take-away game: take <b>1, 2, 3 or 4</b>; the last counter wins. Which numbers should you leave? The pile has <b>${n}</b>: how many do you take?`, q: '',
          a: ['\\text{leave multiples of 5 (5, 10, 15, \\dots)}', `\\text{next multiple of 5 below }${n}\\text{: }${L}`, `${n}-${L}=${n % 5}\\text{: take }${n % 5}`] };
      },
      () => {
        let n; do { n = r.int(14, 41); } while (n % 4 === 1);
        const L = n - ((n - 1) % 4);
        return { text: `Take-away game: take <b>1, 2 or 3</b>, but the player who takes the last counter <b>loses</b>. The pile has <b>${n}</b>: how many do you take?`, q: '',
          a: ['\\text{leave 1, 5, 9, 13, \\dots (one more than a multiple of 4)}', `\\text{the next one below }${n}\\text{: }${L}`, `${n}-${L}=${n - L}\\text{: take }${n - L}`] };
      }
    ])(),
    MAS: (r) => {
      const n = r.int(6, 12), per = r.pick([1, 2, 3]), mv = 2 ** n - 1, s = mv * per, m = Math.floor(s / 60), sec = s % 60;
      return { text: `A tower puzzle has <b>${n} discs</b>. A visitor makes 1 move every ${per === 1 ? 'second' : `<b>${per} seconds</b>`} and never makes a mistake. How long does it take? Give minutes and seconds.`, q: '',
        a: [`2^{${n}}-1=${2 ** n}-1=${mv}\\text{ moves}`, ...(per > 1 ? [`${mv}\\times${per}=${s}\\text{ s}`] : [`${s}\\text{ s}`]), `${s}\\div60=${m}\\text{ R }${sec}`, `${m}\\text{ min }${sec}\\text{ s}`] };
    }
  }
});
