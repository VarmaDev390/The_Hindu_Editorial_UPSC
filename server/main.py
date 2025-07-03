
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

# local
# allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
# CORS(app, origins="http://localhost:5173")

# deployment
allowed_origins = os.getenv("ALLOWED_ORIGINS","http://localhost:5173/").split(",")
CORS(app, resources={r"/*": {"origins": "*"}})



if __name__ == "__main__":
    print("Connecting to MongoDB...")
    # cant be run as a corn job because of money constraint
    # initialize_db()  # Initialize the DB
    port = int(os.getenv("PORT", 5000))  # Default to 5000 if PORT is not set
    app.run(host='0.0.0.0', port=port, debug=True)
    # app.run(debug=True)
   
