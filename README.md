# Editorial

## Overview
This project is a complete solution for managing articles, users, and vocabulary learning. It includes a backend API built with Flask and MongoDB and a frontend application built with React.js. 

## Features
### Backend Features
- Fetches articles from an RSS feed based on a user-provided date.
- Filters out duplicate articles before inserting them into the database.
- Summarizes articles and extracts vocabulary for learning purposes.
- Manages users with unique userIds and associates articles with users.
- Provides RESTful APIs to interact with articles and user data.

### Frontend Features
- **Vocabulary Management**: View saved vocabulary with their meanings and delete unnecessary words to avoid future filtering.
- **Article Filtering**: Filter articles by date for easier navigation.
- **User Management**: Create, delete, and log in/out of user accounts.
- **Responsive Design**: Fully mobile-friendly design for seamless use across devices.

## Technologies Used
### Backend
- Python (Flask for backend API)
- MongoDB (Database)
- RSS Feed Parsing (feedparser library)
- Environment Management (dotenv for environment variables)

### Frontend
- React.js (Frontend framework)
- useContext (State management)
- Axios (HTTP client for API calls)
- Material-UI (UI framework)
- React Router (For client-side routing)

## Getting Started
### Backend Setup
1. Clone the repository:
```
git clone https://github.com/VarmaDev390/The_Hindu_Editorial_UPSC.git
cd The_Hindu_Editorial_UPSC/server
```

2. Install dependencies
```
pip install -r requirements.txt
```

3. Set up environment variables: Create a .env file and add:
```
API_TOKEN=
BART_MODEL_URL=
MERRIAM_WEBSTER_API_KEY=
MERRIAM_WEBSTER_URL=
MONGODB_URI=
RSS_FEED_URL=
```

4. Initialize the database: Run the setup script to create necessary collections:
```
python init_db.py
```

5. Start the backend server:
```
python main.py
```

### Frontend Setup
1. Navigate to the frontend directory:
```
cd ../web
```

2. Install dependencies:
```
npm install
```

3. Start the frontend server:
```
npm start
```

## Project Structure
### Backend
```
server/
├── Llm_API.py                # Main application file
    ── bart.py
    ── openAi.py
├── config.py
├── database.py
├── init_db.py          # intial database setup
├── main.py               # Main application file
├── requirments.txt      # Python dependencies
├── routes.py            # API route handlers
├── utils.py             # Helper functions for processing articles and vocabulary
└── .env                  # Environment variables
```

### Frontend


## Key Features in Action
1. Vocabulary Management
- View saved vocabulary along with their meanings.
- Delete common or known words to prevent future filtering.

2. Article Filtering
- Easily filter articles based on their publishing date.

3. User Management
- Log in, log out, create, and delete user accounts.

4. Responsive Design
- Fully mobile-friendly interface for seamless use on smartphones and tablets.

## Future Enhancements
- Implement notifications for new articles or vocabulary.
- Add OAuth or third-party authentication support.
- Improve database schema for scalability and performance

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
