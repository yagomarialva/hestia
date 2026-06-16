from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.item import SupermarketSector

class PantryItemBase(BaseModel):
    name: str
    current_quantity: float = 0.0
    ideal_quantity: float = 1.0
    unit: str = "un"
    sector: Optional[SupermarketSector] = None

class PantryItemCreate(PantryItemBase):
    pass

class PantryItemUpdate(BaseModel):
    name: Optional[str] = None
    current_quantity: Optional[float] = None
    ideal_quantity: Optional[float] = None
    unit: Optional[str] = None
    sector: Optional[SupermarketSector] = None

class PantryItemResponse(PantryItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PantryGenerateListResponse(BaseModel):
    message: str
    shopping_list_id: int
