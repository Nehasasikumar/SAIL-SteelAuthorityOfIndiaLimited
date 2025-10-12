from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.sql import func

from app.core.database import Base

class Inventory(Base):
    __tablename__ = "stockyards"
    
    stockyard_id = Column(String, primary_key=True, index=True)
    material = Column(String)
    capacity = Column(Float)
    location = Column(String)  # Latitude-Longitude as string, e.g., "23.6345,86.1432"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())