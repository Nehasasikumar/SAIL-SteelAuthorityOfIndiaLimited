from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class RakeBase(BaseModel):
    wagons: int = Field(..., description="Number of wagons in the rake")
    utilization: float = Field(0.0, description="Utilization percentage of the rake")
    status: str = Field("Active", description="Status of the rake: Active, In Transit, or Delayed")
    eta: Optional[datetime] = Field(None, description="Expected time of arrival")

class RakeCreate(RakeBase):
    rake_id: str = Field(..., description="Unique identifier for the rake")

class RakeUpdate(RakeBase):
    pass

class RakeInDB(RakeBase):
    rake_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }

class Rake(RakeInDB):
    pass