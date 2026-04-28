# Quickstart - Juba Estoque

## 1) Instalar dependencias

```bash
npm install
cd server && npm install && cd ..
```

## 1.5) Configurar variavel de ambiente (obrigatorio)

```bash
cp server/.env.example server/.env
```

Edite `server/.env` e defina um valor real para `JWT_SECRET` (minimo 32 caracteres).
O servidor recusa iniciar se JWT_SECRET nao estiver definido.

## 2) Rodar em desenvolvimento

```bash
npm run dev
```

Acessos:

- Frontend: http://localhost:3000
- Backend/API: http://localhost:5000

## 3) Validar build antes da entrega

```bash
npm run build
```

Se aparecer "File sizes after gzip", a compilacao foi concluida.

## 4) Fluxo rapido para demonstracao

1. Abrir `http://localhost:3000`
2. Criar conta em `/register` (ou fazer login)
3. Entrar em `/inventory` (Dashboard)
4. Ir para `/produtos` e cadastrar itens
5. Registrar movimentacoes
6. Abrir `/relatorios` e aplicar filtro por data

## 4.5) Opcional: popular com dados de demonstracao

```bash
cd server
node seed.js
cd ..
```

Cria um usuario demo (`demo@jubaestoque.com` / `demo1234`) com 20+ produtos, 8 fornecedores e movimentacoes pre-cadastradas.

## 5) Problemas comuns

### Porta em uso

```bash
npx kill-port 3000 5000
npm run dev
```

### Dependencias inconsistentes

```bash
rm -rf node_modules package-lock.json
npm install
cd server && npm install && cd ..
```

## 6) Estrutura minima para avaliacao

- `README.md` (visao geral)
- `SUMARIO_EXECUTIVO.md` (sintese academica)
- `DOCUMENTO_VISAO.md` (escopo e requisitos)
- `METODOLOGIA.md` (processo)
- `CASOS_DE_USO_UML.md` (modelagem)
- `DATABASE_FLOWCHART.md` e `CONSULTA_BANCO_DADOS.md` (dados)
