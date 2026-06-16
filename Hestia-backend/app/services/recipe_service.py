from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.recipe import Recipe
from ..schemas.recipe import RecipeCreate, RecipeUpdate

class RecipeService:
    @staticmethod
    def create_recipe(db: Session, user_id: int, recipe_data: RecipeCreate) -> Recipe:
        db_recipe = Recipe(
            user_id=user_id,
            title=recipe_data.title,
            description=recipe_data.description,
            image_url=recipe_data.image_url,
            cooking_time=recipe_data.cooking_time,
            ingredients=[ing.dict() for ing in recipe_data.ingredients],
            instructions=recipe_data.instructions,
            source_url=recipe_data.source_url
        )
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe

    @staticmethod
    def get_user_recipes(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Recipe]:
        return db.query(Recipe).filter(Recipe.user_id == user_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_recipe(db: Session, recipe_id: int, user_id: int) -> Optional[Recipe]:
        return db.query(Recipe).filter(Recipe.id == recipe_id, Recipe.user_id == user_id).first()

    @staticmethod
    def update_recipe(db: Session, recipe_id: int, user_id: int, recipe_data: RecipeUpdate) -> Optional[Recipe]:
        db_recipe = RecipeService.get_recipe(db, recipe_id, user_id)
        if not db_recipe:
            return None
        
        update_data = recipe_data.dict(exclude_unset=True)
        if 'ingredients' in update_data:
            update_data['ingredients'] = [ing.dict() for ing in recipe_data.ingredients]

        for field, value in update_data.items():
            setattr(db_recipe, field, value)
            
        db.commit()
        db.refresh(db_recipe)
        return db_recipe

    @staticmethod
    def delete_recipe(db: Session, recipe_id: int, user_id: int) -> bool:
        db_recipe = RecipeService.get_recipe(db, recipe_id, user_id)
        if not db_recipe:
            return False
            
        db.delete(db_recipe)
        db.commit()
        return True

recipe_service = RecipeService()
