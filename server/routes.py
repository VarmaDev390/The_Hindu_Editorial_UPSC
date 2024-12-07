from flask import Blueprint,request,jsonify
from utils import extract_difficult_vocabulary, convert_utc_to_ist, process_new_articles, fetch_articles_metadata, fetch_meaning
import requests
from database import insert_article, get_all_articles_by_date, add_common_word, get_article_by_id, del_vocab_from_article, add_imp_word, mark_article, get_saved_words
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

# @routes.route("/get-articles", methods=["GET"])
# def get_articles_by_date():
#     # Get the date from query parameters
#     user_date_str_IST = request.args.get("date") # 2024-11-18
    
#     if not user_date_str_IST:
#         return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

#     try:
#         # Parse the date provided by the user (in YYYY-MM-DD hh:mm:ss format)
#         user_datetime_IST = datetime.strptime(user_date_str_IST, "%Y-%m-%d") # 2024-11-18 00:00:00
#         print("user_date", user_datetime_IST)


#         # Fetch articles from the database for the given date
#         db_articles = get_all_articles_by_date(user_datetime_IST)
#         # print("db_articles (UTC)", db_articles)


#         # Fetch articles from the RSS feed for the same date
#         rss_feed_articles = fetch_articles(user_date_str_IST)
#         # print("rss_feed_articles (UTC)", rss_feed_articles)


#         # Compare and add only new articles from the RSS feed to the database
#         new_articles = []
#         for article in rss_feed_articles:
#             # Check if article is already in the DB (e.g., by title or link)
#             if not any(db_article['title'] == article['title'] for db_article in db_articles):
#                 insert_article(article)  # Save to DB
#                 new_articles.append(article)

#         # Combine DB articles and newly added articles
#         all_articles = db_articles + new_articles

#         # Convert published_date to IST for all articles
#         for article in all_articles:
#             article['published_date'] = convert_utc_to_ist(article['published_date'])
#             print("Article published_date (IST)", article['published_date'])

#         # print("all_articles (IST)", all_articles)

#         return jsonify({"articles": all_articles}), 200

#     except ValueError:
#         return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
#     except Exception as e:
#         print(f"Error fetching articles: {e}")
#         return jsonify({"error": "An error occurred while fetching articles."}), 500

@routes.route("/get-articles", methods=["GET"])
def get_articles_by_date():
    user_date_str_IST = request.args.get("date")
    
    if not user_date_str_IST:
        return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

    try:
        # Parse user date to datetime
        user_datetime_IST = datetime.strptime(user_date_str_IST, "%Y-%m-%d")
        # print("user_date", user_datetime_IST)

        # Fetch existing articles from DB
        db_articles = get_all_articles_by_date(user_datetime_IST)
        # create a set conataing article titles
        db_titles = set()
        for article in db_articles:
            db_titles.add(article["title"])
        print("db_titles",db_titles)

        # Fetch metadata from RSS feed
        rss_metadata = fetch_articles_metadata(user_date_str_IST)
        print("rss_metadata",rss_metadata)


        # Identify new articles from RSS metadata
        new_articles_metadata = []
        for article in rss_metadata:
            if article["title"] not in db_titles:
                new_articles_metadata.append(article)
        print("new_articles_metadata",new_articles_metadata)

        # Process and insert new articles
        new_articles = process_new_articles(new_articles_metadata)
        # new_articles = new_articles_metadata
        print("new_articles",new_articles)

        for article in new_articles:
            insert_article(article)

        # Combine DB articles and newly added articles
        all_articles = db_articles + new_articles

        # Convert published_date to IST for all articles
        for article in all_articles:
            article["published_date"] = convert_utc_to_ist(article["published_date"])
            # print("Article published_date (IST)", article["published_date"])

        return jsonify({"articles": all_articles}), 200

    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return jsonify({"error": "An error occurred while fetching articles."}), 500


@routes.route("/delete-vocab", methods=["POST"])
def delete_vocabulary():
    try:
        # Get the word from the request body (assuming JSON format)
        data = request.get_json()
        word = data.get('word')
        article_id = data.get('articleId')

        # Validate the input
        if not word or not article_id:
            return jsonify({"error": "Missing word or articleId"}), 400

        # Add the word to common words
        add_common_word(word)

        # Delete the vocab from the article
        del_vocab_from_article(word, article_id)

        # Get the updated article
        article = get_article_by_id(article_id)

        # Convert ObjectId to string before serializing
        article['_id'] = str(article['_id'])

        return jsonify({"article": article}), 200
    except Exception as e:
        print(f"Error deleting vocabulary: {e}")
        return jsonify({"error": "An error occurred while deleting Vocabulary."}), 500

@routes.route("/read_article", methods=["POST"])
def read_article():
    try:
        # Get the articleId from the request body (assuming JSON format)
        data = request.get_json()
        article_id = data.get('articleId')

        # Get the updated article
        article = mark_article(article_id)

        # Convert ObjectId to string before serializing
        article['_id'] = str(article['_id'])

        return jsonify({"article": article}), 200
    except Exception as e:
        print(f"Error updating article: {e}")
        return jsonify({"error": "An error occurred while updating article."}), 500


@routes.route("/add-vocab", methods=["POST"])
def add_vocabulary():
    try:
        # Get the word and meaning from the request body (assuming JSON format)
        data = request.get_json()
        word = data.get('word')
        # meaning = data.get('meaning', '')  # Default meaning to an empty string if not provided

        # get the meaning for the word
        meaning = fetch_meaning(word)
        # print("meaning", meaning)

        # Add the word and meaning to important vocabulary
        add_imp_word("ravi",word, meaning)

        return jsonify({"message": "Word and meaning added successfully"}), 200
    except Exception as e:
        print(f"Error adding vocabulary: {e}")
        return jsonify({"error": "An error occurred while adding the Vocabulary."}), 500


@routes.route("/saved-vocab", methods=["POST"])
def get_vocabulary():
    try:
        # Get the word and meaning from the request body (assuming JSON format)
        data = request.get_json()
        userId = data.get('userId')
        print("useriID",userId)

        # Add the word and meaning to important vocabulary
        words = get_saved_words(userId)

        return jsonify({"words": words}), 200
    except Exception as e:
        print(f"Error getting vocabulary: {e}")
        return jsonify({"error": "An error occurred while getting the Vocabulary."}), 500

@routes.route("/test", methods=["GET"])
def test():
    return "good"