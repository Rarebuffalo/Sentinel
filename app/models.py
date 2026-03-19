from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    projects = relationship("Project", back_populates="owner")
    settings = relationship("UserSetting", back_populates="user", uselist=False)
    api_keys = relationship("ApiKey", back_populates="user")
    
    
class Project(Base):
    
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String )
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="projects")
    endpoints = relationship("Endpoint", back_populates="project")
    
class Endpoint(Base):
    __tablename__ = "endpoints"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    url = Column(String)
    method = Column(String, default="GET")
    
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    interval = Column(Integer, default=60) # Check every 60 seconds by deafault
    response_threshold = Column(Float, default=2.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    project = relationship("Project", back_populates="endpoints")
    
    # New Status Tracking Fields
    last_status = Column(String, default="NEW")
    last_response_time = Column(Float, nullable=True)
    last_checked_at = Column(DateTime, nullable=True)
    checks = relationship("CheckResult", back_populates="endpoint")
    
    
class CheckResult(Base):
    __tablename__ = "check_results"
    
    id = Column(Integer, primary_key=True, index=True)
    
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"))
    status_code = Column(Integer)
    response_time = Column(Float)
    
    is_success = Column(Boolean)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    endpoint = relationship("Endpoint", back_populates="checks")
    
    
class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"))
    
    message = Column(String)
    
    is_resolved = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    endpoint = relationship("Endpoint")

class UserSetting(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    
    email_alerts = Column(Boolean, default=True)
    slack_alerts = Column(Boolean, default=False)
    discord_alerts = Column(Boolean, default=True)
    
    slack_webhook_url = Column(String, nullable=True)
    discord_webhook_url = Column(String, nullable=True)
    
    global_latency_threshold = Column(Integer, default=2000)
    global_failure_tolerance = Column(Integer, default=3)
    
    user = relationship("User", back_populates="settings")

class ApiKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    key = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="api_keys")
    