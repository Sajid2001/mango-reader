from flask import Blueprint, jsonify, request
import psycopg2
import os

search_manga_by_name_blueprint = Blueprint('search_mangas', __name__)

# Route to search for manga by name
@search_manga_by_name_blueprint.route('mangas/search', methods=['GET'])
def search_manga_by_name():
    name = request.args.get('name')
    manga = search_manga_from_db(name)
    if manga:
        return jsonify(manga)
    else:
        return jsonify({"error": "Manga not found"}), 404

# Function to search manga from the database by name
def search_manga_from_db(name):
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
        # Query to search for manga by fuzzy matched title or alternative names
        cur.execute("SELECT * FROM manga WHERE title ILIKE %s OR alternate_names ILIKE %s", ('%' + name + '%', '%' + name + '%'))
        manga = cur.fetchall()
        return manga
    
    except psycopg2.Error as e:
        print("Error searching manga:", e)
    finally:
        if conn:
            conn.close()
