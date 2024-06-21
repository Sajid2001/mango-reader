import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    POSTGRES_CONNECTION_URI = os.getenv('POSTGRES_CONNECTION_URI')  
    app.config['SQLALCHEMY_DATABASE_URI'] = POSTGRES_CONNECTION_URI
    
    db.init_app(app)

    from app.views import manga_view
    from app.views import chapters_view

    app.register_blueprint(manga_view.manga_blueprint, url_prefix='/api/manga')
    app.register_blueprint(chapters_view.chapters_blueprint, url_prefix='/api/chapters')

    return app