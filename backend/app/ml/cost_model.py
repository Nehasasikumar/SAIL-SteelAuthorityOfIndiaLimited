import numpy as np
from typing import Dict, Any, Optional, List

class CostModel:
    """
    Cost estimation model for rake operations
    """
    def __init__(self):
        # Default parameters for the cost model
        self.parameters = {
            "base_rate": 0.8,       # Base rate per ton-km
            "fuel_factor": 1.0,     # Current fuel price factor (1.0 = baseline)
            "distance_factor": 1.0, # Factor for distance scaling (1.0 = linear)
            "weight_factor": 0.9,   # Factor for weight scaling (1.0 = linear)
            "fixed_cost": 5000      # Fixed cost per rake operation
        }
    
    def update_parameters(self, new_params: Dict[str, float]) -> None:
        """
        Update model parameters
        """
        self.parameters.update(new_params)
    
    def estimate_cost(
        self, 
        distance: float,
        load_weight: float, 
        fuel_rate: float = 1.0,
        additional_factors: Optional[Dict[str, float]] = None
    ) -> float:
        """
        Estimate transportation cost
        
        Args:
            distance: Distance in kilometers
            load_weight: Weight of the load in tons
            fuel_rate: Current fuel rate factor (default 1.0)
            additional_factors: Optional dict with additional cost factors
            
        Returns:
            Estimated cost in currency units
        """
        # Base cost calculation: rate * distance * weight
        base_cost = (
            self.parameters["base_rate"] * 
            distance ** self.parameters["distance_factor"] * 
            (load_weight / 1000) ** self.parameters["weight_factor"]
        )
        
        # Apply fuel factor
        cost = base_cost * fuel_rate * self.parameters["fuel_factor"]
        
        # Add fixed cost
        cost += self.parameters["fixed_cost"]
        
        # Apply any additional factors
        if additional_factors:
            for factor_name, factor_value in additional_factors.items():
                if factor_name == "priority_surcharge" and factor_value > 0:
                    cost *= (1 + factor_value * 0.1)  # 10% per priority level
                elif factor_name == "delay_penalty" and factor_value > 0:
                    cost *= (1 + factor_value * 0.05)  # 5% per delay unit
                elif factor_name == "discount" and factor_value > 0:
                    cost *= (1 - factor_value)  # direct discount factor
        
        return max(0, cost)  # Ensure cost is non-negative
    
    def batch_estimate(self, scenarios: List[Dict[str, Any]]) -> List[float]:
        """
        Batch cost estimation for multiple scenarios
        
        Args:
            scenarios: List of dictionaries with parameters for each scenario
            
        Returns:
            List of estimated costs
        """
        results = []
        for scenario in scenarios:
            cost = self.estimate_cost(
                distance=scenario["distance"],
                load_weight=scenario["load_weight"],
                fuel_rate=scenario.get("fuel_rate", 1.0),
                additional_factors=scenario.get("additional_factors")
            )
            results.append(cost)
        
        return results

# Create a default instance
cost_model = CostModel()

# Convenience function for direct use
def estimate_cost(distance: float, load_weight: float, fuel_rate: float = 1.0) -> float:
    """
    Estimate transportation cost with default model
    """
    return cost_model.estimate_cost(distance, load_weight, fuel_rate)