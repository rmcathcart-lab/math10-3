/* Math 10-3 · Unit 5 · Lesson 9 — Unit 5 Review (G1, G5, G6).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its multiple-choice questions appear as chips in the Full-notes "Spot the trap" explainer.
 * Static figures: the mini transversal in the one-page table, the protractor on ∠PQR (Example 2), the Example 7 diagram.
 * Explainers (Class view unless marked):
 *   games    (take-away games played against the computer with the good numbers to leave lighting up; the Tower of Hanoi
 *             solving itself in 7 moves, then the table doubling plus 1 up to 63; Example 1),
 *   protr    (referent wedges 90° + 45° for the estimate, then the protractor sliding onto Q, the inner scale, not 51,
 *             and the reflex 231°; Example 2),
 *   poly     (the loonie's 11-gon splitting into 9 triangles from one corner; the building lot as 2 triangles and a
 *             360° bar; Example 3),
 *   bear     (the compass rose turning clockwise from north to A and B, the dashed bearings back, 300° as 60° west of
 *             north; Example 4),
 *   bisect   (compass-and-straightedge bisector of 58°; the goalie on the bisector of 14°; copying an angle; Example 5),
 *   partners (fill to 90° and fill to 180° for 41°, 86°, 111°; a, b, c around a point with the 360° check; Example 6),
 *   fill8    (one angle fills in all 8 with a reason each, and the 5 named pairs; Example 7),
 *   whyTwo   (Full notes: slide the crossing down the transversal: parallel lines give a copy, other lines do not),
 *   pool     (the ball rolls on the pool table: Z angles, the corner's 90°, the straight line; the two streets that
 *             zoom out until they meet; Example 8),
 *   traps    (Full notes: practice-test multiple choice, with the mistake behind every wrong choice).
 * Then the Stand Up Break (mixed review like the unit test). geo.js covered everything needed. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { Geo, at as gAt, arcD, wedgeD, text as gText, pairName } from '../geo.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const lerp = (a, b, t) => a + (b - a) * t;
const RAD = Math.PI / 180;
const BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', ORANGE = '#e8a01e', INK = '#1c2230', BROWN = '#9a6a24';
/** an absolutely placed box on the stage */
const el = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, html), w, hh), x, y);
/** a box whose mixed text and maths stay together on centred lines */
const cb = (stage, cls, html, x, y, w, hh) => el(stage, cls + ' u5l9-c', `<div>${html}</div>`, x, y, w, hh);
/** a working line (text and maths on one line) */
const ln = (stage, html, x, y, w, hh = 44, cls = '') => el(stage, 'u5l9-line ' + cls, `<div>${html}</div>`, x, y, w, hh);
/** a small label centred on (cx, cy) (translate, so a pop's transform never moves it) */
const tag = (stage, html, cx, cy, cls = '') => { const e = add(stage, h('div', 'u5l9-tag ' + cls, html), cx, cy); e.style.translate = '-50% -50%'; return e; };
const show = (c, e, ms = 400) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms);
const fadeOut = (c, e, ms = 250) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], ms);
const svgOn = (stage, W, H, cls = '') => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l9-svg ' + cls }), 0, 0);
const deg = (v) => `${v}^\\circ`;
const b3 = (b) => String(b).padStart(3, '0');
/** a pencil-free angle: arc (and label) only, drawn into an svg */
const arcOnly = (svg, V, a1, a2, o = {}) => Geo.angle(svg, Object.assign({ vertex: V, a1, a2, arms: false, dot: false }, o));

/* ================= static figures on the cards ================= */
{
  const mini = document.getElementById('u5l9-tvmini');
  if (mini) Geo.transversal(mini, { w: 230, h: 150, tilt: 62, size: 14, nameSize: 14 });
  const f2 = document.getElementById('u5l9-ex2fig');
  if (f2) Geo.protractor(f2, { width: 410, height: 272, r: 160, cx: 205, cy: 205, rot: 0, angle: { vertex: [205, 205], a1: 0, a2: 129, len: 172, names: ['P', 'Q', 'R'] }, buttons: false, readout: false });
  const f7 = document.getElementById('u5l9-ex7fig');
  if (f7) Geo.transversal(f7, { w: 380, h: 300, tilt: 79, size: 19 });
}

/* =====================================================================================
 * 1. Example 1: take-away games and the Tower of Hanoi
 * ===================================================================================== */
