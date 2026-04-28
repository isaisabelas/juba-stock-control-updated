const express = require('express');
const { dbRun, dbGet, dbAll } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all suppliers for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const suppliers = await dbAll(
      'SELECT * FROM suppliers WHERE user_id = ? ORDER BY nome ASC',
      [req.userId]
    );
    res.json(suppliers);
  } catch (err) {
    console.error('Erro ao buscar fornecedores:', err);
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});

// Create supplier
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nome, email, telefone, categoria, ativo } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ error: 'Nome do fornecedor é obrigatório' });
    }

    const result = await dbRun(
      'INSERT INTO suppliers (user_id, nome, email, telefone, categoria, ativo) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, nome.trim(), email || null, telefone || null, categoria || null, ativo !== undefined ? (ativo ? 1 : 0) : 1]
    );

    const newSupplier = await dbGet('SELECT * FROM suppliers WHERE id = ?', [result.lastID]);
    res.status(201).json(newSupplier);
  } catch (err) {
    console.error('Erro ao criar fornecedor:', err);
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
});

// Update supplier
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, email, telefone, categoria, ativo } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ error: 'Nome do fornecedor é obrigatório' });
    }

    const existing = await dbGet(
      'SELECT * FROM suppliers WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }

    await dbRun(
      'UPDATE suppliers SET nome = ?, email = ?, telefone = ?, categoria = ?, ativo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [nome.trim(), email || null, telefone || null, categoria || null, ativo !== undefined ? (ativo ? 1 : 0) : 1, req.params.id, req.userId]
    );

    const updated = await dbGet('SELECT * FROM suppliers WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar fornecedor:', err);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

// Delete supplier
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await dbGet(
      'SELECT * FROM suppliers WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }

    await dbRun('DELETE FROM suppliers WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    res.json({ message: 'Fornecedor deletado' });
  } catch (err) {
    console.error('Erro ao deletar fornecedor:', err);
    res.status(500).json({ error: 'Erro ao deletar fornecedor' });
  }
});

module.exports = router;
