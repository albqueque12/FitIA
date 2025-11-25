#!/bin/bash

# Script de desenvolvimento local

echo "🚀 Iniciando FitIA em modo desenvolvimento..."

# Criar diretórios necessários
mkdir -p database static

# Copiar .env.example para .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Instalar dependências Python
echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

# Iniciar backend em background
echo "🐍 Iniciando backend Flask..."
python main.py &
BACKEND_PID=$!

# Aguardar backend iniciar
sleep 3

# Iniciar frontend
echo "⚛️  Iniciando frontend React..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ FitIA está rodando!"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Pressione Ctrl+C para parar os servidores"

# Aguardar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
