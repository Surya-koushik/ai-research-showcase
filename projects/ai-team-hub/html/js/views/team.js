import { store } from '../store.js';
import { $, html, statusBadge, timeAgo, modal, confirmDialog, toast, escapeHtml } from '../utils.js';
import { router } from '../router.js';

function memberForm(existing, onSave) {
  const teams = store.getTeams();
  const m = existing || {};
  const form = html('form', { class: 'form', onSubmit: e => e.preventDefault() });
  form.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label>Name *</label>
        <input name="name" class="input" value="${escapeHtml(m.name || '')}" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input name="email" class="input" type="email" value="${escapeHtml(m.email || '')}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Team</label>
        <select name="teamId" class="input">
          <option value="">— Select —</option>
          ${teams.map(t => `<option value="${t.id}" ${m.teamId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Role</label>
        <input name="role" class="input" value="${escapeHtml(m.role || '')}" placeholder="e.g. BIM Modeler">
      </div>
    </div>
    <div class="form-group">
      <label>Focus Area</label>
      <input name="focus" class="input" value="${escapeHtml(m.focus || '')}" placeholder="Current main focus or experiment">
    </div>
    <div class="form-group">
      <label>Notes</label>
      <textarea name="notes" class="input" rows="2">${escapeHtml(m.notes || '')}</textarea>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" id="save-btn">Save</button>
    </div>
  `;

  form.querySelector('#save-btn').addEventListener('click', () => {
    const fd = new FormData(form);
    const data = Object.fromEntries(fd);
    if (!data.name) { toast('Name is required', 'error'); return; }
    onSave(data);
  });
  return form;
}

export function renderTeam(container, param) {
  if (param) return renderMemberDetail(container, param);

  const isAdmin = store.isAdmin();
  const members = store.getMembers();
  const teams = store.getTeams();
  const priorities = store.getPriorities();

  container.innerHTML = `
    <div class="page-header">
      <h1>Team</h1>
      <div class="header-actions">
        ${isAdmin ? '<button class="btn btn-primary" id="add-member">+ Add Member</button>' : ''}
        ${isAdmin ? '<button class="btn btn-sm" id="manage-teams">Manage Teams</button>' : ''}
      </div>
    </div>
    <div class="team-grid" id="team-grid"></div>
  `;

  const grid = $('#team-grid', container);

  teams.forEach(team => {
    const teamMembers = members.filter(m => m.teamId === team.id);
    const section = html('div', { class: 'card' });
    section.innerHTML = `<div class="card-header"><h3><span class="team-dot" style="background:${team.color}"></span> ${escapeHtml(team.name)}</h3><span class="badge-count">${teamMembers.length}</span></div>`;
    const body = html('div', { class: 'card-body' });

    if (teamMembers.length === 0) {
      body.innerHTML = '<p class="empty">No members in this team</p>';
    } else {
      teamMembers.forEach(m => {
        const mp = priorities.filter(p => p.assigneeId === m.id && p.status !== 'done');
        const current = mp.find(p => p.status === 'in-progress');
        body.appendChild(html('div', { class: 'list-item clickable', onClick: () => router.navigate('team/' + m.id) }, [
          html('div', { class: 'avatar', style: { background: team.color } }, [m.name.charAt(0).toUpperCase()]),
          html('div', { class: 'list-item-content' }, [
            html('div', { class: 'list-item-title' }, [m.name]),
            html('div', { class: 'list-item-meta' }, [m.focus || m.role || '']),
            html('div', { class: 'list-item-meta' }, [
              current ? `Working: ${current.title}` : `${mp.length} pending`
            ])
          ])
        ]));
      });
    }
    section.appendChild(body);
    grid.appendChild(section);
  });

  // Unassigned members
  const unassigned = members.filter(m => !m.teamId);
  if (unassigned.length > 0) {
    const section = html('div', { class: 'card' });
    section.innerHTML = '<div class="card-header"><h3>Unassigned</h3></div>';
    const body = html('div', { class: 'card-body' });
    unassigned.forEach(m => {
      body.appendChild(html('div', { class: 'list-item clickable', onClick: () => router.navigate('team/' + m.id) }, [
        html('div', { class: 'avatar' }, [m.name.charAt(0).toUpperCase()]),
        html('div', { class: 'list-item-content' }, [
          html('div', { class: 'list-item-title' }, [m.name]),
          html('div', { class: 'list-item-meta' }, [m.role || ''])
        ])
      ]));
    });
    section.appendChild(body);
    grid.appendChild(section);
  }

  // Add member
  if (isAdmin) {
    $('#add-member', container)?.addEventListener('click', () => {
      const form = memberForm(null, data => {
        store.addMember(data);
        toast('Member added');
        document.querySelector('.modal-overlay')?.remove();
        renderTeam(container);
      });
      modal('Add Team Member', form);
    });

    $('#manage-teams', container)?.addEventListener('click', () => {
      const content = html('div', { class: 'form' });
      function renderTeamsList() {
        content.innerHTML = '';
        store.getTeams().forEach(t => {
          content.appendChild(html('div', { class: 'list-item', style: { padding: '0.5rem 0' } }, [
            html('span', { class: 'team-dot', style: { background: t.color } }),
            html('input', { class: 'input input-sm', value: t.name, style: { flex: '1', margin: '0 0.5rem' },
              onChange: e => { store.updateTeam(t.id, { name: e.target.value }); }
            }),
            html('input', { type: 'color', value: t.color, style: { width: '36px', border: 'none' },
              onChange: e => { store.updateTeam(t.id, { color: e.target.value }); }
            }),
            html('button', { class: 'btn-icon btn-danger-text', onClick: async () => {
              if (await confirmDialog(`Delete team "${t.name}"?`)) { store.deleteTeam(t.id); renderTeamsList(); }
            } }, ['×'])
          ]));
        });
        const addRow = html('div', { style: { marginTop: '0.5rem' } });
        addRow.innerHTML = '<input class="input input-sm" placeholder="New team name" id="new-team-name" style="width:60%;margin-right:0.5rem"><button class="btn btn-sm" id="add-team-btn">Add</button>';
        content.appendChild(addRow);
        content.querySelector('#add-team-btn').addEventListener('click', () => {
          const name = content.querySelector('#new-team-name').value.trim();
          if (name) { store.addTeam({ name, color: '#6366f1' }); renderTeamsList(); }
        });
      }
      renderTeamsList();
      modal('Manage Teams', content);
    });
  }
}

function renderMemberDetail(container, id) {
  const m = store.getMember(id);
  if (!m) { container.innerHTML = '<p class="empty">Member not found</p>'; return; }

  const isAdmin = store.isAdmin();
  const team = store.getTeams().find(t => t.id === m.teamId);
  const priorities = store.getPriorities({ assigneeId: id });
  const tools = store.getTools();

  container.innerHTML = `
    <div class="page-header">
      <button class="btn btn-sm btn-secondary" id="back-btn">&larr; Back</button>
      <div class="header-actions">
        ${isAdmin ? '<button class="btn btn-sm" id="edit-btn">Edit</button>' : ''}
        ${isAdmin ? '<button class="btn btn-sm btn-danger" id="del-btn">Delete</button>' : ''}
      </div>
    </div>
    <div class="detail-card">
      <div class="member-header">
        <div class="avatar avatar-lg" style="background:${team?.color || '#6366f1'}">${m.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2>${escapeHtml(m.name)}</h2>
          <div class="detail-meta">
            ${team ? `<span class="team-dot" style="background:${team.color}"></span> ${escapeHtml(team.name)}` : ''}
            ${m.role ? ` · ${escapeHtml(m.role)}` : ''}
            ${m.email ? ` · ${escapeHtml(m.email)}` : ''}
          </div>
          ${m.focus ? `<div class="detail-desc"><strong>Focus:</strong> ${escapeHtml(m.focus)}</div>` : ''}
          ${m.notes ? `<div class="detail-desc">${escapeHtml(m.notes)}</div>` : ''}
        </div>
      </div>

      <h4>Assigned Priorities (${priorities.length})</h4>
      <div id="member-priorities"></div>

      <h4>Available Tools</h4>
      <div id="member-tools"></div>
    </div>
  `;

  $('#back-btn', container).addEventListener('click', () => router.navigate('team'));

  // Priorities
  const prioEl = $('#member-priorities', container);
  if (priorities.length === 0) {
    prioEl.innerHTML = '<p class="empty">No priorities assigned</p>';
  } else {
    priorities.forEach(p => {
      prioEl.appendChild(html('div', { class: 'list-item clickable', onClick: () => router.navigate('priorities/' + p.id) }, [
        html('div', { class: 'list-item-content', html: `
          <div class="list-item-title">${escapeHtml(p.title)}</div>
          <div class="list-item-meta">${statusBadge(p.status)} · ${timeAgo(p.updatedAt)}</div>
        ` })
      ]));
    });
  }

  // Tools
  const toolsEl = $('#member-tools', container);
  if (tools.length === 0) {
    toolsEl.innerHTML = '<p class="empty">No tools registered</p>';
  } else {
    tools.forEach(t => {
      toolsEl.appendChild(html('div', { class: 'list-item clickable', onClick: () => router.navigate('tools/' + t.id) }, [
        html('div', { class: 'list-item-content' }, [
          html('div', { class: 'list-item-title' }, [t.name]),
          html('div', { class: 'list-item-meta' }, [t.category || ''])
        ])
      ]));
    });
  }

  if (isAdmin) {
    $('#edit-btn', container)?.addEventListener('click', () => {
      const form = memberForm(m, data => {
        store.updateMember(id, data);
        toast('Member updated');
        document.querySelector('.modal-overlay')?.remove();
        renderMemberDetail(container, id);
      });
      modal('Edit Member', form);
    });
    $('#del-btn', container)?.addEventListener('click', async () => {
      if (await confirmDialog(`Delete member "${m.name}"?`)) {
        store.deleteMember(id);
        toast('Deleted');
        router.navigate('team');
      }
    });
  }
}
