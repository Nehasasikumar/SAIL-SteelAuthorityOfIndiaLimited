from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String(20), primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    material = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)  # Quantity in tons
    destination = Column(String(100), nullable=False)
    origin = Column(String(100), nullable=False, default="Bokaro")
    priority = Column(Integer, default=3)  # 1-5, where 1 is highest priority
    status = Column(String(50), default="Pending")  # Pending, Allocated, In Transit, Delivered
    notes = Column(Text, nullable=True)
    expected_delivery_date = Column(DateTime(timezone=True), nullable=True)
    
    # Link to rake assigned to this order
    rake_id = Column(String(20), ForeignKey("rakes.id"), nullable=True)
    rake = relationship("Rake", back_populates="orders")
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    delivered_at = Column(DateTime(timezone=True), nullable=True)