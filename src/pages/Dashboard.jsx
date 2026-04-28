import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { api } from '../services/api';
import { DEFAULT_MIN_QUANTITY } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/items');
        setItems(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
    const totalValue = items.reduce(
      (acc, item) => acc + Number(item.quantity || 0) * Number(item.price || 0),
      0
    );
    const lowStock = items.filter(
      (item) => Number(item.quantity || 0) <= Number(item.min_quantity || DEFAULT_MIN_QUANTITY)
    ).length;

    return { totalItems, totalQuantity, totalValue, lowStock };
  }, [items]);

  const recentItems = useMemo(() => {
    return [...items].sort((a, b) => b.id - a.id).slice(0, 6);
  }, [items]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Visão rápida do seu estoque e status operacional.</p>
        </div>

        <div className="dashboard-kpis">
          <StatsCard icon="📦" title="Total de Itens" value={stats.totalItems} color="blue" />
          <StatsCard
            icon="⚖️"
            title="Quantidade Total"
            value={stats.totalQuantity.toFixed(2)}
            color="green"
          />
          <StatsCard icon="💰" title="Valor em Estoque" value={formatCurrency(stats.totalValue)} color="orange" />
          <StatsCard icon="🚨" title="Estoque Baixo" value={stats.lowStock} color="red" />
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-card dashboard-card--wide">
            <div className="dashboard-card__header">
              <h2>Produtos recentes</h2>
              <Link to="/produtos" className="dashboard-link">
                Ver todos
              </Link>
            </div>

            {loading ? (
              <p className="dashboard-placeholder">Carregando dados...</p>
            ) : recentItems.length === 0 ? (
              <p className="dashboard-placeholder">Nenhum produto cadastrado ainda.</p>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category || 'Sem categoria'}</td>
                        <td>{Number(item.quantity || 0).toFixed(2)}</td>
                        <td>{formatCurrency(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Ações rápidas</h2>
            </div>
            <div className="dashboard-actions">
              <Link to="/produtos" className="quick-action quick-action--primary">
                ➕ Cadastrar produto
              </Link>
              <Link to="/movimentacoes" className="quick-action">
                🔄 Registrar movimentação
              </Link>
              <Link to="/relatorios" className="quick-action">
                📈 Abrir relatórios
              </Link>
              <Link to="/fornecedores" className="quick-action">
                🏭 Gerenciar fornecedores
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
