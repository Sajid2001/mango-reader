#!/bin/sh

# Check if the manga_data.txt file does not exist
if [ ! -f "scripts/manga_data.txt" ]; then
    # Run the scrapy command if the file does not exist
    scrapy runspider scripts/angular_spider.py
else
    echo "The file scripts/manga_data.txt exists. Skipping scrapy command."
fi

# Insert database tables into postgres
python scripts/create_tables.py

# Run database initialization script
python scripts/insert.py

# Start the web server
gunicorn -w 4 -b 0.0.0.0:8000 -k sync run:app