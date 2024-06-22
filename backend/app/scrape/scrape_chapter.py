from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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
chrome_options.add_argument("--remote-debugging-port=9222")

def scrape_chapter(manga_id, chapter_number):
    time.sleep(3)
    driver = webdriver.Chrome(options=chrome_options)
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