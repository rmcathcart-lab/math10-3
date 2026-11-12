/* Math 10-3 · Unit 4 · Lesson 4 — Mass: Grams, Kilograms, Ounces, Pounds and Tons.
 * Explainers: a balance scale with referent objects (paper clips, water jugs, bread slices), the SI staircase with the
 * decimal point hopping, loading the truck for the bridge (Full notes), packing ounces into pound boxes, 1.5 lb is not
 * 1 lb 5 oz (Full notes), pounds-and-ounces columns with trades and borrows, the watermelon's true cost (Full notes),
 * and reading a kitchen dial, a bathroom scale, a produce scale and a digital scale with TARE.
 * Also the static scale figures for Example 11, the Math History box (Le Grand K) and the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
const WL = (cls, html) => h('div', cls, `<div>${html}</div>`);           // a work line: flex-centred, spaces kept
const cbox = (cls, html) => h('div', cls + ' u4l4-cc', `<div>${html}</div>`);
/** numbers with a thin space in the thousands (text and TeX) */
const big = (v) => { const s = String(v); const [a, b] = s.split('.'); const g = a.length > 4 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') : a; return b ? g + '.' + b : g; }; // like the booklet: 2400, 12 950
const bigT = (v) => big(v).replace(/ /g, '\\,');
const lbo = (lb, oz) => `${lb} lb ${oz} oz`;

/* ======================================================================================
 * Little pictures (SVG markup in a 100 × 100 box, standing on y = 100)
 * ====================================================================================== */
const PIC = {
  toonie: '<circle cx="50" cy="80" r="20" fill="#c9a43a" stroke="#7a5a14" stroke-width="3"/><circle cx="50" cy="80" r="11" fill="#d7dbe0" stroke="#7a5a14" stroke-width="2"/>',
  clip: '<path d="M38 96 V70 Q38 62 46 62 Q54 62 54 70 V92 Q54 98 48 98 Q42 98 42 92 V72" fill="none" stroke="#5d6675" stroke-width="4" stroke-linecap="round"/>',
  sugar: '<path d="M18 30 H82 L86 100 H14 Z" fill="#f6f1e6" stroke="#8a7d68" stroke-width="3"/><rect x="18" y="52" width="68" height="26" fill="#1f5bd6"/><text x="51" y="71" font-size="17" font-weight="800" fill="#fff" text-anchor="middle">2 kg</text>',
  jug: '<rect x="40" y="10" width="20" height="12" rx="3" fill="#1f5bd6"/><path d="M36 22 H64 L76 40 V96 Q76 100 72 100 H28 Q24 100 24 96 V40 Z" fill="#cfe9ff" stroke="#1f5bd6" stroke-width="3"/><text x="50" y="72" font-size="18" font-weight="800" fill="#1f5bd6" text-anchor="middle">1 L</text>',
  puck: '<ellipse cx="50" cy="90" rx="34" ry="10" fill="#1c2230"/><rect x="16" y="74" width="68" height="16" fill="#1c2230"/><ellipse cx="50" cy="74" rx="34" ry="10" fill="#3a4254"/>',
  bread: '<path d="M22 100 V56 Q14 50 18 40 Q24 28 50 28 Q76 28 82 40 Q86 50 78 56 V100 Z" fill="#f2d39b" stroke="#a46f35" stroke-width="3"/><path d="M28 98 V60 Q22 54 26 46 Q32 36 50 36 Q68 36 74 46 Q78 54 72 60 V98 Z" fill="#fff4dc"/>',
  pumpkin: '<ellipse cx="50" cy="68" rx="44" ry="32" fill="#e8892b" stroke="#a45410" stroke-width="3"/><path d="M50 38 Q36 68 50 100 M50 38 Q64 68 50 100 M30 42 Q18 70 30 98 M70 42 Q82 70 70 98" fill="none" stroke="#a45410" stroke-width="2.5"/><rect x="45" y="24" width="10" height="16" rx="3" fill="#5a7a2a"/>',
  butter: '<rect x="12" y="62" width="76" height="34" rx="4" fill="#ffe08a" stroke="#c9a43a" stroke-width="3"/><path d="M12 72 H88" stroke="#c9a43a" stroke-width="2"/>'
};
const pic = (kind, size) => { const s = svgEl('svg', { viewBox: '0 0 100 100', width: size, height: size, class: 'u4l4-pic' }); s.innerHTML = PIC[kind]; return s; };

/* ======================================================================================
 * 1. A balance scale with referent objects
 * ====================================================================================== */
const BAL = {
  toonie: { obj: 'toonie', name: 'a toonie', ref: 'clip', refName: 'paper clip', refPl: 'paper clips', each: '1 g', n: 7, ans: 'about <b>7 g</b>', unitWhy: 'Grams: a toonie is light, like a few paper clips.', osz: 70, rsz: 40 },
  sugar: { obj: 'sugar', name: 'a bag of sugar', ref: 'jug', refName: '1 L jug of water', refPl: '1 L jugs of water', each: '1 kg', n: 2, ans: '<b>2 kg</b>', unitWhy: 'Kilograms: about as heavy as a couple of water jugs.', osz: 110, rsz: 80 },
  puck: { obj: 'puck', name: 'a hockey puck', ref: 'bread', refName: 'slice of bread', refPl: 'slices of bread', each: '1 oz', n: 6, ans: 'about <b>6 oz</b>', unitWhy: 'Ounces: a puck weighs about as much as a few slices of bread.', osz: 80, rsz: 48 },
  pumpkin: { obj: 'pumpkin', name: 'a large pumpkin', ref: 'jug', refName: '1 L jug of water', refPl: '1 L jugs of water', each: '1 kg', n: 6, ans: 'about <b>6 kg</b>', unitWhy: 'So 6 kg makes sense. 6 g is a few paper clips, and 6 t is more than four small cars!', ex: true, osz: 120, rsz: 48 }
};
const balance = {
  title: 'Referents on a balance scale',
  height: 430,
  minW: 900,
  choices: [{ v: 'toonie', label: 'A toonie' }, { v: 'sugar', label: 'A bag of sugar' }, { v: 'puck', label: 'A hockey puck' }, { sep: 'Example 1(b):' }, { v: 'pumpkin', label: '(i) A pumpkin' }],
  ask: (k) => (BAL[k].ex ? 'Example 1(b)(i): is a large pumpkin about 6 g, 6 kg or 6 t? Balance it with 1 L jugs of water (about 1 kg each).'
    : `How heavy is ${BAL[k].name}? Balance it with referents: a ${BAL[k].refName} is about ${BAL[k].each}.`),
  make(stage, k, ex) {
    const d = BAL[k], W = ex.W, n = d.n;
    const SW = 560, SH = 400, PX0 = 280, PY0 = 120, ARM = 200;
    const sv = svgEl('svg', { width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}`, class: 'u4l4-bal' }); add(stage, sv, 10, 10);
    svgEl('rect', { x: PX0 - 70, y: 376, width: 140, height: 18, rx: 6, fill: '#6e4a1c' }, sv);
    svgEl('path', { d: `M${PX0 - 10} 378 L${PX0 - 6} ${PY0} H${PX0 + 6} L${PX0 + 10} 378 Z`, fill: '#9a6a24' }, sv);
    const beam = svgEl('g', {}, sv); beam.style.transformBox = 'view-box'; beam.style.transformOrigin = `${PX0}px ${PY0}px`;
    svgEl('rect', { x: PX0 - ARM - 8, y: PY0 - 7, width: 2 * ARM + 16, height: 14, rx: 7, fill: '#4a3010' }, beam);
    svgEl('path', { d: `M${PX0} ${PY0 - 14} l-10 -26 h20 Z`, fill: '#c93a33' }, sv); // the pointer above the pivot (fixed)
    svgEl('circle', { cx: PX0, cy: PY0, r: 10, fill: '#6e4a1c' }, sv);
    // pans: groups whose origin is the hanging point; they are translated to the beam ends
    const pan = () => {
      const g = svgEl('g', {}, sv);
      svgEl('path', { d: 'M0 0 L-70 150 M0 0 L70 150', stroke: '#4a4436', 'stroke-width': 2.5 }, g);
      svgEl('path', { d: 'M-90 150 H90 Q84 176 0 176 Q-84 176 -90 150 Z', fill: '#c9a26b', stroke: '#7a5124', 'stroke-width': 3 }, g);
      return g;
    };
    const L = pan(), R = pan();
    const objG = svgEl('g', {}, L);
    const o = pic(d.obj, d.osz); objG.appendChild(o); o.setAttribute('x', -d.osz / 2); o.setAttribute('y', 150 - d.osz);
    hide(objG);
    // referents in the right pan: in rows
    const per = Math.min(n, Math.floor(160 / (d.rsz * 0.82))), refs = [];
    for (let i = 0; i < n; i++) {
      const r = pic(d.ref, d.rsz), row = Math.floor(i / per), col = i % per, cnt = Math.min(per, n - row * per);
      r.setAttribute('x', -cnt * d.rsz * 0.82 / 2 + col * d.rsz * 0.82 - d.rsz * 0.09); r.setAttribute('y', 150 - d.rsz - row * d.rsz * 0.62);
      R.appendChild(r); hide(r); refs.push(r);
    }
    let ang = 0;
    const setAng = (a) => {
      ang = a; beam.style.transform = `rotate(${a}deg)`;
      const rad = a * Math.PI / 180;
      L.setAttribute('transform', `translate(${PX0 - ARM * Math.cos(rad)} ${PY0 - ARM * Math.sin(rad)})`);
      R.setAttribute('transform', `translate(${PX0 + ARM * Math.cos(rad)} ${PY0 + ARM * Math.sin(rad)})`);
    };
    setAng(0);
    const tiltTo = (c, a, ms = 600) => { const a0 = ang; return tween(c, ms, (t) => setAng(lerp(a0, a, t))); };
    const tilt = (m) => (m >= n ? 0 : -12 * Math.max(0.25, (n - m) / n)); // left side heavier → left goes down
    // the panel
    const PX = 10 + SW + 20, PW = W - PX - 10;
    const refCard = hide(add(stage, box(cbox('u4l4-ref', `<span>1 ${d.refName}</span><b>≈ ${d.each}</b>`), PW, 64), PX, 20));
    const counter = hide(add(stage, box(cbox('u4l4-count', `0 × ${d.each}`), PW, 64), PX, 100));
    const res = hide(add(stage, box(cbox('u4l4-res', `${d.name[0].toUpperCase() + d.name.slice(1)} is ${d.ans}`), PW, 64), PX, 190));
    const why = hide(add(stage, box(WL('u4l4-wl sm', d.unitWhy), PW, 96), PX, 270));
    const setCount = (m) => { counter.firstChild.innerHTML = `${m} × ${d.each} = <b>${m * parseFloat(d.each)} ${d.each.split(' ')[1]}</b>`; };
    return [
      { cap: `Put ${d.name} on the left pan. That side goes <b>down</b>: it is heavier than an empty pan.`, run: async (c) => { await c.pop(objG); await tiltTo(c, -12, 700); } },
      { cap: `Add ${d.refPl} (about <b>${d.each}</b> each) to the other pan, one at a time…`,
        run: async (c) => { await c.fadeIn(refCard); await c.fadeIn(counter); for (let i = 0; i < n - 1; i++) { await c.pop(refs[i], 260); setCount(i + 1); await tiltTo(c, tilt(i + 1), 300); } } },
      { cap: `<b>${n}</b> ${d.refPl}: the beam is level. It <b>balances</b>!`, run: async (c) => { setCount(n - 1); await c.pop(refs[n - 1], 260); setCount(n); await tiltTo(c, 0, 700); await pulse(c, counter, 1.06); } },
      { cap: `${d.name[0].toUpperCase() + d.name.slice(1)} is ${d.ans}. ${d.unitWhy}`, run: async (c) => { await c.pop(res); await c.fadeIn(why); } }
    ];
  }
};

/* ======================================================================================
 * 2. The SI staircase: the decimal point hops 3 places for each jump
 * ====================================================================================== */
const STAIR = ['t', '', '', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
const MAIN = { t: 'tonne', kg: 'kilogram', g: 'gram', mg: 'milligram' };
const ST = {
  a: { v: '2.4', from: 'kg', to: 'g', what: '(a) 2.4 kg to grams' }, b: { v: '750', from: 'g', to: 'kg', what: '(b) 750 g to kilograms' },
  c: { v: '3500', from: 'kg', to: 't', what: '(c) 3500 kg to tonnes' }, d: { v: '0.6', from: 't', to: 'kg', what: '(d) 0.6 t to kilograms' },
  e: { v: '250', from: 'mg', to: 'g', what: '(e) 250 mg to grams' }, f: { v: '45', from: 'g', to: 'kg', what: '(f) 45 g to kilograms' },
  g: { v: '1.2', from: 'g', to: 'mg', what: '(g) 1.2 g to milligrams' }, h: { v: '2.5', from: 'kg', to: 'mg', what: '(h) 2.5 kg to milligrams' }
};
/** cells for the decimal point picture: digits stay put, the point hops k places (k > 0: right) */
function pointCells(v, k) {
  const neg = false; void neg;
  let [ip, fp = ''] = v.split('.'); if (ip === '0' && fp) ip = '0';
  let digits = (ip + fp).split(''), pi = ip.length;
  if (ip === '0') { digits = ('0' + fp).split(''); pi = 1; }
  const end = pi + k, Lp = Math.max(0, 1 - end), Rp = Math.max(0, end - digits.length);
  const cells = [...Array(Lp).fill('0'), ...digits, ...Array(Rp).fill('0')].map((ch, i) => ({ ch, pad: i < Lp || i >= Lp + digits.length }));
  return { cells, p0: pi + Lp, p1: end + Lp };
}
/** a decimal string → a tidy number string (drops extra zeros) */
const tidy = (cells, p) => { let a = cells.slice(0, p).map((c) => c.ch).join('').replace(/^0+(?=\d)/, ''), b = cells.slice(p).map((c) => c.ch).join('').replace(/0+$/, ''); return b ? `${a}.${b}` : a; };
const stairs = {
  title: 'The SI staircase',
  height: 440,
  minW: 920,
  choices: [{ sep: 'Example 2 check:' }, ...'abcdefgh'.split('').map((v) => ({ v, label: ST[v].what.replace(/ to .*/, '').replace('(h) 2.5 kg', '(h) 2.5 kg') + ' → ' + ST[v].to }))],
  ask: (k) => `Example 2${ST[k].what.slice(0, 3)}: change <b>${big(ST[k].v)} ${ST[k].from}</b> to ${MAIN[ST[k].to]}s.`,
  make(stage, k, ex) {
    const d = ST[k], W = ex.W, i0 = STAIR.indexOf(d.from), i1 = STAIR.indexOf(d.to), steps = i1 - i0, down = steps > 0, jumps = Math.abs(steps) / 3;
    const { cells, p0, p1 } = pointCells(d.v, steps), res = tidy(cells, p1);
    // the staircase
    const SX = 10, SY = 22, sw = 48, sh = 34;
    const sv = svgEl('svg', { width: 10 * sw + 20, height: 10 * sh + 60, class: 'u4l4-stairsv' }); add(stage, sv, SX, SY);
    STAIR.forEach((u, i) => {
      const x = i * sw, y = i * sh + 20, main = !!MAIN[u];
      svgEl('rect', { x, y, width: sw, height: (10 - i) * sh, fill: main ? '#f1e4cf' : '#f6f3ec', stroke: '#b9ad97', 'stroke-width': 2 }, sv);
      const t = svgEl('text', { x: x + sw / 2, y: y + 24, 'text-anchor': 'middle', 'font-size': main ? 20 : 15, 'font-weight': main ? 800 : 600, fill: main ? '#4a3010' : '#9aa0ab' }, sv); t.textContent = u || '·';
    });
    const ball = svgEl('circle', { r: 11, fill: '#c93a33', stroke: '#fff', 'stroke-width': 3 }, sv);
    const placeBall = (s) => { ball.setAttribute('cx', s * sw + sw / 2); ball.setAttribute('cy', s * sh + 20 - 12); };
    placeBall(i0);
    const hopTag = hide(add(stage, box(cbox('u4l4-hop', down ? '× 10' : '÷ 10'), 64, 30), 0, 0));
    // the digits and the point
    const CW = 50, DX = 10 * sw + 60, DY = 40, N = cells.length, DW = N * CW;
    const dx0 = DX + Math.max(0, (W - DX - 10 - DW) / 2);
    const cellEls = cells.map((c, i) => { const e = add(stage, box(cbox('u4l4-dig' + (c.pad ? ' pad' : ''), c.ch), CW - 6, 70), dx0 + i * CW + 3, DY); if (c.pad) hide(e); return e; });
    const pt = add(stage, box(h('div', 'u4l4-pt'), 14, 14), 0, DY + 58);
    const placePt = (p) => { pt.style.left = (dx0 + p * CW - 7) + 'px'; };
    placePt(p0);
    const unitL = add(stage, box(cbox('u4l4-unit', d.from), 80, 40), dx0 + DW + 8, DY + 16);
    const L1 = hide(add(stage, box(WL('u4l4-wl', `${MAIN[d.from][0].toUpperCase() + MAIN[d.from].slice(1)}s → ${MAIN[d.to]}s: ${down ? '<b>down</b> the stairs to a <b>smaller</b> unit, so <b>multiply</b>.' : '<b>up</b> the stairs to a <b>bigger</b> unit, so <b>divide</b>.'}`), W - DX - 10, 64), DX, 140));
    const op = down ? '\\times' : '\\div', ops = Array(jumps).fill(`${op}1000`).join('');
    const L2 = hide(add(stage, box(WL('u4l4-wl', `${T(`${bigT(d.v)}${ops}=${bigT(res)}`)}`), W - DX - 10, 56), DX, 214));
    const resB = hide(add(stage, box(cbox('u4l4-res', `${big(d.v)} ${d.from} = <b>${big(res)} ${d.to}</b>`), W - DX - 10, 60), DX, 290));
    const chk = hide(add(stage, box(WL('u4l4-wl sm', down ? 'Check: a smaller unit needs <b>more</b> of them, so the number got <b>bigger</b> ✓' : 'Check: a bigger unit needs <b>fewer</b> of them, so the number got <b>smaller</b> ✓'), W - DX - 10, 56), DX, 364));
    const hop = async (c, s) => { // one step on the stairs, one hop of the point
      const a = i0 + (down ? s : -s), b = a + (down ? 1 : -1), q0 = p0 + (down ? s : -s), q1 = q0 + (down ? 1 : -1);
      hopTag.style.left = (SX + Math.min(a, b) * sw + sw - 32) + 'px'; hopTag.style.top = (SY + Math.min(a, b) * sh - 22) + 'px';
      hopTag.style.opacity = 1;
      await tween(c, 300, (t) => { const x = lerp(a, b, t); ball.setAttribute('cx', x * sw + sw / 2); ball.setAttribute('cy', lerp(a, b, t) * sh + 20 - 12 - 18 * Math.sin(t * Math.PI)); pt.style.left = (dx0 + lerp(q0, q1, t) * CW - 7) + 'px'; pt.style.top = (DY + 58 - 26 * Math.sin(t * Math.PI)) + 'px'; });
      const ci = down ? q1 - 1 : q1; // a padded zero appears when the point passes it
      if (cells[ci] && cells[ci].pad && cellEls[ci].style.opacity === '0') await c.pop(cellEls[ci], 200);
      if (!down && q1 === 1 && cells[0].pad && cellEls[0].style.opacity === '0') await c.pop(cellEls[0], 200);
    };
    return [
      { cap: `Start with <b>${big(d.v)} ${d.from}</b>. ${down ? 'Going <b>down</b> to a smaller unit: <b>multiply</b>.' : 'Going <b>up</b> to a bigger unit: <b>divide</b>.'}`, run: (c) => c.fadeIn(L1) },
      { cap: `${d.from} → ${d.to} is <b>${Math.abs(steps)} steps</b> ${down ? 'down' : 'up'}: ${jumps === 2 ? '× 1000 × 1000' : (down ? '× 1000' : '÷ 1000')}. The point hops <b>${Math.abs(steps)} places ${down ? 'right' : 'left'}</b>${cells.some((x) => x.pad) ? ', and zeros fill the empty places' : ''}.`,
        run: async (c) => { for (let s = 0; s < Math.abs(steps); s++) await hop(c, s); hopTag.style.opacity = 0; placeBall(i1); placePt(p1); unitL.firstChild.textContent = d.to; await pulse(c, unitL, 1.15); await c.fadeIn(L2); } },
      { cap: `${big(d.v)} ${d.from} = <b>${big(res)} ${d.to}</b>.`, run: async (c) => { await c.pop(resB); await c.fadeIn(chk); } }
    ];
  }
};

/* ======================================================================================
 * 3. Loading the truck (Full notes)
 * ====================================================================================== */
const truck = {
  title: 'Loading the truck',
  height: 420,
  minW: 920,
  ask: 'Example 4: an empty truck is 4.8 t. It carries 14 pallets of 925 kg. The bridge limit is 18 t. Can it cross? Could it take one more pallet?',
  make(stage, v, ex) {
    const W = ex.W;
    const sv = svgEl('svg', { width: W - 20, height: 250, viewBox: `0 0 ${W - 20} 250`, class: 'u4l4-truck' }); add(stage, sv, 10, 0);
    svgEl('rect', { x: 0, y: 200, width: W - 20, height: 50, fill: '#c9cfd6' }, sv);
    svgEl('rect', { x: W - 280, y: 186, width: 260, height: 18, fill: '#8a7d68' }, sv); // the bridge deck
    [W - 260, W - 160, W - 60].forEach((x) => svgEl('rect', { x, y: 204, width: 14, height: 46, fill: '#8a7d68' }, sv));
    svgEl('rect', { x: W - 330, y: 60, width: 10, height: 140, fill: '#5d6675' }, sv);
    svgEl('rect', { x: W - 380, y: 40, width: 110, height: 70, rx: 10, fill: '#fff', stroke: '#c93a33', 'stroke-width': 6 }, sv);
    const sg = svgEl('text', { x: W - 325, y: 88, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, fill: '#1c2230' }, sv); sg.textContent = '18 t';
    // the truck: cab and flatbed
    const tr = svgEl('g', {}, sv);
    svgEl('rect', { x: 20, y: 120, width: 90, height: 70, rx: 10, fill: '#1f5bd6' }, tr);
    svgEl('rect', { x: 34, y: 130, width: 50, height: 28, rx: 4, fill: '#cfe9ff' }, tr);
    svgEl('rect', { x: 110, y: 168, width: 470, height: 22, fill: '#3a4254' }, tr);
    [60, 170, 470, 540].forEach((x) => svgEl('circle', { cx: x, cy: 196, r: 18, fill: '#1c2230', stroke: '#9aa0ab', 'stroke-width': 5 }, tr));
    const pals = [];
    for (let i = 0; i < 15; i++) {
      const col = i % 8, row = Math.floor(i / 8), x = 116 + col * 57, y = 132 - row * 36;
      const g = svgEl('g', {}, tr);
      svgEl('rect', { x, y, width: 52, height: 30, rx: 3, fill: i === 14 ? '#f3c1bd' : '#d8cdb8', stroke: i === 14 ? '#c93a33' : '#8a7d68', 'stroke-width': 2.5 }, g);
      svgEl('path', { d: `M${x} ${y + 15} H${x + 52} M${x + 17} ${y} V${y + 30} M${x + 35} ${y} V${y + 30}`, stroke: i === 14 ? '#c93a33' : '#8a7d68', 'stroke-width': 1.5 }, g);
      g.style.opacity = 0; pals.push(g);
    }
    // the gauge: 0 to 20 t
    const GX = 20, GY = 270, GW = W - 60;
    const gw = (t) => t / 20 * GW;
    const gauge = add(stage, box(h('div', 'u4l4-gauge'), GW, 40), GX, GY);
    const fill = h('div', 'u4l4-gfill'); gauge.appendChild(fill); fill.style.width = gw(4.8) + 'px';
    const lim = h('div', 'u4l4-glim'); gauge.appendChild(lim); lim.style.left = gw(18) + 'px';
    const gl = h('div', 'u4l4-glab', '18 t limit'); gauge.appendChild(gl); gl.style.left = (gw(18) - 50) + 'px';
    const read = add(stage, box(cbox('u4l4-gread', 'Total: <b>4.8 t</b>'), 260, 40), GX, GY + 48);
    const setTot = (t) => { fill.style.width = gw(Math.min(20, t)) + 'px'; fill.classList.toggle('over', t > 18 + 1e-9); read.firstChild.innerHTML = `Total: <b>${rnd(t, 3)} t</b>`; };
    const w1 = hide(add(stage, box(WL('u4l4-wl sm', `Pallets: ${T('14\\times925=12\\,950')} kg ${T('=12.95')} t`), 420, 44), GX + 280, GY + 46));
    const w2 = hide(add(stage, box(WL('u4l4-wl sm', `${T('4.8+12.95=17.75')} t`), 300, 44), GX + 280, GY + 96));
    const w3 = hide(add(stage, box(WL('u4l4-wl sm no', `${T('17.75+0.925=18.675')} t`), 300, 44), GX + 600, GY + 96));
    const okS = hide(stamp(stage, 'Can cross ✓', { ok: true, x: W - 200, y: 150, rotate: -6 }));
    const noS = hide(stamp(stage, 'Too heavy ✗', { ok: false, x: W - 200, y: 150, rotate: 6 }));
    return [
      { cap: 'The empty truck: <b>4.8 t</b>.', run: (c) => pulse(c, read, 1.08) },
      { cap: `Load 14 pallets of 925 kg: ${T('14\\times925=12\\,950')} kg. Change to tonnes: ÷ 1000 = <b>12.95 t</b>.`,
        run: async (c) => { for (let i = 0; i < 14; i++) { await c.pop(pals[i], 180); setTot(4.8 + 0.925 * (i + 1)); } await c.fadeIn(w1); } },
      { cap: `Same unit, then add: ${T('4.8+12.95=17.75')} t. That is under 18 t: the truck <b>can cross</b>.`, run: async (c) => { await c.fadeIn(w2); await stampIn(c, okS); } },
      { cap: `One more pallet? ${T('17.75+0.925=18.675')} t. <b>Over</b> the 18 t limit: no.`,
        run: async (c) => { okS.style.opacity = 0; await c.pop(pals[14], 300); setTot(18.675); await c.fadeIn(w3); await stampIn(c, noS); } }
    ];
  }
};

/* ======================================================================================
 * 4. Packing ounces into pounds (16 oz in each pound box)
 * ====================================================================================== */
const OZ = {
  d: { mode: 'pack', oz: 70, what: '(d) 70 oz to pounds and ounces' },
  c: { mode: 'pack', oz: 72, what: '(c) 72 oz to pounds', dec: true },
  b: { mode: 'unpack', lb: 3, oz: 7, what: '(b) 3 lb 7 oz to ounces' },
  e: { mode: 'part', lb: 3.25, what: '(e) 3.25 lb to pounds and ounces' }
};
const ozPack = {
  title: 'Pack the ounces into pounds',
  height: 440,
  minW: 920,
  choices: [{ sep: 'Example 6 check:' }, { v: 'd', label: '(d) 70 oz' }, { v: 'c', label: '(c) 72 oz' }, { v: 'b', label: '(b) 3 lb 7 oz' }, { v: 'e', label: '(e) 3.25 lb' }],
  ask: (k) => `Example 6${OZ[k].what.slice(0, 3)}: change <b>${OZ[k].what.slice(4).replace(/ to .*/, '')}</b> to ${OZ[k].what.replace(/.* to /, '')}.`,
  make(stage, k, ex) {
    const d = OZ[k], W = ex.W, C = 21, SQ = 18;
    const total = d.mode === 'pack' ? d.oz : d.mode === 'unpack' ? d.lb * 16 + d.oz : Math.round(d.lb * 16);
    const full = Math.floor(total / 16), left = total - 16 * full;
    const PX = 20, PY = 40, BX = 290, BY = 40, BG = 112;
    const boxes = []; for (let b = 0; b < Math.max(full + (left ? 1 : 0), 1) && b < 6; b++) {
      const bx = add(stage, box(h('div', 'u4l4-lbbox'), 4 * C + 10, 4 * C + 10), BX + b * BG, BY);
      const lab = add(stage, box(cbox('u4l4-lblab', b < full ? '1 lb' : (d.mode === 'part' ? '0.25 lb' : '')), 4 * C + 10, 26), BX + b * BG, BY + 4 * C + 14);
      boxes.push({ bx, lab }); if (d.mode === 'pack' || (b >= full && d.mode !== 'part')) { hide(bx, lab); }
    }
    const pilePos = (i) => [PX + (i % 10) * C, PY + Math.floor(i / 10) * C];
    const boxPos = (i) => { const b = Math.floor(i / 16), c = i % 16; return [BX + b * BG + 5 + (c % 4) * C, BY + 5 + Math.floor(c / 4) * C]; };
    const leftPos = (j) => [BX + j * C, BY + 4 * C + 50];
    const target = (i) => (i < 16 * full ? boxPos(i) : (d.mode === 'part' ? boxPos(i) : leftPos(i - 16 * full)));
    const sqs = [];
    for (let i = 0; i < total; i++) {
      const s = add(stage, box(h('div', 'u4l4-sq' + (i >= 16 * full ? ' left' : '')), SQ, SQ), 0, 0);
      const [x, y] = d.mode === 'pack' ? pilePos(i) : target(i); s.style.left = x + 'px'; s.style.top = y + 'px'; sqs.push(s);
      if (d.mode === 'part' && i >= 16 * full) hide(s);
    }
    const pileLab = add(stage, box(cbox('u4l4-lblab', d.mode === 'pack' ? `${total} oz, loose` : ''), 210, 26), PX, PY - 32);
    const leftLab = hide(add(stage, box(cbox('u4l4-lblab lft', `${left} oz left over`), 200, 26), BX + Math.max(left, 4) * C + 8, BY + 4 * C + 46));
    const WX = 20, WY = 250, WW = W - 40;
    const lines = []; const line = (html, y, cls = '') => { const e = hide(add(stage, box(WL('u4l4-wl' + cls, html), WW, 50), WX, WY + y)); lines.push(e); return e; };
    let steps;
    if (d.mode === 'pack') {
      const q = total / 16, frac = rnd(q - full, 4);
      const l1 = line(`Step 1: ${T(`${total}\\div16=${rnd(q, 4)}`)}, so <b>${full} lb</b>`, 0);
      const l2 = line(d.dec ? `${T(`${rnd(q, 4)}`)} lb: ${full} whole pounds and <b>half</b> a pound (8 oz)` : `Step 2: ${T(`${frac}\\times16=${left}`)} oz left over (or ${T(`${total}-${16 * full}=${left}`)})`, 56);
      const res = hide(add(stage, box(cbox('u4l4-res', d.dec ? `${total} oz = <b>${rnd(q, 4)} lb</b> (4 lb 8 oz)` : `${total} oz = <b>${lbo(full, left)}</b>. Check: ${T(`${full}\\times16+${left}=${total}`)} ✓`), WW, 58), WX, WY + 118));
      steps = [
        { cap: `${total} ounces, loose. Each pound holds <b>16 oz</b>.`, run: (c) => pulse(c, pileLab, 1.08) },
        { cap: `Pack them into pound boxes, 16 at a time: <b>${full}</b> full boxes.`,
          run: async (c) => { pileLab.style.opacity = 0; for (const b of boxes.slice(0, full)) { b.bx.style.opacity = 1; b.lab.style.opacity = 1; } const from = sqs.map((s) => [parseFloat(s.style.left), parseFloat(s.style.top)]), to = sqs.map((s, i) => target(i));
            await tween(c, 1400, (t) => sqs.forEach((s, i) => { const tt = Math.max(0, Math.min(1, t * 1.6 - (i / total) * 0.6)); s.style.left = lerp(from[i][0], to[i][0], tt) + 'px'; s.style.top = lerp(from[i][1], to[i][1], tt) + 'px'; })); await c.fadeIn(leftLab); await c.fadeIn(l1); } },
        { cap: d.dec ? `${T(`${total}\\div16=${rnd(q, 4)}`)}: 4 full pounds and the 8 oz left over are <b>half</b> a pound.` : `${left} oz are left over: ${T(`${frac}\\times16=${left}`)}.`, run: (c) => c.fadeIn(l2) },
        { cap: d.dec ? `${total} oz = <b>${rnd(q, 4)} lb</b>.` : `${total} oz = <b>${lbo(full, left)}</b>.`, run: (c) => c.pop(res) }
      ];
    } else if (d.mode === 'unpack') {
      const l1 = line(`Each pound is 16 oz: ${T(`${d.lb}\\times16=${16 * d.lb}`)} oz`, 0);
      const l2 = line(`Add the extra ounces: ${T(`${16 * d.lb}+${d.oz}=${total}`)} oz`, 56);
      const res = hide(add(stage, box(cbox('u4l4-res', `${lbo(d.lb, d.oz)} = <b>${total} oz</b>`), WW, 58), WX, WY + 118));
      boxes.forEach((b, i) => { if (i < full) b.lab.firstChild.innerHTML = '16 oz'; });
      steps = [
        { cap: `${lbo(d.lb, d.oz)}: ${d.lb} full pound boxes and ${d.oz} loose ounces.`, run: (c) => c.fadeIn(leftLab) },
        { cap: `Open the boxes: each pound is <b>16 oz</b>. ${T(`${d.lb}\\times16=${16 * d.lb}`)} oz.`, run: async (c) => { for (const b of boxes.slice(0, full)) await pulse(c, b.bx, 1.08); await c.fadeIn(l1); } },
        { cap: `Add the ${d.oz} extra ounces: ${T(`${16 * d.lb}+${d.oz}=${total}`)}.`, run: (c) => c.fadeIn(l2) },
        { cap: `${lbo(d.lb, d.oz)} = <b>${total} oz</b>.`, run: (c) => c.pop(res) }
      ];
    } else {
      const l1 = line(`${T('3.25')} lb = 3 whole pounds and ${T('0.25')} of a pound`, 0);
      const l2 = line(`${T('0.25\\times16=4')} oz (a quarter of 16)`, 56);
      const res = hide(add(stage, box(cbox('u4l4-res', '3.25 lb = <b>3 lb 4 oz</b> (not 3 lb 25 oz!)'), WW, 58), WX, WY + 118));
      steps = [
        { cap: '3.25 lb: 3 full pound boxes and part of a fourth box.', run: (c) => c.fadeIn(l1) },
        { cap: `The part: ${T('0.25')} of a pound. A pound is 16 oz, so ${T('0.25\\times16=4')} oz.`, run: async (c) => { for (const s of sqs.slice(48)) await c.pop(s, 160); await c.fadeIn(l2); } },
        { cap: '3.25 lb = <b>3 lb 4 oz</b>. The “.25” is not 25 ounces!', run: (c) => c.pop(res) }
      ];
    }
    return steps;
  }
};

/* ======================================================================================
 * 5. The decimal part is not ounces (Full notes)
 * ====================================================================================== */
const NO = { 1.5: { lb: 1, part: 0.5, word: 'half' }, 2.25: { lb: 2, part: 0.25, word: 'a quarter' }, 3.75: { lb: 3, part: 0.75, word: 'three quarters' } };
const notOz = {
  title: 'The decimal part is not ounces',
  height: 380,
  minW: 900,
  choices: [{ v: 1.5, label: '1.5 lb' }, { v: 2.25, label: '2.25 lb' }, { v: 3.75, label: '3.75 lb' }],
  ask: (v) => `Is ${v} lb the same as ${NO[v].lb} lb ${String(v).split('.')[1]} oz?`,
  make(stage, v, ex) {
    const d = NO[v], W = ex.W, wrongOz = parseInt(String(v).split('.')[1], 10), oz = Math.round(d.part * 16), BW = 16 * 28;
    const bar = (y, lab, n, cls) => {
      const lb = add(stage, box(cbox('u4l4-barlab', lab), 200, 44), 10, y);
      const row = add(stage, box(h('div', 'u4l4-bar'), BW, 44), 220, y);
      const cells = []; for (let i = 0; i < 16; i++) { const e = h('span', 'u4l4-oz'); row.appendChild(e); cells.push(e); }
      return { lb, row, cells, fill: (c, m) => tween(c, 600, (t) => cells.forEach((e, i) => e.classList.toggle(cls, i < Math.round(m * t)))) };
    };
    const A = bar(20, '1 pound = 16 oz', 16, 'on'), B = bar(90, `${d.part} of a pound`, 16, 'on'), Cb = bar(160, `“${wrongOz} oz”`, 16, 'bad');
    A.cells.forEach((e) => e.classList.add('on'));
    hide(B.row, Cb.row, Cb.lb);
    const wr = hide(add(stage, box(WL('u4l4-wl', `${T(`${d.part}\\times16=${oz}`)} oz, so ${v} lb = <b>${d.lb} lb ${oz} oz</b>`), W - 240, 52), 220, 226));
    const s1 = hide(stamp(stage, `${d.lb} lb ${oz} oz ✓`, { ok: true, x: W - 130, y: 112, rotate: -5, size: 'sm' }));
    const s2 = hide(stamp(stage, `Not ${d.lb} lb ${wrongOz} oz ✗`, { ok: false, x: W - 130, y: 182, rotate: 5, size: 'sm' }));
    const note = hide(add(stage, box(WL('u4l4-wl sm', `${wrongOz} oz would be only ${wrongOz} of the 16 pieces${wrongOz > 16 ? ': more than a whole pound!' : '.'} A pound has 16 ounces, not 10 or 100.`), W - 240, 70), 220, 290));
    return [
      { cap: 'A pound is cut into <b>16</b> ounces.', run: (c) => pulse(c, A.row, 1.03) },
      { cap: `${v} lb is ${d.lb} lb and <b>${d.word}</b> of a pound: ${T(`${d.part}\\times16=${oz}`)} oz.`, run: async (c) => { B.row.style.opacity = 1; await B.fill(c, oz); await c.fadeIn(wr); await stampIn(c, s1); } },
      { cap: `“${d.lb} lb ${wrongOz} oz” reads the digits as ounces. That is a different mass.`, run: async (c) => { Cb.row.style.opacity = 1; await c.fadeIn(Cb.lb); await Cb.fill(c, Math.min(16, wrongOz)); await stampIn(c, s2); await c.fadeIn(note); } }
    ];
  }
};

/* ======================================================================================
 * 6. Pounds and ounces in columns: trade 16 oz for 1 lb, or borrow 1 lb as 16 oz
 * ====================================================================================== */
const LO = {
  a: { op: '+', rows: [[5, 12], [3, 9]], what: 'Example 8(a): 5 lb 12 oz + 3 lb 9 oz' },
  b: { op: '−', rows: [[7, 3], [2, 10]], what: 'Example 8(b): 7 lb 3 oz − 2 lb 10 oz' },
  c: { op: '×', rows: [[1, 11]], times: 4, what: 'Example 8(c): 4 × (1 lb 11 oz)' },
  owen: { op: '+', rows: [[4, 9], [2, 14], [1, 3], [3, 11]], what: 'Example 9(a): Owen’s tent, sleeping bag, stove and food. Under 12 lb?', names: ['tent', 'sleeping bag', 'stove and pot', 'food'], limit: 12 },
  bear: { op: '−', rows: [[11, 4], [6, 13]], what: 'Example 9(b): Bear weighed 6 lb 13 oz, then 11 lb 4 oz. How much did he gain?', names: ['at 12 weeks', 'at 8 weeks'] }
};
const lbOz = {
  title: 'Pounds and ounces in columns',
  height: 440,
  minW: 920,
  choices: [{ sep: 'Example 8:' }, { v: 'a', label: '(a) add' }, { v: 'b', label: '(b) subtract' }, { v: 'c', label: '(c) multiply' }, { sep: 'Example 9:' }, { v: 'owen', label: '(a) Owen’s pack' }, { v: 'bear', label: '(b) Bear the puppy' }],
  ask: (k) => LO[k].what,
  make(stage, k, ex) {
    const d = LO[k], W = ex.W, X0 = 170, CW = 130, RH = 50, Y0 = 84;
    const XL = X0 + 50, XO = X0 + 50 + CW + 20;
    add(stage, box(cbox('u4l4-colh', 'lb'), CW, 30), XL, 0); add(stage, box(cbox('u4l4-colh', 'oz'), CW, 30), XO, 0);
    const cell = (x, y, s, cls = '') => add(stage, box(cbox('u4l4-cell' + cls, s), CW, RH - 6), x, y);
    const rows = d.rows.map((r, i) => {
      const y = Y0 + i * RH;
      if (d.names) add(stage, box(cbox('u4l4-rname', d.names[i]), 160, RH - 6), 4, y);
      if (i === d.rows.length - 1 && d.op !== '×') add(stage, box(cbox('u4l4-opc', d.op), 40, RH - 6), X0, y);
      return { lb: cell(XL, y, String(r[0])), oz: cell(XO, y, String(r[1])), y };
    });
    let yy = Y0 + d.rows.length * RH;
    if (d.op === '×') { add(stage, box(cbox('u4l4-opc', '×'), 40, RH - 6), X0, yy); add(stage, box(cbox('u4l4-cell', `${d.times} &nbsp;<small>(each column)</small>`), 2 * CW + 20, RH - 6), XL, yy); yy += RH; }
    add(stage, box(h('div', 'u4l4-rule'), 2 * CW + 70, 4), X0, yy + 2);
    const ry = yy + 12;
    // compute
    let lb, oz, steps = [];
    const PX = XO + CW + 40, PW = W - PX - 10;
    const note = (html, i, cls = '') => hide(add(stage, box(WL('u4l4-wl sm' + cls, html), PW, 64), PX, 20 + i * 74));
    if (d.op === '+' || d.op === '×') {
      const m = d.op === '×' ? d.times : 1;
      lb = d.rows.reduce((s, r) => s + r[0], 0) * m; oz = d.rows.reduce((s, r) => s + r[1], 0) * m;
      const trades = Math.floor(oz / 16), lb2 = lb + trades, oz2 = oz - 16 * trades;
      const rL = hide(cell(XL, ry, String(lb), ' sum')), rO = hide(cell(XO, ry, String(oz), ' sum'));
      const fL = hide(cell(XL, ry + RH, String(lb2), ' fin')), fO = hide(cell(XO, ry + RH, String(oz2), ' fin'));
      const chip = hide(add(stage, box(cbox('u4l4-trade', trades > 1 ? `${trades} × 16 oz → ${trades} lb` : '16 oz → 1 lb'), 190, 40), XO - 30, ry + RH + 2));
      const ozSum = d.op === '×' ? `${d.times}\\times${d.rows[0][1]}=${oz}` : `${d.rows.map((r) => r[1]).join('+')}=${oz}`;
      const lbSum = d.op === '×' ? `${d.times}\\times${d.rows[0][0]}=${lb}` : `${d.rows.map((r) => r[0]).join('+')}=${lb}`;
      const n1 = note(`Ounces: ${T(ozSum)}<br>Pounds: ${T(lbSum)}`, 0);
      const n2 = note(`${T(`${oz}`)} oz ${T(trades > 1 ? `=${trades}\\times16+${oz2}` : `=16+${oz2}`)}<br>= ${trades} lb ${oz2} oz`, 1);
      const n3 = note(`Answer: <b>${lbo(lb2, oz2)}</b>`, 2, ' hl');
      steps = [
        { cap: d.op === '×' ? 'Multiply the pounds and the ounces <b>separately</b>.' : 'Line up <b>pounds under pounds</b> and <b>ounces under ounces</b>.', run: async (c) => { for (const r of rows) await pulse(c, r.oz, 1.08); } },
        { cap: d.op === '×' ? `${T(lbSum)} lb and ${T(ozSum)} oz.` : `Add the ounces: ${T(ozSum)}. Add the pounds: ${T(lbSum)}.`, run: async (c) => { await c.pop(rO); await c.pop(rL); await c.fadeIn(n1); } },
        { cap: `${oz} oz is 16 oz or more: trade ${trades > 1 ? `${trades * 16} oz for <b>${trades} lb</b>` : '16 oz for <b>1 lb</b>'}. ${T(`${oz}-${16 * trades}=${oz2}`)} oz.`,
          run: async (c) => { await c.pop(chip); await c.anim(chip, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${XL - XO + 20}px)`, opacity: 0 }], 800); chip.style.opacity = 0; await c.pop(fL); await c.pop(fO); await c.fadeIn(n2); } },
        { cap: `Answer: <b>${lbo(lb2, oz2)}</b>.`, run: (c) => c.fadeIn(n3) }
      ];
      if (d.limit) {
        const over = (lb2 - d.limit) * 16 + oz2;
        const n4 = note(`${lbo(lb2, oz2)} is more than ${d.limit} lb: <b>${over} oz over</b>.`, 3, ' no');
        const st = hide(stamp(stage, 'Not under 12 lb ✗', { ok: false, x: PX + PW / 2, y: 392, rotate: 5 }));
        steps.push({ cap: `Owen wanted under 12 lb. ${lbo(lb2, oz2)} is <b>${over} oz over</b>.`, run: async (c) => { await c.fadeIn(n4); await stampIn(c, st); } });
      }
    } else {
      const [[a1, b1], [a2, b2]] = d.rows, borrow = b1 < b2, ta = borrow ? a1 - 1 : a1, tb = borrow ? b1 + 16 : b1;
      const nL = hide(cell(XL, Y0 - 50, String(ta), ' new')), nO = hide(cell(XO, Y0 - 50, String(tb), ' new'));
      const chip = hide(add(stage, box(cbox('u4l4-trade', '1 lb → 16 oz'), 170, 40), XL + 20, ry + 4));
      const rL = hide(cell(XL, ry, String(ta - a2), ' fin')), rO = hide(cell(XO, ry, String(tb - b2), ' fin'));
      const n1 = note(`${b1} oz is less than ${b2} oz: <b>borrow</b>.<br>${lbo(a1, b1)} = ${lbo(ta, tb)}`, 0);
      const n2 = note(`${T(`${ta}-${a2}=${ta - a2}`)} lb, ${T(`${tb}-${b2}=${tb - b2}`)} oz`, 1);
      const n3 = note(`Answer: <b>${lbo(ta - a2, tb - b2)}</b>${d.names ? ' gained' : ''}`, 2, ' hl');
      steps = [
        { cap: 'Line up <b>pounds under pounds</b> and <b>ounces under ounces</b>. Bigger mass on top.', run: async (c) => { for (const r of rows) await pulse(c, r.oz, 1.08); } },
        { cap: `${b1} oz is less than ${b2} oz. <b>Borrow</b> 1 lb and turn it into 16 oz: ${lbo(a1, b1)} = ${lbo(ta, tb)}.`,
          run: async (c) => { await c.pop(chip); await c.anim(chip, [{ transform: 'none' }, { transform: `translate(${XO - XL}px, ${Y0 - 50 - ry}px)`, opacity: 0.3 }], 700); chip.style.opacity = 0;
            rows[0].lb.classList.add('struck'); rows[0].oz.classList.add('struck'); await c.pop(nL); await c.pop(nO); await c.fadeIn(n1); } },
        { cap: `Subtract: ${T(`${tb}-${b2}=${tb - b2}`)} oz and ${T(`${ta}-${a2}=${ta - a2}`)} lb.`, run: async (c) => { await c.pop(rO); await c.pop(rL); await c.fadeIn(n2); } },
        { cap: `Answer: <b>${lbo(ta - a2, tb - b2)}</b>${d.names ? '. Bear gained 4 lb 7 oz.' : '.'}`, run: (c) => c.fadeIn(n3) }
      ];
    }
    return steps;
  }
};

