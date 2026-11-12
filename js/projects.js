/* Unit projects — the engine (one guided project per unit, like the robotics missions).
 *
 * A project is registered with HW.defineProject({ … }) in js/projects/u<N>.js:
 *   { id: 'u1', unit: 1, title, tagline, outcomes: ['N1'], lessonNames: { u1l6: 'Unit Price', … },
 *     checkpoints: [{ id, title, needs: ['u1l6', …], goal, graded (default true),
 *                     example: { title, scene, steps: [{ cap, html }] },   (an animated worked example)
 *                     render(box, c),                                       (the tool: builds inputs with c.input / c.choice …)
 *                     check(c) → [results] }],                              (results from c.money / c.pct / c.equals / c.need / c.msg)
 *     flyer(c) → html (optional: shown read-only in the Teacher Ledger) }
 * A checkpoint is passed when every result is right; the next one opens only then (going back is always allowed).
 * Values the student types or picks live in P.v (one flat map, key → value), so the checkers are plain functions of
 * the student's own choices: tests/projects_test.js runs them in node.
 *
 * Student state, per project (P): { v: {}, cps: { cpId: { n: checks, first: { field: 1|0 }, w: { field: wrong count },
 *   ok: passed at, ex: example hidden } }, cur, created, updated, secs, submitted, subN }
 * Saved on the device (hw:proj:<student>) and sent to the ledger (POST kind:'project', backend/Code.gs "Projects" sheet).
 * The teacher grades it in the Teacher Ledger's Projects tab (teacher/projects.js); released indicators come back with
 * action=myprojects and count toward the student's outcome badges like a released test (js/app.js medalList). */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  var PJ = HW.Projects = HW.Projects || {};
  HW.PROJECTS = HW.PROJECTS || {};
  var hasDoc = typeof document !== 'undefined';

  /* ---------------- helpers ---------------- */
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function r2(x) { return Math.round(x * 100 + (x >= 0 ? 1e-7 : -1e-7)) / 100; }
  function money(x, cur) { var v = r2(x); return (v < 0 ? '−' : '') + (cur || '$') + Math.abs(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pctText(x) { var v = Math.round(x * 10) / 10; return (v % 1 ? v.toFixed(1) : String(v)) + '%'; }
  /* a typed number: "$1,204.50", "12.5 %", "US$ 9.99", ".5" → number; anything else → NaN */
  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/^(US|CA|USD|CAD)\s*\$?/i, '').replace(/\s*(USD|CAD|US)$/i, '').replace(/[\s$%]/g, '');
    if (/^-?\d+,\d{1,2}$/.test(s)) s = s.replace(',', '.'); // 2,50 → 2.50
    s = s.replace(/,/g, '').replace(/^−/, '-');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
  }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  PJ.r2 = r2; PJ.money = money; PJ.pct = pctText; PJ.parse = parseNum; PJ.hash = hash; PJ.esc = esc;

  HW.defineProject = function (def) {
    def.checkpoints.forEach(function (c, i) { c.index = i; if (c.graded == null) c.graded = true; });
    def.byId = {}; def.checkpoints.forEach(function (c) { def.byId[c.id] = c; });
    HW.PROJECTS[def.id] = def; return def;
  };
  PJ.list = function () { return Object.keys(HW.PROJECTS).map(function (k) { return HW.PROJECTS[k]; }).sort(function (a, b) { return a.unit - b.unit; }); };
  PJ.forUnit = function (u) { var n = typeof u === 'object' ? u.unit : u; return PJ.list().filter(function (d) { return d.unit === n; })[0] || null; };
  PJ.blank = function () { return { v: {}, cps: {}, cur: 0, created: 0, updated: 0, secs: 0, submitted: 0, subN: 0 }; };

  /* ================= the checker context: one student's values + result builders (no DOM needed) ================= */
  function Ctx(def, P, opts) { opts = opts || {}; this.def = def; this.P = P; this.v = P.v; this.ro = !!opts.ro; this.seed = opts.seed || 0; this.onChange = opts.onChange || null; this.marks = {}; this.cp = null; }
  PJ.Ctx = Ctx;
  var CP = Ctx.prototype;
  CP.get = function (k, d) { var x = this.v[k]; return x === undefined || x === null ? (d === undefined ? '' : d) : x; };
  CP.has = function (k) { var x = this.v[k]; return !(x === undefined || x === null || x === '' || (Array.isArray(x) && !x.length)); };
  CP.set = function (k, val) {
    if (this.ro) return;
    if (val === '' || val == null) delete this.v[k]; else this.v[k] = val;
    delete this.marks[k];
    if (this.onChange) this.onChange(k);
  };
  CP.num = function (k) { return parseNum(this.v[k]); };
  /* result builders. A result: { f: field key, ok, blank, hint, hint2, label, graded } */
  function res(f, ok, extra) { var r = { f: f, ok: !!ok, blank: false, graded: true }; if (extra) for (var k in extra) r[k] = extra[k]; return r; }
  function diag(x, exp, o, unit) {
    var tol = o.tol == null ? 0.01 : o.tol, w = o.wrong || [];
    for (var i = 0; i < w.length; i++) { if (w[i].v != null && isFinite(w[i].v) && Math.abs(x - w[i].v) <= (w[i].tol == null ? tol : w[i].tol) + 1e-9 && Math.abs(w[i].v - exp) > tol) return w[i].hint; }
    if (exp && Math.abs(x - exp * 100) <= tol * 100 + 1e-9) return unit === '%' ? 'Your answer is 100 times too big. Check where the decimal point goes.' : 'Your answer is 100 times too big. Check where the decimal point goes.';
    if (exp && Math.abs(x * 100 - exp) <= tol * 100 + 1e-9) return unit === '%' ? 'That looks like a decimal. Change it to a percent: multiply by 100 (0.25 → 25%).' : 'Your answer is 100 times too small. Check where the decimal point goes.';
    if (unit !== '%' && Math.abs(x - exp) < 0.025) return 'So close! Round to the nearest cent: look at the third decimal place.';
    if (exp && Math.abs(x + exp) <= tol) return 'Check the sign: this amount should be positive.';
    return '';
  }
  /* money: right to the cent (tolerance 1 cent unless o.tol) */
  CP.money = function (k, exp, o) {
    o = o || {}; var x = this.num(k), base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!this.has(k)) return res(k, false, Object.assign(base, { blank: true }));
    if (isNaN(x)) return res(k, false, Object.assign(base, { form: true, hint: 'Type just a number, like 4.75.' }));
    var tol = o.tol == null ? 0.01 : o.tol;
    if (Math.abs(x - exp) <= tol + 1e-9) return res(k, true, base);
    return res(k, false, Object.assign(base, { hint: diag(x, exp, o, '$') || o.hint || 'Check this one again.' }));
  };
  /* percent: right to one decimal place (a whole-number answer is fine when it's the rounded percent) */
  CP.pct = function (k, exp, o) {
    o = o || {}; var x = this.num(k), base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!this.has(k)) return res(k, false, Object.assign(base, { blank: true }));
    if (isNaN(x)) return res(k, false, Object.assign(base, { form: true, hint: 'Type just the number of percent, like 12.5.' }));
    var ok = Math.abs(x - exp) <= (o.tol == null ? 0.051 : o.tol) || (Math.abs(x - Math.round(x)) < 1e-9 && Math.abs(x - exp) < 0.5 + 1e-9);
    if (ok) return res(k, true, base);
    return res(k, false, Object.assign(base, { hint: diag(x, exp, Object.assign({ tol: 0.051 }, o), '%') || o.hint || 'Check this one again.' }));
  };
  /* a plain number (o.tol, default 0) */
  CP.number = function (k, exp, o) {
    o = o || {}; var x = this.num(k), base = { label: o.label, hint2: o.hint2, graded: o.graded !== false };
    if (!this.has(k)) return res(k, false, Object.assign(base, { blank: true }));
    if (isNaN(x)) return res(k, false, Object.assign(base, { form: true, hint: 'Type just a number.' }));
    if (Math.abs(x - exp) <= (o.tol || 0) + 1e-9) return res(k, true, base);
    return res(k, false, Object.assign(base, { hint: diag(x, exp, o, '') || o.hint || 'Check this one again.' }));
  };
  /* a choice that has a right answer */
  CP.equals = function (k, exp, o) {
    o = o || {}; var base = { label: o.label, hint2: o.hint2, graded: o.graded !== false, choice: true };
    if (!this.has(k)) return res(k, false, Object.assign(base, { blank: true }));
    var v = String(this.get(k));
    if (Array.isArray(exp) ? exp.map(String).indexOf(v) >= 0 : v === String(exp)) return res(k, true, base);
    var w = (o.wrong || {})[v];
    return res(k, false, Object.assign(base, { hint: w || o.hint || 'Look at this one again.' }));
  };
  /* something the student has to fill in or pick (no right answer): not counted for accuracy */
  CP.need = function (k, o) {
    o = o || {}; var v = this.get(k), min = o.min || 1, base = { label: o.label, graded: false };
    if (!this.has(k)) return res(k, false, Object.assign(base, { blank: true }));
    if (typeof v === 'string' && v.trim().length < min) return res(k, false, Object.assign(base, { hint: o.hint || 'Write a little more here.' }));
    return res(k, true, base);
  };
  /* a check that isn't one box (e.g. "pick 5 products") */
  CP.msg = function (ok, text) { return { f: null, ok: !!ok, blank: false, graded: false, hint: text, msg: true }; };

  /* evaluate a checkpoint for a student */
  PJ.evaluate = function (def, cp, c) {
    var out; try { out = cp.check ? cp.check(c) || [] : []; } catch (e) { out = [{ f: null, ok: false, msg: true, hint: 'Something went wrong checking this: ' + e.message, graded: false }]; }
    out = [].concat.apply([], out).filter(Boolean);
    var blanks = out.filter(function (r) { return r.blank; }), wrong = out.filter(function (r) { return !r.ok && !r.blank; });
    return { results: out, ok: out.length > 0 ? !blanks.length && !wrong.length : true, blanks: blanks, wrong: wrong };
  };
  function cpState(P, id) { var s = P.cps[id]; if (!s) s = P.cps[id] = { n: 0, first: {}, w: {}, ok: 0 }; if (!s.first) s.first = {}; if (!s.w) s.w = {}; return s; }
  PJ.cpState = cpState;
  /* is checkpoint i passed (checked and still right)? */
  PJ.passed = function (def, P, i, c) {
    var cp = def.checkpoints[i]; if (!cp) return false;
    var s = P.cps[cp.id]; if (!s || !s.ok) return false;
    c = c || new Ctx(def, P, { ro: true, seed: P.seed || 0 });
    return PJ.evaluate(def, cp, c).ok;
  };
  /* status of every checkpoint: 'done' | 'open' | 'locked' (a checkpoint opens when the one before it is done) */
  PJ.statuses = function (def, P, c) {
    c = c || new Ctx(def, P, { ro: true, seed: P.seed || 0 });
    var out = [], open = true;
    def.checkpoints.forEach(function (cp, i) { var d = open && PJ.passed(def, P, i, c); out.push(d ? 'done' : open ? 'open' : 'locked'); if (!d) open = false; });
    return out;
  };
  PJ.doneCount = function (def, P) { return PJ.statuses(def, P).filter(function (s) { return s === 'done'; }).length; };
  /* first-try accuracy: per checkpoint and overall (graded boxes only; a box counts the first time it was checked filled in) */
  PJ.accuracy = function (def, P) {
    var per = {}, R = 0, T = 0;
    def.checkpoints.forEach(function (cp) {
      var s = P.cps[cp.id], f = (s && s.first) || {}, r = 0, t = 0;
      Object.keys(f).forEach(function (k) { t++; if (f[k]) r++; });
      per[cp.id] = { right: r, total: t, checks: s ? s.n || 0 : 0, rate: t ? r / t : null };
      if (cp.graded) { R += r; T += t; }
    });
    return { per: per, right: R, total: T, rate: T ? R / T : null };
  };
  /* the level the Teacher Ledger suggests: first-try accuracy on the graded checkpoints done, one step down for each
     graded checkpoint not done. Returns { ind, why } */
  PJ.LADDER = ['NM', 'LIM', 'BEG', 'EMG', 'PRG', 'ADV', 'MAS'];
  PJ.suggest = function (def, P) {
    var st = PJ.statuses(def, P), acc = PJ.accuracy(def, P), graded = def.checkpoints.filter(function (c) { return c.graded; });
    var done = graded.filter(function (c) { return st[c.index] === 'done'; }), R = 0, T = 0;
    done.forEach(function (c) { var a = acc.per[c.id]; R += a.right; T += a.total; });
    if (!done.length || !T) return { ind: 'NM', why: 'No checkpoints with math done yet.', rate: null };
    var rate = R / T, i = rate >= 0.9 ? 6 : rate >= 0.8 ? 5 : rate >= 0.7 ? 4 : rate >= 0.6 ? 3 : rate >= 0.45 ? 2 : 1, miss = graded.length - done.length;
    var j = Math.max(1, i - miss), lv = PJ.LADDER[j];
    var why = Math.round(100 * rate) + '% of answers right on the first check (' + R + ' of ' + T + ') in ' + done.length + ' of ' + graded.length + ' math checkpoints' +
      (miss ? '; ' + (i - j) + ' step' + (i - j === 1 ? '' : 's') + ' down for ' + miss + ' not done' : '') + '.';
    return { ind: lv, why: why, rate: rate };
  };

  if (!hasDoc) return; // node (tests): the checkers above are all that's needed

  /* ================= inputs (DOM) ================= */
  CP.markOf = function (k) { return this.marks[k] || ''; };
  function applyMark(w, m) { w.classList.toggle('ok', !!(m && m.ok)); w.classList.toggle('bad', !!(m && !m.ok)); if (m && !m.ok && m.hint) w.title = m.hint.replace(/<[^>]+>/g, ''); else w.removeAttribute('title'); }
  /* a box to type in: o.kind 'money' (default, $ in front), 'usd' (US$), 'pct' (% after), 'num', o.ph, o.aria, o.wide */
  CP.input = function (k, o) {
    o = o || {}; var self = this, kind = o.kind || 'money';
    var w = el('label', 'pj-in pj-in-' + kind + (o.cls ? ' ' + o.cls : '')); w.dataset.f = k;
    if (kind === 'money' || kind === 'usd') w.appendChild(el('span', 'pj-pre', kind === 'usd' ? 'US$' : '$'));
    var inp = el('input'); inp.type = 'text'; inp.setAttribute('inputmode', 'decimal'); inp.autocomplete = 'off'; inp.spellcheck = false;
    inp.value = this.get(k, ''); inp.placeholder = o.ph != null ? o.ph : kind === 'pct' ? '0' : kind === 'num' ? '' : '0.00';
    inp.setAttribute('aria-label', o.aria || k); if (this.ro) inp.disabled = true;
    inp.addEventListener('input', function () { self.set(k, inp.value.trim()); applyMark(w, null); if (o.onInput) o.onInput(inp.value); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && self.onEnter) { e.preventDefault(); self.onEnter(); } });
    w.appendChild(inp);
    if (kind === 'pct') w.appendChild(el('span', 'pj-post', '%'));
    applyMark(w, this.marks[k]);
    return w;
  };
  /* a line of text (o.area for a few lines; o.max) */
  CP.text = function (k, o) {
    o = o || {}; var self = this, w = el('label', 'pj-tx' + (o.cls ? ' ' + o.cls : '')); w.dataset.f = k;
    var inp = o.area ? el('textarea') : el('input'); if (!o.area) inp.type = 'text'; else inp.rows = o.rows || 3;
    inp.value = this.get(k, ''); inp.placeholder = o.ph || ''; inp.maxLength = o.max || 80; inp.setAttribute('aria-label', o.aria || k); if (this.ro) inp.disabled = true;
    inp.addEventListener('input', function () { self.set(k, inp.value); applyMark(w, null); if (o.onInput) o.onInput(inp.value); });
    w.appendChild(inp); applyMark(w, this.marks[k]); return w;
  };
  /* buttons to pick one of: items [{ v, html, title }] — o.onPick(v) after saving (e.g. redraw) */
  CP.choice = function (k, items, o) {
    o = o || {}; var self = this, w = el('div', 'pj-choice' + (o.cls ? ' ' + o.cls : '')); w.dataset.f = k; w.setAttribute('role', 'radiogroup'); if (o.aria) w.setAttribute('aria-label', o.aria);
    var cur = String(this.get(k, ''));
    items.forEach(function (it) {
      var b = el('button', 'pj-opt' + (String(it.v) === cur ? ' on' : ''), it.html); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.v = it.v; b.setAttribute('aria-checked', String(it.v) === cur ? 'true' : 'false');
      if (it.title) b.title = it.title; if (self.ro || it.disabled) b.disabled = true;
      b.addEventListener('click', function () {
        var nv = o.toggle && String(self.get(k, '')) === String(it.v) ? '' : it.v;
        self.set(k, nv); w.querySelectorAll('.pj-opt').forEach(function (x) { var on = x === b && nv !== ''; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
        applyMark(w, null); if (o.onPick) o.onPick(nv);
      });
      w.appendChild(b);
    });
    applyMark(w, this.marks[k]); return w;
  };
  CP.select = function (k, items, o) {
    o = o || {}; var self = this, w = el('label', 'pj-sel' + (o.cls ? ' ' + o.cls : '')); w.dataset.f = k;
    var s = el('select'); s.setAttribute('aria-label', o.aria || k); if (this.ro) s.disabled = true;
    s.appendChild(new Option(o.ph || 'Choose…', ''));
    items.forEach(function (it) { s.appendChild(new Option(it.t, it.v)); });
    s.value = String(this.get(k, '')); s.addEventListener('change', function () { self.set(k, s.value); applyMark(w, null); if (o.onPick) o.onPick(s.value); });
    w.appendChild(s); applyMark(w, this.marks[k]); return w;
  };
  /* mark every box in a container from a list of results */
  PJ.markAll = function (box, c, results, showHints) {
    c.marks = {};
    results.forEach(function (r) { if (r.f && !r.blank) c.marks[r.f] = { ok: r.ok, hint: r.hint }; });
    box.querySelectorAll('[data-f]').forEach(function (w) {
      var m = c.marks[w.dataset.f]; applyMark(w, m);
      var old = w.parentNode && w.nextElementSibling && w.nextElementSibling.classList.contains('pj-ihint') ? w.nextElementSibling : null; if (old) old.remove();
      if (showHints && m && !m.ok && m.hint && w.dataset.inline !== '0' && w.parentNode && w.parentNode.classList.contains('pj-field')) { var h = el('div', 'pj-ihint', m.hint); w.parentNode.insertBefore(h, w.nextSibling); }
    });
  };

  /* ================= the animated worked example ================= */
  /* ex: { title, scene (html at the top), steps: [{ cap, html }] }. Each Next adds a step; the new part animates in
     (.pj-new), numbers in <span class="pj-count" data-to="2.43" data-fmt="money|pct|num"> count up, and
     <span class="pj-type">text</span> types itself. */
  var LEAF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.6 3.6 2.6-1-0.6 4.2 3.2-2.2.4 2.6 3-.6-1.4 3.6 1.6 1.2-4.6 3 .6 2-4.4-.8.2 4.4h-2.2l.2-4.4-4.4.8.6-2-4.6-3 1.6-1.2L1.2 8.6l3 .6.4-2.6 3.2 2.2-.6-4.2 2.6 1z" fill="currentColor"/></svg>';
  PJ.LEAF = LEAF;
  PJ.example = function (container, ex, opts) {
    opts = opts || {};
    var box = el('section', 'pj-ex' + (opts.hidden ? ' is-hidden' : ''));
    var head = el('div', 'pj-ex-h', '<span class="pj-ex-badge">' + LEAF + 'Worked example</span><b>' + esc(ex.title || '') + '</b>');
    var tog = el('button', 'btn btn-ghost btn-small pj-ex-tog', opts.hidden ? 'Show me' : 'Hide'); tog.type = 'button'; head.appendChild(tog);
    box.appendChild(head);
    var inner = el('div', 'pj-ex-in'); box.appendChild(inner);
    var stage = el('div', 'pj-ex-stage'), cap = el('div', 'pj-ex-cap'), ctl = el('div', 'pj-ex-ctl');
    inner.appendChild(stage); inner.appendChild(cap); inner.appendChild(ctl);
    var prev = el('button', 'btn btn-ghost btn-small', '← Back'), next = el('button', 'btn btn-primary btn-small pj-ex-next', 'Next step →'), dots = el('div', 'pj-dots');
    prev.type = next.type = 'button'; ctl.appendChild(prev); ctl.appendChild(dots); ctl.appendChild(next);
    var i = -1, n = ex.steps.length, timers = [];
    function go(k, anim) {
      timers.forEach(clearTimeout); timers = [];
      i = Math.max(0, Math.min(n - 1, k));
      var html = ex.scene ? '<div class="pj-ex-scene">' + ex.scene + '</div>' : '';
      for (var j = 0; j <= i; j++) html += '<div class="pj-ex-step' + (j === i && anim !== false ? ' pj-new' : '') + (j === i ? ' is-cur' : '') + '">' + ex.steps[j].html + '</div>';
      stage.innerHTML = html;
      cap.innerHTML = '<span class="pj-ex-n">' + (i + 1) + '</span><p>' + ex.steps[i].cap + '</p>';
      prev.disabled = i === 0; next.textContent = i === n - 1 ? 'Watch again ↺' : 'Next step →'; next.classList.toggle('pulse', i < n - 1);
      dots.innerHTML = ex.steps.map(function (_, j) { return '<i class="' + (j <= i ? 'on' : '') + '"></i>'; }).join('');
      var cur = stage.querySelector('.pj-ex-step.is-cur');
      if (cur && anim !== false) animate(cur, timers);
      else stage.querySelectorAll('.pj-count').forEach(function (s) { s.textContent = fmtCount(Number(s.dataset.to), s.dataset.fmt); });
      stage.querySelectorAll('.pj-ex-step:not(.is-cur) .pj-count').forEach(function (s) { s.textContent = fmtCount(Number(s.dataset.to), s.dataset.fmt); });
      stage.querySelectorAll('.pj-ex-step:not(.is-cur) .pj-type').forEach(function (s) { s.style.width = 'auto'; });
    }
    prev.addEventListener('click', function () { go(i - 1); });
    next.addEventListener('click', function () { go(i === n - 1 ? 0 : i + 1); });
    tog.addEventListener('click', function () { var h = box.classList.toggle('is-hidden'); tog.textContent = h ? 'Show me' : 'Hide'; if (opts.onToggle) opts.onToggle(h); if (!h && i < 0) go(0); });
    container.appendChild(box);
    if (!opts.hidden) go(0);
    return { box: box, go: go };
  };
  function fmtCount(v, f) { return f === 'pct' ? pctText(v) : f === 'num' ? String(Math.round(v * 100) / 100) : f === 'usd' ? money(v, 'US$') : money(v); }
  function animate(node, timers) {
    node.querySelectorAll('.pj-count').forEach(function (s) {
      var to = Number(s.dataset.to), f = s.dataset.fmt, delay = Number(s.dataset.delay || 350), t0 = 0, dur = 700;
      s.textContent = fmtCount(0, f);
      timers.push(setTimeout(function () {
        function tick(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3); s.textContent = fmtCount(p < 1 ? to * e : to, f); if (p < 1 && s.isConnected) requestAnimationFrame(tick); }
        requestAnimationFrame(tick);
      }, delay));
    });
    node.querySelectorAll('.pj-type').forEach(function (s) {
      var txt = s.textContent, k = 0, delay = Number(s.dataset.delay || 200); s.textContent = ''; s.classList.add('typing');
      timers.push(setTimeout(function step() { k++; s.textContent = txt.slice(0, k); if (k < txt.length) timers.push(setTimeout(step, 45)); else s.classList.remove('typing'); }, delay));
    });
  }

  /* ================= student side ================= */
  var App = function () { return HW.App || null; };
  var L = function () { return HW.Ledger || { enabled: false }; };
  var STORE = 'hw:proj:', ST = null, stKey = '', GRADES = {}, listeners = [], dirty = {}, pushTimer = null, saveTimer = null;
  function lsx(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); if (v === null) root.localStorage.removeItem(k); else root.localStorage.setItem(k, v); } catch (e) { return null; } }
  function sess() { var A = App(); return A && A.session ? A.session() : null; }
  function skey() { var s = sess(); return s ? (s.klass || 'local').toLowerCase() + '|' + String(s.name).toLowerCase() : ''; }
  function store() {
    var k = skey(); if (!k) return null;
    if (!ST || stKey !== k) { stKey = k; try { ST = JSON.parse(lsx(STORE + k) || 'null'); } catch (e) { ST = null; } if (!ST || ST.v !== 1) ST = { v: 1, projects: {} }; GRADES = (ST.grades && typeof ST.grades === 'object') ? ST.grades : {}; }
    return ST;
  }
  function stateOf(pid, create) {
    var s = store(); if (!s) return null;
    var P = s.projects[pid];
    if (!P && create) { P = s.projects[pid] = PJ.blank(); P.created = Date.now(); }
    if (P) { if (!P.v) P.v = {}; if (!P.cps) P.cps = {}; P.seed = hash(skey() + '|' + pid); }
    return P;
  }
  PJ.state = function (pid) { return stateOf(pid, false); };
  function saveLocal() { if (ST && stKey) { ST.grades = GRADES; lsx(STORE + stKey, JSON.stringify(ST)); } }
  function touched(pid) {
    var P = stateOf(pid, true); P.updated = Date.now(); dirty[pid] = 1;
    if (saveTimer) clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveTimer = null; saveLocal(); }, 300);
    if (!pushTimer) pushTimer = setTimeout(function () { pushTimer = null; pushAll(); }, 2500);
  }
  function summaryOf(def, P) { return { done: PJ.doneCount(def, P), total: def.checkpoints.length, submitted: P.submitted || 0 }; }
  /* send a project to the ledger (POST, no-cors like every other write; lock-free on the server) */
  function post(pid, beacon) {
    var Lg = L(), s = sess(), def = HW.PROJECTS[pid], P = stateOf(pid, false), url = (root.HW_CONFIG || {}).backend;
    if (!Lg.enabled || !url || !s || !s.token || !def || !P) return false;
    var body = JSON.stringify({ kind: 'project', 'class': s.klass, name: s.name, token: s.token, device: lsx('hw:device') || '', project: pid, state: P, summary: summaryOf(def, P) });
    if (beacon && navigator.sendBeacon) { try { if (navigator.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=utf-8' }))) { delete dirty[pid]; return true; } } catch (e) {} }
    delete dirty[pid];
    try { fetch(url, { method: 'POST', mode: 'no-cors', credentials: 'omit', keepalive: body.length < 60000, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body }).catch(function () { dirty[pid] = 1; }); }
    catch (e) { dirty[pid] = 1; }
    return true;
  }
  function pushAll(beacon) { saveLocal(); Object.keys(dirty).forEach(function (pid) { post(pid, beacon); }); }
  if (hasDoc) {
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') pushAll(true); });
    root.addEventListener('pagehide', function () { pushAll(true); });
  }
  /* the server's copy: newer work wins (by the device's own updated time); released grades come with it */
  var loading = null;
  PJ.load = function () {
    var Lg = L(), s = sess(); store();
    if (!Lg.enabled || !s || !s.token) return Promise.resolve(false);
    if (loading) return loading;
    loading = Lg.get('myprojects', { 'class': s.klass, name: s.name, token: s.token }, 20000).then(function (d) {
      loading = null; if (!d || !d.ok) return false;
      var changed = false, was = JSON.stringify(GRADES);
      Object.keys(d.projects || {}).forEach(function (pid) {
        var r = d.projects[pid], mine = stateOf(pid, false);
        if (r.state && typeof r.state === 'object' && (!mine || (Number(r.state.updated) || 0) > (Number(mine.updated) || 0))) {
          var keepSecs = mine ? mine.secs || 0 : 0; ST.projects[pid] = r.state; ST.projects[pid].secs = Math.max(keepSecs, r.state.secs || 0); changed = true;
        } else if (mine && r.state && (Number(mine.updated) || 0) > (Number(r.state.updated) || 0)) dirty[pid] = 1; // this device is ahead: send it
        if (r.grade && r.released) GRADES[pid] = { grade: r.grade, released: r.released }; else delete GRADES[pid];
      });
      Object.keys(GRADES).forEach(function (pid) { if (!d.projects || !d.projects[pid] || !d.projects[pid].released) delete GRADES[pid]; });
      if (JSON.stringify(GRADES) !== was) changed = true;
      saveLocal(); if (Object.keys(dirty).length) setTimeout(pushAll, 500);
      if (changed) listeners.forEach(function (f) { try { f(); } catch (e) {} });
      return changed;
    }, function () { loading = null; return false; });
    return loading;
  };
  PJ.onChange = function (f) { listeners.push(f); };
  PJ.grade = function (pid) { store(); return GRADES[pid] || null; };
  /* released project indicators, for the outcome badges: [{ title, levels: { N1: 'PRG' } }] */
  PJ.releasedLevels = function () {
    store(); var out = [];
    Object.keys(GRADES).forEach(function (pid) { var g = GRADES[pid], def = HW.PROJECTS[pid]; if (g && g.grade && g.grade.lv) out.push({ title: def ? def.title : 'a project', levels: g.grade.lv }); });
    return out;
  };

  /* ---- calendar: the project opens with the unit's first lesson and is due on the unit test day ---- */
  function calInfo(def) {
    var A = App(), C = HW.Cal, D = A && A.calData ? A.calData() : null, out = { due: '', opens: '', today: C ? C.today() : '' };
    if (!C || !D || !D.cal) return out;
    var LAY = C.layout(D.cal, D.noSchool);
    out.due = LAY.dateOf['t' + def.unit] || '';
    var u = (HW.CATALOG || []).filter(function (x) { return x.unit === def.unit; })[0];
    if (u) u.lessons.forEach(function (c) { var d = !c.intro && LAY.dateOf[c.id]; if (d && (!out.opens || d < out.opens)) out.opens = d; });
    out.workDay = LAY.dateOf['p' + def.unit] || '';
    out.lessonDate = function (id) { return LAY.dateOf[id] || ''; };
    return out;
  }
  PJ.calInfo = calInfo;
  function niceDate(d, long) { return HW.Cal ? HW.Cal.nice(d, long ? { weekday: 'long', month: 'long', day: 'numeric' } : undefined) : d; }
  function catLesson(id) { var hit = null; (HW.CATALOG || []).forEach(function (u) { u.lessons.forEach(function (c) { if (c.id === id) hit = { unit: u.unit, num: c.num, title: c.title }; }); }); return hit; }
  function needName(def, id) { var c = catLesson(id); return c ? c.unit + '.' + c.num + ' ' + ((def.lessonNames || {})[id] || String(c.title).split(':')[0]) : id; }
  /* the needs of a checkpoint as chips: taught (✓), coming up (its date) */
  function needChips(def, cp, ci) {
    var w = el('div', 'pj-needs');
    if (!cp.needs || !cp.needs.length) { w.appendChild(el('span', 'pj-need none', 'No new lessons needed')); return w; }
    w.appendChild(el('span', 'pj-needs-l', 'Uses lessons'));
    cp.needs.forEach(function (id) {
      var d = ci && ci.lessonDate ? ci.lessonDate(id) : '', st = !d ? '' : d <= ci.today ? 'taught' : 'later';
      var chip = el('span', 'pj-need' + (st ? ' is-' + st : ''), (st === 'taught' ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.2 6.4 4.8 9 9.8 3.4"/></svg>' : '') + esc(needName(def, id)) + (st === 'later' ? '<small>' + esc(niceDate(d)) + '</small>' : ''));
      chip.title = st === 'taught' ? 'Taught ' + niceDate(d, true) : st === 'later' ? 'Coming up: ' + niceDate(d, true) : '';
      w.appendChild(chip);
    });
    return w;
  }
  function laterNeeds(cp, ci) {
    if (!ci || !ci.lessonDate) return [];
    return (cp.needs || []).filter(function (id) { var d = ci.lessonDate(id); return d && d > ci.today; });
  }

  /* ---- the project card on the home page (in its unit) ---- */
  var SHOP_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 20h32v20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#fff" stroke="currentColor" stroke-width="2.4"/><path d="M6 12l3-6h30l3 6v3a5 5 0 0 1-9 3 5 5 0 0 1-9 0 5 5 0 0 1-9 0 5 5 0 0 1-9-3z" fill="currentColor" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M15 12v4M24 12v4M33 12v4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><rect x="14" y="27" width="9" height="15" rx="1" fill="currentColor" opacity=".9"/><rect x="27" y="26" width="9" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>';
  PJ.ICON = SHOP_ICON;
  function ring(done, total, size) {
    var r = 22, C2 = 2 * Math.PI * r, f = total ? done / total : 0;
    return '<svg class="pj-ring" viewBox="0 0 52 52" width="' + (size || 64) + '" height="' + (size || 64) + '" aria-hidden="true"><circle cx="26" cy="26" r="' + r + '" class="pj-ring-t"/><circle cx="26" cy="26" r="' + r + '" class="pj-ring-f" stroke-dasharray="' + (C2 * f).toFixed(2) + ' ' + C2.toFixed(2) + '" transform="rotate(-90 26 26)"/></svg>';
  }
  PJ.ring = ring;
  PJ.card = function (u) {
    var def = PJ.forUnit(u); if (!def || !sess()) return null;
    var P = stateOf(def.id, false) || PJ.blank(), st = PJ.statuses(def, P), done = st.filter(function (s) { return s === 'done'; }).length, n = def.checkpoints.length;
    var ci = calInfo(def), notYet = ci.opens && ci.opens > ci.today, g = PJ.grade(def.id), submitted = !!P.submitted;
    var card = el(notYet ? 'div' : 'a', 'pj-card' + (notYet ? ' is-later' : '') + (submitted ? ' is-sub' : '') + (done === n ? ' is-done' : ''));
    if (!notYet) card.href = '#/project/' + def.id;
    var nextI = st.indexOf('open'), nextCp = def.checkpoints[nextI];
    var badge = el('div', 'pj-card-icon', ring(done, n, 66) + '<span class="pj-card-svg">' + (def.icon || SHOP_ICON) + '</span>');
    card.appendChild(badge);
    var main = el('div', 'pj-card-main');
    main.appendChild(el('div', 'pj-card-k', 'Unit ' + def.unit + ' Project'));
    main.appendChild(el('div', 'pj-card-t', esc(def.title) + (g ? ' <span class="pj-card-g">Graded</span>' : submitted ? ' <span class="pj-card-s">Submitted ✓</span>' : '')));
    main.appendChild(el('div', 'pj-card-d', esc(def.tagline || '')));
    var meta = notYet ? 'Opens ' + esc(niceDate(ci.opens)) + ', with the first lesson of Unit ' + def.unit
      : g ? 'Your teacher has graded it' + (g.grade && g.grade.lv ? ': ' + Object.keys(g.grade.lv).map(function (o) { return '<b>' + esc(o) + '</b> ' + esc((HW.LEVEL_NAMES || {})[g.grade.lv[o]] || g.grade.lv[o]); }).join(', ') : '')
      : submitted ? 'Handed in ' + esc(new Date(P.submitted).toLocaleDateString([], { month: 'short', day: 'numeric' })) + '. You can still open it and hand it in again.'
      : nextCp ? (done ? 'Next: ' : 'Start with ') + 'Checkpoint ' + (nextI + 1) + ' · ' + esc(nextCp.title) + (laterNeeds(nextCp, ci).length ? ' <span class="pj-card-wait">(uses ' + esc(needName(def, laterNeeds(nextCp, ci)[0])) + ', ' + esc(niceDate(ci.lessonDate(laterNeeds(nextCp, ci)[0]))) + ')</span>' : '') : '';
    main.appendChild(el('div', 'pj-card-next', meta));
    card.appendChild(main);
    var side = el('div', 'pj-card-side');
    side.appendChild(el('div', 'pj-card-n', '<b>' + done + '</b> of ' + n + ' checkpoints'));
    if (ci.due) side.appendChild(el('div', 'pj-card-due' + (ci.due >= ci.today && !submitted ? ' soon' : ''), 'Due ' + esc(niceDate(ci.due))));
    else side.appendChild(el('div', 'pj-card-due', 'Due on the unit test day'));
    if (!notYet) side.appendChild(el('span', 'pj-card-go', submitted || done === n ? 'Open' : done || P.updated ? 'Continue →' : 'Start →'));
    card.appendChild(side);
    return card;
  };
  /* "Pop-Up Shop due Fri, Nov 20" beside the next test on the home page, while the project is open and not handed in */
  PJ.dueNotices = function () {
    if (!sess()) return [];
    var out = [];
    PJ.list().forEach(function (def) {
      var ci = calInfo(def), P = stateOf(def.id, false); if (!ci.due || ci.due < ci.today || (ci.opens && ci.opens > ci.today) || (P && P.submitted)) return;
      var st = PJ.statuses(def, P || PJ.blank()), done = st.filter(function (s) { return s === 'done'; }).length;
      var b = el('a', 'next-test hh-test pj-due', '<span class="pj-due-i">' + (def.icon || SHOP_ICON) + '</span><span class="tt-l">' + esc(def.title) + ' due </span><b>' + esc(niceDate(ci.due)) + '</b><span class="tt-w"> · ' + done + '/' + def.checkpoints.length + '</span>');
      b.href = '#/project/' + def.id; b.title = def.title + ' (Unit ' + def.unit + ' project) is due ' + niceDate(ci.due, true) + ', the unit test day. ' + done + ' of ' + def.checkpoints.length + ' checkpoints done.';
      out.push(b);
    });
    return out;
  };
  /* the home page's "Today in class" panel on a project work day (calendar key 'p' + unit) */
  PJ.todayPanel = function (info) {
    var def = HW.PROJECTS[info.project]; if (!def || !sess()) return null;
    var P = stateOf(def.id, false) || PJ.blank(), st = PJ.statuses(def, P), done = st.filter(function (s) { return s === 'done'; }).length, ci = calInfo(def);
    var box = el('section', 'today pj-today'); if (HW.unitStyle) box.setAttribute('style', HW.unitStyle(def.unit));
    box.appendChild(el('div', 'td-badge pj-today-b', def.icon || SHOP_ICON));
    var main = el('div', 'td-main', '<div class="td-when">Today in class · Unit ' + def.unit + ' project work day</div><h2 class="td-title">' + esc(def.title) + '</h2><div class="td-sub">' + done + ' of ' + def.checkpoints.length + ' checkpoints done' + (ci.due ? ' · due ' + esc(niceDate(ci.due)) : '') + '</div>');
    box.appendChild(main);
    var acts = el('div', 'td-acts'), a = el('a', 'btn btn-primary td-go', (done ? 'Continue' : 'Start') + ' ' + esc(def.title)); a.href = '#/project/' + def.id; acts.appendChild(a); box.appendChild(acts);
    return box;
  };
  /* a line for the unit test's box on the class calendar */
  PJ.calNote = function (unit) { var def = PJ.forUnit(unit); return def ? '<span class="ct pj-cal-due">' + esc(def.title) + ' due</span>' : ''; };

  /* ---- the project page: #/project/<id>/<checkpoint number> ---- */
  var cur = { pid: null, i: 0, c: null, view: null, tick: null, last: 0 };
  PJ.open = function (view, pid, num) {
    var def = HW.PROJECTS[pid], A = App(); if (!def || !sess()) { location.hash = '#/'; return; }
    var P = stateOf(pid, true); if (!P.created) P.created = Date.now();
    var st = PJ.statuses(def, P), first = st.indexOf('open'); if (first < 0) first = def.checkpoints.length - 1;
    var i = num ? Math.max(0, Math.min(def.checkpoints.length - 1, Number(num) - 1)) : Math.min(P.cur || 0, def.checkpoints.length - 1);
    if (isNaN(i)) i = 0;
    if (st[i] === 'locked') { history.replaceState(null, '', '#/project/' + pid + '/' + (first + 1)); i = first; }
    if (!num) history.replaceState(null, '', '#/project/' + pid + '/' + (i + 1));
    P.cur = i; saveLocal();
    var fresh = cur.pid !== pid || !document.querySelector('.pj-wrap');
    cur.pid = pid; cur.i = i; cur.view = view; cur.last = Date.now();
    document.body.className = 'project';
    if (A && A.drawTop) A.drawTop('<a href="#/">Home</a><span class="sep">/</span>Unit ' + def.unit + ' Project · ' + esc(def.title));
    if (fresh) frame(view, def);
    drawSide(def, P); drawCheckpoint(def, P);
    var Lg = L(); if (Lg.setStatus) Lg.setStatus({ view: 'project', lesson: pid, item: def.checkpoints[i].id, label: def.title + ' · CP ' + (i + 1), away: false }, true);
    root.scrollTo(0, 0);
    startTick();
  };
  PJ.leave = function () { if (cur.pid) { pushAll(); } cur.pid = null; stopTick(); };
  function startTick() {
    stopTick();
    cur.tick = setInterval(function () {
      if (!cur.pid || document.visibilityState !== 'visible' || !document.hasFocus() || Date.now() - cur.last > 120000 || !document.querySelector('.pj-wrap')) return;
      var P = stateOf(cur.pid, false); if (!P) return; P.secs = (P.secs || 0) + 1; if (P.secs % 30 === 0) touched(cur.pid);
    }, 1000);
  }
  function stopTick() { if (cur.tick) clearInterval(cur.tick); cur.tick = null; }
  if (hasDoc) ['pointerdown', 'keydown'].forEach(function (ev) { root.addEventListener(ev, function () { cur.last = Date.now(); }, { passive: true, capture: true }); });

  function frame(view, def) {
    view.innerHTML = '';
    var wrap = el('div', 'pj-wrap'); if (HW.unitStyle) wrap.setAttribute('style', HW.unitStyle(def.unit));
    var side = el('nav', 'pj-side'); side.setAttribute('aria-label', 'Checkpoints');
    var main = el('main', 'pj-main');
    wrap.appendChild(side); wrap.appendChild(main); view.appendChild(wrap);
  }
  function drawSide(def, P) {
    var side = document.querySelector('.pj-side'); if (!side) return;
    var st = PJ.statuses(def, P), done = st.filter(function (s) { return s === 'done'; }).length, ci = calInfo(def), g = PJ.grade(def.id);
    side.innerHTML = '';
    var head = el('div', 'pj-side-h');
    head.innerHTML = '<div class="pj-side-icon">' + ring(done, def.checkpoints.length, 58) + '<span class="pj-card-svg">' + (def.icon || SHOP_ICON) + '</span></div>' +
      '<div><div class="pj-side-k">Unit ' + def.unit + ' Project</div><h2>' + esc(def.title) + '</h2><div class="pj-side-p">' + done + ' of ' + def.checkpoints.length + ' checkpoints' + (ci.due ? ' · due ' + esc(niceDate(ci.due)) : '') + '</div></div>';
    side.appendChild(head);
    var ol = el('ol', 'pj-steps');
    def.checkpoints.forEach(function (cp, i) {
      var s = st[i], li = el('li'), a = el(s === 'locked' ? 'span' : 'a', 'pj-step is-' + s + (i === cur.i ? ' on' : ''));
      if (s !== 'locked') a.href = '#/project/' + def.id + '/' + (i + 1);
      a.innerHTML = '<span class="pj-step-n">' + (s === 'done' ? '<svg viewBox="0 0 16 16" aria-label="done"><path d="M3.5 8.5l3 3 6-7"/></svg>' : s === 'locked' ? '<svg viewBox="0 0 16 16" aria-label="locked"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7"/></svg>' : (i + 1)) + '</span><span class="pj-step-t">' + esc(cp.title) + '</span>';
      if (s === 'locked') a.title = 'Finish Checkpoint ' + i + ' first';
      if (i === cur.i) a.setAttribute('aria-current', 'step');
      li.appendChild(a); ol.appendChild(li);
    });
    side.appendChild(ol);
    if (g) side.appendChild(el('div', 'pj-side-g', '<b>Graded</b> · ' + Object.keys(g.grade.lv || {}).map(function (o) { return esc(o) + ' ' + esc((HW.LEVEL_NAMES || {})[g.grade.lv[o]] || g.grade.lv[o]); }).join(', ')));
    else if (P.submitted) side.appendChild(el('div', 'pj-side-g sub', 'Handed in ' + esc(new Date(P.submitted).toLocaleDateString([], { month: 'short', day: 'numeric' }))));
  }

  function drawCheckpoint(def, P) {
    var main = document.querySelector('.pj-main'); if (!main) return;
    var i = cur.i, cp = def.checkpoints[i], s = cpState(P, cp.id), ci = calInfo(def);
    var c = cur.c = new Ctx(def, P, { seed: P.seed, onChange: function () { touched(def.id); onEdit(); } });
    c.cp = cp; c.index = i;
    main.innerHTML = '';
    // header: checkpoint n of N, title, goal, lessons it uses
    var h = el('header', 'pj-cph');
    h.appendChild(el('div', 'pj-cph-k', 'Checkpoint ' + (i + 1) + ' of ' + def.checkpoints.length));
    h.appendChild(el('h1', '', esc(cp.title)));
    h.appendChild(el('p', 'pj-goal', '<span class="pj-goal-i" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg></span><span><b>Goal:</b> ' + cp.goal + '</span>'));
    h.appendChild(needChips(def, cp, ci));
    var later = laterNeeds(cp, ci);
    if (later.length) h.appendChild(el('div', 'pj-later', '<b>Heads up:</b> this checkpoint uses ' + later.map(function (id) { return 'Lesson ' + esc(needName(def, id)) + ' (' + esc(niceDate(ci.lessonDate(id))) + ')'; }).join(' and ') + '. You can try it now with the example below, or come back after that lesson.'));
    main.appendChild(h);
    if (i === 0 && def.intro) main.appendChild(el('div', 'pj-intro', def.intro));
    // the worked example
    if (cp.example) PJ.example(main, cp.example, { hidden: !!s.ex, onToggle: function (hid) { s.ex = hid ? 1 : 0; saveLocal(); } });
    // the tool
    var tool = el('section', 'pj-tool'); main.appendChild(tool);
    var fb = el('div', 'pj-fb'); fb.setAttribute('aria-live', 'polite');
    function renderTool() {
      var y = root.scrollY; tool.innerHTML = '';
      try { cp.render(tool, c); } catch (e) { tool.appendChild(el('div', 'pj-fb bad', 'This part couldn’t load: ' + esc(e.message))); if (root.console) console.error(e); }
      if (s.n) { var ev = PJ.evaluate(def, cp, c); PJ.markAll(tool, c, ev.results, false); }
      root.scrollTo(0, y);
    }
    c.redraw = renderTool;
    c.onEnter = function () { doCheck(); };
    renderTool();
    // the check bar
    var bar = el('div', 'pj-checkbar');
    var chk = el('button', 'btn btn-primary pj-check', cp.submit ? 'Check and hand in' : 'Check my work'); chk.type = 'button';
    bar.appendChild(chk); bar.appendChild(fb);
    if (!cp.noCheck) main.appendChild(bar);
    function onEdit() { if (fb.classList.contains('form')) { fb.className = 'pj-fb'; fb.innerHTML = ''; } if (fb.classList.contains('good') && !PJ.passed(def, P, i, c)) { fb.className = 'pj-fb'; fb.innerHTML = ''; drawFoot(); drawSide(def, P); } }
    function doCheck() {
      var ev = PJ.evaluate(def, cp, c);
      var msgs = ev.results.filter(function (r) { return r.msg && !r.ok; });
      if (msgs.length) { fb.className = 'pj-fb form'; fb.innerHTML = '<div class="pj-fb-t">Almost ready to check</div><div>' + msgs[0].hint + '</div>'; return; }
      if (ev.blanks.length) {
        PJ.markAll(tool, c, ev.results, false);
        tool.querySelectorAll('[data-f]').forEach(function (w) { if (ev.blanks.some(function (b) { return b.f === w.dataset.f; })) w.classList.add('empty'); });
        setTimeout(function () { tool.querySelectorAll('.empty').forEach(function (w) { w.classList.remove('empty'); }); }, 2400);
        fb.className = 'pj-fb form'; fb.innerHTML = '<div class="pj-fb-t">Fill in every box first</div><div>' + ev.blanks.length + ' box' + (ev.blanks.length === 1 ? ' is' : 'es are') + ' still empty (they’re flashing).</div>';
        var fe = tool.querySelector('.empty input, .empty select, .empty textarea, .empty button'); if (fe) try { fe.focus({ preventScroll: false }); } catch (e) {}
        return;
      }
      // a box's first check counts toward accuracy; format slips (not a number) don't count and don't use a try
      var forms = ev.results.filter(function (r) { return r.form; });
      s.n = (s.n || 0) + 1;
      ev.results.forEach(function (r) { if (!r.f || r.blank || r.form) return; if (r.graded && !(r.f in s.first)) s.first[r.f] = r.ok ? 1 : 0; if (!r.ok) s.w[r.f] = (s.w[r.f] || 0) + 1; });
      PJ.markAll(tool, c, ev.results, true);
      if (ev.ok) {
        var wasDone = !!s.ok; s.ok = Date.now(); touched(def.id);
        var last = i === def.checkpoints.length - 1;
        if (cp.onPass) cp.onPass(c);
        fb.className = 'pj-fb good';
        fb.innerHTML = '<div class="pj-fb-t">' + (cp.submit ? '✓ Handed in!' : '✓ Checkpoint ' + (i + 1) + ' done!') + '</div><div>' + (cp.passMsg || (last ? 'Your project is complete.' : 'Nice work. Your work is saved — go on to Checkpoint ' + (i + 2) + ' when you’re ready.')) + '</div>';
        if (cp.submit) submit(def, P, fb);
        drawSide(def, P); drawFoot(true);
        if (!wasDone && root.matchMedia && !root.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti(fb);
        return;
      }
      touched(def.id);
      var wrong = ev.wrong, first = wrong[0], more = wrong.length - 1;
      var hintsHtml = [], seen = {};
      wrong.forEach(function (r) {
        var t = (s.w[r.f] || 0) >= 2 && r.hint2 ? r.hint2 : r.hint; if (!t || seen[t]) return; seen[t] = 1;
        if (hintsHtml.length < 3) hintsHtml.push('<li>' + (r.label ? '<b>' + r.label + ':</b> ' : '') + t + '</li>');
      });
      fb.className = 'pj-fb hint';
      fb.innerHTML = '<div class="pj-fb-t">' + (forms.length && forms.length === wrong.length ? 'Almost — check the format' : 'Not quite yet') + ' — ' + wrong.length + ' box' + (wrong.length === 1 ? ' needs' : 'es need') + ' another look</div>' +
        (hintsHtml.length ? '<ul class="pj-hints">' + hintsHtml.join('') + '</ul>' : '') + '<div class="pj-fb-s">The green boxes are right. Fix the red ones and check again.</div>';
      var fw = tool.querySelector('.pj-in.bad input'); if (fw) try { fw.focus({ preventScroll: true }); } catch (e) {}
    }
    chk.addEventListener('click', doCheck);
    // footer: back / next
    var foot = el('div', 'pj-foot'); main.appendChild(foot);
    function drawFoot(justPassed) {
      foot.innerHTML = '';
      var back = el('a', 'btn btn-ghost', i ? '← Checkpoint ' + i : '← Home'); back.href = i ? '#/project/' + def.id + '/' + i : '#/'; foot.appendChild(back);
      if (i < def.checkpoints.length - 1) {
        var ok = PJ.passed(def, P, i, c);
        var nx = el(ok ? 'a' : 'button', 'btn ' + (ok ? 'btn-primary' : 'btn-ghost pj-next-lock') + (justPassed ? ' pulse' : ''), ok ? 'Next: Checkpoint ' + (i + 2) + ' →' : '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7"/></svg> Checkpoint ' + (i + 2) + ' opens when this one checks out');
        if (ok) nx.href = '#/project/' + def.id + '/' + (i + 2); else { nx.type = 'button'; nx.addEventListener('click', function () { chk.focus(); doCheck(); }); }
        foot.appendChild(nx);
      } else { var hm = el('a', 'btn btn-ghost', 'Back to home'); hm.href = '#/'; foot.appendChild(hm); }
    }
    drawFoot();
    if (s.ok && PJ.passed(def, P, i, c)) { fb.className = 'pj-fb good'; fb.innerHTML = '<div class="pj-fb-t">✓ Checkpoint ' + (i + 1) + ' is done</div><div>' + (cp.submit ? (P.submitted ? 'Handed in ' + esc(new Date(P.submitted).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })) + '. If you change anything, check it again to hand in the new version.' : '') : 'You can change things and check again any time.') + '</div>'; if (cp.submit) gradeBox(def, fb); }
    else if (s.n) { var ev0 = PJ.evaluate(def, cp, c); if (!ev0.ok && ev0.wrong.length) { fb.className = 'pj-fb'; fb.innerHTML = '<div class="pj-fb-s">Red boxes need another look. Press <b>Check my work</b> when you’re ready.</div>'; } }
  }
  function gradeBox(def, fb) {
    var g = PJ.grade(def.id); if (!g || !g.grade) return;
    var gb = el('div', 'pj-grade', '<div class="pj-grade-t">Your teacher’s feedback</div>' + Object.keys(g.grade.lv || {}).map(function (o) { var lv = g.grade.lv[o]; return '<span class="pj-grade-o"><b>' + esc(o) + '</b> <span class="lvl lvl-' + esc(lv) + '">' + esc((HW.LEVEL_NAMES || {})[lv] || (lv === 'NM' ? 'Not meeting' : lv)) + '</span></span>'; }).join(' ') + (g.grade.cm ? '<p>' + esc(g.grade.cm) + '</p>' : ''));
    fb.appendChild(gb);
  }
  /* hand in: the whole project goes to the ledger; then we ask the ledger whether it has it */
  function submit(def, P, fb) {
    P.submitted = Date.now(); P.subN = (P.subN || 0) + 1; touched(def.id); saveLocal();
    var line = el('div', 'pj-sub-line', 'Sending it to Mr. Cathcart…'); fb.appendChild(line);
    var Lg = L(), s = sess();
    if (!Lg.enabled || !s || !s.token) { line.textContent = 'Saved on this device (practice mode: no teacher ledger).'; return; }
    post(def.id);
    var tries = 0, want = P.submitted;
    (function ask() {
      tries++;
      setTimeout(function () {
        Lg.get('myprojects', { 'class': s.klass, name: s.name, token: s.token }, 15000).then(function (d) {
          var r = d && d.ok && d.projects && d.projects[def.id];
          if (r && r.state && Number(r.state.submitted) >= want) { line.className = 'pj-sub-line ok'; line.textContent = '✓ Mr. Cathcart has it. Nice work!'; return; }
          if (tries < 4) { post(def.id); ask(); } else line.textContent = 'Saved on this device. It will be sent to Mr. Cathcart the next time you’re online.';
        }, function () { if (tries < 4) ask(); else line.textContent = 'Saved on this device. It will be sent to Mr. Cathcart the next time you’re online.'; });
      }, tries === 1 ? 1500 : 3000);
    })();
  }
  function confetti(node) {
    var box = el('div', 'pj-confetti'); node.appendChild(box);
    var cols = ['#2563eb', '#f59e0b', '#16a34a', '#db2777', '#7c3aed', '#0ea5e9'];
    for (var k = 0; k < 26; k++) { var p = el('i'); p.style.cssText = 'left:' + (Math.random() * 100) + '%;background:' + cols[k % cols.length] + ';animation-delay:' + (Math.random() * 0.25).toFixed(2) + 's;--dx:' + ((Math.random() - 0.5) * 120).toFixed(0) + 'px;--rot:' + (Math.random() * 720 - 360).toFixed(0) + 'deg'; box.appendChild(p); }
    setTimeout(function () { box.remove(); }, 1800);
  }

  /* ================= printing (price tags, the flyer) ================= */
  var SITE = (function () { try { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/js\/projects\.js(\?.*)?$/, '') : ''; } catch (e) { return ''; } })();
  PJ.site = SITE;
  PJ.print = function (html, title) {
    var doc = '<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title || 'Print') + '</title><link rel="stylesheet" href="' + SITE + 'assets/projects.css"><style>body{margin:0;background:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}</style></head><body class="pj-print">' + html + '</body></html>';
    var ios = /iP(ad|hone|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) { var w = root.open('', '_blank'); if (w) { w.document.write(doc.replace('</body>', '<script>setTimeout(function(){print()},600)<\/script></body>')); w.document.close(); return; } }
    var old = document.getElementById('pj-print'); if (old) old.remove();
    var f = el('iframe'); f.id = 'pj-print'; f.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0';
    document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(doc); f.contentDocument.close();
    setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) {} }, 700);
  };

  /* ================= read-only (Teacher Ledger) ================= */
  /* every checkpoint of a student's project, with their answers marked right/wrong and the first-try record */
  PJ.review = function (container, def, P) {
    var c = new Ctx(def, P, { ro: true, seed: P.seed || 0 }), st = PJ.statuses(def, P, c), acc = PJ.accuracy(def, P);
    def.checkpoints.forEach(function (cp, i) {
      var sec = el('section', 'pj-rv-cp is-' + st[i]), a = acc.per[cp.id], s = P.cps[cp.id] || {};
      sec.id = 'pjrv-' + cp.id;
      var stat = st[i] === 'done' ? '<span class="tag good">Done</span>' : st[i] === 'open' ? (s.n ? '<span class="tag warn">Working on it</span>' : '<span class="tag">Not started</span>') : '<span class="tag">Locked</span>';
      sec.appendChild(el('h3', 'pj-rv-h', '<span class="pj-rv-n">' + (i + 1) + '</span>' + esc(cp.title) + ' ' + stat + (cp.graded && a.total ? ' <span class="pj-rv-acc" title="Boxes right on the first check">' + a.right + '/' + a.total + ' first try</span>' : '') + (s.n ? ' <span class="muted small">· checked ' + s.n + '×</span>' : '')));
      var tool = el('div', 'pj-tool pj-ro'); sec.appendChild(tool);
      if (st[i] === 'locked' && !Object.keys(s.first || {}).length) { tool.appendChild(el('p', 'muted small', 'Not reached yet.')); container.appendChild(sec); return; }
      c.cp = cp; c.index = i; c.redraw = function () {};
      try { cp.render(tool, c); } catch (e) { tool.appendChild(el('p', 'muted', 'Couldn’t show this checkpoint: ' + esc(e.message))); }
      var ev = PJ.evaluate(def, cp, c); PJ.markAll(tool, c, ev.results, false);
      // a box that was wrong on its first check gets a small flag
      Object.keys(s.first || {}).forEach(function (f) { if (s.first[f]) return; var w = tool.querySelector('[data-f="' + (root.CSS && CSS.escape ? CSS.escape(f) : f) + '"]'); if (w) w.classList.add('was-wrong'); });
      container.appendChild(sec);
    });
  };
})(typeof window !== 'undefined' ? window : global);
