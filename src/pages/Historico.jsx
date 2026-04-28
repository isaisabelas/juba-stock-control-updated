import React, { useState } from 'react';
import '../styles/Historico.css';

export default function Historico({ user, onLogout }) {
  const [movimentacoes] = useState([
    {
      id: 1,
      tipo: 'entrada',
      produto: 'Café Arábica',
      quantidade: 20,
      unidade: 'kg',
      data: '2026-03-19',
      hora: '10:30',
      motivo: 'Compra - Fornecedor: Café Premium',
      usuario: 'Julia',
    },
    {
      id: 2,
      tipo: 'saida',
      produto: 'Leite Integral',
      quantidade: 5,
      unidade: 'L',
      data: '2026-03-19',
      hora: '09:15',
      motivo: 'Venda/Uso',
      usuario: 'Julia',
    },
    {
      id: 3,
      tipo: 'ajuste',
      produto: 'Açúcar Cristal',
      quantidade: -2,
      unidade: 'kg',
      data: '2026-03-18',
      hora: '14:45',
      motivo: 'Ajuste de inventário - Produto danificado',
      usuario: 'Julia',
    },
    {
      id: 4,
      tipo: 'entrada',
      produto: 'Café Robusta',
      quantidade: 15,
      unidade: 'kg',
      data: '2026-03-18',
      hora: '11:00',
      motivo: 'Compra - Fornecedor: Alimentos Nordeste',
      usuario: 'Julia',
    },
    {
      id: 5,
      tipo: 'saida',
      produto: 'Chocolate em Pó',
      quantidade: 3,
      unidade: 'kg',
      data: '2026-03-17',
      hora: '16:20',
      motivo: 'Venda/Uso',
      usuario: 'Julia',
    },
  ]);

  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [buscaProduto, setBuscaProduto] = useState('');

  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const tipoMatch = filtroTipo === 'todos' || mov.tipo === filtroTipo;
    const produtoMatch = mov.produto.toLowerCase().includes(buscaProduto.toLowerCase());
    return tipoMatch && produtoMatch;
  });

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return '📥';
      case 'saida':
        return '📤';
      case 'ajuste':
        return '⚖️';
      default:
        return '📋';
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return 'entrada';
      case 'saida':
        return 'saida';
      case 'ajuste':
        return 'ajuste';
      default:
        return '';
    }
  };

  return (
    <div className="historico-container">
      <div className="historico-main">
        <div className="historico-header">
          <h1>📜 Histórico de Movimentações</h1>
          <button className="btn-export">
            📊 Exportar Relatório
          </button>
        </div>

        {/* Resumo de Movimentações */}
        <div className="movimentacoes-summary">
          <div className="summary-card">
            <div className="summary-icon entrada">📥</div>
            <div className="summary-info">
              <h3>Entradas</h3>
              <p>{movimentacoes.filter(m => m.tipo === 'entrada').length} movimentações</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon saida">📤</div>
            <div className="summary-info">
              <h3>Saídas</h3>
              <p>{movimentacoes.filter(m => m.tipo === 'saida').length} movimentações</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon ajuste">⚖️</div>
            <div className="summary-info">
              <h3>Ajustes</h3>
              <p>{movimentacoes.filter(m => m.tipo === 'ajuste').length} movimentações</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="historico-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Buscar por produto..."
              value={buscaProduto}
              onChange={(e) => setBuscaProduto(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="todos">Todos os tipos</option>
              <option value="entrada">📥 Entradas</option>
              <option value="saida">📤 Saídas</option>
              <option value="ajuste">⚖️ Ajustes</option>
            </select>
          </div>
        </div>

        {/* Timeline de Movimentações */}
        <div className="movimentacoes-timeline">
          {movimentacoesFiltradas.length > 0 ? (
            movimentacoesFiltradas.map((mov) => (
              <div key={mov.id} className={`timeline-item tipo-${getTipoBadge(mov.tipo)}`}>
                <div className="timeline-marker">{getTipoIcon(mov.tipo)}</div>
                
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-title">{mov.produto}</h3>
                      <p className="timeline-date">
                        📅 {new Date(mov.data).toLocaleDateString('pt-BR')} às {mov.hora}
                      </p>
                    </div>
                    <div className="timeline-quantity">
                      <span className={`quantity ${mov.tipo}`}>
                        {mov.tipo === 'entrada' ? '+' : ''}
                        {mov.tipo === 'saida' ? '-' : ''}
                        {Math.abs(mov.quantidade)} {mov.unidade}
                      </span>
                    </div>
                  </div>

                  <div className="timeline-details">
                    <p><strong>Motivo:</strong> {mov.motivo}</p>
                    <p><strong>Registrado por:</strong> {mov.usuario}</p>
                  </div>

                  <div className="timeline-badge">
                    <span className={`badge ${getTipoBadge(mov.tipo)}`}>
                      {getTipoIcon(mov.tipo)} {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>📭 Nenhuma movimentação encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
