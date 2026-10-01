import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Kanban, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      const destination = location.state?.from?.pathname || (user.role === 'admin' ? '/admin-dashboard' : '/member-dashboard');
      navigate(destination);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAndLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(demoEmail, demoPassword);
      const destination = user.role === 'admin' ? '/admin-dashboard' : '/member-dashboard';
      navigate(destination);
    } catch (err) {
      console.error(err);
      setError('Failed to login with demo credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/25 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Kanban className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Task<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Flow</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Full-Stack Agile Task & Project Management Workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-slate-800">
          
          {error && (
            <div id="login-error-alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Logins */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Quick Demo Accounts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="demo-login-admin-btn"
                type="button"
                onClick={() => fillAndLogin('admin@taskmanager.com', 'password123')}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-rose-500/30 hover:border-rose-500/60 text-xs font-medium text-rose-300 transition-all cursor-pointer text-left"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Admin</div>
                  <div className="text-[10px] text-slate-400">Full System Access</div>
                </div>
              </button>

              <button
                id="demo-login-member-btn"
                type="button"
                onClick={() => fillAndLogin('john@taskmanager.com', 'password123')}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-500/60 text-xs font-medium text-cyan-300 transition-all cursor-pointer text-left"
              >
                <UserCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Member</div>
                  <div className="text-[10px] text-slate-400">John (Developer)</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link id="go-to-register-link" to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create new account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
