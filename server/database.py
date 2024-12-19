
from init_db import db, articles_collection, common_words_collection, Important_words_collection, users_collection
from bson import ObjectId
from datetime import datetime,timedelta, timezone
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

def get_all_articles_by_date(datetime_in_IST, userId):
    print("get all articles from database")

    #moved import inside as database and utils are causing cirucular imports
    from utils import convert_ist_to_utc, parse_date, extract_difficult_vocabulary

    # print("parsed date_in_ist in get_all_articles_by_date", parse_date(date_in_ist))

    try:
        # Convert the start and end of the provided date from IST to UTC
        # start_date_IST = This creates a datetime object representing the start of the day in IST. 
        # date_in_ist = 11/16/2024 16:30 -- start_date_IST = 16/11/2024 00:00 (midnight)

        # start_datetime_IST = datetime.combine(datetime_in_IST, datetime.min.time())
        # end_datetime_IST = start_datetime_IST + timedelta(days=1)
        # # start_date_IST is converted to UTC
        # # start_date_UTC = 15/11/2024 18:30
        # # format 2024-11-15 18:30:00+00:00
        # # end_date_UTC = 16/11/2024 18:30
        # start_datetime_UTC = convert_ist_to_utc(start_datetime_IST)
        # end_datetime_UTC = convert_ist_to_utc(end_datetime_IST)

        start_datetime_IST = datetime.combine(datetime_in_IST, datetime.min.time()).replace(tzinfo=tz.gettz("Asia/Kolkata"))
        end_datetime_IST = start_datetime_IST + timedelta(days=1)

# Convert to UTC
        start_datetime_UTC = start_datetime_IST.astimezone(timezone.utc)
        end_datetime_UTC = end_datetime_IST.astimezone(timezone.utc)


        # Query articles in the UTC range for the specified date
        articles = list(articles_collection.find({
            "published_date": {"$gte": start_datetime_UTC, "$lt": end_datetime_UTC}
        }, {"_id": 0}))

        for article in articles:
            article['published_date'] = article['published_date'].replace(tzinfo=timezone.utc)
            article['Vocabulary'] = extract_difficult_vocabulary(article['full_content'], userId)

        print(f"Fetched {len(articles)} articles for date {datetime_in_IST}")
        return articles
    except Exception as e:
        print(f"Error fetching articles by date: {e}")
        return []

# def get_all_articles_by_date(datetime_in_IST, userId):
#     IST = timezone("Asia/Kolkata")
#     UTC = timezone("UTC")

#     start_datetime_IST = datetime.combine(datetime_in_IST, datetime.min.time())
#     end_datetime_IST = start_datetime_IST + timedelta(days=1)

#     start_datetime_UTC = IST.localize(start_datetime_IST).astimezone(UTC)
#     end_datetime_UTC = IST.localize(end_datetime_IST).astimezone(UTC)

#     articles = list(articles_collection.find({
#         "published_date": {"$gte": start_datetime_UTC, "$lt": end_datetime_UTC}
#     }, {"_id": 0}))

#     for article in articles:
#         article["published_date"] = article["published_date"].replace(tzinfo=timezone.utc)
#     return articles


def get_article_by_id(article_id, userId) :
    from utils import extract_difficult_vocabulary

    try:
        article = articles_collection.find_one({"article_id":article_id}, {"_id": 0})
        article_vocabulary = extract_difficult_vocabulary(article['full_content'], userId)
        article['Vocabulary'] = article_vocabulary
        print(f"Fetched article by {article}")
        return article
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []

def add_user(userId, password):
    try:
        user_entry = users_collection.insert_one({ "userId": userId, "password": password }, {"_id": 0} )
        return { "userId": userId, "password": password }
    except Exception as e:
        print(f"Error adding user to database: {e}")
        return []  

def delete_user(userId):
    try:
        users_collection.delete_one({ "userId": userId } )
        Important_words_collection.delete_one({ "userId": userId } )
        common_words_collection.delete_one({ "userId": userId } )
        return { "userId": userId }
    except Exception as e:
        print(f"Error deleting user from database: {e}")
        return [] 
    
def get_users():
    try:
        users_cursor = users_collection.find({}, {"userId": 1, "_id": 0})  # Only return userId field, exclude _id
        userIds = []
        for userData in users_cursor:
            userIds.append(userData["userId"])
        
        return userIds
    except Exception as e:
        print(f"Error fetching users from database: {e}")
        return []      

