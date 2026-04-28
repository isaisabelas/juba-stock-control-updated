# Prototipo de Alta Fidelidade - Juba Estoque

## 1. Objetivo

Documentar o prototipo visual e funcional da versao atual do sistema, com foco em navegacao, hierarquia de informacao e consistencia da experiencia.

## 2. Direcao visual adotada

- tema dark profissional
- acento amarelo/preto como identidade
- layout com sidebar + header + conteudo principal
- componentes padronizados para cards, tabelas, modais e formularios

## 3. Estrutura das telas

### Home publica (`/`)

- hero principal
- botoes de acesso (login/cadastro)
- secoes de recursos e CTA

### Area autenticada

- Dashboard (`/inventory`)
  - KPIs
  - tabela de produtos recentes
  - acoes rapidas

- Produtos (`/produtos`)
  - busca e filtro de estoque baixo
  - listagem de itens
  - cadastro/edicao/exclusao

- Fornecedores (`/fornecedores`)
  - listagem e status
  - operacoes de CRUD

- Movimentacoes (`/movimentacoes`)
  - historico consolidado
  - filtros por tipo e busca

- Relatorios (`/relatorios`)
  - 4 abas analiticas
  - filtro por periodo

## 4. Componentes relevantes

- `Sidebar.jsx`
- `Header.jsx`
- `StatsCard.jsx`
- `ItemList.jsx`
- `ItemForm.jsx`
- `Modal.jsx`
- `MovementModal.jsx`

## 5. Estilos e design system

Arquivos de base:

- `src/styles/Global.css`
- `src/styles/Layout.css`

Arquivos por contexto:

- `Home.css`, `Dashboard.css`, `Inventory.css`
- `Fornecedores.css`, `MovementHistory.css`, `Reports.css`
- `Header.css`, `Sidebar.css`, `StatsCard.css`, `Modal.css`

## 6. Validacao

O prototipo implementado encontra-se operacional e compilando sem erro na ultima verificacao (`npm run build`).

## 7. Conclusao

A versao atual representa um prototipo de alta fidelidade efetivamente convertido em produto funcional, apto para demonstracao academica e evolucao incremental.
