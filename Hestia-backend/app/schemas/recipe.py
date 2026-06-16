from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class RecipeIngredient(BaseModel):
    name: str
    quantity: float = 1.0
    unit: str = "un"
    sector: Optional[str] = "mercearia"

class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    cooking_time: Optional[str] = None
    instructions: Optional[str] = None

class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredient] = []
    source_url: Optional[str] = None

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    cooking_time: Optional[str] = None
    instructions: Optional[str] = None
    ingredients: Optional[List[RecipeIngredient]] = None

class RecipeResponse(RecipeBase):
    id: int
    user_id: int
    ingredients: List[RecipeIngredient]
    source_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