def get_common_words(userId):
    try:
        common_words_entry = common_words_collection.find_one({"userId": userId}, {"_id": 0, "words": 1})
        # "words": 1 = wont inlcude _id field in the data and include only words data
        if common_words_entry and "words" in common_words_entry:
            return common_words_entry["words"]
        else:
            print("No common words found in the collection.")
            return []
    except Exception as e:
        print(f"Error fetching common words: {e}")
        return []

def get_saved_words(userId):
    try:
        important_words_entry = Important_words_collection.find_one({"userId": userId}, {"_id": 0, "vocab":1 })
        # "words": 1 = wont inlcude _id field in the data and include only words data
        print("impoeran vocab",important_words_entry )
        if important_words_entry and "vocab" in important_words_entry:
            return important_words_entry["vocab"]
        else:
            print("No Important vocab found in the collection.")
            return []
    except Exception as e:
        print(f"Error fetching Important vocab: {e}")
        return []
    
def add_common_word(new_word, userId):
    try:
        # Update the document where userId matches, add the new_word to the words array
        result = common_words_collection.update_one(
            {"userId": userId},  # Match the userId
            {"$addToSet": {"words": new_word}},  # Add word only if it doesn't already exist
            upsert=True  # Insert document if it doesn't exist
        )
        
        if result.modified_count > 0:
            print("Word added successfully.")
        elif result.upserted_id:
            print("New user document created and word added.")
        else:
            print("No changes made (word may already exist).")
    except Exception as e:
        print(f"Error updating common words: {e}")


        # Initial Data
initial_common_words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", 
    "you", "he", "with", "on", "do", "at", "by", "this", "but", "from", 
    "not", "or", "which", "all", "she", "an", "they", "my", "one", "if"
    # Add more common words as needed...
]

def initiate_user_common_word(userId):
    try:
        common_words_collection.insert_one({"words": initial_common_words, "userId": userId})
        print("Common words updated successfully.")
    except Exception as e:
        print(f"Error updating common words: {e}")


# def add_imp_word(word, meaning):
#     print("word",word)
#     try:
#         # Ensure unique words in the imp_vocab array
#         common_words_collection.create_index([("imp_vocab.word", 1)], unique=True)

#         common_words_collection.update_one(
#             {},
#             {"$addToSet": {"imp_vocab": {"word": word, "meaning": meaning}}},
#             upsert=True
#         )

#         print("Important vocab updated successfully.")
#     except Exception as e:
#         if "E11000 duplicate key error collection" in str(e):
#             print("Word already exists in the imp_vocab")
#         else:
#             print(f"Error updating Important vocab: {e}")

def add_imp_word(userId, word, meaning):
    print("database Logger: Inside add_imp_word")

    try:
        # Check if the word already exists for the specific user
        existing_word = Important_words_collection.find_one({"userId": userId, "vocab.word": word})

        if existing_word:
            print("Word already exists in the user's vocabulary")
            return

        # Add the word if it doesn't exist
        Important_words_collection.update_one(
            {"userId": userId},
            {"$addToSet": {"vocab": {"word": word, "meaning": meaning}}},
            upsert=True
        )

        print("Important vocab updated successfully.")
    except Exception as e:
        print(f"Error updating Important vocab: {e}")

def del_vocab_from_article(word, article_id, userId):
    try:
        article = articles_collection.find_one({"article_id": article_id})

        if article:
            # Filter the vocabulary array to remove the specified word
            new_vocabulary = []
            for w in article['Vocabulary']:
                if w != word:
                    new_vocabulary.append(w)
            
            # Update the article with the new vocabulary array
            articles_collection.update_one(
                {"article_id": article_id},
                {"$set": {"Vocabulary": new_vocabulary}}
            )
            print("Vocabulary word deleted successfully.")
        else:
            print("Article not found.")

    except Exception as e:
        print(f"Error deleting vocabulary word: {e}")

def mark_article(article_id):
    try:
        article = articles_collection.update_one({"article_id": article_id},{"$set": {"is_read": True}})
        print("Updated article successfully.")

        return article
    
    except Exception as e:
        print(f"Error marking the article as read")

def delete_all_articles():
    try:
        result = articles_collection.delete_many({})
        print(f"Deleted {result.deleted_count} articles from the collection.")
    except Exception as e:
        print(f"Error deleting articles: {e}")