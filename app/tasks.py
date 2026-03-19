import time
from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models import Endpoint, CheckResult
from app.services.monitor import check_endpoint


def monitor_endpoints():

    while True:

        db = SessionLocal()
        now = datetime.utcnow()

        endpoints = db.query(Endpoint).filter(
            Endpoint.is_active == True
        ).all()

        for endpoint in endpoints:

            last_check = db.query(CheckResult).filter(
                CheckResult.endpoint_id == endpoint.id
            ).order_by(
                CheckResult.created_at.desc()
            ).first()

            if not last_check or (
                now - last_check.created_at >= timedelta(seconds=endpoint.interval)
            ):
                check_endpoint(endpoint, db)

        db.close()

        time.sleep(5)  # loop runs frequently, checks based on interval