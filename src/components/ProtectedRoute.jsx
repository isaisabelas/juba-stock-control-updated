import React from 'react';
import '../styles/ProtectedRoute.css';

export default function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return (
      <div className="protected-route">
        <h2>Acesso Negado</h2>
        <p>Você precisa estar autenticado para acessar esta página.</p>
      </div>
    );
  }
  return children;
}
