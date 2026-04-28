# Flowchart do Banco de Dados - Juba Estoque

## 1. Modelo relacional (resumo)

```mermaid
erDiagram
    USERS ||--o{ ITEMS : "possui"
    USERS ||--o{ ITEM_MOVEMENTS : "registra"
    USERS ||--o{ SUPPLIERS : "mantem"
    ITEMS ||--o{ ITEM_MOVEMENTS : "gera"

    USERS {
      int id PK
      string email
      string password
      string name
      datetime created_at
    }

    ITEMS {
      int id PK
      int user_id FK
      string name
      float quantity
      float price
      float min_quantity
      string unit
      string category
      string supplier
      string notes
      datetime created_at
      datetime updated_at
    }

    ITEM_MOVEMENTS {
      int id PK
      int item_id FK
      int user_id FK
      string type
      float quantity
      string reason
      string notes
      datetime created_at
    }

    SUPPLIERS {
      int id PK
      int user_id FK
      string nome
      string email
      string telefone
      string categoria
      int ativo
      datetime created_at
      datetime updated_at
    }
```

## 2. Regras de negocio refletidas no banco

- cada usuario enxerga apenas seus dados (`user_id`)
- produtos possuem quantidade minima para alerta (`min_quantity`)
- movimentacoes registram historico imutavel por item
- exclusao de item remove movimentacoes vinculadas (`ON DELETE CASCADE`)

## 3. Fluxo de dados principal

1. Usuario cria item em `items`
2. Sistema registra movimentacao inicial em `item_movements`
3. Ajustes de estoque geram novas movimentacoes
4. Relatorios calculam indicadores a partir de `items`

## 4. Consultas de relatorio derivadas

- valor total: `SUM(quantity * price)`
- itens criticos: `quantity <= min_quantity`
- agrupamento por categoria: `GROUP BY category`
