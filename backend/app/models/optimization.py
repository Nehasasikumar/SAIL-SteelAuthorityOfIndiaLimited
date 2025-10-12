from sqlalchemy import Column, String, Float, DateTime, JSON, Integer
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class OptimizationResult(Base):
    __tablename__ = "optimization_results"
    
    task_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    rake_id = Column(String, nullable=True)
    plan = Column(JSON)  # Store the optimization result JSON
    total_cost = Column(Float)
    iteration = Column(Integer, default=1)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Metadata for the optimization
    num_orders = Column(Integer)
    num_stockyards = Column(Integer)
    status = Column(String, default="Completed")  # Completed, Failed, In Progress
    error_message = Column(String, nullable=True)