const GAME = {
  win: { n: 15, good: [4, 8, 12], first: 3, them: [2, 1, 3] },
  lose: { n: 18, good: [1, 5, 9, 13, 17], first: 1, them: [3, 2, 1, 2] }
};
const G_ASK = {
  win: 'Example 1(a): take 1, 2 or 3 from a pile of <b>15</b>. Whoever takes the <b>last</b> counter <b>wins</b>. You go first.',
  lose: 'Example 1(b): take 1, 2 or 3 from a pile of <b>18</b>. Whoever takes the <b>last</b> counter <b>loses</b>. You go first.',
  hanoi: 'Example 1(c): the Tower of Hanoi. Fill in the table, then find the fewest moves for <b>6</b> discs.'
};
function gameSteps(stage, k, ex) {
  const g = GAME[k], W = ex.W, N = g.n, CW = 50, x0 = (W - N * CW + 10) / 2;
  const ctr = []; for (let i = 0; i < N; i++) ctr.push(el(stage, 'u5l9-ctr', '', x0 + i * CW, 24, 40, 40));
  const cells = {}; for (let v = 1; v <= N; v++) cells[v] = cb(stage, 'u5l9-cell', String(v), x0 + (v - 1) * CW - 3, 104, 46, 44);
  el(stage, 'u5l9-key', '<i class="y"></i> you took &nbsp; <i class="t"></i> the computer took &nbsp; <i class="g"></i> a good number to <b>leave</b>', x0, 162, 700, 26);
  const left = el(stage, 'u5l9-left', `${N} left`, x0, 220, 200, 44);
  const log = hide(cb(stage, 'u5l9-log you', '', x0 + 230, 218, 520, 48));
  const note = hide(cb(stage, 'u5l9-note', k === 'win' ? 'Leave 4. Whatever they take (1, 2 or 3), you take the rest of the 4.' : 'Leave 1. They have to take it, so <b>they lose</b>.', x0, 296, W - 2 * x0, 48));
  let n = N, now = null;
  const setLeft = (v) => { left.textContent = `${v} left`; if (now) now.classList.remove('now'); now = cells[v] || null; if (now) now.classList.add('now'); };
  const take = async (c, m, who) => { for (let i = 0; i < m; i++) { const e = ctr[n - 1 - i]; e.classList.add(who); await c.anim(e, [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], 220); } n -= m; setLeft(n); };
  const say = async (c, who, html) => { log.className = 'u5l9-log u5l9-c ' + who; log.innerHTML = `<div>${html}</div>`; await show(c, log, 250); };
  const mark = async (c, vs) => { for (const v of vs) { cells[v].classList.add('good'); await pulse(c, cells[v], 1.15); } };
  const steps = [];
  if (k === 'win') {
    steps.push({ cap: 'Work backward from the end. If you leave <b>4</b>, they take 1, 2 or 3, and <b>you</b> take the rest.', run: async (c) => { await mark(c, [4]); await c.fadeIn(note); } });
    steps.push({ cap: 'So leaving <b>8</b> or <b>12</b> wins too: they take some, and you bring it down 4 at a time. The <b>multiples of 4</b>.', run: async (c) => { await fadeOut(c, note); await mark(c, [8, 12]); } });
    steps.push({ cap: `Pile of 15: ${T('15-12=3')}. <b>Take 3</b> and leave 12.`, run: async (c) => { await take(c, 3, 'you'); await say(c, 'you', 'You take <b>3</b> → 12 left'); } });
  } else {
    steps.push({ cap: 'Now you want <b>them</b> to be stuck with the last counter. So you want to leave <b>1</b>.', run: async (c) => { await mark(c, [1]); await c.fadeIn(note); } });
    steps.push({ cap: 'Work backward by 4s: <b>5, 9, 13, 17</b>. These are one more than a multiple of 4.', run: async (c) => { await fadeOut(c, note); await mark(c, [5, 9, 13, 17]); } });
    steps.push({ cap: `Pile of 18: ${T('18-17=1')}. <b>Take 1</b> and leave 17.`, run: async (c) => { await take(c, 1, 'you'); await say(c, 'you', 'You take <b>1</b> → 17 left'); } });
  }
  let m = N - g.first;
  g.them.forEach((t, i) => {
    const mine = 4 - t; m -= 4; const last = i === g.them.length - 1, mm = m;
    const cap = k === 'win' && last ? `They take ${t}. You take ${T(`4-${t}=${mine}`)}: the <b>last</b> counter. <b>You win!</b>`
      : k === 'lose' && last ? `They take ${t}. You take ${T(`4-${t}=${mine}`)} and leave <b>1</b>. They must take it: <b>you win!</b>`
        : `They take ${t}. You take ${T(`4-${t}=${mine}`)}, so every round removes 4. Leave <b>${mm}</b>.`;
    steps.push({ cap, run: async (c) => {
      await take(c, t, 'them'); await say(c, 'them', `They take <b>${t}</b>`); await c.sleep(250);
      await take(c, mine, 'you'); await say(c, 'you', `They took ${t}, you take <b>${mine}</b> → ${mm} left`);
      if (last) { const st = stamp(stage, 'You win!', { ok: true, x: W - x0 - 100, y: 320, size: 'lg' }); await stampIn(c, st); }
    } });
  });
  return steps;
}
function hanoiSteps(stage, ex) {
  const W = ex.W, PX = [130, 330, 530], BASE = 222, DH = 28, WID = [84, 124, 164], COL = ['#e8a01e', '#7fa9ea', '#e09a7c'];
  el(stage, 'u5l9-base', '', 30, BASE, 600, 12);
  PX.forEach((x, i) => { el(stage, 'u5l9-peg', '', x - 5, 66, 10, BASE - 66); el(stage, 'u5l9-pegl', 'ABC'[i], x - 20, BASE + 14, 40, 26); });
  const pegs = [[2, 1, 0], [], []];
  const discs = WID.map((w, i) => el(stage, 'u5l9-disc', '', 0, 0, w, DH));
  discs.forEach((d, i) => { d.style.background = COL[i]; });
  const pos = (i, p, lev) => [PX[p] - WID[i] / 2, BASE - (lev + 1) * DH];
  pegs[0].forEach((i, lev) => { const [x, y] = pos(i, 0, lev); discs[i].style.left = x + 'px'; discs[i].style.top = y + 'px'; });
  const mv = el(stage, 'u5l9-mv', 'Moves: <b>0</b>', 680, 90, 240, 40);
  const rule = hide(cb(stage, 'u5l9-note', 'One disc at a time.<br>Never a big disc on a small one.', 680, 140, 250, 70));
  // the table
  const TX = (W - 7 * 104) / 2, TY = 268, vals = [1, 3, 7, 15, 31, 63];
  cb(stage, 'u5l9-hc h', 'Discs', TX, TY, 104, 40); cb(stage, 'u5l9-hc h', 'Fewest moves', TX, TY + 40, 104, 46);
  const top = vals.map((v, i) => cb(stage, 'u5l9-hc', String(i + 1), TX + 104 * (i + 1), TY, 104, 40));
  const bot = vals.map((v, i) => cb(stage, 'u5l9-hc' + (i >= 4 ? ' q' : ''), i >= 4 ? '?' : String(v), TX + 104 * (i + 1), TY + 40, 104, 46));
  const svg = svgOn(stage, W, ex.def.height);
  const arrows = vals.slice(1).map((v, i) => {
    const x1 = TX + 104 * (i + 1) + 60, x2 = TX + 104 * (i + 2) + 44, y = TY + 88;
    const g = svgEl('g', {}, svg);
    svgEl('path', { d: `M${x1} ${y} Q${(x1 + x2) / 2} ${y + 26} ${x2} ${y}`, fill: 'none', stroke: AMBER, 'stroke-width': 2.5 }, g);
    svgEl('path', { d: `M${x2} ${y} l-9 2 l5 6 z`, fill: AMBER }, g);
    const t = svgEl('text', { x: (x1 + x2) / 2, y: y + 30, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'u5l9-arw' }, g); t.textContent = '× 2 + 1';
    g.style.opacity = 0; return g;
  });
  const res = hide(cb(stage, 'u5l9-res', `Rule: ${T('2^n-1')}<br>Check: ${T('2^6-1=64-1=63')} ✓`, 660, 136, 290, 96)); res.style.fontSize = '18px';
  const MOVES = [[0, 2], [0, 1], [2, 1], [0, 2], [1, 0], [1, 2], [0, 2]];
  let count = 0;
  const moveOne = async (c, a, b) => {
    const i = pegs[a].pop(), [x0, y0] = pos(i, a, pegs[a].length), [x1, y1] = pos(i, b, pegs[b].length), up = 34;
    pegs[b].push(i);
    await tween(c, 620, (t) => {
      let x, y;
      if (t < 0.33) { const u = t / 0.33; x = x0; y = lerp(y0, up, u); } else if (t < 0.67) { const u = (t - 0.33) / 0.34; x = lerp(x0, x1, u); y = up; } else { const u = (t - 0.67) / 0.33; x = x1; y = lerp(up, y1, u); }
      discs[i].style.left = x + 'px'; discs[i].style.top = y + 'px';
    }, (t) => t);
    count++; mv.innerHTML = `Moves: <b>${count}</b>`;
  };
  return [
    { cap: 'Move all 3 discs from peg A to peg C. <b>One disc at a time</b>, and never a bigger disc on a smaller one.', run: (c) => c.fadeIn(rule) },
    { cap: 'Watch the fewest moves: the small disc moves every second turn. <b>7 moves</b>, the same as the table.', run: async (c) => { for (const [a, b] of MOVES) await moveOne(c, a, b); top[2].classList.add('on'); bot[2].classList.add('on'); await pulse(c, bot[2], 1.15); } },
    { cap: 'Look along the table: each number is <b>double the one before, plus 1</b>.', run: async (c) => { for (const a of arrows.slice(0, 3)) await show(c, a, 300); } },
    { cap: `${T('15\\times2+1=31')}, then ${T('31\\times2+1=63')}.`, run: async (c) => {
      for (const i of [4, 5]) { await show(c, arrows[i - 1], 300); bot[i].textContent = String(vals[i]); await c.pop(bot[i]); } } },
    { cap: `The rule is ${T('2^n-1')}. Check: ${T('2^6-1=64-1=63')} ✓ <b>6 discs take 63 moves.</b>`, run: async (c) => { await fadeOut(c, rule); await c.pop(res); } }
  ];
}
const games = {
  title: 'Work backward, then look for the pattern',
  height: 390,
  minW: 960,
  capH: 84,
  choices: [{ v: 'win', label: 'Ex 1(a) 15, last one wins' }, { v: 'lose', label: 'Ex 1(b) 18, last one loses' }, { v: 'hanoi', label: 'Ex 1(c) Tower of Hanoi' }],
  ask: (k) => G_ASK[k],
  make: (stage, k, ex) => (k === 'hanoi' ? hanoiSteps(stage, ex) : gameSteps(stage, k, ex))
};

/* =====================================================================================
 * 2. Example 2: estimate with referents, then measure with the protractor
 * ===================================================================================== */
const protr = {
  title: 'Estimate, measure, classify, reflex',
  height: 420,
  minW: 960,
  tap: false,
  ask: 'Example 2: estimate ∠PQR with referents, then measure it, classify it, and find the reflex angle at Q.',
  make(stage, v, ex) {
    const W = ex.W, V = [300, 330], m = 129;
    const P = Geo.protractor(stage, { x: 0, y: 0, width: 620, height: 420, r: 200, cx: 470, cy: 300, rot: 28, angle: { vertex: V, a1: 0, a2: m, len: 250, names: ['P', 'Q', 'R'] }, buttons: false, readout: false });
    P.g.style.opacity = 0;
    const svg = svgOn(stage, 620, 420);
    const w90 = arcOnly(svg, V, 0, 90, { r: 92, fill: BLUE, fillOpacity: 0.18, arcColor: BLUE, label: '90°', labelColor: BLUE, size: 21 });
    const w45 = arcOnly(svg, V, 90, 135, { r: 120, fill: GREEN, fillOpacity: 0.2, arcColor: GREEN, label: '+45°', labelColor: GREEN, size: 21 });
    const r135 = svgEl('path', { d: `M${V[0]} ${V[1]}L${gAt(V, 135, 245).map((q) => q.toFixed(1)).join(' ')}`, stroke: GREEN, 'stroke-width': 2.5, 'stroke-dasharray': '8 6', fill: 'none' }, svg);
    const l135 = gText(svg, ...gAt(V, 137, 262), '135°', { size: 18, color: GREEN });
    const refl = arcOnly(svg, V, 0, m, { reflex: true, r: 46, label: '231°', size: 22 });
    [w90.g, w45.g, r135, l135, refl.g].forEach((e) => hide(e));
    const not51 = hide(tag(stage, 'not 51°', ...gAt(V, 112, 236), 'red'));
    not51.style.textDecoration = 'line-through';
    const X = 650, L = [hide(ln(stage, `Estimate: about <b>${T(deg(130))}</b>`, X, 40, 300)), hide(ln(stage, `Measure: ${T(`\\angle PQR=${deg(m)}`)}`, X, 100, 300)),
      hide(ln(stage, 'Type: <b>obtuse</b>', X, 160, 300)), hide(ln(stage, `Reflex: ${T(`360^\\circ-${deg(m)}`)}`, X, 220, 300)), hide(ln(stage, `${T('=231^\\circ')}`, X + 75, 266, 220))];
    return [
      { cap: 'Estimate first. Compare with a <b>referent</b>: the angle is wider than a right angle, <b>90°</b>…', run: (c) => show(c, w90.g) },
      { cap: `…but a bit less than ${T('90^\\circ+45^\\circ=135^\\circ')}. Estimate: about <b>130°</b>.`, run: async (c) => { await show(c, w45.g); await show(c, r135); await show(c, l135); await c.fadeIn(L[0]); } },
      { cap: 'Now measure. Put the protractor’s <b>centre mark</b> on the vertex, <b>Q</b>.', run: async (c) => { await Promise.all([w90.g, w45.g, r135, l135].map((e) => fadeOut(c, e))); await show(c, P.g); await P.moveTo(c, { cx: V[0], cy: V[1] }); } },
      { cap: 'Turn it so the <b>0 line</b> lies along arm <b>QP</b>.', run: (c) => P.moveTo(c, { rot: 0 }, 800) },
      { cap: `Arm QP is on the 0 of the <b>inner</b> scale, so count up the inner scale: <b>${m}°</b>. Close to our estimate ✓`, run: async (c) => { P.showScale('inner'); await c.fadeIn(L[1]); } },
      { cap: 'The outer scale says 51°, but the angle is wider than 90°: <b>obtuse</b>. So 51° can’t be right.', run: async (c) => { await c.pop(not51); await c.fadeIn(L[2]); } },
      { cap: `(d) The reflex angle goes the <b>long way</b> around Q: ${T(`360^\\circ-${deg(m)}=231^\\circ`)}.`, run: async (c) => { await fadeOut(c, not51); await c.anim(P.g, [{ opacity: 1 }, { opacity: 0.12 }], 400); await show(c, refl.g); await c.fadeIn(L[3]); await c.fadeIn(L[4]); } }
    ];
  }
};

