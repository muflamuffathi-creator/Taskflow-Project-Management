import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderKanban, 
  Calendar, 
  Users, 
  Trash2, 
  Loader2,
  Check
} from 'lucide-react';
import api from '../services/api';

export default function ProjectModal({
  isOpen,
  onClose,
  project = null,
  teamMembers = [],
  onProjectSaved,
  onProjectDeleted,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    due_date: '',
    member_ids: [],
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'active',
        due_date: project.due_date ? project.due_date.substring(0, 10) : '',
        member_ids: project.members ? project.members.map((m) => m.id) : [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        due_date: '',
        member_ids: [],
      });
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const toggleMember = (memberId) => {
    setFormData((prev) => {
      const exists = prev.member_ids.includes(memberId);
      return {
        ...prev,
        member_ids: exists
          ? prev.member_ids.filter((id) => id !== memberId)
          : [...prev.member_ids, memberId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (project?.id) {
        res = await api.put(`/projects/${project.id}`, formData);
      } else {
        res = await api.post(`/projects`, formData);
      }
      onProjectSaved(res.data.project);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project?.id) return;
    if (!window.confirm(`Are you sure you want to delete "${project.name}" and all associated tasks?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${project.id}`);
      if (onProjectDeleted) onProjectDeleted(project.id);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete project.');
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
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FolderKanban className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              {project ? 'Edit Project' : 'Create New Project'}
            </h3>
          </div>
          <button
            id="close-project-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
          <div>
            <label htmlFor="project-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Project Name
            </label>
            <input
              id="project-name-input"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. NextGen Microservices Platform"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="project-desc-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="project-desc-input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline project scope, objectives, key milestones, and repository links..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="project-status-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Status
              </label>
              <select
                id="project-status-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="project-due-date-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Target Due Date
              </label>
              <input
                id="project-due-date-input"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Assign Team Members */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>Assign Team Members</span>
              <span className="text-slate-400 font-normal">({formData.member_ids.length} selected)</span>
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-900/80 border border-slate-800 rounded-xl">
              {teamMembers.map((member) => {
                const isSelected = formData.member_ids.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/20 border border-purple-500/40 text-purple-200'
                        : 'bg-slate-800/40 hover:bg-slate-800 border border-transparent text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                        alt={member.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>{member.name}</span>
                      <span className="text-[10px] text-slate-400">({member.role})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-6">
            {project?.id ? (
              <button
                type="button"
                id="delete-project-btn"
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
                id="cancel-project-btn"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-project-btn"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{project ? 'Save Changes' : 'Create Project'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
