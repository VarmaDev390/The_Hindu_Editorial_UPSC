import requests
from bs4 import BeautifulSoup
import re
from nltk.corpus import words as nltk_words
# from Llm_API.openAi import summarize_article
from Llm_API.bart import summarize_article
from flask import jsonify
import feedparser
from database import get_common_words
from datetime import datetime, timezone
from dateutil import parser, tz
from dotenv import load_dotenv
import os


# Load environment variables from .env file
load_dotenv()


# Download the NLTK words dataset (you only need to do this once)
import nltk
nltk.download('words')



# Get the set of English words
english_words = set(nltk_words.words())
def extract_difficult_vocabulary(text):
    # Tokenize and clean the text
    words = re.findall(r'\b\w+\b', text.lower())
    
    # Filter out common words and consider words only in English dictionary
    common_words= get_common_words()
    difficult_words = [word for word in words 
                       if word not in common_words 
                       and word in english_words 
                       and len(word) > 4]  # Example: only consider words longer than 4 characters
    
    # Get the unique difficult words
    unique_difficult_words = set(difficult_words)
    
    return list(unique_difficult_words)

def fetch_full_article_content(url):
    """Fetch the full article content from a URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Find the div with the main article content
        # this is especially for hindu newspaper {"class": "articlebodycontent", "itemprop": "articleBody"}
        content_div = soup.find("div", {"class": "articlebodycontent", "itemprop": "articleBody"})
        if not content_div:
            return "Full article content not available."
        
        # Extract all paragraphs within this div
        # recursive=False wont check for p in nested div
        paragraphs = content_div.find_all("p",recursive=False)
        
        # Join all paragraph texts into a single content string
        full_content = " ".join(paragraph.get_text() for paragraph in paragraphs)
        return full_content
    except Exception as e:
        print(f"Error fetching article content from {url}: {e}")
        return "Full article content not available."

def parse_date(date):
    "for converting published date(string format) from hindu(ist) to utc"
    date = parser.parse(date)
    # print("date", date)

    # covnert to utc
    date_utc = date.astimezone(timezone.utc)
    # print("date_utc", date_utc)
    return date_utc

def convert_ist_to_utc(ist_date):
    "for converting date(date time format) to utc"
    # Define the IST timezone
    ist_zone = tz.gettz("Asia/Kolkata")
    utc_zone = tz.UTC

    # Assign IST timezone to the provided date
    local_date = ist_date.replace(tzinfo=ist_zone)

    # Convert to UTC
    utc_date = local_date.astimezone(utc_zone)
    return utc_date


def convert_utc_to_ist(utc_datetime):
    ist_zone = tz.gettz('Asia/Kolkata')
    return utc_datetime.astimezone(ist_zone).isoformat()

# def fetch_articles(date_str_IST, limit=None):
#     print("fetch articles from rss")
#     # Parse the RSS feed
#     feedURL = os.getenv("RSS_FEED_URL")
#     feed = feedparser.parse(feedURL)
#     articles = []

#     # Parse the provided date string in IST and convert to UTC datetime
#     datetime_UTC = parse_date(date_str_IST)
#     print("datetime_UTC",datetime_UTC)

#     # Extract relevant details from each entry
#     for entry in feed.entries:
#         publish_datetime_UTC = parse_date(entry.published)
#         # print("publish_datetime_UTC",publish_datetime_UTC)

#         # Compare the parsed dates, both in UTC
#         if publish_datetime_UTC.date() == datetime_UTC.date():
#             article_content = fetch_full_article_content(entry.link)
#             article_summary = summarize_article(article_content)
#             article_vocabulary = extract_difficult_vocabulary(article_content)
#             # ... rest of your article processing code ...
#             article = {
#                 "title": entry.title,
#                 "link": entry.link,
#                 "description": entry.description,
#                 "full_content": article_content,
#                 "summary" : article_summary,
#                 "published_date": publish_datetime_UTC,
#                 "is_read" : False,
#                 "article_id": entry.guid,
#                 "Vocabulary": article_vocabulary
#             }
#             articles.append(article)

#     return articles

def fetch_articles_metadata(date_str_IST):
    """
    Fetch metadata of articles from RSS feed for the given date.
    """
    print("Fetching article metadata from RSS feed")
    feedURL = os.getenv("RSS_FEED_URL")
    feed = feedparser.parse(feedURL)
    metadata = []

    # Parse the provided date string in IST and convert to UTC datetime
    datetime_UTC = parse_date(date_str_IST)

    for entry in feed.entries:
        publish_datetime_UTC = parse_date(entry.published)
        if publish_datetime_UTC.date() == datetime_UTC.date():
            metadata.append({
                "title": entry.title,
                "link": entry.link,
                "published_date": publish_datetime_UTC,
                "article_id": entry.guid,
            })

    return metadata


def process_new_articles(new_articles_metadata):
    """
    Process new articles by fetching content, summarizing, and extracting vocabulary.
    """
    processed_articles = []
    for article_meta in new_articles_metadata:
        article_content = fetch_full_article_content(article_meta["link"])
        article_summary = summarize_article(article_content)
        article_vocabulary = extract_difficult_vocabulary(article_content)

        processed_article = {
            "title": article_meta["title"],
            "link": article_meta["link"],
            "full_content": article_content,
            "summary": article_summary,
            "published_date": article_meta["published_date"],
            "is_read": False,
            "article_id": article_meta["article_id"],
            "Vocabulary": article_vocabulary,
        }
        processed_articles.append(processed_article)

    return processed_articles
