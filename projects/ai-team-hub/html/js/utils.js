export function $(sel, ctx = document) { return ctx.querySelector(sel); }
export function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

export function html(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  }
  for (const c of (Array.isArray(children) ? children : [children])) {
    if (typeof c === 'string') el.appendChild(document.createTextNode(c));
    else if (c) el.appendChild(c);
  }
  return el;
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + 'd ago';
  return formatDate(iso);
}

export function levelBadge(level) {
  const colors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
  return `<span class="badge" style="--badge-color:${colors[level] || '#94a3b8'}">${level}</span>`;
}

export function statusBadge(status) {
  const colors = { backlog: '#94a3b8', todo: '#60a5fa', 'in-progress': '#f59e0b', review: '#a78bfa', done: '#22c55e', pending: '#f97316', assigned: '#60a5fa', completed: '#22c55e' };
  return `<span class="badge" style="--badge-color:${colors[status] || '#94a3b8'}">${status}</span>`;
}

export function modal(title, contentEl, opts = {}) {
  const overlay = html('div', { class: 'modal-overlay' });
  const box = html('div', { class: 'modal' });
  const header = html('div', { class: 'modal-header' }, [
    html('h3', {}, [title]),
    html('button', { class: 'btn-icon', onClick: () => overlay.remove() }, ['×'])
  ]);
  const body = html('div', { class: 'modal-body' }, [contentEl]);
  box.append(header, body);
  if (opts.footer) box.appendChild(html('div', { class: 'modal-footer' }, opts.footer));
  overlay.appendChild(box);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  return overlay;
}

export function confirmDialog(msg) {
  return new Promise(resolve => {
    const content = html('div', {}, [
      html('p', {}, [msg]),
      html('div', { class: 'modal-footer', style: { marginTop: '1rem' } }, [
        html('button', { class: 'btn btn-secondary', onClick: () => { ov.remove(); resolve(false); } }, ['Cancel']),
        html('button', { class: 'btn btn-danger', onClick: () => { ov.remove(); resolve(true); } }, ['Delete'])
      ])
    ]);
    const ov = modal('Confirm', content);
  });
}

export function toast(msg, type = 'info') {
  const el = html('div', { class: `toast toast-${type}` }, [msg]);
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
