import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">☕ JUBA</h2>
          <p className="sidebar-subtitle">Controle de Estoque</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-section-title">MENU</p>

            <Link
              to="/inventory"
              className={`nav-item ${isActive('/inventory') ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Dashboard</span>
            </Link>

            <Link
              to="/produtos"
              className={`nav-item ${isActive('/produtos') ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-label">Produtos</span>
            </Link>

            <Link
              to="/fornecedores"
              className={`nav-item ${isActive('/fornecedores') ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">🏭</span>
              <span className="nav-label">Fornecedores</span>
            </Link>

            <Link
              to="/movimentacoes"
              className={`nav-item ${isActive('/movimentacoes') ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">📜</span>
              <span className="nav-label">Movimentações</span>
            </Link>
          </div>

          <div className="nav-section">
            <p className="nav-section-title">FERRAMENTAS</p>

            <Link
              to="/relatorios"
              className={`nav-item ${isActive('/relatorios') ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-label">Relatórios</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
