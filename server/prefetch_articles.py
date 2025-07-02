from datetime import datetime
from utils import fetch_articles_metadata, process_new_articles
from database import get_all_articles_by_date, insert_article
from dotenv import load_dotenv
import os

feedURL = os.getenv("RSS_FEED_URL")

def prefetch_articles_for_date(date_str, userId):
    user_datetime_IST = datetime.strptime(date_str, "%Y-%m-%d")
    db_articles = get_all_articles_by_date(user_datetime_IST, userId)
    db_titles = set(article["title"] for article in db_articles)

    rss_metadata = fetch_articles_metadata(date_str, feedURL)
    new_articles_metadata = [a for a in rss_metadata if a["title"] not in db_titles]
    new_articles = process_new_articles(new_articles_metadata, userId)

    for article in new_articles:
        insert_article(article)

if __name__ == "__main__":
    # Example: prefetch for today for a default user
    today = datetime.now().strftime("%Y-%m-%d")
    prefetch_articles_for_date(today, userId="default_user")