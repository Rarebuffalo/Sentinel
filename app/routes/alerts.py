from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app import models, schemas

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/", response_model=list[schemas.AlertResponse])
def get_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    alerts = db.query(models.Alert).join(models.Endpoint).join(models.Project).filter(
        models.Project.user_id == current_user.id
    ).all()
    return alerts

