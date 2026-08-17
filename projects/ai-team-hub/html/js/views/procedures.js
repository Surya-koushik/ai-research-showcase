import { store } from '../store.js';
import { $, html, modal, confirmDialog, toast, escapeHtml, formatDate } from '../utils.js';
import { router } from '../router.js';

function procedureForm(existing, onSave) {
  const p = existing || {};
  const steps = [...(p.steps || [{ text: '' }])];

  const form = html('form', { class: 'form', onSubmit: e => e.preventDefault() });
  form.innerHTML = `
    <div class="form-group">
      <label>Title *</label>
      <input name="title" class="input" value="${escapeHtml(p.title || '')}" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Category</label>
        <select name="category" class="input">
          ${store.data.categories.map(c => `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Related Tool</label>
        <select name="toolId" class="input">
          <option value="">— None —</option>
          ${store.getTools().map(t => `<option value="${t.id}" ${p.toolId === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Overview</label>
      <textarea name="overview" class="input" rows="2">${escapeHtml(p.overview || '')}</textarea>
    </div>
    <h4>Steps</h4>
    <div id="steps-list"></div>
    <button type="button" class="btn btn-sm" id="add-step">+ Add Step</button>

    <h4 style="margin-top:1rem">Resources</h4>
    <div id="proc-resources"></div>
    <button type="button" class="btn btn-sm" id="add-proc-res">+ Add Resource</button>

    <div class="modal-footer" style="margin-top:1rem">
      <button type="button" class="btn btn-primary" id="save-btn">Save</button>
    </div>
  `;

  const stepsList = form.querySelector('#steps-list');
  function renderSteps() {
    stepsList.innerHTML = '';
    steps.forEach((s, i) => {
      const row = html('div', { class: 'step-row' });
      row.innerHTML = `
        <span class="step-number">${i + 1}</span>
        <textarea class="input step-text" rows="2" data-i="${i}" placeholder="Step ${i + 1} instructions...">${escapeHtml(s.text || '')}</textarea>
      `;
      const del = html('button', { type: 'button', class: 'btn-icon btn-danger-text', onClick: () => { steps.splice(i, 1); renderSteps(); } }, ['×']);
      row.appendChild(del);
      stepsList.appendChild(row);
    });
  }
  renderSteps();

  form.querySelector('#add-step').addEventListener('click', () => {
    steps.push({ text: '' });
    renderSteps();
  });

  const resources = [...(p.resources || [])];
  const resList = form.querySelector('#proc-resources');
  function renderRes() {
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
      const del = html('button', { type: 'button', class: 'btn-icon btn-danger-text', onClick: () => { resources.splice(i, 1); renderRes(); } }, ['×']);
      row.appendChild(del);
      resList.appendChild(row);
    });
  }
  renderRes();

  form.querySelector('#add-proc-res').addEventListener('click', () => {
    resources.push({ type: 'link', title: '', url: '' });
    renderRes();
  });

  form.querySelector('#save-btn').addEventListener('click', () => {
    const fd = new FormData(form);
    const finalSteps = [];
    stepsList.querySelectorAll('.step-text').forEach(el => {
      finalSteps.push({ text: el.value });
    });
    const finalRes = [];
    resList.querySelectorAll('.resource-row').forEach(row => {
      finalRes.push({
        type: row.querySelector('.res-type').value,
        title: row.querySelector('.res-title').value,
        url: row.querySelector('.res-url').value
      });
    });
    const data = {
      title: fd.get('title'),
      category: fd.get('category'),
      toolId: fd.get('toolId'),
      overview: fd.get('overview'),
      steps: finalSteps,
      resources: finalRes
    };
    if (!data.title) { toast('Title is required', 'error'); return; }
    onSave(data);
  });
  return form;
}

