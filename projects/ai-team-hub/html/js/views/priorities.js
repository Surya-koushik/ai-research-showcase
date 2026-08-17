import { store } from '../store.js';
import { $, html, levelBadge, statusBadge, timeAgo, modal, confirmDialog, toast, escapeHtml } from '../utils.js';
import { router } from '../router.js';

function priorityForm(existing, onSave) {
  const isAdmin = store.isAdmin();
  const teams = store.getTeams();
  const members = store.getMembers();
  const procedures = store.getProcedures();
  const p = existing || {};

  const form = html('form', { class: 'form', onSubmit: e => e.preventDefault() });
  form.innerHTML = `
    <div class="form-group">
      <label>Title *</label>
      <input name="title" class="input" value="${escapeHtml(p.title || '')}" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Priority Level</label>
        <select name="level" class="input">
          <option value="low" ${p.level === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${p.level === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${p.level === 'high' ? 'selected' : ''}>High</option>
          <option value="critical" ${p.level === 'critical' ? 'selected' : ''}>Critical</option>
        </select>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select name="status" class="input">
          ${store.data.statuses.map(s => `<option value="${s}" ${p.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Team</label>
        <select name="teamId" class="input">
          <option value="">— Select —</option>
          ${teams.map(t => `<option value="${t.id}" ${p.teamId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Assignee</label>
        <select name="assigneeId" class="input">
          <option value="">— Unassigned —</option>
          ${members.map(m => `<option value="${m.id}" ${p.assigneeId === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Due Date</label>
      <input type="date" name="dueDate" class="input" value="${p.dueDate || ''}">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="description" class="input" rows="3">${escapeHtml(p.description || '')}</textarea>
    </div>
    <div class="form-group">
      <label>Linked Procedure</label>
      <select name="procedureId" class="input">
        <option value="">— None —</option>
        ${procedures.map(pr => `<option value="${pr.id}" ${p.procedureId === pr.id ? 'selected' : ''}>${pr.title}</option>`).join('')}
      </select>
    </div>
    <h4 style="margin-top:1rem">Resources</h4>
    <div id="resources-list"></div>
    <button type="button" class="btn btn-sm" id="add-resource">+ Add Resource</button>
    <div class="modal-footer" style="margin-top:1rem">
      <button type="button" class="btn btn-primary" id="save-btn">Save</button>
    </div>
  `;

  const resList = form.querySelector('#resources-list');
  const resources = [...(p.resources || [])];

  function renderResources() {
    resList.innerHTML = '';
    resources.forEach((r, i) => {
      const row = html('div', { class: 'form-row resource-row', style: { alignItems: 'end' } });
      row.innerHTML = `
        <div class="form-group" style="flex:0 0 120px">
          <select class="input res-type" data-i="${i}">
            <option value="youtube" ${r.type === 'youtube' ? 'selected' : ''}>YouTube</option>
            <option value="server" ${r.type === 'server' ? 'selected' : ''}>Server Path</option>
            <option value="link" ${r.type === 'link' ? 'selected' : ''}>Link</option>
            <option value="document" ${r.type === 'document' ? 'selected' : ''}>Document</option>
          </select>
        </div>
        <div class="form-group" style="flex:1">
          <input class="input res-title" placeholder="Title" value="${escapeHtml(r.title || '')}" data-i="${i}">
        </div>
        <div class="form-group" style="flex:2">
          <input class="input res-url" placeholder="URL / Path" value="${escapeHtml(r.url || '')}" data-i="${i}">
        </div>
      `;
      const del = html('button', { type: 'button', class: 'btn-icon btn-danger-text', onClick: () => { resources.splice(i, 1); renderResources(); } }, ['×']);
      row.appendChild(del);
      resList.appendChild(row);
    });
  }
  renderResources();

  form.querySelector('#add-resource').addEventListener('click', () => {
    resources.push({ type: 'link', title: '', url: '' });
    renderResources();
  });

  form.querySelector('#save-btn').addEventListener('click', () => {
    const fd = new FormData(form);
    // Collect resources from DOM
    const finalRes = [];
    resList.querySelectorAll('.resource-row').forEach((row, i) => {
      finalRes.push({
        type: row.querySelector('.res-type').value,
        title: row.querySelector('.res-title').value,
        url: row.querySelector('.res-url').value
      });
    });

    const data = {
      title: fd.get('title'),
      level: fd.get('level'),
      status: fd.get('status'),
      teamId: fd.get('teamId'),
      assigneeId: fd.get('assigneeId'),
      dueDate: fd.get('dueDate'),
      description: fd.get('description'),
      procedureId: fd.get('procedureId'),
      resources: finalRes,
      createdBy: existing ? existing.createdBy : (store.isAdmin() ? 'admin' : store.getCurrentUser())
    };
    if (!data.title) { toast('Title is required', 'error'); return; }
    onSave(data);
  });

  return form;
}

export function renderPriorities(container, param) {
  if (param) return renderPriorityDetail(container, param);

  const isAdmin = store.isAdmin();
  const priorities = store.getPriorities();
  const teams = store.getTeams();
  const members = store.getMembers();

  container.innerHTML = `
    <div class="page-header">
      <h1>Priorities</h1>
      <div class="header-actions">
        <button class="btn btn-primary" id="add-priority">+ New Priority</button>
      </div>
    </div>
    <div class="filters" id="priority-filters">
      <select class="input input-sm" id="filter-team">
        <option value="">All Teams</option>
        ${teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
      </select>
      <select class="input input-sm" id="filter-status">
        <option value="">All Statuses</option>
        ${store.data.statuses.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
      <select class="input input-sm" id="filter-level">
        <option value="">All Levels</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
    <div class="table-wrap">
      <table class="table" id="priorities-table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Level</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Team</th>
            <th>Due</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody id="priorities-body"></tbody>
      </table>
    </div>
  `;

  function renderTable(filters = {}) {
    const list = store.getPriorities(filters);
    const tbody = $('#priorities-body', container);
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">No priorities found</td></tr>';
      return;
    }
    list.forEach(p => {
      const member = store.getMember(p.assigneeId);
      const team = teams.find(t => t.id === p.teamId);
      const tr = html('tr', { class: 'clickable', onClick: () => router.navigate('priorities/' + p.id) });
      tr.innerHTML = `
        <td><strong>${escapeHtml(p.title)}</strong></td>
        <td>${levelBadge(p.level)}</td>
        <td>${statusBadge(p.status)}</td>
        <td>${member ? escapeHtml(member.name) : '<em>Unassigned</em>'}</td>
        <td>${team ? `<span class="team-dot" style="background:${team.color}"></span> ${escapeHtml(team.name)}` : '—'}</td>
        <td>${p.dueDate || '—'}</td>
        <td>${timeAgo(p.updatedAt)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderTable();

  // Filters
  const filterEls = ['filter-team', 'filter-status', 'filter-level'];
  filterEls.forEach(id => {
    $(`#${id}`, container).addEventListener('change', () => {
      renderTable({
        teamId: $('#filter-team', container).value || undefined,
        status: $('#filter-status', container).value || undefined,
        level: $('#filter-level', container).value || undefined
      });
    });
  });

  // Add priority
  $('#add-priority', container).addEventListener('click', () => {
    const form = priorityForm(null, data => {
      store.addPriority(data);
      toast('Priority created');
      document.querySelector('.modal-overlay')?.remove();
      renderPriorities(container);
    });
    modal('New Priority', form);
  });
}

function renderPriorityDetail(container, id) {
  const p = store.getPriority(id);
  if (!p) { container.innerHTML = '<p class="empty">Priority not found</p>'; return; }

  const isAdmin = store.isAdmin();
  const member = store.getMember(p.assigneeId);
  const team = store.getTeams().find(t => t.id === p.teamId);
  const procedure = p.procedureId ? store.getProcedure(p.procedureId) : null;
  const canEdit = isAdmin || p.createdBy === store.getCurrentUser() || p.assigneeId === store.getCurrentUser();

  container.innerHTML = `
    <div class="page-header">
      <button class="btn btn-sm btn-secondary" id="back-btn">&larr; Back</button>
      <div class="header-actions">
        ${canEdit ? '<button class="btn btn-sm" id="edit-btn">Edit</button>' : ''}
        ${isAdmin ? '<button class="btn btn-sm btn-danger" id="del-btn">Delete</button>' : ''}
      </div>
    </div>
    <div class="detail-card">
      <h2>${escapeHtml(p.title)}</h2>
      <div class="detail-meta">
        ${levelBadge(p.level)} ${statusBadge(p.status)}
        ${team ? `<span class="team-dot" style="background:${team.color}"></span> ${escapeHtml(team.name)}` : ''}
        · Assigned to: <strong>${member ? escapeHtml(member.name) : 'Unassigned'}</strong>
        ${p.dueDate ? ` · Due: <strong>${p.dueDate}</strong>` : ''}
      </div>
      ${p.description ? `<div class="detail-desc">${escapeHtml(p.description)}</div>` : ''}

      ${p.resources && p.resources.length > 0 ? `
        <h4>Resources</h4>
        <div class="resources-list" id="res-list"></div>
      ` : ''}

      ${procedure ? `
        <h4>Linked Procedure</h4>
        <div class="procedure-link clickable" id="goto-proc">
          <span class="icon">📋</span> ${escapeHtml(procedure.title)}
        </div>
      ` : ''}

      <h4>Comments</h4>
      <div id="comments-list" class="comments"></div>
      <div class="comment-form">
        <textarea class="input" id="comment-text" rows="2" placeholder="Add a comment..."></textarea>
        <button class="btn btn-sm" id="add-comment">Post</button>
      </div>
    </div>
  `;

  $('#back-btn', container).addEventListener('click', () => router.navigate('priorities'));

  // Resources
  if (p.resources && p.resources.length > 0) {
    const resList = $('#res-list', container);
    p.resources.forEach(r => {
      const icons = { youtube: '🎬', server: '📂', link: '🔗', document: '📄' };
      const el = html('a', {
        class: 'resource-item',
        href: r.url,
        target: '_blank',
        rel: 'noopener'
      });
      el.innerHTML = `<span class="icon">${icons[r.type] || '🔗'}</span> <span>${escapeHtml(r.title || r.url)}</span> <span class="resource-type">${r.type}</span>`;
      resList.appendChild(el);
    });
  }

  // Procedure link
  if (procedure) {
    $('#goto-proc', container)?.addEventListener('click', () => router.navigate('procedures/' + procedure.id));
  }

  // Comments
  const commentsList = $('#comments-list', container);
  function renderComments() {
    commentsList.innerHTML = '';
    (p.comments || []).forEach((c, i) => {
      const cmem = store.getMember(c.authorId);
      commentsList.appendChild(html('div', { class: 'comment' }, [
        html('div', { class: 'comment-header' }, [
          html('strong', {}, [cmem ? cmem.name : (c.authorId === 'admin' ? 'Admin' : 'Unknown')]),
          html('span', { class: 'comment-time' }, [timeAgo(c.createdAt)])
        ]),
        html('div', { class: 'comment-body' }, [c.text])
      ]));
    });
    if ((p.comments || []).length === 0) commentsList.innerHTML = '<p class="empty">No comments yet</p>';
  }
  renderComments();

  $('#add-comment', container).addEventListener('click', () => {
    const text = $('#comment-text', container).value.trim();
    if (!text) return;
    if (!p.comments) p.comments = [];
    p.comments.push({ text, authorId: store.isAdmin() ? 'admin' : store.getCurrentUser(), createdAt: new Date().toISOString() });
    store.updatePriority(p.id, { comments: p.comments });
    $('#comment-text', container).value = '';
    renderComments();
  });

  // Edit
  if (canEdit) {
    $('#edit-btn', container)?.addEventListener('click', () => {
      const form = priorityForm(p, data => {
        store.updatePriority(p.id, data);
        toast('Priority updated');
        document.querySelector('.modal-overlay')?.remove();
        renderPriorityDetail(container, id);
      });
      modal('Edit Priority', form);
    });
  }

  // Delete
  if (isAdmin) {
    $('#del-btn', container)?.addEventListener('click', async () => {
      if (await confirmDialog('Delete this priority?')) {
        store.deletePriority(id);
        toast('Deleted');
        router.navigate('priorities');
      }
    });
  }
}
