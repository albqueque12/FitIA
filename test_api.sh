#!/bin/bash

echo "======================================"
echo "TESTE COMPLETO DA API FitIA"
echo "======================================"
echo ""

echo "1. Testando saúde do servidor..."
curl -s http://localhost:5000/health | python3 -m json.tool
echo ""

echo "2. Buscando dados do usuário..."
curl -s http://localhost:5000/api/users/1 | python3 -m json.tool
echo ""

echo "3. Testando geração de plano (semana 4)..."
curl -s -X POST http://localhost:5000/api/users/1/training-plan/4 \
  -H "Content-Type: application/json" | python3 -m json.tool | head -40
echo ""

echo "4. Buscando progresso do usuário..."
curl -s http://localhost:5000/api/users/1/progress | python3 -m json.tool
echo ""

echo "======================================"
echo "TESTE CONCLUÍDO!"
echo "======================================"
