import psycopg2
import os
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from flask import Blueprint, jsonify
from ..models.manga import Pages

pages_blueprint = Blueprint('pages', __name__)

# Route to get pages for a chapter of a manga
@pages_blueprint.route('/chapters/<int:manga_id>/<chapter_id>', methods=['GET'])
def get_pages_for_chapter(manga_id, chapter_id):
    chapter_pages = get_pages_from_db(manga_id, chapter_id)
    if chapter_pages:
        return jsonify(chapter_pages)
    else:
        # Chapter not found in the database, scrape it
        scraped_pages = scrape_chapter(manga_id, chapter_id)
        if scraped_pages:
            return jsonify(scraped_pages)
        else:
            return jsonify({"error": "Chapter not found"}), 404

# Function to retrieve pages for a chapter from the database
def get_pages_from_db(manga_id, chapter_id):
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('POSTGRES_DB_NAME'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT')
        )
        print("Connected to PostgreSQL database 1")
        cur = conn.cursor()
        cur.execute("SELECT * FROM pages WHERE manga_id = %s AND chapter_id = %s", (manga_id, chapter_id))
        pages = cur.fetchall()
        return pages
    
    except psycopg2.Error as e:
        print("Error fetching pages from database:", e)

    finally:
        if conn:
            conn.close()

# Function to scrape chapter pages
def scrape_chapter(manga_id, chapter_id):
    firefox_options = FirefoxOptions()
    firefox_options.add_argument("--private")
    firefox_options.add_argument("--headless")
    driver = webdriver.Firefox(options=firefox_options)
    load_dotenv()

    try:
        conn = psycopg2.connect(
            dbname=os.getenv('POSTGRES_DB_NAME'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT')
        )
        print("Connected to PostgreSQL database 2")
        cur = conn.cursor()
        cur.execute("SELECT link FROM chapter WHERE chapter_number = %s AND manga_id = %s", (chapter_id, manga_id))
        row = cur.fetchone()
        if not row:
            print("No link for chapter number " + str(chapter_id) + " in manga " + str(manga_id) + " in database")
            return None 
        link = row[0]  # Get the link from the retrieved row
        Pages.parse_pages(manga_id, link, cur, chapter_id,  driver)
        conn.commit()
        cur.execute("SELECT * FROM pages WHERE manga_id = %s AND chapter_id = %s", (manga_id, chapter_id))
        pages = cur.fetchall()
        return pages
        
    except psycopg2.Error as e:
        print("Error fetching chapter link from database:", e)

    finally:
        if conn:
            conn.close()

