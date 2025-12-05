#!/usr/bin/env python3
"""Script de teste para criação de plano de treino"""

import requests
import json

# Configuração
BASE_URL = "http://localhost:5000/api"

def test_create_user():
    """Testa criação de usuário"""
    print("📝 Testando criação de usuário...")
    
    user_data = {
        "nome": "Teste Usuario",
        "idade": 30,
        "peso": 70.0,
        "altura": 175,
        "nivel": "intermediário",
        "objetivo": "meia_maratona",
        "tempo_objetivo_min": 120,
        "distancia_objetivo": 21.1,
        "teste_5km_tempo": 25.0,
        "dias_semana": 4,
        "semanas_treino": 12
    }
    
    response = requests.post(f"{BASE_URL}/users", json=user_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code in [200, 201]:
        return response.json()['user']['id']
    return None

def test_create_plan(user_id):
    """Testa criação de plano de treino"""
    print(f"\n🏃 Testando criação de plano para usuário {user_id}...")
    
    try:
        response = requests.post(f"{BASE_URL}/users/{user_id}/training-plan/1")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 201:
            print("\n❌ ERRO DETECTADO!")
            print(f"Mensagem de erro: {response.json().get('error', 'Erro desconhecido')}")
        else:
            print("\n✅ Plano criado com sucesso!")
            
    except Exception as e:
        print(f"\n❌ EXCEÇÃO: {str(e)}")

def main():
    print("🧪 Iniciando testes de criação de plano...\n")
    
    # Teste 1: Criar usuário
    user_id = test_create_user()
    
    if not user_id:
        print("❌ Falha ao criar usuário. Abortando testes.")
        return
    
    # Teste 2: Criar plano
    test_create_plan(user_id)
    
    print("\n✅ Testes concluídos!")

if __name__ == "__main__":
    main()
