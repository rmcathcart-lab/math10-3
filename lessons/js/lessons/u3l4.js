/* Math 10-3 · Unit 3 · Lesson 4 — Converting Length Within SI and Within Imperial.
 * Explainers: the SI staircase with the decimal point hopping (Example 1), why we multiply going down (Full notes:
 * a metre stick filling with centimetres), same unit first (Example 2: mixed units, a pipe cut, ordering on a number
 * line, Maya's run), the imperial multiply-or-divide machine (Example 3), unit factors cancelling (Full notes;
 * Example 4(a)), the inches ↔ feet-and-inches machine (Example 5, or any number of inches), 5.6 ft is not 5′ 6″
 * (Full notes; Example 6(c)), regroup and borrow in feet and inches (key idea and Example 7),
 * Owen's SUV and the garage door (Example 8), and lumber cut from 8 ft boards (Example 9).
 * Also the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const lerp = (a, b, t) => a + (b - a) * t;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const cbox = (cls, html) => h('div', cls + ' u3l4-c', `<div>${html}</div>`);
const lab = (host, html, cx, cy, w = 80, hh = 40, cls = '') => add(host, box(h('div', 'u3l4-fl ' + cls, html), w, hh), cx - w / 2, cy - hh / 2);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l4-svg' }), 0, 0);
const op = (c, el, to, ms = 350) => c.anim(el, [{ opacity: to }], ms);
const BRN = '#9a6a24', BLU = '#1f5bd6', ORG = '#e8a01e', RED = '#c93a33', GRN = '#12805a', INK = '#1c2230';
/** a clean decimal string (no float noise) */
const dec = (v) => String(parseFloat(v.toFixed(10)));
/** TeX number with a thin space in numbers of 5+ digits (as the booklet: 2750, 12\,500) */
const nT = (v) => { const s = dec(v), [i, f] = s.split('.'); const ii = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return f ? `${ii}.${f}` : ii; };
/** text number with a narrow no-break space in numbers of 5+ digits */
const nX = (v) => nT(v).replace(/\\,/g, '\u202f');
/** quarter-inches → mixed number (TeX) */
const qT = (q) => { const w = Math.floor(q / 4), r = q - 4 * w; if (!r) return String(w); const g = gcd(r, 4), f = `\\tfrac{${r / g}}{${4 / g}}`; return w ? w + f : f; };
const fiT = (ft, q) => `${ft}'\\,${qT(q)}''`;

/* ======================================================================================
 * 1. The SI staircase (Example 1)
 * ====================================================================================== */
