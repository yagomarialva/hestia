from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://hestia_user:hestia_password@localhost:5432/hestia_db"
    
    # JWT
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Ollama
    ollama_url: str = "http://localhost:11434"
    
    # App
    debug: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings() 