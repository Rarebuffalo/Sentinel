import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

conn = psycopg2.connect("postgresql://postgres:password@localhost:5432/sentinel")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

columns = [
    ("last_status", "VARCHAR DEFAULT 'NEW'"),
    ("last_response_time", "FLOAT"),
    ("last_checked_at", "TIMESTAMP")
]

for col_name, col_type in columns:
    try:
        cur.execute(f"ALTER TABLE endpoints ADD COLUMN {col_name} {col_type};")
        print(f"Added {col_name}")
    except psycopg2.errors.DuplicateColumn:
        print(f"Column {col_name} already exists")
    except Exception as e:
        print(f"Failed to add {col_name}: {e}")

cur.close()
conn.close()
print("Migration Complete")
