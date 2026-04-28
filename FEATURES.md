# Features Implementadas - Juba Estoque

## 1. Autenticacao

- `POST /api/auth/register`
- `POST /api/auth/login`
- controle de sessao via token JWT
- protecao de rotas privadas no frontend

## 2. Modulo de Produtos

- criar produto
- listar produtos com busca por nome/categoria
- editar produto
- excluir produto
- configurar quantidade minima por item

Campos suportados:

- nome
- quantidade
- preco
- unidade
- categoria
- fornecedor
- observacoes
- quantidade minima

## 3. Movimentacoes

Tipos de movimentacao:

- entrada
- saida
- ajuste

Recursos:

- registro por item
- historico global do usuario
- atualizacao automatica da quantidade em estoque

Endpoints principais:

- `GET /api/items/:id/movements`
- `POST /api/items/:id/movements`
- `GET /api/items/history/all`

## 4. Dashboard

Pagina: `/inventory`

Conteudo:

- cards de KPI (total de itens, quantidade total, valor em estoque, itens em alerta)
- tabela de produtos recentes
- atalhos para fluxos principais

## 5. Pagina de Produtos

Pagina: `/produtos`

Conteudo:

- toolbar de busca e filtro
- listagem completa de itens
- acao de novo item
- acao de movimentacao por item

## 6. Fornecedores

Pagina: `/fornecedores`

- cadastro e edicao
- status ativo/inativo
- listagem e remocao

## 7. Relatorios

Pagina: `/relatorios`

Abas implementadas:

- Sumario Geral
- Gastos por Categoria
- Estoque Baixo
- Valor do Inventario

Filtros:

- periodo por data inicial/final

Endpoints:

- `GET /api/items/reports/summary`
- `GET /api/items/reports/by-category`
- `GET /api/items/reports/low-stock`
- `GET /api/items/reports/inventory-value`

## 8. Banco de Dados

Arquivo: `server/db/juba.db`

Tabelas:

- `users`
- `items`
- `item_movements`
- `suppliers`

## 9. UX/UI

- tema dark profissional com acento amarelo/preto
- layout com sidebar e header
- responsividade para desktop e mobile
- padronizacao visual entre modulos

## 10. Estado da Entrega

Funcionalidades centrais implementadas e compilacao validada com `npm run build`.
