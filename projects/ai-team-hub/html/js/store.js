const STORE_KEY = 'aith_data';

const DEFAULT_DATA = {
  meta: { version: 1, createdAt: null, adminPin: '2024' },
  teams: [
    { id: 't1', name: 'AI Research', color: '#6366f1' },
    { id: 't2', name: 'BIM', color: '#0891b2' },
    { id: 't3', name: 'Design', color: '#d946ef' },
    { id: 't4', name: 'CAD', color: '#f59e0b' }
  ],
  members: [],
  priorities: [],
  procedures: [],
  tools: [],
  requirements: [],
  categories: ['SketchUp', 'CAD', 'Revit', 'AI/ML', 'Grasshopper', 'Python', 'General'],
  statuses: ['backlog', 'todo', 'in-progress', 'review', 'done']
};

class Store {
  constructor() {
    this._data = null;
    this._listeners = [];
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      this._data = raw ? JSON.parse(raw) : { ...DEFAULT_DATA, meta: { ...DEFAULT_DATA.meta, createdAt: new Date().toISOString() } };
    } catch {
      this._data = { ...DEFAULT_DATA, meta: { ...DEFAULT_DATA.meta, createdAt: new Date().toISOString() } };
    }
    if (!this._data.categories) this._data.categories = DEFAULT_DATA.categories;
    if (!this._data.statuses) this._data.statuses = DEFAULT_DATA.statuses;
  }

  save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this._data));
    this._listeners.forEach(fn => fn(this._data));
  }

  on(fn) { this._listeners.push(fn); }
  off(fn) { this._listeners = this._listeners.filter(f => f !== fn); }

  get data() { return this._data; }

  uid() { return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7); }

  // Teams
  getTeams() { return this._data.teams; }
  addTeam(team) { team.id = this.uid(); this._data.teams.push(team); this.save(); return team; }
  updateTeam(id, updates) { const t = this._data.teams.find(t => t.id === id); if (t) Object.assign(t, updates); this.save(); }
  deleteTeam(id) { this._data.teams = this._data.teams.filter(t => t.id !== id); this.save(); }

  // Members
  getMembers(teamId) { return teamId ? this._data.members.filter(m => m.teamId === teamId) : this._data.members; }
  getMember(id) { return this._data.members.find(m => m.id === id); }
  addMember(m) { m.id = this.uid(); m.createdAt = new Date().toISOString(); this._data.members.push(m); this.save(); return m; }
  updateMember(id, updates) { const m = this._data.members.find(m => m.id === id); if (m) Object.assign(m, updates); this.save(); }
  deleteMember(id) { this._data.members = this._data.members.filter(m => m.id !== id); this.save(); }

  // Priorities
  getPriorities(filters = {}) {
    let list = this._data.priorities;
    if (filters.teamId) list = list.filter(p => p.teamId === filters.teamId);
    if (filters.assigneeId) list = list.filter(p => p.assigneeId === filters.assigneeId);
    if (filters.status) list = list.filter(p => p.status === filters.status);
    if (filters.level) list = list.filter(p => p.level === filters.level);
    return list.sort((a, b) => {
      const lvl = { critical: 0, high: 1, medium: 2, low: 3 };
      return (lvl[a.level] ?? 4) - (lvl[b.level] ?? 4);
    });
  }
  getPriority(id) { return this._data.priorities.find(p => p.id === id); }
  addPriority(p) {
    p.id = this.uid();
    p.createdAt = new Date().toISOString();
    p.updatedAt = p.createdAt;
    p.comments = p.comments || [];
    p.resources = p.resources || [];
    this._data.priorities.push(p);
    this.save();
    return p;
  }
  updatePriority(id, updates) {
    const p = this._data.priorities.find(p => p.id === id);
    if (p) { Object.assign(p, updates); p.updatedAt = new Date().toISOString(); }
    this.save();
  }
  deletePriority(id) { this._data.priorities = this._data.priorities.filter(p => p.id !== id); this.save(); }

  // Procedures
  getProcedures(category) { return category ? this._data.procedures.filter(p => p.category === category) : this._data.procedures; }
  getProcedure(id) { return this._data.procedures.find(p => p.id === id); }
  addProcedure(p) { p.id = this.uid(); p.createdAt = new Date().toISOString(); this._data.procedures.push(p); this.save(); return p; }
  updateProcedure(id, updates) { const p = this._data.procedures.find(p => p.id === id); if (p) Object.assign(p, updates); this.save(); }
  deleteProcedure(id) { this._data.procedures = this._data.procedures.filter(p => p.id !== id); this.save(); }

  // Tools
  getTools() { return this._data.tools; }
  getTool(id) { return this._data.tools.find(t => t.id === id); }
  addTool(t) { t.id = this.uid(); t.createdAt = new Date().toISOString(); this._data.tools.push(t); this.save(); return t; }
  updateTool(id, updates) { const t = this._data.tools.find(t => t.id === id); if (t) Object.assign(t, updates); this.save(); }
  deleteTool(id) { this._data.tools = this._data.tools.filter(t => t.id !== id); this.save(); }

  // Requirements
  getRequirements(filters = {}) {
    let list = this._data.requirements;
    if (filters.fromTeam) list = list.filter(r => r.fromTeam === filters.fromTeam);
    if (filters.status) list = list.filter(r => r.status === filters.status);
    if (filters.assigneeId) list = list.filter(r => r.assigneeId === filters.assigneeId);
    return list;
  }
  getRequirement(id) { return this._data.requirements.find(r => r.id === id); }
  addRequirement(r) { r.id = this.uid(); r.createdAt = new Date().toISOString(); r.status = r.status || 'pending'; this._data.requirements.push(r); this.save(); return r; }
  updateRequirement(id, updates) { const r = this._data.requirements.find(r => r.id === id); if (r) Object.assign(r, updates); this.save(); }
  deleteRequirement(id) { this._data.requirements = this._data.requirements.filter(r => r.id !== id); this.save(); }

  // Admin
  isAdmin() { return localStorage.getItem('aith_role') === 'admin'; }
  setAdmin(val) { localStorage.setItem('aith_role', val ? 'admin' : 'user'); this._listeners.forEach(fn => fn(this._data)); }
  getCurrentUser() { return localStorage.getItem('aith_user') || null; }
  setCurrentUser(memberId) { localStorage.setItem('aith_user', memberId); }

  // Export / Import
  exportData() { return JSON.stringify(this._data, null, 2); }
  importData(json) {
    try {
      this._data = JSON.parse(json);
      this.save();
      return true;
    } catch { return false; }
  }
}

export const store = new Store();
