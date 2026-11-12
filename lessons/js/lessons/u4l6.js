/* Math 10-3 · Unit 4 · Lesson 6 — From Volume to Mass: Bushels, Tonnes and Conversion Factors.
 * Explainers: the factor machine (volume in, mass out; Example 1), Ravi's gravel and the dump truck (Example 2), what a
 * bushel is (8 gallons in a box; 27.5 bushels in a cubic metre), a tonne of each crop stacked in bushels (Example 3),
 * bushels ↔ tonnes with a unit factor (Example 4), counting groups of 44.1 (Full notes), the truck scale (Example 5),
 * prices shared over the bushels in a tonne (Examples 6 and 7) and the grain bin / truck box filling (Examples 8 and 9).
 * Then the Stand Up Break. Bushels are Canadian (imperial) bushels. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const fx = (v, d = 2) => rnd(v, d).toFixed(d);
const sp = (s) => (String(s).length > 4 ? String(s).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : String(s)); // 17 100 with a thin space (text)
const cbox = (cls, html) => h('div', cls + ' u4l6-c', `<div>${html}</div>`);
const lcd = (stage, e, r, x, y, w = 270) => hide(add(stage, box(h('div', 'u4l6-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`), w, 66), x, y));
const mkSvg = (stage, w, hh, x, y) => add(stage, svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u4l6-svg' }), x, y);
const txt = (svg, x, y, s, a = {}) => { const e = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#1c2230' }, a), svg); e.textContent = s; return e; };
const ok = (host, s, x, y, o = {}) => hide(stamp(host, s, Object.assign({ x, y, size: 'sm' }, o)));
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(cbox('u4l6-eline ' + cls, html), w, 46), x, y));
const show = (c, el) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 350);   // opacity only (safe for SVG with a transform)
const CROP = { wheat: { n: 'wheat', f: 36.7, col: '#d9a441' }, canola: { n: 'canola', f: 44.1, col: '#3d6b2a' }, barley: { n: 'barley', f: 45.9, col: '#c9b26b' }, oats: { n: 'oats', f: 64.8, col: '#e8dcae' } };

/* a little grain truck (side view), drawn into an svg group; box from x 0 to bw, standing on y = 0 */
function truck(svg, bw, fill = '#d9a441') {
  const g = svgEl('g', {}, svg);
  svgEl('rect', { x: 0, y: -84, width: bw, height: 64, rx: 6, fill: '#eef0f3', stroke: '#3a4254', 'stroke-width': 3 }, g);
  const load = svgEl('rect', { x: 3, y: -81, width: 0, height: 58, rx: 4, fill }, g);
  svgEl('path', { d: `M${bw + 6} -20 V-70 Q${bw + 8} -84 ${bw + 22} -84 H${bw + 52} L${bw + 76} -54 V-20 Z`, fill: '#c0392b', stroke: '#6e1f16', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  svgEl('path', { d: `M${bw + 26} -78 H${bw + 50} L${bw + 66} -56 H${bw + 26} Z`, fill: '#bfe6ff', stroke: '#6e1f16', 'stroke-width': 2 }, g);
  svgEl('rect', { x: -4, y: -22, width: bw + 82, height: 8, rx: 3, fill: '#3a4254' }, g);
  [24, bw - 30, bw + 48].forEach((x) => { svgEl('circle', { cx: x, cy: -8, r: 13, fill: '#1c2230' }, g); svgEl('circle', { cx: x, cy: -8, r: 5, fill: '#9aa0ab' }, g); });
  g.load = load; g.bw = bw;
  return g;
}

/* =====================================================================================
 * 1. The factor machine: volume in, mass out
 * ===================================================================================== */
const MAT = {
  a: { name: 'Water in a jug', what: 'water', vol: '4', vu: 'L', f: '1', fu: 'kg per L', m: '4', mu: 'kg', w: '4\\times1=4', col: '#9fd3ff', note: 'Water: <b>1 L ≈ 1 kg</b>. The easy one!' },
  b: { name: 'Milk', what: 'milk', vol: '4', vu: 'L', f: '1.03', fu: 'kg per L', m: '4.12', mu: 'kg', w: '4\\times1.03=4.12', col: '#ffffff', note: 'Milk is a <b>little heavier</b> than water: 4.12 kg, not 4 kg.' },
  c: { name: 'Gasoline in a full tank', what: 'gasoline', vol: '60', vu: 'L', f: '0.74', fu: 'kg per L', m: '44.4', mu: 'kg', w: '60\\times0.74=44.4', col: '#f4d06a', note: 'Gasoline is <b>lighter</b> than water (that is why it floats on water).' },
  d: { name: 'Honey in a pail', what: 'honey', vol: '2.5', vu: 'L', f: '1.42', fu: 'kg per L', m: '3.55', mu: 'kg', w: '2.5\\times1.42=3.55', col: '#e0a21a', note: 'Honey is <b>heavy</b>: each litre is 1.42 kg.' },
  e: { name: 'Water in a bottle', what: 'water', vol: '355', vu: 'mL', f: '1', fu: 'g per mL', m: '355', mu: 'g', w: '355\\times1=355', col: '#9fd3ff', note: 'The units match: <b>mL</b> with a factor in <b>g per mL</b> gives <b>g</b>.' }
};
function tank(svg, x, y, w, hh, col, frac = 1) {
  const g = svgEl('g', {}, svg);
  svgEl('rect', { x, y, width: w, height: hh, rx: 16, fill: '#fff', stroke: '#3a4254', 'stroke-width': 4 }, g);
  svgEl('rect', { x: x + 5, y: y + hh * (1 - frac) + 5, width: w - 10, height: hh * frac - 10, rx: 12, fill: col, stroke: col === '#ffffff' ? '#c9ccd1' : 'none' }, g);
  svgEl('rect', { x: x + w / 2 - 18, y: y - 14, width: 36, height: 16, rx: 4, fill: '#3a4254' }, g);
  return g;
}
function scale(stage, x, y, w = 200) {
  const S = mkSvg(stage, w, 40, x, y + 70);
  svgEl('rect', { x: 4, y: 4, width: w - 8, height: 30, rx: 8, fill: '#e8e3d8', stroke: '#6b665c', 'stroke-width': 3 }, S);
  const d = add(stage, box(h('div', 'u4l6-disp', '0'), w - 60, 46), x + 30, y + 112);
  return d;
}
const factorMachine = {
  title: 'The factor machine: volume in, mass out',
  height: 390, minW: 900,
  choices: [{ v: 'same', label: 'Same bucket?' }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { v: 'e', label: '(e)' }, { v: 'f', label: '(f) gas or water?' }],
  ask: (k) => (k === 'same' ? 'Three identical <b>10 L</b> buckets: one of water, one of dry sand, one of popcorn. Do they have the same mass?'
    : k === 'f' ? 'Example 1(f): a 60 L tank of gasoline weighs less than 60 L of water. How do you know from the factors?'
      : `Example 1(${k}): find the mass of <b>${MAT[k].vol} ${MAT[k].vu}</b> of ${MAT[k].what} (factor <b>${MAT[k].f} ${MAT[k].fu}</b>).`),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'same' || k === 'f') {
      const items = k === 'same'
        ? [['water', '#9fd3ff', '1 kg per L', 10, '10 kg'], ['dry sand', '#d9b77a', 'about 1.6 kg per L', 16, '16 kg'], ['popcorn', '#fff3c4', 'about 0.03 kg per L', 0.3, '0.3 kg']]
        : [['gasoline', '#f4d06a', '0.74 kg per L', 44.4, '44.4 kg'], ['water', '#9fd3ff', '1 kg per L', 60, '60 kg']];
      const n = items.length, cw = (W - 40) / n, S = mkSvg(stage, W, 200, 0, 0), disps = [], facts = [];
      items.forEach(([name, col, fac], i) => {
        const cx = 20 + cw * i + cw / 2;
        tank(S, cx - 60, 60, 120, 110, col, 0.9);
        txt(S, cx, 40, `${k === 'same' ? '10' : '60'} L of ${name}`, { 'font-size': 20, 'font-weight': 800 });
        facts.push(hide(add(stage, box(h('div', 'u4l6-fac', fac), 220, 28), cx - 110, 268)));
        disps.push(hide(scale(stage, cx - 100, 100)));
      });
      const concl = hide(add(stage, box(cbox('u4l6-fact', k === 'same' ? 'The <b>same volume</b> can have a very different <b>mass</b>. To change volume to mass, you need to know <b>what the stuff is</b>: its conversion factor.' : 'Each litre of gasoline (0.74 kg) is lighter than a litre of water (1 kg), so 60 L of gasoline (<b>44.4 kg</b>) is lighter than 60 L of water (<b>60 kg</b>).'), W - 60, 80), 30, 306));
      const vals = items.map((it) => it[3]);
      return [
        { cap: k === 'same' ? 'Three buckets with the <b>same volume</b>: 10 L each.' : 'Two tanks with the same volume: <b>60 L</b> each.', run: async (c) => { for (const f of facts) await c.fadeIn(f, 250); } },
        { cap: k === 'same' ? 'Weigh them: about <b>10 kg</b>, <b>16 kg</b> and <b>0.3 kg</b>!' : `Weigh them: gasoline ${T('60\\times0.74=44.4')} kg, water ${T('60\\times1=60')} kg.`,
          run: async (c) => { disps.forEach((d) => { d.style.opacity = 1; }); await tween(c, 1200, (t) => disps.forEach((d, i) => { d.textContent = (vals[i] < 1 ? (vals[i] * t).toFixed(1) : (vals[i] * t).toFixed(vals[i] % 1 ? 1 : 0)) + ' kg'; })); } },
        { cap: k === 'same' ? 'Same volume, very different mass. You need to know <b>what the stuff is</b>.' : 'Gasoline is <b>lighter</b>: its factor (0.74 kg per L) is less than water’s (1 kg per L).', run: (c) => c.fadeIn(concl) }
      ];
    }
    const d = MAT[k], S = mkSvg(stage, W, 300, 0, 0);
    const cont = tank(S, 40, 70, 150, 160, d.col, 0.85); hide(cont);
    txt(S, 115, 40, d.name, { 'font-size': 19, 'font-weight': 800 });
    const volT = hide(txt(S, 115, 262, `${d.vol} ${d.vu}`, { 'font-size': 26, 'font-weight': 900, fill: '#1f5bd6' }));
    // the machine
    const MX = 300, MW = Math.min(330, W - 640);
    const mach = svgEl('g', {}, S); hide(mach);
    svgEl('rect', { x: MX, y: 80, width: MW, height: 140, rx: 18, fill: '#6e4a1c', stroke: '#4a3010', 'stroke-width': 4 }, mach);
    svgEl('rect', { x: MX + 14, y: 94, width: MW - 28, height: 46, rx: 10, fill: '#fff6e5' }, mach);
    txt(mach, MX + MW / 2, 126, `× ${d.f} ${d.fu}`, { 'font-size': 22, 'font-weight': 900, fill: '#6e4a1c' });
    const gear = svgEl('g', {}, mach);
    const gx = MX + MW / 2, gy = 184;
    for (let i = 0; i < 8; i++) svgEl('rect', { x: gx - 6, y: gy - 30, width: 12, height: 14, rx: 2, fill: '#e0a21a', transform: `rotate(${i * 45} ${gx} ${gy})` }, gear);
    svgEl('circle', { cx: gx, cy: gy, r: 20, fill: '#e0a21a', stroke: '#8a5a0a', 'stroke-width': 3 }, gear);
    svgEl('circle', { cx: gx, cy: gy, r: 7, fill: '#6e4a1c' }, gear);
    svgEl('path', { d: `M210 150 H${MX - 8} M${MX + MW + 8} 150 H${MX + MW + 60}`, stroke: '#9aa0ab', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, S);
    const token = hide(add(stage, box(h('div', 'u4l6-token', `${d.vol} ${d.vu}`), 100, 40), 200, 130));
    const SX = MX + MW + 100, SW = Math.min(220, W - SX - 20), disp = scale(stage, SX, 90, SW);
    const out = hide(add(stage, box(h('div', 'u4l6-token out', `${d.m} ${d.mu}`), 110, 40), SX + SW / 2 - 55, 120));
    const work = line(stage, `mass = volume × factor: ${T(d.w)} ${d.mu}`, 30, 300, 560, 'big');
    const note = hide(add(stage, box(cbox('u4l6-fact', d.note), W - 640, 70), 610, 290));
    disp.textContent = '0 ' + d.mu;
    return [
      { cap: `Start with the volume: <b>${d.vol} ${d.vu}</b> of ${d.what}.`, run: async (c) => { await show(c, cont); await show(c, volT); } },
      { cap: `The factor for ${d.what}: <b>${d.f} ${d.fu}</b>. Each ${d.vu === 'L' ? 'litre' : 'millilitre'} has a mass of ${d.f} ${d.mu}.`, run: (c) => show(c, mach) },
      { cap: `mass = volume × factor: ${T(d.w)} ${d.mu}.`,
        run: async (c) => {
          await c.fadeIn(token);
          await Promise.all([c.anim(token, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${MX + MW / 2 - 250}px)`, opacity: 0 }], 700), tween(c, 1400, (t) => gear.setAttribute('transform', `rotate(${t * 360} ${gx} ${gy})`))]);
          await c.anim(out, [{ opacity: 0, transform: `translate(${MX + MW - SX - SW / 2 + 40}px, 10px)` }, { opacity: 1, transform: 'none' }], 600);
          await tween(c, 800, (t) => { disp.textContent = (Number(d.m) * t).toFixed((d.m.split('.')[1] || '').length) + ' ' + d.mu; });
          await c.fadeIn(work);
        } },
      { cap: d.note, run: (c) => c.fadeIn(note) }
    ];
  }
};

/* =====================================================================================
 * 1b. Ravi's gravel and the dump truck
 * ===================================================================================== */
const gravel = {
  title: 'Ravi’s gravel: mass, one load, and the number of loads',
  height: 420, minW: 900,
  ask: 'Example 2: gravel is about <b>1.7 t per m³</b>. Ravi needs <b>8 m³</b>. The dump truck can carry at most <b>6 t</b>.',
  make(stage, k, ex) {
    const W = ex.W, cubes = [], ct = [];
    for (let i = 0; i < 8; i++) {
      cubes.push(hide(add(stage, box(h('div', 'u4l6-cube', '1 m³'), 62, 54), 30 + i * 72, 14)));
      ct.push(hide(add(stage, box(h('div', 'u4l6-cnt', '1.7 t'), 62, 22), 30 + i * 72, 70)));
    }
    const RX = 640, RW = W - RX - 16;
    const La = line(stage, `(a) ${T('8\\times1.7=13.6')} t`, RX, 20, RW);
    // the truck: 6 t of box
    const px = 58, S = mkSvg(stage, 640, 150, 20, 104), tr = truck(S, 6 * px, '#9aa0ab'); tr.setAttribute('transform', 'translate(30 138)');
    const capT = txt(S, 30 + 3 * px, 46, 'at most 6 t', { 'font-size': 16, fill: '#4a4436' });
    void capT;
    const bits = [];
    for (let i = 0; i < 4; i++) bits.push(hide(add(stage, box(h('div', 'u4l6-cube in', i < 3 ? '1 m³' : '½'), (i < 3 ? 1.7 : 0.85) * px - 4, 54), 20 + 33 + i * 1.7 * px, 104 + 57)));
    const ghost = hide(add(stage, box(h('div', 'u4l6-cube bad', '0.6'), 0.6 * 1.7 * px - 4, 54), 20 + 33 + 3 * 1.7 * px, 104 + 57));
    const Lb = line(stage, `(b) ${T('6\\div1.7=3.529\\ldots')} → <b>3.5 m³</b>`, RX, 130, RW);
    const Lb2 = line(stage, `3.6 m³: ${T('3.6\\times1.7=6.12')} t ✗`, RX, 182, RW, 'warn');
    // loads bar
    const s = 44, BY = 312, segs = [[0, 6, 'Load 1'], [6, 6, 'Load 2'], [12, 1.6, 'Load 3']];
    const segEls = segs.map(([a, m, lab], i) => hide(add(stage, box(h('div', 'u4l6-load' + (i === 2 ? ' last' : ''), `<b>${lab}</b><span>${m} t</span>`), m * s - 4, 58), 30 + a * s, BY)));
    const tot = hide(add(stage, box(h('div', 'u4l6-cnt big', '13.6 t of gravel'), 13.6 * s, 22), 30, BY - 26));
    const Lc = line(stage, `(c) ${T('13.6\\div6=2.27\\ldots')} → <b>3 loads</b>`, RX, 316, RW);
    return [
      { cap: 'Ravi needs <b>8 m³</b> of gravel: 8 cubes, each 1 m on a side.', run: async (c) => { for (const e of cubes) await c.pop(e, 150); } },
      { cap: `(a) Each cubic metre has a mass of 1.7 t. mass = volume × factor: ${T('8\\times1.7=13.6')} t.`, run: async (c) => { for (const e of ct) await c.fadeIn(e, 90); await c.fadeIn(La); } },
      { cap: '(b) The truck can carry at most <b>6 t</b>. Load it one cubic metre at a time.', run: async (c) => { for (const b of bits.slice(0, 3)) await c.pop(b, 300); } },
      { cap: `volume = mass ÷ factor: ${T('6\\div1.7=3.529\\ldots')}. Round <b>down</b> to the tenth: <b>3.5 m³</b> (5.95 t).`, run: async (c) => { await c.pop(bits[3]); await c.fadeIn(Lb); } },
      { cap: `Why down? 3.6 m³ would be ${T('3.6\\times1.7=6.12')} t: over the limit.`, run: async (c) => { await c.fadeIn(ghost); await c.shake(ghost); await c.fadeIn(Lb2); } },
      { cap: `(c) 13.6 t, at most 6 t a load: ${T('13.6\\div6=2.27\\ldots')}. Two loads carry only 12 t.`, run: async (c) => { await c.fadeIn(tot); await c.fadeIn(segEls[0]); await c.fadeIn(segEls[1]); } },
      { cap: 'Round <b>up</b>: the last 1.6 t needs a 3rd load. Ravi needs <b>3 loads</b>.', run: async (c) => { await c.pop(segEls[2]); await c.fadeIn(Lc); } }
    ];
  }
};

/* =====================================================================================
 * 2. What is a bushel? 8 gallons in a box; 27.5 bushels in a cubic metre
 * ===================================================================================== */
const bushelBox = {
  title: 'What is a bushel?',
  height: 380, minW: 900,
  choices: [{ v: 'gal', label: '8 gallons' }, { v: 'm3', label: 'Bushels in 1 m³' }],
  ask: (k) => (k === 'gal' ? 'A bushel is <b>8 imperial gallons</b> of grain. How big is that?' : 'How many bushels fit in <b>1 m³</b>?'),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'gal') {
      const S = mkSvg(stage, W, 380, 0, 0), jugs = [];
      for (let i = 0; i < 8; i++) {
        const g = svgEl('g', {}, S), x = 30 + i * 62;
        svgEl('path', { d: `M${x} 120 V60 Q${x} 48 ${x + 12} 46 H${x + 26} V34 H${x + 40} V46 Q${x + 52} 48 ${x + 52} 60 V120 Z`, fill: '#f2d27a', stroke: '#8a5a0a', 'stroke-width': 3 }, g);
        txt(g, x + 26, 98, '1 gal', { 'font-size': 13, fill: '#6e4a1c', 'font-weight': 800 });
        hide(g); jugs.push(g);
      }
      const jl = hide(txt(S, 270, 150, '1 imperial gallon ≈ 4.55 L', { 'font-size': 18, fill: '#6e4a1c' }));
      // the box (front + top + side), filling
      const BX = W - 360, BY = 120, B = 200, D = 70;
      svgEl('path', { d: `M${BX} ${BY} L${BX + D} ${BY - D * 0.6} H${BX + B + D} L${BX + B} ${BY} Z`, fill: '#fbeed0', stroke: '#8a5a0a', 'stroke-width': 3 }, S);
      svgEl('path', { d: `M${BX + B} ${BY} L${BX + B + D} ${BY - D * 0.6} V${BY + B - D * 0.6} L${BX + B} ${BY + B} Z`, fill: '#f0d9a6', stroke: '#8a5a0a', 'stroke-width': 3 }, S);
      svgEl('rect', { x: BX, y: BY, width: B, height: B, fill: '#fffaf0', stroke: '#8a5a0a', 'stroke-width': 3 }, S);
      const fill = svgEl('rect', { x: BX + 3, y: BY + B - 3, width: B - 6, height: 0, fill: '#e3b04b' }, S);
      const lab = hide(txt(S, BX + B / 2, BY + B / 2 + 8, '1 bushel', { 'font-size': 26, 'font-weight': 900, fill: '#4a3010' }));
      const d1 = hide(txt(S, BX + B / 2, BY + B + 28, 'about 33 cm', { 'font-size': 18 })), d2 = hide(txt(S, BX + B + D + 14, BY + B / 2, '33 cm', { 'font-size': 18, 'text-anchor': 'start' }));
      const w1 = line(stage, `${T('8\\times4.55\\approx36.4')} L = <b>1 bushel</b>`, 30, 180, 470, 'big');
      const fact = hide(add(stage, box(cbox('u4l6-fact', '<b>1 bushel</b> ≈ 36.4 L ≈ 1.28 ft³ ≈ 2220 in³'), 520, 56), 30, 250));
      return [
        { cap: 'One imperial (British) gallon is about 4.55 L. Here are <b>8 gallons</b> of grain.', run: async (c) => { for (const j of jugs) await show(c, j); await show(c, jl); } },
        { cap: `Pour them all into a box: ${T('8\\times4.55\\approx36.4')} L. That is <b>1 bushel</b>.`, run: async (c) => { await Promise.all(jugs.map((j) => c.anim(j, [{ opacity: 1 }, { opacity: 0.2 }], 600))); await tween(c, 1200, (t) => { fill.setAttribute('height', (B - 6) * t); fill.setAttribute('y', BY + B - 3 - (B - 6) * t); }); await show(c, lab); await c.fadeIn(w1); } },
        { cap: 'The box is about <b>33 cm</b> on each side.', run: async (c) => { await show(c, d1); await show(c, d2); } },
        { cap: 'In other units: 1 bushel ≈ 36.4 L ≈ <b>1.28 ft³</b> ≈ 2220 in³.', run: (c) => c.fadeIn(fact) }
      ];
    }
    const S = mkSvg(stage, W, 380, 0, 0), CX = 60, CY = 70, C = 270, D = 90;
    svgEl('path', { d: `M${CX} ${CY} L${CX + D} ${CY - D * 0.55} H${CX + C + D} L${CX + C} ${CY} Z`, fill: '#eef4fb', stroke: '#1f5bd6', 'stroke-width': 3 }, S);
    svgEl('path', { d: `M${CX + C} ${CY} L${CX + C + D} ${CY - D * 0.55} V${CY + C - D * 0.55} L${CX + C} ${CY + C} Z`, fill: '#dde8f6', stroke: '#1f5bd6', 'stroke-width': 3 }, S);
    svgEl('rect', { x: CX, y: CY, width: C, height: C, fill: '#fff', stroke: '#1f5bd6', 'stroke-width': 3 }, S);
    txt(S, CX + C / 2, CY + C + 26, '1 m = 100 cm', { 'font-size': 18, fill: '#1f5bd6', 'font-weight': 800 });
    const bx = [];
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const e = svgEl('rect', { x: CX + 4 + q * 89, y: CY + C - 4 - (r + 1) * 89, width: 85, height: 85, rx: 6, fill: '#e3b04b', stroke: '#8a5a0a', 'stroke-width': 2 }, S); hide(e); bx.push(e); }
    const t33 = hide(txt(S, CX + 4 + 44, CY + C - 4 - 40, '33 cm', { 'font-size': 15, fill: '#4a3010' }));
    const RX = 470, RW = W - RX - 20;
    const l1 = line(stage, `1 m³ = <b>1000 L</b>`, RX, 40, RW);
    const l2 = line(stage, `About <b>3</b> boxes along each edge (3 × 33 cm ≈ 1 m)`, RX, 100, RW);
    const l3 = line(stage, `${T('3\\times3=9')} a layer; 3 layers: ${T('27')} and a bit`, RX, 160, RW);
    const fact = hide(add(stage, box(cbox('u4l6-fact', `Exactly: ${T('1000\\div36.4\\approx27.5')}, so <b>1 m³ ≈ 27.5 bushels</b>`), RW, 70), RX, 240));
    return [
      { cap: 'A cubic metre is a cube 1 m (100 cm) on each side. It holds <b>1000 L</b>.', run: (c) => c.fadeIn(l1) },
      { cap: 'A bushel box is about 33 cm wide, so about <b>3 boxes</b> fit along each edge.', run: async (c) => { for (const e of bx) await show(c, e); await show(c, t33); await c.fadeIn(l2); } },
      { cap: `${T('3\\times3=9')} boxes in each layer, 3 layers deep: about <b>27</b> boxes, and a little room left over.`, run: (c) => c.fadeIn(l3) },
      { cap: `Exactly: ${T('1000\\div36.4\\approx27.5')}. So <b>1 m³ ≈ 27.5 bushels</b>.`, run: (c) => c.pop(fact) }
    ];
  }
};

/* =====================================================================================
 * 2b. A tonne of each crop, stacked in bushels
 * ===================================================================================== */
const KGBU = { wheat: 27.2, canola: 22.7, barley: 21.8, oats: 15.4 };
const LCDR = { wheat: '27.24795640', canola: '22.67573696', barley: '21.78649237', oats: '15.43209877' };
const tonneStack = {
  title: 'One tonne of grain, counted in bushels',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'wheat', label: 'Wheat' }, { v: 'canola', label: 'Canola' }, { v: 'barley', label: 'Barley' }, { v: 'oats', label: 'Oats' }, { v: 'trucks', label: '(c) two trucks' }],
  ask: (k) => (k === 'trucks' ? 'Example 3(c): two identical trucks are filled to the same level, one with wheat and one with oats. Which is heavier?' : `Example 3(a): find the mass of one bushel of <b>${k}</b> (${CROP[k].f} bu/t), to the nearest tenth of a kilogram.`),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'trucks') {
      const S = hide(mkSvg(stage, W, 300, 0, 0)), half = (W - 40) / 2, res = [];
      [['wheat', 36.7, 10.9, '#d9a441'], ['oats', 64.8, 6.17, '#e8dcae']].forEach(([n, f, t], i) => {
        const g = truck(S, 250, CROP[n].col); g.setAttribute('transform', `translate(${20 + i * half + 30} 200)`); g.load.setAttribute('width', 244);
        txt(S, 20 + i * half + 155, 34, `400 bushels of ${n}`, { 'font-size': 20, 'font-weight': 800 });
        svgEl('rect', { x: 20 + i * half + 10, y: 204, width: half - 40, height: 14, rx: 4, fill: '#9aa0ab' }, S);
        res.push(hide(add(stage, box(cbox('u4l6-eline big', `${T(`400\\div${f}\\approx${fx(t)}`)} t`), half - 40, 50), 20 + i * half + 10, 236)));
        void f;
      });
      const st = ok(stage, 'Heavier', 20 + 155, 80, { ok: true, size: 'lg' });
      const why = hide(add(stage, box(cbox('u4l6-fact', 'Same bushels, but a bushel of wheat (27.2 kg) is heavier than a bushel of oats (15.4 kg).'), W - 60, 56), 30, 310));
      return [
        { cap: 'Same truck, same level: the same <b>volume</b>. Say each holds <b>400 bushels</b>.', run: (c) => show(c, S) },
        { cap: `Wheat: ${T('400\\div36.7\\approx10.90')} t. Oats: ${T('400\\div64.8\\approx6.17')} t.`, run: async (c) => { await c.fadeIn(res[0]); await c.fadeIn(res[1]); } },
        { cap: 'The <b>wheat</b> truck is heavier: a bushel of wheat (27.2 kg) is heavier than a bushel of oats (15.4 kg).', run: async (c) => { await stampIn(c, st); await c.fadeIn(why); } }
      ];
    }
    const d = CROP[k], f = d.f, n = Math.floor(f), part = f - n, q = 34, gap = 4, cols = 10;
    add(stage, box(h('div', 'u4l6-totel', `1 tonne (1000 kg) of ${k}`), cols * (q + gap) + 16, 30), 22, 8);
    add(stage, box(h('div', 'u4l6-tote'), cols * (q + gap) + 16, 7 * (q + gap) + 16), 22, 40);
    const sq = [];
    for (let i = 0; i <= n; i++) {
      const e = hide(add(stage, box(h('div', 'u4l6-bu'), q, q), 30 + (i % cols) * (q + gap), 48 + Math.floor(i / cols) * (q + gap)));
      e.style.background = d.col;
      if (i === n) { e.style.width = part * q + 'px'; }
      sq.push(e);
    }
    const cnt = hide(add(stage, box(h('div', 'u4l6-cnt big', `${f} bushels`), 200, 24), 22 + (cols * (q + gap) + 16) / 2 - 100, 7 * (q + gap) + 62));
    const RX = 470, RW = W - RX - 20;
    const scr = lcd(stage, `1000÷${f}`, LCDR[k], RX, 40, 280);
    const w1 = line(stage, `1 bushel = ${T(`1000\\div${f}\\approx${KGBU[k]}`)} kg`, RX, 116, RW, 'big');
    const bars = Object.keys(KGBU).map((c, i) => {
      const e = hide(add(stage, box(h('div', 'u4l6-kgbar' + (c === k ? ' on' : ''), `<span class="u4l6-bn">${c}</span><span class="u4l6-bv">${KGBU[c]} kg</span>`), 90 + KGBU[c] * 9, 36), RX, 190 + i * 44));
      return e;
    });
    return [
      { cap: `It takes <b>${f} bushels</b> of ${k} to make 1 tonne (1000 kg).`, run: async (c) => { for (const e of sq) await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 40); await c.fadeIn(cnt); } },
      { cap: `Share the 1000 kg over the ${f} bushels: ${T(`1000\\div${f}=${LCDR[k].slice(0, 6)}\\ldots`)}`, run: async (c) => { await c.pop(scr); await c.fadeIn(w1); } },
      { cap: `One bushel of ${k} is about <b>${KGBU[k]} kg</b>. Compare: a bigger factor means a <b>lighter</b> bushel. Wheat is the heaviest, oats the lightest.`, run: async (c) => { for (const b of bars) await c.fadeIn(b, 200); } }
    ];
  }
};

/* =====================================================================================
 * 3. Bushels ↔ tonnes with a unit factor
 * ===================================================================================== */
const BT = {
  a: { crop: 'Wheat', amt: '12', have: 't', want: 'bu', top: '36.7', bot: '1', div: false, e: '12×36.7', r: '440.4', ans: '440 bu', round: 'Round to a whole bushel: 440.4 → <b>440 bu</b>', chk: 'Bushels are the <b>bigger</b> number: 440 is much more than 12 ✓', task: '12 t of wheat to bu' },
  b: { crop: 'Canola', amt: '850', have: 'bu', want: 't', top: '1', bot: '44.1', div: true, e: '850÷44.1', r: '19.27437642', ans: '19.27 t', round: 'Round to two decimals: 19.274… → <b>19.27 t</b>', chk: 'Tonnes are the <b>smaller</b> number: 19.27 is much less than 850 ✓', task: '850 bu of canola to t' },
  c: { crop: 'Barley', amt: '2000', have: 'bu', want: 't', top: '1', bot: '45.9', div: true, e: '2000÷45.9', r: '43.57298475', ans: '43.57 t', round: 'Round to two decimals: 43.572… → <b>43.57 t</b>', chk: 'Tonnes are the <b>smaller</b> number: 43.57 is much less than 2000 ✓', task: '2000 bu of barley to t' },
  d: { crop: 'Oats', amt: '6.5', have: 't', want: 'bu', top: '64.8', bot: '1', div: false, e: '6.5×64.8', r: '421.2', ans: '421 bu', round: 'Round to a whole bushel: 421.2 → <b>421 bu</b>', chk: 'Bushels are the <b>bigger</b> number: 421 is much more than 6.5 ✓', task: '6.5 t of oats to bu' }
};
const buTonne = {
  title: 'Bushels ↔ tonnes: cross out the unit you have',
  height: 380, minW: 900,
  choices: [{ sep: 'Example 4 check:' }, ...'abcd'.split('').map((v) => ({ v, label: `(${v}) ${BT[v].crop}` }))],
  ask: (k) => `Example 4(${k}): change <b>${BT[k].task}</b> (${BT[k].crop.toLowerCase()}: ${BT[k].have === 't' ? BT[k].top : BT[k].bot} bu/t).`,
  make(stage, k, ex) {
    const d = BT[k], W = ex.W;
    const U = (s, cls) => `<span class="u4l6-u ${cls}">${s}<i class="u4l6-x"></i></span>`;
    const row = add(stage, box(h('div', 'u4l6-uf'), W - 40, 140), 20, 14);
    const amt = hide(h('div', 'u4l6-ufa', `${sp(d.amt)} ${U(d.have, 'have a')}`));
    const times = hide(h('div', 'u4l6-ufo', '×'));
    const frac = hide(h('div', 'u4l6-uff', `<div class="t">${d.top} ${U(d.want, 'want')}</div><div class="b">${d.bot} ${U(d.have, 'have b')}</div>`));
    const eq = hide(h('div', 'u4l6-ufo', '='));
    const out = hide(h('div', 'u4l6-ufr', d.ans));
    row.append(amt, times, frac, eq, out);
    const tags = hide(add(stage, box(h('div', 'u4l6-tags', `<span class="w">want on top</span><span class="hv">have on the bottom</span>`), 230, 110), 0, 30));
    const work = line(stage, d.div ? `The factor is on the bottom, so <b>divide</b>: ${T(d.e.replace('÷', '\\div'))}` : `Multiply: ${T(d.e.replace('×', '\\times'))}`, 30, 182, 540, 'big');
    const screen = lcd(stage, d.e, d.r, W - 310, 176, 280);
    const rn = hide(add(stage, box(cbox('u4l6-rnote', d.round), 540, 46), 30, 252));
    const chk = hide(add(stage, box(cbox('u4l6-chk', `<b>Check:</b> ${d.chk}`), W - 60, 52), 30, 316));
    return [
      { cap: `Write the amount you have: <b>${sp(d.amt)} ${d.have === 't' ? 't' : 'bu'}</b> of ${d.crop.toLowerCase()}.`, run: (c) => c.pop(amt) },
      { cap: `Write the factor as a fraction with <b>${d.have}</b> on the <b>bottom</b>, so it cancels: ${d.div ? `${T(`\\dfrac{1\\text{ t}}{${d.bot}\\text{ bu}}`)}` : `${T(`\\dfrac{${d.top}\\text{ bu}}{1\\text{ t}}`)}`}.`,
        run: async (c) => {
          await c.fadeIn(times, 200); await c.pop(frac);
          const r = frac.getBoundingClientRect(), s = stage.getBoundingClientRect(), sc = (s.width / stage.offsetWidth) || 1;
          tags.style.left = ((r.right - s.left) / sc + 10) + 'px'; tags.style.top = ((r.top - s.top) / sc - 4) + 'px';
          await c.fadeIn(tags);
        } },
      { cap: `Cross out <b>${d.have}</b> (top and bottom). The unit left is <b>${d.want}</b>.`,
        run: async (c) => { await c.anim(tags, [{ opacity: 1 }, { opacity: 0 }], 250); for (const x of row.querySelectorAll('.have .u4l6-x')) await c.anim(x, [{ transform: 'rotate(-18deg) scaleX(0)' }, { transform: 'rotate(-18deg) scaleX(1)' }], 380); await pulse(c, row.querySelector('.want'), 1.25); } },
      { cap: d.div ? `Bushels → tonnes: <b>divide</b> by the factor. ${T(d.e.replace('÷', '\\div'))} shows ${d.r.slice(0, 7)}…` : `Tonnes → bushels: <b>multiply</b> by the factor. ${T(d.e.replace('×', '\\times'))} = ${d.r}.`,
        run: async (c) => { await c.fadeIn(work); await c.pop(screen); } },
      { cap: `${d.round}.`, run: async (c) => { await c.fadeIn(rn); await c.fadeIn(eq, 200); await c.pop(out); } },
      { cap: `<b>Check:</b> ${d.chk}`, run: (c) => c.fadeIn(chk) }
    ];
  }
};

/* =====================================================================================
 * 3b. Why divide? groups of 44.1 bushels (Full notes)
 * ===================================================================================== */
const groups = {
  title: '850 bushels of canola: how many groups of 44.1?',
  height: 360, minW: 900,
  ask: 'Every <b>44.1 bushels</b> of canola make <b>1 tonne</b>. How many tonnes are in <b>850 bushels</b>?',
  make(stage, k, ex) {
    const W = ex.W, X = 30, LEN = W - 60, s = LEN / 850, gw = 44.1 * s;
    const bar = hide(add(stage, box(h('div', 'u4l6-bigbar', '850 bushels'), LEN, 56), X, 30));
    const gs = [];
    for (let i = 0; i < 20; i++) {
      const w = i < 19 ? gw : (850 - 19 * 44.1) * s;
      gs.push(hide(add(stage, box(h('div', 'u4l6-grp' + (i % 2 ? ' alt' : '') + (i === 19 ? ' part' : ''), i < 19 ? String(i + 1) : ''), w - 2, 56), X + i * gw, 110)));
    }
    const lab = hide(add(stage, box(h('div', 'u4l6-cnt big', 'each block: 44.1 bushels = 1 tonne'), 420, 24), X, 172));
    const res = hide(add(stage, box(cbox('u4l6-res', `19 full tonnes and a bit: ${T('850\\div44.1\\approx19.27')} t`), 560, 52), X, 206));
    const bad = hide(add(stage, box(cbox('u4l6-eline warn', `Multiplying instead: ${T('850\\times44.1=37\\,485')} t. That is as heavy as about <b>25 000 cars</b>! ✗`), LEN, 50), X, 282));
    return [
      { cap: 'Here are <b>850 bushels</b> of canola.', run: (c) => c.fadeIn(bar) },
      { cap: 'Cut them into groups of <b>44.1 bushels</b>. Each group is <b>1 tonne</b>. Count the groups.', run: async (c) => { for (const g of gs) await c.fadeIn(g, 90); await c.fadeIn(lab); } },
      { cap: `19 full groups and a little more: ${T('850\\div44.1\\approx19.27')} t. Counting groups is <b>dividing</b>.`, run: (c) => c.pop(res) },
      { cap: `The wrong way: ${T('850\\times44.1=37\\,485')} t. Far too heavy! The tonnes must be the <b>smaller</b> number.`, run: (c) => c.fadeIn(bad) }
    ];
  }
};

/* =====================================================================================
 * 3c. On the truck scale (Example 5)
 * ===================================================================================== */
const truckScale = {
  title: 'On the truck scale',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) barley for the cattle' }, { v: 'b', label: '(b) Nadia’s wheat' }],
  ask: (k) => (k === 'a' ? 'Example 5(a): <b>150 bushels</b> of barley (45.9 bu/t). Find the mass in tonnes, kilograms and pounds.' : 'Example 5(b): Nadia’s truck may carry <b>14.5 t</b>. Can she haul <b>560 bushels</b> of wheat (36.7 bu/t)? What is the most she can haul?'),
  make(stage, k, ex) {
    const W = ex.W, S = mkSvg(stage, 480, 300, 10, 70);
    svgEl('rect', { x: 10, y: 236, width: 440, height: 18, rx: 4, fill: '#9aa0ab', stroke: '#3a4254', 'stroke-width': 3 }, S);
    svgEl('rect', { x: 0, y: 254, width: 460, height: 10, fill: '#cfd3d8' }, S);
    const tr = truck(S, 260, k === 'a' ? CROP.barley.col : CROP.wheat.col); tr.load.setAttribute('width', 254);
    const place = (x) => tr.setAttribute('transform', `translate(${x} 236)`);
    place(-420);
    const disp = add(stage, box(h('div', 'u4l6-disp big', '0.00 t'), 260, 56), 120, 14);
    const RX = 500, RW = W - RX - 20;
    if (k === 'a') {
      const l1 = line(stage, `Tonnes: ${T('150\\div45.9=3.2679\\ldots')} t`, RX, 40, RW);
      const l2 = line(stage, `Kilograms: ${T('3.2679\\times1000\\approx3268')} kg`, RX, 100, RW);
      const l3 = line(stage, `Pounds: ${T('3268\\times2.2=7189.6\\approx7190')} lb`, RX, 160, RW);
      const res = hide(add(stage, box(cbox('u4l6-res', 'About <b>3.27 t</b>, <b>3268 kg</b> or <b>7190 lb</b>'), RW, 56), RX, 240));
      return [
        { cap: '150 bushels of barley drive onto the scale.', run: async (c) => { await tween(c, 1200, (t) => place(-420 + 440 * t)); } },
        { cap: `Bushels → tonnes: <b>divide</b> by 45.9. ${T('150\\div45.9=3.2679\\ldots')} t.`, run: async (c) => { await c.fadeIn(l1); await tween(c, 700, (t) => { disp.textContent = (3.2679 * t).toFixed(2) + ' t'; }); } },
        { cap: `Tonnes → kilograms: × 1000. ${T('3.2679\\ldots\\times1000\\approx3268')} kg.`, run: async (c) => { await c.fadeIn(l2); disp.textContent = '3268 kg'; await pulse(c, disp); } },
        { cap: `Kilograms → pounds: × 2.2. ${T('3268\\times2.2=7189.6\\approx7190')} lb.`, run: async (c) => { await c.fadeIn(l3); disp.textContent = '7190 lb'; await pulse(c, disp); await c.pop(res); } }
      ];
    }
    const lim = add(stage, box(h('div', 'u4l6-limit', 'Legal limit<b>14.5 t</b>'), 110, 64), 400, 10);
    void lim;
    const l1 = line(stage, `${T('560\\div36.7\\approx15.26')} t`, RX, 100, RW);
    const l2 = line(stage, `Most wheat: ${T('14.5\\times36.7=532.15')} bu`, RX, 160, RW);
    const l3 = line(stage, `Round <b>down</b>: <b>532 bu</b> (${T('532\\div36.7\\approx14.495')} t)`, RX, 220, RW);
    const no = ok(stage, 'Over!', 250, 140, { ok: false, size: 'lg' }), yes = ok(stage, 'Legal ✓', 250, 140, { ok: true, size: 'lg' });
    return [
      { cap: 'Nadia’s truck drives onto the scale with <b>560 bushels</b> of wheat.', run: async (c) => { await tween(c, 1200, (t) => place(-420 + 440 * t)); } },
      { cap: `Bushels → tonnes: ${T('560\\div36.7\\approx15.26')} t. That is <b>more</b> than 14.5 t: not legal.`, run: async (c) => { await c.fadeIn(l1); await tween(c, 800, (t) => { disp.textContent = (15.26 * t).toFixed(2) + ' t'; }); disp.classList.add('bad'); await stampIn(c, no); } },
      { cap: `The most wheat: change the limit to bushels. ${T('14.5\\times36.7=532.15')} bu.`, run: (c) => c.fadeIn(l2) },
      { cap: `It must not go over, so round <b>down</b>: Nadia can haul <b>532 bushels</b>. (532 bu is about 14.495 t, just under 14.5 t.)`,
        run: async (c) => { await c.anim(no, [{ opacity: 1 }, { opacity: 0 }], 200); disp.classList.remove('bad'); await tween(c, 600, (t) => { disp.textContent = (15.26 - (15.26 - 14.495) * t).toFixed(3) + ' t'; }); tr.load.setAttribute('width', 254 * 532 / 560); await c.fadeIn(l3); await stampIn(c, yes); } }
    ];
  }
};

/* =====================================================================================
 * 4. Prices: a tonne is many bushels
 * ===================================================================================== */
const PR = {
  a: { crop: 'canola', f: 44.1, from: 't', p: 680, e: '680÷44.1', r: '15.41950113', ans: 15.42 },
  b: { crop: 'wheat', f: 36.7, from: 'bu', p: 7.80, e: '7.80×36.7', r: '286.26', ans: 286.26 },
  c: { crop: 'oats', f: 64.8, from: 'bu', p: 4.25, e: '4.25×64.8', r: '275.4', ans: 275.40 },
  d: { crop: 'barley', f: 45.9, from: 't', p: 255, e: '255÷45.9', r: '5.555555556', ans: 5.56 }
};
const priceBu = {
  title: 'Price per tonne, price per bushel',
  height: 390, minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { sep: 'Example 7:' }, { v: 'A', label: '(a) which buyer?' }, { v: 'B', label: '(b) 3000 bushels' }],
  ask: (k) => (k === 'A' ? 'Example 7(a): barley (45.9 bu/t). Buyer A offers <b>$5.70 per bushel</b>, Buyer B <b>$260.00 per tonne</b>. Which pays more?'
    : k === 'B' ? 'Example 7(b): Liam sells <b>3000 bushels</b> of barley. How much more does he get from the better buyer?'
      : `Example 6(${k}): ${PR[k].crop} (${PR[k].f} bu/t) at <b>$${fx(PR[k].p)} per ${PR[k].from === 't' ? 'tonne' : 'bushel'}</b>. Change it to dollars per ${PR[k].from === 't' ? 'bushel' : 'tonne'}.`),
  make(stage, k, ex) {
    const W = ex.W, X = 30, LEN = W - 60;
    if (k === 'B') {
      const A = 17100, B = 3000 / 45.9 * 260, s = (LEN - 240) / A;
      const ba = hide(add(stage, box(h('div', 'u4l6-money a', `<b>Buyer A</b>${T('3000\\times\\$5.70=\\$17\\,100.00')}`), A * s, 64), X, 40));
      const bb1 = line(stage, `Buyer B: ${T('3000\\div45.9=65.359\\ldots')} t`, X, 130, 520);
      const bb = hide(add(stage, box(h('div', 'u4l6-money b', `<b>Buyer B</b>${T('65.359\\ldots\\times\\$260\\approx\\$16\\,993.46')}`), B * s, 64), X, 186));
      const gapEl = hide(add(stage, box(h('div', 'u4l6-gap'), (A - B) * s, 64), X + B * s, 186));
      const res = hide(add(stage, box(cbox('u4l6-res', `${T('\\$17\\,100.00-\\$16\\,993.46=\\$106.54')}: Liam gets <b>$106.54</b> more from Buyer A.`), LEN, 56), X, 284));
      return [
        { cap: `Buyer A pays per bushel: ${T('3000\\times\\$5.70=\\$17\\,100.00')}.`, run: (c) => c.fadeIn(ba) },
        { cap: `Buyer B pays per tonne, so first change to tonnes: ${T('3000\\div45.9=65.359\\ldots')} t (keep all the decimals).`, run: (c) => c.fadeIn(bb1) },
        { cap: `${T('65.359\\ldots\\times\\$260\\approx\\$16\\,993.46')}.`, run: (c) => c.fadeIn(bb) },
        { cap: `The difference: ${T('\\$17\\,100.00-\\$16\\,993.46=\\$106.54')} more from Buyer A.`, run: async (c) => { await c.pop(gapEl); await c.fadeIn(res); } }
      ];
    }
    if (k === 'A') {
      const ta = hide(add(stage, box(h('div', 'u4l6-ptag', '<small>Buyer A</small><b>$5.70</b><span>per bushel</span>'), 210, 96), X, 20));
      const tb = hide(add(stage, box(h('div', 'u4l6-ptag', '<small>Buyer B</small><b>$260.00</b><span>per tonne</span>'), 210, 96), X + 240, 20));
      const l1 = line(stage, `A per tonne: ${T('\\$5.70\\times45.9=\\$261.63')}`, X, 140, 560, 'big');
      const scr = lcd(stage, '5.70×45.9', '261.63', W - 310, 136, 280);
      const ta2 = hide(add(stage, box(h('div', 'u4l6-ptag pans', '<small>Buyer A</small><b>$261.63</b><span>per tonne</span>'), 210, 96), X, 210));
      const tb2 = hide(add(stage, box(h('div', 'u4l6-ptag', '<small>Buyer B</small><b>$260.00</b><span>per tonne</span>'), 210, 96), X + 240, 210));
      const st = ok(stage, 'Pays more', X + 105, 214, { ok: true });
      const diff = line(stage, `by ${T('\\$261.63-\\$260.00=\\$1.63')} per tonne`, X + 480, 236, 400);
      return [
        { cap: 'Two prices in two different units. Change Buyer A’s price to <b>dollars per tonne</b>.', run: async (c) => { await c.pop(ta); await c.pop(tb); } },
        { cap: `A tonne of barley is 45.9 bushels: ${T('\\$5.70\\times45.9=\\$261.63')} per tonne.`, run: async (c) => { await c.fadeIn(l1); await c.pop(scr); } },
        { cap: 'Now both are per tonne: $261.63 and $260.00.', run: async (c) => { await c.pop(ta2); await c.pop(tb2); } },
        { cap: `<b>Buyer A</b> pays more, by ${T('\\$1.63')} per tonne.`, run: async (c) => { await stampIn(c, st); await c.fadeIn(diff); } }
      ];
    }
    const d = PR[k], f = d.f, n = Math.floor(f), sw = LEN / f, tPer = d.from === 't';
    const topTag = hide(add(stage, box(h('div', 'u4l6-ptag', `<small>${d.crop}</small><b>$${fx(d.p)}</b><span>per ${tPer ? 'tonne' : 'bushel'}</span>`), 220, 96), X, 6));
    add(stage, box(h('div', 'u4l6-cnt big', `1 tonne of ${d.crop} = ${f} bushels`), 420, 24), W - 450, 92);
    const sl = [];
    for (let i = 0; i <= n; i++) sl.push(hide(add(stage, box(h('div', 'u4l6-slice' + (i % 2 ? ' alt' : '')), (i < n ? sw : (f - n) * sw) - 1, 66), X + i * sw, 122)));
    const one = hide(add(stage, box(h('div', 'u4l6-onetag', tPer ? `$${fx(d.ans)} each` : `$${fx(d.p)} each`), 150, 34), X - 4, 194));
    const work = line(stage, tPer ? `$ per bushel: ${T(`${d.p}\\div${f}=${d.r.slice(0, 7)}\\ldots`)}` : `$ per tonne: ${T(`${fx(d.p)}\\times${f}=${d.r}`)}`, X, 244, W - 360, 'big');
    const scr = lcd(stage, d.e, d.r, W - 310, 238, 280);
    const res = hide(add(stage, box(cbox('u4l6-res', tPer ? `<b>$${fx(d.ans)} per bushel</b>: the smaller number ✓` : `<b>$${fx(d.ans)} per tonne</b>: the bigger number ✓`), 560, 52), X, 316));
    if (tPer) return [
      { cap: `${d.crop[0].toUpperCase() + d.crop.slice(1)}: <b>$${fx(d.p)} per tonne</b>. One tonne is <b>${f} bushels</b>.`, run: async (c) => { await c.pop(topTag); for (const e of sl) await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 30); } },
      { cap: `Share the $${fx(d.p)} over the ${f} bushels: ${T(`${d.p}\\div${f}=${d.r.slice(0, 7)}\\ldots`)}`, run: async (c) => { await c.fadeIn(work); await c.pop(scr); } },
      { cap: `Round at the end: <b>$${fx(d.ans)} per bushel</b>. The price per bushel is the smaller number ✓`, run: async (c) => { await c.pop(one); await c.fadeIn(res); } }
    ];
    return [
      { cap: `${d.crop[0].toUpperCase() + d.crop.slice(1)}: <b>$${fx(d.p)} per bushel</b>. One tonne is <b>${f} bushels</b>.`, run: async (c) => { await c.pop(topTag); await c.pop(one); } },
      { cap: `A tonne is ${f} bushels at $${fx(d.p)} each: ${T(`${fx(d.p)}\\times${f}=${d.r}`)}.`, run: async (c) => { for (const e of sl) await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 30); await c.fadeIn(work); await c.pop(scr); } },
      { cap: `<b>$${fx(d.ans)} per tonne</b>. The price per tonne is the bigger number ✓`, run: (c) => c.fadeIn(res) }
    ];
  }
};

/* =====================================================================================
 * 5. The grain bin / truck box filling: volume → bushels → tonnes
 * ===================================================================================== */
const binFill = {
  title: 'Volume → bushels → tonnes',
  height: 420, minW: 900,
  choices: [{ v: 'bin', label: 'Example 8: the bin' }, { v: 'box', label: 'Example 9: the truck box' }],
  ask: (k) => (k === 'bin' ? 'Example 8: a wheat bin has a diameter of <b>18 ft</b>. The wheat is level and <b>15 ft</b> deep. (36.7 bu/t; a truck hauls 600 bu a trip.)' : 'Example 9: a truck box is <b>6.1 m</b> long and <b>2.4 m</b> wide, filled level <b>1.5 m</b> deep. The truck may carry at most <b>14.5 t</b>.'),
  make(stage, k, ex) {
    const W = ex.W, S = mkSvg(stage, 360, 420, 0, 0), RX = 380, RW = W - RX - 20;
    let setFill;
    if (k === 'bin') {
      const x0 = 50, x1 = 290, top = 90, bot = 340, ry = 26;
      svgEl('path', { d: `M${x0} ${top} L170 30 L${x1} ${top} Z`, fill: '#d7dbe0', stroke: '#3a4254', 'stroke-width': 3, 'stroke-linejoin': 'round' }, S);
      svgEl('path', { d: `M${x0} ${top} V${bot} A120 ${ry} 0 0 0 ${x1} ${bot} V${top}`, fill: '#eef0f3', stroke: '#3a4254', 'stroke-width': 3 }, S);
      const g = svgEl('path', { fill: '#f2d27a' }, S), gt = svgEl('ellipse', { cx: 170, rx: 120, ry, fill: '#f6dd93', stroke: '#b8902a', 'stroke-width': 2 }, S);
      svgEl('path', { d: `M${x0} ${bot} A120 ${ry} 0 0 0 ${x1} ${bot}`, fill: 'none', stroke: '#3a4254', 'stroke-width': 3 }, S);
      const full = 200;   // 15 ft of wheat in px
      setFill = (t) => { const y = bot - full * t; g.setAttribute('d', `M${x0} ${y} A120 ${ry} 0 0 0 ${x1} ${y} V${bot} A120 ${ry} 0 0 1 ${x0} ${bot} Z`); gt.setAttribute('cy', y); gt.setAttribute('opacity', t > 0 ? 1 : 0); };
      setFill(0);
      txt(S, 170, 400, 'diameter 18 ft (r = 9 ft)', { 'font-size': 17 });
      const dep = hide(txt(S, 318, bot - 96, '15 ft', { 'font-size': 18, fill: '#7a5a10', 'font-weight': 800 }));
      const steps4 = [
        line(stage, `(a) ${T('V=\\pi\\times9^2\\times15\\approx3817')} ft³`, RX, 20, RW),
        line(stage, `(b) ${T('3817\\div1.28\\approx2982')} bu`, RX, 80, RW),
        line(stage, `(c) ${T('2982\\div36.7\\approx81.3')} t`, RX, 140, RW),
        line(stage, `(d) ${T('2982\\div600=4.97')} → round up: <b>5 trips</b>`, RX, 200, RW)
      ];
      const T5 = mkSvg(stage, RW, 110, RX, 270), trucks = [];
      for (let i = 0; i < 5; i++) { const tg = truck(T5, 90, CROP.wheat.col); tg.setAttribute('transform', `translate(${10 + i * (RW / 5)} 100) scale(0.62)`); tg.load.setAttribute('width', i < 4 ? 84 : 84 * 0.97); hide(tg); trucks.push(tg); }
      return [
        { cap: `The bin is a cylinder: ${T('r=18\\div2=9')} ft. Fill it with wheat <b>15 ft</b> deep.`, run: async (c) => { await tween(c, 1500, setFill); await show(c, dep); } },
        { cap: `(a) Volume: ${T('V=\\pi r^2h=\\pi\\times9^2\\times15\\approx3817')} ft³.`, run: (c) => c.fadeIn(steps4[0]) },
        { cap: `(b) Cubic feet → bushels: <b>divide by 1.28</b>. ${T('3817\\div1.28\\approx2982')} bu (a bit less than the ft³ ✓).`, run: (c) => c.fadeIn(steps4[1]) },
        { cap: `(c) Bushels → tonnes: divide by 36.7. ${T('2982\\div36.7\\approx81.3')} t.`, run: (c) => c.fadeIn(steps4[2]) },
        { cap: `(d) 600 bu a trip: ${T('2982\\div600=4.97')}. Round <b>up</b>: <b>5 trips</b> (4 trips leave some wheat behind).`, run: async (c) => { await c.fadeIn(steps4[3]); for (const t of trucks) await show(c, t); } }
      ];
    }
    // the truck box (a rectangular prism)
    const bx = 60, by = 120, L = 230, Hh = 140, D = 50;
    svgEl('path', { d: `M${bx} ${by} l${D} ${-D * 0.6} h${L} l${-D} ${D * 0.6} Z`, fill: '#f6f7f9', stroke: '#3a4254', 'stroke-width': 3 }, S);
    svgEl('path', { d: `M${bx + L} ${by} l${D} ${-D * 0.6} v${Hh} l${-D} ${D * 0.6} Z`, fill: '#e3e6ea', stroke: '#3a4254', 'stroke-width': 3 }, S);
    svgEl('rect', { x: bx, y: by, width: L, height: Hh, fill: '#fff', stroke: '#3a4254', 'stroke-width': 3 }, S);
    const gf = svgEl('rect', { x: bx + 3, width: L - 6, fill: '#f2d27a' }, S);
    const gs = svgEl('path', { fill: '#e3c069' }, S);
    const fullH = Hh * 0.85;
    setFill = (t) => { const hh = fullH * t; gf.setAttribute('y', by + Hh - 3 - hh); gf.setAttribute('height', hh); gs.setAttribute('d', `M${bx + L} ${by + Hh - hh} l${D} ${-D * 0.6} v${hh} l${-D} ${D * 0.6} Z`); };
    setFill(0);
    txt(S, bx + L / 2, by + Hh + 30, '6.1 m long', { 'font-size': 17 });
    txt(S, bx + L / 2 + D / 2, by - D * 0.3 + 6, '2.4 m wide', { 'font-size': 16 });
    const dep = hide(txt(S, bx - 8, by + Hh - fullH / 2, '1.5 m', { 'font-size': 17, 'text-anchor': 'end', fill: '#7a5a10', 'font-weight': 800 }));
    const ls = [
      line(stage, `(a) ${T('6.1\\times2.4\\times1.5=21.96')} m³`, RX, 20, RW),
      line(stage, `(b) ${T('21.96\\times27.5=603.9\\approx604')} bu`, RX, 80, RW),
      line(stage, `(c) canola: ${T('604\\div44.1\\approx13.70')} t`, RX, 140, RW),
      line(stage, `(d) wheat: ${T('604\\div36.7\\approx16.46')} t`, RX, 200, RW)
    ];
    const s1 = ok(stage, 'Legal ✓', RX + RW - 70, 163, { ok: true }), s2 = ok(stage, 'Not legal', RX + RW - 70, 223, { ok: false });
    const adv = hide(add(stage, box(cbox('u4l6-fact', 'With wheat, do not fill the box: load at most <b>532 bu</b> (Example 5).'), RW, 60), RX, 270));
    return [
      { cap: 'Fill the box level, <b>1.5 m</b> deep.', run: async (c) => { await tween(c, 1300, setFill); await show(c, dep); } },
      { cap: `(a) A rectangular prism: ${T('V=lwh=6.1\\times2.4\\times1.5=21.96')} m³.`, run: (c) => c.fadeIn(ls[0]) },
      { cap: `(b) Cubic metres → bushels: <b>multiply by 27.5</b>. ${T('21.96\\times27.5=603.9\\approx604')} bu.`, run: (c) => c.fadeIn(ls[1]) },
      { cap: `(c) Full of canola: ${T('604\\div44.1\\approx13.70')} t. Less than 14.5 t: <b>legal</b>.`, run: async (c) => { await c.fadeIn(ls[2]); await stampIn(c, s1); } },
      { cap: `(d) Full of wheat: ${T('604\\div36.7\\approx16.46')} t. More than 14.5 t: <b>not legal</b>. Load at most 532 bu of wheat.`, run: async (c) => { await c.fadeIn(ls[3]); await stampIn(c, s2); await c.fadeIn(adv); } }
    ];
  }
};

/* =============================== wiring =============================== */
mountExplainers({ factorMachine, gravel, bushelBox, tonneStack, buTonne, groups, truckScale, priceBu, binFill });

/* ============ Stand Up Break! — bushels and tonnes, prices, bins and loads, at the whiteboards ============ */
{
  const CR = [['wheat', 36.7], ['canola', 44.1], ['barley', 45.9], ['oats', 64.8]];
  standup('u4l6', {
    intro: 'Bushels are always the bigger number. Check your answer makes sense before you move on.',
    levels: {
      BEG: (r) => r.pick([
        () => { const [c, f] = r.pick(CR), t = r.pick([3, 4.5, 7, 9, 11, 13.5, 16, 22]), b = t * f; return { text: `Change <b>${t} t</b> of ${c} (${f} bu/t) to bushels. Round to the nearest bushel.`, q: '', a: [`${t}\\times${f}=${rnd(b, 2)}`, `\\approx${Math.round(b)}\\text{ bu}`] }; },
        () => { const [c, f] = r.pick(CR), b = r.pick([120, 250, 380, 640, 900, 1250, 1800]), t = b / f; return { text: `Change <b>${b} bushels</b> of ${c} (${f} bu/t) to tonnes. Round to two decimals.`, q: '', a: [`${b}\\div${f}=${rnd(t, 4)}\\ldots`, `\\approx${fx(t)}\\text{ t}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const [c, f] = r.pick(CR), p = r.int(230, 720); return { text: `An elevator pays <b>$${p}.00 per tonne</b> for ${c} (${f} bu/t). What is that per bushel, to the nearest cent?`, q: '', a: [`${p}\\div${f}=${rnd(p / f, 4)}\\ldots`, `\\approx\\$${fx(p / f)}\\text{ per bushel}`] }; },
        () => { const [c, f] = r.pick(CR), p = r.int(380, 1650) / 100; return { text: `A buyer offers <b>$${fx(p)} per bushel</b> for ${c} (${f} bu/t). What is that per tonne?`, q: '', a: [`${fx(p)}\\times${f}=${rnd(p * f, 3)}`, `\\approx\\$${fx(p * f)}\\text{ per tonne}`] }; },
        () => { const [m, f] = r.pick([['topsoil', 1.3], ['gravel', 1.7], ['sand', 1.6], ['wet concrete', 2.4]]), v = r.pick([4, 5, 6, 7, 9, 10]), lim = r.pick([2, 3, 4, 5]), tot = v * f, loads = Math.ceil(tot / lim - 1e-9); return { text: `${m[0].toUpperCase() + m.slice(1)} is about <b>${f} t per m³</b>. You need <b>${v} m³</b>. A truck carries at most <b>${lim} t</b>. Find the mass, then the number of loads.`, q: '', a: [`${v}\\times${f}=${rnd(tot, 2)}\\text{ t}`, `${rnd(tot, 2)}\\div${lim}=${rnd(tot / lim, 3)}\\ldots\\to${loads}\\text{ loads (round up)}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const [c, f] = r.pick(CR), dd = r.pick([14, 16, 18, 20, 24]), hh = r.pick([10, 12, 14, 16]), V = Math.PI * (dd / 2) ** 2 * hh, b = V / 1.28; return { text: `A round bin has a diameter of <b>${dd} ft</b> and holds ${c} (${f} bu/t), level and <b>${hh} ft</b> deep. Find the volume, the bushels and the tonnes. (1 bu ≈ 1.28 ft³)`, q: '', a: [`V=\\pi\\times${dd / 2}^2\\times${hh}\\approx${rnd(V, 1)}\\text{ ft}^3`, `${rnd(V, 1)}\\div1.28\\approx${Math.round(b)}\\text{ bu}`, `${Math.round(b)}\\div${f}\\approx${rnd(Math.round(b) / f, 1)}\\text{ t}`] }; },
        () => { const [c, f] = r.pick(CR), l = r.pick([5.5, 6.1, 7.3]), w = 2.4, d = r.pick([1.2, 1.4, 1.6]), lim = r.pick([14.5, 16, 20]), V = l * w * d, b = Math.round(V * 27.5), t = b / f; return { text: `A truck box is <b>${l} m</b> by <b>${w} m</b>, filled level <b>${d} m</b> deep with ${c} (${f} bu/t). The limit is <b>${lim} t</b>. Is the load legal? (1 m³ ≈ 27.5 bu)`, q: '', a: [`V=${l}\\times${w}\\times${d}=${rnd(V, 3)}\\text{ m}^3`, `${rnd(V, 3)}\\times27.5\\approx${b}\\text{ bu}`, `${b}\\div${f}\\approx${fx(t)}\\text{ t: ${t <= lim ? 'legal' : 'not legal'}}`] }; }
      ])()
    }
  });
}