/* ======================================================================================
 * 7. The watermelon's true cost (Full notes)
 * ====================================================================================== */
const trueCost = {
  title: 'True cost: pay for the rind, eat the fruit',
  height: 420,
  minW: 920,
  ask: 'Example 10(b): a 9 lb 4 oz watermelon at $0.80 per lb. After the rind is cut off, 5 lb 9 oz of fruit is left. What is the true cost per pound of fruit?',
  make(stage, v, ex) {
    const W = ex.W, SW = 330;
    const sv = svgEl('svg', { width: SW, height: 300, viewBox: `0 0 ${SW} 300`, class: 'u4l4-melon' }); add(stage, sv, 10, 10);
    const whole = svgEl('g', {}, sv);
    svgEl('ellipse', { cx: 165, cy: 150, rx: 150, ry: 110, fill: '#2f7a25' }, whole);
    for (let i = -3; i <= 3; i++) svgEl('path', { d: `M${165 + i * 38} 42 Q${165 + i * 48} 150 ${165 + i * 38} 258`, stroke: '#1d5a17', 'stroke-width': 9, fill: 'none' }, whole);
    const cut = svgEl('g', { opacity: 0 }, sv);
    svgEl('ellipse', { cx: 165, cy: 150, rx: 150, ry: 110, fill: '#9bd18a', stroke: '#2f7a25', 'stroke-width': 12 }, cut);
    const fruit = svgEl('ellipse', { cx: 165, cy: 150, rx: 124, ry: 86, fill: '#ef5a6f' }, cut);
    for (let i = 0; i < 14; i++) svgEl('ellipse', { cx: 80 + (i * 53) % 170, cy: 100 + (i * 37) % 100, rx: 4, ry: 7, fill: '#1c2230' }, cut);
    const PX = SW + 40, PW = W - PX - 10;
    const L = [
      `Whole melon: 9 lb 4 oz ${T('=9+4\\div16=9.25')} lb`,
      `She pays: ${T('9.25\\times\\$0.80=\\$7.40')}`,
      `Fruit: 5 lb 9 oz ${T('=5+9\\div16=5.5625')} lb`,
      `True cost: ${T('\\$7.40\\div5.5625\\approx\\$1.33')} per lb`
    ].map((s, i) => hide(add(stage, box(WL('u4l4-wl' + (i === 3 ? ' hl' : ''), s), PW, 56), PX, 10 + i * 68)));
    const tag = hide(add(stage, box(cbox('u4l4-ptag', '<b>$7.40</b><span>9.25 lb at $0.80/lb</span>'), 200, 76), 30, 320));
    const cmp = hide(add(stage, box(WL('u4l4-wl sm', 'The sign says <b>$0.80</b> per lb. The fruit she eats really costs about <b>$1.33</b> per lb.'), PW, 64), PX, 300));
    return [
      { cap: `The whole melon: 9 lb 4 oz. Change to decimal pounds: ${T('4\\div16=0.25')}, so <b>9.25 lb</b>.`, run: (c) => c.fadeIn(L[0]) },
      { cap: `She pays for the <b>whole</b> melon: ${T('9.25\\times\\$0.80=\\$7.40')}.`, run: async (c) => { await c.fadeIn(L[1]); await c.pop(tag); } },
      { cap: `Cut off the rind: 5 lb 9 oz of fruit is left. ${T('9\\div16=0.5625')}, so <b>5.5625 lb</b>.`,
        run: async (c) => { await tween(c, 900, (t) => { whole.setAttribute('opacity', 1 - t); cut.setAttribute('opacity', t); }); await c.fadeIn(L[2]); } },
      { cap: `True cost = paid ÷ usable pounds: ${T('\\$7.40\\div5.5625\\approx\\$1.33')} per lb of fruit.`, run: async (c) => { await pulse(c, fruit, 1.05); await c.fadeIn(L[3]); await c.fadeIn(cmp); } }
    ];
  }
};

