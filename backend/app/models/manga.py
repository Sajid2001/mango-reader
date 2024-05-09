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
    # rss_link = db.Column(db.String(200))
    banner_image = db.Column(db.String(500))
    cover_image = db.Column(db.String(500))

    def __repr__(self):
        return f"Manga('{self.__dict__}')"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'alternate_names': self.alternate_names,
            'authors': self.authors,
            'genres': self.genres,
            'description': self.description,
            'status': self.status,
            'total_chapters': self.total_chapters,
            'banner_image': self.banner_image,
            'cover_image': self.cover_image
        }