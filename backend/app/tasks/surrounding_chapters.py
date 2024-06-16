from celery import shared_task
from dotenv import load_dotenv
from ..models.pages import Pages
from ..scrape.scrape_chapter import scrape_chapter

load_dotenv()

@shared_task(ignore_result=True)
def scrape_surrounding_chapters(manga_id, surrounding_chapters):
    for chapter_number in surrounding_chapters:
        chapter_pages = Pages.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
        if not chapter_pages:
            scrape_chapter(manga_id, chapter_number)
