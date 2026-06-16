from fastapi import Depends
from ..database import get_db
from ..models.user import User

def get_current_user(db = Depends(get_db)) -> User:
    """Get the default single-tenant user"""
    user = db.query(User).first()
    if not user:
        user = User(email="mock@hestia.com", hashed_password="mock", name="Hestia User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user