/* =====================================================================================
 * 3. Example 3: polygons split into triangles
 * ===================================================================================== */
const poly = {
  title: 'Diagonals from one corner make triangles',
  height: 400,
  minW: 960,
  choices: [{ v: 'loonie', label: 'Ex 3(a) the loonie, 11 sides' }, { v: 'lot', label: 'Ex 3(b) the building lot' }],
  ask: (k) => (k === 'loonie' ? 'Example 3(a): a loonie has 11 equal sides and 11 equal angles. Find the angle sum, then each angle (nearest tenth).' : 'Example 3(b): a four-sided lot has angles 83°, 96° and 112°. Find the fourth angle, x.'),
  make(stage, k, ex) {
    const W = ex.W, svg = svgOn(stage, W, 400), X = 500;
    if (k === 'loonie') {
      const C = [240, 205], R = 180, n = 11, Pt = []; for (let i = 0; i < n; i++) Pt.push(gAt(C, 90 + i * 360 / n, R));
      const pp = (a) => a.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ');
      svgEl('polygon', { points: pp(Pt), fill: '#f3dc8f', stroke: '#8a6a10', 'stroke-width': 3.5 }, svg);
      const fills = [], nums = [], diags = [];
      for (let i = 1; i <= n - 2; i++) {
        const f = svgEl('polygon', { points: pp([Pt[0], Pt[i], Pt[i + 1]]), fill: i % 2 ? '#e8c45a' : '#f8e7ad', stroke: 'none' }, svg); hide(f); fills.push(f);
      }
      for (let i = 2; i <= n - 2; i++) { const d = svgEl('path', { d: `M${Pt[0].join(' ')}L${Pt[i].join(' ')}`, stroke: '#6e4a1c', 'stroke-width': 2.5, fill: 'none' }, svg); hide(d); diags.push(d); }
      svgEl('polygon', { points: pp(Pt), fill: 'none', stroke: '#8a6a10', 'stroke-width': 3.5 }, svg);
      for (let i = 1; i <= n - 2; i++) { const g = [(Pt[0][0] + Pt[i][0] + Pt[i + 1][0]) / 3, (Pt[0][1] + Pt[i][1] + Pt[i + 1][1]) / 3]; const t = svgEl('text', { x: g[0].toFixed(1), y: g[1].toFixed(1), class: 'u5l9-tn' }, svg); t.textContent = i; hide(t); nums.push(t); }
      svgEl('circle', { cx: Pt[0][0], cy: Pt[0][1], r: 6, fill: RED }, svg);
      const a6 = arcOnly(svg, Pt[6], Pt[5], Pt[7], { r: 30, arcColor: RED, label: '147.3°', labelColor: RED, size: 18 }); hide(a6.g);
      const L = [hide(ln(stage, '<b>9</b> triangles: that is 11 − 2', X, 40, 440)),
        hide(ln(stage, `${T('(11-2)\\times180^\\circ=9\\times180^\\circ')}`, X, 110, 440)), hide(ln(stage, `${T('=1\\,620^\\circ')} <span class="u5l9-small">&nbsp;the angle sum</span>`, X + 60, 158, 380)),
        hide(ln(stage, `${T('1\\,620^\\circ\\div11\\approx147.3^\\circ')}`, X, 230, 440)), hide(ln(stage, '<span class="u5l9-small">each angle: obtuse, as it looks ✓</span>', X, 276, 440))];
      return [
        { cap: 'Pick one corner. Draw every <b>diagonal</b> from it to the other corners.', run: async (c) => { for (const d of diags) await c.anim(d, [{ opacity: 0 }, { opacity: 1 }], 160); } },
        { cap: 'Count the triangles: <b>9</b>. A polygon always gives 2 fewer triangles than its sides: 11 − 2.', run: async (c) => { for (let i = 0; i < fills.length; i++) { show(c, fills[i], 200); await c.pop(nums[i], 220); } await c.fadeIn(L[0]); } },
        { cap: `Each triangle holds 180°: ${T('(11-2)\\times180^\\circ=1\\,620^\\circ')}.`, run: async (c) => { await c.fadeIn(L[1]); await c.fadeIn(L[2]); } },
        { cap: `11 equal angles share it: ${T('1\\,620^\\circ\\div11\\approx147.3^\\circ')} each.`, run: async (c) => { await show(c, a6.g); await c.fadeIn(L[3]); await c.fadeIn(L[4]); } }
      ];
    }
    // the building lot (to the booklet's shape)
    const S = 92, O = [40, 360], q = (x, y) => [O[0] + x * S, O[1] - y * S];
    const A = q(0, 0), B = q(3, 0), Cc = q(3.19, 1.79), D = q(0.4, 3.27);
    const pp = (a) => a.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
    const t1 = svgEl('polygon', { points: pp([A, B, Cc]), fill: '#cfe0fb', stroke: 'none' }, svg), t2 = svgEl('polygon', { points: pp([A, Cc, D]), fill: '#f8e7ad', stroke: 'none' }, svg);
    hide(t1, t2);
    svgEl('polygon', { points: pp([A, B, Cc, D]), fill: 'none', stroke: INK, 'stroke-width': 3 }, svg);
    const dg = svgEl('path', { d: `M${A.join(' ')}L${Cc.join(' ')}`, stroke: '#6e4a1c', 'stroke-width': 2.5, 'stroke-dasharray': '8 6', fill: 'none' }, svg); hide(dg);
    arcOnly(svg, A, B, D, { r: 34, label: '83°', size: 19 }); arcOnly(svg, B, Cc, A, { r: 34, label: '96°', size: 19 }); arcOnly(svg, Cc, D, B, { r: 30, label: '112°', size: 19 });
    const xl = arcOnly(svg, D, A, Cc, { r: 36, label: 'x', size: 22, arcColor: RED, labelColor: RED });
    // the 360° bar
    const BX = 420, BW = 500, sc = BW / 360, BY = 190, parts = [[83, '#9aa0ab'], [96, '#b9bec7'], [112, '#9aa0ab'], [69, RED]];
    const bar = el(stage, 'u5l9-hc', '', BX, BY, BW, 50); bar.style.background = '#fff';
    const segs = []; let acc = 0;
    parts.forEach(([v, colr], i) => { const s = el(stage, 'u5l9-hc', i === 3 ? '<b style="color:#fff">x</b>' : `${v}°`, BX + acc * sc, BY, v * sc, 50); s.style.background = colr; s.style.color = i === 3 ? '#fff' : INK; hide(s); segs.push(s); acc += v; });
    const top = hide(tag(stage, '360° in all', BX + BW / 2, BY - 20, 'lg'));
    const L = [hide(ln(stage, `${T('(4-2)\\times180^\\circ=360^\\circ')}`, BX, 50, 460)), hide(ln(stage, `${T('x=360^\\circ-83^\\circ-96^\\circ-112^\\circ')}`, BX, 270, 520)), hide(ln(stage, `${T('x=69^\\circ')}`, BX + 30, 320, 200))];
    return [
      { cap: `A quadrilateral: one diagonal makes <b>2 triangles</b>. ${T('(4-2)\\times180^\\circ=360^\\circ')}.`, run: async (c) => { await show(c, dg); await show(c, t1); await show(c, t2); await c.fadeIn(L[0]); await c.pop(top); } },
      { cap: 'Take away the three angles you know.', run: async (c) => { for (const s of segs.slice(0, 3)) await show(c, s, 300); await c.fadeIn(L[1]); } },
      { cap: `What is left is x: <b>69°</b>. Check: the x corner looks acute, a bit smaller than the 83° corner ✓`, run: async (c) => { await c.pop(segs[3]); await c.fadeIn(L[2]); xl.label.textContent = '69°'; await pulse(c, xl.g, 1.08); } }
    ];
  }
};

/* =====================================================================================
 * 4. Example 4: true bearings on the compass rose
 * ===================================================================================== */
