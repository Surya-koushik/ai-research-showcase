import { store } from '../store.js';
import { $, html, levelBadge, statusBadge, timeAgo, modal, confirmDialog, toast, escapeHtml } from '../utils.js';
import { router } from '../router.js';

function requirementForm(existing, onSave) {
  const members = store.getMembers();
  const r = existing || {};
  const form = html('form', { class: 'form', onSubmit: e => e.preventDefault() });
  form.innerHTML = `
    <div class="form-group">
      <label>Title *</label>
      <input name="title" class="input" value="${escapeHtml(r.title || '')}" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>From Team / Department</label>
        <input name="fromTeam" class="input" value="${escapeHtml(r.fromTeam || '')}" placeholder="e.g. Design, Structural">
      </div>
      <div class="form-group">
        <label>Priority</label>
        <select name="priority" class="input">
          <option value="low" ${r.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${r.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${r.priority === 'high' ? 'selected' : ''}>High</option>
          <option value="critical" ${r.priority === 'critical' ? 'selected' : ''}>Critical</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Status</label>
        <select name="status" class="input">
          <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="assigned" ${r.status === 'assigned' ? 'selected' : ''}>Assigned</option>
          <option value="in-progress" ${r.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed" ${r.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </div>
      <div class="form-group">
        <label>Assign To</label>
        <select name="assigneeId" class="input">
          <option value="">— Unassigned —</option>
          ${members.map(m => `<option value="${m.id}" ${r.assigneeId === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Due Date</label>
      <input type="date" name="dueDate" class="input" value="${r.dueDate || ''}">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="description" class="input" rows="3">${escapeHtml(r.description || '')}</textarea>
    </div>
    <div class="form-group">
      <label>Requester Name</label>
      <input name="requester" class="input" value="${escapeHtml(r.requester || '')}">
    </div>
    <div class="modal-footer" style="margin-top:1rem">
      <button type="button" class="btn btn-primary" id="save-btn">Save</button>
    </div>
  `;

  form.querySelector('#save-btn').addEventListener('click', () => {
    const fd = new FormData(form);
    const data = Object.fromEntries(fd);
    if (!data.title) { toast('Title is required', 'error'); return; }
    onSave(data);
  });
  return form;
}

export function renderRequirements(container) {
  const isAdmin = store.isAdmin();
  const requirements = store.getRequirements();
  const members = store.getMembers();

  container.innerHTML = `
    <div class="page-header">
      <h1>Requirements</h1>
      <div class="header-actions">
        <button class="btn btn-primary" id="add-req">+ New Requirement</button>
      </div>
    </div>
    <div class="filters">
      <select class="input input-sm" id="filter-status">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="assigned">Assigned</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    <div class="table-wrap">
      <table class="table" id="req-table">
        <thead>
          <tr>
            <th>Requirement</th>
            <th>From</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="req-body"></tbody>
      </table>
    </div>
  `;

  function renderTable(status) {
    const list = status ? store.getRequirements({ status }) : requirements;
    const tbody = $('#req-body', container);
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">No requirements found</td></tr>';
      return;
    }
    list.forEach(r => {
      const member = store.getMember(r.assigneeId);
      const tr = html('tr');
      tr.innerHTML = `
        <td>
          <strong>${escapeHtml(r.title)}</strong>
          ${r.description ? `<div class="list-item-meta">${escapeHtml(r.description).slice(0, 80)}</div>` : ''}
        </td>
        <td>${escapeHtml(r.fromTeam || '—')}</td>
        <td>${levelBadge(r.priority)}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${member ? escapeHtml(member.name) : '<em>Unassigned</em>'}</td>
        <td>${r.dueDate || '—'}</td>
        <td class="actions-cell"></td>
      `;
      const actionsCell = tr.querySelector('.actions-cell');
      if (isAdmin) {
        actionsCell.appendChild(html('button', { class: 'btn-icon', title: 'Edit', onClick: e => {
          e.stopPropagation();
          const form = requirementForm(r, data => {
            store.updateRequirement(r.id, data);
            toast('Updated');
            document.querySelector('.modal-overlay')?.remove();
            renderTable(status);
          });
          modal('Edit Requirement', form);
        } }, ['✏']));
        actionsCell.appendChild(html('button', { class: 'btn-icon btn-danger-text', title: 'Delete', onClick: async e => {
          e.stopPropagation();
          if (await confirmDialog('Delete this requirement?')) {
            store.deleteRequirement(r.id);
            toast('Deleted');
            renderTable(status);
          }
        } }, ['×']));
      }
      if (!isAdmin && r.status === 'assigned' && r.assigneeId === store.getCurrentUser()) {
        actionsCell.appendChild(html('button', { class: 'btn btn-sm', onClick: e => {
          e.stopPropagation();
          store.updateRequirement(r.id, { status: 'in-progress' });
          toast('Started');
          renderTable(status);
        } }, ['Start']));
      }

      // Convert to priority
      if (isAdmin && r.status !== 'completed') {
        actionsCell.appendChild(html('button', { class: 'btn-icon', title: 'Convert to Priority', onClick: e => {
          e.stopPropagation();
          store.addPriority({
            title: r.title,
            description: `[From ${r.fromTeam || 'external'}] ${r.description || ''}`,
            level: r.priority,
            status: 'todo',
            assigneeId: r.assigneeId,
            createdBy: 'admin'
          });
          store.updateRequirement(r.id, { status: 'assigned' });
          toast('Converted to priority');
          renderTable(status);
        } }, ['➜']));
      }

      tbody.appendChild(tr);
    });
  }
  renderTable();

  $('#filter-status', container).addEventListener('change', e => renderTable(e.target.value || null));

  $('#add-req', container).addEventListener('click', () => {
    const form = requirementForm(null, data => {
      store.addRequirement(data);
      toast('Requirement added');
      document.querySelector('.modal-overlay')?.remove();
      renderRequirements(container);
    });
    modal('New Requirement', form);
  });
}
