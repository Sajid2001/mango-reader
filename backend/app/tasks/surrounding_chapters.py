# from ..middleware.celery_app import celery_app
# from ..views.chapters_view import scrape_chapter
from ..models.pages import Pages
from ..scrape.scrape_chapter import scrape_chapter
from run import celery_app
@celery_app.task
def scrape_surrounding_chapters(manga_id, surrounding_chapters):
    for chapter_number in surrounding_chapters:
        chapter_pages = Pages.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
        if not chapter_pages:
            scrape_chapter(manga_id, chapter_number)