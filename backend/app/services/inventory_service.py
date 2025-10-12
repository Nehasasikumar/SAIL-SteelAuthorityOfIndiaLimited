from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

from app.models.inventory import Inventory
from app.schemas.inventory_schema import InventoryCreate, InventoryUpdate

def get_stockyard(db: Session, stockyard_id: str):
    """
    Get a stockyard by ID
    """
    return db.query(Inventory).filter(Inventory.stockyard_id == stockyard_id).first()

def get_all_stockyards(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    material: Optional[str] = None
):
    """
    Get all stockyards with optional material filter
    """
    query = db.query(Inventory)
    
    if material:
        query = query.filter(Inventory.material == material)
    
    return query.offset(skip).limit(limit).all()

def create_stockyard(db: Session, stockyard: InventoryCreate):
    """
    Create a new stockyard
    """
    db_stockyard = Inventory(**stockyard.dict())
    db.add(db_stockyard)
    db.commit()
    db.refresh(db_stockyard)
    return db_stockyard

def update_stockyard(db: Session, stockyard_id: str, stockyard: InventoryUpdate):
    """
    Update an existing stockyard
    """
    db_stockyard = get_stockyard(db, stockyard_id=stockyard_id)
    
    # Update stockyard fields
    for key, value in stockyard.dict().items():
        setattr(db_stockyard, key, value)
    
    db.commit()
    db.refresh(db_stockyard)
    return db_stockyard

def delete_stockyard(db: Session, stockyard_id: str):
    """
    Delete a stockyard
    """
    db_stockyard = get_stockyard(db, stockyard_id=stockyard_id)
    db.delete(db_stockyard)
    db.commit()
    return db_stockyard