from pydantic import BaseModel
from typing import List, Optional
from ..models.item import SupermarketSector


class ProductClassificationRequest(BaseModel):
    product_name: str


class ProductClassificationResponse(BaseModel):
    product_name: str
    sector: SupermarketSector
    confidence: Optional[float] = None


class ListGenerationRequest(BaseModel):
    theme: str
    people_count: Optional[int] = 1


class ListGenerationResponse(BaseModel):
    theme: str
    items: List[dict]
    total_items: int
    shopping_list_id: Optional[int] = None
    message: Optional[str] = None

    class Config:
        from_attributes = True


class SuggestionRequest(BaseModel):
    user_id: int
    limit: Optional[int] = 10


class RecipeIngredientsRequest(BaseModel):
    recipe_name: str
    people_count: Optional[int] = 1
    difficulty: Optional[str] = "normal"  # fácil, normal, difícil


class RecipeIngredientsResponse(BaseModel):
    recipe_name: str
    ingredients: List[dict]
    total_ingredients: int
    estimated_cost: Optional[str] = None
    cooking_time: Optional[str] = None
    difficulty: str
    shopping_list_id: Optional[int] = None
    message: Optional[str] = None

    class Config:
        from_attributes = True


class SuggestionResponse(BaseModel):
    suggested_items: List[str]
    based_on_history: bool 