from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import Token, LoginRequest
from ..schemas.user import UserCreate, UserResponse
from ..services.auth import authenticate_user, create_access_token, get_password_hash, get_current_user
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["🔐 Autenticação"])
security = HTTPBearer()


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    ## Cadastrar Novo Usuário
    
    Cria uma nova conta de usuário no sistema.
    
    **Dados necessários:**
    - **name**: Nome completo do usuário
    - **email**: Email único (será validado)
    - **password**: Senha (será criptografada automaticamente)
    
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    ## Fazer Login
    
    Autentica o usuário e retorna um token JWT para acesso à API.
    
    **Dados necessários:**
    - **email**: Email cadastrado no sistema
    - **password**: Senha do usuário
    
    
    **Como usar o token:**
    - Copie o `access_token` da resposta
    - Adicione no header: `Authorization: Bearer {token}`
    """
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    ## Obter Dados do Usuário Logado
    
    Retorna as informações do usuário autenticado.
    
    **Autenticação necessária:**
    - Token JWT no header: `Authorization: Bearer {token}`
    
    """
    user = get_current_user(db, credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user 