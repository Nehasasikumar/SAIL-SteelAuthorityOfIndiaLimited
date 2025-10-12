from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

from app.schemas.optimize_schema import OptimizationRequest, OptimizationResult, AllocationItem
from app.models.optimization import OptimizationResult as OptimizationResultModel
from app.ml.rake_optimizer import optimize_rakes

def optimize_rake_allocation(db: Session, request: OptimizationRequest) -> OptimizationResult:
    """
    Run the optimization algorithm for rake allocation
    """
    # Extract orders and materials from request
    orders = [order.dict() for order in request.orders]
    materials = [material.dict() for material in request.materials]
    constraints = request.constraints or {}
    
    # Call ML optimization logic
    result = optimize_rakes(materials, orders, constraints)
    
    # Create task ID
    task_id = str(uuid.uuid4())
    
    # Convert to format expected by frontend
    optimized_plan = []
    for allocation in result["optimized_plan"]:
        optimized_plan.append(
            AllocationItem(
                order_id=allocation["order_id"],
                from_stockyard=allocation["from"],
                destination=allocation["destination"],
                quantity=allocation["quantity"]
            )
        )
    
    # Store optimization result in database
    db_result = OptimizationResultModel(
        task_id=task_id,
        rake_id=None,  # To be assigned later if needed
        plan=result,
        total_cost=result["total_cost"],
        num_orders=len(orders),
        num_stockyards=len(materials)
    )
    db.add(db_result)
    db.commit()
    
    # Return result in format expected by API
    return OptimizationResult(
        task_id=task_id,
        optimized_plan=optimized_plan,
        total_cost=result["total_cost"],
        timestamp=datetime.now()
    )