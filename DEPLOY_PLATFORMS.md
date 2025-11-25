# 🚀 Deploy Rápido - Plataformas Específicas

## 1. Render.com (⭐ Mais Recomendado - Gratuito)

### Por que Render?
- ✅ 750 horas gratuitas/mês
- ✅ PostgreSQL gratuito incluído
- ✅ Deploy automático do GitHub
- ✅ HTTPS gratuito
- ✅ Fácil configuração

### Passo a Passo

1. **Criar conta**: https://render.com

2. **Criar PostgreSQL Database**
   - New → PostgreSQL
   - Nome: `fitia-db`
   - Plano: Free
   - Copiar a `DATABASE_URL`

3. **Criar Web Service**
   - New → Web Service
   - Connect seu repositório GitHub
   - Configurações:
     ```
     Name: fitia-app
     Environment: Python 3
     Build Command: cd frontend && npm install && npm run build && cd .. && pip install -r requirements.txt
     Start Command: gunicorn --bind 0.0.0.0:$PORT main:app
     ```

4. **Adicionar Environment Variables**
   ```
   SECRET_KEY=<gerar-chave-segura>
   DATABASE_URL=<copiar-do-postgres>
   FRONTEND_URL=https://fitia-app.onrender.com
   FLASK_ENV=production
   DEBUG=False
   ```

5. **Deploy!**
   - Click "Create Web Service"
   - Aguarde o build (~5 minutos)
   - Acesse sua URL: `https://fitia-app.onrender.com`

### Comandos Úteis Render
```bash
# Ver logs
render logs -t <service-id>

# SSH para o container (Paid plans)
render ssh <service-id>
```

---

## 2. Railway.app (Muito Fácil)

### Instalação e Deploy

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Adicionar PostgreSQL
railway add

# Deploy
railway up

# Abrir no browser
railway open
```

### Variables de Ambiente (Railway)
```bash
railway variables set SECRET_KEY=<sua-chave>
railway variables set FLASK_ENV=production
railway variables set DEBUG=False
```

---

## 3. Fly.io (Global Edge)

### Setup Inicial

```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Iniciar app
fly launch

# Adicionar PostgreSQL
fly postgres create

# Conectar database
fly postgres attach <postgres-app-name>

# Deploy
fly deploy

# Abrir app
fly open
```

### fly.toml (Auto-gerado)
```toml
app = "fitia-app"

[env]
  PORT = "5000"

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 5000
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

---

## 4. Heroku (Clássico)

### Deploy com Heroku

```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app
heroku create fitia-app

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurar variáveis
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
heroku config:set FLASK_ENV=production
heroku config:set DEBUG=False

# Deploy
git push heroku main

# Abrir app
heroku open

# Ver logs
heroku logs --tail
```

### Procfile (Heroku)
```
web: gunicorn --bind 0.0.0.0:$PORT --workers 4 main:app
```

---

## 5. Vercel (Frontend) + Render (Backend)

### Vercel (Frontend Only)

```bash
cd frontend

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Produção
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://seu-backend.onrender.com"
  }
}
```

### Render (Backend Only)

Mesmas configurações do método 1, mas sem build do frontend.

---

## 6. DigitalOcean App Platform

### Via Dashboard

1. Create App → GitHub
2. Select Repository: FitIA
3. **Web Service Config:**
   ```
   Name: fitia-web
   Environment: Python
   Build Command: cd frontend && npm install && npm run build && cd .. && pip install -r requirements.txt
   Run Command: gunicorn --bind 0.0.0.0:8080 --workers 4 main:app
   ```
4. Add PostgreSQL Database (Dev ou Pro)
5. Environment Variables (igual Render)
6. Create Resources

Custo: ~$5/mês (mais barato tier)

---

## 7. AWS (Opção Profissional)

### Usando AWS Elastic Beanstalk

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init -p python-3.11 fitia-app

# Criar environment
eb create fitia-prod

# Deploy
eb deploy

# Abrir
eb open

# Logs
eb logs
```

### .ebextensions/python.config
```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: main:app
```

---

## 🌟 Comparação Rápida

| Plataforma    | Gratuito | Fácil | PostgreSQL | Auto-Deploy | Custo/mês |
|---------------|----------|-------|------------|-------------|-----------|
| Render        | ✅ Sim   | ⭐⭐⭐⭐⭐ | ✅ Incluído | ✅ Sim     | $0-7      |
| Railway       | ✅ Sim   | ⭐⭐⭐⭐⭐ | ✅ Incluído | ✅ Sim     | $0-5      |
| Fly.io        | ✅ Sim   | ⭐⭐⭐⭐  | ✅ Incluído | ✅ Sim     | $0-10     |
| Heroku        | ❌ Não   | ⭐⭐⭐⭐  | 💰 $5/mês  | ✅ Sim     | $12+      |
| Vercel+Render | ✅ Sim   | ⭐⭐⭐   | ❌ Separado | ✅ Sim     | $0-7      |
| DigitalOcean  | ❌ Não   | ⭐⭐⭐   | ✅ Incluído | ✅ Sim     | $5-12     |
| AWS EB        | ⚠️ 1 ano | ⭐⭐    | 💰 Extra   | ✅ Sim     | $10-50    |

## 🏆 Recomendação

### Para Começar (Grátis)
**Render.com** - Melhor combinação de facilidade e recursos gratuitos

### Para Produção Séria
**Railway** ou **Fly.io** - Excelente performance e preço

### Para Escala Enterprise
**AWS** ou **Azure** - Máximo controle e recursos

---

## 📝 Checklist Pré-Deploy

- [ ] Código commitado e pushed para GitHub
- [ ] `.env.example` criado com todas as variáveis
- [ ] `requirements.txt` atualizado
- [ ] `frontend/package.json` completo
- [ ] Build local testado: `./scripts/build.sh`
- [ ] Docker testado: `docker-compose up`
- [ ] Database migrations prontas (se aplicável)

---

## 🆘 Precisa de Ajuda?

1. Veja [DEPLOY.md](DEPLOY.md) para guia detalhado
2. Veja [QUICKSTART.md](QUICKSTART.md) para início rápido
3. Abra uma issue no GitHub
4. Consulte a documentação da plataforma escolhida

---

**Sugestão**: Comece com Render.com - é grátis, fácil e completo! 🚀
