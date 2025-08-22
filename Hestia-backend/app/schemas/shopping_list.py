from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .item import ItemResponse


class ShoppingListBase(BaseModel):
    name: str
    description: Optional[str] = None


class ShoppingListCreate(ShoppingListBase):
    pass


class ShoppingListUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ShoppingListResponse(ShoppingListBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[ItemResponse] = []

    class Config:
        from_attributes = True


class ShoppingListWithStats(ShoppingListResponse):
    total_items: int
    purchased_items: int
    remaining_items: int 