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
from bson import ObjectId
from datetime import datetime,timedelta
from dateutil import tz


def insert_article(article_data):
    try:
        result = articles_collection.insert_one(article_data)
        print("Article inserted successfully.")

        # Convert ObjectId to a string and add it back to the document if needed
        article_data['_id'] = str(result.inserted_id)
    except Exception as e:
        print(f"Error inserting article: {e}")

def get_all_articles():
    try:
        articles = list(articles_collection.find({}, {"_id": 0}))
        # {} = filter options for find, {"_id": 0} = wont inlcude _id field in the article data
        print(f"Fetched {len(articles)} articles.")
        return articles
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []

def get_all_articles_by_date(date_in_ist):
    #moved import inside as database and utils are causing cirucular imports
    from utils import convert_ist_to_utc
    try:
        # Convert the start and end of the provided date from IST to UTC
        # start_date_IST = This creates a datetime object representing the start of the day in IST. 
        # date_in_ist = 11/16/2024 16:30 -- start_date_IST = 16/11/2024 00:00 (midnight)
        start_date_IST = datetime.combine(date_in_ist, datetime.min.time())
        # start_date_IST is converted to UTC
        # start_date_UTC = 15/11/2024 18:30
        # format 2024-11-15 18:30:00+00:00
        start_date_UTC = convert_ist_to_utc(start_date_IST)
        # end_date_UTC = 16/11/2024 18:30
        end_date_UTC = start_date_UTC + timedelta(days=1)


        # Query articles in the UTC range for the specified date
        articles = list(articles_collection.find({
            "published_date": {"$gte": start_date_UTC, "$lt": end_date_UTC}
        }, {"_id": 0}))

        print(f"Fetched {len(articles)} articles for date {date_in_ist}")
        return articles
    except Exception as e:
        print(f"Error fetching articles by date: {e}")
        return []

def get_common_words():
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

def delete_all_articles():
    try:
        result = articles_collection.delete_many({})
        print(f"Deleted {result.deleted_count} articles from the collection.")
    except Exception as e:
        print(f"Error deleting articles: {e}")