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

    from app.views import hello_view
    from app.views import mangas_view

    app.register_blueprint(hello_view.hello, url_prefix='/api')
    app.register_blueprint(mangas_view.manga, url_prefix='/api')

    with app.app_context():  # Creating application context
        db.create_all()

    return app

def create_database(app):
    if not os.path.exists('app/' + DB_NAME):
        with app.app_context():  # Creating application context
            db.create_all()
            print('Created Database')

class Manga(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    alternate_names = db.Column(db.String(200))
    authors = db.Column(db.String(200))
    genres = db.Column(db.String(200))
    description = db.Column(db.Text)
    status = db.Column(db.String(20))
    total_chapters = db.Column(db.Integer)
    banner_image = db.Column(db.String(200))

    def __repr__(self):
        return f"Manga('{self.__dict__}')"
    
    @classmethod
    def insert_from_text(cls, file_path):
        with open(file_path, 'r') as file:
            entries = file.read().split('\n\n')  # Split entries by empty lines

            for entry in entries:
                manga_data = {}
                lines = entry.strip().split('\n')  # Split entry by lines

                for line in lines:
                    if ': ' in line:  # Check if the line contains ': '
                        key, value = line.split(': ', 1)  # Split each line by ': ' and get key-value pair
                        key = key.lower().replace(' ', '_')  # Convert key to lowercase and replace spaces with underscores
                        manga_data[key] = value
                    else:
                        # Handle lines that don't contain ': ', maybe log a warning or skip them
                        pass

                # Create Manga object and insert into database
                manga = cls(
                    title=manga_data.get('title'),
                    alternate_names=manga_data.get('alternate_names'),
                    authors=manga_data.get('author(s)'),
                    genres=manga_data.get('genre'),
                    description=manga_data.get('description'),
                    status=manga_data.get('status'),
                    total_chapters=manga_data.get('total_chapters'),
                    banner_image=manga_data.get('banner_image')
                )
                db.session.add(manga)
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'alternate_names': self.alternate_names,
            'authors': self.authors,
            'genres': self.genres,
            'description': self.description,
            'status': self.status,
            'total_chapters': self.total_chapters,
            'banner_image': self.banner_image
        }
