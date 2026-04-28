const express = require('express');
const { dbRun, dbGet, dbAll, dbTransaction } = require('../db/database');
const authMiddleware = require('../middleware/auth');
const config = require('../config');

const router = express.Router();

// Helper - Registrar movimentação
async function logMovement(itemId, userId, type, quantity, reason = null, notes = null) {
  await dbRun(
    'INSERT INTO item_movements (item_id, user_id, type, quantity, reason, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [itemId, userId, type, quantity, reason, notes]
  );
}

// Get all items for user (with pagination)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 100));
    const offset = (page - 1) * limit;

    const items = await dbAll(
      'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.userId, limit, offset]
    );
    res.json(items);
  } catch (err) {
    console.error('Erro ao buscar itens:', err);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

// Create item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, quantity, price, unit, category, supplier, notes, min_quantity } = req.body;

    if (!name || quantity === undefined || quantity === null || quantity === '') {
      return res.status(400).json({ error: 'Nome e quantidade são obrigatórios' });
    }

    const quantityNum = parseFloat(quantity);
    const minQuantityNum = min_quantity ? parseFloat(min_quantity) : config.defaultMinQuantity;
    const priceNum = price ? parseFloat(price) : 0;

    if (isNaN(quantityNum)) {
      return res.status(400).json({ error: 'Quantidade deve ser um número válido' });
    }

    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: 'Preço deve ser um número válido' });
    }

    const newItem = await dbTransaction(async () => {
      const result = await dbRun(
        'INSERT INTO items (user_id, name, quantity, price, unit, category, supplier, notes, min_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.userId, name, quantityNum, priceNum, unit || null, category || null, supplier || null, notes || null, minQuantityNum]
      );

      await logMovement(result.lastID, req.userId, 'entrada', quantityNum, 'criacao', notes);

      return await dbGet('SELECT * FROM items WHERE id = ?', [result.lastID]);
    });

    res.json(newItem);
  } catch (err) {
    console.error('Erro ao criar item:', err);
    res.status(500).json({ error: 'Erro ao criar item' });
  }
});

// Update item
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, quantity, price, unit, category, supplier, notes, min_quantity } = req.body;

    const currentItem = await dbGet(
      'SELECT quantity FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!currentItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    const quantityNum = parseFloat(quantity);
    const priceNum = price ? parseFloat(price) : 0;
    const quantityDifference = quantityNum - currentItem.quantity;

    await dbTransaction(async () => {
      await dbRun(
        'UPDATE items SET name = ?, quantity = ?, price = ?, unit = ?, category = ?, supplier = ?, notes = ?, min_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [name, quantityNum, priceNum, unit, category, supplier, notes, min_quantity || config.defaultMinQuantity, req.params.id, req.userId]
      );

      if (quantityDifference !== 0) {
        const movementType = quantityDifference > 0 ? 'entrada' : 'saida';
        await logMovement(req.params.id, req.userId, movementType, Math.abs(quantityDifference), 'ajuste_quantidade', notes);
      }
    });

    res.json({ message: 'Item atualizado' });
  } catch (err) {
    console.error('Erro ao atualizar item:', err);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

// Delete item (cascade: also deletes movements)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await dbGet(
      'SELECT id FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    await dbTransaction(async () => {
      await dbRun('DELETE FROM item_movements WHERE item_id = ?', [req.params.id]);
      await dbRun('DELETE FROM items WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    });

    res.json({ message: 'Item deletado' });
  } catch (err) {
    console.error('Erro ao deletar item:', err);
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
});

