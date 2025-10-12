import joblib
import numpy as np
import os
from sklearn.linear_model import Ridge
from typing import Tuple, Optional, List, Dict, Any
import random

class ETAPredictor:
    """
    Class for predicting estimated time of arrival (ETA) for rakes
    """
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.model_path = model_path
        
        if model_path and os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = self._train_dummy_model()
        else:
            self.model = self._train_dummy_model()
    
    def _train_dummy_model(self) -> Ridge:
        """
        Create and train a simple regression model as a placeholder
        """
        # Create dummy data
        X = np.array([
            [100, 40, 0],    # 100km, 40km/h, no delay
            [100, 40, 0.1],  # 100km, 40km/h, 10% delay
            [200, 45, 0],    # 200km, 45km/h, no delay
            [200, 45, 0.2],  # 200km, 45km/h, 20% delay
            [300, 50, 0],    # 300km, 50km/h, no delay
            [300, 50, 0.1],  # 300km, 50km/h, 10% delay
        ])
        
        # Simple ETA calculation: distance / speed * (1 + delay_factor)
        y = np.array([
            100/40,
            (100/40) * 1.1,
            200/45,
            (200/45) * 1.2,
            300/50,
            (300/50) * 1.1
        ])
        
        # Train a simple regression model
        model = Ridge(alpha=0.1)
        model.fit(X, y)
        
        return model
    
    def predict_eta(self, distance_km: float, speed_kmph: float, delay_factor: float = 0) -> float:
        """
        Predict ETA in hours based on distance, speed and delay factor
        
        Args:
            distance_km: Distance in kilometers
            speed_kmph: Speed in kilometers per hour
            delay_factor: Expected delay factor (0 to 1)
            
        Returns:
            ETA in hours
        """
        if self.model is None:
            # Fallback calculation if no model
            return (distance_km / speed_kmph) * (1 + delay_factor)
        
        # Predict using model
        try:
            features = np.array([[distance_km, speed_kmph, delay_factor]])
            eta_hours = self.model.predict(features)[0]
            return max(0.5, eta_hours)  # Ensure minimum ETA is 0.5 hours
        except Exception as e:
            print(f"Error in prediction: {e}")
            # Fallback to simple calculation
            return (distance_km / speed_kmph) * (1 + delay_factor)
    
    def batch_predict(self, features: List[Dict[str, float]]) -> List[float]:
        """
        Batch prediction for multiple routes
        
        Args:
            features: List of dictionaries with keys 'distance_km', 'speed_kmph', 'delay_factor'
            
        Returns:
            List of ETAs in hours
        """
        results = []
        for feature in features:
            eta = self.predict_eta(
                feature['distance_km'], 
                feature['speed_kmph'],
                feature.get('delay_factor', 0)
            )
            results.append(eta)
        
        return results
    
    def save_model(self, path: Optional[str] = None) -> None:
        """
        Save the model to disk
        """
        if self.model is not None:
            save_path = path or self.model_path
            if save_path:
                joblib.dump(self.model, save_path)

# Create a default instance
predictor = ETAPredictor()

# Convenience function for direct use
def predict_eta(distance_km: float, speed_kmph: float, delay_factor: float = 0) -> float:
    return predictor.predict_eta(distance_km, speed_kmph, delay_factor)