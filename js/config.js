/* Site settings. backend = the teacher's Apps Script web-app URL (backend/Code.gs). Leave it empty to run in
 * practice mode (no sign-in; work is saved on the device only). */
var HW_CONFIG = {
  siteName: 'Math 10-3 Practice',
  /* The teacher, as students and families see it: the home page's email button, the certification cards, the project
   * hand-in messages and the Teacher Ledger's "Email home" sign-off. Empty = "your teacher" and no email button. */
  teacher: { name: 'Mr. Cathcart', fullName: 'Ryan Cathcart', email: 'rcathcart@rvschools.ab.ca', school: 'W.H. Croxford High School' },
  /* hub: true = bell times, days off and each class's block come from the Teaching Hub (a separate site). false = they
   * are set right here, in the Teacher Ledger (Settings and the Calendar tab). */
  hub: true,
  backend: 'https://script.google.com/macros/s/AKfycbzW-t5f4Wnkt-poSNseXhgiziL28_vENKoDmWSm6Vb-sZDGdUWoGlXewD3gAD7FnG88/exec'
};
