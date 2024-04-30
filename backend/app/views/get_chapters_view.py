from flask import Blueprint, jsonify
import psycopg2
import os

chapters_blueprint = Blueprint('chapters', __name__)

# Route to get chapters for a manga
@chapters_blueprint.route('/chapters/<int:manga_id>', methods=['GET'])
def get_all_chapters_by_manga_id(manga_id):
    chapters = get_all_chapters_from_db(manga_id)
    if chapters:
        return jsonify(chapters)
    else:
        return jsonify({"error": "Chapters not found for the manga ID"}), 404

# Function to retrieve all chapters for a manga from the database
def get_all_chapters_from_db(manga_id):
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
        cur.execute("SELECT * FROM chapter WHERE manga_id = %s", (manga_id,))
        chapter = cur.fetchall()
        return chapter
    
    except psycopg2.Error as e:
        print("Error fetching chapters:", e)

    finally:
        if conn:
            conn.close()
