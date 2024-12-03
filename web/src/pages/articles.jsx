import React,{ useState, useEffect, useContext, useRef} from 'react'
import axios from 'axios'
import Layout from '../components/layout';
import { Typography, Grid2 } from '@mui/material';
import ArticleCard from '../components/articleCard';
import { ContextApp } from '../utils/context';

const ArticlesPage = () => {
  const { currDate, articles, setArticles} = useContext(ContextApp)

  const [loading, setLoading] = useState(articles.length === 0 ? true: false);
  const [error, setError] = useState(null);
  // console.log("url", import.meta.env.VITE_BACKEND_URL)

  // const articlesCache = useRef({});

  useEffect(() => {
    // console.log("inside useEffect")
    // console.log(articles,"articles")

    const dateKey = currDate.format('YYYY-MM-DD');


    const fetchData = async () => {
      setLoading(true); // Set loading state
      // console.log("iside fetch");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-articles`,
          { params: { date: dateKey } } // Add currDate as query parameter
        );
        
        setArticles(response.data.articles);
        // console.log("response.data",response.data.articles)
      } catch (err) {
        console.error(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false); // Set loading state to false after fetching or error
      }
    };

    if (articles.length === 0) {
     fetchData();
      
    }
  }, [currDate]); 

  
    return (

<Layout>
  <Typography variant="h4" gutterBottom>
    Articles
  </Typography>
  
  {loading && (
    <Typography>Please wait, we are summarizing articles...</Typography>
  )}

  {!loading && error && (
    <Typography color="error">{error}</Typography>
  )}

  {!loading && !error && articles.length > 0 && (
    <Grid2 container spacing={3}>
      {articles.map((article, index) => (
        <Grid2 size={{ xs: 12, sm:6, md: 4 }} key={index}>
          <ArticleCard data={article} />
        </Grid2>
      ))}
    </Grid2>
  )}

  {!loading && !error && articles.length === 0 && (
    <Typography>No articles found for the selected date.</Typography>
  )}
</Layout>

    )
}

export default ArticlesPage
