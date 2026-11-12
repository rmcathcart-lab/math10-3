/* Math 10-3 · Unit 3 · Lesson 6 — Perimeter and Circumference.
 * Card figures: the example diagrams (triangle, lot, hexagon, L shapes, circle parts, rug, window, skating path, dog run).
 * Explainers: walk around a polygon and add (Example 1), a fence around a rectangular yard (Example 2), missing sides of an
 * L shape and the push-out shortcut (Examples 3 and 4), a wheel rolling out its circumference (Example 5), why C ÷ d is
 * always about 3.14 (Full notes), Nadia's bike (Example 6), half circles (Example 7) and fencing and baseboard costs
 * (Examples 8 and 9). Then the Eratosthenes history animation and the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const fx = (v, d = 2) => rnd(v, d).toFixed(d);
const cbox = (cls, html) => h('div', cls + ' u3l6-c', `<div>${html}</div>`);
const lcd = (stage, e, r, x, y, w = 270) => hide(add(stage, box(h('div', 'u3l6-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`), w, 66), x, y));
const mkSvg = (stage, w, hh, x, y) => add(stage, svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u3l6-svg' }), x, y);
const txt = (svg, x, y, s, a = {}) => { const e = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#1c2230' }, a), svg); e.textContent = s; return e; };
const ok = (host, s, x, y, o = {}) => hide(stamp(host, s, Object.assign({ x, y, size: 'sm' }, o)));
const RED = '#c93a33', BLUE = '#1f5bd6', BROWN = '#8a5a0a', INK = '#1c2230';
const line = (stage, html, x, y, w, cls = 'u3l6-eline') => hide(add(stage, box(cbox(cls, html), w, 46), x, y));
const res = (stage, html, x, y, w) => hide(add(stage, box(cbox('u3l6-res', html), w, 54), x, y));
/* draw a stroke in: pathLength 100 + dash offset */
const drawIn = (c, el, ms = 800) => { el.setAttribute('pathLength', 100); el.style.strokeDasharray = '100'; el.style.strokeDashoffset = '100'; el.style.opacity = 1; return tween(c, ms, (t) => { el.style.strokeDashoffset = String(100 - 100 * t); }); };
const undraw = (el) => { el.setAttribute('pathLength', 100); el.style.strokeDasharray = '100'; el.style.strokeDashoffset = '100'; };

/* =====================================================================================
 * Card figures (static SVG)
 * ===================================================================================== */
const FIG = {
  tri: { vb: '-10 0 290 170', svg: `<path d="M20 135 L228 135 L92.8 33.6 Z" class="sh"/><text x="124" y="160">8 cm</text><text x="48" y="80" text-anchor="end">48 mm</text><text x="168" y="80" text-anchor="start">6.5 cm</text>` },
  lot: { vb: '-30 0 340 215', svg: `<path d="M40 180 L210 180 L237 78 L125 24 L20 85 Z" class="sh"/><text x="125" y="204">14.2 m</text><text x="232" y="136" text-anchor="start">9.5 m</text><text x="188" y="44" text-anchor="start">11.8 m</text><text x="66" y="44" text-anchor="end">10.3 m</text><text x="24" y="140" text-anchor="end">7.6 m</text>` },
  hex: { vb: '0 0 260 190', svg: (() => { const p = [], tk = []; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; p.push(`${130 + 72 * Math.cos(a)} ${90 - 72 * Math.sin(a)}`); const m = a + Math.PI / 6, mx = 130 + 62.4 * Math.cos(m), my = 90 - 62.4 * Math.sin(m); tk.push(`<line x1="${mx - 7 * Math.cos(m)}" y1="${my + 7 * Math.sin(m)}" x2="${mx + 7 * Math.cos(m)}" y2="${my - 7 * Math.sin(m)}" stroke="#1c2230" stroke-width="2.5"/>`); } return `<path d="M${p.join(' L')} Z" class="sh"/>${tk.join('')}<text x="130" y="182">2¾ in</text>`; })() },
  rosa: { vb: '-20 0 360 245', svg: `<path d="M40 210 L290 210 L290 137 L147 137 L147 23 L40 23 Z" class="sh"/><path d="M40 196 H54 V210" class="ra"/><text x="165" y="234">9.6 m</text><text x="298" y="180" text-anchor="start">2.8 m</text><text x="218" y="128" class="var">a</text><text x="156" y="86" text-anchor="start" class="var">b</text><text x="93" y="15">4.1 m</text><text x="32" y="122" text-anchor="end">7.2 m</text>` },
  tyler: { vb: '-50 0 410 262', svg: `<path d="M40 230 L292 230 L292 134 L142 134 L142 26 L40 26 Z" class="sh"/><path d="M40 216 H54 V230" class="ra"/><text x="166" y="254">60 in</text><text x="300" y="188" text-anchor="start">22¾ in</text><text x="217" y="124" class="var">?</text><text x="152" y="86" text-anchor="start" class="var">?</text><text x="91" y="18">24¼ in</text><text x="32" y="134" text-anchor="end">48½ in</text>` },
  circle: { vb: '0 0 250 230', svg: `<circle cx="115" cy="112" r="88" class="sh"/><circle cx="115" cy="112" r="4" fill="#1c2230"/><line x1="27" y1="112" x2="203" y2="112" stroke="#1f5bd6" stroke-width="3"/><line x1="115" y1="112" x2="165.5" y2="39.9" stroke="#c93a33" stroke-width="3"/><text x="70" y="136" fill="#1f5bd6" class="var">d</text><text x="152" y="86" fill="#c93a33" class="var">r</text><text x="122" y="132" text-anchor="start" font-size="14">centre</text><path d="M174 177 A96 96 0 0 0 206 140" fill="none" stroke="#12805a" stroke-width="3" marker-end="url(#u3l6-ah)"/><text x="214" y="182" fill="#12805a" class="var">C</text><defs><marker id="u3l6-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#12805a"/></marker></defs>` },
  rug: { vb: '0 0 240 175', svg: `<path d="M40 130 L200 130 A80 80 0 0 0 40 130 Z" class="sh"/><text x="120" y="156">4 ft</text>` },
  window: { vb: '0 0 260 255', svg: `<path d="M177 64 L177 220 L60 220 L60 64 A58.5 58.5 0 0 1 177 64" class="sh"/><line x1="60" y1="64" x2="177" y2="64" stroke="#8a8478" stroke-width="2" stroke-dasharray="6 5"/><text x="118" y="244">90 cm</text><text x="185" y="146" text-anchor="start">120 cm</text><text x="52" y="146" text-anchor="end">120 cm</text>` },
  path: { vb: '0 0 370 170', svg: `<path d="M55 130 L255 130 A45 45 0 0 0 255 40 L55 40 A45 45 0 0 0 55 130 Z" class="sh"/><line x1="55" y1="40" x2="55" y2="130" stroke="#8a8478" stroke-width="2" stroke-dasharray="6 5"/><line x1="255" y1="40" x2="255" y2="130" stroke="#8a8478" stroke-width="2" stroke-dasharray="6 5"/><text x="155" y="156">40 m</text><path d="M318 42 V128 M312 48 L318 40 L324 48 M312 122 L318 130 L324 122" stroke="#1c2230" stroke-width="2" fill="none"/><text x="328" y="91" text-anchor="start">18 m</text>` },
  dogrun: { vb: '0 0 290 185', svg: `<rect x="20" y="20" width="209" height="132" fill="#e3f1d8"/><path d="M97 152 L20 152 L20 20 L229 20 L229 152 L123 152" fill="none" stroke="#8a5a0a" stroke-width="4"/><line x1="97" y1="152" x2="123" y2="152" stroke="#8a8478" stroke-width="3" stroke-dasharray="3 4"/><text x="110" y="174" font-size="15">gate</text><text x="124" y="14">9.5 m</text><text x="236" y="92" text-anchor="start">6 m</text>` }
};
function figs() {
  document.querySelectorAll('.u3l6-fig[data-fig]').forEach((el) => {
    const f = FIG[el.dataset.fig]; if (!f) return;
    el.innerHTML = `<svg viewBox="${f.vb}" role="img" aria-label="diagram">${f.svg}</svg>`;
  });
}

/* =====================================================================================
 * 1. Walk around a polygon and add the sides
 * ===================================================================================== */
