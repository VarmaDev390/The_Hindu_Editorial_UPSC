from flask import Blueprint,request,jsonify
from utils import fetch_articles, extract_difficult_vocabulary, convert_utc_to_ist
import requests
from database import insert_article, get_all_articles_by_date
from datetime import datetime


# Define a Blueprint for routes
routes = Blueprint("routes", __name__)

# @routes.route("/fetch-articles", methods=["GET"])
# def get_articles():
#     #  limit = request.args.get("limit", type=int)
#     date_str = request.args.get("date")
#     articles = fetch_articles(date_str,limit=1 )
#     for article in articles:
#         # article['vocabulary'] = extract_difficult_vocabulary(article['full_content']) 
#         insert_article(article)  
#     return jsonify(articles)
#     # return "good"

# @routes.route("/get-articles", methods=["GET"])
# def get_articles_by_date():
#     # Get the date from query parameters
#     date_str = request.args.get("date")
#     print("date",date_str)
    
#     if not date_str:
#         return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

#     try:
#         # Parse the date provided by the user (in YYYY-MM-DD format)
#         user_date = datetime.strptime(date_str, "%Y-%m-%d")

      
#         # Fetch articles by the specified date
#         articles = get_all_articles_by_date(user_date)
#         # if no articles are found in the DB
#         if (len(articles) == 0):
            
#             # fetch articles from rss feed
#             articles = fetch_articles(date_str,limit=1 )
#             for article in articles:
#                 # save each article to DB
#                 insert_article(article) 

#         return jsonify({"articles": articles}), 200
#         # return "good"

#     except ValueError:
#         return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
#     except Exception as e:
#         print(f"Error fetching articles: {e}")
#         return jsonify({"error": "An error occurred while fetching articles."}), 500

@routes.route("/get-articles", methods=["GET"])
def get_articles_by_date():
    # Get the date from query parameters
    user_date_str_IST = request.args.get("date") # 2024-11-18
    
    if not user_date_str_IST:
        return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

    try:
        # Parse the date provided by the user (in YYYY-MM-DD hh:mm:ss format)
        user_datetime_IST = datetime.strptime(user_date_str_IST, "%Y-%m-%d") # 2024-11-18 00:00:00
        print("user_date", user_datetime_IST)


        # Fetch articles from the database for the given date
        db_articles = get_all_articles_by_date(user_datetime_IST)
        print("db_articles (UTC)", db_articles)


        # Fetch articles from the RSS feed for the same date
        rss_feed_articles = fetch_articles(user_date_str_IST)
        print("rss_feed_articles (UTC)", rss_feed_articles)


        # Compare and add only new articles from the RSS feed to the database
        new_articles = []
        for article in rss_feed_articles:
            # Check if article is already in the DB (e.g., by title or link)
            if not any(db_article['title'] == article['title'] for db_article in db_articles):
                insert_article(article)  # Save to DB
                new_articles.append(article)

        # Combine DB articles and newly added articles
        all_articles = db_articles + new_articles

        # Convert published_date to IST for all articles
        for article in all_articles:
            article['published_date'] = convert_utc_to_ist(article['published_date'])
            print("Article published_date (IST)", article['published_date'])

        print("all_articles (IST)", all_articles)

        return jsonify({"articles": all_articles}), 200

    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return jsonify({"error": "An error occurred while fetching articles."}), 500


@routes.route("/test", methods=["GET"])
def test():
    return "good"