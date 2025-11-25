#!/bin/bash

# Script de deploy com Docker

echo "🚢 Fazendo deploy do FitIA com Docker..."

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "❌ Erro: arquivo .env não encontrado!"
    echo "   Copie .env.example para .env e configure suas variáveis"
    exit 1
fi

# Construir e iniciar containers
echo "🐳 Construindo e iniciando containers..."
docker-compose down
docker-compose build
docker-compose up -d

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Deploy concluído!"
echo "   Aplicação: http://localhost:5000"
echo ""
echo "Comandos úteis:"
echo "  Ver logs:     docker-compose logs -f web"
echo "  Parar:        docker-compose down"
echo "  Reiniciar:    docker-compose restart"
