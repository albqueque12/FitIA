# 🚀 Deploy no Render - Guia Completo

## ✅ Projeto está 100% pronto para deploy!

### Arquivos Essenciais Criados
- ✅ `render.yaml` - Configuração automática do Render
- ✅ `scripts/build.sh` - Script de build otimizado
- ✅ `requirements.txt` - Dependências Python (incluindo psycopg2-binary)
- ✅ `main.py` - Configurado para produção com gunicorn
- ✅ `.env.example` - Template de variáveis de ambiente

---

## 📝 Passos para Deploy

### 1. Preparar o Repositório Git

```bash
# Se ainda não inicializou o git
git init
git add .
git commit -m "Projeto FitIA pronto para produção"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/SEU-USUARIO/FitIA.git
git branch -M main
git push -u origin main
```

### 2. Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"** ou **"Sign Up"**
3. Use sua conta GitHub para login
4. Autorize o Render a acessar seus repositórios

### 3. Deploy Automático com render.yaml

O projeto já possui o arquivo `render.yaml` que configura tudo automaticamente!

**Opção A: Deploy via Dashboard (Recomendado)**

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte seu repositório GitHub do FitIA
4. O Render detectará automaticamente o `render.yaml`
5. Clique em **"Apply"**

**Opção B: Deploy Manual**

Se preferir configurar manualmente:

1. **Criar Web Service:**
   - New + → Web Service
   - Conectar repositório FitIA
   - Name: `fitia-backend`
   - Environment: `Python 3`
   - Build Command: `./scripts/build.sh`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT --workers 4 --timeout 120 main:app`
   - Plan: Free

2. **Criar Database:**
   - New + → PostgreSQL
   - Name: `fitia-db`
   - Database: `fitia`
   - User: `fitia`
   - Plan: Free

3. **Conectar Database ao Web Service:**
   - No Web Service, vá em Environment
   - Adicione: `DATABASE_URL` = Internal Database URL do fitia-db

### 4. Configurar Variáveis de Ambiente

No painel do seu Web Service, vá em **Environment** e adicione:

```bash
# Gerada automaticamente pelo Render (deixe em branco)
SECRET_KEY=

# Produção
FLASK_ENV=production
DEBUG=False

# CORS - Após deploy, adicione a URL do seu app
FRONTEND_URL=https://fitia-backend.onrender.com

# Database - Será preenchida automaticamente
DATABASE_URL=postgresql://user:pass@host/fitia
```

### 5. Acompanhar o Deploy

1. O Render iniciará o build automaticamente
2. Você verá os logs em tempo real:
   ```
   🏗️  Construindo FitIA para produção...
   📦 Instalando dependências Python...
   🧹 Limpando builds anteriores...
   ⚛️  Construindo frontend...
   ✅ Build concluído!
   ```
3. Aguarde até ver: `==> Your service is live 🎉`

### 6. Verificar Deploy

Acesse a URL fornecida pelo Render (algo como `https://fitia-backend.onrender.com`)

Teste o health check:
```bash
curl https://fitia-backend.onrender.com/health
```

Resposta esperada:
```json
{"service": "FitIA API", "status": "healthy"}
```

---

## 🔧 Configurações Importantes

### Build Command Explicado
```bash
./scripts/build.sh
```
Este script:
1. Instala dependências Python (`pip install -r requirements.txt`)
2. Instala dependências Node.js (`npm install` no frontend)
3. Faz build do React (`npm run build`)
4. Move arquivos para pasta `static/`

### Start Command Explicado
```bash
gunicorn --bind 0.0.0.0:$PORT --workers 4 --timeout 120 main:app
```
- `--bind 0.0.0.0:$PORT`: Escuta em todas as interfaces na porta fornecida pelo Render
- `--workers 4`: 4 processos workers para lidar com requisições
- `--timeout 120`: Timeout de 120 segundos para requisições longas
- `main:app`: Módulo main, objeto app

### Database PostgreSQL

