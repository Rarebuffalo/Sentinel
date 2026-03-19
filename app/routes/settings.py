from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets

from app import models, schemas
from app.dependencies import get_db, get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/", response_model=schemas.UserSettingResponse)
def get_user_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    settings = db.query(models.UserSetting).filter(
        models.UserSetting.user_id == current_user.id
    ).first()
    
    if not settings:
        settings = models.UserSetting(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
    return settings

@router.put("/", response_model=schemas.UserSettingResponse)
def update_user_settings(
    update_data: schemas.UserSettingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    settings = db.query(models.UserSetting).filter(
        models.UserSetting.user_id == current_user.id
    ).first()
    
    if not settings:
        settings = models.UserSetting(user_id=current_user.id)
        db.add(settings)
        
    for key, value in update_data.dict().items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/apikeys", response_model=list[schemas.ApiKeyResponse])
def get_api_keys(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.ApiKey).filter(models.ApiKey.user_id == current_user.id).all()

@router.post("/apikeys", response_model=schemas.ApiKeyResponse)
def create_api_key(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Generate simple secure token
    new_key_str = f"sk_live_{secrets.token_hex(16)}"
    
    new_key = models.ApiKey(
        user_id=current_user.id,
        key=new_key_str
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)
    return new_key

@router.delete("/apikeys/{key_id}")
def delete_api_key(
    key_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    target_key = db.query(models.ApiKey).filter(
        models.ApiKey.id == key_id,
        models.ApiKey.user_id == current_user.id
    ).first()
    
    if not target_key:
        raise HTTPException(status_code=404, detail="API Key not found")
        
    db.delete(target_key)
    db.commit()
    return {"message": "API Key revoked successfully"}
