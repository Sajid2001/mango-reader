from flask import jsonify
import scrapy
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options as FirefoxOptions

class SearchSpider(scrapy.Spider):
    name = 'search_spider'
    
    # Initialize the webdriver
    def __init__(self, search_query=''):
        firefox_options = FirefoxOptions()
        # firefox_options.add_argument("--private")
        # firefox_options.add_argument("--headless")
        self.driver = webdriver.Firefox(options=firefox_options)
        self.base_url = 'https://manga4life.com/search/?sort=s&desc=false&name='
        self.search_query = search_query

    def start_requests(self):
        yield scrapy.Request(url=self.base_url+self.search_query, callback=self.search_series)
        
    def search_series(self, response):
        series_data = []
        self.driver.get(response.url)
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, '.row')))
        search_result_block = self.driver.find_element(By.CSS_SELECTOR, '.col-md-8.order-md-1.order-12')
        search_result_rows = search_result_block.find_elements(By.CSS_SELECTOR, '.row')
        for series in search_result_rows[:3]:
            link = series.find_element(By.CSS_SELECTOR, ".SeriesName.ng-binding").get_attribute("href")
            series_name = series.find_element(By.CSS_SELECTOR, '.SeriesName.ng-binding').text
            cover_image = self.driver.find_element(By.CSS_SELECTOR, '.img-fluid').get_attribute('src')
            series_info = {
            "link": link,
            "name": series_name,
            "cover_image": cover_image
            }
            series_data.append(series_info)
        SearchSpider.results = series_data
        return jsonify(series_data)