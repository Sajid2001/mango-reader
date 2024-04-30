import psycopg2
import os
import re
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from bs4 import BeautifulSoup

db = SQLAlchemy()
load_dotenv()

class Manga(db.Model):
    __tablename__ = 'manga'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    alternate_names = db.Column(db.String(200))
    authors = db.Column(db.String(200))
    genres = db.Column(db.String(200))
    description = db.Column(db.Text)
    status = db.Column(db.String(100))
    total_chapters = db.Column(db.Integer)
    rss_link = db.Column(db.String(200))
    banner_image = db.Column(db.String(500))
    cover_image = db.Column(db.String(500))

    def __repr__(self):
        return f"Manga('{self.__dict__}')"

    @staticmethod
    def insert_data_from_txt(file_path):
        firefox_options = FirefoxOptions()
        firefox_options.add_argument("--private")
        firefox_options.add_argument("--headless")
        # firefox_options.add_argument("--disable-cache")
        driver = webdriver.Firefox(options=firefox_options)
        
        conn = psycopg2.connect(
            dbname=os.getenv('POSTGRES_DB_NAME'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT')
        )
        print("Connected to PostgreSQL database")
        cur = conn.cursor()

        try:
            with open(file_path, 'r') as file:
                manga_data = {}
                for line in file:
                    line = line.strip()  # Remove leading/trailing whitespaces
                    if line:  # Line not blank
                        key, value = line.split(': ', 1)  # Split the line into key and value
                        manga_data[key] = value
                    else:  # If encountering a blank line, process the manga_data
                        if manga_data:  # Check if manga_data is not empty
                            Manga.process_manga_data(cur, manga_data, driver)
                            manga_data = {}  # Reset manga_data
                            
                # Process the last manga entry if not already processed
                if manga_data:
                    Manga.process_manga_data(cur, manga_data, driver)

        except Exception as e:
            print("An error occurred:", e)
        
        finally:
            conn.commit()
            cur.close()
            conn.close()
            driver.quit()

    @staticmethod
    def process_manga_data(cursor, manga_data, driver):
        try:
            cursor.execute("""
                INSERT INTO manga (title, alternate_names, authors, genres, description, status, total_chapters, rss_link, banner_image, cover_image)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                manga_data.get("Title", None),
                manga_data.get("Alternate Names", None),
                manga_data.get("Author(s)", None),
                manga_data.get("Genre", None),
                manga_data.get("Description", None),
                manga_data.get("Status", None),
                manga_data.get("Total Chapters", None),
                manga_data.get("RSS Link", None),
                manga_data.get("Banner Image", None),
                manga_data.get("Cover Image", None)
            ))

            # Get the last inserted manga_id
            cursor.execute("SELECT LASTVAL()")
            manga_id = cursor.fetchone()[0]

            if 'RSS Link' in manga_data:
                Chapter.parse_chapter_links(cursor, manga_id, manga_data['Title'], manga_data['RSS Link'], driver)

            print(f"Processed manga '{manga_data.get('Title')}'")
        
        except Exception as e:
            print("An error occurred:", e)

class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key=True)
    manga_id = db.Column(db.Integer, db.ForeignKey('manga.id'), nullable=False)
    manga_title = db.Column(db.String(100), db.ForeignKey('manga.title'), nullable=False)
    link = db.Column(db.String(500), nullable=False)
    chapter_number = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"Chapter('{self.link}')"

    @staticmethod
    def parse_chapter_links(cursor, manga_id, manga_title, rss_link, driver):
        try:
            driver.get(rss_link)
            rss_content = driver.page_source
            soup = BeautifulSoup(rss_content, 'xml')
            chapter_links = soup.find_all('item')
            if chapter_links:
                for item in chapter_links:
                    link = item.find('link').text.strip().replace("-page-1.html", "")
                    if "https://manga4life.com/read-online/" in link:
                        chapter_number = re.search(r'chapter-(\d+(?:\.\d+)?)', link).group(1)
                        cursor.execute("INSERT INTO chapter (manga_id, manga_title, link, chapter_number) VALUES (%s, %s, %s, %s) RETURNING id", (manga_id, manga_title, link, chapter_number))
                        # chapter_id = cursor.fetchone()[0]
                        # print("Chapter ID:", chapter_id)
                        print("Link:", link)
                        # Pages.parse_pages(link, cursor, chapter_id, driver) # We can do this when a user clicks on a chapter
                        # Commit the changes after inserting pages for each chapter
                        # cursor.connection.commit()
                print("Chapter links inserted.")
            else:
                print("No chapter links found in the RSS feed.")

        except Exception as e:
            print("An error occurred:", e)


class Pages(db.Model):
    __tablename__ = 'pages'
    id = db.Column(db.Integer, primary_key=True)
    manga_id = db.Column(db.Integer, db.ForeignKey('manga.id'), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    scan_url = db.Column(db.String(500), nullable=False)
    page_number = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Pages('{self.scan_url}')"
    
    @staticmethod
    def parse_pages(manga_id, chapter_link, cursor, chapter_id, driver):
        print("Parse method:")
        try:
            driver.get(chapter_link)
            img_tags = WebDriverWait(driver, 3).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'img.img-fluid')))
            
            if img_tags:
                for img_tag in img_tags:
                    img_src = img_tag.get_attribute('src')
                    scan_url = img_src
                    page_number = int(scan_url.split('-')[-1].split('.')[0].lstrip('0'))  # Extract the page number
                    cursor.execute("INSERT INTO pages (manga_id, chapter_id, scan_url, page_number) VALUES (%s, %s, %s, %s)", (manga_id, chapter_id, scan_url, page_number))

        except Exception as e:
            print("An error occurred:", e)  