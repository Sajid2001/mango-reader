from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
ma = Marshmallow()
# DB_NAME = os.getenv('DB_NAME')
DB_CONNECTION = os.getenv('DB_CONNECTION')

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # This commented line below is only for sqlite
    # app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

    # Now you need a new environment variable called
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONNECTION
    db.init_app(app)

    from app.views import hello_view
    from app.views import mangas_view

    app.register_blueprint(hello_view.hello, url_prefix='/api')
    app.register_blueprint(mangas_view.manga, url_prefix='/api')

    # Manga model that was here has been moved to it's own file inside the models folder

    # This commented code block below is not necessary for a postgres database
    # with app.app_context(): 
    #     db.create_all()

    return app

# This function below is not necessary for a postgres database, only for sqlite
# def create_database(app):
#     if not os.path.exists('app/' + DB_NAME):
#         with app.app_context():  # Creating application context
#             db.create_all()
#             print('Created Database')