const POLY = {
  a: { pts: [[0, 0], [8, 0], [2.8, 3.9]], lab: ['8 cm', '6.5 cm', '48 mm'], v: ['8', '6.5', '4.8'], u: 'cm', P: '19.3', name: 'triangle', conv: 2 },
  b: { pts: [[0, 0], [5, 0], [5.8, 3], [2.5, 4.6], [-0.6, 2.8]], lab: ['14.2 m', '9.5 m', '11.8 m', '10.3 m', '7.6 m'], v: ['14.2', '9.5', '11.8', '10.3', '7.6'], u: 'm', P: '53.4', name: 'building lot' },
  c: { pts: [0, 1, 2, 3, 4, 5].map((i) => [Math.cos(i * Math.PI / 3 - 2 * Math.PI / 3), Math.sin(i * Math.PI / 3 - 2 * Math.PI / 3)]), lab: ['2¾ in', '', '', '', '', ''], v: Array(6).fill('2.75'), u: 'in', P: '16.5', name: 'hexagon tile', eq: true }
};
const walk = {
  title: 'Walk around the shape and add each side',
  height: 380, minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) triangle' }, { v: 'b', label: '(b) building lot' }, { v: 'c', label: '(c) hexagon' }],
  ask: (k) => `Example 1(${k}): find the perimeter of the <b>${POLY[k].name}</b>.`,
  make(stage, k, ex) {
    const d = POLY[k], W = ex.W, n = d.pts.length, AW = 440, AH = 290, X0 = 30, Y0 = 40;
    const xs = d.pts.map((p) => p[0]), ys = d.pts.map((p) => p[1]);
    const mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys);
    const s = Math.min((AW - 80) / (mxx - mnx), (AH - 70) / (mxy - mny));
    const P = d.pts.map(([x, y]) => [X0 + 40 + (x - mnx) * s, Y0 + AH - 35 - (y - mny) * s]);
    const cx = P.reduce((a, p) => a + p[0], 0) / n, cy = P.reduce((a, p) => a + p[1], 0) / n;
    const S = mkSvg(stage, X0 + AW + 20, 380, 0, 0);
    svgEl('path', { d: 'M' + P.map((p) => p.join(' ')).join(' L') + ' Z', fill: '#fff6e5', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, S);
    const segs = [], labs = [], ticks = [];
    for (let i = 0; i < n; i++) {
      const a = P[i], b = P[(i + 1) % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const L = Math.hypot(nx, ny); nx /= L; ny /= L; if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      segs.push(svgEl('path', { d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, stroke: RED, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, S)); undraw(segs[i]);
      labs.push(txt(S, mx + nx * 30, my + ny * 30 + 6, d.lab[i], { 'font-size': 19 }));
      const tk = svgEl('path', { d: `M${mx - nx * 9} ${my - ny * 9} L${mx + nx * 9} ${my + ny * 9}`, stroke: '#12805a', 'stroke-width': 4 }, S); hide(tk); ticks.push(tk);
    }
    const dot = svgEl('circle', { cx: P[0][0], cy: P[0][1], r: 9, fill: RED, stroke: '#fff', 'stroke-width': 3 }, S); hide(dot);
    const go = async (c, i, ms) => { await drawIn(c, segs[i], ms); dot.setAttribute('cx', P[(i + 1) % n][0]); dot.setAttribute('cy', P[(i + 1) % n][1]); await c.fadeIn(ticks[i], 120); };
    const TX = X0 + AW + 30, TW = W - TX - 20;
    const sumEl = hide(add(stage, box(cbox('u3l6-eline lg', ''), TW, 54), TX, 60));
    const setSum = (m) => { sumEl.firstChild.innerHTML = T('P=' + d.v.slice(0, m).join('+')); };
    const R = res(stage, `${T(`P=${d.P}`)}&nbsp;${d.u}${k === 'c' ? ` = ${T('16\\tfrac12')} in` : ''}`, TX, 250, TW);
    const steps = [{ cap: `Find the perimeter of the ${d.name}. Start at one corner.`, run: (c) => c.fadeIn(dot) }];
    if (k === 'a') {
      const cv = line(stage, `Same unit: 48 mm = <b>4.8 cm</b>`, TX, 0, TW);
      steps.push({ cap: 'All the sides must be in the <b>same unit</b>. Change 48 mm to cm: <b>4.8 cm</b>.', run: async (c) => { await c.fadeIn(cv); await pulse(c, labs[2], 1.3); labs[2].textContent = '4.8 cm'; labs[2].setAttribute('fill', RED); } });
    }
    if (d.eq) {
      const l2 = line(stage, `${T('6\\times2.75=16.5')}`, TX, 150, TW);
      steps.push(
        { cap: 'Walk the first side: <b>2¾ in</b> = 2.75 in. The tick marks say every side is the same.', run: async (c) => { await go(c, 0, 600); await c.fadeIn(sumEl); setSum(1); } },
        { cap: `All <b>6</b> sides are equal, so multiply: ${T('6\\times2.75=16.5')}.`, run: async (c) => { for (let i = 1; i < n; i++) await go(c, i, 260); sumEl.firstChild.innerHTML = T('P=6\\times2.75'); await c.fadeIn(l2); } },
        { cap: `${T('P=16.5=16\\tfrac12')} in.`, run: (c) => c.pop(R) });
      return steps;
    }
    steps.push(
      { cap: `Walk around and add each side as you pass it: ${T('P=' + d.v.join('+'))}. Tick each side so none is missed.`, run: async (c) => { await c.fadeIn(sumEl); for (let i = 0; i < n; i++) { await go(c, i, 520); setSum(i + 1); } } },
      { cap: `Back at the start: ${T(`P=${d.P}`)} ${d.u}.`, run: (c) => c.pop(R) });
    return steps;
  }
};

/* =====================================================================================
 * 1b. A fence around a rectangular yard: l + w + l + w
 * ===================================================================================== */
const YARD = {
  a: { name: 'Volleyball court', l: 18, w: 9, L: '18 m', Wd: '9 m', sum: '18+9+18+9', g: '2\\times18+2\\times9=36+18=54', est: '2\\times20+2\\times10=60', estN: 'close to 54 m ✓', P: '54 m' },
  b: { name: 'Phone screen', l: 15.2, w: 7.1, L: '15.2 cm', Wd: '7.1 cm', sum: '15.2+7.1+15.2+7.1', g: '2(15.2+7.1)=2\\times22.3=44.6', est: '2(15+7)=44', estN: 'close to 44.6 cm ✓', P: '44.6 cm' },
  c: { name: 'Square floor tile', l: 4.75, w: 4.75, L: '4¾ in', Wd: '4¾ in', sum: '4\\tfrac34+4\\tfrac34+4\\tfrac34+4\\tfrac34', g: '4\\times4\\tfrac34=4\\times4.75=19', est: '4\\times5=20', estN: 'close to 19 in ✓', P: '19 in', sq: true },
  d: { name: 'Area rug', l: 7.75, w: 5.5, L: '7 ft 9 in', Wd: '5 ft 6 in', P: '26 ft 6 in', ftin: true }
};
const yard = {
  title: 'A fence around a rectangle: two lengths and two widths',
  height: 380, minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a) court' }, { v: 'b', label: '(b) phone' }, { v: 'c', label: '(c) tile' }, { v: 'd', label: '(d) rug' }],
  ask: (k) => { const d = YARD[k]; return `Example 2(${k}): ${d.name.toLowerCase()}, ${d.sq ? 'side ' + d.L : d.L + ' by ' + d.Wd}. Find the perimeter.`; },
  make(stage, k, ex) {
    const d = YARD[k], W = ex.W, AW = 400, AH = 260, s = Math.min(AW / d.l, AH / d.w), rw = d.l * s, rh = d.w * s, X = 50 + (AW - rw) / 2, Y = 50 + (AH - rh) / 2;
    const S = mkSvg(stage, AW + 120, 380, 0, 0);
    svgEl('rect', { x: X, y: Y, width: rw, height: rh, fill: d.sq ? '#eef4fb' : '#e3f1d8', stroke: '#9aa4b1', 'stroke-width': 2 }, S);
    const fence = svgEl('path', { d: `M${X} ${Y} H${X + rw} V${Y + rh} H${X} Z`, fill: 'none', stroke: '#8a5a0a', 'stroke-width': 7, 'stroke-linejoin': 'round' }, S); undraw(fence);
    for (const [px, py] of [[X, Y], [X + rw, Y], [X + rw, Y + rh], [X, Y + rh]]) svgEl('rect', { x: px - 6, y: py - 6, width: 12, height: 12, fill: '#5a3a0a' }, S);
    const lt = txt(S, X + rw / 2, Y - 12, d.L, { 'font-size': 19 }), lr = txt(S, X + rw + 12, Y + rh / 2 + 6, d.Wd, { 'font-size': 19, 'text-anchor': 'start' });
    const lb = hide(txt(S, X + rw / 2, Y + rh + 28, d.L, { 'font-size': 19, fill: '#8a5a0a' })), ll = hide(txt(S, X - 12, Y + rh / 2 + 6, d.Wd, { 'font-size': 19, 'text-anchor': 'end', fill: '#8a5a0a' }));
    void lt; void lr;
    const TX = AW + 140, TW = W - TX - 20;
    const R = res(stage, `<b>P = ${d.P}</b>`, TX, 300, TW);
    if (d.ftin) {
      const l1 = line(stage, '5 ft 6 in + 7 ft 9 in = <b>12 ft 15 in</b>', TX, 40, TW), l2 = line(stage, '15 in = 1 ft 3 in, so <b>13 ft 3 in</b>', TX, 100, TW), l3 = line(stage, '× 2: <b>26 ft 6 in</b>', TX, 160, TW);
      const ch = hide(add(stage, box(cbox('u3l6-chk', `Check in feet: ${T('2(5.5+7.75)=26.5')} ft = 26 ft 6 in ✓`), TW, 70), TX, 220));
      return [
        { cap: 'A fence goes all the way around: length, width, length, width.', run: async (c) => { await drawIn(c, fence, 1600); await c.fadeIn(lb); await c.fadeIn(ll); } },
        { cap: 'Add one length and one width first: 5 ft 6 in + 7 ft 9 in = <b>12 ft 15 in</b>.', run: (c) => c.fadeIn(l1) },
        { cap: '15 in is more than a foot: 15 in = 1 ft 3 in. So 12 ft 15 in = <b>13 ft 3 in</b>.', run: (c) => c.fadeIn(l2) },
        { cap: 'Double it: 2 × 13 ft 3 in = <b>26 ft 6 in</b>.', run: (c) => c.fadeIn(l3) },
        { cap: `Check in feet: 5.5 ft and 7.75 ft, ${T('2(5.5+7.75)=26.5')} ft = 26 ft 6 in ✓`, run: async (c) => { await c.fadeIn(ch); await c.pop(R); } }
      ];
    }
    const l1 = line(stage, `${T('P=' + d.sum)}`, TX, 40, TW), l2 = line(stage, `${T(d.g)}`, TX, 110, TW);
    const ch = hide(add(stage, box(cbox('u3l6-chk', `Estimate: ${T(d.est)}, ${d.estN}`), TW, 70), TX, 190));
    return [
      { cap: `A fence goes all the way around: ${d.sq ? 'four equal sides' : 'length, width, length, width'}. ${T('P=' + d.sum)}.`, run: async (c) => { await drawIn(c, fence, 1600); await c.fadeIn(lb); await c.fadeIn(ll); await c.fadeIn(l1); } },
      { cap: d.sq ? `Four equal sides: ${T(d.g)}.` : `Two lengths and two widths: ${T(d.g)}.`, run: (c) => c.fadeIn(l2) },
      { cap: `Estimate to check: ${T(d.est)}, ${d.estN}`, run: (c) => c.fadeIn(ch) },
      { cap: `The perimeter is <b>${d.P}</b>.`, run: (c) => c.pop(R) }
    ];
  }
};