const BEAR_ASK = {
  a: 'Example 4(a): what is the true bearing of the camp, A, from the dock?',
  b: 'Example 4(b): what is the true bearing of the cabin, B, from the dock?',
  c: 'Example 4(c): the plane flies to the camp. On what bearing does it fly back to the dock?',
  d: 'Example 4(d): on what bearing does it fly from the cabin back to the dock?',
  e: 'Example 4(e): sketch a bearing of 300° on the north arrow. Which referent helps?'
};
const bear = {
  title: 'From north, turn clockwise',
  height: 420,
  minW: 960,
  choices: [{ v: 'a', label: '(a) to A' }, { v: 'b', label: '(b) to B' }, { v: 'c', label: '(c) A back to D' }, { v: 'd', label: '(d) B back to D' }, { v: 'e', label: '(e) sketch 300°' }],
  ask: (k) => BEAR_ASK[k],
  make(stage, k, ex) {
    const W = ex.W, R = Geo.compassRose(stage, { x: 30, y: 0, width: 420, height: 420, points: 8, r: 150 });
    const ptOn = (b, s, colr) => { const p = gAt(R.C, 90 - b, R.R * 0.96 + 26); gText(R.g, p[0], p[1], s, { size: 26, italic: true, color: colr }); };
    if (k !== 'e') { R.add(62, { color: '#b9bec7', arc: false, label: false, width: 3 }); R.add(205, { color: '#b9bec7', arc: false, label: false, width: 3 }); ptOn(62, 'A', '#6a7182'); ptOn(205, 'B', '#6a7182'); }
    const D = gAt(R.C, -45, 28); gText(R.g, D[0], D[1], 'D', { size: 24, italic: true });
    const X = 500, L = (html, y, w = 440) => hide(ln(stage, html, X, y, w));
    if (k === 'a') {
      const l1 = L(`A from D: <b>${T('062^\\circ')}</b>`, 120);
      return [
        { cap: 'Stand at the dock. Face <b>north</b>, then turn <b>clockwise</b> until you face the camp, A.', run: (c) => R.turn(c, 62) },
        { cap: `The turn is 62°. A bearing always has <b>3 digits</b>: <b>${T('062^\\circ')}</b>.`, run: (c) => c.fadeIn(l1) }
      ];
    }
    if (k === 'b') {
      const l1 = L(`north to south: ${T('180^\\circ')}`, 100), l2 = L(`${T('180^\\circ+25^\\circ=205^\\circ')}`, 160);
      return [
        { cap: 'Face north and turn clockwise all the way to <b>south</b>. That is <b>180°</b>.', run: async (c) => { await R.turn(c, 180); await c.fadeIn(l1); } },
        { cap: `Keep turning <b>25°</b> more, past south, to the cabin: ${T('180^\\circ+25^\\circ=205^\\circ')}.`, run: async (c) => { await tween(c, 700, (t) => { R.set(180 + 25 * t); }); await c.fadeIn(l2); } }
      ];
    }
    if (k === 'c' || k === 'd') {
      const b = k === 'c' ? 62 : 205, bk = k === 'c' ? 242 : 25, add = b < 180;
      const l1 = L(`out: ${T(b3(b) + '^\\circ')}`, 90), l2 = L(add ? `${T('062^\\circ')} is less than ${T('180^\\circ')}: <b>add</b>` : `${T('205^\\circ')} is more than ${T('180^\\circ')}: <b>subtract</b>`, 150),
        l3 = L(`back: ${T(`${b3(b)}^\\circ${add ? '+' : '-'}180^\\circ=${b3(bk)}^\\circ`)}`, 210);
      return [
        { cap: `First the trip out: from the dock, ${k === 'c' ? 'the camp' : 'the cabin'} is at <b>${T(b3(b) + '^\\circ')}</b>.`, run: async (c) => { await R.turn(c, b); await c.fadeIn(l1); } },
        { cap: `Coming back, the plane faces the <b>opposite</b> way: half a turn, 180°. ${add ? `${b3(b)}° is less than 180°, so <b>add</b>.` : `${b3(b)}° is more than 180°, so <b>subtract</b>.`}`, run: async (c) => { await c.fadeIn(l2); await R.back(c); } },
        { cap: `${T(`${b3(b)}^\\circ${add ? '+' : '-'}180^\\circ=${b3(bk)}^\\circ`)}. The back bearing is <b>${b3(bk)}°</b>.`, run: (c) => c.fadeIn(l3) }
      ];
    }
    const a60 = Geo.angle(R.g, { vertex: R.C, a1: 90, a2: 150, arms: false, dot: false, r: 74, arcColor: BLUE, label: '60°', labelColor: BLUE, size: 22 }); hide(a60.g);
    const r30 = svgEl('path', { d: `M${R.C.join(' ')}L${gAt(R.C, 120, R.R * 0.9).map((v) => v.toFixed(1)).join(' ')}`, stroke: BLUE, 'stroke-width': 2, 'stroke-dasharray': '6 6', fill: 'none' }, R.g); hide(r30);
    const l1 = L(`${T('300^\\circ=360^\\circ-60^\\circ')}`, 100), l2 = L('<b>60°</b> west of north', 160), l3 = L('<span class="u5l9-small">two 30° referents, or one 60°</span>', 210);
    return [
      { cap: `300° is most of a full turn. Think backward from 360°: ${T('360^\\circ-300^\\circ=60^\\circ')} short.`, run: (c) => c.fadeIn(l1) },
      { cap: 'Turn clockwise from north to 300°…', run: (c) => R.turn(c, 300, 1800) },
      { cap: '…the line is <b>60° west of north</b>. Sketch it with two 30° referents (or one 60°).', run: async (c) => { await show(c, a60.g); await show(c, r30); await c.fadeIn(l2); await c.fadeIn(l3); } }
    ];
  }
};

/* =====================================================================================
 * 5. Example 5: compass and straightedge; the goalie
 * ===================================================================================== */
