from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import random
from datetime import datetime

from app.schemas.report_schema import AIRecommendation

def get_recommendations(
    db: Session, 
    category: Optional[str] = None, 
    limit: int = 10
) -> List[AIRecommendation]:
    """
    Get AI-generated recommendations for optimization and decision support
    """
    # This would normally query a machine learning model or service
    # For now, we'll return dummy recommendations
    
    all_recommendations = [
        AIRecommendation(
            id="rec-001",
            text="Based on historical patterns, consider increasing rake allocation to the Eastern sector by 15% this week to handle anticipated demand spikes.",
            category="Allocation",
            priority=1,
            timestamp=datetime.now()
        ),
        AIRecommendation(
            id="rec-002",
            text="Optimizing the loading pattern for HR Coil rakes can improve capacity utilization by approximately 8-10% based on recent loading data.",
            category="Loading",
            priority=2,
            timestamp=datetime.now()
        ),
        AIRecommendation(
            id="rec-003",
            text="Consider prioritizing orders from Customer XYZ due to consistent on-time payment history and strategic partnership potential.",
            category="Order",
            priority=3,
            timestamp=datetime.now()
        ),
        AIRecommendation(
            id="rec-004",
            text="Stockyard A has 30% excess capacity for Wire Rod that could be reallocated to address shortages in HR Coil storage.",
            category="Inventory",
            priority=2,
            timestamp=datetime.now()
        ),
        AIRecommendation(
            id="rec-005",
            text="Route optimization suggests changing the Bokaro-Durgapur-Kolkata sequence to Bokaro-Kolkata-Durgapur for a 12% reduction in transit time.",
            category="Routing",
            priority=1,
            timestamp=datetime.now()
        ),
        AIRecommendation(
            id="rec-006",
            text="Analysis indicates maintenance should be scheduled for Rake R-1028 within the next 15 days to prevent potential breakdown issues.",
            category="Maintenance",
            priority=1,
            timestamp=datetime.now()
        ),
        AIRecommendation(
            id="rec-007",
            text="Consider revising ETA calculations for monsoon season deliveries as historical data shows consistent 18% delay factor during July-September.",
            category="Planning",
            priority=3,
            timestamp=datetime.now()
        ),
    ]
    
    # Filter by category if provided
    if category:
        filtered_recommendations = [rec for rec in all_recommendations if rec.category.lower() == category.lower()]
    else:
        filtered_recommendations = all_recommendations
    
    # Sort by priority (lower number = higher priority)
    sorted_recommendations = sorted(filtered_recommendations, key=lambda x: x.priority)
    
    return sorted_recommendations[:limit]