from flask import Blueprint,request,jsonify
from utils import extract_difficult_vocabulary, convert_utc_to_ist, process_new_articles, fetch_articles_metadata, fetch_meaning_merriam_webster, fetch_meaning_Oxford
import requests
from database import insert_article, get_all_articles_by_date, add_common_word, get_article_by_id, del_vocab_from_article, add_imp_word, mark_article, get_saved_words, add_user, get_users, initiate_user_common_word, delete_user
from datetime import datetime
from init_db import db, articles_collection


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

@routes.route("/add-user", methods=["POST"])
def add_user_route():
    print("Route Logger: Inside add-user route")

    try:
        data = request.get_json()
        userId = data.get('userId')
        password = data.get('password')

        user_data = add_user(userId,password)

        initiate_user_common_word(userId)

        print("userData", user_data)

        return jsonify({"data": user_data}), 200
    except Exception as e:
        print(f"Error adding user: {e}")
        return jsonify({"error": "An error occurred while adding user."}), 500

@routes.route("/delete-user", methods=["POST"])
def delete_user_route():
    print("Route Logger: Inside delete-user route")

    try:
        data = request.get_json()
        userId = data.get('userId')
        

        user_data = delete_user(userId)

        return jsonify({"messsage": "success"}), 200
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({"error": "An error occurred while deelting user."}), 500

@routes.route("/get-articles", methods=["GET"])
def get_articles_by_date():
    print("Route Logger: Inside get-articles route")
    user_date_str_IST = request.args.get("date")
    userId = request.args.get("userId")
    
    if not user_date_str_IST:
        return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

    try:
        # Parse user date to datetime
        user_datetime_IST = datetime.strptime(user_date_str_IST, "%Y-%m-%d")
        # print("user_date", user_datetime_IST)

        # Fetch existing articles from DB
        db_articles = get_all_articles_by_date(user_datetime_IST, userId)
        
        # Extract titles from Db articles
        db_titles = set()
        for article in db_articles:
            db_titles.add(article["title"])
        # print("db_titles",db_titles)

        # Fetch metadata from RSS feed
        rss_metadata = fetch_articles_metadata(user_date_str_IST)
        # print("rss_metadata",rss_metadata)


        # Identify new articles from RSS metadata
        new_articles_metadata = []
        for article in rss_metadata:
            if article["title"] not in db_titles:
                new_articles_metadata.append(article)
        # print("new_articles_metadata",new_articles_metadata)

        # Process and insert new articles
        new_articles = process_new_articles(new_articles_metadata, userId)
        # new_articles = new_articles_metadata
        # print("new_articles",new_articles)

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

# @routes.route("/get-articles", methods=["GET"])
# def get_articles_by_date():
#     print("Route Logger: Inside get-articles route")
#     user_date_str_IST = request.args.get("date")
#     userId = request.args.get("userId")
#     print("date", user_date_str_IST)
#     if not user_date_str_IST:
#         return jsonify({"error": "Please provide a date in YYYY-MM-DD format."}), 400

#     try:
#         # Parse user date to datetime
#         user_datetime_IST = datetime.strptime(user_date_str_IST, "%Y-%m-%d")
        
#         # Fetch metadata from RSS feed
#         rss_metadata = fetch_articles_metadata(user_date_str_IST)

#         # Extract titles from RSS metadata
#         rss_titles = [article["title"] for article in rss_metadata]

#         # Fetch existing titles directly from the database
#         existing_titles_cursor = articles_collection.find(
#             {"title": {"$in": rss_titles}},
#             {"title": 1, "_id": 0}
#         )
#         existing_titles_set = {doc["title"] for doc in existing_titles_cursor}

#         # Identify new articles by filtering out existing titles
#         new_articles_metadata = [
#             article for article in rss_metadata if article["title"] not in existing_titles_set
#         ]

#         # Process and insert new articles
#         new_articles = process_new_articles(new_articles_metadata, userId)
#         for article in new_articles:
#             insert_article(article)

#         # Fetch all articles for the given date and user
#         db_articles = get_all_articles_by_date(user_datetime_IST, userId)
#         all_articles = db_articles

#         # Convert published_date to IST for all articles
#         for article in all_articles:
#             article["published_date"] = convert_utc_to_ist(article["published_date"])
        
#         print("allarticle",all_articles)

#         return jsonify({"articles": all_articles}), 200

#     except ValueError:
#         return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
#     except Exception as e:
#         print(f"Error fetching articles: {e}")
#         return jsonify({"error": "An error occurred while fetching articles."}), 500


@routes.route("/get-users", methods=["GET"])
def get_users_route():
    print("Logger: Inside get-users route")

    try:
        users = get_users()

        return jsonify({"users": users}), 200
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": "An error occurred while fetching users."}), 500
    
    
@routes.route("/delete-vocab", methods=["POST"])
def delete_vocabulary():
    print("Route Logger: Inside delete-vocab route")

    try:
        # Get the word from the request body (assuming JSON format)
        data = request.get_json()
        word = data.get('word')
        article_id = data.get('articleId')
        userId = data.get('userId')

        # Validate the input
        if not word or not article_id:
            return jsonify({"error": "Missing word or articleId"}), 400

        # Add the word to common words
        add_common_word(word, userId)

        # # Delete the vocab from the article
        # del_vocab_from_article(word, article_id, userId)

        # Get the updated article
        article = get_article_by_id(article_id, userId)
        # print("article after delet",article["Vocabulary"])

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
    print("Route Logger: Inside add-vocab route")
    try:
        # Get the word and meaning from the request body (assuming JSON format)
        data = request.get_json()
        word = data.get('word')
        userId = data.get('userId')
        # meaning = data.get('meaning', '')  # Default meaning to an empty string if not provided

        # get the meaning for the word
        meaning = fetch_meaning_merriam_webster(word)
        # meaning = fetch_meaning_Oxford(word)


        # print("meaning", meaning)

        # Add the word and meaning to important vocabulary
        add_imp_word(userId,word, meaning)

        return jsonify({"message": "Word and meaning added successfully"}), 200
    except Exception as e:
        print(f"Error adding vocabulary: {e}")
        return jsonify({"error": "An error occurred while adding the Vocabulary."}), 500


@routes.route("/saved-vocab", methods=["POST"])
def get_vocabulary():
    print("Route Logger: Inside saved-vocab route")
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