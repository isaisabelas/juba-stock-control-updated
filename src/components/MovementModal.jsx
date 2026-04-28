import React, { useState } from 'react';
import { api } from '../services/api';
import Modal from './Modal';
import '../styles/MovementModal.css';

export default function MovementModal({ isOpen, itemId, itemName, currentQuantity, onClose, onMovementSuccess }) {
  const [type, setType] = useState('entrada');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/items/${itemId}/movements`, {
        type,
        quantity: parseFloat(quantity),
        reason: reason || null,
        notes: notes || null,
      });

      if (onMovementSuccess) {
        onMovementSuccess(response.data.item);
      }

      // Resetar formulário
      setType('entrada');
      setQuantity('');
      setReason('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Erro ao registrar movimentação:', err);
      setError(err.response?.data?.error || 'Erro ao registrar movimentação');
    } finally {
      setLoading(false);
    }
  };

  const calculateNewQuantity = () => {
    const qty = parseFloat(quantity) || 0;
    if (type === 'entrada') {
      return currentQuantity + qty;
    } else if (type === 'saida') {
      return currentQuantity - qty;
    } else {
      return qty;
    }
  };

  const newQuantity = calculateNewQuantity();

  return (
    <Modal
      isOpen={isOpen}
      title={`📦 Registrar Movimentação - ${itemName}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="movement-form">
        {/* Informações do Item */}
        <div className="item-info">
          <div className="info-row">
            <span className="info-label">Item:</span>
            <span className="info-value">{itemName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Quantidade Atual:</span>
            <span className="info-value current-qty">{currentQuantity.toFixed(2)}</span>
          </div>
          <div className="info-row highlight">
            <span className="info-label">Nova Quantidade:</span>
            <span className={`info-value new-qty ${newQuantity < 0 ? 'negative' : ''}`}>
              {newQuantity.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Tipo de Movimentação */}
        <div className="form-group">
          <label htmlFor="type">Tipo de Movimentação *</label>
          <div className="type-options">
            <button
              type="button"
              className={`type-btn ${type === 'entrada' ? 'active entrada' : ''}`}
              onClick={() => setType('entrada')}
            >
              📥 Entrada
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'saida' ? 'active saida' : ''}`}
              onClick={() => setType('saida')}
            >
              📤 Saída
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'ajuste' ? 'active ajuste' : ''}`}
              onClick={() => setType('ajuste')}
            >
              🔧 Ajuste
            </button>
          </div>
        </div>

        {/* Quantidade */}
        <div className="form-group">
          <label htmlFor="quantity">Quantidade *</label>
          <input
            id="quantity"
            type="number"
            step="0.01"
            min="0"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError(null);
            }}
            placeholder="0.00"
            required
            disabled={loading}
          />
        </div>

        {/* Motivo */}
        <div className="form-group">
          <label htmlFor="reason">Motivo</label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecione um motivo (opcional)</option>
            <option value="compra">Compra</option>
            <option value="venda">Venda</option>
            <option value="danos">Danos/Perdas</option>
            <option value="devolucao">Devolução</option>
            <option value="reposicao">Reposição</option>
            <option value="reajuste">Reajuste de Inventário</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Observações */}
        <div className="form-group">
          <label htmlFor="notes">Observações</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione observações sobre esta movimentação..."
            rows="3"
            disabled={loading}
          />
        </div>

        {/* Erro */}
        {error && <div className="error-message">{error}</div>}

        {/* Aviso de quantidade negativa */}
        {newQuantity < 0 && (
          <div className="warning-message">
            ⚠️ Atenção: A quantidade resultante será negativa!
          </div>
        )}

        {/* Botões */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || newQuantity < 0}
          >
            {loading ? 'Registrando...' : 'Registrar Movimentação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
