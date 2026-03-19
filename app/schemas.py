from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email:str
    password:str
    
    
class UserResponse(BaseModel):
    id:int
    email:str
    created_at:datetime
    
    class Config:
        from_attributes = True
        
        
class ProjectCreate(BaseModel):
    name:str
    
class ProjectResponse(BaseModel):
    id:int
    name:str
    created_at:datetime
    
    class Config:
        from_attributes = True
        
class EndpointCreate(BaseModel):
    name:str
    url:HttpUrl
    method: Optional[str] = "GET"
    interval: Optional[int] = 60
    response_threshold: Optional[float] = 2.0
    project_id: Optional[int] = None
    
class EndpointUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[HttpUrl] = None
    method: Optional[str] = None
    interval: Optional[int] = None
    response_threshold: Optional[float] = None
    is_active: Optional[bool] = None
    
class EndpointResponse(BaseModel):
    id:int
    name:str
    url:HttpUrl
    method:str
    interval:int
    response_threshold:float
    is_active:bool
    created_at:datetime
    last_status: Optional[str] = "NEW"
    last_response_time: Optional[float] = None
    last_checked_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        
class CheckResultResponse(BaseModel):
    id:int
    status_code:int
    reposnse_time:float
    is_success:bool
    checked_at:datetime
    
    class Config:
        from_attributes = True
        
class AlertEndpointResponse(BaseModel):
    id: int
    name: str
    url: HttpUrl
    class Config:
        from_attributes = True
    
class AlertResponse(BaseModel):
    id:int
    message:str
    is_resolved:bool
    created_at:datetime
    endpoint: AlertEndpointResponse
    
    class Config:
        from_attributes = True

class UserSettingBase(BaseModel):
    email_alerts: bool
    slack_alerts: bool
    discord_alerts: bool
    slack_webhook_url: Optional[str] = None
    discord_webhook_url: Optional[str] = None
    global_latency_threshold: int
    global_failure_tolerance: int

class UserSettingUpdate(UserSettingBase):
    pass

class UserSettingResponse(UserSettingBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class ApiKeyResponse(BaseModel):
    id: int
    key: str
    created_at: datetime
    
    class Config:
        from_attributes = True