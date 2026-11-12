/* Math 10-3 · Unit 1 · Lesson 3 — Ratios (N1).
 * Explainers:
 *   fish     (the fish tank: count the parts, write the ratio three ways, part-to-part or part-to-whole; Example 1 checks),
 *   groups   (counters sorted into GCF equal groups: one group is the simplest form; Example 2 checks),
 *   ladder   (Full notes: can't spot the GCF? divide by a small common factor again and again; Example 2(b)(d)),
 *   blocks   (decimals ×10/×100 or change to the same unit, then bars cut into GCF-size blocks; Example 3 checks),
 *   jug      (a jug filling in ratio: concentrate, water, whole; part-to-part vs part-to-whole; Example 4 check),
 *   table    (a ratio table with cans of lemonade and ×n arrows; Example 5(a) check),
 *   taste    (two jugs, same concentrate: stronger or weaker? a verdict stamp; Example 5(b) check),
 *   concrete (buckets of cement, sand and gravel scaled ×n; the whole mix poured into a mixer; Example 6 checks),
 *   share    (sharing as stacks of coins / beakers of washer fluid: parts, one part, deal them out; Examples 7 and 8),
 *   wrong    (Full notes: divide by 3? by 5? by 8? only the total number of parts works).
 * Plus the Stand Up Break and the Math History animation (Vitruvius's mortar, 3 sand : 1 lime).
 * Colours: first term amber, second term blue, the whole purple, answers red. */