/* =====================================================================================
 * 2. Missing sides of an L shape, and the push-out shortcut
 * ===================================================================================== */
const LSH = {
  rosa: { W0: 9.6, H0: 7.2, tw: 4.1, rh: 2.8, lab: { W0: '9.6 m', H0: '7.2 m', tw: '4.1 m', rh: '2.8 m', a: 'a', b: 'b' }, A: '5.5 m', B: '4.4 m',
    ca: `${T('a=9.6-4.1=5.5')} m`, cb: `${T('b=7.2-2.8=4.4')} m`, sum: `${T('P=9.6+2.8+5.5+4.4+4.1+7.2=33.6')} m`, sc: `${T('2(9.6+7.2)=2\\times16.8=33.6')} m ✓`, P: '33.6 m' },
  tyler: { W0: 60, H0: 48.5, tw: 24.25, rh: 22.75, lab: { W0: '60 in', H0: '48½ in', tw: '24¼ in', rh: '22¾ in', a: '?', b: '?' }, A: '35¾ in', B: '25¾ in',
    ca: `${T('60-24\\tfrac14=35\\tfrac34')} in`, cb: `${T('48\\tfrac12-22\\tfrac34=47\\tfrac64-22\\tfrac34=25\\tfrac34')} in`, sum: `wholes ${T('214')} + fractions ${T('\\tfrac{12}{4}=3')}: ${T('P=217')} in`, sc: `${T('2(60+48\\tfrac12)=2\\times108\\tfrac12=217')} in ✓`, P: '217 in = 18 ft 1 in' }
};
const missing = {
  title: 'Missing sides: the parts add up to the whole side',
  height: 400, minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'rosa', label: 'Ex 3: Rosa’s garden' }, { v: 'tyler', label: 'Ex 4: Tyler’s desk' }, { sep: 'Watch out:' }, { v: 'notch', label: 'A notch in the middle' }],
  ask: (k) => (k === 'rosa' ? 'Example 3: Rosa’s L-shaped garden. Find <b>a</b> and <b>b</b>, then the perimeter.' : k === 'tyler' ? 'Example 4: Tyler’s L-shaped desk. Find the two missing sides, then the perimeter.' : 'A 12 m by 8 m yard has a notch 4 m wide and 3 m deep cut into the <b>middle</b> of the top side. Does the shortcut work?'),
  make(stage, k, ex) {
    const W = ex.W, AW = 430, AH = 320, X0 = 50, Y0 = 40;
    const S = mkSvg(stage, AW + 120, 400, 0, 0);
    const TX = AW + 120, TW = W - TX - 16;
    if (k === 'notch') {
      const s = Math.min(AW / 12, AH / 8) * 0.88, P = (x, y) => [X0 + 20 + x * s, Y0 + 20 + (8 - y) * s];
      const pts = (dep) => [[0, 0], [12, 0], [12, 8], [8, 8], [8, 8 - dep], [4, 8 - dep], [4, 8], [0, 8]].map(([x, y]) => P(x, y));
      const ghost = svgEl('path', { d: 'M' + pts(0).map((p) => p.join(' ')).join(' L') + ' Z', fill: 'none', stroke: '#9aa4b1', 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S); hide(ghost);
      const poly = svgEl('path', { fill: '#fff6e5', stroke: INK, 'stroke-width': 3 }, S);
      const setP = (dep) => poly.setAttribute('d', 'M' + pts(dep).map((p) => p.join(' ')).join(' L') + ' Z'); setP(3);
      const t = (x, y, s2, a = {}) => txt(S, P(x, y)[0], P(x, y)[1], s2, Object.assign({ 'font-size': 18 }, a));
      t(6, -0.55, '12 m'); t(12.25, 4, '8 m', { 'text-anchor': 'start' }); t(-0.25, 4, '8 m', { 'text-anchor': 'end' }); t(2, 8.25, '4 m'); t(10, 8.25, '4 m'); t(6, 4.45, '4 m');
      const n1 = t(3.75, 6.6, '3 m', { 'text-anchor': 'end', fill: RED }), n2 = t(8.25, 6.6, '3 m', { 'text-anchor': 'start', fill: RED });
      const sides = [[[4, 8], [4, 5]], [[8, 5], [8, 8]]].map(([a, b]) => { const e = svgEl('path', { d: `M${P(...a).join(' ')} L${P(...b).join(' ')}`, stroke: RED, 'stroke-width': 7, fill: 'none' }, S); undraw(e); return e; });
      const l1 = line(stage, `Rectangle: ${T('2(12+8)=40')} m`, TX, 40, TW), l2 = line(stage, `Extra notch sides: ${T('3+3=6')} m`, TX, 110, TW);
      const R = res(stage, `${T('P=40+6=46')} m`, TX, 190, TW);
      const st = ok(stage, '✗ 40 m', TX + TW - 120, 270, { ok: false });
      return [
        { cap: 'Here the notch is cut into the <b>middle</b> of a side, not at a corner.', run: async (c) => { await pulse(c, poly, 1.03); } },
        { cap: 'Push the bottom of the notch up: the top becomes one 12 m side. That part matches the rectangle.', run: async (c) => { await c.fadeIn(ghost); await tween(c, 900, (tt) => setP(3 * (1 - tt))); await c.fadeIn(l1); } },
        { cap: 'But the two <b>3 m</b> sides of the notch are gone now. They were extra: the shortcut misses them.', run: async (c) => { await tween(c, 700, (tt) => setP(3 * tt)); await drawIn(c, sides[0], 400); await drawIn(c, sides[1], 400); await pulse(c, n1, 1.3); await pulse(c, n2, 1.3); await c.fadeIn(l2); } },
        { cap: `${T('P=40+3+3=46')} m. The shortcut alone (40 m) would be too small.`, run: async (c) => { await c.pop(R); await stampIn(c, st); } }
      ];
    }
    const d = LSH[k], s = Math.min(AW / d.W0, AH / d.H0) * 0.86, P = (x, y) => [X0 + 30 + x * s, Y0 + 10 + (d.H0 - y) * s];
    const pts = (t) => [[0, 0], [d.W0, 0], [d.W0, d.rh + (d.H0 - d.rh) * t], [d.tw + (d.W0 - d.tw) * t, d.rh + (d.H0 - d.rh) * t], [d.tw + (d.W0 - d.tw) * t, d.H0], [0, d.H0]].map(([x, y]) => P(x, y));
    const ghost = svgEl('path', { d: 'M' + pts(1).map((p) => p.join(' ')).join(' L') + ' Z', fill: 'none', stroke: '#9aa4b1', 'stroke-width': 2, 'stroke-dasharray': '7 6' }, S); hide(ghost);
    const poly = svgEl('path', { fill: '#fff6e5', stroke: INK, 'stroke-width': 3 }, S);
    const setP = (t) => poly.setAttribute('d', 'M' + pts(t).map((p) => p.join(' ')).join(' L') + ' Z'); setP(0);
    const t = (x, y, s2, a = {}) => txt(S, P(x, y)[0], P(x, y)[1], s2, Object.assign({ 'font-size': 18 }, a));
    t(d.W0 / 2, -d.H0 * 0.075, d.lab.W0); t(d.W0 + d.W0 * 0.02, d.rh / 2, d.lab.rh, { 'text-anchor': 'start' }); t(d.tw / 2, d.H0 * 1.03, d.lab.tw); t(-d.W0 * 0.02, d.H0 / 2, d.lab.H0, { 'text-anchor': 'end' });
    const la = t((d.tw + d.W0) / 2, d.rh + d.H0 * 0.03, d.lab.a, { fill: RED, 'font-size': 21 }), lb = t(d.tw + d.W0 * 0.02, (d.rh + d.H0) / 2, d.lab.b, { fill: RED, 'font-size': 21, 'text-anchor': 'start' });
    // sliding copies
    const bar = (a, b, col) => { const g = svgEl('g', {}, S); svgEl('path', { d: `M${P(...a).join(' ')} L${P(...b).join(' ')}`, stroke: col, 'stroke-width': 9, 'stroke-linecap': 'butt', fill: 'none', opacity: 0.85 }, g); hide(g); return g; };
    const topA = bar([0, d.H0], [d.tw, d.H0], BLUE), topB = bar([d.tw, d.rh], [d.W0, d.rh], RED);
    const sideA = bar([d.W0, 0], [d.W0, d.rh], BLUE), sideB = bar([d.tw, d.rh], [d.tw, d.H0], RED);
    const l1 = line(stage, `Across: ${d.ca}`, TX, 20, TW), l2 = line(stage, `Up and down: ${d.cb}`, TX, 80, TW, 'u3l6-eline sm');
    const l3 = line(stage, d.sum, TX, 150, TW, 'u3l6-eline sm');
    const l4 = hide(add(stage, box(cbox('u3l6-chk', `Shortcut: ${d.sc}`), TW, 60), TX, 216));
    const R = res(stage, `<b>P = ${d.P}</b>`, TX, 300, TW);
    const dy = (d.H0) * s, dx = d.tw * s;
    return [
      { cap: `All corners are right angles. Two sides are missing: ${k === 'rosa' ? '<b>a</b> and <b>b</b>' : 'the two marked <b>?</b>'}.`, run: async (c) => { await pulse(c, la, 1.3); await pulse(c, lb, 1.3); } },
      { cap: `<b>Across:</b> the two top parts add up to the bottom. Slide them down: ${d.ca}.`,
        run: async (c) => { await c.fadeIn(topA); await c.fadeIn(topB); await Promise.all([c.anim(topA, [{ transform: 'none' }, { transform: `translateY(${dy}px)` }], 800), c.anim(topB, [{ transform: 'none' }, { transform: `translateY(${d.rh * s}px)` }], 800)]); await c.fadeIn(l1); la.textContent = d.A; } },
      { cap: `<b>Up and down:</b> the two parts on the right add up to the left side. Slide them over: ${d.cb}.`,
        run: async (c) => { await c.fadeIn(sideA); await c.fadeIn(sideB); await Promise.all([c.anim(sideA, [{ transform: 'none' }, { transform: `translate(${-d.W0 * s}px, 0px)` }], 800), c.anim(sideB, [{ transform: 'none' }, { transform: `translate(${-dx}px, ${-d.rh * s}px)` }], 800)]); await c.fadeIn(l2); lb.textContent = d.B; } },
      { cap: `Now add <b>all six</b> sides: ${d.sum}.`, run: async (c) => { await Promise.all([topA, topB, sideA, sideB].map((g) => c.anim(g, [{ opacity: 1 }, { opacity: 0 }], 300))); [topA, topB, sideA, sideB].forEach((g) => { g.style.opacity = 0; }); await c.fadeIn(l3); } },
      { cap: `Check: push the cut corner out. The sides just move, so the perimeter is the same as the big rectangle: ${d.sc}`, run: async (c) => { await c.fadeIn(ghost); await tween(c, 1100, (tt) => setP(tt)); await c.fadeIn(l4); await tween(c, 700, (tt) => setP(1 - tt)); } },
      { cap: `The perimeter is <b>${d.P}</b>.`, run: (c) => c.pop(R) }
    ];
  }
};

