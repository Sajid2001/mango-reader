from flask import Blueprint, jsonify, request
from scripts.search import SearchSpider
from scrapy.crawler import CrawlerProcess
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from scrapy.utils.log import configure_logging
from celery import shared_task

search_blueprint = Blueprint('search', __name__)

configure_logging()
process = CrawlerProcess(get_project_settings())

@shared_task
@search_blueprint.route('/', methods=['GET']) 
def search_series_by_name():
    search_query = request.args.get('name', type=str)
    if not search_query:
        return jsonify({"error": "Missing 'name' parameter"}), 400
    process.crawl(SearchSpider, search_query=search_query)
    process.start()
    results = SearchSpider.results
    return jsonify(results)