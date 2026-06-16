from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database import get_db
from ..models.pantry_item import PantryItem
from ..models.user import User
from ..models.shopping_list import ShoppingList
from ..models.item import Item
from ..schemas.pantry_item import PantryItemCreate, PantryItemUpdate, PantryItemResponse, PantryGenerateListResponse

# Hardcoded for now until authentication is fully implemented
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(email="test@example.com", name="Test User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

router = APIRouter(
    prefix="/pantry",
    tags=["pantry"]
)

@router.get("", response_model=List[PantryItemResponse])
async def get_pantry_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(PantryItem).filter(PantryItem.user_id == current_user.id).all()
    return items

@router.post("", response_model=PantryItemResponse, status_code=status.HTTP_201_CREATED)
async def create_pantry_item(item: PantryItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_item = PantryItem(**item.model_dump(), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=PantryItemResponse)
def update_pantry_item(item_id: int, item_update: PantryItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_item = db.query(PantryItem).filter(PantryItem.id == item_id, PantryItem.user_id == current_user.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pantry_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_item = db.query(PantryItem).filter(PantryItem.id == item_id, PantryItem.user_id == current_user.id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(db_item)
    db.commit()
    return None

@router.post("/generate-list", response_model=PantryGenerateListResponse)
def generate_shopping_list_from_pantry(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Find all items where current < ideal
    deficit_items = db.query(PantryItem).filter(
        PantryItem.user_id == current_user.id,
        PantryItem.current_quantity < PantryItem.ideal_quantity
    ).all()
    
    if not deficit_items:
        raise HTTPException(status_code=400, detail="Despensa está abastecida. Nenhum item faltante.")
        
    # Create new Shopping List
    list_name = f"Reposição de Despensa - {datetime.now().strftime('%d/%m/%Y')}"
    new_list = ShoppingList(
        name=list_name,
        description="Lista gerada automaticamente a partir do controle de despensa.",
        user_id=current_user.id
    )
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    
    # Add items to the shopping list
    for p_item in deficit_items:
        needed_qty = p_item.ideal_quantity - p_item.current_quantity
        if needed_qty > 0:
            shop_item = Item(
                name=p_item.name,
                quantity=needed_qty,
                unit=p_item.unit,
                sector=p_item.sector,
                shopping_list_id=new_list.id
            )
            db.add(shop_item)
            
    db.commit()
    return PantryGenerateListResponse(
        message=f"Lista gerada com {len(deficit_items)} itens.",
        shopping_list_id=new_list.id
    )
