# Documento de Visao - Juba Estoque

## 1. Introducao

Este documento descreve a visao do produto Juba Estoque, sistema web para controle de estoque em ambiente de cafe/restaurante.

## 2. Problema

A gestao manual do estoque gera:

- baixa visibilidade de quantidade real
- compras fora de tempo
- risco de ruptura de insumos
- dificuldade de historico e auditoria

## 3. Solucao Proposta

Disponibilizar uma plataforma unica para autenticacao, cadastro de produtos, rastreio de movimentacoes e analise por relatorios.

## 4. Publico-alvo

- proprietaria do estabelecimento
- equipe operacional (funcionarios autorizados)

## 5. Objetivos do Produto

- controlar estoque com dados atualizados
- priorizar reposicao com base em minimo configurado
- manter historico de alteracoes
- apoiar decisao com indicadores e consultas

## 6. Escopo Funcional

### 6.1 Funcionalidades principais

- autenticacao (registro/login/logout)
- CRUD de produtos
- movimentacoes de estoque
- fornecedores
- dashboard
- relatorios

### 6.2 Rotas de negocio atuais

- `/inventory`: dashboard
- `/produtos`: gestao detalhada de itens
- `/movimentacoes`: historico
- `/fornecedores`: cadastro/listagem
- `/relatorios`: analise por abas

## 7. Requisitos Nao Funcionais

- seguranca por JWT e senha com hash
- interface responsiva
- persistencia local em SQLite
- desempenho adequado para pequeno e medio volume de dados

## 8. Restricoes

- banco local (SQLite)
- sem sincronizacao cloud nativa nesta versao
- sem app mobile nativo

## 9. Criterios de Sucesso

- usuario consegue operar sem treinamento extenso
- dados persistem entre sessoes
- build e execucao local sem erros
- relatorios retornam indicadores consistentes

## 10. Conclusao

A versao atual do Juba Estoque atende ao escopo academico proposto, com arquitetura clara, funcionalidade valida e potencial de evolucao.
