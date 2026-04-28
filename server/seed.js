/**
 * Seed Script — Massa de dados de demonstração para Juba Estoque
 *
 * Uso:
 *   cd server
 *   node seed.js
 *
 * Cria um usuário demo e popula o banco com itens, fornecedores e movimentações.
 * Pode ser executado múltiplas vezes — limpa os dados anteriores do usuário demo.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { dbRun, dbGet, dbAll, db } = require('./db/database');

// ─── Configurações do usuário demo ──────────────────────────────────
const DEMO_USER = {
  email: 'demo@jubaestoque.com',
  password: 'demo1234',
  name: 'Usuário Demo',
};

// ─── Fornecedores ───────────────────────────────────────────────────
const SUPPLIERS = [
  { nome: 'Torrefação Minas Café', email: 'contato@minascafe.com.br', telefone: '(31) 3456-7890', categoria: 'Cafés', ativo: 1 },
  { nome: 'Distribuidora Sabor Paulista', email: 'vendas@saborpaulista.com.br', telefone: '(11) 2345-6789', categoria: 'Alimentos', ativo: 1 },
  { nome: 'Laticínios Serra da Estrela', email: 'pedidos@serradaestrela.com.br', telefone: '(21) 4567-8901', categoria: 'Laticínios', ativo: 1 },
  { nome: 'Panificadora Trigal', email: 'comercial@trigal.com.br', telefone: '(41) 5678-9012', categoria: 'Panificação', ativo: 1 },
  { nome: 'Hortifruti Verde Campo', email: 'pedidos@verdecampo.com.br', telefone: '(51) 6789-0123', categoria: 'Hortifruti', ativo: 1 },
  { nome: 'Bebidas Premium Sul', email: 'vendas@premiumsul.com.br', telefone: '(61) 7890-1234', categoria: 'Bebidas', ativo: 1 },
  { nome: 'Doces & Confeitaria Ltda', email: 'contato@docesconfeitaria.com.br', telefone: '(71) 8901-2345', categoria: 'Confeitaria', ativo: 1 },
  { nome: 'Embalagens Express', email: 'atendimento@embalagensx.com.br', telefone: '(91) 9012-3456', categoria: 'Descartáveis', ativo: 0 },
];

// ─── Itens de estoque ───────────────────────────────────────────────
const ITEMS = [
  // Cafés e Grãos
  { name: 'Café Especial Torrado em Grão 1kg', quantity: 25, price: 89.90, unit: 'kg', category: 'Cafés', supplier: 'Torrefação Minas Café', notes: 'Produto mais vendido — origem Cerrado', min_quantity: 10 },
  { name: 'Café Especial Moído 500g', quantity: 40, price: 49.90, unit: 'un', category: 'Cafés', supplier: 'Torrefação Minas Café', notes: 'Moagem média para coador', min_quantity: 15 },
  { name: 'Café Descafeinado em Grão 500g', quantity: 12, price: 62.00, unit: 'un', category: 'Cafés', supplier: 'Torrefação Minas Café', notes: '', min_quantity: 8 },
  { name: 'Café Cold Brew Pronto 1L', quantity: 18, price: 28.90, unit: 'un', category: 'Cafés', supplier: 'Torrefação Minas Café', notes: 'Validade 15 dias', min_quantity: 10 },
  { name: 'Cápsula Espresso Intenso (cx 10)', quantity: 35, price: 24.90, unit: 'cx', category: 'Cafés', supplier: 'Torrefação Minas Café', notes: 'Compatível Nespresso', min_quantity: 15 },
  { name: 'Chocolate em Pó 50% Cacau 1kg', quantity: 8, price: 45.00, unit: 'kg', category: 'Cafés', supplier: 'Doces & Confeitaria Ltda', notes: 'Para mochas e chocolates quentes', min_quantity: 5 },

  // Laticínios
  { name: 'Leite Integral 1L', quantity: 60, price: 5.90, unit: 'un', category: 'Laticínios', supplier: 'Laticínios Serra da Estrela', notes: 'Uso diário alto', min_quantity: 30 },
  { name: 'Leite Desnatado 1L', quantity: 24, price: 5.50, unit: 'un', category: 'Laticínios', supplier: 'Laticínios Serra da Estrela', notes: '', min_quantity: 15 },
  { name: 'Creme de Leite Fresco 500ml', quantity: 15, price: 12.90, unit: 'un', category: 'Laticínios', supplier: 'Laticínios Serra da Estrela', notes: 'Para chantilly e molhos', min_quantity: 8 },
  { name: 'Leite de Aveia 1L', quantity: 20, price: 14.90, unit: 'un', category: 'Laticínios', supplier: 'Distribuidora Sabor Paulista', notes: 'Opção vegana', min_quantity: 10 },
  { name: 'Queijo Minas Frescal 500g', quantity: 10, price: 18.90, unit: 'un', category: 'Laticínios', supplier: 'Laticínios Serra da Estrela', notes: 'Validade curta — verificar', min_quantity: 5 },
  { name: 'Manteiga com Sal 200g', quantity: 22, price: 9.90, unit: 'un', category: 'Laticínios', supplier: 'Laticínios Serra da Estrela', notes: '', min_quantity: 10 },

  // Panificação e Confeitaria
  { name: 'Pão de Queijo Congelado 1kg', quantity: 30, price: 32.90, unit: 'kg', category: 'Panificação', supplier: 'Panificadora Trigal', notes: 'Assar a 180°C por 25min', min_quantity: 10 },
  { name: 'Croissant Congelado (un)', quantity: 48, price: 4.50, unit: 'un', category: 'Panificação', supplier: 'Panificadora Trigal', notes: 'Pré-assado — finalizar no forno', min_quantity: 20 },
  { name: 'Bolo de Cenoura Fatia (un)', quantity: 3, price: 8.90, unit: 'un', category: 'Confeitaria', supplier: 'Doces & Confeitaria Ltda', notes: 'Estoque baixo — encomendar', min_quantity: 8 },
  { name: 'Torta de Limão Inteira', quantity: 4, price: 65.00, unit: 'un', category: 'Confeitaria', supplier: 'Doces & Confeitaria Ltda', notes: 'Corta em 8 fatias', min_quantity: 2 },
  { name: 'Cookie Artesanal (un)', quantity: 55, price: 6.50, unit: 'un', category: 'Confeitaria', supplier: 'Doces & Confeitaria Ltda', notes: 'Gotas de chocolate', min_quantity: 20 },
  { name: 'Brownie (un)', quantity: 32, price: 7.90, unit: 'un', category: 'Confeitaria', supplier: 'Doces & Confeitaria Ltda', notes: 'Com nozes', min_quantity: 12 },

  // Alimentos e Insumos
  { name: 'Açúcar Cristal 5kg', quantity: 8, price: 22.90, unit: 'un', category: 'Alimentos', supplier: 'Distribuidora Sabor Paulista', notes: '', min_quantity: 4 },
  { name: 'Açúcar Demerara 1kg', quantity: 6, price: 12.50, unit: 'un', category: 'Alimentos', supplier: 'Distribuidora Sabor Paulista', notes: 'Para opção gourmet', min_quantity: 3 },
  { name: 'Mel Orgânico 500g', quantity: 7, price: 34.90, unit: 'un', category: 'Alimentos', supplier: 'Hortifruti Verde Campo', notes: '', min_quantity: 4 },
  { name: 'Canela em Pó 100g', quantity: 5, price: 8.90, unit: 'un', category: 'Alimentos', supplier: 'Distribuidora Sabor Paulista', notes: 'Para cappuccinos', min_quantity: 3 },
  { name: 'Xarope de Baunilha 750ml', quantity: 4, price: 42.00, unit: 'un', category: 'Alimentos', supplier: 'Distribuidora Sabor Paulista', notes: 'Monin', min_quantity: 3 },
  { name: 'Xarope de Caramelo 750ml', quantity: 3, price: 42.00, unit: 'un', category: 'Alimentos', supplier: 'Distribuidora Sabor Paulista', notes: 'Monin', min_quantity: 3 },

  // Bebidas
  { name: 'Água Mineral sem Gás 500ml', quantity: 120, price: 3.50, unit: 'un', category: 'Bebidas', supplier: 'Bebidas Premium Sul', notes: 'Pack com 12', min_quantity: 48 },
  { name: 'Água com Gás 500ml', quantity: 60, price: 4.50, unit: 'un', category: 'Bebidas', supplier: 'Bebidas Premium Sul', notes: '', min_quantity: 24 },
  { name: 'Suco de Laranja Natural 1L', quantity: 10, price: 14.90, unit: 'un', category: 'Bebidas', supplier: 'Hortifruti Verde Campo', notes: 'Refrigerar após abrir', min_quantity: 6 },
  { name: 'Chá Camomila (cx 25 saquinhos)', quantity: 14, price: 9.90, unit: 'cx', category: 'Bebidas', supplier: 'Distribuidora Sabor Paulista', notes: '', min_quantity: 5 },
  { name: 'Chá Verde (cx 25 saquinhos)', quantity: 11, price: 10.90, unit: 'cx', category: 'Bebidas', supplier: 'Distribuidora Sabor Paulista', notes: '', min_quantity: 5 },

  // Descartáveis (fornecedor inativo — estoque baixo)
  { name: 'Copo Descartável 200ml (100un)', quantity: 2, price: 18.90, unit: 'pct', category: 'Outros', supplier: 'Embalagens Express', notes: 'Fornecedor inativo — buscar alternativa', min_quantity: 5 },
  { name: 'Tampa para Copo Take-Away (50un)', quantity: 1, price: 15.00, unit: 'pct', category: 'Outros', supplier: 'Embalagens Express', notes: 'Última remessa', min_quantity: 4 },
];

// ─── Movimentações históricas (variadas ao longo dos últimos 60 dias) ─
function generateMovements(itemMap) {
  const movements = [];
  const now = Date.now();

  // Razões possíveis
  const entradaReasons = ['compra', 'devolucao_fornecedor', 'ajuste_inventario', 'transferencia'];
  const saidaReasons = ['consumo', 'perda', 'vencimento', 'doacao', 'uso_interno'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  for (const [itemName, itemId] of Object.entries(itemMap)) {
    // Generate 3-8 historical movements per item
    const count = randInt(3, 8);
    for (let i = 0; i < count; i++) {
      const daysAgo = randInt(1, 60);
      const hoursAgo = randInt(0, 23);
      const timestamp = new Date(now - daysAgo * 86400000 - hoursAgo * 3600000);
      const dateStr = timestamp.toISOString().replace('T', ' ').slice(0, 19);

      const isEntrada = Math.random() > 0.45; // 55% entradas, 45% saídas
      const type = isEntrada ? 'entrada' : 'saida';
      const reason = isEntrada ? pick(entradaReasons) : pick(saidaReasons);
      const quantity = isEntrada ? randInt(5, 50) : randInt(1, 20);

      const notes = reason === 'consumo'
        ? `Consumo do dia — turno ${pick(['manhã', 'tarde', 'noite'])}`
        : reason === 'compra'
        ? `NF ${randInt(1000, 9999)}`
        : reason === 'perda'
        ? 'Produto danificado/derramado'
        : reason === 'vencimento'
        ? 'Retirado por validade vencida'
        : reason === 'uso_interno'
        ? 'Consumo da equipe/degustação'
        : null;

      movements.push({ itemId, type, quantity, reason, notes, dateStr });
    }
  }

  // Sort chronologically
  movements.sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  return movements;
}

// ─── Main Seed ──────────────────────────────────────────────────────
async function seed() {
  console.log('━━━ Juba Estoque — Seed de Dados ━━━\n');

  // Wait briefly for database to initialize tables
  await new Promise((r) => setTimeout(r, 1000));

  // 1) Create or reset demo user
  console.log('1. Criando usuário demo...');
  let user = await dbGet('SELECT id FROM users WHERE email = ?', [DEMO_USER.email]);

  if (user) {
    // Limpar dados antigos desse usuário
    console.log('   Usuário já existe — limpando dados antigos...');
    await dbRun('DELETE FROM item_movements WHERE user_id = ?', [user.id]);
    await dbRun('DELETE FROM items WHERE user_id = ?', [user.id]);
    await dbRun('DELETE FROM suppliers WHERE user_id = ?', [user.id]);
  } else {
    const hash = await bcrypt.hash(DEMO_USER.password, 10);
    const res = await dbRun(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [DEMO_USER.email, hash, DEMO_USER.name]
    );
    user = { id: res.lastID };
  }
  console.log(`   ✔ Usuário: ${DEMO_USER.email} / Senha: ${DEMO_USER.password}  (id=${user.id})\n`);

  // 2) Insert suppliers
  console.log('2. Inserindo fornecedores...');
  for (const s of SUPPLIERS) {
    await dbRun(
      'INSERT INTO suppliers (user_id, nome, email, telefone, categoria, ativo) VALUES (?,?,?,?,?,?)',
      [user.id, s.nome, s.email, s.telefone, s.categoria, s.ativo]
    );
  }
  console.log(`   ✔ ${SUPPLIERS.length} fornecedores criados\n`);

  // 3) Insert items
  console.log('3. Inserindo itens de estoque...');
  const itemMap = {}; // name -> id
  for (const item of ITEMS) {
    const res = await dbRun(
      'INSERT INTO items (user_id, name, quantity, price, unit, category, supplier, notes, min_quantity) VALUES (?,?,?,?,?,?,?,?,?)',
      [user.id, item.name, item.quantity, item.price, item.unit, item.category, item.supplier, item.notes, item.min_quantity]
    );
    itemMap[item.name] = res.lastID;

    // Also log the initial "criação" movement
    await dbRun(
      'INSERT INTO item_movements (item_id, user_id, type, quantity, reason, notes, created_at) VALUES (?,?,?,?,?,?,datetime("now",?))',
      [res.lastID, user.id, 'entrada', item.quantity, 'criacao', 'Carga inicial do estoque', `-${60 + Math.floor(Math.random() * 10)} days`]
    );
  }
  console.log(`   ✔ ${ITEMS.length} itens criados\n`);

  // 4) Generate historical movements
  console.log('4. Gerando histórico de movimentações...');
  const movements = generateMovements(itemMap);
  for (const m of movements) {
    await dbRun(
      `INSERT INTO item_movements (item_id, user_id, type, quantity, reason, notes, created_at) VALUES (?,?,?,?,?,?,?)`,
      [m.itemId, user.id, m.type, m.quantity, m.reason, m.notes, m.dateStr]
    );
  }
  console.log(`   ✔ ${movements.length} movimentações históricas criadas\n`);

  // 5) Summary
  const totalItems = await dbGet('SELECT COUNT(*) as c FROM items WHERE user_id = ?', [user.id]);
  const totalMov = await dbGet('SELECT COUNT(*) as c FROM item_movements WHERE user_id = ?', [user.id]);
  const totalSup = await dbGet('SELECT COUNT(*) as c FROM suppliers WHERE user_id = ?', [user.id]);
  const lowStock = await dbGet('SELECT COUNT(*) as c FROM items WHERE user_id = ? AND quantity < min_quantity', [user.id]);
  const valorTotal = await dbGet('SELECT SUM(quantity * price) as total FROM items WHERE user_id = ?', [user.id]);

  console.log('━━━ Resumo ━━━');
  console.log(`  Itens no estoque:    ${totalItems.c}`);
  console.log(`  Movimentações:       ${totalMov.c}`);
  console.log(`  Fornecedores:        ${totalSup.c}`);
  console.log(`  Itens abaixo do mín: ${lowStock.c}`);
  console.log(`  Valor total estoque: R$ ${valorTotal.total.toFixed(2)}`);
  console.log('\n━━━ Acesso ━━━');
  console.log(`  Email: ${DEMO_USER.email}`);
  console.log(`  Senha: ${DEMO_USER.password}`);
  console.log('\n✔ Seed concluído com sucesso!');

  // Close database
  db.close();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
