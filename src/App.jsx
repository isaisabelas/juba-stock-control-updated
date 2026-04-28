import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Global.css';
import './styles/Layout.css';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Fornecedores from './pages/Fornecedores';
import MovementHistory from './pages/MovementHistory';
import Reports from './pages/Reports';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Auth
import { useAuth } from './contexts/AuthContext';

// Protected Route using AuthContext
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Layout Component for Authenticated Pages
function AuthenticatedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-content">
        <Header user={user} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/inventory" /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/inventory" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/inventory" /> : <Register />} />

        {/* Protected Routes with Sidebar */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Inventory />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fornecedores"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Fornecedores />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        {/* /historico redirects to /movimentacoes to avoid duplicate page */}
        <Route path="/historico" element={<Navigate to="/movimentacoes" replace />} />
        <Route
          path="/movimentacoes"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <MovementHistory />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Reports />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
