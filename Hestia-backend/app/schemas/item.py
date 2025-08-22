from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.item import SupermarketSector


class ItemBase(BaseModel):
    name: str
    quantity: float = 1.0
    unit: str = "un"
    sector: Optional[SupermarketSector] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    sector: Optional[SupermarketSector] = None
    is_purchased: Optional[bool] = None


class ItemResponse(ItemBase):
    id: int
    is_purchased: bool
    shopping_list_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ItemWithSector(ItemBase):
    sector: SupermarketSector 