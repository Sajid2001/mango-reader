import scrapy
import re
import requests
import math
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options as ChromeOptions
from scrapy.selector import Selector

class AngularSpider(scrapy.Spider):
    name = 'angular_spider'
    start_urls = [
        'https://weebcentral.com/search?sort=Popularity&order=Descending&official=Any&anime=Any&adult=Any&included_type=Manga&display_mode=Full+Display',
    ]

    # Initialize the webdriver
    def __init__(self):
        chrome_options = ChromeOptions()
        chrome_options.add_argument("--private")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--remote-debugging-port=9222")

        self.driver = webdriver.Chrome(options=chrome_options)

    # Parse through each Start URLs
    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, callback=self.parse_initial_page)

    # Parse function: Scrape the initial page to get links
    def parse_initial_page(self, response):
        self.driver.get(response.url)
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".bg-base-300.flex.gap-4.p-4")))
        links = self.driver.find_elements(By.CSS_SELECTOR, ".bg-base-300.flex.gap-4.p-4")
        for link in links[:1]:  # Limit to the set number of links
            href = link.find_element(By.CSS_SELECTOR, "a[href]").get_attribute("href")
            yield scrapy.Request(url=href, callback=self.parse_detail_page)

    # Parse function: Scrape the detail page and store data
    def parse_detail_page(self, response):
        name = response.css('.hidden.md\\:block.text-2xl.font-bold::text').get().replace('’', '\'')
        alternate_names = ', '.join(alternate_name.strip() for alternate_name in response.css('ul.list-disc.list-inside li::text').getall() if alternate_name.strip()) 
        if not alternate_names:
            alternate_names = None
        authors = response.css('li strong:contains("Author(s):") ~ span a::text').getall()
        genres = response.css('li strong:contains("Tags(s):") ~ span a::text').getall()
        description = response.css('li strong:contains("Description") + p::text').get()
        if description:
            description = description.replace('\n', ' ')
            description = ' '.join(description.split())
            description = description.replace('’', '\'')
            description = description.replace('—', '-')
            description = description.replace('â€¦', '.')
        status = response.css('li strong:contains("Status:") ~ a::text').get()
        # Extracting total chapters from RSS feed if available
        rss_link = response.css('li strong:contains("RSS") ~ a::attr(href)').get().replace("rss", "full-chapter-list")
        if rss_link:
            self.driver.get(rss_link)
            rss_content = self.driver.page_source
            rss_selector = Selector(text=rss_content)
            # Count the number of <a> elements with href starting with https:
            total_chapters = len(rss_selector.css('a[href^="https:"]::attr(href)').getall())
            self.parse_chapter_links(rss_link)
        else:
            total_chapters = None
        banner_image = self.get_banner(name)
        cover_image = self.get_cover(name)

        # Writing data to txt
        filename = "manga_data.txt"
        with open(filename, 'a+', encoding='utf-8') as f:
            f.write(f'Title: {name}\n')
            f.write(f'Banner Image: {banner_image}\n')
            f.write(f'Cover Image: {cover_image}\n')
            f.write(f'Alternate Names: {alternate_names}\n')
            f.write(f'Author(s): {", ".join(authors)}\n')
            f.write(f'Genre: {", ".join(genres)}\n')
            f.write(f'Description: {description}\n')
            f.write(f'Status: {status}\n')
            if total_chapters:
                f.write(f'Total Chapters: {total_chapters}\n')
            else:
                f.write('Total Chapters: Not available\n')
            if rss_link:
                f.write(f'RSS Link: {rss_link}\n')
            f.write('\n')
        self.log(f'Saved data for "{name}" to {filename}')


    # Parses chapter links from the RSS feed and stores them in a separate txt file
    def parse_chapter_links(self, rss_link):
        self.driver.get(rss_link)
        rss_content = self.driver.page_source
        soup = BeautifulSoup(rss_content, 'html.parser')
        chapter_links = soup.find_all('a', class_='hover:bg-base-300 flex-1 flex items-center p-2')
        chapter_filename = None
        if chapter_links:
            chapter_filename = "chapter_links.txt"
            with open(chapter_filename, 'a+', encoding='utf-8') as f:
                for link in chapter_links:
                    href = link.get('href')
                    if href and "chapters" in href:
                        f.write(href + '\n')
                    title = link.select_one('span.grow > span')
                    if not title:
                        continue
                    title = title.get_text().replace('’', '\'')
                    if title:
                        f.write(title + '\n')
                # for item in chapter_links:
                #     link = item.find('link').text.strip()
                #     if "https://manga4life.com/read-online/" in link:
                #         f.write(link + '\n')
        else:
            print("No chapter links found.")
        self.log(f'Saved chapter links to {chapter_filename}')

    # Retrieves the banner image of a manga given its title
    def get_banner(self, manga_title):
        search_url = f"https://kitsu.io/api/edge/manga?filter[text]={manga_title}"
        response = requests.get(search_url)
        if response.status_code == 200:
            data = response.json()
            if data['data']:
                # Get the first result
                manga = data['data'][0]
                attributes = manga.get('attributes', {})
                banner_image = attributes.get('coverImage', {}).get('original')
                if banner_image:
                    return banner_image
                else:
                    return "Banner image not found"
            else:
                return "Manga not found"
        else:
            return "Failed to retrieve manga information"
        
    # Retrieves the cover image of a manga given its title
    def get_cover(self, manga_title):
        search_url = f"https://kitsu.io/api/edge/manga?filter[text]={manga_title}"
        response = requests.get(search_url)
        if response.status_code == 200:
            data = response.json()
            if data['data']:
                # Get the first result
                manga = data['data'][0]
                attributes = manga.get('attributes', {})
                cover_image = attributes.get('posterImage', {}).get('original')
                if cover_image:
                    return cover_image
                else:
                    return "Cover image not found"
            else:
                return "Manga not found"
        else:
            return "Failed to retrieve manga information"