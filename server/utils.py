import requests
from bs4 import BeautifulSoup
import re
from nltk.corpus import words as nltk_words
# from Llm_API.openAi import summarize_article
from Llm_API.bart import summarize_article

# Download the NLTK words dataset (you only need to do this once)
import nltk
nltk.download('words')

common_words = set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", 
    "you", "he", "with", "on", "do", "at", "by", "this", "but", "from", 
    "not", "or", "which", "all", "she", "an", "they", "my", "one", "if"
    # Add more common words...
])

# Get the set of English words
english_words = set(nltk_words.words())
def extract_difficult_vocabulary(text):
    # Tokenize and clean the text
    words = re.findall(r'\b\w+\b', text.lower())
    
    # Filter out common words and consider words only in English dictionary
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

    
def fetch_articles(limit=None):
    # Parse the RSS feed
    feed = feedparser.parse(RSS_FEED_URL)
    articles = []
    
    # Extract relevant details from each entry
    for entry in feed.entries[:limit]:
        print("ENtry", jsonify(entry))
        article_content = fetch_full_article_content(entry.link)
        article = {
            "title": entry.title,
            "link": entry.link,
            "description": entry.description,
            "full_content": article_content,
            "summary" : summarize_article(article_content),
            
        }
        articles.append(article)
    
    return articles