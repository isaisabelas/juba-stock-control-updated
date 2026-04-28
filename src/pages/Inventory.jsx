import React, { useState, useEffect, useMemo } from 'react';
import '../styles/Inventory.css';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import Modal from '../components/Modal';
import MovementModal from '../components/MovementModal';
import { api } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { DEFAULT_MIN_QUANTITY } from '../utils/constants';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [movementItem, setMovementItem] = useState(null);
  const [showMovementModal, setShowMovementModal] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/items');
      setItems(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/items/${editingItem.id}`, formData);
        setItems(
          items.map((item) =>
            item.id === editingItem.id ? { ...item, ...formData } : item
          )
        );
        setEditingItem(null);
      } else {
        const response = await api.post('/items', formData);
        setItems([response.data, ...items]);
      }
      setShowForm(false);
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Erro ao salvar item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este item?')) {
      return;
    }

    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Erro ao deletar item:', err);
    }
  };

  const handleMovementSuccess = (updatedItem) => {
    setItems(
      items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setShowMovementModal(false);
    setMovementItem(null);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.category?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesFilter = !filterLowStock || item.quantity <= (item.min_quantity || DEFAULT_MIN_QUANTITY);

      return matchesSearch && matchesFilter;
    });
  }, [items, debouncedSearch, filterLowStock]);

  const lowStockCount = useMemo(() => {
    return items.filter((item) => item.quantity <= (item.min_quantity || DEFAULT_MIN_QUANTITY)).length;
  }, [items]);

  return (
    <div className="inventory-container">
      <div className="inventory-main">
        <div className="inventory-header">
          <h1>Produtos</h1>
          <p>Gerencie cadastro, estoque e movimentações dos itens.</p>
        </div>

        <div className="inventory-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-buttons">
            <button
              className={`btn ${filterLowStock ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterLowStock(!filterLowStock)}
            >
              🚨 Estoque Baixo {lowStockCount > 0 && `(${lowStockCount})`}
            </button>
            <button
              className="btn btn-primary btn-add"
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
            >
              ➕ Novo Item
            </button>
          </div>
        </div>

        <ItemList
          items={filteredItems}
          loading={loading}
          onEdit={(item) => {
            setEditingItem(item);
            setShowForm(true);
          }}
          onDelete={handleDeleteItem}
          onMovement={(item) => {
            setMovementItem(item);
            setShowMovementModal(true);
          }}
        />
      </div>

      <Modal
        isOpen={showForm}
        title={editingItem ? '✏️ Editar Item' : '➕ Novo Item'}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
      >
        <ItemForm
          initialData={editingItem}
          onSubmit={handleAddItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      </Modal>

      <MovementModal
        isOpen={showMovementModal}
        itemId={movementItem?.id}
        itemName={movementItem?.name}
        currentQuantity={movementItem?.quantity || 0}
        onClose={() => {
          setShowMovementModal(false);
          setMovementItem(null);
        }}
        onMovementSuccess={handleMovementSuccess}
      />
    </div>
  );
}
