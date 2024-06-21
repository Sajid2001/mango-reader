from flask import Blueprint, jsonify
from ..models.chapters import Chapter
from ..models.pages import Pages
from ..scrape.scrape_chapter import scrape_chapter

chapters_blueprint = Blueprint('chapters', __name__)


# Route to get chapters for a manga
@chapters_blueprint.route('/<int:manga_id>', methods=['GET'])
def get_all_chapters_by_manga_id(manga_id):
    chapters = Chapter.query.filter_by(manga_id=manga_id).all()
    chapters_list = [c.to_dict() for c in chapters]
    return jsonify(chapters_list)

# Route to get pages for a chapter of a manga
@chapters_blueprint.route('/<int:manga_id>/<int:chapter_number>', methods=['GET'])
def get_pages_for_chapter(manga_id, chapter_number):
    chapter_pages = Pages.query.filter_by(manga_id=manga_id, chapter_number=chapter_number).all()
    chapters_page_list = [p.to_dict() for p in chapter_pages]
    
    if chapters_page_list and len(chapters_page_list) > 0:
        return jsonify(chapters_page_list)
    else:
        # Chapter not found in the database, scrape it first
        scraped_pages = scrape_chapter(manga_id, chapter_number)
        scraped_page_list = [p.to_dict() for p in scraped_pages]
        
        if scraped_page_list and len(scraped_page_list) > 0:
            return jsonify(scraped_page_list)
        else:
            return jsonify({"error": "Chapter not found"}), 404
