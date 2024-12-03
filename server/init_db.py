from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
import os

# Load environment variables from .env file
load_dotenv()



# Initialize MongoDB client
MONGO_URL = os.getenv("MONGODB_URI")
print("MONGO_URL",MONGO_URL)

client = MongoClient(MONGO_URL)
db = client["article_summaries_db"]

# Collection definitions
articles_collection = db["articles"]
common_words_collection = db["common_words"]
Important_words_collection = db["imp_vocab"]



# Initial Data
initial_common_words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", 
    "you", "he", "with", "on", "do", "at", "by", "this", "but", "from", 
    "not", "or", "which", "all", "she", "an", "they", "my", "one", "if"
    # Add more common words as needed...
]

def initialize_db():
    if "articles" not in db.list_collection_names():
        db.create_collection("articles")
        print("Created collection named articles")

    # Check if collection already has common words
    if "common_words" not in db.list_collection_names():
        common_words_collection.insert_one({"words": initial_common_words})
        print("Created collection named common_words")

    # Check if imp_vocab collection exists
    if "imp_vocab" not in db.list_collection_names():
        db.create_collection("imp_vocab")
        print("Created collection named imp_vocab")

    print("MongoDB connection initialized")

if __name__ == "__main__":
    initialize_db()