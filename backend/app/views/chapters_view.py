from flask import Blueprint, jsonify
from .. import db
from ..models.chapters import Chapter
from ..models.pages import Pages
from ..tasks.surrounding_chapters import scrape_surrounding_chapters
from ..tasks.scrape_chapter import scrape_chapter

chapters_blueprint = Blueprint('chapters', __name__)


# Route to get chapters for a manga
@chapters_blueprint.route('/<int:manga_id>', methods=['GET'])
def get_all_chapters_by_manga_id(manga_id):
    chapters = Chapter.query.filter_by(manga_id=manga_id).all()
    chapters_sorted = sorted(chapters, key=lambda p: p.chapter_number)
    chapters_list = [c.to_dict() for c in chapters_sorted]
    return jsonify(chapters_list)

@chapters_blueprint.route('/<int:manga_id>/<int:chapter_number>', methods=['GET'])
def get_chapter_by_manga_id_and_chapter_number(manga_id, chapter_number):
    chapter = Chapter.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).first_or_404()
    return jsonify(chapter.to_dict())

# Route to get pages for a chapter of a manga
@chapters_blueprint.route('/<int:manga_id>/<int:chapter_number>/pages', methods=['GET'])
def get_pages_for_chapter(manga_id, chapter_number):
    chapter = Chapter.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).first()
    chapter_pages = Pages.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
    chapters_page_list = [p.to_dict() for p in chapter_pages]
    surrounding_chapters = get_surrounding_chapters(manga_id, chapter_number)
    
    if chapters_page_list and len(chapters_page_list) > 0:
        scrape_surrounding_chapters.delay(manga_id, surrounding_chapters)
        return jsonify(chapters_page_list)
    else:
        if chapter.is_processing:
            return jsonify({"error": "Chapter is already being processed"}), 400
        
        chapter.is_processing = True 
        db.session.commit()
        # Chapter not found in the database, scrape it first
        scraped_pages = scrape_chapter(manga_id, chapter_number, False)
        scraped_page_list = [p.to_dict() for p in scraped_pages]
        
        if scraped_page_list and len(scraped_page_list) > 0:
            scrape_surrounding_chapters.delay(manga_id, surrounding_chapters)
            return jsonify(scraped_page_list)
        else:
            return jsonify({"error": "Chapter not found"}), 404

def get_surrounding_chapters(manga_id, chapter_number):
    # Query for chapters around the specified chapter number that have no pages
    surrounding_chapter_numbers = db.session.query(Chapter.chapter_number).filter(
        Chapter.manga_id == manga_id,
        Chapter.chapter_number.between(chapter_number - 1, chapter_number + 1),
        Chapter.chapter_number != chapter_number,
        Chapter.is_processing == False,
        ~db.session.query(Pages).filter(
            Pages.manga_id == manga_id,
            Pages.chapter_number == Chapter.chapter_number
        ).exists()
    ).all()

    # Extract chapter numbers
    surrounding_chapter_numbers_list = [num for (num,) in surrounding_chapter_numbers]

    # Query for Chapter objects
    surrounding_chapters = Chapter.query.filter(
        Chapter.manga_id == manga_id,
        Chapter.chapter_number.in_(surrounding_chapter_numbers_list)
    ).all()

    # Set is_processing to True for the surrounding chapters
    for chapter in surrounding_chapters:
        if not chapter.is_processing:
            chapter.is_processing = True 
    
    db.session.commit()

    return surrounding_chapter_numbers_list
