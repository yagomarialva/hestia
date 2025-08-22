from .auth import router as auth_router
from .users import router as users_router
from .shopping_lists import router as shopping_lists_router
from .items import router as items_router
from .ai import router as ai_router

__all__ = [
    "auth_router",
    "users_router", 
    "shopping_lists_router",
    "items_router",
    "ai_router"
] 