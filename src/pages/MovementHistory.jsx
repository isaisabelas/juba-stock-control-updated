import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/MovementHistory.css';
import { formatDateTime } from '../utils/formatters';
import { MOVEMENT_TYPES } from '../utils/constants';

const MovementHistory = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/history/all');
      setMovements(response.data);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar movimentos
  const filteredMovements = movements.filter(movement => {
    const matchesType = filter === 'todos' || movement.type === filter;
    const matchesItem = (movement.item_name || '').toLowerCase().includes(searchItem.toLowerCase());
    return matchesType && matchesItem;
  });

  const getTypeBadge = (type) => {
    const info = MOVEMENT_TYPES[type];
    return info ? { label: info.label, color: info.color } : { label: type, color: '#6b7280' };
  };

  return (
    <div className="movement-history-container">
      <div className="history-header">
        <h1>📦 Histórico de Movimentações</h1>
        <p>Rastreie todas as entradas, saídas e ajustes de quantidade dos seus items</p>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="filter-type">Tipo de Movimentação:</label>
          <select
            id="filter-type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ajuste">Ajuste</option>
            <option value="criacao">Criação</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-item">Buscar Item:</label>
          <input
            id="search-item"
            type="text"
            placeholder="Digite o nome do item..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="refresh-btn" onClick={fetchMovements} disabled={loading}>
          🔄 Atualizar
        </button>
      </div>

      {/* Tabela de movimentos */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Carregando histórico...</div>
        ) : filteredMovements.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma movimentação encontrada</p>
          </div>
        ) : (
          <table className="movements-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Item</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Motivo</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((movement) => {
                const typeBadge = getTypeBadge(movement.type);
                return (
                  <tr key={movement.id} className={`row-${movement.type}`}>
                    <td className="date-cell">{formatDateTime(movement.created_at)}</td>
                    <td className="item-cell">
                      <strong>{movement.item_name}</strong>
                      {movement.unit && <span className="unit">({movement.unit})</span>}
                    </td>
                    <td className="type-cell">
                      <span
                        className="badge"
                        style={{ backgroundColor: typeBadge.color }}
                      >
                        {typeBadge.label}
                      </span>
                    </td>
                    <td className="quantity-cell">
                      <strong>{movement.quantity.toFixed(2)}</strong>
                    </td>
                    <td className="reason-cell">
                      {movement.reason ? (
                        <span className="reason-badge">{movement.reason}</span>
                      ) : (
                        <span className="reason-empty">-</span>
                      )}
                    </td>
                    <td className="notes-cell">
                      {movement.notes ? movement.notes : <span className="notes-empty">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Resumo */}
      {filteredMovements.length > 0 && (
        <div className="summary-section">
          <h3>📊 Resumo dos Filtrados</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total de Movimentações:</span>
              <span className="stat-value">{filteredMovements.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Entrado:</span>
              <span className="stat-value" style={{ color: '#10b981' }}>
                {filteredMovements
                  .filter((m) => m.type === 'entrada' || m.type === 'criacao')
                  .reduce((sum, m) => sum + m.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Saído:</span>
              <span className="stat-value" style={{ color: '#ef4444' }}>
                {filteredMovements
                  .filter((m) => m.type === 'saida')
                  .reduce((sum, m) => sum + m.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementHistory;
