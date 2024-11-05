import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")


def summarize_article(content):
    """Summarize the full article content using an LLM."""
    try:
        # Call the OpenAI API to summarize content
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes news articles."},
                {"role": "user", "content": f"Summarize this article in a few sentences:\n\n{content}"}
            ],
            max_tokens=150  # Adjust the token limit based on the length of the desired summary
        )

        summary = response.choices[0].message.content.strip()
        print(summary)
        return summary

    except Exception as e:
        print(f"Error during summarization: {e}")
        return "Summary not available."