export function renderProcedures(container, param) {
  if (param) return renderProcedureDetail(container, param);

  const isAdmin = store.isAdmin();
  const procedures = store.getProcedures();
  const categories = store.data.categories;

  container.innerHTML = `
    <div class="page-header">
      <h1>Procedures</h1>
      <div class="header-actions">
        ${isAdmin ? '<button class="btn btn-primary" id="add-proc">+ New Procedure</button>' : ''}
      </div>
    </div>
    <div class="filters">
      <select class="input input-sm" id="filter-cat">
        <option value="">All Categories</option>
        ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="procedures-grid" id="proc-grid"></div>
  `;

  function renderGrid(cat) {
    const grid = $('#proc-grid', container);
    grid.innerHTML = '';
    const list = cat ? procedures.filter(p => p.category === cat) : procedures;
    if (list.length === 0) {
      grid.innerHTML = '<p class="empty">No procedures yet</p>';
      return;
    }
    list.forEach(p => {
      const card = html('div', { class: 'card card-clickable', onClick: () => router.navigate('procedures/' + p.id) });
      const tool = p.toolId ? store.getTool(p.toolId) : null;
      card.innerHTML = `
        <div class="card-header">
          <h3>${escapeHtml(p.title)}</h3>
          <span class="badge" style="--badge-color:#6366f1">${p.category}</span>
        </div>
        <div class="card-body">
          ${p.overview ? `<p>${escapeHtml(p.overview).slice(0, 120)}${p.overview.length > 120 ? '...' : ''}</p>` : ''}
          <div class="list-item-meta">${p.steps?.length || 0} steps ${tool ? ` · Tool: ${escapeHtml(tool.name)}` : ''}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  renderGrid();

  $('#filter-cat', container).addEventListener('change', e => renderGrid(e.target.value || null));

  if (isAdmin) {
    $('#add-proc', container)?.addEventListener('click', () => {
      const form = procedureForm(null, data => {
        store.addProcedure(data);
        toast('Procedure created');
        document.querySelector('.modal-overlay')?.remove();
        renderProcedures(container);
      });
      modal('New Procedure', form);
    });
  }
}

function renderProcedureDetail(container, id) {
  const p = store.getProcedure(id);
  if (!p) { container.innerHTML = '<p class="empty">Procedure not found</p>'; return; }

  const isAdmin = store.isAdmin();
  const tool = p.toolId ? store.getTool(p.toolId) : null;

  container.innerHTML = `
    <div class="page-header">
      <button class="btn btn-sm btn-secondary" id="back-btn">&larr; Back</button>
      <div class="header-actions">
        ${isAdmin ? '<button class="btn btn-sm" id="edit-btn">Edit</button>' : ''}
        ${isAdmin ? '<button class="btn btn-sm btn-danger" id="del-btn">Delete</button>' : ''}
      </div>
    </div>
    <div class="detail-card">
      <h2>${escapeHtml(p.title)}</h2>
      <div class="detail-meta">
        <span class="badge" style="--badge-color:#6366f1">${p.category}</span>
        ${tool ? ` · Tool: <strong>${escapeHtml(tool.name)}</strong>` : ''}
        · Created: ${formatDate(p.createdAt)}
      </div>
      ${p.overview ? `<div class="detail-desc">${escapeHtml(p.overview)}</div>` : ''}

      <h4>Steps</h4>
      <div class="steps-list" id="steps"></div>

      ${p.resources && p.resources.length > 0 ? `
        <h4>Resources</h4>
        <div class="resources-list" id="proc-res"></div>
      ` : ''}
    </div>
  `;

  $('#back-btn', container).addEventListener('click', () => router.navigate('procedures'));

  const stepsEl = $('#steps', container);
  (p.steps || []).forEach((s, i) => {
    stepsEl.appendChild(html('div', { class: 'step-display' }, [
      html('div', { class: 'step-number' }, [String(i + 1)]),
      html('div', { class: 'step-content' }, [s.text])
    ]));
  });

  if (p.resources && p.resources.length > 0) {
    const resEl = $('#proc-res', container);
    p.resources.forEach(r => {
      const icons = { youtube: '🎬', server: '📂', link: '🔗', document: '📄' };
      const el = html('a', { class: 'resource-item', href: r.url, target: '_blank', rel: 'noopener' });
      el.innerHTML = `<span class="icon">${icons[r.type] || '🔗'}</span> <span>${escapeHtml(r.title || r.url)}</span> <span class="resource-type">${r.type}</span>`;
      resEl.appendChild(el);
    });
  }

  if (isAdmin) {
    $('#edit-btn', container)?.addEventListener('click', () => {
      const form = procedureForm(p, data => {
        store.updateProcedure(id, data);
        toast('Procedure updated');
        document.querySelector('.modal-overlay')?.remove();
        renderProcedureDetail(container, id);
      });
      modal('Edit Procedure', form);
    });
    $('#del-btn', container)?.addEventListener('click', async () => {
      if (await confirmDialog('Delete this procedure?')) {
        store.deleteProcedure(id);
        toast('Deleted');
        router.navigate('procedures');
      }
    });
  }
}
