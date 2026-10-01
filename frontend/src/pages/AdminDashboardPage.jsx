import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle2, 
  Users, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  Kanban,
  Loader2,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import ProjectModal from '../components/ProjectModal';
import TaskModal from '../components/TaskModal';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, projRes] = await Promise.all([
        api.get('/dashboard/admin'),
        api.get('/users'),
        api.get('/projects'),
      ]);
      setData(dashRes.data);
      setUsers(usersRes.data.users);
      setProjects(projRes.data.projects);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    if (!window.confirm(`Change role of ${user.name} to ${newRole.toUpperCase()}?`)) return;

    setUpdatingRoleUserId(user.id);
    try {
      await api.put(`/users/${user.id}/role`, { role: newRole });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to update user role');
    } finally {
      setUpdatingRoleUserId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
        <p className="text-slate-400 text-sm">Loading executive workspace metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const totalTasks = stats.total_tasks || 0;
  const completedTasks = stats.tasks_by_status?.done || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              Admin Executive Portal
            </span>
            <span className="text-xs text-slate-500">• Live System Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Engineering Operations Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor project throughput, team member allocations, and operational deliverables.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            id="refresh-dashboard-btn"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsTaskModalOpen(true)}
            id="admin-create-task-btn"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New Task</span>
          </button>

          <button
            onClick={() => setIsProjectModalOpen(true)}
            id="admin-create-project-btn"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Projects */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</span>
            <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderKanban className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{stats.total_projects || 0}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              {stats.active_projects || 0} active
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Portfolio Health</span>
            <Link to="/projects" className="text-indigo-400 hover:text-indigo-300 flex items-center">
              View all <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{totalTasks}</span>
            <span className="text-xs font-medium text-purple-400">
              {stats.tasks_by_status?.in_progress || 0} in flight
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Completion Rate</span>
            <span className="font-semibold text-slate-300">{completionRate}%</span>
          </div>
        </div>

        {/* Completed Deliverables */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">{completedTasks}</span>
            <span className="text-xs text-slate-400">of {totalTasks} closed</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }} 
            />
          </div>
        </div>

        {/* Active Engineers */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Capacity</span>
            <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{stats.total_users || 0}</span>
            <span className="text-xs font-medium text-cyan-400">
              {stats.members_count || 0} engineers
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Access Control</span>
            <span className="text-slate-400">RBAC Active</span>
          </div>
        </div>

      </div>

      {/* Task Distribution & Status Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Kanban className="w-4 h-4 text-indigo-400" />
              <span>Kanban Status Breakdown</span>
            </h2>
            <Link to="/kanban" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Open Board →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase">To Do</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">{stats.tasks_by_status?.to_do || 0}</div>
              <div className="text-[11px] text-slate-500 mt-1">Pending kickoff</div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
              <div className="text-xs font-semibold text-indigo-300 uppercase">In Progress</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">{stats.tasks_by_status?.in_progress || 0}</div>
              <div className="text-[11px] text-indigo-400/70 mt-1">Active development</div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <div className="text-xs font-semibold text-purple-300 uppercase">In Review</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">{stats.tasks_by_status?.review || 0}</div>
              <div className="text-[11px] text-purple-400/70 mt-1">QA & Code review</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="text-xs font-semibold text-emerald-300 uppercase">Done</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.tasks_by_status?.done || 0}</div>
              <div className="text-[11px] text-emerald-400/70 mt-1">Verified & shipped</div>
            </div>
          </div>

          {/* Priority Levels */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Task Priority Distribution
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-lg badge-urgent">
                <div className="text-lg font-bold">{stats.tasks_by_priority?.urgent || 0}</div>
                <div className="text-[10px] font-semibold uppercase">Urgent</div>
              </div>
              <div className="p-2.5 rounded-lg badge-high">
                <div className="text-lg font-bold">{stats.tasks_by_priority?.high || 0}</div>
                <div className="text-[10px] font-semibold uppercase">High</div>
              </div>
              <div className="p-2.5 rounded-lg badge-medium">
                <div className="text-lg font-bold">{stats.tasks_by_priority?.medium || 0}</div>
                <div className="text-[10px] font-semibold uppercase">Medium</div>
              </div>
              <div className="p-2.5 rounded-lg badge-low">
                <div className="text-lg font-bold">{stats.tasks_by_priority?.low || 0}</div>
                <div className="text-[10px] font-semibold uppercase">Low</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent System Activity / Tasks */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Recent Task Deliverables</span>
            </h2>
            
            <div className="space-y-3">
              {data?.recent_tasks?.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => { setSelectedTask(t); setIsTaskModalOpen(true); }}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {t.title}
                    </p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                      t.priority === 'urgent' ? 'badge-urgent' :
                      t.priority === 'high' ? 'badge-high' :
                      t.priority === 'medium' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{t.project ? `[${t.project.code}]` : 'General'}</span>
                    <span className="capitalize text-slate-400">{t.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <Link
              to="/kanban"
              className="w-full py-2 px-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Manage all tasks on Kanban</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* User Management & Team Workload Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Team Members & Workload Distribution</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage system permissions, roles, and review assigned task bandwidth.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-auto">
            {users.length} Registered Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5 text-center">Active Tasks</th>
                <th className="px-6 py-3.5">Registered</th>
                <th className="px-6 py-3.5 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-9 h-9 rounded-full ring-2 ring-slate-800"
                    />
                    <div>
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Team Member
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-200">
                      {u.assigned_tasks_count ?? 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={updatingRoleUserId === u.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {updatingRoleUserId === u.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : u.role === 'admin' ? (
                        'Demote to Member'
                      ) : (
                        'Promote to Admin'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        teamMembers={users}
        onProjectSaved={() => fetchDashboardData()}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        projects={projects}
        teamMembers={users}
        onTaskSaved={() => fetchDashboardData()}
        onTaskDeleted={() => fetchDashboardData()}
      />

    </div>
  );
}
