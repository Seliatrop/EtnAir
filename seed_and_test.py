import os
import time
import psycopg2
from psycopg2.extras import RealDictCursor

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 5432))
DB_NAME = os.getenv('DB_NAME', 'etna_db')
DB_USER = os.getenv('DB_USER', 'etna')
DB_PASS = os.getenv('DB_PASSWORD', 'etna_pass')

def wait_for_db(retries=30, delay=2):
    for i in range(retries):
        try:
            conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
            conn.close()
            print('Database reachable')
            return True
        except Exception as e:
            print(f'Waiting for database... ({i+1}/{retries}) {e}')
            time.sleep(delay)
    return False

def main():
    if not wait_for_db():
        print('Database not reachable, exiting')
        return

    conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Show existing tables
    cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type='BASE TABLE'
    ORDER BY table_name
    """)
    tables = [r['table_name'] for r in cur.fetchall()]
    print('Tables in public schema:', tables)

    # Create a lightweight test table and insert a sample row
    cur.execute("""
    CREATE TABLE IF NOT EXISTS etna_test (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now(),
      info TEXT
    )
    """)
    conn.commit()

    cur.execute("INSERT INTO etna_test (info) VALUES (%s) RETURNING id, created_at", ('seeded from docker',))
    row = cur.fetchone()
    conn.commit()
    print('Inserted into etna_test:', row)

    # Read back all rows
    cur.execute('SELECT * FROM etna_test ORDER BY id DESC LIMIT 10')
    rows = cur.fetchall()
    print('Last rows in etna_test:')
    for r in rows:
        print(r)

    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
