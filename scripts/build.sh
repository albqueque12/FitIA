#!/bin/bash

# Script de build para produção (Render compatible)

echo "🏗️  Construindo FitIA para produção..."

# Install Python dependencies
echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf static/*

# Build do frontend
echo "⚛️  Construindo frontend..."
cd frontend

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências Node.js..."
    npm install
fi

npm run build
cd ..

# Executar migrações do banco de dados
echo "🗄️  Executando migrações do banco de dados..."
python migrate_add_pdf_filename.py

echo "✅ Build concluído!"
echo "   Arquivos estáticos em: ./static/"
echo ""
echo "Para testar localmente:"
echo "  python main.py"
echo ""
echo "Para deploy com Docker:"
echo "  docker-compose up -d"
