from flask import Blueprint, jsonify, request
from sqlalchemy import or_, and_
from ..models.manga import Manga

manga_blueprint = Blueprint('mangas', __name__)

@manga_blueprint.route('/', methods=['GET'])
def get_all_manga():
    all_manga = Manga.query.all()
    manga_list = [m.to_dict() for m in all_manga]
    return jsonify(manga_list)


@manga_blueprint.route('/<int:id>', methods=['GET'])
def get_manga_by_id(id):
    manga = Manga.query.get(id)
    if manga:
        manga_data = manga.to_dict()
        return jsonify(manga_data), 200
    else:
        return jsonify({'error': 'Manga not found'}), 404
 

@manga_blueprint.route('/search', methods=['GET'])
def search_manga_by_name():
    name = request.args.get('name')

    # Perform a fuzzy search for manga by name
    if name:
        manga = Manga.query.filter(
            or_(
                and_(Manga.title.ilike(f'%{name}%'), Manga.alternate_names != None),
                and_(Manga.alternate_names.ilike(f'%{name}%'), Manga.alternate_names != None, Manga.alternate_names != 'None')
            )
        ).all()

        if manga:
            # Convert manga objects to dictionaries
            manga_data = [m.to_dict() for m in manga]
            return jsonify(manga_data), 200
        else:
            return jsonify({"error": "Manga not found"}), 404
    else:
        return jsonify({"error": "Name parameter is required"}), 400
    

