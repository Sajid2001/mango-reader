from flask import Blueprint, jsonify
import psycopg2
import os

mangas_blueprint = Blueprint('mangas', __name__)

@mangas_blueprint.route('/mangas', methods=['GET'])
def get_all_manga():
    manga = get_all_mangas_from_db()
    return jsonify(manga)

def get_all_mangas_from_db():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('POSTGRES_DB_NAME'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT')
        )
        cur = conn.cursor()
        cur.execute("SELECT * FROM manga")
        pages = cur.fetchall()
        return pages
    
    except psycopg2.Error as e:
        print("Error fetching manga:", e)
    finally:
        if conn:
            conn.close()