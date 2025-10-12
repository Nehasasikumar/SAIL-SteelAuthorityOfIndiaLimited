from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.report_schema import DashboardOverview
from app.services.dashboard_service import get_dashboard_metrics, get_dashboard_charts

router = APIRouter()

@router.get("/dashboard/overview", response_model=DashboardOverview)
async def get_dashboard_overview(db: Session = Depends(get_db)):
    """
    Get metrics for dashboard (rake count, utilization, dispatch volume, ETA accuracy)
    """
    try:
        metrics = get_dashboard_metrics(db)
        charts = get_dashboard_charts(db)
        
        return {
            "metrics": metrics,
            "charts": charts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve dashboard data: {str(e)}")