import { h, tex, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, pulse, anim, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const K = (src, display) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const AMB = COLORS.amber, BLUE = COLORS.blue, RED = COLORS.red, INK = COLORS.ink, PUR = COLORS.purple, GRN = COLORS.green;
const FA = '#f2b84b', FB = '#7fa6e8';
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u1l3-lab ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const absEl = (host, x, y, html, cls = '') => { const d = h('div', 'u1l3-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const moveTo = (c, el, x, y, ms = 600, o = {}) => anim(c, el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms, o);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const factorsOf = (n) => { const out = []; for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k); return out; };
const svgBox = (host, x, y, w, hh, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u1l3-svg ' + cls }); s.style.left = x + 'px'; s.style.top = y + 'px'; host.appendChild(s); return s; };
const money = (v, cents) => '\\$' + (cents || Math.round(v) !== v ? v.toFixed(2) : String(v));
const dec = (v) => String(parseFloat(v.toFixed(4)));
const mix = (a, b, t) => { const p = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

/* ---------- small pictures (HTML, so they can slide with left/top) ---------- */
const CAN = (fill) => `<svg viewBox="0 0 22 30" aria-hidden="true"><rect x="2" y="4" width="18" height="24" rx="3" fill="${fill}" stroke="#1c2230" stroke-width="1.6"/><rect x="2" y="4" width="18" height="4.5" rx="1.5" fill="#c9ccd3" stroke="#1c2230" stroke-width="1.2"/></svg>`;
const BUCKET = (fill) => `<svg viewBox="0 0 34 34" aria-hidden="true"><path d="M8 9 Q17 -3 26 9" fill="none" stroke="#3a4254" stroke-width="2.2"/><path d="M4 10 H30 L26 32 H8 Z" fill="${fill}" stroke="#3a4254" stroke-width="2" stroke-linejoin="round"/><rect x="3" y="8" width="28" height="4" rx="2" fill="#dfe1e6" stroke="#3a4254" stroke-width="1.4"/></svg>`;
const COINS = () => { let s = '<svg viewBox="0 0 56 52" aria-hidden="true">'; for (let i = 0; i < 6; i++) { const y = 44 - i * 6.2; s += `<ellipse cx="28" cy="${y}" rx="23" ry="7" fill="${i === 5 ? '#f3c84e' : '#e3ad32'}" stroke="#8a5a14" stroke-width="1.6"/>`; } return s + '<text x="28" y="18" font-size="10" font-weight="800" fill="#8a5a14" text-anchor="middle">$</text></svg>'; };
const BEAKER = (fill) => `<svg viewBox="0 0 44 52" aria-hidden="true"><path d="M7 6 H37 V44 Q37 49 32 49 H12 Q7 49 7 44 Z" fill="#fff" stroke="#1c2230" stroke-width="2"/><path class="u1l3-liq" d="M8.5 16 H35.5 V44 Q35.5 47.5 32 47.5 H12 Q8.5 47.5 8.5 44 Z" fill="${fill}"/><path d="M4 6 H40" stroke="#1c2230" stroke-width="2.4" stroke-linecap="round"/></svg>`;

/* =============================== explainer: the fish tank =============================== */
const FISH = {
  g: { n: 5, name: 'goldfish', col: '#e8862a' },
  p: { n: 3, name: 'guppies', col: '#8a58c9' },
  t: { n: 4, name: 'tetras', col: '#1d93b5' }
};
// [kind, x, y, facing]
const FPOS = [['g', 92, 92, 1], ['p', 214, 98, -1], ['g', 342, 90, 1], ['t', 452, 100, -1],
  ['t', 142, 168, -1], ['g', 268, 170, 1], ['p', 392, 172, -1],
  ['g', 86, 244, 1], ['t', 206, 246, 1], ['p', 334, 242, -1], ['g', 454, 248, -1], ['t', 270, 306, 1]];
const FC = {
  gt: { label: 'Goldfish to tetras', A: ['g'], B: ['t'] },
  ga: { label: 'Goldfish to all fish', A: ['g'], B: 'all' },
  r1: { label: 'Example 1 check: row 1', A: ['g'], B: ['p'] },
  r2: { label: 'row 2', A: ['p'], B: ['g'] },
  r3: { label: 'row 3', A: ['t'], B: 'all' },
  r4: { label: 'row 4', A: ['g', 'p'], B: ['t'], an: 'fish that are not tetras' }
};
const nOf = (G) => (G === 'all' ? 12 : G.reduce((s, k) => s + FISH[k].n, 0));
const nameOf = (G, d, first) => (G === 'all' ? 'all fish' : first && d.an ? d.an : G.map((k) => FISH[k].name).join(' and '));
function drawFish(svg, kind, x, y, dir) {
  const f = FISH[kind], g = svgEl('g', { transform: `translate(${x} ${y}) scale(${dir} 1)`, class: 'u1l3-fish' }, svg);
  if (kind === 'p') svgEl('path', { d: 'M-18 0 L-44 -17 Q-50 0 -44 17 Z', fill: f.col, opacity: 0.8, stroke: '#3a2a5a', 'stroke-width': 1.5 }, g);
  else svgEl('path', { d: 'M-20 0 L-38 -13 L-38 13 Z', fill: f.col, stroke: '#5a3a14', 'stroke-width': 1.5 }, g);
  svgEl('ellipse', { cx: 0, cy: 0, rx: kind === 't' ? 24 : 26, ry: kind === 't' ? 11 : 14, fill: f.col, stroke: kind === 'p' ? '#3a2a5a' : '#5a3a14', 'stroke-width': 1.6 }, g);
  if (kind === 't') svgEl('rect', { x: -18, y: -3, width: 34, height: 5, rx: 2.5, fill: '#e2f6ff' }, g);
  svgEl('circle', { cx: 13, cy: -4, r: 3.4, fill: '#fff' }, g); svgEl('circle', { cx: 14, cy: -4, r: 1.7, fill: INK }, g);
  const ring = svgEl('ellipse', { cx: -6, cy: 0, rx: 44, ry: 24, fill: 'none', stroke: AMB, 'stroke-width': 3.5, opacity: 0 }, g);
  return { g, ring, kind, x, y };
}
const fish = {
  title: 'Count the parts, write the ratio',
  height: 352, minW: 900,
  choices: Object.keys(FC).map((k) => ({ v: k, label: FC[k].label })),
  intro: (k) => { const d = FC[k]; return `Write the ratio of <b>${nameOf(d.A, d, true)}</b> to <b>${nameOf(d.B, d)}</b>. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = FC[k], W = ex.W, a = nOf(d.A), b = nOf(d.B), pw = d.B === 'all';
    const tank = svgBox(stage, 6, 8, 528, 340);
    svgEl('rect', { x: 8, y: 30, width: 512, height: 300, rx: 14, fill: '#e3f3fa', stroke: '#4a6b80', 'stroke-width': 4 }, tank);
    svgEl('rect', { x: 8, y: 30, width: 512, height: 22, rx: 10, fill: '#cfe9f5' }, tank);
    svgEl('path', { d: 'M30 330 Q 60 300 52 270 M470 330 Q 500 296 486 262', stroke: '#3f9a5a', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, tank);
    const all = FPOS.map(([kd, x, y, dir]) => drawFish(tank, kd, x, y, dir));
    const nums = svgEl('g', {}, tank);
    const whole = svgEl('rect', { x: 2, y: 22, width: 524, height: 314, rx: 18, fill: 'none', stroke: PUR, 'stroke-width': 4, 'stroke-dasharray': '10 7', opacity: 0 }, tank);
    const wholeLab = svgEl('text', { x: 264, y: 18, 'text-anchor': 'middle', class: 'u1l3-svgt', fill: PUR, opacity: 0 }, tank); wholeLab.textContent = 'all fish: 5 + 3 + 4 = 12'; wholeLab.setAttribute('class', 'u1l3-svgbig');
    const inA = (f) => d.A.includes(f.kind), inB = (f) => (pw ? true : d.B.includes(f.kind));
    const px = 560, pc = (px + W) / 2;
    const head = hide(lab(stage, pc, 34, `<b style="color:${AMB}">${nameOf(d.A, d, true)}</b> to <b style="color:${pw ? PUR : BLUE}">${nameOf(d.B, d)}</b>`, 'u1l3-ph'));
    const big = hide(lab(stage, pc, 104, K(`\\color{${AMB}}{${a}}\\color{${INK}}{\\,:\\,}\\color{${pw ? PUR : BLUE}}{${b}}`), 'u1l3-huge'));
    const ways = h('div', 'u1l3-ways3'); ways.style.left = px + 'px'; ways.style.top = '160px'; ways.style.width = (W - px - 10) + 'px';
    ways.innerHTML = `<div><i>colon</i>${K(`${a}:${b}`)}</div><div><i>words</i><b>${a} to ${b}</b></div><div><i>fraction</i>${K(`\\frac{${a}}{${b}}`)}</div>`;
    stage.appendChild(ways); hide(ways);
    const tag = hide(lab(stage, pc, 300, pw ? 'part-to-<b>whole</b>' : 'part-to-<b>part</b>', 'u1l3-tag ' + (pw ? 'pw' : 'pp')));
    const countIn = async (c, list, col) => {
      list.forEach((f) => { f.ring.setAttribute('stroke', col); });
      await Promise.all(list.map((f) => anim(c, f.ring, [{ opacity: 0 }, { opacity: 1 }], 300)));
      for (let i = 0; i < list.length; i++) {
        const f = list[i], t = svgEl('text', { x: f.x, y: f.y - 22, 'text-anchor': 'middle', class: 'u1l3-fnum', fill: col }, nums); t.textContent = String(i + 1);
        hide(t); await appear(c, t, 140);
      }
    };
    const dim = (c, keep) => Promise.all(all.map((f) => anim(c, f.g, [{ opacity: 1 }, { opacity: keep(f) ? 1 : 0.28 }], 300)));
    const A = all.filter(inA), B = all.filter((f) => !pw && inB(f));
    const capA = d.A.length > 1 ? `Fish that are <b>not tetras</b>: the goldfish and the guppies. ${T('5+3=8')}.` : `Count the <b>${FISH[d.A[0]].name}</b>: <b>${a}</b>.`;
    const capB = pw ? `The <b>whole</b> group is <b>all</b> the fish. Add all the parts: ${T('5+3+4=12')}.` : `Count the <b>${FISH[d.B[0]].name}</b>: <b>${b}</b>.`;
    return [
      { cap: capA, run: async (c) => { await dim(c, inA); await countIn(c, A, AMB); } },
      { cap: capB, run: async (c) => {
        if (pw) { await dim(c, () => true); await Promise.all([appear(c, whole, 400), appear(c, wholeLab, 400)]); }
        else { await dim(c, (f) => inA(f) || inB(f)); await countIn(c, B, BLUE); }
      } },
      { cap: `The first amount named goes <b>first</b>: ${nameOf(d.A, d, true)} to ${nameOf(d.B, d)} is <b>${a} : ${b}</b>.`, run: async (c) => { await show(c, head); await pop(c, big); } },
      { cap: `Three ways to write it. All three are read “${a} to ${b}”.`, run: (c) => show(c, ways, 450) },
      { cap: pw ? `${nameOf(d.A, d, true)[0].toUpperCase() + nameOf(d.A, d, true).slice(1)} compared with the <b>whole</b> tank: a <b>part-to-whole</b> ratio.` : `Both amounts are <b>parts</b> of the tank: a <b>part-to-part</b> ratio.`, run: (c) => pop(c, tag) }
    ];
  }
};

/* =============================== explainer: counters into GCF groups =============================== */
const GR = { a: { label: '12 : 18', a: 12, b: 18 }, b: { label: 'Example 2 check: (b) 40 : 15', a: 40, b: 15 }, c: { label: '(c) 4 : 12', a: 4, b: 12 }, d: { label: '(d) 24 : 24', a: 24, b: 24 } };
const groups = {
  title: 'Share the counters into equal groups',
  height: 384, minW: 900,
  choices: Object.keys(GR).map((k) => ({ v: k, label: GR[k].label })),
  intro: (k) => `Write ${T(`${GR[k].a}:${GR[k].b}`)} in simplest form. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const { a, b } = GR[k], W = ex.W, g = gcd(a, b), p = a / g, q = b / g;
    // counter size: fits the two rows and the g groups
    const cols = Math.min(4, Math.max(p, q)), gap = g > 12 ? 5 : 12;
    const rowFit = (W - 130) / Math.max(a, b) - 4;
    const boxFit = ((W - 60 - (g - 1) * gap) / g - 12) / cols - 3;
    const d = Math.max(10, Math.min(28, rowFit, boxFit)), step = d + 3;
    const x0 = 100;
    lab(stage, 52, 40, K(`\\color{${AMB}}{${a}}`), 'u1l3-rowlab'); lab(stage, 52, 88, K(`\\color{${BLUE}}{${b}}`), 'u1l3-rowlab');
    const rowStep = Math.min(d + 10, (W - 130) / Math.max(a, b));
    const mk = (i, col, y) => { const e = absEl(stage, x0 + i * rowStep, y, '', 'u1l3-ctr'); e.style.width = e.style.height = d + 'px'; e.style.background = col; e.style.marginLeft = e.style.marginTop = (-d / 2) + 'px'; hide(e); return e; };
    const ca = Array.from({ length: a }, (_, i) => mk(i, FA, 40)), cb = Array.from({ length: b }, (_, i) => mk(i, FB, 88));
    // factor lists
    const fa = factorsOf(a), fb = factorsOf(b), mark = (n, other) => (n === g ? `<b class="u1l3-gcf">${n}</b>` : other.includes(n) ? `<b class="u1l3-com">${n}</b>` : String(n));
    const fl = hide(absEl(stage, 40, 118, `<div>Factors of <b style="color:${AMB}">${a}</b>: ${fa.map((n) => mark(n, fb)).join(', ')}</div><div>Factors of <b style="color:${BLUE}">${b}</b>: ${fb.map((n) => mark(n, fa)).join(', ')}</div>`, 'u1l3-flist'));
    // the groups
    const ra = Math.ceil(p / cols), rb = Math.ceil(q / cols), bw = cols * step + 12, bh = (ra + rb) * step + 18;
    const tot = g * bw + (g - 1) * gap, bx0 = (W - tot) / 2, by = 196;
    const boxes = Array.from({ length: g }, (_, i) => { const e = absEl(stage, bx0 + i * (bw + gap), by, '', 'u1l3-gbox'); e.style.width = bw + 'px'; e.style.height = bh + 'px'; hide(e); return e; });
    const spot = (i, j, isB) => { const r = isB ? ra + Math.floor(j / cols) : Math.floor(j / cols), cc = j % cols; return [bx0 + i * (bw + gap) + 6 + cc * step + step / 2, by + 6 + (isB ? 6 : 0) + r * step + step / 2]; };
    const eq = hide(lab(stage, W / 2, by + bh + 52, K(`${a}\\div${g}:${b}\\div${g}=\\color{${RED}}{\\boldsymbol{${p}:${q}}}`), 'u1l3-eq'));
    const gl = hide(lab(stage, W / 2, by - 14, `<b>${g}</b> equal group${g > 1 ? 's' : ''}`, 'u1l3-small'));
    return [
      { cap: `${T(`${a}:${b}`)} as counters: <b>${a}</b> amber and <b>${b}</b> blue.`, run: async (c) => { await Promise.all(ca.map((e, i) => appear(c, e, 200, { delay: i * 15 }))); await Promise.all(cb.map((e, i) => appear(c, e, 200, { delay: i * 15 }))); } },
      { cap: `Find the GCF: the biggest number that divides into <b>both</b>. ${a === b ? `Both are ${a}, so it is <b>${g}</b>.` : `It is <b>${g}</b>.`}`, run: (c) => show(c, fl) },
      { cap: `Make <b>${g} equal groups</b> and share out every counter.`, run: async (c) => {
        await Promise.all(boxes.map((e) => appear(c, e, 250))); await appear(c, gl, 200);
        const mv = [];
        ca.forEach((e, n) => { const [x, y] = spot(n % g, Math.floor(n / g), false); mv.push(moveTo(c, e, x, y, 700, { delay: n * 12 })); });
        cb.forEach((e, n) => { const [x, y] = spot(n % g, Math.floor(n / g), true); mv.push(moveTo(c, e, x, y, 700, { delay: 200 + n * 12 })); });
        await Promise.all(mv);
      } },
      { cap: `Every group is the same: <b>${p}</b> amber and <b>${q}</b> blue.`, run: async (c) => { boxes[0].classList.add('on'); await pulse(c, boxes[0], 1.08); } },
      { cap: `So ${T(`${a}:${b}=${p}:${q}`)}. We divided <b>both</b> terms by the GCF, ${g}.${p === 1 && q === 1 ? ' Keep <b>both</b> 1s: the answer is 1 : 1, not 1.' : ''}`, run: (c) => pop(c, eq) }
    ];
  }
};

/* =============================== explainer: the division ladder (Full notes) =============================== */
const LD = { a: { label: '12 : 18', a: 12, b: 18 }, n: { label: '36 : 60', a: 36, b: 60 }, b: { label: 'Example 2 check: (b) 40 : 15', a: 40, b: 15 }, d: { label: '(d) 24 : 24', a: 24, b: 24 } };
const ladder = {
  title: 'Divide, then divide again',
  height: 380, minW: 900,
  choices: Object.keys(LD).map((k) => ({ v: k, label: LD[k].label })),
  intro: (k) => `Simplify ${T(`${LD[k].a}:${LD[k].b}`)} without spotting the GCF. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const W = ex.W; let { a, b } = LD[k]; const g = gcd(a, b), rungs = [];
    while (gcd(a, b) > 1) { const f = [2, 3, 5, 7, 11, 13].find((p) => a % p === 0 && b % p === 0); rungs.push({ f, a, b, na: a / f, nb: b / f }); a /= f; b /= f; }
    const n = rungs.length, dy = Math.min(68, 300 / Math.max(1, n)), cx = W / 2 - 80, y0 = 36;
    const rows = [hide(lab(stage, cx, y0, K(`${LD[k].a}:${LD[k].b}`), 'u1l3-rung'))];
    const svg = svgBox(stage, 0, 0, W, 380);
    const arrows = rungs.map((r, i) => {
      const g1 = svgEl('g', { opacity: 0 }, svg), ya = y0 + i * dy + 18, yb = y0 + (i + 1) * dy - 18;
      [-1, 1].forEach((s) => { const x = cx + s * 70; svgEl('line', { x1: x, y1: ya, x2: x, y2: yb - 6, stroke: PUR, 'stroke-width': 3 }, g1); svgEl('polygon', { points: `${x - 6},${yb - 8} ${x + 6},${yb - 8} ${x},${yb + 2}`, fill: PUR }, g1); const t = svgEl('text', { x: x + s * 14, y: (ya + yb) / 2 + 6, 'text-anchor': s < 0 ? 'end' : 'start', class: 'u1l3-svgt', fill: PUR }, g1); t.textContent = '÷' + r.f; });
      rows.push(hide(lab(stage, cx, y0 + (i + 1) * dy, K(`${r.na}:${r.nb}`), 'u1l3-rung')));
      return g1;
    });
    const prod = rungs.map((r) => r.f).join('\\times');
    const side = hide(absEl(stage, W / 2 + 70, y0 + n * dy / 2 - 30, `${K(`${prod}=${g}`)}<div>the same as dividing by the <b>GCF</b>, ${g}, once</div>`, 'u1l3-note'));
    const st = stamp(stage, 'simplest form', { ok: true, x: cx, y: y0 + n * dy + 46, size: 'sm' }); hide(st);
    return [
      { cap: `Start with ${T(`${LD[k].a}:${LD[k].b}`)}.`, run: (c) => pop(c, rows[0]) },
      ...rungs.map((r, i) => ({ cap: `${r.a} and ${r.b} both divide by <b>${r.f}</b>: ${T(`${r.a}\\div${r.f}:${r.b}\\div${r.f}=${r.na}:${r.nb}`)}.`, run: async (c) => { await appear(c, arrows[i], 300); await pop(c, rows[i + 1]); } })),
      { cap: `${a} and ${b} have no common factor except 1, so ${T(`${a}:${b}`)} is in <b>simplest form</b>.${n > 1 ? ` ${T(prod + '=' + g)}: the same as dividing by the GCF.` : ''}`, run: async (c) => { await stampIn(c, st); if (n > 1) await show(c, side); } }
    ];
  }
};

/* =============================== explainer: decimals / units → blocks =============================== */
const BL = {
  n: { label: 'Notes: 3 h : 90 min', A: '3 h', B: '90 min', fixA: ['3 h', '180 min', '3\\times60=180'], a: 180, b: 90, unit: 'min' },
  a: { label: 'Example 3 check: (a) 2.5 : 4', A: '2.5', B: '4', m: 10, a: 25, b: 40 },
  b: { label: '(b) 0.75 : 1.5', A: '0.75', B: '1.5', m: 100, a: 75, b: 150 },
  c: { label: '(c) 45 min : 2 h', A: '45 min', B: '2 h', fixB: ['2 h', '120 min', '2\\times60=120'], a: 45, b: 120, unit: 'min' },
  d: { label: '(d) 250 g : 1.5 kg', A: '250 g', B: '1.5 kg', fixB: ['1.5 kg', '1\u2009500 g', '1.5\\times1\\,000=1\\,500'], a: 250, b: 1500, unit: 'g' }
};
const blocks = {
  title: 'Whole numbers, same unit, then blocks',
  height: 372, minW: 900,
  choices: Object.keys(BL).map((k) => ({ v: k, label: BL[k].label })),
  intro: (k) => `Write ${BL[k].m ? T(`${BL[k].A}:${BL[k].B}`) : `<b>${BL[k].A} : ${BL[k].B}</b>`} in simplest form. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = BL[k], W = ex.W, g = gcd(d.a, d.b), p = d.a / g, q = d.b / g, xl = W / 2 - 150, xr = W / 2 + 150;
    const cardA = lab(stage, xl, 40, d.m ? K(d.A) : d.A, 'u1l3-card ca'), cardB = lab(stage, xr, 40, d.m ? K(d.B) : d.B, 'u1l3-card cb');
    lab(stage, W / 2, 40, K(':'), 'u1l3-colon');
    const notes = [];
    const fixLab = (x, html) => { const e = hide(lab(stage, x, 96, html, 'u1l3-fix')); notes.push(e); return e; };
    let cap1, run1;
    if (d.m) {
      const dp = (t) => (t.split('.')[1] || '').length, wd = dp(d.A) >= dp(d.B) ? d.A : d.B, z = d.m === 10 ? 'one decimal place' : 'two decimal places';
      fixLab(xl, `${K(`\\times${d.m}`)}`); fixLab(xr, `${K(`\\times${d.m}`)}`);
      cap1 = `Decimals! ${wd} has ${z}, so multiply <b>both</b> terms by <b>${d.m}</b>: ${T(`${d.A}:${d.B}\\to${tn(d.a)}:${tn(d.b)}`)}.`;
      run1 = async (c) => { for (const e of notes) await pop(c, e); cardA.innerHTML = K(String(d.a)); cardB.innerHTML = K(String(d.b)); await Promise.all([pulse(c, cardA), pulse(c, cardB)]); };
    } else {
      const fx = d.fixA || d.fixB, card = d.fixA ? cardA : cardB, e = fixLab(d.fixA ? xl : xr, K(fx[2]));
      cap1 = `Different units! Change to the <b>smaller</b> unit: ${fx[0]} = ${T(fx[2])}, so ${fx[0]} = <b>${fx[1]}</b>.`;
      run1 = async (c) => { await pop(c, e); card.innerHTML = fx[1]; await pulse(c, card); };
    }
    // bars to scale
    const bx = 120, maxL = W - bx - 120, sc = maxL / Math.max(d.a, d.b), yA = 160, yB = 228, bh = 46;
    const mkBar = (y, v, fill, stroke) => { const e = absEl(stage, bx, y, '', 'u1l3-bar'); e.style.width = v * sc + 'px'; e.style.height = bh + 'px'; e.style.background = fill; e.style.borderColor = stroke; hide(e); return e; };
    const barA = mkBar(yA, d.a, FA, AMB), barB = mkBar(yB, d.b, FB, BLUE);
    const la = hide(lab(stage, bx - 50, yA + bh / 2, K(`\\color{${AMB}}{${tn(d.a)}}`), 'u1l3-rowlab')), lb = hide(lab(stage, bx - 50, yB + bh / 2, K(`\\color{${BLUE}}{${tn(d.b)}}`), 'u1l3-rowlab'));
    const blockW = g * sc;
    const cut = (bar, n) => { for (let i = 0; i < n; i++) { const e = h('div', 'u1l3-blk', blockW >= 44 ? String(g) + (d.unit && blockW >= 70 ? ' ' + d.unit : '') : ''); e.style.left = i * blockW + 'px'; e.style.width = blockW + 'px'; hide(e); bar.appendChild(e); } return [...bar.children]; };
    const ba = cut(barA, p), bb = cut(barB, q);
    const na = hide(lab(stage, bx + d.a * sc + 34, yA + bh / 2, K(`\\color{${RED}}{${p}}`), 'u1l3-cnt')), nb = hide(lab(stage, bx + d.b * sc + 34, yB + bh / 2, K(`\\color{${RED}}{${q}}`), 'u1l3-cnt'));
    const res = hide(lab(stage, W / 2, 330, K(`${tn(d.a)}:${tn(d.b)}=\\color{${RED}}{\\boldsymbol{${p}:${q}}}`), 'u1l3-eq'));
    return [
      { cap: cap1, run: run1 },
      { cap: `Now drop the units and draw both amounts to scale: ${T(`${tn(d.a)}:${tn(d.b)}`)}.`, run: async (c) => { await Promise.all([appear(c, barA, 350), appear(c, la, 350)]); await Promise.all([appear(c, barB, 350), appear(c, lb, 350)]); } },
      { cap: `The GCF of ${fmtN(d.a)} and ${fmtN(d.b)} is <b>${g}</b>. Cut both bars into blocks of ${g}${d.unit ? ' ' + d.unit : ''}.`, run: async (c) => { for (const e of [...ba, ...bb]) await appear(c, e, 120); } },
      { cap: `Count the blocks: <b>${p}</b> and <b>${q}</b>. So ${d.m ? T(`${d.A}:${d.B}`) : `${d.A} : ${d.B}`} = <b>${p} : ${q}</b>.`, run: async (c) => { await pop(c, na); await pop(c, nb); await pop(c, res); } }
    ];
  }
};

/* =============================== explainer: the mixing jug =============================== */
const JG = {
  n: { label: 'Orange juice: 250 mL in a 1 L jug', cap: 1000, capT: '1 L', conc: 250, name: 'orange juice', col: '#ef8a17', mixc: '#f6b860' },
  e4: { label: 'Example 4 check: iced tea', cap: 2000, capT: '2 L', conc: 400, name: 'iced tea', col: '#7a3e12', mixc: '#c58b55' }
};
const WATER = '#cfe8f7';
const jug = {
  title: 'Fill the jug in parts',
  height: 384, minW: 900,
  choices: Object.keys(JG).map((k) => ({ v: k, label: JG[k].label })),
  intro: (k) => `A ${JG[k].capT} jug of ${JG[k].name}: ${fmtN(JG[k].conc)} mL of concentrate, the rest water. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = JG[k], W = ex.W, part = d.conc, n = d.cap / part, wv = d.cap - d.conc;
    const svg = svgBox(stage, 20, 4, 330, 376);
    const X = 60, Y = 34, JW = 180, JH = 316, yOf = (v) => Y + JH - (v / d.cap) * JH;
    const body = svgEl('g', { opacity: 0 }, svg);
    svgEl('path', { d: `M${X + JW} ${Y + 60} q 52 10 44 90 q -6 70 -44 80`, fill: 'none', stroke: '#4a6b80', 'stroke-width': 9, 'stroke-linecap': 'round' }, body);
    const clip = svgEl('clipPath', { id: 'u1l3-jclip-' + k }, svg); svgEl('rect', { x: X, y: Y - 20, width: JW, height: JH + 20, rx: 12 }, clip);
    const liq = svgEl('g', { 'clip-path': `url(#u1l3-jclip-${k})` }, svg);
    const cRect = svgEl('rect', { x: X, y: yOf(0), width: JW, height: 0, fill: d.col }, liq);
    const wRect = svgEl('rect', { x: X, y: yOf(part), width: JW, height: 0, fill: WATER }, liq);
    svgEl('rect', { x: X, y: Y - 20, width: JW, height: JH + 20, rx: 12, fill: 'none', stroke: '#4a6b80', 'stroke-width': 5 }, body);
    const marks = svgEl('g', { opacity: 0 }, svg);
    for (let i = 1; i <= n; i++) { const y = yOf(i * part); svgEl('line', { x1: X - 14, x2: X, y1: y, y2: y, stroke: '#4a6b80', 'stroke-width': 3 }, marks); const t = svgEl('text', { x: X - 18, y: y + 5, 'text-anchor': 'end', class: 'u1l3-svgs', fill: '#4a6b80' }, marks); t.textContent = fmtN(i * part); }
    const mlT = svgEl('text', { x: X - 18, y: Y - 26, 'text-anchor': 'end', class: 'u1l3-svgs', fill: '#4a6b80' }, marks); mlT.textContent = 'mL';
    const cuts = svgEl('g', { opacity: 0 }, svg), plabs = svgEl('g', { opacity: 0 }, svg);
    for (let i = 1; i < n; i++) svgEl('line', { x1: X, x2: X + JW, y1: yOf(i * part), y2: yOf(i * part), stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, cuts);
    for (let i = 0; i < n; i++) { const t = svgEl('text', { x: X + JW / 2, y: (yOf(i * part) + yOf((i + 1) * part)) / 2 + 6, 'text-anchor': 'middle', class: 'u1l3-svgt', fill: i === 0 ? '#fff' : '#1f4f86' }, plabs); t.textContent = i === 0 ? 'concentrate' : 'water ' + i; }
    const px = 400, pc = (px + W) / 2;
    const L1 = hide(absEl(stage, px, 30, `<span class="u1l3-dot" style="background:${d.col}"></span>concentrate: <b>${fmtN(d.conc)} mL</b> = <b>1 part</b>`, 'u1l3-line'));
    const L2 = hide(absEl(stage, px, 70, `<span class="u1l3-dot" style="background:${WATER}"></span>water: ${T(`${tn(d.cap)}-${d.conc}=${tn(wv)}`)} mL = <b>${n - 1} parts</b>`, 'u1l3-line'));
    const L3 = hide(absEl(stage, px, 110, `<span class="u1l3-dot" style="background:${PUR}"></span>whole drink: <b>${fmtN(d.cap)} mL</b> = <b>${n} parts</b>`, 'u1l3-line'));
    const R1 = hide(absEl(stage, px, 170, `<div>concentrate : water</div>${K(`${d.conc}:${tn(wv)}=\\color{${RED}}{\\boldsymbol{1:${n - 1}}}`)}<span class="u1l3-tag pp">part-to-part</span>`, 'u1l3-res'));
    const R2 = hide(absEl(stage, px, 266, `<div>concentrate : whole drink</div>${K(`${d.conc}:${tn(d.cap)}=\\color{${RED}}{\\boldsymbol{1:${n}}}`)}<span class="u1l3-tag pw">part-to-whole</span>`, 'u1l3-res'));
    void pc;
    const fill = (c, rect, from, to, ms) => tween(c, ms, (t) => { const v = from + (to - from) * t; rect.setAttribute('y', yOf(v)); rect.setAttribute('height', yOf(from) - yOf(v)); });
    return [
      { cap: `The jug holds ${d.capT} = <b>${fmtN(d.cap)} mL</b>. The marks are every ${part} mL.`, run: async (c) => { await appear(c, body, 350); await appear(c, marks, 350); } },
      { cap: `Pour in <b>${part} mL</b> of concentrate. That is <b>1 part</b>.`, run: async (c) => { await fill(c, cRect, 0, part, 900); await show(c, L1); } },
      { cap: `Fill the rest with water: ${T(`${tn(d.cap)}-${d.conc}=${tn(wv)}`)} mL. That is <b>${n - 1} more parts</b> of ${part} mL.`, run: async (c) => { await fill(c, wRect, part, d.cap, 1400); await appear(c, cuts, 300); await appear(c, plabs, 300); await show(c, L2); await show(c, L3); } },
      { cap: `Concentrate to <b>water</b>: ${T(`${d.conc}:${tn(wv)}=1:${n - 1}`)}. Both are parts of the drink: <b>part-to-part</b>.`, run: (c) => show(c, R1) },
      { cap: `Concentrate to the <b>whole drink</b>: ${T(`${d.conc}:${tn(d.cap)}=1:${n}`)}. That is <b>part-to-whole</b>.`, run: (c) => show(c, R2) },
      { cap: `Stir! Every sip still has 1 part concentrate for every ${n - 1} parts water.`, run: async (c) => { await Promise.all([anim(c, plabs, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, cuts, [{ opacity: 1 }, { opacity: 0.25 }], 300)]); await Promise.all([anim(c, cRect, [{ fill: d.col }, { fill: d.mixc }], 1100), anim(c, wRect, [{ fill: WATER }, { fill: d.mixc }], 1100)]); } }
    ];
  }
};
function fmtN(v) { const s = String(v); return /^\d{4,}$/.test(s) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') : s; }
function tn(v) { const s = String(v); return /^\d{4,}$/.test(s) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s; }

/* =============================== explainer: the ratio table =============================== */
const TB = {
  n: { label: 'Notes: 1 : 4 = 2 : 8 = 3 : 12', cols: [[1, 4], [2, 8], [3, 12]], given: null },
  e5: { label: 'Example 5(a) check', cols: [[1, 4], [2, 8], [3, 12], [5, 20], [8, 32]], given: [[1, 1], [1, 0], [1, 0], [0, 1], [1, 0]] }
};
const ORANGE = '#f0b429', WBLUE = '#8cc4ec';
const table = {
  title: 'A ratio table for lemonade',
  height: 392, minW: 900,
  choices: Object.keys(TB).map((k) => ({ v: k, label: TB[k].label })),
  intro: (k) => (k === 'n' ? 'Mix 1 can of concentrate with 4 cans of water. Make more! Press <b>Next</b>.' : 'Complete the ratio table: 1 can of concentrate to 4 cans of water. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = TB[k], W = ex.W, nC = d.cols.length, hw = 210, cw = Math.min(100, (W - hw - 190) / nC), tx = Math.max(20, (W - hw - nC * cw - 150) / 2), ty = 214, ch = 56;
    // the cans picture
    const pic = absEl(stage, 0, 6, '', 'u1l3-cans'); pic.style.width = W + 'px';
    const drawCans = (cn, wn) => {
      pic.innerHTML = `<div class="u1l3-cgrp"><div class="u1l3-crow">${CAN(ORANGE).repeat(cn)}</div><div class="u1l3-clab">${cn} can${cn > 1 ? 's' : ''} of concentrate</div></div><div class="u1l3-cplus">+</div><div class="u1l3-cgrp"><div class="u1l3-crow w">${CAN(WBLUE).repeat(wn)}</div><div class="u1l3-clab">${wn} cans of water</div></div>`;
    };
    hide(pic);
    // the table
    const tbl = absEl(stage, tx, ty, '', 'u1l3-rtab');
    tbl.style.gridTemplateColumns = `${hw}px repeat(${nC}, ${cw}px)`;
    tbl.appendChild(h('div', 'u1l3-rth', 'Cans of concentrate'));
    const cells = [[], []];
    d.cols.forEach(([cv], j) => { const e = h('div', 'u1l3-rtc', K(String(cv))); cells[0].push(e); tbl.appendChild(e); });
    tbl.appendChild(h('div', 'u1l3-rth', 'Cans of water'));
    d.cols.forEach(([, wv], j) => { const e = h('div', 'u1l3-rtc', K(String(wv))); cells[1].push(e); tbl.appendChild(e); });
    const qs = [];
    cells.forEach((row, r) => row.forEach((e, j) => {
      const given = d.given ? d.given[j][r] : j === 0;
      if (!given) { const v = e.innerHTML; e.dataset.v = v; e.innerHTML = d.given ? '<span class="u1l3-q">?</span>' : ''; e.classList.add('u1l3-blank'); qs.push([r, j]); }
    }));
    const fillCell = (c, r, j) => { const e = cells[r][j]; e.innerHTML = e.dataset.v; e.classList.add('got'); return pop(c, e); };
    const svg = svgBox(stage, 0, 0, W, 392);
    const colX = (j) => tx + hw + j * cw + cw / 2;
    const arc = (j0, j1, label, below) => {
      const g1 = svgEl('g', { opacity: 0 }, svg), x0 = colX(j0), x1 = colX(j1), y = below ? ty + 2 * ch + 6 : ty - 6, hgt = below ? 28 : 16 + (j1 - j0) * 24, s = below ? 1 : -1;
      svgEl('path', { d: `M${x0} ${y} Q ${(x0 + x1) / 2} ${y + s * hgt * 2} ${x1 - 4} ${y + s * 2}`, fill: 'none', stroke: PUR, 'stroke-width': 3 }, g1);
      svgEl('polygon', { points: `${x1 - 1},${y} ${x1 - 13},${y + s * 4} ${x1 - 6},${y + s * 13}`, fill: PUR }, g1);
      const t = svgEl('text', { x: (x0 + x1) / 2, y: y + s * hgt - (below ? -22 : 2), 'text-anchor': 'middle', class: 'u1l3-svgt', fill: PUR }, g1); t.textContent = label;
      return g1;
    };
    const vtag = (j, label, up) => { const g1 = svgEl('g', { opacity: 0 }, svg), x = tx + hw + nC * cw + 24 + (up ? 64 : 0), y0 = ty + ch / 2 - 10, y1 = ty + ch + ch / 2 + 10; svgEl('line', { x1: x, x2: x, y1: up ? y1 : y0, y2: up ? y0 + 8 : y1 - 8, stroke: RED, 'stroke-width': 2.5 }, g1); svgEl('polygon', { points: up ? `${x - 5},${y0 + 9} ${x + 5},${y0 + 9} ${x},${y0}` : `${x - 5},${y1 - 9} ${x + 5},${y1 - 9} ${x},${y1}`, fill: RED }, g1); const t = svgEl('text', { x: x + 8, y: ty + ch + 6, 'text-anchor': 'start', class: 'u1l3-svgt', fill: RED }, g1); t.textContent = label; void j; return g1; };
    const st = stamp(stage, 'same taste', { ok: true, x: tx + hw + nC * cw / 2, y: ty + 2 * ch + 40, size: 'sm' }); hide(st);
    if (k === 'n') {
      const a2 = arc(0, 1, '×2'), a3 = arc(0, 2, '×3', true);
      Object.assign(st.style, { left: (tx + hw + nC * cw + 90) + 'px', top: (ty + ch) + 'px' });
      return [
        { cap: `The instructions: <b>1</b> can of concentrate to <b>4</b> cans of water.`, run: async (c) => { drawCans(1, 4); await appear(c, pic, 300); } },
        { cap: `Double it: multiply <b>both</b> terms by 2. ${T('1:4=2:8')}.`, run: async (c) => { await appear(c, a2, 300); drawCans(2, 8); await fillCell(c, 0, 1); await fillCell(c, 1, 1); } },
        { cap: `Triple it: multiply both terms by 3. ${T('1:4=3:12')}.`, run: async (c) => { await appear(c, a3, 300); drawCans(3, 12); await fillCell(c, 0, 2); await fillCell(c, 1, 2); } },
        { cap: `${T('1:4=2:8=3:12')}: <b>equivalent ratios</b>. More lemonade, but the <b>same taste</b>.`, run: (c) => stampIn(c, st) }
      ];
    }
    const t4 = vtag(0, '×4'), ups = vtag(3, '÷4', true);
    return [
      { cap: `Fill in the blanks. The instructions: <b>1</b> can of concentrate to <b>4</b> cans of water.`, run: async (c) => { drawCans(1, 4); await appear(c, pic, 300); } },
      { cap: `In every column, the water is <b>4 ×</b> the concentrate.`, run: (c) => appear(c, t4, 300) },
      { cap: `Going down, multiply by 4: ${T('2\\times4=8')}, ${T('3\\times4=12')}, ${T('8\\times4=32')}.`, run: async (c) => { await fillCell(c, 1, 1); await fillCell(c, 1, 2); await fillCell(c, 1, 4); drawCans(8, 32); await pulse(c, pic, 1.03); } },
      { cap: `Going up, divide by 4: ${T('20\\div4=5')} cans of concentrate.`, run: async (c) => { await appear(c, ups, 300); await fillCell(c, 0, 3); drawCans(5, 20); } },
      { cap: `Every column simplifies to ${T('1:4')}: they are all <b>equivalent</b>.`, run: (c) => stampIn(c, st) }
    ];
  }
};

/* =============================== explainer: stronger or weaker? =============================== */
const TS = {
  e5b: { label: 'Example 5(b) check: Lucas, 6 : 20', who: 'Lucas', c: 6, w: 20 },
  n: { label: 'Mia: 2 cans to 10 cans', who: 'Mia', c: 2, w: 10 }
};
const LEM = '#f2c418', WAT = '#eef6fc';
const taste = {
  title: 'Same concentrate: who used more water?',
  height: 392, minW: 900,
  choices: Object.keys(TS).map((k) => ({ v: k, label: TS[k].label })),
  intro: (k) => `${TS[k].who} mixes ${TS[k].c} cans of concentrate with ${TS[k].w} cans of water. The can says 1 to 4. Same taste? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = TS[k], W = ex.W, g = gcd(d.c, d.w), need = d.c * 4, strong = d.w < need;
    const xs = [W * 0.27, W * 0.73];
    const heads = [hide(lab(stage, xs[0], 24, '<b>The instructions</b>', 'u1l3-ph')), lab(stage, xs[1], 24, `<b>${d.who}</b>`, 'u1l3-ph')];
    const rat = [hide(lab(stage, xs[0], 64, K(`1:4=${d.c}:${need}`), 'u1l3-mid')), lab(stage, xs[1], 64, K(`${d.c}:${d.w}`), 'u1l3-mid')];
    const simp = hide(lab(stage, xs[1], 104, `${K(`${d.c}:${d.w}=${d.c / g}:${d.w / g}`)} <b class="u1l3-no">≠ 1 : 4</b>`, 'u1l3-small'));
    const need1 = hide(lab(stage, xs[0], 104, `${K(`${d.c}\\times4=${need}`)} cans of water`, 'u1l3-small'));
    const svg = svgBox(stage, 0, 124, W, 268);
    const tot = [d.c + need, d.c + d.w], maxT = Math.max(...tot), JH = 210, JW = 150;
    const t = (c1, w1) => Math.max(0, Math.min(1, (c1 / (c1 + w1) - 0.12) / 0.14));
    const cols = [mix(WAT, LEM, t(d.c, need)), mix(WAT, LEM, t(d.c, d.w))];
    const jugs = xs.map((x, i) => {
      const g1 = svgEl('g', { opacity: i ? 1 : 0 }, svg), X = x - JW / 2, Y = 24;
      svgEl('rect', { x: X, y: Y, width: JW, height: JH, rx: 12, fill: '#fff', stroke: '#4a6b80', 'stroke-width': 4.5 }, g1);
      const lv = (tot[i] / maxT) * (JH - 14), liq = svgEl('rect', { x: X + 4, y: Y + JH - 4, width: JW - 8, height: 0, rx: 8, fill: cols[i] }, g1);
      const tl = svgEl('text', { x, y: Y + JH + 26, 'text-anchor': 'middle', class: 'u1l3-svgt', fill: INK, opacity: 0 }, g1); tl.textContent = `${d.c} + ${i ? d.w : need} = ${tot[i]} cans`;
      return { g: g1, liq, lv, Y, tl };
    });
    const st = stamp(stage, strong ? 'STRONGER' : 'WEAKER', { ok: null, x: xs[1] + 40, y: 230, size: 'lg', rotate: -12 }); hide(st);
    const fillJ = (c, j) => tween(c, 1100, (u) => { j.liq.setAttribute('y', j.Y + 210 - 4 - j.lv * u); j.liq.setAttribute('height', j.lv * u); });
    return [
      { cap: `${d.who}: ${T(`${d.c}:${d.w}`)}. Simplify (÷${g}): ${T(`${d.c / g}:${d.w / g}`)}. That is not ${T('1:4')}, so it is <b>not the same</b>.`, run: async (c) => { await show(c, simp); } },
      { cap: `Scale the instructions to the <b>same</b> concentrate, ${d.c} cans: ${T(`${d.c}\\times4=${need}`)} cans of water.`, run: async (c) => { await Promise.all([show(c, heads[0]), show(c, rat[0])]); await show(c, need1); } },
      { cap: `Fill both jugs. Same concentrate in each: ${d.c} cans.`, run: async (c) => { await appear(c, jugs[0].g, 250); await Promise.all(jugs.map((j) => fillJ(c, j))); await Promise.all(jugs.map((j) => appear(c, j.tl, 250))); } },
      { cap: strong ? `${d.who} used <b>less water</b> (${d.w} < ${need}) for the same concentrate, so ${d.who}’s lemonade is <b>stronger</b>.` : `${d.who} used <b>more water</b> (${d.w} > ${need}) for the same concentrate, so ${d.who}’s lemonade is <b>weaker</b>.`, run: (c) => stampIn(c, st) }
    ];
  }
};

/* =============================== explainer: concrete in buckets =============================== */
const MAT = [['cement', '#a9adb6'], ['sand', '#e6c77f'], ['gravel', '#8a7562']];
const CR = {
  n: { label: 'Notes: 1 : 2 : 3 doubled', m: 2 },
  a: { label: 'Example 6 check: (a) 4 buckets of cement', m: 4, given: 0 },
  b: { label: '(b) 15 buckets of gravel', m: 5, given: 2 },
  cd: { label: '(c) and (d): the whole mix', m: 5, whole: true }
};
const concrete = {
  title: 'Cement, sand and gravel: 1 : 2 : 3',
  height: 396, minW: 900,
  choices: Object.keys(CR).map((k) => ({ v: k, label: CR[k].label })),
  intro: (k) => ({ n: 'Make twice the recipe 1 : 2 : 3. Press <b>Next</b>.', a: 'Marco uses 4 buckets of cement. How much sand and gravel? Press <b>Next</b>.', b: 'Marco has only 15 buckets of gravel. How much cement and sand? Press <b>Next</b>.', cd: '(c) Cement to the whole mix? (d) How many buckets does (b) make? Press <b>Next</b>.' }[k]),
  make(stage, k, ex) {
    const d = CR[k], W = ex.W, m = d.m, colW = 180, x0 = 30, base = 290, bs = 38, per = 4;
    const xC = (i) => x0 + i * colW + colW / 2;
    MAT.forEach(([nm], i) => lab(stage, xC(i), base + 38, `<b>${nm}</b>`, 'u1l3-small'));
    const counts = MAT.map((_, i) => hide(lab(stage, xC(i), base + 72, '', 'u1l3-cnt2')));
    const buckets = MAT.map(() => []);
    const spot = (i, j) => [xC(i) - (per * bs) / 2 + (j % per) * bs + bs / 2, base - Math.floor(j / per) * (bs + 2)];
    const addB = (i, j) => { const [x, y] = spot(i, j), e = absEl(stage, x, y, BUCKET(MAT[i][1]), 'u1l3-bkt'); hide(e); buckets[i].push(e); return e; };
    for (let i = 0; i < 3; i++) for (let j = 0; j < (i + 1) * m; j++) addB(i, j);
    const setCount = (i, v) => { counts[i].innerHTML = K(String(v)); };
    const rx = x0 + 3 * colW + 30, rc = (rx + W) / 2;
    const r1 = hide(lab(stage, rc, 40, K('1:2:3'), 'u1l3-mid'));
    const mul = hide(lab(stage, rc, 100, K(`\\times${m}\\ \\text{every term}`), 'u1l3-ph u1l3-pur'));
    const r2 = hide(lab(stage, rc, 165, K(`${m}:${2 * m}:${3 * m}`), 'u1l3-mid'));
    const showRecipe = async (c) => { for (let i = 0; i < 3; i++) { for (let j = 0; j <= i; j++) await pop(c, buckets[i][j], 260); setCount(i, i + 1); await appear(c, counts[i], 200); } await show(c, r1); };
    const scaleUp = async (c) => { for (let i = 0; i < 3; i++) { for (let j = i + 1; j < buckets[i].length; j++) await pop(c, buckets[i][j], 140); setCount(i, (i + 1) * m); await pulse(c, counts[i], 1.15); } await show(c, r2); };
    if (d.whole) {
      const br = svgBox(stage, 0, 0, W, 396), bx0 = xC(0) - 80, bx1 = xC(2) + 80;
      const bracket = svgEl('g', { opacity: 0 }, br); svgEl('path', { d: `M${bx0} 40 V28 H${bx1} V40`, fill: 'none', stroke: PUR, 'stroke-width': 3.5 }, bracket);
      const bt = svgEl('text', { x: (bx0 + bx1) / 2, y: 20, 'text-anchor': 'middle', class: 'u1l3-svgt', fill: PUR }, bracket); bt.textContent = 'the whole mix: 1 + 2 + 3 = 6 parts';
      const pw = hide(lab(stage, rc, 102, `${K(`\\text{cement : whole}=\\color{${RED}}{\\boldsymbol{1:6}}`)}<div class="u1l3-tag pw">part-to-whole</div>`, 'u1l3-small'));
      // the mixer
      const mx = rc, my = 280, mixer = svgEl('g', { opacity: 0 }, br);
      svgEl('path', { d: `M${mx - 70} ${my + 70} L${mx - 50} ${my + 40} M${mx + 70} ${my + 70} L${mx + 50} ${my + 40}`, stroke: '#3a4254', 'stroke-width': 5 }, mixer);
      const drum = svgEl('g', {}, mixer); drum.style.transformBox = 'view-box'; drum.style.transformOrigin = `${mx}px ${my}px`;
      svgEl('ellipse', { cx: mx, cy: my, rx: 70, ry: 48, fill: '#e8862a', stroke: '#3a4254', 'stroke-width': 4 }, drum);
      for (let i = 0; i < 4; i++) svgEl('line', { x1: mx - 60 + i * 34, y1: my - 30, x2: mx - 40 + i * 34, y2: my + 30, stroke: '#b5651d', 'stroke-width': 5 }, drum);
      const cnt = svgEl('text', { x: mx, y: my - 64, 'text-anchor': 'middle', class: 'u1l3-svgbig', fill: RED, opacity: 0 }, mixer); cnt.textContent = '0 buckets';
      // (d) uses the batch from (b): ×5, so the buckets are made already; show 1, 2, 3 first
      return [
        { cap: `The recipe: <b>1</b> bucket of cement, <b>2</b> of sand, <b>3</b> of gravel.`, run: (c) => showRecipe(c) },
        { cap: `(c) The <b>whole</b> mix is all the parts: ${T('1+2+3=6')} parts.`, run: (c) => appear(c, bracket, 350) },
        { cap: `Cement to the whole mix: ${T('1:6')}. That is a <b>part-to-whole</b> ratio.`, run: (c) => show(c, pw) },
        { cap: `(d) The batch in (b) is the recipe ${T('\\times5')}: ${T('5:10:15')}.`, run: (c) => scaleUp(c) },
        { cap: `Pour it all into the mixer: ${T('5+10+15=30')} buckets of mix.`, run: async (c) => {
          await appear(c, mixer, 300); await appear(c, cnt, 200);
          const all = buckets.flat(); let done = 0;
          await Promise.all(all.map((e, i) => moveTo(c, e, mx, my, 520, { delay: i * 45 }).then(() => { e.style.opacity = 0; done++; cnt.textContent = done + (done === 1 ? ' bucket' : ' buckets'); })));
          counts.forEach((e) => (e.style.opacity = 0.35));
          cnt.textContent = '30 buckets';
          await tween(c, 1200, (u) => { drum.style.transform = `rotate(${u * 360}deg)`; });
        } }
      ];
    }
    const giv = d.given;
    return [
      { cap: `The recipe: <b>1</b> bucket of cement, <b>2</b> of sand, <b>3</b> of gravel.`, run: (c) => showRecipe(c) },
      { cap: giv === 0 ? `4 buckets of cement is <b>4 times</b> the recipe. Multiply <b>every</b> term by 4.` : giv === 2 ? `Gravel is the 3: ${T('3\\times5=15')}. So this is <b>5 times</b> the recipe. Multiply <b>every</b> term by 5.` : `Twice the recipe: multiply <b>every</b> term by 2.`, run: (c) => pop(c, mul) },
      { cap: `${T(`1:2:3=${m}:${2 * m}:${3 * m}`)}.`, run: (c) => scaleUp(c) },
      { cap: giv === 0 ? `Marco needs <b>8 buckets of sand</b> and <b>12 buckets of gravel</b>.` : giv === 2 ? `<b>5 buckets of cement</b> and <b>10 buckets of sand</b> go with the 15 of gravel.` : `${T('2:4:6')} makes twice as much concrete, with the same mix.`, run: async (c) => { const hi = giv === 0 ? [1, 2] : giv === 2 ? [0, 1] : [0, 1, 2]; for (const i of hi) { counts[i].classList.add('red'); await pulse(c, counts[i], 1.25); } } }
    ];
  }
};

/* =============================== explainer: sharing in a ratio =============================== */
const SH = {
  n: { label: 'Notes: $50 in 2 : 3', total: 50, A: 2, B: 3, names: ['Ana', 'Ben'] },
  a: { label: 'Example 7 check: (a)', total: 120, A: 3, B: 5, names: ['Jaya', 'Owen'] },
  b: { label: '(b)', total: 187.5, raw: [6, 9], A: 2, B: 3, names: ['Ellie', 'Ravi'], cents: true },
  e8: { label: 'Example 8 check', total: 4.5, A: 1, B: 5, names: ['concentrate', 'water'], liquid: true }
};
const share = {
  title: 'Split it into equal parts, then deal them out',
  height: 400, minW: 900,
  choices: Object.keys(SH).map((k) => ({ v: k, label: SH[k].label })),
  intro: (k) => { const d = SH[k]; return d.liquid ? 'Washer fluid: 1 part concentrate to 5 parts water. Fill a 4.5 L jug. Press <b>Next</b>.' : `Share ${money(d.total, d.cents).replace('\\$', '$')} in the ratio ${T(d.raw ? `${d.raw[0]}:${d.raw[1]}` : `${d.A}:${d.B}`)} (${d.names[0]} : ${d.names[1]}). Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = SH[k], W = ex.W, n = d.A + d.B, one = d.total / n, sA = d.A * one, sB = d.B * one;
    const V = (v) => (d.liquid ? `${dec(v)}\\text{ L}` : money(v, d.cents)), Vh = (v) => (d.liquid ? `${dec(v)} L` : '$' + (d.cents || Math.round(v) !== v ? v.toFixed(2) : v));
    const tokHTML = (fill) => (d.liquid ? BEAKER(fill) : COINS());
    // the total, top centre
    const pile = absEl(stage, W / 2, 46, d.liquid ? `<svg viewBox="0 0 90 80" aria-hidden="true"><path d="M14 8 H76 V66 Q76 76 66 76 H24 Q14 76 14 66 Z" fill="#fff" stroke="#1c2230" stroke-width="3"/><path d="M16 22 H74 V66 Q74 74 66 74 H24 Q16 74 16 66 Z" fill="#9fc8ea"/></svg>` : `<svg viewBox="0 0 120 80" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${30 + (i % 3) * 30}" cy="${66 - Math.floor(i / 3) * 14}" rx="24" ry="9" fill="#e3ad32" stroke="#8a5a14" stroke-width="2"/>`).join('')}<rect x="38" y="10" width="44" height="36" rx="6" fill="#4f9a5f" stroke="#2c5e37" stroke-width="2"/><text x="60" y="35" font-size="16" font-weight="800" fill="#fff" text-anchor="middle">$</text></svg>`, 'u1l3-pile');
    const pileLab = lab(stage, W / 2 + 92, 46, `<b>${Vh(d.total)}</b>`, 'u1l3-mid');
    let ratLab = null;
    if (d.raw) ratLab = hide(lab(stage, 150, 46, `hours ${K(`${d.raw[0]}:${d.raw[1]}=${d.A}:${d.B}`)}`, 'u1l3-ph'));
    // the parts row
    const sp = Math.min(96, (W - 120) / n), rx0 = W / 2 - (sp * (n - 1)) / 2, ry = 160;
    const slots = Array.from({ length: n }, (_, i) => { const e = absEl(stage, rx0 + i * sp, ry, `<b>${i + 1}</b>`, 'u1l3-slot'); hide(e); return e; });
    const toks = Array.from({ length: n }, (_, i) => { const e = absEl(stage, rx0 + i * sp, ry, tokHTML('#cfe2f3'), 'u1l3-tok'); hide(e); return e; });
    const tlabs = Array.from({ length: n }, (_, i) => hide(lab(stage, rx0 + i * sp, ry + 44, K(V(one)), 'u1l3-tlab')));
    // the two people
    const zx = [W * 0.25, W * 0.75], zy = 300;
    const zones = d.names.map((nm, i) => { const e = absEl(stage, zx[i], zy, `<div class="u1l3-zn" style="color:${i ? BLUE : AMB}">${nm}${d.liquid ? '' : ''}</div>`, 'u1l3-zone ' + (i ? 'zb' : 'za')); return e; });
    const zsum = [hide(lab(stage, zx[0], zy + 74, K(`${d.A}\\times${V(one)}=\\color{${RED}}{\\boldsymbol{${V(sA)}}}`), 'u1l3-zsum')), hide(lab(stage, zx[1], zy + 74, K(`${d.B}\\times${V(one)}=\\color{${RED}}{\\boldsymbol{${V(sB)}}}`), 'u1l3-zsum'))];
    const dealSp = 56;
    const deal = async (c, from, cnt, zi) => {
      const mv = [];
      for (let j = 0; j < cnt; j++) {
        const i = from + j, x = zx[zi] - (dealSp * (cnt - 1)) / 2 + j * dealSp, y = zy + 18;
        if (d.liquid) { const p = toks[i].querySelector('.u1l3-liq'); if (p) p.setAttribute('fill', zi ? '#cfe6f7' : '#2f7fd0'); }
        mv.push(moveTo(c, toks[i], x, y, 650, { delay: j * 90 }), anim(c, tlabs[i], [{ opacity: 1 }, { opacity: 0 }], 250));
      }
      await Promise.all(mv);
    };
    const st = stamp(stage, '✓', { ok: true, x: W / 2 + 170, y: ry }); hide(st);
    const chk = hide(lab(stage, W / 2 - 30, ry, K(`${V(sA)}+${V(sB)}=${V(d.total)}`), 'u1l3-eq'));
    const steps = [];
    if (d.raw) steps.push({ cap: `They share in the ratio of the hours, ${T(`${d.raw[0]}:${d.raw[1]}`)}. Simplify first (÷3): ${T(`${d.A}:${d.B}`)}.`, run: (c) => show(c, ratLab) });
    steps.push(
      { cap: `<b>Step 1.</b> Add the terms: ${T(`${d.A}+${d.B}=${n}`)} parts.`, run: async (c) => { await Promise.all(slots.map((e, i) => pop(c, e, 300, { delay: i * 70 }))); } },
      { cap: `<b>Step 2.</b> One part ${T(`=${V(d.total)}\\div${n}=${V(one)}`)}.`, run: async (c) => {
        await anim(c, pile, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0.25, transform: 'scale(.85)' }], 400);
        await Promise.all(toks.map((e, i) => pop(c, e, 320, { delay: i * 70 }))); await Promise.all(tlabs.map((e) => appear(c, e, 250)));
      } },
      { cap: `<b>Step 3.</b> ${d.liquid ? 'Concentrate' : d.names[0]} gets <b>${d.A}</b> part${d.A > 1 ? 's' : ''}: ${T(`${d.A}\\times${V(one)}=${V(sA)}`)}.`, run: async (c) => { await deal(c, 0, d.A, 0); await pop(c, zsum[0]); } },
      { cap: `${d.liquid ? 'Water' : d.names[1]} gets <b>${d.B}</b> parts: ${T(`${d.B}\\times${V(one)}=${V(sB)}`)}.`, run: async (c) => { await deal(c, d.A, d.B, 1); await pop(c, zsum[1]); } },
      { cap: `<b>Step 4.</b> Check: ${T(`${V(sA)}+${V(sB)}=${V(d.total)}`)} ✓${d.liquid ? ' Nadia needs 0.75 L (750 mL) of concentrate and 3.75 L of water.' : ''}`, run: async (c) => { await Promise.all(slots.map((e) => anim(c, e, [{ opacity: 1 }, { opacity: 0 }], 250))); await show(c, chk); await stampIn(c, st); } }
    );
    void zones; void pileLab;
    return steps;
  }
};

/* =============================== explainer: why not divide by 3? (Full notes) =============================== */
const WR = { a: { label: 'Example 7(a): $120 in 3 : 5', total: 120, A: 3, B: 5, names: ['Jaya', 'Owen'] }, n: { label: '$60 in 1 : 2', total: 60, A: 1, B: 2, names: ['Kim', 'Lee'] } };
const wrong = {
  title: 'Which number do we divide by?',
  height: 360, minW: 900,
  choices: Object.keys(WR).map((k) => ({ v: k, label: WR[k].label })),
  intro: (k) => `Share $${WR[k].total} in the ratio ${T(`${WR[k].A}:${WR[k].B}`)} (${WR[k].names[0]} : ${WR[k].names[1]}). Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = WR[k], W = ex.W, tries = [d.A, d.B, d.A + d.B], cw = (W - 40) / 3;
    const cols = tries.map((dv, i) => {
      const one = d.total / dv, a = d.A * one, b = d.B * one, ok = Math.abs(a + b - d.total) < 1e-9;
      const el = absEl(stage, 20 + i * cw + 8, 10, `<div class="u1l3-wh">${i === 2 ? `Divide by ${T(`${d.A}+${d.B}=${dv}`)}` : `Divide by ${dv}?`}</div>
        <div>one part ${K(`\\$${d.total}\\div${dv}=\\$${dec(one)}`)}</div>
        <div>${d.names[0]} ${K(`${d.A}\\times\\$${dec(one)}=\\$${dec(a)}`)}</div>
        <div>${d.names[1]} ${K(`${d.B}\\times\\$${dec(one)}=\\$${dec(b)}`)}</div>
        <div class="u1l3-wt ${ok ? 'ok' : 'no'}">total ${K(`\\$${dec(a + b)}`)}</div>`, 'u1l3-wcol');
      el.style.width = (cw - 16) + 'px'; hide(el);
      const s = stamp(stage, ok ? '✓' : '✗', { ok, x: 20 + i * cw + cw / 2, y: 300 }); hide(s);
      return { el, s, one, a, b, ok };
    });
    const [c1, c2, c3] = cols;
    return [
      { cap: `Divide by ${d.A}? One part is $${dec(c1.one)}. ${d.names[0]} gets $${dec(c1.a)} and ${d.names[1]} gets $${dec(c1.b)}.`, run: (c) => show(c, c1.el) },
      { cap: `That adds up to $${dec(c1.a + c1.b)}, but they only earned $${d.total}!`, run: (c) => stampIn(c, c1.s) },
      { cap: `Divide by ${d.B}? The shares add up to $${dec(c2.a + c2.b)}. Too much again.`, run: async (c) => { await show(c, c2.el); await stampIn(c, c2.s); } },
      { cap: `Divide by the <b>total number of parts</b>, ${d.A} + ${d.B} = ${d.A + d.B}. The shares add up to exactly $${d.total}.`, run: async (c) => { await show(c, c3.el); await stampIn(c, c3.s); } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations; new numbers every time) ============ */
(() => {
  const AVOID = new Set(['12:18', '40:15', '4:12', '24:24', '6:9', '20:5', '16:24', '18:18', '35:14', '48:60', '8:5', '5:8', '7:13', '13:9', '48:80', '48:128', '4:6', '8:12', '10:15', '12:16', '5:2', '8:3', '36:60']);
  const AVOIDD = new Set(['2.5:4', '0.75:1.5', '1.5:3.5', '0.4:1.2', '2.25:0.75', '4.8:3.6', '1:0.75', '0.5:2']);
  const AVOIDU = new Set(['45 min:2 h', '250 g:1.5 kg', '30 min:1 h', '600 mL:2 L', '75 cm:3 m', '750 g:2 kg', '20 s:2 min', '40 min:1 h', '1 h:20 min', '45 min:2.5 h', '3 h:90 min']);
  const coprime = (r, lo, hi) => { for (;;) { const p = r.int(lo, hi), q = r.int(lo, hi); if (p !== q && gcd(p, q) === 1) return [p, q]; } };
  function beg(r) {
    for (;;) {
      const [p, q] = coprime(r, 1, 9), k = r.int(2, 12), a = p * k, b = q * k;
      if (a > 99 || b > 99 || AVOID.has(`${a}:${b}`)) continue;
      return { text: 'Write the ratio in simplest form.', q: `${a}:${b}`, a: [`\\text{GCF}=${k}`, `${a}\\div${k}:${b}\\div${k}`, `=${p}:${q}`] };
    }
  }
  function prg(r) {
    for (;;) {
      const [p, q] = coprime(r, 1, 9), hund = r.chance(0.3), m = hund ? 100 : 10;
      const k = hund ? r.pick([5, 15, 25, 35, 45]) : r.int(2, 9), a = p * k, b = q * k;
      const A = dec(a / m), B = dec(b / m), key = `${A}:${B}`;
      if (AVOIDD.has(key) || (Number.isInteger(a / m) && Number.isInteger(b / m))) continue;
      if (hund && !(/\.\d\d$/.test(A) || /\.\d\d$/.test(B))) continue;
      if (!hund && (/\.\d\d/.test(A) || /\.\d\d/.test(B))) continue;
      const g = gcd(a, b);
      return { text: 'Write the ratio in simplest form, using whole numbers.', q: `${A}:${B}`, a: [`\\times${m}:\\ ${a}:${b}`, `\\div${g}:\\ ${a / g}:${b / g}`] };
    }
  }
  const U = [['min', 'h', 60, 5, [1, 1.5, 2, 2.5, 3, 4]], ['s', 'min', 60, 5, [1, 2, 3, 4, 5]], ['g', 'kg', 1000, 50, [1, 1.5, 2, 2.5, 3, 4]], ['mL', 'L', 1000, 50, [1, 1.5, 2, 3, 4]], ['cm', 'm', 100, 5, [1, 2, 3, 4, 5]]];
  function mas(r) {
    for (;;) {
      const [su, bu, f, stp, Bs] = r.pick(U), B = r.pick(Bs), Bv = B * f, S = stp * r.int(1, Math.floor((f * 0.95) / stp));
      const g = gcd(S, Bv), p = S / g, q = Bv / g; if (p > 15 || q > 20 || p === q) continue;
      const smallFirst = r.chance(0.6), key = smallFirst ? `${S} ${su}:${B} ${bu}` : `${B} ${bu}:${S} ${su}`;
      if (AVOIDU.has(key)) continue;
      const tS = `${S}\\text{ ${su}}`, tB = `${B}\\text{ ${bu}}`;
      return { text: 'Change to the same unit, then write the ratio in simplest form.', q: smallFirst ? `${tS}:${tB}` : `${tB}:${tS}`,
        a: [`${tB}=${B}\\times${tn(f)}=${tn(Bv)}\\text{ ${su}}`, smallFirst ? `${S}:${tn(Bv)}` : `${tn(Bv)}:${S}`, `\\div${g}:\\ ${smallFirst ? `${p}:${q}` : `${q}:${p}`}`] };
    }
  }
  standup('u1l3', {
    intro: 'At your whiteboard station: write each ratio in simplest form. Decimals: multiply first. Different units: change to the same unit first.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== Math History: Vitruvius's mortar =============================== */
function mortarAnim() {
  const svg = document.getElementById('u1l3-hist'); if (!svg) return;
  const NSs = 'http://www.w3.org/2000/svg';
  const E = (tag, at, par) => { const e = document.createElementNS(NSs, tag); for (const k in at) e.setAttribute(k, at[k]); (par || svg).appendChild(e); return e; };
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  function build() {
    timers.forEach(clearTimeout); timers = []; svg.innerHTML = '';
    E('rect', { x: 0, y: 0, width: 600, height: 300, fill: '#fffaf1' });
    const tt = E('text', { x: 300, y: 34, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 22, fill: '#4a2c14' }); tt.textContent = 'Mortar: 3 parts pit sand to 1 part lime';
    // the trough
    E('path', { d: 'M170 210 L190 272 H410 L430 210 Z', fill: '#c9a27a', stroke: '#4a2c14', 'stroke-width': 4, 'stroke-linejoin': 'round' });
    const fillR = E('rect', { x: 186, y: 262, width: 228, height: 0, fill: '#d8c3a0' });
    E('path', { d: 'M170 210 L190 272 H410 L430 210', fill: 'none', stroke: '#4a2c14', 'stroke-width': 4, 'stroke-linejoin': 'round' });
    // the piles
    E('path', { d: 'M20 270 Q70 190 130 270 Z', fill: '#e2c070', stroke: '#7a4a26', 'stroke-width': 2.5 });
    const sl = E('text', { x: 75, y: 292, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#7a4a26' }); sl.textContent = 'sand';
    E('path', { d: 'M470 270 Q525 200 580 270 Z', fill: '#f4f1ea', stroke: '#7a4a26', 'stroke-width': 2.5 });
    const ll = E('text', { x: 525, y: 292, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: '#7a4a26' }); ll.textContent = 'lime';
    // the tally
    const tally = E('text', { x: 300, y: 84, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 30, fill: '#4a2c14' }); tally.textContent = 'sand 0 : lime 0';
    const note = E('text', { x: 300, y: 118, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: '#b07a12', opacity: 0 });
    return { fillR, tally, note };
  }
  function basket(fill, fromX) {
    const g = E('g', {}); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
    E('path', { d: 'M-26 -14 H26 L20 14 H-20 Z', fill: '#b5833e', stroke: '#4a2c14', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 0, cy: -14, rx: 26, ry: 6, fill, stroke: '#4a2c14', 'stroke-width': 2 }, g);
    for (let i = -16; i <= 16; i += 8) E('line', { x1: i, y1: -10, x2: i * 0.8, y2: 12, stroke: '#7a4a26', 'stroke-width': 1.5 }, g);
    g.style.transform = `translate(${fromX}px, 230px)`;
    return g;
  }
  function play() {
    const { fillR, tally, note } = build();
    const seq = ['s', 's', 's', 'l', 's', 's', 's', 'l'];
    let ns = 0, nl = 0;
    const setTally = () => { tally.textContent = `sand ${ns} : lime ${nl}`; };
    if (reduce) { ns = 6; nl = 2; setTally(); fillR.setAttribute('y', 222); fillR.setAttribute('height', 40); note.textContent = '6 : 2 is the same as 3 : 1'; note.setAttribute('opacity', 1); return; }
    seq.forEach((m, i) => {
      later(400 + i * 1100, () => {
        const sand = m === 's', fx = sand ? 75 : 525, b = basket(sand ? '#e2c070' : '#f4f1ea', fx);
        const a = b.animate([{ transform: `translate(${fx}px, 230px)` }, { transform: `translate(${(fx + 300) / 2}px, 140px)`, offset: 0.4 }, { transform: 'translate(300px, 175px) rotate(0deg)', offset: 0.65 }, { transform: 'translate(300px, 175px) rotate(' + (sand ? 70 : -70) + 'deg)', offset: 0.85 }, { transform: 'translate(300px, 175px) rotate(' + (sand ? 70 : -70) + 'deg)', opacity: 0 }], { duration: 1000, fill: 'forwards' });
        a.onfinish = () => b.remove();
        later(850, () => { if (sand) ns++; else nl++; setTally(); const hgt = 5 * (ns + nl); fillR.setAttribute('y', 262 - hgt); fillR.setAttribute('height', hgt); tally.animate([{ opacity: 0.4 }, { opacity: 1 }], 300); });
      });
    });
    later(400 + 4 * 1100, () => { note.textContent = '3 : 1'; note.animate([{ opacity: 0 }, { opacity: 1 }], 400); note.setAttribute('opacity', 1); });
    later(400 + 8 * 1100, () => { note.textContent = '6 : 2 is the same as 3 : 1'; note.animate([{ opacity: 0 }, { opacity: 1 }], 400); });
  }
  const fig = svg.closest('figure');
  svg.addEventListener('click', play);
  const btn = fig && fig.querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  build();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
}

mortarAnim();
export const explainers = mountExplainers({ fish, groups, ladder, blocks, jug, table, taste, concrete, share, wrong });
void sleep; void GRN;
