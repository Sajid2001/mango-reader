from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
ma = Marshmallow()
DB_NAME = os.getenv('DB_NAME')

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    from .views import hello_view

    app.register_blueprint(hello_view.hello, url_prefix='/api')

    with app.app_context():
        db.create_all()

    return app

def create_database(app):
    if not os.path.exists('app/' + DB_NAME):
        db.create_all(app=app)
        print('Created Database')