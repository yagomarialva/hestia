from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
from .item import SupermarketSector

class PantryItem(Base):
    __tablename__ = "pantry_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    current_quantity = Column(Float, nullable=False, default=0.0)
    ideal_quantity = Column(Float, nullable=False, default=1.0)
    unit = Column(String, nullable=False, default="un")
    sector = Column(Enum(SupermarketSector), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="pantry_items")

    def __repr__(self):
        return f"<PantryItem(id={self.id}, name='{self.name}', current={self.current_quantity}, ideal={self.ideal_quantity})>"
