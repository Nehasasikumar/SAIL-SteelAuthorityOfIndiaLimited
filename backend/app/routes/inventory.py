from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.inventory_schema import Inventory, InventoryCreate, InventoryUpdate
from app.services.inventory_service import get_stockyard, get_all_stockyards, create_stockyard, update_stockyard, delete_stockyard

router = APIRouter()

@router.get("/inventory/stockyards", response_model=List[Inventory])
async def read_stockyards(
    skip: int = 0, 
    limit: int = 100, 
    material: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all stockyards with optional material filter
    """
    stockyards = get_all_stockyards(db, skip=skip, limit=limit, material=material)
    return stockyards

@router.get("/inventory/stockyards/{stockyard_id}", response_model=Inventory)
async def read_stockyard(
    stockyard_id: str = Path(..., description="The ID of the stockyard to get"),
    db: Session = Depends(get_db)
):
    """
    Get a single stockyard by ID
    """
    stockyard = get_stockyard(db, stockyard_id=stockyard_id)
    if stockyard is None:
        raise HTTPException(status_code=404, detail="Stockyard not found")
    return stockyard

@router.post("/inventory/stockyards", response_model=Inventory)
async def add_stockyard(
    stockyard: InventoryCreate,
    db: Session = Depends(get_db)
):
    """
    Add a new stockyard
    """
    return create_stockyard(db=db, stockyard=stockyard)

@router.put("/inventory/stockyards/{stockyard_id}", response_model=Inventory)
async def update_existing_stockyard(
    stockyard_id: str,
    stockyard: InventoryUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing stockyard
    """
    db_stockyard = get_stockyard(db, stockyard_id=stockyard_id)
    if db_stockyard is None:
        raise HTTPException(status_code=404, detail="Stockyard not found")
    
    return update_stockyard(db=db, stockyard_id=stockyard_id, stockyard=stockyard)

@router.delete("/inventory/stockyards/{stockyard_id}", response_model=dict)
async def delete_existing_stockyard(
    stockyard_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete an existing stockyard
    """
    db_stockyard = get_stockyard(db, stockyard_id=stockyard_id)
    if db_stockyard is None:
        raise HTTPException(status_code=404, detail="Stockyard not found")
    
    delete_stockyard(db=db, stockyard_id=stockyard_id)
    return {"success": True, "message": f"Stockyard {stockyard_id} deleted"}