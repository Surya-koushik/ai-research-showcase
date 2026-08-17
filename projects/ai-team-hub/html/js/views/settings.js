import { store } from '../store.js';
import { $, html, toast } from '../utils.js';

export function renderSettings(container) {
  const isAdmin = store.isAdmin();
  const currentUser = store.getCurrentUser();
  const members = store.getMembers();
  const currentMember = members.find(m => m.id === currentUser);

  container.innerHTML = `
    <div class="page-header">
      <h1>Settings</h1>
    </div>
    <div class="settings-grid">
      <div class="card">
        <div class="card-header"><h3>Your Profile</h3></div>
        <div class="card-body">
          <div class="form-group">
            <label>Select Your Profile</label>
            <select class="input" id="user-select">
              <option value="">— Select —</option>
              ${members.map(m => `<option value="${m.id}" ${currentUser === m.id ? 'selected' : ''}>${m.name}${m.email ? ` (${m.email})` : ''}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Role</label>
            <div class="toggle-group">
              <button class="btn ${isAdmin ? 'btn-primary' : 'btn-secondary'}" id="role-admin">Admin</button>
              <button class="btn ${!isAdmin ? 'btn-primary' : 'btn-secondary'}" id="role-user">User</button>
            </div>
            <p class="help-text">Admin can edit all data, manage teams, and delete items. Users can add priorities and edit their own.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3>Data Management</h3></div>
        <div class="card-body">
          <div class="form-group">
            <button class="btn" id="export-btn">Export Data (JSON)</button>
            <p class="help-text">Download all data as a JSON file for backup</p>
          </div>
          <div class="form-group">
            <label>Import Data</label>
            <input type="file" accept=".json" class="input" id="import-file">
            <p class="help-text">Restore from a previously exported JSON file</p>
          </div>
          <div class="form-group" style="border-top:1px solid var(--border);padding-top:1rem;margin-top:1rem">
            <button class="btn btn-danger" id="reset-btn">Reset All Data</button>
            <p class="help-text">Clear all data and start fresh. This cannot be undone!</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3>Load Sample Data</h3></div>
        <div class="card-body">
          <p>Load example data to see how the tool works.</p>
          <button class="btn" id="sample-btn">Load Sample Data</button>
        </div>
      </div>
    </div>
  `;

  // User select
  $('#user-select', container).addEventListener('change', e => {
    store.setCurrentUser(e.target.value);
    toast('Profile updated');
  });

  // Role toggle
  $('#role-admin', container).addEventListener('click', () => {
    store.setAdmin(true);
    toast('Switched to Admin');
    renderSettings(container);
  });
  $('#role-user', container).addEventListener('click', () => {
    store.setAdmin(false);
    toast('Switched to User');
    renderSettings(container);
  });

  // Export
  $('#export-btn', container).addEventListener('click', () => {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-team-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported');
  });

  // Import
  $('#import-file', container).addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      if (store.importData(evt.target.result)) {
        toast('Data imported successfully');
        renderSettings(container);
      } else {
        toast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Reset
  $('#reset-btn', container).addEventListener('click', () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      localStorage.removeItem('aith_data');
      localStorage.removeItem('aith_role');
      localStorage.removeItem('aith_user');
      store.load();
      toast('All data reset');
      renderSettings(container);
    }
  });

  // Sample data
  $('#sample-btn', container).addEventListener('click', () => {
    const now = new Date().toISOString();
    // Add sample members
    const m1 = store.addMember({ name: 'Rahul Sharma', email: 'rahul@asure.in', teamId: 't1', role: 'AI Researcher', focus: 'Stable Diffusion fine-tuning for architectural renders' });
    const m2 = store.addMember({ name: 'Priya Reddy', email: 'priya@asure.in', teamId: 't2', role: 'BIM Specialist', focus: 'Revit automation with pyRevit scripts' });
    const m3 = store.addMember({ name: 'Arun Kumar', email: 'arun@asure.in', teamId: 't4', role: 'CAD Lead', focus: 'AutoCAD to Revit conversion pipeline' });
    const m4 = store.addMember({ name: 'Deepika Nair', email: 'deepika@asure.in', teamId: 't3', role: 'Designer', focus: 'AI-assisted concept generation' });

    // Add sample tools
    const tool1 = store.addTool({ name: 'CAD2Revit Converter', category: 'Revit', status: 'ready', description: 'Converts DWG files to Revit families and models via semantic parsing', serverPath: 'Z:\\Tools\\cad2revit\\', resources: [{ type: 'link', title: 'Documentation', url: '#' }] });
    const tool2 = store.addTool({ name: 'AI Render Pipeline', category: 'AI/ML', status: 'beta', description: 'ComfyUI-based rendering pipeline for architectural visualization', serverPath: 'Z:\\Tools\\ai-render\\' });
    const tool3 = store.addTool({ name: 'SketchUp Bulk Exporter', category: 'SketchUp', status: 'ready', description: 'Batch export SketchUp models to various formats' });

    // Add sample procedures
    store.addProcedure({ title: 'Starting a New Revit Model from CAD', category: 'Revit', toolId: tool1.id, overview: 'Step-by-step process to convert CAD drawings into a clean Revit model', steps: [
      { text: 'Open the CAD file in AutoCAD and clean up layers using the ADS layer standard' },
      { text: 'Run the cad2revit parser to generate the semantic JSON' },
      { text: 'Review the JSON output for any parsing errors or missing elements' },
      { text: 'Load the JSON into Revit using the Bridge plugin on port 48885' },
      { text: 'Verify wall placement, door/window locations, and room boundaries' },
      { text: 'Run clash detection and fix any issues' }
    ], resources: [{ type: 'youtube', title: 'CAD to Revit Tutorial', url: 'https://youtube.com/watch?v=example' }] });

    store.addProcedure({ title: 'AI Render Setup for New Project', category: 'AI/ML', toolId: tool2.id, overview: 'How to set up the AI rendering pipeline for a new architectural project', steps: [
      { text: 'Clone the base ComfyUI workflow from the server template folder' },
      { text: 'Configure the LoRA models for the project style (residential/commercial/mixed-use)' },
      { text: 'Set up the input folder with reference images and camera angles' },
      { text: 'Run a test batch of 4 renders to validate quality' },
      { text: 'Adjust controlnet parameters if needed based on test results' }
    ] });

    // Add sample priorities
    store.addPriority({ title: 'Set up Stable Diffusion LoRA training for Villa renders', level: 'high', status: 'in-progress', teamId: 't1', assigneeId: m1.id, description: 'Train custom LoRA on Asure villa portfolio for consistent render style', createdBy: 'admin', resources: [{ type: 'youtube', title: 'LoRA Training Guide', url: 'https://youtube.com/watch?v=example2' }, { type: 'server', title: 'Training Dataset', url: 'Z:\\AI\\datasets\\villa-renders\\' }] });
    store.addPriority({ title: 'Automate Revit sheet creation for Phoenix P25', level: 'critical', status: 'todo', teamId: 't2', assigneeId: m2.id, description: 'Create pyRevit script to auto-generate drawing sheets from template', createdBy: 'admin' });
    store.addPriority({ title: 'CAD layer cleanup tool for incoming DWGs', level: 'medium', status: 'in-progress', teamId: 't4', assigneeId: m3.id, createdBy: 'admin' });
    store.addPriority({ title: 'AI concept generation workflow for competitions', level: 'high', status: 'todo', teamId: 't3', assigneeId: m4.id, createdBy: 'admin' });

    // Add sample requirements
    store.addRequirement({ title: 'Need automated quantity takeoff for structural elements', fromTeam: 'Structural', priority: 'high', description: 'The structural team needs BOQ quantities extracted automatically from Revit models', requester: 'Trinadh' });
    store.addRequirement({ title: 'Render pipeline for client presentation deck', fromTeam: 'Business Development', priority: 'medium', description: 'Need 8 high-quality AI renders for the upcoming client pitch next week', requester: 'Shravan' });

    toast('Sample data loaded');
    renderSettings(container);
  });
}
