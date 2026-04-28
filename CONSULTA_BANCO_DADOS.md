# Consulta ao Banco de Dados - Juba Estoque

## 1. Local do banco

Arquivo SQLite utilizado pela aplicacao:

`server/db/juba.db`

## 2. Tabelas existentes

- `users`
- `items`
- `item_movements`
- `suppliers`

## 3. Acesso rapido (CLI SQLite)

```bash
cd server/db
sqlite3 juba.db
```

Comandos uteis:

```sql
.tables
.schema items
.headers on
.mode column
```

## 4. Consultas uteis para apresentacao

### 4.1 Produtos do usuario

```sql
SELECT id, name, quantity, min_quantity, price, category
FROM items
WHERE user_id = 1
ORDER BY created_at DESC;
```

### 4.2 Itens em estoque baixo

```sql
SELECT name, quantity, min_quantity, (min_quantity - quantity) AS deficit
FROM items
WHERE user_id = 1 AND quantity <= min_quantity
ORDER BY deficit DESC;
```

### 4.3 Historico de movimentacoes

```sql
SELECT m.created_at, i.name AS item, m.type, m.quantity, m.reason
FROM item_movements m
JOIN items i ON i.id = m.item_id
WHERE m.user_id = 1
ORDER BY m.created_at DESC
LIMIT 30;
```

### 4.4 Valor total do inventario

```sql
SELECT
  COUNT(*) AS total_itens,
  SUM(quantity) AS quantidade_total,
  SUM(quantity * price) AS valor_total
FROM items
WHERE user_id = 1;
```

## 5. Consulta via API (alternativa)

A API pode ser usada em vez de SQL direto:

- `GET /api/items`
- `GET /api/items/history/all`
- `GET /api/items/reports/summary`
- `GET /api/items/reports/by-category`
- `GET /api/items/reports/low-stock`
- `GET /api/items/reports/inventory-value`

## 6. Boas praticas para defesa

- demonstrar `items` + `item_movements` para provar rastreabilidade
- executar ao vivo uma query de estoque baixo
- comparar resultado SQL com a tela de Relatorios