/* =====================================================================================
 * 3. A wheel rolls out its circumference: 3 diameters and a bit more
 * ===================================================================================== */
const CIRC = {
  unroll: { ask: 'Roll a wheel one full turn. How far does it go, compared with its diameter?' },
  a: { obj: 'Wall clock', given: 'd = 30 cm', d: 30, u: 'cm', est: 90, C: '94.24777961', R: '94.2' },
  b: { obj: 'Pizza', given: 'r = 7 in', r: 7, d: 14, u: 'in', est: 42, C: '43.98229715', R: '44.0' },
  c: { obj: 'Round hay bale', given: 'r = 0.9 m', r: 0.9, d: 1.8, u: 'm', est: 5.4, C: '5.654866776', R: '5.7' },
  d: { obj: 'Jar lid', given: 'd = 3¼ in', d: 3.25, u: 'in', est: 'about 10', estT: '3\\times3.25=9.75', C: '10.21017612', R: '10.2', frac: true }
};
const roll = {
  title: 'Roll it out: the circumference is π diameters',
  height: 400, minW: 900,
  choices: [{ v: 'unroll', label: 'Roll a wheel' }, { sep: 'Example 5 check:' }, { v: 'a', label: '(a) clock' }, { v: 'b', label: '(b) pizza' }, { v: 'c', label: '(c) hay bale' }, { v: 'd', label: '(d) jar lid' }],
  ask: (k) => (k === 'unroll' ? CIRC.unroll.ask : `Example 5(${k}): ${CIRC[k].obj.toLowerCase()}, <b>${CIRC[k].given}</b>. Estimate, then find the circumference to the nearest tenth.`),
  make(stage, k, ex) {
    const W = ex.W, D = 104, R = D / 2, G = 340, X0 = 80;
    const S = mkSvg(stage, W, 400, 0, 0);
    svgEl('line', { x1: 20, y1: G, x2: W - 20, y2: G, stroke: '#3a4254', 'stroke-width': 3 }, S);
    // three diameter rods and the 0.14 bit
    const rods = [0, 1, 2].map((i) => { const g = svgEl('g', {}, S); svgEl('rect', { x: X0 + i * D + 1, y: G + 8, width: D - 2, height: 16, rx: 4, fill: BLUE }, g); txt(g, X0 + i * D + R, G + 46, 'd', { fill: BLUE, 'font-size': 18, 'font-style': 'italic' }); return hide(g); });
    const bit = svgEl('g', {}, S); svgEl('rect', { x: X0 + 3 * D, y: G + 8, width: 0.1416 * D, height: 16, rx: 3, fill: '#e0a21a' }, bit); txt(bit, X0 + 3 * D + 30, G + 46, '+ a bit', { fill: '#a8680a', 'font-size': 16, 'text-anchor': 'start' }); hide(bit);
    const trace = svgEl('rect', { x: X0, y: G - 4, width: 0, height: 8, rx: 3, fill: RED }, S);
    // the wheel: outer group fades, inner group moves
    const wo = svgEl('g', {}, S), wi = svgEl('g', {}, wo);
    svgEl('circle', { cx: 0, cy: 0, r: R, fill: '#fff6e5', stroke: INK, 'stroke-width': 4 }, wi);
    const dia = svgEl('line', { x1: -R, y1: 0, x2: R, y2: 0, stroke: BLUE, 'stroke-width': 4 }, wi);
    const rad = svgEl('line', { x1: 0, y1: 0, x2: 0, y2: -R, stroke: RED, 'stroke-width': 4 }, wi); hide(rad);
    svgEl('circle', { cx: 0, cy: R, r: 7, fill: RED }, wi);
    svgEl('circle', { cx: 0, cy: 0, r: 4, fill: INK }, wi);
    const at = (dist) => wi.setAttribute('transform', `translate(${X0 + dist} ${G - R}) rotate(${dist / R * 180 / Math.PI})`);
    at(0);
    const rollIt = (c, ms = 1800) => tween(c, ms, (t) => { at(Math.PI * D * t); trace.setAttribute('width', Math.PI * D * t); });
    const TX = X0 + 3.6 * D + 40, TW = W - TX - 20;
    if (k === 'unroll') {
      const f = hide(add(stage, box(cbox('u3l6-fact', `The circumference is <b>3 diameters and a little more</b>: about <b>3.14 × d</b>. This number is <b>π</b>: ${T('C=\\pi d')}.`), TW, 110), TX, 40));
      return [
        { cap: 'A wheel with diameter <b>d</b> (blue). A red dot marks where it touches the ground.', run: (c) => pulse(c, dia, 1.1) },
        { cap: 'Lay <b>3 diameters</b> end to end along the ground.', run: async (c) => { for (const r of rods) await c.fadeIn(r, 250); } },
        { cap: 'Now roll the wheel <b>one full turn</b>. The red dot comes back to the ground.', run: (c) => rollIt(c) },
        { cap: 'It rolled 3 diameters <b>and a bit more</b> (about 0.14 d). For every circle: C ≈ 3.14 × d = π × d.', run: async (c) => { await c.fadeIn(bit); await c.pop(f); } }
      ];
    }
    const d = CIRC[k];
    const name = add(stage, box(h('div', 'u3l6-oname', `${d.obj}: ${d.given}`), TW, 40), TX, 10);
    void name;
    const lD = line(stage, d.r ? `Radius given: ${T(`d=2\\times${d.r}=${d.d}`)} ${d.u}` : `Diameter: ${T(`d=${d.d}`)} ${d.u}`, TX, 60, TW);
    const lE = line(stage, `Estimate: ${T(d.estT || `3\\times${d.d}=${d.est}`)}${d.frac ? ', about 10' : ''} ${d.u}`, TX, 112, TW);
    const scr = lcd(stage, `π×${d.d}`, d.C, TX, 166, 270);
    const lC = line(stage, `${T(`C=\\pi\\times${d.d}=${d.C.slice(0, 5)}\\ldots`)}`, TX, 240, TW);
    const Rr = res(stage, `${T(`C\\approx${d.R}`)} ${d.u}: a bit more than the estimate ✓`, TX, 292, TW);
    const steps = [];
    if (d.r) steps.push({ cap: `The <b>radius</b> is given (red): ${d.r} ${d.u}. Double it to get the diameter: ${T(`d=2\\times${d.r}=${d.d}`)} ${d.u}.`, run: async (c) => { await c.fadeIn(rad); await pulse(c, dia, 1.1); await c.fadeIn(lD); } });
    else steps.push({ cap: `The <b>diameter</b> is given: ${T(`d=${d.d}`)} ${d.u}.`, run: async (c) => { await pulse(c, dia, 1.1); await c.fadeIn(lD); } });
    steps.push(
      { cap: `Estimate: about 3 diameters. ${T(d.estT || `3\\times${d.d}=${d.est}`)}${d.frac ? ', about 10' : ''} ${d.u}.`, run: async (c) => { for (const r of rods) await c.fadeIn(r, 200); await c.fadeIn(lE); } },
      { cap: `Roll it one turn. ${T(`C=\\pi\\times${d.d}`)}: use the π key.`, run: async (c) => { await rollIt(c); await c.pop(scr); await c.fadeIn(bit); } },
      { cap: `${T(`\\pi\\times${d.d}=${d.C.slice(0, 5)}\\ldots`)}. Round to the nearest tenth: <b>${d.R} ${d.u}</b>.`, run: async (c) => { await c.fadeIn(lC); await c.pop(Rr); } });
    return steps;
  }
};

