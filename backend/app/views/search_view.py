from flask import Blueprint, jsonify, request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from ..models.manga import Manga
from scripts.angular_spider import AngularSpider
from sqlalchemy import or_, and_
import re
import requests
import os

search_blueprint = Blueprint('search', __name__)

@search_blueprint.route('/', methods=['GET'])
def search_series_by_name():
    search_query = request.args.get('name', type=str)
    if not search_query:
        return jsonify({"error": "Missing 'name' parameter"}), 400

    # Initialize Chrome WebDriver
    chrome_options = ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # Make sure the path to chromedriver is correct
    driver = webdriver.Chrome(options=chrome_options)
    base_url = 'https://weebcentral.com/search?text='

    try:
        driver.get(base_url + search_query)
        wait = WebDriverWait(driver, 20)
        wait.until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, '.row')))

        # Get the page source and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        search_result_block = soup.select_one('.bg-base-200.max-w-7xl.w-full flex-1.p-6') 
        search_result_rows = search_result_block.select('.bg-base-300.flex.gap-4.p-4')

        series_data = []
        for series in search_result_rows[:3]:
            link = series.select_one(".SeriesName.ng-binding")['href']
            series_name = series.select_one('.SeriesName.ng-binding').text
            cover_image = series.select_one('.img-fluid')['src']
            series_info = {
                "link": "https://manga4life.com" + link,
                "name": series_name,
                "cover_image": cover_image
            }
            series_data.append(series_info)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        driver.quit()  # Ensure the WebDriver is closed
    
    return jsonify(series_data)

@search_blueprint.route('/result', methods=['POST'])
def search_result():
    data = request.get_json()
    search_query = data.get('name')
    link = data.get('link')
    if not search_query:
        return jsonify({"error": "Missing 'name' parameter"}), 400
    if not link:
        return jsonify({"error": "Missing 'link' parameter"}), 400

    # Check the database first
    manga = Manga.query.filter(
        or_(
            and_(Manga.title.ilike(f'%{search_query}%'), Manga.alternate_names.isnot(None)),
            and_(Manga.alternate_names.ilike(f'%{search_query}%'), Manga.alternate_names.isnot(None), Manga.alternate_names != 'None')
        )
    ).first()
    if manga:
        manga_data = manga.to_dict()
        return jsonify(manga_data), 200

    chrome_options = ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    try:
        driver.get(link)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        name = search_query.replace('’', '\'') if search_query else None
        alternate_names_elem = soup.select_one('span.mlabel:-soup-contains("Alternate Name(s):")')
        alternate_names = alternate_names_elem.find_next_sibling(text=True).strip() if alternate_names_elem else None
        authors = [a.get_text(strip=True) for a in soup.select('span.mlabel:-soup-contains("Author(s):") ~ a')]
        genres = [a.get_text(strip=True) for a in soup.select('span.mlabel:-soup-contains("Genre(s):") ~ a')]
        description_elem = soup.select_one('div.top-5.Content')
        description = description_elem.get_text(separator=' ', strip=True) if description_elem else None
        if description:
            description = re.sub(r'\s+', ' ', description).replace('’', '\'').replace('—', '-').replace('â€¦', '.')
        status_elements = [a.get_text(strip=True) for a in soup.select('span.mlabel:-soup-contains("Status:") ~ a')]
        scan_status = next((status.replace(' (Scan)', '').strip() for status in status_elements if 'Scan' in status), None)
        publish_status = next((status.replace(' (Publish)', '').strip() for status in status_elements if 'Publish' in status), None)
        # Extract RSS feed and count chapters if available
        rss_link_elem = soup.select_one('a[href^="/rss/"]')
        if rss_link_elem:
            rss_url = 'https://manga4life.com' + str(rss_link_elem['href'])
            driver.get(rss_url)
            rss_soup = BeautifulSoup(driver.page_source, 'xml')
            chapter_links = rss_soup.find_all('item')
            total_chapters = len(chapter_links) if chapter_links else None
        else:
            total_chapters = None
        banner_image = get_banner(name)
        cover_image = get_cover(name)
        
        series_data = {
            'name': name,
            'alternate_names': alternate_names,
            'authors': authors,
            'genres': genres,
            'description': description,
            'scan_status': scan_status,
            'publish_status': publish_status,
            'total_chapters': total_chapters,
            'banner_image': banner_image,
            'cover_image': cover_image
        }
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        relative_path = os.path.join(script_dir, '../../scripts/manga_data.txt')
        filename = os.path.abspath(relative_path)
        with open(filename, 'a+', encoding='utf-8') as f:
            f.write(f'Title: {name}\n')
            f.write(f'Banner Image: {banner_image}\n')
            f.write(f'Cover Image: {cover_image}\n')
            f.write(f'Alternate Names: {alternate_names}\n')
            f.write(f'Author(s): {", ".join(authors)}\n')
            f.write(f'Genre: {", ".join(genres)}\n')
            f.write(f'Description: {description}\n')
            f.write(f'Scan Status: {scan_status}\n')
            f.write(f'Publish Status: {publish_status}\n')
            if total_chapters:
                f.write(f'Total Chapters: {total_chapters}\n')
            else:
                f.write('Total Chapters: Not available\n')
            if rss_url:
                f.write(f'RSS Link: {rss_url}\n\n')
        print(f'Saved data for "{name}" to {filename}')

        # # Execute the insert.py script
        # current_dir = os.path.dirname(__file__)
        # script_path = os.path.join(current_dir, '..', '..', 'scripts', 'insert.py')
        # print(f"Resolved path: {os.path.abspath(script_path)}")
        # with open(script_path, encoding='utf-8') as f:
        #     code = f.read()
        #     exec(code, globals())

        return jsonify(series_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        driver.quit()

# Retrieves the banner image of a manga given its title
def get_banner(manga_title):
    search_url = f"https://kitsu.io/api/edge/manga?filter[text]={manga_title}"
    response = requests.get(search_url)
    if response.status_code == 200:
        data = response.json()
        if data['data']:
            manga = data['data'][0]
            attributes = manga.get('attributes', {})
            banner_image = attributes.get('coverImage', {})
            if banner_image is not None:
                banner_image = banner_image.get('original')
                return banner_image
            else:
                return "Banner image not found"
        else:
            return "Manga not found"
    else:
        return "Failed to retrieve manga information"
        
def get_cover(manga_title):
    search_url = f"https://kitsu.io/api/edge/manga?filter[text]={manga_title}"
    response = requests.get(search_url)
    if response.status_code == 200:
        data = response.json()
        if data['data']:
            manga = data['data'][0]
            attributes = manga.get('attributes', {})
            cover_image = attributes.get('posterImage', {})
            if cover_image is not None:
                cover_image = cover_image.get('original')
                return cover_image
            else:
                return "Cover image not found"
        else:
            return "Manga not found"
    else:
        return "Failed to retrieve manga information"