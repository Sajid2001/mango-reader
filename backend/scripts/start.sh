#!/bin/sh

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    echo "Host: $POSTGRES_HOST, User: $POSTGRES_USER, DB: $POSTGRES_DB_NAME"
    until pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB_NAME"; do
        >&2 echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
    >&2 echo "PostgreSQL is up - continuing"
}

# Check if the manga_data.txt file does not exist
if [ ! -f "scripts/manga_data.txt" ]; then
    # Run the scrapy command if the file does not exist
    scrapy runspider scripts/angular_spider.py
else
    echo "The file scripts/manga_data.txt exists. Skipping scrapy command."
fi

wait_for_postgres

# Insert database tables into postgres
python scripts/create_tables.py

# Run database initialization script
python scripts/insert.py

# Start the web server
gunicorn -w 4 -b 0.0.0.0:8000 -k sync run:app