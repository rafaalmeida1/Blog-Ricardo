# 🚀 Guia de Deploy - Ricardo Advogado

## Problemas Resolvidos ✅

1. **Fontes do Google Fonts** - Removidas dependências externas durante build
2. **Migrações do Prisma** - Usando `db push` em vez de migrações
3. **Portas** - Corrigido mapeamento de portas no Docker
4. **Scripts de inicialização** - Criados scripts robustos

## 🐳 Para Deploy com Docker

### 1. Build e Start
```bash
# Parar containers existentes
docker-compose down

# Fazer build da nova imagem
docker-compose build --no-cache app

# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### 2. Verificar se está funcionando
```bash
# Verificar containers
docker-compose ps

# Testar aplicação
curl http://localhost:3333
```

## 💻 Para Desenvolvimento Local

### Pré-requisitos
- Node.js 18+ (não funciona com v10)
- PostgreSQL rodando
- Banco `ricardo_advogado` criado

### Comandos
```bash
# Instalar dependências
npm install

# Configurar banco
npx prisma db push
npm run db:seed

# Rodar em desenvolvimento
npm run dev
```

## 🔧 Troubleshooting

### Se o site não carregar:
1. Verificar se a porta 3333 está livre
2. Verificar logs: `docker-compose logs app`
3. Verificar se o banco está conectado
4. Tentar rebuild: `docker-compose build --no-cache`

### Se der erro de Node.js:
- Atualizar para Node.js 18+
- Ou usar apenas Docker (recomendado)

## 📝 Comandos Disponíveis

- `npm run dev` - Para desenvolvimento local
- `docker-compose up -d` - Para produção com Docker

## 🌐 URLs

- **Aplicação**: http://localhost:3333
- **Admin**: http://localhost:3333/admin
- **Banco**: localhost:5438 (Docker) ou localhost:5432 (local)
