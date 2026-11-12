/* Math 10-3 · Unit 5 · Lesson 2 — Spatial Games and Strategies (G1)
 * Assignment 2 (u5_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u5_ep02.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the same game and difficulty as the booklet item with new piles, positions or numbers (the
 * lesson's worked examples are left out: piles 10, 21, 24, 23, 15, the Example 4 and 5 boards, 8 discs).
 * Calculator allowed.
 * Answers are all checked automatically: "where should you play / how many should you take" are positions with exactly
 * one right move (a square number, a number of counters); win/lose tables and "how many to take from each pile" are
 * tables of choices; "which line is safe" is a table (safe / gives away 1 box / gives away 2 boxes); ship positions and
 * squares to call are tap-every-one-that-fits chips; tower counts and times are numbers (minutes and seconds in two
 * boxes); "why / what is the error / which variation" → multiple choice of reasons (one right).
 * Recognised wrong values get their own hint: leaving a multiple of 4 in a game with other rules, the counters left
 * instead of the number taken, 2ⁿ (forgot − 1), doubling without the biggest disc's move, the total seconds instead of
 * the leftover seconds, a block when a win is there, a move that makes only one threat, a taken square (a nudge), and
 * so on.
 * Outcome G1. Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var INK = '#1d2633', GREY = '#8a919d', ANS = '#c93a33', FONT = 'font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"';

  /* ======================= helpers ======================= */
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function nf(x) { return String(Math.round(x * 1e6) / 1e6); }
  function f1(v) { return String(Math.round(v * 10) / 10); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function svgOpen(x0, y0, W, H, label, maxW) { return '<svg class="u5-fig" viewBox="' + f1(x0) + ' ' + f1(y0) + ' ' + f1(W) + ' ' + f1(H) + '" width="' + Math.round(Math.min(maxW || 9999, W)) + '" style="max-width:100%;height:auto;vertical-align:middle;display:inline-block" role="img" aria-label="' + esc(label || 'figure') + '">'; }
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + FONT + ' font-size="' + (o.size || 12) + '" font-weight="' + (o.weight || 700) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + (o.italic ? ' font-style="italic"' : '') + '>' + esc(s) + '</text>'; }
  function numDiag(list) { return function (v) { for (var i = 0; i < list.length; i++) if (list[i] && Math.abs(v - list[i][0]) < 1e-9 && list[i][1]) return { code: list[i][2] || 'u5l2-diag', hint: list[i][1] }; return null; }; }
  function cleanBad(bad, ans) { var seen = {}; return (bad || []).filter(function (b) { if (!b || !isFinite(b[0]) || Math.abs(b[0] - ans) < 1e-9 || seen[b[0]]) return false; seen[b[0]] = 1; return true; }); }
  function numPart(prompt, ans, bad, sol, hints, text, inp) {
    bad = cleanBad(bad, ans);
    var p = P.number(prompt, ans, numDiag(bad), sol, hints, text, inp); p.key = nf(ans); p.answer = t(nf(ans)) + (inp && inp.after ? ' ' + (ans === 1 ? inp.after.replace(/s$/, '') : inp.after) : ''); p.bad = bad.map(function (b) { return nf(b[0]); });
    return p;
  }
  function nrPart(prompt, ans, bad, sol, hints, text) { bad = cleanBad(bad, ans); var p = P.nr(prompt, ans, numDiag(bad), sol, hints, text); p.key = nf(ans); p.bad = bad.map(function (b) { return nf(b[0]); }); return p; }
  function fieldsPart(prompt, rows, sol, hints, text) {
    var ck = rows.map(function (rw) { return K.number(rw.ans, numDiag(cleanBad(rw.bad, rw.ans))); });
    return P.fields(prompt, rows.map(function (rw) { return { label: rw.label, name: rw.name || rw.label.replace(/:$/, ''), after: rw.after }; }), ck, rows.map(function (rw) { return nf(rw.ans); }),
      rows.map(function (rw) { return rw.label + ' ' + t(nf(rw.ans)) + (rw.after ? ' ' + rw.after : ''); }).join(' &nbsp; '), sol, hints, text);
  }
  function selectPart(prompt, opts, want, diag, answerHtml, sol, hints, text, help) {
    return { prompt: prompt, input: { type: 'select', options: opts, help: help }, check: K.selectSet(want, diag), key: want.slice(), answer: answerHtml, solution: sol, hints: hints || [], text: text };
  }
  function mcCols(p, n) { p.input.columns = n; return p; }
  function andList(a, or) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + (or ? ' or ' : ' and ') + a[a.length - 1]; }
  var NAMES = ['Ana', 'Ben', 'Cole', 'Dana', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivy', 'Jay', 'Kim', 'Liam', 'Mia', 'Nico', 'Omar', 'Pia', 'Raj', 'Sara', 'Theo', 'Uma', 'Vic', 'Zoe'];

  HW.addCodes({
    'u5l2-mult4': 'Used "leave a multiple of 4" in a game with different rules', 'u5l2-left': 'Gave the counters left instead of the number to take', 'u5l2-too-many': 'Took more counters than the rules allow',
    'u5l2-stuck': 'Pile was already a winning number to leave', 'u5l2-last-loses': 'Forgot the last counter loses', 'u5l2-ravi': 'Used Ravi’s rule (multiple of the most you can take)',
    'u5l2-no-minus1': 'Tower: forgot the − 1 (2ⁿ)', 'u5l2-double': 'Tower: doubled without the biggest disc’s move', 'u5l2-add2': 'Tower: added 2 per disc', 'u5l2-secs': 'Gave total seconds instead of leftover seconds',
    'u5l2-dec-min': 'Wrote decimal minutes', 'u5l2-taken': 'Chose a square that is taken', 'u5l2-block-not-win': 'Blocked when a win was there', 'u5l2-not-block': 'Missed the block',
    'u5l2-one-threat': 'A move that makes only one threat', 'u5l2-no-threat': 'A move that makes no threat', 'u5l2-ttt-why': 'Wrong reason in tic-tac-toe', 'u5l2-dots': 'Wrong dots-and-boxes line or box',
    'u5l2-ship': 'Kept a ship position that uses a miss (or is off the grid)', 'u5l2-ship-call': 'Called a square that can’t be part of the ship', 'u5l2-strategy': 'Picked the wrong strategy', 'u5l2-diag': 'A known wrong value',
    'u5l2-why': 'Wrong reason', 'u5l2-last-call': 'Forgot the last call is needed to sink the ship', 'u5l2-pattern': 'Wrong pattern rule'
  });
  HW.addPartial({ 'u5l2-left': 's', 'u5l2-no-minus1': 's', 'u5l2-secs': 's', 'u5l2-dec-min': 's', 'u5l2-double': 'b', 'u5l2-mult4': 'b', 'u5l2-ravi': 'b', 'u5l2-last-loses': 'b', 'u5l2-last-call': 's', 'u5l2-add2': 'n' });

  /* ======================= strategies (Q1) ======================= */
  var STRAT = { simplify: 'simplify the problem', backward: 'work backward', list: 'make a systematic list', pattern: 'look for a pattern', elim: 'eliminate possibilities', model: 'draw or model', guess: 'guess and check' };
  var DESCS = {
    simplify: ['You try 1 disc, then 2 discs, then 3 discs before the 10-disc tower.', 'You play the take-away game with only 5 counters before trying it with 30.', 'Before a 5 by 5 board, you play dots and boxes on a 2 by 2 board.'],
    backward: ['You start from the last move of a game and figure out the move before it.', 'You ask, "What pile do I want to leave my friend at the very end?" and go back from there.', 'You decide who wins with 1, 2, 3 or 4 counters left, then use that for 5, 6, 7, 8.'],
    list: ['You write down every possible first move, one at a time, in an order.', 'You list every place a 3-ship could be: first across, then up and down.', 'You write the 9 squares in order and sort each one into corner, edge or centre.'],
    pattern: ['You notice the answers go 1, 3, 7, 15 and predict the next one.', 'You see the losing piles are 4, 8, 12 and predict that 16 loses too.', 'You see each tower count is double the last plus 1, and use that for 7 discs.'],
    elim: ['You cross out ship positions that use a square you missed.', 'You rule out every line that would give a box its third side.', 'You cross off the tic-tac-toe squares that are already taken or give no threat.'],
    model: ['You use pennies on a table to act out the game.', 'You stack a toonie, a loonie and a quarter to act out the tower puzzle.', 'You sketch the dots-and-boxes board and draw the lines as you play.'],
    guess: ['You try a move, see what happens, and change it next time.', 'You take 2 counters to see what your friend does, then adjust.']
  };
  var STRAT_WHY = { simplify: 'Trying a smaller or easier version first is <b>simplify the problem</b>.', backward: 'Starting at the end and going back one step at a time is <b>work backward</b>.', list: 'Writing every possibility in an order is <b>make a systematic list</b>.',
    pattern: 'Using small cases or a repeat to predict is <b>look for a pattern</b>.', elim: 'Crossing out what cannot work is <b>eliminate possibilities</b>.', model: 'Acting it out with real objects or a sketch is <b>draw or model</b>.', guess: 'Trying, watching, then adjusting is <b>guess and check</b>.' };

  /* ======================= take-away games ======================= */
  /* how many to take from n when you may take 1..k; lose = last counter loses. 0 = stuck (no winning move) */
  function takeFor(n, k, lose) { var m = k + 1, x = lose ? (n - 1) % m : n % m; return x; }
  function leaveWords(k, lose) { return lose ? '1, ' + (k + 2) + ', ' + (2 * k + 3) + ', ' + (3 * k + 4) + ', … (one more than a multiple of ' + (k + 1) + ')' : 'multiples of ' + (k + 1) + ' (' + (k + 1) + ', ' + 2 * (k + 1) + ', ' + 3 * (k + 1) + ', …)'; }
  function nextLeave(n, k, lose) { return n - takeFor(n, k, lose); }
  function takeBad(n, k, lose) {
    var a = takeFor(n, k, lose), out = [[n - a, 'That’s how many counters you <b>leave</b>. How many do you <b>take</b>?', 'u5l2-left']];
    if (k !== 3) out.push([n % 4, 'That leaves a multiple of 4, which is the rule for the 1, 2 or 3 game. In this game you may take 1 to ' + k + (lose ? ' and the last counter loses' : '') + '.', 'u5l2-mult4']);
    if (lose) out.push([n % (k + 1), 'That leaves a multiple of ' + (k + 1) + '. But here the player who takes the last counter <b>loses</b>, so you want to leave one more than that.', 'u5l2-last-loses']);
    else if (k > 1) out.push([n % k, 'That leaves a multiple of ' + k + '. But from ' + k + ' the other player takes them all. Leave multiples of ' + (k + 1) + '.', 'u5l2-ravi']);
    for (var v = k + 1; v <= k + 3; v++) out.push([v, 'You may take only 1 to ' + k + ' counters on a turn.', 'u5l2-too-many']);
    return out;
  }
  function takeSol(n, k, lose) { var a = takeFor(n, k, lose), L = n - a; return steps(['Leave ' + leaveWords(k, lose) + '.', 'The next one below ' + n + ' is ' + L + '.', 'Take ' + t(n + '-' + L + '=' + a) + '.']); }
  function takePart(prompt, n, k, lose, text) {
    return numPart(prompt, takeFor(n, k, lose), takeBad(n, k, lose), takeSol(n, k, lose), ['Work out which numbers you want to leave for the other player.', 'Count down from ' + n + ' to the next one of those numbers.'], text, { after: 'counters' });
  }
  var EX_PILES = [10, 21, 24, 23, 15, 11, 6];
  function pileGrid(r, count, text) {
    var piles = find(function () { var a = []; while (a.length < count) { var n = r.int(9, 41); if (a.indexOf(n) < 0 && EX_PILES.indexOf(n) < 0) a.push(n); } return a; }, function (a) { var st = a.filter(function (n) { return n % 4 === 0; }).length, ms = {}; a.forEach(function (n) { ms[n % 4] = 1; }); return st >= 1 && st <= 2 && Object.keys(ms).length >= 3; }, [9, 18, 19, 30, 28].slice(0, count));
    var cols = [{ id: '1', html: 'Take 1' }, { id: '2', html: 'Take 2' }, { id: '3', html: 'Take 3' }, { id: 'stuck', html: 'Stuck' }], want = {}, rows = [];
    piles.forEach(function (n) { var a = n % 4; want['p' + n] = a ? String(a) : 'stuck'; rows.push({ id: 'p' + n, html: n + ' counters', label: n + ' counters' }); });
    return P.grid('In the take-away game (take 1, 2 or 3; last counter wins), how many should you take from each pile to leave a multiple of 4? If you cannot, choose "Stuck".', rows, cols, want, { rowHead: 'On your turn', why: function (row, got, w) {
      var n = Number(row.slice(1));
      if (w === 'stuck') return { code: 'u5l2-stuck', hint: n + ' is already a multiple of 4, so whatever you take, the other player can leave a multiple of 4. You’re stuck.' };
      if (got === 'stuck') return { code: 'u5l2-stuck', hint: n + ' is not a multiple of 4, so you can leave one. Count down from ' + n + ' to the next multiple of 4.' };
      if (Number(got) === 4 - Number(w)) return { code: 'u5l2-left', hint: 'With ' + n + ': taking ' + got + ' leaves ' + (n - Number(got)) + '. Is that a multiple of 4? Count <b>down</b> to the next multiple of 4.' };
      return { code: 'u5l2-diag', hint: 'Check ' + n + ' again: what is the next multiple of 4 below it?' };
    } }, steps(piles.map(function (n) { var a = n % 4; return n + ': ' + (a ? 'take ' + a + ' (leave ' + (n - a) + ')' : 'stuck (' + n + ' is already a multiple of 4)'); })), ['The multiples of 4 are 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, …', 'Take enough to land on the next multiple of 4 below the pile.'], text);
  }
  function wlGrid(prompt, k, lose, from, to, text) {
    var rows = [], want = {}, sol = [];
    for (var n = from; n <= to; n++) { var w = takeFor(n, k, lose) ? 'W' : 'L'; rows.push({ id: 'n' + n, html: String(n), label: n + ' counters' }); want['n' + n] = w; }
    for (n = from; n <= to; n++) sol.push(n + ': ' + (takeFor(n, k, lose) ? 'W (take ' + takeFor(n, k, lose) + ', leave ' + (n - takeFor(n, k, lose)) + ')' : 'L (' + (lose && n === 1 ? 'you must take the last counter' : 'every move leaves a W number for the other player') + ')'));
    return P.grid(prompt, rows, [{ id: 'W', html: 'Win (W)' }, { id: 'L', html: 'Lose (L)' }], want, { rowHead: 'Counters on your turn', why: function (row, got, w) {
      var m = Number(row.slice(1));
      if (w === 'L') return { code: 'u5l2-diag', hint: 'With ' + m + ' on your turn, try every move (take 1' + (k > 1 ? ' to ' + k : '') + '). Does each one leave the other player a number they can win from?' };
      return { code: 'u5l2-diag', hint: 'With ' + m + ' on your turn, is there a move that leaves the other player an <b>L</b> number' + (lose ? '' : ' (or takes the last counter)') + '?' };
    } }, steps(sol), [lose ? 'With 1 counter on your turn you must take it, so you lose. Work up from there.' : 'With 1 to ' + k + ' counters you take them all and win. With ' + (k + 1) + ' you lose. Work up from there.', 'A number is W if some move leaves the other player an L number.'], text);
  }
  function leaveMC(r, k, lose, text) {
    var right = leaveWords(k, lose), opts = [{ html: cap(right), right: true }];
    if (lose) opts.push({ html: 'Multiples of ' + (k + 1) + ' (' + (k + 1) + ', ' + 2 * (k + 1) + ', …)', why: 'That works when the last counter <b>wins</b>. Here the last counter loses, so you want the other player stuck with 1 at the end.', code: 'u5l2-last-loses' });
    else opts.push({ html: 'Multiples of ' + k + ' (' + k + ', ' + 2 * k + ', …)', why: 'From ' + k + ' the other player takes them all and wins. Leave a number they can’t finish.', code: 'u5l2-ravi' });
    if (k !== 3) opts.push({ html: 'Multiples of 4 (4, 8, 12, …)', why: 'That’s the rule for the 1, 2 or 3 game. Change the rule when the game changes.', code: 'u5l2-mult4' });
    var oddW = 1; while (!takeFor(oddW, k, lose)) oddW += 2;
    opts.push({ html: 'Odd numbers (1, 3, 5, …)', why: 'Test it with a small pile: if you leave ' + oddW + ', the other player can take ' + takeFor(oddW, k, lose) + ' and win from there.', code: 'u5l2-diag' });
    if (opts.length < 4) opts.push({ html: 'Multiples of ' + (k + 2), why: 'Test it with a small pile: from ' + (k + 2) + ' the other player can leave you ' + (k + 1) + '.', code: 'u5l2-diag' });
    return P.mc(r, 'Which numbers should you leave for the other player?', opts.slice(0, 4),
      lose ? 'With 1 counter on your turn you must take it and lose, so leave 1. From 2 to ' + (k + 1) + ' you can leave 1; from ' + (k + 2) + ' you can’t. So leave ' + right + '.' : 'With ' + (k + 1) + ' on your turn, you leave 1 to ' + k + ' and the other player takes them all. So leave ' + right + '.', ['Work backward from the end of the game.'], text);
  }

  /* ======================= tower puzzle ======================= */
  function tw(n) { return Math.pow(2, n) - 1; }
  function towerSVG(n) {
    var s = 1, W = 300, H = 30 + n * 12, out = svgOpen(-10, -6, W + 20, H + 26, 'a tower puzzle with ' + n + ' discs on peg A', 260);
    out += '<rect x="-6" y="' + H + '" width="' + (W + 12) + '" height="5" fill="#c9ccd3"/>';
    [50, 150, 250].forEach(function (x, i) { out += '<rect x="' + (x - 2) + '" y="6" width="4" height="' + (H - 6) + '" fill="#8f96a3"/>' + txt(x, H + 14, 'ABC'.charAt(i), { size: 12 }); });
    for (var k = 0; k < n; k++) { var w = 88 - k * (60 / Math.max(1, n - 1)); out += '<rect x="' + f1(50 - w / 2) + '" y="' + (H - (k + 1) * 12) + '" width="' + f1(w) + '" height="11" rx="2" fill="#e8ebf1" stroke="' + INK + '" stroke-width="1"/>'; }
    return out + '</svg>';
  }
  function minSecFields(prompt, total, sol, text, perMove, n) {
    var m = Math.floor(total / 60), s = total % 60, forgot = perMove * Math.pow(2, n);
    return fieldsPart(prompt, [
      { label: 'Minutes:', name: 'Minutes', ans: m, after: 'min', bad: [[Math.round(total / 60 * 100) / 100, 'Give the whole minutes here and the seconds left over in the other box.', 'u5l2-dec-min'], [total, 'That’s the total in seconds. Divide by 60 to get the minutes.', 'u5l2-secs']] },
      { label: 'Seconds:', name: 'Seconds', ans: s, after: 's', bad: [[total, 'That’s all the seconds. Give only the seconds left over after the whole minutes.', 'u5l2-secs'], [forgot % 60, 'Check the number of moves: it is ' + t('2^{' + n + '}-1') + ', not ' + t('2^{' + n + '}') + '.', 'u5l2-no-minus1'], [Math.round((total / 60 - m) * 100), 'The decimal part of the minutes is not the seconds. Multiply it by 60 (or work out ' + total + ' − ' + m + ' × 60).', 'u5l2-dec-min']] }],
      sol, ['Fewest moves = ' + t('2^n-1') + '.', 'Seconds ÷ 60: the whole number is the minutes, the remainder is the seconds.'], text);
  }

  /* ======================= tic-tac-toe ======================= */
  var LINES = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  function winner(b) { for (var i = 0; i < 8; i++) { var l = LINES[i]; if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return b[l[0]]; } return null; }
  function threats(b, p) { var out = []; LINES.forEach(function (l) { var mine = l.filter(function (s) { return b[s] === p; }).length, empty = l.filter(function (s) { return !b[s]; }); if (mine === 2 && empty.length === 1 && out.indexOf(empty[0]) < 0) out.push(empty[0]); }); return out.sort(); }
  function forks(b, p) { var out = []; for (var s = 1; s <= 9; s++) { if (b[s]) continue; b[s] = p; if (threats(b, p).length >= 2) out.push(s); delete b[s]; } return out; }
  function lineOf(b, p, s) { for (var i = 0; i < 8; i++) { var l = LINES[i]; if (l.indexOf(s) >= 0 && l.filter(function (x) { return x !== s && b[x] === p; }).length === 2) return l.join('-'); } return ''; }
  function other(p) { return p === 'X' ? 'O' : 'X'; }
  function bKey(b) { var s = ''; for (var i = 1; i <= 9; i++) s += b[i] || '.'; return s; }
  function mkBoard(xs, os) { var b = {}; xs.forEach(function (s) { b[s] = 'X'; }); os.forEach(function (s) { b[s] = 'O'; }); return b; }
  var EX_BOARDS = [mkBoard([4, 5], [1, 9]), mkBoard([1, 3], [5]), mkBoard([1, 9], [3, 5]), mkBoard([5, 1], [2]), mkBoard([5, 1, 7], [2, 9])].map(bKey);
  function tttSVG(b, o) {
    o = o || {}; var s = o.s || 40, W = 3 * s, h = svgOpen(-3, -3, W + 6, W + 6, 'a tic-tac-toe board', o.maxW || 150);
    h += '<path d="M' + s + ' 0V' + W + 'M' + 2 * s + ' 0V' + W + 'M0 ' + s + 'H' + W + 'M0 ' + 2 * s + 'H' + W + '" stroke="' + INK + '" stroke-width="2"/>';
    for (var q = 1; q <= 9; q++) {
      var cx = ((q - 1) % 3 + 0.5) * s, cy = (Math.floor((q - 1) / 3) + 0.5) * s, p = b[q], col = o.hi === q ? ANS : INK;
      if (o.hi === q && !p) p = o.hiMark;
      if (o.big) h += !p ? txt(cx, cy, q, { size: s * 0.42, color: '#5f6675' }) : '';
      else h += txt(cx - s * 0.36, cy - s * 0.34, q, { size: s * 0.2, color: '#9aa0ab', weight: 600 });
      if (p === 'X') h += '<path d="M' + f1(cx - s * 0.24) + ' ' + f1(cy - s * 0.24) + 'L' + f1(cx + s * 0.24) + ' ' + f1(cy + s * 0.24) + 'M' + f1(cx - s * 0.24) + ' ' + f1(cy + s * 0.24) + 'L' + f1(cx + s * 0.24) + ' ' + f1(cy - s * 0.24) + '" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>';
      if (p === 'O') h += '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(s * 0.26) + '" fill="none" stroke="' + col + '" stroke-width="3"/>';
    }
    return h + '</svg>';
  }
  function randomBoard(r, mover) {
    var b = {}, n = mover === 'X' ? r.pick([2, 4, 4, 6]) : r.pick([1, 3, 3, 5]), p = 'X';
    for (var i = 0; i < n; i++) { var empty = []; for (var s = 1; s <= 9; s++) if (!b[s]) empty.push(s); b[r.pick(empty)] = p; if (winner(b)) return null; p = other(p); }
    return b;
  }
  /* kind: 'win' | 'block' | 'fork'; a position with exactly one right move by the checklist */
  function tttPos(r, kind, mover) {
    return find(function () { return randomBoard(r, mover); }, function (b) {
      if (!b || EX_BOARDS.indexOf(bKey(b)) >= 0) return false;
      var w = threats(b, mover), bl = threats(b, other(mover));
      if (kind === 'win') return w.length === 1;
      if (kind === 'block') return w.length === 0 && bl.length === 1;
      return w.length === 0 && bl.length === 0 && forks(b, mover).length === 1;
    }, null) || (kind === 'win' ? mkBoard([7, 8], [2, 5]) : kind === 'block' ? mkBoard([2, 5], [1]) : mkBoard([1, 8], [2, 5]));
  }
  function squareChk(b, ans, diag) {
    return function (resp) {
      var p = HW.parse.number(String(resp == null ? '' : resp).replace(/^\s*(square|sq\.?)\s*/i, ''));
      if (!p.ok) return form(p.code === 'empty' ? 'empty' : 'notnumber', p.code === 'empty' ? 'Type the number of the square.' : 'Type just the square number, 1 to 9.');
      var v = p.value; if (!(v >= 1 && v <= 9 && v === Math.round(v))) return form('u5l2-range', 'The squares are numbered 1 to 9.');
      if (v === ans) return ok();
      if (b[v]) return form('u5l2-taken', 'Square ' + v + ' is already taken. Choose an empty square.');
      var h = diag(v); return h ? wrong(h.code, h.hint) : wrong('value', null);
    };
  }
  function tttPart(r, kind, mover, text) {
    var b = tttPos(r, kind, mover), opp = other(mover), w = threats(b, mover), bl = threats(b, opp), ans = kind === 'win' ? w[0] : kind === 'block' ? bl[0] : forks(b, mover)[0];
    var diag = function (v) {
      if (kind === 'win' && bl.indexOf(v) >= 0) return { code: 'u5l2-block-not-win', hint: 'Blocking is step 2. Check step 1 first: can ' + mover + ' win right now?' };
      if (kind === 'win') return { code: 'u5l2-diag', hint: 'Look for two ' + mover + 's in a line with the third square empty.' };
      if (kind === 'block') return { code: 'u5l2-not-block', hint: mover + ' can’t win yet, but ' + opp + ' has two in a row. Where must ' + mover + ' go to stop ' + opp + '?' };
      b[v] = mover; var n = threats(b, mover).length; delete b[v];
      return { code: n ? 'u5l2-one-threat' : 'u5l2-no-threat', hint: n ? 'Square ' + v + ' makes only one threat, so ' + opp + ' can block it. Find a square that makes <b>two</b> threats at once.' : 'Square ' + v + ' makes no threat. Find a square that makes two threats at once (a fork).' };
    };
    var b2 = {}; Object.keys(b).forEach(function (k) { b2[k] = b[k]; }); b2[ans] = mover;
    var why = kind === 'win' ? mover + ' has two in the line ' + lineOf(b, mover, ans) + ', so square ' + ans + ' makes three in a row. ' + mover + ' wins (step 1).'
      : kind === 'block' ? mover + ' can’t win yet. ' + opp + ' has two in the line ' + lineOf(b, opp, ans) + ', so ' + mover + ' must block at ' + ans + ' (step 2).'
      : 'Nobody can win and there is nothing to block. Square ' + ans + ' is a fork: ' + mover + ' then threatens ' + andList(threats(b2, mover)) + '. ' + opp + ' can block only one (step 3).';
    var p = { prompt: '<b>' + mover + '</b> to play. Use the checklist (win, block, fork, centre). Where should ' + mover + ' play? Type the square number.<br>' + tttSVG(b, { s: 56, maxW: 200 }), input: { type: 'number', before: 'Square' }, check: squareChk(b, ans, diag), key: String(ans), answer: 'Square ' + t(ans),
      solution: tttSVG(b, { s: 34, maxW: 120, hi: ans, hiMark: mover }) + '<br>Square ' + ans + '. ' + why, hints: ['Check every empty square in order: 1. Win? 2. Block? 3. Fork?'], text: text };
    p.bad = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (q) { return q !== ans && !b[q]; }).map(String);
    return p;
  }
  /* games: [moves], X first; symmetries of the board */
  var SYM = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 6, 9, 2, 5, 8, 1, 4, 7], [9, 8, 7, 6, 5, 4, 3, 2, 1], [7, 4, 1, 8, 5, 2, 9, 6, 3], [3, 2, 1, 6, 5, 4, 9, 8, 7], [7, 8, 9, 4, 5, 6, 1, 2, 3], [1, 4, 7, 2, 5, 8, 3, 6, 9], [9, 6, 3, 8, 5, 2, 7, 4, 1]];
  function symGame(r, bases) { var g = r.pick(bases), m = r.pick(SYM); return g.map(function (s) { return m[s - 1]; }); }
  function gameBoard(g) { var b = {}; g.forEach(function (s, i) { b[s] = i % 2 ? 'O' : 'X'; }); return b; }
  function threatPart(prompt, b, p, text, sol) {
    var th = threats(b, p), ck = function (resp) {
      resp = resp || []; var v = resp.map(function (x) { var q = HW.parse.number(String(x || '')); return q.ok ? q.value : null; });
      if (v.some(function (x) { return x == null; })) return form('empty', 'Type a square number in each box.');
      if (v[0] === v[1]) return form('u5l2-same', 'Give two different squares.');
      var okc = v.filter(function (x) { return th.indexOf(x) >= 0; }).length;
      if (okc === 2) return ok();
      var bad = v.filter(function (x) { return th.indexOf(x) < 0; })[0];
      if (b[bad]) return wrong('u5l2-taken', 'Square ' + bad + ' is already taken. A threat is an <b>empty</b> square that would make three in a row.');
      return wrong('u5l2-diag', 'Square ' + bad + ' isn’t a threat: ' + p + ' doesn’t have two in a line with it. ' + (okc ? 'One of your squares is right.' : '') + ' Check every line through ' + p + '’s last move.');
    };
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Square', name: 'First square' }, { label: 'and square', name: 'Second square' }] }, check: ck, key: th.map(String), answer: 'Squares ' + t(th[0]) + ' and ' + t(th[1]),
      solution: sol, hints: ['A threat: two of ' + p + '’s marks in a line, and the third square empty.'], text: text, bad: [[String(th[0]), String(th[0])]] };
  }

  /* ======================= dots and boxes ======================= */
  var BOXN = { '0,2': 'A', '1,2': 'B', '2,2': 'C', '0,1': 'D', '1,1': 'E', '2,1': 'F', '0,0': 'G', '1,0': 'H', '2,0': 'I' };
  var ALL_LINES = []; (function () { for (var j = 0; j <= 3; j++) for (var i = 0; i < 3; i++) ALL_LINES.push('h' + i + j); for (var i2 = 0; i2 <= 3; i2++) for (var j2 = 0; j2 < 3; j2++) ALL_LINES.push('v' + i2 + j2); })();
  function sidesOf(a, b) { return ['h' + a + b, 'h' + a + (b + 1), 'v' + a + b, 'v' + (a + 1) + b]; }
  function boxes() { var out = []; for (var b = 2; b >= 0; b--) for (var a = 0; a < 3; a++) out.push([a, b]); return out; }
  function count(set, a, b) { return sidesOf(a, b).filter(function (l) { return set[l]; }).length; }
  function boxesOfLine(l) { var i = Number(l.charAt(1)), j = Number(l.charAt(2)), out = []; if (l.charAt(0) === 'h') { if (j > 0) out.push([i, j - 1]); if (j < 3) out.push([i, j]); } else { if (i > 0) out.push([i - 1, j]); if (i < 3) out.push([i, j]); } return out; }
  function givesAway(set, l) { set[l] = 1; var n = boxesOfLine(l).filter(function (bx) { return count(set, bx[0], bx[1]) === 3; }).length; delete set[l]; return n; }
  function sideName(l, a, b) { var t0 = l.charAt(0), i = Number(l.charAt(1)), j = Number(l.charAt(2)); if (t0 === 'h') return j === b ? 'bottom' : 'top'; return i === a ? 'left' : 'right'; }
  function dotsSVG(set, dashed, o) {
    o = o || {}; var s = o.s || 62, X = function (i) { return i * s; }, Y = function (j) { return (3 - j) * s; }, h = svgOpen(-24, -22, 3 * s + 48, 3 * s + 46, 'a dots-and-boxes game', o.maxW || 300);
    (o.taken || []).forEach(function (bx) { h += '<rect x="' + (X(bx[0]) + 3) + '" y="' + (Y(bx[1] + 1) + 3) + '" width="' + (s - 6) + '" height="' + (s - 6) + '" fill="#fbe3e1"/>' + txt(X(bx[0] + 0.5), Y(bx[1] + 0.5) + s * 0.34, 'Me', { size: s * 0.17, color: ANS }); });
    Object.keys(BOXN).forEach(function (k) { var a = Number(k.charAt(0)), b = Number(k.charAt(2)); h += txt(X(a + 0.5), Y(b + 0.5), BOXN[k], { size: s * 0.3, color: '#aab0ba', weight: 600 }); });
    var seg = function (l) { var i = Number(l.charAt(1)), j = Number(l.charAt(2)); return l.charAt(0) === 'h' ? [X(i), Y(j), X(i + 1), Y(j)] : [X(i), Y(j), X(i), Y(j + 1)]; };
    Object.keys(set).forEach(function (l) { if (!set[l]) return; var g = seg(l); h += '<line x1="' + g[0] + '" y1="' + g[1] + '" x2="' + g[2] + '" y2="' + g[3] + '" stroke="' + (o.hiLines && o.hiLines.indexOf(l) >= 0 ? ANS : INK) + '" stroke-width="3.2" stroke-linecap="round"/>'; });
    Object.keys(dashed || {}).forEach(function (lab) { var l = dashed[lab], g = seg(l), hz = l.charAt(0) === 'h';
      h += '<line x1="' + g[0] + '" y1="' + g[1] + '" x2="' + g[2] + '" y2="' + g[3] + '" stroke="#6b7280" stroke-width="2" stroke-dasharray="5 4"/>';
      var onTop = hz && Number(l.charAt(2)) === 3, onLeft = !hz && Number(l.charAt(1)) === 0;
      h += txt(hz ? (g[0] + g[2]) / 2 + s * 0.22 : g[0] + (onLeft ? -12 : 11), hz ? g[1] + (onTop || Number(l.charAt(2)) > 0 ? -11 : 13) : g[1] + (g[3] - g[1]) * 0.25, lab, { size: 16, italic: true, color: '#3b4250' }); });
    for (var i = 0; i <= 3; i++) for (var j = 0; j <= 3; j++) h += '<circle cx="' + X(i) + '" cy="' + Y(j) + '" r="4" fill="' + INK + '"/>';
    return h + '</svg>';
  }
  function randomLines(r, n) { var set = {}; r.sample(ALL_LINES, n).forEach(function (l) { set[l] = 1; }); return set; }
  function threeSided(set) { return boxes().filter(function (bx) { return count(set, bx[0], bx[1]) === 3; }); }
  function missingSide(set, bx) { return sidesOf(bx[0], bx[1]).filter(function (l) { return !set[l]; })[0]; }
  /* Q8: one 3-sided box; after taking it, three dashed lines: one safe, two that give boxes away */
  function dotsPos1(r) {
    return find(function () {
      var set = randomLines(r, r.int(7, 10)), th = threeSided(set);
      if (th.length !== 1 || boxes().some(function (bx) { return count(set, bx[0], bx[1]) === 4; })) return null;
      var bx = th[0], m = missingSide(set, bx), after = {}; Object.keys(set).forEach(function (k) { after[k] = 1; }); after[m] = 1;
      if (threeSided(after).length || boxes().filter(function (b2) { return count(after, b2[0], b2[1]) === 4; }).length !== 1) return null;
      var free = ALL_LINES.filter(function (l) { return !after[l]; }), safe = free.filter(function (l) { return givesAway(after, l) === 0; }), one = free.filter(function (l) { return givesAway(after, l) === 1; }), two = free.filter(function (l) { return givesAway(after, l) === 2; });
      if (!safe.length || !one.length || one.length + two.length < 2) return null;
      var unsafe = two.length ? [r.pick(one), r.pick(two)] : r.sample(one, 2);
      return { set: set, bx: bx, m: m, after: after, safe: r.pick(safe), unsafe: unsafe };
    }, function (x) { return !!x; }, null);
  }
  /* Extra 5: two 3-sided boxes; after taking both, a safe line and an unsafe one */
  function dotsPos2(r) {
    return find(function () {
      var set = randomLines(r, r.int(8, 11)), th = threeSided(set);
      if (th.length !== 2 || boxes().some(function (bx) { return count(set, bx[0], bx[1]) === 4; })) return null;
      var ms = th.map(function (bx) { return missingSide(set, bx); }); if (ms[0] === ms[1]) return null;
      var after = {}; Object.keys(set).forEach(function (k) { after[k] = 1; }); ms.forEach(function (m) { after[m] = 1; });
      if (threeSided(after).length || boxes().filter(function (b2) { return count(after, b2[0], b2[1]) === 4; }).length !== 2) return null;
      var two = boxes().filter(function (bx) { return count(set, bx[0], bx[1]) === 2; }); if (two.length < 2 || two.length > 4) return null;
      var free = ALL_LINES.filter(function (l) { return !after[l]; }), safe = free.filter(function (l) { return givesAway(after, l) === 0; }), uns = free.filter(function (l) { return givesAway(after, l) > 0; });
      if (!safe.length || !uns.length) return null;
      return { set: set, th: th, ms: ms, after: after, safe: r.pick(safe), unsafe: r.pick(uns), two: two };
    }, function (x) { return !!x; }, null);
  }
  function setOf(list) { var o = {}; list.forEach(function (l) { o[l] = 1; }); return o; }
  function DOTS1_BOOK() { var set = setOf(['h00', 'h01', 'h13', 'h20', 'v00', 'v22', 'v31', 'v01']), after = setOf(['h00', 'h01', 'h13', 'h20', 'v00', 'v22', 'v31', 'v01', 'v10']); return { set: set, bx: [0, 0], m: 'v10', after: after, safe: 'h21', unsafe: ['h12', 'v11'] }; }
  function DOTS2_BOOK() { var set = setOf(['h03', 'h02', 'h20', 'h21', 'h13', 'v02', 'v30', 'v11', 'v21']), after = setOf(['h03', 'h02', 'h20', 'h21', 'h13', 'v02', 'v30', 'v11', 'v21', 'v12', 'v20']); return { set: set, th: [[0, 2], [2, 0]], ms: ['v12', 'v20'], after: after, safe: 'h10', unsafe: 'h12', two: [[0, 1], [1, 1], [2, 1]] }; }
  function bn(bx) { return BOXN[bx[0] + ',' + bx[1]]; }
  function lineWords(l) { var bs = boxesOfLine(l); return bs.length === 2 ? 'the line between ' + bn(bs[0]) + ' and ' + bn(bs[1]) : 'the ' + sideName(l, bs[0][0], bs[0][1]) + ' side of ' + bn(bs[0]); }
  function awayWords(set, l) { set[l] = 1; var bs = boxesOfLine(l).filter(function (bx) { return count(set, bx[0], bx[1]) === 3; }).map(bn); delete set[l]; return bs.length ? 'it is the third side of ' + andList(bs) + ', so it gives away ' + andList(bs) : 'no box gets a third side, so it is safe'; }

  /* ======================= hidden ships ======================= */
  function cn(c, r0) { return 'ABCDEF'.charAt(c - 1) + r0; }
  function seaSVG(n, marks, o) {
    o = o || {}; var s = o.s || 26, W = n * s, h = svgOpen(-22, -4, W + 28, W + 26, 'a hidden-ships grid', o.maxW || 230), cols = 'ABCDEFGHIJKL';
    if (o.checker) for (var x = 0; x < n; x++) for (var y = 0; y < n; y++) if ((x + y) % 2 === 0) h += '<rect x="' + x * s + '" y="' + (n - 1 - y) * s + '" width="' + s + '" height="' + s + '" fill="#cfd5df"/>';
    (marks.ship || []).forEach(function (q) { h += '<rect x="' + ((q[0] - 1) * s + 2) + '" y="' + ((n - q[1]) * s + 2) + '" width="' + (s - 4) + '" height="' + (s - 4) + '" rx="4" fill="none" stroke="' + ANS + '" stroke-width="2.4"/>'; });
    var d = ''; for (var i = 0; i <= n; i++) d += 'M' + i * s + ' 0V' + W + 'M0 ' + i * s + 'H' + W;
    h += '<path d="' + d + '" stroke="#7d8492" stroke-width="0.9" fill="none"/>';
    for (i = 0; i < n; i++) { h += txt((i + 0.5) * s, W + 11, cols.charAt(i), { size: 11 }) + txt(-11, (n - 1 - i + 0.5) * s, String(i + 1), { size: 11 }); }
    (marks.hit || []).forEach(function (q) { var x0 = (q[0] - 1) * s, y0 = (n - q[1]) * s; h += '<rect x="' + x0 + '" y="' + y0 + '" width="' + s + '" height="' + s + '" fill="#b9bfca"/><path d="M' + (x0 + s * 0.22) + ' ' + (y0 + s * 0.22) + 'L' + (x0 + s * 0.78) + ' ' + (y0 + s * 0.78) + 'M' + (x0 + s * 0.22) + ' ' + (y0 + s * 0.78) + 'L' + (x0 + s * 0.78) + ' ' + (y0 + s * 0.22) + '" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>'; });
    (marks.miss || []).forEach(function (q) { h += '<circle cx="' + ((q[0] - 0.5) * s) + '" cy="' + ((n - q[1] + 0.5) * s) + '" r="' + s * 0.17 + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>'; });
    return h + '<path d="' + 'M0 0H' + W + 'V' + W + 'H0Z' + '" stroke="' + INK + '" stroke-width="1.4" fill="none"/></svg>';
  }
  var SEA_KEY = '<span style="font-size:0.9em">✕ on grey = hit, ○ = miss.</span>';
  function posName(p) { return cn(p[0][0], p[0][1]) + '–' + cn(p[p.length - 1][0], p[p.length - 1][1]); }
  function inGrid(q, n) { return q[0] >= 1 && q[1] >= 1 && q[0] <= (n || 6) && q[1] <= (n || 6); }
  function hasQ(list, q) { return list.some(function (x) { return x[0] === q[0] && x[1] === q[1]; }); }
  function positionsThrough(qs, L, dir) { // every L-long position in direction dir ([1,0] across, [0,1] up) that covers all of qs
    var out = [], base = qs[0];
    for (var k = -(L - 1); k <= 0; k++) { var p = []; for (var i = 0; i < L; i++) p.push([base[0] + (k + i) * dir[0], base[1] + (k + i) * dir[1]]); if (qs.every(function (q) { return hasQ(p, q); })) out.push(p); }
    return out;
  }

  /* ======================= the lesson ======================= */
  var S7 = ['simplify', 'backward', 'list', 'pattern', 'elim', 'model', 'guess'];
  function stratParts(wants, prefix) {
    return wants.map(function (w, i) { return { id: prefix + String.fromCharCode(97 + i), level: 'BEG', make: function (r) {
      var others = r.sample(S7.filter(function (s) { return s !== w; }), 3), d = r.pick(DESCS[w]);
      return mcCols(P.mc(r, '<i>' + d + '</i><br>Which strategy is this?', [{ html: cap(STRAT[w]), right: true }].concat(others.map(function (s) { return { html: cap(STRAT[s]), why: STRAT_WHY[s] + ' Is that what this description does?', code: 'u5l2-strategy' }; })),
        STRAT_WHY[w], ['Ask what the person is really doing: a smaller version, going back from the end, listing everything, predicting, crossing out, acting it out, or trying and adjusting?'], 'strategy ' + w), 2); } }; });
  }
  HW.defineLesson({
    id: 'u5l2', unit: 5, num: '2', title: 'Spatial Games and Strategies', outcome: 'G1',
    blurb: 'Take-away games, tic-tac-toe, dots and boxes, the tower puzzle and a hidden-ships game: finding, explaining and fixing winning strategies.',
    questions: [
      { num: '1', stem: 'Match each description to a strategy from the toolbox.', parts: stratParts(['simplify', 'backward', 'list', 'pattern', 'elim', 'model'], '1') },
      { num: '2', stem: '', parts: [{ id: '2', level: 'EMG', make: function (r) { return pileGrid(r, 5, 'piles mult 4'); } }] },
      { num: '3', stem: 'A new take-away game: on your turn you take <b>1 or 2</b> counters. The player who takes the last counter wins.', parts: [
        { id: '3a', level: 'EMG', make: function (r) { var to = r.pick([9, 9, 10, 12]); return wlGrid('(a) Work backward. For each number of counters on your turn, will you win (W) or lose (L) if both players play well?', 2, false, 1, to, 'WL 1-2 to ' + to); } },
        { id: '3b', level: 'EMG', make: function (r) { var p = leaveMC(r, 2, false, 'leave 1-2'); p.prompt = '(b) ' + p.prompt; return p; } },
        { id: '3c', level: 'PRG', make: function (r) { var n = find(function () { return r.int(10, 32); }, function (n) { return n % 3 !== 0 && n % 3 !== n % 4; }, 13); return takePart('(c) The pile has ' + n + ' counters and you go first. How many should you take?', n, 2, false, 'take 1-2 ' + n); } }] },
      { num: '4', stem: function (sh) { return 'In another version, you may take 1 to ' + sh.k + ' counters, and the last counter wins. ' + sh.who + '’s strategy is "leave a multiple of ' + sh.k + '."'; }, shared: function (r) { return { k: r.pick([5, 5, 6, 7]), who: r.pick(['Ravi', 'Tess', 'Omar', 'Jade']) }; }, parts: [
        { id: '4a', level: 'EMG', make: function (r, sh) { var k = sh.k;
          return P.mc(r, '(a) Why does ' + sh.who + '’s strategy fail when ' + (sh.who === 'Jade' || sh.who === 'Tess' ? 'she' : 'he') + ' leaves ' + k + ' counters?', [
            { html: 'The other player can take all ' + k + ' at once and win.', right: true },
            { html: 'The other player must take 1, so ' + sh.who + ' wins.', why: 'The other player may take up to ' + k + '. What happens if they take all ' + k + '?', code: 'u5l2-ravi' },
            { html: 'The other player must leave at least 1 counter for ' + sh.who + '.', why: 'The other player may take up to ' + k + ' at once. With ' + k + ' left, nothing has to be left over.', code: 'u5l2-why' },
            { html: 'It doesn’t fail: leaving ' + k + ' always wins.', why: 'Try it: with ' + k + ' left, the other player takes 1 to ' + k + '. Can they take the last counter?', code: 'u5l2-ravi' }],
            'With ' + k + ' left, the other player may take all ' + k + ' at once and take the last counter.', ['How many may the other player take on a turn?'], 'Ravi fails'); } },
        { id: '4b', level: 'PRG', make: function (r, sh) { var p = leaveMC(r, sh.k, false, 'leave 1-' + sh.k); p.prompt = '(b) What should the strategy be? ' + p.prompt; return p; } },
        { id: '4c', level: 'ADV', make: function (r, sh) { var k = sh.k, n = find(function () { return r.int(k + 4, 45); }, function (n) { return n % (k + 1) && n % (k + 1) !== n % k; }, 20); return takePart('(c) With ' + n + ' counters, how many should ' + sh.who + ' take first?', n, k, false, 'take 1-' + k + ' ' + n); } }] },
      { num: '5', stem: 'Use the tic-tac-toe checklist. Where should the player whose turn it is play?', parts: [
        { id: '5a', level: 'EMG', make: function (r) { return tttPart(r, 'win', 'X', 'ttt win'); } },
        { id: '5b', level: 'EMG', make: function (r) { return tttPart(r, 'block', 'O', 'ttt block'); } },
        { id: '5c', level: 'PRG', make: function (r) { return tttPart(r, 'fork', 'X', 'ttt fork'); } }] },
      { num: '6', stem: 'For the first move in tic-tac-toe there are 9 squares, but some are really the same move. If you turn the board a quarter turn, corner 1 becomes another corner.<br>' + tttSVG({}, { s: 40, big: true, maxW: 140 }), parts: [
        { id: '6a', level: 'BEG', make: function (r) { var sq = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6), want = {}, rows = sq.map(function (q) { want['q' + q] = [1, 3, 7, 9].indexOf(q) >= 0 ? 'corner' : q === 5 ? 'centre' : 'edge'; return { id: 'q' + q, html: 'Square ' + q, label: 'Square ' + q }; });
          return P.grid('(a) Sort the squares into groups of moves that are really the same.', rows, [{ id: 'corner', html: 'Corner' }, { id: 'edge', html: 'Edge (middle of a side)' }, { id: 'centre', html: 'Centre' }], want, { why: function (row, got, w) { return { code: 'u5l2-diag', hint: 'Find ' + row.replace('q', 'square ') + ' on the board. Is it in a corner, in the middle of a side, or in the middle of the board?' }; } },
            'Corners: 1, 3, 7, 9. &nbsp; Edges: 2, 4, 6, 8. &nbsp; Centre: 5.<br>Turning the board moves a corner to a corner and an edge to an edge.', ['Turn the board in your head: where can square 1 go? Where can square 2 go?'], 'corner edge centre'); } },
        { id: '6b', level: 'EMG', make: function (r) {
          return P.mc(r, '(b) How many really different first moves are there, and which strategy helps you see it?', [
            { html: '3 (a corner, an edge or the centre): a systematic list, then eliminating moves that are copies of each other. You study 3 first moves instead of 9.', right: true },
            { html: '9: a systematic list of every square, and every square is different.', why: 'A quarter turn turns corner 1 into corner 3. Those two first moves are really the same.', code: 'u5l2-diag' },
            { html: '4: there are 4 corners, so 4 different moves.', why: 'The 4 corners are all the same move (turn the board). Count the kinds of square.', code: 'u5l2-diag' },
            { html: '3: guess and check, by playing 3 games.', why: 'Playing 3 games doesn’t prove anything. Sorting all 9 squares (a systematic list) does.', code: 'u5l2-strategy' }],
            'Corners (1, 3, 7, 9), edges (2, 4, 6, 8), centre (5): only 3 different first moves.<br>A systematic list, and eliminating copies, means you study 3 moves instead of 9.', ['Use your groups from (a).'], 'first moves'); } }] },
      { num: '7', stem: function (sh) { var g = sh.g; return 'Here is a game between ' + sh.x + ' (X) and ' + sh.o + ' (O): X plays ' + g[0] + ', O plays ' + g[1] + ', X plays ' + g[2] + ', O plays ' + g[3] + ', X plays ' + g[4] + '. ' + sh.x + ' wins on her next turn.<br>' + tttSVG(gameBoard(g), { s: 40, maxW: 150 }); },
        shared: function (r) { var g = find(function () { return symGame(r, [[1, 2, 5, 9, 4], [1, 2, 5, 9, 7]]); }, function (g) { var b = gameBoard(g); return EX_BOARDS.indexOf(bKey(b)) < 0 && threats(b, 'X').length === 2 && !threats(b, 'O').length; }, [1, 2, 5, 9, 4]); return { g: g, x: r.pick(['Ella', 'Rosa', 'Kira', 'Maya']), o: r.pick(['Noor', 'Lena', 'Sky', 'Ines']) }; },
        parts: [
        { id: '7a', level: 'PRG', make: function (r, sh) { var b = gameBoard(sh.g), th = threats(b, 'X');
          return threatPart('(a) Why can’t ' + sh.o + ' stop ' + sh.x + ' now? Give the two squares where X threatens to win.', b, 'X', 'fork threats',
            'X has ' + andList(sh.g.filter(function (s, i) { return i % 2 === 0; }).sort()) + '. X threatens ' + th[0] + ' (' + lineOf(b, 'X', th[0]) + ') and ' + th[1] + ' (' + lineOf(b, 'X', th[1]) + '): a fork. ' + sh.o + ' can block only one.'); } },
        { id: '7b', level: 'PRG', make: function (r, sh) { var g = sh.g;
          return P.mc(r, '(b) ' + sh.o + '’s move at ' + g[3] + ' was a forced block. Which move was her mistake, and where should she have played?', [
            { html: 'Her first move, ' + g[1] + ' (an edge). When X starts in a corner, O should take the centre, 5.', right: true },
            { html: 'Her second move, ' + g[3] + '. She should have played somewhere else.', why: 'At that point X had ' + g[0] + ' and ' + g[2] + ' and threatened ' + g[3] + '. She had to block there.', code: 'u5l2-ttt-why' },
            { html: 'Her first move, ' + g[1] + '. She should have taken the corner across from X, ' + (10 - g[0]) + '.', why: 'With X in a corner, any answer except the centre lets X build a fork. Only the centre is safe.', code: 'u5l2-ttt-why' },
            { html: 'She made no mistake: X always wins when X starts in a corner.', why: 'If O answers a corner with the centre and then always blocks, the game is a tie.', code: 'u5l2-ttt-why' }],
            'Her first move, ' + g[1] + ', an edge. When X starts in a corner, O must take the <b>centre</b> (5). Then O can block every threat and the game is a tie.', ['The block at ' + g[3] + ' was forced, so look earlier.'], 'Noor mistake'); } }] },
      { num: '8', stem: 'It is your turn in dots and boxes. The boxes are named A to I.', shared: function (r) { var d = dotsPos1(r) || DOTS1_BOOK(); var labs = r.shuffle(['p', 'q', 'r']), dashed = {}; [d.safe].concat(d.unsafe).forEach(function (l, i) { dashed[labs[i]] = l; }); d.dashed = dashed; return d; }, parts: [
        { id: '8a', level: 'EMG', make: function (r, sh) { var two = boxes().filter(function (bx) { return count(sh.set, bx[0], bx[1]) === 2; }), others = r.sample(two.length >= 3 ? two : boxes().filter(function (bx) { return bn(bx) !== bn(sh.bx); }), 3);
          var opts = [{ html: 'Box ' + bn(sh.bx), right: true }].concat(others.map(function (bx) { var c = count(sh.set, bx[0], bx[1]); return { html: 'Box ' + bn(bx), why: 'Box ' + bn(bx) + ' has only ' + c + ' side' + (c === 1 ? '' : 's') + '. You can take a box only by drawing its fourth side.', code: 'u5l2-dots' }; }));
          return mcCols(P.mc(r, '(a) Which box can you take right now?<br>' + dotsSVG(sh.set, sh.dashed), opts, 'Box ' + bn(sh.bx) + ' has 3 sides. Draw ' + lineWords(sh.m) + ' (its ' + sideName(sh.m, sh.bx[0], sh.bx[1]) + ' side), take ' + bn(sh.bx) + ', and get another turn.', ['Look for a box with 3 sides drawn.'], 'take box'), 4); } },
        { id: '8b', level: 'PRG', make: function (r, sh) { var want = {}, rows = Object.keys(sh.dashed).sort().map(function (lab) { var n = givesAway(sh.after, sh.dashed[lab]); want[lab] = n === 0 ? 'safe' : n === 1 ? 'one' : 'two'; return { id: lab, html: '<i>' + lab + '</i>', label: 'line ' + lab }; });
          return P.grid('(b) You took box ' + bn(sh.bx) + ' and get another turn. For each dashed line, is it safe, or how many boxes does it give away?<br>' + dotsSVG(sh.after, sh.dashed, { hiLines: [sh.m], taken: [sh.bx] }), rows, [{ id: 'safe', html: 'Safe' }, { id: 'one', html: 'Gives away 1 box' }, { id: 'two', html: 'Gives away 2 boxes' }], want,
            { why: function (row, got, w) { return { code: 'u5l2-dots', hint: 'Line <i>' + row + '</i> touches ' + andList(boxesOfLine(sh.dashed[row]).map(bn)) + '. Count the sides each of those boxes would have with <i>' + row + '</i> drawn: 3 sides means you give it away.' }; } },
            steps(Object.keys(sh.dashed).sort().map(function (lab) { return '<i>' + lab + '</i>: ' + awayWords(sh.after, sh.dashed[lab]) + '.'; }).concat(['Draw the safe line.'])), ['A line is safe if no box ends up with 3 sides.', 'A line between two boxes counts for both of them.'], 'safe lines'); } }] },
      { num: '9', stem: function (sh) { return 'Near the end of a dots-and-boxes game, every line left gives boxes away. Line <i>' + sh.lab[0] + '</i> gives away a group of ' + sh.a + ' box' + (sh.a > 1 ? 'es' : '') + '. Line <i>' + sh.lab[1] + '</i> gives away a row of ' + sh.b + ' boxes (once the first is taken, the next one has 3 sides, and so on).'; },
        shared: function (r) { var a = r.pick([1, 1, 2]), b = r.int(3, 6); return { a: a, b: b, lab: r.chance(0.5) ? ['p', 'q'] : ['q', 'p'] }; }, parts: [
        { id: '9a', level: 'EMG', make: function (r, sh) { return mcCols(P.mc(r, '(a) Which line should you draw?', [{ html: 'Line <i>' + sh.lab[0] + '</i>', right: true }, { html: 'Line <i>' + sh.lab[1] + '</i>', why: 'Line <i>' + sh.lab[1] + '</i> lets the other player take ' + sh.b + ' boxes in a row. Give away the smallest group.', code: 'u5l2-dots' }],
          'Line <i>' + sh.lab[0] + '</i>: it gives away only ' + sh.a + ' box' + (sh.a > 1 ? 'es' : '') + ', not ' + sh.b + '.', ['Give away the smallest group.'], 'end game', true), 2); } },
        { id: '9b', level: 'EMG', make: function (r, sh) { var who = r.pick(['Arun', 'Kofi', 'Wes']);
          return P.mc(r, '(b) ' + who + ' says, "It doesn’t matter which one. Either way I give away boxes." Which correction is right?', [
            { html: 'It matters how many. Line <i>' + sh.lab[1] + '</i> lets the other player take ' + sh.b + ' boxes in a row (an extra turn after each), but line <i>' + sh.lab[0] + '</i> gives away just ' + sh.a + '. Give away the smallest group.', right: true },
            { html: 'He is right: a box given away is a box given away.', why: 'Count the boxes: ' + sh.a + ' or ' + sh.b + '. That difference can decide the game.', code: 'u5l2-why' },
            { html: 'Draw line <i>' + sh.lab[1] + '</i>: the other player takes only one box per turn.', why: 'Taking a box gives another turn, so the other player can take the whole row of ' + sh.b + '.', code: 'u5l2-why' },
            { html: 'Pass your turn instead of drawing a line.', why: 'You must draw a line on your turn. Choose the one that gives away the fewest boxes.', code: 'u5l2-why' }],
            'Giving away ' + sh.a + ' box' + (sh.a > 1 ? 'es' : '') + ' is better than giving away ' + sh.b + '. Each box taken gives an extra turn, so a row of ' + sh.b + ' can all be taken at once.', ['How many boxes does each line give away?'], 'Arun'); } }] },
      { num: '10', stem: 'Answer these about the tower puzzle (3 pegs, A, B and C; move one disc at a time; never put a disc on a smaller one).<br>' + towerSVG(3), parts: [
        { id: '10a', level: 'EMG', make: function (r) {
          var fr = find(function () { return r.sample(['A', 'B', 'C'], 2); }, function (x) { return !(x[0] === 'A' && x[1] === 'C'); }, ['A', 'B']), X = fr[0], Y = fr[1], Z = ['A', 'B', 'C'].filter(function (p) { return p !== X && p !== Y; })[0];
          var mv = function (d, a, b) { return d + ' ' + a + '→' + b; };
          return P.mc(r, '(a) Which list is the fewest moves to take 2 discs from peg <b>' + X + '</b> to peg <b>' + Y + '</b>? (S = small, L = large)', [
            { html: [mv('S', X, Z), mv('L', X, Y), mv('S', Z, Y)].join(', '), right: true },
            { html: [mv('S', X, Y), mv('L', X, Z), mv('S', Y, Z)].join(', '), why: 'That moves the tower to peg ' + Z + ', not peg ' + Y + '.', code: 'u5l2-diag' },
            { html: [mv('S', X, Y), mv('L', X, Y), mv('S', Z, Y)].join(', '), why: 'The second move puts the large disc on top of the small one. That breaks rule 2.', code: 'u5l2-diag' },
            { html: [mv('S', X, Y), mv('S', Y, Z), mv('L', X, Y), mv('S', Z, Y)].join(', '), why: 'That works, but it takes 4 moves. The fewest is 3: move the small disc out of the way first.', code: 'u5l2-diag' }],
            steps([mv('S', X, Z) + ' (out of the way, onto the spare peg)', mv('L', X, Y), mv('S', Z, Y), '3 moves.']), ['Move the small disc onto the spare peg first.'], 'two discs ' + X + Y); } },
        { id: '10b', level: 'PRG', make: function (r) { var n = r.pick([9, 10, 11]), tot = tw(n);
          return minSecFields('(b) A puzzle has ' + n + ' discs. At 1 move per second with no mistakes, how long does it take? Give minutes and seconds.', tot, steps([t('2^{' + n + '}-1=' + Math.pow(2, n) + '-1=' + tot) + ' moves = ' + tot + ' s', t(tot + '\\div 60=' + Math.floor(tot / 60)) + ' remainder ' + tot % 60 + ' (' + t(Math.floor(tot / 60) + '\\times 60=' + Math.floor(tot / 60) * 60) + ')', Math.floor(tot / 60) + ' min ' + tot % 60 + ' s']), 'tower time ' + n, 1, n); } },
        { id: '10c', level: 'PRG', make: function (r) { var k = r.pick([5, 6, 8, 9]), who = r.pick(['Owen', 'Jules', 'Priya']), m = tw(k), ans = tw(k + 1);
          return numPart('(c) ' + who + ' says, "' + k + ' discs take ' + m + ' moves, so ' + (k + 1) + ' discs take ' + t('2\\times ' + m + '=' + 2 * m) + ' moves." Find the error. How many moves do ' + (k + 1) + ' discs really take?', ans,
            [[2 * m, 'That’s what ' + who + ' said. Move the top ' + k + ' off (' + m + '), move the biggest disc (1), move the ' + k + ' back on (' + m + ').', 'u5l2-double'], [Math.pow(2, k + 1), 'Check: the rule is ' + t('2^n-1') + '. Don’t forget the − 1.', 'u5l2-no-minus1'], [m + 2, 'Each disc doesn’t add 2. The count doubles and adds 1.', 'u5l2-add2']],
            steps([who + ' forgot the move of the biggest disc.', 'Move the top ' + k + ' off: ' + m + '; move the biggest disc: 1; move the ' + k + ' back on: ' + m + '.', t(m + '+1+' + m + '=' + ans) + ' moves (' + t('2^{' + (k + 1) + '}-1=' + ans) + ')']), ['Move the smaller discs out of the way, move the biggest disc once, then move the smaller discs back.'], 'Owen ' + k, { after: 'moves' }); } }] },
      { num: '11', stem: function (sh) { return 'In the hidden-ships game (a 6 by 6 grid, columns A to F, rows 1 to 6) you know the other player has a <b>' + sh.L + '-ship</b> (' + sh.L + ' squares in a line). You hit it at ' + cn(sh.h1[0], sh.h1[1]) + ' and ' + cn(sh.h2[0], sh.h2[1]) + '. Your call at ' + cn(sh.miss[0], sh.miss[1]) + ' was a miss.<br>' + seaSVG(6, { hit: [sh.h1, sh.h2], miss: [sh.miss] }) + '<br>' + SEA_KEY; },
        shared: function (r) {
          return find(function () {
            var L = r.pick([3, 4, 4]), vert = r.chance(0.5), dir = vert ? [0, 1] : [1, 0], c = r.int(1, 6), w = r.int(1, 5), h1 = vert ? [c, w] : [w, c], h2 = [h1[0] + dir[0], h1[1] + dir[1]], up = r.chance(0.5);
            var miss = up ? [h2[0] + dir[0], h2[1] + dir[1]] : [h1[0] - dir[0], h1[1] - dir[1]];
            if (!inGrid(miss) || (h1[0] === 4 && h1[1] === 4 && h2[1] === 5)) return null;
            var all = positionsThrough([h1, h2], L, dir), live = all.filter(function (p) { return p.every(function (q) { return inGrid(q); }) && !hasQ(p, miss); });
            return live.length === 1 ? { L: L, dir: dir, vert: vert, h1: h1, h2: h2, miss: miss, all: all, live: live[0] } : null;
          }, function (x) { return !!x; }, { L: 4, dir: [0, 1], vert: true, h1: [3, 3], h2: [3, 4], miss: [3, 5], all: positionsThrough([[3, 3], [3, 4]], 4, [0, 1]), live: [[3, 1], [3, 2], [3, 3], [3, 4]] });
        }, parts: [
        { id: '11a', level: 'EMG', make: function (r, sh) { var col = sh.vert ? 'column ' + 'ABCDEF'.charAt(sh.h1[0] - 1) : 'row ' + sh.h1[1], way = sh.vert ? 'up and down' : 'across', otherWay = sh.vert ? 'across' : 'up and down';
          return P.mc(r, '(a) The two hits are side by side in ' + col + '. Why must the ship run ' + way + '?', [
            { html: 'A ship running ' + otherWay + ' would cover only one square of ' + col + ', but this ship covers both hits.', right: true },
            { html: 'Ships always run ' + way + '.', why: 'Ships can run across or up and down. The two hits decide it here.', code: 'u5l2-why' },
            { html: 'The miss shows the ship runs ' + way + '.', why: 'The miss tells you where the ship <b>isn’t</b>. The direction comes from the two hits side by side.', code: 'u5l2-why' },
            { html: 'It could run diagonally too.', why: 'Ships are never diagonal in this game.', code: 'u5l2-why' }],
            'A ship ' + otherWay + ' covers only one square of ' + col + '. This ship covers both ' + cn(sh.h1[0], sh.h1[1]) + ' and ' + cn(sh.h2[0], sh.h2[1]) + ', so it runs ' + way + '.', ['How many squares of one ' + (sh.vert ? 'column' : 'row') + ' can a ship ' + otherWay + ' cover?'], 'ship direction'); } },
        { id: '11b', level: 'PRG', make: function (r, sh) {
          var dir = sh.dir, list = [];
          for (var k = -sh.L; k <= 1; k++) { var p = []; for (var i = 0; i < sh.L; i++) p.push([sh.h1[0] + (k + i) * dir[0], sh.h1[1] + (k + i) * dir[1]]);
            if (p.some(function (q) { return q[0] < 1 || q[1] < 1 || q[0] > 7 || q[1] > 7; }) || !(hasQ(p, sh.h1) || hasQ(p, sh.h2))) continue; list.push(p); }
          var liveName = posName(sh.live);
          return selectPart('(b) Which ' + (sh.vert ? 'up-and-down' : 'across') + ' positions for the ' + sh.L + '-ship are still possible? Tap every one.', list.map(function (p) { return { value: posName(p), html: posName(p) }; }), [liveName],
            function (extra2) { var nm = extra2[0], p = list.filter(function (x) { return posName(x) === nm; })[0]; if (!p) return { code: 'u5l2-ship', hint: 'Check each position against the hits and the miss.' };
              if (hasQ(p, sh.miss)) return { code: 'u5l2-ship', hint: nm + ' uses ' + cn(sh.miss[0], sh.miss[1]) + ', which was a miss. Eliminate it.' };
              if (!p.every(function (q) { return inGrid(q); })) return { code: 'u5l2-ship', hint: nm + ' runs off the grid (rows and columns go only to 6).' };
              return { code: 'u5l2-ship', hint: nm + ' doesn’t cover both hits. The ship must cover ' + cn(sh.h1[0], sh.h1[1]) + ' and ' + cn(sh.h2[0], sh.h2[1]) + '.' }; },
            liveName, steps(list.map(function (p) { var nm = posName(p); return nm === liveName ? '<b>' + nm + '</b>: possible' : '<s>' + nm + '</s> ' + (hasQ(p, sh.miss) ? '(uses the miss at ' + cn(sh.miss[0], sh.miss[1]) + ')' : !p.every(function (q) { return inGrid(q); }) ? '(off the grid)' : '(misses a hit)'); }).concat(['Only ' + liveName + ' is left.'])), ['List the positions that cover both hits, then cross out any that use the miss.'], 'ship positions'); } },
        { id: '11c', level: 'PRG', make: function (r, sh) { var need = sh.live.filter(function (q) { return !hasQ([sh.h1, sh.h2], q); }), dir = sh.dir;
          var low = sh.live[0], hiEnd = sh.live[sh.live.length - 1], cand = need.slice();
          [sh.miss, [low[0] - dir[0], low[1] - dir[1]], [hiEnd[0] + dir[0], hiEnd[1] + dir[1]], [sh.h1[0] + dir[1], sh.h1[1] + dir[0]], [sh.h2[0] - dir[1], sh.h2[1] - dir[0]]].forEach(function (q) { if (inGrid(q) && !hasQ(cand, q) && !hasQ([sh.h1, sh.h2], q)) cand.push(q); });
          cand = cand.slice(0, 6).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
          var names = need.map(function (q) { return cn(q[0], q[1]); });
          return selectPart('(c) Which squares will sink the ship? Tap every square you still need to call.', cand.map(function (q) { return { value: cn(q[0], q[1]), html: cn(q[0], q[1]) }; }), names,
            function (ex, mi) { if (ex.length) return { code: 'u5l2-ship-call', hint: ex[0] + ' is not part of ' + posName(sh.live) + ', the only position left.' }; return { code: 'u5l2-ship-call', hint: 'The ship is ' + posName(sh.live) + '. Which of its squares haven’t been hit yet?' }; },
            andList(names), 'The ship is ' + posName(sh.live) + '. It is already hit at ' + cn(sh.h1[0], sh.h1[1]) + ' and ' + cn(sh.h2[0], sh.h2[1]) + ', so call ' + andList(names) + '.', ['Use the only position left from (b).'], 'sink squares'); } }] },
      { num: '12', stem: function (sh) { return 'You hunt for ships on a ' + sh.n + ' by ' + sh.n + ' grid using a checkerboard pattern (you call only the shaded squares).'; }, shared: function (r) { return { n: r.pick([8, 10, 12]) }; }, parts: [
        { id: '12a', level: 'EMG', make: function (r, sh) { var n = sh.n; return numPart('(a) How many shaded squares do you need to call (at most) to find every ship?', n * n / 2, [[n * n, 'That’s every square. The checkerboard hunt calls only one colour: half of them.', 'u5l2-diag'], [n * 2, 'Find the total number of squares first (' + n + ' × ' + n + '), then take half.', 'u5l2-diag'], [n, 'Find the total number of squares first (' + n + ' × ' + n + '), then take half.', 'u5l2-diag']],
          'Half of ' + t(n + '\\times ' + n + '=' + n * n) + ' is ' + t(n * n / 2) + '.', ['How many squares are there in all? The hunt calls one colour only.'], 'checker ' + n, { after: 'squares' }); } },
        { id: '12b', level: 'PRG', make: function (r) { return P.mc(r, '(b) Why can a 3-ship never hide only on the white squares?', [
            { html: 'Its squares are side by side, and squares side by side always have different colours. So it always covers at least one shaded square.', right: true },
            { html: 'There are more shaded squares than white squares.', why: 'There are the same number of each colour. The reason is about squares that are side by side.', code: 'u5l2-why' },
            { html: 'A 3-ship is too long to fit on the grid.', why: 'A 3-ship fits easily. Think about the colours of two squares that are side by side.', code: 'u5l2-why' },
            { html: 'It can: a 3-ship could sit on 3 white squares in a row.', why: 'Try it: in a checkerboard, can 3 squares in a row all be white?', code: 'u5l2-why' }],
            'Two squares side by side (across or up and down) always have different colours, so any ship of 2 or more squares covers a shaded square.', ['Look at two squares side by side on a checkerboard.'], 'why checker'); } },
        { id: '12c', level: 'PRG', make: function (r) { return P.mc(r, '(c) <b>Variation:</b> the other player adds a 1-square ship. Does the checkerboard hunt still find it for sure?', [
            { html: 'No. A 1-square ship can sit on a white square, so you might need to call the white squares too.', right: true },
            { html: 'Yes. Every ship covers a shaded square.', why: 'That is only true for ships with 2 or more squares side by side. A 1-square ship has no neighbour.', code: 'u5l2-why' },
            { html: 'Yes, if you call the shaded squares twice.', why: 'Calling the same squares again finds nothing new. Where could a 1-square ship hide?', code: 'u5l2-why' },
            { html: 'No, because 1-square ships are not allowed.', why: 'This variation does allow one. Think about where it could hide.', code: 'u5l2-why' }],
            'No. The hunt works because a longer ship always covers a shaded square. A 1-square ship can sit on a white square and never be hit.', ['Could a 1-square ship sit only on white?'], 'one-square ship'); } }] },
      { num: '13', stem: '<b>Make your own variation.</b> Change one rule of the take-away game (take 1, 2 or 3; last counter wins; leave a multiple of 4).', parts: [
        { id: '13a', level: 'PRG', make: function (r) { var n = r.pick([30, 35, 41, 50]);
          return P.mc(r, '(a) Which change of rule still lets "leave a multiple of 4" win?', [
            { html: 'Start with ' + n + ' counters instead of 21.', right: true },
            { html: 'You may take 1, 2, 3 or 4 counters.', why: 'Now from 4 the other player takes all 4 and wins. You would need multiples of 5.', code: 'u5l2-mult4' },
            { html: 'The player who takes the last counter loses.', why: 'Now you want to leave the other player 1 at the end: leave 1, 5, 9, 13, …', code: 'u5l2-last-loses' },
            { html: 'You may take only 1 or 2 counters.', why: 'Now the winning numbers to leave are multiples of 3.', code: 'u5l2-mult4' }],
            'The size of the pile doesn’t change the strategy: still leave a multiple of 4. Changing how many you may take, or who wins, changes the numbers to leave.', ['Test each change with a small pile.'], 'which variation'); } },
        { id: '13b', level: 'MAS', make: function (r) {
          var v = find(function () { var lose = r.chance(0.45), k = lose ? r.pick([4, 5, 6]) : r.pick([6, 7, 8, 9]), n = r.int(20, 50); return { lose: lose, k: k, n: n }; }, function (v) { return takeFor(v.n, v.k, v.lose) && !(v.k === 7 && v.n === 30 && !v.lose) && takeFor(v.n, v.k, v.lose) !== v.n % 4; }, { lose: false, k: 7, n: 35 });
          var who = r.pick(NAMES);
          return takePart('(b) ' + who + '’s variation: you may take <b>1 to ' + v.k + '</b> counters, and the player who takes the last counter <b>' + (v.lose ? 'loses' : 'wins') + '</b>. The pile has ' + v.n + ' counters and you go first. Work out the new strategy. How many should you take?', v.n, v.k, v.lose, 'variation ' + v.k + (v.lose ? 'L' : 'W'));
        } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '14', level: 'BEG', make: function (r) { var n = find(function () { return r.int(13, 45); }, function (n) { return n % 4 && EX_PILES.indexOf(n) < 0; }, 26), a = n % 4;
          var opts = [1, 2, 3].map(function (k) { return { html: String(k), right: k === a, why: 'Taking ' + k + ' leaves ' + (n - k) + ', which is not a multiple of 4.', code: 'u5l2-diag' }; }).concat([{ html: 'It doesn’t matter.', why: 'Only one move leaves a multiple of 4.', code: 'u5l2-diag' }]);
          return mcCols(P.mc(r, 'In the take-away game (take 1, 2 or 3; last counter wins), the pile has ' + n + ' counters and you go first. How many should you take?', opts, 'The next multiple of 4 below ' + n + ' is ' + (n - a) + ', so take ' + a + '.', ['Leave a multiple of 4.'], 'MC take ' + n, true), 4); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) { var n = r.pick([5, 6, 7]), ans = tw(n);
          var opts = [{ html: String(2 * n), why: 'That adds 2 for each disc. The count doubles and adds 1.', code: 'u5l2-add2' }, { html: String(n * n), why: 'That’s ' + n + ' × ' + n + '. The rule is ' + t('2^n-1') + '.', code: 'u5l2-diag' }, { html: String(ans), right: true }, { html: String(ans + 1), why: 'That’s ' + t('2^{' + n + '}') + '. Don’t forget the − 1.', code: 'u5l2-no-minus1' }];
          return mcCols(P.mc(r, 'What is the fewest number of moves for a tower puzzle with ' + n + ' discs?', opts, t('2^{' + n + '}-1=' + (ans + 1) + '-1=' + ans), ['Fewest moves = ' + t('2^n-1') + '.'], 'MC tower ' + n, true), 4); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) { return P.mc(r, 'Which tic-tac-toe move is a <b>fork</b>?', [
            { html: 'A move that makes two in a row in two lines at once', right: true }, { html: 'A move that blocks the other player’s two in a row', why: 'That’s a block (step 2).', code: 'u5l2-ttt-why' },
            { html: 'Taking the centre on the first move', why: 'That’s a good opening, but it makes no threats yet.', code: 'u5l2-ttt-why' }, { html: 'A move that completes three in a row', why: 'That’s a win (step 1).', code: 'u5l2-ttt-why' }],
            'A fork makes two threats at the same time, so the other player can block only one.', ['A fork makes two threats.'], 'fork'); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) { var n = r.pick([6, 7, 9, 10]), ans = tw(n);
          return nrPart('The fewest number of moves for a tower puzzle with ' + n + ' discs is ____.', ans, [[ans + 1, 'That’s ' + t('2^{' + n + '}') + '. Subtract 1.', 'u5l2-no-minus1'], [2 * n, 'The moves don’t go up by 2 each disc. Use ' + t('2^n-1') + '.', 'u5l2-add2'], [2 * tw(n - 1), 'Double the moves for ' + (n - 1) + ' discs, then add 1 (the biggest disc’s move).', 'u5l2-double']],
            t('2^{' + n + '}-1=' + (ans + 1) + '-1=' + ans), ['Fewest moves = ' + t('2^n-1') + '.'], 'NR tower ' + n); } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'PRG', make: function (r) { var k = r.pick([4, 5]), n = find(function () { return r.int(24, 60); }, function (n) { return n % (k + 1) && !(k === 4 && n === 23) && n % (k + 1) !== n % 4; }, 38), a = n % (k + 1);
          return nrPart('In a take-away game you may take 1 to ' + k + ' counters, and the last counter wins. The pile has ' + n + ' counters and you go first. To be sure of winning, you should take ____ counters.', a, takeBad(n, k, false), takeSol(n, k, false), ['Leave multiples of ' + (k + 1) + '.'], 'NR take ' + k + ' ' + n); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: '', parts: [{ id: 'e1', level: 'EMG', make: function (r) { return pileGrid(r, 4, 'piles mult 4'); } }] },
      { num: '2', stem: 'Use the tic-tac-toe checklist (win, block, fork, centre). Where should the player whose turn it is play?', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { return tttPart(r, 'block', 'O', 'ttt block'); } },
        { id: 'e2b', level: 'PRG', make: function (r) { return tttPart(r, 'fork', 'X', 'ttt fork'); } }] },
      { num: '3', stem: 'Use the tower-puzzle rule, fewest moves ' + t('=2^n-1') + '.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var n = r.pick([11, 12, 13]), ans = tw(n); return numPart('(a) How many moves does a ' + n + '-disc tower take?', ans, [[ans + 1, 'That’s ' + t('2^{' + n + '}') + '. Subtract 1.', 'u5l2-no-minus1'], [2 * n - 1, 'Use ' + t('2^n-1') + ': the moves double each time.', 'u5l2-add2']], t('2^{' + n + '}-1=' + (ans + 1) + '-1=' + ans) + ' moves', ['On the calculator: 2 ^ ' + n + ' − 1.'], 'tower ' + n, { after: 'moves' }); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var n = r.pick([9, 10, 11, 12]), m = tw(n);
          return numPart('(b) A tower takes ' + m + ' moves. How many discs does it have? Use guess and check.', n, [[n + 1, 'Check: ' + t('2^{' + (n + 1) + '}-1=' + tw(n + 1)) + ', too big.', 'u5l2-diag'], [n - 1, 'Check: ' + t('2^{' + (n - 1) + '}-1=' + tw(n - 1)) + ', too small.', 'u5l2-diag'], [Math.round(m / 2), 'The moves aren’t 2 per disc. Find n so that ' + t('2^n-1=' + m) + '.', 'u5l2-add2']],
            steps([t(m + '+1=' + (m + 1)), 'Try: ' + t('2^{' + (n - 1) + '}=' + Math.pow(2, n - 1)) + ' (too small), ' + t('2^{' + n + '}=' + Math.pow(2, n)) + ' ✓', 'It has ' + n + ' discs.']), ['Add 1 to the moves, then find which power of 2 it is.'], 'discs from ' + m, { after: 'discs' }); } }] },
      { num: '4', stem: function (sh) { return 'In the hidden-ships game, you hit the other player’s <b>2-ship</b> at ' + cn(sh.h[0], sh.h[1]) + '. Your calls at ' + andList(sh.miss.map(function (q) { return cn(q[0], q[1]); })) + ' were misses.<br>' + seaSVG(6, { hit: [sh.h], miss: sh.miss }) + '<br>' + SEA_KEY; },
        shared: function (r) { return find(function () { var h = [r.int(1, 6), r.int(1, 6)], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(function (d) { return [h[0] + d[0], h[1] + d[1]]; }).filter(function (q) { return inGrid(q); }); if (nb.length < 3) return null; var miss = r.sample(nb, 2); return { h: h, nb: nb, miss: miss, live: nb.filter(function (q) { return !hasQ(miss, q); }) }; }, function (x) { return !!x && x.live.length >= 2; }, null); }, parts: [
        { id: 'e4a', level: 'PRG', make: function (r, sh) { var pos = function (q) { var a = [sh.h, q].sort(function (x, y) { return x[0] - y[0] || x[1] - y[1]; }); return cn(a[0][0], a[0][1]) + '–' + cn(a[1][0], a[1][1]); };
          var want = sh.live.map(pos);
          return selectPart('(a) Which places could the 2-ship still be? Tap every one.', sh.nb.map(function (q) { return { value: pos(q), html: pos(q) }; }), want,
            function (ex) { return ex.length ? { code: 'u5l2-ship', hint: ex[0] + ' uses a square you missed. Eliminate it.' } : { code: 'u5l2-ship', hint: 'One more position is still possible: it covers the hit and no miss.' }; },
            andList(want), steps(sh.nb.map(function (q) { return hasQ(sh.miss, q) ? '<s>' + pos(q) + '</s> (' + cn(q[0], q[1]) + ' miss)' : '<b>' + pos(q) + '</b>'; }).concat(['Left: ' + andList(want) + '.'])), ['List the squares next to the hit (across, up and down), then cross out the misses.'], 'two-ship positions'); } },
        { id: 'e4b', level: 'PRG', make: function (r, sh) { var n = sh.live.length;
          return numPart('(b) What is the greatest number of calls you still need to sink it?', n, [[n - 1, 'If every call but the last misses, you know where the ship is, but you still have to <b>call</b> that last square to sink it.', 'u5l2-last-call'], [4, 'Some squares next to the hit are already eliminated.', 'u5l2-diag']],
            steps([n + ' positions are left: ' + andList(sh.live.map(function (q) { return cn(q[0], q[1]); })) + '.', 'Call them one at a time. In the worst case the ship is the last one, so it can take ' + n + ' calls.']), ['How many positions are left? Think about the worst luck.'], 'calls left', { after: 'calls' }); } }] },
      { num: '5', stem: 'Look at this dots-and-boxes game. The boxes are named A to I.', shared: function (r) { var d = dotsPos2(r) || DOTS2_BOOK(); var labs = r.chance(0.5) ? ['t', 'u'] : ['u', 't']; d.dashed = {}; d.dashed[labs[0]] = d.unsafe; d.dashed[labs[1]] = d.safe; return d; }, parts: [
        { id: 'e5a', level: 'EMG', make: function (r, sh) { var want = sh.th.map(bn);
          return selectPart('(a) Which boxes have exactly 3 sides? Tap every one.<br>' + dotsSVG(sh.set, sh.dashed), 'ABCDEFGHI'.split('').map(function (L) { return { value: L, html: L }; }), want,
            function (ex) { if (ex.length) { var bx = boxes().filter(function (b) { return bn(b) === ex[0]; })[0]; return { code: 'u5l2-dots', hint: 'Box ' + ex[0] + ' has ' + count(sh.set, bx[0], bx[1]) + ' sides. Count its top, bottom, left and right.' }; } return { code: 'u5l2-dots', hint: 'There is another box with 3 sides.' }; },
            andList(want), want.map(function (L, i) { return 'Box ' + L + ': draw ' + lineWords(sh.ms[i]) + ' to take it.'; }).join('<br>'), ['Count the 4 sides of each box.'], 'three sides'); } },
        { id: 'e5b', level: 'EMG', make: function (r, sh) { var want = sh.two.map(bn);
          return selectPart('(b) Which boxes have exactly 2 sides? Tap every one.<br>' + dotsSVG(sh.set, sh.dashed), 'ABCDEFGHI'.split('').map(function (L) { return { value: L, html: L }; }), want,
            function (ex, mi) { if (ex.length) { var bx = boxes().filter(function (b) { return bn(b) === ex[0]; })[0]; return { code: 'u5l2-dots', hint: 'Box ' + ex[0] + ' has ' + count(sh.set, bx[0], bx[1]) + ' side' + (count(sh.set, bx[0], bx[1]) === 1 ? '' : 's') + '.' }; } return { code: 'u5l2-dots', hint: (mi.length === 1 ? 'One more box has' : mi.length + ' more boxes have') + ' exactly 2 sides.' }; },
            andList(want), 'Boxes with 2 sides: ' + andList(want) + '. Drawing a side on one of these gives it 3 sides, so the other player could take it.', ['Count the sides of each box. Lines on the outside edge count too.'], 'two sides'); } },
        { id: 'e5c', level: 'PRG', make: function (r, sh) { var want = {}, rows = Object.keys(sh.dashed).sort().map(function (lab) { want[lab] = givesAway(sh.after, sh.dashed[lab]) ? 'no' : 'yes'; return { id: lab, html: 'Line <i>' + lab + '</i>', label: 'line ' + lab }; });
          return P.grid('(c) You take ' + andList(sh.th.map(bn)) + '. Then is each dashed line safe?<br>' + dotsSVG(sh.after, sh.dashed, { hiLines: sh.ms, taken: sh.th }), rows, [{ id: 'yes', html: 'Safe' }, { id: 'no', html: 'Not safe (gives a box away)' }], want,
            { why: function (row) { return { code: 'u5l2-dots', hint: 'Line <i>' + row + '</i> touches ' + andList(boxesOfLine(sh.dashed[row]).map(bn)) + '. With it drawn, would any of those boxes have 3 sides?' }; } },
            steps(Object.keys(sh.dashed).sort().map(function (lab) { return '<i>' + lab + '</i>: ' + awayWords(sh.after, sh.dashed[lab]) + '.'; })), ['After you take the boxes, the lines you drew count too.'], 'safe t u'); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A take-away game: take 1 to ' + sh.k + ' counters, and the player who takes the <b>last</b> counter <b>loses</b>.'; }, shared: function (r) { return { k: r.pick([4, 4, 5]) }; }, parts: [
        { id: 'e6a', level: 'PRG', make: function (r, sh) { return wlGrid('(a) Work backward. For each number of counters on your turn, will you win (W) or lose (L)?', sh.k, true, 1, 12, 'WL lose ' + sh.k); } },
        { id: 'e6b', level: 'PRG', make: function (r, sh) { var p = leaveMC(r, sh.k, true, 'leave lose ' + sh.k); p.prompt = '(b) ' + p.prompt; return p; } },
        { id: 'e6c', level: 'ADV', make: function (r, sh) { var n = find(function () { return r.int(13, 40); }, function (n) { return takeFor(n, sh.k, true) && takeFor(n, sh.k, true) !== n % (sh.k + 1); }, 20); return takePart('(c) The pile has ' + n + ' counters and you go first. How many should you take?', n, sh.k, true, 'take lose ' + sh.k + ' ' + n); } }] },
      { num: '7', stem: function (sh) { return 'In a variation of the take-away game, each player may take 1 to ' + sh.k + ' counters, and the last counter wins. The pile has ' + sh.n + ' counters.'; }, shared: function (r) { var k = r.pick([5, 6, 7, 8]); return { k: k, n: find(function () { return r.int(30, 60); }, function (n) { return r.chance(0.25) ? n % (k + 1) === 0 : n % (k + 1) !== 0 && n % (k + 1) !== n % k; }, 50) }; }, parts: [
        { id: 'e7a', level: 'PRG', make: function (r, sh) { var p = leaveMC(r, sh.k, false, 'leave 1-' + sh.k); p.prompt = '(a) ' + p.prompt; return p; } },
        { id: 'e7b', level: 'PRG', make: function (r, sh) { var k = sh.k, n = sh.n, a = n % (k + 1), opts;
          if (a) opts = [{ html: 'Go first and take ' + a + '.', right: true }, { html: 'Go second.', why: n + ' is not a multiple of ' + (k + 1) + ', so the first player can leave one. Go first.', code: 'u5l2-stuck' }, { html: 'Go first and take ' + k + ' (the most you can).', why: 'Taking the most leaves ' + (n - k) + '. Is that a multiple of ' + (k + 1) + '?', code: 'u5l2-diag' }, { html: 'Go first and take ' + (n % k || k - 1) + '.', why: 'That leaves a multiple of ' + k + ' (or nothing useful). Leave a multiple of ' + (k + 1) + '.', code: 'u5l2-ravi' }];
          else opts = [{ html: 'Go second.', right: true }, { html: 'Go first and take 1.', why: n + ' is already a multiple of ' + (k + 1) + '. Whatever the first player takes, the second player can leave a multiple of ' + (k + 1) + '.', code: 'u5l2-stuck' }, { html: 'Go first and take ' + k + ' (the most you can).', why: n + ' is already a multiple of ' + (k + 1) + ', so the first player is stuck.', code: 'u5l2-stuck' }, { html: 'Go first and take ' + (n % k || 1) + '.', why: 'That is the multiple-of-' + k + ' rule. ' + n + ' is a multiple of ' + (k + 1) + ', so the first player is stuck.', code: 'u5l2-ravi' }];
          var seen = {}; opts = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
          return P.mc(r, '(b) Should you go first? If so, how many should you take?', opts, a ? n + ' is not a multiple of ' + (k + 1) + '. The next one below is ' + (n - a) + ', so go first and take ' + a + '.' : n + ' is a multiple of ' + (k + 1) + ', so the first player is stuck. Go second, and always leave a multiple of ' + (k + 1) + '.', ['Is ' + n + ' a multiple of ' + (k + 1) + '?'], 'first or second'); } }] },
      { num: '8', stem: function (sh) { var g = sh.g; return 'Here is a tic-tac-toe game between ' + sh.x + ' (X) and ' + sh.o + ' (O): X plays ' + g[0] + ', O plays ' + g[1] + ', X plays ' + g[2] + ', O plays ' + g[3] + ', X plays ' + g[4] + '. ' + sh.x + ' wins on his next turn.<br>' + tttSVG(gameBoard(g), { s: 40, maxW: 150 }); },
        shared: function (r) { return { g: find(function () { return symGame(r, [[5, 1, 9, 2, 3], [5, 1, 9, 4, 7]]); }, function (g) { var b = gameBoard(g); return threats(b, 'X').length === 2 && !threats(b, 'O').length && threats(gameBoard(g.slice(0, 4)), 'O').indexOf(g[4]) >= 0; }, [5, 1, 9, 2, 3]), x: r.pick(['Liam', 'Dev', 'Sam']), o: r.pick(['Hana', 'Tia', 'June']) }; }, parts: [
        { id: 'e8a', level: 'EMG', make: function (r, sh) { var g = sh.g, b = gameBoard(g.slice(0, 4));
          return P.mc(r, '(a) Why did ' + sh.x + ' have to play ' + g[4] + '?', [
            { html: sh.o + ' had ' + g[1] + ' and ' + g[3] + ', so ' + sh.x + ' had to block at ' + g[4] + '.', right: true },
            { html: g[4] + ' wins the game for ' + sh.x + ' right away.', why: 'X didn’t have three in a row after ' + g[4] + '. Look at what O threatened.', code: 'u5l2-ttt-why' },
            { html: 'Corners are always the best move.', why: 'The checklist comes first: win, then block. Did O have two in a row?', code: 'u5l2-ttt-why' },
            { html: 'It made a fork.', why: 'It does make a fork, but that’s not why he <b>had</b> to play there. What did O threaten?', code: 'u5l2-ttt-why' }],
            sh.o + ' had ' + g[1] + ' and ' + g[3] + ' (the line ' + lineOf(b, 'O', g[4]) + '), so ' + sh.x + ' had to block at ' + g[4] + ' (step 2).', ['Use the checklist: win, block, fork.'], 'had to block'); } },
        { id: 'e8b', level: 'PRG', make: function (r, sh) { var b = gameBoard(sh.g), th = threats(b, 'X'); return threatPart('(b) Why can’t ' + sh.o + ' stop ' + sh.x + ' now? Give the two squares where X threatens to win.', b, 'X', 'fork threats',
          'X has ' + andList(sh.g.filter(function (s, i) { return i % 2 === 0; }).sort()) + '. X threatens ' + th[0] + ' (' + lineOf(b, 'X', th[0]) + ') and ' + th[1] + ' (' + lineOf(b, 'X', th[1]) + '). ' + sh.o + ' can block only one.'); } },
        { id: 'e8c', level: 'PRG', make: function (r, sh) { var g = sh.g, corners = [1, 3, 7, 9].filter(function (q) { return [g[0], g[1], g[2]].indexOf(q) < 0; }), wrongEdge = [2, 4, 6, 8].filter(function (q) { return g.indexOf(q) < 0; })[0];
          return P.mc(r, '(c) Which of ' + sh.o + '’s moves was the mistake? Where should she have played?', [
            { html: 'Her second move, ' + g[3] + ' (an edge). She should have taken a corner, ' + andList(corners, true) + '.', right: true },
            { html: 'Her first move, ' + g[1] + '. She should have taken an edge.', why: 'Answering the centre with a corner is right. The mistake came later.', code: 'u5l2-ttt-why' },
            { html: 'Her second move, ' + g[3] + '. She should have taken the other edge, ' + wrongEdge + '.', why: 'Another edge loses too: X can still make a fork. She needed a corner.', code: 'u5l2-ttt-why' },
            { html: 'She made no mistake: X always wins from the centre.', why: 'If O answers the centre with a corner and keeps blocking with corners, the game is a tie.', code: 'u5l2-ttt-why' }],
            'Her second move, ' + g[3] + ' (an edge): it made X block at ' + g[4] + ', which was also a fork. She should have taken a corner, ' + andList(corners, true) + '. Then she can block every threat and the game is a tie.', ['Her first move was a corner. Look at her second move.'], 'Hana mistake'); } }] },
      { num: '9', stem: '<b>Variation of dots and boxes:</b> each box is worth 1 point, but the 4 corner boxes (A, C, G and I) are worth 2 points each. The player with more points wins.', parts: [
        { id: 'e9', level: 'PRG', make: function (r) { return P.mc(r, 'How should the strategy change?', [
            { html: 'Still take boxes with 3 sides and avoid third sides, but be extra careful with corner boxes. Near the end, give away the group worth the fewest <b>points</b>, not the fewest boxes.', right: true },
            { html: 'Nothing changes: give away the group with the fewest boxes.', why: 'A small group with a corner box can be worth more points than a bigger group without one.', code: 'u5l2-why' },
            { html: 'Always draw the third side of a corner box first.', why: 'That gives the corner box (2 points) to the other player.', code: 'u5l2-why' },
            { html: 'Only ever take corner boxes.', why: 'Every box still counts. Take any box with 3 sides.', code: 'u5l2-why' }],
            'Keep the old strategy (take boxes with 3 sides, avoid third sides), but count <b>points</b>: never give away a corner box if you can help it, and at the end give away the group worth the fewest points.', ['What is a group with a corner box worth now?'], 'corner variation'); } }] },
      { num: '10', stem: '', parts: [
        { id: 'e10', level: 'PRG', make: function (r) { var n = r.pick([6, 7, 9]), rate = r.pick([2, 3]), mv = tw(n), tot = mv * rate;
          return minSecFields('A tower puzzle at a games café has ' + n + ' discs. A player makes 1 move every ' + rate + ' seconds and never makes a mistake. How long does it take? Give minutes and seconds.', tot,
            steps([t('2^{' + n + '}-1=' + mv) + ' moves', t(mv + '\\times ' + rate + '=' + tot) + ' s', t(tot + '\\div 60=' + Math.floor(tot / 60)) + ' remainder ' + tot % 60, Math.floor(tot / 60) + ' min ' + tot % 60 + ' s']), 'cafe ' + n + ' ' + rate, rate, n); } }] },
      { num: '11', stem: '', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var s = find(function () { var h = [r.int(2, 5), r.int(2, 5)], d = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), far = [h[0] + 2 * d[0], h[1] + 2 * d[1]]; if (!inGrid(far)) return null; var miss = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(function (e) { return !(e[0] === d[0] && e[1] === d[1]); }).map(function (e) { return [h[0] + e[0], h[1] + e[1]]; }); return { h: h, d: d, miss: miss, right: [h[0] + d[0], h[1] + d[1]] }; }, function (x) { return !!x; }, null);
          var past = s.miss.map(function (q) { return [2 * q[0] - s.h[0], 2 * q[1] - s.h[1]]; }).filter(function (q) { return inGrid(q); }), diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(function (e) { return [s.h[0] + e[0], s.h[1] + e[1]]; }).filter(function (q) { return inGrid(q); });
          var wr = r.sample(past, Math.min(2, past.length)).map(function (q) { return { html: cn(q[0], q[1]), why: cn(q[0], q[1]) + ' is past a miss. A ship can’t jump over a square you missed.', code: 'u5l2-ship-call' }; });
          r.sample(diag, 4 - 1 - wr.length).forEach(function (q) { wr.push({ html: cn(q[0], q[1]), why: cn(q[0], q[1]) + ' is diagonal from the hit. Ships are never diagonal.', code: 'u5l2-ship-call' }); });
          return mcCols(P.mc(r, 'In the hidden-ships game, you hit a 3-ship at ' + cn(s.h[0], s.h[1]) + '. Your calls at ' + andList(s.miss.map(function (q) { return cn(q[0], q[1]); })) + ' were all misses. Which square should you call next?<br>' + seaSVG(6, { hit: [s.h], miss: s.miss }), [{ html: cn(s.right[0], s.right[1]), right: true }].concat(wr),
            'Three of the squares next to ' + cn(s.h[0], s.h[1]) + ' are misses, so the ship must run the fourth way: call ' + cn(s.right[0], s.right[1]) + ' (the ship is ' + cn(s.h[0], s.h[1]) + ', ' + cn(s.right[0], s.right[1]) + ', ' + cn(s.h[0] + 2 * s.d[0], s.h[1] + 2 * s.d[1]) + ').', ['Which direction from the hit is not blocked by a miss?'], 'next call'), 4); } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'PRG', make: function (r) { var n = r.pick([8, 9, 10]), mv = tw(n), made = r.pick([50, 100, 120, 150, 200, 250, 300, 400].filter(function (x) { return x < mv - 20; })), ans = mv - made;
          return nrPart('A tower puzzle has ' + n + ' discs. A player has made ' + made + ' moves without a mistake. The number of moves still needed to finish is ____.', ans, [[mv + 1 - made, 'The fewest moves for ' + n + ' discs is ' + t('2^{' + n + '}-1=' + mv) + ', not ' + (mv + 1) + '.', 'u5l2-no-minus1'], [mv, 'That’s all the moves. Subtract the ' + made + ' already made.', 'u5l2-diag']],
            steps(['Fewest moves: ' + t('2^{' + n + '}-1=' + (mv + 1) + '-1=' + mv), 'Still needed: ' + t(mv + '-' + made + '=' + ans)]), ['Find the fewest moves for ' + n + ' discs, then subtract.'], 'NR left ' + n); } }] },
      { num: '13', section: 'C. Stretch', stem: '<b>The two-pile game.</b> There are two piles of counters. On your turn, take as many counters as you like (at least 1) from <b>one</b> pile. The player who takes the last counter wins.', parts: [
        { id: 'e13a', level: 'PRG', make: function (r) { var b = r.int(2, 6), a = b + r.int(1, 4);
          var ck = function (resp) { resp = resp || []; var v = resp.map(function (x) { var q = HW.parse.number(String(x || '')); return q.ok ? q.value : null; }); if (v.some(function (x) { return x == null; })) return form('empty', 'Fill in both boxes.');
            if (v[0] === a - b && v[1] === a) return ok(); if (v[1] !== a && v[1] !== b) return form('u5l2-pile', 'The piles are ' + a + ' and ' + b + '. Which pile do you take from?');
            if (v[1] === b) return wrong('u5l2-diag', 'Taking from the pile of ' + b + ' makes it smaller still. Take from the bigger pile.');
            return wrong('u5l2-diag', 'Taking ' + v[0] + ' from ' + a + ' leaves ' + (a - v[0]) + ' and ' + b + '. Make the piles equal.'); };
          return { prompt: '(a) The piles have ' + a + ' and ' + b + ' counters, and you go first. Show a move that makes the piles equal.', input: { type: 'fields', fields: [{ label: 'Take', name: 'How many', after: 'counters' }, { label: 'from the pile of', name: 'Which pile' }] }, check: ck, key: [String(a - b), String(a)],
            answer: 'Take ' + (a - b) + ' from the pile of ' + a, solution: 'Take ' + t(a + '-' + b + '=' + (a - b)) + ' from the pile of ' + a + '. Now the piles are ' + b + ' and ' + b + '.', hints: ['Take from the bigger pile until it matches the smaller one.'], text: 'two piles ' + a + ',' + b, bad: [[String(a - b + 1), String(a)], [String(a - b), String(b)]] }; } },
        { id: 'e13b', level: 'PRG', make: function (r) { return P.mc(r, '(b) Why can you always win after making the piles equal?', [
            { html: 'Copy the other player: whatever they take from one pile, take the same from the other. The piles are equal after each of your turns, so you take the last counter.', right: true },
            { html: 'Because you went first.', why: 'Going first only helps if you can make the piles equal. What do you do on every turn after that?', code: 'u5l2-why' },
            { html: 'Always take a whole pile.', why: 'Taking a whole pile leaves the other player one pile, and they take it all and win.', code: 'u5l2-why' },
            { html: 'Always take 1 counter so the game lasts longer.', why: 'A long game doesn’t help. Keep the piles equal.', code: 'u5l2-why' }],
            'Copy the other player: whatever they take from one pile, take the same number from the other pile. The piles are always equal after your turn, so they can never take the last counter.', ['What can you do so the piles are equal after every one of your turns?'], 'copy strategy'); } },
        { id: 'e13c', level: 'PRG', make: function (r) { var eq = r.chance(0.6), a = r.int(3, 9), b = eq ? a : find(function () { return r.int(2, 9); }, function (x) { return x !== a; }, a + 1);
          var opts = [{ html: 'Go second.', right: eq, why: eq ? null : 'The piles are not equal, so you can make them equal on your first turn. Go first.', code: 'u5l2-why' }, { html: eq ? 'Go first and take 1 from either pile.' : 'Go first and take ' + Math.abs(a - b) + ' from the bigger pile.', right: !eq, why: eq ? 'The piles are already equal. Whatever you take, the other player copies you. Go second.' : null, code: 'u5l2-why' }, { html: 'Go first and take a whole pile.', why: 'The other player then takes the whole other pile and wins.', code: 'u5l2-why' }];
          return P.mc(r, '(c) The piles start at ' + a + ' and ' + b + '. Should you go first or second?', opts, eq ? 'Second. The piles are already equal, so the copying strategy works for the second player.' : 'First: take ' + Math.abs(a - b) + ' from the pile of ' + Math.max(a, b) + ' to make the piles equal, then copy.', ['Are the piles equal already?'], 'first second piles'); } }] },
      { num: '14', stem: 'In the tower-puzzle variation where a disc may move only to a <b>neighbouring</b> peg (never straight between A and C), 1 disc takes 2 moves and 2 discs take 8 moves.', shared: function (r) { return { n: r.pick([3, 3, 4]) }; }, parts: [
        { id: 'e14a', level: 'ADV', make: function (r, sh) { var n = sh.n, m = Math.pow(3, n - 1) - 1, ans = 3 * m + 2;
          return numPart('(a) To move ' + n + ' discs from A to C: move the top ' + (n - 1) + ' from A to C, the big disc from A to B, the top ' + (n - 1) + ' from C back to A, the big disc from B to C, then the top ' + (n - 1) + ' from A to C. ' + (n - 1) + ' discs take ' + m + ' moves. How many moves is that?', ans,
            [[2 * m + 1, 'That’s the usual tower plan. Here the top ' + (n - 1) + ' move <b>three</b> times and the big disc moves twice.', 'u5l2-double'], [3 * m, 'Don’t forget the big disc’s 2 moves.', 'u5l2-diag'], [3 * m + 1, 'The big disc moves twice (A to B, then B to C).', 'u5l2-diag'], [Math.pow(2, n) - 1, 'That’s the usual tower rule. This variation has a different count.', 'u5l2-pattern']],
            t(m + '+1+' + m + '+1+' + m + '=' + ans) + ' moves', ['Add up the five steps: three moves of the small tower and two of the big disc.'], 'neighbour ' + n, { after: 'moves' }); } },
        { id: 'e14b', level: 'MAS', make: function (r, sh) { var n = sh.n + 1, seq = [2, 8, 26, 80, 242], ans = seq[n - 1], prev = seq[n - 2], d = prev - seq[n - 3];
          return numPart('(b) Look at the counts 2, 8, 26' + (n === 5 ? ', 80' : '') + ' for 1, 2, 3' + (n === 5 ? ', 4' : '') + ' discs. Find a pattern and predict the moves for ' + n + ' discs.', ans,
            [[prev + d, 'The differences aren’t the same each time (6, 18, …): they get 3 times bigger. Look for a multiply-then-add rule.', 'u5l2-pattern'], [3 * prev, 'Close: multiply by 3, then add 2.', 'u5l2-pattern'], [2 * prev + 2, 'Doubling doesn’t fit: 2 × 8 + 2 = 18, not 26. Try 3 times.', 'u5l2-pattern'], [Math.pow(2, n) - 1, 'That’s the usual tower rule. This variation follows a different pattern.', 'u5l2-pattern'], [2 * prev + 1, 'That’s the usual tower pattern (double + 1). Check it: 2 × 8 + 1 = 17, not 26.', 'u5l2-pattern']],
            steps(['Each count is 3 times the one before, plus 2: ' + t('3\\times 2+2=8') + ', ' + t('3\\times 8+2=26') + (n === 5 ? ', ' + t('3\\times 26+2=80') : '') + '.', t('3\\times ' + prev + '+2=' + ans) + ' moves for ' + n + ' discs.', '(Also each is one less than a power of 3: ' + t('3^{' + n + '}-1=' + ans) + '.)']), ['Compare each number with the one before it. Is it about double, or about triple?'], 'neighbour pattern ' + n, { after: 'moves' }); } }] },
      { num: '15', stem: '<b>Variation of the hidden-ships game:</b> ships may also lie diagonally.', parts: [
        { id: 'e15a', level: 'PRG', make: function (r) { return P.mc(r, '(a) Does the checkerboard hunt still find every 2-ship for sure?', [
            { html: 'No. Squares that touch at a corner have the <b>same</b> colour, so a diagonal 2-ship could sit only on white squares.', right: true },
            { html: 'Yes. A 2-ship always covers both colours.', why: 'That is true for ships across or up and down. Look at two squares that touch only at a corner.', code: 'u5l2-why' },
            { html: 'Yes, but only on a 6 by 6 grid.', why: 'The grid size doesn’t matter. Think about the colours of diagonal neighbours.', code: 'u5l2-why' },
            { html: 'No, because diagonal ships are longer.', why: 'A diagonal 2-ship still has 2 squares. The problem is their colours.', code: 'u5l2-why' }],
            'No. Diagonal neighbours (like B2 and C3) are the same colour, so a diagonal 2-ship could sit only on white squares and never be hit.', ['Colour a few squares of a checkerboard. What colour are two squares that touch at a corner?'], 'diagonal checker'); } },
        { id: 'e15b', level: 'PRG', make: function (r) { var q = r.pick([[r.int(2, 5), r.int(2, 5)], [1, r.int(2, 5)], [r.int(2, 5), 6], [1, 1], [6, 6], [6, r.int(2, 5)]]), n = [-1, 0, 1].reduce(function (s, dx) { return s + [-1, 0, 1].filter(function (dy) { return (dx || dy) && inGrid([q[0] + dx, q[1] + dy]); }).length; }, 0);
          return numPart('(b) After a hit at ' + cn(q[0], q[1]) + ' on a 6 by 6 grid, how many squares next to it (across, up and down, or diagonal) could you now try?<br>' + seaSVG(6, { hit: [q] }, { maxW: 200 }), n, [[8, n < 8 ? 'Some of the 8 neighbours are off the grid here. Count only squares on the grid.' : null, 'u5l2-diag'], [4, 'Diagonal squares count now too.', 'u5l2-diag'], [n === 8 ? 4 : n === 5 ? 3 : 2, 'Diagonal squares count now too.', 'u5l2-diag']],
            (n === 8 ? 'Up, down, left, right and the 4 diagonal squares: 8.' : cn(q[0], q[1]) + ' is on the ' + (n === 3 ? 'corner' : 'edge') + ' of the grid, so only ' + n + ' of the 8 neighbours are on the grid.'), ['Count the squares around the hit, including the diagonal ones.'], 'neighbours ' + cn(q[0], q[1]), { after: 'squares' }); } }] }
    ]
  });
})(window);
