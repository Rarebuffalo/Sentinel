import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app import models

# Create all new tables (like UserSetting and ApiKey)
print("Creating models...")
models.Base.metadata.create_all(bind=engine)
print("Done!")
