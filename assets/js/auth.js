/* Auth gate for the AI Research Showcase.
 * - Inactive while supabase-config.js still holds the placeholder anon key
 *   (so local preview never locks you out).
 * - When a real anon key is present: unauthenticated visitors are redirected
 *   to login.html; a Sign-out button is injected into the rail. */
(function () {
  var cfg = window.SB_CONFIG || {};
  var active = cfg.url && cfg.anon && cfg.anon.indexOf('PASTE_') !== 0;
  var page = (location.pathname.split('/').pop() || 'index.html');
  var onLogin = page === 'login.html';

  if (!active) {
    if (!onLogin) console.info('[auth] Supabase gate OFF — paste the anon key in assets/js/supabase-config.js to enable the login gate.');
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    console.warn('[auth] supabase-js failed to load; gate inactive this load.');
    return;
  }

  var client = window.supabase.createClient(cfg.url, cfg.anon, { auth: { persistSession: true, autoRefreshToken: true } });
  window.adsAuth = {
    client: client, user: null,
    signOut: function () { client.auth.signOut().then(function () { location.href = 'login.html'; }); }
  };
  if (onLogin) return; // login page manages its own flow

  // hide body until the session is known, so gated content never flashes
  var hide = document.createElement('style');
  hide.id = 'authhide'; hide.textContent = 'body{visibility:hidden}';
  document.head.appendChild(hide);
  var reveal = function () { var h = document.getElementById('authhide'); if (h) h.remove(); };

  client.auth.getSession().then(function (res) {
    var sess = res && res.data && res.data.session;
    if (!sess) { location.replace('login.html?next=' + encodeURIComponent(location.pathname + location.search)); return; }
    window.adsAuth.user = sess.user;
    reveal();
    injectSignOut(sess.user);
  }).catch(reveal);
  setTimeout(reveal, 4000); // never leave the page stuck hidden

  function injectSignOut(user) {
    var foot = document.querySelector('.rail-foot');
    if (!foot || document.getElementById('signOutBtn')) return;
    var b = document.createElement('button');
    b.id = 'signOutBtn'; b.className = 'btn icon ghost';
    b.title = 'Sign out' + (user && user.email ? ' (' + user.email + ')' : '');
    b.setAttribute('aria-label', 'Sign out');
    b.textContent = '⎋';
    b.onclick = function () { window.adsAuth.signOut(); };
    foot.insertBefore(b, foot.firstChild);
  }
})();