/* =====================================================================================
 * 3b. Why C ÷ d is always about 3.14 (Full notes)
 * ===================================================================================== */
const PIR = [
  { o: 'Hockey puck', d: 7.6, u: 'cm', C: 23.9 }, { o: 'Dinner plate', d: 27, u: 'cm', C: 84.8 },
  { o: 'Bike wheel', d: 66, u: 'cm', C: 207.3 }, { o: 'Ferris wheel', d: 50, u: 'm', C: 157.1 }
];
const piRatio = {
  title: 'Small or huge: C ÷ d is always about 3.14',
  height: 390, minW: 900,
  ask: 'Wrap a string around four round things. Divide each circumference by its diameter.',
  make(stage, k, ex) {
    const W = ex.W, U = 66, X = 230, rows = [];
    PIR.forEach((p, i) => {
      const y = 20 + i * 80;
      const nm = add(stage, box(h('div', 'u3l6-pname', `<b>${p.o}</b><span>d = ${p.d} ${p.u}, C = ${p.C} ${p.u}</span>`), 210, 60), 10, y);
      const rods = [0, 1, 2].map((j) => hide(add(stage, box(h('div', 'u3l6-rod'), U - 3, 16), X + j * U, y + 6)));
      const str = add(stage, box(h('div', 'u3l6-string'), 0, 10), X, y + 34);
      const r = hide(add(stage, box(cbox('u3l6-ratio', `${T(`${p.C}\\div${p.d}\\approx${fx(p.C / p.d, 2)}`)}`), W - X - 3.3 * U - 30, 50), X + 3.3 * U + 20, y + 5));
      rows.push({ nm, rods, str, r });
      hide(nm);
    });
    const f = hide(add(stage, box(cbox('u3l6-fact', `Every circle: ${T('C\\div d\\approx3.14')}. The exact number is <b>π = 3.14159…</b>, and its decimals never end.`), W - 40, 56), 20, 334));
    return [
      ...rows.map((r, i) => ({ cap: `${PIR[i].o}: the string (red) is a bit more than 3 diameters (blue). ${T(`${PIR[i].C}\\div${PIR[i].d}\\approx${fx(PIR[i].C / PIR[i].d, 2)}`)}.`,
        run: async (c) => { await c.fadeIn(r.nm); for (const e of r.rods) await c.fadeIn(e, 120); await tween(c, 700, (t) => { r.str.style.width = 3.1416 * U * t + 'px'; }); await c.fadeIn(r.r); } })),
      { cap: 'Always about <b>3.14</b>, for a puck or a Ferris wheel. That number is <b>π</b>.', run: (c) => c.pop(f) }
    ];
  }
};

/* =====================================================================================
 * 3c. Nadia's bike: one turn, 500 turns, how many turns in 1 km
 * ===================================================================================== */
