import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FolderKanban, 
  ArrowUpRight, 
  Kanban,
  CheckCircle,
  Play,
  Loader2,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import TaskModal from '../components/TaskModal';

export default function MemberDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchMemberData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/member');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load member dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  const handleQuickStatusChange = async (taskId, nextStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      fetchMemberData();
    } catch (err) {
      console.error(err);
      alert('Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-3" />
        <p className="text-slate-400 text-sm">Loading your individual sprint backlog...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const overdueTasks = data?.overdue_tasks || [];
  const upcomingTasks = data?.upcoming_tasks || [];
  const myProjects = data?.my_projects || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Developer Workspace
            </span>
            <span className="text-xs text-slate-500">• Personal Sprint Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here is a breakdown of your assigned tasks, impending deadlines, and current project scopes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/kanban"
            id="member-open-kanban-btn"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 text-xs font-semibold transition-all flex items-center space-x-2"
          >
            <Kanban className="w-4 h-4" />
            <span>Open Kanban Board</span>
          </Link>
        </div>
      </div>

      {/* Overdue Warning Banner if tasks are overdue */}
      {overdueTasks.length > 0 && (
        <div id="overdue-alert-banner" className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-rose-300">
                Action Required: {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''} Detected
              </h4>
              <p className="text-xs text-rose-400/80 mt-0.5">
                These deliverables have passed their due dates. Review or mark them done below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase">Assigned Total</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.total_assigned || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">My tickets</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase">To Do</div>
          <div className="text-2xl font-bold text-slate-300 mt-1">{stats.to_do || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for work</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20">
          <div className="text-xs font-semibold text-indigo-300 uppercase">In Progress</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{stats.in_progress || 0}</div>
          <div className="text-[11px] text-indigo-400/70 mt-1">Currently building</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-purple-500/20 bg-purple-950/20">
          <div className="text-xs font-semibold text-purple-300 uppercase">In Review</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{stats.review || 0}</div>
          <div className="text-[11px] text-purple-400/70 mt-1">Under review</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-emerald-300 uppercase">Completed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed || 0}</div>
          <div className="text-[11px] text-emerald-400/70 mt-1">Shipped items</div>
        </div>

      </div>

      {/* Main Backlog Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Overdue Tasks List */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Overdue Tasks ({overdueTasks.length})</span>
            </h3>
          </div>

          {overdueTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800/80">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-300">You're completely caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No overdue tickets assigned to your queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueTasks.map((t) => (
                <div 
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div 
                    onClick={() => { setSelectedTask(t); setIsTaskModalOpen(true); }}
                    className="cursor-pointer group flex-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded badge-urgent uppercase">
                        {t.priority}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-rose-400 mt-1">
                      <span>Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}</span>
                      {t.project && <span>• [{t.project.code}] {t.project.name}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuickStatusChange(t.id, 'done')}
                      disabled={updatingTaskId === t.id}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
                      title="Mark as Done"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks Due Soon */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Upcoming Due (Next 7 Days)</span>
            </h3>
            <span className="text-xs text-slate-400">{upcomingTasks.length} items</span>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800/80">
              <Clock className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-300">No urgent deadlines this week</p>
              <p className="text-xs text-slate-500 mt-1">Great job pacing your sprint workload.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((t) => (
                <div 
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/30 transition-colors"
                >
                  <div 
                    onClick={() => { setSelectedTask(t); setIsTaskModalOpen(true); }}
                    className="cursor-pointer group flex-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                        t.priority === 'urgent' ? 'badge-urgent' :
                        t.priority === 'high' ? 'badge-high' :
                        t.priority === 'medium' ? 'badge-medium' : 'badge-low'
                      }`}>
                        {t.priority}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                      <span>Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}</span>
                      {t.project && <span>• [{t.project.code}]</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {t.status === 'to-do' && (
                      <button
                        onClick={() => handleQuickStatusChange(t.id, 'in_progress')}
                        disabled={updatingTaskId === t.id}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
                        title="Start Working"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start</span>
                      </button>
                    )}
                    {t.status === 'in_progress' && (
                      <button
                        onClick={() => handleQuickStatusChange(t.id, 'review')}
                        disabled={updatingTaskId === t.id}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors flex items-center space-x-1 cursor-pointer"
                        title="Submit for Review"
                      >
                        <span>Submit Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Projects Assigned To Me */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <span>Participating Projects ({myProjects.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Projects where you are registered as a team member or owner.</p>
          </div>
          <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
            <span>All Projects</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myProjects.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {p.code}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    p.status === 'planning' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2 line-clamp-1">{p.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">{p.tasks_count ?? 0} Tasks total</span>
                <Link
                  to={`/kanban?project=${p.id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center"
                >
                  <span>Board</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        onTaskSaved={() => fetchMemberData()}
        onTaskDeleted={() => fetchMemberData()}
      />

    </div>
  );
}
