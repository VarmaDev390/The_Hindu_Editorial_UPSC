# from pymongo import MongoClient
# from dotenv import load_dotenv
# import os

# # Load environment variables from .env file
# load_dotenv()

# MONGO_URL = os.getenv("MONGODB_URI")
# print("MONGO_URL",MONGO_URL)

# # Initialize MongoDB client
# client = MongoClient(MONGO_URL)
# Create a database
# db = client["article_summaries_db"]
# # Create a collection
# articles_collection = db["articles"]

# def initialize_db():
#     if "articles" not in db.list_collection_names():
#         db.create_collection("articles")
#     print("MongoDB connection initialized")

from init_db import db, articles_collection, common_words_collection

def insert_article(article_data):
    try:
        articles_collection.insert_one(article_data)
        print("Article inserted successfully.")
    except Exception as e:
        print(f"Error inserting article: {e}")

def fetch_all_articles():
    try:
        articles = list(articles_collection.find({}, {"_id": 0}))
        # {} = filter options for find, {"_id": 0} = wont inlcude _id field in the article data
        print(f"Fetched {len(articles)} articles.")
        return articles
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []

def fetch_common_words():
    try:
        common_words_entry = common_words_collection.find_one({}, {"_id": 0, "words": 1})
        # "words": 1 = wont inlcude _id field in the data and include only words data
        if common_words_entry and "words" in common_words_entry:
            return common_words_entry["words"]
        else:
            print("No common words found in the collection.")
            return []
    except Exception as e:
        print(f"Error fetching common words: {e}")
        return []
    
def add_common_word(new_word):
    try:
        common_words_collection.update_one({}, {"$addToSet": {"words": {"$each": new_word}}}, upsert=True)
        print("Common words updated successfully.")
    except Exception as e:
        print(f"Error updating common words: {e}")