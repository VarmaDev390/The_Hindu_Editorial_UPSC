
from flask import Flask
from routes import routes
from init_db import initialize_db    # Ensure MongoDB connection is initialized
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Register routes blueprint
app.register_blueprint(routes)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
CORS(app, resources={r"/*": {"origins": allowed_origins}})

CORS(app, origins="http://localhost:5173")


if __name__ == "__main__":
    print("Connecting to MongoDB...")
    initialize_db()  # Initialize the DB
    app.run(debug=True)
