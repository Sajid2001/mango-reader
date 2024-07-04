from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
import time
from .. import db
from ..models.chapters import Chapter
from ..models.pages import Pages

chrome_options = ChromeOptions()
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

def scrape_chapter(manga_id, chapter_number):

    chapter = Chapter.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).first()
    driver = webdriver.Chrome(options=chrome_options)

    try:
        # Query the chapter link using SQLAlchemy
        chapter_link = db.session.query(Chapter.link).filter_by(manga_id=manga_id, chapter_number=chapter_number).scalar()
        if not chapter_link:
            print("No link for chapter number " + str(chapter_number) + " in manga " + str(manga_id) + " in database")
            chapter.is_processing = False
            db.session.commit()
            return []
        # Parse and insert pages using SQLAlchemy
        Pages.parse_pages(manga_id, chapter_link, chapter_number, driver)

        chapter.is_processing = False
        # Commit changes
        db.session.commit()

        # Query and return pages using SQLAlchemy
        pages = db.session.query(Pages).filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
        return pages

    except Exception as e:
        print("Error fetching chapter link from database:", e)
        chapter.is_processing = False
        db.session.commit()
        return []

    finally:
        driver.quit()