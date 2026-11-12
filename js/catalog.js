/* The course: units and lessons in booklet order. A lesson with a lesson file (HW.lessons[id]) is open;
 * the rest show as "coming soon" (with their teaching-site lesson card). The class calendar (js/calendar.js) plans every
 * lesson listed here, plus a unit test after each unit. Titles match the Math 10-3 booklets and the course plan (claude/math10-3/course-plan.md). */
(function (root) {
  'use strict';
  root.HW = root.HW || {};
  /* lessons that have a lesson page under lessons/ (examples + the teacher's class notes); the home page and the
   * lesson sidebar link to it as lessons/u1/l7/?class=<block> */
  /* lessons that have a lesson page under lessons/ (examples + the teacher's class notes); the home page and the
   * lesson sidebar link to it as lessons/u1/l7/?class=<block>. The coordinator switches lessons on here. */
  root.HW.TEACHING = { base: 'lessons/',
    lessons: ['u1l0', 'u1l1', 'u1l2', 'u1l3', 'u1l4', 'u1l5', 'u1l6', 'u1l7', 'u1l8', 'u1l9', 'u1l10', 'u1l11', 'u2l1', 'u2l2', 'u2l3', 'u2l4', 'u2l5', 'u2l6', 'u2l7', 'u2l8', 'u2l9', 'u3l1', 'u3l2', 'u3l3', 'u3l4', 'u3l5', 'u3l6', 'u3l7', 'u3l8', 'u3l9', 'u3l10', 'u3l11', 'u3l12', 'u4l1', 'u4l2', 'u4l3', 'u4l4', 'u4l5', 'u4l6', 'u4l7', 'u5l1', 'u5l2', 'u5l3', 'u5l4', 'u5l5', 'u5l6', 'u5l7', 'u5l8', 'u5l9', 'u6l1', 'u6l2', 'u6l3', 'u6l4', 'u6l5', 'u6l6', 'u6l7', 'u7l1', 'u7l2', 'u7l3', 'u7l4', 'u7l5', 'u7l6', 'u7l7', 'u7l8', 'u7l9', 'u7l10'] };
  /* project: { id, title } = the unit's guided project (js/projects/u<N>.js, opened at #/project/<id>). The class calendar
     gives it a project work day ('p' + unit) right before the unit's review lesson (the last lesson listed). */
  root.HW.CATALOG = [
    { unit: 1, title: 'Unit Pricing and Currency Exchange', outcomes: 'N1', project: { id: 'u1', title: 'Pop-Up Shop' }, lessons: [
      { id: 'u1l0', num: '0', title: 'Welcome to Math 10-3', intro: true }, // day one: the course introduction (no assignment)
      { id: 'u1l1', num: '1', title: 'Money Sense: Rounding, Estimating and Using Your Calculator' },
      { id: 'u1l2', num: '2', title: 'Fractions Refresher: Equivalent Fractions and Simplest Form' },
      { id: 'u1l3', num: '3', title: 'Ratios' },
      { id: 'u1l4', num: '4', title: 'Proportions: Finding the Missing Value' },
      { id: 'u1l5', num: '5', title: 'Rates and Unit Rates' },
      { id: 'u1l6', num: '6', title: 'Unit Price: Finding the Best Buy' },
      { id: 'u1l7', num: '7', title: 'Percents Refresher: Percents, Decimals and Percent of an Amount' },
      { id: 'u1l8', num: '8', title: 'Setting a Price: Markup and Sales Tax' },
      { id: 'u1l9', num: '9', title: 'On Sale! Discounts and Sale Prices' },
      { id: 'u1l10', num: '10', title: 'Currency Exchange: Converting, and Buy vs Sell Rates' },
      { id: 'u1l11', num: '11', title: 'Unit 1 Review' }] },
    { unit: 2, title: 'Earning an Income', outcomes: 'N2 · A1', project: { id: 'u2', title: 'Pick Your Job' }, lessons: [
      { id: 'u2l1', num: '1', title: 'Time Math: Hours, Minutes and Timesheets' },
      { id: 'u2l2', num: '2', title: 'Wages and Salaries: Gross Pay and Pay Periods' },
      { id: 'u2l3', num: '3', title: 'Overtime: Time-and-a-Half and Double Time' },
      { id: 'u2l4', num: '4', title: 'Piecework and Contracts' },
      { id: 'u2l5', num: '5', title: 'Commission and Salary Plus Commission' },
      { id: 'u2l6', num: '6', title: 'Extra Earnings: Tips, Bonuses and Shift Premiums' },
      { id: 'u2l7', num: '7', title: 'Deductions and Net Pay: Reading a Pay Stub' },
      { id: 'u2l8', num: '8', title: 'Working Backwards: How Many Hours Do I Need?' },
      { id: 'u2l9', num: '9', title: 'Unit 2 Review' }] },
    { unit: 3, title: 'Length, Area and Surface Area', outcomes: 'M1 · M2 · M3 · M4 · A1', project: { id: 'u3', title: 'Reno Crew' }, lessons: [
      { id: 'u3l1', num: '1', title: 'Fractions Refresher: Mixed Numbers' },
      { id: 'u3l2', num: '2', title: 'The SI System: Units, Prefixes and Referents' },
      { id: 'u3l3', num: '3', title: 'The Imperial System and Reading a Tape Measure' },
      { id: 'u3l4', num: '4', title: 'Converting Length Within SI and Within Imperial' },
      { id: 'u3l5', num: '5', title: 'Converting Length Between SI and Imperial' },
      { id: 'u3l6', num: '6', title: 'Perimeter and Circumference' },
      { id: 'u3l7', num: '7', title: 'Rearranging Formulas: Finding a Missing Side' },
      { id: 'u3l8', num: '8', title: 'Area of 2-D Shapes' },
      { id: 'u3l9', num: '9', title: 'Composite and Irregular Shapes' },
      { id: 'u3l10', num: '10', title: 'Nets and Surface Area of Prisms' },
      { id: 'u3l11', num: '11', title: 'Surface Area of Cylinders, Pyramids and Cones' },
      { id: 'u3l12', num: '12', title: 'Unit 3 Review' }] },
    { unit: 4, title: 'Volume, Capacity, Mass and Temperature', outcomes: 'M1 · M2', project: { id: 'u4', title: 'Recipe Rescue' }, lessons: [
      { id: 'u4l1', num: '1', title: 'Volume of Prisms and Cylinders' },
      { id: 'u4l2', num: '2', title: 'Capacity: Litres, Gallons, and US vs British Units' },
      { id: 'u4l3', num: '3', title: 'Temperature: Celsius and Fahrenheit' },
      { id: 'u4l4', num: '4', title: 'Mass: Grams, Kilograms, Ounces, Pounds and Tons' },
      { id: 'u4l5', num: '5', title: 'Converting Mass Between SI and Imperial' },
      { id: 'u4l6', num: '6', title: 'From Volume to Mass: Bushels, Tonnes and Conversion Factors' },
      { id: 'u4l7', num: '7', title: 'Unit 4 Review' }] },
    { unit: 5, title: 'Angles, Parallel Lines and Spatial Puzzles', outcomes: 'G1 · G5 · G6', project: { id: 'u5', title: 'Mini-Golf Designer' }, lessons: [
      { id: 'u5l1', num: '1', title: 'Spatial Puzzles: Tangrams and Pentominoes' },
      { id: 'u5l2', num: '2', title: 'Spatial Games and Strategies' },
      { id: 'u5l3', num: '3', title: 'Measuring, Drawing and Classifying Angles' },
      { id: 'u5l4', num: '4', title: 'Estimating Angles with Referents, and True Bearings' },
      { id: 'u5l5', num: '5', title: 'Copying and Bisecting Angles; Perpendicular Lines' },
      { id: 'u5l6', num: '6', title: 'Angle Partners: Complementary, Supplementary and Opposite Angles' },
      { id: 'u5l7', num: '7', title: 'Transversals: Naming the Angle Pairs' },
      { id: 'u5l8', num: '8', title: 'Parallel Lines and Transversals: Finding Missing Angles' },
      { id: 'u5l9', num: '9', title: 'Unit 5 Review' }] },
    { unit: 6, title: 'Similarity and Scale', outcomes: 'G3', project: { id: 'u6', title: 'Scale It' }, lessons: [
      { id: 'u6l1', num: '1', title: 'Similar Polygons and Scale Factor' },
      { id: 'u6l2', num: '2', title: 'Are They Similar? Checking Angles and Side Ratios' },
      { id: 'u6l3', num: '3', title: 'Drawing Enlargements and Reductions' },
      { id: 'u6l4', num: '4', title: 'Scale Diagrams: Maps and Floor Plans' },
      { id: 'u6l5', num: '5', title: 'Similar Triangles' },
      { id: 'u6l6', num: '6', title: 'Indirect Measurement: Shadows and Mirrors' },
      { id: 'u6l7', num: '7', title: 'Unit 6 Review' }] },
    { unit: 7, title: 'Right Triangles and Trigonometry', outcomes: 'G2 · G4 · A1', project: { id: 'u7', title: 'Ramp It Up' }, lessons: [
      { id: 'u7l1', num: '1', title: 'Squares, Square Roots and Triangle Basics' },
      { id: 'u7l2', num: '2', title: 'The Pythagorean Theorem: Finding the Hypotenuse' },
      { id: 'u7l3', num: '3', title: 'The Pythagorean Theorem: Finding a Leg, and Squaring a Corner' },
      { id: 'u7l4', num: '4', title: 'Similar Right Triangles and the Tangent Ratio' },
      { id: 'u7l5', num: '5', title: 'The Sine Ratio' },
      { id: 'u7l6', num: '6', title: 'The Cosine Ratio' },
      { id: 'u7l7', num: '7', title: 'Angles of Elevation and Depression' },
      { id: 'u7l8', num: '8', title: 'Finding Angles with Inverse Trig Ratios' },
      { id: 'u7l9', num: '9', title: 'Solving Right Triangles: Choosing the Right Ratio' },
      { id: 'u7l10', num: '10', title: 'Unit 7 Review' }] }
  ];
  /* a colour for each unit (class calendar, unit headings): neighbouring units contrast, so a unit change is easy to see.
     HW.unitStyle(u) gives CSS variables: --uc (the colour), --ucl (pale tint), --ucs (soft border), --ucd (dark text),
     --uct (solid fill for white text, e.g. a unit test day). */
  var UC = { 1: '#2563eb', 2: '#ea580c', 3: '#7c3aed', 4: '#16a34a', 5: '#db2777', 6: '#0d9488', 7: '#ca8a04', 8: '#4f46e5', 9: '#dc2626', 10: '#8b5e34' };
  function mix(a, b, t) { var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), out = '#'; [16, 8, 0].forEach(function (s) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); out += ('0' + v.toString(16)).slice(-2); }); return out; }
  root.HW.UNIT_COLORS = UC;
  root.HW.unitColor = function (u) { var c = UC[u] || '#24508f'; return { c: c, light: mix(c, '#ffffff', 0.87), soft: mix(c, '#ffffff', 0.55), dark: mix(c, '#000000', 0.38), solid: mix(c, '#000000', 0.12) }; };
  root.HW.unitStyle = function (u) { var x = root.HW.unitColor(u); return '--uc:' + x.c + ';--ucl:' + x.light + ';--ucs:' + x.soft + ';--ucd:' + x.dark + ';--uct:' + x.solid; };
  root.HW.OUTCOMES = {
    N1: 'Unit pricing and currency exchange (proportional reasoning)',
    N2: 'Income: wages, salary, contracts, commission, piecework; gross and net pay',
    A1: 'Rearranging and applying formulas (perimeter, area, Pythagoras, trig ratios, income)',
    M1: 'The SI system: units and converting to imperial', M2: 'The imperial system: units and converting to SI',
    M3: 'SI and imperial linear measurement problems', M4: 'Area of 2-D shapes and surface area of 3-D objects',
    G1: 'Spatial puzzles and games', G2: 'The Pythagorean theorem', G3: 'Similarity of convex polygons',
    G4: 'Primary trigonometric ratios', G5: 'Parallel lines, perpendicular lines and transversals', G6: 'Angles: drawing, copying and bisecting',
    EXT: 'Extension (not part of a unit level)', REV: 'Refresher (not part of a unit level)'
  };
  /* outcomes that never count toward a level, an award or a unit grade: extension topics, and the refresher lessons
     (REV: basic skills retaught before a unit needs them) */
  root.HW.NO_LEVEL = { EXT: 1, REV: 1 };
})(window);
