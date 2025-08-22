from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..database import Base


class SupermarketSector(enum.Enum):
    HORTIFRUTI = "hortifruti"
    MERCEARIA = "mercearia"
    LIMPEZA = "limpeza"
    CONGELADOS = "congelados"
    PADARIA = "padaria"
    BEBIDAS = "bebidas"
    HIGIENE = "higiene"


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False, default=1.0)
    unit = Column(String, nullable=False, default="un")
    sector = Column(Enum(SupermarketSector), nullable=True)
    is_purchased = Column(Boolean, default=False)
    shopping_list_id = Column(Integer, ForeignKey("shopping_lists.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    shopping_list = relationship("ShoppingList", back_populates="items")
    
    def __repr__(self):
        return f"<Item(id={self.id}, name='{self.name}', quantity={self.quantity}, sector='{self.sector}')>" 