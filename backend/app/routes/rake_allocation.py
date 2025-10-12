from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.rake_schema import Rake, RakeCreate, RakeUpdate
from app.schemas.optimize_schema import OptimizationRequest, OptimizationResponse
from app.services.rake_service import get_rake, get_all_rakes, create_rake, update_rake, delete_rake
from app.services.optimize_service import optimize_rake_allocation

router = APIRouter()

@router.get("/rake/", response_model=List[Rake])
async def read_rakes(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all rakes with optional status filter
    """
    rakes = get_all_rakes(db, skip=skip, limit=limit, status=status)
    return rakes

@router.get("/rake/{rake_id}", response_model=Rake)
async def read_rake(
    rake_id: str = Path(..., description="The ID of the rake to get"),
    db: Session = Depends(get_db)
):
    """
    Get a single rake by ID
    """
    rake = get_rake(db, rake_id=rake_id)
    if rake is None:
        raise HTTPException(status_code=404, detail="Rake not found")
    return rake

@router.post("/rake/optimize", response_model=OptimizationResponse)
async def optimize_rakes(
    request: OptimizationRequest,
    db: Session = Depends(get_db)
):
    """
    Run AI optimization and get loading plan
    """
    try:
        result = optimize_rake_allocation(db, request)
        return {
            "result": result,
            "status": "success",
            "message": "Optimization completed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@router.post("/rake/", response_model=Rake)
async def create_new_rake(
    rake: RakeCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new rake
    """
    return create_rake(db=db, rake=rake)

@router.put("/rake/{rake_id}", response_model=Rake)
async def update_existing_rake(
    rake_id: str,
    rake: RakeUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing rake
    """
    db_rake = get_rake(db, rake_id=rake_id)
    if db_rake is None:
        raise HTTPException(status_code=404, detail="Rake not found")
    
    return update_rake(db=db, rake_id=rake_id, rake=rake)

@router.delete("/rake/{rake_id}", response_model=dict)
async def delete_existing_rake(
    rake_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete an existing rake
    """
    db_rake = get_rake(db, rake_id=rake_id)
    if db_rake is None:
        raise HTTPException(status_code=404, detail="Rake not found")
    
    delete_rake(db=db, rake_id=rake_id)
    return {"success": True, "message": f"Rake {rake_id} deleted"}