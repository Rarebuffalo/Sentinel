from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case, cast, Date
from datetime import datetime, timedelta

from app.dependencies import get_db, get_current_user
from app import models, schemas

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/charts")
def get_dashboard_charts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Response Time Trend (Last 30 checks globally for user)
    recent_checks = db.query(models.CheckResult).join(models.Endpoint).join(models.Project).filter(
        models.Project.user_id == current_user.id
    ).order_by(
        models.CheckResult.created_at.desc()
    ).limit(30).all()
    
    recent_checks.reverse()

    trend_data = []
    for c in recent_checks:
        trend_data.append({
            "time": c.created_at.strftime("%H:%M:%S"),
            "responseTime": round(c.response_time * 1000) if c.response_time else 0,
        })

    # 2. Uptime % Trend (Last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    daily_stats = db.query(
        cast(models.CheckResult.created_at, Date).label('date'),
        func.count().label('total'),
        func.sum(case((models.CheckResult.is_success == True, 1), else_=0)).label('success_count')
    ).join(models.Endpoint).join(models.Project).filter(
        models.CheckResult.created_at >= seven_days_ago,
        models.Project.user_id == current_user.id
    ).group_by(
        cast(models.CheckResult.created_at, Date)
    ).order_by(
        cast(models.CheckResult.created_at, Date)
    ).all()
    
    uptime_data = []
    for stat in daily_stats:
        percentage = (stat.success_count / stat.total) * 100 if stat.total > 0 else 0
        uptime_data.append({
            "day": stat.date.strftime("%a"),
            "uptime": round(percentage, 2)
        })

    return {
        "responseTrend": trend_data,
        "uptimeTrend": uptime_data
    }

@router.get("/{endpoint_id}")
def get_endpoint_stats(
    endpoint_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    # Check if endpoint exists and belongs to user
    endpoint = db.query(models.Endpoint).join(models.Project).filter(
        models.Endpoint.id == endpoint_id,
        models.Project.user_id == current_user.id
    ).first()

    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    # Total checks
    total_checks = db.query(models.CheckResult).filter(
        models.CheckResult.endpoint_id == endpoint_id
    ).count()

    # Failed checks
    failed_checks = db.query(models.CheckResult).filter(
        models.CheckResult.endpoint_id == endpoint_id,
        models.CheckResult.is_success == False
    ).count()

    # Uptime %
    uptime = 0
    if total_checks > 0:
        uptime = ((total_checks - failed_checks) / total_checks) * 100

    # Average response time
    avg_response_time = db.query(
        func.avg(models.CheckResult.response_time)
    ).filter(
        models.CheckResult.endpoint_id == endpoint_id
    ).scalar()

    # Failure rate %
    failure_rate = 0
    if total_checks > 0:
        failure_rate = (failed_checks / total_checks) * 100

    # Recent checks (last 10)
    recent_checks = db.query(models.CheckResult).filter(
        models.CheckResult.endpoint_id == endpoint_id
    ).order_by(
        models.CheckResult.created_at.desc()
    ).limit(10).all()

    # Convert to schema (clean response)
    recent_checks_data = [
        schemas.CheckResultResponse.from_orm(check)
        for check in recent_checks
    ]

    return {
        "endpoint_id": endpoint_id,
        "total_checks": total_checks,
        "failed_checks": failed_checks,
        "uptime_percentage": uptime,
        "average_response_time": avg_response_time,
        "failure_rate_percentage": failure_rate,
        "recent_checks": recent_checks_data
    }