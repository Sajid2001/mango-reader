from flask import Blueprint, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
import psycopg2
import os
from dotenv import load_dotenv

from .. import db
from ..models.chapters import Chapter
from ..models.pages import Pages

load_dotenv()

chapters_blueprint = Blueprint('chapters', __name__)

# Route to get chapters for a manga
@chapters_blueprint.route('/<int:manga_id>', methods=['GET'])
def get_all_chapters_by_manga_id(manga_id):
    chapters = Chapter.query.filter_by(manga_id=manga_id).all()
    chapters_list = [c.to_dict() for c in chapters]
    return jsonify(chapters_list)


# Route to get pages for a chapter of a manga
@chapters_blueprint.route('/<int:manga_id>/<chapter_number>', methods=['GET'])
def get_pages_for_chapter(manga_id, chapter_number):
    chapter_pages = Pages.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
    chapters_page_list = [p.to_dict() for p in chapter_pages]
    if chapters_page_list and len(chapters_page_list) > 0:
        return jsonify(chapters_page_list)
    else:
        # Chapter not found in the database, scrape it
        # return jsonify({"error": "Chapter Pages not found"}), 404
        scraped_pages = scrape_chapter(manga_id, chapter_number)
        scraped_page_list = [p.to_dict() for p in scraped_pages]
        if scraped_page_list and len(scraped_page_list) > 0:
            return jsonify(scraped_page_list)
        else:
            return jsonify({"error": "Chapter not found"}), 404

def scrape_chapter(manga_id, chapter_number):
    chrome_options = ChromeOptions()
    chrome_options.add_argument("--incognito")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--remote-debugging-port=9222")
    driver = webdriver.Chrome(options=chrome_options)
    load_dotenv()

    try:
        # Get the database session
        db_session = db.session

        # Query the chapter link using SQLAlchemy
        chapter_link = db_session.query(Chapter.link).filter_by(manga_id=manga_id, chapter_number=chapter_number).scalar()

        if not chapter_link:
            print("No link for chapter number " + str(chapter_number) + " in manga " + str(manga_id) + " in database")
            return None 

        # Parse and insert pages using SQLAlchemy
        Pages.parse_pages(manga_id, chapter_link, chapter_number, driver)

        # Commit changes
        db_session.commit()

        # Query and return pages using SQLAlchemy
        pages = db_session.query(Pages).filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
        return pages
        
    except Exception as e:
        print("Error fetching chapter link from database:", e)

    finally:
        driver.quit()

