/* Teacher Ledger — the Projects tab: each student's unit project (js/projects.js) for the class.
 * The list: checkpoint dots, first-try accuracy, last active, handed in, the indicator per outcome (set or suggested)
 * and whether it's released. Open a student to see their whole project read-only (every answer marked right/wrong,
 * boxes that were wrong on the first check flagged, the flyer), set an indicator per outcome (a suggested level from
 * first-try accuracy, explained in one line), write a comment, and release it to the student. Released indicators
 * count toward the student's outcome badges like a released test. Backend: projects / setproject (backend/Code.gs). */
(function (root) {
  'use strict';
  var HW = root.HW, el = HW.el, esc = HW.esc, D = HW.Dash, PJ = HW.Projects;
  var st = D.state, LVN = HW.LEVEL_NAMES, LADDER = PJ.LADDER;
  var S = { klass: null, list: null, err: '', pid: null, who: null, edit: {}, cal: null, loading: null };
  function api(a, p) { return D.api(a, p); }
  function ind(lv) { return lv === 'NM' ? 'Not meeting' : LVN[lv] || lv; }
  function ago(ms) { if (!ms) return '—'; var s = Math.round((Date.now() - ms) / 1000); if (s < 60) return 'just now'; var m = Math.round(s / 60); if (m < 60) return m + ' min ago'; var h = Math.round(m / 60); return h < 36 ? h + ' h ago' : Math.round(h / 24) + ' d ago'; }
  function day(ms) { return ms ? new Date(ms).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''; }
  function button(cls, html, fn) { var b = el('button', 'btn ' + cls, html); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function rerender() { if (st.tab === 'projects') D.render(); }
  function defs() { return PJ.list(); }
  function def() { var d = HW.PROJECTS[S.pid]; if (!d) { d = defs()[0]; S.pid = d ? d.id : null; } return d; }

  function load(force) {
    if (S.klass !== st.klass) { S.klass = st.klass; S.list = null; S.who = null; S.cal = null; S.edit = {}; }
    if (S.list && !force) return Promise.resolve();
    var k = st.klass;
    return Promise.all([api('projects', { 'class': k }), api('cal', { 'class': k }).catch(function () { return null; })]).then(function (r) {
      if (k !== st.klass) return;
      var d = r[0];
      if (!d || !d.ok) { S.err = d && d.error === 'unknown action' ? 'The ledger (Apps Script) needs the new backend code for projects: paste backend/Code.gs into the Apps Script project, then Deploy → Manage deployments → edit → New version.' : (d && d.error) || 'Couldn’t load the projects.'; S.list = []; return; }
      S.err = ''; S.list = d.projects || [];
      var c = r[1]; S.cal = c && c.ok && c.cal ? { cal: HW.Cal.clean(c.cal), noSchool: c.noSchool || [] } : null;
    }, function (e) { S.err = 'Couldn’t reach the ledger: ' + (e && e.message || e); S.list = []; });
  }
  /* one student's record for the current project (or an empty one) */
  function recOf(name) {
    var n = String(name).toLowerCase(), hit = (S.list || []).filter(function (x) { return x.project === S.pid && String(x.name).toLowerCase() === n; });
    hit.sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
    var r = hit[0] || { name: name, project: S.pid, state: null, grade: null, released: 0, submitted: 0, updated: 0 };
    var g = hit.filter(function (x) { return x.grade; })[0]; if (g && !r.grade) { r.grade = g.grade; r.released = g.released; }
    if (r.state && typeof r.state === 'object') { var P = r.state; if (!P.v) P.v = {}; if (!P.cps) P.cps = {}; if (P.seed == null) P.seed = PJ.hash(String(st.klass).toLowerCase() + '|' + String(name).toLowerCase() + '|' + S.pid); }
    return r;
  }
  function dueDate(d) {
    if (!S.cal || !HW.Cal) return '';
    var L = HW.Cal.layout(S.cal.cal, S.cal.noSchool); return L.dateOf['t' + d.unit] || '';
  }
  function names() { return ((st.D && st.D.roster) || []).map(function (r) { return r.name; }).sort(function (a, b) { return a.localeCompare(b); }); }

  HW.DashProjects = {
    render: function (body) {
      if (!defs().length) { body.appendChild(el('div', 'panel', '<h3>No unit projects yet</h3>')); return; }
      if (S.klass !== st.klass || !S.list) { body.appendChild(el('div', 'loading', 'Loading projects…')); if (!S.loading) S.loading = load(true).then(function () { S.loading = null; rerender(); }, function () { S.loading = null; }); return; }
      def();
      if (S.who) return renderStudent(body, S.who);
      renderList(body);
    },
    reload: function () { S.list = null; }
  };

  /* ---------------- the class list ---------------- */
  function dots(d, P) {
    var stt = P ? PJ.statuses(d, P) : d.checkpoints.map(function () { return 'locked'; }), acc = P ? PJ.accuracy(d, P) : null;
    return '<span class="tpj-dots">' + d.checkpoints.map(function (cp, i) {
      var s = stt[i], a = acc && acc.per[cp.id], worked = P && P.cps[cp.id] && P.cps[cp.id].n, rate = a && a.rate;
      var cls = s === 'done' ? (cp.graded && rate != null && rate < 0.7 ? 'done lo' : 'done') : worked ? 'some' : '';
      return '<i class="' + cls + '" title="' + esc((i + 1) + '. ' + cp.title + ': ' + (s === 'done' ? 'done' : worked ? 'started' : 'not started') + (a && a.total && cp.graded ? ' · ' + a.right + '/' + a.total + ' first try' : '')) + '"></i>';
    }).join('') + '</span>';
  }
  function renderList(body) {
    var d = def(), due = dueDate(d), rows = names().map(recOf);
    var head = el('div', 'tpj-head');
    var left = el('div', '', '<h2 class="tt-h">Projects</h2><div class="small muted">' + esc(st.D && st.D['class'] ? st.D['class'].label || st.klass : st.klass) + ' · Unit ' + d.unit + ' project <b>' + esc(d.title) + '</b>' + (due ? ' · due ' + esc(HW.Cal.nice(due, { weekday: 'long', month: 'long', day: 'numeric' })) + ' (the unit test day)' : '') + '</div>');
    head.appendChild(left);
    var right = el('div', 'tpj-acts');
    if (defs().length > 1) { var seg = el('div', 'seg'); defs().forEach(function (x) { var b = el('button', x.id === S.pid ? 'on' : '', 'U' + x.unit + ' · ' + esc(x.title)); b.type = 'button'; b.addEventListener('click', function () { S.pid = x.id; rerender(); }); seg.appendChild(b); }); right.appendChild(seg); }
    var waiting = rows.filter(function (r) { return r.grade && !r.released; });
    if (waiting.length) right.appendChild(button('btn-primary btn-small', 'Release ' + waiting.length + ' graded', function (e) { releaseAll(waiting, e.currentTarget); }));
    right.appendChild(button('btn-ghost btn-small', '↻ Refresh', function () { S.list = null; rerender(); }));
    head.appendChild(right); body.appendChild(head);
    if (S.err) { body.appendChild(el('div', 'panel', '<h3>Projects aren’t set up yet</h3><p>' + esc(S.err) + '</p>')); return; }
    var sub = rows.filter(function (r) { return r.submitted; }).length, started = rows.filter(function (r) { return r.state && r.state.updated; }).length, graded = rows.filter(function (r) { return r.grade; }).length, rel = rows.filter(function (r) { return r.released; }).length;
    body.appendChild(el('div', 'tpj-sum', '<span><b>' + started + '</b> started</span><span><b>' + sub + '</b> handed in</span><span><b>' + graded + '</b> graded</span><span><b>' + rel + '</b> released</span><span class="muted small">of ' + rows.length + ' students</span>'));
    var t = el('table', 'tbl tpj-tbl'), outs = d.outcomes || [];
    t.innerHTML = '<thead><tr><th>Student</th><th>Checkpoints<div class="th-sub">' + d.checkpoints.length + ' in all</div></th><th class="c">First try<div class="th-sub">right on 1st check</div></th><th>Last active</th><th>Handed in</th>' + outs.map(function (o) { return '<th>' + esc(o) + '<div class="th-sub">indicator</div></th>'; }).join('') + '<th>Released</th><th></th></tr></thead>';
    var tb = el('tbody');
    rows.forEach(function (r) {
      var P = r.state, acc = P ? PJ.accuracy(d, P) : null, sug = P ? PJ.suggest(d, P) : null, tr = el('tr');
      var done = P ? PJ.doneCount(d, P) : 0;
      tr.innerHTML = '<td><a href="#" class="slink"><b>' + esc(r.name) + '</b></a></td><td class="nowrap">' + dots(d, P) + ' <span class="small muted">' + done + '/' + d.checkpoints.length + '</span></td>' +
        '<td class="c">' + (acc && acc.total ? '<b>' + Math.round(100 * acc.rate) + '%</b> <span class="small muted">' + acc.right + '/' + acc.total + '</span>' : '<span class="muted">—</span>') + '</td>' +
        '<td class="nowrap">' + (P && P.updated ? ago(P.updated) : '<span class="muted">Not started</span>') + (P && P.secs >= 60 ? '<div class="small muted">' + Math.round(P.secs / 60) + ' min on it</div>' : '') + '</td>' +
        '<td class="nowrap">' + (r.submitted ? '<span class="tag good">✓ ' + esc(day(r.submitted)) + '</span>' : '<span class="muted">—</span>') + '</td>' +
        outs.map(function (o) { var lv = r.grade && r.grade.lv && r.grade.lv[o]; return '<td>' + (lv ? '<span class="lvl lvl-' + lv + '">' + esc(ind(lv)) + '</span>' : sug && P && P.updated ? '<span class="tpj-sug" title="' + esc(sug.why) + '">suggests ' + esc(sug.ind) + '</span>' : '<span class="muted">—</span>') + '</td>'; }).join('') +
        '<td>' + (r.released ? '<span class="tag good">' + esc(day(r.released)) + '</span>' : r.grade ? '<span class="tag">Not yet</span>' : '') + '</td><td></td>';
      var open = function (e) { if (e) e.preventDefault(); S.who = r.name; rerender(); root.scrollTo(0, 0); };
      tr.querySelector('.slink').addEventListener('click', open);
      tr.lastChild.appendChild(button('btn-small' + (r.submitted && !r.grade ? ' btn-primary' : ''), r.submitted && !r.grade ? 'Grade' : 'Open', open));
      tb.appendChild(tr);
    });
    t.appendChild(tb); body.appendChild(D.wrapTbl(t));
    body.appendChild(el('p', 'small muted', '<span class="tpj-dots"><i class="done"></i></span> done · <span class="tpj-dots"><i class="some"></i></span> started · <span class="tpj-dots"><i></i></span> not started · <span class="tpj-dots"><i class="done lo"></i></span> done, under 70% right on the first check. “First try” counts each answer box the first time the student checked it filled in. A suggested indicator comes from that accuracy on the math checkpoints (one step down for each one not done) — open a student to set the indicator, add a comment and release it.'));
  }
  function releaseAll(list, btn) {
    btn.disabled = true; btn.textContent = 'Releasing…';
    var k = st.klass, chain = Promise.resolve(), n = 0;
    list.forEach(function (r) { chain = chain.then(function () { return api('setproject', { 'class': k, name: r.name, project: S.pid, release: '1' }).then(function (d) { if (d && d.ok) n++; }); }); });
    chain.then(function () { return load(true); }).then(function () { rerender(); D.flash(document.querySelector('.tab-body') || document.body, 'Released ' + n + ' project grade' + (n === 1 ? '' : 's') + ' to students.'); }, function () { btn.disabled = false; btn.textContent = 'Release graded'; alert('Couldn’t reach the ledger.'); });
  }

  /* ---------------- one student ---------------- */
  function renderStudent(body, name) {
    var d = def(), r = recOf(name), P = r.state, all = names(), i = all.indexOf(name);
    var top = el('div', 'tpj-top');
    top.appendChild(button('btn-ghost btn-small', '← All students', function () { S.who = null; rerender(); }));
    var nav = el('div', 'tpj-nav');
    var pv = button('btn-ghost btn-small', '← ' + esc(all[i - 1] || ''), function () { S.who = all[i - 1]; rerender(); root.scrollTo(0, 0); }); pv.disabled = i <= 0; if (i <= 0) pv.textContent = '←';
    var nx = button('btn-ghost btn-small', esc(all[i + 1] || '') + ' →', function () { S.who = all[i + 1]; rerender(); root.scrollTo(0, 0); }); nx.disabled = i < 0 || i >= all.length - 1; if (nx.disabled) nx.textContent = '→';
    nav.appendChild(pv); nav.appendChild(nx); top.appendChild(nav);
    body.appendChild(top);
    var wrap = el('div', 'tpj-wrap'); if (HW.unitStyle) wrap.setAttribute('style', HW.unitStyle(d.unit)); body.appendChild(wrap);
    var main = el('div', 'tpj-main'), side = el('aside', 'tpj-side');
    wrap.appendChild(main); wrap.appendChild(side);
    var acc = P ? PJ.accuracy(d, P) : null, done = P ? PJ.doneCount(d, P) : 0;
    main.appendChild(el('div', 'tpj-sh', '<h2 class="tt-h">' + esc(name) + '</h2><div class="small muted">' + esc(d.title) + ' · ' + done + ' of ' + d.checkpoints.length + ' checkpoints done' +
      (acc && acc.total ? ' · ' + Math.round(100 * acc.rate) + '% right on the first check (' + acc.right + '/' + acc.total + ')' : '') + (P && P.updated ? ' · last active ' + ago(P.updated) : '') + (P && P.secs >= 60 ? ' · ' + Math.round(P.secs / 60) + ' min on it' : '') +
      (r.submitted ? ' · <span class="tag good">Handed in ' + esc(day(r.submitted)) + '</span>' : ' · <span class="tag">Not handed in</span>') + '</div>'));
    if (!P || !P.updated) main.appendChild(el('div', 'panel', '<p class="muted">' + esc(name) + ' hasn’t started this project yet.</p>'));
    else {
      main.appendChild(el('p', 'small muted tpj-legend', 'Green ✓ right now · red ! wrong now · <span class="tpj-ww">orange ✓</span> right now but wrong on the first check. Choices that weren’t picked are faded.'));
      var rv = el('div', 'tpj-review'); main.appendChild(rv); PJ.review(rv, d, JSON.parse(JSON.stringify(P)));
    }
    gradePanel(side, d, r, P);
  }
  function gradePanel(side, d, r, P) {
    var key = r.name + '|' + d.id, ed = S.edit[key] || (S.edit[key] = { lv: Object.assign({}, (r.grade && r.grade.lv) || {}), cm: (r.grade && r.grade.cm) || '', dirty: false });
    var sug = P ? PJ.suggest(d, P) : { ind: 'NM', why: 'Not started.' };
    var box = el('div', 'panel tpj-grade');
    box.appendChild(el('h3', '', 'Grade'));
    (d.outcomes || []).forEach(function (o) {
      var row = el('div', 'tpj-orow');
      row.appendChild(el('div', 'tpj-o', '<b>' + esc(o) + '</b> <span class="small muted">' + esc((HW.OUTCOMES || {})[o] || '') + '</span>'));
      var sel = el('select', 'field tpj-sel'); sel.appendChild(new Option('Pick an indicator…', ''));
      LADDER.slice().reverse().forEach(function (lv) { sel.appendChild(new Option(ind(lv) + (lv === sug.ind ? '  (suggested)' : ''), lv)); });
      sel.value = ed.lv[o] || ''; sel.addEventListener('change', function () { if (sel.value) ed.lv[o] = sel.value; else delete ed.lv[o]; ed.dirty = true; status(); });
      row.appendChild(sel);
      var sg = el('div', 'tpj-sugline', '<span>Suggested <span class="lvl lvl-' + sug.ind + '">' + esc(ind(sug.ind)) + '</span></span> <span class="small muted">' + esc(sug.why) + '</span>');
      var use = button('btn-ghost btn-small', 'Use it', function () { ed.lv[o] = sug.ind; sel.value = sug.ind; ed.dirty = true; status(); }); sg.appendChild(use);
      row.appendChild(sg);
      box.appendChild(row);
    });
    box.appendChild(el('label', 'lbl', 'Comment for the student'));
    var ta = el('textarea', 'field tpj-cm'); ta.rows = 5; ta.maxLength = 800; ta.value = ed.cm; ta.placeholder = 'One thing they did well, one thing to work on…';
    ta.addEventListener('input', function () { ed.cm = ta.value; ed.dirty = true; status(); }); box.appendChild(ta);
    var stl = el('div', 'small muted tpj-status'); box.appendChild(stl);
    var acts = el('div', 'tpj-gacts');
    var save = button('btn-small', 'Save', function () { send(null); });
    var rel = button('btn-primary btn-small', r.released ? 'Save (released)' : 'Save and release', function () { send(r.released ? null : '1'); });
    acts.appendChild(save); acts.appendChild(rel);
    if (r.released) acts.appendChild(button('btn-ghost btn-small', 'Hide from student', function () { send('0'); }));
    box.appendChild(acts);
    function status() { stl.innerHTML = r.released ? '<span class="tag good">Released ' + esc(day(r.released)) + '</span> The student sees this grade and comment' + (ed.dirty ? ' — <b>save to update it</b>.' : '.') : r.grade ? 'Saved, not released yet.' + (ed.dirty ? ' <b>Unsaved changes.</b>' : '') : ed.dirty ? '<b>Not saved yet.</b>' : 'Not graded yet.'; }
    status();
    function send(release) {
      if (!Object.keys(ed.lv).length && release !== '0') { alert('Pick an indicator first.'); return; }
      [save, rel].forEach(function (b) { b.disabled = true; });
      var p = { 'class': st.klass, name: r.name, project: d.id, grade: JSON.stringify({ lv: ed.lv, cm: ed.cm }) };
      if (release) p.release = release;
      api('setproject', p).then(function (x) {
        if (!x || !x.ok) { alert('Couldn’t save: ' + ((x && x.error) || 'no answer')); [save, rel].forEach(function (b) { b.disabled = false; }); return; }
        ed.dirty = false;
        return load(true).then(function () { rerender(); D.flash(document.querySelector('.tpj-grade') || document.body, release === '1' ? 'Saved and released to ' + r.name + '.' : release === '0' ? 'Hidden from ' + r.name + '.' : 'Saved.'); });
      }, function () { alert('Couldn’t reach the ledger.'); [save, rel].forEach(function (b) { b.disabled = false; }); });
    }
    side.appendChild(box);
    // per checkpoint accuracy
    if (P) {
      var acc = PJ.accuracy(d, P), stt = PJ.statuses(d, P), cb = el('div', 'panel tpj-cps');
      cb.appendChild(el('h3', '', 'Checkpoints'));
      d.checkpoints.forEach(function (cp, i) {
        var a = acc.per[cp.id], s = stt[i];
        var row = cb.appendChild(el('div', 'tpj-cprow', '<span class="tpj-cpn ' + s + '">' + (i + 1) + '</span><span class="tpj-cpt">' + esc(cp.title) + '</span><span class="small">' + (cp.graded ? (a.total ? '<b>' + a.right + '/' + a.total + '</b> first try' : '<span class="muted">—</span>') : '<span class="muted">choices</span>') + '</span>'));
        row.title = 'Show checkpoint ' + (i + 1); row.addEventListener('click', function () { var t = document.getElementById('pjrv-' + cp.id); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      });
      side.appendChild(cb);
    }
  }
})(window);