const bike = {
  title: 'Nadia’s bike: one turn rolls one circumference',
  height: 400, minW: 900,
  ask: 'Example 6: Nadia’s bike wheel has a diameter of <b>66 cm</b>. How far does it roll in one turn? In 500 turns? How many turns in 1 km?',
  make(stage, k, ex) {
    const W = ex.W, S = mkSvg(stage, W, 400, 0, 0), G = 150, R = 44, C1 = Math.PI * 2 * R;
    svgEl('line', { x1: 20, y1: G, x2: W - 20, y2: G, stroke: '#3a4254', 'stroke-width': 3 }, S);
    const trace = svgEl('rect', { x: 40, y: G - 4, width: 0, height: 8, rx: 3, fill: RED }, S);
    const bk = svgEl('g', {}, S);
    const wheel = (cx) => { const g = svgEl('g', {}, bk); svgEl('circle', { cx: 0, cy: 0, r: R, fill: 'none', stroke: INK, 'stroke-width': 6 }, g); for (let i = 0; i < 6; i++) svgEl('line', { x1: 0, y1: 0, x2: R * Math.cos(i * Math.PI / 3), y2: R * Math.sin(i * Math.PI / 3), stroke: '#9aa4b1', 'stroke-width': 2 }, g); svgEl('circle', { cx: 0, cy: R, r: 6, fill: RED }, g); g.dataset.cx = cx; return g; };
    const w1 = wheel(0), w2 = wheel(150);
    const frame = svgEl('path', { d: 'M0 0 L60 -50 L120 -50 L150 0 M60 -50 L75 0 L0 0 M120 -50 L75 0 M60 -50 L55 -66 M48 -66 H66 M120 -50 L118 -72 L132 -76', fill: 'none', stroke: '#2f6db5', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bk);
    const at = (dist) => { const a = dist / R * 180 / Math.PI; w1.setAttribute('transform', `translate(${40 + dist} ${G - R}) rotate(${a})`); w2.setAttribute('transform', `translate(${190 + dist} ${G - R}) rotate(${a})`); frame.setAttribute('transform', `translate(${40 + dist} ${G - R})`); };
    at(0);
    const tg1 = hide(add(stage, box(h('div', 'u3l6-tag rd', '1 turn ≈ 207.3 cm'), 200, 34), 40 + C1 / 2 - 100, G + 12));
    // the long road: 0 to 1100 m
    const RX = 40, RL = W - 80, sc = RL / 1100, RY = 280;
    add(stage, box(h('div', 'u3l6-road'), RL, 20), RX, RY);
    for (let m = 0; m <= 1100; m += 100) add(stage, box(h('div', 'u3l6-gtick', m % 500 === 0 ? `${m} m` : ''), 70, 20), RX + m * sc - 35, RY + 24);
    const flag = hide(add(stage, box(h('div', 'u3l6-flag', '1 km'), 70, 34), RX + 1000 * sc - 4, RY - 40));
    const fill = add(stage, box(h('div', 'u3l6-rfill'), 0, 20), RX, RY);
    const cnt = hide(add(stage, box(h('div', 'u3l6-cnt'), 300, 34), RX, RY - 42));
    const l1 = line(stage, `${T('C=\\pi\\times66=207.345\\ldots\\approx207.3')} cm`, W - 470, 20, 450);
    const l2 = line(stage, `${T('500\\times207.345\\ldots=103\\,672.5\\ldots')} cm = <b>1036.7 m</b>`, W - 520, 196, 500, 'u3l6-eline sm');
    const l3 = line(stage, `${T('100\\,000\\div207.345\\ldots\\approx482.3')}: about <b>482 turns</b>`, W - 520, 330, 500, 'u3l6-eline sm');
    return [
      { cap: `(a) One turn of the wheel rolls one circumference: ${T('C=\\pi\\times66=207.345\\ldots')} ≈ <b>207.3 cm</b>.`, run: async (c) => { await tween(c, 1700, (t) => { at(C1 * t); trace.setAttribute('width', C1 * t); }); await c.pop(tg1); await c.fadeIn(l1); } },
      { cap: `(b) 500 turns: ${T('500\\times207.345\\ldots=103\\,672.5\\ldots')} cm. Divide by 100: <b>1036.7 m</b>.`, run: async (c) => { await c.fadeIn(cnt); await c.fadeIn(flag); await tween(c, 1800, (t) => { fill.style.width = 1036.7 * sc * t + 'px'; cnt.innerHTML = `<b>${Math.round(500 * t)}</b> turns: ${fx(1036.7 * t, 1)} m`; }); await c.fadeIn(l2); } },
      { cap: 'That is <b>just over 1 km</b>: the red bar passes the 1 km flag.', run: (c) => pulse(c, flag, 1.2) },
      { cap: `(c) 1 km = 100 000 cm. ${T('100\\,000\\div207.345\\ldots\\approx482.3')}: about <b>482 turns</b> in 1 km.`, run: async (c) => { await tween(c, 700, (t) => { fill.style.width = (1036.7 - 36.7 * t) * sc + 'px'; cnt.innerHTML = `<b>${Math.round(500 - 17.7 * t)}</b> turns: ${fx(1036.7 - 36.7 * t, 1)} m`; }); cnt.innerHTML = '<b>about 482</b> turns: 1000 m'; await c.fadeIn(l3); } }
    ];
  }
};

/* =====================================================================================
 * 4. Half circles: outside edges only
 * ===================================================================================== */
const semi = {
  title: 'Half circles: add only the outside edges',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) rug' }, { v: 'b', label: '(b) window' }, { v: 'c', label: '(c) skating path' }],
  ask: (k) => ({ a: 'Example 7(a): a half-circle rug, <b>4 ft</b> across. Find its perimeter.', b: 'Example 7(b): an arched window frame, <b>90 cm</b> wide with <b>120 cm</b> sides. Find its perimeter.', c: 'Example 7(c): a skating path, two straight sides <b>40 m</b> long and a semicircle at each end, <b>18 m</b> across.' }[k]),
  make(stage, k, ex) {
    const W = ex.W, S = mkSvg(stage, 470, 400, 0, 0), TX = 480, TW = W - TX - 16;
    const pth = (dd, col, w = 7, extra = {}) => { const e = svgEl('path', Object.assign({ d: dd, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, extra), S); return e; };
    if (k === 'a') {
      pth('M70 280 L390 280 A160 160 0 0 0 70 280 Z', INK, 3, { fill: '#fff6e5' });
      txt(S, 230, 312, '4 ft', { 'font-size': 20 });
      const cur = pth('M390 280 A160 160 0 0 0 70 280', RED); undraw(cur);
      const str = pth('M70 280 L390 280', BLUE); undraw(str);
      const l1 = line(stage, `Curved: ${T('\\pi\\times4\\div2=6.283\\ldots')} ft`, TX, 40, TW), l2 = line(stage, 'Straight: <b>4 ft</b>', TX, 100, TW), l3 = line(stage, `${T('P=6.283+4=10.283\\ldots')}`, TX, 160, TW);
      const R = res(stage, `${T('P\\approx10.3')} ft`, TX, 230, TW);
      return [
        { cap: `The curved edge is <b>half</b> a circle: ${T('\\pi\\times4\\div2=6.283\\ldots')} ft.`, run: async (c) => { await drawIn(c, cur, 1000); await c.fadeIn(l1); } },
        { cap: 'A half circle on its own has a <b>straight edge</b> too: 4 ft. Add it.', run: async (c) => { await drawIn(c, str, 600); await c.fadeIn(l2); } },
        { cap: `${T('P=6.283+4=10.283\\ldots')}, about <b>10.3 ft</b>.`, run: async (c) => { await c.fadeIn(l3); await c.pop(R); } }
      ];
    }
    if (k === 'b') {
      const X0 = 150, X1 = 330, Y0 = 130, Y1 = 370, r = 90;
      pth(`M${X1} ${Y0} L${X1} ${Y1} L${X0} ${Y1} L${X0} ${Y0} A${r} ${r} 0 0 1 ${X1} ${Y0}`, INK, 3, { fill: '#eef4fb' });
      const dash = pth(`M${X0} ${Y0} L${X1} ${Y0}`, '#8a8478', 2.5, { 'stroke-dasharray': '7 6' });
      txt(S, 240, Y1 + 26, '90 cm', { 'font-size': 19 }); txt(S, X1 + 12, 255, '120 cm', { 'font-size': 19, 'text-anchor': 'start' }); txt(S, X0 - 12, 255, '120 cm', { 'font-size': 19, 'text-anchor': 'end' });
      const str = pth(`M${X1} ${Y0} L${X1} ${Y1} L${X0} ${Y1} L${X0} ${Y0}`, BLUE); undraw(str);
      const cur = pth(`M${X0} ${Y0} A${r} ${r} 0 0 1 ${X1} ${Y0}`, RED); undraw(cur);
      const x = ok(stage, '✗ inside', 240 - 50, Y0 - 16, { ok: false });
      const l1 = line(stage, `Straight: ${T('120+90+120=330')} cm`, TX, 40, TW), l2 = line(stage, 'The dashed line is <b>inside</b>: not added', TX, 100, TW), l3 = line(stage, `Arch: ${T('\\pi\\times90\\div2=141.37\\ldots')} cm`, TX, 160, TW);
      const R = res(stage, `${T('P=330+141.37\\approx471.4')} cm`, TX, 230, TW);
      return [
        { cap: `The straight edges on the outside: ${T('120+90+120=330')} cm.`, run: async (c) => { await drawIn(c, str, 1200); await c.fadeIn(l1); } },
        { cap: 'The dashed line is where the arch sits on the rectangle. It is <b>inside</b> the frame, so don’t add it.', run: async (c) => { await pulse(c, dash, 1.05); await stampIn(c, x); await c.fadeIn(l2); } },
        { cap: `The arch is half a circle with d = 90 cm: ${T('\\pi\\times90\\div2=141.37\\ldots')} cm.`, run: async (c) => { await drawIn(c, cur, 900); await c.fadeIn(l3); } },
        { cap: `${T('P=330+141.37\\approx471.4')} cm.`, run: (c) => c.pop(R) }
      ];
    }
    // skating path: the two end caps slide together into one circle
    const X0 = 120, X1 = 360, Y0 = 150, Y1 = 258, r = 54;
    svgEl('rect', { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, fill: '#e8f1fb' }, S);
    const sides = pth(`M${X0} ${Y0} L${X1} ${Y0} M${X0} ${Y1} L${X1} ${Y1}`, INK, 3);
    const capL = svgEl('g', {}, S), capR = svgEl('g', {}, S);
    svgEl('path', { d: `M${X0} ${Y0} A${r} ${r} 0 0 0 ${X0} ${Y1}`, stroke: RED, 'stroke-width': 6, fill: '#e8f1fb' }, capL);
    svgEl('path', { d: `M${X1} ${Y0} A${r} ${r} 0 0 1 ${X1} ${Y1}`, stroke: RED, 'stroke-width': 6, fill: '#e8f1fb' }, capR);
    pth(`M${X0} ${Y0} L${X0} ${Y1} M${X1} ${Y0} L${X1} ${Y1}`, '#8a8478', 2, { 'stroke-dasharray': '6 5' });
    txt(S, 240, Y1 + 28, '40 m', { 'font-size': 19 }); txt(S, X1 + r + 16, (Y0 + Y1) / 2 + 6, '18 m', { 'font-size': 19, 'text-anchor': 'start' });
    const str = pth(`M${X0} ${Y0} L${X1} ${Y0} M${X0} ${Y1} L${X1} ${Y1}`, BLUE); undraw(str);
    void sides;
    const mid = (X0 + X1) / 2, dxL = mid - X0, dxR = mid - X1;
    const l1 = line(stage, `Two halves = one circle: ${T('\\pi\\times18=56.548\\ldots')} m`, TX, 40, TW), l2 = line(stage, `Straight: ${T('40+40=80')} m`, TX, 100, TW);
    const R = res(stage, `${T('P=80+56.548\\approx136.5')} m`, TX, 180, TW);
    return [
      { cap: 'Each end is a <b>semicircle</b> with a diameter of 18 m.', run: async (c) => { await pulse(c, capL, 1.06); await pulse(c, capR, 1.06); } },
      { cap: 'Slide the two ends together: two equal semicircles make <b>one whole circle</b>.', run: async (c) => { await Promise.all([c.anim(capL, [{ transform: 'none' }, { transform: `translateX(${dxL}px)` }], 1000), c.anim(capR, [{ transform: 'none' }, { transform: `translateX(${dxR}px)` }], 1000)]); } },
      { cap: `One circle with d = 18 m: ${T('\\pi\\times18=56.548\\ldots')} m.`, run: async (c) => { await c.fadeIn(l1); await Promise.all([c.anim(capL, [{ transform: `translateX(${dxL}px)` }, { transform: 'none' }], 800), c.anim(capR, [{ transform: `translateX(${dxR}px)` }, { transform: 'none' }], 800)]); capL.style.transform = 'none'; capR.style.transform = 'none'; } },
      { cap: `The straight sides: ${T('40+40=80')} m. (The dashed lines are inside: not added.)`, run: async (c) => { await drawIn(c, str, 900); await c.fadeIn(l2); } },
      { cap: `${T('P=80+56.548\\approx136.5')} m.`, run: (c) => c.pop(R) }
    ];
  }
};

/* =====================================================================================
 * 5. Fencing and baseboard: length, gaps, cost, round up pieces
 * ===================================================================================== */
const fence = {
  title: 'Fencing and trim: length, gaps, then cost',
  height: 420, minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'dog', label: 'Ex 8: Jamal’s dog run' }, { v: 'base', label: 'Ex 9: Shawna’s baseboard' }],
  ask: (k) => (k === 'dog' ? 'Example 8: a dog run <b>9.5 m by 6 m</b>, a <b>1.2 m</b> gate gap, fencing <b>$18.75 per metre</b>, gate <b>$129.00</b>, 5% GST.' : 'Example 9: a room <b>11 ft 6 in by 13 ft 3 in</b>, a <b>2 ft 8 in</b> doorway, baseboard in <b>8 ft pieces</b> for <b>$13.98</b> each.'),
  make(stage, k, ex) {
    const W = ex.W, S = mkSvg(stage, 470, 420, 0, 0), TX = 470, TW = W - TX - 16;
    if (k === 'dog') {
      const s = 40, X = 40, Y = 60, rw = 9.5 * s, rh = 6 * s, g0 = X + 3.5 * s, g1 = X + 4.7 * s;
      svgEl('rect', { x: X, y: Y, width: rw, height: rh, fill: '#e3f1d8' }, S);
      const all = svgEl('path', { d: `M${g1} ${Y + rh} H${X + rw} V${Y} H${X} V${Y + rh} H${g1}`, fill: 'none', stroke: '#8a5a0a', 'stroke-width': 7 }, S); undraw(all);
      const gapLine = svgEl('path', { d: `M${g0} ${Y + rh} H${g1}`, stroke: '#8a5a0a', 'stroke-width': 7 }, S); hide(gapLine);
      const gate = svgEl('g', {}, S); svgEl('rect', { x: g0, y: Y + rh - 4, width: g1 - g0, height: 8, fill: '#e0a21a', stroke: '#8a5a0a', 'stroke-width': 2 }, gate); hide(gate);
      txt(S, X + rw / 2, Y - 14, '9.5 m', { 'font-size': 19 }); txt(S, X + rw + 10, Y + rh / 2 + 6, '6 m', { 'font-size': 19, 'text-anchor': 'start' });
      const gl = hide(txt(S, (g0 + g1) / 2, Y + rh + 30, 'gate 1.2 m', { 'font-size': 17, fill: '#a8680a' }));
      const l1 = line(stage, `(a) ${T('P=2(9.5+6)=31')} m`, TX, 10, TW), l2 = line(stage, `(b) ${T('31-1.2=29.8')} m of fencing`, TX, 64, TW);
      const rc = hide(add(stage, box(h('div', 'u3l6-receipt', `<div><span>Fencing 29.8 m × $18.75</span><b>$558.75</b></div><div><span>Gate</span><b>$129.00</b></div><div class="sub"><span>Before tax</span><b>$687.75</b></div><div class="gst"><span>With 5% GST: × 1.05</span><b>$722.14</b></div>`), TW, 210), TX, 124));
      const rows = () => rc.querySelectorAll('div');
      return [
        { cap: `(a) The fence goes all the way around: ${T('P=2(9.5+6)=2\\times15.5=31')} m.`, run: async (c) => { await c.fadeIn(gapLine, 1); await drawIn(c, all, 1500); await c.fadeIn(l1); } },
        { cap: `(b) Leave 1.2 m for the gate: ${T('31-1.2=29.8')} m of fencing.`, run: async (c) => { await c.anim(gapLine, [{ opacity: 1 }, { opacity: 0 }], 400); gapLine.style.opacity = 0; await c.fadeIn(gate); await c.fadeIn(gl); await c.fadeIn(l2); } },
        { cap: `(c) Sold by the metre: ${T('29.8\\times\\$18.75=\\$558.75')}.`, run: async (c) => { rows().forEach((r, i) => { r.style.opacity = i === 0 ? 1 : 0; }); await c.fadeIn(rc); } },
        { cap: `(d) Add the gate: ${T('\\$558.75+\\$129.00=\\$687.75')}.`, run: async (c) => { await c.fadeIn(rows()[1], 250); await c.fadeIn(rows()[2], 250); } },
        { cap: `With GST: ${T('\\$687.75\\times1.05=722.1375')} ≈ <b>$722.14</b>.`, run: (c) => c.pop(rows()[3]) }
      ];
    }
    // baseboard
    const s = 18, X = 70, Y = 40, rw = 13.25 * s, rh = 11.5 * s, d0 = X + 4 * s, d1 = d0 + (2 + 8 / 12) * s;
    svgEl('rect', { x: X, y: Y, width: rw, height: rh, fill: '#f3efe6', stroke: '#9aa4b1', 'stroke-width': 2 }, S);
    const bb = svgEl('path', { d: `M${d1} ${Y + rh} H${X + rw} V${Y} H${X} V${Y + rh} H${d1}`, fill: 'none', stroke: '#6e4a1c', 'stroke-width': 7 }, S); undraw(bb);
    const doorFill = svgEl('path', { d: `M${d0} ${Y + rh} H${d1}`, stroke: '#6e4a1c', 'stroke-width': 7 }, S); hide(doorFill);
    const door = svgEl('path', { d: `M${d0} ${Y + rh} L${d0} ${Y + rh - (d1 - d0)} A${d1 - d0} ${d1 - d0} 0 0 1 ${d1} ${Y + rh}`, fill: 'none', stroke: '#8a8478', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, S); hide(door);
    txt(S, X + rw / 2, Y - 12, '13 ft 3 in', { 'font-size': 18 }); txt(S, X - 10, Y + rh / 2, '11 ft 6 in', { 'font-size': 18, 'text-anchor': 'end' });
    const dl = hide(txt(S, (d0 + d1) / 2, Y + rh + 26, 'door 2 ft 8 in', { 'font-size': 16, fill: '#a8680a' }));
    // the strip of 8 ft pieces
    const PX = 20, PL = W - 40, ps = PL / 50, PY = 330;
    const need = add(stage, box(h('div', 'u3l6-need'), 0, 16), PX, PY + 48);
    const needL = hide(add(stage, box(h('div', 'u3l6-gtick', 'needed: 46 ft 10 in ≈ 46.83 ft'), 300, 20), PX + 46.83 * ps - 300, PY + 68));
    const pcs = [0, 1, 2, 3, 4, 5].map((i) => hide(add(stage, box(h('div', 'u3l6-piece', `8 ft`), 8 * ps - 4, 40), PX + i * 8 * ps, PY)));
    const left = hide(add(stage, box(h('div', 'u3l6-left', '1 ft 2 in left over'), 200, 26), PX + 48 * ps - 200, PY - 30));
    const leftBar = hide(add(stage, box(h('div', 'u3l6-leftbar'), (48 - 46.8333) * ps, 40), PX + 46.8333 * ps, PY));
    const l1 = line(stage, '(a) 24 ft 9 in × 2 = 48 ft 18 in = <b>49 ft 6 in</b>', TX, 10, TW, 'u3l6-eline sm'), l2 = line(stage, '(b) 49 ft 6 in − 2 ft 8 in = <b>46 ft 10 in</b>', TX, 62, TW, 'u3l6-eline sm');
    const l3 = line(stage, `(c) ${T('46.83\\div8\\approx5.85')}: round up to <b>6</b>`, TX, 114, TW, 'u3l6-eline sm'), l4 = line(stage, `${T('6\\times\\$13.98=\\$83.88')}`, TX, 166, TW, 'u3l6-eline sm');
    const l5 = line(stage, '(d) 48 ft − 46 ft 10 in = <b>1 ft 2 in</b> left over', TX, 218, TW, 'u3l6-eline sm');
    const sh = ok(stage, '5 pieces: too short', PX + 40 * ps - 200, PY - 40, { ok: false });
    return [
      { cap: '(a) One length and one width: 11 ft 6 in + 13 ft 3 in = 24 ft 9 in. Double it: 48 ft 18 in = <b>49 ft 6 in</b>.', run: async (c) => { await c.fadeIn(doorFill, 1); await drawIn(c, bb, 1500); await c.fadeIn(l1); } },
      { cap: '(b) No baseboard across the door: regroup 49 ft 6 in = 48 ft 18 in, then − 2 ft 8 in = <b>46 ft 10 in</b>.', run: async (c) => { await c.anim(doorFill, [{ opacity: 1 }, { opacity: 0 }], 400); doorFill.style.opacity = 0; await c.fadeIn(door); await c.fadeIn(dl); await c.fadeIn(l2); } },
      { cap: `(c) 46 ft 10 in ≈ 46.83 ft. ${T('46.83\\div8\\approx5.85')} pieces. 5 pieces are only 40 ft: too short.`, run: async (c) => { await tween(c, 900, (t) => { need.style.width = 46.83 * ps * t + 'px'; }); await c.fadeIn(needL); for (const p of pcs.slice(0, 5)) await c.fadeIn(p, 150); await stampIn(c, sh); } },
      { cap: `Round <b>up</b> to <b>6 pieces</b>: ${T('6\\times\\$13.98=\\$83.88')}.`, run: async (c) => { await c.anim(sh, [{ opacity: 1 }, { opacity: 0 }], 250); sh.style.opacity = 0; await c.pop(pcs[5]); await c.fadeIn(l3); await c.fadeIn(l4); } },
      { cap: '(d) 6 pieces = 48 ft. 48 ft − 46 ft 10 in = 47 ft 12 in − 46 ft 10 in = <b>1 ft 2 in</b> left over.', run: async (c) => { await c.fadeIn(leftBar); await c.fadeIn(left); await c.fadeIn(l5); } }
    ];
  }
};

