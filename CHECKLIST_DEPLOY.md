# ✅ Checklist de Deploy - Render.com

Use este checklist para garantir que tudo está pronto antes e durante o deploy.

## Fase 1: Preparação Local ✅

- [x] Estrutura de diretórios organizada (src/, frontend/, scripts/)
- [x] Todos os arquivos de configuração criados
- [x] requirements.txt com todas as dependências
- [x] package.json configurado no frontend
- [x] .gitignore protegendo arquivos sensíveis
- [x] .env.example criado (sem dados sensíveis)
- [x] render.yaml presente na raiz
- [x] scripts/build.sh executável (chmod +x)
- [x] Testes locais passando

## Fase 2: Repositório Git 🔄

- [ ] Repositório Git inicializado
  ```bash
  git init
  ```

- [ ] Todos os arquivos adicionados
  ```bash
  git add .
  ```

- [ ] Commit inicial criado
  ```bash
  git commit -m "Projeto FitIA pronto para produção"
  ```

- [ ] Repositório criado no GitHub
  - Acesse: https://github.com/new
  - Nome: `FitIA`
  - Público ou Privado (sua escolha)
  - Não inicialize com README (já temos)

- [ ] Remote adicionado
  ```bash
  git remote add origin https://github.com/SEU-USUARIO/FitIA.git
  ```

- [ ] Push para o GitHub
  ```bash
  git branch -M main
  git push -u origin main
  ```

- [ ] Verificar no GitHub se todos os arquivos estão lá
  - ⚠️ Confirme que `.env` NÃO está no repositório
  - ✅ Confirme que `render.yaml` ESTÁ no repositório

## Fase 3: Configuração Render 🚀

- [ ] Conta criada no Render
  - Acesse: https://render.com
  - Clique em "Get Started"
  - Use "Sign up with GitHub"

- [ ] GitHub conectado ao Render
  - Autorize acesso aos repositórios
  - Permita que Render veja o FitIA

- [ ] Novo Blueprint criado
  - Dashboard → "New +"
  - Selecione "Blueprint"
  - Escolha repositório FitIA
  - Render detectará `render.yaml`

- [ ] Configurações revisadas
  - Service Name: `fitia-backend`
  - Branch: `main`
  - Environment: `Python 3`

## Fase 4: Variáveis de Ambiente 🔐

Configure no Render Dashboard → Environment:

- [ ] `SECRET_KEY`
  - ✅ Deixe em branco (Render gera automaticamente)
  - Ou gere manualmente:
    ```bash
    python -c 'import secrets; print(secrets.token_hex(32))'
    ```

- [ ] `FLASK_ENV`
  - Valor: `production`

- [ ] `DEBUG`
  - Valor: `False`

- [ ] `DATABASE_URL`
  - ✅ Auto-preenchida pelo Render (PostgreSQL)
  - Formato: `postgresql://user:pass@host/db`

- [ ] `FRONTEND_URL`
  - Após primeiro deploy, adicione a URL do app
  - Formato: `https://fitia-backend.onrender.com`

- [ ] `HOST`
  - Valor: `0.0.0.0`

- [ ] `PORT`
  - ⚠️ NÃO configure - Render define automaticamente

## Fase 5: Deploy e Monitoramento 📊

- [ ] Deploy iniciado
  - Clique em "Apply" ou "Create Web Service"
  - Aguarde início do build

- [ ] Build em progresso
  - Acompanhe logs em tempo real
  - Procure por: "🏗️ Construindo FitIA para produção..."

- [ ] Build do frontend bem-sucedido
  - Procure por: "⚛️ Construindo frontend..."
  - Procure por: "✅ Build concluído!"

- [ ] Dependências instaladas
  - Python: Flask, SQLAlchemy, Gunicorn, etc.
  - Node.js: React, Vite, TailwindCSS, etc.

- [ ] Deploy concluído
  - Procure por: "==> Your service is live 🎉"
  - URL fornecida: `https://fitia-backend.onrender.com`

## Fase 6: Verificação Pós-Deploy ✅

- [ ] Health check funcionando
  ```bash
  curl https://SEU-APP.onrender.com/health
  ```
  Resposta esperada:
  ```json
  {"service": "FitIA API", "status": "healthy"}
  ```

