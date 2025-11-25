# ExFit - Treinos Personalizados com IA 🏃‍♂️

> Aplicação revolucionária de fitness que utiliza Inteligência Artificial para gerar treinos personalizados e adaptativos.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Visão Geral

O ExFit melhora a qualidade de vida e performance através de treinos baseados em condições fisiológicas, desenvolvendo capacidades anaeróbica e aeróbica com planos gerados por inteligência artificial adaptativa.

## ✨ Funcionalidades

### ✅ Implementadas

- 🔐 **Cadastro personalizado** com objetivos individuais
- 📊 **Cálculo automático** de ritmos de treino
- 🤖 **Geração de planos** semanais com IA
- 📈 **Sistema de feedback** para ajuste de performance
- 📱 **Dashboard interativo** com estatísticas
- ✅ **Interface para completar** treinos
- 📉 **Histórico de evolução** e progresso
- 🔄 **Adaptação dinâmica** baseada em feedback

### 🚧 Em Desenvolvimento

- 🏥 Integração de exames médicos (bioimpedância, espirometria, VO2 máx)
- 🧬 Sistema de HRV para análise de recuperação
- 🤖 Modelo de ML para prevenção de lesões
- 📱 Aplicativo mobile (React Native)
- ⌚ Integração com wearables

## 🚀 Quick Start

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/albqueque12/FitIA.git
cd FitIA

# Configure variáveis de ambiente
cp .env.example .env

# Inicie com Docker
docker-compose up -d

# Acesse http://localhost:5000
```

### Opção 2: Desenvolvimento Local

```bash
# Use o script de desenvolvimento
./scripts/dev.sh

# Ou manualmente:

# Backend
pip install -r requirements.txt
python main.py

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
FitIA/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   │   ├── ui/      # Componentes UI reutilizáveis
│   │   │   ├── App.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Progress.jsx
│   │   │   ├── TrainingPlan.jsx
│   │   │   └── UserRegistration.jsx
│   │   └── lib/         # Utilitários
│   ├── package.json
│   └── vite.config.js
├── src/                  # Backend Flask
│   ├── models/          # Modelos do banco de dados
│   │   └── user.py
│   ├── routes/          # Rotas da API REST
│   │   └── training.py
│   └── services/        # Lógica de negócio e IA
│       └── training_ai.py
├── database/            # Banco de dados
├── static/              # Build do frontend
├── scripts/             # Scripts de automação
│   ├── dev.sh          # Desenvolvimento
│   ├── build.sh        # Build para produção
│   └── deploy.sh       # Deploy com Docker
├── main.py             # Aplicação Flask principal
├── requirements.txt    # Dependências Python
├── Dockerfile          # Configuração Docker
├── docker-compose.yml  # Orquestração
├── DEPLOY.md          # Guia de deploy detalhado
└── README.md          # Este arquivo
```

## 🛠️ Stack Tecnológica

### Backend
- **Flask** 3.0 - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **NumPy & Pandas** - Processamento de dados
- **PostgreSQL** - Banco de dados (produção)
- **SQLite** - Banco de dados (desenvolvimento)

### Frontend
- **React** 18.2 - Biblioteca UI
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **Recharts** - Gráficos e visualizações
- **React Router** - Navegação

### DevOps
- **Docker** - Containerização
- **Gunicorn** - WSGI server
- **Nginx** - Reverse proxy (opcional)

## 📚 Documentação

- [Guia de Deploy Completo](DEPLOY.md)
- [Documentação da API](docs/API.md) _(em breve)_
- [Guia de Contribuição](CONTRIBUTING.md) _(em breve)_

## 🔗 Endpoints da API

### Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Obter usuário
- `GET /api/users/:id/progress` - Progresso do usuário

### Treinos
- `POST /api/users/:id/training-plan/:week` - Gerar plano semanal
- `GET /api/users/:id/training-plans` - Listar planos
- `POST /api/workouts/:id/complete` - Completar treino

### Feedback
- `POST /api/users/:id/feedback` - Enviar feedback semanal

### Sistema
- `GET /health` - Health check

## 🚢 Deploy

### Deploy Rápido

```bash
# Build e deploy com um comando
./scripts/deploy.sh
```

### Plataformas Suportadas

- ✅ **Heroku** - Deploy gratuito/pago
- ✅ **Render** - Deploy gratuito
- ✅ **Railway** - Deploy gratuito
- ✅ **Fly.io** - Deploy gratuito
- ✅ **Vercel** (Frontend) + Render (Backend)
- ✅ **AWS/Azure/GCP** - Deploy empresarial

Veja [DEPLOY.md](DEPLOY.md) para instruções detalhadas de cada plataforma.

## 🧪 Testes

```bash
# Testes unitários (futuro)
pytest

# Testes de integração (futuro)
pytest tests/integration

# Coverage (futuro)
pytest --cov=src
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📊 Roadmap
