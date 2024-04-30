from flask import Blueprint, jsonify
import psycopg2
import os

manga_blueprint = Blueprint('manga', __name__)

# Route to get general information for a single manga
@manga_blueprint.route('/mangas/<int:id>', methods=['GET'])
def get_manga_by_id(id):
    manga = get_manga_from_db(id)
    if manga:
        return jsonify(manga)
    else:
        return jsonify({"error": "Manga not found"}), 404

# Function to fetch manga information from the database by ID
def get_manga_from_db(id):
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
        cur.execute("SELECT * FROM manga WHERE id = %s", (id,))
        manga = cur.fetchone()
        return manga
    
    except psycopg2.Error as e:
        print("Error fetching manga:", e)

    finally:
        if conn:
            conn.close()
