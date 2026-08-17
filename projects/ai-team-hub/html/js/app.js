import { store } from './store.js';
import { router } from './router.js';
import { $ } from './utils.js';
import { renderDashboard } from './views/dashboard.js';
import { renderPriorities } from './views/priorities.js';
import { renderTeam } from './views/team.js';
import { renderProcedures } from './views/procedures.js';
import { renderTools } from './views/tools.js';
import { renderRequirements } from './views/requirements.js';
import { renderSettings } from './views/settings.js';

const main = $('#main-content');

function render(viewFn, param) {
  main.innerHTML = '';
  viewFn(main, param);
  window.scrollTo(0, 0);
}

router.on('dashboard', () => render(renderDashboard));
router.on('priorities', p => render(renderPriorities, p));
router.on('team', p => render(renderTeam, p));
router.on('procedures', p => render(renderProcedures, p));
router.on('tools', p => render(renderTools, p));
router.on('requirements', () => render(renderRequirements));
router.on('settings', () => render(renderSettings));

// Update role indicator
function updateRoleUI() {
  const roleEl = $('#role-indicator');
  if (roleEl) {
    roleEl.textContent = store.isAdmin() ? 'Admin' : 'User';
    roleEl.className = `role-badge ${store.isAdmin() ? 'role-admin' : 'role-user'}`;
  }
}
store.on(updateRoleUI);

// Sidebar toggle for mobile
$('#sidebar-toggle')?.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});

// Close sidebar on nav click (mobile)
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('open');
  });
});

// Init
updateRoleUI();
if (!store.isAdmin() && localStorage.getItem('aith_role') === null) {
  store.setAdmin(true);
}
router.resolve();
