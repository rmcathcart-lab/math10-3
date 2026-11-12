/* Math 10-3 · Day One — Welcome to Math 10-3 (u1l0): the course introduction (no assignment).
 * Adapted from Math 10C's day-one page (math10c/lessons/js/lessons/u1l0.js).
 *   outline   — the course outline (7 units, lessons, outcomes, the unit's project) with this class's unit test dates
 *               from the class calendar when the page is opened with ?class=<block>; without one, the units and lesson counts
 *   QR        — the class link (the class code comes with the calendar), else the site
 *   Google Classroom — the class code for this block (GC_CODES below; a blank box to write it on until it's set)
 *   cards     — one outcome's certification card at all seven levels (js/certs.js); tap one for the viewer
 *   Stand Up Break — day-one money questions anyone can do with a calculator
 * Explainers:
 *   pathways  — Math 9 → 10-3 → 20-3 → 30-3 (the −3 route); the −1 and −2 routes start at 10C; 100 credits + a 20-level math
 *   period    — a class from bell to bell: arrive, warm-up + attendance, lesson, Stand Up Break, practice, exit slip
 *   project   — the unit project across Unit 1: opens day 1, checkpoints open with their lessons, work day, due on test day
 *   grade     — 13 outcomes → indicators (bands) → a unit test's B/P/M boxes → an indicator → the unit grade
 *   testmode  — a test pops up full screen; your own numbers; leaving locks it; ends with class; results when released
 *   retest    — finish the practice → Request retest → in class → best counts → another needs the extra practice */
import { h, tex, add, box, svgEl, Flowchart, mountExplainers, pop, fadeIn, appear, anim, pulse } from '../blocks.js';
import { standup } from '../standup.js';

