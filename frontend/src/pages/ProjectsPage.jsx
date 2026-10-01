import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  Kanban, 
  Calendar, 
  Users, 
  ArrowUpRight, 
  Edit3, 
  LayoutGrid, 
  List, 
  Loader2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import ProjectModal from '../components/ProjectModal';

export default function ProjectsPage() {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjectsData = async () => {
    setLoading(true);
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users'),
      ]);
      setProjects(projRes.data.projects);
      setTeamMembers(usersRes.data.users);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Workspace Portfolio
            </span>
            <span className="text-xs text-slate-500">• {projects.length} Active Workstreams</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Projects & Roadmaps
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage agile projects, review milestone delivery, and orchestrate cross-functional teams.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="create-new-project-btn"
            onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="project-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or code..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'active', 'planning', 'completed', 'on_hold'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status === 'all' ? 'All Projects' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
          <p className="text-xs text-slate-400">Loading project catalog...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search filters.' : 'Get started by creating your first agile project.'}
          </p>
          <button
            onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const total = project.tasks_count || 0;
            const done = project.completed_tasks_count || 0;
            const inProgress = project.in_progress_tasks_count || 0;
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div 
                key={project.id} 
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-indigo-300">
                      {project.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      project.status === 'planning' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      project.status === 'completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>Overall Progress</span>
                      <span className="font-bold text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Task counts breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <div className="text-xs font-bold text-slate-200">{total}</div>
                      <div className="text-[10px] text-slate-500 uppercase">Total</div>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-950/20">
                      <div className="text-xs font-bold text-indigo-400">{inProgress}</div>
                      <div className="text-[10px] text-indigo-400/70 uppercase">In Flight</div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/20">
                      <div className="text-xs font-bold text-emerald-400">{done}</div>
                      <div className="text-[10px] text-emerald-400/70 uppercase">Done</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  {/* Team Avatars */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {project.members?.slice(0, 4).map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                        alt={m.name}
                        title={m.name}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-950 object-cover"
                      />
                    ))}
                    {project.members?.length > 4 && (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 ring-2 ring-slate-950">
                        +{project.members.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/kanban?project=${project.id}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <span>Board</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Code</th>
                <th className="px-6 py-3.5">Project Name</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Tasks</th>
                <th className="px-6 py-3.5">Progress</th>
                <th className="px-6 py-3.5">Members</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProjects.map((p) => {
                const total = p.tasks_count || 0;
                const done = p.completed_tasks_count || 0;
                const progress = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-indigo-400">
                      {p.code}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {p.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {done}/{total} Done
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-1.5">
                        {p.members?.slice(0, 3).map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                            alt={m.name}
                            className="w-6 h-6 rounded-full ring-2 ring-slate-950"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => { setEditingProject(p); setIsModalOpen(true); }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                      >
                        Edit
                      </button>
                      <Link
                        to={`/kanban?project=${p.id}`}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
                      >
                        Kanban
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        teamMembers={teamMembers}
        onProjectSaved={() => fetchProjectsData()}
        onProjectDeleted={() => fetchProjectsData()}
      />

    </div>
  );
}
