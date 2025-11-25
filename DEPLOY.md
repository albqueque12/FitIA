# 🚀 Guia de Deploy - FitIA

Este guia contém todas as instruções para fazer deploy da aplicação FitIA em diferentes plataformas.

## 📋 Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (para produção)
- Docker (opcional, mas recomendado)

## 🏗️ Estrutura do Projeto

```
FitIA/
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   └── lib/         # Utilitários
│   ├── package.json
│   └── vite.config.js
├── src/                  # Backend Flask
│   ├── models/          # Modelos do banco
│   ├── routes/          # Rotas da API
│   └── services/        # Lógica de negócio
├── database/            # Banco de dados SQLite
├── static/              # Build do frontend
├── scripts/             # Scripts de automação
├── main.py             # Aplicação Flask principal
├── requirements.txt     # Dependências Python
├── Dockerfile          # Configuração Docker
└── docker-compose.yml  # Orquestração Docker
```

## 🔧 Configuração Inicial

### 1. Clone e Configure

```bash
git clone https://github.com/albqueque12/FitIA.git
cd FitIA

# Copie o arquivo de exemplo para .env
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

### 2. Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Flask
SECRET_KEY=sua-chave-secreta-aqui
FLASK_ENV=production

# Database (SQLite para dev, PostgreSQL para produção)
DATABASE_URL=sqlite:///database/app.db
# ou para PostgreSQL:
# DATABASE_URL=postgresql://user:password@host:5432/fitia_db

# CORS
FRONTEND_URL=https://seu-dominio.com

# Server
HOST=0.0.0.0
PORT=5000
DEBUG=False
```

## 🐳 Deploy com Docker (Recomendado)

### Desenvolvimento Local

```bash
# Iniciar com Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f web

# Parar
docker-compose down
```

### Produção com Docker

```bash
# 1. Configure as variáveis de ambiente em .env

# 2. Build e deploy
./scripts/deploy.sh

# Ou manualmente:
docker-compose -f docker-compose.yml up -d --build
```

A aplicação estará disponível em `http://localhost:5000`

## 💻 Deploy Manual (Sem Docker)

### 1. Backend (Flask)

```bash
# Instalar dependências
pip install -r requirements.txt

# Criar banco de dados
python -c "from main import app, db; app.app_context().push(); db.create_all()"

# Iniciar com Gunicorn (produção)
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app

# Ou para desenvolvimento
python main.py
```

### 2. Frontend (React)

```bash
cd frontend

# Instalar dependências
npm install

# Build para produção
npm run build

# Os arquivos serão copiados para ../static/
```

## ☁️ Deploy em Plataformas Cloud

### Heroku

```bash
# 1. Instalar Heroku CLI
# 2. Login
heroku login

# 3. Criar app
heroku create fitia-app

# 4. Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Configurar variáveis
heroku config:set SECRET_KEY=sua-chave-secreta
heroku config:set FLASK_ENV=production

# 6. Deploy
git push heroku main

# 7. Inicializar banco
heroku run python -c "from main import app, db; app.app_context().push(); db.create_all()"
```

### Render.com

1. Conecte seu repositório GitHub
2. Crie um novo **Web Service**
3. Configure:
   - **Build Command**: `./scripts/build.sh`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT main:app`
   - **Environment**: Python 3.11
4. Adicione variáveis de ambiente na dashboard
5. Adicione um **PostgreSQL Database**
6. Conecte o database ao web service

### Railway.app

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar projeto
railway init

# 4. Adicionar PostgreSQL
railway add

# 5. Deploy
railway up
```

### Fly.io

```bash
# 1. Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Inicializar app
fly launch

# 4. Adicionar PostgreSQL
fly postgres create

# 5. Conectar database
fly postgres attach <postgres-app-name>

# 6. Deploy
fly deploy
```

### Vercel (Frontend) + Render/Railway (Backend)

**Frontend (Vercel):**
```bash
cd frontend
vercel
```

Configure no `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://seu-backend.onrender.com"
  }
}
```

**Backend (Render/Railway):**
- Siga as instruções acima para Render ou Railway

## 🗄️ Banco de Dados

### Migração SQLite → PostgreSQL

```bash
# 1. Export dados do SQLite
sqlite3 database/app.db .dump > backup.sql

# 2. Ajustar SQL para PostgreSQL
sed -i 's/INTEGER PRIMARY KEY AUTOINCREMENT/SERIAL PRIMARY KEY/g' backup.sql

# 3. Importar para PostgreSQL
psql $DATABASE_URL < backup.sql
```

### Backup e Restore

```bash
# Backup (PostgreSQL)
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Backup (SQLite)
sqlite3 database/app.db .dump > backup.sql
```

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:5000/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "service": "FitIA API"
}
```

### Logs

```bash
# Docker
docker-compose logs -f web

# Systemd (se configurado)
sudo journalctl -u fitia -f

# Arquivo de log
tail -f /var/log/fitia/app.log
```

## 🔐 Segurança

### Checklist de Segurança para Produção

- [ ] Gere uma SECRET_KEY forte e única
- [ ] Use HTTPS (SSL/TLS)
- [ ] Configure CORS corretamente
- [ ] Use PostgreSQL (não SQLite) em produção
- [ ] Configure backups automáticos do banco
- [ ] Limite rate limiting na API
- [ ] Configure firewall/security groups
- [ ] Use variáveis de ambiente para senhas
- [ ] Mantenha dependências atualizadas
- [ ] Configure logging apropriado

### Gerar SECRET_KEY

```python
python -c "import secrets; print(secrets.token_hex(32))"
```

## 🐛 Troubleshooting

### Erro: "No module named 'dotenv'"
```bash
pip install python-dotenv
```

### Erro: Database connection failed
```bash
# Verifique a DATABASE_URL
echo $DATABASE_URL

# Teste conexão com PostgreSQL
pg_isready -d $DATABASE_URL
```

### Erro: Frontend não carrega
```bash
# Verifique se o build foi feito
ls -la static/

# Rebuild frontend
cd frontend && npm run build
```

### Erro: CORS
Verifique se `FRONTEND_URL` está configurado corretamente no `.env`

## 📱 URLs Importantes

- **Frontend**: `http://localhost:5173` (dev) / `http://localhost:5000` (prod)
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`
- **Documentação API**: `http://localhost:5000/api/docs` (futuro)

## 🤝 Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Email: [seu-email]
- Documentação: [link para docs]

## 📄 Licença

[Sua licença aqui]