const HW = window.HW || {};
const $ = (id) => document.getElementById(id);
const T = (s) => tex(String(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hide = (...els) => els.forEach((e) => { e.style.opacity = 0; });
const fadeOut = (c, el, ms = 300) => anim(c, el, [{ opacity: 1 }, { opacity: 0 }], ms);
const CAT = (HW.CATALOG || []);
const unitStyle = (u) => (HW.unitStyle ? HW.unitStyle(u) : '');
const lessonsOf = (u) => u.lessons.filter((c) => !c.intro);
const outsOf = (u) => String(u.outcomes || '').split(/\s*·\s*/).filter(Boolean);
const BR = '#6e4a1c', BR2 = '#9a6a24';

/* ================= this class: calendar, class code (?class=B) ================= */
const BLOCK = (() => { const v = (new URLSearchParams(location.search).get('class') || '').toUpperCase(); return /^[A-D]$/.test(v) ? v : ''; })();
const SITE = new URL('../../../', location.href).href;
function jsonp(params, ms = 12000) {
  const url = (window.HW_CONFIG || {}).backend; if (!url) return Promise.reject(new Error('no backend'));
  return new Promise((res, rej) => {
    const name = '__u1l0cb' + Date.now() + Math.floor(Math.random() * 1e4), s = document.createElement('script');
    const done = () => { delete window[name]; s.remove(); clearTimeout(t); };
    const t = setTimeout(() => { done(); rej(new Error('timeout')); }, ms);
    window[name] = (d) => { done(); res(d); };
    s.onerror = () => { done(); rej(new Error('network')); };
    s.src = url + '?' + new URLSearchParams(Object.assign({}, params, { callback: name })).toString();
    document.head.appendChild(s);
  });
}
function drawOutline(cal, noSchool) {
  const host = $('u1l0-outline'); if (!host) return;
  host.innerHTML = '';
  const C = HW.Cal, L = cal && C ? C.layout(cal, noSchool) : null, today = C ? C.today() : '';
  CAT.forEach((u) => {
    const d = L ? L.dateOf['t' + u.unit] : null;
    const pj = u.project ? ` · <b class="u1l0-pj">Project: ${esc(u.project.title)}</b>` : '';
    const row = h('div', 'u1l0-ou' + (d && d < today ? ' past' : ''), `<span class="u1l0-un">${u.unit}</span><div><div class="u1l0-ot">${esc(u.title)}</div><div class="u1l0-oo">${lessonsOf(u).length} lessons · ${outsOf(u).join(' · ')}${pj}</div></div>` +
      `<div class="u1l0-od">${d ? 'Unit test<b>' + esc(C.nice(d, { weekday: 'short', month: 'short', day: 'numeric' })) + '</b>' : 'Unit test<b>on the calendar</b>'}</div>`);
    row.setAttribute('style', unitStyle(u.unit)); host.appendChild(row);
  });
  (cal && cal.events || []).filter((e) => e.kind === 'exam').sort((a, b) => (a.date < b.date ? -1 : 1)).forEach((e) => {
    host.appendChild(h('div', 'u1l0-ev', `<b>${esc(e.title || 'Exam')}</b><span>${esc(C.nice(e.date, { weekday: 'long', month: 'long', day: 'numeric' }))}</span>`));
  });
  const note = $('u1l0-cnote');
  const nL = CAT.reduce((n, u) => n + lessonsOf(u).length, 0);
  if (note) note.textContent = L ? 'Unit test dates for ' + (BLOCK ? 'Block ' + BLOCK : 'our class') : CAT.length + ' units · ' + nL + ' lessons · a project and a unit test in every unit';
  const first = $('u1l0-first');
  if (first && L) { const d1 = L.dateOf.u1l0 || cal.start; first.innerHTML = 'Day one: <b>' + esc(C.nice(d1, { weekday: 'long', month: 'long', day: 'numeric' })) + '</b>'; }
}
function drawQR(code) {
  const host = $('u1l0-qr'), url = SITE + (code ? '?class=' + encodeURIComponent(code) : '');
  if (host) { try { const q = window.qrcode(0, 'M'); q.addData(url); q.make(); host.innerHTML = q.createSvgTag({ cellSize: 8, margin: 1, scalable: true }); } catch (e) { host.textContent = ''; } }
  const u = $('u1l0-url'); if (u) u.innerHTML = esc(url.replace(/^https?:\/\//, '')).replace(/\?class=(.*)$/, '?class=<b>$1</b>');
  const cc = $('u1l0-ccode'); if (cc) cc.innerHTML = code ? ': <b class="u1l0-code">' + esc(code) + '</b> (already filled in if you scanned)' : ' (I’ll put it on the board)';
}
drawOutline(null, []); drawQR('');

/* Google Classroom class codes, one per block (fill in when the classrooms exist) */
const GC_CODES = { A: '', B: '', C: '', D: '' };
(function gc() {
  const host = $('u1l0-gccode'); if (!host) return;
  const code = GC_CODES[BLOCK] || '';
  host.textContent = code; host.classList.toggle('blank', !code);
})();
if (BLOCK) jsonp({ action: 'cal', block: BLOCK }).then((d) => {
  if (!d || !d.ok) return;
  if (d['class']) drawQR(d['class']);
  const cal = d.cal && HW.Cal ? HW.Cal.clean(d.cal) : null;
  if (cal) drawOutline(cal, d.noSchool || []);
}).catch(() => {});

/* ================= certification cards: one outcome at all seven levels ================= */
(function certs() {
  const host = $('u1l0-medals'), C = HW.Certs; if (!host || !C) return;
  const BAND = ['0–25%', '25–45%', '45–55%', '55–65%', '65–75%', '75–85%', '85–100%'];
  const HOLDER = 'Your Name';
  const list = C.TIERS.map((t, k) => ({ o: 'N1', tier: k, src: 'one card, seven levels' }));
  C.TIERS.forEach((t, k) => {
    const cell = h('div', 'u1l0-cd'), b = h('button', 'u1l0-cbtn'); b.type = 'button'; b.setAttribute('data-tap', ''); b.title = t.name + ' · ' + t.level;
    b.setAttribute('aria-label', t.name + ' card (' + t.level + ')');
    b.innerHTML = C.svg('N1', k, 128, HOLDER);
    b.addEventListener('click', () => C.open(list, k, { holder: HOLDER }));
    cell.append(b, h('div', 'u1l0-cm', esc(t.name)), h('div', 'u1l0-cl', t.lv + ' · ' + t.level), h('div', 'u1l0-cb', BAND[k]));
    host.appendChild(cell);
  });
})();

/* ================= little pictures: what to bring, how you'll learn ================= */
const ICONS = {
  pencil: '<svg viewBox="0 0 92 92"><g transform="rotate(-38 46 46)"><rect x="14" y="38" width="56" height="16" rx="2" fill="#f2b632"/><rect x="14" y="38" width="56" height="5.3" fill="#f7cd62"/><path d="M70 38l14 8-14 8z" fill="#f3d7a6"/><path d="M80 43.7l4 2.3-4 2.3z" fill="#3a4254"/><rect x="6" y="38" width="10" height="16" rx="2" fill="#e88b9a"/><rect x="14" y="38" width="4" height="16" fill="#b8bcc3"/></g></svg>',
  paper: '<svg viewBox="0 0 92 92"><rect x="22" y="12" width="50" height="66" rx="4" fill="#fff" stroke="#c9c3b6" stroke-width="2.5"/><path d="M30 28h34M30 38h34M30 48h34M30 58h22" stroke="#a9c7e8" stroke-width="2.5"/><path d="M28 12v66" stroke="#e8a1a1" stroke-width="2"/><text x="50" y="73" font-size="15" font-weight="800" fill="#9a6a24" font-family="ui-rounded, system-ui">$4.50</text></svg>',
  calc: '<svg viewBox="0 0 92 92"><rect x="22" y="8" width="48" height="76" rx="7" fill="#2c3e5c"/><rect x="28" y="14" width="36" height="16" rx="2" fill="#c9d8c3"/><text x="61" y="26" font-size="8" text-anchor="end" fill="#1c2230" font-family="monospace">37.47</text>' +
    [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${28 + c * 9.5}" y="${36 + r * 11}" width="7" height="8" rx="1.5" fill="${r === 3 && c === 3 ? '#e8a01e' : '#c9ccd2'}"/>`).join('')).join('') + '</svg>',
  laptop: '<svg viewBox="0 0 92 92"><rect x="16" y="20" width="60" height="40" rx="4" fill="#1c2230"/><rect x="20" y="24" width="52" height="32" rx="1.5" fill="#f5ecdf"/><rect x="25" y="29" width="22" height="5" rx="2" fill="#6e4a1c"/><rect x="25" y="38" width="40" height="4" rx="2" fill="#e2cfb2"/><rect x="25" y="45" width="32" height="4" rx="2" fill="#e2cfb2"/><path d="M8 64h76l-6 8H14z" fill="#c9ccd2"/></svg>',
  notes: '<svg viewBox="0 0 92 92"><rect x="18" y="10" width="52" height="70" rx="4" fill="#fff" stroke="#c9c3b6" stroke-width="2.5"/><rect x="24" y="4" width="52" height="70" rx="4" fill="#fff" stroke="#9a6a24" stroke-width="2.5"/><rect x="30" y="12" width="40" height="9" rx="2" fill="#6e4a1c"/><path d="M31 30h38M31 39h38M31 48h28" stroke="#d9c7a8" stroke-width="2.5"/><path d="M36 64l8-7 5 5 12-12" fill="none" stroke="#c27a0e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  practice: '<svg viewBox="0 0 92 92"><rect x="10" y="16" width="72" height="50" rx="5" fill="#1c2230"/><rect x="14" y="20" width="64" height="42" rx="2" fill="#f5ecdf"/><rect x="20" y="26" width="34" height="6" rx="2" fill="#6e4a1c"/><rect x="20" y="37" width="20" height="10" rx="3" fill="#fff" stroke="#9a6a24" stroke-width="1.5"/><circle cx="64" cy="42" r="8" fill="#12805a"/><path d="M60 42l3 3 5-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="20" y="51" width="18" height="6" rx="3" fill="#fde7b0"/><path d="M4 70h84l-6 7H10z" fill="#c9ccd2"/></svg>',
  board: '<svg viewBox="0 0 92 92"><rect x="10" y="10" width="72" height="48" rx="3" fill="#fff" stroke="#9aa0ab" stroke-width="3"/><path d="M18 26c6-6 10 6 16 0M40 22h14M18 42h22M46 40l6 6M52 40l-6 6" fill="none" stroke="#1f5bd6" stroke-width="2.6" stroke-linecap="round"/><circle cx="30" cy="70" r="6" fill="#c27a0e"/><path d="M22 90c1-8 4-12 8-12s7 4 8 12" fill="#c27a0e"/><circle cx="60" cy="70" r="6" fill="#6e4a1c"/><path d="M52 90c1-8 4-12 8-12s7 4 8 12" fill="#6e4a1c"/></svg>',
  drill: '<svg viewBox="0 0 92 92"><rect x="12" y="14" width="68" height="64" rx="10" fill="#fff4dd" stroke="#c27a0e" stroke-width="2.5"/><text x="46" y="44" text-anchor="middle" font-size="20" font-weight="800" fill="#1c2230" font-family="ui-rounded, system-ui">7 × 8</text><rect x="26" y="52" width="40" height="14" rx="4" fill="#fff" stroke="#9a6a24" stroke-width="2"/><text x="46" y="63" text-anchor="middle" font-size="12" font-weight="800" fill="#12805a" font-family="ui-rounded, system-ui">56 ✓</text><path d="M64 8l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1z" fill="#f2c14e" stroke="#a87a0e" stroke-width="1.2"/></svg>'
};
document.querySelectorAll('.u1l0-ic[data-ic], .u1l0-lic[data-ic]').forEach((e) => { e.innerHTML = ICONS[e.dataset.ic] || ''; });

/* ================= Stand Up Break: day-one money math (a calculator and common sense) ================= */
const dd = (c) => (c / 100).toFixed(2);
const ITEMS = [['a hoodie', 2899, 4599], ['a pair of earbuds', 1999, 3999], ['a pizza', 1299, 1999], ['a phone case', 1499, 2499], ['a video game', 4999, 7999], ['a skateboard deck', 5499, 7499], ['a water bottle', 1599, 2799]];
standup('u1l0', {
  intro: 'Grab a marker and head to your whiteboard station. Today is just for fun: money math you already know. Calculators allowed!',
  levels: {
    BEG: (r) => { // change from a bill
      const [it, lo, hi] = r.pick(ITEMS), p = r.int(Math.round(lo / 10), Math.round(hi / 10)) * 10 - 1, bill = p < 2000 ? 2000 : p < 5000 ? 5000 : 10000;
      return { text: `You buy <b>${it}</b> for <b>$${dd(p)}</b> and pay with a <b>$${bill / 100} bill</b>. How much change do you get?`, q: '',
        a: [`${dd(bill)}-${dd(p)}=\\$${dd(bill - p)}`] };
    },
    PRG: (r) => { // a shift's pay
      const w = r.pick([1600, 1650, 1700, 1725, 1750, 1800, 1850]), hrs = r.pick([4, 5, 6, 7, 8]), days = r.pick([2, 3]);
      return { text: `You work at a grocery store for <b>$${dd(w)} an hour</b>. You work <b>${hrs} hours</b> a shift, <b>${days} shifts</b> this week. How much do you earn this week?`, q: '',
        a: [`${hrs}\\times${days}=${hrs * days}\\text{ hours}`, `${hrs * days}\\times${dd(w)}=\\$${dd(hrs * days * w)}`] };
    },
    MAS: (r) => { // how many hours to buy it?
      const [it, lo, hi] = r.pick(ITEMS.filter((x) => x[1] >= 2800)), p = r.int(Math.round(lo / 10), Math.round(hi / 10)) * 10 - 1, w = r.pick([1600, 1650, 1700, 1750, 1800]);
      const exact = p / w, need = Math.ceil(exact - 1e-9);
      return { text: `You want <b>${it}</b> that costs <b>$${dd(p)}</b>. You earn <b>$${dd(w)} an hour</b>. How many <b>full hours</b> do you need to work to buy it? (Ignore tax.)`, q: '',
        a: [`${dd(p)}\\div${dd(w)}\\approx${exact.toFixed(2)}`, `\\text{round up: }${need}\\text{ hours}`, `\\text{check: }${need}\\times${dd(w)}=\\$${dd(need * w)}\\ge\\$${dd(p)}`] };
    }
  }
});

/* ================= explainers ================= */
const node = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', 'u1l0-node ' + cls, html), w, hh), x, y);
const tag = (stage, cls, html, x, y) => add(stage, h('div', 'u1l0-tag ' + cls, html), x, y);
function arrows(stage, W, H) { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible' }, stage);
  const d = svgEl('defs', {}, s);
  [BR, '#2563eb', '#7c3aed', '#b9b3a6'].forEach((c, i) => { const m = svgEl('marker', { id: 'u1l0-ah' + i, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, d); svgEl('path', { d: 'M0 0L10 5L0 10z', fill: c }, m); });
  return s; }
function link(svg, a, b, color, k, dash) { // from the right edge of a to the left edge of b
  const ax = a.offsetLeft + a.offsetWidth, ay = a.offsetTop + a.offsetHeight / 2, bx = b.offsetLeft, by = b.offsetTop + b.offsetHeight / 2, mx = (ax + bx) / 2;
  return svgEl('path', { d: `M${ax + 3} ${ay} C${mx} ${ay} ${mx} ${by} ${bx - 6} ${by}`, fill: 'none', stroke: color, 'stroke-width': 3, 'marker-end': `url(#u1l0-ah${k})`, 'stroke-dasharray': dash || null }, svg);
}
const drawLine = (c, p, ms = 500) => { const L = p.getTotalLength ? p.getTotalLength() : 200, dash = p.getAttribute('stroke-dasharray');
  if (dash) return appear(c, p, ms);
  p.style.strokeDasharray = L; return anim(c, p, [{ strokeDashoffset: L, opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }], ms); };

/* ---- pathways: where Math 10-3 leads ---- */
const pathways = {
  title: 'Where Math 10-3 leads',
  height: 428,
  minW: 735,
  intro: 'Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, k = W / 735, X = (x) => Math.round(x * k), nh = 58, y1 = 50, y2 = 218, y3 = 304, ym = (y2 + y3) / 2 + nh / 2;
    const s = arrows(stage, W, 428);
    const g9 = node(stage, '', '<b>Math 9</b><small>last year</small>', X(4), y1 + 8, X(104), nh);
    const m10 = node(stage, 'here', '<b>Math 10-3</b><small>this semester · 5 credits</small>', X(140), y1, X(150), nh + 16);
    tag(stage, 'here', 'You are here', X(166), y1 - 34);
    const c20 = node(stage, 'p3', '<b>Math 20-3</b>', X(330), y1 + 8, X(124), nh), c30 = node(stage, 'p3', '<b>Math 30-3</b>', X(490), y1 + 8, X(124), nh);
    const t3 = tag(stage, 'p3', 'the −3 route', X(330), y1 - 24);
    const n3 = add(stage, box(h('div', 'u1l0-note', 'Built for the <b>workplace</b>, <b>trades</b> and <b>apprenticeships</b>. Many trades and college programs accept it — check what yours asks for.'), X(390)), X(330), y1 + nh + 16);
    const c10 = node(stage, 'p0', '<b>Math 10C</b><small>a different first course</small>', X(140), ym - nh / 2 - 8, X(150), nh + 16);
    const a20 = node(stage, 'p1', '<b>Math 20-1</b>', X(330), y2, X(124), nh), a30 = node(stage, 'p1', '<b>Math 30-1</b>', X(490), y2, X(124), nh);
    const b20 = node(stage, 'p2', '<b>Math 20-2</b>', X(330), y3, X(124), nh), b30 = node(stage, 'p2', '<b>Math 30-2</b>', X(490), y3, X(124), nh);
    const t1 = tag(stage, 'p1', '−1 route', X(626), y2 + 16), t2 = tag(stage, 'p2', '−2 route', X(626), y3 + 16);
    const n12 = add(stage, box(h('div', 'u1l0-note', 'The −1 and −2 routes start at <b>Math 10C</b>. They lead to university programs.'), X(130)), X(4), ym - 34);
    const cred = add(stage, box(h('div', 'u1l0-credit', '<div class="u1l0-cbar"><div class="u1l0-cfill" style="width:5%"></div></div><div class="u1l0-clab"><b>To graduate:</b> 100 credits, including a <b>20-level math</b>. Math 20-3 counts! Math 10-3 is worth <b>5</b> credits.</div>'), W - X(24)), X(12), 372);
    const L1 = link(s, g9, m10, BR, 0), L2 = link(s, m10, c20, BR, 0), L3 = link(s, c20, c30, BR, 0);
    const La = link(s, c10, a20, '#2563eb', 1), Lb = link(s, c10, b20, '#7c3aed', 2), La2 = link(s, a20, a30, '#2563eb', 1), Lb2 = link(s, b20, b30, '#7c3aed', 2);
    hide(c20, c30, t3, n3, c10, a20, a30, b20, b30, t1, t2, n12, cred, L2, L3, La, Lb, La2, Lb2);
    return [
      { cap: 'Math 10-3 comes straight after <b>Math 9</b>. It’s worth <b>5 credits</b>.', run: (c) => pulse(c, m10, 1.06, 600) },
      { cap: 'Next comes <b>Math 20-3</b>, then <b>Math 30-3</b>. This is the <b>−3 route</b>.',
        run: async (c) => { await fadeIn(c, t3); await drawLine(c, L2); await pop(c, c20); await drawLine(c, L3); await pop(c, c30); } },
      { cap: 'The −3 route is built for <b>jobs, trades and apprenticeships</b>: the math of money, measuring and building.', run: (c) => fadeIn(c, n3) },
      { cap: 'Two other routes, <b>−1</b> and <b>−2</b>, start with a different course: <b>Math 10C</b>.',
        run: async (c) => { await pop(c, c10); await Promise.all([drawLine(c, La), drawLine(c, Lb)]); await Promise.all([pop(c, a20), pop(c, b20)]); await Promise.all([drawLine(c, La2), drawLine(c, Lb2)]); await Promise.all([pop(c, a30), pop(c, b30)]); await Promise.all([fadeIn(c, t1), fadeIn(c, t2), fadeIn(c, n12)]); } },
      { cap: 'Every Alberta diploma needs <b>100 credits</b>, including a <b>20-level math</b>. <b>Math 20-3 counts.</b>', run: (c) => fadeIn(c, cred) },
      { cap: '<b>This semester:</b> build the strongest foundation you can. Everything after this starts here.', run: (c) => pulse(c, m10, 1.08, 700) }
    ];
  }
};

/* ---- a class from bell to bell ---- */
const PER = [
  { k: 'Arrive ready', m: [0, 3], c: '#9aa0ab', t: 'Use the bathroom on the break. Get your materials out and ready to go <b>before</b> the bell.' },
  { k: 'Warm-up', m: [3, 13], c: '#c27a0e', t: 'A warm-up is on the screen (like today’s). Try it <b>while I take attendance</b>. If the bell goes and you aren’t here, you’re marked <b>late or absent</b>.' },
  { k: 'Lesson', m: [13, 38], c: BR, t: 'I teach from the lesson page and write on it. You take notes on paper, or in the <b>printable notes booklet</b> from our website.' },
  { k: 'Stand Up Break', m: [38, 50], c: '#d9480f', t: 'Up at the <b>whiteboards</b> in small, random groups. Each group works a question together, then we check.' },
  { k: 'Practice', m: [50, 78], c: '#1f5bd6', t: '<b>The most important part!</b> The lesson’s practice on our website: new numbers every time, hints when you’re stuck. Ask questions — this is when I can help you most.' },
  { k: 'Exit slip', m: [78, 88], c: '#7b4fc4', t: 'Most days: a short check on today’s lesson pops up on your laptop for the last few minutes.' }
];
const period = {
  title: 'A class, bell to bell',
  height: 400,
  intro: 'Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, rw = Math.min(300, W * 0.42), rh = 54, x0 = 14, y0 = 12, tot = 88;
    const rows = PER.map((p, i) => {
      const e = add(stage, box(h('div', 'u1l0-prow', `<div class="u1l0-pn"><b>${i + 1} · ${p.k}</b><span>${p.m[0]}–${p.m[1]} min</span></div><div class="u1l0-pbar"><i style="width:${100 * (p.m[1] - p.m[0]) / tot}%;margin-left:${100 * p.m[0] / tot}%;background:${p.c}"></i></div>`), rw, rh), x0, y0 + i * (rh + 9));
      e.style.setProperty('--pc', p.c); return e;
    });
    const cx = x0 + rw + 22, cw = W - cx - 12;
    const cards = PER.map((p, i) => { const e = add(stage, box(h('div', 'u1l0-card', `<div class="u1l0-ch" style="color:${p.c}">${i + 1} · ${p.k}</div>${p.t}`), cw), cx, y0); e.style.borderColor = p.c; return e; });
    const fin = add(stage, box(h('div', 'u1l0-card', '<div class="u1l0-ch">Every class, the same shape</div>Arrive ready → warm-up while I take attendance → lesson → Stand Up Break → practice → exit slip. About <b>88 minutes</b>, bell to bell. You always know what’s next.'), cw), cx, y0);
    hide(...cards, fin);
    const on = (i) => rows.forEach((r, j) => { r.classList.toggle('on', j === i); r.classList.toggle('done', j < i); });
    return PER.map((p, i) => ({ cap: `<b>${p.k}</b>${i === 4 ? ' — the most important part.' : '.'}`, run: async (c) => { cards.forEach((e, j) => { if (j !== i) e.style.opacity = 0; }); on(i); await pulse(c, rows[i], 1.03, 360); await fadeIn(c, cards[i]); } })).concat([
      { cap: 'Every class has the same shape.', run: async (c) => { cards.forEach((e) => (e.style.opacity = 0)); rows.forEach((r) => { r.classList.remove('on'); r.classList.add('done'); }); await fadeIn(c, fin); } }
    ]);
  }
};

/* ---- the unit project across Unit 1 (js/projects/u1.js: each checkpoint lists the lessons it needs) ---- */
const PDAYS = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', 'Work day', 'Review', 'Test'];
const CPS = [ // [checkpoint, the first day it can open (index in PDAYS)]
  ['Open your shop', 0], ['Find the best supplier deal', 5], ['Set your prices', 7], ['Price tags with GST', 7], ['Black Friday sale', 8], ['An order from the US', 9], ['Your flyer: hand it in', 12]
];
const project = {
  title: 'A unit project, start to finish',
  height: 360,
  minW: 735,
  intro: 'Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, x0 = 8, gap = 4, n = PDAYS.length, dw = (W - 2 * x0 - gap * (n - 1)) / n, dx = (i) => x0 + i * (dw + gap), ty = 112, th = 50;
    const head = add(stage, box(h('div', 'u1l0-pjhead', '<span class="u1l0-pjic">🛍️</span><div><b>Unit 1 project: Pop-Up Shop</b>Pick a shop to run (snacks, phone accessories, hockey gear, crafts or your own idea). Then do the math a real shop owner does.</div>'), W - 2 * x0), x0, 0);
    const days = PDAYS.map((d, i) => add(stage, box(h('div', 'u1l0-day' + (i >= 10 ? ' u1l0-d' + ['work', 'rev', 'test'][i - 10] : ''), d), dw, th), dx(i), ty));
    const lab = add(stage, h('div', 'u1l0-note', 'Unit 1, one class at a time'), x0, ty - 24);
    const bar = add(stage, box(h('div', 'u1l0-pjbar', '<span>Pop-Up Shop: open the whole unit</span>'), dx(12) + dw - x0, 24), x0, ty + th + 6);
    // a numbered dot under the day each checkpoint can open, and a legend below
    const seen = {};
    const dots = CPS.map(([t, d], i) => { const k = seen[d] = (seen[d] || 0) + 1, same = CPS.filter((x) => x[1] === d).length;
      return add(stage, h('div', 'u1l0-dot' + (i === 6 ? ' u1l0-dotf' : ''), String(i + 1)), dx(d) + dw / 2 - 12 + (same > 1 ? (k === 1 ? -13 : 13) : 0), ty + th + 38); });
    const legend = CPS.map(([t], i) => add(stage, box(h('div', 'u1l0-lg' + (i === 6 ? ' u1l0-lgf' : ''), `<i>${i + 1}</i>${t}`), 236), x0 + (i < 4 ? 0 : 240), ty + th + 76 + (i % 4) * 30));
    const due = add(stage, h('div', 'u1l0-due', 'DUE'), dx(12) + dw / 2 - 30, ty - 32);
    const cnt = add(stage, box(h('div', 'u1l0-callout', '<b>It counts.</b> I grade your project with the same indicators as a test. It’s <b>evidence</b> for the unit’s outcomes (Unit 1: <b>N1</b>).'), W - 500), 492, ty + th + 76);
    hide(bar, ...dots, ...legend, due, cnt);
    const lit = (is, cls) => days.forEach((e, j) => e.classList.toggle(cls, is.includes(j)));
    return [
      { cap: 'Every unit has a <b>guided project</b>. Unit 1’s is the <b>Pop-Up Shop</b>: you run your own shop.', run: async (c) => { await pulse(c, head, 1.02, 400); await appear(c, lab); } },
      { cap: 'It opens on the <b>first day</b> of the unit, and stays open the whole unit.', run: async (c) => { lit([0], 'on'); await anim(c, bar, [{ opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }], 900); await pop(c, dots[0]); await fadeIn(c, legend[0], 250); } },
      { cap: 'Each <b>checkpoint</b> opens once we’ve had the lessons it needs. Each one has a worked example, and your answers are checked as you go.',
        run: async (c) => { lit([0, 5, 7, 8, 9], 'on'); for (let i = 1; i < 6; i++) { await pop(c, dots[i], 280); await fadeIn(c, legend[i], 200); } } },
      { cap: 'Work on it when your practice is done, or when you want a change of pace.', run: (c) => Promise.all(dots.slice(0, 6).map((e) => pulse(c, e, 1.25, 420))) },
      { cap: 'We also get a <b>whole class</b> for it: the project work day, right before the review.', run: async (c) => { lit([10], 'hi'); await pulse(c, days[10], 1.12, 600); } },
      { cap: 'Finish with your flyer and <b>hand it in</b>. It’s due on the <b>test day</b>.', run: async (c) => { lit([10, 12], 'hi'); await pop(c, dots[6]); await fadeIn(c, legend[6], 250); await pop(c, due); } },
      { cap: 'And it <b>counts</b>, as evidence for the unit’s outcomes.', run: (c) => fadeIn(c, cnt) }
    ];
  }
};

/* ---- how a grade is made ---- */
const RUNG = [
  { lv: 'NM', name: 'Not meeting', band: '0–25', c: '#7a4127', how: 'less than half of Beginning' },
  { lv: 'LIM', name: 'Limited', band: '25–45', c: '#6b737c', how: 'half of Beginning' },
  { lv: 'BEG', name: 'Beginning', band: '45–55', c: '#a8642f', how: 'Beginning box secure' },
  { lv: 'EMG', name: 'Emerging', band: '55–65', c: '#7d8590', how: '+ half of Progressing' },
  { lv: 'PRG', name: 'Progressing', band: '65–75', c: '#b8860b', how: 'Progressing box secure' },
  { lv: 'ADV', name: 'Advancing', band: '75–85', c: '#4f6f8a', how: '+ half of Mastery' },
  { lv: 'MAS', name: 'Mastery', band: '85–100', c: '#1e7a46', how: 'Mastery box secure' }
];
const grade = {
  title: 'From outcomes to your mark',
  height: 416,
  minW: 735,
  intro: 'Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W;
    // the 13 outcomes, coloured by the first unit that has them
    const outs = []; CAT.forEach((u) => outsOf(u).forEach((o) => { if (!outs.some((x) => x.o === o)) outs.push({ o, u: u.unit }); }));
    const SO = 'NAMG'; outs.sort((a, b) => SO.indexOf(a.o[0]) - SO.indexOf(b.o[0]) || parseInt(a.o.slice(1), 10) - parseInt(b.o.slice(1), 10));
    const chips = outs.map((x, i) => { const e = add(stage, h('div', 'u1l0-ochip', x.o), 40 + (i % 7) * 92, 110 + Math.floor(i / 7) * 54); const st = HW.unitColor ? HW.unitColor(x.u) : { solid: BR }; e.style.background = st.solid; return e; });
    const oCap = add(stage, box(h('div', 'u1l0-note', '<b>N</b> Number · <b>A</b> Algebra · <b>M</b> Measurement · <b>G</b> Geometry. Each is a skill from the Alberta program of studies — like <b>N1</b>: unit pricing and currency exchange.'), W - 80), 40, 232);
    // the ladder
    const lx = 14, lw = 300, rh = 44, ly = (k) => 12 + (6 - k) * (rh + 6);
    const rungs = RUNG.map((r, k) => { const e = add(stage, box(h('div', 'u1l0-rung', `<b>${r.lv}</b><span>${r.name}</span><span class="u1l0-rp">${r.band}%</span>`), lw, rh), lx, ly(k)); e.style.background = r.c; return e; });
    const hows = RUNG.map((r, k) => add(stage, h('div', 'u1l0-note', r.how), lx + lw + 10, ly(k) + 12));
    // the three boxes of one outcome on a unit test
    const bx = 470, BX = [{ t: 'Beginning', c: '#a8642f' }, { t: 'Progressing', c: '#b8860b' }, { t: 'Mastery', c: '#1e7a46' }];
    const boxes = BX.map((b, i) => { const e = add(stage, box(h('div', 'u1l0-boxq', `<div class="u1l0-bt" style="color:${b.c}">${b.t}</div><div class="u1l0-qs">${'<div class="u1l0-q"></div>'.repeat(4)}</div><div class="u1l0-frac">&nbsp;</div>`), 196), bx + 40, 18 + i * 112); e.style.borderColor = b.c; return e; });
    const head = add(stage, box(h('div', 'u1l0-note', '<b>N1 on the Unit 1 test</b>'), 220), bx + 40, -2);
    const verdict = add(stage, box(h('div', 'u1l0-verdict', ''), 200), bx + 40, 342);
    const unit = add(stage, box(h('div', 'u1l0-callout', ''), W - 60), 30, 130);
    const evid = add(stage, box(h('div', 'u1l0-callout', '<b>Evidence comes from class:</b> practice in class, exit slips, your unit project and unit tests. <b>Refresher</b> lessons (the basics again) don’t count toward a level.'), W - 60), 30, 290);
    hide(...rungs, ...hows, ...boxes, head, verdict, unit, evid);
    const fill = (i, marks) => { const qs = boxes[i].querySelectorAll('.u1l0-q'), n = marks.filter(Boolean).length; marks.forEach((m, j) => { qs[j].className = 'u1l0-q ' + (m ? 'r' : 'w'); qs[j].textContent = m ? '✓' : '✗'; }); boxes[i].querySelector('.u1l0-frac').innerHTML = `<b>${n} / 4</b> ${n >= 3 ? '· secure' : n >= 2 ? '· half' : '· not yet half'}`; };
    const mark = (k) => rungs.forEach((e, j) => { e.style.outline = j === k ? '4px solid #1c2230' : ''; e.style.opacity = j === k ? 1 : 0.55; });
    const setVerdict = (k, pct) => { verdict.style.background = RUNG[k].c; verdict.innerHTML = `<b>${RUNG[k].lv} · ${pct}%</b>${RUNG[k].name}`; };
    return [
      { cap: `Math 10-3 has <b>${outs.length} outcomes</b> — the skills you’re assessed on.`, run: async (c) => { await Promise.all(chips.map((e, i) => pop(c, e, 300, { delay: i * 30 }))); await fadeIn(c, oCap); } },
      { cap: 'For each outcome you get an <b>indicator</b>: how well you can show that skill. Each has a range of percents.',
        run: async (c) => { await Promise.all([...chips, oCap].map((e) => fadeOut(c, e, 250))); for (let k = 0; k < 7; k++) await fadeIn(c, rungs[k], 160); } },
      { cap: 'On a unit test, each outcome has <b>three boxes</b> of questions: Beginning, Progressing and Mastery. A box is <b>secure</b> at ¾ and <b>half</b> at ½.',
        run: async (c) => { await fadeIn(c, head); for (const b of boxes) await fadeIn(c, b, 250); await Promise.all(hows.map((e) => appear(c, e, 300))); } },
      { cap: 'Sam gets <b>4/4</b> Beginning and <b>3/4</b> Progressing (both secure) but only <b>1/4</b> Mastery: <b>Progressing, 70%</b>.',
        run: async (c) => { fill(0, [1, 1, 1, 1]); fill(1, [1, 1, 1, 0]); fill(2, [1, 0, 0, 0]); await Promise.all(boxes.map((b) => pulse(c, b, 1.04))); setVerdict(4, 70); mark(4); await pop(c, verdict); } },
      { cap: 'On a retest Sam gets <b>2/4</b> Mastery — half of the Mastery box: <b>Advancing, 75%</b>. The best result counts.',
        run: async (c) => { fill(2, [1, 1, 0, 0]); await pulse(c, boxes[2], 1.06); setVerdict(5, 75); mark(5); await pop(c, verdict); } },
      { cap: 'Your <b>unit grade</b> is the average of the unit’s outcomes.',
        run: async (c) => { await Promise.all([...rungs, ...hows, ...boxes, head, verdict].map((e) => fadeOut(c, e, 250))); unit.innerHTML = `Unit 2 has two outcomes. N2 <b>70%</b> and A1 <b>82%</b> → ${T('\\dfrac{70+82}{2}=76')} → <b>76%, Advancing</b>`; await fadeIn(c, unit); } },
      { cap: 'Where the evidence comes from.', run: (c) => fadeIn(c, evid) }
    ];
  }
};

/* ---- test mode ---- */
const testmode = {
  title: 'A test on the website',
  height: 356,
  minW: 735,
  intro: 'Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, sx = 16, sy = 26, sw = 380, sh = 250;
    const scr = add(stage, box(h('div', 'u1l0-screen'), sw, sh), sx, sy);
    add(stage, box(h('div', 'u1l0-base'), sw + 40, 16), sx - 20, sy + sh);
    scr.appendChild(h('div', 'u1l0-tabs', '<i></i><i></i><i></i>'));
    const site = h('div', 'u1l0-test', `<div class="u1l0-th2"><span style="color:${BR}">Math 10-3 Practice</span><span>Hi, Sam.</span></div><div class="u1l0-qline" style="width:70%"></div><div class="u1l0-qline"></div><div class="u1l0-qline" style="width:84%"></div>`);
    site.style.top = '26px'; scr.appendChild(site);
    const inp = '<div class="u1l0-qline" style="width:60%;background:#fff;border:1.5px solid #d8b48a;height:26px"></div>';
    const test = h('div', 'u1l0-test', '<div class="u1l0-th2"><span>Unit 1 Test</span><span>Sam Lee</span></div><div style="font-size:14px">1. A 4 L jug of milk costs $5.96. What is the price per litre?</div>' + inp + '<div style="font-size:14px">2. Find 15% of $40.</div>' + inp + '<div class="u1l0-tmr" style="font-size:13px;color:#8a5a00;justify-self:end">Ends at the end of class</div>');
    test.style.background = '#ffe7d1'; scr.appendChild(test);
    const exit = h('div', 'u1l0-test', '<div class="u1l0-th2"><span>Exit slip 1.3</span><span>Sam Lee</span></div><div style="font-size:14px">1. Write the ratio 12 : 18 in simplest form.</div>' + inp);
    exit.style.background = '#fff6c9'; scr.appendChild(exit);
    const lock = h('div', 'u1l0-lockov', '<div><b>🔒 Test locked</b>You left the test window.<br>Only Mr. Cathcart can unlock it.</div>'); scr.appendChild(lock);
    const done = h('div', 'u1l0-lockov', '<div><b>✓ Submitted</b>Results show up after<br>Mr. Cathcart releases them.</div>'); done.style.background = 'rgba(18,128,90,.9)'; scr.appendChild(done);
    const cx = sx + sw + 30, cw = W - cx - 10;
    const C = (html, y, cls = '') => add(stage, box(h('div', 'u1l0-callout ' + cls, html), cw), cx, y);
    const c1 = C('<b>Full screen</b>, on every signed-in laptop when I launch it. <b>Tests are orange</b>, exit slips are yellow.', 6);
    const c2 = C('<b>Your own numbers.</b> Your neighbour’s questions are different, and your name is on the screen.', 104);
    const c3 = C('<b>Leave the window</b> (or full screen) and your test <b>ends and locks</b>. I can unlock it — but I’ll know.', 190, 'red');
    const c4 = C('<b>A test runs until the end of class</b> unless I say otherwise. Your calculator is allowed.', 290);
    const n2 = add(stage, box(h('div', 'u1l0-ghost', 'Alex’s screen: 1. A <b>3 L</b> jug of milk costs <b>$4.77</b>…'), sw, 40), sx, sy + sh + 34);
    hide(test, exit, lock, done, c1, c2, c3, c4, n2);
    return [
      { cap: 'When I launch a test, it pops up <b>full screen</b> on your laptop.', run: async (c) => { await anim(c, test, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], 500); await fadeIn(c, c1); } },
      { cap: 'Your <b>own numbers</b>: copying a neighbour gets you the answer to a different question.', run: async (c) => { await fadeIn(c, c2); await fadeIn(c, n2); } },
      { cap: 'Switch tabs, open another window or leave full screen, and the test <b>locks</b>.', run: async (c) => { await appear(c, lock, 300); await fadeIn(c, c3); } },
      { cap: 'Tests end at the <b>end of class</b>, so there’s no rush. Use your calculator.', run: async (c) => { lock.style.opacity = 0; await fadeIn(c, c4); } },
      { cap: 'When you submit, there’s no mark yet: your results show up <b>after I release them</b>, once everyone has written.', run: (c) => appear(c, done, 300) },
      { cap: 'Exit slips work the same way — they’re <b>yellow</b> and short, at the end of most classes.', run: async (c) => { done.style.opacity = 0; test.style.opacity = 0; await anim(c, exit, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], 450); } }
    ];
  }
};

