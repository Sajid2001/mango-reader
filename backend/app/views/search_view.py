from flask import Blueprint, jsonify, request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

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
    base_url = 'https://manga4life.com/search/?sort=s&desc=false&name='

    try:
        driver.get(base_url + search_query)
        wait = WebDriverWait(driver, 20)
        wait.until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, '.row')))

        # Get the page source and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        search_result_block = soup.select_one('.col-md-8.order-md-1.order-12')
        search_result_rows = search_result_block.select('.row')

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
