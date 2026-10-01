import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Kanban, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  Flag,
  Loader2,
  FolderKanban,
  Sparkles,
  GripVertical
} from 'lucide-react';
import api from '../services/api';
import TaskModal from '../components/TaskModal';

const COLUMNS = [
  { id: 'to-do', title: 'To Do', color: 'border-slate-500', headerBg: 'bg-slate-800/60', badge: 'bg-slate-700 text-slate-300' },
  { id: 'in_progress', title: 'In Progress', color: 'border-indigo-500', headerBg: 'bg-indigo-950/40', badge: 'bg-indigo-500/20 text-indigo-300' },
  { id: 'review', title: 'Review', color: 'border-purple-500', headerBg: 'bg-purple-950/40', badge: 'bg-purple-500/20 text-purple-300' },
  { id: 'done', title: 'Done', color: 'border-emerald-500', headerBg: 'bg-emerald-950/40', badge: 'bg-emerald-500/20 text-emerald-300' },
];

export default function KanbanBoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectId = searchParams.get('project') || '';

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Modals & Drag State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState('to-do');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Fetch initial project list and team members
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const [projRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/users'),
        ]);
        setProjects(projRes.data.projects);
        setTeamMembers(usersRes.data.users);

        if (!selectedProjectId && projRes.data.projects.length > 0) {
          setSelectedProjectId(String(projRes.data.projects[0].id));
        }
      } catch (err) {
        console.error('Failed to load init data for kanban:', err);
      }
    };
    fetchInitData();
  }, []);

  // Fetch tasks when selected project changes
  const fetchTasks = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const res = await api.get(`/projects/${selectedProjectId}/tasks`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Failed to fetch project tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      setSearchParams({ project: selectedProjectId });
      fetchTasks();
    }
  }, [selectedProjectId]);

  // Current active project details
  const activeProject = useMemo(() => {
    return projects.find((p) => String(p.id) === String(selectedProjectId));
  }, [projects, selectedProjectId]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchKeyword.toLowerCase()));
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesAssignee = 
        assigneeFilter === 'all' || 
        (assigneeFilter === 'unassigned' ? !t.assigned_to : String(t.assigned_to) === String(assigneeFilter));
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchKeyword, priorityFilter, assigneeFilter]);

  // Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', String(taskId));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskIdStr = e.dataTransfer.getData('text/plain') || draggedTaskId;
    const taskId = Number(taskIdStr);
    setDraggedTaskId(null);

    if (!taskId) return;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === targetStatus) return;

    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: targetStatus });
    } catch (err) {
      console.error('Failed to sync task drag status with server:', err);
      fetchTasks(); // rollback on error
    }
  };

  const openNewTaskModal = (status = 'to-do') => {
    setSelectedTask(null);
    setModalDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'urgent': return 'badge-urgent';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Board Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Interactive Kanban Board
            </span>
            <span className="text-xs text-slate-500">• Drag & Drop Enabled</span>
          </div>

          <div className="flex items-center space-x-3 mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeProject ? activeProject.name : 'Sprint Board'}
            </h1>
            {activeProject && (
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300">
                {activeProject.code}
              </span>
            )}
          </div>
          {activeProject?.description && (
            <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-1">
              {activeProject.description}
            </p>
          )}
        </div>

        {/* Project Selector & Global Add Task */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Project Switcher */}
          <div className="flex items-center space-x-2">
            <label htmlFor="kanban-project-select" className="text-xs font-semibold text-slate-400 uppercase hidden sm:inline">
              Project:
            </label>
            <select
              id="kanban-project-select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.code}] {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            id="kanban-add-task-header-btn"
            onClick={() => openNewTaskModal('to-do')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="kanban-search-input"
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Filter tasks by keyword..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Priority & Assignee Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Priority */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Priority:</span>
            <select
              id="kanban-priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Assignee */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Assignee:</span>
            <select
              id="kanban-assignee-filter"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Team</option>
              <option value="unassigned">Unassigned</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {(searchKeyword || priorityFilter !== 'all' || assigneeFilter !== 'all') && (
            <button
              onClick={() => { setSearchKeyword(''); setPriorityFilter('all'); setAssigneeFilter('all'); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* Kanban 4-Columns Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
          <p className="text-xs text-slate-400">Populating Kanban board matrix...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.id);
            const isTargeted = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                id={`kanban-column-${column.id}`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`rounded-2xl border transition-all duration-200 flex flex-col min-h-[600px] ${
                  isTargeted 
                    ? 'border-indigo-400 bg-indigo-950/30 ring-2 ring-indigo-500/50 scale-[1.01]' 
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                {/* Column Header */}
                <div className={`p-4 rounded-t-2xl border-b border-slate-800 flex items-center justify-between ${column.headerBg}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      column.id === 'to-do' ? 'bg-slate-400' :
                      column.id === 'in_progress' ? 'bg-indigo-400' :
                      column.id === 'review' ? 'bg-purple-400' : 'bg-emerald-400'
                    }`} />
                    <h3 className="font-bold text-sm text-white">{column.title}</h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${column.badge}`}>
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => openNewTaskModal(column.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                    title={`Add task to ${column.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Tasks Container */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[750px]">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 rounded-xl border border-dashed border-slate-800/80 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                      <p className="text-xs">No tasks in this lane</p>
                      <button
                        onClick={() => openNewTaskModal(column.id)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 mt-1 cursor-pointer"
                      >
                        + Create a task
                      </button>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const isDragging = draggedTaskId === task.id;
                      const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

                      return (
                        <div
                          key={task.id}
                          id={`task-card-${task.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => openEditTaskModal(task)}
                          className={`glass-card p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-150 group relative ${
                            isDragging ? 'opacity-40 scale-95 border-indigo-500' : 'border-slate-800/80'
                          }`}
                        >
                          {/* Card Top: Priority & Due Date */}
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority}
                            </span>

                            <div className="flex items-center space-x-1 text-slate-400 group-hover:text-slate-200">
                              <GripVertical className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                            </div>
                          </div>

                          {/* Task Title */}
                          <h4 className="text-xs font-semibold text-white mt-2.5 line-clamp-2 leading-relaxed group-hover:text-indigo-300 transition-colors">
                            {task.title}
                          </h4>

                          {/* Task Description excerpt */}
                          {task.description && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-normal">
                              {task.description}
                            </p>
                          )}

                          {/* Card Footer: Assignee & Due Date */}
                          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            {/* Due date */}
                            {task.due_date ? (
                              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                              </div>
                            ) : (
                              <span className="text-slate-600 text-[10px]">No date</span>
                            )}

                            {/* Assignee Avatar */}
                            {task.assignee ? (
                              <div className="flex items-center space-x-1.5" title={`Assigned to ${task.assignee.name}`}>
                                <img
                                  src={task.assignee.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.name}`}
                                  alt={task.assignee.name}
                                  className="w-5 h-5 rounded-full ring-1 ring-indigo-500/40 object-cover"
                                />
                                <span className="text-[10px] text-slate-300 font-medium truncate max-w-[70px]">
                                  {task.assignee.name.split(' ')[0]}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">Unassigned</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Column Quick Add Footer */}
                <div className="p-3 border-t border-slate-800/60">
                  <button
                    onClick={() => openNewTaskModal(column.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-dashed border-slate-800 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal for creating / editing */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        projectId={selectedProjectId}
        projects={projects}
        teamMembers={teamMembers}
        onTaskSaved={() => fetchTasks()}
        onTaskDeleted={() => fetchTasks()}
      />

    </div>
  );
}
