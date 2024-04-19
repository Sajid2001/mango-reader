import scrapy
import csv
import re
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from scrapy.selector import Selector

class AngularSpider(scrapy.Spider):
    name = 'angular_spider'
    start_urls = [
        'https://manga4life.com/search/?sort=v&desc=true&type=Manga',
    ]

    # Initialize the webdriver
    def __init__(self):
        self.driver = webdriver.Firefox()
        self.banner_image = None

    # Parse through each Start URLs
    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse_initial_page)

    # Parse function: Scrape the initial page to get links
    def parse_initial_page(self, response):
        self.driver.get(response.url)
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.SeriesName.ng-binding')))
        links = self.driver.find_elements(By.CSS_SELECTOR, ".SeriesName.ng-binding")
        for link in links[:5]:  # Limit to the first set number of links
            href = link.get_attribute("href")
            yield scrapy.Request(url=href, callback=self.parse_detail_page)

    # Parse function: Scrape the detail page and store data
    def parse_detail_page(self, response):
        # Extracting data from the page
        name = response.css('h1::text').get()
        # Not sure why this won't work using CSS Selector
        alternate_names = response.xpath('//span[@class="mlabel" and contains(text(), "Alternate Name(s):")]/following-sibling::text()').get().strip()
        authors = response.css('span.mlabel:contains("Author(s):") ~ a::text').getall()
        genres = response.css('span.mlabel:contains("Genre(s):") ~ a::text').getall()
        description = response.css('div.top-5.Content::text').get()
        status = response.css('span.mlabel:contains("Status:") ~ a::text').getall()
        # Extracting total chapters from RSS feed if available
        rss_link = response.css('a[href^="/rss/"]::attr(href)').get()
        if rss_link:
            rss_url = response.urljoin(rss_link)
            self.driver.get(rss_url)
            rss_content = self.driver.page_source
            rss_selector = Selector(text=rss_content)
            total_chapters = rss_selector.xpath('//item[3]/title/text()').get()
            # Use regex to extract only the number
            total_chapters = re.search(r'\d+(\.\d+)?', total_chapters).group()
        else:
            total_chapters = None
        self.banner_image = self.get_banner(name)

        # Writing data to txt
        filename = "manga_data.txt"
        with open(filename, 'a+', encoding='utf-8') as f:
            f.write(f'Title: {name}\n')
            f.write(f'Banner Image: {self.banner_image}\n')
            f.write(f'Alternate Names: {alternate_names}\n')
            f.write(f'Author(s): {", ".join(authors)}\n')
            f.write(f'Genre: {", ".join(genres)}\n')
            f.write(f'Description: {description}\n')
            f.write(f'Status: {", ".join(status)}\n')
            if total_chapters:
                f.write(f'Total Chapters: {total_chapters}\n\n')
            else:
                f.write('Total Chapters: Not available\n\n')
        self.log(f'Saved data for "{name}" to {filename}')

        # # Writing data to CSV
        # filename = "manga_data.csv"
        # with open(filename, 'a+', newline='', encoding='utf-8') as f:
        #     writer = csv.writer(f)
        #     writer.writerow([name, genres_str, description, status_str])
        
        # self.log(f'Saved data for "{name}" to {filename}')


    # Retrieves the banner image of a manga given its title
    def get_banner(self, manga_title):
        search_url = f"https://kitsu.io/api/edge/manga?filter[text={manga_title}]"

        response = requests.get(search_url)
        if response.status_code == 200:
            data = response.json()
            if data['data']:
                # Get the first result
                manga = data['data'][0]
                attributes = manga.get('attributes', {})
                banner_image = attributes.get('posterImage', {}).get('original')
                if banner_image:
                    return banner_image
                else:
                    return "Banner image not found"
            else:
                return "Manga not found"
        else:
            return "Failed to retrieve manga information"
