from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import date, datetime, timedelta

from app.core.database import get_db
from app.schemas.report_schema import DailyReport
from app.services.report_service import get_daily_summary, get_custom_report, export_report_to_pdf

router = APIRouter()

@router.get("/reports/summary", response_model=DailyReport)
async def get_summary_report(
    date_from: Optional[date] = Query(None, description="Start date for the report"),
    date_to: Optional[date] = Query(None, description="End date for the report"),
    db: Session = Depends(get_db)
):
    """
    Get daily summary report with metrics, charts and recommendations
    """
    # Use today's date if no date range is provided
    if not date_from:
        date_from = datetime.now().date()
    if not date_to:
        date_to = date_from
    
    try:
        report = get_daily_summary(db, date_from=date_from, date_to=date_to)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@router.get("/reports/custom")
async def get_custom_report_data(
    report_type: str = Query(..., description="Type of report to generate"),
    date_from: Optional[date] = Query(None, description="Start date for the report"),
    date_to: Optional[date] = Query(None, description="End date for the report"),
    filters: Optional[str] = Query(None, description="Additional filters for the report as JSON string"),
    db: Session = Depends(get_db)
):
    """
    Generate a custom report based on provided parameters
    """
    try:
        # Convert filters string to dict if provided
        filter_dict = {}
        if filters:
            import json
            try:
                filter_dict = json.loads(filters)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON in filters parameter")
        
        report = get_custom_report(
            db, 
            report_type=report_type,
            date_from=date_from,
            date_to=date_to,
            filters=filter_dict
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate custom report: {str(e)}")

@router.get("/reports/export/pdf")
async def export_report_as_pdf(
    report_type: str = Query(..., description="Type of report to export"),
    date_from: Optional[date] = Query(None, description="Start date for the report"),
    date_to: Optional[date] = Query(None, description="End date for the report"),
    db: Session = Depends(get_db)
):
    """
    Export a report as PDF
    """
    try:
        pdf_path = export_report_to_pdf(
            db, 
            report_type=report_type,
            date_from=date_from,
            date_to=date_to
        )
        return {"success": True, "file_path": pdf_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export PDF: {str(e)}")