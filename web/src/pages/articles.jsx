import React,{ useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Layout from '../components/layout';
import { Typography, Grid2 } from '@mui/material';
import ArticleCard from '../components/articleCard';
import { ContextApp } from '../utils/context';

const ArticlesPage = () => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currDate} = useContext(ContextApp)
  // console.log("url", currDate)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state

      try {
        const response = await axios.get(
          `${import.meta.env.BACKEND_URL}/get-articles`,
          { params: { date: currDate.format('YYYY-MM-DD') } } // Add currDate as query parameter
        );
        setArticles(response.data.articles);
        console.log("response.data",response.data.articles)
      } catch (err) {
        console.error(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false); // Set loading state to false after fetching or error
      }
    };

    fetchData();
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
