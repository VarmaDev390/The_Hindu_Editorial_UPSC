from dotenv import load_dotenv
import os
import requests

# Load environment variables from .env file
load_dotenv()

hugging_face_api_key = os.getenv("API_TOKEN")
bart_url = os.getenv("BART_MODEL_URL")


def summarize_article(content):
    """Summarize the full article content using an LLM."""
        # Call the OpenAI API to summarize content
    headers = {
        "Authorization": f"Bearer {hugging_face_api_key}",
        "Content-Type": "application/json"
        }
            
    # Prepare the payload for the request
    payload = {
        "inputs": f"summarize: {content}",
        }
    
    # Make a POST request to the Hugging Face API
    response = requests.post(bart_url, headers=headers, json=payload)

    # print(response.json())

    # Check the response
    if response.status_code == 200:
        # If the request was successful, get the summary from the response
        summary = response.json()[0]['summary_text']
        # print("Summary:", summary)
        return summary
    else:
        # Handle any errors
        print("Error:", response.status_code, response)
        return "Summary not available."