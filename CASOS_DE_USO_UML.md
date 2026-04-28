# Casos de Uso (UML) - Juba Estoque

## 1. Atores

- Usuario autenticado (proprietaria/equipe)
- Sistema de autenticacao (JWT)

## 2. Diagrama de casos de uso (visao textual)

```text
Usuario
  -> Registrar conta
  -> Fazer login
  -> Gerenciar produtos (CRUD)
  -> Registrar movimentacao
  -> Consultar historico
  -> Gerenciar fornecedores
  -> Visualizar dashboard
  -> Analisar relatorios
  -> Fazer logout
```

## 3. Especificacao resumida dos casos

| ID | Caso de uso | Pre-condicao | Resultado |
|---|---|---|---|
| UC-001 | Registrar conta | usuario nao autenticado | conta criada |
| UC-002 | Fazer login | conta existente | token JWT emitido |
| UC-003 | Cadastrar produto | usuario autenticado | item criado |
| UC-004 | Editar produto | item existente do usuario | item atualizado |
| UC-005 | Excluir produto | item existente do usuario | item removido |
| UC-006 | Registrar movimentacao | item existente | historico atualizado |
| UC-007 | Ver dashboard | usuario autenticado | KPIs e atalhos exibidos |
| UC-008 | Ver pagina de produtos | usuario autenticado | listagem e filtro exibidos |
| UC-009 | Ver fornecedores | usuario autenticado | CRUD de fornecedores |
| UC-010 | Ver relatorios | usuario autenticado | analises por aba |
| UC-011 | Fazer logout | sessao ativa | sessao encerrada |

## 4. Regras de negocio associadas

- dados sao isolados por `user_id`
- item com estoque abaixo do minimo e considerado critico
- movimentacao de saida nao pode resultar em quantidade negativa
- rotas privadas exigem token valido

## 5. Rastreabilidade para as telas

- Dashboard: `/inventory`
- Produtos: `/produtos`
- Fornecedores: `/fornecedores`
- Movimentacoes: `/movimentacoes`
- Relatorios: `/relatorios`
