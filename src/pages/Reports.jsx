import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import '../styles/Reports.css';
import { formatCurrency } from '../utils/formatters';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('summary');
  const [summaryData, setSummaryData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [inventoryValue, setInventoryValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadAllReports = useCallback(async () => {
    setLoading(true);
    try {
      // Construir query params se datas forem fornecidas
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Carregar todos os relatórios em paralelo
      const [summaryRes, categoryRes, lowStockRes, inventoryRes] = await Promise.all([
        api.get('/items/reports/summary', { params }),
        api.get('/items/reports/by-category', { params }),
        api.get('/items/reports/low-stock', { params }),
        api.get('/items/reports/inventory-value', { params }),
      ]);

      setSummaryData(summaryRes.data);
      setCategoryData(categoryRes.data || []);
      setLowStockData(lowStockRes.data || []);
      setInventoryValue(inventoryRes.data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadAllReports();
  }, [loadAllReports]);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-top">
          <h1>📊 Relatórios e Análises</h1>
          <p>Visualize dados agregados e métricas do seu inventário</p>
        </div>

        {/* Filtro de Data */}
        <div className="date-filter">
          <div className="date-inputs">
            <div className="input-group">
              <label htmlFor="startDate">De:</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="endDate">Até:</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button 
              className="filter-btn" 
              onClick={loadAllReports}
              disabled={loading}
            >
              🔍 Filtrar
            </button>

            <button 
              className="clear-btn" 
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
            >
              ✕ Limpar
            </button>
          </div>

          {(startDate || endDate) && (
            <div className="active-filter">
              📅 Período: {startDate || 'Início'} até {endDate || 'Fim'}
            </div>
          )}
        </div>

        <button className="refresh-btn" onClick={loadAllReports} disabled={loading}>
          🔄 Atualizar
        </button>
      </div>

      {/* Abas de Navegação */}
      <div className="reports-tabs">
        <button
          className={`tab ${activeReport === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveReport('summary')}
        >
          📈 Sumário Geral
        </button>
        <button
          className={`tab ${activeReport === 'category' ? 'active' : ''}`}
          onClick={() => setActiveReport('category')}
        >
          📂 Gastos por Categoria
        </button>
        <button
          className={`tab ${activeReport === 'low-stock' ? 'active' : ''}`}
          onClick={() => setActiveReport('low-stock')}
        >
          🚨 Estoque Baixo
        </button>
        <button
          className={`tab ${activeReport === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveReport('inventory')}
        >
          💰 Valor do Inventário
        </button>
      </div>

      {loading && <div className="loading-spinner">Carregando relatórios...</div>}

      {/* SUMÁRIO GERAL */}
      {activeReport === 'summary' && summaryData && (
        <div className="report-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>Total de Itens</h3>
                <p className="stat-value">{summaryData.total_items}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚖️</div>
              <div className="stat-info">
                <h3>Quantidade Total</h3>
                <p className="stat-value">{summaryData.total_quantity.toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Valor Total</h3>
                <p className="stat-value">{formatCurrency(summaryData.total_value)}</p>
              </div>
            </div>

            <div className="stat-card alert">
              <div className="stat-icon">🚨</div>
              <div className="stat-info">
                <h3>Itens em Estoque Baixo</h3>
                <p className="stat-value">{summaryData.low_stock_count}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Preço Médio</h3>
                <p className="stat-value">{formatCurrency(summaryData.avg_price)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3>Quantidade Média</h3>
                <p className="stat-value">{summaryData.avg_quantity.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GASTOS POR CATEGORIA */}
      {activeReport === 'category' && categoryData.length > 0 && (
        <div className="report-content">
          <h2>💰 Gasto por Categoria</h2>
          <div className="table-responsive">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Total de Itens</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário Médio</th>
                  <th>Valor Total</th>
                  <th>% do Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category, index) => {
                  const totalValue = summaryData?.total_value || 1;
                  const percentage = ((category.total_value / totalValue) * 100).toFixed(1);
                  return (
                    <tr key={index}>
                      <td className="category-col">
                        <span className="category-badge">{category.category || 'Sem Categoria'}</span>
                      </td>
                      <td className="center">{category.total_items}</td>
                      <td className="center">{category.total_quantity.toFixed(2)}</td>
                      <td className="currency">{formatCurrency(category.avg_price)}</td>
                      <td className="currency highlight">{formatCurrency(category.total_value)}</td>
                      <td className="center percentage">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mini Gráfico de Pizza */}
          <div className="chart-container">
            <h3>Distribuição de Gastos</h3>
            <div className="pie-chart">
              {categoryData.map((category, index) => {
                const totalValue = summaryData?.total_value || 1;
                const percentage = ((category.total_value / totalValue) * 100).toFixed(1);
                const colors = [
                  '#3b82f6',
                  '#10b981',
                  '#f59e0b',
                  '#ef4444',
                  '#8b5cf6',
                  '#ec4899',
                ];
                return (
                  <div
                    key={index}
                    className="pie-segment"
                    style={{
                      backgroundColor: colors[index % colors.length],
                      flex: percentage,
                    }}
                    title={`${category.category}: ${percentage}%`}
                  />
                );
              })}
            </div>
            <div className="legend">
              {categoryData.map((category, index) => {
                const totalValue = summaryData?.total_value || 1;
                const percentage = ((category.total_value / totalValue) * 100).toFixed(1);
                const colors = [
                  '#3b82f6',
                  '#10b981',
                  '#f59e0b',
                  '#ef4444',
                  '#8b5cf6',
                  '#ec4899',
                ];
                return (
                  <div key={index} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="legend-text">{category.category || 'Sem Categoria'}</span>
                    <span className="legend-percentage">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ESTOQUE BAIXO */}
      {activeReport === 'low-stock' && (
        <div className="report-content">
          <h2>🚨 Itens com Estoque Baixo</h2>
          {lowStockData.length === 0 ? (
            <div className="empty-state">
              <p>✅ Nenhum item com estoque baixo! Seu inventário está saudável.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="reports-table alert-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade Atual</th>
                    <th>Quantidade Mínima</th>
                    <th>Déficit</th>
                    <th>Categoria</th>
                    <th>Preço Unitário</th>
                    <th>Valor em Falta</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockData.map((item) => (
                    <tr key={item.id} className="alert-row">
                      <td className="item-name">
                        <strong>{item.name}</strong>
                        <span className="unit">({item.unit})</span>
                      </td>
                      <td className="center">
                        <span className="quantity-low">{item.quantity.toFixed(2)}</span>
                      </td>
                      <td className="center">{item.min_quantity.toFixed(2)}</td>
                      <td className="center">
                        <span className="deficit-badge">{item.deficit.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td className="currency">{formatCurrency(item.price)}</td>
                      <td className="currency deficit-value">
                        {formatCurrency(item.deficit * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VALOR DO INVENTÁRIO */}
      {activeReport === 'inventory' && inventoryValue && (
        <div className="report-content">
          <h2>💰 Valor do Inventário</h2>
          <div className="inventory-details">
            <div className="detail-card">
              <h3>Sumário Financeiro</h3>
              <div className="detail-row">
                <span className="label">Total de Itens:</span>
                <span className="value">{inventoryValue.total_items || 0}</span>
              </div>
              <div className="detail-row">
                <span className="label">Quantidade Total:</span>
                <span className="value">{(inventoryValue.total_quantity || 0).toFixed(2)}</span>
              </div>
              <div className="detail-row highlight">
                <span className="label">Valor Total do Inventário:</span>
                <span className="value">{formatCurrency(inventoryValue.total_value)}</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Estatísticas de Preço</h3>
              <div className="detail-row">
                <span className="label">Preço Mínimo:</span>
                <span className="value">{formatCurrency(inventoryValue.min_price)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Preço Médio:</span>
                <span className="value">{formatCurrency(inventoryValue.avg_price)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Preço Máximo:</span>
                <span className="value">{formatCurrency(inventoryValue.max_price)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
