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

## Screenshots

1. Articles  
   ![articles](https://github.com/user-attachments/assets/db1eb4c6-3916-4966-a3e9-f9dcf431b95d)

2. Individual Article  
   ![article details](https://github.com/user-attachments/assets/251b0f66-eb4f-46ce-9d77-c23ae0df9da5)

3. Saved Vocab  
   ![saved vocab](https://github.com/user-attachments/assets/9efa4586-7928-4552-95d3-34433cf8181d)

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

---

## Getting Started

### Backend Setup (Manual)

1. Clone the repository:
   ```sh
   git clone https://github.com/VarmaDev390/The_Hindu_Editorial_UPSC.git
   cd The_Hindu_Editorial_UPSC/server
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Set up environment variables: Create a `.env` file and add:
   ```
   API_TOKEN=
   BART_MODEL_URL=
   MERRIAM_WEBSTER_API_KEY=
   MERRIAM_WEBSTER_URL=
   MONGODB_URI=
   RSS_FEED_URL=
   ```
4. Initialize the database:
   ```sh
   python init_db.py
   ```
5. Start the backend server:
   ```sh
   python main.py
   ```

### Frontend Setup (Manual)

1. Navigate to the frontend directory:
   ```sh
   cd ../web
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```

---

## Docker Implementation

### Local Development with Docker Compose

You can run both backend and frontend using Docker Compose for a consistent local environment.

#### **1. Prerequisites**

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) installed.

#### **2. Environment Variables**

- Copy `.env.example` to `.env` in both `server/` and `web/` directories and fill in the required values.

#### **3. Build and Start Services**

From the project root:

```sh
docker compose build
docker compose up
```

- The backend will be available at [http://localhost:5000](http://localhost:5000)
- The frontend will be available at [http://localhost:8080](http://localhost:8080)

#### **4. Database Initialization and Prefetch Scripts**

To initialize the database and prefetch articles, run:

```sh
docker compose run --rm server python init_db.py
docker compose run --rm server python prefetch_articles.py
```

#### **5. Stopping Services**

```sh
docker compose down
```

#### **Notes**

- For local development, you may want to run the frontend directly with `npm run dev` for hot-reloading.
- The Docker setup is optimized for production-like environments; for rapid frontend development, use the manual setup above.

---

## Project Structure

### Backend

```
server/
├── Llm_API.py                # Main application file
├── bart.py
├── openAi.py
├── config.py
├── database.py
├── init_db.py                # Initial database setup
├── main.py                   # Main application file
├── requirements.txt          # Python dependencies
├── routes.py                 # API route handlers
├── utils.py                  # Helper functions for processing articles and vocabulary
└── .env                      # Environment variables
```

### Frontend

```
web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── ...
├── public/
├── package.json
├── vite.config.js
└── .env
```

---

## Key Features in Action

1. **Vocabulary Management**

   - View saved vocabulary along with their meanings.
   - Delete common or known words to prevent future filtering.

2. **Article Filtering**

   - Easily filter articles based on their publishing date.

3. **User Management**

   - Log in, log out, create, and delete user accounts.

4. **Responsive Design**
   - Fully mobile-friendly interface for seamless use on smartphones and tablets.

---

## Future Enhancements

- Implement notifications for new articles or vocabulary.
- Add OAuth or third-party authentication support.
- Improve database schema for scalability and performance.

---

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
