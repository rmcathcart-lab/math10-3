/* Storage namespace. The Math 10-3 site and the Math 10C site live at the same web address
 * (rmcathcart-lab.github.io), so browsers give them ONE shared localStorage. Both sites use the same key
 * names (hw:tkey for the teacher key, hw:session, ink:u4l1…), so without this they overwrite each other:
 * signing in to one Teacher Ledger would sign you out of the other, and lesson ink would leak between courses.
 *
 * This file must be the first script on every page of this site. It makes getItem / setItem / removeItem /
 * clear work inside the 'm103/' prefix, so the rest of the code can keep using plain key names.
 * Code that lists keys itself (Object.keys(localStorage), localStorage.key(i)) sees the raw prefixed names:
 * use window.HW_STORAGE_NS to strip the prefix (see the "clear lesson notes" button in teacher/dash.js). */
(function () {
  var P = 'm103/';
  var S = window.Storage && window.Storage.prototype;
  if (!S || S.__hwNs) return;
  var get = S.getItem, set = S.setItem, rem = S.removeItem, key = S.key;
  S.getItem = function (k) { return get.call(this, P + k); };
  S.setItem = function (k, v) { return set.call(this, P + k, v); };
  S.removeItem = function (k) { return rem.call(this, P + k); };
  S.clear = function () { // only this site's keys
    var mine = [];
    for (var i = 0; i < this.length; i++) { var k = key.call(this, i); if (k && k.indexOf(P) === 0) mine.push(k); }
    for (var j = 0; j < mine.length; j++) rem.call(this, mine[j]);
  };
  S.__hwNs = P;
  window.HW_STORAGE_NS = P;
})();
