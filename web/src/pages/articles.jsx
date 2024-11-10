import React,{ useState, useEffect} from 'react'
import axios from 'axios'

const ArticlesPage = () => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("url", import.meta.env.VITE_BACKEND_URL)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch-articles`)
      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load articles");
        setLoading(false);
      });
  }, []);

    return (
        <div>
        <h1>Articles</h1>
        {loading && <p>Loading articles...</p>}
        {error && <p>{error}</p>}
        <ul>
          {articles.map((article, index) => (
            <li key={index}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <a href={`/article/${index}`}>Read more</a>
            </li>
          ))}
        </ul>
      </div>
    // <>Ravi</>
    )
}

export default ArticlesPage