const bisect = {
  title: 'Compass and straightedge',
  height: 400,
  minW: 960,
  choices: [{ v: 'b58', label: 'Ex 5(c) bisect 58°' }, { v: 'goal', label: 'Ex 5(a) the goalie, 14°' }, { v: 'copy', label: 'Ex 5(b) copy an angle' }],
  ask: (k) => ({ b58: 'Example 5(c): bisect this 58° angle with a compass and a straightedge. Check with a protractor.',
    goal: 'Example 5(a): from the puck, the lines to the two posts make a 14° angle. The goalie stands on the bisector. What angle does the goalie’s line make with each post line?',
    copy: 'Example 5(b): one way to copy the ceiling angle onto the board: compass and straightedge. (A protractor, a sliding T-bevel or tracing work too.)' })[k],
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'b58') {
      const K = Geo.construct(stage, Geo.construct.bisect({ vertex: [250, 362], a1: 0, a2: 58, len: 400, names: [null, 'B', null] }), { x: (W - 940) / 2, y: 0, width: 940, height: 400 });
      return K.steps;
    }
    if (k === 'copy') {
      const K = Geo.construct(stage, Geo.construct.copy({ from: { vertex: [70, 340], a1: 0, a2: 50, len: 320 }, to: { vertex: [520, 340], dir: 0, len: 360 } }), { x: (W - 940) / 2, y: 0, width: 940, height: 400 });
      return K.steps;
    }
    // the goalie
    const svg = svgOn(stage, W, 400), Pk = [80, 200], GX = 820, half = 7, dy = (GX - Pk[0]) * Math.tan(half * RAD), P1 = [GX, 200 - dy], P2 = [GX, 200 + dy];
    svgEl('rect', { x: GX, y: P1[1] - 4, width: 60, height: P2[1] - P1[1] + 8, fill: '#f2f4f7', stroke: '#9aa0ab', 'stroke-width': 2 }, svg);
    for (let y = P1[1] + 14; y < P2[1]; y += 18) svgEl('path', { d: `M${GX} ${y}H${GX + 60}`, stroke: '#d5d8dd', 'stroke-width': 1.5 }, svg);
    svgEl('path', { d: `M${GX} 30V370`, stroke: RED, 'stroke-width': 4 }, svg);
    [P1, P2].forEach((p) => svgEl('circle', { cx: p[0], cy: p[1], r: 9, fill: RED }, svg));
    svgEl('ellipse', { cx: Pk[0], cy: Pk[1], rx: 16, ry: 9, fill: INK }, svg);
    gText(svg, Pk[0], Pk[1] + 30, 'puck', { size: 18, color: '#6a7182' });
    gText(svg, GX + 30, P1[1] - 26, 'post', { size: 17, color: '#6a7182' }); gText(svg, GX + 30, P2[1] + 26, 'post', { size: 17, color: '#6a7182' });
    const l1 = svgEl('path', { d: `M${Pk.join(' ')}L${P1.join(' ')}`, stroke: INK, 'stroke-width': 3, fill: 'none' }, svg), l2 = svgEl('path', { d: `M${Pk.join(' ')}L${P2.join(' ')}`, stroke: INK, 'stroke-width': 3, fill: 'none' }, svg);
    const a14 = arcOnly(svg, Pk, -half, half, { r: 300, label: '14°', size: 21, labelR: 250 });
    const bis = svgEl('path', { d: `M${Pk.join(' ')}L${GX} 200`, stroke: BLUE, 'stroke-width': 3, 'stroke-dasharray': '10 7', fill: 'none' }, svg);
    const gl = svgEl('g', {}, svg); svgEl('rect', { x: 724, y: 176, width: 30, height: 48, rx: 10, fill: '#1f5bd6' }, gl); svgEl('circle', { cx: 739, cy: 164, r: 11, fill: '#f2c9a0', stroke: '#1c2230', 'stroke-width': 2 }, gl); svgEl('rect', { x: 716, y: 222, width: 46, height: 14, rx: 5, fill: '#fff', stroke: '#1c2230', 'stroke-width': 2 }, gl);
    gl.style.transformBox = 'fill-box'; gl.style.transformOrigin = 'center';
    const h1 = arcOnly(svg, Pk, 0, half, { r: 420, label: '7°', size: 19, arcColor: GREEN, labelColor: GREEN, labelR: 470 }), h2 = arcOnly(svg, Pk, -half, 0, { r: 420, label: '7°', size: 19, arcColor: AMBER, labelColor: AMBER, labelR: 470 });
    hide(l1, l2, a14.g, bis, gl, h1.g, h2.g);
    const res = hide(cb(stage, 'u5l9-res', `${T('14^\\circ\\div2=7^\\circ')} on each side`, 150, 320, 340, 52));
    return [
      { cap: 'From the puck, the lines to the two posts make a <b>14°</b> angle.', run: async (c) => { await show(c, l1); await show(c, l2); await show(c, a14.g); } },
      { cap: 'The goalie stands on the <b>bisector</b>: the line that cuts the angle into <b>two equal angles</b>.', run: async (c) => { await show(c, bis, 500); await c.pop(gl); } },
      { cap: `Each half: ${T('14^\\circ\\div2=7^\\circ')}. The goalie is just as far (in angle) from each post.`, run: async (c) => { await fadeOut(c, a14.g); await show(c, h1.g); await show(c, h2.g); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 6. Example 6: complements, supplements, angles around a point
 * ===================================================================================== */
const partners = {
  title: 'Fill to 90°, fill to 180°, go around the point',
  height: 400,
  minW: 960,
  choices: [{ v: 41, label: '41°' }, { v: 86, label: '86°' }, { v: 111, label: '111°' }, { sep: 'Example 6(b):' }, { v: 'pt', label: 'find a, b and c' }],
  ask: (k) => (k === 'pt' ? 'Example 6(b): find a, b and c. Give a reason for each.' : `Example 6(a): the ${k}° angle. What type is it? Find its complement and its supplement.`),
  make(stage, k, ex) {
    const W = ex.W, svg = svgOn(stage, W, 400);
    if (k !== 'pt') {
      const v = k, V1 = [150, 330], V2 = [700, 330];
      el(stage, 'u5l9-pan', 'Complement: fill to 90°', 40, 10, 380, 26); el(stage, 'u5l9-pan', 'Supplement: fill to 180°', 470, 10, 460, 26);
      Geo.angle(svg, { vertex: V1, a1: 0, a2: 90, len: 260, color: '#b9bec7', arc: false, dot: false });
      Geo.angle(svg, { vertex: V2, a1: 0, a2: 180, len: 250, color: '#b9bec7', arc: false, dot: false });
      const A1 = Geo.angle(svg, { vertex: V1, a1: 0, a2: v, len: 240, r: 64, label: true, color: BLUE, fill: BLUE, size: 22 });
      const A2 = Geo.angle(svg, { vertex: V2, a1: 0, a2: v, len: 230, r: 64, label: true, color: BLUE, fill: BLUE, size: 22 });
      hide(A1.g, A2.g);
      const comp = v < 90 ? arcOnly(svg, V1, v, 90, { r: 104, fill: GREEN, arcColor: GREEN, label: `${90 - v}°`, labelColor: GREEN, size: 22 }) : null;
      const supp = arcOnly(svg, V2, v, 180, { r: 104, fill: ORANGE, arcColor: AMBER, label: `${180 - v}°`, labelColor: AMBER, size: 22 });
      if (comp) hide(comp.g); hide(supp.g);
      const no = v > 90 ? hide(stamp(stage, 'none', { ok: false, x: 300, y: 120, size: 'lg' })) : null;
      const l1 = hide(cb(stage, 'u5l9-res', v < 90 ? T(`90^\\circ-${v}^\\circ=${90 - v}^\\circ`) : `${T(`${v}^\\circ>90^\\circ`)}: <b>none</b>`, 60, 352, 300, 44));
      const l2 = hide(cb(stage, 'u5l9-res', T(`180^\\circ-${v}^\\circ=${180 - v}^\\circ`), 560, 352, 300, 44));
      return [
        { cap: `${v}° is ${v < 90 ? 'less than 90°: <b>acute</b>' : 'between 90° and 180°: <b>obtuse</b>'}.`, run: async (c) => { await show(c, A1.g); await show(c, A2.g); } },
        v < 90 ? { cap: `Complement: the part that fills it up to 90°. ${T(`90^\\circ-${v}^\\circ=${90 - v}^\\circ`)}.`, run: async (c) => { await show(c, comp.g); await c.pop(l1); } }
          : { cap: `Complement: <b>none</b>. ${v}° is already more than 90°, so nothing fills it up to 90°.`, run: async (c) => { await c.shake(A1.g); await stampIn(c, no); await c.pop(l1); } },
        { cap: `Supplement: the part that fills it up to 180°, a straight line. ${T(`180^\\circ-${v}^\\circ=${180 - v}^\\circ`)}.`, run: async (c) => { await show(c, supp.g); await c.pop(l2); } }
      ];
    }
    // Example 6(b): angles around a point
    const C = [270, 205], RL = 200;
    const seg = (d1, d2, L1, L2) => svgEl('path', { d: `M${gAt(C, d1, L1).join(' ')}L${gAt(C, d2, L2).join(' ')}`, stroke: INK, 'stroke-width': 3, fill: 'none' }, svg);
    seg(0, 180, 230, 230); seg(53, 233, RL, 185); svgEl('path', { d: `M${C.join(' ')}L${gAt(C, 143, 190).join(' ')}`, stroke: INK, 'stroke-width': 3, fill: 'none' }, svg);
    svgEl('circle', { cx: C[0], cy: C[1], r: 5, fill: INK }, svg);
    const W53 = arcOnly(svg, C, 0, 53, { r: 70, label: '53°', size: 21, fill: '#9aa0ab', fillOpacity: 0.12 });
    const W90 = arcOnly(svg, C, 53, 143, { size: 21, fill: '#9aa0ab', fillOpacity: 0.12 });
    const Wa = arcOnly(svg, C, 143, 180, { r: 70, label: 'a', size: 23, fill: '#9aa0ab', fillOpacity: 0.12 });
    const Wb = arcOnly(svg, C, 180, 233, { r: 70, label: 'b', size: 23, fill: '#9aa0ab', fillOpacity: 0.12 });
    const Wc = arcOnly(svg, C, 233, 360, { r: 54, label: 'c', size: 23, fill: '#9aa0ab', fillOpacity: 0.12 });
    const setFill = (A, colr, op = 0.3) => { if (A.wedge) { A.wedge.setAttribute('fill', colr); A.wedge.setAttribute('fill-opacity', op); } };
    const X = 560, L = [hide(ln(stage, `${T('a=180^\\circ-53^\\circ-90^\\circ=37^\\circ')}`, X, 30, 390)), hide(ln(stage, '<span class="u5l9-small">angles on a straight line</span>', X + 40, 70, 350, 30)),
      hide(ln(stage, `${T('b=53^\\circ')}`, X, 112, 390)), hide(ln(stage, '<span class="u5l9-small">vertically opposite the 53°</span>', X + 40, 152, 350, 30)),
      hide(ln(stage, `${T('c=180^\\circ-53^\\circ=127^\\circ')}`, X, 194, 390)), hide(ln(stage, '<span class="u5l9-small">supplementary to b</span>', X + 40, 234, 350, 30)),
      hide(cb(stage, 'u5l9-res', `${T('53+90+37+53+127=360')} ✓`, X - 10, 290, 380, 50))];
    const ring = svgEl('path', { d: arcD(C, 120, 0, 359.9), stroke: GREEN, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '4 6' }, svg); hide(ring);
    return [
      { cap: `a, the right angle and 53° sit on a <b>straight line</b> (180°): ${T('a=180^\\circ-53^\\circ-90^\\circ=37^\\circ')}.`, run: async (c) => { [W53, W90, Wa].forEach((A) => setFill(A, ORANGE)); Wa.label.textContent = '37°'; await pulse(c, Wa.g, 1.06); await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
      { cap: 'b and the 53° angle make an <b>X</b>: vertically opposite, so <b>b = 53°</b>.', run: async (c) => { [W53, W90, Wa].forEach((A) => setFill(A, '#9aa0ab', 0.12)); [W53, Wb].forEach((A) => setFill(A, BLUE)); Wb.label.textContent = '53°'; await pulse(c, Wb.g, 1.06); await c.fadeIn(L[2]); await c.fadeIn(L[3]); } },
      { cap: `c and b sit on a straight line: ${T('c=180^\\circ-53^\\circ=127^\\circ')} (supplementary).`, run: async (c) => { [W53].forEach((A) => setFill(A, '#9aa0ab', 0.12)); [Wb, Wc].forEach((A) => setFill(A, GREEN)); Wc.label.textContent = '127°'; await pulse(c, Wc.g, 1.06); await c.fadeIn(L[4]); await c.fadeIn(L[5]); } },
      { cap: 'Check: all the way around a point is <b>360°</b>. 53 + 90 + 37 + 53 + 127 = 360 ✓', run: async (c) => { [Wb, Wc].forEach((A) => setFill(A, '#9aa0ab', 0.12)); ring.style.opacity = 1; ring.style.strokeDasharray = '760'; await tween(c, 900, (t) => { ring.style.strokeDashoffset = String(760 * (1 - t)); }); await c.pop(L[6]); } }
    ];
  }
};

/* =====================================================================================
 * 7. Example 7: one angle fills in all eight
 * ===================================================================================== */
const ALL8 = [
  [5, 101, 'vertically opposite ∠7', [5, 7]], [6, 79, 'supplementary to ∠7', [6, 7]], [8, 79, 'vertically opposite ∠6', [6, 8]],
  [3, 101, 'corresponding to ∠7', [3, 7]], [1, 101, 'alternate exterior to ∠7', [1, 7]], [2, 79, 'corresponding to ∠6', [2, 6]], [4, 79, 'alternate interior to ∠6', [4, 6]]
];
const NAMES7 = [[[2, 6], 'corresponding', 'equal'], [[3, 5], 'alternate interior', 'equal'], [[1, 7], 'alternate exterior', 'equal'], [[4, 5], 'interior, same side', 'add to 180°'], [[1, 8], 'exterior, same side', 'add to 180°']];
const SHAPE = { corresponding: ' (F)', 'alternate interior': ' (Z)', 'interior, same side': ' (C)' };
const fill8 = {
  title: 'ℓ₁ ∥ ℓ₂ and ∠7 = 101°',
  height: 420,
  minW: 960,
  choices: [{ v: 'all', label: '(b) all 8 from ∠7 = 101°' }, { v: 'names', label: '(a) name the pairs' }],
  ask: (k) => (k === 'all' ? 'Example 7(b): ℓ₁ ∥ ℓ₂ and ∠7 = 101°. Find the other seven angles. Give a reason for each.' : 'Example 7(a): name each pair. Then say whether the angles are equal or add to 180°.'),
  make(stage, k, ex) {
    const W = ex.W, TV = Geo.transversal(stage, { x: 0, y: 10, w: 520, h: 404, tilt: 79, angles: k === 'all' ? { 7: 101 } : {}, size: 22 });
    const X = 545, RW = W - X - 8;
    if (k === 'all') {
      const rows = ALL8.map(([n, v, why, pr], i) => { const r = hide(el(stage, 'u5l9-rsn', `<b>∠${n} = ${v}°</b>${why}`, X, 14 + i * 50, RW, 42)); r.style.setProperty('--rc', v === 101 ? BLUE : AMBER); return r; });
      const res = hide(cb(stage, 'u5l9-res', `Two sizes: ${T('101^\\circ+79^\\circ=180^\\circ')} ✓`, X, 368, RW, 46));
      const steps = ALL8.map(([n, v, why, pr], i) => ({
        cap: `∠${n} = <b>${v}°</b>: ${why}${pairName(pr[0], pr[1]) === 'corresponding' ? ' (an F)' : pairName(pr[0], pr[1]) === 'alt-int' ? ' (a Z)' : pairName(pr[0], pr[1]) === 'vert-opp' ? ' (an X)' : ''}.`,
        run: async (c) => { TV.clearHighlight(); await TV.highlight(c, pr, { name: false }); TV.setLabel(n, v + '°'); await c.pop(TV.label(n)); await c.fadeIn(rows[i]); }
      }));
      steps.push({ cap: 'Only <b>two sizes</b>: 101° (the odd numbers) and 79° (the even numbers). They add to 180° ✓', run: async (c) => { TV.clearHighlight(); await c.pop(res); } });
      return steps;
    }
    const rows = NAMES7.map(([pr, nm, eq], i) => hide(el(stage, 'u5l9-rsn', `<b>∠${pr[0]}, ∠${pr[1]}</b>${nm}${SHAPE[nm] || ''}: <i>${eq}</i>`, X, 20 + i * 56, RW, 46)));
    return NAMES7.map(([pr, nm, eq], i) => ({
      cap: `∠${pr[0]} and ∠${pr[1]}: <b>${nm}</b>${SHAPE[nm] || ''}. The lines are parallel, so they ${eq === 'equal' ? 'are <b>equal</b>' : '<b>add to 180°</b>'}.`,
      run: async (c) => { TV.clearHighlight(); await TV.highlight(c, pr); await c.fadeIn(rows[i]); }
    }));
  }
};

/* Full notes: slide the crossing (parallel vs not) */
const whyTwo = {
  title: 'Slide the top crossing down the transversal',
  height: 400,
  minW: 960,
  choices: [{ v: 1, label: 'parallel lines' }, { v: 0, label: 'not parallel' }],
  ask: (p) => (p ? 'ℓ₁ ∥ ℓ₂: is the bottom crossing a copy of the top one?' : 'ℓ₁ and ℓ₂ are not parallel: do the rules still work?'),
  make(stage, par, ex) {
    const W = ex.W, TV = Geo.transversal(stage, { x: (W - 640) / 2, y: 0, w: 640, h: 400, parallel: !!par, tilt: 62, skew: 14, numbers: false });
    const m = TV.measures();
    return [
      { cap: `At the top crossing, ∠2 = ${m[2]}°. Its neighbour on the straight line: ∠1 = 180° − ${m[2]}° = <b>${m[1]}°</b>.`, run: async (c) => { TV.setLabel(2, m[2] + '°'); TV.setLabel(1, m[1] + '°'); await c.pop(TV.label(1)); } },
      { cap: `Vertically opposite angles match: ∠3 = ${m[3]}°, ∠4 = ${m[4]}°. The top crossing has only <b>two sizes</b>.`, run: async (c) => { TV.setLabel(3, m[3] + '°'); TV.setLabel(4, m[4] + '°'); await c.pop(TV.label(3)); await c.pop(TV.label(4)); } },
      { cap: 'Slide a copy of ∠2 down the transversal to the bottom crossing…', run: (c) => TV.slide(c, 2) },
      { cap: par ? `It fits ∠6 exactly. With parallel lines the bottom crossing is a <b>copy</b>: ${m[2]}° and ${m[1]}° again.` : `It does <b>not</b> fit: ∠6 = ${m[6]}°. Without parallel lines, the F, Z and C rules <b>break</b>. (The straight-line and X rules still work.)`,
        run: async (c) => { for (const k of [5, 6, 7, 8]) { TV.setLabel(k, m[k] + '°'); await c.pop(TV.label(k), 260); } } }
    ];
  }
};

/* =====================================================================================
 * 8. Example 8: the pool table and the two streets
 * ===================================================================================== */
const pool = {
  title: 'Parallel cushions, then two streets',
  height: 380,
  minW: 960,
  choices: [{ v: 'pool', label: '(a)–(c) the pool table' }, { v: 'streets', label: '(d) the two streets' }],
  ask: (k) => (k === 'pool' ? 'Example 8: the long cushions are parallel. The ball leaves the bottom cushion at 32° and rolls into the top right pocket. Find x, y and z.' : 'Example 8(d): at one street the angle is 86°; at the other street the corresponding angle is 88°. Are the streets parallel?'),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'pool') {
      const svg = svgOn(stage, W, 380), s = 140, O = [20, 350], q = (x, y) => [O[0] + x * s, O[1] - y * s];
      const BL = q(0, 0), TR = q(4, 2.2), S = q(0.479, 0), Pk = TR;
      svgEl('rect', { x: BL[0], y: TR[1], width: TR[0] - BL[0], height: BL[1] - TR[1], fill: '#dff0e3', stroke: '#2f5d3a', 'stroke-width': 6, rx: 4 }, svg);
      [[2.6, 0], [2.6, 2.2]].forEach(([x, y]) => { const p = q(x, y); svgEl('path', { d: `M${p[0] - 9} ${p[1] - 9}L${p[0] + 2} ${p[1]}L${p[0] - 9} ${p[1] + 9}`, stroke: INK, 'stroke-width': 3, fill: 'none' }, svg); });
      svgEl('circle', { cx: Pk[0], cy: Pk[1], r: 15, fill: '#1c2230' }, svg);
      const path = svgEl('path', { d: `M${S.join(' ')}L${Pk.join(' ')}`, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '10 8', fill: 'none' }, svg);
      const len = Math.hypot(Pk[0] - S[0], Pk[1] - S[1]);
      const ball = svgEl('circle', { cx: S[0], cy: S[1] - 9, r: 11, fill: '#fff', stroke: INK, 'stroke-width': 2 }, svg);
      const a32 = arcOnly(svg, S, 0, 32, { r: 90, label: '32°', size: 21 });
      const zig = svgEl('path', { d: `M${Pk[0] - 230} ${Pk[1]}L${Pk.join(' ')}L${S.join(' ')}L${S[0] + 230} ${S[1]}`, stroke: GREEN, 'stroke-width': 14, 'stroke-opacity': 0.3, fill: 'none', 'stroke-linejoin': 'round' }, svg);
      const ax = arcOnly(svg, Pk, 180, 212, { r: 90, label: 'x = 32°', size: 20, arcColor: GREEN, labelColor: GREEN, labelR: 150 });
      const rm = svgEl('path', { d: `M${Pk[0] - 22} ${Pk[1]}V${Pk[1] + 22}H${Pk[0]}`, stroke: RED, 'stroke-width': 2.5, fill: 'none' }, svg);
      const ay = arcOnly(svg, Pk, 212, 270, { r: 56, label: 'y', size: 22, arcColor: BLUE, labelColor: BLUE, labelR: 86 });
      const az = arcOnly(svg, S, 32, 180, { r: 40, label: 'z', size: 22, arcColor: AMBER, labelColor: AMBER, labelR: 62 });
      hide(path, a32.g, zig, ax.g, rm, ay.g, az.g);
      const X = 610, L = [hide(ln(stage, `${T('x=32^\\circ')} <span class="u5l9-small">&nbsp;alternate interior (Z)</span>`, X, 40, 340)),
        hide(ln(stage, `${T('y=90^\\circ-32^\\circ=58^\\circ')}`, X, 120, 340)), hide(ln(stage, '<span class="u5l9-small">complementary to x</span>', X + 30, 160, 300, 30)),
        hide(ln(stage, `${T('z=180^\\circ-32^\\circ=148^\\circ')}`, X, 220, 340)), hide(ln(stage, '<span class="u5l9-small">supplementary: a straight line</span>', X + 30, 260, 300, 30))];
      return [
        { cap: 'The ball leaves the bottom cushion at <b>32°</b> and rolls straight into the top right pocket.', run: async (c) => {
          await show(c, a32.g); path.style.opacity = 1; path.style.strokeDasharray = `${len}`;
          await tween(c, 1300, (t) => { path.style.strokeDashoffset = String(len * (1 - t)); ball.setAttribute('cx', lerp(S[0], Pk[0], t)); ball.setAttribute('cy', lerp(S[1] - 9, Pk[1], t)); });
          path.style.strokeDasharray = '10 8'; path.style.strokeDashoffset = '0'; ball.style.opacity = 0; } },
        { cap: '(a) The long cushions are <b>parallel</b>, and the path crosses both. x and 32° make a <b>Z</b>: alternate interior angles, so <b>x = 32°</b>.', run: async (c) => { await show(c, zig, 500); await show(c, ax.g); await c.fadeIn(L[0]); } },
        { cap: `(b) The end cushion meets the top cushion at <b>90°</b>. ${T('y=90^\\circ-32^\\circ=58^\\circ')}.`, run: async (c) => { await fadeOut(c, zig); await show(c, rm); ay.label.textContent = '58°'; await show(c, ay.g); await c.fadeIn(L[1]); await c.fadeIn(L[2]); } },
        { cap: `(c) z and 32° sit on a straight line, the bottom cushion: ${T('z=180^\\circ-32^\\circ=148^\\circ')}.`, run: async (c) => { az.label.textContent = '148°'; await show(c, az.g); await c.fadeIn(L[3]); await c.fadeIn(L[4]); } }
      ];
    }
    // the two streets: 86° and 88° corresponding angles; zoom out until they meet
    const svg = svgOn(stage, W, 380, 'clip'), g = svgEl('g', {}, svg);
    const Tp = [560, 110], gap = 180, Bp = gAt(Tp, 266, gap / Math.sin(86 * RAD)), tn2 = Math.tan(2 * RAD);
    const y2 = (x) => Bp[1] + (x - Bp[0]) * tn2, meetX = Bp[0] - gap / tn2;
    const NS = { 'vector-effect': 'non-scaling-stroke' };
    svgEl('path', Object.assign({ d: `M${meetX - 400} ${Tp[1]}H1400`, stroke: '#6a7182', 'stroke-width': 11, 'stroke-linecap': 'butt', fill: 'none' }, NS), g);
    svgEl('path', Object.assign({ d: `M${meetX - 400} ${y2(meetX - 400)}L1400 ${y2(1400)}`, stroke: '#6a7182', 'stroke-width': 11, fill: 'none' }, NS), g);
    const rA = gAt(Tp, 86, 110), rB = gAt(Bp, 266, 110);
    svgEl('path', Object.assign({ d: `M${rA.join(' ')}L${rB.join(' ')}`, stroke: '#9a6a24', 'stroke-width': 12, fill: 'none' }, NS), g);
    const t1 = gText(g, 860, Tp[1] - 26, 'Street 1', { size: 20, color: '#3a4254' }), t2 = gText(g, 860, y2(860) + 30, 'Street 2', { size: 20, color: '#3a4254' }), t3 = gText(g, rA[0] + 50, rA[1] + 10, 'road', { size: 18, color: '#9a6a24' });
    void t1; void t2; void t3;
    const a86 = arcOnly(g, Tp, 0, 86, { r: 50, label: '86°', size: 22, arcColor: BLUE, labelColor: BLUE });
    const a88 = arcOnly(g, Bp, -2, 86, { r: 50, label: '88°', size: 22, arcColor: RED, labelColor: RED });
    hide(a86.g, a88.g);
    const no = hide(stamp(stage, 'not parallel', { ok: false, x: 790, y: 330 }));
    const res = hide(cb(stage, 'u5l9-res', `${T('86^\\circ\\ne88^\\circ')}`, 40, 312, 220, 50));
    const meet = hide(tag(stage, 'they meet, far away', 60, 120, 'red'));
    const dotM = hide(svgEl('circle', { cx: 0, cy: 0, r: 9, fill: RED }, svg));
    const PX = W - 40, PY = 200;
    return [
      { cap: 'At the first street, the road makes an <b>86°</b> angle.', run: (c) => show(c, a86.g) },
      { cap: 'At the second street, in the <b>same position</b> (corresponding), the angle is <b>88°</b>.', run: (c) => show(c, a88.g) },
      { cap: 'If the streets were parallel, corresponding angles would be <b>equal</b>. 86° ≠ 88°, so they are <b>not parallel</b>.', run: async (c) => { await c.pop(res); await stampIn(c, no); } },
      { cap: 'Zoom out: the streets slowly get closer… and <b>meet</b>, far away.', run: async (c) => {
        await Promise.all([fadeOut(c, a86.g), fadeOut(c, a88.g), fadeOut(c, no), fadeOut(c, res)]);
        const sMin = (PX - 130) / (PX - meetX);
        await tween(c, 2200, (t) => { const sc = lerp(1, sMin, t), ty = lerp(0, 60, t); g.setAttribute('transform', `translate(${PX} ${PY + ty}) scale(${sc}) translate(${-PX} ${-PY})`); });
        const mx = PX + (meetX - PX) * sMin, my = PY + 60 + (Tp[1] - PY) * sMin; meet.style.left = mx + 'px'; meet.style.top = (my - 44) + 'px'; dotM.setAttribute('cx', mx); dotM.setAttribute('cy', my);
        await show(c, dotM); await c.pop(meet); } }
    ];
  }
};

/* =====================================================================================
 * 9. Full notes: practice-test multiple choice, with the mistake behind every wrong choice
 * ===================================================================================== */
const MC = {
  q15: { ask: 'Practice test Q15: the supplement of 64° is…', opts: ['26°', '116°', '296°', '154°'], ans: 1,
    work: '180^\\circ-64^\\circ=116^\\circ', why: ['the complement (90° − 64°)', '', 'took it from 360°', 'added 90°'], trap: 'Supplement: fill up to <b>180°</b>. Complement: fill up to <b>90°</b>.' },
  q16: { ask: 'Practice test Q16: a boat heads south-east. Its true bearing is…', opts: ['315°', '225°', '135°', '045°'], ans: 2,
    work: '\\text{halfway from }090^\\circ\\text{ to }180^\\circ=135^\\circ', why: ['north-west', 'south-west', '', 'north-east'], trap: 'From <b>north</b>, turn <b>clockwise</b>: E is 090°, S is 180°, W is 270°.' },
  q19: { ask: 'Practice test Q19: ℓ₁ ∥ ℓ₂ and ∠1 = 109°. Then ∠8 is…', opts: ['109°', '71°', '19°', '251°'], ans: 1,
    work: '180^\\circ-109^\\circ=71^\\circ', why: ['treated them as equal', '', 'took away 90°', 'took it from 360°'], trap: '∠1 and ∠8 are exterior angles on the <b>same side</b>: they add to 180°.' },
  q20: { ask: 'Practice test Q20: the sum of the angles in a polygon with 9 sides is…', opts: ['1 620°', '1 440°', '1 260°', '1 080°'], ans: 2,
    work: '(9-2)\\times180^\\circ=7\\times180^\\circ=1\\,260^\\circ', why: ['used 9 × 180°', 'used 9 − 1', '', 'used 9 − 3'], trap: 'Take <b>2</b> away from the number of sides, then multiply by 180°.' },
  q21: { ask: 'Practice test Q21: the fewest moves to solve the Tower of Hanoi with 7 discs is…', opts: ['49', '128', '63', '127'], ans: 3,
    work: '2^7-1=128-1=127', why: ['7 × 7', 'forgot the − 1', 'the answer for 6 discs', ''], trap: 'The rule is <b>2ⁿ − 1</b>: don’t forget to subtract 1.' }
};
const traps = {
  title: 'Spot the trap',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q15', label: 'Q15 Supplement' }, { v: 'q16', label: 'Q16 South-east' }, { v: 'q19', label: 'Q19 ∠1 and ∠8' }, { v: 'q20', label: 'Q20 9 sides' }, { v: 'q21', label: 'Q21 Hanoi' }],
  ask: (k) => MC[k].ask,
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, OW = (W - 50) / 2;
    const tiles = d.opts.map((o, i) => el(stage, 'u5l9-opt', `<b>${'ABCD'[i]}</b><span class="ot">${o}</span><span class="why"></span>`, 16 + (i % 2) * (OW + 18), 8 + Math.floor(i / 2) * 92, OW, 80));
    tiles.forEach((t, i) => { const w = t.querySelector('.why'); w.innerHTML = d.why[i]; hide(w); });
    const work = hide(cb(stage, 'u5l9-res', `Work it out: ${T(d.work)}`, (W - 640) / 2, 202, 640, 52));
    const tp = hide(cb(stage, 'u5l9-note', d.trap, 16, 266, W - 32, 52));
    const ok = tiles[d.ans];
    const st = hide(stamp(stage, '✓', { ok: true, x: 16 + (d.ans % 2) * (OW + 18) + OW - 34, y: 8 + Math.floor(d.ans / 2) * 92 + 40, rotate: -8 }));
    return [
      { cap: `Work it out <b>before</b> you look at the choices: ${T(d.work)}.`, run: (c) => c.pop(work) },
      { cap: `The answer is <b>${'ABCD'[d.ans]}</b>.`, run: async (c) => { ok.classList.add('u5l9-ok'); await pulse(c, ok, 1.04); await stampIn(c, st); } },
      { cap: 'Every wrong choice is the answer to a <b>mistake</b>. Can you name each one?',
        run: async (c) => { for (const [i, t] of tiles.entries()) { if (i === d.ans) continue; t.classList.add('u5l9-no'); await c.fadeIn(t.querySelector('.why'), 300); } } },
      { cap: d.trap, run: (c) => c.fadeIn(tp) }
    ];
  }
};

mountExplainers({ games, protr, poly, bear, bisect, partners, fill8, whyTwo, pool, traps });

/* ============ Stand Up Break! — mixed review like the unit test, at the whiteboards ============ */
{
  const NAMED = ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp', 'linear'];
  const REASON = { corresponding: 'corresponding angles are equal', 'alt-int': 'alternate interior angles are equal', 'alt-ext': 'alternate exterior angles are equal',
    'int-same': 'interior angles on the same side add to 180°', 'ext-same': 'exterior angles on the same side add to 180°', 'vert-opp': 'vertically opposite angles are equal', linear: 'angles on a straight line add to 180°' };
  const typeOf = (x) => (x < 90 ? 'acute' : x === 90 ? 'right' : x < 180 ? 'obtuse' : x === 180 ? 'straight' : 'reflex');
  standup('u5l9', {
    intro: 'Mixed review, like the unit test. Sketch first, then show every step and give a reason for every angle.',
    levels: {
      BEG: (r) => r.pick([
        () => { const x = r.pick([r.int(12, 84), r.int(96, 168)]);
          return { text: `An angle measures <b>${x}°</b>. Classify it. Find its complement and its supplement (write “none” if there is none).`, q: '',
            atext: `<b>${typeOf(x)}</b>`, a: [x < 90 ? `\\text{complement: }90^\\circ-${x}^\\circ=${90 - x}^\\circ` : `\\text{complement: none (already more than }90^\\circ)`, `\\text{supplement: }180^\\circ-${x}^\\circ=${180 - x}^\\circ`] }; },
        () => { const x = r.int(25, 170); return { text: `Find the <b>reflex angle</b> that goes with an angle of <b>${x}°</b>.`, q: '', a: [`360^\\circ-${x}^\\circ=${360 - x}^\\circ`] }; },
        () => { const x = r.int(31, 175); return { text: `An angle of <b>${x}°</b> is <b>bisected</b>. How big is each new angle?`, q: '', a: [`${x}^\\circ\\div2=${x / 2}^\\circ`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { let b; do { b = r.int(5, 355); } while (b === 180); const bk = b < 180 ? b + 180 : b - 180;
          return { text: `A canoe paddles on a true bearing of <b>${b3(b)}°</b>. On what bearing does it paddle straight back?`, q: '', a: [`${b3(b)}^\\circ${b < 180 ? '+' : '-'}180^\\circ=${b3(bk)}^\\circ`] }; },
        () => { const n = r.int(5, 12), s = (n - 2) * 180, e = Math.round(s / n * 10) / 10;
          return { text: `A <b>regular</b> polygon has <b>${n}</b> sides. Find the sum of its angles, then the size of each angle (nearest tenth).`, q: '',
            a: [`(${n}-2)\\times180^\\circ=${s >= 1000 ? String(s).replace(/(\d)(\d{3})$/, '$1\\,$2') : s}^\\circ`, `${s >= 1000 ? String(s).replace(/(\d)(\d{3})$/, '$1\\,$2') : s}^\\circ\\div${n}${Number.isInteger(s / n) ? '=' : '\\approx'}${e}^\\circ`] }; },
        () => { let a, b, c2, x; do { a = r.int(60, 125); b = r.int(60, 125); c2 = r.int(60, 125); x = 360 - a - b - c2; } while (x < 45 || x > 150);
          return { text: `A four-sided garden has angles of <b>${a}°</b>, <b>${b}°</b> and <b>${c2}°</b>. Find the fourth angle.`, q: '', a: [`(4-2)\\times180^\\circ=360^\\circ`, `360^\\circ-${a}^\\circ-${b}^\\circ-${c2}^\\circ=${x}^\\circ`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => {
          const key = r.pick(NAMED), [p, q] = r.pick(Geo.PAIRS[key]), [k, m] = r.chance(0.5) ? [p, q] : [q, p];
          let v; do { v = r.int(40, 140); } while (Math.abs(v - 90) < 8);
          const tilt = k % 2 === 0 ? v : 180 - v, ans = (k % 2) === (m % 2) ? v : 180 - v;
          const fig = Geo.transversal(null, { w: 340, h: 230, tilt, angles: { [k]: v, [m]: 'x' }, numbers: false, size: 19 }).el.outerHTML;
          return { text: `${tex('\\ell_1\\parallel\\ell_2')} and ${tex(`\\angle${k}=${v}^\\circ`)}. Find ${tex('x')} (that is ${tex(`\\angle${m}`)}). Give a reason.`, q: '', fig,
            a: [ans === v ? `x=${v}^\\circ` : `x=180^\\circ-${v}^\\circ=${ans}^\\circ`], atext: `Reason: ${REASON[key]}.` };
        },
        () => { let n; do { n = r.int(13, 31); } while (n % 4 === 0); const t = n % 4;
          return { text: `Take 1, 2 or 3 counters each turn. Whoever takes the <b>last</b> counter wins. The pile has <b>${n}</b> and you go first. How many do you take, and what do you do after that?`, q: '',
            a: [`${n}-${n - t}=${t}\\text{: take }${t}\\text{, leave }${n - t}`], atext: `Leave a multiple of 4. After that, take 4 minus what the other player took.` }; },
        () => { let v; do { v = r.int(52, 76); } while (v === 68); const x = 180 - 2 * v;
          const dx = 110 / Math.tan(v * RAD), L0 = (170 - dx).toFixed(1), R0 = (170 + dx).toFixed(1);
          const fig = `<svg viewBox="0 0 340 160" width="340" height="160" role="img" aria-label="a climber: a top bar parallel to the ground and two legs"><path d="M20 140H320M60 30H280" stroke="#1c2230" stroke-width="3"/><path d="M${L0} 140L170 30L${R0} 140" fill="none" stroke="#1c2230" stroke-width="3"/><text x="${(+L0 + 30).toFixed(1)}" y="128" font-size="17" font-weight="700" fill="#1c2230">${v}°</text><text x="${(+R0 - 58).toFixed(1)}" y="128" font-size="17" font-weight="700" fill="#1c2230">${v}°</text><text x="163" y="62" font-size="20" font-style="italic" fill="#c93a33">x</text><text x="300" y="155" font-size="14" fill="#6a7182">ground</text></svg>`;
          return { text: `The top bar of a playground climber is <b>parallel</b> to the ground. Two legs meet at the bar, and each leg makes <b>${v}°</b> with the ground. Find ${tex('x')}, the angle between the two legs at the top. Explain your steps.`, q: '', fig,
            a: [`\\text{each leg and the bar: }${v}^\\circ\\text{ (alternate interior)}`, `x=180^\\circ-${v}^\\circ-${v}^\\circ=${x}^\\circ`] }; }
      ])()
    }
  });
}
