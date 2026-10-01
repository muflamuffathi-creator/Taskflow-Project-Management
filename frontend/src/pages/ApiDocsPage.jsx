import React, { useState } from 'react';
import { 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  Server, 
  Key, 
  Layers, 
  Send,
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const API_ENDPOINTS = [
  {
    category: 'Authentication',
    items: [
      {
        method: 'POST',
        path: '/api/login',
        desc: 'Authenticate user with email and password, returning a Sanctum bearer token.',
        auth: false,
        body: '{\n  "email": "admin@taskmanager.com",\n  "password": "password123"\n}',
        response: '{\n  "message": "Login successful",\n  "token": "1|abc123sanctumtoken...",\n  "user": { "id": 1, "name": "Admin Manager", "role": "admin" }\n}'
      },
      {
        method: 'POST',
        path: '/api/register',
        desc: 'Register a new team member or admin account.',
        auth: false,
        body: '{\n  "name": "Alex Rivera",\n  "email": "alex@taskmanager.com",\n  "password": "password123",\n  "role": "member"\n}',
        response: '{\n  "message": "User registered successfully",\n  "token": "2|xyztoken...",\n  "user": { "id": 6, "name": "Alex Rivera", "role": "member" }\n}'
      },
      {
        method: 'GET',
        path: '/api/me',
        desc: 'Retrieve current authenticated user profile information.',
        auth: true,
        response: '{\n  "user": {\n    "id": 1,\n    "name": "Admin Manager",\n    "email": "admin@taskmanager.com",\n    "role": "admin"\n  }\n}'
      },
      {
        method: 'POST',
        path: '/api/logout',
        desc: 'Revoke the active Sanctum bearer token.',
        auth: true,
        response: '{\n  "message": "Logged out successfully"\n}'
      }
    ]
  },
  {
    category: 'Projects Management',
    items: [
      {
        method: 'GET',
        path: '/api/projects',
        desc: 'List all visible projects with task breakdown counters and team members.',
        auth: true,
        response: '{\n  "projects": [\n    {\n      "id": 1,\n      "name": "Mobile Banking App v2.0",\n      "code": "PRJ-BANK",\n      "status": "active",\n      "tasks_count": 6,\n      "completed_tasks_count": 2\n    }\n  ]\n}'
      },
      {
        method: 'POST',
        path: '/api/projects',
        desc: 'Create a new project workspace (Admin only).',
        auth: true,
        body: '{\n  "name": "NextGen Microservices",\n  "description": "Enterprise API gateway",\n  "status": "active",\n  "due_date": "2026-11-30",\n  "member_ids": [1, 2, 3]\n}',
        response: '{\n  "message": "Project created successfully",\n  "project": { "id": 4, "name": "NextGen Microservices", "code": "PRJ-WXYZ" }\n}'
      },
      {
        method: 'GET',
        path: '/api/projects/{id}',
        desc: 'Fetch full project details, nested tasks, owner, and assigned members.',
        auth: true,
        response: '{\n  "project": { "id": 1, "name": "Mobile Banking App v2.0", "tasks": [...] }\n}'
      },
      {
        method: 'PUT',
        path: '/api/projects/{id}',
        desc: 'Update project properties and member allocations.',
        auth: true,
        body: '{\n  "name": "Mobile Banking App v2.1",\n  "status": "completed"\n}',
        response: '{\n  "message": "Project updated successfully"\n}'
      },
      {
        method: 'DELETE',
        path: '/api/projects/{id}',
        desc: 'Permanently remove a project and cascade delete tasks (Admin only).',
        auth: true,
        response: '{\n  "message": "Project deleted successfully"\n}'
      }
    ]
  },
  {
    category: 'Kanban Tasks & Workflows',
    items: [
      {
        method: 'GET',
        path: '/api/projects/{projectId}/tasks',
        desc: 'Fetch tasks for a specific project with live filtering by status, priority, or assignee.',
        auth: true,
        response: '{\n  "tasks": [\n    {\n      "id": 101,\n      "title": "Setup OAuth2",\n      "status": "in_progress",\n      "priority": "urgent",\n      "position": 1\n    }\n  ]\n}'
      },
      {
        method: 'POST',
        path: '/api/tasks',
        desc: 'Create a new task card in a project.',
        auth: true,
        body: '{\n  "project_id": 1,\n  "title": "Implement Redis Cache",\n  "status": "to-do",\n  "priority": "high",\n  "due_date": "2026-10-15",\n  "assigned_to": 2\n}',
        response: '{\n  "message": "Task created successfully",\n  "task": { "id": 20, "title": "Implement Redis Cache" }\n}'
      },
      {
        method: 'PATCH',
        path: '/api/tasks/{id}/status',
        desc: 'Quick status drag-and-drop position and lane update.',
        auth: true,
        body: '{\n  "status": "in_progress",\n  "position": 2\n}',
        response: '{\n  "message": "Task status updated successfully"\n}'
      },
      {
        method: 'PUT',
        path: '/api/tasks/{id}',
        desc: 'Full update of task title, description, priority, assignee, or due date.',
        auth: true,
        body: '{\n  "title": "Updated Task Title",\n  "priority": "urgent"\n}',
        response: '{\n  "message": "Task updated successfully"\n}'
      },
      {
        method: 'DELETE',
        path: '/api/tasks/{id}',
        desc: 'Delete an individual task.',
        auth: true,
        response: '{\n  "message": "Task deleted successfully"\n}'
      }
    ]
  },
  {
    category: 'Dashboards & User Roles',
    items: [
      {
        method: 'GET',
        path: '/api/dashboard/admin',
        desc: 'Global system KPI metrics, project health, priority distributions, and team member workload (Admin only).',
        auth: true,
        response: '{\n  "stats": { "total_projects": 3, "total_tasks": 15, "tasks_by_status": {...} },\n  "team_workload": [...]\n}'
      },
      {
        method: 'GET',
        path: '/api/dashboard/member',
        desc: 'Personal developer workload, overdue tasks, upcoming 7-day deadlines, and active project assignments.',
        auth: true,
        response: '{\n  "stats": { "total_assigned": 6, "completed": 2, "overdue_count": 0 },\n  "upcoming_tasks": [...]\n}'
      },
      {
        method: 'GET',
        path: '/api/users',
        desc: 'List all team members with assigned task counts for assignment dropdowns.',
        auth: true,
        response: '{\n  "users": [\n    { "id": 1, "name": "Admin Manager", "role": "admin", "assigned_tasks_count": 4 }\n  ]\n}'
      },
      {
        method: 'PUT',
        path: '/api/users/{id}/role',
        desc: 'Promote or demote a user role between admin and member (Admin only).',
        auth: true,
        body: '{\n  "role": "admin"\n}',
        response: '{\n  "message": "User role updated successfully"\n}'
      }
    ]
  }
];

export default function ApiDocsPage() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState({});

  const toggleExpand = (key) => {
    setExpandedEndpoints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadCollection = () => {
    // Generate clean Postman Collection download
    const postmanData = {
      info: {
        _postman_id: "e278d2fa-c15c-46e5-bc36-73eb6a08a309",
        name: "Taskflow Project Management REST API",
        description: "Complete Postman API Collection for Laravel Sanctum, Projects, Tasks, and Roles.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: API_ENDPOINTS.flatMap((cat) => ({
        name: cat.category,
        item: cat.items.map((endpoint) => ({
          name: `${endpoint.method} ${endpoint.path}`,
          request: {
            method: endpoint.method,
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Accept", value: "application/json" },
              ...(endpoint.auth ? [{ key: "Authorization", value: "Bearer {{auth_token}}" }] : [])
            ],
            ...(endpoint.body ? { body: { mode: "raw", raw: endpoint.body } } : {}),
            url: {
              raw: `{{base_url}}${endpoint.path}`,
              host: ["{{base_url}}"],
              path: endpoint.path.replace(/^\//, '').split('/')
            }
          }
        }))
      })),
      variable: [
        { key: "base_url", value: "http://127.0.0.1:8000" },
        { key: "auth_token", value: "" }
      ]
    };

    const blob = new Blob([JSON.stringify(postmanData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Task_Management_API.postman_collection.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                REST API Documentation
              </span>
              <span className="text-xs text-slate-500">• Laravel 11 + Sanctum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              TaskFlow REST API Specification
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Fully documented REST API endpoints covering bearer token authentication, project management, 
              Kanban task operations, and role authorization.
            </p>
          </div>

          <button
            id="download-postman-btn"
            onClick={handleDownloadCollection}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 flex items-center space-x-2.5 transition-all cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Postman Collection</span>
          </button>
        </div>

        {/* Global Env Info */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">Base URL:</span>
            <code className="text-indigo-300 font-mono font-semibold">http://127.0.0.1:8000</code>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">Authentication:</span>
            <span className="text-emerald-400 font-semibold">Bearer Token (Laravel Sanctum)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">Content Format:</span>
            <span className="text-slate-300 font-semibold">application/json</span>
          </div>
        </div>
      </div>

      {/* Categories & Endpoints */}
      <div className="space-y-6">
        {API_ENDPOINTS.map((cat, catIdx) => (
          <div key={cat.category} className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>{cat.category}</span>
            </h2>

            <div className="space-y-3">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const isExpanded = expandedEndpoints[key] ?? true;

                const methodBadgeColor = 
                  item.method === 'GET' ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
                  item.method === 'POST' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  item.method === 'PUT' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                  item.method === 'PATCH' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                  'bg-rose-500/15 text-rose-400 border-rose-500/30';

                return (
                  <div 
                    key={item.path} 
                    className="glass-panel rounded-2xl border border-slate-800 overflow-hidden"
                  >
                    <div 
                      onClick={() => toggleExpand(key)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${methodBadgeColor}`}>
                          {item.method}
                        </span>
                        <code className="text-sm font-mono font-semibold text-slate-200">
                          {item.path}
                        </code>
                        {item.auth && (
                          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            <Key className="w-2.5 h-2.5 mr-1" />
                            Auth Required
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-slate-400">
                        <span className="text-xs hidden md:inline text-slate-500">{item.desc}</span>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-5 pt-2 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
                        <p className="text-xs text-slate-400">{item.desc}</p>

                        {/* Request Body if applicable */}
                        {item.body && (
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              <span>Request Body (JSON)</span>
                              <button
                                onClick={() => handleCopy(item.body, `req-${key}`)}
                                className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                              >
                                {copiedIndex === `req-${key}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedIndex === `req-${key}` ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                              {item.body}
                            </pre>
                          </div>
                        )}

                        {/* Response Body if applicable */}
                        {item.response && (
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                              <span>Sample 200 Response</span>
                              <button
                                onClick={() => handleCopy(item.response, `res-${key}`)}
                                className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                              >
                                {copiedIndex === `res-${key}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedIndex === `res-${key}` ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                              {item.response}
                            </pre>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