- [ ] Frontend carregando
  - Acesse: `https://SEU-APP.onrender.com`
  - Deve carregar a página inicial do React

- [ ] API respondendo
  - Teste endpoint: `https://SEU-APP.onrender.com/api/users`
  - Pode retornar lista vazia `[]` - está correto!

- [ ] Database conectado
  - Verifique logs: sem erros de conexão PostgreSQL
  - Tabelas criadas automaticamente

- [ ] CORS funcionando
  - Frontend consegue fazer requisições ao backend
  - Sem erros de CORS no console do browser

## Fase 7: Testes de Funcionalidade 🧪

- [ ] Cadastro de usuário
  - Criar novo usuário funciona
  - Dados salvos no database

- [ ] Login/autenticação
  - Usuário consegue fazer login
  - Sessão mantida

- [ ] Dashboard carrega
  - Página dashboard exibe dados
  - Gráficos renderizam

- [ ] Plano de treino
  - Criação de plano funciona
  - IA gera sugestões

- [ ] Feedback
  - Envio de feedback funciona
  - Dados salvos corretamente

## Fase 8: Otimizações (Opcional) ⚡

- [ ] Custom Domain configurado
  - Settings → Custom Domain
  - Adicione domínio próprio
  - Configure DNS

- [ ] SSL/TLS verificado
  - ✅ Render fornece automaticamente
  - Verifique cadeado verde no browser

- [ ] Logs configurados
  - Revise logs regularmente
  - Configure alertas se necessário

- [ ] Monitoramento ativo
  - Acompanhe métricas (CPU, RAM, Requests)
  - Ajuste workers se necessário

- [ ] Upgrade de plano (se necessário)
  - Free Tier hiberna após 15 min
  - Considere Starter ($7/mês) para 100% uptime

## Troubleshooting Comum 🔧

### ❌ Build Failed

**Sintomas:** Build para com erro

**Soluções:**
- [ ] Verifique permissão do build.sh: `chmod +x scripts/build.sh`
- [ ] Commit e push: `git add scripts/build.sh && git commit -m "Fix permissions" && git push`
- [ ] Manualmente trigger rebuild no Render

### ❌ Application Failed to Respond

**Sintomas:** Deploy completa mas app não responde

**Soluções:**
- [ ] Verifique variável `DATABASE_URL` está configurada
- [ ] Verifique logs do serviço para erros
- [ ] Teste health check: `curl https://SEU-APP.onrender.com/health`
- [ ] Certifique-se que `PORT` não está hardcoded (use `$PORT`)

### ❌ Database Connection Failed

**Sintomas:** Erros de conexão PostgreSQL

**Soluções:**
- [ ] Verifique se PostgreSQL database foi criado no Render
- [ ] Use **Internal Database URL** (não External)
- [ ] Confirme formato: `postgresql://user:pass@host/db`
- [ ] Aguarde database estar "Available" antes de testar

### ❌ Frontend 404 Not Found

**Sintomas:** Frontend não carrega, erro 404

**Soluções:**
- [ ] Verifique build do frontend nos logs (procure "npm run build")
- [ ] Confirme arquivos em `static/` foram criados
- [ ] Teste: `https://SEU-APP.onrender.com/index.html`
- [ ] Verifique `vite.config.js` tem `outDir: '../static'`

### ❌ CORS Errors

**Sintomas:** Erros de CORS no console do browser

**Soluções:**
- [ ] Configure `FRONTEND_URL` com URL completa
- [ ] Formato: `https://fitia-backend.onrender.com`
- [ ] Sem trailing slash `/`
- [ ] Redeploy após alterar variável

## Recursos Úteis 📚

- **Documentação Completa:** `DEPLOY_RENDER.md`
- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Community Support:** https://community.render.com
- **Flask Deploy Guide:** https://flask.palletsprojects.com/deploying/

## Status Final 🎯

- [ ] ✅ Todas as fases completadas
- [ ] ✅ App está live e funcionando
- [ ] ✅ Testes passando
- [ ] ✅ Monitoramento configurado

---

**🎉 Parabéns! FitIA está no ar!** 

Compartilhe sua URL: `https://_____________.onrender.com`
