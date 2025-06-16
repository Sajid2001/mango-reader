from .. import db
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy import UniqueConstraint
from bs4 import BeautifulSoup
from .chapters import Chapter
import requests 


class Pages(db.Model):
    __tablename__ = 'pages'
    id = db.Column(db.Integer, primary_key=True)
    manga_id = db.Column(db.Integer, db.ForeignKey('manga.id'), nullable=False)
    chapter_number = db.Column(db.Integer, nullable=False)
    scan_url = db.Column(db.String(500), nullable=False)
    page_number = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Pages('{self.scan_url}')"

    @staticmethod
    def parse_pages(manga_id, chapter_link, chapter_number, driver):
        print("Parsing")
        chapter = Chapter.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).first()
        
        max_retries = 3  # Set the maximum number of retries
        retries = 0
        
        try:
            # print('In retry block')
            while retries < max_retries:
                # print('in while loop')
                try:
                    # Use Selenium to get the page
                    driver.get(chapter_link)
                    
                    # Wait for the page to load and the image tags to be present
                    WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'img.maw-w-full.mx-auto')))
                    
                    # Get the page source and pass it to BeautifulSoup
                    soup = BeautifulSoup(driver.page_source, 'html.parser')
                    img_tags = soup.select('img.maw-w-full.mx-auto')
                    
                    if img_tags:
                        for img_tag in img_tags:
                            img_src = img_tag.get('src')
                            scan_url = img_src
                            page_number = img_tag.get('alt')  
                            page_number = int(page_number.split()[-1].lstrip('0')) if page_number else None # Extract the page number

                            # Create a Pages object and add it to the session
                            page = Pages(manga_id=manga_id, chapter_number=chapter_number, scan_url=scan_url, page_number=page_number)
                            db.session.add(page)

                        # Commit changes
                        db.session.commit()
                    
                    # If the code executes successfully, break out of the loop
                    print(f'Scraped chapter {chapter_number}')
                    break

                except Exception as e:
                    retries += 1
                    print(f"An error occurred on attempt {retries}: {e}")
                    print(f"Retrying")
                    if retries == max_retries:
                        raise  # Re-raise the exception to handle it in the outer try-except

        except Exception as e:
            print(f"All retry attempts failed: {e}")

        finally:
            chapter.is_processing = False
            db.session.commit()


        
    def to_dict(self):
        return {
        'id': self.id,
        'manga_id': self.manga_id,
        'chapter_number': self.chapter_number,
        'scan_url': self.scan_url,
        'page_number': self.page_number
    }