import React, { useState, useEffect } from 'react';
import '../styles/Fornecedores.css';
import Modal from '../components/Modal';
import { api } from '../services/api';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    categoria: '',
    ativo: true,
  });

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers');
      setFornecedores(response.data || []);
    } catch (err) {
      setError('Erro ao carregar fornecedores');
      console.error('Erro ao carregar fornecedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', telefone: '', categoria: '', ativo: true });
    setEditingSupplier(null);
    setShowForm(false);
    setError(null);
  };

  const handleAddFornecedor = async () => {
    if (!formData.nome.trim()) {
      setError('Nome do fornecedor é obrigatório');
      return;
    }

    try {
      setError(null);
      const response = await api.post('/suppliers', formData);
      setFornecedores([...fornecedores, response.data]);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar fornecedor');
    }
  };

  const handleEditFornecedor = (fornecedor) => {
    setEditingSupplier(fornecedor);
    setFormData({
      nome: fornecedor.nome,
      email: fornecedor.email || '',
      telefone: fornecedor.telefone || '',
      categoria: fornecedor.categoria || '',
      ativo: !!fornecedor.ativo,
    });
    setShowForm(true);
  };

  const handleUpdateFornecedor = async () => {
    if (!formData.nome.trim()) {
      setError('Nome do fornecedor é obrigatório');
      return;
    }

    try {
      setError(null);
      const response = await api.put(`/suppliers/${editingSupplier.id}`, formData);
      setFornecedores(
        fornecedores.map(f => (f.id === editingSupplier.id ? response.data : f))
      );
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar fornecedor');
    }
  };

  const handleDeleteFornecedor = async (id) => {
    if (!window.confirm('Deseja deletar este fornecedor?')) return;

    try {
      await api.delete(`/suppliers/${id}`);
      setFornecedores(fornecedores.filter(f => f.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao deletar fornecedor');
    }
  };

  if (loading) {
    return <div className="fornecedores-container"><div className="loading">Carregando fornecedores...</div></div>;
  }

  return (
    <div className="fornecedores-container">
      <div className="fornecedores-main">
        <div className="fornecedores-header">
          <h1>🏭 Gerenciar Fornecedores</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Novo Fornecedor
          </button>
        </div>

        {/* Resumo Rápido */}
        <div className="fornecedores-summary">
          <div className="summary-card">
            <h3>{fornecedores.length}</h3>
            <p>Total de Fornecedores</p>
          </div>
          <div className="summary-card">
            <h3>{fornecedores.filter(f => f.ativo).length}</h3>
            <p>Fornecedores Ativos</p>
          </div>
          <div className="summary-card">
            <h3>{fornecedores.filter(f => !f.ativo).length}</h3>
            <p>Fornecedores Inativos</p>
          </div>
        </div>

        {/* Tabela de Fornecedores */}
        <div className="fornecedores-table-wrapper">
          <table className="fornecedores-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map(fornecedor => (
                <tr key={fornecedor.id}>
                  <td className="cell-nome">
                    <strong>{fornecedor.nome}</strong>
                  </td>
                  <td>{fornecedor.email}</td>
                  <td>{fornecedor.telefone}</td>
                  <td>
                    <span className="badge">{fornecedor.categoria}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${fornecedor.ativo ? 'active' : 'inactive'}`}>
                      {fornecedor.ativo ? '✅ Ativo' : '❌ Inativo'}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleEditFornecedor(fornecedor)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDeleteFornecedor(fornecedor.id)}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showForm}
        title={editingSupplier ? '✏️ Editar Fornecedor' : '➕ Novo Fornecedor'}
        onClose={resetForm}
      >
          {error && <div className="form-error" style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

          <form className="fornecedor-form">
            <div className="form-group">
              <label>Nome do Fornecedor *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Café Premium Ltda"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@fornecedor.com"
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="form-group">
              <label>Categoria de Produtos</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Equipamentos">Equipamentos</option>
                <option value="Limpeza">Limpeza</option>
              </select>
            </div>

            <div className="form-group form-checkbox">
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              />
              <label>Fornecedor ativo</label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={editingSupplier ? handleUpdateFornecedor : handleAddFornecedor}
              >
                {editingSupplier ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
