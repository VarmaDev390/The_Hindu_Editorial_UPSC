from flask import Blueprint,request,jsonify
from utils import fetch_articles, extract_difficult_vocabulary 
import requests
from database import insert_article, get_all_articles_by_date
from datetime import datetime


# Define a Blueprint for routes
routes = Blueprint("routes", __name__)

@routes.route("/fetch-articles", methods=["GET"])
def get_articles():
    #  limit = request.args.get("limit", type=int)
    articles = fetch_articles(limit=1)
    for article in articles:
        # article['vocabulary'] = extract_difficult_vocabulary(article['full_content']) 
        insert_article(article)  
    return jsonify(articles)
    # return "good"

@routes.route("/get-articles", methods=["GET"])
def get_articles_by_date():
    # Get the date from query parameters
    date_str = request.args.get("date")
    
    if not date_str:
        return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

    try:
        # Parse the date provided by the user (in YYYY-MM-DD format)
        user_date = datetime.strptime(date_str, "%Y-%m-%d")
        
        # Fetch articles by the specified date
        articles = get_all_articles_by_date(user_date)
        
        return jsonify({"articles": articles}), 200
        # return "good"

    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return jsonify({"error": "An error occurred while fetching articles."}), 500


@routes.route("/test", methods=["GET"])
def test():
    return "good"