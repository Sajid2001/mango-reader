from flask import Blueprint, jsonify
from .. import Manga

manga = Blueprint('manga', __name__)

@manga.route('/manga', methods=['GET'])
def query_all_manga():
    # Specify the file path when calling insert_from_text
    Manga.insert_from_text('app/middleware/manga_data.txt')
    all_manga = Manga.query.all()

    # You can now use `all_manga` which is a list of Manga objects
    # For example, you can iterate over it to access each manga object
    manga_list = [m.to_dict() for m in all_manga]

    # Return something if needed
    return jsonify(manga_list)
