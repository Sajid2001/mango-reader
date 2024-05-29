import psycopg2
import os
import re
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from bs4 import BeautifulSoup

load_dotenv()

firefox_options = FirefoxOptions()
firefox_options.add_argument("--private")
firefox_options.add_argument("--headless")
# firefox_options.add_argument("--disable-cache")
driver = webdriver.Firefox(options=firefox_options)

def process_manga_data(cursor, manga_data):
    try:
        cursor.execute("""
            INSERT INTO manga (title, alternate_names, authors, genres, description, status, total_chapters, banner_image, cover_image)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            manga_data.get("Title", None),
            manga_data.get("Alternate Names", None),
            manga_data.get("Author(s)", None),
            manga_data.get("Genre", None),
            manga_data.get("Description", None),
            manga_data.get("Status", None),
            manga_data.get("Total Chapters", None),
            manga_data.get("Banner Image", None),
            manga_data.get("Cover Image", None)
        ))

        # Get the last inserted manga_id
        cursor.execute("SELECT LASTVAL()")
        manga_id = cursor.fetchone()[0]

        if 'RSS Link' in manga_data:
            # print(manga_data['RSS Link'])
            parse_chapter_links(cursor=cursor, 
                                manga_id=manga_id,
                                rss_link=manga_data['RSS Link'], 
                                driver=driver)

        print(f"Processed manga '{manga_data.get('Title')}'")
    
    except Exception as e:
        print("Manga Table error occurred:", e)


def parse_chapter_links(cursor, manga_id, rss_link, driver):
    try:
        driver.get(rss_link)
        rss_content = driver.page_source
        soup = BeautifulSoup(rss_content, 'xml')
        chapter_links = soup.find_all('item')
        if chapter_links:
            chapter_number = 1  # Initialize the chapter number counter
            for item in reversed(chapter_links):  # Iterate over chapter_links in reverse order
                title = item.find('title').text.strip()
                link = item.find('link').text.strip().replace("-page-1.html", "")
                if "https://manga4life.com/read-online/" in link:
                    cursor.execute("""
                        INSERT INTO chapter (manga_id, link, chapter_name, chapter_number)
                        VALUES (%s, %s, %s, %s) RETURNING id
                    """, (manga_id, link, title, chapter_number))
                    chapter_id = cursor.fetchone()[0]
                    print(f"Link: {link}, Title: {title}")
                    # Increment the chapter number counter
                    chapter_number += 1
            print("Chapter links inserted.")
        else:
            print("No chapter links found in the RSS feed.")

    except Exception as e:
        print("Chapter error occurred:", e)

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
cur = conn.cursor()

try:
    with open('manga_data.txt', 'r') as file:
        manga_data = {}
        for line in file:
            line = line.strip()  # Remove leading/trailing whitespaces
            if line:  # Line not blank
                key, value = line.split(': ', 1)  # Split the line into key and value
                manga_data[key] = value
            else:  # If encountering a blank line, process the manga_data
                if manga_data:  # Check if manga_data is not empty
                    # print(manga_data)
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



