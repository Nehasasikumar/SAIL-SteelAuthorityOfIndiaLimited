from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Rake(Base):
    __tablename__ = "rakes"
    
    id = Column(String(20), primary_key=True, index=True)
    wagons = Column(Integer, nullable=False, default=0)
    capacity = Column(Float, nullable=False, default=0.0)  # Capacity in tons
    utilization = Column(Float, default=0.0)  # Current utilization as a percentage
    status = Column(String(50), default="Idle")  # Idle, Loading, Departed, In Transit, Arriving, Arrived
    transit_progress = Column(Float, default=0.0)  # Progress percentage (0-100)
    origin = Column(String(100), nullable=True)
    freight_type = Column(String(100), nullable=True)
    weight = Column(Float, nullable=True)  # Weight in tons
    
    # Time tracking
    departure_time = Column(DateTime(timezone=True), nullable=True)
    eta = Column(DateTime(timezone=True), nullable=True)  # Estimated time of arrival
    arrival_time = Column(DateTime(timezone=True), nullable=True)  # Actual arrival time
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    # Relationships
    orders = relationship("Order", back_populates="rake")