import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid2, Box, Paper, Button, Pagination , useTheme, useMediaQuery} from '@mui/material';
import Layout from '../components/layout';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../utils/helper';
import VocabCard from '../components/vocabCard';
import Stack from '@mui/material/Stack';
import VocabChip from '../components/vocabChip';
import { ContextApp } from '../utils/context';
import { useNavigate } from 'react-router-dom';


const ArticleDetailPage = () => {
  // Extracting title, summary, and full content from props
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article)
  // console.log("article",article)

  // const { title, summary, full_content, published_date, Vocabulary, article_id } = location.state?.article;
  const {  userId, articles, setArticles} = useContext(ContextApp)
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
const navigate = useNavigate()


// Check if the screen is at least `sm` (small screen) or `md` (medium screen)
const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Small or below (xs)
const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // sm to md

// Dynamically adjust itemsPerPage based on screen size
const itemsPerPage = isSmallScreen ? 15 : isMediumScreen ? 25 : 35; 


  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Paginate the Vocabulary array
  const paginatedVocabulary = article.Vocabulary.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!userId) {
      navigate('/')
      window.location.reload()
      
    }
  },[userId])
  

  const handleDelete = async (word) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-vocab`, {
        word: word,
        articleId: article.article_id, 
        userId: userId 
      });
  
      // console.log("response", response.data);
      setArticle(response.data.article);

      // Update the articles array in the context
      setArticles((prevArticles) =>
        prevArticles.map((art) =>
          art.article_id === response.data.article.article_id ? response.data.article : art
        )
      );
  
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
    // console.log("word", word, meaning)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-vocab`, {
        word,
        meaning, // Include meaning if required by your backend
        userId: userId 
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
      <Grid2 container justifyContent="space-between"  spacing={2} sx={{mb:2}}>
        <Grid2  size={{ xs: 12, sm:12, md: 6 }}>
          {/* <Paper  sx={{ padding: 3 }}> */}
            <Typography variant="h4" gutterBottom align="center" sx={{color:"#ffffff"}}>
              {article.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" sx={{color:"#ffffff"}}>
              Published on: {formatDate(article.published_date)}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom sx={{color:"#ffffff"}}>
                Summary
              </Typography>
              <Typography variant="body1"sx={{color:"#ffffff"}} >
                {article.summary}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom sx={{color:"#ffffff"}}>
                Full Content
              </Typography>
              <Typography variant="body1" sx={{color:"#ffffff"}}>
                {article.full_content}
              </Typography>
            </Box>
          {/* </Paper> */}
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{color:"#ffffff"}}>
          Important Vocabulary
        </Typography>
        <Paper sx={{ padding: 2, marginBottom: 2, backgroundColor: "inherit" }}>
            <Grid2 container spacing={2} justifyContent="center">
              {paginatedVocabulary.map((word, index) => (
                <Grid2 sx={{xs:12, sm:4}} key={index}>
                  <VocabChip
                    word={word}
                    onDelete={() => handleDelete(word)}
                    onSave={() => handleSave(word)}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Paper>

          {/* Pagination Component */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb:2 }}>
            <Pagination
              count={Math.ceil(article.Vocabulary.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
              }}
            />
          </Box>
      </Grid2>
      </Grid2>
    </Layout>
  );
};

export default ArticleDetailPage;
