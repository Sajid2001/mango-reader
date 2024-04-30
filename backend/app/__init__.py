import os
from flask import Flask
from flask_cors import CORS
from app.models.manga import db
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv

load_dotenv()

ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    # db = SQLAlchemy(app)
    DB_CONNECTION = os.getenv('DB_CONNECTION')  
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONNECTION
    db.init_app(app)

    from app.views import hello_view
    from app.views import manga_insert_view
    from app.views import search_manga_view
    from app.views import get_all_mangas_view
    from app.views import get_one_manga_view
    from app.views import get_chapters_view
    from app.views import get_pages_view

    app.register_blueprint(hello_view.hello, url_prefix='/api')
    app.register_blueprint(manga_insert_view.manga_insert_blueprint, url_prefix='/api')
    app.register_blueprint(search_manga_view.search_manga_by_name_blueprint, url_prefix='/api')
    app.register_blueprint(get_all_mangas_view.mangas_blueprint, url_prefix='/api')
    app.register_blueprint(get_one_manga_view.manga_blueprint, url_prefix='/api')
    app.register_blueprint(get_chapters_view.chapters_blueprint, url_prefix='/api')
    app.register_blueprint(get_pages_view.pages_blueprint, url_prefix='/api')

    return app