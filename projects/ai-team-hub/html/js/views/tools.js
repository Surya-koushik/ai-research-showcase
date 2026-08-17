import { store } from '../store.js';
import { $, html, modal, confirmDialog, toast, escapeHtml, statusBadge } from '../utils.js';
import { router } from '../router.js';

function toolForm(existing, onSave) {
  const t = existing || {};
  const form = html('form', { class: 'form', onSubmit: e => e.preventDefault() });
  form.innerHTML = `
    <div class="form-group">
      <label>Tool Name *</label>
      <input name="name" class="input" value="${escapeHtml(t.name || '')}" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Category</label>
        <select name="category" class="input">
          ${store.data.categories.map(c => `<option value="${c}" ${t.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select name="status" class="input">
          <option value="ready" ${t.status === 'ready' ? 'selected' : ''}>Ready to Use</option>
          <option value="beta" ${t.status === 'beta' ? 'selected' : ''}>Beta / Testing</option>
          <option value="development" ${t.status === 'development' ? 'selected' : ''}>In Development</option>
          <option value="deprecated" ${t.status === 'deprecated' ? 'selected' : ''}>Deprecated</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="description" class="input" rows="3">${escapeHtml(t.description || '')}</textarea>
    </div>
    <div class="form-group">
      <label>Server Path / Location</label>
      <input name="serverPath" class="input" value="${escapeHtml(t.serverPath || '')}" placeholder="Z:\\path\\to\\tool">
    </div>
    <div class="form-group">
      <label>Setup Instructions</label>
      <textarea name="setup" class="input" rows="3">${escapeHtml(t.setup || '')}</textarea>
    </div>

    <h4>Resources</h4>
    <div id="tool-resources"></div>
    <button type="button" class="btn btn-sm" id="add-tool-res">+ Add Resource</button>

    <div class="modal-footer" style="margin-top:1rem">
      <button type="button" class="btn btn-primary" id="save-btn">Save</button>
    </div>
  `;

  const resources = [...(t.resources || [])];
  const resList = form.querySelector('#tool-resources');
  function renderRes() {
    resList.innerHTML = '';
    resources.forEach((r, i) => {
      const row = html('div', { class: 'form-row resource-row', style: { alignItems: 'end' } });
      row.innerHTML = `
        <div class="form-group" style="flex:0 0 120px">
          <select class="input res-type">
            <option value="youtube" ${r.type === 'youtube' ? 'selected' : ''}>YouTube</option>
            <option value="server" ${r.type === 'server' ? 'selected' : ''}>Server Path</option>
            <option value="link" ${r.type === 'link' ? 'selected' : ''}>Link</option>
            <option value="document" ${r.type === 'document' ? 'selected' : ''}>Document</option>
          </select>
        </div>
        <div class="form-group" style="flex:1">
          <input class="input res-title" placeholder="Title" value="${escapeHtml(r.title || '')}">
        </div>
        <div class="form-group" style="flex:2">
          <input class="input res-url" placeholder="URL / Path" value="${escapeHtml(r.url || '')}">
        </div>
      `;
      row.appendChild(html('button', { type: 'button', class: 'btn-icon btn-danger-text', onClick: () => { resources.splice(i, 1); renderRes(); } }, ['×']));
      resList.appendChild(row);
    });
  }
  renderRes();
  form.querySelector('#add-tool-res').addEventListener('click', () => { resources.push({ type: 'link', title: '', url: '' }); renderRes(); });

  form.querySelector('#save-btn').addEventListener('click', () => {
    const fd = new FormData(form);
    const finalRes = [];
    resList.querySelectorAll('.resource-row').forEach(row => {
      finalRes.push({ type: row.querySelector('.res-type').value, title: row.querySelector('.res-title').value, url: row.querySelector('.res-url').value });
    });
    const data = { ...Object.fromEntries(fd), resources: finalRes };
    if (!data.name) { toast('Name is required', 'error'); return; }
    onSave(data);
  });
  return form;
}

export function renderTools(container, param) {
  if (param) return renderToolDetail(container, param);

  const isAdmin = store.isAdmin();
  const tools = store.getTools();

  container.innerHTML = `
    <div class="page-header">
      <h1>Tools</h1>
      <div class="header-actions">
        ${isAdmin ? '<button class="btn btn-primary" id="add-tool">+ Add Tool</button>' : ''}
      </div>
    </div>
    <div class="tools-grid" id="tools-grid"></div>
  `;

  const grid = $('#tools-grid', container);
  if (tools.length === 0) {
    grid.innerHTML = '<p class="empty">No tools registered yet</p>';
  } else {
    tools.forEach(t => {
      const statusColors = { ready: '#22c55e', beta: '#f59e0b', development: '#60a5fa', deprecated: '#94a3b8' };
      const card = html('div', { class: 'card card-clickable', onClick: () => router.navigate('tools/' + t.id) });
      card.innerHTML = `
        <div class="card-header">
          <h3>${escapeHtml(t.name)}</h3>
          <span class="badge" style="--badge-color:${statusColors[t.status] || '#94a3b8'}">${t.status || 'unknown'}</span>
        </div>
        <div class="card-body">
          <div class="list-item-meta">${t.category || ''}</div>
          ${t.description ? `<p>${escapeHtml(t.description).slice(0, 100)}${t.description.length > 100 ? '...' : ''}</p>` : ''}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  if (isAdmin) {
    $('#add-tool', container)?.addEventListener('click', () => {
      const form = toolForm(null, data => {
        store.addTool(data);
        toast('Tool added');
        document.querySelector('.modal-overlay')?.remove();
        renderTools(container);
      });
      modal('Add Tool', form);
    });
  }
}

function renderToolDetail(container, id) {
  const t = store.getTool(id);
  if (!t) { container.innerHTML = '<p class="empty">Tool not found</p>'; return; }

  const isAdmin = store.isAdmin();
  const linkedProcs = store.getProcedures().filter(p => p.toolId === id);
  const statusColors = { ready: '#22c55e', beta: '#f59e0b', development: '#60a5fa', deprecated: '#94a3b8' };

  container.innerHTML = `
    <div class="page-header">
      <button class="btn btn-sm btn-secondary" id="back-btn">&larr; Back</button>
      <div class="header-actions">
        ${isAdmin ? '<button class="btn btn-sm" id="edit-btn">Edit</button>' : ''}
        ${isAdmin ? '<button class="btn btn-sm btn-danger" id="del-btn">Delete</button>' : ''}
      </div>
    </div>
    <div class="detail-card">
      <h2>${escapeHtml(t.name)}</h2>
      <div class="detail-meta">
        <span class="badge" style="--badge-color:${statusColors[t.status] || '#94a3b8'}">${t.status || 'unknown'}</span>
        · ${t.category || ''}
      </div>
      ${t.description ? `<div class="detail-desc">${escapeHtml(t.description)}</div>` : ''}
      ${t.serverPath ? `<div class="server-path"><strong>Location:</strong> <code>${escapeHtml(t.serverPath)}</code></div>` : ''}
      ${t.setup ? `<div class="detail-desc"><strong>Setup:</strong><br>${escapeHtml(t.setup)}</div>` : ''}

      ${t.resources && t.resources.length > 0 ? `
        <h4>Resources</h4>
        <div class="resources-list" id="tool-res"></div>
      ` : ''}

      ${linkedProcs.length > 0 ? `
        <h4>Linked Procedures</h4>
        <div id="linked-procs"></div>
      ` : ''}
    </div>
  `;

  $('#back-btn', container).addEventListener('click', () => router.navigate('tools'));

  if (t.resources && t.resources.length > 0) {
    const resEl = $('#tool-res', container);
    t.resources.forEach(r => {
      const icons = { youtube: '🎬', server: '📂', link: '🔗', document: '📄' };
      resEl.appendChild(html('a', { class: 'resource-item', href: r.url, target: '_blank', rel: 'noopener', html: `<span class="icon">${icons[r.type] || '🔗'}</span> <span>${escapeHtml(r.title || r.url)}</span>` }));
    });
  }

  if (linkedProcs.length > 0) {
    const procsEl = $('#linked-procs', container);
    linkedProcs.forEach(p => {
      procsEl.appendChild(html('div', { class: 'list-item clickable', onClick: () => router.navigate('procedures/' + p.id) }, [
        html('div', { class: 'list-item-content' }, [
          html('div', { class: 'list-item-title' }, [p.title]),
          html('div', { class: 'list-item-meta' }, [`${p.steps?.length || 0} steps`])
        ])
      ]));
    });
  }

  if (isAdmin) {
    $('#edit-btn', container)?.addEventListener('click', () => {
      const form = toolForm(t, data => {
        store.updateTool(id, data);
        toast('Tool updated');
        document.querySelector('.modal-overlay')?.remove();
        renderToolDetail(container, id);
      });
      modal('Edit Tool', form);
    });
    $('#del-btn', container)?.addEventListener('click', async () => {
      if (await confirmDialog(`Delete tool "${t.name}"?`)) {
        store.deleteTool(id);
        toast('Deleted');
        router.navigate('tools');
      }
    });
  }
}