// Get movement history for a specific item
router.get('/:id/movements', authMiddleware, async (req, res) => {
  try {
    const movements = await dbAll(
      `SELECT m.* FROM item_movements m 
       INNER JOIN items i ON m.item_id = i.id 
       WHERE m.item_id = ? AND i.user_id = ?
       ORDER BY m.created_at DESC`,
      [req.params.id, req.userId]
    );
    res.json(movements);
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});

// Get all movements for user (with pagination)
router.get('/history/all', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 200));
    const offset = (page - 1) * limit;

    const movements = await dbAll(
      `SELECT m.*, i.name as item_name, i.unit FROM item_movements m
       INNER JOIN items i ON m.item_id = i.id
       WHERE m.user_id = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.userId, limit, offset]
    );
    res.json(movements);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

// Create movement (entrada ou saída) — with transaction
router.post('/:id/movements', authMiddleware, async (req, res) => {
  try {
    const { type, quantity, reason, notes } = req.body;
    const quantityNum = parseFloat(quantity);

    if (!type || !quantity || isNaN(quantityNum)) {
      return res.status(400).json({ error: 'Tipo e quantidade são obrigatórios' });
    }

    if (!['entrada', 'saida', 'ajuste'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido. Use: entrada, saida ou ajuste' });
    }

    const currentItem = await dbGet(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!currentItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    const newQuantity = type === 'entrada'
      ? currentItem.quantity + quantityNum
      : type === 'saida'
      ? currentItem.quantity - quantityNum
      : quantityNum;

    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Quantidade não pode ser negativa' });
    }

    const updatedItem = await dbTransaction(async () => {
      await logMovement(req.params.id, req.userId, type, quantityNum, reason, notes);
      await dbRun(
        'UPDATE items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, req.params.id]
      );
      return await dbGet('SELECT * FROM items WHERE id = ?', [req.params.id]);
    });

    res.json({
      message: 'Movimentação registrada com sucesso',
      item: updatedItem
    });
  } catch (err) {
    console.error('Erro ao registrar movimentação:', err);
    res.status(500).json({ error: 'Erro ao registrar movimentação' });
  }
});

// REPORTS - Gasto por Categoria
router.get('/reports/by-category', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = `SELECT 
        category,
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        SUM(quantity * price) as total_value,
        AVG(price) as avg_price
      FROM items
      WHERE user_id = ?`;
    const params = [req.userId];

    if (startDate && endDate) {
      query += ` AND DATE(created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    query += ` GROUP BY category ORDER BY total_value DESC`;

    const reportData = await dbAll(query, params);
    res.json(reportData);
  } catch (err) {
    console.error('Erro ao gerar relatório por categoria:', err);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// REPORTS - Itens com Estoque Baixo
router.get('/reports/low-stock', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = `SELECT 
        id, name, quantity, min_quantity, unit, category, price,
        (min_quantity - quantity) as deficit
      FROM items
      WHERE user_id = ? AND quantity <= min_quantity`;
    const params = [req.userId];

    if (startDate && endDate) {
      query += ` AND DATE(created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    query += ` ORDER BY deficit DESC`;

    const reportData = await dbAll(query, params);
    res.json(reportData);
  } catch (err) {
    console.error('Erro ao gerar relatório de estoque baixo:', err);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// REPORTS - Valor Total do Inventário
router.get('/reports/inventory-value', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = `SELECT 
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        SUM(quantity * price) as total_value,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM items
      WHERE user_id = ?`;
    const params = [req.userId];

    if (startDate && endDate) {
      query += ` AND DATE(created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const summary = await dbGet(query, params);
    res.json(summary);
  } catch (err) {
    console.error('Erro ao gerar relatório de valor:', err);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// REPORTS - Sumário Geral
router.get('/reports/summary', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `SELECT id, quantity, price, min_quantity FROM items WHERE user_id = ?`;
    const params = [req.userId];

    if (startDate && endDate) {
      query += ` AND DATE(created_at) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const items = await dbAll(query, params);

    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockCount = items.filter(item => item.quantity <= item.min_quantity).length;

    const summary = {
      total_items: totalItems,
      total_quantity: totalQuantity,
      total_value: totalValue,
      low_stock_count: lowStockCount,
      avg_price: totalItems > 0 ? items.reduce((sum, item) => sum + item.price, 0) / totalItems : 0,
      avg_quantity: totalItems > 0 ? totalQuantity / totalItems : 0,
    };

    res.json(summary);
  } catch (err) {
    console.error('Erro ao gerar sumário:', err);
    res.status(500).json({ error: 'Erro ao gerar sumário' });
  }
});

module.exports = router;
