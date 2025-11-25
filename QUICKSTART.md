# 🚀 Guia de Início Rápido - FitIA

## ✅ Projeto Reorganizado com Sucesso!

O projeto FitIA foi completamente reorganizado e está pronto para deploy! Aqui está tudo que foi feito:

### 📁 Nova Estrutura

```
FitIA/
├── frontend/              ✅ Aplicação React organizada
│   ├── src/
│   │   ├── components/   ✅ Todos os componentes React
│   │   │   ├── ui/      ✅ Componentes UI (Button, Card, etc)
│   │   │   ├── App.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── TrainingPlan.jsx
│   │   │   └── UserRegistration.jsx
│   │   ├── lib/         ✅ Utilitários
│   │   └── main.jsx     ✅ Entry point
│   ├── package.json      ✅ Dependências do frontend
│   └── vite.config.js    ✅ Configuração de build
│
├── src/                  ✅ Backend Python organizado
│   ├── models/          ✅ Modelos do banco
│   │   └── user.py
│   ├── routes/          ✅ Rotas da API
│   │   └── training.py
│   └── services/        ✅ Lógica de negócio
│       └── training_ai.py
│
├── scripts/             ✅ Scripts de automação
│   ├── dev.sh          ✅ Desenvolvimento
│   ├── build.sh        ✅ Build
│   └── deploy.sh       ✅ Deploy
│
├── main.py             ✅ App Flask atualizado
├── requirements.txt    ✅ Dependências Python
├── Dockerfile          ✅ Containerização
├── docker-compose.yml  ✅ Orquestração
├── .env.example        ✅ Template de variáveis
├── .env                ✅ Variáveis locais
├── .gitignore          ✅ Arquivos ignorados
├── DEPLOY.md          ✅ Guia de deploy completo
└── README.md          ✅ Documentação atualizada
```

## 🎯 Próximos Passos

### 1️⃣ Instalar Dependências

```bash
# Instalar dependências Python
pip install -r requirements.txt

# Instalar dependências do frontend
cd frontend
npm install
cd ..
```

### 2️⃣ Testar Localmente

**Opção A: Script Automático (Mais Fácil)**
```bash
./scripts/dev.sh
```

**Opção B: Manual**
```bash
# Terminal 1 - Backend
python main.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

### 3️⃣ Build para Produção

```bash
./scripts/build.sh
```

Isso vai:
- ✅ Construir o frontend React
- ✅ Copiar arquivos para `static/`
- ✅ Preparar para deploy

### 4️⃣ Deploy

**Com Docker (Recomendado):**
```bash
./scripts/deploy.sh
```

**Sem Docker:**
```bash
# Build do frontend
cd frontend && npm run build && cd ..

# Iniciar com Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
```

## 🌐 Opções de Deploy

### Deploy Gratuito

1. **Render.com** (Mais Fácil)
   - Conecte seu GitHub
   - Deploy automático
   - PostgreSQL incluído

2. **Railway.app**
   - `railway login`
   - `railway up`
   - Deploy em minutos

3. **Fly.io**
   - `fly launch`
   - Deploy global

### Deploy Profissional

- **Heroku** - Setup tradicional
- **AWS/Azure/GCP** - Máximo controle
- **DigitalOcean** - VPS simples

Veja [DEPLOY.md](DEPLOY.md) para instruções detalhadas!

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
./scripts/dev.sh                 # Iniciar dev server
python main.py                   # Apenas backend
cd frontend && npm run dev       # Apenas frontend

# Build e Deploy
./scripts/build.sh              # Build para produção
./scripts/deploy.sh             # Deploy com Docker
docker-compose up -d            # Iniciar containers
docker-compose logs -f web      # Ver logs
docker-compose down             # Parar containers

# Banco de Dados
python -c "from main import app, db; app.app_context().push(); db.create_all()"

# Linting
cd frontend && npm run lint     # Lint frontend
```

## 📊 Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Atualizar `SECRET_KEY` em `.env`
- [ ] Configurar `DATABASE_URL` (PostgreSQL)
- [ ] Configurar `FRONTEND_URL` com domínio real
- [ ] Definir `DEBUG=False`
- [ ] Testar build: `./scripts/build.sh`
- [ ] Testar Docker: `docker-compose up`
- [ ] Verificar health check: `curl http://localhost:5000/health`
- [ ] Configurar backups do banco
- [ ] Configurar SSL/HTTPS
- [ ] Configurar monitoramento

## 🐛 Solução de Problemas

### Erro de Importação
```bash
pip install -r requirements.txt
cd frontend && npm install
```

### Banco de Dados
```bash
# Recriar banco
rm -f database/app.db
python -c "from main import app, db; app.app_context().push(); db.create_all()"
```

### Frontend não carrega
```bash
cd frontend
npm run build
```

### CORS Error
Verifique se `FRONTEND_URL` está correto no `.env`

## 📚 Documentação

- **README.md** - Documentação geral
- **DEPLOY.md** - Guia completo de deploy
- **API Docs** - Em breve

## 🎉 Pronto!

Seu projeto FitIA está:
✅ Totalmente reorganizado
✅ Pronto para desenvolvimento
✅ Pronto para deploy
✅ Com Docker configurado
✅ Com scripts de automação
✅ Bem documentado

**Próximo passo**: Escolha uma plataforma de deploy e siga o guia em [DEPLOY.md](DEPLOY.md)!

---

💡 **Dica**: Comece testando localmente com `./scripts/dev.sh` e depois faça deploy no Render.com (mais fácil e gratuito)!
