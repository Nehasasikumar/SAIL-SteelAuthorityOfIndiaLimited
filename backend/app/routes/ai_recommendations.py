from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.report_schema import AIRecommendation
from app.services.ai_service import get_recommendations

router = APIRouter()

@router.get("/ai/recommendations", response_model=List[AIRecommendation])
async def get_ai_recommendations(
    category: Optional[str] = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get AI-generated text suggestions for optimization and decision support
    """
    try:
        recommendations = get_recommendations(db, category=category, limit=limit)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI recommendations: {str(e)}")