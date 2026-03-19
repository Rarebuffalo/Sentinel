from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.dependencies import get_db, get_current_user
from app.services.monitor import check_endpoint

router = APIRouter(prefix="/endpoints", tags=["Endpoints"])


# 🔹 Create Endpoint (NO auth for now)
@router.post("/", response_model=schemas.EndpointResponse)
def create_endpoint(
    endpoint: schemas.EndpointCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not endpoint.project_id:
        project = db.query(models.Project).filter(models.Project.user_id == current_user.id).first()
        if not project:
            raise HTTPException(status_code=400, detail="No active project found for user.")
        endpoint.project_id = project.id

    new_endpoint = models.Endpoint(
        name=endpoint.name,
        url=str(endpoint.url),
        method=endpoint.method,
        interval=endpoint.interval,
        response_threshold=endpoint.response_threshold,
        project_id=endpoint.project_id
    )

    db.add(new_endpoint)
    db.commit()
    db.refresh(new_endpoint)

    return new_endpoint


# 🔹 Get all endpoints (NO auth)
@router.get("/", response_model=list[schemas.EndpointResponse])
def get_endpoints(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    endpoints = db.query(models.Endpoint).join(models.Project).filter(
        models.Project.user_id == current_user.id
    ).all()
    return endpoints


# 🔹 Get single endpoint (NO auth)
@router.get("/{endpoint_id}", response_model=schemas.EndpointResponse)
def get_endpoint(
    endpoint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    endpoint = db.query(models.Endpoint).join(models.Project).filter(
        models.Endpoint.id == endpoint_id,
        models.Project.user_id == current_user.id
    ).first()

    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    return endpoint


# 🔹 Delete endpoint (NO auth)
@router.delete("/{endpoint_id}")
def delete_endpoint(
    endpoint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    endpoint = db.query(models.Endpoint).join(models.Project).filter(
        models.Endpoint.id == endpoint_id,
        models.Project.user_id == current_user.id
    ).first()

    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    db.delete(endpoint)
    db.commit()

    return {"message": "Endpoint deleted"}


# 🔹 Update endpoint (Edit & Toggle Active) (NO auth)
@router.put("/{endpoint_id}", response_model=schemas.EndpointResponse)
def update_endpoint(
    endpoint_id: int,
    endpoint_update: schemas.EndpointUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    endpoint = db.query(models.Endpoint).join(models.Project).filter(
        models.Endpoint.id == endpoint_id,
        models.Project.user_id == current_user.id
    ).first()

    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    update_data = endpoint_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == 'url':
            setattr(endpoint, key, str(value))
        else:
            setattr(endpoint, key, value)

    db.add(endpoint)
    db.commit()
    db.refresh(endpoint)

    return endpoint


# 🔹 Manual Check endpoint (NO auth)
@router.post("/{endpoint_id}/check")
def manual_check_endpoint(
    endpoint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    endpoint = db.query(models.Endpoint).join(models.Project).filter(
        models.Endpoint.id == endpoint_id,
        models.Project.user_id == current_user.id
    ).first()

    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")
        
    check_endpoint(endpoint, db)
    
    return {"message": "Manual check dispatched successfully"}