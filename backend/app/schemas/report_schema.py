from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List, Dict, Any

class MetricItem(BaseModel):
    label: str
    value: Any
    change: Optional[float] = None  # Percentage change from previous period
    trend: Optional[str] = None  # "up", "down", or "neutral"
    
    model_config = {
        "from_attributes": True
    }

class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]
    
    model_config = {
        "from_attributes": True
    }

class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    date_range: Optional[Dict[str, date]] = None
    
    model_config = {
        "from_attributes": True
    }

class DashboardOverview(BaseModel):
    metrics: List[MetricItem]
    charts: Dict[str, ChartData]
    
    model_config = {
        "from_attributes": True
    }
    
class DailyReport(ReportBase):
    metrics: List[MetricItem]
    charts: Dict[str, ChartData]
    recommendations: List[str]
    
    model_config = {
        "from_attributes": True
    }
    
class AIRecommendation(BaseModel):
    id: str
    text: str
    category: str
    priority: int
    timestamp: datetime
    
    model_config = {
        "from_attributes": True
    }