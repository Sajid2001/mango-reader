import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Connection parameters
DATABASE_URI = os.getenv('POSTGRES_CONNECTION_URI')

# SQL statements to create tables
create_table_queries = [
    """
    CREATE TABLE IF NOT EXISTS manga (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE,
        alternate_names VARCHAR(200),
        authors VARCHAR(200),
        genres VARCHAR(200),
        description TEXT,
        scan_status VARCHAR(100),
        publish_status VARCHAR(100),
        total_chapters INTEGER,
        banner_image VARCHAR(500),
        cover_image VARCHAR(500)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS chapter (
        id SERIAL PRIMARY KEY,
        manga_id INTEGER NOT NULL REFERENCES manga(id),
        link VARCHAR(500) NOT NULL,
        chapter_name VARCHAR(500) NOT NULL,
        chapter_number FLOAT NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        manga_id INTEGER NOT NULL REFERENCES manga(id),
        chapter_number INTEGER NOT NULL,
        scan_url VARCHAR(500) NOT NULL,
        page_number INTEGER NOT NULL
    );
    """
]

def execute_queries(conn, queries):
    with conn.cursor() as cur:
        for query in queries:
            cur.execute(query)
    conn.commit()

def main():
    try:
        # Connect to the database
        conn = psycopg2.connect(DATABASE_URI)
        
        # Create tables
        execute_queries(conn, create_table_queries)
        
        print("Tables created successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()