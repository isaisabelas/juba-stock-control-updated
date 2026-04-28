import React, { useState } from 'react';
import '../styles/ItemForm.css';

export default function ItemForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      quantity: '',
      price: '',
      min_quantity: '10',
      unit: 'kg',
      category: 'Café',
      supplier: '',
      notes: '',
    }
  );

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.quantity === '') {
      setError('Nome e quantidade são obrigatórios');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        quantity: '',
        price: '',
        min_quantity: '10',
        unit: 'kg',
        category: 'Café',
        supplier: '',
        notes: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="item-form-container">
      <form className="item-form" onSubmit={handleSubmit}>
        <h2>{initialData ? '✏️ Editar Item' : '➕ Novo Item'}</h2>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label>Nome do Produto *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Café Arábica Premium"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantidade *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Preço Unitário (R$)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Quantidade Mínima</label>
            <input
              type="number"
              name="min_quantity"
              value={formData.min_quantity}
              onChange={handleChange}
              placeholder="10"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Unidade</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="unid">unidade</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Categoria</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Café">Café</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Higiene">Higiene</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fornecedor</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Ex: Cafeicultores Brasil"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Observações</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notas adicionais sobre o produto"
            rows="3"
          ></textarea>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {initialData ? '💾 Atualizar' : '➕ Adicionar'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
