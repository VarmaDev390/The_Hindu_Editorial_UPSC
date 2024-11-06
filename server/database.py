from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

MONGO_URL = os.getenv("MONGODB_URI")
print("MONGO_URL",MONGO_URL)

# Initialize MongoDB client
client = MongoClient(MONGO_URL)
# Create a database
db = client["article_summaries_db"]
# Create a collection
articles_collection = db["articles"]

def initialize_db():
    if "articles" not in db.list_collection_names():
        db.create_collection("articles")
    print("MongoDB connection initialized")

def insert_article(article_data):
    articles_collection.insert_one(article_data)

def fetch_all_articles():
    return list(articles_collection.find({}, {"_id": 0}))
