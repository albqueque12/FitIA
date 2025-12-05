# 🔧 Troubleshooting - FitIA

## Problema: "Erro ao gerar plano"

### ✅ Verificações Rápidas

1. **Abra o Console do Navegador** (F12 ou Cmd+Option+I)
   - Procure por mensagens de erro em vermelho
   - Verifique os logs que começam com "Gerando plano..."
   - Veja se a URL está correta: `/api/users/1/training-plan/X`

2. **Verifique a URL que você está acessando:**
   - ✅ **Produção (Render):** `https://seu-app.onrender.com`
   - ✅ **Local:** `http://localhost:5000` (após fazer build)
   - ❌ **NÃO use:** Outras portas ou IPs diferentes

3. **Force Refresh da Página:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - Ou limpe o cache do navegador

### 🧪 Testes Manuais da API

Execute o script de teste:
```bash
./test_api.sh
```

Ou teste manualmente:
```bash
# Verificar saúde do servidor
curl http://localhost:5000/health

# Gerar plano para semana 1
curl -X POST http://localhost:5000/api/users/1/training-plan/1 \
  -H "Content-Type: application/json"
```

### 📊 Logs do Servidor

Verificar logs do Flask:
```bash
tail -f /tmp/flask.log
```

### 🔍 Mensagens de Erro Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Failed to fetch` | Servidor não está rodando | Iniciar servidor com `python3 main.py` |
| `404 Not Found` | URL incorreta | Verificar se está usando `/api/users/...` |
| `CORS error` | Problema de origem cruzada | Verificar configuração CORS no `main.py` |
| `500 Internal Server Error` | Erro no servidor | Verificar logs em `/tmp/flask.log` |

### 🚀 Deploy no Render

Após fazer push para o GitHub:
1. Aguarde 2-3 minutos para o build completar
2. Verifique o status no dashboard do Render
3. Force refresh da página do app
4. Verifique o console do navegador

### 📝 Informações Úteis

**Endpoints da API:**
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `POST /api/users/:id/training-plan/:week` - Gerar plano semanal
- `GET /api/users/:id/progress` - Buscar progresso
- `GET /api/users/:id/training-plans` - Listar todos os planos

**Variáveis de Ambiente:**
- `PORT` - Porta do servidor (padrão: 5000)
- `DEBUG` - Modo debug (padrão: False)
- `DATABASE_URL` - URL do banco de dados

### 💡 Dicas

1. **Sempre verifique o console do navegador primeiro**
2. **Os logs agora mostram a URL exata sendo chamada**
3. **Cada requisição mostra o status HTTP**
4. **Erros da API mostram a mensagem completa**

### 🆘 Ainda com Problema?

Se o erro persistir após todas as verificações:
1. Copie as mensagens do console do navegador
2. Copie os logs do servidor (`tail -50 /tmp/flask.log`)
3. Anote exatamente qual botão você clicou
4. Informe se está usando local ou Render
