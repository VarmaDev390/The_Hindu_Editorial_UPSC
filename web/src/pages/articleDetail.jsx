import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid2, Box, Paper, Button } from '@mui/material';
import Layout from '../components/layout';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ArticleDetailPage = () => {
  // Extracting title, summary, and full content from props
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article)
  // const { title, summary, full_content, published_date, Vocabulary, article_id } = location.state?.article;
  const { enqueueSnackbar } = useSnackbar();


  const handleDelete = async (word) => {
    try {
      const response = await axios.post(`${import.meta.env.BACKEND_URL}/delete-vocab`, {
        word: word,
        articleId: article.article_id
      });
  
      console.log("response", response.data);
      setArticle(response.data.article);
  
      if (response.status !== 200) {
        throw new Error('Failed to delete vocabulary word');
      }
  
      enqueueSnackbar(`Successfully deleted "${word}"`, { variant: 'success' }); 
  
      // Update Vocabulary state if needed (depending on your app setup)
  
    } catch (error) {
      enqueueSnackbar(`Error deleting "${word}": ${error.message}`, { variant: 'error' });
      console.error('Error deleting vocabulary word:', error);
    }
  };

  const handleSave = async (word, meaning = '') => {
    console.log("word", word, meaning)
    try {
      const response = await axios.post(`${import.meta.env.BACKEND_URL}/add-vocab`, {
        word,
        meaning, // Include meaning if required by your backend
      });
  
      enqueueSnackbar('Word added successfully!', { variant: 'success' });
    } catch (error) {
      const message = error.response?.data?.error || 'An error occurred while adding the vocabulary.';
      enqueueSnackbar(message, { variant: 'error' });
      console.error('Error adding vocabulary:', error);
    }
  };

  return (
    <Layout>
      <Grid2 container justifyContent="space-between"  spacing={2}>
        <Grid2  size={{ xs: 12, sm:8, md: 6 }}>
          {/* <Paper  sx={{ padding: 3 }}> */}
            <Typography variant="h4" gutterBottom align="center">
              {article.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" >
              Published on: {article.published_date}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1" >
                {article.summary}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Full Content
              </Typography>
              <Typography variant="body1" >
                {article.full_content}
              </Typography>
            </Box>
          {/* </Paper> */}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 8, md: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Important Vocabulary
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          {article.Vocabulary.map((word, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <Typography variant="body1" mr={1}>
                {word}
              </Typography>
              <Button variant="text" size="small" color="error" onClick={() => handleDelete(word)}>
                Delete
              </Button>
              <Button variant="text" size="small" color="primary" onClick={() => handleSave(word)}>
                Save
              </Button>
            </Box>
          ))}
        </Box>
      </Grid2>
      </Grid2>
    </Layout>
  );
};

export default ArticleDetailPage;