/* =============================== Math History: Eratosthenes =============================== */
function histAnim() {
  const svg = document.getElementById('u3l6-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const SER = 'Georgia, serif';
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 30, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 20, fill: '#4a2c14' });
  // the Earth (angle drawn bigger than 7.2° so it can be seen)
  const cx = 230, cy = 272, R = 160, A = 24 * Math.PI / 180;
  mk('path', { d: `M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}`, fill: '#efe2c6', stroke: '#7a4a26', 'stroke-width': 3 });
  const sy = [cx, cy - R], al = [cx - R * Math.sin(A), cy - R * Math.cos(A)];
  const stick = (p, ang) => mk('line', { x1: p[0], y1: p[1], x2: p[0] - 34 * Math.sin(ang), y2: p[1] - 34 * Math.cos(ang), stroke: '#4a2c14', 'stroke-width': 4 });
  stick(sy, 0); stick(al, A);
  const t1 = mk('text', { x: sy[0] + 10, y: sy[1] + 22, 'font-family': SER, 'font-size': 15, fill: '#4a2c14' }); t1.textContent = 'Syene';
  const t2 = mk('text', { x: al[0] - 12, y: al[1] + 30, 'text-anchor': 'end', 'font-family': SER, 'font-size': 15, fill: '#4a2c14' }); t2.textContent = 'Alexandria';
  const rays = mk('g', {});
  for (const x of [al[0] - 20, al[0], sy[0], sy[0] + 40]) mk('line', { x1: x, y1: 44, x2: x, y2: x === sy[0] ? sy[1] - 34 : x === al[0] ? al[1] - 34 * Math.cos(A) : 110, stroke: '#b07a12', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, rays);
  const sun = mk('circle', { cx: 470, cy: 64, r: 22, fill: '#f4c64a', stroke: '#b07a12', 'stroke-width': 3 });
  const shadow = mk('line', { x1: al[0], y1: al[1], x2: al[0] - 34 * Math.sin(A) + 0, y2: al[1], stroke: '#4a2c14', 'stroke-width': 5, opacity: 0.35 });
  const ang1 = mk('text', { x: al[0] - 30, y: al[1] - 40, 'font-family': SER, 'font-size': 15, fill: '#b07a12', 'font-weight': 700 }); ang1.textContent = '7.2°';
  const radii = mk('path', { d: `M${sy[0]} ${sy[1]} L${cx} ${cy} L${al[0]} ${al[1]}`, fill: 'none', stroke: '#7a4a26', 'stroke-width': 2, 'stroke-dasharray': '5 5' });
  const ang2 = mk('text', { x: cx - 26, y: cy - 50, 'font-family': SER, 'font-size': 15, fill: '#b07a12', 'font-weight': 700 }); ang2.textContent = '7.2°';
  const dist = mk('text', { x: (sy[0] + al[0]) / 2 - 16, y: Math.min(sy[1], al[1]) - 46, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 15, fill: '#4a2c14' }); dist.textContent = '5000 stadia';
  // the pie of 50 slices
  const pg = mk('g', {}), pcx = 500, pcy = 200, pr = 66;
  for (let i = 0; i < 50; i++) { const a0 = i / 50 * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / 50 * 2 * Math.PI - Math.PI / 2; mk('path', { d: `M${pcx} ${pcy} L${pcx + pr * Math.cos(a0)} ${pcy + pr * Math.sin(a0)} A${pr} ${pr} 0 0 1 ${pcx + pr * Math.cos(a1)} ${pcy + pr * Math.sin(a1)} Z`, fill: i === 0 ? '#b07a12' : '#f6ecd8', stroke: '#c9b48e', 'stroke-width': 0.8 }, pg); }
  const pt = mk('text', { x: pcx, y: pcy + pr + 24, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 15, fill: '#4a2c14' }); pt.textContent = '1/50 of the circle';
  const note = mk('text', { x: 20, y: 292, 'font-family': SER, 'font-size': 12, fill: '#7a4a26' }); note.textContent = 'angles drawn bigger than real';
  const CAPS = [[0, 'Noon on the longest day: sunlight falls straight down'], [2.6, 'At Syene: no shadow. At Alexandria: a shadow'], [5.2, 'The shadow angle is 7.2° …the same angle at the centre'], [8.2, '7.2° is 1/50 of a circle: 50 × 5000 = 250 000 stadia']];
  const op = (e, v) => e.setAttribute('opacity', v);
  const clamp = (t) => Math.max(0, Math.min(1, t));
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, t] of CAPS) if (s >= t0) c = t; cap.textContent = c;
    op(rays, clamp(s / 1.2)); op(sun, 1);
    op(shadow, 0.35 * clamp((s - 2.6) / 0.8)); op(ang1, clamp((s - 5.2) / 0.6)); op(radii, clamp((s - 6) / 0.8)); op(ang2, clamp((s - 6.6) / 0.6));
    op(dist, clamp((s - 7) / 0.6)); op(pg, clamp((s - 8.2) / 0.8)); op(pt, clamp((s - 8.6) / 0.6));
  };
  void note;
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 11) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(12);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}