/* ======================================================================================
 * Scale pictures: a kitchen dial (0–1000 g) and a straight pointer scale
 * ====================================================================================== */
function drawDial(svg, { cx, cy, r, reading }) {
  svgEl('circle', { cx, cy, r: r + 10, fill: '#e9e6dd', stroke: '#3a4254', 'stroke-width': 4 }, svg);
  svgEl('circle', { cx, cy, r, fill: '#fff', stroke: '#3a4254', 'stroke-width': 3 }, svg);
  const pt = (v, rr) => { const a = (v * 0.36 - 90) * Math.PI / 180; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; };
  for (let v = 0; v < 1000; v += 20) { const maj = v % 100 === 0, [x1, y1] = pt(v, r), [x2, y2] = pt(v, r - (maj ? r * 0.17 : r * 0.08)); svgEl('line', { x1, y1, x2, y2, stroke: '#1c2230', 'stroke-width': maj ? 3 : 1.6 }, svg); }
  for (let v = 0; v < 1000; v += 100) { const [x, y] = pt(v, r * 0.68); const t = svgEl('text', { x, y: y + r * 0.06, 'text-anchor': 'middle', 'font-size': Math.round(r * 0.13), 'font-weight': 800, fill: '#1c2230' }, svg); t.textContent = v; }
  const gt = svgEl('text', { x: cx, y: cy + r * 0.38, 'text-anchor': 'middle', 'font-size': Math.round(r * 0.12), 'font-weight': 700, fill: '#5d6675' }, svg); gt.textContent = 'grams';
  const needle = svgEl('g', {}, svg); needle.style.transformBox = 'view-box'; needle.style.transformOrigin = `${cx}px ${cy}px`;
  svgEl('path', { d: `M${cx - 5} ${cy} L${cx} ${cy - r * 0.86} L${cx + 5} ${cy} Z`, fill: '#c93a33' }, needle);
  svgEl('circle', { cx, cy, r: 8, fill: '#1c2230' }, svg);
  needle.style.transform = `rotate(${reading * 0.36}deg)`;
  return { needle, pt };
}
function drawStrip(svg, { x, y, first, last, step, per, reading, unit, len }) {
  const nl = Math.round((last - first) / step), u = len / nl, sp = u / per;
  svgEl('line', { x1: x, x2: x + len, y1: y, y2: y, stroke: '#1c2230', 'stroke-width': 3 }, svg);
  for (let i = 0; i <= nl * per; i++) {
    const px = x + i * sp, maj = i % per === 0, half = (2 * i) % per === 0;
    svgEl('line', { x1: px, x2: px, y1: y, y2: y - (maj ? 26 : half ? 18 : 11), stroke: '#1c2230', 'stroke-width': maj ? 2.6 : 1.5 }, svg);
    if (maj) { const t = svgEl('text', { x: px, y: y - 32, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#1c2230' }, svg); t.textContent = first + (i / per) * step; }
  }
  const ut = svgEl('text', { x: x + len + 12, y: y - 8, 'font-size': 18, 'font-weight': 700, fill: '#5d6675' }, svg); ut.textContent = unit;
  const px = x + (reading - first) / step * u;
  const ptr = svgEl('path', { d: `M${px} ${y + 2} l-9 22 h18 Z`, fill: '#c93a33' }, svg);
  return { ptr, xOf: (v) => x + (v - first) / step * u, sp };
}
function staticScales() {
  const mk = (id, w, hgt) => { const host = document.getElementById(id); if (!host) return null; const s = svgEl('svg', { viewBox: `0 0 ${w} ${hgt}`, width: w, height: hgt, class: 'u4l4-figsv' }); host.appendChild(s); return s; };
  const a = mk('u4l4-dialA', 280, 280); if (a) drawDial(a, { cx: 140, cy: 140, r: 120, reading: 340 });
  const b = mk('u4l4-stripB', 470, 80); if (b) drawStrip(b, { x: 16, y: 50, first: 120, last: 160, step: 10, per: 10, reading: 143, unit: 'lb', len: 410 });
  const c = mk('u4l4-stripC', 470, 80); if (c) drawStrip(c, { x: 16, y: 50, first: 0, last: 3, step: 1, per: 8, reading: 1.625, unit: 'lb', len: 410 });
}
staticScales();

/* ======================================================================================
 * 8. Reading scales
 * ====================================================================================== */
const readScale = {
  title: 'Read the scale',
  height: 440,
  minW: 920,
  choices: [{ sep: 'Example 11 check:' }, { v: 'a', label: '(a) Kitchen dial' }, { v: 'b', label: '(b) Bathroom scale' }, { v: 'c', label: '(c) Produce scale' }, { v: 'd', label: '(d) Digital + TARE' }],
  ask: (k) => ({ a: 'Example 11(a): what does the kitchen scale read?', b: 'Example 11(b): what does the bathroom scale read, in pounds?', c: 'Example 11(c): what does the produce scale read, in pounds and ounces?',
    d: 'Example 11(d): a bowl of flour shows 1.24 kg. The empty bowl is 315 g. How much flour?' }[k]),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'a') {
      const sv = svgEl('svg', { width: 420, height: 430, viewBox: '0 0 420 430' }); add(stage, sv, 10, 4);
      const D = drawDial(sv, { cx: 205, cy: 218, r: 165, reading: 340 });
      const arc = (a, b, col, w = 14) => { const [x1, y1] = D.pt(a, 182), [x2, y2] = D.pt(b, 182); return svgEl('path', { d: `M${x1} ${y1} A182 182 0 0 1 ${x2} ${y2}`, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, sv); };
      const a1 = arc(0, 100, '#1f5bd6');
      const nums = [1, 2, 3, 4, 5].map((i) => { const [x, y] = D.pt(i * 20 - 10, 200); const t = svgEl('text', { x, y: y + 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#1f5bd6', opacity: 0 }, sv); t.textContent = i; return t; });
      const a2 = arc(300, 320, '#c93a33'), a3 = arc(320, 340, '#c93a33');
      const PX = 450, PW = W - PX - 10;
      const L = ['0 and 100: a difference of <b>100 g</b>', `5 spaces: ${T('100\\div5=20')} g each`, 'Start at <b>300</b>, count on: 320, <b>340</b>'].map((s, i) => hide(add(stage, box(WL('u4l4-wl', s), PW, 56), PX, 20 + i * 70)));
      const res = hide(add(stage, box(cbox('u4l4-res', 'The scale reads <b>340 g</b>'), PW, 60), PX, 240));
      return [
        { cap: 'Step 1: find two numbers next to each other: <b>0</b> and <b>100</b>. Difference: 100 g.', run: async (c) => { await tween(c, 500, (t) => a1.setAttribute('opacity', t)); await c.fadeIn(L[0]); } },
        { cap: `Step 2: count the <b>spaces</b> (not the lines): 5 spaces. One space is ${T('100\\div5=20')} g.`, run: async (c) => { for (const n of nums) { await tween(c, 160, (t) => n.setAttribute('opacity', t)); } await c.fadeIn(L[1]); } },
        { cap: 'Step 3: the last number before the pointer is <b>300</b>. Count on 20 at a time: 320, 340.', run: async (c) => { await tween(c, 400, (t) => a2.setAttribute('opacity', t)); await tween(c, 400, (t) => a3.setAttribute('opacity', t)); await c.fadeIn(L[2]); } },
        { cap: 'The scale reads <b>340 g</b>.', run: (c) => c.pop(res) }
      ];
    }
    if (k === 'b' || k === 'c') {
      const B = k === 'b', o = B ? { first: 120, last: 160, step: 10, per: 10, reading: 143, unit: 'lb' } : { first: 0, last: 3, step: 1, per: 8, reading: 1.625, unit: 'lb' };
      const len = W - 140, sv = svgEl('svg', { width: W - 20, height: 170, viewBox: `0 0 ${W - 20} 170` }); add(stage, sv, 10, 4);
      const S = drawStrip(sv, Object.assign({ x: 40, y: 110, len }, o));
      const x0 = S.xOf(B ? 120 : 0), x1 = S.xOf(B ? 130 : 1), base = B ? 140 : 1, nCount = B ? 3 : 5;
      const band = svgEl('rect', { x: x0, y: 138, width: x1 - x0, height: 10, rx: 5, fill: '#1f5bd6', opacity: 0 }, sv);
      const nums = []; const per = o.per;
      for (let i = 1; i <= per; i++) { const t = svgEl('text', { x: x0 + (i - 0.5) * S.sp, y: 164, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#1f5bd6', opacity: 0 }, sv); t.textContent = i; nums.push(t); }
      const hops = []; for (let i = 0; i < nCount; i++) { const xa = S.xOf(base) + i * S.sp; hops.push(svgEl('path', { d: `M${xa} 56 Q${xa + S.sp / 2} 30 ${xa + S.sp} 56`, stroke: '#c93a33', 'stroke-width': 3, fill: 'none', opacity: 0 }, sv)); }
      const labs = B ? ['', '', '143'] : ['2', '4', '6', '8', '10 oz'];
      const hl = labs.map((s, i) => { const t = svgEl('text', { x: S.xOf(base) + (i + 1) * S.sp, y: 24, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#c93a33', opacity: 0 }, sv); t.textContent = s; return t; });
      const L = (B ? ['120 and 130: a difference of <b>10 lb</b>', `10 spaces: ${T('10\\div10=1')} lb each`, 'Start at <b>140</b>, count on 3: 141, 142, <b>143</b>']
        : ['0 and 1: a difference of <b>1 lb = 16 oz</b>', `8 spaces: ${T('16\\div8=2')} oz each`, 'Start at <b>1 lb</b>, count on 5 spaces: 2, 4, 6, 8, <b>10 oz</b>'])
        .map((s, i) => hide(add(stage, box(WL('u4l4-wl', s), W - 40, 50), 20, 186 + i * 56)));
      const res = hide(add(stage, box(cbox('u4l4-res', B ? 'The scale reads <b>143 lb</b>' : 'The scale reads <b>1 lb 10 oz</b>'), 460, 56), (W - 460) / 2, 362));
      const show = (els, ms = 120) => (c) => (async () => { for (const e of els) await tween(c, ms, (t) => e.setAttribute('opacity', t)); })();
      return [
        { cap: B ? 'Step 1: two numbers next to each other: <b>120</b> and <b>130</b>. Difference: 10 lb.' : 'Step 1: two numbers next to each other: <b>0</b> and <b>1</b>. Difference: 1 lb, which is <b>16 oz</b>.', run: async (c) => { await show([band], 400)(c); await c.fadeIn(L[0]); } },
        { cap: B ? `Step 2: count the spaces: 10. One space is ${T('10\\div10=1')} lb.` : `Step 2: count the spaces: 8. One space is ${T('16\\div8=2')} oz.`, run: async (c) => { await show(nums, 90)(c); await c.fadeIn(L[1]); } },
        { cap: B ? 'Step 3: the last number before the pointer is <b>140</b>. Count on: 141, 142, 143.' : 'Step 3: the last number before the pointer is <b>1</b>. Count on 2 oz at a time: 2, 4, 6, 8, 10.',
          run: async (c) => { for (let i = 0; i < hops.length; i++) { await show([hops[i], hl[i]], 200)(c); } await c.fadeIn(L[2]); } },
        { cap: B ? 'The scale reads <b>143 lb</b>.' : 'The scale reads <b>1 lb 10 oz</b>.', run: (c) => c.pop(res) }
      ];
    }
    // (d) the digital scale and TARE
    const sv = svgEl('svg', { width: 380, height: 360, viewBox: '0 0 380 360' }); add(stage, sv, 10, 20);
    svgEl('rect', { x: 20, y: 250, width: 340, height: 70, rx: 14, fill: '#3a4254' }, sv);
    svgEl('rect', { x: 40, y: 236, width: 300, height: 18, rx: 6, fill: '#d7dbe0' }, sv);
    const lcd = svgEl('rect', { x: 120, y: 266, width: 150, height: 40, rx: 6, fill: '#c9d4bf' }, sv); void lcd;
    const disp = svgEl('text', { x: 262, y: 296, 'text-anchor': 'end', 'font-size': 28, 'font-weight': 800, 'font-family': 'ui-monospace, Menlo, monospace', fill: '#1d2a18' }, sv); disp.textContent = '1.240 kg';
    const tare = svgEl('g', {}, sv); svgEl('rect', { x: 290, y: 272, width: 56, height: 28, rx: 8, fill: '#e8a01e' }, tare);
    const tt = svgEl('text', { x: 318, y: 292, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#1c2230' }, tare); tt.textContent = 'TARE';
    const bowl = svgEl('g', {}, sv);
    svgEl('path', { d: 'M80 150 H300 Q290 236 190 236 Q90 236 80 150 Z', fill: '#cfe0fb', stroke: '#1f5bd6', 'stroke-width': 4 }, bowl);
    const flour = svgEl('path', { d: 'M86 150 Q190 104 294 150 Z', fill: '#f6f1e6', stroke: '#c9b48a', 'stroke-width': 3 }, bowl);
    const PX = 420, PW = W - PX - 10;
    const L = [`Total: 1.24 kg ${T('=1.24\\times1000=1240')} g`, 'Empty bowl: <b>315 g</b>', `Flour: ${T('1240-315=925')} g`].map((s, i) => hide(add(stage, box(WL('u4l4-wl', s), PW, 56), PX, 20 + i * 70)));
    const res = hide(add(stage, box(cbox('u4l4-res', 'There are <b>925 g</b> of flour'), PW, 60), PX, 236));
    const tip = hide(add(stage, box(WL('u4l4-wl sm', 'Next time: put the empty bowl on and press <b>TARE</b>. The scale shows 0, then only the flour: <b>0.925 kg</b>.'), PW, 80), PX, 316));
    return [
      { cap: `The scale shows the bowl <b>and</b> the flour: 1.24 kg. Same unit first: ${T('1.24\\times1000=1240')} g.`, run: (c) => c.fadeIn(L[0]) },
      { cap: 'The empty bowl is <b>315 g</b>.', run: (c) => c.fadeIn(L[1]) },
      { cap: `Mass of food = total − bowl: ${T('1240-315=925')} g.`, run: async (c) => { await c.fadeIn(L[2]); await c.pop(res); } },
      { cap: 'With <b>TARE</b>: the empty bowl on, press TARE (0.000 kg), add the flour: 0.925 kg.',
        run: async (c) => { flour.setAttribute('opacity', 0); disp.textContent = '0.315 kg'; await c.sleep(300); await pulse(c, tare, 1.25); disp.textContent = '0.000 kg'; await c.sleep(400);
          await tween(c, 900, (t) => { flour.setAttribute('opacity', t); disp.textContent = (0.925 * t).toFixed(3) + ' kg'; }); disp.textContent = '0.925 kg'; await c.fadeIn(tip); } }
    ];
  }
};


/* ======================================================================================
 * Ruby's flour, bag by bag (Full notes)
 * ====================================================================================== */
const flour = {
  title: 'How many bags of flour?',
  height: 400,
  minW: 900,
  ask: 'Example 3: 6 loaves × 650 g of flour. Bags are 2.5 kg. How many bags, and is there enough left for one more loaf?',
  make(stage, v, ex) {
    const W = ex.W, X = 30, BW = W - 60, kg = (m) => m / 5 * BW;
    // six loaves, 650 g each
    const loaves = []; for (let i = 0; i < 6; i++) loaves.push(hide(add(stage, box(cbox('u4l4-cell', '650 g'), 110, 44), X + i * 122, 0)));
    const L1 = hide(add(stage, box(WL('u4l4-wl', `${T('6\\times650=3900')} g ${T('=3900\\div1000=3.9')} kg`), BW, 50), X, 56));
    const bags = add(stage, box(h('div', 'u4l4-bags'), BW, 70), X, 150); hide(bags);
    bags.appendChild(h('div', 'u4l4-bagseg')); bags.appendChild(h('div', 'u4l4-bagseg'));
    const need = h('div', 'u4l4-need'); bags.appendChild(need); need.style.width = '0px';
    const div = h('div', 'u4l4-bagdiv'); bags.appendChild(div); div.style.left = (kg(2.5) - 2) + 'px';
    const loaf = h('div', 'u4l4-loaf'); bags.appendChild(loaf); loaf.style.left = kg(3.9) + 'px'; loaf.style.width = '0px';
    const axl = hide(add(stage, box(cbox('u4l4-axl', 'bag 1 (2.5 kg) &nbsp;&nbsp;|&nbsp;&nbsp; bag 2 (2.5 kg)'), BW, 26), X, 224));
    const L2 = hide(add(stage, box(WL('u4l4-wl', `${T('3.9\\div2.5=1.56')} bags: round <b>up</b> to <b>2 bags</b> (5 kg)`), BW, 46), X, 256));
    const L3 = hide(add(stage, box(WL('u4l4-wl', `Left over: ${T('5-3.9=1.1')} kg ${T('=1100')} g. One more loaf (650 g) fits ✓`), BW, 46), X, 306));
    return [
      { cap: `Six loaves at 650 g: ${T('6\\times650=3900')} g, which is <b>3.9 kg</b>.`, run: async (c) => { for (const l of loaves) await c.pop(l, 180); await c.fadeIn(L1); } },
      { cap: 'Fill the 2.5 kg bags. 3.9 kg fills one bag and part of a second.', run: async (c) => { await c.fadeIn(bags); await c.fadeIn(axl); await tween(c, 900, (t) => { need.style.width = kg(3.9 * t) + 'px'; }); } },
      { cap: `${T('3.9\\div2.5=1.56')}. You cannot buy part of a bag: round up to <b>2 bags</b>.`, run: (c) => c.fadeIn(L2) },
      { cap: `Left over: ${T('5-3.9=1.1')} kg = 1100 g. Another loaf needs 650 g, so <b>yes</b>, it fits.`, run: async (c) => { await tween(c, 600, (t) => { loaf.style.width = kg(0.65 * t) + 'px'; }); await c.fadeIn(L3); } }
    ];
  }
};

/* ======================================================================================
 * Coffee: same unit, then price per ounce (Full notes)
 * ====================================================================================== */
const coffee = {
  title: 'Coffee: price per ounce',
  height: 380,
  minW: 900,
  ask: 'Example 10(a): 12 oz of coffee for $10.99, or 2 lb for $26.99. Which is the better buy?',
  make(stage, v, ex) {
    const W = ex.W, X = 20;
    const A = hide(add(stage, box(cbox('u4l4-ptag', '<b>$10.99</b><span>12 oz bag</span>'), 200, 76), X, 0));
    const B = hide(add(stage, box(cbox('u4l4-ptag', '<b>$26.99</b><span>2 lb bag</span>'), 200, 76), X, 96));
    const L0 = hide(add(stage, box(WL('u4l4-wl', `Same unit: 2 lb ${T('=2\\times16=32')} oz`), W - 260, 50), 240, 110));
    const L1 = hide(add(stage, box(WL('u4l4-wl', `12 oz: ${T('\\$10.99\\div12\\approx\\$0.916')} per oz`), W - 260, 50), 240, 14));
    const L2 = hide(add(stage, box(WL('u4l4-wl', `32 oz: ${T('\\$26.99\\div32\\approx\\$0.843')} per oz`), W - 260, 50), 240, 164));
    const scale = (p) => p / 1 * (W - 300);
    const bA = add(stage, h('div', 'u4l4-pbar'), X, 236); box(bA, 0, 34);
    const bB = add(stage, h('div', 'u4l4-pbar best'), X, 280); box(bB, 0, 34);
    const lA = hide(add(stage, box(cbox('u4l4-axl', '$0.916 per oz'), 140, 34), X + scale(0.916) + 8, 236));
    const lB = hide(add(stage, box(cbox('u4l4-axl', '$0.843 per oz'), 140, 34), X + scale(0.843) + 8, 280));
    const st = hide(stamp(stage, 'Best buy: 2 lb ✓', { ok: true, x: W - 160, y: 340, rotate: -5 }));
    return [
      { cap: 'The sizes are in different units: ounces and pounds.', run: async (c) => { await c.pop(A); await c.pop(B); } },
      { cap: `Same unit first: ${T('2\\times16=32')} oz.`, run: (c) => c.fadeIn(L0) },
      { cap: 'Price per ounce: price ÷ ounces. Keep three decimals.', run: async (c) => { await c.fadeIn(L1); await c.fadeIn(L2); await tween(c, 800, (t) => { bA.style.width = scale(0.916 * t) + 'px'; bB.style.width = scale(0.843 * t) + 'px'; }); await c.fadeIn(lA); await c.fadeIn(lB); } },
      { cap: 'The <b>2 lb bag</b> costs less per ounce: it is the better buy.', run: (c) => stampIn(c, st) }
    ];
  }
};

mountExplainers({ balance, stairs, flour, truck, ozPack, notOz, lbOz, coffee, trueCost, readScale });

/* ======================================================================================
 * The staircase figure on the page (Section 2), drawn once (no animation)
 * ====================================================================================== */
(function stairFig() {
  const host = document.getElementById('u4l4-stair'); if (!host) return;
  const units = [['kg', 'kilogram'], ['hg', 'hectogram'], ['dag', 'decagram'], ['g', 'gram'], ['dg', 'decigram'], ['cg', 'centigram'], ['mg', 'milligram']];
  const sw = 100, sh = 40, sv = svgEl('svg', { viewBox: `0 0 ${7 * sw + 230} ${7 * sh + 20}`, width: 7 * sw + 230, height: 7 * sh + 20, class: 'u4l4-figsv' }); host.appendChild(sv);
  units.forEach(([s, n], i) => {
    const main = s === 'kg' || s === 'g' || s === 'mg', x = i * sw, y = i * sh + 6;
    svgEl('rect', { x, y, width: sw, height: sh, rx: 4, fill: main ? '#f1e4cf' : '#f6f3ec', stroke: '#b9ad97', 'stroke-width': 2 }, sv);
    const t = svgEl('text', { x: x + sw / 2, y: y + 26, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': main ? 800 : 600, fill: main ? '#4a3010' : '#9aa0ab' }, sv); t.textContent = s; const t2 = svgEl('text', { x: x + sw + 8, y: y + 26, 'font-size': 15, fill: main ? '#4a3010' : '#9aa0ab' }, sv); t2.textContent = n;
  });
  const mkT = (x, y, s, col) => { const t = svgEl('text', { x, y, 'font-size': 18, 'font-weight': 800, fill: col }, sv); t.textContent = s; };
  svgEl('path', { d: `M${sw * 0.4} ${sh * 1.7} Q${sw * 0.6} ${sh * 4.8} ${sw * 2.6} ${sh * 5.3}`, stroke: '#c93a33', 'stroke-width': 3, fill: 'none' }, sv);
  mkT(10, sh * 6.6, 'down to a smaller unit: × 10 each step', '#c93a33');
  svgEl('path', { d: `M${sw * 5.6} ${sh * 3.6} Q${sw * 4.6} ${sh * 0.6} ${sw * 2.2} ${sh * 0.5}`, stroke: '#1f5bd6', 'stroke-width': 3, fill: 'none' }, sv);
  mkT(sw * 4.2, sh * 2.3, 'up to a bigger unit: ÷ 10 each step', '#1f5bd6');
})();

/* ======================================================================================
 * Math History: Le Grand K
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u4l4-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 34, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 22, fill: '#4a2c14' });
  // scene 1: the cylinder under three bell jars
  const s1 = mk('g', {});
  mk('rect', { x: 200, y: 236, width: 200, height: 16, rx: 4, fill: '#7a4a26' }, s1);
  const cyl = mk('g', {}, s1);
  mk('rect', { x: 278, y: 190, width: 44, height: 46, rx: 4, fill: '#b9bec6', stroke: '#5d6675', 'stroke-width': 2 }, cyl);
  mk('ellipse', { cx: 300, cy: 190, rx: 22, ry: 6, fill: '#d7dbe0', stroke: '#5d6675', 'stroke-width': 2 }, cyl);
  const jars = [[46, 72], [64, 98], [82, 124]].map(([rx, hh], i) => mk('path', { d: `M${300 - rx} 236 V${236 - hh + 20} Q${300 - rx} ${236 - hh} 300 ${236 - hh} Q${300 + rx} ${236 - hh} ${300 + rx} ${236 - hh + 20} V236`, fill: 'rgba(170,210,235,.12)', stroke: '#6a9ec0', 'stroke-width': 2.5, opacity: 0, 'data-i': i }, s1));
  const lab = mk('text', { x: 300, y: 276, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 18, fill: '#7a4a26' }, s1); lab.textContent = 'Le Grand K: 1 kg';
  // scene 2: a balance with a copy that is a tiny bit off
  const s2 = mk('g', { opacity: 0 });
  mk('rect', { x: 290, y: 120, width: 20, height: 130, fill: '#7a4a26' }, s2); mk('rect', { x: 240, y: 246, width: 120, height: 12, rx: 4, fill: '#4a2c14' }, s2);
  const beam = mk('g', {}, s2);
  mk('rect', { x: 140, y: 112, width: 320, height: 10, rx: 5, fill: '#4a2c14' }, beam);
  [[150, 'K'], [450, 'copy']].forEach(([x, s]) => { mk('rect', { x: x - 20, y: 76, width: 40, height: 36, rx: 3, fill: '#b9bec6', stroke: '#5d6675', 'stroke-width': 2 }, beam); const t = mk('text', { x, y: 70, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 16, fill: '#4a2c14' }, beam); t.textContent = s; });
  const salt = mk('text', { x: 300, y: 282, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#7a4a26' }, s2); salt.textContent = 'about 50 micrograms apart: a grain of salt';
  // scene 3: 2019
  const s3 = mk('g', { opacity: 0 });
  const y19 = mk('text', { x: 300, y: 150, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 52, fill: '#b07a12' }, s3); y19.textContent = 'May 20, 2019';
  const n19 = mk('text', { x: 300, y: 200, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#4a2c14' }, s3); n19.textContent = 'The kilogram now comes from a number in physics';
  const CAPS = [[0, '1889: one cylinder is the kilogram'], [4.4, 'Copies drift, just a tiny bit'], [8.4, 'A new kilogram that cannot drift']];
  const clamp = (t) => Math.max(0, Math.min(1, t));
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, txt] of CAPS) if (s >= t0) c = txt; cap.textContent = c;
    jars.forEach((j, i) => j.setAttribute('opacity', clamp((s - 0.8 - i * 0.8) / 0.6)));
    s1.setAttribute('opacity', 1 - clamp((s - 4) / 0.5));
    s2.setAttribute('opacity', clamp((s - 4.3) / 0.5) * (1 - clamp((s - 8) / 0.5)));
    beam.setAttribute('transform', `rotate(${-2 * Math.sin(clamp((s - 5) / 2.5) * Math.PI * 1.5)} 300 117)`);
    s3.setAttribute('opacity', clamp((s - 8.4) / 0.6));
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 11.5) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(2.6);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ============ Stand Up Break! — SI conversions, ounces ↔ pounds and ounces, pounds-and-ounces arithmetic ============ */
{
  const fix = (v) => String(parseFloat(v.toFixed(6)));
  standup('u4l4', {
    intro: 'Bigger unit to smaller: multiply. Smaller to bigger: divide. Trade 16 oz for 1 lb.',
    levels: {
      BEG: (r) => { // SI conversions (× or ÷ 1000)
        const P = [['kg', 'g', 1], ['g', 'kg', -1], ['t', 'kg', 1], ['kg', 't', -1], ['g', 'mg', 1], ['mg', 'g', -1]], [a, b, dir] = r.pick(P);
        const v = dir > 0 ? r.pick([0.4, 0.75, 1.2, 2.05, 3.6, 0.08, 4.25]) : r.pick([350, 1250, 45, 800, 2600, 75, 5040]);
        const w = dir > 0 ? v * 1000 : v / 1000;
        return { text: 'Convert. Do you multiply or divide?', q: `${fix(v)}\\text{ ${a}}=\\ ?\\text{ ${b}}`, a: [`${fix(v)}${dir > 0 ? '\\times' : '\\div'}1000=${fix(w)}`, `${fix(w)}\\text{ ${b}}`] };
      },
      PRG: (r) => r.pick([
        () => { let n; do { n = r.int(20, 120); } while (n % 16 === 0); const lb = Math.floor(n / 16), oz = n % 16;
          return { text: 'Write the mass in pounds and ounces.', q: `${n}\\text{ oz}`, a: [`${n}\\div16=${fix(n / 16)}\\to${lb}\\text{ lb}`, `${n}-${lb}\\times16=${oz}\\text{ oz}`, `${lb}\\text{ lb }${oz}\\text{ oz}`] }; },
        () => { const lb = r.int(2, 9), oz = r.int(1, 15);
          return { text: 'Change to ounces.', q: `${lb}\\text{ lb }${oz}\\text{ oz}`, a: [`${lb}\\times16+${oz}`, `=${lb * 16}+${oz}=${lb * 16 + oz}\\text{ oz}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { let a, b, c, d; do { a = r.int(2, 8); b = r.int(6, 15); c = r.int(1, 6); d = r.int(6, 15); } while (b + d < 16);
          const s = b + d; return { text: 'Add. Write the answer in pounds and ounces.', q: `${a}\\text{ lb }${b}\\text{ oz}+${c}\\text{ lb }${d}\\text{ oz}`,
            a: [`${a + c}\\text{ lb }${s}\\text{ oz}`, `${s}\\text{ oz}=1\\text{ lb }${s - 16}\\text{ oz}`, `${a + c + 1}\\text{ lb }${s - 16}\\text{ oz}`] }; },
        () => { let a, b, c, d; do { a = r.int(6, 14); b = r.int(1, 9); c = r.int(1, a - 2); d = r.int(b + 1, 15); } while (d <= b);
          return { text: 'Subtract. Write the answer in pounds and ounces.', q: `${a}\\text{ lb }${b}\\text{ oz}-${c}\\text{ lb }${d}\\text{ oz}`,
            a: [`\\text{Borrow: }${a}\\text{ lb }${b}\\text{ oz}=${a - 1}\\text{ lb }${b + 16}\\text{ oz}`, `${a - 1 - c}\\text{ lb }${b + 16 - d}\\text{ oz}`] }; }
      ])()
    }
  });
}
