from .. import db
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy import UniqueConstraint

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
        try:
            driver.get(chapter_link)
            img_tags = WebDriverWait(driver, 3).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'img.img-fluid')))
            
            if img_tags:
                for img_tag in img_tags:
                    img_src = img_tag.get_attribute('src')
                    scan_url = img_src
                    page_number = int(scan_url.split('-')[-1].split('.')[0].lstrip('0'))  # Extract the page number

                    # Create a Pages object and add it to the session
                    page = Pages(manga_id=manga_id, chapter_number=chapter_number, scan_url=scan_url, page_number=page_number)
                    db.session.add(page)

                # Commit changes
                db.session.commit()

        except Exception as e:
            print("An error occurred:", e)

        
    def to_dict(self):
        return {
        'id': self.id,
        'manga_id': self.manga_id,
        'chapter_number': self.chapter_number,
        'scan_url': self.scan_url,
        'page_number': self.page_number
    }