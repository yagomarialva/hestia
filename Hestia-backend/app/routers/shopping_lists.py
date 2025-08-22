from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.shopping_list import ShoppingListCreate, ShoppingListUpdate, ShoppingListResponse, ShoppingListWithStats
from ..schemas.item import ItemCreate
from ..services.auth import get_current_user
from ..services.shopping_service import shopping_service
from ..models.user import User

router = APIRouter(prefix="/shopping-lists", tags=["🛒 Listas de Compras"])
security = HTTPBearer()


@router.post("/", response_model=ShoppingListResponse)
async def create_shopping_list(
    shopping_list_data: ShoppingListCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    ## Criar Nova Lista de Compras
    
    Cria uma nova lista de compras para o usuário logado.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Dados necessários:**
    - **name**: Nome da lista (ex: "Compras da Semana")
    - **description**: Descrição opcional da lista
    
    **Exemplo de uso:**
    ```json
    {
        "name": "Compras da Semana",
        "description": "Lista para compras da semana, incluindo frutas e verduras"
    }
    ```
    
    **Resposta:**
    - `200`: Lista criada com sucesso
    - `401`: Token inválido ou expirado
    
    **Próximos passos:**
    - Use o ID retornado para adicionar itens à lista
    - Acesse `/api/v1/shopping-lists/{id}/items` para adicionar produtos
    """
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return await shopping_service.create_shopping_list(db, user.id, shopping_list_data)


@router.get("/", response_model=List[ShoppingListResponse])
async def get_shopping_lists(
    skip: int = 0,
    limit: int = 100,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    ## Listar Todas as Listas de Compras
    
    Retorna todas as listas de compras do usuário logado com paginação.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Parâmetros de consulta:**
    - **skip**: Quantidade de itens para pular (padrão: 0)
    - **limit**: Quantidade máxima de itens (padrão: 100, máximo: 100)
    
    **Exemplo de uso:**
    ```
    GET /api/v1/shopping-lists/?skip=0&limit=10
    ```
    
    **Resposta:**
    - `200`: Lista de listas de compras
    - `401`: Token inválido ou expirado
    
    **Exemplo de resposta:**
    ```json
    [
        {
            "id": 1,
            "name": "Compras da Semana",
            "description": "Lista para compras da semana",
            "user_id": 1,
            "created_at": "2025-01-15T21:00:00",
            "items": []
        }
    ]
    ```
    """
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return shopping_service.get_user_shopping_lists(db, user.id, skip, limit)


@router.get("/{shopping_list_id}", response_model=ShoppingListResponse)
async def get_shopping_list(
    shopping_list_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get a specific shopping list by ID"""
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    shopping_list = shopping_service.get_shopping_list(db, shopping_list_id, user.id)
    if not shopping_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found"
        )
    
    return shopping_list


@router.put("/{shopping_list_id}", response_model=ShoppingListResponse)
async def update_shopping_list(
    shopping_list_id: int,
    shopping_list_data: ShoppingListUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Update a shopping list"""
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    updated_list = shopping_service.update_shopping_list(db, shopping_list_id, user.id, shopping_list_data)
    if not updated_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found"
        )
    
    return updated_list


@router.delete("/{shopping_list_id}")
async def delete_shopping_list(
    shopping_list_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Delete a shopping list"""
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    success = shopping_service.delete_shopping_list(db, shopping_list_id, user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found"
        )
    
    return {"message": "Shopping list deleted successfully"}


@router.post("/{shopping_list_id}/items", response_model=ShoppingListResponse)
async def add_item_to_list(
    shopping_list_id: int,
    item_data: ItemCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    ## Adicionar Item à Lista de Compras
    
    Adiciona um novo item a uma lista de compras existente.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Parâmetros de rota:**
    - **shopping_list_id**: ID da lista de compras
    
    **Dados do item:**
    - **name**: Nome do produto (obrigatório)
    - **quantity**: Quantidade (padrão: 1.0)
    - **unit**: Unidade de medida (padrão: "un")
    - **sector**: Setor do supermercado (opcional, será classificado automaticamente pela IA)
    
    **Setores disponíveis:**
    - `hortifruti` - Frutas, verduras, legumes
    - `mercearia` - Arroz, feijão, massas
    - `limpeza` - Produtos de limpeza
    - `congelados` - Produtos congelados
    - `padaria` - Pães, bolos
    - `bebidas` - Refrigerantes, sucos
    - `higiene` - Produtos de higiene pessoal
    
    **Exemplo de uso:**
    ```json
    {
        "name": "Maçã",
        "quantity": 6,
        "unit": "un",
        "sector": "hortifruti"
    }
    ```
    
    **Resposta:**
    - `200`: Item adicionado com sucesso, retorna lista atualizada
    - `401`: Token inválido ou expirado
    - `404`: Lista não encontrada
    
    **Recursos especiais:**
    - Se o setor não for informado, a IA classificará automaticamente
    - O item será organizado por setor para facilitar as compras
    """
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    item = await shopping_service.add_item_to_list(db, shopping_list_id, user.id, item_data)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found"
        )
    
    # Return updated shopping list
    return shopping_service.get_shopping_list(db, shopping_list_id, user.id) 