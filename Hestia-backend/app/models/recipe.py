from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    cooking_time = Column(String, nullable=True)
    
    # Store structured ingredients as JSON: [{'name': '...', 'quantity': 1, 'unit': '...', 'sector': '...'}]
    ingredients = Column(JSON, default=list)
    
    # Store instructions as Text
    instructions = Column(Text, nullable=True)
    
    source_url = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="recipes")
