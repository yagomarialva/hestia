from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.item import ItemUpdate, ItemResponse
from ..services.auth import get_current_user
from ..services.shopping_service import shopping_service

router = APIRouter(prefix="/items", tags=["📝 Itens"])


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: int,
    item_data: ItemUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an item in a shopping list"""
    updated_item = shopping_service.update_item(db, item_id, user.id, item_data)
    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    return updated_item


@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an item from a shopping list"""
    success = shopping_service.delete_item(db, item_id, user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    return {"message": "Item deleted successfully"}


@router.patch("/{item_id}/toggle", response_model=ItemResponse)
async def toggle_item_purchased(
    item_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle item purchased status"""
    updated_item = shopping_service.toggle_item_purchased(db, item_id, user.id)
    if not updated_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    
    return updated_item 