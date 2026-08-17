import { store } from '../store.js';
import { $, html, levelBadge, statusBadge, timeAgo } from '../utils.js';
import { router } from '../router.js';

export function renderDashboard(container) {
  const priorities = store.getPriorities();
  const members = store.getMembers();
  const requirements = store.getRequirements();
  const tools = store.getTools();
  const procedures = store.getProcedures();
  const teams = store.getTeams();

  const active = priorities.filter(p => p.status !== 'done');
  const critical = priorities.filter(p => p.level === 'critical' && p.status !== 'done');
  const pendingReqs = requirements.filter(r => r.status === 'pending');
  const inProgress = priorities.filter(p => p.status === 'in-progress');

  container.innerHTML = `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p class="subtitle">AI Team Hub — Asure Design Studio</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card" data-link="priorities">
        <div class="stat-number">${active.length}</div>
        <div class="stat-label">Active Priorities</div>
        <div class="stat-sub">${critical.length} critical</div>
      </div>
      <div class="stat-card" data-link="team">
        <div class="stat-number">${members.length}</div>
        <div class="stat-label">Team Members</div>
        <div class="stat-sub">${inProgress.length} tasks in progress</div>
      </div>
      <div class="stat-card" data-link="requirements">
        <div class="stat-number">${pendingReqs.length}</div>
        <div class="stat-label">Pending Requests</div>
        <div class="stat-sub">${requirements.length} total</div>
      </div>
      <div class="stat-card" data-link="tools">
        <div class="stat-number">${tools.length}</div>
        <div class="stat-label">Tools Available</div>
        <div class="stat-sub">${procedures.length} procedures</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <h3>Critical Priorities</h3>
          <button class="btn btn-sm" onclick="location.hash='#priorities'">View All</button>
        </div>
        <div class="card-body" id="dash-critical">
          ${critical.length === 0 ? '<p class="empty">No critical priorities</p>' : ''}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Team Activity</h3>
          <button class="btn btn-sm" onclick="location.hash='#team'">View All</button>
        </div>
        <div class="card-body" id="dash-team"></div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Pending Requirements</h3>
          <button class="btn btn-sm" onclick="location.hash='#requirements'">View All</button>
        </div>
        <div class="card-body" id="dash-reqs">
          ${pendingReqs.length === 0 ? '<p class="empty">No pending requirements</p>' : ''}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Team Breakdown</h3>
        </div>
        <div class="card-body" id="dash-teams"></div>
      </div>
    </div>
  `;

  // Critical priorities list
  const critEl = $('#dash-critical', container);
  critical.slice(0, 5).forEach(p => {
    const member = store.getMember(p.assigneeId);
    critEl.appendChild(html('div', { class: 'list-item', onClick: () => router.navigate('priorities/' + p.id) }, [
      html('div', { class: 'list-item-content' }, [
        html('div', { class: 'list-item-title', html: `${p.title}` }),
        html('div', { class: 'list-item-meta', html: `${statusBadge(p.status)} · ${member ? member.name : 'Unassigned'} · ${timeAgo(p.updatedAt)}` })
      ])
    ]));
  });

  // Team activity
  const teamEl = $('#dash-team', container);
  if (members.length === 0) {
    teamEl.innerHTML = '<p class="empty">No team members added yet</p>';
  } else {
    members.forEach(m => {
      const memberPriorities = priorities.filter(p => p.assigneeId === m.id && p.status !== 'done');
      const current = memberPriorities.find(p => p.status === 'in-progress');
      const team = teams.find(t => t.id === m.teamId);
      teamEl.appendChild(html('div', { class: 'list-item', onClick: () => router.navigate('team/' + m.id) }, [
        html('div', { class: 'avatar', style: { background: team?.color || '#6366f1' } }, [m.name.charAt(0).toUpperCase()]),
        html('div', { class: 'list-item-content' }, [
          html('div', { class: 'list-item-title' }, [m.name]),
          html('div', { class: 'list-item-meta' }, [current ? `Working on: ${current.title}` : `${memberPriorities.length} pending tasks`])
        ])
      ]));
    });
  }

  // Pending requirements
  const reqsEl = $('#dash-reqs', container);
  pendingReqs.slice(0, 5).forEach(r => {
    reqsEl.appendChild(html('div', { class: 'list-item' }, [
      html('div', { class: 'list-item-content' }, [
        html('div', { class: 'list-item-title' }, [r.title]),
        html('div', { class: 'list-item-meta', html: `From: ${r.fromTeam} · ${levelBadge(r.priority)} · ${timeAgo(r.createdAt)}` })
      ])
    ]));
  });

  // Teams breakdown
  const teamsEl = $('#dash-teams', container);
  teams.forEach(t => {
    const teamMembers = members.filter(m => m.teamId === t.id);
    const teamPriorities = priorities.filter(p => p.teamId === t.id && p.status !== 'done');
    teamsEl.appendChild(html('div', { class: 'team-bar' }, [
      html('div', { class: 'team-bar-label' }, [
        html('span', { class: 'team-dot', style: { background: t.color } }),
        html('span', {}, [t.name])
      ]),
      html('div', { class: 'team-bar-stats' }, [
        html('span', {}, [`${teamMembers.length} members`]),
        html('span', {}, [`${teamPriorities.length} active`])
      ])
    ]));
  });

  // Stat card clicks
  container.querySelectorAll('[data-link]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => router.navigate(el.dataset.link));
  });
}
