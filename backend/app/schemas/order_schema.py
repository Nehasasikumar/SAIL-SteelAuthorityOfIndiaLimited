from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class OrderBase(BaseModel):
    material: str = Field(..., description="Material type")
    quantity: float = Field(..., description="Quantity in tons")
    destination: str = Field(..., description="Customer location")
    priority: int = Field(3, description="Order priority (1-5, where 1 is highest)")

class OrderCreate(OrderBase):
    order_id: Optional[str] = Field(None, description="Unique identifier for the order")

class OrderUpdate(OrderBase):
    status: Optional[str] = Field(None, description="Status of the order: Pending, In Progress, Completed")

class OrderInDB(OrderBase):
    order_id: str
    status: str = "Pending"
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Order(OrderInDB):
    pass