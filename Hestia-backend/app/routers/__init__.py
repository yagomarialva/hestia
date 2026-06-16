from .shopping_lists import router as shopping_lists_router
from .items import router as items_router
from .ai import router as ai_router
from .pantry import router as pantry_router

__all__ = [
    "shopping_lists_router",
    "items_router",
    "ai_router",
    "pantry_router"
]