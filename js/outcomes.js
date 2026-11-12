/* The Math 10-3 outcomes in the official wording (Alberta Education, Mathematics 10–12 Program of Studies, 2008),
 * and a small pop-out: any element with data-outcome="N1" shows the outcome's wording when tapped. */
(function (root) {
  'use strict';
  var HW = root.HW = root.HW || {};
  var M = 'Measurement', G = 'Geometry', N = 'Number', A = 'Algebra';
  HW.OUTCOME_TEXT = {
    M1: { strand: M, text: 'Demonstrate an understanding of the Système International (SI) by:', list: ['describing the relationships of the units for length, area, volume, capacity, mass and temperature', 'applying strategies to convert SI units to imperial units.'] },
    M2: { strand: M, text: 'Demonstrate an understanding of the imperial system by:', list: ['describing the relationships of the units for length, area, volume, capacity, mass and temperature', 'comparing the American and British imperial units for capacity', 'applying strategies to convert imperial units to SI units.'] },
    M3: { strand: M, text: 'Solve and verify problems that involve SI and imperial linear measurements, including decimal and fractional measurements.' },
    M4: { strand: M, text: 'Solve problems that involve SI and imperial area measurements of regular, composite and irregular 2-D shapes and 3-D objects, including decimal and fractional measurements, and verify the solutions.' },
    G1: { strand: G, text: 'Analyze puzzles and games that involve spatial reasoning, using problem-solving strategies.' },
    G2: { strand: G, text: 'Demonstrate an understanding of the Pythagorean theorem by:', list: ['identifying situations that involve right triangles', 'verifying the formula', 'applying the formula', 'solving problems.'] },
    G3: { strand: G, text: 'Demonstrate an understanding of similarity of convex polygons, including regular and irregular polygons.' },
    G4: { strand: G, text: 'Demonstrate an understanding of primary trigonometric ratios (sine, cosine, tangent) by:', list: ['applying similarity to right triangles', 'generalizing patterns from similar right triangles', 'applying the primary trigonometric ratios', 'solving problems.'] },
    G5: { strand: G, text: 'Solve problems that involve parallel, perpendicular and transversal lines, and pairs of angles formed between them.' },
    G6: { strand: G, text: 'Demonstrate an understanding of angles, including acute, right, obtuse, straight and reflex, by:', list: ['drawing', 'replicating and constructing', 'bisecting', 'solving problems.'] },
    N1: { strand: N, text: 'Solve problems that involve unit pricing and currency exchange, using proportional reasoning.' },
    N2: { strand: N, text: 'Demonstrate an understanding of income, including:', list: ['wages', 'salary', 'contracts', 'commissions', 'piecework'], after: 'to calculate gross pay and net pay.' },
    A1: { strand: A, text: 'Solve problems that require the manipulation and application of formulas related to:', list: ['perimeter', 'area', 'the Pythagorean theorem', 'primary trigonometric ratios', 'income.'] }
  };

  var pop = null, anchor = null;
  function close() { if (pop) { pop.remove(); pop = null; anchor = null; } }
  HW.showOutcome = function (code, el) {
    var o = HW.OUTCOME_TEXT[code]; if (!o) return;
    if (pop && anchor === el) { close(); return; }
    close(); anchor = el;
    pop = document.createElement('div'); pop.className = 'oc-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Outcome ' + code);
    pop.innerHTML = '<div class="oc-h"><b>' + code + '</b><span>' + o.strand + ' · Specific outcome ' + code.replace(/\D/g, '') + '</span>' +
      '<button type="button" class="oc-x" aria-label="Close">×</button></div>' +
      '<p class="oc-t">' + o.text + '</p>' + (o.list ? '<ul class="oc-l">' + o.list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') +
      (o.after ? '<p class="oc-t">' + o.after + '</p>' : '') + '<div class="oc-src">Alberta Education, Mathematics 10C Program of Studies</div>';
    document.body.appendChild(pop);
    pop.querySelector('.oc-x').addEventListener('click', close);
    var r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, vw = document.documentElement.clientWidth;
    var x = Math.max(8, Math.min(vw - w - 8, r.left)), y = r.bottom + 8;
    if (y + h > window.innerHeight - 8 && r.top - h - 8 > 8) y = r.top - h - 8;
    pop.style.left = x + window.scrollX + 'px'; pop.style.top = y + window.scrollY + 'px';
  };
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-outcome]');
    if (t && HW.OUTCOME_TEXT[t.dataset.outcome]) { e.preventDefault(); e.stopPropagation(); HW.showOutcome(t.dataset.outcome, t); return; }
    if (pop && !pop.contains(e.target)) close();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  root.addEventListener('scroll', function () { if (pop && anchor && !anchor.isConnected) close(); }, { passive: true });
  root.addEventListener('hashchange', close);
})(window);