/* ---- retests ---- */
const retest = {
  title: 'How to earn a retest',
  height: 350,
  minW: 735,
  intro: 'Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, cxL = W * 0.27, cxR = W * 0.73, w = 300;
    const F = new Flowchart(stage, { x: 0, y: 0, width: W, height: 350,
      nodes: {
        prac: { x: cxL, y: 52, w, h: 96, html: '<b>1 · Do the practice</b>every required question in the unit, without seeing the solution (saw one? redo a new version)', color: 'brand', cls: 'bk-round' },
        req: { x: cxR, y: 52, w, h: 96, html: '<b>2 · Request retest</b>the button appears on that unit on your home page', color: 'blue' },
        write: { x: cxR, y: 172, w, h: 82, html: '<b>3 · Write it in class</b>I open a retest just for you — new numbers', color: 'amber' },
        best: { x: cxL, y: 172, w, h: 82, html: '<b>4 · Your best counts</b>the higher result stays', color: 'green', cls: 'bk-round' },
        again: { x: W / 2, y: 296, w: 460, h: 76, html: '<b>Another retest?</b>first finish <b>all the extra practice</b> in that unit too', color: 'purple', cls: 'bk-dashed' }
      },
      edges: [{ from: 'prac', to: 'req' }, { from: 'req', to: 'write' }, { from: 'write', to: 'best' }, { from: 'best', to: 'again', route: 'vhv' }] });
    return [
      { cap: 'A retest is <b>earned with practice</b>. Do all the required practice for the unit without seeing the solutions. Saw one? Do a new version without it.', run: (c) => F.visit(c, 'prac') },
      { cap: 'Then <b>Request retest</b> shows up on that unit, on your home page. Tap it and the request comes to me.', run: (c) => F.go(c, 'prac', 'req').then(() => F.visit(c, 'req')) },
      { cap: 'I open your retest <b>in class</b>, while everyone else works. New numbers, same outcomes.', run: (c) => F.go(c, 'req', 'write').then(() => F.visit(c, 'write')) },
      { cap: 'Your <b>best</b> result counts. A retest can only help. There’s <b>no deadline</b>.', run: (c) => F.go(c, 'write', 'best').then(() => F.visit(c, 'best')) },
      { cap: 'Want <b>another</b> retest after that? Finish <b>all the extra practice</b> in the unit first.', run: (c) => F.go(c, 'best', 'again').then(() => F.visit(c, 'again')) }
    ];
  }
};

export const explainers = mountExplainers({ pathways, period, project, grade, testmode, retest });
