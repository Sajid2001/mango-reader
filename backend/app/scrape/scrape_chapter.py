from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import os
from dotenv import load_dotenv
from .. import db
from ..models.chapters import Chapter
from ..models.pages import Pages

def scrape_chapter(manga_id, chapter_number):
    firefox_options = FirefoxOptions()
    firefox_options.add_argument("--private")
    firefox_options.add_argument("--headless")
    driver = webdriver.Firefox(options=firefox_options)
    load_dotenv()

    try:
        # Get the database session
        db_session = db.session

        # Query the chapter link using SQLAlchemy
        chapter_link = db_session.query(Chapter.link).filter_by(manga_id=manga_id, chapter_number=chapter_number).scalar()

        if not chapter_link:
            print("No link for chapter number " + str(chapter_number) + " in manga " + str(manga_id) + " in database")
            return []

        # Parse and insert pages using SQLAlchemy
        Pages.parse_pages(manga_id, chapter_link, chapter_number, driver)

        # Commit changes
        db_session.commit()

        # Query and return pages using SQLAlchemy
        pages = db_session.query(Pages).filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
        return pages

    except Exception as e:
        print("Error fetching chapter link from database:", e)
        return []

    finally:
        driver.quit()