const SU = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], SN = ['kilometre', 'hectometre', 'decametre', 'metre', 'decimetre', 'centimetre', 'millimetre'];
const E1 = { a: ['4.2', 'm', 'cm'], b: ['85', 'mm', 'cm'], c: ['2.75', 'km', 'm'], d: ['630', 'cm', 'm'], e: ['0.6', 'm', 'mm'], f: ['12500', 'm', 'km'], g: ['45', 'mm', 'm'] };
const POW = { 1: '10', 2: '100', 3: '1000' };
function shiftPoint(str, k) {
  // digits and point position; returns slots with pad flags, start/end point slot, and which slots stay at the end
  const p0 = str.includes('.') ? str.indexOf('.') : str.length, digs = str.replace('.', '').split('');
  const np = p0 + k, lead = Math.max(0, 1 - np), trail = Math.max(0, np - digs.length);
  const slots = [...Array(lead).fill('0').map((d) => ({ d, pad: true })), ...digs.map((d) => ({ d, pad: false })), ...Array(trail).fill('0').map((d) => ({ d, pad: true }))];
  const pStart = lead + p0, pEnd = lead + np;
  // the final number: drop extra leading zeros (keep one before the point) and trailing zeros after the point
  let first = 0; while (first < pEnd - 1 && slots[first].d === '0') first++;
  let last = slots.length - 1; while (last >= pEnd && slots[last].d === '0') last--;
  const keep = slots.map((s, i) => i >= first && i <= last);
  const value = Number(str) * 10 ** k;
  return { slots, pStart, pEnd, keep, value, showPoint: last >= pEnd };
}
const stairs = {
  title: 'The SI staircase',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, ...Object.keys(E1).map((k) => ({ v: k, label: `(${k}) ${nX(Number(E1[k][0]))} ${E1[k][1]} to ${E1[k][2]}` }))],
  ask: (k) => `Example 1(${k}): convert <b>${nX(Number(E1[k][0]))} ${E1[k][1]}</b> to <b>${E1[k][2]}</b>.`,
  make(stage, k, ex) {
    const W = ex.W, H = 430, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    const [num, from, to] = E1[k], i0 = SU.indexOf(from), i1 = SU.indexOf(to), n = Math.abs(i1 - i0), down = i1 > i0, kk = down ? n : -n;
    const SW = 120, sx = (i) => ox + 30 + i * SW, sy = (i) => 100 + i * 32, FLOOR = 330;
    const steps = SU.map((u, i) => add(stage, box(cbox('u3l4-step', `${u}<small>${SN[i]}</small>`), SW, FLOOR - sy(i)), sx(i), sy(i)));
    const R = shiftPoint(num, kk);
    const card = add(stage, box(cbox('u3l4-card', `${nX(Number(num))} ${from}`), SW - 6, 42), sx(i0) + 3, sy(i0) - 50); hide(card);
    const hops = [];
    for (let j = 0; j < n; j++) {
      const a = down ? i0 + j : i0 - j, b = down ? a + 1 : a - 1;
      const x1 = sx(a) + SW / 2, x2 = sx(b) + SW / 2, y1 = sy(a) - 54, y2 = sy(b) - 54, ym = Math.min(y1, y2) - 34;
      const g = svgEl('g', {}, svg);
      svgEl('path', { d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${ym} ${x2} ${y2}`, fill: 'none', stroke: down ? BLU : RED, 'stroke-width': 3.5, 'stroke-dasharray': '7 5' }, g);
      const t = svgEl('text', { x: (x1 + x2) / 2, y: ym + 8, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: down ? BLU : RED }, g); t.textContent = down ? '× 10' : '÷ 10';
      g.style.opacity = 0; hops.push(g);
    }
    // the digits and the decimal point
    const DX = ox + 470, DY = 350, DW = 40;
    const dRow = add(stage, h('div', 'u3l4-digits'), DX, DY);
    const dEls = R.slots.map((s) => { const e = h('span', 'u3l4-dg' + (s.pad ? ' pad' : ''), s.d); dRow.appendChild(e); if (s.pad) e.style.opacity = 0; return e; });
    const pt = add(stage, h('div', 'u3l4-pt'), DX + R.pStart * DW - 6, DY + 40);
    const dLab = lab(stage, `${from}`, DX + R.slots.length * DW + 34, DY + 26, 60, 30, 'u3l4-tag');
    const unitTo = hide(lab(stage, `${to}`, DX + R.slots.length * DW + 34, DY + 26, 60, 30, 'u3l4-tag'));
    hide(dRow, pt, dLab);
    const fac = `${down ? '×' : '÷'} ${POW[n]}`;
    const res = hide(add(stage, box(cbox('u3l4-res', `${nX(Number(num))} ${from} = ${nX(R.value)} ${to}`), 330, 50), ox + 40, 356));
    const ptMove = (c) => tween(c, 300 * n + 300, (t) => { pt.style.left = (DX + lerp(R.pStart, R.pEnd, t) * DW - 6) + 'px'; });
    return [
      { cap: `Start on the <b>${from}</b> step. <b>${to}</b> is ${n} step${n > 1 ? 's' : ''} <b>${down ? 'down' : 'up'}</b> the staircase.`, run: async (c) => { steps[i0].classList.add('on'); steps[i1].classList.add('on'); await c.pop(card); } },
      { cap: `${down ? 'Down' : 'Up'} ${n} step${n > 1 ? 's' : ''}: ${down ? '× 10' : '÷ 10'} for each step, so <b>${fac}</b>.`, run: async (c) => { for (const g of hops) await c.anim(g, [{ opacity: 0 }, { opacity: 1 }], 380); } },
      { cap: `${fac} moves the decimal point <b>${n} place${n > 1 ? 's' : ''} to the ${down ? 'right' : 'left'}</b>. Fill any empty places with zeros.`,
        run: async (c) => { await c.fadeIn(dRow); dLab.style.opacity = 1; pt.style.opacity = 1; await ptMove(c); for (let j = 0; j < dEls.length; j++) if (R.slots[j].pad) await c.pop(dEls[j], 260); dLab.style.opacity = 0; await c.fadeIn(unitTo); } },
      { cap: `${nX(Number(num))} ${from} = <b>${nX(R.value)} ${to}</b>. ${down ? 'A smaller unit, so a bigger number' : 'A bigger unit, so a smaller number'}. ✓`,
        run: async (c) => { await Promise.all(dEls.map((e, j) => (R.keep[j] ? Promise.resolve() : op(c, e, 0.15, 300)))); if (!R.showPoint) await op(c, pt, 0, 200); card.innerHTML = `<div>${nX(R.value)} ${to}</div>`; await c.anim(card, [{ left: card.style.left, top: card.style.top }, { left: (sx(i1) + 3) + 'px', top: (sy(i1) - 50) + 'px' }], 700); await c.pop(res); } }
    ];
  }
};

/* ======================================================================================
 * 1b. Why multiply going down? (Full notes)
 * ====================================================================================== */
const whyTimes = {
  title: 'One metre, filled with smaller units',
  height: 340,
  minW: 900,
  ask: 'Why does 4.2 m become a bigger number in centimetres?',
  make(stage, v, ex) {
    const W = ex.W, H = 340, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), X0 = ox + 50, L = 800;
    svgEl('rect', { x: X0, y: 60, width: L, height: 50, fill: '#f3b23c', stroke: '#8a5a0a', 'stroke-width': 3, rx: 3 }, svg);
    lab(stage, '<b>1 m</b>', X0 + L / 2, 36, 100, 30, 'u3l4-tag');
    const dm = svgEl('g', {}, svg); for (let i = 0; i < 10; i++) svgEl('rect', { x: X0 + i * 80, y: 140, width: 80, height: 44, fill: i % 2 ? '#fff' : '#fde2b0', stroke: '#8a5a0a', 'stroke-width': 2 }, dm);
    const cm = svgEl('g', {}, svg); for (let i = 0; i <= 100; i++) svgEl('line', { x1: X0 + i * 8, x2: X0 + i * 8, y1: 214, y2: 214 + (i % 10 ? 18 : 34), stroke: INK, 'stroke-width': i % 10 ? 1.4 : 2.6 }, cm);
    svgEl('rect', { x: X0, y: 214, width: L, height: 40, fill: 'none', stroke: '#8a5a0a', 'stroke-width': 2 }, cm);
    const l1 = lab(stage, '<b>10 dm</b> fit in 1 m', X0 + L / 2, 198, 200, 24, 'u3l4-small'), l2 = lab(stage, '<b>100 cm</b> fit in 1 m', X0 + L / 2, 268, 200, 24, 'u3l4-small');
    hide(dm, cm, l1, l2);
    const res = hide(add(stage, box(cbox('u3l4-res', `4.2 m = ${T('4.2\\times100')} = 420 cm`), 420, 48), ox + 240, 288));
    return [
      { cap: 'One metre stick.', run: (c) => c.sleep(200) },
      { cap: 'One step down: <b>10 decimetres</b> fill the same length. 10 times as many pieces.', run: async (c) => { await c.fadeIn(dm); await c.fadeIn(l1); } },
      { cap: 'Another step down: each decimetre holds 10 cm, so <b>100 centimetres</b> fill one metre.', run: async (c) => { await c.fadeIn(cm); await c.fadeIn(l2); } },
      { cap: 'Smaller pieces, <b>more</b> of them. So going down, the number gets bigger: <b>multiply</b>.', run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 1c. Same unit first (Example 2)
 * ====================================================================================== */
const sameUnit = {
  title: 'Same unit first',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a) 3 m 45 cm' }, { v: 'b', label: '(b) the pipe' }, { v: 'c', label: '(c) put in order' }, { v: 'd', label: '(d) Maya’s run' }],
  ask: (v) => ({ a: 'Example 2(a): write 3 m 45 cm in centimetres, and in metres.', b: 'Example 2(b): 65 cm is cut off a 2.4 m pipe. How long is the piece left?', c: 'Example 2(c): order 1.2 km, 950 m, 125&#8239;000 cm and 1&#8239;300&#8239;000 mm from shortest to longest.', d: 'Example 2(d): Maya runs 4 laps of a 400 m track, then 1.8 km home. How far in km?' }[v]),
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    const bar = (x, y, w, hh, fill, html) => { const e = add(stage, box(h('div', 'u3l4-bar', html), w, hh), x, y); e.style.background = fill; return e; };
    if (v === 'a') {
      const k = 2, X0 = ox + 60;
      const ms = [0, 1, 2].map((i) => bar(X0 + i * 200 * k / 2, 90, 200 * k / 2, 56, i % 2 ? '#fde2b0' : '#f3b23c', '1 m'));
      const c45 = bar(X0 + 600 * k / 2, 90, 45 * k, 56, '#d8e6f8', '45 cm'); c45.style.borderColor = BLU;
      hide(...ms, c45);
      const L1 = hide(lab(stage, T('3\\text{ m}=3\\times100=300\\text{ cm}'), ox + 450, 200, 520, 46, 'u3l4-line'));
      const L2 = hide(lab(stage, T('300+45=345\\text{ cm}'), ox + 450, 260, 520, 46, 'u3l4-line'));
      const L3 = hide(add(stage, box(cbox('u3l4-res', `${T('345\\div100=3.45')} m`), 300, 50), ox + 300, 310));
      return [
        { cap: '3 m 45 cm uses <b>two units</b>: 3 metres and 45 more centimetres.', run: async (c) => { for (const m of ms) await c.pop(m, 260); await c.pop(c45, 260); } },
        { cap: 'Change the metres to centimetres: each metre is 100 cm.', run: async (c) => { ms.forEach((m) => { m.textContent = '100 cm'; }); await Promise.all(ms.map((m) => pulse(c, m, 1.05))); await c.fadeIn(L1); } },
        { cap: 'Add the extra 45 cm: <b>345 cm</b>.', run: (c) => c.fadeIn(L2) },
        { cap: 'In metres: up 2 steps, ÷ 100: <b>3.45 m</b>.', run: (c) => c.pop(L3) }
      ];
    }
    if (v === 'b') {
      const k = 3, X0 = ox + 60, Y = 110;
      const pipe = bar(X0, Y, 240 * k, 50, '#c9ced8', '2.4 m'); pipe.style.borderColor = '#5d6675';
      const keep = hide(bar(X0, Y, 175 * k, 50, '#c9ced8', '')); keep.style.borderColor = '#5d6675';
      const cut = hide(bar(X0 + 175 * k, Y, 65 * k, 50, '#f6c9c4', '65 cm')); cut.style.borderColor = RED;
      const saw = svgEl('line', { x1: X0 + 175 * k, x2: X0 + 175 * k, y1: Y - 24, y2: Y + 74, stroke: RED, 'stroke-width': 3.5, 'stroke-dasharray': '7 5' }, svg); saw.style.opacity = 0;
      const L1 = hide(lab(stage, T('2.4\\text{ m}=2.4\\times100=240\\text{ cm}'), ox + 450, 220, 520, 46, 'u3l4-line'));
      const L2 = hide(lab(stage, T('240-65=175\\text{ cm}'), ox + 450, 280, 520, 46, 'u3l4-line'));
      const L3 = hide(add(stage, box(cbox('u3l4-res', 'The piece left is <b>175 cm = 1.75 m</b>'), 420, 50), ox + 240, 330));
      return [
        { cap: 'The pipe is in <b>metres</b> but the cut is in <b>centimetres</b>. Change the pipe to cm first.', run: async (c) => { pipe.innerHTML = '240 cm'; await pulse(c, pipe, 1.04); await c.fadeIn(L1); } },
        { cap: 'Cut 65 cm off the end.', run: async (c) => { await op(c, saw, 1); pipe.style.opacity = 0; keep.style.opacity = 1; cut.style.opacity = 1; await c.anim(cut, [{ transform: 'translateX(0)' }, { transform: 'translateX(60px) rotate(4deg)', opacity: 0.6 }], 700); } },
        { cap: 'Subtract: <b>240 − 65 = 175 cm</b>.', run: async (c) => { keep.innerHTML = '175 cm'; await c.fadeIn(L2); } },
        { cap: 'In metres: 175 ÷ 100 = <b>1.75 m</b>.', run: (c) => c.pop(L3) }
      ];
    }
    if (v === 'c') {
      const items = [['1.2 km', 1200, '1.2 × 1000'], ['950 m', 950, 'already m'], ['125\u202f000 cm', 1250, '÷ 100'], ['1\u202f300\u202f000 mm', 1300, '÷ 1000']];
      const cards = items.map(([t], i) => add(stage, box(cbox('u3l4-card', `<b>${t}</b>`), 200, 50), ox + 20 + i * 220, 20));
      const subs = items.map(([, m, how], i) => hide(lab(stage, `= <b>${nX(m)} m</b> <span class="u3l4-small">(${how})</span>`, ox + 120 + i * 220, 96, 210, 30, 'u3l4-tag')));
      const NX = (m) => ox + 60 + (m - 900) / 450 * 780, NY = 250;
      const nl = svgEl('g', {}, svg);
      svgEl('line', { x1: ox + 40, x2: ox + 860, y1: NY, y2: NY, stroke: INK, 'stroke-width': 3 }, nl);
      for (let m = 900; m <= 1350; m += 50) { svgEl('line', { x1: NX(m), x2: NX(m), y1: NY - 9, y2: NY + 9, stroke: INK, 'stroke-width': 2 }, nl); const t = svgEl('text', { x: NX(m), y: NY + 32, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: INK }, nl); t.textContent = m; }
      const tm = svgEl('text', { x: ox + 868, y: NY + 32, 'font-size': 17, 'font-weight': 800, fill: INK }, nl); tm.textContent = 'm';
      nl.style.opacity = 0;
      const dots = items.map(([t, m], i) => { const g = svgEl('g', {}, svg); svgEl('circle', { cx: NX(m), cy: NY, r: 10, fill: [BLU, BRN, GRN, RED][i] }, g); const tt = svgEl('text', { x: NX(m), y: NY - 22 - (i === 2 ? 26 : 0), 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: [BLU, BRN, GRN, RED][i] }, g); tt.textContent = t; g.style.opacity = 0; return g; });
      const res = hide(add(stage, box(cbox('u3l4-res', 'Shortest to longest: 950 m, 1.2 km, 125&#8239;000 cm, 1&#8239;300&#8239;000 mm'), 760, 50), ox + 70, 330));
      return [
        { cap: 'Four lengths in four different units. Change them all to <b>metres</b>.', run: async (c) => { for (const s of subs) await c.fadeIn(s); } },
        { cap: 'Put each one on a number line in metres.', run: async (c) => { await op(c, nl, 1, 400); for (const d of dots) await c.pop(d, 300); } },
        { cap: 'Read left to right: <b>shortest to longest</b>.', run: (c) => c.pop(res) }
      ];
    }
    // d: Maya
    const NX = (km) => ox + 60 + km / 3.6 * 780, NY = 230;
    const nl = svgEl('g', {}, svg);
    svgEl('line', { x1: ox + 40, x2: ox + 860, y1: NY, y2: NY, stroke: INK, 'stroke-width': 3 }, nl);
    for (let i = 0; i <= 36; i += 2) { const km = i / 10; svgEl('line', { x1: NX(km), x2: NX(km), y1: NY - 8, y2: NY + 8, stroke: INK, 'stroke-width': i % 10 ? 1.6 : 2.6 }, nl); if (i % 4 === 0) { const t = svgEl('text', { x: NX(km), y: NY + 30, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: INK }, nl); t.textContent = dec(km); } }
    const tk = svgEl('text', { x: ox + 866, y: NY + 30, 'font-size': 17, 'font-weight': 800, fill: INK }, nl); tk.textContent = 'km';
    const hop = (a, b, color, label, up) => { const g = svgEl('g', {}, svg), x1 = NX(a), x2 = NX(b), ym = NY - (up || 60); svgEl('path', { d: `M${x1} ${NY - 4} Q${(x1 + x2) / 2} ${ym} ${x2} ${NY - 4}`, fill: 'none', stroke: color, 'stroke-width': 3.5 }, g); const t = svgEl('text', { x: (x1 + x2) / 2, y: ym + 22, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: color }, g); t.textContent = label; g.style.opacity = 0; return g; };
    const laps = [0, 1, 2, 3].map((i) => hop(i * 0.4, (i + 1) * 0.4, BLU, '400 m', 70));
    const road = hop(1.6, 3.4, BRN, '1.8 km (road)', 120);
    const L1 = hide(lab(stage, T('4\\times400=1600\\text{ m}=1.6\\text{ km}'), ox + 300, 60, 440, 44, 'u3l4-line'));
    const res = hide(add(stage, box(cbox('u3l4-res', `${T('1.6+1.8=3.4')} km. Maya runs <b>3.4 km</b>.`), 500, 50), ox + 200, 310));
    return [
      { cap: 'The track is in <b>metres</b>, the road in <b>kilometres</b>. Start with the 4 laps.', run: async (c) => { for (const l of laps) await c.anim(l, [{ opacity: 0 }, { opacity: 1 }], 300); } },
      { cap: '4 × 400 = 1600 m. Up 3 steps (÷ 1000): <b>1.6 km</b>.', run: (c) => c.fadeIn(L1) },
      { cap: 'Then 1.8 km on the road.', run: (c) => op(c, road, 1, 500) },
      { cap: 'Both in km now: 1.6 + 1.8 = <b>3.4 km</b>.', run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 2. The imperial machine (Example 3)
 * ====================================================================================== */
const IU = ['mi', 'yd', 'ft', 'in'], IF = [1760, 3, 12];
const E3 = { a: [9, 'ft', 'in'], b: [66, 'in', 'ft'], c: [15, 'ft', 'yd'], d: [4.5, 'yd', 'ft'], e: [2, 'mi', 'ft'], f: [7920, 'ft', 'mi'] };
const impMachine = {
  title: 'Multiply or divide?',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, ...Object.keys(E3).map((k) => ({ v: k, label: `(${k}) ${nX(E3[k][0])} ${E3[k][1]} to ${E3[k][2]}` }))],
  ask: (k) => `Example 3(${k}): convert <b>${nX(E3[k][0])} ${E3[k][1]}</b> to <b>${E3[k][2]}</b>.`,
  make(stage, k, ex) {
    const W = ex.W, H = 400, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    const [v, from, to] = E3[k], i0 = IU.indexOf(from), i1 = IU.indexOf(to), smaller = i1 > i0;
    const fac = (from === 'mi' || to === 'mi') && (from === 'ft' || to === 'ft') ? 5280 : IF[Math.min(i0, i1)];
    const res = smaller ? v * fac : v / fac;
    const BX = (i) => ox + 60 + i * 250, BY = 150, BW = 90;
    const boxes = IU.map((u, i) => add(stage, box(cbox('u3l4-step', u), BW, 56), BX(i), BY));
    boxes.forEach((b) => { b.style.borderRadius = '10px'; });
    for (let i = 0; i < 3; i++) {
      const x1 = BX(i) + BW + 6, x2 = BX(i + 1) - 6;
      svgEl('path', { d: `M${x1} ${BY + 18} H${x2 - 8} M${x2 - 16} ${BY + 10} L${x2} ${BY + 18} L${x2 - 16} ${BY + 26}`, stroke: BLU, 'stroke-width': 3, fill: 'none' }, svg);
      svgEl('path', { d: `M${x2} ${BY + 40} H${x1 + 8} M${x1 + 16} ${BY + 32} L${x1} ${BY + 40} L${x1 + 16} ${BY + 48}`, stroke: RED, 'stroke-width': 3, fill: 'none' }, svg);
      const t1 = svgEl('text', { x: (x1 + x2) / 2, y: BY + 8, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: BLU }, svg); t1.textContent = `× ${IF[i]}`;
      const t2 = svgEl('text', { x: (x1 + x2) / 2, y: BY + 68, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: RED }, svg); t2.textContent = `÷ ${IF[i]}`;
    }
    // the 5280 bypass from mi to ft
    const by = svgEl('g', {}, svg);
    svgEl('path', { d: `M${BX(0) + BW / 2} ${BY - 6} Q${(BX(0) + BX(2) + BW) / 2} ${BY - 110} ${BX(2) + BW / 2} ${BY - 6}`, stroke: '#7b4fc4', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '7 5' }, by);
    const bt = svgEl('text', { x: (BX(0) + BX(2) + BW) / 2, y: BY - 66, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: '#7b4fc4' }, by); bt.textContent = '× 5280   ÷ 5280';
    by.style.opacity = fac === 5280 ? 1 : 0.18;
    const note = lab(stage, 'to a smaller unit: multiply →', ox + 250, 296, 300, 26, 'u3l4-small'), note2 = lab(stage, '← to a bigger unit: divide', ox + 650, 296, 300, 26, 'u3l4-small');
    void note; void note2;
    const card = hide(add(stage, box(cbox('u3l4-card blue', `${nX(v)} ${from}`), 150, 46), Math.max(ox + 4, Math.min(ox + 745, BX(i0) + BW / 2 - 75)), BY + 80));
    const work = hide(lab(stage, T(`${nT(v)}${smaller ? '\\times' : '\\div'}${nT(fac)}=${nT(res)}`), ox + 300, 354, 440, 54, 'u3l4-line'));
    const resC = hide(add(stage, box(cbox('u3l4-res', `${nX(v)} ${from} = ${nX(res)} ${to}`), 300, 50), ox + 570, 330));
    return [
      { cap: `${from} to <b>${to}</b>: is ${to} a <b>${smaller ? 'smaller' : 'bigger'}</b> unit? Yes: it is to the ${smaller ? 'right' : 'left'}.`, run: async (c) => { boxes[i0].classList.add('on'); boxes[i1].classList.add('on'); await c.pop(card); } },
      { cap: `To a ${smaller ? 'smaller unit: <b>multiply</b>' : 'bigger unit: <b>divide</b>'} by <b>${nX(fac)}</b>${fac === 5280 ? ' (5280 ft = 1 mi)' : ''}.`, run: async (c) => { await c.anim(card, [{ left: card.style.left }, { left: Math.min(ox + 745, BX(i1) + BW / 2 - 75) + 'px' }], 900); await c.fadeIn(work); } },
      { cap: `${nX(v)} ${from} = <b>${nX(res)} ${to}</b>. ${smaller ? 'Smaller unit, bigger number' : 'Bigger unit, smaller number'}. ✓`, run: async (c) => { card.innerHTML = `<div>${nX(res)} ${to}</div>`; await pulse(c, card, 1.08); await c.pop(resC); } }
    ];
  }
};

/* ======================================================================================
 * 2b. Unit factors (Full notes; Example 4(a))
 * ====================================================================================== */
const UF = {
  ft: { lines: ['7\\text{ ft}\\times\\dfrac{12\\text{ in}}{1\\text{ ft}}', '7\\,\\cancel{\\text{ft}}\\times\\dfrac{12\\text{ in}}{1\\,\\cancel{\\text{ft}}}', '=7\\times12=84\\text{ in}'], want: 'in', have: 'ft', what: '7 ft to inches' },
  in: { lines: ['54\\text{ in}\\times\\dfrac{1\\text{ ft}}{12\\text{ in}}', '54\\,\\cancel{\\text{in}}\\times\\dfrac{1\\text{ ft}}{12\\,\\cancel{\\text{in}}}', '=54\\div12=4.5\\text{ ft}'], want: 'ft', have: 'in', what: '54 in to feet' },
  yd: { lines: ['100\\text{ yd}\\times\\dfrac{3\\text{ ft}}{1\\text{ yd}}\\times\\dfrac{12\\text{ in}}{1\\text{ ft}}', '100\\,\\cancel{\\text{yd}}\\times\\dfrac{3\\,\\cancel{\\text{ft}}}{1\\,\\cancel{\\text{yd}}}\\times\\dfrac{12\\text{ in}}{1\\,\\cancel{\\text{ft}}}', '=100\\times3\\times12=3600\\text{ in}'], want: 'in', have: 'yd', what: 'Example 4(a): 100 yd to inches' }
};
const unitFactor = {
  title: 'Unit factors cancel the old unit',
  height: 330,
  minW: 900,
  choices: [{ v: 'ft', label: '7 ft to in' }, { v: 'in', label: '54 in to ft' }, { sep: 'Example 4 check:' }, { v: 'yd', label: '(a) 100 yd to in' }],
  ask: (k) => `Convert ${UF[k].what.replace('Example 4(a): ', 'Example 4(a): ')} with unit factors.`,
  make(stage, k, ex) {
    const W = ex.W, ox = (W - 900) / 2, d = UF[k];
    const L = d.lines.map((t, i) => hide(lab(stage, T(t), ox + 450, 60 + i * 96, 860, 84, 'u3l4-line')));
    L.forEach((e) => { e.style.fontSize = '27px'; });
    return [
      { cap: k === 'yd' ? 'Two steps: yd to ft (× 3), then ft to in (× 12). Write a unit factor for each, the unit you <b>want</b> on top.' : `You want <b>${d.want}</b>: put ${d.want} on <b>top</b>. You have <b>${d.have}</b>: put ${d.have} on the <b>bottom</b>.`, run: (c) => c.fadeIn(L[0]) },
      { cap: k === 'yd' ? 'Each unit on the top cancels the same unit on the bottom: yd and ft cancel.' : `${d.have} is on the top and the bottom, so it <b>cancels</b>.`, run: (c) => c.fadeIn(L[1]) },
      { cap: `Only <b>${d.want}</b> is left. Do the arithmetic.`, run: (c) => c.pop(L[2]) }
    ];
  }
};

/* ======================================================================================
 * 3. The inches ↔ feet-and-inches machine (Example 5, or any number of inches)
 * ====================================================================================== */
const E5 = { a: { m: 'toin', ft: 6, q: 8, t: "6'\\,2''" }, b: { m: 'toin', ft: 5, q: 42, t: "5'\\,10\\tfrac12''" }, c: { m: 'toftin', n: 45 }, d: { m: 'toftin', n: 130 },
  e: { m: 'todec', ft: 8, i: 6, t: "8'\\,6''" }, f: { m: 'todec', ft: 3, i: 4, t: "3'\\,4''" }, g: { m: 'fromdec', d: 7.25 }, h: { m: 'fromdec', d: 5.6 } };
const ftin = {
  title: 'The inches ↔ feet-and-inches machine',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: "(a) 6′ 2″" }, { v: 'b', label: '(b) 5′ 10½″' }, { v: 'c', label: '(c) 45 in' }, { v: 'd', label: '(d) 130 in' }, { v: 'e', label: "(e) 8′ 6″" }, { v: 'f', label: "(f) 3′ 4″" }, { v: 'g', label: '(g) 7.25 ft' }, { v: 'h', label: '(h) 5.6 ft' }, { sep: 'Inches to feet and inches:' }],
  custom: [13, 400],
  ask: (k) => {
    if (typeof k === 'number') return `Change <b>${k} in</b> to feet and inches.`;
    const d = E5[k], what = d.m === 'toin' ? `${T(d.t)} to inches` : d.m === 'toftin' ? `${d.n} in to feet and inches` : d.m === 'todec' ? `${T(d.t)} to decimal feet` : `${d.d} ft to feet and inches`;
    return `Example 5(${k}): change <b>${what}</b>.`;
  },
  make(stage, k, ex) {
    const W = ex.W, H = 430, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    const d = typeof k === 'number' ? { m: 'toftin', n: k } : E5[k];
    // the whole length as a bar of 12-inch foot pieces (+ leftover inches)
    const totalIn = d.m === 'toin' ? d.ft * 12 + d.q / 4 : d.m === 'toftin' ? d.n : d.m === 'todec' ? d.ft * 12 + d.i : d.d * 12;
    const s = Math.min(9, 840 / totalIn), X0 = ox + 30, BY = 70, BH = 46;
    const feet = Math.floor(totalIn / 12 + 1e-9), left = totalIn - feet * 12;
    const fEls = [];
    for (let i = 0; i < feet; i++) { const e = add(stage, box(h('div', 'u3l4-bar', 12 * s >= 44 ? `${i + 1} ft` : 12 * s >= 22 ? `${i + 1}` : ''), 12 * s, BH), X0 + i * 12 * s, BY); e.style.background = i % 2 ? '#e7d3b0' : '#d9c39a'; fEls.push(e); }
    const lEl = left > 1e-9 ? add(stage, box(h('div', 'u3l4-bar', left * s >= 40 ? `${dec(Math.round(left * 100) / 100)} in` : ''), left * s, BH), X0 + feet * 12 * s, BY) : null;
    if (lEl) { lEl.style.background = '#fde2b0'; lEl.style.borderColor = ORG; }
    const all = [...fEls, lEl].filter(Boolean);
    const LX = ox + 450, line = (t, y) => hide(lab(stage, T(t), LX, y, 860, 50, 'u3l4-line'));
    // one foot made bigger (for decimal feet)
    const big = (shade, tenthsToo) => {
      const g = svgEl('g', {}, svg), FX = ox + 90, FW = 720, FY = 170;
      svgEl('rect', { x: FX, y: FY, width: FW, height: 50, fill: '#fff', stroke: '#6e4a1c', 'stroke-width': 2.5 }, g);
      const sh = svgEl('rect', { x: FX, y: FY, width: 0, height: 50, fill: '#fde2b0' }, g);
      for (let i = 0; i <= 12; i++) { svgEl('line', { x1: FX + i * 60, x2: FX + i * 60, y1: FY, y2: FY + 50, stroke: '#6e4a1c', 'stroke-width': i % 12 ? 1.6 : 3 }, g); if (i) { const t = svgEl('text', { x: FX + i * 60 - 30, y: FY + 32, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: '#6e4a1c' }, g); t.textContent = i; } }
      const t1 = svgEl('text', { x: FX - 10, y: FY + 32, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 800, fill: '#6e4a1c' }, g); t1.textContent = 'inches';
      const dg = svgEl('g', {}, g);
      if (tenthsToo) {
        for (let i = 0; i <= 10; i++) { svgEl('line', { x1: FX + i * 72, x2: FX + i * 72, y1: FY + 56, y2: FY + 70, stroke: '#7b4fc4', 'stroke-width': 2 }, dg); const t = svgEl('text', { x: FX + i * 72, y: FY + 90, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#7b4fc4' }, dg); t.textContent = i ? (i === 10 ? '1' : `0.${i}`) : '0'; }
        const t2 = svgEl('text', { x: FX - 10, y: FY + 72, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 800, fill: '#7b4fc4' }, dg); t2.textContent = 'feet';
      }
      const hd = lab(stage, '<b>one foot</b>, made bigger', ox + 450, FY - 18, 260, 26, 'u3l4-tag');
      g.style.opacity = 0; hd.style.opacity = 0;
      return { g, sh, hd, setShade: (frac) => sh.setAttribute('width', FW * frac), dg };
    };
    if (d.m === 'toftin') {
      const n = d.n, q = n / 12, rem = n - feet * 12;
      hide(...all);
      const one = add(stage, box(h('div', 'u3l4-bar', `${n} in`), n * s, BH), X0, BY); one.style.background = '#d8e6f8'; one.style.borderColor = BLU;
      const L1 = line(`${n}\\div12=${dec(Math.round(q * 1000) / 1000)}${Math.abs(q * 1000 - Math.round(q * 1000)) > 1e-6 ? '\\ldots' : ''}`, 200), L2 = line(`${n}-${feet}\\times12=${n}-${feet * 12}=${rem}`, 262);
      const res = hide(add(stage, box(cbox('u3l4-res', `${n} in = ${T(`${feet}'\\,${rem}''`)}`), 300, 52), ox + 300, 330));
      return [
        { cap: `${n} inches in one long piece. How many whole feet (12 in) fit? <b>${n} ÷ 12</b>.`, run: (c) => c.fadeIn(L1) },
        { cap: `The whole number is the feet: <b>${feet} ft</b>. Cut off ${feet} pieces of 12 in.`, run: async (c) => { await op(c, one, 0, 250); for (const e of fEls) await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], Math.max(60, 400 / feet)); } },
        { cap: `Inches left: ${n} − ${feet} × 12 = <b>${rem} in</b>${rem ? '' : ' (none!)'}.`, run: async (c) => { if (lEl) await c.pop(lEl); await c.fadeIn(L2); } },
        { cap: `So ${n} in = <b>${T(`${feet}'\\,${rem}''`)}</b>. The inches part is less than 12. ✓`, run: (c) => c.pop(res) }
      ];
    }
    if (d.m === 'toin') {
      const inT = qT(d.q), tot = d.ft * 48 + d.q;
      const L1 = line(`${d.ft}\\times12=${d.ft * 12}`, 200), L2 = line(`${d.ft * 12}+${inT}=${qT(tot)}`, 262);
      const res = hide(add(stage, box(cbox('u3l4-res', `${T(d.t)} = ${T(qT(tot))} in`), 320, 52), ox + 290, 330));
      return [
        { cap: `${T(d.t)} is ${d.ft} feet and ${T(inT)} more inches.`, run: async (c) => { if (lEl) await pulse(c, lEl, 1.15); } },
        { cap: `Each foot is 12 in: <b>${d.ft} × 12 = ${d.ft * 12} in</b>.`, run: async (c) => { fEls.forEach((e) => { e.textContent = '12'; }); await Promise.all(fEls.map((e) => pulse(c, e, 1.06))); await c.fadeIn(L1); } },
        { cap: `Add the extra inches: <b>${d.ft * 12} + ${T(inT)} = ${T(qT(tot))} in</b>.`, run: (c) => c.fadeIn(L2) },
        { cap: `So ${T(d.t)} = <b>${T(qT(tot))} in</b>.`, run: (c) => c.pop(res) }
      ];
    }
    if (d.m === 'todec') {
      const B = big(true, true), fr = d.i / 12, frS = dec(Math.round(fr * 1000) / 1000), exact = Math.abs(fr * 100 - Math.round(fr * 100)) < 1e-9;
      const val = d.ft + fr, valS = exact ? dec(val) : dec(Math.round(val * 100) / 100);
      const L1 = line(`${d.i}\\div12=${frS}${exact ? '' : '\\ldots'}`, 300), L2 = line(`${d.ft}+${frS}${exact ? '' : '\\ldots'}${exact ? '=' : '\\approx'}${valS}`, 356);
      const res = hide(add(stage, box(cbox('u3l4-res', `${T(d.t)} ${exact ? '=' : '≈'} ${valS} ft`), 270, 50), ox + 620, 378));
      return [
        { cap: `${T(d.t)}: ${d.ft} whole feet and <b>${d.i} inches</b> of the next foot.`, run: (c) => c.sleep(200) },
        { cap: `Look at that last foot. ${d.i} in is <b>${d.i} of the 12</b> inches in a foot.`, run: async (c) => { await c.fadeIn(B.g); B.hd.style.opacity = 1; await tween(c, 700, (t) => B.setShade(fr * t)); } },
        { cap: `As a decimal: <b>${d.i} ÷ 12 = ${frS}${exact ? '' : '…'}</b> of a foot (read it on the purple feet scale).`, run: (c) => c.fadeIn(L1) },
        { cap: `Add the whole feet: <b>${valS} ft</b>${exact ? '' : ' (to the nearest hundredth)'}.`, run: async (c) => { await c.fadeIn(L2); await c.pop(res); } }
      ];
    }
    // fromdec
    const B = big(true, true), fr = Math.round((d.d - Math.floor(d.d)) * 100) / 100, inch = Math.round(fr * 12 * 100) / 100, near = Math.round(inch), wf = Math.floor(d.d);
    const L1 = line(`${dec(fr)}\\times12=${dec(inch)}${inch === near ? '' : `\\approx${near}`}`, 300);
    const res = hide(add(stage, box(cbox('u3l4-res', `${d.d} ft ${inch === near ? '=' : '≈'} ${T(`${wf}'\\,${near}''`)}`), 280, 50), ox + 310, 360));
    return [
      { cap: `${d.d} ft: ${wf} whole feet and <b>${dec(fr)} of a foot</b>. The ${dec(fr)} is <b>not</b> inches!`, run: (c) => c.sleep(200) },
      { cap: `Show ${dec(fr)} of one foot on the purple feet scale.`, run: async (c) => { await c.fadeIn(B.g); B.hd.style.opacity = 1; await tween(c, 700, (t) => B.setShade(fr * t)); } },
      { cap: `Change it to inches: <b>× 12</b>. ${dec(fr)} × 12 = ${dec(inch)} in${inch === near ? '' : `, about ${near} in`}.`, run: (c) => c.fadeIn(L1) },
      { cap: `So ${d.d} ft ${inch === near ? '=' : '≈'} <b>${T(`${wf}'\\,${near}''`)}</b>.`, run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 3b. 5.6 ft is not 5′ 6″ (Full notes; Example 6(c))
 * ====================================================================================== */
const ND = { a: { dec: 0.6, w: 5, inch: 6, say: '5.6 ft vs 5′ 6″' }, c: { dec: 0.3, w: 7, inch: 3, say: '7.3 ft vs 7′ 3″' } };
const notDecimal = {
  title: 'Tenths of a foot vs inches',
  height: 400,
  minW: 900,
  choices: [{ v: 'a', label: '5.6 ft vs 5′ 6″' }, { sep: 'Example 6 check:' }, { v: 'c', label: '(c) 7.3 ft vs 7′ 3″' }],
  ask: (k) => (k === 'a' ? 'Is 5.6 ft the same as 5′ 6″?' : 'Example 6(c): which is longer, 7.3 ft or 7′ 3″? By how much?'),
  make(stage, k, ex) {
    const W = ex.W, H = 400, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), d = ND[k], FX = ox + 150, FW = 700;
    const row = (y, n, color, name) => {
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: FX, y, width: FW, height: 54, fill: '#fff', stroke: color, 'stroke-width': 2.5 }, g);
      const sh = svgEl('rect', { x: FX, y, width: 0, height: 54, fill: color, opacity: 0.22 }, g);
      for (let i = 0; i <= n; i++) { svgEl('line', { x1: FX + i * FW / n, x2: FX + i * FW / n, y1: y, y2: y + 54, stroke: color, 'stroke-width': i % n ? 1.6 : 3 }, g); if (i) { const t = svgEl('text', { x: FX + (i - 0.5) * FW / n, y: y + 34, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: color }, g); t.textContent = i; } }
      const t = svgEl('text', { x: FX - 12, y: y + 34, 'text-anchor': 'end', 'font-size': 17, 'font-weight': 800, fill: color }, g); t.textContent = name;
      return { g, sh };
    };
    lab(stage, '<b>one foot</b>, made bigger', ox + 500, 30, 260, 26, 'u3l4-tag');
    const A = row(60, 10, '#7b4fc4', 'tenths of a foot'), B = row(170, 12, BRN, 'inches');
    const ia = d.dec * 12, mk = svgEl('line', { x1: FX + d.dec * FW, x2: FX + d.dec * FW, y1: 50, y2: 236, stroke: RED, 'stroke-width': 3.5, 'stroke-dasharray': '7 5' }, svg); mk.style.opacity = 0;
    const lA = hide(lab(stage, `${d.w}.${dec(d.dec).slice(2)} ft: ${dec(d.dec)} of a foot`, FX + d.dec * FW / 2, 132, 280, 28, 'u3l4-tag')), lB = hide(lab(stage, T(`${d.w}'\\,${d.inch}''`) + `: ${d.inch} of 12 inches`, FX + d.inch / 12 * FW / 2, 242, 280, 32, 'u3l4-tag'));
    const st = hide(stamp(stage, 'not the same', { ok: false, x: ox + 760, y: 140, rotate: -8 }));
    const L1 = hide(lab(stage, T(`${dec(d.dec)}\\times12=${dec(ia)}\\text{ in}`), ox + 450, 296, 600, 48, 'u3l4-line'));
    const res = hide(add(stage, box(cbox('u3l4-res', k === 'a' ? `5.6 ft ≈ ${T("5'\\,7''")}, &nbsp; and &nbsp; ${T("5'\\,6''")} = 5.5 ft` : `7.3 ft = 7 ft 3.6 in: <b>7.3 ft is longer</b>, by ${T('3.6-3=0.6')} in`), 640, 50), ox + 130, 340));
    return [
      { cap: `<b>${d.w}.${dec(d.dec).slice(2)} ft</b> means ${d.w} feet and <b>${dec(d.dec)}</b> of a foot: ${Math.round(d.dec * 10)} of the 10 purple tenths.`, run: async (c) => { await tween(c, 600, (t) => A.sh.setAttribute('width', d.dec * FW * t)); await c.fadeIn(lA); } },
      { cap: `<b>${T(`${d.w}'\\,${d.inch}''`)}</b> means ${d.w} feet and <b>${d.inch} inches</b>: ${d.inch} of the 12 brown inches.`, run: async (c) => { await tween(c, 600, (t) => B.sh.setAttribute('width', d.inch / 12 * FW * t)); await c.fadeIn(lB); } },
      { cap: 'The shaded parts are <b>different lengths</b>. A tenth of a foot is bigger than an inch.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } },
      { cap: `To change ${dec(d.dec)} ft to inches, <b>multiply by 12</b>: ${dec(d.dec)} × 12 = ${dec(ia)} in. The red line lands at ${dec(ia)} on the inches.`, run: async (c) => { await op(c, mk, 1, 400); await c.fadeIn(L1); } },
      { cap: k === 'a' ? `So 5.6 ft is about <b>${T("5'\\,7''")}</b>, not ${T("5'\\,6''")}.` : `${T("7'\\,3''")} is 7 ft 3 in, so <b>7.3 ft</b> is longer, by <b>0.6 in</b>.`, run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 4. Regroup and borrow (key idea and Example 7)
 * ====================================================================================== */
// lengths as [feet, quarter-inches]; op '+', '-' or 'x' (n × first)
const AS = {
  k1: { a: [4, 28], b: [3, 40], op: '+', tag: 'Key idea' }, k2: { a: [9, 12], b: [5, 32], op: '-', tag: 'Key idea' },
  a: { a: [5, 36], b: [2, 32], op: '+', tag: 'Example 7(a)' }, b: { a: [11, 8], b: [6, 28], op: '-', tag: 'Example 7(b)' }, c: { a: [2, 36], n: 3, op: 'x', tag: 'Example 7(c)' },
  d: { a: [6, 18], b: [2, 39], op: '+', tag: 'Example 7(d)' }, e: { a: [8, 0], b: [3, 22], op: '-', tag: 'Example 7(e)', noIn: true }
};
const exprT = (d) => (d.op === 'x' ? `${d.n}\\times${fiT(...d.a)}` : `${d.noIn ? `${d.a[0]}'` : fiT(...d.a)}${d.op === '+' ? '+' : '-'}${fiT(...d.b)}`);
const addSub = {
  title: 'Feet with feet, inches with inches',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Key idea:' }, { v: 'k1', label: "4′ 7″ + 3′ 10″" }, { v: 'k2', label: "9′ 3″ − 5′ 8″" }, { sep: 'Example 7 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { v: 'e', label: '(e)' }],
  ask: (k) => `${AS[k].tag}: ${T(exprT(AS[k]))}. Write the answer with fewer than 12 inches.`,
  make(stage, k, ex) {
    const W = ex.W, ox = (W - 900) / 2, d = AS[k];
    const CX = { op: ox + 230, ft: ox + 340, in: ox + 520 }, RY = [104, 174, 262, 346], cell = (html, x, y, w = 160, cls = 'u3l4-col') => lab(stage, html, x, y, w, 60, cls);
    lab(stage, 'feet', CX.ft, 18, 120, 26, 'u3l4-hd'); lab(stage, 'inches', CX.in, 18, 140, 26, 'u3l4-hd');
    const svg = stageSvg(stage, W, 420);
    svgEl('line', { x1: ox + 190, x2: ox + 620, y1: 218, y2: 218, stroke: INK, 'stroke-width': 3.5 }, svg);
    const ft = (v) => T(`${v}'`), inn = (q) => T(`${qT(q)}''`);
    const topF = cell(ft(d.a[0]), CX.ft, RY[0]), topI = cell(d.noIn ? `<span style="opacity:.35">${inn(0)}</span>` : inn(d.a[1]), CX.in, RY[0]);
    if (d.op === 'x') { cell(T(`\\times${d.n}`), CX.op, RY[1], 100); }
    else { cell(d.op === '+' ? '+' : '−', CX.op, RY[1], 60); cell(ft(d.b[0]), CX.ft, RY[1]); cell(inn(d.b[1]), CX.in, RY[1]); }
    const side = (html, y) => hide(lab(stage, html, ox + 770, y, 260, 56, 'u3l4-line'));
    if (d.op === '+' || d.op === 'x') {
      const n = d.op === 'x' ? d.n : 1, F = d.op === 'x' ? n * d.a[0] : d.a[0] + d.b[0], Q = d.op === 'x' ? n * d.a[1] : d.a[1] + d.b[1];
      const carry = Math.floor(Q / 48), Q2 = Q - carry * 48, F2 = F + carry;
      const rF = hide(cell(ft(F), CX.ft, RY[2])), rI = hide(cell(inn(Q), CX.in, RY[2]));
      const chip = hide(add(stage, box(cbox('u3l4-chip', T(`${carry * 12}''\\to${carry}'`)), 150, 50), CX.in - 75, RY[2] + 36));
      const fF = hide(cell(ft(F2), CX.ft, RY[3])), fI = hide(cell(inn(Q2), CX.in, RY[3])), eq = hide(cell('=', CX.op, RY[3], 60));
      const fracNote = d.a[1] % 4 || (d.b && d.b[1] % 4) ? side(T(`\\tfrac{${d.a[1] % 4}}{4}+\\tfrac{${d.b[1] % 4}}{4}=${qT(d.a[1] % 4 + d.b[1] % 4)}`), RY[2]) : null;
      const first = d.op === 'x' ? `Multiply the feet and the inches by ${n}: ${T(`${n}\\times${d.a[0]}'=${F}'`)} and ${T(`${n}\\times${qT(d.a[1])}''=${qT(Q)}''`)}.` : `Add <b>feet to feet</b> and <b>inches to inches</b>: ${T(`${F}'\\,${qT(Q)}''`)}.${fracNote ? ` For the fractions: ${T('\\tfrac12+\\tfrac34=\\tfrac24+\\tfrac34=1\\tfrac14')}.` : ''}`;
      return [
        { cap: first, run: async (c) => { if (fracNote) await c.fadeIn(fracNote); await c.pop(rF); await c.pop(rI); } },
        { cap: `${T(`${qT(Q)}''`)} is 12 or more. Trade <b>${carry * 12} in for ${carry} ft</b>: ${T(`${qT(Q)}''=${carry}'\\,${qT(Q2)}''`)}.`, run: async (c) => { await c.pop(chip); await c.anim(chip, [{ transform: 'none' }, { transform: `translate(${CX.ft - CX.in}px, ${RY[3] - RY[2] - 36}px)`, opacity: 0.2 }], 900); chip.style.opacity = 0; await c.pop(eq); await c.pop(fF); } },
        { cap: `Answer: <b>${T(fiT(F2, Q2))}</b>, with fewer than 12 inches. ✓`, run: (c) => c.pop(fI) }
      ];
    }
    // subtract: borrow when the top inches are too few
    const borrow = d.a[1] < d.b[1], aF = borrow ? d.a[0] - 1 : d.a[0], aQ = borrow ? d.a[1] + 48 : d.a[1];
    const nF = hide(cell(T(`${aF}'`), CX.ft, RY[0] - 50, 100, 'u3l4-col')), nI = hide(cell(T(`${qT(aQ)}''`), CX.in, RY[0] - 50, 120, 'u3l4-col'));
    [nF, nI].forEach((e) => { e.style.color = ORG; e.style.fontSize = '24px'; });
    const strikeF = svgEl('line', { x1: CX.ft - 34, x2: CX.ft + 34, y1: RY[0] + 14, y2: RY[0] - 14, stroke: ORG, 'stroke-width': 4 }, svg), strikeI = svgEl('line', { x1: CX.in - 44, x2: CX.in + 44, y1: RY[0] + 14, y2: RY[0] - 14, stroke: ORG, 'stroke-width': 4 }, svg);
    strikeF.style.opacity = 0; strikeI.style.opacity = 0;
    const chip = hide(add(stage, box(cbox('u3l4-chip', T("1'\\to12''")), 150, 50), CX.ft - 75, RY[0] + 30));
    const rF = aF - d.b[0], rQ = aQ - d.b[1];
    const fF = hide(cell(ft(rF), CX.ft, RY[2])), fI = hide(cell(inn(rQ), CX.in, RY[2]));
    const topTxt = d.noIn ? `${d.a[0]}'` : fiT(...d.a);
    return [
      { cap: `The top has <b>too few inches</b>: ${T(`${qT(d.a[1])}''`)} is less than ${T(`${qT(d.b[1])}''`)}. <b>Borrow</b> 1 ft and turn it into 12 in: ${T(`${topTxt}=${fiT(aF, aQ)}`)}.`,
        run: async (c) => { await c.pop(chip); await c.anim(chip, [{ transform: 'none' }, { transform: `translateX(${CX.in - CX.ft}px)`, opacity: 0.2 }], 800); chip.style.opacity = 0; await op(c, strikeF, 1, 200); await op(c, strikeI, 1, 200); await c.pop(nF); await c.pop(nI); void topF; void topI; } },
      { cap: `Now subtract feet from feet and inches from inches: ${T(`${aF}-${d.b[0]}=${rF}`)} and ${T(`${qT(aQ)}-${qT(d.b[1])}=${qT(rQ)}`)}.`, run: async (c) => { await c.pop(fF); await c.pop(fI); } },
      { cap: `Answer: <b>${T(fiT(rF, rQ))}</b>.`, run: (c) => pulse(c, fI, 1.12) }
    ];
  }
};

/* ======================================================================================
 * 4c. Owen's SUV and the garage door (Example 8)
 * ====================================================================================== */
const garage = {
  title: 'Will it fit through the door?',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a', label: "(a) box adds 1′ 2″" }, { v: 'b', label: '(b) box adds 11½″' }],
  ask: (v) => `Example 8(${v}): the door is ${T("7'\\,0''")} high and the SUV is ${T("5'\\,11''")} tall. The cargo box adds ${T(v === 'a' ? "1'\\,2''" : "11\\tfrac12''")}. ${v === 'a' ? 'Will it fit?' : 'How much room is left?'}`,
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), k = 3.4, FL = 400;
    const doorTop = FL - 84 * k, carTop = FL - 71 * k, boxH = (v === 'a' ? 14 : 11.5) * k, total = 71 + (v === 'a' ? 14 : 11.5);
    // garage wall with the opening
    svgEl('rect', { x: ox + 40, y: doorTop - 40, width: 300, height: FL - doorTop + 40, fill: '#e9e1d2', stroke: '#9a8a6a', 'stroke-width': 2.5 }, svg);
    svgEl('rect', { x: ox + 90, y: doorTop, width: 200, height: FL - doorTop, fill: '#5d6675', stroke: '#3a4254', 'stroke-width': 3 }, svg);
    svgEl('line', { x1: ox + 20, x2: ox + 880, y1: FL, y2: FL, stroke: INK, 'stroke-width': 3.5 }, svg);
    const dl = svgEl('line', { x1: ox + 90, x2: ox + 880, y1: doorTop, y2: doorTop, stroke: BLU, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, svg);
    lab(stage, `door ${T("7'\\,0''")}`, ox + 190, doorTop + 30, 160, 34, 'u3l4-tag').style.color = '#fff';
    // the SUV (facing the door)
    const car = svgEl('g', {}, svg), x0 = ox + 470, bodyTop = FL - 46 * k;
    svgEl('path', { d: `M${x0 + 30} ${bodyTop} L${x0 + 70} ${carTop} L${x0 + 290} ${carTop} L${x0 + 330} ${bodyTop} Z`, fill: '#4f7fc4', stroke: '#1f3f8a', 'stroke-width': 3, 'stroke-linejoin': 'round' }, car);
    svgEl('rect', { x: x0, y: bodyTop, width: 380, height: FL - 14 * k - bodyTop, rx: 16, fill: '#4f7fc4', stroke: '#1f3f8a', 'stroke-width': 3 }, car);
    svgEl('path', { d: `M${x0 + 82} ${carTop + 14} L${x0 + 170} ${carTop + 14} L${x0 + 170} ${bodyTop - 4} L${x0 + 52} ${bodyTop - 4} Z M${x0 + 186} ${carTop + 14} L${x0 + 278} ${carTop + 14} L${x0 + 310} ${bodyTop - 4} L${x0 + 186} ${bodyTop - 4} Z`, fill: '#d8e6f8', stroke: '#1f3f8a', 'stroke-width': 2 }, car);
    [x0 + 80, x0 + 300].forEach((cx) => { svgEl('circle', { cx, cy: FL - 15 * k, r: 15 * k, fill: '#2b2f38' }, car); svgEl('circle', { cx, cy: FL - 15 * k, r: 6 * k, fill: '#9aa0ab' }, car); });
    const carL = lab(stage, `SUV ${T("5'\\,11''")}`, x0 + 190, bodyTop + 40, 170, 36, 'u3l4-tag'); carL.style.color = '#fff';
    const bx = svgEl('rect', { x: x0 + 90, y: carTop - boxH, width: 180, height: boxH, rx: 10, fill: '#3a4254', stroke: INK, 'stroke-width': 2.5 }, svg); bx.style.opacity = 0;
    const bxL = hide(lab(stage, `box ${T(v === 'a' ? "1'\\,2''" : "11\\tfrac12''")}`, x0 + 180, carTop - boxH / 2, 170, 34, 'u3l4-tag')); bxL.style.color = '#fff';
    const work = v === 'a' ? ["5'\\,11''+1'\\,2''=6'\\,13''", "=7'\\,1''"] : ["5'\\,11''+11\\tfrac12''=5'\\,22\\tfrac12''", "=6'\\,10\\tfrac12''"];
    const W1 = hide(lab(stage, T(work[0]), ox + 620, 24, 520, 44, 'u3l4-line')), W2 = hide(lab(stage, T(work[1]), ox + 620, 64, 520, 44, 'u3l4-line'));
    const gap = svgEl('g', {}, svg), gy1 = doorTop, gy2 = FL - total * k;
    if (v === 'a') svgEl('rect', { x: x0 + 90, y: gy2, width: 180, height: gy1 - gy2, fill: RED, opacity: 0.85 }, gap);
    else svgEl('path', { d: `M${x0 + 300} ${gy1} V${gy2} M${x0 + 292} ${gy1} H${x0 + 308} M${x0 + 292} ${gy2} H${x0 + 308}`, stroke: GRN, 'stroke-width': 4 }, gap);
    gap.style.opacity = 0;
    const W3 = v === 'b' ? hide(lab(stage, T("7'\\,0''-6'\\,10\\tfrac12''=6'\\,12''-6'\\,10\\tfrac12''=1\\tfrac12''"), ox + 560, 44, 640, 44, 'u3l4-line')) : null;
    const gapL = v === 'a' ? hide(lab(stage, '← 1 in too tall', x0 + 360, doorTop - 6, 170, 28, 'u3l4-tag')) : null; if (gapL) gapL.style.color = RED;
    const st = hide(stamp(stage, v === 'a' ? 'won’t fit: 1 in too tall' : `fits: ${'1½'} in of room`, { ok: v !== 'a', x: ox + 200, y: 250, rotate: -6 }));
    return [
      { cap: `The door opening is ${T("7'\\,0''")} high. The SUV is ${T("5'\\,11''")} tall: it fits on its own.`, run: (c) => pulse(c, car, 1.02) },
      { cap: `Put the cargo box on the roof. Add: ${T(work[0])}.`, run: async (c) => { await c.anim(bx, [{ opacity: 0, transform: 'translateY(-60px)' }, { opacity: 1, transform: 'none' }], 700); await c.fadeIn(bxL); await c.fadeIn(W1); } },
      { cap: v === 'a' ? `${T("13''")} is more than 12: trade 12 in for 1 ft. ${T("6'\\,13''=7'\\,1''")}.` : `${T("22\\tfrac12''")} is more than 12: trade 12 in for 1 ft. ${T("5'\\,22\\tfrac12''=6'\\,10\\tfrac12''")}.`, run: (c) => c.fadeIn(W2) },
      v === 'a'
        ? { cap: `${T("7'\\,1''")} is taller than ${T("7'\\,0''")}: it will <b>not</b> fit. It is <b>1 inch</b> too tall!`, run: async (c) => { await op(c, gap, 1, 400); await c.fadeIn(gapL); st.style.opacity = 1; await stampIn(c, st); } }
        : { cap: `Room left: ${T("7'\\,0''-6'\\,10\\tfrac12''")}. Borrow: ${T("7'\\,0''=6'\\,12''")}, so <b>${T("1\\tfrac12''")}</b> of room.`, run: async (c) => { await op(c, gap, 1, 400); await Promise.all([op(c, W1, 0, 250), op(c, W2, 0, 250)]); await c.fadeIn(W3); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5. Lumber cut from 8 ft boards (Example 9)
 * ====================================================================================== */
const lumber = {
  title: 'Cutting boards into pieces',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: '(a) pieces from one board' }, { v: 'b', label: '(b) boards to buy' }, { v: 'c', label: '(c) trim pieces' }],
  ask: (v) => ({ a: 'Example 9(a): how many 30 in pieces from one 8 ft board? How much is left over?', b: 'Example 9(b): Noah needs 14 pieces. How many $5.48 boards must he buy, and what do they cost?', c: 'Example 9(c): how many 55 cm pieces from a 2.4 m length of trim? How much is left over?' }[v]),
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 900) / 2;
    const wood = (x, y, w, hh, html, cls = '') => { const e = add(stage, box(h('div', 'u3l4-bar ' + cls, html), w, hh), x, y); e.style.background = 'repeating-linear-gradient(90deg,#d9a868 0 22px,#d19a58 22px 26px)'; e.style.borderColor = '#7a5124'; return e; };
    const scrap = (e) => { e.style.background = '#c9ced8'; e.style.borderColor = '#7a8291'; };
    if (v === 'a' || v === 'c') {
      const A = v === 'a', L = A ? 96 : 240, P = A ? 30 : 55, U = A ? 'in' : 'cm', k = 768 / L, X0 = ox + 66, Y = 100, n = Math.floor(L / P), left = L - n * P;
      const whole = wood(X0, Y, L * k, 56, A ? '8 ft board' : '2.4 m of trim');
      const pieces = [], gapX = 14;
      for (let i = 0; i < n; i++) pieces.push(hide(wood(X0 + i * P * k, Y, P * k, 56, `${P} ${U}`)));
      const lo = hide(wood(X0 + n * P * k, Y, left * k, 56, `${left}`)); scrap(lo);
      const marks = stageSvg(stage, W, H); marks.style.opacity = 0;
      for (let i = 1; i <= n; i++) svgEl('line', { x1: X0 + i * P * k, x2: X0 + i * P * k, y1: Y - 16, y2: Y + 72, stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, marks);
      const L1 = hide(lab(stage, T(A ? '8\\text{ ft}=8\\times12=96\\text{ in}' : '2.4\\text{ m}=2.4\\times100=240\\text{ cm}'), ox + 450, 220, 600, 46, 'u3l4-line'));
      const L2 = hide(lab(stage, T(A ? '96\\div30=3.2\\ \\to\\ 3\\text{ pieces (round down)}' : '240\\div55=4.36\\ldots\\ \\to\\ 4\\text{ pieces (round down)}'), ox + 450, 276, 760, 46, 'u3l4-line'));
      const L3 = hide(add(stage, box(cbox('u3l4-res', `Leftover: ${T(`${L}-${n}\\times${P}=${L}-${n * P}=${left}`)} ${U}`), 620, 50), ox + 140, 330));
      const xl = hide(lab(stage, `too short for a piece`, X0 + n * P * k + left * k / 2 - (A ? 60 : 30), Y + 84, 200, 26, 'u3l4-small'));
      return [
        { cap: `Step 1: same unit. ${A ? 'The pieces are in inches, so change 8 ft to inches.' : 'The pieces are in cm, so change 2.4 m to cm.'}`, run: async (c) => { whole.innerHTML = `${L} ${U}`; await pulse(c, whole, 1.03); await c.fadeIn(L1); } },
        { cap: `Step 2: divide. ${A ? '96 ÷ 30 = 3.2' : '240 ÷ 55 = 4.36…'}. Mark a cut every ${P} ${U}.`, run: async (c) => { await op(c, marks, 1, 400); await c.fadeIn(L2); } },
        { cap: `Step 3: round <b>down</b>. Saw the board: you get <b>${n} whole pieces</b>.`, run: async (c) => { whole.style.opacity = 0; pieces.forEach((p) => { p.style.opacity = 1; }); lo.style.opacity = 1; marks.style.opacity = 0; await Promise.all([...pieces, lo].map((p, i) => c.anim(p, [{ transform: 'none' }, { transform: `translateX(${(i - n / 2) * gapX}px)` }], 600))); } },
        { cap: `The leftover is <b>${left} ${U}</b>: too short to be a ${P} ${U} piece.`, run: async (c) => { await c.fadeIn(xl); await c.pop(L3); } }
      ];
    }
    // b: boards to buy
    const k = 6, X0 = ox + 40, rows = [], counts = [];
    for (let b = 0; b < 5; b++) {
      const y = 22 + b * 64, ps = [];
      for (let i = 0; i < 3; i++) { const p = wood(X0 + i * (30 * k + 6), y, 30 * k, 46, `${b * 3 + i + 1}`); if (b * 3 + i + 1 > 14) { p.style.opacity = 0.5; p.innerHTML = 'spare'; } ps.push(p); }
      const lo = wood(X0 + 3 * (30 * k + 6), y, 6 * k, 46, ''); scrap(lo); ps.push(lo);
      const lb = lab(stage, `board ${b + 1}`, X0 + 3 * (30 * k + 6) + 6 * k + 60, y + 23, 110, 30, 'u3l4-tag');
      rows.push([...ps, lb]); counts.push(lab(stage, `${Math.min(14, (b + 1) * 3)} of 14${(b + 1) * 3 >= 14 ? ' ✓' : ''}`, ox + 835, y + 23, 130, 30, 'u3l4-tag'));
    }
    rows.flat().forEach((e) => { e.dataset.op = e.style.opacity || '1'; e.style.opacity = 0; }); counts.forEach((e) => hide(e));
    const showRow = async (c, b) => { for (const e of rows[b]) await c.anim(e, [{ opacity: 0 }, { opacity: Number(e.dataset.op) }], 120); await c.fadeIn(counts[b]); };
    const L1 = hide(lab(stage, T('14\\div3=4.67\\ \\to\\ 5\\text{ boards (round up)}'), ox + 330, 365, 600, 46, 'u3l4-line'));
    const res = hide(add(stage, box(cbox('u3l4-res', `${T('5\\times\\$5.48=\\$27.40')}`), 280, 50), ox + 620, 342));
    return [
      { cap: 'From part (a): each 8 ft board gives <b>3 pieces</b>. Noah needs 14.', run: (c) => showRow(c, 0) },
      { cap: '4 boards give only 12 pieces. <b>Not enough!</b>', run: async (c) => { for (let b = 1; b < 4; b++) await showRow(c, b); } },
      { cap: 'So he needs a <b>5th board</b>, even though one piece is spare: <b>round up</b>. You can not buy part of a board.', run: async (c) => { await showRow(c, 4); await c.fadeIn(L1); } },
      { cap: 'Cost: 5 boards × $5.48 = <b>$27.40</b>.', run: (c) => c.pop(res) }
    ];
  }
};

mountExplainers({ stairs, whyTimes, sameUnit, impMachine, unitFactor, ftin, notDecimal, addSub, garage, lumber });

/* ============ Stand Up Break! — the staircase, feet and inches, regroup and borrow ============ */
const SIU = ['km', 'm', 'cm', 'mm'], SIS = { km: 0, m: 3, cm: 5, mm: 6 };
standup('u3l4', {
  intro: 'Decide first: bigger or smaller unit? Then multiply or divide. Check that the answer makes sense.',
  levels: {
    BEG: (r) => {
      const a = r.pick(SIU); let b; do { b = r.pick(SIU); } while (b === a);
      const n = SIS[b] - SIS[a], v = r.pick(n > 0 ? [0.6, 1.25, 2.4, 3.75, 0.08, 4.5, 12] : [450, 85, 1200, 37.5, 6000, 920, 15]);
      const f = 10 ** Math.abs(n), res = n > 0 ? v * f : v / f;
      return { text: 'Convert.', q: `${nT(v)}\\text{ ${a}}\\ \\text{to}\\ \\text{${b}}`, a: [`\\text{${n > 0 ? 'down' : 'up'} ${Math.abs(n)} steps: }${n > 0 ? '\\times' : '\\div'}${nT(f)}`, `${nT(v)}${n > 0 ? '\\times' : '\\div'}${nT(f)}=${nT(res)}\\text{ ${b}}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { let n; do { n = r.int(25, 160); } while (n % 12 === 0); const f = Math.floor(n / 12); return { text: 'Change to feet and inches.', q: `${n}\\text{ in}`, a: [`${n}\\div12=${dec(Math.round(n / 12 * 100) / 100)}${(n * 100) % 12 ? '\\ldots' : ''}\\ \\to\\ ${f}\\text{ ft}`, `${n}-${f}\\times12=${n - 12 * f}`, `${f}'\\,${n - 12 * f}''`] }; }
      const f = r.int(3, 9), i = r.int(1, 11);
      return { text: 'Change to inches.', q: `${f}'\\,${i}''`, a: [`${f}\\times12+${i}=${12 * f}+${i}`, `=${12 * f + i}\\text{ in}`] };
    },
    MAS: (r) => {
      const af = r.int(4, 9), ai = r.int(1, 10); // not 11: subtracting needs more inches below (bi > ai), so 11 left nothing to pick and the page froze
      if (r.chance(0.5)) { const bf = r.int(1, 5); let bi; do { bi = r.int(1, 11); } while (ai + bi < 12); const F = af + bf, I = ai + bi; return { text: 'Add. Write the answer with fewer than 12 inches.', q: `${af}'\\,${ai}''+${bf}'\\,${bi}''`, a: [`${F}'\\,${I}''`, `${I}''=1'\\,${I - 12}''`, `=${F + 1}'\\,${I - 12}''`] }; }
      const bf = r.int(1, af - 1); let bi; do { bi = r.int(1, 11); } while (bi <= ai);
      return { text: 'Subtract. Borrow if you need to.', q: `${af}'\\,${ai}''-${bf}'\\,${bi}''`, a: [`${af}'\\,${ai}''=${af - 1}'\\,${ai + 12}''`, `${af - 1}'\\,${ai + 12}''-${bf}'\\,${bi}''=${af - 1 - bf}'\\,${ai + 12 - bi}''`] };
    }
  }
});
