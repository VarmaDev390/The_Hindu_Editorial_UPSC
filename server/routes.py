from flask import Blueprint, jsonify
from utils import fetch_articles, extract_difficult_vocabulary 
import requests
from database import insert_article

# Define a Blueprint for routes
routes = Blueprint("routes", __name__)

@routes.route("/fetch-articles", methods=["GET"])
def get_articles():
    #  limit = request.args.get("limit", type=int)
    articles = fetch_articles(limit=1)
    for article in articles:
        article['vocabulary'] = extract_difficult_vocabulary(article['full_content']) 
        insert_article(article)
    return jsonify(articles)