O Render fornece PostgreSQL gratuito com:
- ✅ 256 MB de armazenamento
- ✅ Backups automáticos (7 dias)
- ✅ SSL/TLS por padrão
- ⚠️ Expira após 90 dias no plano Free (precisa recriar)

A URL é automaticamente injetada em `DATABASE_URL`.

---

## 🎯 Troubleshooting

### Erro: "Build failed"
**Solução:**
- Verifique os logs do build
- Confirme que `scripts/build.sh` tem permissão de execução:
  ```bash
  chmod +x scripts/build.sh
  git add scripts/build.sh
  git commit -m "Fix build script permissions"
  git push
  ```

### Erro: "Application failed to respond"
**Soluções:**
1. Verifique se `DATABASE_URL` está configurada
2. Verifique logs do serviço
3. Teste o health check: `curl https://SEU-APP.onrender.com/health`

### Erro: "Database connection failed"
**Soluções:**
1. Verifique se o PostgreSQL database foi criado
2. Confirme que `DATABASE_URL` aponta para o database correto
3. Em Environment, use a **Internal Database URL** (não a External)

### Frontend não carrega
**Soluções:**
1. Verifique se o build do frontend foi bem-sucedido nos logs
2. Confirme que arquivos estão em `static/`
3. Acesse diretamente: `https://SEU-APP.onrender.com/index.html`

### CORS Error
**Solução:**
Atualize `FRONTEND_URL` com a URL real do Render:
```bash
FRONTEND_URL=https://fitia-backend.onrender.com
```

---

## 📊 Monitoramento

### Health Check
O Render verifica automaticamente `/health` a cada 30 segundos.

### Logs
Acesse logs em tempo real:
1. Dashboard do Render
2. Selecione seu Web Service
3. Clique em **"Logs"**

### Metrics
Render Free Tier inclui:
- CPU usage
- Memory usage
- Request count
- Response time

---

## 🔄 Updates e Re-deploys

### Deploy Automático
Após o primeiro deploy, qualquer `git push` para a branch `main` dispara um novo deploy automaticamente.

### Deploy Manual
No dashboard do Render:
1. Vá em seu Web Service
2. Clique em **"Manual Deploy"**
3. Selecione **"Deploy latest commit"**

---

## 💰 Planos e Limites

### Free Tier (Atual)
- ✅ 750 horas/mês
- ✅ Builds ilimitados
- ✅ SSL grátis
- ⚠️ App hiberna após 15 min de inatividade
- ⚠️ Startup lento após hibernação (~30 segundos)

### Paid Tier ($7/mês)
- ✅ Sem hibernação
- ✅ Mais recursos (512 MB RAM)
- ✅ Suporte prioritário

---

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. **Teste todas as funcionalidades:**
   - Cadastro de usuário
   - Criação de planos de treino
   - Dashboard e progresso
   - Feedback

2. **Configure domínio customizado** (opcional):
   - Settings → Custom Domain
   - Adicione seu domínio
   - Configure DNS

3. **Monitore performance:**
   - Acompanhe métricas
   - Revise logs regularmente
   - Configure alertas

4. **Considere upgrade** se necessário:
   - Tráfego alto
   - Necessita 100% uptime
   - Precisa de mais recursos

---

## 📚 Recursos Úteis

- [Render Docs](https://render.com/docs)
- [Render Status](https://status.render.com/)
- [Render Community](https://community.render.com/)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/3.0.x/deploying/)

---

## ✅ Verificação Final

Antes de fazer deploy, confirme:

- [ ] Repositório Git criado e atualizado
- [ ] `.env` **não está** no repositório (verificar `.gitignore`)
- [ ] `render.yaml` está presente
- [ ] `scripts/build.sh` tem permissão de execução
- [ ] Conta no Render criada e conectada ao GitHub
- [ ] Projeto testado localmente com sucesso

---

**Projeto 100% pronto para produção! 🚀**

Qualquer dúvida, consulte os logs do Render ou a documentação oficial.
