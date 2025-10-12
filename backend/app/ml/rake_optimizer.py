from ortools.linear_solver import pywraplp
from typing import List, Dict, Any, Optional

def optimize_rakes(materials: List[Dict[str, Any]], orders: List[Dict[str, Any]], constraints: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Optimize rake allocation using Google OR-Tools.
    
    Args:
        materials: List of stockyard materials available
        orders: List of customer orders to fulfill
        constraints: Optional constraints for optimization
    
    Returns:
        Dictionary with optimized allocation plan and total cost
    """
    # Create the solver
    solver = pywraplp.Solver.CreateSolver('SCIP')
    
    # If solver could not be created, return an error
    if not solver:
        return {
            "optimized_plan": [],
            "total_cost": 0,
            "error": "Could not create solver"
        }
    
    # Decision variables
    # x[i, j] = amount of order i fulfilled from stockyard j
    x = {}
    for i, order in enumerate(orders):
        for j, stock in enumerate(materials):
            # Only create variables for compatible materials
            if order.get('material') == stock.get('material'):
                x[i, j] = solver.NumVar(0, order['quantity'], f"x_{i}_{j}")
    
    # Constraints
    # 1. Stockyard capacity constraints
    for j, stock in enumerate(materials):
        solver.Add(
            sum(x[i, j] for i in range(len(orders)) if (i, j) in x) <= stock['capacity']
        )
    
    # 2. Order fulfillment constraints
    for i, order in enumerate(orders):
        solver.Add(
            sum(x[i, j] for j in range(len(materials)) if (i, j) in x) <= order['quantity']
        )
    
    # Apply additional constraints if provided
    if constraints:
        # Example: minimum fulfillment percentage per order
        min_fulfillment = constraints.get('min_fulfillment_percentage')
        if min_fulfillment:
            for i, order in enumerate(orders):
                solver.Add(
                    sum(x[i, j] for j in range(len(materials)) if (i, j) in x) >= 
                    order['quantity'] * (min_fulfillment / 100)
                )
    
    # Objective function: Minimize total cost
    objective = solver.Objective()
    for i, order in enumerate(orders):
        for j, stock in enumerate(materials):
            if (i, j) in x:
                # Cost is a function of distance and quantity
                cost_per_unit = stock['cost']
                objective.SetCoefficient(x[i, j], cost_per_unit)
    objective.SetMinimization()
    
    # Solve the problem
    status = solver.Solve()
    
    # Process the solution
    allocations = []
    if status == pywraplp.Solver.OPTIMAL or status == pywraplp.Solver.FEASIBLE:
        for i, order in enumerate(orders):
            for j, stock in enumerate(materials):
                if (i, j) in x and x[i, j].solution_value() > 0:
                    allocations.append({
                        "order_id": order["order_id"],
                        "from": stock["stockyard_id"],
                        "destination": order["destination"],
                        "quantity": x[i, j].solution_value()
                    })
        
        return {
            "optimized_plan": allocations,
            "total_cost": objective.Value(),
            "status": "success"
        }
    else:
        return {
            "optimized_plan": [],
            "total_cost": 0,
            "status": "failed",
            "error": "No optimal solution found"
        }