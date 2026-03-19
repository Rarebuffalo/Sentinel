import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

conn = psycopg2.connect("postgresql://postgres:password@localhost:5432/sentinel")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

try:
    cur.execute("ALTER TABLE endpoints ADD COLUMN response_threshold FLOAT DEFAULT 2.0;")
    print("Added response_threshold")
except psycopg2.errors.DuplicateColumn:
    print("Column already exists")
except Exception as e:
    print(f"Failed: {e}")

cur.close()
conn.close()
