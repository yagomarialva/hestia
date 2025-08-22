#!/usr/bin/env python3
"""
Exemplo de uso da API Hestia
Este script demonstra como usar os principais endpoints da API
"""

import requests
import json
from typing import Dict, Any

# Configuração da API
BASE_URL = "http://localhost:8000/api/v1"
HEADERS = {"Content-Type": "application/json"}

class HestiaAPIClient:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token = None
        self.headers = HEADERS.copy()
    
    def set_token(self, token: str):
        """Define o token de autenticação"""
        self.token = token
        self.headers["Authorization"] = f"Bearer {token}"
    
    def register_user(self, name: str, email: str, password: str) -> Dict[str, Any]:
        """Registra um novo usuário"""
        url = f"{self.base_url}/auth/register"
        data = {
            "name": name,
            "email": email,
            "password": password
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Faz login do usuário"""
        url = f"{self.base_url}/auth/login"
        data = {
            "email": email,
            "password": password
        }
        response = requests.post(url, json=data, headers=self.headers)
        if response.status_code == 200:
            token_data = response.json()
            self.set_token(token_data["access_token"])
        return response.json()
    
    def get_profile(self) -> Dict[str, Any]:
        """Obtém o perfil do usuário logado"""
        url = f"{self.base_url}/users/profile"
        response = requests.get(url, headers=self.headers)
        return response.json()
    
    def create_shopping_list(self, name: str, description: str = None) -> Dict[str, Any]:
        """Cria uma nova lista de compras"""
        url = f"{self.base_url}/shopping-lists/"
        data = {
            "name": name,
            "description": description
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def get_shopping_lists(self) -> Dict[str, Any]:
        """Obtém todas as listas de compras do usuário"""
        url = f"{self.base_url}/shopping-lists/"
        response = requests.get(url, headers=self.headers)
        return response.json()
    
    def add_item_to_list(self, list_id: int, name: str, quantity: float = 1.0, unit: str = "un") -> Dict[str, Any]:
        """Adiciona um item à lista de compras"""
        url = f"{self.base_url}/shopping-lists/{list_id}/items"
        data = {
            "name": name,
            "quantity": quantity,
            "unit": unit
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def classify_product(self, product_name: str) -> Dict[str, Any]:
        """Classifica um produto usando IA"""
        url = f"{self.base_url}/ai/classify-product"
        data = {
            "product_name": product_name
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def generate_list(self, theme: str, people_count: int = 1) -> Dict[str, Any]:
        """Gera uma lista de compras baseada em um tema"""
        url = f"{self.base_url}/ai/generate-list"
        data = {
            "theme": theme,
            "people_count": people_count
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def get_suggestions(self, limit: int = 10) -> Dict[str, Any]:
        """Obtém sugestões baseadas no histórico"""
        url = f"{self.base_url}/ai/suggestions"
        data = {
            "user_id": 1,  # Assumindo que o usuário logado tem ID 1
            "limit": limit
        }
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()


def main():
    """Função principal para demonstrar o uso da API"""
    print("🚀 Testando a API Hestia")
    print("=" * 50)
    
    # Criar cliente da API
    client = HestiaAPIClient()
    
    try:
        # 1. Registrar usuário
        print("\n1. Registrando usuário...")
        user_data = client.register_user(
            name="João Silva",
            email="joao@example.com",
            password="senha123"
        )
        print(f"✅ Usuário registrado: {user_data.get('name', 'N/A')}")
        
        # 2. Fazer login
        print("\n2. Fazendo login...")
        login_data = client.login("joao@example.com", "senha123")
        if "access_token" in login_data:
            print("✅ Login realizado com sucesso!")
        else:
            print(f"❌ Erro no login: {login_data}")
            return
        
        # 3. Obter perfil
        print("\n3. Obtendo perfil...")
        profile = client.get_profile()
        print(f"✅ Perfil obtido: {profile.get('name', 'N/A')} - {profile.get('email', 'N/A')}")
        
        # 4. Criar lista de compras
        print("\n4. Criando lista de compras...")
        shopping_list = client.create_shopping_list(
            name="Compras da Semana",
            description="Lista para compras da semana"
        )
        list_id = shopping_list.get('id')
        print(f"✅ Lista criada com ID: {list_id}")
        
        # 5. Adicionar itens à lista
        print("\n5. Adicionando itens à lista...")
        items = [
            {"name": "Maçã", "quantity": 6, "unit": "un"},
            {"name": "Pão", "quantity": 2, "unit": "un"},
            {"name": "Leite", "quantity": 2, "unit": "L"},
            {"name": "Arroz", "quantity": 1, "unit": "kg"}
        ]
        
        for item in items:
            result = client.add_item_to_list(
                list_id=list_id,
                name=item["name"],
                quantity=item["quantity"],
                unit=item["unit"]
            )
            print(f"   ✅ Item adicionado: {item['name']}")
        
        # 6. Obter lista atualizada
        print("\n6. Obtendo lista atualizada...")
        updated_list = client.get_shopping_lists()
        print(f"✅ Lista obtida com {len(updated_list)} itens")
        
        # 7. Classificar produto com IA
        print("\n7. Classificando produto com IA...")
        classification = client.classify_product("Banana")
        if "sector" in classification:
            print(f"✅ Produto 'Banana' classificado como: {classification['sector']}")
        else:
            print(f"❌ Erro na classificação: {classification}")
        
        # 8. Gerar lista com IA
        print("\n8. Gerando lista com IA...")
        generated_list = client.generate_list("Churrasco para 4 pessoas")
        if "items" in generated_list:
            print(f"✅ Lista gerada com {generated_list['total_items']} itens")
            for item in generated_list['items'][:3]:  # Mostrar apenas os primeiros 3 itens
                print(f"   - {item.get('name', 'N/A')} ({item.get('quantity', 'N/A')} {item.get('unit', 'N/A')})")
        else:
            print(f"❌ Erro na geração: {generated_list}")
        
        # 9. Obter sugestões
        print("\n9. Obtendo sugestões...")
        suggestions = client.get_suggestions(limit=5)
        if "suggested_items" in suggestions:
            print(f"✅ {len(suggestions['suggested_items'])} sugestões obtidas")
            for suggestion in suggestions['suggested_items'][:3]:
                print(f"   - {suggestion}")
        else:
            print(f"❌ Erro nas sugestões: {suggestions}")
        
        print("\n🎉 Teste da API concluído com sucesso!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão. Certifique-se de que a API está rodando em http://localhost:8000")
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")


if __name__ == "__main__":
    main() 