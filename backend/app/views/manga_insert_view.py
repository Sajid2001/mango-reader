from flask import Blueprint, jsonify
from ..models.manga import Manga

manga_insert_blueprint = Blueprint('insert', __name__)

@manga_insert_blueprint.route('/insert', methods=['GET'])
def insert_all_manga():
    # # Specify the file path when calling insert_from_text
    # Manga.insert_from_text('app/middleware/manga_data.txt')
    # all_manga = Manga.query.all()

    # You can now use `all_manga` which is a list of Manga objects
    # For example, you can iterate over it to access each manga object
    # manga_list = [m.to_dict() for m in all_manga]
    Manga.insert_data_from_txt('./app/middleware/manga_data.txt') 

    # Return something if needed
    return 'manga inserted'
