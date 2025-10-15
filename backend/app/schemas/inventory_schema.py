from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class InventoryBase(BaseModel):
    material: str = Field(..., description="Material type")
    capacity: float = Field(..., description="Available tons")
    location: str = Field(..., description="Latitude-Longitude as string")

class InventoryCreate(InventoryBase):
    stockyard_id: str = Field(..., description="Stockyard ID/name")

class InventoryUpdate(InventoryBase):
    pass

class InventoryInDB(InventoryBase):
    stockyard_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }

class Inventory(InventoryInDB):
    pass