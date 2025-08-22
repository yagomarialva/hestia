from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.user import UserUpdate, UserProfile
from ..services.auth import get_current_user
from ..services.shopping_service import shopping_service
from ..models.user import User

router = APIRouter(prefix="/users", tags=["👤 Usuários"])
security = HTTPBearer()


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    ## Obter Perfil Completo do Usuário
    
    Retorna o perfil do usuário com estatísticas de uso do sistema.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Informações retornadas:**
    - Dados pessoais (nome, email, data de cadastro)
    - **total_lists**: Quantidade de listas de compras criadas
    - **total_items**: Total de itens em todas as listas
    - **favorite_sector**: Setor do supermercado mais usado
    
    **Resposta:**
    - `200`: Perfil completo com estatísticas
    - `401`: Token inválido ou expirado
    
    **Exemplo de resposta:**
    ```json
    {
        "id": 1,
        "name": "João Silva",
        "email": "joao@example.com",
        "total_lists": 5,
        "total_items": 23,
        "favorite_sector": "mercearia"
    }
    ```
    """
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user statistics
    stats = shopping_service.get_user_stats(db, user.id)
    
    return UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
        total_lists=stats["total_lists"],
        total_items=stats["total_items"],
        favorite_sector=stats["favorite_sector"]
    )


@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_update: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    ## Atualizar Perfil do Usuário
    
    Permite atualizar informações pessoais do usuário logado.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    **Campos que podem ser atualizados:**
    - **name**: Novo nome (opcional)
    - **email**: Novo email (opcional, deve ser único)
    
    **Exemplo de uso:**
    ```json
    {
        "name": "João Silva Santos",
        "email": "joao.santos@example.com"
    }
    ```
    
    **Resposta:**
    - `200`: Perfil atualizado com sucesso
    - `400`: Email já existe no sistema
    - `401`: Token inválido ou expirado
    
    **Nota:** Apenas os campos enviados serão atualizados.
    """
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update user fields
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    # Get updated statistics
    stats = shopping_service.get_user_stats(db, user.id)
    
    return UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
        total_lists=stats["total_lists"],
        total_items=stats["total_items"],
        favorite_sector=stats["favorite_sector"]
    ) 