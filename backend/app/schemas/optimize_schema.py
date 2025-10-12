from pydantic import BaseModel, Field, Json
from datetime import datetime
from typing import Optional, List, Dict, Any

class OrderItem(BaseModel):
    order_id: str
    quantity: float

class StockyardItem(BaseModel):
    stockyard_id: str
    material: str
    capacity: float
    cost: float = Field(..., description="Cost per ton")

class OptimizationRequest(BaseModel):
    orders: List[OrderItem] = Field(..., description="List of orders to fulfill")
    materials: List[StockyardItem] = Field(..., description="List of available materials in stockyards")
    constraints: Optional[Dict[str, Any]] = Field(None, description="Optional constraints for the optimization")

class AllocationItem(BaseModel):
    order_id: str
    from_stockyard: str
    destination: str
    quantity: float

class OptimizationResult(BaseModel):
    task_id: str
    rake_id: Optional[str] = None
    optimized_plan: List[AllocationItem]
    total_cost: float
    timestamp: datetime

class OptimizationResponse(BaseModel):
    result: OptimizationResult
    status: str = "success"
    message: Optional[str] = None