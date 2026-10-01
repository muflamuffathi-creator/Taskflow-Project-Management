import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MemberDashboardPage from './pages/MemberDashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import KanbanBoardPage from './pages/KanbanBoardPage';
import ApiDocsPage from './pages/ApiDocsPage';

function DashboardRedirector() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboardPage /> : <MemberDashboardPage />;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 pb-16">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRedirector />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/member-dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <MemberDashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Layout>
                  <KanbanBoardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/api-docs"
            element={
              <ProtectedRoute>
                <Layout>
                  <ApiDocsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
