import httpx
import time
from datetime import datetime

from sqlalchemy.orm import Session
from app import models


def check_endpoint(endpoint: models.Endpoint, db: Session):

    start_time = time.time()

    try:
        response = httpx.request(
            method=endpoint.method,
            url=endpoint.url,
            timeout=10.0
        )

        response_time = time.time() - start_time
        status_code = response.status_code
        is_success = 200 <= status_code < 400

    except Exception:
        response_time = None
        status_code = None
        is_success = False

    #  Save check result
    result = models.CheckResult(
        endpoint_id=endpoint.id,
        status_code=status_code,
        response_time=response_time,
        is_success=is_success
    )

    db.add(result)
    
    # Update endpoint latest stats
    endpoint.last_status = "UP" if is_success else "DOWN"
    endpoint.last_response_time = response_time
    endpoint.last_checked_at = datetime.utcnow()
    db.add(endpoint)
    
    db.commit()

    # ALERT LOGIC
    threshold = getattr(endpoint, 'response_threshold', 2.0) or 2.0

    if not is_success or (response_time is not None and response_time > threshold):

        existing_alert = db.query(models.Alert).filter(
            models.Alert.endpoint_id == endpoint.id,
            models.Alert.is_resolved == False
        ).first()

        if not existing_alert:
            msg = f"Endpoint {endpoint.name} is DOWN" if not is_success else f"High latency on {endpoint.name}: {response_time:.2f}s"
            alert = models.Alert(
                endpoint_id=endpoint.id,
                message=msg
            )
            db.add(alert)
            db.commit()

    else:
        existing_alert = db.query(models.Alert).filter(
            models.Alert.endpoint_id == endpoint.id,
            models.Alert.is_resolved == False
        ).first()

        if existing_alert:
            existing_alert.is_resolved = True
            db.commit()

    return result