/* =============================== wiring =============================== */
figs();
histAnim();
mountExplainers({ walk, yard, missing, roll, piRatio, bike, semi, fence });

/* ============ Stand Up Break! — perimeter, missing sides, circumference and fencing, at the whiteboards ============ */
{
  const t1 = (v) => fx(v, 1), t2 = (v) => fx(v, 2);
  standup('u3l6', {
    intro: 'Sketch the shape first. Label every side. Estimate, then calculate. Is your answer a length (no small 2)?',
    levels: {
      BEG: (r) => r.pick([
        () => { const [w, a, b] = r.pick([['A rectangular classroom', 7, 12], ['A rectangular hockey bench area', 8, 14], ['A rectangular garden', 3, 9]]), l = r.int(a, b) + r.pick([0, 0.5]), wd = r.int(2, Math.max(3, Math.floor(l) - 1)) + r.pick([0, 0.5]); return { text: `${w} is <b>${l} m</b> by <b>${wd} m</b>. Find its perimeter.`, q: '', a: [`P=2(${l}+${wd})=2\\times${rnd(l + wd, 2)}`, `P=${rnd(2 * (l + wd), 2)}\\text{ m}`] }; },
        () => { const n = r.pick([3, 4, 5, 6, 8]), s = r.int(12, 45) / 10, nm = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' }[n]; return { text: `A ${nm} sign has ${n} equal sides, each <b>${s} cm</b> long. Find its perimeter.`, q: '', a: [`P=${n}\\times${s}=${rnd(n * s, 2)}\\text{ cm}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const [w, u] = r.pick([['round table', 'cm'], ['trampoline', 'm'], ['clock', 'cm'], ['fire pit', 'm']]), rr = u === 'm' ? r.int(5, 25) / 10 : r.int(8, 45), dd = rnd(2 * rr, 2), C = Math.PI * dd; return { text: `A ${w} has a <b>radius</b> of <b>${rr} ${u}</b>. Estimate the circumference, then find it to the nearest tenth.`, q: '', a: [`d=2\\times${rr}=${dd}\\text{ ${u}}`, `\\text{Estimate: }3\\times${dd}=${rnd(3 * dd, 2)}`, `C=\\pi\\times${dd}=${rnd(C, 3)}\\ldots\\approx${t1(C)}\\text{ ${u}}`] }; },
        () => { const W0 = r.int(9, 16), H0 = r.int(7, 12), tw = r.int(3, W0 - 4), rh = r.int(2, H0 - 3); return { text: `An L-shaped room (all corners right angles): bottom <b>${W0} m</b>, left side <b>${H0} m</b>, top <b>${tw} m</b>, right side <b>${rh} m</b>. Find the two missing sides and the perimeter.`, q: '', a: [`\\text{across: }${W0}-${tw}=${W0 - tw}\\text{ m}`, `\\text{up and down: }${H0}-${rh}=${H0 - rh}\\text{ m}`, `P=2(${W0}+${H0})=${2 * (W0 + H0)}\\text{ m}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const l = r.int(8, 20), w = r.int(5, 12), g = r.pick([1, 1.2, 1.5]), pl = r.pick([2.4, 2.5, 3]), pr = r.int(3999, 8999) / 100, need = 2 * (l + w) - g, n = Math.ceil(need / pl - 1e-9); return { text: `A yard is <b>${l} m by ${w} m</b>, with a <b>${g} m</b> gate gap. Fence panels are <b>${pl} m</b> long and cost <b>$${t2(pr)}</b> each. How many panels, and what is the cost?`, q: '', a: [`P=2(${l}+${w})=${2 * (l + w)};\\ ${2 * (l + w)}-${g}=${rnd(need, 2)}\\text{ m}`, `${rnd(need, 2)}\\div${pl}=${rnd(need / pl, 2)}\\ldots\\to${n}\\text{ panels}`, `${n}\\times\\$${t2(pr)}=\\$${t2(n * pr)}`] }; },
        () => { const dd = r.int(18, 60) / 10, roll = r.pick([4, 5, 6]), pr = r.int(1199, 2499) / 100, C = Math.PI * dd, n = Math.ceil(C / roll - 1e-9); return { text: `A round flower bed has a diameter of <b>${dd} m</b>. Edging comes in <b>${roll} m</b> rolls for <b>$${t2(pr)}</b>. How many rolls, and what is the cost?`, q: '', a: [`C=\\pi\\times${dd}=${rnd(C, 3)}\\ldots\\text{ m}`, `${rnd(C, 2)}\\div${roll}=${rnd(C / roll, 2)}\\ldots\\to${n}\\text{ roll${n === 1 ? '' : 's'}}`, `${n}\\times\\$${t2(pr)}=\\$${t2(n * pr)}`] }; }
      ])()
    }
  });
}
