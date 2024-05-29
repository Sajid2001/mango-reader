from .. import db
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key=True)
    manga_id = db.Column(db.Integer, db.ForeignKey('manga.id'), nullable=False)
    link = db.Column(db.String(500), nullable=False)
    chapter_name = db.Column(db.String(500), nullable=False)
    chapter_number = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"Chapter('{self.link}')"
    
    def to_dict(self):
        return {
        'id': self.id,
        'manga_id': self.manga_id,
        'link': self.link,
        'chapter_name': self.chapter_name,
        'chapter_number': self.chapter_number
    }