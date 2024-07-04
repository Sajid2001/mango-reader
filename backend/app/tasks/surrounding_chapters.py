from celery import shared_task, group
from dotenv import load_dotenv
from ..models.pages import Pages
from ..models.chapters import Chapter
from .scrape_chapter import scrape_chapter
import time

load_dotenv()

@shared_task(ignore_result=True)
def scrape_surrounding_chapters(manga_id, surrounding_chapters):

    # List to hold all async task results
    task_group = []

    for chapter_number in surrounding_chapters:
        print(f'Scraping chapter {chapter_number}')
        task_group.append(scrape_chapter.s(manga_id, chapter_number))
        print(f'Scraped chapter')
    if task_group:
        group(task_group).apply_async()


