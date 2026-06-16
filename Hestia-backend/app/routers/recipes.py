from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.user import User
from ..schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from ..services.auth import get_current_user
from ..services.recipe_service import recipe_service

router = APIRouter(prefix="/recipes", tags=["🍽️ Receitas"])

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe_data: RecipeCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new saved recipe"""
    return recipe_service.create_recipe(db, user.id, recipe_data)

@router.get("/", response_model=List[RecipeResponse])
async def get_recipes(
    skip: int = 0,
    limit: int = 100,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all saved recipes for the current user"""
    return recipe_service.get_user_recipes(db, user.id, skip, limit)

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific saved recipe"""
    recipe = recipe_service.get_recipe(db, recipe_id, user.id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a saved recipe"""
    updated_recipe = recipe_service.update_recipe(db, recipe_id, user.id, recipe_data)
    if not updated_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return updated_recipe

@router.delete("/{recipe_id}")
async def delete_recipe(
    recipe_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved recipe"""
    success = recipe_service.delete_recipe(db, recipe_id, user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"message": "Recipe deleted successfully"}
