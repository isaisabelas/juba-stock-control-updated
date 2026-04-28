import React from 'react';
import '../styles/Header.css';

export default function Header({ user, onLogout, onMenuToggle }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          {onMenuToggle && (
            <button className="btn-menu" onClick={onMenuToggle} title="Menu">
              ☰
            </button>
          )}
          <h1 className="header-title">☕ JUBA ESTOQUE</h1>
        </div>
        <div className="header-right">
          {user && (
            <>
              {user.name && (
                <div className="user-info">
                  <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
                </div>
              )}
              <button className="btn-logout" onClick={onLogout}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
