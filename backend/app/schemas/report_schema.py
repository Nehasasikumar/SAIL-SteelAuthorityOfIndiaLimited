from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List, Dict, Any

class MetricItem(BaseModel):
    label: str
    value: Any
    change: Optional[float] = None  # Percentage change from previous period
    trend: Optional[str] = None  # "up", "down", or "neutral"

class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]

class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    date_range: Optional[Dict[str, date]] = None

class DashboardOverview(BaseModel):
    metrics: List[MetricItem]
    charts: Dict[str, ChartData]
    
class DailyReport(ReportBase):
    metrics: List[MetricItem]
    charts: Dict[str, ChartData]
    recommendations: List[str]
    
class AIRecommendation(BaseModel):
    id: str
    text: str
    category: str
    priority: int
    timestamp: datetime