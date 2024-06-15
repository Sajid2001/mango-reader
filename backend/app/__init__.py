import os
from flask import Flask
from flask_cors import CORS
from app.models.manga import db
# from app.middleware.celery_worker import make_celery
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    # celery = make_celery(app)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    POSTGRES_CONNECTION_URI = os.getenv('POSTGRES_CONNECTION_URI')  
    app.config['SQLALCHEMY_DATABASE_URI'] = POSTGRES_CONNECTION_URI
    app.config['CELERY'] = {
        'broker_url': os.getenv('CELERY_BROKER_URL'),
        'result_backend': os.getenv('CELERY_RESULT_BACKEND'),
        'task_ignore_result': True,
    }
    celery = Celery(app.import_name, broker=app.config['CELERY']['broker_url'])
    celery.conf.update(app.config['CELERY'])

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
            
    celery.Task = ContextTask
    app.extensions['celery'] = celery
    
    db.init_app(app)

    from app.views import manga_view
    from app.views import chapters_view

    app.register_blueprint(manga_view.manga_blueprint, url_prefix='/api/manga')
    app.register_blueprint(chapters_view.chapters_blueprint, url_prefix='/api/chapters')

    return app