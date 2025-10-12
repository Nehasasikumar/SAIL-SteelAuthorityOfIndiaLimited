from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.order_schema import Order, OrderCreate, OrderUpdate
from app.services.order_service import get_order, get_all_orders, create_order, update_order, delete_order

router = APIRouter()

@router.get("/orders/", response_model=List[Order])
async def read_orders(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    priority: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get all customer orders with optional filters
    """
    orders = get_all_orders(db, skip=skip, limit=limit, status=status, priority=priority)
    return orders

@router.get("/orders/{order_id}", response_model=Order)
async def read_order(
    order_id: str = Path(..., description="The ID of the order to get"),
    db: Session = Depends(get_db)
):
    """
    Get a single order by ID
    """
    order = get_order(db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/orders/add", response_model=Order)
async def add_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    """
    Add a new customer order
    """
    return create_order(db=db, order=order)

@router.put("/orders/{order_id}", response_model=Order)
async def update_existing_order(
    order_id: str,
    order: OrderUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing order
    """
    db_order = get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return update_order(db=db, order_id=order_id, order=order)

@router.delete("/orders/{order_id}", response_model=dict)
async def delete_existing_order(
    order_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete an existing order
    """
    db_order = get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    delete_order(db=db, order_id=order_id)
    return {"success": True, "message": f"Order {order_id} deleted"}