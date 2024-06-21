#!/bin/sh

# scrapy runspider scripts/angular_spider.py

# Insert database tables into postgres
python scripts/create_tables.py

# Run database initialization script
python scripts/insert.py

# Start the web server
gunicorn -w 4 -b 0.0.0.0:8000 run:app