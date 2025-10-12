from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import random
from datetime import datetime, timedelta

from app.schemas.report_schema import MetricItem, ChartData

def get_dashboard_metrics(db: Session) -> List[MetricItem]:
    """
    Get key metrics for dashboard display
    """
    # This would normally query the database for real metrics
    # For now, we'll return dummy data
    
    metrics = [
        MetricItem(
            label="Total Rakes",
            value=24,
            change=5.5,
            trend="up"
        ),
        MetricItem(
            label="Rake Utilization",
            value="87%",
            change=2.3,
            trend="up"
        ),
        MetricItem(
            label="On-Time Delivery",
            value="92%",
            change=-1.2,
            trend="down"
        ),
        MetricItem(
            label="Pending Orders",
            value=18,
            change=0,
            trend="neutral"
        ),
    ]
    
    return metrics

def get_dashboard_charts(db: Session) -> Dict[str, ChartData]:
    """
    Get chart data for dashboard visualizations
    """
    # Generate sample chart data
    # In a real implementation, this would query the database
    
    # Sample dates for x-axis
    dates = [(datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7, 0, -1)]
    
    charts = {
        "rakeUtilization": ChartData(
            labels=dates,
            datasets=[
                {
                    "label": "Utilization %",
                    "data": [85, 82, 88, 90, 85, 89, 92],
                    "borderColor": "rgb(75, 192, 192)",
                    "backgroundColor": "rgba(75, 192, 192, 0.2)",
                }
            ]
        ),
        "dispatchVolume": ChartData(
            labels=dates,
            datasets=[
                {
                    "label": "Orders Dispatched",
                    "data": [12, 19, 15, 17, 14, 18, 21],
                    "borderColor": "rgb(153, 102, 255)",
                    "backgroundColor": "rgba(153, 102, 255, 0.2)",
                }
            ]
        ),
        "materialDistribution": ChartData(
            labels=["HR Coil", "CR Coil", "Wire Rod", "Plate", "Billets"],
            datasets=[
                {
                    "label": "Tons",
                    "data": [300, 250, 200, 150, 100],
                    "backgroundColor": [
                        "rgba(255, 99, 132, 0.5)",
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(255, 206, 86, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(153, 102, 255, 0.5)"
                    ],
                    "borderWidth": 1
                }
            ]
        )
    }
    
    return charts