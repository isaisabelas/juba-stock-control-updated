# ☕ Juba Estoque - Versão Atualizada 

Sistema web full-stack para controle de estoque de cafe/restaurante, com autenticação de usuários, gestão de produtos, movimentações e relatórios.

O Sistema de estoque Juba foi criado inicialmente para o Projeto de Extensão IV do curso de Análise e Desenvolvimento de Sistemas da faculdade Descomplica, em que o sistema foi idealizado e uma versão com funcionalidades básicas foi desenvolvida. Neste semestre, mais uma vez em conjunto com a dona do café, foram analisadas novas necessidades e melhorias que agregariam ainda mais valor ao projeto e contemplariam os requisitos do Proveto V. 

**Principais Entregas e Melhorias:**

*   **📄 Documentação de Engenharia:** Criação de Documento de Visão, Diagrama de Casos de Uso e protótipos de alta fidelidade para validar os requisitos com a usuária (Juba Café).
*   **📊 Relatórios e Análises:** Nova página de relatórios com visão de gastos por categoria e itens críticos, auxiliando na tomada de decisão.
*   **📜 Histórico de Movimentações:** Implementação de um log completo que rastreia todas as entradas, saídas e edições de produtos, garantindo rastreabilidade e transparência.
*   **🤝 Gestão de Fornecedores:** Nova funcionalidade para cadastro e vinculação de fornecedores aos produtos, melhorando a organização do negócio.
*   **✅ Plano de Testes e Piloto:** Elaboração e execução de um plano de testes com a usuária real. O relatório do piloto documenta os bugs encontrados, os feedbacks coletados e as melhorias implementadas a partir dessa validação prática.
*   **📈 Gestão do Projeto:** Utilização de metodologias ágeis com backlog no Trello e cronograma detalhado, demonstrando o planejamento e acompanhamento do projeto.
*   **🔒 Análise de Segurança:** Revisão e documentação das práticas de segurança adotadas (hash de senhas, isolamento de dados por usuário via JWT, validação de entradas).

---

## Screenshots 

Tela Inicial 

Tela de Login 

Tela de Registro 

Dashboard 

Lista de Produtos 

---

## Objetivo do Projeto

Centralizar o controle de estoque em uma aplicacao unica, reduzindo falhas operacionais e melhorando a tomada de decisões de negócio. 

## Tecnologias

- Frontend: React 19, React Router, Axios
- Backend: Node.js, Express
- Banco: SQLite
- Seguranca: JWT + bcrypt

## Rotas da Aplicacao

- `/` Home publica
- `/login` Login
- `/register` Registro
- `/inventory` Dashboard
- `/produtos` Gestao de produtos
- `/fornecedores` Fornecedores
- `/movimentacoes` Historico de movimentacoes
- `/relatorios` Relatorios

## Instalacao

```bash
npm install
cd server && npm install && cd ..
```

## Execucao

### Desenvolvimento

```bash
npm run dev
```

Acessos locais:

- Frontend: http://localhost:3000
- API: http://localhost:5000

### Build

```bash
npm run build
```

## Principais Funcionalidades

- autenticacao de usuario
- CRUD de produtos
- filtro de estoque baixo
- registro de movimentacoes por item
- dashboard com indicadores
- relatorios por categoria, estoque baixo e valor de inventario
- cadastro de fornecedores

## Banco de Dados

Arquivo local:

- `server/db/juba.db`

Tabelas principais:

- `users`
- `items`
- `item_movements`
- `suppliers`

## Endpoints (resumo)

Autenticacao:

- `POST /api/auth/register`
- `POST /api/auth/login`

Itens:

- `GET /api/items`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

Movimentacoes:

- `GET /api/items/:id/movements`
- `POST /api/items/:id/movements`
- `GET /api/items/history/all`

Relatorios:

- `GET /api/items/reports/summary`
- `GET /api/items/reports/by-category`
- `GET /api/items/reports/low-stock`
- `GET /api/items/reports/inventory-value`

## Documentos Academicos

- `SUMARIO_EXECUTIVO.md`
- `DOCUMENTO_VISAO.md`
- `METODOLOGIA.md`
- `CASOS_DE_USO_UML.md`
- `DATABASE_FLOWCHART.md`
- `CONSULTA_BANCO_DADOS.md`
- `FEATURES.md`
- `PROTOTIPO_ALTA_FIDELIDADE.md`
- `QUICKSTART.md`

---

Desenvolvido com carinho para uma empreendedora independente ❤️
