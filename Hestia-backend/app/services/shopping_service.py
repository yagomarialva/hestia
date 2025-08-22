from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from ..models.user import User
from ..models.shopping_list import ShoppingList
from ..models.item import Item, SupermarketSector
from ..schemas.shopping_list import ShoppingListCreate, ShoppingListUpdate
from ..schemas.item import ItemCreate, ItemUpdate
from ..services.ai_service import ollama_service


class ShoppingService:
    @staticmethod
    async def create_shopping_list(db: Session, user_id: int, shopping_list_data: ShoppingListCreate) -> ShoppingList:
        """Create a new shopping list for a user"""
        db_shopping_list = ShoppingList(
            **shopping_list_data.dict(),
            user_id=user_id
        )
        db.add(db_shopping_list)
        db.commit()
        db.refresh(db_shopping_list)
        return db_shopping_list
    
    @staticmethod
    def get_user_shopping_lists(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[ShoppingList]:
        """Get all shopping lists for a user"""
        return db.query(ShoppingList).filter(
            ShoppingList.user_id == user_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_shopping_list(db: Session, shopping_list_id: int, user_id: int) -> Optional[ShoppingList]:
        """Get a specific shopping list by ID for a user"""
        return db.query(ShoppingList).filter(
            ShoppingList.id == shopping_list_id,
            ShoppingList.user_id == user_id
        ).first()
    
    @staticmethod
    def update_shopping_list(db: Session, shopping_list_id: int, user_id: int, shopping_list_data: ShoppingListUpdate) -> Optional[ShoppingList]:
        """Update a shopping list"""
        db_shopping_list = ShoppingService.get_shopping_list(db, shopping_list_id, user_id)
        if not db_shopping_list:
            return None
        
        for field, value in shopping_list_data.dict(exclude_unset=True).items():
            setattr(db_shopping_list, field, value)
        
        db.commit()
        db.refresh(db_shopping_list)
        return db_shopping_list
    
    @staticmethod
    def delete_shopping_list(db: Session, shopping_list_id: int, user_id: int) -> bool:
        """Delete a shopping list"""
        db_shopping_list = ShoppingService.get_shopping_list(db, shopping_list_id, user_id)
        if not db_shopping_list:
            return False
        
        db.delete(db_shopping_list)
        db.commit()
        return True
    
    @staticmethod
    async def add_item_to_list(db: Session, shopping_list_id: int, user_id: int, item_data: ItemCreate) -> Optional[Item]:
        """Add an item to a shopping list"""
        # Verify shopping list exists and belongs to user
        shopping_list = ShoppingService.get_shopping_list(db, shopping_list_id, user_id)
        if not shopping_list:
            return None
        
        # If sector is not provided, try to classify with AI
        if not item_data.sector:
            item_data.sector = await ollama_service.classify_product(item_data.name)
        
        db_item = Item(
            **item_data.dict(),
            shopping_list_id=shopping_list_id
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    
    @staticmethod
    def update_item(db: Session, item_id: int, user_id: int, item_data: ItemUpdate) -> Optional[Item]:
        """Update an item in a shopping list"""
        db_item = db.query(Item).join(ShoppingList).filter(
            Item.id == item_id,
            ShoppingList.user_id == user_id
        ).first()
        
        if not db_item:
            return None
        
        for field, value in item_data.dict(exclude_unset=True).items():
            setattr(db_item, field, value)
        
        db.commit()
        db.refresh(db_item)
        return db_item
    
    @staticmethod
    def delete_item(db: Session, item_id: int, user_id: int) -> bool:
        """Delete an item from a shopping list"""
        db_item = db.query(Item).join(ShoppingList).filter(
            Item.id == item_id,
            ShoppingList.user_id == user_id
        ).first()
        
        if not db_item:
            return False
        
        db.delete(db_item)
        db.commit()
        return True
    
    @staticmethod
    def toggle_item_purchased(db: Session, item_id: int, user_id: int) -> Optional[Item]:
        """Toggle item purchased status"""
        db_item = db.query(Item).join(ShoppingList).filter(
            Item.id == item_id,
            ShoppingList.user_id == user_id
        ).first()
        
        if not db_item:
            return None
        
        db_item.is_purchased = not db_item.is_purchased
        db.commit()
        db.refresh(db_item)
        return db_item
    
    @staticmethod
    def get_user_stats(db: Session, user_id: int) -> dict:
        """Get user shopping statistics"""
        total_lists = db.query(func.count(ShoppingList.id)).filter(
            ShoppingList.user_id == user_id
        ).scalar()
        
        total_items = db.query(func.count(Item.id)).join(ShoppingList).filter(
            ShoppingList.user_id == user_id
        ).scalar()
        
        # Get favorite sector
        favorite_sector = db.query(
            Item.sector,
            func.count(Item.id).label('count')
        ).join(ShoppingList).filter(
            ShoppingList.user_id == user_id
        ).group_by(Item.sector).order_by(desc('count')).first()
        
        return {
            "total_lists": total_lists or 0,
            "total_items": total_items or 0,
            "favorite_sector": favorite_sector[0].value if favorite_sector else None
        }
    
    @staticmethod
    def get_suggestions_from_history(db: Session, user_id: int, limit: int = 10) -> List[str]:
        """Get item suggestions based on user's shopping history"""
        items = db.query(Item.name).join(ShoppingList).filter(
            ShoppingList.user_id == user_id
        ).group_by(Item.name).order_by(
            func.count(Item.id).desc()
        ).limit(limit).all()
        
        return [item[0] for item in items]


# Global instance
shopping_service = ShoppingService() 