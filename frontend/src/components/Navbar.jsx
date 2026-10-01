import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Kanban, 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  FileCode2,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Kanban className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-white tracking-tight">TaskFlow</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
              </div>
              <p className="text-[10px] text-slate-400">Jira & Trello Management</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/') || isActive('/admin-dashboard') || isActive('/member-dashboard')
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/projects"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/projects')
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </Link>

            <Link
              to="/kanban"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/kanban')
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban Board</span>
            </Link>

            <Link
              to="/api-docs"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/api-docs')
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Postman API</span>
            </Link>
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full ring-2 ring-indigo-500/40 bg-slate-800 object-cover"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                    <span>{user.name}</span>
                  </div>
                  <div className="mt-0.5">
                    {isAdmin ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        <UserCheck className="w-2.5 h-2.5 mr-1" />
                        Team Member
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
