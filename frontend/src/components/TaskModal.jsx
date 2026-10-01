import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Flag, 
  CheckCircle2, 
  FileText, 
  Trash2,
  Loader2 
} from 'lucide-react';
import api from '../services/api';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  task = null, 
  projectId = null, 
  projects = [],
  teamMembers = [], 
  onTaskSaved,
  onTaskDeleted 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    project_id: projectId || '',
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'to-do',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.substring(0, 10) : '',
        assigned_to: task.assigned_to || '',
        project_id: task.project_id || projectId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        due_date: '',
        assigned_to: '',
        project_id: projectId || (projects.length > 0 ? projects[0].id : ''),
      });
    }
    setError('');
  }, [task, projectId, isOpen, projects]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        assigned_to: formData.assigned_to ? Number(formData.assigned_to) : null,
        project_id: Number(formData.project_id),
      };

      let response;
      if (task?.id) {
        response = await api.put(`/tasks/${task.id}`, payload);
      } else {
        response = await api.post(`/tasks`, payload);
      }

      onTaskSaved(response.data.task);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task?.id) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      if (onTaskDeleted) onTaskDeleted(task.id);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              {task ? 'Edit Task Details' : 'Create New Task'}
            </h3>
          </div>
          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Project Selection (if creating and projects available) */}
          {(!projectId || !task) && projects.length > 0 && (
            <div>
              <label htmlFor="task-project-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Project
              </label>
              <select
                id="task-project-select"
                required
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="task-title-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Task Title
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement OAuth2 Refresh Flow"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="task-desc-input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide actionable requirements, acceptance criteria, or technical details..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Status
              </label>
              <select
                id="task-status-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="to-do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Priority
              </label>
              <select
                id="task-priority-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🔵 Medium</option>
                <option value="high">🟡 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-assignee-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Assignee
              </label>
              <select
                id="task-assignee-select"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Due Date
              </label>
              <input
                id="task-due-date-input"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-6">
            {task?.id ? (
              <button
                type="button"
                id="delete-task-btn"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                id="cancel-task-btn"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-task-btn"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{task ? 'Update Task' : 'Create Task'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
