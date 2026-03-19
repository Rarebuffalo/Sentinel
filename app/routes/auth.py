from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session


from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    hashed_password = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-create default project for the new user
    default_project = models.Project(name="Default Project", user_id=new_user.id)
    db.add(default_project)
    db.commit()

    return new_user

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"user_id": db_user.id})

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user