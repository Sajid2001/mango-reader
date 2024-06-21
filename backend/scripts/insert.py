import psycopg2
import os
import re
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from bs4 import BeautifulSoup

load_dotenv()

chrome_options = ChromeOptions()
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=chrome_options)

def process_manga_data(cursor, manga_data):
    try:
        # Check if manga already exists
        cursor.execute("SELECT id, total_chapters FROM manga WHERE title = %s", (manga_data.get("Title", None),))
        manga_record = cursor.fetchone()

        if manga_record:
            # Manga exists, get manga_id and current total_chapters
            manga_id, current_total_chapters = manga_record
            is_insert = False
        else:
            # Manga does not exist, set current_total_chapters to 0 and mark as insert
            current_total_chapters = 0
            is_insert = True

        cursor.execute("""
            INSERT INTO manga (title, alternate_names, authors, genres, description, scan_status, publish_status, total_chapters, banner_image, cover_image)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (title) DO UPDATE
            SET alternate_names = EXCLUDED.alternate_names,
                authors = EXCLUDED.authors,
                genres = EXCLUDED.genres,
                description = EXCLUDED.description,
                scan_status = EXCLUDED.scan_status,
                publish_status = EXCLUDED.publish_status,
                total_chapters = EXCLUDED.total_chapters,
                banner_image = EXCLUDED.banner_image,
                cover_image = EXCLUDED.cover_image
        """, (
            manga_data.get("Title", None),
            manga_data.get("Alternate Names", None),
            manga_data.get("Author(s)", None),
            manga_data.get("Genre", None),
            manga_data.get("Description", None),
            manga_data.get("Scan Status", None),
            manga_data.get("Publish Status", None),
            manga_data.get("Total Chapters", current_total_chapters),  # Use existing total_chapters for insert
            manga_data.get("Banner Image", None),
            manga_data.get("Cover Image", None)
        ))

        # Get the manga_id after insert or update
        cursor.execute("SELECT id, total_chapters FROM manga WHERE title = %s", (manga_data.get("Title", None),))
        manga_id, total_chapters = cursor.fetchone()

        if 'RSS Link' in manga_data:
            new_chapters = parse_chapter_links(cursor=cursor, 
                                               manga_id=manga_id,
                                               rss_link=manga_data['RSS Link'], 
                                               series_title=manga_data.get("Title", ""),
                                               driver=driver)
            if not is_insert and new_chapters > 0:  # Only update total_chapters if it's an update
                cursor.execute("""
                    UPDATE manga
                    SET total_chapters = total_chapters + %s
                    WHERE id = %s
                """, (new_chapters, manga_id))

        print(f"Processed manga '{manga_data.get('Title')}'")
    
    except Exception as e:
        print("Manga Table error occurred:", e)

def parse_chapter_links(cursor, manga_id, rss_link, series_title, driver):
    try:
        driver.get(rss_link)
        rss_content = driver.page_source
        soup = BeautifulSoup(rss_content, 'xml')
        chapter_links = soup.find_all('item')
        new_chapters_count = 0

        if chapter_links:
            # Fetch existing chapters from the database
            cursor.execute("SELECT id, chapter_name, chapter_number FROM chapter WHERE manga_id = %s ORDER BY chapter_number", (manga_id,))
            existing_chapters = cursor.fetchall()
            existing_chapter_dict = {row[1]: row for row in existing_chapters}

            # Reverse the chapter links to process them in the correct order
            chapter_links.reverse()

            # Parse and collect new chapters from the RSS feed
            all_chapters = []
            for item in chapter_links:
                title = item.find('title').text.strip()
                # Remove the series title from the chapter title
                title = re.sub(re.escape(series_title), '', title, flags=re.IGNORECASE).strip()

                if title in existing_chapter_dict:
                    # Use existing chapter
                    existing_chapter = existing_chapter_dict[title]
                    all_chapters.append((existing_chapter[0], existing_chapter[1], existing_chapter[2], None))
                else:
                    link = item.find('link').text.strip().replace("-page-1.html", "")
                    if "https://manga4life.com/read-online/" in link:
                        new_chapters_count += 1
                        all_chapters.append((None, title, None, link))

            # Reassign chapter numbers sequentially based on the order in all_chapters
            for index, (id, title, chapter_number, link) in enumerate(all_chapters, start=1):
                if id:  # Existing chapter
                    cursor.execute("""
                        UPDATE chapter
                        SET chapter_number = %s
                        WHERE id = %s
                    """, (index, id))
                else:  # New chapter
                    cursor.execute("""
                        INSERT INTO chapter (manga_id, link, chapter_name, chapter_number)
                        VALUES (%s, %s, %s, %s)
                    """, (manga_id, link, title, index))

            print("Chapter links inserted and updated.")
        else:
            print("No chapter links found in the RSS feed.")

        return new_chapters_count

    except Exception as e:
        print("Chapter error occurred:", e)
        return 0

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=os.getenv('POSTGRES_DB_NAME'),
    user=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD'),
    host=os.getenv('POSTGRES_HOST'),
    port=os.getenv('POSTGRES_PORT')
)
# Create a cursor object
cur = conn.cursor()

print('connected to db')

try:
    with open('scripts/manga_data.txt', 'r', encoding='utf-8') as file:  # Specify UTF-8 encoding
        manga_data = {}
        for line in file:
            line = line.strip()  # Remove leading/trailing whitespaces
            if line:  # Line not blank
                key, value = line.split(': ', 1)  # Split the line into key and value
                manga_data[key] = value
            else:  # If encountering a blank line, process the manga_data
                if manga_data:  # Check if manga_data is not empty
                    process_manga_data(cursor=cur, manga_data=manga_data)
                    manga_data = {}  # Reset manga_data
                    
        # Process the last manga entry if not already processed
        if manga_data:
            process_manga_data(cursor=cur, manga_data=manga_data)

except Exception as e:
    print("An error occurred:", e)

finally: 
    conn.commit()
    cur.close()
    conn.close()
