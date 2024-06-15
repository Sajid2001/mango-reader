from app import create_app
import os
from dotenv import load_dotenv

load_dotenv()

app = create_app()
celery_app = app.extensions['celery']

if __name__ == '__main__':
    app.run(debug=True, port=(os.getenv('PORT') or 8080))